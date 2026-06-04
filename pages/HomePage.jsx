// 뱅기노자 홈페이지 — 한국 여행·역사·문화 커뮤니티
// 데이터 원칙 (v00.046):
//   1. 모든 콘텐츠는 서버(D1) source-of-truth.
//      - sc.recommendations    → site_content_kv (관리자 콘텐츠 패널)
//      - publicColumns         → BGNJ_API.columns.list (D1.user_columns)
//      - tours / lectures      → BGNJ_API.tours/lectures.list
//      - recentPosts           → BGNJ_API.community.posts
//   2. BANGINOJA_DATA 정적 시드는 더 이상 참조하지 않는다.
//   3. 서버 응답이 비면 해당 섹션 자체를 렌더하지 않는다 (깡통 카드 금지).
//   4. 모든 헬퍼 호출은 BGNJ_GUARD.arr/.call 로 try/catch + 타입 가드 통과.


// 섹션 단위 에러 바운더리 — 한 섹션이 망가져도 다른 섹션은 정상 렌더.
class HomeSectionBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  componentDidCatch(err) {
    try { console.error('[HomeSectionBoundary]', this.props.label || 'section', err); } catch {}
    try {
      window.BGNJ_API?.errorLog?.report({
        code: 'HOME_SECTION_ERROR', status: null, kind: 'render',
        message: err?.message || String(err),
        hint: `section=${this.props.label || ''}`, url: '',
        pathname: location.pathname, origin: location.origin,
      })?.catch?.(() => {});
    } catch {}
  }
  render() {
    if (this.state.error) {
      // 무음 격리 — 사용자에게 빈 자리 대신 가벼운 placeholder 한 줄만 표기
      return (
        <section style={{padding:'24px 0', borderBottom:'1px solid var(--line)', textAlign:'center'}}>
          <p className="mono dim-2" style={{fontSize:11, letterSpacing:'0.18em'}}>
            ⚠ {this.props.label || '이 섹션'} 을 불러오지 못했습니다
          </p>
        </section>
      );
    }
    return this.props.children;
  }
}

// 추천 여행지 상세 모달 — 카드 클릭 시 더 큰 이미지 + 전체 설명 + 태그 + 투어 보기 CTA.
const RecommendationDetailModal = ({ rec, onClose, go }) => {
  // v00.077 — useModalGuard 통일 (ESC + body scroll lock + popstate). 읽기 전용 → dirty=false.
  window.useModalGuard?.({ open: true, dirty: false, onClose, onSaveDraft: null, label: rec?.name || '여행지 상세' });
  const tags = Array.isArray(rec.tags)
    ? rec.tags
    : (typeof rec.tags === 'string' ? rec.tags.split(/[,·]/).map((s) => s.trim()).filter(Boolean) : []);
  return (
    <div role="dialog" aria-modal="true" aria-label={`${rec.name || '추천'} 상세`}
      style={{
        position:'fixed', inset:0, zIndex:200,
        background:'rgba(15,23,42,0.55)',
        display:'grid', placeItems:'center', padding:20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background:'var(--bg)', maxWidth:720, width:'100%', maxHeight:'92vh',
        overflow:'auto', position:'relative',
        border:'1px solid var(--line)',
      }}>
        <button onClick={onClose} aria-label="닫기"
          style={{
            position:'absolute', top:14, right:14, zIndex:2,
            width:36, height:36, fontSize:24,
            background:'var(--bg-2)', border:'1px solid var(--line)', cursor:'pointer',
            color:'var(--ink)', lineHeight:1, fontWeight:600,
          }}>×</button>
        {rec.imageDataUri && (
          <div style={{
            width:'100%', height:280,
            background: `url(${rec.imageDataUri}) center/cover`,
            borderBottom:'1px solid var(--line)',
          }}/>
        )}
        <div style={{padding:'28px 28px 24px'}}>
          {rec.region && (
            <div style={{
              display:'inline-block', padding:'4px 10px',
              fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
              letterSpacing:'0.18em', color:'var(--ink-2)',
              border:'1px solid var(--line-2)', marginBottom:14,
            }}>{rec.region}</div>
          )}
          <h2 style={{
            fontFamily:'var(--font-serif)', fontSize:32, fontWeight:700,
            color:'var(--ink)', lineHeight:1.2, marginBottom:8,
          }}>{rec.name || '제목 없음'}</h2>
          {rec.subtitle && (
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:13, fontWeight:600,
              color:'var(--secondary)', letterSpacing:'0.04em', marginBottom:18,
            }}>{rec.subtitle}</div>
          )}
          {rec.desc && (
            <p style={{fontSize:15, lineHeight:1.85, color:'var(--ink-2)', marginBottom:22}}>{rec.desc}</p>
          )}
          {tags.length > 0 && (
            <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:22}}>
              {tags.map((t) => (
                <span key={t} className="badge" style={{fontSize:10}}>{t}</span>
              ))}
            </div>
          )}
          <div style={{display:'flex', gap:10, flexWrap:'wrap', borderTop:'1px solid var(--line)', paddingTop:18}}>
            <button className="btn btn-gold" onClick={() => { go('tour'); onClose(); }}>이 지역 투어 보기 →</button>
            <button className="btn" onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// v00.072 — 홈 카드의 description / note 를 짧게 자르는 헬퍼.
// 사용자 보고: "홈에 노출되는건 적당히 줄이거나 홈용으로 따로 글을 쓰게 해야지" — 우선 truncate.
// 줄바꿈은 공백으로 변환해 카드 레이아웃이 안정. 단어 경계에 맞춰 자른 뒤 "…" 첨부.
const truncatePreview = (text, max = 110) => {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  // 단어 경계까지 backtrack — 한글은 공백이 적어 backtrack 실패하면 그냥 자르기.
  const slice = s.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut + '…';
};

// v00.274 — 이벤트(강연/투어) 시작 시각 해석. starts_at(ISO) 우선, 없으면 next 텍스트
//   ("2026.05.15 10:00" 같은 사람이 입력한 일정) 를 파싱. 둘 다 없으면 NaN.
//   관리자가 starts_at 구조화 입력 없이 next 텍스트만 넣은 데이터에서도 예정/지난 판정이 동작.
const _eventTs = (x) => {
  if (!x) return NaN;
  if (x.startsAt) { const t = Date.parse(x.startsAt); if (!isNaN(t)) return t; }
  if (x.next) { const t = Date.parse(String(x.next).trim().replace(/\./g, '-')); if (!isNaN(t)) return t; }
  return NaN;
};

const HOME_TEXT_DEFAULT = {
  recEyebrow: '운영자가 다녀온 곳',
  recTitlePrefix: '요즘 ',
  recTitleAccent: '눈에 들어온',
  recTitleSuffix: ' 장소',
  recSubtitle: '직접 걷고 먹어본 뒤 다시 꺼내 보고 싶은 곳만 골랐습니다.',
  recAction: '전체 일정 →',
  tourEyebrow: '답사 일정',
  tourTitle: '이번에 함께 걸을 길',
  tourSubtitle: '큰 버스보다 작은 걸음에 맞춘 답사입니다. 장소의 내력과 오늘의 표정을 같이 봅니다.',
  tourAction: '전체 일정 →',
  tourNextLabel: '다음 일정',
  tourPriceLabel: '참가비',
  communityEyebrow: '커뮤니티',
  communityTitle: '다녀온 사람들의 기록',
  communitySubtitle: '좋았던 식당, 애매했던 동선, 다시 가고 싶은 골목까지 편하게 남겨주세요.',
  communityAction: '커뮤니티 가기 →',
  communityReplyLabel: '댓글',
  communityEmptyTitle: '첫 번째 여행 이야기를 써주세요',
  communityEmptySubtitle: '커뮤니티에 여행 경험을 나누면 더 많은 여행자들이 모여듭니다.',
  communityEmptyCta: '글 작성하기 →',
  columnEyebrow: '읽을거리',
  columnTitle: '길 위에서 이어지는 생각',
  columnSubtitle: '답사에서 시작해 책상 위로 돌아온 이야기들입니다.',
  columnAction: '칼럼 전체 보기 →',
  columnReadMore: '더 읽기 →',
  columnEmpty: '다음 칼럼 준비 중입니다.',
  lecturesEyebrow: '강연',
  lecturesTitle: '앉아서 먼저 떠나는 시간',
  lecturesAction: '전체 강연 보기 →',
  lectureBadge: '강연',
  heroRecentLectureLabel: '최근 강연',
  heroNextLectureLabel: '다음 강연',
  heroNextTourLabel: '다음 답사',
  heroNoLectureText: '예정된 강연이 아직 없습니다.',
  heroNoLectureCta: '전체 강연 보기 →',
  heroNoTourText: '예정된 답사가 아직 없습니다.',
  heroNoTourCta: '전체 답사 보기 →',
  venueFallback: '장소 미정',
  emptyFallback: '—',
  bookEyebrowPrefix: '뱅기노자 출판',
  bookBuyCta: '구매하기 →',
  bookKrLabel: '국문판',
  bookEnLabel: '영문판',
  bookAuthorSuffix: '지음',
};

const getHomeText = (sc) => ({ ...HOME_TEXT_DEFAULT, ...((sc && typeof sc.homeText === 'object') ? sc.homeText : {}) });

// v00.106 — 홈 히어로의 지도 자리. 다음 강연 + 다음 답사 미니 카드.
// 사용자 제안 A안: '강연/답사 미니 카드' (운영 가치 ↑, 재방문 가치 ↑).
const HeroProgramCards = ({ go, dataTick, text }) => {
  // v00.110 — module-scope 컴포넌트는 HomePage 의 `const G = window.BGNJ_GUARD;` 를 사용 못 함.
  // window.BGNJ_GUARD 를 직접 참조 + 안전한 폴백.
  const _arr = (fn) => {
    try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; }
  };
  // v00.115 — startsAt 가 invalid 한 row 가 sort 에 들어가면 결과 순서가 임의로 깨짐.
  // 한 번 더 Date.parse !isNaN 로 거른 뒤 sort.
  // v00.274 — 날짜는 starts_at 없으면 next 텍스트로 해석(_eventTs). 히어로는 '예정(미래)' 만 노출 —
  //   예정이 없으면 지난 일정을 '최근'으로 띄우지 않고 빈 상태("예정 없음")로 둔다 (사용자 요청).
  const _cutoff = Date.now() - 86400000;
  const _upcoming = (fn) => _arr(fn)
    .filter((x) => x && !x.hidden && !isNaN(_eventTs(x)) && _eventTs(x) >= _cutoff)
    .sort((a, b) => _eventTs(a) - _eventTs(b));
  const lectures = React.useMemo(() => _upcoming(() => window.BGNJ_LECTURES?.listAll?.()), [dataTick]);
  const tours = React.useMemo(() => _upcoming(() => window.BGNJ_TOURS?.listAll?.()), [dataTick]);

  const nextLecture = lectures[0];
  const nextTour = tours[0];

  // v00.110 — 시간 표시는 사이트 전반 KST 기준. BGNJ_FMT.kstFriendly 사용.
  const fmtDate = (iso) => {
    if (!iso) return '';
    if (window.BGNJ_FMT?.kstFriendly) return window.BGNJ_FMT.kstFriendly(iso);
    // 폴백 (BGNJ_FMT 미로드 시)
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    const dow = ['일','월','화','수','목','금','토'][d.getDay()];
    return `${d.getMonth()+1}.${pad(d.getDate())} (${dow}) ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div className="home-program-stack">
      {/* 다음 강연 카드 */}
      <article
        onClick={() => { if (nextLecture) go('lectures'); }}
        className="home-program-card"
        style={{cursor: nextLecture ? 'pointer' : 'default'}}
        role={nextLecture ? 'button' : undefined}
        tabIndex={nextLecture ? 0 : undefined}
        onKeyDown={(e) => { if (nextLecture && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go('lectures'); } }}>
        <div className="home-program-label">
          {text.heroNextLectureLabel}
        </div>
        {nextLecture ? (
          <>
            <h3 className="ko-serif" style={{fontSize:20, marginBottom:8, color:'var(--ink)'}}>{nextLecture.topic || nextLecture.title}</h3>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:10}}>
              <span className="gold-2 mono" style={{fontSize:13, fontWeight:600}}>{nextLecture.next || fmtDate(nextLecture.startsAt)}</span>
              <span className="dim-2" style={{fontSize:12}}>{nextLecture.venue || text.venueFallback}</span>
            </div>
          </>
        ) : (
          <p className="dim" style={{fontSize:13, lineHeight:1.7, margin:0}}>
            {text.heroNoLectureText} <button type="button" className="btn-ghost gold" onClick={(e) => { e.stopPropagation(); go('lectures'); }}>{text.heroNoLectureCta}</button>
          </p>
        )}
      </article>

      {/* 다음 답사 카드 */}
      <article
        onClick={() => { if (nextTour) go('tour'); }}
        className="home-program-card"
        style={{cursor: nextTour ? 'pointer' : 'default'}}
        role={nextTour ? 'button' : undefined}
        tabIndex={nextTour ? 0 : undefined}
        onKeyDown={(e) => { if (nextTour && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go('tour'); } }}>
        <div className="home-program-label">
          {text.heroNextTourLabel}
        </div>
        {nextTour ? (
          <>
            <h3 className="ko-serif" style={{fontSize:20, marginBottom:8, color:'var(--ink)'}}>{nextTour.title}</h3>
            {nextTour.subtitle && (
              <p className="dim-2" style={{fontSize:13, marginBottom:8, fontStyle:'italic'}}>{nextTour.subtitle}</p>
            )}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:10}}>
              <span className="gold-2 mono" style={{fontSize:13, fontWeight:600}}>{nextTour.next || fmtDate(nextTour.startsAt)}</span>
              <span className="dim-2" style={{fontSize:12}}>
                {nextTour.level && <span style={{marginRight:8}}>{nextTour.level}</span>}
                {nextTour.duration}
              </span>
            </div>
          </>
        ) : (
          <p className="dim" style={{fontSize:13, lineHeight:1.7, margin:0}}>
            {text.heroNoTourText} <button type="button" className="btn-ghost gold" onClick={(e) => { e.stopPropagation(); go('tour'); }}>{text.heroNoTourCta}</button>
          </p>
        )}
      </article>
    </div>
  );
};

// v00.152 — 홈 책 CTA 다권 카루셀. v00.151 단일-책 IIFE 를 컴포넌트화 + 좌우 무한 wrap + autoplay.
// 데이터 소스: BGNJ_BOOKS.list({status:'published'}). 정렬: primary 우선 → order. 0권이면 섹션 hide.
const BookCarouselSection = ({ go, dataTick, text }) => {
  const _arr = (fn) => { try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; } };
  // admin 의 책 변경을 새로고침 없이 즉시 반영. dataTick + bgnj-books-refresh 둘 다 청취.
  const [bookTick, setBookTick] = React.useState(0);
  React.useEffect(() => {
    const onR = () => setBookTick((v) => v + 1);
    window.addEventListener('bgnj-books-refresh', onR);
    return () => window.removeEventListener('bgnj-books-refresh', onR);
  }, []);
  const books = React.useMemo(() => {
    const all = _arr(() => window.BGNJ_BOOKS?.list?.({ status: 'published' }));
    return all.slice().sort((a, b) => {
      if (a.primary && !b.primary) return -1;
      if (!a.primary && b.primary) return 1;
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [dataTick, bookTick]);

  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  // 책 목록 길이 변동 시 idx 재정렬.
  React.useEffect(() => {
    if (books.length > 0 && idx >= books.length) setIdx(0);
  }, [books.length, idx]);

  const wrap = (n) => books.length === 0 ? 0 : (n + books.length) % books.length;
  const goPrev = () => setIdx((i) => wrap(i - 1));
  const goNext = () => setIdx((i) => wrap(i + 1));

  // autoplay 7s — 2권 이상 + hover 정지 아닐 때만.
  React.useEffect(() => {
    if (books.length < 2 || paused) return;
    const t = setTimeout(() => setIdx((i) => wrap(i + 1)), 7000);
    return () => clearTimeout(t);
  }, [idx, books.length, paused]);

  if (books.length === 0) return null;
  const showChrome = books.length > 1;

  // v00.162 — 단일 책 카드 렌더 (slide layer 안에서 호출).
  // v00.172 — 홈 CTA 본문은 site_content_kv.bookHomeIntros[id] 우선, 없으면 book.desc 폴백.
  const renderBookCard = (b) => {
    const hasPriceKR = Number(b.priceKR) > 0;
    const hasPriceEN = Number(b.priceEN) > 0;
    const yr = b.publishedAt ? new Date(b.publishedAt).getFullYear() : new Date().getFullYear();
    const homeIntros = (window.BGNJ_SITE_CONTENT?.get?.() || {}).bookHomeIntros || {};
    const homeIntro = homeIntros[b.id] || homeIntros[String(b.id)] || '';
    const introText = homeIntro || b.desc || '';
    return (
      <div className="cta-grid" style={{
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center',
      }}>
        <div>
          <div className="section-eyebrow">{text.bookEyebrowPrefix} · {yr}</div>
          <h2 style={{
            fontFamily:'var(--font-serif)', fontSize:'clamp(36px, 4vw, 52px)',
            fontWeight:600, lineHeight:1.1, marginBottom: b.subtitle ? 8 : 16,
          }}>
            『{b.title}』
          </h2>
          {/* v00.162 — 한 줄 소개 (subtitle). 사용자 요청 '한줄소개가 보이게'. */}
          {b.subtitle && (
            <p style={{
              fontFamily:'var(--font-serif)', fontSize:18, fontStyle:'italic',
              color:'var(--ink-2)', marginBottom:20, lineHeight:1.5,
            }}>
              {b.subtitle}
            </p>
          )}
          {introText && (
            <p style={{fontSize:15, lineHeight:1.85, color:'var(--ink-2)', marginBottom:28, whiteSpace:'pre-wrap', maxWidth:560}}>
              {introText}
            </p>
          )}
          {(hasPriceKR || hasPriceEN) && (
            <div style={{display:'flex', gap:20, marginBottom:32, alignItems:'flex-end'}}>
              {hasPriceKR && (
                <div>
                  <div className="mono" style={{fontSize:10, fontWeight:600, letterSpacing:'0.18em', color:'var(--ink-3)'}}>{text.bookKrLabel}</div>
                  <div className="ko-serif" style={{fontSize:22, marginTop:4, color:'var(--ink)', fontWeight:700}}>{window.BGNJ_FMT?.won?.(b.priceKR) ?? ''}</div>
                </div>
              )}
              {hasPriceKR && hasPriceEN && <div style={{width:1, background:'var(--line-2)', alignSelf:'stretch'}}/>}
              {hasPriceEN && (
                <div>
                  <div className="mono" style={{fontSize:10, fontWeight:600, letterSpacing:'0.18em', color:'var(--ink-3)'}}>{text.bookEnLabel}</div>
                  <div className="ko-serif" style={{fontSize:22, marginTop:4, color:'var(--ink)', fontWeight:700}}>{window.BGNJ_FMT?.won?.(b.priceEN) ?? ''}</div>
                </div>
              )}
            </div>
          )}
          <button className="btn btn-gold" onClick={() => go('book')}>{text.bookBuyCta}</button>
        </div>
        <div style={{
          aspectRatio:'3/4', maxWidth:280, margin:'0 auto',
          background:'var(--bg)', border:'1px solid var(--line-2)',
          display:'grid', placeItems:'center', overflow:'hidden',
        }}>
          {b.coverDataUri ? (
            <img src={b.coverDataUri} alt={`${b.title} 표지`}
              /* v00.262.004 — G2 cover→contain. 정사각/와이드 표지가 3:4 box 에서 잘리던 사고. */
              style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}}/>
          ) : (
            <div style={{textAlign:'center', padding:'0 24px'}}>
              <div style={{fontFamily:'var(--font-serif)', fontSize:28, color:'var(--ink)', marginBottom:10, fontWeight:600}}>{b.title}</div>
              <div style={{fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600, color:'var(--ink-3)', letterSpacing:'0.2em'}}>{b.author || '뱅기노자'} {text.bookAuthorSuffix}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <HomeSectionBoundary label="책 CTA"><section className="section section--anchor">
      <div className="container">
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{position:'relative'}}>
          {/* v00.162 — 슬라이드 레이어. 모든 books 를 layered 로 렌더, active 만 opacity 1 + translateX 0.
              jump 없는 부드러운 crossfade-slide. 첫 책만 relative 로 wrapper 높이 보존. */}
          <div style={{position:'relative'}}>
            {books.map((b, i) => {
              const active = i === idx;
              return (
                <div key={b.id || i}
                  aria-hidden={active ? undefined : 'true'}
                  style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    top: 0, left: 0, right: 0,
                    opacity: active ? 1 : 0,
                    transform: active
                      ? 'translateX(0)'
                      : (i < idx ? 'translateX(-24px)' : 'translateX(24px)'),
                    transition: 'opacity .55s ease, transform .55s ease',
                    pointerEvents: active ? 'auto' : 'none',
                  }}>
                  {renderBookCard(b)}
                </div>
              );
            })}
          </div>

          {showChrome && (
            <>
              <button type="button" aria-label="이전 책" onClick={goPrev}
                style={{
                  position:'absolute', left:-8, top:'50%', transform:'translate(-100%, -50%)',
                  width:44, height:44, borderRadius:'50%', border:'1px solid var(--line)',
                  background:'var(--bg)', color:'var(--ink)', cursor:'pointer',
                  display:'grid', placeItems:'center', fontSize:22, fontWeight:600, lineHeight:1,
                }}>‹</button>
              <button type="button" aria-label="다음 책" onClick={goNext}
                style={{
                  position:'absolute', right:-8, top:'50%', transform:'translate(100%, -50%)',
                  width:44, height:44, borderRadius:'50%', border:'1px solid var(--line)',
                  background:'var(--bg)', color:'var(--ink)', cursor:'pointer',
                  display:'grid', placeItems:'center', fontSize:22, fontWeight:600, lineHeight:1,
                }}>›</button>
            </>
          )}
        </div>

        {showChrome && (
          <div style={{display:'flex', justifyContent:'center', gap:8, marginTop:18}}>
            {books.map((b, i) => (
              <button key={b.id || i} type="button" aria-label={`${i+1}번째 책으로 이동`}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? 24 : 8, height: 8, padding: 0,
                  borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: i === idx ? 'var(--primary)' : 'var(--line-2)',
                  transition: 'all 0.2s',
                }}/>
            ))}
          </div>
        )}
      </div>
    </section></HomeSectionBoundary>
  );
};

const HomePage = ({ go }) => {
  const [scTick, setScTick] = React.useState(0);
  // v00.198 — 사용자 우선순위 '속도감 ↑ + 회귀 0'.
  // 이전엔 단일 dataTick 으로 4 종 stream(columns/tours/lectures/posts) 변경을 모두 한 state 에 합쳐
  // 어느 한 stream 만 갱신돼도 5개 useMemo + 정렬/필터 모두 재실행. 각 stream 별로 분리.
  const [columnsTick, setColumnsTick] = React.useState(0);
  const [toursTick, setToursTick] = React.useState(0);
  const [lecturesTick, setLecturesTick] = React.useState(0);
  const [postsTick, setPostsTick] = React.useState(0);
  // 호환용 — 기존 dataTick 참조 코드 유지 (하나라도 변경되면 max 가 증가).
  const dataTick = columnsTick + toursTick + lecturesTick + postsTick;

  // SEO/Hero/Brand refresh — 즉시 재렌더
  React.useEffect(() => {
    const onR = () => setScTick((v) => v + 1);
    window.addEventListener('bgnj-site-content-refresh', onR);
    return () => window.removeEventListener('bgnj-site-content-refresh', onR);
  }, []);

  // 서버 데이터 refresh 이벤트 — 실제 발화 이름과 일치 (data.js 참고).
  // bgnj-posts-refresh: 커뮤니티 게시글 / bgnj-columns-refresh: 칼럼 / bgnj-tours-refresh: 답사 / bgnj-lectures-refresh: 강연 / bgnj-site-content-refresh: 추천(이미 위에서 listen)
  React.useEffect(() => {
    // v00.198 — 각 event 가 자기 stream 의 tick 만 증가. 다른 stream 의 useMemo 는 재실행 안 함.
    const onColumns = () => setColumnsTick((v) => v + 1);
    const onTours = () => setToursTick((v) => v + 1);
    const onLectures = () => setLecturesTick((v) => v + 1);
    const onPosts = () => setPostsTick((v) => v + 1);
    window.addEventListener('bgnj-columns-refresh', onColumns);
    window.addEventListener('bgnj-tours-refresh', onTours);
    window.addEventListener('bgnj-lectures-refresh', onLectures);
    window.addEventListener('bgnj-posts-refresh', onPosts);
    return () => {
      window.removeEventListener('bgnj-columns-refresh', onColumns);
      window.removeEventListener('bgnj-tours-refresh', onTours);
      window.removeEventListener('bgnj-lectures-refresh', onLectures);
      window.removeEventListener('bgnj-posts-refresh', onPosts);
    };
  }, []);

  const sc = React.useMemo(() => (window.BGNJ_SITE_CONTENT?.get?.() || {}), [scTick]);
  const hero = sc.hero || {};
  const homeText = React.useMemo(() => getHomeText(sc), [sc]);
  // 모바일 분기 — matchMedia 변경 시 자동 재렌더 (heroStyle 도 갱신).
  const [isMobile, setIsMobile] = React.useState(() => {
    try { return !!(window.matchMedia && window.matchMedia('(max-width: 600px)').matches); } catch { return false; }
  });
  React.useEffect(() => {
    try {
      const mq = window.matchMedia('(max-width: 600px)');
      const handler = (e) => setIsMobile(e.matches);
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else if (mq.addListener) mq.addListener(handler);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', handler);
        else if (mq.removeListener) mq.removeListener(handler);
      };
    } catch {}
  }, []);
  const heroStyle = React.useMemo(
    () => (window.BGNJ_HERO_STYLE?.(isMobile ? 'mobile' : 'desktop') || window.BGNJ_HERO_STYLE_DEFAULT),
    [scTick, isMobile]
  );
  const recommendations = Array.isArray(sc.recommendations) ? sc.recommendations.filter(Boolean) : [];
  const [recDetail, setRecDetail] = React.useState(null);

  // 실데이터만 — 시드 폴백 제거. 모든 헬퍼 호출은 BGNJ_GUARD.arr 로 try/catch + Array 가드.
  // v00.115 — BGNJ_GUARD 미로드 (script 로드 race) 시 인라인 fallback 으로 페이지 깨짐 방지.
  const G = window.BGNJ_GUARD || {
    arr: (fn) => { try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; } },
    call: (fn, fb) => { try { const v = fn(); return v === undefined ? fb : v; } catch { return fb; } },
  };
  // v00.198 — 각 memo 는 자기 stream 의 tick 만 의존 → 무관 stream 갱신 시 재실행 차단.
  const publicColumns = React.useMemo(() => G.arr(() => window.BGNJ_COLUMNS?.listPublic?.()), [columnsTick]);
  // v00.240 — 사용자 요청: 좌측 큰 메인 칼럼은 최근 5개 칼럼 사이 자동 순환.
  // recentFive = publicColumns 0~4. featuredIdx 가 5초마다 (idx+1)%length.
  // pause 가능 (hover / focus). 인디케이터(점 5개) 클릭으로 수동 이동.
  const recentFiveColumns = React.useMemo(() => publicColumns.slice(0, 5), [publicColumns]);
  const [featuredIdx, setFeaturedIdx] = React.useState(0);
  const [columnPaused, setColumnPaused] = React.useState(false);
  // 칼럼 수 변동 시 idx 안전 가드.
  React.useEffect(() => {
    if (featuredIdx >= recentFiveColumns.length) setFeaturedIdx(0);
  }, [recentFiveColumns.length, featuredIdx]);
  // auto-rotate (5초). pause / 칼럼 1개 이하면 정지.
  React.useEffect(() => {
    if (columnPaused || recentFiveColumns.length <= 1) return;
    const id = setInterval(() => {
      setFeaturedIdx((i) => (i + 1) % recentFiveColumns.length);
    }, 5000);
    return () => clearInterval(id);
  }, [columnPaused, recentFiveColumns.length]);
  // 리스트 축소 시 featuredIdx 가 범위를 벗어나도 한 프레임 깜빡임 없도록 파생 시점에 보정.
  const _safeIdx = featuredIdx < recentFiveColumns.length ? featuredIdx : 0;
  const featuredColumn = recentFiveColumns[_safeIdx];
  // 사이드 4개 = 메인 제외 나머지. 순서 유지.
  const secondaryColumns = React.useMemo(
    () => recentFiveColumns.filter((_, i) => i !== _safeIdx),
    [recentFiveColumns, _safeIdx]
  );
  const recentPosts = React.useMemo(() => G.arr(() => window.BGNJ_COMMUNITY?.listPosts?.()).slice(0, 4), [postsTick]);
  // v00.266 — 홈 섹션도 오늘 기준 날짜 필터 적용 (HeroProgramCards 와 동일 정책).
  //   투어: 예정(어제 이후)만 노출. 지난 일정만 있으면 빈 상태("이번에 걸을 길 없음").
  //   강연: 예정 우선, 없으면 가장 최근 지난 강연 3개로 폴백 + "지난 강연" 마크 (v00.129 사용자 요청 유지).
  // v00.274 — 날짜는 _eventTs(starts_at 없으면 next 텍스트 파싱)로 해석.
  //   투어: 예정(어제 이후)만 노출. 지난 일정만 있으면 빈 상태("이번에 걸을 길 없음").
  //   강연: 예정 우선, 없으면 가장 최근 지난 강연 3개로 폴백 + "지난 강연" 마크 (v00.129 사용자 요청 유지).
  const _cutoff = Date.now() - 86400000; // 어제 자정 근사 — 당일 진행분 노출 유지
  const _validStart = (x) => x && !x.hidden && !isNaN(_eventTs(x));
  const tours = React.useMemo(() => G.arr(() => window.BGNJ_TOURS?.listAll?.())
    .filter(_validStart)
    .filter((t) => _eventTs(t) >= _cutoff)
    .sort((a, b) => _eventTs(a) - _eventTs(b))
    .slice(0, 4), [toursTick]);
  const lectures = React.useMemo(() => {
    const all = G.arr(() => window.BGNJ_LECTURES?.listAll?.()).filter(_validStart);
    const upcoming = all
      .filter((l) => _eventTs(l) >= _cutoff)
      .sort((a, b) => _eventTs(a) - _eventTs(b));
    if (upcoming.length > 0) return upcoming.slice(0, 3);
    return all
      .filter((l) => _eventTs(l) < _cutoff)
      .sort((a, b) => _eventTs(b) - _eventTs(a))
      .slice(0, 3);
  }, [lecturesTick]);
  // 강연 섹션이 '지난 강연 폴백' 모드인지 (예정이 하나도 없을 때).
  const lecturesArePast = lectures.length > 0 && lectures.every((l) => _eventTs(l) < _cutoff);

  // hero.stats 가 있으면 콘텐츠(label/sub/valueFallback) 를 거기서. 동적 value(투어/커뮤니티 갯수) 는 코드 측 우선.
  const heroStats = Array.isArray(hero.stats) && hero.stats.length === 3 ? hero.stats : [
    { label: '여행지',   sub: '주요 답사지 운영',   valueFallback: '전국'    },
    { label: '투어',     sub: '직접 기획 프로그램', valueFallback: '준비 중' },
    { label: '커뮤니티', sub: '함께 만드는 여행',   valueFallback: '운영 중' },
  ];
  // v00.256 — hero 통계 실데이터 동적화. valueFallback 은 데이터 없을 때만.
  const allPostsCount = G.arr(() => window.BGNJ_COMMUNITY?.listPosts?.()).length;
  const stats = [
    { l: heroStats[0].label,
      v: recommendations.length > 0 ? `${recommendations.length}곳` : (heroStats[0].valueFallback || '전국'),
      s: heroStats[0].sub },
    { l: heroStats[1].label,
      v: tours.length > 0 ? `${tours.length}개` : (heroStats[1].valueFallback || '준비 중'),
      s: heroStats[1].sub },
    { l: heroStats[2].label,
      v: allPostsCount > 0 ? `${allPostsCount}+` : (heroStats[2].valueFallback || '운영 중'),
      s: heroStats[2].sub },
  ];

  const clickable = (onClick, label) => ({
    role:'button', tabIndex:0, 'aria-label':label, onClick,
    onKeyDown:(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); onClick(); } },
    style:{cursor:'pointer'},
  });

  // v00.199 — 사용자 요청 '홈 설정 트윅으로 글자 크기 소폭 조절'. fontScale 0.85~1.20 범위로 제한 (안전 가드).
  const fontScale = (() => {
    const v = Number(homeText.fontScale ?? 1);
    if (!isFinite(v)) return 1;
    return Math.max(0.85, Math.min(1.20, v));
  })();
  return (
    <div className="home-page" style={{ fontSize: `${fontScale}em` }}>
      {recDetail && <RecommendationDetailModal rec={recDetail} onClose={() => setRecDetail(null)} go={go}/>}

      {/* v00.143 — 오픈 안내 배너는 boot.jsx 로 이동 (sitewide, 메뉴 위쪽). */}

      {/* ── HERO (텍스트 + 우측 지도 미리보기, 모바일 1단) ─────────── */}
      <HomeSectionBoundary label="히어로"><section
        className={`home-hero${(hero.bgDesktopUrl || hero.bgMobileUrl) ? ' has-bg' : ''}`}
        style={{
          position:'relative', overflow:'hidden',
          background:'var(--bg)', borderBottom:'1px solid var(--line)',
          padding:'72px 0 88px',
        }}>
        {/* v00.247 — 사용자 설정 배경 이미지 (PC/모바일 별도). 미설정 시 렌더 X — 기존 빈 배경 유지.
            v00.248 — 모바일 슬롯 비면 PC 이미지를 fallback (사용자 보고 '한 번 올린 거로 양쪽 살아나면 좋겠다').
            반대로 PC 슬롯 비고 모바일만 있어도 모바일 div 만 렌더 — 모바일 viewport 만 노출, PC 는 빈 배경. */}
        {hero.bgDesktopUrl && (
          <div className="hero-bg-image hero-bg-desktop" aria-hidden="true"
            style={{backgroundImage:`url(${hero.bgDesktopUrl})`}}/>
        )}
        {(hero.bgMobileUrl || hero.bgDesktopUrl) && (
          <div className="hero-bg-image hero-bg-mobile" aria-hidden="true"
            style={{backgroundImage:`url(${hero.bgMobileUrl || hero.bgDesktopUrl})`}}/>
        )}
        <div className="container" style={{position:'relative', zIndex:1}}>
          <div className="hero-grid home-hero-grid" style={{
            display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:56, alignItems:'center',
          }}>
            {/* 좌측: 텍스트 — heroStyle 트윗(관리자 '히어로' 탭) 인라인 적용 */}
            <div style={{textAlign: heroStyle.title.textAlign || 'left'}}>
              <div className="section-eyebrow" style={{
                fontSize: heroStyle.eyebrow.fontSize,
                fontWeight: heroStyle.eyebrow.fontWeight,
                letterSpacing: `${heroStyle.eyebrow.letterSpacing}em`,
                color: `var(${heroStyle.eyebrow.color})`,
                textTransform: heroStyle.eyebrow.textTransform || 'uppercase',
              }}>
                <span>{hero.eyebrow || "먹고 자고 걷고 읽는 한국"}</span>
              </div>
              <h1 style={{
                fontFamily:'var(--font-display)',
                fontSize: `clamp(36px, 5vw, ${heroStyle.title.fontSize}px)`,
                fontWeight: heroStyle.title.fontWeight,
                lineHeight: heroStyle.title.lineHeight,
                letterSpacing: `${heroStyle.title.letterSpacing}em`,
                marginBottom:22,
                color:`var(${heroStyle.title.color})`,
              }}>
                {hero.title1 || "한국을"}<br/>
                <span style={{color:`var(${heroStyle.title.accentColor})`}}>{hero.title2 || "직접 걷고"}</span><br/>
                {hero.title3 || "천천히 읽다"}
              </h1>
              <p className="bgnj-multiline" style={{
                fontSize: heroStyle.subtitle.fontSize,
                lineHeight: heroStyle.subtitle.lineHeight,
                color: `var(${heroStyle.subtitle.color})`,
                maxWidth: heroStyle.subtitle.maxWidth,
                marginBottom:32,
                fontWeight: heroStyle.subtitle.fontWeight,
                marginLeft: heroStyle.title.textAlign === 'center' ? 'auto' : undefined,
                marginRight: heroStyle.title.textAlign === 'center' ? 'auto' : undefined,
              }}>
                {hero.subtitle || "궁궐과 골목, 시장과 숙소, 책과 강연을 오가며 한국을 조금 더 가까이 봅니다. 뱅기노자는 여행을 기록하고 함께 떠나는 사람들의 작은 모임입니다."}
              </p>
              <div style={{
                display:'flex', gap:12, flexWrap:'wrap', marginBottom:40,
                justifyContent: heroStyle.title.textAlign === 'center' ? 'center' : (heroStyle.title.textAlign === 'right' ? 'flex-end' : 'flex-start'),
                fontWeight: heroStyle.cta.fontWeight,
              }}>
                {/* v00.152 — 사용자 요청 '지도에서 여행지 찾기 버튼 삭제'. */}
                <button className="btn btn-gold" onClick={() => go('community')}
                  style={{fontWeight: heroStyle.cta.fontWeight}}>
                  {hero.ctaPrimary || "커뮤니티 보기"}
                </button>
                <button className="btn" onClick={() => go('tour')}
                  style={{fontWeight: heroStyle.cta.fontWeight}}>
                  {hero.ctaSecondary || "답사 일정 보기"}
                </button>
              </div>
              <div className="hero-stats" style={{
                display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20,
                paddingTop:24, borderTop:'1px solid var(--line)',
              }}>
                {stats.map((stat) => (
                  <div key={stat.l}>
                    <div style={{
                      fontFamily:'var(--font-serif)',
                      fontSize: heroStyle.stats.value.fontSize,
                      fontWeight: heroStyle.stats.value.fontWeight,
                      color: `var(${heroStyle.stats.value.color})`,
                      marginBottom:4,
                    }}>{stat.v}</div>
                    <div style={{
                      fontFamily:'var(--font-mono)',
                      fontSize: heroStyle.stats.label.fontSize,
                      fontWeight: heroStyle.stats.label.fontWeight,
                      letterSpacing: `${heroStyle.stats.label.letterSpacing}em`,
                      color: `var(${heroStyle.stats.label.color})`,
                      textTransform: heroStyle.stats.label.textTransform || 'uppercase',
                      marginBottom:3,
                    }}>{stat.l}</div>
                    <div style={{
                      fontSize: heroStyle.stats.sub.fontSize,
                      color: `var(${heroStyle.stats.sub.color})`,
                    }}>{stat.s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 우측: 지도 미리보기 — 시도 클릭 → 전체 모달 (a11y: 외곽 div 는 단순 컨테이너, 실제 버튼은 region path 와 우상단 텍스트 버튼). 폰(≤600px) 에서는 hero-map-preview CSS 로 숨김 + CTA 버튼만 노출. */}
            {/* v00.106 — 지도 → 다음 강연 / 다음 답사 미니 카드 (A안) */}
            <HeroProgramCards go={go} dataTick={dataTick} text={homeText}/>
          </div>
        </div>
      </section>

      </HomeSectionBoundary>

      {/* ── 뱅기노자 추천 (관리자 콘텐츠 패널에서 추가) — v00.164 anchor 박자 + asymmetric grid ─── */}
      {recommendations.length > 0 && (
        <HomeSectionBoundary label="뱅기노자 추천"><section className="section section--anchor" style={{background:'var(--bg-2)'}}>
          <div className="container">
            {(() => {
              // v00.083 — site_content_kv.recommendationsHeading 에서 hero 읽음 (v00.073 sweep 미완 잔재).
              const _i = (window.BGNJ_SITE_CONTENT?.get?.() || {}).recommendationsHeading || {};
              const eb = homeText.recEyebrow || _i.eyebrow || HOME_TEXT_DEFAULT.recEyebrow;
              const tp = homeText.recTitlePrefix ?? _i.titlePrefix ?? HOME_TEXT_DEFAULT.recTitlePrefix;
              const ta = homeText.recTitleAccent ?? _i.titleAccent ?? HOME_TEXT_DEFAULT.recTitleAccent;
              const ts = homeText.recTitleSuffix ?? _i.titleSuffix ?? HOME_TEXT_DEFAULT.recTitleSuffix;
              const sb = homeText.recSubtitle || _i.subtitle || HOME_TEXT_DEFAULT.recSubtitle;
              return (
                <SectionHead
                  eyebrow={eb}
                  title={<>{tp}<span className="accent">{ta}</span>{ts}</>}
                  subtitle={sb}
                  action={<button type="button" className="btn-ghost" onClick={() => go('tour')}>{homeText.recAction}</button>}
                />
              );
            })()}
            {/* v00.164 — 추천 카드 3개 이상이면 asymmetric (첫 카드 2x). 그 미만이면 grid-3 폴백. */}
            <div className={recommendations.length >= 3 ? 'grid grid-feature-2' : 'grid grid-3'}>
              {recommendations.map((r, ri) => {
                const tags = Array.isArray(r.tags) ? r.tags : (typeof r.tags === 'string' ? r.tags.split(/[,·]/).map((s) => s.trim()).filter(Boolean) : []);
                // v00.164 — 첫 카드 (asymmetric 모드) 는 사진/타이틀/desc 모두 큼.
                const isFeature = recommendations.length >= 3 && ri === 0;
                return (
                  <article key={r.id || r.name}
                    className="card card--bare"
                    {...clickable(() => setRecDetail(r), `${r.name || '추천'} 상세 보기`)}
                    style={{cursor:'pointer', display:'flex', flexDirection:'column', padding:0}}>
                    <div style={{
                      height: isFeature ? 320 : 160, marginBottom:18, position:'relative', overflow:'hidden',
                      background: r.imageDataUri ? `url(${r.imageDataUri}) center/cover` : 'var(--bg-3)',
                    }}>
                      {r.region && (
                        <div style={{
                          position:'absolute', top:10, left:12,
                          padding:'3px 8px', background:'var(--bg-2)',
                          fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
                          letterSpacing:'0.18em', color:'var(--ink-2)',
                        }}>{r.region}</div>
                      )}
                    </div>
                    {tags.length > 0 && (
                      <div style={{display:'flex', gap:6, marginBottom:10, flexWrap:'wrap'}}>
                        {tags.slice(0, 3).map((t) => (
                          <span key={t} className="badge" style={{fontSize:9}}>{t}</span>
                        ))}
                      </div>
                    )}
                    <h3 className="ko-serif" style={{fontSize: isFeature ? 30 : 22, fontWeight:600, marginBottom:5, lineHeight:1.25}}>{r.name || '제목 없음'}</h3>
                    {r.subtitle && (
                      <div style={{
                        fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600,
                        color:'var(--secondary)', letterSpacing:'0.05em', marginBottom:10,
                      }}>{r.subtitle}</div>
                    )}
                    {r.desc && <p style={{fontSize: isFeature ? 14 : 13, lineHeight:1.7, color:'var(--ink-2)'}}>{r.desc}</p>}
                  </article>
                );
              })}
            </div>
          </div>
        </section></HomeSectionBoundary>
      )}

      {/* ── 투어 프로그램 — v00.164 inline 헤더 + section-tight (지원 박자) ──── */}
      {/* v00.266 — 예정 일정이 없어도 섹션은 노출하되 빈 상태 안내. (지난 일정 노출 금지) */}
      <HomeSectionBoundary label="투어 프로그램"><section className="section-tight" style={{}}>
          <div className="container">
            {/* v00.164 — inline 헤더: eyebrow + title + count + action 한 줄. subtitle 제거 (section-head--inline 가 hide). */}
            <div className="section-head section-head--inline">
              <div>
                <div className="section-eyebrow" aria-hidden="true">{homeText.tourEyebrow}</div>
                <h2 className="section-title">
                  {homeText.tourTitle}
                  {tours.length > 0 && (
                    <span className="mono" style={{
                      fontSize:13, fontWeight:600, letterSpacing:'0.18em',
                      color:'var(--ink-3)', marginLeft:14, verticalAlign:'middle',
                    }}>· {tours.length}개 일정</span>
                  )}
                </h2>
              </div>
              <button type="button" className="btn-ghost" onClick={() => go('tour')}>{homeText.tourAction}</button>
            </div>
            {tours.length === 0 ? (
              <div className="card" style={{padding:'40px 24px', textAlign:'center'}}>
                <div className="ko-serif" style={{fontSize:18, color:'var(--ink-2)', marginBottom:8}}>이번에 함께 걸을 길이 아직 없습니다</div>
                <p className="dim" style={{fontSize:13, lineHeight:1.7, margin:0}}>
                  다음 답사 일정을 준비하고 있어요. <button type="button" className="link-inline" onClick={() => go('tour')} style={{background:'none', border:'none', padding:0, color:'var(--secondary)', cursor:'pointer', font:'inherit', textDecoration:'underline'}}>전체 일정</button>에서 지난 답사 기록을 볼 수 있습니다.
                </p>
              </div>
            ) : (
            <div className="grid grid-2">
              {tours.map((t, i) => (
                <article key={t.id} className="card"
                  {...clickable(() => go('tour'), `투어: ${t.title}`)}
                  style={{cursor:'pointer', position:'relative'}}>
                  <div className="mono" style={{
                    position:'absolute', top:20, right:20,
                    fontSize:10, color:'var(--ink-3)', letterSpacing:'0.2em',
                  }}>0{i+1}</div>
                  <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap'}}>
                    {t.level && <span className="badge">{t.level}</span>}
                    {t.duration && <span className="badge">{t.duration}</span>}
                    {t.group && <span className="badge">{t.group}</span>}
                  </div>
                  <h3 className="card-title" style={{fontSize:22, marginBottom:10}}>{t.title}</h3>
                  {t.desc && <p className="dim" style={{fontSize:13, lineHeight:1.7, marginBottom:20}}>{truncatePreview(t.desc, 110)}</p>}
                  <div style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    borderTop:'1px solid var(--line)', paddingTop:16,
                  }}>
                    <div>
                      <div className="mono" style={{fontSize:10, fontWeight:600, letterSpacing:'0.18em', color:'var(--ink-3)'}}>{homeText.tourNextLabel}</div>
                      <div style={{fontSize:14, marginTop:4, color:'var(--ink)', fontWeight:500}}>{t.next || homeText.emptyFallback}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="mono" style={{fontSize:10, fontWeight:600, letterSpacing:'0.18em', color:'var(--ink-3)'}}>{homeText.tourPriceLabel}</div>
                      <div className="ko-serif" style={{fontSize:20, marginTop:4, color:'var(--ink)', fontWeight:600}}>{t.price ? (typeof t.price === 'number' ? window.BGNJ_FMT?.won?.(t.price) ?? '' : t.price) : homeText.emptyFallback}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            )}
          </div>
        </section></HomeSectionBoundary>

      {/* ── 커뮤니티 — v00.164 mid 박자 + 헤더 박자 변형 ──────────────── */}
      <HomeSectionBoundary label="커뮤니티"><section className="section--mid" style={{background:'var(--bg-2)'}}>
        <div className="container">
          {/* v00.164 — 컴팩트 헤더 + subtitle 우측 인라인 (기존 SectionHead 의 4단 박자 깸). */}
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'flex-end',
            gap:32, flexWrap:'wrap', marginBottom:24,
          }}>
            <div style={{flex:'1 1 320px', minWidth:0}}>
              <div className="section-eyebrow" aria-hidden="true">{homeText.communityEyebrow}</div>
              <h2 className="section-title" style={{fontSize:28, marginBottom:0}}>{homeText.communityTitle}</h2>
            </div>
            {homeText.communitySubtitle && (
              <p style={{
                flex:'1 1 280px', fontSize:13, color:'var(--ink-3)',
                lineHeight:1.7, margin:0, maxWidth:380,
              }}>{homeText.communitySubtitle}</p>
            )}
            <button type="button" className="btn-ghost" onClick={() => go('community')}>{homeText.communityAction}</button>
          </div>
          {recentPosts.length > 0 ? (
            <div style={{borderRadius:12, overflow:'hidden'}}>
              {recentPosts.map((post, i) => (
                <div key={post.id}
                  {...clickable(() => go('community'), post.title)}
                  style={{
                    display:'flex', gap:20, alignItems:'center',
                    padding:'16px 22px',
                    background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)',
                  }}>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:5, flexWrap:'wrap'}}>
                      {post.category && <span className="badge" style={{fontSize:9}}>{post.category}</span>}
                      {post.prefix && (
                        <span style={{
                          fontFamily:'var(--font-mono)', fontSize:9, fontWeight:700,
                          color:'var(--secondary)', letterSpacing:'0.1em',
                        }}>[{post.prefix}]</span>
                      )}
                    </div>
                    <div className="ko-serif" style={{fontSize:15, color:'var(--ink)', marginBottom:3, fontWeight:500}}>{post.title}</div>
                    <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)'}}>
                      {post.author} · {post.date}
                    </div>
                  </div>
                  <div style={{
                    display:'flex', gap:14, color:'var(--ink-3)',
                    fontFamily:'var(--font-mono)', fontSize:11, flexShrink:0, fontWeight:500,
                  }}>
                    <span>{homeText.communityReplyLabel} {post.replies ?? 0}</span>
                    <span style={{color:'var(--ink-2)'}}>→</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{textAlign:'center', padding:60}}>
              <div style={{fontFamily:'var(--font-serif)', fontSize:20, color:'var(--ink)', marginBottom:12, fontWeight:600}}>
                {homeText.communityEmptyTitle}
              </div>
              <p style={{fontSize:13, color:'var(--ink-2)', marginBottom:24, lineHeight:1.7}}>
                {homeText.communityEmptySubtitle}
              </p>
              <button className="btn btn-gold" onClick={() => go('community')}>{homeText.communityEmptyCta}</button>
            </div>
          )}
        </div>
      </section></HomeSectionBoundary>

      {/* ── 뱅기노자 칼럼 — v00.164 magazine spread 톤 (외부 SectionHead 폐기) ─── */}
      {featuredColumn && (
        <HomeSectionBoundary label="칼럼"><section className="section--mid" style={{}}>
          <div className="container">
            {/* v00.164 — eyebrow 만 가벼운 헤더, title 은 featured 카드 안으로 흡수. */}
            <div style={{
              display:'flex', justifyContent:'space-between', alignItems:'baseline',
              marginBottom:28, gap:16, flexWrap:'wrap',
            }}>
              <div className="section-eyebrow" aria-hidden="true" style={{margin:0}}>{homeText.columnEyebrow}</div>
              <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
                {/* v00.169 — admin 전용 글쓰기 진입. /column 으로 이동하며 sessionStorage flag 로 모달 자동 오픈. */}
                {!!window.BGNJ_AUTH?.currentUser?.()?.isAdmin && (
                  <button type="button" className="btn btn-gold btn-small"
                    onClick={() => {
                      try { sessionStorage.setItem('bgnj_pending_column_write', '1'); } catch {}
                      go('column');
                    }}>＋ 글쓰기</button>
                )}
                <button type="button" className="btn-ghost" onClick={() => go('column')}>{homeText.columnAction}</button>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:56}} className="col-grid"
              onMouseEnter={() => setColumnPaused(true)} onMouseLeave={() => setColumnPaused(false)}
              onFocusCapture={() => setColumnPaused(true)} onBlurCapture={() => setColumnPaused(false)}>
              {/* v00.164 — 피처드 = magazine spread. v00.240 — 자동 순환 (5초).
                  v00.246 — slide-in 애니메이션 + 높이 안정화 + 제목 20자 통일.
                  key={featuredIdx} 로 매 순환마다 unmount/mount → CSS keyframe 재생. */}
              <article
                key={featuredIdx}
                className="column-featured-slide"
                style={{cursor:'pointer', position:'relative', minHeight:600, display:'flex', flexDirection:'column'}}
                {...clickable(() => go('column'), `칼럼: ${featuredColumn.title}`)}>
                {(featuredColumn.coverUrl || featuredColumn.coverImage) ? (
                  <div style={{
                    height:320, marginBottom:24, flex:'0 0 auto',
                    backgroundImage:`url(${featuredColumn.coverUrl || featuredColumn.coverImage})`,
                    backgroundSize:'cover', backgroundPosition:'center',
                  }}/>
                ) : (
                  <div style={{
                    height:320, background:'var(--bg-2)', marginBottom:24, flex:'0 0 auto', borderRadius:12,
                    display:'grid', placeItems:'center',
                  }}>
                    <div style={{fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600, color:'var(--ink-3)', letterSpacing:'0.28em'}}>FEATURED COLUMN</div>
                  </div>
                )}
                <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:14, flexWrap:'wrap'}}>
                  {featuredColumn.category && <span className="pill">{featuredColumn.category}</span>}
                  {featuredColumn.date && <span className="mono dim-2" style={{fontSize:11}}>{featuredColumn.date}</span>}
                  {featuredColumn.readTime && <span className="mono dim-2" style={{fontSize:11}}>· {featuredColumn.readTime}</span>}
                </div>
                {/* v00.246 — 제목 20자 통일 (사용자 요청 — 이전엔 자르지 않아 들쭉날쭉). lineHeight 1.25 + 1줄 강제. */}
                <h2 style={{
                  fontFamily:'var(--font-serif)', fontSize:'clamp(24px, 2.6vw, 32px)',
                  fontWeight:600, lineHeight:1.25, marginBottom:14, color:'var(--ink)',
                  letterSpacing:'-0.01em',
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                }}>{truncatePreview(featuredColumn.title, 20)}</h2>
                {featuredColumn.excerpt && (
                  <p style={{fontSize:15, lineHeight:1.75, color:'var(--ink-2)', marginBottom:18, maxWidth:580, minHeight:80}}>
                    {truncatePreview(featuredColumn.excerpt, 90)}
                  </p>
                )}
                <div className="mono" style={{fontSize:11, fontWeight:700, letterSpacing:'0.2em', color:'var(--secondary)'}}>{homeText.columnReadMore}</div>
                {/* v00.240 — 자동 순환 인디케이터 (점 N 개). 클릭 시 수동 이동. */}
                {recentFiveColumns.length > 1 && (
                  <div style={{display:'flex', gap:6, marginTop:18, alignItems:'center'}}
                    onClick={(e) => e.stopPropagation()}>
                    {recentFiveColumns.map((_, i) => (
                      <button key={i} type="button"
                        aria-label={`${i + 1}번째 칼럼 보기`}
                        aria-current={i === featuredIdx ? 'true' : undefined}
                        onClick={() => setFeaturedIdx(i)}
                        style={{
                          width: i === featuredIdx ? 22 : 8, height: 8,
                          borderRadius: 999, border: 'none', cursor: 'pointer',
                          background: i === featuredIdx ? 'var(--primary)' : 'var(--line-2)',
                          transition: 'width .25s, background .2s', padding: 0,
                        }}/>
                    ))}
                    <span className="mono dim-2" style={{fontSize:9, marginLeft:8, letterSpacing:'0.15em'}}>
                      {columnPaused ? '⏸ HOVER' : '▶ AUTO'}
                    </span>
                  </div>
                )}
              </article>
              {/* v00.164 — sidebar = 깨끗한 텍스트 list. 카드 라인 X, 구분선만. */}
              <aside style={{paddingTop:8}}>
                <div className="mono" style={{
                  fontSize:10, fontWeight:600, letterSpacing:'0.22em',
                  color:'var(--ink-3)', marginBottom:18, textTransform:'uppercase',
                }}>{homeText.columnTitle}</div>
                {secondaryColumns.map((c, ci) => (
                  <div key={c.id}
                    {...clickable(() => go('column'), `칼럼: ${c.title}`)}
                    style={{
                      padding:'14px 0', minHeight:88,
                      borderBottom: ci < secondaryColumns.length - 1 ? '1px solid var(--line)' : 'none',
                      cursor:'pointer',
                    }}>
                    <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:6, flexWrap:'wrap'}}>
                      {c.category && <span className="pill" style={{fontSize:9, padding:'2px 8px'}}>{c.category}</span>}
                      {c.date && <span className="mono dim-2" style={{fontSize:10}}>{c.date}</span>}
                    </div>
                    {/* v00.246 — 제목 20자 통일 + 1줄 ellipsis (높이 안정화). */}
                    <h4 className="ko-serif" style={{
                      fontSize:16, fontWeight:600, lineHeight:1.4, marginBottom:4,
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                    }}>{truncatePreview(c.title, 20)}</h4>
                    {c.excerpt && <p style={{fontSize:12, lineHeight:1.6, color:'var(--ink-3)', margin:0,
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                    }}>{truncatePreview(c.excerpt, 38)}</p>}
                  </div>
                ))}
                {secondaryColumns.length === 0 && (
                  <p style={{fontSize:13, color:'var(--ink-3)', padding:'16px 0'}}>{homeText.columnEmpty}</p>
                )}
              </aside>
            </div>
          </div>
        </section></HomeSectionBoundary>
      )}

      {/* ── 강연 일정 — v00.164 가로 스크롤 strip (film strip 톤) ──────── */}
      {lectures.length > 0 && (
        <HomeSectionBoundary label="강연"><section className="section-tight" style={{background:'var(--bg-2)'}}>
          <div className="container">
            {/* v00.164 — inline 헤더 (3열 grid 와 무게 다른 박자). */}
            <div className="section-head section-head--inline">
              <div>
                <div className="section-eyebrow" aria-hidden="true">{homeText.lecturesEyebrow}</div>
                <h2 className="section-title">{homeText.lecturesTitle}</h2>
                {/* v00.266 — 예정 강연이 없어 지난 강연을 노출 중임을 명시. */}
                {lecturesArePast && (
                  <p className="dim" style={{fontSize:12.5, marginTop:6, marginBottom:0, color:'var(--ink-3)'}}>
                    현재 예정된 강연이 없어 지난 강연을 보여드립니다.
                  </p>
                )}
              </div>
              <button type="button" className="btn-ghost" onClick={() => go('lectures')}>{homeText.lecturesAction}</button>
            </div>
            {/* v00.164 — film strip 가로 스크롤. 폭 320px 카드 + scroll-snap.
                v00.254 — 사용자 보고 '카드 1-2개일 때 좌측만 채우고 우측 빈 공간 → 가독성 ↓'.
                lectures.length 별 분기: ≤2 grid (풀폭 분할) / ≥3 strip (가로 스크롤). */}
            <div className={`lecture-strip${lectures.length <= 2 ? ' lecture-strip--grid' : ''}`} role="list">
              {lectures.map((lecture) => {
                const heroMode = lectures.length === 1;
                // v00.255 — 사용자 명시 강연 카드 핵심 정보 5종.
                const price = window.BGNJ_FMT?.priceOrFree?.(lecture.price);
                const hours = lecture.durationMinutes
                  ? `${Math.round(lecture.durationMinutes / 60 * 10) / 10}시간`
                  : null;
                // v00.256 — 마감 임박 / 신규 라벨. startsAt 7일 이내 임박, createdAt 3일 이내 신규.
                const _now = Date.now();
                const _startsTs = _eventTs(lecture);
                const _createdTs = lecture.createdAt ? Date.parse(lecture.createdAt) : NaN;
                const _daysToStart = !isNaN(_startsTs) ? Math.ceil((_startsTs - _now) / 86400000) : null;
                const _daysSinceCreated = !isNaN(_createdTs) ? Math.floor((_now - _createdTs) / 86400000) : null;
                const isImminent = _daysToStart != null && _daysToStart > 0 && _daysToStart <= 7;
                const isNew = _daysSinceCreated != null && _daysSinceCreated <= 3;
                // v00.266 — 지난 강연 표시 (어제 이전 시작분). 폴백 모드에서 마크 노출.
                const isPast = !isNaN(_startsTs) && _startsTs < _now - 86400000;
                const metaCell = (label, value) => (
                  <div>
                    <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:3}}>{label}</div>
                    <div style={{fontSize: heroMode ? 14 : 13, fontWeight:600, color:'var(--ink)', lineHeight:1.4}}>{value || '-'}</div>
                  </div>
                );
                return (
                <article key={lecture.id}
                  role="listitem"
                  className="card"
                  {...clickable(() => {
                    try { sessionStorage.setItem('bgnj_pending_lecture_id', String(lecture.id)); } catch {}
                    go('lectures');
                  }, `강연: ${lecture.topic || lecture.title}`)}
                  style={{cursor:'pointer', display:'flex', flexDirection:'column',
                    padding: heroMode ? '32px 32px 28px' : '20px 20px 18px'}}>
                  <div style={{display:'flex', gap:6, marginBottom:14, flexWrap:'wrap', alignItems:'center'}}>
                    <span className="badge">{homeText.lectureBadge}</span>
                    {isPast && (
                      <span className="badge" style={{borderColor:'var(--ink-3)', color:'var(--ink-3)', background:'var(--bg-2)'}}>지난 강연</span>
                    )}
                    {isImminent && (
                      <span className="badge" style={{borderColor:'var(--danger)', color:'var(--danger)'}}>
                        {_daysToStart === 1 ? '내일 마감' : `D-${_daysToStart}`}
                      </span>
                    )}
                    {isNew && <span className="badge" style={{borderColor:'var(--primary)', color:'var(--primary-active)'}}>NEW</span>}
                  </div>
                  <h3 className="ko-serif" style={{fontSize: heroMode ? 24 : 19, fontWeight:600, lineHeight:1.35, marginBottom:10, flex:'0 0 auto', color:'var(--ink)'}}>{lecture.topic || lecture.title}</h3>
                  {/* 5) 행사 간단 소개 */}
                  {lecture.note && <p style={{fontSize: heroMode ? 15 : 14, lineHeight:1.75, color:'var(--ink-2)', marginBottom:18, flex:'1 1 auto'}}>{truncatePreview(lecture.note, heroMode ? 180 : 110)}</p>}
                  {/* 1) 일정 · 2) 참가비 · 3) 정원 · 4) 소요시간 — 2x2 grid */}
                  <div style={{
                    display:'grid', gridTemplateColumns:'1fr 1fr',
                    gap: heroMode ? '12px 24px' : '10px 14px',
                    paddingTop:14, paddingBottom: heroMode ? 14 : 10,
                    borderTop:'1px solid var(--line)',
                    marginTop:'auto',
                  }}>
                    {metaCell('일정', lecture.next)}
                    {metaCell('참가비', price)}
                    {metaCell('정원', lecture.capacity ? `${lecture.capacity}명` : null)}
                    {metaCell('소요시간', hours)}
                  </div>
                  {/* 장소 — 메타 행 아래 (운영 정보 보조) */}
                  {lecture.venue && (
                    <div className="dim-2" style={{
                      fontSize:11, marginTop: heroMode ? 12 : 8,
                      paddingTop: heroMode ? 12 : 8,
                      borderTop: heroMode ? '1px dashed var(--line)' : 'none',
                      letterSpacing:'0.02em',
                    }}>
                      <span className="mono" style={{fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', marginRight:6, color:'var(--ink-3)'}}>장소</span>
                      {lecture.venue}
                    </div>
                  )}
                </article>
                );
              })}
            </div>
            {/* 가로 스크롤 힌트 — 카드 ≥ 3개 일 때만 (보통 3 이상이지만 방어). */}
            {lectures.length >= 3 && (
              <div className="mono" style={{
                marginTop:14, fontSize:10, fontWeight:600, letterSpacing:'0.22em',
                color:'var(--ink-3)', textAlign:'right',
              }}>← 가로로 스크롤 →</div>
            )}
          </div>
        </section></HomeSectionBoundary>
      )}

      {/* ── 책 CTA — v00.152 다권 카루셀 + 좌우 무한 반복 ────────────── */}
      <BookCarouselSection go={go} dataTick={dataTick} text={homeText}/>

    </div>
  );
};

Object.assign(window, { HomePage });

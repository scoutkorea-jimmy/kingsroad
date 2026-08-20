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
// v00.287 ESM (main) — cross-module import (전역 결합 제거).
import { SectionHead } from '../components/Shell.jsx';

class HomeSectionBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  componentDidCatch(err) {
    try { console.error('[HomeSectionBoundary]', this.props.label || 'section', err); } catch (_e) { console.warn('[bgnj] HomePage.jsx:21 오류(무시하고 진행)', _e); }
    try {
      window.BGNJ_API?.errorLog?.report({
        code: 'HOME_SECTION_ERROR', status: null, kind: 'render',
        message: err?.message || String(err),
        hint: `section=${this.props.label || ''}`, url: '',
        pathname: location.pathname, origin: location.origin,
      })?.catch?.(() => {});
    } catch (_e) { console.warn('[bgnj] 오류 보고 자체 — 실패해도 재보고하면 무한루프 (HomePage.jsx:29)', _e); }
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
// div 를 버튼처럼 쓸 때의 접근성 props. 순수 함수라 컴포넌트 밖에 둔다
// (v00.293.002 — BookGridSection 이 모듈 레벨이라 HomePage 스코프 안에 있으면 참조 불가였다).
const clickable = (onClick, label) => ({
  role: 'button', tabIndex: 0, 'aria-label': label, onClick,
  onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } },
  style: { cursor: 'pointer' },
});

// v00.293.002 — 일정 날짜 표시용. _eventTs 로 해석한 뒤 KST 포맷.
const _fmtEventDate = (x) => {
  const t = _eventTs(x);
  if (isNaN(t)) return '';
  try {
    if (window.BGNJ_FMT?.kstFriendly) return window.BGNJ_FMT.kstFriendly(new Date(t).toISOString());
  } catch (_e) { console.warn('[bgnj] HomePage.jsx:149 오류(무시하고 진행)', _e); }
  const d = new Date(t);
  const p2 = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())}`;
};

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
  communityEyebrow: '광장',
  communityTitle: '다녀온 사람들의 기록',
  communitySubtitle: '좋았던 식당, 애매했던 동선, 다시 가고 싶은 골목까지 편하게 남겨주세요.',
  communityAction: '광장 가기 →',
  communityReplyLabel: '댓글',
  communityEmptyTitle: '첫 번째 여행 이야기를 써주세요',
  communityEmptySubtitle: '광장에 여행 경험을 나누면 더 많은 여행자들이 모여듭니다.',
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

  // v00.289 — 예정이 없으면 "예정된 강연이 아직 없습니다" 빈 카드를 띄우지 않고 아예 렌더하지 않는다.
  // 처음 온 사람이 첫 화면에서 두 번째로 보는 정보가 '없다' 가 되면 안 된다.
  // (rules/11-data-flow.md '깡통 카드 금지' + design/components.md '빈 상태' 와 같은 원칙.)
  // 둘 다 없으면 히어로 우측 컬럼 자체가 사라지고, 하나만 있으면 있는 것만 보인다.
  if (!nextLecture && !nextTour) return null;

  return (
    <div className="home-program-stack">
      {nextLecture && (
        <article
          onClick={() => go('lectures')}
          className="home-program-card"
          style={{cursor: 'pointer'}}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go('lectures'); } }}>
          <div className="home-program-label">
            {text.heroNextLectureLabel}
          </div>
          <h3 className="ko-serif" style={{fontSize:20, marginBottom:8, color:'var(--ink)'}}>{nextLecture.topic || nextLecture.title}</h3>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:10}}>
            <span className="gold-2 mono" style={{fontSize:13, fontWeight:600}}>{nextLecture.next || fmtDate(nextLecture.startsAt)}</span>
            <span className="dim-2" style={{fontSize:12}}>{nextLecture.venue || text.venueFallback}</span>
          </div>
        </article>
      )}

      {nextTour && (
        <article
          onClick={() => go('tour')}
          className="home-program-card"
          style={{cursor: 'pointer'}}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go('tour'); } }}>
          <div className="home-program-label">
            {text.heroNextTourLabel}
          </div>
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
        </article>
      )}
    </div>
  );
};

// v00.152 — 홈 책 CTA 다권 카루셀. v00.151 단일-책 IIFE 를 컴포넌트화 + 좌우 무한 wrap + autoplay.
// 데이터 소스: BGNJ_BOOKS.list({status:'published'}). 정렬: primary 우선 → order. 0권이면 섹션 hide.
// v00.293.002 — 책 섹션: 캐러셀 → 격자.
// 사용자 지적: 중앙이 텅 비고, 화살표가 화면 가장자리에 붙어 컨트롤로 안 읽히고,
// 인디케이터가 하단에 떠 있고, 6권이 있는데 한 번에 1권씩만 보였다.
// D안은 격자와 목록의 언어인데 이 섹션만 캐러셀이라 리듬이 깨졌다.
// 자동재생·화살표·인디케이터를 전부 걷어내고 전권을 한 화면에 편다.
const BookGridSection = ({ go, dataTick, text }) => {
  const _arr = (fn) => { try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; } };
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

  if (books.length === 0) return null;

  const won = (n) => {
    try { return window.BGNJ_FMT?.won?.(n) ?? `${Number(n || 0).toLocaleString('ko-KR')}원`; }
    catch { return `${n}원`; }
  };

  return (
    <HomeSectionBoundary label="책">
      <section className="home-books">
        <div className="container">
          <div className="home-feed-head">
            <div className="home-feed-label mono">{text.bookEyebrow || '뱅기노자 출판'}</div>
            <button type="button" className="btn-ghost mono" style={{fontSize:11}}
              onClick={() => go('book')}>전체 {books.length}권 →</button>
          </div>
          <div className="home-book-grid">
            {books.map((b) => (
              <article key={b.id} className="home-book"
                {...clickable(() => go('book'), `책: ${b.title}`)}>
                {/* v00.293.002 — 필드명 주의: 헬퍼가 cover_key → coverDataUri, price_kr → priceKR 로 매핑한다.
                    priceKr(소문자 r) 이 아니라 priceKR 이다. */}
                {b.coverDataUri
                  ? <div className="home-book-cover" role="img" aria-label={`${b.title} 표지`}
                      style={{backgroundImage:`url(${b.coverDataUri})`}}/>
                  : <div className="home-book-cover home-book-cover--none"><span className="mono">NO COVER</span></div>}
                <h4 className="home-book-title">{b.title}</h4>
                {b.subtitle && <div className="home-book-sub">{b.subtitle}</div>}
                {/* v00.295 — 세일 중이면 정가(취소선) · 판매가 · 할인폭 뱃지. 아니면 종전대로 한 줄. */}
                {b.priceKR > 0 && (() => {
                  const pr = window.BGNJ_BOOK_PRICE(b, 'KR');
                  if (!pr.isSale) return <div className="home-book-price mono">{won(pr.sale)}</div>;
                  // 카드가 좁다(모바일 140px). 한 줄에 셋을 늘어놓으면 줄이 지저분하게 접힌다.
                  // 정가는 윗줄에 작게, 판매가와 할인 뱃지를 아랫줄에 나란히.
                  return (
                    <div className="home-book-price mono">
                      <div className="price-was" style={{fontSize:'var(--fs-xs)'}}>{won(pr.list)}</div>
                      <div className="price-line" style={{marginTop:2}}>
                        <span style={{color:'var(--ink)'}}>{won(pr.sale)}</span>
                        <span className="price-off">{pr.percent}% 할인</span>
                      </div>
                    </div>
                  );
                })()}
              </article>
            ))}
          </div>
        </div>
      </section>
    </HomeSectionBoundary>
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
    } catch (_e) { console.warn('[bgnj] 리스너 해제 (HomePage.jsx:416)', _e); }
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
  // v00.266 — 홈 섹션도 오늘 기준 날짜 필터 적용 (HeroProgramCards 와 동일 정책).
  // v00.274 — 날짜는 _eventTs(starts_at 없으면 next 텍스트 파싱)로 해석.
  //   강연: 예정 우선, 없으면 가장 최근 지난 강연 3개로 폴백 + "지난 강연" 마크 (v00.129 사용자 요청 유지).
  //   v00.291 — 투어도 같은 폴백을 쓴다. 이전엔 투어만 빈 상태 카드("이번에 걸을 길 없음")를 띄워
  //     같은 홈 안에서 강연은 지난 기록을 보여주고 투어는 "없습니다"만 남는 불일치가 있었다.
  //     현재 투어 5건·강연 3건이 전부 지난 일정이라 이 차이가 그대로 화면에 드러난다.
  //     도움 위젯도 "지난 답사 보기"로 안내하므로 홈도 같은 태도로 통일한다.
  const _cutoff = Date.now() - 86400000; // 어제 자정 근사 — 당일 진행분 노출 유지
  const _validStart = (x) => x && !x.hidden && !isNaN(_eventTs(x));
  const tours = React.useMemo(() => {
    const all = G.arr(() => window.BGNJ_TOURS?.listAll?.()).filter(_validStart);
    const upcoming = all
      .filter((t) => _eventTs(t) >= _cutoff)
      .sort((a, b) => _eventTs(a) - _eventTs(b));
    if (upcoming.length > 0) return upcoming.slice(0, 4);
    return all
      .filter((t) => _eventTs(t) < _cutoff)
      .sort((a, b) => _eventTs(b) - _eventTs(a))
      .slice(0, 4);
  }, [toursTick]);
  // 투어 섹션이 '지난 답사 폴백' 모드인지 (예정이 하나도 없을 때).
  const toursArePast = tours.length > 0 && tours.every((t) => _eventTs(t) < _cutoff);

  // 히어로 지표용 전체 개수 — 위 tours 는 카드용으로 4개까지만 자르므로 지표에 쓰면 틀린 수가 나온다.
  // 라벨이 '투어 · 직접 기획 프로그램' 이므로 지난 것 포함 전체가 맞는 의미다.
  const toursTotal = React.useMemo(
    () => G.arr(() => window.BGNJ_TOURS?.listAll?.()).filter(_validStart).length, [toursTick]);
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

  // v00.293 — 홈 통합 피드. 칼럼·답사·강연을 날짜순 한 줄로 섞는다.
  // 이전엔 세 섹션이 따로 있어 같은 리듬(아이브로우→제목→전체보기→카드)이 세 번 반복됐다.
  // 각 항목은 자기 페이지로 가고, 상세가 있는 것은 sessionStorage 펜딩 키로 바로 연다.
  // v00.293.002 — 일정 대표 이미지(포스터). 사용자 요청: "최신 일정이 없으면 지난 일정입니다 하고
  // 가장 최신 일정의 포스터를 띄워줘".
  // 포스터는 D1 이 아니라 site_content_kv 의 lecturePages / tourPages 에 있다 —
  // { [id]: { images: [{ url, credit, isPrimary }] } }. LecturesPage 가 쓰는 것과 같은 경로.
  const primaryImage = React.useCallback((kind, id) => {
    try {
      const pages = kind === 'tour' ? sc.tourPages : sc.lecturePages;
      const imgs = pages?.[id]?.images;
      if (!Array.isArray(imgs) || imgs.length === 0) return '';
      return (imgs.find((x) => x && x.isPrimary) || imgs[0])?.url || '';
    } catch { return ''; }
  }, [sc]);

  // 홈 일정 카드에 쓸 대상 — 답사 우선, 없으면 강연.
  const featuredEvent = React.useMemo(() => {
    const t = tours[0], l = lectures[0];
    if (t) return { kind: 'tour', item: t, isPast: toursArePast, label: '답사', route: 'tour', pendKey: 'bgnj_pending_tour_id' };
    if (l) return { kind: 'lecture', item: l, isPast: lecturesArePast, label: '강연', route: 'lectures', pendKey: 'bgnj_pending_lecture_id' };
    return null;
  }, [tours, lectures, toursArePast, lecturesArePast]);

  // v00.294.015 — 사용자 요청: 광장 글도 '최근 기록' 에 올린다.
  // 다만 전부 올리면 자유 게시판(75편)이 칼럼·답사를 통째로 밀어낸다.
  // '읽을거리' 성격의 게시판만 골라 넣는다 — 늘리려면 이 배열에 id 한 줄 추가.
  const FEED_BOARD_IDS = ['walk-independence']; // 신지식 청년사관 (id 는 v00.294 신설 당시 그대로)
  const _boardLabel = React.useCallback((id) => {
    if (!id) return '';
    const found = G.arr(() => window.BGNJ_STORES?.categories).find((c) => c && c.id === id);
    return found?.label || '';
  }, []);
  const feedPosts = React.useMemo(() => (
    G.arr(() => window.BGNJ_COMMUNITY?.listPosts?.())
      .filter((p) => p && FEED_BOARD_IDS.includes(p.categoryId))
  ), [postsTick]);

  const recentEntries = React.useMemo(() => {
    const fmt = (t) => {
      if (isNaN(t)) return '';
      const d = new Date(t);
      const p2 = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())}`;
    };
    const colTs = (c) => {
      const raw = c.publishedAt || c.createdAt || c.date;
      const t = raw ? Date.parse(raw) : NaN;
      return isNaN(t) ? 0 : t;
    };
    const items = [
      ...publicColumns.slice(0, 10).map((c) => ({
        kind: 'col', id: c.id, title: c.title, tag: '기록',
        ts: colTs(c), date: fmt(colTs(c)),
        onGo: () => go('column'),
      })),
      ...tours.map((t) => ({
        kind: 'tour', id: t.id, title: t.title, tag: '답사',
        ts: _eventTs(t) || 0, date: fmt(_eventTs(t)),
        onGo: () => {
          try { sessionStorage.setItem('bgnj_pending_tour_id', String(t.id)); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (HomePage.jsx:546)', _e); }
          go('tour');
        },
      })),
      ...lectures.map((l) => ({
        kind: 'lec', id: l.id, title: l.topic || l.title, tag: '강연',
        ts: _eventTs(l) || 0, date: fmt(_eventTs(l)),
        onGo: () => {
          try { sessionStorage.setItem('bgnj_pending_lecture_id', String(l.id)); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (HomePage.jsx:554)', _e); }
          go('lectures');
        },
      })),
      ...feedPosts.map((p) => {
        // 게시글은 작성 시각이 진실이다. createdAt(ISO) 우선, 없으면 목록용 date('YYYY.MM.DD').
        const t = (() => {
          const raw = p.createdAt || (p.date ? String(p.date).replace(/\./g, '-') : '');
          const v = raw ? Date.parse(raw) : NaN;
          return isNaN(v) ? 0 : v;
        })();
        return {
          kind: 'post', id: p.id, title: p.title,
          // v00.295 — p.category 는 '글 쓸 때 박아 넣은 글자'라 게시판 이름이 바뀌면 옛 이름이 남는다.
          //   게시판의 현재 이름을 먼저 찾고, 못 찾을 때만 저장된 글자를 쓴다.
          tag: _boardLabel(p.categoryId) || p.category || '광장',
          ts: t, date: fmt(t),
          onGo: () => {
            try { sessionStorage.setItem('bgnj_pending_post_id', String(p.id)); }
            catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (HomePage.jsx)', _e); }
            go('community');
          },
        };
      }),
    ];
    return items.filter((x) => x.title).sort((a, b) => b.ts - a.ts).slice(0, 8);
  }, [publicColumns, tours, lectures, feedPosts]);

  // hero.stats 가 있으면 콘텐츠(label/sub/valueFallback) 를 거기서. 동적 value(투어/커뮤니티 갯수) 는 코드 측 우선.
  const heroStats = Array.isArray(hero.stats) && hero.stats.length === 3 ? hero.stats : [
    { label: '여행지',   sub: '주요 답사지 운영',   valueFallback: '전국'    },
    { label: '투어',     sub: '직접 기획 프로그램', valueFallback: '준비 중' },
    { label: '광장', sub: '함께 만드는 여행',   valueFallback: '운영 중' },
  ];
  // v00.256 — hero 통계 실데이터 동적화.
  // v00.289 — 실데이터가 없는 칸은 아예 렌더하지 않는다. 이전엔 valueFallback 으로 '준비 중' 같은
  //   상태 문구가 숫자 자리에 들어가 신뢰를 깎았다(전국 / 준비 중 / 85+). 지표는 사실이거나 없거나 둘 중 하나다.
  //   관리자가 hero.stats 에 valueFallback 을 명시적으로 넣어둔 경우는 의도로 보고 존중한다.
  const allPostsCount = G.arr(() => window.BGNJ_COMMUNITY?.listPosts?.()).length;
  const STALE_FALLBACKS = ['준비 중', '준비중', '운영 중', '운영중', '전국'];
  const _stat = (i, realValue) => {
    const fb = (heroStats[i].valueFallback || '').trim();
    // 실데이터가 있으면 그것을, 없으면 관리자가 넣은 의미 있는 폴백만. 상태 문구 폴백은 버린다.
    const v = realValue || (fb && !STALE_FALLBACKS.includes(fb) ? fb : '');
    return v ? { l: heroStats[i].label, v, s: heroStats[i].sub } : null;
  };
  const stats = [
    _stat(0, recommendations.length > 0 ? `${recommendations.length}곳` : ''),
    _stat(1, toursTotal > 0 ? `${toursTotal}개` : ''),
    _stat(2, allPostsCount > 0 ? `${allPostsCount}+` : ''),
  ].filter(Boolean);

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

      {/* ── HERO — v00.293 전면 재디자인(D안 · 라이트톤) ─────────────
          이전 히어로는 좌측 텍스트 + 우측 프로그램 카드 2단이었고 배경 이미지를 깔았다.
          새 구조는 배경 이미지를 쓰지 않는다 — 종이빛 바탕 위에 명조 대형 타이포만 세운다.
          hero.bgDesktopUrl / bgMobileUrl 은 더 이상 소비되지 않는다(데이터는 보존).
          heroStyle 트윗(관리자 '히어로' 탭)도 이 구조에선 적용하지 않는다 —
          크기·색이 구조의 일부가 됐기 때문. 문구(title1~3, subtitle, cta*)만 계속 관리자에서 편집된다. */}
      <HomeSectionBoundary label="히어로">
        <section className={`hero-d${(hero.bgDesktopUrl || hero.bgMobileUrl) ? ' has-bg' : ''}`}>
          {/* v00.294.004 — 배경 이미지 복구. v00.293 재디자인이 배경을 걷어내면서
              관리자 '히어로' 탭의 업로드 슬롯이 화면에 반영되지 않는 상태였다.
              종이빛 타이포 위계를 지키기 위해 이미지 위에 종이빛 막(.hero-d-scrim)을
              덮는다 — 사진은 질감으로 남고 글자는 --ink 대비를 유지한다.
              PC/모바일 두 장을 각각 쓰되, 한쪽만 올려도 그 한 장을 양쪽에 쓴다. */}
          {(hero.bgDesktopUrl || hero.bgMobileUrl) && (
            <div className="hero-d-bg" aria-hidden="true">
              <div className="hero-d-bg-layer hero-bg-desktop"
                style={{backgroundImage: `url("${hero.bgDesktopUrl || hero.bgMobileUrl}")`}}/>
              <div className="hero-d-bg-layer hero-bg-mobile"
                style={{backgroundImage: `url("${hero.bgMobileUrl || hero.bgDesktopUrl}")`}}/>
              <div className="hero-d-scrim"/>
            </div>
          )}
          <div className="container">
            <div className="hero-d-eyebrow mono">{hero.eyebrow || 'BANGINOJA · 먹고 자고 놀자 와 인문학 여행'}</div>
            <h1 className="hero-d-title">
              {hero.title1 || '뱅기타고'}<br/>
              <span className="hero-d-outline">{hero.title2 || '한국을'}</span> {hero.title3 || '느끼다'}
            </h1>
            <p className="hero-d-sub bgnj-multiline">
              {hero.subtitle || '의식주(衣食住) 생활의 3요소에 행문(行文)이 결합되는 여정.\n먹고·자고·놀고·배우는 한국을, 뱅기노자와 함께 걷고 느낍니다.'}
            </p>
            <div className="hero-d-meta">
              {stats.map((stat) => (
                <div key={stat.l} className="hero-d-stat">
                  <div className="hero-d-num mono">{stat.v}</div>
                  <div className="hero-d-key mono">{stat.l}</div>
                </div>
              ))}
              <div className="hero-d-cta">
                <button type="button" className="btn btn-gold" onClick={() => go('column')}>
                  {hero.ctaPrimary || '기록 읽으러 가기'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </HomeSectionBoundary>

      {/* ── 티커 — 최근 기록 제목이 흐른다 (v00.293)
          실데이터만 쓴다. 칼럼이 없으면 렌더하지 않는다.
          prefers-reduced-motion 에서는 애니메이션이 멈추고 정적으로 남는다(styles.css). */}
      {publicColumns.length > 0 && (
        <HomeSectionBoundary label="티커">
          <section className="hero-ticker" aria-label="최근 기록">
            <div className="hero-ticker-track">
              {publicColumns.slice(0, 8).map((c) => (
                <span key={c.id} className="hero-ticker-item">{c.title}</span>
              ))}
              {/* 끊김 없이 이어지도록 같은 목록을 한 번 더 — aria 에서는 숨긴다 */}
              {publicColumns.slice(0, 8).map((c) => (
                <span key={`dup-${c.id}`} className="hero-ticker-item" aria-hidden="true">{c.title}</span>
              ))}
            </div>
          </section>
        </HomeSectionBoundary>
      )}

      {/* ── 히어로 사진 (v00.292) ─────────────────────────────────────
          관리자 → 사이트 콘텐츠 → 히어로 → '홈 사진' 에서 업로드.
          비어 있으면 이 블록 자체를 렌더하지 않는다 — 빈 자리를 남기지 않기 위함. */}
      {hero.photoWideUrl && (
        <HomeSectionBoundary label="히어로 사진">
          <section className="home-photo-wide" aria-label="답사 현장 사진">
            <div className="home-photo-wide-img" role="img"
              aria-label={hero.photoWideAlt || '뱅기노자 답사 현장'}
              style={{backgroundImage:`url(${hero.photoWideUrl})`}}/>
          </section>
        </HomeSectionBoundary>
      )}

      {/* ── 반전 블록 (v00.293 · D안) ────────────────────────────────
          좌: 최신 칼럼 (5편 자동 순환 — featuredIdx 로직 그대로 사용)
          우: 최신 답사 (잉크 배경) — 다크에서 오던 대비를 여기 한 번에 몰았다.
          한쪽이라도 데이터가 없으면 그쪽 칸을 렌더하지 않고, 둘 다 없으면 블록 자체가 사라진다. */}
      {(featuredColumn || featuredEvent) && (
        <HomeSectionBoundary label="반전 블록">
          <section className="home-split">
            {featuredColumn && (
              <div className="home-split-half"
                {...clickable(() => go('column'), `칼럼: ${featuredColumn.title}`)}
                onMouseEnter={() => setColumnPaused(true)}
                onMouseLeave={() => setColumnPaused(false)}>
                <div className="home-split-eb mono">{homeText.columnEyebrow || '이번 주의 기록'}</div>
                <h3 className="home-split-title">{featuredColumn.title}</h3>
                {featuredColumn.excerpt && (
                  <p className="home-split-body">{truncatePreview(featuredColumn.excerpt, 130)}</p>
                )}
                <span className="home-split-link mono">읽기 →</span>
              </div>
            )}
            {featuredEvent && (() => {
              const { item, isPast, label, route, pendKey } = featuredEvent;
              const poster = primaryImage(featuredEvent.kind, item.id);
              const title = item.topic || item.title;
              const when = item.next || _fmtEventDate(item);
              return (
                <div className="home-split-half home-split-half--ink home-split-half--event"
                  {...clickable(() => {
                    try { sessionStorage.setItem(pendKey, String(item.id)); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (HomePage.jsx:706)', _e); }
                    go(route);
                  }, `${label}: ${title}`)}>
                  {/* v00.293.002 — 포스터가 있으면 좌측에 세워 붙인다. 없으면 텍스트만 렌더 —
                      빈 액자를 남기지 않는다(rules: 깡통 카드 금지). */}
                  {poster && (
                    <div className="home-split-poster" role="img" aria-label={`${title} 포스터`}
                      style={{backgroundImage:`url(${poster})`}}/>
                  )}
                  <div className="home-split-eventtext">
                    <div className="home-split-eb mono">{isPast ? `지난 ${label}입니다` : `다음 ${label}`}</div>
                    <h3 className="home-split-title">{title}</h3>
                    {when && <div className="home-split-when mono">{when}</div>}
                    <p className="home-split-body">
                      {item.desc ? truncatePreview(item.desc, 110) : (item.venue || '')}
                    </p>
                    <span className="home-split-link mono">{isPast ? `지난 ${label} 보기` : `${label} 자세히 보기`} →</span>
                  </div>
                </div>
              );
            })()}
          </section>
        </HomeSectionBoundary>
      )}

      {/* ── 통합 기록 목록 (v00.293 · D안) ───────────────────────────
          칼럼·답사·강연을 날짜순 한 줄로 섞는다. 이전엔 세 섹션이 따로 있어
          같은 리듬(아이브로우→제목→전체보기→카드)이 세 번 반복됐다.
          유형은 우측 태그로만 구분한다. */}
      {recentEntries.length > 0 && (
        <HomeSectionBoundary label="최근 기록">
          <section className="home-feed">
            <div className="container">
              <div className="home-feed-head">
                <div className="home-feed-label mono">최근 기록</div>
                <button type="button" className="btn-ghost mono" style={{fontSize:11}}
                  onClick={() => go('column')}>전체 {publicColumns.length}편 →</button>
              </div>
              {/* v00.294.014 — 사용자 요청: 분류를 제목 앞에 대괄호 말머리로.
                  우측 끝의 작은 태그는 폭이 넓을수록 제목에서 멀어져 눈에 안 들어왔다.
                  제목 바로 앞에 붙이면 한 줄만 읽어도 무엇에 대한 기록인지 안다.
                  같은 값을 양쪽에 두면 중복이라 우측 태그는 걷어냈다. */}
              {recentEntries.map((it) => (
                <div key={`${it.kind}-${it.id}`} className="home-feed-row"
                  {...clickable(it.onGo, `${it.tag}: ${it.title}`)}>
                  <div className="home-feed-date mono">{it.date}</div>
                  <h4 className="home-feed-title">
                    <span className="home-feed-prefix mono" aria-hidden="true">[{it.tag}]</span>
                    {it.title}
                  </h4>
                </div>
              ))}
            </div>
          </section>
        </HomeSectionBoundary>
      )}

      {/* ── 소개 블록 + 세로 사진 (v00.292) ────────────────────────
          사진이 없으면 렌더하지 않는다. 사진이 생기면 좌측 사진 + 우측 문구 2단으로 뜬다. */}
      {hero.photoTallUrl && (
        <HomeSectionBoundary label="소개">
          <section className="home-intro-photo">
            <div className="container home-intro-photo-grid">
              <div className="home-intro-photo-img" role="img"
                aria-label={hero.photoTallAlt || '뱅기노자 답사 현장'}
                style={{backgroundImage:`url(${hero.photoTallUrl})`}}/>
              <div>
                <h2 className="section-title" style={{fontSize:29, lineHeight:1.55, marginBottom:16}}>
                  {publicColumns.length > 0
                    ? `${publicColumns.length}편의 기록이 쌓였습니다.`
                    : '걸어서 확인한 것만 기록합니다.'}
                </h2>
                <p style={{fontSize:13.5, lineHeight:2.05, color:'var(--ink-2)', marginBottom:22, maxWidth:460}}>
                  {homeText.introBody
                    || '걸어서 풍류 속으로, 걸어서 인물 속으로. 발로 확인한 것만 적었습니다. 지난 답사와 강연의 기록도 함께 남아 있습니다.'}
                </p>
                <button type="button" className="btn-ghost" onClick={() => go('column')}>전체 기록 보기 →</button>
              </div>
            </div>
          </section>
        </HomeSectionBoundary>
      )}

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


      {/* ── 책 CTA — v00.152 다권 카루셀 + 좌우 무한 반복 ────────────── */}
      <BookGridSection go={go} dataTick={dataTick} text={homeText}/>

    </div>
  );
};

// (window 노출 제거 — ESM 전환)

// v00.287 ESM (main) — 라우터용 export (window 병행).
export { HomePage };

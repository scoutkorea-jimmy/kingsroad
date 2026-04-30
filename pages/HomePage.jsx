// 뱅기노자 홈페이지 — 한국 여행·역사·문화 커뮤니티
// 데이터 소스 원칙: 시드(BANGINOJA_DATA.*) 폴백 없이 서버 적재 데이터(BGNJ_COLUMNS/TOURS/LECTURES/COMMUNITY)만 표시.
// 빈 섹션은 렌더하지 않음 — '깡통 카드' 노출 금지.

const DestinationMapModal = ({ onClose, go }) => {
  const [selectedDest, setSelectedDest] = React.useState(null);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="여행지 지도 탐색"
      style={{
        position:'fixed', inset:0, zIndex:200,
        background:'rgba(15,23,42,0.55)',
        display:'grid', placeItems:'center', padding:20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background:'var(--bg)', maxWidth:680, width:'100%', maxHeight:'92vh',
        overflow:'auto', padding:'32px 28px 28px', position:'relative',
        border:'1px solid var(--line)',
      }}>
        <button onClick={onClose} aria-label="닫기"
          style={{
            position:'absolute', top:14, right:14,
            width:36, height:36, fontSize:24,
            background:'transparent', border:'none', cursor:'pointer',
            color:'var(--ink-2)', lineHeight:1,
          }}>×</button>
        <div className="section-eyebrow" style={{marginBottom:14}}>DESTINATIONS · 여행지 지도</div>
        <h2 style={{fontFamily:'var(--font-display)', fontSize:26, fontWeight:900, marginBottom:10, lineHeight:1.2}}>
          지도를 클릭해 탐색하세요
        </h2>
        <p style={{fontSize:13, color:'var(--ink-2)', marginBottom:20, lineHeight:1.7}}>
          시도를 누르면 정보가 펼쳐집니다. 호버하면 지명이 표시됩니다.
        </p>
        {typeof KoreaMap === 'function' ? (
          <KoreaMap
            onSelect={(dest) => setSelectedDest(selectedDest?.id === dest.id ? null : dest)}
            selected={selectedDest?.id}
          />
        ) : (
          <div style={{height:300, display:'grid', placeItems:'center', color:'var(--ink-3)', fontSize:13}}>지도 로딩 중...</div>
        )}
        {selectedDest && (
          <div style={{
            marginTop:18, padding:'18px 20px',
            background:'var(--bg-2)', border:'1px solid var(--line)',
          }}>
            <div style={{display:'flex', alignItems:'baseline', gap:10, marginBottom:8, flexWrap:'wrap'}}>
              <span style={{fontFamily:'var(--font-serif)', fontSize:22, color:'var(--ink)', fontWeight:600}}>{selectedDest.name}</span>
              <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink-3)', letterSpacing:'0.12em'}}>{selectedDest.fullname}</span>
            </div>
            {selectedDest.desc && (
              <p style={{fontSize:14, color:'var(--ink-2)', lineHeight:1.7, marginBottom:12}}>{selectedDest.desc}</p>
            )}
            {selectedDest.tags && (
              <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:14}}>
                {String(selectedDest.tags).split('·').map((t) => t.trim()).filter(Boolean).map((t) => (
                  <span key={t} className="badge" style={{fontSize:10}}>{t}</span>
                ))}
              </div>
            )}
            <button className="btn btn-gold btn-small" onClick={() => { go('tour'); onClose(); }}>
              이 지역 투어 보기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
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
            background:'rgba(255,255,255,0.92)', border:'1px solid var(--line)', cursor:'pointer',
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

const HomePage = ({ go }) => {
  const [mapOpen, setMapOpen] = React.useState(false);
  const [scTick, setScTick] = React.useState(0);
  const [dataTick, setDataTick] = React.useState(0);

  // SEO/Hero/Brand refresh — 즉시 재렌더
  React.useEffect(() => {
    const onR = () => setScTick((v) => v + 1);
    window.addEventListener('bgnj-site-content-refresh', onR);
    return () => window.removeEventListener('bgnj-site-content-refresh', onR);
  }, []);

  // 서버 데이터 refresh 이벤트 — 컬럼/투어/강연/커뮤니티
  React.useEffect(() => {
    const tick = () => setDataTick((v) => v + 1);
    const evts = ['bgnj-columns-refresh', 'bgnj-tours-refresh', 'bgnj-lectures-refresh', 'bgnj-community-refresh'];
    evts.forEach((e) => window.addEventListener(e, tick));
    return () => evts.forEach((e) => window.removeEventListener(e, tick));
  }, []);

  const sc = React.useMemo(() => (window.BGNJ_SITE_CONTENT?.get?.() || {}), [scTick]);
  const hero = sc.hero || {};
  const recommendations = Array.isArray(sc.recommendations) ? sc.recommendations.filter(Boolean) : [];
  const [recDetail, setRecDetail] = React.useState(null);

  // 실데이터만 — 시드 폴백 제거. 모든 헬퍼 호출은 try/catch + Array.isArray 가드로 견고화.
  const safeArr = (fn) => { try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; } };
  const publicColumns = React.useMemo(() => safeArr(() => window.BGNJ_COLUMNS?.listPublic?.()), [dataTick]);
  const featuredColumn = publicColumns[0];
  const secondaryColumns = publicColumns.slice(1, 5);
  const recentPosts = React.useMemo(() => safeArr(() => window.BGNJ_COMMUNITY?.listPosts?.()).slice(0, 4), [dataTick]);
  const tours = React.useMemo(() => safeArr(() => window.BGNJ_TOURS?.listAll?.()).filter((t) => t && !t.hidden).slice(0, 4), [dataTick]);
  const lectures = React.useMemo(() => safeArr(() => window.BGNJ_LECTURES?.listAll?.()).filter((l) => l && !l.hidden).slice(0, 3), [dataTick]);

  const stats = [
    { l: '여행지', v: '전국', s: '주요 답사지 운영' },
    { l: '투어',   v: tours.length > 0 ? `${tours.length}개` : '준비 중', s: '직접 기획 프로그램' },
    { l: '커뮤니티', v: recentPosts.length > 0 ? `${recentPosts.length}+` : '운영 중', s: '함께 만드는 여행' },
  ];

  const clickable = (onClick, label) => ({
    role:'button', tabIndex:0, 'aria-label':label, onClick,
    onKeyDown:(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); onClick(); } },
    style:{cursor:'pointer'},
  });

  return (
    <div>
      {mapOpen && <DestinationMapModal onClose={() => setMapOpen(false)} go={go}/>}
      {recDetail && <RecommendationDetailModal rec={recDetail} onClose={() => setRecDetail(null)} go={go}/>}

      {/* ── HERO (단일 컬럼, 가운데 정렬) ───────────────────────────── */}
      <HomeSectionBoundary label="히어로"><section style={{
        position:'relative', overflow:'hidden',
        background:'var(--bg)', borderBottom:'1px solid var(--line)',
        padding:'88px 0 96px',
      }}>
        <div className="container">
          <div style={{maxWidth:760, margin:'0 auto', textAlign:'left'}}>
            <div className="section-eyebrow">
              <span>{hero.eyebrow || "BANGINOJA · 뱅기타고 노자"}</span>
            </div>
            <h1 style={{
              fontFamily:'var(--font-display)',
              fontSize:'clamp(40px, 6vw, 72px)',
              fontWeight:900,
              lineHeight:1.05,
              letterSpacing:'-0.02em',
              marginBottom:24,
              color:'var(--ink)',
            }}>
              {hero.title1 || "뱅기타고"}<br/>
              <span style={{color:'var(--primary)'}}>{hero.title2 || "한국을"}</span><br/>
              {hero.title3 || "느끼다"}
            </h1>
            <p style={{
              fontSize:17, lineHeight:1.85, color:'var(--ink-2)',
              maxWidth:560, marginBottom:36, fontWeight:500,
            }}>
              {hero.subtitle || "궁궐 답사부터 지역 여행 코스까지. 뱅기노자와 함께 한국의 역사·문화·자연을 온몸으로 경험하는 여행 커뮤니티입니다."}
            </p>
            <div style={{display:'flex', gap:14, flexWrap:'wrap', marginBottom:48}}>
              <button className="btn btn-gold" onClick={() => setMapOpen(true)} aria-haspopup="dialog">
                지도에서 여행지 찾기 →
              </button>
              <button className="btn" onClick={() => go('community')}>
                {hero.ctaPrimary || "커뮤니티 참여하기"}
              </button>
              <button className="btn" onClick={() => go('tour')}>
                {hero.ctaSecondary || "투어 프로그램 보기"}
              </button>
            </div>
            <div className="hero-stats" style={{
              display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20,
              paddingTop:28, borderTop:'1px solid var(--line)',
            }}>
              {stats.map((stat) => (
                <div key={stat.l}>
                  <div style={{
                    fontFamily:'var(--font-serif)', fontSize:22, fontWeight:600,
                    color:'var(--ink)', marginBottom:4,
                  }}>{stat.v}</div>
                  <div style={{
                    fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
                    letterSpacing:'0.22em', color:'var(--ink-2)',
                    textTransform:'uppercase', marginBottom:3,
                  }}>{stat.l}</div>
                  <div style={{fontSize:12, color:'var(--ink-3)'}}>{stat.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      </HomeSectionBoundary>

      {/* ── 뱅기노자 추천 (관리자 콘텐츠 패널에서 추가) ─────────────── */}
      {recommendations.length > 0 && (
        <HomeSectionBoundary label="뱅기노자 추천"><section className="section" style={{background:'var(--bg-2)', borderBottom:'1px solid var(--line)'}}>
          <div className="container">
            <SectionHead
              eyebrow="RECOMMENDATIONS · 뱅기노자 추천"
              title={<>뱅기노자가 <span className="accent">추천</span>합니다</>}
              subtitle="뱅기노자가 직접 걷고, 맛보고, 느낀 곳. 운영자가 큐레이션한 추천 여행지입니다."
              action={<button type="button" className="btn-ghost" onClick={() => go('tour')}>전체 프로그램 →</button>}
            />
            <div className="grid grid-3">
              {recommendations.map((r) => {
                const tags = Array.isArray(r.tags) ? r.tags : (typeof r.tags === 'string' ? r.tags.split(/[,·]/).map((s) => s.trim()).filter(Boolean) : []);
                return (
                  <article key={r.id || r.name}
                    className="card"
                    {...clickable(() => setRecDetail(r), `${r.name || '추천'} 상세 보기`)}
                    style={{cursor:'pointer'}}>
                    <div style={{
                      height:160, marginBottom:18, position:'relative', overflow:'hidden',
                      background: r.imageDataUri ? `url(${r.imageDataUri}) center/cover` : 'var(--bg-3)',
                      borderBottom: r.imageDataUri ? 'none' : '1px solid var(--line)',
                    }}>
                      {r.region && (
                        <div style={{
                          position:'absolute', top:10, left:12,
                          padding:'3px 8px', background:'rgba(255,255,255,0.92)',
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
                    <h3 className="ko-serif" style={{fontSize:22, fontWeight:600, marginBottom:5}}>{r.name || '제목 없음'}</h3>
                    {r.subtitle && (
                      <div style={{
                        fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600,
                        color:'var(--secondary)', letterSpacing:'0.05em', marginBottom:10,
                      }}>{r.subtitle}</div>
                    )}
                    {r.desc && <p style={{fontSize:13, lineHeight:1.7, color:'var(--ink-2)'}}>{r.desc}</p>}
                  </article>
                );
              })}
            </div>
          </div>
        </section></HomeSectionBoundary>
      )}

      {/* ── 투어 프로그램 ─────────────────────────────────────────────── */}
      {tours.length > 0 && (
        <HomeSectionBoundary label="투어 프로그램"><section className="section" style={{borderBottom:'1px solid var(--line)'}}>
          <div className="container">
            <SectionHead
              eyebrow="TOUR PROGRAM · 뱅기노자 투어"
              title={<>직접 걷는 <span className="accent">답사 여행</span></>}
              subtitle="뱅기노자가 직접 기획·운영하는 소규모 답사 프로그램. 깊이 있는 해설과 함께하는 여행."
              action={<button type="button" className="btn-ghost" onClick={() => go('tour')}>전체 프로그램 →</button>}
            />
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
                  {t.desc && <p className="dim" style={{fontSize:13, lineHeight:1.7, marginBottom:20}}>{t.desc}</p>}
                  <div style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    borderTop:'1px solid var(--line)', paddingTop:16,
                  }}>
                    <div>
                      <div className="mono" style={{fontSize:10, fontWeight:600, letterSpacing:'0.18em', color:'var(--ink-3)'}}>다음 일정</div>
                      <div style={{fontSize:14, marginTop:4, color:'var(--ink)', fontWeight:500}}>{t.next || '—'}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="mono" style={{fontSize:10, fontWeight:600, letterSpacing:'0.18em', color:'var(--ink-3)'}}>참가비</div>
                      <div className="ko-serif" style={{fontSize:20, marginTop:4, color:'var(--ink)', fontWeight:600}}>{t.price ? (typeof t.price === 'number' ? `${t.price.toLocaleString()}원` : t.price) : '—'}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section></HomeSectionBoundary>
      )}

      {/* ── 커뮤니티 ─────────────────────────────────────────────────── */}
      <HomeSectionBoundary label="커뮤니티"><section className="section" style={{background:'var(--bg-2)', borderBottom:'1px solid var(--line)'}}>
        <div className="container">
          <SectionHead
            eyebrow="COMMUNITY · 여행 이야기"
            title={<>함께 만들어가는 <span className="accent">여행</span></>}
            subtitle="여행 경험을 나누고, 코스를 추천하고, 함께 떠날 동행을 찾습니다."
            action={<button type="button" className="btn-ghost" onClick={() => go('community')}>커뮤니티 가기 →</button>}
          />
          {recentPosts.length > 0 ? (
            <div style={{border:'1px solid var(--line)'}}>
              {recentPosts.map((post, i) => (
                <div key={post.id}
                  {...clickable(() => go('community'), post.title)}
                  style={{
                    display:'flex', gap:20, alignItems:'center',
                    padding:'18px 24px',
                    background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)',
                    borderBottom: i < recentPosts.length - 1 ? '1px solid var(--line)' : 'none',
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
                    <span>댓글 {post.replies ?? 0}</span>
                    <span style={{color:'var(--ink-2)'}}>→</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{textAlign:'center', padding:60}}>
              <div style={{fontFamily:'var(--font-serif)', fontSize:20, color:'var(--ink)', marginBottom:12, fontWeight:600}}>
                첫 번째 여행 이야기를 써주세요
              </div>
              <p style={{fontSize:13, color:'var(--ink-2)', marginBottom:24, lineHeight:1.7}}>
                커뮤니티에 여행 경험을 나누면 더 많은 여행자들이 모여듭니다.
              </p>
              <button className="btn btn-gold" onClick={() => go('community')}>글 작성하기 →</button>
            </div>
          )}
        </div>
      </section></HomeSectionBoundary>

      {/* ── 뱅기노자 칼럼 ─────────────────────────────────────────────── */}
      {featuredColumn && (
        <HomeSectionBoundary label="칼럼"><section className="section" style={{borderBottom:'1px solid var(--line)'}}>
          <div className="container">
            <SectionHead
              eyebrow="COLUMN · 뱅기노자의 글"
              title={<><span className="accent">뱅기노자</span>가 쓰다</>}
              subtitle="한국의 역사·문화·여행을 깊이 있게 풀어내는 뱅기노자의 정기 칼럼."
              action={<button type="button" className="btn-ghost" onClick={() => go('column')}>칼럼 전체 보기 →</button>}
            />
            <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:40}} className="col-grid">
              {/* 피처드 칼럼 */}
              <div className="card"
                style={{padding:0, overflow:'hidden', cursor:'pointer'}}
                {...clickable(() => go('column'), `칼럼: ${featuredColumn.title}`)}>
                {featuredColumn.coverImage ? (
                  <div style={{
                    height:200, backgroundImage:`url(${featuredColumn.coverImage})`,
                    backgroundSize:'cover', backgroundPosition:'center',
                  }}/>
                ) : (
                  <div style={{
                    height:140, background:'var(--bg-2)', borderBottom:'1px solid var(--line)',
                    display:'grid', placeItems:'center',
                  }}>
                    <div style={{fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600, color:'var(--ink-3)', letterSpacing:'0.28em'}}>FEATURED COLUMN</div>
                  </div>
                )}
                <div style={{padding:30}}>
                  <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:14, flexWrap:'wrap'}}>
                    {featuredColumn.category && <span className="pill">{featuredColumn.category}</span>}
                    {featuredColumn.date && <span className="mono dim-2" style={{fontSize:11}}>{featuredColumn.date}</span>}
                    {featuredColumn.readTime && <span className="mono dim-2" style={{fontSize:11}}>· {featuredColumn.readTime}</span>}
                  </div>
                  <h3 className="ko-serif" style={{fontSize:26, fontWeight:600, lineHeight:1.3, marginBottom:12}}>
                    {featuredColumn.title}
                  </h3>
                  {featuredColumn.excerpt && (
                    <p style={{fontSize:14, lineHeight:1.75, color:'var(--ink-2)'}}>{featuredColumn.excerpt}</p>
                  )}
                  <div className="mono" style={{fontSize:11, fontWeight:700, letterSpacing:'0.2em', marginTop:20, color:'var(--secondary)'}}>더 읽기 →</div>
                </div>
              </div>
              {/* 서브 칼럼 목록 */}
              <div>
                {secondaryColumns.map((c) => (
                  <div key={c.id}
                    {...clickable(() => go('column'), `칼럼: ${c.title}`)}
                    style={{padding:'18px 0', borderBottom:'1px solid var(--line)', cursor:'pointer'}}>
                    <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:8, flexWrap:'wrap'}}>
                      {c.category && <span className="pill" style={{fontSize:9, padding:'2px 8px'}}>{c.category}</span>}
                      {c.date && <span className="mono dim-2" style={{fontSize:10}}>{c.date}</span>}
                    </div>
                    <h4 className="ko-serif" style={{fontSize:17, fontWeight:600, lineHeight:1.4, marginBottom:5}}>{c.title}</h4>
                    {c.excerpt && <p style={{fontSize:12, lineHeight:1.6, color:'var(--ink-3)'}}>{(c.excerpt||'').slice(0,65)}…</p>}
                  </div>
                ))}
                {secondaryColumns.length === 0 && (
                  <p style={{fontSize:13, color:'var(--ink-3)', padding:'18px 0'}}>다음 칼럼 준비 중입니다.</p>
                )}
              </div>
            </div>
          </div>
        </section></HomeSectionBoundary>
      )}

      {/* ── 강연 일정 ─────────────────────────────────────────────────── */}
      {lectures.length > 0 && (
        <HomeSectionBoundary label="강연"><section className="section-tight" style={{background:'var(--bg-2)', borderBottom:'1px solid var(--line)'}}>
          <div className="container">
            <SectionHead
              eyebrow="LECTURE · 뱅기노자 강연"
              title={<>이번 달 <span className="accent">강연 일정</span></>}
              action={<button type="button" className="btn-ghost" onClick={() => go('lectures')}>전체 강연 보기 →</button>}
            />
            <div className="grid grid-3">
              {lectures.map((lecture) => (
                <article key={lecture.id}
                  className="card"
                  {...clickable(() => {
                    try { sessionStorage.setItem('bgnj_pending_lecture_id', String(lecture.id)); } catch {}
                    go('lectures');
                  }, `강연: ${lecture.topic || lecture.title}`)}
                  style={{cursor:'pointer'}}>
                  <span className="badge" style={{marginBottom:16}}>강연</span>
                  <h3 className="ko-serif" style={{fontSize:20, fontWeight:600, marginBottom:8}}>{lecture.topic || lecture.title}</h3>
                  {lecture.note && <p style={{fontSize:13, lineHeight:1.7, color:'var(--ink-2)', marginBottom:16}}>{lecture.note}</p>}
                  <div style={{borderTop:'1px solid var(--line)', paddingTop:12, display:'flex', justifyContent:'space-between'}}>
                    <span style={{fontSize:12, color:'var(--ink-2)'}}>{lecture.venue || '—'}</span>
                    <span style={{fontSize:12, fontFamily:'var(--font-mono)', fontWeight:600, color:'var(--ink)'}}>{lecture.next || '—'}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section></HomeSectionBoundary>
      )}

      {/* ── 책 CTA ───────────────────────────────────────────────────── */}
      <HomeSectionBoundary label="책 CTA"><section className="section">
        <div className="container">
          <div className="card cta-grid" style={{
            padding:'72px 60px',
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center',
            background:'var(--bg-2)', border:'1px solid var(--line)',
          }}>
            <div>
              <div className="section-eyebrow">뱅기노자 출판 · 2026</div>
              <h2 style={{
                fontFamily:'var(--font-serif)', fontSize:'clamp(36px, 4vw, 52px)',
                fontWeight:600, lineHeight:1.1, marginBottom:16,
              }}>
                『왕의길』
              </h2>
              <p style={{fontSize:15, lineHeight:1.85, color:'var(--ink-2)', marginBottom:28}}>
                뱅기노자가 15년간 쌓아올린 궁궐 답사와 역사 독해의 결실.
                조선의 왕들이 걸었던 길을 통해 오늘의 여행을 다시 읽다.
              </p>
              <div style={{display:'flex', gap:20, marginBottom:32}}>
                <div>
                  <div className="mono" style={{fontSize:10, fontWeight:600, letterSpacing:'0.18em', color:'var(--ink-3)'}}>국문판</div>
                  <div className="ko-serif" style={{fontSize:22, marginTop:4, color:'var(--ink)', fontWeight:700}}>28,000원</div>
                </div>
                <div style={{width:1, background:'var(--line-2)'}}/>
                <div>
                  <div className="mono" style={{fontSize:10, fontWeight:600, letterSpacing:'0.18em', color:'var(--ink-3)'}}>영문판</div>
                  <div className="ko-serif" style={{fontSize:22, marginTop:4, color:'var(--ink)', fontWeight:700}}>35,000원</div>
                </div>
              </div>
              <button className="btn btn-gold" onClick={() => go('book')}>구매하기 →</button>
            </div>
            <div style={{
              aspectRatio:'3/4', maxWidth:280, margin:'0 auto',
              background:'var(--bg)', border:'1px solid var(--line-2)',
              display:'grid', placeItems:'center',
            }}>
              <div style={{textAlign:'center', padding:'0 24px'}}>
                <div style={{fontFamily:'var(--font-serif)', fontSize:28, color:'var(--ink)', marginBottom:10, fontWeight:600}}>왕의길</div>
                <div style={{fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600, color:'var(--ink-3)', letterSpacing:'0.28em', marginBottom:6}}>WANG-EUI-GIL</div>
                <div style={{fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600, color:'var(--ink-3)', letterSpacing:'0.2em'}}>뱅기노자 지음</div>
              </div>
            </div>
          </div>
        </div>
      </section></HomeSectionBoundary>

    </div>
  );
};

Object.assign(window, { HomePage });

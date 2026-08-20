// 뱅기노자 신규 홈페이지 프리뷰 — /home-next
// 디자인 이미지 기반: 스크롤 없이 한 화면(1 viewport)에 4 섹션 배치.

// ── 관리자 이미지 업로드 슬롯 ──
const HnImageSlot = ({ url, label, onUpload, onRemove, wide }) => {
  const ref = React.useRef(null);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url: uploaded } = await window.BGNJ_MEDIA.uploadFile(file, { folder: 'home-next', maxBytes: 5 * 1024 * 1024 });
      onUpload(uploaded);
    } catch {
      try {
        if (file.size > 1.5 * 1024 * 1024) { window.BGNJ_TOAST?.error?.('파일이 1.5MB 초과'); return; }
        const dataUri = await new Promise((res, rej) => {
          const r = new FileReader(); r.onload = () => res(String(r.result || '')); r.onerror = rej; r.readAsDataURL(file);
        });
        onUpload(dataUri);
      } catch (err2) { window.BGNJ_TOAST?.error?.('이미지 읽기 실패'); }
    }
    if (ref.current) ref.current.value = '';
  };
  return (
    <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:3}}>
      <div style={{fontSize:9, color:'#78350F', fontWeight:500, textAlign:'center', maxWidth:wide?120:72, lineHeight:1.3}}>{label}</div>
      <div onClick={() => ref.current?.click()} style={{
        width: wide ? 120 : 64, height: 64, border:'2px dashed #D6D3D1', borderRadius:6,
        display:'grid', placeItems:'center', cursor:'pointer', overflow:'hidden', background:'#FFF',
      }}>
        {url ? <img src={url} alt={label} style={{width:'100%',height:'100%',objectFit:'cover'}}/> :
          <span style={{fontSize:10, color:'var(--ink-3)'}}>업로드</span>}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{display:'none'}} onChange={handleFile}/>
      {url && <button type="button" onClick={onRemove} style={{
        position:'absolute', top:14, right:-3, width:16, height:16, borderRadius:'50%',
        border:'none', background:'#EF4444', color:'#FFF', fontSize:9, cursor:'pointer',
        display:'grid', placeItems:'center',
      }}>✕</button>}
    </div>
  );
};

const HomeNextPage = ({ go }) => {
  const G = window.BGNJ_GUARD || {
    arr: (fn) => { try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; } },
    call: (fn, fb) => { try { const v = fn(); return v === undefined ? fb : v; } catch { return fb; } },
  };

  const [scTick, setScTick] = React.useState(0);
  React.useEffect(() => {
    const onR = () => setScTick((v) => v + 1);
    window.addEventListener('bgnj-site-content-refresh', onR);
    return () => window.removeEventListener('bgnj-site-content-refresh', onR);
  }, []);
  const sc = React.useMemo(() => (window.BGNJ_SITE_CONTENT?.get?.() || {}), [scTick]);
  const hero = sc.hero || {};
  const hn = sc.homeNext || {};
  const isAdmin = !!window.BGNJ_AUTH?.currentUser?.()?.isAdmin;
  const [adminOpen, setAdminOpen] = React.useState(false);

  const saveHn = async (patch) => {
    try {
      await window.BGNJ_SITE_CONTENT?.saveSection?.('homeNext', patch);
      setScTick((v) => v + 1);
    } catch (err) { window.BGNJ_TOAST?.error?.('저장 실패: ' + (err?.message || '')); }
  };
  const updateImage = (key, index, url) => {
    const arr = [...(hn[key] || [])];
    arr[index] = url || '';
    saveHn({ [key]: arr });
  };

  // ── 동적 통계 ──
  const [postsTick, setPostsTick] = React.useState(0);
  const [toursTick, setToursTick] = React.useState(0);
  React.useEffect(() => {
    const onP = () => setPostsTick((v) => v + 1);
    const onT = () => setToursTick((v) => v + 1);
    window.addEventListener('bgnj-posts-refresh', onP);
    window.addEventListener('bgnj-tours-refresh', onT);
    return () => { window.removeEventListener('bgnj-posts-refresh', onP); window.removeEventListener('bgnj-tours-refresh', onT); };
  }, []);
  const allPosts = React.useMemo(() => G.arr(() => window.BGNJ_COMMUNITY?.listPosts?.()), [postsTick]);
  const activeTours = React.useMemo(() => G.arr(() => window.BGNJ_TOURS?.listAll?.()).filter((t) => t && !t.hidden), [toursTick]);
  const pressCount = React.useMemo(() => allPosts.filter((p) => {
    const cat = String(p.category || '').toLowerCase();
    const board = String(p.boardName || p.board || '').toLowerCase();
    return cat.includes('언론') || board.includes('언론');
  }).length, [allPosts]);

  const ctaIcons = hn.ctaIcons || [];
  const programImages = hn.programImages || [];
  const statIcons = hn.statIcons || [];
  const overrides = hn.statsOverrides || {};

  const books = G.arr(() => window.BGNJ_BOOKS?.list?.({ status: 'published' }));
  const bookCovers = books.filter((b) => b.coverDataUri).slice(0, 3);

  // ── 데이터 정의 ──
  const heroCtas = [
    { label: '현대 사관\n모집', action: () => go('community') },
    { label: '탐방 프로그램\n신청하기', action: () => go('tour') },
    { label: '출간 실록\n(도서)', action: () => go('book') },
    { label: '영상 실록\n(유튜브)', action: () => { try { window.open('https://www.youtube.com/@banginoja', '_blank', 'noopener'); } catch (_e) { console.warn('[bgnj] HomeNextPage.jsx:105 오류(무시하고 진행)', _e); } } },
  ];

  const statsData = [
    { label: '사초(기록)', value: allPosts.length > 0 ? `${allPosts.length.toLocaleString('ko-KR')}+` : (overrides.posts || '-'), sub: '탐방 기록 콘텐츠' },
    { label: '탐방 프로그램', value: activeTours.length > 0 ? `${activeTours.length}+` : (overrides.tours || '-'), sub: '다양한 역사탐방 코스' },
    { label: '참여한 사관(탐방자)', value: overrides.members || '-', sub: '함께한 인문기행 동행' },
    { label: '언론 보도', value: pressCount > 0 ? `${pressCount}+` : (overrides.press || '-'), sub: '언론·방송 보도' },
    { label: '나눔과 기부', value: overrides.donation || '20%', sub: '수익의 20% 사회 환원' },
  ];

  return (
    <div className="hn-page">

      {/* ═══ 관리자 패널 ═══ */}
      {isAdmin && (
        <div className="hn-admin-bar">
          <button type="button" className="hn-admin-toggle" onClick={() => setAdminOpen(!adminOpen)}>
            🛠 홈 프리뷰 이미지 설정 {adminOpen ? '▲' : '▼'}
          </button>
          {adminOpen && (
            <div style={{padding:'0 20px 14px', display:'flex', flexDirection:'column', gap:14}}>
              <div>
                <div style={{fontSize:11, fontWeight:600, color:'#78350F', marginBottom:6}}>CTA 버튼 아이콘</div>
                <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                  {heroCtas.map((c, i) => (
                    <HnImageSlot key={i} url={ctaIcons[i]} label={c.label.replace('\n',' ')}
                      onUpload={(u) => updateImage('ctaIcons', i, u)} onRemove={() => updateImage('ctaIcons', i, '')}/>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:11, fontWeight:600, color:'#78350F', marginBottom:6}}>프로그램 카드 이미지</div>
                <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                  {['탐방 프로그램','출간 실록','언론 기록','영상 실록'].map((t, i) => (
                    <HnImageSlot key={i} url={programImages[i]} label={t} wide
                      onUpload={(u) => updateImage('programImages', i, u)} onRemove={() => updateImage('programImages', i, '')}/>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:11, fontWeight:600, color:'#78350F', marginBottom:6}}>통계 아이콘</div>
                <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                  {statsData.map((s, i) => (
                    <HnImageSlot key={i} url={statIcons[i]} label={s.label}
                      onUpload={(u) => updateImage('statIcons', i, u)} onRemove={() => updateImage('statIcons', i, '')}/>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:11, fontWeight:600, color:'#78350F', marginBottom:6}}>통계 수동 값</div>
                <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                  {[{k:'posts',l:'사초'},{k:'tours',l:'탐방'},{k:'members',l:'회원수'},{k:'press',l:'언론'},{k:'donation',l:'나눔'}].map(({k,l}) => (
                    <label key={k} style={{fontSize:11, display:'flex', alignItems:'center', gap:4}}>
                      {l}
                      <input type="text" value={overrides[k]||''} className="field-input"
                        style={{width:70, fontSize:11, padding:'3px 5px'}}
                        onChange={(e) => saveHn({statsOverrides:{...overrides,[k]:e.target.value}})}/>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ HERO — 배경 이미지 전폭, 좌측 텍스트 오버레이 ═══ */}
      <section className="hn-hero">
        {(hero.bgDesktopUrl || hero.bgMobileUrl) && (
          <div className="hn-hero-bg" style={{backgroundImage:`url(${hero.bgDesktopUrl||hero.bgMobileUrl})`}}/>
        )}
        <div className="hn-hero-fade"/>
        <div className="container hn-hero-inner">
          <h1 className="hn-h1">
            시간을 걷고,<br/>역사를 기록하고,<br/>
            <span className="hn-h1-accent">사람을 만나는 인문기행</span>
          </h1>
          <p className="hn-lead">뱅기노자는 현대의 사관입니다.</p>
          <p className="hn-sub">
            조선의 사관이 시대를 기록했듯,<br/>
            오늘 우리는 길 위에서 사람과 공간, 문화를 기록합니다.<br/>
            오늘의 경험을 내일의 실록으로 남기는 인문탐방 플랫폼입니다.
          </p>
          <div className="hn-cta-row">
            {heroCtas.map((c, i) => (
              <button key={i} type="button" className="hn-cta-pill" onClick={c.action}>
                {/* v00.281 — 아이콘 미업로드 시 회색 placeholder 박스(깨진 이미지처럼 보임) 미렌더. */}
                {ctaIcons[i] && (
                  <span className="hn-cta-pill-icon"><img src={ctaIcons[i]} alt=""/></span>
                )}
                <span className="hn-cta-pill-text">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 프로그램 카드 4열 ═══ */}
      <section className="hn-cards">
        <div className="container">
          <div className="hn-cards-grid">
            {/* 탐방 프로그램 */}
            <article className="hn-card hn-card--warm" onClick={() => go('tour')} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); go('tour'); } }}>
              {programImages[0] && <div className="hn-card-img" style={{backgroundImage:`url(${programImages[0]})`}}/>}
              <div className="hn-card-body">
                <h3 className="hn-card-title">탐방 프로그램</h3>
                <p className="hn-card-desc">왕의 길을 따라<br/>역사 속 현장을 걷다</p>
                <span className="hn-card-btn">프로그램 보기 →</span>
              </div>
            </article>

            {/* 출간 실록 — 책 표지 표시 */}
            <article className="hn-card hn-card--cream" onClick={() => go('book')} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); go('book'); } }}>
              <div className="hn-card-img hn-card-img--books">
                {programImages[1] ? (
                  <img src={programImages[1]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                ) : bookCovers.length > 0 ? (
                  <div style={{display:'flex', gap:6, justifyContent:'center', alignItems:'center', height:'100%', padding:'0 12px'}}>
                    {bookCovers.map((b) => <img key={b.id} src={b.coverDataUri} alt={b.title} style={{height:'80%',borderRadius:3,boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}/>)}
                  </div>
                ) : <div className="hn-card-img-ph">도서 이미지</div>}
              </div>
              <div className="hn-card-body">
                <h3 className="hn-card-title">출간 실록</h3>
                <p className="hn-card-desc">우리가 기록한<br/>역사의 순간들</p>
                <span className="hn-card-btn">도서 보기 →</span>
              </div>
            </article>

            {/* 언론 기록 */}
            <article className="hn-card hn-card--light" onClick={() => go('column')} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); go('column'); } }}>
              <div className="hn-card-img">
                {programImages[2] ? (
                  <img src={programImages[2]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                ) : <div className="hn-card-img-ph">언론 이미지</div>}
              </div>
              <div className="hn-card-body">
                <h3 className="hn-card-title">언론 기록</h3>
                <p className="hn-card-desc">언론이 기록한<br/>뱅기노자의 발자취</p>
                <span className="hn-card-btn">기사 보기 →</span>
              </div>
            </article>

            {/* 영상 실록 */}
            <article className="hn-card hn-card--dark" role="button" tabIndex={0}
              onClick={() => { try { window.open('https://www.youtube.com/@banginoja','_blank','noopener'); } catch (_e) { console.warn('[bgnj] HomeNextPage.jsx:254 오류(무시하고 진행)', _e); } }}
              onKeyDown={(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); try { window.open('https://www.youtube.com/@banginoja','_blank','noopener'); } catch (_e) { console.warn('[bgnj] HomeNextPage.jsx:255 오류(무시하고 진행)', _e); } } }}>
              <div className="hn-card-img">
                {programImages[3] ? (
                  <img src={programImages[3]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                ) : <div className="hn-card-img-ph" style={{color:'#A8A29E'}}>영상 이미지</div>}
                <div className="hn-yt-badge">
                  <svg viewBox="0 0 40 28" width="40" height="28"><rect rx="6" width="40" height="28" fill="#FF0000"/><polygon points="16,6 16,22 29,14" fill="#FFF"/></svg>
                </div>
              </div>
              <div className="hn-card-body">
                <h3 className="hn-card-title">영상 실록</h3>
                <p className="hn-card-desc">5분 역사 이야기부터<br/>현장 탐방 영상까지</p>
                <span className="hn-card-btn">영상 보러가기 →</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ═══ 통계 5열 ═══ */}
      <section className="hn-stats">
        <div className="container">
          <div className="hn-stats-row">
            {statsData.map((s, i) => (
              <div key={s.label} className="hn-stat">
                <span className="hn-stat-ic">
                  {statIcons[i] ? <img src={statIcons[i]} alt="" className="hn-stat-ic-img"/> :
                    <span className="hn-stat-ic-ph">{['📋','🗺','👥','📰','❤'][i]}</span>}
                </span>
                <div>
                  <div className="hn-stat-lbl">{s.label}</div>
                  <div className="hn-stat-val">{s.value}</div>
                  <div className="hn-stat-sub">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 하단 CTA 3열 ═══ */}
      <section className="hn-foot">
        <div className="container">
          <div className="hn-foot-grid">
            <div className="hn-foot-quote">
              <blockquote className="hn-bq">
                "한 걸음의 기록이<br/>한 시대의 기억이 됩니다."
              </blockquote>
            </div>
            <div className="hn-foot-about">
              <p className="hn-foot-about-text">
                뱅기노자는 사람과 공간, 시간과 문화를 연결하여<br/>
                오늘의 경험을 내일의 기록으로 남깁니다.
              </p>
              <button type="button" className="hn-foot-about-btn" onClick={() => go('column')}>
                뱅기노자 소개 보기 →
              </button>
            </div>
            <div className="hn-foot-cta">
              <h3 className="hn-foot-cta-h">현대 사관이 되어주세요.</h3>
              <p className="hn-foot-cta-p">당신의 시선과 기록이<br/>역사가 되는 길에 함께 합니다.</p>
              <button type="button" className="hn-foot-cta-btn" onClick={() => go('signup')}>
                현대 사관단 가입하기 →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// (window 노출 제거 — ESM 전환)

// v00.287 ESM (main) — 라우터용 export (window 병행).
export { HomeNextPage };

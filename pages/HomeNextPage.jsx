// 뱅기노자 신규 홈페이지 프리뷰 — /home-next
// 디자인 이미지 기반: 스크롤 없이 한 화면(1 viewport)에 4 섹션 배치.
// 시각 검토 완료 후 기존 HomePage 교체 예정.

// ── 관리자 이미지 업로드 슬롯 ──
const HnImageSlot = ({ url, label, onUpload, onRemove }) => {
  const ref = React.useRef(null);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url: uploaded } = await window.BGNJ_MEDIA.uploadFile(file, { folder: 'home-next', maxBytes: 5 * 1024 * 1024 });
      onUpload(uploaded);
    } catch (err) {
      // R2 실패 → dataURI 폴백
      try {
        if (file.size > 1.5 * 1024 * 1024) {
          window.BGNJ_TOAST?.error?.('R2 업로드 실패 + 파일이 1.5MB 초과');
          return;
        }
        const dataUri = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        onUpload(dataUri);
      } catch (err2) {
        window.BGNJ_TOAST?.error?.('이미지 읽기 실패: ' + (err2?.message || ''));
      }
    }
    if (ref.current) ref.current.value = '';
  };
  return (
    <div className="hn-admin-slot">
      <div className="hn-admin-slot-label">{label}</div>
      <div className="hn-admin-slot-preview" onClick={() => ref.current?.click()}>
        {url ? (
          <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>클릭하여 업로드</span>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      {url && <button type="button" className="hn-admin-slot-remove" onClick={onRemove}>✕</button>}
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

  // ── site_content_kv 저장 헬퍼 ──
  const saveHn = async (patch) => {
    try {
      await window.BGNJ_SITE_CONTENT?.saveSection?.('homeNext', patch);
      setScTick((v) => v + 1);
    } catch (err) {
      window.BGNJ_TOAST?.error?.('저장 실패: ' + (err?.message || ''));
    }
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
    return () => {
      window.removeEventListener('bgnj-posts-refresh', onP);
      window.removeEventListener('bgnj-tours-refresh', onT);
    };
  }, []);
  const allPosts = React.useMemo(() => G.arr(() => window.BGNJ_COMMUNITY?.listPosts?.()), [postsTick]);
  const activeTours = React.useMemo(() => {
    return G.arr(() => window.BGNJ_TOURS?.listAll?.()).filter((t) => t && !t.hidden);
  }, [toursTick]);
  // 언론보도 = 카테고리/게시판명에 '언론' 포함
  const pressCount = React.useMemo(() => {
    return allPosts.filter((p) => {
      const cat = String(p.category || '').toLowerCase();
      const board = String(p.boardName || p.board || '').toLowerCase();
      return cat.includes('언론') || board.includes('언론');
    }).length;
  }, [allPosts]);

  const ctaIcons = hn.ctaIcons || [];
  const programImages = hn.programImages || [];

  // ── 히어로 CTA 4개 정의 ──
  const heroCtas = [
    { label: '현대 사관\n모집', action: () => go('community') },
    { label: '탐방 프로그램\n신청하기', action: () => go('tour') },
    { label: '출간 실록\n(도서)', action: () => go('book') },
    { label: '영상 실록\n(유튜브)', action: () => { try { window.open('https://www.youtube.com/@banginoja', '_blank', 'noopener'); } catch {} } },
  ];

  // ── 프로그램 카드 4개 ──
  const programs = [
    { title: '탐방 프로그램', desc: '왕의 길을 따라\n역사 속 현장을 걷다', cta: '프로그램 보기 →', action: () => go('tour'), variant: 'warm' },
    { title: '출간 실록', desc: '우리가 기록한\n역사의 순간들', cta: '도서 보기 →', action: () => go('book'), variant: 'cream' },
    { title: '언론 기록', desc: '언론이 기록한\n뱅기노자의 발자취', cta: '기사 보기 →', action: () => go('column'), variant: 'light' },
    { title: '영상 실록', desc: '5분 역사 이야기부터\n현장 탐방 영상까지', cta: '영상 보러가기 →', action: () => { try { window.open('https://www.youtube.com/@banginoja', '_blank', 'noopener'); } catch {} }, variant: 'dark' },
  ];

  // 책 표지 이미지 (출간 실록 카드용)
  const books = G.arr(() => window.BGNJ_BOOKS?.list?.({ status: 'published' }));
  const bookCovers = books.filter((b) => b.coverDataUri).slice(0, 3);

  // ── 통계: 동적 데이터 우선, 없으면 관리자 수동 입력(hn.statsOverrides) ──
  const overrides = hn.statsOverrides || {};
  const statsData = [
    { icon: ctaIcons[0], label: '사초(기록)', value: allPosts.length > 0 ? `${allPosts.length.toLocaleString('ko-KR')}+` : (overrides.posts || '0'), sub: '탐방 기록 콘텐츠' },
    { icon: ctaIcons[1], label: '탐방 프로그램', value: activeTours.length > 0 ? `${activeTours.length}+` : (overrides.tours || '0'), sub: '다양한 역사탐방 코스' },
    { icon: ctaIcons[2], label: '참여한 사관(탐방자)', value: overrides.members || '0', sub: '함께한 인문기행 동행' },
    { icon: ctaIcons[3], label: '언론 보도', value: pressCount > 0 ? `${pressCount}+` : (overrides.press || '0'), sub: '언론·방송 보도' },
    { icon: null, label: '나눔과 기부', value: overrides.donation || '20%', sub: '수익의 20% 사회 환원' },
  ];

  return (
    <div className="hn-page">

      {/* ═══ 관리자 이미지 업로드 패널 ═══ */}
      {isAdmin && (
        <div className="hn-admin-panel">
          <button type="button" className="hn-admin-toggle" onClick={() => setAdminOpen(!adminOpen)}>
            🛠 홈 프리뷰 이미지 설정 {adminOpen ? '▲' : '▼'}
          </button>
          {adminOpen && (
            <div className="hn-admin-body">
              <div className="hn-admin-section">
                <h4>CTA 버튼 아이콘 (4개)</h4>
                <div className="hn-admin-row">
                  {heroCtas.map((c, i) => (
                    <HnImageSlot key={i}
                      url={ctaIcons[i]}
                      label={c.label.replace('\n', ' ')}
                      onUpload={(url) => updateImage('ctaIcons', i, url)}
                      onRemove={() => updateImage('ctaIcons', i, '')} />
                  ))}
                </div>
              </div>
              <div className="hn-admin-section">
                <h4>프로그램 카드 배경 이미지 (4개)</h4>
                <div className="hn-admin-row">
                  {programs.map((p, i) => (
                    <HnImageSlot key={i}
                      url={programImages[i]}
                      label={p.title}
                      onUpload={(url) => updateImage('programImages', i, url)}
                      onRemove={() => updateImage('programImages', i, '')} />
                  ))}
                </div>
              </div>
              <div className="hn-admin-section">
                <h4>통계 수동 입력 (데이터 없을 때 표시)</h4>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    { key: 'posts', label: '사초(기록)' },
                    { key: 'tours', label: '탐방 프로그램' },
                    { key: 'members', label: '회원 수' },
                    { key: 'press', label: '언론보도' },
                    { key: 'donation', label: '나눔 비율' },
                  ].map(({ key, label }) => (
                    <label key={key} style={{ fontSize: 12 }}>
                      {label}
                      <input type="text" value={overrides[key] || ''}
                        className="field-input"
                        style={{ width: 80, marginLeft: 6, fontSize: 12, padding: '4px 6px' }}
                        onChange={(e) => saveHn({ statsOverrides: { ...overrides, [key]: e.target.value } })} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="hn-hero">
        {(hero.bgDesktopUrl || hero.bgMobileUrl) && (
          <div className="hn-hero-bg" aria-hidden="true"
            style={{ backgroundImage: `url(${hero.bgDesktopUrl || hero.bgMobileUrl})` }} />
        )}
        <div className="hn-hero-overlay" aria-hidden="true" />
        <div className="container hn-hero-inner">
          <div className="hn-hero-text">
            <h1 className="hn-title">
              시간을 걷고,<br />
              역사를 기록하고,<br />
              <span className="hn-title-accent">사람을 만나는 인문기행</span>
            </h1>
            <p className="hn-subtitle-bold">뱅기노자는 현대의 사관입니다.</p>
            <p className="hn-desc">
              조선의 사관이 시대를 기록했듯,<br />
              오늘 우리는 길 위에서 사람과 공간, 문화를 기록합니다.<br />
              오늘의 경험을 내일의 실록으로 남기는 인문탐방 플랫폼입니다.
            </p>
            <div className="hn-hero-ctas">
              {heroCtas.map((c, i) => (
                <button key={c.label} type="button" className="hn-hero-cta-btn" onClick={c.action}>
                  {ctaIcons[i] ? (
                    <img src={ctaIcons[i]} alt="" className="hn-hero-cta-icon-img" />
                  ) : (
                    <span className="hn-hero-cta-icon-placeholder" />
                  )}
                  <span className="hn-hero-cta-label">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: 프로그램 카드 4열 ═══ */}
      <section className="hn-programs">
        <div className="container">
          <div className="hn-programs-grid">
            {programs.map((p, i) => (
              <article key={p.title}
                className={`hn-program-card hn-program-card--${p.variant}`}
                onClick={p.action}
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.action(); } }}>
                {/* 카드 배경 이미지 */}
                {programImages[i] && (
                  <div className="hn-program-card-bg" aria-hidden="true"
                    style={{ backgroundImage: `url(${programImages[i]})` }} />
                )}
                <h3 className="hn-program-title">{p.title}</h3>
                <p className="hn-program-desc">{p.desc}</p>
                {/* 출간 실록 카드: 책 표지 미니 썸네일 */}
                {p.variant === 'cream' && bookCovers.length > 0 && (
                  <div className="hn-program-books">
                    {bookCovers.map((b) => (
                      <img key={b.id} src={b.coverDataUri} alt={b.title}
                        className="hn-program-book-thumb" />
                    ))}
                  </div>
                )}
                {/* 영상 실록 카드: 유튜브 아이콘 */}
                {p.variant === 'dark' && (
                  <div className="hn-program-yt-icon" aria-hidden="true">
                    <svg viewBox="0 0 48 34" width="48" height="34">
                      <rect rx="8" width="48" height="34" fill="#FF0000"/>
                      <polygon points="19,8 19,26 34,17" fill="#FFF"/>
                    </svg>
                  </div>
                )}
                <span className="hn-program-cta">{p.cta}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: 통계 ═══ */}
      <section className="hn-stats">
        <div className="container">
          <div className="hn-stats-grid">
            {statsData.map((s) => (
              <div key={s.label} className="hn-stat-item">
                {s.icon ? (
                  <img src={s.icon} alt="" className="hn-stat-icon-img" />
                ) : (
                  <span className="hn-stat-icon-placeholder">❤</span>
                )}
                <div className="hn-stat-body">
                  <div className="hn-stat-label">{s.label}</div>
                  <div className="hn-stat-value">{s.value}</div>
                  <div className="hn-stat-sub">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: 하단 CTA ═══ */}
      <section className="hn-bottom">
        <div className="container">
          <div className="hn-bottom-grid">
            <div className="hn-bottom-quote">
              <blockquote className="hn-quote-text">
                "한 걸음의 기록이<br />한 시대의 기억이 됩니다."
              </blockquote>
            </div>
            <div className="hn-bottom-about">
              <p className="hn-about-text">
                뱅기노자는 사람과 공간, 시간과 문화를 연결하여
                오늘의 경험을 내일의 기록으로 남깁니다.
              </p>
              <button type="button" className="hn-about-btn" onClick={() => go('column')}>
                뱅기노자 소개 보기 →
              </button>
            </div>
            <div className="hn-bottom-cta">
              <h3 className="hn-cta-heading">현대 사관이 되어주세요.</h3>
              <p className="hn-cta-desc">
                당신의 시선과 기록이<br />역사가 되는 길에 함께 합니다.
              </p>
              <button type="button" className="hn-cta-btn" onClick={() => go('signup')}>
                현대 사관단 가입하기 →
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

Object.assign(window, { HomeNextPage });

// 뱅기노자 신규 홈페이지 프리뷰 — /home-next
// 디자인 이미지 기반: 스크롤 없이 한 화면(1 viewport)에 4 섹션 배치.
// 시각 검토 완료 후 기존 HomePage 교체 예정.

const HomeNextPage = ({ go }) => {
  const G = window.BGNJ_GUARD || {
    arr: (fn) => { try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; } },
    call: (fn, fb) => { try { const v = fn(); return v === undefined ? fb : v; } catch { return fb; } },
  };

  const sc = React.useMemo(() => (window.BGNJ_SITE_CONTENT?.get?.() || {}), []);
  const hero = sc.hero || {};

  // ── 히어로 CTA 4개 정의 ──
  const heroCtas = [
    { icon: '📋', label: '현대 사관 모집', action: () => go('community') },
    { icon: '🗺', label: '탐방 프로그램 신청하기', action: () => go('tour') },
    { icon: '📖', label: '출간 실록 (도서)', action: () => go('book') },
    { icon: '▶', label: '영상 실록 (유튜브)', action: () => { try { window.open('https://www.youtube.com/@banginoja', '_blank', 'noopener'); } catch {} } },
  ];

  // ── 프로그램 카드 4개 ──
  const programs = [
    {
      title: '탐방 프로그램',
      desc: '왕의 길을 따라\n역사 속 현장을 걷다',
      cta: '프로그램 보기 →',
      action: () => go('tour'),
      variant: 'warm',
    },
    {
      title: '출간 실록',
      desc: '우리가 기록한\n역사의 순간들',
      cta: '도서 보기 →',
      action: () => go('book'),
      variant: 'cream',
    },
    {
      title: '언론 기록',
      desc: '언론이 기록한\n뱅기노자의 발자취',
      cta: '기사 보기 →',
      action: () => go('column'),
      variant: 'light',
    },
    {
      title: '영상 실록',
      desc: '5분 역사 이야기부터\n현장 탐방 영상까지',
      cta: '영상 보러가기 →',
      action: () => { try { window.open('https://www.youtube.com/@banginoja', '_blank', 'noopener'); } catch {} },
      variant: 'dark',
    },
  ];

  // ── 통계 5개 ──
  const statsData = [
    { icon: '📋', label: '사초(기록)', value: '1,200+', sub: '탐방 기록 콘텐츠' },
    { icon: '🗺', label: '탐방 프로그램', value: '40+', sub: '다양한 역사탐방 코스' },
    { icon: '👥', label: '참여한 사관(탐방자)', value: '3,000+', sub: '함께한 인문기행 동행' },
    { icon: '📰', label: '언론 보도', value: '100+', sub: '언론·방송 보도' },
    { icon: '❤', label: '나눔과 기부', value: '20%', sub: '수익의 20% 사회 환원' },
  ];

  // 책 표지 이미지 (출간 실록 카드용)
  const books = G.arr(() => window.BGNJ_BOOKS?.list?.({ status: 'published' }));
  const bookCovers = books.filter((b) => b.coverDataUri).slice(0, 3);

  return (
    <div className="hn-page">

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
              {heroCtas.map((c) => (
                <button key={c.label} type="button" className="hn-hero-cta-btn" onClick={c.action}>
                  <span className="hn-hero-cta-icon">{c.icon}</span>
                  <span>{c.label}</span>
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
            {programs.map((p) => (
              <article key={p.title}
                className={`hn-program-card hn-program-card--${p.variant}`}
                onClick={p.action}
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.action(); } }}>
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
                <span className="hn-stat-icon">{s.icon}</span>
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
            {/* 좌: 인용문 */}
            <div className="hn-bottom-quote">
              <blockquote className="hn-quote-text">
                "한 걸음의 기록이<br />한 시대의 기억이 됩니다."
              </blockquote>
            </div>
            {/* 중: 소개 */}
            <div className="hn-bottom-about">
              <p className="hn-about-text">
                뱅기노자는 사람과 공간, 시간과 문화를 연결하여
                오늘의 경험을 내일의 기록으로 남깁니다.
              </p>
              <button type="button" className="hn-about-btn" onClick={() => go('column')}>
                뱅기노자 소개 보기 →
              </button>
            </div>
            {/* 우: 가입 CTA */}
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

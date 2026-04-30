// 공통 컴포넌트: Nav, Footer, Tweaks, Brand, AuthorGradeBadge, NotificationBell, ScrollToTop

// 페이지 우하단 '맨 위로' 플로팅 버튼 — 일정 거리 이상 스크롤된 후 노출
const ScrollToTop = () => {
  const [visible, setVisible] = React.useState(false);
  const findScroller = () => {
    // 관리자 페이지는 내부 컨테이너가 따로 스크롤되므로 그쪽도 함께 감시
    return document.querySelector('main')?.closest('main') || document.documentElement;
  };
  const getScrollY = () => {
    const adminScroller = document.querySelector('div[aria-label="관리자 메뉴"] + div');
    if (adminScroller) {
      return Math.max(adminScroller.scrollTop || 0, window.scrollY || 0);
    }
    return window.scrollY || 0;
  };
  React.useEffect(() => {
    const onScroll = () => setVisible(getScrollY() > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const adminScroller = document.querySelector('div[aria-label="관리자 메뉴"] + div');
    if (adminScroller) adminScroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (adminScroller) adminScroller.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goTop = () => {
    const adminScroller = document.querySelector('div[aria-label="관리자 메뉴"] + div');
    if (adminScroller && adminScroller.scrollTop > 0) {
      adminScroller.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="맨 위로"
      title="맨 위로"
      style={{
        position: 'fixed', right: 24, bottom: 28, zIndex: 60,
        width: 48, height: 48,
        background: 'var(--bg-2)', color: 'var(--gold)',
        border: '1px solid var(--gold-dim)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-serif)',
        fontSize: 22,
      }}>
      ↑
    </button>
  );
};


// 작성자 등급 배지 — 게시글/댓글 작성자 옆에 인라인으로 표시
const AuthorGradeBadge = ({ authorId, author, authorEmail, size = "sm" }) => {
  const grade = window.BGNJ_AUTHOR_GRADE?.({ authorId, author, authorEmail });
  if (!grade) return null;
  const small = size === "sm";
  return (
    <span
      className="mono"
      title={`${grade.label} · ${grade.desc || ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: 6,
        padding: small ? '1px 6px' : '2px 8px',
        fontSize: small ? 9 : 10,
        letterSpacing: '0.14em',
        color: grade.color || 'var(--gold)',
        border: `1px solid ${grade.color || 'var(--gold-dim)'}`,
        borderRadius: 2,
        textTransform: 'uppercase',
        verticalAlign: 'middle',
      }}>
      {grade.label}
    </span>
  );
};

// 알림 벨 — 우상단 내비게이션에 노출
const NotificationBell = ({ user, onPick }) => {
  const [open, setOpen] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  const ref = React.useRef(null);

  // 다른 탭/세션에서 알림이 추가되면 storage 이벤트로 갱신
  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'bgnj_notifications') setTick((t) => t + 1);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // 외부 클릭으로 닫기
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!user) return null;
  const list = window.BGNJ_COMMUNITY?.listNotifications(user.id) || [];
  const unread = list.filter((n) => !n.read).length;

  const pick = (n) => {
    window.BGNJ_COMMUNITY.markNotificationRead(user.id, n.id);
    setOpen(false);
    if (onPick) onPick(n);
    setTick((t) => t + 1);
  };

  const markAll = () => {
    window.BGNJ_COMMUNITY.markAllNotificationsRead(user.id);
    setTick((t) => t + 1);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="btn btn-small"
        aria-label={`알림 ${unread > 0 ? `${unread}건 안 읽음` : ''}`}
        onClick={() => setOpen((v) => !v)}
        style={{ position: 'relative', padding: '6px 10px', minWidth: 36 }}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          style={{ display: 'block', verticalAlign: 'middle' }}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
        {unread > 0 && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', top: -4, right: -4,
              background: 'var(--gold)', color: 'var(--bg)',
              borderRadius: 999, fontSize: 9, fontWeight: 700,
              padding: '1px 5px', letterSpacing: 0,
              minWidth: 14, textAlign: 'center', lineHeight: 1.4,
            }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="알림 목록"
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 320, maxHeight: 400, overflow: 'auto',
            background: 'var(--bg-2)', border: '1px solid var(--line)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            zIndex: 50,
          }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono gold" style={{ fontSize: 10, letterSpacing: '0.22em' }}>알림 · {list.length}</span>
            {unread > 0 && (
              <button type="button" onClick={markAll} className="btn-ghost"
                style={{ fontSize: 11, color: 'var(--ink-2)' }}>모두 읽음</button>
            )}
          </div>
          {list.length === 0 ? (
            <div className="dim" style={{ padding: 24, textAlign: 'center', fontSize: 13 }}>
              아직 받은 알림이 없습니다.
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {list.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => pick(n)}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '12px 14px',
                      background: n.read ? 'transparent' : 'rgba(245,213,72,0.06)',
                      borderBottom: '1px solid var(--line)',
                      cursor: 'pointer',
                    }}>
                    <div style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.5 }}>
                      <span className="gold">{n.fromName}</span>
                      <span className="dim"> · {n.message || '새 알림'}</span>
                    </div>
                    {n.postTitle && (
                      <div className="dim" style={{ fontSize: 11, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        ▸ {n.postTitle}
                      </div>
                    )}
                    <div className="mono dim-2" style={{ fontSize: 10, marginTop: 4, letterSpacing: '0.1em' }}>
                      {new Date(n.createdAt).toLocaleString('ko-KR')}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

// 뱅기노자 브랜드 마크 — 노란 라운드 사각형 + 'B' 컷아웃 + 뱅기 + 별들.
// PDF 원본 기반으로 SVG 재구성. 주 색상은 브랜드 노란색 #F5D548.
const BanginojaIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    {/* 라운드 사각형 배경 */}
    <rect width="64" height="64" rx="9" ry="9" fill="#F5D548"/>
    {/* 'B' 컷아웃 — 두 개의 둥근 볼륨이 좌측 세로 기둥에 붙은 형태. fillRule=evenodd 로 안쪽 빈 공간을 컷아웃. */}
    <path
      fillRule="evenodd"
      d="M 9 8 L 9 56 L 32 56 C 42 56 47 51 47 44.5 C 47 39.5 44 36 39.5 35 C 43 33.5 45.5 30.5 45.5 26 C 45.5 18.5 40 14 30 14 L 9 14 Z M 18 19 L 28 19 C 33 19 36 21 36 25 C 36 29 33 31 28 31 L 18 31 Z M 18 36 L 30 36 C 36 36 39 38.5 39 43 C 39 47.5 36 50 30 50 L 18 50 Z"
      fill="#FFFFFF"/>
    {/* 뱅기 (비행기) — B 의 상단 빈 공간을 가로지르며 좌측 위에서 우측 아래로 */}
    <path
      d="M 26 22.5 C 27 21.5 28 21.5 28.5 22.5 L 31 27 L 38 25 C 38.8 24.8 39.4 25.2 39.5 26 C 39.6 26.6 39.3 27.1 38.8 27.4 L 32.5 30.7 L 33.5 36.5 L 36 37.8 C 36.4 38 36.5 38.4 36.3 38.7 C 36.2 39 35.9 39.1 35.6 39 L 31.5 38 L 28 39.5 C 27.7 39.6 27.3 39.4 27.2 39 C 27.1 38.7 27.3 38.4 27.6 38.2 L 30 37 L 28.7 32 L 24 33.5 C 23.4 33.7 22.9 33.4 22.8 32.8 C 22.7 32.3 23 31.9 23.5 31.7 L 27.5 30.2 L 26.3 26 L 25.5 24.5 C 25.2 24 25.4 23.3 26 23 Z"
      fill="#F5D548"/>
    {/* 별 (sparkle) — 4-점 다이아몬드 5 개. 우측 상단에서 우측 하단으로 흩어짐 */}
    <g fill="#FFFFFF">
      <path d="M 53 15 L 54.5 18 L 57.5 19.5 L 54.5 21 L 53 24 L 51.5 21 L 48.5 19.5 L 51.5 18 Z"/>
      <path d="M 58 26 L 59 28 L 61 29 L 59 30 L 58 32 L 57 30 L 55 29 L 57 28 Z"/>
      <path d="M 50 33 L 50.7 34.5 L 52.2 35 L 50.7 35.5 L 50 37 L 49.3 35.5 L 47.8 35 L 49.3 34.5 Z"/>
      <path d="M 55 40 L 55.5 41 L 56.5 41.5 L 55.5 42 L 55 43 L 54.5 42 L 53.5 41.5 L 54.5 41 Z"/>
      <path d="M 59 36 L 59.4 37 L 60.4 37.5 L 59.4 38 L 59 39 L 58.6 38 L 57.6 37.5 L 58.6 37 Z"/>
    </g>
  </svg>
);

const Brand = ({ onClick }) => {
  const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
  const brand = sc.brand || { name: "뱅기노자", sub: "BANGINOJA" };
  const logo = sc.branding?.logoDataUri;
  return (
    <button
      className="brand"
      onClick={onClick}
      aria-label={`${brand.name} 홈으로`}
      style={{background:'none', border:'none', padding:0, cursor:'pointer'}}>
      <span className="brand-mark" aria-hidden="true">
        {logo
          ? <img src={logo} alt="" style={{width:22, height:22, objectFit:'contain', display:'block'}}/>
          : <BanginojaIcon size={22}/>}
      </span>
      <span className="brand-name">
        {brand.name}
        <span className="sub" lang="en">{brand.sub}</span>
      </span>
    </button>
  );
};

const Nav = ({ route, go, user, onLogout }) => {
  const navL = (window.BGNJ_SITE_CONTENT?.get?.() || {}).nav || {};
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // 라우트 변경 시 모바일 메뉴 자동 닫힘
  React.useEffect(() => { setMobileOpen(false); }, [route]);
  // 모바일 메뉴 열림 시: Escape 닫기 + body scroll lock + viewport 확대 시 자동 닫힘
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    const onResize = () => { if (window.innerWidth > 900) setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);
  // 놀자 메가메뉴 자식 (의식주: 먹고/자고/사고). "놀자" 자체 클릭 시 첫 항목으로 진입.
  const playChildren = [
    { key: "eat",   label: navL.eat   || "먹고 놀자",  desc: "식 食 — 한정식·향토음식·시장" },
    { key: "sleep", label: navL.sleep || "자고 놀자",  desc: "주 住 — 한옥·고택·템플스테이" },
    { key: "shop",  label: navL.shop  || "사고 놀자",  desc: "의 衣 — 전통공예·토산물" },
  ];
  const playKeys = playChildren.map((p) => p.key);

  const items = [
    { key: "home", label: navL.home || "홈" },
    { key: "play", label: navL.play || "놀자", isMega: 'play', defaultRoute: 'eat' },
    { key: "tour", label: navL.tour || "투어" },
    { key: "lectures", label: navL.lectures || "강연" },
    { key: "column", label: navL.column || "칼럼" },
    { key: "community", label: navL.community || "커뮤니티", isMega: 'community' },
  ];
  // 커뮤니티 메가메뉴: BGNJ_STORES.categories의 boardType=community + 사용자 등급 가시 카테고리
  const userLevel = window.BGNJ_USER_LEVEL ? window.BGNJ_USER_LEVEL(user) : (user ? 10 : 0);
  const communityBoards = (window.BGNJ_STORES?.categories || [])
    .filter((c) => c.boardType === 'community' && userLevel >= (c.minLevel ?? 0));

  const goBoard = (boardId) => {
    try { sessionStorage.setItem('bgnj_pending_board_id', boardId); } catch {}
    go('community');
  };

  // 활성 상태 판정 — 메가 그룹은 자식 라우트도 활성으로 간주
  const isActive = (it) => {
    if (it.isMega === 'play') return playKeys.includes(route);
    return route === it.key;
  };

  return (
    <nav className={`nav ${mobileOpen ? 'mobile-open' : ''}`} aria-label="주 메뉴">
      <div className="container nav-inner">
        <Brand onClick={() => go("home")} />
        <button
          type="button"
          className="nav-toggle"
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={mobileOpen}
          aria-controls="primary-nav-menu"
          onClick={() => setMobileOpen((v) => !v)}>
          <span className="nav-toggle-bars" aria-hidden="true"/>
        </button>
        <ul id="primary-nav-menu" className="nav-menu" role="list" style={{listStyle:'none', margin:0, padding:0}}>
          {items.map(it => {
            const hasMega = it.isMega === 'play' || (it.isMega === 'community' && communityBoards.length > 0);
            const onClick = () => go(it.defaultRoute || it.key);
            return (
              <li key={it.key} style={{position:'relative'}} className={hasMega ? 'nav-has-mega' : ''}>
                <button
                  type="button"
                  className={`nav-link ${isActive(it) ? "active" : ""}`}
                  aria-current={isActive(it) ? "page" : undefined}
                  aria-haspopup={hasMega ? 'menu' : undefined}
                  onClick={onClick}>{it.label}{hasMega ? ' ▾' : ''}</button>

                {it.isMega === 'play' && (
                  <div className="nav-mega" role="menu" aria-label="놀자 — 의식주 카테고리"
                    style={{
                      position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)',
                      minWidth:280, padding:'10px 0',
                      background:'var(--bg)', border:'1px solid var(--line)',
                      boxShadow:'0 16px 40px rgba(15,23,42,0.10)',
                      visibility:'hidden', opacity:0, transition:'opacity .12s ease',
                      zIndex:50,
                    }}>
                    <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', padding:'6px 16px 8px'}}>의식주 衣食住</div>
                    <ul style={{listStyle:'none', margin:0, padding:0}}>
                      {playChildren.map((p) => (
                        <li key={p.key}>
                          <button type="button" role="menuitem"
                            onClick={() => go(p.key)}
                            style={{
                              display:'block', width:'100%', textAlign:'left',
                              padding:'10px 16px',
                              background:'transparent', color:'var(--ink-2)', border:'none', cursor:'pointer',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                            <div style={{fontSize:13, fontWeight:500}}>{p.label}</div>
                            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.05em', marginTop:2}}>{p.desc}</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 모바일 전용: 놀자 메가 자식들을 인라인 펼침으로 노출 */}
                {it.isMega === 'play' && (
                  <ul className="nav-mobile-submenu" role="list" aria-label="놀자 하위" style={{listStyle:'none', margin:0, padding:0}}>
                    {playChildren.map((p) => (
                      <li key={p.key}>
                        <button type="button"
                          className={`nav-link nav-sub-link ${route === p.key ? 'active' : ''}`}
                          aria-current={route === p.key ? 'page' : undefined}
                          onClick={() => go(p.key)}>{p.label}</button>
                      </li>
                    ))}
                  </ul>
                )}
                {it.isMega === 'community' && communityBoards.length > 0 && (
                  <div className="nav-mega" role="menu" aria-label="게시판 목록"
                    style={{
                      position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)',
                      minWidth:220, padding:'10px 0',
                      background:'var(--bg)', border:'1px solid var(--line)',
                      boxShadow:'0 16px 40px rgba(15,23,42,0.10)',
                      visibility:'hidden', opacity:0, transition:'opacity .12s ease',
                      zIndex:50,
                    }}>
                    <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', padding:'6px 16px 8px'}}>BOARDS</div>
                    <ul style={{listStyle:'none', margin:0, padding:0}}>
                      {communityBoards.map((b) => (
                        <li key={b.id}>
                          <button type="button" role="menuitem"
                            onClick={() => goBoard(b.id)}
                            style={{
                              display:'block', width:'100%', textAlign:'left',
                              padding:'8px 16px', fontSize:13,
                              background:'transparent', color:'var(--ink-2)', border:'none', cursor:'pointer',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                            <span>{b.label}</span>
                          </button>
                        </li>
                      ))}
                      <li style={{borderTop:'1px solid var(--line)', marginTop:6, paddingTop:6}}>
                        <button type="button" role="menuitem"
                          onClick={() => go('community')}
                          style={{
                            display:'block', width:'100%', textAlign:'left',
                            padding:'8px 16px', fontSize:12, letterSpacing:'0.18em',
                            background:'transparent', color:'var(--secondary)', border:'none', cursor:'pointer',
                            fontFamily:'var(--font-mono)',
                          }}>전체 보기 →</button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
          {/* 모바일 전용: 사용자 액션을 메뉴 내부에 노출. 데스크탑에선 .nav-mobile-only CSS 로 숨김. */}
          <li className="nav-mobile-only nav-mobile-divider" aria-hidden="true"/>
          {user ? (
            <>
              <li className="nav-mobile-only">
                <button type="button" className="nav-link" onClick={() => go("mypage")}>마이페이지</button>
              </li>
              {user.isAdmin && (
                <li className="nav-mobile-only">
                  <button type="button" className="nav-link" onClick={() => go("admin")}>관리</button>
                </li>
              )}
              <li className="nav-mobile-only">
                <button type="button" className="nav-link" onClick={onLogout}>로그아웃</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-mobile-only">
                <button type="button" className="nav-link" onClick={() => go("login")}>로그인</button>
              </li>
              <li className="nav-mobile-only">
                <button type="button" className="nav-link" onClick={() => go("signup")}>회원가입</button>
              </li>
            </>
          )}
        </ul>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="mono" aria-label={`로그인: ${user.name}`}
                style={{fontSize:11, letterSpacing:'0.15em', color:'var(--ink-2)'}}>{user.name}</span>
              <NotificationBell user={user} onPick={(n) => {
                // 알림 타입별 라우팅 — 강연/투어/주문/댓글
                try {
                  if (n.type === 'comment' && n.postId) {
                    sessionStorage.setItem('bgnj_pending_post_id', String(n.postId));
                    go('community'); return;
                  }
                  if (n.type === 'lecture_confirmed' || n.type === 'lecture_promoted') {
                    if (n.lectureId) sessionStorage.setItem('bgnj_pending_lecture_id', String(n.lectureId));
                    go('lectures'); return;
                  }
                  if (n.type === 'tour_confirmed' || n.type === 'tour_promoted') {
                    if (n.tourId) sessionStorage.setItem('bgnj_pending_tour_id', String(n.tourId));
                    go('tour'); return;
                  }
                  if (String(n.type || '').startsWith('order_')) {
                    go('mypage'); return;
                  }
                  // 폴백 — postId가 있으면 커뮤니티
                  if (n.postId) {
                    sessionStorage.setItem('bgnj_pending_post_id', String(n.postId));
                    go('community');
                  }
                } catch {}
              }}/>
              <button className="btn btn-small" onClick={() => go("mypage")}>마이페이지</button>
              {user.isAdmin && (
                <button className="btn btn-small" onClick={() => go("admin")}>관리</button>
              )}
              <button className="btn btn-small" onClick={onLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button type="button" className="btn-ghost nav-link" onClick={() => go("login")}
                style={{fontSize:12, letterSpacing:'0.1em', color:'var(--ink-2)'}}>로그인</button>
              <button className="btn btn-small" onClick={() => go("signup")}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = ({ go }) => {
  const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
  const contact = sc.contact || {};
  const footer = sc.footer || {};
  const email = contact.email || "hello@bgnj.net";
  const phone = contact.phone || "02-0000-0000";
  const phoneHref = contact.phoneHref || ("tel:" + (phone || "").replace(/[^0-9+]/g, ""));
  const address = contact.address || "서울특별시";
  return (
    <footer className="footer" aria-label="사이트 정보 및 푸터">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Brand onClick={() => go("home")}/>
            <p className="dim" style={{marginTop:20, fontSize:13, lineHeight:1.7, maxWidth:360}}>
              {footer.description || "뱅기타고 노자. 뱅기노자는 한국의 역사·문화·자연을 직접 걷고 느끼며 나누는 여행 커뮤니티입니다. 궁궐 답사부터 지역 여행까지, 함께 만들어가는 여행."}
            </p>
          </div>
          <nav aria-label="콘텐츠 바로가기">
            <h4 id="ft-content">콘텐츠</h4>
            <ul aria-labelledby="ft-content">
              <li><button type="button" onClick={() => go("column")}>뱅기노자 칼럼</button></li>
              <li><button type="button" onClick={() => go("tour")}>투어 프로그램</button></li>
              <li><button type="button" onClick={() => go("book")}>『왕의길』</button></li>
              <li><button type="button" onClick={() => go("community")}>커뮤니티</button></li>
            </ul>
          </nav>
          <nav aria-label="정보 바로가기">
            <h4 id="ft-info">정보</h4>
            <ul aria-labelledby="ft-info">
              <li><button type="button" onClick={() => go("home")}>강연 일정</button></li>
              <li><button type="button" onClick={() => go("community")}>공지사항</button></li>
              <li><button type="button" onClick={() => go("faq")}>자주 묻는 질문</button></li>
              <li><button type="button" onClick={() => go("terms")}>이용약관</button></li>
              <li><button type="button" onClick={() => go("privacy")}>개인정보 처리방침</button></li>
            </ul>
          </nav>
          <address style={{fontStyle:'normal'}}>
            <h4 id="ft-contact">연락</h4>
            <ul aria-labelledby="ft-contact">
              {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
              {phone && <li><a href={phoneHref}>{phone}</a></li>}
              {address && <li><span>{address}</span></li>}
            </ul>
          </address>
        </div>
        <div className="footer-bottom" style={{marginTop:24}}>
          <span>© 2026 뱅기노자 BANGINOJA — ALL RIGHTS RESERVED</span>
          <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em'}}>
            v{window.BGNJ_VERSION?.version || '0.0.0'} · {window.BGNJ_VERSION?.build || '—'}
          </span>
          <span>{footer.signature || "뱅기타고 노자 · DESIGNED IN SEOUL"}</span>
        </div>
      </div>
    </footer>
  );
};

const Ornament = ({ children }) => (
  <div className="ornament" style={{margin:"40px 0"}}>
    <span style={{fontFamily:'var(--font-serif)', fontSize:14, letterSpacing:'0.3em', color:'var(--gold)'}}>
      {children || "五"}
    </span>
  </div>
);

// title accepts string OR React node. For accent, pass JSX: <>뱅기노자에 <span className="accent">전하는 말</span></>
const SectionHead = ({ eyebrow, title, subtitle, action, level = 2 }) => {
  const H = `h${level}`;
  return (
    <div className="section-head">
      <div>
        {eyebrow && <div className="section-eyebrow" aria-hidden="true">{eyebrow}</div>}
        <H className="section-title">{title}</H>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
};

const Tweaks = ({ tweaks, setTweaks, visible }) => {
  if (!visible) return null;
  const set = (k, v) => setTweaks({ ...tweaks, [k]: v });
  return (
    <div className="tweaks">
      <h3>Tweaks</h3>
      <div className="tweaks-row">
        <div className="tweaks-label">심볼 스타일</div>
        <div className="tweaks-options">
          {["outline", "filled", "dashed"].map(s => (
            <button key={s} className={tweaks.lineStyle === s ? "on" : ""}
              onClick={() => set("lineStyle", s)}>
              {s === "outline" ? "선" : s === "filled" ? "채움" : "파선"}
            </button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">골드 강도 · {tweaks.intensity.toFixed(1)}</div>
        <input type="range" className="tweaks-slider"
          min="0.3" max="1.8" step="0.1"
          value={tweaks.intensity}
          onChange={e => set("intensity", parseFloat(e.target.value))}/>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">히어로 레이아웃</div>
        <div className="tweaks-options">
          {["center", "split", "fullbleed"].map(s => (
            <button key={s} className={tweaks.heroLayout === s ? "on" : ""}
              onClick={() => set("heroLayout", s)}>
              {s === "center" ? "중앙" : s === "split" ? "분할" : "풀블리드"}
            </button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">인터랙션</div>
        <div className="tweaks-options">
          <button className={tweaks.interactive ? "on" : ""}
            onClick={() => set("interactive", !tweaks.interactive)}>
            {tweaks.interactive ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 쿠키 승인 배너 — 첫 방문 시 표시. 사용자가 결정하면 localStorage에 영속화.
// PIPA / GDPR 가이드라인: 필수(기능)는 사용자 거부 불가, 분석·마케팅은 옵트인.
// 저장 형태: { necessary:true, analytics:bool, marketing:bool, ts:ISO }
const CookieConsent = () => {
  const KEY = 'bgnj_cookie_consent';
  const [decision, setDecision] = React.useState(() => {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [details, setDetails] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);

  const persist = (next) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setDecision(next);
    try { window.dispatchEvent(new CustomEvent('bgnj-cookie-consent', { detail: next })); } catch {}
  };

  const acceptAll = () => persist({ necessary: true, analytics: true, marketing: true, ts: new Date().toISOString() });
  const rejectAll = () => persist({ necessary: true, analytics: false, marketing: false, ts: new Date().toISOString() });
  const saveCustom = () => persist({ necessary: true, analytics: !!analytics, marketing: !!marketing, ts: new Date().toISOString() });

  if (decision) return null;

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="cookie-banner-title"
      style={{
        position: 'fixed', left: 16, right: 16, bottom: 16,
        maxWidth: 720, margin: '0 auto', zIndex: 80,
        background: 'var(--bg-2)', border: '1px solid var(--gold-dim)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
        padding: '20px 22px', borderRadius: 4,
      }}>
      <h2 id="cookie-banner-title" className="ko-serif" style={{ fontSize: 16, marginBottom: 8 }}>쿠키 사용 동의</h2>
      <p className="dim" style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
        뱅기노자는 서비스 운영을 위한 <strong className="gold">필수 쿠키</strong>와, 사이트 개선을 위한
        <strong className="gold"> 분석 쿠키</strong>·<strong className="gold">마케팅 쿠키</strong>를 사용합니다.
        세부 설정에서 항목별로 선택하실 수 있어요.
      </p>
      {details && (
        <div style={{ marginBottom: 14, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="sr-only">쿠키 항목별 동의</legend>
            <div style={{ display: 'grid', gap: 10 }}>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', opacity: 0.7 }}>
                <input type="checkbox" checked readOnly aria-label="필수 쿠키 (항상 활성)"/>
                <span>
                  <strong style={{ fontSize: 13 }}>필수</strong>
                  <span className="dim" style={{ fontSize: 12, display: 'block' }}>로그인 세션, 보안, 필수 기능 동작에 사용. 거부 불가.</span>
                </span>
              </label>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)}
                  aria-label="분석 쿠키 동의"/>
                <span>
                  <strong style={{ fontSize: 13 }}>분석</strong>
                  <span className="dim" style={{ fontSize: 12, display: 'block' }}>방문 통계·페이지 성능 개선용. 식별자 익명 처리.</span>
                </span>
              </label>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)}
                  aria-label="마케팅 쿠키 동의"/>
                <span>
                  <strong style={{ fontSize: 13 }}>마케팅</strong>
                  <span className="dim" style={{ fontSize: 12, display: 'block' }}>관심사 기반 안내, 외부 광고 매체 연동에 사용.</span>
                </span>
              </label>
            </div>
          </fieldset>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-small" onClick={() => setDetails((v) => !v)}
          aria-expanded={details}>
          {details ? '간단히' : '세부 설정'}
        </button>
        <button type="button" className="btn btn-small" onClick={rejectAll}>모두 거부</button>
        {details
          ? <button type="button" className="btn btn-small btn-gold" onClick={saveCustom}>선택 저장</button>
          : <button type="button" className="btn btn-small btn-gold" onClick={acceptAll}>모두 동의</button>}
      </div>
    </div>
  );
};

Object.assign(window, { Brand, Nav, Footer, Ornament, SectionHead, Tweaks, AuthorGradeBadge, NotificationBell, ScrollToTop, BanginojaIcon, CookieConsent });

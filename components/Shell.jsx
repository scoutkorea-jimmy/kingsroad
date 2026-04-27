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
  const grade = window.WSD_AUTHOR_GRADE?.({ authorId, author, authorEmail });
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
      if (e.key === 'wsd_notifications') setTick((t) => t + 1);
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
  const list = window.WSD_COMMUNITY?.listNotifications(user.id) || [];
  const unread = list.filter((n) => !n.read).length;

  const pick = (n) => {
    window.WSD_COMMUNITY.markNotificationRead(user.id, n.id);
    setOpen(false);
    if (onPick) onPick(n);
    setTick((t) => t + 1);
  };

  const markAll = () => {
    window.WSD_COMMUNITY.markAllNotificationsRead(user.id);
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
        <span aria-hidden="true">◇</span>
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
                      background: n.read ? 'transparent' : 'rgba(212,175,55,0.06)',
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

const BanginojaIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {/* 비행기 — 뱅기노자 브랜드 마크 */}
    <path d="M21 14L13 9V4a1 1 0 0 0-2 0v5L3 14v2l8-2.5 2 6.5h2l2-6.5L21 16V14z"
      fill="var(--gold)"/>
  </svg>
);

const Brand = ({ onClick }) => (
  <button
    className="brand"
    onClick={onClick}
    aria-label="뱅기노자 홈으로"
    style={{background:'none', border:'none', padding:0, cursor:'pointer'}}>
    <span className="brand-mark" aria-hidden="true"><BanginojaIcon size={22}/></span>
    <span className="brand-name">
      뱅기노자
      <span className="sub" lang="en">BANGINOJA</span>
    </span>
  </button>
);

const Nav = ({ route, go, user, onLogout }) => {
  const items = [
    { key: "home", label: "홈" },
    { key: "community", label: "커뮤니티", subRouteKey: "community" },
    { key: "lectures", label: "강연" },
    { key: "tour", label: "투어 프로그램" },
    { key: "column", label: "뱅기노자 칼럼" },
    { key: "book", label: "왕의길" },
  ];
  // 커뮤니티 메가메뉴: WSD_STORES.categories의 boardType=community + 사용자 등급 가시 카테고리
  const userLevel = window.WSD_USER_LEVEL ? window.WSD_USER_LEVEL(user) : (user ? 10 : 0);
  const communityBoards = (window.WSD_STORES?.categories || [])
    .filter((c) => c.boardType === 'community' && userLevel >= (c.minLevel ?? 0));

  const goBoard = (boardId) => {
    try { sessionStorage.setItem('wsd_pending_board_id', boardId); } catch {}
    go('community');
  };

  return (
    <nav className="nav" aria-label="주 메뉴">
      <div className="container nav-inner">
        <Brand onClick={() => go("home")} />
        <ul className="nav-menu" role="list" style={{listStyle:'none', margin:0, padding:0}}>
          {items.map(it => (
            <li key={it.key} style={{position:'relative'}} className={it.key === 'community' ? 'nav-has-mega' : ''}>
              <button
                type="button"
                className={`nav-link ${route === it.key ? "active" : ""}`}
                aria-current={route === it.key ? "page" : undefined}
                onClick={() => go(it.key)}>{it.label}</button>
              {it.key === 'community' && communityBoards.length > 0 && (
                <div className="nav-mega" role="menu" aria-label="게시판 목록"
                  style={{
                    position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)',
                    minWidth:220, padding:'10px 0',
                    background:'var(--bg-2)', border:'1px solid var(--line)',
                    boxShadow:'0 16px 40px rgba(0,0,0,0.55)',
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
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(27,79,160,0.06)'; e.currentTarget.style.color = 'var(--gold)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)'; }}>
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
                          background:'transparent', color:'var(--gold)', border:'none', cursor:'pointer',
                          fontFamily:'var(--font-mono)',
                        }}>전체 보기 →</button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="mono" aria-label={`로그인: ${user.name}`}
                style={{fontSize:11, letterSpacing:'0.15em', color:'var(--gold)'}}>{user.name}</span>
              <NotificationBell user={user} onPick={(n) => {
                // 알림 타입별 라우팅 — 강연/투어/주문/댓글
                try {
                  if (n.type === 'comment' && n.postId) {
                    sessionStorage.setItem('wsd_pending_post_id', String(n.postId));
                    go('community'); return;
                  }
                  if (n.type === 'lecture_confirmed' || n.type === 'lecture_promoted') {
                    if (n.lectureId) sessionStorage.setItem('wsd_pending_lecture_id', String(n.lectureId));
                    go('lectures'); return;
                  }
                  if (n.type === 'tour_confirmed' || n.type === 'tour_promoted') {
                    if (n.tourId) sessionStorage.setItem('wsd_pending_tour_id', String(n.tourId));
                    go('tour'); return;
                  }
                  if (String(n.type || '').startsWith('order_')) {
                    go('mypage'); return;
                  }
                  // 폴백 — postId가 있으면 커뮤니티
                  if (n.postId) {
                    sessionStorage.setItem('wsd_pending_post_id', String(n.postId));
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

const Footer = ({ go }) => (
  <footer className="footer" aria-label="사이트 정보 및 푸터">
    <div className="container">
      <div className="footer-grid">
        <div>
          <Brand onClick={() => go("home")}/>
          <p className="dim" style={{marginTop:20, fontSize:13, lineHeight:1.7, maxWidth:360}}>
            비행기 타고 놀자. 뱅기노자는 한국의 역사·문화·자연을 직접 걷고 느끼며 나누는 여행 커뮤니티입니다. 궁궐 답사부터 지역 여행까지, 함께 만들어가는 여행.
          </p>
          <button type="button" className="btn btn-small" onClick={() => go("admin")}
            style={{marginTop:20}}>개인정보 처리 · 관리자</button>
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
            <li><a href="mailto:hello@banginoja.kr">hello@banginoja.kr</a></li>
            <li><a href="tel:+82-2-0000-0000">02-0000-0000</a></li>
            <li><span>서울특별시</span></li>
          </ul>
        </address>
      </div>
      <div
        className="card card-gold"
        style={{marginTop:24, padding:'14px 16px', display:'flex', justifyContent:'space-between', gap:12, alignItems:'center', flexWrap:'wrap'}}
        aria-label="현재 배포 버전 정보">
        <div>
          <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:6}}>CURRENT DEPLOY VERSION</div>
          <div className="ko-serif" style={{fontSize:22, color:'var(--gold-2)'}}>v{window.WSD_VERSION?.version || '0.0.0'}</div>
        </div>
        <div className="mono" style={{fontSize:11, letterSpacing:'0.16em', color:'var(--gold)'}}>
          build {window.WSD_VERSION?.build || '—'} · {window.WSD_VERSION?.channel || ''}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 뱅기노자 BANGINOJA — ALL RIGHTS RESERVED</span>
        <span className="mono" style={{color:'var(--gold-dim)'}}>
          v{window.WSD_VERSION?.version || '0.0.0'} · build {window.WSD_VERSION?.build || '—'} · {window.WSD_VERSION?.channel || ''}
        </span>
        <span>비행기 타고 놀자 · DESIGNED IN SEOUL</span>
      </div>
    </div>
  </footer>
);

const Ornament = ({ children }) => (
  <div className="ornament" style={{margin:"40px 0"}}>
    <span style={{fontFamily:'var(--font-serif)', fontSize:14, letterSpacing:'0.3em', color:'var(--gold)'}}>
      {children || "五"}
    </span>
  </div>
);

// title accepts string OR React node. For accent, pass JSX: <>왕사들에 <span className="accent">전하는 말</span></>
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

// IlwolMark를 BanginojaIcon으로 교체 — 기존 참조 호환 유지
const IlwolMark = BanginojaIcon;
Object.assign(window, { Brand, Nav, Footer, Ornament, SectionHead, Tweaks, AuthorGradeBadge, NotificationBell, ScrollToTop, BanginojaIcon, IlwolMark });

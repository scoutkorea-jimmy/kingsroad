// 뱅기노자 — 부트스트랩 (App + AppErrorBoundary + ReactDOM.render)
// v00.071 — index.html 의 인라인 <script type="text/babel"> 블록을 분리. esbuild 사전 컴파일.
// 전체 앱 에러 바운더리 — 흰 화면 방지 + 정확한 진단 정보 노출.
class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, info: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  componentDidCatch(err, info) {
    this.setState({ info });
    try { console.error('[AppErrorBoundary]', err, info); } catch {}
    // 렌더링 오류도 서버에 기록.
    try {
      window.BGNJ_API?.errorLog?.report({
        code: err?.code || (err?.name || 'RENDER_ERROR'),
        status: null, kind: 'render',
        message: err?.message || String(err),
        hint: '', url: '',
        pathname: location.pathname, origin: location.origin,
      })?.catch?.(() => {});
    } catch {}
  }
  render() {
    if (this.state.error) {
      const e = this.state.error;
      const code = e?.code || (e?.status ? `HTTP_${e.status}` : (e?.name || 'RENDER_ERROR'));
      const reason = e?.message || String(e);
      return (
        <div style={{padding:40, fontFamily:'monospace', color:'#1f2937', background:'#f8fafc', minHeight:'100vh'}}>
          <h2 style={{color:'#dc2626', marginBottom:12}}>⚠ 페이지 렌더링 오류</h2>
          <div style={{
            background:'#fff', padding:'14px 16px', border:'1px solid #fecaca',
            marginBottom:12, fontSize:13, lineHeight:1.7, color:'#1f2937',
          }}>
            <div style={{color:'#dc2626', fontSize:11, letterSpacing:'0.18em', marginBottom:6}}>
              CODE · {code}
            </div>
            <div style={{fontWeight:600, marginBottom:8}}>{reason}</div>
            {e?.stack && (
              <details style={{marginTop:8}}>
                <summary style={{cursor:'pointer', fontSize:11, color:'#475569'}}>스택 추적 (개발자용)</summary>
                <pre style={{whiteSpace:'pre-wrap', fontSize:11, color:'#475569', marginTop:8}}>{e.stack}</pre>
              </details>
            )}
            {this.state.info?.componentStack && (
              <details style={{marginTop:8}}>
                <summary style={{cursor:'pointer', fontSize:11, color:'#475569'}}>컴포넌트 스택 (개발자용)</summary>
                <pre style={{whiteSpace:'pre-wrap', fontSize:11, color:'#475569', marginTop:8}}>{this.state.info.componentStack}</pre>
              </details>
            )}
          </div>
          <div style={{display:'flex', gap:8}}>
            <button onClick={() => this.setState({error:null, info:null})} style={{padding:'8px 16px', cursor:'pointer'}}>다시 시도</button>
            <button onClick={() => { try { window.location.reload(); } catch {} }} style={{padding:'8px 16px', cursor:'pointer'}}>페이지 새로고침</button>
          </div>
          <p style={{marginTop:12, fontSize:11, color:'#64748b'}}>ⓘ 추가 정보는 브라우저 개발자 도구(F12) 콘솔에서 확인할 수 있습니다.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// 페이지별 에러 바운더리 — 한 페이지에서 던진 오류가 전역 트리를 깨뜨리지 않도록 격리.
// route 가 바뀌면 자동 reset (key prop 으로 강제 remount).
class PageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  componentDidCatch(err, info) {
    try { console.error('[PageErrorBoundary]', this.props.route, err, info); } catch {}
    try {
      window.BGNJ_API?.errorLog?.report({
        code: err?.code || (err?.name || 'PAGE_RENDER_ERROR'),
        status: null, kind: 'render',
        message: err?.message || String(err),
        hint: `route=${this.props.route}`, url: '',
        pathname: location.pathname, origin: location.origin,
      })?.catch?.(() => {});
    } catch {}
  }
  componentDidUpdate(prevProps) {
    if (prevProps.route !== this.props.route && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      const e = this.state.error;
      const code = e?.code || (e?.status ? `HTTP_${e.status}` : (e?.name || 'PAGE_RENDER_ERROR'));
      return (
        <div style={{padding:48, fontFamily:'sans-serif', minHeight:'60vh', textAlign:'center'}}>
          <div style={{fontFamily:'monospace', fontSize:11, color:'#dc2626', letterSpacing:'0.18em', marginBottom:8}}>{code}</div>
          <div style={{fontSize:18, color:'#0f172a', marginBottom:8, fontWeight:600}}>이 페이지를 불러오던 중 오류가 발생했습니다</div>
          <div style={{fontSize:13, color:'#475569', marginBottom:18, maxWidth:520, margin:'0 auto 18px', lineHeight:1.7}}>
            {e?.message || '알 수 없는 오류'}
          </div>
          <div style={{display:'inline-flex', gap:8}}>
            <button onClick={() => this.setState({ error: null })}
              style={{padding:'10px 18px', cursor:'pointer', border:'1px solid #cbd5e1', background:'#fff'}}>다시 시도</button>
            <button onClick={() => { try { this.props.go('home'); this.setState({ error: null }); } catch {} }}
              style={{padding:'10px 18px', cursor:'pointer', border:'1px solid #cbd5e1', background:'#fff'}}>홈으로</button>
            <button onClick={() => { try { window.location.reload(); } catch {} }}
              style={{padding:'10px 18px', cursor:'pointer', border:'1px solid #f5d548', background:'#f5d548', color:'#0f172a', fontWeight:600}}>새로고침</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// 전역 미처리 오류 토스트 — 비동기/Promise 거부와 자원 로드 실패까지 캡처.
// 모든 오류는 서버(D1.error_log) 에 자동 기록 + 10초 후 자동 소거.
const TOAST_DISMISS_MS = 10000;
// 무한 루프 가드 — error-log 엔드포인트 호출 자체가 실패할 때 또 토스트→report→fail 가 반복되는 것을 차단.
let __reportingError = false;
const reportErrorToServer = (entry) => {
  if (__reportingError) return;
  // error-log 엔드포인트 호출 자체에서 발생한 오류는 보고 대상에서 제외.
  if (typeof entry.url === 'string' && entry.url.includes('/api/error-log')) return;
  __reportingError = true;
  try {
    const p = window.BGNJ_API?.errorLog?.report({
      code: entry.code, status: entry.status, kind: entry.kind,
      message: entry.message, hint: entry.hint, url: entry.url,
      pathname: location.pathname, origin: location.origin,
    });
    if (p && typeof p.catch === 'function') {
      p.catch(() => {}).finally(() => { __reportingError = false; });
    } else {
      __reportingError = false;
    }
  } catch {
    __reportingError = false;
  }
};
const GlobalErrorToast = () => {
  const [errors, setErrors] = React.useState([]);
  React.useEffect(() => {
    const push = (entry) => {
      const id = Date.now() + Math.random();
      setErrors((prev) => [...prev, { id, ...entry }].slice(-3));
      reportErrorToServer(entry);
      // 10초 후 자동 소거.
      setTimeout(() => {
        setErrors((prev) => prev.filter((e) => e.id !== id));
      }, TOAST_DISMISS_MS);
    };
    const onRejection = (ev) => {
      const r = ev?.reason;
      if (!r) return;
      const code = r.code || (r.status ? `HTTP_${r.status}` : (r.name || 'PROMISE_REJECTION'));
      const message = r.message || String(r);
      push({ code, status: r.status || null, message, hint: r.hint || '', url: r.url || '', kind: r.kind || 'unknown' });
      try { console.error('[GlobalErrorToast]', r); } catch {}
    };
    const onError = (ev) => {
      const message = ev?.message || ev?.error?.message || 'Script error';
      push({ code: 'WINDOW_ERROR', status: null, message, hint: '', url: ev?.filename || '', kind: 'unknown' });
      try { console.error('[GlobalErrorToast]', ev?.error || ev); } catch {}
    };
    window.addEventListener('unhandledrejection', onRejection);
    window.addEventListener('error', onError);
    return () => {
      window.removeEventListener('unhandledrejection', onRejection);
      window.removeEventListener('error', onError);
    };
  }, []);
  const dismiss = (id) => setErrors((prev) => prev.filter((e) => e.id !== id));
  if (!errors.length) return null;
  return (
    <div aria-live="polite" style={{
      position:'fixed', right:16, bottom:16, zIndex:2000,
      display:'flex', flexDirection:'column', gap:8, maxWidth:420,
    }}>
      {errors.map((e) => (
        <div key={e.id} role="alert" style={{
          background:'#fff', border:'1px solid #c24a3d', boxShadow:'0 8px 24px rgba(0,0,0,0.14)',
          padding:'12px 14px', fontSize:13, lineHeight:1.7, color:'#1e293b',
        }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:4}}>
            <span style={{fontFamily:'monospace', fontSize:10, letterSpacing:'0.14em', color:'#c24a3d'}}>
              {e.code}
            </span>
            <button type="button" onClick={() => dismiss(e.id)}
              style={{background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:14}}
              aria-label="닫기">×</button>
          </div>
          <div style={{fontWeight:600, marginBottom:e.hint ? 4 : 0}}>{e.message}</div>
          {e.hint && <div style={{color:'#475569', fontSize:12}}>{e.hint}</div>}
          {e.url && <div style={{fontFamily:'monospace', fontSize:10, color:'#94a3b8', marginTop:6, wordBreak:'break-all'}}>{e.url}</div>}
        </div>
      ))}
    </div>
  );
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lineStyle": "outline",
  "intensity": 1,
  "heroLayout": "center",
  "interactive": true
}/*EDITMODE-END*/;

// URL 경로 ↔ 라우트 키 매핑.
// 알려진 라우트만 화이트리스트로 받아 안전하게 폴백한다(home).
const VALID_ROUTES = ['home','community','lectures','tour','column','book','checkout','mypage','admin','login','signup','faq','terms','privacy','eat','sleep','shop'];
const pathToRoute = (pathname) => {
  const p = (pathname || '/').replace(/\/+$/, '') || '/';
  if (p === '/') return 'home';
  const seg = p.replace(/^\//, '').split('/')[0];
  return VALID_ROUTES.includes(seg) ? seg : 'home';
};
const routeToPath = (r) => r === 'home' ? '/' : '/' + r;

const App = () => {
  const [route, setRoute] = React.useState(() => {
    // URL 우선. 폴백으로 localStorage.
    try {
      const fromPath = pathToRoute(window.location.pathname);
      if (fromPath !== 'home' || window.location.pathname === '/') return fromPath;
      return localStorage.getItem('bgnj_route') || 'home';
    } catch { return 'home'; }
  });
  const [postId, setPostId] = React.useState(null);
  const [user, setUser] = React.useState(() => window.BGNJ_AUTH.getSessionUser());
  // 서버 세션을 1회 검증 — 캐시가 신선하지 않을 수 있으므로 진입 시 /api/auth/me로 갱신.
  React.useEffect(() => {
    let cancelled = false;
    window.BGNJ_AUTH.refreshSession?.().then((u) => {
      if (!cancelled) setUser(u || null);
      if (u?.id) {
        // 방문 기록 — 자동 승급 평가의 visitsLast30Days 측정에 사용. 같은 날 첫 진입만 카운트.
        try { window.BGNJ_VISITS?.record?.(u.id); } catch {}
        // 로그인 사용자라면 본인 활동 데이터 일괄 동기화.
        Promise.allSettled([
          window.BGNJ_LECTURES?.refreshMine?.(),
          window.BGNJ_TOURS?.refreshMine?.(),
          window.BGNJ_BOOK_ORDERS?.refreshMine?.(),
          window.BGNJ_COMMUNITY?.refreshBookmarks?.(u.id),
          window.BGNJ_COMMUNITY?.refreshNotifications?.(u.id),
        ]).catch(() => {});
      }
    });
    // 서버 source of truth 인 운영 데이터들을 진입 시 일괄 동기화.
    // 개별 헬퍼는 자체 캐시를 갱신하고 'bgnj-*-refresh' 이벤트를 발화한다.
    Promise.allSettled([
      window.BGNJ_SITE_CONTENT?.refresh?.(),
      window.BGNJ_FAQ?.refresh?.(),
      window.BGNJ_LEGAL?.refresh?.('terms'),
      window.BGNJ_LEGAL?.refresh?.('privacy'),
      window.BGNJ_LECTURES?.refresh?.({ includeHidden: true }),
      window.BGNJ_TOURS?.refresh?.({ includeHidden: true }),
      window.BGNJ_BOOKS?.refresh?.(),
      window.BGNJ_BOOK_ORDERS?.refreshBankAccount?.(),
      window.BGNJ_COLUMNS?.refresh?.({ admin: true }),
      window.BGNJ_COMMUNITY?.refreshPosts?.(),
      // 등급/카테고리 — D1 에서 서버 정의를 받아 BGNJ_STORES seed 를 덮어씀.
      // 서버에 정의가 비어 있으면 seed 가 그대로 유지(첫 진입자용 폴백).
      window.BGNJ_API?.grades?.list?.()?.then?.((r) => {
        if (Array.isArray(r?.grades) && r.grades.length) {
          window.BGNJ_STORES.grades = r.grades.map((g) => ({
            id: g.id, label: g.label, level: g.level,
            color: g.color, desc: g.description,
            order: g.display_order ?? 0,
          }));
        }
      })?.catch?.(() => {}),
      window.BGNJ_API?.categories?.list?.()?.then?.((r) => {
        if (Array.isArray(r?.categories) && r.categories.length) {
          window.BGNJ_STORES.categories = r.categories.map((c) => ({
            id: c.id, label: c.label,
            boardType: c.board_type || 'community',
            minLevel: c.min_level ?? 0,
            postMinLevel: c.post_min_level ?? 10,
            desc: c.description,
            prefixes: c.prefixes || [],
            order: c.display_order ?? 0,
            // v00.141 — schema-v8 권한 4종. undefined/null (legacy) → true.
            allowRead: c.allow_read === 0 ? false : true,
            allowWrite: c.allow_write === 0 ? false : true,
            allowCommentRead: c.allow_comment_read === 0 ? false : true,
            allowCommentWrite: c.allow_comment_write === 0 ? false : true,
          }));
        }
      })?.catch?.(() => {}),
    ]).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // v00.129 — BGNJ_BROADCAST 구독: admin 탭에서 'lectures'/'tours'/'columns'/'posts'/'books'
  // 변경이 발생하면 같은 origin 의 모든 탭이 해당 헬퍼 refresh + 페이지 이벤트 dispatch.
  // 예: 관리자 탭에서 강연 삭제 → 홈 탭에서 자동으로 다음 강연 카드 갱신.
  React.useEffect(() => {
    if (!window.BGNJ_BROADCAST?.subscribe) return;
    const unsub = window.BGNJ_BROADCAST.subscribe(async (msg) => {
      const d = msg?.domain;
      try {
        if (d === 'lectures') await window.BGNJ_LECTURES?.refresh?.({ includeHidden: false });
        else if (d === 'tours') await window.BGNJ_TOURS?.refresh?.({ includeHidden: false });
        else if (d === 'columns') await window.BGNJ_COLUMNS?.refresh?.();
        else if (d === 'posts') await window.BGNJ_COMMUNITY?.refreshPosts?.();
        else if (d === 'books') await window.BGNJ_BOOKS?.refresh?.();
        else if (d === 'site-content') await window.BGNJ_SITE_CONTENT?.refresh?.();
        // v00.142 — 약관/개인정보 변경 broadcast → 두 slug 모두 refresh + LegalPage 재렌더 이벤트.
        else if (d === 'legal') {
          await window.BGNJ_LEGAL?.refresh?.('terms');
          await window.BGNJ_LEGAL?.refresh?.('privacy');
          try { window.dispatchEvent(new CustomEvent('bgnj-legal-refresh')); } catch {}
        }
      } catch {}
    });
    return unsub;
  }, []);

  const [cart, setCart] = React.useState(() => {
    try {
      const raw = localStorage.getItem('bgnj_cart');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  React.useEffect(() => {
    try {
      if (cart) localStorage.setItem('bgnj_cart', JSON.stringify(cart));
      else localStorage.removeItem('bgnj_cart');
    } catch {}
  }, [cart]);
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = React.useState(false);

  const go = (r) => {
    setRoute(r);
    setPostId(null);
    try { localStorage.setItem('bgnj_route', r); } catch {}
    // 브라우저 주소를 동기화 — 같은 경로면 push 생략(불필요한 스택 누적 방지).
    try {
      const target = routeToPath(r);
      if (window.location.pathname !== target) {
        window.history.pushState(null, '', target);
      }
    } catch {}
    window.scrollTo(0, 0);
  };

  // 뒤로/앞으로 버튼 동기화 — popstate 시 URL을 다시 라우트로 변환.
  React.useEffect(() => {
    const onPop = () => {
      const next = pathToRoute(window.location.pathname);
      setRoute(next);
      setPostId(null);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // 라우트별 document.title — 북마크 / 공유 / 탭 라벨 의미화.
  // 사이트 콘텐츠(브랜드명/OG)도 변경 시 같이 갱신.
  React.useEffect(() => {
    const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
    const brand = sc.brand?.name || '뱅기노자';
    const tagline = sc.og?.title || '뱅기 타고 한국을 느끼다';
    const ROUTE_TITLES = {
      home: tagline,
      eat: '먹고 놀자',
      sleep: '자고 놀자',
      shop: '사고 놀자',
      tour: '투어 프로그램',
      lectures: '강연',
      column: '뱅기노자 칼럼',
      community: '커뮤니티',
      book: '뱅기노자의 길',
      checkout: '결제',
      mypage: '마이페이지',
      admin: '관리자',
      login: '로그인',
      signup: '회원가입',
      faq: '자주 묻는 질문',
      privacy: '개인정보 처리방침',
      terms: '이용약관',
    };
    const seg = ROUTE_TITLES[route] || '';
    const title = route === 'home' ? `${brand} — ${tagline}` : `${seg} — ${brand}`;
    try { document.title = title; } catch {}
    // route 변경 시 사이트 콘텐츠 refresh 이벤트도 listen — 브랜드명/태그라인 바뀌면 즉시 반영.
    const onScRefresh = () => {
      const sc2 = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const b2 = sc2.brand?.name || '뱅기노자';
      const t2 = sc2.og?.title || '뱅기 타고 한국을 느끼다';
      const s = ROUTE_TITLES[route] || '';
      const newTitle = route === 'home' ? `${b2} — ${t2}` : `${s} — ${b2}`;
      try { document.title = newTitle; } catch {}
    };
    window.addEventListener('bgnj-site-content-refresh', onScRefresh);
    return () => window.removeEventListener('bgnj-site-content-refresh', onScRefresh);
  }, [route]);

  const logout = () => {
    window.BGNJ_AUTH.signOut();
    setUser(null);
    setPostId(null);
    setRoute("home");
    try {
      localStorage.setItem('bgnj_route', 'home');
    } catch {}
    window.scrollTo(0, 0);
  };

  // Edit-mode protocol
  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setEditMode(true);
      if (d.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // URL 해시 딥 링크: #col-{id} → 칼럼 상세, #post-{id} → 커뮤니티 상세
  React.useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash || '';
      const colMatch = h.match(/^#col-(.+)$/);
      const postMatch = h.match(/^#post-(.+)$/);
      const lectureMatch = h.match(/^#lecture-(.+)$/);
      if (colMatch) {
        try { sessionStorage.setItem('bgnj_pending_column_id', decodeURIComponent(colMatch[1])); } catch {}
        setRoute('column');
        try { localStorage.setItem('bgnj_route', 'column'); } catch {}
      } else if (postMatch) {
        try { sessionStorage.setItem('bgnj_pending_post_id', decodeURIComponent(postMatch[1])); } catch {}
        setRoute('community');
        try { localStorage.setItem('bgnj_route', 'community'); } catch {}
      } else if (lectureMatch) {
        try { sessionStorage.setItem('bgnj_pending_lecture_id', decodeURIComponent(lectureMatch[1])); } catch {}
        setRoute('lectures');
        try { localStorage.setItem('bgnj_route', 'lectures'); } catch {}
      } else {
        const tourMatch = h.match(/^#tour-(.+)$/);
        if (tourMatch) {
          try { sessionStorage.setItem('bgnj_pending_tour_id', decodeURIComponent(tourMatch[1])); } catch {}
          setRoute('tour');
          try { localStorage.setItem('bgnj_route', 'tour'); } catch {}
        }
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const updateTweaks = (next) => {
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
  };

  const hideNav = route === "login" || route === "signup" || route === "admin";

  // 페이지 컴포넌트를 window 에서 defensive lookup — babel-standalone 스크립트 로드 순서/실패에
  // 견고하게 동작. 컴포넌트가 없으면 fallback UI 렌더(전체 앱 트리는 죽지 않게).
  const renderPage = () => {
    const W = window;
    const fallback = (label) => () => (
      <div style={{padding:48, textAlign:'center', color:'#1f2937'}}>
        <div style={{fontFamily:'monospace', fontSize:11, color:'#dc2626', letterSpacing:'0.18em', marginBottom:8}}>PAGE_NOT_LOADED</div>
        <div style={{fontFamily:'serif', fontSize:18, marginBottom:6}}>{label} 페이지를 불러오지 못했습니다</div>
        <div style={{fontSize:12, color:'#64748b', marginBottom:18}}>새로고침 후에도 같은 화면이 보인다면 잠시 후 다시 시도해 주세요.</div>
        <button onClick={() => { try { window.location.reload(); } catch {} }} style={{padding:'8px 16px', cursor:'pointer'}}>페이지 새로고침</button>
      </div>
    );
    const pick = (name, label) => W[name] || fallback(label);
    switch (route) {
      case "home":      { const C = pick('HomePage','홈');      return <C go={go} tweaks={tweaks}/>; }
      case "eat":       { const C = pick('EatPage','먹고 놀자'); return <C go={go} user={user}/>; }
      case "sleep":     { const C = pick('SleepPage','자고 놀자'); return <C go={go} user={user}/>; }
      case "shop":      { const C = pick('ShopPage','사고 놀자'); return <C go={go} user={user}/>; }
      case "community": { const C = pick('CommunityPage','커뮤니티'); return <C go={go} postId={postId} setPostId={setPostId} user={user}/>; }
      case "tour":      { const C = pick('TourPage','투어'); return <C go={go} user={user}/>; }
      case "lectures":  { const C = pick('LecturesPage','강연'); return <C go={go} user={user}/>; }
      case "privacy":   { const C = pick('LegalPage','약관'); return <C go={go} slug="privacy"/>; }
      case "terms":     { const C = pick('LegalPage','약관'); return <C go={go} slug="terms"/>; }
      case "faq":       { const C = pick('FaqPage','자주 묻는 질문'); return <C go={go}/>; }
      case "column":    { const C = pick('ColumnPage','칼럼'); return <C go={go} user={user}/>; }
      case "book":      { const C = pick('BookPage','책'); return <C go={go} cart={cart} setCart={setCart} user={user}/>; }
      case "checkout":  { const C = pick('CheckoutPage','결제'); return <C go={go} cart={cart} user={user}/>; }
      case "mypage":    { const C = pick('MyPage','마이페이지'); return <C go={go} user={user} cart={cart}/>; }
      case "login":
      case "signup":    { const C = pick('LoginPage','로그인'); return <C go={go} setUser={setUser}/>; }
      case "admin":     {
        if (!user?.isAdmin) { const D = pick('AdminDenied','관리'); return <D go={go} user={user}/>; }
        const C = pick('AdminPage','관리'); return <C go={go} user={user}/>;
      }
      default:          { const C = pick('HomePage','홈'); return <C go={go} tweaks={tweaks}/>; }
    }
  };
  // 페이지별 에러 바운더리 — 한 페이지가 던진 오류가 전역으로 번지지 않게. key=route 로 라우트 변경 시 자동 reset.
  const page = <PageErrorBoundary key={route} route={route} go={go}>{renderPage()}</PageErrorBoundary>;

  return (
    <div className="app">
      {/* v00.143 — 사이트 오픈 안내 배너. 메뉴 위쪽 sitewide. 사용자 요청 '메뉴 위쪽에' + 새 문구. */}
      {!hideNav && (
        <div role="status" aria-label="사이트 오픈 안내" style={{
          background: 'rgba(245, 213, 72, 0.12)',
          borderBottom: '1px solid var(--gold-dim, #C9A632)',
          color: 'var(--ink, #0F172A)',
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: 13,
          lineHeight: 1.55,
        }}>
          🌱 <strong>홈페이지를 오픈한 지 얼마 되지 않았습니다.</strong>{' '}
          <span className="dim-2">이용에 불편하신 점이 있다면 <strong>왕사들 오픈톡방</strong>에 알려주세요 — 계속 업데이트해 나가겠습니다. 현재 <strong>PC 버전 최적화</strong>로 제작되어 있습니다.</span>
        </div>
      )}
      <Nav route={route} go={go} user={user} onLogout={logout}/>
      <main id="main" tabIndex="-1" style={{flex:1, outline:'none'}} aria-label={`${route} 페이지 본문`}>{page}</main>
      {!hideNav && <Footer go={go}/>}
      <Tweaks tweaks={tweaks} setTweaks={updateTweaks} visible={editMode}/>
      <ScrollToTop/>
      <CookieConsent/>
      <GlobalErrorToast/>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppErrorBoundary><App/></AppErrorBoundary>);

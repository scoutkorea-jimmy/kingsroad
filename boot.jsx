// 뱅기노자 — 부트스트랩 (App + AppErrorBoundary + ReactDOM.render)
// v00.071 — index.html 의 인라인 <script type="text/babel"> 블록을 분리. esbuild 사전 컴파일.
// 전체 앱 에러 바운더리 — 흰 화면 방지 + 정확한 진단 정보 노출.
// v00.287 ESM (main) — 페이지 컴포넌트 직접 import (boot pick 레지스트리 → import).
import { BookPage, CheckoutPage} from './pages/BookCheckoutPage.jsx';
import { ColumnPage} from './pages/ColumnPage.jsx';
import { CommunityPage} from './pages/CommunityPage.jsx';
import { HelpWidget} from './components/HelpWidget.jsx';
import { Error401Page, Error404Page} from './pages/ErrorPages.jsx';
import { HangyeonPage} from './pages/HangyeonPage.jsx';
import { HomeNextPage} from './pages/HomeNextPage.jsx';
import { HomePage} from './pages/HomePage.jsx';
import { LecturesPage} from './pages/LecturesPage.jsx';
import { FaqPage, LegalPage} from './pages/LegalFaqPages.jsx';
import { MyPage} from './pages/MyPage.jsx';
import { TourPage} from './pages/WangsanamTourPage.jsx';

class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, info: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  componentDidCatch(err, info) {
    this.setState({ info });
    try { console.error('[AppErrorBoundary]', err, info); } catch (_e) { console.warn('[bgnj] boot.jsx:23 오류(무시하고 진행)', _e); }
    // 렌더링 오류도 서버에 기록.
    try {
      window.BGNJ_API?.errorLog?.report({
        code: err?.code || (err?.name || 'RENDER_ERROR'),
        status: null, kind: 'render',
        message: err?.message || String(err),
        hint: '', url: '',
        pathname: location.pathname, origin: location.origin,
      })?.catch?.(() => {});
    } catch (_e) { console.warn('[bgnj] 오류 보고 자체 — 실패해도 재보고하면 무한루프 (boot.jsx:33)', _e); }
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
            <button onClick={() => { try { window.location.reload(); } catch (_e) { console.warn('[bgnj] boot.jsx:66 오류(무시하고 진행)', _e); } }} style={{padding:'8px 16px', cursor:'pointer'}}>페이지 새로고침</button>
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
    try { console.error('[PageErrorBoundary]', this.props.route, err, info); } catch (_e) { console.warn('[bgnj] boot.jsx:82 오류(무시하고 진행)', _e); }
    try {
      window.BGNJ_API?.errorLog?.report({
        code: err?.code || (err?.name || 'PAGE_RENDER_ERROR'),
        status: null, kind: 'render',
        message: err?.message || String(err),
        hint: `route=${this.props.route}`, url: '',
        pathname: location.pathname, origin: location.origin,
      })?.catch?.(() => {});
    } catch (_e) { console.warn('[bgnj] 오류 보고 자체 — 실패해도 재보고하면 무한루프 (boot.jsx:91)', _e); }
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
            <button onClick={() => { try { this.props.go('home'); this.setState({ error: null }); } catch (_e) { console.warn('[bgnj] boot.jsx:112 오류(무시하고 진행)', _e); } }}
              style={{padding:'10px 18px', cursor:'pointer', border:'1px solid #cbd5e1', background:'#fff'}}>홈으로</button>
            <button onClick={() => { try { window.location.reload(); } catch (_e) { console.warn('[bgnj] boot.jsx:114 오류(무시하고 진행)', _e); } }}
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
// v00.206 — 토스트 프로그램 호출 API. alert() 교체용.
// `window.BGNJ_TOAST.error|success|info(message, opts?)` — 어떤 코드에서든 호출 가능.
// kind=error 만 server reportError 동반. success/info 는 UI 만.
// GlobalErrorToast 가 'bgnj-toast' CustomEvent 를 listen 해서 push.
const GlobalErrorToast = () => {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    const push = (entry) => {
      const id = Date.now() + Math.random();
      const kind = entry.kind || (entry.code ? 'error' : 'error');
      setToasts((prev) => [...prev, { id, ...entry, kind }].slice(-3));
      if (kind === 'error') reportErrorToServer(entry);
      const ttl = entry.ttl || TOAST_DISMISS_MS;
      setTimeout(() => {
        setToasts((prev) => prev.filter((e) => e.id !== id));
      }, ttl);
    };
    const onRejection = (ev) => {
      const r = ev?.reason;
      if (!r) return;
      const code = r.code || (r.status ? `HTTP_${r.status}` : (r.name || 'PROMISE_REJECTION'));
      const message = r.message || String(r);
      push({ kind:'error', code, status: r.status || null, message, hint: r.hint || '', url: r.url || '' });
      try { console.error('[GlobalErrorToast]', r); } catch (_e) { console.warn('[bgnj] boot.jsx:172 오류(무시하고 진행)', _e); }
    };
    const onError = (ev) => {
      const message = ev?.message || ev?.error?.message || 'Script error';
      push({ kind:'error', code: 'WINDOW_ERROR', status: null, message, hint: '', url: ev?.filename || '' });
      try { console.error('[GlobalErrorToast]', ev?.error || ev); } catch (_e) { console.warn('[bgnj] boot.jsx:177 오류(무시하고 진행)', _e); }
    };
    const onProgrammatic = (ev) => {
      const d = ev?.detail || {};
      if (!d.message) return;
      push({
        kind: d.kind || 'info',
        code: d.code || (d.kind === 'success' ? 'OK' : (d.kind === 'error' ? 'ERROR' : 'INFO')),
        message: d.message, hint: d.hint || '', url: d.url || '', ttl: d.ttl,
      });
    };
    window.addEventListener('unhandledrejection', onRejection);
    window.addEventListener('error', onError);
    window.addEventListener('bgnj-toast', onProgrammatic);
    // window.BGNJ_TOAST API 노출
    window.BGNJ_TOAST = {
      error:   (message, opts={}) => window.dispatchEvent(new CustomEvent('bgnj-toast', { detail: { kind:'error',   message, ...opts } })),
      success: (message, opts={}) => window.dispatchEvent(new CustomEvent('bgnj-toast', { detail: { kind:'success', message, ...opts } })),
      info:    (message, opts={}) => window.dispatchEvent(new CustomEvent('bgnj-toast', { detail: { kind:'info',    message, ...opts } })),
    };
    return () => {
      window.removeEventListener('unhandledrejection', onRejection);
      window.removeEventListener('error', onError);
      window.removeEventListener('bgnj-toast', onProgrammatic);
    };
  }, []);
  const dismiss = (id) => setToasts((prev) => prev.filter((e) => e.id !== id));
  if (!toasts.length) return null;
  // kind 별 색상 토큰 분기 — error: danger, success: primary, info: tertiary
  const colorOf = (k) => k === 'success' ? '#C99E1A' : (k === 'info' ? '#475569' : '#c24a3d');
  return (
    <div aria-live="polite" style={{
      position:'fixed', right:16, bottom:16, zIndex:2000,
      display:'flex', flexDirection:'column', gap:8, maxWidth:420,
    }}>
      {toasts.map((e) => {
        const accent = colorOf(e.kind);
        return (
          <div key={e.id} role={e.kind === 'success' ? 'status' : 'alert'} style={{
            background: e.kind === 'success' ? 'rgba(245,213,72,0.08)' : '#fff',
            border:`1px solid ${accent}`, boxShadow:'0 8px 24px rgba(0,0,0,0.14)',
            padding:'12px 14px', fontSize:13, lineHeight:1.7, color:'#1e293b',
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:4}}>
              <span style={{fontFamily:'monospace', fontSize:10, letterSpacing:'0.14em', color:accent}}>
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
        );
      })}
    </div>
  );
};

// v00.214 — 새 빌드 감지 배너. 매 커밋 마다 /version.json 이 갱신됨 (pre-commit hook).
// 동작: 5분마다 + 탭 visibility=visible 전환 시 fetch. 다른 버전이면 우상단 배너 노출.
// '지금 새로고침' 클릭 시 cache-bust reload (location.href + ?_=now).
// v00.294.011 — 사용자 보고 '사이트를 열면 과거 사이트/임시 문구가 보인다'.
//   root cause: GitHub Pages 가 **index.html 에도** `Cache-Control: max-age=600` 을 준다.
//   자산은 `?v=` 로 캐시버스팅하지만 그 `?v=` 를 적어 둔 HTML 자체가 10분간 캐시되므로,
//   재방문자는 최대 10분 동안 **옛 HTML → 옛 번들 → 옛 화면** 을 통째로 본다.
//   Pages 는 응답 헤더를 못 바꾸므로 클라이언트에서 끊어야 한다.
//   기존엔 배너로 '새로고침' 을 권하기만 해서, 누르기 전까지는 옛 사이트가 그대로였다.
//   → 안전할 때(작성 중이 아님)는 자동으로 한 번 새로고침한다. 아니면 종전대로 배너.
const VERSION_POLL_MS = 5 * 60 * 1000; // 5분
const AUTO_RELOAD_KEY = 'bgnj_auto_reloaded_version';

// 자동 새로고침이 사용자 작업을 날리면 안 된다. 하나라도 걸리면 배너로 물러선다.
const _safeToAutoReload = () => {
  try {
    // 모달이 떠 있다고 무조건 막으면 안 된다 — 쿠키 동의창도 role="dialog" 라서
    // 동의 전 방문자(=대개 첫 방문·재방문자)는 자동 새로고침이 영영 안 걸렸다.
    // '잃을 것이 있는 모달' 만 막는다: 글을 담을 수 있는 입력이 안에 있는 경우.
    const EDITABLE = 'textarea, [contenteditable="true"], input:not([type=checkbox]):not([type=radio]):not([type=hidden]):not([type=button]):not([type=submit])';
    for (const d of document.querySelectorAll('[role="dialog"]')) {
      if (d.querySelector(EDITABLE)) return false;
    }
    // 입력 중이면 건드리지 않는다.
    const a = document.activeElement;
    if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return false;
    // 내용이 담긴 입력이 하나라도 있으면 작성 중으로 본다.
    for (const el of document.querySelectorAll('input, textarea')) {
      if (el.type === 'hidden' || el.type === 'checkbox' || el.type === 'radio') continue;
      if (String(el.value || '').trim()) return false;
    }
    // 리치 에디터(Tiptap)는 <textarea> 가 아니라 contenteditable 이다.
    for (const el of document.querySelectorAll('[contenteditable="true"]')) {
      if (String(el.textContent || '').trim()) return false;
    }
    return true;
  } catch (_e) {
    console.warn('[bgnj] 자동 새로고침 안전 판정 실패 — 배너로 대체 (boot.jsx)', _e);
    return false;
  }
};
// v00.289 — 우상단 큰 카드 → 좌하단 소형 토스트로 강등.
// 이유: 데스크톱에선 히어로를, 모바일에선 로고를 덮고 있었다(첫 화면의 절반이 안내문).
// 우하단은 이미 오류 토스트(bottom:16/right:16)와 scroll-top FAB(bottom:28/right:24)가 쓰고 있어 좌하단으로.
// z-index 는 쿠키 배너(80)보다 낮은 70 — 첫 방문 동의가 항상 우선.
const UPDATE_DISMISSED_KEY = 'bgnj_update_dismissed_version';
const VersionUpdateBanner = () => {
  const [latest, setLatest] = React.useState(null);
  const current = (window.BGNJ_VERSION?.version || '').toString();
  React.useEffect(() => {
    if (!current) return;
    let cancelled = false;
    const check = async () => {
      try {
        const url = `/version.json?_=${Date.now()}`;
        // bgnj-lint-ignore-next-line direct_fetch
        const r = await fetch(url, { cache: 'no-store' });
        if (!r.ok) return;
        const j = await r.json();
        const v = String(j?.version || '');
        // '나중에' 로 닫은 버전은 다시 띄우지 않는다. 더 새 버전이 나오면 다시 뜬다.
        let dismissed = '';
        try { dismissed = localStorage.getItem(UPDATE_DISMISSED_KEY) || ''; } catch (_e) { console.warn('[bgnj] 저장소 읽기 — 실패 시 기본값 (boot.jsx:264)', _e); }
        if (cancelled || !v || v === current || v === dismissed) return;
        // 같은 버전으로 이미 한 번 자동 새로고침했다면 다시 하지 않는다 —
        // CDN 이 아직 옛 HTML 을 주는 상황에서 무한 새로고침이 되는 것을 막는다.
        let autoDone = '';
        try { autoDone = sessionStorage.getItem(AUTO_RELOAD_KEY) || ''; }
        catch (_e) { console.warn('[bgnj] 자동 새로고침 기록 읽기 실패 (boot.jsx)', _e); }
        if (autoDone !== v && _safeToAutoReload()) {
          try { sessionStorage.setItem(AUTO_RELOAD_KEY, v); }
          catch (_e) { console.warn('[bgnj] 자동 새로고침 기록 저장 실패 (boot.jsx)', _e); }
          const u = new URL(window.location.href);
          u.searchParams.set('_v', v);
          window.location.replace(u.toString());
          return;
        }
        setLatest(j);
      } catch (_e) { console.warn('[bgnj] 저장소 읽기 — 실패 시 기본값 (boot.jsx:266)', _e); }
    };
    check(); // 진입 즉시 1회
    const t = setInterval(check, VERSION_POLL_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { cancelled = true; clearInterval(t); document.removeEventListener('visibilitychange', onVisible); };
  }, [current]);
  const reload = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('_v', latest?.version || Date.now().toString());
      window.location.replace(url.toString());
    } catch {
      window.location.reload();
    }
  };
  const dismiss = () => {
    try { localStorage.setItem(UPDATE_DISMISSED_KEY, String(latest?.version || '')); } catch (_e) { console.warn('[bgnj] boot.jsx:284 오류(무시하고 진행)', _e); }
    setLatest(null);
  };
  if (!latest) return null;
  return (
    <div role="status" aria-live="polite" className="version-update-toast">
      <div style={{fontWeight:600, marginBottom:8}}>새 버전 v{latest.version} 이 나왔습니다</div>
      <div style={{display:'flex', gap:6}}>
        <button type="button" className="btn btn-small btn-gold" onClick={reload}>새로고침</button>
        <button type="button" className="btn-ghost" style={{fontSize:12}} onClick={dismiss}>나중에</button>
      </div>
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
// v00.229 — 'error' 라우트 추가. /error?code=403|404|500|401|network|maintenance
const VALID_ROUTES = ['home','home-next','community','lectures','tour','column','book','checkout','mypage','admin','login','signup','faq','terms','privacy','sleep','hangyeon','error'];
const pathToRoute = (pathname) => {
  const p = (pathname || '/').replace(/\/+$/, '') || '/';
  if (p === '/') return 'home';
  const seg = p.replace(/^\//, '').split('/')[0];
  return VALID_ROUTES.includes(seg) ? seg : 'home';
};
const routeToPath = (r) => r === 'home' ? '/' : '/' + r;

// v00.198 — admin lazy-load.
// 사용자 우선순위 '홈페이지 반응성 + 기능 회귀 0 + 속도감'.
// 이전엔 4개 admin 스크립트 (총 ~3.85MB raw / ~360KB gz) 가 모든 방문자에게 강제 defer 로드 →
// 비-admin 99% 가 admin 코드 다운/파스/컴파일.
// 해법: index.html 에서 제거 + admin route 진입 시 동적 주입. idempotent — 한 번 로드되면
// 메모리 캐시 (재진입 시 즉시 렌더). 실패 시 1회 retry.
// v00.285 Stage 3 — admin 5개 per-file 스크립트 → 단일 번들 dist/admin.js.
//   esbuild 가 src/entry-admin.jsx (AdminShared→ContentEditors→DesignHub→HangyeonAdminPanel→AuthAdminPage
//   순서)를 하나로 번들. 코드 스플리팅 경계는 그대로(비-admin 은 받지 않음).
const ADMIN_SCRIPTS = [
  'dist/admin.js',
];
let _adminLoadPromise = null;
const _loadAdminScripts = (attempt = 0) => {
  if (_adminLoadPromise) return _adminLoadPromise;
  if (typeof window !== 'undefined' && window.AdminPage) {
    _adminLoadPromise = Promise.resolve();
    return _adminLoadPromise;
  }
  const v = (window.BGNJ_VERSION?.version || '').toString();
  const qs = v ? `?v=${v}` : '';
  _adminLoadPromise = new Promise((resolve, reject) => {
    let remaining = ADMIN_SCRIPTS.length;
    let failed = false;
    ADMIN_SCRIPTS.forEach((src) => {
      const fullSrc = src + qs;
      const existing = document.querySelector(`script[data-bgnj-admin][src="${fullSrc}"]`);
      if (existing) {
        // 이미 다른 호출이 주입한 경우 — 기존 onload 가 처리.
        if (existing.dataset.loaded === '1') {
          if (--remaining === 0 && !failed) resolve();
        } else {
          existing.addEventListener('load', () => {
            existing.dataset.loaded = '1';
            if (--remaining === 0 && !failed) resolve();
          });
          existing.addEventListener('error', () => { failed = true; reject(new Error(`${src} load failed`)); });
        }
        return;
      }
      const s = document.createElement('script');
      s.src = fullSrc;
      s.async = false; // 순서 보존 — AuthAdminPage 가 AdminShared/Editors/DesignHub 의 window globals 참조.
      s.defer = false;
      s.dataset.bgnjAdmin = '1';
      s.onload = () => {
        s.dataset.loaded = '1';
        if (--remaining === 0 && !failed) resolve();
      };
      s.onerror = () => {
        failed = true;
        reject(new Error(`${src} load failed`));
      };
      document.head.appendChild(s);
    });
  }).catch((err) => {
    _adminLoadPromise = null; // 실패 시 다음 호출이 retry 가능하게.
    if (attempt < 1) {
      // 1회 retry (network blip 회복).
      return new Promise((r) => setTimeout(r, 600)).then(() => _loadAdminScripts(attempt + 1));
    }
    throw err;
  }).then(() => {
    // v00.210 — 로드 완료 알림. /admin route 외 진입(예: ColumnPage 칼럼 작성 모달) 도 동일 이벤트로 리렌더.
    try { window.dispatchEvent(new Event('bgnj-admin-scripts-loaded')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (boot.jsx:382)', _e); }
  });
  return _adminLoadPromise;
};
// v00.210 — admin 외 페이지(ColumnPage 등) 에서도 호출 가능하도록 노출.
if (typeof window !== 'undefined') window.BGNJ_LOAD_ADMIN = _loadAdminScripts;

// v00.212 — admin 번들 로딩 폴백. label prop 으로 어떤 페이지를 기다리는지 표기 (admin / 로그인 / 회원가입 등).
const _AdminLoadingFallback = ({ error, onRetry, label = '관리자' }) => {
  const code = label === '로그인' ? 'LOGIN' : (label === '회원가입' ? 'SIGNUP' : 'ADMIN');
  return (
    <div style={{padding:48, textAlign:'center', minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div>
        <div className="mono dim-2" style={{fontSize:11, letterSpacing:'0.18em', marginBottom:10}}>
          {error ? `${code} · LOAD FAILED` : `${code} · LOADING`}
        </div>
        <div className="ko-serif" style={{fontSize:18, marginBottom:14, color:'var(--ink)'}}>
          {error ? `${label} 페이지를 불러오지 못했습니다` : `${label} 페이지를 불러오는 중…`}
        </div>
        {error ? (
          <>
            <div className="dim-2" style={{fontSize:12, marginBottom:14}}>{error?.message || '알 수 없는 오류'}</div>
            <button type="button" className="btn btn-small" onClick={onRetry}>다시 시도</button>
          </>
        ) : (
          <div className="dim-2" style={{fontSize:12}}>처음 진입 시 ~1초 소요됩니다.</div>
        )}
      </div>
    </div>
  );
};

// v00.257 — 사이트 공지 배너 (admin 관리). site_content_kv.banner 에서 읽어옴.
// enabled false / 데이터 없음 / dismissed 면 미노출. tone 4종 색상 분기.
const SITE_BANNER_DISMISSED_KEY = 'bgnj_banner_dismissed';
const SiteBanner = () => {
  const [tick, setTick] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(() => {
    try { return !!sessionStorage.getItem(SITE_BANNER_DISMISSED_KEY); } catch { return false; }
  });
  // site_content refresh 이벤트 listen — admin 에서 저장 시 즉시 반영.
  React.useEffect(() => {
    const onR = () => setTick((v) => v + 1);
    window.addEventListener('bgnj-site-content-refresh', onR);
    return () => window.removeEventListener('bgnj-site-content-refresh', onR);
  }, []);
  const banner = (() => {
    try { return (window.BGNJ_SITE_CONTENT?.get?.() || {}).banner || {}; } catch { return {}; }
  })();
  if (!banner.enabled || dismissed) return null;
  if (!banner.title && !banner.body) return null;
  const tone = banner.tone || 'info';
  // tone 별 색상 — info(옐로우 dim)/success(초록)/warning(앰버)/danger(빨강).
  const palette = {
    info:    { bg: 'rgba(245,213,72,0.12)',  border: 'var(--primary-active)', text: 'var(--ink)' },
    success: { bg: 'rgba(22,163,74,0.10)',   border: 'var(--success)',         text: 'var(--ink)' },
    warning: { bg: 'rgba(217,119,6,0.10)',   border: 'var(--warning)',         text: 'var(--ink)' },
    danger:  { bg: 'rgba(220,38,38,0.10)',   border: 'var(--danger)',          text: 'var(--ink)' },
  }[tone] || { bg: 'rgba(245,213,72,0.12)', border: 'var(--primary-active)', text: 'var(--ink)' };
  const onDismiss = () => {
    try { sessionStorage.setItem(SITE_BANNER_DISMISSED_KEY, '1'); } catch (_e) { console.warn('[bgnj] boot.jsx:443 오류(무시하고 진행)', _e); }
    setDismissed(true);
  };
  return (
    <div role="status" aria-label="사이트 공지" className="site-banner" style={{
      background: palette.bg,
      borderBottom: `1px solid ${palette.border}`,
      color: palette.text,
      padding: '10px 16px',
      textAlign: 'center',
      fontSize: 13,
      lineHeight: 1.55,
      position: 'relative',
    }}>
      {/* v00.289.002 — 긴 공지가 모바일에서 3줄까지 차지해 첫 화면을 먹었다.
          기본 2줄로 접고 탭하면 펼친다. 데스크톱은 원래 1줄이라 영향 없음. */}
      <div className={`site-banner-text${expanded ? ' is-expanded' : ''}`}
        onClick={() => setExpanded((v) => !v)}
        role={banner.body ? 'button' : undefined}
        tabIndex={banner.body ? 0 : undefined}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded((v) => !v); } }}>
        {banner.emoji ? `${banner.emoji} ` : ''}
        {banner.title && <strong>{banner.title}</strong>}
        {banner.body && <span className="dim-2">{banner.title ? ' ' : ''}{banner.body}</span>}
      </div>
      {banner.dismissible && (
        <button type="button" onClick={onDismiss} aria-label="배너 닫기"
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--ink-3)', fontSize: 16, padding: '4px 8px',
          }}>×</button>
      )}
    </div>
  );
};

// v00.296 — 검색·AI 크롤러용 정적 페이지(/community/98, /column/xxx)로 들어온 경우,
//   그 글을 바로 열어 준다. 정적 HTML 이 <body data-bgnj-post="98"> 로 알려준다.
//   경로에서 직접 읽지 않고 속성을 쓰는 이유: 라우터가 첫 세그먼트만 보도록 되어 있어
//   경로 규칙을 건드리면 기존 라우팅 전체가 영향을 받는다. 속성은 그 자리에서 끝난다.
//   (인라인 <script> 로 넘기지 않는 이유는 CSP 가 인라인 스크립트 해시를 못 박아 두기 때문이다.)
(function applyPrerenderHint() {
  try {
    const d = document.body?.dataset || {};
    if (d.bgnjPost)   sessionStorage.setItem('bgnj_pending_post_id', String(d.bgnjPost));
    if (d.bgnjColumn) sessionStorage.setItem('bgnj_pending_column_id', String(d.bgnjColumn));
  } catch (_e) { console.warn('[bgnj] 정적 페이지 힌트 읽기 실패 — 목록으로 갈 뿐 (boot.jsx)', _e); }
})();

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
        try { window.BGNJ_VISITS?.record?.(u.id); } catch (_e) { console.warn('[bgnj] boot.jsx:498 오류(무시하고 진행)', _e); }
        // 로그인 사용자라면 본인 활동 데이터 일괄 동기화.
        Promise.allSettled([
          window.BGNJ_LECTURES?.refreshMine?.(),
          window.BGNJ_TOURS?.refreshMine?.(),
          // v00.296.003 — 관리자로 확인된 뒤에만 '숨은 것까지' 다시 받는다.
          //   일반 방문자(대다수)는 공개분만 받고 CDN 캐시를 탄다.
          ...(u.isAdmin ? [
            window.BGNJ_LECTURES?.refresh?.({ includeHidden: true }),
            window.BGNJ_TOURS?.refresh?.({ includeHidden: true }),
            window.BGNJ_COLUMNS?.refresh?.({ admin: true }),
          ] : []),
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
      // v00.296.003 — 부팅 때는 **공개분만** 받는다.
      //   전에는 모든 방문자에게 includeHidden/admin 을 붙여 보냈다. 그러면
      //   ① 워커의 _publicCacheable 이 false 가 되어 **CDN 캐시를 통째로 못 탄다**
      //      (방문자 한 명 한 명이 워커+D1 까지 간다),
      //   ② 감춰 둔 콘텐츠가 내려갈 소지가 있다(지금은 비공개분이 없어 실제 유출은 없었다).
      //   관리자에게 필요한 '숨은 것까지' 는 아래 refreshSession 뒤에 따로 받는다.
      //   서버도 이제 관리자가 아니면 그 옵션을 무시한다(wantsHidden).
      window.BGNJ_LECTURES?.refresh?.(),
      window.BGNJ_TOURS?.refresh?.(),
      window.BGNJ_BOOKS?.refresh?.(),
      window.BGNJ_BOOK_ORDERS?.refreshBankAccount?.(),
      window.BGNJ_COLUMNS?.refresh?.(),
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
          // v00.294 — 스토어만 갈아끼우고 알리지 않아, 이미 마운트된 화면이
          // 부팅 시점의 DEFAULT_CATEGORIES 스냅샷을 계속 쥐고 있었다.
          // 증상: 광장 게시판 탭에 '자유·언론보도·한켠역사문화포럼' 이 아예 안 뜸
          // (DEFAULT 의 minLevel 10 에 걸려 비로그인 사용자에게 숨겨짐).
          try { window.dispatchEvent(new CustomEvent('bgnj-categories-refresh')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (boot.jsx:553)', _e); }
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
          try { window.dispatchEvent(new CustomEvent('bgnj-legal-refresh')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (boot.jsx:578)', _e); }
        }
      } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (boot.jsx:580)', _e); }
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
    } catch (_e) { console.warn('[bgnj] 저장소 정리 (boot.jsx:595)', _e); }
  }, [cart]);
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = React.useState(false);

  const go = (r) => {
    setRoute(r);
    setPostId(null);
    try { localStorage.setItem('bgnj_route', r); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (boot.jsx:603)', _e); }
    // 브라우저 주소를 동기화 — 같은 경로면 push 생략(불필요한 스택 누적 방지).
    try {
      const target = routeToPath(r);
      if (window.location.pathname !== target) {
        window.history.pushState(null, '', target);
      }
    } catch (_e) { console.warn('[bgnj] 히스토리 조작 (boot.jsx:610)', _e); }
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

  // v00.148 — 페이지뷰 익명 트래킹. route 변경 시마다 BGNJ_ANALYTICS.track 호출.
  // sendBeacon 우선 + silent fail (분석은 사용자 영향 없음).
  React.useEffect(() => {
    try { window.BGNJ_ANALYTICS?.track?.(route); } catch (_e) { console.warn('[bgnj] boot.jsx:629 오류(무시하고 진행)', _e); }
  }, [route]);

  // 라우트별 document.title — 북마크 / 공유 / 탭 라벨 의미화.
  // 사이트 콘텐츠(브랜드명/OG)도 변경 시 같이 갱신.
  React.useEffect(() => {
    const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
    const brand = sc.brand?.name || '뱅기노자';
    const tagline = sc.og?.title || '뱅기 타고 한국을 느끼다';
    const ROUTE_TITLES = {
      home: tagline,
      'home-next': '신규 홈 프리뷰',
      sleep: '자고 놀자 — 한켠',
      hangyeon: '한켠 — 숙소 예약',
      tour: '투어 프로그램',
      lectures: '강연',
      column: '뱅기노자 칼럼',
      community: '광장',
      book: '뱅기노자 도서',
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
    try { document.title = title; } catch (_e) { console.warn('[bgnj] 문서 제목 (boot.jsx:659)', _e); }
    // route 변경 시 사이트 콘텐츠 refresh 이벤트도 listen — 브랜드명/태그라인 바뀌면 즉시 반영.
    const onScRefresh = () => {
      const sc2 = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const b2 = sc2.brand?.name || '뱅기노자';
      const t2 = sc2.og?.title || '뱅기 타고 한국을 느끼다';
      const s = ROUTE_TITLES[route] || '';
      const newTitle = route === 'home' ? `${b2} — ${t2}` : `${s} — ${b2}`;
      try { document.title = newTitle; } catch (_e) { console.warn('[bgnj] 문서 제목 (boot.jsx:667)', _e); }
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
    } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (boot.jsx:680)', _e); }
    window.scrollTo(0, 0);
  };

  // Edit-mode protocol
  // v00.203 — postMessage origin 검증. 동일 출처 메시지만 수용해 외부 frame 의 상태 토글 차단.
  // 송신측도 wildcard 대신 자기 origin 으로 좁힘 (메시지 자체는 비민감하나 best practice).
  React.useEffect(() => {
    const selfOrigin = window.location.origin;
    const onMsg = (e) => {
      if (e.origin !== selfOrigin) return;
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setEditMode(true);
      if (d.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, selfOrigin); } catch (_e) { console.warn('[bgnj] boot.jsx:696 오류(무시하고 진행)', _e); }
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
        // v00.219 — #col-N (숫자) 도 수용. BGNJ_COLUMNS.idByNumber 로 실제 id 변환.
        const raw = decodeURIComponent(colMatch[1]);
        const isNumeric = /^\d+$/.test(raw);
        const resolved = isNumeric ? (window.BGNJ_COLUMNS?.idByNumber?.(raw) || raw) : raw;
        try { sessionStorage.setItem('bgnj_pending_column_id', resolved); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (boot.jsx:712)', _e); }
        setRoute('column');
        try { localStorage.setItem('bgnj_route', 'column'); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (boot.jsx:714)', _e); }
      } else if (postMatch) {
        try { sessionStorage.setItem('bgnj_pending_post_id', decodeURIComponent(postMatch[1])); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (boot.jsx:716)', _e); }
        setRoute('community');
        try { localStorage.setItem('bgnj_route', 'community'); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (boot.jsx:718)', _e); }
      } else if (lectureMatch) {
        try { sessionStorage.setItem('bgnj_pending_lecture_id', decodeURIComponent(lectureMatch[1])); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (boot.jsx:720)', _e); }
        setRoute('lectures');
        try { localStorage.setItem('bgnj_route', 'lectures'); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (boot.jsx:722)', _e); }
      } else {
        const tourMatch = h.match(/^#tour-(.+)$/);
        if (tourMatch) {
          try { sessionStorage.setItem('bgnj_pending_tour_id', decodeURIComponent(tourMatch[1])); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (boot.jsx:726)', _e); }
          setRoute('tour');
          try { localStorage.setItem('bgnj_route', 'tour'); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (boot.jsx:728)', _e); }
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

  // v00.198 — admin lazy-load. route 진입 시 동적 스크립트 주입.
  // v00.212 — login/signup 도 같은 번들에 LoginPage/SignupPage 가 정의되어 있어 동일 트리거 필요.
  //           직접 /login·/signup URL 진입 시 PAGE_NOT_LOADED 회피.
  const ADMIN_BUNDLE_ROUTES = ['admin', 'login', 'signup'];
  const [adminLoaded, setAdminLoaded] = React.useState(() => typeof window !== 'undefined' && !!window.AdminPage);
  const [adminLoadError, setAdminLoadError] = React.useState(null);
  const [adminLoadAttempt, setAdminLoadAttempt] = React.useState(0);
  React.useEffect(() => {
    if (!ADMIN_BUNDLE_ROUTES.includes(route)) return;
    if (adminLoaded) return;
    let cancelled = false;
    setAdminLoadError(null);
    _loadAdminScripts()
      .then(() => { if (!cancelled) setAdminLoaded(true); })
      .catch((err) => {
        // v00.262.004 — A4 silent 였던 catch. PAGE_NOT_LOADED 가 떠도 콘솔에 단서 없었음.
        try { console.error('[adminBundle] load failed', err); } catch (_e) { console.warn('[bgnj] boot.jsx:760 오류(무시하고 진행)', _e); }
        if (!cancelled) setAdminLoadError(err);
      });
    return () => { cancelled = true; };
  }, [route, adminLoaded, adminLoadAttempt]);

  // 페이지 컴포넌트를 window 에서 defensive lookup — babel-standalone 스크립트 로드 순서/실패에
  // 견고하게 동작. 컴포넌트가 없으면 fallback UI 렌더(전체 앱 트리는 죽지 않게).
  const renderPage = () => {
    const W = window;
    const fallback = (label) => () => (
      <div style={{padding:48, textAlign:'center', color:'#1f2937'}}>
        <div style={{fontFamily:'monospace', fontSize:11, color:'#dc2626', letterSpacing:'0.18em', marginBottom:8}}>PAGE_NOT_LOADED</div>
        <div style={{fontFamily:'serif', fontSize:18, marginBottom:6}}>{label} 페이지를 불러오지 못했습니다</div>
        <div style={{fontSize:12, color:'#64748b', marginBottom:18}}>새로고침 후에도 같은 화면이 보인다면 잠시 후 다시 시도해 주세요.</div>
        <button onClick={() => { try { window.location.reload(); } catch (_e) { console.warn('[bgnj] boot.jsx:775 오류(무시하고 진행)', _e); } }} style={{padding:'8px 16px', cursor:'pointer'}}>페이지 새로고침</button>
      </div>
    );
    const pick = (name, label) => W[name] || fallback(label);
    switch (route) {
      case "home":      { const C = HomePage;      return <C go={go} tweaks={tweaks}/>; }
      case "home-next": { const C = HomeNextPage; return <C go={go}/>; }
      // v00.267 — 자고 놀자 = 한켠(직영 숙소) 예약 시스템. sleep 라우트가 한켠 예약 페이지를 직접 렌더.
      case "sleep":
      case "hangyeon":  { const C = HangyeonPage; return <C go={go} user={user}/>; }
      case "community": { const C = CommunityPage; return <C go={go} postId={postId} setPostId={setPostId} user={user}/>; }
      case "tour":      { const C = TourPage; return <C go={go} user={user}/>; }
      case "lectures":  { const C = LecturesPage; return <C go={go} user={user}/>; }
      case "privacy":   { const C = LegalPage; return <C go={go} slug="privacy"/>; }
      case "terms":     { const C = LegalPage; return <C go={go} slug="terms"/>; }
      case "faq":       { const C = FaqPage; return <C go={go}/>; }
      case "column":    { const C = ColumnPage; return <C go={go} user={user}/>; }
      case "book":      { const C = BookPage; return <C go={go} cart={cart} setCart={setCart} user={user}/>; }
      case "checkout":  { const C = CheckoutPage; return <C go={go} cart={cart} user={user}/>; }
      case "mypage":    {
        // v00.229 — /mypage 는 회원 전용. 비로그인 진입 시 401 페이지로 자동 wiring.
        if (!user) { const C = Error401Page; return <C go={go}/>; }
        const C = MyPage; return <C go={go} user={user} cart={cart}/>;
      }
      case "login":
      case "signup":    {
        // v00.212 — LoginPage/SignupPage 가 admin 번들에 들어있어 lazy-load 대기 처리.
        // 미준비 시 PAGE_NOT_LOADED 대신 로딩 화면, 실패 시 retry UI.
        if (!adminLoaded) {
          return <_AdminLoadingFallback label={route === 'signup' ? '회원가입' : '로그인'} error={adminLoadError}
            onRetry={() => { setAdminLoadError(null); setAdminLoadAttempt((v) => v + 1); }}/>;
        }
        const C = pick('LoginPage','로그인');
        return <C go={go} setUser={setUser} initialMode={route === 'signup' ? 'signup' : 'login'}/>;
      }
      case "admin":     {
        // v00.229 — /admin 권한 분기 세분화. 비로그인 → 401, 로그인했지만 비-admin → 403 (AdminDenied 유지: email 표시 UX).
        if (!user) { const C = Error401Page; return <C go={go}/>; }
        if (!user.isAdmin) { const D = pick('AdminDenied','관리'); return <D go={go} user={user}/>; }
        // v00.198 — 스크립트 lazy-load. 미준비 시 로딩 화면, 실패 시 retry UI.
        if (!adminLoaded) {
          return <_AdminLoadingFallback error={adminLoadError}
            onRetry={() => { setAdminLoadError(null); setAdminLoadAttempt((v) => v + 1); }}/>;
        }
        const C = pick('AdminPage','관리'); return <C go={go} user={user}/>;
      }
      // v00.229 — 라이브 에러 라우트. /error?code=403|404|401|500|network|maintenance.
      // 미리보기 패널만 있던 ErrorPages 가 사용자에게도 진입 가능. 어드민이 회원에게 링크 공유 시 활용.
      case "error":     {
        let code = '404';
        try {
          const sp = new URLSearchParams(window.location.search);
          const c = (sp.get('code') || '').toLowerCase();
          if (c) code = c;
        } catch (_e) { console.warn('[bgnj] boot.jsx:829 오류(무시하고 진행)', _e); }
        const map = {
          '401':         'Error401Page',
          '403':         'Error403Page',
          '404':         'Error404Page',
          '500':         'Error500Page',
          'network':     'ErrorNetworkPage',
          'maintenance': 'ErrorMaintenancePage',
        };
        const C = pick(map[code] || 'Error404Page', '오류');
        return <C go={go}/>;
      }
      // v00.145 — 404: 알 수 없는 라우트는 home 으로 폴백하지 않고 Error404Page 노출.
      default:          { const C = Error404Page; return <C go={go}/>; }
    }
  };
  // 페이지별 에러 바운더리 — 한 페이지가 던진 오류가 전역으로 번지지 않게. key=route 로 라우트 변경 시 자동 reset.
  const page = <PageErrorBoundary key={route} route={route} go={go}>{renderPage()}</PageErrorBoundary>;

  return (
    <div className="app">
      {/* v00.257 — 사이트 공지 배너 동적화. site_content_kv.banner 에서 읽어옴.
          enabled false 또는 미설정 시 미노출. dismissible 시 사용자 X 클릭으로 닫기 + sessionStorage 기록. */}
      {!hideNav && <SiteBanner/>}
      <Nav route={route} go={go} user={user} onLogout={logout}/>
      <main id="main" tabIndex="-1" style={{flex:1, outline:'none'}} aria-label={`${route} 페이지 본문`}>{page}</main>
      {!hideNav && <Footer go={go}/>}
      <Tweaks tweaks={tweaks} setTweaks={updateTweaks} visible={editMode}/>
      <ScrollToTop/>
      {/* v00.290 — 우하단 도움 위젯. Nav 가 숨겨진 화면(에러/전체화면)에서는 함께 숨긴다. */}
      {!hideNav && <HelpWidget go={go}/>}
      <CookieConsent/>
      <GlobalErrorToast/>
      <VersionUpdateBanner/>
      {window.ConfirmDialogHost ? <window.ConfirmDialogHost/> : null}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppErrorBoundary><App/></AppErrorBoundary>);

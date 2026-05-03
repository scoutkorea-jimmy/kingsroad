// 뱅기노자 오류 페이지 (404 / 500 / 403 / 401 / Network / Maintenance) — v00.145
// 사용자 가이드 이미지를 따른 통일 카드 디자인.
// 일러스트: assets/errors/{name}.png (1000x1000 권장).
// 라우팅:
//   - 404: boot.jsx default route fallback
//   - 403: AdminDenied 대체 + 권한 부족 페이지
//   - 401: 로그인 필요한 페이지에서 비로그인 시
//   - 500: PageErrorBoundary fallback
//   - Network: navigator.onLine 변화 감지
//   - Maintenance: 사이트 점검 모드 (수동 토글)

const _ErrorBrand = () => (
  <div style={{display:'flex', alignItems:'center', gap:8, padding:'18px 22px', borderBottom:'1px solid var(--line)'}}>
    <span aria-hidden="true" style={{
      width:22, height:22, display:'inline-grid', placeItems:'center',
      background:'var(--gold)', color:'#0F172A', fontWeight:800, fontSize:11,
      borderRadius:4, fontFamily:'var(--font-mono)',
    }}>B</span>
    <span style={{fontSize:13, fontWeight:600, letterSpacing:'0.04em', color:'var(--ink)'}}>뱅기노자</span>
  </div>
);

const _ErrorIllustration = ({ src, alt }) => (
  <div style={{margin:'24px auto 12px', maxWidth:360, aspectRatio:'1 / 1'}}>
    <img src={src} alt={alt}
      onError={(e) => {
        // 파일 누락 시 이모지 placeholder
        try {
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextSibling;
          if (fallback) fallback.style.display = 'grid';
        } catch {}
      }}
      style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}}/>
    <div style={{
      display:'none', placeItems:'center', height:'100%', fontSize:80,
      background:'rgba(245,213,72,0.12)', borderRadius:24,
    }} aria-hidden="true">✈️</div>
  </div>
);

// 통일 오류 카드 — 가이드 이미지의 6개 페이지가 공유하는 레이아웃.
const ErrorCard = ({
  code,           // "404" | "500" | "403" | "401" | null
  title,          // 큰 본문 제목
  subtitle,       // 작은 부연
  imageSrc,       // /assets/errors/<name>.png
  imageAlt,
  primaryAction,  // { label, onClick, icon? }
  secondaryAction,// optional
  tertiaryAction, // optional (404 만 사용)
}) => {
  return (
    <div style={{minHeight:'calc(100vh - 80px)', display:'grid', placeItems:'center', padding:'40px 16px', background:'var(--bg)'}}>
      <article style={{
        width:'100%', maxWidth:520, background:'var(--bg)',
        border:'1px solid var(--line)', boxShadow:'0 12px 40px rgba(0,0,0,0.06)',
        borderRadius:16, overflow:'hidden',
      }}>
        <_ErrorBrand/>
        <div style={{padding:'28px 28px 24px', textAlign:'center'}}>
          {code && (
            <div style={{
              fontSize:54, fontWeight:800, color:'var(--gold)',
              letterSpacing:'-0.02em', lineHeight:1, marginBottom:14,
              fontFamily:'var(--font-serif, "ChosunIlboMyungjo", serif)',
            }}>{code}</div>
          )}
          <h1 style={{
            fontSize:18, fontWeight:700, color:'var(--ink)', lineHeight:1.5,
            margin:'0 0 12px', wordBreak:'keep-all',
          }}>{title}</h1>
          {subtitle && (
            <p style={{
              fontSize:13, color:'var(--ink-3)', lineHeight:1.7, margin:0, wordBreak:'keep-all',
            }}>{subtitle}</p>
          )}
          <_ErrorIllustration src={imageSrc} alt={imageAlt || title}/>
          <div style={{
            display:'flex', flexDirection: tertiaryAction ? 'column' : 'row',
            gap:10, marginTop:8,
          }}>
            <div style={{display:'flex', gap:10, flex:1}}>
              {primaryAction && (
                <button type="button" onClick={primaryAction.onClick}
                  className="error-btn error-btn--primary"
                  style={{
                    flex:1, padding:'12px 16px', fontSize:13, fontWeight:600,
                    background:'var(--gold)', color:'#0F172A',
                    border:'1px solid var(--gold)', borderRadius:10,
                    cursor:'pointer', display:'inline-flex',
                    alignItems:'center', justifyContent:'center', gap:6,
                    transition:'opacity 0.15s',
                  }}>
                  {primaryAction.icon && <span aria-hidden="true">{primaryAction.icon}</span>}
                  {primaryAction.label}
                </button>
              )}
              {secondaryAction && (
                <button type="button" onClick={secondaryAction.onClick}
                  className="error-btn error-btn--secondary"
                  style={{
                    flex:1, padding:'12px 16px', fontSize:13, fontWeight:600,
                    background:'var(--bg)', color:'var(--ink)',
                    border:'1px solid var(--line-2)', borderRadius:10,
                    cursor:'pointer', display:'inline-flex',
                    alignItems:'center', justifyContent:'center', gap:6,
                    transition:'border-color 0.15s',
                  }}>
                  {secondaryAction.icon && <span aria-hidden="true">{secondaryAction.icon}</span>}
                  {secondaryAction.label}
                </button>
              )}
            </div>
            {tertiaryAction && (
              <button type="button" onClick={tertiaryAction.onClick}
                className="error-btn error-btn--tertiary"
                style={{
                  padding:'10px 16px', fontSize:12, fontWeight:500,
                  background:'transparent', color:'var(--ink-2)',
                  border:'1px solid var(--line-2)', borderRadius:10,
                  cursor:'pointer', display:'inline-flex',
                  alignItems:'center', justifyContent:'center', gap:6,
                }}>
                {tertiaryAction.icon && <span aria-hidden="true">{tertiaryAction.icon}</span>}
                {tertiaryAction.label}
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

// === 404 — 페이지를 찾을 수 없음 ============================================
const Error404Page = ({ go }) => (
  <ErrorCard
    code="404"
    title="비행기가 잠시 다른 항로로 들어갔어요."
    subtitle={(
      <>찾으시는 페이지가 이동되었거나,<br/>주소가 잘못 입력되었을 수 있어요.</>
    )}
    imageSrc="/assets/errors/404.png"
    imageAlt="길을 잃은 비행기"
    primaryAction={{ label: '홈으로 돌아가기', icon: '🏠', onClick: () => go?.('home') }}
    secondaryAction={{ label: '투어 둘러보기', icon: '🧭', onClick: () => go?.('tour') }}
    tertiaryAction={{ label: '이전 페이지로', icon: '←', onClick: () => { try { history.back(); } catch {} } }}/>
);

// === 500 — 서버 오류 =======================================================
const Error500Page = ({ go, onRetry }) => (
  <ErrorCard
    code="500"
    title="관제탑에서 잠시 신호를 정리하고 있어요."
    subtitle={(
      <>서비스 처리 중 일시적인 문제가 발생했어요.<br/>잠시 후 다시 시도해 주세요.</>
    )}
    imageSrc="/assets/errors/500.png"
    imageAlt="신호를 정리하는 관제탑"
    primaryAction={{ label: '다시 시도하기', icon: '🔄', onClick: () => { try { onRetry ? onRetry() : window.location.reload(); } catch {} } }}
    secondaryAction={{ label: '홈으로 돌아가기', icon: '🏠', onClick: () => go?.('home') }}/>
);

// === 403 — 권한 부족 =======================================================
const Error403Page = ({ go }) => (
  <ErrorCard
    code="403"
    title="이 항공편은 탑승 권한이 필요해요."
    subtitle="현재 계정으로는 접근할 수 없는 페이지입니다."
    imageSrc="/assets/errors/403.png"
    imageAlt="잠긴 자물쇠"
    primaryAction={{ label: '로그인하기', icon: '👤', onClick: () => go?.('login') }}
    secondaryAction={{ label: '홈으로 돌아가기', icon: '🏠', onClick: () => go?.('home') }}/>
);

// === 401 — 로그인 필요 =====================================================
const Error401Page = ({ go }) => (
  <ErrorCard
    code="401"
    title="탑승권 확인이 필요해요."
    subtitle={(
      <>로그인이 필요한 서비스입니다.<br/>계속 이용하려면 먼저 로그인해 주세요.</>
    )}
    imageSrc="/assets/errors/401.png"
    imageAlt="탑승권 확인"
    primaryAction={{ label: '로그인하기', icon: '👤', onClick: () => go?.('login') }}
    secondaryAction={{ label: '회원가입하기', icon: '👥', onClick: () => go?.('signup') }}/>
);

// === Network — 연결 불안정 =================================================
const ErrorNetworkPage = ({ onRetry }) => (
  <ErrorCard
    code={null}
    title="하늘길 연결이 잠시 불안정해요."
    subtitle={(
      <>인터넷 연결 상태를 확인한 뒤<br/>다시 시도해 주세요.</>
    )}
    imageSrc="/assets/errors/network.png"
    imageAlt="네트워크 신호 약함"
    primaryAction={{ label: '다시 시도하기', icon: '🔄', onClick: () => { try { onRetry ? onRetry() : window.location.reload(); } catch {} } }}/>
);

// === Maintenance — 점검 중 =================================================
const ErrorMaintenancePage = ({ go }) => (
  <ErrorCard
    code={null}
    title="서비스 점검 중이에요."
    subtitle={(
      <>더 좋은 여행을 위해 잠시 정비 중이에요.<br/>현재 서비스 점검이 진행 중입니다. 곧 다시 이용하실 수 있어요.</>
    )}
    imageSrc="/assets/errors/maintenance.png"
    imageAlt="점검 안내"
    primaryAction={{ label: '공지사항 보기', icon: '📢', onClick: () => go?.('community') }}
    secondaryAction={{ label: '홈으로 돌아가기', icon: '🏠', onClick: () => go?.('home') }}/>
);

Object.assign(window, {
  ErrorCard,
  Error404Page,
  Error500Page,
  Error403Page,
  Error401Page,
  ErrorNetworkPage,
  ErrorMaintenancePage,
});

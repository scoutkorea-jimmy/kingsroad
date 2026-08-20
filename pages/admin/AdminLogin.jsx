// 뱅기노자 — 로그인 / 회원가입 흐름 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// LegalModal · AuthErrorPanel · INTEREST_OPTIONS · LoginPage.
// 자기완결적 — 의존은 모두 window 전역(BGNJ_AUTH/SITE_CONTENT/LEGAL/SAFE_HTML, useModalGuard).
// boot 가 로그인/관리자 route 진입 시 admin 번들로 로드. LoginPage 만 window 노출.
// BanginojaIcon 은 Shell 이 Object.assign(window, …) 로 전역에 올린다(main 번들).
// 여기서 Shell 을 import 하면 admin 번들에 Shell 사본이 하나 더 생기고,
// 그 사본의 Object.assign 이 window.Nav 를 다른 인스턴스로 덮어 메뉴가 재마운트된다.
// === 약관/개인정보 모달 ==================================================
// 회원가입 시 이용약관 텍스트를 클릭하면 모달로 본문을 노출.
const LegalModal = ({ slug, onClose }) => {
  const doc = (window.BGNJ_LEGAL?.get(slug)) || { title: slug === 'terms' ? '이용약관' : '개인정보 처리방침', body: '<p>(준비 중)</p>' };
  // v00.077 — useModalGuard 통일: ESC + body scroll lock + history pushState/popstate.
  // dirty=false (읽기 전용 모달) → 즉시 닫기, 임시저장 prompt 없음.
  window.useModalGuard?.({ open: true, dirty: false, onClose, onSaveDraft: null, label: doc.title });
  return (
    <div role="dialog" aria-modal="true" aria-label={doc.title}
      onClick={onClose}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000,
        display:'grid', placeItems:'center', padding:'24px',
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background:'var(--bg)', maxWidth:720, width:'100%', maxHeight:'80vh',
          overflow:'auto', padding:'28px 32px', border:'1px solid var(--line)',
          boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
        }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, gap:16}}>
          <h2 className="ko-serif" style={{fontSize:22, margin:0}}>{doc.title}</h2>
          <button type="button" className="btn btn-small" onClick={onClose}>닫기</button>
        </div>
        <div className="legal-body" style={{fontSize:14, lineHeight:1.85, color:'var(--ink)'}}
          dangerouslySetInnerHTML={{__html: window.BGNJ_SAFE_HTML(doc.body || '<p>(준비 중)</p>')}}/>
      </div>
    </div>
  );
};

// 인증 흐름 에러 패널 — 코드 + 정확한 사유 + 사용자 가이드 + 콘솔 가이드까지 분리해서 노출.
const AuthErrorPanel = ({ error, onDismiss }) => {
  if (!error) return null;
  const code = error.code || 'UNKNOWN';
  const status = error.status ? `HTTP ${error.status}` : null;
  const kindLabel = ({
    network: '네트워크',
    cors: 'CORS',
    http: '서버 응답',
    parse: '응답 해석',
    client: '입력 검증',
    unknown: '오류',
  })[error.kind] || '오류';
  return (
    <div role="alert" aria-live="assertive"
      style={{
        margin: '16px 0 4px',
        padding: '14px 16px',
        background: 'rgba(194,74,61,0.06)',
        border: '1px solid var(--danger)',
        color: 'var(--ink)',
        fontSize: 13,
        lineHeight: 1.7,
      }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6, gap:12}}>
        <div className="mono" style={{fontSize:11, letterSpacing:'0.18em', color:'var(--danger)'}}>
          {kindLabel} 오류 · {code}{status ? ` · ${status}` : ''}
        </div>
        {onDismiss && (
          <button type="button" onClick={onDismiss}
            className="btn-ghost"
            style={{fontSize:11, color:'var(--ink-3)'}}
            aria-label="에러 메시지 닫기">×</button>
        )}
      </div>
      <div style={{fontWeight:600, marginBottom:6}}>{error.message || '알 수 없는 오류'}</div>
      {error.hint && (
        <div className="dim-2" style={{fontSize:12, lineHeight:1.7}}>{error.hint}</div>
      )}
      {error.url && (
        <div className="mono dim-2" style={{fontSize:10, marginTop:8, wordBreak:'break-all'}}>
          요청: {error.url}
        </div>
      )}
      <div className="mono dim-2" style={{fontSize:10, marginTop:6}}>
        ⓘ 자세한 진단 정보는 브라우저 개발자 도구(F12)의 콘솔/네트워크 탭에서 확인할 수 있습니다.
      </div>
    </div>
  );
};

const INTEREST_OPTIONS = [
  { value: 'palace',       label: '궁궐 답사' },
  { value: 'history',      label: '조선 역사' },
  { value: 'philosophy',   label: '동양 철학' },
  { value: 'literature',   label: '한문학' },
  { value: 'architecture', label: '전통 건축' },
  { value: 'art',          label: '미술사' },
  { value: 'other',        label: '기타 (직접 입력)' },
];

// v00.213 — initialMode prop 추가. /signup URL 직접 진입 시 회원가입 탭으로 시작.
const LoginPage = ({ go, setUser, initialMode = "login" }) => {
  const [mode, setMode] = React.useState(initialMode); // login | signup
  const [form, setForm] = React.useState({
    name: "", email: "", password: "", password2: "",
    birthdate: "", phone: "", zip: "", addr1: "", addr2: "",
    gender: "", interest: "", interestOther: "", recommender: "",
    consentTerms: false,
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [legalModal, setLegalModal] = React.useState(null); // 'terms' | 'privacy' | null
  const [authError, setAuthError] = React.useState(null); // { code, status, kind, message, hint, url } | { code:'CLIENT', message }
  const authContent = React.useMemo(() => (window.BGNJ_SITE_CONTENT?.get?.()?.auth) || {}, []);
  const set = (k, v) => { setForm({ ...form, [k]: v }); if (authError) setAuthError(null); };
  const setMode2 = (next) => { setMode(next); setAuthError(null); };

  const submit = async () => {
    if (submitting) return;
    setAuthError(null);
    const normalizedEmail = (form.email || "").trim().toLowerCase();
    const password = form.password || "";

    // 클라이언트 사전 검증 — alert 대신 인라인 에러 패널로 노출.
    const clientError = (code, message) => setAuthError({ code, kind: 'client', message, hint: '' });

    if (!normalizedEmail) return clientError('FORM_EMAIL_REQUIRED', '이메일을 입력해 주세요.');
    if (!password) return clientError('FORM_PASSWORD_REQUIRED', '비밀번호를 입력해 주세요.');

    if (mode === "signup") {
      if (!form.name.trim()) return clientError('FORM_NAME_REQUIRED', '이름을 입력해 주세요.');
      if (password.length < 8) return clientError('FORM_PASSWORD_TOO_SHORT', '비밀번호는 8자 이상으로 입력해 주세요.');
      if (password !== form.password2) return clientError('FORM_PASSWORD_MISMATCH', '비밀번호 확인이 일치하지 않습니다.');
      if (!form.consentTerms) return clientError('FORM_CONSENT_REQUIRED', '이용약관 및 개인정보 처리방침 동의가 필요합니다.');
    }

    setSubmitting(true);
    try {
      // 관심분야 — '기타' 선택 시 직접 입력값을 저장.
      const interestValue = form.interest === 'other'
        ? (form.interestOther || '').trim()
        : form.interest;
      const authResult = mode === "login"
        ? await window.BGNJ_AUTH.signIn({ email: normalizedEmail, password })
        : await window.BGNJ_AUTH.signUp({
            name: form.name.trim(),
            email: normalizedEmail,
            password,
            profile: {
              birthdate: form.birthdate,
              phone: form.phone,
              zip: form.zip,
              addr1: form.addr1,
              addr2: form.addr2,
              gender: form.gender,
              interest: interestValue,
              recommender: form.recommender,
            },
            consents: { terms: true },
          });

      if (!authResult.ok) {
        // 콘솔에도 동일 정보를 남겨 운영자가 개발자 도구에서 빠르게 확인할 수 있도록.
        try { console.error('[BGNJ_AUTH]', mode, authResult); } catch (_e) { console.warn('[bgnj] AdminLogin.jsx:163 오류(무시하고 진행)', _e); }
        setAuthError(authResult);
        return;
      }

      setUser(authResult.user);
      go(authResult.user.isAdmin ? "admin" : "home");
    } finally {
      setSubmitting(false);
    }
  };

  // 관리자 편집 가능 좌측 영역 — auth.imageDataUri 가 있으면 이미지 배경, 없으면 기본 그라데이션.
  const authBg = authContent.imageDataUri
    ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%), url(${authContent.imageDataUri})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 100%)` };
  const authTitle = authContent.title || '뱅기 타고\n뱅기노자가 되다';
  const authDescription = authContent.description || '뱅기노자는 단순 여행 정보 사이트가 아닙니다. 함께 떠나고, 함께 걷고, 함께 이야기하는 여행자들의 광장입니다. 매달 새로운 답사와 칼럼이 이어집니다.';
  const authEyebrow = authContent.eyebrow || 'BANGINOJA';

  return (
    <div style={{minHeight:'calc(100vh - 72px)', display:'grid', gridTemplateColumns:'1fr 1fr'}} className="auth-grid">
      {/* Left: art (관리자에서 이미지/문구 편집 가능) — v00.215 모바일에서 숨김 (사용자 민원: 폼이 첫 화면에서 안 보임). */}
      <div className="auth-art" style={{
        ...authBg,
        borderRight:'1px solid var(--line)',
        padding:'80px 60px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        color: authContent.imageDataUri ? '#fff' : undefined,
      }}>
        <div>
          <BanginojaIcon size={36}/>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginTop:24}}>{authEyebrow}</div>
        </div>
        <div style={{maxWidth:480}}>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:16}}>
            {mode === "login" ? "— WELCOME BACK" : "— JOIN US"}
          </div>
          <h2 style={{fontFamily:'var(--font-serif)', fontSize:48, fontWeight:500, lineHeight:1.15, marginBottom:20, whiteSpace:'pre-line'}}>
            {authTitle}
          </h2>
          <p className={authContent.imageDataUri ? '' : 'dim'} style={{fontSize:15, lineHeight:1.9}}>
            {authDescription}
          </p>
        </div>
      </div>
      {/* Right: form */}
      <div style={{padding:'80px 60px', display:'grid', placeItems:'center'}}>
        <div style={{width:'100%', maxWidth:400}}>
          <div style={{display:'flex', gap:0, marginBottom:40, borderBottom:'1px solid var(--line)'}}>
            {[{k:"login", l:"로그인"}, {k:"signup", l:"회원가입"}].map(t => (
              <button key={t.k}
                onClick={() => setMode2(t.k)}
                style={{
                  flex:1, padding:'14px',
                  fontFamily:'var(--font-serif)',
                  fontSize:16,
                  color: mode === t.k ? 'var(--primary)' : 'var(--ink-3)',
                  borderBottom: mode === t.k ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom:-1,
                }}>{t.l}</button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); submit(); }}
            aria-labelledby="auth-heading" noValidate>
            <h1 id="auth-heading" className="sr-only">
              {mode === "login" ? "로그인" : "회원가입"}
            </h1>

            {/* 필수 항목 */}
            {mode === "signup" && (
              <div className="field">
                <label className="field-label" htmlFor="auth-name">이름 <span aria-hidden="true" className="gold">*</span><span className="sr-only">(필수)</span></label>
                <input id="auth-name" name="name" className="field-input"
                  autoComplete="name" required aria-required="true"
                  value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="실명을 입력해주세요"/>
              </div>
            )}
            <div className="field">
              <label className="field-label" htmlFor="auth-email">이메일 <span aria-hidden="true" className="gold">*</span></label>
              <input id="auth-email" name="email" type="email" className="field-input"
                autoComplete="email" required aria-required="true" inputMode="email"
                value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="contact@bgnj.net"/>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="auth-password">비밀번호 <span aria-hidden="true" className="gold">*</span></label>
              <input id="auth-password" name="password" type="password" className="field-input"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required aria-required="true" minLength={8}
                value={form.password} onChange={e => set('password', e.target.value)}
                aria-describedby="auth-password-hint"
                placeholder="••••••••"/>
              {mode === "signup" && (
                <span id="auth-password-hint" className="field-hint">8자 이상, 영문·숫자·기호 조합 권장</span>
              )}
            </div>

            {mode === "signup" && (
              <>
                <div className="field">
                  <label className="field-label" htmlFor="auth-password2">비밀번호 확인 <span aria-hidden="true" className="gold">*</span></label>
                  <input id="auth-password2" name="password2" type="password" className="field-input"
                    autoComplete="new-password" required aria-required="true"
                    value={form.password2} onChange={e => set('password2', e.target.value)}
                    placeholder="••••••••"/>
                </div>

                {/* 선택 항목 — 접기/펴기 */}
                <details style={{border:'1px solid var(--line)', padding:'14px 16px', margin:'24px 0'}}>
                  <summary style={{cursor:'pointer', fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.2em', color:'var(--secondary)'}}>
                    추가 정보 입력 (선택 · 입력하지 않아도 사이트 이용에 문제 없음)
                  </summary>
                  <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.7, padding:'10px 12px', background:'rgba(245,213,72,0.06)', border:'1px solid var(--primary-dim)'}}>
                    <strong className="gold">아래 항목은 모두 선택입니다.</strong> 입력하지 않으셔도 회원가입과 모든 사이트 기능을 동일하게 이용하실 수 있습니다. 수집된 정보는 GDPR/PIPA에 따라 관리되며, 언제든 열람·정정·삭제할 수 있습니다.
                  </p>

                  <div className="field" style={{marginTop:16}}>
                    <label className="field-label" htmlFor="auth-birthdate">생년월일</label>
                    <input id="auth-birthdate" type="date" className="field-input"
                      autoComplete="bday"
                      value={form.birthdate} onChange={e => set('birthdate', e.target.value)}/>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="auth-gender">성별</label>
                    <select id="auth-gender" className="field-input"
                      value={form.gender} onChange={e => set('gender', e.target.value)}>
                      <option value="">선택 안 함</option>
                      <option value="f">여성</option>
                      <option value="m">남성</option>
                      <option value="x">기타 / 응답 안 함</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="auth-phone">전화번호</label>
                    <input id="auth-phone" type="tel" className="field-input"
                      autoComplete="tel" inputMode="tel"
                      value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="010-0000-0000"/>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="auth-zip">우편번호</label>
                    <input id="auth-zip" className="field-input"
                      autoComplete="postal-code"
                      value={form.zip} onChange={e => set('zip', e.target.value)}
                      placeholder="00000" style={{maxWidth:160}}/>
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="auth-addr1">주소</label>
                    <input id="auth-addr1" className="field-input"
                      autoComplete="address-line1"
                      value={form.addr1} onChange={e => set('addr1', e.target.value)}
                      placeholder="시/구/도로명"/>
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="auth-addr2">상세 주소</label>
                    <input id="auth-addr2" className="field-input"
                      autoComplete="address-line2"
                      value={form.addr2} onChange={e => set('addr2', e.target.value)}
                      placeholder="동/호수 등"/>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="auth-interest">관심 분야</label>
                    <select id="auth-interest" className="field-input"
                      value={form.interest} onChange={e => set('interest', e.target.value)}>
                      <option value="">선택 안 함</option>
                      {INTEREST_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {form.interest === 'other' && (
                      <input type="text" className="field-input" style={{marginTop:8}}
                        placeholder="관심 분야를 직접 입력해 주세요"
                        value={form.interestOther}
                        onChange={(e) => set('interestOther', e.target.value)}
                        maxLength={60}/>
                    )}
                  </div>

                  <div className="field" style={{marginBottom:0}}>
                    <label className="field-label" htmlFor="auth-ref">추천인 이메일</label>
                    <input id="auth-ref" type="email" className="field-input"
                      value={form.recommender} onChange={e => set('recommender', e.target.value)}
                      placeholder="추천해준 분이 있다면 이메일 입력"/>
                  </div>
                </details>

                <label htmlFor="consent-terms" style={{display:'flex', gap:10, alignItems:'flex-start', margin:'16px 0 20px', fontSize:12, color:'var(--ink-2)', lineHeight:1.6}}>
                  <input id="consent-terms" type="checkbox" required aria-required="true"
                    checked={form.consentTerms} onChange={e => set('consentTerms', e.target.checked)}
                    style={{accentColor:'var(--primary)', marginTop:3}}/>
                  <span>
                    <button type="button" className="btn-ghost" onClick={() => setLegalModal('terms')}
                      style={{padding:0, color:'var(--secondary)', textDecoration:'underline', fontSize:12}}>
                      이용약관
                    </button>
                    {' '}및{' '}
                    <button type="button" className="btn-ghost" onClick={() => setLegalModal('privacy')}
                      style={{padding:0, color:'var(--secondary)', textDecoration:'underline', fontSize:12}}>
                      개인정보 처리방침
                    </button>
                    에 동의합니다 <span className="gold">(필수)</span>
                  </span>
                </label>
              </>
            )}
            {legalModal && <LegalModal slug={legalModal} onClose={() => setLegalModal(null)}/>}
            {authError && <AuthErrorPanel error={authError} onDismiss={() => setAuthError(null)}/>}
            {mode === "login" && (
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, fontSize:12}}>
                <label htmlFor="keep-login" style={{display:'flex', gap:8, alignItems:'center', color:'var(--ink-2)'}}>
                  <input id="keep-login" type="checkbox" style={{accentColor:'var(--primary)'}}/>로그인 유지
                </label>
              <button type="button" className="btn-ghost" style={{color:'var(--secondary)'}}>비밀번호 찾기</button>
            </div>
          )}
            <button type="submit" className="btn btn-gold btn-block" disabled={submitting} aria-busy={submitting}>
              {submitting ? "처리 중..." : (mode === "login" ? "입장하기 →" : "회원가입 →")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
window.LoginPage = LoginPage;

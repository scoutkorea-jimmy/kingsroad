// 로그인, 회원가입, 관리자 페이지
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
        try { console.error('[BGNJ_AUTH]', mode, authResult); } catch {}
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

// === GDPR/PIPA 모의 데이터 ========================================
const PRIVACY_DATA = {
  // Data Subject Rights — 정보주체 권리 요청 큐
  // GDPR Art.15–22 / PIPA §35–38. 기본 응답기한: GDPR 1개월, PIPA 10일. 72h 타이머는 권고.
  dsrRequests: [
    { id: "DSR-2026-041", type: "access",     user: "돌담아래",    email: "stone@example.com", openedAt: "2026-04-19T09:12:00Z", dueAt: "2026-05-19T23:59:00Z", law: "GDPR+PIPA", status: "open" },
    { id: "DSR-2026-040", type: "erasure",    user: "overseas_reader", email: "r@eu.example", openedAt: "2026-04-18T16:04:00Z", dueAt: "2026-05-18T23:59:00Z", law: "GDPR",      status: "in_progress", assignee: "DPO" },
    { id: "DSR-2026-039", type: "rectify",    user: "역사애호",    email: "h@example.com",    openedAt: "2026-04-16T11:30:00Z", dueAt: "2026-04-26T23:59:00Z", law: "PIPA",      status: "in_progress", assignee: "김관리" },
    { id: "DSR-2026-038", type: "portability",user: "봄밤의자",    email: "s@eu.example",     openedAt: "2026-04-14T10:00:00Z", dueAt: "2026-05-14T23:59:00Z", law: "GDPR",      status: "done",   resolvedAt: "2026-04-17T15:22:00Z" },
    { id: "DSR-2026-037", type: "restrict",   user: "입문자",      email: "b@example.com",    openedAt: "2026-04-10T08:00:00Z", dueAt: "2026-04-20T23:59:00Z", law: "PIPA",      status: "done",   resolvedAt: "2026-04-13T09:10:00Z" },
  ],
  // 동의 항목 정의 (버전 관리)
  consentDefs: [
    { key: "terms",     label: "이용약관",               required: true,  version: "v3.1", updated: "2026-03-02", lawful: "계약 이행" },
    { key: "privacy",   label: "개인정보 처리방침",      required: true,  version: "v4.0", updated: "2026-03-02", lawful: "법적 의무(PIPA §15)" },
    { key: "marketing", label: "마케팅 정보 수신 (이메일)", required: false, version: "v2.0", updated: "2026-01-15", lawful: "명시적 동의(GDPR Art.6(1)(a))" },
    { key: "sms",       label: "SMS 수신",               required: false, version: "v1.2", updated: "2025-11-10", lawful: "명시적 동의" },
    { key: "profiling", label: "관심사 기반 추천 프로파일링", required: false, version: "v1.0", updated: "2026-02-01", lawful: "명시적 동의(GDPR Art.22)" },
  ],
  // ROPA — Record of Processing Activities (GDPR Art.30)
  ropa: [
    { id: "ROPA-01", purpose: "회원 식별·계정 운영",   lawful: "계약 이행",     items: "이름, 이메일, 비밀번호(해시)", retention: "탈퇴 후 즉시 파기", controller: "뱅기노자", processor: "AWS(서울)", transfer: "없음" },
    { id: "ROPA-02", purpose: "결제 및 주문 처리",     lawful: "계약 이행",     items: "주소, 전화번호, 카드토큰",     retention: "전자상거래법 5년",   controller: "뱅기노자", processor: "토스페이먼츠", transfer: "없음" },
    { id: "ROPA-03", purpose: "마케팅·뉴스레터",       lawful: "명시적 동의",   items: "이메일, 관심분야",             retention: "철회 시 즉시",       controller: "뱅기노자", processor: "Mailgun(US)", transfer: "미국(SCCs)" },
    { id: "ROPA-04", purpose: "사이트 분석·개선",      lawful: "정당한 이익",   items: "쿠키ID, 접속로그, UA",         retention: "13개월",             controller: "뱅기노자", processor: "Plausible(EU)", transfer: "EU(적정성)" },
    { id: "ROPA-05", purpose: "투어 참가자 관리",      lawful: "계약 이행",     items: "이름, 연락처, 참가일자",       retention: "행사 종료 후 6개월", controller: "뱅기노자", processor: "자체",         transfer: "없음" },
  ],
  cookies: [
    { name: "bgnj_session", cat: "필수",  purpose: "로그인 상태 유지",   ttl: "세션",   party: "1st" },
    { name: "bgnj_route",   cat: "필수",  purpose: "마지막 방문 경로",   ttl: "영구(로컬)", party: "1st" },
    { name: "_pl_visits",  cat: "분석",  purpose: "방문 통계(Plausible)", ttl: "24시간", party: "3rd" },
    { name: "_mkt_lead",   cat: "마케팅", purpose: "캠페인 효과 측정",   ttl: "90일",   party: "3rd" },
  ],
  breaches: [
    { id: "INC-2026-02", detectedAt: "2026-04-15T02:41:00Z", severity: "low",    affected: 0,   kind: "접근 시도 차단", notifyDueAt: "2026-04-18T02:41:00Z", authorityNotified: false, subjectNotified: false, status: "closed", note: "WAF에서 자동 차단. 유출 없음." },
    { id: "INC-2026-01", detectedAt: "2026-02-02T13:10:00Z", severity: "medium", affected: 42,  kind: "이메일 오발송",  notifyDueAt: "2026-02-05T13:10:00Z", authorityNotified: true,  subjectNotified: true,  status: "closed" },
  ],
  retentionPolicies: [
    { category: "계정 정보",       period: "탈퇴 후 즉시",            lawful: "PIPA §21" },
    { category: "전자상거래 기록", period: "5년",                     lawful: "전자상거래법 §6" },
    { category: "로그인 기록",     period: "3개월",                   lawful: "통신비밀보호법" },
    { category: "접속 IP",         period: "3개월",                   lawful: "PIPA §21" },
    { category: "결제 기록",       period: "5년",                     lawful: "전자금융거래법" },
    { category: "마케팅 동의",     period: "철회 시 즉시",            lawful: "정보통신망법 §50" },
  ],
  transfers: [
    { recipient: "Mailgun Technologies, Inc.",      country: "미국",  purpose: "이메일 발송",          basis: "GDPR SCCs, PIPA §28의8",  items: "이메일, 이름" },
    { recipient: "Amazon Web Services, Inc.",       country: "한국(서울)", purpose: "클라우드 인프라",   basis: "국내 처리",               items: "전 데이터" },
    { recipient: "Plausible Insights OÜ",           country: "에스토니아(EU)", purpose: "사이트 분석", basis: "GDPR 적정성 결정(EU 내부)", items: "쿠키ID, UA" },
  ],
  members: [
    { id: 8734, handle: "돌담아래", email: "stone@example.com",    joined: "2025-08-12", region: "KR", consents: ["terms","privacy","marketing"] },
    { id: 8735, handle: "역사애호", email: "h@example.com",        joined: "2025-09-02", region: "KR", consents: ["terms","privacy"] },
    { id: 8736, handle: "봄밤의자", email: "s@eu.example",         joined: "2025-10-21", region: "EU", consents: ["terms","privacy","profiling"] },
    { id: 8737, handle: "overseas_reader", email: "r@eu.example",  joined: "2025-12-04", region: "EU", consents: ["terms","privacy","marketing"] },
    { id: 8738, handle: "입문자",   email: "b@example.com",        joined: "2026-01-15", region: "KR", consents: ["terms","privacy"] },
  ],
};

const DSR_LABELS = {
  access:      { ko: "열람 요청",     gdpr: "Art.15", pipa: "§35" },
  rectify:     { ko: "정정·수정",     gdpr: "Art.16", pipa: "§36" },
  erasure:     { ko: "삭제(잊혀질 권리)", gdpr: "Art.17", pipa: "§36②" },
  restrict:    { ko: "처리 제한",     gdpr: "Art.18", pipa: "§37" },
  portability: { ko: "데이터 이동",   gdpr: "Art.20", pipa: "—" },
  object:      { ko: "처리 거부",     gdpr: "Art.21", pipa: "§37" },
};

const formatTimeLeft = (dueIso) => {
  const diff = new Date(dueIso).getTime() - Date.now();
  if (diff <= 0) return { text: "기한 경과", tone: "danger" };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d === 0) return { text: `${h}시간 남음`, tone: "warn" };
  if (d <= 3) return { text: `${d}일 ${h}시간 남음`, tone: "warn" };
  return { text: `${d}일 남음`, tone: "ok" };
};

// === v00.070 trampoline =================================================
// ADMIN_VERSION_HISTORY / ADMIN_DESIGN_SECTIONS / MISSION_OVERVIEW / FEATURE_DOMAINS / DesignSystemView
// 는 pages/admin/AdminDesignHub.jsx 로 분할(이 파일이 8000 줄을 넘어 large_file lint 위반 → 분할).
// 인덱스에서 AdminDesignHub.jsx 가 본 파일보다 먼저 로드되므로 window 에서 안전하게 가져올 수 있다.
const ADMIN_VERSION_HISTORY = window.ADMIN_VERSION_HISTORY;
const ADMIN_DESIGN_SECTIONS = window.ADMIN_DESIGN_SECTIONS;
const MISSION_OVERVIEW      = window.MISSION_OVERVIEW;
const FEATURE_DOMAINS       = window.FEATURE_DOMAINS;
const DesignSystemView      = window.DesignSystemView;

// === v00.078 trampoline ================================================
// 콘텐츠 편집 패널 묶음(~1300 줄)을 pages/admin/AdminContentEditors.jsx 로 분할.
// AdminContentEditors.jsx 가 본 파일보다 먼저 로드 → window 에서 받아 사용.
const RecommendationsAdminPanel = window.RecommendationsAdminPanel;
const TPE_ScheduleEditor = window.TPE_ScheduleEditor;
const TPE_PrepEditor     = window.TPE_PrepEditor;
const TPE_PreviewCard    = window.TPE_PreviewCard;
const _arrAdd    = window._arrAdd;
const _arrRemove = window._arrRemove;
const _arrUpdate = window._arrUpdate;
const _arrMove   = window._arrMove;
const TourPageEditorPanel = window.TourPageEditorPanel;
const LecturePageEditorPanel = window.LecturePageEditorPanel; // v00.083
const LegacyMigrationPanel = window.LegacyMigrationPanel; // v00.086
const EatSleepShopAdminPanel = window.EatSleepShopAdminPanel; // v00.105
const FooterStyleEditor   = window.FooterStyleEditor;
const HeroEditorPanel     = window.HeroEditorPanel;
const HomeTextEditorPanel = window.HomeTextEditorPanel;
const BannerEditorPanel   = window.BannerEditorPanel; // v00.257


// === Report Queue Panel ===========================================
// v00.131 — 커뮤니티 게시글 본문 손상 점검. v00.129 이하에서 작성된 글은 D1 에 "[object Object]"
// 로 저장됐을 수 있음 (v00.130 hotfix 이전). 본 도구가 그 row 들을 찾아 작성자에게 알려줌 +
// 본문 직접 수정 빠른 진입.
const CorruptedBodyInspector = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const G = window.BGNJ_GUARD;
  React.useEffect(() => {
    window.BGNJ_COMMUNITY?.refreshPosts?.().finally(() => setTick((v) => v + 1));
  }, []);
  const posts = G.arr(() => window.BGNJ_COMMUNITY?.listPosts?.());
  const corrupted = posts.filter((p) => {
    const html = p?.body?.html || '';
    const text = p?.body?.text || '';
    // v00.130 _normalizePostBody 가 손상 row 를 경고 텍스트로 wrap. 'v00.129 이하 작성' 패턴 매칭.
    return /v00\.129 이하/.test(html) || /v00\.129 이하/.test(text) || html === '[object Object]' || text === '[object Object]';
  });
  return (
    <div className="card" style={{padding:18, marginBottom:18, border:'1px dashed var(--primary-dim)'}}>
      <h4 className="ko-serif" style={{fontSize:15, margin:'0 0 10px'}}>🔍 커뮤니티 본문 손상 점검 (v00.130 hotfix)</h4>
      <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:12}}>
        v00.129 이하에서 작성된 글은 D1 에 본문이 <code>[object Object]</code> 로 저장돼 화면에 경고 텍스트가 표시될 수 있습니다.
        해당 글을 클릭해 작성자가 다시 저장하면 정상 본문으로 복구됩니다.
      </p>
      {corrupted.length === 0 ? (
        <div className="gold mono" style={{fontSize:12}}>✅ 손상 글 0건 — 모두 정상.</div>
      ) : (
        <>
          <div style={{marginBottom:10, fontSize:13}}>
            ⚠ 손상 의심 글 <strong style={{color:'var(--danger)'}}>{corrupted.length}</strong>건 발견
          </div>
          <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
            {corrupted.slice(0, 30).map((p) => (
              <li key={p.id} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 10px', border:'1px solid var(--line)', fontSize:12}}>
                <span className="pill" style={{fontSize:10}}>{p.category || '?'}</span>
                <span style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.title || '(제목 없음)'}</span>
                <span className="dim-2 mono" style={{fontSize:10}}>{p.author || '?'} · {p.date || ''}</span>
                <button type="button" className="btn btn-small" onClick={() => {
                  try { sessionStorage.setItem('bgnj_pending_post_id', String(p.id)); } catch {}
                  go('community');
                }}>열기</button>
              </li>
            ))}
            {corrupted.length > 30 && (
              <li className="dim-2 mono" style={{fontSize:11, textAlign:'right'}}>외 {corrupted.length - 30}건</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

const ReportQueuePanel = ({ onRefresh, go }) => {
  const [filter, setFilter] = React.useState("open");
  const [tick, setTick] = React.useState(0);
  const [viewingPostId, setViewingPostId] = React.useState(null);
  const reports = React.useMemo(() => window.BGNJ_COMMUNITY.listReports(filter), [filter, tick]);
  const counts = React.useMemo(() => ({
    open: window.BGNJ_COMMUNITY.listReports('open').length,
    resolved: window.BGNJ_COMMUNITY.listReports('resolved').length,
    dismissed: window.BGNJ_COMMUNITY.listReports('dismissed').length,
    all: window.BGNJ_COMMUNITY.listReports('all').length,
  }), [tick]);

  const setStatus = (id, status) => {
    window.BGNJ_COMMUNITY.updateReportStatus(id, status);
    setTick((v) => v + 1);
  };

  const removePostFromReport = async (report) => {
    if (!report.postId) return;
    if (!(await window.BGNJ_CONFIRM(`"${report.postTitle}" 게시글을 삭제하고 신고를 처리 완료로 표시하시겠어요?`, { danger: true }))) return;
    window.BGNJ_COMMUNITY.deletePost(report.postId);
    window.BGNJ_COMMUNITY.updateReportStatus(report.id, 'resolved');
    setTick((v) => v + 1);
    onRefresh?.();
  };

  return (
    <div>
      <div style={{display:'flex', gap:8, marginBottom:20, flexWrap:'wrap'}}>
        {[
          { key: 'open', label: '미처리' },
          { key: 'resolved', label: '처리 완료' },
          { key: 'dismissed', label: '반려' },
          { key: 'all', label: '전체' },
        ].map((f) => (
          <button key={f.key} type="button" className="btn btn-small"
            onClick={() => setFilter(f.key)}
            style={{
              borderColor: filter === f.key ? 'var(--primary)' : 'var(--line)',
              color: filter === f.key ? 'var(--primary)' : 'var(--ink-2)',
              background: filter === f.key ? 'rgba(245,213,72,0.06)' : 'transparent',
            }}>
            {f.label} <span className="mono dim-2" style={{ fontSize: 10, marginLeft: 4 }}>{counts[f.key] ?? 0}</span>
          </button>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>
          해당 상태의 신고가 없습니다.
        </div>
      ) : (
        <div style={{display:'grid', gap:12}}>
          {reports.map((r) => {
            const tone = r.status === 'open'
              ? 'var(--danger)'
              : r.status === 'resolved'
                ? 'var(--primary)'
                : 'var(--ink-3)';
            const statusLabel = r.status === 'open' ? '미처리' : r.status === 'resolved' ? '처리 완료' : '반려';
            return (
              <article key={r.id} className="card" style={{padding:18}}>
                <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                  <div className="ko-serif" style={{fontSize:16}}>{r.postTitle}</div>
                  <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: tone}}>{statusLabel.toUpperCase()}</span>
                </div>
                <div style={{display:'grid', gap:6, marginBottom:12}}>
                  <div style={{fontSize:13, lineHeight:1.7}}>
                    <span className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.2em', marginRight:8}}>사유</span>
                    {r.reason}
                  </div>
                  <div className="dim-2 mono" style={{fontSize:11}}>
                    신고자 {r.reporterName} · {window.BGNJ_FMT.kstDateTime(r.createdAt)}
                  </div>
                </div>
                <div style={{display:'flex', gap:8, justifyContent:'flex-end', flexWrap:'wrap'}}>
                  {r.postId && (
                    <button type="button" className="btn btn-small"
                      onClick={() => setViewingPostId(r.postId)}>게시글 열기</button>
                  )}
                  {r.status !== 'resolved' && (
                    <button type="button" className="btn btn-small" onClick={() => setStatus(r.id, 'resolved')}>처리 완료</button>
                  )}
                  {r.status !== 'dismissed' && (
                    <button type="button" className="btn btn-small" onClick={() => setStatus(r.id, 'dismissed')}>반려</button>
                  )}
                  {r.status === 'open' && r.postId && (
                    <button type="button" className="btn btn-small"
                      onClick={() => removePostFromReport(r)}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>게시글 삭제 + 처리</button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      {viewingPostId && (
        <PostViewerModal postId={viewingPostId} onClose={() => setViewingPostId(null)}/>
      )}
    </div>
  );
};

// === Admin UI primitives (v00.142) ================================
// 사용자 요청 '관리자페이지의 모든 GUI를 통일성 있게'.
// 모든 panel 에서 재사용. 기존 인라인 style 들을 점진 교체.

const AdminPanelHeader = ({ eyebrow, title, description, actions }) => (
  <header className="admin-panel-header">
    <div className="admin-panel-header__main">
      {eyebrow && <div className="admin-panel-header__eyebrow">{eyebrow}</div>}
      {title && <h2 className="admin-panel-header__title">{title}</h2>}
      {description && <p className="admin-panel-header__desc">{description}</p>}
    </div>
    {actions && <div className="admin-panel-header__actions">{actions}</div>}
  </header>
);

// 상태 뱃지 — variant: gold | neutral | ink | danger | success
const StatusBadge = ({ variant = 'neutral', children, title }) => (
  <span className={`status-badge status-badge--${variant}`} title={title}>{children}</span>
);

// 빈 상태
const AdminEmpty = ({ children }) => (
  <div className="admin-empty">{children}</div>
);

// 필터 chips — items: [{ key, label, count? }]
const AdminFilterChips = ({ items, value, onChange, ariaLabel = '필터' }) => (
  <div className="admin-toolbar__filters" role="tablist" aria-label={ariaLabel}>
    {items.map((it) => (
      <button key={it.key} type="button" role="tab"
        aria-selected={value === it.key}
        className={`admin-filter-chip ${value === it.key ? 'admin-filter-chip--active' : ''}`}
        onClick={() => onChange?.(it.key)}>
        {it.label}{typeof it.count === 'number' ? ` (${it.count})` : ''}
      </button>
    ))}
  </div>
);

// 저장 바
const AdminSaveBar = ({ children, message, messageVariant = 'success' }) => (
  <div className="admin-savebar">
    {children}
    {message && (
      <span className={`admin-savebar__msg admin-savebar__msg--${messageVariant}`}>{message}</span>
    )}
  </div>
);

// === Dashboard helpers (v00.146) ==================================
// 일/주/월 활동 metrics + 가입 추이 + 활동 차트.
// data source: BGNJ_AUTH.listUsers().created_at + BGNJ_COMMUNITY.listPosts().date + comments.

// 통계 카드 — 큰 숫자 + 라벨 + 하단 보조설명 + 색상 변형.
// v00.157 — 카드 호버/포커스 시 details popover. dashboardStats 카드와 MetricCard 둘 다 사용.
// details: [{ label, value }, ...] — 비어있거나 미전달 시 popover 자체 미노출.
const HoverDetailsPopover = ({ details, open, id, anchor = 'right' }) => {
  if (!open || !Array.isArray(details) || details.length === 0) return null;
  return (
    <div role="tooltip" id={id}
      style={{
        position:'absolute', top:'100%', marginTop:8,
        [anchor === 'left' ? 'left' : 'right']: 0,
        background:'var(--bg)', border:'1px solid var(--primary-dim)',
        boxShadow:'0 8px 24px rgba(0,0,0,0.18)', padding:'14px 16px',
        minWidth:240, maxWidth:320, zIndex:50, borderRadius:8,
      }}>
      <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:10}}>DETAILS</div>
      <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
        {details.map((d, i) => (
          <li key={i} style={{display:'flex', justifyContent:'space-between', gap:14, fontSize:12, alignItems:'baseline'}}>
            <span className="dim" style={{flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis'}}>{d.label}</span>
            <span className="mono" style={{fontWeight:600, color:'var(--secondary)', whiteSpace:'nowrap'}}>{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// dashboardStats 4 카드 — hover/focus 로 popover 노출. details 미전달 시 종전 동작 그대로.
const StatTile = ({ stat }) => {
  const [open, setOpen] = React.useState(false);
  const id = React.useId ? React.useId() : `stat-${stat.l}`;
  const hasDetails = Array.isArray(stat.details) && stat.details.length > 0;
  return (
    <div className="card" style={{position:'relative'}}
      onMouseEnter={() => hasDetails && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => hasDetails && setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={hasDetails ? 0 : undefined}
      aria-describedby={open ? id : undefined}>
      <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12}}>{stat.l}</div>
      <div className="ko-serif" style={{fontSize:32, color:'var(--ink)'}}>
        {stat.v}<span style={{fontSize:14, marginLeft:4}} className="dim-2">{stat.unit||''}</span>
      </div>
      <div style={{fontSize:11, color: stat.p ? 'var(--primary)' : 'var(--danger)', marginTop:8}}>{stat.d}</div>
      <HoverDetailsPopover details={stat.details} open={open} id={id}/>
    </div>
  );
};

const MetricCard = ({ label, value, sub, accent, icon, details }) => {
  const [open, setOpen] = React.useState(false);
  const id = React.useId ? React.useId() : `metric-${label}`;
  const hasDetails = Array.isArray(details) && details.length > 0;
  return (
    <article className="metric-card" style={{
      padding:'18px 20px', background:'var(--bg-2)', border:'1px solid var(--line)',
      borderRadius:10, position:'relative', overflow:'visible',
    }}
      onMouseEnter={() => hasDetails && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => hasDetails && setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={hasDetails ? 0 : undefined}
      aria-describedby={open ? id : undefined}>
      <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
        {icon && <span style={{fontSize:18}} aria-hidden="true">{icon}</span>}
        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase'}}>{label}</div>
      </div>
      <div className="ko-serif" style={{fontSize:32, fontWeight:600, color: accent || 'var(--primary-hover)', lineHeight:1.1}}>
        {value}
      </div>
      {sub && <div className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.5}}>{sub}</div>}
      <HoverDetailsPopover details={details} open={open} id={id}/>
    </article>
  );
};

// 간단한 SVG 막대 차트 — series: number[], labels: string[].
// v00.187 — MiniBarChart / RankedBarList / COHORT_OPTIONS / CohortSelector 모두 AdminShared.jsx 로 이동.
// 외부 module-scope 정의를 const alias 로 가져와 closure 내부 사용 패턴 유지.
const MiniBarChart = window.MiniBarChart;
const RankedBarList = window.RankedBarList;
const COHORT_OPTIONS = window.COHORT_OPTIONS;
const CohortSelector = window.CohortSelector;

// 일/주/월 카운트 헬퍼 — items 의 dateField 가 ISO 또는 'YYYY.MM.DD'.
const _toDate = (v) => {
  if (!v) return null;
  const t = Date.parse(v);
  if (!isNaN(t)) return new Date(t);
  // 'YYYY.MM.DD' 형식
  const m = String(v).match(/^(\d{4})[.-](\d{1,2})[.-](\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return null;
};
const _countSince = (items, dateField, days) => {
  const cutoff = Date.now() - days * 86400000;
  return items.filter((it) => {
    const d = _toDate(it[dateField]);
    return d && d.getTime() >= cutoff;
  }).length;
};
// v00.176 — 24시간 시간단위 series (days=1 코호트용). 현재 시각 포함 24시간 (1시간 간격).
// v00.191 — 사용자 보고 '시간 단위로 볼 때 모든 시간에 라벨 달아줘'. 이전 매 3시간만 라벨 → 매 시간 표시.
const _hourlySeries = (items, dateField, hours = 24) => {
  const counts = new Array(hours).fill(0);
  const labels = new Array(hours).fill('');
  const now = new Date(); now.setMinutes(0, 0, 0);
  const baseTs = now.getTime() - (hours - 1) * 3600000;
  items.forEach((it) => {
    const d = _toDate(it[dateField]);
    if (!d) return;
    const idx = Math.floor((d.getTime() - baseTs) / 3600000);
    if (idx >= 0 && idx < hours) counts[idx]++;
  });
  for (let i = 0; i < hours; i++) {
    const dt = new Date(baseTs + i * 3600000);
    labels[i] = (i === hours - 1) ? '지금' : `${dt.getHours()}시`;
  }
  return { counts, labels };
};

// 14일치 일별 카운트 series — 오늘 포함 14개.
const _dailySeries = (items, dateField, days = 14) => {
  const counts = new Array(days).fill(0);
  const labels = new Array(days).fill('');
  const todayMid = (() => { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); })();
  items.forEach((it) => {
    const d = _toDate(it[dateField]);
    if (!d) return;
    d.setHours(0, 0, 0, 0);
    const idx = Math.floor((d.getTime() - todayMid) / 86400000) + (days - 1);
    if (idx >= 0 && idx < days) counts[idx]++;
  });
  // v00.195 — 사용자 보고 '임의로 중간에 값들을 축약하지마'. 모든 일자에 라벨 (이전엔 짝수 인덱스만).
  for (let i = 0; i < days; i++) {
    const dt = new Date(todayMid + (i - (days - 1)) * 86400000);
    labels[i] = (i === days - 1) ? '오늘' : `${dt.getMonth()+1}/${dt.getDate()}`;
  }
  return { counts, labels };
};

// === Dashboard Panel (v00.148) — 실제 page-view analytics summary 사용 ====
const DashboardPanel = ({ dashboardStats, allUsers, allCommunityPosts, latestCommunityPost, latestColumn, setTab, G }) => {
  const [summary, setSummary] = React.useState(null);
  const [loadingSummary, setLoadingSummary] = React.useState(true);
  const [summaryError, setSummaryError] = React.useState('');

  // v00.173 — 차트별 코호트(기간). 페이지뷰 차트 + 가입 차트 각각 독립.
  // v00.179 — 유입 경로 / 인기 페이지 도 자체 cohort. 모두 단일 summary 호출 days 파라미터에 매핑.
  const [pvDays, setPvDays] = React.useState(14);
  const [signupDays, setSignupDays] = React.useState(14);
  const [refDays, setRefDays] = React.useState(30);
  const [routeDays, setRouteDays] = React.useState(7);
  const [heatmapDays, setHeatmapDays] = React.useState(30);

  const loadSummary = React.useCallback(async () => {
    setLoadingSummary(true);
    setSummaryError('');
    try {
      // v00.179 — pvDays + refDays + routeDays 를 함께 전달. 한 번의 fetch 로 모든 차트 갱신.
      // v00.194 — heatmapDays 포함.
      const data = await window.BGNJ_API?.analytics?.summary?.({ days: pvDays, refDays, routeDays, heatmapDays });
      if (data?.error) {
        setSummaryError(data.error);
        setSummary(data);
      } else {
        setSummary(data || null);
      }
    } catch (err) {
      setSummaryError(err?.message || '요청 실패');
      setSummary(null);
    } finally { setLoadingSummary(false); }
  }, [pvDays, refDays, routeDays, heatmapDays]);

  React.useEffect(() => { loadSummary(); }, [loadSummary]);

  // v00.195 — 사용자 보고 '페이지뷰와 가입 추이 모두 다 현행화'.
  // 대시보드 마운트 시 BGNJ_AUTH.refreshUsers 강제 호출 (allUsers 가 stale 상태로 들어오는 경우 대비).
  // 그 후 부모 (AuthAdminPage) 가 'bgnj-users-refresh' 이벤트로 allUsers 재계산 → signup 차트 즉시 갱신.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try { await window.BGNJ_AUTH?.refreshUsers?.(); } catch {}
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, []);

  // 가입 추이 — 클라이언트 derived (정확한 값).
  // v00.194 — 사용자 보고 '회원가입추이도 정상작동 안하는듯'.
  // root cause: BGNJ_AUTH._usersCache 매퍼 (data.js:1248) 가 `joinedAt` 으로 노출하지만
  // 차트 코드는 `createdAt` 으로 읽어 모든 카운트가 0. 타 호출 측은 모두 joinedAt 사용 → 차트 측 정정.
  const dailySignups = _countSince(allUsers, 'joinedAt', 1);
  const weeklySignups = _countSince(allUsers, 'joinedAt', 7);
  const monthlySignups = _countSince(allUsers, 'joinedAt', 30);
  // v00.173 — signupDays 코호트로 series 길이 동적. v00.176 — 1일이면 시간 단위.
  const signupSeries = signupDays === 1
    ? _hourlySeries(allUsers, 'joinedAt', 24)
    : _dailySeries(allUsers, 'joinedAt', signupDays);

  // 페이지뷰 — 서버 값 우선, 없으면 게시글 작성 횟수 폴백.
  const pv = summary || {};
  const dayViews = pv.day ?? null;
  const weekViews = pv.week ?? null;
  const monthViews = pv.month ?? null;
  const dayUnique = pv.dayUnique ?? null;
  const weekUnique = pv.weekUnique ?? null;
  const monthUnique = pv.monthUnique ?? null;

  // v00.173 — pvDays 코호트로 series 길이 동적. v00.176 — 1일이면 24시간 hourly.
  const pvSeries = (() => {
    if (pvDays === 1) {
      // 시간 단위 (워커 hourlySeries 응답).
      const hours = 24;
      const counts = new Array(hours).fill(0);
      const labels = new Array(hours).fill('');
      const now = new Date(); now.setMinutes(0, 0, 0);
      const baseTs = now.getTime() - (hours - 1) * 3600000;
      (pv.hourlySeries || []).forEach(({ hour, views }) => {
        // hour 형식: 'YYYY-MM-DDTHH' (ISO prefix). 직접 파싱.
        const t = Date.parse((hour || '') + ':00:00+09:00');
        if (isNaN(t)) return;
        const idx = Math.floor((t - baseTs) / 3600000);
        if (idx >= 0 && idx < hours) counts[idx] = Number(views) || 0;
      });
      // v00.192 — 사용자 보고 '시간 라벨 중간에 생략하지 말고 매시'. 24시간 모두 라벨.
      for (let i = 0; i < hours; i++) {
        const dt = new Date(baseTs + i * 3600000);
        labels[i] = (i === hours - 1) ? '지금' : `${dt.getHours()}시`;
      }
      return { counts, labels };
    }
    const days = pvDays;
    const counts = new Array(days).fill(0);
    const labels = new Array(days).fill('');
    const todayMid = (() => { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); })();
    (pv.dailySeries || []).forEach(({ day, views }) => {
      const t = Date.parse(day + 'T00:00:00+09:00');
      if (isNaN(t)) return;
      const idx = Math.floor((t - todayMid) / 86400000) + (days - 1);
      if (idx >= 0 && idx < days) counts[idx] = Number(views) || 0;
    });
    // v00.195 — 사용자 보고 '임의로 중간에 값들을 축약하지마'. 모든 일자에 라벨 (이전엔 days 길이별 매 N일마다).
    for (let i = 0; i < days; i++) {
      const dt = new Date(todayMid + (i - (days - 1)) * 86400000);
      labels[i] = (i === days - 1) ? '오늘' : `${dt.getMonth()+1}/${dt.getDate()}`;
    }
    return { counts, labels };
  })();

  // 유입 경로 — 서버 referrers 가 있으면 사용, 없으면 추정 폴백.
  const refs = pv.referrers || [];
  const refTotal = refs.reduce((s, r) => s + r.count, 0) || 1;

  return (
    <>
      {/* 1줄: 기존 4종 (전체 회원 / 게시글 / 칼럼 / 책 주문) — v00.157 hover popover 활성. */}
      <div className="grid grid-4" style={{marginBottom:18}}>
        {dashboardStats.map((s, i) => (
          <StatTile key={i} stat={s}/>
        ))}
      </div>

      {/* 2줄: 일/주/월 페이지뷰 + 가입자 */}
      <div className="admin-section__title">
        방문자 · 가입 {summaryError ? '⚠ 분석 데이터 미수신 (schema-v9 미적용 또는 워커 미배포)' : (loadingSummary ? '· ⏳ 불러오는 중…' : '')}
      </div>
      <div className="grid grid-4" style={{marginBottom:18}}>
        <MetricCard icon="📅" label="일일 방문" value={dayViews ?? '—'}
          accent="var(--primary)" sub={dayUnique != null ? `세션 ${dayUnique}건 · 페이지뷰 ${dayViews}` : '서버 데이터 미수신'}
          details={dayUnique != null ? [
            { label: '페이지뷰', value: dayViews },
            { label: '세션 (unique)', value: dayUnique },
            { label: '페이지/세션', value: dayUnique > 0 ? (dayViews / dayUnique).toFixed(2) : '—' },
          ] : null}/>
        <MetricCard icon="📊" label="주간 방문" value={weekViews ?? '—'}
          accent="var(--primary-hover)" sub={weekUnique != null ? `세션 ${weekUnique}건 · 페이지뷰 ${weekViews}` : '서버 데이터 미수신'}
          details={weekUnique != null ? [
            { label: '페이지뷰', value: weekViews },
            { label: '세션 (unique)', value: weekUnique },
            { label: '일평균 페이지뷰', value: (weekViews / 7).toFixed(1) },
            { label: '일평균 세션', value: (weekUnique / 7).toFixed(1) },
          ] : null}/>
        <MetricCard icon="📈" label="월간 방문" value={monthViews ?? '—'}
          accent="var(--primary)" sub={monthUnique != null ? `세션 ${monthUnique}건 · 페이지뷰 ${monthViews}` : '서버 데이터 미수신'}
          details={monthUnique != null ? [
            { label: '페이지뷰', value: monthViews },
            { label: '세션 (unique)', value: monthUnique },
            { label: '일평균 페이지뷰', value: (monthViews / 30).toFixed(1) },
            { label: '일평균 세션', value: (monthUnique / 30).toFixed(1) },
          ] : null}/>
        <MetricCard icon="✨" label="오늘 신규 가입" value={dailySignups}
          accent="var(--secondary, #1F7A8C)"
          sub={`주간 ${weeklySignups}명 · 월간 ${monthlySignups}명`}
          details={[
            { label: '오늘 신규',   value: dailySignups },
            { label: '최근 7일',    value: weeklySignups },
            { label: '최근 30일',   value: monthlySignups },
            { label: '누적 회원',   value: allUsers.length },
            { label: '7일 일평균',  value: (weeklySignups / 7).toFixed(1) },
            { label: '30일 일평균', value: (monthlySignups / 30).toFixed(2) },
          ]}/>
      </div>

      {/* 3줄: 추이 차트 — v00.173 코호트 selector + 호버 툴팁. */}
      <div className="grid grid-2" style={{marginBottom:18}}>
        <article className="card">
          <MiniBarChart
            label={`📊 ${pvDays === 1 ? '24시간 (1시간 단위)' : pvDays + '일'} 페이지뷰 추이`}
            series={pvSeries.counts}
            labels={pvSeries.labels}
            color="var(--primary)"
            height={140}
            unit="회"
            formatTooltip={(v, l) => `${l || ''} · 페이지뷰 ${v}회`}
            headerRight={<CohortSelector value={pvDays} onChange={setPvDays}/>}/>
          <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
            {summaryError ? '서버 분석 데이터 없음 — schema-v9 + 워커 deploy 필요.' : (pvDays === 1 ? '최근 24시간 시간별 페이지뷰. 막대 호버 시 정확한 값.' : '실제 측정된 일별 페이지뷰 (page_views D1). 막대에 호버하면 정확한 값.')}
          </p>
        </article>
        <article className="card">
          <MiniBarChart
            label={`📊 ${signupDays === 1 ? '24시간 (1시간 단위)' : signupDays + '일'} 가입 추이`}
            series={signupSeries.counts}
            labels={signupSeries.labels}
            color="var(--secondary, #1F7A8C)"
            height={140}
            unit="명"
            formatTooltip={(v, l) => `${l || ''} · 신규 가입 ${v}명`}
            headerRight={<CohortSelector value={signupDays} onChange={setSignupDays}/>}/>
          <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
            {signupDays === 1 ? '최근 24시간 시간별 신규 가입자.' : `최근 ${signupDays}일간 일별 신규 가입자 수.`} 막대에 호버하면 정확한 값.
          </p>
        </article>
      </div>

      {/* v00.196 — 사용자 요청 '회원 등급별 분포 현황'. allUsers × BGNJ_STORES.grades 매핑 → RankedBarList. */}
      <div className="admin-section__title">회원 등급별 분포</div>
      {(() => {
        const grades = window.BGNJ_STORES?.grades || [];
        const counts = {};
        const adminCount = allUsers.filter((u) => u.isAdmin || u.isSuperAdmin).length;
        const totalNonAdmin = allUsers.length - adminCount;
        allUsers.forEach((u) => {
          if (u.isAdmin || u.isSuperAdmin) return;
          const gid = u.gradeId || 'unranked';
          counts[gid] = (counts[gid] || 0) + 1;
        });
        // 등급 정의 순서 유지 + unranked 마지막. admin 별도 처리.
        const items = grades
          .map((g) => ({ id: g.id, label: g.name || g.id, count: counts[g.id] || 0, sub: g.tag || '' }))
          .filter((it) => it.count > 0 || (grades.find((g) => g.id === it.id)?.id));
        // 미분류 (gradeId 없는 회원).
        if (counts.unranked) items.push({ id: 'unranked', label: '미분류', count: counts.unranked, color: 'var(--ink-3)' });
        if (adminCount > 0) items.push({ id: '__admin', label: '관리자', count: adminCount, color: 'var(--secondary)' });
        items.sort((a, b) => b.count - a.count);
        return (
          <RankedBarList
            items={items}
            unit="명"
            emptyText={allUsers.length === 0 ? '회원 데이터 미수신 — refreshUsers 호출 직후 자동 갱신.' : '등급이 부여된 회원이 아직 없습니다.'}
            headerLeft="GRADE DISTRIBUTION"
            headerRight={
              <span className="dim-2 mono" style={{fontSize:11}}>
                전체 {allUsers.length}명 · 관리자 {adminCount} · 일반 {totalNonAdmin}
              </span>
            }/>
        );
      })()}

      {/* v00.194 — 사용자 요청 '대시보드에 접속 시간에 따른 히트맵'. KST 기준 24h × 7요일. */}
      <div style={{marginBottom:18}}>
        <window.HeatmapGrid
          data={pv.heatmap || []}
          days={pv.heatmapDays || heatmapDays}
          label={`🗓 접속 시간 히트맵 (최근 ${heatmapDays}일 · KST · 요일×시간)`}
          headerRight={<CohortSelector value={heatmapDays} onChange={setHeatmapDays}/>}/>
        <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
          {summaryError ? '서버 분석 데이터 없음 — schema-v9 + 워커 deploy 필요.' : '셀에 호버하면 정확한 페이지뷰 / 세션 수 확인. 색이 진할수록 트래픽이 몰린 시간대.'}
        </p>
      </div>

      {/* 4줄: 유입 경로 — v00.179 RankedBarList 공통 컴포넌트 + cohort + 호버. */}
      <div className="admin-section__title">유입 경로 (최근 {refDays}일)</div>
      <RankedBarList
        items={refs.map((r) => ({
          label: r.host === 'self' ? '직접 방문 (사이트 내)' : r.host,
          count: r.count,
        }))}
        unit="회"
        emptyText={summaryError ? '서버 분석 데이터 미수신.' : '아직 referrer 데이터가 충분하지 않습니다. 사용자 방문이 누적되면 자동 표시.'}
        headerLeft="TRAFFIC SOURCES"
        headerRight={
          <div style={{display:'flex', gap:6, alignItems:'center'}}>
            <CohortSelector value={refDays} onChange={setRefDays}/>
            <button type="button" className="btn btn-small" onClick={loadSummary} disabled={loadingSummary} style={{padding:'4px 10px', fontSize:11}}>
              {loadingSummary ? '⏳' : '🔄'}
            </button>
          </div>
        }/>

      {/* 인기 라우트 — v00.179 RankedBarList. */}
      <div className="admin-section__title">인기 페이지 (최근 {routeDays}일)</div>
      <RankedBarList
        items={(pv.topRoutes || []).map((r) => ({
          label: r.route,
          count: r.count,
          color: 'var(--secondary, #1F7A8C)',
        }))}
        valueFormat={(c) => `${c} views`}
        emptyText={summaryError ? '서버 분석 데이터 미수신.' : '데이터가 누적되면 자동 표시.'}
        headerLeft="POPULAR PAGES"
        headerRight={<CohortSelector value={routeDays} onChange={setRouteDays}/>}/>

      {/* 5줄: 기존 latest community + ops snapshot */}
      <div className="grid grid-2">
        <article className="card card-gold">
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>LATEST COMMUNITY</div>
          <h2 className="ko-serif" style={{fontSize:20, marginBottom:12}}>가장 최근 커뮤니티 글</h2>
          {latestCommunityPost ? (
            <>
              <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:10}}>
                <span className="badge badge-gold">{latestCommunityPost.category}</span>
                <span className="mono dim-2" style={{fontSize:11}}>{latestCommunityPost.date}</span>
              </div>
              <p style={{fontSize:16, marginBottom:10}}>{latestCommunityPost.title}</p>
              <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
                작성자 {latestCommunityPost.author} · 조회 {latestCommunityPost.views} · 댓글 {latestCommunityPost.replies}
              </p>
            </>
          ) : (<p className="dim">등록된 게시글이 없습니다.</p>)}
          <button type="button" className="btn btn-small" onClick={() => setTab("커뮤니티")}>커뮤니티 관리로 이동</button>
        </article>

        <article className="card">
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>OPERATIONS SNAPSHOT</div>
          <h2 className="ko-serif" style={{fontSize:20, marginBottom:12}}>운영 요약</h2>
          <div style={{display:'grid', gap:12, marginBottom:18}}>
            <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">최근 칼럼</span><span>{latestColumn?.title || "없음"}</span></div>
            <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">다음 강연</span><span>{G.arr(() => window.BGNJ_LECTURES?.listAll?.()).filter((l) => l && !l.hidden)[0]?.next || "없음"}</span></div>
            <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">다음 투어</span><span>{G.arr(() => window.BGNJ_TOURS?.listAll?.()).filter((t) => t && !t.hidden)[0]?.next || "없음"}</span></div>
          </div>
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small" onClick={() => setTab("뱅기노자 칼럼")}>칼럼 관리</button>
            <button type="button" className="btn btn-small" onClick={() => setTab("투어 프로그램")}>투어 관리</button>
          </div>
        </article>
      </div>
    </>
  );
};

// v00.187 — Sankey 흐름도 + 헬퍼 모두 AdminShared.jsx 로 이동. SankeyFlow 만 외부 사용.
const SankeyFlow = window.SankeyFlow;

// === User Journey Panel (v00.178 단순화) ===========================
// v00.146 시작 (회원별 타임라인) → v00.174 Sankey 추가 → v00.176 사용자 보고 '회원 단위 X, 전체적으로만'
// → v00.178 회원 목록/타임라인 + 관련 state/effect/memo 모두 삭제. SankeyFlow 만 노출.
// 데이터: analytics summary 의 flowPairs (referrer × route 집계).
const UserJourneyPanel = () => {
  const [flowPairs, setFlowPairs] = React.useState([]);
  const [flowDays, setFlowDays] = React.useState(30);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await window.BGNJ_API?.analytics?.summary?.({ days: flowDays });
        if (cancelled) return;
        setFlowPairs(Array.isArray(data?.flowPairs) ? data.flowPairs : []);
      } catch {
        if (cancelled) return;
        setFlowPairs([]);
      }
    })();
    return () => { cancelled = true; };
  }, [flowDays]);

  return (
    <>
      <AdminPanelHeader
        eyebrow="JOURNEY · 사용자 여정"
        title="고객 여정 흐름"
        description="유입 채널 → 단계 → 도착 페이지의 집계 Sankey 흐름. 노드/곡선 호버 시 연결 흐름 강조. 우상단 [기간] 으로 코호트 변경."/>
      <SankeyFlow pairs={flowPairs} days={flowDays} onDaysChange={setFlowDays}/>
    </>
  );
};

// === Lecture Admin Panel ==========================================
// v00.131 — 강연 일괄 등록 컴포넌트. CSV / pipe-separated 파싱.
// 사용자 요청 '관리자페이지 강연 탭에서 일괄 등록'.
// 형식 (한 줄 = 한 강연, 헤더 첫 줄):
//   title,topic,venue,host,startsAt,durationMinutes,capacity,price,note
//   "공개 강연","경복궁의 사계","경복궁","뱅기노자","2026-06-01T19:00:00+09:00",90,30,15000,"무료 입장"
const BulkLectureImport = ({ onClose, onDone }) => {
  const [text, setText] = React.useState('title,topic,venue,host,startsAt,durationMinutes,capacity,price,note\n');
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState(null); // { ok: N, fail: [{line, err}] }

  const _parseCsvLine = (line) => {
    // 단순 CSV 파서 — quoted fields 지원.
    const out = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === ',') { out.push(cur); cur = ''; }
        else if (c === '"' && cur === '') inQ = true;
        else cur += c;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };

  const submit = async () => {
    setBusy(true); setResult(null);
    const lines = String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) { setResult({ ok: 0, fail: [{ line: 0, err: '헤더 + 최소 1행 필요' }] }); setBusy(false); return; }
    const header = _parseCsvLine(lines[0]);
    const expected = ['title','topic','venue','host','startsAt','durationMinutes','capacity','price','note'];
    if (expected.some((k, i) => header[i] !== k)) {
      setResult({ ok: 0, fail: [{ line: 1, err: `헤더 형식 불일치. 예상: ${expected.join(',')}` }] });
      setBusy(false); return;
    }
    const fails = []; let ok = 0;
    for (let i = 1; i < lines.length; i++) {
      const cols = _parseCsvLine(lines[i]);
      const row = Object.fromEntries(expected.map((k, j) => [k, cols[j] || '']));
      try {
        const id = `bulk-lec-${Date.now()}-${i}`;
        if (!row.title || !row.startsAt) throw new Error('title 과 startsAt 필수');
        await window.BGNJ_LECTURES.saveLecture({
          id,
          title: row.title,
          topic: row.topic || '',
          venue: row.venue || '',
          host: row.host || '뱅기노자',
          next: row.startsAt.slice(0, 16).replace('T', ' ').replace(/-/g, '.'),
          startsAt: row.startsAt,
          durationMinutes: Number(row.durationMinutes || 90),
          capacity: Number(row.capacity || 30),
          price: Number(row.price || 0),
          note: row.note || '',
        });
        ok++;
      } catch (err) {
        fails.push({ line: i + 1, err: err?.message || String(err) });
      }
    }
    setBusy(false);
    setResult({ ok, fail: fails });
    if (ok > 0) onDone?.();
  };

  return (
    <div className="card" style={{padding:18, marginBottom:18, border:'1px dashed var(--primary-dim)'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
        <h4 className="ko-serif" style={{fontSize:15, margin:0}}>📑 강연 일괄 등록 (CSV)</h4>
        <button type="button" className="btn btn-small" onClick={onClose}>닫기</button>
      </div>
      <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:10}}>
        형식: <code>title,topic,venue,host,startsAt,durationMinutes,capacity,price,note</code> (헤더 1행 + 데이터 N행).
        startsAt 은 ISO 8601 (예: <code>2026-06-01T19:00:00+09:00</code>). 쉼표/큰따옴표 포함 시 <code>"..."</code> 로 감싸세요.
      </p>
      <textarea className="field-input" rows={10} value={text}
        onChange={(e) => setText(e.target.value)}
        style={{fontFamily:'var(--font-mono)', fontSize:12, lineHeight:1.5}}/>
      <div style={{display:'flex', gap:8, marginTop:10, justifyContent:'flex-end'}}>
        <button type="button" className="btn btn-gold btn-small" onClick={submit} disabled={busy}>
          {busy ? '등록 중…' : '일괄 등록 실행'}
        </button>
      </div>
      {result && (
        <div style={{marginTop:12, padding:12, border:'1px solid var(--line)', fontSize:12, lineHeight:1.7}}>
          <div className="gold mono" style={{marginBottom:6}}>결과</div>
          <div>✅ 성공: <strong>{result.ok}</strong>건</div>
          {result.fail.length > 0 && (
            <>
              <div style={{marginTop:6}}>❌ 실패: <strong style={{color:'var(--danger)'}}>{result.fail.length}</strong>건</div>
              <ul style={{margin:'6px 0 0', paddingLeft:18}}>
                {result.fail.map((f, i) => (
                  <li key={i} style={{color:'var(--danger)'}}>{f.line}행 — {f.err}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const LectureAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [editingId, setEditingId] = React.useState(null);
  // v00.237 — admin 패널에서도 사진 갤러리 (포스터 + 현장 사진) 한 번에 관리.
  // window.LectureQuickAddModal 재사용 — 같은 모달이 정보/갤러리/현장사진 통합 편집.
  const [galleryEditTarget, setGalleryEditTarget] = React.useState(null);
  const [draft, setDraft] = React.useState({ title: '', topic: '', venue: '', host: '', startsAt: '', durationMinutes: 90, capacity: 30, price: 0, note: '' });
  const [refundRejectNotes, setRefundRejectNotes] = React.useState({});
  // v00.131 — 일괄 등록 토글.
  const [showBulk, setShowBulk] = React.useState(false);
  // v00.075 — 강연별 진행/참고/커버 inline 편집용 별도 state (TourAdminPanel v00.072 패턴 동일).
  const [contentEditingId, setContentEditingId] = React.useState(null);
  const [contentSchedule, setContentSchedule] = React.useState([]);
  const [contentNotes, setContentNotes] = React.useState([]);
  const [contentCover, setContentCover] = React.useState('');
  const [contentMsg, setContentMsg] = React.useState('');

  const lectures = React.useMemo(() => window.BGNJ_LECTURES.listAll({ includeHidden: true }), [tick]);

  const refresh = () => setTick((v) => v + 1);

  // v00.075 — 강연별 콘텐츠 (진행/참고/커버) override 편집기.
  const startContentEdit = (l) => {
    if (!l) return;
    const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
    const ovr = (sc.lecturePages || {})[l.id] || {};
    setContentEditingId(l.id);
    setContentSchedule(Array.isArray(ovr.schedule) ? ovr.schedule.slice() : []);
    setContentNotes(Array.isArray(ovr.notes) ? ovr.notes.slice() : []);
    setContentCover(ovr.coverDataUri || '');
    setContentMsg('');
  };
  const cancelContentEdit = () => {
    setContentEditingId(null); setContentSchedule([]); setContentNotes([]); setContentCover(''); setContentMsg('');
  };
  const saveContentEdit = async () => {
    if (!contentEditingId) return;
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const lecturePages = sc.lecturePages || {};
      const cleanS = contentSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ''), l: String(s.l || '') }));
      const cleanN = contentNotes.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      const next = { ...lecturePages, [contentEditingId]: {
        schedule: cleanS, notes: cleanN,
        coverDataUri: contentCover || undefined,
      } };
      await window.BGNJ_SITE_CONTENT.saveSection('lecturePages', next);
      setContentMsg('저장됨 — 강연 페이지에 즉시 반영.');
      setTimeout(() => setContentMsg(''), 2500);
      refresh();
    } catch (err) { window.BGNJ_TOAST.error('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };
  // v00.184 — DRY: pickImageWithR2Fallback 헬퍼 사용 (이전엔 25-line 인라인 동일 패턴).
  const onPickContentCover = async (e) => {
    const result = await pickImageWithR2Fallback(e, { folder: 'lecture-covers' });
    if (result) setContentCover(result);
  };

  // 강연별 신청 목록을 mount 시 일괄 fetch.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = window.BGNJ_LECTURES.listAll({ includeHidden: true });
      await Promise.allSettled(list.map((l) => window.BGNJ_LECTURES.refreshRegistrations(l.id)));
      if (!cancelled) refresh();
    })();
    return () => { cancelled = true; };
  }, [lectures.length]);

  const startEdit = (l) => {
    const startsAtLocal = (() => {
      if (!l.startsAt) return '';
      const d = new Date(l.startsAt);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })();
    setEditingId(l.id);
    setDraft({
      title: l.title || '',
      topic: l.topic || '',
      venue: l.venue || '',
      host: l.host || '',
      next: l.next || '',
      startsAt: startsAtLocal,
      durationMinutes: l.durationMinutes || 90,
      capacity: l.capacity || 30,
      price: l.price || 0,
      note: l.note || '',
    });
  };

  // v00.131 — async + await + try/catch + broadcast. 같은 fire-and-forget 패턴 fix.
  const saveEdit = async () => {
    if (editingId == null) return;
    const lecture = window.BGNJ_LECTURES.getLecture(editingId);
    if (!lecture) return;
    const startsAtIso = draft.startsAt ? new Date(draft.startsAt).toISOString() : lecture.startsAt;
    const next = draft.next || lecture.next;
    try {
      await window.BGNJ_LECTURES.saveLecture({
        id: lecture.id,
        title: draft.title,
        topic: draft.topic,
        venue: draft.venue,
        host: draft.host,
        next,
        startsAt: startsAtIso,
        durationMinutes: Number(draft.durationMinutes) || 90,
        capacity: Number(draft.capacity) || lecture.capacity,
        price: Number(draft.price) || 0,
        note: draft.note,
      });
      try { window.BGNJ_BROADCAST?.publish?.('lectures'); } catch {}
      setEditingId(null);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error('강연 저장 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  const addNewLecture = async () => {
    const id = `lecture-${Date.now()}`;
    const now = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +1주
    const pad = (n) => String(n).padStart(2, '0');
    const startsAt = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T19:00:00+09:00`;
    const next = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} 19:00`;
    try {
      // saveLecture 는 async — await 으로 서버 저장 + 캐시 refresh 완료 후 lecture 객체 반환.
      // 이전엔 await 없이 호출 후 동기 getLecture(id) 가 null 을 반환 → startEdit(null) → 'startsAt' 읽기 오류.
      const created = await window.BGNJ_LECTURES.saveLecture({
        id,
        title: '새 강연',
        topic: '강연 주제를 입력하세요',
        venue: '장소',
        host: '뱅기노자',
        next,
        startsAt,
        durationMinutes: 90,
        capacity: 30,
        price: 0,
        note: '강연 안내를 입력하세요.',
      });
      try { await window.BGNJ_AUDIT?.log?.({ action: 'lecture.create', target: `lecture:${id}` }); } catch {}
      try { window.BGNJ_BROADCAST?.publish?.('lectures'); } catch {}
      refresh();
      if (created) startEdit(created);
      else window.BGNJ_TOAST.error('강연 생성 후 객체를 가져오지 못했습니다. 페이지를 새로고침해 주세요.');
    } catch (err) {
      window.BGNJ_TOAST.error('강연 생성 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  // v00.105 — 통합: 강연 페이지 콘텐츠 편집기 collapsible 내장.
  const [showPageEditor, setShowPageEditor] = React.useState(false);

  return (
    <div>
      {/* 통합 페이지 콘텐츠 편집기 */}
      <div style={{marginBottom:18, border:'1px solid var(--line)', background:'var(--bg-2)'}}>
        <button type="button"
          onClick={() => setShowPageEditor((v) => !v)}
          style={{
            width:'100%', padding:'12px 16px', textAlign:'left',
            background:'transparent', border:'none', cursor:'pointer',
            fontSize:13, fontWeight:600, color:'var(--ink)',
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
          <span>📋 강연 페이지 콘텐츠 — 글로벌 진행·참고 / 템플릿 / 강연별 override</span>
          <span className="mono dim-2" style={{fontSize:11}}>{showPageEditor ? '▲ 닫기' : '▼ 펼치기'}</span>
        </button>
        {showPageEditor && (
          <div style={{padding:'14px 18px', borderTop:'1px solid var(--line)', background:'var(--bg)'}}>
            {window.LecturePageEditorPanel ? <window.LecturePageEditorPanel/> : <p className="dim">패널 로딩 중...</p>}
          </div>
        )}
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap', marginBottom:18}}>
        <p className="dim" style={{fontSize:13, lineHeight:1.8, margin:0, flex:1, minWidth:280}}>
          강연 정원 / 일정 / 가격을 수정하고, 신청자 입금을 확인해 참가를 확정합니다.
          결제는 현재 <strong className="gold">무통장 입금</strong>만 지원합니다.
          계좌번호는 <strong className="gold">시스템 → 설정</strong> 탭에서 등록합니다.
        </p>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {lectures.length === 0 && (
            <button type="button" className="btn btn-small" onClick={async () => {
              if (!(await window.BGNJ_CONFIRM('샘플 강연 3개를 추가합니다. 진행할까요?', { danger: true }))) return;
              const samples = [
                { title: '왕의 길', topic: '조선 왕실의 일상과 의례', venue: '경복궁 수정전', host: '뱅기노자', durationMinutes: 90, capacity: 30, price: 0, note: '경복궁 답사와 함께하는 인문학 강연.' },
                { title: '문(門)을 읽다', topic: '궁궐 문(門)에 새겨진 인문학', venue: '창덕궁 인정전', host: '뱅기노자', durationMinutes: 90, capacity: 30, price: 30000, note: '궁궐 곳곳의 문에 담긴 의미를 해독합니다.' },
                { title: '차(茶) 한 잔의 인문학', topic: '동아시아 차 문화와 사유', venue: '뱅기노자 사랑방', host: '뱅기노자', durationMinutes: 75, capacity: 20, price: 50000, note: '차 한 잔에 담긴 천 년의 사유를 함께 따라갑니다.' },
              ];
              const pad = (n) => String(n).padStart(2, '0');
              for (let i = 0; i < samples.length; i++) {
                const d = new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000);
                const startsAt = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T19:00:00+09:00`;
                const next = `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} 19:00`;
                await window.BGNJ_LECTURES.saveLecture({ id: `sample-lecture-${Date.now()}-${i}`, ...samples[i], startsAt, next });
              }
              refresh();
            }}>샘플 데이터 추가</button>
          )}
          <button type="button" className="btn btn-small" onClick={() => setShowBulk((v) => !v)}>📑 일괄 등록</button>
          <button type="button" className="btn btn-gold btn-small" onClick={addNewLecture}>＋ 새 강연 추가</button>
        </div>
      </div>

      {/* v00.131 — 일괄 등록 (CSV / pipe-separated). 사용자 요청 '관리자페이지 강연 탭에서 일괄 등록은 할 수 있게'. */}
      {showBulk && (
        <BulkLectureImport onClose={() => setShowBulk(false)} onDone={() => { setShowBulk(false); refresh(); try { window.BGNJ_BROADCAST?.publish?.('lectures'); } catch {} }}/>
      )}

      {lectures.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>관리할 강연이 없습니다.</div>
      ) : (
        <div style={{display:'grid', gap:14}}>
          {lectures.map((l) => {
            const seats = window.BGNJ_LECTURES.getSeats(l.id);
            const regs = window.BGNJ_LECTURES.listRegistrations(l.id);
            const active = regs.filter((r) => r.status !== 'cancelled');
            const isEditing = editingId === l.id;
            return (
              <article key={l.id} className="card" style={{padding:20, opacity: l.hidden ? 0.55 : 1}}>
                <header style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                  <div>
                    <h3 className="ko-serif" style={{fontSize:18}}>
                      <span className="dim-2 mono" style={{fontSize:11, marginRight:8}}>#{String(l.id).padStart(2,'0')}</span>
                      {l.title} — {l.topic}
                      {l.hidden && <span className="mono" style={{marginLeft:10, fontSize:10, letterSpacing:'0.18em', color:'var(--danger)', border:'1px solid var(--danger)', padding:'1px 6px', borderRadius:2}}>숨김</span>}
                    </h3>
                    <div className="mono dim-2" style={{fontSize:11, marginTop:4, letterSpacing:'0.12em'}}>
                      {l.next} · {l.venue} · 진행 {l.host}
                    </div>
                  </div>
                  <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: seats.remaining <= 0 ? 'var(--danger)' : 'var(--primary)'}}>
                      잔여 {seats.remaining} / {seats.capacity}
                    </span>
                    {seats.waitlist > 0 && <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)'}}>대기 {seats.waitlist}</span>}
                    {l.price > 0
                      ? <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)', border:'1px solid var(--line-2)', padding:'1px 6px'}}>유료 {window.BGNJ_FMT.won(l.price)}</span>
                      : <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--secondary)', border:'1px solid var(--primary-dim)', padding:'1px 6px'}}>FREE</span>}
                  </div>
                </header>

                {isEditing ? (
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10, padding:'14px 0', borderTop:'1px solid var(--line)'}}>
                    {[
                      { k: 'title',     l: '제목',           type: 'text' },
                      { k: 'topic',     l: '주제',           type: 'text' },
                      { k: 'venue',     l: '장소',           type: 'text' },
                      { k: 'host',      l: '진행',           type: 'text' },
                      { k: 'next',      l: '표시용 일정 문구', type: 'text', placeholder: '2026.05.02 · 토 19:00' },
                      { k: 'startsAt',  l: '실제 시작(로컬)', type: 'datetime-local' },
                      { k: 'durationMinutes', l: '소요(분)', type: 'number' },
                      { k: 'capacity',  l: '정원',           type: 'number' },
                      { k: 'price',     l: '참가비(원)',     type: 'number' },
                    ].map((f) => (
                      <div key={f.k} className="field" style={{margin:0}}>
                        <label className="field-label">{f.l}</label>
                        <input className="field-input" type={f.type} placeholder={f.placeholder || ''}
                          value={draft[f.k] ?? ''}
                          onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })}/>
                      </div>
                    ))}
                    <div className="field" style={{margin:0, gridColumn:'1 / -1'}}>
                      <label className="field-label">메모</label>
                      <textarea className="field-input" rows={2} value={draft.note}
                        onChange={(e) => setDraft({ ...draft, note: e.target.value })}/>
                    </div>
                    <div style={{gridColumn:'1 / -1', display:'flex', justifyContent:'flex-end', gap:8}}>
                      <button type="button" className="btn btn-small" onClick={() => setEditingId(null)}>취소</button>
                      <button type="button" className="btn btn-gold btn-small" onClick={saveEdit}>저장</button>
                    </div>
                  </div>
                ) : (
                  <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:10, flexWrap:'wrap'}}>
                    <button type="button" className="btn btn-small btn-gold" onClick={() => startEdit(l)}>✎ 강연 정보 (제목·정원·시간·가격)</button>
                    <button type="button" className="btn btn-small" onClick={() => startContentEdit(l)}>📋 강연 진행·참고·커버</button>
                    {/* v00.237 — 사진 갤러리 (포스터 + 현장 사진) 통합 편집 진입로. 사용자 요청: 'admin 에서도 손쉽게'. */}
                    <button type="button" className="btn btn-small" onClick={() => setGalleryEditTarget(l)}>🖼 포스터·현장사진</button>
                    <button type="button" className="btn btn-small"
                      onClick={() => {
                        window.BGNJ_LECTURES.setHidden(l.id, !l.hidden);
                        window.BGNJ_AUDIT?.log({ action: l.hidden ? 'lecture.unhide' : 'lecture.hide', target: `lecture:${l.id}` });
                        refresh();
                      }}
                      style={{marginLeft:'auto'}}>
                      {l.hidden ? '👁 표시 복원' : '🙈 숨김 처리'}
                    </button>
                    <button type="button" className="btn btn-small"
                      onClick={async () => {
                        if (!(await window.BGNJ_CONFIRM('이 강연을 삭제하시겠어요? 시드 강연은 자동 숨김 처리됩니다 (데이터 보존). 관리자가 추가한 강연은 완전 삭제됩니다.', { danger: true }))) return;
                        // v00.129 — async + await + try/catch + 다른 탭 broadcast (cache purge).
                        try {
                          await window.BGNJ_LECTURES.deleteLecture(l.id);
                          window.BGNJ_AUDIT?.log({ action: 'lecture.remove', target: `lecture:${l.id}` });
                          try { window.BGNJ_BROADCAST?.publish?.('lectures'); } catch {}
                          refresh();
                        } catch (err) {
                          window.BGNJ_TOAST.error('강연 삭제 실패: ' + (err?.message || '알 수 없는 오류'));
                        }
                      }}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                  </div>
                )}

                {/* v00.075 — 강연별 진행/참고/커버 inline 편집 (per-lecture override) */}
                {contentEditingId === l.id && (
                  <section style={{marginTop:14, paddingTop:14, borderTop:'1px solid var(--line)'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10, flexWrap:'wrap', gap:8}}>
                      <div className="mono gold" style={{fontSize:11, letterSpacing:'0.22em'}}>이 강연의 진행/참고 콘텐츠</div>
                      <div className="dim-2" style={{fontSize:10, fontStyle:'italic'}}>
                        비워두면 글로벌 (운영설정 → 사이트 콘텐츠 → 강연 페이지) 사용. 커버 비면 placeholder.
                      </div>
                    </div>
                    {/* 커버 이미지 */}
                    <div className="card" style={{padding:12, marginBottom:12, display:'flex', gap:14, alignItems:'center'}}>
                      <div style={{width:96, height:60, flexShrink:0, border:'1px solid var(--line)', background:'var(--bg-2)', display:'grid', placeItems:'center', overflow:'hidden'}}>
                        {contentCover
                          ? <img src={contentCover} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                          : <span className="dim-2 mono" style={{fontSize:9, letterSpacing:'0.18em'}}>NONE</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:3}}>커버 이미지</div>
                        <div className="dim-2" style={{fontSize:11, lineHeight:1.5}}>1600×1000 권장 · 1.5MB 이하 · 비우면 placeholder.</div>
                      </div>
                      <div style={{display:'flex', gap:6}}>
                        <label className="btn btn-small" style={{cursor:'pointer'}}>
                          업로드
                          <input type="file" accept="image/*" onChange={onPickContentCover} style={{display:'none'}}/>
                        </label>
                        {contentCover && (
                          <button type="button" className="btn btn-small" onClick={() => setContentCover('')}
                            style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                        )}
                      </div>
                    </div>
                    {/* 진행 일정 — TPE_ScheduleEditor 재사용 (모듈 최상위) */}
                    <TPE_ScheduleEditor rows={contentSchedule}
                      onAdd={() => setContentSchedule((a) => _arrAdd(a, { t: '', l: '' }))}
                      onRemove={(i) => setContentSchedule((a) => _arrRemove(a, i))}
                      onUpdate={(i, k, v) => setContentSchedule((a) => { const n = a.slice(); n[i] = { ...n[i], [k]: v }; return n; })}
                      onMove={(i, d) => setContentSchedule((a) => _arrMove(a, i, d))}/>
                    {/* 참고 리스트 — TPE_PrepEditor 재사용 (구조 동일: 문자열 배열) */}
                    <TPE_PrepEditor rows={contentNotes}
                      onAdd={() => setContentNotes((a) => _arrAdd(a, ''))}
                      onRemove={(i) => setContentNotes((a) => _arrRemove(a, i))}
                      onUpdate={(i, v) => setContentNotes((a) => _arrUpdate(a, i, v))}
                      onMove={(i, d) => setContentNotes((a) => _arrMove(a, i, d))}/>
                    <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:8}}>
                      {contentMsg && <span role="status" className="mono" style={{fontSize:11, color:'var(--secondary)', fontWeight:600, marginRight:'auto'}}>{contentMsg}</span>}
                      <button type="button" className="btn btn-small" onClick={cancelContentEdit}>닫기</button>
                      <button type="button" className="btn btn-gold btn-small" onClick={saveContentEdit}>저장</button>
                    </div>
                  </section>
                )}

                {/* Roster */}
                <section style={{marginTop:14, paddingTop:14, borderTop:'1px solid var(--line)'}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>참가자 명단 · {active.length}명</div>
                  {active.length === 0 ? (
                    <p className="dim" style={{fontSize:13}}>아직 신청자가 없습니다.</p>
                  ) : (
                    <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
                      <thead>
                        <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>이름</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>이메일</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>연락처</th>
                          <th scope="col" style={{padding:10, textAlign:'right'}}>인원</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>상태</th>
                          <th scope="col" style={{padding:10, textAlign:'right'}}>액션</th>
                        </tr>
                      </thead>
                      <tbody>
                        {active.map((r) => (
                          <tr key={r.id} style={{borderBottom:'1px solid var(--line)'}}>
                            <td style={{padding:10}}>{r.name}</td>
                            <td className="mono dim-2" style={{padding:10, fontSize:11}}>{r.email}</td>
                            <td className="mono dim-2" style={{padding:10, fontSize:11}}>{r.phone || '-'}</td>
                            <td className="mono" style={{padding:10, textAlign:'right'}}>{r.count}</td>
                            <td className="mono" style={{padding:10, fontSize:10, letterSpacing:'0.18em', color:
                              r.status === 'confirmed' ? 'var(--primary)' :
                              r.status === 'waitlist' ? 'var(--ink-2)' :
                              r.status === 'pending_payment' ? 'var(--ink-2)' : 'var(--danger)'}}>
                              {r.status === 'pending_payment' ? '입금 대기' :
                                r.status === 'confirmed' ? '참가 확정' :
                                r.status === 'waitlist' ? '대기자' : r.status}
                              {r.paid && r.status === 'confirmed' && <span className="dim-2 mono" style={{marginLeft:6, fontSize:9}}>입금 ✓</span>}
                            </td>
                            <td style={{padding:10, textAlign:'right'}}>
                              <div style={{display:'flex', justifyContent:'flex-end', gap:6, flexWrap:'wrap'}}>
                                {r.status === 'pending_payment' && (
                                  <button type="button" className="btn btn-small"
                                    onClick={() => { window.BGNJ_LECTURES.confirmPayment(l.id, r.id); refresh(); }}>
                                    입금 확인 → 확정
                                  </button>
                                )}
                                {r.status === 'confirmed' && r.price > 0 && (
                                  <button type="button" className="btn btn-small"
                                    onClick={() => { window.BGNJ_LECTURES.unconfirmPayment(l.id, r.id); refresh(); }}>
                                    확정 취소
                                  </button>
                                )}
                                {r.status !== 'refund_requested' && (
                                  <button type="button" className="btn btn-small"
                                    onClick={async () => {
                                      if (!(await window.BGNJ_CONFIRM(`${r.name} 님 신청을 취소 처리하시겠어요?`, { danger: true }))) return;
                                      window.BGNJ_LECTURES.cancelRegistration(l.id, r.id);
                                      refresh();
                                    }}
                                    style={{borderColor:'var(--danger)', color:'var(--danger)'}}>취소</button>
                                )}
                                {r.status === 'refund_requested' && (
                                  <>
                                    <span className="mono" style={{fontSize:9, color:'var(--warning)', letterSpacing:'0.15em'}}>환불신청</span>
                                    {r.refundReason && <span className="dim-2" style={{fontSize:10}}>· {r.refundReason}</span>}
                                    <button type="button" className="btn btn-small"
                                      onClick={async () => { if (!(await window.BGNJ_CONFIRM('환불을 승인하시겠어요?', { danger: true }))) return; window.BGNJ_LECTURES.approveRefund(l.id, r.id); refresh(); }}
                                      style={{borderColor:'var(--primary)', color:'var(--secondary)'}}>승인</button>
                                    <input className="field-input" placeholder="반려 사유"
                                      style={{padding:'4px 8px', fontSize:11, maxWidth:140}}
                                      value={refundRejectNotes[r.id] || ''}
                                      onChange={e => setRefundRejectNotes({...refundRejectNotes, [r.id]: e.target.value})}/>
                                    <button type="button" className="btn btn-small"
                                      onClick={async () => { if (!(await window.BGNJ_CONFIRM('환불 신청을 반려하시겠어요?', { danger: true }))) return; window.BGNJ_LECTURES.rejectRefund(l.id, r.id, refundRejectNotes[r.id] || ''); refresh(); }}
                                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>반려</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              </article>
            );
          })}
        </div>
      )}
      {/* v00.237 — 사진 갤러리 모달. LectureQuickAddModal 재사용 (정보 + 포스터 + 현장사진 통합). */}
      {galleryEditTarget && window.LectureQuickAddModal && (
        <window.LectureQuickAddModal
          onClose={() => setGalleryEditTarget(null)}
          onSaved={refresh}
          initialLecture={galleryEditTarget}/>
      )}
    </div>
  );
};

// === Tour Admin Panel =============================================
const TourAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({});
  // v00.237 — admin 패널에서도 사진 갤러리 통합 편집.
  const [galleryEditTarget, setGalleryEditTarget] = React.useState(null);
  const [refundRejectNotes, setRefundRejectNotes] = React.useState({});
  // v00.072 — 투어별 답사 일정/준비물/커버 inline 편집용 별도 state.
  // contentEditingId 가 set 되면 해당 투어 카드 하단에 TPE_ScheduleEditor/TPE_PrepEditor + 커버 업로드 노출.
  const [contentEditingId, setContentEditingId] = React.useState(null);
  const [contentSchedule, setContentSchedule] = React.useState([]);
  const [contentPrep, setContentPrep] = React.useState([]);
  const [contentCover, setContentCover] = React.useState('');
  const [contentMsg, setContentMsg] = React.useState('');
  const refresh = () => setTick((v) => v + 1);
  const tours = React.useMemo(() => window.BGNJ_TOURS.listAll({ includeHidden: true }), [tick]);

  const startContentEdit = (t) => {
    if (!t) return;
    const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
    const ovr = (sc.tourPages || {})[t.id] || {};
    setContentEditingId(t.id);
    setContentSchedule(Array.isArray(ovr.schedule) ? ovr.schedule.slice() : []);
    setContentPrep(Array.isArray(ovr.prep) ? ovr.prep.slice() : []);
    // v00.081 — D1 cover_url 우선, site_content_kv legacy 폴백.
    setContentCover(t.coverUrl || ovr.coverDataUri || '');
    setContentMsg('');
  };
  const cancelContentEdit = () => {
    setContentEditingId(null); setContentSchedule([]); setContentPrep([]); setContentCover(''); setContentMsg('');
  };
  const saveContentEdit = async () => {
    if (!contentEditingId) return;
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const tourPages = sc.tourPages || {};
      const cleanS = contentSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ''), l: String(s.l || '') }));
      const cleanP = contentPrep.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      // v00.081 — schedule / prep 만 site_content_kv 에. cover 는 D1 (tours.cover_url) 로 분기 저장.
      // 기존 site_content_kv.tourPages[id].coverDataUri legacy 는 D1 비면 폴백으로 계속 동작.
      const next = { ...tourPages, [contentEditingId]: {
        schedule: cleanS, prep: cleanP,
      } };
      await window.BGNJ_SITE_CONTENT.saveSection('tourPages', next);
      // 커버는 D1 에 직접 저장 — saveTour 로 cover_url 패치.
      try {
        await window.BGNJ_TOURS.saveTour({ id: contentEditingId, coverUrl: contentCover || '' });
      } catch (err) {
        console.warn('[v00.081] cover_url save 실패 — site_content fallback 사용 가능', err);
      }
      setContentMsg('저장됨 — 투어 페이지에 즉시 반영.');
      setTimeout(() => setContentMsg(''), 2500);
      refresh();
    } catch (err) { window.BGNJ_TOAST.error('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };
  // v00.184 — DRY: pickImageWithR2Fallback 헬퍼 사용.
  const onPickContentCover = async (e) => {
    const result = await pickImageWithR2Fallback(e, { folder: 'tour-covers' });
    if (result) setContentCover(result);
  };

  // 답사별 예약 목록을 mount 시 일괄 fetch.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = window.BGNJ_TOURS.listAll({ includeHidden: true });
      await Promise.allSettled(list.map((t) => window.BGNJ_TOURS.refreshReservations(t.id)));
      if (!cancelled) refresh();
    })();
    return () => { cancelled = true; };
  }, [tours.length]);

  const startEdit = (t) => {
    if (!t) return; // 생성 실패/null 방어
    const startsAtLocal = (() => {
      if (!t.startsAt) return '';
      const d = new Date(t.startsAt);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })();
    setEditingId(t.id);
    setDraft({
      title: t.title || '',
      subtitle: t.subtitle || '', // v00.106
      level: t.level || '입문',
      duration: t.duration || '',
      group: t.group || '',
      startsAt: startsAtLocal, // v00.106 — next 와 통합. next 는 startsAt 에서 자동 derive.
      durationMinutes: t.durationMinutes || 180,
      capacity: t.capacity || 12,
      priceNumber: t.priceNumber || 0,
      desc: t.desc || '',
      refundPolicy: t.refundPolicy || '', // v00.106
    });
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    const tour = window.BGNJ_TOURS.getTour(editingId);
    if (!tour) return;
    const startsAtIso = draft.startsAt ? new Date(draft.startsAt).toISOString() : tour.startsAt;
    // v00.106 — next 표시 문구는 startsAt 에서 자동 생성. "2026.05.15 10:00" 형태.
    const nextLabel = (() => {
      if (!startsAtIso) return tour.next || '';
      const d = new Date(startsAtIso);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })();
    // v00.127 — async + await + try/catch. 이전엔 fire-and-forget 으로 refresh 가 옛 데이터 사용.
    try {
      await window.BGNJ_TOURS.saveTour({
        id: tour.id,
        title: draft.title,
        subtitle: draft.subtitle, // v00.106
        level: draft.level,
        duration: draft.duration,
        group: draft.group,
        next: nextLabel,
        startsAt: startsAtIso,
        durationMinutes: Number(draft.durationMinutes) || 180,
        capacity: Number(draft.capacity) || tour.capacity,
        priceNumber: Number(draft.priceNumber) || 0,
        price: Number(draft.priceNumber) || 0,
        desc: draft.desc,
        refundPolicy: draft.refundPolicy, // v00.106
      });
      setEditingId(null);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error('투어 저장 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  const addNewTour = async () => {
    const id = `tour-${Date.now()}`;
    const now = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // +2주
    const pad = (n) => String(n).padStart(2, '0');
    const startsAt = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T10:00:00+09:00`;
    const next = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} 10:00`;
    try {
      // 서버는 priceNumber 우선, price 는 폴백 (parsePrice). 포맷팅 문자열 대신 숫자만 보냄.
      const tour = await window.BGNJ_TOURS.saveTour({
        id,
        title: '새 답사 — 부제',
        level: '입문',
        duration: '3시간',
        group: '12인 이하',
        next,
        startsAt,
        durationMinutes: 180,
        capacity: 12,
        priceNumber: 80000,
        price: 80000,
        desc: '답사 안내를 입력하세요.',
      });
      if (!tour) throw new Error('서버 응답 없음');
      window.BGNJ_AUDIT?.log({ action: 'tour.create', target: `tour:${id}` });
      try { window.BGNJ_BROADCAST?.publish?.('tours'); } catch {}
      refresh();
      startEdit(tour);
    } catch (err) {
      window.BGNJ_TOAST.error('투어 생성 실패: ' + (err?.message || '알 수 없는 오류'));
      refresh();
    }
  };

  // v00.127 — async + await + try/catch. 이전엔 deleteTour fire-and-forget 으로 refresh 가
  // 즉시 OLD 캐시 사용 → 사용자 화면 변화 없음. 사용자 보고 '삭제 버튼이 정상작동 안하네'.
  const removeTour = async (id) => {
    if (!(await window.BGNJ_CONFIRM('이 투어를 삭제하시겠어요? 시드 투어는 자동 숨김 처리(데이터 보존)됩니다. 관리자가 추가한 투어는 완전 삭제됩니다.', { danger: true }))) return;
    try {
      await window.BGNJ_TOURS.deleteTour(id);
      window.BGNJ_AUDIT?.log({ action: 'tour.remove', target: `tour:${id}` });
      try { window.BGNJ_BROADCAST?.publish?.('tours'); } catch {}
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error('투어 삭제 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };
  const toggleTourHidden = async (t) => {
    try {
      await window.BGNJ_TOURS.setHidden(t.id, !t.hidden);
      window.BGNJ_AUDIT?.log({ action: t.hidden ? 'tour.unhide' : 'tour.hide', target: `tour:${t.id}` });
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error('숨김 상태 변경 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  // v00.105 — 통합: 투어 페이지 콘텐츠 편집(글로벌/템플릿/per-tour) 을 본 패널 상단에 collapsible 로 내장.
  // 사용자 요청: '투어 프로그램과 투어 페이지는 연결되어야지'.
  const [showPageEditor, setShowPageEditor] = React.useState(false);

  return (
    <div>
      {/* 통합 페이지 콘텐츠 편집기 (collapsible) */}
      <div style={{marginBottom:18, border:'1px solid var(--line)', background:'var(--bg-2)'}}>
        <button type="button"
          onClick={() => setShowPageEditor((v) => !v)}
          style={{
            width:'100%', padding:'12px 16px', textAlign:'left',
            background:'transparent', border:'none', cursor:'pointer',
            fontSize:13, fontWeight:600, color:'var(--ink)',
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
          <span>📋 투어 페이지 콘텐츠 — 글로벌 답사 일정·준비물 / 템플릿 / 투어별 override</span>
          <span className="mono dim-2" style={{fontSize:11}}>{showPageEditor ? '▲ 닫기' : '▼ 펼치기'}</span>
        </button>
        {showPageEditor && (
          <div style={{padding:'14px 18px', borderTop:'1px solid var(--line)', background:'var(--bg)'}}>
            {window.TourPageEditorPanel ? <window.TourPageEditorPanel/> : <p className="dim">패널 로딩 중...</p>}
          </div>
        )}
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap', marginBottom:18}}>
        <p className="dim" style={{fontSize:13, lineHeight:1.8, margin:0, flex:1, minWidth:280}}>
          투어 정원 / 일정 / 가격을 수정하고, 신청자 입금을 확인해 참가를 확정합니다.
          결제는 현재 <strong className="gold">무통장 입금</strong>만 지원합니다(강연과 같은 계좌 사용).
        </p>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {tours.length === 0 && (
            <button type="button" className="btn btn-small" onClick={async () => {
              if (!(await window.BGNJ_CONFIRM('샘플 답사 3개를 추가합니다. 진행할까요?', { danger: true }))) return;
              const samples = [
                { title: '경복궁 — 왕의 일상', location: '경복궁 일대', host: '뱅기노자', durationMinutes: 180, capacity: 15, price: 30000, desc: '경복궁 외전·내전을 따라 왕의 하루를 좇는 답사.' },
                { title: '창덕궁 — 후원 산책', location: '창덕궁 후원', host: '뱅기노자', durationMinutes: 150, capacity: 12, price: 35000, desc: '비원의 절경과 함께하는 인문학 산책.' },
                { title: '북촌 — 한옥과 사람', location: '북촌 한옥마을', host: '뱅기노자', durationMinutes: 120, capacity: 10, price: 25000, desc: '북촌의 골목과 한옥에 담긴 이야기를 따라 걷습니다.' },
              ];
              const pad = (n) => String(n).padStart(2, '0');
              for (let i = 0; i < samples.length; i++) {
                const d = new Date(Date.now() + (i + 2) * 7 * 24 * 60 * 60 * 1000);
                const startsAt = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T10:00:00+09:00`;
                const next = `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} 10:00`;
                const sample = samples[i];
                await window.BGNJ_TOURS.saveTour({
                  id: `sample-tour-${Date.now()}-${i}`,
                  title: sample.title, level: '입문', duration: `${Math.round(sample.durationMinutes/60)}시간`,
                  group: `소그룹 (최대 ${sample.capacity}명)`, next, startsAt,
                  durationMinutes: sample.durationMinutes, capacity: sample.capacity,
                  priceNumber: sample.price, price: sample.price,
                  desc: sample.desc, location: sample.location, host: sample.host,
                });
              }
              refresh();
            }}>샘플 데이터 추가</button>
          )}
          <button type="button" className="btn btn-gold btn-small" onClick={addNewTour}>＋ 새 투어 추가</button>
        </div>
      </div>

      {tours.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>관리할 투어가 없습니다.</div>
      ) : (
        <div style={{display:'grid', gap:14}}>
          {tours.map((t) => {
            const seats = window.BGNJ_TOURS.getSeats(t.id);
            const regs = window.BGNJ_TOURS.listReservations(t.id);
            const active = regs.filter((r) => r.status !== 'cancelled');
            const isEditing = editingId === t.id;
            return (
              <article key={t.id} className="card" style={{padding:20, opacity: t.hidden ? 0.55 : 1}}>
                <header style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                  <div>
                    <h3 className="ko-serif" style={{fontSize:18}}>
                      <span className="dim-2 mono" style={{fontSize:11, marginRight:8}}>#{String(t.id).padStart(2,'0')}</span>
                      {t.title}
                      {t.hidden && <span className="mono" style={{marginLeft:10, fontSize:10, letterSpacing:'0.18em', color:'var(--danger)', border:'1px solid var(--danger)', padding:'1px 6px', borderRadius:2}}>숨김</span>}
                    </h3>
                    <div className="mono dim-2" style={{fontSize:11, marginTop:4, letterSpacing:'0.12em'}}>
                      {t.next} · {t.duration} · {t.group} · {t.level}
                    </div>
                  </div>
                  <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: seats.remaining <= 0 ? 'var(--danger)' : 'var(--primary)'}}>
                      잔여 {seats.remaining} / {seats.capacity}
                    </span>
                    {seats.waitlist > 0 && <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)'}}>대기 {seats.waitlist}</span>}
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)', border:'1px solid var(--line-2)', padding:'1px 6px'}}>
                      {window.BGNJ_FMT.won(t.priceNumber)}
                    </span>
                  </div>
                </header>

                {isEditing ? (
                  // v00.106 — 폼 재구성: 사용자 요청 순서. 표시 일정 문구 + startsAt 통합 (next 자동 derive).
                  <div style={{padding:'14px 0', borderTop:'1px solid var(--line)'}}>
                    {/* 그룹 1: 제목 / 부제 (full-width) */}
                    <div style={{display:'grid', gridTemplateColumns:'1fr', gap:10, marginBottom:10}}>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">투어명</label>
                        <input className="field-input" type="text"
                          value={draft.title || ''}
                          onChange={(e) => setDraft({ ...draft, title: e.target.value })}/>
                      </div>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">부제</label>
                        <input className="field-input" type="text" placeholder="예: 왕의 발자취를 따라"
                          value={draft.subtitle || ''}
                          onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}/>
                      </div>
                    </div>
                    {/* 그룹 2: 표시용 메타 (난이도 / 소요(표시) / 정원(표시)) */}
                    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:10}}>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">난이도</label>
                        <input className="field-input" type="text" placeholder="입문 / 심화"
                          value={draft.level || ''}
                          onChange={(e) => setDraft({ ...draft, level: e.target.value })}/>
                      </div>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">소요 (표시)</label>
                        <input className="field-input" type="text" placeholder="3시간"
                          value={draft.duration || ''}
                          onChange={(e) => setDraft({ ...draft, duration: e.target.value })}/>
                      </div>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">정원 (표시)</label>
                        <input className="field-input" type="text" placeholder="12인 이하"
                          value={draft.group || ''}
                          onChange={(e) => setDraft({ ...draft, group: e.target.value })}/>
                      </div>
                    </div>
                    {/* 그룹 3: 일정 (통합) — startsAt 만 입력. next 표시 문구는 자동 derive */}
                    <div style={{display:'grid', gridTemplateColumns:'1fr', gap:10, marginBottom:10}}>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">일정 (실제 시작 시간 — 표시 문구는 자동 생성)</label>
                        <input className="field-input" type="datetime-local"
                          value={draft.startsAt || ''}
                          onChange={(e) => setDraft({ ...draft, startsAt: e.target.value })}/>
                      </div>
                    </div>
                    {/* 그룹 4: 숫자 메타 (소요시간 / 정원 / 참가비) */}
                    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:10}}>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">소요 시간 (분)</label>
                        <input className="field-input" type="number" placeholder="180"
                          value={draft.durationMinutes ?? ''}
                          onChange={(e) => setDraft({ ...draft, durationMinutes: e.target.value })}/>
                      </div>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">정원 (숫자)</label>
                        <input className="field-input" type="number" placeholder="12"
                          value={draft.capacity ?? ''}
                          onChange={(e) => setDraft({ ...draft, capacity: e.target.value })}/>
                      </div>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">참가비 (원)</label>
                        <input className="field-input" type="number" placeholder="80000"
                          value={draft.priceNumber ?? ''}
                          onChange={(e) => setDraft({ ...draft, priceNumber: e.target.value })}/>
                      </div>
                    </div>
                    {/* 그룹 5: 설명 */}
                    <div className="field" style={{margin:0, marginBottom:10}}>
                      <label className="field-label">설명</label>
                      <textarea className="field-input" rows={3} value={draft.desc || ''}
                        onChange={(e) => setDraft({ ...draft, desc: e.target.value })}/>
                    </div>
                    {/* 그룹 6: 환불정책 */}
                    <div className="field" style={{margin:0, marginBottom:10}}>
                      <label className="field-label">환불정책</label>
                      <textarea className="field-input" rows={3} value={draft.refundPolicy || ''}
                        placeholder={'예: 출발 7일 전까지 100% 환불 / 3일 전까지 50% / 이후 환불 불가'}
                        onChange={(e) => setDraft({ ...draft, refundPolicy: e.target.value })}/>
                      <p className="dim-2" style={{fontSize:11, marginTop:4, lineHeight:1.5}}>
                        ⓘ 비우면 운영설정의 글로벌 환불정책 사용 (다음 사이클 도입 예정).
                      </p>
                    </div>
                    <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
                      <button type="button" className="btn btn-small" onClick={() => setEditingId(null)}>취소</button>
                      <button type="button" className="btn btn-gold btn-small" onClick={saveEdit}>저장</button>
                    </div>
                    <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
                      ※ 세부 일정 / 준비물 은 아래 <strong>📋 답사 일정·준비물·커버</strong> 버튼에서 편집 (진행 흐름 + 준비물 list + 커버 이미지).
                    </p>
                  </div>
                ) : (
                  <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:10, flexWrap:'wrap'}}>
                    <button type="button" className="btn btn-small btn-gold" onClick={() => startEdit(t)}>✎ 투어 정보 (제목·정원·난이도·소요시간·가격)</button>
                    <button type="button" className="btn btn-small" onClick={() => startContentEdit(t)}>📋 답사 일정·준비물·커버</button>
                    {/* v00.237 — 사진 갤러리 (포스터) 통합 편집. window.TourQuickAddModal 재사용. */}
                    <button type="button" className="btn btn-small" onClick={() => setGalleryEditTarget(t)}>🖼 사진 갤러리</button>
                    <button type="button" className="btn btn-small"
                      onClick={() => toggleTourHidden(t)}
                      style={{marginLeft:'auto'}}>
                      {t.hidden ? '👁 표시 복원' : '🙈 숨김 처리'}
                    </button>
                    <button type="button" className="btn btn-small" onClick={() => removeTour(t.id)}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                  </div>
                )}

                {/* v00.072 — 투어별 답사 일정·준비물·커버 inline 편집 (per-tour override) */}
                {contentEditingId === t.id && (
                  <section style={{marginTop:14, paddingTop:14, borderTop:'1px solid var(--line)'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10, flexWrap:'wrap', gap:8}}>
                      <div className="mono gold" style={{fontSize:11, letterSpacing:'0.22em'}}>이 투어의 답사 콘텐츠</div>
                      <div className="dim-2" style={{fontSize:10, fontStyle:'italic'}}>
                        비워두면 글로벌 답사 일정/준비물 (운영설정 → 투어 페이지) 사용. 커버 비면 placeholder.
                      </div>
                    </div>
                    {/* 커버 이미지 */}
                    <div className="card" style={{padding:12, marginBottom:12, display:'flex', gap:14, alignItems:'center'}}>
                      <div style={{width:96, height:60, flexShrink:0, border:'1px solid var(--line)', background:'var(--bg-2)', display:'grid', placeItems:'center', overflow:'hidden'}}>
                        {contentCover
                          ? <img src={contentCover} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                          : <span className="dim-2 mono" style={{fontSize:9, letterSpacing:'0.18em'}}>NONE</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:3}}>커버 이미지</div>
                        <div className="dim-2" style={{fontSize:11, lineHeight:1.5}}>1600×1000 권장 · 1.5MB 이하 · 비우면 placeholder.</div>
                      </div>
                      <div style={{display:'flex', gap:6}}>
                        <label className="btn btn-small" style={{cursor:'pointer'}}>
                          업로드
                          <input type="file" accept="image/*" onChange={onPickContentCover} style={{display:'none'}}/>
                        </label>
                        {contentCover && (
                          <button type="button" className="btn btn-small" onClick={() => setContentCover('')}
                            style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                        )}
                      </div>
                    </div>
                    {/* 답사 일정 / 준비물 (TPE_* 헬퍼는 모듈 최상위 — 호이스팅 후 lookup) */}
                    <TPE_ScheduleEditor rows={contentSchedule}
                      onAdd={() => setContentSchedule((a) => _arrAdd(a, { t: '', l: '' }))}
                      onRemove={(i) => setContentSchedule((a) => _arrRemove(a, i))}
                      onUpdate={(i, k, v) => setContentSchedule((a) => { const n = a.slice(); n[i] = { ...n[i], [k]: v }; return n; })}
                      onMove={(i, d) => setContentSchedule((a) => _arrMove(a, i, d))}/>
                    <TPE_PrepEditor rows={contentPrep}
                      onAdd={() => setContentPrep((a) => _arrAdd(a, ''))}
                      onRemove={(i) => setContentPrep((a) => _arrRemove(a, i))}
                      onUpdate={(i, v) => setContentPrep((a) => _arrUpdate(a, i, v))}
                      onMove={(i, d) => setContentPrep((a) => _arrMove(a, i, d))}/>
                    <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:8}}>
                      {contentMsg && <span role="status" className="mono" style={{fontSize:11, color:'var(--secondary)', fontWeight:600, marginRight:'auto'}}>{contentMsg}</span>}
                      <button type="button" className="btn btn-small" onClick={cancelContentEdit}>닫기</button>
                      <button type="button" className="btn btn-gold btn-small" onClick={saveContentEdit}>저장</button>
                    </div>
                  </section>
                )}

                {/* Roster */}
                <section style={{marginTop:14, paddingTop:14, borderTop:'1px solid var(--line)'}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>참가자 명단 · {active.length}명</div>
                  {active.length === 0 ? (
                    <p className="dim" style={{fontSize:13}}>아직 신청자가 없습니다.</p>
                  ) : (
                    <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
                      <thead>
                        <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>이름</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>이메일</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>연락처</th>
                          <th scope="col" style={{padding:10, textAlign:'right'}}>인원</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>상태</th>
                          <th scope="col" style={{padding:10, textAlign:'right'}}>액션</th>
                        </tr>
                      </thead>
                      <tbody>
                        {active.map((r) => (
                          <tr key={r.id} style={{borderBottom:'1px solid var(--line)'}}>
                            <td style={{padding:10}}>{r.name}</td>
                            <td className="mono dim-2" style={{padding:10, fontSize:11}}>{r.email}</td>
                            <td className="mono dim-2" style={{padding:10, fontSize:11}}>{r.phone || '-'}</td>
                            <td className="mono" style={{padding:10, textAlign:'right'}}>{r.count}</td>
                            <td className="mono" style={{padding:10, fontSize:10, letterSpacing:'0.18em', color:
                              r.status === 'confirmed' ? 'var(--primary)' :
                              r.status === 'waitlist' ? 'var(--ink-2)' :
                              r.status === 'pending_payment' ? 'var(--ink-2)' : 'var(--danger)'}}>
                              {r.status === 'pending_payment' ? '입금 대기' :
                                r.status === 'confirmed' ? '참가 확정' :
                                r.status === 'waitlist' ? '대기자' : r.status}
                              {r.paid && r.status === 'confirmed' && <span className="dim-2 mono" style={{marginLeft:6, fontSize:9}}>입금 ✓</span>}
                            </td>
                            <td style={{padding:10, textAlign:'right'}}>
                              <div style={{display:'flex', justifyContent:'flex-end', gap:6, flexWrap:'wrap'}}>
                                {r.status === 'pending_payment' && (
                                  <button type="button" className="btn btn-small"
                                    onClick={() => { window.BGNJ_TOURS.confirmPayment(t.id, r.id); refresh(); }}>
                                    입금 확인 → 확정
                                  </button>
                                )}
                                {r.status === 'confirmed' && r.price > 0 && (
                                  <button type="button" className="btn btn-small"
                                    onClick={() => { window.BGNJ_TOURS.unconfirmPayment(t.id, r.id); refresh(); }}>
                                    확정 취소
                                  </button>
                                )}
                                {r.status !== 'refund_requested' && (
                                  <button type="button" className="btn btn-small"
                                    onClick={async () => {
                                      if (!(await window.BGNJ_CONFIRM(`${r.name} 님 신청을 취소 처리하시겠어요?`, { danger: true }))) return;
                                      window.BGNJ_TOURS.cancelReservation(t.id, r.id);
                                      refresh();
                                    }}
                                    style={{borderColor:'var(--danger)', color:'var(--danger)'}}>취소</button>
                                )}
                                {r.status === 'refund_requested' && (
                                  <>
                                    <span className="mono" style={{fontSize:9, color:'var(--warning)', letterSpacing:'0.15em'}}>환불신청</span>
                                    {r.refundReason && <span className="dim-2" style={{fontSize:10}}>· {r.refundReason}</span>}
                                    <button type="button" className="btn btn-small"
                                      onClick={async () => { if (!(await window.BGNJ_CONFIRM('환불을 승인하시겠어요?', { danger: true }))) return; window.BGNJ_TOURS.approveRefund(t.id, r.id); refresh(); }}
                                      style={{borderColor:'var(--primary)', color:'var(--secondary)'}}>승인</button>
                                    <input className="field-input" placeholder="반려 사유"
                                      style={{padding:'4px 8px', fontSize:11, maxWidth:140}}
                                      value={refundRejectNotes[r.id] || ''}
                                      onChange={e => setRefundRejectNotes({...refundRejectNotes, [r.id]: e.target.value})}/>
                                    <button type="button" className="btn btn-small"
                                      onClick={async () => { if (!(await window.BGNJ_CONFIRM('환불 신청을 반려하시겠어요?', { danger: true }))) return; window.BGNJ_TOURS.rejectRefund(t.id, r.id, refundRejectNotes[r.id] || ''); refresh(); }}
                                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>반려</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              </article>
            );
          })}
        </div>
      )}
      {/* v00.237 — 사진 갤러리 모달. TourQuickAddModal 재사용. */}
      {galleryEditTarget && window.TourQuickAddModal && (
        <window.TourQuickAddModal
          onClose={() => setGalleryEditTarget(null)}
          onSaved={refresh}
          initialTour={galleryEditTarget}/>
      )}
    </div>
  );
};

// === Bank Account Settings Panel ==================================
// 무통장 입금 계좌 — 멀티 계좌 CRUD. 강연/투어/책 결제 화면에서 계좌 선택 가능.
const BankAccountPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [accounts, setAccounts] = React.useState(() => window.BGNJ_LECTURES.listBankAccounts());
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({ label: '', bankName: '', accountNumber: '', holder: '', memo: '', isDefault: false });
  const [msg, setMsg] = React.useState('');

  const refresh = async () => {
    await window.BGNJ_LECTURES.refreshBankAccount();
    setAccounts(window.BGNJ_LECTURES.listBankAccounts());
    setTick((v) => v + 1);
  };

  React.useEffect(() => {
    refresh();
    const onR = () => setAccounts(window.BGNJ_LECTURES.listBankAccounts());
    window.addEventListener('bgnj-bank-accounts-refresh', onR);
    return () => window.removeEventListener('bgnj-bank-accounts-refresh', onR);
  }, []);

  const startEdit = (a) => {
    setEditingId(a.id);
    setDraft({
      label: a.label || '', bankName: a.bankName || '', accountNumber: a.accountNumber || '',
      holder: a.holder || '', memo: a.memo || '', isDefault: !!a.isDefault,
    });
  };
  const startNew = () => {
    setEditingId('new');
    setDraft({ label: '', bankName: '', accountNumber: '', holder: '', memo: '', isDefault: !accounts.length });
  };
  const cancel = () => { setEditingId(null); setMsg(''); };

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2400); };

  const save = async (e) => {
    e.preventDefault();
    if (!draft.label.trim()) return flash('✗ 계좌 이름을 입력해 주세요.');
    if (!draft.accountNumber.trim()) return flash('✗ 계좌번호를 입력해 주세요.');
    try {
      if (editingId === 'new') {
        await window.BGNJ_LECTURES.createBankAccount(draft);
      } else if (editingId) {
        await window.BGNJ_LECTURES.updateBankAccount(editingId, draft);
      }
      await refresh();
      setEditingId(null);
      flash('✓ 저장되었습니다.');
    } catch (err) {
      flash('✗ 저장 실패: ' + (err?.body?.error || err?.message || '알 수 없는 오류'));
    }
  };

  const remove = async (a) => {
    if (!(await window.BGNJ_CONFIRM(`"${a.label}" 계좌를 삭제하시겠습니까?`, { danger: true }))) return;
    try {
      await window.BGNJ_LECTURES.deleteBankAccount(a.id);
      await refresh();
      flash('✓ 삭제되었습니다.');
    } catch (err) {
      flash('✗ 삭제 실패: ' + (err?.message || ''));
    }
  };

  const setDefault = async (a) => {
    try {
      await window.BGNJ_LECTURES.updateBankAccount(a.id, { isDefault: true });
      await refresh();
      flash('✓ 기본 계좌가 변경되었습니다.');
    } catch (err) { flash('✗ 변경 실패: ' + (err?.message || '')); }
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:14, lineHeight:1.8}}>
        무통장 입금 계좌를 여러 개 등록할 수 있습니다. <strong className="gold">기본 계좌</strong>는 결제 화면에서 자동 선택되며, 사용자가 다른 계좌를 선택할 수도 있습니다.
      </p>

      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:14}}>
        <button type="button" className="btn btn-small btn-gold" onClick={startNew}>＋ 새 계좌 추가</button>
      </div>

      <div style={{overflowX:'auto', border:'1px solid var(--line)'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:880}}>
          <thead>
            <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
              <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:140}}>이름 (라벨)</th>
              <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:120}}>은행</th>
              <th scope="col" style={{padding:'12px 14px', textAlign:'left'}}>계좌번호</th>
              <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:120}}>예금주</th>
              <th scope="col" style={{padding:'12px 14px', textAlign:'center', width:100}}>기본</th>
              <th scope="col" style={{padding:'12px 14px', textAlign:'right', width:200}}>작업</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr><td colSpan={6} className="dim" style={{padding:32, textAlign:'center'}}>등록된 계좌가 없습니다. "＋ 새 계좌 추가" 를 눌러 시작하세요.</td></tr>
            ) : accounts.map((a) => (
              <tr key={a.id} style={{borderTop:'1px solid var(--line)'}}>
                <td className="ko-serif" style={{padding:'12px 14px', fontWeight:500}}>{a.label}</td>
                <td style={{padding:'12px 14px'}}>{a.bankName || '-'}</td>
                <td className="mono" style={{padding:'12px 14px'}}>{a.accountNumber || '-'}</td>
                <td style={{padding:'12px 14px'}}>{a.holder || '-'}</td>
                <td style={{padding:'12px 14px', textAlign:'center'}}>
                  {a.isDefault ? (
                    <span className="badge badge-gold" style={{fontSize:10}}>기본</span>
                  ) : (
                    <button type="button" className="btn-ghost" onClick={() => setDefault(a)}
                      style={{fontSize:11, color:'var(--ink-3)'}}>기본으로</button>
                  )}
                </td>
                <td style={{padding:'12px 14px', textAlign:'right'}}>
                  <button type="button" className="btn btn-small" onClick={() => startEdit(a)} style={{marginRight:6}}>수정</button>
                  <button type="button" className="btn btn-small" onClick={() => remove(a)}
                    style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {msg && (
        <div role="status" style={{
          marginTop:14, padding:'10px 14px',
          border: msg.startsWith('✗') ? '1px solid var(--danger)' : '1px solid var(--primary-dim)',
          background: msg.startsWith('✗') ? 'rgba(194,74,61,0.06)' : 'rgba(245,213,72,0.06)',
          color: msg.startsWith('✗') ? 'var(--danger)' : 'var(--primary)', fontSize:13,
        }}>{msg}</div>
      )}

      {editingId && (
        <form onSubmit={save} className="card" style={{padding:24, marginTop:18, maxWidth:720}}>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>
            {editingId === 'new' ? 'NEW ACCOUNT' : 'EDIT ACCOUNT'}
          </div>
          <h2 className="ko-serif" style={{fontSize:18, marginBottom:14}}>
            {editingId === 'new' ? '새 계좌 추가' : '계좌 수정'}
          </h2>
          <div style={{display:'grid', gap:12}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label">계좌 이름 (라벨) <span className="gold">*</span></label>
              <input className="field-input" placeholder="예) 강연 입금용 / 책 주문용 / 메인"
                value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })}/>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div className="field" style={{margin:0}}>
                <label className="field-label">은행</label>
                <input className="field-input" placeholder="예) 국민은행"
                  value={draft.bankName} onChange={(e) => setDraft({ ...draft, bankName: e.target.value })}/>
              </div>
              <div className="field" style={{margin:0}}>
                <label className="field-label">예금주</label>
                <input className="field-input" placeholder="예) 뱅기노자"
                  value={draft.holder} onChange={(e) => setDraft({ ...draft, holder: e.target.value })}/>
              </div>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">계좌번호 <span className="gold">*</span></label>
              <input className="field-input" placeholder="예) 123-456-7890123"
                value={draft.accountNumber} onChange={(e) => setDraft({ ...draft, accountNumber: e.target.value })}/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">안내 메모 (선택)</label>
              <textarea className="field-input" rows={2}
                placeholder="입금자명에 신청자 본명 + 신청번호를 남겨 주세요."
                value={draft.memo} onChange={(e) => setDraft({ ...draft, memo: e.target.value })}/>
            </div>
            <label style={{display:'flex', alignItems:'center', gap:8, fontSize:13}}>
              <input type="checkbox" style={{accentColor:'var(--primary)'}}
                checked={draft.isDefault}
                onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })}/>
              기본 계좌로 사용 (결제 화면에서 자동 선택)
            </label>
          </div>
          <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:18, paddingTop:14, borderTop:'1px solid var(--line)'}}>
            <button type="button" className="btn" onClick={cancel}>취소</button>
            <button type="submit" className="btn btn-gold">{editingId === 'new' ? '추가' : '저장'}</button>
          </div>
        </form>
      )}
    </div>
  );
};

// 결제 화면용 — 멀티 계좌 셀렉터 + 안내 박스. 모든 결제 흐름(강연/투어/책) 에서 재사용.
// 멀티 계좌가 없으면 단일 getBankAccount 폴백을 단일 옵션으로 노출. 둘 다 없으면 안내 메시지.
window.BGNJ_BankAccountPicker = ({ value, onChange, accounts, refreshOnMount = true }) => {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (refreshOnMount) {
      window.BGNJ_LECTURES?.refreshBankAccount?.().then(() => setTick((v) => v + 1));
    }
    const onR = () => setTick((v) => v + 1);
    window.addEventListener('bgnj-bank-accounts-refresh', onR);
    return () => window.removeEventListener('bgnj-bank-accounts-refresh', onR);
  }, []);
  const multi = (accounts && accounts.length) ? accounts : (window.BGNJ_LECTURES?.listBankAccounts?.() || []);
  const list = multi.length
    ? multi
    : (() => {
      const single = window.BGNJ_LECTURES?.getBankAccount?.() || {};
      return single.accountNumber
        ? [{ id: 'default', label: '기본 계좌', isDefault: true,
            bankName: single.bankName, accountNumber: single.accountNumber,
            holder: single.holder, memo: single.memo }]
        : [];
    })();
  if (!list.length) {
    return (
      <div style={{padding:'12px 14px', border:'1px solid var(--danger)', background:'rgba(194,74,61,0.05)', color:'var(--danger)', fontSize:12, lineHeight:1.6}}>
        ⚠ 등록된 입금 계좌가 없습니다. 운영자에게 문의해 주세요.
      </div>
    );
  }
  const selected = list.find((a) => a.id === value) || list.find((a) => a.isDefault) || list[0];
  // 첫 마운트 시 부모에 기본 선택 알림.
  React.useEffect(() => {
    if (selected && selected.id !== value && onChange) onChange(selected.id);
  }, [list.length]);
  return (
    <div style={{padding:'14px 16px', border:'1px solid var(--primary-dim)', background:'rgba(245,213,72,0.04)'}}>
      <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>BANK ACCOUNT · 입금 계좌</div>
      {list.length > 1 && (
        <div style={{marginBottom:12}}>
          <label className="dim-2 mono" style={{fontSize:11, display:'block', marginBottom:6}}>입금할 계좌 선택</label>
          <select className="field-input" style={{fontSize:13}}
            value={selected?.id || ''}
            onChange={(e) => onChange?.(e.target.value)}>
            {list.map((a) => (
              <option key={a.id} value={a.id}>{a.label}{a.isDefault ? ' (기본)' : ''}</option>
            ))}
          </select>
        </div>
      )}
      {selected && (
        <div style={{display:'grid', gridTemplateColumns:'90px 1fr', gap:'6px 14px', fontSize:13, lineHeight:1.6}}>
          <div className="dim-2 mono" style={{fontSize:11}}>은행</div>
          <div>{selected.bankName || '-'}</div>
          <div className="dim-2 mono" style={{fontSize:11}}>계좌번호</div>
          <div className="mono gold" style={{fontWeight:500}}>{selected.accountNumber || '-'}</div>
          <div className="dim-2 mono" style={{fontSize:11}}>예금주</div>
          <div>{selected.holder || '-'}</div>
          {selected.memo && (<>
            <div className="dim-2 mono" style={{fontSize:11}}>안내</div>
            <div>{selected.memo}</div>
          </>)}
        </div>
      )}
    </div>
  );
};

// === Book Orders Admin Panel ======================================
const BookOrderAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [filter, setFilter] = React.useState('pending_payment');
  const [trackingDraft, setTrackingDraft] = React.useState({});
  const refresh = () => setTick((v) => v + 1);

  // v00.262.006 — B1 split 회귀 패치. admin 패널은 _ordersAll 캐시를 읽는데, 마운트
  // 시점에 refreshAll() 트리거하는 곳이 boot 어디에도 없어 빈 목록 표시.
  // 이전엔 같은 _orders 캐시를 refreshMine 이 부분적으로 채워줬으나 분리되며 끊김.
  // 'bgnj-orders-refresh' 이벤트 listen + 진입 시 refreshAll 1회.
  React.useEffect(() => {
    let cancelled = false;
    window.BGNJ_BOOK_ORDERS?.refreshAll?.().finally(() => { if (!cancelled) refresh(); });
    const onR = () => { if (!cancelled) refresh(); };
    window.addEventListener('bgnj-orders-refresh', onR);
    return () => { cancelled = true; window.removeEventListener('bgnj-orders-refresh', onR); };
  }, []);

  const orders = React.useMemo(() => window.BGNJ_BOOK_ORDERS.listByStatus(filter), [filter, tick]);
  const [rejectNotes, setRejectNotes] = React.useState({});
  const counts = React.useMemo(() => ({
    all: window.BGNJ_BOOK_ORDERS.listAll().length,
    pending_payment: window.BGNJ_BOOK_ORDERS.listByStatus('pending_payment').length,
    paid: window.BGNJ_BOOK_ORDERS.listByStatus('paid').length,
    shipped: window.BGNJ_BOOK_ORDERS.listByStatus('shipped').length,
    delivered: window.BGNJ_BOOK_ORDERS.listByStatus('delivered').length,
    refund_requested: window.BGNJ_BOOK_ORDERS.listByStatus('refund_requested').length,
    cancelled: window.BGNJ_BOOK_ORDERS.listByStatus('cancelled').length,
  }), [tick]);

  const handleExportCsv = () => {
    downloadCsv(`book-orders-${new Date().toISOString().slice(0, 10)}.csv`, window.BGNJ_BOOK_ORDERS.exportCsv());
  };

  const statusLabel = (s) => ({
    pending_payment: '입금 대기',
    paid: '입금 확인',
    shipped: '배송중',
    delivered: '배송 완료',
    refund_requested: '환불 신청',
    cancelled: '취소됨',
  }[s] || s);

  const statusTone = (s) => ({
    pending_payment: 'var(--ink-2)',
    paid: 'var(--primary)',
    shipped: 'var(--primary)',
    delivered: 'var(--primary-hover)',
    refund_requested: 'var(--warning)',
    cancelled: 'var(--danger)',
  }[s] || 'var(--ink-2)');

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        뱅기노자 도서 주문은 회원 전용·무통장 입금 단일 흐름입니다.
        주문 → 입금 확인 → 발송 → 배송 완료 순으로 상태를 직접 진행하세요.
        계좌번호는 <strong className="gold">시스템 → 설정</strong> 탭에서 등록·수정합니다.
      </p>

      <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'center', flexWrap:'wrap', marginBottom:18}}>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {[
            { key: 'pending_payment',  label: '입금 대기' },
            { key: 'paid',             label: '입금 확인' },
            { key: 'shipped',          label: '배송중' },
            { key: 'delivered',        label: '배송 완료' },
            { key: 'refund_requested', label: '환불 신청' },
            { key: 'cancelled',        label: '취소' },
            { key: 'all',              label: '전체' },
          ].map((f) => (
            <button key={f.key} type="button" className="btn btn-small"
              onClick={() => setFilter(f.key)}
              style={{
                borderColor: filter === f.key ? 'var(--primary)' : 'var(--line)',
                color: filter === f.key ? 'var(--primary)' : 'var(--ink-2)',
                background: filter === f.key ? 'rgba(245,213,72,0.06)' : 'transparent',
              }}>
              {f.label} <span className="mono dim-2" style={{ fontSize: 10, marginLeft: 4 }}>{counts[f.key] ?? 0}</span>
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-small" onClick={handleExportCsv}>CSV 다운로드</button>
      </div>

      {orders.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>해당 상태의 주문이 없습니다.</div>
      ) : (
        <div style={{display:'grid', gap:12}}>
          {orders.map((o) => (
            <article key={o.id} className="card" style={{padding:18}}>
              <header style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                <div style={{display:'flex', gap:10, alignItems:'baseline', flexWrap:'wrap'}}>
                  <span className="mono gold" style={{fontSize:12, letterSpacing:'0.16em'}}>{o.orderNo}</span>
                  <span className="mono dim-2" style={{fontSize:11}}>{window.BGNJ_FMT.kstDateTime(o.createdAt)}</span>
                </div>
                <span className="mono" style={{fontSize:10, letterSpacing:'0.22em', color: statusTone(o.status)}}>
                  {statusLabel(o.status).toUpperCase()}{o.paid && o.status === 'paid' && ' · 입금 ✓'}
                </span>
              </header>

              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12, marginBottom:14}}>
                <div>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:4}}>BOOK</div>
                  <div style={{fontSize:13}}>『{window.BGNJ_BOOK_ORDERS.getOrderBookTitle(o)}』 · {o.version === 'KR' ? '국문판' : '영문판'} × {o.qty}</div>
                </div>
                <div>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:4}}>AMOUNT</div>
                  <div className="gold ko-serif" style={{fontSize:18}}>{window.BGNJ_FMT.won(o.total)}</div>
                  <div className="dim-2 mono" style={{fontSize:10}}>상품 {window.BGNJ_FMT.currency(o.subtotal)} + 배송 {window.BGNJ_FMT.currency(o.shipping)}</div>
                </div>
                <div>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:4}}>RECIPIENT</div>
                  <div style={{fontSize:13, lineHeight:1.6}}>{o.recipient} · {o.phone}</div>
                </div>
                <div>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:4}}>SHIP TO</div>
                  <div style={{fontSize:12, lineHeight:1.6}}>{o.address} {o.addressDetail}</div>
                  {o.memo && <div className="dim-2" style={{fontSize:11, marginTop:2}}>· {o.memo}</div>}
                </div>
              </div>

              <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', borderTop:'1px solid var(--line)', paddingTop:12}}>
                <button type="button" className="btn btn-small"
                  onClick={() => window.BGNJ_BOOK_ORDERS.downloadReceipt(o.id)}>영수증 ↓</button>
                {/* v00.261 — admin 영구 삭제. 테스트/오발주 청소 용도. audit_log 자동 기록.
                    한국 전자상거래법 거래기록 5년 보존은 '실거래' 한정 — 테스트 주문 적용 외. */}
                <button type="button" className="btn btn-small"
                  title="이 주문 기록을 영구 삭제합니다 (감사 로그 남음)"
                  onClick={async () => {
                    const ok = await window.BGNJ_CONFIRM(
                      `주문 ${o.orderNo} 기록을 영구 삭제하시겠어요?\n\n실제 결제·배송이 진행된 거래라면 삭제 대신 '취소' 처리를 권장합니다.\n삭제는 되돌릴 수 없으며 감사 로그에 흔적이 남습니다.`,
                      { danger: true, confirmLabel: '영구 삭제' }
                    );
                    if (!ok) return;
                    const res = await window.BGNJ_BOOK_ORDERS.adminDeleteOrder(o.id);
                    if (!res?.ok) {
                      try { window.BGNJ_TOAST?.error?.(res?.message || '주문 삭제 실패'); } catch {}
                      return;
                    }
                    try { window.BGNJ_TOAST?.success?.(`주문 ${o.orderNo} 삭제 완료`); } catch {}
                    refresh();
                  }}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>
                  삭제
                </button>
                {o.status === 'pending_payment' && (
                  <button type="button" className="btn btn-small"
                    onClick={() => { window.BGNJ_BOOK_ORDERS.confirmPayment(o.id); refresh(); }}>
                    입금 확인 → 발송 준비
                  </button>
                )}
                {o.status === 'paid' && (
                  <>
                    <input
                      className="field-input"
                      placeholder="송장 번호 (선택)"
                      style={{padding:'6px 10px', maxWidth:200}}
                      value={trackingDraft[o.id] || ''}
                      onChange={(e) => setTrackingDraft({ ...trackingDraft, [o.id]: e.target.value })}/>
                    <button type="button" className="btn btn-small"
                      onClick={() => {
                        window.BGNJ_BOOK_ORDERS.markShipped(o.id, trackingDraft[o.id] || '');
                        refresh();
                      }}>
                      발송 처리
                    </button>
                    <button type="button" className="btn btn-small"
                      onClick={() => { window.BGNJ_BOOK_ORDERS.unconfirmPayment(o.id); refresh(); }}>
                      입금 확인 취소
                    </button>
                  </>
                )}
                {o.status === 'shipped' && (
                  <>
                    {o.tracking && <span className="mono dim-2" style={{fontSize:11}}>송장 {o.tracking}</span>}
                    <button type="button" className="btn btn-small"
                      onClick={() => { window.BGNJ_BOOK_ORDERS.markDelivered(o.id); refresh(); }}>
                      배송 완료 처리
                    </button>
                  </>
                )}
                {o.status === 'delivered' && o.tracking && (
                  <span className="mono dim-2" style={{fontSize:11}}>송장 {o.tracking} · 도착 {o.deliveredAt ? window.BGNJ_FMT.kstDate(o.deliveredAt) : ''}</span>
                )}
                {(o.status === 'pending_payment' || o.status === 'paid') && (
                  <button type="button" className="btn btn-small"
                    onClick={async () => {
                      if (!(await window.BGNJ_CONFIRM(`주문 ${o.orderNo}을(를) 취소 처리하시겠어요?`, { danger: true }))) return;
                      window.BGNJ_BOOK_ORDERS.cancelOrder(o.id);
                      refresh();
                    }}
                    style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:'auto'}}>
                    주문 취소
                  </button>
                )}
                {o.status === 'refund_requested' && (
                  <>
                    <div style={{width:'100%', paddingTop:8, borderTop:'1px solid var(--line)', marginTop:4}}>
                      <div style={{display:'flex', gap:6, alignItems:'center', marginBottom:6}}>
                        <span className="mono" style={{fontSize:10, color:'var(--warning)', letterSpacing:'0.2em'}}>REFUND REQUEST</span>
                        <span className="dim" style={{fontSize:12}}>사유: {o.refundReason || '(미입력)'}</span>
                      </div>
                      <div style={{display:'flex', gap:6, alignItems:'center', flexWrap:'wrap'}}>
                        <button type="button" className="btn btn-small"
                          onClick={async () => {
                            if (!(await window.BGNJ_CONFIRM(`환불을 승인하시겠어요? 주문 ${o.orderNo}이 취소됩니다.`, { danger: true }))) return;
                            window.BGNJ_BOOK_ORDERS.approveRefund(o.id);
                            refresh();
                          }}
                          style={{borderColor:'var(--primary)', color:'var(--secondary)'}}>
                          환불 승인
                        </button>
                        <input className="field-input"
                          placeholder="반려 사유 (선택)"
                          style={{padding:'5px 8px', fontSize:12, maxWidth:200}}
                          value={rejectNotes[o.id] || ''}
                          onChange={(e) => setRejectNotes({ ...rejectNotes, [o.id]: e.target.value })}/>
                        <button type="button" className="btn btn-small"
                          onClick={async () => {
                            if (!(await window.BGNJ_CONFIRM(`환불 신청을 반려하시겠어요?`, { danger: true }))) return;
                            window.BGNJ_BOOK_ORDERS.rejectRefund(o.id, rejectNotes[o.id] || '');
                            refresh();
                          }}
                          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>
                          환불 반려
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

// === Legal Documents Admin Panel (Privacy / Terms) ================
const LegalAdminPanel = () => {
  const [slug, setSlug] = React.useState('terms');
  const [tick, setTick] = React.useState(0);
  const [doc, setDoc] = React.useState({ title: '', body: '', updatedAt: null });
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [editorKey, setEditorKey] = React.useState(0);
  const [msg, setMsg] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  // 슬러그 전환 시 서버에서 최신 본문 fetch.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const fresh = await window.BGNJ_LEGAL.refresh(slug);
      if (cancelled) return;
      const d = fresh || { title: '', body: '' };
      setDoc(d);
      setTitle(d.title || (slug === 'terms' ? '이용약관' : slug === 'privacy' ? '개인정보 처리방침' : ''));
      setBody(d.body || '');
      setEditorKey((k) => k + 1);
      setMsg('');
    })();
    return () => { cancelled = true; };
  }, [slug, tick]);

  const save = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setMsg('⚠ 제목을 입력해 주세요.'); return; }
    setSaving(true);
    try {
      await window.BGNJ_LEGAL.save(slug, { title: title.trim(), body });
      setMsg('✓ 저장되었습니다. 사이트 푸터의 ' + (slug === 'terms' ? '이용약관' : '개인정보 처리방침') + ' 링크에 즉시 반영됩니다.');
      setTick((v) => v + 1);
      setTimeout(() => setMsg(''), 2400);
    } catch (err) {
      setMsg('✗ 저장 실패: ' + (err?.body?.error || err?.message || '알 수 없는 오류'));
    } finally {
      setSaving(false);
    }
  };

  const SLUG_LABEL = { terms: '이용약관', privacy: '개인정보 처리방침' };
  const SLUG_HINT = {
    terms: '회원가입 시 동의 체크박스 옆 "이용약관" 클릭 시 + 푸터 메뉴에서 노출됩니다.',
    privacy: '회원가입 시 "개인정보 처리방침" 클릭 시 + 푸터 메뉴에서 노출됩니다.',
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        <strong className="gold">이용약관</strong>·<strong className="gold">개인정보 처리방침</strong> 본문을 직접 편집합니다. 저장 즉시 회원가입 모달과 푸터 페이지에 반영됩니다.
      </p>

      <div role="tablist" aria-label="문서 분류" style={{display:'flex', gap:0, marginBottom:18, borderBottom:'1px solid var(--line)'}}>
        {window.BGNJ_LEGAL.listSlugs().map((s) => (
          <button key={s} type="button" role="tab" aria-selected={slug === s}
            onClick={() => setSlug(s)}
            style={{
              padding:'12px 22px', fontSize:14, letterSpacing:'0.05em',
              color: slug === s ? 'var(--primary)' : 'var(--ink-2)',
              borderBottom: slug === s ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom:-1, background:'none',
            }}>
            {SLUG_LABEL[s] || s}
          </button>
        ))}
      </div>

      <p className="dim-2" style={{fontSize:12, marginBottom:14, lineHeight:1.7, padding:'10px 12px', background:'var(--bg-2)', borderLeft:'3px solid var(--primary-dim)'}}>
        ⓘ {SLUG_HINT[slug] || ''}
      </p>

      <form onSubmit={save} className="card" style={{padding:20}}>
        <div className="field">
          <label className="field-label" htmlFor="legal-title">문서 제목</label>
          <input id="legal-title" className="field-input" value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={SLUG_LABEL[slug] || ''}/>
        </div>
        <div className="field">
          <label className="field-label">본문</label>
          <TiptapEditor key={editorKey} preset="column"
            content={doc.body || ''}
            onUpdate={(html) => setBody(html)}
            placeholder="문서 본문을 입력합니다. 이미지·링크·인용·목록을 지원합니다."/>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, gap:12, flexWrap:'wrap'}}>
          {doc.updatedAt ? (
            <div className="dim-2 mono" style={{fontSize:11}}>최근 수정 · {window.BGNJ_FMT.kstDateTime(doc.updatedAt)}</div>
          ) : (
            <div className="dim-2 mono" style={{fontSize:11}}>저장 이력 없음 — 처음 저장하시면 회원가입 모달과 푸터에 노출됩니다.</div>
          )}
        </div>
        {msg && (
          <div role="status" style={{
            fontSize:13, marginBottom:14, padding:'10px 14px',
            border: msg.startsWith('✗') || msg.startsWith('⚠') ? '1px solid var(--danger)' : '1px solid var(--primary-dim)',
            background: msg.startsWith('✗') || msg.startsWith('⚠') ? 'rgba(194,74,61,0.06)' : 'rgba(245,213,72,0.06)',
            color: msg.startsWith('✗') || msg.startsWith('⚠') ? 'var(--danger)' : 'var(--primary)',
          }}>{msg}</div>
        )}
        <div style={{display:'flex', gap:8, justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14}}>
          <button type="submit" className="btn btn-gold" disabled={saving} aria-busy={saving}>
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
};

// === FAQ Admin Panel ==============================================
const FaqAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [draft, setDraft] = React.useState({ question:'', answer:'', category:'일반' });
  const [error, setError] = React.useState('');
  const refresh = () => setTick((v) => v + 1);
  const faqs = React.useMemo(() => window.BGNJ_FAQ.listAll(), [tick]);

  const add = (e) => {
    e.preventDefault();
    setError('');
    const next = window.BGNJ_FAQ.add(draft);
    if (!next) { setError('질문과 답변은 필수입니다.'); return; }
    setDraft({ question:'', answer:'', category: draft.category || '일반' });
    refresh();
  };

  const update = (id, patch) => { window.BGNJ_FAQ.update(id, patch); refresh(); };
  const move = (id, dir) => { window.BGNJ_FAQ.reorder(id, dir); refresh(); };
  const remove = async (id) => {
    if (!(await window.BGNJ_CONFIRM('이 FAQ를 삭제하시겠어요?', { danger: true }))) return;
    window.BGNJ_FAQ.remove(id);
    refresh();
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        자주 묻는 질문(FAQ)을 추가·수정·정렬합니다. 푸터의 <strong className="gold">자주 묻는 질문</strong>에 카테고리별로 묶여 노출됩니다.
      </p>

      <article className="card" style={{padding:18, marginBottom:20}}>
        <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>NEW FAQ</div>
        <form onSubmit={add} style={{display:'grid', gap:10}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 200px', gap:10}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label">질문 <span className="gold" aria-hidden="true">*</span></label>
              <input className="field-input" value={draft.question}
                onChange={(e) => setDraft({ ...draft, question: e.target.value })}/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">카테고리</label>
              <input className="field-input" value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                placeholder="계정 / 결제 / 강연 / 답사 ..."/>
            </div>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label">답변 <span className="gold" aria-hidden="true">*</span></label>
            <textarea className="field-input" rows={3} value={draft.answer}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}/>
          </div>
          {error && <div role="alert" className="mono" style={{color:'var(--danger)', fontSize:11}}>{error}</div>}
          <div style={{display:'flex', justifyContent:'flex-end'}}>
            <button type="submit" className="btn btn-gold btn-small">＋ FAQ 추가</button>
          </div>
        </form>
      </article>

      {faqs.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>등록된 FAQ가 없습니다.</div>
      ) : (
        <div style={{display:'grid', gap:10}}>
          {faqs.map((f, i) => (
            <article key={f.id} className="card" style={{padding:16}}>
              <div style={{display:'flex', justifyContent:'space-between', gap:10, alignItems:'baseline', flexWrap:'wrap', marginBottom:8}}>
                <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em'}}>#{String(i+1).padStart(2,'0')} · {f.category || '일반'}</span>
                <div style={{display:'flex', gap:4, alignItems:'center'}}>
                  <button type="button" className="btn btn-small" onClick={() => move(f.id, -1)} disabled={i === 0}
                    style={{padding:'2px 6px', minHeight:0, fontSize:11}} aria-label="위로">▲</button>
                  <button type="button" className="btn btn-small" onClick={() => move(f.id, 1)} disabled={i === faqs.length - 1}
                    style={{padding:'2px 6px', minHeight:0, fontSize:11}} aria-label="아래로">▼</button>
                  <button type="button" className="btn btn-small" onClick={() => remove(f.id)}
                    style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:6}}>삭제</button>
                </div>
              </div>
              <div className="field" style={{marginBottom:8}}>
                <input className="field-input" value={f.question}
                  onChange={(e) => update(f.id, { question: e.target.value })} placeholder="질문"/>
              </div>
              <div className="field" style={{margin:0}}>
                <textarea className="field-input" rows={2} value={f.answer}
                  onChange={(e) => update(f.id, { answer: e.target.value })} placeholder="답변"/>
              </div>
              <div className="field" style={{margin:'8px 0 0', maxWidth:240}}>
                <input className="field-input" value={f.category || ''}
                  onChange={(e) => update(f.id, { category: e.target.value })} placeholder="카테고리"/>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};


const SiteContentAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [msg, setMsg] = React.useState('');

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 2000);
  };

  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    if (!file) { resolve(''); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // 섹션 단위 폼 — 입력 상태는 sc 변경 시 자동 초기화 (key prop으로 강제 remount).
  const SectionForm = ({ section, fields, onAfterSave }) => {
    const [draft, setDraft] = React.useState(() => ({ ...(sc[section] || {}) }));
    const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
    const save = (e) => {
      e.preventDefault();
      window.BGNJ_SITE_CONTENT.saveSection(section, draft);
      setTick((v) => v + 1);
      flash('저장되었습니다.');
      if (onAfterSave) onAfterSave();
    };
    const reset = async () => {
      if (!(await window.BGNJ_CONFIRM('이 섹션을 기본값으로 되돌릴까요?', { danger: true }))) return;
      window.BGNJ_SITE_CONTENT.resetSection(section);
      setTick((v) => v + 1);
      flash('기본값으로 복원되었습니다.');
    };
    return (
      <form onSubmit={save} className="card" style={{padding:20, marginBottom:20}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14}}>
          {fields.map((f) => (
            <div key={f.key} className="field" style={{gridColumn: f.full ? '1 / -1' : 'auto'}}>
              <label className="field-label" htmlFor={`sc-${section}-${f.key}`}>{f.label}</label>
              {f.multiline ? (
                <textarea id={`sc-${section}-${f.key}`} className="field-input" rows={3}
                  value={draft[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}/>
              ) : (
                <input id={`sc-${section}-${f.key}`} className="field-input"
                  value={draft[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}/>
              )}
            </div>
          ))}
        </div>
        <div style={{display:'flex', gap:8, justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14, marginTop:14}}>
          <button type="button" className="btn btn-small" onClick={reset}>기본값 복원</button>
          <button type="submit" className="btn btn-gold">저장</button>
        </div>
      </form>
    );
  };

  const ImageUploader = ({ section, field, label, hint, previewSize = 56, accept = 'image/*', folder }) => {
    const current = sc[section]?.[field] || '';
    // v00.185 — pickImageWithR2Fallback 헬퍼로 통합. 25 lines → 6 lines.
    const onPick = async (e) => {
      const r2Folder = folder || section;
      const result = await pickImageWithR2Fallback(e, { folder: r2Folder });
      if (result) {
        window.BGNJ_SITE_CONTENT.saveSection(section, { [field]: result });
        setTick((v) => v + 1);
        flash(`${label} 업로드 완료`);
      }
    };
    const clear = async () => {
      if (!(await window.BGNJ_CONFIRM(`${label}을(를) 비울까요? (기본 마크로 되돌아갑니다)`, { danger: true }))) return;
      window.BGNJ_SITE_CONTENT.saveSection(section, { [field]: '' });
      setTick((v) => v + 1);
      flash(`${label} 제거됨`);
    };
    return (
      <div className="card" style={{padding:16, display:'flex', gap:14, alignItems:'center', marginBottom:12}}>
        <div style={{
          width:previewSize, height:previewSize, flexShrink:0,
          border:'1px solid var(--line)', background:'var(--bg-2)',
          display:'grid', placeItems:'center', overflow:'hidden',
        }}>
          {current
            ? <img src={current} alt="" style={{maxWidth:'100%', maxHeight:'100%', objectFit:'contain'}}/>
            : <span className="dim-2 mono" style={{fontSize:9, letterSpacing:'0.18em'}}>NONE</span>}
        </div>
        <div style={{flex:1}}>
          <div className="ko-serif" style={{fontSize:14, marginBottom:4}}>{label}</div>
          {hint && <div className="dim-2" style={{fontSize:11, lineHeight:1.5}}>{hint}</div>}
        </div>
        <div style={{display:'flex', gap:8}}>
          <label className="btn btn-small" style={{cursor:'pointer'}}>
            업로드
            <input type="file" accept={accept} onChange={onPick} style={{display:'none'}}/>
          </label>
          {current && (
            <button type="button" className="btn btn-small" onClick={clear}
              style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        홈페이지 내비게이션 라벨, 히어로/푸터 텍스트, 브랜드명, 로고·파비콘, OG 메타를 직접 편집합니다.
        섹션별로 저장되며 저장 즉시 사이트에 반영됩니다.
      </p>
      {msg && (
        <div role="status" className="mono gold" style={{fontSize:12, marginBottom:14, padding:'8px 12px', border:'1px solid var(--primary-dim)', background:'rgba(59,130,246,0.06)'}}>
          {msg}
        </div>
      )}

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>메뉴 라벨</h3>
      <SectionForm key={`nav-${tick}`} section="nav" fields={[
        { key: 'home', label: '홈' },
        { key: 'community', label: '커뮤니티' },
        { key: 'lectures', label: '강연' },
        { key: 'tour', label: '투어 프로그램' },
        { key: 'column', label: '뱅기노자 칼럼' },
        { key: 'book', label: '뱅기노자 도서' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>브랜드</h3>
      <SectionForm key={`brand-${tick}`} section="brand" fields={[
        { key: 'name', label: '브랜드 이름 (한글)' },
        { key: 'sub', label: '브랜드 영문' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>히어로(메인 상단)</h3>
      <SectionForm key={`hero-${tick}`} section="hero" fields={[
        { key: 'eyebrow', label: '아이브로우 (상단 작은 텍스트)', full: true },
        { key: 'title1', label: '큰 제목 1줄' },
        { key: 'title2', label: '큰 제목 2줄 (강조 색)' },
        { key: 'title3', label: '큰 제목 3줄' },
        { key: 'subtitle', label: '본문 설명', full: true, multiline: true },
        { key: 'ctaPrimary', label: 'CTA 버튼 (주요)' },
        { key: 'ctaSecondary', label: 'CTA 버튼 (보조)' },
        { key: 'mapHint', label: '지도 안내 문구', full: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>푸터 — 소개·서명·헤딩·카피라이트</h3>
      <SectionForm key={`footer-${tick}`} section="footer" fields={[
        { key: 'description',    label: '소개 문단', full: true, multiline: true },
        { key: 'signature',      label: '하단 서명 (예: 뱅기타고 노자 · DESIGNED IN SEOUL)', full: true },
        { key: 'copyright',      label: '카피라이트 (© 라인)', full: true },
        { key: 'headingContent', label: '콘텐츠 섹션 헤딩 (기본: 콘텐츠)' },
        { key: 'headingInfo',    label: '정보 섹션 헤딩 (기본: 정보)' },
        { key: 'headingContact', label: '연락 섹션 헤딩 (기본: 연락)' },
      ]}/>

      <FooterStyleEditor/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>푸터 — 연락 + 사업자 정보</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        푸터의 '연락' 섹션 + 사업자 정보 블록에 노출됩니다. 비우면 해당 줄이 표시되지 않습니다.
        v00.144 부터 전화번호는 푸터에서 제거되고 사업자등록번호 등이 노출됩니다.
      </p>
      <SectionForm key={`contact-${tick}`} section="contact" fields={[
        { key: 'email',       label: '이메일' },
        { key: 'address',     label: '주소', full: true },
        { key: 'companyName', label: '회사명 (법인명)' },
        { key: 'ceo',         label: '대표자' },
        { key: 'bizRegNo',    label: '사업자등록번호 (예: 551-86-02188)' },
        { key: 'corpRegNo',   label: '법인등록번호 (예: 110111-7817690)' },
        { key: 'founded',     label: '개업 / 설립일 (예: 2021-04-01)' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>로고 · 파비콘</h3>
      <ImageUploader section="branding" field="logoDataUri" label="헤더 로고"
        hint="22x22px 표시. PNG/SVG 권장 · 1.5MB 이하."/>
      <ImageUploader section="branding" field="faviconDataUri" label="파비콘"
        hint="32x32 또는 64x64 PNG 권장 · 저장 즉시 브라우저 탭 아이콘이 갱신됩니다."
        previewSize={40} accept="image/png,image/x-icon,image/svg+xml"/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>로그인 / 회원가입 좌측 영역</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        로그인·회원가입 페이지 왼쪽에 노출되는 이미지와 문구입니다. 이미지를 업로드하면 그라데이션 배경 대신 이미지가 사용됩니다.
      </p>
      <SectionForm key={`auth-${tick}`} section="auth" fields={[
        { key: 'eyebrow', label: '윗쪽 작은 라벨 (대문자 권장)' },
        { key: 'title', label: '메인 제목 (줄바꿈 가능)', full: true, multiline: true },
        { key: 'description', label: '소개 문단', full: true, multiline: true },
      ]}/>
      <ImageUploader section="auth" field="imageDataUri" label="좌측 배경 이미지"
        hint="1200x1600 또는 1080x1920 권장 · JPG/PNG · 비우면 기본 그라데이션 배경 사용. 1.5MB 이하."
        previewSize={120}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>투어 페이지 — 상단 인트로</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        <code>/tour</code> 페이지의 답사 리스트 위쪽 hero 섹션. 비우면 코드 default 사용.
      </p>
      <SectionForm key={`tourIntro-${tick}`} section="tourIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: TOUR · 답사)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분 (예: 발로 읽는 )' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 조선)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>투어 페이지 — 후기 안내 문구</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        답사 상세 페이지의 후기 섹션 안내 카드 문구. 비우면 코드 default.
      </p>
      <SectionForm key={`tourReviewsGate-${tick}`} section="tourReviewsGate" fields={[
        { key: 'gate',      label: '미참가 회원 안내 (참가 확정 회원만 작성 가능 안내)', full: true, multiline: true },
        { key: 'anonymous', label: '비로그인 안내 (로그인 후 작성 가능 안내)', full: true, multiline: true },
        { key: 'empty',     label: '후기가 0건일 때 안내', full: true, multiline: true },
      ]}/>

      {/* v00.073 — 전 페이지 hero/intro 일괄 편집 */}
      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>강연 페이지 — 상단 인트로</h3>
      <SectionForm key={`lectureIntro-${tick}`} section="lectureIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: LECTURE · 왕사남 강연)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분 (예: 왕사남 )' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 강연 일정)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      {/* v00.075 — 강연 후기 게이팅 + 글로벌 진행/참고 */}
      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>강연 페이지 — 후기 안내 문구</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        강연 상세 페이지의 후기 섹션 안내 카드 문구. 비우면 코드 default.
      </p>
      <SectionForm key={`lectureReviewsGate-${tick}`} section="lectureReviewsGate" fields={[
        { key: 'gate',      label: '미참가 회원 안내', full: true, multiline: true },
        { key: 'anonymous', label: '비로그인 안내', full: true, multiline: true },
        { key: 'empty',     label: '후기가 0건일 때 안내', full: true, multiline: true },
      ]}/>
      <p className="dim-2" style={{fontSize:12, marginBottom:6, marginTop:14, lineHeight:1.7}}>
        ※ 강연별 진행 일정 / 참고 / 커버 + 글로벌 default + 템플릿은 <strong>운영설정 → 강연 페이지 (v00.083)</strong> 에서 GUI 편집.
      </p>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>홈 페이지 — 추천 여행지 섹션 헤딩</h3>
      <SectionForm key={`recommendationsHeading-${tick}`} section="recommendationsHeading" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: RECOMMENDATIONS · 뱅기노자 추천)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분 (예: 뱅기노자가 )' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 추천)' },
        { key: 'titleSuffix', label: '큰 제목 뒷부분 (예: 합니다)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>커뮤니티 페이지 — 상단 인트로</h3>
      <SectionForm key={`communityIntro-${tick}`} section="communityIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: COMMUNITY · 커뮤니티)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분 (예: 다섯 봉우리 )' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 광장)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>칼럼 페이지 — 상단 인트로</h3>
      <SectionForm key={`columnIntro-${tick}`} section="columnIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 뱅기노자)' },
        { key: 'titleSuffix', label: '큰 제목 뒷부분 (예: 가 쓰다)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>FAQ 페이지 — 상단 인트로</h3>
      <SectionForm key={`faqIntro-${tick}`} section="faqIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 자주 묻는)' },
        { key: 'titleSuffix', label: '큰 제목 뒷부분 (예:  질문)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>주문/결제 페이지 — 상단 인트로</h3>
      <SectionForm key={`bookCheckoutIntro-${tick}`} section="bookCheckoutIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: CHECKOUT · 결제)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분 (예: 주문 / )' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 결제)' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>마이페이지 — 상단 인트로</h3>
      <p className="dim-2" style={{fontSize:11, marginBottom:8, lineHeight:1.7}}>
        강조어에 <code>{'{name}'}</code> 토큰을 쓰면 사용자 이름으로 치환됩니다 (예: 홍길동 님의 서재).
      </p>
      <SectionForm key={`myPageIntro-${tick}`} section="myPageIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: MY PAGE · 회원 정보)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: {name})' },
        { key: 'titleSuffix', label: '큰 제목 뒷부분 (예:  님의 서재)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>먹고 놀자 (/eat) 페이지</h3>
      <SectionForm key={`eatIntro-${tick}`} section="eatIntro" fields={[
        { key: 'eyebrow', label: '아이브로우', full: true },
        { key: 'title',   label: '큰 제목 (예: 먹고 놀자)' },
        { key: 'sub',     label: '제목 우측 작은 부제 (예: 한국의 맛, 한 끼의 인문학)' },
        { key: 'desc',    label: '본문 설명', full: true, multiline: true },
        { key: 'accent',  label: '부제 강조 색상 (HEX, 예: #E8A540)' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>자고 놀자 (/sleep) 페이지</h3>
      <SectionForm key={`sleepIntro-${tick}`} section="sleepIntro" fields={[
        { key: 'eyebrow', label: '아이브로우', full: true },
        { key: 'title',   label: '큰 제목' },
        { key: 'sub',     label: '제목 우측 작은 부제' },
        { key: 'desc',    label: '본문 설명', full: true, multiline: true },
        { key: 'accent',  label: '부제 강조 색상 (HEX)' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>사고 놀자 (/shop) 페이지</h3>
      <SectionForm key={`shopIntro-${tick}`} section="shopIntro" fields={[
        { key: 'eyebrow', label: '아이브로우', full: true },
        { key: 'title',   label: '큰 제목' },
        { key: 'sub',     label: '제목 우측 작은 부제' },
        { key: 'desc',    label: '본문 설명', full: true, multiline: true },
        { key: 'accent',  label: '부제 강조 색상 (HEX)' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>OG 메타 (공유 미리보기)</h3>
      <SectionForm key={`og-${tick}`} section="og" fields={[
        { key: 'title', label: 'OG 제목', full: true },
        { key: 'description', label: 'OG 설명', full: true, multiline: true },
      ]}/>
      <ImageUploader section="og" field="imageDataUri" label="OG 이미지"
        hint="1200x630 PNG/JPG 권장 · 카카오톡/페이스북/X 공유 시 미리보기에 사용. 1.5MB 이하."
        previewSize={80}/>

      {/* OG 라이브 미리보기 + 플랫폼 호환성 (v00.060) */}
      <OgPreviewBlock sc={sc}/>
    </div>
  );
};

// === OG 라이브 미리보기 (v00.060) =========================================
// 현재 og:image 의 실제 렌더 + 카카오톡/페이스북/Discord 공유 카드 시뮬레이션 + 플랫폼 호환성 표.
// 관리자가 업로드한 imageDataUri 가 있으면 그것을, 없으면 index.html 의 fallback SVG meta 값을 사용.
const OgPreviewBlock = ({ sc }) => {
  const og = sc.og || {};
  const title = og.title || '뱅기노자 — 뱅기 타고 한국을 느끼다';
  const description = og.description || '뱅기노자 — 뱅기 타고 한국을 느끼다. 궁궐 답사부터 지역 여행까지, 한국의 역사·문화·자연을 함께 여행하는 커뮤니티.';
  const imageSrc = og.imageDataUri || (typeof document !== 'undefined' ? document.querySelector('meta[property="og:image"]')?.getAttribute('content') : '') || '';
  const isUserUpload = !!og.imageDataUri;
  const isSvg = (imageSrc || '').startsWith('data:image/svg');
  return (
    <div style={{marginTop:20}}>
      <h4 className="ko-serif" style={{fontSize:15, marginBottom:8}}>현재 OG 이미지 — 라이브 미리보기</h4>
      <p className="dim-2" style={{fontSize:11, marginBottom:10, lineHeight:1.6}}>
        {isUserUpload
          ? '✓ 관리자가 업로드한 이미지가 적용되고 있습니다.'
          : 'ⓘ 업로드된 이미지가 없어 브랜드 fallback SVG 가 사용됩니다. SVG 는 Twitter/Discord 에서만 인식 — Facebook/Kakao 공유 시 미리보기가 비어 보입니다. PNG 업로드 권장.'}
      </p>
      <div className="card" style={{padding:0, overflow:'hidden', maxWidth:520, marginBottom:18}}>
        {imageSrc ? (
          <img src={imageSrc} alt="현재 og:image"
            style={{width:'100%', display:'block', aspectRatio:'1200/630', objectFit:'cover', background:'var(--bg-2)'}}/>
        ) : (
          <div style={{aspectRatio:'1200/630', display:'grid', placeItems:'center', background:'var(--bg-3)', color:'var(--ink-3)', fontSize:13}}>
            og:image 미설정
          </div>
        )}
        <div style={{padding:'12px 14px'}}>
          <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.18em', marginBottom:4}}>BGNJ.NET</div>
          <div className="ko-serif" style={{fontSize:15, fontWeight:600, color:'var(--ink)', marginBottom:4, lineHeight:1.3}}>{title}</div>
          <div className="dim-2" style={{fontSize:12, lineHeight:1.5, color:'var(--ink-2)'}}>{description}</div>
        </div>
      </div>

      <h4 className="ko-serif" style={{fontSize:15, marginBottom:8}}>플랫폼 호환성</h4>
      <div style={{overflowX:'auto', marginBottom:14}}>
        <table style={{width:'100%', minWidth:480, borderCollapse:'collapse', fontSize:12}}>
          <thead>
            <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.18em', color:'var(--ink-3)'}}>
              <th scope="col" style={{padding:10, textAlign:'left'}}>플랫폼</th>
              <th scope="col" style={{padding:10, textAlign:'left'}}>SVG dataURI</th>
              <th scope="col" style={{padding:10, textAlign:'left'}}>PNG/JPG dataURI</th>
              <th scope="col" style={{padding:10, textAlign:'left'}}>현재 상태</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Twitter / X',     svg: '✓',  png: '✓', current: isSvg ? '✓' : (isUserUpload ? '✓' : '✗') },
              { name: 'Discord',          svg: '✓',  png: '✓', current: isSvg ? '✓' : (isUserUpload ? '✓' : '✗') },
              { name: 'Slack',            svg: '△', png: '✓', current: isUserUpload ? '✓' : '△' },
              { name: 'Facebook',         svg: '✗', png: '✓', current: isSvg ? '✗' : (isUserUpload ? '✓' : '✗') },
              { name: 'KakaoTalk',        svg: '✗', png: '✓', current: isSvg ? '✗' : (isUserUpload ? '✓' : '✗') },
              { name: 'LinkedIn',         svg: '✗', png: '✓', current: isSvg ? '✗' : (isUserUpload ? '✓' : '✗') },
            ].map((p) => (
              <tr key={p.name} style={{borderBottom:'1px solid var(--line)'}}>
                <td style={{padding:10, color:'var(--ink)', fontWeight:500}}>{p.name}</td>
                <td className="mono" style={{padding:10, fontSize:13, color: p.svg === '✓' ? 'var(--success)' : p.svg === '△' ? 'var(--warning)' : 'var(--ink-3)'}}>{p.svg}</td>
                <td className="mono" style={{padding:10, fontSize:13, color: p.png === '✓' ? 'var(--success)' : 'var(--ink-3)'}}>{p.png}</td>
                <td className="mono" style={{padding:10, fontSize:13, color: p.current === '✓' ? 'var(--success)' : p.current === '△' ? 'var(--warning)' : 'var(--danger)', fontWeight:600}}>{p.current}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="dim-2" style={{fontSize:11, lineHeight:1.6}}>
        ⓘ <strong>전 플랫폼 커버 권장:</strong> 1200×630 PNG/JPG 를 업로드하면 SVG fallback 을 덮어쓰고 Facebook/Kakao 등에서도 미리보기가 표시됩니다.
      </p>
    </div>
  );
};

// === Books Admin Panel ============================================
// 다양한 책 콘텐츠 관리 — 메타/표지/PDF 미리보기/소개/목차/저자/리뷰.
const BooksAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  // v00.193 — 새 책 추가 prompt 제거. 사용자 보고 '그냥 새 책 만들어주고 저장 누르면 반영'.
  // newDraft 가 있으면 books 목록 맨 위에 표시 (id='__new__'), 선택 시 editing 으로 ed전. commit 시 BGNJ_BOOKS.create.
  const [newDraft, setNewDraft] = React.useState(null);
  const realBooks = React.useMemo(() => window.BGNJ_BOOKS.list(), [tick]);
  const books = React.useMemo(
    () => newDraft ? [newDraft, ...realBooks.filter((b) => b.id !== '__new__')] : realBooks,
    [realBooks, newDraft]
  );
  const [selectedId, setSelectedId] = React.useState(realBooks[0]?.id || null);
  const selected = React.useMemo(() => {
    if (selectedId === '__new__' && newDraft) return newDraft;
    return window.BGNJ_BOOKS.get(selectedId);
  }, [selectedId, tick, newDraft]);
  const [editTab, setEditTab] = React.useState('meta');
  const [msg, setMsg] = React.useState('');
  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2000); };
  const refresh = () => setTick((v) => v + 1);
  // v00.148 — 🚨 HOTFIX 책 데이터 안 보임 root cause:
  // boot.jsx 가 BGNJ_BOOKS.refresh() 를 admin:false 로 호출 (published 만 fetch).
  // 그 결과 draft / coming_soon 책은 admin 뷰에서 안 보임 → 사용자 '책 데이터가 모두 날아갔는데?'.
  // 이 패널 마운트 시 admin:true 로 강제 재fetch + 첫 책 자동 선택.
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await window.BGNJ_BOOKS.refresh({ admin: true });
      } catch {}
      if (!cancelled) {
        setLoading(false);
        setTick((v) => v + 1);
        const fresh = window.BGNJ_BOOKS.list();
        if (!selectedId && fresh.length > 0) setSelectedId(fresh[0].id);
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // v00.147 — 자동 저장 → 명시적 저장 버튼. 한글 IME 문제 + 사용자 요청 '저장 버튼 누르면 저장 반영'.
  // 모든 텍스트 입력은 local state(editing) 에만 반영, [💾 저장] 클릭 시 일괄 PATCH.
  const [editing, setEditing] = React.useState(null);    // 책 객체 카피
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [uploadingCover, setUploadingCover] = React.useState(false);
  const [uploadingPdf, setUploadingPdf] = React.useState(false);

  // selected 가 바뀌면 editing 을 새 책으로 동기화 (단, dirty 미저장 변경 있으면 confirm).
  React.useEffect(() => {
    if (!selected) { setEditing(null); setDirty(false); return; }
    if (dirty && editing && editing.id !== selected.id) {
      // useEffect 콜백 내 async — IIFE 패턴 사용
      (async () => {
        const ok = await window.BGNJ_CONFIRM('저장하지 않은 변경 사항이 있습니다. 그래도 다른 책으로 이동할까요?', { danger: true });
        if (!ok) {
          if (editing.id) setSelectedId(editing.id);
          return;
        }
        setEditing({ ...selected });
        setDirty(false);
      })();
      return;
    }
    setEditing({ ...selected });
    setDirty(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, tick]);

  const setField = (key, val) => {
    setEditing((cur) => cur ? { ...cur, [key]: val } : cur);
    setDirty(true);
  };
  // 즉시 저장 (cover/pdf 업로드 + primary toggle 등 즉시 반영해야 하는 액션) — local 도 같이 동기화.
  const patchImmediate = (changes) => {
    if (!selectedId) return;
    window.BGNJ_BOOKS.update(selectedId, changes);
    setEditing((cur) => cur ? { ...cur, ...changes } : cur);
    refresh();
  };
  const commit = async () => {
    if (!editing || saving) return;
    // v00.193 — 새 draft 는 dirty 무관 commit 허용 (사용자가 제목만 입력하고 바로 저장 가능).
    if (!editing._isNew && !dirty) return;
    setSaving(true);
    try {
      // v00.193 — 새 draft 면 BGNJ_BOOKS.create 호출. 그 외엔 update.
      if (editing._isNew) {
        if (!editing.title?.trim()) {
          flash('✗ 제목은 필수입니다.');
          setSaving(false);
          return;
        }
        const { _isNew, id: _droppedId, ...payload } = editing;
        const created = await window.BGNJ_BOOKS.create(payload);
        if (!created?.id) throw new Error('서버 응답에 id 없음');
        try { window.BGNJ_BROADCAST?.publish?.('books'); } catch {}
        setNewDraft(null);
        setSelectedId(created.id);
        setDirty(false);
        flash('✓ 새 책 저장 완료');
        refresh();
        return;
      }
      // 기존 책 — 변경된 필드만 추려 patch.
      const changes = {};
      Object.keys(editing).forEach((k) => {
        if (selected && JSON.stringify(editing[k]) !== JSON.stringify(selected[k])) {
          changes[k] = editing[k];
        }
      });
      if (Object.keys(changes).length === 0) { setDirty(false); flash('변경 없음'); return; }
      await window.BGNJ_BOOKS.update(selectedId, changes);
      try { window.BGNJ_BROADCAST?.publish?.('books'); } catch {}
      setDirty(false);
      flash(`✓ 저장 완료 (${Object.keys(changes).length}개 필드)`);
      refresh();
    } catch (err) {
      flash('✗ 저장 실패: ' + (err?.message || '알 수 없는 오류'));
    } finally { setSaving(false); }
  };

  // v00.193 — 새 책 draft 취소.
  const cancelDraft = async () => {
    if (dirty && !(await window.BGNJ_CONFIRM('작성 중인 새 책을 취소할까요?', { danger: true }))) return;
    setNewDraft(null);
    setDirty(false);
    const fallback = realBooks[0]?.id || null;
    setSelectedId(fallback);
  };

  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    if (!file) { resolve(''); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // v00.193 — 사용자 보고 '새 책 prompt 제거 + 임시 draft 생성 → 저장 시 D1 반영'.
  // 이전엔 prompt 로 제목 받고 즉시 D1 create. 이제는 클라이언트에 _newDraft 만 만들고 D1 안 함.
  // 사용자가 우측 form 에서 편집 후 [💾 저장] 누르면 commit() 분기에서 BGNJ_BOOKS.create 호출.
  const addBook = () => {
    if (newDraft) {
      // 이미 진행 중인 임시 draft 가 있으면 selected 만 다시.
      setSelectedId('__new__');
      setEditTab('meta');
      return;
    }
    setNewDraft({
      id: '__new__',
      title: '', subtitle: '', author: '뱅기노자', publisher: '',
      pages: 0, isbn: '', priceKR: 0, priceEN: 0,
      desc: '', intro: '', authorBio: '',
      status: 'draft', publishedAt: '',
      coverDataUri: '', pdfPreviewDataUri: '',
      chapters: [], reviews: [],
      _isNew: true,
    });
    setSelectedId('__new__');
    setEditTab('meta');
  };

  const removeBook = async (id) => {
    const target = window.BGNJ_BOOKS.get(id);
    if (!target) return;
    if (!(await window.BGNJ_CONFIRM(`"${target.title}" 책을 삭제할까요? (되돌릴 수 없음)`, { danger: true }))) return;
    try {
      await window.BGNJ_BOOKS.remove(id);
      try { window.BGNJ_BROADCAST?.publish?.('books'); } catch {}
      refresh();
      if (selectedId === id) {
        const remaining = window.BGNJ_BOOKS.list();
        setSelectedId(remaining[0]?.id || null);
      }
    } catch (err) {
      window.BGNJ_TOAST.error('책 삭제 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  const patch = (changes) => {
    if (!selectedId) return;
    window.BGNJ_BOOKS.update(selectedId, changes);
    refresh();
  };

  // v00.084 — R2 우선 (5MB 표지 / 20MB PDF) + dataURI 폴백 (1.5MB / 3MB). v00.147 busy state + 즉시 patch.
  // v00.185 — pickImageWithR2Fallback 헬퍼로 통합. 25 lines × 2 → 8 lines × 2.
  const onUploadCover = async (e) => {
    setUploadingCover(true);
    flash('표지 업로드 중…');
    try {
      const result = await pickImageWithR2Fallback(e, { folder: 'book-covers' });
      if (result) { patchImmediate({ coverDataUri: result }); flash('✓ 표지 업로드 완료'); }
    } finally { setUploadingCover(false); }
  };

  const onUploadPdf = async (e) => {
    setUploadingPdf(true);
    flash('PDF 업로드 중…');
    try {
      const result = await pickImageWithR2Fallback(e, { folder: 'book-pdfs', maxBytes: 20 * 1024 * 1024, fallbackMaxBytes: 3 * 1024 * 1024 });
      if (result) { patchImmediate({ pdfPreviewDataUri: result }); flash('✓ PDF 미리보기 업로드 완료'); }
    } finally { setUploadingPdf(false); }
  };

  const tabs = [
    { id: 'meta', label: '메타·가격' },
    { id: 'media', label: '표지 · PDF' },
    { id: 'intro', label: '소개' },
    { id: 'toc', label: '목차' },
    { id: 'author', label: '저자' },
    { id: 'reviews', label: `리뷰 ${(selected?.reviews || []).length || ''}`.trim() },
  ];

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        뱅기노자가 출간한 책들을 관리합니다. 각 책은 표지(PNG)와 본문 미리보기(PDF)를 가질 수 있고,
        소개·목차·저자·리뷰 콘텐츠를 독립적으로 편집합니다.
      </p>
      {loading && (
        <div role="status" style={{fontSize:13, marginBottom:14, padding:'10px 14px', border:'1px solid var(--line)', background:'var(--bg-2)'}}>
          ⏳ 서버에서 책 목록을 불러오는 중…
        </div>
      )}
      {!loading && books.length === 0 && (
        <div role="status" style={{fontSize:13, marginBottom:14, padding:'10px 14px', border:'1px solid var(--primary-dim)', background:'rgba(245,213,72,0.06)', color:'var(--ink)'}}>
          ⓘ 등록된 책이 없습니다. 우측 상단 [＋ 새 책] 으로 추가하거나, 아래 [다시 불러오기] 로 새로고침하세요.
        </div>
      )}
      {msg && (
        <div role="status" className="mono gold" style={{fontSize:12, marginBottom:14, padding:'8px 12px', border:'1px solid var(--primary-dim)', background:'rgba(59,130,246,0.06)'}}>
          {msg}
        </div>
      )}
      <div style={{marginBottom:12}}>
        <button type="button" className="btn btn-small" onClick={async () => {
          setLoading(true);
          try { await window.BGNJ_BOOKS.refresh({ admin: true }); } catch {}
          setLoading(false);
          refresh();
          flash('✓ 다시 불러오기 완료 — ' + window.BGNJ_BOOKS.list().length + '권');
        }}>🔄 다시 불러오기</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:20, alignItems:'start'}}>
        {/* 좌측: 책 목록 */}
        <aside aria-label="책 목록" style={{border:'1px solid var(--line)'}}>
          <div style={{padding:'10px 14px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em'}}>BOOKS · {books.length}</span>
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {books.length === 0 && (
                <button type="button" className="btn btn-small" onClick={async () => {
                  if (!(await window.BGNJ_CONFIRM('샘플 책 2권을 추가합니다. 진행할까요?', { danger: true }))) return;
                  const samples = [
                    { title: '왕의 길 — 조선 왕실의 일상', subtitle: '경복궁의 사계와 의례', author: '뱅기노자', publisher: '뱅기노자 출판부', priceKR: 18000, status: 'published', desc: '조선 왕실의 일상과 의례를 따라 걷는 인문학 산책.' },
                    { title: '문(門)을 읽다', subtitle: '궁궐 문에 새겨진 인문학', author: '뱅기노자', publisher: '뱅기노자 출판부', priceKR: 22000, status: 'published', desc: '광화문에서 신무문까지, 문에 담긴 의미를 해독합니다.' },
                  ];
                  for (const s of samples) await window.BGNJ_BOOKS.create(s);
                  refresh();
                }}>샘플 데이터 추가</button>
              )}
              <button type="button" className="btn btn-small btn-gold" onClick={addBook} disabled={!!newDraft}
                title={newDraft ? '작성 중인 새 책이 있습니다 — 우측에서 저장하거나 취소' : ''}
                style={newDraft ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}>
                {newDraft ? '＋ 새 책 (작성 중)' : '＋ 새 책'}
              </button>
            </div>
          </div>
          {/* v00.131 — 인라인 mini-form 제거 (addBook 이 즉시 생성 + 편집 패널 오픈). */}
          {books.length === 0 ? (
            <div className="dim" style={{padding:20, fontSize:13}}>등록된 책이 없습니다.</div>
          ) : (
            <ul role="list" style={{listStyle:'none', margin:0, padding:0}}>
              {books.map((b, i) => {
                const isDraft = b._isNew || b.id === '__new__';
                // v00.193 — 새 책 draft 는 ▲▼ 정렬 대상 아님. realBooks 인덱스로 정렬 비활성 판단.
                const realIdx = isDraft ? -1 : realBooks.findIndex((x) => x.id === b.id);
                return (
                <li key={b.id} style={{
                  borderBottom:'1px solid var(--line)',
                  display:'flex', alignItems:'stretch',
                  background: isDraft ? 'rgba(245,213,72,0.06)' : 'transparent',
                  borderLeft: isDraft ? '3px solid var(--primary)' : '3px solid transparent',
                }}>
                  <button type="button"
                    onClick={() => { setSelectedId(b.id); setEditTab('meta'); }}
                    aria-current={selectedId === b.id ? 'true' : undefined}
                    style={{
                      flex:1, textAlign:'left', padding:'12px 8px 12px 14px',
                      background: selectedId === b.id ? 'rgba(59,130,246,0.06)' : 'transparent',
                      border:'none', cursor:'pointer', display:'flex', gap:10, alignItems:'center',
                    }}>
                    <span style={{
                      width:32, height:42, flexShrink:0,
                      border:'1px solid var(--line)', background:'var(--bg-2)',
                      display:'grid', placeItems:'center', overflow:'hidden',
                    }}>
                      {b.coverDataUri
                        ? <img src={b.coverDataUri} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                        : <span className="dim-2 mono" style={{fontSize:8}}>NO COVER</span>}
                    </span>
                    <span style={{flex:1, minWidth:0}}>
                      <span className="ko-serif" style={{fontSize:13, color:'var(--ink)', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                        {isDraft ? (b.title?.trim() || '(제목 없음)') : b.title}
                      </span>
                      <span className="mono dim-2" style={{fontSize:9, letterSpacing:'0.12em', color: isDraft ? 'var(--primary)' : undefined}}>
                        {isDraft
                          ? '● 새 책 (미저장)'
                          : (b.status === 'published' ? '출간' : b.status === 'coming_soon' ? '출간 예정' : '초안')}
                        {!isDraft && b.primary ? ' · 대표' : ''}
                      </span>
                    </span>
                  </button>
                  {/* v00.171 — 책 순서 변경. v00.193 — bordered 그룹으로 시각적 misalign 해결 + draft 는 정렬 비활성. */}
                  <div style={{
                    display:'flex', flexDirection:'column',
                    margin:'8px 6px', alignSelf:'center',
                    border:'1px solid var(--line)',
                    borderRadius:3, overflow:'hidden',
                    visibility: isDraft ? 'hidden' : 'visible',
                  }}>
                    <button type="button" aria-label={`${b.title} 위로`} title="위로 이동"
                      disabled={isDraft || realIdx <= 0}
                      onClick={async () => {
                        const ids = realBooks.map((x) => x.id);
                        [ids[realIdx-1], ids[realIdx]] = [ids[realIdx], ids[realIdx-1]];
                        try { await window.BGNJ_BOOKS.reorder(ids); refresh(); } catch (err) { window.BGNJ_TOAST.error('순서 변경 실패: ' + (err?.message || '')); }
                      }}
                      style={{
                        background:'transparent', border:'none', borderBottom:'1px solid var(--line)',
                        padding:'3px 8px', fontSize:10, lineHeight:1,
                        cursor: realIdx <= 0 ? 'not-allowed' : 'pointer',
                        opacity: realIdx <= 0 ? 0.3 : 1,
                      }}>▲</button>
                    <button type="button" aria-label={`${b.title} 아래로`} title="아래로 이동"
                      disabled={isDraft || realIdx < 0 || realIdx >= realBooks.length - 1}
                      onClick={async () => {
                        const ids = realBooks.map((x) => x.id);
                        [ids[realIdx], ids[realIdx+1]] = [ids[realIdx+1], ids[realIdx]];
                        try { await window.BGNJ_BOOKS.reorder(ids); refresh(); } catch (err) { window.BGNJ_TOAST.error('순서 변경 실패: ' + (err?.message || '')); }
                      }}
                      style={{
                        background:'transparent', border:'none',
                        padding:'3px 8px', fontSize:10, lineHeight:1,
                        cursor: (realIdx < 0 || realIdx >= realBooks.length - 1) ? 'not-allowed' : 'pointer',
                        opacity: (realIdx < 0 || realIdx >= realBooks.length - 1) ? 0.3 : 1,
                      }}>▼</button>
                  </div>
                </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* 우측: 편집 폼 */}
        <section aria-label="책 편집">
          {!selected ? (
            <div className="card" style={{padding:24, textAlign:'center'}}>좌측에서 책을 선택하거나 새 책을 추가하세요.</div>
          ) : (
            <>
              <div style={{display:'flex', gap:6, borderBottom:'1px solid var(--line)', marginBottom:18}}>
                {tabs.map((t) => (
                  <button key={t.id} type="button"
                    onClick={() => setEditTab(t.id)}
                    style={{
                      padding:'10px 14px', fontSize:13,
                      color: editTab === t.id ? 'var(--primary)' : 'var(--ink-2)',
                      borderBottom: editTab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
                      marginBottom:-1, background:'none', border:'none', cursor:'pointer',
                      fontFamily:'var(--font-serif)',
                    }}>{t.label}</button>
                ))}
                <span style={{flex:1}}/>
                <button type="button" className="btn btn-small"
                  onClick={() => removeBook(selected.id)}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>책 삭제</button>
              </div>

              {editTab === 'meta' && editing && (
                <div className="card" style={{padding:20, display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14}}>
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">제목</label>
                    <input className="field-input" value={editing.title || ''} onChange={(e) => setField('title', e.target.value)}/>
                  </div>
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">부제</label>
                    <input className="field-input" value={editing.subtitle || ''} onChange={(e) => setField('subtitle', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label className="field-label">저자</label>
                    <input className="field-input" value={editing.author || ''} onChange={(e) => setField('author', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label className="field-label">출판사</label>
                    <input className="field-input" value={editing.publisher || ''} onChange={(e) => setField('publisher', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label className="field-label">페이지 수</label>
                    <input type="number" className="field-input" value={editing.pages ?? 0} onChange={(e) => setField('pages', Number(e.target.value))}/>
                  </div>
                  <div className="field">
                    <label className="field-label">ISBN</label>
                    <input className="field-input" value={editing.isbn || ''} onChange={(e) => setField('isbn', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label className="field-label">국문판 가격(원)</label>
                    <input type="number" className="field-input" value={editing.priceKR ?? 0} onChange={(e) => setField('priceKR', Number(e.target.value))}/>
                  </div>
                  <div className="field">
                    <label className="field-label">영문판 가격(원)</label>
                    <input type="number" className="field-input" value={editing.priceEN ?? 0} onChange={(e) => setField('priceEN', Number(e.target.value))}/>
                  </div>
                  <div className="field">
                    <label className="field-label">상태</label>
                    <select className="field-input" value={editing.status || 'draft'} onChange={(e) => setField('status', e.target.value)}>
                      <option value="published">출간</option>
                      <option value="coming_soon">출간 예정</option>
                      <option value="draft">초안 (비공개)</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">출간일</label>
                    <input type="date" className="field-input" value={editing.publishedAt || ''} onChange={(e) => setField('publishedAt', e.target.value)}/>
                  </div>
                  <div className="field" style={{gridColumn:'1 / -1', display:'flex', alignItems:'center', gap:10}}>
                    <input id="book-primary" type="checkbox" checked={!!editing.primary} onChange={(e) => setField('primary', e.target.checked)}/>
                    <label htmlFor="book-primary" className="field-label" style={{margin:0}}>대표 책 (홈 CTA에 노출되는 메인 책)</label>
                  </div>
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">짧은 설명 (카탈로그 카드용)</label>
                    <textarea className="field-input" rows={3} value={editing.desc || ''} onChange={(e) => setField('desc', e.target.value)}/>
                    <p className="dim-2" style={{fontSize:11, marginTop:6, lineHeight:1.5}}>
                      카탈로그/리스트 카드에 노출되는 짧은 한두 줄.
                    </p>
                  </div>
                  {/* v00.172 — 홈 CTA 전용 별도 소개글 필드. 사용자 보고 '메인에 책 소개 너무 비어있는데 별도 입력 필드'.
                       site_content_kv.bookHomeIntros[bookId] 에 저장 — 책 D1 schema 변경 없이 즉시 사용. */}
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">홈 CTA 본문 (메인 화면 노출 — 별도 필드)</label>
                    <textarea
                      className="field-input"
                      rows={6}
                      value={(() => {
                        const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
                        const map = sc.bookHomeIntros || {};
                        return editing._homeIntroDraft != null
                          ? editing._homeIntroDraft
                          : (map[editing.id] || map[String(editing.id)] || '');
                      })()}
                      onChange={(e) => setField('_homeIntroDraft', e.target.value)}
                      placeholder={"메인 화면 책 카루셀에 노출되는 본문.\n비워두면 '짧은 설명' 으로 자동 폴백됩니다.\n\n예) 조선 27명 왕의 생애를 '설계도'로 읽어낸 건축가의 시선."}
                      style={{fontFamily:'var(--font-serif)', fontSize:14, lineHeight:1.8, resize:'vertical'}}/>
                    <div style={{display:'flex', gap:8, marginTop:8, alignItems:'center', flexWrap:'wrap'}}>
                      <button type="button" className="btn btn-small btn-gold"
                        disabled={editing._homeIntroDraft == null}
                        onClick={async () => {
                          try {
                            const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
                            const next = { ...(sc.bookHomeIntros || {}) };
                            const txt = String(editing._homeIntroDraft || '');
                            if (txt.trim()) next[editing.id] = txt;
                            else delete next[editing.id];
                            await window.BGNJ_SITE_CONTENT.saveSection('bookHomeIntros', next);
                            setField('_homeIntroDraft', null);
                            flash('✓ 홈 소개글 저장됨 — 홈 화면 즉시 반영');
                          } catch (err) {
                            window.BGNJ_TOAST.error('홈 소개글 저장 실패: ' + (err?.message || ''));
                          }
                        }}>💾 홈 소개글만 즉시 저장</button>
                      {editing._homeIntroDraft != null && (
                        <span className="mono dim-2" style={{fontSize:11}}>● 미저장</span>
                      )}
                    </div>
                    <p className="dim-2" style={{fontSize:11, marginTop:6, lineHeight:1.5}}>
                      홈 책 카루셀에만 노출되는 본문. 짧은 설명(위)과 별개로 더 길게 쓸 수 있습니다.
                      비워두면 짧은 설명을 자동 사용. 줄바꿈 보존됨.
                    </p>
                  </div>
                  {/* v00.199 — 사용자 요청 '책 어떤 정보들을 노출할지 선택'.
                      site_content_kv.bookFieldVisibility[bookId] = { author, publisher, pages, isbn, priceKR, priceEN, subtitle }.
                      미설정 시 모두 노출 (기본 true). bookHomeIntros 와 동일 패턴. */}
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">책 정보 노출 선택 (책 상세 페이지)</label>
                    <p className="dim-2" style={{fontSize:11, marginBottom:10, lineHeight:1.5}}>
                      체크 해제한 항목은 사이트 책 상세 페이지에서 노출되지 않습니다. 데이터는 그대로 보존되며 표시 여부만 제어합니다.
                    </p>
                    {(() => {
                      const FIELDS = [
                        ['subtitle',  '부제'],
                        ['author',    '저자'],
                        ['publisher', '출판사'],
                        ['pages',     '페이지 수'],
                        ['isbn',      'ISBN'],
                        ['priceKR',   '국문판 가격'],
                        ['priceEN',   '영문판 가격'],
                      ];
                      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
                      const map = sc.bookFieldVisibility || {};
                      const saved = map[editing.id] || map[String(editing.id)] || {};
                      const draft = editing._visibilityDraft;
                      const cur = (key) => {
                        if (draft && key in draft) return draft[key] !== false;
                        if (key in saved) return saved[key] !== false;
                        return true; // 기본 노출
                      };
                      const toggle = (key) => {
                        const next = { ...(draft || {}) };
                        next[key] = !cur(key);
                        setField('_visibilityDraft', next);
                      };
                      return (
                        <>
                          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:8}}>
                            {FIELDS.map(([key, label]) => {
                              const on = cur(key);
                              return (
                                <label key={key} style={{
                                  display:'flex', alignItems:'center', gap:8,
                                  padding:'8px 12px',
                                  border:'1px solid ' + (on ? 'var(--primary-dim)' : 'var(--line)'),
                                  background: on ? 'rgba(245,213,72,0.06)' : 'var(--bg-2)',
                                  cursor:'pointer', fontSize:13,
                                }}>
                                  <input type="checkbox" checked={on} onChange={() => toggle(key)}/>
                                  <span style={{color: on ? 'var(--ink)' : 'var(--ink-3)'}}>{label}</span>
                                </label>
                              );
                            })}
                          </div>
                          <div style={{display:'flex', gap:8, marginTop:10, alignItems:'center', flexWrap:'wrap'}}>
                            <button type="button" className="btn btn-small btn-gold"
                              disabled={!draft}
                              onClick={async () => {
                                try {
                                  const _sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
                                  const next = { ...(_sc.bookFieldVisibility || {}) };
                                  const merged = { ...(saved || {}), ...(draft || {}) };
                                  // 모두 true 로 돌아간 경우 키 제거 (기본 폴백 사용 → KV 가벼움).
                                  const allOn = FIELDS.every(([k]) => merged[k] !== false);
                                  if (allOn) delete next[editing.id];
                                  else next[editing.id] = merged;
                                  await window.BGNJ_SITE_CONTENT.saveSection('bookFieldVisibility', next);
                                  setField('_visibilityDraft', null);
                                  flash('✓ 노출 설정 저장됨 — 책 상세 즉시 반영');
                                } catch (err) {
                                  window.BGNJ_TOAST.error('노출 설정 저장 실패: ' + (err?.message || ''));
                                }
                              }}>💾 노출 설정 즉시 저장</button>
                            {draft && <span className="mono dim-2" style={{fontSize:11}}>● 미저장</span>}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {editTab === 'media' && editing && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
                  <div className="card" style={{padding:18}}>
                    <h4 className="ko-serif" style={{fontSize:14, marginBottom:10}}>표지 (PNG/JPG)</h4>
                    <div style={{
                      aspectRatio:'3/4', maxWidth:200, marginBottom:12, position:'relative',
                      border:'1px solid var(--line)', background:'var(--bg-2)',
                      display:'grid', placeItems:'center', overflow:'hidden',
                    }}>
                      {editing.coverDataUri
                        ? <img src={editing.coverDataUri} alt={`${editing.title} 표지`} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                        : <span className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.18em'}}>NO COVER</span>}
                      {uploadingCover && (
                        <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', display:'grid', placeItems:'center', color:'#fff', fontSize:13, fontWeight:600}}>
                          ⏳ 업로드 중…
                        </div>
                      )}
                    </div>
                    <div style={{display:'flex', gap:8}}>
                      <label className={`btn btn-small ${uploadingCover ? 'disabled' : ''}`}
                        style={{cursor: uploadingCover ? 'not-allowed' : 'pointer', opacity: uploadingCover ? 0.6 : 1}}>
                        {uploadingCover ? '⏳ 업로드 중…' : '업로드'}
                        <input type="file" accept="image/png,image/jpeg" onChange={onUploadCover} disabled={uploadingCover} style={{display:'none'}}/>
                      </label>
                      {editing.coverDataUri && !uploadingCover && (
                        <button type="button" className="btn btn-small"
                          onClick={async () => { if ((await window.BGNJ_CONFIRM('표지를 비울까요?', { danger: true }))) patchImmediate({ coverDataUri: '' }); }}
                          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                      )}
                    </div>
                    <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.5}}>
                      권장 비율 3:4. 5MB 이하 PNG/JPG (R2). 업로드 즉시 반영 — 별도 [저장] 불필요.
                    </p>
                  </div>
                  <div className="card" style={{padding:18}}>
                    <h4 className="ko-serif" style={{fontSize:14, marginBottom:10}}>본문 미리보기 (PDF) — 선택</h4>
                    <div style={{position:'relative'}}>
                      {editing.pdfPreviewDataUri ? (
                        <div style={{height:240, border:'1px solid var(--line)', marginBottom:12}}>
                          <iframe src={editing.pdfPreviewDataUri} title={`${editing.title} 미리보기`}
                            style={{width:'100%', height:'100%', border:'none'}}/>
                        </div>
                      ) : (
                        <div style={{height:240, border:'1px dashed var(--line-2)', marginBottom:12, display:'grid', placeItems:'center', textAlign:'center', padding:'0 14px'}}>
                          <div>
                            <span className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.18em', display:'block', marginBottom:6}}>NO PDF</span>
                            <span className="dim-2" style={{fontSize:11}}>업로드 안 하면 공개 페이지에서 미리보기 섹션 자체를 숨김.</span>
                          </div>
                        </div>
                      )}
                      {uploadingPdf && (
                        <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', display:'grid', placeItems:'center', color:'#fff', fontSize:13, fontWeight:600, marginBottom:12}}>
                          ⏳ 업로드 중…
                        </div>
                      )}
                    </div>
                    <div style={{display:'flex', gap:8}}>
                      <label className={`btn btn-small ${uploadingPdf ? 'disabled' : ''}`}
                        style={{cursor: uploadingPdf ? 'not-allowed' : 'pointer', opacity: uploadingPdf ? 0.6 : 1}}>
                        {uploadingPdf ? '⏳ 업로드 중…' : '업로드'}
                        <input type="file" accept="application/pdf" onChange={onUploadPdf} disabled={uploadingPdf} style={{display:'none'}}/>
                      </label>
                      {editing.pdfPreviewDataUri && !uploadingPdf && (
                        <button type="button" className="btn btn-small"
                          onClick={async () => { if ((await window.BGNJ_CONFIRM('PDF 미리보기를 비울까요?', { danger: true }))) patchImmediate({ pdfPreviewDataUri: '' }); }}
                          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                      )}
                    </div>
                    <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.5}}>
                      비워두면 공개 페이지에서 "미리보기" 섹션 자체가 숨겨집니다. (R2 20MB / 폴백 3MB)
                    </p>
                  </div>
                </div>
              )}

              {editTab === 'intro' && editing && (
                <div className="card" style={{padding:20}}>
                  <label className="field-label">소개 (HTML 허용)</label>
                  <textarea className="field-input" rows={12}
                    value={editing.intro || ''}
                    onChange={(e) => setField('intro', e.target.value)}
                    style={{fontFamily:'var(--font-mono)', fontSize:13, lineHeight:1.7}}/>
                  <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.5}}>
                    문단은 &lt;p&gt;…&lt;/p&gt;로 구분. 강조는 &lt;strong&gt;…&lt;/strong&gt;.
                  </p>
                </div>
              )}

              {editTab === 'toc' && editing && (
                <div className="card" style={{padding:20}}>
                  <label className="field-label">목차</label>
                  {/* v00.155 — 입력 규칙: 한 줄 = 한 챕터, '- ' 시작 = 직전 챕터의 하위 설명 (들여쓰기 표시). */}
                  <p className="dim" style={{fontSize:12, lineHeight:1.7, margin:'4px 0 10px'}}>
                    한 줄 = 한 챕터로 표시됩니다. 줄 시작에 <code style={{padding:'1px 6px', background:'var(--bg-2)', border:'1px solid var(--line-2)', borderRadius:3, fontFamily:'var(--font-mono)', fontSize:11}}>- </code>(하이픈+공백) 을 붙이면 직전 챕터의 <strong>하위 설명</strong>으로 들여쓰기 표시됩니다.
                  </p>
                  <textarea className="field-input" rows={14}
                    placeholder={"예)\n1부. 시작\n- 첫 번째 길\n- 두 번째 길\n2부. 끝나는 자리\n- 마지막 풍경"}
                    value={(editing.chapters || []).join('\n')}
                    onChange={(e) => setField('chapters', e.target.value.split('\n').map((s) => s.replace(/^\s+|\s+$/g, '')).filter(Boolean))}
                    style={{fontFamily:'var(--font-serif)', fontSize:14, lineHeight:1.8}}/>
                </div>
              )}

              {editTab === 'author' && editing && (
                <div className="card" style={{padding:20}}>
                  <label className="field-label">저자 소개</label>
                  <textarea className="field-input" rows={8}
                    value={editing.authorBio || ''}
                    onChange={(e) => setField('authorBio', e.target.value)}
                    style={{fontSize:14, lineHeight:1.8}}/>
                </div>
              )}

              {editTab === 'reviews' && (
                <div>
                  {(selected.reviews || []).length === 0 ? (
                    <div className="card" style={{padding:24, textAlign:'center'}}>
                      <span className="dim">등록된 리뷰가 없습니다.</span>
                    </div>
                  ) : (
                    (selected.reviews || []).map((r) => (
                      <div key={r.id} className="card" style={{padding:14, marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12}}>
                        <div style={{flex:1}}>
                          <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:4}}>
                            <span className="gold" style={{fontSize:13}}>{'★'.repeat(r.rating || 5)}</span>
                            <span className="mono dim-2" style={{fontSize:11}}>{r.userName}</span>
                            <span className="mono dim-2" style={{fontSize:10}}>{window.BGNJ_FMT.kstDate(r.createdAt)}</span>
                          </div>
                          <p className="ko-serif" style={{fontSize:13, lineHeight:1.7, margin:0}}>{r.text}</p>
                        </div>
                        <button type="button" className="btn btn-small"
                          onClick={async () => {
                            if (!(await window.BGNJ_CONFIRM('이 리뷰를 삭제할까요?', { danger: true }))) return;
                            window.BGNJ_BOOKS.removeReview(selected.id, r.id);
                            refresh();
                          }}
                          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                      </div>
                    ))
                  )}
                  <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.5}}>
                    리뷰는 사용자가 도서 상세 페이지에서 직접 등록합니다. 여기서는 부적절한 리뷰만 삭제할 수 있습니다.
                  </p>
                </div>
              )}
              {/* v00.147 — 명시 저장 버튼. 텍스트 필드는 dirty 시점에만 commit. media 업로드는 즉시 patch. */}
              {editing && editTab !== 'reviews' && (
                <AdminSaveBar>
                  <button type="button" className="btn btn-gold" onClick={commit}
                    disabled={saving || (!editing._isNew && !dirty)}>
                    {saving
                      ? '저장 중…'
                      : (editing._isNew
                          ? '💾 새 책 저장'
                          : (dirty ? '💾 저장' : '저장됨 ✓'))}
                  </button>
                  {/* v00.193 — 새 책 draft 취소 (D1 호출 없이 클라이언트 상태만 폐기). */}
                  {editing._isNew && (
                    <button type="button" className="btn btn-small"
                      onClick={cancelDraft}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>
                      새 책 취소
                    </button>
                  )}
                  {!editing._isNew && dirty && (
                    <button type="button" className="btn btn-small"
                      onClick={async () => { if ((await window.BGNJ_CONFIRM('변경 사항을 버리고 마지막 저장 시점으로 되돌릴까요?', { danger: true }))) { setEditing({ ...selected }); setDirty(false); } }}>
                      변경 취소
                    </button>
                  )}
                  <span className="admin-savebar__spacer"/>
                  <span className="dim-2 mono" style={{fontSize:11, color: editing._isNew ? 'var(--primary)' : undefined}}>
                    {editing._isNew
                      ? '● 새 책 (미저장 — [💾 새 책 저장] 클릭 시 D1 반영)'
                      : (dirty ? '● 미저장 변경 있음' : '○ 모든 변경 저장됨')}
                  </span>
                </AdminSaveBar>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

// === Error Pages Preview Panel ====================================
// v00.145 — 사용자 요청 '관리자 페이지에서 오류 페이지들 미리보기'.
// 6 종 오류 페이지 (404 / 500 / 403 / 401 / Network / Maintenance) 를 chip 으로 선택해 inline 렌더.
const ErrorPagesPreviewPanel = ({ go }) => {
  const [active, setActive] = React.useState('404');
  // v00.149 — window.Error*Page 는 ErrorPages.js 가 로드된 후에만 존재.
  // tick 으로 강제 재평가 + 100ms 마다 5회 재시도 (스크립트 로드 race 대비).
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    let count = 0;
    const id = setInterval(() => {
      if (window.Error404Page || count >= 5) {
        setTick((v) => v + 1);
        clearInterval(id);
      }
      count++;
    }, 100);
    return () => clearInterval(id);
  }, []);

  const variants = React.useMemo(() => [
    { k: '404',         l: '404 페이지 없음',  Comp: window.Error404Page },
    { k: '500',         l: '500 서버 오류',    Comp: window.Error500Page },
    { k: '403',         l: '403 권한 부족',    Comp: window.Error403Page },
    { k: '401',         l: '401 로그인 필요',  Comp: window.Error401Page },
    { k: 'network',     l: '네트워크 오류',    Comp: window.ErrorNetworkPage },
    { k: 'maintenance', l: '점검 중',          Comp: window.ErrorMaintenancePage },
  ], [tick]);
  const current = variants.find((v) => v.k === active) || variants[0];
  const Preview = current.Comp;
  // 미리보기 안에서 go 가 호출되면 실제로 라우팅하면 곤란하니 noop 으로 가로채기.
  const previewGo = (route) => { try { console.warn('[preview] go(', route, ') — 미리보기에서는 실제 이동 안 함'); } catch {} };
  return (
    <div>
      <AdminPanelHeader
        eyebrow="ERROR PAGES · 미리보기"
        title="오류 페이지 미리보기"
        description="404 / 500 / 403 / 401 / 네트워크 / 점검 중 6종을 카드로 미리 봅니다. 일러스트는 assets/errors/ 에 위치 — 파일 누락 시 ✈️ 이모지 폴백."/>
      <div className="admin-toolbar">
        <AdminFilterChips
          ariaLabel="오류 페이지 종류"
          items={variants.map((v) => ({ key: v.k, label: v.l }))}
          value={active} onChange={setActive}/>
      </div>
      <div style={{
        border:'1px solid var(--line)', borderRadius:8, overflow:'hidden',
        background:'var(--bg-2)', padding:24, display:'grid', placeItems:'center',
      }}>
        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:14, alignSelf:'flex-start'}}>
          PREVIEW · {current.l}
        </div>
        {Preview ? (
          // v00.149 — embedded prop 으로 full-viewport wrapper 비활성 (preview 컨테이너에 fit).
          <Preview go={previewGo} embedded/>
        ) : (
          <AdminEmpty>
            오류 페이지 컴포넌트 ({current.k}) 가 아직 로드되지 않았습니다.
            ErrorPages.js 가 캐시에 잡혔는지 확인 후 hard reload (Cmd+Shift+R) 해 주세요.
          </AdminEmpty>
        )}
      </div>
      <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.7}}>
        ⓘ 미리보기 안의 버튼은 실제 라우팅하지 않습니다 (콘솔에 로그만 출력).
        라이브 페이지에서는 정상 동작합니다.
      </p>
    </div>
  );
};

// === Error Log Panel ==============================================
// 사이트에서 발생한 모든 클라이언트 오류(인증/네트워크/렌더링/미처리 promise) 를 D1.error_log 에서 조회.
const ErrorLogPanel = () => {
  const [errors, setErrors] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [codeFilter, setCodeFilter] = React.useState('all');
  const [loading, setLoading] = React.useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const { errors: list } = await window.BGNJ_API.errorLog.list({ limit: 500 });
      setErrors(list || []);
    } catch {} finally { setLoading(false); }
  };
  React.useEffect(() => { refresh(); }, []);

  const codeOptions = React.useMemo(() => {
    const set = new Set(errors.map((e) => e.code).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [errors]);

  const filtered = React.useMemo(() => {
    let list = errors.slice();
    if (codeFilter !== 'all') list = list.filter((e) => e.code === codeFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((e) =>
      String(e.message || '').toLowerCase().includes(q)
      || String(e.url || '').toLowerCase().includes(q)
      || String(e.pathname || '').toLowerCase().includes(q)
    );
    return list;
  }, [errors, codeFilter, search]);

  const clearAll = async () => {
    if (!(await window.BGNJ_CONFIRM('모든 오류 로그를 삭제하시겠습니까? (되돌릴 수 없음)', { danger: true }))) return;
    try { await window.BGNJ_API.errorLog.clear(); await refresh(); }
    catch (err) { window.BGNJ_TOAST.error('삭제 실패: ' + (err?.message || '')); }
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:14, lineHeight:1.7}}>
        사이트에서 발생한 모든 클라이언트 오류가 D1.error_log 에 기록됩니다 (인증/네트워크/렌더링/미처리 promise).
        AI 또는 운영자가 작업을 시작할 때 <strong className="gold">이 패널을 가장 먼저 확인</strong>하여 미해결 오류를 우선 처리하는 것이 원칙입니다.
      </p>
      <div style={{display:'flex', gap:12, marginBottom:14, alignItems:'center', flexWrap:'wrap'}}>
        <input className="field-input" placeholder="메시지/URL 검색..." style={{flex:1, minWidth:240}}
          value={search} onChange={(e) => setSearch(e.target.value)}/>
        <select className="field-input" style={{maxWidth:200}}
          value={codeFilter} onChange={(e) => setCodeFilter(e.target.value)}>
          {codeOptions.map((c) => <option key={c} value={c}>{c === 'all' ? '전체 코드' : c}</option>)}
        </select>
        <button type="button" className="btn btn-small" onClick={refresh} disabled={loading}>
          {loading ? '불러오는 중...' : '새로고침'}
        </button>
        <button type="button" className="btn btn-small" onClick={clearAll}
          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>전체 삭제</button>
        <span className="mono dim-2" style={{fontSize:11}}>총 {errors.length}건 · 표시 {filtered.length}건</span>
      </div>
      <div style={{overflowX:'auto', border:'1px solid var(--line)'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:980}}>
          <thead>
            <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left', width:160}}>시각</th>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left', width:140}}>코드</th>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left', width:60}}>HTTP</th>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left'}}>메시지</th>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left', width:160}}>경로</th>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left', width:200}}>요청 URL</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="dim" style={{padding:32, textAlign:'center'}}>{loading ? '불러오는 중...' : '오류 로그가 없습니다.'}</td></tr>
            ) : filtered.map((e) => (
              <tr key={e.id} style={{borderTop:'1px solid var(--line)'}}>
                <td className="mono dim-2" style={{padding:'10px 12px', fontSize:11, verticalAlign:'top'}}>
                  {e.ts ? window.BGNJ_FMT.kstDateTime(e.ts) : '-'}
                </td>
                <td className="mono" style={{padding:'10px 12px', fontSize:11, verticalAlign:'top', color:'var(--danger)', letterSpacing:'0.1em'}}>
                  {e.code || '-'}
                </td>
                <td className="mono" style={{padding:'10px 12px', fontSize:11, verticalAlign:'top'}}>{e.status || '-'}</td>
                <td style={{padding:'10px 12px', fontSize:13, verticalAlign:'top', lineHeight:1.6}}>
                  <div style={{fontWeight:500}}>{e.message}</div>
                  {e.hint && <div className="dim-2" style={{fontSize:11, marginTop:4}}>{e.hint}</div>}
                </td>
                <td className="mono dim-2" style={{padding:'10px 12px', fontSize:10, verticalAlign:'top', wordBreak:'break-all'}}>{e.pathname || '-'}</td>
                <td className="mono dim-2" style={{padding:'10px 12px', fontSize:10, verticalAlign:'top', wordBreak:'break-all'}}>{e.url || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// === SEO Admin Panel ==============================================
// 사이트 메타데이터(OG 이미지, 페이지 title/description) 관리.
// 서버 source: site_content_kv.og 섹션. data.js applyHead 가 <head> 메타를 즉시 갱신.
const SEOAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [og, setOg] = React.useState({ title: '', description: '', imageDataUri: '' });
  const [hero, setHero] = React.useState({ eyebrow: '', title1: '', title2: '', title3: '', subtitle: '' });
  const [brand, setBrand] = React.useState({ name: '', sub: '' });
  const [msg, setMsg] = React.useState('');

  const refresh = async () => {
    await window.BGNJ_SITE_CONTENT.refresh();
    const sc = window.BGNJ_SITE_CONTENT.get();
    setOg(sc.og || {});
    setHero(sc.hero || {});
    setBrand(sc.brand || {});
    setTick((v) => v + 1);
  };
  React.useEffect(() => { refresh(); }, []);

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2400); };

  const save = async (section, data) => {
    try {
      await window.BGNJ_SITE_CONTENT.saveSection(section, data);
      flash('✓ 저장되었습니다. <head> 메타가 즉시 갱신됩니다.');
      await refresh();
    } catch (err) {
      flash('✗ 저장 실패: ' + (err?.body?.error || err?.message || ''));
    }
  };

  const onPickImage = async (e, section, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      flash('✗ 이미지가 너무 큽니다 (1.5MB 이하 권장).'); e.target.value = ''; return;
    }
    const dataUri = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ''));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    if (section === 'og') {
      const next = { ...og, [field]: dataUri };
      setOg(next);
      await save(section, next);
    }
    e.target.value = '';
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        검색엔진과 SNS 공유 미리보기에 사용되는 메타데이터를 관리합니다. 변경 사항은 저장 즉시 페이지의 <code className="mono">&lt;head&gt;</code> 에 반영됩니다.
      </p>

      {msg && (
        <div role="status" style={{
          marginBottom:16, padding:'10px 14px',
          border: msg.startsWith('✗') ? '1px solid var(--danger)' : '1px solid var(--primary-dim)',
          background: msg.startsWith('✗') ? 'rgba(194,74,61,0.06)' : 'rgba(245,213,72,0.06)',
          color: msg.startsWith('✗') ? 'var(--danger)' : 'var(--primary)', fontSize:13,
        }}>{msg}</div>
      )}

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>OG · 검색엔진 공유 메타</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:14, lineHeight:1.7}}>
        카카오톡/페이스북/X 공유 시 노출되는 미리보기 카드와 검색엔진 description.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); save('og', og); }} className="card" style={{padding:20, marginBottom:24}}>
        <div className="field">
          <label className="field-label">OG 제목 (검색·공유 카드 제목)</label>
          <input className="field-input" placeholder="뱅기노자 — 뱅기 타고 한국을 느끼다"
            value={og.title || ''} onChange={(e) => setOg({ ...og, title: e.target.value })}/>
        </div>
        <div className="field">
          <label className="field-label">OG 설명 (검색·공유 카드 본문)</label>
          <textarea className="field-input" rows={3}
            placeholder="궁궐 답사부터 지역 여행까지, 한국의 역사·문화·자연을 함께 여행하는 커뮤니티."
            value={og.description || ''} onChange={(e) => setOg({ ...og, description: e.target.value })}/>
        </div>
        <div className="field">
          <label className="field-label">OG 이미지 (1200×630 권장 · 1.5MB 이하)</label>
          {og.imageDataUri && (
            <img src={og.imageDataUri} alt="OG preview"
              style={{display:'block', maxWidth:240, maxHeight:126, marginBottom:8, border:'1px solid var(--line)'}}/>
          )}
          <input type="file" accept="image/png,image/jpeg" onChange={(e) => onPickImage(e, 'og', 'imageDataUri')}/>
          {og.imageDataUri && (
            <button type="button" className="btn-ghost" style={{fontSize:11, color:'var(--danger)', marginTop:6}}
              onClick={() => save('og', { ...og, imageDataUri: '' })}>이미지 제거</button>
          )}
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14, marginTop:14}}>
          <button type="submit" className="btn btn-gold">OG 저장</button>
        </div>
      </form>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>페이지 상단 (Hero)</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:14, lineHeight:1.7}}>
        홈페이지 첫 화면의 큰 제목과 부제. 검색엔진의 페이지 본문 첫 인상에 사용됩니다.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); save('hero', hero); }} className="card" style={{padding:20, marginBottom:24}}>
        <div className="field">
          <label className="field-label">상단 라벨 (대문자 권장)</label>
          <input className="field-input" placeholder="BANGINOJA · 뱅기타고 노자"
            value={hero.eyebrow || ''} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}/>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
          <div className="field">
            <label className="field-label">제목 1행</label>
            <input className="field-input" value={hero.title1 || ''} onChange={(e) => setHero({ ...hero, title1: e.target.value })}/>
          </div>
          <div className="field">
            <label className="field-label">제목 2행</label>
            <input className="field-input" value={hero.title2 || ''} onChange={(e) => setHero({ ...hero, title2: e.target.value })}/>
          </div>
          <div className="field">
            <label className="field-label">제목 3행</label>
            <input className="field-input" value={hero.title3 || ''} onChange={(e) => setHero({ ...hero, title3: e.target.value })}/>
          </div>
        </div>
        <div className="field">
          <label className="field-label">부제 (Hero subtitle)</label>
          <textarea className="field-input" rows={2}
            value={hero.subtitle || ''} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}/>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14, marginTop:14}}>
          <button type="submit" className="btn btn-gold">Hero 저장</button>
        </div>
      </form>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>브랜드 이름</h3>
      <form onSubmit={(e) => { e.preventDefault(); save('brand', brand); }} className="card" style={{padding:20}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div className="field">
            <label className="field-label">브랜드명 (한글)</label>
            <input className="field-input" placeholder="뱅기노자"
              value={brand.name || ''} onChange={(e) => setBrand({ ...brand, name: e.target.value })}/>
          </div>
          <div className="field">
            <label className="field-label">서브 (영문/약어)</label>
            <input className="field-input" placeholder="BANGINOJA"
              value={brand.sub || ''} onChange={(e) => setBrand({ ...brand, sub: e.target.value })}/>
          </div>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14, marginTop:14}}>
          <button type="submit" className="btn btn-gold">브랜드 저장</button>
        </div>
      </form>
    </div>
  );
};

// === Search Console Admin Panel (v00.196) =========================
// 사용자 요청 '구글/네이버 등 서치 콘솔 + 최신화 가능한 api 입력 페이지'.
// 검증 meta tag 입력 → site_content_kv.searchConsole 저장 → applyHead 가 <head> 즉시 주입.
// + sitemap.xml URL 표시 + 각 콘솔 새창 진입 + Google sitemap ping (no-cors fetch).
const SearchConsoleAdminPanel = () => {
  const [data, setData] = React.useState({
    google: '', naver: '', bing: '', yandex: '',
    sitemapUrl: '', lastUpdated: '',
  });
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2400); };

  const refresh = React.useCallback(async () => {
    try { await window.BGNJ_SITE_CONTENT.refresh(); } catch {}
    const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
    const cur = sc.searchConsole || {};
    const origin = (typeof location !== 'undefined' ? location.origin : 'https://bgnj.net');
    setData({
      google: cur.google || '',
      naver: cur.naver || '',
      bing: cur.bing || '',
      yandex: cur.yandex || '',
      sitemapUrl: cur.sitemapUrl || `${origin}/sitemap.xml`,
      lastUpdated: cur.lastUpdated || '',
    });
    setDirty(false);
  }, []);
  React.useEffect(() => { refresh(); }, [refresh]);

  const setField = (k, v) => { setData((cur) => ({ ...cur, [k]: v })); setDirty(true); };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const next = { ...data, lastUpdated: new Date().toISOString() };
      await window.BGNJ_SITE_CONTENT.saveSection('searchConsole', next);
      try { window.BGNJ_SITE_CONTENT.applyHead(); } catch {}
      setData(next);
      setDirty(false);
      flash('✓ 저장됨 — <head> 검증 meta 즉시 갱신');
    } catch (err) {
      flash('✗ 저장 실패: ' + (err?.body?.error || err?.message || ''));
    } finally { setSaving(false); }
  };

  const pingGoogleSitemap = () => {
    if (!data.sitemapUrl) { flash('✗ sitemap URL 이 없습니다'); return; }
    // Google ping endpoint (no-cors fetch — 응답 못 읽지만 요청은 도달). BGNJ_API 우회: 외부 도메인 호출.
    try {
      // bgnj-lint-ignore-next-line direct_fetch
      fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(data.sitemapUrl)}`, { mode: 'no-cors' })
        .catch(() => {});
      flash('✓ Google 에 sitemap ping 요청 (응답은 Search Console 에서 확인)');
    } catch (err) {
      flash('✗ ping 실패: ' + (err?.message || ''));
    }
  };

  const openConsole = (url) => { try { window.open(url, '_blank', 'noopener'); } catch {} };

  const lastUpdLabel = data.lastUpdated
    ? window.BGNJ_FMT.kstDateTime(data.lastUpdated)
    : '저장 이력 없음';

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        검색엔진 사이트 소유 확인용 meta tag 를 입력합니다. 저장 즉시 <code className="mono">&lt;head&gt;</code> 에 주입되며, 각 검색 콘솔 사이트의 "HTML 태그" 검증 방법을 통과합니다.
      </p>

      {msg && (
        <div role="status" style={{
          marginBottom:16, padding:'10px 14px',
          border: msg.startsWith('✗') ? '1px solid var(--danger)' : '1px solid var(--primary-dim)',
          background: msg.startsWith('✗') ? 'rgba(194,74,61,0.06)' : 'rgba(245,213,72,0.06)',
          color: msg.startsWith('✗') ? 'var(--danger)' : 'var(--primary)', fontSize:13,
        }}>{msg}</div>
      )}

      <div className="card" style={{padding:20, marginBottom:18}}>
        <h3 className="ko-serif" style={{fontSize:16, marginBottom:14}}>검증 코드 (HTML 태그 방식)</h3>

        <div className="field" style={{marginBottom:14}}>
          <label className="field-label">
            Google Search Console — <code className="mono">&lt;meta name="google-site-verification" content="..."&gt;</code>
          </label>
          <input className="field-input" placeholder="예: 8R9z4...... (content 값만 입력)"
            value={data.google} onChange={(e) => setField('google', e.target.value.trim())}/>
          <div style={{display:'flex', gap:8, marginTop:6, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small" onClick={() => openConsole('https://search.google.com/search-console')}>↗ Search Console 열기</button>
          </div>
        </div>

        <div className="field" style={{marginBottom:14}}>
          <label className="field-label">
            Naver Search Advisor — <code className="mono">&lt;meta name="naver-site-verification" content="..."&gt;</code>
          </label>
          <input className="field-input" placeholder="예: a1b2c3d4......"
            value={data.naver} onChange={(e) => setField('naver', e.target.value.trim())}/>
          <div style={{display:'flex', gap:8, marginTop:6, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small" onClick={() => openConsole('https://searchadvisor.naver.com/')}>↗ Search Advisor 열기</button>
          </div>
        </div>

        <div className="field" style={{marginBottom:14}}>
          <label className="field-label">
            Bing Webmaster — <code className="mono">&lt;meta name="msvalidate.01" content="..."&gt;</code>
          </label>
          <input className="field-input" placeholder="예: A1B2C3......"
            value={data.bing} onChange={(e) => setField('bing', e.target.value.trim())}/>
          <div style={{display:'flex', gap:8, marginTop:6, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small" onClick={() => openConsole('https://www.bing.com/webmasters')}>↗ Bing Webmaster 열기</button>
          </div>
        </div>

        <div className="field" style={{marginBottom:14}}>
          <label className="field-label">
            Yandex Webmaster — <code className="mono">&lt;meta name="yandex-verification" content="..."&gt;</code>
          </label>
          <input className="field-input" placeholder="(선택) 예: 1234abcd......"
            value={data.yandex} onChange={(e) => setField('yandex', e.target.value.trim())}/>
          <div style={{display:'flex', gap:8, marginTop:6, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small" onClick={() => openConsole('https://webmaster.yandex.com/')}>↗ Yandex 열기</button>
          </div>
        </div>
      </div>

      <div className="card" style={{padding:20, marginBottom:18}}>
        <h3 className="ko-serif" style={{fontSize:16, marginBottom:14}}>Sitemap & 인덱싱 최신화</h3>
        <div className="field" style={{marginBottom:14}}>
          <label className="field-label">Sitemap URL</label>
          <input className="field-input" placeholder="https://bgnj.net/sitemap.xml"
            value={data.sitemapUrl} onChange={(e) => setField('sitemapUrl', e.target.value.trim())}/>
          <p className="dim-2" style={{fontSize:11, marginTop:6, lineHeight:1.6}}>
            Google / Naver 콘솔에 동일한 URL 을 등록하세요. 미등록 시 색인 누락 가능.
          </p>
        </div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <button type="button" className="btn btn-small btn-gold" onClick={pingGoogleSitemap}>
            🔔 Google 에 sitemap 변경 알림 (ping)
          </button>
          <button type="button" className="btn btn-small"
            onClick={() => openConsole(`https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent((typeof location !== 'undefined' ? location.origin : 'https://bgnj.net'))}`)}>
            ↗ Google Sitemap 페이지 열기
          </button>
          <button type="button" className="btn btn-small"
            onClick={() => openConsole('https://searchadvisor.naver.com/console/board')}>
            ↗ Naver 사이트맵 콘솔 열기
          </button>
        </div>
        <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.6}}>
          ※ Naver 는 직접 ping 엔드포인트 미공식 — 콘솔에서 수동 등록 필요. Bing 은 Google 과 색인 공유.
        </p>
      </div>

      <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', justifyContent:'flex-end'}}>
        <span className="dim-2 mono" style={{fontSize:11}}>
          마지막 저장: {lastUpdLabel}
        </span>
        <span style={{flex:1}}/>
        {dirty && (
          <button type="button" className="btn btn-small" onClick={refresh}>변경 취소</button>
        )}
        <button type="button" className="btn btn-gold" onClick={save} disabled={saving || !dirty}>
          {saving ? '저장 중…' : (dirty ? '💾 저장' : '저장됨 ✓')}
        </button>
      </div>
    </div>
  );
};

// === Audit Log Panel ==============================================
const AuditLogPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const refresh = () => setTick((v) => v + 1);
  const list = React.useMemo(() => window.BGNJ_AUDIT?.list?.({ search, limit: 200 }) || [], [search, tick]);

  const exportCsv = () => {
    const all = window.BGNJ_AUDIT.list({ limit: 1000 });
    const header = ['id', 'ts', 'action', 'target', 'by', 'details'];
    const rows = all.map((e) => [e.id, e.ts, e.action, e.target, e.by, e.details ? JSON.stringify(e.details) : '']);
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadCsv(`audit-log-${new Date().toISOString().slice(0,10)}.csv`, csv);
  };

  const clear = async () => {
    if (!(await window.BGNJ_CONFIRM('감사 로그 전체를 삭제하시겠어요? 되돌릴 수 없습니다.', { danger: true }))) return;
    window.BGNJ_AUDIT.clear();
    refresh();
  };

  return (
    <div>
      <AdminPanelHeader
        eyebrow="AUDIT · 감사 로그"
        title="운영자 액션 이력"
        description="운영자가 회원·강연·투어·책 주문에 대해 행한 변경이 시각순으로 기록됩니다. 최근 500건까지 보관, 정지·삭제·입금 확인·발송·등급 변경 등 핵심 액션 자동 기록."
        actions={(
          <>
            <button type="button" className="btn btn-small" onClick={exportCsv}>CSV 다운로드</button>
            <button type="button" className="btn btn-small" onClick={clear}
              style={{borderColor:'var(--danger)', color:'var(--danger)'}}>전체 삭제</button>
          </>
        )}/>

      <div className="admin-toolbar">
        <input className="field-input" placeholder="액션 / 대상 / 작업자 검색..." style={{flex:1, minWidth:240}}
          value={search} onChange={(e) => setSearch(e.target.value)}/>
      </div>

      {list.length === 0 ? (
        <AdminEmpty>표시할 감사 로그가 없습니다.</AdminEmpty>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" style={{fontSize:12}}>
            <thead>
              <tr>
                <th scope="col" style={{width:170}}>시각</th>
                <th scope="col" style={{width:220}}>액션</th>
                <th scope="col">대상</th>
                <th scope="col">작업자</th>
                <th scope="col">세부</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id}>
                  <td className="mono dim-2" style={{fontSize:11}}>{window.BGNJ_FMT.kstDateTime(e.ts)}</td>
                  <td className="mono gold" style={{fontSize:11}}>{e.action}</td>
                  <td className="mono" style={{fontSize:11}}>{e.target}</td>
                  <td style={{fontSize:12}}>{e.by}</td>
                  <td style={{fontSize:11, lineHeight:1.6}}>
                    <AuditDetailsCell details={e.details}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="dim-2 mono" style={{fontSize:11, marginTop:12, textAlign:'right'}}>
        표시 {list.length}건 (전체 최근 500건 중)
      </div>
    </div>
  );
};

// 게시글 뷰어 모달 — 관리자 패널에서 페이지 이동 없이 본문/메타/댓글을 한눈에.
const PostViewerModal = ({ postId, onClose }) => {
  const [post, setPost] = React.useState(() => window.BGNJ_COMMUNITY?.getPost?.(postId) || null);
  const [comments, setComments] = React.useState(() => window.BGNJ_COMMUNITY?.getComments?.(postId) || []);
  // v00.077 — useModalGuard 통일 (ESC + body lock + popstate). 읽기 전용 → dirty=false.
  window.useModalGuard?.({ open: true, dirty: false, onClose, onSaveDraft: null, label: '게시글 보기' });
  React.useEffect(() => {
    // 서버 게시글이면 댓글 동기화 시도.
    try { window.BGNJ_COMMUNITY?.refreshComments?.(postId).then(() => {
      setComments(window.BGNJ_COMMUNITY.getComments(postId));
    }); } catch {}
  }, [postId]);

  if (!post) {
    return (
      <div role="dialog" aria-modal="true" onClick={onClose}
        style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'grid', placeItems:'center', padding:24}}>
        <div onClick={(e) => e.stopPropagation()}
          style={{background:'var(--bg)', maxWidth:520, width:'100%', padding:28, border:'1px solid var(--line)'}}>
          <div className="dim" style={{fontSize:14, marginBottom:16}}>해당 게시글을 찾을 수 없습니다.</div>
          <div style={{textAlign:'right'}}><button type="button" className="btn" onClick={onClose}>닫기</button></div>
        </div>
      </div>
    );
  }

  const likes = Array.isArray(post.likes) ? post.likes.length : 0;
  const tagList = post.tags || [];

  return (
    <div role="dialog" aria-modal="true" aria-label={post.title}
      onClick={onClose}
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'grid', placeItems:'center', padding:24}}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background:'var(--bg)', width:'100%', maxWidth:860, maxHeight:'88vh',
          overflow:'auto', padding:'28px 32px', border:'1px solid var(--line)',
          boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
        }}>
        {/* 상단 메타 */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, marginBottom:14}}>
          <div className="mono dim-2" style={{fontSize:11, letterSpacing:'0.18em'}}>
            POST · #{String(post.id).padStart(4, '0')}
          </div>
          <button type="button" className="btn btn-small" onClick={onClose} aria-label="닫기">닫기</button>
        </div>

        {/* 제목 + 배지 */}
        <div style={{display:'flex', gap:10, marginBottom:14, flexWrap:'wrap'}}>
          <span className="badge badge-gold">{post.category}</span>
          {post.prefix && <span className="badge">{post.prefix}</span>}
          {post.hot && <span className="badge">HOT</span>}
        </div>
        <h2 className="ko-serif" style={{fontSize:26, lineHeight:1.3, marginBottom:14}}>{post.title}</h2>

        {tagList.length > 0 && (
          <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:14}}>
            {tagList.map((t) => <span key={t} className="tag-chip">#{t}</span>)}
          </div>
        )}

        {/* 작성자/일시/조회/공감/댓글 */}
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12,
          padding:'12px 14px', background:'var(--bg-2)', border:'1px solid var(--line)',
          marginBottom:18, fontSize:12,
        }}>
          {[
            ['작성자', post.author || '-'],
            ['작성일', post.date || (post.createdAt ? window.BGNJ_FMT.kstDateTime(post.createdAt) : '-')],
            ['조회', post.views ?? 0],
            ['공감', likes],
            ['댓글', comments.length],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em', marginBottom:4}}>{label}</div>
              <div style={{fontSize:13}}>{value}</div>
            </div>
          ))}
        </div>

        {/* 본문 */}
        <div className="post-body" style={{
          padding:'18px 4px', borderTop:'1px solid var(--line)',
          fontFamily:'var(--font-reading)', fontSize:15, lineHeight:1.85, color:'var(--ink)',
        }}>
          {post.body?.html ? (
            <div dangerouslySetInnerHTML={{__html: window.BGNJ_SAFE_HTML(post.body.html)}}/>
          ) : post.body?.text ? (
            <div style={{whiteSpace:'pre-wrap'}}>{post.body.text}</div>
          ) : (
            <div className="dim-2" style={{fontStyle:'italic'}}>(본문 없음)</div>
          )}
        </div>

        {/* 첨부 이미지 */}
        {Array.isArray(post.images) && post.images.length > 0 && (
          <div style={{marginTop:18}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:10}}>ATTACHMENTS · {post.images.length}</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))', gap:10}}>
              {post.images.map((src, i) => (
                <a key={i} href={src} target="_blank" rel="noreferrer"
                  style={{border:'1px solid var(--line)', display:'block'}}>
                  <img src={src} alt="" style={{display:'block', width:'100%', height:120, objectFit:'cover'}}/>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 댓글 */}
        <div style={{marginTop:24, paddingTop:18, borderTop:'1px solid var(--line)'}}>
          <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:10}}>COMMENTS · {comments.length}</div>
          {comments.length === 0 ? (
            <div className="dim-2" style={{fontSize:13}}>아직 댓글이 없습니다.</div>
          ) : (
            <ul style={{listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:10}}>
              {comments.map((c) => (
                <li key={c.id} style={{padding:'10px 12px', background:'var(--bg-2)', border:'1px solid var(--line)', fontSize:13}}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:10, marginBottom:4}}>
                    <span className="gold mono" style={{fontSize:11, letterSpacing:'0.1em'}}>
                      {c.parentId ? '↳ ' : ''}{c.author || '-'}
                    </span>
                    <span className="mono dim-2" style={{fontSize:10}}>{c.date || (c.createdAt ? window.BGNJ_FMT.kstDateTime(c.createdAt) : '')}</span>
                  </div>
                  <div style={{lineHeight:1.7, whiteSpace:'pre-wrap'}}>{c.text || c.body || '-'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// 정지 사유 입력 모달 — prompt() 대신 GUI.
const SuspendDialog = ({ target, reason, onChange, onConfirm, onCancel }) => {
  // v00.077 — useModalGuard 통일 (ESC + body scroll lock + history pushState).
  // 사유 텍스트는 임시저장 prompt 가치 적음 → dirty=false.
  window.useModalGuard?.({ open: true, dirty: false, onClose: onCancel, onSaveDraft: null, label: '회원 정지' });
  return (
    <div role="dialog" aria-modal="true" aria-label="회원 정지"
      onClick={onCancel}
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1000, display:'grid', placeItems:'center', padding:24}}>
      <div onClick={(e) => e.stopPropagation()}
        style={{background:'var(--bg)', maxWidth:480, width:'100%', padding:24, border:'1px solid var(--line)', boxShadow:'0 16px 40px rgba(0,0,0,0.25)'}}>
        <h3 className="ko-serif" style={{fontSize:20, marginBottom:8}}>회원 정지</h3>
        <p className="dim" style={{fontSize:13, marginBottom:16, lineHeight:1.7}}>
          <strong className="gold">{target?.name || target?.email}</strong> 님을 정지하시겠습니까?
          정지된 회원은 즉시 로그아웃되고 다시 로그인할 수 없습니다.
        </p>
        <label className="field" style={{margin:0}}>
          <span className="field-label">정지 사유 (선택)</span>
          <textarea className="field-input" autoFocus rows={3}
            placeholder="예: 약관 위반, 스팸 등"
            value={reason}
            onChange={(e) => onChange(e.target.value)}/>
        </label>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:18}}>
          <button type="button" className="btn" onClick={onCancel}>취소</button>
          <button type="button" className="btn" onClick={onConfirm}
            style={{borderColor:'var(--danger)', color:'var(--danger)'}}>정지 적용</button>
        </div>
      </div>
    </div>
  );
};

// 감사 로그 details — JSON 덤프 대신 key/value 칩 리스트로 노출.
const AuditDetailsCell = ({ details }) => {
  if (!details || (typeof details === 'object' && !Object.keys(details).length)) {
    return <span className="dim-2">—</span>;
  }
  if (typeof details !== 'object') {
    return <span className="mono dim">{String(details)}</span>;
  }
  return (
    <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
      {Object.entries(details).map(([k, v]) => (
        <span key={k} style={{
          display:'inline-flex', gap:4, alignItems:'baseline',
          padding:'2px 8px', background:'var(--bg-2)', border:'1px solid var(--line)',
          fontSize:11,
        }}>
          <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.1em'}}>{k}</span>
          <span style={{color:'var(--ink)'}}>{
            typeof v === 'object' ? JSON.stringify(v) : String(v)
          }</span>
        </span>
      ))}
    </div>
  );
};

// 프로필 필드 한글 라벨 + 빈 값은 dash 로 노출 — JSON 덤프 대신 가독성 있는 카드.
const PROFILE_LABELS = {
  birthdate: '생년월일',
  phone: '전화번호',
  zip: '우편번호',
  addr1: '주소',
  addr2: '상세 주소',
  gender: '성별',
  interest: '관심 분야',
  recommender: '추천인',
};
const PROFILE_GENDER = { f: '여성', m: '남성', x: '기타/응답 안 함' };
const ProfileFields = ({ profile }) => {
  const entries = Object.entries(profile || {});
  if (!entries.length) return <span className="dim-2">—</span>;
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'140px 1fr', gap:'8px 16px',
      padding:'12px 14px', background:'var(--bg-2)', border:'1px solid var(--line)', fontSize:13,
    }}>
      {entries.map(([k, v]) => {
        const label = PROFILE_LABELS[k] || k;
        let value = v;
        if (k === 'gender' && v) value = PROFILE_GENDER[v] || v;
        const isEmpty = value === '' || value == null;
        return (
          <React.Fragment key={k}>
            <div className="dim-2 mono" style={{fontSize:11, paddingTop:2}}>{label}</div>
            <div style={{color: isEmpty ? 'var(--ink-3)' : 'var(--ink)', fontStyle: isEmpty ? 'italic' : 'normal'}}>
              {isEmpty ? '—' : String(value)}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// === Member Admin Panel ===========================================
const MemberAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [gradeFilter, setGradeFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all'); // all | active | suspended | admin
  const [sortKey, setSortKey] = React.useState('joined_desc'); // joined_desc/asc, name_asc/desc, posts_desc, comments_desc, email_asc
  const refresh = () => setTick((v) => v + 1);

  // Mount 시 + 변경 후 서버에서 회원 목록 갱신.
  React.useEffect(() => {
    window.BGNJ_AUTH.refreshUsers?.().then(() => refresh());
    const onRefresh = () => refresh();
    window.addEventListener('bgnj-users-refresh', onRefresh);
    return () => window.removeEventListener('bgnj-users-refresh', onRefresh);
  }, []);

  const users = React.useMemo(() => window.BGNJ_AUTH.listUsers(), [tick]);
  const grades = (window.BGNJ_STORES?.grades || []);

  // 필터 + 정렬 통합.
  const filtered = React.useMemo(() => {
    let list = users.slice();
    // 상태 필터
    if (statusFilter === 'active') list = list.filter((u) => !u.suspended);
    else if (statusFilter === 'suspended') list = list.filter((u) => u.suspended);
    else if (statusFilter === 'admin') list = list.filter((u) => u.isAdmin);
    // 등급 필터
    if (gradeFilter !== 'all') {
      list = list.filter((u) => u.gradeId === gradeFilter);
    }
    // 검색
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((u) =>
        String(u.name || '').toLowerCase().includes(q)
        || String(u.email || '').toLowerCase().includes(q)
        || String(u.id || '').toLowerCase().includes(q)
      );
    }
    // 정렬
    const cmpStr = (a, b) => String(a || '').localeCompare(String(b || ''), 'ko');
    const cmpDate = (a, b) => new Date(b || 0).getTime() - new Date(a || 0).getTime();
    const activityCount = (u, key) => {
      const a = window.BGNJ_AUTH.getActivity?.(u.id);
      return a?.[key] || 0;
    };
    list.sort((a, b) => {
      switch (sortKey) {
        case 'joined_asc':    return -cmpDate(a.joinedAt, b.joinedAt);
        case 'name_asc':      return cmpStr(a.name, b.name);
        case 'name_desc':     return -cmpStr(a.name, b.name);
        case 'email_asc':     return cmpStr(a.email, b.email);
        case 'posts_desc':    return activityCount(b, 'postCount') - activityCount(a, 'postCount');
        case 'comments_desc': return activityCount(b, 'commentCount') - activityCount(a, 'commentCount');
        case 'grade_desc':    return ((grades.find((g) => g.id === b.gradeId)?.level ?? 0) - (grades.find((g) => g.id === a.gradeId)?.level ?? 0));
        case 'joined_desc':
        default:              return cmpDate(a.joinedAt, b.joinedAt);
      }
    });
    return list;
  }, [users, gradeFilter, statusFilter, search, sortKey, grades, tick]);

  const selected = users.find((u) => u.id === selectedId) || null;
  const [serverActivity, setServerActivity] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    setServerActivity(null);
    if (!selected?.id) return () => {};
    Promise.resolve(window.BGNJ_AUTH.fetchActivity?.(selected.id)).then((a) => {
      if (!cancelled) setServerActivity(a);
    });
    return () => { cancelled = true; };
  }, [selected?.id]);
  const activity = selected ? (serverActivity || window.BGNJ_AUTH.getActivity(selected.id)) : null;

  const exportCsv = () => {
    const header = ['id','name','email','gradeId','isAdmin','suspended','joinedAt','postCount','commentCount','bookOrders','lectures','tours'];
    const rows = users.map((u) => {
      const a = window.BGNJ_AUTH.getActivity(u.id) || {};
      return [u.id, u.name, u.email, u.gradeId, u.isAdmin ? 'Y' : 'N', u.suspended ? 'Y' : 'N', u.joinedAt || '', a.postCount || 0, a.commentCount || 0, (a.bookOrders||[]).length, (a.lectures||[]).length, (a.tours||[]).length];
    });
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadCsv(`members-${new Date().toISOString().slice(0,10)}.csv`, csv);
  };

  const changeGrade = async (user, gradeId) => {
    try { await window.BGNJ_AUTH.setGrade(user.id, gradeId); refresh(); }
    catch (err) { window.BGNJ_TOAST.error(`등급 변경 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const toggleAdmin = async (user) => {
    if (!(await window.BGNJ_CONFIRM(`${user.name} 님의 관리자 권한을 ${user.isAdmin ? '해제' : '부여'}하시겠어요?`, { danger: true }))) return;
    try { await window.BGNJ_AUTH.toggleAdmin(user.id); refresh(); }
    catch (err) { window.BGNJ_TOAST.error(`관리자 권한 변경 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const [suspendTarget, setSuspendTarget] = React.useState(null);
  const [suspendReason, setSuspendReason] = React.useState('');
  const openSuspendDialog = (user) => { setSuspendTarget(user); setSuspendReason(''); };
  const submitSuspend = async () => {
    if (!suspendTarget) return;
    const target = suspendTarget;
    const reason = suspendReason.trim();
    setSuspendTarget(null); setSuspendReason('');
    try { await window.BGNJ_AUTH.suspendUser(target.id, reason); refresh(); }
    catch (err) { window.BGNJ_TOAST.error(`정지 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const suspendUser = (user) => openSuspendDialog(user);
  const unsuspend = async (user) => {
    if (!(await window.BGNJ_CONFIRM(`${user.name} 님의 정지를 해제하시겠어요?`, { danger: true }))) return;
    try { await window.BGNJ_AUTH.unsuspendUser(user.id); refresh(); }
    catch (err) { window.BGNJ_TOAST.error(`정지 해제 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const deleteUser = async (user) => {
    if (user.email === 'admin@admin.admin') { window.BGNJ_TOAST.error('기본 관리자 계정은 삭제할 수 없습니다.'); return; }
    if (!(await window.BGNJ_CONFIRM(`${user.name} (${user.email}) 계정을 정말 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.`, { danger: true }))) return;
    try { await window.BGNJ_AUTH.removeUser(user.id); setSelectedId(null); refresh(); }
    catch (err) { window.BGNJ_TOAST.error(`삭제 실패: ${err?.message || '알 수 없는 오류'}`); }
  };

  const gradeOf = (id) => grades.find((g) => g.id === id);
  const formatDate = (iso) => {
    if (!iso) return '-';
    try { return window.BGNJ_FMT.kstDateTime(iso); } catch { return iso; }
  };

  // ── 상세 ──
  if (selected && activity) {
    return (
      <div>
        <button type="button" className="btn btn-small" onClick={() => setSelectedId(null)} style={{marginBottom:20}}>← 회원 목록</button>

        <article className="card" style={{padding:24, marginBottom:18}}>
          <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:12}}>
            <div>
              <h2 className="ko-serif" style={{fontSize:24, marginBottom:4}}>
                {selected.name}
                <AuthorGradeBadge authorId={selected.id} author={selected.name} authorEmail={selected.email}/>
              </h2>
              <div className="mono dim-2" style={{fontSize:11}}>#{selected.id} · {selected.email}</div>
            </div>
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {selected.isAdmin && <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', color:'var(--secondary)', border:'1px solid var(--primary-dim)', padding:'2px 8px'}}>ADMIN</span>}
              {selected.suspended && <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', color:'var(--danger)', border:'1px solid var(--danger)', padding:'2px 8px'}}>SUSPENDED</span>}
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'180px 1fr', gap:'8px 24px', fontSize:13, lineHeight:1.8}}>
            <dt className="dim-2 mono" style={{fontSize:11}}>가입일</dt><dd>{formatDate(selected.joinedAt)}</dd>
            <dt className="dim-2 mono" style={{fontSize:11}}>회원 등급</dt>
            <dd>
              <select className="field-input" style={{maxWidth:240, padding:'4px 8px'}} value={selected.gradeId || ''}
                onChange={(e) => changeGrade(selected, e.target.value)}>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>{g.label} (Lv {g.level})</option>
                ))}
              </select>
              {selected.gradeChangedAt && <span className="dim-2 mono" style={{fontSize:10, marginLeft:8}}>최근 변경 {formatDate(selected.gradeChangedAt)}</span>}
            </dd>
            <dt className="dim-2 mono" style={{fontSize:11}}>관리자 권한</dt>
            <dd>
              <button type="button" className="btn btn-small" onClick={() => toggleAdmin(selected)}>
                {selected.isAdmin ? '관리자 권한 해제' : '관리자 권한 부여'}
              </button>
            </dd>
            <dt className="dim-2 mono" style={{fontSize:11}}>활성 동의</dt>
            <dd>{(() => {
              const labels = { terms: '이용약관·개인정보 처리방침', marketing: '마케팅 메일', thirdParty: '제3자 제공' };
              const active = selected.consents ? Object.entries(selected.consents).filter(([, v]) => v) : [];
              if (!active.length) return <span className="dim-2">—</span>;
              return active.map(([k]) => (
                <span key={k} className="badge" style={{marginRight:6, fontSize:11}}>{labels[k] || k}</span>
              ));
            })()}</dd>
            {selected.profile && Object.keys(selected.profile).length > 0 && (
              <>
                <dt className="dim-2 mono" style={{fontSize:11}}>프로필</dt>
                <dd>
                  <ProfileFields profile={selected.profile}/>
                </dd>
              </>
            )}
            {selected.suspended && selected.suspendedReason && (
              <>
                <dt className="dim-2 mono" style={{fontSize:11}}>정지 사유</dt>
                <dd className="dim">{selected.suspendedReason}</dd>
              </>
            )}
          </div>

          <div style={{marginTop:24, display:'flex', gap:8, flexWrap:'wrap'}}>
            {selected.suspended ? (
              <button type="button" className="btn btn-small" onClick={() => unsuspend(selected)}>정지 해제</button>
            ) : (
              <button type="button" className="btn btn-small" onClick={() => suspendUser(selected)}
                style={{borderColor:'var(--danger)', color:'var(--danger)'}}>계정 정지</button>
            )}
            <button type="button" className="btn btn-small" onClick={() => deleteUser(selected)}
              style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:'auto'}}>계정 삭제</button>
          </div>
        </article>

        {/* 활동 요약 */}
        <article className="card" style={{padding:20, marginBottom:18}}>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>ACTIVITY</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:12}}>
            {[
              { l: '게시글', v: activity.postCount },
              { l: '댓글', v: activity.commentCount },
              { l: '북마크', v: activity.bookmarkCount },
              { l: '책 주문', v: activity.bookOrders.length },
              { l: '강연 신청', v: activity.lectures.length },
              { l: '답사 신청', v: activity.tours.length },
              { l: '받은 알림', v: activity.notifications.length },
            ].map((s) => (
              <div key={s.l} className="card" style={{padding:12}}>
                <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:4}}>{s.l}</div>
                <div className="ko-serif gold-2" style={{fontSize:24}}>{s.v}</div>
              </div>
            ))}
          </div>
        </article>

        {/* 활동 상세 — 게시글 */}
        {activity.postCount > 0 && (
          <article className="card" style={{padding:20, marginBottom:18}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>POSTS · {activity.postCount}</div>
            <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
              {activity.posts.slice(0, 8).map((p) => (
                <li key={p.id} style={{display:'flex', justifyContent:'space-between', gap:12, fontSize:12, padding:'6px 0', borderBottom:'1px solid var(--line)'}}>
                  <span className="ko-serif">{p.title}</span>
                  <span className="mono dim-2">{p.date}</span>
                </li>
              ))}
              {activity.posts.length > 8 && (
                <li className="dim-2 mono" style={{fontSize:11, textAlign:'right'}}>외 {activity.posts.length - 8}건</li>
              )}
            </ul>
          </article>
        )}

        {activity.bookOrders.length > 0 && (
          <article className="card" style={{padding:20, marginBottom:18}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>BOOK ORDERS · {activity.bookOrders.length}</div>
            <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
              {activity.bookOrders.slice(0, 8).map((o) => (
                <li key={o.id} style={{display:'flex', justifyContent:'space-between', gap:12, fontSize:12, padding:'6px 0', borderBottom:'1px solid var(--line)'}}>
                  <span className="mono">{o.orderNo}</span>
                  <span>{o.version === 'KR' ? '국문' : '영문'} × {o.qty} · <span className="gold">{window.BGNJ_FMT.won(o.total)}</span></span>
                  <span className="mono dim-2">{o.status}</span>
                </li>
              ))}
            </ul>
          </article>
        )}

        {(activity.lectures.length > 0 || activity.tours.length > 0) && (
          <article className="card" style={{padding:20}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>LECTURES & TOURS</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}} className="member-act-grid">
              <div>
                <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.18em', marginBottom:6}}>강연 신청 · {activity.lectures.length}</div>
                <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:4}}>
                  {activity.lectures.slice(0, 6).map((r) => (
                    <li key={r.id} style={{fontSize:12, lineHeight:1.6}}>· {r.lecture?.topic || '강연'} <span className="dim-2 mono" style={{fontSize:10}}>· {r.status}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.18em', marginBottom:6}}>답사 신청 · {activity.tours.length}</div>
                <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:4}}>
                  {activity.tours.slice(0, 6).map((r) => (
                    <li key={r.id} style={{fontSize:12, lineHeight:1.6}}>· {r.tour?.title || '답사'} <span className="dim-2 mono" style={{fontSize:10}}>· {r.status}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        )}
        {suspendTarget && (
          <SuspendDialog target={suspendTarget} reason={suspendReason}
            onChange={setSuspendReason}
            onConfirm={submitSuspend}
            onCancel={() => { setSuspendTarget(null); setSuspendReason(''); }}/>
        )}
      </div>
    );
  }

  // ── 목록 ──
  return (
    <div>
      <div style={{display:'flex', gap:12, marginBottom:16, alignItems:'center', flexWrap:'wrap'}}>
        <input className="field-input" placeholder="이름·이메일 검색..." style={{flex:1, minWidth:240}}
          value={search} onChange={(e) => setSearch(e.target.value)}/>
        <select className="field-input" style={{maxWidth:160}}
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">전체 상태</option>
          <option value="active">활성</option>
          <option value="suspended">정지됨</option>
          <option value="admin">관리자만</option>
        </select>
        <select className="field-input" style={{maxWidth:200}}
          value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
          <option value="all">전체 등급</option>
          {grades.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
        </select>
        <select className="field-input" style={{maxWidth:200}}
          value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="joined_desc">가입일 ↓ (최신)</option>
          <option value="joined_asc">가입일 ↑ (오래된)</option>
          <option value="name_asc">이름 가나다</option>
          <option value="name_desc">이름 역순</option>
          <option value="email_asc">이메일 a→z</option>
          <option value="grade_desc">등급 ↓ (높은 순)</option>
          <option value="posts_desc">게시글 많은 순</option>
          <option value="comments_desc">댓글 많은 순</option>
        </select>
        <span className="mono dim-2" style={{fontSize:11}}>총 {users.length}명 · 표시 {filtered.length}명</span>
        <button type="button" className="btn btn-small" onClick={exportCsv}>CSV 다운로드</button>
      </div>

      <p className="dim" style={{fontSize:12, marginBottom:14}}>
        회원 이메일/이름은 <strong className="gold">개인식별정보(PII)</strong>입니다. 등급 변경·정지·삭제는 즉시 반영되며,
        본인이 로그인 중이면 세션도 자동으로 갱신/종료됩니다.
      </p>

      <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
        <thead>
          <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
            <th scope="col" style={{padding:12, textAlign:'left'}}>이름</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>이메일</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>등급</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>가입일</th>
            {/* v00.261 — 마지막 접속(로그인 + 세션 갱신 24h throttle). 처방침 고지 완료. */}
            <th scope="col" style={{padding:12, textAlign:'left'}}>마지막 접속</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>활동</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => {
            const g = gradeOf(u.gradeId);
            const a = window.BGNJ_AUTH.getActivity(u.id) || {};
            const activitySummary = `글 ${a.postCount || 0} · 댓글 ${a.commentCount || 0} · 주문 ${(a.bookOrders||[]).length} · 강연 ${(a.lectures||[]).length} · 답사 ${(a.tours||[]).length}`;
            return (
              <tr key={u.id} style={{borderBottom:'1px solid var(--line)'}}>
                <td style={{padding:12}}>
                  <button type="button" onClick={() => setSelectedId(u.id)}
                    style={{all:'unset', cursor:'pointer'}}>
                    <span className="ko-serif" style={{fontSize:14}}>{u.name}</span>
                    {u.isAdmin && <span className="mono" style={{fontSize:9, letterSpacing:'0.18em', color:'var(--secondary)', marginLeft:8}}>ADMIN</span>}
                    {u.suspended && <span className="mono" style={{fontSize:9, letterSpacing:'0.18em', color:'var(--danger)', marginLeft:8}}>정지</span>}
                  </button>
                </td>
                <td className="mono dim-2" style={{padding:12, fontSize:11}}>{u.email}</td>
                <td style={{padding:12}}>
                  {g ? (
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.14em', color: g.color || 'var(--primary)', border:`1px solid ${g.color || 'var(--primary-dim)'}`, padding:'1px 6px'}}>
                      {g.label}
                    </span>
                  ) : (
                    <span className="dim-2 mono" style={{fontSize:10}}>—</span>
                  )}
                </td>
                <td className="mono dim-2" style={{padding:12, fontSize:11}}>{u.joinedAt ? window.BGNJ_FMT.kstDate(u.joinedAt) : '-'}</td>
                {/* v00.261 — 마지막 접속: 30일 이내 상대시간 ('3일 전'), 그 외 절대 날짜.
                    null(스키마 미적용 또는 v00.261 이전 가입자 미접속) 시 '—'. */}
                <td className="mono dim-2" style={{padding:12, fontSize:11}}
                  title={u.lastLoginAt ? window.BGNJ_FMT.kstDateTime(u.lastLoginAt) : '기록 없음'}>
                  {u.lastLoginAt ? window.BGNJ_FMT.kstRelative(u.lastLoginAt) : <span className="dim-2">—</span>}
                </td>
                <td className="mono dim-2" style={{padding:12, fontSize:10, textAlign:'right'}}>{activitySummary}</td>
                <td style={{padding:12, textAlign:'right'}}>
                  <button type="button" className="btn btn-small" onClick={() => setSelectedId(u.id)}>상세</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="card dim" style={{padding:32, textAlign:'center', marginTop:14}}>
          조건에 맞는 회원이 없습니다.
        </div>
      )}
    </div>
  );
};

// v00.187 — pickImageWithR2Fallback / downloadBlob/Csv/Json / SubTabsView 모두 AdminShared.jsx 로 이동.
const pickImageWithR2Fallback = window.pickImageWithR2Fallback;
const downloadBlob = window.downloadBlob;
const downloadCsv = window.downloadCsv;
const downloadJson = window.downloadJson;
const SubTabsView = window.SubTabsView;

// === Activity Log Panel (v00.190) ==================================
// 사용자 보고 '관리자 활동 로그뿐 아니라 일반 회원 활동까지 모든 기록' — 통합 활동 로그.
// 다중 소스를 병합 시간 역순:
//   1) audit_log (admin actions + signup) via BGNJ_API.admin.audit.list
//   2) error_log (모든 사용자 오류) via BGNJ_API.admin.errorLog.list
//   3) 최근 게시글 / 댓글 (회원 활동) via 로컬 BGNJ_COMMUNITY 캐시
// 필터: 전체 / admin / signup / error / post / comment.
const ActivityLogPanel = () => {
  const [auditRows, setAuditRows] = React.useState([]);
  const [errorRows, setErrorRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all');
  const [refreshKey, setRefreshKey] = React.useState(0);
  // v00.190 추가: 검색 + 정렬 + 기간 필터 (사용자 보고 '필터+정렬+검색 꼭 넣어달라').
  const [search, setSearch] = React.useState('');
  const [sortKey, setSortKey] = React.useState('ts_desc'); // ts_desc / ts_asc / actor_asc / type_asc
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const [auditRes, errorRes] = await Promise.allSettled([
          window.BGNJ_API?.admin?.audit?.list?.({ limit: 300 }),
          window.BGNJ_API?.admin?.errorLog?.list?.({ limit: 200 }),
        ]);
        if (cancelled) return;
        const audits = (auditRes.status === 'fulfilled' && Array.isArray(auditRes.value?.entries)) ? auditRes.value.entries : [];
        const errors = (errorRes.status === 'fulfilled' && Array.isArray(errorRes.value?.entries)) ? errorRes.value.entries : [];
        setAuditRows(audits);
        setErrorRows(errors);
      } catch {} finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [refreshKey]);

  // 회원 활동 — 최근 게시글 (BGNJ_COMMUNITY 로컬 캐시).
  const recentPosts = React.useMemo(() => {
    try { return (window.BGNJ_COMMUNITY?.listPosts?.() || []).slice(0, 100); } catch { return []; }
  }, [refreshKey]);

  // 통합 entries — 공통 shape: { ts, type, actor, action, detail, source }.
  const merged = React.useMemo(() => {
    const out = [];
    auditRows.forEach((a) => {
      const action = String(a.action || '');
      // signup / grade.* / category.* / admin.* / lecture.* / tour.* / alarm.* 분류.
      const type = action.startsWith('user.signup') ? 'signup'
        : action.startsWith('admin.') ? 'admin'
        : action.startsWith('grade.') ? 'grade'
        : action.startsWith('category.') ? 'category'
        : action.startsWith('lecture.') ? 'content'
        : action.startsWith('tour.') ? 'content'
        : action.startsWith('alarm.') ? 'alarm'
        : 'admin';
      const details = a.details_json ? (() => { try { return JSON.parse(a.details_json); } catch { return null; } })() : null;
      out.push({
        ts: a.ts, type,
        actor: a.actor || '?',
        action, target: a.target || '',
        detail: details ? Object.entries(details).map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`).join(' · ') : '',
        ip: a.ip,
        source: 'audit',
      });
    });
    errorRows.forEach((e) => {
      out.push({
        ts: e.ts, type: 'error',
        actor: e.user_id || (e.user_agent || '').slice(0, 24) || 'anonymous',
        action: `${e.code || 'ERROR'} (${e.kind || ''})`,
        target: e.pathname || e.url || '',
        detail: e.message || '',
        ip: '',
        source: 'error',
      });
    });
    recentPosts.forEach((p) => {
      out.push({
        ts: p.createdAt || p.date || '', type: 'post',
        actor: p.author || '?',
        action: `post.create [${p.category || ''}]`,
        target: `post:${p.id}`,
        detail: p.title || '',
        ip: '',
        source: 'post',
      });
    });
    return out.sort((a, b) => String(b.ts || '').localeCompare(String(a.ts || '')));
  }, [auditRows, errorRows, recentPosts]);

  // v00.190 — 통합 필터: 유형 + 검색 + 기간 + 정렬.
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTs = dateFrom ? Date.parse(dateFrom + 'T00:00:00+09:00') : null;
    const toTs = dateTo ? Date.parse(dateTo + 'T23:59:59+09:00') : null;
    let rows = merged;
    if (filter !== 'all') rows = rows.filter((e) => e.type === filter);
    if (q) {
      rows = rows.filter((e) => {
        const haystack = `${e.actor || ''} ${e.action || ''} ${e.target || ''} ${e.detail || ''} ${e.ip || ''}`.toLowerCase();
        return haystack.includes(q);
      });
    }
    if (fromTs || toTs) {
      rows = rows.filter((e) => {
        const t = Date.parse(e.ts || '');
        if (isNaN(t)) return false;
        if (fromTs && t < fromTs) return false;
        if (toTs && t > toTs) return false;
        return true;
      });
    }
    // 정렬.
    const cmpStr = (a, b) => String(a || '').localeCompare(String(b || ''));
    rows = rows.slice().sort((a, b) => {
      switch (sortKey) {
        case 'ts_asc':    return cmpStr(a.ts, b.ts);
        case 'actor_asc': return cmpStr(a.actor, b.actor) || cmpStr(b.ts, a.ts);
        case 'type_asc':  return cmpStr(a.type, b.type) || cmpStr(b.ts, a.ts);
        case 'ts_desc':
        default:          return cmpStr(b.ts, a.ts);
      }
    });
    return rows;
  }, [merged, filter, search, dateFrom, dateTo, sortKey]);

  const TYPES = [
    { id: 'all', label: '전체', count: merged.length },
    { id: 'admin', label: '관리자', count: merged.filter((e) => e.type === 'admin').length },
    { id: 'signup', label: '회원가입', count: merged.filter((e) => e.type === 'signup').length },
    { id: 'grade', label: '등급', count: merged.filter((e) => e.type === 'grade').length },
    { id: 'category', label: '카테고리', count: merged.filter((e) => e.type === 'category').length },
    { id: 'content', label: '콘텐츠', count: merged.filter((e) => e.type === 'content').length },
    { id: 'alarm', label: '알람', count: merged.filter((e) => e.type === 'alarm').length },
    { id: 'post', label: '게시글', count: merged.filter((e) => e.type === 'post').length },
    { id: 'error', label: '오류', count: merged.filter((e) => e.type === 'error').length },
  ];

  const TYPE_COLOR = {
    admin: 'var(--primary-hover)',
    signup: 'var(--secondary)',
    grade: '#a855f7',
    category: '#0ea5e9',
    content: '#22c55e',
    alarm: '#f59e0b',
    post: '#94a3b8',
    error: 'var(--danger)',
  };
  const TYPE_LABEL = {
    admin: '관리자', signup: '가입', grade: '등급', category: '카테고리',
    content: '콘텐츠', alarm: '알람', post: '게시글', error: '오류',
  };

  return (
    <div>
      <AdminPanelHeader
        eyebrow="ACTIVITY · 활동 로그"
        title="통합 활동 로그"
        description="관리자 활동 + 회원 활동(가입/게시글) + 오류 보고를 시간 역순으로 통합. 트러블슈팅·운영 모니터링용. 칩으로 유형 필터."/>

      {/* 1행: 유형 필터 칩 + 새로고침 */}
      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:10}} role="tablist" aria-label="활동 유형 필터">
        {TYPES.map((t) => {
          const active = filter === t.id;
          return (
            <button key={t.id} type="button" role="tab" aria-selected={active}
              onClick={() => setFilter(t.id)}
              style={{
                padding:'5px 12px', fontSize:12,
                fontFamily:'var(--font-serif)',
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? 'var(--bg)' : 'var(--ink-2)',
                border:`1px solid ${active ? 'var(--primary)' : 'var(--line-2)'}`,
                borderRadius:999,
                cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap:6,
              }}>
              <span>{t.label}</span>
              <span className="mono" style={{fontSize:10, opacity: active ? 0.85 : 0.55}}>{t.count}</span>
            </button>
          );
        })}
        <button type="button" className="btn btn-small" onClick={() => setRefreshKey((v) => v + 1)}
          style={{marginLeft:'auto', padding:'4px 10px', fontSize:11}}>
          🔄 새로고침
        </button>
      </div>

      {/* 2행: 검색 + 기간 + 정렬 (v00.190 사용자 보고 — 모든 필터링 도구) */}
      <div style={{display:'grid', gridTemplateColumns:'minmax(220px, 1fr) auto auto auto', gap:10, marginBottom:14, alignItems:'center'}} className="activity-filter-row">
        <input
          type="text"
          className="field-input"
          placeholder="검색 (주체/액션/대상/상세/IP — 부분 일치)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="활동 로그 검색"
          style={{padding:'8px 12px', fontSize:13}}/>
        <input
          type="date"
          className="field-input"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          aria-label="시작일 (KST)"
          style={{padding:'8px 12px', fontSize:12, fontFamily:'var(--font-mono)'}}/>
        <input
          type="date"
          className="field-input"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          aria-label="종료일 (KST)"
          style={{padding:'8px 12px', fontSize:12, fontFamily:'var(--font-mono)'}}/>
        <select
          className="field-input"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          aria-label="정렬"
          style={{padding:'8px 12px', fontSize:12, fontFamily:'var(--font-mono)', minWidth:140}}>
          <option value="ts_desc">최신순 ↓</option>
          <option value="ts_asc">오래된순 ↑</option>
          <option value="actor_asc">주체 (가나다)</option>
          <option value="type_asc">유형순</option>
        </select>
      </div>
      {(search || dateFrom || dateTo) && (
        <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:10, flexWrap:'wrap'}}>
          <span className="mono dim-2" style={{fontSize:11, letterSpacing:'0.1em'}}>
            필터 적용: {filtered.length}건 (전체 {merged.length})
          </span>
          <button type="button" className="btn btn-small" onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); }}
            style={{padding:'2px 8px', fontSize:10}}>
            ✕ 필터 초기화
          </button>
        </div>
      )}

      {loading && (
        <p className="dim" style={{fontSize:13, padding:'12px 0'}}>⏳ 활동 로그 로딩 중…</p>
      )}

      {!loading && filtered.length === 0 ? (
        <AdminEmpty>해당 유형의 활동 기록이 없습니다.</AdminEmpty>
      ) : (
        <div style={{border:'1px solid var(--line)', overflow:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:840}}>
            <thead>
              <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.18em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                <th scope="col" style={{padding:12, textAlign:'left', minWidth:140}}>시간 (KST)</th>
                <th scope="col" style={{padding:12, textAlign:'left', minWidth:80}}>유형</th>
                <th scope="col" style={{padding:12, textAlign:'left', minWidth:160}}>주체</th>
                <th scope="col" style={{padding:12, textAlign:'left', minWidth:200}}>액션 / 대상</th>
                <th scope="col" style={{padding:12, textAlign:'left'}}>상세</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 500).map((e, i) => (
                <tr key={i} style={{borderBottom:'1px solid var(--line)'}}>
                  <td className="mono dim-2" style={{padding:'10px 12px', whiteSpace:'nowrap'}}>
                    {window.BGNJ_FMT?.kstShort?.(e.ts) || String(e.ts || '').slice(0, 19)}
                  </td>
                  <td style={{padding:'10px 12px'}}>
                    <span className="mono" style={{
                      fontSize:9, padding:'2px 7px',
                      letterSpacing:'0.12em', fontWeight:700,
                      border:`1px solid ${TYPE_COLOR[e.type] || 'var(--line-2)'}`,
                      color: TYPE_COLOR[e.type] || 'var(--ink-2)',
                    }}>{TYPE_LABEL[e.type] || e.type}</span>
                  </td>
                  <td className="mono" style={{padding:'10px 12px', fontSize:11, color:'var(--ink)'}}>
                    {e.actor}
                    {e.ip && <span className="dim-2" style={{marginLeft:8, fontSize:10}}>· {e.ip}</span>}
                  </td>
                  <td style={{padding:'10px 12px', fontFamily:'var(--font-mono)', fontSize:11}}>
                    <span style={{color:'var(--ink)'}}>{e.action}</span>
                    {e.target && <span className="dim-2" style={{marginLeft:8, fontSize:10}}>{e.target}</span>}
                  </td>
                  <td className="dim" style={{padding:'10px 12px', fontSize:12, lineHeight:1.5, wordBreak:'break-word', maxWidth:540}}>
                    {e.detail || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 500 && (
            <div className="dim-2 mono" style={{padding:'10px 14px', fontSize:11, textAlign:'center', borderTop:'1px solid var(--line)'}}>
              상위 500건만 표시. 더 오래된 기록은 [감사 로그] 또는 [오류 로그] 별도 패널에서 검색.
            </div>
          )}
        </div>
      )}

      <p className="dim-2" style={{fontSize:11, marginTop:12, lineHeight:1.7}}>
        ⓘ 데이터 소스: <code style={{padding:'1px 5px', background:'var(--bg-2)', border:'1px solid var(--line-2)'}}>audit_log</code>(D1 — 관리자 행동 + 회원가입) +
        <code style={{padding:'1px 5px', background:'var(--bg-2)', border:'1px solid var(--line-2)', marginLeft:6}}>error_log</code>(D1 — 오류 보고) +
        최근 게시글(BGNJ_COMMUNITY 캐시). 트러블슈팅 시 시간 역순으로 사고 발생 직전 활동을 추적.
      </p>
    </div>
  );
};

// === Internal Alarm Panel (v00.183) ================================
// 사용자 보고 '내부 인원들에게 알람을 보낼 수 있는 기능'.
// v00.191 — 그룹 선택 재설계 (사용자 보고 '특정 사용자 개인보다 그룹이 합리적').
// scope: 'all_admins' | 'all_members' | 'all_non_admins' | 'grade'.
const InternalAlarmPanel = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [scope, setScope] = React.useState('all_admins');
  const [selectedGrade, setSelectedGrade] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [resultMsg, setResultMsg] = React.useState('');
  const [excludeSelf, setExcludeSelf] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await window.BGNJ_API?.admin?.users?.list?.();
        if (cancelled) return;
        setUsers(Array.isArray(data?.users) ? data.users : []);
      } catch {} finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const admins = users.filter((u) => u.isAdmin || u.is_admin);
  // v00.191 — 등급별 회원 카운트 (그룹 선택 시 미리보기).
  const grades = (window.BGNJ_STORES?.grades || []).slice().sort((a, b) => (a.level || 0) - (b.level || 0));
  const gradeCounts = React.useMemo(() => {
    const counts = {};
    users.forEach((u) => {
      const gid = u.gradeId || u.grade_id || 'member';
      counts[gid] = (counts[gid] || 0) + 1;
    });
    return counts;
  }, [users]);
  const totalMembers = users.length;
  const totalNonAdmins = users.filter((u) => !(u.isAdmin || u.is_admin)).length;

  const send = async () => {
    if (!message.trim()) { setResultMsg('✗ 메시지를 입력해 주세요.'); return; }
    if (scope === 'select' && selectedIds.size === 0) { setResultMsg('✗ 수신자를 선택해 주세요.'); return; }
    const __confirmMsg = scope === 'all_admins'
      ? `모든 관리자(${admins.length}명${excludeSelf ? ' - 본인 제외' : ''})에게 알람을 보내시겠어요?`
      : `선택한 ${selectedIds.size}명에게 알람을 보내시겠어요?`;
    if (!(await window.BGNJ_CONFIRM(__confirmMsg, { danger: true }))) return;
    setSending(true); setResultMsg('');
    try {
      // v00.191 — 그룹 기반 recipients. scope: 'all_admins' / 'all_members' / 'all_non_admins' / 'grade'.
      let recipients;
      if (scope === 'grade' && selectedGrade) {
        recipients = { grade: selectedGrade };
      } else if (scope === 'all_admins' || scope === 'all_members' || scope === 'all_non_admins') {
        recipients = scope;
      } else {
        recipients = 'all_admins'; // 기본
      }
      const res = await window.BGNJ_API?.internalAlarm?.send?.({
        recipients, title: title.trim(), message: message.trim(), excludeSelf,
      });
      setResultMsg(`✓ ${res?.group ? res.group + ' — ' : ''}${res?.sent ?? 0}명에게 알람이 발송되었습니다.`);
      setTitle(''); setMessage('');
      setTimeout(() => setResultMsg(''), 4000);
    } catch (err) {
      setResultMsg('✗ 발송 실패: ' + (err?.message || '알 수 없는 오류'));
    } finally { setSending(false); }
  };

  // v00.191 — scope 별 미리보기 카운트 (전송 전 명확히).
  const scopeCount = (() => {
    if (scope === 'all_admins') return admins.length - (excludeSelf ? 1 : 0);
    if (scope === 'all_members') return totalMembers - (excludeSelf ? 1 : 0);
    if (scope === 'all_non_admins') return totalNonAdmins;
    if (scope === 'grade' && selectedGrade) return gradeCounts[selectedGrade] || 0;
    return 0;
  })();

  return (
    <div>
      <AdminPanelHeader
        eyebrow="ALARM · 내부 알람"
        title="내부 인원 알람 보내기"
        description="그룹 단위로 알람을 broadcast — 전체 관리자 / 전체 회원 / 일반 회원 / 특정 등급 중 선택. 수신자의 🔔 에 즉시 표시. D1 notifications 저장 (server-first)."/>

      <article className="admin-form-card" style={{padding:18, marginBottom:18}}>
        <div className="admin-form-card__eyebrow">📣 알람 작성</div>

        {/* v00.191 — 수신 그룹 (4가지 그룹 + 본인 제외) */}
        <fieldset style={{border:'1px solid var(--line)', padding:'12px 14px', marginBottom:14}}>
          <legend className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', padding:'0 6px'}}>수신 그룹</legend>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:8}}>
            {[
              { key: 'all_admins',     label: '전체 관리자',  count: admins.length,        desc: 'is_admin=1 모든 회원' },
              { key: 'all_members',    label: '전체 회원',    count: totalMembers,         desc: 'admin 포함 모든 회원' },
              { key: 'all_non_admins', label: '일반 회원만',  count: totalNonAdmins,       desc: 'admin 제외 일반 회원' },
              { key: 'grade',          label: '특정 등급',    count: scope === 'grade' && selectedGrade ? (gradeCounts[selectedGrade] || 0) : '—', desc: '아래 등급 select' },
            ].map((opt) => {
              const active = scope === opt.key;
              return (
                <label key={opt.key} style={{
                  display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer',
                  padding:'10px 12px',
                  border: `1px solid ${active ? 'var(--primary)' : 'var(--line-2)'}`,
                  background: active ? 'rgba(245,213,72,0.06)' : 'transparent',
                  transition:'border-color .12s, background .12s',
                }}>
                  <input type="radio" name="alarm-scope" checked={active}
                    onChange={() => setScope(opt.key)}
                    style={{marginTop:2}}/>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:13, fontWeight:600, color:'var(--ink)', display:'flex', justifyContent:'space-between', gap:8}}>
                      <span>{opt.label}</span>
                      <span className="mono gold" style={{fontSize:11, fontWeight:700}}>{opt.count}{typeof opt.count === 'number' ? '명' : ''}</span>
                    </div>
                    <div className="dim-2" style={{fontSize:11, marginTop:2, lineHeight:1.4}}>{opt.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
          {scope === 'grade' && (
            <div style={{marginTop:12, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
              <label htmlFor="alarm-grade" className="mono dim-2" style={{fontSize:11, letterSpacing:'0.1em'}}>등급 선택</label>
              <select id="alarm-grade" className="field-input"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                style={{maxWidth:280, padding:'6px 10px'}}>
                <option value="">— 등급 선택 —</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    Lv {g.level} · {g.label} ({gradeCounts[g.id] || 0}명)
                  </option>
                ))}
              </select>
              {selectedGrade && (
                <span className="mono" style={{fontSize:11, color:'var(--secondary)', fontWeight:700}}>
                  → {gradeCounts[selectedGrade] || 0}명 발송 예정
                </span>
              )}
            </div>
          )}
          <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer', marginTop:14, fontSize:12}}>
            <input type="checkbox" checked={excludeSelf} onChange={(e) => setExcludeSelf(e.target.checked)}/>
            <span>본인은 수신자에서 제외</span>
          </label>
        </fieldset>

        {/* 제목 + 메시지 */}
        <div className="field" style={{marginBottom:12}}>
          <label className="field-label" htmlFor="alarm-title">제목 (선택)</label>
          <input id="alarm-title" className="field-input" value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 환불 처리 요청 / 긴급 점검 안내"/>
        </div>
        <div className="field" style={{marginBottom:14}}>
          <label className="field-label" htmlFor="alarm-message">메시지 <span className="gold">*</span></label>
          <textarea id="alarm-message" className="field-input" rows={5} value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="알림 내용을 입력하세요."
            style={{fontFamily:'inherit', resize:'vertical', lineHeight:1.6}}/>
        </div>

        <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
          <button type="button" className="btn btn-gold" onClick={send}
            disabled={sending || !message.trim() || (scope === 'grade' && !selectedGrade) || scopeCount === 0}>
            {sending ? '발송 중…' : `📣 발송 (${scopeCount}명 예정)`}
          </button>
          <button type="button" className="btn btn-small" onClick={() => { setTitle(''); setMessage(''); setSelectedGrade(''); setResultMsg(''); }}>
            초기화
          </button>
          {resultMsg && (
            <span className="mono" style={{fontSize:12, fontWeight:700,
              color: resultMsg.startsWith('✗') ? 'var(--danger)' : 'var(--secondary)'}}>{resultMsg}</span>
          )}
        </div>
      </article>

      <p className="dim-2" style={{fontSize:11, lineHeight:1.7}}>
        ⓘ 알람은 D1 <code style={{padding:'1px 5px', background:'var(--bg-2)', border:'1px solid var(--line-2)'}}>notifications</code> 테이블에 type=<code style={{padding:'1px 5px', background:'var(--bg-2)', border:'1px solid var(--line-2)'}}>internal_alarm</code> 으로 저장됩니다.
        수신자는 헤더의 알림 종(🔔) 에서 즉시 확인할 수 있습니다.
      </p>
    </div>
  );
};

// === Community Posts Admin Panel (v00.180 추출) =====================
// 사용자 코드 리뷰 룰 1번 (DRY): 인라인 JSX 였던 게시글 관리 부분을 별도 컴포넌트로.
// 자체 state(검색/필터/선택/일괄/모달) + 핸들러(export/delete/bulk) 모두 내장.
// 부모(AdminPage) 는 posts (allCommunityPosts) + onChange (refresh trigger) 만 전달.
// v00.264.003 — admin 게시글 패널 페이지당 갯수 선택. 홈과 동일 옵션. localStorage 보존.
const ADMIN_POSTS_PER_PAGE_OPTIONS = [10, 30, 50, 100];
const ADMIN_POSTS_PER_PAGE_LS_KEY = 'bgnj_admin_posts_per_page';
const ADMIN_POSTS_PER_PAGE_DEFAULT = 30;

const CommunityPostsAdminPanel = ({ posts, onChange }) => {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [selectedIds, setSelectedIds] = React.useState(new Set());
  const [viewingId, setViewingId] = React.useState(null);
  const [bulkCat, setBulkCat] = React.useState('');
  const [bulkPrefix, setBulkPrefix] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSizeState] = React.useState(() => {
    try {
      const v = Number(localStorage.getItem(ADMIN_POSTS_PER_PAGE_LS_KEY));
      return ADMIN_POSTS_PER_PAGE_OPTIONS.includes(v) ? v : ADMIN_POSTS_PER_PAGE_DEFAULT;
    } catch { return ADMIN_POSTS_PER_PAGE_DEFAULT; }
  });
  const setPageSize = (n) => {
    setPageSizeState(n);
    try { localStorage.setItem(ADMIN_POSTS_PER_PAGE_LS_KEY, String(n)); } catch {}
    setPage(1);
  };

  const visible = React.useMemo(() => posts.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || String(p.author || '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || p.categoryId === filter;
    return matchSearch && matchFilter;
  }), [posts, search, filter]);

  // 검색/필터 변경 시 page 리셋.
  React.useEffect(() => { setPage(1); }, [search, filter]);

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pagePosts = visible.slice(pageStart, pageStart + pageSize);

  const exportCsv = () => {
    downloadCsv(`community-posts-${new Date().toISOString().slice(0, 10)}.csv`, window.BGNJ_COMMUNITY.exportCsv());
  };

  const removeOne = async (post) => {
    if (!(await window.BGNJ_CONFIRM(`"${post.title}" 게시글을 삭제하시겠어요?`, { danger: true }))) return;
    window.BGNJ_COMMUNITY.deletePost(post.id);
    setSelectedIds((prev) => { const next = new Set(prev); next.delete(post.id); return next; });
    onChange?.();
  };

  const bulkRemove = async () => {
    if (selectedIds.size === 0) return;
    if (!(await window.BGNJ_CONFIRM(`선택한 ${selectedIds.size}개 게시글을 삭제할까요?`, { danger: true }))) return;
    selectedIds.forEach((id) => window.BGNJ_COMMUNITY.deletePost(id));
    setSelectedIds(new Set());
    onChange?.();
  };

  const bulkMove = () => {
    if (selectedIds.size === 0) return;
    if (!bulkCat) { window.BGNJ_TOAST.error('이동할 게시판을 선택하세요.'); return; }
    const cat = window.BGNJ_STORES.categories.find((c) => c.id === bulkCat);
    if (!cat) return;
    selectedIds.forEach((id) => window.BGNJ_COMMUNITY.updatePost(id, { categoryId: cat.id, category: cat.label }));
    setSelectedIds(new Set());
    setBulkCat('');
    onChange?.();
  };

  const bulkApplyPrefix = () => {
    if (selectedIds.size === 0) return;
    const next = bulkPrefix.trim();
    selectedIds.forEach((id) => window.BGNJ_COMMUNITY.updatePost(id, { prefix: next || null }));
    setSelectedIds(new Set());
    setBulkPrefix('');
    onChange?.();
  };

  return (
    <div>
      {/* 게시판 칩 (검색 위) */}
      <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:12}} role="tablist" aria-label="게시판 필터">
        {[{ id: 'all', label: '전체', count: posts.length }]
          .concat(window.BGNJ_STORES.categories
            .filter((item) => item.boardType === 'community')
            .map((c) => ({ id: c.id, label: c.label, count: posts.filter((p) => p.categoryId === c.id).length })))
          .map((chip) => {
            const active = filter === chip.id;
            return (
              <button key={chip.id} type="button" role="tab" aria-selected={active}
                onClick={() => { setFilter(chip.id); setSelectedIds(new Set()); }}
                style={{
                  padding: '6px 14px', fontSize: 12,
                  fontFamily: 'var(--font-serif)',
                  background: active ? 'var(--primary)' : 'transparent',
                  color: active ? 'var(--bg)' : 'var(--ink-2)',
                  border: `1px solid ${active ? 'var(--primary)' : 'var(--line-2)'}`,
                  borderRadius: 999,
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                <span>{chip.label}</span>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '0.05em', opacity: active ? 0.85 : 0.55 }}>{chip.count}</span>
              </button>
            );
          })}
      </div>
      <div style={{display:'flex', gap:12, marginBottom:16, alignItems:'center', flexWrap:'wrap'}}>
        <label htmlFor="post-search" className="sr-only">게시글 검색</label>
        <input id="post-search" className="field-input" placeholder="제목 또는 작성자 검색..." style={{flex:1, minWidth:200}}
          value={search} onChange={(e) => setSearch(e.target.value)}/>
        <label htmlFor="admin-post-per-page" className="sr-only">한 페이지 게시글 수</label>
        <select id="admin-post-per-page" className="field-input"
          value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
          style={{padding:'10px 12px', fontSize:12, cursor:'pointer'}}
          title="한 페이지에 표시할 게시글 갯수">
          {ADMIN_POSTS_PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}개</option>
          ))}
        </select>
        <button type="button" className="btn btn-small" onClick={exportCsv}>CSV 다운로드</button>
      </div>

      {/* 일괄 작업 바 */}
      {selectedIds.size > 0 && (
        <div style={{display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'rgba(59,130,246,0.07)', border:'1px solid var(--primary-dim)', marginBottom:12, flexWrap:'wrap'}}>
          <span className="mono gold" style={{fontSize:11}}>{selectedIds.size}개 선택됨</span>
          <button type="button" className="btn btn-small" style={{borderColor:'var(--danger)', color:'var(--danger)'}} onClick={bulkRemove}>선택 삭제</button>
          <span aria-hidden="true" style={{width:1, alignSelf:'stretch', background:'var(--line)'}}/>
          <select className="field-input" style={{maxWidth:160, padding:'4px 8px'}} value={bulkCat} onChange={(e) => setBulkCat(e.target.value)}>
            <option value="">게시판 선택...</option>
            {window.BGNJ_STORES.categories.filter((c) => c.boardType === 'community').map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <button type="button" className="btn btn-small btn-gold" onClick={bulkMove}>이동</button>
          <span aria-hidden="true" style={{width:1, alignSelf:'stretch', background:'var(--line)'}}/>
          <input type="text" className="field-input" style={{maxWidth:140, padding:'4px 8px'}} placeholder="말머리 (비우면 제거)" value={bulkPrefix} onChange={(e) => setBulkPrefix(e.target.value)} aria-label="일괄 적용할 말머리"/>
          <button type="button" className="btn btn-small btn-gold" onClick={bulkApplyPrefix}>말머리 적용</button>
          <button type="button" className="btn btn-small" style={{marginLeft:'auto'}} onClick={() => setSelectedIds(new Set())}>선택 해제</button>
        </div>
      )}

      <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
        <thead>
          <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
            <th scope="col" style={{padding:'12px 8px', textAlign:'center', width:36}}>
              <input type="checkbox"
                checked={pagePosts.length > 0 && pagePosts.every((p) => selectedIds.has(p.id))}
                onChange={(e) => {
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    if (e.target.checked) pagePosts.forEach((p) => next.add(p.id));
                    else pagePosts.forEach((p) => next.delete(p.id));
                    return next;
                  });
                }}
                aria-label="현재 페이지 전체 선택"/>
            </th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>ID</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>분류</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>말머리</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>제목</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>작성자</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>날짜</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
          </tr>
        </thead>
        <tbody>
          {pagePosts.map((p) => (
            <tr key={p.id} style={{borderBottom:'1px solid var(--line)', background: selectedIds.has(p.id) ? 'rgba(245,213,72,0.04)' : undefined}}>
              <td style={{padding:'14px 8px', textAlign:'center'}}>
                <input type="checkbox" checked={selectedIds.has(p.id)}
                  onChange={(e) => {
                    setSelectedIds((prev) => {
                      const next = new Set(prev);
                      if (e.target.checked) next.add(p.id); else next.delete(p.id);
                      return next;
                    });
                  }}
                  aria-label={`"${p.title}" 선택`}/>
              </td>
              <td className="mono dim-2" style={{padding:14}}>#{String(p.id).padStart(4,'0')}</td>
              <td style={{padding:14}}><span className="badge" style={{fontSize:9}}>{p.category}</span></td>
              <td style={{padding:14}}>
                {p.prefix ? <span className="mono" style={{fontSize:9, padding:'1px 6px', border:'1px solid var(--primary-dim)', color:'var(--secondary)'}}>{p.prefix}</span> : <span className="dim-2" style={{fontSize:10}}>—</span>}
              </td>
              <td className="ko-serif" style={{padding:14, fontSize:14}}>{p.title}</td>
              <td className="dim mono" style={{padding:14}}>{p.author}</td>
              <td className="mono dim-2" style={{padding:14}}>{p.date}</td>
              <td style={{padding:14, textAlign:'right', display:'flex', justifyContent:'flex-end', gap:8}}>
                <button type="button" className="btn btn-small" onClick={() => setViewingId(p.id)}>열기</button>
                <button type="button" className="btn btn-small" onClick={() => removeOne(p)}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {visible.length === 0 && (
        <div className="card" style={{padding:24, marginTop:16, textAlign:'center'}}>
          조건에 맞는 게시글이 없습니다.
        </div>
      )}

      {/* v00.264.003 — admin 패널 페이지네이션 (홈과 동일 스타일) */}
      {visible.length > 0 && totalPages > 1 && (
        <nav aria-label="게시글 페이지 이동" style={{display:'flex', justifyContent:'center', alignItems:'center', gap:6, marginTop:18, flexWrap:'wrap'}}>
          <button type="button" className="btn btn-small"
            onClick={() => setPage(Math.max(1, safePage - 1))}
            disabled={safePage <= 1}>← 이전</button>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
            <button key={n} type="button" className="btn btn-small"
              aria-current={n === safePage ? 'page' : undefined}
              onClick={() => setPage(n)}
              style={{
                borderColor: n === safePage ? 'var(--primary)' : 'var(--line)',
                color: n === safePage ? 'var(--primary)' : 'var(--ink-2)',
                background: n === safePage ? 'rgba(245,213,72,0.08)' : 'transparent',
                minWidth: 36,
              }}>{n}</button>
          ))}
          <button type="button" className="btn btn-small"
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage >= totalPages}>다음 →</button>
        </nav>
      )}
      {visible.length > 0 && (
        <div className="mono dim-2" style={{textAlign:'center', fontSize:10, letterSpacing:'0.2em', marginTop:8}}>
          전체 {visible.length}건 · {safePage}/{totalPages} 페이지
        </div>
      )}

      {viewingId && (
        <PostViewerModal postId={viewingId} onClose={() => setViewingId(null)}/>
      )}
    </div>
  );
};

// === Admin Page ===================================================
// 데이터 원칙: 모든 콘텐츠는 BGNJ_* 헬퍼 경유 (D1 source-of-truth). BANGINOJA_DATA 직접 참조 금지.
const AdminPage = ({ go }) => {
  const G = window.BGNJ_GUARD;
  const [tab, setTab] = React.useState("대시보드");
  const [kmsTab, setKmsTab] = React.useState("기능정의서");
  // v00.180 — postSearch/postFilter/selectedPostIds/viewingPostId/bulkTargetCat/bulkTargetPrefix
  // 모두 CommunityPostsAdminPanel 내부 state 로 이전.
  const [postRefreshKey, setPostRefreshKey] = React.useState(0);
  const [versionPage, setVersionPage] = React.useState(1);

  // v00.195 — 사용자 보고 '가입자 2명인데 추이 차트 0'.
  // root cause: allUsers memo 가 postRefreshKey 만 의존 → BGNJ_AUTH.refreshUsers 가 발화하는
  // 'bgnj-users-refresh' 이벤트는 postRefreshKey 증가 안 시킴 → memo 가 빈 _usersCache 로 영구 stuck.
  // 해결: AdminPage 마운트 시 refreshUsers 직접 호출 + 모든 store 변경 이벤트를 postRefreshKey 로 통합.
  React.useEffect(() => {
    window.BGNJ_AUTH?.refreshUsers?.();
    const bump = () => setPostRefreshKey((v) => v + 1);
    const events = [
      'bgnj-users-refresh',
      'bgnj-posts-refresh',
      'bgnj-columns-refresh',
      'bgnj-books-refresh',
      'bgnj-book-orders-refresh',
    ];
    events.forEach((e) => window.addEventListener(e, bump));
    return () => events.forEach((e) => window.removeEventListener(e, bump));
  }, []);

  const allCommunityPosts = React.useMemo(() => window.BGNJ_COMMUNITY.listPosts(), [postRefreshKey]);
  const allUsers = React.useMemo(() => window.BGNJ_AUTH.listUsers(), [postRefreshKey]);
  const allColumns = React.useMemo(() => G.arr(() => window.BGNJ_COLUMNS?.listPublic?.()), [postRefreshKey]);
  // v00.079 — D1.comments 가 단독 source. 서버 fetch 결과(BGNJ_COMMUNITY._commentsCache) 합산.
  // _commentsCache 는 게시글 본문 모달 열 때 채워지므로 대시보드에선 0 일 수 있음 — 정확한 카운트는 서버 metrics 사용 권장.
  const totalComments = React.useMemo(
    () => Object.values(window.BGNJ_COMMUNITY?._commentsCache || {}).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0),
    [postRefreshKey]
  );
  const allBookOrders = React.useMemo(() => window.BGNJ_BOOK_ORDERS?.listAll?.() || [], [postRefreshKey]);
  const pendingBookOrders = allBookOrders.filter((o) => o.status === 'pending_payment').length;
  const refundRequestedOrders = allBookOrders.filter((o) => o.status === 'refund_requested').length;
  const dashboardStats = React.useMemo(() => {
    // v00.157 — 호버 popover 용 details 계산. 모든 카드에 분포·세부 숫자.
    const adminCount = allUsers.filter((u) => u.isAdmin).length;
    const superAdminCount = allUsers.filter((u) => u.isSuperAdmin).length;
    const userCount = allUsers.length - adminCount;
    // v00.194 — 같은 'createdAt' vs 'joinedAt' 버그 (위 DashboardPanel 와 동일 원인).
    const userToday = _countSince(allUsers, 'joinedAt', 1);
    const userWeek = _countSince(allUsers, 'joinedAt', 7);
    const userMonth = _countSince(allUsers, 'joinedAt', 30);

    const postToday = _countSince(allCommunityPosts, 'createdAt', 1);
    const postWeek = _countSince(allCommunityPosts, 'createdAt', 7);
    const postMonth = _countSince(allCommunityPosts, 'createdAt', 30);
    const postCatCounts = {};
    allCommunityPosts.forEach((p) => {
      const k = p.category || p.categoryId || '미분류';
      postCatCounts[k] = (postCatCounts[k] || 0) + 1;
    });
    const topCats = Object.entries(postCatCounts).sort((a,b) => b[1]-a[1]).slice(0, 5);
    const avgComments = allCommunityPosts.length > 0
      ? (totalComments / allCommunityPosts.length).toFixed(1)
      : '0';

    const userColsAll = (window.BGNJ_STORES.userColumns || []);
    const colsPublished = userColsAll.filter((c) => (c.status || 'published') === 'published').length;
    const colsDraft = userColsAll.filter((c) => c.status === 'draft').length;
    const colsScheduled = userColsAll.filter((c) => c.status === 'scheduled').length;
    const colsArchived = userColsAll.filter((c) => c.status === 'archived').length;

    const orderStatuses = ['pending_payment', 'paid', 'shipped', 'delivered', 'refund_requested', 'cancelled'];
    const orderStatusLabel = { pending_payment: '입금 대기', paid: '입금 확인', shipped: '배송중', delivered: '배송 완료', refund_requested: '환불 신청', cancelled: '취소' };
    const orderCounts = orderStatuses.map((s) => ({
      label: orderStatusLabel[s] || s,
      value: allBookOrders.filter((o) => o.status === s).length,
    }));

    return [
      {
        l: "전체 회원", v: String(allUsers.length),
        d: `관리자 ${adminCount}명 포함`, p: true,
        details: [
          { label: '일반 회원',    value: userCount },
          { label: '관리자',       value: adminCount },
          { label: '슈퍼 관리자',  value: superAdminCount },
          { label: '오늘 가입',    value: userToday },
          { label: '최근 7일 가입', value: userWeek },
          { label: '최근 30일 가입', value: userMonth },
        ],
      },
      {
        l: "커뮤니티 게시글", v: String(allCommunityPosts.length),
        d: `댓글 ${totalComments}개 누적`, p: true,
        details: [
          { label: '오늘 작성',    value: postToday },
          { label: '최근 7일',     value: postWeek },
          { label: '최근 30일',    value: postMonth },
          { label: '평균 댓글/글', value: avgComments },
          ...topCats.map(([k, v]) => ({ label: `· ${k}`, value: v })),
        ],
      },
      {
        l: "공개 칼럼", v: String(allColumns.length),
        d: `관리자 발행 ${colsPublished}건 · 임시/예약 ${colsDraft + colsScheduled}건`, p: true,
        details: [
          { label: '게시 (published)',    value: colsPublished },
          { label: '임시 (draft)',         value: colsDraft },
          { label: '예약 (scheduled)',     value: colsScheduled },
          { label: '보관 (archived)',      value: colsArchived },
          { label: '관리자 칼럼 총합',      value: userColsAll.length },
        ],
      },
      {
        l: "도서 주문", v: String(allBookOrders.length),
        d: `입금 대기 ${pendingBookOrders}건${refundRequestedOrders > 0 ? ` · 환불 신청 ${refundRequestedOrders}건` : ''}`,
        p: pendingBookOrders === 0 && refundRequestedOrders === 0,
        details: orderCounts,
      },
    ];
  }, [allUsers, allCommunityPosts, totalComments, allColumns, allBookOrders, pendingBookOrders, refundRequestedOrders]);
  const latestCommunityPost = allCommunityPosts[0] || null;
  const latestColumn = allColumns[0] || null;
  // v00.180 — visibleCommunityPosts 도 CommunityPostsAdminPanel 내부로 이전.

  // v00.146 — 사이드바 그룹 재구성. 사용자 요청 '관리자 그룹핑을 다시 고려해줘'.
  // 핵심 원칙: 비슷한 일을 하는 메뉴를 인접하게. 데이터 분석 = 요약, 사용자 활동 = 커뮤니티, 콘텐츠 ≠ 프로그램.
  // v00.165 — 9 그룹 → 8 그룹 (프로그램 + 쇼핑 머지). collapsible 로 시각 부하 절감.
  const tabGroups = [
    { group: "요약",          items: ["대시보드", "사용자 여정"] },
    { group: "콘텐츠",        items: ["뱅기노자 칼럼", "추천 여행지", "먹고 놀자", "자고 놀자", "사고 놀자"] },
    { group: "프로그램·쇼핑", items: ["강연", "투어 프로그램", "책 카탈로그", "책 주문"] },
    // v00.267 — 한켠(자고 놀자) 숙소 예약 PMS. 찾기 쉽게 독립 그룹으로 분리.
    { group: "한켠 숙소",     items: ["한켠 예약"] },
    // v00.177 — 사용자 보고 '커뮤니티게시판이랑 커뮤니티랑 겹쳐 매우 불편'. 단일 [커뮤니티] sub-tab 통합 (게시글/게시판/신고).
    { group: "커뮤니티",      items: ["커뮤니티"] },
    { group: "회원",          items: ["회원", "회원 등급"] },
    // v00.166 — 사이트 설정 7 항목을 단일 "사이트 설정" 으로 머지. SubTabsView 가 내부에서 7 sub-tab 노출.
    { group: "사이트 설정",   items: ["사이트 설정"] },
    { group: "개인정보·법무", items: ["정보주체 권리", "동의 관리", "처리활동(ROPA)", "쿠키·추적", "보안 사고", "보유·파기", "국외 이전", "감사 로그"] },
    // v00.171 — '데이터 정리' (LegacyMigrationPanel) 폐기. 사용자 보고 '필요없으면 모두 다 지워'. 마이그레이션 완료 (v00.123).
    // v00.183 — 내부 인원 알람 항목 추가. v00.190 — 활동 로그 추가.
    { group: "시스템",        items: ["활동 로그", "내부 알람", "버전 기록", "KMS", "오류 로그", "오류 페이지 미리보기", "설정"] },
  ];

  const exportMemberData = (m) => {
    const snapshot = {
      exported_at: new Date().toISOString(),
      legal_basis: "GDPR Art.15 / PIPA §35",
      subject: m,
      consents: m.consents.map(k => PRIVACY_DATA.consentDefs.find(c => c.key === k)).filter(Boolean),
      processing_activities: PRIVACY_DATA.ropa,
      retention: PRIVACY_DATA.retentionPolicies,
    };
    downloadJson(`dsr-access-${m.id}-${new Date().toISOString().slice(0,10)}.json`, snapshot);
  };

  // v00.180 — 게시글 export/delete/bulk* 핸들러 모두 CommunityPostsAdminPanel 로 이전. AdminPage 는 onChange 콜백으로 새로고침만.

  // 모바일 사이드바 drawer 상태 — ≤900px 에서 햄버거 토글로 사이드바 슬라이드.
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  // 탭 변경 시 자동 닫힘 + Esc 닫기 + body scroll lock.
  React.useEffect(() => { setSidebarOpen(false); }, [tab, kmsTab]);

  // v00.165 — 사이드바 그룹 collapsible. 33 개 탭 동시 노출 → 시각 부하. 현재 탭의 그룹만 디폴트 펼침.
  const _findGroup = React.useCallback((tabName) => {
    const g = tabGroups.find((grp) => grp.items.includes(tabName));
    return g ? g.group : tabGroups[0].group;
  }, [tabGroups]);
  const currentGroup = React.useMemo(() => _findGroup(tab), [_findGroup, tab]);
  // v00.267 — 현재 탭 그룹 + 한켠 숙소 그룹은 기본 펼침(신규 기능 발견성).
  const [openGroups, setOpenGroups] = React.useState(() => new Set([_findGroup(tab), "한켠 숙소"]));
  // 다른 곳에서 setTab 호출로 탭 바뀌면 그 그룹 자동 펼침 (이미 펼쳐져 있으면 그대로).
  React.useEffect(() => {
    setOpenGroups((prev) => {
      if (prev.has(currentGroup)) return prev;
      const next = new Set(prev);
      next.add(currentGroup);
      return next;
    });
  }, [currentGroup]);
  const toggleGroup = (name) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  // v00.165 — 사이드바 항목 클릭 시 admin-main 영역 / 윈도우 스크롤 최상단.
  // 사용자 요청: '사이드 메뉴를 클릭하면 자동으로 제일 위로 올라갈수있게'.
  const handleTabClick = React.useCallback((nextTab) => {
    setTab(nextTab);
    // 다음 paint 에 스크롤 (탭 컨텐츠 마운트 후).
    requestAnimationFrame(() => {
      try {
        const main = document.querySelector('.admin-main');
        if (main && typeof main.scrollTo === 'function') main.scrollTo({ top: 0, behavior: 'smooth' });
        if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {}
    });
  }, []);
  React.useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    const onResize = () => { if (window.innerWidth > 900) setSidebarOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    // v00.260 — Shell.jsx 의 글로벌 BGNJ_SCROLL_LOCK 카운터 사용.
    // 이전 prev 스냅샷 패턴은 다른 모달과 겹치면 'hidden' 영구 잠김 회귀 발생.
    window.BGNJ_SCROLL_LOCK?.lock?.();
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      window.BGNJ_SCROLL_LOCK?.unlock?.();
    };
  }, [sidebarOpen]);

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : ''}`} style={{display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'calc(100vh - 72px)', position:'relative'}}>
      {/* 모바일 햄버거 — ≤900px 에서만 보임 (CSS) */}
      <button
        type="button"
        className="admin-sidebar-toggle"
        aria-label={sidebarOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={sidebarOpen}
        aria-controls="admin-sidebar"
        onClick={() => setSidebarOpen((v) => !v)}>
        <span className="nav-toggle-bars" aria-hidden="true"/>
      </button>
      {/* 모바일 백드롭 — 클릭 시 닫힘 */}
      {sidebarOpen && <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true"/>}
      {/* Sidebar */}
      <aside id="admin-sidebar" aria-label="관리자 메뉴" className="admin-sidebar" style={{background:'var(--bg-2)', borderRight:'1px solid var(--line)', padding:'32px 0', overflowY:'auto'}}>
        <div style={{padding:'0 24px 24px', borderBottom:'1px solid var(--line)'}}>
          {/* v00.192 — 사이드바 제일 위쪽에 현재 홈페이지 버전.
              v00.238 — 사용자 민원 '좌측 메뉴 가독성 안 좋다'. 노란 primary 텍스트가 흰 배경에서
              대비 미달 → ink-2 슬레이트 + bg-3 배경으로 교체. KMS §2 옐로우 5% 룰 정합. */}
          <div style={{
            display:'inline-block', padding:'3px 10px', marginBottom:10,
            border:'1px solid var(--line-2)', background:'var(--bg-3)',
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:700,
            letterSpacing:'0.12em', color:'var(--ink-2)',
          }}>
            v{window.BGNJ_VERSION?.version || '?'} · {window.BGNJ_VERSION?.build || '?'}
          </div>
          <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', color:'var(--ink-3)'}}>◆ ADMIN CONSOLE</div>
          <div className="ko-serif" style={{fontSize:20, marginTop:8, color:'var(--ink)'}}>관리자</div>
          <div className="mono" style={{fontSize:11, marginTop:4, color:'var(--ink-3)'}}>contact@bgnj.net</div>
          <div style={{marginTop:12, padding:'8px 10px', background:'var(--bg-3)', border:'1px solid var(--line-2)', fontFamily:'var(--font-mono)', fontSize:10, color:'var(--ink-2)', letterSpacing:'0.15em'}}>
            DPO · contact@bgnj.net
          </div>
          <div className="mono" style={{fontSize:10, marginTop:6, letterSpacing:'0.1em', color:'var(--ink-3)'}}>적용법: GDPR + PIPA</div>
          <div className="mono" style={{fontSize:10, letterSpacing:'0.1em', color:'var(--ink-3)'}}>최근 DPIA: 2026.03.02</div>
        </div>
        {/* v00.165 collapsible 그룹 · v00.216 시각 위계 강화: 그룹 헤더-서브 들여쓰기·가이드 라인·활성 표시 명료화 */}
        {tabGroups.map(grp => {
          const isOpen = openGroups.has(grp.group);
          const hasCurrent = grp.items.includes(tab);
          return (
            <div key={grp.group} style={{padding:'2px 0'}}>
              <button
                type="button"
                onClick={() => toggleGroup(grp.group)}
                aria-expanded={isOpen}
                className="mono"
                style={{
                  width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'12px 24px',
                  // v00.242 — 사용자 민원 '좌측 메뉴 가독성'. mono 11px → 12px + ink 강도 ↑.
                  // 활성 그룹은 secondary 보다 ink + 좌측 4px primary border 로 시각 위계 명료화.
                  fontSize:12, fontWeight:700, letterSpacing:'0.18em',
                  color: hasCurrent ? 'var(--ink)' : 'var(--ink-2)',
                  background: isOpen ? 'rgba(15,23,42,0.04)' : 'transparent',
                  borderLeft: hasCurrent ? '4px solid var(--primary)' : '4px solid transparent',
                  border:'none', borderLeftWidth: 4, borderLeftStyle:'solid',
                  borderLeftColor: hasCurrent ? 'var(--primary)' : 'transparent',
                  cursor:'pointer',
                  textTransform:'uppercase',
                }}>
                <span>
                  {grp.group}
                  <span style={{fontSize:10, color:'var(--ink-3)', marginLeft:8, fontWeight:500, letterSpacing:'0.1em'}}>· {grp.items.length}</span>
                </span>
                <span aria-hidden="true" style={{
                  fontSize:11, color:'var(--ink-3)',
                  transition:'transform .2s', display:'inline-block',
                  transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                }}>▾</span>
              </button>
              {isOpen && (
                <ul role="list" style={{
                  listStyle:'none', margin:0, padding:'4px 0 10px',
                  // 그룹 펼친 영역 좌측 세로 가이드 라인 — 트리 위계 시각화
                  position:'relative',
                  background:'rgba(15,23,42,0.015)',
                  borderBottom:'1px solid var(--line)',
                }}>
                  {/* 세로 가이드 라인 (서브 영역 좌측) */}
                  <span aria-hidden="true" style={{
                    position:'absolute', left:32, top:6, bottom:10,
                    width:1, background:'var(--line-2)',
                  }}/>
                  {grp.items.map(t => {
                    const active = tab === t;
                    return (
                      <li key={t}>
                        <button
                          type="button"
                          onClick={() => handleTabClick(t)}
                          aria-current={active ? "page" : undefined}
                          style={{
                            width:'100%', textAlign:'left',
                            padding:'10px 24px 10px 44px',
                            // v00.242 — sub-tab 가독성 ↑. 14/medium + ink (비활성) / ink + bold + primary 배경 (활성).
                            fontSize:14,
                            fontWeight: active ? 700 : 500,
                            background: active ? 'rgba(245,213,72,0.18)' : 'transparent',
                            color: active ? 'var(--ink)' : 'var(--ink)',
                            border:'none',
                            borderLeft: active ? '4px solid var(--primary)' : '4px solid transparent',
                            letterSpacing:'0.01em',
                            cursor:'pointer',
                            position:'relative',
                          }}
                          onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(15,23,42,0.04)'; }}
                          onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                          {t}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </aside>

      {/* Main */}
      <div className="admin-main" style={{padding:40, overflow:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32}}>
          <div>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em'}}>ADMIN / {tab.toUpperCase()}</div>
            <h1 className="ko-serif" style={{fontSize:32, fontWeight:500, marginTop:6}}>{tab}</h1>
          </div>
          <time className="mono dim-2" style={{fontSize:11}} dateTime={new Date().toISOString()}>
            {window.BGNJ_FMT.kstDateTime()}
          </time>
        </div>

        {/* 대시보드 — v00.146 일/주/월 가입자 + 활동 + 유입 추적 */}
        {tab === "대시보드" && <DashboardPanel
          dashboardStats={dashboardStats}
          allUsers={allUsers}
          allCommunityPosts={allCommunityPosts}
          latestCommunityPost={latestCommunityPost}
          latestColumn={latestColumn}
          setTab={setTab}
          G={G}/>}

        {false && (() => {
          const dailySignups = _countSince(allUsers, 'createdAt', 1);
          const weeklySignups = _countSince(allUsers, 'createdAt', 7);
          const monthlySignups = _countSince(allUsers, 'createdAt', 30);
          const dailyPosts = _countSince(allCommunityPosts, 'date', 1);
          const weeklyPosts = _countSince(allCommunityPosts, 'date', 7);
          const monthlyPosts = _countSince(allCommunityPosts, 'date', 30);
          const signupSeries = _dailySeries(allUsers, 'createdAt', 14);
          const postSeries = _dailySeries(allCommunityPosts, 'date', 14);
          const referrerData = [
            { src: '직접 방문', pct: 42 },
          ];
          return (
          <>
            {/* 1줄: 기존 4종 (전체 회원 / 게시글 / 칼럼 / 책 주문) */}
            <div className="grid grid-4" style={{marginBottom:18}}>
              {dashboardStats.map((s, i) => (
                <div key={i} className="card">
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12}}>{s.l}</div>
                  <div className="ko-serif" style={{fontSize:32, color:'var(--ink)'}}>{s.v}<span style={{fontSize:14, marginLeft:4}} className="dim-2">{s.unit||''}</span></div>
                  <div style={{fontSize:11, color: s.p ? 'var(--primary)' : 'var(--danger)', marginTop:8}}>{s.d}</div>
                </div>
              ))}
            </div>
            {/* 2줄: 일/주/월 방문자 (현재는 작성 활동 proxy) + 일일 가입자 */}
            <div className="admin-section__title">활동 · 방문 (활동량 proxy — 정확한 page-view tracking 은 v0.147+)</div>
            <div className="grid grid-4" style={{marginBottom:18}}>
              <MetricCard icon="📅" label="일일 활동자" value={dailyPosts}
                accent="var(--primary)" sub={`최근 24시간 게시글 ${dailyPosts}건`}/>
              <MetricCard icon="📊" label="주간 활동자" value={weeklyPosts}
                accent="var(--primary-hover)" sub={`최근 7일 게시글 ${weeklyPosts}건`}/>
              <MetricCard icon="📈" label="월간 활동자" value={monthlyPosts}
                accent="var(--gold-3, var(--primary-hover))" sub={`최근 30일 게시글 ${monthlyPosts}건`}/>
              <MetricCard icon="✨" label="오늘 신규 가입" value={dailySignups}
                accent="var(--secondary, #1F7A8C)"
                sub={`주간 ${weeklySignups}명 · 월간 ${monthlySignups}명`}/>
            </div>
            {/* 3줄: 추이 차트 */}
            <div className="grid grid-2" style={{marginBottom:18}}>
              <article className="card">
                <MiniBarChart label="📊 14일 가입 추이" series={signupSeries.counts} labels={signupSeries.labels} color="var(--secondary, #1F7A8C)" height={140}/>
                <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
                  최근 14일간 일별 신규 가입자 수. 막대에 마우스 hover 로 정확한 값 확인.
                </p>
              </article>
              <article className="card">
                <MiniBarChart label="📊 14일 게시글 추이" series={postSeries.counts} labels={postSeries.labels} color="var(--primary)" height={140}/>
                <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
                  최근 14일간 일별 신규 게시글 수. 활동량의 일별 변동 파악용.
                </p>
              </article>
            </div>
            {/* 4줄: 유입 경로 */}
            <div className="admin-section__title">유입 경로 (추정값 — referrer tracking infrastructure v0.147+ 예정)</div>
            <article className="card" style={{marginBottom:24}}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:14}}>TRAFFIC SOURCES</div>
              <div style={{display:'grid', gap:10}}>
                {referrerData.map((r, i) => (
                  <div key={i} style={{display:'flex', alignItems:'center', gap:12}}>
                    <div style={{minWidth:160, fontSize:13, color:'var(--ink)'}}>{r.src}</div>
                    <div style={{flex:1, height:8, background:'var(--bg-2)', borderRadius:4, overflow:'hidden', position:'relative'}}>
                      <div style={{position:'absolute', left:0, top:0, bottom:0, width:`${r.pct}%`, background:'var(--primary)', borderRadius:4}}/>
                    </div>
                    <div className="mono" style={{minWidth:40, textAlign:'right', fontSize:12, color:'var(--ink)', fontWeight:600}}>{r.pct}%</div>
                  </div>
                ))}
              </div>
              <p className="dim-2" style={{fontSize:11, marginTop:14, lineHeight:1.6}}>
                ⓘ 현재는 추정값. 실제 referrer 트래킹은 다음 사이클에 page-view 엔드포인트 + D1 page_views 테이블 추가 시 정확한 값 표시 예정.
              </p>
            </article>
            {/* 5줄: 기존 latest community + ops snapshot */}
            <div className="grid grid-2">
              <article className="card card-gold">
                <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>LATEST COMMUNITY</div>
                <h2 className="ko-serif" style={{fontSize:20, marginBottom:12}}>가장 최근 커뮤니티 글</h2>
                {latestCommunityPost ? (
                  <>
                    <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:10}}>
                      <span className="badge badge-gold">{latestCommunityPost.category}</span>
                      <span className="mono dim-2" style={{fontSize:11}}>{latestCommunityPost.date}</span>
                    </div>
                    <p style={{fontSize:16, marginBottom:10}}>{latestCommunityPost.title}</p>
                    <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
                      작성자 {latestCommunityPost.author} · 조회 {latestCommunityPost.views} · 댓글 {latestCommunityPost.replies}
                    </p>
                  </>
                ) : (
                  <p className="dim">등록된 게시글이 없습니다.</p>
                )}
                <button type="button" className="btn btn-small" onClick={() => setTab("커뮤니티")}>커뮤니티 관리로 이동</button>
              </article>

              <article className="card">
                <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>OPERATIONS SNAPSHOT</div>
                <h2 className="ko-serif" style={{fontSize:20, marginBottom:12}}>운영 요약</h2>
                <div style={{display:'grid', gap:12, marginBottom:18}}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">최근 칼럼</span><span>{latestColumn?.title || "없음"}</span></div>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">다음 강연</span><span>{G.arr(() => window.BGNJ_LECTURES?.listAll?.()).filter((l) => l && !l.hidden)[0]?.next || "없음"}</span></div>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">다음 투어</span><span>{G.arr(() => window.BGNJ_TOURS?.listAll?.()).filter((t) => t && !t.hidden)[0]?.next || "없음"}</span></div>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">DSR 대기</span><span>{PRIVACY_DATA.dsrRequests.filter(r => r.status !== 'done').length}건</span></div>
                </div>
                <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
                  <button type="button" className="btn btn-small" onClick={() => setTab("뱅기노자 칼럼")}>칼럼 관리</button>
                  <button type="button" className="btn btn-small" onClick={() => setTab("투어 프로그램")}>투어 관리</button>
                  <button type="button" className="btn btn-small" onClick={() => setTab("정보주체 권리")}>권리 요청 처리</button>
                </div>
              </article>
            </div>
          </>
          );
        })()}

        {tab === "사용자 여정" && <UserJourneyPanel/>}

        {tab === "버전 기록" && (() => {
          const VERSIONS_PER_PAGE = 10;
          const total = ADMIN_VERSION_HISTORY.length;
          const totalPages = Math.max(1, Math.ceil(total / VERSIONS_PER_PAGE));
          const safePage = Math.min(versionPage, totalPages);
          const start = (safePage - 1) * VERSIONS_PER_PAGE;
          const slice = ADMIN_VERSION_HISTORY.slice(start, start + VERSIONS_PER_PAGE);
          const latest = ADMIN_VERSION_HISTORY[0];
          return (
            <div style={{display:'grid', gap:16}}>
              <div className="card" style={{padding:18, display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap'}}>
                <div>
                  <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:6}}>VERSION HISTORY</div>
                  <div style={{fontSize:14, lineHeight:1.6}}>
                    총 <span className="ko-serif gold-2" style={{fontSize:20}}>{total}</span>개 버전 기록
                    {latest && <span className="dim-2 mono" style={{fontSize:11, marginLeft:10}}>
                      최신 {latest.version} · {latest.datetime ? (window.BGNJ_FMT?.kstDateTime?.(latest.datetime) || latest.date) : latest.date}
                    </span>}
                  </div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:14, flexWrap:'wrap'}}>
                  <button type="button" className="btn btn-small" onClick={() => {
                    // v00.107 — CSV 다운로드. version, datetime(KST), date, summary, details(joined), context.
                    const esc = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
                    const rows = [['version', 'datetime_kst', 'date', 'summary', 'details', 'context']];
                    for (const e of ADMIN_VERSION_HISTORY) {
                      rows.push([
                        e.version || '',
                        e.datetime ? (window.BGNJ_FMT?.kstDateTime?.(e.datetime) || '') : '',
                        e.date || '',
                        e.summary || '',
                        Array.isArray(e.details) ? e.details.join(' | ') : '',
                        e.context || '',
                      ]);
                    }
                    const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n'); // BOM for Excel KR.
                    downloadCsv(`bgnj-version-history-${new Date().toISOString().slice(0,10)}.csv`, csv);
                  }}>📥 CSV 다운로드</button>
                  <div className="mono dim-2" style={{fontSize:11, letterSpacing:'0.16em'}}>
                    {safePage} / {totalPages} 페이지 · {start + 1}–{Math.min(start + VERSIONS_PER_PAGE, total)}건 표시
                  </div>
                </div>
              </div>

              {slice.map((entry) => (
                <article key={entry.version} className="card card-gold" style={{padding:24}}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:16, alignItems:'start', marginBottom:16, flexWrap:'wrap'}}>
                    <div>
                      <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>VERSION LOG</div>
                      <h2 className="ko-serif" style={{fontSize:24}}>v{entry.version}</h2>
                    </div>
                    <div className="mono dim-2" style={{fontSize:11, textAlign:'right'}}>
                      {entry.datetime
                        ? (<><div>{window.BGNJ_FMT?.kstDateTime?.(entry.datetime) || entry.date}</div></>)
                        : entry.date}
                    </div>
                  </div>

                  <div style={{marginBottom:18}}>
                    <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>핵심 수정사항</div>
                    <p className="dim" style={{fontSize:13, lineHeight:1.8}}>{entry.summary}</p>
                  </div>

                  <div style={{marginBottom:18}}>
                    <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>세부 업데이트 내역</div>
                    <div style={{display:'grid', gap:8}}>
                      {entry.details.map((detail) => (
                        <div key={detail} className="card" style={{padding:14}}>{detail}</div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>수정 계기와 배경</div>
                    <div className="card" style={{padding:14}}>
                      <p className="dim" style={{fontSize:13, lineHeight:1.8}}>{entry.context}</p>
                    </div>
                  </div>
                </article>
              ))}

              {totalPages > 1 && (
                <nav aria-label="버전 기록 페이지 이동" style={{display:'flex', justifyContent:'center', alignItems:'center', gap:6, marginTop:8, flexWrap:'wrap'}}>
                  <button type="button" className="btn btn-small"
                    onClick={() => setVersionPage(Math.max(1, safePage - 1))}
                    disabled={safePage <= 1}>← 이전</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button key={n} type="button" className="btn btn-small"
                      aria-current={n === safePage ? 'page' : undefined}
                      onClick={() => setVersionPage(n)}
                      style={{
                        borderColor: n === safePage ? 'var(--primary)' : 'var(--line)',
                        color: n === safePage ? 'var(--primary)' : 'var(--ink-2)',
                        background: n === safePage ? 'rgba(245,213,72,0.08)' : 'transparent',
                        minWidth: 36,
                      }}>{n}</button>
                  ))}
                  <button type="button" className="btn btn-small"
                    onClick={() => setVersionPage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage >= totalPages}>다음 →</button>
                </nav>
              )}
            </div>
          );
        })()}

        {tab === "KMS" && (
          <div style={{display:'grid', gap:16}}>
            <div className="card card-gold" style={{padding:24}}>
              <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>KMS SUMMARY</div>
              <h2 className="ko-serif" style={{fontSize:24, marginBottom:12}}>KMS는 두 개의 탭으로 구성됩니다</h2>
              <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:14}}>
                KMS의 제1 기능은 기능정의서입니다. 사이트가 존재하는 5가지 미션(뱅기노자 커뮤니티 / 강연 일정 / 칼럼 / 투어 프로그램 / 책 판매)을 기준으로 현재 어떤 기능이 있고
                무엇이 비어 있는지를 먼저 보여주고, 그 위에 디자인 원칙을 함께 둡니다. KMS에 진입하면 기본은 `기능정의서` 탭입니다.
              </p>
              <div style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 1fr))', gap:12}} className="stats-grid">
                <div className="card" style={{padding:14}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:6}}>탭 1 · 기본</div>
                  <div className="ko-serif" style={{fontSize:18}}>기능정의서</div>
                  <div className="dim" style={{fontSize:12, marginTop:6, lineHeight:1.6}}>5개 미션 + 공통 기반을 영역 단위로 정리하고, 영역마다 기능 / 기술 스펙 / 유의할 점 / 개발 이슈를 함께 기록합니다.</div>
                </div>
                <div className="card" style={{padding:14}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:6}}>탭 2</div>
                  <div className="ko-serif" style={{fontSize:18}}>디자인</div>
                  <div className="dim" style={{fontSize:12, marginTop:6, lineHeight:1.6}}>새 화면을 만들거나 기존 UI를 바꿀 때 먼저 확인하는 브랜드 무드, 컬러, 타이포, 레이아웃, 금지 원칙입니다.</div>
                </div>
              </div>
            </div>

            <div style={{display:'flex', gap:8, flexWrap:'wrap'}} role="tablist" aria-label="KMS 영역 선택">
              {["기능정의서", "디자인"].map((item) => {
                const on = kmsTab === item;
                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    className="btn btn-small"
                    onClick={() => setKmsTab(item)}
                    style={{
                      borderColor: on ? 'var(--primary)' : 'var(--line-2)',
                      color: on ? 'var(--primary)' : 'var(--ink)',
                      background: on ? 'rgba(245,213,72,0.10)' : 'var(--bg-2)',
                      fontWeight: on ? 700 : 500,
                    }}>
                    {item}
                  </button>
                );
              })}
            </div>

            {kmsTab === "기능정의서" && (
              <div style={{display:'grid', gridTemplateColumns:'minmax(0, 1fr) 240px', gap:24, alignItems:'start'}} className="kms-fdef-layout">
                <div style={{display:'grid', gap:16, minWidth:0}}>
                  <article id="fdef-overview" className="card card-gold" style={{padding:24, scrollMarginTop:24}}>
                    <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>MISSION OVERVIEW</div>
                    <h2 className="ko-serif" style={{fontSize:22, marginBottom:10}}>5가지 미션 평가 요약</h2>
                    <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:18}}>
                      이 사이트가 존재하는 이유는 다음 다섯 가지입니다.
                      각 미션은 아래 영역으로 이어지며, 각 영역의 평가와 빈 칸은 본 기능정의서 본문에서 영역별로 자세히 기록합니다.
                    </p>
                    <div style={{display:'grid', gap:10}}>
                      {MISSION_OVERVIEW.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            const el = document.getElementById(`fdef-${m.id}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="card"
                          style={{padding:14, textAlign:'left', cursor:'pointer', background:'transparent'}}>
                          <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:6}}>
                            <div style={{display:'flex', gap:10, alignItems:'baseline'}}>
                              <span className="mono dim-2" style={{fontSize:11, letterSpacing:'0.18em'}}>MISSION {m.number}</span>
                              <span className="ko-serif" style={{fontSize:16}}>{m.title}</span>
                            </div>
                            <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', color:'var(--secondary)'}}>{m.state} · {m.coverage}</span>
                          </div>
                          <div className="dim" style={{fontSize:13, lineHeight:1.7, marginBottom:6}}>{m.short}</div>
                          <div style={{fontSize:12, lineHeight:1.7, color:'var(--ink-2)'}}>{m.verdict}</div>
                        </button>
                      ))}
                    </div>
                  </article>

                  {FEATURE_DOMAINS.map((domain) => {
                    const statusTone = domain.status?.includes('미구현')
                      ? 'var(--danger)'
                      : domain.status?.includes('부분') || domain.status?.includes('카탈로그') || domain.status?.includes('UI')
                        ? 'var(--ink-2)'
                        : 'var(--primary)';
                    return (
                      <article id={`fdef-${domain.id}`} key={domain.id} className="card" style={{padding:24, scrollMarginTop:24}}>
                        <header style={{borderBottom:'1px solid var(--line)', paddingBottom:16, marginBottom:18}}>
                          <div style={{display:'flex', justifyContent:'space-between', gap:16, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                            <div style={{display:'flex', gap:12, alignItems:'baseline'}}>
                              <span className="mono dim-2" style={{fontSize:11, letterSpacing:'0.22em'}}>{domain.id === 'infra' ? 'BASE' : `MISSION ${domain.number}`}</span>
                              <h2 className="ko-serif" style={{fontSize:24}}>{domain.title}</h2>
                            </div>
                            <span className="mono" style={{fontSize:11, letterSpacing:'0.2em', color: statusTone}}>STATUS · {domain.status}</span>
                          </div>
                          <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:10}}>{domain.role}</p>
                          <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em'}}>routes: {domain.routes.join(' · ')}</div>
                        </header>

                        <div style={{display:'grid', gap:18}}>
                          <section>
                            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>현재 평가</div>
                            <div className="card" style={{padding:14, lineHeight:1.8}}>{domain.evaluation}</div>
                          </section>

                          {domain.missing && domain.missing.length > 0 && (
                            <section>
                              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>없는 기능 / 완성도를 높이려면 필요한 것</div>
                              <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
                                {domain.missing.map((item) => (
                                  <li key={item} style={{padding:'8px 12px', borderLeft:'2px solid var(--primary-dim)', background:'rgba(245,213,72,0.04)', fontSize:13, lineHeight:1.7}}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </section>
                          )}

                          <section>
                            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>기능 ({domain.features.length})</div>
                            <div style={{display:'grid', gap:12}}>
                              {domain.features.map((feature) => {
                                const fTone = feature.status === '구현됨'
                                  ? 'var(--primary)'
                                  : feature.status === '미구현' || feature.status?.startsWith('UI만')
                                    ? 'var(--danger)'
                                    : 'var(--ink-2)';
                                return (
                                  <div key={feature.name} className="card" style={{padding:16, borderColor:'var(--line-2)'}}>
                                    <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:8}}>
                                      <h3 className="ko-serif" style={{fontSize:17}}>{feature.name}</h3>
                                      <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: fTone}}>{feature.status}</span>
                                    </div>
                                    {feature.summary && (
                                      <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:12}}>{feature.summary}</p>
                                    )}
                                    {feature.elements && feature.elements.length > 0 && (
                                      <div style={{marginBottom:12}}>
                                        <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:6}}>요소</div>
                                        <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:4}}>
                                          {feature.elements.map((el) => (
                                            <li key={el} style={{fontSize:12, lineHeight:1.7, paddingLeft:14, position:'relative'}}>
                                              <span style={{position:'absolute', left:0, color:'var(--primary-dim)'}}>·</span>
                                              {el}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {feature.techSpec && (
                                      <div style={{marginBottom:10}}>
                                        <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:4}}>기술 스펙</div>
                                        <div style={{fontSize:12, lineHeight:1.7, color:'var(--ink-2)'}}>{feature.techSpec}</div>
                                      </div>
                                    )}
                                    {feature.caution && (
                                      <div style={{marginBottom:10}}>
                                        <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:4}}>유의할 점</div>
                                        <div style={{fontSize:12, lineHeight:1.7, color:'var(--ink-2)'}}>{feature.caution}</div>
                                      </div>
                                    )}
                                    {feature.issues && feature.issues.length > 0 && (
                                      <div>
                                        <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:4}}>개발 이슈</div>
                                        <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:3}}>
                                          {feature.issues.map((issue) => (
                                            <li key={issue} style={{fontSize:12, lineHeight:1.7, paddingLeft:14, position:'relative', color:'var(--ink-2)'}}>
                                              <span style={{position:'absolute', left:0, color:'var(--danger)'}}>!</span>
                                              {issue}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </section>

                          {domain.techSpec && (
                            <section>
                              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>영역 차원 · 기술 스펙</div>
                              <div className="card" style={{padding:14, lineHeight:1.8, fontSize:13}}>{domain.techSpec}</div>
                            </section>
                          )}

                          {domain.cautions && domain.cautions.length > 0 && (
                            <section>
                              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>영역 차원 · 유의할 점</div>
                              <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
                                {domain.cautions.map((c) => (
                                  <li key={c} style={{padding:'8px 12px', borderLeft:'2px solid var(--ink-3)', fontSize:13, lineHeight:1.7}}>{c}</li>
                                ))}
                              </ul>
                            </section>
                          )}

                          {domain.issues && domain.issues.length > 0 && (
                            <section>
                              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>영역 차원 · 개발과정에서 마주한 이슈</div>
                              <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
                                {domain.issues.map((iss) => (
                                  <li key={iss} style={{padding:'8px 12px', borderLeft:'2px solid var(--danger)', fontSize:13, lineHeight:1.7}}>{iss}</li>
                                ))}
                              </ul>
                            </section>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <aside aria-label="기능정의서 목차" style={{position:'sticky', top:24, alignSelf:'start'}} className="kms-fdef-toc">
                  <div className="card" style={{padding:16}}>
                    <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:12}}>TABLE OF CONTENTS</div>
                    <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:4}}>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('fdef-overview');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          style={{
                            width:'100%', textAlign:'left', padding:'8px 10px',
                            background:'transparent', border:'1px solid transparent',
                            color:'var(--ink-2)', fontSize:12, lineHeight:1.5, cursor:'pointer',
                            borderLeft:'2px solid var(--primary)',
                          }}>
                          5가지 미션 평가
                        </button>
                      </li>
                      {FEATURE_DOMAINS.map((d) => (
                        <li key={d.id}>
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById(`fdef-${d.id}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            style={{
                              width:'100%', textAlign:'left', padding:'8px 10px',
                              background:'transparent', border:'1px solid transparent',
                              color:'var(--ink-2)', fontSize:12, lineHeight:1.5, cursor:'pointer',
                              borderLeft:'2px solid var(--line-2)',
                            }}>
                            <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.2em', marginBottom:2}}>
                              {d.id === 'infra' ? 'BASE' : `MISSION ${d.number}`}
                            </div>
                            {d.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div style={{borderTop:'1px solid var(--line)', marginTop:14, paddingTop:12}}>
                      <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:6}}>구성</div>
                      <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:4, fontSize:11, lineHeight:1.7, color:'var(--ink-3)'}}>
                        <li>· 영역 평가</li>
                        <li>· 없는 기능 정리</li>
                        <li>· 기능 + 요소</li>
                        <li>· 기술 스펙</li>
                        <li>· 유의할 점</li>
                        <li>· 개발 이슈</li>
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            )}

            {kmsTab === "디자인" && <DesignSystemView/>}

          </div>
        )}

        {/* 게시글 */}
        {/* v00.177 — 커뮤니티 통합. 게시글(현재 인라인 JSX) + 게시판(CommunityBoardsPanel) + 신고. SubTabsView. */}
        {tab === "커뮤니티" && (
          <SubTabsView
            storageKey="bgnj_admin_subtab_community"
            defaultKey="posts"
            subTabs={[
              // v00.180 — 인라인 JSX → CommunityPostsAdminPanel 호출 (DRY 추출).
              { key: "posts", label: "게시글", render: () => (
                <CommunityPostsAdminPanel
                  posts={allCommunityPosts}
                  onChange={() => setPostRefreshKey((v) => v + 1)}/>
              )},
              { key: "boards", label: "게시판", render: () => <CommunityBoardsPanel/> },
              { key: "reports", label: "신고", render: () => (
                <>
                  <CorruptedBodyInspector go={go}/>
                  <ReportQueuePanel onRefresh={() => setPostRefreshKey((v) => v + 1)} go={go}/>
                </>
              )},
            ]}/>
        )}

        {/* v00.177 — '신고' 별도 라우트 폐기. '커뮤니티' SubTabsView 안으로 이동. */}

        {/* 칼럼 — 통합 허브 (목록 + 글쓰기 모달). v00.067 */}
        {tab === "뱅기노자 칼럼" && <ColumnsHubPanel allColumns={allColumns}/>}

        {/* 강연 */}
        {tab === "강연" && <LectureAdminPanel go={go}/>}

        {/* 투어 프로그램 */}
        {tab === "투어 프로그램" && <TourAdminPanel go={go}/>}

        {/* 회원 */}
        {tab === "회원" && <MemberAdminPanel go={go}/>}

        {/* 도서 주문 운영 (v00.153 다권화 이후 일반화) */}
        {tab === "책 주문" && <BookOrderAdminPanel go={go}/>}
        {tab === "책 카탈로그" && <BooksAdminPanel/>}

        {/* 정보주체 권리 */}
        {tab === "정보주체 권리" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.15–22 / PIPA §35–38. 응답기한: <strong className="gold">GDPR 1개월</strong> / <strong className="gold">PIPA 10일</strong>.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>ID</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>권리유형</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>정보주체</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>적용법</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>접수</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>기한</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>상태</th>
                  <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.dsrRequests.map(r => {
                  const left = r.status === 'done' ? null : formatTimeLeft(r.dueAt);
                  const toneColor = left?.tone === 'danger' ? 'var(--danger)' : left?.tone === 'warn' ? 'var(--primary-hover)' : 'var(--ink-2)';
                  const label = DSR_LABELS[r.type];
                  return (
                    <tr key={r.id} style={{borderBottom:'1px solid var(--line)'}}>
                      <td className="mono gold" style={{padding:14}}>{r.id}</td>
                      <td style={{padding:14}}>
                        <div className="ko-serif">{label?.ko}</div>
                        <div className="mono dim-2" style={{fontSize:10}}>{label?.gdpr} · {label?.pipa}</div>
                      </td>
                      <td style={{padding:14}}>
                        <div>{r.user}</div>
                        <div className="mono dim-2" style={{fontSize:10}}>{r.email}</div>
                      </td>
                      <td style={{padding:14}}><span className="badge">{r.law}</span></td>
                      <td className="mono dim-2" style={{padding:14}}>{r.openedAt.slice(0,10)}</td>
                      <td className="mono" style={{padding:14, color: toneColor}}>
                        {r.status === 'done' ? '완료' : left?.text}
                      </td>
                      <td style={{padding:14}}>
                        <span className="badge" style={{
                          borderColor: r.status==='done' ? 'var(--primary-dim)' : r.status==='in_progress' ? 'var(--primary)' : 'var(--line-2)',
                          color: r.status==='done' ? 'var(--primary-dim)' : r.status==='in_progress' ? 'var(--primary)' : 'var(--ink-2)',
                        }}>{r.status==='open'?'접수':r.status==='in_progress'?'처리중':'완료'}</span>
                      </td>
                      <td style={{padding:14, textAlign:'right'}}>
                        <button type="button" className="btn btn-small">처리</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {/* 동의 관리 */}
        {tab === "동의 관리" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.7 / PIPA §15, §22. 동의는 <strong className="gold">자유·구체·고지·철회 가능</strong>해야 하며, 버전별 이력이 보존됩니다.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>항목</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>필수</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>버전</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>법적 근거</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>개정일</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.consentDefs.map(c => (
                  <tr key={c.key} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="ko-serif" style={{padding:14}}>{c.label}</td>
                    <td style={{padding:14}}>
                      <span className="badge" style={{borderColor: c.required?'var(--primary)':'var(--line-2)', color: c.required?'var(--primary)':'var(--ink-2)'}}>{c.required ? '필수' : '선택'}</span>
                    </td>
                    <td className="mono gold" style={{padding:14}}>{c.version}</td>
                    <td style={{padding:14}}>{c.lawful}</td>
                    <td className="mono dim-2" style={{padding:14}}>{c.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ROPA */}
        {tab === "처리활동(ROPA)" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.30. 모든 처리 목적·법적 근거·보유기간·수탁자·국외이전을 문서화합니다.
            </p>
            <div style={{overflowX:'auto', border:'1px solid var(--line)'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:880}}>
                <thead>
                  <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:90}}>ID</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left'}}>처리 목적</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:120}}>법적 근거</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left'}}>수집 항목</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:140}}>보유기간</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:140}}>수탁사</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:120}}>국외이전</th>
                  </tr>
                </thead>
                <tbody>
                  {PRIVACY_DATA.ropa.map((r) => (
                    <tr key={r.id} style={{borderTop:'1px solid var(--line)'}}>
                      <td className="mono gold" style={{padding:'12px 14px', fontSize:11, letterSpacing:'0.14em', verticalAlign:'top'}}>{r.id}</td>
                      <td className="ko-serif" style={{padding:'12px 14px', fontWeight:500, verticalAlign:'top'}}>{r.purpose}</td>
                      <td className="gold" style={{padding:'12px 14px', verticalAlign:'top'}}>{r.lawful}</td>
                      <td style={{padding:'12px 14px', verticalAlign:'top'}}>{r.items}</td>
                      <td style={{padding:'12px 14px', verticalAlign:'top'}}>{r.retention}</td>
                      <td style={{padding:'12px 14px', verticalAlign:'top'}}>{r.processor}</td>
                      <td style={{padding:'12px 14px', verticalAlign:'top'}}>{r.transfer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 쿠키 */}
        {tab === "쿠키·추적" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              ePrivacy Directive / PIPA §39의8. 필수 외 쿠키는 사전 <strong className="gold">옵트인 동의</strong>가 필요합니다.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>쿠키명</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>분류</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>목적</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>보관</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>당사자</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.cookies.map(c => (
                  <tr key={c.name} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="mono gold" style={{padding:14}}>{c.name}</td>
                    <td style={{padding:14}}><span className="badge" style={{borderColor: c.cat==='필수' ? 'var(--primary)' : 'var(--line-2)', color: c.cat==='필수' ? 'var(--primary)' : 'var(--ink-2)'}}>{c.cat}</span></td>
                    <td style={{padding:14}}>{c.purpose}</td>
                    <td className="mono dim-2" style={{padding:14}}>{c.ttl}</td>
                    <td className="mono dim-2" style={{padding:14}}>{c.party}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* 보안 사고 */}
        {tab === "보안 사고" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.33 — 인지 후 <strong className="gold">72시간 내 감독기관 통지</strong>. PIPA §34 — 인지 후 72시간 내 정보주체 및 개인정보위 통지.
            </p>
            {PRIVACY_DATA.breaches.map(b => {
              const toneColor = b.severity==='high' ? 'var(--danger)' : b.severity==='medium' ? 'var(--primary-hover)' : 'var(--ink-2)';
              return (
                <article key={b.id} className="card" style={{marginBottom:16}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
                    <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em'}}>{b.id}</div>
                    <span className="badge" style={{borderColor:toneColor, color:toneColor}}>심각도: {b.severity}</span>
                  </div>
                  <h3 className="ko-serif" style={{fontSize:18, marginBottom:8}}>{b.kind}</h3>
                  <dl style={{display:'grid', gridTemplateColumns:'120px 1fr', gap:'4px 16px', fontSize:12, lineHeight:1.7}}>
                    <dt className="dim-2 mono" style={{fontSize:10}}>감지</dt><dd className="mono">{b.detectedAt}</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>72h 기한</dt><dd className="mono">{b.notifyDueAt}</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>영향 주체</dt><dd>{window.BGNJ_FMT.currency(b.affected)}명</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>당국 통지</dt><dd className={b.authorityNotified?'gold':'dim-2'}>{b.authorityNotified?'✓ 완료':'—'}</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>주체 통지</dt><dd className={b.subjectNotified?'gold':'dim-2'}>{b.subjectNotified?'✓ 완료':'—'}</dd>
                  </dl>
                  {b.note && <p className="dim" style={{fontSize:12, marginTop:12, lineHeight:1.7}}>{b.note}</p>}
                </article>
              );
            })}
            <button type="button" className="btn btn-gold">새 사고 접수 →</button>
          </>
        )}

        {/* 보유·파기 */}
        {tab === "보유·파기" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.5(1)(e) 저장제한 원칙 / PIPA §21. 목적 달성 후 지체 없이 파기합니다.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>데이터 분류</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>보유기간</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>근거</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.retentionPolicies.map((r, i) => (
                  <tr key={i} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="ko-serif" style={{padding:14}}>{r.category}</td>
                    <td className="mono gold" style={{padding:14}}>{r.period}</td>
                    <td style={{padding:14}}>{r.lawful}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* 국외 이전 */}
        {tab === "국외 이전" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Chapter V / PIPA §28의8. 제3국 이전 시 적정성 결정 또는 SCCs 등 안전장치가 필요합니다.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>수탁·이전 대상</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>국가</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>목적</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>항목</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>안전장치</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.transfers.map((t, i) => (
                  <tr key={i} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="ko-serif" style={{padding:14}}>{t.recipient}</td>
                    <td style={{padding:14}}>{t.country}</td>
                    <td className="dim" style={{padding:14}}>{t.purpose}</td>
                    <td className="mono" style={{padding:14, fontSize:11}}>{t.items}</td>
                    <td className="gold mono" style={{padding:14, fontSize:11}}>{t.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === "추천 여행지" && <RecommendationsAdminPanel/>}
        {/* v00.106 — 놀자 시리즈 3개 sub-tab: KindPagePanel(kind) */}
        {tab === "먹고 놀자" && window.KindPagePanel && <window.KindPagePanel kind="eat"/>}
        {tab === "자고 놀자" && window.KindPagePanel && <window.KindPagePanel kind="sleep"/>}
        {tab === "사고 놀자" && window.KindPagePanel && <window.KindPagePanel kind="shop"/>}
        {/* v00.267 — 한켠 숙소 예약 PMS (7 탭) */}
        {tab === "한켠 예약" && window.HangyeonAdminPanel && <window.HangyeonAdminPanel/>}
        {/* 카테고리 CRUD */}
        {/* v00.166 — 사이트 설정 7 항목 단일 머지. v00.167 — 우측 라이브 미리보기 iframe. */}
        {tab === "사이트 설정" && (
          <SubTabsView
            storageKey="bgnj_admin_subtab_site_settings"
            defaultKey="content"
            subTabs={[
              // v00.193 — 사용자 요청 '모든 메뉴에 실시간 미리보기, 메뉴별 매칭 화면'.
              // 이전에 home/hero/bank 는 previewUrl 미지정 (자체 임베드 또는 노출 페이지 없음) → 모두 '/' 폴백.
              { key: "content",  label: "사이트 콘텐츠",   previewUrl: "/",        render: () => <SiteContentAdminPanel/> },
              { key: "banner",   label: "공지·배너",        previewUrl: "/",        render: () => <BannerEditorPanel/> },
              { key: "home",     label: "홈 텍스트",        previewUrl: "/",        render: () => <HomeTextEditorPanel/> },
              { key: "hero",     label: "히어로",           previewUrl: "/",        render: () => <HeroEditorPanel/> },
              { key: "seo",      label: "SEO",             previewUrl: "/",        render: () => <SEOAdminPanel/> },
              // v00.196 — 검색콘솔 (Google/Naver/Bing/Yandex) 검증 + sitemap ping.
              { key: "search",   label: "검색엔진",         previewUrl: "/",        render: () => <SearchConsoleAdminPanel/> },
              { key: "legal",    label: "약관/개인정보",   previewUrl: "/terms",   render: () => <LegalAdminPanel/> },
              { key: "faq",      label: "자주 묻는 질문",  previewUrl: "/faq",     render: () => <FaqAdminPanel/> },
              { key: "bank",     label: "계좌번호",         previewUrl: "/faq",     render: () => <BankAccountPanel/> },
            ]}/>
        )}
        {/* v00.105 — '투어 페이지' / '강연 페이지' 탭 제거. TourAdminPanel / LectureAdminPanel 상단에 inline 통합. */}
        {/* v00.175 — '카테고리' 탭 폐기. AdminCategoryPanel 컴포넌트는 코드 보존(향후 칼럼 카테고리 등 재사용 여지). */}
        {/* v00.177 — '커뮤니티 게시판' 별도 라우트 폐기. '커뮤니티' SubTabsView 안으로 이동. */}
        {/* v00.166 — 약관/개인정보, 자주 묻는 질문, SEO 는 "사이트 설정" 머지로 이동. */}
        {tab === "감사 로그" && <AuditLogPanel/>}
        {/* v00.183 — 내부 인원 알람. */}
        {tab === "내부 알람" && <InternalAlarmPanel/>}
        {/* v00.190 — 통합 활동 로그. */}
        {tab === "활동 로그" && <ActivityLogPanel/>}
        {tab === "오류 로그" && <ErrorLogPanel/>}
        {tab === "오류 페이지 미리보기" && <ErrorPagesPreviewPanel go={go}/>}
        {/* v00.171 — '데이터 정리' 탭 폐기. 마이그레이션 완료. LegacyMigrationPanel 컴포넌트는 코드 유지(향후 재사용 여지). */}

        {/* 회원 등급 CRUD */}
        {tab === "회원 등급" && <AdminGradePanel/>}

        {/* 칼럼 작성 (관리자 전용, Tiptap column preset — 이미지 본문 삽입/이동 가능) */}
        {/* '칼럼 작성' 탭은 v00.067 에 '뱅기노자 칼럼' 의 모달로 통합 (구 진입 경로 호환). */}
        {tab === "칼럼 작성" && <ColumnsHubPanel allColumns={allColumns}/>}

        {/* 계좌번호 설정 */}
        {/* v00.166 — 계좌번호 설정 → "사이트 설정" sub-tab 으로 이동. */}

        {/* 설정 — 입금 계좌는 별도 '계좌번호 설정' 탭에서 관리. */}
        {tab === "설정" && (
          <div style={{display:'grid', gap:24}}>
            <div className="card" style={{padding:'14px 18px', background:'var(--bg-2)', borderLeft:'3px solid var(--primary-dim)'}}>
              <p className="dim" style={{fontSize:13, lineHeight:1.7, margin:0}}>
                ⓘ 무통장 입금 계좌는 좌측 메뉴의 <strong className="gold">계좌번호 설정</strong> 탭에서 관리합니다 (멀티 계좌 지원).
              </p>
            </div>
            <div className="card">
              <h2 className="ko-serif" style={{fontSize:20, marginBottom:16}}>사이트 설정</h2>
              <dl style={{display:'grid', gridTemplateColumns:'200px 1fr', gap:'8px 24px', fontSize:13, lineHeight:1.8}}>
                <dt className="dim-2 mono" style={{fontSize:11}}>DPO</dt><dd>contact@bgnj.net · 02-0000-0001</dd>
                <dt className="dim-2 mono" style={{fontSize:11}}>개인정보 책임자</dt><dd>뱅기노자 / contact@bgnj.net</dd>
                <dt className="dim-2 mono" style={{fontSize:11}}>최근 DPIA</dt><dd>2026-03-02</dd>
                <dt className="dim-2 mono" style={{fontSize:11}}>적용 법역</dt><dd>대한민국(PIPA) · 유럽연합(GDPR)</dd>
                <dt className="dim-2 mono" style={{fontSize:11}}>감독기관</dt><dd>개인정보보호위원회 / 관할 EU DPA</dd>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// === Admin: Category CRUD ==============================================
const AdminCategoryPanel = () => {
  const [cats, setCats] = React.useState(() => window.BGNJ_STORES.categories.slice());
  const [draft, setDraft] = React.useState({ id:"", label:"", boardType:"community", minLevel:0, postMinLevel:0, desc:"", allowRead:true, allowWrite:true, allowCommentRead:true, allowCommentWrite:true });
  const [error, setError] = React.useState("");
  const [prefixDrafts, setPrefixDrafts] = React.useState({});

  const save = (next) => {
    window.BGNJ_STORES.categories = next;
    window.BGNJ_SAVE.categories();
    setCats(next);
  };
  // v00.141 — 서버에도 PATCH (서버가 source of truth, localStorage 는 첫 페인트용 캐시).
  // 실패해도 UI 변경은 유지 (다음 boot 에서 서버 값으로 재동기화 됨).
  // 필드명 매핑: desc → description (워커 컬럼명).
  const persistToServer = async (cat, patch) => {
    const remap = {};
    for (const [k, v] of Object.entries(patch)) {
      if (k === 'desc') remap.description = v;
      else remap[k] = v;
    }
    try { await window.BGNJ_API?.categories?.update?.(cat.id, remap); } catch (err) { console.warn('[AdminCategoryPanel] PATCH 실패:', err?.message); }
  };
  const slugify = (s) => String(s || '').trim().toLowerCase()
    .replace(/[^a-z0-9-_가-힣]+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
  const add = async (e) => {
    e.preventDefault();
    setError("");
    let id = draft.id || slugify(draft.label);
    if (!id || !draft.label) return setError("ID와 이름은 필수입니다.");
    if (cats.find(c => c.id === id)) return setError("이미 존재하는 ID입니다.");
    const newCat = { ...draft, id, minLevel: Number(draft.minLevel), postMinLevel: Number(draft.postMinLevel) };
    save([...cats, newCat]);
    // 서버에도 생성 (실패해도 로컬은 유지).
    try {
      await window.BGNJ_API?.categories?.create?.({
        id, label: newCat.label, boardType: newCat.boardType,
        minLevel: newCat.minLevel, postMinLevel: newCat.postMinLevel,
        description: newCat.desc, prefixes: newCat.prefixes || [],
        allowRead: newCat.allowRead, allowWrite: newCat.allowWrite,
        allowCommentRead: newCat.allowCommentRead, allowCommentWrite: newCat.allowCommentWrite,
      });
    } catch (err) { console.warn('[AdminCategoryPanel] create 실패:', err?.message); }
    setDraft({ id:"", label:"", boardType:"community", minLevel:0, postMinLevel:0, desc:"", allowRead:true, allowWrite:true, allowCommentRead:true, allowCommentWrite:true });
  };
  const update = (i, key, val) => {
    const next = cats.slice();
    // v00.141 — boolean (allow_*) / number (level) / string 분기.
    let coerced = val;
    if (key.endsWith("Level")) coerced = Number(val);
    else if (key.startsWith("allow")) coerced = !!val;
    next[i] = { ...next[i], [key]: coerced };
    save(next);
    // 서버 patch — boot 시 서버에서 다시 받아오므로 동기화 필수.
    persistToServer(next[i], { [key]: coerced });
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= cats.length) return;
    const next = cats.slice();
    [next[i], next[j]] = [next[j], next[i]];
    save(next);
  };
  // v00.171 — server delete 호출 추가. 이전엔 localStorage 만 지워서 새로고침 시 boot 가 D1 default 로 다시 로드 → '삭제 안 됨' 인상.
  const remove = async (i) => {
    const cat = cats[i];
    const used = postCount(cat.id);
    const note = used > 0 ? `\n현재 이 게시판에 ${used}개의 글이 있습니다. 삭제 후에도 게시글은 남되 분류가 비게 됩니다.` : '';
    if (!(await window.BGNJ_CONFIRM(`"${cat.label}" 게시판을 삭제하시겠어요?${note}`, { danger: true }))) return;
    try {
      await window.BGNJ_API?.categories?.remove?.(cat.id);
    } catch (err) {
      window.BGNJ_TOAST.error('서버 삭제 실패: ' + (err?.message || '알 수 없는 오류') + '\n로컬에서만 제거합니다.');
    }
    save(cats.filter((_, j) => j !== i));
  };

  // 게시판별 글 수
  const postCount = (catId) => {
    const posts = window.BGNJ_COMMUNITY?.listPosts?.() || [];
    return posts.filter((p) => p.categoryId === catId).length;
  };

  const grades = (window.BGNJ_STORES?.grades || []).slice().sort((a, b) => (a.level || 0) - (b.level || 0));
  const communityCats = cats.filter((c) => c.boardType === 'community');

  return (
    <>
      <AdminPanelHeader
        eyebrow="BOARDS · 카테고리"
        title="게시판 카테고리 + 권한"
        description="게시판을 추가/삭제하고 각 게시판의 읽기·쓰기 최소 등급 + 4종 권한(글읽/글쓰/댓읽/댓쓰)을 체크박스로 설정합니다. 순서를 바꾸면 사이트 내비와 커뮤니티 탭에 즉시 반영됩니다."/>

      {/* 게시판 추가 — 통일 form 카드 */}
      <article className="admin-form-card">
        <div className="admin-form-card__eyebrow">＋ 새 게시판 추가</div>
        <form onSubmit={add} style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:10, alignItems:'end'}}>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-label">이름 <span className="gold" aria-hidden="true">*</span></label>
            <input id="cat-label" className="field-input" value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value, id: draft.id || slugify(e.target.value) })}
              placeholder="자유 / 질문 / 정보 ..."/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-id">ID (slug)</label>
            <input id="cat-id" className="field-input" value={draft.id}
              onChange={(e) => setDraft({ ...draft, id: slugify(e.target.value) })}
              placeholder="자동 생성"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-type">유형</label>
            <select id="cat-type" className="field-input" value={draft.boardType}
              onChange={(e) => setDraft({ ...draft, boardType: e.target.value })}>
              <option value="community">커뮤니티</option>
              <option value="column">칼럼</option>
            </select>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-min">읽기 최소 Lv</label>
            <input id="cat-min" type="number" className="field-input" value={draft.minLevel}
              onChange={(e) => setDraft({ ...draft, minLevel: e.target.value })}/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-post">쓰기 최소 Lv</label>
            <input id="cat-post" type="number" className="field-input" value={draft.postMinLevel}
              onChange={(e) => setDraft({ ...draft, postMinLevel: e.target.value })}/>
          </div>
          <div className="field" style={{margin:0, gridColumn:'span 2'}}>
            <label className="field-label" htmlFor="cat-desc">설명</label>
            <input id="cat-desc" className="field-input" value={draft.desc}
              onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
              placeholder="게시판 안내 (선택)"/>
          </div>
          {/* v00.141 — 권한 체크박스 4종. 사용자 요청 '게시글 읽기/쓰기/댓글 작성/댓글 보기 권한 체크박스로'. */}
          <div className="field" style={{margin:0, gridColumn:'1 / -1', display:'flex', gap:14, flexWrap:'wrap', padding:'8px 0'}}>
            <label style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer'}}>
              <input type="checkbox" checked={draft.allowRead} onChange={(e) => setDraft({ ...draft, allowRead: e.target.checked })}/> 게시글 읽기
            </label>
            <label style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer'}}>
              <input type="checkbox" checked={draft.allowWrite} onChange={(e) => setDraft({ ...draft, allowWrite: e.target.checked })}/> 게시글 쓰기
            </label>
            <label style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer'}}>
              <input type="checkbox" checked={draft.allowCommentRead} onChange={(e) => setDraft({ ...draft, allowCommentRead: e.target.checked })}/> 댓글 보기
            </label>
            <label style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer'}}>
              <input type="checkbox" checked={draft.allowCommentWrite} onChange={(e) => setDraft({ ...draft, allowCommentWrite: e.target.checked })}/> 댓글 작성
            </label>
            <span className="dim-2 mono" style={{fontSize:10, alignSelf:'center'}}>· 체크 해제 시 비관리자 차단</span>
          </div>
          <button type="submit" className="btn btn-gold btn-small">＋ 추가</button>
        </form>
        {error && <div role="alert" className="mono" style={{color:'var(--danger)', fontSize:11, marginTop:10}}>{error}</div>}
      </article>

      {/* 게시판 목록 — v00.141 권한 체크박스 4열 추가 (글읽 · 글쓰 · 댓읽 · 댓쓰). */}
      <div style={{overflowX:'auto'}}>
      <table style={{width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:1100}}>
        <thead>
          <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
            <th scope="col" style={{padding:10, textAlign:'center', width:80}}>순서</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>ID</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>이름</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>유형</th>
            <th scope="col" style={{padding:10, textAlign:'right'}}>읽기≥</th>
            <th scope="col" style={{padding:10, textAlign:'right'}}>쓰기≥</th>
            <th scope="col" style={{padding:10, textAlign:'center', width:50}} title="게시글 읽기 허용">글읽</th>
            <th scope="col" style={{padding:10, textAlign:'center', width:50}} title="게시글 쓰기 허용">글쓰</th>
            <th scope="col" style={{padding:10, textAlign:'center', width:50}} title="댓글 보기 허용">댓읽</th>
            <th scope="col" style={{padding:10, textAlign:'center', width:50}} title="댓글 작성 허용">댓쓰</th>
            <th scope="col" style={{padding:10, textAlign:'right'}}>글 수</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>설명</th>
            <th scope="col" style={{padding:10, textAlign:'right'}}>액션</th>
          </tr>
        </thead>
        <tbody>
          {cats.map((c, i) => (
            <tr key={c.id} style={{borderBottom:'1px solid var(--line)'}}>
              <td style={{padding:8, textAlign:'center'}}>
                <div style={{display:'inline-flex', gap:4}}>
                  <button type="button" className="btn btn-small" onClick={() => move(i, -1)} disabled={i === 0}
                    style={{padding:'2px 6px', minHeight:0, fontSize:11}} aria-label="위로">▲</button>
                  <button type="button" className="btn btn-small" onClick={() => move(i, 1)} disabled={i === cats.length - 1}
                    style={{padding:'2px 6px', minHeight:0, fontSize:11}} aria-label="아래로">▼</button>
                </div>
              </td>
              <td className="mono gold" style={{padding:10, fontSize:11}}>{c.id}</td>
              <td style={{padding:10}}>
                <input className="field-input" style={{padding:'4px 8px'}} value={c.label}
                  onChange={(e) => update(i, 'label', e.target.value)}/>
              </td>
              <td style={{padding:10}}>
                <select className="field-input" style={{padding:'4px 8px'}} value={c.boardType}
                  onChange={(e) => update(i, 'boardType', e.target.value)}>
                  <option value="community">커뮤니티</option>
                  <option value="column">칼럼</option>
                </select>
              </td>
              <td style={{padding:10, textAlign:'right'}}>
                <input type="number" className="field-input" style={{padding:'4px 8px', width:64, textAlign:'right'}}
                  value={c.minLevel ?? 0} onChange={(e) => update(i, 'minLevel', e.target.value)}/>
              </td>
              <td style={{padding:10, textAlign:'right'}}>
                <input type="number" className="field-input" style={{padding:'4px 8px', width:64, textAlign:'right'}}
                  value={c.postMinLevel ?? 0} onChange={(e) => update(i, 'postMinLevel', e.target.value)}/>
              </td>
              {/* v00.141 — 권한 체크박스 4열. undefined(레거시) → checked. 명시 false 만 차단. */}
              <td style={{padding:10, textAlign:'center'}}>
                <input type="checkbox" aria-label="게시글 읽기 허용"
                  checked={c.allowRead !== false} onChange={(e) => update(i, 'allowRead', e.target.checked)}/>
              </td>
              <td style={{padding:10, textAlign:'center'}}>
                <input type="checkbox" aria-label="게시글 쓰기 허용"
                  checked={c.allowWrite !== false} onChange={(e) => update(i, 'allowWrite', e.target.checked)}/>
              </td>
              <td style={{padding:10, textAlign:'center'}}>
                <input type="checkbox" aria-label="댓글 보기 허용"
                  checked={c.allowCommentRead !== false} onChange={(e) => update(i, 'allowCommentRead', e.target.checked)}/>
              </td>
              <td style={{padding:10, textAlign:'center'}}>
                <input type="checkbox" aria-label="댓글 작성 허용"
                  checked={c.allowCommentWrite !== false} onChange={(e) => update(i, 'allowCommentWrite', e.target.checked)}/>
              </td>
              <td className="mono dim-2" style={{padding:10, textAlign:'right', fontSize:11}}>
                {c.boardType === 'community' ? postCount(c.id) : '-'}
              </td>
              <td style={{padding:10}}>
                <input className="field-input" style={{padding:'4px 8px'}} value={c.desc || ''}
                  onChange={(e) => update(i, 'desc', e.target.value)} placeholder="설명"/>
              </td>
              <td style={{padding:10, textAlign:'right'}}>
                <button type="button" className="btn btn-small" onClick={() => remove(i)}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <button type="button" className="btn btn-small" style={{marginTop:20}}
        onClick={async () => { if ((await window.BGNJ_CONFIRM("기본값으로 되돌립니다. 진행할까요?", { danger: true }))) { window.BGNJ_SAVE.resetCategories(); setCats(window.BGNJ_STORES.categories.slice()); } }}>
        기본값 복원
      </button>

      {/* 권한 매트릭스 — 등급 × 게시판 */}
      <article className="card" style={{padding:20, marginTop:32}}>
        <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>PERMISSION MATRIX</div>
        <h3 className="ko-serif" style={{fontSize:18, marginBottom:8}}>등급 × 게시판 권한</h3>
        <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:16}}>
          ✓ = 가능 / · = 불가. 이 매트릭스는 위 표의 등급 기준이 바뀌면 즉시 반영됩니다.
        </p>
        <div style={{overflow:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:540}}>
            <thead>
              <tr style={{background:'var(--bg-2)'}}>
                <th scope="col" style={{padding:10, textAlign:'left', position:'sticky', left:0, background:'var(--bg-2)', zIndex:1}}>등급</th>
                {communityCats.map((c) => (
                  <th key={c.id} scope="col" style={{padding:10, textAlign:'center', fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.18em', color:'var(--ink-3)'}}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => {
                const lv = g.id === 'admin' ? 100 : (g.level || 0);
                return (
                  <tr key={g.id} style={{borderTop:'1px solid var(--line)'}}>
                    <td style={{padding:10, position:'sticky', left:0, background:'var(--bg)', zIndex:1}}>
                      <span className="mono" style={{fontSize:10, letterSpacing:'0.14em', color: g.color || 'var(--primary)', border:`1px solid ${g.color || 'var(--primary-dim)'}`, padding:'1px 6px', marginRight:8}}>{g.label}</span>
                      <span className="dim-2 mono" style={{fontSize:10}}>Lv {lv}</span>
                    </td>
                    {communityCats.map((c) => {
                      const canRead = lv >= (c.minLevel ?? 0);
                      const canWrite = lv >= (c.postMinLevel ?? c.minLevel ?? 0);
                      return (
                        <td key={c.id} style={{padding:10, textAlign:'center', fontSize:11}}>
                          <span className="mono" style={{color: canRead ? 'var(--primary)' : 'var(--ink-3)'}}>읽 {canRead ? '✓' : '·'}</span>
                          {' / '}
                          <span className="mono" style={{color: canWrite ? 'var(--primary)' : 'var(--ink-3)'}}>쓰 {canWrite ? '✓' : '·'}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>

      {/* 말머리(Prefix) 관리 */}
      <article className="card" style={{padding:20, marginTop:32}}>
        <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>THREAD PREFIXES · 말머리</div>
        <h3 className="ko-serif" style={{fontSize:18, marginBottom:8}}>게시판별 말머리 설정</h3>
        <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:20}}>
          게시판마다 글 작성 시 선택할 수 있는 말머리(분류 태그)를 설정합니다.
          말머리가 등록된 게시판에서는 커뮤니티 상단에 필터 탭으로도 노출됩니다.
        </p>
        {communityCats.length === 0 && (
          <div className="dim" style={{fontSize:13}}>커뮤니티 게시판이 없습니다.</div>
        )}
        {communityCats.map((c) => {
          const catIdx = cats.findIndex((x) => x.id === c.id);
          const prefixes = c.prefixes || [];
          const draftVal = prefixDrafts[c.id] || "";
          return (
            <div key={c.id} style={{marginBottom:16, padding:'14px 16px', background:'var(--bg-2)', border:'1px solid var(--line)'}}>
              <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
                <span className="ko-serif" style={{fontSize:15}}>{c.label}</span>
                <span className="mono dim-2" style={{fontSize:10}}>#{c.id}</span>
                <span className="mono dim-2" style={{fontSize:10, marginLeft:4}}>{prefixes.length}개</span>
              </div>
              <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:10, minHeight:28}}>
                {prefixes.length === 0 && <span className="dim-2 mono" style={{fontSize:11}}>말머리 없음 — 추가하면 커뮤니티 필터로 자동 노출됩니다</span>}
                {prefixes.map((p) => (
                  <span key={p} style={{display:'inline-flex', alignItems:'center', gap:4, padding:'2px 10px', border:'1px solid var(--primary-dim)', fontSize:12}}>
                    <span className="gold">{p}</span>
                    <button type="button"
                      onClick={() => update(catIdx, 'prefixes', prefixes.filter((x) => x !== p))}
                      style={{background:'none', border:'none', cursor:'pointer', color:'var(--danger)', fontSize:15, lineHeight:1, padding:0}}
                      aria-label={`${p} 삭제`}>×</button>
                  </span>
                ))}
              </div>
              <div style={{display:'flex', gap:8}}>
                <input className="field-input" style={{padding:'4px 8px', maxWidth:220}} value={draftVal}
                  placeholder="말머리 입력 후 Enter 또는 추가..."
                  onChange={(e) => setPrefixDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    e.preventDefault();
                    const val = draftVal.trim();
                    if (val && !prefixes.includes(val)) update(catIdx, 'prefixes', [...prefixes, val]);
                    setPrefixDrafts((prev) => ({ ...prev, [c.id]: "" }));
                  }}/>
                <button type="button" className="btn btn-small btn-gold"
                  onClick={() => {
                    const val = draftVal.trim();
                    if (val && !prefixes.includes(val)) update(catIdx, 'prefixes', [...prefixes, val]);
                    setPrefixDrafts((prev) => ({ ...prev, [c.id]: "" }));
                  }}>추가</button>
              </div>
            </div>
          );
        })}
      </article>
    </>
  );
};

// === Admin: Grade CRUD =================================================
// 자동 승급 기준 칩 — 등급 표 각 행 아래에 인라인 노출 (read-only).
// tone='danger' 면 신고 한계 강조. 값이 없으면 0/제한없음으로 폴백.
const PromoChip = ({ label, value, prefix = '≥', tone }) => (
  <span style={{
    display:'inline-flex', alignItems:'center', gap:4,
    padding:'3px 8px', border:'1px solid var(--line-2)',
    borderRadius:999, background:'var(--bg)', color: tone === 'danger' ? 'var(--danger)' : 'var(--ink)',
  }}>
    <span style={{color:'var(--ink-3)', fontSize:10}}>{label}</span>
    <span style={{fontWeight:600}}>{prefix} {Number.isFinite(Number(value)) ? Number(value) : 0}</span>
  </span>
);

// === Community Boards Description Panel (v00.146) =================
// 사용자 요청 '커뮤니티의 각 항목별 설명(제목, 설명)을 관리할수 있는 페이지'.
// AdminCategoryPanel 은 기술적 카테고리 CRUD (slug / 권한 / 등급) 에 집중.
// 이 패널은 "운영자가 매일 손볼 콘텐츠" — 게시판 제목과 설명을 큼직한 입력으로 편집.
// 공지(notice) 게시판은 어떠한 경우에도 관리자만 작성 — 강제 규칙 표시.
const CommunityBoardsPanel = () => {
  // v00.172 — 카테고리 패널과 통합 + 테이블/리스트형 + 드래그앤드롭.
  // 사용자 보고 '커뮤니티 게시판 목록은 리스트형(테이블형)으로 보여주고 드래그앤드랍으로 순서 변경 + 카테고리와 합쳐'.
  const [tick, setTick] = React.useState(0);
  const grades = React.useMemo(() =>
    (window.BGNJ_STORES?.grades || []).slice().sort((a, b) => (a.level || 0) - (b.level || 0)),
    [tick]
  );
  const boards = React.useMemo(() => (
    (window.BGNJ_STORES?.categories || [])
      .filter((c) => c.boardType === 'community')
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  ), [tick]);
  const [edits, setEdits] = React.useState({});  // { id: { label, desc, ... } }
  const [saving, setSaving] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState({ id: '', label: '', desc: '' });

  const dirty = Object.keys(edits).length > 0;
  const valueOf = (b) => ({
    label: edits[b.id]?.label ?? b.label,
    desc: edits[b.id]?.desc ?? (b.desc || ''),
    minLevel: edits[b.id]?.minLevel ?? (b.minLevel ?? 0),
    postMinLevel: edits[b.id]?.postMinLevel ?? (b.postMinLevel ?? 0),
    allowRead: edits[b.id]?.allowRead ?? (b.allowRead !== false),
    allowWrite: edits[b.id]?.allowWrite ?? (b.allowWrite !== false),
    allowCommentRead: edits[b.id]?.allowCommentRead ?? (b.allowCommentRead !== false),
    allowCommentWrite: edits[b.id]?.allowCommentWrite ?? (b.allowCommentWrite !== false),
  });

  // v00.175 — 드래그앤드롭 reorder 상태.
  const [draggingId, setDraggingId] = React.useState(null);
  const [dragOverId, setDragOverId] = React.useState(null);
  const [expanded, setExpanded] = React.useState(null);  // 권한/레벨 expanded row id

  const update = (id, key, val) => {
    setEdits((cur) => ({ ...cur, [id]: { ...(cur[id] || {}), [key]: val } }));
    setSaveMsg('');
  };

  const slugify = (s) => String(s || '').trim().toLowerCase()
    .replace(/[^a-z0-9-_가-힣]+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '');

  const addBoard = async () => {
    const id = draft.id || slugify(draft.label);
    if (!id || !draft.label.trim()) { setSaveMsg('✗ 게시판 이름은 필수입니다.'); return; }
    if (boards.find((b) => b.id === id)) { setSaveMsg('✗ 이미 존재하는 ID 입니다.'); return; }
    setSaving(true);
    try {
      await window.BGNJ_API?.categories?.create?.({
        id, label: draft.label.trim(), boardType: 'community',
        minLevel: 0, postMinLevel: 0,
        description: draft.desc || '', prefixes: [],
        allowRead: true, allowWrite: true, allowCommentRead: true, allowCommentWrite: true,
        order: boards.length,
      });
      const allCats = (window.BGNJ_STORES?.categories || []).slice();
      allCats.push({
        id, label: draft.label.trim(), boardType: 'community',
        minLevel: 0, postMinLevel: 0, desc: draft.desc || '',
        prefixes: [], allowRead: true, allowWrite: true, allowCommentRead: true, allowCommentWrite: true,
        order: boards.length,
      });
      window.BGNJ_STORES.categories = allCats;
      window.BGNJ_SAVE.categories();
      setDraft({ id: '', label: '', desc: '' });
      setAdding(false);
      setTick((v) => v + 1);
      setSaveMsg(`✓ '${draft.label.trim()}' 게시판이 추가되었습니다.`);
      setTimeout(() => setSaveMsg(''), 2400);
    } catch (err) {
      setSaveMsg('✗ 추가 실패: ' + (err?.message || '알 수 없는 오류'));
    } finally { setSaving(false); }
  };

  const removeBoard = async (id) => {
    if (id === 'notice') { window.BGNJ_TOAST.error('공지 게시판은 삭제할 수 없습니다.'); return; }
    const target = boards.find((b) => b.id === id);
    if (!target) return;
    const postCount = ((window.BGNJ_COMMUNITY?.listPosts?.() || []).filter((p) => p.categoryId === id)).length;
    const note = postCount > 0 ? `\n현재 이 게시판에 ${postCount}개의 글이 있습니다. 삭제 후에도 게시글은 남되 분류가 비게 됩니다.` : '';
    if (!(await window.BGNJ_CONFIRM(`"${target.label}" 게시판을 삭제하시겠어요?${note}`, { danger: true }))) return;
    setSaving(true);
    try {
      await window.BGNJ_API?.categories?.remove?.(id);
      const allCats = (window.BGNJ_STORES?.categories || []).filter((c) => c.id !== id);
      window.BGNJ_STORES.categories = allCats;
      window.BGNJ_SAVE.categories();
      setEdits((cur) => { const next = { ...cur }; delete next[id]; return next; });
      setTick((v) => v + 1);
      setSaveMsg(`✓ '${target.label}' 게시판이 삭제되었습니다.`);
      setTimeout(() => setSaveMsg(''), 2400);
    } catch (err) {
      setSaveMsg('✗ 삭제 실패: ' + (err?.message || '알 수 없는 오류'));
    } finally { setSaving(false); }
  };

  // v00.175 — HTML5 드래그앤드롭 reorder. 드롭 시 즉시 서버 PATCH (display_order) 일괄.
  const onDrop = async (toId) => {
    if (!draggingId || draggingId === toId) {
      setDraggingId(null); setDragOverId(null); return;
    }
    const fromIdx = boards.findIndex((b) => b.id === draggingId);
    const toIdx = boards.findIndex((b) => b.id === toId);
    if (fromIdx < 0 || toIdx < 0) {
      setDraggingId(null); setDragOverId(null); return;
    }
    const next = boards.slice();
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setSaving(true);
    try {
      await Promise.all(next.map((b, i) => {
        if ((b.order ?? 0) === i) return Promise.resolve();
        return window.BGNJ_API?.categories?.update?.(b.id, { order: i }).catch(() => null);
      }));
      const allCats = (window.BGNJ_STORES?.categories || []).slice();
      next.forEach((b, i) => {
        const idx = allCats.findIndex((c) => c.id === b.id);
        if (idx >= 0) allCats[idx] = { ...allCats[idx], order: i };
      });
      window.BGNJ_STORES.categories = allCats;
      window.BGNJ_SAVE.categories();
      setTick((v) => v + 1);
      setSaveMsg('✓ 순서 변경됨.');
      setTimeout(() => setSaveMsg(''), 1800);
    } catch (err) {
      setSaveMsg('✗ 순서 변경 실패: ' + (err?.message || ''));
    } finally {
      setSaving(false);
      setDraggingId(null);
      setDragOverId(null);
    }
  };

  // v00.175 — 행 단위 통합 저장 (label/desc/level/4종 권한 한 번에 D1 PATCH).
  const commitRow = async (id) => {
    const e = edits[id];
    if (!e) return;
    setSaving(true);
    try {
      const remap = {};
      if ('label' in e) remap.label = e.label;
      if ('desc' in e) remap.description = e.desc;
      if ('minLevel' in e) remap.minLevel = Number(e.minLevel);
      if ('postMinLevel' in e) remap.postMinLevel = Number(e.postMinLevel);
      if ('allowRead' in e) remap.allowRead = e.allowRead;
      if ('allowWrite' in e) remap.allowWrite = e.allowWrite;
      if ('allowCommentRead' in e) remap.allowCommentRead = e.allowCommentRead;
      if ('allowCommentWrite' in e) remap.allowCommentWrite = e.allowCommentWrite;
      await window.BGNJ_API?.categories?.update?.(id, remap);
      const allCats = (window.BGNJ_STORES?.categories || []).slice();
      const idx = allCats.findIndex((c) => c.id === id);
      if (idx >= 0) {
        allCats[idx] = { ...allCats[idx], ...e };
      }
      window.BGNJ_STORES.categories = allCats;
      window.BGNJ_SAVE.categories();
      setEdits((cur) => { const next = { ...cur }; delete next[id]; return next; });
      setTick((v) => v + 1);
      setSaveMsg('✓ 저장됨.');
      setTimeout(() => setSaveMsg(''), 1800);
    } catch (err) {
      setSaveMsg('✗ 저장 실패: ' + (err?.message || ''));
    } finally { setSaving(false); }
  };

  const commitAll = async () => {
    if (saving || !dirty) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const changedIds = Object.keys(edits);
      // 1) 서버 PATCH 병렬 — v00.175 새 필드(level/권한 4종) 포함.
      const failed = [];
      await Promise.all(changedIds.map(async (id) => {
        const e = edits[id];
        const remap = {};
        if ('label' in e) remap.label = e.label;
        if ('desc' in e) remap.description = e.desc;
        if ('minLevel' in e) remap.minLevel = Number(e.minLevel);
        if ('postMinLevel' in e) remap.postMinLevel = Number(e.postMinLevel);
        if ('allowRead' in e) remap.allowRead = e.allowRead;
        if ('allowWrite' in e) remap.allowWrite = e.allowWrite;
        if ('allowCommentRead' in e) remap.allowCommentRead = e.allowCommentRead;
        if ('allowCommentWrite' in e) remap.allowCommentWrite = e.allowCommentWrite;
        try {
          await window.BGNJ_API?.categories?.update?.(id, remap);
        } catch (err) { failed.push(id); }
      }));
      // 2) 로컬 store 동기화 — 모든 변경 필드 머지.
      const allCats = (window.BGNJ_STORES?.categories || []).slice();
      changedIds.forEach((id) => {
        const idx = allCats.findIndex((c) => c.id === id);
        if (idx >= 0) allCats[idx] = { ...allCats[idx], ...edits[id] };
      });
      window.BGNJ_STORES.categories = allCats;
      window.BGNJ_SAVE.categories();
      setEdits({});
      setTick((v) => v + 1);
      if (failed.length) {
        setSaveMsg(`⚠ ${changedIds.length - failed.length}개 저장, ${failed.length}개 실패: ${failed.join(', ')}`);
      } else {
        setSaveMsg(`✓ ${changedIds.length}개 게시판 정보 저장됨.`);
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch (err) {
      setSaveMsg('✗ 저장 실패: ' + (err?.message || '알 수 없는 오류'));
    } finally { setSaving(false); }
  };

  return (
    <>
      <AdminPanelHeader
        eyebrow="COMMUNITY · 게시판 관리"
        title="커뮤니티 게시판 — 테이블 + 드래그앤드롭"
        description="게시판을 한 화면에서 추가·삭제·순서변경·편집합니다. 좌측 ≡ 핸들로 드래그앤드롭 / 행 클릭 시 권한·등급 펼쳐 보기. 모든 변경은 D1 서버 즉시 저장."/>

      {/* v00.171 — 새 게시판 추가 (즉시 서버 반영). */}
      {!adding ? (
        <div style={{marginBottom:16}}>
          <button type="button" className="btn btn-gold btn-small" onClick={() => setAdding(true)}>
            ＋ 새 게시판 추가
          </button>
        </div>
      ) : (
        <article className="admin-form-card" style={{padding:18, marginBottom:16, borderColor:'var(--primary-dim)'}}>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em', marginBottom:12}}>＋ 새 게시판</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:10, marginBottom:12}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="new-bd-label">이름 <span className="gold" aria-hidden="true">*</span></label>
              <input id="new-bd-label" className="field-input"
                value={draft.label}
                onChange={(e) => setDraft({...draft, label: e.target.value, id: draft.id || slugify(e.target.value)})}
                placeholder="예: 자유 / 질문 / 후기"/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="new-bd-id">ID (slug)</label>
              <input id="new-bd-id" className="field-input"
                value={draft.id}
                onChange={(e) => setDraft({...draft, id: slugify(e.target.value)})}
                placeholder="자동 생성"/>
            </div>
          </div>
          <div className="field" style={{marginBottom:12}}>
            <label className="field-label" htmlFor="new-bd-desc">설명</label>
            <textarea id="new-bd-desc" className="field-input" rows={2}
              value={draft.desc}
              onChange={(e) => setDraft({...draft, desc: e.target.value})}
              placeholder="게시판 상단 안내 문구 (선택)"
              style={{fontFamily:'inherit', resize:'vertical', lineHeight:1.6}}/>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button type="button" className="btn btn-gold" onClick={addBoard} disabled={saving || !draft.label.trim()}>
              {saving ? '추가 중…' : '＋ 추가'}
            </button>
            <button type="button" className="btn btn-small" onClick={() => { setAdding(false); setDraft({id:'',label:'',desc:''}); }}>
              취소
            </button>
          </div>
        </article>
      )}

      {boards.length === 0 ? (
        <AdminEmpty>등록된 커뮤니티 게시판이 없습니다. 위에서 추가하세요.</AdminEmpty>
      ) : (
        <div style={{border:'1px solid var(--line)', overflow:'hidden'}}>
          {/* 테이블 헤더 */}
          <div className="mono dim-2" style={{
            display:'grid',
            gridTemplateColumns:'40px 130px 1fr 80px 80px 80px',
            gap:0, alignItems:'center', padding:'10px 14px',
            background:'var(--bg-2)', borderBottom:'1px solid var(--line)',
            fontSize:10, letterSpacing:'0.18em', fontWeight:700,
          }}>
            <span></span>
            <span>ID</span>
            <span>이름 / 설명</span>
            <span style={{textAlign:'center'}}>글 수</span>
            <span style={{textAlign:'center'}}>권한</span>
            <span style={{textAlign:'right'}}>액션</span>
          </div>
          {boards.map((b, idx) => {
            const isNotice = b.id === 'notice';
            const v = valueOf(b);
            const isEdited = !!edits[b.id];
            const isExpanded = expanded === b.id;
            const isDragging = draggingId === b.id;
            const isDragOver = dragOverId === b.id && draggingId !== b.id;
            const postCount = ((window.BGNJ_COMMUNITY?.listPosts?.() || []).filter((p) => p.categoryId === b.id)).length;
            return (
              <div key={b.id}
                draggable={!isNotice}
                onDragStart={(e) => {
                  if (isNotice) { e.preventDefault(); return; }
                  setDraggingId(b.id);
                  try { e.dataTransfer.effectAllowed = 'move'; } catch {}
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOverId(b.id); }}
                onDragLeave={() => setDragOverId((cur) => cur === b.id ? null : cur)}
                onDrop={(e) => { e.preventDefault(); onDrop(b.id); }}
                onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
                style={{
                  borderBottom: idx < boards.length - 1 ? '1px solid var(--line)' : 'none',
                  background: isExpanded ? 'rgba(245,213,72,0.04)' : (isDragOver ? 'rgba(245,213,72,0.10)' : (isEdited ? 'rgba(245,213,72,0.02)' : 'var(--bg)')),
                  opacity: isDragging ? 0.5 : 1,
                  borderTop: isDragOver ? '2px solid var(--primary)' : undefined,
                  transition:'background .12s',
                }}>
                {/* 메인 행 */}
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'40px 130px 1fr 80px 80px 80px',
                  gap:0, alignItems:'center', padding:'12px 14px',
                }}>
                  {/* DnD 핸들 */}
                  <span title={isNotice ? '공지는 순서 고정' : '드래그하여 순서 변경'}
                    style={{
                      cursor: isNotice ? 'not-allowed' : 'grab',
                      color:'var(--ink-3)', fontSize:18, lineHeight:1,
                      userSelect:'none', textAlign:'center',
                      opacity: isNotice ? 0.3 : 1,
                    }}>≡</span>
                  {/* ID */}
                  <span className="mono dim-2" style={{fontSize:11, letterSpacing:'0.06em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                    {b.id}
                    {isEdited && <span className="gold" style={{marginLeft:4}}>●</span>}
                  </span>
                  {/* 이름 (편집) — 클릭으로 expand 토글하지 않게 input stopPropagation */}
                  <div style={{minWidth:0}}>
                    <input type="text"
                      value={v.label}
                      onChange={(e) => update(b.id, 'label', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width:'100%', padding:'4px 8px', fontSize:13,
                        background:'transparent', border:'1px solid transparent',
                        color:'var(--ink)', fontFamily:'inherit', fontWeight:600,
                      }}
                      onFocus={(e) => e.target.style.border = '1px solid var(--line-2)'}
                      onBlur={(e) => e.target.style.border = '1px solid transparent'}/>
                    {/* 설명 미리보기 (한 줄, expanded 아닐 때만) */}
                    {!isExpanded && v.desc && (
                      <div className="dim-2" style={{
                        fontSize:11, padding:'0 8px', marginTop:2,
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                      }}>{v.desc}</div>
                    )}
                  </div>
                  {/* 글 수 */}
                  <span className="mono" style={{textAlign:'center', fontSize:11, color:'var(--ink-2)'}}>
                    {postCount}
                  </span>
                  {/* 권한 요약 */}
                  <span className="mono" style={{textAlign:'center', fontSize:10, letterSpacing:'0.06em', color:'var(--ink-3)'}}>
                    {isNotice ? '관리자' : `Lv${v.minLevel}/${v.postMinLevel}`}
                  </span>
                  {/* 액션 */}
                  <div style={{display:'flex', gap:4, justifyContent:'flex-end'}}>
                    <button type="button"
                      onClick={() => setExpanded(isExpanded ? null : b.id)}
                      style={{
                        padding:'4px 10px', fontSize:11, fontFamily:'var(--font-mono)',
                        background: isExpanded ? 'rgba(245,213,72,0.14)' : 'var(--bg-2)',
                        border:'1px solid var(--line-2)', cursor:'pointer',
                        color: isExpanded ? 'var(--ink)' : 'var(--ink-2)',
                      }}>{isExpanded ? '닫기' : '편집'}</button>
                    {!isNotice && (
                      <button type="button"
                        onClick={() => removeBoard(b.id)}
                        disabled={saving}
                        title="삭제"
                        style={{
                          padding:'4px 8px', fontSize:11, fontFamily:'var(--font-mono)',
                          background:'var(--bg-2)', border:'1px solid var(--line-2)',
                          color:'var(--danger)', cursor:'pointer',
                        }}>🗑</button>
                    )}
                  </div>
                </div>
                {/* expanded — 권한·설명·등급 편집 */}
                {isExpanded && (
                  <div style={{padding:'14px 18px 18px', background:'var(--bg-2)', borderTop:'1px solid var(--line)'}}>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
                      {/* 설명 */}
                      <div className="field" style={{margin:0, gridColumn:'1 / -1'}}>
                        <label className="field-label" style={{fontSize:11}}>설명 (게시판 상단 안내 문구)</label>
                        <textarea
                          className="field-input"
                          rows={2}
                          value={v.desc}
                          onChange={(e) => update(b.id, 'desc', e.target.value)}
                          placeholder="비워두면 미표시"
                          style={{fontFamily:'inherit', resize:'vertical', fontSize:13}}/>
                      </div>
                      {/* 최소 등급 */}
                      <div className="field" style={{margin:0}}>
                        <label className="field-label" style={{fontSize:11}}>읽기 최소 등급 (level)</label>
                        <select
                          className="field-input"
                          value={v.minLevel}
                          onChange={(e) => update(b.id, 'minLevel', e.target.value)}>
                          {grades.map((g) => (
                            <option key={g.id} value={g.level}>Lv {g.level} · {g.label}</option>
                          ))}
                        </select>
                      </div>
                      {/* 작성 최소 등급 */}
                      <div className="field" style={{margin:0}}>
                        <label className="field-label" style={{fontSize:11}}>작성 최소 등급 (level)</label>
                        <select
                          className="field-input"
                          value={v.postMinLevel}
                          onChange={(e) => update(b.id, 'postMinLevel', e.target.value)}>
                          {grades.map((g) => (
                            <option key={g.id} value={g.level}>Lv {g.level} · {g.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* 권한 4종 체크박스 */}
                    <fieldset style={{border:'1px solid var(--line)', padding:'10px 14px'}}>
                      <legend className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', padding:'0 6px'}}>권한 (4종)</legend>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'6px 18px', fontSize:13}}>
                        {[
                          ['allowRead', '글 읽기 허용'],
                          ['allowWrite', '글 작성 허용'],
                          ['allowCommentRead', '댓글 읽기 허용'],
                          ['allowCommentWrite', '댓글 작성 허용'],
                        ].map(([key, label]) => (
                          <label key={key} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                            <input type="checkbox"
                              checked={!!v[key]}
                              disabled={isNotice}
                              onChange={(e) => update(b.id, key, e.target.checked)}/>
                            <span style={{color: isNotice ? 'var(--ink-3)' : 'var(--ink)'}}>{label}</span>
                          </label>
                        ))}
                      </div>
                      {isNotice && (
                        <p className="dim-2" style={{fontSize:10, marginTop:8, lineHeight:1.5}}>
                          공지(notice) 는 강제 관리자 전용 — 권한 체크박스 무시.
                        </p>
                      )}
                    </fieldset>
                    {/* 행 액션 */}
                    {isEdited && (
                      <div style={{display:'flex', gap:8, marginTop:12, justifyContent:'flex-end'}}>
                        <button type="button" className="btn btn-small btn-gold"
                          onClick={() => commitRow(b.id)} disabled={saving}>
                          💾 이 게시판만 저장
                        </button>
                        <button type="button" className="btn btn-small"
                          onClick={() => setEdits((cur) => { const next = { ...cur }; delete next[b.id]; return next; })}>
                          되돌리기
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AdminSaveBar
        message={saveMsg || null}
        messageVariant={saveMsg.startsWith('✗') ? 'danger' : (saveMsg.startsWith('⚠') ? 'warning' : 'success')}>
        <button type="button" className="btn btn-gold" onClick={commitAll} disabled={saving || !dirty}>
          {saving ? '저장 중…' : (dirty ? '💾 저장' : '저장됨 ✓')}
        </button>
      </AdminSaveBar>
      <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.7}}>
        ⓘ <strong>공지(notice)</strong> 게시판은 admin 전용 강제 규칙 — 삭제 불가. 추가/삭제는 즉시 서버에 반영됩니다. 제목/설명 편집은 [💾 저장] 버튼 클릭 시 commit.
      </p>
    </>
  );
};

const AdminGradePanel = () => {
  // v00.141 — 통합 패널: 회원 등급 + 자동 승급/강등 기준을 한 곳에서 편집.
  // 사용자 요청 '자동 승급/강등과 회원등급 관리가 한 기능에서 진행되게 + 저장 버튼 살려주고'.
  // 변경: 기존 save-on-keystroke 자동 저장 제거 → 편집은 local state, 명시적 [저장] 버튼이 commit.
  const G = window.BGNJ_GUARD;
  const _initialRules = () => {
    try { return JSON.parse(JSON.stringify(window.BGNJ_GRADE_RULES_EFFECTIVE?.() || window.BGNJ_GRADE_RULES || {})); }
    catch { return {}; }
  };
  const [grades, setGrades] = React.useState(() => window.BGNJ_STORES.grades.slice());
  const [rules, setRules] = React.useState(_initialRules);
  const [draft, setDraft] = React.useState({ id:"", label:"", level:20, color:"#D4AF37", desc:"" });
  const [error, setError] = React.useState("");
  const [dirty, setDirty] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [busyReevaluate, setBusyReevaluate] = React.useState(false);
  const [reevalResult, setReevalResult] = React.useState(null);

  // v00.189 — 사용자 보고 '등급 이름 자꾸 초기화'. mount 시 D1 에서 강제 재 fetch.
  // 이전엔 BGNJ_STORES.grades (boot async fetch 결과) 가 mount 시점에 stale 일 수 있어
  // 사용자가 default 값 위에 편집 → 저장 → D1 default 로 덮어쓰여 '초기화' 인상 발생.
  // 본 사이클에서 mount 마다 직접 fetch + dirty 시 무시 (사용자 편집 보호).
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await window.BGNJ_API?.grades?.list?.();
        if (cancelled) return;
        if (Array.isArray(r?.grades) && r.grades.length) {
          const fresh = r.grades.map((g) => ({
            id: g.id, label: g.label, level: g.level,
            color: g.color, desc: g.description,
            order: g.display_order ?? 0,
          }));
          window.BGNJ_STORES.grades = fresh;
          setGrades((prev) => {
            // dirty 면 사용자 편집 보호 — 무시.
            if (dirty) return prev;
            return fresh.slice();
          });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 정렬된 grades (level asc).
  const sortedGrades = React.useMemo(() => grades.slice().sort((a, b) => a.level - b.level), [grades]);

  const markDirty = () => { setDirty(true); setSaveMsg(""); };

  const add = (e) => {
    e.preventDefault();
    setError("");
    if (!draft.id || !draft.label) return setError("ID와 이름은 필수입니다.");
    if (grades.find(g => g.id === draft.id)) return setError("이미 존재하는 ID입니다.");
    setGrades([...grades, { ...draft, level: Number(draft.level) }]);
    setDraft({ id:"", label:"", level:20, color:"#D4AF37", desc:"" });
    markDirty();
  };
  const update = (i, key, val) => {
    setGrades((cur) => {
      const next = cur.slice();
      next[i] = { ...next[i], [key]: key === "level" ? Number(val) : val };
      return next;
    });
    markDirty();
  };
  const remove = async (i) => {
    const g = grades[i];
    if (g.id === "admin" || g.id === "guest") { window.BGNJ_TOAST.error("기본 등급(guest/admin)은 삭제할 수 없습니다."); return; }
    if (!(await window.BGNJ_CONFIRM(`"${g.label}" 등급을 삭제하시겠어요?`, { danger: true }))) return;
    setGrades(grades.filter((_, j) => j !== i));
    markDirty();
  };
  const setRuleField = (gid, key, val) => {
    setRules((r) => ({ ...r, [gid]: { ...(r[gid] || {}), [key]: Number(val) || 0 } }));
    markDirty();
  };

  // v00.141 — 통합 저장: 등급(localStorage) + 자동 승급 기준(site_content_kv.gradeRules) 동시 commit.
  // v00.170 — D1 grades_kv 도 함께 upsert. localStorage 만 저장하던 버그로 새로고침 시 서버 default 가 덮어써서
  //          이름이 초기화되던 사용자 보고 '회원 등급 이름이 자꾸 초기화' 직접 fix.
  const commitAll = async () => {
    if (saving) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const sorted = grades.slice().sort((a, b) => a.level - b.level);

      // 1) D1 grades_kv 에 각 등급 upsert (label/level/color/description/order).
      // v00.189 — 실패 시 즉시 alert (이전엔 saveMsg 만 → 사용자 못 보고 새로고침해서 D1 default 로 덮어쓰여 '초기화' 인상).
      const failed = [];
      for (const g of sorted) {
        try {
          if (!window.BGNJ_API?.grades?.upsert) {
            throw new Error('BGNJ_API.grades.upsert 가 로드되지 않았습니다 (네트워크/스크립트 로딩 문제).');
          }
          await window.BGNJ_API.grades.upsert(g.id, {
            label: g.label, level: Number(g.level || 0), color: g.color || '',
            description: g.desc || '', order: Number(g.order || g.level || 0),
          });
        } catch (err) {
          failed.push({ id: g.id, label: g.label, msg: err?.message || String(err) });
        }
      }
      if (failed.length) {
        const msg = `⚠ 등급 서버 저장 ${failed.length}건 실패\n\n${failed.map(f => `• ${f.id} (${f.label}): ${f.msg}`).join('\n')}\n\n새로고침 시 서버 D1 default 가 다시 덮어쓰므로 — 다시 시도하거나 로그아웃 후 admin 재로그인 후 시도해 주세요.`;
        window.BGNJ_TOAST.error(msg);
        setSaveMsg(`⚠ ${failed.length}건 실패 — alert 참조`);
        // 실패 시 setDirty(false) 하지 않음 — 사용자가 다시 시도 가능.
        setSaving(false);
        return;
      }

      // 2) 클라이언트 캐시(localStorage 폴백) 갱신.
      window.BGNJ_STORES.grades = sorted;
      window.BGNJ_SAVE.grades();
      setGrades(sorted);

      // 3) 자동 승급 기준 site_content_kv 저장.
      await window.BGNJ_SITE_CONTENT?.saveSection?.('gradeRules', rules);

      setDirty(false);
      if (!failed.length) {
        setSaveMsg("✓ 등급(D1) + 자동 승급 기준 저장 완료.");
        setTimeout(() => setSaveMsg(""), 3000);
      }
    } catch (err) {
      setSaveMsg("✗ 저장 실패: " + (err?.message || '알 수 없는 오류'));
    } finally {
      setSaving(false);
    }
  };

  const resetAll = async () => {
    if (!(await window.BGNJ_CONFIRM("등급 + 자동 승급 기준을 모두 기본값으로 되돌립니다. 진행할까요?\n(서버 D1 grades_kv 도 default 값으로 덮어씌워집니다.)", { danger: true }))) return;
    setSaving(true);
    try {
      // v00.181 — 이전엔 localStorage 만 reset 후 새로고침 시 D1 default 가 다시 덮어써서 reset 효과 없었음.
      // resetGrades() 가 BGNJ_STORES.grades 를 default 로 set → 그 값을 D1 에도 PUT.
      window.BGNJ_SAVE.resetGrades();
      const defaults = (window.BGNJ_STORES?.grades || []).slice();
      for (const g of defaults) {
        try {
          await window.BGNJ_API?.grades?.upsert?.(g.id, {
            label: g.label, level: Number(g.level || 0), color: g.color || '',
            description: g.desc || '', order: Number(g.order || g.level || 0),
          });
        } catch {}
      }
      await window.BGNJ_SITE_CONTENT?.resetSection?.('gradeRules');
      setGrades(window.BGNJ_STORES.grades.slice());
      setRules(_initialRules());
      setDirty(false);
      setSaveMsg("기본값 복원 완료 (D1 + localStorage).");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg("✗ 복원 실패: " + (err?.message || '알 수 없는 오류'));
    } finally {
      setSaving(false);
    }
  };

  const reevaluate = async () => {
    if (dirty) { window.BGNJ_TOAST.error("저장하지 않은 변경 사항이 있습니다. 먼저 [저장] 후 재산정하세요."); return; }
    if (!(await window.BGNJ_CONFIRM("전체 회원의 활동량을 재평가하여 자격 등급으로 자동 승급/강등 합니다. 진행할까요?", { danger: true }))) return;
    setBusyReevaluate(true);
    try {
      await window.BGNJ_AUTH?.refreshUsers?.();
      try { await window.BGNJ_GRADE_PROMO?.prefetchAllServerMetrics?.(); } catch {}
      const summary = window.BGNJ_GRADE_PROMO?.reevaluateAll?.() || { promoted: 0, demoted: 0 };
      setReevalResult(summary);
    } catch (err) {
      window.BGNJ_TOAST.error("재산정 중 오류: " + (err?.message || '알 수 없는 오류'));
    } finally { setBusyReevaluate(false); }
  };

  return (
    <>
      <AdminPanelHeader
        eyebrow="MEMBERSHIP · 회원 등급"
        title="회원 등급 + 자동 승급/강등"
        description="회원 등급의 이름·단계·색상을 관리하고, 각 등급의 자동 승급 기준을 함께 편집합니다. 변경 사항은 [💾 저장] 버튼을 누를 때만 적용됩니다."/>

      <article className="admin-form-card">
        <div className="admin-form-card__eyebrow">＋ 새 등급 추가</div>
        <form onSubmit={add} style={{display:'grid', gridTemplateColumns:'1fr 1fr 100px 100px 1fr auto', gap:10, alignItems:'end'}}>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="grade-id">ID</label>
            <input id="grade-id" className="field-input" value={draft.id}
              onChange={e => setDraft({...draft, id:e.target.value.replace(/\s+/g,'-').toLowerCase()})}
              placeholder="slug"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="grade-label">이름</label>
            <input id="grade-label" className="field-input" value={draft.label} onChange={e => setDraft({...draft, label:e.target.value})} placeholder="등급 이름"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="grade-level">단계</label>
            <input id="grade-level" type="number" className="field-input" value={draft.level}
              onChange={e => setDraft({...draft, level:e.target.value})}/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="grade-color">색상</label>
            <input id="grade-color" type="color" className="field-input" style={{padding:2, height:38}}
              value={draft.color} onChange={e => setDraft({...draft, color:e.target.value})}/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="grade-desc">설명</label>
            <input id="grade-desc" className="field-input" value={draft.desc}
              onChange={e => setDraft({...draft, desc:e.target.value})}/>
          </div>
          <button type="submit" className="btn btn-gold btn-small">추가</button>
        </form>
        {error && <div role="alert" className="mono" style={{color:'var(--danger)', fontSize:11, marginTop:10}}>{error}</div>}
      </article>

      <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th scope="col">배지</th>
            <th scope="col">ID</th>
            <th scope="col">이름</th>
            <th scope="col" className="right">단계</th>
            <th scope="col">색상</th>
            <th scope="col">설명</th>
            <th scope="col" className="right">액션</th>
          </tr>
        </thead>
        <tbody>
          {sortedGrades.map((g) => {
            const i = grades.findIndex((x) => x.id === g.id);
            const rule = rules[g.id];
            const RULE_KEYS = [
              { k: 'posts',            l: '게시글' },
              { k: 'comments',         l: '댓글' },
              { k: 'visitsLast30Days', l: '30일 방문' },
              { k: 'daysSinceSignup',  l: '가입경과(일)' },
              { k: 'likesReceived',    l: '받은 좋아요' },
              { k: 'activeDays',       l: '활동일' },
              { k: 'eventsAttended',   l: '행사 참석' },
              { k: 'maxReports',       l: '신고 한계 <', tone: 'danger' },
            ];
            return (
              <React.Fragment key={g.id}>
                <tr style={{borderBottom: rule ? 'none' : undefined}}>
                  <td>
                    <span className="grade-badge" style={{color: g.color}}>{g.label}</span>
                  </td>
                  <td className="mono gold">{g.id}</td>
                  <td>
                    <input className="field-input" style={{padding:'6px 10px'}} value={g.label}
                      onChange={e => update(i, 'label', e.target.value)}/>
                  </td>
                  <td className="right">
                    <input type="number" className="field-input" style={{padding:'6px 10px', width:80, textAlign:'right'}}
                      value={g.level} onChange={e => update(i, 'level', e.target.value)}/>
                  </td>
                  <td>
                    <input type="color" className="field-input" style={{padding:0, width:60, height:32}}
                      value={g.color} onChange={e => update(i, 'color', e.target.value)}/>
                  </td>
                  <td>
                    <input className="field-input" style={{padding:'6px 10px'}} value={g.desc || ''}
                      onChange={e => update(i, 'desc', e.target.value)}/>
                  </td>
                  <td className="right">
                    <button type="button" className="btn btn-small" onClick={() => remove(i)}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}} disabled={g.id === "admin" || g.id === "guest"}>삭제</button>
                  </td>
                </tr>
                {rule && (
                  <tr style={{background:'var(--bg-2)'}}>
                    <td colSpan={7} style={{padding:'10px 14px 16px', borderTop:'1px dashed var(--line)'}}>
                      <div className="mono" style={{fontSize:10, letterSpacing:'0.18em', color:'var(--ink-3)', marginBottom:8}}>
                        ↳ 자동 승급 기준 — 모두 동시 충족 시 <strong style={{color: g.color}}>{g.label}</strong> 자동 부여
                      </div>
                      <div style={{display:'flex', flexWrap:'wrap', gap:8, fontFamily:'var(--font-mono)', fontSize:11}}>
                        {RULE_KEYS.map(({k, l, tone}) => (
                          <label key={k} style={{display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', border:'1px solid var(--line-2)', background:'var(--bg)'}}>
                            <span className="dim-2" style={{fontSize:10, letterSpacing:'0.08em'}}>{l}</span>
                            <input type="number" min={0}
                              value={rule[k] ?? 0}
                              onChange={(e) => setRuleField(g.id, k, e.target.value)}
                              style={{width:60, padding:'2px 6px', textAlign:'right', border:'1px solid var(--line-2)', background:'var(--bg)', color: tone === 'danger' ? 'var(--danger)' : 'var(--ink)', fontFamily:'var(--font-mono)', fontSize:11}}/>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      </div>

      <AdminSaveBar
        message={saveMsg || null}
        messageVariant={saveMsg.startsWith('✗') ? 'danger' : 'success'}>
        <button type="button" className="btn btn-gold" onClick={commitAll} disabled={saving || !dirty}>
          {saving ? '저장 중…' : (dirty ? '💾 저장 (등급 + 자동 승급 기준)' : '저장됨 ✓')}
        </button>
        <button type="button" className="btn" onClick={reevaluate} disabled={busyReevaluate || dirty}>
          {busyReevaluate ? '재산정 중…' : '🔄 전체 회원 재산정'}
        </button>
        {reevalResult && (
          <span className="mono" style={{fontSize:12, fontWeight:600, color:'var(--secondary)'}}>
            ✓ 승급 {reevalResult.promoted} · 강등 {reevalResult.demoted}
          </span>
        )}
        <span className="admin-savebar__spacer"/>
        <button type="button" className="btn btn-small" onClick={resetAll} style={{borderColor:'var(--line-2)'}}>
          기본값 복원
        </button>
      </AdminSaveBar>
      <p style={{fontSize:11, color:'var(--ink-3)', marginTop:10, lineHeight:1.6}}>
        ⓘ 자동 승급 기준은 <code>모든 조건 동시 충족</code> 시에만 자격 부여. 신고 한계 초과 시 자격 무관 강제 강등(member).
        승급/강등 시 본인에게 알림 자동 발송. 변경은 <strong>저장 버튼</strong> 클릭 시점에만 영속화됩니다.
      </p>
    </>
  );
};

// v00.141 — GradePromotionPanel 은 AdminGradePanel 안으로 통합 흡수됨.
// 사용자 요청 '자동 승급/강등과 회원등급 관리가 한 기능에서 진행되게'.

// === Admin: Column Editor (Tiptap column preset — inline draggable images)
// v00.133 — 칼럼 카테고리 칩 선택 + 인라인 추가/삭제. AdminColumnEditor / ColumnsHubPanel 에서 공유.
// site_content_kv.columnCategories 가 source-of-truth.
const ColumnCategoryChips = ({ selected, onSelect, allowManage = true }) => {
  const [scTick, setScTick] = React.useState(0);
  const sc = React.useMemo(() => (window.BGNJ_SITE_CONTENT?.get?.() || {}), [scTick]);
  const cats = React.useMemo(() => {
    const list = Array.isArray(sc.columnCategories) && sc.columnCategories.length
      ? sc.columnCategories
      : ['왕의 미학', '군주의 언어', '공간의 철학', '현대의 독법'];
    // 선택값이 목록에 없으면 (편집 중인 옛 값) 추가 노출.
    return selected && !list.includes(selected) ? [...list, selected] : list;
  }, [sc, scTick, selected]);
  const [adding, setAdding] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const addCat = async () => {
    const v = newName.trim();
    if (!v || cats.includes(v) || busy) return;
    setBusy(true);
    try {
      const next = [...(sc.columnCategories || []), v];
      await window.BGNJ_SITE_CONTENT.saveSection('columnCategories', next);
      setNewName('');
      setAdding(false);
      setScTick((x) => x + 1);
      onSelect?.(v);
    } catch (err) {
      window.BGNJ_TOAST.error('카테고리 추가 실패: ' + (err?.message || ''));
    } finally { setBusy(false); }
  };
  const removeCat = async (name) => {
    if (!(await window.BGNJ_CONFIRM(`'${name}' 카테고리를 삭제하시겠어요?\n(기존 칼럼의 값은 보존됨, 새 칼럼 작성 선택지에서만 사라짐.)`, { danger: true }))) return;
    setBusy(true);
    try {
      const next = (sc.columnCategories || []).filter((c) => c !== name);
      await window.BGNJ_SITE_CONTENT.saveSection('columnCategories', next);
      setScTick((x) => x + 1);
      if (selected === name && next.length > 0) onSelect?.(next[0]);
    } catch (err) {
      window.BGNJ_TOAST.error('카테고리 삭제 실패: ' + (err?.message || ''));
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
        {cats.map((c) => {
          const active = c === selected;
          // v00.220 — 비활성 칩이 흰 배경에 묻혀 안 보이던 문제 해결: bg-2 fill + line-2 보더로 윤곽 강화.
          //          X 버튼은 평상시 회색, hover/focus 시에만 빨강 — 시각 무게가 카테고리명보다 강하지 않게.
          return (
            <span key={c} style={{
              display:'inline-flex', alignItems:'center', gap:0,
              borderRadius:999,
              border: '1px solid ' + (active ? 'var(--primary)' : 'var(--line-2)'),
              background: active ? 'rgba(245,213,72,0.10)' : 'var(--bg-2)',
            }}>
              <button type="button"
                onClick={() => onSelect?.(c)}
                aria-pressed={active}
                style={{
                  padding:'6px 4px 6px 14px', fontSize:12, cursor:'pointer',
                  color: active ? 'var(--primary)' : 'var(--ink)',
                  fontWeight: active ? 600 : 500,
                  background:'transparent', border:'none',
                }}>
                {c}
              </button>
              {allowManage && (
                <button type="button" onClick={() => removeCat(c)} aria-label={`${c} 삭제`}
                  disabled={busy}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-3)'; }}
                  onFocus={(e) => { e.currentTarget.style.color = 'var(--danger)'; }}
                  onBlur={(e) => { e.currentTarget.style.color = 'var(--ink-3)'; }}
                  style={{background:'none', border:'none', color:'var(--ink-3)', cursor:'pointer', fontSize:11, padding:'0 10px 0 4px', lineHeight:1, transition:'color .15s'}}>
                  ✕
                </button>
              )}
            </span>
          );
        })}
        {allowManage && !adding && (
          <button type="button" onClick={() => setAdding(true)}
            style={{padding:'6px 14px', borderRadius:999, fontSize:12, cursor:'pointer',
              border:'1px dashed var(--primary-dim)', color:'var(--secondary)', background:'transparent'}}>
            ＋ 새 카테고리
          </button>
        )}
        {allowManage && adding && (
          <span style={{display:'inline-flex', gap:4, alignItems:'center'}}>
            <input type="text" autoFocus className="field-input"
              value={newName} onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addCat(); }
                if (e.key === 'Escape') { setAdding(false); setNewName(''); }
              }}
              placeholder="카테고리 이름"
              style={{padding:'4px 10px', fontSize:12, width:140}}/>
            <button type="button" className="btn btn-small" onClick={addCat} disabled={!newName.trim() || busy}>추가</button>
            <button type="button" className="btn btn-small" onClick={() => { setAdding(false); setNewName(''); }}>취소</button>
          </span>
        )}
      </div>
    </div>
  );
};

// v00.067: initialColumn prop + onPayloadChange callback 추가 — 모달 안에서 사용 시 임시저장 추적용.
const AdminColumnEditor = ({ initialColumn, onPayloadChange, onAfterSave } = {}) => {
  const [editingId, setEditingId] = React.useState(initialColumn?.id || null);
  const [title, setTitle] = React.useState(initialColumn?.title || "");
  const [category, setCategory] = React.useState(initialColumn?.category || "왕의 미학");
  const [excerpt, setExcerpt] = React.useState(initialColumn?.excerpt || "");
  const [html, setHtml] = React.useState(initialColumn?.body?.html || "");
  const [text, setText] = React.useState(initialColumn?.body?.text || "");
  const [publishAt, setPublishAt] = React.useState(initialColumn?.publishAt || "");
  // v00.127 — 외부 기고처 + 원문 링크 (schema-v6).
  const [sourceCredit, setSourceCredit] = React.useState(initialColumn?.sourceCredit || "");
  const [sourceUrl, setSourceUrl] = React.useState(initialColumn?.sourceUrl || "");
  // v00.136 — 대표이미지 URL + 출처. coverUrl 은 기존 c.coverUrl, coverCredit 은 신규.
  const [coverUrl, setCoverUrl] = React.useState(initialColumn?.coverUrl || "");
  const [coverCredit, setCoverCredit] = React.useState(initialColumn?.coverCredit || "");
  // v00.115 — 표시 시간(created_at) 오버라이드. publishAt(예약 발행)과 별도.
  // 'YYYY-MM-DDTHH:MM' datetime-local 포맷. 비우면 워커가 nowIso() 사용.
  const _toLocalInput = (iso) => {
    if (!iso) return "";
    try {
      const parts = window.BGNJ_FMT?.kstDateTime?.(iso);
      if (parts) return parts.replace(' KST', '').replace(' ', 'T').slice(0, 16);
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch { return ""; }
  };
  const [createdAt, setCreatedAt] = React.useState(_toLocalInput(initialColumn?.createdAt || initialColumn?.created_at || ""));
  const [editorKey, setEditorKey] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [tick, setTick] = React.useState(0);
  const [msg, setMsg] = React.useState("");
  // v00.139 — 대표 이미지 R2 업로드 상태.
  const [uploadingCover, setUploadingCover] = React.useState(false);

  // 모달 wrapper 에 dirty payload 전달 — 임시저장 prompt 용. (옵셔널)
  React.useEffect(() => {
    if (typeof onPayloadChange !== 'function') return;
    onPayloadChange({ id: editingId, title, category, excerpt, html, text, publishAt, createdAt });
  }, [editingId, title, category, excerpt, html, text, publishAt, createdAt, onPayloadChange]);

  const all = React.useMemo(() => window.BGNJ_COLUMNS.listAll(), [tick]);
  const filtered = statusFilter === 'all' ? all : all.filter((c) => (c.status || 'published') === statusFilter);
  const counts = {
    all: all.length,
    draft: all.filter((c) => c.status === 'draft').length,
    scheduled: all.filter((c) => c.status === 'scheduled').length,
    published: all.filter((c) => (c.status || 'published') === 'published').length,
  };

  const reset = () => {
    setEditingId(null);
    setTitle(""); setExcerpt(""); setHtml(""); setText("");
    setPublishAt("");
    setCreatedAt("");
    setSourceCredit("");
    setSourceUrl("");
    setCoverUrl("");
    setCoverCredit("");
    setEditorKey((k) => k + 1);
  };

  const startEdit = (col) => {
    setEditingId(col.id);
    setTitle(col.title || "");
    setCategory(col.category || "왕의 미학");
    setExcerpt(col.excerpt || "");
    setHtml(col.body?.html || "");
    setText(col.body?.text || "");
    setPublishAt(col.publishAt || "");
    setCreatedAt(_toLocalInput(col.createdAt || col.created_at || ""));
    setSourceCredit(col.sourceCredit || "");
    setSourceUrl(col.sourceUrl || "");
    setCoverUrl(col.coverUrl || "");
    setCoverCredit(col.coverCredit || "");
    setEditorKey((k) => k + 1);
    setMsg("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildPayload = (status) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const id = editingId || `c-${Date.now()}`;
    const base = {
      id,
      title: title.trim(),
      category,
      excerpt: excerpt.trim() || text.slice(0, 100),
      date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())}`,
      readTime: window.BGNJ_COLUMNS.estimateReadTime(text),
      body: { html, text },
      status,
      authorId: 'user-admin',
      author: '뱅기노자',
    };
    if (status === 'published') {
      base.publishedAt = base.publishedAt || now.toISOString();
      base.publishAt = null;
    } else if (status === 'scheduled') {
      base.publishAt = publishAt || null;
    } else if (status === 'draft') {
      base.publishAt = null;
    }
    // v00.115 — 표시 시간 오버라이드. 'YYYY-MM-DDTHH:MM' (KST 가정) → ISO with +09:00.
    if (createdAt) {
      base.createdAt = `${createdAt}:00+09:00`;
    }
    // v00.127 — 외부 기고처 + 원문 링크. 둘 다 옵셔널 (빈 문자열 허용).
    base.sourceCredit = sourceCredit.trim();
    base.sourceUrl = sourceUrl.trim();
    // v00.136 — 대표이미지 URL + 출처 (옵셔널).
    // v00.139 — coverUrl 비어있으면 본문 HTML 의 첫 <img src> 를 자동 대표 이미지로 사용.
    let resolvedCover = coverUrl.trim();
    if (!resolvedCover && html) {
      const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
      if (m && m[1]) resolvedCover = m[1];
    }
    base.coverUrl = resolvedCover;
    base.coverCredit = coverCredit.trim();
    return base;
  };

  const validate = (status) => {
    if (!title.trim()) { setMsg("제목을 입력해 주세요."); return false; }
    if (!text.trim()) { setMsg("본문을 입력해 주세요."); return false; }
    if (status === 'scheduled') {
      if (!publishAt) { setMsg("예약 발행은 발행 시각을 입력해야 합니다."); return false; }
      if (new Date(publishAt).getTime() <= Date.now()) { setMsg("예약 시각은 현재보다 미래여야 합니다."); return false; }
    }
    return true;
  };

  // v00.128 — async + await + try/catch + onAfterSave 호출. 이전엔 fire-and-forget +
  // onAfterSave 미호출로 모달 wrapper 가 모달 못 닫음. 사용자 보고 '발행 완료되면 모달이 닫혀야지'.
  const save = async (status) => {
    setMsg("");
    if (!validate(status)) return;
    const payload = buildPayload(status);
    try {
      await window.BGNJ_COLUMNS.saveColumn(payload);
      setTick((v) => v + 1);
      const label = status === 'published' ? '발행' : status === 'scheduled' ? '예약 발행' : '임시 저장';
      setMsg(`"${payload.title}" ${label} 완료.`);
      if (status === 'published') reset();
      else setEditingId(payload.id);
      // 모달 wrapper 에 결과 전달 — published / scheduled 면 wrapper 가 닫음.
      try { onAfterSave?.(status); } catch {}
    } catch (err) {
      setMsg('저장 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  const remove = async (id) => {
    if (!(await window.BGNJ_CONFIRM("이 칼럼을 삭제하시겠어요?", { danger: true }))) return;
    try {
      await window.BGNJ_COLUMNS.deleteColumn(id);
      setTick((v) => v + 1);
      if (editingId === id) reset();
    } catch (err) {
      window.BGNJ_TOAST.error('삭제 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  const unpublish = async (id) => {
    if (!(await window.BGNJ_CONFIRM("이 칼럼을 발행 취소(임시 저장으로 되돌림)하시겠어요?", { danger: true }))) return;
    const col = window.BGNJ_COLUMNS.getColumn(id);
    if (!col) return;
    window.BGNJ_COLUMNS.saveColumn({ ...col, status: 'draft', publishAt: null, publishedAt: null });
    setTick((v) => v + 1);
  };

  const statusBadge = (s) => {
    const map = {
      draft: { label: 'DRAFT', color: 'var(--ink-3)' },
      scheduled: { label: 'SCHEDULED', color: 'var(--ink-2)' },
      published: { label: 'PUBLISHED', color: 'var(--secondary)' },
    };
    const m = map[s || 'published'];
    return (
      <span className="mono" style={{fontSize:9, letterSpacing:'0.22em', color: m.color, border:`1px solid ${m.color}`, padding:'1px 6px'}}>{m.label}</span>
    );
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:24, lineHeight:1.8}}>
        <strong className="gold">뱅기노자 칼럼</strong>은 관리자만 작성할 수 있습니다.
        임시 저장으로 본문을 보관하거나 예약 발행 시각을 지정할 수 있습니다.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); save('published'); }} style={{marginBottom:40}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14, gap:12, flexWrap:'wrap'}}>
          <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em'}}>
            {editingId ? `EDIT · ${editingId}` : 'NEW COLUMN'}
          </div>
          {editingId && (
            <button type="button" className="btn btn-small" onClick={reset}>새 칼럼으로 전환</button>
          )}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 200px', gap:12, marginBottom:16}}>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="col-title">제목 <span className="gold" aria-hidden="true">*</span></label>
            <input id="col-title" className="field-input" value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="칼럼 제목"/>
          </div>
        </div>
        {/* v00.133 — 카테고리 칩 선택 + 인라인 추가/삭제. 사용자 요청 '카테고리 손쉽게 수정 + 칩형'. */}
        <div className="field">
          <label className="field-label">카테고리</label>
          <ColumnCategoryChips selected={category} onSelect={setCategory}/>
        </div>
        {/* v00.129 — 부제목 (subtitle). 사용자 요청 '제목 / 부제목 / 본문 형태로'. DB 컬럼은 호환성 위해 excerpt 그대로 사용 (UI 라벨만 변경). */}
        <div className="field">
          <label className="field-label" htmlFor="col-subtitle">부제목 (선택)</label>
          <input id="col-subtitle" type="text" className="field-input"
            value={excerpt} onChange={e => setExcerpt(e.target.value)}
            placeholder="제목 아래 작은 문구 — 목록 카드/상세 상단에 노출 (비우면 본문 앞부분 자동 추출)"/>
        </div>
        <div className="field">
          <label className="field-label">본문 <span className="gold" aria-hidden="true">*</span></label>
          <TiptapEditor key={editorKey} preset="column"
            content={html}
            onUpdate={(h, _j, t) => { setHtml(h); setText(t); }}
            placeholder="칼럼 본문을 작성하세요. 툴바의 🖼 본문 이미지 버튼으로 이미지를 삽입하고, 드래그로 이동할 수 있습니다."/>
          <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.18em', marginTop:6}}>
            추정 읽기 시간 · {window.BGNJ_COLUMNS.estimateReadTime(text)} · 본문 {text.length}자
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="col-publishAt">예약 발행 시각 (선택 — 비우면 즉시 발행)</label>
          <input id="col-publishAt" type="datetime-local" className="field-input"
            value={publishAt} onChange={(e) => setPublishAt(e.target.value)}/>
        </div>
        {/* v00.115 — 칼럼 표시 시간(created_at) 오버라이드. publishAt 과 별도. */}
        <div className="field" style={{padding:'12px 14px', background:'rgba(245,213,72,0.04)', border:'1px dashed var(--primary-dim)'}}>
          <label className="field-label" htmlFor="col-createdAt" style={{display:'block', marginBottom:6}}>
            업로드 시간 (선택 — 비우면 발행 시점의 현재 시간)
          </label>
          <input id="col-createdAt" type="datetime-local" className="field-input"
            value={createdAt} onChange={(e) => setCreatedAt(e.target.value)}
            style={{maxWidth:280}}/>
          <div className="dim-2 mono" style={{fontSize:11, marginTop:4}}>
            KST 기준. 입력 시 칼럼 표시 시각이 이 값으로 고정됨. 예약 발행과 무관 — 표시용 시간.
          </div>
        </div>
        {/* v00.127 — 외부 기고처 + 원문 링크 (옵셔널). 칼럼 본문 끝 또는 헤더에 출처 표기. */}
        <div className="field" style={{padding:'12px 14px', background:'rgba(245,213,72,0.04)', border:'1px dashed var(--primary-dim)', display:'grid', gap:10}}>
          <div>
            <label className="field-label" htmlFor="col-source-credit" style={{display:'block', marginBottom:6}}>
              기고처 (선택 — 외부 매체 출처)
            </label>
            <input id="col-source-credit" type="text" className="field-input"
              placeholder="예: 한겨레, 중앙일보, 한국일보 칼럼"
              value={sourceCredit} onChange={(e) => setSourceCredit(e.target.value)}/>
          </div>
          <div>
            <label className="field-label" htmlFor="col-source-url" style={{display:'block', marginBottom:6}}>
              원문 링크 (선택 — http/https URL)
            </label>
            <input id="col-source-url" type="url" className="field-input"
              placeholder="https://..."
              value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)}/>
            <div className="dim-2 mono" style={{fontSize:11, marginTop:4}}>
              둘 다 비어있으면 출처 표기 없이 게재. 기고처만 있으면 텍스트로, 링크까지 있으면 클릭 가능 링크로 표시.
            </div>
          </div>
        </div>
        {/* v00.136 — 대표이미지 + 출처. v00.139 — 파일 업로드 + 본문 첫 이미지 자동 폴백. */}
        <div className="field" style={{padding:'12px 14px', background:'rgba(245,213,72,0.04)', border:'1px dashed var(--primary-dim)', display:'grid', gap:10}}>
          <div>
            <label className="field-label" style={{display:'block', marginBottom:6}}>
              대표 이미지 (선택 — 비우면 본문 첫 이미지 자동 사용)
            </label>
            <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
              <button type="button" className="btn btn-small" disabled={uploadingCover}
                onClick={async () => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async () => {
                    const f = input.files?.[0];
                    if (!f) return;
                    try {
                      setUploadingCover(true);
                      const { url } = await window.BGNJ_MEDIA.uploadFile(f, { folder: 'column-covers', maxBytes: 10 * 1024 * 1024 });
                      setCoverUrl(url);
                    } catch (err) {
                      try { window.BGNJ_TOAST.error('대표 이미지 업로드 실패: ' + (err?.message || err)); } catch {}
                    } finally { setUploadingCover(false); }
                  };
                  input.click();
                }}>
                {uploadingCover ? '⏳ 업로드 중…' : '🖼 파일 업로드'}
              </button>
              {coverUrl && (
                <>
                  <img src={coverUrl} alt="cover preview" style={{width:60, height:40, objectFit:'cover', border:'1px solid var(--line)'}}/>
                  <button type="button" className="btn btn-small" onClick={() => setCoverUrl('')}>제거</button>
                </>
              )}
            </div>
            <input id="col-cover-url" type="url" className="field-input" style={{marginTop:8}}
              placeholder="또는 URL 직접 입력 — 비우면 본문 첫 이미지가 자동 대표 이미지가 됩니다"
              value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)}/>
          </div>
          <div>
            <label className="field-label" htmlFor="col-cover-credit" style={{display:'block', marginBottom:6}}>
              대표 이미지 출처 (선택)
            </label>
            <input id="col-cover-credit" type="text" className="field-input"
              placeholder="예: Unsplash / Sarah Kim, 본인 촬영"
              value={coverCredit} onChange={(e) => setCoverCredit(e.target.value)}/>
            <div className="dim-2 mono" style={{fontSize:11, marginTop:4}}>
              칼럼 페이지의 대표 이미지 우하단에 © 표기로 노출. 비우면 표기 없이 게재.
            </div>
          </div>
        </div>
        {msg && <div role="status" className="mono gold" style={{fontSize:12, padding:10, border:'1px solid var(--primary-dim)', background:'rgba(245,213,72,0.06)', marginBottom:16}}>{msg}</div>}
        <div style={{display:'flex', gap:12, justifyContent:'flex-end', paddingTop:20, borderTop:'1px solid var(--line)', flexWrap:'wrap'}}>
          <button type="button" className="btn" onClick={reset}>초기화</button>
          {/* v00.135 — 편집 중이면 라벨에 '수정' prefix. 사용자 요청 '수정 발행 형태로'. */}
          <button type="button" className="btn" onClick={() => save('draft')}>{editingId ? '수정 임시저장' : '임시 저장'}</button>
          <button type="button" className="btn" onClick={() => save('scheduled')} disabled={!publishAt}>{editingId ? '수정 예약 발행' : '예약 발행'}</button>
          <button type="submit" className="btn btn-gold">{editingId ? '수정 발행 →' : '즉시 발행 →'}</button>
        </div>
      </form>

      <div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, gap:12, flexWrap:'wrap'}}>
          <h2 className="ko-serif" style={{fontSize:20}}>관리 중인 칼럼 ({counts.all})</h2>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            {[
              { key:'all',       label:'전체' },
              { key:'published', label:'발행' },
              { key:'scheduled', label:'예약' },
              { key:'draft',     label:'임시' },
            ].map((f) => (
              <button key={f.key} type="button" className="btn btn-small"
                onClick={() => setStatusFilter(f.key)}
                style={{
                  borderColor: statusFilter === f.key ? 'var(--primary)' : 'var(--line)',
                  color: statusFilter === f.key ? 'var(--primary)' : 'var(--ink-2)',
                  background: statusFilter === f.key ? 'rgba(245,213,72,0.06)' : 'transparent',
                }}>
                {f.label} <span className="mono dim-2" style={{fontSize:10, marginLeft:4}}>{counts[f.key] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="dim">해당 상태의 칼럼이 없습니다.</p>
        ) : (
          <div className="grid grid-2">
            {filtered.map(c => (
              <article key={c.id} className="card">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:10, alignItems:'center', gap:8, flexWrap:'wrap'}}>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <span className="pill">{c.category}</span>
                    {statusBadge(c.status)}
                  </div>
                  <time className="mono dim-2" style={{fontSize:10}}>{c.date}</time>
                </div>
                <h3 className="ko-serif" style={{fontSize:17, marginBottom:8}}>{c.title}</h3>
                <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:8}}>{c.excerpt}</p>
                {c.status === 'scheduled' && c.publishAt && (
                  <div className="mono" style={{fontSize:11, color:'var(--ink-2)', marginBottom:12}}>
                    예약 시각 · {window.BGNJ_FMT.kstDateTime(c.publishAt)}
                  </div>
                )}
                <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                  <button type="button" className="btn btn-small" onClick={() => startEdit(c)}>수정</button>
                  {c.status === 'published' && (
                    <button type="button" className="btn btn-small" onClick={() => unpublish(c.id)}>발행 취소</button>
                  )}
                  <button type="button" className="btn btn-small" onClick={() => remove(c.id)}
                    style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:'auto'}}>삭제</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// === Columns Hub Panel (v00.067) ====================================
// 칼럼 목록 + 글쓰기 모달 통합. 기존 별도 '칼럼 작성' 탭 흡수.
// "글쓰기" / "편집" 버튼 → 모달 (AdminColumnEditor) + 외부클릭/ESC 시 임시저장 prompt.
const ColumnsHubPanel = ({ allColumns }) => {
  const [tick, setTick] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [initialCol, setInitialCol] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [drafts, setDrafts] = React.useState(() => window.BGNJ_DRAFTS?.list?.('column') || []);
  // v00.148 — boot prefetch 가 admin:false (published 만). admin 진입 시 admin:true 재fetch.
  React.useEffect(() => {
    (async () => {
      try { await window.BGNJ_COLUMNS?.refresh?.({ admin: true }); } catch {}
      setTick((v) => v + 1);
    })();
  }, []);
  // v00.129 — 칼럼 카테고리 동적 관리 (site_content_kv.columnCategories).
  const [scTick, setScTick] = React.useState(0);
  const sc = React.useMemo(() => (window.BGNJ_SITE_CONTENT?.get?.() || {}), [scTick]);
  const colCats = Array.isArray(sc.columnCategories) ? sc.columnCategories : [];
  const [newCatName, setNewCatName] = React.useState('');
  const [catMsg, setCatMsg] = React.useState('');
  const addColCategory = async () => {
    setCatMsg('');
    const v = newCatName.trim();
    if (!v) { setCatMsg('카테고리 이름을 입력해 주세요.'); return; }
    if (colCats.includes(v)) { setCatMsg('이미 존재하는 카테고리입니다.'); return; }
    try {
      await window.BGNJ_SITE_CONTENT.saveSection('columnCategories', [...colCats, v]);
      setNewCatName('');
      setScTick((x) => x + 1);
      setCatMsg(`'${v}' 추가됨.`);
    } catch (err) { setCatMsg('추가 실패: ' + (err?.message || '')); }
  };
  const removeColCategory = async (name) => {
    if (!(await window.BGNJ_CONFIRM(`'${name}' 카테고리를 삭제하시겠어요?\n(기존 칼럼의 카테고리 값은 유지되지만 새 칼럼 작성 시 선택지에서 사라집니다.)`, { danger: true }))) return;
    try {
      await window.BGNJ_SITE_CONTENT.saveSection('columnCategories', colCats.filter((c) => c !== name));
      setScTick((x) => x + 1);
      setCatMsg(`'${name}' 삭제됨.`);
    } catch (err) { setCatMsg('삭제 실패: ' + (err?.message || '')); }
  };

  React.useEffect(() => {
    const onChange = () => setDrafts(window.BGNJ_DRAFTS?.list?.('column') || []);
    window.addEventListener('bgnj-drafts-change', onChange);
    return () => window.removeEventListener('bgnj-drafts-change', onChange);
  }, []);

  const all = React.useMemo(() => {
    try { return window.BGNJ_COLUMNS.listAll(); } catch { return allColumns || []; }
  }, [tick, allColumns]);
  const filtered = statusFilter === 'all' ? all : all.filter((c) => (c.status || 'published') === statusFilter);
  const counts = {
    all: all.length,
    draft: all.filter((c) => c.status === 'draft').length,
    scheduled: all.filter((c) => c.status === 'scheduled').length,
    published: all.filter((c) => (c.status || 'published') === 'published').length,
  };

  const openCreate = () => { setInitialCol(null); setModalOpen(true); };
  const openCreateFromDraft = (d) => {
    setInitialCol({ id: null, title: d.title || '', category: d.category || '왕의 미학', excerpt: d.excerpt || '',
      body: { html: d.html || '', text: d.text || '' }, publishAt: d.publishAt || '' });
    setModalOpen(true);
  };
  const openEdit = (col) => {
    setInitialCol(col);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setInitialCol(null); setTick((v) => v + 1); };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap', marginBottom:18}}>
        <p className="dim" style={{fontSize:13, lineHeight:1.8, margin:0, flex:1, minWidth:280}}>
          뱅기노자 칼럼 목록입니다. <strong className="gold">＋ 글쓰기</strong> 로 새 칼럼을 모달에서 작성하세요.
          모달 외부 클릭 또는 ESC 시 임시저장 프롬프트가 표시됩니다 (최대 7일·10개 보관).
        </p>
        <button type="button" className="btn btn-gold btn-small" onClick={openCreate}>＋ 글쓰기</button>
      </div>

      {/* v00.129 — 카테고리 관리 (추가/삭제). 사용자 요청 '카테고리를 뱅기노자 칼럼 탭에서 추가삭제할수있게해줘'. */}
      <div className="card" style={{padding:14, marginBottom:18}}>
        <div className="mono gold" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>카테고리 관리</div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:10}}>
          {colCats.length === 0 && (
            <span className="dim-2" style={{fontSize:12}}>등록된 카테고리가 없습니다. 아래에서 추가하세요.</span>
          )}
          {colCats.map((c) => (
            <span key={c} style={{display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', border:'1px solid var(--line)', fontSize:12}}>
              {c}
              <button type="button" onClick={() => removeColCategory(c)} aria-label={`${c} 삭제`}
                style={{background:'none', border:'none', color:'var(--danger)', cursor:'pointer', fontSize:14, padding:0, lineHeight:1}}>
                ✕
              </button>
            </span>
          ))}
        </div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input type="text" className="field-input" placeholder="새 카테고리 이름"
            value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColCategory(); } }}
            style={{flex:1, maxWidth:280}}/>
          <button type="button" className="btn btn-small" onClick={addColCategory}>＋ 추가</button>
        </div>
        {catMsg && <div className="mono dim-2" style={{fontSize:11, marginTop:6}}>{catMsg}</div>}
      </div>

      {drafts.length > 0 && (
        <div className="card" style={{padding:14, marginBottom:18}}>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>임시저장 ({drafts.length}/{window.BGNJ_DRAFTS?.MAX_COUNT || 10})</div>
          <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6}}>
            {drafts.map((d) => (
              <li key={d.id} style={{display:'flex', alignItems:'center', gap:8, fontSize:12}}>
                <span className="mono dim-2" style={{fontSize:10, minWidth:120}}>{d.savedAt ? window.BGNJ_FMT.kstShort(d.savedAt) : ''}</span>
                <span style={{flex:1, color:'var(--ink)'}}>{d.title || '(제목 없음)'}</span>
                <button type="button" className="btn btn-small" style={{fontSize:10}} onClick={() => openCreateFromDraft(d)}>이어쓰기</button>
                <button type="button" className="btn btn-small" style={{fontSize:10, borderColor:'var(--danger)', color:'var(--danger)'}}
                  onClick={() => { window.BGNJ_DRAFTS.remove(d.id); }}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:14}}>
        {[
          { k: 'all', label: `전체 (${counts.all})` },
          { k: 'published', label: `발행 (${counts.published})` },
          { k: 'scheduled', label: `예약 (${counts.scheduled})` },
          { k: 'draft', label: `초안 (${counts.draft})` },
        ].map((f) => (
          <button key={f.k} type="button" className="btn btn-small"
            onClick={() => setStatusFilter(f.k)}
            style={{
              fontSize:11,
              borderColor: statusFilter === f.k ? 'var(--primary)' : 'var(--line-2)',
              color: statusFilter === f.k ? 'var(--primary)' : 'var(--ink)',
              background: statusFilter === f.k ? 'rgba(245,213,72,0.10)' : 'var(--bg-2)',
              fontWeight: statusFilter === f.k ? 700 : 500,
            }}>{f.label}</button>
        ))}
      </div>

      {/* v00.139 — 카드형 → 목록(테이블)형. 사용자 요청 '카드형이 아니라 목록형으로'. */}
      {filtered.length === 0 ? (
        <p style={{fontSize:13, color:'var(--ink-3)', padding:'24px 0'}}>
          {statusFilter === 'all' ? '칼럼이 없습니다. ＋ 글쓰기 로 시작하세요.' : '필터 조건에 맞는 칼럼이 없습니다.'}
        </p>
      ) : (
        <div style={{overflowX:'auto', border:'1px solid var(--line)'}}>
          <table className="admin-table" style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
            <thead>
              <tr style={{background:'var(--bg-2)', borderBottom:'1px solid var(--line)'}}>
                <th style={{textAlign:'left', padding:'10px 12px', fontWeight:600, width:90}}>카테고리</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontWeight:600}}>제목</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontWeight:600, width:110}}>상태</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontWeight:600, width:140}}>작성일</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontWeight:600, width:80}}>읽기시간</th>
                <th style={{textAlign:'right', padding:'10px 12px', fontWeight:600, width:80}}>액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{borderBottom:'1px solid var(--line)'}}>
                  <td style={{padding:'10px 12px'}}><span className="pill" style={{fontSize:11}}>{c.category}</span></td>
                  <td style={{padding:'10px 12px'}}>
                    <div className="ko-serif" style={{fontSize:14, fontWeight:600}}>{c.title}</div>
                    <div className="mono dim-2" style={{fontSize:10, marginTop:2}}>#{String(c.id).slice(-6)}</div>
                  </td>
                  <td style={{padding:'10px 12px'}}>{(() => {
                    const m = ({
                      draft: { label: 'DRAFT', color: 'var(--ink-3)' },
                      scheduled: { label: 'SCHEDULED', color: 'var(--ink-2)' },
                      published: { label: 'PUBLISHED', color: 'var(--secondary)' },
                    })[c.status || 'published'];
                    return <span className="mono" style={{fontSize:9, letterSpacing:'0.18em', color: m.color, border:`1px solid ${m.color}`, padding:'1px 6px'}}>{m.label}</span>;
                  })()}</td>
                  <td style={{padding:'10px 12px'}} className="mono dim-2">{c.date || (c.createdAt ? (window.BGNJ_FMT?.kstShort?.(c.createdAt) || '') : '')}</td>
                  <td style={{padding:'10px 12px'}} className="mono dim-2">{c.readTime || ''}</td>
                  <td style={{padding:'10px 12px', textAlign:'right'}}>
                    <button type="button" className="btn btn-small" onClick={() => openEdit(c)}>편집</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && <ColumnEditorModalContent initialColumn={initialCol} onClose={closeModal}/>}
    </div>
  );
};

const ColumnEditorModalContent = ({ initialColumn, onClose }) => {
  const [payload, setPayload] = React.useState(null);
  // dirty 판정 — 처음 렌더 후 사용자 입력이 있었는지. 단순히 title/text 가 비어있지 않으면 dirty 처리.
  const dirty = !!(payload && (payload.title?.trim() || payload.text?.trim()));
  const saveDraft = React.useCallback(() => {
    if (!payload) return;
    try {
      window.BGNJ_DRAFTS.save({
        kind: 'column',
        title: payload.title || '',
        category: payload.category || '',
        excerpt: payload.excerpt || '',
        html: payload.html || '',
        text: payload.text || '',
        publishAt: payload.publishAt || '',
      });
    } catch {}
  }, [payload]);
  const { onBackdropClick } = window.useModalGuard({
    open: true, dirty, onClose, onSaveDraft: saveDraft, label: '칼럼',
  });

  return (
    <div role="dialog" aria-modal="true" aria-label="칼럼 작성"
      onClick={onBackdropClick}
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'grid', placeItems:'start center', padding:24, overflowY:'auto'}}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width:'min(1100px, 100%)', background:'var(--bg)', boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
        padding:24, marginTop:24, marginBottom:48,
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14}}>
          <h2 className="ko-serif" style={{fontSize:18, margin:0}}>{initialColumn?.id ? '칼럼 편집' : '새 칼럼 작성'}</h2>
          <button type="button" className="btn btn-small" onClick={async () => { /* 명시적 닫기 — useModalGuard 와 동일 prompt 패턴 (v00.262.007) */
            if (!dirty) { onClose?.(); return; }
            const ok = await window.BGNJ_CONFIRM('작성 중인 칼럼이 저장되지 않았습니다. 임시저장 하시겠어요?', {
              confirmLabel: '임시저장', cancelLabel: '취소', danger: false, dismissOnBackdrop: false,
            });
            if (!ok) return; // 취소 → 모달 유지 (이전엔 '그냥 닫기' 였음)
            saveDraft();
            onClose?.();
          }}>닫기</button>
        </div>
        <AdminColumnEditor initialColumn={initialColumn || undefined}
          onPayloadChange={setPayload}
          onAfterSave={(status) => {
            // v00.128 — 발행/예약 발행 완료 시 모달 자동 닫음. 임시 저장은 계속 작업할 수 있도록 유지.
            if (status === 'published' || status === 'scheduled') onClose?.();
          }}/>
      </div>
    </div>
  );
};

const AdminDenied = ({ go, user }) => (
  <div className="section" style={{minHeight:'calc(100vh - 72px)', display:'grid', placeItems:'center'}}>
    <div className="card" style={{maxWidth:480, textAlign:'center', padding:48}}>
      <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:12}}>◆ ACCESS DENIED</div>
      <h1 className="ko-serif" style={{fontSize:24, marginBottom:16}}>관리자 권한이 필요합니다</h1>
      <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:24}}>
        {user
          ? <>현재 로그인 계정(<span className="gold">{user.email}</span>)은 관리자 권한이 없습니다.</>
          : "이 페이지는 로그인한 관리자만 접근할 수 있습니다."}
      </p>
      <div style={{display:'flex', gap:10, justifyContent:'center'}}>
        <button type="button" className="btn btn-gold btn-small" onClick={() => go(user ? "home" : "login")}>
          {user ? "홈으로" : "로그인"}
        </button>
      </div>
    </div>
  </div>
);

Object.assign(window, { LoginPage, AdminPage, AdminCategoryPanel, AdminGradePanel, AdminColumnEditor, AdminDenied, LectureAdminPanel, BankAccountPanel, BookOrderAdminPanel, TourAdminPanel, MemberAdminPanel, LegalAdminPanel, FaqAdminPanel, AuditLogPanel, ErrorLogPanel, SEOAdminPanel, SearchConsoleAdminPanel, SiteContentAdminPanel, RecommendationsAdminPanel });

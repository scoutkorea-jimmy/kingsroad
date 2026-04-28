// 로그인, 회원가입, 관리자 페이지
// === 약관/개인정보 모달 ==================================================
// 회원가입 시 이용약관 텍스트를 클릭하면 모달로 본문을 노출.
const LegalModal = ({ slug, onClose }) => {
  const doc = (window.BGNJ_LEGAL?.get(slug)) || { title: slug === 'terms' ? '이용약관' : '개인정보 처리방침', body: '<p>(준비 중)</p>' };
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
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
          dangerouslySetInnerHTML={{__html: doc.body || '<p>(준비 중)</p>'}}/>
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

const LoginPage = ({ go, setUser }) => {
  const [mode, setMode] = React.useState("login"); // login | signup
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
      {/* Left: art (관리자에서 이미지/문구 편집 가능) */}
      <div style={{
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
                  color: mode === t.k ? 'var(--gold)' : 'var(--ink-3)',
                  borderBottom: mode === t.k ? '2px solid var(--gold)' : '2px solid transparent',
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
                placeholder="hello@bgnj.net"/>
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
                  <summary style={{cursor:'pointer', fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.2em', color:'var(--gold)'}}>
                    추가 정보 입력 (선택 · 입력하지 않아도 사이트 이용에 문제 없음)
                  </summary>
                  <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.7, padding:'10px 12px', background:'rgba(212,175,55,0.06)', border:'1px solid var(--gold-dim)'}}>
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
                    style={{accentColor:'var(--gold)', marginTop:3}}/>
                  <span>
                    <button type="button" className="btn-ghost" onClick={() => setLegalModal('terms')}
                      style={{padding:0, color:'var(--gold)', textDecoration:'underline', fontSize:12}}>
                      이용약관
                    </button>
                    {' '}및{' '}
                    <button type="button" className="btn-ghost" onClick={() => setLegalModal('privacy')}
                      style={{padding:0, color:'var(--gold)', textDecoration:'underline', fontSize:12}}>
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
                  <input id="keep-login" type="checkbox" style={{accentColor:'var(--gold)'}}/>로그인 유지
                </label>
              <button type="button" className="btn-ghost" style={{color:'var(--gold)'}}>비밀번호 찾기</button>
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

const ADMIN_VERSION_HISTORY = [
  {
    version: "00.033.000",
    date: "2026-04-28",
    summary: "관리자 페이지 GUI 가독성 보강 + BGNJ_COLUMNS 서버 전환. 회원 상세 프로필이 한글 라벨 카드로(JSON 덤프 제거 확정), 감사 로그 details 가 key/value 칩으로, 정지 사유 입력이 모달 다이얼로그로 교체. 새 책 추가도 prompt() 대신 인라인 폼. 사용자 칼럼이 D1 user_columns 테이블 source-of-truth 로.",
    details: [
      "ProfileFields — JSON.stringify(profile) 노출을 한글 라벨(생년월일/전화번호/우편번호/주소/상세주소/성별/관심분야/추천인) + 빈 값 dash 카드로 완전 교체. (v00.030 코드 확정)",
      "AuditDetailsCell — 감사 로그 details 의 raw JSON 을 key/value 칩 리스트로 렌더. action·target·by 는 그대로 mono 표시.",
      "SuspendDialog — '회원 정지' 액션의 prompt() 를 모달 다이얼로그로 교체. 사유 textarea + ESC/취소/적용 버튼.",
      "BooksAdminPanel — '새 책 추가' prompt() 를 인라인 폼으로 교체. 좌측 책 목록 상단에 입력창이 펼쳐지고 추가/취소 버튼.",
      "활성 동의 배지 한글화는 v00.030 에서 적용 완료.",
      "BGNJ_COLUMNS — D1 user_columns 테이블 신설 + Worker GET/POST/PATCH/DELETE 엔드포인트. 헬퍼가 BGNJ_API.columns 호출로 전환. localStorage(userColumns) 쓰기 제거. 좋아요/조회수는 다음 사이클에 별도 endpoint 추가 예정 (현재 no-op).",
      "App init useEffect 에 BGNJ_COLUMNS.refresh 자동 호출 추가.",
      "Worker 배포: Version 955d2989-bfc1-4339-b9e3-9cef15c18718.",
    ],
    context: "사용자 요청 '관리자페이지 가시성 + 텍스트로 구현된 기능은 없게'. 화면에 그대로 노출되던 JSON 덤프와 prompt() 호출을 모두 컴포넌트화 — 관리자 페이지의 모든 입력은 폼/모달로, 모든 데이터는 라벨/칩으로 표현됩니다. 캐시된 옛 페이지에서 JSON 이 보였던 것은 코드 변경 후 강제 새로고침이 필요했기 때문이고, ?v=00.033.000 cache-buster 가 다음 진입에서 자동 갱신.",
  },
  {
    version: "00.032.000",
    date: "2026-04-28",
    summary: "🌐 트랜잭션 헬퍼 일괄 서버 전환. BGNJ_BOOK_ORDERS / LECTURES / TOURS / BOOKS 가 모두 D1 source-of-truth 로 전환되었습니다. localStorage 영속화 호출(BGNJ_SAVE.*) 모두 제거. App 진입 시 + 로그인 시 본인 활동 데이터까지 자동 동기화.",
    details: [
      "BGNJ_BOOK_ORDERS — createOrder/confirmPayment/markShipped/markDelivered/cancelOrder/requestRefund/approveRefund/rejectRefund 가 모두 BGNJ_API.bookOrders 호출. refreshMine/refreshAll 로 캐시 동기화. 영수증/CSV 는 클라이언트에서 데이터로 포맷.",
      "BGNJ_LECTURES — listAll/getLecture/saveLecture/setHidden/deleteLecture/register/cancel/payment/refund/reviews 모두 서버 호출. refresh + refreshMine 으로 본인 신청 목록 동기화. _saveRegistrations 같은 BGNJ_STORES 쓰기 제거.",
      "BGNJ_TOURS — 동일 패턴. listAll/getTour/saveTour/setHidden/deleteTour/reserve/cancel/payment/refund/reviews 모두 서버. refreshMine 으로 본인 예약 동기화.",
      "BGNJ_BOOKS — list/get/create/update/remove/reorder 모두 BGNJ_API.books. _persist(localStorage) 쓰기 제거. 책별 리뷰는 BGNJ_BOOK_ORDERS 측 server reviews 로 위임.",
      "BGNJ_GRADE_PROMO — BGNJ_STORES.users 대신 BGNJ_AUTH._usersCache 참조. setGrade 가 async 라 fire-and-forget 으로 호출.",
      "App init useEffect — Promise.allSettled 로 SITE_CONTENT/FAQ/LEGAL/LECTURES/TOURS/BOOKS/bankAccount 일괄 refresh. 로그인 사용자는 추가로 mine/bookmarks/notifications 동기화.",
      "Worker, D1 schema, ALTER 컬럼은 v00.029-30 에서 이미 적용됨.",
    ],
    context: "사용자가 '모두 진행' 으로 강력하게 요구한 마이그레이션. 트랜잭션 헬퍼 4종(BOOK_ORDERS/LECTURES/TOURS/BOOKS) 을 한 번에 서버 source-of-truth 로 전환했습니다. 메소드 시그니처는 호환 유지하되 변경 메소드는 모두 async 로 전환. 페이지 컴포넌트가 sync 호출하는 경우 동작은 fire-and-forget 으로 흐르고, await 으로 명시 호출하는 경우 정상 흐름. 다음 작업: 페이지 컴포넌트(LecturesPage/WangsanamTourPage/BookCheckoutPage/MyPage/관리자 패널) 의 await + try/catch 정리, 그리고 BGNJ_COLUMNS 의 D1 테이블 생성과 서버 전환.",
  },
  {
    version: "00.031.000",
    date: "2026-04-28",
    summary: "COMMUNITY 좋아요/북마크/신고/알림 서버 전환. 사용자가 명시한 '로컬 업데이트는 존재하지 않는다' 정책에 맞춰 낙관적 로컬 쓰기를 모두 제거하고 순수 서버 호출로 변경했습니다. 다음 커밋에서 LECTURES/TOURS/BOOK_ORDERS/BOOKS metadata 까지 서버 전환을 완료할 예정.",
    details: [
      "BGNJ_COMMUNITY.toggleLike — POST /api/posts/:id/likes 토글 후 GET 으로 사용자 목록 재조회. 메모리 캐시(_serverPosts) 만 갱신, localStorage 미사용.",
      "BGNJ_COMMUNITY.toggleBookmark — POST /api/posts/:id/bookmark 호출 후 refreshBookmarks 로 서버 목록 재조회. 낙관적 업데이트 제거.",
      "BGNJ_COMMUNITY 신고/알림 — addReport 가 POST /api/reports 직호출. addNotification 은 no-op 으로 변환(서버 부수효과로 자동 발급). listReports/listNotifications 는 서버 sync 캐시 read.",
      "BGNJ_COMMUNITY._bookmarks/_notifications/_reports 메모리 캐시 + refreshBookmarks/refreshNotifications/refreshReports 메소드.",
      "CommunityPage handleLike/handleBookmark/handleReportSubmit 가 await + try/catch 로 호출, 실패 시 사용자에게 알림.",
    ],
    context: "이전 v00.030 에서 COMMUNITY 변경에 '낙관적 로컬 업데이트' 패턴을 도입했으나 사용자가 '로컬 업데이트는 존재하지 않는다' 고 명확히 재확인. 정책에 맞춰 순수 서버 호출로 전환했습니다. 다음 커밋: BGNJ_LECTURES/TOURS/BOOK_ORDERS 등 트랜잭션 헬퍼들이 여전히 BGNJ_STORES 에 영속하고 있으며, 이들도 서버로 마이그레이션 필요. 각 헬퍼 30여 메소드 + 페이지 동기→비동기 전환이 동반되는 광범위 작업.",
  },
  {
    version: "00.030.000",
    date: "2026-04-28",
    summary: "관리자 회원 운영 서버 전환 + 회원 상세 가시성 개선. 등급 변경/관리자 토글/정지/해제/삭제가 D1 에 영속되며, 정지된 사용자는 로그인 거부 + 기존 세션 즉시 무효화. 회원 상세의 프로필 JSON 덤프를 라벨링된 카드로 교체.",
    details: [
      "BGNJ_AUTH 의 setGrade/toggleAdmin/suspendUser/unsuspendUser/removeUser 가 모두 PATCH /api/admin/users/:id 또는 DELETE 호출로 전환. D1 에 영속.",
      "BGNJ_AUTH._usersCache + refreshUsers() 신설. listUsers() 가 캐시 우선, 비어있으면 레거시 폴백.",
      "MemberAdminPanel — mount 시 refreshUsers() 자동 호출, 변경 액션이 await 로 동작 후 자동 새로고침. 'bgnj-users-refresh' 이벤트로 다른 패널과도 동기화.",
      "Worker handleAdminUserPatch 가 suspended/suspendedReason/name 필드 추가 처리 + 정지 시 해당 사용자 모든 세션 즉시 DELETE.",
      "Worker handleAuthLogin 이 suspended=1 사용자 로그인 거부(HTTP 403 + 사유 메시지 동봉).",
      "users 테이블 ALTER — suspended/suspended_reason/suspended_at 컬럼 추가.",
      "ProfileFields 컴포넌트 신설 — 회원 상세의 프로필을 한글 라벨(생년월일/전화번호/우편번호/주소/상세주소/성별/관심분야/추천인) + 빈 값 dash 표시로 가독성 있는 카드로 노출. 기존 JSON.stringify 덤프 제거.",
      "활성 동의 배지가 한글 라벨로 표시(이용약관·개인정보 처리방침 / 마케팅 메일 / 제3자 제공).",
      "Worker 배포: Version a3ff1281-92c8-4742-84e4-3279499e084c.",
    ],
    context: "사용자 요청 '관리자페이지 가시성 확보' + '나머지 페이지 다음 커밋' 의 첫 분량. 회원 운영(가장 자주 쓰는 관리 액션) 을 우선 서버 source-of-truth 로 전환했고, 회원 상세 화면에서 가입 시점에 받은 프로필 정보를 한눈에 읽을 수 있도록 가독성을 정리했습니다. 다음 커밋: BGNJ_LECTURES / TOURS / BOOK_ORDERS / COMMUNITY / BOOKS metadata 의 서버 전환과 해당 페이지 컴포넌트의 동기→비동기 호출 패턴 적용.",
  },
  {
    version: "00.029.000",
    date: "2026-04-28",
    summary: "🌐 서버 source-of-truth 1차 — Worker 에 빠진 모든 운영 엔드포인트 추가 + D1 스키마 보강 + 가입 시 프로필 저장 + 작은 헬퍼들(LEGAL/FAQ/AUDIT/SITE_CONTENT) 서버 연결. 큰 트랜잭션 헬퍼(BOOK_ORDERS/LECTURES/TOURS/COMMUNITY) 는 다음 사이클에서 일괄 전환.",
    details: [
      "가입 시 프로필 저장 — 회원가입 폼의 birthdate/phone/zip/addr/gender/interest/recommender 가 Worker → users.profile_json 으로 영속.",
      "Worker 신규 핸들러 — PATCH /api/me, DELETE /api/posts/:id/comments/:cid, GET /api/me/lectures + /me/tours + /me/orders, POST /api/lectures/:id/reviews, POST /api/tours/:id/reserve + /reviews, POST /api/book-orders + GET /api/admin/book-orders + PATCH /api/book-orders/:id, GET/POST /api/books/:id/reviews, GET/PATCH /api/site-content + section, FAQ CRUD, GET/PUT /api/legal/:slug, GET/PUT /api/bank-account, Categories CRUD, Grades upsert, POST /api/admin/audit. 약 30+ 신규 엔드포인트.",
      "D1 schema-v3.sql 추가 — legal_docs, faqs, bank_account(단일행 시드), site_content_kv, grades_kv, categories_kv. ALTER 로 book_orders 에 order_no/recipient/phone/address_detail/zip/memo/price/tracking/cancelled_at/refund_status 컬럼 보강.",
      "api.js — siteContent / faqs / legal / bankAccount / categories / grades / bookOrders / books.reviews / lectures.reviews + mineRegistrations + cancel/patch / tours.reserve + reviews + mineReservations / posts.comments.remove / admin.audit.create 네임스페이스 신설.",
      "BGNJ_LEGAL — 서버(D1.legal_docs) source of truth 로 전환. _cache 에 메모리 캐시. refresh() 비동기 호출.",
      "BGNJ_FAQ — 서버(D1.faqs) source of truth. add/update/remove/reorder 모두 BGNJ_API.faqs 호출.",
      "BGNJ_AUDIT — log() 는 fire-and-forget 으로 서버 전송 + 즉시 메모리 캐시 갱신. refresh() 가 D1.audit_log 에서 최근 로그 fetch.",
      "BGNJ_SITE_CONTENT — saveSection/resetSection 모두 서버 PATCH. 페이지 진입 시 refresh() 한 번 자동 호출.",
      "App 진입 시 일괄 동기화 — BGNJ_SITE_CONTENT/FAQ/LEGAL refresh 가 useEffect 에서 자동 발화.",
      "Worker 배포: Version 2b830622-c6f0-471d-a36f-93bbbee5866e. CORS/auth 환경변수 동일 유지.",
    ],
    context: "사용자 요청 '로컬에서 처리되는건 없어야 한다'에 대응한 1차 마이그레이션. Worker 측은 모든 누락 엔드포인트를 한 번에 추가했고 D1 스키마도 운영 모든 엔티티(약관/FAQ/계좌/사이트콘텐츠/등급/카테고리)에 대응하는 테이블을 갖췄습니다. 클라이언트는 작고 결합도 낮은 헬퍼(LEGAL/FAQ/AUDIT/SITE_CONTENT) 부터 서버 source-of-truth 패턴으로 전환했고, 큰 트랜잭션 헬퍼(BOOK_ORDERS/LECTURES/TOURS) 는 다음 커밋에서 일괄 전환합니다. 다음 작업은 BGNJ_LECTURES/TOURS/BOOK_ORDERS/COMMUNITY/AUTH grade-suspend/BOOKS metadata 의 서버 연결 + 페이지 컴포넌트의 동기→비동기 호출 전환.",
  },
  {
    version: "00.028.000",
    date: "2026-04-28",
    summary: "🚨 가입 블로커 수정 + 좀비 세션 차단 + 푸터 정비. data.js 의 BGNJ_AUTH 에 동일 이름의 signUp 메소드가 두 번 정의되어 있었고 뒤쪽의 레거시 로컬 전용 signUp 이 위쪽의 Cloudflare 호출용 signUp 을 덮어쓰고 있었습니다. 즉 모든 회원가입이 localStorage 에만 저장되고 D1 에 도달하지 못했습니다. 이를 제거해 가입이 실제로 서버에 저장되도록 정상화했습니다.",
    details: [
      "🔥 data.js BGNJ_AUTH — 중복 정의된 레거시 로컬 signUp(payload) 제거. 위쪽의 async signUp(=BGNJ_API.signup 호출) 만 남겨 가입이 D1 에 정상 저장되도록 함. 그동안 가입은 화면상 '성공' 으로 보였지만 새로고침/세션 검증 시점에 사라지던 원인이었음.",
      "BGNJ_AUTH.refreshSession — /api/auth/me 가 401 일 때 localStorage 캐시도 즉시 비움. 좀비 세션(서버에는 없는데 클라이언트에선 로그인된 것처럼 보이는 상태) 차단.",
      "푸터 — '개인정보 처리 · 관리자' 버튼 제거(관리자 진입은 상단 내비의 '관리' 버튼으로만). 본문 가운데의 큰 'CURRENT DEPLOY VERSION' 카드 제거. 하단 줄 버전 표기는 더 작고 차분하게.",
      "푸터 연락 정보 동적화 — 이메일/전화/전화 링크/주소를 사이트 콘텐츠의 `contact` 섹션에서 읽도록 변경. 빈 값이면 해당 줄 미노출.",
      "관리자 사이트 콘텐츠 패널 — '푸터 — 연락 정보' 카드 신설(이메일/전화/전화 링크/주소). 푸터 카드는 '소개·서명' / '연락 정보' 로 분리.",
    ],
    context: "사용자 보고('회원가입이 일회성/로컬에서만 적용된다') 가 결정적인 단서였습니다. D1 직접 조회로 scoutkorea@kakao.com 행이 0개임을 확인했고, BGNJ_AUTH 객체에 동일 이름 메소드 두 개가 정의되어 있어 객체 리터럴 덮어쓰기 규칙으로 레거시 로컬 메소드가 활성화된 상태임을 식별했습니다. 이 한 줄 충돌이 전체 인증 파이프라인을 무력화하고 있었습니다. 같이 묶은 좀비 세션 차단은 같은 문제로 캐시에 잘못 들어간 데이터가 다음 진입에서도 계속 사용자처럼 보이는 부작용을 끊는 안전망입니다. 푸터 정비는 사용자 별도 요청.",
  },
  {
    version: "00.027.004",
    date: "2026-04-28",
    summary: "HTTP 환경 정상화 — SSL 미도입 기간에도 사이트가 정상 동작하도록 Worker CORS 에 HTTP origin 을 추가하고 세션 쿠키의 SameSite 를 None 으로 변경했습니다. v00.027.003 의 HTTPS 강제 리다이렉트는 제거. 다음 단계로 GitHub Pages 의 무료 HTTPS 활성화 안내.",
    details: [
      "index.html — v00.027.003 에서 추가한 HTTP→HTTPS 자동 리다이렉트 제거 (SSL 도입 후 재활성화 예정).",
      "Worker — `ALLOWED_ORIGINS` 에 `http://bgnj.net`, `http://www.bgnj.net`, `http://scoutkorea-jimmy.github.io` 추가. HTTPS 도입 후 제거 권장.",
      "Worker — 세션 쿠키 플래그 `SameSite=Lax` → `SameSite=None`. 사이트(bgnj.net) 와 API(workers.dev) 가 서로 다른 도메인이라 cross-site 인 fetch credentials:include 호출에 쿠키가 동봉되려면 SameSite=None 이 필수. Secure 는 workers.dev 가 항상 HTTPS 라 충족.",
      "검증 — `curl -I -X OPTIONS ... -H 'Origin: http://bgnj.net'` 가 `access-control-allow-origin: http://bgnj.net` 으로 응답하는 것 확인.",
    ],
    context: "사용자가 HTTPS 가 유료라고 인식해 HTTP 환경을 유지하고 싶어 하셨습니다. 실제로는 GitHub Pages 가 자동으로 무료 Let's Encrypt 인증서를 발급해 주므로 (저장소 Settings → Pages → 'Enforce HTTPS' 토글) 추가 비용 없이 HTTPS 전환이 가능합니다. 다만 즉시 적용을 위해 우선 HTTP 환경에서도 로그인이 정상 동작하도록 백엔드 정책을 임시 완화했습니다. 이 완화는 SameSite=None 으로 인한 보안 노출(약간 더 넓은 cross-site 쿠키 동봉) 이 있으므로 SSL 도입 후 SameSite=Lax 로 되돌리는 게 좋습니다.",
  },
  {
    version: "00.027.003",
    date: "2026-04-28",
    summary: "HTTPS 강제 리다이렉트. 사용자가 `http://bgnj.net` (HTTP) 로 접속하면 Cloudflare Worker API 가 CORS 거부해 로그인이 'Failed to fetch' 로 실패하던 문제를 차단했습니다. 페이지 진입 즉시 https:// 로 자동 전환되도록 index.html 최상단에 가드를 추가했습니다.",
    details: [
      "index.html — `<head>` 진입 즉시 `location.protocol === 'http:'` 면 `https:` 로 `location.replace`. localhost / 127.0.0.1 은 예외(개발 환경 평문 허용).",
      "원인 — Worker 의 ALLOWED_ORIGINS 는 `https://bgnj.net` 만 허용. 사용자가 주소창에 `bgnj.net` 만 치면 일부 브라우저/북마크가 `http://` 로 진입하고, 그 결과 모든 API 호출이 CORS preflight 단계에서 차단되어 'Access to fetch ... blocked by CORS policy' / 'Failed to fetch' 로 보임.",
      "보완 안내 — Cloudflare DNS/SSL 패널의 'Always Use HTTPS' 설정도 켜두면 서버 측에서도 301 리다이렉트가 추가로 적용됨(클라이언트 가드와 이중 안전장치).",
    ],
    context: "v00.027.001 의 새 에러 패널이 'NETWORK_OR_CORS' 코드를 정확히 보여줬고, 사용자가 콘솔 스크린샷을 공유해 주신 덕에 origin 이 `http://bgnj.net` 인 것을 즉시 식별할 수 있었습니다. CORS 거부의 진짜 원인은 네트워크 단절이나 Worker 미배포가 아니라 프로토콜 불일치였습니다. 같은 패턴이 반복되지 않도록 클라이언트 측에서 즉시 HTTPS 로 점프하도록 강제했습니다.",
  },
  {
    version: "00.027.002",
    date: "2026-04-28",
    summary: "캐시 무력화 + 진단 도구. 새 코드를 배포해도 사용자의 브라우저가 이전 JS 를 캐시한 상태로 보고 있어 'Failed to fetch' 같은 옛 메시지가 계속 노출되던 문제를 영구 차단했습니다. 모든 정적 자산에 버전 쿼리를 붙여 신규 배포 시 자동 갱신되도록 정리하고, 콘솔에 현재 버전 배지와 진단 헬퍼를 추가했습니다.",
    details: [
      "index.html — 모든 `<script>` / `<link>` 에 `?v=00.027.002` cache-buster 부착. 다음 배포부터는 BGNJ_VERSION 갱신과 함께 동기 갱신.",
      "index.html — `<head>` 에 `Cache-Control: no-cache, no-store, must-revalidate` / `Pragma: no-cache` / `Expires: 0` meta 추가. HTML 자체가 옛 캐시로 머물면 새 버전 쿼리도 못 보기 때문에 HTML 은 캐시하지 않음.",
      "data.js — 페이지 로드 시점에 콘솔에 `[BGNJ] v00.027.002 · build 2026.04.28` 배지 출력. 사용자가 개발자 도구 콘솔에서 어떤 버전을 보고 있는지 즉시 확인 가능.",
      "data.js — `BGNJ_DIAG.run()` 헬퍼 신설. 콘솔에서 한 줄 실행으로 origin / 헬스체크 / 세션 상태를 한 번에 진단. 'Failed to fetch' 가 발생하는 환경에서 어디 단계가 막혔는지 즉시 파악 가능.",
    ],
    context: "v00.027.001 에서 오류 가시화를 마쳤지만, 사용자 브라우저가 옛 alert 코드를 캐시한 상태라면 새 인라인 패널이 영영 보이지 않는다는 사용자 보고가 들어왔습니다. 정적 사이트 + Cloudflare CDN 환경에서 흔한 문제이며, 배포할 때마다 사용자에게 강제 새로고침을 요구할 수는 없으므로 자산에 버전 쿼리를 붙여 브라우저가 새 파일을 받아오도록 만들었습니다. HTML 자체도 캐시 무효화 헤더를 붙여 새 버전 쿼리를 항상 볼 수 있게 보장합니다. 진단 헬퍼는 다음에 또 비슷한 보고가 들어왔을 때 운영자가 사용자에게 '콘솔에 BGNJ_DIAG.run() 입력해 주세요' 한 줄로 끝낼 수 있게 한 안전장치입니다.",
  },
  {
    version: "00.027.001",
    date: "2026-04-28",
    summary: "오류 가시화 묶음. 로그인/회원가입 실패는 alert 대신 코드·상태·정확한 사유·사용자 가이드를 함께 보여주는 인라인 에러 패널로 노출하고, 사이트 전반의 미처리 비동기 오류와 렌더링 오류도 코드와 함께 화면에 표시되도록 통합했습니다. 오류가 발생했을 때 '왜' 가 분명해지는 흐름을 만들었습니다.",
    details: [
      "BGNJ_API.request — 네트워크/CORS/HTTP/응답 해석 실패를 분류해 `err.kind / err.code / err.status / err.body / err.url` 로 throw. 'Failed to fetch' 류는 `NETWORK_OR_CORS` 코드로 호출 측에 전달.",
      "BGNJ_AUTH.signIn / signUp — 실패 시 `{ ok:false, code, status, kind, message, hint, url }` 구조 반환. 401/403/409/400/5xx 와 네트워크 단절을 구분해 사용자 가이드(`hint`) 를 자동 부여.",
      "AuthErrorPanel — 로그인/회원가입 폼 안에 인라인으로 에러 코드, 상태, 사유, 가이드, 요청 URL, 개발자 도구 안내까지 한 카드로 노출. 입력값을 수정하거나 모드를 바꾸면 자동으로 사라짐.",
      "클라이언트 사전 검증도 alert → 인라인 에러로 통일 (FORM_EMAIL_REQUIRED, FORM_PASSWORD_TOO_SHORT 등 의미 있는 코드 부여).",
      "AppErrorBoundary 강화 — 렌더링 오류 발생 시 코드/사유/스택/컴포넌트 스택을 분리해 펼쳐볼 수 있는 카드로 노출. '다시 시도' 와 '페이지 새로고침' 두 액션 제공.",
      "GlobalErrorToast 신설 — `unhandledrejection` 과 `window.error` 이벤트를 잡아 우하단 토스트로 코드+사유+가이드+요청 URL 표시. 인증 외 비동기 호출(게시글 동기화, 강연 등록 등)에서 발생한 오류도 화면에 도달.",
      "모든 분류된 에러는 console.error 로 동시에 기록 — 개발자 도구 콘솔/네트워크 탭에서 빠르게 추적 가능.",
    ],
    context: "이전에는 로그인이 실패해도 'Failed to fetch' 같은 모호한 alert 만 한 줄 떠서 운영자도 사용자도 원인을 알기 어려웠습니다. 이번 작업으로 오류는 (1) 어떤 코드인지, (2) 어떤 상태인지, (3) 정확한 사유가 무엇인지, (4) 사용자가 무엇을 해야 하는지가 한 화면 안에 보이게 됩니다. 인증 흐름은 폼 안 인라인 패널로, 그 외 비동기 오류는 우하단 토스트로, 렌더링 오류는 풀스크린 카드로 분리해 — 화면 어디에서 무슨 일이 났는지가 즉시 파악되는 구조입니다.",
  },
  {
    version: "00.027.000",
    date: "2026-04-28",
    summary: "회원가입/로그인 페이지 정비 + 댓글 다단계 트리 + @멘션 자동완성 + 새 글 임시저장 + 슈퍼관리자 자동 승격 + 등급 자동 강등 + Worker CORS 확장. 회원가입 시 불필요한 동의 항목을 걷어내고 약관 클릭으로 모달 노출, 좌측 영역을 관리자에서 이미지/문구 직접 편집 가능하도록 전환했습니다.",
    details: [
      "댓글 답글 트리 — 1단계 → 최대 3단계 재귀 렌더. 답글 버튼이 모든 깊이에서 노출되며 부모 작성자에게 `@닉` 프리필이 자동 삽입됩니다. 텍스트 안의 `@닉네임` 토큰은 골드 chip 으로 강조 렌더.",
      "@멘션 자동완성 textarea — 본댓글/답글 모두 적용. `@` 입력 시 같은 글의 작성자 후보 리스트가 뜨고 ↑/↓/Enter/Esc 또는 마우스 클릭으로 삽입.",
      "새 글 임시저장 — 사용자별 키(`bgnj_post_draft_{userId}`)로 localStorage 에 800ms 디바운스 저장. 다음 진입 시 자동 복원 + '새로 시작' 버튼, 발행 성공 시 자동 정리. 수정 모드에서는 동작하지 않음.",
      "회원가입 페이지 정비 — 네이버/카카오 소셜 로그인 버튼 + OR 구분선 + AUTH STATUS·CLOUDFLARE 안내 박스 + '뱅기노자 칼럼·답사 일정 메일 수신' / '파트너 기관 행사 안내 제3자 제공' 동의 항목 모두 제거. 동의는 이용약관/개인정보 처리방침만 필수.",
      "이용약관/개인정보 처리방침 모달 — 회원가입 동의 줄에서 텍스트 클릭 시 `BGNJ_LEGAL` 본문이 모달로 표시. Esc / 바깥 클릭 / 닫기 버튼으로 종료.",
      "관심분야 '기타' 자유 입력 — 셀렉트에서 '기타 (직접 입력)' 선택 시 60자 텍스트 input 노출. 저장 시 자유 입력값이 그대로 profile.interest 에 저장.",
      "추가 정보 안내 강조 — '입력하지 않아도 모든 사이트 기능을 동일하게 이용할 수 있다'는 문구를 골드 박스로 명시.",
      "로그인/회원가입 좌측 영역 관리자 편집 — `DEFAULT_SITE_CONTENT.auth` 섹션 신설(eyebrow/title/description/imageDataUri). 사이트 콘텐츠 패널의 '로그인/회원가입 좌측 영역' 카드에서 즉시 편집 가능하며, 이미지 업로드 시 그라데이션 대신 배경 이미지 사용.",
      "왕사들/王사들 잔재 일괄 제거 — 좌측 영역 헤더 '王사들' 제거, 관리자 버전 기록 changelog 의 잔여 표기를 익명화/일반화.",
      "슈퍼 관리자 자동 승격 (Worker) — `SUPER_ADMIN_EMAILS` 환경변수에 등록된 이메일은 가입/로그인/세션 조회 시점마다 `is_admin=1, grade_id='admin'` 강제. 부트스트랩 admin 유무와 무관하게 즉시 승격. `scoutkorea@kakao.com` 등록.",
      "Worker CORS 확장 — `localhost`/`127.0.0.1` 의 임의 포트(VS Code Live Server, Vite, Python http.server 등)를 정규식으로 자동 허용. 'Failed to fetch' 의 가장 흔한 원인(허용 origin 누락) 해결.",
      "등급 자동 강등 — `BGNJ_GRADE_PROMO.maybeDemote / reevaluateAll` 추가. 글·댓글 삭제 시점에 작성자 자격 등급 재평가하여 현재 등급보다 자격 등급이 낮으면 자동 강등 + 알림 + 감사 로그.",
    ],
    context: "두 갈래 작업이었습니다. 한쪽은 회원가입 페이지를 실제로 운영 가능한 형태로 다듬는 작업입니다. 미사용 소셜 로그인 버튼을 걷어내고, 약관 본문을 모달로 노출하고, 관심분야에 '기타'를 추가하고, 좌측 영역을 운영자가 손쉽게 갈아끼울 수 있도록 사이트 콘텐츠로 묶었습니다. 다른 한쪽은 사용자 경험에서 막혀 있던 작은 빈 칸을 메우는 작업입니다. 댓글이 1단계에서 멈추던 것을 3단계 트리로 풀고, @멘션 자동완성을 붙이고, 새 글을 쓰다가 페이지를 닫으면 사라지던 임시저장을 복원했습니다. 백엔드 쪽에서는 슈퍼관리자가 가입할 때마다 권한이 떨어지는 문제와 로컬 개발 환경(다른 포트)에서 'Failed to fetch' 가 나는 문제를 함께 해결했습니다. 등급 자동 강등은 승격만 있던 비대칭을 없애고, 글/댓글이 삭제됐을 때 자격 기준 미달이면 자동으로 내려가도록 했습니다.",
  },
  {
    version: "00.026.000",
    date: "2026-04-27",
    summary: "브랜드 정비(이전 명칭 정리) 마무리 + 관리자 콘솔 7대 카테고리 재정렬 + Cloudflare 백엔드 인프라 셋업 + 운영 버그 일괄 처리. 사이트 콘텐츠/책 카탈로그 관리 패널, 게시글 일괄 말머리, 칩형 게시판 필터, 강연·투어 hidden 운영, 쿠키 동의 배너, 알림 종모양 라인아트 아이콘을 한 번에 도입했습니다.",
    details: [
      "전역 네임스페이스 통일 — `wsd_*`/`WSD_*` → `bgnj_*`/`BGNJ_*`. localStorage / sessionStorage / 글로벌 헬퍼 / 문서 노트 모두 일괄 변경. data.js 상단에 일회성 마이그레이션을 두어 기존 사용자의 wsd_* 키 데이터를 bgnj_*로 자동 복사(원본 보존).",
      "브랜드 잔여 정리 — 이전 명칭/도메인/심볼 표기를 뱅기노자/bgnj.net/현 디자인 시스템으로 통합. 로그인 시 발생하던 미정의 식별자 에러 해결, 고아 컴포넌트 파일과 styles.css 잔여 클래스 삭제.",
      "관리자 메뉴 7개 대카테고리 재정렬 — 요약 / 콘텐츠 / 회원관리 / 쇼핑 / 운영설정 / 개인정보 관리 / 시스템 관리. 책 카탈로그 / 책 주문이 쇼핑 그룹으로 분리되고, 회원·등급은 회원관리로 통합, 감사 로그 중복 렌더 제거.",
      "사이트 콘텐츠 편집 패널 — 메뉴 라벨 / 히어로 텍스트 / 푸터 문구 / 브랜드명 / 로고·파비콘(파일 업로드 → dataURI) / OG 메타. 저장 시 head meta가 즉시 갱신되어 카카오톡·페이스북 공유 미리보기에 반영.",
      "다양한 책 카탈로그 시스템 — `BGNJ_BOOKS` 헬퍼(list/get/create/update/remove/setHidden/addReview/removeReview) + `BooksAdminPanel` (메타·가격·상태·표지 PNG 업로드·PDF 미리보기 업로드·소개·목차·저자·리뷰 모더레이션). 책마다 독립된 reviews 배열.",
      "강연/투어 hidden 운영 — 시드 데이터 + override 패턴이라 시드 항목 삭제가 무효화되던 문제 해결. `setHidden(id, hidden)` / `listAll({includeHidden})` API + 관리자 패널의 숨김 토글·배지·흐림 처리. 시드 항목은 자동 hidden 처리, override-only는 완전 삭제.",
      "관리자 커뮤니티 칩형 필터 — 게시판 분류 드롭다운 → 검색 입력 위 칩 (전체/공지/자유/질문/정보/...) + 항목별 카운트, role=tab/aria-selected.",
      "게시글 일괄 말머리(prefix) 설정 — 체크박스 선택 → 일괄 작업 바에 말머리 입력 + 적용 (비우면 제거).",
      "쿠키 동의 배너 — 첫 방문 시 표시, 필수/분석/마케팅 항목별 동의(필수 거부 불가). PIPA·GDPR 가이드라인. 결정은 `bgnj_cookie_consent`에 영속화되고 `bgnj-cookie-consent` CustomEvent 발화.",
      "알림 아이콘 → 종모양 라인아트 SVG (◇ 기호 → bell.outline). 미읽음 카운트 배지는 그대로.",
      "Cloudflare 백엔드 인프라 셋업 — D1 데이터베이스 `banginoja-db` 생성 + 스키마(users/sessions/posts/comments/books/book_reviews/book_orders/categories/grades/site_content) 적용, R2 버킷 `banginoja-media` 생성, `workers/wrangler.toml` + `workers/schema.sql` 추가. Worker API 코드는 다음 버전.",
      "회원등급 색상 블루 팔레트 마이그레이션 — 노란/금 hex 잔여 → #64748B/#94A3B8/#93C5FD/#3B82F6/#2563EB/#1E3A8A. 일회성 캐시 마이그레이션 추가.",
      "기타 — '왕의길' 메뉴 → '뱅기노자의 길', 책 CTA 잡문구(3만원 무료배송 / 10% 적립 / 사인본 한정수량) 제거, 커뮤니티 미존재/등급 미달 게시글 접근 가드, .gitignore 추가, .DS_Store/.wrangler 캐시 git 제거.",
    ],
    context: "이번 묶음은 두 갈래입니다. 한쪽은 이전 브랜드의 모든 흔적을 코드와 화면에서 지우고 '뱅기노자'로 통일하는 정리 작업, 다른 한쪽은 운영자가 코드 수정 없이도 사이트를 굴릴 수 있게 만드는 패널 확장입니다. 사이트 콘텐츠/책 카탈로그/일괄 말머리/숨김 운영이 그 축이고, Cloudflare 백엔드(D1·R2) 인프라가 다음 사이클(서버 인증, 게시글 동기화, 미디어 업로드)의 토대가 됩니다. 메뉴 구조도 운영 흐름에 맞춰 7개 대카테고리(요약·콘텐츠·회원관리·쇼핑·운영설정·개인정보 관리·시스템 관리)로 재정리해, 같은 성격의 작업이 한 그룹 안에 모이도록 했습니다.",
  },
  {
    version: "00.025.003",
    date: "2026-04-27",
    summary: "도메인 연결 사전작업 + 잔여 hooks 위반 수정. GitHub Pages용 GitHub Actions 워크플로우와 CNAME(bgnj.net) 추가, 일부 페이지의 hooks-before-return 위반을 정리해 라우팅 변경 시 재마운트 안전성 확보.",
    details: [
      "GitHub Pages 자동 배포 워크플로우 추가 — main push 시 정적 파일을 publish.",
      "커스텀 도메인 bgnj.net 연결 (Cloudflare DNS A/CNAME + GitHub Pages 인증서 발급).",
      "Hooks before return 위반 수정 — 라우팅 가드보다 React.useState 호출이 먼저 오도록 정리.",
    ],
    context: "도메인 연결과 GitHub Pages 자동 배포 라인을 마무리하면서, 페이지가 라우팅 분기에서 마운트/언마운트될 때 hooks 순서가 어긋나 발생하던 잠재적 불안 요소를 같이 정리했습니다.",
  },
  {
    version: "00.019.000",
    date: "2026-04-26",
    summary: "기능 정상화 묶음. 댓글 답글 트리·강연/투어 신규 등록·강연 후기·주문 영수증·운영 감사 로그·활동 기반 자동 등급 승격을 한 번에 도입했습니다. 운영자가 한 사이트 안에서 컨텐츠를 추가·관리·기록하는 흐름이 모두 닫혔습니다.",
    details: [
      "댓글 답글 트리(`CommentTree`) — 커뮤니티/칼럼 모두 1단계 들여쓰기 답글, 글 작성자 자동 알림 발화, 사이드 들여쓰기 표시.",
      "강연 후기 섹션(`LectureReviewsSection`) — 투어 후기와 같은 패턴으로 별점 + 본문, 참가 확정 회원만 작성. `BGNJ_LECTURES.canReview / addReview / listReviews / deleteReview` 추가, `BGNJ_STORES.lectureReviews` 신규.",
      "강연/투어 신규 등록 — 관리자 콘텐츠 메뉴의 강연·투어 탭에 `+ 새 강연 추가` / `+ 새 투어 추가` 버튼. 추가하면 즉시 편집 폼이 열려 정원·일정·가격을 채울 수 있고, 카드 헤더에는 삭제 버튼이 함께 노출.",
      "주문 영수증 다운로드 — `BGNJ_BOOK_ORDERS.generateReceipt / downloadReceipt`로 텍스트 영수증을 발급. 마이페이지 내 주문 카드와 관리자 왕의길 탭에서 `영수증 ↓` 버튼으로 다운로드.",
      "운영 감사 로그(`BGNJ_AUDIT` + `AuditLogPanel`) — 회원 등급 변경/정지/삭제, 관리자 권한 토글, 강연/투어/책 입금 확인·발송·배송 완료·취소가 모두 자동 기록. 관리자 시스템 메뉴 `감사 로그` 탭에 검색·CSV·전체 삭제와 함께 노출.",
      "활동 기반 자동 등급 승격(`BGNJ_GRADE_PROMO`) — 댓글 5개 이상이면 독자, 글 3개 + 댓글 15개 이상이면 사관으로 자동 승격(승격은 일어나도 강등은 없음). 승격 시 본인에게 알림이 자동 발화되고 감사 로그에도 기록됨. createPost / addComment 시점에 트리거.",
    ],
    context: "5개 미션 운영 사이클이 모두 닫힌 뒤, 사용자 입장에서는 답글이 안 달리고 후기가 한 영역만 있고 영수증이 없는 식의 작은 빈 칸이 눈에 띄었습니다. 운영자 입장에서도 강연/투어를 새로 만드는 흐름이 코드를 건드려야 가능했고, 어떤 운영 액션이 언제 일어났는지 추적이 어렵다는 한계가 있었습니다. 이번 PR은 그 빈 칸들을 한꺼번에 메우면서, 각 액션이 감사 로그로 자동 기록되도록 흐름을 일치시켰습니다.",
  },
  {
    version: "00.018.000",
    date: "2026-04-26",
    summary: "회원·게시판·권한·약관·FAQ·강연 UI·투어 후기까지 한 번에 정리한 운영 인프라 PR입니다. 관리자가 실제 등록 회원의 등급·정지·삭제를 직접 다루고, 게시판은 카드형 추가 + 순서/글 수/권한 매트릭스로 한 화면에서 정비할 수 있게 됐습니다. 약관/개인정보 처리방침과 자주 묻는 질문은 별도 라우트로 노출되며 관리자에서 본문을 직접 편집합니다. 강연 페이지는 투어와 같은 탭+스티키 사이드바 UI로 재구조됐고, 투어 페이지에는 참여 후기 영역이 도입됐습니다.",
    details: [
      "`BGNJ_AUTH` 확장 — `setGrade(userId, gradeId)`, `toggleAdmin`, `suspendUser(reason)`, `unsuspendUser`, `removeUser`, `getActivity`. 정지된 사용자는 `signIn`이 거부.",
      "`MemberAdminPanel` 신설 — 실제 등록 회원 목록(검색·등급 필터·CSV) + 상세에서 등급 즉시 변경(셀렉트), 관리자 권한 토글, 정지/해제, 계정 삭제, 게시글·댓글·북마크·강연·답사·주문 활동 요약과 최근 게시글/주문/강연/답사 리스트.",
      "`AdminCategoryPanel` 개선 — 카드형 추가 폼(이름 입력 시 ID 자동 생성), 순서 ▲▼ 이동, 게시판별 글 수, 설명 인라인 수정 + `등급 × 게시판` 권한 매트릭스 뷰(읽기/쓰기 ✓/·).",
      "`BGNJ_LEGAL` + `LegalAdminPanel` + `LegalPage` 신설 — 개인정보 처리방침/이용약관을 Tiptap 에디터로 편집, `bgnj_legal_docs` 저장소. 푸터 버튼이 `privacy` / `terms` 라우트로 연결.",
      "`BGNJ_FAQ` + `FaqAdminPanel` + `FaqPage` 신설 — FAQ 추가/수정/삭제/순서 변경, 카테고리별 그룹·검색 + 아코디언 형태로 공개. 푸터 `자주 묻는 질문` 버튼이 `faq` 라우트로 연결.",
      "`LecturesPage` 전면 재구조 — `TourPage`와 동일한 탭 + 좌측 본문(이미지·진행 흐름·참고) + 우측 스티키 `LectureBookingPanel`(잔여/대기 + 신청 폼 + 무통장 입금 안내 + 본인 상태 카드 + .ics).",
      "`TourPage` 하단에 `TourReviewsSection` 추가 — 참가 확정 회원만 별점 + 후기 작성, 평균 평점 + 별 표시, 본인/관리자 삭제 가능.",
      "`CommunityPage` 상단에 `MY ACCESS` 배너 — 현재 등급(컬러 배지)·레벨·읽기 가능/쓰기 가능 게시판 수와 이름 노출(비로그인은 비로그인 안내).",
      "관리자 사이드바 운영 설정 그룹에 `약관/개인정보` · `자주 묻는 질문` 탭 추가. KMS 미션 영역들도 새 운영 자산을 반영하도록 업데이트.",
    ],
    context: "Cycle 1~5에서 5개 미션의 운영 사이클이 모두 닫혔으니, 다음 자연스러운 단계는 운영자가 실제로 매일 만지는 '회원/게시판/약관/FAQ' 관리 흐름을 정리하는 것이었습니다. 회원 패널이 가짜 PRIVACY 목 데이터에 묶여 있던 한계를 풀고, 게시판은 추가/삭제/순서 변경·권한 매트릭스를 한 화면에서 제공하도록 개선했습니다. 약관/개인정보 처리방침과 FAQ는 코드 수정 없이 운영자가 직접 갱신할 수 있어야 운영 신뢰가 누적되므로 별도 저장소와 편집기를 도입했습니다. 강연 UI는 투어와 같은 패턴이 더 일관된다는 판단으로 통일했고, 투어 후기는 신청 → 참가 → 후기로 이어지는 사이클의 마지막 고리를 메우는 작업입니다.",
  },
  {
    version: "00.017.000",
    date: "2026-04-25",
    summary: "Cycle 5(투어 판매·운영) 출시와 공통 인프라 강화를 한 묶음으로 진행했습니다. 투어가 카탈로그였던 상태에서 회원 전용 신청 → 무통장 입금 → 관리자 입금 확인 → 참가 확정 사이클로 닫혔고, 정원·대기열·.ics·URL 해시 딥 링크까지 강연/책과 같은 패턴으로 정렬됐습니다. 동시에 강연/책/투어의 상태 변화가 사용자에게 자동 알림으로 전달되는 통합 알림 인프라가 도입됐고, 장바구니가 새로고침에도 유지되도록 localStorage 영속화가 들어갔습니다.",
    details: [
      "`BGNJ_TOURS` helper 신설 — listAll / getTour / saveTour / deleteTour / reserve / cancelReservation / confirmPayment / unconfirmPayment / getSeats / hasUserReserved / listMyReservations / generateIcs / downloadIcs.",
      "`BGNJ_STORES`에 `tourOverrides` / `tourReservations` 신설. 시드 투어(`BANGINOJA_DATA.tours`)에 `capacity` / `priceNumber` / `startsAt` / `durationMinutes` 필드 추가.",
      "`TourPage` 전면 개조 — 사이드바 `예약 신청` / `대기자 등록` mock을 실제 신청 폼(`TourBookingPanel`)로 교체. 본인 상태 카드 + 무통장 입금 안내 + .ics 다운로드 + 신청 취소까지 같은 위치에서 처리.",
      "관리자 콘텐츠 메뉴 `투어 프로그램` 탭을 mock 표 → `TourAdminPanel`로 교체 — 잔여/대기 표시 + 투어 정보 수정(capacity·일정·가격) + 참가자 명단 + 입금 확인 토글 + 신청 취소.",
      "App에 `#tour-{id}` 해시 라우팅 추가, 홈 알림/마이페이지에서 `sessionStorage.bgnj_pending_tour_id` 경유로 투어 상세 점프.",
      "마이페이지 `예정 답사` 정적 카드를 `MY TOURS — 내 답사 신청` 개인화 카드로 교체(상태별 컬러 라벨).",
      "통합 알림 인프라 — `BGNJ_LECTURES.confirmPayment / _promoteWaitlist`, `BGNJ_BOOK_ORDERS.confirmPayment / markShipped / markDelivered / cancelOrder`, `BGNJ_TOURS.confirmPayment / _promoteWaitlist`가 상태 변경 시 본인에게 알림을 자동 push. 헤더 ◇ 알림 벨이 알림 타입별로 강연 / 투어 / 마이페이지 / 커뮤니티 라우트로 라우팅.",
      "장바구니 localStorage 영속화 — App `cart` 상태가 `bgnj_cart` 키로 저장/복원되어 새로고침과 페이지 이동 사이에서도 유지됨.",
      "KMS 미션 4(투어) 영역을 위 변경에 맞게 재기록. 미션 평가 카드 20% → ~70%.",
    ],
    context: "Cycle 3(강연), Cycle 4(책)에서 검증된 무통장 입금 + 정원·대기열 + 입금 확인 패턴을 그대로 투어에도 적용했습니다. 같은 helper 형태와 같은 `bankAccount` 저장소를 공유하므로 운영자가 한 번 익히면 세 영역 모두 같은 방식으로 운영할 수 있습니다. 동시에 결제 사이클이 닫힌 세 영역 모두에서 상태 변경이 사용자에게 보이지 않으면 의미가 없어, 알림 인프라를 한 PR에 묶어 통합했고 장바구니 손실을 막기 위한 localStorage 영속화도 같이 넣었습니다.",
  },
  {
    version: "00.016.000",
    date: "2026-04-25",
    summary: "Cycle 4(뱅기노자 책 판매) 출시. 회원 전용 무통장 입금 단일 흐름으로 책 주문 → 입금 → 발송 → 배송 완료 사이클을 닫고, 관리자 콘솔의 메뉴 명칭을 홈페이지 내비와 일치시켰습니다(커뮤니티 / 강연 / 투어 프로그램 / 뱅기노자 칼럼 / 왕의길).",
    details: [
      "`BGNJ_BOOK_ORDERS` helper 신설 — listAll / listByStatus / listMine / getOrder / createOrder / confirmPayment / unconfirmPayment / markShipped(tracking) / markDelivered / cancelOrder / exportCsv. 주문번호는 `WSD-YYYYMMDD-NNN` 시퀀스로 자동 생성.",
      "`BGNJ_STORES.bookOrders` 신설 — 단일 배열에 모든 주문 보관(상태 머신: pending_payment → paid → shipped → delivered, 또는 cancelled).",
      "`CheckoutPage` 전면 개조 — 비로그인 차단 + 회원 전용 + 무통장 입금 안내 단일 흐름. 다단계 mock(카드/계좌이체/간편결제)을 모두 제거하고 배송 정보 한 폼으로 단순화. 운영자 계좌가 비어 있으면 결제 버튼 비활성화.",
      "주문 완료 화면 — 주문번호 · 계좌 안내 · 결제 금액 · 배송지를 한 페이지에 요약. 입금자명 가이드 자동 노출.",
      "관리자 콘텐츠 메뉴에 `왕의길` 탭 신설(`BookOrderAdminPanel`) — 상태별 필터 + 카드 + 입금 확인 → 발송 → 배송 완료 액션 + 송장 입력 + CSV 다운로드.",
      "관리자 사이드바 메뉴 명칭을 홈페이지와 일치 — `게시글` → `커뮤니티`, `칼럼` → `뱅기노자 칼럼`, `투어` → `투어 프로그램`, `주문` 제거 + `왕의길` 추가, 그룹 명 `회원/주문` → `회원`.",
      "관리자 대시보드 4번째 KPI를 `왕의길 주문` 카드로 교체(전체 주문 수 + 입금 대기 카운트, 대기 0이면 골드 / 있으면 경고 색).",
      "마이페이지 `ORDER STATUS` 카드를 `내 주문 내역` 카드로 교체 — 본인 주문 4건 + 외 N건, 상태별 컬러 라벨, 송장 표시.",
      "강연/책 결제는 같은 `bankAccount` 저장소를 공유하므로 시스템 → 설정 한 곳에서 변경하면 양쪽 모두 반영.",
      "KMS 미션 5(책 판매) 영역을 위 변경에 맞게 재기록. 미션 평가 카드 25% → ~65%.",
    ],
    context: "PG 도입 전이라도 운영 사이클을 닫는 것이 우선이라, 강연 Cycle 3에서 검증된 무통장 입금 패턴을 책 판매에도 그대로 옮겨 왔습니다. 같은 `bankAccount` 저장소를 공유하도록 만들어 운영자가 한 곳에서만 입력하도록 했고, 관리자 메뉴 명칭은 홈페이지 내비와 같은 단어를 쓰도록 통일해 사용자/운영자 사이의 인지 비용을 줄였습니다.",
  },
  {
    version: "00.015.000",
    date: "2026-04-25",
    summary: "사이트 전반의 UX 개선 묶음을 출시했습니다. 관리자 버전 기록을 10건씩 페이지네이션하고 총 개수 요약을 상단에 노출, 우하단 '맨 위로' 플로팅 버튼 추가, 내비 `커뮤니티`에 마우스를 올리면 게시판 서브메뉴가 펼쳐지고, 헤더의 `고딕 / 명조` 토글이 사이트 전체(헤더·푸터·카드 포함) 본문 폰트에 적용되도록 확장했습니다. 카테고리 관리 화면에서는 게시판 제목과 설명을 인라인으로 직접 수정할 수 있습니다.",
    details: [
      "관리자 버전 기록 탭에 10건/페이지 페이지네이션 추가 + 상단에 총 N개 요약 / 최신 버전 표시.",
      "공통 ScrollToTop 컴포넌트 신설 — 320px 이상 스크롤 시 우하단 ↑ 플로팅 버튼 노출. 일반 화면과 관리자 내부 스크롤 컨테이너를 모두 감지.",
      "내비 `커뮤니티` 항목에 hover/포커스 시 게시판 서브메뉴(메가메뉴) 표시. BGNJ_STORES.categories 중 사용자 등급으로 볼 수 있는 항목을 자동 노출하고 클릭 시 sessionStorage(`bgnj_pending_board_id`) 경유로 해당 게시판 탭이 선택됨.",
      "관리자 카테고리 패널에서 게시판 설명(desc)도 인라인 편집 가능. 제목(label)은 기존대로 인라인 수정.",
      "`고딕 / 명조` 토글이 .app 루트의 `--font-serif` / `--font-sans` / `--font-display` / `--font-reading` 네 변수를 동시에 명조로 바꿔 nav·footer·카드·홈·강연 등 인라인 style의 var(--font-serif)까지 따라오도록 확장. 모노 / 브랜드 / 토글 자체는 유지.",
      "내비 menu에 `강연` 진입점을 추가해 강연 라우트 접근성을 높임.",
    ],
    context: "Cycle 3 출시 직후 사용자가 다섯 가지 UX 개선을 한 번에 요청해, 결제 인프라처럼 깊이 작업할 거리는 아니지만 사이트 전반에 영향을 주는 항목들을 한 PR로 묶어 처리했습니다. 특히 폰트 토글은 기존에 main 안쪽만 적용되던 한계가 있어 CSS 변수 단위에서 갈아끼우는 방식으로 바꿔, 향후 인라인 style을 추가해도 자동으로 따라오게 만들었습니다.",
  },
  {
    version: "00.014.000",
    date: "2026-04-25",
    summary: "Cycle 3(뱅기노자 강연 운영) 출시. 회원 전용 강연 신청, 무통장 입금 결제(PG 도입 전 임시), 관리자 입금 확인 → 참가 확정, 정원/대기열 자동 처리, .ics 캘린더 다운로드, 마이페이지 내 신청 내역, 관리자 강연 탭 + 계좌번호 설정까지 한 PR에 묶었습니다.",
    details: [
      "`BGNJ_LECTURES` helper 신설 — listAll / getLecture / saveLecture / deleteLecture / register / cancelRegistration / confirmPayment / unconfirmPayment / getSeats / hasUserRegistered / listMyRegistrations / generateIcs / downloadIcs / getBankAccount / saveBankAccount.",
      "`BGNJ_STORES`에 `lectureOverrides` / `lectureRegistrations` / `bankAccount` 신설. 시드 강연(`BANGINOJA_DATA.lectures`)은 capacity / price / startsAt / durationMinutes를 갖도록 확장.",
      "`pages/LecturesPage.jsx` 신규 — 강연 목록 / 상세 / 신청 폼(회원 전용) / 무통장 입금 안내 / 본인 상태 카드 / 신청 취소 / .ics 다운로드.",
      "App에 `lectures` 라우트와 `#lecture-{id}` 해시 딥 링크 추가. 홈 강연 카드 클릭 타겟을 `tour` → `lectures`로 변경.",
      "마이페이지 `예정 강연` 정적 카드를 `MY LECTURES — 내 신청 강연` 개인화 카드로 교체(상태별 컬러 표시).",
      "관리자 콘텐츠 메뉴에 `강연` 탭 신설 — 강연 정보 수정(제목/일정/정원/가격) + 참가자 명단 + 입금 확인 토글 + 신청 취소.",
      "관리자 시스템 메뉴 `설정` 탭에 `BankAccountPanel` 추가 — 은행 / 계좌번호 / 예금주 / 안내 메모 입력. 비어 있으면 신청 화면에서 안내 차단.",
      "KMS 미션 2(강연) 영역을 위 변경에 맞게 재기록. 미션 평가 카드 25% → ~70%.",
    ],
    context: "사용자가 PG는 한참 뒤로 미루고 무통장 입금부터 시작하자는 결정을 명시적으로 내려서, 전체 결제 인프라가 빠진 상태로도 운영 사이클이 닫히도록 흐름을 잡았습니다. 회원만 신청 가능한 정책과 관리자가 입금을 직접 확인하는 단계가 핵심이고, 계좌번호는 관리자 설정 탭에서 입력해 노출되는 구조라 향후 운영 명의가 바뀌어도 코드 변경 없이 따라갈 수 있습니다.",
  },
  {
    version: "00.013.000",
    date: "2026-04-25",
    summary: "Cycle 2(뱅기노자 칼럼 운영 강화)를 한 PR에 묶었습니다. 임시 저장 / 예약 발행 / 발행 취소 / 수정 흐름과 좋아요 / 공유 링크 / 댓글 / 검색 / 카테고리 아카이브 / 추정 읽기 시간 자동 계산을 모두 도입해 칼럼이 단순 발행물에서 운영 가능한 콘텐츠 자산으로 전환되었습니다. URL 해시 딥 링크(`#col-{id}`, `#post-{id}`)도 함께 추가되어 외부 공유가 가능해졌습니다.",
    details: [
      "`BGNJ_COLUMNS` helper 신설 — listAll / listPublic / getColumn / saveColumn / deleteColumn / searchPublic / estimateReadTime / 자동 promote.",
      "콘텐츠는 `BGNJ_STORES.userColumns`(`status` = draft / scheduled / published)에 통합 저장. 좋아요·조회수는 `BGNJ_STORES.columnEngagement` 맵으로 분리(시드 칼럼도 동일).",
      "관리자 칼럼 에디터에 `임시 저장 / 예약 발행 / 즉시 발행 / 발행 취소 / 수정` 버튼과 상태 필터(전체/발행/예약/임시) 추가. DRAFT / SCHEDULED / PUBLISHED 배지로 상태 가시화.",
      "공개 칼럼 페이지에 검색 입력 / 카테고리 토글 / 카드별 ♥·조회수 인디케이터 / 추정 읽기 시간 자동 계산 도입.",
      "칼럼 상세에 ♥ 공감 토글 + 공유 링크 복사(`#col-{id}` 해시) + 댓글(등록 / 삭제 / 등급 배지) + 이전/다음 네비게이션 추가.",
      "App에 URL 해시 라우팅 추가: `#col-{id}` → 칼럼 상세, `#post-{id}` → 커뮤니티 상세.",
      "홈 추천 칼럼과 관리자 대시보드 카운트가 `BGNJ_COLUMNS.listPublic()`을 사용하도록 정리 — draft/scheduled은 더 이상 공개 화면에 새지 않음.",
      "KMS 기능정의서 미션 3(칼럼) 영역을 위 변경에 맞게 재기록.",
    ],
    context: "Cycle 2의 목표는 '칼럼이 한 번 발행되고 끝나는 일회성 흐름'을 닫는 것이었습니다. 발행 사이클(임시→예약→발행→발행취소)과 독자 상호작용(공감·공유·댓글)이 같이 들어와야 비로소 콘텐츠가 자산으로 누적되기 때문에, 두 흐름을 한 PR에 묶었습니다. RSS와 이메일 구독은 외부 인프라가 필요해 후속 사이클로 미뤘고, 대신 URL 해시 딥 링크를 도입해 단기 공유는 작동하게 했습니다.",
  },
  {
    version: "00.012.000",
    date: "2026-04-25",
    summary: "Cycle 1(뱅기노자 커뮤니티 마무리)을 한 PR에 묶었습니다. 좋아요·북마크·신고·댓글 알림·작성자 등급 배지·게시글 페이지네이션을 모두 도입해 단순 게시판이었던 흐름을 '커뮤니티'로 끌어올렸습니다. 관리자 콘솔에는 신고 운영 큐 탭이 새로 들어왔고, 마이페이지에는 북마크와 알림 카드가 추가됐습니다.",
    details: [
      "커뮤니티 글 상세에 `좋아요(♥)` 토글 도입 — 누른 사용자 ID를 글에 보존하고, 상세/액션/목록에서 수치를 모두 같은 값으로 표시.",
      "글 상세에 `북마크(★/☆)` 토글과 마이페이지 BOOKMARKS 카드 도입(`BGNJ_STORES.bookmarks` 신설).",
      "글 상세 `신고` 버튼을 사유 입력 폼으로 확장하고, 관리자 콘텐츠 메뉴에 `신고` 탭 신설(필터: 미처리/처리 완료/반려/전체, 액션: 게시글 열기 / 처리 완료 / 반려 / 게시글 삭제+처리).",
      "댓글 등록 시 본인 글이 아니면 작성자에게 알림이 쌓이도록 연결(`BGNJ_STORES.notifications`). 내비게이션에 ◇ 알림 벨과 미읽음 배지·드롭다운 추가, 마이페이지 NOTIFICATIONS 카드도 동시 노출.",
      "글 목록 / 글 상세 / 댓글 작성자에 회원 등급 배지(`AuthorGradeBadge`)를 인라인 표시. `BGNJ_USER_GRADE` / `BGNJ_AUTHOR_GRADE` helper 신설.",
      "커뮤니티 글 목록에 페이지네이션(10건/페이지) 추가. 검색·탭이 바뀌면 1페이지로 리셋.",
      "관리자 CSV 다운로드 헤더에 `likes` 컬럼 추가.",
      "외부 진입(알림 클릭 / 신고 큐 / 마이페이지 카드)에서 글 상세로 점프할 때 `sessionStorage.bgnj_pending_post_id` 패턴을 도입.",
      "KMS 기능정의서 미션 1(커뮤니티) 영역을 위 변경에 맞게 재기록.",
    ],
    context: "Cycle 1의 목표는 '커뮤니티가 게시판처럼 보이는 문제'를 닫는 것이었습니다. 글의 흐름은 이미 살아 있었지만 사용자가 다른 사람의 반응(좋아요/등급/알림)을 거의 느끼지 못해 참여 동기가 약했습니다. 이번 PR은 그 사회적 신호를 한 번에 깔고, 운영자가 신고를 처리할 수 있는 큐까지 같이 붙였습니다. 결제 의존이 없는 영역이라 한 사이클에 묶어 끝내는 것이 ROI가 가장 컸습니다.",
  },
  {
    version: "00.011.000",
    date: "2026-04-25",
    summary: "기능정의서를 사이트의 5가지 미션(뱅기노자 커뮤니티 / 뱅기노자 강연 일정 / 뱅기노자 칼럼 / 뱅기노자 투어 프로그램 / 뱅기노자 책 판매) + 공통 기반(BASE) 영역 단위로 재정렬하고, 각 영역에 `현재 평가 / 없는 기능 / 기능별(요소·기술 스펙·유의할 점·개발 이슈) / 영역 차원 기술 스펙·유의할 점·개발 이슈` 표준 블록을 도입했습니다. 관리자 KMS 화면에는 우측 스티키 목차(TOC)를 추가해 영역 간 이동을 빠르게 만들었습니다.",
    details: [
      "기능정의서를 페이지 단위에서 미션 단위로 재구성: 공통 기반(00) + 커뮤니티(01) + 강연 일정(02) + 칼럼(03) + 투어(04) + 책 판매(05) 6개 영역.",
      "각 미션마다 현재 평가와 '완성도를 높이려면 필요한 것'(없는 기능) 목록을 명시.",
      "각 영역의 기능을 단일 카드로 정리하고 `요소 / 기술 스펙 / 유의할 점 / 개발 이슈` 4축으로 표준화.",
      "영역 헤더에 라우트, 상태 배지, 진입 시 평가 카드를 추가해 한 영역의 구도를 한 화면에서 파악할 수 있게 함.",
      "관리자 KMS 화면 오른쪽에 240px 스티키 목차를 추가해 6개 영역 + 평가 요약을 빠르게 이동할 수 있게 함. 좁은 화면에서는 위로 이동.",
      "최상단에 5가지 미션 평가 요약 카드를 두어 사이트 전체 완성도를 한눈에 보여줌(상태·커버리지·평가).",
    ],
    context: "KMS를 누르는 사람이든 AI든 가장 먼저 던지는 질문은 '이 사이트가 무엇을 위해 만들어졌고, 그 기능이 어디까지 와 있는가'입니다. 그래서 기능정의서를 페이지 단위로 나열하던 방식에서 사이트가 존재하는 5가지 미션 단위로 바꾸고, 각 미션마다 평가와 빈 칸을 명시해 다음 작업의 우선순위가 자연스럽게 보이도록 만들었습니다. 우측 목차는 영역이 늘어날수록 아래로 길어지는 본문 안에서 길을 잃지 않도록 도와줍니다.",
  },
  {
    version: "00.010.000",
    date: "2026-04-25",
    summary: "KMS 내부 구조를 `기능정의서`와 `디자인` 두 탭으로 재정리하고, 진입 시 기본 탭을 `기능정의서`로 고정했습니다. 기능정의서는 실제 라우트 기준으로 진입 경로, 접근 권한, 실제 화면 구성, 사용자 가능 동작, 데이터 출처, 구현 상태, 알려진 미구현 항목까지 페이지별로 깊이 있게 다시 작성했습니다.",
    details: [
      "KMS의 `운영 원칙` 탭을 제거하고 `기능정의서`와 `디자인` 두 탭만 남겼습니다.",
      "기능정의서 항목 구조를 `진입 경로 / 접근 권한 / 목적 / 실제 화면 구성 / 사용자 가능 동작 / 실제 데이터 기준 / 알려진 미구현 / 운영 메모 / 구현 상태` 9개 축으로 표준화했습니다.",
      "각 페이지(홈, 인증, 마이페이지, 커뮤니티, 투어/강연, 칼럼, 책/체크아웃, 관리자)의 화면 섹션과 사용자 동작을 현재 코드 기준으로 다시 정리했습니다.",
      "KMS 요약 카드를 두 탭 중심 안내(기본 = 기능정의서)로 다시 썼습니다.",
    ],
    context: "KMS를 누르면 사람이든 AI든 가장 먼저 봐야 할 것이 `이 사이트가 지금 어떤 기능을 갖고 있는지`라는 점이 명확해졌습니다. 그래서 운영 원칙 탭은 KMS 화면에서는 빼고 기능정의서와 디자인만 남겨, 무엇이 만들어져 있고 어떤 기준으로 손대야 하는지를 한 호흡에 확인할 수 있게 정리했습니다. 운영 원칙은 `kms.md` 문서 본문과 버전 기록에서 계속 관리합니다.",
  },
  {
    version: "00.009.000",
    date: "2026-04-25",
    summary: "관리자 대시보드를 실제 저장소 수치 기준으로 다시 연결했고, 사용자 화면에서는 왕사남 소개 영역과 진입점을 제거했습니다. KMS는 실제 페이지 기준 기능정의서로 개선하고, KMS 내부에 `기능정의서`, `디자인`, `운영 원칙` 탭을 둬 필요한 기준을 바로 찾아볼 수 있게 재구성했습니다.",
    details: [
      "대시보드가 `BGNJ_AUTH`, `BGNJ_COMMUNITY`, `BGNJ_STORES`, `BANGINOJA_DATA`를 기준으로 실제 수치를 보여주도록 바뀌었습니다.",
      "내비게이션, 홈, 라우트에서 왕사남 소개 진입점을 제거하고 홈에는 강연 일정만 남겼습니다.",
      "KMS 내부에서 기능정의서와 디자인 기준을 분리해 실제 페이지 구성과 작업 원칙을 더 명확히 확인할 수 있게 했습니다.",
    ],
    context: "관리자에서 보는 숫자가 하드코딩이면 운영 판단 기준으로 쓰기 어렵고, KMS도 실제 페이지 구조보다 추상적인 설명이 많으면 다음 작업자의 판단 속도가 느려집니다. 그래서 이번에는 운영 화면과 문서 둘 다 실제 구성 기준으로 다시 정리했습니다.",
  },
  {
    version: "00.008.000",
    date: "2026-04-25",
    summary: "KMS를 기능정의서 중심 문서로 재정리해 현재 홈페이지 기준 전체 기능 범위를 더 자세히 기록했고, 관리자 페이지에는 `디자인` 탭을 신설해 화면 작업 시 참고할 디자인 원칙을 별도로 볼 수 있게 했습니다.",
    details: [
      "KMS 문서에 기능정의서 우선 원칙을 추가하고, 페이지별 기능 목적과 상태를 더 자세히 정리했습니다.",
      "디자인 원칙서를 별도 섹션으로 추가해 브랜드 무드, 컬러, 타이포그래피, 레이아웃, 금지 원칙을 정리했습니다.",
      "관리자 페이지 시스템 메뉴에 `디자인` 탭을 추가해 실제 작업 화면에서 디자인 기준을 바로 확인할 수 있게 했습니다.",
    ],
    context: "여러 개발자가 KMS를 먼저 참고하는 흐름에서는 규칙보다 기능 범위와 디자인 기준이 먼저 눈에 들어와야 다음 작업이 빨라집니다. 그래서 KMS의 제1 기능을 기능정의서로 명확히 고정하고, 디자인 기준도 별도 탭으로 분리했습니다.",
  },
  {
    version: "00.007.000",
    date: "2026-04-25",
    summary: "P2 첫 단계로 커뮤니티 게시글과 댓글을 local-first 단일 저장소로 통합하고, 글 수정·삭제·조회수 저장을 붙였습니다. 관리자 게시글 화면도 같은 데이터를 읽도록 바꿔 검색, 분류 필터, CSV 다운로드, 삭제 기능을 실제 운영 흐름으로 연결했습니다.",
    details: [
      "`communityPosts` 저장소와 `BGNJ_COMMUNITY` helper를 추가해 게시글/댓글 흐름을 한 계층으로 묶었습니다.",
      "커뮤니티 상세에서 작성자 또는 관리자가 글과 댓글을 직접 수정·삭제할 수 있게 했습니다.",
      "관리자 게시글 탭이 실제 저장소를 읽고 검색, 필터, CSV 다운로드, 삭제를 수행하도록 연결했습니다.",
    ],
    context: "P2에서 가장 체감이 큰 영역은 커뮤니티였고, 사용자 화면과 관리자 화면이 서로 다른 게시글 데이터를 보면 운영 기능이 계속 목업 상태에 머물 위험이 컸습니다. 그래서 먼저 게시글과 댓글을 단일 저장소로 통합하는 작업을 우선 진행했습니다.",
  },
  {
    version: "00.006.000",
    date: "2026-04-25",
    summary: "P1 기준으로 local-first 인증/데이터 저장 구조를 분리해 회원 저장소와 세션 저장소를 실제로 연결했고, 로그인·회원가입·로그아웃이 같은 인증 계층을 보도록 정리했습니다. 현재 GitHub Pages 환경에서도 확장 가능한 구조로 운영 기준을 명확히 잡았습니다.",
    details: [
      "`BGNJ_AUTH`, `BGNJ_DB`, `BGNJ_STORES.session`, `BGNJ_STORES.users`를 도입해 인증과 데이터 저장 구조를 분리했습니다.",
      "회원가입 시 실제 사용자 레코드를 저장하고, 로그인 시 저장된 사용자와 비밀번호 해시를 검증하도록 바꿨습니다.",
      "앱 전역 로그아웃과 로그인 상태 유지가 동일한 세션 저장소를 바라보도록 정리했습니다.",
    ],
    context: "P1을 계속 부분 완료 상태로 두면 이후 기능이 다시 임시 구조 위에 쌓일 위험이 컸습니다. 정적 배포 환경 안에서도 인증과 데이터 저장 구조를 분리한 기반을 먼저 세워야 다음 단계 확장이 흔들리지 않는다고 판단했습니다.",
  },
  {
    version: "00.005.001",
    date: "2026-04-25",
    summary: "KMS를 사이트 전체 기능 인벤토리 기준으로 확장해 다른 개발자가 코드 없이도 구조를 파악할 수 있게 정리했고, 로그인/회원가입 흐름에 기본 검증과 인증 상태 안내를 추가해 현재 인증 방식이 임시 운영 구조임을 더 명확하게 표시했습니다.",
    details: [
      "KMS 문서에 홈, 인증, 마이페이지, 커뮤니티, 투어, 칼럼, 책, 관리자 기능 목록과 구현 상태를 정리했습니다.",
      "로그인/회원가입에 이메일, 비밀번호, 약관 동의, 비밀번호 확인 검증을 추가했습니다.",
      "인증 페이지에 현재 인증 방식과 임시 관리자 계정을 설명하는 안내 카드를 추가했습니다.",
    ],
    context: "KMS가 규칙만 있고 기능 사전 역할은 부족했고, P1 인증/권한 흐름도 사용자가 현재 상태를 명확히 이해하기 어려운 점이 있어 구조와 안내를 함께 정리할 필요가 있었습니다.",
  },
  {
    version: "00.005.000",
    date: "2026-04-25",
    summary: "하단 푸터에서 현재 배포 버전과 빌드를 더 눈에 띄게 표시해 검토 상태를 바로 확인할 수 있게 했고, 우선순위 P1에 맞춰 관리자에서 발행한 칼럼이 공개 칼럼 페이지와 홈 화면에도 노출되도록 연결했습니다.",
    details: [
      "푸터에 현재 배포 버전 카드형 표시를 추가했습니다.",
      "공개 칼럼 페이지에서 관리자 발행 칼럼도 함께 읽도록 연결했습니다.",
      "홈 화면 칼럼 섹션도 관리자 발행 칼럼을 우선 반영하도록 바꿨습니다.",
    ],
    context: "사용자가 커밋, 푸시, 배포 반영 여부를 시각적으로 확인하고 싶어 했고, 동시에 우선순위상 가장 먼저 필요한 관리자 발행물-공개 페이지 연결을 실제 동작으로 붙일 필요가 있었습니다.",
  },
  {
    version: "00.004.000",
    date: "2026-04-25",
    summary: "관리자 페이지에 KMS와 버전 기록 탭을 신설하고, 운영 문서와 같은 규칙을 관리자 화면에서도 바로 확인할 수 있게 정리했습니다. 특히 KMS 수정 시 변경 결과뿐 아니라 수정 계기와 배경을 함께 기록하는 원칙을 화면 구조에 반영했습니다.",
    details: [
      "시스템 탭에 `버전 기록`과 `KMS`를 추가했습니다.",
      "버전 기록은 핵심 수정사항과 세부 업데이트 내역을 분리해 읽기 쉽게 정리했습니다.",
      "KMS에는 개발 규칙, 우선순위, 버전 원칙, 기록 방식, 현재 운영 메모를 넣었습니다.",
    ],
    context: "여러 AI가 함께 작업하는 구조가 되면서, 관리자 페이지에서도 현재 규칙과 변경 맥락을 즉시 확인할 수 있어야 할 필요가 커졌습니다.",
  },
  {
    version: "00.003.001",
    date: "2026-04-25",
    summary: "메인 홈에 왕사남 강연 일정을 노출하고, 로그인 상태 유지·로그아웃·마이페이지 기본 기능을 추가해 사용자 계정 흐름을 정리했습니다.",
    details: [
      "홈에 왕사남 강연 일정 섹션을 추가했습니다.",
      "로그인 상태를 로컬에 저장하고 로그아웃 버튼을 구현했습니다.",
      "마이페이지를 추가해 계정 상태와 예정 프로그램을 확인할 수 있게 했습니다.",
    ],
    context: "사용자가 홈에서 바로 강연 일정을 보고, 로그인 후 본인 상태를 확인할 수 있는 최소 계정 흐름이 필요했습니다.",
  },
];

const ADMIN_DESIGN_SECTIONS = [
  {
    title: "브랜드 무드",
    points: [
      "조선 왕실, 궁궐, 기록물, 전시 도록의 분위기를 기본으로 유지합니다.",
      "장식적인 동양풍보다 절제된 권위와 정적 긴장을 우선합니다.",
      "화려함보다 깊이와 밀도를 느끼게 하는 방향을 기본으로 합니다.",
    ],
  },
  {
    title: "컬러 원칙",
    points: [
      "짙은 먹색 계열 배경을 기본으로 사용합니다.",
      "금색은 강조용 포인트로만 사용하고 남용하지 않습니다.",
      "본문은 높은 가독성을 유지하는 밝은 중성 톤으로 구성합니다.",
      "경고/삭제 색상은 금색과 명확히 구분되게 유지합니다.",
    ],
  },
  {
    title: "타이포그래피 원칙",
    points: [
      "제목은 세리프 중심으로 품격 있게 보이도록 유지합니다.",
      "본문은 읽기 쉬운 한글 폰트를 사용합니다.",
      "메타 정보와 라벨은 모노 계열로 구조를 또렷하게 만듭니다.",
    ],
  },
  {
    title: "레이아웃 원칙",
    points: [
      "여백은 넉넉하게 두고 카드와 표는 편집 디자인처럼 정렬감 있게 구성합니다.",
      "모바일에서도 정보 밀도가 무너지지 않도록 한 줄 정보량을 조절합니다.",
      "기능이 많아도 화면은 차분하고 조용하게 읽혀야 합니다.",
    ],
  },
  {
    title: "디자인 금지 원칙",
    points: [
      "밝은 흰색 바탕 중심의 일반 SaaS 느낌으로 바꾸지 않습니다.",
      "보라색 계열을 브랜드 주색처럼 사용하지 않습니다.",
      "과한 그라데이션과 유행형 마이크로 인터랙션을 남발하지 않습니다.",
      "기존 분위기와 맞지 않는 귀여운 아이콘 중심 화면으로 흐르지 않게 합니다.",
    ],
  },
];

// === KMS 기능정의서: 5가지 미션 + 공통 기반 ===
// 사이트가 존재하는 이유:
//   1) 뱅기노자 커뮤니티 운영
//   2) 뱅기노자 강연 일정 안내
//   3) 뱅기노자 칼럼 공유
//   4) 뱅기노자 투어 프로그램 판매·운영
//   5) 뱅기노자 책 판매
const MISSION_OVERVIEW = [
  {
    id: "community",
    number: "01",
    title: "뱅기노자 커뮤니티",
    short: "회원이 글·댓글·후기를 나누는 핵심 참여 공간.",
    state: "Cycle 1 마무리",
    coverage: "기능 ~85%",
    verdict: "좋아요·북마크·신고·댓글 알림·등급 배지·페이지네이션을 도입해 '커뮤니티답다'고 느낄 사회적 신호를 갖췄다. 남은 큰 항목은 답글 트리·외부 스토리지 이미지·외부 DB 전환.",
  },
  {
    id: "lecture",
    number: "02",
    title: "뱅기노자 강연 일정 안내",
    short: "공개·심화·현장 강연을 알리고 신청·입금까지 운영.",
    state: "Cycle 3 마무리",
    coverage: "기능 ~70%",
    verdict: "신청·정원·대기열·무통장 입금 확인·.ics 캘린더·관리자 명단까지 닫혔다. PG 결제·D-1 알림·자료 보관함은 다음 단계.",
  },
  {
    id: "column",
    number: "03",
    title: "뱅기노자 칼럼 공유",
    short: "정기 칼럼 발행과 공개 노출.",
    state: "Cycle 2 마무리",
    coverage: "기능 ~80%",
    verdict: "임시 저장 / 예약 발행 / 좋아요 / 공유 링크 / 댓글 / 검색 / 카테고리 아카이브 / 추정 읽기 시간 자동 계산을 도입해 콘텐츠 운영의 일상적 흐름이 닫혔다. 남은 큰 항목은 RSS / 이메일 구독 / 작성자 프로필 카드 / 추천 알고리즘.",
  },
  {
    id: "tour",
    number: "04",
    title: "뱅기노자 투어 프로그램 판매·운영",
    short: "답사 프로그램 신청·운영(무통장 입금).",
    state: "Cycle 5 마무리",
    coverage: "기능 ~70%",
    verdict: "회원 전용 신청·무통장 입금·관리자 입금 확인 → 참가 확정·정원/대기열·.ics·내 답사 내역까지 닫혔다. 강연·책과 같은 결제·알림 인프라를 공유.",
  },
  {
    id: "book",
    number: "05",
    title: "뱅기노자 책 판매",
    short: "『왕의길』 소개와 무통장 입금 주문 운영.",
    state: "Cycle 4 마무리",
    coverage: "기능 ~65%",
    verdict: "회원 전용 주문 → 무통장 입금 → 관리자 입금 확인 → 발송 → 배송 완료 사이클이 운영 가능 상태로 닫혔다. PG 결제·재고 관리·영수증·환불·리뷰는 다음 단계.",
  },
];

const FEATURE_DOMAINS = [
  {
    id: "infra",
    number: "00",
    label: "공통 기반",
    title: "공통 기반 — 5개 미션의 받침",
    role: "5개 미션이 공통으로 의지하는 진입점, 인증, 운영자 콘솔, 운영 문서.",
    routes: ["home", "login / signup", "mypage", "admin", "documents"],
    status: "기본 구현",
    evaluation: "랜딩 → 가입/로그인 → 마이페이지 → 관리자 콘솔까지의 뼈대는 모두 살아 있다. 다만 회원 식별 후 무엇을 할 수 있는지(주문·예약·구독)가 비어 있어 사용자에게 '계정의 의미'가 약하다.",
    missing: [
      "외부 DB / 서버 인증으로의 전환(현재 local-first)",
      "이메일 인증·비밀번호 재설정·소셜 로그인",
      "마이페이지 프로필 수정·비밀번호 변경",
      "히어로 통계(2,847 회원 등)의 실수치 연결",
      "검색·전역 알림 센터",
    ],
    features: [
      {
        name: "홈 랜딩",
        status: "구현됨",
        summary: "첫 방문자에게 사이트 정체성과 최신 콘텐츠를 가장 빠르게 보여주는 입구.",
        elements: [
          "히어로(메인 비주얼, 슬로건, CTA) — 레이아웃 토글 center / split / fullbleed",
          "공지사항(`data.notices` 상위 2건 강조 + 행 리스트)",
          "왕사남 강연 일정(3열 카드)",
          "투어 프로그램(2열 카드)",
          "뱅기노자 칼럼(피처 1 + 사이드 4)",
          "파트너십(3열)",
          "책 구매 CTA",
          "푸터 배포 버전 카드",
        ],
        techSpec: "`HomePage` 단일 컴포넌트. 데이터는 `BANGINOJA_DATA` 정적 + `BGNJ_STORES.userColumns` 병합. 레이아웃은 `tweaks.heroLayout`으로 토글.",
        caution: "히어로 통계 수치는 하드코딩이라 실제 운영 수치와 어긋날 수 있음. 운영 화면(대시보드)과 동기화하기 전에는 '데모'로 봐야 함.",
        issues: ["fullbleed 모드에서 메인 비주얼이 과하게 강조되어 본문 가독성을 해치는 케이스 → radial-gradient 마스크로 완화"],
      },
      {
        name: "인증 / 계정",
        status: "부분 구현",
        summary: "회원과 관리자가 같은 입구에서 계정을 만들고 세션을 유지.",
        elements: [
          "로그인 / 회원가입 토글",
          "현재 인증 방식 안내 카드",
          "약관·개인정보 동의 체크박스",
          "관리자 임시 계정 (`admin@admin.admin / admin`)",
          "비밀번호 해시 저장",
          "세션 유지(브라우저 새로고침 후 로그인 상태)",
          "내비게이션 로그아웃",
        ],
        techSpec: "`BGNJ_AUTH` helper + `BGNJ_STORES.users` / `BGNJ_STORES.session` localStorage. 비밀번호는 브라우저 내 해시.",
        caution: "local-first 인증이라 정적 배포 위에서만 동작. 외부 DB 연동 시 저장소만 교체하는 방향으로 설계되었으므로 계층 분리를 깨지 말 것.",
        issues: [
          "P1 초기에는 화면에서 즉석 user 객체를 만드는 수준이었음 → `BGNJ_AUTH` / `BGNJ_DB` 분리로 통합",
          "Babel standalone + React UMD 환경이라 ESM import가 막혀 Tiptap·해시 라이브러리는 window 글로벌로 주입",
        ],
      },
      {
        name: "마이페이지",
        status: "부분 구현",
        summary: "로그인 사용자가 자신의 계정·예정 일정·주문 상태를 한 화면에서 확인.",
        elements: [
          "비로그인 시 안내 카드",
          "계정 카드(이메일·등급·권한·가입 시각)",
          "등급 / 혜택 카드",
          "예정 강연 카드",
          "예정 투어 카드",
          "주문 상태 카드(`cart` 기준)",
          "최근 커뮤니티 활동",
        ],
        techSpec: "`MyPage` 단일 컴포넌트. `user` 세션 + `BGNJ_STORES.grades` + `BGNJ_COMMUNITY.listPosts()` + `BANGINOJA_DATA.lectures/tours` + `cart` 상태.",
        caution: "예정 강연/투어가 사용자 신청 내역이 아니라 사이트 다음 일정이므로, 사용자 입장에서는 '내가 신청한 것처럼' 보일 수 있음. 신청 흐름이 붙기 전까지 라벨링 주의.",
        issues: ["주문/예약 저장소가 없어 마이페이지에서 진짜 보여줄 데이터가 거의 없음"],
      },
      {
        name: "관리자 콘솔",
        status: "부분 구현",
        summary: "운영자가 콘텐츠·회원·주문·문서·개인정보를 한 화면에서 운영.",
        elements: [
          "사이드바 6개 그룹(요약 / 콘텐츠 / 회원·주문 / 운영 설정 / 개인정보 / 시스템)",
          "대시보드(실수치 4개 + 최근 게시글/칼럼 + 빠른 이동)",
          "게시글 관리(검색·필터·CSV·삭제)",
          "칼럼 / 칼럼 작성(Tiptap)",
          "투어 / 회원 / 주문",
          "카테고리 / 회원 등급",
          "개인정보 8개 탭(GDPR / PIPA)",
          "버전 기록 / KMS / 설정",
        ],
        techSpec: "`AdminPage` 단일 컴포넌트. `BGNJ_COMMUNITY` / `BGNJ_AUTH` / `BGNJ_STORES` / `BANGINOJA_DATA` / `PRIVACY_DATA` 동시 참조. 비관리자는 `AdminDenied` 화면.",
        caution: "관리자 콘솔이 단일 컴포넌트라 1900줄을 넘는다. 새 탭 추가 시 분할을 고려할 것.",
        issues: [
          "P1까지는 관리자 게시글 탭이 사용자 게시판과 다른 mock 배열을 봤음 → P2에서 `BGNJ_COMMUNITY`로 통합",
          "Tiptap이 ESM으로만 제공되어 첫 마운트 전에 `wsd-tiptap-ready` 이벤트를 기다려야 했음",
        ],
      },
      {
        name: "운영 문서 / KMS / 버전 기록",
        status: "구현됨",
        summary: "여러 AI와 사람이 같은 규칙·기능·이력 위에서 일하도록 운영 문서를 노출.",
        elements: [
          "`kms.md` 본문",
          "`ai-development-rules.md`",
          "`project-priority-table.md`",
          "관리자 KMS 탭(기능정의서 + 디자인)",
          "관리자 버전 기록 탭",
          "푸터 배포 버전 카드",
        ],
        techSpec: "문서는 정적 마크다운 + 관리자 화면이 같은 내용을 컴포넌트로 표시. `window.BGNJ_VERSION`이 푸터·관리자 빌드 표시의 단일 출처.",
        caution: "문서와 화면이 어긋나면 다음 작업자가 혼선을 일으킨다. KMS 화면 = `kms.md` 본문 = 같은 기준으로 동기화 유지.",
        issues: [],
      },
    ],
    techSpec: "프론트 단일 SPA(React UMD + Babel standalone) + localStorage 기반 저장소(`BGNJ_STORES`) + helper 계층(`BGNJ_AUTH`, `BGNJ_COMMUNITY`, `BGNJ_SAVE`). 외부 DB 연동 시 helper는 유지하고 저장소 구현만 교체하는 구조.",
    cautions: [
      "정적 배포(GitHub Pages) 환경이라 서버 측 권한 검증이 없으므로, 모든 권한 검사가 클라이언트 단에 그친다는 점을 잊지 말 것.",
      "Babel standalone로 JSX를 런타임 컴파일하므로 첫 페인트가 느릴 수 있다. 본격적인 트래픽 단계에서는 빌드 파이프라인 도입이 필요.",
    ],
    issues: [
      "여러 AI가 함께 작업하는 구조에서 같은 mock 데이터가 여러 곳에 흩어져 있던 P1 초기 → 단일 helper로 수렴",
      "정적 배포 환경에서 Tiptap·해시 등 ESM 라이브러리를 끌어오는 패턴이 깨지기 쉬워, window 글로벌 + ready 이벤트 패턴으로 고정",
    ],
  },
  {
    id: "community",
    number: "01",
    label: "뱅기노자 커뮤니티",
    title: "미션 1 — 뱅기노자 커뮤니티 운영",
    role: "회원이 질문·후기·정보를 남기고 운영자가 같은 흐름에서 관리하는 핵심 참여 영역.",
    routes: ["community", "mypage(북마크 / 알림)", "admin > 게시글", "admin > 신고"],
    status: "Cycle 1 마무리(기능 ~85%)",
    evaluation: "Cycle 1에서 좋아요·북마크·신고·댓글 알림·작성자 등급 배지·페이지네이션을 모두 도입해 단순 게시판이 아니라 '커뮤니티'로 느낄 사회적 신호를 갖추게 되었다. 사용자/관리자 화면이 같은 저장소를 보는 P2 통합과 위 기능들이 결합되어, 외부 DB 도입 전에도 운영 가능한 구조가 되었다.",
    missing: [
      "댓글 답글(트리 구조) · 멘션",
      "차단 · 블랙리스트 운영 정책",
      "해시태그 / 인기글 / 주간 트렌드",
      "이미지 외부 스토리지 업로드 (현재는 base64 in-localStorage)",
      "본문 검색(현재는 제목·작성자 부분 일치만)",
      "회원 활동 요약(글 수, 댓글 수, 활동 기간)",
      "외부 DB / 서버 권한 검증으로 전환",
    ],
    features: [
      {
        name: "게시글 목록 / 검색 / 카테고리 필터 / 페이지네이션",
        status: "구현됨",
        summary: "전체 게시글을 카테고리·검색어로 좁혀 보고 페이지 단위로 탐색.",
        elements: [
          "검색 입력(제목 부분 일치)",
          "카테고리 탭(자유 / 질문 / 정보 등)",
          "행 리스트(번호 / 분류 / 제목 / 작성자+등급 / 조회 / 날짜)",
          "페이지네이션(10건/페이지, 이전·다음·번호)",
          "북마크 / 좋아요 카운트 인디케이터(제목 옆)",
        ],
        techSpec: "`BGNJ_COMMUNITY.listPosts()` → `BGNJ_STORES.communityPosts` localStorage. 카테고리는 `BGNJ_STORES.categories` 중 `boardType === 'community'`. 페이지 상태(`page`)는 검색·탭 변경 시 1로 리셋.",
        caution: "검색은 제목 부분 일치이고 본문 검색은 미구현. 정렬은 최신순 한 가지.",
        issues: ["사용자 작성 글과 시드 글이 다른 키에 저장되어 있던 P1 → `ensureCommunityPostsSeeded`로 단일 키 통합"],
      },
      {
        name: "게시글 작성 / 수정 / 삭제",
        status: "구현됨",
        summary: "본인 또는 관리자가 글을 만들고 고치고 지움.",
        elements: [
          "Tiptap 본문 에디터(StarterKit + Image + Link + Typography)",
          "카테고리 선택",
          "이미지 첨부",
          "임시 저장 (미구현)",
          "수정 / 삭제 버튼(작성자·관리자)",
        ],
        techSpec: "`BGNJ_COMMUNITY.createPost / updatePost / deletePost`. 권한은 작성자 본인 혹은 `user.isAdmin`. Tiptap은 `window.BGNJ_TIPTAP`으로 ESM 주입.",
        caution: "삭제는 즉시 영구 삭제. 운영 중 실수 방지를 위해 confirm() 한 번을 반드시 거치도록 유지.",
        issues: [
          "Tiptap이 첫 마운트보다 늦게 로드될 수 있어 `wsd-tiptap-ready` 이벤트를 기다리는 fallback을 추가",
          "임시 저장이 없어 작성 중 새로고침 시 본문 손실",
        ],
      },
      {
        name: "댓글 등록 / 삭제",
        status: "부분 구현",
        summary: "게시글에 댓글을 달고 본인/관리자 권한으로 삭제.",
        elements: [
          "입력 폼",
          "댓글 리스트",
          "삭제 버튼",
          "답글(트리) — 미구현",
          "멘션 — 미구현",
        ],
        techSpec: "`BGNJ_STORES.comments[postId]` 배열. push / filter로 처리.",
        caution: "포스트 ID당 단일 배열이라 댓글 수가 많아지면 페이지네이션 구조 확장 필요.",
        issues: ["게시글의 `replies` 카운트가 댓글 배열 길이와 어긋날 수 있어 normalize 시점에 동기화"],
      },
      {
        name: "조회수 저장",
        status: "부분 구현",
        summary: "게시글 상세 진입 시 조회수 카운트.",
        elements: [
          "조회수 카드",
          "본인 자동 카운트 방지 — 미구현",
          "유닛 테스트 — 미구현",
        ],
        techSpec: "상세 진입 시 `views += 1` 후 `BGNJ_SAVE.communityPosts()` 호출.",
        caution: "동일 사용자 새로고침 시 중복 카운트 발생. 운영 수치로는 신뢰도가 낮음.",
        issues: [],
      },
      {
        name: "이미지 첨부",
        status: "부분 구현",
        summary: "본문에 이미지를 끼워 넣음.",
        elements: [
          "드롭존",
          "Tiptap Image 확장",
          "Dropcursor",
        ],
        techSpec: "이미지를 base64로 인코딩해 본문 HTML에 직접 삽입. localStorage에 같이 저장됨.",
        caution: "1~2MB 이미지 몇 개만 올려도 localStorage quota(5~10MB)에 빠르게 도달 → 외부 스토리지 필요.",
        issues: ["base64 저장으로 운영 중 quota 초과 케이스가 보고됨"],
      },
      {
        name: "카테고리 접근 제한",
        status: "부분 구현",
        summary: "특정 카테고리(예: 운영진 공지)는 권한이 있는 사용자만 글을 쓰거나 보도록 제한.",
        elements: [
          "카테고리 정의(`boardType`, `requiresLogin`, `requiresAdmin`)",
          "게이트 컴포넌트",
        ],
        techSpec: "`BGNJ_STORES.categories` 메타에 권한 플래그 보유, 컴포넌트 단에서 검사.",
        caution: "클라이언트 단 검사라 외부 DB 도입 시 서버 측 권한 정책을 별도로 가져가야 함.",
        issues: [],
      },
      {
        name: "관리자 게시글 운영",
        status: "구현됨",
        summary: "관리자 화면에서 같은 저장소를 검색/필터/CSV/삭제로 운영.",
        elements: [
          "검색 입력",
          "분류 필터(카테고리)",
          "CSV 다운로드(좋아요 수 포함)",
          "행 단위 열기·삭제",
        ],
        techSpec: "`BGNJ_COMMUNITY.exportCsv()` + `BGNJ_COMMUNITY.deletePost(id)`. 사용자 화면과 동일 저장소.",
        caution: "관리자 삭제는 즉시 사용자 화면에 반영되므로 confirm 필수.",
        issues: ["P1 시점에 관리자 탭이 mock 배열을 보던 문제 → P2에서 통합"],
      },
      {
        name: "좋아요 / 공감",
        status: "구현됨",
        summary: "글 상세에서 ♥ 버튼으로 공감을 누르고 누른 사람 목록을 글에 보존.",
        elements: [
          "♥ 토글 버튼(상태별 골드 강조)",
          "공감 카운트(헤더 + 액션 영역 + 목록 인디케이터)",
          "비로그인 시 로그인 유도 confirm",
          "본인 두 번 누름 → 취소(토글)",
        ],
        techSpec: "`BGNJ_COMMUNITY.toggleLike(postId, userId)` → `post.likes`(userId 배열). `hasLiked / getLikes`로 상태 조회. 글 저장 시 같이 직렬화.",
        caution: "좋아요 카운트는 배열 길이로 계산하므로 동일 userId가 중복으로 들어가지 않도록 toggleLike에서 보호.",
        issues: [],
      },
      {
        name: "북마크",
        status: "구현됨",
        summary: "글 상세에서 ☆ 버튼으로 북마크하고 마이페이지에서 모아 보기.",
        elements: [
          "☆/★ 토글 버튼",
          "목록 제목 옆 ★ 인디케이터(본인 북마크된 글)",
          "마이페이지 BOOKMARKS 카드(최대 8건 + 외 N건 표시)",
          "비로그인 시 로그인 유도 confirm",
        ],
        techSpec: "`BGNJ_STORES.bookmarks` = `{ userId: [postId, ...] }`. `BGNJ_COMMUNITY.toggleBookmark / isBookmarked / getBookmarks / listBookmarkedPosts`.",
        caution: "북마크된 글이 삭제되면 ID는 남되 `getPost`에서 null이 반환되어 마이페이지에서는 자동으로 누락됨.",
        issues: [],
      },
      {
        name: "신고 운영 큐",
        status: "구현됨",
        summary: "사용자가 글을 신고하면 관리자 콘텐츠 메뉴 `신고` 탭에서 처리.",
        elements: [
          "글 상세 신고 버튼(클릭 시 사유 입력 폼 펼침)",
          "사유 textarea + 접수 confirmation",
          "관리자 신고 탭(필터: 미처리 / 처리 완료 / 반려 / 전체)",
          "신고 카드(제목 / 사유 / 신고자 / 시각 / 상태 배지)",
          "액션 버튼: 게시글 열기 / 처리 완료 / 반려 / 게시글 삭제+처리",
        ],
        techSpec: "`BGNJ_STORES.reports` 배열. `BGNJ_COMMUNITY.addReport / listReports(filter) / updateReportStatus / countOpenReports`. 상태: open / resolved / dismissed.",
        caution: "신고된 후 게시글을 직접 삭제해도 신고 레코드는 남는다(이력 보존). 게시글이 사라지면 '게시글 열기' 버튼은 빈 상세를 보여줄 수 있음.",
        issues: [],
      },
      {
        name: "댓글 알림 / 알림 벨",
        status: "구현됨",
        summary: "내 글에 다른 사람이 댓글을 달면 알림이 쌓이고 내비게이션 ◇ 벨에 미읽음 카운트가 표시.",
        elements: [
          "내비게이션 ◇ 벨 버튼(미읽음 배지)",
          "벨 드롭다운(최근 50건, 미읽음 강조)",
          "모두 읽음 버튼",
          "알림 클릭 → 게시글로 이동(읽음 처리)",
          "마이페이지 NOTIFICATIONS 카드(최근 6건 + 외 N건)",
        ],
        techSpec: "`BGNJ_STORES.notifications` = `{ userId: [ {id, type, postId, postTitle, fromName, message, createdAt, read} ] }`. 댓글 등록 시 `addNotification(post.authorId, ...)` 호출(본인 글 제외, authorId 있을 때만). 게시글 점프는 `sessionStorage.bgnj_pending_post_id` 후 `go('community')`.",
        caution: "본인 글에는 알림이 가지 않도록 commenter ↔ author 비교 필수. 시드 글처럼 authorId가 없는 글에는 알림이 발행되지 않음.",
        issues: ["라우팅이 글로벌 App 상태에 묶여 있어 외부 진입 시 sessionStorage 경유 패턴을 사용"],
      },
      {
        name: "회원 등급 배지",
        status: "구현됨",
        summary: "글 목록 / 글 상세 / 댓글의 작성자 옆에 등급 라벨을 컬러 배지로 표시.",
        elements: [
          "AuthorGradeBadge 공통 컴포넌트(`Shell.jsx`)",
          "글 목록 작성자 컬럼",
          "글 상세 작성자 메타",
          "댓글 작성자 라벨",
        ],
        techSpec: "`BGNJ_USER_GRADE(user)` + `BGNJ_AUTHOR_GRADE({authorId, author, authorEmail})`. 등급 색상은 `BGNJ_STORES.grades`의 `color`.",
        caution: "시드 글 작성자(돌담아래 등)는 가입 사용자가 아니므로 배지가 표시되지 않음. 추후 시드 데이터를 가입 회원과 매칭하면 자동으로 채워짐.",
        issues: [],
      },
    ],
    techSpec: "`BGNJ_COMMUNITY` helper + `BGNJ_STORES.communityPosts / comments / categories / bookmarks / reports / notifications` localStorage. 외부 DB 교체 시 helper는 유지하고 저장소 구현만 교체.",
    cautions: [
      "localStorage 한계 → 이미지·알림·신고 누적 시 quota 초과",
      "권한 검사가 클라이언트 단 → 외부 DB 도입 시 서버 측 정책 필수",
      "사용자 화면 ↔ 관리자 화면이 같은 저장소를 본다는 가정이 P2 통합의 핵심이므로 깨지지 않게 유지",
      "라우팅은 글로벌 App 상태에 묶여 있어 외부 진입 시 `sessionStorage.bgnj_pending_post_id` 패턴을 사용",
    ],
    issues: [
      "사용자 작성 글 / 시드 글이 다른 키에 저장되어 있던 P1 → `ensureCommunityPostsSeeded`로 마이그레이션",
      "관리자와 사용자 화면이 다른 mock 배열을 보던 P1 → `BGNJ_COMMUNITY` 단일 helper로 수렴",
      "Cycle 1에서 좋아요/북마크/신고/알림/등급 배지/페이지네이션을 한 PR에 묶음. 데이터 모델 6개를 동시에 도입하느라 helper 수가 크게 늘어났으므로, 다음 도메인 작업에서는 helper 명명을 `BGNJ_<DOMAIN>` 단위로 묶을지 재검토 필요",
    ],
  },
  {
    id: "lecture",
    number: "02",
    label: "강연 일정",
    title: "미션 2 — 뱅기노자 강연 일정 안내",
    role: "공개 / 심화 / 현장 강연 일정을 알리고 신청·입금·확정까지 운영.",
    routes: ["lectures(목록·상세·신청)", "home(노출)", "mypage(내 신청 강연)", "admin > 강연(운영 명단)", "admin > 설정(계좌번호)"],
    status: "Cycle 3 마무리(기능 ~70%)",
    evaluation: "Cycle 3에서 강연이 '알리기'에서 '신청 → 입금 → 확정'까지 닫혔다. 회원만 신청 가능하고, 무료는 즉시 확정, 유료는 무통장 입금을 받아 관리자가 확인하면 참가 확정으로 전환된다. 정원이 차면 자동 대기열, 취소 시 다음 대기자가 자동 승격된다. .ics 캘린더 다운로드와 URL 해시 딥 링크(`#lecture-{id}`)도 들어갔다.",
    missing: [
      "PG 결제 (현재는 무통장 입금만; 추후 도입 예정)",
      "D-1 알림 · 변경 알림 (이메일 / 푸시 인프라 필요)",
      "참가자 체크인 · 출석 이력",
      "강연 후 자료 보관함 (영상 · PDF · 발표자료)",
      "강연자 프로필 페이지 / 시리즈 묶음",
      "강연 후기 · 평점",
      "관리자 강연 신규 등록 (현재는 시드 강연 수정만 지원)",
    ],
    features: [
      {
        name: "강연 목록 / 상세 / 잔여 좌석 표시",
        status: "구현됨",
        summary: "공개 / 심화 / 현장 강연을 카드로 보여주고 클릭 시 상세에서 정원·잔여·대기 인원·참가비를 함께 노출.",
        elements: [
          "강연 카드(라벨 / 다음 일정 / 주제 / 장소 / 진행 / 정원 / 잔여 또는 대기)",
          "FREE / 무통장 입금 배지",
          "내 신청 인디케이터(상태 라벨 동시 표시)",
          "상세 헤더 6 메타(일정·장소·진행·정원·잔여·참가비)",
        ],
        techSpec: "`BGNJ_LECTURES.listAll() / getLecture / getSeats`. 시드는 `BANGINOJA_DATA.lectures`, 관리자가 수정한 항목은 `BGNJ_STORES.lectureOverrides`에 저장 후 머지.",
        caution: "잔여석은 `capacity - 활성(취소 제외) 비대기 등록 합` 으로 즉시 계산하므로 시드의 `seats` 텍스트는 더 이상 운영 수치로 사용하지 않음(표시 폴백용).",
        issues: [],
      },
      {
        name: "강연 신청 — 무료 즉시 확정 / 유료 무통장 입금",
        status: "구현됨",
        summary: "회원만 신청 가능. 정원이 남으면 무료는 즉시 `confirmed`, 유료는 `pending_payment`. 정원이 차면 `waitlist`.",
        elements: [
          "이름 / 이메일 / 연락처 / 인원 / 메모",
          "합계 표시(인원 × 참가비)",
          "정원 부족 시 대기자 자동 안내",
          "비로그인 시 회원가입·로그인 진입 카드",
          "신청 후 본인 상태 카드 + 입금 안내(유료) + .ics 다운로드 + 신청 취소",
        ],
        techSpec: "`BGNJ_LECTURES.register({lectureId, userId, name, email, phone, count, note})`. 같은 사용자가 같은 강연에 두 번 신청 못 하도록 `hasUserRegistered`로 가드. 취소 시 `_promoteWaitlist`가 자동 실행되어 가장 오래된 대기자를 승격.",
        caution: "한 사용자가 한 강연에 한 건만 가질 수 있다(취소 후 재신청은 가능). 인원 수는 1 이상, 정원 이하.",
        issues: ["기존 시드 데이터의 'seats' 텍스트는 실제 정원/잔여 계산과 무관하므로 운영자에게는 혼선이 될 수 있음 — 관리자 강연 탭에서 직접 capacity 값을 수정하도록 안내 필요"],
      },
      {
        name: "관리자 입금 확인 → 참가 확정",
        status: "구현됨",
        summary: "관리자 콘텐츠 메뉴 `강연` 탭에서 신청 명단을 보고 입금 확인 / 확정 취소 / 신청 취소를 직접 처리.",
        elements: [
          "강연별 헤더(잔여 / 대기 / 가격)",
          "강연 정보 수정(제목·주제·장소·진행·시작·소요·정원·가격·메모)",
          "참가자 표(이름·이메일·연락처·인원·상태·입금 여부)",
          "액션: `입금 확인 → 확정` / `확정 취소` / `취소`",
        ],
        techSpec: "`BGNJ_LECTURES.confirmPayment(lectureId, registrationId)` → `paid: true`, `status: 'confirmed'`. `unconfirmPayment`로 되돌릴 수 있음. `cancelRegistration`은 좌석을 돌려놓고 `_promoteWaitlist` 실행.",
        caution: "확정 취소 후 좌석은 즉시 풀려 다음 대기자가 자동 승격됨. 의도치 않은 환불 분쟁을 막으려면 입금 환불 후에만 확정 취소를 누를 것.",
        issues: [],
      },
      {
        name: "관리자 계좌번호 설정 (관리자 > 설정)",
        status: "구현됨",
        summary: "강연 신청 시 사용자에게 노출되는 무통장 입금 계좌를 관리자 콘솔에서 입력.",
        elements: [
          "은행 / 계좌번호 / 예금주",
          "안내 메모(입금자명 규칙 등)",
          "저장 즉시 사용자 신청 화면에 반영",
        ],
        techSpec: "`BGNJ_LECTURES.getBankAccount() / saveBankAccount(payload)` → `BGNJ_STORES.bankAccount`. 비어 있으면 사용자 신청 시 '운영자에게 문의' 안내.",
        caution: "민감 정보(계좌)이므로 관리자 외에는 접근하지 못해야 함. 현재는 관리자 라우트 자체가 `user.isAdmin` 가드.",
        issues: [],
      },
      {
        name: "마이페이지 내 신청 강연",
        status: "구현됨",
        summary: "로그인 사용자에게 본인이 신청한 강연을 상태별로 카드 리스트로 노출.",
        elements: [
          "강연 주제 / 다음 일정 / 인원 / 상태(입금 대기 / 참가 확정 / 대기자 / 취소)",
          "카드 클릭 → 강연 상세로 이동",
          "최대 4건 + '외 N건'",
        ],
        techSpec: "`BGNJ_LECTURES.listMyRegistrations(user.id)`로 모든 강연을 가로지르며 본인 등록만 모음. 강연 점프는 `sessionStorage.bgnj_pending_lecture_id` 패턴 사용.",
        caution: "신청 후 강연이 삭제되면 카드의 강연 정보가 비어 보일 수 있음.",
        issues: [],
      },
      {
        name: ".ics 캘린더 다운로드",
        status: "구현됨",
        summary: "강연 시작 시각·소요 시간·장소·메모를 담은 표준 .ics 파일을 즉시 내려받기.",
        elements: [
          "상세에서 `캘린더 추가 (.ics)` 버튼",
          "신청 후 본인 상태 카드에서도 다운로드 가능",
        ],
        techSpec: "`BGNJ_LECTURES.generateIcs(lecture)` → RFC 5545 형식 문자열. `downloadIcs(lectureId)`가 Blob을 만들어 클릭 다운로드.",
        caution: "`startsAt` ISO + `durationMinutes`가 있어야 정상 생성됨. 운영자가 강연을 새로 만들 때 두 필드를 채우도록 강제할 것.",
        issues: [],
      },
      {
        name: "URL 해시 딥 링크 / 홈 카드 연결",
        status: "구현됨",
        summary: "`#lecture-{id}`로 강연 상세를 외부 공유. 홈 강연 카드 클릭은 `lectures` 라우트로 직접 점프.",
        elements: [
          "App `applyHash`가 `#lecture-{id}` 매칭 시 `lectures` 라우트로 이동 + sessionStorage 셋",
          "홈 강연 카드 onClick → `bgnj_pending_lecture_id` + `go('lectures')`",
        ],
        techSpec: "`index.html` App `useEffect` 라우트 해시 + `sessionStorage` 페치. 강연 페이지 mount에서 pending id 읽고 setSelectedId.",
        caution: "라우트가 글로벌 App 상태에 묶여 있어 외부 진입은 sessionStorage 패턴을 그대로 따른다.",
        issues: [],
      },
    ],
    techSpec: "`BGNJ_LECTURES` helper + `BANGINOJA_DATA.lectures`(시드) + `BGNJ_STORES.lectureOverrides`(관리자 수정분 머지) + `BGNJ_STORES.lectureRegistrations`(`{lectureId: registration[]}`) + `BGNJ_STORES.bankAccount`. 회원 식별은 `user.id`, 결제 정책은 `price === 0` 분기.",
    cautions: [
      "회원만 신청 가능 — 비회원에게는 회원가입/로그인 진입 카드를 노출하고 폼 자체를 막음",
      "결제 도입은 '무통장 입금 → 관리자 입금 확인 → 참가 확정' 단계까지만 (PG는 후속)",
      "정원·대기열은 클라이언트에서 즉시 계산되므로, 외부 DB 도입 시 서버 측 동시성 처리(예: 행 잠금)가 추가로 필요",
      "계좌번호는 관리자 외 노출 금지. `BankAccountPanel`은 관리자 라우트 안에서만 렌더",
    ],
    issues: [
      "기존 seed `seats` 텍스트는 실제 잔여와 어긋날 수 있음 — 운영자는 관리자 강연 탭에서 capacity 직접 관리",
      "예약 발행 칼럼처럼, 강연 일정도 진입 시점에 자동 정리(`_promoteWaitlist`)가 돌므로 사이트 미진입 기간에는 대기 → 확정 자동 승격이 지연될 수 있음",
    ],
  },
  {
    id: "column",
    number: "03",
    label: "뱅기노자 칼럼",
    title: "미션 3 — 뱅기노자 칼럼 공유",
    role: "뱅기노자의 글을 공개해 브랜드 신뢰와 깊이를 만드는 콘텐츠 영역.",
    routes: ["column(공개)", "home(추천)", "admin > 칼럼 / 칼럼 작성(운영)"],
    status: "Cycle 2 마무리(기능 ~80%)",
    evaluation: "Cycle 2에서 칼럼 운영의 일상 흐름을 닫았다. 임시 저장·예약 발행·발행 취소로 작성 사이클을 안전하게 가져갈 수 있고, 좋아요·공유 링크·댓글로 독자와의 상호작용이 생겼으며, 검색·카테고리 아카이브와 추정 읽기 시간 자동 계산으로 아카이브로서의 가치가 올라갔다. URL 해시 딥 링크(`#col-{id}`)로 칼럼이 외부 공유 가능한 자산이 되었다.",
    missing: [
      "이메일 · 웹 푸시 구독, 신규 칼럼 알림 (외부 발송 인프라 필요)",
      "RSS / Atom 피드 (정적 배포 빌드 파이프라인이 들어와야 가능)",
      "작성자 프로필 카드 · 관련 글 자동 추천",
      "열람 통계 / 좋아요 통계 운영 화면 (대시보드 연결)",
      "시리즈 묶음 인덱스",
      "북마크 (커뮤니티에는 있으나 칼럼은 미적용)",
    ],
    features: [
      {
        name: "공개 칼럼 목록 / 검색 / 카테고리 아카이브",
        status: "구현됨",
        summary: "기본 칼럼 + 관리자 발행(published) 칼럼을 병합해 카드 그리드로 노출. 제목·발췌·본문 검색과 카테고리 필터로 좁혀 보기.",
        elements: [
          "검색 입력(제목·발췌·본문 부분 일치)",
          "카테고리 토글 버튼(전체 + 데이터에서 자동 추출)",
          "카드(카테고리·읽기시간·♥ 카운트·조회수)",
          "총 N개 / 카테고리 / 검색어 인디케이터",
          "피처 칼럼 1건 + 보조 4건(홈)",
        ],
        techSpec: "`BGNJ_COLUMNS.searchPublic({query, category})` → `BGNJ_COLUMNS.listPublic()`(자동 promote 후 published만) + 검색 필터. 시드 + 사용자 발행 모두 동일 객체 형태.",
        caution: "검색은 본문 텍스트 기준이며 HTML 태그는 비교에서 제외됨 (`body.text`).",
        issues: [],
      },
      {
        name: "칼럼 상세 — 본문 / 공감 / 공유 / 댓글",
        status: "구현됨",
        summary: "제목·메타·본문·공감·공유 링크·댓글 흐름을 단일 페이지에서 처리.",
        elements: [
          "제목 / 카테고리 / 날짜 / 추정 읽기 시간(자동) / 조회 / 공감 / 댓글 카운트",
          "본문 HTML(에디터 직렬화 결과 또는 시드 fallback)",
          "♥ 공감 토글(로그인 사용자별, 시드 칼럼도 가능)",
          "공유 링크 복사(`#col-{id}` 해시 포함, 클립보드 + 토스트)",
          "댓글 등록 / 삭제(작성자·관리자) / 등급 배지",
          "이전·다음 칼럼 네비게이션",
        ],
        techSpec: "`BGNJ_COLUMNS.getColumn / getLikes / hasLiked / toggleLike / getViews / incrementViews / listComments / addComment / deleteComment`. 좋아요·조회수는 `BGNJ_STORES.columnEngagement` 맵에 통합 저장. 댓글은 `BGNJ_COMMUNITY.comments`를 `col-{id}` 키로 재사용.",
        caution: "관리자가 임의 HTML을 넣을 수 있으므로 에디터 정책으로 차단. 사용자 입력에는 절대 dangerouslySetInnerHTML 적용 금지.",
        issues: [
          "Tiptap 본문이 HTML로 직렬화되어 저장되므로 어떤 확장이 활성화돼 있는지를 같이 관리해야 함",
          "라우팅이 글로벌 App 상태에 묶여 있어 외부 진입은 `sessionStorage.bgnj_pending_column_id` + `#col-{id}` 해시 조합 사용",
        ],
      },
      {
        name: "관리자 칼럼 작성 — 임시 저장 / 예약 발행 / 즉시 발행 / 발행 취소 / 수정",
        status: "구현됨",
        summary: "Tiptap 에디터에 임시 저장·예약 발행·즉시 발행 흐름을 붙이고, 기존 칼럼을 수정 폼으로 다시 불러오기.",
        elements: [
          "Tiptap StarterKit + Image + Link + Typography (column preset)",
          "카테고리 select",
          "발췌 textarea(비우면 본문 앞부분 자동 추출)",
          "예약 시각(datetime-local)",
          "추정 읽기 시간 + 본문 자수 미터",
          "버튼: 초기화 / 임시 저장 / 예약 발행 / 즉시 발행",
          "필터(전체/발행/예약/임시) + 상태 배지(DRAFT/SCHEDULED/PUBLISHED) + 수정 / 발행 취소 / 삭제",
        ],
        techSpec: "`BGNJ_COLUMNS.saveColumn(payload)` — `id`(신규/기존 동일 키), `status`('draft'|'scheduled'|'published'), `publishAt`(예약 시), `publishedAt`(즉시 발행 시), `updatedAt` 자동. 페이지 진입마다 `_autoPromote()`가 시간 지난 예약을 published로 승격.",
        caution: "예약 시각은 현재보다 미래여야 하며, datetime-local은 로컬 타임존을 그대로 저장하므로 운영자 PC 시계 기준으로 동작함을 명심.",
        issues: ["발행 취소는 임시 저장 상태로 되돌리며, 칼럼 콘텐츠는 보존되지만 공개에서는 즉시 사라짐"],
      },
      {
        name: "홈 추천 칼럼",
        status: "구현됨",
        summary: "메인 홈에 published 사용자 칼럼 + 시드를 묶어 피처 1 + 사이드 4 노출.",
        elements: ["피처 카드 1", "사이드 4건"],
        techSpec: "`BGNJ_COLUMNS.listPublic()`의 상위 항목 사용. draft/scheduled은 자동 제외.",
        caution: "추천 알고리즘이 없어 항상 최신 5건이 노출됨.",
        issues: [],
      },
    ],
    techSpec: "`BGNJ_COLUMNS` helper + `BGNJ_STORES.userColumns`(콘텐츠) + `BGNJ_STORES.columnEngagement`(좋아요·조회수) + `BGNJ_STORES.comments['col-{id}']`(댓글). 시드는 `BANGINOJA_DATA.columns`에서 병합.",
    cautions: [
      "공개 정렬은 사용자 발행 → 시드 순서로 spread (사용자 발행 글이 위로)",
      "본문 HTML 신뢰 범위는 '관리자 입력에 한함'으로 유지",
      "예약 발행은 클라이언트 시계 기준 — 외부 DB 도입 시 서버 시계로 옮겨야 함",
    ],
    issues: [
      "Tiptap 확장 변경이 본문 저장 호환성에 영향을 주므로, 확장 추가/제거 시 기존 본문 호환성 테스트 필요",
      "예약 발행 promote가 클라이언트 진입 시점에 실행되므로 사용자가 사이트에 들어와야 비로소 공개됨 (서버 크론 부재)",
    ],
  },
  {
    id: "tour",
    number: "04",
    label: "투어 프로그램",
    title: "미션 4 — 뱅기노자 투어 프로그램 판매·운영",
    role: "뱅기노자가 진행하는 궁궐 답사·역사 답사 프로그램을 신청·운영.",
    routes: ["tour(목록·상세·예약)", "home(노출)", "mypage(내 답사 내역)", "admin > 투어 프로그램(운영 명단)", "admin > 설정(계좌번호)"],
    status: "Cycle 5 마무리(기능 ~70%)",
    evaluation: "Cycle 5에서 카탈로그였던 투어가 회원 전용 신청 → 무통장 입금 → 관리자 입금 확인 → 참가 확정 사이클로 닫혔다. 강연과 같은 패턴(`BGNJ_TOURS` 신설)으로 정원/대기열 자동 처리, .ics 캘린더 다운로드, URL 해시 딥 링크(`#tour-{id}`)까지 동시에 도입. 결제·계좌 저장소는 강연/책과 모두 공유.",
    missing: [
      "PG 결제(현재는 무통장 입금만)",
      "환불·취소 정책 자동화",
      "체크인 · 출석 이력",
      "이미지 갤러리(현재 카드 한 장)",
      "지도 · 집결지 안내 · 우천 시 운영 정책",
      "프로그램 후기 · 평점",
      "외국어 안내(영문) 옵션",
      "관리자 신규 투어 등록(현재는 시드 투어 수정만)",
      "이메일/문자 알림(현재는 사이트 내 알림만)",
    ],
    features: [
      {
        name: "투어 목록 / 탭 / 잔여 좌석 표시",
        status: "구현됨",
        summary: "프로그램별 탭 + 카드형 목록. 잔여석/대기 인원이 실시간 계산.",
        elements: [
          "탭(프로그램명 분리) / 강조",
          "상세(기간 · 인원 · 난이도 · 다음 일정 · 가격 · 설명 · 답사 일정 · 준비물)",
          "FREE / 무통장 입금 배지",
        ],
        techSpec: "`BGNJ_TOURS.listAll()` (시드 + `BGNJ_STORES.tourOverrides` 머지). 잔여는 `getSeats(tourId)`로 즉시 계산.",
        caution: "기존 시드의 `group` 텍스트('12인 이하')와 신규 `capacity` 숫자가 분리되어 있으니 운영자는 capacity 수정에 주의.",
        issues: [],
      },
      {
        name: "투어 신청 — 무료 즉시 확정 / 유료 무통장 입금",
        status: "구현됨",
        summary: "회원 전용. 정원이 남으면 무료는 즉시 confirmed, 유료는 pending_payment. 정원이 차면 waitlist 자동 등록.",
        elements: [
          "이름 / 이메일 / 연락처 / 인원 / 메모 폼(사이드바)",
          "합계 표시 + 정원 부족 시 대기자 안내",
          "본인 상태 카드(취소 / .ics 다운로드 + 무통장 입금 안내)",
          "비로그인 시 회원가입 진입 안내",
        ],
        techSpec: "`BGNJ_TOURS.reserve(tourId, payload)`. `hasUserReserved`로 중복 방지. 취소 시 `_promoteWaitlist`가 자동 실행되어 대기자 자동 승격(승격 시 본인에게 알림 푸시).",
        caution: "한 회원 = 한 투어 = 한 건. 취소 후 재신청은 가능. 인원은 1~capacity 범위.",
        issues: ["기존 시드 `group` 텍스트는 운영 정원과 무관 — 관리자 투어 탭에서 capacity를 직접 관리할 것"],
      },
      {
        name: "관리자 입금 확인 → 참가 확정",
        status: "구현됨",
        summary: "관리자 콘텐츠 메뉴 `투어 프로그램` 탭에서 신청 명단을 보고 입금 확인 / 확정 취소 / 신청 취소.",
        elements: [
          "투어별 헤더(잔여 / 대기 / 가격)",
          "투어 정보 수정(제목·일정·소요·정원·가격·메모·설명)",
          "참가자 표(이름·이메일·연락처·인원·상태·입금 여부)",
          "액션: `입금 확인 → 확정` / `확정 취소` / `취소`",
        ],
        techSpec: "`BGNJ_TOURS.confirmPayment / unconfirmPayment / cancelReservation`. 확정 시 본인에게 자동 알림 푸시.",
        caution: "확정 취소 후 좌석은 즉시 풀려 다음 대기자가 자동 승격됨. 환불 후에만 누를 것.",
        issues: [],
      },
      {
        name: "마이페이지 내 답사 신청",
        status: "구현됨",
        summary: "로그인 사용자에게 본인이 신청한 답사를 상태별 카드 리스트로 노출.",
        elements: [
          "프로그램 / 다음 일정 / 인원 / 상태(입금 대기 / 참가 확정 / 대기자 / 취소)",
          "카드 클릭 → 투어 상세로 이동",
          "최대 4건 + '외 N건'",
        ],
        techSpec: "`BGNJ_TOURS.listMyReservations(user.id)`로 모든 투어를 가로지르며 본인 신청만 모음. 점프는 `sessionStorage.bgnj_pending_tour_id` 패턴 사용.",
        caution: "투어가 삭제되면 카드의 투어 정보가 비어 보일 수 있음.",
        issues: [],
      },
      {
        name: ".ics 캘린더 다운로드",
        status: "구현됨",
        summary: "투어 시작 시각·소요 시간·장소·설명을 담은 표준 .ics 파일 다운로드.",
        elements: ["투어 사이드바 `캘린더에 추가 (.ics)` 버튼", "본인 상태 카드에서도 가능"],
        techSpec: "`BGNJ_TOURS.generateIcs(tour)` → RFC 5545 형식. `downloadIcs(tourId)`가 Blob을 만들어 클릭 다운로드.",
        caution: "`startsAt` ISO + `durationMinutes`가 있어야 정상 생성됨.",
        issues: [],
      },
      {
        name: "URL 해시 딥 링크 / 마이페이지 점프",
        status: "구현됨",
        summary: "`#tour-{id}`로 투어 상세를 외부 공유. 마이페이지·알림에서 sessionStorage 경유로 점프.",
        elements: ["App `applyHash`가 `#tour-{id}` 매칭 시 `tour` 라우트 + sessionStorage 셋"],
        techSpec: "`index.html` App `useEffect` 라우트 해시 + `sessionStorage`. TourPage mount에서 pending id 읽고 selectedIdx 복원.",
        caution: "라우트가 글로벌 App 상태에 묶여 있어 외부 진입은 sessionStorage 패턴을 그대로 따른다.",
        issues: [],
      },
    ],
    techSpec: "`BGNJ_TOURS` helper + `BANGINOJA_DATA.tours`(시드) + `BGNJ_STORES.tourOverrides`(관리자 수정분 머지) + `BGNJ_STORES.tourReservations`(`{tourId: reservation[]}`) + `BGNJ_STORES.bankAccount`(강연·책과 공유). 결제 정책은 `priceNumber === 0` 분기.",
    cautions: [
      "회원 전용 — 비로그인은 신청 폼에 진입할 수 없음(로그인 진입 confirm)",
      "결제는 무통장 입금만 (PG는 후속 사이클)",
      "정원·대기열은 클라이언트에서 즉시 계산되므로, 외부 DB 도입 시 서버 측 동시성 처리 필요",
      "강연·책과 같은 계좌 저장소를 공유하므로 한 곳에서 변경하면 모든 결제 경로에 반영",
    ],
    issues: [
      "기존 seed `group` 텍스트(예: '12인 이하')는 capacity와 별도로 표시 — 자동 동기화는 미구현",
      "예약 시각이 운영자 PC 시계 기준이라, 외부 DB 도입 시 서버 시계로 옮겨야 함",
    ],
  },
  {
    id: "book",
    number: "05",
    label: "왕의길",
    title: "미션 5 — 뱅기노자 책 판매",
    role: "뱅기노자의 책 『왕의길』을 소개하고 회원 전용 무통장 입금으로 판매·발송 운영.",
    routes: ["book(상세)", "checkout(주문)", "home(CTA)", "mypage(내 주문 내역)", "admin > 왕의길(주문 운영)", "admin > 설정(계좌번호)"],
    status: "Cycle 4 마무리(기능 ~65%)",
    evaluation: "Cycle 4에서 책이 '카탈로그+체크아웃 UI'에서 '실제 주문 → 입금 → 발송 → 배송 완료' 사이클로 닫혔다. 회원만 주문 가능하며, 무통장 입금 후 관리자가 입금을 확인하면 발송 준비로 넘어가고, 송장 입력 후 배송중 → 배송 완료까지 단계가 진행된다. 강연과 동일한 계좌(`bankAccount`) 저장소를 공유하므로 설정이 통합돼 있다. 결제 게이트웨이·재고·영수증·환불은 다음 단계.",
    missing: [
      "결제 게이트웨이(PG) 연동",
      "재고 관리 · 품절 표시",
      "영수증 / 세금계산서 발행",
      "환불 · 교환 자동 흐름",
      "독자 리뷰 · 평점",
      "교차 판매(투어 / 강연 패키지)",
      "쿠폰 · 회원 등급 할인",
      "장바구니 영속성(현재 메모리 → 결제 진입 직전까지만 유지)",
      "이메일 영수증 / 발송 알림",
    ],
    features: [
      {
        name: "책 상세",
        status: "구현됨",
        summary: "책 한 권의 모든 메타 정보를 한 화면에서 노출 + 판본·수량 선택 후 결제로 진입.",
        elements: [
          "표지 / 저자 / 출판사 / ISBN / 페이지 수",
          "국문 / 영문 가격, 판본 토글, 수량 ±",
          "챕터 목차 / 저자 / 리뷰 탭",
          "바로 구매 → 체크아웃 라우트로 이동",
        ],
        techSpec: "`BANGINOJA_DATA.book` 정적 객체를 `BookPage`가 렌더. 판본/수량은 메모리 `cart` 상태로 보관 후 결제 페이지에 전달.",
        caution: "ISBN과 가격은 정적이라 출판사 정책 변경 시 코드 갱신 필요.",
        issues: [],
      },
      {
        name: "체크아웃 — 회원 전용 + 무통장 입금 단일 흐름",
        status: "구현됨",
        summary: "비회원은 차단되고, 회원은 배송 정보 입력 후 주문 접수. 결제 수단은 무통장 입금만.",
        elements: [
          "비로그인 안내 카드(로그인/회원가입 진입)",
          "받는 분 / 연락처 / 주소 / 상세 주소 / 배송 메모",
          "결제 수단 카드 — 무통장 입금 안내 + 운영자 계좌(없으면 차단)",
          "주문 요약 사이드바(상품·배송비·총액·운영 안내)",
          "주문 완료 화면(주문번호·계좌·금액·배송지 한 페이지 요약)",
        ],
        techSpec: "`BGNJ_BOOK_ORDERS.createOrder({userId, version, qty, recipient, phone, address, addressDetail, memo})` → 주문 생성 시 `BGNJ_STORES.bookOrders`에 push. 계좌는 `BGNJ_LECTURES.getBankAccount()`로 강연과 공유. 주문번호는 `WSD-YYYYMMDD-NNN` 시퀀스.",
        caution: "운영자 계좌가 비어 있으면 주문 버튼이 비활성화되어 결제 자체가 막힌다. 강연과 같은 계좌 저장소이므로 강연·책 어느 한 곳에서 설정해도 양쪽에 반영됨.",
        issues: ["장바구니가 휘발성 메모리이므로 결제 진입 후 새로고침하면 cart가 사라짐 — 다음 단계에서 localStorage 영속화 예정"],
      },
      {
        name: "관리자 왕의길 운영 (콘텐츠 > 왕의길 탭)",
        status: "구현됨",
        summary: "주문 상태별 필터 + 입금 확인 / 송장 입력 / 발송 / 배송 완료 / 취소 + CSV 다운로드.",
        elements: [
          "필터(입금 대기/입금 확인/배송중/배송 완료/취소/전체) + 카운트",
          "주문 카드(주문번호·시각·상태 배지·상품·금액·받는 분·주소)",
          "액션: 입금 확인 → 발송 준비 / 송장 입력 + 발송 처리 / 배송 완료 / 입금 확인 취소 / 주문 취소",
          "CSV 다운로드(주문 / 회원 / 주소 / 상태 / 송장)",
        ],
        techSpec: "`BGNJ_BOOK_ORDERS.confirmPayment(id) / unconfirmPayment(id) / markShipped(id, tracking) / markDelivered(id) / cancelOrder(id) / exportCsv()`. 상태 머신: pending_payment → paid → shipped → delivered (혹은 cancelled).",
        caution: "각 단계는 운영자가 직접 클릭해야 진행됨(자동 진행 없음). 송장 번호는 발송 시 입력하고 이후 변경 불가(필요 시 코드 수정 또는 마지막 액션 reset 흐름 추가).",
        issues: [],
      },
      {
        name: "마이페이지 내 주문 내역",
        status: "구현됨",
        summary: "로그인 사용자에게 자신의 주문을 상태별 컬러 라벨로 표시.",
        elements: [
          "주문번호 / 판본 / 수량 / 총액 / 상태(입금 대기·입금 확인·배송중·배송 완료·취소)",
          "송장 번호(발송된 주문)",
          "최대 4건 + '외 N건'",
        ],
        techSpec: "`BGNJ_BOOK_ORDERS.listMine(user.id)`로 본인 주문만 모음.",
        caution: "주문이 cancelled 상태로 바뀌면 카드는 남되 컬러로 구분.",
        issues: [],
      },
      {
        name: "관리자 대시보드 카운트",
        status: "구현됨",
        summary: "관리자 대시보드 4개 KPI 중 마지막 슬롯을 '왕의길 주문'으로 교체. 입금 대기 건수 표시.",
        elements: ["전체 주문 수", "입금 대기 카운트(미처리 시 경고 색)"],
        techSpec: "`window.BGNJ_BOOK_ORDERS.listAll()` + 상태 필터.",
        caution: "필요 시 5번째 슬롯으로 카테고리/투어 등 다시 추가할 수 있음.",
        issues: [],
      },
    ],
    techSpec: "`BGNJ_BOOK_ORDERS` helper + `BGNJ_STORES.bookOrders`(주문 단일 배열) + `BGNJ_STORES.bankAccount`(강연과 공유). 주문번호는 `WSD-YYYYMMDD-NNN`. 회원 식별은 `user.id`.",
    cautions: [
      "회원 전용 — 비로그인은 결제 진입 자체를 막음",
      "결제는 무통장 입금만 (PG는 후속 사이클)",
      "강연과 같은 계좌 저장소를 공유하므로 한 곳에서 바꾸면 양쪽 모두 반영됨",
      "주문 상태는 운영자가 직접 진행 — 입금 확인은 관리자 콘솔에서만 가능",
      "현재 재고 차감이 없어 판매 수량과 무관하게 주문이 계속 생성됨 → 재고 도입 시 lock 필요",
    ],
    issues: [
      "장바구니가 휘발성이라 결제 도중 새로고침 시 cart 손실 — 다음 단계에서 localStorage 영속화",
      "국문/영문 가격이 분리되어 있어 PG 도입 시 통화별 계약을 동시에 진행해야 함",
    ],
  },
];

// === Report Queue Panel ===========================================
const ReportQueuePanel = ({ onRefresh, go }) => {
  const [filter, setFilter] = React.useState("open");
  const [tick, setTick] = React.useState(0);
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

  const removePostFromReport = (report) => {
    if (!report.postId) return;
    if (!confirm(`"${report.postTitle}" 게시글을 삭제하고 신고를 처리 완료로 표시하시겠어요?`)) return;
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
              borderColor: filter === f.key ? 'var(--gold)' : 'var(--line)',
              color: filter === f.key ? 'var(--gold)' : 'var(--ink-2)',
              background: filter === f.key ? 'rgba(212,175,55,0.06)' : 'transparent',
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
                ? 'var(--gold)'
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
                    신고자 {r.reporterName} · {new Date(r.createdAt).toLocaleString('ko-KR')}
                  </div>
                </div>
                <div style={{display:'flex', gap:8, justifyContent:'flex-end', flexWrap:'wrap'}}>
                  {r.postId && (
                    <button type="button" className="btn btn-small"
                      onClick={() => {
                        try { sessionStorage.setItem('bgnj_pending_post_id', String(r.postId)); } catch {}
                        go('community');
                      }}>게시글 열기</button>
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
    </div>
  );
};

// === Lecture Admin Panel ==========================================
const LectureAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({ title: '', topic: '', venue: '', host: '', startsAt: '', durationMinutes: 90, capacity: 30, price: 0, note: '' });
  const [refundRejectNotes, setRefundRejectNotes] = React.useState({});

  const lectures = React.useMemo(() => window.BGNJ_LECTURES.listAll({ includeHidden: true }), [tick]);

  const refresh = () => setTick((v) => v + 1);

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

  const saveEdit = () => {
    if (editingId == null) return;
    const lecture = window.BGNJ_LECTURES.getLecture(editingId);
    if (!lecture) return;
    const startsAtIso = draft.startsAt ? new Date(draft.startsAt).toISOString() : lecture.startsAt;
    const next = draft.next || lecture.next;
    window.BGNJ_LECTURES.saveLecture({
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
    setEditingId(null);
    refresh();
  };

  const addNewLecture = () => {
    const id = `lecture-${Date.now()}`;
    const now = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +1주
    const pad = (n) => String(n).padStart(2, '0');
    const startsAt = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T19:00:00+09:00`;
    const next = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} 19:00`;
    window.BGNJ_LECTURES.saveLecture({
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
    window.BGNJ_AUDIT?.log({ action: 'lecture.create', target: `lecture:${id}` });
    refresh();
    startEdit(window.BGNJ_LECTURES.getLecture(id));
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap', marginBottom:18}}>
        <p className="dim" style={{fontSize:13, lineHeight:1.8, margin:0, flex:1, minWidth:280}}>
          강연 정원 / 일정 / 가격을 수정하고, 신청자 입금을 확인해 참가를 확정합니다.
          결제는 현재 <strong className="gold">무통장 입금</strong>만 지원합니다.
          계좌번호는 <strong className="gold">시스템 → 설정</strong> 탭에서 등록합니다.
        </p>
        <button type="button" className="btn btn-gold btn-small" onClick={addNewLecture}>＋ 새 강연 추가</button>
      </div>

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
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: seats.remaining <= 0 ? 'var(--danger)' : 'var(--gold)'}}>
                      잔여 {seats.remaining} / {seats.capacity}
                    </span>
                    {seats.waitlist > 0 && <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)'}}>대기 {seats.waitlist}</span>}
                    {l.price > 0
                      ? <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)', border:'1px solid var(--line-2)', padding:'1px 6px'}}>유료 {l.price.toLocaleString()}원</span>
                      : <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--gold)', border:'1px solid var(--gold-dim)', padding:'1px 6px'}}>FREE</span>}
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
                  <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:10}}>
                    <button type="button" className="btn btn-small" onClick={() => startEdit(l)}>강연 정보 수정</button>
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
                      onClick={() => {
                        if (!confirm('이 강연을 삭제하시겠어요? 시드 강연은 자동 숨김 처리됩니다 (데이터 보존). 관리자가 추가한 강연은 완전 삭제됩니다.')) return;
                        window.BGNJ_LECTURES.deleteLecture(l.id);
                        window.BGNJ_AUDIT?.log({ action: 'lecture.remove', target: `lecture:${l.id}` });
                        refresh();
                      }}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                  </div>
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
                              r.status === 'confirmed' ? 'var(--gold)' :
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
                                    onClick={() => {
                                      if (!confirm(`${r.name} 님 신청을 취소 처리하시겠어요?`)) return;
                                      window.BGNJ_LECTURES.cancelRegistration(l.id, r.id);
                                      refresh();
                                    }}
                                    style={{borderColor:'var(--danger)', color:'var(--danger)'}}>취소</button>
                                )}
                                {r.status === 'refund_requested' && (
                                  <>
                                    <span className="mono" style={{fontSize:9, color:'#e8a020', letterSpacing:'0.15em'}}>환불신청</span>
                                    {r.refundReason && <span className="dim-2" style={{fontSize:10}}>· {r.refundReason}</span>}
                                    <button type="button" className="btn btn-small"
                                      onClick={() => { if (!confirm('환불을 승인하시겠어요?')) return; window.BGNJ_LECTURES.approveRefund(l.id, r.id); refresh(); }}
                                      style={{borderColor:'var(--gold)', color:'var(--gold)'}}>승인</button>
                                    <input className="field-input" placeholder="반려 사유"
                                      style={{padding:'4px 8px', fontSize:11, maxWidth:140}}
                                      value={refundRejectNotes[r.id] || ''}
                                      onChange={e => setRefundRejectNotes({...refundRejectNotes, [r.id]: e.target.value})}/>
                                    <button type="button" className="btn btn-small"
                                      onClick={() => { if (!confirm('환불 신청을 반려하시겠어요?')) return; window.BGNJ_LECTURES.rejectRefund(l.id, r.id, refundRejectNotes[r.id] || ''); refresh(); }}
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
    </div>
  );
};

// === Tour Admin Panel =============================================
const TourAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({});
  const [refundRejectNotes, setRefundRejectNotes] = React.useState({});
  const refresh = () => setTick((v) => v + 1);
  const tours = React.useMemo(() => window.BGNJ_TOURS.listAll({ includeHidden: true }), [tick]);

  const startEdit = (t) => {
    const startsAtLocal = (() => {
      if (!t.startsAt) return '';
      const d = new Date(t.startsAt);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })();
    setEditingId(t.id);
    setDraft({
      title: t.title || '',
      level: t.level || '입문',
      duration: t.duration || '',
      group: t.group || '',
      next: t.next || '',
      startsAt: startsAtLocal,
      durationMinutes: t.durationMinutes || 180,
      capacity: t.capacity || 12,
      priceNumber: t.priceNumber || 0,
      desc: t.desc || '',
    });
  };

  const saveEdit = () => {
    if (editingId == null) return;
    const tour = window.BGNJ_TOURS.getTour(editingId);
    if (!tour) return;
    const startsAtIso = draft.startsAt ? new Date(draft.startsAt).toISOString() : tour.startsAt;
    window.BGNJ_TOURS.saveTour({
      id: tour.id,
      title: draft.title,
      level: draft.level,
      duration: draft.duration,
      group: draft.group,
      next: draft.next || tour.next,
      startsAt: startsAtIso,
      durationMinutes: Number(draft.durationMinutes) || 180,
      capacity: Number(draft.capacity) || tour.capacity,
      priceNumber: Number(draft.priceNumber) || 0,
      price: `${(Number(draft.priceNumber) || 0).toLocaleString()}원`,
      desc: draft.desc,
    });
    setEditingId(null);
    refresh();
  };

  const addNewTour = () => {
    const id = `tour-${Date.now()}`;
    const now = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // +2주
    const pad = (n) => String(n).padStart(2, '0');
    const startsAt = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T10:00:00+09:00`;
    const next = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} 10:00`;
    window.BGNJ_TOURS.saveTour({
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
      price: '80,000원',
      desc: '답사 안내를 입력하세요.',
    });
    window.BGNJ_AUDIT?.log({ action: 'tour.create', target: `tour:${id}` });
    refresh();
    startEdit(window.BGNJ_TOURS.getTour(id));
  };

  const removeTour = (id) => {
    if (!confirm('이 투어를 삭제하시겠어요? 시드 투어는 자동 숨김 처리(데이터 보존)됩니다. 관리자가 추가한 투어는 완전 삭제됩니다.')) return;
    window.BGNJ_TOURS.deleteTour(id);
    window.BGNJ_AUDIT?.log({ action: 'tour.remove', target: `tour:${id}` });
    refresh();
  };
  const toggleTourHidden = (t) => {
    window.BGNJ_TOURS.setHidden(t.id, !t.hidden);
    window.BGNJ_AUDIT?.log({ action: t.hidden ? 'tour.unhide' : 'tour.hide', target: `tour:${t.id}` });
    refresh();
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap', marginBottom:18}}>
        <p className="dim" style={{fontSize:13, lineHeight:1.8, margin:0, flex:1, minWidth:280}}>
          투어 정원 / 일정 / 가격을 수정하고, 신청자 입금을 확인해 참가를 확정합니다.
          결제는 현재 <strong className="gold">무통장 입금</strong>만 지원합니다(강연과 같은 계좌 사용).
        </p>
        <button type="button" className="btn btn-gold btn-small" onClick={addNewTour}>＋ 새 투어 추가</button>
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
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: seats.remaining <= 0 ? 'var(--danger)' : 'var(--gold)'}}>
                      잔여 {seats.remaining} / {seats.capacity}
                    </span>
                    {seats.waitlist > 0 && <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)'}}>대기 {seats.waitlist}</span>}
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)', border:'1px solid var(--line-2)', padding:'1px 6px'}}>
                      {(t.priceNumber || 0).toLocaleString()}원
                    </span>
                  </div>
                </header>

                {isEditing ? (
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10, padding:'14px 0', borderTop:'1px solid var(--line)'}}>
                    {[
                      { k: 'title',           l: '제목',           type: 'text' },
                      { k: 'level',           l: '난이도',         type: 'text', placeholder: '입문 / 심화' },
                      { k: 'duration',        l: '소요(표시)',     type: 'text', placeholder: '3시간' },
                      { k: 'group',           l: '정원(표시)',     type: 'text', placeholder: '12인 이하' },
                      { k: 'next',            l: '표시용 일정 문구', type: 'text', placeholder: '2026.05.04 · 토' },
                      { k: 'startsAt',        l: '실제 시작(로컬)', type: 'datetime-local' },
                      { k: 'durationMinutes', l: '소요(분)',       type: 'number' },
                      { k: 'capacity',        l: '정원(숫자)',     type: 'number' },
                      { k: 'priceNumber',     l: '참가비(원)',     type: 'number' },
                    ].map((f) => (
                      <div key={f.k} className="field" style={{margin:0}}>
                        <label className="field-label">{f.l}</label>
                        <input className="field-input" type={f.type} placeholder={f.placeholder || ''}
                          value={draft[f.k] ?? ''}
                          onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })}/>
                      </div>
                    ))}
                    <div className="field" style={{margin:0, gridColumn:'1 / -1'}}>
                      <label className="field-label">설명</label>
                      <textarea className="field-input" rows={2} value={draft.desc}
                        onChange={(e) => setDraft({ ...draft, desc: e.target.value })}/>
                    </div>
                    <div style={{gridColumn:'1 / -1', display:'flex', justifyContent:'flex-end', gap:8}}>
                      <button type="button" className="btn btn-small" onClick={() => setEditingId(null)}>취소</button>
                      <button type="button" className="btn btn-gold btn-small" onClick={saveEdit}>저장</button>
                    </div>
                  </div>
                ) : (
                  <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:10}}>
                    <button type="button" className="btn btn-small" onClick={() => startEdit(t)}>투어 정보 수정</button>
                    <button type="button" className="btn btn-small"
                      onClick={() => toggleTourHidden(t)}
                      style={{marginLeft:'auto'}}>
                      {t.hidden ? '👁 표시 복원' : '🙈 숨김 처리'}
                    </button>
                    <button type="button" className="btn btn-small" onClick={() => removeTour(t.id)}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                  </div>
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
                              r.status === 'confirmed' ? 'var(--gold)' :
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
                                    onClick={() => {
                                      if (!confirm(`${r.name} 님 신청을 취소 처리하시겠어요?`)) return;
                                      window.BGNJ_TOURS.cancelReservation(t.id, r.id);
                                      refresh();
                                    }}
                                    style={{borderColor:'var(--danger)', color:'var(--danger)'}}>취소</button>
                                )}
                                {r.status === 'refund_requested' && (
                                  <>
                                    <span className="mono" style={{fontSize:9, color:'#e8a020', letterSpacing:'0.15em'}}>환불신청</span>
                                    {r.refundReason && <span className="dim-2" style={{fontSize:10}}>· {r.refundReason}</span>}
                                    <button type="button" className="btn btn-small"
                                      onClick={() => { if (!confirm('환불을 승인하시겠어요?')) return; window.BGNJ_TOURS.approveRefund(t.id, r.id); refresh(); }}
                                      style={{borderColor:'var(--gold)', color:'var(--gold)'}}>승인</button>
                                    <input className="field-input" placeholder="반려 사유"
                                      style={{padding:'4px 8px', fontSize:11, maxWidth:140}}
                                      value={refundRejectNotes[r.id] || ''}
                                      onChange={e => setRefundRejectNotes({...refundRejectNotes, [r.id]: e.target.value})}/>
                                    <button type="button" className="btn btn-small"
                                      onClick={() => { if (!confirm('환불 신청을 반려하시겠어요?')) return; window.BGNJ_TOURS.rejectRefund(t.id, r.id, refundRejectNotes[r.id] || ''); refresh(); }}
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
    </div>
  );
};

// === Bank Account Settings Panel ==================================
const BankAccountPanel = () => {
  const [bank, setBank] = React.useState(() => window.BGNJ_LECTURES.getBankAccount());
  const [msg, setMsg] = React.useState("");

  const save = (e) => {
    e.preventDefault();
    window.BGNJ_LECTURES.saveBankAccount(bank);
    setMsg("계좌 정보를 저장했습니다.");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <form onSubmit={save} className="card" style={{padding:24, maxWidth:640}}>
      <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>BANK ACCOUNT</div>
      <h2 className="ko-serif" style={{fontSize:20, marginBottom:6}}>강연 무통장 입금 계좌</h2>
      <p className="dim" style={{fontSize:13, lineHeight:1.7, marginBottom:18}}>
        강연 신청 시 사용자에게 노출되는 입금 계좌입니다. 변경하면 새로 신청하는 사용자부터 즉시 반영됩니다.
      </p>
      <div style={{display:'grid', gap:12}}>
        {[
          { k: 'bankName',      l: '은행',     placeholder: '예) 국민은행' },
          { k: 'accountNumber', l: '계좌번호', placeholder: '예) 123-456-7890123' },
          { k: 'holder',        l: '예금주',   placeholder: '예) 뱅기노자 협동조합' },
        ].map((f) => (
          <div key={f.k} className="field" style={{margin:0}}>
            <label className="field-label">{f.l}</label>
            <input className="field-input" placeholder={f.placeholder}
              value={bank[f.k] || ''}
              onChange={(e) => setBank({ ...bank, [f.k]: e.target.value })}/>
          </div>
        ))}
        <div className="field" style={{margin:0}}>
          <label className="field-label">안내 메모 (선택)</label>
          <textarea className="field-input" rows={2}
            value={bank.memo || ''}
            placeholder="입금자명에 강연 신청자 본명 + 강연번호를 남겨 주세요."
            onChange={(e) => setBank({ ...bank, memo: e.target.value })}/>
        </div>
      </div>
      {msg && (
        <div role="status" className="mono gold" style={{fontSize:12, marginTop:14, padding:'8px 12px', border:'1px solid var(--gold-dim)', background:'rgba(212,175,55,0.06)'}}>
          {msg}
        </div>
      )}
      <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:18, paddingTop:14, borderTop:'1px solid var(--line)'}}>
        <button type="submit" className="btn btn-gold">저장</button>
      </div>
    </form>
  );
};

// === Book Orders Admin Panel ======================================
const BookOrderAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [filter, setFilter] = React.useState('pending_payment');
  const [trackingDraft, setTrackingDraft] = React.useState({});
  const refresh = () => setTick((v) => v + 1);

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

  const downloadCsv = () => {
    const csv = window.BGNJ_BOOK_ORDERS.exportCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `book-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    paid: 'var(--gold)',
    shipped: 'var(--gold)',
    delivered: 'var(--gold-2)',
    refund_requested: '#e8a020',
    cancelled: 'var(--danger)',
  }[s] || 'var(--ink-2)');

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        『왕의길』 주문은 회원 전용·무통장 입금 단일 흐름입니다.
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
                borderColor: filter === f.key ? 'var(--gold)' : 'var(--line)',
                color: filter === f.key ? 'var(--gold)' : 'var(--ink-2)',
                background: filter === f.key ? 'rgba(212,175,55,0.06)' : 'transparent',
              }}>
              {f.label} <span className="mono dim-2" style={{ fontSize: 10, marginLeft: 4 }}>{counts[f.key] ?? 0}</span>
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-small" onClick={downloadCsv}>CSV 다운로드</button>
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
                  <span className="mono dim-2" style={{fontSize:11}}>{new Date(o.createdAt).toLocaleString('ko-KR')}</span>
                </div>
                <span className="mono" style={{fontSize:10, letterSpacing:'0.22em', color: statusTone(o.status)}}>
                  {statusLabel(o.status).toUpperCase()}{o.paid && o.status === 'paid' && ' · 입금 ✓'}
                </span>
              </header>

              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12, marginBottom:14}}>
                <div>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:4}}>BOOK</div>
                  <div style={{fontSize:13}}>『왕의길』 · {o.version === 'KR' ? '국문판' : '영문판'} × {o.qty}</div>
                </div>
                <div>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:4}}>AMOUNT</div>
                  <div className="gold ko-serif" style={{fontSize:18}}>{o.total.toLocaleString()}원</div>
                  <div className="dim-2 mono" style={{fontSize:10}}>상품 {o.subtotal.toLocaleString()} + 배송 {o.shipping.toLocaleString()}</div>
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
                  <span className="mono dim-2" style={{fontSize:11}}>송장 {o.tracking} · 도착 {o.deliveredAt ? new Date(o.deliveredAt).toLocaleDateString('ko-KR') : ''}</span>
                )}
                {(o.status === 'pending_payment' || o.status === 'paid') && (
                  <button type="button" className="btn btn-small"
                    onClick={() => {
                      if (!confirm(`주문 ${o.orderNo}을(를) 취소 처리하시겠어요?`)) return;
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
                        <span className="mono" style={{fontSize:10, color:'#e8a020', letterSpacing:'0.2em'}}>REFUND REQUEST</span>
                        <span className="dim" style={{fontSize:12}}>사유: {o.refundReason || '(미입력)'}</span>
                      </div>
                      <div style={{display:'flex', gap:6, alignItems:'center', flexWrap:'wrap'}}>
                        <button type="button" className="btn btn-small"
                          onClick={() => {
                            if (!confirm(`환불을 승인하시겠어요? 주문 ${o.orderNo}이 취소됩니다.`)) return;
                            window.BGNJ_BOOK_ORDERS.approveRefund(o.id);
                            refresh();
                          }}
                          style={{borderColor:'var(--gold)', color:'var(--gold)'}}>
                          환불 승인
                        </button>
                        <input className="field-input"
                          placeholder="반려 사유 (선택)"
                          style={{padding:'5px 8px', fontSize:12, maxWidth:200}}
                          value={rejectNotes[o.id] || ''}
                          onChange={(e) => setRejectNotes({ ...rejectNotes, [o.id]: e.target.value })}/>
                        <button type="button" className="btn btn-small"
                          onClick={() => {
                            if (!confirm(`환불 신청을 반려하시겠어요?`)) return;
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
  const [slug, setSlug] = React.useState('privacy');
  const [tick, setTick] = React.useState(0);
  const doc = React.useMemo(() => window.BGNJ_LEGAL.get(slug) || { title: '', body: '' }, [slug, tick]);
  const [title, setTitle] = React.useState(doc.title);
  const [body, setBody] = React.useState(doc.body);
  const [editorKey, setEditorKey] = React.useState(0);
  const [msg, setMsg] = React.useState('');

  React.useEffect(() => {
    setTitle(doc.title || '');
    setBody(doc.body || '');
    setEditorKey((k) => k + 1);
    setMsg('');
  }, [slug, tick]);

  const save = (e) => {
    e.preventDefault();
    if (!title.trim()) { setMsg('제목을 입력해 주세요.'); return; }
    window.BGNJ_LEGAL.save(slug, { title: title.trim(), body });
    setMsg('저장되었습니다.');
    setTick((v) => v + 1);
    setTimeout(() => setMsg(''), 2000);
  };

  const SLUG_LABEL = { privacy: '개인정보 처리방침', terms: '이용약관' };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        사이트 푸터의 <strong className="gold">이용약관</strong>·<strong className="gold">개인정보 처리방침</strong> 페이지에 그대로 노출되는 본문을 직접 편집합니다.
      </p>

      <div style={{display:'flex', gap:8, marginBottom:18, flexWrap:'wrap'}}>
        {window.BGNJ_LEGAL.listSlugs().map((s) => (
          <button key={s} type="button" className="btn btn-small"
            onClick={() => setSlug(s)}
            style={{
              borderColor: slug === s ? 'var(--gold)' : 'var(--line)',
              color: slug === s ? 'var(--gold)' : 'var(--ink-2)',
              background: slug === s ? 'rgba(212,175,55,0.06)' : 'transparent',
            }}>
            {SLUG_LABEL[s] || s}
          </button>
        ))}
      </div>

      <form onSubmit={save} className="card" style={{padding:20}}>
        <div className="field">
          <label className="field-label" htmlFor="legal-title">문서 제목</label>
          <input id="legal-title" className="field-input" value={title}
            onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div className="field">
          <label className="field-label">본문</label>
          <TiptapEditor key={editorKey} preset="column"
            content={doc.body || ''}
            onUpdate={(html) => setBody(html)}
            placeholder="문서 본문을 입력합니다. 이미지·링크·인용·목록을 지원합니다."/>
        </div>
        {doc.updatedAt && (
          <div className="dim-2 mono" style={{fontSize:11, marginBottom:14}}>최근 수정 · {new Date(doc.updatedAt).toLocaleString('ko-KR')}</div>
        )}
        {msg && (
          <div role="status" className="mono gold" style={{fontSize:12, marginBottom:14, padding:'8px 12px', border:'1px solid var(--gold-dim)', background:'rgba(212,175,55,0.06)'}}>
            {msg}
          </div>
        )}
        <div style={{display:'flex', gap:8, justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14}}>
          <button type="submit" className="btn btn-gold">저장</button>
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
  const remove = (id) => {
    if (!confirm('이 FAQ를 삭제하시겠어요?')) return;
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

// === Site Content Panel ===========================================
// 메뉴 라벨, 히어로/푸터 텍스트, 브랜드명, 로고/파비콘, OG 메타를 한 화면에서 편집한다.
// 각 섹션은 독립 저장 — 한 섹션 저장이 다른 섹션 편집값을 잃게 하지 않는다.
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
    const reset = () => {
      if (!confirm('이 섹션을 기본값으로 되돌릴까요?')) return;
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

  const ImageUploader = ({ section, field, label, hint, previewSize = 56, accept = 'image/*' }) => {
    const current = sc[section]?.[field] || '';
    const onPick = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // 1.5MB 이상은 거절 — base64는 약 33% 부풀어 localStorage(보통 5~10MB) 한도 위협.
      if (file.size > 1.5 * 1024 * 1024) {
        alert(`이미지가 너무 큽니다(${(file.size/1024/1024).toFixed(1)}MB). 1.5MB 이하로 압축해 주세요.`);
        e.target.value = '';
        return;
      }
      const dataUri = await fileToDataUri(file);
      window.BGNJ_SITE_CONTENT.saveSection(section, { [field]: dataUri });
      setTick((v) => v + 1);
      flash(`${label} 업로드 완료`);
      e.target.value = '';
    };
    const clear = () => {
      if (!confirm(`${label}을(를) 비울까요? (기본 마크로 되돌아갑니다)`)) return;
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
        <div role="status" className="mono gold" style={{fontSize:12, marginBottom:14, padding:'8px 12px', border:'1px solid var(--gold-dim)', background:'rgba(59,130,246,0.06)'}}>
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
        { key: 'book', label: '뱅기노자의 길' },
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

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>푸터 — 소개·서명</h3>
      <SectionForm key={`footer-${tick}`} section="footer" fields={[
        { key: 'description', label: '소개 문단', full: true, multiline: true },
        { key: 'signature', label: '하단 서명', full: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>푸터 — 연락 정보</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        푸터의 '연락' 섹션에 노출됩니다. 비우면 해당 줄이 표시되지 않습니다.
      </p>
      <SectionForm key={`contact-${tick}`} section="contact" fields={[
        { key: 'email',     label: '이메일' },
        { key: 'phone',     label: '전화번호 (표시용)' },
        { key: 'phoneHref', label: '전화 링크 (예: tel:+82-2-0000-0000)' },
        { key: 'address',   label: '주소', full: true },
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

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>OG 메타 (공유 미리보기)</h3>
      <SectionForm key={`og-${tick}`} section="og" fields={[
        { key: 'title', label: 'OG 제목', full: true },
        { key: 'description', label: 'OG 설명', full: true, multiline: true },
      ]}/>
      <ImageUploader section="og" field="imageDataUri" label="OG 이미지"
        hint="1200x630 PNG/JPG 권장 · 카카오톡/페이스북/X 공유 시 미리보기에 사용. 1.5MB 이하."
        previewSize={80}/>
    </div>
  );
};

// === Books Admin Panel ============================================
// 다양한 책 콘텐츠 관리 — 메타/표지/PDF 미리보기/소개/목차/저자/리뷰.
const BooksAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const books = React.useMemo(() => window.BGNJ_BOOKS.list(), [tick]);
  const [selectedId, setSelectedId] = React.useState(books[0]?.id || null);
  const selected = React.useMemo(() => window.BGNJ_BOOKS.get(selectedId), [selectedId, tick]);
  const [editTab, setEditTab] = React.useState('meta');
  const [msg, setMsg] = React.useState('');
  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2000); };
  const refresh = () => setTick((v) => v + 1);

  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    if (!file) { resolve(''); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const [addingBook, setAddingBook] = React.useState(false);
  const [newBookTitle, setNewBookTitle] = React.useState('');
  const submitAddBook = async () => {
    const title = (newBookTitle || '').trim();
    if (!title) return;
    const created = await window.BGNJ_BOOKS.create({ title, status: 'draft' });
    setNewBookTitle(''); setAddingBook(false);
    refresh();
    if (created?.id) { setSelectedId(created.id); setEditTab('meta'); }
  };
  const addBook = () => { setNewBookTitle(''); setAddingBook(true); };

  const removeBook = async (id) => {
    const target = window.BGNJ_BOOKS.get(id);
    if (!target) return;
    if (!confirm(`"${target.title}" 책을 삭제할까요? (되돌릴 수 없음)`)) return;
    await window.BGNJ_BOOKS.remove(id);
    refresh();
    if (selectedId === id) {
      const remaining = window.BGNJ_BOOKS.list();
      setSelectedId(remaining[0]?.id || null);
    }
  };

  const patch = (changes) => {
    if (!selectedId) return;
    window.BGNJ_BOOKS.update(selectedId, changes);
    refresh();
  };

  const onUploadCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert(`표지 이미지가 너무 큽니다(${(file.size/1024/1024).toFixed(1)}MB). 1.5MB 이하로 압축해 주세요.`);
      e.target.value = ''; return;
    }
    const dataUri = await fileToDataUri(file);
    patch({ coverDataUri: dataUri });
    flash('표지 업로드 완료');
    e.target.value = '';
  };

  const onUploadPdf = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // PDF는 미리보기 분량만 — localStorage 한도 고려해 3MB로 캡.
    if (file.size > 3 * 1024 * 1024) {
      alert(`PDF가 너무 큽니다(${(file.size/1024/1024).toFixed(1)}MB). 미리보기용으로 3MB 이하 권장.`);
      e.target.value = ''; return;
    }
    const dataUri = await fileToDataUri(file);
    patch({ pdfPreviewDataUri: dataUri });
    flash('PDF 미리보기 업로드 완료');
    e.target.value = '';
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
      {msg && (
        <div role="status" className="mono gold" style={{fontSize:12, marginBottom:14, padding:'8px 12px', border:'1px solid var(--gold-dim)', background:'rgba(59,130,246,0.06)'}}>
          {msg}
        </div>
      )}

      <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:20, alignItems:'start'}}>
        {/* 좌측: 책 목록 */}
        <aside aria-label="책 목록" style={{border:'1px solid var(--line)'}}>
          <div style={{padding:'10px 14px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em'}}>BOOKS · {books.length}</span>
            <button type="button" className="btn btn-small btn-gold" onClick={addBook}>＋ 새 책</button>
          </div>
          {addingBook && (
            <form onSubmit={(e) => { e.preventDefault(); submitAddBook(); }}
              style={{padding:'10px 12px', borderBottom:'1px solid var(--line)', background:'var(--bg-2)', display:'flex', gap:6, alignItems:'center'}}>
              <input className="field-input" autoFocus
                style={{flex:1, padding:'6px 10px', fontSize:13}}
                placeholder="새 책 제목"
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}/>
              <button type="submit" className="btn btn-small btn-gold" disabled={!newBookTitle.trim()}>추가</button>
              <button type="button" className="btn btn-small" onClick={() => { setAddingBook(false); setNewBookTitle(''); }}>취소</button>
            </form>
          )}
          {books.length === 0 ? (
            <div className="dim" style={{padding:20, fontSize:13}}>등록된 책이 없습니다.</div>
          ) : (
            <ul role="list" style={{listStyle:'none', margin:0, padding:0}}>
              {books.map((b) => (
                <li key={b.id} style={{borderBottom:'1px solid var(--line)'}}>
                  <button type="button"
                    onClick={() => { setSelectedId(b.id); setEditTab('meta'); }}
                    aria-current={selectedId === b.id ? 'true' : undefined}
                    style={{
                      width:'100%', textAlign:'left', padding:'12px 14px',
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
                      <span className="ko-serif" style={{fontSize:13, color:'var(--ink)', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{b.title}</span>
                      <span className="mono dim-2" style={{fontSize:9, letterSpacing:'0.12em'}}>
                        {b.status === 'published' ? '출간' : b.status === 'coming_soon' ? '출간 예정' : '초안'}
                        {b.primary ? ' · 대표' : ''}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
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
                      color: editTab === t.id ? 'var(--gold)' : 'var(--ink-2)',
                      borderBottom: editTab === t.id ? '2px solid var(--gold)' : '2px solid transparent',
                      marginBottom:-1, background:'none', border:'none', cursor:'pointer',
                      fontFamily:'var(--font-serif)',
                    }}>{t.label}</button>
                ))}
                <span style={{flex:1}}/>
                <button type="button" className="btn btn-small"
                  onClick={() => removeBook(selected.id)}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>책 삭제</button>
              </div>

              {editTab === 'meta' && (
                <div className="card" style={{padding:20, display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14}}>
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">제목</label>
                    <input className="field-input" value={selected.title} onChange={(e) => patch({ title: e.target.value })}/>
                  </div>
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">부제</label>
                    <input className="field-input" value={selected.subtitle} onChange={(e) => patch({ subtitle: e.target.value })}/>
                  </div>
                  <div className="field">
                    <label className="field-label">저자</label>
                    <input className="field-input" value={selected.author} onChange={(e) => patch({ author: e.target.value })}/>
                  </div>
                  <div className="field">
                    <label className="field-label">출판사</label>
                    <input className="field-input" value={selected.publisher} onChange={(e) => patch({ publisher: e.target.value })}/>
                  </div>
                  <div className="field">
                    <label className="field-label">페이지 수</label>
                    <input type="number" className="field-input" value={selected.pages} onChange={(e) => patch({ pages: Number(e.target.value) })}/>
                  </div>
                  <div className="field">
                    <label className="field-label">ISBN</label>
                    <input className="field-input" value={selected.isbn} onChange={(e) => patch({ isbn: e.target.value })}/>
                  </div>
                  <div className="field">
                    <label className="field-label">국문판 가격(원)</label>
                    <input type="number" className="field-input" value={selected.priceKR} onChange={(e) => patch({ priceKR: Number(e.target.value) })}/>
                  </div>
                  <div className="field">
                    <label className="field-label">영문판 가격(원)</label>
                    <input type="number" className="field-input" value={selected.priceEN} onChange={(e) => patch({ priceEN: Number(e.target.value) })}/>
                  </div>
                  <div className="field">
                    <label className="field-label">상태</label>
                    <select className="field-input" value={selected.status} onChange={(e) => patch({ status: e.target.value })}>
                      <option value="published">출간</option>
                      <option value="coming_soon">출간 예정</option>
                      <option value="draft">초안 (비공개)</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">출간일</label>
                    <input type="date" className="field-input" value={selected.publishedAt || ''} onChange={(e) => patch({ publishedAt: e.target.value })}/>
                  </div>
                  <div className="field" style={{gridColumn:'1 / -1', display:'flex', alignItems:'center', gap:10}}>
                    <input id="book-primary" type="checkbox" checked={!!selected.primary} onChange={(e) => patch({ primary: e.target.checked })}/>
                    <label htmlFor="book-primary" className="field-label" style={{margin:0}}>대표 책 (홈 CTA에 노출되는 메인 책)</label>
                  </div>
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">짧은 설명 (카탈로그 카드용)</label>
                    <textarea className="field-input" rows={3} value={selected.desc} onChange={(e) => patch({ desc: e.target.value })}/>
                  </div>
                </div>
              )}

              {editTab === 'media' && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
                  <div className="card" style={{padding:18}}>
                    <h4 className="ko-serif" style={{fontSize:14, marginBottom:10}}>표지 (PNG/JPG)</h4>
                    <div style={{
                      aspectRatio:'3/4', maxWidth:200, marginBottom:12,
                      border:'1px solid var(--line)', background:'var(--bg-2)',
                      display:'grid', placeItems:'center', overflow:'hidden',
                    }}>
                      {selected.coverDataUri
                        ? <img src={selected.coverDataUri} alt={`${selected.title} 표지`} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                        : <span className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.18em'}}>NO COVER</span>}
                    </div>
                    <div style={{display:'flex', gap:8}}>
                      <label className="btn btn-small" style={{cursor:'pointer'}}>
                        업로드
                        <input type="file" accept="image/png,image/jpeg" onChange={onUploadCover} style={{display:'none'}}/>
                      </label>
                      {selected.coverDataUri && (
                        <button type="button" className="btn btn-small"
                          onClick={() => { if (confirm('표지를 비울까요?')) patch({ coverDataUri: '' }); }}
                          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                      )}
                    </div>
                    <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.5}}>
                      권장 비율 3:4. 1.5MB 이하 PNG/JPG. 카탈로그·상세 페이지에 노출됩니다.
                    </p>
                  </div>
                  <div className="card" style={{padding:18}}>
                    <h4 className="ko-serif" style={{fontSize:14, marginBottom:10}}>본문 미리보기 (PDF)</h4>
                    {selected.pdfPreviewDataUri ? (
                      <div style={{height:240, border:'1px solid var(--line)', marginBottom:12}}>
                        <iframe src={selected.pdfPreviewDataUri} title={`${selected.title} 미리보기`}
                          style={{width:'100%', height:'100%', border:'none'}}/>
                      </div>
                    ) : (
                      <div style={{height:240, border:'1px dashed var(--line-2)', marginBottom:12, display:'grid', placeItems:'center'}}>
                        <span className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.18em'}}>NO PDF</span>
                      </div>
                    )}
                    <div style={{display:'flex', gap:8}}>
                      <label className="btn btn-small" style={{cursor:'pointer'}}>
                        업로드
                        <input type="file" accept="application/pdf" onChange={onUploadPdf} style={{display:'none'}}/>
                      </label>
                      {selected.pdfPreviewDataUri && (
                        <button type="button" className="btn btn-small"
                          onClick={() => { if (confirm('PDF 미리보기를 비울까요?')) patch({ pdfPreviewDataUri: '' }); }}
                          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                      )}
                    </div>
                    <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.5}}>
                      미리보기 분량(2~3MB)만 권장. 사용자는 도서 상세 페이지의 "PDF 미리보기" 버튼으로 열람합니다.
                    </p>
                  </div>
                </div>
              )}

              {editTab === 'intro' && (
                <div className="card" style={{padding:20}}>
                  <label className="field-label">소개 (HTML 허용)</label>
                  <textarea className="field-input" rows={12}
                    value={selected.intro || ''}
                    onChange={(e) => patch({ intro: e.target.value })}
                    style={{fontFamily:'var(--font-mono)', fontSize:13, lineHeight:1.7}}/>
                  <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.5}}>
                    문단은 &lt;p&gt;…&lt;/p&gt;로 구분. 강조는 &lt;strong&gt;…&lt;/strong&gt;.
                  </p>
                </div>
              )}

              {editTab === 'toc' && (
                <div className="card" style={{padding:20}}>
                  <label className="field-label">목차 (한 줄에 한 항목)</label>
                  <textarea className="field-input" rows={12}
                    value={(selected.chapters || []).join('\n')}
                    onChange={(e) => patch({ chapters: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
                    style={{fontFamily:'var(--font-serif)', fontSize:14, lineHeight:1.8}}/>
                </div>
              )}

              {editTab === 'author' && (
                <div className="card" style={{padding:20}}>
                  <label className="field-label">저자 소개</label>
                  <textarea className="field-input" rows={8}
                    value={selected.authorBio || ''}
                    onChange={(e) => patch({ authorBio: e.target.value })}
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
                            <span className="mono dim-2" style={{fontSize:10}}>{new Date(r.createdAt).toLocaleDateString('ko-KR')}</span>
                          </div>
                          <p className="ko-serif" style={{fontSize:13, lineHeight:1.7, margin:0}}>{r.text}</p>
                        </div>
                        <button type="button" className="btn btn-small"
                          onClick={() => {
                            if (!confirm('이 리뷰를 삭제할까요?')) return;
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
            </>
          )}
        </section>
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
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `audit-log-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    if (!confirm('감사 로그 전체를 삭제하시겠어요? 되돌릴 수 없습니다.')) return;
    window.BGNJ_AUDIT.clear();
    refresh();
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:14}}>
        운영자가 회원·강연·투어·책 주문에 대해 행한 변경 내역이 시각순으로 기록됩니다.
        최근 500건까지 보관되며, 정지·삭제·입금 확인·발송·등급 변경 같은 핵심 액션이 자동으로 남습니다.
      </p>
      <div style={{display:'flex', gap:10, marginBottom:14, alignItems:'center', flexWrap:'wrap'}}>
        <input className="field-input" placeholder="액션 / 대상 / 작업자 검색..." style={{flex:1, minWidth:240}}
          value={search} onChange={(e) => setSearch(e.target.value)}/>
        <button type="button" className="btn btn-small" onClick={exportCsv}>CSV 다운로드</button>
        <button type="button" className="btn btn-small" onClick={clear}
          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>전체 삭제</button>
      </div>

      {list.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>표시할 감사 로그가 없습니다.</div>
      ) : (
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
          <thead>
            <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
              <th scope="col" style={{padding:10, textAlign:'left', width:160}}>시각</th>
              <th scope="col" style={{padding:10, textAlign:'left', width:200}}>액션</th>
              <th scope="col" style={{padding:10, textAlign:'left'}}>대상</th>
              <th scope="col" style={{padding:10, textAlign:'left'}}>작업자</th>
              <th scope="col" style={{padding:10, textAlign:'left'}}>세부</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id} style={{borderBottom:'1px solid var(--line)'}}>
                <td className="mono dim-2" style={{padding:10, fontSize:11}}>{new Date(e.ts).toLocaleString('ko-KR')}</td>
                <td className="mono gold" style={{padding:10, fontSize:11}}>{e.action}</td>
                <td className="mono" style={{padding:10, fontSize:11}}>{e.target}</td>
                <td style={{padding:10, fontSize:12}}>{e.by}</td>
                <td style={{padding:10, fontSize:11, lineHeight:1.6}}>
                  <AuditDetailsCell details={e.details}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="dim-2 mono" style={{fontSize:11, marginTop:12, textAlign:'right'}}>
        표시 {list.length}건 (전체 최근 500건 중)
      </div>
    </div>
  );
};

// 정지 사유 입력 모달 — prompt() 대신 GUI.
const SuspendDialog = ({ target, reason, onChange, onConfirm, onCancel }) => {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);
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
  const filtered = users.filter((u) => {
    if (gradeFilter !== 'all') {
      const isAdminFilter = gradeFilter === 'admin';
      if (isAdminFilter && !u.isAdmin) return false;
      if (!isAdminFilter && u.gradeId !== gradeFilter) return false;
    }
    if (search) {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return String(u.name || '').toLowerCase().includes(q)
        || String(u.email || '').toLowerCase().includes(q)
        || String(u.id || '').toLowerCase().includes(q);
    }
    return true;
  });

  const selected = users.find((u) => u.id === selectedId) || null;
  const activity = selected ? window.BGNJ_AUTH.getActivity(selected.id) : null;

  const exportCsv = () => {
    const header = ['id','name','email','gradeId','isAdmin','suspended','joinedAt','postCount','commentCount','bookOrders','lectures','tours'];
    const rows = users.map((u) => {
      const a = window.BGNJ_AUTH.getActivity(u.id) || {};
      return [u.id, u.name, u.email, u.gradeId, u.isAdmin ? 'Y' : 'N', u.suspended ? 'Y' : 'N', u.joinedAt || '', a.postCount || 0, a.commentCount || 0, (a.bookOrders||[]).length, (a.lectures||[]).length, (a.tours||[]).length];
    });
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `members-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const changeGrade = async (user, gradeId) => {
    try { await window.BGNJ_AUTH.setGrade(user.id, gradeId); refresh(); }
    catch (err) { alert(`등급 변경 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const toggleAdmin = async (user) => {
    if (!confirm(`${user.name} 님의 관리자 권한을 ${user.isAdmin ? '해제' : '부여'}하시겠어요?`)) return;
    try { await window.BGNJ_AUTH.toggleAdmin(user.id); refresh(); }
    catch (err) { alert(`관리자 권한 변경 실패: ${err?.message || '알 수 없는 오류'}`); }
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
    catch (err) { alert(`정지 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const suspendUser = (user) => openSuspendDialog(user);
  const unsuspend = async (user) => {
    if (!confirm(`${user.name} 님의 정지를 해제하시겠어요?`)) return;
    try { await window.BGNJ_AUTH.unsuspendUser(user.id); refresh(); }
    catch (err) { alert(`정지 해제 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const deleteUser = async (user) => {
    if (user.email === 'admin@admin.admin') { alert('기본 관리자 계정은 삭제할 수 없습니다.'); return; }
    if (!confirm(`${user.name} (${user.email}) 계정을 정말 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.`)) return;
    try { await window.BGNJ_AUTH.removeUser(user.id); setSelectedId(null); refresh(); }
    catch (err) { alert(`삭제 실패: ${err?.message || '알 수 없는 오류'}`); }
  };

  const gradeOf = (id) => grades.find((g) => g.id === id);
  const formatDate = (iso) => {
    if (!iso) return '-';
    try { return new Date(iso).toLocaleString('ko-KR'); } catch { return iso; }
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
              {selected.isAdmin && <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', color:'var(--gold)', border:'1px solid var(--gold-dim)', padding:'2px 8px'}}>ADMIN</span>}
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
                  <span>{o.version === 'KR' ? '국문' : '영문'} × {o.qty} · <span className="gold">{o.total.toLocaleString()}원</span></span>
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
        <select className="field-input" style={{maxWidth:200}}
          value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
          <option value="all">전체 등급</option>
          <option value="admin">관리자만</option>
          {grades.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
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
                    {u.isAdmin && <span className="mono" style={{fontSize:9, letterSpacing:'0.18em', color:'var(--gold)', marginLeft:8}}>ADMIN</span>}
                    {u.suspended && <span className="mono" style={{fontSize:9, letterSpacing:'0.18em', color:'var(--danger)', marginLeft:8}}>정지</span>}
                  </button>
                </td>
                <td className="mono dim-2" style={{padding:12, fontSize:11}}>{u.email}</td>
                <td style={{padding:12}}>
                  {g && (
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.14em', color: g.color || 'var(--gold)', border:`1px solid ${g.color || 'var(--gold-dim)'}`, padding:'1px 6px'}}>
                      {g.label}
                    </span>
                  )}
                </td>
                <td className="mono dim-2" style={{padding:12, fontSize:11}}>{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString('ko-KR') : '-'}</td>
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

// === Admin Page ===================================================
const AdminPage = ({ go }) => {
  const data = window.BANGINOJA_DATA;
  const [tab, setTab] = React.useState("대시보드");
  const [kmsTab, setKmsTab] = React.useState("기능정의서");
  const [postSearch, setPostSearch] = React.useState("");
  const [postFilter, setPostFilter] = React.useState("all");
  const [postRefreshKey, setPostRefreshKey] = React.useState(0);
  const [versionPage, setVersionPage] = React.useState(1);
  const [selectedPostIds, setSelectedPostIds] = React.useState(new Set());
  const [bulkTargetCat, setBulkTargetCat] = React.useState("");
  const [bulkTargetPrefix, setBulkTargetPrefix] = React.useState("");

  const allCommunityPosts = React.useMemo(() => window.BGNJ_COMMUNITY.listPosts(), [postRefreshKey]);
  const allUsers = React.useMemo(() => window.BGNJ_AUTH.listUsers(), [postRefreshKey]);
  const allColumns = React.useMemo(() => window.BGNJ_COLUMNS?.listPublic?.() || [...(window.BGNJ_STORES.userColumns || []), ...data.columns], [postRefreshKey]);
  const totalComments = React.useMemo(
    () => Object.values(window.BGNJ_STORES.comments || {}).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0),
    [postRefreshKey]
  );
  const allBookOrders = React.useMemo(() => window.BGNJ_BOOK_ORDERS?.listAll?.() || [], [postRefreshKey]);
  const pendingBookOrders = allBookOrders.filter((o) => o.status === 'pending_payment').length;
  const refundRequestedOrders = allBookOrders.filter((o) => o.status === 'refund_requested').length;
  const dashboardStats = React.useMemo(() => ([
    { l: "전체 회원", v: String(allUsers.length), d: `관리자 ${allUsers.filter((user) => user.isAdmin).length}명 포함`, p: true },
    { l: "커뮤니티 게시글", v: String(allCommunityPosts.length), d: `댓글 ${totalComments}개 누적`, p: true },
    { l: "공개 칼럼", v: String(allColumns.length), d: `관리자 발행 ${(window.BGNJ_STORES.userColumns || []).filter((c) => (c.status || 'published') === 'published').length}건 · 임시/예약 ${(window.BGNJ_STORES.userColumns || []).filter((c) => c.status === 'draft' || c.status === 'scheduled').length}건`, p: true },
    { l: "왕의길 주문", v: String(allBookOrders.length), d: `입금 대기 ${pendingBookOrders}건${refundRequestedOrders > 0 ? ` · 환불 신청 ${refundRequestedOrders}건` : ''}`, p: pendingBookOrders === 0 && refundRequestedOrders === 0 },
  ]), [allUsers, allCommunityPosts, totalComments, allColumns, data, allBookOrders, pendingBookOrders, refundRequestedOrders]);
  const latestCommunityPost = allCommunityPosts[0] || null;
  const latestColumn = allColumns[0] || null;
  const visibleCommunityPosts = React.useMemo(() => allCommunityPosts.filter((post) => {
    const search = postSearch.trim().toLowerCase();
    const matchesSearch = !search
      || post.title.toLowerCase().includes(search)
      || String(post.author || "").toLowerCase().includes(search);
    const matchesFilter = postFilter === "all" || post.categoryId === postFilter;
    return matchesSearch && matchesFilter;
  }), [allCommunityPosts, postSearch, postFilter]);

  // 7개 대카테고리: 요약 / 콘텐츠 / 회원관리 / 쇼핑 / 운영설정 / 개인정보 관리 / 시스템 관리
  const tabGroups = [
    { group: "요약",          items: ["대시보드"] },
    { group: "콘텐츠",        items: ["커뮤니티", "신고", "강연", "투어 프로그램", "뱅기노자 칼럼", "칼럼 작성"] },
    { group: "회원관리",      items: ["회원", "회원 등급"] },
    { group: "쇼핑",          items: ["책 카탈로그", "책 주문"] },
    { group: "운영설정",      items: ["사이트 콘텐츠", "카테고리", "약관/개인정보", "자주 묻는 질문", "계좌번호 설정"] },
    { group: "개인정보 관리", items: ["정보주체 권리", "동의 관리", "처리활동(ROPA)", "쿠키·추적", "보안 사고", "보유·파기", "국외 이전", "감사 로그"] },
    { group: "시스템 관리",   items: ["버전 기록", "KMS", "설정"] },
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
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dsr-access-${m.id}-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCommunityPosts = () => {
    const blob = new Blob([window.BGNJ_COMMUNITY.exportCsv()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `community-posts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteCommunityPost = (post) => {
    if (!confirm(`"${post.title}" 게시글을 삭제하시겠어요?`)) return;
    window.BGNJ_COMMUNITY.deletePost(post.id);
    setSelectedPostIds((prev) => { const next = new Set(prev); next.delete(post.id); return next; });
    setPostRefreshKey((value) => value + 1);
  };

  const bulkDeletePosts = () => {
    if (selectedPostIds.size === 0) return;
    if (!confirm(`선택한 ${selectedPostIds.size}개 게시글을 삭제할까요?`)) return;
    selectedPostIds.forEach((id) => window.BGNJ_COMMUNITY.deletePost(id));
    setSelectedPostIds(new Set());
    setPostRefreshKey((v) => v + 1);
  };

  const bulkMovePosts = () => {
    if (selectedPostIds.size === 0) return;
    if (!bulkTargetCat) { alert("이동할 게시판을 선택하세요."); return; }
    const cat = window.BGNJ_STORES.categories.find((c) => c.id === bulkTargetCat);
    if (!cat) return;
    selectedPostIds.forEach((id) => window.BGNJ_COMMUNITY.updatePost(id, { categoryId: cat.id, category: cat.label }));
    setSelectedPostIds(new Set());
    setBulkTargetCat("");
    setPostRefreshKey((v) => v + 1);
  };

  const bulkSetPrefix = () => {
    if (selectedPostIds.size === 0) return;
    const next = bulkTargetPrefix.trim();
    selectedPostIds.forEach((id) => window.BGNJ_COMMUNITY.updatePost(id, { prefix: next || null }));
    setSelectedPostIds(new Set());
    setBulkTargetPrefix("");
    setPostRefreshKey((v) => v + 1);
  };

  return (
    <div style={{display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'calc(100vh - 72px)'}}>
      {/* Sidebar */}
      <aside aria-label="관리자 메뉴" style={{background:'var(--bg-2)', borderRight:'1px solid var(--line)', padding:'32px 0', overflowY:'auto'}}>
        <div style={{padding:'0 24px 24px', borderBottom:'1px solid var(--line)'}}>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.3em'}}>◆ ADMIN CONSOLE</div>
          <div className="ko-serif" style={{fontSize:20, marginTop:8}}>관리자</div>
          <div className="dim-2 mono" style={{fontSize:11, marginTop:4}}>banginoja@bgnj.net</div>
          <div style={{marginTop:12, padding:'8px 10px', background:'rgba(212,175,55,0.06)', border:'1px solid var(--gold-dim)', fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gold)', letterSpacing:'0.15em'}}>
            DPO · dpo@bgnj.net
          </div>
          <div className="dim-2 mono" style={{fontSize:10, marginTop:6, letterSpacing:'0.1em'}}>적용법: GDPR + PIPA</div>
          <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.1em'}}>최근 DPIA: 2026.03.02</div>
        </div>
        {tabGroups.map(grp => (
          <div key={grp.group} style={{padding:'14px 0'}}>
            <div className="mono" style={{fontSize:9, letterSpacing:'0.25em', color:'var(--ink-3)', padding:'0 24px 8px'}}>
              {grp.group.toUpperCase()}
            </div>
            <ul role="list" style={{listStyle:'none', margin:0, padding:0}}>
              {grp.items.map(t => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => { setTab(t); }}
                    aria-current={tab === t ? "page" : undefined}
                    style={{
                      width:'100%', textAlign:'left',
                      padding:'10px 24px',
                      fontSize:13,
                      background: tab === t ? 'rgba(212,175,55,0.06)' : 'transparent',
                      color: tab === t ? 'var(--gold)' : 'var(--ink-2)',
                      borderLeft: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
                      letterSpacing:'0.03em',
                    }}>{t}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main */}
      <div style={{padding:40, overflow:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32}}>
          <div>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em'}}>ADMIN / {tab.toUpperCase()}</div>
            <h1 className="ko-serif" style={{fontSize:32, fontWeight:500, marginTop:6}}>{tab}</h1>
          </div>
          <time className="mono dim-2" style={{fontSize:11}} dateTime={new Date().toISOString()}>
            {new Date().toLocaleString('ko-KR')}
          </time>
        </div>

        {/* 대시보드 */}
        {tab === "대시보드" && (
          <>
            <div className="grid grid-4" style={{marginBottom:32}}>
              {[
                ...dashboardStats,
              ].map((s, i) => (
                <div key={i} className="card">
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12}}>{s.l}</div>
                  <div className="ko-serif" style={{fontSize:32, color:'var(--gold-2)'}}>{s.v}<span style={{fontSize:14, marginLeft:4}} className="dim-2">{s.unit||''}</span></div>
                  <div style={{fontSize:11, color: s.p ? 'var(--gold)' : 'var(--danger)', marginTop:8}}>{s.d}</div>
                </div>
              ))}
            </div>
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
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">다음 강연</span><span>{data.lectures[0]?.next || "없음"}</span></div>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">다음 투어</span><span>{data.tours[0]?.next || "없음"}</span></div>
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
        )}

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
                    {latest && <span className="dim-2 mono" style={{fontSize:11, marginLeft:10}}>최신 {latest.version} · {latest.date}</span>}
                  </div>
                </div>
                <div className="mono dim-2" style={{fontSize:11, letterSpacing:'0.16em'}}>
                  {safePage} / {totalPages} 페이지 · {start + 1}–{Math.min(start + VERSIONS_PER_PAGE, total)}건 표시
                </div>
              </div>

              {slice.map((entry) => (
                <article key={entry.version} className="card card-gold" style={{padding:24}}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:16, alignItems:'start', marginBottom:16, flexWrap:'wrap'}}>
                    <div>
                      <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>VERSION LOG</div>
                      <h2 className="ko-serif" style={{fontSize:24}}>{entry.version}</h2>
                    </div>
                    <div className="mono dim-2" style={{fontSize:11}}>{entry.date}</div>
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
                        borderColor: n === safePage ? 'var(--gold)' : 'var(--line)',
                        color: n === safePage ? 'var(--gold)' : 'var(--ink-2)',
                        background: n === safePage ? 'rgba(212,175,55,0.08)' : 'transparent',
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

            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {["기능정의서", "디자인"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="btn btn-small"
                  onClick={() => setKmsTab(item)}
                  style={{
                    borderColor: kmsTab === item ? 'var(--gold)' : 'var(--line)',
                    color: kmsTab === item ? 'var(--gold)' : 'var(--ink-2)',
                    background: kmsTab === item ? 'rgba(212,175,55,0.06)' : 'transparent',
                  }}>
                  {item}
                </button>
              ))}
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
                            <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', color:'var(--gold)'}}>{m.state} · {m.coverage}</span>
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
                        : 'var(--gold)';
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
                                  <li key={item} style={{padding:'8px 12px', borderLeft:'2px solid var(--gold-dim)', background:'rgba(212,175,55,0.04)', fontSize:13, lineHeight:1.7}}>
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
                                  ? 'var(--gold)'
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
                                              <span style={{position:'absolute', left:0, color:'var(--gold-dim)'}}>·</span>
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
                            borderLeft:'2px solid var(--gold)',
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

            {kmsTab === "디자인" && (
              <div style={{display:'grid', gap:16}}>
                <div className="card card-gold" style={{padding:24}}>
                  <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>DESIGN PRINCIPLES</div>
                  <h2 className="ko-serif" style={{fontSize:24, marginBottom:12}}>디자인 작업 기준</h2>
                  <p className="dim" style={{fontSize:13, lineHeight:1.8}}>
                    새 페이지를 만들거나 기존 UI를 바꿀 때는 이 탭의 원칙을 먼저 확인합니다.
                    뱅기노자 화면은 일반적인 밝은 SaaS UI가 아니라, 조선 왕실과 전시 도록의 분위기를 유지하는 방향으로 작업해야 합니다.
                  </p>
                </div>

                {ADMIN_DESIGN_SECTIONS.map((section) => (
                  <article key={section.title} className="card" style={{padding:24}}>
                    <h2 className="ko-serif" style={{fontSize:22, marginBottom:14}}>{section.title}</h2>
                    <div style={{display:'grid', gap:8}}>
                      {section.points.map((point) => (
                        <div key={point} className="card" style={{padding:14}}>{point}</div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}

          </div>
        )}

        {/* 게시글 */}
        {tab === "커뮤니티" && (
          <div>
            {/* 게시판 칩 (검색 위) */}
            <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:12}} role="tablist" aria-label="게시판 필터">
              {[{ id: 'all', label: '전체', count: allCommunityPosts.length }]
                .concat(window.BGNJ_STORES.categories
                  .filter((item) => item.boardType === 'community')
                  .map((c) => ({ id: c.id, label: c.label, count: allCommunityPosts.filter((p) => p.categoryId === c.id).length })))
                .map((chip) => {
                  const active = postFilter === chip.id;
                  return (
                    <button key={chip.id} type="button" role="tab" aria-selected={active}
                      onClick={() => { setPostFilter(chip.id); setSelectedPostIds(new Set()); }}
                      style={{
                        padding: '6px 14px', fontSize: 12,
                        fontFamily: 'var(--font-serif)',
                        background: active ? 'var(--gold)' : 'transparent',
                        color: active ? 'var(--bg)' : 'var(--ink-2)',
                        border: `1px solid ${active ? 'var(--gold)' : 'var(--line-2)'}`,
                        borderRadius: 999,
                        cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}>
                      <span>{chip.label}</span>
                      <span className="mono" style={{
                        fontSize: 10, letterSpacing: '0.05em',
                        opacity: active ? 0.85 : 0.55,
                      }}>{chip.count}</span>
                    </button>
                  );
                })}
            </div>
            <div style={{display:'flex', gap:12, marginBottom:16}}>
              <label htmlFor="post-search" className="sr-only">게시글 검색</label>
              <input id="post-search" className="field-input" placeholder="제목 또는 작성자 검색..." style={{flex:1}}
                value={postSearch} onChange={(e) => setPostSearch(e.target.value)}/>
              <button type="button" className="btn btn-small" onClick={exportCommunityPosts}>CSV 다운로드</button>
            </div>

            {/* 일괄 작업 바 */}
            {selectedPostIds.size > 0 && (
              <div style={{display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'rgba(59,130,246,0.07)', border:'1px solid var(--gold-dim)', marginBottom:12, flexWrap:'wrap'}}>
                <span className="mono gold" style={{fontSize:11}}>{selectedPostIds.size}개 선택됨</span>
                <button type="button" className="btn btn-small" style={{borderColor:'var(--danger)', color:'var(--danger)'}} onClick={bulkDeletePosts}>선택 삭제</button>
                <span aria-hidden="true" style={{width:1, alignSelf:'stretch', background:'var(--line)'}}/>
                <select className="field-input" style={{maxWidth:160, padding:'4px 8px'}} value={bulkTargetCat} onChange={(e) => setBulkTargetCat(e.target.value)}>
                  <option value="">게시판 선택...</option>
                  {window.BGNJ_STORES.categories.filter((c) => c.boardType === "community").map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                <button type="button" className="btn btn-small btn-gold" onClick={bulkMovePosts}>이동</button>
                <span aria-hidden="true" style={{width:1, alignSelf:'stretch', background:'var(--line)'}}/>
                <input type="text" className="field-input" style={{maxWidth:140, padding:'4px 8px'}} placeholder="말머리 (비우면 제거)" value={bulkTargetPrefix} onChange={(e) => setBulkTargetPrefix(e.target.value)} aria-label="일괄 적용할 말머리"/>
                <button type="button" className="btn btn-small btn-gold" onClick={bulkSetPrefix}>말머리 적용</button>
                <button type="button" className="btn btn-small" style={{marginLeft:'auto'}} onClick={() => setSelectedPostIds(new Set())}>선택 해제</button>
              </div>
            )}

            <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                  <th scope="col" style={{padding:'12px 8px', textAlign:'center', width:36}}>
                    <input type="checkbox"
                      checked={visibleCommunityPosts.length > 0 && visibleCommunityPosts.every((p) => selectedPostIds.has(p.id))}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedPostIds(new Set(visibleCommunityPosts.map((p) => p.id)));
                        else setSelectedPostIds(new Set());
                      }}
                      aria-label="전체 선택"/>
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
                {visibleCommunityPosts.map(p => (
                  <tr key={p.id} style={{borderBottom:'1px solid var(--line)', background: selectedPostIds.has(p.id) ? 'rgba(212,175,55,0.04)' : undefined}}>
                    <td style={{padding:'14px 8px', textAlign:'center'}}>
                      <input type="checkbox" checked={selectedPostIds.has(p.id)}
                        onChange={(e) => {
                          setSelectedPostIds((prev) => {
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
                      {p.prefix ? <span className="mono" style={{fontSize:9, padding:'1px 6px', border:'1px solid var(--gold-dim)', color:'var(--gold)'}}>{p.prefix}</span> : <span className="dim-2" style={{fontSize:10}}>—</span>}
                    </td>
                    <td className="ko-serif" style={{padding:14, fontSize:14}}>{p.title}</td>
                    <td className="dim mono" style={{padding:14}}>{p.author}</td>
                    <td className="mono dim-2" style={{padding:14}}>{p.date}</td>
                    <td style={{padding:14, textAlign:'right', display:'flex', justifyContent:'flex-end', gap:8}}>
                      <button type="button" className="btn btn-small" onClick={() => go("community")}>열기</button>
                      <button type="button" className="btn btn-small" onClick={() => deleteCommunityPost(p)}
                        style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleCommunityPosts.length === 0 && (
              <div className="card" style={{padding:24, marginTop:16, textAlign:'center'}}>
                조건에 맞는 게시글이 없습니다.
              </div>
            )}
          </div>
        )}

        {/* 신고 큐 */}
        {tab === "신고" && (
          <ReportQueuePanel onRefresh={() => setPostRefreshKey((v) => v + 1)} go={go}/>
        )}

        {/* 칼럼 */}
        {tab === "뱅기노자 칼럼" && (
          <div className="grid grid-2">
            {data.columns.map(c => (
              <article key={c.id} className="card">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
                  <span className="pill">{c.category}</span>
                  <span className="mono dim-2" style={{fontSize:10}}>#{String(c.id).padStart(3,'0')}</span>
                </div>
                <h3 className="ko-serif" style={{fontSize:17, marginBottom:8}}>{c.title}</h3>
                <div className="dim-2 mono" style={{fontSize:11, marginBottom:12}}>{c.date} · {c.readTime}</div>
                <div style={{display:'flex', gap:8}}>
                  <button type="button" className="btn btn-small">편집</button>
                  <button type="button" className="btn btn-small">통계</button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 강연 */}
        {tab === "강연" && <LectureAdminPanel go={go}/>}

        {/* 투어 프로그램 */}
        {tab === "투어 프로그램" && <TourAdminPanel go={go}/>}

        {/* 회원 */}
        {tab === "회원" && <MemberAdminPanel go={go}/>}

        {/* 왕의길 (책 주문 운영) */}
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
                  const toneColor = left?.tone === 'danger' ? 'var(--danger)' : left?.tone === 'warn' ? 'var(--gold-2)' : 'var(--ink-2)';
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
                          borderColor: r.status==='done' ? 'var(--gold-dim)' : r.status==='in_progress' ? 'var(--gold)' : 'var(--line-2)',
                          color: r.status==='done' ? 'var(--gold-dim)' : r.status==='in_progress' ? 'var(--gold)' : 'var(--ink-2)',
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
                      <span className="badge" style={{borderColor: c.required?'var(--gold)':'var(--line-2)', color: c.required?'var(--gold)':'var(--ink-2)'}}>{c.required ? '필수' : '선택'}</span>
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
            <div className="grid grid-2">
              {PRIVACY_DATA.ropa.map(r => (
                <article key={r.id} className="card">
                  <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em', marginBottom:8}}>{r.id}</div>
                  <h3 className="ko-serif" style={{fontSize:18, marginBottom:12}}>{r.purpose}</h3>
                  <dl style={{display:'grid', gridTemplateColumns:'100px 1fr', gap:'6px 16px', fontSize:12, lineHeight:1.6}}>
                    <dt className="dim-2 mono" style={{fontSize:10}}>법적 근거</dt><dd className="gold">{r.lawful}</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>수집 항목</dt><dd>{r.items}</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>보유기간</dt><dd>{r.retention}</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>수탁사</dt><dd>{r.processor}</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>국외이전</dt><dd>{r.transfer}</dd>
                  </dl>
                </article>
              ))}
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
                    <td style={{padding:14}}><span className="badge" style={{borderColor: c.cat==='필수' ? 'var(--gold)' : 'var(--line-2)', color: c.cat==='필수' ? 'var(--gold)' : 'var(--ink-2)'}}>{c.cat}</span></td>
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
              const toneColor = b.severity==='high' ? 'var(--danger)' : b.severity==='medium' ? 'var(--gold-2)' : 'var(--ink-2)';
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
                    <dt className="dim-2 mono" style={{fontSize:10}}>영향 주체</dt><dd>{b.affected.toLocaleString()}명</dd>
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

        {/* 카테고리 CRUD */}
        {tab === "사이트 콘텐츠" && <SiteContentAdminPanel/>}
        {tab === "카테고리" && <AdminCategoryPanel/>}
        {tab === "약관/개인정보" && <LegalAdminPanel/>}
        {tab === "자주 묻는 질문" && <FaqAdminPanel/>}
        {tab === "감사 로그" && <AuditLogPanel/>}

        {/* 회원 등급 CRUD */}
        {tab === "회원 등급" && <AdminGradePanel/>}

        {/* 칼럼 작성 (관리자 전용, Tiptap column preset — 이미지 본문 삽입/이동 가능) */}
        {tab === "칼럼 작성" && <AdminColumnEditor/>}

        {/* 계좌번호 설정 */}
        {tab === "계좌번호 설정" && <BankAccountPanel/>}

        {/* 설정 */}
        {tab === "설정" && (
          <div style={{display:'grid', gap:24}}>
            <BankAccountPanel/>

            <div className="card">
              <h2 className="ko-serif" style={{fontSize:20, marginBottom:16}}>사이트 설정</h2>
              <dl style={{display:'grid', gridTemplateColumns:'200px 1fr', gap:'8px 24px', fontSize:13, lineHeight:1.8}}>
                <dt className="dim-2 mono" style={{fontSize:11}}>DPO</dt><dd>dpo@bgnj.net · 02-0000-0001</dd>
                <dt className="dim-2 mono" style={{fontSize:11}}>개인정보 책임자</dt><dd>뱅기노자 / banginoja@bgnj.net</dd>
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
  const [draft, setDraft] = React.useState({ id:"", label:"", boardType:"community", minLevel:10, postMinLevel:10, desc:"" });
  const [error, setError] = React.useState("");
  const [prefixDrafts, setPrefixDrafts] = React.useState({});

  const save = (next) => {
    window.BGNJ_STORES.categories = next;
    window.BGNJ_SAVE.categories();
    setCats(next);
  };
  const slugify = (s) => String(s || '').trim().toLowerCase()
    .replace(/[^a-z0-9-_가-힣]+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
  const add = (e) => {
    e.preventDefault();
    setError("");
    let id = draft.id || slugify(draft.label);
    if (!id || !draft.label) return setError("ID와 이름은 필수입니다.");
    if (cats.find(c => c.id === id)) return setError("이미 존재하는 ID입니다.");
    save([...cats, { ...draft, id, minLevel: Number(draft.minLevel), postMinLevel: Number(draft.postMinLevel) }]);
    setDraft({ id:"", label:"", boardType:"community", minLevel:10, postMinLevel:10, desc:"" });
  };
  const update = (i, key, val) => {
    const next = cats.slice();
    next[i] = { ...next[i], [key]: key.endsWith("Level") ? Number(val) : val };
    save(next);
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= cats.length) return;
    const next = cats.slice();
    [next[i], next[j]] = [next[j], next[i]];
    save(next);
  };
  const remove = (i) => {
    const used = postCount(cats[i].id);
    const note = used > 0 ? `\n현재 이 게시판에 ${used}개의 글이 있습니다. 삭제 후에도 게시글은 남되 분류가 비게 됩니다.` : '';
    if (!confirm(`"${cats[i].label}" 게시판을 삭제하시겠어요?${note}`)) return;
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
      <p className="dim" style={{fontSize:13, marginBottom:16, lineHeight:1.8}}>
        게시판을 추가/삭제하고, 각 게시판의 <strong className="gold">읽기 최소 등급</strong> · <strong className="gold">쓰기 최소 등급</strong>을 설정합니다.
        순서를 바꾸면 사이트 내비 메가메뉴와 커뮤니티 탭에 그대로 반영됩니다.
      </p>

      {/* 게시판 추가 — 카드형 폼 */}
      <article className="card" style={{padding:18, marginBottom:20}}>
        <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>NEW BOARD</div>
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
          <button type="submit" className="btn btn-gold btn-small">＋ 추가</button>
        </form>
        {error && <div role="alert" className="mono" style={{color:'var(--danger)', fontSize:11, marginTop:10}}>{error}</div>}
      </article>

      {/* 게시판 목록 */}
      <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
        <thead>
          <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
            <th scope="col" style={{padding:10, textAlign:'center', width:80}}>순서</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>ID</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>이름</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>유형</th>
            <th scope="col" style={{padding:10, textAlign:'right'}}>읽기≥</th>
            <th scope="col" style={{padding:10, textAlign:'right'}}>쓰기≥</th>
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

      <button type="button" className="btn btn-small" style={{marginTop:20}}
        onClick={() => { if (confirm("기본값으로 되돌립니다. 진행할까요?")) { window.BGNJ_SAVE.resetCategories(); setCats(window.BGNJ_STORES.categories.slice()); } }}>
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
                      <span className="mono" style={{fontSize:10, letterSpacing:'0.14em', color: g.color || 'var(--gold)', border:`1px solid ${g.color || 'var(--gold-dim)'}`, padding:'1px 6px', marginRight:8}}>{g.label}</span>
                      <span className="dim-2 mono" style={{fontSize:10}}>Lv {lv}</span>
                    </td>
                    {communityCats.map((c) => {
                      const canRead = lv >= (c.minLevel ?? 0);
                      const canWrite = lv >= (c.postMinLevel ?? c.minLevel ?? 0);
                      return (
                        <td key={c.id} style={{padding:10, textAlign:'center', fontSize:11}}>
                          <span className="mono" style={{color: canRead ? 'var(--gold)' : 'var(--ink-3)'}}>읽 {canRead ? '✓' : '·'}</span>
                          {' / '}
                          <span className="mono" style={{color: canWrite ? 'var(--gold)' : 'var(--ink-3)'}}>쓰 {canWrite ? '✓' : '·'}</span>
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
                  <span key={p} style={{display:'inline-flex', alignItems:'center', gap:4, padding:'2px 10px', border:'1px solid var(--gold-dim)', fontSize:12}}>
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
const AdminGradePanel = () => {
  const [grades, setGrades] = React.useState(() => window.BGNJ_STORES.grades.slice());
  const [draft, setDraft] = React.useState({ id:"", label:"", level:20, color:"#D4AF37", desc:"" });
  const [error, setError] = React.useState("");

  const save = (next) => {
    // keep sorted by level for predictable reads
    const sorted = next.slice().sort((a, b) => a.level - b.level);
    window.BGNJ_STORES.grades = sorted;
    window.BGNJ_SAVE.grades();
    setGrades(sorted);
  };
  const add = (e) => {
    e.preventDefault();
    setError("");
    if (!draft.id || !draft.label) return setError("ID와 이름은 필수입니다.");
    if (grades.find(g => g.id === draft.id)) return setError("이미 존재하는 ID입니다.");
    save([...grades, { ...draft, level: Number(draft.level) }]);
    setDraft({ id:"", label:"", level:20, color:"#D4AF37", desc:"" });
  };
  const update = (i, key, val) => {
    const next = grades.slice();
    next[i] = { ...next[i], [key]: key === "level" ? Number(val) : val };
    save(next);
  };
  const remove = (i) => {
    const g = grades[i];
    if (g.id === "admin" || g.id === "guest") { alert("기본 등급(guest/admin)은 삭제할 수 없습니다."); return; }
    if (!confirm(`"${g.label}" 등급을 삭제하시겠어요?`)) return;
    save(grades.filter((_, j) => j !== i));
  };

  return (
    <>
      <p className="dim" style={{fontSize:13, marginBottom:16, lineHeight:1.8}}>
        회원 등급의 이름·단계(level)·색상을 관리합니다. <strong className="gold">level</strong>이 높을수록 권한이 큽니다.
        카테고리의 <code>minLevel / postMinLevel</code>과 비교해 접근이 결정됩니다.
      </p>
      <div className="card" style={{marginBottom:20}}>
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
      </div>

      <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
        <thead>
          <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
            <th scope="col" style={{padding:12, textAlign:'left'}}>배지</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>ID</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>이름</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>단계</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>색상</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>설명</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g, i) => (
            <tr key={g.id} style={{borderBottom:'1px solid var(--line)'}}>
              <td style={{padding:10}}>
                <span className="grade-badge" style={{color: g.color}}>{g.label}</span>
              </td>
              <td className="mono gold" style={{padding:10}}>{g.id}</td>
              <td style={{padding:10}}>
                <input className="field-input" style={{padding:'4px 8px'}} value={g.label}
                  onChange={e => update(i, 'label', e.target.value)}/>
              </td>
              <td style={{padding:10, textAlign:'right'}}>
                <input type="number" className="field-input" style={{padding:'4px 8px', width:80, textAlign:'right'}}
                  value={g.level} onChange={e => update(i, 'level', e.target.value)}/>
              </td>
              <td style={{padding:10}}>
                <input type="color" className="field-input" style={{padding:0, width:60, height:30}}
                  value={g.color} onChange={e => update(i, 'color', e.target.value)}/>
              </td>
              <td style={{padding:10, fontSize:11}} className="dim">
                <input className="field-input" style={{padding:'4px 8px'}} value={g.desc}
                  onChange={e => update(i, 'desc', e.target.value)}/>
              </td>
              <td style={{padding:10, textAlign:'right'}}>
                <button type="button" className="btn btn-small" onClick={() => remove(i)}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}} disabled={g.id === "admin" || g.id === "guest"}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" className="btn btn-small" style={{marginTop:20}}
        onClick={() => { if (confirm("기본값으로 되돌립니다. 진행할까요?")) { window.BGNJ_SAVE.resetGrades(); setGrades(window.BGNJ_STORES.grades.slice()); } }}>
        기본값 복원
      </button>
    </>
  );
};

// === Admin: Column Editor (Tiptap column preset — inline draggable images)
const AdminColumnEditor = () => {
  const [editingId, setEditingId] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("왕의 미학");
  const [excerpt, setExcerpt] = React.useState("");
  const [html, setHtml] = React.useState("");
  const [text, setText] = React.useState("");
  const [publishAt, setPublishAt] = React.useState("");
  const [editorKey, setEditorKey] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [tick, setTick] = React.useState(0);
  const [msg, setMsg] = React.useState("");

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

  const save = (status) => {
    setMsg("");
    if (!validate(status)) return;
    const payload = buildPayload(status);
    window.BGNJ_COLUMNS.saveColumn(payload);
    setTick((v) => v + 1);
    const label = status === 'published' ? '발행' : status === 'scheduled' ? '예약 발행' : '임시 저장';
    setMsg(`"${payload.title}" ${label} 완료.`);
    if (status === 'published') reset();
    else setEditingId(payload.id);
  };

  const remove = (id) => {
    if (!confirm("이 칼럼을 삭제하시겠어요?")) return;
    window.BGNJ_COLUMNS.deleteColumn(id);
    setTick((v) => v + 1);
    if (editingId === id) reset();
  };

  const unpublish = (id) => {
    if (!confirm("이 칼럼을 발행 취소(임시 저장으로 되돌림)하시겠어요?")) return;
    const col = window.BGNJ_COLUMNS.getColumn(id);
    if (!col) return;
    window.BGNJ_COLUMNS.saveColumn({ ...col, status: 'draft', publishAt: null, publishedAt: null });
    setTick((v) => v + 1);
  };

  const statusBadge = (s) => {
    const map = {
      draft: { label: 'DRAFT', color: 'var(--ink-3)' },
      scheduled: { label: 'SCHEDULED', color: 'var(--ink-2)' },
      published: { label: 'PUBLISHED', color: 'var(--gold)' },
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
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="col-cat">카테고리</label>
            <select id="col-cat" className="field-input" value={category}
              onChange={e => setCategory(e.target.value)}>
              <option value="왕의 미학">왕의 미학</option>
              <option value="군주의 언어">군주의 언어</option>
              <option value="공간의 철학">공간의 철학</option>
              <option value="현대의 독법">현대의 독법</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="col-excerpt">발췌 (선택)</label>
          <textarea id="col-excerpt" className="field-input" rows={2}
            value={excerpt} onChange={e => setExcerpt(e.target.value)}
            placeholder="목록에 표시될 짧은 소개 — 비우면 본문 앞부분에서 자동 추출"/>
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
        {msg && <div role="status" className="mono gold" style={{fontSize:12, padding:10, border:'1px solid var(--gold-dim)', background:'rgba(212,175,55,0.06)', marginBottom:16}}>{msg}</div>}
        <div style={{display:'flex', gap:12, justifyContent:'flex-end', paddingTop:20, borderTop:'1px solid var(--line)', flexWrap:'wrap'}}>
          <button type="button" className="btn" onClick={reset}>초기화</button>
          <button type="button" className="btn" onClick={() => save('draft')}>임시 저장</button>
          <button type="button" className="btn" onClick={() => save('scheduled')} disabled={!publishAt}>예약 발행</button>
          <button type="submit" className="btn btn-gold">즉시 발행 →</button>
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
                  borderColor: statusFilter === f.key ? 'var(--gold)' : 'var(--line)',
                  color: statusFilter === f.key ? 'var(--gold)' : 'var(--ink-2)',
                  background: statusFilter === f.key ? 'rgba(212,175,55,0.06)' : 'transparent',
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
                    예약 시각 · {new Date(c.publishAt).toLocaleString('ko-KR')}
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

Object.assign(window, { LoginPage, AdminPage, AdminCategoryPanel, AdminGradePanel, AdminColumnEditor, AdminDenied, LectureAdminPanel, BankAccountPanel, BookOrderAdminPanel, TourAdminPanel, MemberAdminPanel, LegalAdminPanel, FaqAdminPanel, AuditLogPanel, SiteContentAdminPanel });

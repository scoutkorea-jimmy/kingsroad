// 로그인, 회원가입, 관리자 페이지
const AUTH_CONFIG = {
  mode: "local-first",
  adminEmail: "admin@admin.admin",
  adminPassword: "admin",
  note: "현재 인증은 GitHub Pages 정적 배포에 맞춘 local-first 구조입니다. 회원 정보와 세션은 브라우저에 저장되지만, 이후 외부 DB로 확장할 수 있도록 계정 저장소와 세션 저장소를 분리해두었습니다.",
};

const LoginPage = ({ go, setUser }) => {
  const [mode, setMode] = React.useState("login"); // login | signup
  const [form, setForm] = React.useState({
    name: "", email: "", password: "", password2: "",
    birthdate: "", phone: "", zip: "", addr1: "", addr2: "",
    gender: "", interest: "", recommender: "",
    consentTerms: false, consentMarketing: false, consentThirdParty: false,
  });
  const set = (k, v) => setForm({ ...form, [k]: v });

  const submit = () => {
    const normalizedEmail = (form.email || "").trim().toLowerCase();
    const password = form.password || "";

    if (!normalizedEmail) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (mode === "signup") {
      if (!form.name.trim()) {
        alert("회원가입 시 이름을 입력해주세요.");
        return;
      }
      if (password.length < 8) {
        alert("비밀번호는 8자 이상으로 입력해주세요.");
        return;
      }
      if (password !== form.password2) {
        alert("비밀번호 확인이 일치하지 않습니다.");
        return;
      }
      if (!form.consentTerms) {
        alert("이용약관 및 개인정보 처리방침 동의가 필요합니다.");
        return;
      }
    }

    const authResult = mode === "login"
      ? window.WSD_AUTH.signIn({ email: normalizedEmail, password })
      : window.WSD_AUTH.signUp({
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
            interest: form.interest,
            recommender: form.recommender,
          },
          consents: {
            terms: true,
            marketing: form.consentMarketing,
            thirdParty: form.consentThirdParty,
          },
        });

    if (!authResult.ok) {
      alert(authResult.message);
      return;
    }

    setUser(authResult.user);
    go(authResult.user.isAdmin ? "admin" : "home");
  };

  return (
    <div style={{minHeight:'calc(100vh - 72px)', display:'grid', gridTemplateColumns:'1fr 1fr'}} className="auth-grid">
      {/* Left: art */}
      <div style={{
        background:`linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 100%)`,
        borderRight:'1px solid var(--line)',
        padding:'80px 60px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
      }}>
        <div>
          <IlwolMark size={36}/>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginTop:24}}>WANGSADEUL · 王사들</div>
        </div>
        <div style={{maxWidth:480}}>
          <div className="card" style={{padding:'14px 16px', marginBottom:24, background:'rgba(212,175,55,0.05)'}}>
            <div className="mono gold" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>AUTH STATUS</div>
            <p className="dim" style={{fontSize:12, lineHeight:1.8, marginBottom:10}}>
              {AUTH_CONFIG.note}
            </p>
            <div className="mono dim-2" style={{fontSize:11}}>
              관리자 임시 계정: {AUTH_CONFIG.adminEmail} / {AUTH_CONFIG.adminPassword}
            </div>
          </div>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:16}}>
            {mode === "login" ? "— WELCOME BACK" : "— JOIN US"}
          </div>
          <h2 style={{fontFamily:'var(--font-serif)', fontSize:48, fontWeight:500, lineHeight:1.15, marginBottom:20}}>
            다섯 봉우리 아래<br/>
            <span className="gold" style={{fontStyle:'italic'}}>왕사들</span>이 되다
          </h2>
          <p className="dim" style={{fontSize:15, lineHeight:1.9}}>
            왕사들은 단순 구독 플랫폼이 아닙니다. 질문하는 독자, 답사하는 독자, 쓰는 독자들이 모인 광장입니다. 매달 새로운 칼럼과 답사가 이어집니다.
          </p>
        </div>
        <div style={{opacity:0.5}}>
          <Ilwolobongdo lineStyle="dashed" intensity={0.6} interactive={false} className="ilwol-svg"/>
        </div>
      </div>
      {/* Right: form */}
      <div style={{padding:'80px 60px', display:'grid', placeItems:'center'}}>
        <div style={{width:'100%', maxWidth:400}}>
          <div style={{display:'flex', gap:0, marginBottom:40, borderBottom:'1px solid var(--line)'}}>
            {[{k:"login", l:"로그인"}, {k:"signup", l:"회원가입"}].map(t => (
              <button key={t.k}
                onClick={() => setMode(t.k)}
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
                placeholder="hello@wangsadeul.kr"/>
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
                    추가 정보 입력 (선택 · 커뮤니티 운영에 도움이 됩니다)
                  </summary>
                  <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.7}}>
                    아래 항목은 모두 <strong>선택</strong>입니다. 입력하지 않아도 서비스 이용에 제한이 없습니다. 수집된 정보는 GDPR/PIPA에 따라 관리되며, 언제든 열람·정정·삭제할 수 있습니다.
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
                      <option value="palace">궁궐 답사</option>
                      <option value="history">조선 역사</option>
                      <option value="philosophy">동양 철학</option>
                      <option value="literature">한문학</option>
                      <option value="architecture">전통 건축</option>
                      <option value="art">미술사</option>
                    </select>
                  </div>

                  <div className="field" style={{marginBottom:0}}>
                    <label className="field-label" htmlFor="auth-ref">추천인 이메일</label>
                    <input id="auth-ref" type="email" className="field-input"
                      value={form.recommender} onChange={e => set('recommender', e.target.value)}
                      placeholder="추천해준 분이 있다면 이메일 입력"/>
                  </div>
                </details>

                <label htmlFor="consent-terms" style={{display:'flex', gap:10, alignItems:'flex-start', margin:'16px 0', fontSize:12, color:'var(--ink-2)', lineHeight:1.6}}>
                  <input id="consent-terms" type="checkbox" required aria-required="true"
                    checked={form.consentTerms} onChange={e => set('consentTerms', e.target.checked)}
                    style={{accentColor:'var(--gold)', marginTop:3}}/>
                  <span>이용약관 및 개인정보 처리방침에 동의합니다 <span className="gold">(필수)</span></span>
                </label>
                <label htmlFor="consent-marketing" style={{display:'flex', gap:10, alignItems:'flex-start', marginBottom:10, fontSize:12, color:'var(--ink-2)', lineHeight:1.6}}>
                  <input id="consent-marketing" type="checkbox"
                    checked={form.consentMarketing} onChange={e => set('consentMarketing', e.target.checked)}
                    style={{accentColor:'var(--gold)', marginTop:3}}/>
                  <span>뱅기노자 칼럼 · 답사 일정 메일 수신 (선택)</span>
                </label>
                <label htmlFor="consent-third" style={{display:'flex', gap:10, alignItems:'flex-start', marginBottom:20, fontSize:12, color:'var(--ink-2)', lineHeight:1.6}}>
                  <input id="consent-third" type="checkbox"
                    checked={form.consentThirdParty} onChange={e => set('consentThirdParty', e.target.checked)}
                    style={{accentColor:'var(--gold)', marginTop:3}}/>
                  <span>파트너 기관(국립고궁박물관 등) 행사 안내 제3자 제공 (선택)</span>
                </label>
              </>
            )}
            {mode === "login" && (
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, fontSize:12}}>
                <label htmlFor="keep-login" style={{display:'flex', gap:8, alignItems:'center', color:'var(--ink-2)'}}>
                  <input id="keep-login" type="checkbox" style={{accentColor:'var(--gold)'}}/>로그인 유지
                </label>
              <button type="button" className="btn-ghost" style={{color:'var(--gold)'}}>비밀번호 찾기</button>
            </div>
          )}
            <button type="submit" className="btn btn-gold btn-block">
              {mode === "login" ? "입장하기 →" : "회원가입 →"}
            </button>
          </form>

          <div style={{margin:'32px 0', display:'flex', alignItems:'center', gap:16, color:'var(--ink-3)', fontSize:11, fontFamily:'var(--font-mono)', letterSpacing:'0.2em'}}>
            <div style={{flex:1, height:1, background:'var(--line)'}}/>
            <span>OR</span>
            <div style={{flex:1, height:1, background:'var(--line)'}}/>
          </div>

          <button className="btn btn-block" style={{marginBottom:10}}>네이버로 계속하기</button>
          <button className="btn btn-block">카카오로 계속하기</button>
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
    { id: "ROPA-01", purpose: "회원 식별·계정 운영",   lawful: "계약 이행",     items: "이름, 이메일, 비밀번호(해시)", retention: "탈퇴 후 즉시 파기", controller: "왕사들", processor: "AWS(서울)", transfer: "없음" },
    { id: "ROPA-02", purpose: "결제 및 주문 처리",     lawful: "계약 이행",     items: "주소, 전화번호, 카드토큰",     retention: "전자상거래법 5년",   controller: "왕사들", processor: "토스페이먼츠", transfer: "없음" },
    { id: "ROPA-03", purpose: "마케팅·뉴스레터",       lawful: "명시적 동의",   items: "이메일, 관심분야",             retention: "철회 시 즉시",       controller: "왕사들", processor: "Mailgun(US)", transfer: "미국(SCCs)" },
    { id: "ROPA-04", purpose: "사이트 분석·개선",      lawful: "정당한 이익",   items: "쿠키ID, 접속로그, UA",         retention: "13개월",             controller: "왕사들", processor: "Plausible(EU)", transfer: "EU(적정성)" },
    { id: "ROPA-05", purpose: "투어 참가자 관리",      lawful: "계약 이행",     items: "이름, 연락처, 참가일자",       retention: "행사 종료 후 6개월", controller: "왕사들", processor: "자체",         transfer: "없음" },
  ],
  cookies: [
    { name: "wsd_session", cat: "필수",  purpose: "로그인 상태 유지",   ttl: "세션",   party: "1st" },
    { name: "wsd_route",   cat: "필수",  purpose: "마지막 방문 경로",   ttl: "영구(로컬)", party: "1st" },
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
  auditLog: [
    { ts: "2026-04-20T14:12:33+09:00", actor: "banginoja@wangsadeul.kr", action: "DSR-2026-039 정정 승인", ip: "203.0.113.21" },
    { ts: "2026-04-20T13:05:11+09:00", actor: "banginoja@wangsadeul.kr", action: "회원 #8734 개인정보 열람 내보내기", ip: "203.0.113.21" },
    { ts: "2026-04-20T10:40:02+09:00", actor: "system", action: "보유기간 만료 로그 파기(3개월)", ip: "—" },
    { ts: "2026-04-19T17:22:51+09:00", actor: "kim-admin@wangsadeul.kr", action: "ROPA-03 수탁처 변경 검토", ip: "203.0.113.45" },
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
    version: "00.016.000",
    date: "2026-04-25",
    summary: "Cycle 4(뱅기노자 책 판매) 출시. 회원 전용 무통장 입금 단일 흐름으로 책 주문 → 입금 → 발송 → 배송 완료 사이클을 닫고, 관리자 콘솔의 메뉴 명칭을 홈페이지 내비와 일치시켰습니다(커뮤니티 / 강연 / 투어 프로그램 / 뱅기노자 칼럼 / 왕의길).",
    details: [
      "`WSD_BOOK_ORDERS` helper 신설 — listAll / listByStatus / listMine / getOrder / createOrder / confirmPayment / unconfirmPayment / markShipped(tracking) / markDelivered / cancelOrder / exportCsv. 주문번호는 `WSD-YYYYMMDD-NNN` 시퀀스로 자동 생성.",
      "`WSD_STORES.bookOrders` 신설 — 단일 배열에 모든 주문 보관(상태 머신: pending_payment → paid → shipped → delivered, 또는 cancelled).",
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
      "내비 `커뮤니티` 항목에 hover/포커스 시 게시판 서브메뉴(메가메뉴) 표시. WSD_STORES.categories 중 사용자 등급으로 볼 수 있는 항목을 자동 노출하고 클릭 시 sessionStorage(`wsd_pending_board_id`) 경유로 해당 게시판 탭이 선택됨.",
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
      "`WSD_LECTURES` helper 신설 — listAll / getLecture / saveLecture / deleteLecture / register / cancelRegistration / confirmPayment / unconfirmPayment / getSeats / hasUserRegistered / listMyRegistrations / generateIcs / downloadIcs / getBankAccount / saveBankAccount.",
      "`WSD_STORES`에 `lectureOverrides` / `lectureRegistrations` / `bankAccount` 신설. 시드 강연(`WANGSADEUL_DATA.lectures`)은 capacity / price / startsAt / durationMinutes를 갖도록 확장.",
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
      "`WSD_COLUMNS` helper 신설 — listAll / listPublic / getColumn / saveColumn / deleteColumn / searchPublic / estimateReadTime / 자동 promote.",
      "콘텐츠는 `WSD_STORES.userColumns`(`status` = draft / scheduled / published)에 통합 저장. 좋아요·조회수는 `WSD_STORES.columnEngagement` 맵으로 분리(시드 칼럼도 동일).",
      "관리자 칼럼 에디터에 `임시 저장 / 예약 발행 / 즉시 발행 / 발행 취소 / 수정` 버튼과 상태 필터(전체/발행/예약/임시) 추가. DRAFT / SCHEDULED / PUBLISHED 배지로 상태 가시화.",
      "공개 칼럼 페이지에 검색 입력 / 카테고리 토글 / 카드별 ♥·조회수 인디케이터 / 추정 읽기 시간 자동 계산 도입.",
      "칼럼 상세에 ♥ 공감 토글 + 공유 링크 복사(`#col-{id}` 해시) + 댓글(등록 / 삭제 / 등급 배지) + 이전/다음 네비게이션 추가.",
      "App에 URL 해시 라우팅 추가: `#col-{id}` → 칼럼 상세, `#post-{id}` → 커뮤니티 상세.",
      "홈 추천 칼럼과 관리자 대시보드 카운트가 `WSD_COLUMNS.listPublic()`을 사용하도록 정리 — draft/scheduled은 더 이상 공개 화면에 새지 않음.",
      "KMS 기능정의서 미션 3(칼럼) 영역을 위 변경에 맞게 재기록.",
    ],
    context: "Cycle 2의 목표는 '칼럼이 한 번 발행되고 끝나는 일회성 흐름'을 닫는 것이었습니다. 발행 사이클(임시→예약→발행→발행취소)과 독자 상호작용(공감·공유·댓글)이 같이 들어와야 비로소 콘텐츠가 자산으로 누적되기 때문에, 두 흐름을 한 PR에 묶었습니다. RSS와 이메일 구독은 외부 인프라가 필요해 후속 사이클로 미뤘고, 대신 URL 해시 딥 링크를 도입해 단기 공유는 작동하게 했습니다.",
  },
  {
    version: "00.012.000",
    date: "2026-04-25",
    summary: "Cycle 1(왕사들 커뮤니티 마무리)을 한 PR에 묶었습니다. 좋아요·북마크·신고·댓글 알림·작성자 등급 배지·게시글 페이지네이션을 모두 도입해 단순 게시판이었던 흐름을 '커뮤니티'로 끌어올렸습니다. 관리자 콘솔에는 신고 운영 큐 탭이 새로 들어왔고, 마이페이지에는 북마크와 알림 카드가 추가됐습니다.",
    details: [
      "커뮤니티 글 상세에 `좋아요(♥)` 토글 도입 — 누른 사용자 ID를 글에 보존하고, 상세/액션/목록에서 수치를 모두 같은 값으로 표시.",
      "글 상세에 `북마크(★/☆)` 토글과 마이페이지 BOOKMARKS 카드 도입(`WSD_STORES.bookmarks` 신설).",
      "글 상세 `신고` 버튼을 사유 입력 폼으로 확장하고, 관리자 콘텐츠 메뉴에 `신고` 탭 신설(필터: 미처리/처리 완료/반려/전체, 액션: 게시글 열기 / 처리 완료 / 반려 / 게시글 삭제+처리).",
      "댓글 등록 시 본인 글이 아니면 작성자에게 알림이 쌓이도록 연결(`WSD_STORES.notifications`). 내비게이션에 ◇ 알림 벨과 미읽음 배지·드롭다운 추가, 마이페이지 NOTIFICATIONS 카드도 동시 노출.",
      "글 목록 / 글 상세 / 댓글 작성자에 회원 등급 배지(`AuthorGradeBadge`)를 인라인 표시. `WSD_USER_GRADE` / `WSD_AUTHOR_GRADE` helper 신설.",
      "커뮤니티 글 목록에 페이지네이션(10건/페이지) 추가. 검색·탭이 바뀌면 1페이지로 리셋.",
      "관리자 CSV 다운로드 헤더에 `likes` 컬럼 추가.",
      "외부 진입(알림 클릭 / 신고 큐 / 마이페이지 카드)에서 글 상세로 점프할 때 `sessionStorage.wsd_pending_post_id` 패턴을 도입.",
      "KMS 기능정의서 미션 1(커뮤니티) 영역을 위 변경에 맞게 재기록.",
    ],
    context: "Cycle 1의 목표는 '커뮤니티가 게시판처럼 보이는 문제'를 닫는 것이었습니다. 글의 흐름은 이미 살아 있었지만 사용자가 다른 사람의 반응(좋아요/등급/알림)을 거의 느끼지 못해 참여 동기가 약했습니다. 이번 PR은 그 사회적 신호를 한 번에 깔고, 운영자가 신고를 처리할 수 있는 큐까지 같이 붙였습니다. 결제 의존이 없는 영역이라 한 사이클에 묶어 끝내는 것이 ROI가 가장 컸습니다.",
  },
  {
    version: "00.011.000",
    date: "2026-04-25",
    summary: "기능정의서를 사이트의 5가지 미션(왕사들 커뮤니티 / 뱅기노자 강연 일정 / 뱅기노자 칼럼 / 뱅기노자 투어 프로그램 / 뱅기노자 책 판매) + 공통 기반(BASE) 영역 단위로 재정렬하고, 각 영역에 `현재 평가 / 없는 기능 / 기능별(요소·기술 스펙·유의할 점·개발 이슈) / 영역 차원 기술 스펙·유의할 점·개발 이슈` 표준 블록을 도입했습니다. 관리자 KMS 화면에는 우측 스티키 목차(TOC)를 추가해 영역 간 이동을 빠르게 만들었습니다.",
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
      "대시보드가 `WSD_AUTH`, `WSD_COMMUNITY`, `WSD_STORES`, `WANGSADEUL_DATA`를 기준으로 실제 수치를 보여주도록 바뀌었습니다.",
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
      "`communityPosts` 저장소와 `WSD_COMMUNITY` helper를 추가해 게시글/댓글 흐름을 한 계층으로 묶었습니다.",
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
      "`WSD_AUTH`, `WSD_DB`, `WSD_STORES.session`, `WSD_STORES.users`를 도입해 인증과 데이터 저장 구조를 분리했습니다.",
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
//   1) 왕사들 커뮤니티 운영
//   2) 뱅기노자 강연 일정 안내
//   3) 뱅기노자 칼럼 공유
//   4) 뱅기노자 투어 프로그램 판매·운영
//   5) 뱅기노자 책 판매
const MISSION_OVERVIEW = [
  {
    id: "community",
    number: "01",
    title: "왕사들 커뮤니티",
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
    short: "답사 프로그램 카탈로그와 예약 진입.",
    state: "카탈로그",
    coverage: "기능 20%",
    verdict: "5개 미션 중 가장 약하다. 예약·결제·정원·환불·관리자 운영 모두 부재하여 '판매'라고 부를 수 없다.",
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
          "히어로(일월오봉도 SVG, 슬로건, CTA) — 레이아웃 토글 center / split / fullbleed",
          "공지사항(`data.notices` 상위 2건 강조 + 행 리스트)",
          "왕사남 강연 일정(3열 카드)",
          "투어 프로그램(2열 카드)",
          "뱅기노자 칼럼(피처 1 + 사이드 4)",
          "파트너십(3열)",
          "책 구매 CTA",
          "푸터 배포 버전 카드",
        ],
        techSpec: "`HomePage` 단일 컴포넌트. 데이터는 `WANGSADEUL_DATA` 정적 + `WSD_STORES.userColumns` 병합. 레이아웃은 `tweaks.heroLayout`으로 토글.",
        caution: "히어로 통계 수치는 하드코딩이라 실제 운영 수치와 어긋날 수 있음. 운영 화면(대시보드)과 동기화하기 전에는 '데모'로 봐야 함.",
        issues: ["fullbleed 모드에서 일월오봉도 SVG가 과하게 강조되어 본문 가독성을 해치는 케이스 → radial-gradient 마스크로 완화"],
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
        techSpec: "`WSD_AUTH` helper + `WSD_STORES.users` / `WSD_STORES.session` localStorage. 비밀번호는 브라우저 내 해시.",
        caution: "local-first 인증이라 정적 배포 위에서만 동작. 외부 DB 연동 시 저장소만 교체하는 방향으로 설계되었으므로 계층 분리를 깨지 말 것.",
        issues: [
          "P1 초기에는 화면에서 즉석 user 객체를 만드는 수준이었음 → `WSD_AUTH` / `WSD_DB` 분리로 통합",
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
        techSpec: "`MyPage` 단일 컴포넌트. `user` 세션 + `WSD_STORES.grades` + `WSD_COMMUNITY.listPosts()` + `WANGSADEUL_DATA.lectures/tours` + `cart` 상태.",
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
        techSpec: "`AdminPage` 단일 컴포넌트. `WSD_COMMUNITY` / `WSD_AUTH` / `WSD_STORES` / `WANGSADEUL_DATA` / `PRIVACY_DATA` 동시 참조. 비관리자는 `AdminDenied` 화면.",
        caution: "관리자 콘솔이 단일 컴포넌트라 1900줄을 넘는다. 새 탭 추가 시 분할을 고려할 것.",
        issues: [
          "P1까지는 관리자 게시글 탭이 사용자 게시판과 다른 mock 배열을 봤음 → P2에서 `WSD_COMMUNITY`로 통합",
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
        techSpec: "문서는 정적 마크다운 + 관리자 화면이 같은 내용을 컴포넌트로 표시. `window.WSD_VERSION`이 푸터·관리자 빌드 표시의 단일 출처.",
        caution: "문서와 화면이 어긋나면 다음 작업자가 혼선을 일으킨다. KMS 화면 = `kms.md` 본문 = 같은 기준으로 동기화 유지.",
        issues: [],
      },
    ],
    techSpec: "프론트 단일 SPA(React UMD + Babel standalone) + localStorage 기반 저장소(`WSD_STORES`) + helper 계층(`WSD_AUTH`, `WSD_COMMUNITY`, `WSD_SAVE`). 외부 DB 연동 시 helper는 유지하고 저장소 구현만 교체하는 구조.",
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
    label: "왕사들 커뮤니티",
    title: "미션 1 — 왕사들 커뮤니티 운영",
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
        techSpec: "`WSD_COMMUNITY.listPosts()` → `WSD_STORES.communityPosts` localStorage. 카테고리는 `WSD_STORES.categories` 중 `boardType === 'community'`. 페이지 상태(`page`)는 검색·탭 변경 시 1로 리셋.",
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
        techSpec: "`WSD_COMMUNITY.createPost / updatePost / deletePost`. 권한은 작성자 본인 혹은 `user.isAdmin`. Tiptap은 `window.WSD_TIPTAP`으로 ESM 주입.",
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
        techSpec: "`WSD_STORES.comments[postId]` 배열. push / filter로 처리.",
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
        techSpec: "상세 진입 시 `views += 1` 후 `WSD_SAVE.communityPosts()` 호출.",
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
        techSpec: "`WSD_STORES.categories` 메타에 권한 플래그 보유, 컴포넌트 단에서 검사.",
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
        techSpec: "`WSD_COMMUNITY.exportCsv()` + `WSD_COMMUNITY.deletePost(id)`. 사용자 화면과 동일 저장소.",
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
        techSpec: "`WSD_COMMUNITY.toggleLike(postId, userId)` → `post.likes`(userId 배열). `hasLiked / getLikes`로 상태 조회. 글 저장 시 같이 직렬화.",
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
        techSpec: "`WSD_STORES.bookmarks` = `{ userId: [postId, ...] }`. `WSD_COMMUNITY.toggleBookmark / isBookmarked / getBookmarks / listBookmarkedPosts`.",
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
        techSpec: "`WSD_STORES.reports` 배열. `WSD_COMMUNITY.addReport / listReports(filter) / updateReportStatus / countOpenReports`. 상태: open / resolved / dismissed.",
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
        techSpec: "`WSD_STORES.notifications` = `{ userId: [ {id, type, postId, postTitle, fromName, message, createdAt, read} ] }`. 댓글 등록 시 `addNotification(post.authorId, ...)` 호출(본인 글 제외, authorId 있을 때만). 게시글 점프는 `sessionStorage.wsd_pending_post_id` 후 `go('community')`.",
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
        techSpec: "`WSD_USER_GRADE(user)` + `WSD_AUTHOR_GRADE({authorId, author, authorEmail})`. 등급 색상은 `WSD_STORES.grades`의 `color`.",
        caution: "시드 글 작성자(돌담아래 등)는 가입 사용자가 아니므로 배지가 표시되지 않음. 추후 시드 데이터를 가입 회원과 매칭하면 자동으로 채워짐.",
        issues: [],
      },
    ],
    techSpec: "`WSD_COMMUNITY` helper + `WSD_STORES.communityPosts / comments / categories / bookmarks / reports / notifications` localStorage. 외부 DB 교체 시 helper는 유지하고 저장소 구현만 교체.",
    cautions: [
      "localStorage 한계 → 이미지·알림·신고 누적 시 quota 초과",
      "권한 검사가 클라이언트 단 → 외부 DB 도입 시 서버 측 정책 필수",
      "사용자 화면 ↔ 관리자 화면이 같은 저장소를 본다는 가정이 P2 통합의 핵심이므로 깨지지 않게 유지",
      "라우팅은 글로벌 App 상태에 묶여 있어 외부 진입 시 `sessionStorage.wsd_pending_post_id` 패턴을 사용",
    ],
    issues: [
      "사용자 작성 글 / 시드 글이 다른 키에 저장되어 있던 P1 → `ensureCommunityPostsSeeded`로 마이그레이션",
      "관리자와 사용자 화면이 다른 mock 배열을 보던 P1 → `WSD_COMMUNITY` 단일 helper로 수렴",
      "Cycle 1에서 좋아요/북마크/신고/알림/등급 배지/페이지네이션을 한 PR에 묶음. 데이터 모델 6개를 동시에 도입하느라 helper 수가 크게 늘어났으므로, 다음 도메인 작업에서는 helper 명명을 `WSD_<DOMAIN>` 단위로 묶을지 재검토 필요",
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
        techSpec: "`WSD_LECTURES.listAll() / getLecture / getSeats`. 시드는 `WANGSADEUL_DATA.lectures`, 관리자가 수정한 항목은 `WSD_STORES.lectureOverrides`에 저장 후 머지.",
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
        techSpec: "`WSD_LECTURES.register({lectureId, userId, name, email, phone, count, note})`. 같은 사용자가 같은 강연에 두 번 신청 못 하도록 `hasUserRegistered`로 가드. 취소 시 `_promoteWaitlist`가 자동 실행되어 가장 오래된 대기자를 승격.",
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
        techSpec: "`WSD_LECTURES.confirmPayment(lectureId, registrationId)` → `paid: true`, `status: 'confirmed'`. `unconfirmPayment`로 되돌릴 수 있음. `cancelRegistration`은 좌석을 돌려놓고 `_promoteWaitlist` 실행.",
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
        techSpec: "`WSD_LECTURES.getBankAccount() / saveBankAccount(payload)` → `WSD_STORES.bankAccount`. 비어 있으면 사용자 신청 시 '운영자에게 문의' 안내.",
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
        techSpec: "`WSD_LECTURES.listMyRegistrations(user.id)`로 모든 강연을 가로지르며 본인 등록만 모음. 강연 점프는 `sessionStorage.wsd_pending_lecture_id` 패턴 사용.",
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
        techSpec: "`WSD_LECTURES.generateIcs(lecture)` → RFC 5545 형식 문자열. `downloadIcs(lectureId)`가 Blob을 만들어 클릭 다운로드.",
        caution: "`startsAt` ISO + `durationMinutes`가 있어야 정상 생성됨. 운영자가 강연을 새로 만들 때 두 필드를 채우도록 강제할 것.",
        issues: [],
      },
      {
        name: "URL 해시 딥 링크 / 홈 카드 연결",
        status: "구현됨",
        summary: "`#lecture-{id}`로 강연 상세를 외부 공유. 홈 강연 카드 클릭은 `lectures` 라우트로 직접 점프.",
        elements: [
          "App `applyHash`가 `#lecture-{id}` 매칭 시 `lectures` 라우트로 이동 + sessionStorage 셋",
          "홈 강연 카드 onClick → `wsd_pending_lecture_id` + `go('lectures')`",
        ],
        techSpec: "`index.html` App `useEffect` 라우트 해시 + `sessionStorage` 페치. 강연 페이지 mount에서 pending id 읽고 setSelectedId.",
        caution: "라우트가 글로벌 App 상태에 묶여 있어 외부 진입은 sessionStorage 패턴을 그대로 따른다.",
        issues: [],
      },
    ],
    techSpec: "`WSD_LECTURES` helper + `WANGSADEUL_DATA.lectures`(시드) + `WSD_STORES.lectureOverrides`(관리자 수정분 머지) + `WSD_STORES.lectureRegistrations`(`{lectureId: registration[]}`) + `WSD_STORES.bankAccount`. 회원 식별은 `user.id`, 결제 정책은 `price === 0` 분기.",
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
        techSpec: "`WSD_COLUMNS.searchPublic({query, category})` → `WSD_COLUMNS.listPublic()`(자동 promote 후 published만) + 검색 필터. 시드 + 사용자 발행 모두 동일 객체 형태.",
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
        techSpec: "`WSD_COLUMNS.getColumn / getLikes / hasLiked / toggleLike / getViews / incrementViews / listComments / addComment / deleteComment`. 좋아요·조회수는 `WSD_STORES.columnEngagement` 맵에 통합 저장. 댓글은 `WSD_COMMUNITY.comments`를 `col-{id}` 키로 재사용.",
        caution: "관리자가 임의 HTML을 넣을 수 있으므로 에디터 정책으로 차단. 사용자 입력에는 절대 dangerouslySetInnerHTML 적용 금지.",
        issues: [
          "Tiptap 본문이 HTML로 직렬화되어 저장되므로 어떤 확장이 활성화돼 있는지를 같이 관리해야 함",
          "라우팅이 글로벌 App 상태에 묶여 있어 외부 진입은 `sessionStorage.wsd_pending_column_id` + `#col-{id}` 해시 조합 사용",
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
        techSpec: "`WSD_COLUMNS.saveColumn(payload)` — `id`(신규/기존 동일 키), `status`('draft'|'scheduled'|'published'), `publishAt`(예약 시), `publishedAt`(즉시 발행 시), `updatedAt` 자동. 페이지 진입마다 `_autoPromote()`가 시간 지난 예약을 published로 승격.",
        caution: "예약 시각은 현재보다 미래여야 하며, datetime-local은 로컬 타임존을 그대로 저장하므로 운영자 PC 시계 기준으로 동작함을 명심.",
        issues: ["발행 취소는 임시 저장 상태로 되돌리며, 칼럼 콘텐츠는 보존되지만 공개에서는 즉시 사라짐"],
      },
      {
        name: "홈 추천 칼럼",
        status: "구현됨",
        summary: "메인 홈에 published 사용자 칼럼 + 시드를 묶어 피처 1 + 사이드 4 노출.",
        elements: ["피처 카드 1", "사이드 4건"],
        techSpec: "`WSD_COLUMNS.listPublic()`의 상위 항목 사용. draft/scheduled은 자동 제외.",
        caution: "추천 알고리즘이 없어 항상 최신 5건이 노출됨.",
        issues: [],
      },
    ],
    techSpec: "`WSD_COLUMNS` helper + `WSD_STORES.userColumns`(콘텐츠) + `WSD_STORES.columnEngagement`(좋아요·조회수) + `WSD_STORES.comments['col-{id}']`(댓글). 시드는 `WANGSADEUL_DATA.columns`에서 병합.",
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
    role: "뱅기노자가 진행하는 궁궐 답사·역사 답사 프로그램을 판매하고 운영.",
    routes: ["tour(목록·상세)", "home(노출)", "admin > 투어(운영)"],
    status: "카탈로그(부분 구현 — 판매 흐름 부재)",
    evaluation: "5개 미션 중 가장 약한 영역. 카드형 카탈로그까지는 그려져 있지만 예약·결제·정원·환불·관리자 운영 어느 것도 동작하지 않는다. 사용자가 누르는 '예약' 버튼이 실제로는 아무 일도 일어나지 않아 운영자에게 잘못된 신호를 줄 수 있다.",
    missing: [
      "투어 신청 폼(회차 · 인원 · 대표자 · 동행자)",
      "결제 게이트웨이 연동",
      "회차별 좌석 / 대기열 관리",
      "참가자 명단 · 체크인",
      "환불 · 취소 정책 · 환불 처리",
      "관리자 예약 운영(승인 / 거절 / 메모)",
      "마이페이지 예약 내역 · 이메일 영수증",
      "외국어 안내(영문) 옵션",
      "프로그램 후기 · 평점",
      "이미지 갤러리(현재 카드 한 장)",
      "지도 · 집결지 안내 · 우천 시 운영 정책",
    ],
    features: [
      {
        name: "투어 목록",
        status: "구현됨",
        summary: "전체 답사 프로그램을 카드형으로 노출.",
        elements: [
          "난이도 배지",
          "기간 / 인원 / 가격",
          "다음 일정(`next`)",
          "프로그램 설명",
        ],
        techSpec: "`WANGSADEUL_DATA.tours` 정적 배열을 `WangsanamTourPage`가 카드로 렌더.",
        caution: "데이터가 정적이므로 다음 일정 갱신은 운영자가 직접 코드/문서로 반영해야 함.",
        issues: [],
      },
      {
        name: "투어 상세 카드",
        status: "부분 구현",
        summary: "프로그램 한 건의 상세 정보를 보여줌.",
        elements: [
          "기간 / 인원 / 난이도",
          "다음 일정",
          "가격",
          "설명",
          "이미지 갤러리(미구현)",
          "회차별 일정 캘린더(미구현)",
        ],
        techSpec: "`WangsanamTourPage` 안에서 같은 카드를 사용.",
        caution: "이미지 갤러리·일정 캘린더 부재로 의사결정에 필요한 정보가 부족함.",
        issues: [],
      },
      {
        name: "예약 / 대기자 버튼",
        status: "UI만(미구현)",
        summary: "사용자가 예약 또는 대기자 등록을 시도.",
        elements: ["예약 버튼", "대기자 버튼"],
        techSpec: "현재는 클릭 핸들러가 비어 있거나 정적 알림만 노출.",
        caution: "기능 없는 버튼이 노출되면 사용자 신뢰가 떨어짐. MVP 전까지는 '예약 문의' 형태로 안내하는 것이 안전.",
        issues: ["사용자가 클릭 후 아무 일도 일어나지 않아 운영자에게 잘못된 '관심도' 신호를 줄 수 있음"],
      },
      {
        name: "관리자 투어 탭",
        status: "부분 구현",
        summary: "관리자 콘솔에서 투어 일정을 표 형태로 확인.",
        elements: ["투어 표(목록)"],
        techSpec: "현재는 `data.tours` 동일 데이터를 표로 보여주는 수준.",
        caution: "예약 데이터가 없으므로 운영 화면이 카탈로그와 같은 정보만 갖고 있음.",
        issues: [],
      },
    ],
    techSpec: "`WANGSADEUL_DATA.tours` 정적 데이터에만 의존. 예약 / 결제 / 정원 / 명단 helper 미존재. 도메인 모델 미정의.",
    cautions: [
      "'판매'라는 말이 작동하려면 결제 · 정원 · 환불 셋이 동시에 필요함을 잊지 말 것",
      "결제 도입 전까지는 사용자에게 '문의 접수' 흐름임을 명확히 표시",
      "강연과 한 페이지에 묶여 있다는 점이 신청 흐름 설계에 영향을 줌 → 페이지 분리 결정 선행",
    ],
    issues: [
      "예약 데이터가 없으므로 마이페이지·관리자에서 보여줄 진짜 데이터가 부재",
      "투어와 강연이 같은 페이지를 공유 → 정보 구조 결정이 후속 기능 설계의 전제조건",
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
        techSpec: "`WANGSADEUL_DATA.book` 정적 객체를 `BookPage`가 렌더. 판본/수량은 메모리 `cart` 상태로 보관 후 결제 페이지에 전달.",
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
        techSpec: "`WSD_BOOK_ORDERS.createOrder({userId, version, qty, recipient, phone, address, addressDetail, memo})` → 주문 생성 시 `WSD_STORES.bookOrders`에 push. 계좌는 `WSD_LECTURES.getBankAccount()`로 강연과 공유. 주문번호는 `WSD-YYYYMMDD-NNN` 시퀀스.",
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
        techSpec: "`WSD_BOOK_ORDERS.confirmPayment(id) / unconfirmPayment(id) / markShipped(id, tracking) / markDelivered(id) / cancelOrder(id) / exportCsv()`. 상태 머신: pending_payment → paid → shipped → delivered (혹은 cancelled).",
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
        techSpec: "`WSD_BOOK_ORDERS.listMine(user.id)`로 본인 주문만 모음.",
        caution: "주문이 cancelled 상태로 바뀌면 카드는 남되 컬러로 구분.",
        issues: [],
      },
      {
        name: "관리자 대시보드 카운트",
        status: "구현됨",
        summary: "관리자 대시보드 4개 KPI 중 마지막 슬롯을 '왕의길 주문'으로 교체. 입금 대기 건수 표시.",
        elements: ["전체 주문 수", "입금 대기 카운트(미처리 시 경고 색)"],
        techSpec: "`window.WSD_BOOK_ORDERS.listAll()` + 상태 필터.",
        caution: "필요 시 5번째 슬롯으로 카테고리/투어 등 다시 추가할 수 있음.",
        issues: [],
      },
    ],
    techSpec: "`WSD_BOOK_ORDERS` helper + `WSD_STORES.bookOrders`(주문 단일 배열) + `WSD_STORES.bankAccount`(강연과 공유). 주문번호는 `WSD-YYYYMMDD-NNN`. 회원 식별은 `user.id`.",
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
  const reports = React.useMemo(() => window.WSD_COMMUNITY.listReports(filter), [filter, tick]);
  const counts = React.useMemo(() => ({
    open: window.WSD_COMMUNITY.listReports('open').length,
    resolved: window.WSD_COMMUNITY.listReports('resolved').length,
    dismissed: window.WSD_COMMUNITY.listReports('dismissed').length,
    all: window.WSD_COMMUNITY.listReports('all').length,
  }), [tick]);

  const setStatus = (id, status) => {
    window.WSD_COMMUNITY.updateReportStatus(id, status);
    setTick((v) => v + 1);
  };

  const removePostFromReport = (report) => {
    if (!report.postId) return;
    if (!confirm(`"${report.postTitle}" 게시글을 삭제하고 신고를 처리 완료로 표시하시겠어요?`)) return;
    window.WSD_COMMUNITY.deletePost(report.postId);
    window.WSD_COMMUNITY.updateReportStatus(report.id, 'resolved');
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
                        try { sessionStorage.setItem('wsd_pending_post_id', String(r.postId)); } catch {}
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

  const lectures = React.useMemo(() => window.WSD_LECTURES.listAll(), [tick]);

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
    const lecture = window.WSD_LECTURES.getLecture(editingId);
    if (!lecture) return;
    const startsAtIso = draft.startsAt ? new Date(draft.startsAt).toISOString() : lecture.startsAt;
    const next = draft.next || lecture.next;
    window.WSD_LECTURES.saveLecture({
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

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        강연 정원 / 일정 / 가격을 수정하고, 신청자 입금을 확인해 참가를 확정합니다.
        결제는 현재 <strong className="gold">무통장 입금</strong>만 지원합니다.
        계좌번호는 <button type="button" className="btn-ghost" style={{color:'var(--gold)'}} onClick={() => alert('관리자 메뉴 → 시스템 → 설정 으로 이동해 입력하세요.')}>설정 탭</button>에서 등록합니다.
      </p>

      {lectures.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>관리할 강연이 없습니다.</div>
      ) : (
        <div style={{display:'grid', gap:14}}>
          {lectures.map((l) => {
            const seats = window.WSD_LECTURES.getSeats(l.id);
            const regs = window.WSD_LECTURES.listRegistrations(l.id);
            const active = regs.filter((r) => r.status !== 'cancelled');
            const isEditing = editingId === l.id;
            return (
              <article key={l.id} className="card" style={{padding:20}}>
                <header style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                  <div>
                    <h3 className="ko-serif" style={{fontSize:18}}>
                      <span className="dim-2 mono" style={{fontSize:11, marginRight:8}}>#{String(l.id).padStart(2,'0')}</span>
                      {l.title} — {l.topic}
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
                                    onClick={() => { window.WSD_LECTURES.confirmPayment(l.id, r.id); refresh(); }}>
                                    입금 확인 → 확정
                                  </button>
                                )}
                                {r.status === 'confirmed' && r.price > 0 && (
                                  <button type="button" className="btn btn-small"
                                    onClick={() => { window.WSD_LECTURES.unconfirmPayment(l.id, r.id); refresh(); }}>
                                    확정 취소
                                  </button>
                                )}
                                <button type="button" className="btn btn-small"
                                  onClick={() => {
                                    if (!confirm(`${r.name} 님 신청을 취소 처리하시겠어요?`)) return;
                                    window.WSD_LECTURES.cancelRegistration(l.id, r.id);
                                    refresh();
                                  }}
                                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>취소</button>
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
  const [bank, setBank] = React.useState(() => window.WSD_LECTURES.getBankAccount());
  const [msg, setMsg] = React.useState("");

  const save = (e) => {
    e.preventDefault();
    window.WSD_LECTURES.saveBankAccount(bank);
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
          { k: 'holder',        l: '예금주',   placeholder: '예) 왕사들 협동조합' },
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

  const orders = React.useMemo(() => window.WSD_BOOK_ORDERS.listByStatus(filter), [filter, tick]);
  const counts = React.useMemo(() => ({
    all: window.WSD_BOOK_ORDERS.listAll().length,
    pending_payment: window.WSD_BOOK_ORDERS.listByStatus('pending_payment').length,
    paid: window.WSD_BOOK_ORDERS.listByStatus('paid').length,
    shipped: window.WSD_BOOK_ORDERS.listByStatus('shipped').length,
    delivered: window.WSD_BOOK_ORDERS.listByStatus('delivered').length,
    cancelled: window.WSD_BOOK_ORDERS.listByStatus('cancelled').length,
  }), [tick]);

  const downloadCsv = () => {
    const csv = window.WSD_BOOK_ORDERS.exportCsv();
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
    cancelled: '취소됨',
  }[s] || s);

  const statusTone = (s) => ({
    pending_payment: 'var(--ink-2)',
    paid: 'var(--gold)',
    shipped: 'var(--gold)',
    delivered: 'var(--gold-2)',
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
            { key: 'pending_payment', label: '입금 대기' },
            { key: 'paid',            label: '입금 확인' },
            { key: 'shipped',         label: '배송중' },
            { key: 'delivered',       label: '배송 완료' },
            { key: 'cancelled',       label: '취소' },
            { key: 'all',             label: '전체' },
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
                {o.status === 'pending_payment' && (
                  <button type="button" className="btn btn-small"
                    onClick={() => { window.WSD_BOOK_ORDERS.confirmPayment(o.id); refresh(); }}>
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
                        window.WSD_BOOK_ORDERS.markShipped(o.id, trackingDraft[o.id] || '');
                        refresh();
                      }}>
                      발송 처리
                    </button>
                    <button type="button" className="btn btn-small"
                      onClick={() => { window.WSD_BOOK_ORDERS.unconfirmPayment(o.id); refresh(); }}>
                      입금 확인 취소
                    </button>
                  </>
                )}
                {o.status === 'shipped' && (
                  <>
                    {o.tracking && <span className="mono dim-2" style={{fontSize:11}}>송장 {o.tracking}</span>}
                    <button type="button" className="btn btn-small"
                      onClick={() => { window.WSD_BOOK_ORDERS.markDelivered(o.id); refresh(); }}>
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
                      window.WSD_BOOK_ORDERS.cancelOrder(o.id);
                      refresh();
                    }}
                    style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:'auto'}}>
                    주문 취소
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

// === Admin Page ===================================================
const AdminPage = ({ go }) => {
  const data = window.WANGSADEUL_DATA;
  const [tab, setTab] = React.useState("대시보드");
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [kmsTab, setKmsTab] = React.useState("기능정의서");
  const [postSearch, setPostSearch] = React.useState("");
  const [postFilter, setPostFilter] = React.useState("all");
  const [postRefreshKey, setPostRefreshKey] = React.useState(0);
  const [versionPage, setVersionPage] = React.useState(1);

  const allCommunityPosts = React.useMemo(() => window.WSD_COMMUNITY.listPosts(), [postRefreshKey]);
  const allUsers = React.useMemo(() => window.WSD_AUTH.listUsers(), [postRefreshKey]);
  const allColumns = React.useMemo(() => window.WSD_COLUMNS?.listPublic?.() || [...(window.WSD_STORES.userColumns || []), ...data.columns], [postRefreshKey]);
  const totalComments = React.useMemo(
    () => Object.values(window.WSD_STORES.comments || {}).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0),
    [postRefreshKey]
  );
  const allBookOrders = React.useMemo(() => window.WSD_BOOK_ORDERS?.listAll?.() || [], [postRefreshKey]);
  const pendingBookOrders = allBookOrders.filter((o) => o.status === 'pending_payment').length;
  const dashboardStats = React.useMemo(() => ([
    { l: "전체 회원", v: String(allUsers.length), d: `관리자 ${allUsers.filter((user) => user.isAdmin).length}명 포함`, p: true },
    { l: "커뮤니티 게시글", v: String(allCommunityPosts.length), d: `댓글 ${totalComments}개 누적`, p: true },
    { l: "공개 칼럼", v: String(allColumns.length), d: `관리자 발행 ${(window.WSD_STORES.userColumns || []).filter((c) => (c.status || 'published') === 'published').length}건 · 임시/예약 ${(window.WSD_STORES.userColumns || []).filter((c) => c.status === 'draft' || c.status === 'scheduled').length}건`, p: true },
    { l: "왕의길 주문", v: String(allBookOrders.length), d: `입금 대기 ${pendingBookOrders}건`, p: pendingBookOrders === 0 },
  ]), [allUsers, allCommunityPosts, totalComments, allColumns, data, allBookOrders, pendingBookOrders]);
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

  const tabGroups = [
    { group: "요약",     items: ["대시보드"] },
    // 홈페이지 내비 순서와 동일하게 정렬: 커뮤니티 → 강연 → 투어 프로그램 → 뱅기노자 칼럼 → 왕의길
    { group: "콘텐츠",   items: ["커뮤니티", "신고", "강연", "투어 프로그램", "뱅기노자 칼럼", "칼럼 작성", "왕의길"] },
    { group: "회원",     items: ["회원"] },
    { group: "운영 설정", items: ["카테고리", "회원 등급"] },
    { group: "개인정보", items: ["정보주체 권리", "동의 관리", "처리활동(ROPA)", "쿠키·추적", "보안 사고", "보유·파기", "국외 이전", "감사 로그"] },
    { group: "시스템",   items: ["버전 기록", "KMS", "설정"] },
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
    const blob = new Blob([window.WSD_COMMUNITY.exportCsv()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `community-posts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteCommunityPost = (post) => {
    if (!confirm(`"${post.title}" 게시글을 삭제하시겠어요?`)) return;
    window.WSD_COMMUNITY.deletePost(post.id);
    setPostRefreshKey((value) => value + 1);
  };

  return (
    <div style={{display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'calc(100vh - 72px)'}}>
      {/* Sidebar */}
      <aside aria-label="관리자 메뉴" style={{background:'var(--bg-2)', borderRight:'1px solid var(--line)', padding:'32px 0', overflowY:'auto'}}>
        <div style={{padding:'0 24px 24px', borderBottom:'1px solid var(--line)'}}>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.3em'}}>◆ ADMIN CONSOLE</div>
          <div className="ko-serif" style={{fontSize:20, marginTop:8}}>관리자</div>
          <div className="dim-2 mono" style={{fontSize:11, marginTop:4}}>banginoja@wangsadeul.kr</div>
          <div style={{marginTop:12, padding:'8px 10px', background:'rgba(212,175,55,0.06)', border:'1px solid var(--gold-dim)', fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gold)', letterSpacing:'0.15em'}}>
            DPO · dpo@wangsadeul.kr
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
                    onClick={() => { setTab(t); setSelectedMember(null); }}
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
                KMS의 제1 기능은 기능정의서입니다. 사이트가 존재하는 5가지 미션(왕사들 커뮤니티 / 강연 일정 / 칼럼 / 투어 프로그램 / 책 판매)을 기준으로 현재 어떤 기능이 있고
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
                    왕사들 화면은 일반적인 밝은 SaaS UI가 아니라, 조선 왕실과 전시 도록의 분위기를 유지하는 방향으로 작업해야 합니다.
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
            <div style={{display:'flex', gap:12, marginBottom:20}}>
              <label htmlFor="post-search" className="sr-only">게시글 검색</label>
              <input id="post-search" className="field-input" placeholder="제목 또는 작성자 검색..." style={{flex:1}}
                value={postSearch} onChange={(e) => setPostSearch(e.target.value)}/>
              <select className="field-input" style={{maxWidth:180}} value={postFilter} onChange={(e) => setPostFilter(e.target.value)}>
                <option value="all">전체 분류</option>
                {window.WSD_STORES.categories.filter((item) => item.boardType === "community").map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
              <button type="button" className="btn btn-small" onClick={exportCommunityPosts}>CSV 다운로드</button>
            </div>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>ID</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>분류</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>제목</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>작성자</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>날짜</th>
                  <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
                </tr>
              </thead>
              <tbody>
                {visibleCommunityPosts.map(p => (
                  <tr key={p.id} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="mono dim-2" style={{padding:14}}>#{String(p.id).padStart(4,'0')}</td>
                    <td style={{padding:14}}><span className="badge" style={{fontSize:9}}>{p.category}</span></td>
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

        {/* 투어 */}
        {tab === "투어 프로그램" && (
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
            <thead>
              <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                <th scope="col" style={{padding:12, textAlign:'left'}}>프로그램</th>
                <th scope="col" style={{padding:12, textAlign:'left'}}>난이도</th>
                <th scope="col" style={{padding:12, textAlign:'left'}}>다음 일정</th>
                <th scope="col" style={{padding:12, textAlign:'right'}}>가격</th>
                <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
              </tr>
            </thead>
            <tbody>
              {data.tours.map(t => (
                <tr key={t.id} style={{borderBottom:'1px solid var(--line)'}}>
                  <td className="ko-serif" style={{padding:14, fontSize:14}}>{t.title}</td>
                  <td style={{padding:14}}><span className="badge">{t.level}</span></td>
                  <td className="mono gold" style={{padding:14}}>{t.next}</td>
                  <td className="ko-serif gold-2" style={{padding:14, textAlign:'right'}}>{t.price}</td>
                  <td style={{padding:14, textAlign:'right'}}><button type="button" className="btn btn-small">편집</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 회원 */}
        {tab === "회원" && (
          <div>
            {!selectedMember ? (
              <>
                <p className="dim" style={{fontSize:12, marginBottom:16}}>
                  회원 이메일/이름은 <strong className="gold">개인식별정보(PII)</strong>입니다. 열람 이력은 감사 로그에 자동 기록됩니다.
                </p>
                <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
                  <caption className="sr-only">회원 목록 — 클릭 시 상세 및 개인정보 내보내기</caption>
                  <thead>
                    <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                      <th scope="col" style={{padding:12, textAlign:'left'}}>ID</th>
                      <th scope="col" style={{padding:12, textAlign:'left'}}>닉네임</th>
                      <th scope="col" style={{padding:12, textAlign:'left'}}>이메일</th>
                      <th scope="col" style={{padding:12, textAlign:'left'}}>지역(관할법)</th>
                      <th scope="col" style={{padding:12, textAlign:'left'}}>가입일</th>
                      <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIVACY_DATA.members.map(m => (
                      <tr key={m.id} style={{borderBottom:'1px solid var(--line)'}}>
                        <td className="mono dim-2" style={{padding:14}}>#{m.id}</td>
                        <td className="ko-serif" style={{padding:14}}>{m.handle}</td>
                        <td className="mono" style={{padding:14}}>{m.email}</td>
                        <td style={{padding:14}}><span className="badge" style={{borderColor: m.region==='EU' ? 'var(--gold)' : 'var(--line-2)', color: m.region==='EU' ? 'var(--gold)' : 'var(--ink-2)'}}>{m.region === 'EU' ? 'EU · GDPR' : 'KR · PIPA'}</span></td>
                        <td className="mono dim-2" style={{padding:14}}>{m.joined}</td>
                        <td style={{padding:14, textAlign:'right'}}>
                          <button type="button" className="btn btn-small" onClick={() => setSelectedMember(m)}>상세</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="card">
                <button type="button" className="btn btn-small" onClick={() => setSelectedMember(null)} style={{marginBottom:20}}>← 목록</button>
                <h2 className="ko-serif" style={{fontSize:22, marginBottom:4}}>{selectedMember.handle}</h2>
                <div className="mono dim-2" style={{fontSize:11, marginBottom:24}}>#{selectedMember.id} · {selectedMember.email} · {selectedMember.region === 'EU' ? 'GDPR 관할' : 'PIPA 관할'}</div>
                <dl style={{display:'grid', gridTemplateColumns:'180px 1fr', gap:'8px 24px', fontSize:13, lineHeight:1.8}}>
                  <dt className="dim-2 mono" style={{fontSize:11}}>가입일</dt><dd>{selectedMember.joined}</dd>
                  <dt className="dim-2 mono" style={{fontSize:11}}>활성 동의</dt>
                  <dd>{selectedMember.consents.map(k => {
                    const d = PRIVACY_DATA.consentDefs.find(c => c.key === k);
                    return d ? <span key={k} className="badge" style={{marginRight:6}}>{d.label} {d.version}</span> : null;
                  })}</dd>
                </dl>
                <div style={{marginTop:32, display:'flex', gap:10, flexWrap:'wrap'}}>
                  <button type="button" className="btn btn-gold btn-small" onClick={() => exportMemberData(selectedMember)}>
                    개인정보 스냅샷 다운로드 (Art.15 / §35)
                  </button>
                  <button type="button" className="btn btn-small">정정 요청 생성</button>
                  <button type="button" className="btn btn-small" style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제(잊혀질 권리) 처리</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 왕의길 (책 주문 운영) */}
        {tab === "왕의길" && <BookOrderAdminPanel go={go}/>}

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

        {/* 감사 로그 */}
        {tab === "감사 로그" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.32 · PIPA §29. 관리자 접근 및 개인정보 처리 이력은 모두 기록되며, 90일간 보관됩니다.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>시각</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>주체</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>행위</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>IP</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.auditLog.map((l, i) => (
                  <tr key={i} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="mono dim-2" style={{padding:12}}>{l.ts}</td>
                    <td className="mono" style={{padding:12}}>{l.actor}</td>
                    <td style={{padding:12}}>{l.action}</td>
                    <td className="mono dim-2" style={{padding:12}}>{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* 카테고리 CRUD */}
        {tab === "카테고리" && <AdminCategoryPanel/>}

        {/* 회원 등급 CRUD */}
        {tab === "회원 등급" && <AdminGradePanel/>}

        {/* 칼럼 작성 (관리자 전용, Tiptap column preset — 이미지 본문 삽입/이동 가능) */}
        {tab === "칼럼 작성" && <AdminColumnEditor/>}

        {/* 설정 */}
        {tab === "설정" && (
          <div style={{display:'grid', gap:24}}>
            <BankAccountPanel/>

            <div className="card">
              <h2 className="ko-serif" style={{fontSize:20, marginBottom:16}}>사이트 설정</h2>
              <dl style={{display:'grid', gridTemplateColumns:'200px 1fr', gap:'8px 24px', fontSize:13, lineHeight:1.8}}>
                <dt className="dim-2 mono" style={{fontSize:11}}>DPO</dt><dd>dpo@wangsadeul.kr · 02-0000-0001</dd>
                <dt className="dim-2 mono" style={{fontSize:11}}>개인정보 책임자</dt><dd>뱅기노자 / banginoja@wangsadeul.kr</dd>
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
  const [cats, setCats] = React.useState(() => window.WSD_STORES.categories.slice());
  const [draft, setDraft] = React.useState({ id:"", label:"", boardType:"community", minLevel:10, postMinLevel:10, desc:"" });
  const [error, setError] = React.useState("");

  const save = (next) => {
    window.WSD_STORES.categories = next;
    window.WSD_SAVE.categories();
    setCats(next);
  };
  const add = (e) => {
    e.preventDefault();
    setError("");
    if (!draft.id || !draft.label) return setError("ID와 이름은 필수입니다.");
    if (cats.find(c => c.id === draft.id)) return setError("이미 존재하는 ID입니다.");
    save([...cats, { ...draft, minLevel: Number(draft.minLevel), postMinLevel: Number(draft.postMinLevel) }]);
    setDraft({ id:"", label:"", boardType:"community", minLevel:10, postMinLevel:10, desc:"" });
  };
  const update = (i, key, val) => {
    const next = cats.slice();
    next[i] = { ...next[i], [key]: key.endsWith("Level") ? Number(val) : val };
    save(next);
  };
  const remove = (i) => {
    if (!confirm(`"${cats[i].label}" 분류를 삭제하시겠어요? 기존 게시글 분류가 비게 될 수 있습니다.`)) return;
    save(cats.filter((_, j) => j !== i));
  };

  return (
    <>
      <p className="dim" style={{fontSize:13, marginBottom:16, lineHeight:1.8}}>
        게시판 분류를 추가/삭제하고, 각 분류의 <strong className="gold">읽기 최소 등급(minLevel)</strong>·
        <strong className="gold">쓰기 최소 등급(postMinLevel)</strong>을 설정합니다.
      </p>
      <div className="card" style={{marginBottom:20}}>
        <form onSubmit={add} style={{display:'grid', gridTemplateColumns:'1fr 1fr 120px 90px 90px 1fr auto', gap:10, alignItems:'end'}}>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-id">ID</label>
            <input id="cat-id" className="field-input" value={draft.id} onChange={e => setDraft({...draft, id:e.target.value.replace(/\s+/g,'-').toLowerCase()})} placeholder="slug (영문)"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-label">이름</label>
            <input id="cat-label" className="field-input" value={draft.label} onChange={e => setDraft({...draft, label:e.target.value})} placeholder="분류 이름"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-type">게시판</label>
            <select id="cat-type" className="field-input" value={draft.boardType} onChange={e => setDraft({...draft, boardType:e.target.value})}>
              <option value="community">커뮤니티</option>
              <option value="column">칼럼</option>
            </select>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-min">읽기≥</label>
            <input id="cat-min" type="number" className="field-input" value={draft.minLevel} onChange={e => setDraft({...draft, minLevel:e.target.value})}/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-post">쓰기≥</label>
            <input id="cat-post" type="number" className="field-input" value={draft.postMinLevel} onChange={e => setDraft({...draft, postMinLevel:e.target.value})}/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-desc">설명</label>
            <input id="cat-desc" className="field-input" value={draft.desc} onChange={e => setDraft({...draft, desc:e.target.value})}/>
          </div>
          <button type="submit" className="btn btn-gold btn-small">추가</button>
        </form>
        {error && <div role="alert" className="mono" style={{color:'var(--danger)', fontSize:11, marginTop:10}}>{error}</div>}
      </div>

      <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
        <thead>
          <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
            <th scope="col" style={{padding:12, textAlign:'left'}}>ID</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>이름</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>게시판</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>읽기≥</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>쓰기≥</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>설명</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
          </tr>
        </thead>
        <tbody>
          {cats.map((c, i) => (
            <tr key={c.id} style={{borderBottom:'1px solid var(--line)'}}>
              <td className="mono gold" style={{padding:10}}>{c.id}</td>
              <td style={{padding:10}}>
                <input className="field-input" style={{padding:'4px 8px'}} value={c.label}
                  onChange={e => update(i, 'label', e.target.value)}/>
              </td>
              <td style={{padding:10}}>
                <select className="field-input" style={{padding:'4px 8px'}} value={c.boardType}
                  onChange={e => update(i, 'boardType', e.target.value)}>
                  <option value="community">커뮤니티</option>
                  <option value="column">칼럼</option>
                </select>
              </td>
              <td style={{padding:10, textAlign:'right'}}>
                <input type="number" className="field-input" style={{padding:'4px 8px', width:70, textAlign:'right'}}
                  value={c.minLevel ?? 0} onChange={e => update(i, 'minLevel', e.target.value)}/>
              </td>
              <td style={{padding:10, textAlign:'right'}}>
                <input type="number" className="field-input" style={{padding:'4px 8px', width:70, textAlign:'right'}}
                  value={c.postMinLevel ?? 0} onChange={e => update(i, 'postMinLevel', e.target.value)}/>
              </td>
              <td style={{padding:10}}>
                <input className="field-input" style={{padding:'4px 8px'}} value={c.desc || ''}
                  onChange={e => update(i, 'desc', e.target.value)} placeholder="설명"/>
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
        onClick={() => { if (confirm("기본값으로 되돌립니다. 진행할까요?")) { window.WSD_SAVE.resetCategories(); setCats(window.WSD_STORES.categories.slice()); } }}>
        기본값 복원
      </button>
    </>
  );
};

// === Admin: Grade CRUD =================================================
const AdminGradePanel = () => {
  const [grades, setGrades] = React.useState(() => window.WSD_STORES.grades.slice());
  const [draft, setDraft] = React.useState({ id:"", label:"", level:20, color:"#D4AF37", desc:"" });
  const [error, setError] = React.useState("");

  const save = (next) => {
    // keep sorted by level for predictable reads
    const sorted = next.slice().sort((a, b) => a.level - b.level);
    window.WSD_STORES.grades = sorted;
    window.WSD_SAVE.grades();
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
        onClick={() => { if (confirm("기본값으로 되돌립니다. 진행할까요?")) { window.WSD_SAVE.resetGrades(); setGrades(window.WSD_STORES.grades.slice()); } }}>
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

  const all = React.useMemo(() => window.WSD_COLUMNS.listAll(), [tick]);
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
      readTime: window.WSD_COLUMNS.estimateReadTime(text),
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
    window.WSD_COLUMNS.saveColumn(payload);
    setTick((v) => v + 1);
    const label = status === 'published' ? '발행' : status === 'scheduled' ? '예약 발행' : '임시 저장';
    setMsg(`"${payload.title}" ${label} 완료.`);
    if (status === 'published') reset();
    else setEditingId(payload.id);
  };

  const remove = (id) => {
    if (!confirm("이 칼럼을 삭제하시겠어요?")) return;
    window.WSD_COLUMNS.deleteColumn(id);
    setTick((v) => v + 1);
    if (editingId === id) reset();
  };

  const unpublish = (id) => {
    if (!confirm("이 칼럼을 발행 취소(임시 저장으로 되돌림)하시겠어요?")) return;
    const col = window.WSD_COLUMNS.getColumn(id);
    if (!col) return;
    window.WSD_COLUMNS.saveColumn({ ...col, status: 'draft', publishAt: null, publishedAt: null });
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
            추정 읽기 시간 · {window.WSD_COLUMNS.estimateReadTime(text)} · 본문 {text.length}자
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

Object.assign(window, { LoginPage, AdminPage, AdminCategoryPanel, AdminGradePanel, AdminColumnEditor, AdminDenied, LectureAdminPanel, BankAccountPanel, BookOrderAdminPanel });

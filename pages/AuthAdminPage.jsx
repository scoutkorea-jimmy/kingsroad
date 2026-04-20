// 로그인, 회원가입, 관리자 페이지
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
    const isAdmin = /admin@|banginoja@/i.test(form.email || "banginoja@wangsadeul.kr");
    const name = mode === "signup"
      ? (form.name || "새로운 왕사")
      : "뱅기노자";
    setUser({
      name,
      email: form.email || "hello@wangsadeul.kr",
      isAdmin,
      gradeId: isAdmin ? "admin" : (mode === "signup" ? "member" : "scholar"),
      profile: mode === "signup" ? {
        birthdate: form.birthdate, phone: form.phone,
        zip: form.zip, addr1: form.addr1, addr2: form.addr2,
        gender: form.gender, interest: form.interest,
        recommender: form.recommender,
      } : null,
      consents: {
        terms: true,
        marketing: form.consentMarketing,
        thirdParty: form.consentThirdParty,
      },
      joinedAt: new Date().toISOString(),
    });
    go(isAdmin ? "admin" : "home");
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

// === Admin Page ===================================================
const AdminPage = ({ go }) => {
  const data = window.WANGSADEUL_DATA;
  const [tab, setTab] = React.useState("대시보드");
  const [selectedMember, setSelectedMember] = React.useState(null);

  const tabGroups = [
    { group: "요약",     items: ["대시보드"] },
    { group: "콘텐츠",   items: ["게시글", "칼럼", "칼럼 작성", "투어"] },
    { group: "회원/주문", items: ["회원", "주문"] },
    { group: "운영 설정", items: ["카테고리", "회원 등급"] },
    { group: "개인정보", items: ["정보주체 권리", "동의 관리", "처리활동(ROPA)", "쿠키·추적", "보안 사고", "보유·파기", "국외 이전", "감사 로그"] },
    { group: "시스템",   items: ["설정"] },
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
                { l: "오늘 방문자", v: "2,847", d: "+12%", p: true },
                { l: "신규 회원", v: "38", d: "+4", p: true },
                { l: "DSR 대기", v: String(PRIVACY_DATA.dsrRequests.filter(r=>r.status!=='done').length), d: "3건 기한 임박", p: false },
                { l: "매출", v: "1,842,000", d: "-3%", p: false, unit: "원" },
              ].map((s, i) => (
                <div key={i} className="card">
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12}}>{s.l}</div>
                  <div className="ko-serif" style={{fontSize:32, color:'var(--gold-2)'}}>{s.v}<span style={{fontSize:14, marginLeft:4}} className="dim-2">{s.unit||''}</span></div>
                  <div style={{fontSize:11, color: s.p ? 'var(--gold)' : 'var(--danger)', marginTop:8}}>{s.d}</div>
                </div>
              ))}
            </div>
            <div className="card card-gold">
              <h2 className="ko-serif" style={{fontSize:18, marginBottom:12}}>개인정보 처리 요약</h2>
              <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
                본 서비스는 <strong className="gold">GDPR</strong> 및 <strong className="gold">개인정보보호법(PIPA)</strong>을 동시에 준수합니다.
                정보주체는 언제든 열람·정정·삭제·이동·처리정지를 요청할 수 있으며, 72시간 내 1차 응답을 목표로 합니다.
              </p>
              <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
                <button type="button" className="btn btn-small" onClick={() => setTab("정보주체 권리")}>권리 요청 처리</button>
                <button type="button" className="btn btn-small" onClick={() => setTab("처리활동(ROPA)")}>ROPA 보기</button>
                <button type="button" className="btn btn-small" onClick={() => setTab("감사 로그")}>감사 로그</button>
              </div>
            </div>
          </>
        )}

        {/* 게시글 */}
        {tab === "게시글" && (
          <div>
            <div style={{display:'flex', gap:12, marginBottom:20}}>
              <label htmlFor="post-search" className="sr-only">게시글 검색</label>
              <input id="post-search" className="field-input" placeholder="검색..." style={{flex:1}}/>
              <button type="button" className="btn btn-gold btn-small">필터</button>
              <button type="button" className="btn btn-small">CSV 다운로드</button>
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
                {data.posts.map(p => (
                  <tr key={p.id} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="mono dim-2" style={{padding:14}}>#{String(p.id).padStart(4,'0')}</td>
                    <td style={{padding:14}}><span className="badge" style={{fontSize:9}}>{p.category}</span></td>
                    <td className="ko-serif" style={{padding:14, fontSize:14}}>{p.title}</td>
                    <td className="dim mono" style={{padding:14}}>{p.author}</td>
                    <td className="mono dim-2" style={{padding:14}}>{p.date}</td>
                    <td style={{padding:14, textAlign:'right'}}><button type="button" className="btn btn-small">편집</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 칼럼 */}
        {tab === "칼럼" && (
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

        {/* 투어 */}
        {tab === "투어" && (
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

        {/* 주문 */}
        {tab === "주문" && (
          <div className="card" style={{padding:24}}>
            <h2 className="ko-serif" style={{fontSize:18, marginBottom:16}}>주문 목록</h2>
            <p className="dim" style={{fontSize:12}}>전자상거래법에 따라 5년간 보관됩니다. 상세 구현 예정.</p>
          </div>
        )}

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
              <td style={{padding:10, fontSize:11}} className="dim">{c.desc}</td>
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
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("왕의 미학");
  const [excerpt, setExcerpt] = React.useState("");
  const [html, setHtml] = React.useState("");
  const [text, setText] = React.useState("");
  const [published, setPublished] = React.useState([...(window.WSD_STORES.userColumns || [])]);
  const [msg, setMsg] = React.useState("");

  const publish = (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) { setMsg("제목과 본문은 필수입니다."); return; }
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const col = {
      id: `c-${Date.now()}`,
      title: title.trim(),
      category,
      excerpt: excerpt.trim() || text.slice(0, 100),
      date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())}`,
      readTime: `${Math.max(3, Math.ceil(text.length / 500))}분`,
      body: { html, text },
      publishedAt: now.toISOString(),
    };
    window.WSD_STORES.userColumns = [col, ...window.WSD_STORES.userColumns];
    window.WSD_SAVE.userColumns();
    setPublished([...window.WSD_STORES.userColumns]);
    setTitle(""); setExcerpt(""); setHtml(""); setText("");
    setMsg(`"${col.title}" 발행 완료.`);
  };

  const remove = (id) => {
    if (!confirm("이 칼럼을 삭제하시겠어요?")) return;
    window.WSD_STORES.userColumns = window.WSD_STORES.userColumns.filter(c => c.id !== id);
    window.WSD_SAVE.userColumns();
    setPublished([...window.WSD_STORES.userColumns]);
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:24, lineHeight:1.8}}>
        <strong className="gold">뱅기노자 칼럼</strong>은 관리자만 작성할 수 있습니다.
        본문에 이미지를 삽입한 뒤 드래그로 자유롭게 위치를 바꿀 수 있습니다.
      </p>

      <form onSubmit={publish} style={{marginBottom:40}}>
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
          <TiptapEditor preset="column"
            onUpdate={(h, _j, t) => { setHtml(h); setText(t); }}
            placeholder="칼럼 본문을 작성하세요. 툴바의 🖼 본문 이미지 버튼으로 이미지를 삽입하고, 드래그로 이동할 수 있습니다."/>
        </div>
        {msg && <div role="status" className="mono gold" style={{fontSize:12, padding:10, border:'1px solid var(--gold-dim)', background:'rgba(212,175,55,0.06)', marginBottom:16}}>{msg}</div>}
        <div style={{display:'flex', gap:12, justifyContent:'flex-end', paddingTop:20, borderTop:'1px solid var(--line)'}}>
          <button type="button" className="btn" onClick={() => { setTitle(""); setExcerpt(""); setHtml(""); setText(""); }}>초기화</button>
          <button type="submit" className="btn btn-gold">발행하기 →</button>
        </div>
      </form>

      <div>
        <h2 className="ko-serif" style={{fontSize:20, marginBottom:16}}>최근 발행 칼럼 ({published.length})</h2>
        {published.length === 0 ? (
          <p className="dim">아직 발행된 칼럼이 없습니다.</p>
        ) : (
          <div className="grid grid-2">
            {published.map(c => (
              <article key={c.id} className="card">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:10}}>
                  <span className="pill">{c.category}</span>
                  <time className="mono dim-2" style={{fontSize:10}}>{c.date}</time>
                </div>
                <h3 className="ko-serif" style={{fontSize:17, marginBottom:8}}>{c.title}</h3>
                <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:16}}>{c.excerpt}</p>
                <div style={{display:'flex', gap:8}}>
                  <button type="button" className="btn btn-small">수정</button>
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

Object.assign(window, { LoginPage, AdminPage, AdminCategoryPanel, AdminGradePanel, AdminColumnEditor, AdminDenied });

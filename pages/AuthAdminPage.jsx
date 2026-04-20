// 로그인, 회원가입, 관리자 페이지
const LoginPage = ({ go, setUser }) => {
  const [mode, setMode] = React.useState("login"); // login | signup

  const submit = () => {
    setUser({ name: mode === "signup" ? "새로운 왕사" : "뱅기노자", email: "hello@wangsadeul.kr" });
    go("home");
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

          {mode === "signup" && (
            <div className="field">
              <div className="field-label">이름</div>
              <input className="field-input" placeholder="실명을 입력해주세요"/>
            </div>
          )}
          <div className="field">
            <div className="field-label">이메일</div>
            <input className="field-input" placeholder="hello@wangsadeul.kr"/>
          </div>
          <div className="field">
            <div className="field-label">비밀번호</div>
            <input type="password" className="field-input" placeholder="••••••••"/>
          </div>
          {mode === "signup" && (
            <>
              <div className="field">
                <div className="field-label">비밀번호 확인</div>
                <input type="password" className="field-input" placeholder="••••••••"/>
              </div>
              <label style={{display:'flex', gap:10, alignItems:'flex-start', margin:'16px 0', fontSize:12, color:'var(--ink-2)', lineHeight:1.6}}>
                <input type="checkbox" style={{accentColor:'var(--gold)', marginTop:3}}/>
                <span>이용약관 및 개인정보 처리방침에 동의합니다 <span className="gold">(필수)</span></span>
              </label>
              <label style={{display:'flex', gap:10, alignItems:'flex-start', marginBottom:20, fontSize:12, color:'var(--ink-2)', lineHeight:1.6}}>
                <input type="checkbox" style={{accentColor:'var(--gold)', marginTop:3}}/>
                <span>뱅기노자 칼럼 · 답사 일정 메일 수신 (선택)</span>
              </label>
            </>
          )}
          {mode === "login" && (
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, fontSize:12}}>
              <label style={{display:'flex', gap:8, alignItems:'center', color:'var(--ink-2)'}}>
                <input type="checkbox" style={{accentColor:'var(--gold)'}}/>로그인 유지
              </label>
              <a className="gold" style={{cursor:'pointer'}}>비밀번호 찾기</a>
            </div>
          )}
          <button className="btn btn-gold btn-block" onClick={submit}>
            {mode === "login" ? "입장하기 →" : "회원가입 →"}
          </button>

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

const AdminPage = ({ go }) => {
  const data = window.WANGSADEUL_DATA;
  const [tab, setTab] = React.useState("대시보드");
  const tabs = ["대시보드", "게시글", "칼럼", "투어", "회원", "주문", "설정"];

  return (
    <div style={{display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'calc(100vh - 72px)'}}>
      {/* Sidebar */}
      <div style={{background:'var(--bg-2)', borderRight:'1px solid var(--line)', padding:'32px 0'}}>
        <div style={{padding:'0 24px 24px', borderBottom:'1px solid var(--line)'}}>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.3em'}}>◆ ADMIN CONSOLE</div>
          <div className="ko-serif" style={{fontSize:20, marginTop:8}}>관리자</div>
          <div className="dim-2 mono" style={{fontSize:11, marginTop:4}}>banginoja@wangsadeul.kr</div>
        </div>
        <div style={{padding:'16px 0'}}>
          {tabs.map(t => (
            <div key={t}
              onClick={() => setTab(t)}
              style={{
                padding:'12px 24px',
                fontSize:13,
                cursor:'pointer',
                color: tab === t ? 'var(--gold)' : 'var(--ink-2)',
                background: tab === t ? 'rgba(212,175,55,0.06)' : 'transparent',
                borderLeft: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
                letterSpacing:'0.05em',
              }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{padding:40, overflow:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32}}>
          <div>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em'}}>ADMIN / {tab.toUpperCase()}</div>
            <h1 className="ko-serif" style={{fontSize:32, fontWeight:500, marginTop:6}}>{tab}</h1>
          </div>
          <div className="mono dim-2" style={{fontSize:11}}>2026.04.20 · 14:32 KST</div>
        </div>

        {tab === "대시보드" && (
          <div>
            <div className="grid grid-4" style={{marginBottom:32}}>
              {[
                { l: "오늘 방문자", v: "2,847", d: "+12%", p: true },
                { l: "신규 회원", v: "38", d: "+4", p: true },
                { l: "주문 건수", v: "64", d: "+18", p: true },
                { l: "매출", v: "1,842,000", d: "-3%", p: false, unit: "원" },
              ].map((s, i) => (
                <div key={i} className="card">
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12}}>{s.l.toUpperCase()}</div>
                  <div className="ko-serif" style={{fontSize:32, color:'var(--gold-2)'}}>{s.v}<span style={{fontSize:14, marginLeft:4}} className="dim-2">{s.unit||''}</span></div>
                  <div style={{fontSize:11, color: s.p ? 'var(--gold)' : 'var(--danger)', marginTop:8}}>
                    {s.d} vs. 어제
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-2">
              <div className="card">
                <h3 className="ko-serif" style={{fontSize:18, marginBottom:20}}>최근 주문</h3>
                {[
                  { id: "WSD-0412", name: "『왕의길』 국문판", qty: 1, user: "돌담아래", status: "발송완료" },
                  { id: "WSD-0413", name: "『왕의길』 영문판", qty: 2, user: "overseas", status: "배송중" },
                  { id: "WSD-0414", name: "『왕의길』 국문판", qty: 1, user: "역사애호", status: "결제완료" },
                  { id: "WSD-0415", name: "투어 · 창덕궁 후원", qty: 2, user: "봄밤의자", status: "확정" },
                ].map((o, i) => (
                  <div key={i} style={{display:'grid', gridTemplateColumns:'90px 1fr 60px 80px 80px', gap:12, padding:'12px 0', borderBottom:'1px solid var(--line)', alignItems:'center', fontSize:12}}>
                    <span className="mono gold">{o.id}</span>
                    <span className="ko-serif">{o.name}</span>
                    <span className="dim-2" style={{textAlign:'center'}}>×{o.qty}</span>
                    <span className="dim mono">{o.user}</span>
                    <span className="badge" style={{fontSize:9}}>{o.status}</span>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 className="ko-serif" style={{fontSize:18, marginBottom:20}}>승인 대기</h3>
                <div style={{padding:'16px 0', borderBottom:'1px solid var(--line)'}}>
                  <div className="badge badge-gold" style={{marginBottom:8}}>신규 게시글</div>
                  <div className="ko-serif" style={{fontSize:15, marginBottom:4}}>"창덕궁 후원 답사 후기"</div>
                  <div className="dim-2 mono" style={{fontSize:10}}>봄밤의자 · 10분 전</div>
                  <div style={{marginTop:10, display:'flex', gap:8}}>
                    <button className="btn btn-small btn-gold">승인</button>
                    <button className="btn btn-small">반려</button>
                  </div>
                </div>
                <div style={{padding:'16px 0', borderBottom:'1px solid var(--line)'}}>
                  <div className="badge" style={{marginBottom:8}}>투어 신청</div>
                  <div className="ko-serif" style={{fontSize:15, marginBottom:4}}>경복궁 5.04 · 2인 신청</div>
                  <div className="dim-2 mono" style={{fontSize:10}}>돌담아래 · 32분 전</div>
                  <div style={{marginTop:10, display:'flex', gap:8}}>
                    <button className="btn btn-small btn-gold">확정</button>
                    <button className="btn btn-small">대기</button>
                  </div>
                </div>
                <div style={{padding:'16px 0'}}>
                  <div className="badge" style={{marginBottom:8}}>신고</div>
                  <div className="ko-serif" style={{fontSize:15, marginBottom:4}}>스팸 댓글 · 3건</div>
                  <div className="dim-2 mono" style={{fontSize:10}}>시스템 자동 감지</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "게시글" && (
          <div>
            <div style={{display:'flex', gap:12, marginBottom:20}}>
              <input className="field-input" placeholder="검색..." style={{flex:1}}/>
              <button className="btn btn-gold btn-small">필터</button>
              <button className="btn btn-small">CSV 다운로드</button>
            </div>
            <div>
              <div style={{display:'grid', gridTemplateColumns:'60px 100px 1fr 120px 80px 120px 100px', gap:16, padding:'12px 16px', background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                <div>ID</div><div>분류</div><div>제목</div><div>작성자</div><div>상태</div><div>날짜</div><div>액션</div>
              </div>
              {data.posts.map(p => (
                <div key={p.id} style={{display:'grid', gridTemplateColumns:'60px 100px 1fr 120px 80px 120px 100px', gap:16, padding:'14px 16px', borderBottom:'1px solid var(--line)', alignItems:'center', fontSize:12}}>
                  <span className="mono dim-2">#{String(p.id).padStart(4,'0')}</span>
                  <span className="badge" style={{fontSize:9}}>{p.category}</span>
                  <span className="ko-serif" style={{fontSize:14}}>{p.title}</span>
                  <span className="dim mono">{p.author}</span>
                  <span className="gold mono" style={{fontSize:10}}>공개</span>
                  <span className="mono dim-2">{p.date}</span>
                  <span><button className="btn btn-small" style={{padding:'4px 10px', fontSize:10}}>편집</button></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "칼럼" && (
          <div className="grid grid-2">
            {data.columns.map((c, i) => (
              <div key={c.id} className="card">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
                  <span className="pill">{c.category}</span>
                  <span className="mono dim-2" style={{fontSize:10}}>#{String(c.id).padStart(3,'0')}</span>
                </div>
                <div className="ko-serif" style={{fontSize:17, marginBottom:8}}>{c.title}</div>
                <div className="dim-2 mono" style={{fontSize:11, marginBottom:12}}>{c.date} · {c.readTime}</div>
                <div style={{display:'flex', gap:8}}>
                  <button className="btn btn-small">편집</button>
                  <button className="btn btn-small">통계</button>
                  <button className="btn btn-small" style={{marginLeft:'auto'}}>···</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(tab === "투어" || tab === "회원" || tab === "주문" || tab === "설정") && (
          <div className="card" style={{textAlign:'center', padding:80}}>
            <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:12}}>◆ {tab.toUpperCase()}</div>
            <div className="ko-serif dim" style={{fontSize:18}}>{tab} 관리 화면 준비 중</div>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { LoginPage, AdminPage });

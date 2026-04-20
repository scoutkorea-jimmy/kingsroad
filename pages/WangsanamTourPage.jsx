// 왕사남 소개, 투어 상세
const WangsanamPage = ({ go }) => {
  const members = [
    { name: "뱅기노자", role: "커뮤니티장 · 수석 가이드", spec: "조선 정치사 · 실록 독해", years: 15, desc: "15년간 실록과 궁궐을 걷다. 『왕의길』 저자. 왕사들 커뮤니티를 세우고 이끈다." },
    { name: "이공", role: "건축 가이드", spec: "궁궐 건축 · 도시 공간", years: 12, desc: "조선 궁궐의 공간 언어를 읽는다. 수원 화성 전문." },
    { name: "정사관", role: "사료 가이드", spec: "조선왕조실록 · 승정원일기", years: 10, desc: "원문 사료를 함께 읽는 프로그램을 운영. 고전번역원 출신." },
    { name: "여백", role: "미학 가이드", spec: "조선 회화 · 일월오봉도", years: 8, desc: "왕실 회화와 공예를 통해 군주의 미의식을 짚는다." },
    { name: "묘유", role: "철학 가이드", spec: "성리학 · 동양사상", years: 9, desc: "유학적 세계관 속 왕의 자리를 읽어낸다. 성균관대 박사." },
  ];
  return (
    <div className="section">
      <div className="container">
        <div style={{textAlign:'center', marginBottom:80}}>
          <div className="section-eyebrow" style={{justifyContent:'center'}}>ABOUT · 왕사남</div>
          <h1 className="section-title" style={{fontSize:56}}>
            왕의 사나이 <span className="accent">다섯</span>
          </h1>
          <p className="section-subtitle" style={{margin:'0 auto', textAlign:'center'}}>
            다섯 분야의 연구자가 모여 조선을 읽는다. 왕사남은 해설하지 않는다 — 함께 질문한다.
          </p>
        </div>

        <Ornament>五</Ornament>

        <div style={{display:'grid', gap:32, marginTop:60}}>
          {members.map((m, i) => (
            <div key={i} className={`card ${i === 0 ? 'card-gold' : ''}`}
              style={{display:'grid', gridTemplateColumns:'200px 1fr auto', gap:40, alignItems:'center', padding:32}}>
              <div className="placeholder" style={{aspectRatio:'1', fontSize:9}}>
                {i === 0 ? '★ LEAD' : `○ 0${i+1}`}
              </div>
              <div>
                <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', color:'var(--gold)', marginBottom:8}}>
                  {String(i+1).padStart(2,'0')} / {String(members.length).padStart(2,'0')} · {m.spec}
                </div>
                <h3 className="ko-serif" style={{fontSize:28, fontWeight:500, marginBottom:6}}>
                  {m.name}
                  {i === 0 && <span className="gold" style={{fontSize:14, marginLeft:12}}>◆ 커뮤니티장</span>}
                </h3>
                <div className="dim mono" style={{fontSize:12, letterSpacing:'0.1em', marginBottom:12}}>{m.role}</div>
                <p className="dim" style={{fontSize:14, lineHeight:1.7, maxWidth:600}}>{m.desc}</p>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="ko-serif gold-2" style={{fontSize:40, lineHeight:1}}>{m.years}</div>
                <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginTop:4}}>YEARS</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:80, textAlign:'center'}}>
          <button className="btn btn-gold" onClick={() => go("tour")}>투어 프로그램 살펴보기 →</button>
        </div>
      </div>
    </div>
  );
};

const TourPage = ({ go }) => {
  const data = window.WANGSADEUL_DATA;
  const [selected, setSelected] = React.useState(0);
  const tour = data.tours[selected];

  return (
    <div className="section">
      <div className="container">
        <div style={{marginBottom:60}}>
          <div className="section-eyebrow">TOUR · 답사</div>
          <h1 className="section-title">발로 읽는 <span className="accent">조선</span></h1>
          <p className="section-subtitle">뱅기노자와 왕사남이 직접 운영하는 프로그램. 한 회 최대 15인, 깊이 있는 독법.</p>
        </div>

        {/* Tabs */}
        <div style={{display:'flex', gap:0, borderBottom:'1px solid var(--line-2)', marginBottom:40, overflowX:'auto'}}>
          {data.tours.map((t, i) => (
            <button key={t.id}
              onClick={() => setSelected(i)}
              style={{
                padding:'20px 28px',
                fontSize:13,
                whiteSpace:'nowrap',
                fontFamily:'var(--font-serif)',
                color: selected === i ? 'var(--gold)' : 'var(--ink-2)',
                borderBottom: selected === i ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom:-1,
              }}>
              0{i+1} · {t.title.split(' — ')[0]}
            </button>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:60}}>
          <div>
            <div className="placeholder" style={{aspectRatio:'16/10', marginBottom:32, fontSize:11}}>
              {tour.title.toUpperCase()} · 1600×1000
            </div>
            <div style={{display:'flex', gap:8, marginBottom:20}}>
              <span className="badge badge-gold">{tour.level}</span>
              <span className="badge">{tour.duration}</span>
              <span className="badge">{tour.group}</span>
            </div>
            <h2 className="ko-serif" style={{fontSize:40, fontWeight:500, lineHeight:1.2, marginBottom:24}}>{tour.title}</h2>
            <p className="dim" style={{fontSize:16, lineHeight:1.9, marginBottom:32}}>{tour.desc}</p>

            <h3 className="ko-serif" style={{fontSize:20, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
              답사 일정
            </h3>
            <div style={{marginBottom:32}}>
              {[
                { t: "0h 00m", l: "집결 · 인트로 강연" },
                { t: "0h 30m", l: "주요 공간 답사 — 뱅기노자 해설" },
                { t: "1h 30m", l: "휴식 · 질의응답" },
                { t: "2h 00m", l: "사료와 함께 읽기" },
                { t: "2h 45m", l: "마무리 · 다음 회차 안내" },
              ].map((s, i) => (
                <div key={i} style={{display:'grid', gridTemplateColumns:'100px 1fr', gap:24, padding:'14px 0', borderBottom:'1px dashed var(--line)'}}>
                  <div className="mono gold" style={{fontSize:12, letterSpacing:'0.1em'}}>{s.t}</div>
                  <div className="ko-serif" style={{fontSize:15}}>{s.l}</div>
                </div>
              ))}
            </div>

            <h3 className="ko-serif" style={{fontSize:20, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
              준비물
            </h3>
            <ul style={{paddingLeft:20, color:'var(--ink-2)', lineHeight:2, fontSize:14}}>
              <li>편한 신발 (3~5km 보행)</li>
              <li>필기구 · 노트</li>
              <li>따뜻한 겉옷 (야간 프로그램 시)</li>
              <li>사전 배포되는 자료집은 현장에서 제공됩니다</li>
            </ul>
          </div>

          {/* Sidebar — booking */}
          <div>
            <div className="card card-gold" style={{position:'sticky', top:100}}>
              <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.3em'}}>NEXT SCHEDULE</div>
              <div className="gold-2 ko-serif" style={{fontSize:24, margin:'8px 0 24px'}}>{tour.next}</div>

              <div style={{display:'flex', justifyContent:'space-between', padding:'16px 0', borderTop:'1px solid var(--line)'}}>
                <span className="dim">참가비</span>
                <span className="gold-2 ko-serif" style={{fontSize:22}}>{tour.price}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', padding:'16px 0', borderTop:'1px solid var(--line)'}}>
                <span className="dim">소요 시간</span>
                <span>{tour.duration}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', padding:'16px 0', borderTop:'1px solid var(--line)'}}>
                <span className="dim">정원</span>
                <span>{tour.group}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', padding:'16px 0', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)', marginBottom:24}}>
                <span className="dim">난이도</span>
                <span className="gold">{tour.level}</span>
              </div>

              <button className="btn btn-gold btn-block" style={{marginBottom:12}}>예약 신청</button>
              <button className="btn btn-block">대기자 등록</button>

              <p className="dim-2" style={{fontSize:11, lineHeight:1.7, marginTop:20, textAlign:'center'}}>
                정원 마감 시 자동 대기 전환.<br/>
                취소는 답사 3일 전까지 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { WangsanamPage, TourPage });

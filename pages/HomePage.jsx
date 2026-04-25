// 메인 페이지
const HomePage = ({ go, tweaks }) => {
  const data = window.WANGSADEUL_DATA;
  const heroLayout = tweaks.heroLayout;

  // Keyboard-activatable wrapper for visually-clickable regions.
  // WCAG 3.0 Keyboard-operable outcome: Enter/Space must trigger the same action as click.
  const clickable = (onClick, label) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    onClick,
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
    },
    style: { cursor: "pointer" },
  });

  return (
    <div>
      {/* HERO */}
      <section style={{
        position:'relative',
        minHeight: heroLayout === "fullbleed" ? '100vh' : '88vh',
        padding: heroLayout === "fullbleed" ? 0 : '60px 0 120px',
        overflow:'hidden',
        borderBottom:'1px solid var(--line)',
      }}>
        {heroLayout === "center" && (
          <div className="container" style={{position:'relative'}}>
            <div style={{textAlign:'center', paddingTop:40, maxWidth:760, margin:'0 auto'}}>
              <div className="section-eyebrow" style={{justifyContent:'center'}}>
                <span>日月五峯圖 · SINCE 2024</span>
              </div>
              <h1 style={{fontFamily:'var(--font-serif)', fontSize:'clamp(48px, 7vw, 92px)', fontWeight:500,
                lineHeight:1.05, letterSpacing:'-0.02em', marginBottom:24}}>
                다섯 봉우리 아래,<br/>
                <span style={{color:'var(--gold)', fontStyle:'italic'}}>왕의 길</span>을 다시 읽다
              </h1>
              <p className="dim" style={{fontSize:17, lineHeight:1.8, maxWidth:560, margin:'0 auto 40px'}}>
                조선 500년, 어좌 뒤에 펼쳐진 일월오봉도. 그 앞에 섰던 군주들의 질문을 오늘의 언어로 이어가는 커뮤니티.
              </p>
              <div style={{display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap'}}>
                <button className="btn btn-gold" onClick={() => go("community")}>커뮤니티 둘러보기 →</button>
                <button className="btn" onClick={() => go("book")}>『왕의길』 구매</button>
              </div>
            </div>
            <div style={{marginTop:60, maxWidth:1100, margin:'60px auto 0'}}>
              <Ilwolobongdo lineStyle={tweaks.lineStyle} intensity={tweaks.intensity} interactive={tweaks.interactive}/>
            </div>
          </div>
        )}

        {heroLayout === "split" && (
          <div className="container" style={{display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:60, alignItems:'center', minHeight:'80vh', paddingTop:40}}>
            <div>
              <div className="section-eyebrow">日月五峯圖 · SINCE 2024</div>
              <h1 style={{fontFamily:'var(--font-serif)', fontSize:'clamp(42px, 5vw, 72px)', fontWeight:500,
                lineHeight:1.08, letterSpacing:'-0.02em', marginBottom:24}}>
                다섯 봉우리 아래,<br/>
                <span style={{color:'var(--gold)', fontStyle:'italic'}}>왕의 길</span>을<br/>
                다시 읽다
              </h1>
              <p className="dim" style={{fontSize:16, lineHeight:1.8, maxWidth:480, marginBottom:36}}>
                조선 500년, 어좌 뒤에 펼쳐진 일월오봉도. 그 앞에 섰던 군주들의 질문을 오늘의 언어로 이어가는 커뮤니티.
              </p>
              <div style={{display:'flex', gap:16, flexWrap:'wrap'}}>
                <button className="btn btn-gold" onClick={() => go("community")}>커뮤니티 둘러보기 →</button>
                <button className="btn" onClick={() => go("book")}>『왕의길』 구매</button>
              </div>
              <div style={{marginTop:60, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, paddingTop:32, borderTop:'1px solid var(--line)'}}>
                <div>
                  <div className="gold mono" style={{fontSize:28, letterSpacing:'0.05em'}}>2,847</div>
                  <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', marginTop:4}}>회원</div>
                </div>
                <div>
                  <div className="gold mono" style={{fontSize:28}}>124</div>
                  <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', marginTop:4}}>칼럼</div>
                </div>
                <div>
                  <div className="gold mono" style={{fontSize:28}}>38</div>
                  <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', marginTop:4}}>투어</div>
                </div>
              </div>
            </div>
            <div>
              <Ilwolobongdo lineStyle={tweaks.lineStyle} intensity={tweaks.intensity} interactive={tweaks.interactive}/>
            </div>
          </div>
        )}

        {heroLayout === "fullbleed" && (
          <div style={{position:'relative', minHeight:'100vh'}}>
            <div style={{position:'absolute', inset:0, opacity:0.95}}>
              <Ilwolobongdo lineStyle={tweaks.lineStyle} intensity={tweaks.intensity} interactive={tweaks.interactive}
                className="ilwol-svg" />
            </div>
            <div style={{
              position:'relative', zIndex:2,
              minHeight:'100vh',
              display:'grid',
              placeItems:'center',
              background:'radial-gradient(ellipse at center, transparent 0%, var(--bg) 85%)'
            }}>
              <div className="container" style={{textAlign:'center'}}>
                <div className="section-eyebrow" style={{justifyContent:'center'}}>日月五峯圖 · SINCE 2024</div>
                <h1 style={{fontFamily:'var(--font-serif)', fontSize:'clamp(56px, 9vw, 120px)', fontWeight:500,
                  lineHeight:1, letterSpacing:'-0.03em', marginBottom:24,
                  textShadow:'0 4px 40px rgba(0,0,0,0.8)'}}>
                  <span style={{color:'var(--gold)', fontStyle:'italic'}}>왕</span>의 길
                </h1>
                <p style={{fontSize:18, lineHeight:1.8, maxWidth:560, margin:'0 auto 40px', color:'var(--ink)'}}>
                  다섯 봉우리 아래 모인 사람들 — 조선의 왕들이 걸었던 길을<br/>오늘의 언어로 다시 읽습니다.
                </p>
                <div style={{display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap'}}>
                  <button className="btn btn-gold" onClick={() => go("community")}>커뮤니티 둘러보기 →</button>
                  <button className="btn" onClick={() => go("book")}>『왕의길』 구매</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 공지사항 */}
      <section className="section-tight" style={{borderBottom:'1px solid var(--line)'}}>
        <div className="container">
          <SectionHead
            eyebrow="NOTICE · 공지사항"
            title={<>왕사들에 <span className="accent">전하는 말</span></>}
            action={<button type="button" className="btn-ghost" onClick={() => go("community")}>전체 보기 →</button>}
          />
          <div className="grid grid-2">
            <div>
              {data.notices.slice(0, 2).map(n => (
                <article key={n.id} className="card card-gold"
                  {...clickable(() => go("community"), `공지: ${n.title}`)}
                  style={{marginBottom:16, cursor:'pointer'}}>
                  <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
                    <span className="badge badge-gold">{n.tag}</span>
                    {n.pinned && <span className="mono" style={{fontSize:10, color:'var(--gold)', letterSpacing:'0.2em'}}>◆ PINNED</span>}
                  </div>
                  <h3 className="card-title">{n.title}</h3>
                  <div className="card-meta"><time dateTime={n.date.replace(/\./g,'-')}>{n.date}</time></div>
                </article>
              ))}
            </div>
            <div>
              {data.notices.slice(2).map((n, i) => (
                <div key={n.id} className="row" {...clickable(() => go("community"), n.title)}>
                  <div className="row-num">0{i + 3}</div>
                  <div>
                    <span className="badge" style={{marginRight:12, fontSize:9}}>{n.tag}</span>
                    <span className="row-title">{n.title}</span>
                  </div>
                  <div className="row-meta">{n.date}</div>
                  <div className="gold">→</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 왕사남 소개 */}
      <section className="section" style={{borderBottom:'1px solid var(--line)'}}>
        <div className="container">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:80, alignItems:'center'}} className="wangsanam-grid">
            <div style={{position:'relative'}}>
              <div className="placeholder" style={{aspectRatio:'3/4'}}
                role="img" aria-label="왕사남 초상 자리 (이미지 준비 중)">
                <span aria-hidden="true">WANGSANAM · PORTRAIT<br/>750 × 1000</span>
              </div>
              <div aria-hidden="true" style={{position:'absolute', top:-1, left:-1, right:-1, bottom:-1, border:'1px solid var(--gold-dim)', pointerEvents:'none', transform:'translate(16px, 16px)'}}/>
            </div>
            <div>
              <div className="section-eyebrow">ABOUT · 왕사남</div>
              <h2 className="section-title">
                왕의 사나이.<br/>
                <span className="accent">궁궐을 걷는 사람.</span>
              </h2>
              <p className="dim" style={{fontSize:16, lineHeight:1.9, marginBottom:24}}>
                '왕사남'은 왕사들 커뮤니티를 이끄는 운영진이자 각 분야의 답사 가이드입니다. 역사, 건축, 철학, 문학에 뿌리내린 다섯 명의 연구자가 뱅기노자와 함께 조선의 길을 안내합니다.
              </p>
              <p className="dim" style={{fontSize:16, lineHeight:1.9, marginBottom:32}}>
                그들은 단순히 해설하지 않습니다. 답사자 스스로 질문하게 만드는 것 — 왕사남이 가장 중요하게 여기는 것입니다.
              </p>
              <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12, marginBottom:32}}>
                {["뱅기노자", "이공", "정사관", "여백", "묘유"].map((name, i) => (
                  <div key={i} style={{textAlign:'center'}}>
                    <div className="placeholder" style={{aspectRatio:'1', marginBottom:8, fontSize:9}}>{i === 0 ? "★" : "○"}</div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.1em', color: i === 0 ? 'var(--gold)' : 'var(--ink-2)'}}>{name}</div>
                  </div>
                ))}
              </div>
              <button className="btn" onClick={() => go("wangsanam")}>왕사남 전체 소개 →</button>
            </div>
          </div>
        </div>
      </section>

      {/* 왕사남 강연 일정 */}
      <section className="section" style={{borderBottom:'1px solid var(--line)'}}>
        <div className="container">
          <SectionHead
            eyebrow="LECTURE SCHEDULE · 왕사남 강연"
            title={<>이번 달 <span className="accent">왕사남 강연 일정</span></>}
            subtitle="메인 홈에서 바로 확인할 수 있도록, 가장 가까운 왕사남 강연 일정을 먼저 보여줍니다."
            action={<button type="button" className="btn-ghost" onClick={() => go("wangsanam")}>왕사남 소개 →</button>}
          />
          <div className="grid grid-3">
            {(data.lectures || []).map((lecture, i) => (
              <article
                key={lecture.id}
                className={`card ${i === 0 ? 'card-gold' : ''}`}
                {...clickable(() => go("wangsanam"), `강연: ${lecture.topic}, 일정 ${lecture.next}`)}
                style={{cursor:'pointer'}}
              >
                <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'center', marginBottom:14}}>
                  <span className="badge badge-gold">왕사남</span>
                  <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.16em'}}>{lecture.seats}</span>
                </div>
                <h3 className="ko-serif" style={{fontSize:24, marginBottom:10}}>{lecture.topic}</h3>
                <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:18}}>{lecture.note}</p>
                <div style={{display:'grid', gap:10}}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}>
                    <span className="dim">프로그램</span>
                    <span>{lecture.title}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}>
                    <span className="dim">강연자</span>
                    <span>{lecture.host}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}>
                    <span className="dim">장소</span>
                    <span>{lecture.venue}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12, borderTop:'1px solid var(--line)', paddingTop:12, marginTop:4}}>
                    <span className="dim">일정</span>
                    <span className="gold">{lecture.next}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 투어 프로그램 */}
      <section className="section" style={{borderBottom:'1px solid var(--line)', background:'var(--bg-2)'}}>
        <div className="container">
          <SectionHead
            eyebrow="TOUR PROGRAM · 답사"
            title={<>발로 읽는 <span className="accent">조선</span></>}
            subtitle="뱅기노자와 왕사남이 직접 운영하는 궁궐 답사 · 역사 강연 프로그램. 한 회에 최대 15인, 깊이 있는 독법을 지향합니다."
            action={<button type="button" className="btn-ghost" onClick={() => go("tour")}>전체 프로그램 →</button>}
          />
          <div className="grid grid-2">
            {data.tours.map((t, i) => (
              <article key={t.id} className="card"
                {...clickable(() => go("tour"), `투어: ${t.title}, ${t.price}, 다음 일정 ${t.next}`)}
                style={{position:'relative', cursor:'pointer'}}>
                <div className="mono" style={{position:'absolute', top:20, right:20, fontSize:10, color:'var(--gold-dim)', letterSpacing:'0.2em'}}>
                  0{i+1} / 0{data.tours.length}
                </div>
                <div style={{display:'flex', gap:8, marginBottom:16}}>
                  <span className="badge badge-gold">{t.level}</span>
                  <span className="badge">{t.duration}</span>
                  <span className="badge">{t.group}</span>
                </div>
                <h3 className="card-title" style={{fontSize:26, marginBottom:16}}>{t.title}</h3>
                <p className="dim" style={{fontSize:14, lineHeight:1.7, marginBottom:24}}>{t.desc}</p>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--line)', paddingTop:16}}>
                  <div>
                    <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.2em'}}>NEXT</div>
                    <div className="gold" style={{fontSize:14, marginTop:4}}>{t.next}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.2em'}}>PRICE</div>
                    <div className="ko-serif gold-2" style={{fontSize:22, marginTop:4}}>{t.price}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 뱅기노자 칼럼 */}
      <section className="section" style={{borderBottom:'1px solid var(--line)'}}>
        <div className="container">
          <SectionHead
            eyebrow="COLUMN · 뱅기노자의 글"
            title={<><span className="accent">뱅기노자</span>가 쓰다</>}
            subtitle="커뮤니티장 뱅기노자의 정기 칼럼. 조선의 왕들을 경유해 오늘을 묻는다."
            action={<button type="button" className="btn-ghost" onClick={() => go("column")}>칼럼 아카이브 →</button>}
          />
          <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:40}} className="col-grid">
            {/* Feature */}
            <div className="card card-gold" style={{padding:0, overflow:'hidden', cursor:'pointer'}}
              onClick={() => go("column")}>
              <div className="placeholder" style={{aspectRatio:'16/9', borderLeft:'none', borderRight:'none', borderTop:'none'}}>FEATURE IMAGE · 1600×900</div>
              <div style={{padding:36}}>
                <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:16}}>
                  <span className="pill">{data.columns[0].category}</span>
                  <span className="mono dim-2" style={{fontSize:11}}>{data.columns[0].date}</span>
                  <span className="mono dim-2" style={{fontSize:11}}>· {data.columns[0].readTime}</span>
                </div>
                <h3 className="ko-serif" style={{fontSize:32, fontWeight:500, lineHeight:1.25, marginBottom:16}}>
                  {data.columns[0].title}
                </h3>
                <p className="dim" style={{fontSize:15, lineHeight:1.8}}>{data.columns[0].excerpt}</p>
                <div className="gold mono" style={{fontSize:11, letterSpacing:'0.2em', marginTop:24}}>
                  READ MORE →
                </div>
              </div>
            </div>
            <div>
              {data.columns.slice(1, 5).map(c => (
                <div key={c.id} onClick={() => go("column")}
                  style={{padding:'20px 0', borderBottom:'1px solid var(--line)', cursor:'pointer'}}>
                  <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:8}}>
                    <span className="pill" style={{fontSize:9, padding:'2px 8px'}}>{c.category}</span>
                    <span className="mono dim-2" style={{fontSize:10}}>{c.date}</span>
                  </div>
                  <h4 className="ko-serif" style={{fontSize:18, fontWeight:500, lineHeight:1.4, marginBottom:6}}>{c.title}</h4>
                  <p className="dim" style={{fontSize:13, lineHeight:1.6, color:'var(--ink-3)'}}>{c.excerpt.slice(0, 65)}…</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 파트너십 */}
      <section className="section-tight" style={{borderBottom:'1px solid var(--line)'}}>
        <div className="container">
          <SectionHead
            eyebrow="PARTNERS · 파트너십"
            title={<>함께 걷는 <span className="accent">기관들</span></>}
          />
          <div className="grid grid-3">
            {data.partners.map((p, i) => (
              <div key={i} className="card" style={{textAlign:'center', padding:'40px 24px'}}>
                <div style={{height:60, display:'grid', placeItems:'center', marginBottom:16}}>
                  <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em'}}>{p.type.toUpperCase()}</div>
                </div>
                <h4 className="ko-serif" style={{fontSize:20, fontWeight:500, marginBottom:8}}>{p.name}</h4>
                <p className="dim-2" style={{fontSize:12}}>{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 책 구매 CTA */}
      <section className="section">
        <div className="container">
          <div className="card card-gold" style={{padding:'80px 60px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center'}}>
            <div>
              <div className="section-eyebrow">NEW RELEASE · 2026</div>
              <h2 style={{fontFamily:'var(--font-serif)', fontSize:56, fontWeight:500, lineHeight:1.1, marginBottom:16}}>
                『<span className="gold">왕의길</span>』
              </h2>
              <p className="dim" style={{fontSize:15, lineHeight:1.8, marginBottom:24}}>
                뱅기노자가 15년간 쌓아올린 궁궐 답사와 실록 독해의 결실. 다섯 봉우리 아래 읽어내는 조선의 정치 · 미학 · 길.
              </p>
              <div style={{display:'flex', gap:16, marginBottom:24}}>
                <div>
                  <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.2em'}}>국문판</div>
                  <div className="ko-serif gold-2" style={{fontSize:22, marginTop:4}}>28,000원</div>
                </div>
                <div style={{width:1, background:'var(--line-2)'}}/>
                <div>
                  <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.2em'}}>영문판</div>
                  <div className="ko-serif gold-2" style={{fontSize:22, marginTop:4}}>35,000원</div>
                </div>
              </div>
              <button className="btn btn-gold" onClick={() => go("book")}>구매하기 →</button>
            </div>
            <div className="placeholder" style={{aspectRatio:'3/4', maxWidth:340, margin:'0 auto'}}>
              BOOK COVER<br/>
              『王의길』<br/>
              750 × 1000
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { HomePage });

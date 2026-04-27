// 뱅기노자 홈페이지 — 한국 여행·역사·문화 커뮤니티

// 인터랙티브 한국 지도
const KoreaMap = ({ onSelect, selected }) => {
  const [hovered, setHovered] = React.useState(null);

  const destinations = [
    { id:'seoul',   name:'서울', x:145, y:82,  region:'수도권',       tags:['궁궐','한옥','역사'],  desc:'경복궁·창덕궁·북촌, 조선 왕조의 숨결이 살아있는 천년 수도.' },
    { id:'incheon', name:'인천', x:112, y:92,  region:'경기',         tags:['강화도','개항장','섬'], desc:'강화 고려 유적과 개항기 역사거리, 서해의 관문.' },
    { id:'gangwon', name:'강릉', x:248, y:102, region:'강원',         tags:['동해','오죽헌','자연'], desc:'경포대·오죽헌·동해 바다, 강원의 절경.' },
    { id:'daejeon', name:'대전', x:162, y:188, region:'충청',         tags:['유성','계룡산'],        desc:'계룡산 산세와 충청 문화의 중심.' },
    { id:'jeonju',  name:'전주', x:132, y:248, region:'전라북도',     tags:['한옥','한식','전통'],   desc:'700채 한옥마을·비빔밥·막걸리, 전통문화의 도시.' },
    { id:'gwangju', name:'광주', x:108, y:318, region:'전라남도',     tags:['예술','역사','민주'],   desc:'무등산과 518 역사의 도시, 문화예술의 거점.' },
    { id:'andong',  name:'안동', x:218, y:192, region:'경상북도',     tags:['유교','하회','서원'],   desc:'하회마을·도산서원, 한국 유교문화의 본향.' },
    { id:'gyeongju',name:'경주', x:242, y:272, region:'경상북도',     tags:['신라','불국사','고분'], desc:'불국사·석굴암·대릉원, 신라 천년의 야외 박물관.' },
    { id:'busan',   name:'부산', x:248, y:322, region:'경상남도',     tags:['해안','항구','문화'],   desc:'해운대·감천문화마을, 역동적인 항구도시.' },
    { id:'jeju',    name:'제주', x:148, y:408, region:'제주특별자치도', tags:['한라산','올레길','해녀'],'desc':'화산섬의 자연, 한라산·올레길·해녀문화.' },
  ];

  const mainland = "M58,22 C50,35 44,58 42,90 L38,125 C35,150 36,175 42,200 L46,230 C50,255 56,275 62,295 C68,315 80,338 96,358 C108,374 128,390 152,398 C172,406 194,402 212,388 C228,374 242,355 250,330 C255,312 258,290 256,265 C254,240 252,215 250,190 C248,162 246,138 244,110 C242,85 238,62 232,42 C225,28 212,18 195,16 C172,14 148,14 120,16 C95,18 75,20 58,22 Z";
  const jeju = "M126,405 C120,398 134,391 150,390 C168,389 183,398 178,406 C173,415 156,419 140,417 C126,415 124,411 126,405 Z";

  const active = hovered || selected;
  const activeInfo = destinations.find(d => d.id === active);

  return (
    <div style={{position:'relative'}}>
      <svg viewBox="0 0 300 435" style={{width:'100%', height:'auto', overflow:'visible', display:'block'}}>
        <defs>
          <pattern id="mapDots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="9" cy="9" r="0.7" fill="var(--line)" opacity="0.6"/>
          </pattern>
        </defs>

        {/* 배경 점 그리드 */}
        <rect x="-30" y="-30" width="360" height="500" fill="url(#mapDots)"/>

        {/* 해역 레이블 */}
        {[
          {x:18, y:200, label:'서 해', rotate:true},
          {x:274, y:165, label:'동 해', rotate:true},
          {x:122, y:428, label:'남  해', rotate:false},
        ].map(sea => (
          <text key={sea.label} x={sea.x} y={sea.y}
            fontSize="7.5" fill="var(--ink-3)" fontFamily="var(--font-mono)"
            letterSpacing="0.18em" opacity="0.55"
            transform={sea.rotate ? `rotate(-90, ${sea.x}, ${sea.y})` : undefined}
            textAnchor="middle">
            {sea.label}
          </text>
        ))}

        {/* 한반도 본토 */}
        <path d={mainland}
          fill="var(--bg-2)"
          stroke="var(--gold-dim)"
          strokeWidth="1.2"
          strokeLinejoin="round"/>

        {/* 제주도 */}
        <path d={jeju}
          fill="var(--bg-2)"
          stroke="var(--gold-dim)"
          strokeWidth="1"
          strokeLinejoin="round"/>

        {/* 여행지 핀 */}
        {destinations.map(d => {
          const isActive = (hovered === d.id || selected === d.id);
          return (
            <g key={d.id}
              role="button" tabIndex={0}
              aria-label={`${d.name} 여행지`}
              style={{cursor:'pointer'}}
              onClick={() => onSelect && onSelect(d)}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
              onKeyDown={(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); onSelect && onSelect(d); } }}>
              <circle cx={d.x} cy={d.y} r={14} fill="transparent"/>
              {isActive && (
                <circle cx={d.x} cy={d.y} r={10}
                  fill="rgba(158,104,24,0.1)" stroke="var(--gold)" strokeWidth="1"/>
              )}
              <circle cx={d.x} cy={d.y} r={isActive ? 5 : 3.8}
                fill={isActive ? 'var(--gold)' : 'var(--bg)'}
                stroke="var(--gold)"
                strokeWidth="1.5"/>
              <text x={d.x} y={d.id==='jeju' ? d.y-10 : d.y+16}
                textAnchor="middle"
                fontSize="8.5"
                fill={isActive ? 'var(--gold)' : 'var(--ink-2)'}
                fontFamily="var(--font-sans)"
                fontWeight={isActive ? '600' : '400'}>
                {d.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 선택된 여행지 정보 카드 */}
      {activeInfo && (
        <div style={{
          marginTop:8, padding:'12px 16px',
          background:'var(--bg)', border:'1px solid var(--gold-dim)',
          fontSize:13,
        }}>
          <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:6}}>
            {activeInfo.tags.map(t => (
              <span key={t} style={{
                fontSize:9, fontFamily:'var(--font-mono)', letterSpacing:'0.15em',
                border:'1px solid var(--gold-dim)', color:'var(--gold)', padding:'1px 7px',
              }}>{t}</span>
            ))}
          </div>
          <div style={{color:'var(--ink-2)', lineHeight:1.55}}>{activeInfo.desc}</div>
        </div>
      )}
    </div>
  );
};

// 주요 여행지 데이터
const FEATURED_DESTINATIONS = [
  { id:'seoul',    name:'서울',  subtitle:'궁궐과 골목의 도시', region:'수도권',
    desc:'경복궁·창덕궁에서 북촌 한옥마을까지. 조선의 흔적이 살아 숨 쉬는 천년 수도.',
    tags:['궁궐','한옥','역사'], char:'궁' },
  { id:'gyeongju', name:'경주',  subtitle:'신라 천년의 야외 박물관', region:'경상북도',
    desc:'불국사·석굴암·대릉원. 도심 전체가 세계문화유산, 유적과 함께 걷는 도시.',
    tags:['신라','불교','유적'], char:'탑' },
  { id:'jeonju',   name:'전주',  subtitle:'전통의 맛과 멋', region:'전라북도',
    desc:'700채 한옥이 살아 숨 쉬는 한옥마을. 비빔밥·막걸리와 함께하는 전통 체험.',
    tags:['한옥','음식','전통'], char:'한' },
  { id:'jeju',     name:'제주',  subtitle:'화산섬의 절경', region:'제주특별자치도',
    desc:'한라산 등반부터 올레길 트레킹까지. 해녀문화와 제주 고유의 화산 자연.',
    tags:['자연','올레길','해녀'], char:'섬' },
  { id:'andong',   name:'안동',  subtitle:'유교문화의 본향', region:'경상북도',
    desc:'하회마을·도산서원·봉정사. 한국 전통 유교 사상의 뿌리를 만나는 여행.',
    tags:['유교','하회','서원'], char:'儒' },
  { id:'busan',    name:'부산',  subtitle:'바다와 도시의 조화', region:'경상남도',
    desc:'해운대·감천문화마을·국제시장. 산과 바다, 역사가 어우러진 항구도시.',
    tags:['해안','항구','문화'], char:'항' },
];

const HomePage = ({ go }) => {
  const data = window.WANGSADEUL_DATA;
  const [selectedDest, setSelectedDest] = React.useState(null);

  const _cols = window.WSD_COLUMNS?.listPublic?.();
  const publicColumns = (_cols && _cols.length) ? _cols : [
    ...(window.WSD_STORES?.userColumns || []),
    ...(data.columns || []),
  ];
  const featuredColumn = publicColumns[0];
  const secondaryColumns = publicColumns.slice(1, 5);

  const recentPosts = React.useMemo(() => {
    try { return (window.WSD_COMMUNITY?.listPosts?.() || []).slice(0, 4); } catch { return []; }
  }, []);

  const clickable = (onClick, label) => ({
    role:'button', tabIndex:0, 'aria-label':label, onClick,
    onKeyDown:(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); onClick(); } },
    style:{cursor:'pointer'},
  });

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{
        position:'relative', overflow:'hidden',
        background:'var(--bg)', borderBottom:'1px solid var(--line)',
        padding:'80px 0 100px',
      }}>
        <div className="container">
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center',
          }}>
            {/* 왼쪽: 텍스트 */}
            <div>
              <div className="section-eyebrow">
                <span>BANGINOJA · 비행기 타고 놀자</span>
              </div>
              <h1 style={{
                fontFamily:'var(--font-serif)',
                fontSize:'clamp(38px, 5vw, 62px)',
                fontWeight:500,
                lineHeight:1.12,
                letterSpacing:'-0.02em',
                marginBottom:24,
                color:'var(--ink)',
              }}>
                비행기 타고<br/>
                <span style={{color:'var(--gold)'}}>한국을</span><br/>
                느끼다
              </h1>
              <p style={{
                fontSize:16, lineHeight:1.9, color:'var(--ink-2)',
                maxWidth:420, marginBottom:40,
              }}>
                궁궐 답사부터 지역 여행 코스까지. 뱅기노자와 함께 한국의 역사·문화·자연을 온몸으로 경험하는 여행 커뮤니티입니다.
              </p>
              <div style={{display:'flex', gap:14, flexWrap:'wrap', marginBottom:56}}>
                <button className="btn btn-gold" onClick={() => go('community')}>
                  커뮤니티 참여하기 →
                </button>
                <button className="btn" onClick={() => go('tour')}>
                  투어 프로그램 보기
                </button>
              </div>
              <div style={{
                display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20,
                paddingTop:28, borderTop:'1px solid var(--line)',
              }}>
                {[
                  { l:'여행지', v:'전국', s:'주요 답사지 운영' },
                  { l:'투어', v:String((data.tours||[]).length)+'개', s:'직접 기획 프로그램' },
                  { l:'커뮤니티', v:'운영 중', s:'함께 만드는 여행' },
                ].map(stat => (
                  <div key={stat.l}>
                    <div style={{
                      fontFamily:'var(--font-mono)', fontSize:19,
                      color:'var(--gold)', letterSpacing:'0.03em', marginBottom:4,
                    }}>{stat.v}</div>
                    <div style={{
                      fontFamily:'var(--font-mono)', fontSize:9,
                      letterSpacing:'0.22em', color:'var(--ink-3)',
                      textTransform:'uppercase', marginBottom:3,
                    }}>{stat.l}</div>
                    <div style={{fontSize:11, color:'var(--ink-3)'}}>{stat.s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 한국 지도 */}
            <div>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize:9,
                letterSpacing:'0.25em', color:'var(--ink-3)',
                marginBottom:12, textAlign:'center',
              }}>
                지도를 클릭해 여행지를 탐색하세요
              </div>
              <KoreaMap
                onSelect={(dest) => setSelectedDest(
                  selectedDest?.id === dest.id ? null : dest
                )}
                selected={selectedDest?.id}
              />
              {selectedDest && (
                <div style={{
                  marginTop:12, padding:'16px 20px',
                  background:'var(--bg-2)', border:'1px solid var(--gold-dim)',
                  display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12,
                }}>
                  <div>
                    <div style={{display:'flex', alignItems:'baseline', gap:10, marginBottom:6}}>
                      <span style={{fontFamily:'var(--font-serif)', fontSize:20, color:'var(--ink)'}}>{selectedDest.name}</span>
                      <span style={{fontFamily:'var(--font-mono)', fontSize:9, color:'var(--ink-3)', letterSpacing:'0.15em'}}>{selectedDest.region}</span>
                    </div>
                    <p style={{fontSize:13, color:'var(--ink-2)', lineHeight:1.6, marginBottom:10}}>{selectedDest.desc}</p>
                    <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                      {selectedDest.tags.map(t => (
                        <span key={t} style={{
                          fontSize:9, fontFamily:'var(--font-mono)',
                          border:'1px solid var(--gold-dim)',
                          color:'var(--gold)', padding:'2px 8px', letterSpacing:'0.12em',
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    style={{background:'none', border:'none', cursor:'pointer', color:'var(--ink-3)', fontSize:18, lineHeight:1, padding:0, flexShrink:0}}
                    onClick={() => setSelectedDest(null)}
                    aria-label="닫기">×</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 주요 여행지 ──────────────────────────────────────────────── */}
      <section className="section" style={{background:'var(--bg-2)', borderBottom:'1px solid var(--line)'}}>
        <div className="container">
          <SectionHead
            eyebrow="DESTINATIONS · 주요 여행지"
            title={<>지금 떠나고 싶은 <span className="accent">한국</span></>}
            subtitle="뱅기노자가 직접 걷고, 맛보고, 느낀 전국의 여행지. 역사와 자연이 살아있는 곳을 소개합니다."
            action={<button type="button" className="btn-ghost" onClick={() => go('tour')}>전체 여행지 →</button>}
          />
          <div className="grid grid-3">
            {FEATURED_DESTINATIONS.map((dest, i) => (
              <article key={dest.id}
                className={`card ${i === 0 ? 'card-gold' : ''}`}
                {...clickable(() => go('tour'), `${dest.name} 여행지`)}
                style={{cursor:'pointer'}}>
                {/* 이미지 플레이스홀더 */}
                <div style={{
                  height:140, marginBottom:20, position:'relative', overflow:'hidden',
                  background:`linear-gradient(135deg, var(--bg-3) 0%, var(--bg-2) 100%)`,
                  display:'grid', placeItems:'center',
                }}>
                  <span style={{
                    fontFamily:'var(--font-serif)', fontSize:40,
                    color:'var(--gold)', opacity:0.18, userSelect:'none',
                  }}>{dest.char}</span>
                  <div style={{
                    position:'absolute', top:10, left:12,
                    fontFamily:'var(--font-mono)', fontSize:9,
                    letterSpacing:'0.18em', color:'var(--ink-3)',
                  }}>{dest.region}</div>
                </div>
                <div style={{display:'flex', gap:6, marginBottom:10, flexWrap:'wrap'}}>
                  {dest.tags.map(t => (
                    <span key={t} className="badge" style={{fontSize:9}}>{t}</span>
                  ))}
                </div>
                <h3 className="ko-serif" style={{fontSize:22, marginBottom:5}}>{dest.name}</h3>
                <div style={{
                  fontFamily:'var(--font-mono)', fontSize:11,
                  color:'var(--gold)', letterSpacing:'0.08em', marginBottom:10,
                }}>{dest.subtitle}</div>
                <p className="dim" style={{fontSize:13, lineHeight:1.7}}>{dest.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 투어 프로그램 ─────────────────────────────────────────────── */}
      {(data.tours || []).length > 0 && (
        <section className="section" style={{borderBottom:'1px solid var(--line)'}}>
          <div className="container">
            <SectionHead
              eyebrow="TOUR PROGRAM · 뱅기노자 투어"
              title={<>직접 걷는 <span className="accent">답사 여행</span></>}
              subtitle="뱅기노자가 직접 기획·운영하는 소규모 답사 프로그램. 깊이 있는 해설과 함께하는 여행."
              action={<button type="button" className="btn-ghost" onClick={() => go('tour')}>전체 프로그램 →</button>}
            />
            <div className="grid grid-2">
              {(data.tours || []).slice(0, 4).map((t, i) => (
                <article key={t.id} className="card"
                  {...clickable(() => go('tour'), `투어: ${t.title}`)}
                  style={{cursor:'pointer', position:'relative'}}>
                  <div className="mono" style={{
                    position:'absolute', top:20, right:20,
                    fontSize:10, color:'var(--gold-dim)', letterSpacing:'0.2em',
                  }}>0{i+1}</div>
                  <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap'}}>
                    <span className="badge badge-gold">{t.level}</span>
                    <span className="badge">{t.duration}</span>
                    <span className="badge">{t.group}</span>
                  </div>
                  <h3 className="card-title" style={{fontSize:22, marginBottom:10}}>{t.title}</h3>
                  <p className="dim" style={{fontSize:13, lineHeight:1.7, marginBottom:20}}>{t.desc}</p>
                  <div style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    borderTop:'1px solid var(--line)', paddingTop:16,
                  }}>
                    <div>
                      <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.2em'}}>다음 일정</div>
                      <div className="gold" style={{fontSize:14, marginTop:4}}>{t.next}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.2em'}}>참가비</div>
                      <div className="ko-serif gold-2" style={{fontSize:20, marginTop:4}}>{t.price}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 커뮤니티 ─────────────────────────────────────────────────── */}
      <section className="section" style={{background:'var(--bg-2)', borderBottom:'1px solid var(--line)'}}>
        <div className="container">
          <SectionHead
            eyebrow="COMMUNITY · 여행 이야기"
            title={<>함께 만들어가는 <span className="accent">여행</span></>}
            subtitle="여행 경험을 나누고, 코스를 추천하고, 함께 떠날 동행을 찾습니다. 커뮤니티에서 여행이 시작됩니다."
            action={<button type="button" className="btn-ghost" onClick={() => go('community')}>커뮤니티 가기 →</button>}
          />
          {recentPosts.length > 0 ? (
            <div style={{border:'1px solid var(--line)'}}>
              {recentPosts.map((post, i) => (
                <div key={post.id}
                  {...clickable(() => go('community'), post.title)}
                  style={{
                    display:'flex', gap:20, alignItems:'center',
                    padding:'18px 24px',
                    background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)',
                    borderBottom: i < recentPosts.length - 1 ? '1px solid var(--line)' : 'none',
                  }}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:5}}>
                      <span className="badge" style={{fontSize:9}}>{post.category}</span>
                      {post.prefix && (
                        <span style={{
                          fontFamily:'var(--font-mono)', fontSize:9,
                          color:'var(--gold)', letterSpacing:'0.1em',
                        }}>[{post.prefix}]</span>
                      )}
                    </div>
                    <div className="ko-serif" style={{fontSize:15, color:'var(--ink)', marginBottom:3}}>{post.title}</div>
                    <div style={{fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)'}}>
                      {post.author} · {post.date}
                    </div>
                  </div>
                  <div style={{
                    display:'flex', gap:14, color:'var(--ink-3)',
                    fontFamily:'var(--font-mono)', fontSize:11, flexShrink:0,
                  }}>
                    <span>댓글 {post.replies ?? 0}</span>
                    <span style={{color:'var(--gold)'}}>→</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{textAlign:'center', padding:60}}>
              <div style={{fontFamily:'var(--font-serif)', fontSize:20, color:'var(--ink-2)', marginBottom:12}}>
                첫 번째 여행 이야기를 써주세요
              </div>
              <p className="dim" style={{fontSize:13, marginBottom:24}}>
                커뮤니티에 여행 경험을 나누면 더 많은 여행자들이 모여듭니다.
              </p>
              <button className="btn btn-gold" onClick={() => go('community')}>글 작성하기 →</button>
            </div>
          )}
        </div>
      </section>

      {/* ── 뱅기노자 칼럼 ─────────────────────────────────────────────── */}
      {featuredColumn && (
        <section className="section" style={{borderBottom:'1px solid var(--line)'}}>
          <div className="container">
            <SectionHead
              eyebrow="COLUMN · 뱅기노자의 글"
              title={<><span className="accent">뱅기노자</span>가 쓰다</>}
              subtitle="한국의 역사·문화·여행을 깊이 있게 풀어내는 뱅기노자의 정기 칼럼."
              action={<button type="button" className="btn-ghost" onClick={() => go('column')}>칼럼 전체 보기 →</button>}
            />
            <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:40}} className="col-grid">
              {/* 피처드 칼럼 */}
              <div className="card card-gold"
                style={{padding:0, overflow:'hidden', cursor:'pointer'}}
                {...clickable(() => go('column'), `칼럼: ${featuredColumn.title}`)}>
                <div style={{
                  height:200,
                  background:'linear-gradient(135deg, var(--bg-3) 0%, var(--bg-2) 100%)',
                  display:'grid', placeItems:'center',
                }}>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontFamily:'var(--font-serif)', fontSize:32, color:'var(--gold)', opacity:0.25, marginBottom:6}}>글</div>
                    <div style={{fontFamily:'var(--font-mono)', fontSize:9, color:'var(--ink-3)', letterSpacing:'0.28em'}}>FEATURED COLUMN</div>
                  </div>
                </div>
                <div style={{padding:30}}>
                  <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:14}}>
                    <span className="pill">{featuredColumn.category}</span>
                    <span className="mono dim-2" style={{fontSize:11}}>{featuredColumn.date}</span>
                    <span className="mono dim-2" style={{fontSize:11}}>· {featuredColumn.readTime}</span>
                  </div>
                  <h3 className="ko-serif" style={{fontSize:26, fontWeight:500, lineHeight:1.3, marginBottom:12}}>
                    {featuredColumn.title}
                  </h3>
                  <p className="dim" style={{fontSize:14, lineHeight:1.75}}>{featuredColumn.excerpt}</p>
                  <div className="gold mono" style={{fontSize:11, letterSpacing:'0.2em', marginTop:20}}>더 읽기 →</div>
                </div>
              </div>
              {/* 서브 칼럼 목록 */}
              <div>
                {secondaryColumns.map(c => (
                  <div key={c.id}
                    {...clickable(() => go('column'), `칼럼: ${c.title}`)}
                    style={{padding:'18px 0', borderBottom:'1px solid var(--line)', cursor:'pointer'}}>
                    <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:8}}>
                      <span className="pill" style={{fontSize:9, padding:'2px 8px'}}>{c.category}</span>
                      <span className="mono dim-2" style={{fontSize:10}}>{c.date}</span>
                    </div>
                    <h4 className="ko-serif" style={{fontSize:17, fontWeight:500, lineHeight:1.4, marginBottom:5}}>{c.title}</h4>
                    <p className="dim" style={{fontSize:12, lineHeight:1.6, color:'var(--ink-3)'}}>{(c.excerpt||'').slice(0,65)}…</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 강연 일정 ─────────────────────────────────────────────────── */}
      {(data.lectures || []).length > 0 && (
        <section className="section-tight" style={{background:'var(--bg-2)', borderBottom:'1px solid var(--line)'}}>
          <div className="container">
            <SectionHead
              eyebrow="LECTURE · 뱅기노자 강연"
              title={<>이번 달 <span className="accent">강연 일정</span></>}
              action={<button type="button" className="btn-ghost" onClick={() => go('lectures')}>전체 강연 보기 →</button>}
            />
            <div className="grid grid-3">
              {(data.lectures || []).map((lecture, i) => (
                <article key={lecture.id}
                  className={`card ${i === 0 ? 'card-gold' : ''}`}
                  {...clickable(() => {
                    try { sessionStorage.setItem('wsd_pending_lecture_id', String(lecture.id)); } catch {}
                    go('lectures');
                  }, `강연: ${lecture.topic}`)}
                  style={{cursor:'pointer'}}>
                  <span className="badge badge-gold" style={{marginBottom:16}}>강연</span>
                  <h3 className="ko-serif" style={{fontSize:20, marginBottom:8}}>{lecture.topic}</h3>
                  <p className="dim" style={{fontSize:13, lineHeight:1.7, marginBottom:16}}>{lecture.note}</p>
                  <div style={{borderTop:'1px solid var(--line)', paddingTop:12, display:'flex', justifyContent:'space-between'}}>
                    <span className="dim" style={{fontSize:12}}>{lecture.venue}</span>
                    <span className="gold" style={{fontSize:12, fontFamily:'var(--font-mono)'}}>{lecture.next}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 책 CTA ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="card card-gold" style={{
            padding:'72px 60px',
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center',
          }}>
            <div>
              <div className="section-eyebrow">뱅기노자 출판 · 2026</div>
              <h2 style={{
                fontFamily:'var(--font-serif)', fontSize:52,
                fontWeight:500, lineHeight:1.1, marginBottom:16,
              }}>
                『<span className="gold">왕의길</span>』
              </h2>
              <p className="dim" style={{fontSize:15, lineHeight:1.9, marginBottom:28}}>
                뱅기노자가 15년간 쌓아올린 궁궐 답사와 역사 독해의 결실.
                조선의 왕들이 걸었던 길을 통해 오늘의 여행을 다시 읽다.
              </p>
              <div style={{display:'flex', gap:20, marginBottom:32}}>
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
              <button className="btn btn-gold" onClick={() => go('book')}>구매하기 →</button>
            </div>
            <div style={{
              aspectRatio:'3/4', maxWidth:280, margin:'0 auto',
              background:'linear-gradient(160deg, var(--bg-3) 0%, var(--bg-2) 100%)',
              border:'1px solid var(--gold-dim)',
              display:'grid', placeItems:'center',
            }}>
              <div style={{textAlign:'center'}}>
                <div style={{fontFamily:'var(--font-serif)', fontSize:30, color:'var(--gold)', marginBottom:10}}>왕의길</div>
                <div style={{fontFamily:'var(--font-mono)', fontSize:9, color:'var(--ink-3)', letterSpacing:'0.28em', marginBottom:6}}>WANG-EUI-GIL</div>
                <div style={{fontFamily:'var(--font-mono)', fontSize:9, color:'var(--ink-3)', letterSpacing:'0.2em'}}>뱅기노자 지음</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

Object.assign(window, { HomePage });

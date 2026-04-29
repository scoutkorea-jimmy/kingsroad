// 먹고 놀자 / 자고 놀자 / 사고 놀자 — 의식주 + 행문(行文) 여정의 3 갈래.
// 각 페이지는 동일한 구조: 인트로 카드 + 카테고리 그리드 + 예약 안내. 데이터는 추후 D1 으로.
//
// 운영 정책:
//   - 현재는 페이지 골격만 잡고 placeholder 카드를 노출 (기능 정의 단계).
//   - 다음 사이클에 D1 테이블(`venues` / `lodgings` / `goods`) 신설 + 관리자 입력 폼 + 예약 흐름.

const PlacePage = ({ go, kind, user }) => {
  const KIND_META = {
    eat:   { eyebrow: 'EAT · 먹고 놀자',   title: '먹고 놀자',   sub: '한국의 맛, 한 끼의 인문학',
             desc: '식(食) — 지역의 식재료와 손맛을 따라가는 여정. 뱅기노자와 함께 검증된 식당과 종가 음식을 만납니다.',
             accent: '#E8A540',
             categories: ['전통 한정식', '향토 음식', '시장 먹거리', '제철 식재', '주안상·발효'] },
    sleep: { eyebrow: 'STAY · 자고 놀자', title: '자고 놀자', sub: '머무는 곳에서 시작되는 여행',
             desc: '주(住) — 한옥·전통 게스트하우스·고택 스테이까지. 머무는 시간이 곧 풍경이 되는 숙박을 큐레이션합니다.',
             accent: '#5A8FBF',
             categories: ['한옥 스테이', '고택 / 종가', '게스트하우스', '템플 스테이', '농가 체험'] },
    shop:  { eyebrow: 'SHOP · 사고 놀자',  title: '사고 놀자',  sub: '집으로 가져오는 한국의 손길',
             desc: '의(衣) + 토산 — 지역 장인의 공예와 토산물을 한자리에. 손에 닿는 한국을 가져갑니다.',
             accent: '#9C6FB3',
             categories: ['전통 공예', '지역 토산물', '의류·전통 직물', '도자·금속', '보존·발효 식품'] },
  };
  const meta = KIND_META[kind] || KIND_META.eat;

  return (
    <div className="section">
      <div className="container">
        {/* 헤더 */}
        <header style={{marginBottom:32}}>
          <div className="section-eyebrow" aria-hidden="true">{meta.eyebrow}</div>
          <h1 className="section-title" style={{display:'flex', alignItems:'baseline', gap:14, flexWrap:'wrap'}}>
            <span>{meta.title}</span>
            <span className="ko-serif" style={{fontSize:'0.55em', color: meta.accent, fontStyle:'italic', fontWeight:400}}>
              {meta.sub}
            </span>
          </h1>
          <p className="section-subtitle" style={{maxWidth:780}}>{meta.desc}</p>
        </header>

        {/* 인포 박스 — 행문(行文) 슬로건 */}
        <div className="card card-gold" style={{padding:'18px 22px', marginBottom:32, display:'flex', gap:16, alignItems:'center', flexWrap:'wrap'}}>
          <div style={{flex:1, minWidth:240}}>
            <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:6}}>行文 · 행문</div>
            <p className="dim" style={{margin:0, fontSize:13, lineHeight:1.8}}>
              <strong style={{color:'var(--ink)'}}>의식주(衣食住) + 행문(行文)</strong> — 사람이 사는 데 필요한 4 가지 요소가 한 여정에서 만나는 곳입니다.
              먹고, 자고, 사고, 그리고 길에서 글을 만나는 인문학 여행.
            </p>
          </div>
        </div>

        {/* 카테고리 그리드 — placeholder */}
        <h2 className="ko-serif" style={{fontSize:24, marginBottom:18}}>카테고리</h2>
        <div className="grid grid-3" style={{marginBottom:48}}>
          {meta.categories.map((c, i) => (
            <article key={c} className="card" style={{padding:22, position:'relative'}}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>
                {String(i+1).padStart(2,'0')} · {meta.eyebrow.split(' · ')[0]}
              </div>
              <h3 className="ko-serif" style={{fontSize:20, marginBottom:8}}>{c}</h3>
              <p className="dim" style={{fontSize:13, lineHeight:1.7, marginBottom:14}}>
                지역 큐레이터가 직접 다녀와 검증한 곳들을 묶어 소개합니다.
              </p>
              <span className="badge" style={{borderColor:'var(--gold-dim)', color:'var(--gold)'}}>준비 중</span>
            </article>
          ))}
        </div>

        {/* 예약 안내 — placeholder */}
        <section className="card" style={{padding:32, textAlign:'center'}}>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:10}}>RESERVATION · 예약 안내</div>
          <h2 className="ko-serif" style={{fontSize:26, marginBottom:14}}>곧 만나요</h2>
          <p className="dim" style={{fontSize:14, lineHeight:1.9, maxWidth:560, margin:'0 auto 22px'}}>
            큐레이션·검증을 거친 {meta.title.replace('놀자','').trim()} 목록과 예약 시스템이 곧 열립니다.
            업데이트 알림을 받고 싶으시면 회원가입 후 알림 설정을 켜 주세요.
          </p>
          <div style={{display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap'}}>
            {!user
              ? <button type="button" className="btn btn-gold" onClick={() => go('signup')}>회원가입 →</button>
              : <button type="button" className="btn btn-gold" onClick={() => go('community')}>커뮤니티에서 함께 이야기 →</button>}
            <button type="button" className="btn" onClick={() => go('tour')}>투어 프로그램 둘러보기</button>
          </div>
        </section>
      </div>
    </div>
  );
};

const EatPage  = ({ go, user }) => <PlacePage go={go} user={user} kind="eat"/>;
const SleepPage = ({ go, user }) => <PlacePage go={go} user={user} kind="sleep"/>;
const ShopPage  = ({ go, user }) => <PlacePage go={go} user={user} kind="shop"/>;

Object.assign(window, { EatPage, SleepPage, ShopPage });

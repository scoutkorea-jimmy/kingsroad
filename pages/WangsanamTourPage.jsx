// 왕사남 소개, 투어 상세
const WangsanamPage = ({ go }) => {
  const members = [
    { name: "뱅기노자", role: "커뮤니티장 · 수석 가이드", spec: "조선 정치사 · 실록 독해", years: 15, desc: "15년간 실록과 궁궐을 걷다. 『왕의길』 저자. 뱅기노자 커뮤니티를 세우고 이끈다." },
    { name: "이공", role: "건축 가이드", spec: "궁궐 건축 · 도시 공간", years: 12, desc: "조선 궁궐의 공간 언어를 읽는다. 수원 화성 전문." },
    { name: "정사관", role: "사료 가이드", spec: "조선왕조실록 · 승정원일기", years: 10, desc: "원문 사료를 함께 읽는 프로그램을 운영. 고전번역원 출신." },
    { name: "여백", role: "미학 가이드", spec: "조선 회화 · 왕실 미술", years: 8, desc: "왕실 회화와 공예를 통해 군주의 미의식을 짚는다." },
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
            // v00.184 — wsm-member-card 모바일 1열 폴백 클래스 추가 (디자인 룰 §2.5 모바일 정책).
            <div key={i} className={`card wsm-member-card ${i === 0 ? 'card-gold' : ''}`}
              style={{display:'grid', gridTemplateColumns:'200px 1fr auto', gap:40, alignItems:'center', padding:32}}>
              <div className="placeholder" style={{aspectRatio:'1', fontSize:9}}>
                {i === 0 ? '★ LEAD' : `○ 0${i+1}`}
              </div>
              <div>
                <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', color:'var(--secondary)', marginBottom:8}}>
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

const TourPage = ({ go, user }) => {
  const [tick, setTick] = React.useState(0);
  const G = window.BGNJ_GUARD;
  const refresh = () => setTick((v) => v + 1);
  const isAdmin = !!user?.isAdmin;
  // v00.236 — admin 은 hidden 투어도 함께 노출 (시각 라벨로 구분). 일반 회원은 hidden 제외.
  const allTours = React.useMemo(
    () => G.arr(() => window.BGNJ_TOURS?.listAll?.({ includeHidden: isAdmin })),
    [tick, isAdmin]
  );
  const bank = React.useMemo(() => G.call(() => window.BGNJ_LECTURES?.getBankAccount?.() || window.BGNJ_STORES?.bankAccount, {}), [tick]);
  // v00.236 — 투어 데이터 동기화 listener (LecturesPage 동일 패턴).
  React.useEffect(() => {
    Promise.resolve(window.BGNJ_TOURS?.refresh?.({ includeHidden: true })).finally(() => refresh());
    const onR = () => refresh();
    window.addEventListener('bgnj-tours-refresh', onR);
    return () => window.removeEventListener('bgnj-tours-refresh', onR);
  }, []);

  const [selectedIdx, setSelectedIdx] = React.useState(0);
  // v00.262.009 — 사용자 보고 "투어 클릭하면 과거가 먼저 보임". LecturesPage v00.129 와 동일 패턴 이식:
  // upcoming / past 버킷 분리 + 기본 'upcoming' + upcoming startsAt ASC, past startsAt DESC.
  const [bucket, setBucket] = React.useState('upcoming');
  // v00.263.000 — 지난 답사는 게시판 행 목록 모드 기본. 행 클릭 시 pastDetailId 가 set 되어 상세 모드.
  // null = 목록 / id = 상세. 버킷이 past 가 아닐 때는 무시.
  const [pastDetailId, setPastDetailId] = React.useState(null);
  // v00.228 — admin 전용 프론트 quick-add (사용자 요청: 관리자는 프론트에서도 투어 추가 가능).
  const [addOpen, setAddOpen] = React.useState(false);
  // v00.234 — admin 전용 프론트 edit.
  const [editTarget, setEditTarget] = React.useState(null);

  // v00.262.009 — startsAt 기준 분리. 어제 이후 = upcoming, 그 이전 = past. startsAt 없으면 upcoming (LecturesPage 동일 룰).
  const _now = Date.now();
  const _yesterday = _now - 86400000;
  const _isPast = (t) => {
    if (!t?.startsAt) return false;
    const ts = Date.parse(t.startsAt);
    return !isNaN(ts) && ts < _yesterday;
  };
  const toursUpcoming = React.useMemo(
    () => allTours.filter((t) => !_isPast(t))
      .sort((a, b) => (Date.parse(a.startsAt || 0) || 0) - (Date.parse(b.startsAt || 0) || 0)),
    [allTours]
  );
  const toursPast = React.useMemo(
    () => allTours.filter(_isPast)
      .sort((a, b) => (Date.parse(b.startsAt || 0) || 0) - (Date.parse(a.startsAt || 0) || 0)),
    [allTours]
  );
  const tours = bucket === 'past' ? toursPast : toursUpcoming;

  // 외부 진입(해시 / 마이페이지 알림 등)으로 들어온 투어 ID 처리 — 두 버킷 모두 검색해 적절한 탭으로 이동.
  // v00.263.000 — past 로 진입하면 게시판 상세 모드로 즉시 표시.
  React.useEffect(() => {
    let pending = null;
    try { pending = sessionStorage.getItem('bgnj_pending_tour_id'); } catch {}
    if (pending) {
      try { sessionStorage.removeItem('bgnj_pending_tour_id'); } catch {}
      const inUpcoming = toursUpcoming.findIndex((t) => String(t.id) === String(pending));
      if (inUpcoming >= 0) { setBucket('upcoming'); setSelectedIdx(inUpcoming); return; }
      const inPast = toursPast.findIndex((t) => String(t.id) === String(pending));
      if (inPast >= 0) { setBucket('past'); setSelectedIdx(inPast); setPastDetailId(String(pending)); }
    }
  }, []);

  // 버킷 전환 시 인덱스 리셋 + past 상세 모드 해제.
  React.useEffect(() => { setSelectedIdx(0); setPastDetailId(null); }, [bucket]);

  if (!allTours.length) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:560, textAlign:'center', padding:'80px 20px'}}>
          <p className="dim" style={{marginBottom: isAdmin ? 18 : 0}}>예정된 답사 프로그램이 없습니다.</p>
          {isAdmin && (
            <button type="button" className="btn btn-gold btn-small" onClick={() => setAddOpen(true)}>
              ＋ 투어 추가
            </button>
          )}
        </div>
        {addOpen && isAdmin && <TourQuickAddModal onClose={() => setAddOpen(false)} onSaved={refresh}/>}
      </div>
    );
  }

  const safeIdx = Math.max(0, Math.min(selectedIdx, Math.max(0, tours.length - 1)));
  const tour = tours[safeIdx];
  const seats = G.call(() => window.BGNJ_TOURS?.getSeats?.(tour.id), { capacity: 0, taken: 0, waitlist: 0, remaining: 0 });
  const myReg = user ? G.call(() => window.BGNJ_TOURS?.hasUserReserved?.(tour.id, user.id), null) : null;
  const formatPrice = (p) => window.BGNJ_FMT.priceOrFree(p);

  const labelStatus = (s) => ({
    pending_payment: '입금 대기',
    confirmed: '참가 확정',
    waitlist: '대기자',
    refund_requested: '환불 신청 중',
    cancelled: '취소됨',
  }[s] || s);
  const tone = (s) => ({
    // v00.230 — confirmed = secondary (가독성).
    confirmed: 'var(--secondary)',
    waitlist: 'var(--ink-2)',
    cancelled: 'var(--danger)',
    pending_payment: 'var(--ink-2)',
    refund_requested: 'var(--warning)',
  }[s] || 'var(--ink-2)');

  // v00.070 — 인트로(eyebrow/titlePrefix/titleAccent/subtitle) 를 site_content_kv.tourIntro 에서 읽어옴. 비면 코드 default.
  const sc070 = (window.BGNJ_SITE_CONTENT?.get?.() || {});
  const intro = (sc070.tourIntro && typeof sc070.tourIntro === 'object') ? sc070.tourIntro : {};
  const introEyebrow = intro.eyebrow || 'TOUR · 답사';
  const introPrefix  = intro.titlePrefix ?? '발로 읽는 ';
  const introAccent  = intro.titleAccent ?? '조선';
  const introSubtitle = intro.subtitle || '뱅기노자와 왕사남이 직접 운영하는 프로그램. 회원 전용 신청 · 무통장 입금 결제.';

  return (
    <div className="section">
      <div className="container">
        <div style={{marginBottom:48}}>
          <div className="section-eyebrow">{introEyebrow}</div>
          <h1 className="section-title">{introPrefix}<span className="accent">{introAccent}</span></h1>
          <p className="section-subtitle">{introSubtitle}</p>
        </div>

        {/* v00.262.009 — 지난/예정 버킷 토글 (LecturesPage v00.129 동일 패턴).
            v00.228 admin 전용 + 투어 추가 버튼은 우측 끝으로 이동. */}
        <div style={{display:'flex', gap:8, marginBottom:24, flexWrap:'wrap', alignItems:'center'}}>
          {[
            { k: 'upcoming', label: `진행 예정 답사 (${toursUpcoming.length})` },
            { k: 'past', label: `지난 답사 (${toursPast.length})` },
          ].map((b) => (
            <button key={b.k} type="button"
              onClick={() => setBucket(b.k)}
              aria-pressed={bucket === b.k}
              style={{
                padding:'8px 18px', borderRadius:999, fontSize:13, cursor:'pointer',
                border: '1px solid ' + (bucket === b.k ? 'var(--primary)' : 'var(--line)'),
                color: bucket === b.k ? 'var(--secondary)' : 'var(--ink-2)',
                background: bucket === b.k ? 'rgba(245,213,72,0.08)' : 'transparent',
              }}>
              {b.label}
            </button>
          ))}
          {isAdmin && (
            <button type="button" className="btn btn-gold btn-small"
              style={{marginLeft:'auto'}}
              onClick={() => setAddOpen(true)}>
              ＋ 투어 추가
            </button>
          )}
        </div>

        {tours.length === 0 && (
          <div style={{padding:'60px 20px', textAlign:'center'}}>
            <p className="dim" style={{fontSize:14}}>
              {bucket === 'upcoming' ? '예정된 답사가 없습니다.' : '지난 답사가 없습니다.'}
            </p>
          </div>
        )}

        {/* v00.263.000 — past 버킷 + 상세 미선택 = 게시판 행 목록 모드. */}
        {tours.length > 0 && bucket === 'past' && !pastDetailId && window.PastBoardList && (
          <window.PastBoardList items={tours} type="tour"
            onSelect={(id) => {
              const idx = tours.findIndex((t) => String(t.id) === String(id));
              if (idx >= 0) setSelectedIdx(idx);
              setPastDetailId(String(id));
              try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
            }}/>
        )}

        {/* Tabs + Grid — upcoming 항상, past 는 상세 모드일 때만. */}
        {tours.length > 0 && (bucket !== 'past' || pastDetailId) && (<>
        {/* v00.263.000 — past 상세 모드일 때 "← 목록으로" 진입로. */}
        {bucket === 'past' && pastDetailId && (
          <div style={{marginBottom:16}}>
            <button type="button" className="btn btn-small"
              onClick={() => setPastDetailId(null)}>
              ← 지난 답사 목록으로
            </button>
          </div>
        )}
        <div style={{display:'flex', gap:0, borderBottom:'1px solid var(--line-2)', marginBottom:40, overflowX:'auto'}}>
          {tours.map((t, i) => (
            <button key={t.id}
              onClick={() => setSelectedIdx(i)}
              style={{
                padding:'20px 28px',
                fontSize:13,
                whiteSpace:'nowrap',
                fontFamily:'var(--font-serif)',
                // v00.230 — 탭 활성 라벨은 secondary. indicator 는 옐로우 유지.
                color: safeIdx === i ? 'var(--secondary)' : 'var(--ink-2)',
                background: 'transparent', border: 'none',
                borderBottom: safeIdx === i ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom:-1, cursor:'pointer',
              }}>
              0{i+1} · {String(t.title || '').split(' — ')[0]}
            </button>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:60}} className="tour-grid">
          <div>
            {(() => {
              // v00.081 — 우선순위: D1.cover_url (tour.coverUrl) > site_content_kv.tourPages[id].coverDataUri (v00.070 legacy) > placeholder.
              // v00.235 — 갤러리 대표사진을 가장 우선.
              const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
              const tp = sc.tourPages?.[tour.id] || {};
              const galleryPrimary = window.pickPrimaryImage?.(tp.images);
              const coverUri = galleryPrimary?.url || tour.coverUrl || tp.coverDataUri || '';
              if (coverUri) {
                return (
                  <div style={{marginBottom:32}}>
                    {/* v00.239 — 좌우 여백 없이 자연 비율. */}
                    <img src={coverUri} alt={tour.title || '투어 포스터'}
                      style={{width:'100%', height:'auto', display:'block', borderRadius:2, background:'var(--bg-2)'}}/>
                    {galleryPrimary?.credit && (
                      <div className="dim mono" style={{fontSize:10, letterSpacing:'0.05em', marginTop:6, lineHeight:1.5}}>
                        {galleryPrimary.credit}
                      </div>
                    )}
                  </div>
                );
              }
              // v00.105 — 커버 미설정 시 BANGINOJA 로고 50% 투명 placeholder.
              return (
                <div style={{marginBottom:32}}>
                  {window.CoverPlaceholder
                    ? <window.CoverPlaceholder aspectRatio="16/10" label={String(tour.title || '').toUpperCase()}/>
                    : <div className="placeholder" style={{aspectRatio:'16/10', fontSize:11}}>{String(tour.title || '').toUpperCase()}</div>}
                </div>
              );
            })()}
            {/* v00.238 — 카테고리별 컬러 칩 (난이도/소요/규모/결제). */}
            <div style={{display:'flex', gap:8, marginBottom:20, flexWrap:'wrap', alignItems:'center'}}>
              <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', padding:'2px 8px', borderRadius:3, color:'var(--secondary)', background:'rgba(245,213,72,0.12)', border:'1px solid var(--primary-dim)'}}>
                ◆ {tour.level}
              </span>
              <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', padding:'2px 8px', borderRadius:3, color:'var(--secondary)', background:'rgba(146,64,14,0.06)', border:'1px solid var(--secondary)'}}>
                ⏱ {tour.duration}
              </span>
              {/* v00.262.009 — 정원 라벨 정합. 이전엔 tour.group(자유 텍스트 "5인 이하" 등) 만 표시 →
                  admin 이 capacity 만 12 로 바꿔도 라벨이 "5인 이하" 그대로 남는 모순 보고됨.
                  capacity 가 유효하면 항상 capacity 따라 표시, 없을 때만 group 사용. */}
              {(() => {
                const capNum = Number(tour.capacity);
                const groupLabel = Number.isFinite(capNum) && capNum > 0
                  ? `${capNum}인 이하`
                  : (tour.group || '소규모');
                return (
                  <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', padding:'2px 8px', borderRadius:3, color:'var(--info)', background:'rgba(37,99,235,0.06)', border:'1px solid var(--info)'}}>
                    ◧ {groupLabel}
                  </span>
                );
              })()}
              <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', padding:'2px 8px', borderRadius:3, color:'var(--tertiary)', background:'rgba(71,85,105,0.06)', border:'1px solid var(--tertiary)'}}>₩ 무통장 입금</span>
              {/* v00.236 — hidden 투어는 admin 만 보이고 시각 라벨로 구분. */}
              {tour.hidden && (
                <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--warning)', border:'1px solid var(--warning)', padding:'1px 6px'}}>
                  ◆ 숨김 (관리자에게만 보임)
                </span>
              )}
              {/* v00.234 — admin 전용 프론트 수정 진입로. */}
              {isAdmin && (
                <button type="button" className="btn btn-small"
                  style={{marginLeft:'auto', fontSize:11, padding:'4px 10px'}}
                  onClick={() => setEditTarget(tour)}>
                  ✎ 투어 수정
                </button>
              )}
            </div>
            {/* v00.106 — 제목 + 부제 + 설명 */}
            <h2 className="ko-serif" style={{fontSize:40, fontWeight:500, lineHeight:1.2, marginBottom: tour.subtitle ? 6 : 24}}>{tour.title}</h2>
            {tour.subtitle && (
              <p className="ko-serif gold-2" style={{fontSize:18, lineHeight:1.4, marginBottom:24, fontStyle:'italic'}}>
                {tour.subtitle}
              </p>
            )}
            <p className="dim bgnj-multiline" style={{fontSize:16, lineHeight:1.9, marginBottom:32}}>{tour.desc}</p>
            {/* v00.235 — 사진 갤러리 (대표 외 추가 사진 그리드). */}
            {window.MediaGalleryView && (() => {
              const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
              const imgs = sc.tourPages?.[tour.id]?.images;
              return <window.MediaGalleryView images={imgs} title={tour.title}/>;
            })()}

            {(() => {
              // v00.066 — per-tour override(tourPages[tourId]) 우선, 없으면 글로벌(tourSchedule/tourPrep) fallback.
              // 둘 다 빈 배열이면 섹션 미노출.
              const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
              const perTour = (sc.tourPages && typeof sc.tourPages === 'object' && tour?.id) ? (sc.tourPages[tour.id] || null) : null;
              const ovrSchedule = Array.isArray(perTour?.schedule) ? perTour.schedule : null;
              const ovrPrep     = Array.isArray(perTour?.prep)     ? perTour.prep     : null;
              const schedule = (ovrSchedule && ovrSchedule.length > 0)
                ? ovrSchedule.filter((s) => s && (s.t || s.l))
                : (Array.isArray(sc.tourSchedule) ? sc.tourSchedule.filter((s) => s && (s.t || s.l)) : []);
              const prep = (ovrPrep && ovrPrep.length > 0)
                ? ovrPrep.filter(Boolean)
                : (Array.isArray(sc.tourPrep) ? sc.tourPrep.filter(Boolean) : []);
              return (
                <>
                  {schedule.length > 0 && (
                    <>
                      <h3 className="ko-serif" style={{fontSize:20, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
                        답사 일정
                      </h3>
                      <div style={{marginBottom:32}}>
                        {schedule.map((s, i) => (
                          <div key={i} style={{display:'grid', gridTemplateColumns:'100px 1fr', gap:24, padding:'14px 0', borderBottom:'1px dashed var(--line)'}}>
                            <div className="mono gold" style={{fontSize:12, letterSpacing:'0.1em'}}>{s.t}</div>
                            <div className="ko-serif" style={{fontSize:15}}>{s.l}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {prep.length > 0 && (
                    <>
                      <h3 className="ko-serif" style={{fontSize:20, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
                        준비물
                      </h3>
                      <ul style={{paddingLeft:20, color:'var(--ink-2)', lineHeight:2, fontSize:14, marginBottom:48}}>
                        {prep.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </>
                  )}
                </>
              );
            })()}

            {/* v00.106 — 환불정책. per-tour > 글로벌 default. 둘 다 비면 미노출. */}
            {(() => {
              const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
              const policy = (tour.refundPolicy && tour.refundPolicy.trim())
                || (sc.tourRefundPolicy && String(sc.tourRefundPolicy).trim())
                || '';
              if (!policy) return null;
              return (
                <>
                  <h3 className="ko-serif" style={{fontSize:20, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
                    환불정책
                  </h3>
                  <p className="dim bgnj-multiline" style={{fontSize:14, lineHeight:1.9, marginBottom:48}}>
                    {policy}
                  </p>
                </>
              );
            })()}

            <TourReviewsSection tour={tour} user={user} go={go} onRefresh={refresh}/>
          </div>

          {/* Sidebar — booking */}
          <div>
            <TourBookingPanel
              tour={tour}
              user={user}
              bank={bank}
              myReg={myReg}
              seats={seats}
              labelStatus={labelStatus}
              tone={tone}
              formatPrice={formatPrice}
              onRefresh={refresh}
              go={go}
            />
          </div>
        </div>
        </>)}
      </div>
      {/* v00.228 — admin 전용 투어 quick-add 모달. */}
      {addOpen && isAdmin && <TourQuickAddModal onClose={() => setAddOpen(false)} onSaved={refresh}/>}
      {/* v00.234 — admin 전용 투어 수정 모달 (initialTour prop). */}
      {editTarget && isAdmin && <TourQuickAddModal onClose={() => setEditTarget(null)} onSaved={refresh} initialTour={editTarget}/>}
    </div>
  );
};

// v00.228 — admin 전용 프론트 투어 quick-add. AuthAdminPage 의 addNewTour 와 같은 saveTour 호출.
// 상세(부제·설명·환불정책·커버)는 admin 패널에서 후속 편집.
// v00.234 — initialTour prop 으로 edit 모드 확장.
const TourQuickAddModal = ({ onClose, onSaved, initialTour = null }) => {
  const isEdit = !!initialTour?.id;
  // 기본값: +2주 10:00 (admin 패널의 addNewTour 와 동일).
  const _defaultStartLocal = (() => {
    const d = new Date(Date.now() + 14 * 86400000);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T10:00`;
  })();
  const _toLocalInput = (iso) => {
    if (!iso) return _defaultStartLocal;
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return _defaultStartLocal;
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch { return _defaultStartLocal; }
  };
  const [title, setTitle] = React.useState(initialTour?.title || '');
  const [subtitle, setSubtitle] = React.useState(initialTour?.subtitle || '');
  const [level, setLevel] = React.useState(initialTour?.level || '입문');
  const [duration, setDuration] = React.useState(initialTour?.duration || '3시간');
  const [group, setGroup] = React.useState(initialTour?.group || '12인 이하');
  const [startsAt, setStartsAt] = React.useState(_toLocalInput(initialTour?.startsAt));
  const [durationMinutes, setDurationMinutes] = React.useState(initialTour?.durationMinutes || 180);
  const [capacity, setCapacity] = React.useState(initialTour?.capacity || 12);
  const [price, setPrice] = React.useState(initialTour?.priceNumber ?? initialTour?.price ?? 80000);
  const [desc, setDesc] = React.useState(initialTour?.desc || '');
  // v00.235 — 사진 갤러리 (최대 10장 + 출처 + 대표).
  const [images, setImages] = React.useState(() => {
    if (!initialTour?.id) return [];
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const arr = sc.tourPages?.[initialTour.id]?.images;
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  });
  // v00.236 — hidden 토글.
  const [hidden, setHidden] = React.useState(!!initialTour?.hidden);
  const [error, setError] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const dirty = !!(title.trim() || subtitle.trim() || desc.trim() || images.length > 0);
  const guard = window.useModalGuard?.({ open: true, dirty, onClose, onSaveDraft: null, label: isEdit ? '투어 수정' : '투어 추가' }) || {};

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('투어 제목은 필수입니다.'); return; }
    if (!startsAt) { setError('일시를 입력해 주세요.'); return; }
    setSaving(true);
    try {
      const dt = new Date(startsAt);
      if (isNaN(dt.getTime())) throw new Error('일시 형식이 올바르지 않습니다.');
      const pad = (n) => String(n).padStart(2, '0');
      const next = `${dt.getFullYear()}.${pad(dt.getMonth()+1)}.${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
      // edit: 기존 id 유지 / add: 새 id 생성. saveTour 가 update/create 분기.
      const id = isEdit ? initialTour.id : `tour-${Date.now()}`;
      await window.BGNJ_TOURS.saveTour({
        id,
        title: title.trim(),
        subtitle: subtitle.trim(),
        level: level.trim() || '입문',
        duration: duration.trim(),
        group: group.trim(),
        next,
        startsAt: dt.toISOString(),
        durationMinutes: Math.max(1, Number(durationMinutes) || 180),
        capacity: Math.max(1, Number(capacity) || 12),
        priceNumber: Math.max(0, Number(price) || 0),
        price: Math.max(0, Number(price) || 0),
        desc: desc.trim(),
        hidden: !!hidden, // v00.236
      });
      // v00.235 — 갤러리 저장 (site_content_kv.tourPages[id]). 기존 schedule/prep/coverDataUri 보존.
      if (images.length > 0 || isEdit) {
        try {
          const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
          const existing = (sc.tourPages && typeof sc.tourPages === 'object' && sc.tourPages[id]) || {};
          await window.BGNJ_SITE_CONTENT.saveSection('tourPages', { [id]: { ...existing, images } });
          try { window.BGNJ_BROADCAST?.publish?.('site-content'); } catch {}
        } catch (galleryErr) {
          try { console.warn('[TourQuickAddModal] 갤러리 저장 실패:', galleryErr); } catch {}
          window.BGNJ_TOAST?.error?.('투어 정보는 저장됐지만 갤러리 저장에 실패했습니다.');
        }
      }
      try { await window.BGNJ_AUDIT?.log?.({ action: isEdit ? 'tour.update' : 'tour.create', target: `tour:${id}` }); } catch {}
      try { window.BGNJ_BROADCAST?.publish?.('tours'); } catch {}
      window.BGNJ_TOAST?.success?.(isEdit ? '투어가 수정되었습니다.' : '투어가 등록되었습니다.');
      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(err?.body?.error || err?.message || (isEdit ? '투어 수정 실패' : '투어 생성 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={isEdit ? '투어 수정' : '투어 추가'}
      onClick={guard.onBackdropClick}
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'grid', placeItems:'start center', padding:24, overflowY:'auto'}}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width:'min(560px, 100%)', background:'var(--bg)', boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
        padding:24, marginTop:24, marginBottom:48,
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14}}>
          <h2 className="ko-serif" style={{fontSize:18, margin:0}}>{isEdit ? '투어 수정' : '새 투어 추가'}</h2>
          <button type="button" className="btn btn-small" onClick={onClose}>닫기</button>
        </div>
        <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:18}}>
          {isEdit
            ? '기본 정보를 수정합니다. 일정·준비물·커버·환불정책 등 상세는 관리자 패널에서 편집하세요.'
            : '기본 정보만 입력해 빠르게 등록합니다. 일정·준비물·커버·환불정책 등 상세 편집은 관리자 패널에서 이어서 진행하세요.'}
        </p>
        <form onSubmit={submit} style={{display:'grid', gap:12}}>
          <div className="field" style={{margin:0}}>
            <label className="field-label">투어 제목 *</label>
            <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 창덕궁 후원 답사" autoFocus/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label">부제 (선택)</label>
            <input className="field-input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
              placeholder="예: 정조의 효심을 따라"/>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label">난이도</label>
              <input className="field-input" value={level} onChange={(e) => setLevel(e.target.value)}
                placeholder="입문/심화"/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">소요 (표시)</label>
              <input className="field-input" value={duration} onChange={(e) => setDuration(e.target.value)}
                placeholder="3시간"/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">규모 (표시)</label>
              <input className="field-input" value={group} onChange={(e) => setGroup(e.target.value)}
                placeholder="12인 이하"/>
            </div>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label">출발 일시 *</label>
            <input type="datetime-local" className="field-input"
              value={startsAt} onChange={(e) => setStartsAt(e.target.value)}/>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label">소요 (분)</label>
              <input type="number" min={1} className="field-input"
                value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)}/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">정원</label>
              <input type="number" min={1} className="field-input"
                value={capacity} onChange={(e) => setCapacity(e.target.value)}/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">참가비 (원)</label>
              <input type="number" min={0} step={1000} className="field-input"
                value={price} onChange={(e) => setPrice(e.target.value)}/>
            </div>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label">소개 (선택)</label>
            <textarea className="field-input" rows={3}
              value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="답사 안내 (이후 관리자 패널에서 보강 가능)"/>
          </div>
          {/* v00.235 — 사진 갤러리 편집기. */}
          {window.MediaGalleryEditor && (
            <window.MediaGalleryEditor value={images} onChange={setImages} folder="tour-gallery"/>
          )}
          {/* v00.236 — hidden 토글. */}
          <label style={{display:'flex', gap:8, alignItems:'center', padding:'8px 12px', background:'var(--bg-2)', border:'1px solid var(--line)', borderRadius:6, fontSize:12, color:'var(--ink-2)', cursor:'pointer'}}>
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)}
              style={{accentColor:'var(--primary)'}}/>
            <span>임시 숨김 — 일반 회원에게 노출 안 함 (관리자에게는 "숨김" 라벨로 표시)</span>
          </label>
          {error && (
            <div role="alert" style={{padding:'8px 10px', background:'rgba(194,74,61,0.1)', border:'1px solid var(--danger)', color:'var(--danger)', fontSize:12}}>
              {error}
            </div>
          )}
          <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:6}}>
            <button type="button" className="btn btn-small" onClick={onClose} disabled={saving}>취소</button>
            <button type="submit" className="btn btn-gold btn-small" disabled={saving || !title.trim()}>
              {saving ? '저장 중...' : (isEdit ? '투어 저장' : '투어 등록')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TourBookingPanel = ({ tour, user, bank, myReg, seats, labelStatus, tone, formatPrice, onRefresh, go }) => {
  const [selectedBankId, setSelectedBankId] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [phone, setPhone] = React.useState("");
  const [count, setCount] = React.useState(1);
  const [note, setNote] = React.useState("");
  // v00.218 — 현금영수증 신청
  const [cashReceipt, setCashReceipt] = React.useState(() => window.BGNJ_CashReceipt?.empty?.() || { requested: false, type: 'personal', identifier: '' });
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(null);
  const [refundMode, setRefundMode] = React.useState(false);
  const [refundReason, setRefundReason] = React.useState("");
  const [refundError, setRefundError] = React.useState("");
  // v00.232 — 사용자 요청: 투어 신청 시 개인정보 활용 + 제3자 제공 동의 필수.
  const [agreed, setAgreed] = React.useState(false);

  // 투어가 바뀌면 폼 초기화
  React.useEffect(() => {
    setOpen(false); setSubmitted(null); setError(""); setCount(1); setNote("");
    setName(user?.name || ""); setEmail(user?.email || "");
    setRefundMode(false); setRefundReason(""); setRefundError("");
    setAgreed(false);
  }, [tour.id, user?.id]);

  const requireLogin = async (label) => {
    if ((await window.BGNJ_CONFIRM(`${label}은(는) 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?`, { danger: true }))) {
      go("login");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) return requireLogin('답사 신청');
    if (!name.trim() || !email.trim()) { setError("이름과 이메일은 필수입니다."); return; }
    if (!agreed) { setError("개인정보 활용 및 제3자 제공 동의는 필수입니다."); return; }
    try {
      // v00.218 — 현금영수증 신청 정보 note prefix 인코딩
      const crPrefix = window.BGNJ_CashReceipt?.encode?.(cashReceipt) || '';
      const noteCombined = (crPrefix + (note.trim() || '')).trim();
      const result = await window.BGNJ_TOURS.reserve(tour.id, {
        userId: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        count: Math.max(1, Number(count) || 1),
        note: noteCombined,
      });
      if (!result?.ok) { setError(result?.message || "신청 처리에 실패했습니다."); return; }
      setSubmitted(result.reservation);
      onRefresh();
      setOpen(false);
    } catch (err) {
      setError(err?.body?.error || err?.message || '신청 처리 중 오류');
    }
  };

  const cancelMyReg = async () => {
    if (!myReg) return;
    if (!(await window.BGNJ_CONFIRM("이 답사 신청을 취소하시겠어요?", { danger: true }))) return;
    try {
      await window.BGNJ_TOURS.cancelReservation(tour.id, myReg.id);
      onRefresh(); setSubmitted(null);
    } catch (err) {
      window.BGNJ_TOAST.error('취소 실패: ' + (err?.body?.error || err?.message || ''));
    }
  };

  const submitRefund = async () => {
    setRefundError("");
    if (!refundReason.trim()) { setRefundError("환불 사유를 입력해 주세요."); return; }
    try {
      const result = await window.BGNJ_TOURS.requestRefund(tour.id, myReg.id, refundReason);
      if (!result?.ok) { setRefundError(result?.message || '환불 신청 실패'); return; }
      setRefundMode(false); setRefundReason("");
      onRefresh();
    } catch (err) {
      setRefundError(err?.body?.error || err?.message || '환불 신청 중 오류');
    }
  };

  const downloadIcs = () => window.BGNJ_TOURS.downloadIcs(tour.id);
  const showPaymentInfo = (tour.priceNumber || 0) > 0 && (myReg?.status === 'pending_payment' || submitted?.status === 'pending_payment');
  const isFull = seats.remaining <= 0;
  const isPaidConfirmed = myReg?.status === 'confirmed' && (tour.priceNumber || 0) > 0;

  return (
    <div className="card card-gold mobile-release-sticky" style={{position:'sticky', top:100}}>
      <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.3em'}}>NEXT SCHEDULE</div>
      <div className="gold-2 ko-serif" style={{fontSize:24, margin:'8px 0 20px'}}>{tour.next}</div>

      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)'}}>
        <span className="dim">참가비</span>
        <span className="gold-2 ko-serif" style={{fontSize:22}}>{formatPrice(tour.priceNumber)}</span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)'}}>
        <span className="dim">소요 시간</span>
        <span>{tour.duration}</span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)'}}>
        <span className="dim">정원</span>
        <span>{tour.capacity}명</span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)'}}>
        <span className="dim">잔여</span>
        <span style={{ color: isFull ? 'var(--danger)' : 'var(--secondary)' }}>
          {isFull ? `대기 ${seats.waitlist}명` : `${seats.remaining}석`}
        </span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)', marginBottom:18}}>
        <span className="dim">난이도</span>
        <span className="gold">{tour.level}</span>
      </div>

      {/* 내 신청 상태 카드 */}
      {myReg && (
        <div style={{padding:14, background:'rgba(245,213,72,0.06)', border:'1px solid var(--primary-dim)', marginBottom:16}}>
          <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:6}}>MY RESERVATION</div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:8}}>
            <span className="ko-serif" style={{fontSize:16}}>{labelStatus(myReg.status)}</span>
            <span className="mono" style={{fontSize:11, letterSpacing:'0.2em', color: tone(myReg.status)}}>
              {myReg.count}명 · {formatPrice((tour.priceNumber || 0) * (myReg.count || 1))}
            </span>
          </div>
          {myReg.status === 'pending_payment' && (
            <p className="dim" style={{fontSize:12, lineHeight:1.7, marginTop:8}}>
              계좌로 입금 후 운영자가 확인하면 참가가 확정됩니다.
            </p>
          )}
          {myReg.status === 'waitlist' && (
            <p className="dim" style={{fontSize:12, lineHeight:1.7, marginTop:8}}>
              정원이 차서 대기 등록되었습니다. 자리가 나면 자동으로 전환됩니다.
            </p>
          )}
          {myReg.status === 'refund_requested' && (
            <p className="dim" style={{fontSize:12, lineHeight:1.7, marginTop:8}}>
              환불 신청이 접수되었습니다. 운영자 확인 후 처리됩니다.
              {myReg.refundReason && <span className="dim-2"> · 사유: {myReg.refundReason}</span>}
            </p>
          )}
          {myReg.refundAdminNote && myReg.status === 'confirmed' && (
            <p style={{fontSize:11, color:'var(--danger)', marginTop:6}}>
              환불 반려 메모: {myReg.refundAdminNote}
            </p>
          )}
          {!refundMode && (
            <div style={{display:'flex', gap:6, marginTop:10, flexWrap:'wrap'}}>
              <button type="button" className="btn btn-small" onClick={downloadIcs}>캘린더 추가 (.ics)</button>
              {myReg.status !== 'refund_requested' && (
                isPaidConfirmed
                  ? <button type="button" className="btn btn-small"
                      onClick={() => setRefundMode(true)}
                      style={{borderColor:'var(--warning)', color:'var(--warning)', marginLeft:'auto'}}>환불 신청</button>
                  : <button type="button" className="btn btn-small" onClick={cancelMyReg}
                      style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:'auto'}}>신청 취소</button>
              )}
            </div>
          )}
          {refundMode && (
            <div style={{marginTop:10, padding:12, background:'rgba(217,119,6,0.10)', border:'1px solid var(--warning)', borderRadius:4}}>
              <p className="dim" style={{fontSize:11, lineHeight:1.7, marginBottom:8}}>
                환불 신청 후 운영자 확인을 거쳐 처리됩니다.
              </p>
              <textarea value={refundReason} onChange={e => setRefundReason(e.target.value)}
                placeholder="환불 사유 (필수)"
                className="field-input" rows={2}
                style={{width:'100%', padding:'8px 10px', fontSize:12, resize:'vertical', marginBottom:6}}/>
              {refundError && <p style={{color:'var(--danger)', fontSize:11, marginBottom:6}}>{refundError}</p>}
              <div style={{display:'flex', gap:6}}>
                <button type="button" className="btn btn-small"
                  style={{borderColor:'var(--warning)', color:'var(--warning)'}}
                  onClick={submitRefund}>신청하기</button>
                <button type="button" className="btn btn-small"
                  onClick={() => { setRefundMode(false); setRefundReason(''); setRefundError(''); }}>취소</button>
              </div>
            </div>
          )}
        </div>
      )}

      {!myReg && submitted && (
        <div style={{padding:14, background:'rgba(245,213,72,0.06)', border:'1px solid var(--primary-dim)', marginBottom:16}}>
          <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:6}}>SUBMITTED</div>
          <div className="ko-serif" style={{fontSize:16, marginBottom:6}}>
            신청 접수 — {labelStatus(submitted.status)}
          </div>
          <p className="dim" style={{fontSize:12, lineHeight:1.7}}>
            {submitted.status === 'pending_payment'
              ? '아래 계좌로 입금 후 운영자가 확인하면 참가가 확정됩니다.'
              : submitted.status === 'confirmed'
                ? '참가가 확정되었습니다. 일정을 캘린더에 추가해 두세요.'
                : '대기자로 등록되었습니다. 자리가 나면 자동 전환됩니다.'}
          </p>
        </div>
      )}

      {/* 무통장 입금 안내 */}
      {showPaymentInfo && (
        <div style={{marginBottom:16}}>
          {window.BGNJ_BankAccountPicker
            ? <window.BGNJ_BankAccountPicker value={selectedBankId} onChange={setSelectedBankId}/>
            : null}
          <div style={{
            marginTop:10, padding:'10px 14px', background:'var(--bg-2)',
            border:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'baseline',
          }}>
            <span className="dim" style={{fontSize:13}}>입금 금액</span>
            <span className="gold ko-serif" style={{fontSize:18}}>
              {formatPrice((tour.priceNumber || 0) * (myReg?.count || submitted?.count || 1))}
            </span>
          </div>
        </div>
      )}

      {/* 신청 폼 진입 */}
      {!myReg && !submitted && (
        <>
          {!open ? (
            <>
              <button type="button" className="btn btn-gold btn-block" style={{marginBottom:10}}
                onClick={() => { if (!user) { requireLogin('답사 신청'); return; } setOpen(true); setError(""); }}>
                {isFull ? '대기자 등록' : '답사 신청'}
              </button>
              <button type="button" className="btn btn-block" onClick={downloadIcs}>캘린더에 추가 (.ics)</button>
            </>
          ) : (
            <form onSubmit={submit}>
              <div style={{display:'grid', gap:10, marginBottom:10}}>
                <div className="field" style={{margin:0}}>
                  <label className="field-label">이름</label>
                  <input className="field-input" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="field" style={{margin:0}}>
                  <label className="field-label">이메일</label>
                  <input type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 100px', gap:10}}>
                  <div className="field" style={{margin:0}}>
                    <label className="field-label">연락처</label>
                    <input className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-..."/>
                  </div>
                  <div className="field" style={{margin:0}}>
                    <label className="field-label">인원</label>
                    <input type="number" min={1} max={Math.max(1, tour.capacity)} className="field-input"
                      value={count} onChange={(e) => setCount(e.target.value)}/>
                  </div>
                </div>
                <div className="field" style={{margin:0}}>
                  <label className="field-label">메모</label>
                  <textarea className="field-input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="동행자 / 특이사항"/>
                </div>
                {/* v00.218 — 현금영수증 신청 (유료 답사만) */}
                {(tour.priceNumber || 0) > 0 && window.BGNJ_CashReceiptField && (
                  <window.BGNJ_CashReceiptField value={cashReceipt} onChange={setCashReceipt}/>
                )}
              </div>
              {error && (
                <div role="alert" style={{padding:'8px 10px', background:'rgba(194,74,61,0.1)', border:'1px solid var(--danger)', color:'var(--danger)', fontSize:12, marginBottom:10}}>
                  {error}
                </div>
              )}
              <div className="dim mono" style={{fontSize:10, lineHeight:1.7, marginBottom:10, letterSpacing:'0.05em'}}>
                {(tour.priceNumber || 0) === 0
                  ? '무료 답사라 신청 즉시 참가 확정됩니다.'
                  : `합계 ${formatPrice((tour.priceNumber || 0) * (Number(count) || 1))} · 신청 → 입금 → 운영자 확인 → 참가 확정`}
                {isFull && ' · 정원이 차서 자동 대기자 등록됩니다.'}
              </div>
              {/* v00.232 — 개인정보 활용 + 제3자 제공 동의 (필수). */}
              <label style={{display:'flex', gap:8, alignItems:'flex-start', padding:'10px 12px', background:'var(--bg-2)', border:'1px solid var(--line)', borderRadius:6, marginBottom:10, cursor:'pointer'}}>
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                  style={{marginTop:3, accentColor:'var(--primary)'}}/>
                <span style={{fontSize:12, lineHeight:1.6, color:'var(--ink-2)'}}>
                  <strong style={{color:'var(--secondary)'}}>[필수]</strong> 답사 신청 처리(이름·이메일·연락처) 와 운영자 안내 발송을 위해 개인정보 활용 및 운영 제휴사로의 제3자 제공에 동의합니다. {' '}
                  <button type="button" onClick={() => go('privacy')}
                    style={{background:'none', border:'none', padding:0, color:'var(--secondary)', textDecoration:'underline', cursor:'pointer', fontSize:'inherit'}}>
                    자세히 보기
                  </button>
                </span>
              </label>
              <div style={{display:'flex', gap:6, justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-small" onClick={() => setOpen(false)}>취소</button>
                <button type="submit" className="btn btn-gold btn-small" disabled={!agreed}>신청 접수</button>
              </div>
            </form>
          )}
        </>
      )}

      {/* 비로그인 안내 */}
      {!user && (
        <p className="dim-2" style={{fontSize:11, lineHeight:1.7, marginTop:14, textAlign:'center'}}>
          답사 신청은 회원가입한 분만 가능합니다.
        </p>
      )}
    </div>
  );
};

// === 투어 후기 섹션 =======================================================
const TourReviewsSection = ({ tour, user, go, onRefresh }) => {
  const reviews = window.BGNJ_TOURS.listReviews(tour.id);
  const canReview = user ? window.BGNJ_TOURS.canReview(tour.id, user.id) : false;
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState("");
  // v00.070 — 게이트/익명/empty 안내 문구를 site_content_kv.tourReviewsGate 에서 읽음. 비면 코드 default.
  const gateContent = (() => {
    const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
    const g = (sc.tourReviewsGate && typeof sc.tourReviewsGate === 'object') ? sc.tourReviewsGate : {};
    return {
      gate: g.gate || '후기는 참가 확정된 회원만 작성할 수 있습니다. 아직 신청 전이라면 사이드바에서 답사를 신청하고 운영자 입금 확인을 받은 뒤 다시 와 주세요.',
      anonymous: g.anonymous || '후기 작성은 회원 전용입니다.',
      empty: g.empty || '아직 등록된 후기가 없습니다. 첫 번째 후기를 남겨 주세요.',
    };
  })();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      if ((await window.BGNJ_CONFIRM("후기 작성은 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?", { danger: true }))) {
        go("login");
      }
      return;
    }
    if (!canReview) {
      setError("참가 확정된 분만 후기를 작성할 수 있습니다.");
      return;
    }
    if (!text.trim()) { setError("후기 내용을 입력해 주세요."); return; }
    window.BGNJ_TOURS.addReview(tour.id, {
      userId: user.id,
      author: user.name,
      rating,
      text: text.trim(),
    });
    setText("");
    setRating(5);
    onRefresh?.();
  };

  const remove = async (id) => {
    if (!(await window.BGNJ_CONFIRM("이 후기를 삭제하시겠어요?", { danger: true }))) return;
    window.BGNJ_TOURS.deleteReview(tour.id, id);
    onRefresh?.();
  };

  const avgRating = reviews.length === 0 ? 0
    : (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length);

  const stars = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

  return (
    <section aria-labelledby="tour-reviews">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:12, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
        <h3 id="tour-reviews" className="ko-serif" style={{fontSize:20}}>
          참여 후기 <span className="dim-2 mono" style={{fontSize:12, marginLeft:6}}>{reviews.length}건</span>
        </h3>
        {reviews.length > 0 && (
          <span className="gold mono" style={{fontSize:12, letterSpacing:'0.16em'}}>
            평균 {avgRating.toFixed(1)} {stars(avgRating)}
          </span>
        )}
      </div>

      {/* 후기 작성 영역 */}
      {user ? (
        canReview ? (
          <form onSubmit={submit} className="card" style={{padding:16, marginBottom:24}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:10}}>WRITE A REVIEW</div>
            <div style={{display:'flex', gap:14, alignItems:'center', marginBottom:10, flexWrap:'wrap'}}>
              <span className="dim" style={{fontSize:12}}>평점</span>
              <div style={{display:'flex', gap:2}}>
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n}점`}
                    style={{
                      background:'transparent', border:'none', cursor:'pointer',
                      color: n <= rating ? 'var(--primary)' : 'var(--ink-3)',
                      fontSize:18, padding:'2px 4px',
                    }}>
                    {n <= rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <span className="mono dim-2" style={{fontSize:11}}>{rating}.0</span>
            </div>
            <textarea className="field-input" rows={3} value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="답사가 어땠는지 짧게 남겨 주세요." style={{marginBottom:10}}/>
            {error && (
              <div role="alert" style={{padding:'8px 10px', background:'rgba(194,74,61,0.1)', border:'1px solid var(--danger)', color:'var(--danger)', fontSize:12, marginBottom:10}}>
                {error}
              </div>
            )}
            <div style={{display:'flex', justifyContent:'flex-end'}}>
              <button type="submit" className="btn btn-gold btn-small" disabled={!text.trim()}>등록</button>
            </div>
          </form>
        ) : (
          <div className="card dim" style={{padding:16, marginBottom:24, fontSize:13, lineHeight:1.7, whiteSpace:'pre-wrap'}}>
            {gateContent.gate}
          </div>
        )
      ) : (
        <div className="card" style={{padding:16, marginBottom:24, textAlign:'center', background:'rgba(245,213,72,0.04)'}}>
          <p className="dim" style={{fontSize:13, marginBottom:10, whiteSpace:'pre-wrap'}}>{gateContent.anonymous}</p>
          <div style={{display:'flex', gap:8, justifyContent:'center'}}>
            <button type="button" className="btn btn-gold btn-small" onClick={() => go('login')}>로그인</button>
            <button type="button" className="btn btn-small" onClick={() => go('signup')}>회원가입</button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="dim" style={{fontSize:13, padding:'24px 0', textAlign:'center', whiteSpace:'pre-wrap'}}>
          {gateContent.empty}
        </div>
      ) : (
        <ol style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:12}}>
          {reviews.map((r) => (
            <li key={r.id} className="card" style={{padding:16}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:10, marginBottom:8}}>
                <div style={{display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
                  <span className="gold mono" style={{fontSize:12, letterSpacing:'0.1em'}}>
                    {r.author}
                    <AuthorGradeBadge authorId={r.userId} author={r.author}/>
                  </span>
                  <span className="gold" style={{fontSize:14}}>{stars(r.rating)}</span>
                  <span className="dim-2 mono" style={{fontSize:11}}>{window.BGNJ_FMT.kstDate(r.createdAt)}</span>
                </div>
                {!!user && (user.isAdmin || r.userId === user.id) && (
                  <button type="button" className="btn-ghost"
                    onClick={() => remove(r.id)}
                    style={{fontSize:11, color:'var(--danger)'}}>삭제</button>
                )}
              </div>
              <p style={{fontFamily:'var(--font-reading)', fontSize:14, lineHeight:1.8, color:'var(--ink)', whiteSpace:'pre-wrap'}}>{r.text}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

Object.assign(window, { WangsanamPage, TourPage, TourBookingPanel, TourReviewsSection, TourQuickAddModal });

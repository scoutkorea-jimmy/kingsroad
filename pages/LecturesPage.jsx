// 뱅기노자 강연 일정 — 투어 페이지와 같은 스타일(탭 + 스티키 사이드바)
// v00.287 ESM (main) — cross-module import (전역 결합 제거).
import { MediaGalleryEditor, MediaGalleryView, pickPrimaryImage } from '../components/MediaGallery.jsx';
import { AuthorGradeBadge, CoverPlaceholder, PastBoardList } from '../components/Shell.jsx';

const LecturesPage = ({ go, user }) => {
  const [tick, setTick] = React.useState(0);
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  // v00.129 — 지난/예정 분리 탭. 사용자 요청 '강연탭에서는 지난 강연과 진행 예정 강연 탭으로 나눠줘'.
  const [bucket, setBucket] = React.useState('upcoming'); // 'upcoming' | 'past'
  // v00.263.000 — 지난 강연은 게시판 행 목록 모드. 행 클릭 시 pastDetailId set → 상세 모드.
  const [pastDetailId, setPastDetailId] = React.useState(null);
  // v00.228 — admin 전용 프론트 quick-add (사용자 요청: 관리자는 프론트에서도 강연 추가 가능).
  const [addOpen, setAddOpen] = React.useState(false);
  // v00.234 — admin 전용 프론트 edit (선택된 강연 객체가 들어가면 모달 노출).
  const [editTarget, setEditTarget] = React.useState(null);
  const isAdmin = !!user?.isAdmin;
  const refresh = () => setTick((v) => v + 1);
  const G = window.BGNJ_GUARD;

  // v00.236 — 사용자 보고 '강연 등록해놓은게 있는데 왜 노출이 안되냐'.
  // admin 으로 로그인한 사용자는 hidden 강연도 함께 노출 (시각 라벨로 구분). 일반 회원/비로그인은 hidden 제외.
  const allLectures = React.useMemo(
    () => G.arr(() => window.BGNJ_LECTURES?.listAll?.({ includeHidden: isAdmin })),
    [tick, isAdmin]
  );
  const bank = React.useMemo(() => G.call(() => window.BGNJ_LECTURES?.getBankAccount?.(), {}), [tick]);
  // v00.236 — 강연 데이터 동기화 listener (ColumnPage v00.134 패턴 동일).
  // 진입 시 1회 강제 refresh + bgnj-lectures-refresh 청취. 데이터 로드 누락 차단.
  React.useEffect(() => {
    Promise.resolve(window.BGNJ_LECTURES?.refresh?.({ includeHidden: true })).finally(() => refresh());
    const onR = () => refresh();
    window.addEventListener('bgnj-lectures-refresh', onR);
    return () => window.removeEventListener('bgnj-lectures-refresh', onR);
  }, []);

  // v00.129 — startsAt 기준 분리. 어제 이후 = upcoming, 그 이전 = past. startsAt 없으면 upcoming.
  const _now = Date.now();
  const _yesterday = _now - 86400000;
  const _isPast = (l) => {
    if (!l?.startsAt) return false;
    const t = Date.parse(l.startsAt);
    return !isNaN(t) && t < _yesterday;
  };
  const lecturesUpcoming = React.useMemo(() => allLectures.filter((l) => !_isPast(l)), [allLectures]);
  const lecturesPast = React.useMemo(() => allLectures.filter(_isPast).sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt)), [allLectures]);
  const lectures = bucket === 'past' ? lecturesPast : lecturesUpcoming;

  // 외부 진입 — sessionStorage / 해시
  // v00.263.000 — past 로 진입하면 게시판 상세 모드로 즉시 표시.
  React.useEffect(() => {
    let pending = null;
    try { pending = sessionStorage.getItem('bgnj_pending_lecture_id'); } catch {}
    if (pending) {
      try { sessionStorage.removeItem('bgnj_pending_lecture_id'); } catch {}
      // 양쪽 버킷에서 검색해 적절한 탭으로 이동.
      const inUpcoming = lecturesUpcoming.findIndex((l) => String(l.id) === String(pending));
      if (inUpcoming >= 0) { setBucket('upcoming'); setSelectedIdx(inUpcoming); return; }
      const inPast = lecturesPast.findIndex((l) => String(l.id) === String(pending));
      if (inPast >= 0) { setBucket('past'); setSelectedIdx(inPast); setPastDetailId(String(pending)); }
    }
  }, []);

  // 버킷 전환 시 인덱스 리셋 + past 상세 해제.
  React.useEffect(() => { setSelectedIdx(0); setPastDetailId(null); }, [bucket]);

  // v00.129 — 강연이 하나도 없는 경우(예정+지난 0) 만 빈 화면. 한 쪽이라도 있으면 탭은 보여줌.
  if (allLectures.length === 0) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:560, textAlign:'center', padding:'80px 20px'}}>
          <p className="dim" style={{fontSize:14, marginBottom: isAdmin ? 18 : 0}}>등록된 강연이 없습니다.</p>
          {isAdmin && (
            <button type="button" className="btn btn-gold btn-small" onClick={() => setAddOpen(true)}>
              ＋ 강연 추가
            </button>
          )}
        </div>
        {addOpen && isAdmin && <LectureQuickAddModal onClose={() => setAddOpen(false)} onSaved={refresh}/>}
      </div>
    );
  }

  const safeIdx = Math.max(0, Math.min(selectedIdx, Math.max(0, lectures.length - 1)));
  const lecture = lectures[safeIdx];
  // v00.159/v00.238 — bucket 의 강연 0건 가드. 이전엔 빈 분기에서 early return 해서 버킷 토글까지
  // 사라져 사용자가 다른 버킷으로 못 갔음 (사용자 보고: '지난강연은 위가 유지되고 넘어가야 왔다갔다하지').
  // 이제는 main return 흐름 유지하되 본문만 빈 카드로 대체.
  const seats = G.call(() => window.BGNJ_LECTURES?.getSeats?.(lecture.id), { capacity: 0, taken: 0, waitlist: 0, remaining: 0 });
  const myReg = user ? G.call(() => window.BGNJ_LECTURES?.hasUserRegistered?.(lecture.id, user.id), null) : null;

  const formatPrice = (p) => window.BGNJ_FMT.priceOrFree(p);
  const labelStatus = (s) => ({
    pending_payment: '입금 대기',
    confirmed: '참가 확정',
    waitlist: '대기자',
    refund_requested: '환불 신청 중',
    cancelled: '취소됨',
  }[s] || s);
  const tone = (s) => ({
    // v00.230 — confirmed = secondary (Caramel) 로 흰 배경 가독성 확보.
    confirmed: 'var(--secondary)',
    waitlist: 'var(--ink-2)',
    cancelled: 'var(--danger)',
    pending_payment: 'var(--ink-2)',
    refund_requested: 'var(--warning)',
  }[s] || 'var(--ink-2)');

  // v00.073 — site_content_kv.lectureIntro 에서 hero 읽기 (투어 패턴 동일).
  const _lscI = (window.BGNJ_SITE_CONTENT?.get?.() || {}).lectureIntro || {};
  const _lEyebrow  = _lscI.eyebrow     || 'LECTURE · 왕사남 강연';
  const _lPrefix   = _lscI.titlePrefix ?? '왕사남 ';
  const _lAccent   = _lscI.titleAccent ?? '강연 일정';
  const _lSubtitle = _lscI.subtitle    || '공개 / 심화 / 현장 강연. 회원 전용 신청 · 무통장 입금 결제.';

  return (
    <div className="section">
      <div className="container">
        <div style={{marginBottom:48}}>
          <div className="section-eyebrow">{_lEyebrow}</div>
          <h1 className="section-title">{_lPrefix}<span className="accent">{_lAccent}</span></h1>
          <p className="section-subtitle">{_lSubtitle}</p>
        </div>

        {/* v00.129 — 지난/예정 버킷 토글. 사용자 요청 분리.
            v00.228 — admin 인 경우 + 강연 추가 버튼 우측 정렬로 노출. */}
        <div style={{display:'flex', gap:8, marginBottom:24, flexWrap:'wrap', alignItems:'center'}}>
          {[
            { k: 'upcoming', label: `진행 예정 강연 (${lecturesUpcoming.length})` },
            { k: 'past', label: `지난 강연 (${lecturesPast.length})` },
          ].map((b) => (
            <button key={b.k} type="button"
              onClick={() => setBucket(b.k)}
              aria-pressed={bucket === b.k}
              style={{
                padding:'8px 18px', borderRadius:999, fontSize:13, cursor:'pointer',
                border: '1px solid ' + (bucket === b.k ? 'var(--primary)' : 'var(--line)'),
                // v00.230 — 본문 텍스트는 secondary 로 (옐로우 on 옅은옐로우 = 대비 부족).
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
              ＋ 강연 추가
            </button>
          )}
        </div>

        {/* v00.263.001 — past 모드의 빈 카드는 PastBoardList 가 처리. 외부 빈 카드는 upcoming 만. */}
        {bucket === 'upcoming' && lectures.length === 0 && (
          <div style={{padding:'60px 20px', textAlign:'center'}}>
            <p className="dim" style={{fontSize:14}}>예정된 강연이 없습니다.</p>
          </div>
        )}

        {/* v00.263.000/001 — past 버킷 + 상세 미선택 = 게시판 행 목록 모드.
            v00.263.001: lectures.length 조건 제거 — 0건이라도 PastBoardList 가 빈 안내를 표시.
            PastBoardList 미정의 시 fallback: 안내 카드 표시. */}
        {bucket === 'past' && !pastDetailId && (
          PastBoardList ? (
            <window.PastBoardList items={lectures} type="lecture"
              onSelect={(id) => {
                const idx = lectures.findIndex((l) => String(l.id) === String(id));
                if (idx >= 0) setSelectedIdx(idx);
                setPastDetailId(String(id));
                try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
              }}/>
          ) : (
            <div style={{padding:'60px 20px', textAlign:'center'}}>
              <p className="dim" style={{fontSize:14}}>지난 강연 목록을 불러오는 중…</p>
            </div>
          )
        )}

        {/* Tabs — 투어 페이지와 동일한 스타일. 강연 목록이 있을 때만.
            v00.263.000 — past 버킷은 상세 모드일 때만 노출 (목록 모드는 위 PastBoardList 가 처리). */}
        {lectures.length > 0 && (bucket !== 'past' || pastDetailId) && (<>
        {bucket === 'past' && pastDetailId && (
          <div style={{marginBottom:16}}>
            <button type="button" className="btn btn-small"
              onClick={() => setPastDetailId(null)}>
              ← 지난 강연 목록으로
            </button>
          </div>
        )}
        <div style={{display:'flex', gap:0, borderBottom:'1px solid var(--line-2)', marginBottom:40, overflowX:'auto'}}>
          {lectures.map((l, i) => (
            <button key={l.id}
              onClick={() => setSelectedIdx(i)}
              style={{
                padding:'20px 28px',
                fontSize:13,
                whiteSpace:'nowrap',
                fontFamily:'var(--font-serif)',
                // v00.230 — 탭 활성 라벨은 본문 텍스트라 secondary. 하단 indicator 는 옐로우 유지(브랜드).
                color: safeIdx === i ? 'var(--secondary)' : 'var(--ink-2)',
                background: 'transparent', border: 'none',
                borderBottom: safeIdx === i ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom:-1, cursor:'pointer',
              }}>
              0{i+1} · {String(l.title || '').split(' — ')[0]}
            </button>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:60}} className="tour-grid">
          <div>
            {(() => {
              // v00.235 — 우선순위: 갤러리 대표사진 > legacy coverDataUri > placeholder.
              const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
              const lp = sc.lecturePages?.[lecture.id] || {};
              const galleryPrimary = pickPrimaryImage?.(lp.images);
              const coverUri = galleryPrimary?.url || lp.coverDataUri || '';
              if (coverUri) {
                return (
                  <div style={{marginBottom:32}}>
                    {/* v00.239 — 사용자: '포스터는 비율에 구애받지않고 횡축 좌우 여백없이 상하공간 적절히 확대'.
                        width:100% + height:auto 로 컬럼 폭 가득 채우고 자연 비율 유지. flex/contain/maxHeight 제거. */}
                    <img src={coverUri} alt={lecture.title || '강연 포스터'}
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
                  {CoverPlaceholder
                    ? <window.CoverPlaceholder aspectRatio="16/10" label={String(lecture.title || '').toUpperCase()}/>
                    : <div className="placeholder" style={{aspectRatio:'16/10', fontSize:11}}>{String(lecture.title || '').toUpperCase()}</div>}
                </div>
              );
            })()}
            {/* v00.239 — KMS §2 정합 재정리. 시스템 색(info/danger)은 상태 표시 전용이라
                카테고리 chip 에서 제거. Primary/Secondary/Tertiary/Neutral 4단계 톤만 사용.
                · 강연 제목 = primary 옐로우 (브랜드 시그너처) · 결제 = neutral
                · 주최/주관 = secondary caramel · 장소 = tertiary slate
                v00.239 — 주관(organizer) 필드 추가. site_content_kv.lecturePages[id].organizer. */}
            {(() => {
              const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
              const lp = sc.lecturePages?.[lecture.id] || {};
              const organizer = lp.organizer || '';
              const chipBase = { fontSize:10, letterSpacing:'0.18em', padding:'2px 8px', borderRadius:3 };
              return (
                <div style={{display:'flex', gap:8, marginBottom:20, flexWrap:'wrap', alignItems:'center'}}>
                  <span className="mono" style={{...chipBase, color:'var(--secondary)', background:'rgba(245,213,72,0.12)', border:'1px solid var(--primary-dim)'}}>
                    ◆ {lecture.title}
                  </span>
                  {lecture.price === 0
                    ? <span className="mono" style={{...chipBase, color:'var(--secondary)', background:'rgba(245,213,72,0.12)', border:'1px solid var(--primary)'}}>FREE</span>
                    : <span className="mono" style={{...chipBase, color:'var(--ink-2)', background:'var(--bg-2)', border:'1px solid var(--line-2)'}}>₩ 무통장 입금</span>}
                  {lecture.host && (
                    <span className="mono" style={{...chipBase, color:'var(--secondary)', background:'rgba(146,64,14,0.06)', border:'1px solid var(--secondary)'}}>
                      주최 · {lecture.host}
                    </span>
                  )}
                  {organizer && (
                    <span className="mono" style={{...chipBase, color:'var(--secondary-hover)', background:'rgba(124,45,18,0.06)', border:'1px solid var(--secondary-hover)'}}>
                      주관 · {organizer}
                    </span>
                  )}
                  {lecture.venue && (
                    <span className="mono" style={{...chipBase, color:'var(--tertiary)', background:'rgba(71,85,105,0.06)', border:'1px solid var(--tertiary)'}}>
                      장소 · {lecture.venue}
                    </span>
                  )}
              {/* v00.236 — hidden 강연은 admin 만 보이고 시각 라벨로 구분. */}
              {lecture.hidden && (
                <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--warning)', border:'1px solid var(--warning)', padding:'1px 6px'}}>
                  ◆ 숨김 (관리자에게만 보임)
                </span>
              )}
              {/* v00.234 — admin 전용 프론트 수정 진입로. */}
              {isAdmin && (
                <button type="button" className="btn btn-small"
                  style={{marginLeft:'auto', fontSize:11, padding:'4px 10px'}}
                  onClick={() => setEditTarget(lecture)}>
                  ✎ 강연 수정
                </button>
              )}
                </div>
              );
            })()}
            {/* v00.239 — 사용자 요청: 강연 제목·주제 줄바꿈 허용. white-space:pre-wrap 으로 \n 보존. */}
            <h2 className="ko-serif" style={{fontSize:40, fontWeight:500, lineHeight:1.2, marginBottom:24, whiteSpace:'pre-wrap'}}>{lecture.topic}</h2>
            <p className="dim" style={{fontSize:16, lineHeight:1.9, marginBottom:32, whiteSpace:'pre-wrap'}}>{lecture.note}</p>
            {/* v00.235/v00.237 — 포스터 추가 그리드 (대표 외 나머지). 1장이면 cover 와 중복이라 미노출. */}
            {MediaGalleryView && (() => {
              const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
              const imgs = sc.lecturePages?.[lecture.id]?.images;
              return <window.MediaGalleryView images={imgs} title={lecture.title} sectionLabel="포스터"/>;
            })()}
            {/* v00.237 — 종료된 강연(past)에만 현장 사진 그리드 노출. 사용자 요청. */}
            {MediaGalleryView && _isPast(lecture) && (() => {
              const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
              const photos = sc.lecturePages?.[lecture.id]?.photos;
              return <window.MediaGalleryView images={photos} title={lecture.title} sectionLabel="현장 사진" withCover={false}/>;
            })()}

            {(() => {
              // v00.075 — per-lecture override(lecturePages[id]) 우선, 없으면 글로벌(lectureSchedule/lectureNotes) fallback.
              const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
              const perLec = (sc.lecturePages && typeof sc.lecturePages === 'object' && lecture?.id) ? (sc.lecturePages[lecture.id] || null) : null;
              const ovrSchedule = Array.isArray(perLec?.schedule) ? perLec.schedule : null;
              const ovrNotes    = Array.isArray(perLec?.notes)    ? perLec.notes    : null;
              const schedule = (ovrSchedule && ovrSchedule.length > 0)
                ? ovrSchedule.filter((s) => s && (s.t || s.l))
                : (Array.isArray(sc.lectureSchedule) ? sc.lectureSchedule.filter((s) => s && (s.t || s.l)) : []);
              const notes = (ovrNotes && ovrNotes.length > 0)
                ? ovrNotes.filter(Boolean)
                : (Array.isArray(sc.lectureNotes) ? sc.lectureNotes.filter(Boolean) : []);
              return (
                <>
                  {schedule.length > 0 && (
                    <>
                      <h3 className="ko-serif" style={{fontSize:20, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
                        강연 진행
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
                  {notes.length > 0 && (
                    <>
                      <h3 className="ko-serif" style={{fontSize:20, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
                        참고
                      </h3>
                      <ul style={{paddingLeft:20, color:'var(--ink-2)', lineHeight:2, fontSize:14, marginBottom:48}}>
                        {notes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </>
                  )}
                </>
              );
            })()}

            <LectureReviewsSection lecture={lecture} user={user} go={go} onRefresh={refresh}/>
          </div>

          {/* Sidebar — booking */}
          <div>
            <LectureBookingPanel
              lecture={lecture}
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
      {/* v00.228 — admin 전용 강연 quick-add 모달. 저장 시 refresh() 로 페이지 재렌더. */}
      {addOpen && isAdmin && <LectureQuickAddModal onClose={() => setAddOpen(false)} onSaved={refresh}/>}
      {/* v00.234 — admin 전용 강연 수정 모달 (같은 컴포넌트 / initialLecture prop). */}
      {editTarget && isAdmin && <LectureQuickAddModal onClose={() => setEditTarget(null)} onSaved={refresh} initialLecture={editTarget}/>}
    </div>
  );
};

// v00.228 — admin 전용 프론트 강연 quick-add. 사용자 요청: 관리자가 프론트 페이지에서도
// 강연 프로그램을 추가할 수 있어야 함. AuthAdminPage 의 addNewLecture 에 들어가는 같은 필드
// 세트 + saveLecture 호출 (worker handleLectureCreate). 상세 편집은 admin 패널에서 후속.
// v00.234 — initialLecture prop 으로 edit 모드 확장. id 있으면 update, 없으면 create.
const LectureQuickAddModal = ({ onClose, onSaved, initialLecture = null }) => {
  const isEdit = !!initialLecture?.id;
  // 기본값: +1주 19:00 (admin 패널의 addNewLecture 와 동일).
  const _defaultStartLocal = (() => {
    const d = new Date(Date.now() + 7 * 86400000);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T19:00`;
  })();
  // edit 모드: ISO startsAt → datetime-local "YYYY-MM-DDTHH:mm".
  const _toLocalInput = (iso) => {
    if (!iso) return _defaultStartLocal;
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return _defaultStartLocal;
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch { return _defaultStartLocal; }
  };
  const [title, setTitle] = React.useState(initialLecture?.title || '');
  const [topic, setTopic] = React.useState(initialLecture?.topic || '');
  const [venue, setVenue] = React.useState(initialLecture?.venue || '');
  const [host, setHost] = React.useState(initialLecture?.host || '뱅기노자');
  // v00.239 — 주관(organizer) 신규. site_content_kv.lecturePages[id].organizer (워커 deploy 회피).
  const [organizer, setOrganizer] = React.useState(() => {
    if (!initialLecture?.id) return '';
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      return sc.lecturePages?.[initialLecture.id]?.organizer || '';
    } catch { return ''; }
  });
  const [startsAt, setStartsAt] = React.useState(_toLocalInput(initialLecture?.startsAt));
  const [durationMinutes, setDurationMinutes] = React.useState(initialLecture?.durationMinutes || 90);
  const [capacity, setCapacity] = React.useState(initialLecture?.capacity || 30);
  const [price, setPrice] = React.useState(initialLecture?.price || 0);
  const [note, setNote] = React.useState(initialLecture?.note || '');
  // v00.235 — 사진 갤러리 (최대 10장 + 출처 + 대표). edit 모드면 site_content_kv 에서 prefill.
  // v00.236 — 사용자 요청 '강연은 대부분 포스터가 있으니까 포스터 꼭 등록할 수 있게해줘야해' → 최소 1장 필수.
  const [images, setImages] = React.useState(() => {
    if (!initialLecture?.id) return [];
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const arr = sc.lecturePages?.[initialLecture.id]?.images;
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  });
  // v00.237 — 종료된 강연용 현장 사진 별도 갤러리 (사용자 요청). 항상 입력 가능하지만
  // 표시 페이지에선 past 강연일 때만 노출. site_content_kv.lecturePages[id].photos.
  const [photos, setPhotos] = React.useState(() => {
    if (!initialLecture?.id) return [];
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const arr = sc.lecturePages?.[initialLecture.id]?.photos;
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  });
  // v00.236 — 숨김 토글 (편집/추가 둘 다). admin 이 임시저장 후 작업할 때 사용.
  const [hidden, setHidden] = React.useState(!!initialLecture?.hidden);
  const [error, setError] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const dirty = !!(title.trim() || topic.trim() || venue.trim() || note.trim() || images.length > 0);
  const guard = window.useModalGuard?.({ open: true, dirty, onClose, onSaveDraft: null, label: isEdit ? '강연 수정' : '강연 추가' }) || {};

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('강연 제목은 필수입니다.'); return; }
    if (!startsAt) { setError('일시를 입력해 주세요.'); return; }
    // v00.236/v00.237 — 사용자 요청: 포스터(대표 사진) 필수. 신규 add 만 강제 (기존 강연 편집 시
    // 포스터 미등록 데이터도 다른 항목 수정 가능해야 함). edit 모드는 갤러리 안내문으로 권장만.
    if (!isEdit && (!images || images.length === 0)) {
      setError('새 강연 등록 시 포스터(대표 사진)는 최소 1장 필수입니다. 아래 "강연 포스터" 에서 추가해 주세요.');
      return;
    }
    setSaving(true);
    try {
      const dt = new Date(startsAt);
      if (isNaN(dt.getTime())) throw new Error('일시 형식이 올바르지 않습니다.');
      const pad = (n) => String(n).padStart(2, '0');
      const next = `${dt.getFullYear()}.${pad(dt.getMonth()+1)}.${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
      // edit: 기존 id 유지 / add: 새 id 생성. saveLecture 가 id 존재 + getLecture 매치 시 update path 분기.
      const id = isEdit ? initialLecture.id : `lecture-${Date.now()}`;
      await window.BGNJ_LECTURES.saveLecture({
        id,
        title: title.trim(),
        topic: topic.trim() || title.trim(),
        venue: venue.trim(),
        host: host.trim() || '뱅기노자',
        next,
        startsAt: dt.toISOString(),
        durationMinutes: Math.max(1, Number(durationMinutes) || 90),
        capacity: Math.max(1, Number(capacity) || 30),
        price: Math.max(0, Number(price) || 0),
        note: note.trim(),
        hidden: !!hidden, // v00.236 — 숨김 토글 반영.
      });
      // v00.235/v00.237/v00.239 — 갤러리 + 주관 저장 (site_content_kv.lecturePages[id]).
      // images=포스터 / photos=현장 사진 / organizer=주관. 기존 schedule/notes/coverDataUri 보존을 위해 머지.
      if (images.length > 0 || photos.length > 0 || organizer || isEdit) {
        try {
          const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
          const existing = (sc.lecturePages && typeof sc.lecturePages === 'object' && sc.lecturePages[id]) || {};
          await window.BGNJ_SITE_CONTENT.saveSection('lecturePages', {
            [id]: { ...existing, images, photos, organizer: organizer.trim() },
          });
          try { window.BGNJ_BROADCAST?.publish?.('site-content'); } catch {}
        } catch (galleryErr) {
          try { console.warn('[LectureQuickAddModal] 갤러리/주관 저장 실패:', galleryErr); } catch {}
          window.BGNJ_TOAST?.error?.('강연 정보는 저장됐지만 갤러리·주관 저장에 실패했습니다.');
        }
      }
      try { await window.BGNJ_AUDIT?.log?.({ action: isEdit ? 'lecture.update' : 'lecture.create', target: `lecture:${id}` }); } catch {}
      try { window.BGNJ_BROADCAST?.publish?.('lectures'); } catch {}
      window.BGNJ_TOAST?.success?.(isEdit ? '강연이 수정되었습니다.' : '강연이 등록되었습니다.');
      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(err?.body?.error || err?.message || (isEdit ? '강연 수정 실패' : '강연 생성 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={isEdit ? '강연 수정' : '강연 추가'}
      onClick={guard.onBackdropClick}
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'grid', placeItems:'start center', padding:24, overflowY:'auto'}}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width:'min(560px, 100%)', background:'var(--bg)', boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
        padding:24, marginTop:24, marginBottom:48,
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14}}>
          <h2 className="ko-serif" style={{fontSize:18, margin:0}}>{isEdit ? '강연 수정' : '새 강연 추가'}</h2>
          <button type="button" className="btn btn-small" onClick={onClose}>닫기</button>
        </div>
        <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:18}}>
          {isEdit
            ? '기본 정보를 수정합니다. 진행 일정·참고·커버 이미지 등 상세는 관리자 패널에서 편집하세요.'
            : '기본 정보만 입력해 빠르게 등록합니다. 진행 일정·참고·커버 이미지 등 상세 편집은 관리자 패널에서 이어서 진행하세요.'}
        </p>
        <form onSubmit={submit} style={{display:'grid', gap:12}}>
          {/* v00.239 — 제목/주제 textarea 로 변경 (줄바꿈 허용). 사용자 요청. */}
          <div className="field" style={{margin:0}}>
            <label className="field-label">강연 제목 * (줄바꿈 가능)</label>
            <textarea className="field-input" rows={2} value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2026 여름 특강 — 영조와 사도세자&#10;(Enter 로 줄바꿈)" autoFocus/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label">주제 (선택 — 비우면 제목 사용 / 줄바꿈 가능)</label>
            <textarea className="field-input" rows={2} value={topic} onChange={(e) => setTopic(e.target.value)}
              placeholder="강연 본문 페이지의 큰 제목"/>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label">장소</label>
              <input className="field-input" value={venue} onChange={(e) => setVenue(e.target.value)}
                placeholder="예: 종로구 안국동 …"/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">주최 (진행)</label>
              <input className="field-input" value={host} onChange={(e) => setHost(e.target.value)}
                placeholder="예: 뱅기노자 / (사)한국여성건축가협회 …"/>
            </div>
          </div>
          {/* v00.239 — 주관 신규. */}
          <div className="field" style={{margin:0}}>
            <label className="field-label">주관 (선택)</label>
            <input className="field-input" value={organizer} onChange={(e) => setOrganizer(e.target.value)}
              placeholder="예: ㈜승보이엔씨건축사사무소 (운영 실무 담당 기관)"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label">일시 *</label>
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
            <label className="field-label">안내 (선택)</label>
            <textarea className="field-input" rows={3}
              value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="강연 안내·당부 사항 (이후 관리자 패널에서 보강 가능)"/>
          </div>
          {/* v00.235 — 포스터 갤러리 (최대 10장). v00.236 — 최소 1장 필수.
              v00.237 — 다중 업로드 + drag&drop + label 커스터마이즈. */}
          {MediaGalleryEditor && (
            <window.MediaGalleryEditor
              value={images} onChange={setImages}
              folder="lecture-poster"
              label="강연 포스터 (필수, 최대 10장)"
              helpText="대표 포스터는 강연 카드와 상단 cover 로 사용됩니다. 최소 1장 등록 필수. 클릭하거나 사진을 끌어 놓으면 한 번에 여러 장 업로드 가능합니다."/>
          )}
          {/* v00.237 — 현장 사진 갤러리 (사용자 요청: 종료된 강연에는 현장 사진을 추가). 등록 시점부터
              입력 가능하지만 표시 페이지에선 past(종료) 강연에만 노출. */}
          {MediaGalleryEditor && (
            <window.MediaGalleryEditor
              value={photos} onChange={setPhotos}
              folder="lecture-photos"
              label="현장 사진 (선택, 종료된 강연에 노출)"
              showPrimary={false}
              helpText="강연이 끝난 뒤 등록하는 현장 스케치. 강연 일시가 지난 시점부터 강연 페이지 하단에 그리드로 노출됩니다."/>
          )}
          {/* v00.236 — 숨김 토글. 임시저장하고 admin 만 보이게 할 때. */}
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
              {saving ? '저장 중...' : (isEdit ? '강연 저장' : '강연 등록')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LectureBookingPanel = ({ lecture, user, bank, myReg, seats, labelStatus, tone, formatPrice, onRefresh, go }) => {
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
  // v00.232 — 사용자 요청: 강연 신청 시 개인정보 활용 + 제3자 제공 동의 필수.
  const [agreed, setAgreed] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false); // v00.278 — 중복 신청 방지

  React.useEffect(() => {
    setOpen(false); setSubmitted(null); setError(""); setCount(1); setNote("");
    setName(user?.name || ""); setEmail(user?.email || "");
    setRefundMode(false); setRefundReason(""); setRefundError("");
    setAgreed(false);
  }, [lecture.id, user?.id]);

  const requireLogin = async (label) => {
    if ((await window.BGNJ_CONFIRM(`${label}은(는) 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?`, { danger: true }))) {
      go("login");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) return requireLogin('강연 신청');
    if (!name.trim() || !email.trim()) { setError("이름과 이메일은 필수입니다."); return; }
    if (!agreed) { setError("개인정보 활용 및 제3자 제공 동의는 필수입니다."); return; }
    if (submitting) return; // 중복 신청 방지
    setSubmitting(true);
    try {
      // v00.218 — 현금영수증 신청 정보 note prefix 인코딩
      const crPrefix = window.BGNJ_CashReceipt?.encode?.(cashReceipt) || '';
      const noteCombined = (crPrefix + (note.trim() || '')).trim();
      const result = await window.BGNJ_LECTURES.register(lecture.id, {
        userId: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        count: Math.max(1, Number(count) || 1),
        note: noteCombined,
      });
      if (!result?.ok) { setError(result?.message || "신청 처리에 실패했습니다."); return; }
      setSubmitted(result.registration);
      onRefresh();
      setOpen(false);
    } catch (err) {
      setError(err?.body?.error || err?.message || '신청 처리 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelMyReg = async () => {
    if (!myReg) return;
    if (!(await window.BGNJ_CONFIRM("이 강연 신청을 취소하시겠어요?", { danger: true }))) return;
    try {
      await window.BGNJ_LECTURES.cancelRegistration(lecture.id, myReg.id);
      onRefresh(); setSubmitted(null);
    } catch (err) {
      window.BGNJ_TOAST.error('취소 실패: ' + (err?.body?.error || err?.message || '알 수 없는 오류'));
    }
  };

  const submitRefund = async () => {
    setRefundError("");
    if (!refundReason.trim()) { setRefundError("환불 사유를 입력해 주세요."); return; }
    try {
      const result = await window.BGNJ_LECTURES.requestRefund(lecture.id, myReg.id, refundReason);
      if (!result?.ok) { setRefundError(result?.message || '환불 신청 실패'); return; }
      setRefundMode(false); setRefundReason("");
      onRefresh();
    } catch (err) {
      setRefundError(err?.body?.error || err?.message || '환불 신청 중 오류');
    }
  };

  const downloadIcs = () => window.BGNJ_LECTURES.downloadIcs(lecture.id);
  const showPaymentInfo = (lecture.price || 0) > 0 && (myReg?.status === 'pending_payment' || submitted?.status === 'pending_payment');
  const isFull = seats.remaining <= 0;
  const isPaidConfirmed = myReg?.status === 'confirmed' && (lecture.price || 0) > 0;

  return (
    <div className="card card-gold mobile-release-sticky" style={{position:'sticky', top:100}}>
      <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.3em'}}>NEXT SCHEDULE</div>
      <div className="gold-2 ko-serif" style={{fontSize:24, margin:'8px 0 20px'}}>{lecture.next}</div>

      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)'}}>
        <span className="dim">참가비</span>
        <span className="gold-2 ko-serif" style={{fontSize:22}}>{formatPrice(lecture.price)}</span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)'}}>
        <span className="dim">소요</span>
        <span>{lecture.durationMinutes ? `${Math.round(lecture.durationMinutes/60*10)/10}시간` : '-'}</span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)'}}>
        <span className="dim">정원</span>
        <span>{lecture.capacity}명</span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)'}}>
        <span className="dim">잔여</span>
        <span style={{ color: isFull ? 'var(--danger)' : 'var(--secondary)' }}>
          {isFull ? `대기 ${seats.waitlist}명` : `${seats.remaining}석`}
        </span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)', marginBottom:18}}>
        <span className="dim">진행</span>
        <span className="gold">{lecture.host}</span>
      </div>

      {myReg && (
        <div style={{padding:14, background:'rgba(245,213,72,0.06)', border:'1px solid var(--primary-dim)', marginBottom:16}}>
          <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:6}}>MY REGISTRATION</div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:8}}>
            <span className="ko-serif" style={{fontSize:16}}>{labelStatus(myReg.status)}</span>
            <span className="mono" style={{fontSize:11, letterSpacing:'0.2em', color: tone(myReg.status)}}>
              {myReg.count}명 · {formatPrice((lecture.price || 0) * (myReg.count || 1))}
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
              {formatPrice((lecture.price || 0) * (myReg?.count || submitted?.count || 1))}
            </span>
          </div>
        </div>
      )}

      {!myReg && !submitted && (
        <>
          {!open ? (
            <>
              <button type="button" className="btn btn-gold btn-block" style={{marginBottom:10}}
                onClick={() => { if (!user) { requireLogin('강연 신청'); return; } setOpen(true); setError(""); }}>
                {isFull ? '대기자 등록' : '강연 신청'}
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
                    <input type="number" min={1} max={Math.max(1, lecture.capacity)} className="field-input"
                      value={count} onChange={(e) => setCount(e.target.value)}/>
                  </div>
                </div>
                <div className="field" style={{margin:0}}>
                  <label className="field-label">메모</label>
                  <textarea className="field-input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="동행자 / 특이사항"/>
                </div>
                {/* v00.218 — 현금영수증 신청 */}
                {(lecture.price || 0) > 0 && window.BGNJ_CashReceiptField && (
                  <window.BGNJ_CashReceiptField value={cashReceipt} onChange={setCashReceipt}/>
                )}
              </div>
              {error && (
                <div role="alert" style={{padding:'8px 10px', background:'rgba(194,74,61,0.1)', border:'1px solid var(--danger)', color:'var(--danger)', fontSize:12, marginBottom:10}}>
                  {error}
                </div>
              )}
              <div className="dim mono" style={{fontSize:10, lineHeight:1.7, marginBottom:10, letterSpacing:'0.05em'}}>
                {(lecture.price || 0) === 0
                  ? '무료 강연이라 신청 즉시 참가 확정됩니다.'
                  : `합계 ${formatPrice((lecture.price || 0) * (Number(count) || 1))} · 신청 → 입금 → 운영자 확인 → 참가 확정`}
                {isFull && ' · 정원이 차서 자동 대기자 등록됩니다.'}
              </div>
              {/* v00.232 — 개인정보 활용 + 제3자 제공 동의 (필수). */}
              <label style={{display:'flex', gap:8, alignItems:'flex-start', padding:'10px 12px', background:'var(--bg-2)', border:'1px solid var(--line)', borderRadius:6, marginBottom:10, cursor:'pointer'}}>
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                  style={{marginTop:3, accentColor:'var(--primary)'}}/>
                <span style={{fontSize:12, lineHeight:1.6, color:'var(--ink-2)'}}>
                  <strong style={{color:'var(--secondary)'}}>[필수]</strong> 강연 신청 처리(이름·이메일·연락처) 와 운영자 안내 발송을 위해 개인정보 활용 및 운영 제휴사로의 제3자 제공에 동의합니다. {' '}
                  <button type="button" onClick={() => go('privacy')}
                    style={{background:'none', border:'none', padding:0, color:'var(--secondary)', textDecoration:'underline', cursor:'pointer', fontSize:'inherit'}}>
                    자세히 보기
                  </button>
                </span>
              </label>
              <div style={{display:'flex', gap:6, justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-small" onClick={() => setOpen(false)}>취소</button>
                <button type="submit" className="btn btn-gold btn-small" disabled={!agreed || submitting}>{submitting ? '접수 중…' : '신청 접수'}</button>
              </div>
            </form>
          )}
        </>
      )}

      {!user && (
        <p className="dim-2" style={{fontSize:11, lineHeight:1.7, marginTop:14, textAlign:'center'}}>
          강연 신청은 회원가입한 분만 가능합니다.
        </p>
      )}
    </div>
  );
};

// === 강연 후기 섹션 (투어 후기와 같은 패턴) ===============================
const LectureReviewsSection = ({ lecture, user, go, onRefresh }) => {
  const reviews = window.BGNJ_LECTURES.listReviews(lecture.id);
  const canReview = user ? window.BGNJ_LECTURES.canReview(lecture.id, user.id) : false;
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState("");
  // v00.075 — site_content_kv.lectureReviewsGate 에서 게이팅/익명/empty 안내 읽기.
  const gateContent = (() => {
    const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
    const g = (sc.lectureReviewsGate && typeof sc.lectureReviewsGate === 'object') ? sc.lectureReviewsGate : {};
    return {
      gate: g.gate || '후기는 참가 확정된 회원만 작성할 수 있습니다. 아직 신청 전이라면 사이드바에서 강연을 신청하고 운영자 입금 확인을 받은 뒤 다시 와 주세요.',
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
    if (!canReview) { setError("참가 확정된 분만 후기를 작성할 수 있습니다."); return; }
    if (!text.trim()) { setError("후기 내용을 입력해 주세요."); return; }
    window.BGNJ_LECTURES.addReview(lecture.id, {
      userId: user.id,
      author: user.name,
      rating,
      text: text.trim(),
    });
    setText(""); setRating(5);
    onRefresh?.();
  };

  const remove = async (id) => {
    if (!(await window.BGNJ_CONFIRM("이 후기를 삭제하시겠어요?", { danger: true }))) return;
    window.BGNJ_LECTURES.deleteReview(lecture.id, id);
    onRefresh?.();
  };

  const avgRating = reviews.length === 0 ? 0
    : (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length);
  const stars = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

  return (
    <section aria-labelledby="lecture-reviews">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:12, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
        <h3 id="lecture-reviews" className="ko-serif" style={{fontSize:20}}>
          참여 후기 <span className="dim-2 mono" style={{fontSize:12, marginLeft:6}}>{reviews.length}건</span>
        </h3>
        {reviews.length > 0 && (
          <span className="gold mono" style={{fontSize:12, letterSpacing:'0.16em'}}>
            평균 {avgRating.toFixed(1)} {stars(avgRating)}
          </span>
        )}
      </div>

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
              placeholder="강연이 어땠는지 짧게 남겨 주세요." style={{marginBottom:10}}/>
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

Object.assign(window, { LectureQuickAddModal });

// v00.287 ESM (main) — 라우터용 export (window 병행).
export { LecturesPage };

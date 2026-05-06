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
                <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', color:'var(--primary)', marginBottom:8}}>
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
  const tours = React.useMemo(() => G.arr(() => window.BGNJ_TOURS?.listAll?.()), [tick]);
  const bank = React.useMemo(() => G.call(() => window.BGNJ_LECTURES?.getBankAccount?.() || window.BGNJ_STORES?.bankAccount, {}), [tick]);
  const refresh = () => setTick((v) => v + 1);

  const [selectedIdx, setSelectedIdx] = React.useState(0);

  // 외부 진입(해시 / 마이페이지 알림 등)으로 들어온 투어 ID 처리
  React.useEffect(() => {
    let pending = null;
    try { pending = sessionStorage.getItem('bgnj_pending_tour_id'); } catch {}
    if (pending) {
      try { sessionStorage.removeItem('bgnj_pending_tour_id'); } catch {}
      const idx = tours.findIndex((t) => String(t.id) === String(pending));
      if (idx >= 0) setSelectedIdx(idx);
    }
  }, []);

  if (!tours.length) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:560, textAlign:'center', padding:'80px 20px'}}>
          <p className="dim">예정된 답사 프로그램이 없습니다.</p>
        </div>
      </div>
    );
  }

  const safeIdx = Math.max(0, Math.min(selectedIdx, tours.length - 1));
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
    confirmed: 'var(--primary)',
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

        {/* Tabs */}
        <div style={{display:'flex', gap:0, borderBottom:'1px solid var(--line-2)', marginBottom:40, overflowX:'auto'}}>
          {tours.map((t, i) => (
            <button key={t.id}
              onClick={() => setSelectedIdx(i)}
              style={{
                padding:'20px 28px',
                fontSize:13,
                whiteSpace:'nowrap',
                fontFamily:'var(--font-serif)',
                color: safeIdx === i ? 'var(--primary)' : 'var(--ink-2)',
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
              const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
              const coverUri = tour.coverUrl || sc.tourPages?.[tour.id]?.coverDataUri || '';
              if (coverUri) {
                return (
                  <div style={{aspectRatio:'16/10', marginBottom:32, overflow:'hidden', borderRadius:2, background:'var(--bg-2)'}}>
                    <img src={coverUri} alt={tour.title || '투어 커버'}
                      style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
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
            <div style={{display:'flex', gap:8, marginBottom:20, flexWrap:'wrap'}}>
              <span className="badge badge-gold">{tour.level}</span>
              <span className="badge">{tour.duration}</span>
              <span className="badge">{tour.group}</span>
              <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)', border:'1px solid var(--line-2)', padding:'1px 6px'}}>무통장 입금</span>
            </div>
            {/* v00.106 — 제목 + 부제 + 설명 */}
            <h2 className="ko-serif" style={{fontSize:40, fontWeight:500, lineHeight:1.2, marginBottom: tour.subtitle ? 6 : 24}}>{tour.title}</h2>
            {tour.subtitle && (
              <p className="ko-serif gold-2" style={{fontSize:18, lineHeight:1.4, marginBottom:24, fontStyle:'italic'}}>
                {tour.subtitle}
              </p>
            )}
            <p className="dim bgnj-multiline" style={{fontSize:16, lineHeight:1.9, marginBottom:32}}>{tour.desc}</p>

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
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(null);
  const [refundMode, setRefundMode] = React.useState(false);
  const [refundReason, setRefundReason] = React.useState("");
  const [refundError, setRefundError] = React.useState("");

  // 투어가 바뀌면 폼 초기화
  React.useEffect(() => {
    setOpen(false); setSubmitted(null); setError(""); setCount(1); setNote("");
    setName(user?.name || ""); setEmail(user?.email || "");
    setRefundMode(false); setRefundReason(""); setRefundError("");
  }, [tour.id, user?.id]);

  const requireLogin = (label) => {
    if (confirm(`${label}은(는) 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?`)) {
      go("login");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) return requireLogin('답사 신청');
    if (!name.trim() || !email.trim()) { setError("이름과 이메일은 필수입니다."); return; }
    try {
      const result = await window.BGNJ_TOURS.reserve(tour.id, {
        userId: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        count: Math.max(1, Number(count) || 1),
        note: note.trim(),
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
    if (!confirm("이 답사 신청을 취소하시겠어요?")) return;
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
    <div className="card card-gold" style={{position:'sticky', top:100}}>
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
        <span style={{ color: isFull ? 'var(--danger)' : 'var(--primary)' }}>
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
              <div style={{display:'flex', gap:6, justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-small" onClick={() => setOpen(false)}>취소</button>
                <button type="submit" className="btn btn-gold btn-small">신청 접수</button>
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

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      if (confirm("후기 작성은 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?")) {
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

  const remove = (id) => {
    if (!confirm("이 후기를 삭제하시겠어요?")) return;
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

Object.assign(window, { WangsanamPage, TourPage, TourBookingPanel, TourReviewsSection });

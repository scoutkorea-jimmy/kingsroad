// 뱅기노자 강연 일정 — 투어 페이지와 같은 스타일(탭 + 스티키 사이드바)
const LecturesPage = ({ go, user }) => {
  const [tick, setTick] = React.useState(0);
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const refresh = () => setTick((v) => v + 1);

  const lectures = React.useMemo(() => window.WSD_LECTURES.listAll(), [tick]);
  const bank = React.useMemo(() => window.WSD_LECTURES.getBankAccount(), [tick]);

  // 외부 진입 — sessionStorage / 해시
  React.useEffect(() => {
    let pending = null;
    try { pending = sessionStorage.getItem('wsd_pending_lecture_id'); } catch {}
    if (pending) {
      try { sessionStorage.removeItem('wsd_pending_lecture_id'); } catch {}
      const idx = lectures.findIndex((l) => String(l.id) === String(pending));
      if (idx >= 0) setSelectedIdx(idx);
    }
  }, []);

  if (!lectures.length) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:560, textAlign:'center', padding:'80px 20px'}}>
          <p className="dim" style={{fontSize:14}}>예정된 강연이 없습니다.</p>
        </div>
      </div>
    );
  }

  const safeIdx = Math.min(selectedIdx, lectures.length - 1);
  const lecture = lectures[safeIdx];
  const seats = window.WSD_LECTURES.getSeats(lecture.id);
  const myReg = user ? window.WSD_LECTURES.hasUserRegistered(lecture.id, user.id) : null;

  const formatPrice = (p) => (p === 0 || p == null) ? "무료" : `${p.toLocaleString()}원`;
  const labelStatus = (s) => ({
    pending_payment: '입금 대기',
    confirmed: '참가 확정',
    waitlist: '대기자',
    refund_requested: '환불 신청 중',
    cancelled: '취소됨',
  }[s] || s);
  const tone = (s) => ({
    confirmed: 'var(--gold)',
    waitlist: 'var(--ink-2)',
    cancelled: 'var(--danger)',
    pending_payment: 'var(--ink-2)',
    refund_requested: '#e8a020',
  }[s] || 'var(--ink-2)');

  return (
    <div className="section">
      <div className="container">
        <div style={{marginBottom:48}}>
          <div className="section-eyebrow">LECTURE · 왕사남 강연</div>
          <h1 className="section-title">왕사남 <span className="accent">강연 일정</span></h1>
          <p className="section-subtitle">공개 / 심화 / 현장 강연. 회원 전용 신청 · 무통장 입금 결제.</p>
        </div>

        {/* Tabs — 투어 페이지와 동일한 스타일 */}
        <div style={{display:'flex', gap:0, borderBottom:'1px solid var(--line-2)', marginBottom:40, overflowX:'auto'}}>
          {lectures.map((l, i) => (
            <button key={l.id}
              onClick={() => setSelectedIdx(i)}
              style={{
                padding:'20px 28px',
                fontSize:13,
                whiteSpace:'nowrap',
                fontFamily:'var(--font-serif)',
                color: safeIdx === i ? 'var(--gold)' : 'var(--ink-2)',
                background: 'transparent', border: 'none',
                borderBottom: safeIdx === i ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom:-1, cursor:'pointer',
              }}>
              0{i+1} · {String(l.title || '').split(' — ')[0]}
            </button>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:60}} className="tour-grid">
          <div>
            <div className="placeholder" style={{aspectRatio:'16/10', marginBottom:32, fontSize:11}}>
              {String(lecture.title || '').toUpperCase()} · 1600×1000
            </div>
            <div style={{display:'flex', gap:8, marginBottom:20, flexWrap:'wrap'}}>
              <span className="badge badge-gold">{lecture.title}</span>
              {lecture.price === 0
                ? <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--gold)', border:'1px solid var(--gold-dim)', padding:'1px 6px'}}>FREE</span>
                : <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)', border:'1px solid var(--line-2)', padding:'1px 6px'}}>무통장 입금</span>}
              <span className="badge">{lecture.host}</span>
              <span className="badge">{lecture.venue}</span>
            </div>
            <h2 className="ko-serif" style={{fontSize:40, fontWeight:500, lineHeight:1.2, marginBottom:24}}>{lecture.topic}</h2>
            <p className="dim" style={{fontSize:16, lineHeight:1.9, marginBottom:32}}>{lecture.note}</p>

            <h3 className="ko-serif" style={{fontSize:20, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
              강연 진행
            </h3>
            <div style={{marginBottom:32}}>
              {[
                { t: "0h 00m", l: "입장 · 인사" },
                { t: "0h 10m", l: "주제 도입" },
                { t: "0h 30m", l: "본론 · 사료 함께 읽기" },
                { t: "1h 10m", l: "휴식 · 질의응답 준비" },
                { t: "1h 20m", l: "Q&A · 마무리" },
              ].map((s, i) => (
                <div key={i} style={{display:'grid', gridTemplateColumns:'100px 1fr', gap:24, padding:'14px 0', borderBottom:'1px dashed var(--line)'}}>
                  <div className="mono gold" style={{fontSize:12, letterSpacing:'0.1em'}}>{s.t}</div>
                  <div className="ko-serif" style={{fontSize:15}}>{s.l}</div>
                </div>
              ))}
            </div>

            <h3 className="ko-serif" style={{fontSize:20, marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--line)'}}>
              참고
            </h3>
            <ul style={{paddingLeft:20, color:'var(--ink-2)', lineHeight:2, fontSize:14, marginBottom:48}}>
              <li>회원 가입 후 신청 가능 — 비회원은 자동 차단</li>
              <li>유료 강연은 안내된 계좌로 입금 후 운영자 확인 → 참가 확정</li>
              <li>정원이 차면 자동 대기자 등록 → 자리가 나면 자동 승격</li>
              <li>취소는 마이페이지 또는 강연 사이드바에서 가능</li>
            </ul>

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
      </div>
    </div>
  );
};

const LectureBookingPanel = ({ lecture, user, bank, myReg, seats, labelStatus, tone, formatPrice, onRefresh, go }) => {
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

  React.useEffect(() => {
    setOpen(false); setSubmitted(null); setError(""); setCount(1); setNote("");
    setName(user?.name || ""); setEmail(user?.email || "");
    setRefundMode(false); setRefundReason(""); setRefundError("");
  }, [lecture.id, user?.id]);

  const requireLogin = (label) => {
    if (confirm(`${label}은(는) 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?`)) {
      go("login");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!user) return requireLogin('강연 신청');
    if (!name.trim() || !email.trim()) { setError("이름과 이메일은 필수입니다."); return; }
    if (lecture.price > 0 && !bank.accountNumber) {
      setError("운영자 계좌번호가 아직 등록되지 않았습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    const result = window.WSD_LECTURES.register(lecture.id, {
      userId: user.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      count: Math.max(1, Number(count) || 1),
      note: note.trim(),
    });
    if (!result.ok) { setError(result.message || "신청 처리에 실패했습니다."); return; }
    setSubmitted(result.registration);
    onRefresh();
    setOpen(false);
  };

  const cancelMyReg = () => {
    if (!myReg) return;
    if (!confirm("이 강연 신청을 취소하시겠어요?")) return;
    window.WSD_LECTURES.cancelRegistration(lecture.id, myReg.id);
    onRefresh();
    setSubmitted(null);
  };

  const submitRefund = () => {
    setRefundError("");
    if (!refundReason.trim()) { setRefundError("환불 사유를 입력해 주세요."); return; }
    const result = window.WSD_LECTURES.requestRefund(lecture.id, myReg.id, refundReason);
    if (!result.ok) { setRefundError(result.message); return; }
    setRefundMode(false); setRefundReason("");
    onRefresh();
  };

  const downloadIcs = () => window.WSD_LECTURES.downloadIcs(lecture.id);
  const showPaymentInfo = (lecture.price || 0) > 0 && (myReg?.status === 'pending_payment' || submitted?.status === 'pending_payment');
  const isFull = seats.remaining <= 0;
  const isPaidConfirmed = myReg?.status === 'confirmed' && (lecture.price || 0) > 0;

  return (
    <div className="card card-gold" style={{position:'sticky', top:100}}>
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
        <span style={{ color: isFull ? 'var(--danger)' : 'var(--gold)' }}>
          {isFull ? `대기 ${seats.waitlist}명` : `${seats.remaining}석`}
        </span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)', marginBottom:18}}>
        <span className="dim">진행</span>
        <span className="gold">{lecture.host}</span>
      </div>

      {myReg && (
        <div style={{padding:14, background:'rgba(212,175,55,0.06)', border:'1px solid var(--gold-dim)', marginBottom:16}}>
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
                      style={{borderColor:'#e8a020', color:'#e8a020', marginLeft:'auto'}}>환불 신청</button>
                  : <button type="button" className="btn btn-small" onClick={cancelMyReg}
                      style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:'auto'}}>신청 취소</button>
              )}
            </div>
          )}
          {refundMode && (
            <div style={{marginTop:10, padding:12, background:'rgba(232,160,32,0.06)', border:'1px solid #e8a020', borderRadius:4}}>
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
                  style={{borderColor:'#e8a020', color:'#e8a020'}}
                  onClick={submitRefund}>신청하기</button>
                <button type="button" className="btn btn-small"
                  onClick={() => { setRefundMode(false); setRefundReason(''); setRefundError(''); }}>취소</button>
              </div>
            </div>
          )}
        </div>
      )}

      {!myReg && submitted && (
        <div style={{padding:14, background:'rgba(212,175,55,0.06)', border:'1px solid var(--gold-dim)', marginBottom:16}}>
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
        <div style={{padding:14, background:'rgba(212,175,55,0.04)', border:'1px dashed var(--gold-dim)', marginBottom:16, fontSize:12}}>
          <div className="mono gold" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:8}}>BANK TRANSFER</div>
          {bank.accountNumber ? (
            <div style={{display:'grid', gap:6, lineHeight:1.6}}>
              <div style={{display:'flex', justifyContent:'space-between'}}><span className="dim">은행</span><span>{bank.bankName || '-'}</span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}><span className="dim">계좌</span><span className="gold mono">{bank.accountNumber}</span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}><span className="dim">예금주</span><span>{bank.holder || '-'}</span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span className="dim">금액</span>
                <span className="gold ko-serif" style={{fontSize:15}}>
                  {formatPrice((lecture.price || 0) * (myReg?.count || submitted?.count || 1))}
                </span>
              </div>
            </div>
          ) : (
            <p className="dim" style={{fontSize:12, color:'var(--danger)'}}>계좌번호가 등록되지 않았습니다. 운영자에게 문의해 주세요.</p>
          )}
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
              <div style={{display:'flex', gap:6, justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-small" onClick={() => setOpen(false)}>취소</button>
                <button type="submit" className="btn btn-gold btn-small">신청 접수</button>
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
  const reviews = window.WSD_LECTURES.listReviews(lecture.id);
  const canReview = user ? window.WSD_LECTURES.canReview(lecture.id, user.id) : false;
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      if (confirm("후기 작성은 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?")) {
        go("login");
      }
      return;
    }
    if (!canReview) { setError("참가 확정된 분만 후기를 작성할 수 있습니다."); return; }
    if (!text.trim()) { setError("후기 내용을 입력해 주세요."); return; }
    window.WSD_LECTURES.addReview(lecture.id, {
      userId: user.id,
      author: user.name,
      rating,
      text: text.trim(),
    });
    setText(""); setRating(5);
    onRefresh?.();
  };

  const remove = (id) => {
    if (!confirm("이 후기를 삭제하시겠어요?")) return;
    window.WSD_LECTURES.deleteReview(lecture.id, id);
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
                      color: n <= rating ? 'var(--gold)' : 'var(--ink-3)',
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
          <div className="card dim" style={{padding:16, marginBottom:24, fontSize:13, lineHeight:1.7}}>
            후기는 <strong className="gold">참가 확정</strong>된 회원만 작성할 수 있습니다.
            아직 신청 전이라면 사이드바에서 강연을 신청하고 운영자 입금 확인을 받은 뒤 다시 와 주세요.
          </div>
        )
      ) : (
        <div className="card" style={{padding:16, marginBottom:24, textAlign:'center', background:'rgba(212,175,55,0.04)'}}>
          <p className="dim" style={{fontSize:13, marginBottom:10}}>후기 작성은 회원 전용입니다.</p>
          <div style={{display:'flex', gap:8, justifyContent:'center'}}>
            <button type="button" className="btn btn-gold btn-small" onClick={() => go('login')}>로그인</button>
            <button type="button" className="btn btn-small" onClick={() => go('signup')}>회원가입</button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="dim" style={{fontSize:13, padding:'24px 0', textAlign:'center'}}>
          아직 등록된 후기가 없습니다. 첫 번째 후기를 남겨 주세요.
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
                  <span className="dim-2 mono" style={{fontSize:11}}>{new Date(r.createdAt).toLocaleDateString('ko-KR')}</span>
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

Object.assign(window, { LecturesPage, LectureBookingPanel, LectureReviewsSection });

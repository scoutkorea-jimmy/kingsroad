// 뱅기노자 강연 일정 — 목록 + 상세 + 신청(무통장 입금) + .ics 다운로드
const LecturesPage = ({ go, user }) => {
  const [tick, setTick] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState(null);
  const refresh = () => setTick((v) => v + 1);

  const lectures = React.useMemo(() => window.WSD_LECTURES.listAll(), [tick]);
  const bank = React.useMemo(() => window.WSD_LECTURES.getBankAccount(), [tick]);

  // 외부 진입(해시 / 홈 카드 / 알림 등)으로 들어오는 강연 ID
  React.useEffect(() => {
    let pending = null;
    try { pending = sessionStorage.getItem("wsd_pending_lecture_id"); } catch {}
    if (pending) {
      try { sessionStorage.removeItem("wsd_pending_lecture_id"); } catch {}
      setSelectedId(pending);
    }
  }, []);

  const formatPrice = (p) => (p === 0 || p == null) ? "무료" : `${p.toLocaleString()}원`;

  // ── 상세 보기 ─────────────────────────────────────────────────
  if (selectedId !== null) {
    const lecture = window.WSD_LECTURES.getLecture(selectedId);
    if (!lecture) {
      return (
        <div className="section">
          <div className="container" style={{maxWidth:760, textAlign:'center', padding:'80px 20px'}}>
            <p className="dim" style={{fontSize:14, marginBottom:16}}>해당 강연을 찾을 수 없습니다.</p>
            <button type="button" className="btn" onClick={() => setSelectedId(null)}>강연 목록으로</button>
          </div>
        </div>
      );
    }
    return (
      <LectureDetail
        lecture={lecture}
        user={user}
        bank={bank}
        go={go}
        onRefresh={refresh}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  // ── 목록 ──────────────────────────────────────────────────────
  return (
    <div className="section">
      <div className="container">
        <div style={{textAlign:'center', marginBottom:48}}>
          <div className="section-eyebrow" style={{justifyContent:'center'}}>LECTURE · 왕사남 강연</div>
          <h1 className="section-title">
            <span className="accent">왕사남</span> 강연 일정
          </h1>
          <p className="section-subtitle" style={{margin:'16px auto 0'}}>
            공개 / 심화 / 현장 강연을 신청합니다. 결제는 현재 무통장 입금만 지원합니다.
          </p>
        </div>

        {lectures.length === 0 ? (
          <div className="card" style={{padding:48, textAlign:'center'}}>
            <p className="dim" style={{fontSize:14}}>예정된 강연이 없습니다.</p>
          </div>
        ) : (
          <div style={{display:'grid', gap:20}}>
            {lectures.map((l) => {
              const seats = window.WSD_LECTURES.getSeats(l.id);
              const myReg = user ? window.WSD_LECTURES.hasUserRegistered(l.id, user.id) : null;
              const remaining = seats.remaining;
              const isFull = remaining <= 0;
              return (
                <article key={l.id} className="card"
                  style={{padding:24, cursor:'pointer'}}
                  onClick={() => setSelectedId(l.id)}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:16, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                    <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
                      <span className="badge badge-gold">{l.title}</span>
                      <span className="mono dim-2" style={{fontSize:11}}>#{String(l.id).padStart(2, '0')}</span>
                      {l.price === 0 ? (
                        <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--gold)', border:'1px solid var(--gold-dim)', padding:'1px 6px'}}>FREE</span>
                      ) : (
                        <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)', border:'1px solid var(--line-2)', padding:'1px 6px'}}>무통장 입금</span>
                      )}
                      {myReg && (
                        <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--gold)'}}>● 내 신청 · {labelStatus(myReg.status)}</span>
                      )}
                    </div>
                    <span className="mono gold" style={{fontSize:13, letterSpacing:'0.16em'}}>{l.next}</span>
                  </div>
                  <h2 className="ko-serif" style={{fontSize:24, marginBottom:8}}>{l.topic}</h2>
                  <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>{l.note}</p>
                  <div style={{display:'flex', gap:24, alignItems:'center', flexWrap:'wrap', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink-3)'}}>
                    <span>장소 · {l.venue}</span>
                    <span>진행 · {l.host}</span>
                    <span>참가비 · <span className={l.price === 0 ? 'gold' : ''}>{formatPrice(l.price)}</span></span>
                    <span>정원 · {l.capacity}명</span>
                    <span style={{ color: isFull ? 'var(--danger)' : 'var(--gold)' }}>
                      {isFull ? `대기 ${seats.waitlist}명` : `잔여 ${remaining}석`}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const labelStatus = (status) => {
  switch (status) {
    case 'pending_payment': return '입금 대기';
    case 'confirmed':       return '참가 확정';
    case 'waitlist':        return '대기자';
    case 'cancelled':       return '취소됨';
    default:                return status;
  }
};

const statusTone = (status) => {
  switch (status) {
    case 'confirmed': return 'var(--gold)';
    case 'waitlist':  return 'var(--ink-2)';
    case 'cancelled': return 'var(--danger)';
    default:          return 'var(--ink-2)';
  }
};

// === 상세 + 신청 ==========================================================
const LectureDetail = ({ lecture, user, bank, go, onRefresh, onBack }) => {
  const seats = window.WSD_LECTURES.getSeats(lecture.id);
  const myReg = user ? window.WSD_LECTURES.hasUserRegistered(lecture.id, user.id) : null;
  const formatPrice = (p) => (p === 0 || p == null) ? "무료" : `${p.toLocaleString()}원`;

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [phone, setPhone] = React.useState("");
  const [count, setCount] = React.useState(1);
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState("");
  const [submittedReg, setSubmittedReg] = React.useState(null);

  const requireLogin = (label) => {
    if (confirm(`${label}은(는) 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?`)) {
      go("login");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!user) { requireLogin('강연 신청'); return; }
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
    setSubmittedReg(result.registration);
    onRefresh();
    setOpen(false);
  };

  const cancelMyReg = () => {
    if (!myReg) return;
    if (!confirm("이 강연 신청을 취소하시겠어요?")) return;
    window.WSD_LECTURES.cancelRegistration(lecture.id, myReg.id);
    onRefresh();
    setSubmittedReg(null);
  };

  const downloadIcs = () => {
    window.WSD_LECTURES.downloadIcs(lecture.id);
  };

  const showPaymentInfo = lecture.price > 0 && (myReg?.status === 'pending_payment' || submittedReg?.status === 'pending_payment');

  return (
    <div className="section">
      <div className="container" style={{maxWidth:840}}>
        <button className="btn-ghost" onClick={onBack}
          style={{marginBottom:32, cursor:'pointer', color:'var(--ink-2)', fontSize:12, letterSpacing:'0.1em'}}>
          ← 강연 목록
        </button>

        <header style={{marginBottom:32}}>
          <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:14, flexWrap:'wrap'}}>
            <span className="badge badge-gold">{lecture.title}</span>
            {lecture.price === 0 ? (
              <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--gold)', border:'1px solid var(--gold-dim)', padding:'1px 6px'}}>FREE</span>
            ) : (
              <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)', border:'1px solid var(--line-2)', padding:'1px 6px'}}>무통장 입금</span>
            )}
          </div>
          <h1 className="ko-serif" style={{fontSize:36, fontWeight:500, lineHeight:1.2, marginBottom:16}}>
            {lecture.topic}
          </h1>
          <p className="dim" style={{fontSize:14, lineHeight:1.8, marginBottom:20}}>{lecture.note}</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:14}}>
            {[
              { l: "일정", v: lecture.next },
              { l: "장소", v: lecture.venue },
              { l: "진행", v: lecture.host },
              { l: "정원", v: `${lecture.capacity}명` },
              { l: "잔여", v: `${seats.remaining}석${seats.waitlist ? ` · 대기 ${seats.waitlist}명` : ''}`, tone: seats.remaining <= 0 ? 'var(--danger)' : 'var(--gold)' },
              { l: "참가비", v: formatPrice(lecture.price), tone: lecture.price === 0 ? 'var(--gold)' : 'var(--ink)' },
            ].map((m) => (
              <div key={m.l} className="card" style={{padding:14}}>
                <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:6}}>{m.l}</div>
                <div style={{ color: m.tone || 'var(--ink)' }}>{m.v}</div>
              </div>
            ))}
          </div>
        </header>

        {/* 신청 상태 카드 */}
        {myReg ? (
          <div className="card card-gold" style={{padding:20, marginBottom:24}}>
            <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>MY REGISTRATION</div>
            <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap'}}>
              <h2 className="ko-serif" style={{fontSize:20}}>
                {labelStatus(myReg.status)}
              </h2>
              <span className="mono" style={{fontSize:11, letterSpacing:'0.2em', color: statusTone(myReg.status)}}>
                {myReg.count}명 · {formatPrice((lecture.price || 0) * (myReg.count || 1))}
              </span>
            </div>
            {myReg.status === 'pending_payment' && (
              <p className="dim" style={{fontSize:13, lineHeight:1.7, marginTop:10}}>
                계좌로 입금 후 운영자가 확인하면 참가가 확정됩니다.
              </p>
            )}
            {myReg.status === 'waitlist' && (
              <p className="dim" style={{fontSize:13, lineHeight:1.7, marginTop:10}}>
                정원이 차서 대기 등록되었습니다. 자리가 나면 자동으로 확정으로 전환됩니다.
              </p>
            )}
            <div style={{display:'flex', gap:8, marginTop:14, flexWrap:'wrap'}}>
              <button type="button" className="btn btn-small" onClick={downloadIcs}>캘린더 추가 (.ics)</button>
              {myReg.status !== 'cancelled' && (
                <button type="button" className="btn btn-small" onClick={cancelMyReg}
                  style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:'auto'}}>신청 취소</button>
              )}
            </div>
          </div>
        ) : submittedReg ? (
          <div className="card card-gold" style={{padding:20, marginBottom:24}}>
            <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>SUBMITTED</div>
            <h2 className="ko-serif" style={{fontSize:20, marginBottom:8}}>
              신청이 접수되었습니다 — {labelStatus(submittedReg.status)}
            </h2>
            {submittedReg.status === 'pending_payment' && (
              <p className="dim" style={{fontSize:13, lineHeight:1.7}}>아래 계좌로 입금 후 운영자가 확인하면 참가가 확정됩니다.</p>
            )}
            {submittedReg.status === 'confirmed' && (
              <p className="dim" style={{fontSize:13, lineHeight:1.7}}>참가가 확정되었습니다. 일정을 캘린더에 추가해 두세요.</p>
            )}
          </div>
        ) : null}

        {/* 무통장 입금 안내 */}
        {showPaymentInfo && (
          <div className="card" style={{padding:20, marginBottom:24, background:'rgba(212,175,55,0.04)'}}>
            <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>BANK TRANSFER</div>
            <h2 className="ko-serif" style={{fontSize:18, marginBottom:14}}>무통장 입금 안내</h2>
            {bank.accountNumber ? (
              <div style={{display:'grid', gap:8}}>
                <div style={{display:'flex', justifyContent:'space-between', gap:12, paddingBottom:8, borderBottom:'1px dashed var(--line)'}}>
                  <span className="dim">은행</span><span>{bank.bankName || '미입력'}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', gap:12, paddingBottom:8, borderBottom:'1px dashed var(--line)'}}>
                  <span className="dim">계좌번호</span><span className="gold mono">{bank.accountNumber}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', gap:12, paddingBottom:8, borderBottom:'1px dashed var(--line)'}}>
                  <span className="dim">예금주</span><span>{bank.holder || '미입력'}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', gap:12, paddingBottom:8, borderBottom:'1px dashed var(--line)'}}>
                  <span className="dim">금액</span>
                  <span className="gold ko-serif" style={{fontSize:18}}>
                    {formatPrice((lecture.price || 0) * (myReg?.count || submittedReg?.count || 1))}
                  </span>
                </div>
                {bank.memo && (
                  <p className="dim" style={{fontSize:12, lineHeight:1.7, marginTop:6}}>{bank.memo}</p>
                )}
              </div>
            ) : (
              <p className="dim" style={{fontSize:13, lineHeight:1.7, color:'var(--danger)'}}>
                계좌번호가 아직 등록되지 않았습니다. 운영자에게 문의해 주세요.
              </p>
            )}
          </div>
        )}

        {/* 신청 진입 / 폼 */}
        {!myReg && !submittedReg && (
          <div style={{display:'flex', gap:10, justifyContent:'center', marginTop:24, marginBottom:24, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-gold"
              onClick={() => {
                if (!user) { requireLogin('강연 신청'); return; }
                setOpen(true); setError("");
              }}>
              {seats.remaining > 0 ? '강연 신청' : '대기자 등록'}
            </button>
            <button type="button" className="btn" onClick={downloadIcs}>캘린더에 추가 (.ics)</button>
          </div>
        )}

        {open && (
          <form onSubmit={submit}
            className="card" style={{padding:20, marginBottom:24}}>
            <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:12}}>REGISTER</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12}}>
              <div className="field" style={{margin:0}}>
                <label className="field-label" htmlFor="reg-name">이름 <span className="gold" aria-hidden="true">*</span></label>
                <input id="reg-name" className="field-input" value={name} onChange={(e) => setName(e.target.value)}/>
              </div>
              <div className="field" style={{margin:0}}>
                <label className="field-label" htmlFor="reg-email">이메일 <span className="gold" aria-hidden="true">*</span></label>
                <input id="reg-email" type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 120px', gap:12, marginBottom:12}}>
              <div className="field" style={{margin:0}}>
                <label className="field-label" htmlFor="reg-phone">연락처 (선택)</label>
                <input id="reg-phone" className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-..."/>
              </div>
              <div className="field" style={{margin:0}}>
                <label className="field-label" htmlFor="reg-count">인원</label>
                <input id="reg-count" type="number" min={1} max={Math.max(1, lecture.capacity)} className="field-input"
                  value={count} onChange={(e) => setCount(e.target.value)}/>
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="reg-note">메모 (선택)</label>
              <textarea id="reg-note" className="field-input" rows={2} value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="동행자 정보·특이사항 등"/>
            </div>
            {error && (
              <div role="alert" style={{padding:'10px 12px', background:'rgba(194,74,61,0.1)', border:'1px solid var(--danger)', color:'var(--danger)', fontSize:13, marginBottom:12}}>
                {error}
              </div>
            )}
            <div className="dim mono" style={{fontSize:11, lineHeight:1.7, marginBottom:14, letterSpacing:'0.05em'}}>
              {lecture.price === 0
                ? '무료 강연이라 신청 즉시 참가가 확정됩니다.'
                : `결제는 무통장 입금. 신청 → 입금 → 운영자 확인 → 참가 확정 순으로 진행됩니다. 합계 ${formatPrice((lecture.price || 0) * (Number(count) || 1))}.`}
              {seats.remaining <= 0 && ' 정원이 차서 자동으로 대기자로 등록됩니다.'}
            </div>
            <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
              <button type="button" className="btn btn-small" onClick={() => setOpen(false)}>취소</button>
              <button type="submit" className="btn btn-gold btn-small">신청 접수</button>
            </div>
          </form>
        )}

        {/* 비로그인 안내 */}
        {!user && (
          <div className="card" style={{padding:20, textAlign:'center', background:'rgba(212,175,55,0.04)', marginTop:24}}>
            <p className="dim" style={{fontSize:13, marginBottom:14}}>
              강연 신청은 <strong className="gold">회원가입한 분</strong>만 가능합니다.
            </p>
            <div style={{display:'flex', gap:10, justifyContent:'center'}}>
              <button type="button" className="btn btn-gold btn-small" onClick={() => go('login')}>로그인</button>
              <button type="button" className="btn btn-small" onClick={() => go('signup')}>회원가입</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { LecturesPage, LectureDetail });

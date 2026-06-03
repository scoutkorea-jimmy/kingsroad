// 한켠(전주) 예약 페이지 — /sleep · /hangyeon  (v00.268)
// 상품마다 예약유형: nightly(1박 숙박, 체크인~체크아웃) | timeslot(시간제 — 인원+날짜+시간슬롯).
// UI: 네이버 예약 스타일(인원 pill + 오늘/공휴일 캘린더 + 시간슬롯 pill). D1: window.BGNJ_HANGYEON.

const hkToday = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const hkNowHM = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(11, 16);
const hkAddDays = (str, n) => new Date(new Date(str + 'T00:00:00Z').getTime() + n * 86400000).toISOString().slice(0, 10);
const hkNightsBetween = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000);
const HK_WD = ['일', '월', '화', '수', '목', '금', '토'];
const hkFmtDate = (str) => { if (!str) return ''; const d = new Date(str + 'T00:00:00Z'); return `${str.slice(5).replace('-', '.')} (${HK_WD[d.getUTCDay()]})`; };
const hkWon = (n) => (window.BGNJ_FMT?.won ? window.BGNJ_FMT.won(n) : `${Number(n || 0).toLocaleString('ko-KR')}원`);
// 2026 공휴일(고정 + 주요 음력) — 캘린더 빨강/라벨 표시용.
const HK_HOLIDAYS = {
  '2026-01-01': '신정', '2026-02-16': '설날', '2026-02-17': '설날', '2026-02-18': '설날',
  '2026-03-01': '삼일절', '2026-05-05': '어린이날', '2026-05-24': '석가탄신일', '2026-06-06': '현충일',
  '2026-08-15': '광복절', '2026-09-24': '추석', '2026-09-25': '추석', '2026-09-26': '추석',
  '2026-10-03': '개천절', '2026-10-09': '한글날', '2026-12-25': '성탄절',
};
// 시간 라벨 (24h 'HH:MM' → '오전/오후 h:MM' 분리용 + 표시).
const hk12h = (hm) => { const [h, m] = hm.split(':').map(Number); const ap = h < 12 ? '' : ''; const hh = h % 12 === 0 ? 12 : h % 12; return `${hh}:${String(m).padStart(2, '0')}`; };

// ── 인원 pill 선택 ──────────────────────────────────────────────────────────
const HkPeoplePills = ({ max, value, onChange, label = '인원' }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <strong style={{ fontSize: 15 }}>👤 {label}을 선택해 주세요</strong>
    </div>
    <div className="dim-2" style={{ fontSize: 12, marginBottom: 8 }}>{max}{label === '인원' ? '명' : ''}까지 선택 가능합니다.</div>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}
          style={{
            minWidth: 60, padding: '12px 0', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 600,
            border: `1px solid ${value === n ? 'var(--success)' : 'var(--line)'}`,
            background: value === n ? 'var(--success)' : 'var(--bg)', color: value === n ? '#fff' : 'var(--ink)',
            flex: '1 1 0',
          }}>{n}{label === '인원' ? '명' : ''}</button>
      ))}
    </div>
  </div>
);

// ── 월 캘린더 (네이버 스타일) — mode: 'range'(숙박) | 'single'(시간제) ─────────
const HkMonthCalendar = ({ mode, roomTypeId, checkIn, checkOut, single, onRange, onSingle }) => {
  const today = hkToday();
  const [cursor, setCursor] = React.useState((single || checkIn || today).slice(0, 7) + '-01');
  const [avail, setAvail] = React.useState({});
  React.useEffect(() => {
    if (!roomTypeId) return;
    let alive = true;
    window.BGNJ_HANGYEON.availability({ from: cursor, to: hkAddDays(cursor, 42), roomTypeId }).then((res) => {
      if (!alive) return;
      const map = {};
      ((res.availability && res.availability[roomTypeId]) || []).forEach((a) => { map[a.date] = a; });
      setAvail(map);
    });
    return () => { alive = false; };
  }, [roomTypeId, cursor]);

  const year = Number(cursor.slice(0, 4)), month = Number(cursor.slice(5, 7)) - 1;
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = []; for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${cursor.slice(0, 8)}${String(d).padStart(2, '0')}`);
  const prevDisabled = cursor <= today.slice(0, 7) + '-01';
  const inRange = (date) => mode === 'range' && checkIn && checkOut && date >= checkIn && date < checkOut;

  const onCellClick = (date) => {
    if (date < today) return;
    const a = avail[date];
    if (a && (a.closed || a.remaining < 1)) return;
    if (mode === 'single') { onSingle(date); return; }
    if (!checkIn || (checkIn && checkOut) || date <= checkIn) { onRange(date, null); return; }
    for (let dd = checkIn; dd < date; dd = hkAddDays(dd, 1)) {
      const av = avail[dd];
      if (av && (av.closed || av.remaining < 1)) { window.BGNJ_TOAST?.error?.('선택 구간에 예약 불가 날짜가 있어요.'); return; }
    }
    onRange(checkIn, date);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginBottom: 14 }}>
        <button type="button" disabled={prevDisabled} onClick={() => setCursor(`${new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 8)}01`)}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: prevDisabled ? 'default' : 'pointer', color: prevDisabled ? 'var(--line)' : 'var(--ink)' }}>‹</button>
        <strong style={{ fontSize: 17 }}>{year}.{month + 1}</strong>
        <button type="button" onClick={() => setCursor(`${new Date(Date.UTC(year, month + 1, 1)).toISOString().slice(0, 8)}01`)}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--ink)' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', rowGap: 4 }}>
        {HK_WD.map((w, i) => (
          <div key={w} style={{ textAlign: 'center', fontSize: 12, padding: '6px 0', color: i === 0 ? 'var(--danger)' : i === 6 ? '#2563EB' : 'var(--ink-3)' }}>{w}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`e${i}`} />;
          const day = Number(date.slice(8));
          const dow = new Date(date + 'T00:00:00Z').getUTCDay();
          const a = avail[date];
          const past = date < today;
          const soldout = a && (a.closed || a.remaining < 1);
          const disabled = past || soldout;
          const isToday = date === today;
          const selected = mode === 'single' ? date === single : (date === checkIn || date === checkOut);
          const ranged = inRange(date);
          const holiday = HK_HOLIDAYS[date];
          const textColor = selected ? '#fff' : disabled ? 'var(--ink-3)' : holiday || dow === 0 ? 'var(--danger)' : dow === 6 ? '#2563EB' : 'var(--ink)';
          return (
            <div key={date} style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
              <button type="button" disabled={disabled} onClick={() => onCellClick(date)}
                style={{
                  width: 44, height: 50, borderRadius: 12, border: 'none', cursor: disabled ? 'default' : 'pointer',
                  background: selected ? 'var(--success)' : isToday ? 'rgba(22,163,74,0.10)' : ranged ? 'var(--bg-2)' : 'transparent',
                  color: textColor, opacity: past ? 0.4 : 1,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                  fontSize: 15, fontWeight: selected || isToday ? 700 : 500,
                }}>
                <span>{day}</span>
                <span style={{ fontSize: 8.5, lineHeight: 1, color: selected ? '#fff' : isToday ? 'var(--success)' : holiday ? 'var(--danger)' : 'var(--ink-3)' }}>
                  {isToday ? '오늘' : holiday ? holiday : (!past && a && !soldout && mode !== 'single') ? `${a.remaining}` : (!past && soldout) ? '마감' : ''}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── 시간 슬롯 pill (네이버 스타일, 오전/오후 분리) ───────────────────────────
const HkTimeSlots = ({ roomTypeId, date, guests, value, onPick }) => {
  const [slots, setSlots] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (!date) return;
    let alive = true; setLoading(true);
    window.BGNJ_HANGYEON.slots({ roomTypeId, date }).then((s) => { if (alive) { setSlots(s); setLoading(false); } });
    return () => { alive = false; };
  }, [roomTypeId, date]);

  if (!date) return null;
  const today = hkToday(); const nowHM = hkNowHM();
  const am = slots.filter((s) => Number(s.start.slice(0, 2)) < 12);
  const pm = slots.filter((s) => Number(s.start.slice(0, 2)) >= 12);
  const renderGroup = (label, arr) => arr.length === 0 ? null : (
    <div style={{ marginBottom: 14 }}>
      <div className="dim-2" style={{ fontSize: 13, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {arr.map((s) => {
          const full = s.remaining < (guests || 1);
          const pastTime = date === today && s.start <= nowHM;
          const disabled = full || pastTime;
          const sel = value === s.start;
          return (
            <button key={s.start} type="button" disabled={disabled} onClick={() => onPick(s.start)}
              style={{
                padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 600,
                border: `1px solid ${sel ? 'var(--success)' : 'var(--line)'}`,
                background: sel ? 'var(--success)' : 'var(--bg)',
                color: sel ? '#fff' : disabled ? 'var(--ink-3)' : 'var(--ink)',
                cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.45 : 1,
              }}>{hk12h(s.start)}</button>
          );
        })}
      </div>
    </div>
  );
  return (
    <div>
      {loading ? <p className="dim" style={{ fontSize: 13 }}>시간 불러오는 중…</p>
        : slots.length === 0 ? <p className="dim" style={{ fontSize: 13 }}>예약 가능한 시간이 없습니다.</p>
          : <>{renderGroup('오전', am)}{renderGroup('오후', pm)}</>}
    </div>
  );
};

// ── 예약 모달 ─────────────────────────────────────────────────────────────
const HkBookingModal = ({ roomType, user, property, onClose, onDone }) => {
  const isSlot = roomType.bookingType === 'timeslot';
  const [checkIn, setCheckIn] = React.useState(null);
  const [checkOut, setCheckOut] = React.useState(null);
  const [date, setDate] = React.useState(null);       // timeslot 단일 날짜
  const [slotStart, setSlotStart] = React.useState(null);
  const [rooms, setRooms] = React.useState(1);
  const [guests, setGuests] = React.useState(1);
  const [coupon, setCoupon] = React.useState('');
  const [name, setName] = React.useState(user?.name || '');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState(user?.email || '');
  const [request, setRequest] = React.useState('');
  const [agreed, setAgreed] = React.useState(false);
  const [quote, setQuote] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  // 견적 재계산
  React.useEffect(() => {
    let alive = true;
    if (isSlot) {
      if (!date || !slotStart) { setQuote(null); return; }
      window.BGNJ_HANGYEON.quote({ roomTypeId: roomType.id, checkIn: date, slotStart, guests, couponCode: coupon.trim() || undefined })
        .then((q) => { if (alive) setQuote(q); });
    } else {
      if (!checkIn || !checkOut) { setQuote(null); return; }
      window.BGNJ_HANGYEON.quote({ roomTypeId: roomType.id, checkIn, checkOut, rooms, couponCode: coupon.trim() || undefined })
        .then((q) => { if (alive) setQuote(q); });
    }
    return () => { alive = false; };
  }, [isSlot, date, slotStart, checkIn, checkOut, rooms, guests, coupon, roomType.id]);

  // 시간제: 날짜 바꾸면 슬롯 초기화
  React.useEffect(() => { if (isSlot) setSlotStart(null); }, [date, guests]);

  const submit = async () => {
    if (!name.trim() || !phone.trim()) { window.BGNJ_TOAST?.error?.('이름과 연락처를 입력해 주세요.'); return; }
    if (!agreed) { window.BGNJ_TOAST?.error?.('개인정보 수집·이용에 동의해 주세요.'); return; }
    if (!quote?.ok) { window.BGNJ_TOAST?.error?.(quote?.reason || '예약할 수 없습니다.'); return; }
    setSubmitting(true);
    const payload = isSlot
      ? { roomTypeId: roomType.id, checkIn: date, slotStart, guests, name: name.trim(), phone: phone.trim(), email: email.trim(), request: request.trim(), couponCode: coupon.trim() || undefined }
      : { roomTypeId: roomType.id, checkIn, checkOut, rooms, guests, name: name.trim(), phone: phone.trim(), email: email.trim(), request: request.trim(), couponCode: coupon.trim() || undefined };
    const res = await window.BGNJ_HANGYEON.book(payload);
    setSubmitting(false);
    if (res.ok) {
      window.BGNJ_TOAST?.success?.(`예약 접수 완료 (${res.booking?.code}). 입금 확인 후 확정됩니다.`);
      onDone && onDone(); onClose();
    } else { window.BGNJ_TOAST?.error?.(res.message || '예약 실패'); }
  };

  const nights = checkIn && checkOut ? hkNightsBetween(checkIn, checkOut) : 0;
  const peopleMax = roomType.maxOccupancy || 5;

  return (
    <div className="modal-overlay" onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ maxWidth: 520, width: '100%', padding: 0, background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
          <h3 className="ko-serif" style={{ fontSize: 19, margin: 0 }}>{roomType.name} 예약</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink-3)' }}>✕</button>
        </div>
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 상품/숙소 상세 */}
          <div className="card" style={{ padding: '12px 16px', background: 'var(--bg-2)', fontSize: 12.5, lineHeight: 1.7 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: (roomType.description || property?.address) ? 8 : 0 }}>
              <span className="badge">{isSlot ? `최대 ${peopleMax}명` : `최대 ${roomType.maxOccupancy}인`}</span>
              {!isSlot && roomType.bedConfig && <span className="badge">{roomType.bedConfig}</span>}
              {(roomType.amenities || []).slice(0, 6).map((a) => <span key={a} className="badge" style={{ fontSize: 9 }}>{a}</span>)}
            </div>
            {roomType.description && <p className="dim" style={{ margin: '0 0 8px' }}>{roomType.description}</p>}
            {property?.address && <div><span className="mono dim-2" style={{ fontSize: 10, letterSpacing: '0.16em', marginRight: 6 }}>주소</span>{property.address}</div>}
            {property?.directions && <p className="dim" style={{ margin: '6px 0 0' }}><span className="mono dim-2" style={{ fontSize: 10, letterSpacing: '0.16em', marginRight: 6 }}>찾아가는 길</span>{property.directions}</p>}
          </div>

          {isSlot ? (
            <>
              <HkPeoplePills max={peopleMax} value={guests} onChange={setGuests} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <strong style={{ fontSize: 15 }}>📅 {date ? hkFmtDate(date) + ' · ' : ''}날짜와 시간을 선택해 주세요</strong>
                </div>
                <HkMonthCalendar mode="single" roomTypeId={roomType.id} single={date} onSingle={setDate} />
              </div>
              {date && <HkTimeSlots roomTypeId={roomType.id} date={date} guests={guests} value={slotStart} onPick={setSlotStart} />}
            </>
          ) : (
            <>
              <div>
                <strong style={{ fontSize: 15, display: 'block', marginBottom: 10 }}>📅 날짜를 선택해 주세요</strong>
                <HkMonthCalendar mode="range" roomTypeId={roomType.id} checkIn={checkIn} checkOut={checkOut} onRange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }} />
              </div>
              {checkIn && (
                <div className="card" style={{ padding: '10px 14px', background: 'var(--bg-2)', fontSize: 14 }}>
                  <strong>{hkFmtDate(checkIn)}</strong>{checkOut ? <> → <strong>{hkFmtDate(checkOut)}</strong> · {nights}박</> : <span className="dim"> · 체크아웃 날짜를 선택하세요</span>}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={{ fontSize: 12 }}>객실 수
                  <select className="field-input" value={rooms} onChange={(e) => setRooms(Number(e.target.value))}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}실</option>)}</select>
                </label>
                <label style={{ fontSize: 12 }}>투숙 인원
                  <select className="field-input" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                    {Array.from({ length: (roomType.maxOccupancy || 2) * rooms }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}명</option>)}
                  </select>
                </label>
              </div>
            </>
          )}

          {/* 견적 */}
          {quote && (
            <div className="card" style={{ padding: '14px 16px' }}>
              {quote.ok ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="dim">{isSlot ? `${hkFmtDate(quote.date)} ${hk12h(quote.slotStart)}~${hk12h(quote.slotEnd)} · ${quote.guests}명` : `객실 (${nights}박 × ${rooms}실)`}</span>
                    <span>{hkWon(quote.subtotal)}</span>
                  </div>
                  {quote.stayDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}><span>{quote.stayLabel}</span><span>-{hkWon(quote.stayDiscount)}</span></div>}
                  {quote.couponDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}><span>쿠폰 ({quote.couponLabel})</span><span>-{hkWon(quote.couponDiscount)}</span></div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 6, fontWeight: 700, fontSize: 16 }}><span>합계</span><span className="ko-serif">{hkWon(quote.total)}</span></div>
                </div>
              ) : <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{quote.reason || '예약 불가'}</p>}
              {quote.couponError && <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--danger)' }}>{quote.couponError}</p>}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ fontSize: 12 }}>예약자 이름 *<input className="field-input" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label style={{ fontSize: 12 }}>연락처 *<input className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" /></label>
            <label style={{ fontSize: 12 }}>이메일<input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label style={{ fontSize: 12 }}>쿠폰 코드<input className="field-input" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="(선택)" /></label>
          </div>
          <label style={{ fontSize: 12 }}>요청사항<textarea className="field-input" rows={2} value={request} onChange={(e) => setRequest(e.target.value)} placeholder="요청사항을 적어주세요" /></label>

          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, cursor: 'pointer' }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 2 }} />
            <span>예약을 위한 <strong>개인정보(이름·연락처·이메일) 수집·이용</strong>에 동의합니다.</span>
          </label>
          <div className="card" style={{ padding: '10px 14px', background: 'var(--bg-2)', fontSize: 12 }}>
            <strong>결제 안내</strong> — 예약 접수 후 <strong>무통장 입금</strong> 또는 <strong>현장 결제</strong>로 진행됩니다. 입금 확인 시 예약이 확정됩니다.
          </div>

          <button type="button" className="btn btn-gold" disabled={submitting || !quote?.ok} onClick={submit}
            style={{ opacity: (submitting || !quote?.ok) ? 0.5 : 1 }}>
            {submitting ? '접수 중…' : quote?.ok ? `${hkWon(quote.total)} 예약 접수하기` : '예약하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── 예약 현황 개요 캘린더 (전체 상품 합산, 읽기 전용) ─────────────────────────
const HkOverviewCalendar = () => {
  const today = hkToday();
  const [cursor, setCursor] = React.useState(today.slice(0, 7) + '-01');
  const [map, setMap] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    let alive = true; setLoading(true);
    window.BGNJ_HANGYEON.availability({ from: cursor, to: hkAddDays(cursor, 42) }).then((res) => {
      if (!alive) return;
      const agg = {}; const av = res.availability || {};
      Object.keys(av).forEach((rid) => (av[rid] || []).forEach((a) => {
        if (!agg[a.date]) agg[a.date] = { remaining: 0, qty: 0 };
        agg[a.date].remaining += a.remaining; agg[a.date].qty += a.qty;
      }));
      setMap(agg); setLoading(false);
    });
    return () => { alive = false; };
  }, [cursor]);

  const year = Number(cursor.slice(0, 4)), month = Number(cursor.slice(5, 7)) - 1;
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = []; for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${cursor.slice(0, 8)}${String(d).padStart(2, '0')}`);
  const prevDisabled = cursor <= today.slice(0, 7) + '-01';
  const hasData = Object.keys(map).length > 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginBottom: 14 }}>
        <button type="button" disabled={prevDisabled} onClick={() => setCursor(`${new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 8)}01`)}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: prevDisabled ? 'default' : 'pointer', color: prevDisabled ? 'var(--line)' : 'var(--ink)' }}>‹</button>
        <strong style={{ fontSize: 17 }}>{year}.{month + 1}{loading ? ' …' : ''}</strong>
        <button type="button" onClick={() => setCursor(`${new Date(Date.UTC(year, month + 1, 1)).toISOString().slice(0, 8)}01`)}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--ink)' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', rowGap: 4 }}>
        {HK_WD.map((w, i) => <div key={w} style={{ textAlign: 'center', fontSize: 12, padding: '6px 0', color: i === 0 ? 'var(--danger)' : i === 6 ? '#2563EB' : 'var(--ink-3)' }}>{w}</div>)}
        {cells.map((date, i) => {
          if (!date) return <div key={`e${i}`} />;
          const dow = new Date(date + 'T00:00:00Z').getUTCDay();
          const a = map[date]; const past = date < today; const full = a && a.remaining < 1;
          const isToday = date === today; const holiday = HK_HOLIDAYS[date];
          return (
            <div key={date} style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
              <div style={{
                width: 44, height: 50, borderRadius: 12,
                background: isToday ? 'rgba(22,163,74,0.10)' : past ? 'transparent' : full ? 'rgba(220,38,38,0.06)' : 'transparent',
                opacity: past ? 0.4 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                color: holiday || dow === 0 ? 'var(--danger)' : dow === 6 ? '#2563EB' : 'var(--ink)',
              }}>
                <span style={{ fontSize: 15, fontWeight: isToday ? 700 : 500 }}>{Number(date.slice(8))}</span>
                {!past && (isToday ? <span style={{ fontSize: 8.5, color: 'var(--success)' }}>오늘</span>
                  : !hasData ? null : full ? <span style={{ fontSize: 8.5, color: 'var(--danger)', fontWeight: 600 }}>마감</span>
                    : <span style={{ fontSize: 8.5, color: 'var(--success)', fontWeight: 600 }}>{a ? a.remaining : 0}</span>)}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11, justifyContent: 'center' }} className="dim-2">
        <span><span style={{ color: 'var(--success)', fontWeight: 600 }}>숫자</span> 예약 가능</span>
        <span><span style={{ color: 'var(--danger)', fontWeight: 600 }}>마감</span> 잔여 없음</span>
      </div>
    </div>
  );
};

// ── 내 예약 ───────────────────────────────────────────────────────────────
const HK_STATUS_LABEL = { pending: '예약대기', confirmed: '예약확정', checked_in: '체크인', checked_out: '체크아웃', cancelled: '취소', no_show: '노쇼' };
const HK_PAY_LABEL = { unpaid: '미결제', partial: '부분결제', paid: '결제완료', refunded: '환불완료' };
const HkMyBookings = ({ tick }) => {
  const [bookings, setBookings] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => { window.BGNJ_HANGYEON.refreshMine().then((b) => { setBookings(b); setLoaded(true); }); }, [tick]);
  const cancel = async (b) => {
    if (!(await window.BGNJ_CONFIRM(`${b.code} 예약을 취소할까요?`, { danger: true }))) return;
    try { await window.BGNJ_HANGYEON.cancelBooking(b.id); window.BGNJ_HANGYEON.refreshMine().then(setBookings); window.BGNJ_TOAST?.success?.('취소되었습니다.'); }
    catch (err) { window.BGNJ_TOAST?.error?.(err?.body?.error || '취소 실패'); }
  };
  if (!loaded || bookings.length === 0) return null;
  return (
    <section className="section-tight" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <h2 className="section-title" style={{ fontSize: 24, marginBottom: 18 }}>내 예약</h2>
        <div className="grid grid-2">
          {bookings.map((b) => (
            <div key={b.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="mono dim-2" style={{ fontSize: 11 }}>{b.code}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge">{HK_STATUS_LABEL[b.status] || b.status}</span>
                  <span className="badge" style={{ borderColor: 'var(--line)' }}>{HK_PAY_LABEL[b.paymentStatus] || b.paymentStatus}</span>
                </div>
              </div>
              <h3 className="ko-serif" style={{ fontSize: 17, marginBottom: 6 }}>{b.roomTypeName}</h3>
              <p className="dim" style={{ fontSize: 13, margin: '0 0 6px' }}>
                {b.slotStart ? `${hkFmtDate(b.checkIn)} ${hk12h(b.slotStart)}~${hk12h(b.slotEnd)} · ${b.guests}명`
                  : `${hkFmtDate(b.checkIn)} → ${hkFmtDate(b.checkOut)} · ${b.nights}박 ${b.rooms}실 ${b.guests}명`}
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 10px' }}>{hkWon(b.totalPrice)}</p>
              {['pending', 'confirmed'].includes(b.status) && <button type="button" className="btn btn-small" onClick={() => cancel(b)}>예약 취소</button>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── 상품 카드 ─────────────────────────────────────────────────────────────
const HkRoomCard = ({ rt, onBook }) => {
  const cover = (rt.images || []).find((im) => im.isPrimary) || (rt.images || [])[0];
  const isSlot = rt.bookingType === 'timeslot';
  const priceLabel = isSlot
    ? `${rt.slotMinutes >= 60 ? Math.round(rt.slotMinutes / 60 * 10) / 10 + '시간' : rt.slotMinutes + '분'} ${hkWon(rt.basePrice)}~`
    : `1박 ${hkWon(rt.basePrice)}~`;
  return (
    <article className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ aspectRatio: '4/3', background: 'var(--bg-2)', overflow: 'hidden' }}>
        {cover ? <img src={cover.url} alt={rt.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : (window.CoverPlaceholder ? <window.CoverPlaceholder aspectRatio="4/3" iconSize={56} /> : null)}
      </div>
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 className="ko-serif" style={{ fontSize: 19, margin: 0 }}>{rt.name}</h3>
          <span className="badge" style={{ borderColor: 'var(--success)', color: 'var(--success)', fontSize: 10 }}>예약</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="badge">{isSlot ? '시간제' : '숙박'}</span>
          <span className="badge">최대 {rt.maxOccupancy}{isSlot ? '명' : '인'}</span>
          {!isSlot && rt.bedConfig && <span className="badge">{rt.bedConfig}</span>}
        </div>
        {rt.description && <p className="dim bgnj-multiline" style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>{rt.description}</p>}
        {(rt.amenities || []).length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>{rt.amenities.slice(0, 6).map((a) => <span key={a} className="badge" style={{ fontSize: 9 }}>{a}</span>)}</div>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 10 }}>
          <div className="ko-serif" style={{ fontSize: 18, fontWeight: 700 }}>{priceLabel}</div>
          <button type="button" className="btn btn-gold" onClick={() => onBook(rt)}>예약하기</button>
        </div>
      </div>
    </article>
  );
};

const HangyeonPage = ({ go, user }) => {
  const [tick, setTick] = React.useState(0);
  const [roomTypes, setRoomTypes] = React.useState([]);
  const [booking, setBooking] = React.useState(null);
  const [scTick, setScTick] = React.useState(0);
  React.useEffect(() => {
    window.BGNJ_HANGYEON.refreshRoomTypes().then(setRoomTypes);
    const onR = () => setScTick((v) => v + 1);
    window.addEventListener('bgnj-site-content-refresh', onR);
    return () => window.removeEventListener('bgnj-site-content-refresh', onR);
  }, []);

  const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
  const info = sc.hangyeon || {};
  const name = info.name || '전주한켠';
  const tagline = info.tagline || '전주 도심 속, 조용한 하룻밤';
  const desc = info.desc || "전주 전자상가 뒤편 조용한 주택가에 자리한 공간 ‘한켠’. 도심 한가운데서도 차분히 머물며 쉬어 갈 수 있는 공간입니다.";
  const address = info.address || '전북 전주시 덕진구 팔달로 340-37';
  const directions = info.directions || '전주역에서 차량 10분, 전주 고속버스터미널에서 도보 15분 거리로 접근성이 좋습니다. 한옥마을·자만벽화마을·경기전·풍남문 등 주요 명소까지 차량 5~10분이면 닿습니다.';
  const images = Array.isArray(info.images) ? info.images : [];

  return (
    <div className="section">
      <div className="container">
        <header style={{ marginBottom: 28 }}>
          <div className="section-eyebrow" aria-hidden="true">STAY · 자고 놀자</div>
          <h1 className="section-title" style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span>{name}</span>
            <span className="ko-serif" style={{ fontSize: '0.5em', color: 'var(--secondary)', fontStyle: 'italic', fontWeight: 400 }}>{tagline}</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: 760 }}>{desc}</p>
        </header>

        {images.length > 0 && window.MediaGalleryView && (
          <div style={{ marginBottom: 32 }}><window.MediaGalleryView images={images} title={name} sectionLabel="숙소 전경" withCover={true} /></div>
        )}
      </div>

      <div className="container">
        <h2 className="section-title" style={{ fontSize: 24, marginBottom: 14 }}>예약 현황</h2>
        <div className="card" style={{ padding: '20px', marginBottom: 36 }}><HkOverviewCalendar /></div>

        <h2 className="section-title" style={{ fontSize: 26, marginBottom: 18 }}>상품</h2>
        {roomTypes.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}><p className="dim" style={{ margin: 0 }}>현재 등록된 상품이 없습니다. 곧 만나요.</p></div>
        ) : (
          <div className="grid grid-3" style={{ marginBottom: 16 }}>
            {roomTypes.map((rt) => <HkRoomCard key={rt.id} rt={rt} onBook={setBooking} />)}
          </div>
        )}
      </div>

      <HkMyBookings tick={tick} />

      {booking && (
        <HkBookingModal roomType={booking} user={user}
          property={{ name, address, directions, notice: info.notice }}
          onClose={() => setBooking(null)} onDone={() => setTick((v) => v + 1)} />
      )}
    </div>
  );
};

Object.assign(window, { HangyeonPage });

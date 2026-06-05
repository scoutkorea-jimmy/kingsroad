// 한켠(전주) 예약 — /sleep · /hangyeon  (v00.271)
// UI: 야놀자/NOL 숙소 상세 — 입실일~퇴실일 범위 + 성인/아동 인원 + 객실 카드 + 주문 모달(간단).
// 테두리 최소화(부드러운 그림자 + 연한 구분선). 숙박(체크인~체크아웃) 기본 + 시간제 탭.

const hkToday = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const hkNowHM = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(11, 16);
const hkAddDays = (str, n) => new Date(new Date(str + 'T00:00:00Z').getTime() + n * 86400000).toISOString().slice(0, 10);
const hkNights = (a, b) => Math.max(0, Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000));
const HK_WD = ['일', '월', '화', '수', '목', '금', '토'];
const hkFmtDate = (str) => { if (!str) return ''; const d = new Date(str + 'T00:00:00Z'); return `${str.slice(0, 4)}.${str.slice(5, 7)}.${str.slice(8, 10)}(${HK_WD[d.getUTCDay()]})`; };
const hkWon = (n) => (window.BGNJ_FMT?.won ? window.BGNJ_FMT.won(n) : `${Number(n || 0).toLocaleString('ko-KR')}원`);
const hkMan = (n) => { if (n == null) return ''; const m = n / 10000; return (m >= 10 ? Math.round(m) : Math.round(m * 10) / 10) + '만'; };
const HK_HOLIDAYS = {
  '2026-01-01': '신정', '2026-02-16': '설날', '2026-02-17': '설날', '2026-02-18': '설날',
  '2026-03-01': '삼일절', '2026-05-05': '어린이날', '2026-05-24': '석가탄신일', '2026-06-06': '현충일',
  '2026-08-15': '광복절', '2026-09-24': '추석', '2026-09-25': '추석', '2026-09-26': '추석',
  '2026-10-03': '개천절', '2026-10-09': '한글날', '2026-12-25': '성탄절',
};
const hk12h = (hm) => { if (!hm) return ''; const [h, m] = hm.split(':').map(Number); const hh = h % 12 === 0 ? 12 : h % 12; return `${h < 12 ? '오전' : '오후'} ${hh}:${String(m).padStart(2, '0')}`; };
const hkAmPm = (hm) => Number(hm.slice(0, 2)) < 12;
// 부드러운 카드 (테두리 없이 그림자)
const SOFT = { background: 'var(--bg)', borderRadius: 16, boxShadow: '0 1px 2px rgba(15,23,42,0.05), 0 8px 24px rgba(15,23,42,0.05)' };
const FIELD = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg)', fontSize: 14, color: 'var(--ink)', fontFamily: 'inherit' };

// ── 듀얼 월 달력 (범위 선택, 날짜별 1박가 만원) ───────────────────────────────
const HkMiniMonth = ({ cursorYM, checkIn, checkOut, avail, today, onPick }) => {
  const year = Number(cursorYM.slice(0, 4)), month = Number(cursorYM.slice(5, 7)) - 1;
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = []; for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(`${cursorYM.slice(0, 8)}${String(d).padStart(2, '0')}`);
  const inRange = (date) => checkIn && checkOut && date > checkIn && date < checkOut;
  return (
    <div style={{ flex: 1, minWidth: 260 }}>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{year}.{String(month + 1).padStart(2, '0')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
        {HK_WD.map((w, i) => <div key={w} style={{ textAlign: 'center', fontSize: 11, padding: '4px 0', color: i === 0 ? 'var(--danger)' : i === 6 ? '#2563EB' : 'var(--ink-3)' }}>{w}</div>)}
        {cells.map((date, i) => {
          if (!date) return <div key={`e${i}`} />;
          const dow = new Date(date + 'T00:00:00Z').getUTCDay();
          const a = avail[date]; const past = date < today; const full = a && a.remaining < 1;
          const isCI = date === checkIn, isCO = date === checkOut, ranged = inRange(date);
          const holiday = HK_HOLIDAYS[date]; const disabled = past || (full && !checkIn);
          const ends = isCI || isCO;
          const color = ends ? '#fff' : disabled ? 'var(--ink-3)' : holiday || dow === 0 ? 'var(--danger)' : dow === 6 ? '#2563EB' : 'var(--ink)';
          return (
            <div key={date} style={{ display: 'flex', justifyContent: 'center', padding: '1px 0', background: ranged ? 'var(--bg-2)' : 'transparent' }}>
              <button type="button" disabled={past} onClick={() => onPick(date)}
                style={{ width: 40, height: 46, borderRadius: 11, border: 'none', cursor: past ? 'default' : 'pointer', background: ends ? 'var(--ink)' : 'transparent', color, opacity: past ? 0.35 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, fontSize: 14, fontWeight: ends ? 700 : 500 }}>
                <span>{Number(date.slice(8))}</span>
                <span style={{ fontSize: 8.5, lineHeight: 1, color: ends ? '#fff' : full ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{!past && (full ? '마감' : a && a.price != null ? hkMan(a.price) : '')}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HkDatePicker = ({ checkIn, checkOut, onApply, onClose }) => {
  const today = hkToday();
  const [base, setBase] = React.useState((checkIn || today).slice(0, 7) + '-01');
  const [avail, setAvail] = React.useState({});
  const [ci, setCi] = React.useState(checkIn);
  const [co, setCo] = React.useState(checkOut);
  React.useEffect(() => {
    let alive = true;
    window.BGNJ_HANGYEON.availability({ from: base, to: hkAddDays(base, 70) }).then((res) => {
      if (!alive) return;
      const agg = {}; const av = (res && res.availability) || {};
      Object.keys(av).forEach((rid) => (av[rid] || []).forEach((a) => { const cur = agg[a.date] || { remaining: 0, price: null }; cur.remaining += a.remaining; if (a.price != null && (cur.price == null || a.price < cur.price)) cur.price = a.price; agg[a.date] = cur; }));
      setAvail(agg);
    });
    return () => { alive = false; };
  }, [base]);
  const pick = (date) => {
    if (!ci || (ci && co) || date <= ci) { setCi(date); setCo(null); }
    else setCo(date);
  };
  const y = Number(base.slice(0, 4)), m = Number(base.slice(5, 7)) - 1;
  const nextYM = `${new Date(Date.UTC(y, m + 1, 1)).toISOString().slice(0, 8)}01`;
  const prevDisabled = base <= today.slice(0, 7) + '-01';
  const nights = ci && co ? hkNights(ci, co) : 0;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '60px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...SOFT, maxWidth: 720, width: '100%', padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <button type="button" disabled={prevDisabled} onClick={() => setBase(`${new Date(Date.UTC(y, m - 1, 1)).toISOString().slice(0, 8)}01`)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: prevDisabled ? 'default' : 'pointer', color: prevDisabled ? 'var(--line)' : 'var(--ink)' }}>‹</button>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 13 }} className="dim-2">{ci ? (co ? `${hkFmtDate(ci)} ~ ${hkFmtDate(co)} · ${nights}박` : `${hkFmtDate(ci)} · 퇴실일 선택`) : '입실일을 선택하세요'}</div>
          <button type="button" onClick={() => setBase(nextYM)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>›</button>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <HkMiniMonth cursorYM={base} checkIn={ci} checkOut={co} avail={avail} today={today} onPick={pick} />
          <HkMiniMonth cursorYM={nextYM} checkIn={ci} checkOut={co} avail={avail} today={today} onPick={pick} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line-2, var(--line))' }}>
          <span className="dim-2" style={{ fontSize: 12 }}>가격 : 1박 기준 최저가</span>
          <button type="button" className="btn btn-gold" disabled={!ci || !co} onClick={() => { onApply(ci, co); onClose(); }} style={{ opacity: (ci && co) ? 1 : 0.5 }}>적용하기</button>
        </div>
      </div>
    </div>
  );
};

// ── 인원(성인/아동) 선택 ─────────────────────────────────────────────────────
const HkStep = ({ label, value, onMinus, onPlus, min = 0 }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
    <strong style={{ fontSize: 15 }}>{label}</strong>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <button type="button" onClick={onMinus} disabled={value <= min} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--bg)', cursor: value <= min ? 'default' : 'pointer', fontSize: 18, color: value <= min ? 'var(--ink-3)' : 'var(--ink)' }}>−</button>
      <span style={{ minWidth: 20, textAlign: 'center', fontSize: 16, fontWeight: 600 }}>{value}</span>
      <button type="button" onClick={onPlus} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--bg)', cursor: 'pointer', fontSize: 18 }}>＋</button>
    </div>
  </div>
);
const HkGuestPicker = ({ adults, children, onApply, onClose }) => {
  const [a, setA] = React.useState(adults);
  const [c, setC] = React.useState(children);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '80px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...SOFT, maxWidth: 420, width: '100%', padding: 22 }}>
        <div style={{ background: 'var(--bg-2)', borderRadius: 12, padding: '14px 16px', marginBottom: 8 }}>
          <strong style={{ fontSize: 14 }}>기준인원 초과 시 추가요금이 발생할 수 있어요.</strong>
          <p className="dim" style={{ fontSize: 12.5, margin: '6px 0 0', lineHeight: 1.6 }}>객실마다 아동 입실 여부와 추가요금이 달라요. 이용 안내 및 예약 공지를 확인해 주세요.</p>
        </div>
        <HkStep label="성인" value={a} min={1} onMinus={() => setA((v) => Math.max(1, v - 1))} onPlus={() => setA((v) => Math.min(10, v + 1))} />
        <HkStep label="아동" value={c} min={0} onMinus={() => setC((v) => Math.max(0, v - 1))} onPlus={() => setC((v) => Math.min(10, v + 1))} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="button" className="btn btn-gold" onClick={() => { onApply(a, c); onClose(); }}>적용하기</button>
        </div>
      </div>
    </div>
  );
};

// ── 시간제 선택 ──────────────────────────────────────────────────────────────
const HkHourSelect = ({ roomTypeId, date, minHours, start, hours, onStart, onHours }) => {
  const [info, setInfo] = React.useState({ hours: [], minHours: minHours || 3 });
  React.useEffect(() => { let alive = true; window.BGNJ_HANGYEON.slots({ roomTypeId, date }).then((res) => { if (alive) setInfo(res || { hours: [] }); }); return () => { alive = false; }; }, [roomTypeId, date]);
  const today = hkToday(); const nowHM = hkNowHM();
  const openH = info.hours.length ? Number(info.hours[0].hour.slice(0, 2)) : 9;
  const closeH = info.hours.length ? Number(info.hours[info.hours.length - 1].hour.slice(0, 2)) + 1 : 22;
  const minH = info.minHours || minHours || 3;
  const dur = []; for (let d = minH; d <= Math.max(minH, closeH - openH); d++) dur.push(d);
  const remAt = (h) => { const s = info.hours.find((x) => x.hour === `${String(h).padStart(2, '0')}:00`); return s ? s.remaining : 0; };
  const canStart = (h) => { if (h + hours > closeH) return false; if (date === today && `${String(h).padStart(2, '0')}:00` <= nowHM) return false; for (let x = h; x < h + hours; x++) if (remAt(x) < 1) return false; return true; };
  const grp = (label, arr) => arr.length === 0 ? null : (
    <div style={{ marginBottom: 12 }}>
      <div className="dim-2" style={{ fontSize: 12, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
        {arr.map((s) => { const h = Number(s.hour.slice(0, 2)); const ok = canStart(h); const sel = start === s.hour;
          return <button key={s.hour} type="button" disabled={!ok} onClick={() => onStart(s.hour)} style={{ padding: '10px 0', borderRadius: 9, fontSize: 13, fontWeight: 600, border: `1px solid ${sel ? 'var(--ink)' : 'var(--line)'}`, background: sel ? 'var(--ink)' : 'var(--bg)', color: sel ? '#fff' : ok ? 'var(--ink)' : 'var(--ink-3)', cursor: ok ? 'pointer' : 'default', opacity: ok ? 1 : 0.4 }}>{s.hour.replace(':00', '시')}</button>; })}
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>이용 시간 (최소 {minH}시간)</strong>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {dur.map((d) => <button key={d} type="button" onClick={() => onHours(d)} style={{ minWidth: 50, padding: '8px 0', borderRadius: 9, fontSize: 13, fontWeight: 600, flex: '1 1 0', border: `1px solid ${hours === d ? 'var(--ink)' : 'var(--line)'}`, background: hours === d ? 'var(--ink)' : 'var(--bg)', color: hours === d ? '#fff' : 'var(--ink)', cursor: 'pointer' }}>{d}시간</button>)}
        </div>
      </div>
      <strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>시작 시간</strong>
      {info.hours.length === 0 ? <p className="dim" style={{ fontSize: 13 }}>이용 가능한 시간이 없습니다.</p> : <>{grp('오전', info.hours.filter((s) => hkAmPm(s.hour)))}{grp('오후', info.hours.filter((s) => !hkAmPm(s.hour)))}</>}
    </div>
  );
};

// ── 예약 주문 모달 (야놀자 주문 페이지 간단 버전) ────────────────────────────
const HkBookingModal = ({ room, checkIn, checkOut, adults, children, user, property, go, memberDiscount, onClose, onDone }) => {
  // 이용 단위 — 객실이 켠 상품만. nightly/weekly/monthly/hourly 순.
  const units = [];
  if (room.dailyEnabled) units.push('nightly');
  if (room.weeklyEnabled) units.push('weekly');
  if (room.monthlyEnabled) units.push('monthly');
  if (room.hourlyEnabled) units.push('hourly');
  const [unit, setUnit] = React.useState(units[0] || 'nightly');
  const unitLabel = (u) => u === 'nightly' ? `숙박 ${hkWon(room.dailyPrice)}~` : u === 'weekly' ? `주간 ${hkWon(room.weeklyPrice)}` : u === 'monthly' ? `월간 ${hkWon(room.monthlyPrice)}` : `시간제 ${hkWon(room.hourlyPrice)}/시간`;
  const fixedNights = unit === 'weekly' ? 7 : unit === 'monthly' ? 30 : 0;
  const [start, setStart] = React.useState(null);
  const [hours, setHours] = React.useState(room.minHours || 3);
  const [coupon, setCoupon] = React.useState('');
  const [name, setName] = React.useState(user?.name || '');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState(user?.email || '');
  const [request, setRequest] = React.useState('');
  const [agreed, setAgreed] = React.useState(false);
  const [quote, setQuote] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const guests = adults + children;
  const nights = hkNights(checkIn, checkOut);
  const fixedCheckOut = fixedNights ? hkAddDays(checkIn, fixedNights) : checkOut;
  React.useEffect(() => { setStart(null); }, [unit]);
  React.useEffect(() => {
    let alive = true;
    if (unit === 'hourly') { if (!start) { setQuote(null); return; } window.BGNJ_HANGYEON.quote({ roomTypeId: room.id, unit: 'hourly', date: checkIn, slotStart: start, hours, guests, couponCode: coupon.trim() || undefined }).then((q) => { if (alive) setQuote(q); }); }
    else if (unit === 'weekly' || unit === 'monthly') { window.BGNJ_HANGYEON.quote({ roomTypeId: room.id, unit, checkIn, rooms: 1, guests, couponCode: coupon.trim() || undefined }).then((q) => { if (alive) setQuote(q); }); }
    else { window.BGNJ_HANGYEON.quote({ roomTypeId: room.id, unit: 'nightly', checkIn, checkOut, rooms: 1, guests, couponCode: coupon.trim() || undefined }).then((q) => { if (alive) setQuote(q); }); }
    return () => { alive = false; };
  }, [unit, start, hours, coupon, room.id, checkIn, checkOut, guests]);
  const submit = async () => {
    if (!name.trim() || !phone.trim()) { window.BGNJ_TOAST?.error?.('이름과 연락처를 입력해 주세요.'); return; }
    if (!agreed) { window.BGNJ_TOAST?.error?.('개인정보 수집·이용에 동의해 주세요.'); return; }
    if (!quote?.ok) { window.BGNJ_TOAST?.error?.(quote?.reason || '예약할 수 없습니다.'); return; }
    setSubmitting(true);
    const base = { roomTypeId: room.id, guests, name: name.trim(), phone: phone.trim(), email: email.trim(), request: request.trim(), couponCode: coupon.trim() || undefined };
    const payload = unit === 'hourly' ? { ...base, unit: 'hourly', date: checkIn, slotStart: start, hours }
      : (unit === 'weekly' || unit === 'monthly') ? { ...base, unit, checkIn, rooms: 1 }
        : { ...base, unit: 'nightly', checkIn, checkOut, rooms: 1 };
    const res = await window.BGNJ_HANGYEON.book(payload); setSubmitting(false);
    if (res.ok) { window.BGNJ_TOAST?.success?.(`예약 접수 완료 (${res.booking?.code}). 입금 확인 후 확정됩니다.`); onDone && onDone(); onClose(); } else window.BGNJ_TOAST?.error?.(res.message || '예약 실패');
  };
  const cell = (label, date, time) => (
    <div style={{ flex: 1, textAlign: 'center', padding: '12px 8px' }}>
      <div className="dim-2" style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700 }}>{hkFmtDate(date)}</div>
      <div className="dim" style={{ fontSize: 13 }}>{time}</div>
    </div>
  );
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...SOFT, maxWidth: 480, width: '100%', padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px' }}>
          <h3 className="ko-serif" style={{ fontSize: 18, margin: 0 }}>{room.name}</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink-3)' }}>✕</button>
        </div>
        <div style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="dim-2" style={{ fontSize: 12.5 }}>기준 {Math.min(adults, room.maxOccupancy)}명 / 최대 {room.maxOccupancy}명 · {property?.address}</div>
          {units.length > 1 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {units.map((u) => <button key={u} type="button" onClick={() => setUnit(u)} style={{ flex: '1 1 80px', minWidth: 80, padding: '11px 8px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', background: unit === u ? 'var(--bg-2)' : 'transparent', color: unit === u ? 'var(--ink)' : 'var(--ink-3)' }}>{unitLabel(u)}</button>)}
            </div>
          )}

          {unit === 'hourly' ? (
            <HkHourSelect roomTypeId={room.id} date={checkIn} minHours={room.minHours || 3} start={start} hours={hours} onStart={setStart} onHours={setHours} />
          ) : (
            <div style={{ background: 'var(--bg-2)', borderRadius: 12, display: 'flex', alignItems: 'center' }}>
              {cell('체크인', checkIn, '15:00')}
              <span className="badge" style={{ flexShrink: 0 }}>{unit === 'nightly' ? nights : fixedNights}박</span>
              {cell('체크아웃', unit === 'nightly' ? checkOut : fixedCheckOut, '11:00')}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
            <span className="dim-2">인원</span><span>성인 {adults}{children ? `, 아동 ${children}` : ''}</span>
          </div>

          {/* 결제 금액 */}
          <div style={{ background: 'var(--bg-2)', borderRadius: 12, padding: '14px 16px' }}>
            <strong style={{ fontSize: 14 }}>결제 금액</strong>
            {quote?.ok ? (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="dim">상품 금액 {unit === 'hourly' ? `(${quote.hours}시간)` : `(${quote.nights}박)`}</span><span>{hkWon(quote.subtotal)}</span></div>
                {quote.couponDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}><span>쿠폰 {quote.couponLabel}</span><span>-{hkWon(quote.couponDiscount)}</span></div>}
                {quote.memberDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}><span>회원 할인 ({quote.memberRate}%)</span><span>-{hkWon(quote.memberDiscount)}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 4 }}><span>총 결제 금액</span><span className="ko-serif">{hkWon(quote.total)}</span></div>
              </div>
            ) : <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--danger)' }}>{quote?.reason || (unit === 'hourly' ? '시작 시간을 선택하세요' : '날짜를 확인하세요')}</p>}
            {quote?.couponError && <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--danger)' }}>{quote.couponError}</p>}
            {!user && quote?.ok && memberDiscount > 0 && (
              <div style={{ margin: '10px 0 0', padding: '10px 12px', borderRadius: 10, background: 'rgba(146,64,14,0.06)', fontSize: 12.5, lineHeight: 1.6 }}>
                💡 <strong>회원가입하면 {memberDiscount}% 할인</strong> — 회원가 <strong className="ko-serif" style={{ color: 'var(--secondary)', fontSize: 15 }}>{hkWon(Math.round(quote.total * (100 - memberDiscount) / 100))}</strong>
                <button type="button" onClick={() => go && go('signup')} style={{ marginLeft: 8, background: 'var(--secondary)', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', font: 'inherit', fontSize: 12, fontWeight: 600 }}>회원가입하고 할인받기</button>
              </div>
            )}
            {!user && quote?.ok && memberDiscount === 0 && (
              <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--secondary)' }}>💡 <strong>회원가입/로그인</strong> 시 회원 혜택이 적용됩니다.</p>
            )}
          </div>

          {/* 예약자 정보 */}
          <div>
            <strong style={{ fontSize: 14, display: 'block', marginBottom: 10 }}>예약자 정보</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input style={FIELD} placeholder="성명 *" value={name} onChange={(e) => setName(e.target.value)} />
              <input style={FIELD} placeholder="휴대폰 번호 * (010-0000-0000)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input style={FIELD} placeholder="이메일 (선택)" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div style={{ display: 'flex', gap: 10 }}>
                <input style={{ ...FIELD, flex: 1 }} placeholder="쿠폰 코드 (선택)" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
              </div>
              <textarea style={{ ...FIELD, resize: 'vertical' }} rows={2} placeholder="요청사항 (선택)" value={request} onChange={(e) => setRequest(e.target.value)} />
            </div>
          </div>

          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, cursor: 'pointer' }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 2 }} />
            <span>개인정보(이름·연락처·이메일) 수집·이용 및 예약 진행에 동의합니다. 수집한 개인정보는 <strong>1년간 보관 후 파기</strong>되며, 결제는 <strong>무통장 입금/현장 결제</strong>로 진행됩니다.</span>
          </label>
          <button type="button" className="btn btn-gold" disabled={submitting || !quote?.ok} onClick={submit} style={{ opacity: (submitting || !quote?.ok) ? 0.5 : 1, padding: '14px', fontSize: 15 }}>{submitting ? '접수 중…' : quote?.ok ? `${hkWon(quote.total)} 예약하기` : '예약하기'}</button>
        </div>
      </div>
    </div>
  );
};

// ── 이미지 갤러리 ────────────────────────────────────────────────────────────
const HkGallery = ({ images, name }) => {
  const has = images.length > 0; const big = has ? images[0] : null;
  // 작은 4장 — 대표(big) 제외 풀에서 무작위. 직전 4장과 겹치지 않게 뽑고 3초마다 슬라이드 교체.
  // pool 은 이미지 '내용'(url 시그니처) 기준으로만 재계산 — 부모가 매 렌더 새 배열([] 포함)을
  // 넘겨도 참조가 흔들려 reset effect→setSide 가 무한 렌더하는 일을 차단(빈 배열 케이스 안전).
  const sig = images.map((im) => (im && im.url) || '').join('|');
  const pool = React.useMemo(() => (has ? images.slice(1) : []), [sig]); // images/has 는 sig 와 동기 변동
  const pickNext = React.useCallback((cur) => {
    const ex = new Set((Array.isArray(cur) ? cur : []).map((x) => x.url));
    let cand = pool.filter((x) => !ex.has(x.url));
    if (cand.length < 4) cand = pool.slice(); // 풀이 작아 4장 확보 불가하면 전체에서
    const a = cand.slice(); // Fisher–Yates 셔플 후 앞 4장 (4장 모두 서로 다름)
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a.slice(0, 4);
  }, [pool]);
  const [side, setSide] = React.useState(() => pickNext([]));
  React.useEffect(() => { setSide(pickNext([])); }, [pickNext]); // 사진 풀 바뀌면 리셋
  React.useEffect(() => {
    if (pool.length <= 4) return; // 회전할 만큼 많지 않으면 고정
    const id = setInterval(() => setSide((cur) => pickNext(cur)), 3000);
    return () => clearInterval(id);
  }, [pool.length, pickNext]);
  const ph = () => window.CoverPlaceholder ? <window.CoverPlaceholder aspectRatio="1/1" iconSize={40} /> : <div style={{ background: 'var(--bg-2)', width: '100%', height: '100%' }} />;
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 24, height: 360, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ flex: '1 1 60%', background: 'var(--bg-2)', overflow: 'hidden' }}>{big ? <img src={big.url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : ph()}</div>
      <div style={{ flex: '1 1 40%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 6, position: 'relative' }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ background: 'var(--bg-2)', overflow: 'hidden' }}>{side[i] ? <img key={side[i].url} src={side[i].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', animation: 'bgnj-slide-in .55s cubic-bezier(.22,.61,.36,1) both', animationDelay: `${i * 0.07}s` }} /> : ph()}</div>)}
        {has && images.length > 1 && <span style={{ position: 'absolute', right: 12, bottom: 12, background: 'rgba(15,23,42,0.78)', color: '#fff', fontSize: 12, padding: '6px 12px', borderRadius: 999 }}>전체 사진 {images.length}</span>}
      </div>
    </div>
  );
};

// ── 객실 카드 (야놀자 스타일) ────────────────────────────────────────────────
const HkRoomCard = ({ room, onBook, memberDiscount }) => {
  const cover = (room.images || []).find((im) => im.isPrimary) || (room.images || [])[0];
  const available = room.stayAvailable || room.dayHourlyAvailable || room.weeklyAvailable || room.monthlyAvailable;
  const md = Number(memberDiscount) || 0;
  const mp = (p) => Math.round((p || 0) * (100 - md) / 100);
  // 대표 가격: 숙박 > 시간제 > 주간 > 월간. 시간제는 '최소 이용시간 × 시간당'을 기본가로(~).
  const hMin = Math.max(1, room.minHours || 1);
  const priceInfo = room.stayAvailable ? { v: room.stayTotal, label: `${room.nights}박`, suffix: '' }
    : room.dayHourlyAvailable ? { v: (room.hourlyPrice || 0) * hMin, label: `최소 ${hMin}시간`, suffix: '~' }
      : room.weeklyAvailable ? { v: room.weeklyTotal, label: '주간(7박)', suffix: '' }
        : room.monthlyAvailable ? { v: room.monthlyTotal, label: '월간(30박)', suffix: '' }
          : { v: 0, label: '', suffix: '' };
  const basePrice = priceInfo.v;
  return (
    <div style={{ ...SOFT, padding: 0, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', opacity: available ? 1 : 0.55 }}>
      <div style={{ flex: '0 0 220px', minWidth: 180, background: 'var(--bg-2)', overflow: 'hidden' }}>
        {cover ? <img src={cover.url} alt={room.name} style={{ width: '100%', height: '100%', minHeight: 170, objectFit: 'cover', display: 'block' }} /> : (window.CoverPlaceholder ? <window.CoverPlaceholder aspectRatio="4/3" iconSize={44} /> : null)}
      </div>
      <div style={{ flex: '1 1 280px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3 className="ko-serif" style={{ fontSize: 18, margin: 0 }}>{room.name}</h3>
        <div className="dim-2" style={{ fontSize: 12.5 }}>기준 {Math.min(2, room.maxOccupancy)}명 / 최대 {room.maxOccupancy}명{room.bedConfig ? ` · ${room.bedConfig}` : ''}</div>
        {room.dailyEnabled && (
          <div style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
            <span><span className="dim-2">체크인</span> 15:00</span><span className="badge">{room.nights}박</span><span><span className="dim-2">체크아웃</span> 11:00</span>
          </div>
        )}
        {room.hourlyEnabled && <div className="dim-2" style={{ fontSize: 11.5 }}>시간제 {hkWon(room.hourlyPrice)}/시간 (최소 {room.minHours}시간)</div>}
        {room.weeklyEnabled && <div className="dim-2" style={{ fontSize: 11.5 }}>주간(7박) {hkWon(room.weeklyPrice)}</div>}
        {room.monthlyEnabled && <div className="dim-2" style={{ fontSize: 11.5 }}>월간(30박) {hkWon(room.monthlyPrice)}</div>}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 12, paddingTop: 8 }}>
          {available ? (
            <div style={{ textAlign: 'right' }}>
              <div className="dim-2" style={{ fontSize: 11 }}>{priceInfo.label}</div>
              <div className="ko-serif" style={{ fontSize: md > 0 ? 16 : 22, fontWeight: 700, color: md > 0 ? 'var(--ink-3)' : 'var(--ink)', textDecoration: md > 0 ? 'line-through' : 'none' }}>
                {hkWon(basePrice)}{priceInfo.suffix}
              </div>
              {md > 0 && (
                <div style={{ marginTop: 2 }}>
                  <span style={{ fontSize: 10, color: 'var(--secondary)', fontWeight: 700, marginRight: 4 }}>회원가 -{md}%</span>
                  <span className="ko-serif" style={{ fontSize: 22, fontWeight: 700, color: 'var(--secondary)' }}>{hkWon(mp(basePrice))}{priceInfo.suffix}</span>
                </div>
              )}
            </div>
          ) : <span className="badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>예약 마감</span>}
          <button type="button" className="btn btn-gold" disabled={!available} onClick={() => onBook(room)} style={{ opacity: available ? 1 : 0.5, minWidth: 110 }}>예약하기</button>
        </div>
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
  const cancel = async (b) => { if (!(await window.BGNJ_CONFIRM(`${b.code} 예약을 취소할까요?`, { danger: true }))) return; try { await window.BGNJ_HANGYEON.cancelBooking(b.id); window.BGNJ_HANGYEON.refreshMine().then(setBookings); window.BGNJ_TOAST?.success?.('취소되었습니다.'); } catch (err) { window.BGNJ_TOAST?.error?.(err?.body?.error || '취소 실패'); } };
  const span = (b) => b.bookingUnit === 'hourly' ? `${hkFmtDate(b.checkIn)} ${hk12h(b.slotStart)}~${hk12h(b.slotEnd)}` : `${hkFmtDate(b.checkIn)} → ${hkFmtDate(b.checkOut)} · ${b.nights}박`;
  if (!loaded || bookings.length === 0) return null;
  return (
    <div style={{ ...SOFT, padding: 22, marginTop: 28 }}>
      <h2 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>내 예약</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
        {bookings.map((b) => (
          <div key={b.id} style={{ background: 'var(--bg-2)', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="mono dim-2" style={{ fontSize: 11 }}>{b.code}</span>
              <div style={{ display: 'flex', gap: 6 }}><span className="badge">{HK_STATUS_LABEL[b.status] || b.status}</span><span className="badge">{HK_PAY_LABEL[b.paymentStatus] || b.paymentStatus}</span></div>
            </div>
            <h3 className="ko-serif" style={{ fontSize: 16, marginBottom: 6 }}>{b.roomTypeName}</h3>
            <p className="dim" style={{ fontSize: 13, margin: '0 0 6px' }}>{span(b)} · {b.guests}명</p>
            <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 10px' }}>{hkWon(b.totalPrice)}</p>
            {['pending', 'confirmed'].includes(b.status) && <button type="button" className="btn btn-small" onClick={() => cancel(b)}>예약 취소</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

const HK_TABS = [['rooms', '객실선택'], ['loc', '위치/교통'], ['about', '숙소소개'], ['fac', '시설/서비스'], ['guide', '이용안내']];

const HangyeonPage = ({ go, user }) => {
  const [tick, setTick] = React.useState(0);
  const [checkIn, setCheckIn] = React.useState(hkToday());
  const [checkOut, setCheckOut] = React.useState(hkAddDays(hkToday(), 1));
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [dayRooms, setDayRooms] = React.useState([]);
  const [dayLoading, setDayLoading] = React.useState(true);
  const [booking, setBooking] = React.useState(null);
  const [pickDate, setPickDate] = React.useState(false);
  const [pickGuest, setPickGuest] = React.useState(false);
  const [scTick, setScTick] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('rooms');
  const refs = { rooms: React.useRef(null), loc: React.useRef(null), about: React.useRef(null), fac: React.useRef(null), guide: React.useRef(null) };
  React.useEffect(() => { const onR = () => setScTick((v) => v + 1); window.addEventListener('bgnj-site-content-refresh', onR); return () => window.removeEventListener('bgnj-site-content-refresh', onR); }, []);
  React.useEffect(() => { let alive = true; setDayLoading(true); window.BGNJ_HANGYEON.day({ from: checkIn, to: checkOut }).then((rooms) => { if (alive) { setDayRooms(rooms); setDayLoading(false); } }); return () => { alive = false; }; }, [checkIn, checkOut, tick]);

  const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
  const info = sc.hangyeon || {};
  const name = info.name || '전주한켠';
  const tagline = info.tagline || '전주 도심 속, 조용한 하룻밤';
  const desc = info.desc || "전주 전자상가 뒤편 조용한 주택가에 자리한 공간 ‘한켠’.";
  const address = info.address || '전북 전주시 덕진구 팔달로 340-37';
  const directions = info.directions || '전주역에서 차량 10분, 전주 고속버스터미널에서 도보 15분. 한옥마을·자만벽화마을·경기전·풍남문까지 차량 5~10분.';
  // 위치/교통 OSM 지도 — 좌표는 admin(숙소 정보)에서 설정. 미설정 시 팔달로 기준 기본값.
  const lat = Number(info.lat) || 35.8313;
  const lng = Number(info.lng) || 127.1386;
  const mapD = 0.0045; // bbox 반경 ≈ 거리뷰 수준 줌
  const osmBbox = `${(lng - mapD).toFixed(6)},${(lat - mapD).toFixed(6)},${(lng + mapD).toFixed(6)},${(lat + mapD).toFixed(6)}`;
  const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(osmBbox)}&layer=mapnik&marker=${lat},${lng}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  const images = Array.isArray(info.images) ? info.images : [];
  const memberDiscount = Number(info.memberDiscount) || 0; // 비회원에게도 회원가 노출(가입 유도)
  const property = { name, address, directions, notice: info.notice };
  const amenities = Array.from(new Set(dayRooms.flatMap((r) => r.amenities || [])));
  const openClose = dayRooms.find((r) => r.hourlyEnabled);
  const nights = hkNights(checkIn, checkOut);
  const scrollTo = (k) => { setActiveTab(k); const el = refs[k].current; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const datePill = { flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px', cursor: 'pointer', fontSize: 15, fontWeight: 600, background: 'none', border: 'none', color: 'var(--ink)' };

  return (
    <div className="section" style={{ paddingTop: 0 }}>
      <div className="container" style={{ maxWidth: 1080 }}>
        {/* 상단 날짜·인원 바 */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '24px 0 22px' }}>
          <div style={{ ...SOFT, flex: '2 1 360px', display: 'flex', alignItems: 'center' }}>
            <button type="button" style={datePill} onClick={() => setPickDate(true)}>📅 <span>{hkFmtDate(checkIn)}</span></button>
            <span className="badge" style={{ flexShrink: 0 }}>{nights}박</span>
            <button type="button" style={{ ...datePill, justifyContent: 'flex-end' }} onClick={() => setPickDate(true)}><span>{hkFmtDate(checkOut)}</span> 📅</button>
          </div>
          <button type="button" style={{ ...SOFT, flex: '1 1 220px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 18px', cursor: 'pointer', fontSize: 15, fontWeight: 600, border: 'none', color: 'var(--ink)' }} onClick={() => setPickGuest(true)}>
            👤 성인 {adults}{children ? `, 아동 ${children}` : ', 아동 0'}
          </button>
        </div>

        <HkGallery images={images} name={name} />

        <div style={{ marginBottom: 18 }}>
          <h1 className="ko-serif" style={{ fontSize: 28, margin: '0 0 6px' }}>{name}</h1>
          <p className="dim" style={{ margin: 0, fontSize: 14 }}>{tagline} · <button type="button" onClick={() => scrollTo('loc')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--secondary)', cursor: 'pointer', font: 'inherit' }}>위치 보기</button></p>
        </div>

        {/* 탭 내비 */}
        <div style={{ position: 'sticky', top: 64, zIndex: 40, background: 'var(--bg)', borderBottom: '1px solid var(--line-2, var(--line))', display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto' }}>
          {HK_TABS.map(([k, label]) => <button key={k} type="button" onClick={() => scrollTo(k)} style={{ padding: '14px 16px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === k ? 'var(--ink)' : 'transparent'}`, color: activeTab === k ? 'var(--ink)' : 'var(--ink-3)', fontWeight: activeTab === k ? 700 : 500, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>)}
        </div>

        {/* 객실 선택 */}
        <section ref={refs.rooms} style={{ scrollMarginTop: 120, marginBottom: 44 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 4 }}>객실 선택</h2>
          <p className="dim-2" style={{ fontSize: 13, marginBottom: 18 }}>{hkFmtDate(checkIn)} → {hkFmtDate(checkOut)} · {nights}박 · 성인 {adults}{children ? `·아동 ${children}` : ''}</p>
          {dayLoading ? <div style={{ ...SOFT, padding: 40, textAlign: 'center' }}><p className="dim" style={{ margin: 0 }}>불러오는 중…</p></div>
            : dayRooms.length === 0 ? <div style={{ ...SOFT, padding: 50, textAlign: 'center' }}><p className="dim" style={{ margin: 0 }}>등록된 객실이 없습니다.</p></div>
              : dayRooms.every((r) => !(r.stayAvailable || r.dayHourlyAvailable)) ? (
                <div style={{ ...SOFT, padding: 50, textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600 }}>예약할 수 있는 객실이 없어요</p>
                  <p className="dim" style={{ margin: '0 0 18px', fontSize: 13 }}>날짜를 변경해 주세요</p>
                  <button type="button" className="btn" onClick={() => setPickDate(true)}>날짜 변경하기</button>
                </div>
              ) : <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{dayRooms.map((rm) => <HkRoomCard key={rm.id} room={rm} onBook={setBooking} memberDiscount={memberDiscount} />)}</div>}
        </section>

        <section ref={refs.loc} style={{ scrollMarginTop: 120, marginBottom: 44 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 14 }}>위치/교통</h2>
          <div style={{ ...SOFT, padding: '18px 20px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>📍 {address}</div>
            <p className="dim" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8 }}>{directions}</p>
            <div style={{ marginTop: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--bg-2)' }}>
              <iframe title={`${name} 위치 지도`} src={osmEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: '100%', height: 320, border: 0, display: 'block' }} />
            </div>
            <a href={osmLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 8, fontSize: 12.5, color: 'var(--secondary)', textDecoration: 'none' }}>큰 지도에서 보기 ↗</a>
          </div>
        </section>

        <section ref={refs.about} style={{ scrollMarginTop: 120, marginBottom: 44 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 14 }}>숙소소개</h2>
          <div style={{ ...SOFT, padding: '18px 20px' }}><p className="dim" style={{ margin: 0, fontSize: 14, lineHeight: 1.9 }}>{desc}</p>{info.notice && <p className="dim" style={{ margin: '10px 0 0', fontSize: 13 }}>{info.notice}</p>}</div>
        </section>

        <section ref={refs.fac} style={{ scrollMarginTop: 120, marginBottom: 44 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 14 }}>시설/서비스</h2>
          <div style={{ ...SOFT, padding: '18px 20px' }}>
            {amenities.length === 0 ? <p className="dim" style={{ margin: 0, fontSize: 13 }}>등록된 편의시설 정보가 없습니다.</p>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>{amenities.map((a) => <div key={a} style={{ fontSize: 13.5 }}><span style={{ color: 'var(--success)', marginRight: 6 }}>✓</span>{a}</div>)}</div>}
          </div>
        </section>

        <section ref={refs.guide} style={{ scrollMarginTop: 120, marginBottom: 20 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 14 }}>이용안내</h2>
          <div style={{ ...SOFT, padding: '18px 20px', fontSize: 13.5, lineHeight: 2 }}>
            <div><strong>체크인</strong> 15:00 · <strong>체크아웃</strong> 11:00</div>
            {openClose && <div><strong>시간제 운영</strong> {openClose.openTime} ~ {openClose.closeTime} (최소 {openClose.minHours}시간)</div>}
            <div><strong>결제</strong> 무통장 입금 또는 현장 결제 — 입금 확인 시 예약 확정</div>
            <div><strong>예약 취소</strong> 아래 ‘내 예약’에서 가능 (체크인 전)</div>
          </div>
        </section>

        <HkMyBookings tick={tick} />
      </div>

      {pickDate && <HkDatePicker checkIn={checkIn} checkOut={checkOut} onApply={(ci, co) => { setCheckIn(ci); setCheckOut(co); }} onClose={() => setPickDate(false)} />}
      {pickGuest && <HkGuestPicker adults={adults} children={children} onApply={(a, c) => { setAdults(a); setChildren(c); }} onClose={() => setPickGuest(false)} />}
      {booking && <HkBookingModal room={booking} checkIn={checkIn} checkOut={checkOut} adults={adults} children={children} user={user} property={property} go={go} memberDiscount={memberDiscount} onClose={() => setBooking(null)} onDone={() => setTick((v) => v + 1)} />}
    </div>
  );
};

Object.assign(window, { HangyeonPage });

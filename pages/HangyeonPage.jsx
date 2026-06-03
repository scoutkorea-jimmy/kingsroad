// 한켠(전주) 예약 — /sleep · /hangyeon  (v00.270)
// UI: 야놀자/NOL 숙소 상세 스타일 — 상단 날짜·인원 바 + 이미지 갤러리 + 탭 내비 +
// 객실선택 리스트 + 위치/숙소소개/시설/이용안내 섹션 + 듀얼 월 달력.
// 예약: 객실마다 시간당(최소 N시간) + 하루 단위. D1: window.BGNJ_HANGYEON.

const hkToday = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const hkNowHM = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(11, 16);
const hkAddDays = (str, n) => new Date(new Date(str + 'T00:00:00Z').getTime() + n * 86400000).toISOString().slice(0, 10);
const HK_WD = ['일', '월', '화', '수', '목', '금', '토'];
const hkFmtDate = (str) => { if (!str) return ''; const d = new Date(str + 'T00:00:00Z'); return `${str.slice(0, 4)}.${str.slice(5, 7)}.${str.slice(8, 10)}(${HK_WD[d.getUTCDay()]})`; };
const hkShortDate = (str) => { if (!str) return ''; const d = new Date(str + 'T00:00:00Z'); return `${Number(str.slice(5, 7))}.${Number(str.slice(8, 10))}(${HK_WD[d.getUTCDay()]})`; };
const hkWon = (n) => (window.BGNJ_FMT?.won ? window.BGNJ_FMT.won(n) : `${Number(n || 0).toLocaleString('ko-KR')}원`);
const hkManwon = (n) => { const m = (n || 0) / 10000; return (Math.round(m * 10) / 10) + '만'; };
const HK_HOLIDAYS = {
  '2026-01-01': '신정', '2026-02-16': '설날', '2026-02-17': '설날', '2026-02-18': '설날',
  '2026-03-01': '삼일절', '2026-05-05': '어린이날', '2026-05-24': '석가탄신일', '2026-06-06': '현충일',
  '2026-08-15': '광복절', '2026-09-24': '추석', '2026-09-25': '추석', '2026-09-26': '추석',
  '2026-10-03': '개천절', '2026-10-09': '한글날', '2026-12-25': '성탄절',
};
const hk12h = (hm) => { if (!hm) return ''; const [h, m] = hm.split(':').map(Number); const hh = h % 12 === 0 ? 12 : h % 12; return `${h < 12 ? '오전' : '오후'} ${hh}:${String(m).padStart(2, '0')}`; };
const hkAmPm = (hm) => Number(hm.slice(0, 2)) < 12;

// ── 듀얼 월 달력 (야놀자 스타일, 날짜별 잔여) ─────────────────────────────────
const HkMiniMonth = ({ cursorYM, value, avail, today, onPick }) => {
  const year = Number(cursorYM.slice(0, 4)), month = Number(cursorYM.slice(5, 7)) - 1;
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = []; for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${cursorYM.slice(0, 8)}${String(d).padStart(2, '0')}`);
  return (
    <div style={{ flex: 1, minWidth: 280 }}>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{year}.{String(month + 1).padStart(2, '0')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', rowGap: 2 }}>
        {HK_WD.map((w, i) => <div key={w} style={{ textAlign: 'center', fontSize: 11, padding: '4px 0', color: i === 0 ? 'var(--danger)' : i === 6 ? '#2563EB' : 'var(--ink-3)' }}>{w}</div>)}
        {cells.map((date, i) => {
          if (!date) return <div key={`e${i}`} />;
          const dow = new Date(date + 'T00:00:00Z').getUTCDay();
          const rem = avail[date]; const past = date < today; const full = rem != null && rem < 1;
          const sel = date === value; const holiday = HK_HOLIDAYS[date]; const isToday = date === today;
          const disabled = past || full;
          const color = sel ? '#fff' : disabled ? 'var(--ink-3)' : holiday || dow === 0 ? 'var(--danger)' : dow === 6 ? '#2563EB' : 'var(--ink)';
          return (
            <div key={date} style={{ display: 'flex', justifyContent: 'center', padding: '1px 0' }}>
              <button type="button" disabled={disabled} onClick={() => onPick(date)}
                style={{
                  width: 38, height: 44, borderRadius: 10, border: 'none', cursor: disabled ? 'default' : 'pointer',
                  background: sel ? 'var(--ink)' : isToday ? 'var(--bg-2)' : 'transparent', color, opacity: past ? 0.35 : 1,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, fontSize: 13.5, fontWeight: sel ? 700 : 500,
                }}>
                <span>{Number(date.slice(8))}</span>
                {!past && rem != null && <span style={{ fontSize: 8, lineHeight: 1, color: sel ? '#fff' : full ? 'var(--danger)' : 'var(--ink-3)' }}>{full ? '마감' : `${rem}`}</span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HkDatePicker = ({ value, onApply, onClose }) => {
  const today = hkToday();
  const [base, setBase] = React.useState(value ? value.slice(0, 7) + '-01' : today.slice(0, 7) + '-01');
  const [avail, setAvail] = React.useState({});
  const [sel, setSel] = React.useState(value);
  React.useEffect(() => {
    let alive = true;
    window.BGNJ_HANGYEON.availability({ from: base, to: hkAddDays(base, 70) }).then((res) => {
      if (!alive) return;
      const agg = {}; const av = (res && res.availability) || {};
      Object.keys(av).forEach((rid) => (av[rid] || []).forEach((a) => { agg[a.date] = (agg[a.date] || 0) + a.remaining; }));
      setAvail(agg);
    });
    return () => { alive = false; };
  }, [base]);
  const y = Number(base.slice(0, 4)), m = Number(base.slice(5, 7)) - 1;
  const nextYM = `${new Date(Date.UTC(y, m + 1, 1)).toISOString().slice(0, 8)}01`;
  const prevDisabled = base <= today.slice(0, 7) + '-01';
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '60px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ maxWidth: 720, width: '100%', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <button type="button" disabled={prevDisabled} onClick={() => setBase(`${new Date(Date.UTC(y, m - 1, 1)).toISOString().slice(0, 8)}01`)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: prevDisabled ? 'default' : 'pointer', color: prevDisabled ? 'var(--line)' : 'var(--ink)' }}>‹</button>
          <div style={{ flex: 1 }} />
          <button type="button" onClick={() => setBase(nextYM)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>›</button>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <HkMiniMonth cursorYM={base} value={sel} avail={avail} today={today} onPick={setSel} />
          <HkMiniMonth cursorYM={nextYM} value={sel} avail={avail} today={today} onPick={setSel} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
          <span className="dim-2" style={{ fontSize: 12 }}>숫자는 예약 가능 객실 수입니다.</span>
          <button type="button" className="btn btn-gold" disabled={!sel} onClick={() => { onApply(sel); onClose(); }} style={{ opacity: sel ? 1 : 0.5 }}>적용하기</button>
        </div>
      </div>
    </div>
  );
};

// ── 인원 pill (모달 내) ──────────────────────────────────────────────────────
const HkPeoplePills = ({ max, value, onChange }) => (
  <div>
    <strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>인원</strong>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {Array.from({ length: Math.max(1, max) }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}
          style={{ minWidth: 54, padding: '10px 0', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, flex: '1 1 0', border: `1px solid ${value === n ? 'var(--ink)' : 'var(--line)'}`, background: value === n ? 'var(--ink)' : 'var(--bg)', color: value === n ? '#fff' : 'var(--ink)' }}>{n}명</button>
      ))}
    </div>
  </div>
);

// ── 시간당 선택 ──────────────────────────────────────────────────────────────
const HkHourSelect = ({ roomTypeId, date, minHours, start, hours, onStart, onHours }) => {
  const [info, setInfo] = React.useState({ hours: [], minHours: minHours || 3 });
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    let alive = true; setLoading(true);
    window.BGNJ_HANGYEON.slots({ roomTypeId, date }).then((res) => { if (alive) { setInfo(res || { hours: [] }); setLoading(false); } });
    return () => { alive = false; };
  }, [roomTypeId, date]);
  const today = hkToday(); const nowHM = hkNowHM();
  const openH = info.hours.length ? Number(info.hours[0].hour.slice(0, 2)) : 9;
  const closeH = info.hours.length ? Number(info.hours[info.hours.length - 1].hour.slice(0, 2)) + 1 : 22;
  const minH = info.minHours || minHours || 3;
  const durOptions = []; for (let d = minH; d <= Math.max(minH, closeH - openH); d++) durOptions.push(d);
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
          {durOptions.map((d) => <button key={d} type="button" onClick={() => onHours(d)} style={{ minWidth: 50, padding: '8px 0', borderRadius: 9, fontSize: 13, fontWeight: 600, flex: '1 1 0', border: `1px solid ${hours === d ? 'var(--ink)' : 'var(--line)'}`, background: hours === d ? 'var(--ink)' : 'var(--bg)', color: hours === d ? '#fff' : 'var(--ink)', cursor: 'pointer' }}>{d}시간</button>)}
        </div>
      </div>
      <strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>시작 시간</strong>
      {loading ? <p className="dim" style={{ fontSize: 13 }}>불러오는 중…</p> : info.hours.length === 0 ? <p className="dim" style={{ fontSize: 13 }}>이용 가능한 시간이 없습니다.</p> : <>{grp('오전', info.hours.filter((s) => hkAmPm(s.hour)))}{grp('오후', info.hours.filter((s) => !hkAmPm(s.hour)))}</>}
    </div>
  );
};

// ── 예약 모달 ─────────────────────────────────────────────────────────────
const HkBookingModal = ({ room, date, defaultGuests, user, property, onClose, onDone }) => {
  const units = []; if (room.hourlyEnabled) units.push('hourly'); if (room.dailyEnabled) units.push('daily');
  const [unit, setUnit] = React.useState(units[0] || 'daily');
  const [guests, setGuests] = React.useState(Math.min(defaultGuests || 1, room.maxOccupancy || 2));
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
  React.useEffect(() => { setStart(null); }, [unit]);
  React.useEffect(() => {
    let alive = true;
    if (unit === 'hourly') { if (!start) { setQuote(null); return; } window.BGNJ_HANGYEON.quote({ roomTypeId: room.id, unit: 'hourly', date, slotStart: start, hours, guests, couponCode: coupon.trim() || undefined }).then((q) => { if (alive) setQuote(q); }); }
    else { window.BGNJ_HANGYEON.quote({ roomTypeId: room.id, unit: 'daily', date, guests, couponCode: coupon.trim() || undefined }).then((q) => { if (alive) setQuote(q); }); }
    return () => { alive = false; };
  }, [unit, start, hours, guests, coupon, room.id, date]);
  const submit = async () => {
    if (!name.trim() || !phone.trim()) { window.BGNJ_TOAST?.error?.('이름과 연락처를 입력해 주세요.'); return; }
    if (!agreed) { window.BGNJ_TOAST?.error?.('개인정보 수집·이용에 동의해 주세요.'); return; }
    if (!quote?.ok) { window.BGNJ_TOAST?.error?.(quote?.reason || '예약할 수 없습니다.'); return; }
    setSubmitting(true);
    const payload = unit === 'hourly'
      ? { roomTypeId: room.id, unit: 'hourly', date, slotStart: start, hours, guests, name: name.trim(), phone: phone.trim(), email: email.trim(), request: request.trim(), couponCode: coupon.trim() || undefined }
      : { roomTypeId: room.id, unit: 'daily', date, guests, name: name.trim(), phone: phone.trim(), email: email.trim(), request: request.trim(), couponCode: coupon.trim() || undefined };
    const res = await window.BGNJ_HANGYEON.book(payload); setSubmitting(false);
    if (res.ok) { window.BGNJ_TOAST?.success?.(`예약 접수 완료 (${res.booking?.code}). 입금 확인 후 확정됩니다.`); onDone && onDone(); onClose(); } else window.BGNJ_TOAST?.error?.(res.message || '예약 실패');
  };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ maxWidth: 500, width: '100%', padding: 0, background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
          <div><h3 className="ko-serif" style={{ fontSize: 18, margin: 0 }}>{room.name}</h3><span className="dim-2" style={{ fontSize: 12 }}>{hkFmtDate(date)} 예약</span></div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink-3)' }}>✕</button>
        </div>
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {units.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {units.map((u) => <button key={u} type="button" onClick={() => setUnit(u)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: `1px solid ${unit === u ? 'var(--ink)' : 'var(--line)'}`, background: unit === u ? 'var(--bg-2)' : 'var(--bg)', color: 'var(--ink)' }}>{u === 'hourly' ? `시간제 (${hkWon(room.hourlyPrice)}/시간)` : `하루 (${hkWon(room.dailyPrice)})`}</button>)}
            </div>
          )}
          <HkPeoplePills max={room.maxOccupancy || 2} value={guests} onChange={setGuests} />
          {unit === 'hourly' ? <HkHourSelect roomTypeId={room.id} date={date} minHours={room.minHours || 3} start={start} hours={hours} onStart={setStart} onHours={setHours} /> : <div className="card" style={{ padding: '12px 16px', background: 'var(--bg-2)', fontSize: 13 }}>하루(전일) 이용 — <strong>{hkFmtDate(date)}</strong></div>}
          {quote && (
            <div className="card" style={{ padding: '14px 16px' }}>
              {quote.ok ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="dim">{unit === 'hourly' ? `${hk12h(quote.slotStart)}~${hk12h(quote.slotEnd)} (${quote.hours}시간)` : '하루 이용'}</span><span>{hkWon(quote.subtotal)}</span></div>
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
            <label style={{ fontSize: 12 }}>쿠폰<input className="field-input" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="(선택)" /></label>
          </div>
          <label style={{ fontSize: 12 }}>요청사항<textarea className="field-input" rows={2} value={request} onChange={(e) => setRequest(e.target.value)} /></label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, cursor: 'pointer' }}><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 2 }} /><span>예약을 위한 <strong>개인정보 수집·이용</strong>에 동의합니다.</span></label>
          <div className="card" style={{ padding: '10px 14px', background: 'var(--bg-2)', fontSize: 12 }}><strong>결제 안내</strong> — 접수 후 <strong>무통장 입금</strong> 또는 <strong>현장 결제</strong>. 입금 확인 시 확정됩니다.</div>
          <button type="button" className="btn btn-gold" disabled={submitting || !quote?.ok} onClick={submit} style={{ opacity: (submitting || !quote?.ok) ? 0.5 : 1 }}>{submitting ? '접수 중…' : quote?.ok ? `${hkWon(quote.total)} 예약 접수하기` : '예약하기'}</button>
        </div>
      </div>
    </div>
  );
};

// ── 이미지 갤러리 (대표 1 + 썸네일 4) ────────────────────────────────────────
const HkGallery = ({ images, name }) => {
  const has = images.length > 0;
  const big = has ? images[0] : null;
  const side = has ? images.slice(1, 5) : [];
  const ph = (h) => window.CoverPlaceholder ? <window.CoverPlaceholder aspectRatio="1/1" iconSize={40} /> : <div style={{ background: 'var(--bg-2)', width: '100%', height: '100%' }} />;
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 28, height: 380, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ flex: '1 1 60%', background: 'var(--bg-2)', overflow: 'hidden' }}>
        {big ? <img src={big.url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : ph()}
      </div>
      <div style={{ flex: '1 1 40%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, position: 'relative' }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ background: 'var(--bg-2)', overflow: 'hidden' }}>
            {side[i] ? <img src={side[i].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : ph()}
          </div>
        ))}
        {has && images.length > 1 && (
          <span style={{ position: 'absolute', right: 12, bottom: 12, background: 'rgba(15,23,42,0.78)', color: '#fff', fontSize: 12, padding: '6px 12px', borderRadius: 999 }}>전체 사진 {images.length}</span>
        )}
      </div>
    </div>
  );
};

// ── 야놀자 스타일 객실 카드 ─────────────────────────────────────────────────
const HkRoomCard = ({ room, onBook }) => {
  const cover = (room.images || []).find((im) => im.isPrimary) || (room.images || [])[0];
  const available = room.dayHourlyAvailable || room.dayDailyAvailable;
  const lowest = Math.min(...[room.hourlyEnabled ? room.hourlyPrice : null, room.dailyEnabled ? room.dailyPrice : null].filter((x) => x != null && x !== undefined));
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', opacity: available ? 1 : 0.6 }}>
      <div style={{ flex: '0 0 200px', minWidth: 160, background: 'var(--bg-2)', overflow: 'hidden' }}>
        {cover ? <img src={cover.url} alt={room.name} style={{ width: '100%', height: '100%', minHeight: 150, objectFit: 'cover', display: 'block' }} /> : (window.CoverPlaceholder ? <window.CoverPlaceholder aspectRatio="4/3" iconSize={44} /> : null)}
      </div>
      <div style={{ flex: '1 1 280px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 className="ko-serif" style={{ fontSize: 18, margin: 0 }}>{room.name}</h3>
        <div className="dim-2" style={{ fontSize: 12.5 }}>최대 {room.maxOccupancy}인 {room.bedConfig ? `· ${room.bedConfig}` : ''}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
          {room.hourlyEnabled && <span className="badge" style={{ fontSize: 10 }}>시간제 {hkWon(room.hourlyPrice)}/시간</span>}
          {room.dailyEnabled && <span className="badge" style={{ fontSize: 10 }}>하루 {hkWon(room.dailyPrice)}</span>}
        </div>
        {room.description && <p className="dim" style={{ fontSize: 12.5, lineHeight: 1.5, margin: '2px 0 0' }}>{room.description}</p>}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 12, gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            {available ? <><span className="dim-2" style={{ fontSize: 11 }}>최저</span><div className="ko-serif" style={{ fontSize: 22, fontWeight: 700 }}>{hkWon(lowest)}~</div></>
              : <span className="badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>예약 마감</span>}
          </div>
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
  const span = (b) => b.bookingUnit === 'hourly' ? `${hkFmtDate(b.checkIn)} ${hk12h(b.slotStart)}~${hk12h(b.slotEnd)}` : b.bookingUnit === 'daily' ? `${hkFmtDate(b.checkIn)} 하루` : `${hkFmtDate(b.checkIn)} → ${hkFmtDate(b.checkOut)} · ${b.nights}박`;
  if (!loaded || bookings.length === 0) return null;
  return (
    <div className="card" style={{ padding: 22, marginTop: 28 }}>
      <h2 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>내 예약</h2>
      <div className="grid grid-2">
        {bookings.map((b) => (
          <div key={b.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="mono dim-2" style={{ fontSize: 11 }}>{b.code}</span>
              <div style={{ display: 'flex', gap: 6 }}><span className="badge">{HK_STATUS_LABEL[b.status] || b.status}</span><span className="badge" style={{ borderColor: 'var(--line)' }}>{HK_PAY_LABEL[b.paymentStatus] || b.paymentStatus}</span></div>
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
  const [selDate, setSelDate] = React.useState(hkToday());
  const [guests, setGuests] = React.useState(2);
  const [dayRooms, setDayRooms] = React.useState([]);
  const [dayLoading, setDayLoading] = React.useState(true);
  const [booking, setBooking] = React.useState(null);
  const [pickDate, setPickDate] = React.useState(false);
  const [scTick, setScTick] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('rooms');
  const refs = { rooms: React.useRef(null), loc: React.useRef(null), about: React.useRef(null), fac: React.useRef(null), guide: React.useRef(null) };

  React.useEffect(() => {
    const onR = () => setScTick((v) => v + 1);
    window.addEventListener('bgnj-site-content-refresh', onR);
    return () => window.removeEventListener('bgnj-site-content-refresh', onR);
  }, []);
  React.useEffect(() => {
    let alive = true; setDayLoading(true);
    window.BGNJ_HANGYEON.day(selDate).then((rooms) => { if (alive) { setDayRooms(rooms); setDayLoading(false); } });
    return () => { alive = false; };
  }, [selDate, tick]);

  const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
  const info = sc.hangyeon || {};
  const name = info.name || '전주한켠';
  const tagline = info.tagline || '전주 도심 속, 조용한 하룻밤';
  const desc = info.desc || "전주 전자상가 뒤편 조용한 주택가에 자리한 공간 ‘한켠’. 시간 단위로도, 하루 단위로도 머물 수 있습니다.";
  const address = info.address || '전북 전주시 덕진구 팔달로 340-37';
  const directions = info.directions || '전주역에서 차량 10분, 전주 고속버스터미널에서 도보 15분. 한옥마을·자만벽화마을·경기전·풍남문까지 차량 5~10분.';
  const images = Array.isArray(info.images) ? info.images : [];
  const property = { name, address, directions, notice: info.notice };

  // 시설 = 객실 편의시설 합집합
  const amenities = Array.from(new Set(dayRooms.flatMap((r) => r.amenities || [])));
  const openClose = dayRooms.find((r) => r.hourlyEnabled);

  const scrollTo = (key) => { setActiveTab(key); const el = refs[key].current; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return (
    <div className="section" style={{ paddingTop: 0 }}>
      <div className="container" style={{ maxWidth: 1080 }}>
        {/* 상단 날짜·인원 바 */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '24px 0 20px' }}>
          <button type="button" onClick={() => setPickDate(true)}
            style={{ flex: '2 1 320px', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--bg)', cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
            📅 <span>{hkFmtDate(selDate)}</span><span className="dim-2" style={{ fontSize: 12, fontWeight: 500 }}>· 날짜 변경</span>
          </button>
          <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 20px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--bg)' }}>
            <span style={{ fontSize: 14 }}>👤 인원 {guests}명</span>
            <span style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="btn btn-small" onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
              <button type="button" className="btn btn-small" onClick={() => setGuests((g) => Math.min(10, g + 1))}>＋</button>
            </span>
          </div>
        </div>

        <HkGallery images={images} name={name} />

        {/* 타이틀 */}
        <div style={{ marginBottom: 18 }}>
          <h1 className="ko-serif" style={{ fontSize: 28, margin: '0 0 6px' }}>{name}</h1>
          <p className="dim" style={{ margin: 0, fontSize: 14 }}>{tagline} · <button type="button" onClick={() => scrollTo('loc')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--secondary)', cursor: 'pointer', font: 'inherit', textDecoration: 'underline' }}>위치 보기</button></p>
        </div>

        {/* 탭 내비 (sticky) */}
        <div style={{ position: 'sticky', top: 64, zIndex: 40, background: 'var(--bg)', borderBottom: '1px solid var(--line)', display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto' }}>
          {HK_TABS.map(([k, label]) => (
            <button key={k} type="button" onClick={() => scrollTo(k)}
              style={{ padding: '14px 16px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === k ? 'var(--ink)' : 'transparent'}`, color: activeTab === k ? 'var(--ink)' : 'var(--ink-3)', fontWeight: activeTab === k ? 700 : 500, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>
          ))}
        </div>

        {/* 객실 선택 */}
        <section ref={refs.rooms} style={{ scrollMarginTop: 120, marginBottom: 40 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 4 }}>객실 선택</h2>
          <p className="dim-2" style={{ fontSize: 13, marginBottom: 18 }}>{hkFmtDate(selDate)} 기준</p>
          {dayLoading ? <div className="card" style={{ padding: 40, textAlign: 'center' }}><p className="dim" style={{ margin: 0 }}>불러오는 중…</p></div>
            : dayRooms.length === 0 ? <div className="card" style={{ padding: 50, textAlign: 'center' }}><p className="dim" style={{ margin: 0 }}>등록된 객실이 없습니다.</p></div>
              : dayRooms.every((r) => !(r.dayHourlyAvailable || r.dayDailyAvailable)) ? (
                <div className="card" style={{ padding: 50, textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600 }}>예약할 수 있는 객실이 없어요</p>
                  <p className="dim" style={{ margin: '0 0 18px', fontSize: 13 }}>날짜를 변경해 주세요</p>
                  <button type="button" className="btn" onClick={() => setPickDate(true)}>날짜 변경하기</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {dayRooms.map((rm) => <HkRoomCard key={rm.id} room={rm} onBook={setBooking} />)}
                </div>
              )}
        </section>

        {/* 위치/교통 */}
        <section ref={refs.loc} style={{ scrollMarginTop: 120, marginBottom: 40 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 14 }}>위치/교통</h2>
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>📍 {address}</div>
            <p className="dim" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8 }}>{directions}</p>
          </div>
        </section>

        {/* 숙소소개 */}
        <section ref={refs.about} style={{ scrollMarginTop: 120, marginBottom: 40 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 14 }}>숙소소개</h2>
          <div className="card" style={{ padding: '18px 20px' }}><p className="dim" style={{ margin: 0, fontSize: 14, lineHeight: 1.9 }}>{desc}</p>{info.notice && <p className="dim" style={{ margin: '10px 0 0', fontSize: 13 }}>{info.notice}</p>}</div>
        </section>

        {/* 시설/서비스 */}
        <section ref={refs.fac} style={{ scrollMarginTop: 120, marginBottom: 40 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 14 }}>시설/서비스</h2>
          <div className="card" style={{ padding: '18px 20px' }}>
            {amenities.length === 0 ? <p className="dim" style={{ margin: 0, fontSize: 13 }}>등록된 편의시설 정보가 없습니다.</p>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
                {amenities.map((a) => <div key={a} style={{ fontSize: 13.5 }}><span style={{ color: 'var(--success)', marginRight: 6 }}>✓</span>{a}</div>)}
              </div>}
          </div>
        </section>

        {/* 이용안내 */}
        <section ref={refs.guide} style={{ scrollMarginTop: 120, marginBottom: 20 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 14 }}>이용안내</h2>
          <div className="card" style={{ padding: '18px 20px', fontSize: 13.5, lineHeight: 1.9 }}>
            {openClose && <div><strong>운영 시간</strong> {openClose.openTime} ~ {openClose.closeTime} (시간제 최소 {openClose.minHours}시간)</div>}
            <div><strong>결제</strong> 무통장 입금 또는 현장 결제 — 입금 확인 시 예약 확정</div>
            <div><strong>예약 취소</strong> 마이 예약 또는 아래 ‘내 예약’에서 가능 (체크인 전)</div>
          </div>
        </section>

        <HkMyBookings tick={tick} />
      </div>

      {pickDate && <HkDatePicker value={selDate} onApply={setSelDate} onClose={() => setPickDate(false)} />}
      {booking && <HkBookingModal room={booking} date={selDate} defaultGuests={guests} user={user} property={property} onClose={() => setBooking(null)} onDone={() => setTick((v) => v + 1)} />}
    </div>
  );
};

Object.assign(window, { HangyeonPage });

// 한켠(전주 숙소) 예약 페이지 — /hangyeon  (v00.267)
// 이미지 갤러리 + 가용성 캘린더 + 예약하기 + 내 예약 조회.
// D1 source-of-truth: window.BGNJ_HANGYEON (→ /api/hangyeon/*). 결제는 무통장입금/현장결제.

const hkToday = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10); // KST 기준 오늘
const hkAddDays = (str, n) => new Date(new Date(str + 'T00:00:00Z').getTime() + n * 86400000).toISOString().slice(0, 10);
const hkNightsBetween = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000);
const HK_WD = ['일', '월', '화', '수', '목', '금', '토'];
const hkFmtDate = (str) => { if (!str) return ''; const d = new Date(str + 'T00:00:00Z'); return `${str.slice(5).replace('-', '.')} (${HK_WD[d.getUTCDay()]})`; };
const hkWon = (n) => (window.BGNJ_FMT?.won ? window.BGNJ_FMT.won(n) : `${Number(n || 0).toLocaleString('ko-KR')}원`);

// ── 가용성 캘린더 (월 단위 네비) ───────────────────────────────────────────
const HkCalendar = ({ roomTypeId, checkIn, checkOut, onSelect }) => {
  const today = hkToday();
  const [cursor, setCursor] = React.useState(today.slice(0, 7) + '-01'); // YYYY-MM-01
  const [avail, setAvail] = React.useState({}); // date -> {remaining, closed}
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!roomTypeId) return;
    let alive = true;
    setLoading(true);
    const from = cursor;
    const to = hkAddDays(cursor, 42); // 6주 커버
    window.BGNJ_HANGYEON.availability({ from, to, roomTypeId }).then((res) => {
      if (!alive) return;
      const map = {};
      const arr = (res.availability && res.availability[roomTypeId]) || [];
      arr.forEach((a) => { map[a.date] = { remaining: a.remaining, closed: a.closed }; });
      setAvail(map);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [roomTypeId, cursor]);

  const year = Number(cursor.slice(0, 4));
  const month = Number(cursor.slice(5, 7)) - 1; // 0-based
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${cursor.slice(0, 8)}${String(d).padStart(2, '0')}`);

  const inRange = (date) => checkIn && checkOut && date >= checkIn && date < checkOut;
  const monthLabel = `${year}년 ${month + 1}월`;
  const prevDisabled = cursor <= today.slice(0, 7) + '-01';

  const onCellClick = (date) => {
    if (date < today) return;
    const a = avail[date];
    if (a && (a.closed || a.remaining < 1)) return; // 매진/판매중지
    if (!checkIn || (checkIn && checkOut) || date <= checkIn) { onSelect(date, null); return; }
    // checkOut 선택 — 사이 나이트 매진 체크 (로드된 범위 내)
    for (let dd = checkIn; dd < date; dd = hkAddDays(dd, 1)) {
      const av = avail[dd];
      if (av && (av.closed || av.remaining < 1)) { window.BGNJ_TOAST?.error?.('선택 구간에 판매 불가 날짜가 있어요.'); return; }
    }
    onSelect(checkIn, date);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <button type="button" className="btn btn-small" disabled={prevDisabled}
          onClick={() => setCursor(`${new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 8)}01`)}
          style={{ opacity: prevDisabled ? 0.4 : 1 }}>‹</button>
        <strong style={{ fontSize: 15 }}>{monthLabel}{loading ? ' …' : ''}</strong>
        <button type="button" className="btn btn-small"
          onClick={() => setCursor(`${new Date(Date.UTC(year, month + 1, 1)).toISOString().slice(0, 8)}01`)}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
        {HK_WD.map((w, i) => (
          <div key={w} className="mono dim-2" style={{ textAlign: 'center', fontSize: 10, padding: '4px 0', color: i === 0 ? 'var(--danger)' : 'var(--ink-3)' }}>{w}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`e${i}`} />;
          const day = Number(date.slice(8));
          const a = avail[date];
          const past = date < today;
          const soldout = a && (a.closed || a.remaining < 1);
          const disabled = past || soldout;
          const isStart = date === checkIn;
          const isEnd = date === checkOut;
          const ranged = inRange(date);
          return (
            <button key={date} type="button" disabled={disabled} onClick={() => onCellClick(date)}
              style={{
                aspectRatio: '1', border: '1px solid var(--line)', borderRadius: 6, cursor: disabled ? 'default' : 'pointer',
                background: (isStart || isEnd) ? 'var(--secondary)' : ranged ? 'var(--bg-2)' : 'var(--bg)',
                color: (isStart || isEnd) ? '#fff' : disabled ? 'var(--ink-3)' : 'var(--ink)',
                opacity: past ? 0.35 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                fontSize: 13, fontWeight: (isStart || isEnd) ? 700 : 500, padding: 2, position: 'relative',
              }}>
              <span>{day}</span>
              {!past && (
                soldout
                  ? <span style={{ fontSize: 8, color: (isStart || isEnd) ? '#fff' : 'var(--danger)' }}>마감</span>
                  : a ? <span className="mono" style={{ fontSize: 8, color: (isStart || isEnd) ? '#fff' : 'var(--ink-3)' }}>{a.remaining}실</span> : null
              )}
            </button>
          );
        })}
      </div>
      <p className="dim-2" style={{ fontSize: 11, marginTop: 8 }}>날짜를 두 번 눌러 체크인·체크아웃을 선택하세요. 숫자는 잔여 객실 수입니다.</p>
    </div>
  );
};

// ── 예약 모달 ─────────────────────────────────────────────────────────────
const HkBookingModal = ({ roomType, user, onClose, onDone }) => {
  const [checkIn, setCheckIn] = React.useState(null);
  const [checkOut, setCheckOut] = React.useState(null);
  const [rooms, setRooms] = React.useState(1);
  const [guests, setGuests] = React.useState(1);
  const [coupon, setCoupon] = React.useState('');
  const [name, setName] = React.useState(user?.name || '');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState(user?.email || '');
  const [request, setRequest] = React.useState('');
  const [agreed, setAgreed] = React.useState(false);
  const [quote, setQuote] = React.useState(null);
  const [quoting, setQuoting] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // 날짜/인원/쿠폰 변경 시 견적 재계산
  React.useEffect(() => {
    if (!checkIn || !checkOut) { setQuote(null); return; }
    let alive = true;
    setQuoting(true);
    window.BGNJ_HANGYEON.quote({ roomTypeId: roomType.id, checkIn, checkOut, rooms, couponCode: coupon.trim() || undefined })
      .then((q) => { if (alive) { setQuote(q); setQuoting(false); } });
    return () => { alive = false; };
  }, [checkIn, checkOut, rooms, coupon, roomType.id]);

  const submit = async () => {
    if (!checkIn || !checkOut) { window.BGNJ_TOAST?.error?.('체크인·체크아웃 날짜를 선택해 주세요.'); return; }
    if (!name.trim() || !phone.trim()) { window.BGNJ_TOAST?.error?.('이름과 연락처를 입력해 주세요.'); return; }
    if (!agreed) { window.BGNJ_TOAST?.error?.('개인정보 수집·이용에 동의해 주세요.'); return; }
    if (!quote?.ok) { window.BGNJ_TOAST?.error?.(quote?.reason || '예약할 수 없는 일정입니다.'); return; }
    setSubmitting(true);
    const res = await window.BGNJ_HANGYEON.book({
      roomTypeId: roomType.id, checkIn, checkOut, rooms, guests,
      name: name.trim(), phone: phone.trim(), email: email.trim(),
      request: request.trim(), couponCode: coupon.trim() || undefined,
    });
    setSubmitting(false);
    if (res.ok) {
      window.BGNJ_TOAST?.success?.(`예약 접수 완료 (${res.booking?.code}). 입금 확인 후 확정됩니다.`);
      onDone && onDone(res.booking);
      onClose();
    } else {
      window.BGNJ_TOAST?.error?.(res.message || '예약 실패');
    }
  };

  const nights = checkIn && checkOut ? hkNightsBetween(checkIn, checkOut) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} className="card"
        style={{ maxWidth: 520, width: '100%', padding: 0, background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
          <h3 className="ko-serif" style={{ fontSize: 19, margin: 0 }}>{roomType.name} 예약</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink-3)' }}>✕</button>
        </div>
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <HkCalendar roomTypeId={roomType.id} checkIn={checkIn} checkOut={checkOut}
            onSelect={(ci, co) => { setCheckIn(ci); setCheckOut(co); }} />

          {checkIn && (
            <div className="card" style={{ padding: '12px 16px', background: 'var(--bg-2)' }}>
              <div style={{ fontSize: 14 }}>
                <strong>{hkFmtDate(checkIn)}</strong>
                {checkOut ? <> → <strong>{hkFmtDate(checkOut)}</strong> · {nights}박</> : <span className="dim"> · 체크아웃 날짜를 선택하세요</span>}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ fontSize: 12 }}>객실 수
              <select className="field-input" value={rooms} onChange={(e) => setRooms(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}실</option>)}
              </select>
            </label>
            <label style={{ fontSize: 12 }}>투숙 인원
              <select className="field-input" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                {Array.from({ length: (roomType.maxOccupancy || 2) * rooms }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}명</option>)}
              </select>
            </label>
          </div>

          {/* 견적 */}
          {checkIn && checkOut && (
            <div className="card" style={{ padding: '14px 16px' }}>
              {quoting ? <p className="dim" style={{ margin: 0, fontSize: 13 }}>요금 계산 중…</p>
                : quote?.ok ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="dim">객실 요금 ({nights}박 × {rooms}실)</span><span>{hkWon(quote.subtotal)}</span></div>
                    {quote.stayDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}><span>{quote.stayLabel}</span><span>-{hkWon(quote.stayDiscount)}</span></div>}
                    {quote.couponDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}><span>쿠폰 ({quote.couponLabel})</span><span>-{hkWon(quote.couponDiscount)}</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 6, fontWeight: 700, fontSize: 16 }}><span>합계</span><span className="ko-serif">{hkWon(quote.total)}</span></div>
                  </div>
                ) : <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{quote?.reason || '예약 불가'}</p>}
              {quote?.couponError && <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--danger)' }}>{quote.couponError}</p>}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ fontSize: 12 }}>예약자 이름 *<input className="field-input" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label style={{ fontSize: 12 }}>연락처 *<input className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" /></label>
            <label style={{ fontSize: 12 }}>이메일<input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label style={{ fontSize: 12 }}>쿠폰 코드<input className="field-input" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="(선택)" /></label>
          </div>
          <label style={{ fontSize: 12 }}>요청사항<textarea className="field-input" rows={2} value={request} onChange={(e) => setRequest(e.target.value)} placeholder="늦은 체크인, 주차 등" /></label>

          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, cursor: 'pointer' }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 2 }} />
            <span>예약을 위한 <strong>개인정보(이름·연락처·이메일) 수집·이용</strong>에 동의합니다. (예약 처리·확인 목적, 관련 법령에 따라 보관)</span>
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
        <h2 className="section-title" style={{ fontSize: 24, marginBottom: 18 }}>내 한켠 예약</h2>
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
              <p className="dim" style={{ fontSize: 13, margin: '0 0 6px' }}>{hkFmtDate(b.checkIn)} → {hkFmtDate(b.checkOut)} · {b.nights}박 {b.rooms}실 {b.guests}명</p>
              <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 10px' }}>{hkWon(b.totalPrice)}</p>
              {['pending', 'confirmed'].includes(b.status) && (
                <button type="button" className="btn btn-small" onClick={() => cancel(b)}>예약 취소</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── 객실 카드 ─────────────────────────────────────────────────────────────
const HkRoomCard = ({ rt, onBook }) => {
  const cover = (rt.images || []).find((im) => im.isPrimary) || (rt.images || [])[0];
  return (
    <article className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ aspectRatio: '4/3', background: 'var(--bg-2)', overflow: 'hidden' }}>
        {cover ? <img src={cover.url} alt={rt.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : (window.CoverPlaceholder ? <window.CoverPlaceholder aspectRatio="4/3" iconSize={56} /> : null)}
      </div>
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <h3 className="ko-serif" style={{ fontSize: 19, margin: 0 }}>{rt.name}</h3>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="badge">최대 {rt.maxOccupancy}인</span>
          {rt.bedConfig && <span className="badge">{rt.bedConfig}</span>}
        </div>
        {rt.description && <p className="dim bgnj-multiline" style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>{rt.description}</p>}
        {(rt.amenities || []).length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {rt.amenities.slice(0, 6).map((a) => <span key={a} className="badge" style={{ fontSize: 9 }}>{a}</span>)}
          </div>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 10 }}>
          <div>
            <span className="mono dim-2" style={{ fontSize: 10 }}>1박</span>
            <div className="ko-serif" style={{ fontSize: 20, fontWeight: 700 }}>{hkWon(rt.basePrice)}~</div>
          </div>
          <button type="button" className="btn btn-gold" onClick={() => onBook(rt)}>예약하기</button>
        </div>
      </div>
    </article>
  );
};

const HangyeonPage = ({ go, user }) => {
  const [tick, setTick] = React.useState(0);
  const [roomTypes, setRoomTypes] = React.useState([]);
  const [booking, setBooking] = React.useState(null); // 선택한 객실타입
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
  const desc = info.desc || "전주 전자상가 뒤편 조용한 주택가에 자리한 공간 ‘한켠’. 도심 한가운데서도 차분히 머물며 쉬어 갈 수 있는 하룻밤을 제안합니다.";
  const address = info.address || '전북 전주시 덕진구 팔달로 340-37';
  const directions = info.directions || '전주역에서 차량 10분, 전주 고속버스터미널에서 도보 15분 거리로 접근성이 좋습니다. 한옥마을·자만벽화마을·경기전·풍남문 등 주요 명소까지 차량 5~10분이면 닿습니다. 도심 속에서도 조용히 머물며 집중할 수 있는 공간입니다.';
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

        {/* 숙소 대표 이미지 갤러리 — 없으면 생략(이미지 없이도 예약 가능) */}
        {images.length > 0 && window.MediaGalleryView && (
          <div style={{ marginBottom: 32 }}>
            <window.MediaGalleryView images={images} title={name} sectionLabel="숙소 전경" withCover={true} />
          </div>
        )}

        <div className="card" style={{ padding: '16px 20px', marginBottom: 28, fontSize: 13.5, lineHeight: 1.7 }}>
          <div style={{ marginBottom: directions ? 10 : 0 }}>
            <span className="mono dim-2" style={{ fontSize: 10, letterSpacing: '0.18em', marginRight: 8 }}>주소</span>{address}
          </div>
          {directions && (
            <div>
              <div className="mono dim-2" style={{ fontSize: 10, letterSpacing: '0.18em', marginBottom: 4 }}>찾아가는 길</div>
              <p className="dim" style={{ margin: 0 }}>{directions}</p>
            </div>
          )}
          {info.notice && <p className="dim" style={{ margin: '10px 0 0' }}>{info.notice}</p>}
        </div>
      </div>

      <div className="container">
        <h2 className="section-title" style={{ fontSize: 26, marginBottom: 18 }}>객실</h2>
        {roomTypes.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <p className="dim" style={{ margin: 0 }}>현재 등록된 객실이 없습니다. 곧 만나요.</p>
          </div>
        ) : (
          <div className="grid grid-3" style={{ marginBottom: 16 }}>
            {roomTypes.map((rt) => <HkRoomCard key={rt.id} rt={rt} onBook={setBooking} />)}
          </div>
        )}
      </div>

      <HkMyBookings tick={tick} />

      {booking && (
        <HkBookingModal roomType={booking} user={user}
          onClose={() => setBooking(null)}
          onDone={() => setTick((v) => v + 1)} />
      )}
    </div>
  );
};

Object.assign(window, { HangyeonPage });

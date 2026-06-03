// 한켠(전주 숙소) PMS 관리자 패널 — v00.267
// 7 영역: 객실 / 요금 / 재고 / 예약 / 고객 / 결제 / 운영.
// D1 source-of-truth: window.BGNJ_HANGYEON.

const hkaWon = (n) => (window.BGNJ_FMT?.won ? window.BGNJ_FMT.won(n) : `${Number(n || 0).toLocaleString('ko-KR')}원`);
const hkaToday = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const hkaAddDays = (str, n) => new Date(new Date(str + 'T00:00:00Z').getTime() + n * 86400000).toISOString().slice(0, 10);
const HKA_WD = ['일', '월', '화', '수', '목', '금', '토'];
const hkaDate = (str) => { if (!str) return '-'; const d = new Date(str + 'T00:00:00Z'); return `${str.slice(2).replace(/-/g, '.')}(${HKA_WD[d.getUTCDay()]})`; };
const HKA_STATUS = { pending: '예약대기', confirmed: '예약확정', checked_in: '체크인', checked_out: '체크아웃', cancelled: '취소', no_show: '노쇼' };
const HKA_PAY = { unpaid: '미결제', partial: '부분결제', paid: '결제완료', refunded: '환불완료' };
const hkaFlash = (msg, ok) => (ok === false ? window.BGNJ_TOAST?.error?.(msg) : window.BGNJ_TOAST?.success?.(msg));

// ── 1) 객실 관리 ───────────────────────────────────────────────────────────
const HkaRoomTypes = () => {
  const [list, setList] = React.useState([]);
  const [editing, setEditing] = React.useState(null); // draft object or null
  const reload = () => window.BGNJ_HANGYEON.refreshRoomTypes({ includeAll: true }).then(setList);
  React.useEffect(() => { reload(); }, []);

  const blank = () => ({ name: '', description: '', images: [], quantity: 1, maxOccupancy: 2, bedConfig: '', amenities: [], basePrice: 0, weekendPrice: '', discounts: [], minNights: 1, maxNights: 30, status: 'active', sortOrder: 0 });
  const save = async () => {
    if (!editing.name.trim()) { hkaFlash('객실 이름을 입력하세요.', false); return; }
    try { await window.BGNJ_HANGYEON.saveRoomType(editing); setEditing(null); reload(); hkaFlash('저장됨.'); }
    catch (err) { hkaFlash(err?.body?.error || '저장 실패', false); }
  };
  const del = async (rt) => {
    if (!(await window.BGNJ_CONFIRM(`"${rt.name}" 객실을 삭제할까요?`, { danger: true }))) return;
    await window.BGNJ_HANGYEON.deleteRoomType(rt.id); reload(); hkaFlash('삭제됨.');
  };
  const up = (patch) => setEditing((e) => ({ ...e, ...patch }));

  if (editing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h4 style={{ margin: 0 }}>{editing.id ? '객실 수정' : '새 객실'}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={{ fontSize: 12 }}>객실명<input className="field-input" value={editing.name} onChange={(e) => up({ name: e.target.value })} placeholder="스탠다드 더블룸" /></label>
          <label style={{ fontSize: 12 }}>판매 상태
            <select className="field-input" value={editing.status} onChange={(e) => up({ status: e.target.value })}>
              <option value="active">판매 가능</option><option value="inactive">판매 불가</option>
            </select>
          </label>
        </div>
        <label style={{ fontSize: 12 }}>설명<textarea className="field-input" rows={2} value={editing.description} onChange={(e) => up({ description: e.target.value })} /></label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <label style={{ fontSize: 12 }}>객실 수량<input type="number" className="field-input" value={editing.quantity} onChange={(e) => up({ quantity: Number(e.target.value) })} /></label>
          <label style={{ fontSize: 12 }}>최대 인원<input type="number" className="field-input" value={editing.maxOccupancy} onChange={(e) => up({ maxOccupancy: Number(e.target.value) })} /></label>
          <label style={{ fontSize: 12 }}>침대 구성<input className="field-input" value={editing.bedConfig} onChange={(e) => up({ bedConfig: e.target.value })} placeholder="더블 1" /></label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          <label style={{ fontSize: 12 }}>기본(평일) 요금<input type="number" className="field-input" value={editing.basePrice} onChange={(e) => up({ basePrice: Number(e.target.value) })} /></label>
          <label style={{ fontSize: 12 }}>주말(금·토) 요금<input type="number" className="field-input" value={editing.weekendPrice} onChange={(e) => up({ weekendPrice: e.target.value })} placeholder="기본과 같으면 비움" /></label>
          <label style={{ fontSize: 12 }}>최소 숙박(박)<input type="number" className="field-input" value={editing.minNights} onChange={(e) => up({ minNights: Number(e.target.value) })} /></label>
          <label style={{ fontSize: 12 }}>최대 숙박(박)<input type="number" className="field-input" value={editing.maxNights} onChange={(e) => up({ maxNights: Number(e.target.value) })} /></label>
        </div>
        <label style={{ fontSize: 12 }}>편의시설 (쉼표 구분)
          <input className="field-input" value={(editing.amenities || []).join(', ')} onChange={(e) => up({ amenities: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} placeholder="에어컨, 와이파이, 취사, 주차" />
        </label>
        {/* 연박/장기 할인 */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>연박/장기 할인</div>
          {(editing.discounts || []).map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input type="number" className="field-input" style={{ width: 90 }} value={d.minNights} placeholder="N박↑" onChange={(e) => { const arr = [...editing.discounts]; arr[i] = { ...d, minNights: Number(e.target.value) }; up({ discounts: arr }); }} />
              <input type="number" className="field-input" style={{ width: 80 }} value={d.percent} placeholder="%" onChange={(e) => { const arr = [...editing.discounts]; arr[i] = { ...d, percent: Number(e.target.value) }; up({ discounts: arr }); }} />
              <input className="field-input" style={{ flex: 1 }} value={d.label || ''} placeholder="라벨" onChange={(e) => { const arr = [...editing.discounts]; arr[i] = { ...d, label: e.target.value }; up({ discounts: arr }); }} />
              <button type="button" className="btn btn-small" onClick={() => up({ discounts: editing.discounts.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-small" onClick={() => up({ discounts: [...(editing.discounts || []), { minNights: 3, percent: 10, label: '3박 이상 10%' }] })}>+ 할인 추가</button>
        </div>
        {/* 객실 사진 */}
        {window.MediaGalleryEditor && (
          <window.MediaGalleryEditor value={editing.images || []} onChange={(imgs) => up({ images: imgs })} folder="hangyeon-rooms" label="객실 사진" max={10} />
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-gold" onClick={save}>저장</button>
          <button type="button" className="btn" onClick={() => setEditing(null)}>취소</button>
          {editing.id && <button type="button" className="btn" style={{ marginLeft: 'auto', color: 'var(--danger)' }} onClick={() => del(editing)}>삭제</button>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p className="dim" style={{ fontSize: 13, margin: 0 }}>객실 타입 · 사진 · 인원 · 수량 · 침대 · 편의시설 · 판매 상태</p>
        <button type="button" className="btn btn-gold" onClick={() => setEditing(blank())}>+ 객실 추가</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map((rt) => (
          <div key={rt.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <strong>{rt.name}</strong> <span className="badge" style={{ marginLeft: 6 }}>{rt.status === 'active' ? '판매중' : '판매중지'}</span>
              <div className="dim-2" style={{ fontSize: 12, marginTop: 4 }}>{rt.quantity}실 · 최대 {rt.maxOccupancy}인 · {hkaWon(rt.basePrice)}{rt.weekendPrice ? ` (주말 ${hkaWon(rt.weekendPrice)})` : ''}</div>
            </div>
            <button type="button" className="btn btn-small" onClick={() => setEditing({ ...rt, weekendPrice: rt.weekendPrice == null ? '' : rt.weekendPrice })}>수정</button>
          </div>
        ))}
        {list.length === 0 && <p className="dim">등록된 객실이 없습니다.</p>}
      </div>
    </div>
  );
};

// ── 2) 요금 관리 (요금 규칙 + 쿠폰) ─────────────────────────────────────────
const HkaRates = () => {
  const [rules, setRules] = React.useState([]);
  const [coupons, setCoupons] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [rule, setRule] = React.useState(null);
  const [coupon, setCoupon] = React.useState(null);
  const reload = () => {
    window.BGNJ_HANGYEON.rateRules().then(setRules);
    window.BGNJ_HANGYEON.coupons().then(setCoupons);
    window.BGNJ_HANGYEON.refreshRoomTypes({ includeAll: true }).then(setRooms);
  };
  React.useEffect(() => { reload(); }, []);

  const saveRule = async () => {
    try {
      if (rule.id) await window.BGNJ_HANGYEON.updateRateRule(rule.id, rule);
      else await window.BGNJ_HANGYEON.createRateRule(rule);
      setRule(null); reload(); hkaFlash('요금 규칙 저장됨.');
    } catch (err) { hkaFlash(err?.body?.error || '실패', false); }
  };
  const delRule = async (r) => { if (!(await window.BGNJ_CONFIRM('규칙을 삭제할까요?', { danger: true }))) return; await window.BGNJ_HANGYEON.deleteRateRule(r.id); reload(); };
  const saveCoupon = async () => {
    if (!coupon.code.trim()) { hkaFlash('코드를 입력하세요.', false); return; }
    try { await window.BGNJ_HANGYEON.upsertCoupon(coupon); setCoupon(null); reload(); hkaFlash('쿠폰 저장됨.'); }
    catch (err) { hkaFlash(err?.body?.error || '실패', false); }
  };
  const delCoupon = async (c) => { if (!(await window.BGNJ_CONFIRM(`쿠폰 ${c.code} 삭제?`, { danger: true }))) return; await window.BGNJ_HANGYEON.deleteCoupon(c.code); reload(); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h4 style={{ margin: 0 }}>요금 규칙 (시즌·공휴일·프로모션·요일)</h4>
          <button type="button" className="btn btn-small btn-gold" onClick={() => setRule({ kind: 'season', label: '', roomTypeId: '', startDate: '', endDate: '', dow: [], price: '', priority: 1, active: true })}>+ 규칙</button>
        </div>
        {rule && (
          <div className="card" style={{ padding: 14, marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <label style={{ fontSize: 12 }}>종류
                <select className="field-input" value={rule.kind} onChange={(e) => setRule({ ...rule, kind: e.target.value })}>
                  <option value="season">시즌(성수기 등)</option><option value="holiday">공휴일</option><option value="promo">프로모션</option><option value="dow">요일</option>
                </select>
              </label>
              <label style={{ fontSize: 12 }}>적용 객실
                <select className="field-input" value={rule.roomTypeId || ''} onChange={(e) => setRule({ ...rule, roomTypeId: e.target.value })}>
                  <option value="">전체 객실</option>
                  {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </label>
              <label style={{ fontSize: 12 }}>적용 요금(원)<input type="number" className="field-input" value={rule.price} onChange={(e) => setRule({ ...rule, price: Number(e.target.value) })} /></label>
            </div>
            <label style={{ fontSize: 12 }}>라벨<input className="field-input" value={rule.label} onChange={(e) => setRule({ ...rule, label: e.target.value })} placeholder="여름 성수기" /></label>
            {rule.kind === 'dow' ? (
              <div style={{ fontSize: 12 }}>적용 요일
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  {HKA_WD.map((w, i) => (
                    <button key={i} type="button" className="btn btn-small" style={{ background: (rule.dow || []).includes(i) ? 'var(--secondary)' : 'var(--bg)', color: (rule.dow || []).includes(i) ? '#fff' : 'var(--ink)' }}
                      onClick={() => { const d = rule.dow || []; setRule({ ...rule, dow: d.includes(i) ? d.filter((x) => x !== i) : [...d, i] }); }}>{w}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <label style={{ fontSize: 12 }}>시작일<input type="date" className="field-input" value={rule.startDate || ''} onChange={(e) => setRule({ ...rule, startDate: e.target.value })} /></label>
                <label style={{ fontSize: 12 }}>종료일<input type="date" className="field-input" value={rule.endDate || ''} onChange={(e) => setRule({ ...rule, endDate: e.target.value })} /></label>
                <label style={{ fontSize: 12 }}>우선순위<input type="number" className="field-input" value={rule.priority} onChange={(e) => setRule({ ...rule, priority: Number(e.target.value) })} /></label>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-gold btn-small" onClick={saveRule}>저장</button>
              <button type="button" className="btn btn-small" onClick={() => setRule(null)}>취소</button>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rules.map((r) => (
            <div key={r.id} className="card" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <span className="badge">{({ season: '시즌', holiday: '공휴일', promo: '프로모션', dow: '요일' })[r.kind] || r.kind}</span>
              <span style={{ flex: 1 }}>{r.label || '(라벨없음)'} · {r.kind === 'dow' ? (r.dow || []).map((d) => HKA_WD[d]).join('') : `${r.startDate || ''}~${r.endDate || ''}`} · <strong>{hkaWon(r.price)}</strong></span>
              <button type="button" className="btn btn-small" onClick={() => setRule(r)}>수정</button>
              <button type="button" className="btn btn-small" onClick={() => delRule(r)}>✕</button>
            </div>
          ))}
          {rules.length === 0 && <p className="dim" style={{ fontSize: 13 }}>요금 규칙 없음 — 기본/주말 요금만 적용됩니다.</p>}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h4 style={{ margin: 0 }}>쿠폰</h4>
          <button type="button" className="btn btn-small btn-gold" onClick={() => setCoupon({ code: '', label: '', kind: 'percent', value: 10, minAmount: 0, startsAt: '', expiresAt: '', active: true })}>+ 쿠폰</button>
        </div>
        {coupon && (
          <div className="card" style={{ padding: 14, marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <label style={{ fontSize: 12 }}>코드<input className="field-input" value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" /></label>
              <label style={{ fontSize: 12 }}>유형
                <select className="field-input" value={coupon.kind} onChange={(e) => setCoupon({ ...coupon, kind: e.target.value })}><option value="percent">% 할인</option><option value="amount">정액 할인</option></select>
              </label>
              <label style={{ fontSize: 12 }}>값<input type="number" className="field-input" value={coupon.value} onChange={(e) => setCoupon({ ...coupon, value: Number(e.target.value) })} /></label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <label style={{ fontSize: 12 }}>최소 금액<input type="number" className="field-input" value={coupon.minAmount} onChange={(e) => setCoupon({ ...coupon, minAmount: Number(e.target.value) })} /></label>
              <label style={{ fontSize: 12 }}>시작일<input type="date" className="field-input" value={coupon.startsAt || ''} onChange={(e) => setCoupon({ ...coupon, startsAt: e.target.value })} /></label>
              <label style={{ fontSize: 12 }}>만료일<input type="date" className="field-input" value={coupon.expiresAt || ''} onChange={(e) => setCoupon({ ...coupon, expiresAt: e.target.value })} /></label>
            </div>
            <label style={{ fontSize: 12 }}>라벨<input className="field-input" value={coupon.label} onChange={(e) => setCoupon({ ...coupon, label: e.target.value })} /></label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-gold btn-small" onClick={saveCoupon}>저장</button>
              <button type="button" className="btn btn-small" onClick={() => setCoupon(null)}>취소</button>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {coupons.map((c) => (
            <div key={c.code} className="card" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <span className="mono"><strong>{c.code}</strong></span>
              <span style={{ flex: 1 }}>{c.kind === 'percent' ? `${c.value}%` : hkaWon(c.value)} {c.label ? `· ${c.label}` : ''} {c.active ? '' : '· (비활성)'}</span>
              <button type="button" className="btn btn-small" onClick={() => setCoupon(c)}>수정</button>
              <button type="button" className="btn btn-small" onClick={() => delCoupon(c)}>✕</button>
            </div>
          ))}
          {coupons.length === 0 && <p className="dim" style={{ fontSize: 13 }}>쿠폰 없음.</p>}
        </div>
      </div>
    </div>
  );
};

// ── 3) 재고 관리 (날짜별 판매중지/재고/요금 오버라이드) ──────────────────────
const HkaAvailability = () => {
  const [rooms, setRooms] = React.useState([]);
  const [roomId, setRoomId] = React.useState('');
  const [cursor, setCursor] = React.useState(hkaToday().slice(0, 7) + '-01');
  const [avail, setAvail] = React.useState({});
  const [form, setForm] = React.useState({ from: hkaToday(), to: hkaToday(), closed: false, qtyOverride: '', priceOverride: '' });

  React.useEffect(() => { window.BGNJ_HANGYEON.refreshRoomTypes({ includeAll: true }).then((r) => { setRooms(r); if (r[0]) setRoomId((id) => id || r[0].id); }); }, []);
  const loadAvail = React.useCallback(() => {
    if (!roomId) return;
    window.BGNJ_HANGYEON.availability({ from: cursor, to: hkaAddDays(cursor, 42), roomTypeId: roomId }).then((res) => {
      const map = {}; ((res.availability && res.availability[roomId]) || []).forEach((a) => { map[a.date] = a; }); setAvail(map);
    });
  }, [roomId, cursor]);
  React.useEffect(() => { loadAvail(); }, [loadAvail]);

  const apply = async () => {
    if (!roomId) { hkaFlash('객실을 선택하세요.', false); return; }
    try {
      await window.BGNJ_HANGYEON.setAvailability({ roomTypeId: roomId, from: form.from, to: form.to, closed: form.closed, qtyOverride: form.qtyOverride, priceOverride: form.priceOverride });
      loadAvail(); hkaFlash('적용됨.');
    } catch (err) { hkaFlash(err?.body?.error || '실패', false); }
  };

  const year = Number(cursor.slice(0, 4)), month = Number(cursor.slice(5, 7)) - 1;
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = []; for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${cursor.slice(0, 8)}${String(d).padStart(2, '0')}`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="dim" style={{ fontSize: 13, margin: 0 }}>날짜별 객실 재고 / 판매중지(오버부킹 방지) / 요금 오버라이드. 잔여는 예약 시 자동 차감됩니다.</p>
      <label style={{ fontSize: 12, maxWidth: 280 }}>객실
        <select className="field-input" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          {rooms.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.quantity}실)</option>)}
        </select>
      </label>

      <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <strong style={{ fontSize: 13 }}>판매/재고 일괄 설정</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, alignItems: 'end' }}>
          <label style={{ fontSize: 12 }}>시작<input type="date" className="field-input" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} /></label>
          <label style={{ fontSize: 12 }}>종료<input type="date" className="field-input" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} /></label>
          <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={form.closed} onChange={(e) => setForm({ ...form, closed: e.target.checked })} />판매중지</label>
          <label style={{ fontSize: 12 }}>재고 조정<input type="number" className="field-input" value={form.qtyOverride} onChange={(e) => setForm({ ...form, qtyOverride: e.target.value })} placeholder="기본" /></label>
          <label style={{ fontSize: 12 }}>요금 조정<input type="number" className="field-input" value={form.priceOverride} onChange={(e) => setForm({ ...form, priceOverride: e.target.value })} placeholder="기본" /></label>
        </div>
        <button type="button" className="btn btn-gold btn-small" style={{ alignSelf: 'flex-start' }} onClick={apply}>구간 적용</button>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <button type="button" className="btn btn-small" onClick={() => setCursor(`${new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 8)}01`)}>‹</button>
          <strong>{year}년 {month + 1}월</strong>
          <button type="button" className="btn btn-small" onClick={() => setCursor(`${new Date(Date.UTC(year, month + 1, 1)).toISOString().slice(0, 8)}01`)}>›</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
          {HKA_WD.map((w) => <div key={w} className="mono dim-2" style={{ textAlign: 'center', fontSize: 10 }}>{w}</div>)}
          {cells.map((date, i) => {
            if (!date) return <div key={`e${i}`} />;
            const a = avail[date];
            return (
              <div key={date} style={{ aspectRatio: '1', border: '1px solid var(--line)', borderRadius: 6, padding: 3, fontSize: 11, background: a?.closed ? 'rgba(220,38,38,0.08)' : 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span>{Number(date.slice(8))}</span>
                {a && (a.closed ? <span style={{ color: 'var(--danger)', fontSize: 9 }}>중지</span> : <span className="mono dim-2" style={{ fontSize: 9 }}>{a.remaining}/{a.qty}</span>)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── 4) 예약 관리 ───────────────────────────────────────────────────────────
const HkaBookingDetail = ({ booking, onClose, onChanged }) => {
  const [b, setB] = React.useState(booking);
  const [log, setLog] = React.useState([]);
  const [payments, setPayments] = React.useState([]);
  const [pay, setPay] = React.useState({ amount: '', method: 'bank', memo: '' });
  const reloadSub = () => { window.BGNJ_HANGYEON.bookingLog(b.id).then(setLog); window.BGNJ_HANGYEON.payments(b.id).then(setPayments); };
  React.useEffect(() => { reloadSub(); }, [b.id]);

  const patch = async (p) => {
    try { await window.BGNJ_HANGYEON.patchBooking(b.id, p); setB({ ...b, ...p }); onChanged && onChanged(); reloadSub(); hkaFlash('변경됨.'); }
    catch (err) { hkaFlash(err?.body?.error || '실패', false); }
  };
  const addPay = async () => {
    const amt = Number(pay.amount); if (!amt) { hkaFlash('금액 입력', false); return; }
    try { const r = await window.BGNJ_HANGYEON.addPayment(b.id, { amount: amt, method: pay.method, memo: pay.memo }); setB({ ...b, paidAmount: r.paidAmount, paymentStatus: r.paymentStatus }); setPay({ amount: '', method: 'bank', memo: '' }); onChanged && onChanged(); reloadSub(); hkaFlash('기록됨.'); }
    catch (err) { hkaFlash(err?.body?.error || '실패', false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '32px 16px' }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ maxWidth: 560, width: '100%', padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
          <div><span className="mono dim-2" style={{ fontSize: 11 }}>{b.code}</span> <strong style={{ marginLeft: 8 }}>{b.roomTypeName}</strong></div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink-3)' }}>✕</button>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
          <div className="card" style={{ padding: '10px 14px', background: 'var(--bg-2)' }}>
            <div>{b.name} · {b.phone} {b.email ? `· ${b.email}` : ''}</div>
            <div style={{ marginTop: 4 }}>{hkaDate(b.checkIn)} → {hkaDate(b.checkOut)} · {b.nights}박 {b.rooms}실 {b.guests}명 · <strong>{hkaWon(b.totalPrice)}</strong></div>
            {b.guestRequest && <div className="dim" style={{ marginTop: 4 }}>요청: {b.guestRequest}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label style={{ fontSize: 12 }}>예약 상태
              <select className="field-input" value={b.status} onChange={(e) => patch({ status: e.target.value })}>
                {Object.keys(HKA_STATUS).map((k) => <option key={k} value={k}>{HKA_STATUS[k]}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 12 }}>결제 상태
              <select className="field-input" value={b.paymentStatus} onChange={(e) => patch({ paymentStatus: e.target.value })}>
                {Object.keys(HKA_PAY).map((k) => <option key={k} value={k}>{HKA_PAY[k]}</option>)}
              </select>
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label style={{ fontSize: 12 }}>객실 배정<input className="field-input" defaultValue={b.roomAssignment} onBlur={(e) => e.target.value !== b.roomAssignment && patch({ roomAssignment: e.target.value })} placeholder="101호" /></label>
            <label style={{ fontSize: 12 }}>청소/운영 메모<input className="field-input" defaultValue={b.housekeeping} onBlur={(e) => e.target.value !== b.housekeeping && patch({ housekeeping: e.target.value })} /></label>
          </div>
          <label style={{ fontSize: 12 }}>관리자 메모<textarea className="field-input" rows={2} defaultValue={b.memo} onBlur={(e) => e.target.value !== b.memo && patch({ memo: e.target.value })} /></label>

          {/* 결제 */}
          <div className="card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><strong>결제 · {HKA_PAY[b.paymentStatus]}</strong><span>입금 {hkaWon(b.paidAmount)} / {hkaWon(b.totalPrice)}</span></div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'end', flexWrap: 'wrap' }}>
              <input type="number" className="field-input" style={{ width: 110 }} placeholder="금액(환불 -)" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} />
              <select className="field-input" style={{ width: 90 }} value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })}><option value="bank">무통장</option><option value="cash">현장</option><option value="onsite">기타</option></select>
              <input className="field-input" style={{ flex: 1, minWidth: 100 }} placeholder="메모" value={pay.memo} onChange={(e) => setPay({ ...pay, memo: e.target.value })} />
              <button type="button" className="btn btn-small btn-gold" onClick={addPay}>기록</button>
            </div>
            {payments.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                {payments.map((p) => <div key={p.id} className="dim-2">· {p.kind === 'refund' ? '환불' : '입금'} {hkaWon(p.amount)} ({p.method}) {p.memo}</div>)}
              </div>
            )}
          </div>

          {/* 이력 */}
          {log.length > 0 && (
            <details>
              <summary style={{ cursor: 'pointer', fontSize: 12 }}>예약 이력 ({log.length})</summary>
              <div style={{ marginTop: 6, fontSize: 11 }}>
                {log.map((l) => <div key={l.id} className="dim-2">· [{(l.createdAt || '').slice(5, 16)}] {l.action}: {l.detail} ({l.actor})</div>)}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

const HkaBookings = () => {
  const [bookings, setBookings] = React.useState([]);
  const [status, setStatus] = React.useState('');
  const [detail, setDetail] = React.useState(null);
  const reload = () => window.BGNJ_HANGYEON.adminBookings(status ? { status } : {}).then(setBookings);
  React.useEffect(() => { reload(); }, [status]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="btn btn-small" style={{ background: !status ? 'var(--secondary)' : 'var(--bg)', color: !status ? '#fff' : 'var(--ink)' }} onClick={() => setStatus('')}>전체</button>
        {Object.keys(HKA_STATUS).map((k) => (
          <button key={k} type="button" className="btn btn-small" style={{ background: status === k ? 'var(--secondary)' : 'var(--bg)', color: status === k ? '#fff' : 'var(--ink)' }} onClick={() => setStatus(k)}>{HKA_STATUS[k]}</button>
        ))}
        <span className="dim-2" style={{ fontSize: 12, marginLeft: 'auto' }}>{bookings.length}건</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {bookings.map((b) => (
          <button key={b.id} type="button" className="card" onClick={() => setDetail(b)}
            style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer', border: '1px solid var(--line)', background: 'var(--bg)' }}>
            <span className="mono dim-2" style={{ fontSize: 11, width: 84 }}>{b.code}</span>
            <span style={{ flex: 1 }}><strong>{b.name}</strong> · {b.roomTypeName} · {hkaDate(b.checkIn)}~{hkaDate(b.checkOut)} ({b.nights}박)</span>
            <span className="badge">{HKA_STATUS[b.status]}</span>
            <span className="badge" style={{ borderColor: 'var(--line)' }}>{HKA_PAY[b.paymentStatus]}</span>
            <span style={{ width: 90, textAlign: 'right', fontWeight: 600 }}>{hkaWon(b.totalPrice)}</span>
          </button>
        ))}
        {bookings.length === 0 && <p className="dim">예약이 없습니다.</p>}
      </div>
      {detail && <HkaBookingDetail booking={detail} onClose={() => setDetail(null)} onChanged={reload} />}
    </div>
  );
};

// ── 5) 고객 관리 ───────────────────────────────────────────────────────────
const HkaGuests = () => {
  const [guests, setGuests] = React.useState([]);
  const reload = () => window.BGNJ_HANGYEON.guests().then(setGuests);
  React.useEffect(() => { reload(); }, []);
  const toggle = async (g, field) => { await window.BGNJ_HANGYEON.patchGuest(g.id, { [field]: !g[field] }); reload(); };
  return (
    <div>
      <p className="dim" style={{ fontSize: 13 }}>투숙객 정보 · 방문 횟수 · VIP · 블랙리스트. (예약 시 자동 적립, 체크아웃 시 방문 +1)</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {guests.map((g) => (
          <div key={g.id} className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
            <div style={{ flex: 1 }}>
              <strong>{g.name || '(이름없음)'}</strong> {g.vip ? <span className="badge" style={{ borderColor: 'var(--primary)', color: 'var(--primary-active)' }}>VIP</span> : null} {g.blacklist ? <span className="badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>블랙</span> : null}
              <div className="dim-2" style={{ fontSize: 12 }}>{g.phone} {g.email ? `· ${g.email}` : ''} · 방문 {g.visits}회</div>
            </div>
            <button type="button" className="btn btn-small" onClick={() => toggle(g, 'vip')}>{g.vip ? 'VIP 해제' : 'VIP'}</button>
            <button type="button" className="btn btn-small" style={{ color: g.blacklist ? 'var(--ink)' : 'var(--danger)' }} onClick={() => toggle(g, 'blacklist')}>{g.blacklist ? '블랙해제' : '블랙리스트'}</button>
          </div>
        ))}
        {guests.length === 0 && <p className="dim">고객 기록이 없습니다.</p>}
      </div>
    </div>
  );
};

// ── 6) 결제/정산 ───────────────────────────────────────────────────────────
const HkaPayments = () => {
  const [bookings, setBookings] = React.useState([]);
  React.useEffect(() => { window.BGNJ_HANGYEON.adminBookings().then(setBookings); }, []);
  const active = bookings.filter((b) => !['cancelled', 'no_show'].includes(b.status));
  const totalDue = active.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const totalPaid = active.reduce((s, b) => s + (b.paidAmount || 0), 0);
  const byPay = { unpaid: 0, partial: 0, paid: 0, refunded: 0 };
  active.forEach((b) => { byPay[b.paymentStatus] = (byPay[b.paymentStatus] || 0) + 1; });
  const card = (label, val) => <div className="card" style={{ padding: '14px 18px', flex: 1, minWidth: 140 }}><div className="mono dim-2" style={{ fontSize: 10 }}>{label}</div><div className="ko-serif" style={{ fontSize: 22, fontWeight: 700 }}>{val}</div></div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="dim" style={{ fontSize: 13, margin: 0 }}>정산 요약 (취소·노쇼 제외). 개별 입금/환불은 예약 상세에서 기록합니다.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {card('총 예약 금액', hkaWon(totalDue))}
        {card('입금 누계', hkaWon(totalPaid))}
        {card('미수금', hkaWon(Math.max(0, totalDue - totalPaid)))}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {card('미결제', `${byPay.unpaid}건`)}
        {card('부분결제', `${byPay.partial}건`)}
        {card('결제완료', `${byPay.paid}건`)}
        {card('환불완료', `${byPay.refunded}건`)}
      </div>
    </div>
  );
};

// ── 7) 운영 관리 (객실 단위 상태 + 오늘 체크인/아웃) ────────────────────────
const HKA_UNIT = { vacant: '공실', occupied: '투숙중', cleaning: '청소중', maintenance: '점검중' };
const HKA_UNIT_COLOR = { vacant: 'var(--ink-3)', occupied: 'var(--success)', cleaning: 'var(--warning)', maintenance: 'var(--danger)' };
const HkaOperation = () => {
  const [units, setUnits] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const [adding, setAdding] = React.useState(null);
  const today = hkaToday();
  const reload = () => {
    window.BGNJ_HANGYEON.units().then(setUnits);
    window.BGNJ_HANGYEON.refreshRoomTypes({ includeAll: true }).then(setRooms);
    window.BGNJ_HANGYEON.adminBookings().then(setBookings);
  };
  React.useEffect(() => { reload(); }, []);
  const setStatus = async (u, status) => { await window.BGNJ_HANGYEON.updateUnit(u.id, { status }); reload(); };
  const addUnit = async () => { if (!adding.unitNo.trim()) return; await window.BGNJ_HANGYEON.createUnit(adding); setAdding(null); reload(); };
  const delUnit = async (u) => { if (!(await window.BGNJ_CONFIRM(`${u.unitNo} 삭제?`, { danger: true }))) return; await window.BGNJ_HANGYEON.deleteUnit(u.id); reload(); };

  const todayIn = bookings.filter((b) => b.checkIn === today && !['cancelled', 'no_show'].includes(b.status));
  const todayOut = bookings.filter((b) => b.checkOut === today && !['cancelled', 'no_show'].includes(b.status));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: 14, flex: 1, minWidth: 220 }}>
          <strong style={{ fontSize: 13 }}>오늘 체크인 ({todayIn.length})</strong>
          {todayIn.map((b) => <div key={b.id} className="dim-2" style={{ fontSize: 12, marginTop: 4 }}>{b.name} · {b.roomTypeName} {b.roomAssignment ? `(${b.roomAssignment})` : ''}</div>)}
          {todayIn.length === 0 && <p className="dim" style={{ fontSize: 12, margin: '4px 0 0' }}>없음</p>}
        </div>
        <div className="card" style={{ padding: 14, flex: 1, minWidth: 220 }}>
          <strong style={{ fontSize: 13 }}>오늘 체크아웃 ({todayOut.length})</strong>
          {todayOut.map((b) => <div key={b.id} className="dim-2" style={{ fontSize: 12, marginTop: 4 }}>{b.name} · {b.roomTypeName} {b.roomAssignment ? `(${b.roomAssignment})` : ''}</div>)}
          {todayOut.length === 0 && <p className="dim" style={{ fontSize: 12, margin: '4px 0 0' }}>없음</p>}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h4 style={{ margin: 0 }}>객실 상태</h4>
          <button type="button" className="btn btn-small btn-gold" onClick={() => setAdding({ roomTypeId: rooms[0]?.id || '', unitNo: '', status: 'vacant', note: '' })}>+ 객실 단위</button>
        </div>
        {adding && (
          <div className="card" style={{ padding: 12, marginBottom: 10, display: 'flex', gap: 8, alignItems: 'end', flexWrap: 'wrap' }}>
            <label style={{ fontSize: 12 }}>객실타입
              <select className="field-input" value={adding.roomTypeId} onChange={(e) => setAdding({ ...adding, roomTypeId: e.target.value })}>{rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
            </label>
            <label style={{ fontSize: 12 }}>호실<input className="field-input" value={adding.unitNo} onChange={(e) => setAdding({ ...adding, unitNo: e.target.value })} placeholder="101" /></label>
            <button type="button" className="btn btn-small btn-gold" onClick={addUnit}>추가</button>
            <button type="button" className="btn btn-small" onClick={() => setAdding(null)}>취소</button>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 8 }}>
          {units.map((u) => (
            <div key={u.id} className="card" style={{ padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{u.unitNo || '(호실)'}</strong>
                <button type="button" className="btn btn-small" onClick={() => delUnit(u)} style={{ padding: '2px 6px' }}>✕</button>
              </div>
              <div className="dim-2" style={{ fontSize: 11, marginBottom: 6 }}>{u.roomTypeName}</div>
              <span className="badge" style={{ borderColor: HKA_UNIT_COLOR[u.status], color: HKA_UNIT_COLOR[u.status] }}>{HKA_UNIT[u.status] || u.status}</span>
              <select className="field-input" style={{ marginTop: 6, fontSize: 12 }} value={u.status} onChange={(e) => setStatus(u, e.target.value)}>
                {Object.keys(HKA_UNIT).map((k) => <option key={k} value={k}>{HKA_UNIT[k]}</option>)}
              </select>
            </div>
          ))}
          {units.length === 0 && <p className="dim" style={{ fontSize: 13 }}>등록된 객실 단위가 없습니다.</p>}
        </div>
      </div>
    </div>
  );
};

// ── 0) 숙소 정보 (이름/소개/주소/찾아가는길/대표사진) — site_content_kv.hangyeon ──
const HkaProperty = () => {
  const init = () => {
    const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
    const h = sc.hangyeon || {};
    return { name: h.name || '전주한켠', tagline: h.tagline || '', desc: h.desc || '', address: h.address || '', directions: h.directions || '', notice: h.notice || '', images: Array.isArray(h.images) ? h.images : [] };
  };
  const [form, setForm] = React.useState(init);
  const up = (patch) => setForm((f) => ({ ...f, ...patch }));
  const save = async () => {
    try { await window.BGNJ_SITE_CONTENT.saveSection('hangyeon', form); hkaFlash('숙소 정보 저장됨.'); }
    catch (err) { hkaFlash(err?.body?.error || err?.message || '저장 실패', false); }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p className="dim" style={{ fontSize: 13, margin: 0 }}>손님이 보는 한켠 소개 페이지(자고 놀자) 내용입니다. 사진은 없어도 예약은 정상 동작합니다.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label style={{ fontSize: 12 }}>숙소 이름<input className="field-input" value={form.name} onChange={(e) => up({ name: e.target.value })} /></label>
        <label style={{ fontSize: 12 }}>한 줄 소개(태그라인)<input className="field-input" value={form.tagline} onChange={(e) => up({ tagline: e.target.value })} placeholder="전주 도심 속, 조용한 하룻밤" /></label>
      </div>
      <label style={{ fontSize: 12 }}>소개글<textarea className="field-input" rows={3} value={form.desc} onChange={(e) => up({ desc: e.target.value })} /></label>
      <label style={{ fontSize: 12 }}>주소<input className="field-input" value={form.address} onChange={(e) => up({ address: e.target.value })} placeholder="전북 전주시 덕진구 팔달로 340-37" /></label>
      <label style={{ fontSize: 12 }}>찾아가는 길<textarea className="field-input" rows={3} value={form.directions} onChange={(e) => up({ directions: e.target.value })} /></label>
      <label style={{ fontSize: 12 }}>안내/공지(선택)<textarea className="field-input" rows={2} value={form.notice} onChange={(e) => up({ notice: e.target.value })} placeholder="입실 15:00 / 퇴실 11:00 등" /></label>
      {window.MediaGalleryEditor && (
        <window.MediaGalleryEditor value={form.images} onChange={(imgs) => up({ images: imgs })} folder="hangyeon" label="숙소 대표 사진 (선택)" helpText="없어도 예약은 가능합니다." max={10} />
      )}
      <button type="button" className="btn btn-gold" style={{ alignSelf: 'flex-start' }} onClick={save}>숙소 정보 저장</button>
    </div>
  );
};

// ── 메인 패널 (8 탭) ───────────────────────────────────────────────────────
const HK_TABS = [
  ['숙소', HkaProperty], ['객실', HkaRoomTypes], ['요금', HkaRates], ['재고', HkaAvailability],
  ['예약', HkaBookings], ['고객', HkaGuests], ['결제', HkaPayments], ['운영', HkaOperation],
];
const HangyeonAdminPanel = () => {
  const [tab, setTab] = React.useState('객실');
  const Active = (HK_TABS.find((t) => t[0] === tab) || HK_TABS[0])[1];
  return (
    <div>
      <p className="dim" style={{ fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        <strong className="gold">한켠 예약 관리 (PMS)</strong> — 전주 숙소. 객실·요금·재고·예약·고객·결제·운영 통합 관리. 데이터는 D1 서버 저장.
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18, borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
        {HK_TABS.map(([name]) => (
          <button key={name} type="button" className="btn btn-small"
            style={{ background: tab === name ? 'var(--secondary)' : 'var(--bg)', color: tab === name ? '#fff' : 'var(--ink)' }}
            onClick={() => setTab(name)}>{name}</button>
        ))}
      </div>
      <Active />
    </div>
  );
};

Object.assign(window, { HangyeonAdminPanel });

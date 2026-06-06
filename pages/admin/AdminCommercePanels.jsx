// 뱅기노자 — 결제/주문 관리 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// BankAccountPanel(무통장 입금 계좌 CRUD) · BGNJ_BankAccountPicker(결제 화면 셀렉터) ·
// BookOrderAdminPanel(책 주문 관리).
// 자기완결적 — 의존은 모두 window 전역(BGNJ_API/LECTURES/CONFIRM/TOAST/FMT 등).
// ⚠️ BGNJ_BankAccountPicker 는 공개 결제 페이지가 window guard 로 소비 — 현 동작상 admin 번들 한정(기존 동작 보존).
// entry-admin 에서 AuthAdminPage 앞에 로드. BankAccountPanel·BookOrderAdminPanel window 노출.

// === Bank Account Settings Panel ==================================
// 무통장 입금 계좌 — 멀티 계좌 CRUD. 강연/투어/책 결제 화면에서 계좌 선택 가능.
const BankAccountPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [accounts, setAccounts] = React.useState(() => window.BGNJ_LECTURES.listBankAccounts());
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({ label: '', bankName: '', accountNumber: '', holder: '', memo: '', isDefault: false });
  const [msg, setMsg] = React.useState('');

  const refresh = async () => {
    await window.BGNJ_LECTURES.refreshBankAccount();
    setAccounts(window.BGNJ_LECTURES.listBankAccounts());
    setTick((v) => v + 1);
  };

  React.useEffect(() => {
    refresh();
    const onR = () => setAccounts(window.BGNJ_LECTURES.listBankAccounts());
    window.addEventListener('bgnj-bank-accounts-refresh', onR);
    return () => window.removeEventListener('bgnj-bank-accounts-refresh', onR);
  }, []);

  const startEdit = (a) => {
    setEditingId(a.id);
    setDraft({
      label: a.label || '', bankName: a.bankName || '', accountNumber: a.accountNumber || '',
      holder: a.holder || '', memo: a.memo || '', isDefault: !!a.isDefault,
    });
  };
  const startNew = () => {
    setEditingId('new');
    setDraft({ label: '', bankName: '', accountNumber: '', holder: '', memo: '', isDefault: !accounts.length });
  };
  const cancel = () => { setEditingId(null); setMsg(''); };

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2400); };

  const save = async (e) => {
    e.preventDefault();
    if (!draft.label.trim()) return flash('✗ 계좌 이름을 입력해 주세요.');
    if (!draft.accountNumber.trim()) return flash('✗ 계좌번호를 입력해 주세요.');
    try {
      if (editingId === 'new') {
        await window.BGNJ_LECTURES.createBankAccount(draft);
      } else if (editingId) {
        await window.BGNJ_LECTURES.updateBankAccount(editingId, draft);
      }
      await refresh();
      setEditingId(null);
      flash('✓ 저장되었습니다.');
    } catch (err) {
      flash('✗ 저장 실패: ' + (err?.body?.error || err?.message || '알 수 없는 오류'));
    }
  };

  const remove = async (a) => {
    if (!(await window.BGNJ_CONFIRM(`"${a.label}" 계좌를 삭제하시겠습니까?`, { danger: true }))) return;
    try {
      await window.BGNJ_LECTURES.deleteBankAccount(a.id);
      await refresh();
      flash('✓ 삭제되었습니다.');
    } catch (err) {
      flash('✗ 삭제 실패: ' + (err?.message || ''));
    }
  };

  const setDefault = async (a) => {
    try {
      await window.BGNJ_LECTURES.updateBankAccount(a.id, { isDefault: true });
      await refresh();
      flash('✓ 기본 계좌가 변경되었습니다.');
    } catch (err) { flash('✗ 변경 실패: ' + (err?.message || '')); }
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:14, lineHeight:1.8}}>
        무통장 입금 계좌를 여러 개 등록할 수 있습니다. <strong className="gold">기본 계좌</strong>는 결제 화면에서 자동 선택되며, 사용자가 다른 계좌를 선택할 수도 있습니다.
      </p>

      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:14}}>
        <button type="button" className="btn btn-small btn-gold" onClick={startNew}>＋ 새 계좌 추가</button>
      </div>

      <div style={{overflowX:'auto', border:'1px solid var(--line)'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:880}}>
          <thead>
            <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
              <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:140}}>이름 (라벨)</th>
              <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:120}}>은행</th>
              <th scope="col" style={{padding:'12px 14px', textAlign:'left'}}>계좌번호</th>
              <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:120}}>예금주</th>
              <th scope="col" style={{padding:'12px 14px', textAlign:'center', width:100}}>기본</th>
              <th scope="col" style={{padding:'12px 14px', textAlign:'right', width:200}}>작업</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr><td colSpan={6} className="dim" style={{padding:32, textAlign:'center'}}>등록된 계좌가 없습니다. "＋ 새 계좌 추가" 를 눌러 시작하세요.</td></tr>
            ) : accounts.map((a) => (
              <tr key={a.id} style={{borderTop:'1px solid var(--line)'}}>
                <td className="ko-serif" style={{padding:'12px 14px', fontWeight:500}}>{a.label}</td>
                <td style={{padding:'12px 14px'}}>{a.bankName || '-'}</td>
                <td className="mono" style={{padding:'12px 14px'}}>{a.accountNumber || '-'}</td>
                <td style={{padding:'12px 14px'}}>{a.holder || '-'}</td>
                <td style={{padding:'12px 14px', textAlign:'center'}}>
                  {a.isDefault ? (
                    <span className="badge badge-gold" style={{fontSize:10}}>기본</span>
                  ) : (
                    <button type="button" className="btn-ghost" onClick={() => setDefault(a)}
                      style={{fontSize:11, color:'var(--ink-3)'}}>기본으로</button>
                  )}
                </td>
                <td style={{padding:'12px 14px', textAlign:'right'}}>
                  <button type="button" className="btn btn-small" onClick={() => startEdit(a)} style={{marginRight:6}}>수정</button>
                  <button type="button" className="btn btn-small" onClick={() => remove(a)}
                    style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {msg && (
        <div role="status" style={{
          marginTop:14, padding:'10px 14px',
          border: msg.startsWith('✗') ? '1px solid var(--danger)' : '1px solid var(--primary-dim)',
          background: msg.startsWith('✗') ? 'rgba(194,74,61,0.06)' : 'rgba(245,213,72,0.06)',
          color: msg.startsWith('✗') ? 'var(--danger)' : 'var(--primary)', fontSize:13,
        }}>{msg}</div>
      )}

      {editingId && (
        <form onSubmit={save} className="card" style={{padding:24, marginTop:18, maxWidth:720}}>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>
            {editingId === 'new' ? 'NEW ACCOUNT' : 'EDIT ACCOUNT'}
          </div>
          <h2 className="ko-serif" style={{fontSize:18, marginBottom:14}}>
            {editingId === 'new' ? '새 계좌 추가' : '계좌 수정'}
          </h2>
          <div style={{display:'grid', gap:12}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label">계좌 이름 (라벨) <span className="gold">*</span></label>
              <input className="field-input" placeholder="예) 강연 입금용 / 책 주문용 / 메인"
                value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })}/>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div className="field" style={{margin:0}}>
                <label className="field-label">은행</label>
                <input className="field-input" placeholder="예) 국민은행"
                  value={draft.bankName} onChange={(e) => setDraft({ ...draft, bankName: e.target.value })}/>
              </div>
              <div className="field" style={{margin:0}}>
                <label className="field-label">예금주</label>
                <input className="field-input" placeholder="예) 뱅기노자"
                  value={draft.holder} onChange={(e) => setDraft({ ...draft, holder: e.target.value })}/>
              </div>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">계좌번호 <span className="gold">*</span></label>
              <input className="field-input" placeholder="예) 123-456-7890123"
                value={draft.accountNumber} onChange={(e) => setDraft({ ...draft, accountNumber: e.target.value })}/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">안내 메모 (선택)</label>
              <textarea className="field-input" rows={2}
                placeholder="입금자명에 신청자 본명 + 신청번호를 남겨 주세요."
                value={draft.memo} onChange={(e) => setDraft({ ...draft, memo: e.target.value })}/>
            </div>
            <label style={{display:'flex', alignItems:'center', gap:8, fontSize:13}}>
              <input type="checkbox" style={{accentColor:'var(--primary)'}}
                checked={draft.isDefault}
                onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })}/>
              기본 계좌로 사용 (결제 화면에서 자동 선택)
            </label>
          </div>
          <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:18, paddingTop:14, borderTop:'1px solid var(--line)'}}>
            <button type="button" className="btn" onClick={cancel}>취소</button>
            <button type="submit" className="btn btn-gold">{editingId === 'new' ? '추가' : '저장'}</button>
          </div>
        </form>
      )}
    </div>
  );
};

// 결제 화면용 — 멀티 계좌 셀렉터 + 안내 박스. 모든 결제 흐름(강연/투어/책) 에서 재사용.
// 멀티 계좌가 없으면 단일 getBankAccount 폴백을 단일 옵션으로 노출. 둘 다 없으면 안내 메시지.
window.BGNJ_BankAccountPicker = ({ value, onChange, accounts, refreshOnMount = true }) => {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (refreshOnMount) {
      window.BGNJ_LECTURES?.refreshBankAccount?.().then(() => setTick((v) => v + 1));
    }
    const onR = () => setTick((v) => v + 1);
    window.addEventListener('bgnj-bank-accounts-refresh', onR);
    return () => window.removeEventListener('bgnj-bank-accounts-refresh', onR);
  }, []);
  const multi = (accounts && accounts.length) ? accounts : (window.BGNJ_LECTURES?.listBankAccounts?.() || []);
  const list = multi.length
    ? multi
    : (() => {
      const single = window.BGNJ_LECTURES?.getBankAccount?.() || {};
      return single.accountNumber
        ? [{ id: 'default', label: '기본 계좌', isDefault: true,
            bankName: single.bankName, accountNumber: single.accountNumber,
            holder: single.holder, memo: single.memo }]
        : [];
    })();
  if (!list.length) {
    return (
      <div style={{padding:'12px 14px', border:'1px solid var(--danger)', background:'rgba(194,74,61,0.05)', color:'var(--danger)', fontSize:12, lineHeight:1.6}}>
        ⚠ 등록된 입금 계좌가 없습니다. 운영자에게 문의해 주세요.
      </div>
    );
  }
  const selected = list.find((a) => a.id === value) || list.find((a) => a.isDefault) || list[0];
  // 첫 마운트 시 부모에 기본 선택 알림.
  React.useEffect(() => {
    if (selected && selected.id !== value && onChange) onChange(selected.id);
  }, [list.length]);
  return (
    <div style={{padding:'14px 16px', border:'1px solid var(--primary-dim)', background:'rgba(245,213,72,0.04)'}}>
      <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>BANK ACCOUNT · 입금 계좌</div>
      {list.length > 1 && (
        <div style={{marginBottom:12}}>
          <label className="dim-2 mono" style={{fontSize:11, display:'block', marginBottom:6}}>입금할 계좌 선택</label>
          <select className="field-input" style={{fontSize:13}}
            value={selected?.id || ''}
            onChange={(e) => onChange?.(e.target.value)}>
            {list.map((a) => (
              <option key={a.id} value={a.id}>{a.label}{a.isDefault ? ' (기본)' : ''}</option>
            ))}
          </select>
        </div>
      )}
      {selected && (
        <div style={{display:'grid', gridTemplateColumns:'90px 1fr', gap:'6px 14px', fontSize:13, lineHeight:1.6}}>
          <div className="dim-2 mono" style={{fontSize:11}}>은행</div>
          <div>{selected.bankName || '-'}</div>
          <div className="dim-2 mono" style={{fontSize:11}}>계좌번호</div>
          <div className="mono gold" style={{fontWeight:500}}>{selected.accountNumber || '-'}</div>
          <div className="dim-2 mono" style={{fontSize:11}}>예금주</div>
          <div>{selected.holder || '-'}</div>
          {selected.memo && (<>
            <div className="dim-2 mono" style={{fontSize:11}}>안내</div>
            <div>{selected.memo}</div>
          </>)}
        </div>
      )}
    </div>
  );
};

// === Book Orders Admin Panel ======================================
const BookOrderAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [filter, setFilter] = React.useState('pending_payment');
  const [trackingDraft, setTrackingDraft] = React.useState({});
  const refresh = () => setTick((v) => v + 1);

  // v00.262.006 — B1 split 회귀 패치. admin 패널은 _ordersAll 캐시를 읽는데, 마운트
  // 시점에 refreshAll() 트리거하는 곳이 boot 어디에도 없어 빈 목록 표시.
  // 이전엔 같은 _orders 캐시를 refreshMine 이 부분적으로 채워줬으나 분리되며 끊김.
  // 'bgnj-orders-refresh' 이벤트 listen + 진입 시 refreshAll 1회.
  React.useEffect(() => {
    let cancelled = false;
    window.BGNJ_BOOK_ORDERS?.refreshAll?.().finally(() => { if (!cancelled) refresh(); });
    const onR = () => { if (!cancelled) refresh(); };
    window.addEventListener('bgnj-orders-refresh', onR);
    return () => { cancelled = true; window.removeEventListener('bgnj-orders-refresh', onR); };
  }, []);

  const orders = React.useMemo(() => window.BGNJ_BOOK_ORDERS.listByStatus(filter), [filter, tick]);
  const [rejectNotes, setRejectNotes] = React.useState({});
  const counts = React.useMemo(() => ({
    all: window.BGNJ_BOOK_ORDERS.listAll().length,
    pending_payment: window.BGNJ_BOOK_ORDERS.listByStatus('pending_payment').length,
    paid: window.BGNJ_BOOK_ORDERS.listByStatus('paid').length,
    shipped: window.BGNJ_BOOK_ORDERS.listByStatus('shipped').length,
    delivered: window.BGNJ_BOOK_ORDERS.listByStatus('delivered').length,
    refund_requested: window.BGNJ_BOOK_ORDERS.listByStatus('refund_requested').length,
    cancelled: window.BGNJ_BOOK_ORDERS.listByStatus('cancelled').length,
  }), [tick]);

  const handleExportCsv = () => {
    downloadCsv(`book-orders-${new Date().toISOString().slice(0, 10)}.csv`, window.BGNJ_BOOK_ORDERS.exportCsv());
  };

  const statusLabel = (s) => ({
    pending_payment: '입금 대기',
    paid: '입금 확인',
    shipped: '배송중',
    delivered: '배송 완료',
    refund_requested: '환불 신청',
    cancelled: '취소됨',
  }[s] || s);

  const statusTone = (s) => ({
    pending_payment: 'var(--ink-2)',
    paid: 'var(--primary)',
    shipped: 'var(--primary)',
    delivered: 'var(--primary-hover)',
    refund_requested: 'var(--warning)',
    cancelled: 'var(--danger)',
  }[s] || 'var(--ink-2)');

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        뱅기노자 도서 주문은 회원 전용·무통장 입금 단일 흐름입니다.
        주문 → 입금 확인 → 발송 → 배송 완료 순으로 상태를 직접 진행하세요.
        계좌번호는 <strong className="gold">시스템 → 설정</strong> 탭에서 등록·수정합니다.
      </p>

      <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'center', flexWrap:'wrap', marginBottom:18}}>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {[
            { key: 'pending_payment',  label: '입금 대기' },
            { key: 'paid',             label: '입금 확인' },
            { key: 'shipped',          label: '배송중' },
            { key: 'delivered',        label: '배송 완료' },
            { key: 'refund_requested', label: '환불 신청' },
            { key: 'cancelled',        label: '취소' },
            { key: 'all',              label: '전체' },
          ].map((f) => (
            <button key={f.key} type="button" className="btn btn-small"
              onClick={() => setFilter(f.key)}
              style={{
                borderColor: filter === f.key ? 'var(--primary)' : 'var(--line)',
                color: filter === f.key ? 'var(--primary)' : 'var(--ink-2)',
                background: filter === f.key ? 'rgba(245,213,72,0.06)' : 'transparent',
              }}>
              {f.label} <span className="mono dim-2" style={{ fontSize: 10, marginLeft: 4 }}>{counts[f.key] ?? 0}</span>
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-small" onClick={handleExportCsv}>CSV 다운로드</button>
      </div>

      {orders.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>해당 상태의 주문이 없습니다.</div>
      ) : (
        <div style={{display:'grid', gap:12}}>
          {orders.map((o) => (
            <article key={o.id} className="card" style={{padding:18}}>
              <header style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                <div style={{display:'flex', gap:10, alignItems:'baseline', flexWrap:'wrap'}}>
                  <span className="mono gold" style={{fontSize:12, letterSpacing:'0.16em'}}>{o.orderNo}</span>
                  <span className="mono dim-2" style={{fontSize:11}}>{window.BGNJ_FMT.kstDateTime(o.createdAt)}</span>
                </div>
                <span className="mono" style={{fontSize:10, letterSpacing:'0.22em', color: statusTone(o.status)}}>
                  {statusLabel(o.status).toUpperCase()}{o.paid && o.status === 'paid' && ' · 입금 ✓'}
                </span>
              </header>

              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12, marginBottom:14}}>
                <div>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:4}}>BOOK</div>
                  <div style={{fontSize:13}}>『{window.BGNJ_BOOK_ORDERS.getOrderBookTitle(o)}』 · {o.version === 'KR' ? '국문판' : '영문판'} × {o.qty}</div>
                </div>
                <div>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:4}}>AMOUNT</div>
                  <div className="gold ko-serif" style={{fontSize:18}}>{window.BGNJ_FMT.won(o.total)}</div>
                  <div className="dim-2 mono" style={{fontSize:10}}>상품 {window.BGNJ_FMT.currency(o.subtotal)} + 배송 {window.BGNJ_FMT.currency(o.shipping)}</div>
                </div>
                <div>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:4}}>RECIPIENT</div>
                  <div style={{fontSize:13, lineHeight:1.6}}>{o.recipient} · {o.phone}</div>
                </div>
                <div>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:4}}>SHIP TO</div>
                  <div style={{fontSize:12, lineHeight:1.6}}>{o.address} {o.addressDetail}</div>
                  {o.memo && <div className="dim-2" style={{fontSize:11, marginTop:2}}>· {o.memo}</div>}
                </div>
              </div>

              <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', borderTop:'1px solid var(--line)', paddingTop:12}}>
                <button type="button" className="btn btn-small"
                  onClick={() => window.BGNJ_BOOK_ORDERS.downloadReceipt(o.id)}>영수증 ↓</button>
                {/* v00.261 — admin 영구 삭제. 테스트/오발주 청소 용도. audit_log 자동 기록.
                    한국 전자상거래법 거래기록 5년 보존은 '실거래' 한정 — 테스트 주문 적용 외. */}
                <button type="button" className="btn btn-small"
                  title="이 주문 기록을 영구 삭제합니다 (감사 로그 남음)"
                  onClick={async () => {
                    const ok = await window.BGNJ_CONFIRM(
                      `주문 ${o.orderNo} 기록을 영구 삭제하시겠어요?\n\n실제 결제·배송이 진행된 거래라면 삭제 대신 '취소' 처리를 권장합니다.\n삭제는 되돌릴 수 없으며 감사 로그에 흔적이 남습니다.`,
                      { danger: true, confirmLabel: '영구 삭제' }
                    );
                    if (!ok) return;
                    const res = await window.BGNJ_BOOK_ORDERS.adminDeleteOrder(o.id);
                    if (!res?.ok) {
                      try { window.BGNJ_TOAST?.error?.(res?.message || '주문 삭제 실패'); } catch {}
                      return;
                    }
                    try { window.BGNJ_TOAST?.success?.(`주문 ${o.orderNo} 삭제 완료`); } catch {}
                    refresh();
                  }}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>
                  삭제
                </button>
                {o.status === 'pending_payment' && (
                  <button type="button" className="btn btn-small"
                    onClick={() => { window.BGNJ_BOOK_ORDERS.confirmPayment(o.id); refresh(); }}>
                    입금 확인 → 발송 준비
                  </button>
                )}
                {o.status === 'paid' && (
                  <>
                    <input
                      className="field-input"
                      placeholder="송장 번호 (선택)"
                      style={{padding:'6px 10px', maxWidth:200}}
                      value={trackingDraft[o.id] || ''}
                      onChange={(e) => setTrackingDraft({ ...trackingDraft, [o.id]: e.target.value })}/>
                    <button type="button" className="btn btn-small"
                      onClick={() => {
                        window.BGNJ_BOOK_ORDERS.markShipped(o.id, trackingDraft[o.id] || '');
                        refresh();
                      }}>
                      발송 처리
                    </button>
                    <button type="button" className="btn btn-small"
                      onClick={() => { window.BGNJ_BOOK_ORDERS.unconfirmPayment(o.id); refresh(); }}>
                      입금 확인 취소
                    </button>
                  </>
                )}
                {o.status === 'shipped' && (
                  <>
                    {o.tracking && <span className="mono dim-2" style={{fontSize:11}}>송장 {o.tracking}</span>}
                    <button type="button" className="btn btn-small"
                      onClick={() => { window.BGNJ_BOOK_ORDERS.markDelivered(o.id); refresh(); }}>
                      배송 완료 처리
                    </button>
                  </>
                )}
                {o.status === 'delivered' && o.tracking && (
                  <span className="mono dim-2" style={{fontSize:11}}>송장 {o.tracking} · 도착 {o.deliveredAt ? window.BGNJ_FMT.kstDate(o.deliveredAt) : ''}</span>
                )}
                {(o.status === 'pending_payment' || o.status === 'paid') && (
                  <button type="button" className="btn btn-small"
                    onClick={async () => {
                      if (!(await window.BGNJ_CONFIRM(`주문 ${o.orderNo}을(를) 취소 처리하시겠어요?`, { danger: true }))) return;
                      window.BGNJ_BOOK_ORDERS.cancelOrder(o.id);
                      refresh();
                    }}
                    style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:'auto'}}>
                    주문 취소
                  </button>
                )}
                {o.status === 'refund_requested' && (
                  <>
                    <div style={{width:'100%', paddingTop:8, borderTop:'1px solid var(--line)', marginTop:4}}>
                      <div style={{display:'flex', gap:6, alignItems:'center', marginBottom:6}}>
                        <span className="mono" style={{fontSize:10, color:'var(--warning)', letterSpacing:'0.2em'}}>REFUND REQUEST</span>
                        <span className="dim" style={{fontSize:12}}>사유: {o.refundReason || '(미입력)'}</span>
                      </div>
                      <div style={{display:'flex', gap:6, alignItems:'center', flexWrap:'wrap'}}>
                        <button type="button" className="btn btn-small"
                          onClick={async () => {
                            if (!(await window.BGNJ_CONFIRM(`환불을 승인하시겠어요? 주문 ${o.orderNo}이 취소됩니다.`, { danger: true }))) return;
                            window.BGNJ_BOOK_ORDERS.approveRefund(o.id);
                            refresh();
                          }}
                          style={{borderColor:'var(--primary)', color:'var(--secondary)'}}>
                          환불 승인
                        </button>
                        <input className="field-input"
                          placeholder="반려 사유 (선택)"
                          style={{padding:'5px 8px', fontSize:12, maxWidth:200}}
                          value={rejectNotes[o.id] || ''}
                          onChange={(e) => setRejectNotes({ ...rejectNotes, [o.id]: e.target.value })}/>
                        <button type="button" className="btn btn-small"
                          onClick={async () => {
                            if (!(await window.BGNJ_CONFIRM(`환불 신청을 반려하시겠어요?`, { danger: true }))) return;
                            window.BGNJ_BOOK_ORDERS.rejectRefund(o.id, rejectNotes[o.id] || '');
                            refresh();
                          }}
                          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>
                          환불 반려
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
window.BankAccountPanel = BankAccountPanel;
window.BookOrderAdminPanel = BookOrderAdminPanel;

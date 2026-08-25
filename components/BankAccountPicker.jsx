// 뱅기노자 — 입금 계좌 안내 (무통장 입금)
//
// v00.310.000 — `pages/admin/AdminCommercePanels.jsx` 에서 옮겨 왔다.
//
// ⚠ **왜 옮겼나 — 관리자 번들에만 있어서 일반 구매자에게는 통째로 안 보였다.**
//   이 컴포넌트를 쓰는 곳은 셋 다 메인 번들이다:
//     BookCheckoutPage(책 주문 완료) · LecturesPage(강연 신청) · WangsanamTourPage(답사 신청).
//   그런데 정의는 `dist/admin.js` 에만 실려 있었고, 그 번들은 boot 가
//   `['admin','login','signup']` 경로에서만 동적 주입한다.
//   → 세션이 살아 있는 사람이 곧바로 결제 화면에 들어가면 `window.BGNJ_BankAccountPicker`
//     가 undefined 이고, 사용처가 전부 `: null` 이라 **입금 계좌가 한 줄도 안 뜬다.**
//     '입금 금액'과 '입금자명을 남겨 주세요'만 남는다 — 어디로 보내라는 말이 없다.
//
//   눈에 안 띈 이유가 고약하다. 운영자는 보통 **로그인을 거쳐** 확인하는데,
//   로그인 경로가 admin 번들을 끌어오므로 그 순간에는 멀쩡히 보인다.
//   증상이 나타나는 건 '이미 로그인된 채로 바로 결제로 간 손님' 뿐이다.
//
//   → `tools/check-globals.mjs` 가 이제 **번들 경계를 함께 본다.**
//     메인에서 쓰는 전역을 관리자 파일에서만 등록하면 커밋이 막힌다.
//
// 의존은 React 와 `window.BGNJ_LECTURES`(메인 번들) 뿐이라 그대로 옮겨진다.

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

// v00.295.002 — 세금계산서 발행 요청 공용 필드.
// 사용자 요청(대량 구매 시 세금계산서 가능)으로 신설. 현재는 책 결제 흐름에서만 쓴다.
//
// API
//   value: { requested: bool, name: string, bizNo: string, ceo: string, email: string }
//   onChange(next)
//
// 데이터 저장:
//   현금영수증(v00.218)처럼 memo 에 얹지 않는다. book_orders 의 정식 컬럼에 넣는다
//   (schema-v12: tax_invoice / biz_name / biz_no / biz_ceo / biz_email).
//   메모에 자유 문장으로 받으면 운영자가 어떤 주문이 대상인지 골라낼 수 없고,
//   등록번호가 빠져도 걸러지지 않는다.
//
// 운영자: 입금 확인 후 국세청 홈택스에서 전자세금계산서를 발행해 biz_email 로 보낸다.

const _emptyTaxInvoice = () => ({ requested: false, name: '', bizNo: '', ceo: '', email: '' });

// 사업자등록번호는 숫자 10자리다. 하이픈은 사람이 넣든 말든 받아주고 저장할 때 정리한다.
const _digits = (v) => String(v || '').replace(/[^0-9]/g, '');
const formatBizNo = (v) => {
  const d = _digits(v).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
};
const isValidBizNo = (v) => _digits(v).length === 10;

// 채워야 할 칸이 다 찼는지. 결제 버튼을 막는 판정에 쓴다.
const validateTaxInvoice = (value) => {
  const v = value || {};
  if (!v.requested) return '';
  if (!String(v.name || '').trim()) return '세금계산서를 받을 상호를 입력해 주세요.';
  if (!isValidBizNo(v.bizNo)) return '사업자등록번호는 숫자 10자리입니다.';
  if (!String(v.email || '').includes('@')) return '세금계산서를 받을 이메일을 입력해 주세요.';
  return '';
};

const TaxInvoiceField = ({ value, onChange }) => {
  const v = value || _emptyTaxInvoice();
  const set = (patch) => onChange?.({ ...v, ...patch });
  const bizNoTouched = String(v.bizNo || '').length > 0;
  const bizNoBad = bizNoTouched && !isValidBizNo(v.bizNo);

  return (
    <div className="field" style={{margin:'0 0 14px'}}>
      <div className="field-label" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <span>세금계산서</span>
        <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em'}}>TAX INVOICE</span>
      </div>
      <div style={{display:'flex', gap:8, marginBottom: v.requested ? 10 : 0, flexWrap:'wrap'}}>
        {[
          { k: false, l: '미신청' },
          { k: true,  l: '발행 요청' },
        ].map((opt) => {
          const active = v.requested === opt.k;
          return (
            <button key={String(opt.k)} type="button"
              onClick={() => set({ requested: opt.k })}
              aria-pressed={active}
              style={{
                padding:'8px 16px', fontSize:13,
                background: active ? 'rgba(245,213,72,0.14)' : 'var(--bg)',
                color: active ? 'var(--secondary)' : 'var(--ink-2)',
                border: '1px solid ' + (active ? 'var(--primary)' : 'var(--line)'),
                fontWeight: active ? 700 : 500,
                cursor:'pointer',
              }}>
              {opt.l}
            </button>
          );
        })}
      </div>
      {v.requested && (
        <div style={{display:'grid', gap:10, padding:'12px 14px', background:'var(--bg-2)', border:'1px solid var(--line)'}}>
          <div className="field" style={{margin:0}}>
            <label className="field-label" style={{fontSize:11}}>상호 (법인명)</label>
            <input type="text" className="field-input"
              value={v.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="예: 주식회사 뱅기노자"
              autoComplete="organization"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" style={{fontSize:11}}>사업자등록번호</label>
            <input type="text" className="field-input"
              value={v.bizNo}
              onChange={(e) => set({ bizNo: formatBizNo(e.target.value) })}
              placeholder="000-00-00000"
              inputMode="numeric"
              autoComplete="off"/>
            {bizNoBad && (
              <div style={{fontSize:11, marginTop:5, color:'var(--danger)'}}>숫자 10자리를 입력해 주세요.</div>
            )}
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" style={{fontSize:11}}>대표자명 <span className="dim-2">(선택)</span></label>
            <input type="text" className="field-input"
              value={v.ceo}
              onChange={(e) => set({ ceo: e.target.value })}
              placeholder="대표자 성함"
              autoComplete="off"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" style={{fontSize:11}}>계산서 받을 이메일</label>
            <input type="email" className="field-input"
              value={v.email}
              onChange={(e) => set({ email: e.target.value })}
              placeholder="tax@example.com"
              autoComplete="email"/>
          </div>
          <div className="dim-2" style={{fontSize:11, lineHeight:1.7, wordBreak:'keep-all'}}>
            ⓘ 입금 확인 후 전자세금계산서를 위 이메일로 보내 드립니다.
            현금영수증과는 <strong className="gold">중복 발행이 안 됩니다</strong> — 둘 중 하나만 신청해 주세요.
          </div>
        </div>
      )}
    </div>
  );
};

window.BGNJ_TaxInvoiceField = TaxInvoiceField;
window.BGNJ_TaxInvoice = {
  empty: _emptyTaxInvoice,
  validate: validateTaxInvoice,
  isValidBizNo,
  formatBizNo,
  digits: _digits,
};

// v00.218 — 현금영수증 신청 공용 필드.
// 책 결제 / 강연 신청 / 투어 신청 3 결제 흐름에서 동일하게 사용.
//
// API
//   value: { requested: bool, type: 'personal'|'business', identifier: string }
//   onChange(next)
//
// 데이터 저장 (단기 — 백엔드 스키마 마이그레이션 전):
//   주문/신청의 memo / note 필드에 BGNJ_CashReceipt.encode(value) 가 만든 prefix 를 prepend.
//   prefix 형식: `[현금영수증 신청 — 개인 소득공제 / 식별번호: 010-...]\n`
//   미신청 시 prefix 없음.
//
// 운영자: 결제 확인 시 memo 첫 줄을 보고 3일 이내 국세청 현금영수증 가맹점 발급 시스템에서 처리.
// 사용자에게는 폼 하단에 SLA 안내(3일 이내, 미확인 시 당해 연락) 노출.

const _emptyCashReceipt = () => ({ requested: false, type: 'personal', identifier: '' });

const CashReceiptField = ({ value, onChange }) => {
  const v = value || _emptyCashReceipt();
  const set = (patch) => onChange?.({ ...v, ...patch });

  const idLabel = v.type === 'business' ? '사업자등록번호' : '휴대폰 번호';
  const idPlaceholder = v.type === 'business' ? '000-00-00000' : '010-0000-0000';

  return (
    <div className="field" style={{margin:'0 0 14px'}}>
      <div className="field-label" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <span>현금영수증</span>
        <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em'}}>CASH RECEIPT</span>
      </div>
      <div style={{display:'flex', gap:8, marginBottom: v.requested ? 10 : 0, flexWrap:'wrap'}}>
        {[
          { k: false, l: '미신청' },
          { k: true,  l: '신청' },
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
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            {[
              { k: 'personal', l: '개인 소득공제' },
              { k: 'business', l: '사업자 지출증빙' },
            ].map((opt) => {
              const active = v.type === opt.k;
              return (
                <button key={opt.k} type="button"
                  onClick={() => set({ type: opt.k })}
                  aria-pressed={active}
                  style={{
                    padding:'7px 10px', fontSize:12,
                    background: active ? 'rgba(245,213,72,0.10)' : 'var(--bg)',
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
          <div className="field" style={{margin:0}}>
            <label className="field-label" style={{fontSize:11}}>{idLabel}</label>
            <input type="text" className="field-input"
              value={v.identifier}
              onChange={(e) => set({ identifier: e.target.value })}
              placeholder={idPlaceholder}
              autoComplete="off"
              inputMode={v.type === 'business' ? 'numeric' : 'tel'}/>
          </div>
          <div className="dim-2" style={{fontSize:11, lineHeight:1.7}}>
            ⓘ 입금 확인 후 <strong className="gold">3일 이내</strong> 국세청 현금영수증 가맹점 시스템에서 발급됩니다.
            발급이 확인되지 않으면 <strong className="gold">당해(연내)</strong>에 <a className="gold" href="mailto:contact@bgnj.net">contact@bgnj.net</a> 으로 연락 주세요.
          </div>
        </div>
      )}
    </div>
  );
};

// memo / note 필드 prepend 용 인코더. 미신청 시 빈 문자열.
const encodeCashReceipt = (value) => {
  const v = value || {};
  if (!v.requested) return '';
  const type = v.type === 'business' ? '사업자 지출증빙' : '개인 소득공제';
  const id = (v.identifier || '').trim() || '미입력';
  return `[현금영수증 신청 — ${type} / 식별번호: ${id}]\n`;
};

window.BGNJ_CashReceiptField = CashReceiptField;
window.BGNJ_CashReceipt = { encode: encodeCashReceipt, empty: _emptyCashReceipt };

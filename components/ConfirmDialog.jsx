// v00.206 — Promise 기반 확인 모달. window.confirm() 신규 도입 금지 원칙 준수.
// 사용:
//   const ok = await window.BGNJ_CONFIRM('정말 삭제하시겠습니까?', { danger: true, confirmLabel: '삭제' });
//   if (!ok) return;
// 또는 React 컴포넌트로 직접:
//   <ConfirmDialog open={...} title="..." message="..." onConfirm={...} onCancel={...}/>

// v00.263.004 — thirdLabel/onThird/thirdDanger 추가. 3-way prompt (예: 임시저장/취소/저장안하고닫기) 지원.
const ConfirmDialog = ({ open, title, message, hint, confirmLabel='확인', cancelLabel='취소', danger=false, dismissOnBackdrop=true, thirdLabel=null, thirdDanger=false, onConfirm, onCancel, onThird }) => {
  // v00.263.004 — useModalGuard 사용 제거.
  // 이전엔 useModalGuard 가 dialog 열림 시 history.pushState(sentinel) + 닫힘 시 history.back().
  // ConfirmDialog 가 부모 모달(예: PostComposeModal) 위에 떴다가 닫힐 때 history.back() →
  // popstate 이벤트가 부모 useModalGuard 의 onPop 핸들러 트리거 → handleAttemptClose 재호출 →
  // 같은 ConfirmDialog 가 즉시 다시 표시되는 무한 루프 (사용자 보고 "취소 누르면 잠시 사라졌다가
  // 다시 뜬다"의 진짜 원인).
  // ConfirmDialog 는 자체적으로 ESC + body scroll lock 만 처리. history sentinel 불필요.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        e.stopPropagation();
        onCancel?.();
      }
    };
    window.addEventListener('keydown', onKey, true);
    try { window.BGNJ_SCROLL_LOCK?.lock?.(); } catch {}
    return () => {
      window.removeEventListener('keydown', onKey, true);
      try { window.BGNJ_SCROLL_LOCK?.unlock?.(); } catch {}
    };
  }, [open, onCancel]);
  if (!open) return null;
  // v00.262.007 — 작성 모달의 임시저장 prompt 처럼 실수 클릭으로 데이터 잃는 일을 막아야 하는 경우
  // dismissOnBackdrop=false 로 호출. 일반 confirm 은 기존 동작 (백드롭=취소) 유지.
  return (
    <div role="dialog" aria-modal="true" aria-label={title || '확인'}
      onClick={dismissOnBackdrop ? onCancel : undefined}
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1100, display:'grid', placeItems:'center', padding:24}}>
      <div onClick={(e) => e.stopPropagation()}
        style={{background:'var(--bg)', maxWidth:460, width:'100%', padding:24, border:'1px solid var(--line)', boxShadow:'0 16px 40px rgba(0,0,0,0.25)'}}>
        {title && <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>{title}</h3>}
        {message && <p style={{fontSize:13, lineHeight:1.7, color:'var(--ink-2)', margin:0}}>{message}</p>}
        {hint && <p className="dim-2" style={{fontSize:12, lineHeight:1.6, marginTop:8, marginBottom:0}}>{hint}</p>}
        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:20, flexWrap:'wrap'}}>
          {/* v00.263.004 — third 버튼 (옵션). 좌측에 배치해 시각적으로 'destructive 우측' 흐름 유지. */}
          {thirdLabel && (
            <button type="button" className="btn" onClick={onThird}
              style={{marginRight:'auto', ...(thirdDanger ? {borderColor:'var(--danger)', color:'var(--danger)'} : {})}}>
              {thirdLabel}
            </button>
          )}
          <button type="button" className="btn" onClick={onCancel} autoFocus>{cancelLabel}</button>
          <button type="button" className={danger ? 'btn' : 'btn btn-gold'} onClick={onConfirm}
            style={danger ? {borderColor:'var(--danger)', color:'var(--danger)'} : undefined}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Promise 기반 imperative API — window.confirm() 1:1 대체.
// 본 컴포넌트는 boot.jsx 의 ConfirmDialogHost 가 root 에 마운트하고 있어야 동작.
const __confirmListeners = [];
const __subscribeConfirm = (fn) => { __confirmListeners.push(fn); return () => { const i = __confirmListeners.indexOf(fn); if (i >= 0) __confirmListeners.splice(i, 1); }; };

window.BGNJ_CONFIRM = (message, opts={}) => new Promise((resolve) => {
  const payload = {
    title: opts.title || '확인',
    message,
    hint: opts.hint || '',
    confirmLabel: opts.confirmLabel || '확인',
    cancelLabel: opts.cancelLabel || '취소',
    danger: !!opts.danger,
    // v00.262.007 — 명시적으로 false 가 전달된 경우만 백드롭 dismiss 비활성. 기본은 기존 동작 유지.
    dismissOnBackdrop: opts.dismissOnBackdrop !== false,
    resolve,
  };
  if (!__confirmListeners.length) {
    // Host 미마운트 — fallback (이론상 boot.jsx 에서 항상 마운트되므로 도달 안 함)
    try { resolve(window.confirm(message)); } catch { resolve(false); }
    return;
  }
  __confirmListeners.forEach((fn) => fn(payload));
});

// v00.263.004 — 3-way 임시저장 prompt 헬퍼.
// 결과: 'save' | 'discard' | 'cancel'
//   save    = 임시저장 후 닫기
//   discard = 저장 안 하고 닫기 (변경 폐기)
//   cancel  = 다이얼로그만 닫고 작성 모달 유지 (잘못 누른 케이스)
// 사용: const choice = await window.BGNJ_DRAFT_PROMPT('게시글', { ... });
window.BGNJ_DRAFT_PROMPT = (label, opts={}) => new Promise((resolve) => {
  const payload = {
    __draftPrompt: true,
    title: opts.title || '저장되지 않은 변경',
    message: opts.message || `작성 중인 ${label || '내용'}이(가) 저장되지 않았습니다.\n어떻게 할까요?`,
    saveLabel: opts.saveLabel || '임시저장',
    cancelLabel: opts.cancelLabel || '취소',
    discardLabel: opts.discardLabel || '저장 안 하고 닫기',
    dismissOnBackdrop: false,
    resolve,
  };
  if (!__confirmListeners.length) {
    try {
      const yes = window.confirm(payload.message + '\n[확인] = 임시저장 / [취소] = 그냥 닫기');
      resolve(yes ? 'save' : 'discard');
    } catch { resolve('cancel'); }
    return;
  }
  __confirmListeners.forEach((fn) => fn(payload));
});

// boot.jsx 에서 사용할 호스트 컴포넌트 — 단일 인스턴스.
const ConfirmDialogHost = () => {
  const [pending, setPending] = React.useState(null);
  React.useEffect(() => __subscribeConfirm(setPending), []);
  if (!pending) return null;
  const close = (result) => {
    pending.resolve(result);
    setPending(null);
  };
  // v00.263.004 — draftPrompt(3-way) 분기. BGNJ_DRAFT_PROMPT 가 set 한 payload 면 임시저장/취소/그냥닫기.
  if (pending.__draftPrompt) {
    return (
      <ConfirmDialog
        open={true}
        title={pending.title}
        message={pending.message}
        confirmLabel={pending.saveLabel}      // 'save'  — gold primary
        cancelLabel={pending.cancelLabel}      // 'cancel' — 기본 (모달 유지)
        thirdLabel={pending.discardLabel}      // 'discard' — 좌측 danger
        thirdDanger={true}
        dismissOnBackdrop={false}
        onConfirm={() => close('save')}
        onCancel={() => close('cancel')}
        onThird={() => close('discard')}
      />
    );
  }
  return (
    <ConfirmDialog
      open={true}
      title={pending.title}
      message={pending.message}
      hint={pending.hint}
      confirmLabel={pending.confirmLabel}
      cancelLabel={pending.cancelLabel}
      danger={pending.danger}
      dismissOnBackdrop={pending.dismissOnBackdrop}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );
};

window.ConfirmDialog = ConfirmDialog;
window.ConfirmDialogHost = ConfirmDialogHost;

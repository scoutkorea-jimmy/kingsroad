// 뱅기노자 — 전역 업로드 오버레이 (v00.243)
// 사용자 화: '이미지 업로드 누르면 반응성 느린건 알겠는데 그 진행바를 보여달라니까'.
//
// 의도: 모든 업로드 시작 즉시 화면 가운데에 풀스크린 모달 오버레이 노출 →
//       사용자가 클릭 후 침묵 구간을 확실히 인지. 끝나면 자동 hide.
//
// imperative API:
//   window.BGNJ_UPLOAD.show({ label, total })  — 시작
//   window.BGNJ_UPLOAD.update({ done, total }) — 진행률 갱신
//   window.BGNJ_UPLOAD.hide()                  — 끝
//
// 단일 인스턴스 (singleton). 동시 업로드 다중 시작 시 카운터 증가, 모두 종료 시 hide.

(function () {
  let listeners = new Set();
  let state = { open: false, label: '', done: 0, total: 0, count: 0 };
  const _emit = () => listeners.forEach((fn) => { try { fn(state); } catch {} });

  window.BGNJ_UPLOAD = {
    show({ label = '업로드 중입니다…', total = 0 } = {}) {
      state = { ...state, open: true, label, done: 0, total, count: state.count + 1 };
      _emit();
    },
    update({ done = 0, total = state.total, label } = {}) {
      state = { ...state, done, total, label: label || state.label };
      _emit();
    },
    hide() {
      const nextCount = Math.max(0, state.count - 1);
      if (nextCount > 0) {
        state = { ...state, count: nextCount };
        _emit();
        return;
      }
      state = { open: false, label: '', done: 0, total: 0, count: 0 };
      _emit();
    },
    _subscribe(fn) {
      listeners.add(fn);
      try { fn(state); } catch {}
      return () => listeners.delete(fn);
    },
  };
})();

const UploadOverlayHost = () => {
  const [s, setS] = React.useState({ open: false, label: '', done: 0, total: 0 });
  React.useEffect(() => {
    return window.BGNJ_UPLOAD._subscribe(setS);
  }, []);
  if (!s.open) return null;
  const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : null;
  return (
    <div role="status" aria-live="polite" aria-label="업로드 진행 중"
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(15,23,42,0.55)',
        display: 'grid', placeItems: 'center',
        backdropFilter: 'blur(2px)',
      }}>
      <div style={{
        background: 'var(--bg)', borderRadius: 12, padding: '28px 36px',
        minWidth: 320, maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      }}>
        {/* primary 옐로우 ring spinner */}
        <div aria-hidden="true" style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '4px solid var(--line)',
          borderTopColor: 'var(--primary)',
          animation: 'bgnj-spin 0.7s linear infinite',
        }}/>
        <div className="ko-serif" style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 600, textAlign: 'center' }}>
          {s.label || '업로드 중입니다…'}
        </div>
        {s.total > 0 && (
          <>
            <div style={{ width: '100%', minWidth: 240, height: 8, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                width: `${pct}%`, height: '100%', background: 'var(--primary)',
                transition: 'width .25s ease',
              }}/>
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--secondary)', letterSpacing: '0.1em', fontWeight: 700 }}>
              {s.done} / {s.total} {pct !== null && `· ${pct}%`}
            </div>
          </>
        )}
        <div className="dim mono" style={{ fontSize: 10, letterSpacing: '0.08em' }}>
          R2 업로드 — 잠시만 기다려 주세요
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { UploadOverlayHost });

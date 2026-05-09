(function(){
(function() {
  let listeners = /* @__PURE__ */ new Set();
  let state = { open: false, label: "", done: 0, total: 0, count: 0 };
  const _emit = () => listeners.forEach((fn) => {
    try {
      fn(state);
    } catch (e) {
    }
  });
  window.BGNJ_UPLOAD = {
    show({ label = "\uC5C5\uB85C\uB4DC \uC911\uC785\uB2C8\uB2E4\u2026", total = 0 } = {}) {
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
      state = { open: false, label: "", done: 0, total: 0, count: 0 };
      _emit();
    },
    _subscribe(fn) {
      listeners.add(fn);
      try {
        fn(state);
      } catch (e) {
      }
      return () => listeners.delete(fn);
    }
  };
})();
const UploadOverlayHost = () => {
  const [s, setS] = React.useState({ open: false, label: "", done: 0, total: 0 });
  React.useEffect(() => {
    return window.BGNJ_UPLOAD._subscribe(setS);
  }, []);
  if (!s.open) return null;
  const pct = s.total > 0 ? Math.round(s.done / s.total * 100) : null;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      "aria-label": "\uC5C5\uB85C\uB4DC \uC9C4\uD589 \uC911",
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(15,23,42,0.55)",
        display: "grid",
        placeItems: "center",
        backdropFilter: "blur(2px)"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      background: "var(--bg)",
      borderRadius: 12,
      padding: "28px 36px",
      minWidth: 320,
      maxWidth: "90vw",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14
    } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      border: "4px solid var(--line)",
      borderTopColor: "var(--primary)",
      animation: "bgnj-spin 0.7s linear infinite"
    } }), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 16, color: "var(--ink)", fontWeight: 600, textAlign: "center" } }, s.label || "\uC5C5\uB85C\uB4DC \uC911\uC785\uB2C8\uB2E4\u2026"), s.total > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", minWidth: 240, height: 8, background: "var(--bg-3)", borderRadius: 999, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: `${pct}%`,
      height: "100%",
      background: "var(--primary)",
      transition: "width .25s ease"
    } })), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 11, color: "var(--secondary)", letterSpacing: "0.1em", fontWeight: 700 } }, s.done, " / ", s.total, " ", pct !== null && `\xB7 ${pct}%`)), /* @__PURE__ */ React.createElement("div", { className: "dim mono", style: { fontSize: 10, letterSpacing: "0.08em" } }, "R2 \uC5C5\uB85C\uB4DC \u2014 \uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824 \uC8FC\uC138\uC694"))
  );
};
Object.assign(window, { UploadOverlayHost });

})();

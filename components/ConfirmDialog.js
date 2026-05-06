(function(){
const ConfirmDialog = ({ open, title, message, hint, confirmLabel = "\uD655\uC778", cancelLabel = "\uCDE8\uC18C", danger = false, onConfirm, onCancel }) => {
  var _a;
  (_a = window.useModalGuard) == null ? void 0 : _a.call(window, { open, dirty: false, onClose: onCancel, onSaveDraft: null, label: title || "\uD655\uC778" });
  if (!open) return null;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title || "\uD655\uC778",
      onClick: onCancel,
      style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1100, display: "grid", placeItems: "center", padding: 24 }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => e.stopPropagation(),
        style: { background: "var(--bg)", maxWidth: 460, width: "100%", padding: 24, border: "1px solid var(--line)", boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }
      },
      title && /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10 } }, title),
      message && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, lineHeight: 1.7, color: "var(--ink-2)", margin: 0 } }, message),
      hint && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, lineHeight: 1.6, marginTop: 8, marginBottom: 0 } }, hint),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: onCancel, autoFocus: true }, cancelLabel), /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          className: danger ? "btn" : "btn btn-gold",
          onClick: onConfirm,
          style: danger ? { borderColor: "var(--danger)", color: "var(--danger)" } : void 0
        },
        confirmLabel
      ))
    )
  );
};
const __confirmListeners = [];
const __subscribeConfirm = (fn) => {
  __confirmListeners.push(fn);
  return () => {
    const i = __confirmListeners.indexOf(fn);
    if (i >= 0) __confirmListeners.splice(i, 1);
  };
};
window.BGNJ_CONFIRM = (message, opts = {}) => new Promise((resolve) => {
  const payload = {
    title: opts.title || "\uD655\uC778",
    message,
    hint: opts.hint || "",
    confirmLabel: opts.confirmLabel || "\uD655\uC778",
    cancelLabel: opts.cancelLabel || "\uCDE8\uC18C",
    danger: !!opts.danger,
    resolve
  };
  if (!__confirmListeners.length) {
    try {
      resolve(window.confirm(message));
    } catch (e) {
      resolve(false);
    }
    return;
  }
  __confirmListeners.forEach((fn) => fn(payload));
});
const ConfirmDialogHost = () => {
  const [pending, setPending] = React.useState(null);
  React.useEffect(() => __subscribeConfirm(setPending), []);
  if (!pending) return null;
  const close = (ok) => {
    pending.resolve(ok);
    setPending(null);
  };
  return /* @__PURE__ */ React.createElement(
    ConfirmDialog,
    {
      open: true,
      title: pending.title,
      message: pending.message,
      hint: pending.hint,
      confirmLabel: pending.confirmLabel,
      cancelLabel: pending.cancelLabel,
      danger: pending.danger,
      onConfirm: () => close(true),
      onCancel: () => close(false)
    }
  );
};
window.ConfirmDialog = ConfirmDialog;
window.ConfirmDialogHost = ConfirmDialogHost;

})();

(function(){
const ConfirmDialog = ({ open, title, message, hint, confirmLabel = "\uD655\uC778", cancelLabel = "\uCDE8\uC18C", danger = false, dismissOnBackdrop = true, thirdLabel = null, thirdDanger = false, onConfirm, onCancel, onThird }) => {
  React.useEffect(() => {
    var _a, _b;
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        e.stopPropagation();
        onCancel == null ? void 0 : onCancel();
      }
    };
    window.addEventListener("keydown", onKey, true);
    try {
      (_b = (_a = window.BGNJ_SCROLL_LOCK) == null ? void 0 : _a.lock) == null ? void 0 : _b.call(_a);
    } catch (e) {
    }
    return () => {
      var _a2, _b2;
      window.removeEventListener("keydown", onKey, true);
      try {
        (_b2 = (_a2 = window.BGNJ_SCROLL_LOCK) == null ? void 0 : _a2.unlock) == null ? void 0 : _b2.call(_a2);
      } catch (e) {
      }
    };
  }, [open, onCancel]);
  if (!open) return null;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title || "\uD655\uC778",
      onClick: dismissOnBackdrop ? onCancel : void 0,
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
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20, flexWrap: "wrap" } }, thirdLabel && /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          className: "btn",
          onClick: onThird,
          style: { marginRight: "auto", ...thirdDanger ? { borderColor: "var(--danger)", color: "var(--danger)" } : {} }
        },
        thirdLabel
      ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: onCancel, autoFocus: true }, cancelLabel), /* @__PURE__ */ React.createElement(
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
    // v00.262.007 — 명시적으로 false 가 전달된 경우만 백드롭 dismiss 비활성. 기본은 기존 동작 유지.
    dismissOnBackdrop: opts.dismissOnBackdrop !== false,
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
window.BGNJ_DRAFT_PROMPT = (label, opts = {}) => new Promise((resolve) => {
  const payload = {
    __draftPrompt: true,
    title: opts.title || "\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD",
    message: opts.message || `\uC791\uC131 \uC911\uC778 ${label || "\uB0B4\uC6A9"}\uC774(\uAC00) \uC800\uC7A5\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.
\uC5B4\uB5BB\uAC8C \uD560\uAE4C\uC694?`,
    saveLabel: opts.saveLabel || "\uC784\uC2DC\uC800\uC7A5",
    cancelLabel: opts.cancelLabel || "\uCDE8\uC18C",
    discardLabel: opts.discardLabel || "\uC800\uC7A5 \uC548 \uD558\uACE0 \uB2EB\uAE30",
    dismissOnBackdrop: false,
    resolve
  };
  if (!__confirmListeners.length) {
    try {
      const yes = window.confirm(payload.message + "\n[\uD655\uC778] = \uC784\uC2DC\uC800\uC7A5 / [\uCDE8\uC18C] = \uADF8\uB0E5 \uB2EB\uAE30");
      resolve(yes ? "save" : "discard");
    } catch (e) {
      resolve("cancel");
    }
    return;
  }
  __confirmListeners.forEach((fn) => fn(payload));
});
const ConfirmDialogHost = () => {
  const [pending, setPending] = React.useState(null);
  React.useEffect(() => __subscribeConfirm(setPending), []);
  if (!pending) return null;
  const close = (result) => {
    pending.resolve(result);
    setPending(null);
  };
  if (pending.__draftPrompt) {
    return /* @__PURE__ */ React.createElement(
      ConfirmDialog,
      {
        open: true,
        title: pending.title,
        message: pending.message,
        confirmLabel: pending.saveLabel,
        cancelLabel: pending.cancelLabel,
        thirdLabel: pending.discardLabel,
        thirdDanger: true,
        dismissOnBackdrop: false,
        onConfirm: () => close("save"),
        onCancel: () => close("cancel"),
        onThird: () => close("discard")
      }
    );
  }
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
      dismissOnBackdrop: pending.dismissOnBackdrop,
      onConfirm: () => close(true),
      onCancel: () => close(false)
    }
  );
};
window.ConfirmDialog = ConfirmDialog;
window.ConfirmDialogHost = ConfirmDialogHost;

})();

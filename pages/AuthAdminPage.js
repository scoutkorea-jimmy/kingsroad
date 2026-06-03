(function(){
const LegalModal = ({ slug, onClose }) => {
  var _a, _b;
  const doc = ((_a = window.BGNJ_LEGAL) == null ? void 0 : _a.get(slug)) || { title: slug === "terms" ? "\uC774\uC6A9\uC57D\uAD00" : "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68", body: "<p>(\uC900\uBE44 \uC911)</p>" };
  (_b = window.useModalGuard) == null ? void 0 : _b.call(window, { open: true, dirty: false, onClose, onSaveDraft: null, label: doc.title });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": doc.title,
      onClick: onClose,
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 1e3,
        display: "grid",
        placeItems: "center",
        padding: "24px"
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => e.stopPropagation(),
        style: {
          background: "var(--bg)",
          maxWidth: 720,
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          padding: "28px 32px",
          border: "1px solid var(--line)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.25)"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 16 } }, /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 22, margin: 0 } }, doc.title), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onClose }, "\uB2EB\uAE30")),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "legal-body",
          style: { fontSize: 14, lineHeight: 1.85, color: "var(--ink)" },
          dangerouslySetInnerHTML: { __html: window.BGNJ_SAFE_HTML(doc.body || "<p>(\uC900\uBE44 \uC911)</p>") }
        }
      )
    )
  );
};
const AuthErrorPanel = ({ error, onDismiss }) => {
  if (!error) return null;
  const code = error.code || "UNKNOWN";
  const status = error.status ? `HTTP ${error.status}` : null;
  const kindLabel = {
    network: "\uB124\uD2B8\uC6CC\uD06C",
    cors: "CORS",
    http: "\uC11C\uBC84 \uC751\uB2F5",
    parse: "\uC751\uB2F5 \uD574\uC11D",
    client: "\uC785\uB825 \uAC80\uC99D",
    unknown: "\uC624\uB958"
  }[error.kind] || "\uC624\uB958";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "alert",
      "aria-live": "assertive",
      style: {
        margin: "16px 0 4px",
        padding: "14px 16px",
        background: "rgba(194,74,61,0.06)",
        border: "1px solid var(--danger)",
        color: "var(--ink)",
        fontSize: 13,
        lineHeight: 1.7
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 11, letterSpacing: "0.18em", color: "var(--danger)" } }, kindLabel, " \uC624\uB958 \xB7 ", code, status ? ` \xB7 ${status}` : ""), onDismiss && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: onDismiss,
        className: "btn-ghost",
        style: { fontSize: 11, color: "var(--ink-3)" },
        "aria-label": "\uC5D0\uB7EC \uBA54\uC2DC\uC9C0 \uB2EB\uAE30"
      },
      "\xD7"
    )),
    /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, marginBottom: 6 } }, error.message || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"),
    error.hint && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12, lineHeight: 1.7 } }, error.hint),
    error.url && /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, marginTop: 8, wordBreak: "break-all" } }, "\uC694\uCCAD: ", error.url),
    /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, marginTop: 6 } }, "\u24D8 \uC790\uC138\uD55C \uC9C4\uB2E8 \uC815\uBCF4\uB294 \uBE0C\uB77C\uC6B0\uC800 \uAC1C\uBC1C\uC790 \uB3C4\uAD6C(F12)\uC758 \uCF58\uC194/\uB124\uD2B8\uC6CC\uD06C \uD0ED\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.")
  );
};
const INTEREST_OPTIONS = [
  { value: "palace", label: "\uAD81\uAD90 \uB2F5\uC0AC" },
  { value: "history", label: "\uC870\uC120 \uC5ED\uC0AC" },
  { value: "philosophy", label: "\uB3D9\uC591 \uCCA0\uD559" },
  { value: "literature", label: "\uD55C\uBB38\uD559" },
  { value: "architecture", label: "\uC804\uD1B5 \uAC74\uCD95" },
  { value: "art", label: "\uBBF8\uC220\uC0AC" },
  { value: "other", label: "\uAE30\uD0C0 (\uC9C1\uC811 \uC785\uB825)" }
];
const LoginPage = ({ go, setUser, initialMode = "login" }) => {
  const [mode, setMode] = React.useState(initialMode);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    birthdate: "",
    phone: "",
    zip: "",
    addr1: "",
    addr2: "",
    gender: "",
    interest: "",
    interestOther: "",
    recommender: "",
    consentTerms: false
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [legalModal, setLegalModal] = React.useState(null);
  const [authError, setAuthError] = React.useState(null);
  const authContent = React.useMemo(() => {
    var _a, _b, _c;
    return ((_c = (_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.auth) || {};
  }, []);
  const set = (k, v) => {
    setForm({ ...form, [k]: v });
    if (authError) setAuthError(null);
  };
  const setMode2 = (next) => {
    setMode(next);
    setAuthError(null);
  };
  const submit = async () => {
    if (submitting) return;
    setAuthError(null);
    const normalizedEmail = (form.email || "").trim().toLowerCase();
    const password = form.password || "";
    const clientError = (code, message) => setAuthError({ code, kind: "client", message, hint: "" });
    if (!normalizedEmail) return clientError("FORM_EMAIL_REQUIRED", "\uC774\uBA54\uC77C\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
    if (!password) return clientError("FORM_PASSWORD_REQUIRED", "\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
    if (mode === "signup") {
      if (!form.name.trim()) return clientError("FORM_NAME_REQUIRED", "\uC774\uB984\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      if (password.length < 8) return clientError("FORM_PASSWORD_TOO_SHORT", "\uBE44\uBC00\uBC88\uD638\uB294 8\uC790 \uC774\uC0C1\uC73C\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      if (password !== form.password2) return clientError("FORM_PASSWORD_MISMATCH", "\uBE44\uBC00\uBC88\uD638 \uD655\uC778\uC774 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
      if (!form.consentTerms) return clientError("FORM_CONSENT_REQUIRED", "\uC774\uC6A9\uC57D\uAD00 \uBC0F \uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68 \uB3D9\uC758\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.");
    }
    setSubmitting(true);
    try {
      const interestValue = form.interest === "other" ? (form.interestOther || "").trim() : form.interest;
      const authResult = mode === "login" ? await window.BGNJ_AUTH.signIn({ email: normalizedEmail, password }) : await window.BGNJ_AUTH.signUp({
        name: form.name.trim(),
        email: normalizedEmail,
        password,
        profile: {
          birthdate: form.birthdate,
          phone: form.phone,
          zip: form.zip,
          addr1: form.addr1,
          addr2: form.addr2,
          gender: form.gender,
          interest: interestValue,
          recommender: form.recommender
        },
        consents: { terms: true }
      });
      if (!authResult.ok) {
        try {
          console.error("[BGNJ_AUTH]", mode, authResult);
        } catch (e) {
        }
        setAuthError(authResult);
        return;
      }
      setUser(authResult.user);
      go(authResult.user.isAdmin ? "admin" : "home");
    } finally {
      setSubmitting(false);
    }
  };
  const authBg = authContent.imageDataUri ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%), url(${authContent.imageDataUri})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: `linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 100%)` };
  const authTitle = authContent.title || "\uBC45\uAE30 \uD0C0\uACE0\n\uBC45\uAE30\uB178\uC790\uAC00 \uB418\uB2E4";
  const authDescription = authContent.description || "\uBC45\uAE30\uB178\uC790\uB294 \uB2E8\uC21C \uC5EC\uD589 \uC815\uBCF4 \uC0AC\uC774\uD2B8\uAC00 \uC544\uB2D9\uB2C8\uB2E4. \uD568\uAED8 \uB5A0\uB098\uACE0, \uD568\uAED8 \uAC77\uACE0, \uD568\uAED8 \uC774\uC57C\uAE30\uD558\uB294 \uC5EC\uD589\uC790\uB4E4\uC758 \uAD11\uC7A5\uC785\uB2C8\uB2E4. \uB9E4\uB2EC \uC0C8\uB85C\uC6B4 \uB2F5\uC0AC\uC640 \uCE7C\uB7FC\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4.";
  const authEyebrow = authContent.eyebrow || "BANGINOJA";
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "calc(100vh - 72px)", display: "grid", gridTemplateColumns: "1fr 1fr" }, className: "auth-grid" }, /* @__PURE__ */ React.createElement("div", { className: "auth-art", style: {
    ...authBg,
    borderRight: "1px solid var(--line)",
    padding: "80px 60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: authContent.imageDataUri ? "#fff" : void 0
  } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(BanginojaIcon, { size: 36 }), /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.3em", marginTop: 24 } }, authEyebrow)), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 480 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.3em", marginBottom: 16 } }, mode === "login" ? "\u2014 WELCOME BACK" : "\u2014 JOIN US"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 500, lineHeight: 1.15, marginBottom: 20, whiteSpace: "pre-line" } }, authTitle), /* @__PURE__ */ React.createElement("p", { className: authContent.imageDataUri ? "" : "dim", style: { fontSize: 15, lineHeight: 1.9 } }, authDescription))), /* @__PURE__ */ React.createElement("div", { style: { padding: "80px 60px", display: "grid", placeItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 400 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 0, marginBottom: 40, borderBottom: "1px solid var(--line)" } }, [{ k: "login", l: "\uB85C\uADF8\uC778" }, { k: "signup", l: "\uD68C\uC6D0\uAC00\uC785" }].map((t) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t.k,
      onClick: () => setMode2(t.k),
      style: {
        flex: 1,
        padding: "14px",
        fontFamily: "var(--font-serif)",
        fontSize: 16,
        color: mode === t.k ? "var(--primary)" : "var(--ink-3)",
        borderBottom: mode === t.k ? "2px solid var(--primary)" : "2px solid transparent",
        marginBottom: -1
      }
    },
    t.l
  ))), /* @__PURE__ */ React.createElement(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        submit();
      },
      "aria-labelledby": "auth-heading",
      noValidate: true
    },
    /* @__PURE__ */ React.createElement("h1", { id: "auth-heading", className: "sr-only" }, mode === "login" ? "\uB85C\uADF8\uC778" : "\uD68C\uC6D0\uAC00\uC785"),
    mode === "signup" && /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-name" }, "\uC774\uB984 ", /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", className: "gold" }, "*"), /* @__PURE__ */ React.createElement("span", { className: "sr-only" }, "(\uD544\uC218)")), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "auth-name",
        name: "name",
        className: "field-input",
        autoComplete: "name",
        required: true,
        "aria-required": "true",
        value: form.name,
        onChange: (e) => set("name", e.target.value),
        placeholder: "\uC2E4\uBA85\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694"
      }
    )),
    /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-email" }, "\uC774\uBA54\uC77C ", /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", className: "gold" }, "*")), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "auth-email",
        name: "email",
        type: "email",
        className: "field-input",
        autoComplete: "email",
        required: true,
        "aria-required": "true",
        inputMode: "email",
        value: form.email,
        onChange: (e) => set("email", e.target.value),
        placeholder: "contact@bgnj.net"
      }
    )),
    /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-password" }, "\uBE44\uBC00\uBC88\uD638 ", /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", className: "gold" }, "*")), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "auth-password",
        name: "password",
        type: "password",
        className: "field-input",
        autoComplete: mode === "login" ? "current-password" : "new-password",
        required: true,
        "aria-required": "true",
        minLength: 8,
        value: form.password,
        onChange: (e) => set("password", e.target.value),
        "aria-describedby": "auth-password-hint",
        placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
      }
    ), mode === "signup" && /* @__PURE__ */ React.createElement("span", { id: "auth-password-hint", className: "field-hint" }, "8\uC790 \uC774\uC0C1, \uC601\uBB38\xB7\uC22B\uC790\xB7\uAE30\uD638 \uC870\uD569 \uAD8C\uC7A5")),
    mode === "signup" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-password2" }, "\uBE44\uBC00\uBC88\uD638 \uD655\uC778 ", /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", className: "gold" }, "*")), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "auth-password2",
        name: "password2",
        type: "password",
        className: "field-input",
        autoComplete: "new-password",
        required: true,
        "aria-required": "true",
        value: form.password2,
        onChange: (e) => set("password2", e.target.value),
        placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
      }
    )), /* @__PURE__ */ React.createElement("details", { style: { border: "1px solid var(--line)", padding: "14px 16px", margin: "24px 0" } }, /* @__PURE__ */ React.createElement("summary", { style: { cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: "var(--secondary)" } }, "\uCD94\uAC00 \uC815\uBCF4 \uC785\uB825 (\uC120\uD0DD \xB7 \uC785\uB825\uD558\uC9C0 \uC54A\uC544\uB3C4 \uC0AC\uC774\uD2B8 \uC774\uC6A9\uC5D0 \uBB38\uC81C \uC5C6\uC74C)"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 10, lineHeight: 1.7, padding: "10px 12px", background: "rgba(245,213,72,0.06)", border: "1px solid var(--primary-dim)" } }, /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uC544\uB798 \uD56D\uBAA9\uC740 \uBAA8\uB450 \uC120\uD0DD\uC785\uB2C8\uB2E4."), " \uC785\uB825\uD558\uC9C0 \uC54A\uC73C\uC154\uB3C4 \uD68C\uC6D0\uAC00\uC785\uACFC \uBAA8\uB4E0 \uC0AC\uC774\uD2B8 \uAE30\uB2A5\uC744 \uB3D9\uC77C\uD558\uAC8C \uC774\uC6A9\uD558\uC2E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC218\uC9D1\uB41C \uC815\uBCF4\uB294 GDPR/PIPA\uC5D0 \uB530\uB77C \uAD00\uB9AC\uB418\uBA70, \uC5B8\uC81C\uB4E0 \uC5F4\uB78C\xB7\uC815\uC815\xB7\uC0AD\uC81C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginTop: 16 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-birthdate" }, "\uC0DD\uB144\uC6D4\uC77C"), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "auth-birthdate",
        type: "date",
        className: "field-input",
        autoComplete: "bday",
        value: form.birthdate,
        onChange: (e) => set("birthdate", e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-gender" }, "\uC131\uBCC4"), /* @__PURE__ */ React.createElement(
      "select",
      {
        id: "auth-gender",
        className: "field-input",
        value: form.gender,
        onChange: (e) => set("gender", e.target.value)
      },
      /* @__PURE__ */ React.createElement("option", { value: "" }, "\uC120\uD0DD \uC548 \uD568"),
      /* @__PURE__ */ React.createElement("option", { value: "f" }, "\uC5EC\uC131"),
      /* @__PURE__ */ React.createElement("option", { value: "m" }, "\uB0A8\uC131"),
      /* @__PURE__ */ React.createElement("option", { value: "x" }, "\uAE30\uD0C0 / \uC751\uB2F5 \uC548 \uD568")
    )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-phone" }, "\uC804\uD654\uBC88\uD638"), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "auth-phone",
        type: "tel",
        className: "field-input",
        autoComplete: "tel",
        inputMode: "tel",
        value: form.phone,
        onChange: (e) => set("phone", e.target.value),
        placeholder: "010-0000-0000"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-zip" }, "\uC6B0\uD3B8\uBC88\uD638"), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "auth-zip",
        className: "field-input",
        autoComplete: "postal-code",
        value: form.zip,
        onChange: (e) => set("zip", e.target.value),
        placeholder: "00000",
        style: { maxWidth: 160 }
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-addr1" }, "\uC8FC\uC18C"), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "auth-addr1",
        className: "field-input",
        autoComplete: "address-line1",
        value: form.addr1,
        onChange: (e) => set("addr1", e.target.value),
        placeholder: "\uC2DC/\uAD6C/\uB3C4\uB85C\uBA85"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-addr2" }, "\uC0C1\uC138 \uC8FC\uC18C"), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "auth-addr2",
        className: "field-input",
        autoComplete: "address-line2",
        value: form.addr2,
        onChange: (e) => set("addr2", e.target.value),
        placeholder: "\uB3D9/\uD638\uC218 \uB4F1"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-interest" }, "\uAD00\uC2EC \uBD84\uC57C"), /* @__PURE__ */ React.createElement(
      "select",
      {
        id: "auth-interest",
        className: "field-input",
        value: form.interest,
        onChange: (e) => set("interest", e.target.value)
      },
      /* @__PURE__ */ React.createElement("option", { value: "" }, "\uC120\uD0DD \uC548 \uD568"),
      INTEREST_OPTIONS.map((opt) => /* @__PURE__ */ React.createElement("option", { key: opt.value, value: opt.value }, opt.label))
    ), form.interest === "other" && /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "field-input",
        style: { marginTop: 8 },
        placeholder: "\uAD00\uC2EC \uBD84\uC57C\uB97C \uC9C1\uC811 \uC785\uB825\uD574 \uC8FC\uC138\uC694",
        value: form.interestOther,
        onChange: (e) => set("interestOther", e.target.value),
        maxLength: 60
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "auth-ref" }, "\uCD94\uCC9C\uC778 \uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "auth-ref",
        type: "email",
        className: "field-input",
        value: form.recommender,
        onChange: (e) => set("recommender", e.target.value),
        placeholder: "\uCD94\uCC9C\uD574\uC900 \uBD84\uC774 \uC788\uB2E4\uBA74 \uC774\uBA54\uC77C \uC785\uB825"
      }
    ))), /* @__PURE__ */ React.createElement("label", { htmlFor: "consent-terms", style: { display: "flex", gap: 10, alignItems: "flex-start", margin: "16px 0 20px", fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6 } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "consent-terms",
        type: "checkbox",
        required: true,
        "aria-required": "true",
        checked: form.consentTerms,
        onChange: (e) => set("consentTerms", e.target.checked),
        style: { accentColor: "var(--primary)", marginTop: 3 }
      }
    ), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-ghost",
        onClick: () => setLegalModal("terms"),
        style: { padding: 0, color: "var(--secondary)", textDecoration: "underline", fontSize: 12 }
      },
      "\uC774\uC6A9\uC57D\uAD00"
    ), " ", "\uBC0F", " ", /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-ghost",
        onClick: () => setLegalModal("privacy"),
        style: { padding: 0, color: "var(--secondary)", textDecoration: "underline", fontSize: 12 }
      },
      "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68"
    ), "\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4 ", /* @__PURE__ */ React.createElement("span", { className: "gold" }, "(\uD544\uC218)")))),
    legalModal && /* @__PURE__ */ React.createElement(LegalModal, { slug: legalModal, onClose: () => setLegalModal(null) }),
    authError && /* @__PURE__ */ React.createElement(AuthErrorPanel, { error: authError, onDismiss: () => setAuthError(null) }),
    mode === "login" && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, fontSize: 12 } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "keep-login", style: { display: "flex", gap: 8, alignItems: "center", color: "var(--ink-2)" } }, /* @__PURE__ */ React.createElement("input", { id: "keep-login", type: "checkbox", style: { accentColor: "var(--primary)" } }), "\uB85C\uADF8\uC778 \uC720\uC9C0"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", style: { color: "var(--secondary)" } }, "\uBE44\uBC00\uBC88\uD638 \uCC3E\uAE30")),
    /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-block", disabled: submitting, "aria-busy": submitting }, submitting ? "\uCC98\uB9AC \uC911..." : mode === "login" ? "\uC785\uC7A5\uD558\uAE30 \u2192" : "\uD68C\uC6D0\uAC00\uC785 \u2192")
  ))));
};
const PRIVACY_DATA = {
  // Data Subject Rights — 정보주체 권리 요청 큐
  // GDPR Art.15–22 / PIPA §35–38. 기본 응답기한: GDPR 1개월, PIPA 10일. 72h 타이머는 권고.
  dsrRequests: [
    { id: "DSR-2026-041", type: "access", user: "\uB3CC\uB2F4\uC544\uB798", email: "stone@example.com", openedAt: "2026-04-19T09:12:00Z", dueAt: "2026-05-19T23:59:00Z", law: "GDPR+PIPA", status: "open" },
    { id: "DSR-2026-040", type: "erasure", user: "overseas_reader", email: "r@eu.example", openedAt: "2026-04-18T16:04:00Z", dueAt: "2026-05-18T23:59:00Z", law: "GDPR", status: "in_progress", assignee: "DPO" },
    { id: "DSR-2026-039", type: "rectify", user: "\uC5ED\uC0AC\uC560\uD638", email: "h@example.com", openedAt: "2026-04-16T11:30:00Z", dueAt: "2026-04-26T23:59:00Z", law: "PIPA", status: "in_progress", assignee: "\uAE40\uAD00\uB9AC" },
    { id: "DSR-2026-038", type: "portability", user: "\uBD04\uBC24\uC758\uC790", email: "s@eu.example", openedAt: "2026-04-14T10:00:00Z", dueAt: "2026-05-14T23:59:00Z", law: "GDPR", status: "done", resolvedAt: "2026-04-17T15:22:00Z" },
    { id: "DSR-2026-037", type: "restrict", user: "\uC785\uBB38\uC790", email: "b@example.com", openedAt: "2026-04-10T08:00:00Z", dueAt: "2026-04-20T23:59:00Z", law: "PIPA", status: "done", resolvedAt: "2026-04-13T09:10:00Z" }
  ],
  // 동의 항목 정의 (버전 관리)
  consentDefs: [
    { key: "terms", label: "\uC774\uC6A9\uC57D\uAD00", required: true, version: "v3.1", updated: "2026-03-02", lawful: "\uACC4\uC57D \uC774\uD589" },
    { key: "privacy", label: "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68", required: true, version: "v4.0", updated: "2026-03-02", lawful: "\uBC95\uC801 \uC758\uBB34(PIPA \xA715)" },
    { key: "marketing", label: "\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0 (\uC774\uBA54\uC77C)", required: false, version: "v2.0", updated: "2026-01-15", lawful: "\uBA85\uC2DC\uC801 \uB3D9\uC758(GDPR Art.6(1)(a))" },
    { key: "sms", label: "SMS \uC218\uC2E0", required: false, version: "v1.2", updated: "2025-11-10", lawful: "\uBA85\uC2DC\uC801 \uB3D9\uC758" },
    { key: "profiling", label: "\uAD00\uC2EC\uC0AC \uAE30\uBC18 \uCD94\uCC9C \uD504\uB85C\uD30C\uC77C\uB9C1", required: false, version: "v1.0", updated: "2026-02-01", lawful: "\uBA85\uC2DC\uC801 \uB3D9\uC758(GDPR Art.22)" }
  ],
  // ROPA — Record of Processing Activities (GDPR Art.30)
  ropa: [
    { id: "ROPA-01", purpose: "\uD68C\uC6D0 \uC2DD\uBCC4\xB7\uACC4\uC815 \uC6B4\uC601", lawful: "\uACC4\uC57D \uC774\uD589", items: "\uC774\uB984, \uC774\uBA54\uC77C, \uBE44\uBC00\uBC88\uD638(\uD574\uC2DC)", retention: "\uD0C8\uD1F4 \uD6C4 \uC989\uC2DC \uD30C\uAE30", controller: "\uBC45\uAE30\uB178\uC790", processor: "AWS(\uC11C\uC6B8)", transfer: "\uC5C6\uC74C" },
    { id: "ROPA-02", purpose: "\uACB0\uC81C \uBC0F \uC8FC\uBB38 \uCC98\uB9AC", lawful: "\uACC4\uC57D \uC774\uD589", items: "\uC8FC\uC18C, \uC804\uD654\uBC88\uD638, \uCE74\uB4DC\uD1A0\uD070", retention: "\uC804\uC790\uC0C1\uAC70\uB798\uBC95 5\uB144", controller: "\uBC45\uAE30\uB178\uC790", processor: "\uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20", transfer: "\uC5C6\uC74C" },
    { id: "ROPA-03", purpose: "\uB9C8\uCF00\uD305\xB7\uB274\uC2A4\uB808\uD130", lawful: "\uBA85\uC2DC\uC801 \uB3D9\uC758", items: "\uC774\uBA54\uC77C, \uAD00\uC2EC\uBD84\uC57C", retention: "\uCCA0\uD68C \uC2DC \uC989\uC2DC", controller: "\uBC45\uAE30\uB178\uC790", processor: "Mailgun(US)", transfer: "\uBBF8\uAD6D(SCCs)" },
    { id: "ROPA-04", purpose: "\uC0AC\uC774\uD2B8 \uBD84\uC11D\xB7\uAC1C\uC120", lawful: "\uC815\uB2F9\uD55C \uC774\uC775", items: "\uCFE0\uD0A4ID, \uC811\uC18D\uB85C\uADF8, UA", retention: "13\uAC1C\uC6D4", controller: "\uBC45\uAE30\uB178\uC790", processor: "Plausible(EU)", transfer: "EU(\uC801\uC815\uC131)" },
    { id: "ROPA-05", purpose: "\uD22C\uC5B4 \uCC38\uAC00\uC790 \uAD00\uB9AC", lawful: "\uACC4\uC57D \uC774\uD589", items: "\uC774\uB984, \uC5F0\uB77D\uCC98, \uCC38\uAC00\uC77C\uC790", retention: "\uD589\uC0AC \uC885\uB8CC \uD6C4 6\uAC1C\uC6D4", controller: "\uBC45\uAE30\uB178\uC790", processor: "\uC790\uCCB4", transfer: "\uC5C6\uC74C" }
  ],
  cookies: [
    { name: "bgnj_session", cat: "\uD544\uC218", purpose: "\uB85C\uADF8\uC778 \uC0C1\uD0DC \uC720\uC9C0", ttl: "\uC138\uC158", party: "1st" },
    { name: "bgnj_route", cat: "\uD544\uC218", purpose: "\uB9C8\uC9C0\uB9C9 \uBC29\uBB38 \uACBD\uB85C", ttl: "\uC601\uAD6C(\uB85C\uCEEC)", party: "1st" },
    { name: "_pl_visits", cat: "\uBD84\uC11D", purpose: "\uBC29\uBB38 \uD1B5\uACC4(Plausible)", ttl: "24\uC2DC\uAC04", party: "3rd" },
    { name: "_mkt_lead", cat: "\uB9C8\uCF00\uD305", purpose: "\uCEA0\uD398\uC778 \uD6A8\uACFC \uCE21\uC815", ttl: "90\uC77C", party: "3rd" }
  ],
  breaches: [
    { id: "INC-2026-02", detectedAt: "2026-04-15T02:41:00Z", severity: "low", affected: 0, kind: "\uC811\uADFC \uC2DC\uB3C4 \uCC28\uB2E8", notifyDueAt: "2026-04-18T02:41:00Z", authorityNotified: false, subjectNotified: false, status: "closed", note: "WAF\uC5D0\uC11C \uC790\uB3D9 \uCC28\uB2E8. \uC720\uCD9C \uC5C6\uC74C." },
    { id: "INC-2026-01", detectedAt: "2026-02-02T13:10:00Z", severity: "medium", affected: 42, kind: "\uC774\uBA54\uC77C \uC624\uBC1C\uC1A1", notifyDueAt: "2026-02-05T13:10:00Z", authorityNotified: true, subjectNotified: true, status: "closed" }
  ],
  retentionPolicies: [
    { category: "\uACC4\uC815 \uC815\uBCF4", period: "\uD0C8\uD1F4 \uD6C4 \uC989\uC2DC", lawful: "PIPA \xA721" },
    { category: "\uC804\uC790\uC0C1\uAC70\uB798 \uAE30\uB85D", period: "5\uB144", lawful: "\uC804\uC790\uC0C1\uAC70\uB798\uBC95 \xA76" },
    { category: "\uB85C\uADF8\uC778 \uAE30\uB85D", period: "3\uAC1C\uC6D4", lawful: "\uD1B5\uC2E0\uBE44\uBC00\uBCF4\uD638\uBC95" },
    { category: "\uC811\uC18D IP", period: "3\uAC1C\uC6D4", lawful: "PIPA \xA721" },
    { category: "\uACB0\uC81C \uAE30\uB85D", period: "5\uB144", lawful: "\uC804\uC790\uAE08\uC735\uAC70\uB798\uBC95" },
    { category: "\uB9C8\uCF00\uD305 \uB3D9\uC758", period: "\uCCA0\uD68C \uC2DC \uC989\uC2DC", lawful: "\uC815\uBCF4\uD1B5\uC2E0\uB9DD\uBC95 \xA750" }
  ],
  transfers: [
    { recipient: "Mailgun Technologies, Inc.", country: "\uBBF8\uAD6D", purpose: "\uC774\uBA54\uC77C \uBC1C\uC1A1", basis: "GDPR SCCs, PIPA \xA728\uC7588", items: "\uC774\uBA54\uC77C, \uC774\uB984" },
    { recipient: "Amazon Web Services, Inc.", country: "\uD55C\uAD6D(\uC11C\uC6B8)", purpose: "\uD074\uB77C\uC6B0\uB4DC \uC778\uD504\uB77C", basis: "\uAD6D\uB0B4 \uCC98\uB9AC", items: "\uC804 \uB370\uC774\uD130" },
    { recipient: "Plausible Insights O\xDC", country: "\uC5D0\uC2A4\uD1A0\uB2C8\uC544(EU)", purpose: "\uC0AC\uC774\uD2B8 \uBD84\uC11D", basis: "GDPR \uC801\uC815\uC131 \uACB0\uC815(EU \uB0B4\uBD80)", items: "\uCFE0\uD0A4ID, UA" }
  ],
  members: [
    { id: 8734, handle: "\uB3CC\uB2F4\uC544\uB798", email: "stone@example.com", joined: "2025-08-12", region: "KR", consents: ["terms", "privacy", "marketing"] },
    { id: 8735, handle: "\uC5ED\uC0AC\uC560\uD638", email: "h@example.com", joined: "2025-09-02", region: "KR", consents: ["terms", "privacy"] },
    { id: 8736, handle: "\uBD04\uBC24\uC758\uC790", email: "s@eu.example", joined: "2025-10-21", region: "EU", consents: ["terms", "privacy", "profiling"] },
    { id: 8737, handle: "overseas_reader", email: "r@eu.example", joined: "2025-12-04", region: "EU", consents: ["terms", "privacy", "marketing"] },
    { id: 8738, handle: "\uC785\uBB38\uC790", email: "b@example.com", joined: "2026-01-15", region: "KR", consents: ["terms", "privacy"] }
  ]
};
const DSR_LABELS = {
  access: { ko: "\uC5F4\uB78C \uC694\uCCAD", gdpr: "Art.15", pipa: "\xA735" },
  rectify: { ko: "\uC815\uC815\xB7\uC218\uC815", gdpr: "Art.16", pipa: "\xA736" },
  erasure: { ko: "\uC0AD\uC81C(\uC78A\uD600\uC9C8 \uAD8C\uB9AC)", gdpr: "Art.17", pipa: "\xA736\u2461" },
  restrict: { ko: "\uCC98\uB9AC \uC81C\uD55C", gdpr: "Art.18", pipa: "\xA737" },
  portability: { ko: "\uB370\uC774\uD130 \uC774\uB3D9", gdpr: "Art.20", pipa: "\u2014" },
  object: { ko: "\uCC98\uB9AC \uAC70\uBD80", gdpr: "Art.21", pipa: "\xA737" }
};
const formatTimeLeft = (dueIso) => {
  const diff = new Date(dueIso).getTime() - Date.now();
  if (diff <= 0) return { text: "\uAE30\uD55C \uACBD\uACFC", tone: "danger" };
  const d = Math.floor(diff / 864e5);
  const h = Math.floor(diff % 864e5 / 36e5);
  if (d === 0) return { text: `${h}\uC2DC\uAC04 \uB0A8\uC74C`, tone: "warn" };
  if (d <= 3) return { text: `${d}\uC77C ${h}\uC2DC\uAC04 \uB0A8\uC74C`, tone: "warn" };
  return { text: `${d}\uC77C \uB0A8\uC74C`, tone: "ok" };
};
const ADMIN_VERSION_HISTORY = window.ADMIN_VERSION_HISTORY;
const ADMIN_DESIGN_SECTIONS = window.ADMIN_DESIGN_SECTIONS;
const MISSION_OVERVIEW = window.MISSION_OVERVIEW;
const FEATURE_DOMAINS = window.FEATURE_DOMAINS;
const DesignSystemView = window.DesignSystemView;
const RecommendationsAdminPanel = window.RecommendationsAdminPanel;
const TPE_ScheduleEditor = window.TPE_ScheduleEditor;
const TPE_PrepEditor = window.TPE_PrepEditor;
const TPE_PreviewCard = window.TPE_PreviewCard;
const _arrAdd = window._arrAdd;
const _arrRemove = window._arrRemove;
const _arrUpdate = window._arrUpdate;
const _arrMove = window._arrMove;
const TourPageEditorPanel = window.TourPageEditorPanel;
const LecturePageEditorPanel = window.LecturePageEditorPanel;
const LegacyMigrationPanel = window.LegacyMigrationPanel;
const EatSleepShopAdminPanel = window.EatSleepShopAdminPanel;
const FooterStyleEditor = window.FooterStyleEditor;
const HeroEditorPanel = window.HeroEditorPanel;
const HomeTextEditorPanel = window.HomeTextEditorPanel;
const BannerEditorPanel = window.BannerEditorPanel;
const CorruptedBodyInspector = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const G = window.BGNJ_GUARD;
  React.useEffect(() => {
    var _a, _b;
    (_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a.refreshPosts) == null ? void 0 : _b.call(_a).finally(() => setTick((v) => v + 1));
  }, []);
  const posts = G.arr(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a.listPosts) == null ? void 0 : _b.call(_a);
  });
  const corrupted = posts.filter((p) => {
    var _a, _b;
    const html = ((_a = p == null ? void 0 : p.body) == null ? void 0 : _a.html) || "";
    const text = ((_b = p == null ? void 0 : p.body) == null ? void 0 : _b.text) || "";
    return /v00\.129 이하/.test(html) || /v00\.129 이하/.test(text) || html === "[object Object]" || text === "[object Object]";
  });
  return /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18, marginBottom: 18, border: "1px dashed var(--primary-dim)" } }, /* @__PURE__ */ React.createElement("h4", { className: "ko-serif", style: { fontSize: 15, margin: "0 0 10px" } }, "\u{1F50D} \uCEE4\uBBA4\uB2C8\uD2F0 \uBCF8\uBB38 \uC190\uC0C1 \uC810\uAC80 (v00.130 hotfix)"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginBottom: 12 } }, "v00.129 \uC774\uD558\uC5D0\uC11C \uC791\uC131\uB41C \uAE00\uC740 D1 \uC5D0 \uBCF8\uBB38\uC774 ", /* @__PURE__ */ React.createElement("code", null, "[object Object]"), " \uB85C \uC800\uC7A5\uB3FC \uD654\uBA74\uC5D0 \uACBD\uACE0 \uD14D\uC2A4\uD2B8\uAC00 \uD45C\uC2DC\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uD574\uB2F9 \uAE00\uC744 \uD074\uB9AD\uD574 \uC791\uC131\uC790\uAC00 \uB2E4\uC2DC \uC800\uC7A5\uD558\uBA74 \uC815\uC0C1 \uBCF8\uBB38\uC73C\uB85C \uBCF5\uAD6C\uB429\uB2C8\uB2E4."), corrupted.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "gold mono", style: { fontSize: 12 } }, "\u2705 \uC190\uC0C1 \uAE00 0\uAC74 \u2014 \uBAA8\uB450 \uC815\uC0C1.") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10, fontSize: 13 } }, "\u26A0 \uC190\uC0C1 \uC758\uC2EC \uAE00 ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--danger)" } }, corrupted.length), "\uAC74 \uBC1C\uACAC"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 } }, corrupted.slice(0, 30).map((p) => /* @__PURE__ */ React.createElement("li", { key: p.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "1px solid var(--line)", fontSize: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "pill", style: { fontSize: 10 } }, p.category || "?"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, p.title || "(\uC81C\uBAA9 \uC5C6\uC74C)"), /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10 } }, p.author || "?", " \xB7 ", p.date || ""), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => {
    try {
      sessionStorage.setItem("bgnj_pending_post_id", String(p.id));
    } catch (e) {
    }
    go("community");
  } }, "\uC5F4\uAE30"))), corrupted.length > 30 && /* @__PURE__ */ React.createElement("li", { className: "dim-2 mono", style: { fontSize: 11, textAlign: "right" } }, "\uC678 ", corrupted.length - 30, "\uAC74"))));
};
const ReportQueuePanel = ({ onRefresh, go }) => {
  const [filter, setFilter] = React.useState("open");
  const [tick, setTick] = React.useState(0);
  const [viewingPostId, setViewingPostId] = React.useState(null);
  const reports = React.useMemo(() => window.BGNJ_COMMUNITY.listReports(filter), [filter, tick]);
  const counts = React.useMemo(() => ({
    open: window.BGNJ_COMMUNITY.listReports("open").length,
    resolved: window.BGNJ_COMMUNITY.listReports("resolved").length,
    dismissed: window.BGNJ_COMMUNITY.listReports("dismissed").length,
    all: window.BGNJ_COMMUNITY.listReports("all").length
  }), [tick]);
  const setStatus = (id, status) => {
    window.BGNJ_COMMUNITY.updateReportStatus(id, status);
    setTick((v) => v + 1);
  };
  const removePostFromReport = async (report) => {
    if (!report.postId) return;
    if (!await window.BGNJ_CONFIRM(`"${report.postTitle}" \uAC8C\uC2DC\uAE00\uC744 \uC0AD\uC81C\uD558\uACE0 \uC2E0\uACE0\uB97C \uCC98\uB9AC \uC644\uB8CC\uB85C \uD45C\uC2DC\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
    window.BGNJ_COMMUNITY.deletePost(report.postId);
    window.BGNJ_COMMUNITY.updateReportStatus(report.id, "resolved");
    setTick((v) => v + 1);
    onRefresh == null ? void 0 : onRefresh();
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" } }, [
    { key: "open", label: "\uBBF8\uCC98\uB9AC" },
    { key: "resolved", label: "\uCC98\uB9AC \uC644\uB8CC" },
    { key: "dismissed", label: "\uBC18\uB824" },
    { key: "all", label: "\uC804\uCCB4" }
  ].map((f) => {
    var _a;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: f.key,
        type: "button",
        className: "btn btn-small",
        onClick: () => setFilter(f.key),
        style: {
          borderColor: filter === f.key ? "var(--primary)" : "var(--line)",
          color: filter === f.key ? "var(--primary)" : "var(--ink-2)",
          background: filter === f.key ? "rgba(245,213,72,0.06)" : "transparent"
        }
      },
      f.label,
      " ",
      /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, marginLeft: 4 } }, (_a = counts[f.key]) != null ? _a : 0)
    );
  })), reports.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card dim", style: { padding: 32, textAlign: "center" } }, "\uD574\uB2F9 \uC0C1\uD0DC\uC758 \uC2E0\uACE0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 12 } }, reports.map((r) => {
    const tone = r.status === "open" ? "var(--danger)" : r.status === "resolved" ? "var(--primary)" : "var(--ink-3)";
    const statusLabel = r.status === "open" ? "\uBBF8\uCC98\uB9AC" : r.status === "resolved" ? "\uCC98\uB9AC \uC644\uB8CC" : "\uBC18\uB824";
    return /* @__PURE__ */ React.createElement("article", { key: r.id, className: "card", style: { padding: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 16 } }, r.postTitle), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: tone } }, statusLabel.toUpperCase())), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 6, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10, letterSpacing: "0.2em", marginRight: 8 } }, "\uC0AC\uC720"), r.reason), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uC2E0\uACE0\uC790 ", r.reporterName, " \xB7 ", window.BGNJ_FMT.kstDateTime(r.createdAt))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" } }, r.postId && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => setViewingPostId(r.postId)
      },
      "\uAC8C\uC2DC\uAE00 \uC5F4\uAE30"
    ), r.status !== "resolved" && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setStatus(r.id, "resolved") }, "\uCC98\uB9AC \uC644\uB8CC"), r.status !== "dismissed" && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setStatus(r.id, "dismissed") }, "\uBC18\uB824"), r.status === "open" && r.postId && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => removePostFromReport(r),
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uAC8C\uC2DC\uAE00 \uC0AD\uC81C + \uCC98\uB9AC"
    )));
  })), viewingPostId && /* @__PURE__ */ React.createElement(PostViewerModal, { postId: viewingPostId, onClose: () => setViewingPostId(null) }));
};
const AdminPanelHeader = ({ eyebrow, title, description, actions }) => /* @__PURE__ */ React.createElement("header", { className: "admin-panel-header" }, /* @__PURE__ */ React.createElement("div", { className: "admin-panel-header__main" }, eyebrow && /* @__PURE__ */ React.createElement("div", { className: "admin-panel-header__eyebrow" }, eyebrow), title && /* @__PURE__ */ React.createElement("h2", { className: "admin-panel-header__title" }, title), description && /* @__PURE__ */ React.createElement("p", { className: "admin-panel-header__desc" }, description)), actions && /* @__PURE__ */ React.createElement("div", { className: "admin-panel-header__actions" }, actions));
const StatusBadge = ({ variant = "neutral", children, title }) => /* @__PURE__ */ React.createElement("span", { className: `status-badge status-badge--${variant}`, title }, children);
const AdminEmpty = ({ children }) => /* @__PURE__ */ React.createElement("div", { className: "admin-empty" }, children);
const AdminFilterChips = ({ items, value, onChange, ariaLabel = "\uD544\uD130" }) => /* @__PURE__ */ React.createElement("div", { className: "admin-toolbar__filters", role: "tablist", "aria-label": ariaLabel }, items.map((it) => /* @__PURE__ */ React.createElement(
  "button",
  {
    key: it.key,
    type: "button",
    role: "tab",
    "aria-selected": value === it.key,
    className: `admin-filter-chip ${value === it.key ? "admin-filter-chip--active" : ""}`,
    onClick: () => onChange == null ? void 0 : onChange(it.key)
  },
  it.label,
  typeof it.count === "number" ? ` (${it.count})` : ""
)));
const AdminSaveBar = ({ children, message, messageVariant = "success" }) => /* @__PURE__ */ React.createElement("div", { className: "admin-savebar" }, children, message && /* @__PURE__ */ React.createElement("span", { className: `admin-savebar__msg admin-savebar__msg--${messageVariant}` }, message));
const HoverDetailsPopover = ({ details, open, id, anchor = "right" }) => {
  if (!open || !Array.isArray(details) || details.length === 0) return null;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "tooltip",
      id,
      style: {
        position: "absolute",
        top: "100%",
        marginTop: 8,
        [anchor === "left" ? "left" : "right"]: 0,
        background: "var(--bg)",
        border: "1px solid var(--primary-dim)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        padding: "14px 16px",
        minWidth: 240,
        maxWidth: 320,
        zIndex: 50,
        borderRadius: 8
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", marginBottom: 10 } }, "DETAILS"),
    /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 } }, details.map((d, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { display: "flex", justifyContent: "space-between", gap: 14, fontSize: 12, alignItems: "baseline" } }, /* @__PURE__ */ React.createElement("span", { className: "dim", style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" } }, d.label), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontWeight: 600, color: "var(--secondary)", whiteSpace: "nowrap" } }, d.value))))
  );
};
const StatTile = ({ stat }) => {
  const [open, setOpen] = React.useState(false);
  const id = React.useId ? React.useId() : `stat-${stat.l}`;
  const hasDetails = Array.isArray(stat.details) && stat.details.length > 0;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card",
      style: { position: "relative" },
      onMouseEnter: () => hasDetails && setOpen(true),
      onMouseLeave: () => setOpen(false),
      onFocus: () => hasDetails && setOpen(true),
      onBlur: () => setOpen(false),
      tabIndex: hasDetails ? 0 : void 0,
      "aria-describedby": open ? id : void 0
    },
    /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.25em", marginBottom: 12 } }, stat.l),
    /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 32, color: "var(--ink)" } }, stat.v, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, marginLeft: 4 }, className: "dim-2" }, stat.unit || "")),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: stat.p ? "var(--primary)" : "var(--danger)", marginTop: 8 } }, stat.d),
    /* @__PURE__ */ React.createElement(HoverDetailsPopover, { details: stat.details, open, id })
  );
};
const MetricCard = ({ label, value, sub, accent, icon, details }) => {
  const [open, setOpen] = React.useState(false);
  const id = React.useId ? React.useId() : `metric-${label}`;
  const hasDetails = Array.isArray(details) && details.length > 0;
  return /* @__PURE__ */ React.createElement(
    "article",
    {
      className: "metric-card",
      style: {
        padding: "18px 20px",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        position: "relative",
        overflow: "visible"
      },
      onMouseEnter: () => hasDetails && setOpen(true),
      onMouseLeave: () => setOpen(false),
      onFocus: () => hasDetails && setOpen(true),
      onBlur: () => setOpen(false),
      tabIndex: hasDetails ? 0 : void 0,
      "aria-describedby": open ? id : void 0
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 } }, icon && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18 }, "aria-hidden": "true" }, icon), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" } }, label)),
    /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 32, fontWeight: 600, color: accent || "var(--primary-hover)", lineHeight: 1.1 } }, value),
    sub && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, marginTop: 8, lineHeight: 1.5 } }, sub),
    /* @__PURE__ */ React.createElement(HoverDetailsPopover, { details, open, id })
  );
};
const MiniBarChart = window.MiniBarChart;
const RankedBarList = window.RankedBarList;
const COHORT_OPTIONS = window.COHORT_OPTIONS;
const CohortSelector = window.CohortSelector;
const _toDate = (v) => {
  if (!v) return null;
  const t = Date.parse(v);
  if (!isNaN(t)) return new Date(t);
  const m = String(v).match(/^(\d{4})[.-](\d{1,2})[.-](\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return null;
};
const _countSince = (items, dateField, days) => {
  const cutoff = Date.now() - days * 864e5;
  return items.filter((it) => {
    const d = _toDate(it[dateField]);
    return d && d.getTime() >= cutoff;
  }).length;
};
const _hourlySeries = (items, dateField, hours = 24) => {
  const counts = new Array(hours).fill(0);
  const labels = new Array(hours).fill("");
  const now = /* @__PURE__ */ new Date();
  now.setMinutes(0, 0, 0);
  const baseTs = now.getTime() - (hours - 1) * 36e5;
  items.forEach((it) => {
    const d = _toDate(it[dateField]);
    if (!d) return;
    const idx = Math.floor((d.getTime() - baseTs) / 36e5);
    if (idx >= 0 && idx < hours) counts[idx]++;
  });
  for (let i = 0; i < hours; i++) {
    const dt = new Date(baseTs + i * 36e5);
    labels[i] = i === hours - 1 ? "\uC9C0\uAE08" : `${dt.getHours()}\uC2DC`;
  }
  return { counts, labels };
};
const _dailySeries = (items, dateField, days = 14) => {
  const counts = new Array(days).fill(0);
  const labels = new Array(days).fill("");
  const todayMid = (() => {
    const d = /* @__PURE__ */ new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();
  items.forEach((it) => {
    const d = _toDate(it[dateField]);
    if (!d) return;
    d.setHours(0, 0, 0, 0);
    const idx = Math.floor((d.getTime() - todayMid) / 864e5) + (days - 1);
    if (idx >= 0 && idx < days) counts[idx]++;
  });
  for (let i = 0; i < days; i++) {
    const dt = new Date(todayMid + (i - (days - 1)) * 864e5);
    labels[i] = i === days - 1 ? "\uC624\uB298" : `${dt.getMonth() + 1}/${dt.getDate()}`;
  }
  return { counts, labels };
};
const DashboardPanel = ({ dashboardStats, allUsers, allCommunityPosts, latestCommunityPost, latestColumn, setTab, G }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const [summary, setSummary] = React.useState(null);
  const [loadingSummary, setLoadingSummary] = React.useState(true);
  const [summaryError, setSummaryError] = React.useState("");
  const [pvDays, setPvDays] = React.useState(14);
  const [signupDays, setSignupDays] = React.useState(14);
  const [refDays, setRefDays] = React.useState(30);
  const [routeDays, setRouteDays] = React.useState(7);
  const [heatmapDays, setHeatmapDays] = React.useState(30);
  const loadSummary = React.useCallback(async () => {
    var _a2, _b2, _c2;
    setLoadingSummary(true);
    setSummaryError("");
    try {
      const data = await ((_c2 = (_b2 = (_a2 = window.BGNJ_API) == null ? void 0 : _a2.analytics) == null ? void 0 : _b2.summary) == null ? void 0 : _c2.call(_b2, { days: pvDays, refDays, routeDays, heatmapDays }));
      if (data == null ? void 0 : data.error) {
        setSummaryError(data.error);
        setSummary(data);
      } else {
        setSummary(data || null);
      }
    } catch (err) {
      setSummaryError((err == null ? void 0 : err.message) || "\uC694\uCCAD \uC2E4\uD328");
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  }, [pvDays, refDays, routeDays, heatmapDays]);
  React.useEffect(() => {
    loadSummary();
  }, [loadSummary]);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      var _a2, _b2;
      try {
        await ((_b2 = (_a2 = window.BGNJ_AUTH) == null ? void 0 : _a2.refreshUsers) == null ? void 0 : _b2.call(_a2));
      } catch (e) {
      }
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const dailySignups = _countSince(allUsers, "joinedAt", 1);
  const weeklySignups = _countSince(allUsers, "joinedAt", 7);
  const monthlySignups = _countSince(allUsers, "joinedAt", 30);
  const signupSeries = signupDays === 1 ? _hourlySeries(allUsers, "joinedAt", 24) : _dailySeries(allUsers, "joinedAt", signupDays);
  const pv = summary || {};
  const dayViews = (_a = pv.day) != null ? _a : null;
  const weekViews = (_b = pv.week) != null ? _b : null;
  const monthViews = (_c = pv.month) != null ? _c : null;
  const dayUnique = (_d = pv.dayUnique) != null ? _d : null;
  const weekUnique = (_e = pv.weekUnique) != null ? _e : null;
  const monthUnique = (_f = pv.monthUnique) != null ? _f : null;
  const pvSeries = (() => {
    if (pvDays === 1) {
      const hours = 24;
      const counts2 = new Array(hours).fill(0);
      const labels2 = new Array(hours).fill("");
      const now = /* @__PURE__ */ new Date();
      now.setMinutes(0, 0, 0);
      const baseTs = now.getTime() - (hours - 1) * 36e5;
      (pv.hourlySeries || []).forEach(({ hour, views }) => {
        const t = Date.parse((hour || "") + ":00:00+09:00");
        if (isNaN(t)) return;
        const idx = Math.floor((t - baseTs) / 36e5);
        if (idx >= 0 && idx < hours) counts2[idx] = Number(views) || 0;
      });
      for (let i = 0; i < hours; i++) {
        const dt = new Date(baseTs + i * 36e5);
        labels2[i] = i === hours - 1 ? "\uC9C0\uAE08" : `${dt.getHours()}\uC2DC`;
      }
      return { counts: counts2, labels: labels2 };
    }
    const days = pvDays;
    const counts = new Array(days).fill(0);
    const labels = new Array(days).fill("");
    const todayMid = (() => {
      const d = /* @__PURE__ */ new Date();
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })();
    (pv.dailySeries || []).forEach(({ day, views }) => {
      const t = Date.parse(day + "T00:00:00+09:00");
      if (isNaN(t)) return;
      const idx = Math.floor((t - todayMid) / 864e5) + (days - 1);
      if (idx >= 0 && idx < days) counts[idx] = Number(views) || 0;
    });
    for (let i = 0; i < days; i++) {
      const dt = new Date(todayMid + (i - (days - 1)) * 864e5);
      labels[i] = i === days - 1 ? "\uC624\uB298" : `${dt.getMonth() + 1}/${dt.getDate()}`;
    }
    return { counts, labels };
  })();
  const refs = pv.referrers || [];
  const refTotal = refs.reduce((s, r) => s + r.count, 0) || 1;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "grid grid-4", style: { marginBottom: 18 } }, dashboardStats.map((s, i) => /* @__PURE__ */ React.createElement(StatTile, { key: i, stat: s }))), /* @__PURE__ */ React.createElement("div", { className: "admin-section__title" }, "\uBC29\uBB38\uC790 \xB7 \uAC00\uC785 ", summaryError ? "\u26A0 \uBD84\uC11D \uB370\uC774\uD130 \uBBF8\uC218\uC2E0 (schema-v9 \uBBF8\uC801\uC6A9 \uB610\uB294 \uC6CC\uCEE4 \uBBF8\uBC30\uD3EC)" : loadingSummary ? "\xB7 \u23F3 \uBD88\uB7EC\uC624\uB294 \uC911\u2026" : ""), /* @__PURE__ */ React.createElement("div", { className: "grid grid-4", style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement(
    MetricCard,
    {
      icon: "\u{1F4C5}",
      label: "\uC77C\uC77C \uBC29\uBB38",
      value: dayViews != null ? dayViews : "\u2014",
      accent: "var(--primary)",
      sub: dayUnique != null ? `\uC138\uC158 ${dayUnique}\uAC74 \xB7 \uD398\uC774\uC9C0\uBDF0 ${dayViews}` : "\uC11C\uBC84 \uB370\uC774\uD130 \uBBF8\uC218\uC2E0",
      details: dayUnique != null ? [
        { label: "\uD398\uC774\uC9C0\uBDF0", value: dayViews },
        { label: "\uC138\uC158 (unique)", value: dayUnique },
        { label: "\uD398\uC774\uC9C0/\uC138\uC158", value: dayUnique > 0 ? (dayViews / dayUnique).toFixed(2) : "\u2014" }
      ] : null
    }
  ), /* @__PURE__ */ React.createElement(
    MetricCard,
    {
      icon: "\u{1F4CA}",
      label: "\uC8FC\uAC04 \uBC29\uBB38",
      value: weekViews != null ? weekViews : "\u2014",
      accent: "var(--primary-hover)",
      sub: weekUnique != null ? `\uC138\uC158 ${weekUnique}\uAC74 \xB7 \uD398\uC774\uC9C0\uBDF0 ${weekViews}` : "\uC11C\uBC84 \uB370\uC774\uD130 \uBBF8\uC218\uC2E0",
      details: weekUnique != null ? [
        { label: "\uD398\uC774\uC9C0\uBDF0", value: weekViews },
        { label: "\uC138\uC158 (unique)", value: weekUnique },
        { label: "\uC77C\uD3C9\uADE0 \uD398\uC774\uC9C0\uBDF0", value: (weekViews / 7).toFixed(1) },
        { label: "\uC77C\uD3C9\uADE0 \uC138\uC158", value: (weekUnique / 7).toFixed(1) }
      ] : null
    }
  ), /* @__PURE__ */ React.createElement(
    MetricCard,
    {
      icon: "\u{1F4C8}",
      label: "\uC6D4\uAC04 \uBC29\uBB38",
      value: monthViews != null ? monthViews : "\u2014",
      accent: "var(--primary)",
      sub: monthUnique != null ? `\uC138\uC158 ${monthUnique}\uAC74 \xB7 \uD398\uC774\uC9C0\uBDF0 ${monthViews}` : "\uC11C\uBC84 \uB370\uC774\uD130 \uBBF8\uC218\uC2E0",
      details: monthUnique != null ? [
        { label: "\uD398\uC774\uC9C0\uBDF0", value: monthViews },
        { label: "\uC138\uC158 (unique)", value: monthUnique },
        { label: "\uC77C\uD3C9\uADE0 \uD398\uC774\uC9C0\uBDF0", value: (monthViews / 30).toFixed(1) },
        { label: "\uC77C\uD3C9\uADE0 \uC138\uC158", value: (monthUnique / 30).toFixed(1) }
      ] : null
    }
  ), /* @__PURE__ */ React.createElement(
    MetricCard,
    {
      icon: "\u2728",
      label: "\uC624\uB298 \uC2E0\uADDC \uAC00\uC785",
      value: dailySignups,
      accent: "var(--secondary, #1F7A8C)",
      sub: `\uC8FC\uAC04 ${weeklySignups}\uBA85 \xB7 \uC6D4\uAC04 ${monthlySignups}\uBA85`,
      details: [
        { label: "\uC624\uB298 \uC2E0\uADDC", value: dailySignups },
        { label: "\uCD5C\uADFC 7\uC77C", value: weeklySignups },
        { label: "\uCD5C\uADFC 30\uC77C", value: monthlySignups },
        { label: "\uB204\uC801 \uD68C\uC6D0", value: allUsers.length },
        { label: "7\uC77C \uC77C\uD3C9\uADE0", value: (weeklySignups / 7).toFixed(1) },
        { label: "30\uC77C \uC77C\uD3C9\uADE0", value: (monthlySignups / 30).toFixed(2) }
      ]
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-2", style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement("article", { className: "card" }, /* @__PURE__ */ React.createElement(
    MiniBarChart,
    {
      label: `\u{1F4CA} ${pvDays === 1 ? "24\uC2DC\uAC04 (1\uC2DC\uAC04 \uB2E8\uC704)" : pvDays + "\uC77C"} \uD398\uC774\uC9C0\uBDF0 \uCD94\uC774`,
      series: pvSeries.counts,
      labels: pvSeries.labels,
      color: "var(--primary)",
      height: 140,
      unit: "\uD68C",
      formatTooltip: (v, l) => `${l || ""} \xB7 \uD398\uC774\uC9C0\uBDF0 ${v}\uD68C`,
      headerRight: /* @__PURE__ */ React.createElement(CohortSelector, { value: pvDays, onChange: setPvDays })
    }
  ), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 8, lineHeight: 1.6 } }, summaryError ? "\uC11C\uBC84 \uBD84\uC11D \uB370\uC774\uD130 \uC5C6\uC74C \u2014 schema-v9 + \uC6CC\uCEE4 deploy \uD544\uC694." : pvDays === 1 ? "\uCD5C\uADFC 24\uC2DC\uAC04 \uC2DC\uAC04\uBCC4 \uD398\uC774\uC9C0\uBDF0. \uB9C9\uB300 \uD638\uBC84 \uC2DC \uC815\uD655\uD55C \uAC12." : "\uC2E4\uC81C \uCE21\uC815\uB41C \uC77C\uBCC4 \uD398\uC774\uC9C0\uBDF0 (page_views D1). \uB9C9\uB300\uC5D0 \uD638\uBC84\uD558\uBA74 \uC815\uD655\uD55C \uAC12.")), /* @__PURE__ */ React.createElement("article", { className: "card" }, /* @__PURE__ */ React.createElement(
    MiniBarChart,
    {
      label: `\u{1F4CA} ${signupDays === 1 ? "24\uC2DC\uAC04 (1\uC2DC\uAC04 \uB2E8\uC704)" : signupDays + "\uC77C"} \uAC00\uC785 \uCD94\uC774`,
      series: signupSeries.counts,
      labels: signupSeries.labels,
      color: "var(--secondary, #1F7A8C)",
      height: 140,
      unit: "\uBA85",
      formatTooltip: (v, l) => `${l || ""} \xB7 \uC2E0\uADDC \uAC00\uC785 ${v}\uBA85`,
      headerRight: /* @__PURE__ */ React.createElement(CohortSelector, { value: signupDays, onChange: setSignupDays })
    }
  ), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 8, lineHeight: 1.6 } }, signupDays === 1 ? "\uCD5C\uADFC 24\uC2DC\uAC04 \uC2DC\uAC04\uBCC4 \uC2E0\uADDC \uAC00\uC785\uC790." : `\uCD5C\uADFC ${signupDays}\uC77C\uAC04 \uC77C\uBCC4 \uC2E0\uADDC \uAC00\uC785\uC790 \uC218.`, " \uB9C9\uB300\uC5D0 \uD638\uBC84\uD558\uBA74 \uC815\uD655\uD55C \uAC12."))), /* @__PURE__ */ React.createElement("div", { className: "admin-section__title" }, "\uD68C\uC6D0 \uB4F1\uAE09\uBCC4 \uBD84\uD3EC"), (() => {
    var _a2;
    const grades = ((_a2 = window.BGNJ_STORES) == null ? void 0 : _a2.grades) || [];
    const counts = {};
    const adminCount = allUsers.filter((u) => u.isAdmin || u.isSuperAdmin).length;
    const totalNonAdmin = allUsers.length - adminCount;
    allUsers.forEach((u) => {
      if (u.isAdmin || u.isSuperAdmin) return;
      const gid = u.gradeId || "unranked";
      counts[gid] = (counts[gid] || 0) + 1;
    });
    const items = grades.map((g) => ({ id: g.id, label: g.name || g.id, count: counts[g.id] || 0, sub: g.tag || "" })).filter((it) => {
      var _a3;
      return it.count > 0 || ((_a3 = grades.find((g) => g.id === it.id)) == null ? void 0 : _a3.id);
    });
    if (counts.unranked) items.push({ id: "unranked", label: "\uBBF8\uBD84\uB958", count: counts.unranked, color: "var(--ink-3)" });
    if (adminCount > 0) items.push({ id: "__admin", label: "\uAD00\uB9AC\uC790", count: adminCount, color: "var(--secondary)" });
    items.sort((a, b) => b.count - a.count);
    return /* @__PURE__ */ React.createElement(
      RankedBarList,
      {
        items,
        unit: "\uBA85",
        emptyText: allUsers.length === 0 ? "\uD68C\uC6D0 \uB370\uC774\uD130 \uBBF8\uC218\uC2E0 \u2014 refreshUsers \uD638\uCD9C \uC9C1\uD6C4 \uC790\uB3D9 \uAC31\uC2E0." : "\uB4F1\uAE09\uC774 \uBD80\uC5EC\uB41C \uD68C\uC6D0\uC774 \uC544\uC9C1 \uC5C6\uC2B5\uB2C8\uB2E4.",
        headerLeft: "GRADE DISTRIBUTION",
        headerRight: /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uC804\uCCB4 ", allUsers.length, "\uBA85 \xB7 \uAD00\uB9AC\uC790 ", adminCount, " \xB7 \uC77C\uBC18 ", totalNonAdmin)
      }
    );
  })(), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement(
    window.HeatmapGrid,
    {
      data: pv.heatmap || [],
      days: pv.heatmapDays || heatmapDays,
      label: `\u{1F5D3} \uC811\uC18D \uC2DC\uAC04 \uD788\uD2B8\uB9F5 (\uCD5C\uADFC ${heatmapDays}\uC77C \xB7 KST \xB7 \uC694\uC77C\xD7\uC2DC\uAC04)`,
      headerRight: /* @__PURE__ */ React.createElement(CohortSelector, { value: heatmapDays, onChange: setHeatmapDays })
    }
  ), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 8, lineHeight: 1.6 } }, summaryError ? "\uC11C\uBC84 \uBD84\uC11D \uB370\uC774\uD130 \uC5C6\uC74C \u2014 schema-v9 + \uC6CC\uCEE4 deploy \uD544\uC694." : "\uC140\uC5D0 \uD638\uBC84\uD558\uBA74 \uC815\uD655\uD55C \uD398\uC774\uC9C0\uBDF0 / \uC138\uC158 \uC218 \uD655\uC778. \uC0C9\uC774 \uC9C4\uD560\uC218\uB85D \uD2B8\uB798\uD53D\uC774 \uBAB0\uB9B0 \uC2DC\uAC04\uB300.")), /* @__PURE__ */ React.createElement("div", { className: "admin-section__title" }, "\uC720\uC785 \uACBD\uB85C (\uCD5C\uADFC ", refDays, "\uC77C)"), /* @__PURE__ */ React.createElement(
    RankedBarList,
    {
      items: refs.map((r) => ({
        label: r.host === "self" ? "\uC9C1\uC811 \uBC29\uBB38 (\uC0AC\uC774\uD2B8 \uB0B4)" : r.host,
        count: r.count
      })),
      unit: "\uD68C",
      emptyText: summaryError ? "\uC11C\uBC84 \uBD84\uC11D \uB370\uC774\uD130 \uBBF8\uC218\uC2E0." : "\uC544\uC9C1 referrer \uB370\uC774\uD130\uAC00 \uCDA9\uBD84\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uC0AC\uC6A9\uC790 \uBC29\uBB38\uC774 \uB204\uC801\uB418\uBA74 \uC790\uB3D9 \uD45C\uC2DC.",
      headerLeft: "TRAFFIC SOURCES",
      headerRight: /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, /* @__PURE__ */ React.createElement(CohortSelector, { value: refDays, onChange: setRefDays }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: loadSummary, disabled: loadingSummary, style: { padding: "4px 10px", fontSize: 11 } }, loadingSummary ? "\u23F3" : "\u{1F504}"))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "admin-section__title" }, "\uC778\uAE30 \uD398\uC774\uC9C0 (\uCD5C\uADFC ", routeDays, "\uC77C)"), /* @__PURE__ */ React.createElement(
    RankedBarList,
    {
      items: (pv.topRoutes || []).map((r) => ({
        label: r.route,
        count: r.count,
        color: "var(--secondary, #1F7A8C)"
      })),
      valueFormat: (c) => `${c} views`,
      emptyText: summaryError ? "\uC11C\uBC84 \uBD84\uC11D \uB370\uC774\uD130 \uBBF8\uC218\uC2E0." : "\uB370\uC774\uD130\uAC00 \uB204\uC801\uB418\uBA74 \uC790\uB3D9 \uD45C\uC2DC.",
      headerLeft: "POPULAR PAGES",
      headerRight: /* @__PURE__ */ React.createElement(CohortSelector, { value: routeDays, onChange: setRouteDays })
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-2" }, /* @__PURE__ */ React.createElement("article", { className: "card card-gold" }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.24em", marginBottom: 8 } }, "LATEST COMMUNITY"), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 20, marginBottom: 12 } }, "\uAC00\uC7A5 \uCD5C\uADFC \uCEE4\uBBA4\uB2C8\uD2F0 \uAE00"), latestCommunityPost ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { className: "badge badge-gold" }, latestCommunityPost.category), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, latestCommunityPost.date)), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 16, marginBottom: 10 } }, latestCommunityPost.title), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 16 } }, "\uC791\uC131\uC790 ", latestCommunityPost.author, " \xB7 \uC870\uD68C ", latestCommunityPost.views, " \xB7 \uB313\uAE00 ", latestCommunityPost.replies)) : /* @__PURE__ */ React.createElement("p", { className: "dim" }, "\uB4F1\uB85D\uB41C \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setTab("\uCEE4\uBBA4\uB2C8\uD2F0") }, "\uCEE4\uBBA4\uB2C8\uD2F0 \uAD00\uB9AC\uB85C \uC774\uB3D9")), /* @__PURE__ */ React.createElement("article", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.24em", marginBottom: 8 } }, "OPERATIONS SNAPSHOT"), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 20, marginBottom: 12 } }, "\uC6B4\uC601 \uC694\uC57D"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 12, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uCD5C\uADFC \uCE7C\uB7FC"), /* @__PURE__ */ React.createElement("span", null, (latestColumn == null ? void 0 : latestColumn.title) || "\uC5C6\uC74C")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uB2E4\uC74C \uAC15\uC5F0"), /* @__PURE__ */ React.createElement("span", null, ((_g = G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
  }).filter((l) => l && !l.hidden)[0]) == null ? void 0 : _g.next) || "\uC5C6\uC74C")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uB2E4\uC74C \uD22C\uC5B4"), /* @__PURE__ */ React.createElement("span", null, ((_h = G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_TOURS) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
  }).filter((t) => t && !t.hidden)[0]) == null ? void 0 : _h.next) || "\uC5C6\uC74C"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setTab("\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC") }, "\uCE7C\uB7FC \uAD00\uB9AC"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setTab("\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8") }, "\uD22C\uC5B4 \uAD00\uB9AC")))));
};
const SankeyFlow = window.SankeyFlow;
const UserJourneyPanel = () => {
  const [flowPairs, setFlowPairs] = React.useState([]);
  const [flowDays, setFlowDays] = React.useState(30);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      var _a, _b, _c;
      try {
        const data = await ((_c = (_b = (_a = window.BGNJ_API) == null ? void 0 : _a.analytics) == null ? void 0 : _b.summary) == null ? void 0 : _c.call(_b, { days: flowDays }));
        if (cancelled) return;
        setFlowPairs(Array.isArray(data == null ? void 0 : data.flowPairs) ? data.flowPairs : []);
      } catch (e) {
        if (cancelled) return;
        setFlowPairs([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [flowDays]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    AdminPanelHeader,
    {
      eyebrow: "JOURNEY \xB7 \uC0AC\uC6A9\uC790 \uC5EC\uC815",
      title: "\uACE0\uAC1D \uC5EC\uC815 \uD750\uB984",
      description: "\uC720\uC785 \uCC44\uB110 \u2192 \uB2E8\uACC4 \u2192 \uB3C4\uCC29 \uD398\uC774\uC9C0\uC758 \uC9D1\uACC4 Sankey \uD750\uB984. \uB178\uB4DC/\uACE1\uC120 \uD638\uBC84 \uC2DC \uC5F0\uACB0 \uD750\uB984 \uAC15\uC870. \uC6B0\uC0C1\uB2E8 [\uAE30\uAC04] \uC73C\uB85C \uCF54\uD638\uD2B8 \uBCC0\uACBD."
    }
  ), /* @__PURE__ */ React.createElement(SankeyFlow, { pairs: flowPairs, days: flowDays, onDaysChange: setFlowDays }));
};
const BulkLectureImport = ({ onClose, onDone }) => {
  const [text, setText] = React.useState("title,topic,venue,host,startsAt,durationMinutes,capacity,price,note\n");
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const _parseCsvLine = (line) => {
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === ",") {
          out.push(cur);
          cur = "";
        } else if (c === '"' && cur === "") inQ = true;
        else cur += c;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };
  const submit = async () => {
    setBusy(true);
    setResult(null);
    const lines = String(text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      setResult({ ok: 0, fail: [{ line: 0, err: "\uD5E4\uB354 + \uCD5C\uC18C 1\uD589 \uD544\uC694" }] });
      setBusy(false);
      return;
    }
    const header = _parseCsvLine(lines[0]);
    const expected = ["title", "topic", "venue", "host", "startsAt", "durationMinutes", "capacity", "price", "note"];
    if (expected.some((k, i) => header[i] !== k)) {
      setResult({ ok: 0, fail: [{ line: 1, err: `\uD5E4\uB354 \uD615\uC2DD \uBD88\uC77C\uCE58. \uC608\uC0C1: ${expected.join(",")}` }] });
      setBusy(false);
      return;
    }
    const fails = [];
    let ok = 0;
    for (let i = 1; i < lines.length; i++) {
      const cols = _parseCsvLine(lines[i]);
      const row = Object.fromEntries(expected.map((k, j) => [k, cols[j] || ""]));
      try {
        const id = `bulk-lec-${Date.now()}-${i}`;
        if (!row.title || !row.startsAt) throw new Error("title \uACFC startsAt \uD544\uC218");
        await window.BGNJ_LECTURES.saveLecture({
          id,
          title: row.title,
          topic: row.topic || "",
          venue: row.venue || "",
          host: row.host || "\uBC45\uAE30\uB178\uC790",
          next: row.startsAt.slice(0, 16).replace("T", " ").replace(/-/g, "."),
          startsAt: row.startsAt,
          durationMinutes: Number(row.durationMinutes || 90),
          capacity: Number(row.capacity || 30),
          price: Number(row.price || 0),
          note: row.note || ""
        });
        ok++;
      } catch (err) {
        fails.push({ line: i + 1, err: (err == null ? void 0 : err.message) || String(err) });
      }
    }
    setBusy(false);
    setResult({ ok, fail: fails });
    if (ok > 0) onDone == null ? void 0 : onDone();
  };
  return /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18, marginBottom: 18, border: "1px dashed var(--primary-dim)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("h4", { className: "ko-serif", style: { fontSize: 15, margin: 0 } }, "\u{1F4D1} \uAC15\uC5F0 \uC77C\uAD04 \uB4F1\uB85D (CSV)"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onClose }, "\uB2EB\uAE30")), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginBottom: 10 } }, "\uD615\uC2DD: ", /* @__PURE__ */ React.createElement("code", null, "title,topic,venue,host,startsAt,durationMinutes,capacity,price,note"), " (\uD5E4\uB354 1\uD589 + \uB370\uC774\uD130 N\uD589). startsAt \uC740 ISO 8601 (\uC608: ", /* @__PURE__ */ React.createElement("code", null, "2026-06-01T19:00:00+09:00"), "). \uC27C\uD45C/\uD070\uB530\uC634\uD45C \uD3EC\uD568 \uC2DC ", /* @__PURE__ */ React.createElement("code", null, '"..."'), " \uB85C \uAC10\uC2F8\uC138\uC694."), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 10,
      value: text,
      onChange: (e) => setText(e.target.value),
      style: { fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.5 }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: submit, disabled: busy }, busy ? "\uB4F1\uB85D \uC911\u2026" : "\uC77C\uAD04 \uB4F1\uB85D \uC2E4\uD589")), result && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, padding: 12, border: "1px solid var(--line)", fontSize: 12, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("div", { className: "gold mono", style: { marginBottom: 6 } }, "\uACB0\uACFC"), /* @__PURE__ */ React.createElement("div", null, "\u2705 \uC131\uACF5: ", /* @__PURE__ */ React.createElement("strong", null, result.ok), "\uAC74"), result.fail.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6 } }, "\u274C \uC2E4\uD328: ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--danger)" } }, result.fail.length), "\uAC74"), /* @__PURE__ */ React.createElement("ul", { style: { margin: "6px 0 0", paddingLeft: 18 } }, result.fail.map((f, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { color: "var(--danger)" } }, f.line, "\uD589 \u2014 ", f.err))))));
};
const LectureAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [editingId, setEditingId] = React.useState(null);
  const [galleryEditTarget, setGalleryEditTarget] = React.useState(null);
  const [draft, setDraft] = React.useState({ title: "", topic: "", venue: "", host: "", startsAt: "", durationMinutes: 90, capacity: 30, price: 0, note: "" });
  const [refundRejectNotes, setRefundRejectNotes] = React.useState({});
  const [showBulk, setShowBulk] = React.useState(false);
  const [contentEditingId, setContentEditingId] = React.useState(null);
  const [contentSchedule, setContentSchedule] = React.useState([]);
  const [contentNotes, setContentNotes] = React.useState([]);
  const [contentCover, setContentCover] = React.useState("");
  const [contentMsg, setContentMsg] = React.useState("");
  const lectures = React.useMemo(() => window.BGNJ_LECTURES.listAll({ includeHidden: true }), [tick]);
  const refresh = () => setTick((v) => v + 1);
  const startContentEdit = (l) => {
    var _a, _b;
    if (!l) return;
    const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
    const ovr = (sc.lecturePages || {})[l.id] || {};
    setContentEditingId(l.id);
    setContentSchedule(Array.isArray(ovr.schedule) ? ovr.schedule.slice() : []);
    setContentNotes(Array.isArray(ovr.notes) ? ovr.notes.slice() : []);
    setContentCover(ovr.coverDataUri || "");
    setContentMsg("");
  };
  const cancelContentEdit = () => {
    setContentEditingId(null);
    setContentSchedule([]);
    setContentNotes([]);
    setContentCover("");
    setContentMsg("");
  };
  const saveContentEdit = async () => {
    var _a, _b;
    if (!contentEditingId) return;
    try {
      const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
      const lecturePages = sc.lecturePages || {};
      const cleanS = contentSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ""), l: String(s.l || "") }));
      const cleanN = contentNotes.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      const next = { ...lecturePages, [contentEditingId]: {
        schedule: cleanS,
        notes: cleanN,
        coverDataUri: contentCover || void 0
      } };
      await window.BGNJ_SITE_CONTENT.saveSection("lecturePages", next);
      setContentMsg("\uC800\uC7A5\uB428 \u2014 \uAC15\uC5F0 \uD398\uC774\uC9C0\uC5D0 \uC989\uC2DC \uBC18\uC601.");
      setTimeout(() => setContentMsg(""), 2500);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const onPickContentCover = async (e) => {
    const result = await pickImageWithR2Fallback(e, { folder: "lecture-covers" });
    if (result) setContentCover(result);
  };
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = window.BGNJ_LECTURES.listAll({ includeHidden: true });
      await Promise.allSettled(list.map((l) => window.BGNJ_LECTURES.refreshRegistrations(l.id)));
      if (!cancelled) refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [lectures.length]);
  const startEdit = (l) => {
    const startsAtLocal = (() => {
      if (!l.startsAt) return "";
      const d = new Date(l.startsAt);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })();
    setEditingId(l.id);
    setDraft({
      title: l.title || "",
      topic: l.topic || "",
      venue: l.venue || "",
      host: l.host || "",
      next: l.next || "",
      startsAt: startsAtLocal,
      durationMinutes: l.durationMinutes || 90,
      capacity: l.capacity || 30,
      price: l.price || 0,
      note: l.note || ""
    });
  };
  const saveEdit = async () => {
    var _a, _b;
    if (editingId == null) return;
    const lecture = window.BGNJ_LECTURES.getLecture(editingId);
    if (!lecture) return;
    const startsAtIso = draft.startsAt ? new Date(draft.startsAt).toISOString() : lecture.startsAt;
    const next = draft.next || lecture.next;
    try {
      await window.BGNJ_LECTURES.saveLecture({
        id: lecture.id,
        title: draft.title,
        topic: draft.topic,
        venue: draft.venue,
        host: draft.host,
        next,
        startsAt: startsAtIso,
        durationMinutes: Number(draft.durationMinutes) || 90,
        capacity: Number(draft.capacity) || lecture.capacity,
        price: Number(draft.price) || 0,
        note: draft.note
      });
      try {
        (_b = (_a = window.BGNJ_BROADCAST) == null ? void 0 : _a.publish) == null ? void 0 : _b.call(_a, "lectures");
      } catch (e) {
      }
      setEditingId(null);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error("\uAC15\uC5F0 \uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const addNewLecture = async () => {
    var _a, _b, _c, _d;
    const id = `lecture-${Date.now()}`;
    const now = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
    const pad = (n) => String(n).padStart(2, "0");
    const startsAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T19:00:00+09:00`;
    const next = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} 19:00`;
    try {
      const created = await window.BGNJ_LECTURES.saveLecture({
        id,
        title: "\uC0C8 \uAC15\uC5F0",
        topic: "\uAC15\uC5F0 \uC8FC\uC81C\uB97C \uC785\uB825\uD558\uC138\uC694",
        venue: "\uC7A5\uC18C",
        host: "\uBC45\uAE30\uB178\uC790",
        next,
        startsAt,
        durationMinutes: 90,
        capacity: 30,
        price: 0,
        note: "\uAC15\uC5F0 \uC548\uB0B4\uB97C \uC785\uB825\uD558\uC138\uC694."
      });
      try {
        await ((_b = (_a = window.BGNJ_AUDIT) == null ? void 0 : _a.log) == null ? void 0 : _b.call(_a, { action: "lecture.create", target: `lecture:${id}` }));
      } catch (e) {
      }
      try {
        (_d = (_c = window.BGNJ_BROADCAST) == null ? void 0 : _c.publish) == null ? void 0 : _d.call(_c, "lectures");
      } catch (e) {
      }
      refresh();
      if (created) startEdit(created);
      else window.BGNJ_TOAST.error("\uAC15\uC5F0 \uC0DD\uC131 \uD6C4 \uAC1D\uCCB4\uB97C \uAC00\uC838\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uD398\uC774\uC9C0\uB97C \uC0C8\uB85C\uACE0\uCE68\uD574 \uC8FC\uC138\uC694.");
    } catch (err) {
      window.BGNJ_TOAST.error("\uAC15\uC5F0 \uC0DD\uC131 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const [showPageEditor, setShowPageEditor] = React.useState(false);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18, border: "1px solid var(--line)", background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowPageEditor((v) => !v),
      style: {
        width: "100%",
        padding: "12px 16px",
        textAlign: "left",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--ink)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    },
    /* @__PURE__ */ React.createElement("span", null, "\u{1F4CB} \uAC15\uC5F0 \uD398\uC774\uC9C0 \uCF58\uD150\uCE20 \u2014 \uAE00\uB85C\uBC8C \uC9C4\uD589\xB7\uCC38\uACE0 / \uD15C\uD50C\uB9BF / \uAC15\uC5F0\uBCC4 override"),
    /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, showPageEditor ? "\u25B2 \uB2EB\uAE30" : "\u25BC \uD3BC\uCE58\uAE30")
  ), showPageEditor && /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 18px", borderTop: "1px solid var(--line)", background: "var(--bg)" } }, window.LecturePageEditorPanel ? /* @__PURE__ */ React.createElement(window.LecturePageEditorPanel, null) : /* @__PURE__ */ React.createElement("p", { className: "dim" }, "\uD328\uB110 \uB85C\uB529 \uC911..."))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, margin: 0, flex: 1, minWidth: 280 } }, "\uAC15\uC5F0 \uC815\uC6D0 / \uC77C\uC815 / \uAC00\uACA9\uC744 \uC218\uC815\uD558\uACE0, \uC2E0\uCCAD\uC790 \uC785\uAE08\uC744 \uD655\uC778\uD574 \uCC38\uAC00\uB97C \uD655\uC815\uD569\uB2C8\uB2E4. \uACB0\uC81C\uB294 \uD604\uC7AC ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uBB34\uD1B5\uC7A5 \uC785\uAE08"), "\uB9CC \uC9C0\uC6D0\uD569\uB2C8\uB2E4. \uACC4\uC88C\uBC88\uD638\uB294 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uC2DC\uC2A4\uD15C \u2192 \uC124\uC815"), " \uD0ED\uC5D0\uC11C \uB4F1\uB85D\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, lectures.length === 0 && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: async () => {
    if (!await window.BGNJ_CONFIRM("\uC0D8\uD50C \uAC15\uC5F0 3\uAC1C\uB97C \uCD94\uAC00\uD569\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?", { danger: true })) return;
    const samples = [
      { title: "\uC655\uC758 \uAE38", topic: "\uC870\uC120 \uC655\uC2E4\uC758 \uC77C\uC0C1\uACFC \uC758\uB840", venue: "\uACBD\uBCF5\uAD81 \uC218\uC815\uC804", host: "\uBC45\uAE30\uB178\uC790", durationMinutes: 90, capacity: 30, price: 0, note: "\uACBD\uBCF5\uAD81 \uB2F5\uC0AC\uC640 \uD568\uAED8\uD558\uB294 \uC778\uBB38\uD559 \uAC15\uC5F0." },
      { title: "\uBB38(\u9580)\uC744 \uC77D\uB2E4", topic: "\uAD81\uAD90 \uBB38(\u9580)\uC5D0 \uC0C8\uACA8\uC9C4 \uC778\uBB38\uD559", venue: "\uCC3D\uB355\uAD81 \uC778\uC815\uC804", host: "\uBC45\uAE30\uB178\uC790", durationMinutes: 90, capacity: 30, price: 3e4, note: "\uAD81\uAD90 \uACF3\uACF3\uC758 \uBB38\uC5D0 \uB2F4\uAE34 \uC758\uBBF8\uB97C \uD574\uB3C5\uD569\uB2C8\uB2E4." },
      { title: "\uCC28(\u8336) \uD55C \uC794\uC758 \uC778\uBB38\uD559", topic: "\uB3D9\uC544\uC2DC\uC544 \uCC28 \uBB38\uD654\uC640 \uC0AC\uC720", venue: "\uBC45\uAE30\uB178\uC790 \uC0AC\uB791\uBC29", host: "\uBC45\uAE30\uB178\uC790", durationMinutes: 75, capacity: 20, price: 5e4, note: "\uCC28 \uD55C \uC794\uC5D0 \uB2F4\uAE34 \uCC9C \uB144\uC758 \uC0AC\uC720\uB97C \uD568\uAED8 \uB530\uB77C\uAC11\uB2C8\uB2E4." }
    ];
    const pad = (n) => String(n).padStart(2, "0");
    for (let i = 0; i < samples.length; i++) {
      const d = new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1e3);
      const startsAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T19:00:00+09:00`;
      const next = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} 19:00`;
      await window.BGNJ_LECTURES.saveLecture({ id: `sample-lecture-${Date.now()}-${i}`, ...samples[i], startsAt, next });
    }
    refresh();
  } }, "\uC0D8\uD50C \uB370\uC774\uD130 \uCD94\uAC00"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setShowBulk((v) => !v) }, "\u{1F4D1} \uC77C\uAD04 \uB4F1\uB85D"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: addNewLecture }, "\uFF0B \uC0C8 \uAC15\uC5F0 \uCD94\uAC00"))), showBulk && /* @__PURE__ */ React.createElement(BulkLectureImport, { onClose: () => setShowBulk(false), onDone: () => {
    var _a, _b;
    setShowBulk(false);
    refresh();
    try {
      (_b = (_a = window.BGNJ_BROADCAST) == null ? void 0 : _a.publish) == null ? void 0 : _b.call(_a, "lectures");
    } catch (e) {
    }
  } }), lectures.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card dim", style: { padding: 32, textAlign: "center" } }, "\uAD00\uB9AC\uD560 \uAC15\uC5F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 14 } }, lectures.map((l) => {
    const seats = window.BGNJ_LECTURES.getSeats(l.id);
    const regs = window.BGNJ_LECTURES.listRegistrations(l.id);
    const active = regs.filter((r) => r.status !== "cancelled");
    const isEditing = editingId === l.id;
    return /* @__PURE__ */ React.createElement("article", { key: l.id, className: "card", style: { padding: 20, opacity: l.hidden ? 0.55 : 1 } }, /* @__PURE__ */ React.createElement("header", { style: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18 } }, /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11, marginRight: 8 } }, "#", String(l.id).padStart(2, "0")), l.title, " \u2014 ", l.topic, l.hidden && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { marginLeft: 10, fontSize: 10, letterSpacing: "0.18em", color: "var(--danger)", border: "1px solid var(--danger)", padding: "1px 6px", borderRadius: 2 } }, "\uC228\uAE40")), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 11, marginTop: 4, letterSpacing: "0.12em" } }, l.next, " \xB7 ", l.venue, " \xB7 \uC9C4\uD589 ", l.host)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: seats.remaining <= 0 ? "var(--danger)" : "var(--primary)" } }, "\uC794\uC5EC ", seats.remaining, " / ", seats.capacity), seats.waitlist > 0 && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-2)" } }, "\uB300\uAE30 ", seats.waitlist), l.price > 0 ? /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-2)", border: "1px solid var(--line-2)", padding: "1px 6px" } }, "\uC720\uB8CC ", window.BGNJ_FMT.won(l.price)) : /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: "var(--secondary)", border: "1px solid var(--primary-dim)", padding: "1px 6px" } }, "FREE"))), isEditing ? /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, padding: "14px 0", borderTop: "1px solid var(--line)" } }, [
      { k: "title", l: "\uC81C\uBAA9", type: "text" },
      { k: "topic", l: "\uC8FC\uC81C", type: "text" },
      { k: "venue", l: "\uC7A5\uC18C", type: "text" },
      { k: "host", l: "\uC9C4\uD589", type: "text" },
      { k: "next", l: "\uD45C\uC2DC\uC6A9 \uC77C\uC815 \uBB38\uAD6C", type: "text", placeholder: "2026.05.02 \xB7 \uD1A0 19:00" },
      { k: "startsAt", l: "\uC2E4\uC81C \uC2DC\uC791(\uB85C\uCEEC)", type: "datetime-local" },
      { k: "durationMinutes", l: "\uC18C\uC694(\uBD84)", type: "number" },
      { k: "capacity", l: "\uC815\uC6D0", type: "number" },
      { k: "price", l: "\uCC38\uAC00\uBE44(\uC6D0)", type: "number" }
    ].map((f) => {
      var _a;
      return /* @__PURE__ */ React.createElement("div", { key: f.k, className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, f.l), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "field-input",
          type: f.type,
          placeholder: f.placeholder || "",
          value: (_a = draft[f.k]) != null ? _a : "",
          onChange: (e) => setDraft({ ...draft, [f.k]: e.target.value })
        }
      ));
    }), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBA54\uBAA8"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        className: "field-input",
        rows: 2,
        value: draft.note,
        onChange: (e) => setDraft({ ...draft, note: e.target.value })
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setEditingId(null) }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: saveEdit }, "\uC800\uC7A5"))) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: () => startEdit(l) }, "\u270E \uAC15\uC5F0 \uC815\uBCF4 (\uC81C\uBAA9\xB7\uC815\uC6D0\xB7\uC2DC\uAC04\xB7\uAC00\uACA9)"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => startContentEdit(l) }, "\u{1F4CB} \uAC15\uC5F0 \uC9C4\uD589\xB7\uCC38\uACE0\xB7\uCEE4\uBC84"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setGalleryEditTarget(l) }, "\u{1F5BC} \uD3EC\uC2A4\uD130\xB7\uD604\uC7A5\uC0AC\uC9C4"), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => {
          var _a;
          window.BGNJ_LECTURES.setHidden(l.id, !l.hidden);
          (_a = window.BGNJ_AUDIT) == null ? void 0 : _a.log({ action: l.hidden ? "lecture.unhide" : "lecture.hide", target: `lecture:${l.id}` });
          refresh();
        },
        style: { marginLeft: "auto" }
      },
      l.hidden ? "\u{1F441} \uD45C\uC2DC \uBCF5\uC6D0" : "\u{1F648} \uC228\uAE40 \uCC98\uB9AC"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: async () => {
          var _a, _b, _c;
          if (!await window.BGNJ_CONFIRM("\uC774 \uAC15\uC5F0\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694? \uC2DC\uB4DC \uAC15\uC5F0\uC740 \uC790\uB3D9 \uC228\uAE40 \uCC98\uB9AC\uB429\uB2C8\uB2E4 (\uB370\uC774\uD130 \uBCF4\uC874). \uAD00\uB9AC\uC790\uAC00 \uCD94\uAC00\uD55C \uAC15\uC5F0\uC740 \uC644\uC804 \uC0AD\uC81C\uB429\uB2C8\uB2E4.", { danger: true })) return;
          try {
            await window.BGNJ_LECTURES.deleteLecture(l.id);
            (_a = window.BGNJ_AUDIT) == null ? void 0 : _a.log({ action: "lecture.remove", target: `lecture:${l.id}` });
            try {
              (_c = (_b = window.BGNJ_BROADCAST) == null ? void 0 : _b.publish) == null ? void 0 : _c.call(_b, "lectures");
            } catch (e) {
            }
            refresh();
          } catch (err) {
            window.BGNJ_TOAST.error("\uAC15\uC5F0 \uC0AD\uC81C \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
          }
        },
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uC0AD\uC81C"
    )), contentEditingId === l.id && /* @__PURE__ */ React.createElement("section", { style: { marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.22em" } }, "\uC774 \uAC15\uC5F0\uC758 \uC9C4\uD589/\uCC38\uACE0 \uCF58\uD150\uCE20"), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 10, fontStyle: "italic" } }, "\uBE44\uC6CC\uB450\uBA74 \uAE00\uB85C\uBC8C (\uC6B4\uC601\uC124\uC815 \u2192 \uC0AC\uC774\uD2B8 \uCF58\uD150\uCE20 \u2192 \uAC15\uC5F0 \uD398\uC774\uC9C0) \uC0AC\uC6A9. \uCEE4\uBC84 \uBE44\uBA74 placeholder.")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 12, marginBottom: 12, display: "flex", gap: 14, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 96, height: 60, flexShrink: 0, border: "1px solid var(--line)", background: "var(--bg-2)", display: "grid", placeItems: "center", overflow: "hidden" } }, contentCover ? /* @__PURE__ */ React.createElement("img", { src: contentCover, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 9, letterSpacing: "0.18em" } }, "NONE")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 3 } }, "\uCEE4\uBC84 \uC774\uBBF8\uC9C0"), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.5 } }, "1600\xD71000 \uAD8C\uC7A5 \xB7 1.5MB \uC774\uD558 \xB7 \uBE44\uC6B0\uBA74 placeholder.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("label", { className: "btn btn-small", style: { cursor: "pointer" } }, "\uC5C5\uB85C\uB4DC", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", onChange: onPickContentCover, style: { display: "none" } })), contentCover && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => setContentCover(""),
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uC81C\uAC70"
    ))), /* @__PURE__ */ React.createElement(
      TPE_ScheduleEditor,
      {
        rows: contentSchedule,
        onAdd: () => setContentSchedule((a) => _arrAdd(a, { t: "", l: "" })),
        onRemove: (i) => setContentSchedule((a) => _arrRemove(a, i)),
        onUpdate: (i, k, v) => setContentSchedule((a) => {
          const n = a.slice();
          n[i] = { ...n[i], [k]: v };
          return n;
        }),
        onMove: (i, d) => setContentSchedule((a) => _arrMove(a, i, d))
      }
    ), /* @__PURE__ */ React.createElement(
      TPE_PrepEditor,
      {
        rows: contentNotes,
        onAdd: () => setContentNotes((a) => _arrAdd(a, "")),
        onRemove: (i) => setContentNotes((a) => _arrRemove(a, i)),
        onUpdate: (i, v) => setContentNotes((a) => _arrUpdate(a, i, v)),
        onMove: (i, d) => setContentNotes((a) => _arrMove(a, i, d))
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 } }, contentMsg && /* @__PURE__ */ React.createElement("span", { role: "status", className: "mono", style: { fontSize: 11, color: "var(--secondary)", fontWeight: 600, marginRight: "auto" } }, contentMsg), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: cancelContentEdit }, "\uB2EB\uAE30"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: saveContentEdit }, "\uC800\uC7A5"))), /* @__PURE__ */ React.createElement("section", { style: { marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "\uCC38\uAC00\uC790 \uBA85\uB2E8 \xB7 ", active.length, "\uBA85"), active.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, "\uC544\uC9C1 \uC2E0\uCCAD\uC790\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-3)", textTransform: "uppercase" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC5F0\uB77D\uCC98"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "right" } }, "\uC778\uC6D0"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "right" } }, "\uC561\uC158"))), /* @__PURE__ */ React.createElement("tbody", null, active.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.id, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: 10 } }, r.name), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 10, fontSize: 11 } }, r.email), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 10, fontSize: 11 } }, r.phone || "-"), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: 10, textAlign: "right" } }, r.count), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: 10, fontSize: 10, letterSpacing: "0.18em", color: r.status === "confirmed" ? "var(--primary)" : r.status === "waitlist" ? "var(--ink-2)" : r.status === "pending_payment" ? "var(--ink-2)" : "var(--danger)" } }, r.status === "pending_payment" ? "\uC785\uAE08 \uB300\uAE30" : r.status === "confirmed" ? "\uCC38\uAC00 \uD655\uC815" : r.status === "waitlist" ? "\uB300\uAE30\uC790" : r.status, r.paid && r.status === "confirmed" && /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { marginLeft: 6, fontSize: 9 } }, "\uC785\uAE08 \u2713")), /* @__PURE__ */ React.createElement("td", { style: { padding: 10, textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6, flexWrap: "wrap" } }, r.status === "pending_payment" && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => {
          window.BGNJ_LECTURES.confirmPayment(l.id, r.id);
          refresh();
        }
      },
      "\uC785\uAE08 \uD655\uC778 \u2192 \uD655\uC815"
    ), r.status === "confirmed" && r.price > 0 && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => {
          window.BGNJ_LECTURES.unconfirmPayment(l.id, r.id);
          refresh();
        }
      },
      "\uD655\uC815 \uCDE8\uC18C"
    ), r.status !== "refund_requested" && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: async () => {
          if (!await window.BGNJ_CONFIRM(`${r.name} \uB2D8 \uC2E0\uCCAD\uC744 \uCDE8\uC18C \uCC98\uB9AC\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
          window.BGNJ_LECTURES.cancelRegistration(l.id, r.id);
          refresh();
        },
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uCDE8\uC18C"
    ), r.status === "refund_requested" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 9, color: "var(--warning)", letterSpacing: "0.15em" } }, "\uD658\uBD88\uC2E0\uCCAD"), r.refundReason && /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 10 } }, "\xB7 ", r.refundReason), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: async () => {
          if (!await window.BGNJ_CONFIRM("\uD658\uBD88\uC744 \uC2B9\uC778\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) return;
          window.BGNJ_LECTURES.approveRefund(l.id, r.id);
          refresh();
        },
        style: { borderColor: "var(--primary)", color: "var(--secondary)" }
      },
      "\uC2B9\uC778"
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        placeholder: "\uBC18\uB824 \uC0AC\uC720",
        style: { padding: "4px 8px", fontSize: 11, maxWidth: 140 },
        value: refundRejectNotes[r.id] || "",
        onChange: (e) => setRefundRejectNotes({ ...refundRejectNotes, [r.id]: e.target.value })
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: async () => {
          if (!await window.BGNJ_CONFIRM("\uD658\uBD88 \uC2E0\uCCAD\uC744 \uBC18\uB824\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) return;
          window.BGNJ_LECTURES.rejectRefund(l.id, r.id, refundRejectNotes[r.id] || "");
          refresh();
        },
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uBC18\uB824"
    ))))))))));
  })), galleryEditTarget && window.LectureQuickAddModal && /* @__PURE__ */ React.createElement(
    window.LectureQuickAddModal,
    {
      onClose: () => setGalleryEditTarget(null),
      onSaved: refresh,
      initialLecture: galleryEditTarget
    }
  ));
};
const TourAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({});
  const [galleryEditTarget, setGalleryEditTarget] = React.useState(null);
  const [refundRejectNotes, setRefundRejectNotes] = React.useState({});
  const [contentEditingId, setContentEditingId] = React.useState(null);
  const [contentSchedule, setContentSchedule] = React.useState([]);
  const [contentPrep, setContentPrep] = React.useState([]);
  const [contentCover, setContentCover] = React.useState("");
  const [contentMsg, setContentMsg] = React.useState("");
  const refresh = () => setTick((v) => v + 1);
  const tours = React.useMemo(() => window.BGNJ_TOURS.listAll({ includeHidden: true }), [tick]);
  const startContentEdit = (t) => {
    var _a, _b;
    if (!t) return;
    const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
    const ovr = (sc.tourPages || {})[t.id] || {};
    setContentEditingId(t.id);
    setContentSchedule(Array.isArray(ovr.schedule) ? ovr.schedule.slice() : []);
    setContentPrep(Array.isArray(ovr.prep) ? ovr.prep.slice() : []);
    setContentCover(t.coverUrl || ovr.coverDataUri || "");
    setContentMsg("");
  };
  const cancelContentEdit = () => {
    setContentEditingId(null);
    setContentSchedule([]);
    setContentPrep([]);
    setContentCover("");
    setContentMsg("");
  };
  const saveContentEdit = async () => {
    var _a, _b;
    if (!contentEditingId) return;
    try {
      const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
      const tourPages = sc.tourPages || {};
      const cleanS = contentSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ""), l: String(s.l || "") }));
      const cleanP = contentPrep.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      const next = { ...tourPages, [contentEditingId]: {
        schedule: cleanS,
        prep: cleanP
      } };
      await window.BGNJ_SITE_CONTENT.saveSection("tourPages", next);
      try {
        await window.BGNJ_TOURS.saveTour({ id: contentEditingId, coverUrl: contentCover || "" });
      } catch (err) {
        console.warn("[v00.081] cover_url save \uC2E4\uD328 \u2014 site_content fallback \uC0AC\uC6A9 \uAC00\uB2A5", err);
      }
      setContentMsg("\uC800\uC7A5\uB428 \u2014 \uD22C\uC5B4 \uD398\uC774\uC9C0\uC5D0 \uC989\uC2DC \uBC18\uC601.");
      setTimeout(() => setContentMsg(""), 2500);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const onPickContentCover = async (e) => {
    const result = await pickImageWithR2Fallback(e, { folder: "tour-covers" });
    if (result) setContentCover(result);
  };
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = window.BGNJ_TOURS.listAll({ includeHidden: true });
      await Promise.allSettled(list.map((t) => window.BGNJ_TOURS.refreshReservations(t.id)));
      if (!cancelled) refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [tours.length]);
  const startEdit = (t) => {
    if (!t) return;
    const startsAtLocal = (() => {
      if (!t.startsAt) return "";
      const d = new Date(t.startsAt);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })();
    setEditingId(t.id);
    setDraft({
      title: t.title || "",
      subtitle: t.subtitle || "",
      // v00.106
      level: t.level || "\uC785\uBB38",
      duration: t.duration || "",
      group: t.group || "",
      startsAt: startsAtLocal,
      // v00.106 — next 와 통합. next 는 startsAt 에서 자동 derive.
      durationMinutes: t.durationMinutes || 180,
      capacity: t.capacity || 12,
      priceNumber: t.priceNumber || 0,
      desc: t.desc || "",
      refundPolicy: t.refundPolicy || ""
      // v00.106
    });
  };
  const saveEdit = async () => {
    if (editingId == null) return;
    const tour = window.BGNJ_TOURS.getTour(editingId);
    if (!tour) return;
    const startsAtIso = draft.startsAt ? new Date(draft.startsAt).toISOString() : tour.startsAt;
    const nextLabel = (() => {
      if (!startsAtIso) return tour.next || "";
      const d = new Date(startsAtIso);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })();
    try {
      await window.BGNJ_TOURS.saveTour({
        id: tour.id,
        title: draft.title,
        subtitle: draft.subtitle,
        // v00.106
        level: draft.level,
        duration: draft.duration,
        group: draft.group,
        next: nextLabel,
        startsAt: startsAtIso,
        durationMinutes: Number(draft.durationMinutes) || 180,
        capacity: Number(draft.capacity) || tour.capacity,
        priceNumber: Number(draft.priceNumber) || 0,
        price: Number(draft.priceNumber) || 0,
        desc: draft.desc,
        refundPolicy: draft.refundPolicy
        // v00.106
      });
      setEditingId(null);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error("\uD22C\uC5B4 \uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const addNewTour = async () => {
    var _a, _b, _c;
    const id = `tour-${Date.now()}`;
    const now = new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3);
    const pad = (n) => String(n).padStart(2, "0");
    const startsAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T10:00:00+09:00`;
    const next = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} 10:00`;
    try {
      const tour = await window.BGNJ_TOURS.saveTour({
        id,
        title: "\uC0C8 \uB2F5\uC0AC \u2014 \uBD80\uC81C",
        level: "\uC785\uBB38",
        duration: "3\uC2DC\uAC04",
        group: "12\uC778 \uC774\uD558",
        next,
        startsAt,
        durationMinutes: 180,
        capacity: 12,
        priceNumber: 8e4,
        price: 8e4,
        desc: "\uB2F5\uC0AC \uC548\uB0B4\uB97C \uC785\uB825\uD558\uC138\uC694."
      });
      if (!tour) throw new Error("\uC11C\uBC84 \uC751\uB2F5 \uC5C6\uC74C");
      (_a = window.BGNJ_AUDIT) == null ? void 0 : _a.log({ action: "tour.create", target: `tour:${id}` });
      try {
        (_c = (_b = window.BGNJ_BROADCAST) == null ? void 0 : _b.publish) == null ? void 0 : _c.call(_b, "tours");
      } catch (e) {
      }
      refresh();
      startEdit(tour);
    } catch (err) {
      window.BGNJ_TOAST.error("\uD22C\uC5B4 \uC0DD\uC131 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
      refresh();
    }
  };
  const removeTour = async (id) => {
    var _a, _b, _c;
    if (!await window.BGNJ_CONFIRM("\uC774 \uD22C\uC5B4\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694? \uC2DC\uB4DC \uD22C\uC5B4\uB294 \uC790\uB3D9 \uC228\uAE40 \uCC98\uB9AC(\uB370\uC774\uD130 \uBCF4\uC874)\uB429\uB2C8\uB2E4. \uAD00\uB9AC\uC790\uAC00 \uCD94\uAC00\uD55C \uD22C\uC5B4\uB294 \uC644\uC804 \uC0AD\uC81C\uB429\uB2C8\uB2E4.", { danger: true })) return;
    try {
      await window.BGNJ_TOURS.deleteTour(id);
      (_a = window.BGNJ_AUDIT) == null ? void 0 : _a.log({ action: "tour.remove", target: `tour:${id}` });
      try {
        (_c = (_b = window.BGNJ_BROADCAST) == null ? void 0 : _b.publish) == null ? void 0 : _c.call(_b, "tours");
      } catch (e) {
      }
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error("\uD22C\uC5B4 \uC0AD\uC81C \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const toggleTourHidden = async (t) => {
    var _a;
    try {
      await window.BGNJ_TOURS.setHidden(t.id, !t.hidden);
      (_a = window.BGNJ_AUDIT) == null ? void 0 : _a.log({ action: t.hidden ? "tour.unhide" : "tour.hide", target: `tour:${t.id}` });
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error("\uC228\uAE40 \uC0C1\uD0DC \uBCC0\uACBD \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const [showPageEditor, setShowPageEditor] = React.useState(false);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18, border: "1px solid var(--line)", background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowPageEditor((v) => !v),
      style: {
        width: "100%",
        padding: "12px 16px",
        textAlign: "left",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--ink)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    },
    /* @__PURE__ */ React.createElement("span", null, "\u{1F4CB} \uD22C\uC5B4 \uD398\uC774\uC9C0 \uCF58\uD150\uCE20 \u2014 \uAE00\uB85C\uBC8C \uB2F5\uC0AC \uC77C\uC815\xB7\uC900\uBE44\uBB3C / \uD15C\uD50C\uB9BF / \uD22C\uC5B4\uBCC4 override"),
    /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, showPageEditor ? "\u25B2 \uB2EB\uAE30" : "\u25BC \uD3BC\uCE58\uAE30")
  ), showPageEditor && /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 18px", borderTop: "1px solid var(--line)", background: "var(--bg)" } }, window.TourPageEditorPanel ? /* @__PURE__ */ React.createElement(window.TourPageEditorPanel, null) : /* @__PURE__ */ React.createElement("p", { className: "dim" }, "\uD328\uB110 \uB85C\uB529 \uC911..."))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, margin: 0, flex: 1, minWidth: 280 } }, "\uD22C\uC5B4 \uC815\uC6D0 / \uC77C\uC815 / \uAC00\uACA9\uC744 \uC218\uC815\uD558\uACE0, \uC2E0\uCCAD\uC790 \uC785\uAE08\uC744 \uD655\uC778\uD574 \uCC38\uAC00\uB97C \uD655\uC815\uD569\uB2C8\uB2E4. \uACB0\uC81C\uB294 \uD604\uC7AC ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uBB34\uD1B5\uC7A5 \uC785\uAE08"), "\uB9CC \uC9C0\uC6D0\uD569\uB2C8\uB2E4(\uAC15\uC5F0\uACFC \uAC19\uC740 \uACC4\uC88C \uC0AC\uC6A9)."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, tours.length === 0 && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: async () => {
    if (!await window.BGNJ_CONFIRM("\uC0D8\uD50C \uB2F5\uC0AC 3\uAC1C\uB97C \uCD94\uAC00\uD569\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?", { danger: true })) return;
    const samples = [
      { title: "\uACBD\uBCF5\uAD81 \u2014 \uC655\uC758 \uC77C\uC0C1", location: "\uACBD\uBCF5\uAD81 \uC77C\uB300", host: "\uBC45\uAE30\uB178\uC790", durationMinutes: 180, capacity: 15, price: 3e4, desc: "\uACBD\uBCF5\uAD81 \uC678\uC804\xB7\uB0B4\uC804\uC744 \uB530\uB77C \uC655\uC758 \uD558\uB8E8\uB97C \uC887\uB294 \uB2F5\uC0AC." },
      { title: "\uCC3D\uB355\uAD81 \u2014 \uD6C4\uC6D0 \uC0B0\uCC45", location: "\uCC3D\uB355\uAD81 \uD6C4\uC6D0", host: "\uBC45\uAE30\uB178\uC790", durationMinutes: 150, capacity: 12, price: 35e3, desc: "\uBE44\uC6D0\uC758 \uC808\uACBD\uACFC \uD568\uAED8\uD558\uB294 \uC778\uBB38\uD559 \uC0B0\uCC45." },
      { title: "\uBD81\uCD0C \u2014 \uD55C\uC625\uACFC \uC0AC\uB78C", location: "\uBD81\uCD0C \uD55C\uC625\uB9C8\uC744", host: "\uBC45\uAE30\uB178\uC790", durationMinutes: 120, capacity: 10, price: 25e3, desc: "\uBD81\uCD0C\uC758 \uACE8\uBAA9\uACFC \uD55C\uC625\uC5D0 \uB2F4\uAE34 \uC774\uC57C\uAE30\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4." }
    ];
    const pad = (n) => String(n).padStart(2, "0");
    for (let i = 0; i < samples.length; i++) {
      const d = new Date(Date.now() + (i + 2) * 7 * 24 * 60 * 60 * 1e3);
      const startsAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00:00+09:00`;
      const next = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} 10:00`;
      const sample = samples[i];
      await window.BGNJ_TOURS.saveTour({
        id: `sample-tour-${Date.now()}-${i}`,
        title: sample.title,
        level: "\uC785\uBB38",
        duration: `${Math.round(sample.durationMinutes / 60)}\uC2DC\uAC04`,
        group: `\uC18C\uADF8\uB8F9 (\uCD5C\uB300 ${sample.capacity}\uBA85)`,
        next,
        startsAt,
        durationMinutes: sample.durationMinutes,
        capacity: sample.capacity,
        priceNumber: sample.price,
        price: sample.price,
        desc: sample.desc,
        location: sample.location,
        host: sample.host
      });
    }
    refresh();
  } }, "\uC0D8\uD50C \uB370\uC774\uD130 \uCD94\uAC00"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: addNewTour }, "\uFF0B \uC0C8 \uD22C\uC5B4 \uCD94\uAC00"))), tours.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card dim", style: { padding: 32, textAlign: "center" } }, "\uAD00\uB9AC\uD560 \uD22C\uC5B4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 14 } }, tours.map((t) => {
    var _a, _b, _c;
    const seats = window.BGNJ_TOURS.getSeats(t.id);
    const regs = window.BGNJ_TOURS.listReservations(t.id);
    const active = regs.filter((r) => r.status !== "cancelled");
    const isEditing = editingId === t.id;
    return /* @__PURE__ */ React.createElement("article", { key: t.id, className: "card", style: { padding: 20, opacity: t.hidden ? 0.55 : 1 } }, /* @__PURE__ */ React.createElement("header", { style: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18 } }, /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11, marginRight: 8 } }, "#", String(t.id).padStart(2, "0")), t.title, t.hidden && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { marginLeft: 10, fontSize: 10, letterSpacing: "0.18em", color: "var(--danger)", border: "1px solid var(--danger)", padding: "1px 6px", borderRadius: 2 } }, "\uC228\uAE40")), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 11, marginTop: 4, letterSpacing: "0.12em" } }, t.next, " \xB7 ", t.duration, " \xB7 ", t.group, " \xB7 ", t.level)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: seats.remaining <= 0 ? "var(--danger)" : "var(--primary)" } }, "\uC794\uC5EC ", seats.remaining, " / ", seats.capacity), seats.waitlist > 0 && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-2)" } }, "\uB300\uAE30 ", seats.waitlist), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-2)", border: "1px solid var(--line-2)", padding: "1px 6px" } }, window.BGNJ_FMT.won(t.priceNumber)))), isEditing ? (
      // v00.106 — 폼 재구성: 사용자 요청 순서. 표시 일정 문구 + startsAt 통합 (next 자동 derive).
      /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uD22C\uC5B4\uBA85"), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "field-input",
          type: "text",
          value: draft.title || "",
          onChange: (e) => setDraft({ ...draft, title: e.target.value })
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBD80\uC81C"), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "field-input",
          type: "text",
          placeholder: "\uC608: \uC655\uC758 \uBC1C\uC790\uCDE8\uB97C \uB530\uB77C",
          value: draft.subtitle || "",
          onChange: (e) => setDraft({ ...draft, subtitle: e.target.value })
        }
      ))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uB09C\uC774\uB3C4"), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "field-input",
          type: "text",
          placeholder: "\uC785\uBB38 / \uC2EC\uD654",
          value: draft.level || "",
          onChange: (e) => setDraft({ ...draft, level: e.target.value })
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC18C\uC694 (\uD45C\uC2DC)"), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "field-input",
          type: "text",
          placeholder: "3\uC2DC\uAC04",
          value: draft.duration || "",
          onChange: (e) => setDraft({ ...draft, duration: e.target.value })
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC815\uC6D0 (\uD45C\uC2DC)"), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "field-input",
          type: "text",
          placeholder: "12\uC778 \uC774\uD558",
          value: draft.group || "",
          onChange: (e) => setDraft({ ...draft, group: e.target.value })
        }
      ))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC77C\uC815 (\uC2E4\uC81C \uC2DC\uC791 \uC2DC\uAC04 \u2014 \uD45C\uC2DC \uBB38\uAD6C\uB294 \uC790\uB3D9 \uC0DD\uC131)"), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "field-input",
          type: "datetime-local",
          value: draft.startsAt || "",
          onChange: (e) => setDraft({ ...draft, startsAt: e.target.value })
        }
      ))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC18C\uC694 \uC2DC\uAC04 (\uBD84)"), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "field-input",
          type: "number",
          placeholder: "180",
          value: (_a = draft.durationMinutes) != null ? _a : "",
          onChange: (e) => setDraft({ ...draft, durationMinutes: e.target.value })
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC815\uC6D0 (\uC22B\uC790)"), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "field-input",
          type: "number",
          placeholder: "12",
          value: (_b = draft.capacity) != null ? _b : "",
          onChange: (e) => setDraft({ ...draft, capacity: e.target.value })
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uCC38\uAC00\uBE44 (\uC6D0)"), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "field-input",
          type: "number",
          placeholder: "80000",
          value: (_c = draft.priceNumber) != null ? _c : "",
          onChange: (e) => setDraft({ ...draft, priceNumber: e.target.value })
        }
      ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC124\uBA85"), /* @__PURE__ */ React.createElement(
        "textarea",
        {
          className: "field-input",
          rows: 3,
          value: draft.desc || "",
          onChange: (e) => setDraft({ ...draft, desc: e.target.value })
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uD658\uBD88\uC815\uCC45"), /* @__PURE__ */ React.createElement(
        "textarea",
        {
          className: "field-input",
          rows: 3,
          value: draft.refundPolicy || "",
          placeholder: "\uC608: \uCD9C\uBC1C 7\uC77C \uC804\uAE4C\uC9C0 100% \uD658\uBD88 / 3\uC77C \uC804\uAE4C\uC9C0 50% / \uC774\uD6C4 \uD658\uBD88 \uBD88\uAC00",
          onChange: (e) => setDraft({ ...draft, refundPolicy: e.target.value })
        }
      ), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 4, lineHeight: 1.5 } }, "\u24D8 \uBE44\uC6B0\uBA74 \uC6B4\uC601\uC124\uC815\uC758 \uAE00\uB85C\uBC8C \uD658\uBD88\uC815\uCC45 \uC0AC\uC6A9 (\uB2E4\uC74C \uC0AC\uC774\uD074 \uB3C4\uC785 \uC608\uC815).")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setEditingId(null) }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: saveEdit }, "\uC800\uC7A5")), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 8, lineHeight: 1.6 } }, "\u203B \uC138\uBD80 \uC77C\uC815 / \uC900\uBE44\uBB3C \uC740 \uC544\uB798 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F4CB} \uB2F5\uC0AC \uC77C\uC815\xB7\uC900\uBE44\uBB3C\xB7\uCEE4\uBC84"), " \uBC84\uD2BC\uC5D0\uC11C \uD3B8\uC9D1 (\uC9C4\uD589 \uD750\uB984 + \uC900\uBE44\uBB3C list + \uCEE4\uBC84 \uC774\uBBF8\uC9C0)."))
    ) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: () => startEdit(t) }, "\u270E \uD22C\uC5B4 \uC815\uBCF4 (\uC81C\uBAA9\xB7\uC815\uC6D0\xB7\uB09C\uC774\uB3C4\xB7\uC18C\uC694\uC2DC\uAC04\xB7\uAC00\uACA9)"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => startContentEdit(t) }, "\u{1F4CB} \uB2F5\uC0AC \uC77C\uC815\xB7\uC900\uBE44\uBB3C\xB7\uCEE4\uBC84"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setGalleryEditTarget(t) }, "\u{1F5BC} \uC0AC\uC9C4 \uAC24\uB7EC\uB9AC"), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => toggleTourHidden(t),
        style: { marginLeft: "auto" }
      },
      t.hidden ? "\u{1F441} \uD45C\uC2DC \uBCF5\uC6D0" : "\u{1F648} \uC228\uAE40 \uCC98\uB9AC"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => removeTour(t.id),
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uC0AD\uC81C"
    )), contentEditingId === t.id && /* @__PURE__ */ React.createElement("section", { style: { marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.22em" } }, "\uC774 \uD22C\uC5B4\uC758 \uB2F5\uC0AC \uCF58\uD150\uCE20"), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 10, fontStyle: "italic" } }, "\uBE44\uC6CC\uB450\uBA74 \uAE00\uB85C\uBC8C \uB2F5\uC0AC \uC77C\uC815/\uC900\uBE44\uBB3C (\uC6B4\uC601\uC124\uC815 \u2192 \uD22C\uC5B4 \uD398\uC774\uC9C0) \uC0AC\uC6A9. \uCEE4\uBC84 \uBE44\uBA74 placeholder.")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 12, marginBottom: 12, display: "flex", gap: 14, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 96, height: 60, flexShrink: 0, border: "1px solid var(--line)", background: "var(--bg-2)", display: "grid", placeItems: "center", overflow: "hidden" } }, contentCover ? /* @__PURE__ */ React.createElement("img", { src: contentCover, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 9, letterSpacing: "0.18em" } }, "NONE")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 3 } }, "\uCEE4\uBC84 \uC774\uBBF8\uC9C0"), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.5 } }, "1600\xD71000 \uAD8C\uC7A5 \xB7 1.5MB \uC774\uD558 \xB7 \uBE44\uC6B0\uBA74 placeholder.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("label", { className: "btn btn-small", style: { cursor: "pointer" } }, "\uC5C5\uB85C\uB4DC", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", onChange: onPickContentCover, style: { display: "none" } })), contentCover && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => setContentCover(""),
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uC81C\uAC70"
    ))), /* @__PURE__ */ React.createElement(
      TPE_ScheduleEditor,
      {
        rows: contentSchedule,
        onAdd: () => setContentSchedule((a) => _arrAdd(a, { t: "", l: "" })),
        onRemove: (i) => setContentSchedule((a) => _arrRemove(a, i)),
        onUpdate: (i, k, v) => setContentSchedule((a) => {
          const n = a.slice();
          n[i] = { ...n[i], [k]: v };
          return n;
        }),
        onMove: (i, d) => setContentSchedule((a) => _arrMove(a, i, d))
      }
    ), /* @__PURE__ */ React.createElement(
      TPE_PrepEditor,
      {
        rows: contentPrep,
        onAdd: () => setContentPrep((a) => _arrAdd(a, "")),
        onRemove: (i) => setContentPrep((a) => _arrRemove(a, i)),
        onUpdate: (i, v) => setContentPrep((a) => _arrUpdate(a, i, v)),
        onMove: (i, d) => setContentPrep((a) => _arrMove(a, i, d))
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 } }, contentMsg && /* @__PURE__ */ React.createElement("span", { role: "status", className: "mono", style: { fontSize: 11, color: "var(--secondary)", fontWeight: 600, marginRight: "auto" } }, contentMsg), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: cancelContentEdit }, "\uB2EB\uAE30"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: saveContentEdit }, "\uC800\uC7A5"))), /* @__PURE__ */ React.createElement("section", { style: { marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "\uCC38\uAC00\uC790 \uBA85\uB2E8 \xB7 ", active.length, "\uBA85"), active.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, "\uC544\uC9C1 \uC2E0\uCCAD\uC790\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-3)", textTransform: "uppercase" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC5F0\uB77D\uCC98"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "right" } }, "\uC778\uC6D0"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "right" } }, "\uC561\uC158"))), /* @__PURE__ */ React.createElement("tbody", null, active.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.id, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: 10 } }, r.name), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 10, fontSize: 11 } }, r.email), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 10, fontSize: 11 } }, r.phone || "-"), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: 10, textAlign: "right" } }, r.count), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: 10, fontSize: 10, letterSpacing: "0.18em", color: r.status === "confirmed" ? "var(--primary)" : r.status === "waitlist" ? "var(--ink-2)" : r.status === "pending_payment" ? "var(--ink-2)" : "var(--danger)" } }, r.status === "pending_payment" ? "\uC785\uAE08 \uB300\uAE30" : r.status === "confirmed" ? "\uCC38\uAC00 \uD655\uC815" : r.status === "waitlist" ? "\uB300\uAE30\uC790" : r.status, r.paid && r.status === "confirmed" && /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { marginLeft: 6, fontSize: 9 } }, "\uC785\uAE08 \u2713")), /* @__PURE__ */ React.createElement("td", { style: { padding: 10, textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6, flexWrap: "wrap" } }, r.status === "pending_payment" && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => {
          window.BGNJ_TOURS.confirmPayment(t.id, r.id);
          refresh();
        }
      },
      "\uC785\uAE08 \uD655\uC778 \u2192 \uD655\uC815"
    ), r.status === "confirmed" && r.price > 0 && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => {
          window.BGNJ_TOURS.unconfirmPayment(t.id, r.id);
          refresh();
        }
      },
      "\uD655\uC815 \uCDE8\uC18C"
    ), r.status !== "refund_requested" && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: async () => {
          if (!await window.BGNJ_CONFIRM(`${r.name} \uB2D8 \uC2E0\uCCAD\uC744 \uCDE8\uC18C \uCC98\uB9AC\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
          window.BGNJ_TOURS.cancelReservation(t.id, r.id);
          refresh();
        },
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uCDE8\uC18C"
    ), r.status === "refund_requested" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 9, color: "var(--warning)", letterSpacing: "0.15em" } }, "\uD658\uBD88\uC2E0\uCCAD"), r.refundReason && /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 10 } }, "\xB7 ", r.refundReason), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: async () => {
          if (!await window.BGNJ_CONFIRM("\uD658\uBD88\uC744 \uC2B9\uC778\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) return;
          window.BGNJ_TOURS.approveRefund(t.id, r.id);
          refresh();
        },
        style: { borderColor: "var(--primary)", color: "var(--secondary)" }
      },
      "\uC2B9\uC778"
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        placeholder: "\uBC18\uB824 \uC0AC\uC720",
        style: { padding: "4px 8px", fontSize: 11, maxWidth: 140 },
        value: refundRejectNotes[r.id] || "",
        onChange: (e) => setRefundRejectNotes({ ...refundRejectNotes, [r.id]: e.target.value })
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: async () => {
          if (!await window.BGNJ_CONFIRM("\uD658\uBD88 \uC2E0\uCCAD\uC744 \uBC18\uB824\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) return;
          window.BGNJ_TOURS.rejectRefund(t.id, r.id, refundRejectNotes[r.id] || "");
          refresh();
        },
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uBC18\uB824"
    ))))))))));
  })), galleryEditTarget && window.TourQuickAddModal && /* @__PURE__ */ React.createElement(
    window.TourQuickAddModal,
    {
      onClose: () => setGalleryEditTarget(null),
      onSaved: refresh,
      initialTour: galleryEditTarget
    }
  ));
};
const BankAccountPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [accounts, setAccounts] = React.useState(() => window.BGNJ_LECTURES.listBankAccounts());
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({ label: "", bankName: "", accountNumber: "", holder: "", memo: "", isDefault: false });
  const [msg, setMsg] = React.useState("");
  const refresh = async () => {
    await window.BGNJ_LECTURES.refreshBankAccount();
    setAccounts(window.BGNJ_LECTURES.listBankAccounts());
    setTick((v) => v + 1);
  };
  React.useEffect(() => {
    refresh();
    const onR = () => setAccounts(window.BGNJ_LECTURES.listBankAccounts());
    window.addEventListener("bgnj-bank-accounts-refresh", onR);
    return () => window.removeEventListener("bgnj-bank-accounts-refresh", onR);
  }, []);
  const startEdit = (a) => {
    setEditingId(a.id);
    setDraft({
      label: a.label || "",
      bankName: a.bankName || "",
      accountNumber: a.accountNumber || "",
      holder: a.holder || "",
      memo: a.memo || "",
      isDefault: !!a.isDefault
    });
  };
  const startNew = () => {
    setEditingId("new");
    setDraft({ label: "", bankName: "", accountNumber: "", holder: "", memo: "", isDefault: !accounts.length });
  };
  const cancel = () => {
    setEditingId(null);
    setMsg("");
  };
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2400);
  };
  const save = async (e) => {
    var _a;
    e.preventDefault();
    if (!draft.label.trim()) return flash("\u2717 \uACC4\uC88C \uC774\uB984\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
    if (!draft.accountNumber.trim()) return flash("\u2717 \uACC4\uC88C\uBC88\uD638\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
    try {
      if (editingId === "new") {
        await window.BGNJ_LECTURES.createBankAccount(draft);
      } else if (editingId) {
        await window.BGNJ_LECTURES.updateBankAccount(editingId, draft);
      }
      await refresh();
      setEditingId(null);
      flash("\u2713 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    } catch (err) {
      flash("\u2717 \uC800\uC7A5 \uC2E4\uD328: " + (((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || (err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const remove = async (a) => {
    if (!await window.BGNJ_CONFIRM(`"${a.label}" \uACC4\uC88C\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`, { danger: true })) return;
    try {
      await window.BGNJ_LECTURES.deleteBankAccount(a.id);
      await refresh();
      flash("\u2713 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    } catch (err) {
      flash("\u2717 \uC0AD\uC81C \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    }
  };
  const setDefault = async (a) => {
    try {
      await window.BGNJ_LECTURES.updateBankAccount(a.id, { isDefault: true });
      await refresh();
      flash("\u2713 \uAE30\uBCF8 \uACC4\uC88C\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    } catch (err) {
      flash("\u2717 \uBCC0\uACBD \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 14, lineHeight: 1.8 } }, "\uBB34\uD1B5\uC7A5 \uC785\uAE08 \uACC4\uC88C\uB97C \uC5EC\uB7EC \uAC1C \uB4F1\uB85D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uAE30\uBCF8 \uACC4\uC88C"), "\uB294 \uACB0\uC81C \uD654\uBA74\uC5D0\uC11C \uC790\uB3D9 \uC120\uD0DD\uB418\uBA70, \uC0AC\uC6A9\uC790\uAC00 \uB2E4\uB978 \uACC4\uC88C\uB97C \uC120\uD0DD\uD560 \uC218\uB3C4 \uC788\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: startNew }, "\uFF0B \uC0C8 \uACC4\uC88C \uCD94\uAC00")), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto", border: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 880 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left", width: 140 } }, "\uC774\uB984 (\uB77C\uBCA8)"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left", width: 120 } }, "\uC740\uD589"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left" } }, "\uACC4\uC88C\uBC88\uD638"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left", width: 120 } }, "\uC608\uAE08\uC8FC"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "center", width: 100 } }, "\uAE30\uBCF8"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "right", width: 200 } }, "\uC791\uC5C5"))), /* @__PURE__ */ React.createElement("tbody", null, accounts.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 6, className: "dim", style: { padding: 32, textAlign: "center" } }, '\uB4F1\uB85D\uB41C \uACC4\uC88C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. "\uFF0B \uC0C8 \uACC4\uC88C \uCD94\uAC00" \uB97C \uB20C\uB7EC \uC2DC\uC791\uD558\uC138\uC694.')) : accounts.map((a) => /* @__PURE__ */ React.createElement("tr", { key: a.id, style: { borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { className: "ko-serif", style: { padding: "12px 14px", fontWeight: 500 } }, a.label), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px 14px" } }, a.bankName || "-"), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: "12px 14px" } }, a.accountNumber || "-"), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px 14px" } }, a.holder || "-"), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px 14px", textAlign: "center" } }, a.isDefault ? /* @__PURE__ */ React.createElement("span", { className: "badge badge-gold", style: { fontSize: 10 } }, "\uAE30\uBCF8") : /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn-ghost",
      onClick: () => setDefault(a),
      style: { fontSize: 11, color: "var(--ink-3)" }
    },
    "\uAE30\uBCF8\uC73C\uB85C"
  )), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px 14px", textAlign: "right" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => startEdit(a), style: { marginRight: 6 } }, "\uC218\uC815"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => remove(a),
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC0AD\uC81C"
  ))))))), msg && /* @__PURE__ */ React.createElement("div", { role: "status", style: {
    marginTop: 14,
    padding: "10px 14px",
    border: msg.startsWith("\u2717") ? "1px solid var(--danger)" : "1px solid var(--primary-dim)",
    background: msg.startsWith("\u2717") ? "rgba(194,74,61,0.06)" : "rgba(245,213,72,0.06)",
    color: msg.startsWith("\u2717") ? "var(--danger)" : "var(--primary)",
    fontSize: 13
  } }, msg), editingId && /* @__PURE__ */ React.createElement("form", { onSubmit: save, className: "card", style: { padding: 24, marginTop: 18, maxWidth: 720 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, editingId === "new" ? "NEW ACCOUNT" : "EDIT ACCOUNT"), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 18, marginBottom: 14 } }, editingId === "new" ? "\uC0C8 \uACC4\uC88C \uCD94\uAC00" : "\uACC4\uC88C \uC218\uC815"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uACC4\uC88C \uC774\uB984 (\uB77C\uBCA8) ", /* @__PURE__ */ React.createElement("span", { className: "gold" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC608) \uAC15\uC5F0 \uC785\uAE08\uC6A9 / \uCC45 \uC8FC\uBB38\uC6A9 / \uBA54\uC778",
      value: draft.label,
      onChange: (e) => setDraft({ ...draft, label: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC740\uD589"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC608) \uAD6D\uBBFC\uC740\uD589",
      value: draft.bankName,
      onChange: (e) => setDraft({ ...draft, bankName: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC608\uAE08\uC8FC"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC608) \uBC45\uAE30\uB178\uC790",
      value: draft.holder,
      onChange: (e) => setDraft({ ...draft, holder: e.target.value })
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uACC4\uC88C\uBC88\uD638 ", /* @__PURE__ */ React.createElement("span", { className: "gold" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC608) 123-456-7890123",
      value: draft.accountNumber,
      onChange: (e) => setDraft({ ...draft, accountNumber: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC548\uB0B4 \uBA54\uBAA8 (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 2,
      placeholder: "\uC785\uAE08\uC790\uBA85\uC5D0 \uC2E0\uCCAD\uC790 \uBCF8\uBA85 + \uC2E0\uCCAD\uBC88\uD638\uB97C \uB0A8\uACA8 \uC8FC\uC138\uC694.",
      value: draft.memo,
      onChange: (e) => setDraft({ ...draft, memo: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      style: { accentColor: "var(--primary)" },
      checked: draft.isDefault,
      onChange: (e) => setDraft({ ...draft, isDefault: e.target.checked })
    }
  ), "\uAE30\uBCF8 \uACC4\uC88C\uB85C \uC0AC\uC6A9 (\uACB0\uC81C \uD654\uBA74\uC5D0\uC11C \uC790\uB3D9 \uC120\uD0DD)")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: cancel }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold" }, editingId === "new" ? "\uCD94\uAC00" : "\uC800\uC7A5"))));
};
window.BGNJ_BankAccountPicker = ({ value, onChange, accounts, refreshOnMount = true }) => {
  var _a, _b;
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    var _a2, _b2;
    if (refreshOnMount) {
      (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.refreshBankAccount) == null ? void 0 : _b2.call(_a2).then(() => setTick((v) => v + 1));
    }
    const onR = () => setTick((v) => v + 1);
    window.addEventListener("bgnj-bank-accounts-refresh", onR);
    return () => window.removeEventListener("bgnj-bank-accounts-refresh", onR);
  }, []);
  const multi = accounts && accounts.length ? accounts : ((_b = (_a = window.BGNJ_LECTURES) == null ? void 0 : _a.listBankAccounts) == null ? void 0 : _b.call(_a)) || [];
  const list = multi.length ? multi : (() => {
    var _a2, _b2;
    const single = ((_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.getBankAccount) == null ? void 0 : _b2.call(_a2)) || {};
    return single.accountNumber ? [{
      id: "default",
      label: "\uAE30\uBCF8 \uACC4\uC88C",
      isDefault: true,
      bankName: single.bankName,
      accountNumber: single.accountNumber,
      holder: single.holder,
      memo: single.memo
    }] : [];
  })();
  if (!list.length) {
    return /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", border: "1px solid var(--danger)", background: "rgba(194,74,61,0.05)", color: "var(--danger)", fontSize: 12, lineHeight: 1.6 } }, "\u26A0 \uB4F1\uB85D\uB41C \uC785\uAE08 \uACC4\uC88C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC6B4\uC601\uC790\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694.");
  }
  const selected = list.find((a) => a.id === value) || list.find((a) => a.isDefault) || list[0];
  React.useEffect(() => {
    if (selected && selected.id !== value && onChange) onChange(selected.id);
  }, [list.length]);
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 16px", border: "1px solid var(--primary-dim)", background: "rgba(245,213,72,0.04)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "BANK ACCOUNT \xB7 \uC785\uAE08 \uACC4\uC88C"), list.length > 1 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("label", { className: "dim-2 mono", style: { fontSize: 11, display: "block", marginBottom: 6 } }, "\uC785\uAE08\uD560 \uACC4\uC88C \uC120\uD0DD"), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "field-input",
      style: { fontSize: 13 },
      value: (selected == null ? void 0 : selected.id) || "",
      onChange: (e) => onChange == null ? void 0 : onChange(e.target.value)
    },
    list.map((a) => /* @__PURE__ */ React.createElement("option", { key: a.id, value: a.id }, a.label, a.isDefault ? " (\uAE30\uBCF8)" : ""))
  )), selected && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "90px 1fr", gap: "6px 14px", fontSize: 13, lineHeight: 1.6 } }, /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uC740\uD589"), /* @__PURE__ */ React.createElement("div", null, selected.bankName || "-"), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uACC4\uC88C\uBC88\uD638"), /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontWeight: 500 } }, selected.accountNumber || "-"), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uC608\uAE08\uC8FC"), /* @__PURE__ */ React.createElement("div", null, selected.holder || "-"), selected.memo && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uC548\uB0B4"), /* @__PURE__ */ React.createElement("div", null, selected.memo))));
};
const BookOrderAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [filter, setFilter] = React.useState("pending_payment");
  const [trackingDraft, setTrackingDraft] = React.useState({});
  const refresh = () => setTick((v) => v + 1);
  React.useEffect(() => {
    var _a, _b;
    let cancelled = false;
    (_b = (_a = window.BGNJ_BOOK_ORDERS) == null ? void 0 : _a.refreshAll) == null ? void 0 : _b.call(_a).finally(() => {
      if (!cancelled) refresh();
    });
    const onR = () => {
      if (!cancelled) refresh();
    };
    window.addEventListener("bgnj-orders-refresh", onR);
    return () => {
      cancelled = true;
      window.removeEventListener("bgnj-orders-refresh", onR);
    };
  }, []);
  const orders = React.useMemo(() => window.BGNJ_BOOK_ORDERS.listByStatus(filter), [filter, tick]);
  const [rejectNotes, setRejectNotes] = React.useState({});
  const counts = React.useMemo(() => ({
    all: window.BGNJ_BOOK_ORDERS.listAll().length,
    pending_payment: window.BGNJ_BOOK_ORDERS.listByStatus("pending_payment").length,
    paid: window.BGNJ_BOOK_ORDERS.listByStatus("paid").length,
    shipped: window.BGNJ_BOOK_ORDERS.listByStatus("shipped").length,
    delivered: window.BGNJ_BOOK_ORDERS.listByStatus("delivered").length,
    refund_requested: window.BGNJ_BOOK_ORDERS.listByStatus("refund_requested").length,
    cancelled: window.BGNJ_BOOK_ORDERS.listByStatus("cancelled").length
  }), [tick]);
  const handleExportCsv = () => {
    downloadCsv(`book-orders-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, window.BGNJ_BOOK_ORDERS.exportCsv());
  };
  const statusLabel = (s) => ({
    pending_payment: "\uC785\uAE08 \uB300\uAE30",
    paid: "\uC785\uAE08 \uD655\uC778",
    shipped: "\uBC30\uC1A1\uC911",
    delivered: "\uBC30\uC1A1 \uC644\uB8CC",
    refund_requested: "\uD658\uBD88 \uC2E0\uCCAD",
    cancelled: "\uCDE8\uC18C\uB428"
  })[s] || s;
  const statusTone = (s) => ({
    pending_payment: "var(--ink-2)",
    paid: "var(--primary)",
    shipped: "var(--primary)",
    delivered: "var(--primary-hover)",
    refund_requested: "var(--warning)",
    cancelled: "var(--danger)"
  })[s] || "var(--ink-2)";
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 18, lineHeight: 1.8 } }, "\uBC45\uAE30\uB178\uC790 \uB3C4\uC11C \uC8FC\uBB38\uC740 \uD68C\uC6D0 \uC804\uC6A9\xB7\uBB34\uD1B5\uC7A5 \uC785\uAE08 \uB2E8\uC77C \uD750\uB984\uC785\uB2C8\uB2E4. \uC8FC\uBB38 \u2192 \uC785\uAE08 \uD655\uC778 \u2192 \uBC1C\uC1A1 \u2192 \uBC30\uC1A1 \uC644\uB8CC \uC21C\uC73C\uB85C \uC0C1\uD0DC\uB97C \uC9C1\uC811 \uC9C4\uD589\uD558\uC138\uC694. \uACC4\uC88C\uBC88\uD638\uB294 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uC2DC\uC2A4\uD15C \u2192 \uC124\uC815"), " \uD0ED\uC5D0\uC11C \uB4F1\uB85D\xB7\uC218\uC815\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, [
    { key: "pending_payment", label: "\uC785\uAE08 \uB300\uAE30" },
    { key: "paid", label: "\uC785\uAE08 \uD655\uC778" },
    { key: "shipped", label: "\uBC30\uC1A1\uC911" },
    { key: "delivered", label: "\uBC30\uC1A1 \uC644\uB8CC" },
    { key: "refund_requested", label: "\uD658\uBD88 \uC2E0\uCCAD" },
    { key: "cancelled", label: "\uCDE8\uC18C" },
    { key: "all", label: "\uC804\uCCB4" }
  ].map((f) => {
    var _a;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: f.key,
        type: "button",
        className: "btn btn-small",
        onClick: () => setFilter(f.key),
        style: {
          borderColor: filter === f.key ? "var(--primary)" : "var(--line)",
          color: filter === f.key ? "var(--primary)" : "var(--ink-2)",
          background: filter === f.key ? "rgba(245,213,72,0.06)" : "transparent"
        }
      },
      f.label,
      " ",
      /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, marginLeft: 4 } }, (_a = counts[f.key]) != null ? _a : 0)
    );
  })), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: handleExportCsv }, "CSV \uB2E4\uC6B4\uB85C\uB4DC")), orders.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card dim", style: { padding: 32, textAlign: "center" } }, "\uD574\uB2F9 \uC0C1\uD0DC\uC758 \uC8FC\uBB38\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 12 } }, orders.map((o) => /* @__PURE__ */ React.createElement("article", { key: o.id, className: "card", style: { padding: 18 } }, /* @__PURE__ */ React.createElement("header", { style: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "mono gold", style: { fontSize: 12, letterSpacing: "0.16em" } }, o.orderNo), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, window.BGNJ_FMT.kstDateTime(o.createdAt))), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.22em", color: statusTone(o.status) } }, statusLabel(o.status).toUpperCase(), o.paid && o.status === "paid" && " \xB7 \uC785\uAE08 \u2713")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 4 } }, "BOOK"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13 } }, "\u300E", window.BGNJ_BOOK_ORDERS.getOrderBookTitle(o), "\u300F \xB7 ", o.version === "KR" ? "\uAD6D\uBB38\uD310" : "\uC601\uBB38\uD310", " \xD7 ", o.qty)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 4 } }, "AMOUNT"), /* @__PURE__ */ React.createElement("div", { className: "gold ko-serif", style: { fontSize: 18 } }, window.BGNJ_FMT.won(o.total)), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 10 } }, "\uC0C1\uD488 ", window.BGNJ_FMT.currency(o.subtotal), " + \uBC30\uC1A1 ", window.BGNJ_FMT.currency(o.shipping))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 4 } }, "RECIPIENT"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, lineHeight: 1.6 } }, o.recipient, " \xB7 ", o.phone)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 4 } }, "SHIP TO"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, lineHeight: 1.6 } }, o.address, " ", o.addressDetail), o.memo && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, marginTop: 2 } }, "\xB7 ", o.memo))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: 12 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => window.BGNJ_BOOK_ORDERS.downloadReceipt(o.id)
    },
    "\uC601\uC218\uC99D \u2193"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      title: "\uC774 \uC8FC\uBB38 \uAE30\uB85D\uC744 \uC601\uAD6C \uC0AD\uC81C\uD569\uB2C8\uB2E4 (\uAC10\uC0AC \uB85C\uADF8 \uB0A8\uC74C)",
      onClick: async () => {
        var _a, _b, _c, _d;
        const ok = await window.BGNJ_CONFIRM(
          `\uC8FC\uBB38 ${o.orderNo} \uAE30\uB85D\uC744 \uC601\uAD6C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?

\uC2E4\uC81C \uACB0\uC81C\xB7\uBC30\uC1A1\uC774 \uC9C4\uD589\uB41C \uAC70\uB798\uB77C\uBA74 \uC0AD\uC81C \uB300\uC2E0 '\uCDE8\uC18C' \uCC98\uB9AC\uB97C \uAD8C\uC7A5\uD569\uB2C8\uB2E4.
\uC0AD\uC81C\uB294 \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC73C\uBA70 \uAC10\uC0AC \uB85C\uADF8\uC5D0 \uD754\uC801\uC774 \uB0A8\uC2B5\uB2C8\uB2E4.`,
          { danger: true, confirmLabel: "\uC601\uAD6C \uC0AD\uC81C" }
        );
        if (!ok) return;
        const res = await window.BGNJ_BOOK_ORDERS.adminDeleteOrder(o.id);
        if (!(res == null ? void 0 : res.ok)) {
          try {
            (_b = (_a = window.BGNJ_TOAST) == null ? void 0 : _a.error) == null ? void 0 : _b.call(_a, (res == null ? void 0 : res.message) || "\uC8FC\uBB38 \uC0AD\uC81C \uC2E4\uD328");
          } catch (e) {
          }
          return;
        }
        try {
          (_d = (_c = window.BGNJ_TOAST) == null ? void 0 : _c.success) == null ? void 0 : _d.call(_c, `\uC8FC\uBB38 ${o.orderNo} \uC0AD\uC81C \uC644\uB8CC`);
        } catch (e) {
        }
        refresh();
      },
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC0AD\uC81C"
  ), o.status === "pending_payment" && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => {
        window.BGNJ_BOOK_ORDERS.confirmPayment(o.id);
        refresh();
      }
    },
    "\uC785\uAE08 \uD655\uC778 \u2192 \uBC1C\uC1A1 \uC900\uBE44"
  ), o.status === "paid" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC1A1\uC7A5 \uBC88\uD638 (\uC120\uD0DD)",
      style: { padding: "6px 10px", maxWidth: 200 },
      value: trackingDraft[o.id] || "",
      onChange: (e) => setTrackingDraft({ ...trackingDraft, [o.id]: e.target.value })
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => {
        window.BGNJ_BOOK_ORDERS.markShipped(o.id, trackingDraft[o.id] || "");
        refresh();
      }
    },
    "\uBC1C\uC1A1 \uCC98\uB9AC"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => {
        window.BGNJ_BOOK_ORDERS.unconfirmPayment(o.id);
        refresh();
      }
    },
    "\uC785\uAE08 \uD655\uC778 \uCDE8\uC18C"
  )), o.status === "shipped" && /* @__PURE__ */ React.createElement(React.Fragment, null, o.tracking && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, "\uC1A1\uC7A5 ", o.tracking), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => {
        window.BGNJ_BOOK_ORDERS.markDelivered(o.id);
        refresh();
      }
    },
    "\uBC30\uC1A1 \uC644\uB8CC \uCC98\uB9AC"
  )), o.status === "delivered" && o.tracking && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, "\uC1A1\uC7A5 ", o.tracking, " \xB7 \uB3C4\uCC29 ", o.deliveredAt ? window.BGNJ_FMT.kstDate(o.deliveredAt) : ""), (o.status === "pending_payment" || o.status === "paid") && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: async () => {
        if (!await window.BGNJ_CONFIRM(`\uC8FC\uBB38 ${o.orderNo}\uC744(\uB97C) \uCDE8\uC18C \uCC98\uB9AC\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
        window.BGNJ_BOOK_ORDERS.cancelOrder(o.id);
        refresh();
      },
      style: { borderColor: "var(--danger)", color: "var(--danger)", marginLeft: "auto" }
    },
    "\uC8FC\uBB38 \uCDE8\uC18C"
  ), o.status === "refund_requested" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", paddingTop: 8, borderTop: "1px solid var(--line)", marginTop: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, color: "var(--warning)", letterSpacing: "0.2em" } }, "REFUND REQUEST"), /* @__PURE__ */ React.createElement("span", { className: "dim", style: { fontSize: 12 } }, "\uC0AC\uC720: ", o.refundReason || "(\uBBF8\uC785\uB825)")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: async () => {
        if (!await window.BGNJ_CONFIRM(`\uD658\uBD88\uC744 \uC2B9\uC778\uD558\uC2DC\uACA0\uC5B4\uC694? \uC8FC\uBB38 ${o.orderNo}\uC774 \uCDE8\uC18C\uB429\uB2C8\uB2E4.`, { danger: true })) return;
        window.BGNJ_BOOK_ORDERS.approveRefund(o.id);
        refresh();
      },
      style: { borderColor: "var(--primary)", color: "var(--secondary)" }
    },
    "\uD658\uBD88 \uC2B9\uC778"
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uBC18\uB824 \uC0AC\uC720 (\uC120\uD0DD)",
      style: { padding: "5px 8px", fontSize: 12, maxWidth: 200 },
      value: rejectNotes[o.id] || "",
      onChange: (e) => setRejectNotes({ ...rejectNotes, [o.id]: e.target.value })
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: async () => {
        if (!await window.BGNJ_CONFIRM(`\uD658\uBD88 \uC2E0\uCCAD\uC744 \uBC18\uB824\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
        window.BGNJ_BOOK_ORDERS.rejectRefund(o.id, rejectNotes[o.id] || "");
        refresh();
      },
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uD658\uBD88 \uBC18\uB824"
  )))))))));
};
const LegalAdminPanel = () => {
  const [slug, setSlug] = React.useState("terms");
  const [tick, setTick] = React.useState(0);
  const [doc, setDoc] = React.useState({ title: "", body: "", updatedAt: null });
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [editorKey, setEditorKey] = React.useState(0);
  const [msg, setMsg] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const fresh = await window.BGNJ_LEGAL.refresh(slug);
      if (cancelled) return;
      const d = fresh || { title: "", body: "" };
      setDoc(d);
      setTitle(d.title || (slug === "terms" ? "\uC774\uC6A9\uC57D\uAD00" : slug === "privacy" ? "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68" : ""));
      setBody(d.body || "");
      setEditorKey((k) => k + 1);
      setMsg("");
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, tick]);
  const save = async (e) => {
    var _a;
    e.preventDefault();
    if (!title.trim()) {
      setMsg("\u26A0 \uC81C\uBAA9\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    setSaving(true);
    try {
      await window.BGNJ_LEGAL.save(slug, { title: title.trim(), body });
      setMsg("\u2713 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC0AC\uC774\uD2B8 \uD478\uD130\uC758 " + (slug === "terms" ? "\uC774\uC6A9\uC57D\uAD00" : "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68") + " \uB9C1\uD06C\uC5D0 \uC989\uC2DC \uBC18\uC601\uB429\uB2C8\uB2E4.");
      setTick((v) => v + 1);
      setTimeout(() => setMsg(""), 2400);
    } catch (err) {
      setMsg("\u2717 \uC800\uC7A5 \uC2E4\uD328: " + (((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || (err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    } finally {
      setSaving(false);
    }
  };
  const SLUG_LABEL = { terms: "\uC774\uC6A9\uC57D\uAD00", privacy: "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68" };
  const SLUG_HINT = {
    terms: '\uD68C\uC6D0\uAC00\uC785 \uC2DC \uB3D9\uC758 \uCCB4\uD06C\uBC15\uC2A4 \uC606 "\uC774\uC6A9\uC57D\uAD00" \uD074\uB9AD \uC2DC + \uD478\uD130 \uBA54\uB274\uC5D0\uC11C \uB178\uCD9C\uB429\uB2C8\uB2E4.',
    privacy: '\uD68C\uC6D0\uAC00\uC785 \uC2DC "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68" \uD074\uB9AD \uC2DC + \uD478\uD130 \uBA54\uB274\uC5D0\uC11C \uB178\uCD9C\uB429\uB2C8\uB2E4.'
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 18, lineHeight: 1.8 } }, /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uC774\uC6A9\uC57D\uAD00"), "\xB7", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68"), " \uBCF8\uBB38\uC744 \uC9C1\uC811 \uD3B8\uC9D1\uD569\uB2C8\uB2E4. \uC800\uC7A5 \uC989\uC2DC \uD68C\uC6D0\uAC00\uC785 \uBAA8\uB2EC\uACFC \uD478\uD130 \uD398\uC774\uC9C0\uC5D0 \uBC18\uC601\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { role: "tablist", "aria-label": "\uBB38\uC11C \uBD84\uB958", style: { display: "flex", gap: 0, marginBottom: 18, borderBottom: "1px solid var(--line)" } }, window.BGNJ_LEGAL.listSlugs().map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s,
      type: "button",
      role: "tab",
      "aria-selected": slug === s,
      onClick: () => setSlug(s),
      style: {
        padding: "12px 22px",
        fontSize: 14,
        letterSpacing: "0.05em",
        color: slug === s ? "var(--primary)" : "var(--ink-2)",
        borderBottom: slug === s ? "2px solid var(--primary)" : "2px solid transparent",
        marginBottom: -1,
        background: "none"
      }
    },
    SLUG_LABEL[s] || s
  ))), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 14, lineHeight: 1.7, padding: "10px 12px", background: "var(--bg-2)", borderLeft: "3px solid var(--primary-dim)" } }, "\u24D8 ", SLUG_HINT[slug] || ""), /* @__PURE__ */ React.createElement("form", { onSubmit: save, className: "card", style: { padding: 20 } }, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "legal-title" }, "\uBB38\uC11C \uC81C\uBAA9"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "legal-title",
      className: "field-input",
      value: title,
      onChange: (e) => setTitle(e.target.value),
      placeholder: SLUG_LABEL[slug] || ""
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBCF8\uBB38"), /* @__PURE__ */ React.createElement(
    TiptapEditor,
    {
      key: editorKey,
      preset: "column",
      content: doc.body || "",
      onUpdate: (html) => setBody(html),
      placeholder: "\uBB38\uC11C \uBCF8\uBB38\uC744 \uC785\uB825\uD569\uB2C8\uB2E4. \uC774\uBBF8\uC9C0\xB7\uB9C1\uD06C\xB7\uC778\uC6A9\xB7\uBAA9\uB85D\uC744 \uC9C0\uC6D0\uD569\uB2C8\uB2E4."
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12, flexWrap: "wrap" } }, doc.updatedAt ? /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uCD5C\uADFC \uC218\uC815 \xB7 ", window.BGNJ_FMT.kstDateTime(doc.updatedAt)) : /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uC800\uC7A5 \uC774\uB825 \uC5C6\uC74C \u2014 \uCC98\uC74C \uC800\uC7A5\uD558\uC2DC\uBA74 \uD68C\uC6D0\uAC00\uC785 \uBAA8\uB2EC\uACFC \uD478\uD130\uC5D0 \uB178\uCD9C\uB429\uB2C8\uB2E4.")), msg && /* @__PURE__ */ React.createElement("div", { role: "status", style: {
    fontSize: 13,
    marginBottom: 14,
    padding: "10px 14px",
    border: msg.startsWith("\u2717") || msg.startsWith("\u26A0") ? "1px solid var(--danger)" : "1px solid var(--primary-dim)",
    background: msg.startsWith("\u2717") || msg.startsWith("\u26A0") ? "rgba(194,74,61,0.06)" : "rgba(245,213,72,0.06)",
    color: msg.startsWith("\u2717") || msg.startsWith("\u26A0") ? "var(--danger)" : "var(--primary)"
  } }, msg), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid var(--line)", paddingTop: 14 } }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold", disabled: saving, "aria-busy": saving }, saving ? "\uC800\uC7A5 \uC911..." : "\uC800\uC7A5"))));
};
const FaqAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [draft, setDraft] = React.useState({ question: "", answer: "", category: "\uC77C\uBC18" });
  const [error, setError] = React.useState("");
  const refresh = () => setTick((v) => v + 1);
  const faqs = React.useMemo(() => window.BGNJ_FAQ.listAll(), [tick]);
  const add = (e) => {
    e.preventDefault();
    setError("");
    const next = window.BGNJ_FAQ.add(draft);
    if (!next) {
      setError("\uC9C8\uBB38\uACFC \uB2F5\uBCC0\uC740 \uD544\uC218\uC785\uB2C8\uB2E4.");
      return;
    }
    setDraft({ question: "", answer: "", category: draft.category || "\uC77C\uBC18" });
    refresh();
  };
  const update = (id, patch) => {
    window.BGNJ_FAQ.update(id, patch);
    refresh();
  };
  const move = (id, dir) => {
    window.BGNJ_FAQ.reorder(id, dir);
    refresh();
  };
  const remove = async (id) => {
    if (!await window.BGNJ_CONFIRM("\uC774 FAQ\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) return;
    window.BGNJ_FAQ.remove(id);
    refresh();
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 18, lineHeight: 1.8 } }, "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38(FAQ)\uC744 \uCD94\uAC00\xB7\uC218\uC815\xB7\uC815\uB82C\uD569\uB2C8\uB2E4. \uD478\uD130\uC758 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38"), "\uC5D0 \uCE74\uD14C\uACE0\uB9AC\uBCC4\uB85C \uBB36\uC5EC \uB178\uCD9C\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("article", { className: "card", style: { padding: 18, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "NEW FAQ"), /* @__PURE__ */ React.createElement("form", { onSubmit: add, style: { display: "grid", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 200px", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC9C8\uBB38 ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      value: draft.question,
      onChange: (e) => setDraft({ ...draft, question: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uCE74\uD14C\uACE0\uB9AC"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      value: draft.category,
      onChange: (e) => setDraft({ ...draft, category: e.target.value }),
      placeholder: "\uACC4\uC815 / \uACB0\uC81C / \uAC15\uC5F0 / \uB2F5\uC0AC ..."
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uB2F5\uBCC0 ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 3,
      value: draft.answer,
      onChange: (e) => setDraft({ ...draft, answer: e.target.value })
    }
  )), error && /* @__PURE__ */ React.createElement("div", { role: "alert", className: "mono", style: { color: "var(--danger)", fontSize: 11 } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small" }, "\uFF0B FAQ \uCD94\uAC00")))), faqs.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card dim", style: { padding: 32, textAlign: "center" } }, "\uB4F1\uB85D\uB41C FAQ\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 10 } }, faqs.map((f, i) => /* @__PURE__ */ React.createElement("article", { key: f.id, className: "card", style: { padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", flexWrap: "wrap", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em" } }, "#", String(i + 1).padStart(2, "0"), " \xB7 ", f.category || "\uC77C\uBC18"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, alignItems: "center" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => move(f.id, -1),
      disabled: i === 0,
      style: { padding: "2px 6px", minHeight: 0, fontSize: 11 },
      "aria-label": "\uC704\uB85C"
    },
    "\u25B2"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => move(f.id, 1),
      disabled: i === faqs.length - 1,
      style: { padding: "2px 6px", minHeight: 0, fontSize: 11 },
      "aria-label": "\uC544\uB798\uB85C"
    },
    "\u25BC"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => remove(f.id),
      style: { borderColor: "var(--danger)", color: "var(--danger)", marginLeft: 6 }
    },
    "\uC0AD\uC81C"
  ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      value: f.question,
      onChange: (e) => update(f.id, { question: e.target.value }),
      placeholder: "\uC9C8\uBB38"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 2,
      value: f.answer,
      onChange: (e) => update(f.id, { answer: e.target.value }),
      placeholder: "\uB2F5\uBCC0"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: "8px 0 0", maxWidth: 240 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      value: f.category || "",
      onChange: (e) => update(f.id, { category: e.target.value }),
      placeholder: "\uCE74\uD14C\uACE0\uB9AC"
    }
  ))))));
};
const SiteContentAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [msg, setMsg] = React.useState("");
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2e3);
  };
  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const SectionForm = ({ section, fields, onAfterSave }) => {
    const [draft, setDraft] = React.useState(() => ({ ...sc[section] || {} }));
    const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
    const save = (e) => {
      e.preventDefault();
      window.BGNJ_SITE_CONTENT.saveSection(section, draft);
      setTick((v) => v + 1);
      flash("\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
      if (onAfterSave) onAfterSave();
    };
    const reset = async () => {
      if (!await window.BGNJ_CONFIRM("\uC774 \uC139\uC158\uC744 \uAE30\uBCF8\uAC12\uC73C\uB85C \uB418\uB3CC\uB9B4\uAE4C\uC694?", { danger: true })) return;
      window.BGNJ_SITE_CONTENT.resetSection(section);
      setTick((v) => v + 1);
      flash("\uAE30\uBCF8\uAC12\uC73C\uB85C \uBCF5\uC6D0\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    };
    return /* @__PURE__ */ React.createElement("form", { onSubmit: save, className: "card", style: { padding: 20, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 } }, fields.map((f) => {
      var _a, _b;
      return /* @__PURE__ */ React.createElement("div", { key: f.key, className: "field", style: { gridColumn: f.full ? "1 / -1" : "auto" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: `sc-${section}-${f.key}` }, f.label), f.multiline ? /* @__PURE__ */ React.createElement(
        "textarea",
        {
          id: `sc-${section}-${f.key}`,
          className: "field-input",
          rows: 3,
          value: (_a = draft[f.key]) != null ? _a : "",
          onChange: (e) => set(f.key, e.target.value)
        }
      ) : /* @__PURE__ */ React.createElement(
        "input",
        {
          id: `sc-${section}-${f.key}`,
          className: "field-input",
          value: (_b = draft[f.key]) != null ? _b : "",
          onChange: (e) => set(f.key, e.target.value)
        }
      ));
    })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 14 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: reset }, "\uAE30\uBCF8\uAC12 \uBCF5\uC6D0"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold" }, "\uC800\uC7A5")));
  };
  const ImageUploader = ({ section, field, label, hint, previewSize = 56, accept = "image/*", folder }) => {
    var _a;
    const current = ((_a = sc[section]) == null ? void 0 : _a[field]) || "";
    const onPick = async (e) => {
      const r2Folder = folder || section;
      const result = await pickImageWithR2Fallback(e, { folder: r2Folder });
      if (result) {
        window.BGNJ_SITE_CONTENT.saveSection(section, { [field]: result });
        setTick((v) => v + 1);
        flash(`${label} \uC5C5\uB85C\uB4DC \uC644\uB8CC`);
      }
    };
    const clear = async () => {
      if (!await window.BGNJ_CONFIRM(`${label}\uC744(\uB97C) \uBE44\uC6B8\uAE4C\uC694? (\uAE30\uBCF8 \uB9C8\uD06C\uB85C \uB418\uB3CC\uC544\uAC11\uB2C8\uB2E4)`, { danger: true })) return;
      window.BGNJ_SITE_CONTENT.saveSection(section, { [field]: "" });
      setTick((v) => v + 1);
      flash(`${label} \uC81C\uAC70\uB428`);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, display: "flex", gap: 14, alignItems: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: previewSize,
      height: previewSize,
      flexShrink: 0,
      border: "1px solid var(--line)",
      background: "var(--bg-2)",
      display: "grid",
      placeItems: "center",
      overflow: "hidden"
    } }, current ? /* @__PURE__ */ React.createElement("img", { src: current, alt: "", style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" } }) : /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 9, letterSpacing: "0.18em" } }, "NONE")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 14, marginBottom: 4 } }, label), hint && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.5 } }, hint)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("label", { className: "btn btn-small", style: { cursor: "pointer" } }, "\uC5C5\uB85C\uB4DC", /* @__PURE__ */ React.createElement("input", { type: "file", accept, onChange: onPick, style: { display: "none" } })), current && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: clear,
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uC81C\uAC70"
    )));
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 18, lineHeight: 1.8 } }, "\uD648\uD398\uC774\uC9C0 \uB0B4\uBE44\uAC8C\uC774\uC158 \uB77C\uBCA8, \uD788\uC5B4\uB85C/\uD478\uD130 \uD14D\uC2A4\uD2B8, \uBE0C\uB79C\uB4DC\uBA85, \uB85C\uACE0\xB7\uD30C\uBE44\uCF58, OG \uBA54\uD0C0\uB97C \uC9C1\uC811 \uD3B8\uC9D1\uD569\uB2C8\uB2E4. \uC139\uC158\uBCC4\uB85C \uC800\uC7A5\uB418\uBA70 \uC800\uC7A5 \uC989\uC2DC \uC0AC\uC774\uD2B8\uC5D0 \uBC18\uC601\uB429\uB2C8\uB2E4."), msg && /* @__PURE__ */ React.createElement("div", { role: "status", className: "mono gold", style: { fontSize: 12, marginBottom: 14, padding: "8px 12px", border: "1px solid var(--primary-dim)", background: "rgba(59,130,246,0.06)" } }, msg), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10 } }, "\uBA54\uB274 \uB77C\uBCA8"), /* @__PURE__ */ React.createElement(SectionForm, { key: `nav-${tick}`, section: "nav", fields: [
    { key: "home", label: "\uD648" },
    { key: "community", label: "\uCEE4\uBBA4\uB2C8\uD2F0" },
    { key: "lectures", label: "\uAC15\uC5F0" },
    { key: "tour", label: "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8" },
    { key: "column", label: "\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC" },
    { key: "book", label: "\uBC45\uAE30\uB178\uC790 \uB3C4\uC11C" }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10 } }, "\uBE0C\uB79C\uB4DC"), /* @__PURE__ */ React.createElement(SectionForm, { key: `brand-${tick}`, section: "brand", fields: [
    { key: "name", label: "\uBE0C\uB79C\uB4DC \uC774\uB984 (\uD55C\uAE00)" },
    { key: "sub", label: "\uBE0C\uB79C\uB4DC \uC601\uBB38" }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10 } }, "\uD788\uC5B4\uB85C(\uBA54\uC778 \uC0C1\uB2E8)"), /* @__PURE__ */ React.createElement(SectionForm, { key: `hero-${tick}`, section: "hero", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0 (\uC0C1\uB2E8 \uC791\uC740 \uD14D\uC2A4\uD2B8)", full: true },
    { key: "title1", label: "\uD070 \uC81C\uBAA9 1\uC904" },
    { key: "title2", label: "\uD070 \uC81C\uBAA9 2\uC904 (\uAC15\uC870 \uC0C9)" },
    { key: "title3", label: "\uD070 \uC81C\uBAA9 3\uC904" },
    { key: "subtitle", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true },
    { key: "ctaPrimary", label: "CTA \uBC84\uD2BC (\uC8FC\uC694)" },
    { key: "ctaSecondary", label: "CTA \uBC84\uD2BC (\uBCF4\uC870)" },
    { key: "mapHint", label: "\uC9C0\uB3C4 \uC548\uB0B4 \uBB38\uAD6C", full: true }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10 } }, "\uD478\uD130 \u2014 \uC18C\uAC1C\xB7\uC11C\uBA85\xB7\uD5E4\uB529\xB7\uCE74\uD53C\uB77C\uC774\uD2B8"), /* @__PURE__ */ React.createElement(SectionForm, { key: `footer-${tick}`, section: "footer", fields: [
    { key: "description", label: "\uC18C\uAC1C \uBB38\uB2E8", full: true, multiline: true },
    { key: "signature", label: "\uD558\uB2E8 \uC11C\uBA85 (\uC608: \uBC45\uAE30\uD0C0\uACE0 \uB178\uC790 \xB7 DESIGNED IN SEOUL)", full: true },
    { key: "copyright", label: "\uCE74\uD53C\uB77C\uC774\uD2B8 (\xA9 \uB77C\uC778)", full: true },
    { key: "headingContent", label: "\uCF58\uD150\uCE20 \uC139\uC158 \uD5E4\uB529 (\uAE30\uBCF8: \uCF58\uD150\uCE20)" },
    { key: "headingInfo", label: "\uC815\uBCF4 \uC139\uC158 \uD5E4\uB529 (\uAE30\uBCF8: \uC815\uBCF4)" },
    { key: "headingContact", label: "\uC5F0\uB77D \uC139\uC158 \uD5E4\uB529 (\uAE30\uBCF8: \uC5F0\uB77D)" }
  ] }), /* @__PURE__ */ React.createElement(FooterStyleEditor, null), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uD478\uD130 \u2014 \uC5F0\uB77D + \uC0AC\uC5C5\uC790 \uC815\uBCF4"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 12, lineHeight: 1.7 } }, "\uD478\uD130\uC758 '\uC5F0\uB77D' \uC139\uC158 + \uC0AC\uC5C5\uC790 \uC815\uBCF4 \uBE14\uB85D\uC5D0 \uB178\uCD9C\uB429\uB2C8\uB2E4. \uBE44\uC6B0\uBA74 \uD574\uB2F9 \uC904\uC774 \uD45C\uC2DC\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. v00.144 \uBD80\uD130 \uC804\uD654\uBC88\uD638\uB294 \uD478\uD130\uC5D0\uC11C \uC81C\uAC70\uB418\uACE0 \uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638 \uB4F1\uC774 \uB178\uCD9C\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(SectionForm, { key: `contact-${tick}`, section: "contact", fields: [
    { key: "email", label: "\uC774\uBA54\uC77C" },
    { key: "address", label: "\uC8FC\uC18C", full: true },
    { key: "companyName", label: "\uD68C\uC0AC\uBA85 (\uBC95\uC778\uBA85)" },
    { key: "ceo", label: "\uB300\uD45C\uC790" },
    { key: "bizRegNo", label: "\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638 (\uC608: 551-86-02188)" },
    { key: "corpRegNo", label: "\uBC95\uC778\uB4F1\uB85D\uBC88\uD638 (\uC608: 110111-7817690)" },
    { key: "founded", label: "\uAC1C\uC5C5 / \uC124\uB9BD\uC77C (\uC608: 2021-04-01)" }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10 } }, "\uB85C\uACE0 \xB7 \uD30C\uBE44\uCF58"), /* @__PURE__ */ React.createElement(
    ImageUploader,
    {
      section: "branding",
      field: "logoDataUri",
      label: "\uD5E4\uB354 \uB85C\uACE0",
      hint: "22x22px \uD45C\uC2DC. PNG/SVG \uAD8C\uC7A5 \xB7 1.5MB \uC774\uD558."
    }
  ), /* @__PURE__ */ React.createElement(
    ImageUploader,
    {
      section: "branding",
      field: "faviconDataUri",
      label: "\uD30C\uBE44\uCF58",
      hint: "32x32 \uB610\uB294 64x64 PNG \uAD8C\uC7A5 \xB7 \uC800\uC7A5 \uC989\uC2DC \uBE0C\uB77C\uC6B0\uC800 \uD0ED \uC544\uC774\uCF58\uC774 \uAC31\uC2E0\uB429\uB2C8\uB2E4.",
      previewSize: 40,
      accept: "image/png,image/x-icon,image/svg+xml"
    }
  ), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uB85C\uADF8\uC778 / \uD68C\uC6D0\uAC00\uC785 \uC88C\uCE21 \uC601\uC5ED"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 12, lineHeight: 1.7 } }, "\uB85C\uADF8\uC778\xB7\uD68C\uC6D0\uAC00\uC785 \uD398\uC774\uC9C0 \uC67C\uCABD\uC5D0 \uB178\uCD9C\uB418\uB294 \uC774\uBBF8\uC9C0\uC640 \uBB38\uAD6C\uC785\uB2C8\uB2E4. \uC774\uBBF8\uC9C0\uB97C \uC5C5\uB85C\uB4DC\uD558\uBA74 \uADF8\uB77C\uB370\uC774\uC158 \uBC30\uACBD \uB300\uC2E0 \uC774\uBBF8\uC9C0\uAC00 \uC0AC\uC6A9\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(SectionForm, { key: `auth-${tick}`, section: "auth", fields: [
    { key: "eyebrow", label: "\uC717\uCABD \uC791\uC740 \uB77C\uBCA8 (\uB300\uBB38\uC790 \uAD8C\uC7A5)" },
    { key: "title", label: "\uBA54\uC778 \uC81C\uBAA9 (\uC904\uBC14\uAFC8 \uAC00\uB2A5)", full: true, multiline: true },
    { key: "description", label: "\uC18C\uAC1C \uBB38\uB2E8", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement(
    ImageUploader,
    {
      section: "auth",
      field: "imageDataUri",
      label: "\uC88C\uCE21 \uBC30\uACBD \uC774\uBBF8\uC9C0",
      hint: "1200x1600 \uB610\uB294 1080x1920 \uAD8C\uC7A5 \xB7 JPG/PNG \xB7 \uBE44\uC6B0\uBA74 \uAE30\uBCF8 \uADF8\uB77C\uB370\uC774\uC158 \uBC30\uACBD \uC0AC\uC6A9. 1.5MB \uC774\uD558.",
      previewSize: 120
    }
  ), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uD22C\uC5B4 \uD398\uC774\uC9C0 \u2014 \uC0C1\uB2E8 \uC778\uD2B8\uB85C"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 12, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("code", null, "/tour"), " \uD398\uC774\uC9C0\uC758 \uB2F5\uC0AC \uB9AC\uC2A4\uD2B8 \uC704\uCABD hero \uC139\uC158. \uBE44\uC6B0\uBA74 \uCF54\uB4DC default \uC0AC\uC6A9."), /* @__PURE__ */ React.createElement(SectionForm, { key: `tourIntro-${tick}`, section: "tourIntro", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0 (\uC608: TOUR \xB7 \uB2F5\uC0AC)", full: true },
    { key: "titlePrefix", label: "\uD070 \uC81C\uBAA9 \uC55E\uBD80\uBD84 (\uC608: \uBC1C\uB85C \uC77D\uB294 )" },
    { key: "titleAccent", label: "\uD070 \uC81C\uBAA9 \uAC15\uC870\uC5B4 (\uC608: \uC870\uC120)" },
    { key: "subtitle", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uD22C\uC5B4 \uD398\uC774\uC9C0 \u2014 \uD6C4\uAE30 \uC548\uB0B4 \uBB38\uAD6C"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 12, lineHeight: 1.7 } }, "\uB2F5\uC0AC \uC0C1\uC138 \uD398\uC774\uC9C0\uC758 \uD6C4\uAE30 \uC139\uC158 \uC548\uB0B4 \uCE74\uB4DC \uBB38\uAD6C. \uBE44\uC6B0\uBA74 \uCF54\uB4DC default."), /* @__PURE__ */ React.createElement(SectionForm, { key: `tourReviewsGate-${tick}`, section: "tourReviewsGate", fields: [
    { key: "gate", label: "\uBBF8\uCC38\uAC00 \uD68C\uC6D0 \uC548\uB0B4 (\uCC38\uAC00 \uD655\uC815 \uD68C\uC6D0\uB9CC \uC791\uC131 \uAC00\uB2A5 \uC548\uB0B4)", full: true, multiline: true },
    { key: "anonymous", label: "\uBE44\uB85C\uADF8\uC778 \uC548\uB0B4 (\uB85C\uADF8\uC778 \uD6C4 \uC791\uC131 \uAC00\uB2A5 \uC548\uB0B4)", full: true, multiline: true },
    { key: "empty", label: "\uD6C4\uAE30\uAC00 0\uAC74\uC77C \uB54C \uC548\uB0B4", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uAC15\uC5F0 \uD398\uC774\uC9C0 \u2014 \uC0C1\uB2E8 \uC778\uD2B8\uB85C"), /* @__PURE__ */ React.createElement(SectionForm, { key: `lectureIntro-${tick}`, section: "lectureIntro", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0 (\uC608: LECTURE \xB7 \uC655\uC0AC\uB0A8 \uAC15\uC5F0)", full: true },
    { key: "titlePrefix", label: "\uD070 \uC81C\uBAA9 \uC55E\uBD80\uBD84 (\uC608: \uC655\uC0AC\uB0A8 )" },
    { key: "titleAccent", label: "\uD070 \uC81C\uBAA9 \uAC15\uC870\uC5B4 (\uC608: \uAC15\uC5F0 \uC77C\uC815)" },
    { key: "subtitle", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uAC15\uC5F0 \uD398\uC774\uC9C0 \u2014 \uD6C4\uAE30 \uC548\uB0B4 \uBB38\uAD6C"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 12, lineHeight: 1.7 } }, "\uAC15\uC5F0 \uC0C1\uC138 \uD398\uC774\uC9C0\uC758 \uD6C4\uAE30 \uC139\uC158 \uC548\uB0B4 \uCE74\uB4DC \uBB38\uAD6C. \uBE44\uC6B0\uBA74 \uCF54\uB4DC default."), /* @__PURE__ */ React.createElement(SectionForm, { key: `lectureReviewsGate-${tick}`, section: "lectureReviewsGate", fields: [
    { key: "gate", label: "\uBBF8\uCC38\uAC00 \uD68C\uC6D0 \uC548\uB0B4", full: true, multiline: true },
    { key: "anonymous", label: "\uBE44\uB85C\uADF8\uC778 \uC548\uB0B4", full: true, multiline: true },
    { key: "empty", label: "\uD6C4\uAE30\uAC00 0\uAC74\uC77C \uB54C \uC548\uB0B4", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 6, marginTop: 14, lineHeight: 1.7 } }, "\u203B \uAC15\uC5F0\uBCC4 \uC9C4\uD589 \uC77C\uC815 / \uCC38\uACE0 / \uCEE4\uBC84 + \uAE00\uB85C\uBC8C default + \uD15C\uD50C\uB9BF\uC740 ", /* @__PURE__ */ React.createElement("strong", null, "\uC6B4\uC601\uC124\uC815 \u2192 \uAC15\uC5F0 \uD398\uC774\uC9C0 (v00.083)"), " \uC5D0\uC11C GUI \uD3B8\uC9D1."), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uD648 \uD398\uC774\uC9C0 \u2014 \uCD94\uCC9C \uC5EC\uD589\uC9C0 \uC139\uC158 \uD5E4\uB529"), /* @__PURE__ */ React.createElement(SectionForm, { key: `recommendationsHeading-${tick}`, section: "recommendationsHeading", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0 (\uC608: RECOMMENDATIONS \xB7 \uBC45\uAE30\uB178\uC790 \uCD94\uCC9C)", full: true },
    { key: "titlePrefix", label: "\uD070 \uC81C\uBAA9 \uC55E\uBD80\uBD84 (\uC608: \uBC45\uAE30\uB178\uC790\uAC00 )" },
    { key: "titleAccent", label: "\uD070 \uC81C\uBAA9 \uAC15\uC870\uC5B4 (\uC608: \uCD94\uCC9C)" },
    { key: "titleSuffix", label: "\uD070 \uC81C\uBAA9 \uB4B7\uBD80\uBD84 (\uC608: \uD569\uB2C8\uB2E4)" },
    { key: "subtitle", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uCEE4\uBBA4\uB2C8\uD2F0 \uD398\uC774\uC9C0 \u2014 \uC0C1\uB2E8 \uC778\uD2B8\uB85C"), /* @__PURE__ */ React.createElement(SectionForm, { key: `communityIntro-${tick}`, section: "communityIntro", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0 (\uC608: COMMUNITY \xB7 \uCEE4\uBBA4\uB2C8\uD2F0)", full: true },
    { key: "titlePrefix", label: "\uD070 \uC81C\uBAA9 \uC55E\uBD80\uBD84 (\uC608: \uB2E4\uC12F \uBD09\uC6B0\uB9AC )" },
    { key: "titleAccent", label: "\uD070 \uC81C\uBAA9 \uAC15\uC870\uC5B4 (\uC608: \uAD11\uC7A5)" },
    { key: "subtitle", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uCE7C\uB7FC \uD398\uC774\uC9C0 \u2014 \uC0C1\uB2E8 \uC778\uD2B8\uB85C"), /* @__PURE__ */ React.createElement(SectionForm, { key: `columnIntro-${tick}`, section: "columnIntro", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0", full: true },
    { key: "titlePrefix", label: "\uD070 \uC81C\uBAA9 \uC55E\uBD80\uBD84" },
    { key: "titleAccent", label: "\uD070 \uC81C\uBAA9 \uAC15\uC870\uC5B4 (\uC608: \uBC45\uAE30\uB178\uC790)" },
    { key: "titleSuffix", label: "\uD070 \uC81C\uBAA9 \uB4B7\uBD80\uBD84 (\uC608: \uAC00 \uC4F0\uB2E4)" },
    { key: "subtitle", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "FAQ \uD398\uC774\uC9C0 \u2014 \uC0C1\uB2E8 \uC778\uD2B8\uB85C"), /* @__PURE__ */ React.createElement(SectionForm, { key: `faqIntro-${tick}`, section: "faqIntro", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0", full: true },
    { key: "titlePrefix", label: "\uD070 \uC81C\uBAA9 \uC55E\uBD80\uBD84" },
    { key: "titleAccent", label: "\uD070 \uC81C\uBAA9 \uAC15\uC870\uC5B4 (\uC608: \uC790\uC8FC \uBB3B\uB294)" },
    { key: "titleSuffix", label: "\uD070 \uC81C\uBAA9 \uB4B7\uBD80\uBD84 (\uC608:  \uC9C8\uBB38)" },
    { key: "subtitle", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uC8FC\uBB38/\uACB0\uC81C \uD398\uC774\uC9C0 \u2014 \uC0C1\uB2E8 \uC778\uD2B8\uB85C"), /* @__PURE__ */ React.createElement(SectionForm, { key: `bookCheckoutIntro-${tick}`, section: "bookCheckoutIntro", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0 (\uC608: CHECKOUT \xB7 \uACB0\uC81C)", full: true },
    { key: "titlePrefix", label: "\uD070 \uC81C\uBAA9 \uC55E\uBD80\uBD84 (\uC608: \uC8FC\uBB38 / )" },
    { key: "titleAccent", label: "\uD070 \uC81C\uBAA9 \uAC15\uC870\uC5B4 (\uC608: \uACB0\uC81C)" }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uB9C8\uC774\uD398\uC774\uC9C0 \u2014 \uC0C1\uB2E8 \uC778\uD2B8\uB85C"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginBottom: 8, lineHeight: 1.7 } }, "\uAC15\uC870\uC5B4\uC5D0 ", /* @__PURE__ */ React.createElement("code", null, "{name}"), " \uD1A0\uD070\uC744 \uC4F0\uBA74 \uC0AC\uC6A9\uC790 \uC774\uB984\uC73C\uB85C \uCE58\uD658\uB429\uB2C8\uB2E4 (\uC608: \uD64D\uAE38\uB3D9 \uB2D8\uC758 \uC11C\uC7AC)."), /* @__PURE__ */ React.createElement(SectionForm, { key: `myPageIntro-${tick}`, section: "myPageIntro", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0 (\uC608: MY PAGE \xB7 \uD68C\uC6D0 \uC815\uBCF4)", full: true },
    { key: "titlePrefix", label: "\uD070 \uC81C\uBAA9 \uC55E\uBD80\uBD84" },
    { key: "titleAccent", label: "\uD070 \uC81C\uBAA9 \uAC15\uC870\uC5B4 (\uC608: {name})" },
    { key: "titleSuffix", label: "\uD070 \uC81C\uBAA9 \uB4B7\uBD80\uBD84 (\uC608:  \uB2D8\uC758 \uC11C\uC7AC)" },
    { key: "subtitle", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uBA39\uACE0 \uB180\uC790 (/eat) \uD398\uC774\uC9C0"), /* @__PURE__ */ React.createElement(SectionForm, { key: `eatIntro-${tick}`, section: "eatIntro", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0", full: true },
    { key: "title", label: "\uD070 \uC81C\uBAA9 (\uC608: \uBA39\uACE0 \uB180\uC790)" },
    { key: "sub", label: "\uC81C\uBAA9 \uC6B0\uCE21 \uC791\uC740 \uBD80\uC81C (\uC608: \uD55C\uAD6D\uC758 \uB9DB, \uD55C \uB07C\uC758 \uC778\uBB38\uD559)" },
    { key: "desc", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true },
    { key: "accent", label: "\uBD80\uC81C \uAC15\uC870 \uC0C9\uC0C1 (HEX, \uC608: #E8A540)" }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uC790\uACE0 \uB180\uC790 (/sleep) \uD398\uC774\uC9C0"), /* @__PURE__ */ React.createElement(SectionForm, { key: `sleepIntro-${tick}`, section: "sleepIntro", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0", full: true },
    { key: "title", label: "\uD070 \uC81C\uBAA9" },
    { key: "sub", label: "\uC81C\uBAA9 \uC6B0\uCE21 \uC791\uC740 \uBD80\uC81C" },
    { key: "desc", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true },
    { key: "accent", label: "\uBD80\uC81C \uAC15\uC870 \uC0C9\uC0C1 (HEX)" }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\uC0AC\uACE0 \uB180\uC790 (/shop) \uD398\uC774\uC9C0"), /* @__PURE__ */ React.createElement(SectionForm, { key: `shopIntro-${tick}`, section: "shopIntro", fields: [
    { key: "eyebrow", label: "\uC544\uC774\uBE0C\uB85C\uC6B0", full: true },
    { key: "title", label: "\uD070 \uC81C\uBAA9" },
    { key: "sub", label: "\uC81C\uBAA9 \uC6B0\uCE21 \uC791\uC740 \uBD80\uC81C" },
    { key: "desc", label: "\uBCF8\uBB38 \uC124\uBA85", full: true, multiline: true },
    { key: "accent", label: "\uBD80\uC81C \uAC15\uC870 \uC0C9\uC0C1 (HEX)" }
  ] }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "OG \uBA54\uD0C0 (\uACF5\uC720 \uBBF8\uB9AC\uBCF4\uAE30)"), /* @__PURE__ */ React.createElement(SectionForm, { key: `og-${tick}`, section: "og", fields: [
    { key: "title", label: "OG \uC81C\uBAA9", full: true },
    { key: "description", label: "OG \uC124\uBA85", full: true, multiline: true }
  ] }), /* @__PURE__ */ React.createElement(
    ImageUploader,
    {
      section: "og",
      field: "imageDataUri",
      label: "OG \uC774\uBBF8\uC9C0",
      hint: "1200x630 PNG/JPG \uAD8C\uC7A5 \xB7 \uCE74\uCE74\uC624\uD1A1/\uD398\uC774\uC2A4\uBD81/X \uACF5\uC720 \uC2DC \uBBF8\uB9AC\uBCF4\uAE30\uC5D0 \uC0AC\uC6A9. 1.5MB \uC774\uD558.",
      previewSize: 80
    }
  ), /* @__PURE__ */ React.createElement(OgPreviewBlock, { sc }));
};
const OgPreviewBlock = ({ sc }) => {
  var _a;
  const og = sc.og || {};
  const title = og.title || "\uBC45\uAE30\uB178\uC790 \u2014 \uBC45\uAE30 \uD0C0\uACE0 \uD55C\uAD6D\uC744 \uB290\uB07C\uB2E4";
  const description = og.description || "\uBC45\uAE30\uB178\uC790 \u2014 \uBC45\uAE30 \uD0C0\uACE0 \uD55C\uAD6D\uC744 \uB290\uB07C\uB2E4. \uAD81\uAD90 \uB2F5\uC0AC\uBD80\uD130 \uC9C0\uC5ED \uC5EC\uD589\uAE4C\uC9C0, \uD55C\uAD6D\uC758 \uC5ED\uC0AC\xB7\uBB38\uD654\xB7\uC790\uC5F0\uC744 \uD568\uAED8 \uC5EC\uD589\uD558\uB294 \uCEE4\uBBA4\uB2C8\uD2F0.";
  const imageSrc = og.imageDataUri || (typeof document !== "undefined" ? (_a = document.querySelector('meta[property="og:image"]')) == null ? void 0 : _a.getAttribute("content") : "") || "";
  const isUserUpload = !!og.imageDataUri;
  const isSvg = (imageSrc || "").startsWith("data:image/svg");
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement("h4", { className: "ko-serif", style: { fontSize: 15, marginBottom: 8 } }, "\uD604\uC7AC OG \uC774\uBBF8\uC9C0 \u2014 \uB77C\uC774\uBE0C \uBBF8\uB9AC\uBCF4\uAE30"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginBottom: 10, lineHeight: 1.6 } }, isUserUpload ? "\u2713 \uAD00\uB9AC\uC790\uAC00 \uC5C5\uB85C\uB4DC\uD55C \uC774\uBBF8\uC9C0\uAC00 \uC801\uC6A9\uB418\uACE0 \uC788\uC2B5\uB2C8\uB2E4." : "\u24D8 \uC5C5\uB85C\uB4DC\uB41C \uC774\uBBF8\uC9C0\uAC00 \uC5C6\uC5B4 \uBE0C\uB79C\uB4DC fallback SVG \uAC00 \uC0AC\uC6A9\uB429\uB2C8\uB2E4. SVG \uB294 Twitter/Discord \uC5D0\uC11C\uB9CC \uC778\uC2DD \u2014 Facebook/Kakao \uACF5\uC720 \uC2DC \uBBF8\uB9AC\uBCF4\uAE30\uAC00 \uBE44\uC5B4 \uBCF4\uC785\uB2C8\uB2E4. PNG \uC5C5\uB85C\uB4DC \uAD8C\uC7A5."), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 0, overflow: "hidden", maxWidth: 520, marginBottom: 18 } }, imageSrc ? /* @__PURE__ */ React.createElement(
    "img",
    {
      src: imageSrc,
      alt: "\uD604\uC7AC og:image",
      style: { width: "100%", display: "block", aspectRatio: "1200/630", objectFit: "cover", background: "var(--bg-2)" }
    }
  ) : /* @__PURE__ */ React.createElement("div", { style: { aspectRatio: "1200/630", display: "grid", placeItems: "center", background: "var(--bg-3)", color: "var(--ink-3)", fontSize: 13 } }, "og:image \uBBF8\uC124\uC815"), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.18em", marginBottom: 4 } }, "BGNJ.NET"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 4, lineHeight: 1.3 } }, title), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12, lineHeight: 1.5, color: "var(--ink-2)" } }, description))), /* @__PURE__ */ React.createElement("h4", { className: "ko-serif", style: { fontSize: 15, marginBottom: 8 } }, "\uD50C\uB7AB\uD3FC \uD638\uD658\uC131"), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", minWidth: 480, borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uD50C\uB7AB\uD3FC"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "SVG dataURI"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "PNG/JPG dataURI"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uD604\uC7AC \uC0C1\uD0DC"))), /* @__PURE__ */ React.createElement("tbody", null, [
    { name: "Twitter / X", svg: "\u2713", png: "\u2713", current: isSvg ? "\u2713" : isUserUpload ? "\u2713" : "\u2717" },
    { name: "Discord", svg: "\u2713", png: "\u2713", current: isSvg ? "\u2713" : isUserUpload ? "\u2713" : "\u2717" },
    { name: "Slack", svg: "\u25B3", png: "\u2713", current: isUserUpload ? "\u2713" : "\u25B3" },
    { name: "Facebook", svg: "\u2717", png: "\u2713", current: isSvg ? "\u2717" : isUserUpload ? "\u2713" : "\u2717" },
    { name: "KakaoTalk", svg: "\u2717", png: "\u2713", current: isSvg ? "\u2717" : isUserUpload ? "\u2713" : "\u2717" },
    { name: "LinkedIn", svg: "\u2717", png: "\u2713", current: isSvg ? "\u2717" : isUserUpload ? "\u2713" : "\u2717" }
  ].map((p) => /* @__PURE__ */ React.createElement("tr", { key: p.name, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: 10, color: "var(--ink)", fontWeight: 500 } }, p.name), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: 10, fontSize: 13, color: p.svg === "\u2713" ? "var(--success)" : p.svg === "\u25B3" ? "var(--warning)" : "var(--ink-3)" } }, p.svg), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: 10, fontSize: 13, color: p.png === "\u2713" ? "var(--success)" : "var(--ink-3)" } }, p.png), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: 10, fontSize: 13, color: p.current === "\u2713" ? "var(--success)" : p.current === "\u25B3" ? "var(--warning)" : "var(--danger)", fontWeight: 600 } }, p.current)))))), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.6 } }, "\u24D8 ", /* @__PURE__ */ React.createElement("strong", null, "\uC804 \uD50C\uB7AB\uD3FC \uCEE4\uBC84 \uAD8C\uC7A5:"), " 1200\xD7630 PNG/JPG \uB97C \uC5C5\uB85C\uB4DC\uD558\uBA74 SVG fallback \uC744 \uB36E\uC5B4\uC4F0\uACE0 Facebook/Kakao \uB4F1\uC5D0\uC11C\uB3C4 \uBBF8\uB9AC\uBCF4\uAE30\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4."));
};
const BooksAdminPanel = () => {
  var _a, _b, _c, _d;
  const [tick, setTick] = React.useState(0);
  const [newDraft, setNewDraft] = React.useState(null);
  const realBooks = React.useMemo(() => window.BGNJ_BOOKS.list(), [tick]);
  const books = React.useMemo(
    () => newDraft ? [newDraft, ...realBooks.filter((b) => b.id !== "__new__")] : realBooks,
    [realBooks, newDraft]
  );
  const [selectedId, setSelectedId] = React.useState(((_a = realBooks[0]) == null ? void 0 : _a.id) || null);
  const selected = React.useMemo(() => {
    if (selectedId === "__new__" && newDraft) return newDraft;
    return window.BGNJ_BOOKS.get(selectedId);
  }, [selectedId, tick, newDraft]);
  const [editTab, setEditTab] = React.useState("meta");
  const [msg, setMsg] = React.useState("");
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2e3);
  };
  const refresh = () => setTick((v) => v + 1);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await window.BGNJ_BOOKS.refresh({ admin: true });
      } catch (e) {
      }
      if (!cancelled) {
        setLoading(false);
        setTick((v) => v + 1);
        const fresh = window.BGNJ_BOOKS.list();
        if (!selectedId && fresh.length > 0) setSelectedId(fresh[0].id);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const [editing, setEditing] = React.useState(null);
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [uploadingCover, setUploadingCover] = React.useState(false);
  const [uploadingPdf, setUploadingPdf] = React.useState(false);
  React.useEffect(() => {
    if (!selected) {
      setEditing(null);
      setDirty(false);
      return;
    }
    if (dirty && editing && editing.id !== selected.id) {
      (async () => {
        const ok = await window.BGNJ_CONFIRM("\uC800\uC7A5\uD558\uC9C0 \uC54A\uC740 \uBCC0\uACBD \uC0AC\uD56D\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uADF8\uB798\uB3C4 \uB2E4\uB978 \uCC45\uC73C\uB85C \uC774\uB3D9\uD560\uAE4C\uC694?", { danger: true });
        if (!ok) {
          if (editing.id) setSelectedId(editing.id);
          return;
        }
        setEditing({ ...selected });
        setDirty(false);
      })();
      return;
    }
    setEditing({ ...selected });
    setDirty(false);
  }, [selectedId, tick]);
  const setField = (key, val) => {
    setEditing((cur) => cur ? { ...cur, [key]: val } : cur);
    setDirty(true);
  };
  const patchImmediate = (changes) => {
    if (!selectedId) return;
    window.BGNJ_BOOKS.update(selectedId, changes);
    setEditing((cur) => cur ? { ...cur, ...changes } : cur);
    refresh();
  };
  const commit = async () => {
    var _a2, _b2, _c2, _d2, _e;
    if (!editing || saving) return;
    if (!editing._isNew && !dirty) return;
    setSaving(true);
    try {
      if (editing._isNew) {
        if (!((_a2 = editing.title) == null ? void 0 : _a2.trim())) {
          flash("\u2717 \uC81C\uBAA9\uC740 \uD544\uC218\uC785\uB2C8\uB2E4.");
          setSaving(false);
          return;
        }
        const { _isNew, id: _droppedId, ...payload } = editing;
        const created = await window.BGNJ_BOOKS.create(payload);
        if (!(created == null ? void 0 : created.id)) throw new Error("\uC11C\uBC84 \uC751\uB2F5\uC5D0 id \uC5C6\uC74C");
        try {
          (_c2 = (_b2 = window.BGNJ_BROADCAST) == null ? void 0 : _b2.publish) == null ? void 0 : _c2.call(_b2, "books");
        } catch (e) {
        }
        setNewDraft(null);
        setSelectedId(created.id);
        setDirty(false);
        flash("\u2713 \uC0C8 \uCC45 \uC800\uC7A5 \uC644\uB8CC");
        refresh();
        return;
      }
      const changes = {};
      Object.keys(editing).forEach((k) => {
        if (selected && JSON.stringify(editing[k]) !== JSON.stringify(selected[k])) {
          changes[k] = editing[k];
        }
      });
      if (Object.keys(changes).length === 0) {
        setDirty(false);
        flash("\uBCC0\uACBD \uC5C6\uC74C");
        return;
      }
      await window.BGNJ_BOOKS.update(selectedId, changes);
      try {
        (_e = (_d2 = window.BGNJ_BROADCAST) == null ? void 0 : _d2.publish) == null ? void 0 : _e.call(_d2, "books");
      } catch (e) {
      }
      setDirty(false);
      flash(`\u2713 \uC800\uC7A5 \uC644\uB8CC (${Object.keys(changes).length}\uAC1C \uD544\uB4DC)`);
      refresh();
    } catch (err) {
      flash("\u2717 \uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    } finally {
      setSaving(false);
    }
  };
  const cancelDraft = async () => {
    var _a2;
    if (dirty && !await window.BGNJ_CONFIRM("\uC791\uC131 \uC911\uC778 \uC0C8 \uCC45\uC744 \uCDE8\uC18C\uD560\uAE4C\uC694?", { danger: true })) return;
    setNewDraft(null);
    setDirty(false);
    const fallback = ((_a2 = realBooks[0]) == null ? void 0 : _a2.id) || null;
    setSelectedId(fallback);
  };
  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const addBook = () => {
    if (newDraft) {
      setSelectedId("__new__");
      setEditTab("meta");
      return;
    }
    setNewDraft({
      id: "__new__",
      title: "",
      subtitle: "",
      author: "\uBC45\uAE30\uB178\uC790",
      publisher: "",
      pages: 0,
      isbn: "",
      priceKR: 0,
      priceEN: 0,
      desc: "",
      intro: "",
      authorBio: "",
      status: "draft",
      publishedAt: "",
      coverDataUri: "",
      pdfPreviewDataUri: "",
      chapters: [],
      reviews: [],
      _isNew: true
    });
    setSelectedId("__new__");
    setEditTab("meta");
  };
  const removeBook = async (id) => {
    var _a2, _b2, _c2;
    const target = window.BGNJ_BOOKS.get(id);
    if (!target) return;
    if (!await window.BGNJ_CONFIRM(`"${target.title}" \uCC45\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694? (\uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC74C)`, { danger: true })) return;
    try {
      await window.BGNJ_BOOKS.remove(id);
      try {
        (_b2 = (_a2 = window.BGNJ_BROADCAST) == null ? void 0 : _a2.publish) == null ? void 0 : _b2.call(_a2, "books");
      } catch (e) {
      }
      refresh();
      if (selectedId === id) {
        const remaining = window.BGNJ_BOOKS.list();
        setSelectedId(((_c2 = remaining[0]) == null ? void 0 : _c2.id) || null);
      }
    } catch (err) {
      window.BGNJ_TOAST.error("\uCC45 \uC0AD\uC81C \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const patch = (changes) => {
    if (!selectedId) return;
    window.BGNJ_BOOKS.update(selectedId, changes);
    refresh();
  };
  const onUploadCover = async (e) => {
    setUploadingCover(true);
    flash("\uD45C\uC9C0 \uC5C5\uB85C\uB4DC \uC911\u2026");
    try {
      const result = await pickImageWithR2Fallback(e, { folder: "book-covers" });
      if (result) {
        patchImmediate({ coverDataUri: result });
        flash("\u2713 \uD45C\uC9C0 \uC5C5\uB85C\uB4DC \uC644\uB8CC");
      }
    } finally {
      setUploadingCover(false);
    }
  };
  const onUploadPdf = async (e) => {
    setUploadingPdf(true);
    flash("PDF \uC5C5\uB85C\uB4DC \uC911\u2026");
    try {
      const result = await pickImageWithR2Fallback(e, { folder: "book-pdfs", maxBytes: 20 * 1024 * 1024, fallbackMaxBytes: 3 * 1024 * 1024 });
      if (result) {
        patchImmediate({ pdfPreviewDataUri: result });
        flash("\u2713 PDF \uBBF8\uB9AC\uBCF4\uAE30 \uC5C5\uB85C\uB4DC \uC644\uB8CC");
      }
    } finally {
      setUploadingPdf(false);
    }
  };
  const tabs = [
    { id: "meta", label: "\uBA54\uD0C0\xB7\uAC00\uACA9" },
    { id: "media", label: "\uD45C\uC9C0 \xB7 PDF" },
    { id: "intro", label: "\uC18C\uAC1C" },
    { id: "toc", label: "\uBAA9\uCC28" },
    { id: "author", label: "\uC800\uC790" },
    { id: "reviews", label: `\uB9AC\uBDF0 ${((selected == null ? void 0 : selected.reviews) || []).length || ""}`.trim() }
  ];
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 18, lineHeight: 1.8 } }, "\uBC45\uAE30\uB178\uC790\uAC00 \uCD9C\uAC04\uD55C \uCC45\uB4E4\uC744 \uAD00\uB9AC\uD569\uB2C8\uB2E4. \uAC01 \uCC45\uC740 \uD45C\uC9C0(PNG)\uC640 \uBCF8\uBB38 \uBBF8\uB9AC\uBCF4\uAE30(PDF)\uB97C \uAC00\uC9C8 \uC218 \uC788\uACE0, \uC18C\uAC1C\xB7\uBAA9\uCC28\xB7\uC800\uC790\xB7\uB9AC\uBDF0 \uCF58\uD150\uCE20\uB97C \uB3C5\uB9BD\uC801\uC73C\uB85C \uD3B8\uC9D1\uD569\uB2C8\uB2E4."), loading && /* @__PURE__ */ React.createElement("div", { role: "status", style: { fontSize: 13, marginBottom: 14, padding: "10px 14px", border: "1px solid var(--line)", background: "var(--bg-2)" } }, "\u23F3 \uC11C\uBC84\uC5D0\uC11C \uCC45 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026"), !loading && books.length === 0 && /* @__PURE__ */ React.createElement("div", { role: "status", style: { fontSize: 13, marginBottom: 14, padding: "10px 14px", border: "1px solid var(--primary-dim)", background: "rgba(245,213,72,0.06)", color: "var(--ink)" } }, "\u24D8 \uB4F1\uB85D\uB41C \uCC45\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC6B0\uCE21 \uC0C1\uB2E8 [\uFF0B \uC0C8 \uCC45] \uC73C\uB85C \uCD94\uAC00\uD558\uAC70\uB098, \uC544\uB798 [\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30] \uB85C \uC0C8\uB85C\uACE0\uCE68\uD558\uC138\uC694."), msg && /* @__PURE__ */ React.createElement("div", { role: "status", className: "mono gold", style: { fontSize: 12, marginBottom: 14, padding: "8px 12px", border: "1px solid var(--primary-dim)", background: "rgba(59,130,246,0.06)" } }, msg), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: async () => {
    setLoading(true);
    try {
      await window.BGNJ_BOOKS.refresh({ admin: true });
    } catch (e) {
    }
    setLoading(false);
    refresh();
    flash("\u2713 \uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30 \uC644\uB8CC \u2014 " + window.BGNJ_BOOKS.list().length + "\uAD8C");
  } }, "\u{1F504} \uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" } }, /* @__PURE__ */ React.createElement("aside", { "aria-label": "\uCC45 \uBAA9\uB85D", style: { border: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em" } }, "BOOKS \xB7 ", books.length), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, books.length === 0 && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: async () => {
    if (!await window.BGNJ_CONFIRM("\uC0D8\uD50C \uCC45 2\uAD8C\uC744 \uCD94\uAC00\uD569\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?", { danger: true })) return;
    const samples = [
      { title: "\uC655\uC758 \uAE38 \u2014 \uC870\uC120 \uC655\uC2E4\uC758 \uC77C\uC0C1", subtitle: "\uACBD\uBCF5\uAD81\uC758 \uC0AC\uACC4\uC640 \uC758\uB840", author: "\uBC45\uAE30\uB178\uC790", publisher: "\uBC45\uAE30\uB178\uC790 \uCD9C\uD310\uBD80", priceKR: 18e3, status: "published", desc: "\uC870\uC120 \uC655\uC2E4\uC758 \uC77C\uC0C1\uACFC \uC758\uB840\uB97C \uB530\uB77C \uAC77\uB294 \uC778\uBB38\uD559 \uC0B0\uCC45." },
      { title: "\uBB38(\u9580)\uC744 \uC77D\uB2E4", subtitle: "\uAD81\uAD90 \uBB38\uC5D0 \uC0C8\uACA8\uC9C4 \uC778\uBB38\uD559", author: "\uBC45\uAE30\uB178\uC790", publisher: "\uBC45\uAE30\uB178\uC790 \uCD9C\uD310\uBD80", priceKR: 22e3, status: "published", desc: "\uAD11\uD654\uBB38\uC5D0\uC11C \uC2E0\uBB34\uBB38\uAE4C\uC9C0, \uBB38\uC5D0 \uB2F4\uAE34 \uC758\uBBF8\uB97C \uD574\uB3C5\uD569\uB2C8\uB2E4." }
    ];
    for (const s of samples) await window.BGNJ_BOOKS.create(s);
    refresh();
  } }, "\uC0D8\uD50C \uB370\uC774\uD130 \uCD94\uAC00"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small btn-gold",
      onClick: addBook,
      disabled: !!newDraft,
      title: newDraft ? "\uC791\uC131 \uC911\uC778 \uC0C8 \uCC45\uC774 \uC788\uC2B5\uB2C8\uB2E4 \u2014 \uC6B0\uCE21\uC5D0\uC11C \uC800\uC7A5\uD558\uAC70\uB098 \uCDE8\uC18C" : "",
      style: newDraft ? { opacity: 0.5, cursor: "not-allowed" } : void 0
    },
    newDraft ? "\uFF0B \uC0C8 \uCC45 (\uC791\uC131 \uC911)" : "\uFF0B \uC0C8 \uCC45"
  ))), books.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "dim", style: { padding: 20, fontSize: 13 } }, "\uB4F1\uB85D\uB41C \uCC45\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("ul", { role: "list", style: { listStyle: "none", margin: 0, padding: 0 } }, books.map((b, i) => {
    var _a2;
    const isDraft = b._isNew || b.id === "__new__";
    const realIdx = isDraft ? -1 : realBooks.findIndex((x) => x.id === b.id);
    return /* @__PURE__ */ React.createElement("li", { key: b.id, style: {
      borderBottom: "1px solid var(--line)",
      display: "flex",
      alignItems: "stretch",
      background: isDraft ? "rgba(245,213,72,0.06)" : "transparent",
      borderLeft: isDraft ? "3px solid var(--primary)" : "3px solid transparent"
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => {
          setSelectedId(b.id);
          setEditTab("meta");
        },
        "aria-current": selectedId === b.id ? "true" : void 0,
        style: {
          flex: 1,
          textAlign: "left",
          padding: "12px 8px 12px 14px",
          background: selectedId === b.id ? "rgba(59,130,246,0.06)" : "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          gap: 10,
          alignItems: "center"
        }
      },
      /* @__PURE__ */ React.createElement("span", { style: {
        width: 32,
        height: 42,
        flexShrink: 0,
        border: "1px solid var(--line)",
        background: "var(--bg-2)",
        display: "grid",
        placeItems: "center",
        overflow: "hidden"
      } }, b.coverDataUri ? /* @__PURE__ */ React.createElement("img", { src: b.coverDataUri, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 8 } }, "NO COVER")),
      /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: 13, color: "var(--ink)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, isDraft ? ((_a2 = b.title) == null ? void 0 : _a2.trim()) || "(\uC81C\uBAA9 \uC5C6\uC74C)" : b.title), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.12em", color: isDraft ? "var(--primary)" : void 0 } }, isDraft ? "\u25CF \uC0C8 \uCC45 (\uBBF8\uC800\uC7A5)" : b.status === "published" ? "\uCD9C\uAC04" : b.status === "coming_soon" ? "\uCD9C\uAC04 \uC608\uC815" : "\uCD08\uC548", !isDraft && b.primary ? " \xB7 \uB300\uD45C" : ""))
    ), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      margin: "8px 6px",
      alignSelf: "center",
      border: "1px solid var(--line)",
      borderRadius: 3,
      overflow: "hidden",
      visibility: isDraft ? "hidden" : "visible"
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        "aria-label": `${b.title} \uC704\uB85C`,
        title: "\uC704\uB85C \uC774\uB3D9",
        disabled: isDraft || realIdx <= 0,
        onClick: async () => {
          const ids = realBooks.map((x) => x.id);
          [ids[realIdx - 1], ids[realIdx]] = [ids[realIdx], ids[realIdx - 1]];
          try {
            await window.BGNJ_BOOKS.reorder(ids);
            refresh();
          } catch (err) {
            window.BGNJ_TOAST.error("\uC21C\uC11C \uBCC0\uACBD \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
          }
        },
        style: {
          background: "transparent",
          border: "none",
          borderBottom: "1px solid var(--line)",
          padding: "3px 8px",
          fontSize: 10,
          lineHeight: 1,
          cursor: realIdx <= 0 ? "not-allowed" : "pointer",
          opacity: realIdx <= 0 ? 0.3 : 1
        }
      },
      "\u25B2"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        "aria-label": `${b.title} \uC544\uB798\uB85C`,
        title: "\uC544\uB798\uB85C \uC774\uB3D9",
        disabled: isDraft || realIdx < 0 || realIdx >= realBooks.length - 1,
        onClick: async () => {
          const ids = realBooks.map((x) => x.id);
          [ids[realIdx], ids[realIdx + 1]] = [ids[realIdx + 1], ids[realIdx]];
          try {
            await window.BGNJ_BOOKS.reorder(ids);
            refresh();
          } catch (err) {
            window.BGNJ_TOAST.error("\uC21C\uC11C \uBCC0\uACBD \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
          }
        },
        style: {
          background: "transparent",
          border: "none",
          padding: "3px 8px",
          fontSize: 10,
          lineHeight: 1,
          cursor: realIdx < 0 || realIdx >= realBooks.length - 1 ? "not-allowed" : "pointer",
          opacity: realIdx < 0 || realIdx >= realBooks.length - 1 ? 0.3 : 1
        }
      },
      "\u25BC"
    )));
  }))), /* @__PURE__ */ React.createElement("section", { "aria-label": "\uCC45 \uD3B8\uC9D1" }, !selected ? /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, textAlign: "center" } }, "\uC88C\uCE21\uC5D0\uC11C \uCC45\uC744 \uC120\uD0DD\uD558\uAC70\uB098 \uC0C8 \uCC45\uC744 \uCD94\uAC00\uD558\uC138\uC694.") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, borderBottom: "1px solid var(--line)", marginBottom: 18 } }, tabs.map((t) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t.id,
      type: "button",
      onClick: () => setEditTab(t.id),
      style: {
        padding: "10px 14px",
        fontSize: 13,
        color: editTab === t.id ? "var(--primary)" : "var(--ink-2)",
        borderBottom: editTab === t.id ? "2px solid var(--primary)" : "2px solid transparent",
        marginBottom: -1,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-serif)"
      }
    },
    t.label
  )), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => removeBook(selected.id),
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uCC45 \uC0AD\uC81C"
  )), editTab === "meta" && editing && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC81C\uBAA9"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: editing.title || "", onChange: (e) => setField("title", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBD80\uC81C"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: editing.subtitle || "", onChange: (e) => setField("subtitle", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC800\uC790"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: editing.author || "", onChange: (e) => setField("author", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uCD9C\uD310\uC0AC"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: editing.publisher || "", onChange: (e) => setField("publisher", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uD398\uC774\uC9C0 \uC218"), /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: (_b = editing.pages) != null ? _b : 0, onChange: (e) => setField("pages", Number(e.target.value)) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "ISBN"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: editing.isbn || "", onChange: (e) => setField("isbn", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uAD6D\uBB38\uD310 \uAC00\uACA9(\uC6D0)"), /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: (_c = editing.priceKR) != null ? _c : 0, onChange: (e) => setField("priceKR", Number(e.target.value)) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC601\uBB38\uD310 \uAC00\uACA9(\uC6D0)"), /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: (_d = editing.priceEN) != null ? _d : 0, onChange: (e) => setField("priceEN", Number(e.target.value)) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("select", { className: "field-input", value: editing.status || "draft", onChange: (e) => setField("status", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "published" }, "\uCD9C\uAC04"), /* @__PURE__ */ React.createElement("option", { value: "coming_soon" }, "\uCD9C\uAC04 \uC608\uC815"), /* @__PURE__ */ React.createElement("option", { value: "draft" }, "\uCD08\uC548 (\uBE44\uACF5\uAC1C)"))), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uCD9C\uAC04\uC77C"), /* @__PURE__ */ React.createElement("input", { type: "date", className: "field-input", value: editing.publishedAt || "", onChange: (e) => setField("publishedAt", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("input", { id: "book-primary", type: "checkbox", checked: !!editing.primary, onChange: (e) => setField("primary", e.target.checked) }), /* @__PURE__ */ React.createElement("label", { htmlFor: "book-primary", className: "field-label", style: { margin: 0 } }, "\uB300\uD45C \uCC45 (\uD648 CTA\uC5D0 \uB178\uCD9C\uB418\uB294 \uBA54\uC778 \uCC45)")), /* @__PURE__ */ React.createElement("div", { className: "field", style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC9E7\uC740 \uC124\uBA85 (\uCE74\uD0C8\uB85C\uADF8 \uCE74\uB4DC\uC6A9)"), /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 3, value: editing.desc || "", onChange: (e) => setField("desc", e.target.value) }), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 6, lineHeight: 1.5 } }, "\uCE74\uD0C8\uB85C\uADF8/\uB9AC\uC2A4\uD2B8 \uCE74\uB4DC\uC5D0 \uB178\uCD9C\uB418\uB294 \uC9E7\uC740 \uD55C\uB450 \uC904.")), /* @__PURE__ */ React.createElement("div", { className: "field", style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uD648 CTA \uBCF8\uBB38 (\uBA54\uC778 \uD654\uBA74 \uB178\uCD9C \u2014 \uBCC4\uB3C4 \uD544\uB4DC)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 6,
      value: (() => {
        var _a2, _b2;
        const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
        const map = sc.bookHomeIntros || {};
        return editing._homeIntroDraft != null ? editing._homeIntroDraft : map[editing.id] || map[String(editing.id)] || "";
      })(),
      onChange: (e) => setField("_homeIntroDraft", e.target.value),
      placeholder: "\uBA54\uC778 \uD654\uBA74 \uCC45 \uCE74\uB8E8\uC140\uC5D0 \uB178\uCD9C\uB418\uB294 \uBCF8\uBB38.\n\uBE44\uC6CC\uB450\uBA74 '\uC9E7\uC740 \uC124\uBA85' \uC73C\uB85C \uC790\uB3D9 \uD3F4\uBC31\uB429\uB2C8\uB2E4.\n\n\uC608) \uC870\uC120 27\uBA85 \uC655\uC758 \uC0DD\uC560\uB97C '\uC124\uACC4\uB3C4'\uB85C \uC77D\uC5B4\uB0B8 \uAC74\uCD95\uAC00\uC758 \uC2DC\uC120.",
      style: { fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.8, resize: "vertical" }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 8, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small btn-gold",
      disabled: editing._homeIntroDraft == null,
      onClick: async () => {
        var _a2, _b2;
        try {
          const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
          const next = { ...sc.bookHomeIntros || {} };
          const txt = String(editing._homeIntroDraft || "");
          if (txt.trim()) next[editing.id] = txt;
          else delete next[editing.id];
          await window.BGNJ_SITE_CONTENT.saveSection("bookHomeIntros", next);
          setField("_homeIntroDraft", null);
          flash("\u2713 \uD648 \uC18C\uAC1C\uAE00 \uC800\uC7A5\uB428 \u2014 \uD648 \uD654\uBA74 \uC989\uC2DC \uBC18\uC601");
        } catch (err) {
          window.BGNJ_TOAST.error("\uD648 \uC18C\uAC1C\uAE00 \uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
        }
      }
    },
    "\u{1F4BE} \uD648 \uC18C\uAC1C\uAE00\uB9CC \uC989\uC2DC \uC800\uC7A5"
  ), editing._homeIntroDraft != null && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, "\u25CF \uBBF8\uC800\uC7A5")), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 6, lineHeight: 1.5 } }, "\uD648 \uCC45 \uCE74\uB8E8\uC140\uC5D0\uB9CC \uB178\uCD9C\uB418\uB294 \uBCF8\uBB38. \uC9E7\uC740 \uC124\uBA85(\uC704)\uACFC \uBCC4\uAC1C\uB85C \uB354 \uAE38\uAC8C \uC4F8 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uBE44\uC6CC\uB450\uBA74 \uC9E7\uC740 \uC124\uBA85\uC744 \uC790\uB3D9 \uC0AC\uC6A9. \uC904\uBC14\uAFC8 \uBCF4\uC874\uB428.")), /* @__PURE__ */ React.createElement("div", { className: "field", style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uCC45 \uC815\uBCF4 \uB178\uCD9C \uC120\uD0DD (\uCC45 \uC0C1\uC138 \uD398\uC774\uC9C0)"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginBottom: 10, lineHeight: 1.5 } }, "\uCCB4\uD06C \uD574\uC81C\uD55C \uD56D\uBAA9\uC740 \uC0AC\uC774\uD2B8 \uCC45 \uC0C1\uC138 \uD398\uC774\uC9C0\uC5D0\uC11C \uB178\uCD9C\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uB370\uC774\uD130\uB294 \uADF8\uB300\uB85C \uBCF4\uC874\uB418\uBA70 \uD45C\uC2DC \uC5EC\uBD80\uB9CC \uC81C\uC5B4\uD569\uB2C8\uB2E4."), (() => {
    var _a2, _b2;
    const FIELDS = [
      ["subtitle", "\uBD80\uC81C"],
      ["author", "\uC800\uC790"],
      ["publisher", "\uCD9C\uD310\uC0AC"],
      ["pages", "\uD398\uC774\uC9C0 \uC218"],
      ["isbn", "ISBN"],
      ["priceKR", "\uAD6D\uBB38\uD310 \uAC00\uACA9"],
      ["priceEN", "\uC601\uBB38\uD310 \uAC00\uACA9"]
    ];
    const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
    const map = sc.bookFieldVisibility || {};
    const saved = map[editing.id] || map[String(editing.id)] || {};
    const draft = editing._visibilityDraft;
    const cur = (key) => {
      if (draft && key in draft) return draft[key] !== false;
      if (key in saved) return saved[key] !== false;
      return true;
    };
    const toggle = (key) => {
      const next = { ...draft || {} };
      next[key] = !cur(key);
      setField("_visibilityDraft", next);
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 } }, FIELDS.map(([key, label]) => {
      const on = cur(key);
      return /* @__PURE__ */ React.createElement("label", { key, style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        border: "1px solid " + (on ? "var(--primary-dim)" : "var(--line)"),
        background: on ? "rgba(245,213,72,0.06)" : "var(--bg-2)",
        cursor: "pointer",
        fontSize: 13
      } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: on, onChange: () => toggle(key) }), /* @__PURE__ */ React.createElement("span", { style: { color: on ? "var(--ink)" : "var(--ink-3)" } }, label));
    })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small btn-gold",
        disabled: !draft,
        onClick: async () => {
          var _a3, _b3;
          try {
            const _sc = ((_b3 = (_a3 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a3.get) == null ? void 0 : _b3.call(_a3)) || {};
            const next = { ..._sc.bookFieldVisibility || {} };
            const merged = { ...saved || {}, ...draft || {} };
            const allOn = FIELDS.every(([k]) => merged[k] !== false);
            if (allOn) delete next[editing.id];
            else next[editing.id] = merged;
            await window.BGNJ_SITE_CONTENT.saveSection("bookFieldVisibility", next);
            setField("_visibilityDraft", null);
            flash("\u2713 \uB178\uCD9C \uC124\uC815 \uC800\uC7A5\uB428 \u2014 \uCC45 \uC0C1\uC138 \uC989\uC2DC \uBC18\uC601");
          } catch (err) {
            window.BGNJ_TOAST.error("\uB178\uCD9C \uC124\uC815 \uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
          }
        }
      },
      "\u{1F4BE} \uB178\uCD9C \uC124\uC815 \uC989\uC2DC \uC800\uC7A5"
    ), draft && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, "\u25CF \uBBF8\uC800\uC7A5")));
  })())), editTab === "media" && editing && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18 } }, /* @__PURE__ */ React.createElement("h4", { className: "ko-serif", style: { fontSize: 14, marginBottom: 10 } }, "\uD45C\uC9C0 (PNG/JPG)"), /* @__PURE__ */ React.createElement("div", { style: {
    aspectRatio: "3/4",
    maxWidth: 200,
    marginBottom: 12,
    position: "relative",
    border: "1px solid var(--line)",
    background: "var(--bg-2)",
    display: "grid",
    placeItems: "center",
    overflow: "hidden"
  } }, editing.coverDataUri ? /* @__PURE__ */ React.createElement("img", { src: editing.coverDataUri, alt: `${editing.title} \uD45C\uC9C0`, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10, letterSpacing: "0.18em" } }, "NO COVER"), uploadingCover && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "grid", placeItems: "center", color: "#fff", fontSize: 13, fontWeight: 600 } }, "\u23F3 \uC5C5\uB85C\uB4DC \uC911\u2026")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(
    "label",
    {
      className: `btn btn-small ${uploadingCover ? "disabled" : ""}`,
      style: { cursor: uploadingCover ? "not-allowed" : "pointer", opacity: uploadingCover ? 0.6 : 1 }
    },
    uploadingCover ? "\u23F3 \uC5C5\uB85C\uB4DC \uC911\u2026" : "\uC5C5\uB85C\uB4DC",
    /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/png,image/jpeg", onChange: onUploadCover, disabled: uploadingCover, style: { display: "none" } })
  ), editing.coverDataUri && !uploadingCover && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: async () => {
        if (await window.BGNJ_CONFIRM("\uD45C\uC9C0\uB97C \uBE44\uC6B8\uAE4C\uC694?", { danger: true })) patchImmediate({ coverDataUri: "" });
      },
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC81C\uAC70"
  )), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 10, lineHeight: 1.5 } }, "\uAD8C\uC7A5 \uBE44\uC728 3:4. 5MB \uC774\uD558 PNG/JPG (R2). \uC5C5\uB85C\uB4DC \uC989\uC2DC \uBC18\uC601 \u2014 \uBCC4\uB3C4 [\uC800\uC7A5] \uBD88\uD544\uC694.")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18 } }, /* @__PURE__ */ React.createElement("h4", { className: "ko-serif", style: { fontSize: 14, marginBottom: 10 } }, "\uBCF8\uBB38 \uBBF8\uB9AC\uBCF4\uAE30 (PDF) \u2014 \uC120\uD0DD"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, editing.pdfPreviewDataUri ? /* @__PURE__ */ React.createElement("div", { style: { height: 240, border: "1px solid var(--line)", marginBottom: 12 } }, /* @__PURE__ */ React.createElement(
    "iframe",
    {
      src: editing.pdfPreviewDataUri,
      title: `${editing.title} \uBBF8\uB9AC\uBCF4\uAE30`,
      style: { width: "100%", height: "100%", border: "none" }
    }
  )) : /* @__PURE__ */ React.createElement("div", { style: { height: 240, border: "1px dashed var(--line-2)", marginBottom: 12, display: "grid", placeItems: "center", textAlign: "center", padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10, letterSpacing: "0.18em", display: "block", marginBottom: 6 } }, "NO PDF"), /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 11 } }, "\uC5C5\uB85C\uB4DC \uC548 \uD558\uBA74 \uACF5\uAC1C \uD398\uC774\uC9C0\uC5D0\uC11C \uBBF8\uB9AC\uBCF4\uAE30 \uC139\uC158 \uC790\uCCB4\uB97C \uC228\uAE40."))), uploadingPdf && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "grid", placeItems: "center", color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 12 } }, "\u23F3 \uC5C5\uB85C\uB4DC \uC911\u2026")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(
    "label",
    {
      className: `btn btn-small ${uploadingPdf ? "disabled" : ""}`,
      style: { cursor: uploadingPdf ? "not-allowed" : "pointer", opacity: uploadingPdf ? 0.6 : 1 }
    },
    uploadingPdf ? "\u23F3 \uC5C5\uB85C\uB4DC \uC911\u2026" : "\uC5C5\uB85C\uB4DC",
    /* @__PURE__ */ React.createElement("input", { type: "file", accept: "application/pdf", onChange: onUploadPdf, disabled: uploadingPdf, style: { display: "none" } })
  ), editing.pdfPreviewDataUri && !uploadingPdf && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: async () => {
        if (await window.BGNJ_CONFIRM("PDF \uBBF8\uB9AC\uBCF4\uAE30\uB97C \uBE44\uC6B8\uAE4C\uC694?", { danger: true })) patchImmediate({ pdfPreviewDataUri: "" });
      },
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC81C\uAC70"
  )), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 10, lineHeight: 1.5 } }, '\uBE44\uC6CC\uB450\uBA74 \uACF5\uAC1C \uD398\uC774\uC9C0\uC5D0\uC11C "\uBBF8\uB9AC\uBCF4\uAE30" \uC139\uC158 \uC790\uCCB4\uAC00 \uC228\uACA8\uC9D1\uB2C8\uB2E4. (R2 20MB / \uD3F4\uBC31 3MB)'))), editTab === "intro" && editing && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC18C\uAC1C (HTML \uD5C8\uC6A9)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 12,
      value: editing.intro || "",
      onChange: (e) => setField("intro", e.target.value),
      style: { fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7 }
    }
  ), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 8, lineHeight: 1.5 } }, "\uBB38\uB2E8\uC740 <p>\u2026</p>\uB85C \uAD6C\uBD84. \uAC15\uC870\uB294 <strong>\u2026</strong>.")), editTab === "toc" && editing && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBAA9\uCC28"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, margin: "4px 0 10px" } }, "\uD55C \uC904 = \uD55C \uCC55\uD130\uB85C \uD45C\uC2DC\uB429\uB2C8\uB2E4. \uC904 \uC2DC\uC791\uC5D0 ", /* @__PURE__ */ React.createElement("code", { style: { padding: "1px 6px", background: "var(--bg-2)", border: "1px solid var(--line-2)", borderRadius: 3, fontFamily: "var(--font-mono)", fontSize: 11 } }, "- "), "(\uD558\uC774\uD508+\uACF5\uBC31) \uC744 \uBD99\uC774\uBA74 \uC9C1\uC804 \uCC55\uD130\uC758 ", /* @__PURE__ */ React.createElement("strong", null, "\uD558\uC704 \uC124\uBA85"), "\uC73C\uB85C \uB4E4\uC5EC\uC4F0\uAE30 \uD45C\uC2DC\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 14,
      placeholder: "\uC608)\n1\uBD80. \uC2DC\uC791\n- \uCCAB \uBC88\uC9F8 \uAE38\n- \uB450 \uBC88\uC9F8 \uAE38\n2\uBD80. \uB05D\uB098\uB294 \uC790\uB9AC\n- \uB9C8\uC9C0\uB9C9 \uD48D\uACBD",
      value: (editing.chapters || []).join("\n"),
      onChange: (e) => setField("chapters", e.target.value.split("\n").map((s) => s.replace(/^\s+|\s+$/g, "")).filter(Boolean)),
      style: { fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.8 }
    }
  )), editTab === "author" && editing && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC800\uC790 \uC18C\uAC1C"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 8,
      value: editing.authorBio || "",
      onChange: (e) => setField("authorBio", e.target.value),
      style: { fontSize: 14, lineHeight: 1.8 }
    }
  )), editTab === "reviews" && /* @__PURE__ */ React.createElement("div", null, (selected.reviews || []).length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uB4F1\uB85D\uB41C \uB9AC\uBDF0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.")) : (selected.reviews || []).map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, className: "card", style: { padding: 14, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "gold", style: { fontSize: 13 } }, "\u2605".repeat(r.rating || 5)), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, r.userName), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, window.BGNJ_FMT.kstDate(r.createdAt))), /* @__PURE__ */ React.createElement("p", { className: "ko-serif", style: { fontSize: 13, lineHeight: 1.7, margin: 0 } }, r.text)), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: async () => {
        if (!await window.BGNJ_CONFIRM("\uC774 \uB9AC\uBDF0\uB97C \uC0AD\uC81C\uD560\uAE4C\uC694?", { danger: true })) return;
        window.BGNJ_BOOKS.removeReview(selected.id, r.id);
        refresh();
      },
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC0AD\uC81C"
  ))), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 10, lineHeight: 1.5 } }, "\uB9AC\uBDF0\uB294 \uC0AC\uC6A9\uC790\uAC00 \uB3C4\uC11C \uC0C1\uC138 \uD398\uC774\uC9C0\uC5D0\uC11C \uC9C1\uC811 \uB4F1\uB85D\uD569\uB2C8\uB2E4. \uC5EC\uAE30\uC11C\uB294 \uBD80\uC801\uC808\uD55C \uB9AC\uBDF0\uB9CC \uC0AD\uC81C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.")), editing && editTab !== "reviews" && /* @__PURE__ */ React.createElement(AdminSaveBar, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-gold",
      onClick: commit,
      disabled: saving || !editing._isNew && !dirty
    },
    saving ? "\uC800\uC7A5 \uC911\u2026" : editing._isNew ? "\u{1F4BE} \uC0C8 \uCC45 \uC800\uC7A5" : dirty ? "\u{1F4BE} \uC800\uC7A5" : "\uC800\uC7A5\uB428 \u2713"
  ), editing._isNew && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: cancelDraft,
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC0C8 \uCC45 \uCDE8\uC18C"
  ), !editing._isNew && dirty && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: async () => {
        if (await window.BGNJ_CONFIRM("\uBCC0\uACBD \uC0AC\uD56D\uC744 \uBC84\uB9AC\uACE0 \uB9C8\uC9C0\uB9C9 \uC800\uC7A5 \uC2DC\uC810\uC73C\uB85C \uB418\uB3CC\uB9B4\uAE4C\uC694?", { danger: true })) {
          setEditing({ ...selected });
          setDirty(false);
        }
      }
    },
    "\uBCC0\uACBD \uCDE8\uC18C"
  ), /* @__PURE__ */ React.createElement("span", { className: "admin-savebar__spacer" }), /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11, color: editing._isNew ? "var(--primary)" : void 0 } }, editing._isNew ? "\u25CF \uC0C8 \uCC45 (\uBBF8\uC800\uC7A5 \u2014 [\u{1F4BE} \uC0C8 \uCC45 \uC800\uC7A5] \uD074\uB9AD \uC2DC D1 \uBC18\uC601)" : dirty ? "\u25CF \uBBF8\uC800\uC7A5 \uBCC0\uACBD \uC788\uC74C" : "\u25CB \uBAA8\uB4E0 \uBCC0\uACBD \uC800\uC7A5\uB428"))))));
};
const ErrorPagesPreviewPanel = ({ go }) => {
  const [active, setActive] = React.useState("404");
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    let count = 0;
    const id = setInterval(() => {
      if (window.Error404Page || count >= 5) {
        setTick((v) => v + 1);
        clearInterval(id);
      }
      count++;
    }, 100);
    return () => clearInterval(id);
  }, []);
  const variants = React.useMemo(() => [
    { k: "404", l: "404 \uD398\uC774\uC9C0 \uC5C6\uC74C", Comp: window.Error404Page },
    { k: "500", l: "500 \uC11C\uBC84 \uC624\uB958", Comp: window.Error500Page },
    { k: "403", l: "403 \uAD8C\uD55C \uBD80\uC871", Comp: window.Error403Page },
    { k: "401", l: "401 \uB85C\uADF8\uC778 \uD544\uC694", Comp: window.Error401Page },
    { k: "network", l: "\uB124\uD2B8\uC6CC\uD06C \uC624\uB958", Comp: window.ErrorNetworkPage },
    { k: "maintenance", l: "\uC810\uAC80 \uC911", Comp: window.ErrorMaintenancePage }
  ], [tick]);
  const current = variants.find((v) => v.k === active) || variants[0];
  const Preview = current.Comp;
  const previewGo = (route) => {
    try {
      console.warn("[preview] go(", route, ") \u2014 \uBBF8\uB9AC\uBCF4\uAE30\uC5D0\uC11C\uB294 \uC2E4\uC81C \uC774\uB3D9 \uC548 \uD568");
    } catch (e) {
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    AdminPanelHeader,
    {
      eyebrow: "ERROR PAGES \xB7 \uBBF8\uB9AC\uBCF4\uAE30",
      title: "\uC624\uB958 \uD398\uC774\uC9C0 \uBBF8\uB9AC\uBCF4\uAE30",
      description: "404 / 500 / 403 / 401 / \uB124\uD2B8\uC6CC\uD06C / \uC810\uAC80 \uC911 6\uC885\uC744 \uCE74\uB4DC\uB85C \uBBF8\uB9AC \uBD05\uB2C8\uB2E4. \uC77C\uB7EC\uC2A4\uD2B8\uB294 assets/errors/ \uC5D0 \uC704\uCE58 \u2014 \uD30C\uC77C \uB204\uB77D \uC2DC \u2708\uFE0F \uC774\uBAA8\uC9C0 \uD3F4\uBC31."
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "admin-toolbar" }, /* @__PURE__ */ React.createElement(
    AdminFilterChips,
    {
      ariaLabel: "\uC624\uB958 \uD398\uC774\uC9C0 \uC885\uB958",
      items: variants.map((v) => ({ key: v.k, label: v.l })),
      value: active,
      onChange: setActive
    }
  )), /* @__PURE__ */ React.createElement("div", { style: {
    border: "1px solid var(--line)",
    borderRadius: 8,
    overflow: "hidden",
    background: "var(--bg-2)",
    padding: 24,
    display: "grid",
    placeItems: "center"
  } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 14, alignSelf: "flex-start" } }, "PREVIEW \xB7 ", current.l), Preview ? (
    // v00.149 — embedded prop 으로 full-viewport wrapper 비활성 (preview 컨테이너에 fit).
    /* @__PURE__ */ React.createElement(Preview, { go: previewGo, embedded: true })
  ) : /* @__PURE__ */ React.createElement(AdminEmpty, null, "\uC624\uB958 \uD398\uC774\uC9C0 \uCEF4\uD3EC\uB10C\uD2B8 (", current.k, ") \uAC00 \uC544\uC9C1 \uB85C\uB4DC\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. ErrorPages.js \uAC00 \uCE90\uC2DC\uC5D0 \uC7A1\uD614\uB294\uC9C0 \uD655\uC778 \uD6C4 hard reload (Cmd+Shift+R) \uD574 \uC8FC\uC138\uC694.")), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 10, lineHeight: 1.7 } }, "\u24D8 \uBBF8\uB9AC\uBCF4\uAE30 \uC548\uC758 \uBC84\uD2BC\uC740 \uC2E4\uC81C \uB77C\uC6B0\uD305\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4 (\uCF58\uC194\uC5D0 \uB85C\uADF8\uB9CC \uCD9C\uB825). \uB77C\uC774\uBE0C \uD398\uC774\uC9C0\uC5D0\uC11C\uB294 \uC815\uC0C1 \uB3D9\uC791\uD569\uB2C8\uB2E4."));
};
const ErrorLogPanel = () => {
  const [errors, setErrors] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [codeFilter, setCodeFilter] = React.useState("all");
  const [loading, setLoading] = React.useState(false);
  const refresh = async () => {
    setLoading(true);
    try {
      const { errors: list } = await window.BGNJ_API.errorLog.list({ limit: 500 });
      setErrors(list || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    refresh();
  }, []);
  const codeOptions = React.useMemo(() => {
    const set = new Set(errors.map((e) => e.code).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [errors]);
  const filtered = React.useMemo(() => {
    let list = errors.slice();
    if (codeFilter !== "all") list = list.filter((e) => e.code === codeFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(
      (e) => String(e.message || "").toLowerCase().includes(q) || String(e.url || "").toLowerCase().includes(q) || String(e.pathname || "").toLowerCase().includes(q)
    );
    return list;
  }, [errors, codeFilter, search]);
  const clearAll = async () => {
    if (!await window.BGNJ_CONFIRM("\uBAA8\uB4E0 \uC624\uB958 \uB85C\uADF8\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C? (\uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC74C)", { danger: true })) return;
    try {
      await window.BGNJ_API.errorLog.clear();
      await refresh();
    } catch (err) {
      window.BGNJ_TOAST.error("\uC0AD\uC81C \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 14, lineHeight: 1.7 } }, "\uC0AC\uC774\uD2B8\uC5D0\uC11C \uBC1C\uC0DD\uD55C \uBAA8\uB4E0 \uD074\uB77C\uC774\uC5B8\uD2B8 \uC624\uB958\uAC00 D1.error_log \uC5D0 \uAE30\uB85D\uB429\uB2C8\uB2E4 (\uC778\uC99D/\uB124\uD2B8\uC6CC\uD06C/\uB80C\uB354\uB9C1/\uBBF8\uCC98\uB9AC promise). AI \uB610\uB294 \uC6B4\uC601\uC790\uAC00 \uC791\uC5C5\uC744 \uC2DC\uC791\uD560 \uB54C ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uC774 \uD328\uB110\uC744 \uAC00\uC7A5 \uBA3C\uC800 \uD655\uC778"), "\uD558\uC5EC \uBBF8\uD574\uACB0 \uC624\uB958\uB97C \uC6B0\uC120 \uCC98\uB9AC\uD558\uB294 \uAC83\uC774 \uC6D0\uCE59\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 14, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uBA54\uC2DC\uC9C0/URL \uAC80\uC0C9...",
      style: { flex: 1, minWidth: 240 },
      value: search,
      onChange: (e) => setSearch(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "field-input",
      style: { maxWidth: 200 },
      value: codeFilter,
      onChange: (e) => setCodeFilter(e.target.value)
    },
    codeOptions.map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c === "all" ? "\uC804\uCCB4 \uCF54\uB4DC" : c))
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: refresh, disabled: loading }, loading ? "\uBD88\uB7EC\uC624\uB294 \uC911..." : "\uC0C8\uB85C\uACE0\uCE68"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: clearAll,
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC804\uCCB4 \uC0AD\uC81C"
  ), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, "\uCD1D ", errors.length, "\uAC74 \xB7 \uD45C\uC2DC ", filtered.length, "\uAC74")), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto", border: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 980 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "10px 12px", textAlign: "left", width: 160 } }, "\uC2DC\uAC01"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "10px 12px", textAlign: "left", width: 140 } }, "\uCF54\uB4DC"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "10px 12px", textAlign: "left", width: 60 } }, "HTTP"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "10px 12px", textAlign: "left" } }, "\uBA54\uC2DC\uC9C0"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "10px 12px", textAlign: "left", width: 160 } }, "\uACBD\uB85C"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "10px 12px", textAlign: "left", width: 200 } }, "\uC694\uCCAD URL"))), /* @__PURE__ */ React.createElement("tbody", null, filtered.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 6, className: "dim", style: { padding: 32, textAlign: "center" } }, loading ? "\uBD88\uB7EC\uC624\uB294 \uC911..." : "\uC624\uB958 \uB85C\uADF8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.")) : filtered.map((e) => /* @__PURE__ */ React.createElement("tr", { key: e.id, style: { borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: "10px 12px", fontSize: 11, verticalAlign: "top" } }, e.ts ? window.BGNJ_FMT.kstDateTime(e.ts) : "-"), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: "10px 12px", fontSize: 11, verticalAlign: "top", color: "var(--danger)", letterSpacing: "0.1em" } }, e.code || "-"), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: "10px 12px", fontSize: 11, verticalAlign: "top" } }, e.status || "-"), /* @__PURE__ */ React.createElement("td", { style: { padding: "10px 12px", fontSize: 13, verticalAlign: "top", lineHeight: 1.6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 500 } }, e.message), e.hint && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, marginTop: 4 } }, e.hint)), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: "10px 12px", fontSize: 10, verticalAlign: "top", wordBreak: "break-all" } }, e.pathname || "-"), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: "10px 12px", fontSize: 10, verticalAlign: "top", wordBreak: "break-all" } }, e.url || "-")))))));
};
const SEOAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [og, setOg] = React.useState({ title: "", description: "", imageDataUri: "" });
  const [hero, setHero] = React.useState({ eyebrow: "", title1: "", title2: "", title3: "", subtitle: "" });
  const [brand, setBrand] = React.useState({ name: "", sub: "" });
  const [msg, setMsg] = React.useState("");
  const refresh = async () => {
    await window.BGNJ_SITE_CONTENT.refresh();
    const sc = window.BGNJ_SITE_CONTENT.get();
    setOg(sc.og || {});
    setHero(sc.hero || {});
    setBrand(sc.brand || {});
    setTick((v) => v + 1);
  };
  React.useEffect(() => {
    refresh();
  }, []);
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2400);
  };
  const save = async (section, data) => {
    var _a;
    try {
      await window.BGNJ_SITE_CONTENT.saveSection(section, data);
      flash("\u2713 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4. <head> \uBA54\uD0C0\uAC00 \uC989\uC2DC \uAC31\uC2E0\uB429\uB2C8\uB2E4.");
      await refresh();
    } catch (err) {
      flash("\u2717 \uC800\uC7A5 \uC2E4\uD328: " + (((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || (err == null ? void 0 : err.message) || ""));
    }
  };
  const onPickImage = async (e, section, field) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      flash("\u2717 \uC774\uBBF8\uC9C0\uAC00 \uB108\uBB34 \uD07D\uB2C8\uB2E4 (1.5MB \uC774\uD558 \uAD8C\uC7A5).");
      e.target.value = "";
      return;
    }
    const dataUri = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    if (section === "og") {
      const next = { ...og, [field]: dataUri };
      setOg(next);
      await save(section, next);
    }
    e.target.value = "";
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 18, lineHeight: 1.8 } }, "\uAC80\uC0C9\uC5D4\uC9C4\uACFC SNS \uACF5\uC720 \uBBF8\uB9AC\uBCF4\uAE30\uC5D0 \uC0AC\uC6A9\uB418\uB294 \uBA54\uD0C0\uB370\uC774\uD130\uB97C \uAD00\uB9AC\uD569\uB2C8\uB2E4. \uBCC0\uACBD \uC0AC\uD56D\uC740 \uC800\uC7A5 \uC989\uC2DC \uD398\uC774\uC9C0\uC758 ", /* @__PURE__ */ React.createElement("code", { className: "mono" }, "<head>"), " \uC5D0 \uBC18\uC601\uB429\uB2C8\uB2E4."), msg && /* @__PURE__ */ React.createElement("div", { role: "status", style: {
    marginBottom: 16,
    padding: "10px 14px",
    border: msg.startsWith("\u2717") ? "1px solid var(--danger)" : "1px solid var(--primary-dim)",
    background: msg.startsWith("\u2717") ? "rgba(194,74,61,0.06)" : "rgba(245,213,72,0.06)",
    color: msg.startsWith("\u2717") ? "var(--danger)" : "var(--primary)",
    fontSize: 13
  } }, msg), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10 } }, "OG \xB7 \uAC80\uC0C9\uC5D4\uC9C4 \uACF5\uC720 \uBA54\uD0C0"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 14, lineHeight: 1.7 } }, "\uCE74\uCE74\uC624\uD1A1/\uD398\uC774\uC2A4\uBD81/X \uACF5\uC720 \uC2DC \uB178\uCD9C\uB418\uB294 \uBBF8\uB9AC\uBCF4\uAE30 \uCE74\uB4DC\uC640 \uAC80\uC0C9\uC5D4\uC9C4 description."), /* @__PURE__ */ React.createElement("form", { onSubmit: (e) => {
    e.preventDefault();
    save("og", og);
  }, className: "card", style: { padding: 20, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "OG \uC81C\uBAA9 (\uAC80\uC0C9\xB7\uACF5\uC720 \uCE74\uB4DC \uC81C\uBAA9)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uBC45\uAE30\uB178\uC790 \u2014 \uBC45\uAE30 \uD0C0\uACE0 \uD55C\uAD6D\uC744 \uB290\uB07C\uB2E4",
      value: og.title || "",
      onChange: (e) => setOg({ ...og, title: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "OG \uC124\uBA85 (\uAC80\uC0C9\xB7\uACF5\uC720 \uCE74\uB4DC \uBCF8\uBB38)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 3,
      placeholder: "\uAD81\uAD90 \uB2F5\uC0AC\uBD80\uD130 \uC9C0\uC5ED \uC5EC\uD589\uAE4C\uC9C0, \uD55C\uAD6D\uC758 \uC5ED\uC0AC\xB7\uBB38\uD654\xB7\uC790\uC5F0\uC744 \uD568\uAED8 \uC5EC\uD589\uD558\uB294 \uCEE4\uBBA4\uB2C8\uD2F0.",
      value: og.description || "",
      onChange: (e) => setOg({ ...og, description: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "OG \uC774\uBBF8\uC9C0 (1200\xD7630 \uAD8C\uC7A5 \xB7 1.5MB \uC774\uD558)"), og.imageDataUri && /* @__PURE__ */ React.createElement(
    "img",
    {
      src: og.imageDataUri,
      alt: "OG preview",
      style: { display: "block", maxWidth: 240, maxHeight: 126, marginBottom: 8, border: "1px solid var(--line)" }
    }
  ), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/png,image/jpeg", onChange: (e) => onPickImage(e, "og", "imageDataUri") }), og.imageDataUri && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn-ghost",
      style: { fontSize: 11, color: "var(--danger)", marginTop: 6 },
      onClick: () => save("og", { ...og, imageDataUri: "" })
    },
    "\uC774\uBBF8\uC9C0 \uC81C\uAC70"
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 14 } }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold" }, "OG \uC800\uC7A5"))), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10 } }, "\uD398\uC774\uC9C0 \uC0C1\uB2E8 (Hero)"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 14, lineHeight: 1.7 } }, "\uD648\uD398\uC774\uC9C0 \uCCAB \uD654\uBA74\uC758 \uD070 \uC81C\uBAA9\uACFC \uBD80\uC81C. \uAC80\uC0C9\uC5D4\uC9C4\uC758 \uD398\uC774\uC9C0 \uBCF8\uBB38 \uCCAB \uC778\uC0C1\uC5D0 \uC0AC\uC6A9\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("form", { onSubmit: (e) => {
    e.preventDefault();
    save("hero", hero);
  }, className: "card", style: { padding: 20, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC0C1\uB2E8 \uB77C\uBCA8 (\uB300\uBB38\uC790 \uAD8C\uC7A5)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "BANGINOJA \xB7 \uBC45\uAE30\uD0C0\uACE0 \uB178\uC790",
      value: hero.eyebrow || "",
      onChange: (e) => setHero({ ...hero, eyebrow: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC81C\uBAA9 1\uD589"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: hero.title1 || "", onChange: (e) => setHero({ ...hero, title1: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC81C\uBAA9 2\uD589"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: hero.title2 || "", onChange: (e) => setHero({ ...hero, title2: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC81C\uBAA9 3\uD589"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: hero.title3 || "", onChange: (e) => setHero({ ...hero, title3: e.target.value }) }))), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBD80\uC81C (Hero subtitle)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 2,
      value: hero.subtitle || "",
      onChange: (e) => setHero({ ...hero, subtitle: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 14 } }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold" }, "Hero \uC800\uC7A5"))), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10 } }, "\uBE0C\uB79C\uB4DC \uC774\uB984"), /* @__PURE__ */ React.createElement("form", { onSubmit: (e) => {
    e.preventDefault();
    save("brand", brand);
  }, className: "card", style: { padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBE0C\uB79C\uB4DC\uBA85 (\uD55C\uAE00)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uBC45\uAE30\uB178\uC790",
      value: brand.name || "",
      onChange: (e) => setBrand({ ...brand, name: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC11C\uBE0C (\uC601\uBB38/\uC57D\uC5B4)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "BANGINOJA",
      value: brand.sub || "",
      onChange: (e) => setBrand({ ...brand, sub: e.target.value })
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 14 } }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold" }, "\uBE0C\uB79C\uB4DC \uC800\uC7A5"))));
};
const SearchConsoleAdminPanel = () => {
  const [data, setData] = React.useState({
    google: "",
    naver: "",
    bing: "",
    yandex: "",
    sitemapUrl: "",
    lastUpdated: ""
  });
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2400);
  };
  const refresh = React.useCallback(async () => {
    var _a, _b;
    try {
      await window.BGNJ_SITE_CONTENT.refresh();
    } catch (e) {
    }
    const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
    const cur = sc.searchConsole || {};
    const origin = typeof location !== "undefined" ? location.origin : "https://bgnj.net";
    setData({
      google: cur.google || "",
      naver: cur.naver || "",
      bing: cur.bing || "",
      yandex: cur.yandex || "",
      sitemapUrl: cur.sitemapUrl || `${origin}/sitemap.xml`,
      lastUpdated: cur.lastUpdated || ""
    });
    setDirty(false);
  }, []);
  React.useEffect(() => {
    refresh();
  }, [refresh]);
  const setField = (k, v) => {
    setData((cur) => ({ ...cur, [k]: v }));
    setDirty(true);
  };
  const save = async () => {
    var _a;
    if (saving) return;
    setSaving(true);
    try {
      const next = { ...data, lastUpdated: (/* @__PURE__ */ new Date()).toISOString() };
      await window.BGNJ_SITE_CONTENT.saveSection("searchConsole", next);
      try {
        window.BGNJ_SITE_CONTENT.applyHead();
      } catch (e) {
      }
      setData(next);
      setDirty(false);
      flash("\u2713 \uC800\uC7A5\uB428 \u2014 <head> \uAC80\uC99D meta \uC989\uC2DC \uAC31\uC2E0");
    } catch (err) {
      flash("\u2717 \uC800\uC7A5 \uC2E4\uD328: " + (((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || (err == null ? void 0 : err.message) || ""));
    } finally {
      setSaving(false);
    }
  };
  const pingGoogleSitemap = () => {
    if (!data.sitemapUrl) {
      flash("\u2717 sitemap URL \uC774 \uC5C6\uC2B5\uB2C8\uB2E4");
      return;
    }
    try {
      fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(data.sitemapUrl)}`, { mode: "no-cors" }).catch(() => {
      });
      flash("\u2713 Google \uC5D0 sitemap ping \uC694\uCCAD (\uC751\uB2F5\uC740 Search Console \uC5D0\uC11C \uD655\uC778)");
    } catch (err) {
      flash("\u2717 ping \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    }
  };
  const openConsole = (url) => {
    try {
      window.open(url, "_blank", "noopener");
    } catch (e) {
    }
  };
  const lastUpdLabel = data.lastUpdated ? window.BGNJ_FMT.kstDateTime(data.lastUpdated) : "\uC800\uC7A5 \uC774\uB825 \uC5C6\uC74C";
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 18, lineHeight: 1.8 } }, "\uAC80\uC0C9\uC5D4\uC9C4 \uC0AC\uC774\uD2B8 \uC18C\uC720 \uD655\uC778\uC6A9 meta tag \uB97C \uC785\uB825\uD569\uB2C8\uB2E4. \uC800\uC7A5 \uC989\uC2DC ", /* @__PURE__ */ React.createElement("code", { className: "mono" }, "<head>"), ' \uC5D0 \uC8FC\uC785\uB418\uBA70, \uAC01 \uAC80\uC0C9 \uCF58\uC194 \uC0AC\uC774\uD2B8\uC758 "HTML \uD0DC\uADF8" \uAC80\uC99D \uBC29\uBC95\uC744 \uD1B5\uACFC\uD569\uB2C8\uB2E4.'), msg && /* @__PURE__ */ React.createElement("div", { role: "status", style: {
    marginBottom: 16,
    padding: "10px 14px",
    border: msg.startsWith("\u2717") ? "1px solid var(--danger)" : "1px solid var(--primary-dim)",
    background: msg.startsWith("\u2717") ? "rgba(194,74,61,0.06)" : "rgba(245,213,72,0.06)",
    color: msg.startsWith("\u2717") ? "var(--danger)" : "var(--primary)",
    fontSize: 13
  } }, msg), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, marginBottom: 14 } }, "\uAC80\uC99D \uCF54\uB4DC (HTML \uD0DC\uADF8 \uBC29\uC2DD)"), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "Google Search Console \u2014 ", /* @__PURE__ */ React.createElement("code", { className: "mono" }, '<meta name="google-site-verification" content="...">')), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC608: 8R9z4...... (content \uAC12\uB9CC \uC785\uB825)",
      value: data.google,
      onChange: (e) => setField("google", e.target.value.trim())
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => openConsole("https://search.google.com/search-console") }, "\u2197 Search Console \uC5F4\uAE30"))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "Naver Search Advisor \u2014 ", /* @__PURE__ */ React.createElement("code", { className: "mono" }, '<meta name="naver-site-verification" content="...">')), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC608: a1b2c3d4......",
      value: data.naver,
      onChange: (e) => setField("naver", e.target.value.trim())
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => openConsole("https://searchadvisor.naver.com/") }, "\u2197 Search Advisor \uC5F4\uAE30"))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "Bing Webmaster \u2014 ", /* @__PURE__ */ React.createElement("code", { className: "mono" }, '<meta name="msvalidate.01" content="...">')), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC608: A1B2C3......",
      value: data.bing,
      onChange: (e) => setField("bing", e.target.value.trim())
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => openConsole("https://www.bing.com/webmasters") }, "\u2197 Bing Webmaster \uC5F4\uAE30"))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "Yandex Webmaster \u2014 ", /* @__PURE__ */ React.createElement("code", { className: "mono" }, '<meta name="yandex-verification" content="...">')), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "(\uC120\uD0DD) \uC608: 1234abcd......",
      value: data.yandex,
      onChange: (e) => setField("yandex", e.target.value.trim())
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => openConsole("https://webmaster.yandex.com/") }, "\u2197 Yandex \uC5F4\uAE30")))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, marginBottom: 14 } }, "Sitemap & \uC778\uB371\uC2F1 \uCD5C\uC2E0\uD654"), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "Sitemap URL"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "https://bgnj.net/sitemap.xml",
      value: data.sitemapUrl,
      onChange: (e) => setField("sitemapUrl", e.target.value.trim())
    }
  ), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 6, lineHeight: 1.6 } }, "Google / Naver \uCF58\uC194\uC5D0 \uB3D9\uC77C\uD55C URL \uC744 \uB4F1\uB85D\uD558\uC138\uC694. \uBBF8\uB4F1\uB85D \uC2DC \uC0C9\uC778 \uB204\uB77D \uAC00\uB2A5.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: pingGoogleSitemap }, "\u{1F514} Google \uC5D0 sitemap \uBCC0\uACBD \uC54C\uB9BC (ping)"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => openConsole(`https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(typeof location !== "undefined" ? location.origin : "https://bgnj.net")}`)
    },
    "\u2197 Google Sitemap \uD398\uC774\uC9C0 \uC5F4\uAE30"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => openConsole("https://searchadvisor.naver.com/console/board")
    },
    "\u2197 Naver \uC0AC\uC774\uD2B8\uB9F5 \uCF58\uC194 \uC5F4\uAE30"
  )), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 10, lineHeight: 1.6 } }, "\u203B Naver \uB294 \uC9C1\uC811 ping \uC5D4\uB4DC\uD3EC\uC778\uD2B8 \uBBF8\uACF5\uC2DD \u2014 \uCF58\uC194\uC5D0\uC11C \uC218\uB3D9 \uB4F1\uB85D \uD544\uC694. Bing \uC740 Google \uACFC \uC0C9\uC778 \uACF5\uC720.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uB9C8\uC9C0\uB9C9 \uC800\uC7A5: ", lastUpdLabel), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }), dirty && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: refresh }, "\uBCC0\uACBD \uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: save, disabled: saving || !dirty }, saving ? "\uC800\uC7A5 \uC911\u2026" : dirty ? "\u{1F4BE} \uC800\uC7A5" : "\uC800\uC7A5\uB428 \u2713")));
};
const AuditLogPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const refresh = () => setTick((v) => v + 1);
  const list = React.useMemo(() => {
    var _a, _b;
    return ((_b = (_a = window.BGNJ_AUDIT) == null ? void 0 : _a.list) == null ? void 0 : _b.call(_a, { search, limit: 200 })) || [];
  }, [search, tick]);
  const exportCsv = () => {
    const all = window.BGNJ_AUDIT.list({ limit: 1e3 });
    const header = ["id", "ts", "action", "target", "by", "details"];
    const rows = all.map((e) => [e.id, e.ts, e.action, e.target, e.by, e.details ? JSON.stringify(e.details) : ""]);
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c != null ? c : "").replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadCsv(`audit-log-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, csv);
  };
  const clear = async () => {
    if (!await window.BGNJ_CONFIRM("\uAC10\uC0AC \uB85C\uADF8 \uC804\uCCB4\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694? \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", { danger: true })) return;
    window.BGNJ_AUDIT.clear();
    refresh();
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    AdminPanelHeader,
    {
      eyebrow: "AUDIT \xB7 \uAC10\uC0AC \uB85C\uADF8",
      title: "\uC6B4\uC601\uC790 \uC561\uC158 \uC774\uB825",
      description: "\uC6B4\uC601\uC790\uAC00 \uD68C\uC6D0\xB7\uAC15\uC5F0\xB7\uD22C\uC5B4\xB7\uCC45 \uC8FC\uBB38\uC5D0 \uB300\uD574 \uD589\uD55C \uBCC0\uACBD\uC774 \uC2DC\uAC01\uC21C\uC73C\uB85C \uAE30\uB85D\uB429\uB2C8\uB2E4. \uCD5C\uADFC 500\uAC74\uAE4C\uC9C0 \uBCF4\uAD00, \uC815\uC9C0\xB7\uC0AD\uC81C\xB7\uC785\uAE08 \uD655\uC778\xB7\uBC1C\uC1A1\xB7\uB4F1\uAE09 \uBCC0\uACBD \uB4F1 \uD575\uC2EC \uC561\uC158 \uC790\uB3D9 \uAE30\uB85D.",
      actions: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: exportCsv }, "CSV \uB2E4\uC6B4\uB85C\uB4DC"), /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          className: "btn btn-small",
          onClick: clear,
          style: { borderColor: "var(--danger)", color: "var(--danger)" }
        },
        "\uC804\uCCB4 \uC0AD\uC81C"
      ))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "admin-toolbar" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC561\uC158 / \uB300\uC0C1 / \uC791\uC5C5\uC790 \uAC80\uC0C9...",
      style: { flex: 1, minWidth: 240 },
      value: search,
      onChange: (e) => setSearch(e.target.value)
    }
  )), list.length === 0 ? /* @__PURE__ */ React.createElement(AdminEmpty, null, "\uD45C\uC2DC\uD560 \uAC10\uC0AC \uB85C\uADF8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { className: "admin-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "admin-table", style: { fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { width: 170 } }, "\uC2DC\uAC01"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { width: 220 } }, "\uC561\uC158"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, "\uB300\uC0C1"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, "\uC791\uC5C5\uC790"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, "\uC138\uBD80"))), /* @__PURE__ */ React.createElement("tbody", null, list.map((e) => /* @__PURE__ */ React.createElement("tr", { key: e.id }, /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { fontSize: 11 } }, window.BGNJ_FMT.kstDateTime(e.ts)), /* @__PURE__ */ React.createElement("td", { className: "mono gold", style: { fontSize: 11 } }, e.action), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { fontSize: 11 } }, e.target), /* @__PURE__ */ React.createElement("td", { style: { fontSize: 12 } }, e.by), /* @__PURE__ */ React.createElement("td", { style: { fontSize: 11, lineHeight: 1.6 } }, /* @__PURE__ */ React.createElement(AuditDetailsCell, { details: e.details }))))))), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11, marginTop: 12, textAlign: "right" } }, "\uD45C\uC2DC ", list.length, "\uAC74 (\uC804\uCCB4 \uCD5C\uADFC 500\uAC74 \uC911)"));
};
const PostViewerModal = ({ postId, onClose }) => {
  var _a, _b, _c, _d;
  const [post, setPost] = React.useState(() => {
    var _a2, _b2;
    return ((_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.getPost) == null ? void 0 : _b2.call(_a2, postId)) || null;
  });
  const [comments, setComments] = React.useState(() => {
    var _a2, _b2;
    return ((_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.getComments) == null ? void 0 : _b2.call(_a2, postId)) || [];
  });
  (_a = window.useModalGuard) == null ? void 0 : _a.call(window, { open: true, dirty: false, onClose, onSaveDraft: null, label: "\uAC8C\uC2DC\uAE00 \uBCF4\uAE30" });
  React.useEffect(() => {
    var _a2, _b2;
    try {
      (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.refreshComments) == null ? void 0 : _b2.call(_a2, postId).then(() => {
        setComments(window.BGNJ_COMMUNITY.getComments(postId));
      });
    } catch (e) {
    }
  }, [postId]);
  if (!post) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        onClick: onClose,
        style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1e3, display: "grid", placeItems: "center", padding: 24 }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: { background: "var(--bg)", maxWidth: 520, width: "100%", padding: 28, border: "1px solid var(--line)" }
        },
        /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 14, marginBottom: 16 } }, "\uD574\uB2F9 \uAC8C\uC2DC\uAE00\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."),
        /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: onClose }, "\uB2EB\uAE30"))
      )
    );
  }
  const likes = Array.isArray(post.likes) ? post.likes.length : 0;
  const tagList = post.tags || [];
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": post.title,
      onClick: onClose,
      style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1e3, display: "grid", placeItems: "center", padding: 24 }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => e.stopPropagation(),
        style: {
          background: "var(--bg)",
          width: "100%",
          maxWidth: 860,
          maxHeight: "88vh",
          overflow: "auto",
          padding: "28px 32px",
          border: "1px solid var(--line)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.25)"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 11, letterSpacing: "0.18em" } }, "POST \xB7 #", String(post.id).padStart(4, "0")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onClose, "aria-label": "\uB2EB\uAE30" }, "\uB2EB\uAE30")),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "badge badge-gold" }, post.category), post.prefix && /* @__PURE__ */ React.createElement("span", { className: "badge" }, post.prefix), post.hot && /* @__PURE__ */ React.createElement("span", { className: "badge" }, "HOT")),
      /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 26, lineHeight: 1.3, marginBottom: 14 } }, post.title),
      tagList.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 } }, tagList.map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "tag-chip" }, "#", t))),
      /* @__PURE__ */ React.createElement("div", { style: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12,
        padding: "12px 14px",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        marginBottom: 18,
        fontSize: 12
      } }, [
        ["\uC791\uC131\uC790", post.author || "-"],
        ["\uC791\uC131\uC77C", post.date || (post.createdAt ? window.BGNJ_FMT.kstDateTime(post.createdAt) : "-")],
        ["\uC870\uD68C", (_b = post.views) != null ? _b : 0],
        ["\uACF5\uAC10", likes],
        ["\uB313\uAE00", comments.length]
      ].map(([label, value]) => /* @__PURE__ */ React.createElement("div", { key: label }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.14em", marginBottom: 4 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13 } }, value)))),
      /* @__PURE__ */ React.createElement("div", { className: "post-body", style: {
        padding: "18px 4px",
        borderTop: "1px solid var(--line)",
        fontFamily: "var(--font-reading)",
        fontSize: 15,
        lineHeight: 1.85,
        color: "var(--ink)"
      } }, ((_c = post.body) == null ? void 0 : _c.html) ? /* @__PURE__ */ React.createElement("div", { dangerouslySetInnerHTML: { __html: window.BGNJ_SAFE_HTML(post.body.html) } }) : ((_d = post.body) == null ? void 0 : _d.text) ? /* @__PURE__ */ React.createElement("div", { style: { whiteSpace: "pre-wrap" } }, post.body.text) : /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontStyle: "italic" } }, "(\uBCF8\uBB38 \uC5C6\uC74C)")),
      Array.isArray(post.images) && post.images.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 10 } }, "ATTACHMENTS \xB7 ", post.images.length), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 } }, post.images.map((src, i) => /* @__PURE__ */ React.createElement(
        "a",
        {
          key: i,
          href: src,
          target: "_blank",
          rel: "noreferrer",
          style: { border: "1px solid var(--line)", display: "block" }
        },
        /* @__PURE__ */ React.createElement("img", { src, alt: "", style: { display: "block", width: "100%", height: 120, objectFit: "cover" } })
      )))),
      /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 10 } }, "COMMENTS \xB7 ", comments.length), comments.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 13 } }, "\uC544\uC9C1 \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 } }, comments.map((c) => /* @__PURE__ */ React.createElement("li", { key: c.id, style: { padding: "10px 12px", background: "var(--bg-2)", border: "1px solid var(--line)", fontSize: 13 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 11, letterSpacing: "0.1em" } }, c.parentId ? "\u21B3 " : "", c.author || "-"), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, c.date || (c.createdAt ? window.BGNJ_FMT.kstDateTime(c.createdAt) : ""))), /* @__PURE__ */ React.createElement("div", { style: { lineHeight: 1.7, whiteSpace: "pre-wrap" } }, c.text || c.body || "-")))))
    )
  );
};
const SuspendDialog = ({ target, reason, onChange, onConfirm, onCancel }) => {
  var _a;
  (_a = window.useModalGuard) == null ? void 0 : _a.call(window, { open: true, dirty: false, onClose: onCancel, onSaveDraft: null, label: "\uD68C\uC6D0 \uC815\uC9C0" });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "\uD68C\uC6D0 \uC815\uC9C0",
      onClick: onCancel,
      style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1e3, display: "grid", placeItems: "center", padding: 24 }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => e.stopPropagation(),
        style: { background: "var(--bg)", maxWidth: 480, width: "100%", padding: 24, border: "1px solid var(--line)", boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }
      },
      /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 8 } }, "\uD68C\uC6D0 \uC815\uC9C0"),
      /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 16, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("strong", { className: "gold" }, (target == null ? void 0 : target.name) || (target == null ? void 0 : target.email)), " \uB2D8\uC744 \uC815\uC9C0\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C? \uC815\uC9C0\uB41C \uD68C\uC6D0\uC740 \uC989\uC2DC \uB85C\uADF8\uC544\uC6C3\uB418\uACE0 \uB2E4\uC2DC \uB85C\uADF8\uC778\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."),
      /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uC815\uC9C0 \uC0AC\uC720 (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(
        "textarea",
        {
          className: "field-input",
          autoFocus: true,
          rows: 3,
          placeholder: "\uC608: \uC57D\uAD00 \uC704\uBC18, \uC2A4\uD338 \uB4F1",
          value: reason,
          onChange: (e) => onChange(e.target.value)
        }
      )),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: onCancel }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          className: "btn",
          onClick: onConfirm,
          style: { borderColor: "var(--danger)", color: "var(--danger)" }
        },
        "\uC815\uC9C0 \uC801\uC6A9"
      ))
    )
  );
};
const AuditDetailsCell = ({ details }) => {
  if (!details || typeof details === "object" && !Object.keys(details).length) {
    return /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\u2014");
  }
  if (typeof details !== "object") {
    return /* @__PURE__ */ React.createElement("span", { className: "mono dim" }, String(details));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, Object.entries(details).map(([k, v]) => /* @__PURE__ */ React.createElement("span", { key: k, style: {
    display: "inline-flex",
    gap: 4,
    alignItems: "baseline",
    padding: "2px 8px",
    background: "var(--bg-2)",
    border: "1px solid var(--line)",
    fontSize: 11
  } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.1em" } }, k), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink)" } }, typeof v === "object" ? JSON.stringify(v) : String(v)))));
};
const PROFILE_LABELS = {
  birthdate: "\uC0DD\uB144\uC6D4\uC77C",
  phone: "\uC804\uD654\uBC88\uD638",
  zip: "\uC6B0\uD3B8\uBC88\uD638",
  addr1: "\uC8FC\uC18C",
  addr2: "\uC0C1\uC138 \uC8FC\uC18C",
  gender: "\uC131\uBCC4",
  interest: "\uAD00\uC2EC \uBD84\uC57C",
  recommender: "\uCD94\uCC9C\uC778"
};
const PROFILE_GENDER = { f: "\uC5EC\uC131", m: "\uB0A8\uC131", x: "\uAE30\uD0C0/\uC751\uB2F5 \uC548 \uD568" };
const ProfileFields = ({ profile }) => {
  const entries = Object.entries(profile || {});
  if (!entries.length) return /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\u2014");
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: "8px 16px",
    padding: "12px 14px",
    background: "var(--bg-2)",
    border: "1px solid var(--line)",
    fontSize: 13
  } }, entries.map(([k, v]) => {
    const label = PROFILE_LABELS[k] || k;
    let value = v;
    if (k === "gender" && v) value = PROFILE_GENDER[v] || v;
    const isEmpty = value === "" || value == null;
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: k }, /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11, paddingTop: 2 } }, label), /* @__PURE__ */ React.createElement("div", { style: { color: isEmpty ? "var(--ink-3)" : "var(--ink)", fontStyle: isEmpty ? "italic" : "normal" } }, isEmpty ? "\u2014" : String(value)));
  }));
};
const MemberAdminPanel = ({ go }) => {
  var _a;
  const [tick, setTick] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [gradeFilter, setGradeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortKey, setSortKey] = React.useState("joined_desc");
  const refresh = () => setTick((v) => v + 1);
  React.useEffect(() => {
    var _a2, _b;
    (_b = (_a2 = window.BGNJ_AUTH).refreshUsers) == null ? void 0 : _b.call(_a2).then(() => refresh());
    const onRefresh = () => refresh();
    window.addEventListener("bgnj-users-refresh", onRefresh);
    return () => window.removeEventListener("bgnj-users-refresh", onRefresh);
  }, []);
  const users = React.useMemo(() => window.BGNJ_AUTH.listUsers(), [tick]);
  const grades = ((_a = window.BGNJ_STORES) == null ? void 0 : _a.grades) || [];
  const filtered = React.useMemo(() => {
    let list = users.slice();
    if (statusFilter === "active") list = list.filter((u) => !u.suspended);
    else if (statusFilter === "suspended") list = list.filter((u) => u.suspended);
    else if (statusFilter === "admin") list = list.filter((u) => u.isAdmin);
    if (gradeFilter !== "all") {
      list = list.filter((u) => u.gradeId === gradeFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) => String(u.name || "").toLowerCase().includes(q) || String(u.email || "").toLowerCase().includes(q) || String(u.id || "").toLowerCase().includes(q)
      );
    }
    const cmpStr = (a, b) => String(a || "").localeCompare(String(b || ""), "ko");
    const cmpDate = (a, b) => new Date(b || 0).getTime() - new Date(a || 0).getTime();
    const activityCount = (u, key) => {
      var _a2, _b;
      const a = (_b = (_a2 = window.BGNJ_AUTH).getActivity) == null ? void 0 : _b.call(_a2, u.id);
      return (a == null ? void 0 : a[key]) || 0;
    };
    list.sort((a, b) => {
      var _a2, _b, _c, _d;
      switch (sortKey) {
        case "joined_asc":
          return -cmpDate(a.joinedAt, b.joinedAt);
        case "name_asc":
          return cmpStr(a.name, b.name);
        case "name_desc":
          return -cmpStr(a.name, b.name);
        case "email_asc":
          return cmpStr(a.email, b.email);
        case "posts_desc":
          return activityCount(b, "postCount") - activityCount(a, "postCount");
        case "comments_desc":
          return activityCount(b, "commentCount") - activityCount(a, "commentCount");
        case "grade_desc":
          return ((_b = (_a2 = grades.find((g) => g.id === b.gradeId)) == null ? void 0 : _a2.level) != null ? _b : 0) - ((_d = (_c = grades.find((g) => g.id === a.gradeId)) == null ? void 0 : _c.level) != null ? _d : 0);
        case "joined_desc":
        default:
          return cmpDate(a.joinedAt, b.joinedAt);
      }
    });
    return list;
  }, [users, gradeFilter, statusFilter, search, sortKey, grades, tick]);
  const selected = users.find((u) => u.id === selectedId) || null;
  const [serverActivity, setServerActivity] = React.useState(null);
  React.useEffect(() => {
    var _a2, _b;
    let cancelled = false;
    setServerActivity(null);
    if (!(selected == null ? void 0 : selected.id)) return () => {
    };
    Promise.resolve((_b = (_a2 = window.BGNJ_AUTH).fetchActivity) == null ? void 0 : _b.call(_a2, selected.id)).then((a) => {
      if (!cancelled) setServerActivity(a);
    });
    return () => {
      cancelled = true;
    };
  }, [selected == null ? void 0 : selected.id]);
  const activity = selected ? serverActivity || window.BGNJ_AUTH.getActivity(selected.id) : null;
  const exportCsv = () => {
    const header = ["id", "name", "email", "gradeId", "isAdmin", "suspended", "joinedAt", "postCount", "commentCount", "bookOrders", "lectures", "tours"];
    const rows = users.map((u) => {
      const a = window.BGNJ_AUTH.getActivity(u.id) || {};
      return [u.id, u.name, u.email, u.gradeId, u.isAdmin ? "Y" : "N", u.suspended ? "Y" : "N", u.joinedAt || "", a.postCount || 0, a.commentCount || 0, (a.bookOrders || []).length, (a.lectures || []).length, (a.tours || []).length];
    });
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c != null ? c : "").replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadCsv(`members-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, csv);
  };
  const changeGrade = async (user, gradeId) => {
    try {
      await window.BGNJ_AUTH.setGrade(user.id, gradeId);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error(`\uB4F1\uAE09 \uBCC0\uACBD \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
    }
  };
  const toggleAdmin = async (user) => {
    if (!await window.BGNJ_CONFIRM(`${user.name} \uB2D8\uC758 \uAD00\uB9AC\uC790 \uAD8C\uD55C\uC744 ${user.isAdmin ? "\uD574\uC81C" : "\uBD80\uC5EC"}\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
    try {
      await window.BGNJ_AUTH.toggleAdmin(user.id);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error(`\uAD00\uB9AC\uC790 \uAD8C\uD55C \uBCC0\uACBD \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
    }
  };
  const [suspendTarget, setSuspendTarget] = React.useState(null);
  const [suspendReason, setSuspendReason] = React.useState("");
  const openSuspendDialog = (user) => {
    setSuspendTarget(user);
    setSuspendReason("");
  };
  const submitSuspend = async () => {
    if (!suspendTarget) return;
    const target = suspendTarget;
    const reason = suspendReason.trim();
    setSuspendTarget(null);
    setSuspendReason("");
    try {
      await window.BGNJ_AUTH.suspendUser(target.id, reason);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error(`\uC815\uC9C0 \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
    }
  };
  const suspendUser = (user) => openSuspendDialog(user);
  const unsuspend = async (user) => {
    if (!await window.BGNJ_CONFIRM(`${user.name} \uB2D8\uC758 \uC815\uC9C0\uB97C \uD574\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
    try {
      await window.BGNJ_AUTH.unsuspendUser(user.id);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error(`\uC815\uC9C0 \uD574\uC81C \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
    }
  };
  const deleteUser = async (user) => {
    if (user.email === "admin@admin.admin") {
      window.BGNJ_TOAST.error("\uAE30\uBCF8 \uAD00\uB9AC\uC790 \uACC4\uC815\uC740 \uC0AD\uC81C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return;
    }
    if (!await window.BGNJ_CONFIRM(`${user.name} (${user.email}) \uACC4\uC815\uC744 \uC815\uB9D0 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694? \uC774 \uC791\uC5C5\uC740 \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.`, { danger: true })) return;
    try {
      await window.BGNJ_AUTH.removeUser(user.id);
      setSelectedId(null);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error(`\uC0AD\uC81C \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
    }
  };
  const gradeOf = (id) => grades.find((g) => g.id === id);
  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      return window.BGNJ_FMT.kstDateTime(iso);
    } catch (e) {
      return iso;
    }
  };
  if (selected && activity) {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setSelectedId(null), style: { marginBottom: 20 } }, "\u2190 \uD68C\uC6D0 \uBAA9\uB85D"), /* @__PURE__ */ React.createElement("article", { className: "card", style: { padding: 24, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 24, marginBottom: 4 } }, selected.name, /* @__PURE__ */ React.createElement(AuthorGradeBadge, { authorId: selected.id, author: selected.name, authorEmail: selected.email })), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 11 } }, "#", selected.id, " \xB7 ", selected.email)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, selected.isAdmin && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.18em", color: "var(--secondary)", border: "1px solid var(--primary-dim)", padding: "2px 8px" } }, "ADMIN"), selected.suspended && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.18em", color: "var(--danger)", border: "1px solid var(--danger)", padding: "2px 8px" } }, "SUSPENDED"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "180px 1fr", gap: "8px 24px", fontSize: 13, lineHeight: 1.8 } }, /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uAC00\uC785\uC77C"), /* @__PURE__ */ React.createElement("dd", null, formatDate(selected.joinedAt)), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uD68C\uC6D0 \uB4F1\uAE09"), /* @__PURE__ */ React.createElement("dd", null, /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "field-input",
        style: { maxWidth: 240, padding: "4px 8px" },
        value: selected.gradeId || "",
        onChange: (e) => changeGrade(selected, e.target.value)
      },
      grades.map((g) => /* @__PURE__ */ React.createElement("option", { key: g.id, value: g.id }, g.label, " (Lv ", g.level, ")"))
    ), selected.gradeChangedAt && /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10, marginLeft: 8 } }, "\uCD5C\uADFC \uBCC0\uACBD ", formatDate(selected.gradeChangedAt))), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uAD00\uB9AC\uC790 \uAD8C\uD55C"), /* @__PURE__ */ React.createElement("dd", null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => toggleAdmin(selected) }, selected.isAdmin ? "\uAD00\uB9AC\uC790 \uAD8C\uD55C \uD574\uC81C" : "\uAD00\uB9AC\uC790 \uAD8C\uD55C \uBD80\uC5EC")), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uD65C\uC131 \uB3D9\uC758"), /* @__PURE__ */ React.createElement("dd", null, (() => {
      const labels = { terms: "\uC774\uC6A9\uC57D\uAD00\xB7\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68", marketing: "\uB9C8\uCF00\uD305 \uBA54\uC77C", thirdParty: "\uC81C3\uC790 \uC81C\uACF5" };
      const active = selected.consents ? Object.entries(selected.consents).filter(([, v]) => v) : [];
      if (!active.length) return /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\u2014");
      return active.map(([k]) => /* @__PURE__ */ React.createElement("span", { key: k, className: "badge", style: { marginRight: 6, fontSize: 11 } }, labels[k] || k));
    })()), selected.profile && Object.keys(selected.profile).length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uD504\uB85C\uD544"), /* @__PURE__ */ React.createElement("dd", null, /* @__PURE__ */ React.createElement(ProfileFields, { profile: selected.profile }))), selected.suspended && selected.suspendedReason && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uC815\uC9C0 \uC0AC\uC720"), /* @__PURE__ */ React.createElement("dd", { className: "dim" }, selected.suspendedReason))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" } }, selected.suspended ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => unsuspend(selected) }, "\uC815\uC9C0 \uD574\uC81C") : /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => suspendUser(selected),
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uACC4\uC815 \uC815\uC9C0"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => deleteUser(selected),
        style: { borderColor: "var(--danger)", color: "var(--danger)", marginLeft: "auto" }
      },
      "\uACC4\uC815 \uC0AD\uC81C"
    ))), /* @__PURE__ */ React.createElement("article", { className: "card", style: { padding: 20, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "ACTIVITY"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 } }, [
      { l: "\uAC8C\uC2DC\uAE00", v: activity.postCount },
      { l: "\uB313\uAE00", v: activity.commentCount },
      { l: "\uBD81\uB9C8\uD06C", v: activity.bookmarkCount },
      { l: "\uCC45 \uC8FC\uBB38", v: activity.bookOrders.length },
      { l: "\uAC15\uC5F0 \uC2E0\uCCAD", v: activity.lectures.length },
      { l: "\uB2F5\uC0AC \uC2E0\uCCAD", v: activity.tours.length },
      { l: "\uBC1B\uC740 \uC54C\uB9BC", v: activity.notifications.length }
    ].map((s) => /* @__PURE__ */ React.createElement("div", { key: s.l, className: "card", style: { padding: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 4 } }, s.l), /* @__PURE__ */ React.createElement("div", { className: "ko-serif gold-2", style: { fontSize: 24 } }, s.v))))), activity.postCount > 0 && /* @__PURE__ */ React.createElement("article", { className: "card", style: { padding: 20, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "POSTS \xB7 ", activity.postCount), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 } }, activity.posts.slice(0, 8).map((p) => /* @__PURE__ */ React.createElement("li", { key: p.id, style: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, padding: "6px 0", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "ko-serif" }, p.title), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2" }, p.date))), activity.posts.length > 8 && /* @__PURE__ */ React.createElement("li", { className: "dim-2 mono", style: { fontSize: 11, textAlign: "right" } }, "\uC678 ", activity.posts.length - 8, "\uAC74"))), activity.bookOrders.length > 0 && /* @__PURE__ */ React.createElement("article", { className: "card", style: { padding: 20, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "BOOK ORDERS \xB7 ", activity.bookOrders.length), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 } }, activity.bookOrders.slice(0, 8).map((o) => /* @__PURE__ */ React.createElement("li", { key: o.id, style: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, padding: "6px 0", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "mono" }, o.orderNo), /* @__PURE__ */ React.createElement("span", null, o.version === "KR" ? "\uAD6D\uBB38" : "\uC601\uBB38", " \xD7 ", o.qty, " \xB7 ", /* @__PURE__ */ React.createElement("span", { className: "gold" }, window.BGNJ_FMT.won(o.total))), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2" }, o.status))))), (activity.lectures.length > 0 || activity.tours.length > 0) && /* @__PURE__ */ React.createElement("article", { className: "card", style: { padding: 20 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "LECTURES & TOURS"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }, className: "member-act-grid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.18em", marginBottom: 6 } }, "\uAC15\uC5F0 \uC2E0\uCCAD \xB7 ", activity.lectures.length), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 4 } }, activity.lectures.slice(0, 6).map((r) => {
      var _a2;
      return /* @__PURE__ */ React.createElement("li", { key: r.id, style: { fontSize: 12, lineHeight: 1.6 } }, "\xB7 ", ((_a2 = r.lecture) == null ? void 0 : _a2.topic) || "\uAC15\uC5F0", " ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10 } }, "\xB7 ", r.status));
    }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.18em", marginBottom: 6 } }, "\uB2F5\uC0AC \uC2E0\uCCAD \xB7 ", activity.tours.length), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 4 } }, activity.tours.slice(0, 6).map((r) => {
      var _a2;
      return /* @__PURE__ */ React.createElement("li", { key: r.id, style: { fontSize: 12, lineHeight: 1.6 } }, "\xB7 ", ((_a2 = r.tour) == null ? void 0 : _a2.title) || "\uB2F5\uC0AC", " ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10 } }, "\xB7 ", r.status));
    }))))), suspendTarget && /* @__PURE__ */ React.createElement(
      SuspendDialog,
      {
        target: suspendTarget,
        reason: suspendReason,
        onChange: setSuspendReason,
        onConfirm: submitSuspend,
        onCancel: () => {
          setSuspendTarget(null);
          setSuspendReason("");
        }
      }
    ));
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 16, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC774\uB984\xB7\uC774\uBA54\uC77C \uAC80\uC0C9...",
      style: { flex: 1, minWidth: 240 },
      value: search,
      onChange: (e) => setSearch(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "field-input",
      style: { maxWidth: 160 },
      value: statusFilter,
      onChange: (e) => setStatusFilter(e.target.value)
    },
    /* @__PURE__ */ React.createElement("option", { value: "all" }, "\uC804\uCCB4 \uC0C1\uD0DC"),
    /* @__PURE__ */ React.createElement("option", { value: "active" }, "\uD65C\uC131"),
    /* @__PURE__ */ React.createElement("option", { value: "suspended" }, "\uC815\uC9C0\uB428"),
    /* @__PURE__ */ React.createElement("option", { value: "admin" }, "\uAD00\uB9AC\uC790\uB9CC")
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "field-input",
      style: { maxWidth: 200 },
      value: gradeFilter,
      onChange: (e) => setGradeFilter(e.target.value)
    },
    /* @__PURE__ */ React.createElement("option", { value: "all" }, "\uC804\uCCB4 \uB4F1\uAE09"),
    grades.map((g) => /* @__PURE__ */ React.createElement("option", { key: g.id, value: g.id }, g.label))
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "field-input",
      style: { maxWidth: 200 },
      value: sortKey,
      onChange: (e) => setSortKey(e.target.value)
    },
    /* @__PURE__ */ React.createElement("option", { value: "joined_desc" }, "\uAC00\uC785\uC77C \u2193 (\uCD5C\uC2E0)"),
    /* @__PURE__ */ React.createElement("option", { value: "joined_asc" }, "\uAC00\uC785\uC77C \u2191 (\uC624\uB798\uB41C)"),
    /* @__PURE__ */ React.createElement("option", { value: "name_asc" }, "\uC774\uB984 \uAC00\uB098\uB2E4"),
    /* @__PURE__ */ React.createElement("option", { value: "name_desc" }, "\uC774\uB984 \uC5ED\uC21C"),
    /* @__PURE__ */ React.createElement("option", { value: "email_asc" }, "\uC774\uBA54\uC77C a\u2192z"),
    /* @__PURE__ */ React.createElement("option", { value: "grade_desc" }, "\uB4F1\uAE09 \u2193 (\uB192\uC740 \uC21C)"),
    /* @__PURE__ */ React.createElement("option", { value: "posts_desc" }, "\uAC8C\uC2DC\uAE00 \uB9CE\uC740 \uC21C"),
    /* @__PURE__ */ React.createElement("option", { value: "comments_desc" }, "\uB313\uAE00 \uB9CE\uC740 \uC21C")
  ), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, "\uCD1D ", users.length, "\uBA85 \xB7 \uD45C\uC2DC ", filtered.length, "\uBA85"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: exportCsv }, "CSV \uB2E4\uC6B4\uB85C\uB4DC")), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, marginBottom: 14 } }, "\uD68C\uC6D0 \uC774\uBA54\uC77C/\uC774\uB984\uC740 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uAC1C\uC778\uC2DD\uBCC4\uC815\uBCF4(PII)"), "\uC785\uB2C8\uB2E4. \uB4F1\uAE09 \uBCC0\uACBD\xB7\uC815\uC9C0\xB7\uC0AD\uC81C\uB294 \uC989\uC2DC \uBC18\uC601\uB418\uBA70, \uBCF8\uC778\uC774 \uB85C\uADF8\uC778 \uC911\uC774\uBA74 \uC138\uC158\uB3C4 \uC790\uB3D9\uC73C\uB85C \uAC31\uC2E0/\uC885\uB8CC\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)", textTransform: "uppercase" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uB4F1\uAE09"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uAC00\uC785\uC77C"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uB9C8\uC9C0\uB9C9 \uC811\uC18D"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "right" } }, "\uD65C\uB3D9"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "right" } }, "\uC561\uC158"))), /* @__PURE__ */ React.createElement("tbody", null, filtered.map((u) => {
    const g = gradeOf(u.gradeId);
    const a = window.BGNJ_AUTH.getActivity(u.id) || {};
    const activitySummary = `\uAE00 ${a.postCount || 0} \xB7 \uB313\uAE00 ${a.commentCount || 0} \xB7 \uC8FC\uBB38 ${(a.bookOrders || []).length} \xB7 \uAC15\uC5F0 ${(a.lectures || []).length} \xB7 \uB2F5\uC0AC ${(a.tours || []).length}`;
    return /* @__PURE__ */ React.createElement("tr", { key: u.id, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: 12 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => setSelectedId(u.id),
        style: { all: "unset", cursor: "pointer" }
      },
      /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: 14 } }, u.name),
      u.isAdmin && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 9, letterSpacing: "0.18em", color: "var(--secondary)", marginLeft: 8 } }, "ADMIN"),
      u.suspended && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 9, letterSpacing: "0.18em", color: "var(--danger)", marginLeft: 8 } }, "\uC815\uC9C0")
    )), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 12, fontSize: 11 } }, u.email), /* @__PURE__ */ React.createElement("td", { style: { padding: 12 } }, g ? /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.14em", color: g.color || "var(--primary)", border: `1px solid ${g.color || "var(--primary-dim)"}`, padding: "1px 6px" } }, g.label) : /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10 } }, "\u2014")), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 12, fontSize: 11 } }, u.joinedAt ? window.BGNJ_FMT.kstDate(u.joinedAt) : "-"), /* @__PURE__ */ React.createElement(
      "td",
      {
        className: "mono dim-2",
        style: { padding: 12, fontSize: 11 },
        title: u.lastLoginAt ? window.BGNJ_FMT.kstDateTime(u.lastLoginAt) : "\uAE30\uB85D \uC5C6\uC74C"
      },
      u.lastLoginAt ? window.BGNJ_FMT.kstRelative(u.lastLoginAt) : /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\u2014")
    ), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 12, fontSize: 10, textAlign: "right" } }, activitySummary), /* @__PURE__ */ React.createElement("td", { style: { padding: 12, textAlign: "right" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setSelectedId(u.id) }, "\uC0C1\uC138")));
  }))), filtered.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "card dim", style: { padding: 32, textAlign: "center", marginTop: 14 } }, "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uD68C\uC6D0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."));
};
const pickImageWithR2Fallback = window.pickImageWithR2Fallback;
const downloadBlob = window.downloadBlob;
const downloadCsv = window.downloadCsv;
const downloadJson = window.downloadJson;
const SubTabsView = window.SubTabsView;
const ActivityLogPanel = () => {
  const [auditRows, setAuditRows] = React.useState([]);
  const [errorRows, setErrorRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("all");
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState("ts_desc");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      try {
        const [auditRes, errorRes] = await Promise.allSettled([
          (_d = (_c = (_b = (_a = window.BGNJ_API) == null ? void 0 : _a.admin) == null ? void 0 : _b.audit) == null ? void 0 : _c.list) == null ? void 0 : _d.call(_c, { limit: 300 }),
          (_h = (_g = (_f = (_e = window.BGNJ_API) == null ? void 0 : _e.admin) == null ? void 0 : _f.errorLog) == null ? void 0 : _g.list) == null ? void 0 : _h.call(_g, { limit: 200 })
        ]);
        if (cancelled) return;
        const audits = auditRes.status === "fulfilled" && Array.isArray((_i = auditRes.value) == null ? void 0 : _i.entries) ? auditRes.value.entries : [];
        const errors = errorRes.status === "fulfilled" && Array.isArray((_j = errorRes.value) == null ? void 0 : _j.entries) ? errorRes.value.entries : [];
        setAuditRows(audits);
        setErrorRows(errors);
      } catch (e) {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);
  const recentPosts = React.useMemo(() => {
    var _a, _b;
    try {
      return (((_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a.listPosts) == null ? void 0 : _b.call(_a)) || []).slice(0, 100);
    } catch (e) {
      return [];
    }
  }, [refreshKey]);
  const merged = React.useMemo(() => {
    const out = [];
    auditRows.forEach((a) => {
      const action = String(a.action || "");
      const type = action.startsWith("user.signup") ? "signup" : action.startsWith("admin.") ? "admin" : action.startsWith("grade.") ? "grade" : action.startsWith("category.") ? "category" : action.startsWith("lecture.") ? "content" : action.startsWith("tour.") ? "content" : action.startsWith("alarm.") ? "alarm" : "admin";
      const details = a.details_json ? (() => {
        try {
          return JSON.parse(a.details_json);
        } catch (e) {
          return null;
        }
      })() : null;
      out.push({
        ts: a.ts,
        type,
        actor: a.actor || "?",
        action,
        target: a.target || "",
        detail: details ? Object.entries(details).map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`).join(" \xB7 ") : "",
        ip: a.ip,
        source: "audit"
      });
    });
    errorRows.forEach((e) => {
      out.push({
        ts: e.ts,
        type: "error",
        actor: e.user_id || (e.user_agent || "").slice(0, 24) || "anonymous",
        action: `${e.code || "ERROR"} (${e.kind || ""})`,
        target: e.pathname || e.url || "",
        detail: e.message || "",
        ip: "",
        source: "error"
      });
    });
    recentPosts.forEach((p) => {
      out.push({
        ts: p.createdAt || p.date || "",
        type: "post",
        actor: p.author || "?",
        action: `post.create [${p.category || ""}]`,
        target: `post:${p.id}`,
        detail: p.title || "",
        ip: "",
        source: "post"
      });
    });
    return out.sort((a, b) => String(b.ts || "").localeCompare(String(a.ts || "")));
  }, [auditRows, errorRows, recentPosts]);
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTs = dateFrom ? Date.parse(dateFrom + "T00:00:00+09:00") : null;
    const toTs = dateTo ? Date.parse(dateTo + "T23:59:59+09:00") : null;
    let rows = merged;
    if (filter !== "all") rows = rows.filter((e) => e.type === filter);
    if (q) {
      rows = rows.filter((e) => {
        const haystack = `${e.actor || ""} ${e.action || ""} ${e.target || ""} ${e.detail || ""} ${e.ip || ""}`.toLowerCase();
        return haystack.includes(q);
      });
    }
    if (fromTs || toTs) {
      rows = rows.filter((e) => {
        const t = Date.parse(e.ts || "");
        if (isNaN(t)) return false;
        if (fromTs && t < fromTs) return false;
        if (toTs && t > toTs) return false;
        return true;
      });
    }
    const cmpStr = (a, b) => String(a || "").localeCompare(String(b || ""));
    rows = rows.slice().sort((a, b) => {
      switch (sortKey) {
        case "ts_asc":
          return cmpStr(a.ts, b.ts);
        case "actor_asc":
          return cmpStr(a.actor, b.actor) || cmpStr(b.ts, a.ts);
        case "type_asc":
          return cmpStr(a.type, b.type) || cmpStr(b.ts, a.ts);
        case "ts_desc":
        default:
          return cmpStr(b.ts, a.ts);
      }
    });
    return rows;
  }, [merged, filter, search, dateFrom, dateTo, sortKey]);
  const TYPES = [
    { id: "all", label: "\uC804\uCCB4", count: merged.length },
    { id: "admin", label: "\uAD00\uB9AC\uC790", count: merged.filter((e) => e.type === "admin").length },
    { id: "signup", label: "\uD68C\uC6D0\uAC00\uC785", count: merged.filter((e) => e.type === "signup").length },
    { id: "grade", label: "\uB4F1\uAE09", count: merged.filter((e) => e.type === "grade").length },
    { id: "category", label: "\uCE74\uD14C\uACE0\uB9AC", count: merged.filter((e) => e.type === "category").length },
    { id: "content", label: "\uCF58\uD150\uCE20", count: merged.filter((e) => e.type === "content").length },
    { id: "alarm", label: "\uC54C\uB78C", count: merged.filter((e) => e.type === "alarm").length },
    { id: "post", label: "\uAC8C\uC2DC\uAE00", count: merged.filter((e) => e.type === "post").length },
    { id: "error", label: "\uC624\uB958", count: merged.filter((e) => e.type === "error").length }
  ];
  const TYPE_COLOR = {
    admin: "var(--primary-hover)",
    signup: "var(--secondary)",
    grade: "#a855f7",
    category: "#0ea5e9",
    content: "#22c55e",
    alarm: "#f59e0b",
    post: "#94a3b8",
    error: "var(--danger)"
  };
  const TYPE_LABEL = {
    admin: "\uAD00\uB9AC\uC790",
    signup: "\uAC00\uC785",
    grade: "\uB4F1\uAE09",
    category: "\uCE74\uD14C\uACE0\uB9AC",
    content: "\uCF58\uD150\uCE20",
    alarm: "\uC54C\uB78C",
    post: "\uAC8C\uC2DC\uAE00",
    error: "\uC624\uB958"
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    AdminPanelHeader,
    {
      eyebrow: "ACTIVITY \xB7 \uD65C\uB3D9 \uB85C\uADF8",
      title: "\uD1B5\uD569 \uD65C\uB3D9 \uB85C\uADF8",
      description: "\uAD00\uB9AC\uC790 \uD65C\uB3D9 + \uD68C\uC6D0 \uD65C\uB3D9(\uAC00\uC785/\uAC8C\uC2DC\uAE00) + \uC624\uB958 \uBCF4\uACE0\uB97C \uC2DC\uAC04 \uC5ED\uC21C\uC73C\uB85C \uD1B5\uD569. \uD2B8\uB7EC\uBE14\uC288\uD305\xB7\uC6B4\uC601 \uBAA8\uB2C8\uD130\uB9C1\uC6A9. \uCE69\uC73C\uB85C \uC720\uD615 \uD544\uD130."
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }, role: "tablist", "aria-label": "\uD65C\uB3D9 \uC720\uD615 \uD544\uD130" }, TYPES.map((t) => {
    const active = filter === t.id;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: t.id,
        type: "button",
        role: "tab",
        "aria-selected": active,
        onClick: () => setFilter(t.id),
        style: {
          padding: "5px 12px",
          fontSize: 12,
          fontFamily: "var(--font-serif)",
          background: active ? "var(--primary)" : "transparent",
          color: active ? "var(--bg)" : "var(--ink-2)",
          border: `1px solid ${active ? "var(--primary)" : "var(--line-2)"}`,
          borderRadius: 999,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6
        }
      },
      /* @__PURE__ */ React.createElement("span", null, t.label),
      /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, opacity: active ? 0.85 : 0.55 } }, t.count)
    );
  }), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setRefreshKey((v) => v + 1),
      style: { marginLeft: "auto", padding: "4px 10px", fontSize: 11 }
    },
    "\u{1F504} \uC0C8\uB85C\uACE0\uCE68"
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "minmax(220px, 1fr) auto auto auto", gap: 10, marginBottom: 14, alignItems: "center" }, className: "activity-filter-row" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "field-input",
      placeholder: "\uAC80\uC0C9 (\uC8FC\uCCB4/\uC561\uC158/\uB300\uC0C1/\uC0C1\uC138/IP \u2014 \uBD80\uBD84 \uC77C\uCE58)...",
      value: search,
      onChange: (e) => setSearch(e.target.value),
      "aria-label": "\uD65C\uB3D9 \uB85C\uADF8 \uAC80\uC0C9",
      style: { padding: "8px 12px", fontSize: 13 }
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      className: "field-input",
      value: dateFrom,
      onChange: (e) => setDateFrom(e.target.value),
      "aria-label": "\uC2DC\uC791\uC77C (KST)",
      style: { padding: "8px 12px", fontSize: 12, fontFamily: "var(--font-mono)" }
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      className: "field-input",
      value: dateTo,
      onChange: (e) => setDateTo(e.target.value),
      "aria-label": "\uC885\uB8CC\uC77C (KST)",
      style: { padding: "8px 12px", fontSize: 12, fontFamily: "var(--font-mono)" }
    }
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "field-input",
      value: sortKey,
      onChange: (e) => setSortKey(e.target.value),
      "aria-label": "\uC815\uB82C",
      style: { padding: "8px 12px", fontSize: 12, fontFamily: "var(--font-mono)", minWidth: 140 }
    },
    /* @__PURE__ */ React.createElement("option", { value: "ts_desc" }, "\uCD5C\uC2E0\uC21C \u2193"),
    /* @__PURE__ */ React.createElement("option", { value: "ts_asc" }, "\uC624\uB798\uB41C\uC21C \u2191"),
    /* @__PURE__ */ React.createElement("option", { value: "actor_asc" }, "\uC8FC\uCCB4 (\uAC00\uB098\uB2E4)"),
    /* @__PURE__ */ React.createElement("option", { value: "type_asc" }, "\uC720\uD615\uC21C")
  )), (search || dateFrom || dateTo) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11, letterSpacing: "0.1em" } }, "\uD544\uD130 \uC801\uC6A9: ", filtered.length, "\uAC74 (\uC804\uCCB4 ", merged.length, ")"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => {
        setSearch("");
        setDateFrom("");
        setDateTo("");
      },
      style: { padding: "2px 8px", fontSize: 10 }
    },
    "\u2715 \uD544\uD130 \uCD08\uAE30\uD654"
  )), loading && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, padding: "12px 0" } }, "\u23F3 \uD65C\uB3D9 \uB85C\uADF8 \uB85C\uB529 \uC911\u2026"), !loading && filtered.length === 0 ? /* @__PURE__ */ React.createElement(AdminEmpty, null, "\uD574\uB2F9 \uC720\uD615\uC758 \uD65C\uB3D9 \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--line)", overflow: "auto" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 840 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-3)", textTransform: "uppercase" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left", minWidth: 140 } }, "\uC2DC\uAC04 (KST)"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left", minWidth: 80 } }, "\uC720\uD615"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left", minWidth: 160 } }, "\uC8FC\uCCB4"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left", minWidth: 200 } }, "\uC561\uC158 / \uB300\uC0C1"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC0C1\uC138"))), /* @__PURE__ */ React.createElement("tbody", null, filtered.slice(0, 500).map((e, i) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement("tr", { key: i, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: "10px 12px", whiteSpace: "nowrap" } }, ((_b = (_a = window.BGNJ_FMT) == null ? void 0 : _a.kstShort) == null ? void 0 : _b.call(_a, e.ts)) || String(e.ts || "").slice(0, 19)), /* @__PURE__ */ React.createElement("td", { style: { padding: "10px 12px" } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
      fontSize: 9,
      padding: "2px 7px",
      letterSpacing: "0.12em",
      fontWeight: 700,
      border: `1px solid ${TYPE_COLOR[e.type] || "var(--line-2)"}`,
      color: TYPE_COLOR[e.type] || "var(--ink-2)"
    } }, TYPE_LABEL[e.type] || e.type)), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: "10px 12px", fontSize: 11, color: "var(--ink)" } }, e.actor, e.ip && /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { marginLeft: 8, fontSize: 10 } }, "\xB7 ", e.ip)), /* @__PURE__ */ React.createElement("td", { style: { padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 11 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink)" } }, e.action), e.target && /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { marginLeft: 8, fontSize: 10 } }, e.target)), /* @__PURE__ */ React.createElement("td", { className: "dim", style: { padding: "10px 12px", fontSize: 12, lineHeight: 1.5, wordBreak: "break-word", maxWidth: 540 } }, e.detail || "\u2014"));
  }))), filtered.length > 500 && /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { padding: "10px 14px", fontSize: 11, textAlign: "center", borderTop: "1px solid var(--line)" } }, "\uC0C1\uC704 500\uAC74\uB9CC \uD45C\uC2DC. \uB354 \uC624\uB798\uB41C \uAE30\uB85D\uC740 [\uAC10\uC0AC \uB85C\uADF8] \uB610\uB294 [\uC624\uB958 \uB85C\uADF8] \uBCC4\uB3C4 \uD328\uB110\uC5D0\uC11C \uAC80\uC0C9.")), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 12, lineHeight: 1.7 } }, "\u24D8 \uB370\uC774\uD130 \uC18C\uC2A4: ", /* @__PURE__ */ React.createElement("code", { style: { padding: "1px 5px", background: "var(--bg-2)", border: "1px solid var(--line-2)" } }, "audit_log"), "(D1 \u2014 \uAD00\uB9AC\uC790 \uD589\uB3D9 + \uD68C\uC6D0\uAC00\uC785) +", /* @__PURE__ */ React.createElement("code", { style: { padding: "1px 5px", background: "var(--bg-2)", border: "1px solid var(--line-2)", marginLeft: 6 } }, "error_log"), "(D1 \u2014 \uC624\uB958 \uBCF4\uACE0) + \uCD5C\uADFC \uAC8C\uC2DC\uAE00(BGNJ_COMMUNITY \uCE90\uC2DC). \uD2B8\uB7EC\uBE14\uC288\uD305 \uC2DC \uC2DC\uAC04 \uC5ED\uC21C\uC73C\uB85C \uC0AC\uACE0 \uBC1C\uC0DD \uC9C1\uC804 \uD65C\uB3D9\uC744 \uCD94\uC801."));
};
const InternalAlarmPanel = () => {
  var _a;
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [scope, setScope] = React.useState("all_admins");
  const [selectedGrade, setSelectedGrade] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [resultMsg, setResultMsg] = React.useState("");
  const [excludeSelf, setExcludeSelf] = React.useState(true);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      var _a2, _b, _c, _d;
      try {
        const data = await ((_d = (_c = (_b = (_a2 = window.BGNJ_API) == null ? void 0 : _a2.admin) == null ? void 0 : _b.users) == null ? void 0 : _c.list) == null ? void 0 : _d.call(_c));
        if (cancelled) return;
        setUsers(Array.isArray(data == null ? void 0 : data.users) ? data.users : []);
      } catch (e) {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const admins = users.filter((u) => u.isAdmin || u.is_admin);
  const grades = (((_a = window.BGNJ_STORES) == null ? void 0 : _a.grades) || []).slice().sort((a, b) => (a.level || 0) - (b.level || 0));
  const gradeCounts = React.useMemo(() => {
    const counts = {};
    users.forEach((u) => {
      const gid = u.gradeId || u.grade_id || "member";
      counts[gid] = (counts[gid] || 0) + 1;
    });
    return counts;
  }, [users]);
  const totalMembers = users.length;
  const totalNonAdmins = users.filter((u) => !(u.isAdmin || u.is_admin)).length;
  const send = async () => {
    var _a2, _b, _c, _d;
    if (!message.trim()) {
      setResultMsg("\u2717 \uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    if (scope === "select" && selectedIds.size === 0) {
      setResultMsg("\u2717 \uC218\uC2E0\uC790\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    const __confirmMsg = scope === "all_admins" ? `\uBAA8\uB4E0 \uAD00\uB9AC\uC790(${admins.length}\uBA85${excludeSelf ? " - \uBCF8\uC778 \uC81C\uC678" : ""})\uC5D0\uAC8C \uC54C\uB78C\uC744 \uBCF4\uB0B4\uC2DC\uACA0\uC5B4\uC694?` : `\uC120\uD0DD\uD55C ${selectedIds.size}\uBA85\uC5D0\uAC8C \uC54C\uB78C\uC744 \uBCF4\uB0B4\uC2DC\uACA0\uC5B4\uC694?`;
    if (!await window.BGNJ_CONFIRM(__confirmMsg, { danger: true })) return;
    setSending(true);
    setResultMsg("");
    try {
      let recipients;
      if (scope === "grade" && selectedGrade) {
        recipients = { grade: selectedGrade };
      } else if (scope === "all_admins" || scope === "all_members" || scope === "all_non_admins") {
        recipients = scope;
      } else {
        recipients = "all_admins";
      }
      const res = await ((_c = (_b = (_a2 = window.BGNJ_API) == null ? void 0 : _a2.internalAlarm) == null ? void 0 : _b.send) == null ? void 0 : _c.call(_b, {
        recipients,
        title: title.trim(),
        message: message.trim(),
        excludeSelf
      }));
      setResultMsg(`\u2713 ${(res == null ? void 0 : res.group) ? res.group + " \u2014 " : ""}${(_d = res == null ? void 0 : res.sent) != null ? _d : 0}\uBA85\uC5D0\uAC8C \uC54C\uB78C\uC774 \uBC1C\uC1A1\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`);
      setTitle("");
      setMessage("");
      setTimeout(() => setResultMsg(""), 4e3);
    } catch (err) {
      setResultMsg("\u2717 \uBC1C\uC1A1 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    } finally {
      setSending(false);
    }
  };
  const scopeCount = (() => {
    if (scope === "all_admins") return admins.length - (excludeSelf ? 1 : 0);
    if (scope === "all_members") return totalMembers - (excludeSelf ? 1 : 0);
    if (scope === "all_non_admins") return totalNonAdmins;
    if (scope === "grade" && selectedGrade) return gradeCounts[selectedGrade] || 0;
    return 0;
  })();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    AdminPanelHeader,
    {
      eyebrow: "ALARM \xB7 \uB0B4\uBD80 \uC54C\uB78C",
      title: "\uB0B4\uBD80 \uC778\uC6D0 \uC54C\uB78C \uBCF4\uB0B4\uAE30",
      description: "\uADF8\uB8F9 \uB2E8\uC704\uB85C \uC54C\uB78C\uC744 broadcast \u2014 \uC804\uCCB4 \uAD00\uB9AC\uC790 / \uC804\uCCB4 \uD68C\uC6D0 / \uC77C\uBC18 \uD68C\uC6D0 / \uD2B9\uC815 \uB4F1\uAE09 \uC911 \uC120\uD0DD. \uC218\uC2E0\uC790\uC758 \u{1F514} \uC5D0 \uC989\uC2DC \uD45C\uC2DC. D1 notifications \uC800\uC7A5 (server-first)."
    }
  ), /* @__PURE__ */ React.createElement("article", { className: "admin-form-card", style: { padding: 18, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "admin-form-card__eyebrow" }, "\u{1F4E3} \uC54C\uB78C \uC791\uC131"), /* @__PURE__ */ React.createElement("fieldset", { style: { border: "1px solid var(--line)", padding: "12px 14px", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("legend", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", padding: "0 6px" } }, "\uC218\uC2E0 \uADF8\uB8F9"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 } }, [
    { key: "all_admins", label: "\uC804\uCCB4 \uAD00\uB9AC\uC790", count: admins.length, desc: "is_admin=1 \uBAA8\uB4E0 \uD68C\uC6D0" },
    { key: "all_members", label: "\uC804\uCCB4 \uD68C\uC6D0", count: totalMembers, desc: "admin \uD3EC\uD568 \uBAA8\uB4E0 \uD68C\uC6D0" },
    { key: "all_non_admins", label: "\uC77C\uBC18 \uD68C\uC6D0\uB9CC", count: totalNonAdmins, desc: "admin \uC81C\uC678 \uC77C\uBC18 \uD68C\uC6D0" },
    { key: "grade", label: "\uD2B9\uC815 \uB4F1\uAE09", count: scope === "grade" && selectedGrade ? gradeCounts[selectedGrade] || 0 : "\u2014", desc: "\uC544\uB798 \uB4F1\uAE09 select" }
  ].map((opt) => {
    const active = scope === opt.key;
    return /* @__PURE__ */ React.createElement("label", { key: opt.key, style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      cursor: "pointer",
      padding: "10px 12px",
      border: `1px solid ${active ? "var(--primary)" : "var(--line-2)"}`,
      background: active ? "rgba(245,213,72,0.06)" : "transparent",
      transition: "border-color .12s, background .12s"
    } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "radio",
        name: "alarm-scope",
        checked: active,
        onChange: () => setScope(opt.key),
        style: { marginTop: 2 }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--ink)", display: "flex", justifyContent: "space-between", gap: 8 } }, /* @__PURE__ */ React.createElement("span", null, opt.label), /* @__PURE__ */ React.createElement("span", { className: "mono gold", style: { fontSize: 11, fontWeight: 700 } }, opt.count, typeof opt.count === "number" ? "\uBA85" : "")), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, marginTop: 2, lineHeight: 1.4 } }, opt.desc)));
  })), scope === "grade" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "alarm-grade", className: "mono dim-2", style: { fontSize: 11, letterSpacing: "0.1em" } }, "\uB4F1\uAE09 \uC120\uD0DD"), /* @__PURE__ */ React.createElement(
    "select",
    {
      id: "alarm-grade",
      className: "field-input",
      value: selectedGrade,
      onChange: (e) => setSelectedGrade(e.target.value),
      style: { maxWidth: 280, padding: "6px 10px" }
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 \uB4F1\uAE09 \uC120\uD0DD \u2014"),
    grades.map((g) => /* @__PURE__ */ React.createElement("option", { key: g.id, value: g.id }, "Lv ", g.level, " \xB7 ", g.label, " (", gradeCounts[g.id] || 0, "\uBA85)"))
  ), selectedGrade && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 11, color: "var(--secondary)", fontWeight: 700 } }, "\u2192 ", gradeCounts[selectedGrade] || 0, "\uBA85 \uBC1C\uC1A1 \uC608\uC815")), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 14, fontSize: 12 } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: excludeSelf, onChange: (e) => setExcludeSelf(e.target.checked) }), /* @__PURE__ */ React.createElement("span", null, "\uBCF8\uC778\uC740 \uC218\uC2E0\uC790\uC5D0\uC11C \uC81C\uC678"))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "alarm-title" }, "\uC81C\uBAA9 (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "alarm-title",
      className: "field-input",
      value: title,
      onChange: (e) => setTitle(e.target.value),
      placeholder: "\uC608: \uD658\uBD88 \uCC98\uB9AC \uC694\uCCAD / \uAE34\uAE09 \uC810\uAC80 \uC548\uB0B4"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "alarm-message" }, "\uBA54\uC2DC\uC9C0 ", /* @__PURE__ */ React.createElement("span", { className: "gold" }, "*")), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      id: "alarm-message",
      className: "field-input",
      rows: 5,
      value: message,
      onChange: (e) => setMessage(e.target.value),
      placeholder: "\uC54C\uB9BC \uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC138\uC694.",
      style: { fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-gold",
      onClick: send,
      disabled: sending || !message.trim() || scope === "grade" && !selectedGrade || scopeCount === 0
    },
    sending ? "\uBC1C\uC1A1 \uC911\u2026" : `\u{1F4E3} \uBC1C\uC1A1 (${scopeCount}\uBA85 \uC608\uC815)`
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => {
    setTitle("");
    setMessage("");
    setSelectedGrade("");
    setResultMsg("");
  } }, "\uCD08\uAE30\uD654"), resultMsg && /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    fontSize: 12,
    fontWeight: 700,
    color: resultMsg.startsWith("\u2717") ? "var(--danger)" : "var(--secondary)"
  } }, resultMsg))), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.7 } }, "\u24D8 \uC54C\uB78C\uC740 D1 ", /* @__PURE__ */ React.createElement("code", { style: { padding: "1px 5px", background: "var(--bg-2)", border: "1px solid var(--line-2)" } }, "notifications"), " \uD14C\uC774\uBE14\uC5D0 type=", /* @__PURE__ */ React.createElement("code", { style: { padding: "1px 5px", background: "var(--bg-2)", border: "1px solid var(--line-2)" } }, "internal_alarm"), " \uC73C\uB85C \uC800\uC7A5\uB429\uB2C8\uB2E4. \uC218\uC2E0\uC790\uB294 \uD5E4\uB354\uC758 \uC54C\uB9BC \uC885(\u{1F514}) \uC5D0\uC11C \uC989\uC2DC \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."));
};
const ADMIN_POSTS_PER_PAGE_OPTIONS = [10, 30, 50, 100];
const ADMIN_POSTS_PER_PAGE_LS_KEY = "bgnj_admin_posts_per_page";
const ADMIN_POSTS_PER_PAGE_DEFAULT = 30;
const CommunityPostsAdminPanel = ({ posts, onChange }) => {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [selectedIds2, setSelectedIds] = React.useState(/* @__PURE__ */ new Set());
  const [viewingId, setViewingId] = React.useState(null);
  const [bulkCat, setBulkCat] = React.useState("");
  const [bulkPrefix, setBulkPrefix] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSizeState] = React.useState(() => {
    try {
      const v = Number(localStorage.getItem(ADMIN_POSTS_PER_PAGE_LS_KEY));
      return ADMIN_POSTS_PER_PAGE_OPTIONS.includes(v) ? v : ADMIN_POSTS_PER_PAGE_DEFAULT;
    } catch (e) {
      return ADMIN_POSTS_PER_PAGE_DEFAULT;
    }
  });
  const setPageSize = (n) => {
    setPageSizeState(n);
    try {
      localStorage.setItem(ADMIN_POSTS_PER_PAGE_LS_KEY, String(n));
    } catch (e) {
    }
    setPage(1);
  };
  const visible = React.useMemo(() => posts.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || String(p.author || "").toLowerCase().includes(q);
    const matchFilter = filter === "all" || p.categoryId === filter;
    return matchSearch && matchFilter;
  }), [posts, search, filter]);
  React.useEffect(() => {
    setPage(1);
  }, [search, filter]);
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pagePosts = visible.slice(pageStart, pageStart + pageSize);
  const exportCsv = () => {
    downloadCsv(`community-posts-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, window.BGNJ_COMMUNITY.exportCsv());
  };
  const removeOne = async (post) => {
    if (!await window.BGNJ_CONFIRM(`"${post.title}" \uAC8C\uC2DC\uAE00\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
    window.BGNJ_COMMUNITY.deletePost(post.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(post.id);
      return next;
    });
    onChange == null ? void 0 : onChange();
  };
  const bulkRemove = async () => {
    if (selectedIds2.size === 0) return;
    if (!await window.BGNJ_CONFIRM(`\uC120\uD0DD\uD55C ${selectedIds2.size}\uAC1C \uAC8C\uC2DC\uAE00\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?`, { danger: true })) return;
    selectedIds2.forEach((id) => window.BGNJ_COMMUNITY.deletePost(id));
    setSelectedIds(/* @__PURE__ */ new Set());
    onChange == null ? void 0 : onChange();
  };
  const bulkMove = () => {
    if (selectedIds2.size === 0) return;
    if (!bulkCat) {
      window.BGNJ_TOAST.error("\uC774\uB3D9\uD560 \uAC8C\uC2DC\uD310\uC744 \uC120\uD0DD\uD558\uC138\uC694.");
      return;
    }
    const cat = window.BGNJ_STORES.categories.find((c) => c.id === bulkCat);
    if (!cat) return;
    selectedIds2.forEach((id) => window.BGNJ_COMMUNITY.updatePost(id, { categoryId: cat.id, category: cat.label }));
    setSelectedIds(/* @__PURE__ */ new Set());
    setBulkCat("");
    onChange == null ? void 0 : onChange();
  };
  const bulkApplyPrefix = () => {
    if (selectedIds2.size === 0) return;
    const next = bulkPrefix.trim();
    selectedIds2.forEach((id) => window.BGNJ_COMMUNITY.updatePost(id, { prefix: next || null }));
    setSelectedIds(/* @__PURE__ */ new Set());
    setBulkPrefix("");
    onChange == null ? void 0 : onChange();
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }, role: "tablist", "aria-label": "\uAC8C\uC2DC\uD310 \uD544\uD130" }, [{ id: "all", label: "\uC804\uCCB4", count: posts.length }].concat(window.BGNJ_STORES.categories.filter((item) => item.boardType === "community").map((c) => ({ id: c.id, label: c.label, count: posts.filter((p) => p.categoryId === c.id).length }))).map((chip) => {
    const active = filter === chip.id;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: chip.id,
        type: "button",
        role: "tab",
        "aria-selected": active,
        onClick: () => {
          setFilter(chip.id);
          setSelectedIds(/* @__PURE__ */ new Set());
        },
        style: {
          padding: "6px 14px",
          fontSize: 12,
          fontFamily: "var(--font-serif)",
          background: active ? "var(--primary)" : "transparent",
          color: active ? "var(--bg)" : "var(--ink-2)",
          border: `1px solid ${active ? "var(--primary)" : "var(--line-2)"}`,
          borderRadius: 999,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6
        }
      },
      /* @__PURE__ */ React.createElement("span", null, chip.label),
      /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.05em", opacity: active ? 0.85 : 0.55 } }, chip.count)
    );
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 16, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "post-search", className: "sr-only" }, "\uAC8C\uC2DC\uAE00 \uAC80\uC0C9"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "post-search",
      className: "field-input",
      placeholder: "\uC81C\uBAA9 \uB610\uB294 \uC791\uC131\uC790 \uAC80\uC0C9...",
      style: { flex: 1, minWidth: 200 },
      value: search,
      onChange: (e) => setSearch(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("label", { htmlFor: "admin-post-per-page", className: "sr-only" }, "\uD55C \uD398\uC774\uC9C0 \uAC8C\uC2DC\uAE00 \uC218"), /* @__PURE__ */ React.createElement(
    "select",
    {
      id: "admin-post-per-page",
      className: "field-input",
      value: pageSize,
      onChange: (e) => setPageSize(Number(e.target.value)),
      style: { padding: "10px 12px", fontSize: 12, cursor: "pointer" },
      title: "\uD55C \uD398\uC774\uC9C0\uC5D0 \uD45C\uC2DC\uD560 \uAC8C\uC2DC\uAE00 \uAC2F\uC218"
    },
    ADMIN_POSTS_PER_PAGE_OPTIONS.map((n) => /* @__PURE__ */ React.createElement("option", { key: n, value: n }, n, "\uAC1C"))
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: exportCsv }, "CSV \uB2E4\uC6B4\uB85C\uB4DC")), selectedIds2.size > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(59,130,246,0.07)", border: "1px solid var(--primary-dim)", marginBottom: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "mono gold", style: { fontSize: 11 } }, selectedIds2.size, "\uAC1C \uC120\uD0DD\uB428"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", style: { borderColor: "var(--danger)", color: "var(--danger)" }, onClick: bulkRemove }, "\uC120\uD0DD \uC0AD\uC81C"), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { width: 1, alignSelf: "stretch", background: "var(--line)" } }), /* @__PURE__ */ React.createElement("select", { className: "field-input", style: { maxWidth: 160, padding: "4px 8px" }, value: bulkCat, onChange: (e) => setBulkCat(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\uAC8C\uC2DC\uD310 \uC120\uD0DD..."), window.BGNJ_STORES.categories.filter((c) => c.boardType === "community").map((c) => /* @__PURE__ */ React.createElement("option", { key: c.id, value: c.id }, c.label))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: bulkMove }, "\uC774\uB3D9"), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { width: 1, alignSelf: "stretch", background: "var(--line)" } }), /* @__PURE__ */ React.createElement("input", { type: "text", className: "field-input", style: { maxWidth: 140, padding: "4px 8px" }, placeholder: "\uB9D0\uBA38\uB9AC (\uBE44\uC6B0\uBA74 \uC81C\uAC70)", value: bulkPrefix, onChange: (e) => setBulkPrefix(e.target.value), "aria-label": "\uC77C\uAD04 \uC801\uC6A9\uD560 \uB9D0\uBA38\uB9AC" }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: bulkApplyPrefix }, "\uB9D0\uBA38\uB9AC \uC801\uC6A9"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", style: { marginLeft: "auto" }, onClick: () => setSelectedIds(/* @__PURE__ */ new Set()) }, "\uC120\uD0DD \uD574\uC81C")), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)", textTransform: "uppercase" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 8px", textAlign: "center", width: 36 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: pagePosts.length > 0 && pagePosts.every((p) => selectedIds2.has(p.id)),
      onChange: (e) => {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (e.target.checked) pagePosts.forEach((p) => next.add(p.id));
          else pagePosts.forEach((p) => next.delete(p.id));
          return next;
        });
      },
      "aria-label": "\uD604\uC7AC \uD398\uC774\uC9C0 \uC804\uCCB4 \uC120\uD0DD"
    }
  )), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "ID"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uBD84\uB958"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uB9D0\uBA38\uB9AC"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC81C\uBAA9"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC791\uC131\uC790"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uB0A0\uC9DC"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "right" } }, "\uC561\uC158"))), /* @__PURE__ */ React.createElement("tbody", null, pagePosts.map((p) => /* @__PURE__ */ React.createElement("tr", { key: p.id, style: { borderBottom: "1px solid var(--line)", background: selectedIds2.has(p.id) ? "rgba(245,213,72,0.04)" : void 0 } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "14px 8px", textAlign: "center" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: selectedIds2.has(p.id),
      onChange: (e) => {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (e.target.checked) next.add(p.id);
          else next.delete(p.id);
          return next;
        });
      },
      "aria-label": `"${p.title}" \uC120\uD0DD`
    }
  )), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 14 } }, "#", String(p.id).padStart(4, "0")), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("span", { className: "badge", style: { fontSize: 9 } }, p.category)), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, p.prefix ? /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 9, padding: "1px 6px", border: "1px solid var(--primary-dim)", color: "var(--secondary)" } }, p.prefix) : /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 10 } }, "\u2014")), /* @__PURE__ */ React.createElement("td", { className: "ko-serif", style: { padding: 14, fontSize: 14 } }, p.title), /* @__PURE__ */ React.createElement("td", { className: "dim mono", style: { padding: 14 } }, p.author), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 14 } }, p.date), /* @__PURE__ */ React.createElement("td", { style: { padding: 14, textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setViewingId(p.id) }, "\uC5F4\uAE30"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => removeOne(p),
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC0AD\uC81C"
  )))))), visible.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, marginTop: 16, textAlign: "center" } }, "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."), visible.length > 0 && totalPages > 1 && /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uAC8C\uC2DC\uAE00 \uD398\uC774\uC9C0 \uC774\uB3D9", style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 18, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setPage(Math.max(1, safePage - 1)),
      disabled: safePage <= 1
    },
    "\u2190 \uC774\uC804"
  ), Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: n,
      type: "button",
      className: "btn btn-small",
      "aria-current": n === safePage ? "page" : void 0,
      onClick: () => setPage(n),
      style: {
        borderColor: n === safePage ? "var(--primary)" : "var(--line)",
        color: n === safePage ? "var(--primary)" : "var(--ink-2)",
        background: n === safePage ? "rgba(245,213,72,0.08)" : "transparent",
        minWidth: 36
      }
    },
    n
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setPage(Math.min(totalPages, safePage + 1)),
      disabled: safePage >= totalPages
    },
    "\uB2E4\uC74C \u2192"
  )), visible.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { textAlign: "center", fontSize: 10, letterSpacing: "0.2em", marginTop: 8 } }, "\uC804\uCCB4 ", visible.length, "\uAC74 \xB7 ", safePage, "/", totalPages, " \uD398\uC774\uC9C0"), viewingId && /* @__PURE__ */ React.createElement(PostViewerModal, { postId: viewingId, onClose: () => setViewingId(null) }));
};
const AdminPage = ({ go }) => {
  var _a, _b;
  const G = window.BGNJ_GUARD;
  const [tab, setTab] = React.useState("\uB300\uC2DC\uBCF4\uB4DC");
  const [kmsTab, setKmsTab] = React.useState("\uAE30\uB2A5\uC815\uC758\uC11C");
  const [postRefreshKey, setPostRefreshKey] = React.useState(0);
  const [versionPage, setVersionPage] = React.useState(1);
  React.useEffect(() => {
    var _a2, _b2;
    (_b2 = (_a2 = window.BGNJ_AUTH) == null ? void 0 : _a2.refreshUsers) == null ? void 0 : _b2.call(_a2);
    const bump = () => setPostRefreshKey((v) => v + 1);
    const events = [
      "bgnj-users-refresh",
      "bgnj-posts-refresh",
      "bgnj-columns-refresh",
      "bgnj-books-refresh",
      "bgnj-book-orders-refresh"
    ];
    events.forEach((e) => window.addEventListener(e, bump));
    return () => events.forEach((e) => window.removeEventListener(e, bump));
  }, []);
  const allCommunityPosts = React.useMemo(() => window.BGNJ_COMMUNITY.listPosts(), [postRefreshKey]);
  const allUsers = React.useMemo(() => window.BGNJ_AUTH.listUsers(), [postRefreshKey]);
  const allColumns = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COLUMNS) == null ? void 0 : _a2.listPublic) == null ? void 0 : _b2.call(_a2);
  }), [postRefreshKey]);
  const totalComments = React.useMemo(
    () => {
      var _a2;
      return Object.values(((_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2._commentsCache) || {}).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
    },
    [postRefreshKey]
  );
  const allBookOrders = React.useMemo(() => {
    var _a2, _b2;
    return ((_b2 = (_a2 = window.BGNJ_BOOK_ORDERS) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2)) || [];
  }, [postRefreshKey]);
  const pendingBookOrders = allBookOrders.filter((o) => o.status === "pending_payment").length;
  const refundRequestedOrders = allBookOrders.filter((o) => o.status === "refund_requested").length;
  const dashboardStats = React.useMemo(() => {
    const adminCount = allUsers.filter((u) => u.isAdmin).length;
    const superAdminCount = allUsers.filter((u) => u.isSuperAdmin).length;
    const userCount = allUsers.length - adminCount;
    const userToday = _countSince(allUsers, "joinedAt", 1);
    const userWeek = _countSince(allUsers, "joinedAt", 7);
    const userMonth = _countSince(allUsers, "joinedAt", 30);
    const postToday = _countSince(allCommunityPosts, "createdAt", 1);
    const postWeek = _countSince(allCommunityPosts, "createdAt", 7);
    const postMonth = _countSince(allCommunityPosts, "createdAt", 30);
    const postCatCounts = {};
    allCommunityPosts.forEach((p) => {
      const k = p.category || p.categoryId || "\uBBF8\uBD84\uB958";
      postCatCounts[k] = (postCatCounts[k] || 0) + 1;
    });
    const topCats = Object.entries(postCatCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const avgComments = allCommunityPosts.length > 0 ? (totalComments / allCommunityPosts.length).toFixed(1) : "0";
    const userColsAll = window.BGNJ_STORES.userColumns || [];
    const colsPublished = userColsAll.filter((c) => (c.status || "published") === "published").length;
    const colsDraft = userColsAll.filter((c) => c.status === "draft").length;
    const colsScheduled = userColsAll.filter((c) => c.status === "scheduled").length;
    const colsArchived = userColsAll.filter((c) => c.status === "archived").length;
    const orderStatuses = ["pending_payment", "paid", "shipped", "delivered", "refund_requested", "cancelled"];
    const orderStatusLabel = { pending_payment: "\uC785\uAE08 \uB300\uAE30", paid: "\uC785\uAE08 \uD655\uC778", shipped: "\uBC30\uC1A1\uC911", delivered: "\uBC30\uC1A1 \uC644\uB8CC", refund_requested: "\uD658\uBD88 \uC2E0\uCCAD", cancelled: "\uCDE8\uC18C" };
    const orderCounts = orderStatuses.map((s) => ({
      label: orderStatusLabel[s] || s,
      value: allBookOrders.filter((o) => o.status === s).length
    }));
    return [
      {
        l: "\uC804\uCCB4 \uD68C\uC6D0",
        v: String(allUsers.length),
        d: `\uAD00\uB9AC\uC790 ${adminCount}\uBA85 \uD3EC\uD568`,
        p: true,
        details: [
          { label: "\uC77C\uBC18 \uD68C\uC6D0", value: userCount },
          { label: "\uAD00\uB9AC\uC790", value: adminCount },
          { label: "\uC288\uD37C \uAD00\uB9AC\uC790", value: superAdminCount },
          { label: "\uC624\uB298 \uAC00\uC785", value: userToday },
          { label: "\uCD5C\uADFC 7\uC77C \uAC00\uC785", value: userWeek },
          { label: "\uCD5C\uADFC 30\uC77C \uAC00\uC785", value: userMonth }
        ]
      },
      {
        l: "\uCEE4\uBBA4\uB2C8\uD2F0 \uAC8C\uC2DC\uAE00",
        v: String(allCommunityPosts.length),
        d: `\uB313\uAE00 ${totalComments}\uAC1C \uB204\uC801`,
        p: true,
        details: [
          { label: "\uC624\uB298 \uC791\uC131", value: postToday },
          { label: "\uCD5C\uADFC 7\uC77C", value: postWeek },
          { label: "\uCD5C\uADFC 30\uC77C", value: postMonth },
          { label: "\uD3C9\uADE0 \uB313\uAE00/\uAE00", value: avgComments },
          ...topCats.map(([k, v]) => ({ label: `\xB7 ${k}`, value: v }))
        ]
      },
      {
        l: "\uACF5\uAC1C \uCE7C\uB7FC",
        v: String(allColumns.length),
        d: `\uAD00\uB9AC\uC790 \uBC1C\uD589 ${colsPublished}\uAC74 \xB7 \uC784\uC2DC/\uC608\uC57D ${colsDraft + colsScheduled}\uAC74`,
        p: true,
        details: [
          { label: "\uAC8C\uC2DC (published)", value: colsPublished },
          { label: "\uC784\uC2DC (draft)", value: colsDraft },
          { label: "\uC608\uC57D (scheduled)", value: colsScheduled },
          { label: "\uBCF4\uAD00 (archived)", value: colsArchived },
          { label: "\uAD00\uB9AC\uC790 \uCE7C\uB7FC \uCD1D\uD569", value: userColsAll.length }
        ]
      },
      {
        l: "\uB3C4\uC11C \uC8FC\uBB38",
        v: String(allBookOrders.length),
        d: `\uC785\uAE08 \uB300\uAE30 ${pendingBookOrders}\uAC74${refundRequestedOrders > 0 ? ` \xB7 \uD658\uBD88 \uC2E0\uCCAD ${refundRequestedOrders}\uAC74` : ""}`,
        p: pendingBookOrders === 0 && refundRequestedOrders === 0,
        details: orderCounts
      }
    ];
  }, [allUsers, allCommunityPosts, totalComments, allColumns, allBookOrders, pendingBookOrders, refundRequestedOrders]);
  const latestCommunityPost = allCommunityPosts[0] || null;
  const latestColumn = allColumns[0] || null;
  const tabGroups = [
    { group: "\uC694\uC57D", items: ["\uB300\uC2DC\uBCF4\uB4DC", "\uC0AC\uC6A9\uC790 \uC5EC\uC815"] },
    { group: "\uCF58\uD150\uCE20", items: ["\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC", "\uCD94\uCC9C \uC5EC\uD589\uC9C0", "\uBA39\uACE0 \uB180\uC790", "\uC790\uACE0 \uB180\uC790", "\uC0AC\uACE0 \uB180\uC790"] },
    { group: "\uD504\uB85C\uADF8\uB7A8\xB7\uC1FC\uD551", items: ["\uAC15\uC5F0", "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8", "\uD55C\uCF20 \uC608\uC57D", "\uCC45 \uCE74\uD0C8\uB85C\uADF8", "\uCC45 \uC8FC\uBB38"] },
    // v00.177 — 사용자 보고 '커뮤니티게시판이랑 커뮤니티랑 겹쳐 매우 불편'. 단일 [커뮤니티] sub-tab 통합 (게시글/게시판/신고).
    { group: "\uCEE4\uBBA4\uB2C8\uD2F0", items: ["\uCEE4\uBBA4\uB2C8\uD2F0"] },
    { group: "\uD68C\uC6D0", items: ["\uD68C\uC6D0", "\uD68C\uC6D0 \uB4F1\uAE09"] },
    // v00.166 — 사이트 설정 7 항목을 단일 "사이트 설정" 으로 머지. SubTabsView 가 내부에서 7 sub-tab 노출.
    { group: "\uC0AC\uC774\uD2B8 \uC124\uC815", items: ["\uC0AC\uC774\uD2B8 \uC124\uC815"] },
    { group: "\uAC1C\uC778\uC815\uBCF4\xB7\uBC95\uBB34", items: ["\uC815\uBCF4\uC8FC\uCCB4 \uAD8C\uB9AC", "\uB3D9\uC758 \uAD00\uB9AC", "\uCC98\uB9AC\uD65C\uB3D9(ROPA)", "\uCFE0\uD0A4\xB7\uCD94\uC801", "\uBCF4\uC548 \uC0AC\uACE0", "\uBCF4\uC720\xB7\uD30C\uAE30", "\uAD6D\uC678 \uC774\uC804", "\uAC10\uC0AC \uB85C\uADF8"] },
    // v00.171 — '데이터 정리' (LegacyMigrationPanel) 폐기. 사용자 보고 '필요없으면 모두 다 지워'. 마이그레이션 완료 (v00.123).
    // v00.183 — 내부 인원 알람 항목 추가. v00.190 — 활동 로그 추가.
    { group: "\uC2DC\uC2A4\uD15C", items: ["\uD65C\uB3D9 \uB85C\uADF8", "\uB0B4\uBD80 \uC54C\uB78C", "\uBC84\uC804 \uAE30\uB85D", "KMS", "\uC624\uB958 \uB85C\uADF8", "\uC624\uB958 \uD398\uC774\uC9C0 \uBBF8\uB9AC\uBCF4\uAE30", "\uC124\uC815"] }
  ];
  const exportMemberData = (m) => {
    const snapshot = {
      exported_at: (/* @__PURE__ */ new Date()).toISOString(),
      legal_basis: "GDPR Art.15 / PIPA \xA735",
      subject: m,
      consents: m.consents.map((k) => PRIVACY_DATA.consentDefs.find((c) => c.key === k)).filter(Boolean),
      processing_activities: PRIVACY_DATA.ropa,
      retention: PRIVACY_DATA.retentionPolicies
    };
    downloadJson(`dsr-access-${m.id}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, snapshot);
  };
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [tab, kmsTab]);
  const _findGroup = React.useCallback((tabName) => {
    const g = tabGroups.find((grp) => grp.items.includes(tabName));
    return g ? g.group : tabGroups[0].group;
  }, [tabGroups]);
  const currentGroup = React.useMemo(() => _findGroup(tab), [_findGroup, tab]);
  const [openGroups, setOpenGroups] = React.useState(() => /* @__PURE__ */ new Set([_findGroup(tab)]));
  React.useEffect(() => {
    setOpenGroups((prev) => {
      if (prev.has(currentGroup)) return prev;
      const next = new Set(prev);
      next.add(currentGroup);
      return next;
    });
  }, [currentGroup]);
  const toggleGroup = (name) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };
  const handleTabClick = React.useCallback((nextTab) => {
    setTab(nextTab);
    requestAnimationFrame(() => {
      try {
        const main = document.querySelector(".admin-main");
        if (main && typeof main.scrollTo === "function") main.scrollTo({ top: 0, behavior: "smooth" });
        if (typeof window.scrollTo === "function") window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
      }
    });
  }, []);
  React.useEffect(() => {
    var _a2, _b2;
    if (!sidebarOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 900) setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    (_b2 = (_a2 = window.BGNJ_SCROLL_LOCK) == null ? void 0 : _a2.lock) == null ? void 0 : _b2.call(_a2);
    return () => {
      var _a3, _b3;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      (_b3 = (_a3 = window.BGNJ_SCROLL_LOCK) == null ? void 0 : _a3.unlock) == null ? void 0 : _b3.call(_a3);
    };
  }, [sidebarOpen]);
  return /* @__PURE__ */ React.createElement("div", { className: `admin-shell ${sidebarOpen ? "sidebar-open" : ""}`, style: { display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "calc(100vh - 72px)", position: "relative" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "admin-sidebar-toggle",
      "aria-label": sidebarOpen ? "\uBA54\uB274 \uB2EB\uAE30" : "\uBA54\uB274 \uC5F4\uAE30",
      "aria-expanded": sidebarOpen,
      "aria-controls": "admin-sidebar",
      onClick: () => setSidebarOpen((v) => !v)
    },
    /* @__PURE__ */ React.createElement("span", { className: "nav-toggle-bars", "aria-hidden": "true" })
  ), sidebarOpen && /* @__PURE__ */ React.createElement("div", { className: "admin-sidebar-backdrop", onClick: () => setSidebarOpen(false), "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("aside", { id: "admin-sidebar", "aria-label": "\uAD00\uB9AC\uC790 \uBA54\uB274", className: "admin-sidebar", style: { background: "var(--bg-2)", borderRight: "1px solid var(--line)", padding: "32px 0", overflowY: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 24px 24px", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-block",
    padding: "3px 10px",
    marginBottom: 10,
    border: "1px solid var(--line-2)",
    background: "var(--bg-3)",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "var(--ink-2)"
  } }, "v", ((_a = window.BGNJ_VERSION) == null ? void 0 : _a.version) || "?", " \xB7 ", ((_b = window.BGNJ_VERSION) == null ? void 0 : _b.build) || "?"), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, letterSpacing: "0.3em", color: "var(--ink-3)" } }, "\u25C6 ADMIN CONSOLE"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 20, marginTop: 8, color: "var(--ink)" } }, "\uAD00\uB9AC\uC790"), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 11, marginTop: 4, color: "var(--ink-3)" } }, "contact@bgnj.net"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, padding: "8px 10px", background: "var(--bg-3)", border: "1px solid var(--line-2)", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-2)", letterSpacing: "0.15em" } }, "DPO \xB7 contact@bgnj.net"), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, marginTop: 6, letterSpacing: "0.1em", color: "var(--ink-3)" } }, "\uC801\uC6A9\uBC95: GDPR + PIPA"), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, letterSpacing: "0.1em", color: "var(--ink-3)" } }, "\uCD5C\uADFC DPIA: 2026.03.02")), tabGroups.map((grp) => {
    const isOpen = openGroups.has(grp.group);
    const hasCurrent = grp.items.includes(tab);
    return /* @__PURE__ */ React.createElement("div", { key: grp.group, style: { padding: "2px 0" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => toggleGroup(grp.group),
        "aria-expanded": isOpen,
        className: "mono",
        style: {
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          // v00.242 — 사용자 민원 '좌측 메뉴 가독성'. mono 11px → 12px + ink 강도 ↑.
          // 활성 그룹은 secondary 보다 ink + 좌측 4px primary border 로 시각 위계 명료화.
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: hasCurrent ? "var(--ink)" : "var(--ink-2)",
          background: isOpen ? "rgba(15,23,42,0.04)" : "transparent",
          borderLeft: hasCurrent ? "4px solid var(--primary)" : "4px solid transparent",
          border: "none",
          borderLeftWidth: 4,
          borderLeftStyle: "solid",
          borderLeftColor: hasCurrent ? "var(--primary)" : "transparent",
          cursor: "pointer",
          textTransform: "uppercase"
        }
      },
      /* @__PURE__ */ React.createElement("span", null, grp.group, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--ink-3)", marginLeft: 8, fontWeight: 500, letterSpacing: "0.1em" } }, "\xB7 ", grp.items.length)),
      /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
        fontSize: 11,
        color: "var(--ink-3)",
        transition: "transform .2s",
        display: "inline-block",
        transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)"
      } }, "\u25BE")
    ), isOpen && /* @__PURE__ */ React.createElement("ul", { role: "list", style: {
      listStyle: "none",
      margin: 0,
      padding: "4px 0 10px",
      // 그룹 펼친 영역 좌측 세로 가이드 라인 — 트리 위계 시각화
      position: "relative",
      background: "rgba(15,23,42,0.015)",
      borderBottom: "1px solid var(--line)"
    } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
      position: "absolute",
      left: 32,
      top: 6,
      bottom: 10,
      width: 1,
      background: "var(--line-2)"
    } }), grp.items.map((t) => {
      const active = tab === t;
      return /* @__PURE__ */ React.createElement("li", { key: t }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: () => handleTabClick(t),
          "aria-current": active ? "page" : void 0,
          style: {
            width: "100%",
            textAlign: "left",
            padding: "10px 24px 10px 44px",
            // v00.242 — sub-tab 가독성 ↑. 14/medium + ink (비활성) / ink + bold + primary 배경 (활성).
            fontSize: 14,
            fontWeight: active ? 700 : 500,
            background: active ? "rgba(245,213,72,0.18)" : "transparent",
            color: active ? "var(--ink)" : "var(--ink)",
            border: "none",
            borderLeft: active ? "4px solid var(--primary)" : "4px solid transparent",
            letterSpacing: "0.01em",
            cursor: "pointer",
            position: "relative"
          },
          onMouseEnter: (e) => {
            if (!active) e.currentTarget.style.background = "rgba(15,23,42,0.04)";
          },
          onMouseLeave: (e) => {
            if (!active) e.currentTarget.style.background = "transparent";
          }
        },
        t
      ));
    })));
  })), /* @__PURE__ */ React.createElement("div", { className: "admin-main", style: { padding: 40, overflow: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.25em" } }, "ADMIN / ", tab.toUpperCase()), /* @__PURE__ */ React.createElement("h1", { className: "ko-serif", style: { fontSize: 32, fontWeight: 500, marginTop: 6 } }, tab)), /* @__PURE__ */ React.createElement("time", { className: "mono dim-2", style: { fontSize: 11 }, dateTime: (/* @__PURE__ */ new Date()).toISOString() }, window.BGNJ_FMT.kstDateTime())), tab === "\uB300\uC2DC\uBCF4\uB4DC" && /* @__PURE__ */ React.createElement(
    DashboardPanel,
    {
      dashboardStats,
      allUsers,
      allCommunityPosts,
      latestCommunityPost,
      latestColumn,
      setTab,
      G
    }
  ), false, tab === "\uC0AC\uC6A9\uC790 \uC5EC\uC815" && /* @__PURE__ */ React.createElement(UserJourneyPanel, null), tab === "\uBC84\uC804 \uAE30\uB85D" && (() => {
    var _a2, _b2;
    const VERSIONS_PER_PAGE = 10;
    const total = ADMIN_VERSION_HISTORY.length;
    const totalPages = Math.max(1, Math.ceil(total / VERSIONS_PER_PAGE));
    const safePage = Math.min(versionPage, totalPages);
    const start = (safePage - 1) * VERSIONS_PER_PAGE;
    const slice = ADMIN_VERSION_HISTORY.slice(start, start + VERSIONS_PER_PAGE);
    const latest = ADMIN_VERSION_HISTORY[0];
    return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 6 } }, "VERSION HISTORY"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, lineHeight: 1.6 } }, "\uCD1D ", /* @__PURE__ */ React.createElement("span", { className: "ko-serif gold-2", style: { fontSize: 20 } }, total), "\uAC1C \uBC84\uC804 \uAE30\uB85D", latest && /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11, marginLeft: 10 } }, "\uCD5C\uC2E0 ", latest.version, " \xB7 ", latest.datetime ? ((_b2 = (_a2 = window.BGNJ_FMT) == null ? void 0 : _a2.kstDateTime) == null ? void 0 : _b2.call(_a2, latest.datetime)) || latest.date : latest.date))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => {
      var _a3, _b3;
      const esc = (v) => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
      const rows = [["version", "datetime_kst", "date", "summary", "details", "context"]];
      for (const e of ADMIN_VERSION_HISTORY) {
        rows.push([
          e.version || "",
          e.datetime ? ((_b3 = (_a3 = window.BGNJ_FMT) == null ? void 0 : _a3.kstDateTime) == null ? void 0 : _b3.call(_a3, e.datetime)) || "" : "",
          e.date || "",
          e.summary || "",
          Array.isArray(e.details) ? e.details.join(" | ") : "",
          e.context || ""
        ]);
      }
      const csv = "\uFEFF" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
      downloadCsv(`bgnj-version-history-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, csv);
    } }, "\u{1F4E5} CSV \uB2E4\uC6B4\uB85C\uB4DC"), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 11, letterSpacing: "0.16em" } }, safePage, " / ", totalPages, " \uD398\uC774\uC9C0 \xB7 ", start + 1, "\u2013", Math.min(start + VERSIONS_PER_PAGE, total), "\uAC74 \uD45C\uC2DC"))), slice.map((entry) => {
      var _a3, _b3;
      return /* @__PURE__ */ React.createElement("article", { key: entry.version, className: "card card-gold", style: { padding: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", marginBottom: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.24em", marginBottom: 8 } }, "VERSION LOG"), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 24 } }, "v", entry.version)), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 11, textAlign: "right" } }, entry.datetime ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, ((_b3 = (_a3 = window.BGNJ_FMT) == null ? void 0 : _a3.kstDateTime) == null ? void 0 : _b3.call(_a3, entry.datetime)) || entry.date)) : entry.date)), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 } }, "\uD575\uC2EC \uC218\uC815\uC0AC\uD56D"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8 } }, entry.summary)), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 } }, "\uC138\uBD80 \uC5C5\uB370\uC774\uD2B8 \uB0B4\uC5ED"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 8 } }, entry.details.map((detail) => /* @__PURE__ */ React.createElement("div", { key: detail, className: "card", style: { padding: 14 } }, detail)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 } }, "\uC218\uC815 \uACC4\uAE30\uC640 \uBC30\uACBD"), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14 } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8 } }, entry.context))));
    }), totalPages > 1 && /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uBC84\uC804 \uAE30\uB85D \uD398\uC774\uC9C0 \uC774\uB3D9", style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => setVersionPage(Math.max(1, safePage - 1)),
        disabled: safePage <= 1
      },
      "\u2190 \uC774\uC804"
    ), Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: n,
        type: "button",
        className: "btn btn-small",
        "aria-current": n === safePage ? "page" : void 0,
        onClick: () => setVersionPage(n),
        style: {
          borderColor: n === safePage ? "var(--primary)" : "var(--line)",
          color: n === safePage ? "var(--primary)" : "var(--ink-2)",
          background: n === safePage ? "rgba(245,213,72,0.08)" : "transparent",
          minWidth: 36
        }
      },
      n
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => setVersionPage(Math.min(totalPages, safePage + 1)),
        disabled: safePage >= totalPages
      },
      "\uB2E4\uC74C \u2192"
    )));
  })(), tab === "KMS" && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "card card-gold", style: { padding: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.24em", marginBottom: 8 } }, "KMS SUMMARY"), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 24, marginBottom: 12 } }, "KMS\uB294 \uB450 \uAC1C\uC758 \uD0ED\uC73C\uB85C \uAD6C\uC131\uB429\uB2C8\uB2E4"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 14 } }, "KMS\uC758 \uC81C1 \uAE30\uB2A5\uC740 \uAE30\uB2A5\uC815\uC758\uC11C\uC785\uB2C8\uB2E4. \uC0AC\uC774\uD2B8\uAC00 \uC874\uC7AC\uD558\uB294 5\uAC00\uC9C0 \uBBF8\uC158(\uBC45\uAE30\uB178\uC790 \uCEE4\uBBA4\uB2C8\uD2F0 / \uAC15\uC5F0 \uC77C\uC815 / \uCE7C\uB7FC / \uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8 / \uCC45 \uD310\uB9E4)\uC744 \uAE30\uC900\uC73C\uB85C \uD604\uC7AC \uC5B4\uB5A4 \uAE30\uB2A5\uC774 \uC788\uACE0 \uBB34\uC5C7\uC774 \uBE44\uC5B4 \uC788\uB294\uC9C0\uB97C \uBA3C\uC800 \uBCF4\uC5EC\uC8FC\uACE0, \uADF8 \uC704\uC5D0 \uB514\uC790\uC778 \uC6D0\uCE59\uC744 \uD568\uAED8 \uB461\uB2C8\uB2E4. KMS\uC5D0 \uC9C4\uC785\uD558\uBA74 \uAE30\uBCF8\uC740 `\uAE30\uB2A5\uC815\uC758\uC11C` \uD0ED\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }, className: "stats-grid" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 6 } }, "\uD0ED 1 \xB7 \uAE30\uBCF8"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 18 } }, "\uAE30\uB2A5\uC815\uC758\uC11C"), /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 12, marginTop: 6, lineHeight: 1.6 } }, "5\uAC1C \uBBF8\uC158 + \uACF5\uD1B5 \uAE30\uBC18\uC744 \uC601\uC5ED \uB2E8\uC704\uB85C \uC815\uB9AC\uD558\uACE0, \uC601\uC5ED\uB9C8\uB2E4 \uAE30\uB2A5 / \uAE30\uC220 \uC2A4\uD399 / \uC720\uC758\uD560 \uC810 / \uAC1C\uBC1C \uC774\uC288\uB97C \uD568\uAED8 \uAE30\uB85D\uD569\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 6 } }, "\uD0ED 2"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 18 } }, "\uB514\uC790\uC778"), /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 12, marginTop: 6, lineHeight: 1.6 } }, "\uC0C8 \uD654\uBA74\uC744 \uB9CC\uB4E4\uAC70\uB098 \uAE30\uC874 UI\uB97C \uBC14\uAFC0 \uB54C \uBA3C\uC800 \uD655\uC778\uD558\uB294 \uBE0C\uB79C\uB4DC \uBB34\uB4DC, \uCEEC\uB7EC, \uD0C0\uC774\uD3EC, \uB808\uC774\uC544\uC6C3, \uAE08\uC9C0 \uC6D0\uCE59\uC785\uB2C8\uB2E4.")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, role: "tablist", "aria-label": "KMS \uC601\uC5ED \uC120\uD0DD" }, ["\uAE30\uB2A5\uC815\uC758\uC11C", "\uB514\uC790\uC778"].map((item) => {
    const on = kmsTab === item;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: item,
        type: "button",
        role: "tab",
        "aria-selected": on,
        className: "btn btn-small",
        onClick: () => setKmsTab(item),
        style: {
          borderColor: on ? "var(--primary)" : "var(--line-2)",
          color: on ? "var(--primary)" : "var(--ink)",
          background: on ? "rgba(245,213,72,0.10)" : "var(--bg-2)",
          fontWeight: on ? 700 : 500
        }
      },
      item
    );
  })), kmsTab === "\uAE30\uB2A5\uC815\uC758\uC11C" && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 240px", gap: 24, alignItems: "start" }, className: "kms-fdef-layout" }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 16, minWidth: 0 } }, /* @__PURE__ */ React.createElement("article", { id: "fdef-overview", className: "card card-gold", style: { padding: 24, scrollMarginTop: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.24em", marginBottom: 8 } }, "MISSION OVERVIEW"), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 22, marginBottom: 10 } }, "5\uAC00\uC9C0 \uBBF8\uC158 \uD3C9\uAC00 \uC694\uC57D"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 18 } }, "\uC774 \uC0AC\uC774\uD2B8\uAC00 \uC874\uC7AC\uD558\uB294 \uC774\uC720\uB294 \uB2E4\uC74C \uB2E4\uC12F \uAC00\uC9C0\uC785\uB2C8\uB2E4. \uAC01 \uBBF8\uC158\uC740 \uC544\uB798 \uC601\uC5ED\uC73C\uB85C \uC774\uC5B4\uC9C0\uBA70, \uAC01 \uC601\uC5ED\uC758 \uD3C9\uAC00\uC640 \uBE48 \uCE78\uC740 \uBCF8 \uAE30\uB2A5\uC815\uC758\uC11C \uBCF8\uBB38\uC5D0\uC11C \uC601\uC5ED\uBCC4\uB85C \uC790\uC138\uD788 \uAE30\uB85D\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 10 } }, MISSION_OVERVIEW.map((m) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: m.id,
      type: "button",
      onClick: () => {
        const el = document.getElementById(`fdef-${m.id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      className: "card",
      style: { padding: 14, textAlign: "left", cursor: "pointer", background: "transparent" }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "baseline" } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11, letterSpacing: "0.18em" } }, "MISSION ", m.number), /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: 16 } }, m.title)), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.18em", color: "var(--secondary)" } }, m.state, " \xB7 ", m.coverage)),
    /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 13, lineHeight: 1.7, marginBottom: 6 } }, m.short),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, lineHeight: 1.7, color: "var(--ink-2)" } }, m.verdict)
  )))), FEATURE_DOMAINS.map((domain) => {
    var _a2, _b2, _c, _d;
    const statusTone = ((_a2 = domain.status) == null ? void 0 : _a2.includes("\uBBF8\uAD6C\uD604")) ? "var(--danger)" : ((_b2 = domain.status) == null ? void 0 : _b2.includes("\uBD80\uBD84")) || ((_c = domain.status) == null ? void 0 : _c.includes("\uCE74\uD0C8\uB85C\uADF8")) || ((_d = domain.status) == null ? void 0 : _d.includes("UI")) ? "var(--ink-2)" : "var(--primary)";
    return /* @__PURE__ */ React.createElement("article", { id: `fdef-${domain.id}`, key: domain.id, className: "card", style: { padding: 24, scrollMarginTop: 24 } }, /* @__PURE__ */ React.createElement("header", { style: { borderBottom: "1px solid var(--line)", paddingBottom: 16, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline", flexWrap: "wrap", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "baseline" } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11, letterSpacing: "0.22em" } }, domain.id === "infra" ? "BASE" : `MISSION ${domain.number}`), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 24 } }, domain.title)), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 11, letterSpacing: "0.2em", color: statusTone } }, "STATUS \xB7 ", domain.status)), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 10 } }, domain.role), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em" } }, "routes: ", domain.routes.join(" \xB7 "))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 18 } }, /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "\uD604\uC7AC \uD3C9\uAC00"), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, lineHeight: 1.8 } }, domain.evaluation)), domain.missing && domain.missing.length > 0 && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "\uC5C6\uB294 \uAE30\uB2A5 / \uC644\uC131\uB3C4\uB97C \uB192\uC774\uB824\uBA74 \uD544\uC694\uD55C \uAC83"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 } }, domain.missing.map((item) => /* @__PURE__ */ React.createElement("li", { key: item, style: { padding: "8px 12px", borderLeft: "2px solid var(--primary-dim)", background: "rgba(245,213,72,0.04)", fontSize: 13, lineHeight: 1.7 } }, item)))), /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "\uAE30\uB2A5 (", domain.features.length, ")"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 12 } }, domain.features.map((feature) => {
      var _a3;
      const fTone = feature.status === "\uAD6C\uD604\uB428" ? "var(--primary)" : feature.status === "\uBBF8\uAD6C\uD604" || ((_a3 = feature.status) == null ? void 0 : _a3.startsWith("UI\uB9CC")) ? "var(--danger)" : "var(--ink-2)";
      return /* @__PURE__ */ React.createElement("div", { key: feature.name, className: "card", style: { padding: 16, borderColor: "var(--line-2)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 17 } }, feature.name), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: fTone } }, feature.status)), feature.summary && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 12 } }, feature.summary), feature.elements && feature.elements.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", marginBottom: 6 } }, "\uC694\uC18C"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 4 } }, feature.elements.map((el) => /* @__PURE__ */ React.createElement("li", { key: el, style: { fontSize: 12, lineHeight: 1.7, paddingLeft: 14, position: "relative" } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 0, color: "var(--primary-dim)" } }, "\xB7"), el)))), feature.techSpec && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", marginBottom: 4 } }, "\uAE30\uC220 \uC2A4\uD399"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, lineHeight: 1.7, color: "var(--ink-2)" } }, feature.techSpec)), feature.caution && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", marginBottom: 4 } }, "\uC720\uC758\uD560 \uC810"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, lineHeight: 1.7, color: "var(--ink-2)" } }, feature.caution)), feature.issues && feature.issues.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", marginBottom: 4 } }, "\uAC1C\uBC1C \uC774\uC288"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 3 } }, feature.issues.map((issue) => /* @__PURE__ */ React.createElement("li", { key: issue, style: { fontSize: 12, lineHeight: 1.7, paddingLeft: 14, position: "relative", color: "var(--ink-2)" } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 0, color: "var(--danger)" } }, "!"), issue)))));
    }))), domain.techSpec && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "\uC601\uC5ED \uCC28\uC6D0 \xB7 \uAE30\uC220 \uC2A4\uD399"), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, lineHeight: 1.8, fontSize: 13 } }, domain.techSpec)), domain.cautions && domain.cautions.length > 0 && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "\uC601\uC5ED \uCC28\uC6D0 \xB7 \uC720\uC758\uD560 \uC810"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 } }, domain.cautions.map((c) => /* @__PURE__ */ React.createElement("li", { key: c, style: { padding: "8px 12px", borderLeft: "2px solid var(--ink-3)", fontSize: 13, lineHeight: 1.7 } }, c)))), domain.issues && domain.issues.length > 0 && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "\uC601\uC5ED \uCC28\uC6D0 \xB7 \uAC1C\uBC1C\uACFC\uC815\uC5D0\uC11C \uB9C8\uC8FC\uD55C \uC774\uC288"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 } }, domain.issues.map((iss) => /* @__PURE__ */ React.createElement("li", { key: iss, style: { padding: "8px 12px", borderLeft: "2px solid var(--danger)", fontSize: 13, lineHeight: 1.7 } }, iss))))));
  })), /* @__PURE__ */ React.createElement("aside", { "aria-label": "\uAE30\uB2A5\uC815\uC758\uC11C \uBAA9\uCC28", style: { position: "sticky", top: 24, alignSelf: "start" }, className: "kms-fdef-toc" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 12 } }, "TABLE OF CONTENTS"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 4 } }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => {
        const el = document.getElementById("fdef-overview");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      style: {
        width: "100%",
        textAlign: "left",
        padding: "8px 10px",
        background: "transparent",
        border: "1px solid transparent",
        color: "var(--ink-2)",
        fontSize: 12,
        lineHeight: 1.5,
        cursor: "pointer",
        borderLeft: "2px solid var(--primary)"
      }
    },
    "5\uAC00\uC9C0 \uBBF8\uC158 \uD3C9\uAC00"
  )), FEATURE_DOMAINS.map((d) => /* @__PURE__ */ React.createElement("li", { key: d.id }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => {
        const el = document.getElementById(`fdef-${d.id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      style: {
        width: "100%",
        textAlign: "left",
        padding: "8px 10px",
        background: "transparent",
        border: "1px solid transparent",
        color: "var(--ink-2)",
        fontSize: 12,
        lineHeight: 1.5,
        cursor: "pointer",
        borderLeft: "2px solid var(--line-2)"
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.2em", marginBottom: 2 } }, d.id === "infra" ? "BASE" : `MISSION ${d.number}`),
    d.label
  )))), /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid var(--line)", marginTop: 14, paddingTop: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", marginBottom: 6 } }, "\uAD6C\uC131"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 4, fontSize: 11, lineHeight: 1.7, color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("li", null, "\xB7 \uC601\uC5ED \uD3C9\uAC00"), /* @__PURE__ */ React.createElement("li", null, "\xB7 \uC5C6\uB294 \uAE30\uB2A5 \uC815\uB9AC"), /* @__PURE__ */ React.createElement("li", null, "\xB7 \uAE30\uB2A5 + \uC694\uC18C"), /* @__PURE__ */ React.createElement("li", null, "\xB7 \uAE30\uC220 \uC2A4\uD399"), /* @__PURE__ */ React.createElement("li", null, "\xB7 \uC720\uC758\uD560 \uC810"), /* @__PURE__ */ React.createElement("li", null, "\xB7 \uAC1C\uBC1C \uC774\uC288")))))), kmsTab === "\uB514\uC790\uC778" && /* @__PURE__ */ React.createElement(DesignSystemView, null)), tab === "\uCEE4\uBBA4\uB2C8\uD2F0" && /* @__PURE__ */ React.createElement(
    SubTabsView,
    {
      storageKey: "bgnj_admin_subtab_community",
      defaultKey: "posts",
      subTabs: [
        // v00.180 — 인라인 JSX → CommunityPostsAdminPanel 호출 (DRY 추출).
        { key: "posts", label: "\uAC8C\uC2DC\uAE00", render: () => /* @__PURE__ */ React.createElement(
          CommunityPostsAdminPanel,
          {
            posts: allCommunityPosts,
            onChange: () => setPostRefreshKey((v) => v + 1)
          }
        ) },
        { key: "boards", label: "\uAC8C\uC2DC\uD310", render: () => /* @__PURE__ */ React.createElement(CommunityBoardsPanel, null) },
        { key: "reports", label: "\uC2E0\uACE0", render: () => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CorruptedBodyInspector, { go }), /* @__PURE__ */ React.createElement(ReportQueuePanel, { onRefresh: () => setPostRefreshKey((v) => v + 1), go })) }
      ]
    }
  ), tab === "\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC" && /* @__PURE__ */ React.createElement(ColumnsHubPanel, { allColumns }), tab === "\uAC15\uC5F0" && /* @__PURE__ */ React.createElement(LectureAdminPanel, { go }), tab === "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8" && /* @__PURE__ */ React.createElement(TourAdminPanel, { go }), tab === "\uD68C\uC6D0" && /* @__PURE__ */ React.createElement(MemberAdminPanel, { go }), tab === "\uCC45 \uC8FC\uBB38" && /* @__PURE__ */ React.createElement(BookOrderAdminPanel, { go }), tab === "\uCC45 \uCE74\uD0C8\uB85C\uADF8" && /* @__PURE__ */ React.createElement(BooksAdminPanel, null), tab === "\uC815\uBCF4\uC8FC\uCCB4 \uAD8C\uB9AC" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 16 } }, "GDPR Art.15\u201322 / PIPA \xA735\u201338. \uC751\uB2F5\uAE30\uD55C: ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "GDPR 1\uAC1C\uC6D4"), " / ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "PIPA 10\uC77C"), "."), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "ID"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uAD8C\uB9AC\uC720\uD615"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC815\uBCF4\uC8FC\uCCB4"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC801\uC6A9\uBC95"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC811\uC218"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uAE30\uD55C"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "right" } }, "\uC561\uC158"))), /* @__PURE__ */ React.createElement("tbody", null, PRIVACY_DATA.dsrRequests.map((r) => {
    const left = r.status === "done" ? null : formatTimeLeft(r.dueAt);
    const toneColor = (left == null ? void 0 : left.tone) === "danger" ? "var(--danger)" : (left == null ? void 0 : left.tone) === "warn" ? "var(--primary-hover)" : "var(--ink-2)";
    const label = DSR_LABELS[r.type];
    return /* @__PURE__ */ React.createElement("tr", { key: r.id, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { className: "mono gold", style: { padding: 14 } }, r.id), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "ko-serif" }, label == null ? void 0 : label.ko), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10 } }, label == null ? void 0 : label.gdpr, " \xB7 ", label == null ? void 0 : label.pipa)), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", null, r.user), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10 } }, r.email)), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("span", { className: "badge" }, r.law)), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 14 } }, r.openedAt.slice(0, 10)), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: 14, color: toneColor } }, r.status === "done" ? "\uC644\uB8CC" : left == null ? void 0 : left.text), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("span", { className: "badge", style: {
      borderColor: r.status === "done" ? "var(--primary-dim)" : r.status === "in_progress" ? "var(--primary)" : "var(--line-2)",
      color: r.status === "done" ? "var(--primary-dim)" : r.status === "in_progress" ? "var(--primary)" : "var(--ink-2)"
    } }, r.status === "open" ? "\uC811\uC218" : r.status === "in_progress" ? "\uCC98\uB9AC\uC911" : "\uC644\uB8CC")), /* @__PURE__ */ React.createElement("td", { style: { padding: 14, textAlign: "right" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small" }, "\uCC98\uB9AC")));
  })))), tab === "\uB3D9\uC758 \uAD00\uB9AC" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 16 } }, "GDPR Art.7 / PIPA \xA715, \xA722. \uB3D9\uC758\uB294 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uC790\uC720\xB7\uAD6C\uCCB4\xB7\uACE0\uC9C0\xB7\uCCA0\uD68C \uAC00\uB2A5"), "\uD574\uC57C \uD558\uBA70, \uBC84\uC804\uBCC4 \uC774\uB825\uC774 \uBCF4\uC874\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uD56D\uBAA9"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uD544\uC218"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uBC84\uC804"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uBC95\uC801 \uADFC\uAC70"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uAC1C\uC815\uC77C"))), /* @__PURE__ */ React.createElement("tbody", null, PRIVACY_DATA.consentDefs.map((c) => /* @__PURE__ */ React.createElement("tr", { key: c.key, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { className: "ko-serif", style: { padding: 14 } }, c.label), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: c.required ? "var(--primary)" : "var(--line-2)", color: c.required ? "var(--primary)" : "var(--ink-2)" } }, c.required ? "\uD544\uC218" : "\uC120\uD0DD")), /* @__PURE__ */ React.createElement("td", { className: "mono gold", style: { padding: 14 } }, c.version), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, c.lawful), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 14 } }, c.updated)))))), tab === "\uCC98\uB9AC\uD65C\uB3D9(ROPA)" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 16 } }, "GDPR Art.30. \uBAA8\uB4E0 \uCC98\uB9AC \uBAA9\uC801\xB7\uBC95\uC801 \uADFC\uAC70\xB7\uBCF4\uC720\uAE30\uAC04\xB7\uC218\uD0C1\uC790\xB7\uAD6D\uC678\uC774\uC804\uC744 \uBB38\uC11C\uD654\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto", border: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 880 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left", width: 90 } }, "ID"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left" } }, "\uCC98\uB9AC \uBAA9\uC801"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left", width: 120 } }, "\uBC95\uC801 \uADFC\uAC70"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left" } }, "\uC218\uC9D1 \uD56D\uBAA9"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left", width: 140 } }, "\uBCF4\uC720\uAE30\uAC04"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left", width: 140 } }, "\uC218\uD0C1\uC0AC"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "12px 14px", textAlign: "left", width: 120 } }, "\uAD6D\uC678\uC774\uC804"))), /* @__PURE__ */ React.createElement("tbody", null, PRIVACY_DATA.ropa.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.id, style: { borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { className: "mono gold", style: { padding: "12px 14px", fontSize: 11, letterSpacing: "0.14em", verticalAlign: "top" } }, r.id), /* @__PURE__ */ React.createElement("td", { className: "ko-serif", style: { padding: "12px 14px", fontWeight: 500, verticalAlign: "top" } }, r.purpose), /* @__PURE__ */ React.createElement("td", { className: "gold", style: { padding: "12px 14px", verticalAlign: "top" } }, r.lawful), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px 14px", verticalAlign: "top" } }, r.items), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px 14px", verticalAlign: "top" } }, r.retention), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px 14px", verticalAlign: "top" } }, r.processor), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px 14px", verticalAlign: "top" } }, r.transfer))))))), tab === "\uCFE0\uD0A4\xB7\uCD94\uC801" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 16 } }, "ePrivacy Directive / PIPA \xA739\uC7588. \uD544\uC218 \uC678 \uCFE0\uD0A4\uB294 \uC0AC\uC804 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uC635\uD2B8\uC778 \uB3D9\uC758"), "\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uCFE0\uD0A4\uBA85"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uBD84\uB958"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uBAA9\uC801"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uBCF4\uAD00"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uB2F9\uC0AC\uC790"))), /* @__PURE__ */ React.createElement("tbody", null, PRIVACY_DATA.cookies.map((c) => /* @__PURE__ */ React.createElement("tr", { key: c.name, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { className: "mono gold", style: { padding: 14 } }, c.name), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: c.cat === "\uD544\uC218" ? "var(--primary)" : "var(--line-2)", color: c.cat === "\uD544\uC218" ? "var(--primary)" : "var(--ink-2)" } }, c.cat)), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, c.purpose), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 14 } }, c.ttl), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 14 } }, c.party)))))), tab === "\uBCF4\uC548 \uC0AC\uACE0" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 16 } }, "GDPR Art.33 \u2014 \uC778\uC9C0 \uD6C4 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "72\uC2DC\uAC04 \uB0B4 \uAC10\uB3C5\uAE30\uAD00 \uD1B5\uC9C0"), ". PIPA \xA734 \u2014 \uC778\uC9C0 \uD6C4 72\uC2DC\uAC04 \uB0B4 \uC815\uBCF4\uC8FC\uCCB4 \uBC0F \uAC1C\uC778\uC815\uBCF4\uC704 \uD1B5\uC9C0."), PRIVACY_DATA.breaches.map((b) => {
    const toneColor = b.severity === "high" ? "var(--danger)" : b.severity === "medium" ? "var(--primary-hover)" : "var(--ink-2)";
    return /* @__PURE__ */ React.createElement("article", { key: b.id, className: "card", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.2em" } }, b.id), /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: toneColor, color: toneColor } }, "\uC2EC\uAC01\uB3C4: ", b.severity)), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 8 } }, b.kind), /* @__PURE__ */ React.createElement("dl", { style: { display: "grid", gridTemplateColumns: "120px 1fr", gap: "4px 16px", fontSize: 12, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 10 } }, "\uAC10\uC9C0"), /* @__PURE__ */ React.createElement("dd", { className: "mono" }, b.detectedAt), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 10 } }, "72h \uAE30\uD55C"), /* @__PURE__ */ React.createElement("dd", { className: "mono" }, b.notifyDueAt), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 10 } }, "\uC601\uD5A5 \uC8FC\uCCB4"), /* @__PURE__ */ React.createElement("dd", null, window.BGNJ_FMT.currency(b.affected), "\uBA85"), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 10 } }, "\uB2F9\uAD6D \uD1B5\uC9C0"), /* @__PURE__ */ React.createElement("dd", { className: b.authorityNotified ? "gold" : "dim-2" }, b.authorityNotified ? "\u2713 \uC644\uB8CC" : "\u2014"), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 10 } }, "\uC8FC\uCCB4 \uD1B5\uC9C0"), /* @__PURE__ */ React.createElement("dd", { className: b.subjectNotified ? "gold" : "dim-2" }, b.subjectNotified ? "\u2713 \uC644\uB8CC" : "\u2014")), b.note && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, marginTop: 12, lineHeight: 1.7 } }, b.note));
  }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold" }, "\uC0C8 \uC0AC\uACE0 \uC811\uC218 \u2192")), tab === "\uBCF4\uC720\xB7\uD30C\uAE30" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 16 } }, "GDPR Art.5(1)(e) \uC800\uC7A5\uC81C\uD55C \uC6D0\uCE59 / PIPA \xA721. \uBAA9\uC801 \uB2EC\uC131 \uD6C4 \uC9C0\uCCB4 \uC5C6\uC774 \uD30C\uAE30\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uB370\uC774\uD130 \uBD84\uB958"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uBCF4\uC720\uAE30\uAC04"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uADFC\uAC70"))), /* @__PURE__ */ React.createElement("tbody", null, PRIVACY_DATA.retentionPolicies.map((r, i) => /* @__PURE__ */ React.createElement("tr", { key: i, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { className: "ko-serif", style: { padding: 14 } }, r.category), /* @__PURE__ */ React.createElement("td", { className: "mono gold", style: { padding: 14 } }, r.period), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, r.lawful)))))), tab === "\uAD6D\uC678 \uC774\uC804" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 16 } }, "GDPR Chapter V / PIPA \xA728\uC7588. \uC81C3\uAD6D \uC774\uC804 \uC2DC \uC801\uC815\uC131 \uACB0\uC815 \uB610\uB294 SCCs \uB4F1 \uC548\uC804\uC7A5\uCE58\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC218\uD0C1\xB7\uC774\uC804 \uB300\uC0C1"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uAD6D\uAC00"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uBAA9\uC801"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uD56D\uBAA9"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 12, textAlign: "left" } }, "\uC548\uC804\uC7A5\uCE58"))), /* @__PURE__ */ React.createElement("tbody", null, PRIVACY_DATA.transfers.map((t, i) => /* @__PURE__ */ React.createElement("tr", { key: i, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { className: "ko-serif", style: { padding: 14 } }, t.recipient), /* @__PURE__ */ React.createElement("td", { style: { padding: 14 } }, t.country), /* @__PURE__ */ React.createElement("td", { className: "dim", style: { padding: 14 } }, t.purpose), /* @__PURE__ */ React.createElement("td", { className: "mono", style: { padding: 14, fontSize: 11 } }, t.items), /* @__PURE__ */ React.createElement("td", { className: "gold mono", style: { padding: 14, fontSize: 11 } }, t.basis)))))), tab === "\uCD94\uCC9C \uC5EC\uD589\uC9C0" && /* @__PURE__ */ React.createElement(RecommendationsAdminPanel, null), tab === "\uBA39\uACE0 \uB180\uC790" && window.KindPagePanel && /* @__PURE__ */ React.createElement(window.KindPagePanel, { kind: "eat" }), tab === "\uC790\uACE0 \uB180\uC790" && window.KindPagePanel && /* @__PURE__ */ React.createElement(window.KindPagePanel, { kind: "sleep" }), tab === "\uC0AC\uACE0 \uB180\uC790" && window.KindPagePanel && /* @__PURE__ */ React.createElement(window.KindPagePanel, { kind: "shop" }), tab === "\uD55C\uCF20 \uC608\uC57D" && window.HangyeonAdminPanel && /* @__PURE__ */ React.createElement(window.HangyeonAdminPanel, null), tab === "\uC0AC\uC774\uD2B8 \uC124\uC815" && /* @__PURE__ */ React.createElement(
    SubTabsView,
    {
      storageKey: "bgnj_admin_subtab_site_settings",
      defaultKey: "content",
      subTabs: [
        // v00.193 — 사용자 요청 '모든 메뉴에 실시간 미리보기, 메뉴별 매칭 화면'.
        // 이전에 home/hero/bank 는 previewUrl 미지정 (자체 임베드 또는 노출 페이지 없음) → 모두 '/' 폴백.
        { key: "content", label: "\uC0AC\uC774\uD2B8 \uCF58\uD150\uCE20", previewUrl: "/", render: () => /* @__PURE__ */ React.createElement(SiteContentAdminPanel, null) },
        { key: "banner", label: "\uACF5\uC9C0\xB7\uBC30\uB108", previewUrl: "/", render: () => /* @__PURE__ */ React.createElement(BannerEditorPanel, null) },
        { key: "home", label: "\uD648 \uD14D\uC2A4\uD2B8", previewUrl: "/", render: () => /* @__PURE__ */ React.createElement(HomeTextEditorPanel, null) },
        { key: "hero", label: "\uD788\uC5B4\uB85C", previewUrl: "/", render: () => /* @__PURE__ */ React.createElement(HeroEditorPanel, null) },
        { key: "seo", label: "SEO", previewUrl: "/", render: () => /* @__PURE__ */ React.createElement(SEOAdminPanel, null) },
        // v00.196 — 검색콘솔 (Google/Naver/Bing/Yandex) 검증 + sitemap ping.
        { key: "search", label: "\uAC80\uC0C9\uC5D4\uC9C4", previewUrl: "/", render: () => /* @__PURE__ */ React.createElement(SearchConsoleAdminPanel, null) },
        { key: "legal", label: "\uC57D\uAD00/\uAC1C\uC778\uC815\uBCF4", previewUrl: "/terms", render: () => /* @__PURE__ */ React.createElement(LegalAdminPanel, null) },
        { key: "faq", label: "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38", previewUrl: "/faq", render: () => /* @__PURE__ */ React.createElement(FaqAdminPanel, null) },
        { key: "bank", label: "\uACC4\uC88C\uBC88\uD638", previewUrl: "/faq", render: () => /* @__PURE__ */ React.createElement(BankAccountPanel, null) }
      ]
    }
  ), tab === "\uAC10\uC0AC \uB85C\uADF8" && /* @__PURE__ */ React.createElement(AuditLogPanel, null), tab === "\uB0B4\uBD80 \uC54C\uB78C" && /* @__PURE__ */ React.createElement(InternalAlarmPanel, null), tab === "\uD65C\uB3D9 \uB85C\uADF8" && /* @__PURE__ */ React.createElement(ActivityLogPanel, null), tab === "\uC624\uB958 \uB85C\uADF8" && /* @__PURE__ */ React.createElement(ErrorLogPanel, null), tab === "\uC624\uB958 \uD398\uC774\uC9C0 \uBBF8\uB9AC\uBCF4\uAE30" && /* @__PURE__ */ React.createElement(ErrorPagesPreviewPanel, { go }), tab === "\uD68C\uC6D0 \uB4F1\uAE09" && /* @__PURE__ */ React.createElement(AdminGradePanel, null), tab === "\uCE7C\uB7FC \uC791\uC131" && /* @__PURE__ */ React.createElement(ColumnsHubPanel, { allColumns }), tab === "\uC124\uC815" && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "14px 18px", background: "var(--bg-2)", borderLeft: "3px solid var(--primary-dim)" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.7, margin: 0 } }, "\u24D8 \uBB34\uD1B5\uC7A5 \uC785\uAE08 \uACC4\uC88C\uB294 \uC88C\uCE21 \uBA54\uB274\uC758 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uACC4\uC88C\uBC88\uD638 \uC124\uC815"), " \uD0ED\uC5D0\uC11C \uAD00\uB9AC\uD569\uB2C8\uB2E4 (\uBA40\uD2F0 \uACC4\uC88C \uC9C0\uC6D0).")), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 20, marginBottom: 16 } }, "\uC0AC\uC774\uD2B8 \uC124\uC815"), /* @__PURE__ */ React.createElement("dl", { style: { display: "grid", gridTemplateColumns: "200px 1fr", gap: "8px 24px", fontSize: 13, lineHeight: 1.8 } }, /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "DPO"), /* @__PURE__ */ React.createElement("dd", null, "contact@bgnj.net \xB7 02-0000-0001"), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uAC1C\uC778\uC815\uBCF4 \uCC45\uC784\uC790"), /* @__PURE__ */ React.createElement("dd", null, "\uBC45\uAE30\uB178\uC790 / contact@bgnj.net"), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uCD5C\uADFC DPIA"), /* @__PURE__ */ React.createElement("dd", null, "2026-03-02"), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uC801\uC6A9 \uBC95\uC5ED"), /* @__PURE__ */ React.createElement("dd", null, "\uB300\uD55C\uBBFC\uAD6D(PIPA) \xB7 \uC720\uB7FD\uC5F0\uD569(GDPR)"), /* @__PURE__ */ React.createElement("dt", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uAC10\uB3C5\uAE30\uAD00"), /* @__PURE__ */ React.createElement("dd", null, "\uAC1C\uC778\uC815\uBCF4\uBCF4\uD638\uC704\uC6D0\uD68C / \uAD00\uD560 EU DPA"))))));
};
const AdminCategoryPanel = () => {
  var _a;
  const [cats, setCats] = React.useState(() => window.BGNJ_STORES.categories.slice());
  const [draft, setDraft] = React.useState({ id: "", label: "", boardType: "community", minLevel: 0, postMinLevel: 0, desc: "", allowRead: true, allowWrite: true, allowCommentRead: true, allowCommentWrite: true });
  const [error, setError] = React.useState("");
  const [prefixDrafts, setPrefixDrafts] = React.useState({});
  const save = (next) => {
    window.BGNJ_STORES.categories = next;
    window.BGNJ_SAVE.categories();
    setCats(next);
  };
  const persistToServer = async (cat, patch) => {
    var _a2, _b, _c;
    const remap = {};
    for (const [k, v] of Object.entries(patch)) {
      if (k === "desc") remap.description = v;
      else remap[k] = v;
    }
    try {
      await ((_c = (_b = (_a2 = window.BGNJ_API) == null ? void 0 : _a2.categories) == null ? void 0 : _b.update) == null ? void 0 : _c.call(_b, cat.id, remap));
    } catch (err) {
      console.warn("[AdminCategoryPanel] PATCH \uC2E4\uD328:", err == null ? void 0 : err.message);
    }
  };
  const slugify = (s) => String(s || "").trim().toLowerCase().replace(/[^a-z0-9-_가-힣]+/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
  const add = async (e) => {
    var _a2, _b, _c;
    e.preventDefault();
    setError("");
    let id = draft.id || slugify(draft.label);
    if (!id || !draft.label) return setError("ID\uC640 \uC774\uB984\uC740 \uD544\uC218\uC785\uB2C8\uB2E4.");
    if (cats.find((c) => c.id === id)) return setError("\uC774\uBBF8 \uC874\uC7AC\uD558\uB294 ID\uC785\uB2C8\uB2E4.");
    const newCat = { ...draft, id, minLevel: Number(draft.minLevel), postMinLevel: Number(draft.postMinLevel) };
    save([...cats, newCat]);
    try {
      await ((_c = (_b = (_a2 = window.BGNJ_API) == null ? void 0 : _a2.categories) == null ? void 0 : _b.create) == null ? void 0 : _c.call(_b, {
        id,
        label: newCat.label,
        boardType: newCat.boardType,
        minLevel: newCat.minLevel,
        postMinLevel: newCat.postMinLevel,
        description: newCat.desc,
        prefixes: newCat.prefixes || [],
        allowRead: newCat.allowRead,
        allowWrite: newCat.allowWrite,
        allowCommentRead: newCat.allowCommentRead,
        allowCommentWrite: newCat.allowCommentWrite
      }));
    } catch (err) {
      console.warn("[AdminCategoryPanel] create \uC2E4\uD328:", err == null ? void 0 : err.message);
    }
    setDraft({ id: "", label: "", boardType: "community", minLevel: 0, postMinLevel: 0, desc: "", allowRead: true, allowWrite: true, allowCommentRead: true, allowCommentWrite: true });
  };
  const update = (i, key, val) => {
    const next = cats.slice();
    let coerced = val;
    if (key.endsWith("Level")) coerced = Number(val);
    else if (key.startsWith("allow")) coerced = !!val;
    next[i] = { ...next[i], [key]: coerced };
    save(next);
    persistToServer(next[i], { [key]: coerced });
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= cats.length) return;
    const next = cats.slice();
    [next[i], next[j]] = [next[j], next[i]];
    save(next);
  };
  const remove = async (i) => {
    var _a2, _b, _c;
    const cat = cats[i];
    const used = postCount(cat.id);
    const note = used > 0 ? `
\uD604\uC7AC \uC774 \uAC8C\uC2DC\uD310\uC5D0 ${used}\uAC1C\uC758 \uAE00\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uC0AD\uC81C \uD6C4\uC5D0\uB3C4 \uAC8C\uC2DC\uAE00\uC740 \uB0A8\uB418 \uBD84\uB958\uAC00 \uBE44\uAC8C \uB429\uB2C8\uB2E4.` : "";
    if (!await window.BGNJ_CONFIRM(`"${cat.label}" \uAC8C\uC2DC\uD310\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?${note}`, { danger: true })) return;
    try {
      await ((_c = (_b = (_a2 = window.BGNJ_API) == null ? void 0 : _a2.categories) == null ? void 0 : _b.remove) == null ? void 0 : _c.call(_b, cat.id));
    } catch (err) {
      window.BGNJ_TOAST.error("\uC11C\uBC84 \uC0AD\uC81C \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958") + "\n\uB85C\uCEEC\uC5D0\uC11C\uB9CC \uC81C\uAC70\uD569\uB2C8\uB2E4.");
    }
    save(cats.filter((_, j) => j !== i));
  };
  const postCount = (catId) => {
    var _a2, _b;
    const posts = ((_b = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.listPosts) == null ? void 0 : _b.call(_a2)) || [];
    return posts.filter((p) => p.categoryId === catId).length;
  };
  const grades = (((_a = window.BGNJ_STORES) == null ? void 0 : _a.grades) || []).slice().sort((a, b) => (a.level || 0) - (b.level || 0));
  const communityCats = cats.filter((c) => c.boardType === "community");
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    AdminPanelHeader,
    {
      eyebrow: "BOARDS \xB7 \uCE74\uD14C\uACE0\uB9AC",
      title: "\uAC8C\uC2DC\uD310 \uCE74\uD14C\uACE0\uB9AC + \uAD8C\uD55C",
      description: "\uAC8C\uC2DC\uD310\uC744 \uCD94\uAC00/\uC0AD\uC81C\uD558\uACE0 \uAC01 \uAC8C\uC2DC\uD310\uC758 \uC77D\uAE30\xB7\uC4F0\uAE30 \uCD5C\uC18C \uB4F1\uAE09 + 4\uC885 \uAD8C\uD55C(\uAE00\uC77D/\uAE00\uC4F0/\uB313\uC77D/\uB313\uC4F0)\uC744 \uCCB4\uD06C\uBC15\uC2A4\uB85C \uC124\uC815\uD569\uB2C8\uB2E4. \uC21C\uC11C\uB97C \uBC14\uAFB8\uBA74 \uC0AC\uC774\uD2B8 \uB0B4\uBE44\uC640 \uCEE4\uBBA4\uB2C8\uD2F0 \uD0ED\uC5D0 \uC989\uC2DC \uBC18\uC601\uB429\uB2C8\uB2E4."
    }
  ), /* @__PURE__ */ React.createElement("article", { className: "admin-form-card" }, /* @__PURE__ */ React.createElement("div", { className: "admin-form-card__eyebrow" }, "\uFF0B \uC0C8 \uAC8C\uC2DC\uD310 \uCD94\uAC00"), /* @__PURE__ */ React.createElement("form", { onSubmit: add, style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "cat-label" }, "\uC774\uB984 ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "cat-label",
      className: "field-input",
      value: draft.label,
      onChange: (e) => setDraft({ ...draft, label: e.target.value, id: draft.id || slugify(e.target.value) }),
      placeholder: "\uC790\uC720 / \uC9C8\uBB38 / \uC815\uBCF4 ..."
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "cat-id" }, "ID (slug)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "cat-id",
      className: "field-input",
      value: draft.id,
      onChange: (e) => setDraft({ ...draft, id: slugify(e.target.value) }),
      placeholder: "\uC790\uB3D9 \uC0DD\uC131"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "cat-type" }, "\uC720\uD615"), /* @__PURE__ */ React.createElement(
    "select",
    {
      id: "cat-type",
      className: "field-input",
      value: draft.boardType,
      onChange: (e) => setDraft({ ...draft, boardType: e.target.value })
    },
    /* @__PURE__ */ React.createElement("option", { value: "community" }, "\uCEE4\uBBA4\uB2C8\uD2F0"),
    /* @__PURE__ */ React.createElement("option", { value: "column" }, "\uCE7C\uB7FC")
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "cat-min" }, "\uC77D\uAE30 \uCD5C\uC18C Lv"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "cat-min",
      type: "number",
      className: "field-input",
      value: draft.minLevel,
      onChange: (e) => setDraft({ ...draft, minLevel: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "cat-post" }, "\uC4F0\uAE30 \uCD5C\uC18C Lv"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "cat-post",
      type: "number",
      className: "field-input",
      value: draft.postMinLevel,
      onChange: (e) => setDraft({ ...draft, postMinLevel: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0, gridColumn: "span 2" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "cat-desc" }, "\uC124\uBA85"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "cat-desc",
      className: "field-input",
      value: draft.desc,
      onChange: (e) => setDraft({ ...draft, desc: e.target.value }),
      placeholder: "\uAC8C\uC2DC\uD310 \uC548\uB0B4 (\uC120\uD0DD)"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0, gridColumn: "1 / -1", display: "flex", gap: 14, flexWrap: "wrap", padding: "8px 0" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: draft.allowRead, onChange: (e) => setDraft({ ...draft, allowRead: e.target.checked }) }), " \uAC8C\uC2DC\uAE00 \uC77D\uAE30"), /* @__PURE__ */ React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: draft.allowWrite, onChange: (e) => setDraft({ ...draft, allowWrite: e.target.checked }) }), " \uAC8C\uC2DC\uAE00 \uC4F0\uAE30"), /* @__PURE__ */ React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: draft.allowCommentRead, onChange: (e) => setDraft({ ...draft, allowCommentRead: e.target.checked }) }), " \uB313\uAE00 \uBCF4\uAE30"), /* @__PURE__ */ React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: draft.allowCommentWrite, onChange: (e) => setDraft({ ...draft, allowCommentWrite: e.target.checked }) }), " \uB313\uAE00 \uC791\uC131"), /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10, alignSelf: "center" } }, "\xB7 \uCCB4\uD06C \uD574\uC81C \uC2DC \uBE44\uAD00\uB9AC\uC790 \uCC28\uB2E8")), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small" }, "\uFF0B \uCD94\uAC00")), error && /* @__PURE__ */ React.createElement("div", { role: "alert", className: "mono", style: { color: "var(--danger)", fontSize: 11, marginTop: 10 } }, error)), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1100 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "center", width: 80 } }, "\uC21C\uC11C"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "ID"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC720\uD615"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "right" } }, "\uC77D\uAE30\u2265"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "right" } }, "\uC4F0\uAE30\u2265"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "center", width: 50 }, title: "\uAC8C\uC2DC\uAE00 \uC77D\uAE30 \uD5C8\uC6A9" }, "\uAE00\uC77D"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "center", width: 50 }, title: "\uAC8C\uC2DC\uAE00 \uC4F0\uAE30 \uD5C8\uC6A9" }, "\uAE00\uC4F0"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "center", width: 50 }, title: "\uB313\uAE00 \uBCF4\uAE30 \uD5C8\uC6A9" }, "\uB313\uC77D"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "center", width: 50 }, title: "\uB313\uAE00 \uC791\uC131 \uD5C8\uC6A9" }, "\uB313\uC4F0"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "right" } }, "\uAE00 \uC218"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left" } }, "\uC124\uBA85"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "right" } }, "\uC561\uC158"))), /* @__PURE__ */ React.createElement("tbody", null, cats.map((c, i) => {
    var _a2, _b;
    return /* @__PURE__ */ React.createElement("tr", { key: c.id, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: 8, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", gap: 4 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => move(i, -1),
        disabled: i === 0,
        style: { padding: "2px 6px", minHeight: 0, fontSize: 11 },
        "aria-label": "\uC704\uB85C"
      },
      "\u25B2"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => move(i, 1),
        disabled: i === cats.length - 1,
        style: { padding: "2px 6px", minHeight: 0, fontSize: 11 },
        "aria-label": "\uC544\uB798\uB85C"
      },
      "\u25BC"
    ))), /* @__PURE__ */ React.createElement("td", { className: "mono gold", style: { padding: 10, fontSize: 11 } }, c.id), /* @__PURE__ */ React.createElement("td", { style: { padding: 10 } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        style: { padding: "4px 8px" },
        value: c.label,
        onChange: (e) => update(i, "label", e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("td", { style: { padding: 10 } }, /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "field-input",
        style: { padding: "4px 8px" },
        value: c.boardType,
        onChange: (e) => update(i, "boardType", e.target.value)
      },
      /* @__PURE__ */ React.createElement("option", { value: "community" }, "\uCEE4\uBBA4\uB2C8\uD2F0"),
      /* @__PURE__ */ React.createElement("option", { value: "column" }, "\uCE7C\uB7FC")
    )), /* @__PURE__ */ React.createElement("td", { style: { padding: 10, textAlign: "right" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        className: "field-input",
        style: { padding: "4px 8px", width: 64, textAlign: "right" },
        value: (_a2 = c.minLevel) != null ? _a2 : 0,
        onChange: (e) => update(i, "minLevel", e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("td", { style: { padding: 10, textAlign: "right" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        className: "field-input",
        style: { padding: "4px 8px", width: 64, textAlign: "right" },
        value: (_b = c.postMinLevel) != null ? _b : 0,
        onChange: (e) => update(i, "postMinLevel", e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("td", { style: { padding: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        "aria-label": "\uAC8C\uC2DC\uAE00 \uC77D\uAE30 \uD5C8\uC6A9",
        checked: c.allowRead !== false,
        onChange: (e) => update(i, "allowRead", e.target.checked)
      }
    )), /* @__PURE__ */ React.createElement("td", { style: { padding: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        "aria-label": "\uAC8C\uC2DC\uAE00 \uC4F0\uAE30 \uD5C8\uC6A9",
        checked: c.allowWrite !== false,
        onChange: (e) => update(i, "allowWrite", e.target.checked)
      }
    )), /* @__PURE__ */ React.createElement("td", { style: { padding: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        "aria-label": "\uB313\uAE00 \uBCF4\uAE30 \uD5C8\uC6A9",
        checked: c.allowCommentRead !== false,
        onChange: (e) => update(i, "allowCommentRead", e.target.checked)
      }
    )), /* @__PURE__ */ React.createElement("td", { style: { padding: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        "aria-label": "\uB313\uAE00 \uC791\uC131 \uD5C8\uC6A9",
        checked: c.allowCommentWrite !== false,
        onChange: (e) => update(i, "allowCommentWrite", e.target.checked)
      }
    )), /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: 10, textAlign: "right", fontSize: 11 } }, c.boardType === "community" ? postCount(c.id) : "-"), /* @__PURE__ */ React.createElement("td", { style: { padding: 10 } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        style: { padding: "4px 8px" },
        value: c.desc || "",
        onChange: (e) => update(i, "desc", e.target.value),
        placeholder: "\uC124\uBA85"
      }
    )), /* @__PURE__ */ React.createElement("td", { style: { padding: 10, textAlign: "right" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => remove(i),
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uC0AD\uC81C"
    )));
  })))), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      style: { marginTop: 20 },
      onClick: async () => {
        if (await window.BGNJ_CONFIRM("\uAE30\uBCF8\uAC12\uC73C\uB85C \uB418\uB3CC\uB9BD\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?", { danger: true })) {
          window.BGNJ_SAVE.resetCategories();
          setCats(window.BGNJ_STORES.categories.slice());
        }
      }
    },
    "\uAE30\uBCF8\uAC12 \uBCF5\uC6D0"
  ), /* @__PURE__ */ React.createElement("article", { className: "card", style: { padding: 20, marginTop: 32 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "PERMISSION MATRIX"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 8 } }, "\uB4F1\uAE09 \xD7 \uAC8C\uC2DC\uD310 \uAD8C\uD55C"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginBottom: 16 } }, "\u2713 = \uAC00\uB2A5 / \xB7 = \uBD88\uAC00. \uC774 \uB9E4\uD2B8\uB9AD\uC2A4\uB294 \uC704 \uD45C\uC758 \uB4F1\uAE09 \uAE30\uC900\uC774 \uBC14\uB00C\uBA74 \uC989\uC2DC \uBC18\uC601\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { overflow: "auto" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 540 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: 10, textAlign: "left", position: "sticky", left: 0, background: "var(--bg-2)", zIndex: 1 } }, "\uB4F1\uAE09"), communityCats.map((c) => /* @__PURE__ */ React.createElement("th", { key: c.id, scope: "col", style: { padding: 10, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", color: "var(--ink-3)" } }, c.label)))), /* @__PURE__ */ React.createElement("tbody", null, grades.map((g) => {
    const lv = g.id === "admin" ? 100 : g.level || 0;
    return /* @__PURE__ */ React.createElement("tr", { key: g.id, style: { borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: 10, position: "sticky", left: 0, background: "var(--bg)", zIndex: 1 } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.14em", color: g.color || "var(--primary)", border: `1px solid ${g.color || "var(--primary-dim)"}`, padding: "1px 6px", marginRight: 8 } }, g.label), /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10 } }, "Lv ", lv)), communityCats.map((c) => {
      var _a2, _b, _c;
      const canRead = lv >= ((_a2 = c.minLevel) != null ? _a2 : 0);
      const canWrite = lv >= ((_c = (_b = c.postMinLevel) != null ? _b : c.minLevel) != null ? _c : 0);
      return /* @__PURE__ */ React.createElement("td", { key: c.id, style: { padding: 10, textAlign: "center", fontSize: 11 } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { color: canRead ? "var(--primary)" : "var(--ink-3)" } }, "\uC77D ", canRead ? "\u2713" : "\xB7"), " / ", /* @__PURE__ */ React.createElement("span", { className: "mono", style: { color: canWrite ? "var(--primary)" : "var(--ink-3)" } }, "\uC4F0 ", canWrite ? "\u2713" : "\xB7"));
    }));
  }))))), /* @__PURE__ */ React.createElement("article", { className: "card", style: { padding: 20, marginTop: 32 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "THREAD PREFIXES \xB7 \uB9D0\uBA38\uB9AC"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 8 } }, "\uAC8C\uC2DC\uD310\uBCC4 \uB9D0\uBA38\uB9AC \uC124\uC815"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginBottom: 20 } }, "\uAC8C\uC2DC\uD310\uB9C8\uB2E4 \uAE00 \uC791\uC131 \uC2DC \uC120\uD0DD\uD560 \uC218 \uC788\uB294 \uB9D0\uBA38\uB9AC(\uBD84\uB958 \uD0DC\uADF8)\uB97C \uC124\uC815\uD569\uB2C8\uB2E4. \uB9D0\uBA38\uB9AC\uAC00 \uB4F1\uB85D\uB41C \uAC8C\uC2DC\uD310\uC5D0\uC11C\uB294 \uCEE4\uBBA4\uB2C8\uD2F0 \uC0C1\uB2E8\uC5D0 \uD544\uD130 \uD0ED\uC73C\uB85C\uB3C4 \uB178\uCD9C\uB429\uB2C8\uB2E4."), communityCats.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 13 } }, "\uCEE4\uBBA4\uB2C8\uD2F0 \uAC8C\uC2DC\uD310\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."), communityCats.map((c) => {
    const catIdx = cats.findIndex((x) => x.id === c.id);
    const prefixes = c.prefixes || [];
    const draftVal = prefixDrafts[c.id] || "";
    return /* @__PURE__ */ React.createElement("div", { key: c.id, style: { marginBottom: 16, padding: "14px 16px", background: "var(--bg-2)", border: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: 15 } }, c.label), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, "#", c.id), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, marginLeft: 4 } }, prefixes.length, "\uAC1C")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10, minHeight: 28 } }, prefixes.length === 0 && /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11 } }, "\uB9D0\uBA38\uB9AC \uC5C6\uC74C \u2014 \uCD94\uAC00\uD558\uBA74 \uCEE4\uBBA4\uB2C8\uD2F0 \uD544\uD130\uB85C \uC790\uB3D9 \uB178\uCD9C\uB429\uB2C8\uB2E4"), prefixes.map((p) => /* @__PURE__ */ React.createElement("span", { key: p, style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", border: "1px solid var(--primary-dim)", fontSize: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "gold" }, p), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => update(catIdx, "prefixes", prefixes.filter((x) => x !== p)),
        style: { background: "none", border: "none", cursor: "pointer", color: "var(--danger)", fontSize: 15, lineHeight: 1, padding: 0 },
        "aria-label": `${p} \uC0AD\uC81C`
      },
      "\xD7"
    )))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        style: { padding: "4px 8px", maxWidth: 220 },
        value: draftVal,
        placeholder: "\uB9D0\uBA38\uB9AC \uC785\uB825 \uD6C4 Enter \uB610\uB294 \uCD94\uAC00...",
        onChange: (e) => setPrefixDrafts((prev) => ({ ...prev, [c.id]: e.target.value })),
        onKeyDown: (e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const val = draftVal.trim();
          if (val && !prefixes.includes(val)) update(catIdx, "prefixes", [...prefixes, val]);
          setPrefixDrafts((prev) => ({ ...prev, [c.id]: "" }));
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small btn-gold",
        onClick: () => {
          const val = draftVal.trim();
          if (val && !prefixes.includes(val)) update(catIdx, "prefixes", [...prefixes, val]);
          setPrefixDrafts((prev) => ({ ...prev, [c.id]: "" }));
        }
      },
      "\uCD94\uAC00"
    )));
  })));
};
const PromoChip = ({ label, value, prefix = "\u2265", tone }) => /* @__PURE__ */ React.createElement("span", { style: {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 8px",
  border: "1px solid var(--line-2)",
  borderRadius: 999,
  background: "var(--bg)",
  color: tone === "danger" ? "var(--danger)" : "var(--ink)"
} }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-3)", fontSize: 10 } }, label), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600 } }, prefix, " ", Number.isFinite(Number(value)) ? Number(value) : 0));
const CommunityBoardsPanel = () => {
  const [tick, setTick] = React.useState(0);
  const grades = React.useMemo(
    () => {
      var _a;
      return (((_a = window.BGNJ_STORES) == null ? void 0 : _a.grades) || []).slice().sort((a, b) => (a.level || 0) - (b.level || 0));
    },
    [tick]
  );
  const boards = React.useMemo(() => {
    var _a;
    return (((_a = window.BGNJ_STORES) == null ? void 0 : _a.categories) || []).filter((c) => c.boardType === "community").slice().sort((a, b) => {
      var _a2, _b;
      return ((_a2 = a.order) != null ? _a2 : 0) - ((_b = b.order) != null ? _b : 0);
    });
  }, [tick]);
  const [edits, setEdits] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState("");
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState({ id: "", label: "", desc: "" });
  const dirty = Object.keys(edits).length > 0;
  const valueOf = (b) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
    return {
      label: (_b = (_a = edits[b.id]) == null ? void 0 : _a.label) != null ? _b : b.label,
      desc: (_d = (_c = edits[b.id]) == null ? void 0 : _c.desc) != null ? _d : b.desc || "",
      minLevel: (_g = (_e = edits[b.id]) == null ? void 0 : _e.minLevel) != null ? _g : (_f = b.minLevel) != null ? _f : 0,
      postMinLevel: (_j = (_h = edits[b.id]) == null ? void 0 : _h.postMinLevel) != null ? _j : (_i = b.postMinLevel) != null ? _i : 0,
      allowRead: (_l = (_k = edits[b.id]) == null ? void 0 : _k.allowRead) != null ? _l : b.allowRead !== false,
      allowWrite: (_n = (_m = edits[b.id]) == null ? void 0 : _m.allowWrite) != null ? _n : b.allowWrite !== false,
      allowCommentRead: (_p = (_o = edits[b.id]) == null ? void 0 : _o.allowCommentRead) != null ? _p : b.allowCommentRead !== false,
      allowCommentWrite: (_r = (_q = edits[b.id]) == null ? void 0 : _q.allowCommentWrite) != null ? _r : b.allowCommentWrite !== false
    };
  };
  const [draggingId, setDraggingId] = React.useState(null);
  const [dragOverId, setDragOverId] = React.useState(null);
  const [expanded, setExpanded] = React.useState(null);
  const update = (id, key, val) => {
    setEdits((cur) => ({ ...cur, [id]: { ...cur[id] || {}, [key]: val } }));
    setSaveMsg("");
  };
  const slugify = (s) => String(s || "").trim().toLowerCase().replace(/[^a-z0-9-_가-힣]+/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
  const addBoard = async () => {
    var _a, _b, _c, _d;
    const id = draft.id || slugify(draft.label);
    if (!id || !draft.label.trim()) {
      setSaveMsg("\u2717 \uAC8C\uC2DC\uD310 \uC774\uB984\uC740 \uD544\uC218\uC785\uB2C8\uB2E4.");
      return;
    }
    if (boards.find((b) => b.id === id)) {
      setSaveMsg("\u2717 \uC774\uBBF8 \uC874\uC7AC\uD558\uB294 ID \uC785\uB2C8\uB2E4.");
      return;
    }
    setSaving(true);
    try {
      await ((_c = (_b = (_a = window.BGNJ_API) == null ? void 0 : _a.categories) == null ? void 0 : _b.create) == null ? void 0 : _c.call(_b, {
        id,
        label: draft.label.trim(),
        boardType: "community",
        minLevel: 0,
        postMinLevel: 0,
        description: draft.desc || "",
        prefixes: [],
        allowRead: true,
        allowWrite: true,
        allowCommentRead: true,
        allowCommentWrite: true,
        order: boards.length
      }));
      const allCats = (((_d = window.BGNJ_STORES) == null ? void 0 : _d.categories) || []).slice();
      allCats.push({
        id,
        label: draft.label.trim(),
        boardType: "community",
        minLevel: 0,
        postMinLevel: 0,
        desc: draft.desc || "",
        prefixes: [],
        allowRead: true,
        allowWrite: true,
        allowCommentRead: true,
        allowCommentWrite: true,
        order: boards.length
      });
      window.BGNJ_STORES.categories = allCats;
      window.BGNJ_SAVE.categories();
      setDraft({ id: "", label: "", desc: "" });
      setAdding(false);
      setTick((v) => v + 1);
      setSaveMsg(`\u2713 '${draft.label.trim()}' \uAC8C\uC2DC\uD310\uC774 \uCD94\uAC00\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`);
      setTimeout(() => setSaveMsg(""), 2400);
    } catch (err) {
      setSaveMsg("\u2717 \uCD94\uAC00 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    } finally {
      setSaving(false);
    }
  };
  const removeBoard = async (id) => {
    var _a, _b, _c, _d, _e, _f;
    if (id === "notice") {
      window.BGNJ_TOAST.error("\uACF5\uC9C0 \uAC8C\uC2DC\uD310\uC740 \uC0AD\uC81C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return;
    }
    const target = boards.find((b) => b.id === id);
    if (!target) return;
    const postCount = (((_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a.listPosts) == null ? void 0 : _b.call(_a)) || []).filter((p) => p.categoryId === id).length;
    const note = postCount > 0 ? `
\uD604\uC7AC \uC774 \uAC8C\uC2DC\uD310\uC5D0 ${postCount}\uAC1C\uC758 \uAE00\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uC0AD\uC81C \uD6C4\uC5D0\uB3C4 \uAC8C\uC2DC\uAE00\uC740 \uB0A8\uB418 \uBD84\uB958\uAC00 \uBE44\uAC8C \uB429\uB2C8\uB2E4.` : "";
    if (!await window.BGNJ_CONFIRM(`"${target.label}" \uAC8C\uC2DC\uD310\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?${note}`, { danger: true })) return;
    setSaving(true);
    try {
      await ((_e = (_d = (_c = window.BGNJ_API) == null ? void 0 : _c.categories) == null ? void 0 : _d.remove) == null ? void 0 : _e.call(_d, id));
      const allCats = (((_f = window.BGNJ_STORES) == null ? void 0 : _f.categories) || []).filter((c) => c.id !== id);
      window.BGNJ_STORES.categories = allCats;
      window.BGNJ_SAVE.categories();
      setEdits((cur) => {
        const next = { ...cur };
        delete next[id];
        return next;
      });
      setTick((v) => v + 1);
      setSaveMsg(`\u2713 '${target.label}' \uAC8C\uC2DC\uD310\uC774 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`);
      setTimeout(() => setSaveMsg(""), 2400);
    } catch (err) {
      setSaveMsg("\u2717 \uC0AD\uC81C \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    } finally {
      setSaving(false);
    }
  };
  const onDrop = async (toId) => {
    var _a;
    if (!draggingId || draggingId === toId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }
    const fromIdx = boards.findIndex((b) => b.id === draggingId);
    const toIdx = boards.findIndex((b) => b.id === toId);
    if (fromIdx < 0 || toIdx < 0) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }
    const next = boards.slice();
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setSaving(true);
    try {
      await Promise.all(next.map((b, i) => {
        var _a2, _b, _c, _d;
        if (((_a2 = b.order) != null ? _a2 : 0) === i) return Promise.resolve();
        return (_d = (_c = (_b = window.BGNJ_API) == null ? void 0 : _b.categories) == null ? void 0 : _c.update) == null ? void 0 : _d.call(_c, b.id, { order: i }).catch(() => null);
      }));
      const allCats = (((_a = window.BGNJ_STORES) == null ? void 0 : _a.categories) || []).slice();
      next.forEach((b, i) => {
        const idx = allCats.findIndex((c) => c.id === b.id);
        if (idx >= 0) allCats[idx] = { ...allCats[idx], order: i };
      });
      window.BGNJ_STORES.categories = allCats;
      window.BGNJ_SAVE.categories();
      setTick((v) => v + 1);
      setSaveMsg("\u2713 \uC21C\uC11C \uBCC0\uACBD\uB428.");
      setTimeout(() => setSaveMsg(""), 1800);
    } catch (err) {
      setSaveMsg("\u2717 \uC21C\uC11C \uBCC0\uACBD \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    } finally {
      setSaving(false);
      setDraggingId(null);
      setDragOverId(null);
    }
  };
  const commitRow = async (id) => {
    var _a, _b, _c, _d;
    const e = edits[id];
    if (!e) return;
    setSaving(true);
    try {
      const remap = {};
      if ("label" in e) remap.label = e.label;
      if ("desc" in e) remap.description = e.desc;
      if ("minLevel" in e) remap.minLevel = Number(e.minLevel);
      if ("postMinLevel" in e) remap.postMinLevel = Number(e.postMinLevel);
      if ("allowRead" in e) remap.allowRead = e.allowRead;
      if ("allowWrite" in e) remap.allowWrite = e.allowWrite;
      if ("allowCommentRead" in e) remap.allowCommentRead = e.allowCommentRead;
      if ("allowCommentWrite" in e) remap.allowCommentWrite = e.allowCommentWrite;
      await ((_c = (_b = (_a = window.BGNJ_API) == null ? void 0 : _a.categories) == null ? void 0 : _b.update) == null ? void 0 : _c.call(_b, id, remap));
      const allCats = (((_d = window.BGNJ_STORES) == null ? void 0 : _d.categories) || []).slice();
      const idx = allCats.findIndex((c) => c.id === id);
      if (idx >= 0) {
        allCats[idx] = { ...allCats[idx], ...e };
      }
      window.BGNJ_STORES.categories = allCats;
      window.BGNJ_SAVE.categories();
      setEdits((cur) => {
        const next = { ...cur };
        delete next[id];
        return next;
      });
      setTick((v) => v + 1);
      setSaveMsg("\u2713 \uC800\uC7A5\uB428.");
      setTimeout(() => setSaveMsg(""), 1800);
    } catch (err) {
      setSaveMsg("\u2717 \uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    } finally {
      setSaving(false);
    }
  };
  const commitAll = async () => {
    var _a;
    if (saving || !dirty) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const changedIds = Object.keys(edits);
      const failed = [];
      await Promise.all(changedIds.map(async (id) => {
        var _a2, _b, _c;
        const e = edits[id];
        const remap = {};
        if ("label" in e) remap.label = e.label;
        if ("desc" in e) remap.description = e.desc;
        if ("minLevel" in e) remap.minLevel = Number(e.minLevel);
        if ("postMinLevel" in e) remap.postMinLevel = Number(e.postMinLevel);
        if ("allowRead" in e) remap.allowRead = e.allowRead;
        if ("allowWrite" in e) remap.allowWrite = e.allowWrite;
        if ("allowCommentRead" in e) remap.allowCommentRead = e.allowCommentRead;
        if ("allowCommentWrite" in e) remap.allowCommentWrite = e.allowCommentWrite;
        try {
          await ((_c = (_b = (_a2 = window.BGNJ_API) == null ? void 0 : _a2.categories) == null ? void 0 : _b.update) == null ? void 0 : _c.call(_b, id, remap));
        } catch (err) {
          failed.push(id);
        }
      }));
      const allCats = (((_a = window.BGNJ_STORES) == null ? void 0 : _a.categories) || []).slice();
      changedIds.forEach((id) => {
        const idx = allCats.findIndex((c) => c.id === id);
        if (idx >= 0) allCats[idx] = { ...allCats[idx], ...edits[id] };
      });
      window.BGNJ_STORES.categories = allCats;
      window.BGNJ_SAVE.categories();
      setEdits({});
      setTick((v) => v + 1);
      if (failed.length) {
        setSaveMsg(`\u26A0 ${changedIds.length - failed.length}\uAC1C \uC800\uC7A5, ${failed.length}\uAC1C \uC2E4\uD328: ${failed.join(", ")}`);
      } else {
        setSaveMsg(`\u2713 ${changedIds.length}\uAC1C \uAC8C\uC2DC\uD310 \uC815\uBCF4 \uC800\uC7A5\uB428.`);
        setTimeout(() => setSaveMsg(""), 3e3);
      }
    } catch (err) {
      setSaveMsg("\u2717 \uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    AdminPanelHeader,
    {
      eyebrow: "COMMUNITY \xB7 \uAC8C\uC2DC\uD310 \uAD00\uB9AC",
      title: "\uCEE4\uBBA4\uB2C8\uD2F0 \uAC8C\uC2DC\uD310 \u2014 \uD14C\uC774\uBE14 + \uB4DC\uB798\uADF8\uC564\uB4DC\uB86D",
      description: "\uAC8C\uC2DC\uD310\uC744 \uD55C \uD654\uBA74\uC5D0\uC11C \uCD94\uAC00\xB7\uC0AD\uC81C\xB7\uC21C\uC11C\uBCC0\uACBD\xB7\uD3B8\uC9D1\uD569\uB2C8\uB2E4. \uC88C\uCE21 \u2261 \uD578\uB4E4\uB85C \uB4DC\uB798\uADF8\uC564\uB4DC\uB86D / \uD589 \uD074\uB9AD \uC2DC \uAD8C\uD55C\xB7\uB4F1\uAE09 \uD3BC\uCCD0 \uBCF4\uAE30. \uBAA8\uB4E0 \uBCC0\uACBD\uC740 D1 \uC11C\uBC84 \uC989\uC2DC \uC800\uC7A5."
    }
  ), !adding ? /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: () => setAdding(true) }, "\uFF0B \uC0C8 \uAC8C\uC2DC\uD310 \uCD94\uAC00")) : /* @__PURE__ */ React.createElement("article", { className: "admin-form-card", style: { padding: 18, marginBottom: 16, borderColor: "var(--primary-dim)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.2em", marginBottom: 12 } }, "\uFF0B \uC0C8 \uAC8C\uC2DC\uD310"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "new-bd-label" }, "\uC774\uB984 ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "new-bd-label",
      className: "field-input",
      value: draft.label,
      onChange: (e) => setDraft({ ...draft, label: e.target.value, id: draft.id || slugify(e.target.value) }),
      placeholder: "\uC608: \uC790\uC720 / \uC9C8\uBB38 / \uD6C4\uAE30"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "new-bd-id" }, "ID (slug)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "new-bd-id",
      className: "field-input",
      value: draft.id,
      onChange: (e) => setDraft({ ...draft, id: slugify(e.target.value) }),
      placeholder: "\uC790\uB3D9 \uC0DD\uC131"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "new-bd-desc" }, "\uC124\uBA85"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      id: "new-bd-desc",
      className: "field-input",
      rows: 2,
      value: draft.desc,
      onChange: (e) => setDraft({ ...draft, desc: e.target.value }),
      placeholder: "\uAC8C\uC2DC\uD310 \uC0C1\uB2E8 \uC548\uB0B4 \uBB38\uAD6C (\uC120\uD0DD)",
      style: { fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: addBoard, disabled: saving || !draft.label.trim() }, saving ? "\uCD94\uAC00 \uC911\u2026" : "\uFF0B \uCD94\uAC00"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => {
    setAdding(false);
    setDraft({ id: "", label: "", desc: "" });
  } }, "\uCDE8\uC18C"))), boards.length === 0 ? /* @__PURE__ */ React.createElement(AdminEmpty, null, "\uB4F1\uB85D\uB41C \uCEE4\uBBA4\uB2C8\uD2F0 \uAC8C\uC2DC\uD310\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC704\uC5D0\uC11C \uCD94\uAC00\uD558\uC138\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--line)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: {
    display: "grid",
    gridTemplateColumns: "40px 130px 1fr 80px 80px 80px",
    gap: 0,
    alignItems: "center",
    padding: "10px 14px",
    background: "var(--bg-2)",
    borderBottom: "1px solid var(--line)",
    fontSize: 10,
    letterSpacing: "0.18em",
    fontWeight: 700
  } }, /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null, "ID"), /* @__PURE__ */ React.createElement("span", null, "\uC774\uB984 / \uC124\uBA85"), /* @__PURE__ */ React.createElement("span", { style: { textAlign: "center" } }, "\uAE00 \uC218"), /* @__PURE__ */ React.createElement("span", { style: { textAlign: "center" } }, "\uAD8C\uD55C"), /* @__PURE__ */ React.createElement("span", { style: { textAlign: "right" } }, "\uC561\uC158")), boards.map((b, idx) => {
    var _a, _b;
    const isNotice = b.id === "notice";
    const v = valueOf(b);
    const isEdited = !!edits[b.id];
    const isExpanded = expanded === b.id;
    const isDragging = draggingId === b.id;
    const isDragOver = dragOverId === b.id && draggingId !== b.id;
    const postCount = (((_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a.listPosts) == null ? void 0 : _b.call(_a)) || []).filter((p) => p.categoryId === b.id).length;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: b.id,
        draggable: !isNotice,
        onDragStart: (e) => {
          if (isNotice) {
            e.preventDefault();
            return;
          }
          setDraggingId(b.id);
          try {
            e.dataTransfer.effectAllowed = "move";
          } catch (e2) {
          }
        },
        onDragOver: (e) => {
          e.preventDefault();
          setDragOverId(b.id);
        },
        onDragLeave: () => setDragOverId((cur) => cur === b.id ? null : cur),
        onDrop: (e) => {
          e.preventDefault();
          onDrop(b.id);
        },
        onDragEnd: () => {
          setDraggingId(null);
          setDragOverId(null);
        },
        style: {
          borderBottom: idx < boards.length - 1 ? "1px solid var(--line)" : "none",
          background: isExpanded ? "rgba(245,213,72,0.04)" : isDragOver ? "rgba(245,213,72,0.10)" : isEdited ? "rgba(245,213,72,0.02)" : "var(--bg)",
          opacity: isDragging ? 0.5 : 1,
          borderTop: isDragOver ? "2px solid var(--primary)" : void 0,
          transition: "background .12s"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        display: "grid",
        gridTemplateColumns: "40px 130px 1fr 80px 80px 80px",
        gap: 0,
        alignItems: "center",
        padding: "12px 14px"
      } }, /* @__PURE__ */ React.createElement(
        "span",
        {
          title: isNotice ? "\uACF5\uC9C0\uB294 \uC21C\uC11C \uACE0\uC815" : "\uB4DC\uB798\uADF8\uD558\uC5EC \uC21C\uC11C \uBCC0\uACBD",
          style: {
            cursor: isNotice ? "not-allowed" : "grab",
            color: "var(--ink-3)",
            fontSize: 18,
            lineHeight: 1,
            userSelect: "none",
            textAlign: "center",
            opacity: isNotice ? 0.3 : 1
          }
        },
        "\u2261"
      ), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11, letterSpacing: "0.06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, b.id, isEdited && /* @__PURE__ */ React.createElement("span", { className: "gold", style: { marginLeft: 4 } }, "\u25CF")), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          value: v.label,
          onChange: (e) => update(b.id, "label", e.target.value),
          onClick: (e) => e.stopPropagation(),
          style: {
            width: "100%",
            padding: "4px 8px",
            fontSize: 13,
            background: "transparent",
            border: "1px solid transparent",
            color: "var(--ink)",
            fontFamily: "inherit",
            fontWeight: 600
          },
          onFocus: (e) => e.target.style.border = "1px solid var(--line-2)",
          onBlur: (e) => e.target.style.border = "1px solid transparent"
        }
      ), !isExpanded && v.desc && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: {
        fontSize: 11,
        padding: "0 8px",
        marginTop: 2,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      } }, v.desc)), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { textAlign: "center", fontSize: 11, color: "var(--ink-2)" } }, postCount), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { textAlign: "center", fontSize: 10, letterSpacing: "0.06em", color: "var(--ink-3)" } }, isNotice ? "\uAD00\uB9AC\uC790" : `Lv${v.minLevel}/${v.postMinLevel}`), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: () => setExpanded(isExpanded ? null : b.id),
          style: {
            padding: "4px 10px",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            background: isExpanded ? "rgba(245,213,72,0.14)" : "var(--bg-2)",
            border: "1px solid var(--line-2)",
            cursor: "pointer",
            color: isExpanded ? "var(--ink)" : "var(--ink-2)"
          }
        },
        isExpanded ? "\uB2EB\uAE30" : "\uD3B8\uC9D1"
      ), !isNotice && /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: () => removeBoard(b.id),
          disabled: saving,
          title: "\uC0AD\uC81C",
          style: {
            padding: "4px 8px",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            background: "var(--bg-2)",
            border: "1px solid var(--line-2)",
            color: "var(--danger)",
            cursor: "pointer"
          }
        },
        "\u{1F5D1}"
      ))),
      isExpanded && /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 18px 18px", background: "var(--bg-2)", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", style: { fontSize: 11 } }, "\uC124\uBA85 (\uAC8C\uC2DC\uD310 \uC0C1\uB2E8 \uC548\uB0B4 \uBB38\uAD6C)"), /* @__PURE__ */ React.createElement(
        "textarea",
        {
          className: "field-input",
          rows: 2,
          value: v.desc,
          onChange: (e) => update(b.id, "desc", e.target.value),
          placeholder: "\uBE44\uC6CC\uB450\uBA74 \uBBF8\uD45C\uC2DC",
          style: { fontFamily: "inherit", resize: "vertical", fontSize: 13 }
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", style: { fontSize: 11 } }, "\uC77D\uAE30 \uCD5C\uC18C \uB4F1\uAE09 (level)"), /* @__PURE__ */ React.createElement(
        "select",
        {
          className: "field-input",
          value: v.minLevel,
          onChange: (e) => update(b.id, "minLevel", e.target.value)
        },
        grades.map((g) => /* @__PURE__ */ React.createElement("option", { key: g.id, value: g.level }, "Lv ", g.level, " \xB7 ", g.label))
      )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", style: { fontSize: 11 } }, "\uC791\uC131 \uCD5C\uC18C \uB4F1\uAE09 (level)"), /* @__PURE__ */ React.createElement(
        "select",
        {
          className: "field-input",
          value: v.postMinLevel,
          onChange: (e) => update(b.id, "postMinLevel", e.target.value)
        },
        grades.map((g) => /* @__PURE__ */ React.createElement("option", { key: g.id, value: g.level }, "Lv ", g.level, " \xB7 ", g.label))
      ))), /* @__PURE__ */ React.createElement("fieldset", { style: { border: "1px solid var(--line)", padding: "10px 14px" } }, /* @__PURE__ */ React.createElement("legend", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", padding: "0 6px" } }, "\uAD8C\uD55C (4\uC885)"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px 18px", fontSize: 13 } }, [
        ["allowRead", "\uAE00 \uC77D\uAE30 \uD5C8\uC6A9"],
        ["allowWrite", "\uAE00 \uC791\uC131 \uD5C8\uC6A9"],
        ["allowCommentRead", "\uB313\uAE00 \uC77D\uAE30 \uD5C8\uC6A9"],
        ["allowCommentWrite", "\uB313\uAE00 \uC791\uC131 \uD5C8\uC6A9"]
      ].map(([key, label]) => /* @__PURE__ */ React.createElement("label", { key, style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "checkbox",
          checked: !!v[key],
          disabled: isNotice,
          onChange: (e) => update(b.id, key, e.target.checked)
        }
      ), /* @__PURE__ */ React.createElement("span", { style: { color: isNotice ? "var(--ink-3)" : "var(--ink)" } }, label)))), isNotice && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 10, marginTop: 8, lineHeight: 1.5 } }, "\uACF5\uC9C0(notice) \uB294 \uAC15\uC81C \uAD00\uB9AC\uC790 \uC804\uC6A9 \u2014 \uAD8C\uD55C \uCCB4\uD06C\uBC15\uC2A4 \uBB34\uC2DC.")), isEdited && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          className: "btn btn-small btn-gold",
          onClick: () => commitRow(b.id),
          disabled: saving
        },
        "\u{1F4BE} \uC774 \uAC8C\uC2DC\uD310\uB9CC \uC800\uC7A5"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          className: "btn btn-small",
          onClick: () => setEdits((cur) => {
            const next = { ...cur };
            delete next[b.id];
            return next;
          })
        },
        "\uB418\uB3CC\uB9AC\uAE30"
      )))
    );
  })), /* @__PURE__ */ React.createElement(
    AdminSaveBar,
    {
      message: saveMsg || null,
      messageVariant: saveMsg.startsWith("\u2717") ? "danger" : saveMsg.startsWith("\u26A0") ? "warning" : "success"
    },
    /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: commitAll, disabled: saving || !dirty }, saving ? "\uC800\uC7A5 \uC911\u2026" : dirty ? "\u{1F4BE} \uC800\uC7A5" : "\uC800\uC7A5\uB428 \u2713")
  ), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 10, lineHeight: 1.7 } }, "\u24D8 ", /* @__PURE__ */ React.createElement("strong", null, "\uACF5\uC9C0(notice)"), " \uAC8C\uC2DC\uD310\uC740 admin \uC804\uC6A9 \uAC15\uC81C \uADDC\uCE59 \u2014 \uC0AD\uC81C \uBD88\uAC00. \uCD94\uAC00/\uC0AD\uC81C\uB294 \uC989\uC2DC \uC11C\uBC84\uC5D0 \uBC18\uC601\uB429\uB2C8\uB2E4. \uC81C\uBAA9/\uC124\uBA85 \uD3B8\uC9D1\uC740 [\u{1F4BE} \uC800\uC7A5] \uBC84\uD2BC \uD074\uB9AD \uC2DC commit."));
};
const AdminGradePanel = () => {
  const G = window.BGNJ_GUARD;
  const _initialRules = () => {
    var _a;
    try {
      return JSON.parse(JSON.stringify(((_a = window.BGNJ_GRADE_RULES_EFFECTIVE) == null ? void 0 : _a.call(window)) || window.BGNJ_GRADE_RULES || {}));
    } catch (e) {
      return {};
    }
  };
  const [grades, setGrades] = React.useState(() => window.BGNJ_STORES.grades.slice());
  const [rules, setRules] = React.useState(_initialRules);
  const [draft, setDraft] = React.useState({ id: "", label: "", level: 20, color: "#D4AF37", desc: "" });
  const [error, setError] = React.useState("");
  const [dirty, setDirty] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [busyReevaluate, setBusyReevaluate] = React.useState(false);
  const [reevalResult, setReevalResult] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      var _a, _b, _c;
      try {
        const r = await ((_c = (_b = (_a = window.BGNJ_API) == null ? void 0 : _a.grades) == null ? void 0 : _b.list) == null ? void 0 : _c.call(_b));
        if (cancelled) return;
        if (Array.isArray(r == null ? void 0 : r.grades) && r.grades.length) {
          const fresh = r.grades.map((g) => {
            var _a2;
            return {
              id: g.id,
              label: g.label,
              level: g.level,
              color: g.color,
              desc: g.description,
              order: (_a2 = g.display_order) != null ? _a2 : 0
            };
          });
          window.BGNJ_STORES.grades = fresh;
          setGrades((prev) => {
            if (dirty) return prev;
            return fresh.slice();
          });
        }
      } catch (e) {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const sortedGrades = React.useMemo(() => grades.slice().sort((a, b) => a.level - b.level), [grades]);
  const markDirty = () => {
    setDirty(true);
    setSaveMsg("");
  };
  const add = (e) => {
    e.preventDefault();
    setError("");
    if (!draft.id || !draft.label) return setError("ID\uC640 \uC774\uB984\uC740 \uD544\uC218\uC785\uB2C8\uB2E4.");
    if (grades.find((g) => g.id === draft.id)) return setError("\uC774\uBBF8 \uC874\uC7AC\uD558\uB294 ID\uC785\uB2C8\uB2E4.");
    setGrades([...grades, { ...draft, level: Number(draft.level) }]);
    setDraft({ id: "", label: "", level: 20, color: "#D4AF37", desc: "" });
    markDirty();
  };
  const update = (i, key, val) => {
    setGrades((cur) => {
      const next = cur.slice();
      next[i] = { ...next[i], [key]: key === "level" ? Number(val) : val };
      return next;
    });
    markDirty();
  };
  const remove = async (i) => {
    const g = grades[i];
    if (g.id === "admin" || g.id === "guest") {
      window.BGNJ_TOAST.error("\uAE30\uBCF8 \uB4F1\uAE09(guest/admin)\uC740 \uC0AD\uC81C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return;
    }
    if (!await window.BGNJ_CONFIRM(`"${g.label}" \uB4F1\uAE09\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
    setGrades(grades.filter((_, j) => j !== i));
    markDirty();
  };
  const setRuleField = (gid, key, val) => {
    setRules((r) => ({ ...r, [gid]: { ...r[gid] || {}, [key]: Number(val) || 0 } }));
    markDirty();
  };
  const commitAll = async () => {
    var _a, _b, _c, _d;
    if (saving) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const sorted = grades.slice().sort((a, b) => a.level - b.level);
      const failed = [];
      for (const g of sorted) {
        try {
          if (!((_b = (_a = window.BGNJ_API) == null ? void 0 : _a.grades) == null ? void 0 : _b.upsert)) {
            throw new Error("BGNJ_API.grades.upsert \uAC00 \uB85C\uB4DC\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4 (\uB124\uD2B8\uC6CC\uD06C/\uC2A4\uD06C\uB9BD\uD2B8 \uB85C\uB529 \uBB38\uC81C).");
          }
          await window.BGNJ_API.grades.upsert(g.id, {
            label: g.label,
            level: Number(g.level || 0),
            color: g.color || "",
            description: g.desc || "",
            order: Number(g.order || g.level || 0)
          });
        } catch (err) {
          failed.push({ id: g.id, label: g.label, msg: (err == null ? void 0 : err.message) || String(err) });
        }
      }
      if (failed.length) {
        const msg = `\u26A0 \uB4F1\uAE09 \uC11C\uBC84 \uC800\uC7A5 ${failed.length}\uAC74 \uC2E4\uD328

${failed.map((f) => `\u2022 ${f.id} (${f.label}): ${f.msg}`).join("\n")}

\uC0C8\uB85C\uACE0\uCE68 \uC2DC \uC11C\uBC84 D1 default \uAC00 \uB2E4\uC2DC \uB36E\uC5B4\uC4F0\uBBC0\uB85C \u2014 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAC70\uB098 \uB85C\uADF8\uC544\uC6C3 \uD6C4 admin \uC7AC\uB85C\uADF8\uC778 \uD6C4 \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.`;
        window.BGNJ_TOAST.error(msg);
        setSaveMsg(`\u26A0 ${failed.length}\uAC74 \uC2E4\uD328 \u2014 alert \uCC38\uC870`);
        setSaving(false);
        return;
      }
      window.BGNJ_STORES.grades = sorted;
      window.BGNJ_SAVE.grades();
      setGrades(sorted);
      await ((_d = (_c = window.BGNJ_SITE_CONTENT) == null ? void 0 : _c.saveSection) == null ? void 0 : _d.call(_c, "gradeRules", rules));
      setDirty(false);
      if (!failed.length) {
        setSaveMsg("\u2713 \uB4F1\uAE09(D1) + \uC790\uB3D9 \uC2B9\uAE09 \uAE30\uC900 \uC800\uC7A5 \uC644\uB8CC.");
        setTimeout(() => setSaveMsg(""), 3e3);
      }
    } catch (err) {
      setSaveMsg("\u2717 \uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    } finally {
      setSaving(false);
    }
  };
  const resetAll = async () => {
    var _a, _b, _c, _d, _e, _f;
    if (!await window.BGNJ_CONFIRM("\uB4F1\uAE09 + \uC790\uB3D9 \uC2B9\uAE09 \uAE30\uC900\uC744 \uBAA8\uB450 \uAE30\uBCF8\uAC12\uC73C\uB85C \uB418\uB3CC\uB9BD\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?\n(\uC11C\uBC84 D1 grades_kv \uB3C4 default \uAC12\uC73C\uB85C \uB36E\uC5B4\uC50C\uC6CC\uC9D1\uB2C8\uB2E4.)", { danger: true })) return;
    setSaving(true);
    try {
      window.BGNJ_SAVE.resetGrades();
      const defaults = (((_a = window.BGNJ_STORES) == null ? void 0 : _a.grades) || []).slice();
      for (const g of defaults) {
        try {
          await ((_d = (_c = (_b = window.BGNJ_API) == null ? void 0 : _b.grades) == null ? void 0 : _c.upsert) == null ? void 0 : _d.call(_c, g.id, {
            label: g.label,
            level: Number(g.level || 0),
            color: g.color || "",
            description: g.desc || "",
            order: Number(g.order || g.level || 0)
          }));
        } catch (e) {
        }
      }
      await ((_f = (_e = window.BGNJ_SITE_CONTENT) == null ? void 0 : _e.resetSection) == null ? void 0 : _f.call(_e, "gradeRules"));
      setGrades(window.BGNJ_STORES.grades.slice());
      setRules(_initialRules());
      setDirty(false);
      setSaveMsg("\uAE30\uBCF8\uAC12 \uBCF5\uC6D0 \uC644\uB8CC (D1 + localStorage).");
      setTimeout(() => setSaveMsg(""), 3e3);
    } catch (err) {
      setSaveMsg("\u2717 \uBCF5\uC6D0 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    } finally {
      setSaving(false);
    }
  };
  const reevaluate = async () => {
    var _a, _b, _c, _d, _e, _f;
    if (dirty) {
      window.BGNJ_TOAST.error("\uC800\uC7A5\uD558\uC9C0 \uC54A\uC740 \uBCC0\uACBD \uC0AC\uD56D\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uBA3C\uC800 [\uC800\uC7A5] \uD6C4 \uC7AC\uC0B0\uC815\uD558\uC138\uC694.");
      return;
    }
    if (!await window.BGNJ_CONFIRM("\uC804\uCCB4 \uD68C\uC6D0\uC758 \uD65C\uB3D9\uB7C9\uC744 \uC7AC\uD3C9\uAC00\uD558\uC5EC \uC790\uACA9 \uB4F1\uAE09\uC73C\uB85C \uC790\uB3D9 \uC2B9\uAE09/\uAC15\uB4F1 \uD569\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?", { danger: true })) return;
    setBusyReevaluate(true);
    try {
      await ((_b = (_a = window.BGNJ_AUTH) == null ? void 0 : _a.refreshUsers) == null ? void 0 : _b.call(_a));
      try {
        await ((_d = (_c = window.BGNJ_GRADE_PROMO) == null ? void 0 : _c.prefetchAllServerMetrics) == null ? void 0 : _d.call(_c));
      } catch (e) {
      }
      const summary = ((_f = (_e = window.BGNJ_GRADE_PROMO) == null ? void 0 : _e.reevaluateAll) == null ? void 0 : _f.call(_e)) || { promoted: 0, demoted: 0 };
      setReevalResult(summary);
    } catch (err) {
      window.BGNJ_TOAST.error("\uC7AC\uC0B0\uC815 \uC911 \uC624\uB958: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    } finally {
      setBusyReevaluate(false);
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    AdminPanelHeader,
    {
      eyebrow: "MEMBERSHIP \xB7 \uD68C\uC6D0 \uB4F1\uAE09",
      title: "\uD68C\uC6D0 \uB4F1\uAE09 + \uC790\uB3D9 \uC2B9\uAE09/\uAC15\uB4F1",
      description: "\uD68C\uC6D0 \uB4F1\uAE09\uC758 \uC774\uB984\xB7\uB2E8\uACC4\xB7\uC0C9\uC0C1\uC744 \uAD00\uB9AC\uD558\uACE0, \uAC01 \uB4F1\uAE09\uC758 \uC790\uB3D9 \uC2B9\uAE09 \uAE30\uC900\uC744 \uD568\uAED8 \uD3B8\uC9D1\uD569\uB2C8\uB2E4. \uBCC0\uACBD \uC0AC\uD56D\uC740 [\u{1F4BE} \uC800\uC7A5] \uBC84\uD2BC\uC744 \uB204\uB97C \uB54C\uB9CC \uC801\uC6A9\uB429\uB2C8\uB2E4."
    }
  ), /* @__PURE__ */ React.createElement("article", { className: "admin-form-card" }, /* @__PURE__ */ React.createElement("div", { className: "admin-form-card__eyebrow" }, "\uFF0B \uC0C8 \uB4F1\uAE09 \uCD94\uAC00"), /* @__PURE__ */ React.createElement("form", { onSubmit: add, style: { display: "grid", gridTemplateColumns: "1fr 1fr 100px 100px 1fr auto", gap: 10, alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "grade-id" }, "ID"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "grade-id",
      className: "field-input",
      value: draft.id,
      onChange: (e) => setDraft({ ...draft, id: e.target.value.replace(/\s+/g, "-").toLowerCase() }),
      placeholder: "slug"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "grade-label" }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("input", { id: "grade-label", className: "field-input", value: draft.label, onChange: (e) => setDraft({ ...draft, label: e.target.value }), placeholder: "\uB4F1\uAE09 \uC774\uB984" })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "grade-level" }, "\uB2E8\uACC4"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "grade-level",
      type: "number",
      className: "field-input",
      value: draft.level,
      onChange: (e) => setDraft({ ...draft, level: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "grade-color" }, "\uC0C9\uC0C1"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "grade-color",
      type: "color",
      className: "field-input",
      style: { padding: 2, height: 38 },
      value: draft.color,
      onChange: (e) => setDraft({ ...draft, color: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "grade-desc" }, "\uC124\uBA85"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "grade-desc",
      className: "field-input",
      value: draft.desc,
      onChange: (e) => setDraft({ ...draft, desc: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small" }, "\uCD94\uAC00")), error && /* @__PURE__ */ React.createElement("div", { role: "alert", className: "mono", style: { color: "var(--danger)", fontSize: 11, marginTop: 10 } }, error)), /* @__PURE__ */ React.createElement("div", { className: "admin-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "admin-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { scope: "col" }, "\uBC30\uC9C0"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, "ID"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("th", { scope: "col", className: "right" }, "\uB2E8\uACC4"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, "\uC0C9\uC0C1"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, "\uC124\uBA85"), /* @__PURE__ */ React.createElement("th", { scope: "col", className: "right" }, "\uC561\uC158"))), /* @__PURE__ */ React.createElement("tbody", null, sortedGrades.map((g) => {
    const i = grades.findIndex((x) => x.id === g.id);
    const rule = rules[g.id];
    const RULE_KEYS = [
      { k: "posts", l: "\uAC8C\uC2DC\uAE00" },
      { k: "comments", l: "\uB313\uAE00" },
      { k: "visitsLast30Days", l: "30\uC77C \uBC29\uBB38" },
      { k: "daysSinceSignup", l: "\uAC00\uC785\uACBD\uACFC(\uC77C)" },
      { k: "likesReceived", l: "\uBC1B\uC740 \uC88B\uC544\uC694" },
      { k: "activeDays", l: "\uD65C\uB3D9\uC77C" },
      { k: "eventsAttended", l: "\uD589\uC0AC \uCC38\uC11D" },
      { k: "maxReports", l: "\uC2E0\uACE0 \uD55C\uACC4 <", tone: "danger" }
    ];
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: g.id }, /* @__PURE__ */ React.createElement("tr", { style: { borderBottom: rule ? "none" : void 0 } }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "grade-badge", style: { color: g.color } }, g.label)), /* @__PURE__ */ React.createElement("td", { className: "mono gold" }, g.id), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        style: { padding: "6px 10px" },
        value: g.label,
        onChange: (e) => update(i, "label", e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("td", { className: "right" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        className: "field-input",
        style: { padding: "6px 10px", width: 80, textAlign: "right" },
        value: g.level,
        onChange: (e) => update(i, "level", e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "color",
        className: "field-input",
        style: { padding: 0, width: 60, height: 32 },
        value: g.color,
        onChange: (e) => update(i, "color", e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        style: { padding: "6px 10px" },
        value: g.desc || "",
        onChange: (e) => update(i, "desc", e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("td", { className: "right" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => remove(i),
        style: { borderColor: "var(--danger)", color: "var(--danger)" },
        disabled: g.id === "admin" || g.id === "guest"
      },
      "\uC0AD\uC81C"
    ))), rule && /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("td", { colSpan: 7, style: { padding: "10px 14px 16px", borderTop: "1px dashed var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-3)", marginBottom: 8 } }, "\u21B3 \uC790\uB3D9 \uC2B9\uAE09 \uAE30\uC900 \u2014 \uBAA8\uB450 \uB3D9\uC2DC \uCDA9\uC871 \uC2DC ", /* @__PURE__ */ React.createElement("strong", { style: { color: g.color } }, g.label), " \uC790\uB3D9 \uBD80\uC5EC"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11 } }, RULE_KEYS.map(({ k, l, tone }) => {
      var _a;
      return /* @__PURE__ */ React.createElement("label", { key: k, style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", border: "1px solid var(--line-2)", background: "var(--bg)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 10, letterSpacing: "0.08em" } }, l), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          min: 0,
          value: (_a = rule[k]) != null ? _a : 0,
          onChange: (e) => setRuleField(g.id, k, e.target.value),
          style: { width: 60, padding: "2px 6px", textAlign: "right", border: "1px solid var(--line-2)", background: "var(--bg)", color: tone === "danger" ? "var(--danger)" : "var(--ink)", fontFamily: "var(--font-mono)", fontSize: 11 }
        }
      ));
    })))));
  })))), /* @__PURE__ */ React.createElement(
    AdminSaveBar,
    {
      message: saveMsg || null,
      messageVariant: saveMsg.startsWith("\u2717") ? "danger" : "success"
    },
    /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: commitAll, disabled: saving || !dirty }, saving ? "\uC800\uC7A5 \uC911\u2026" : dirty ? "\u{1F4BE} \uC800\uC7A5 (\uB4F1\uAE09 + \uC790\uB3D9 \uC2B9\uAE09 \uAE30\uC900)" : "\uC800\uC7A5\uB428 \u2713"),
    /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: reevaluate, disabled: busyReevaluate || dirty }, busyReevaluate ? "\uC7AC\uC0B0\uC815 \uC911\u2026" : "\u{1F504} \uC804\uCCB4 \uD68C\uC6D0 \uC7AC\uC0B0\uC815"),
    reevalResult && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 12, fontWeight: 600, color: "var(--secondary)" } }, "\u2713 \uC2B9\uAE09 ", reevalResult.promoted, " \xB7 \uAC15\uB4F1 ", reevalResult.demoted),
    /* @__PURE__ */ React.createElement("span", { className: "admin-savebar__spacer" }),
    /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: resetAll, style: { borderColor: "var(--line-2)" } }, "\uAE30\uBCF8\uAC12 \uBCF5\uC6D0")
  ), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: "var(--ink-3)", marginTop: 10, lineHeight: 1.6 } }, "\u24D8 \uC790\uB3D9 \uC2B9\uAE09 \uAE30\uC900\uC740 ", /* @__PURE__ */ React.createElement("code", null, "\uBAA8\uB4E0 \uC870\uAC74 \uB3D9\uC2DC \uCDA9\uC871"), " \uC2DC\uC5D0\uB9CC \uC790\uACA9 \uBD80\uC5EC. \uC2E0\uACE0 \uD55C\uACC4 \uCD08\uACFC \uC2DC \uC790\uACA9 \uBB34\uAD00 \uAC15\uC81C \uAC15\uB4F1(member). \uC2B9\uAE09/\uAC15\uB4F1 \uC2DC \uBCF8\uC778\uC5D0\uAC8C \uC54C\uB9BC \uC790\uB3D9 \uBC1C\uC1A1. \uBCC0\uACBD\uC740 ", /* @__PURE__ */ React.createElement("strong", null, "\uC800\uC7A5 \uBC84\uD2BC"), " \uD074\uB9AD \uC2DC\uC810\uC5D0\uB9CC \uC601\uC18D\uD654\uB429\uB2C8\uB2E4."));
};
const ColumnCategoryChips = ({ selected, onSelect, allowManage = true }) => {
  const [scTick, setScTick] = React.useState(0);
  const sc = React.useMemo(() => {
    var _a, _b;
    return ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
  }, [scTick]);
  const cats = React.useMemo(() => {
    const list = Array.isArray(sc.columnCategories) && sc.columnCategories.length ? sc.columnCategories : ["\uC655\uC758 \uBBF8\uD559", "\uAD70\uC8FC\uC758 \uC5B8\uC5B4", "\uACF5\uAC04\uC758 \uCCA0\uD559", "\uD604\uB300\uC758 \uB3C5\uBC95"];
    return selected && !list.includes(selected) ? [...list, selected] : list;
  }, [sc, scTick, selected]);
  const [adding, setAdding] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const addCat = async () => {
    const v = newName.trim();
    if (!v || cats.includes(v) || busy) return;
    setBusy(true);
    try {
      const next = [...sc.columnCategories || [], v];
      await window.BGNJ_SITE_CONTENT.saveSection("columnCategories", next);
      setNewName("");
      setAdding(false);
      setScTick((x) => x + 1);
      onSelect == null ? void 0 : onSelect(v);
    } catch (err) {
      window.BGNJ_TOAST.error("\uCE74\uD14C\uACE0\uB9AC \uCD94\uAC00 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    } finally {
      setBusy(false);
    }
  };
  const removeCat = async (name) => {
    if (!await window.BGNJ_CONFIRM(`'${name}' \uCE74\uD14C\uACE0\uB9AC\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?
(\uAE30\uC874 \uCE7C\uB7FC\uC758 \uAC12\uC740 \uBCF4\uC874\uB428, \uC0C8 \uCE7C\uB7FC \uC791\uC131 \uC120\uD0DD\uC9C0\uC5D0\uC11C\uB9CC \uC0AC\uB77C\uC9D0.)`, { danger: true })) return;
    setBusy(true);
    try {
      const next = (sc.columnCategories || []).filter((c) => c !== name);
      await window.BGNJ_SITE_CONTENT.saveSection("columnCategories", next);
      setScTick((x) => x + 1);
      if (selected === name && next.length > 0) onSelect == null ? void 0 : onSelect(next[0]);
    } catch (err) {
      window.BGNJ_TOAST.error("\uCE74\uD14C\uACE0\uB9AC \uC0AD\uC81C \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" } }, cats.map((c) => {
    const active = c === selected;
    return /* @__PURE__ */ React.createElement("span", { key: c, style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 0,
      borderRadius: 999,
      border: "1px solid " + (active ? "var(--primary)" : "var(--line-2)"),
      background: active ? "rgba(245,213,72,0.10)" : "var(--bg-2)"
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => onSelect == null ? void 0 : onSelect(c),
        "aria-pressed": active,
        style: {
          padding: "6px 4px 6px 14px",
          fontSize: 12,
          cursor: "pointer",
          color: active ? "var(--primary)" : "var(--ink)",
          fontWeight: active ? 600 : 500,
          background: "transparent",
          border: "none"
        }
      },
      c
    ), allowManage && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => removeCat(c),
        "aria-label": `${c} \uC0AD\uC81C`,
        disabled: busy,
        onMouseEnter: (e) => {
          e.currentTarget.style.color = "var(--danger)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.color = "var(--ink-3)";
        },
        onFocus: (e) => {
          e.currentTarget.style.color = "var(--danger)";
        },
        onBlur: (e) => {
          e.currentTarget.style.color = "var(--ink-3)";
        },
        style: { background: "none", border: "none", color: "var(--ink-3)", cursor: "pointer", fontSize: 11, padding: "0 10px 0 4px", lineHeight: 1, transition: "color .15s" }
      },
      "\u2715"
    ));
  }), allowManage && !adding && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setAdding(true),
      style: {
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 12,
        cursor: "pointer",
        border: "1px dashed var(--primary-dim)",
        color: "var(--secondary)",
        background: "transparent"
      }
    },
    "\uFF0B \uC0C8 \uCE74\uD14C\uACE0\uB9AC"
  ), allowManage && adding && /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", gap: 4, alignItems: "center" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      autoFocus: true,
      className: "field-input",
      value: newName,
      onChange: (e) => setNewName(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addCat();
        }
        if (e.key === "Escape") {
          setAdding(false);
          setNewName("");
        }
      },
      placeholder: "\uCE74\uD14C\uACE0\uB9AC \uC774\uB984",
      style: { padding: "4px 10px", fontSize: 12, width: 140 }
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: addCat, disabled: !newName.trim() || busy }, "\uCD94\uAC00"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => {
    setAdding(false);
    setNewName("");
  } }, "\uCDE8\uC18C"))));
};
const AdminColumnEditor = ({ initialColumn, onPayloadChange, onAfterSave } = {}) => {
  var _a, _b;
  const [editingId, setEditingId] = React.useState((initialColumn == null ? void 0 : initialColumn.id) || null);
  const [title, setTitle] = React.useState((initialColumn == null ? void 0 : initialColumn.title) || "");
  const [category, setCategory] = React.useState((initialColumn == null ? void 0 : initialColumn.category) || "\uC655\uC758 \uBBF8\uD559");
  const [excerpt, setExcerpt] = React.useState((initialColumn == null ? void 0 : initialColumn.excerpt) || "");
  const [html, setHtml] = React.useState(((_a = initialColumn == null ? void 0 : initialColumn.body) == null ? void 0 : _a.html) || "");
  const [text, setText] = React.useState(((_b = initialColumn == null ? void 0 : initialColumn.body) == null ? void 0 : _b.text) || "");
  const [publishAt, setPublishAt] = React.useState((initialColumn == null ? void 0 : initialColumn.publishAt) || "");
  const [sourceCredit, setSourceCredit] = React.useState((initialColumn == null ? void 0 : initialColumn.sourceCredit) || "");
  const [sourceUrl, setSourceUrl] = React.useState((initialColumn == null ? void 0 : initialColumn.sourceUrl) || "");
  const [coverUrl, setCoverUrl] = React.useState((initialColumn == null ? void 0 : initialColumn.coverUrl) || "");
  const [coverCredit, setCoverCredit] = React.useState((initialColumn == null ? void 0 : initialColumn.coverCredit) || "");
  const _toLocalInput = (iso) => {
    var _a2, _b2;
    if (!iso) return "";
    try {
      const parts = (_b2 = (_a2 = window.BGNJ_FMT) == null ? void 0 : _a2.kstDateTime) == null ? void 0 : _b2.call(_a2, iso);
      if (parts) return parts.replace(" KST", "").replace(" ", "T").slice(0, 16);
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch (e) {
      return "";
    }
  };
  const [createdAt, setCreatedAt] = React.useState(_toLocalInput((initialColumn == null ? void 0 : initialColumn.createdAt) || (initialColumn == null ? void 0 : initialColumn.created_at) || ""));
  const [editorKey, setEditorKey] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [tick, setTick] = React.useState(0);
  const [msg, setMsg] = React.useState("");
  const [uploadingCover, setUploadingCover] = React.useState(false);
  React.useEffect(() => {
    if (typeof onPayloadChange !== "function") return;
    onPayloadChange({ id: editingId, title, category, excerpt, html, text, publishAt, createdAt });
  }, [editingId, title, category, excerpt, html, text, publishAt, createdAt, onPayloadChange]);
  const all = React.useMemo(() => window.BGNJ_COLUMNS.listAll(), [tick]);
  const filtered = statusFilter === "all" ? all : all.filter((c) => (c.status || "published") === statusFilter);
  const counts = {
    all: all.length,
    draft: all.filter((c) => c.status === "draft").length,
    scheduled: all.filter((c) => c.status === "scheduled").length,
    published: all.filter((c) => (c.status || "published") === "published").length
  };
  const reset = () => {
    setEditingId(null);
    setTitle("");
    setExcerpt("");
    setHtml("");
    setText("");
    setPublishAt("");
    setCreatedAt("");
    setSourceCredit("");
    setSourceUrl("");
    setCoverUrl("");
    setCoverCredit("");
    setEditorKey((k) => k + 1);
  };
  const startEdit = (col) => {
    var _a2, _b2;
    setEditingId(col.id);
    setTitle(col.title || "");
    setCategory(col.category || "\uC655\uC758 \uBBF8\uD559");
    setExcerpt(col.excerpt || "");
    setHtml(((_a2 = col.body) == null ? void 0 : _a2.html) || "");
    setText(((_b2 = col.body) == null ? void 0 : _b2.text) || "");
    setPublishAt(col.publishAt || "");
    setCreatedAt(_toLocalInput(col.createdAt || col.created_at || ""));
    setSourceCredit(col.sourceCredit || "");
    setSourceUrl(col.sourceUrl || "");
    setCoverUrl(col.coverUrl || "");
    setCoverCredit(col.coverCredit || "");
    setEditorKey((k) => k + 1);
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const buildPayload = (status) => {
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const id = editingId || `c-${Date.now()}`;
    const base = {
      id,
      title: title.trim(),
      category,
      excerpt: excerpt.trim() || text.slice(0, 100),
      date: `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`,
      readTime: window.BGNJ_COLUMNS.estimateReadTime(text),
      body: { html, text },
      status,
      authorId: "user-admin",
      author: "\uBC45\uAE30\uB178\uC790"
    };
    if (status === "published") {
      base.publishedAt = base.publishedAt || now.toISOString();
      base.publishAt = null;
    } else if (status === "scheduled") {
      base.publishAt = publishAt || null;
    } else if (status === "draft") {
      base.publishAt = null;
    }
    if (createdAt) {
      base.createdAt = `${createdAt}:00+09:00`;
    }
    base.sourceCredit = sourceCredit.trim();
    base.sourceUrl = sourceUrl.trim();
    let resolvedCover = coverUrl.trim();
    if (!resolvedCover && html) {
      const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
      if (m && m[1]) resolvedCover = m[1];
    }
    base.coverUrl = resolvedCover;
    base.coverCredit = coverCredit.trim();
    return base;
  };
  const validate = (status) => {
    if (!title.trim()) {
      setMsg("\uC81C\uBAA9\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return false;
    }
    if (!text.trim()) {
      setMsg("\uBCF8\uBB38\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return false;
    }
    if (status === "scheduled") {
      if (!publishAt) {
        setMsg("\uC608\uC57D \uBC1C\uD589\uC740 \uBC1C\uD589 \uC2DC\uAC01\uC744 \uC785\uB825\uD574\uC57C \uD569\uB2C8\uB2E4.");
        return false;
      }
      if (new Date(publishAt).getTime() <= Date.now()) {
        setMsg("\uC608\uC57D \uC2DC\uAC01\uC740 \uD604\uC7AC\uBCF4\uB2E4 \uBBF8\uB798\uC5EC\uC57C \uD569\uB2C8\uB2E4.");
        return false;
      }
    }
    return true;
  };
  const save = async (status) => {
    setMsg("");
    if (!validate(status)) return;
    const payload = buildPayload(status);
    try {
      await window.BGNJ_COLUMNS.saveColumn(payload);
      setTick((v) => v + 1);
      const label = status === "published" ? "\uBC1C\uD589" : status === "scheduled" ? "\uC608\uC57D \uBC1C\uD589" : "\uC784\uC2DC \uC800\uC7A5";
      setMsg(`"${payload.title}" ${label} \uC644\uB8CC.`);
      if (status === "published") reset();
      else setEditingId(payload.id);
      try {
        onAfterSave == null ? void 0 : onAfterSave(status);
      } catch (e) {
      }
    } catch (err) {
      setMsg("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const remove = async (id) => {
    if (!await window.BGNJ_CONFIRM("\uC774 \uCE7C\uB7FC\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) return;
    try {
      await window.BGNJ_COLUMNS.deleteColumn(id);
      setTick((v) => v + 1);
      if (editingId === id) reset();
    } catch (err) {
      window.BGNJ_TOAST.error("\uC0AD\uC81C \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const unpublish = async (id) => {
    if (!await window.BGNJ_CONFIRM("\uC774 \uCE7C\uB7FC\uC744 \uBC1C\uD589 \uCDE8\uC18C(\uC784\uC2DC \uC800\uC7A5\uC73C\uB85C \uB418\uB3CC\uB9BC)\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) return;
    const col = window.BGNJ_COLUMNS.getColumn(id);
    if (!col) return;
    window.BGNJ_COLUMNS.saveColumn({ ...col, status: "draft", publishAt: null, publishedAt: null });
    setTick((v) => v + 1);
  };
  const statusBadge = (s) => {
    const map = {
      draft: { label: "DRAFT", color: "var(--ink-3)" },
      scheduled: { label: "SCHEDULED", color: "var(--ink-2)" },
      published: { label: "PUBLISHED", color: "var(--secondary)" }
    };
    const m = map[s || "published"];
    return /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 9, letterSpacing: "0.22em", color: m.color, border: `1px solid ${m.color}`, padding: "1px 6px" } }, m.label);
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 24, lineHeight: 1.8 } }, /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC"), "\uC740 \uAD00\uB9AC\uC790\uB9CC \uC791\uC131\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC784\uC2DC \uC800\uC7A5\uC73C\uB85C \uBCF8\uBB38\uC744 \uBCF4\uAD00\uD558\uAC70\uB098 \uC608\uC57D \uBC1C\uD589 \uC2DC\uAC01\uC744 \uC9C0\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("form", { onSubmit: (e) => {
    e.preventDefault();
    save("published");
  }, style: { marginBottom: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em" } }, editingId ? `EDIT \xB7 ${editingId}` : "NEW COLUMN"), editingId && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: reset }, "\uC0C8 \uCE7C\uB7FC\uC73C\uB85C \uC804\uD658")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 200px", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "col-title" }, "\uC81C\uBAA9 ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "col-title",
      className: "field-input",
      value: title,
      onChange: (e) => setTitle(e.target.value),
      placeholder: "\uCE7C\uB7FC \uC81C\uBAA9"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uCE74\uD14C\uACE0\uB9AC"), /* @__PURE__ */ React.createElement(ColumnCategoryChips, { selected: category, onSelect: setCategory })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "col-subtitle" }, "\uBD80\uC81C\uBAA9 (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "col-subtitle",
      type: "text",
      className: "field-input",
      value: excerpt,
      onChange: (e) => setExcerpt(e.target.value),
      placeholder: "\uC81C\uBAA9 \uC544\uB798 \uC791\uC740 \uBB38\uAD6C \u2014 \uBAA9\uB85D \uCE74\uB4DC/\uC0C1\uC138 \uC0C1\uB2E8\uC5D0 \uB178\uCD9C (\uBE44\uC6B0\uBA74 \uBCF8\uBB38 \uC55E\uBD80\uBD84 \uC790\uB3D9 \uCD94\uCD9C)"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBCF8\uBB38 ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement(
    TiptapEditor,
    {
      key: editorKey,
      preset: "column",
      content: html,
      onUpdate: (h, _j, t) => {
        setHtml(h);
        setText(t);
      },
      placeholder: "\uCE7C\uB7FC \uBCF8\uBB38\uC744 \uC791\uC131\uD558\uC138\uC694. \uD234\uBC14\uC758 \u{1F5BC} \uBCF8\uBB38 \uC774\uBBF8\uC9C0 \uBC84\uD2BC\uC73C\uB85C \uC774\uBBF8\uC9C0\uB97C \uC0BD\uC785\uD558\uACE0, \uB4DC\uB798\uADF8\uB85C \uC774\uB3D9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 10, letterSpacing: "0.18em", marginTop: 6 } }, "\uCD94\uC815 \uC77D\uAE30 \uC2DC\uAC04 \xB7 ", window.BGNJ_COLUMNS.estimateReadTime(text), " \xB7 \uBCF8\uBB38 ", text.length, "\uC790")), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "col-publishAt" }, "\uC608\uC57D \uBC1C\uD589 \uC2DC\uAC01 (\uC120\uD0DD \u2014 \uBE44\uC6B0\uBA74 \uC989\uC2DC \uBC1C\uD589)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "col-publishAt",
      type: "datetime-local",
      className: "field-input",
      value: publishAt,
      onChange: (e) => setPublishAt(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { padding: "12px 14px", background: "rgba(245,213,72,0.04)", border: "1px dashed var(--primary-dim)" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "col-createdAt", style: { display: "block", marginBottom: 6 } }, "\uC5C5\uB85C\uB4DC \uC2DC\uAC04 (\uC120\uD0DD \u2014 \uBE44\uC6B0\uBA74 \uBC1C\uD589 \uC2DC\uC810\uC758 \uD604\uC7AC \uC2DC\uAC04)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "col-createdAt",
      type: "datetime-local",
      className: "field-input",
      value: createdAt,
      onChange: (e) => setCreatedAt(e.target.value),
      style: { maxWidth: 280 }
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11, marginTop: 4 } }, "KST \uAE30\uC900. \uC785\uB825 \uC2DC \uCE7C\uB7FC \uD45C\uC2DC \uC2DC\uAC01\uC774 \uC774 \uAC12\uC73C\uB85C \uACE0\uC815\uB428. \uC608\uC57D \uBC1C\uD589\uACFC \uBB34\uAD00 \u2014 \uD45C\uC2DC\uC6A9 \uC2DC\uAC04.")), /* @__PURE__ */ React.createElement("div", { className: "field", style: { padding: "12px 14px", background: "rgba(245,213,72,0.04)", border: "1px dashed var(--primary-dim)", display: "grid", gap: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "col-source-credit", style: { display: "block", marginBottom: 6 } }, "\uAE30\uACE0\uCC98 (\uC120\uD0DD \u2014 \uC678\uBD80 \uB9E4\uCCB4 \uCD9C\uCC98)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "col-source-credit",
      type: "text",
      className: "field-input",
      placeholder: "\uC608: \uD55C\uACA8\uB808, \uC911\uC559\uC77C\uBCF4, \uD55C\uAD6D\uC77C\uBCF4 \uCE7C\uB7FC",
      value: sourceCredit,
      onChange: (e) => setSourceCredit(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "col-source-url", style: { display: "block", marginBottom: 6 } }, "\uC6D0\uBB38 \uB9C1\uD06C (\uC120\uD0DD \u2014 http/https URL)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "col-source-url",
      type: "url",
      className: "field-input",
      placeholder: "https://...",
      value: sourceUrl,
      onChange: (e) => setSourceUrl(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11, marginTop: 4 } }, "\uB458 \uB2E4 \uBE44\uC5B4\uC788\uC73C\uBA74 \uCD9C\uCC98 \uD45C\uAE30 \uC5C6\uC774 \uAC8C\uC7AC. \uAE30\uACE0\uCC98\uB9CC \uC788\uC73C\uBA74 \uD14D\uC2A4\uD2B8\uB85C, \uB9C1\uD06C\uAE4C\uC9C0 \uC788\uC73C\uBA74 \uD074\uB9AD \uAC00\uB2A5 \uB9C1\uD06C\uB85C \uD45C\uC2DC."))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { padding: "12px 14px", background: "rgba(245,213,72,0.04)", border: "1px dashed var(--primary-dim)", display: "grid", gap: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "field-label", style: { display: "block", marginBottom: 6 } }, "\uB300\uD45C \uC774\uBBF8\uC9C0 (\uC120\uD0DD \u2014 \uBE44\uC6B0\uBA74 \uBCF8\uBB38 \uCCAB \uC774\uBBF8\uC9C0 \uC790\uB3D9 \uC0AC\uC6A9)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      disabled: uploadingCover,
      onClick: async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          var _a2;
          const f = (_a2 = input.files) == null ? void 0 : _a2[0];
          if (!f) return;
          try {
            setUploadingCover(true);
            const { url } = await window.BGNJ_MEDIA.uploadFile(f, { folder: "column-covers", maxBytes: 10 * 1024 * 1024 });
            setCoverUrl(url);
          } catch (err) {
            try {
              window.BGNJ_TOAST.error("\uB300\uD45C \uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || err));
            } catch (e) {
            }
          } finally {
            setUploadingCover(false);
          }
        };
        input.click();
      }
    },
    uploadingCover ? "\u23F3 \uC5C5\uB85C\uB4DC \uC911\u2026" : "\u{1F5BC} \uD30C\uC77C \uC5C5\uB85C\uB4DC"
  ), coverUrl && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("img", { src: coverUrl, alt: "cover preview", style: { width: 60, height: 40, objectFit: "cover", border: "1px solid var(--line)" } }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setCoverUrl("") }, "\uC81C\uAC70"))), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "col-cover-url",
      type: "url",
      className: "field-input",
      style: { marginTop: 8 },
      placeholder: "\uB610\uB294 URL \uC9C1\uC811 \uC785\uB825 \u2014 \uBE44\uC6B0\uBA74 \uBCF8\uBB38 \uCCAB \uC774\uBBF8\uC9C0\uAC00 \uC790\uB3D9 \uB300\uD45C \uC774\uBBF8\uC9C0\uAC00 \uB429\uB2C8\uB2E4",
      value: coverUrl,
      onChange: (e) => setCoverUrl(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "col-cover-credit", style: { display: "block", marginBottom: 6 } }, "\uB300\uD45C \uC774\uBBF8\uC9C0 \uCD9C\uCC98 (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "col-cover-credit",
      type: "text",
      className: "field-input",
      placeholder: "\uC608: Unsplash / Sarah Kim, \uBCF8\uC778 \uCD2C\uC601",
      value: coverCredit,
      onChange: (e) => setCoverCredit(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11, marginTop: 4 } }, "\uCE7C\uB7FC \uD398\uC774\uC9C0\uC758 \uB300\uD45C \uC774\uBBF8\uC9C0 \uC6B0\uD558\uB2E8\uC5D0 \xA9 \uD45C\uAE30\uB85C \uB178\uCD9C. \uBE44\uC6B0\uBA74 \uD45C\uAE30 \uC5C6\uC774 \uAC8C\uC7AC."))), msg && /* @__PURE__ */ React.createElement("div", { role: "status", className: "mono gold", style: { fontSize: 12, padding: 10, border: "1px solid var(--primary-dim)", background: "rgba(245,213,72,0.06)", marginBottom: 16 } }, msg), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 20, borderTop: "1px solid var(--line)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: reset }, "\uCD08\uAE30\uD654"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: () => save("draft") }, editingId ? "\uC218\uC815 \uC784\uC2DC\uC800\uC7A5" : "\uC784\uC2DC \uC800\uC7A5"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: () => save("scheduled"), disabled: !publishAt }, editingId ? "\uC218\uC815 \uC608\uC57D \uBC1C\uD589" : "\uC608\uC57D \uBC1C\uD589"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold" }, editingId ? "\uC218\uC815 \uBC1C\uD589 \u2192" : "\uC989\uC2DC \uBC1C\uD589 \u2192"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 20 } }, "\uAD00\uB9AC \uC911\uC778 \uCE7C\uB7FC (", counts.all, ")"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, [
    { key: "all", label: "\uC804\uCCB4" },
    { key: "published", label: "\uBC1C\uD589" },
    { key: "scheduled", label: "\uC608\uC57D" },
    { key: "draft", label: "\uC784\uC2DC" }
  ].map((f) => {
    var _a2;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: f.key,
        type: "button",
        className: "btn btn-small",
        onClick: () => setStatusFilter(f.key),
        style: {
          borderColor: statusFilter === f.key ? "var(--primary)" : "var(--line)",
          color: statusFilter === f.key ? "var(--primary)" : "var(--ink-2)",
          background: statusFilter === f.key ? "rgba(245,213,72,0.06)" : "transparent"
        }
      },
      f.label,
      " ",
      /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, marginLeft: 4 } }, (_a2 = counts[f.key]) != null ? _a2 : 0)
    );
  }))), filtered.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "dim" }, "\uD574\uB2F9 \uC0C1\uD0DC\uC758 \uCE7C\uB7FC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { className: "grid grid-2" }, filtered.map((c) => /* @__PURE__ */ React.createElement("article", { key: c.id, className: "card" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "pill" }, c.category), statusBadge(c.status)), /* @__PURE__ */ React.createElement("time", { className: "mono dim-2", style: { fontSize: 10 } }, c.date)), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 17, marginBottom: 8 } }, c.title), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginBottom: 8 } }, c.excerpt), c.status === "scheduled" && c.publishAt && /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 11, color: "var(--ink-2)", marginBottom: 12 } }, "\uC608\uC57D \uC2DC\uAC01 \xB7 ", window.BGNJ_FMT.kstDateTime(c.publishAt)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => startEdit(c) }, "\uC218\uC815"), c.status === "published" && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => unpublish(c.id) }, "\uBC1C\uD589 \uCDE8\uC18C"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => remove(c.id),
      style: { borderColor: "var(--danger)", color: "var(--danger)", marginLeft: "auto" }
    },
    "\uC0AD\uC81C"
  )))))));
};
const ColumnsHubPanel = ({ allColumns }) => {
  var _a;
  const [tick, setTick] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [initialCol, setInitialCol] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [drafts, setDrafts] = React.useState(() => {
    var _a2, _b;
    return ((_b = (_a2 = window.BGNJ_DRAFTS) == null ? void 0 : _a2.list) == null ? void 0 : _b.call(_a2, "column")) || [];
  });
  React.useEffect(() => {
    (async () => {
      var _a2, _b;
      try {
        await ((_b = (_a2 = window.BGNJ_COLUMNS) == null ? void 0 : _a2.refresh) == null ? void 0 : _b.call(_a2, { admin: true }));
      } catch (e) {
      }
      setTick((v) => v + 1);
    })();
  }, []);
  const [scTick, setScTick] = React.useState(0);
  const sc = React.useMemo(() => {
    var _a2, _b;
    return ((_b = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) || {};
  }, [scTick]);
  const colCats = Array.isArray(sc.columnCategories) ? sc.columnCategories : [];
  const [newCatName, setNewCatName] = React.useState("");
  const [catMsg, setCatMsg] = React.useState("");
  const addColCategory = async () => {
    setCatMsg("");
    const v = newCatName.trim();
    if (!v) {
      setCatMsg("\uCE74\uD14C\uACE0\uB9AC \uC774\uB984\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    if (colCats.includes(v)) {
      setCatMsg("\uC774\uBBF8 \uC874\uC7AC\uD558\uB294 \uCE74\uD14C\uACE0\uB9AC\uC785\uB2C8\uB2E4.");
      return;
    }
    try {
      await window.BGNJ_SITE_CONTENT.saveSection("columnCategories", [...colCats, v]);
      setNewCatName("");
      setScTick((x) => x + 1);
      setCatMsg(`'${v}' \uCD94\uAC00\uB428.`);
    } catch (err) {
      setCatMsg("\uCD94\uAC00 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    }
  };
  const removeColCategory = async (name) => {
    if (!await window.BGNJ_CONFIRM(`'${name}' \uCE74\uD14C\uACE0\uB9AC\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?
(\uAE30\uC874 \uCE7C\uB7FC\uC758 \uCE74\uD14C\uACE0\uB9AC \uAC12\uC740 \uC720\uC9C0\uB418\uC9C0\uB9CC \uC0C8 \uCE7C\uB7FC \uC791\uC131 \uC2DC \uC120\uD0DD\uC9C0\uC5D0\uC11C \uC0AC\uB77C\uC9D1\uB2C8\uB2E4.)`, { danger: true })) return;
    try {
      await window.BGNJ_SITE_CONTENT.saveSection("columnCategories", colCats.filter((c) => c !== name));
      setScTick((x) => x + 1);
      setCatMsg(`'${name}' \uC0AD\uC81C\uB428.`);
    } catch (err) {
      setCatMsg("\uC0AD\uC81C \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    }
  };
  React.useEffect(() => {
    const onChange = () => {
      var _a2, _b;
      return setDrafts(((_b = (_a2 = window.BGNJ_DRAFTS) == null ? void 0 : _a2.list) == null ? void 0 : _b.call(_a2, "column")) || []);
    };
    window.addEventListener("bgnj-drafts-change", onChange);
    return () => window.removeEventListener("bgnj-drafts-change", onChange);
  }, []);
  const all = React.useMemo(() => {
    try {
      return window.BGNJ_COLUMNS.listAll();
    } catch (e) {
      return allColumns || [];
    }
  }, [tick, allColumns]);
  const filtered = statusFilter === "all" ? all : all.filter((c) => (c.status || "published") === statusFilter);
  const counts = {
    all: all.length,
    draft: all.filter((c) => c.status === "draft").length,
    scheduled: all.filter((c) => c.status === "scheduled").length,
    published: all.filter((c) => (c.status || "published") === "published").length
  };
  const openCreate = () => {
    setInitialCol(null);
    setModalOpen(true);
  };
  const openCreateFromDraft = (d) => {
    setInitialCol({
      id: null,
      title: d.title || "",
      category: d.category || "\uC655\uC758 \uBBF8\uD559",
      excerpt: d.excerpt || "",
      body: { html: d.html || "", text: d.text || "" },
      publishAt: d.publishAt || ""
    });
    setModalOpen(true);
  };
  const openEdit = (col) => {
    setInitialCol(col);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setInitialCol(null);
    setTick((v) => v + 1);
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, margin: 0, flex: 1, minWidth: 280 } }, "\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC \uBAA9\uB85D\uC785\uB2C8\uB2E4. ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uFF0B \uAE00\uC4F0\uAE30"), " \uB85C \uC0C8 \uCE7C\uB7FC\uC744 \uBAA8\uB2EC\uC5D0\uC11C \uC791\uC131\uD558\uC138\uC694. \uBAA8\uB2EC \uC678\uBD80 \uD074\uB9AD \uB610\uB294 ESC \uC2DC \uC784\uC2DC\uC800\uC7A5 \uD504\uB86C\uD504\uD2B8\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4 (\uCD5C\uB300 7\uC77C\xB710\uAC1C \uBCF4\uAD00)."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: openCreate }, "\uFF0B \uAE00\uC4F0\uAE30")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 } }, "\uCE74\uD14C\uACE0\uB9AC \uAD00\uB9AC"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 } }, colCats.length === 0 && /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 12 } }, "\uB4F1\uB85D\uB41C \uCE74\uD14C\uACE0\uB9AC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uCD94\uAC00\uD558\uC138\uC694."), colCats.map((c) => /* @__PURE__ */ React.createElement("span", { key: c, style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", border: "1px solid var(--line)", fontSize: 12 } }, c, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => removeColCategory(c),
      "aria-label": `${c} \uC0AD\uC81C`,
      style: { background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }
    },
    "\u2715"
  )))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "field-input",
      placeholder: "\uC0C8 \uCE74\uD14C\uACE0\uB9AC \uC774\uB984",
      value: newCatName,
      onChange: (e) => setNewCatName(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addColCategory();
        }
      },
      style: { flex: 1, maxWidth: 280 }
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: addColCategory }, "\uFF0B \uCD94\uAC00")), catMsg && /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 11, marginTop: 6 } }, catMsg)), drafts.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 } }, "\uC784\uC2DC\uC800\uC7A5 (", drafts.length, "/", ((_a = window.BGNJ_DRAFTS) == null ? void 0 : _a.MAX_COUNT) || 10, ")"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 } }, drafts.map((d) => /* @__PURE__ */ React.createElement("li", { key: d.id, style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, minWidth: 120 } }, d.savedAt ? window.BGNJ_FMT.kstShort(d.savedAt) : ""), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, color: "var(--ink)" } }, d.title || "(\uC81C\uBAA9 \uC5C6\uC74C)"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", style: { fontSize: 10 }, onClick: () => openCreateFromDraft(d) }, "\uC774\uC5B4\uC4F0\uAE30"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      style: { fontSize: 10, borderColor: "var(--danger)", color: "var(--danger)" },
      onClick: () => {
        window.BGNJ_DRAFTS.remove(d.id);
      }
    },
    "\uC0AD\uC81C"
  ))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 } }, [
    { k: "all", label: `\uC804\uCCB4 (${counts.all})` },
    { k: "published", label: `\uBC1C\uD589 (${counts.published})` },
    { k: "scheduled", label: `\uC608\uC57D (${counts.scheduled})` },
    { k: "draft", label: `\uCD08\uC548 (${counts.draft})` }
  ].map((f) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: f.k,
      type: "button",
      className: "btn btn-small",
      onClick: () => setStatusFilter(f.k),
      style: {
        fontSize: 11,
        borderColor: statusFilter === f.k ? "var(--primary)" : "var(--line-2)",
        color: statusFilter === f.k ? "var(--primary)" : "var(--ink)",
        background: statusFilter === f.k ? "rgba(245,213,72,0.10)" : "var(--bg-2)",
        fontWeight: statusFilter === f.k ? 700 : 500
      }
    },
    f.label
  ))), filtered.length === 0 ? /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", padding: "24px 0" } }, statusFilter === "all" ? "\uCE7C\uB7FC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uFF0B \uAE00\uC4F0\uAE30 \uB85C \uC2DC\uC791\uD558\uC138\uC694." : "\uD544\uD130 \uC870\uAC74\uC5D0 \uB9DE\uB294 \uCE7C\uB7FC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto", border: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("table", { className: "admin-table", style: { width: "100%", borderCollapse: "collapse", fontSize: 13 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("th", { style: { textAlign: "left", padding: "10px 12px", fontWeight: 600, width: 90 } }, "\uCE74\uD14C\uACE0\uB9AC"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "left", padding: "10px 12px", fontWeight: 600 } }, "\uC81C\uBAA9"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "left", padding: "10px 12px", fontWeight: 600, width: 110 } }, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "left", padding: "10px 12px", fontWeight: 600, width: 140 } }, "\uC791\uC131\uC77C"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "left", padding: "10px 12px", fontWeight: 600, width: 80 } }, "\uC77D\uAE30\uC2DC\uAC04"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "right", padding: "10px 12px", fontWeight: 600, width: 80 } }, "\uC561\uC158"))), /* @__PURE__ */ React.createElement("tbody", null, filtered.map((c) => {
    var _a2, _b;
    return /* @__PURE__ */ React.createElement("tr", { key: c.id, style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "10px 12px" } }, /* @__PURE__ */ React.createElement("span", { className: "pill", style: { fontSize: 11 } }, c.category)), /* @__PURE__ */ React.createElement("td", { style: { padding: "10px 12px" } }, /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 14, fontWeight: 600 } }, c.title), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, marginTop: 2 } }, "#", String(c.id).slice(-6))), /* @__PURE__ */ React.createElement("td", { style: { padding: "10px 12px" } }, (() => {
      const m = {
        draft: { label: "DRAFT", color: "var(--ink-3)" },
        scheduled: { label: "SCHEDULED", color: "var(--ink-2)" },
        published: { label: "PUBLISHED", color: "var(--secondary)" }
      }[c.status || "published"];
      return /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 9, letterSpacing: "0.18em", color: m.color, border: `1px solid ${m.color}`, padding: "1px 6px" } }, m.label);
    })()), /* @__PURE__ */ React.createElement("td", { style: { padding: "10px 12px" }, className: "mono dim-2" }, c.date || (c.createdAt ? ((_b = (_a2 = window.BGNJ_FMT) == null ? void 0 : _a2.kstShort) == null ? void 0 : _b.call(_a2, c.createdAt)) || "" : "")), /* @__PURE__ */ React.createElement("td", { style: { padding: "10px 12px" }, className: "mono dim-2" }, c.readTime || ""), /* @__PURE__ */ React.createElement("td", { style: { padding: "10px 12px", textAlign: "right" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => openEdit(c) }, "\uD3B8\uC9D1")));
  })))), modalOpen && /* @__PURE__ */ React.createElement(ColumnEditorModalContent, { initialColumn: initialCol, onClose: closeModal }));
};
const ColumnEditorModalContent = ({ initialColumn, onClose }) => {
  var _a, _b;
  const [payload, setPayload] = React.useState(null);
  const dirty = !!(payload && (((_a = payload.title) == null ? void 0 : _a.trim()) || ((_b = payload.text) == null ? void 0 : _b.trim())));
  const saveDraft = React.useCallback(() => {
    if (!payload) return;
    try {
      window.BGNJ_DRAFTS.save({
        kind: "column",
        title: payload.title || "",
        category: payload.category || "",
        excerpt: payload.excerpt || "",
        html: payload.html || "",
        text: payload.text || "",
        publishAt: payload.publishAt || ""
      });
    } catch (e) {
    }
  }, [payload]);
  const { onBackdropClick } = window.useModalGuard({
    open: true,
    dirty,
    onClose,
    onSaveDraft: saveDraft,
    label: "\uCE7C\uB7FC"
  });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "\uCE7C\uB7FC \uC791\uC131",
      onClick: onBackdropClick,
      style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1e3, display: "grid", placeItems: "start center", padding: 24, overflowY: "auto" }
    },
    /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: {
      width: "min(1100px, 100%)",
      background: "var(--bg)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
      padding: 24,
      marginTop: 24,
      marginBottom: 48
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 18, margin: 0 } }, (initialColumn == null ? void 0 : initialColumn.id) ? "\uCE7C\uB7FC \uD3B8\uC9D1" : "\uC0C8 \uCE7C\uB7FC \uC791\uC131"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: async () => {
      if (!dirty) {
        onClose == null ? void 0 : onClose();
        return;
      }
      const ok = await window.BGNJ_CONFIRM("\uC791\uC131 \uC911\uC778 \uCE7C\uB7FC\uC774 \uC800\uC7A5\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC784\uC2DC\uC800\uC7A5 \uD558\uC2DC\uACA0\uC5B4\uC694?", {
        confirmLabel: "\uC784\uC2DC\uC800\uC7A5",
        cancelLabel: "\uCDE8\uC18C",
        danger: false,
        dismissOnBackdrop: false
      });
      if (!ok) return;
      saveDraft();
      onClose == null ? void 0 : onClose();
    } }, "\uB2EB\uAE30")), /* @__PURE__ */ React.createElement(
      AdminColumnEditor,
      {
        initialColumn: initialColumn || void 0,
        onPayloadChange: setPayload,
        onAfterSave: (status) => {
          if (status === "published" || status === "scheduled") onClose == null ? void 0 : onClose();
        }
      }
    ))
  );
};
const AdminDenied = ({ go, user }) => /* @__PURE__ */ React.createElement("div", { className: "section", style: { minHeight: "calc(100vh - 72px)", display: "grid", placeItems: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { maxWidth: 480, textAlign: "center", padding: 48 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.3em", marginBottom: 12 } }, "\u25C6 ACCESS DENIED"), /* @__PURE__ */ React.createElement("h1", { className: "ko-serif", style: { fontSize: 24, marginBottom: 16 } }, "\uAD00\uB9AC\uC790 \uAD8C\uD55C\uC774 \uD544\uC694\uD569\uB2C8\uB2E4"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 24 } }, user ? /* @__PURE__ */ React.createElement(React.Fragment, null, "\uD604\uC7AC \uB85C\uADF8\uC778 \uACC4\uC815(", /* @__PURE__ */ React.createElement("span", { className: "gold" }, user.email), ")\uC740 \uAD00\uB9AC\uC790 \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : "\uC774 \uD398\uC774\uC9C0\uB294 \uB85C\uADF8\uC778\uD55C \uAD00\uB9AC\uC790\uB9CC \uC811\uADFC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: () => go(user ? "home" : "login") }, user ? "\uD648\uC73C\uB85C" : "\uB85C\uADF8\uC778"))));
Object.assign(window, { LoginPage, AdminPage, AdminCategoryPanel, AdminGradePanel, AdminColumnEditor, AdminDenied, LectureAdminPanel, BankAccountPanel, BookOrderAdminPanel, TourAdminPanel, MemberAdminPanel, LegalAdminPanel, FaqAdminPanel, AuditLogPanel, ErrorLogPanel, SEOAdminPanel, SearchConsoleAdminPanel, SiteContentAdminPanel, RecommendationsAdminPanel });

})();

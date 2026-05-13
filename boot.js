(function(){
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(err) {
    return { error: err };
  }
  componentDidCatch(err, info) {
    var _a, _b, _c, _d;
    this.setState({ info });
    try {
      console.error("[AppErrorBoundary]", err, info);
    } catch (e) {
    }
    try {
      (_d = (_c = (_b = (_a = window.BGNJ_API) == null ? void 0 : _a.errorLog) == null ? void 0 : _b.report({
        code: (err == null ? void 0 : err.code) || ((err == null ? void 0 : err.name) || "RENDER_ERROR"),
        status: null,
        kind: "render",
        message: (err == null ? void 0 : err.message) || String(err),
        hint: "",
        url: "",
        pathname: location.pathname,
        origin: location.origin
      })) == null ? void 0 : _c.catch) == null ? void 0 : _d.call(_c, () => {
      });
    } catch (e) {
    }
  }
  render() {
    var _a;
    if (this.state.error) {
      const e = this.state.error;
      const code = (e == null ? void 0 : e.code) || ((e == null ? void 0 : e.status) ? `HTTP_${e.status}` : (e == null ? void 0 : e.name) || "RENDER_ERROR");
      const reason = (e == null ? void 0 : e.message) || String(e);
      return /* @__PURE__ */ React.createElement("div", { style: { padding: 40, fontFamily: "monospace", color: "#1f2937", background: "#f8fafc", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement("h2", { style: { color: "#dc2626", marginBottom: 12 } }, "\u26A0 \uD398\uC774\uC9C0 \uB80C\uB354\uB9C1 \uC624\uB958"), /* @__PURE__ */ React.createElement("div", { style: {
        background: "#fff",
        padding: "14px 16px",
        border: "1px solid #fecaca",
        marginBottom: 12,
        fontSize: 13,
        lineHeight: 1.7,
        color: "#1f2937"
      } }, /* @__PURE__ */ React.createElement("div", { style: { color: "#dc2626", fontSize: 11, letterSpacing: "0.18em", marginBottom: 6 } }, "CODE \xB7 ", code), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, marginBottom: 8 } }, reason), (e == null ? void 0 : e.stack) && /* @__PURE__ */ React.createElement("details", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement("summary", { style: { cursor: "pointer", fontSize: 11, color: "#475569" } }, "\uC2A4\uD0DD \uCD94\uC801 (\uAC1C\uBC1C\uC790\uC6A9)"), /* @__PURE__ */ React.createElement("pre", { style: { whiteSpace: "pre-wrap", fontSize: 11, color: "#475569", marginTop: 8 } }, e.stack)), ((_a = this.state.info) == null ? void 0 : _a.componentStack) && /* @__PURE__ */ React.createElement("details", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement("summary", { style: { cursor: "pointer", fontSize: 11, color: "#475569" } }, "\uCEF4\uD3EC\uB10C\uD2B8 \uC2A4\uD0DD (\uAC1C\uBC1C\uC790\uC6A9)"), /* @__PURE__ */ React.createElement("pre", { style: { whiteSpace: "pre-wrap", fontSize: 11, color: "#475569", marginTop: 8 } }, this.state.info.componentStack))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => this.setState({ error: null, info: null }), style: { padding: "8px 16px", cursor: "pointer" } }, "\uB2E4\uC2DC \uC2DC\uB3C4"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        try {
          window.location.reload();
        } catch (e2) {
        }
      }, style: { padding: "8px 16px", cursor: "pointer" } }, "\uD398\uC774\uC9C0 \uC0C8\uB85C\uACE0\uCE68")), /* @__PURE__ */ React.createElement("p", { style: { marginTop: 12, fontSize: 11, color: "#64748b" } }, "\u24D8 \uCD94\uAC00 \uC815\uBCF4\uB294 \uBE0C\uB77C\uC6B0\uC800 \uAC1C\uBC1C\uC790 \uB3C4\uAD6C(F12) \uCF58\uC194\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."));
    }
    return this.props.children;
  }
}
class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(err) {
    return { error: err };
  }
  componentDidCatch(err, info) {
    var _a, _b, _c, _d;
    try {
      console.error("[PageErrorBoundary]", this.props.route, err, info);
    } catch (e) {
    }
    try {
      (_d = (_c = (_b = (_a = window.BGNJ_API) == null ? void 0 : _a.errorLog) == null ? void 0 : _b.report({
        code: (err == null ? void 0 : err.code) || ((err == null ? void 0 : err.name) || "PAGE_RENDER_ERROR"),
        status: null,
        kind: "render",
        message: (err == null ? void 0 : err.message) || String(err),
        hint: `route=${this.props.route}`,
        url: "",
        pathname: location.pathname,
        origin: location.origin
      })) == null ? void 0 : _c.catch) == null ? void 0 : _d.call(_c, () => {
      });
    } catch (e) {
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.route !== this.props.route && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      const e = this.state.error;
      const code = (e == null ? void 0 : e.code) || ((e == null ? void 0 : e.status) ? `HTTP_${e.status}` : (e == null ? void 0 : e.name) || "PAGE_RENDER_ERROR");
      return /* @__PURE__ */ React.createElement("div", { style: { padding: 48, fontFamily: "sans-serif", minHeight: "60vh", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "monospace", fontSize: 11, color: "#dc2626", letterSpacing: "0.18em", marginBottom: 8 } }, code), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, color: "#0f172a", marginBottom: 8, fontWeight: 600 } }, "\uC774 \uD398\uC774\uC9C0\uB97C \uBD88\uB7EC\uC624\uB358 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "#475569", marginBottom: 18, maxWidth: 520, margin: "0 auto 18px", lineHeight: 1.7 } }, (e == null ? void 0 : e.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"), /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", gap: 8 } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => this.setState({ error: null }),
          style: { padding: "10px 18px", cursor: "pointer", border: "1px solid #cbd5e1", background: "#fff" }
        },
        "\uB2E4\uC2DC \uC2DC\uB3C4"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            try {
              this.props.go("home");
              this.setState({ error: null });
            } catch (e2) {
            }
          },
          style: { padding: "10px 18px", cursor: "pointer", border: "1px solid #cbd5e1", background: "#fff" }
        },
        "\uD648\uC73C\uB85C"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            try {
              window.location.reload();
            } catch (e2) {
            }
          },
          style: { padding: "10px 18px", cursor: "pointer", border: "1px solid #f5d548", background: "#f5d548", color: "#0f172a", fontWeight: 600 }
        },
        "\uC0C8\uB85C\uACE0\uCE68"
      )));
    }
    return this.props.children;
  }
}
const TOAST_DISMISS_MS = 1e4;
let __reportingError = false;
const reportErrorToServer = (entry) => {
  var _a, _b;
  if (__reportingError) return;
  if (typeof entry.url === "string" && entry.url.includes("/api/error-log")) return;
  __reportingError = true;
  try {
    const p = (_b = (_a = window.BGNJ_API) == null ? void 0 : _a.errorLog) == null ? void 0 : _b.report({
      code: entry.code,
      status: entry.status,
      kind: entry.kind,
      message: entry.message,
      hint: entry.hint,
      url: entry.url,
      pathname: location.pathname,
      origin: location.origin
    });
    if (p && typeof p.catch === "function") {
      p.catch(() => {
      }).finally(() => {
        __reportingError = false;
      });
    } else {
      __reportingError = false;
    }
  } catch (e) {
    __reportingError = false;
  }
};
const GlobalErrorToast = () => {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    const push = (entry) => {
      const id = Date.now() + Math.random();
      const kind = entry.kind || (entry.code ? "error" : "error");
      setToasts((prev) => [...prev, { id, ...entry, kind }].slice(-3));
      if (kind === "error") reportErrorToServer(entry);
      const ttl = entry.ttl || TOAST_DISMISS_MS;
      setTimeout(() => {
        setToasts((prev) => prev.filter((e) => e.id !== id));
      }, ttl);
    };
    const onRejection = (ev) => {
      const r = ev == null ? void 0 : ev.reason;
      if (!r) return;
      const code = r.code || (r.status ? `HTTP_${r.status}` : r.name || "PROMISE_REJECTION");
      const message = r.message || String(r);
      push({ kind: "error", code, status: r.status || null, message, hint: r.hint || "", url: r.url || "" });
      try {
        console.error("[GlobalErrorToast]", r);
      } catch (e) {
      }
    };
    const onError = (ev) => {
      var _a;
      const message = (ev == null ? void 0 : ev.message) || ((_a = ev == null ? void 0 : ev.error) == null ? void 0 : _a.message) || "Script error";
      push({ kind: "error", code: "WINDOW_ERROR", status: null, message, hint: "", url: (ev == null ? void 0 : ev.filename) || "" });
      try {
        console.error("[GlobalErrorToast]", (ev == null ? void 0 : ev.error) || ev);
      } catch (e) {
      }
    };
    const onProgrammatic = (ev) => {
      const d = (ev == null ? void 0 : ev.detail) || {};
      if (!d.message) return;
      push({
        kind: d.kind || "info",
        code: d.code || (d.kind === "success" ? "OK" : d.kind === "error" ? "ERROR" : "INFO"),
        message: d.message,
        hint: d.hint || "",
        url: d.url || "",
        ttl: d.ttl
      });
    };
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onError);
    window.addEventListener("bgnj-toast", onProgrammatic);
    window.BGNJ_TOAST = {
      error: (message, opts = {}) => window.dispatchEvent(new CustomEvent("bgnj-toast", { detail: { kind: "error", message, ...opts } })),
      success: (message, opts = {}) => window.dispatchEvent(new CustomEvent("bgnj-toast", { detail: { kind: "success", message, ...opts } })),
      info: (message, opts = {}) => window.dispatchEvent(new CustomEvent("bgnj-toast", { detail: { kind: "info", message, ...opts } }))
    };
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onError);
      window.removeEventListener("bgnj-toast", onProgrammatic);
    };
  }, []);
  const dismiss = (id) => setToasts((prev) => prev.filter((e) => e.id !== id));
  if (!toasts.length) return null;
  const colorOf = (k) => k === "success" ? "#C99E1A" : k === "info" ? "#475569" : "#c24a3d";
  return /* @__PURE__ */ React.createElement("div", { "aria-live": "polite", style: {
    position: "fixed",
    right: 16,
    bottom: 16,
    zIndex: 2e3,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: 420
  } }, toasts.map((e) => {
    const accent = colorOf(e.kind);
    return /* @__PURE__ */ React.createElement("div", { key: e.id, role: e.kind === "success" ? "status" : "alert", style: {
      background: e.kind === "success" ? "rgba(245,213,72,0.08)" : "#fff",
      border: `1px solid ${accent}`,
      boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
      padding: "12px 14px",
      fontSize: 13,
      lineHeight: 1.7,
      color: "#1e293b"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", color: accent } }, e.code), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => dismiss(e.id),
        style: { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 14 },
        "aria-label": "\uB2EB\uAE30"
      },
      "\xD7"
    )), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, marginBottom: e.hint ? 4 : 0 } }, e.message), e.hint && /* @__PURE__ */ React.createElement("div", { style: { color: "#475569", fontSize: 12 } }, e.hint), e.url && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "monospace", fontSize: 10, color: "#94a3b8", marginTop: 6, wordBreak: "break-all" } }, e.url));
  }));
};
const VERSION_POLL_MS = 5 * 60 * 1e3;
const VersionUpdateBanner = () => {
  var _a;
  const [latest, setLatest] = React.useState(null);
  const current = (((_a = window.BGNJ_VERSION) == null ? void 0 : _a.version) || "").toString();
  React.useEffect(() => {
    if (!current) return;
    let cancelled = false;
    const check = async () => {
      try {
        const url = `/version.json?_=${Date.now()}`;
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) return;
        const j = await r.json();
        const v = String((j == null ? void 0 : j.version) || "");
        if (!cancelled && v && v !== current) setLatest(j);
      } catch (e) {
      }
    };
    check();
    const t = setInterval(check, VERSION_POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [current]);
  const reload = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("_v", (latest == null ? void 0 : latest.version) || Date.now().toString());
      window.location.replace(url.toString());
    } catch (e) {
      window.location.reload();
    }
  };
  if (!latest) return null;
  return /* @__PURE__ */ React.createElement("div", { role: "status", "aria-live": "polite", style: {
    position: "fixed",
    top: 12,
    right: 12,
    zIndex: 2100,
    maxWidth: 360,
    background: "#fff",
    border: "1px solid var(--primary-active)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
    padding: "12px 14px",
    fontSize: 13,
    lineHeight: 1.6,
    color: "var(--ink)"
  } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, letterSpacing: "0.18em", color: "var(--primary-active)", marginBottom: 4 } }, "NEW BUILD AVAILABLE"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, marginBottom: 6 } }, "\uC0C8 \uBC84\uC804 v", latest.version, " \uC0AC\uC6A9 \uAC00\uB2A5"), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, marginBottom: 10 } }, "\uD604\uC7AC v", current, " \xB7 \uBE4C\uB4DC ", latest.build || "\u2014"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setLatest(null) }, "\uB098\uC911\uC5D0"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: reload }, "\uC9C0\uAE08 \uC0C8\uB85C\uACE0\uCE68")));
};
const TWEAK_DEFAULTS = (
  /*EDITMODE-BEGIN*/
  {
    "lineStyle": "outline",
    "intensity": 1,
    "heroLayout": "center",
    "interactive": true
  }
);
const VALID_ROUTES = ["home", "community", "lectures", "tour", "column", "book", "checkout", "mypage", "admin", "login", "signup", "faq", "terms", "privacy", "eat", "sleep", "shop", "error"];
const pathToRoute = (pathname) => {
  const p = (pathname || "/").replace(/\/+$/, "") || "/";
  if (p === "/") return "home";
  const seg = p.replace(/^\//, "").split("/")[0];
  return VALID_ROUTES.includes(seg) ? seg : "home";
};
const routeToPath = (r) => r === "home" ? "/" : "/" + r;
const ADMIN_SCRIPTS = [
  "pages/admin/AdminShared.js",
  "pages/admin/AdminContentEditors.js",
  "pages/admin/AdminDesignHub.js",
  "pages/AuthAdminPage.js"
];
let _adminLoadPromise = null;
const _loadAdminScripts = (attempt = 0) => {
  var _a;
  if (_adminLoadPromise) return _adminLoadPromise;
  if (typeof window !== "undefined" && window.AdminPage) {
    _adminLoadPromise = Promise.resolve();
    return _adminLoadPromise;
  }
  const v = (((_a = window.BGNJ_VERSION) == null ? void 0 : _a.version) || "").toString();
  const qs = v ? `?v=${v}` : "";
  _adminLoadPromise = new Promise((resolve, reject) => {
    let remaining = ADMIN_SCRIPTS.length;
    let failed = false;
    ADMIN_SCRIPTS.forEach((src) => {
      const fullSrc = src + qs;
      const existing = document.querySelector(`script[data-bgnj-admin][src="${fullSrc}"]`);
      if (existing) {
        if (existing.dataset.loaded === "1") {
          if (--remaining === 0 && !failed) resolve();
        } else {
          existing.addEventListener("load", () => {
            existing.dataset.loaded = "1";
            if (--remaining === 0 && !failed) resolve();
          });
          existing.addEventListener("error", () => {
            failed = true;
            reject(new Error(`${src} load failed`));
          });
        }
        return;
      }
      const s = document.createElement("script");
      s.src = fullSrc;
      s.async = false;
      s.defer = false;
      s.dataset.bgnjAdmin = "1";
      s.onload = () => {
        s.dataset.loaded = "1";
        if (--remaining === 0 && !failed) resolve();
      };
      s.onerror = () => {
        failed = true;
        reject(new Error(`${src} load failed`));
      };
      document.head.appendChild(s);
    });
  }).catch((err) => {
    _adminLoadPromise = null;
    if (attempt < 1) {
      return new Promise((r) => setTimeout(r, 600)).then(() => _loadAdminScripts(attempt + 1));
    }
    throw err;
  }).then(() => {
    try {
      window.dispatchEvent(new Event("bgnj-admin-scripts-loaded"));
    } catch (e) {
    }
  });
  return _adminLoadPromise;
};
if (typeof window !== "undefined") window.BGNJ_LOAD_ADMIN = _loadAdminScripts;
const _AdminLoadingFallback = ({ error, onRetry, label = "\uAD00\uB9AC\uC790" }) => {
  const code = label === "\uB85C\uADF8\uC778" ? "LOGIN" : label === "\uD68C\uC6D0\uAC00\uC785" ? "SIGNUP" : "ADMIN";
  return /* @__PURE__ */ React.createElement("div", { style: { padding: 48, textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 11, letterSpacing: "0.18em", marginBottom: 10 } }, error ? `${code} \xB7 LOAD FAILED` : `${code} \xB7 LOADING`), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 18, marginBottom: 14, color: "var(--ink)" } }, error ? `${label} \uD398\uC774\uC9C0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4` : `${label} \uD398\uC774\uC9C0\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026`), error ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12, marginBottom: 14 } }, (error == null ? void 0 : error.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onRetry }, "\uB2E4\uC2DC \uC2DC\uB3C4")) : /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12 } }, "\uCC98\uC74C \uC9C4\uC785 \uC2DC ~1\uCD08 \uC18C\uC694\uB429\uB2C8\uB2E4.")));
};
const SITE_BANNER_DISMISSED_KEY = "bgnj_banner_dismissed";
const SiteBanner = () => {
  const [tick, setTick] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(() => {
    try {
      return !!sessionStorage.getItem(SITE_BANNER_DISMISSED_KEY);
    } catch (e) {
      return false;
    }
  });
  React.useEffect(() => {
    const onR = () => setTick((v) => v + 1);
    window.addEventListener("bgnj-site-content-refresh", onR);
    return () => window.removeEventListener("bgnj-site-content-refresh", onR);
  }, []);
  const banner = (() => {
    var _a, _b;
    try {
      return (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).banner || {};
    } catch (e) {
      return {};
    }
  })();
  if (!banner.enabled || dismissed) return null;
  if (!banner.title && !banner.body) return null;
  const tone = banner.tone || "info";
  const palette = {
    info: { bg: "rgba(245,213,72,0.12)", border: "var(--primary-active)", text: "var(--ink)" },
    success: { bg: "rgba(22,163,74,0.10)", border: "var(--success)", text: "var(--ink)" },
    warning: { bg: "rgba(217,119,6,0.10)", border: "var(--warning)", text: "var(--ink)" },
    danger: { bg: "rgba(220,38,38,0.10)", border: "var(--danger)", text: "var(--ink)" }
  }[tone] || { bg: "rgba(245,213,72,0.12)", border: "var(--primary-active)", text: "var(--ink)" };
  const onDismiss = () => {
    try {
      sessionStorage.setItem(SITE_BANNER_DISMISSED_KEY, "1");
    } catch (e) {
    }
    setDismissed(true);
  };
  return /* @__PURE__ */ React.createElement("div", { role: "status", "aria-label": "\uC0AC\uC774\uD2B8 \uACF5\uC9C0", style: {
    background: palette.bg,
    borderBottom: `1px solid ${palette.border}`,
    color: palette.text,
    padding: "10px 16px",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 1.55,
    position: "relative"
  } }, banner.emoji ? `${banner.emoji} ` : "", banner.title && /* @__PURE__ */ React.createElement("strong", null, banner.title), banner.body && /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, banner.title ? " " : "", banner.body), banner.dismissible && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: onDismiss,
      "aria-label": "\uBC30\uB108 \uB2EB\uAE30",
      style: {
        position: "absolute",
        right: 8,
        top: "50%",
        transform: "translateY(-50%)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ink-3)",
        fontSize: 16,
        padding: "4px 8px"
      }
    },
    "\xD7"
  ));
};
const App = () => {
  const [route, setRoute] = React.useState(() => {
    try {
      const fromPath = pathToRoute(window.location.pathname);
      if (fromPath !== "home" || window.location.pathname === "/") return fromPath;
      return localStorage.getItem("bgnj_route") || "home";
    } catch (e) {
      return "home";
    }
  });
  const [postId, setPostId] = React.useState(null);
  const [user, setUser] = React.useState(() => window.BGNJ_AUTH.getSessionUser());
  React.useEffect(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J;
    let cancelled = false;
    (_b = (_a = window.BGNJ_AUTH).refreshSession) == null ? void 0 : _b.call(_a).then((u) => {
      var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2;
      if (!cancelled) setUser(u || null);
      if (u == null ? void 0 : u.id) {
        try {
          (_b2 = (_a2 = window.BGNJ_VISITS) == null ? void 0 : _a2.record) == null ? void 0 : _b2.call(_a2, u.id);
        } catch (e) {
        }
        Promise.allSettled([
          (_d2 = (_c2 = window.BGNJ_LECTURES) == null ? void 0 : _c2.refreshMine) == null ? void 0 : _d2.call(_c2),
          (_f2 = (_e2 = window.BGNJ_TOURS) == null ? void 0 : _e2.refreshMine) == null ? void 0 : _f2.call(_e2),
          (_h2 = (_g2 = window.BGNJ_BOOK_ORDERS) == null ? void 0 : _g2.refreshMine) == null ? void 0 : _h2.call(_g2),
          (_j2 = (_i2 = window.BGNJ_COMMUNITY) == null ? void 0 : _i2.refreshBookmarks) == null ? void 0 : _j2.call(_i2, u.id),
          (_l2 = (_k2 = window.BGNJ_COMMUNITY) == null ? void 0 : _k2.refreshNotifications) == null ? void 0 : _l2.call(_k2, u.id)
        ]).catch(() => {
        });
      }
    });
    Promise.allSettled([
      (_d = (_c = window.BGNJ_SITE_CONTENT) == null ? void 0 : _c.refresh) == null ? void 0 : _d.call(_c),
      (_f = (_e = window.BGNJ_FAQ) == null ? void 0 : _e.refresh) == null ? void 0 : _f.call(_e),
      (_h = (_g = window.BGNJ_LEGAL) == null ? void 0 : _g.refresh) == null ? void 0 : _h.call(_g, "terms"),
      (_j = (_i = window.BGNJ_LEGAL) == null ? void 0 : _i.refresh) == null ? void 0 : _j.call(_i, "privacy"),
      (_l = (_k = window.BGNJ_LECTURES) == null ? void 0 : _k.refresh) == null ? void 0 : _l.call(_k, { includeHidden: true }),
      (_n = (_m = window.BGNJ_TOURS) == null ? void 0 : _m.refresh) == null ? void 0 : _n.call(_m, { includeHidden: true }),
      (_p = (_o = window.BGNJ_BOOKS) == null ? void 0 : _o.refresh) == null ? void 0 : _p.call(_o),
      (_r = (_q = window.BGNJ_BOOK_ORDERS) == null ? void 0 : _q.refreshBankAccount) == null ? void 0 : _r.call(_q),
      (_t = (_s = window.BGNJ_COLUMNS) == null ? void 0 : _s.refresh) == null ? void 0 : _t.call(_s, { admin: true }),
      (_v = (_u = window.BGNJ_COMMUNITY) == null ? void 0 : _u.refreshPosts) == null ? void 0 : _v.call(_u),
      // 등급/카테고리 — D1 에서 서버 정의를 받아 BGNJ_STORES seed 를 덮어씀.
      // 서버에 정의가 비어 있으면 seed 가 그대로 유지(첫 진입자용 폴백).
      (_C = (_B = (_A = (_z = (_y = (_x = (_w = window.BGNJ_API) == null ? void 0 : _w.grades) == null ? void 0 : _x.list) == null ? void 0 : _y.call(_x)) == null ? void 0 : _z.then) == null ? void 0 : _A.call(_z, (r) => {
        if (Array.isArray(r == null ? void 0 : r.grades) && r.grades.length) {
          window.BGNJ_STORES.grades = r.grades.map((g) => {
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
        }
      })) == null ? void 0 : _B.catch) == null ? void 0 : _C.call(_B, () => {
      }),
      (_J = (_I = (_H = (_G = (_F = (_E = (_D = window.BGNJ_API) == null ? void 0 : _D.categories) == null ? void 0 : _E.list) == null ? void 0 : _F.call(_E)) == null ? void 0 : _G.then) == null ? void 0 : _H.call(_G, (r) => {
        if (Array.isArray(r == null ? void 0 : r.categories) && r.categories.length) {
          window.BGNJ_STORES.categories = r.categories.map((c) => {
            var _a2, _b2, _c2;
            return {
              id: c.id,
              label: c.label,
              boardType: c.board_type || "community",
              minLevel: (_a2 = c.min_level) != null ? _a2 : 0,
              postMinLevel: (_b2 = c.post_min_level) != null ? _b2 : 10,
              desc: c.description,
              prefixes: c.prefixes || [],
              order: (_c2 = c.display_order) != null ? _c2 : 0,
              // v00.141 — schema-v8 권한 4종. undefined/null (legacy) → true.
              allowRead: c.allow_read === 0 ? false : true,
              allowWrite: c.allow_write === 0 ? false : true,
              allowCommentRead: c.allow_comment_read === 0 ? false : true,
              allowCommentWrite: c.allow_comment_write === 0 ? false : true
            };
          });
        }
      })) == null ? void 0 : _I.catch) == null ? void 0 : _J.call(_I, () => {
      })
    ]).catch(() => {
    });
    return () => {
      cancelled = true;
    };
  }, []);
  React.useEffect(() => {
    var _a;
    if (!((_a = window.BGNJ_BROADCAST) == null ? void 0 : _a.subscribe)) return;
    const unsub = window.BGNJ_BROADCAST.subscribe(async (msg) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
      const d = msg == null ? void 0 : msg.domain;
      try {
        if (d === "lectures") await ((_b = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.refresh) == null ? void 0 : _b.call(_a2, { includeHidden: false }));
        else if (d === "tours") await ((_d = (_c = window.BGNJ_TOURS) == null ? void 0 : _c.refresh) == null ? void 0 : _d.call(_c, { includeHidden: false }));
        else if (d === "columns") await ((_f = (_e = window.BGNJ_COLUMNS) == null ? void 0 : _e.refresh) == null ? void 0 : _f.call(_e));
        else if (d === "posts") await ((_h = (_g = window.BGNJ_COMMUNITY) == null ? void 0 : _g.refreshPosts) == null ? void 0 : _h.call(_g));
        else if (d === "books") await ((_j = (_i = window.BGNJ_BOOKS) == null ? void 0 : _i.refresh) == null ? void 0 : _j.call(_i));
        else if (d === "site-content") await ((_l = (_k = window.BGNJ_SITE_CONTENT) == null ? void 0 : _k.refresh) == null ? void 0 : _l.call(_k));
        else if (d === "legal") {
          await ((_n = (_m = window.BGNJ_LEGAL) == null ? void 0 : _m.refresh) == null ? void 0 : _n.call(_m, "terms"));
          await ((_p = (_o = window.BGNJ_LEGAL) == null ? void 0 : _o.refresh) == null ? void 0 : _p.call(_o, "privacy"));
          try {
            window.dispatchEvent(new CustomEvent("bgnj-legal-refresh"));
          } catch (e) {
          }
        }
      } catch (e) {
      }
    });
    return unsub;
  }, []);
  const [cart, setCart] = React.useState(() => {
    try {
      const raw = localStorage.getItem("bgnj_cart");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  React.useEffect(() => {
    try {
      if (cart) localStorage.setItem("bgnj_cart", JSON.stringify(cart));
      else localStorage.removeItem("bgnj_cart");
    } catch (e) {
    }
  }, [cart]);
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = React.useState(false);
  const go = (r) => {
    setRoute(r);
    setPostId(null);
    try {
      localStorage.setItem("bgnj_route", r);
    } catch (e) {
    }
    try {
      const target = routeToPath(r);
      if (window.location.pathname !== target) {
        window.history.pushState(null, "", target);
      }
    } catch (e) {
    }
    window.scrollTo(0, 0);
  };
  React.useEffect(() => {
    const onPop = () => {
      const next = pathToRoute(window.location.pathname);
      setRoute(next);
      setPostId(null);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  React.useEffect(() => {
    var _a, _b;
    try {
      (_b = (_a = window.BGNJ_ANALYTICS) == null ? void 0 : _a.track) == null ? void 0 : _b.call(_a, route);
    } catch (e) {
    }
  }, [route]);
  React.useEffect(() => {
    var _a, _b, _c, _d;
    const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
    const brand = ((_c = sc.brand) == null ? void 0 : _c.name) || "\uBC45\uAE30\uB178\uC790";
    const tagline = ((_d = sc.og) == null ? void 0 : _d.title) || "\uBC45\uAE30 \uD0C0\uACE0 \uD55C\uAD6D\uC744 \uB290\uB07C\uB2E4";
    const ROUTE_TITLES = {
      home: tagline,
      eat: "\uBA39\uACE0 \uB180\uC790",
      sleep: "\uC790\uACE0 \uB180\uC790",
      shop: "\uC0AC\uACE0 \uB180\uC790",
      tour: "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8",
      lectures: "\uAC15\uC5F0",
      column: "\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC",
      community: "\uCEE4\uBBA4\uB2C8\uD2F0",
      book: "\uBC45\uAE30\uB178\uC790 \uB3C4\uC11C",
      checkout: "\uACB0\uC81C",
      mypage: "\uB9C8\uC774\uD398\uC774\uC9C0",
      admin: "\uAD00\uB9AC\uC790",
      login: "\uB85C\uADF8\uC778",
      signup: "\uD68C\uC6D0\uAC00\uC785",
      faq: "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38",
      privacy: "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68",
      terms: "\uC774\uC6A9\uC57D\uAD00"
    };
    const seg = ROUTE_TITLES[route] || "";
    const title = route === "home" ? `${brand} \u2014 ${tagline}` : `${seg} \u2014 ${brand}`;
    try {
      document.title = title;
    } catch (e) {
    }
    const onScRefresh = () => {
      var _a2, _b2, _c2, _d2;
      const sc2 = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
      const b2 = ((_c2 = sc2.brand) == null ? void 0 : _c2.name) || "\uBC45\uAE30\uB178\uC790";
      const t2 = ((_d2 = sc2.og) == null ? void 0 : _d2.title) || "\uBC45\uAE30 \uD0C0\uACE0 \uD55C\uAD6D\uC744 \uB290\uB07C\uB2E4";
      const s = ROUTE_TITLES[route] || "";
      const newTitle = route === "home" ? `${b2} \u2014 ${t2}` : `${s} \u2014 ${b2}`;
      try {
        document.title = newTitle;
      } catch (e) {
      }
    };
    window.addEventListener("bgnj-site-content-refresh", onScRefresh);
    return () => window.removeEventListener("bgnj-site-content-refresh", onScRefresh);
  }, [route]);
  const logout = () => {
    window.BGNJ_AUTH.signOut();
    setUser(null);
    setPostId(null);
    setRoute("home");
    try {
      localStorage.setItem("bgnj_route", "home");
    } catch (e) {
    }
    window.scrollTo(0, 0);
  };
  React.useEffect(() => {
    const selfOrigin = window.location.origin;
    const onMsg = (e) => {
      if (e.origin !== selfOrigin) return;
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setEditMode(true);
      if (d.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", onMsg);
    try {
      window.parent.postMessage({ type: "__edit_mode_available" }, selfOrigin);
    } catch (e) {
    }
    return () => window.removeEventListener("message", onMsg);
  }, []);
  React.useEffect(() => {
    const applyHash = () => {
      var _a, _b;
      const h = window.location.hash || "";
      const colMatch = h.match(/^#col-(.+)$/);
      const postMatch = h.match(/^#post-(.+)$/);
      const lectureMatch = h.match(/^#lecture-(.+)$/);
      if (colMatch) {
        const raw = decodeURIComponent(colMatch[1]);
        const isNumeric = /^\d+$/.test(raw);
        const resolved = isNumeric ? ((_b = (_a = window.BGNJ_COLUMNS) == null ? void 0 : _a.idByNumber) == null ? void 0 : _b.call(_a, raw)) || raw : raw;
        try {
          sessionStorage.setItem("bgnj_pending_column_id", resolved);
        } catch (e) {
        }
        setRoute("column");
        try {
          localStorage.setItem("bgnj_route", "column");
        } catch (e) {
        }
      } else if (postMatch) {
        try {
          sessionStorage.setItem("bgnj_pending_post_id", decodeURIComponent(postMatch[1]));
        } catch (e) {
        }
        setRoute("community");
        try {
          localStorage.setItem("bgnj_route", "community");
        } catch (e) {
        }
      } else if (lectureMatch) {
        try {
          sessionStorage.setItem("bgnj_pending_lecture_id", decodeURIComponent(lectureMatch[1]));
        } catch (e) {
        }
        setRoute("lectures");
        try {
          localStorage.setItem("bgnj_route", "lectures");
        } catch (e) {
        }
      } else {
        const tourMatch = h.match(/^#tour-(.+)$/);
        if (tourMatch) {
          try {
            sessionStorage.setItem("bgnj_pending_tour_id", decodeURIComponent(tourMatch[1]));
          } catch (e) {
          }
          setRoute("tour");
          try {
            localStorage.setItem("bgnj_route", "tour");
          } catch (e) {
          }
        }
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);
  const updateTweaks = (next) => {
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: next }, "*");
  };
  const hideNav = route === "login" || route === "signup" || route === "admin";
  const ADMIN_BUNDLE_ROUTES = ["admin", "login", "signup"];
  const [adminLoaded, setAdminLoaded] = React.useState(() => typeof window !== "undefined" && !!window.AdminPage);
  const [adminLoadError, setAdminLoadError] = React.useState(null);
  const [adminLoadAttempt, setAdminLoadAttempt] = React.useState(0);
  React.useEffect(() => {
    if (!ADMIN_BUNDLE_ROUTES.includes(route)) return;
    if (adminLoaded) return;
    let cancelled = false;
    setAdminLoadError(null);
    _loadAdminScripts().then(() => {
      if (!cancelled) setAdminLoaded(true);
    }).catch((err) => {
      try {
        console.error("[adminBundle] load failed", err);
      } catch (e) {
      }
      if (!cancelled) setAdminLoadError(err);
    });
    return () => {
      cancelled = true;
    };
  }, [route, adminLoaded, adminLoadAttempt]);
  const renderPage = () => {
    const W = window;
    const fallback = (label) => () => /* @__PURE__ */ React.createElement("div", { style: { padding: 48, textAlign: "center", color: "#1f2937" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "monospace", fontSize: 11, color: "#dc2626", letterSpacing: "0.18em", marginBottom: 8 } }, "PAGE_NOT_LOADED"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "serif", fontSize: 18, marginBottom: 6 } }, label, " \uD398\uC774\uC9C0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#64748b", marginBottom: 18 } }, "\uC0C8\uB85C\uACE0\uCE68 \uD6C4\uC5D0\uB3C4 \uAC19\uC740 \uD654\uBA74\uC774 \uBCF4\uC778\uB2E4\uBA74 \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      try {
        window.location.reload();
      } catch (e) {
      }
    }, style: { padding: "8px 16px", cursor: "pointer" } }, "\uD398\uC774\uC9C0 \uC0C8\uB85C\uACE0\uCE68"));
    const pick = (name, label) => W[name] || fallback(label);
    switch (route) {
      case "home": {
        const C = pick("HomePage", "\uD648");
        return /* @__PURE__ */ React.createElement(C, { go, tweaks });
      }
      case "eat": {
        const C = pick("EatPage", "\uBA39\uACE0 \uB180\uC790");
        return /* @__PURE__ */ React.createElement(C, { go, user });
      }
      case "sleep": {
        const C = pick("SleepPage", "\uC790\uACE0 \uB180\uC790");
        return /* @__PURE__ */ React.createElement(C, { go, user });
      }
      case "shop": {
        const C = pick("ShopPage", "\uC0AC\uACE0 \uB180\uC790");
        return /* @__PURE__ */ React.createElement(C, { go, user });
      }
      case "community": {
        const C = pick("CommunityPage", "\uCEE4\uBBA4\uB2C8\uD2F0");
        return /* @__PURE__ */ React.createElement(C, { go, postId, setPostId, user });
      }
      case "tour": {
        const C = pick("TourPage", "\uD22C\uC5B4");
        return /* @__PURE__ */ React.createElement(C, { go, user });
      }
      case "lectures": {
        const C = pick("LecturesPage", "\uAC15\uC5F0");
        return /* @__PURE__ */ React.createElement(C, { go, user });
      }
      case "privacy": {
        const C = pick("LegalPage", "\uC57D\uAD00");
        return /* @__PURE__ */ React.createElement(C, { go, slug: "privacy" });
      }
      case "terms": {
        const C = pick("LegalPage", "\uC57D\uAD00");
        return /* @__PURE__ */ React.createElement(C, { go, slug: "terms" });
      }
      case "faq": {
        const C = pick("FaqPage", "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38");
        return /* @__PURE__ */ React.createElement(C, { go });
      }
      case "column": {
        const C = pick("ColumnPage", "\uCE7C\uB7FC");
        return /* @__PURE__ */ React.createElement(C, { go, user });
      }
      case "book": {
        const C = pick("BookPage", "\uCC45");
        return /* @__PURE__ */ React.createElement(C, { go, cart, setCart, user });
      }
      case "checkout": {
        const C = pick("CheckoutPage", "\uACB0\uC81C");
        return /* @__PURE__ */ React.createElement(C, { go, cart, user });
      }
      case "mypage": {
        if (!user) {
          const C2 = pick("Error401Page", "\uB85C\uADF8\uC778 \uD544\uC694");
          return /* @__PURE__ */ React.createElement(C2, { go });
        }
        const C = pick("MyPage", "\uB9C8\uC774\uD398\uC774\uC9C0");
        return /* @__PURE__ */ React.createElement(C, { go, user, cart });
      }
      case "login":
      case "signup": {
        if (!adminLoaded) {
          return /* @__PURE__ */ React.createElement(
            _AdminLoadingFallback,
            {
              label: route === "signup" ? "\uD68C\uC6D0\uAC00\uC785" : "\uB85C\uADF8\uC778",
              error: adminLoadError,
              onRetry: () => {
                setAdminLoadError(null);
                setAdminLoadAttempt((v) => v + 1);
              }
            }
          );
        }
        const C = pick("LoginPage", "\uB85C\uADF8\uC778");
        return /* @__PURE__ */ React.createElement(C, { go, setUser, initialMode: route === "signup" ? "signup" : "login" });
      }
      case "admin": {
        if (!user) {
          const C2 = pick("Error401Page", "\uB85C\uADF8\uC778 \uD544\uC694");
          return /* @__PURE__ */ React.createElement(C2, { go });
        }
        if (!user.isAdmin) {
          const D = pick("AdminDenied", "\uAD00\uB9AC");
          return /* @__PURE__ */ React.createElement(D, { go, user });
        }
        if (!adminLoaded) {
          return /* @__PURE__ */ React.createElement(
            _AdminLoadingFallback,
            {
              error: adminLoadError,
              onRetry: () => {
                setAdminLoadError(null);
                setAdminLoadAttempt((v) => v + 1);
              }
            }
          );
        }
        const C = pick("AdminPage", "\uAD00\uB9AC");
        return /* @__PURE__ */ React.createElement(C, { go, user });
      }
      // v00.229 — 라이브 에러 라우트. /error?code=403|404|401|500|network|maintenance.
      // 미리보기 패널만 있던 ErrorPages 가 사용자에게도 진입 가능. 어드민이 회원에게 링크 공유 시 활용.
      case "error": {
        let code = "404";
        try {
          const sp = new URLSearchParams(window.location.search);
          const c = (sp.get("code") || "").toLowerCase();
          if (c) code = c;
        } catch (e) {
        }
        const map = {
          "401": "Error401Page",
          "403": "Error403Page",
          "404": "Error404Page",
          "500": "Error500Page",
          "network": "ErrorNetworkPage",
          "maintenance": "ErrorMaintenancePage"
        };
        const C = pick(map[code] || "Error404Page", "\uC624\uB958");
        return /* @__PURE__ */ React.createElement(C, { go });
      }
      // v00.145 — 404: 알 수 없는 라우트는 home 으로 폴백하지 않고 Error404Page 노출.
      default: {
        const C = pick("Error404Page", "\uC624\uB958");
        return /* @__PURE__ */ React.createElement(C, { go });
      }
    }
  };
  const page = /* @__PURE__ */ React.createElement(PageErrorBoundary, { key: route, route, go }, renderPage());
  return /* @__PURE__ */ React.createElement("div", { className: "app" }, !hideNav && /* @__PURE__ */ React.createElement(SiteBanner, null), /* @__PURE__ */ React.createElement(Nav, { route, go, user, onLogout: logout }), /* @__PURE__ */ React.createElement("main", { id: "main", tabIndex: "-1", style: { flex: 1, outline: "none" }, "aria-label": `${route} \uD398\uC774\uC9C0 \uBCF8\uBB38` }, page), !hideNav && /* @__PURE__ */ React.createElement(Footer, { go }), /* @__PURE__ */ React.createElement(Tweaks, { tweaks, setTweaks: updateTweaks, visible: editMode }), /* @__PURE__ */ React.createElement(ScrollToTop, null), /* @__PURE__ */ React.createElement(CookieConsent, null), /* @__PURE__ */ React.createElement(GlobalErrorToast, null), /* @__PURE__ */ React.createElement(VersionUpdateBanner, null), window.ConfirmDialogHost ? /* @__PURE__ */ React.createElement(window.ConfirmDialogHost, null) : null);
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(AppErrorBoundary, null, /* @__PURE__ */ React.createElement(App, null)));

})();

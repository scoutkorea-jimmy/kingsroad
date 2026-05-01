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
  const [errors, setErrors] = React.useState([]);
  React.useEffect(() => {
    const push = (entry) => {
      const id = Date.now() + Math.random();
      setErrors((prev) => [...prev, { id, ...entry }].slice(-3));
      reportErrorToServer(entry);
      setTimeout(() => {
        setErrors((prev) => prev.filter((e) => e.id !== id));
      }, TOAST_DISMISS_MS);
    };
    const onRejection = (ev) => {
      const r = ev == null ? void 0 : ev.reason;
      if (!r) return;
      const code = r.code || (r.status ? `HTTP_${r.status}` : r.name || "PROMISE_REJECTION");
      const message = r.message || String(r);
      push({ code, status: r.status || null, message, hint: r.hint || "", url: r.url || "", kind: r.kind || "unknown" });
      try {
        console.error("[GlobalErrorToast]", r);
      } catch (e) {
      }
    };
    const onError = (ev) => {
      var _a;
      const message = (ev == null ? void 0 : ev.message) || ((_a = ev == null ? void 0 : ev.error) == null ? void 0 : _a.message) || "Script error";
      push({ code: "WINDOW_ERROR", status: null, message, hint: "", url: (ev == null ? void 0 : ev.filename) || "", kind: "unknown" });
      try {
        console.error("[GlobalErrorToast]", (ev == null ? void 0 : ev.error) || ev);
      } catch (e) {
      }
    };
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onError);
    };
  }, []);
  const dismiss = (id) => setErrors((prev) => prev.filter((e) => e.id !== id));
  if (!errors.length) return null;
  return /* @__PURE__ */ React.createElement("div", { "aria-live": "polite", style: {
    position: "fixed",
    right: 16,
    bottom: 16,
    zIndex: 2e3,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: 420
  } }, errors.map((e) => /* @__PURE__ */ React.createElement("div", { key: e.id, role: "alert", style: {
    background: "#fff",
    border: "1px solid #c24a3d",
    boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
    padding: "12px 14px",
    fontSize: 13,
    lineHeight: 1.7,
    color: "#1e293b"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", color: "#c24a3d" } }, e.code), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => dismiss(e.id),
      style: { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 14 },
      "aria-label": "\uB2EB\uAE30"
    },
    "\xD7"
  )), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, marginBottom: e.hint ? 4 : 0 } }, e.message), e.hint && /* @__PURE__ */ React.createElement("div", { style: { color: "#475569", fontSize: 12 } }, e.hint), e.url && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "monospace", fontSize: 10, color: "#94a3b8", marginTop: 6, wordBreak: "break-all" } }, e.url))));
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
const VALID_ROUTES = ["home", "community", "lectures", "tour", "column", "book", "checkout", "mypage", "admin", "login", "signup", "faq", "terms", "privacy", "eat", "sleep", "shop"];
const pathToRoute = (pathname) => {
  const p = (pathname || "/").replace(/\/+$/, "") || "/";
  if (p === "/") return "home";
  const seg = p.replace(/^\//, "").split("/")[0];
  return VALID_ROUTES.includes(seg) ? seg : "home";
};
const routeToPath = (r) => r === "home" ? "/" : "/" + r;
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
              order: (_c2 = c.display_order) != null ? _c2 : 0
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
      book: "\uBC45\uAE30\uB178\uC790\uC758 \uAE38",
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
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setEditMode(true);
      if (d.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);
  React.useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash || "";
      const colMatch = h.match(/^#col-(.+)$/);
      const postMatch = h.match(/^#post-(.+)$/);
      const lectureMatch = h.match(/^#lecture-(.+)$/);
      if (colMatch) {
        try {
          sessionStorage.setItem("bgnj_pending_column_id", decodeURIComponent(colMatch[1]));
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
        const C = pick("MyPage", "\uB9C8\uC774\uD398\uC774\uC9C0");
        return /* @__PURE__ */ React.createElement(C, { go, user, cart });
      }
      case "login":
      case "signup": {
        const C = pick("LoginPage", "\uB85C\uADF8\uC778");
        return /* @__PURE__ */ React.createElement(C, { go, setUser });
      }
      case "admin": {
        if (!(user == null ? void 0 : user.isAdmin)) {
          const D = pick("AdminDenied", "\uAD00\uB9AC");
          return /* @__PURE__ */ React.createElement(D, { go, user });
        }
        const C = pick("AdminPage", "\uAD00\uB9AC");
        return /* @__PURE__ */ React.createElement(C, { go, user });
      }
      default: {
        const C = pick("HomePage", "\uD648");
        return /* @__PURE__ */ React.createElement(C, { go, tweaks });
      }
    }
  };
  const page = /* @__PURE__ */ React.createElement(PageErrorBoundary, { key: route, route, go }, renderPage());
  return /* @__PURE__ */ React.createElement("div", { className: "app" }, /* @__PURE__ */ React.createElement(Nav, { route, go, user, onLogout: logout }), /* @__PURE__ */ React.createElement("main", { id: "main", tabIndex: "-1", style: { flex: 1, outline: "none" }, "aria-label": `${route} \uD398\uC774\uC9C0 \uBCF8\uBB38` }, page), !hideNav && /* @__PURE__ */ React.createElement(Footer, { go }), /* @__PURE__ */ React.createElement(Tweaks, { tweaks, setTweaks: updateTweaks, visible: editMode }), /* @__PURE__ */ React.createElement(ScrollToTop, null), /* @__PURE__ */ React.createElement(CookieConsent, null), /* @__PURE__ */ React.createElement(GlobalErrorToast, null));
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(AppErrorBoundary, null, /* @__PURE__ */ React.createElement(App, null)));
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYm9vdC5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdTIwMTQgXHVCRDgwXHVEMkI4XHVDMkE0XHVEMkI4XHVCN0E5IChBcHAgKyBBcHBFcnJvckJvdW5kYXJ5ICsgUmVhY3RET00ucmVuZGVyKVxuLy8gdjAwLjA3MSBcdTIwMTQgaW5kZXguaHRtbCBcdUM3NTggXHVDNzc4XHVCNzdDXHVDNzc4IDxzY3JpcHQgdHlwZT1cInRleHQvYmFiZWxcIj4gXHVCRTE0XHVCODVEXHVDNzQ0IFx1QkQ4NFx1QjlBQy4gZXNidWlsZCBcdUMwQUNcdUM4MDQgXHVDRUY0XHVEMzBDXHVDNzdDLlxuLy8gXHVDODA0XHVDQ0I0IFx1QzU3MSBcdUM1RDBcdUI3RUMgXHVCQzE0XHVDNkI0XHVCMzU0XHVCOUFDIFx1MjAxNCBcdUQ3NzAgXHVENjU0XHVCQTc0IFx1QkMyOVx1QzlDMCArIFx1QzgxNVx1RDY1NVx1RDU1QyBcdUM5QzRcdUIyRTggXHVDODE1XHVCQ0Y0IFx1QjE3OFx1Q0Q5Qy5cbmNsYXNzIEFwcEVycm9yQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsLCBpbmZvOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVyciwgaW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpbmZvIH0pO1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tBcHBFcnJvckJvdW5kYXJ5XScsIGVyciwgaW5mbyk7IH0gY2F0Y2gge31cbiAgICAvLyBcdUI4MENcdUIzNTRcdUI5QzEgXHVDNjI0XHVCOTU4XHVCM0M0IFx1QzExQ1x1QkM4NFx1QzVEMCBcdUFFMzBcdUI4NUQuXG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6IGVycj8uY29kZSB8fCAoZXJyPy5uYW1lIHx8ICdSRU5ERVJfRVJST1InKSxcbiAgICAgICAgc3RhdHVzOiBudWxsLCBraW5kOiAncmVuZGVyJyxcbiAgICAgICAgbWVzc2FnZTogZXJyPy5tZXNzYWdlIHx8IFN0cmluZyhlcnIpLFxuICAgICAgICBoaW50OiAnJywgdXJsOiAnJyxcbiAgICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLCBvcmlnaW46IGxvY2F0aW9uLm9yaWdpbixcbiAgICAgIH0pPy5jYXRjaD8uKCgpID0+IHt9KTtcbiAgICB9IGNhdGNoIHt9XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICBjb25zdCBlID0gdGhpcy5zdGF0ZS5lcnJvcjtcbiAgICAgIGNvbnN0IGNvZGUgPSBlPy5jb2RlIHx8IChlPy5zdGF0dXMgPyBgSFRUUF8ke2Uuc3RhdHVzfWAgOiAoZT8ubmFtZSB8fCAnUkVOREVSX0VSUk9SJykpO1xuICAgICAgY29uc3QgcmVhc29uID0gZT8ubWVzc2FnZSB8fCBTdHJpbmcoZSk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7cGFkZGluZzo0MCwgZm9udEZhbWlseTonbW9ub3NwYWNlJywgY29sb3I6JyMxZjI5MzcnLCBiYWNrZ3JvdW5kOicjZjhmYWZjJywgbWluSGVpZ2h0OicxMDB2aCd9fT5cbiAgICAgICAgICA8aDIgc3R5bGU9e3tjb2xvcjonI2RjMjYyNicsIG1hcmdpbkJvdHRvbToxMn19Plx1MjZBMCBcdUQzOThcdUM3NzRcdUM5QzAgXHVCODBDXHVCMzU0XHVCOUMxIFx1QzYyNFx1Qjk1ODwvaDI+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDonI2ZmZicsIHBhZGRpbmc6JzE0cHggMTZweCcsIGJvcmRlcjonMXB4IHNvbGlkICNmZWNhY2EnLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOjEyLCBmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIGNvbG9yOicjMWYyOTM3JyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tjb2xvcjonI2RjMjYyNicsIGZvbnRTaXplOjExLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBtYXJnaW5Cb3R0b206Nn19PlxuICAgICAgICAgICAgICBDT0RFIFx1MDBCNyB7Y29kZX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRXZWlnaHQ6NjAwLCBtYXJnaW5Cb3R0b206OH19PntyZWFzb259PC9kaXY+XG4gICAgICAgICAgICB7ZT8uc3RhY2sgJiYgKFxuICAgICAgICAgICAgICA8ZGV0YWlscyBzdHlsZT17e21hcmdpblRvcDo4fX0+XG4gICAgICAgICAgICAgICAgPHN1bW1hcnkgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknfX0+XHVDMkE0XHVEMEREIFx1Q0Q5NFx1QzgwMSAoXHVBQzFDXHVCQzFDXHVDNzkwXHVDNkE5KTwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgICA8cHJlIHN0eWxlPXt7d2hpdGVTcGFjZToncHJlLXdyYXAnLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknLCBtYXJnaW5Ub3A6OH19PntlLnN0YWNrfTwvcHJlPlxuICAgICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaW5mbz8uY29tcG9uZW50U3RhY2sgJiYgKFxuICAgICAgICAgICAgICA8ZGV0YWlscyBzdHlsZT17e21hcmdpblRvcDo4fX0+XG4gICAgICAgICAgICAgICAgPHN1bW1hcnkgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknfX0+XHVDRUY0XHVEM0VDXHVCMTBDXHVEMkI4IFx1QzJBNFx1RDBERCAoXHVBQzFDXHVCQzFDXHVDNzkwXHVDNkE5KTwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgICA8cHJlIHN0eWxlPXt7d2hpdGVTcGFjZToncHJlLXdyYXAnLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknLCBtYXJnaW5Ub3A6OH19Pnt0aGlzLnN0YXRlLmluZm8uY29tcG9uZW50U3RhY2t9PC9wcmU+XG4gICAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHtlcnJvcjpudWxsLCBpbmZvOm51bGx9KX0gc3R5bGU9e3twYWRkaW5nOic4cHggMTZweCcsIGN1cnNvcjoncG9pbnRlcid9fT5cdUIyRTRcdUMyREMgXHVDMkRDXHVCM0M0PC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpOyB9IGNhdGNoIHt9IH19IHN0eWxlPXt7cGFkZGluZzonOHB4IDE2cHgnLCBjdXJzb3I6J3BvaW50ZXInfX0+XHVEMzk4XHVDNzc0XHVDOUMwIFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2ODwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxwIHN0eWxlPXt7bWFyZ2luVG9wOjEyLCBmb250U2l6ZToxMSwgY29sb3I6JyM2NDc0OGInfX0+XHUyNEQ4IFx1Q0Q5NFx1QUMwMCBcdUM4MTVcdUJDRjRcdUIyOTQgXHVCRTBDXHVCNzdDXHVDNkIwXHVDODAwIFx1QUMxQ1x1QkMxQ1x1Qzc5MCBcdUIzQzRcdUFENkMoRjEyKSBcdUNGNThcdUMxOTRcdUM1RDBcdUMxMUMgXHVENjU1XHVDNzc4XHVENTYwIFx1QzIxOCBcdUM3ODhcdUMyQjVcdUIyQzhcdUIyRTQuPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59XG5cbi8vIFx1RDM5OFx1Qzc3NFx1QzlDMFx1QkNDNCBcdUM1RDBcdUI3RUMgXHVCQzE0XHVDNkI0XHVCMzU0XHVCOUFDIFx1MjAxNCBcdUQ1NUMgXHVEMzk4XHVDNzc0XHVDOUMwXHVDNUQwXHVDMTFDIFx1QjM1OFx1QzlDNCBcdUM2MjRcdUI5NThcdUFDMDAgXHVDODA0XHVDNUVEIFx1RDJCOFx1QjlBQ1x1Qjk3QyBcdUFFNjhcdUI3MjhcdUI5QUNcdUM5QzAgXHVDNTRBXHVCM0M0XHVCODVEIFx1QUNBOVx1QjlBQy5cbi8vIHJvdXRlIFx1QUMwMCBcdUJDMTRcdUIwMENcdUJBNzQgXHVDNzkwXHVCM0Q5IHJlc2V0IChrZXkgcHJvcCBcdUM3M0NcdUI4NUMgXHVBQzE1XHVDODFDIHJlbW91bnQpLlxuY2xhc3MgUGFnZUVycm9yQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVyciwgaW5mbykge1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tQYWdlRXJyb3JCb3VuZGFyeV0nLCB0aGlzLnByb3BzLnJvdXRlLCBlcnIsIGluZm8pOyB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6IGVycj8uY29kZSB8fCAoZXJyPy5uYW1lIHx8ICdQQUdFX1JFTkRFUl9FUlJPUicpLFxuICAgICAgICBzdGF0dXM6IG51bGwsIGtpbmQ6ICdyZW5kZXInLFxuICAgICAgICBtZXNzYWdlOiBlcnI/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVyciksXG4gICAgICAgIGhpbnQ6IGByb3V0ZT0ke3RoaXMucHJvcHMucm91dGV9YCwgdXJsOiAnJyxcbiAgICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLCBvcmlnaW46IGxvY2F0aW9uLm9yaWdpbixcbiAgICAgIH0pPy5jYXRjaD8uKCgpID0+IHt9KTtcbiAgICB9IGNhdGNoIHt9XG4gIH1cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmIChwcmV2UHJvcHMucm91dGUgIT09IHRoaXMucHJvcHMucm91dGUgJiYgdGhpcy5zdGF0ZS5lcnJvcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiBudWxsIH0pO1xuICAgIH1cbiAgfVxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIGNvbnN0IGUgPSB0aGlzLnN0YXRlLmVycm9yO1xuICAgICAgY29uc3QgY29kZSA9IGU/LmNvZGUgfHwgKGU/LnN0YXR1cyA/IGBIVFRQXyR7ZS5zdGF0dXN9YCA6IChlPy5uYW1lIHx8ICdQQUdFX1JFTkRFUl9FUlJPUicpKTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOjQ4LCBmb250RmFtaWx5OidzYW5zLXNlcmlmJywgbWluSGVpZ2h0Oic2MHZoJywgdGV4dEFsaWduOidjZW50ZXInfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J21vbm9zcGFjZScsIGZvbnRTaXplOjExLCBjb2xvcjonI2RjMjYyNicsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIG1hcmdpbkJvdHRvbTo4fX0+e2NvZGV9PC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjE4LCBjb2xvcjonIzBmMTcyYScsIG1hcmdpbkJvdHRvbTo4LCBmb250V2VpZ2h0OjYwMH19Plx1Qzc3NCBcdUQzOThcdUM3NzRcdUM5QzBcdUI5N0MgXHVCRDg4XHVCN0VDXHVDNjI0XHVCMzU4IFx1QzkxMSBcdUM2MjRcdUI5NThcdUFDMDAgXHVCQzFDXHVDMEREXHVENTg4XHVDMkI1XHVCMkM4XHVCMkU0PC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjEzLCBjb2xvcjonIzQ3NTU2OScsIG1hcmdpbkJvdHRvbToxOCwgbWF4V2lkdGg6NTIwLCBtYXJnaW46JzAgYXV0byAxOHB4JywgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICAgIHtlPy5tZXNzYWdlIHx8ICdcdUM1NEMgXHVDMjE4IFx1QzVDNlx1QjI5NCBcdUM2MjRcdUI5NTgnfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidpbmxpbmUtZmxleCcsIGdhcDo4fX0+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogbnVsbCB9KX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMHB4IDE4cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBib3JkZXI6JzFweCBzb2xpZCAjY2JkNWUxJywgYmFja2dyb3VuZDonI2ZmZid9fT5cdUIyRTRcdUMyREMgXHVDMkRDXHVCM0M0PC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgdGhpcy5wcm9wcy5nbygnaG9tZScpOyB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IG51bGwgfSk7IH0gY2F0Y2gge30gfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMHB4IDE4cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBib3JkZXI6JzFweCBzb2xpZCAjY2JkNWUxJywgYmFja2dyb3VuZDonI2ZmZid9fT5cdUQ2NDhcdUM3M0NcdUI4NUM8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4geyB0cnkgeyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7IH0gY2F0Y2gge30gfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMHB4IDE4cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBib3JkZXI6JzFweCBzb2xpZCAjZjVkNTQ4JywgYmFja2dyb3VuZDonI2Y1ZDU0OCcsIGNvbG9yOicjMGYxNzJhJywgZm9udFdlaWdodDo2MDB9fT5cdUMwQzhcdUI4NUNcdUFDRTBcdUNFNjg8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbjtcbiAgfVxufVxuXG4vLyBcdUM4MDRcdUM1RUQgXHVCQkY4XHVDQzk4XHVCOUFDIFx1QzYyNFx1Qjk1OCBcdUQxQTBcdUMyQTRcdUQyQjggXHUyMDE0IFx1QkU0NFx1QjNEOVx1QUUzMC9Qcm9taXNlIFx1QUM3MFx1QkQ4MFx1QzY0MCBcdUM3OTBcdUM2RDAgXHVCODVDXHVCNERDIFx1QzJFNFx1RDMyOFx1QUU0Q1x1QzlDMCBcdUNFQTFcdUNDOTguXG4vLyBcdUJBQThcdUI0RTAgXHVDNjI0XHVCOTU4XHVCMjk0IFx1QzExQ1x1QkM4NChEMS5lcnJvcl9sb2cpIFx1QzVEMCBcdUM3OTBcdUIzRDkgXHVBRTMwXHVCODVEICsgMTBcdUNEMDggXHVENkM0IFx1Qzc5MFx1QjNEOSBcdUMxOENcdUFDNzAuXG5jb25zdCBUT0FTVF9ESVNNSVNTX01TID0gMTAwMDA7XG4vLyBcdUJCMzRcdUQ1NUMgXHVCOEU4XHVENTA0IFx1QUMwMFx1QjREQyBcdTIwMTQgZXJyb3ItbG9nIFx1QzVENFx1QjREQ1x1RDNFQ1x1Qzc3OFx1RDJCOCBcdUQ2MzhcdUNEOUMgXHVDNzkwXHVDQ0I0XHVBQzAwIFx1QzJFNFx1RDMyOFx1RDU2MCBcdUI1NEMgXHVCNjEwIFx1RDFBMFx1QzJBNFx1RDJCOFx1MjE5MnJlcG9ydFx1MjE5MmZhaWwgXHVBQzAwIFx1QkMxOFx1QkNGNVx1QjQxOFx1QjI5NCBcdUFDODNcdUM3NDQgXHVDQzI4XHVCMkU4LlxubGV0IF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTtcbmNvbnN0IHJlcG9ydEVycm9yVG9TZXJ2ZXIgPSAoZW50cnkpID0+IHtcbiAgaWYgKF9fcmVwb3J0aW5nRXJyb3IpIHJldHVybjtcbiAgLy8gZXJyb3ItbG9nIFx1QzVENFx1QjREQ1x1RDNFQ1x1Qzc3OFx1RDJCOCBcdUQ2MzhcdUNEOUMgXHVDNzkwXHVDQ0I0XHVDNUQwXHVDMTFDIFx1QkMxQ1x1QzBERFx1RDU1QyBcdUM2MjRcdUI5NThcdUIyOTQgXHVCQ0Y0XHVBQ0UwIFx1QjMwMFx1QzBDMVx1QzVEMFx1QzExQyBcdUM4MUNcdUM2NzguXG4gIGlmICh0eXBlb2YgZW50cnkudXJsID09PSAnc3RyaW5nJyAmJiBlbnRyeS51cmwuaW5jbHVkZXMoJy9hcGkvZXJyb3ItbG9nJykpIHJldHVybjtcbiAgX19yZXBvcnRpbmdFcnJvciA9IHRydWU7XG4gIHRyeSB7XG4gICAgY29uc3QgcCA9IHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICBjb2RlOiBlbnRyeS5jb2RlLCBzdGF0dXM6IGVudHJ5LnN0YXR1cywga2luZDogZW50cnkua2luZCxcbiAgICAgIG1lc3NhZ2U6IGVudHJ5Lm1lc3NhZ2UsIGhpbnQ6IGVudHJ5LmhpbnQsIHVybDogZW50cnkudXJsLFxuICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLCBvcmlnaW46IGxvY2F0aW9uLm9yaWdpbixcbiAgICB9KTtcbiAgICBpZiAocCAmJiB0eXBlb2YgcC5jYXRjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcC5jYXRjaCgoKSA9PiB7fSkuZmluYWxseSgoKSA9PiB7IF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTtcbiAgICB9XG4gIH0gY2F0Y2gge1xuICAgIF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTtcbiAgfVxufTtcbmNvbnN0IEdsb2JhbEVycm9yVG9hc3QgPSAoKSA9PiB7XG4gIGNvbnN0IFtlcnJvcnMsIHNldEVycm9yc10gPSBSZWFjdC51c2VTdGF0ZShbXSk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcHVzaCA9IChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgaWQgPSBEYXRlLm5vdygpICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIHNldEVycm9ycygocHJldikgPT4gWy4uLnByZXYsIHsgaWQsIC4uLmVudHJ5IH1dLnNsaWNlKC0zKSk7XG4gICAgICByZXBvcnRFcnJvclRvU2VydmVyKGVudHJ5KTtcbiAgICAgIC8vIDEwXHVDRDA4IFx1RDZDNCBcdUM3OTBcdUIzRDkgXHVDMThDXHVBQzcwLlxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHNldEVycm9ycygocHJldikgPT4gcHJldi5maWx0ZXIoKGUpID0+IGUuaWQgIT09IGlkKSk7XG4gICAgICB9LCBUT0FTVF9ESVNNSVNTX01TKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVqZWN0aW9uID0gKGV2KSA9PiB7XG4gICAgICBjb25zdCByID0gZXY/LnJlYXNvbjtcbiAgICAgIGlmICghcikgcmV0dXJuO1xuICAgICAgY29uc3QgY29kZSA9IHIuY29kZSB8fCAoci5zdGF0dXMgPyBgSFRUUF8ke3Iuc3RhdHVzfWAgOiAoci5uYW1lIHx8ICdQUk9NSVNFX1JFSkVDVElPTicpKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSByLm1lc3NhZ2UgfHwgU3RyaW5nKHIpO1xuICAgICAgcHVzaCh7IGNvZGUsIHN0YXR1czogci5zdGF0dXMgfHwgbnVsbCwgbWVzc2FnZSwgaGludDogci5oaW50IHx8ICcnLCB1cmw6IHIudXJsIHx8ICcnLCBraW5kOiByLmtpbmQgfHwgJ3Vua25vd24nIH0pO1xuICAgICAgdHJ5IHsgY29uc29sZS5lcnJvcignW0dsb2JhbEVycm9yVG9hc3RdJywgcik7IH0gY2F0Y2gge31cbiAgICB9O1xuICAgIGNvbnN0IG9uRXJyb3IgPSAoZXYpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBldj8ubWVzc2FnZSB8fCBldj8uZXJyb3I/Lm1lc3NhZ2UgfHwgJ1NjcmlwdCBlcnJvcic7XG4gICAgICBwdXNoKHsgY29kZTogJ1dJTkRPV19FUlJPUicsIHN0YXR1czogbnVsbCwgbWVzc2FnZSwgaGludDogJycsIHVybDogZXY/LmZpbGVuYW1lIHx8ICcnLCBraW5kOiAndW5rbm93bicgfSk7XG4gICAgICB0cnkgeyBjb25zb2xlLmVycm9yKCdbR2xvYmFsRXJyb3JUb2FzdF0nLCBldj8uZXJyb3IgfHwgZXYpOyB9IGNhdGNoIHt9XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgb25SZWplY3Rpb24pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgb25SZWplY3Rpb24pO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgfTtcbiAgfSwgW10pO1xuICBjb25zdCBkaXNtaXNzID0gKGlkKSA9PiBzZXRFcnJvcnMoKHByZXYpID0+IHByZXYuZmlsdGVyKChlKSA9PiBlLmlkICE9PSBpZCkpO1xuICBpZiAoIWVycm9ycy5sZW5ndGgpIHJldHVybiBudWxsO1xuICByZXR1cm4gKFxuICAgIDxkaXYgYXJpYS1saXZlPVwicG9saXRlXCIgc3R5bGU9e3tcbiAgICAgIHBvc2l0aW9uOidmaXhlZCcsIHJpZ2h0OjE2LCBib3R0b206MTYsIHpJbmRleDoyMDAwLFxuICAgICAgZGlzcGxheTonZmxleCcsIGZsZXhEaXJlY3Rpb246J2NvbHVtbicsIGdhcDo4LCBtYXhXaWR0aDo0MjAsXG4gICAgfX0+XG4gICAgICB7ZXJyb3JzLm1hcCgoZSkgPT4gKFxuICAgICAgICA8ZGl2IGtleT17ZS5pZH0gcm9sZT1cImFsZXJ0XCIgc3R5bGU9e3tcbiAgICAgICAgICBiYWNrZ3JvdW5kOicjZmZmJywgYm9yZGVyOicxcHggc29saWQgI2MyNGEzZCcsIGJveFNoYWRvdzonMCA4cHggMjRweCByZ2JhKDAsMCwwLDAuMTQpJyxcbiAgICAgICAgICBwYWRkaW5nOicxMnB4IDE0cHgnLCBmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIGNvbG9yOicjMWUyOTNiJyxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDoxMiwgbWFyZ2luQm90dG9tOjR9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7Zm9udEZhbWlseTonbW9ub3NwYWNlJywgZm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMTRlbScsIGNvbG9yOicjYzI0YTNkJ319PlxuICAgICAgICAgICAgICB7ZS5jb2RlfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZGlzbWlzcyhlLmlkKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidub25lJywgYm9yZGVyOidub25lJywgY3Vyc29yOidwb2ludGVyJywgY29sb3I6JyM5NGEzYjgnLCBmb250U2l6ZToxNH19XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJcdUIyRUJcdUFFMzBcIj5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFdlaWdodDo2MDAsIG1hcmdpbkJvdHRvbTplLmhpbnQgPyA0IDogMH19PntlLm1lc3NhZ2V9PC9kaXY+XG4gICAgICAgICAge2UuaGludCAmJiA8ZGl2IHN0eWxlPXt7Y29sb3I6JyM0NzU1NjknLCBmb250U2l6ZToxMn19PntlLmhpbnR9PC9kaXY+fVxuICAgICAgICAgIHtlLnVybCAmJiA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTonbW9ub3NwYWNlJywgZm9udFNpemU6MTAsIGNvbG9yOicjOTRhM2I4JywgbWFyZ2luVG9wOjYsIHdvcmRCcmVhazonYnJlYWstYWxsJ319PntlLnVybH08L2Rpdj59XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBUV0VBS19ERUZBVUxUUyA9IC8qRURJVE1PREUtQkVHSU4qL3tcbiAgXCJsaW5lU3R5bGVcIjogXCJvdXRsaW5lXCIsXG4gIFwiaW50ZW5zaXR5XCI6IDEsXG4gIFwiaGVyb0xheW91dFwiOiBcImNlbnRlclwiLFxuICBcImludGVyYWN0aXZlXCI6IHRydWVcbn0vKkVESVRNT0RFLUVORCovO1xuXG4vLyBVUkwgXHVBQ0JEXHVCODVDIFx1MjE5NCBcdUI3N0NcdUM2QjBcdUQyQjggXHVEMEE0IFx1QjlFNFx1RDU1MS5cbi8vIFx1QzU0Q1x1QjgyNFx1QzlDNCBcdUI3N0NcdUM2QjBcdUQyQjhcdUI5Q0MgXHVENjU0XHVDNzc0XHVEMkI4XHVCOUFDXHVDMkE0XHVEMkI4XHVCODVDIFx1QkMxQlx1QzU0NCBcdUM1NDhcdUM4MDRcdUQ1NThcdUFDOEMgXHVEM0Y0XHVCQzMxXHVENTVDXHVCMkU0KGhvbWUpLlxuY29uc3QgVkFMSURfUk9VVEVTID0gWydob21lJywnY29tbXVuaXR5JywnbGVjdHVyZXMnLCd0b3VyJywnY29sdW1uJywnYm9vaycsJ2NoZWNrb3V0JywnbXlwYWdlJywnYWRtaW4nLCdsb2dpbicsJ3NpZ251cCcsJ2ZhcScsJ3Rlcm1zJywncHJpdmFjeScsJ2VhdCcsJ3NsZWVwJywnc2hvcCddO1xuY29uc3QgcGF0aFRvUm91dGUgPSAocGF0aG5hbWUpID0+IHtcbiAgY29uc3QgcCA9IChwYXRobmFtZSB8fCAnLycpLnJlcGxhY2UoL1xcLyskLywgJycpIHx8ICcvJztcbiAgaWYgKHAgPT09ICcvJykgcmV0dXJuICdob21lJztcbiAgY29uc3Qgc2VnID0gcC5yZXBsYWNlKC9eXFwvLywgJycpLnNwbGl0KCcvJylbMF07XG4gIHJldHVybiBWQUxJRF9ST1VURVMuaW5jbHVkZXMoc2VnKSA/IHNlZyA6ICdob21lJztcbn07XG5jb25zdCByb3V0ZVRvUGF0aCA9IChyKSA9PiByID09PSAnaG9tZScgPyAnLycgOiAnLycgKyByO1xuXG5jb25zdCBBcHAgPSAoKSA9PiB7XG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgIC8vIFVSTCBcdUM2QjBcdUMxMjAuIFx1RDNGNFx1QkMzMVx1QzczQ1x1Qjg1QyBsb2NhbFN0b3JhZ2UuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZyb21QYXRoID0gcGF0aFRvUm91dGUod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgIGlmIChmcm9tUGF0aCAhPT0gJ2hvbWUnIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gJy8nKSByZXR1cm4gZnJvbVBhdGg7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jnbmpfcm91dGUnKSB8fCAnaG9tZSc7XG4gICAgfSBjYXRjaCB7IHJldHVybiAnaG9tZSc7IH1cbiAgfSk7XG4gIGNvbnN0IFtwb3N0SWQsIHNldFBvc3RJZF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4gd2luZG93LkJHTkpfQVVUSC5nZXRTZXNzaW9uVXNlcigpKTtcbiAgLy8gXHVDMTFDXHVCQzg0IFx1QzEzOFx1QzE1OFx1Qzc0NCAxXHVENjhDIFx1QUM4MFx1Qzk5RCBcdTIwMTQgXHVDRTkwXHVDMkRDXHVBQzAwIFx1QzJFMFx1QzEyMFx1RDU1OFx1QzlDMCBcdUM1NEFcdUM3NDQgXHVDMjE4IFx1Qzc4OFx1QzczQ1x1QkJDMFx1Qjg1QyBcdUM5QzRcdUM3ODUgXHVDMkRDIC9hcGkvYXV0aC9tZVx1Qjg1QyBcdUFDMzFcdUMyRTAuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIHdpbmRvdy5CR05KX0FVVEgucmVmcmVzaFNlc3Npb24/LigpLnRoZW4oKHUpID0+IHtcbiAgICAgIGlmICghY2FuY2VsbGVkKSBzZXRVc2VyKHUgfHwgbnVsbCk7XG4gICAgICBpZiAodT8uaWQpIHtcbiAgICAgICAgLy8gXHVCQzI5XHVCQjM4IFx1QUUzMFx1Qjg1RCBcdTIwMTQgXHVDNzkwXHVCM0Q5IFx1QzJCOVx1QUUwOSBcdUQzQzlcdUFDMDBcdUM3NTggdmlzaXRzTGFzdDMwRGF5cyBcdUNFMjFcdUM4MTVcdUM1RDAgXHVDMEFDXHVDNkE5LiBcdUFDMTlcdUM3NDAgXHVCMEEwIFx1Q0NBQiBcdUM5QzRcdUM3ODVcdUI5Q0MgXHVDRTc0XHVDNkI0XHVEMkI4LlxuICAgICAgICB0cnkgeyB3aW5kb3cuQkdOSl9WSVNJVFM/LnJlY29yZD8uKHUuaWQpOyB9IGNhdGNoIHt9XG4gICAgICAgIC8vIFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUMwQUNcdUM2QTlcdUM3OTBcdUI3N0NcdUJBNzQgXHVCQ0Y4XHVDNzc4IFx1RDY1Q1x1QjNEOSBcdUIzNzBcdUM3NzRcdUQxMzAgXHVDNzdDXHVBRDA0IFx1QjNEOVx1QUUzMFx1RDY1NC5cbiAgICAgICAgUHJvbWlzZS5hbGxTZXR0bGVkKFtcbiAgICAgICAgICB3aW5kb3cuQkdOSl9MRUNUVVJFUz8ucmVmcmVzaE1pbmU/LigpLFxuICAgICAgICAgIHdpbmRvdy5CR05KX1RPVVJTPy5yZWZyZXNoTWluZT8uKCksXG4gICAgICAgICAgd2luZG93LkJHTkpfQk9PS19PUkRFUlM/LnJlZnJlc2hNaW5lPy4oKSxcbiAgICAgICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hCb29rbWFya3M/Lih1LmlkKSxcbiAgICAgICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hOb3RpZmljYXRpb25zPy4odS5pZCksXG4gICAgICAgIF0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBcdUMxMUNcdUJDODQgc291cmNlIG9mIHRydXRoIFx1Qzc3OCBcdUM2QjRcdUM2MDEgXHVCMzcwXHVDNzc0XHVEMTMwXHVCNEU0XHVDNzQ0IFx1QzlDNFx1Qzc4NSBcdUMyREMgXHVDNzdDXHVBRDA0IFx1QjNEOVx1QUUzMFx1RDY1NC5cbiAgICAvLyBcdUFDMUNcdUJDQzQgXHVENUVDXHVEMzdDXHVCMjk0IFx1Qzc5MFx1Q0NCNCBcdUNFOTBcdUMyRENcdUI5N0MgXHVBQzMxXHVDMkUwXHVENTU4XHVBQ0UwICdiZ25qLSotcmVmcmVzaCcgXHVDNzc0XHVCQ0E0XHVEMkI4XHVCOTdDIFx1QkMxQ1x1RDY1NFx1RDU1Q1x1QjJFNC5cbiAgICBQcm9taXNlLmFsbFNldHRsZWQoW1xuICAgICAgd2luZG93LkJHTkpfU0lURV9DT05URU5UPy5yZWZyZXNoPy4oKSxcbiAgICAgIHdpbmRvdy5CR05KX0ZBUT8ucmVmcmVzaD8uKCksXG4gICAgICB3aW5kb3cuQkdOSl9MRUdBTD8ucmVmcmVzaD8uKCd0ZXJtcycpLFxuICAgICAgd2luZG93LkJHTkpfTEVHQUw/LnJlZnJlc2g/LigncHJpdmFjeScpLFxuICAgICAgd2luZG93LkJHTkpfTEVDVFVSRVM/LnJlZnJlc2g/Lih7IGluY2x1ZGVIaWRkZW46IHRydWUgfSksXG4gICAgICB3aW5kb3cuQkdOSl9UT1VSUz8ucmVmcmVzaD8uKHsgaW5jbHVkZUhpZGRlbjogdHJ1ZSB9KSxcbiAgICAgIHdpbmRvdy5CR05KX0JPT0tTPy5yZWZyZXNoPy4oKSxcbiAgICAgIHdpbmRvdy5CR05KX0JPT0tfT1JERVJTPy5yZWZyZXNoQmFua0FjY291bnQ/LigpLFxuICAgICAgd2luZG93LkJHTkpfQ09MVU1OUz8ucmVmcmVzaD8uKHsgYWRtaW46IHRydWUgfSksXG4gICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hQb3N0cz8uKCksXG4gICAgICAvLyBcdUI0RjFcdUFFMDkvXHVDRTc0XHVEMTRDXHVBQ0UwXHVCOUFDIFx1MjAxNCBEMSBcdUM1RDBcdUMxMUMgXHVDMTFDXHVCQzg0IFx1QzgxNVx1Qzc1OFx1Qjk3QyBcdUJDMUJcdUM1NDQgQkdOSl9TVE9SRVMgc2VlZCBcdUI5N0MgXHVCMzZFXHVDNUI0XHVDNTAwLlxuICAgICAgLy8gXHVDMTFDXHVCQzg0XHVDNUQwIFx1QzgxNVx1Qzc1OFx1QUMwMCBcdUJFNDRcdUM1QjQgXHVDNzg4XHVDNzNDXHVCQTc0IHNlZWQgXHVBQzAwIFx1QURGOFx1QjMwMFx1Qjg1QyBcdUM3MjBcdUM5QzAoXHVDQ0FCIFx1QzlDNFx1Qzc4NVx1Qzc5MFx1QzZBOSBcdUQzRjRcdUJDMzEpLlxuICAgICAgd2luZG93LkJHTkpfQVBJPy5ncmFkZXM/Lmxpc3Q/LigpPy50aGVuPy4oKHIpID0+IHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocj8uZ3JhZGVzKSAmJiByLmdyYWRlcy5sZW5ndGgpIHtcbiAgICAgICAgICB3aW5kb3cuQkdOSl9TVE9SRVMuZ3JhZGVzID0gci5ncmFkZXMubWFwKChnKSA9PiAoe1xuICAgICAgICAgICAgaWQ6IGcuaWQsIGxhYmVsOiBnLmxhYmVsLCBsZXZlbDogZy5sZXZlbCxcbiAgICAgICAgICAgIGNvbG9yOiBnLmNvbG9yLCBkZXNjOiBnLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgb3JkZXI6IGcuZGlzcGxheV9vcmRlciA/PyAwLFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk/LmNhdGNoPy4oKCkgPT4ge30pLFxuICAgICAgd2luZG93LkJHTkpfQVBJPy5jYXRlZ29yaWVzPy5saXN0Py4oKT8udGhlbj8uKChyKSA9PiB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHI/LmNhdGVnb3JpZXMpICYmIHIuY2F0ZWdvcmllcy5sZW5ndGgpIHtcbiAgICAgICAgICB3aW5kb3cuQkdOSl9TVE9SRVMuY2F0ZWdvcmllcyA9IHIuY2F0ZWdvcmllcy5tYXAoKGMpID0+ICh7XG4gICAgICAgICAgICBpZDogYy5pZCwgbGFiZWw6IGMubGFiZWwsXG4gICAgICAgICAgICBib2FyZFR5cGU6IGMuYm9hcmRfdHlwZSB8fCAnY29tbXVuaXR5JyxcbiAgICAgICAgICAgIG1pbkxldmVsOiBjLm1pbl9sZXZlbCA/PyAwLFxuICAgICAgICAgICAgcG9zdE1pbkxldmVsOiBjLnBvc3RfbWluX2xldmVsID8/IDEwLFxuICAgICAgICAgICAgZGVzYzogYy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHByZWZpeGVzOiBjLnByZWZpeGVzIHx8IFtdLFxuICAgICAgICAgICAgb3JkZXI6IGMuZGlzcGxheV9vcmRlciA/PyAwLFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk/LmNhdGNoPy4oKCkgPT4ge30pLFxuICAgIF0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICB9LCBbXSk7XG4gIGNvbnN0IFtjYXJ0LCBzZXRDYXJ0XSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2JnbmpfY2FydCcpO1xuICAgICAgcmV0dXJuIHJhdyA/IEpTT04ucGFyc2UocmF3KSA6IG51bGw7XG4gICAgfSBjYXRjaCB7IHJldHVybiBudWxsOyB9XG4gIH0pO1xuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY2FydCkgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2JnbmpfY2FydCcsIEpTT04uc3RyaW5naWZ5KGNhcnQpKTtcbiAgICAgIGVsc2UgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2JnbmpfY2FydCcpO1xuICAgIH0gY2F0Y2gge31cbiAgfSwgW2NhcnRdKTtcbiAgY29uc3QgW3R3ZWFrcywgc2V0VHdlYWtzXSA9IFJlYWN0LnVzZVN0YXRlKFRXRUFLX0RFRkFVTFRTKTtcbiAgY29uc3QgW2VkaXRNb2RlLCBzZXRFZGl0TW9kZV0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgZ28gPSAocikgPT4ge1xuICAgIHNldFJvdXRlKHIpO1xuICAgIHNldFBvc3RJZChudWxsKTtcbiAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYmdual9yb3V0ZScsIHIpOyB9IGNhdGNoIHt9XG4gICAgLy8gXHVCRTBDXHVCNzdDXHVDNkIwXHVDODAwIFx1QzhGQ1x1QzE4Q1x1Qjk3QyBcdUIzRDlcdUFFMzBcdUQ2NTQgXHUyMDE0IFx1QUMxOVx1Qzc0MCBcdUFDQkRcdUI4NUNcdUJBNzQgcHVzaCBcdUMwRERcdUI3QjUoXHVCRDg4XHVENTQ0XHVDNjk0XHVENTVDIFx1QzJBNFx1RDBERCBcdUIyMDRcdUM4MDEgXHVCQzI5XHVDOUMwKS5cbiAgICB0cnkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gcm91dGVUb1BhdGgocik7XG4gICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICE9PSB0YXJnZXQpIHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKG51bGwsICcnLCB0YXJnZXQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2gge31cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gIH07XG5cbiAgLy8gXHVCNEE0XHVCODVDL1x1QzU1RVx1QzczQ1x1Qjg1QyBcdUJDODRcdUQyQkMgXHVCM0Q5XHVBRTMwXHVENjU0IFx1MjAxNCBwb3BzdGF0ZSBcdUMyREMgVVJMXHVDNzQ0IFx1QjJFNFx1QzJEQyBcdUI3N0NcdUM2QjBcdUQyQjhcdUI4NUMgXHVCQ0MwXHVENjU4LlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uUG9wID0gKCkgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IHBhdGhUb1JvdXRlKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7XG4gICAgICBzZXRSb3V0ZShuZXh0KTtcbiAgICAgIHNldFBvc3RJZChudWxsKTtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIG9uUG9wKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25Qb3ApO1xuICB9LCBbXSk7XG5cbiAgLy8gXHVCNzdDXHVDNkIwXHVEMkI4XHVCQ0M0IGRvY3VtZW50LnRpdGxlIFx1MjAxNCBcdUJEODFcdUI5QzhcdUQwNkMgLyBcdUFDRjVcdUM3MjAgLyBcdUQwRUQgXHVCNzdDXHVCQ0E4IFx1Qzc1OFx1QkJGOFx1RDY1NC5cbiAgLy8gXHVDMEFDXHVDNzc0XHVEMkI4IFx1Q0Y1OFx1RDE1MFx1Q0UyMChcdUJFMENcdUI3OUNcdUI0RENcdUJBODUvT0cpXHVCM0M0IFx1QkNDMFx1QUNCRCBcdUMyREMgXHVBQzE5XHVDNzc0IFx1QUMzMVx1QzJFMC5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzYyA9IHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fTtcbiAgICBjb25zdCBicmFuZCA9IHNjLmJyYW5kPy5uYW1lIHx8ICdcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAnO1xuICAgIGNvbnN0IHRhZ2xpbmUgPSBzYy5vZz8udGl0bGUgfHwgJ1x1QkM0NVx1QUUzMCBcdUQwQzBcdUFDRTAgXHVENTVDXHVBRDZEXHVDNzQ0IFx1QjI5MFx1QjA3Q1x1QjJFNCc7XG4gICAgY29uc3QgUk9VVEVfVElUTEVTID0ge1xuICAgICAgaG9tZTogdGFnbGluZSxcbiAgICAgIGVhdDogJ1x1QkEzOVx1QUNFMCBcdUIxODBcdUM3OTAnLFxuICAgICAgc2xlZXA6ICdcdUM3OTBcdUFDRTAgXHVCMTgwXHVDNzkwJyxcbiAgICAgIHNob3A6ICdcdUMwQUNcdUFDRTAgXHVCMTgwXHVDNzkwJyxcbiAgICAgIHRvdXI6ICdcdUQyMkNcdUM1QjQgXHVENTA0XHVCODVDXHVBREY4XHVCN0E4JyxcbiAgICAgIGxlY3R1cmVzOiAnXHVBQzE1XHVDNUYwJyxcbiAgICAgIGNvbHVtbjogJ1x1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNFN0NcdUI3RkMnLFxuICAgICAgY29tbXVuaXR5OiAnXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwJyxcbiAgICAgIGJvb2s6ICdcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUM3NTggXHVBRTM4JyxcbiAgICAgIGNoZWNrb3V0OiAnXHVBQ0IwXHVDODFDJyxcbiAgICAgIG15cGFnZTogJ1x1QjlDOFx1Qzc3NFx1RDM5OFx1Qzc3NFx1QzlDMCcsXG4gICAgICBhZG1pbjogJ1x1QUQwMFx1QjlBQ1x1Qzc5MCcsXG4gICAgICBsb2dpbjogJ1x1Qjg1Q1x1QURGOFx1Qzc3OCcsXG4gICAgICBzaWdudXA6ICdcdUQ2OENcdUM2RDBcdUFDMDBcdUM3ODUnLFxuICAgICAgZmFxOiAnXHVDNzkwXHVDOEZDIFx1QkIzQlx1QjI5NCBcdUM5QzhcdUJCMzgnLFxuICAgICAgcHJpdmFjeTogJ1x1QUMxQ1x1Qzc3OFx1QzgxNVx1QkNGNCBcdUNDOThcdUI5QUNcdUJDMjlcdUNFNjgnLFxuICAgICAgdGVybXM6ICdcdUM3NzRcdUM2QTlcdUM1N0RcdUFEMDAnLFxuICAgIH07XG4gICAgY29uc3Qgc2VnID0gUk9VVEVfVElUTEVTW3JvdXRlXSB8fCAnJztcbiAgICBjb25zdCB0aXRsZSA9IHJvdXRlID09PSAnaG9tZScgPyBgJHticmFuZH0gXHUyMDE0ICR7dGFnbGluZX1gIDogYCR7c2VnfSBcdTIwMTQgJHticmFuZH1gO1xuICAgIHRyeSB7IGRvY3VtZW50LnRpdGxlID0gdGl0bGU7IH0gY2F0Y2gge31cbiAgICAvLyByb3V0ZSBcdUJDQzBcdUFDQkQgXHVDMkRDIFx1QzBBQ1x1Qzc3NFx1RDJCOCBcdUNGNThcdUQxNTBcdUNFMjAgcmVmcmVzaCBcdUM3NzRcdUJDQTRcdUQyQjhcdUIzQzQgbGlzdGVuIFx1MjAxNCBcdUJFMENcdUI3OUNcdUI0RENcdUJBODUvXHVEMERDXHVBREY4XHVCNzdDXHVDNzc4IFx1QkMxNFx1QjAwQ1x1QkE3NCBcdUM5ODlcdUMyREMgXHVCQzE4XHVDNjAxLlxuICAgIGNvbnN0IG9uU2NSZWZyZXNoID0gKCkgPT4ge1xuICAgICAgY29uc3Qgc2MyID0gd2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9O1xuICAgICAgY29uc3QgYjIgPSBzYzIuYnJhbmQ/Lm5hbWUgfHwgJ1x1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCc7XG4gICAgICBjb25zdCB0MiA9IHNjMi5vZz8udGl0bGUgfHwgJ1x1QkM0NVx1QUUzMCBcdUQwQzBcdUFDRTAgXHVENTVDXHVBRDZEXHVDNzQ0IFx1QjI5MFx1QjA3Q1x1QjJFNCc7XG4gICAgICBjb25zdCBzID0gUk9VVEVfVElUTEVTW3JvdXRlXSB8fCAnJztcbiAgICAgIGNvbnN0IG5ld1RpdGxlID0gcm91dGUgPT09ICdob21lJyA/IGAke2IyfSBcdTIwMTQgJHt0Mn1gIDogYCR7c30gXHUyMDE0ICR7YjJ9YDtcbiAgICAgIHRyeSB7IGRvY3VtZW50LnRpdGxlID0gbmV3VGl0bGU7IH0gY2F0Y2gge31cbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZ25qLXNpdGUtY29udGVudC1yZWZyZXNoJywgb25TY1JlZnJlc2gpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmduai1zaXRlLWNvbnRlbnQtcmVmcmVzaCcsIG9uU2NSZWZyZXNoKTtcbiAgfSwgW3JvdXRlXSk7XG5cbiAgY29uc3QgbG9nb3V0ID0gKCkgPT4ge1xuICAgIHdpbmRvdy5CR05KX0FVVEguc2lnbk91dCgpO1xuICAgIHNldFVzZXIobnVsbCk7XG4gICAgc2V0UG9zdElkKG51bGwpO1xuICAgIHNldFJvdXRlKFwiaG9tZVwiKTtcbiAgICB0cnkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jnbmpfcm91dGUnLCAnaG9tZScpO1xuICAgIH0gY2F0Y2gge31cbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gIH07XG5cbiAgLy8gRWRpdC1tb2RlIHByb3RvY29sXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Nc2cgPSAoZSkgPT4ge1xuICAgICAgY29uc3QgZCA9IGUuZGF0YSB8fCB7fTtcbiAgICAgIGlmIChkLnR5cGUgPT09ICdfX2FjdGl2YXRlX2VkaXRfbW9kZScpIHNldEVkaXRNb2RlKHRydWUpO1xuICAgICAgaWYgKGQudHlwZSA9PT0gJ19fZGVhY3RpdmF0ZV9lZGl0X21vZGUnKSBzZXRFZGl0TW9kZShmYWxzZSk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG9uTXNnKTtcbiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHsgdHlwZTogJ19fZWRpdF9tb2RlX2F2YWlsYWJsZScgfSwgJyonKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBvbk1zZyk7XG4gIH0sIFtdKTtcblxuICAvLyBVUkwgXHVENTc0XHVDMkRDIFx1QjUyNSBcdUI5QzFcdUQwNkM6ICNjb2wte2lkfSBcdTIxOTIgXHVDRTdDXHVCN0ZDIFx1QzBDMVx1QzEzOCwgI3Bvc3Qte2lkfSBcdTIxOTIgXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwIFx1QzBDMVx1QzEzOFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGFwcGx5SGFzaCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGggPSB3aW5kb3cubG9jYXRpb24uaGFzaCB8fCAnJztcbiAgICAgIGNvbnN0IGNvbE1hdGNoID0gaC5tYXRjaCgvXiNjb2wtKC4rKSQvKTtcbiAgICAgIGNvbnN0IHBvc3RNYXRjaCA9IGgubWF0Y2goL14jcG9zdC0oLispJC8pO1xuICAgICAgY29uc3QgbGVjdHVyZU1hdGNoID0gaC5tYXRjaCgvXiNsZWN0dXJlLSguKykkLyk7XG4gICAgICBpZiAoY29sTWF0Y2gpIHtcbiAgICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX2NvbHVtbl9pZCcsIGRlY29kZVVSSUNvbXBvbmVudChjb2xNYXRjaFsxXSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIHNldFJvdXRlKCdjb2x1bW4nKTtcbiAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jnbmpfcm91dGUnLCAnY29sdW1uJyk7IH0gY2F0Y2gge31cbiAgICAgIH0gZWxzZSBpZiAocG9zdE1hdGNoKSB7XG4gICAgICAgIHRyeSB7IHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2JnbmpfcGVuZGluZ19wb3N0X2lkJywgZGVjb2RlVVJJQ29tcG9uZW50KHBvc3RNYXRjaFsxXSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIHNldFJvdXRlKCdjb21tdW5pdHknKTtcbiAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jnbmpfcm91dGUnLCAnY29tbXVuaXR5Jyk7IH0gY2F0Y2gge31cbiAgICAgIH0gZWxzZSBpZiAobGVjdHVyZU1hdGNoKSB7XG4gICAgICAgIHRyeSB7IHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2JnbmpfcGVuZGluZ19sZWN0dXJlX2lkJywgZGVjb2RlVVJJQ29tcG9uZW50KGxlY3R1cmVNYXRjaFsxXSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIHNldFJvdXRlKCdsZWN0dXJlcycpO1xuICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYmdual9yb3V0ZScsICdsZWN0dXJlcycpOyB9IGNhdGNoIHt9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0b3VyTWF0Y2ggPSBoLm1hdGNoKC9eI3RvdXItKC4rKSQvKTtcbiAgICAgICAgaWYgKHRvdXJNYXRjaCkge1xuICAgICAgICAgIHRyeSB7IHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2JnbmpfcGVuZGluZ190b3VyX2lkJywgZGVjb2RlVVJJQ29tcG9uZW50KHRvdXJNYXRjaFsxXSkpOyB9IGNhdGNoIHt9XG4gICAgICAgICAgc2V0Um91dGUoJ3RvdXInKTtcbiAgICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYmdual9yb3V0ZScsICd0b3VyJyk7IH0gY2F0Y2gge31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgYXBwbHlIYXNoKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBhcHBseUhhc2gpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIGFwcGx5SGFzaCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCB1cGRhdGVUd2Vha3MgPSAobmV4dCkgPT4ge1xuICAgIHNldFR3ZWFrcyhuZXh0KTtcbiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHsgdHlwZTogJ19fZWRpdF9tb2RlX3NldF9rZXlzJywgZWRpdHM6IG5leHQgfSwgJyonKTtcbiAgfTtcblxuICBjb25zdCBoaWRlTmF2ID0gcm91dGUgPT09IFwibG9naW5cIiB8fCByb3V0ZSA9PT0gXCJzaWdudXBcIiB8fCByb3V0ZSA9PT0gXCJhZG1pblwiO1xuXG4gIC8vIFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjhcdUI5N0Mgd2luZG93IFx1QzVEMFx1QzExQyBkZWZlbnNpdmUgbG9va3VwIFx1MjAxNCBiYWJlbC1zdGFuZGFsb25lIFx1QzJBNFx1RDA2Q1x1QjlCRFx1RDJCOCBcdUI4NUNcdUI0REMgXHVDMjFDXHVDMTFDL1x1QzJFNFx1RDMyOFx1QzVEMFxuICAvLyBcdUFDQUNcdUFDRTBcdUQ1NThcdUFDOEMgXHVCM0Q5XHVDNzkxLiBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjhcdUFDMDAgXHVDNUM2XHVDNzNDXHVCQTc0IGZhbGxiYWNrIFVJIFx1QjgwQ1x1QjM1NChcdUM4MDRcdUNDQjQgXHVDNTcxIFx1RDJCOFx1QjlBQ1x1QjI5NCBcdUM4RkRcdUM5QzAgXHVDNTRBXHVBQzhDKS5cbiAgY29uc3QgcmVuZGVyUGFnZSA9ICgpID0+IHtcbiAgICBjb25zdCBXID0gd2luZG93O1xuICAgIGNvbnN0IGZhbGxiYWNrID0gKGxhYmVsKSA9PiAoKSA9PiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7cGFkZGluZzo0OCwgdGV4dEFsaWduOidjZW50ZXInLCBjb2xvcjonIzFmMjkzNyd9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J21vbm9zcGFjZScsIGZvbnRTaXplOjExLCBjb2xvcjonI2RjMjYyNicsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIG1hcmdpbkJvdHRvbTo4fX0+UEFHRV9OT1RfTE9BREVEPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tmb250RmFtaWx5OidzZXJpZicsIGZvbnRTaXplOjE4LCBtYXJnaW5Cb3R0b206Nn19PntsYWJlbH0gXHVEMzk4XHVDNzc0XHVDOUMwXHVCOTdDIFx1QkQ4OFx1QjdFQ1x1QzYyNFx1QzlDMCBcdUJBQkJcdUQ1ODhcdUMyQjVcdUIyQzhcdUIyRTQ8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjEyLCBjb2xvcjonIzY0NzQ4YicsIG1hcmdpbkJvdHRvbToxOH19Plx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2OCBcdUQ2QzRcdUM1RDBcdUIzQzQgXHVBQzE5XHVDNzQwIFx1RDY1NFx1QkE3NFx1Qzc3NCBcdUJDRjRcdUM3NzhcdUIyRTRcdUJBNzQgXHVDN0EwXHVDMkRDIFx1RDZDNCBcdUIyRTRcdUMyREMgXHVDMkRDXHVCM0M0XHVENTc0IFx1QzhGQ1x1QzEzOFx1QzY5NC48L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTsgfSBjYXRjaCB7fSB9fSBzdHlsZT17e3BhZGRpbmc6JzhweCAxNnB4JywgY3Vyc29yOidwb2ludGVyJ319Plx1RDM5OFx1Qzc3NFx1QzlDMCBcdUMwQzhcdUI4NUNcdUFDRTBcdUNFNjg8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gICAgY29uc3QgcGljayA9IChuYW1lLCBsYWJlbCkgPT4gV1tuYW1lXSB8fCBmYWxsYmFjayhsYWJlbCk7XG4gICAgc3dpdGNoIChyb3V0ZSkge1xuICAgICAgY2FzZSBcImhvbWVcIjogICAgICB7IGNvbnN0IEMgPSBwaWNrKCdIb21lUGFnZScsJ1x1RDY0OCcpOyAgICAgIHJldHVybiA8QyBnbz17Z299IHR3ZWFrcz17dHdlYWtzfS8+OyB9XG4gICAgICBjYXNlIFwiZWF0XCI6ICAgICAgIHsgY29uc3QgQyA9IHBpY2soJ0VhdFBhZ2UnLCdcdUJBMzlcdUFDRTAgXHVCMTgwXHVDNzkwJyk7IHJldHVybiA8QyBnbz17Z299IHVzZXI9e3VzZXJ9Lz47IH1cbiAgICAgIGNhc2UgXCJzbGVlcFwiOiAgICAgeyBjb25zdCBDID0gcGljaygnU2xlZXBQYWdlJywnXHVDNzkwXHVBQ0UwIFx1QjE4MFx1Qzc5MCcpOyByZXR1cm4gPEMgZ289e2dvfSB1c2VyPXt1c2VyfS8+OyB9XG4gICAgICBjYXNlIFwic2hvcFwiOiAgICAgIHsgY29uc3QgQyA9IHBpY2soJ1Nob3BQYWdlJywnXHVDMEFDXHVBQ0UwIFx1QjE4MFx1Qzc5MCcpOyByZXR1cm4gPEMgZ289e2dvfSB1c2VyPXt1c2VyfS8+OyB9XG4gICAgICBjYXNlIFwiY29tbXVuaXR5XCI6IHsgY29uc3QgQyA9IHBpY2soJ0NvbW11bml0eVBhZ2UnLCdcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAnKTsgcmV0dXJuIDxDIGdvPXtnb30gcG9zdElkPXtwb3N0SWR9IHNldFBvc3RJZD17c2V0UG9zdElkfSB1c2VyPXt1c2VyfS8+OyB9XG4gICAgICBjYXNlIFwidG91clwiOiAgICAgIHsgY29uc3QgQyA9IHBpY2soJ1RvdXJQYWdlJywnXHVEMjJDXHVDNUI0Jyk7IHJldHVybiA8QyBnbz17Z299IHVzZXI9e3VzZXJ9Lz47IH1cbiAgICAgIGNhc2UgXCJsZWN0dXJlc1wiOiAgeyBjb25zdCBDID0gcGljaygnTGVjdHVyZXNQYWdlJywnXHVBQzE1XHVDNUYwJyk7IHJldHVybiA8QyBnbz17Z299IHVzZXI9e3VzZXJ9Lz47IH1cbiAgICAgIGNhc2UgXCJwcml2YWN5XCI6ICAgeyBjb25zdCBDID0gcGljaygnTGVnYWxQYWdlJywnXHVDNTdEXHVBRDAwJyk7IHJldHVybiA8QyBnbz17Z299IHNsdWc9XCJwcml2YWN5XCIvPjsgfVxuICAgICAgY2FzZSBcInRlcm1zXCI6ICAgICB7IGNvbnN0IEMgPSBwaWNrKCdMZWdhbFBhZ2UnLCdcdUM1N0RcdUFEMDAnKTsgcmV0dXJuIDxDIGdvPXtnb30gc2x1Zz1cInRlcm1zXCIvPjsgfVxuICAgICAgY2FzZSBcImZhcVwiOiAgICAgICB7IGNvbnN0IEMgPSBwaWNrKCdGYXFQYWdlJywnXHVDNzkwXHVDOEZDIFx1QkIzQlx1QjI5NCBcdUM5QzhcdUJCMzgnKTsgcmV0dXJuIDxDIGdvPXtnb30vPjsgfVxuICAgICAgY2FzZSBcImNvbHVtblwiOiAgICB7IGNvbnN0IEMgPSBwaWNrKCdDb2x1bW5QYWdlJywnXHVDRTdDXHVCN0ZDJyk7IHJldHVybiA8QyBnbz17Z299IHVzZXI9e3VzZXJ9Lz47IH1cbiAgICAgIGNhc2UgXCJib29rXCI6ICAgICAgeyBjb25zdCBDID0gcGljaygnQm9va1BhZ2UnLCdcdUNDNDUnKTsgcmV0dXJuIDxDIGdvPXtnb30gY2FydD17Y2FydH0gc2V0Q2FydD17c2V0Q2FydH0gdXNlcj17dXNlcn0vPjsgfVxuICAgICAgY2FzZSBcImNoZWNrb3V0XCI6ICB7IGNvbnN0IEMgPSBwaWNrKCdDaGVja291dFBhZ2UnLCdcdUFDQjBcdUM4MUMnKTsgcmV0dXJuIDxDIGdvPXtnb30gY2FydD17Y2FydH0gdXNlcj17dXNlcn0vPjsgfVxuICAgICAgY2FzZSBcIm15cGFnZVwiOiAgICB7IGNvbnN0IEMgPSBwaWNrKCdNeVBhZ2UnLCdcdUI5QzhcdUM3NzRcdUQzOThcdUM3NzRcdUM5QzAnKTsgcmV0dXJuIDxDIGdvPXtnb30gdXNlcj17dXNlcn0gY2FydD17Y2FydH0vPjsgfVxuICAgICAgY2FzZSBcImxvZ2luXCI6XG4gICAgICBjYXNlIFwic2lnbnVwXCI6ICAgIHsgY29uc3QgQyA9IHBpY2soJ0xvZ2luUGFnZScsJ1x1Qjg1Q1x1QURGOFx1Qzc3OCcpOyByZXR1cm4gPEMgZ289e2dvfSBzZXRVc2VyPXtzZXRVc2VyfS8+OyB9XG4gICAgICBjYXNlIFwiYWRtaW5cIjogICAgIHtcbiAgICAgICAgaWYgKCF1c2VyPy5pc0FkbWluKSB7IGNvbnN0IEQgPSBwaWNrKCdBZG1pbkRlbmllZCcsJ1x1QUQwMFx1QjlBQycpOyByZXR1cm4gPEQgZ289e2dvfSB1c2VyPXt1c2VyfS8+OyB9XG4gICAgICAgIGNvbnN0IEMgPSBwaWNrKCdBZG1pblBhZ2UnLCdcdUFEMDBcdUI5QUMnKTsgcmV0dXJuIDxDIGdvPXtnb30gdXNlcj17dXNlcn0vPjtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6ICAgICAgICAgIHsgY29uc3QgQyA9IHBpY2soJ0hvbWVQYWdlJywnXHVENjQ4Jyk7IHJldHVybiA8QyBnbz17Z299IHR3ZWFrcz17dHdlYWtzfS8+OyB9XG4gICAgfVxuICB9O1xuICAvLyBcdUQzOThcdUM3NzRcdUM5QzBcdUJDQzQgXHVDNUQwXHVCN0VDIFx1QkMxNFx1QzZCNFx1QjM1NFx1QjlBQyBcdTIwMTQgXHVENTVDIFx1RDM5OFx1Qzc3NFx1QzlDMFx1QUMwMCBcdUIzNThcdUM5QzQgXHVDNjI0XHVCOTU4XHVBQzAwIFx1QzgwNFx1QzVFRFx1QzczQ1x1Qjg1QyBcdUJDODhcdUM5QzBcdUM5QzAgXHVDNTRBXHVBQzhDLiBrZXk9cm91dGUgXHVCODVDIFx1Qjc3Q1x1QzZCMFx1RDJCOCBcdUJDQzBcdUFDQkQgXHVDMkRDIFx1Qzc5MFx1QjNEOSByZXNldC5cbiAgY29uc3QgcGFnZSA9IDxQYWdlRXJyb3JCb3VuZGFyeSBrZXk9e3JvdXRlfSByb3V0ZT17cm91dGV9IGdvPXtnb30+e3JlbmRlclBhZ2UoKX08L1BhZ2VFcnJvckJvdW5kYXJ5PjtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwXCI+XG4gICAgICA8TmF2IHJvdXRlPXtyb3V0ZX0gZ289e2dvfSB1c2VyPXt1c2VyfSBvbkxvZ291dD17bG9nb3V0fS8+XG4gICAgICA8bWFpbiBpZD1cIm1haW5cIiB0YWJJbmRleD1cIi0xXCIgc3R5bGU9e3tmbGV4OjEsIG91dGxpbmU6J25vbmUnfX0gYXJpYS1sYWJlbD17YCR7cm91dGV9IFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUJDRjhcdUJCMzhgfT57cGFnZX08L21haW4+XG4gICAgICB7IWhpZGVOYXYgJiYgPEZvb3RlciBnbz17Z299Lz59XG4gICAgICA8VHdlYWtzIHR3ZWFrcz17dHdlYWtzfSBzZXRUd2Vha3M9e3VwZGF0ZVR3ZWFrc30gdmlzaWJsZT17ZWRpdE1vZGV9Lz5cbiAgICAgIDxTY3JvbGxUb1RvcC8+XG4gICAgICA8Q29va2llQ29uc2VudC8+XG4gICAgICA8R2xvYmFsRXJyb3JUb2FzdC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCByb290ID0gUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKTtcbnJvb3QucmVuZGVyKDxBcHBFcnJvckJvdW5kYXJ5PjxBcHAvPjwvQXBwRXJyb3JCb3VuZGFyeT4pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBR0EsTUFBTSx5QkFBeUIsTUFBTSxVQUFVO0FBQUEsRUFDN0MsWUFBWSxPQUFPO0FBQUUsVUFBTSxLQUFLO0FBQUcsU0FBSyxRQUFRLEVBQUUsT0FBTyxNQUFNLE1BQU0sS0FBSztBQUFBLEVBQUc7QUFBQSxFQUM3RSxPQUFPLHlCQUF5QixLQUFLO0FBQUUsV0FBTyxFQUFFLE9BQU8sSUFBSTtBQUFBLEVBQUc7QUFBQSxFQUM5RCxrQkFBa0IsS0FBSyxNQUFNO0FBTi9CO0FBT0ksU0FBSyxTQUFTLEVBQUUsS0FBSyxDQUFDO0FBQ3RCLFFBQUk7QUFBRSxjQUFRLE1BQU0sc0JBQXNC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STtBQUFBLE1BQ3RHLEtBQUssVUFBYTtBQUFFLGNBQU0sSUFBSSxLQUFLLFVBQVMsZ0NBQU87QUFBRyxlQUFPLG9DQUFDLEtBQUUsSUFBUSxNQUFZLE1BQVc7QUFBQSxNQUFJO0FBQUEsTUFDbkcsS0FBSztBQUFBLE1BQ0wsS0FBSyxVQUFhO0FBQUUsY0FBTSxJQUFJLEtBQUssYUFBWSxvQkFBSztBQUFHLGVBQU8sb0NBQUMsS0FBRSxJQUFRLFNBQWlCO0FBQUEsTUFBSTtBQUFBLE1BQzlGLEtBQUssU0FBYTtBQUNoQixZQUFJLEVBQUMsNkJBQU0sVUFBUztBQUFFLGdCQUFNLElBQUksS0FBSyxlQUFjLGNBQUk7QUFBRyxpQkFBTyxvQ0FBQyxLQUFFLElBQVEsTUFBVztBQUFBLFFBQUk7QUFDM0YsY0FBTSxJQUFJLEtBQUssYUFBWSxjQUFJO0FBQUcsZUFBTyxvQ0FBQyxLQUFFLElBQVEsTUFBVztBQUFBLE1BQ2pFO0FBQUEsTUFDQSxTQUFrQjtBQUFFLGNBQU0sSUFBSSxLQUFLLFlBQVcsUUFBRztBQUFHLGVBQU8sb0NBQUMsS0FBRSxJQUFRLFFBQWU7QUFBQSxNQUFJO0FBQUEsSUFDM0Y7QUFBQSxFQUNGO0FBRUEsUUFBTSxPQUFPLG9DQUFDLHFCQUFrQixLQUFLLE9BQU8sT0FBYyxNQUFTLFdBQVcsQ0FBRTtBQUVoRixTQUNFLG9DQUFDLFNBQUksV0FBVSxTQUNiLG9DQUFDLE9BQUksT0FBYyxJQUFRLE1BQVksVUFBVSxRQUFPLEdBQ3hELG9DQUFDLFVBQUssSUFBRyxRQUFPLFVBQVMsTUFBSyxPQUFPLEVBQUMsTUFBSyxHQUFHLFNBQVEsT0FBTSxHQUFHLGNBQVksR0FBRyxLQUFLLHNDQUFZLElBQUssR0FDbkcsQ0FBQyxXQUFXLG9DQUFDLFVBQU8sSUFBTyxHQUM1QixvQ0FBQyxVQUFPLFFBQWdCLFdBQVcsY0FBYyxTQUFTLFVBQVMsR0FDbkUsb0NBQUMsaUJBQVcsR0FDWixvQ0FBQyxtQkFBYSxHQUNkLG9DQUFDLHNCQUFnQixDQUNuQjtBQUVKO0FBRUEsTUFBTSxPQUFPLFNBQVMsV0FBVyxTQUFTLGVBQWUsTUFBTSxDQUFDO0FBQ2hFLEtBQUssT0FBTyxvQ0FBQyx3QkFBaUIsb0NBQUMsU0FBRyxDQUFFLENBQW1COyIsCiAgIm5hbWVzIjogWyJlIiwgIl9hIiwgIl9iIiwgIl9jIiwgIl9kIiwgIl9lIiwgIl9mIiwgIl9nIiwgIl9oIiwgIl9pIiwgIl9qIiwgIl9rIiwgIl9sIl0KfQo=

})();

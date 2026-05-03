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
      // v00.145 — 404: 알 수 없는 라우트는 home 으로 폴백하지 않고 Error404Page 노출.
      default: {
        const C = pick("Error404Page", "\uC624\uB958");
        return /* @__PURE__ */ React.createElement(C, { go });
      }
    }
  };
  const page = /* @__PURE__ */ React.createElement(PageErrorBoundary, { key: route, route, go }, renderPage());
  return /* @__PURE__ */ React.createElement("div", { className: "app" }, !hideNav && /* @__PURE__ */ React.createElement("div", { role: "status", "aria-label": "\uC0AC\uC774\uD2B8 \uC624\uD508 \uC548\uB0B4", style: {
    background: "rgba(245, 213, 72, 0.12)",
    borderBottom: "1px solid var(--gold-dim, #C9A632)",
    color: "var(--ink, #0F172A)",
    padding: "10px 16px",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 1.55
  } }, "\u{1F331} ", /* @__PURE__ */ React.createElement("strong", null, "\uD648\uD398\uC774\uC9C0\uB97C \uC624\uD508\uD55C \uC9C0 \uC5BC\uB9C8 \uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4."), " ", /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\uC774\uC6A9\uC5D0 \uBD88\uD3B8\uD558\uC2E0 \uC810\uC774 \uC788\uB2E4\uBA74 ", /* @__PURE__ */ React.createElement("strong", null, "\uC655\uC0AC\uB4E4 \uC624\uD508\uD1A1\uBC29"), "\uC5D0 \uC54C\uB824\uC8FC\uC138\uC694 \u2014 \uACC4\uC18D \uC5C5\uB370\uC774\uD2B8\uD574 \uB098\uAC00\uACA0\uC2B5\uB2C8\uB2E4. \uD604\uC7AC ", /* @__PURE__ */ React.createElement("strong", null, "PC \uBC84\uC804 \uCD5C\uC801\uD654"), "\uB85C \uC81C\uC791\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement(Nav, { route, go, user, onLogout: logout }), /* @__PURE__ */ React.createElement("main", { id: "main", tabIndex: "-1", style: { flex: 1, outline: "none" }, "aria-label": `${route} \uD398\uC774\uC9C0 \uBCF8\uBB38` }, page), !hideNav && /* @__PURE__ */ React.createElement(Footer, { go }), /* @__PURE__ */ React.createElement(Tweaks, { tweaks, setTweaks: updateTweaks, visible: editMode }), /* @__PURE__ */ React.createElement(ScrollToTop, null), /* @__PURE__ */ React.createElement(CookieConsent, null), /* @__PURE__ */ React.createElement(GlobalErrorToast, null));
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(AppErrorBoundary, null, /* @__PURE__ */ React.createElement(App, null)));
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYm9vdC5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdTIwMTQgXHVCRDgwXHVEMkI4XHVDMkE0XHVEMkI4XHVCN0E5IChBcHAgKyBBcHBFcnJvckJvdW5kYXJ5ICsgUmVhY3RET00ucmVuZGVyKVxuLy8gdjAwLjA3MSBcdTIwMTQgaW5kZXguaHRtbCBcdUM3NTggXHVDNzc4XHVCNzdDXHVDNzc4IDxzY3JpcHQgdHlwZT1cInRleHQvYmFiZWxcIj4gXHVCRTE0XHVCODVEXHVDNzQ0IFx1QkQ4NFx1QjlBQy4gZXNidWlsZCBcdUMwQUNcdUM4MDQgXHVDRUY0XHVEMzBDXHVDNzdDLlxuLy8gXHVDODA0XHVDQ0I0IFx1QzU3MSBcdUM1RDBcdUI3RUMgXHVCQzE0XHVDNkI0XHVCMzU0XHVCOUFDIFx1MjAxNCBcdUQ3NzAgXHVENjU0XHVCQTc0IFx1QkMyOVx1QzlDMCArIFx1QzgxNVx1RDY1NVx1RDU1QyBcdUM5QzRcdUIyRTggXHVDODE1XHVCQ0Y0IFx1QjE3OFx1Q0Q5Qy5cbmNsYXNzIEFwcEVycm9yQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsLCBpbmZvOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVyciwgaW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpbmZvIH0pO1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tBcHBFcnJvckJvdW5kYXJ5XScsIGVyciwgaW5mbyk7IH0gY2F0Y2gge31cbiAgICAvLyBcdUI4MENcdUIzNTRcdUI5QzEgXHVDNjI0XHVCOTU4XHVCM0M0IFx1QzExQ1x1QkM4NFx1QzVEMCBcdUFFMzBcdUI4NUQuXG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6IGVycj8uY29kZSB8fCAoZXJyPy5uYW1lIHx8ICdSRU5ERVJfRVJST1InKSxcbiAgICAgICAgc3RhdHVzOiBudWxsLCBraW5kOiAncmVuZGVyJyxcbiAgICAgICAgbWVzc2FnZTogZXJyPy5tZXNzYWdlIHx8IFN0cmluZyhlcnIpLFxuICAgICAgICBoaW50OiAnJywgdXJsOiAnJyxcbiAgICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLCBvcmlnaW46IGxvY2F0aW9uLm9yaWdpbixcbiAgICAgIH0pPy5jYXRjaD8uKCgpID0+IHt9KTtcbiAgICB9IGNhdGNoIHt9XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICBjb25zdCBlID0gdGhpcy5zdGF0ZS5lcnJvcjtcbiAgICAgIGNvbnN0IGNvZGUgPSBlPy5jb2RlIHx8IChlPy5zdGF0dXMgPyBgSFRUUF8ke2Uuc3RhdHVzfWAgOiAoZT8ubmFtZSB8fCAnUkVOREVSX0VSUk9SJykpO1xuICAgICAgY29uc3QgcmVhc29uID0gZT8ubWVzc2FnZSB8fCBTdHJpbmcoZSk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7cGFkZGluZzo0MCwgZm9udEZhbWlseTonbW9ub3NwYWNlJywgY29sb3I6JyMxZjI5MzcnLCBiYWNrZ3JvdW5kOicjZjhmYWZjJywgbWluSGVpZ2h0OicxMDB2aCd9fT5cbiAgICAgICAgICA8aDIgc3R5bGU9e3tjb2xvcjonI2RjMjYyNicsIG1hcmdpbkJvdHRvbToxMn19Plx1MjZBMCBcdUQzOThcdUM3NzRcdUM5QzAgXHVCODBDXHVCMzU0XHVCOUMxIFx1QzYyNFx1Qjk1ODwvaDI+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDonI2ZmZicsIHBhZGRpbmc6JzE0cHggMTZweCcsIGJvcmRlcjonMXB4IHNvbGlkICNmZWNhY2EnLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOjEyLCBmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIGNvbG9yOicjMWYyOTM3JyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tjb2xvcjonI2RjMjYyNicsIGZvbnRTaXplOjExLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBtYXJnaW5Cb3R0b206Nn19PlxuICAgICAgICAgICAgICBDT0RFIFx1MDBCNyB7Y29kZX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRXZWlnaHQ6NjAwLCBtYXJnaW5Cb3R0b206OH19PntyZWFzb259PC9kaXY+XG4gICAgICAgICAgICB7ZT8uc3RhY2sgJiYgKFxuICAgICAgICAgICAgICA8ZGV0YWlscyBzdHlsZT17e21hcmdpblRvcDo4fX0+XG4gICAgICAgICAgICAgICAgPHN1bW1hcnkgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknfX0+XHVDMkE0XHVEMEREIFx1Q0Q5NFx1QzgwMSAoXHVBQzFDXHVCQzFDXHVDNzkwXHVDNkE5KTwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgICA8cHJlIHN0eWxlPXt7d2hpdGVTcGFjZToncHJlLXdyYXAnLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknLCBtYXJnaW5Ub3A6OH19PntlLnN0YWNrfTwvcHJlPlxuICAgICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaW5mbz8uY29tcG9uZW50U3RhY2sgJiYgKFxuICAgICAgICAgICAgICA8ZGV0YWlscyBzdHlsZT17e21hcmdpblRvcDo4fX0+XG4gICAgICAgICAgICAgICAgPHN1bW1hcnkgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknfX0+XHVDRUY0XHVEM0VDXHVCMTBDXHVEMkI4IFx1QzJBNFx1RDBERCAoXHVBQzFDXHVCQzFDXHVDNzkwXHVDNkE5KTwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgICA8cHJlIHN0eWxlPXt7d2hpdGVTcGFjZToncHJlLXdyYXAnLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknLCBtYXJnaW5Ub3A6OH19Pnt0aGlzLnN0YXRlLmluZm8uY29tcG9uZW50U3RhY2t9PC9wcmU+XG4gICAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHtlcnJvcjpudWxsLCBpbmZvOm51bGx9KX0gc3R5bGU9e3twYWRkaW5nOic4cHggMTZweCcsIGN1cnNvcjoncG9pbnRlcid9fT5cdUIyRTRcdUMyREMgXHVDMkRDXHVCM0M0PC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpOyB9IGNhdGNoIHt9IH19IHN0eWxlPXt7cGFkZGluZzonOHB4IDE2cHgnLCBjdXJzb3I6J3BvaW50ZXInfX0+XHVEMzk4XHVDNzc0XHVDOUMwIFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2ODwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxwIHN0eWxlPXt7bWFyZ2luVG9wOjEyLCBmb250U2l6ZToxMSwgY29sb3I6JyM2NDc0OGInfX0+XHUyNEQ4IFx1Q0Q5NFx1QUMwMCBcdUM4MTVcdUJDRjRcdUIyOTQgXHVCRTBDXHVCNzdDXHVDNkIwXHVDODAwIFx1QUMxQ1x1QkMxQ1x1Qzc5MCBcdUIzQzRcdUFENkMoRjEyKSBcdUNGNThcdUMxOTRcdUM1RDBcdUMxMUMgXHVENjU1XHVDNzc4XHVENTYwIFx1QzIxOCBcdUM3ODhcdUMyQjVcdUIyQzhcdUIyRTQuPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59XG5cbi8vIFx1RDM5OFx1Qzc3NFx1QzlDMFx1QkNDNCBcdUM1RDBcdUI3RUMgXHVCQzE0XHVDNkI0XHVCMzU0XHVCOUFDIFx1MjAxNCBcdUQ1NUMgXHVEMzk4XHVDNzc0XHVDOUMwXHVDNUQwXHVDMTFDIFx1QjM1OFx1QzlDNCBcdUM2MjRcdUI5NThcdUFDMDAgXHVDODA0XHVDNUVEIFx1RDJCOFx1QjlBQ1x1Qjk3QyBcdUFFNjhcdUI3MjhcdUI5QUNcdUM5QzAgXHVDNTRBXHVCM0M0XHVCODVEIFx1QUNBOVx1QjlBQy5cbi8vIHJvdXRlIFx1QUMwMCBcdUJDMTRcdUIwMENcdUJBNzQgXHVDNzkwXHVCM0Q5IHJlc2V0IChrZXkgcHJvcCBcdUM3M0NcdUI4NUMgXHVBQzE1XHVDODFDIHJlbW91bnQpLlxuY2xhc3MgUGFnZUVycm9yQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVyciwgaW5mbykge1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tQYWdlRXJyb3JCb3VuZGFyeV0nLCB0aGlzLnByb3BzLnJvdXRlLCBlcnIsIGluZm8pOyB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6IGVycj8uY29kZSB8fCAoZXJyPy5uYW1lIHx8ICdQQUdFX1JFTkRFUl9FUlJPUicpLFxuICAgICAgICBzdGF0dXM6IG51bGwsIGtpbmQ6ICdyZW5kZXInLFxuICAgICAgICBtZXNzYWdlOiBlcnI/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVyciksXG4gICAgICAgIGhpbnQ6IGByb3V0ZT0ke3RoaXMucHJvcHMucm91dGV9YCwgdXJsOiAnJyxcbiAgICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLCBvcmlnaW46IGxvY2F0aW9uLm9yaWdpbixcbiAgICAgIH0pPy5jYXRjaD8uKCgpID0+IHt9KTtcbiAgICB9IGNhdGNoIHt9XG4gIH1cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmIChwcmV2UHJvcHMucm91dGUgIT09IHRoaXMucHJvcHMucm91dGUgJiYgdGhpcy5zdGF0ZS5lcnJvcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiBudWxsIH0pO1xuICAgIH1cbiAgfVxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIGNvbnN0IGUgPSB0aGlzLnN0YXRlLmVycm9yO1xuICAgICAgY29uc3QgY29kZSA9IGU/LmNvZGUgfHwgKGU/LnN0YXR1cyA/IGBIVFRQXyR7ZS5zdGF0dXN9YCA6IChlPy5uYW1lIHx8ICdQQUdFX1JFTkRFUl9FUlJPUicpKTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOjQ4LCBmb250RmFtaWx5OidzYW5zLXNlcmlmJywgbWluSGVpZ2h0Oic2MHZoJywgdGV4dEFsaWduOidjZW50ZXInfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J21vbm9zcGFjZScsIGZvbnRTaXplOjExLCBjb2xvcjonI2RjMjYyNicsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIG1hcmdpbkJvdHRvbTo4fX0+e2NvZGV9PC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjE4LCBjb2xvcjonIzBmMTcyYScsIG1hcmdpbkJvdHRvbTo4LCBmb250V2VpZ2h0OjYwMH19Plx1Qzc3NCBcdUQzOThcdUM3NzRcdUM5QzBcdUI5N0MgXHVCRDg4XHVCN0VDXHVDNjI0XHVCMzU4IFx1QzkxMSBcdUM2MjRcdUI5NThcdUFDMDAgXHVCQzFDXHVDMEREXHVENTg4XHVDMkI1XHVCMkM4XHVCMkU0PC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjEzLCBjb2xvcjonIzQ3NTU2OScsIG1hcmdpbkJvdHRvbToxOCwgbWF4V2lkdGg6NTIwLCBtYXJnaW46JzAgYXV0byAxOHB4JywgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICAgIHtlPy5tZXNzYWdlIHx8ICdcdUM1NEMgXHVDMjE4IFx1QzVDNlx1QjI5NCBcdUM2MjRcdUI5NTgnfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidpbmxpbmUtZmxleCcsIGdhcDo4fX0+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogbnVsbCB9KX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMHB4IDE4cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBib3JkZXI6JzFweCBzb2xpZCAjY2JkNWUxJywgYmFja2dyb3VuZDonI2ZmZid9fT5cdUIyRTRcdUMyREMgXHVDMkRDXHVCM0M0PC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgdGhpcy5wcm9wcy5nbygnaG9tZScpOyB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IG51bGwgfSk7IH0gY2F0Y2gge30gfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMHB4IDE4cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBib3JkZXI6JzFweCBzb2xpZCAjY2JkNWUxJywgYmFja2dyb3VuZDonI2ZmZid9fT5cdUQ2NDhcdUM3M0NcdUI4NUM8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4geyB0cnkgeyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7IH0gY2F0Y2gge30gfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMHB4IDE4cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBib3JkZXI6JzFweCBzb2xpZCAjZjVkNTQ4JywgYmFja2dyb3VuZDonI2Y1ZDU0OCcsIGNvbG9yOicjMGYxNzJhJywgZm9udFdlaWdodDo2MDB9fT5cdUMwQzhcdUI4NUNcdUFDRTBcdUNFNjg8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbjtcbiAgfVxufVxuXG4vLyBcdUM4MDRcdUM1RUQgXHVCQkY4XHVDQzk4XHVCOUFDIFx1QzYyNFx1Qjk1OCBcdUQxQTBcdUMyQTRcdUQyQjggXHUyMDE0IFx1QkU0NFx1QjNEOVx1QUUzMC9Qcm9taXNlIFx1QUM3MFx1QkQ4MFx1QzY0MCBcdUM3OTBcdUM2RDAgXHVCODVDXHVCNERDIFx1QzJFNFx1RDMyOFx1QUU0Q1x1QzlDMCBcdUNFQTFcdUNDOTguXG4vLyBcdUJBQThcdUI0RTAgXHVDNjI0XHVCOTU4XHVCMjk0IFx1QzExQ1x1QkM4NChEMS5lcnJvcl9sb2cpIFx1QzVEMCBcdUM3OTBcdUIzRDkgXHVBRTMwXHVCODVEICsgMTBcdUNEMDggXHVENkM0IFx1Qzc5MFx1QjNEOSBcdUMxOENcdUFDNzAuXG5jb25zdCBUT0FTVF9ESVNNSVNTX01TID0gMTAwMDA7XG4vLyBcdUJCMzRcdUQ1NUMgXHVCOEU4XHVENTA0IFx1QUMwMFx1QjREQyBcdTIwMTQgZXJyb3ItbG9nIFx1QzVENFx1QjREQ1x1RDNFQ1x1Qzc3OFx1RDJCOCBcdUQ2MzhcdUNEOUMgXHVDNzkwXHVDQ0I0XHVBQzAwIFx1QzJFNFx1RDMyOFx1RDU2MCBcdUI1NEMgXHVCNjEwIFx1RDFBMFx1QzJBNFx1RDJCOFx1MjE5MnJlcG9ydFx1MjE5MmZhaWwgXHVBQzAwIFx1QkMxOFx1QkNGNVx1QjQxOFx1QjI5NCBcdUFDODNcdUM3NDQgXHVDQzI4XHVCMkU4LlxubGV0IF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTtcbmNvbnN0IHJlcG9ydEVycm9yVG9TZXJ2ZXIgPSAoZW50cnkpID0+IHtcbiAgaWYgKF9fcmVwb3J0aW5nRXJyb3IpIHJldHVybjtcbiAgLy8gZXJyb3ItbG9nIFx1QzVENFx1QjREQ1x1RDNFQ1x1Qzc3OFx1RDJCOCBcdUQ2MzhcdUNEOUMgXHVDNzkwXHVDQ0I0XHVDNUQwXHVDMTFDIFx1QkMxQ1x1QzBERFx1RDU1QyBcdUM2MjRcdUI5NThcdUIyOTQgXHVCQ0Y0XHVBQ0UwIFx1QjMwMFx1QzBDMVx1QzVEMFx1QzExQyBcdUM4MUNcdUM2NzguXG4gIGlmICh0eXBlb2YgZW50cnkudXJsID09PSAnc3RyaW5nJyAmJiBlbnRyeS51cmwuaW5jbHVkZXMoJy9hcGkvZXJyb3ItbG9nJykpIHJldHVybjtcbiAgX19yZXBvcnRpbmdFcnJvciA9IHRydWU7XG4gIHRyeSB7XG4gICAgY29uc3QgcCA9IHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICBjb2RlOiBlbnRyeS5jb2RlLCBzdGF0dXM6IGVudHJ5LnN0YXR1cywga2luZDogZW50cnkua2luZCxcbiAgICAgIG1lc3NhZ2U6IGVudHJ5Lm1lc3NhZ2UsIGhpbnQ6IGVudHJ5LmhpbnQsIHVybDogZW50cnkudXJsLFxuICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLCBvcmlnaW46IGxvY2F0aW9uLm9yaWdpbixcbiAgICB9KTtcbiAgICBpZiAocCAmJiB0eXBlb2YgcC5jYXRjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcC5jYXRjaCgoKSA9PiB7fSkuZmluYWxseSgoKSA9PiB7IF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTtcbiAgICB9XG4gIH0gY2F0Y2gge1xuICAgIF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTtcbiAgfVxufTtcbmNvbnN0IEdsb2JhbEVycm9yVG9hc3QgPSAoKSA9PiB7XG4gIGNvbnN0IFtlcnJvcnMsIHNldEVycm9yc10gPSBSZWFjdC51c2VTdGF0ZShbXSk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcHVzaCA9IChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgaWQgPSBEYXRlLm5vdygpICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIHNldEVycm9ycygocHJldikgPT4gWy4uLnByZXYsIHsgaWQsIC4uLmVudHJ5IH1dLnNsaWNlKC0zKSk7XG4gICAgICByZXBvcnRFcnJvclRvU2VydmVyKGVudHJ5KTtcbiAgICAgIC8vIDEwXHVDRDA4IFx1RDZDNCBcdUM3OTBcdUIzRDkgXHVDMThDXHVBQzcwLlxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHNldEVycm9ycygocHJldikgPT4gcHJldi5maWx0ZXIoKGUpID0+IGUuaWQgIT09IGlkKSk7XG4gICAgICB9LCBUT0FTVF9ESVNNSVNTX01TKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVqZWN0aW9uID0gKGV2KSA9PiB7XG4gICAgICBjb25zdCByID0gZXY/LnJlYXNvbjtcbiAgICAgIGlmICghcikgcmV0dXJuO1xuICAgICAgY29uc3QgY29kZSA9IHIuY29kZSB8fCAoci5zdGF0dXMgPyBgSFRUUF8ke3Iuc3RhdHVzfWAgOiAoci5uYW1lIHx8ICdQUk9NSVNFX1JFSkVDVElPTicpKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSByLm1lc3NhZ2UgfHwgU3RyaW5nKHIpO1xuICAgICAgcHVzaCh7IGNvZGUsIHN0YXR1czogci5zdGF0dXMgfHwgbnVsbCwgbWVzc2FnZSwgaGludDogci5oaW50IHx8ICcnLCB1cmw6IHIudXJsIHx8ICcnLCBraW5kOiByLmtpbmQgfHwgJ3Vua25vd24nIH0pO1xuICAgICAgdHJ5IHsgY29uc29sZS5lcnJvcignW0dsb2JhbEVycm9yVG9hc3RdJywgcik7IH0gY2F0Y2gge31cbiAgICB9O1xuICAgIGNvbnN0IG9uRXJyb3IgPSAoZXYpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBldj8ubWVzc2FnZSB8fCBldj8uZXJyb3I/Lm1lc3NhZ2UgfHwgJ1NjcmlwdCBlcnJvcic7XG4gICAgICBwdXNoKHsgY29kZTogJ1dJTkRPV19FUlJPUicsIHN0YXR1czogbnVsbCwgbWVzc2FnZSwgaGludDogJycsIHVybDogZXY/LmZpbGVuYW1lIHx8ICcnLCBraW5kOiAndW5rbm93bicgfSk7XG4gICAgICB0cnkgeyBjb25zb2xlLmVycm9yKCdbR2xvYmFsRXJyb3JUb2FzdF0nLCBldj8uZXJyb3IgfHwgZXYpOyB9IGNhdGNoIHt9XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgb25SZWplY3Rpb24pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgb25SZWplY3Rpb24pO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgfTtcbiAgfSwgW10pO1xuICBjb25zdCBkaXNtaXNzID0gKGlkKSA9PiBzZXRFcnJvcnMoKHByZXYpID0+IHByZXYuZmlsdGVyKChlKSA9PiBlLmlkICE9PSBpZCkpO1xuICBpZiAoIWVycm9ycy5sZW5ndGgpIHJldHVybiBudWxsO1xuICByZXR1cm4gKFxuICAgIDxkaXYgYXJpYS1saXZlPVwicG9saXRlXCIgc3R5bGU9e3tcbiAgICAgIHBvc2l0aW9uOidmaXhlZCcsIHJpZ2h0OjE2LCBib3R0b206MTYsIHpJbmRleDoyMDAwLFxuICAgICAgZGlzcGxheTonZmxleCcsIGZsZXhEaXJlY3Rpb246J2NvbHVtbicsIGdhcDo4LCBtYXhXaWR0aDo0MjAsXG4gICAgfX0+XG4gICAgICB7ZXJyb3JzLm1hcCgoZSkgPT4gKFxuICAgICAgICA8ZGl2IGtleT17ZS5pZH0gcm9sZT1cImFsZXJ0XCIgc3R5bGU9e3tcbiAgICAgICAgICBiYWNrZ3JvdW5kOicjZmZmJywgYm9yZGVyOicxcHggc29saWQgI2MyNGEzZCcsIGJveFNoYWRvdzonMCA4cHggMjRweCByZ2JhKDAsMCwwLDAuMTQpJyxcbiAgICAgICAgICBwYWRkaW5nOicxMnB4IDE0cHgnLCBmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIGNvbG9yOicjMWUyOTNiJyxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDoxMiwgbWFyZ2luQm90dG9tOjR9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7Zm9udEZhbWlseTonbW9ub3NwYWNlJywgZm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMTRlbScsIGNvbG9yOicjYzI0YTNkJ319PlxuICAgICAgICAgICAgICB7ZS5jb2RlfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZGlzbWlzcyhlLmlkKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidub25lJywgYm9yZGVyOidub25lJywgY3Vyc29yOidwb2ludGVyJywgY29sb3I6JyM5NGEzYjgnLCBmb250U2l6ZToxNH19XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJcdUIyRUJcdUFFMzBcIj5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFdlaWdodDo2MDAsIG1hcmdpbkJvdHRvbTplLmhpbnQgPyA0IDogMH19PntlLm1lc3NhZ2V9PC9kaXY+XG4gICAgICAgICAge2UuaGludCAmJiA8ZGl2IHN0eWxlPXt7Y29sb3I6JyM0NzU1NjknLCBmb250U2l6ZToxMn19PntlLmhpbnR9PC9kaXY+fVxuICAgICAgICAgIHtlLnVybCAmJiA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTonbW9ub3NwYWNlJywgZm9udFNpemU6MTAsIGNvbG9yOicjOTRhM2I4JywgbWFyZ2luVG9wOjYsIHdvcmRCcmVhazonYnJlYWstYWxsJ319PntlLnVybH08L2Rpdj59XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBUV0VBS19ERUZBVUxUUyA9IC8qRURJVE1PREUtQkVHSU4qL3tcbiAgXCJsaW5lU3R5bGVcIjogXCJvdXRsaW5lXCIsXG4gIFwiaW50ZW5zaXR5XCI6IDEsXG4gIFwiaGVyb0xheW91dFwiOiBcImNlbnRlclwiLFxuICBcImludGVyYWN0aXZlXCI6IHRydWVcbn0vKkVESVRNT0RFLUVORCovO1xuXG4vLyBVUkwgXHVBQ0JEXHVCODVDIFx1MjE5NCBcdUI3N0NcdUM2QjBcdUQyQjggXHVEMEE0IFx1QjlFNFx1RDU1MS5cbi8vIFx1QzU0Q1x1QjgyNFx1QzlDNCBcdUI3N0NcdUM2QjBcdUQyQjhcdUI5Q0MgXHVENjU0XHVDNzc0XHVEMkI4XHVCOUFDXHVDMkE0XHVEMkI4XHVCODVDIFx1QkMxQlx1QzU0NCBcdUM1NDhcdUM4MDRcdUQ1NThcdUFDOEMgXHVEM0Y0XHVCQzMxXHVENTVDXHVCMkU0KGhvbWUpLlxuY29uc3QgVkFMSURfUk9VVEVTID0gWydob21lJywnY29tbXVuaXR5JywnbGVjdHVyZXMnLCd0b3VyJywnY29sdW1uJywnYm9vaycsJ2NoZWNrb3V0JywnbXlwYWdlJywnYWRtaW4nLCdsb2dpbicsJ3NpZ251cCcsJ2ZhcScsJ3Rlcm1zJywncHJpdmFjeScsJ2VhdCcsJ3NsZWVwJywnc2hvcCddO1xuY29uc3QgcGF0aFRvUm91dGUgPSAocGF0aG5hbWUpID0+IHtcbiAgY29uc3QgcCA9IChwYXRobmFtZSB8fCAnLycpLnJlcGxhY2UoL1xcLyskLywgJycpIHx8ICcvJztcbiAgaWYgKHAgPT09ICcvJykgcmV0dXJuICdob21lJztcbiAgY29uc3Qgc2VnID0gcC5yZXBsYWNlKC9eXFwvLywgJycpLnNwbGl0KCcvJylbMF07XG4gIHJldHVybiBWQUxJRF9ST1VURVMuaW5jbHVkZXMoc2VnKSA/IHNlZyA6ICdob21lJztcbn07XG5jb25zdCByb3V0ZVRvUGF0aCA9IChyKSA9PiByID09PSAnaG9tZScgPyAnLycgOiAnLycgKyByO1xuXG5jb25zdCBBcHAgPSAoKSA9PiB7XG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgIC8vIFVSTCBcdUM2QjBcdUMxMjAuIFx1RDNGNFx1QkMzMVx1QzczQ1x1Qjg1QyBsb2NhbFN0b3JhZ2UuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZyb21QYXRoID0gcGF0aFRvUm91dGUod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgIGlmIChmcm9tUGF0aCAhPT0gJ2hvbWUnIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gJy8nKSByZXR1cm4gZnJvbVBhdGg7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jnbmpfcm91dGUnKSB8fCAnaG9tZSc7XG4gICAgfSBjYXRjaCB7IHJldHVybiAnaG9tZSc7IH1cbiAgfSk7XG4gIGNvbnN0IFtwb3N0SWQsIHNldFBvc3RJZF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4gd2luZG93LkJHTkpfQVVUSC5nZXRTZXNzaW9uVXNlcigpKTtcbiAgLy8gXHVDMTFDXHVCQzg0IFx1QzEzOFx1QzE1OFx1Qzc0NCAxXHVENjhDIFx1QUM4MFx1Qzk5RCBcdTIwMTQgXHVDRTkwXHVDMkRDXHVBQzAwIFx1QzJFMFx1QzEyMFx1RDU1OFx1QzlDMCBcdUM1NEFcdUM3NDQgXHVDMjE4IFx1Qzc4OFx1QzczQ1x1QkJDMFx1Qjg1QyBcdUM5QzRcdUM3ODUgXHVDMkRDIC9hcGkvYXV0aC9tZVx1Qjg1QyBcdUFDMzFcdUMyRTAuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIHdpbmRvdy5CR05KX0FVVEgucmVmcmVzaFNlc3Npb24/LigpLnRoZW4oKHUpID0+IHtcbiAgICAgIGlmICghY2FuY2VsbGVkKSBzZXRVc2VyKHUgfHwgbnVsbCk7XG4gICAgICBpZiAodT8uaWQpIHtcbiAgICAgICAgLy8gXHVCQzI5XHVCQjM4IFx1QUUzMFx1Qjg1RCBcdTIwMTQgXHVDNzkwXHVCM0Q5IFx1QzJCOVx1QUUwOSBcdUQzQzlcdUFDMDBcdUM3NTggdmlzaXRzTGFzdDMwRGF5cyBcdUNFMjFcdUM4MTVcdUM1RDAgXHVDMEFDXHVDNkE5LiBcdUFDMTlcdUM3NDAgXHVCMEEwIFx1Q0NBQiBcdUM5QzRcdUM3ODVcdUI5Q0MgXHVDRTc0XHVDNkI0XHVEMkI4LlxuICAgICAgICB0cnkgeyB3aW5kb3cuQkdOSl9WSVNJVFM/LnJlY29yZD8uKHUuaWQpOyB9IGNhdGNoIHt9XG4gICAgICAgIC8vIFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUMwQUNcdUM2QTlcdUM3OTBcdUI3N0NcdUJBNzQgXHVCQ0Y4XHVDNzc4IFx1RDY1Q1x1QjNEOSBcdUIzNzBcdUM3NzRcdUQxMzAgXHVDNzdDXHVBRDA0IFx1QjNEOVx1QUUzMFx1RDY1NC5cbiAgICAgICAgUHJvbWlzZS5hbGxTZXR0bGVkKFtcbiAgICAgICAgICB3aW5kb3cuQkdOSl9MRUNUVVJFUz8ucmVmcmVzaE1pbmU/LigpLFxuICAgICAgICAgIHdpbmRvdy5CR05KX1RPVVJTPy5yZWZyZXNoTWluZT8uKCksXG4gICAgICAgICAgd2luZG93LkJHTkpfQk9PS19PUkRFUlM/LnJlZnJlc2hNaW5lPy4oKSxcbiAgICAgICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hCb29rbWFya3M/Lih1LmlkKSxcbiAgICAgICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hOb3RpZmljYXRpb25zPy4odS5pZCksXG4gICAgICAgIF0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBcdUMxMUNcdUJDODQgc291cmNlIG9mIHRydXRoIFx1Qzc3OCBcdUM2QjRcdUM2MDEgXHVCMzcwXHVDNzc0XHVEMTMwXHVCNEU0XHVDNzQ0IFx1QzlDNFx1Qzc4NSBcdUMyREMgXHVDNzdDXHVBRDA0IFx1QjNEOVx1QUUzMFx1RDY1NC5cbiAgICAvLyBcdUFDMUNcdUJDQzQgXHVENUVDXHVEMzdDXHVCMjk0IFx1Qzc5MFx1Q0NCNCBcdUNFOTBcdUMyRENcdUI5N0MgXHVBQzMxXHVDMkUwXHVENTU4XHVBQ0UwICdiZ25qLSotcmVmcmVzaCcgXHVDNzc0XHVCQ0E0XHVEMkI4XHVCOTdDIFx1QkMxQ1x1RDY1NFx1RDU1Q1x1QjJFNC5cbiAgICBQcm9taXNlLmFsbFNldHRsZWQoW1xuICAgICAgd2luZG93LkJHTkpfU0lURV9DT05URU5UPy5yZWZyZXNoPy4oKSxcbiAgICAgIHdpbmRvdy5CR05KX0ZBUT8ucmVmcmVzaD8uKCksXG4gICAgICB3aW5kb3cuQkdOSl9MRUdBTD8ucmVmcmVzaD8uKCd0ZXJtcycpLFxuICAgICAgd2luZG93LkJHTkpfTEVHQUw/LnJlZnJlc2g/LigncHJpdmFjeScpLFxuICAgICAgd2luZG93LkJHTkpfTEVDVFVSRVM/LnJlZnJlc2g/Lih7IGluY2x1ZGVIaWRkZW46IHRydWUgfSksXG4gICAgICB3aW5kb3cuQkdOSl9UT1VSUz8ucmVmcmVzaD8uKHsgaW5jbHVkZUhpZGRlbjogdHJ1ZSB9KSxcbiAgICAgIHdpbmRvdy5CR05KX0JPT0tTPy5yZWZyZXNoPy4oKSxcbiAgICAgIHdpbmRvdy5CR05KX0JPT0tfT1JERVJTPy5yZWZyZXNoQmFua0FjY291bnQ/LigpLFxuICAgICAgd2luZG93LkJHTkpfQ09MVU1OUz8ucmVmcmVzaD8uKHsgYWRtaW46IHRydWUgfSksXG4gICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hQb3N0cz8uKCksXG4gICAgICAvLyBcdUI0RjFcdUFFMDkvXHVDRTc0XHVEMTRDXHVBQ0UwXHVCOUFDIFx1MjAxNCBEMSBcdUM1RDBcdUMxMUMgXHVDMTFDXHVCQzg0IFx1QzgxNVx1Qzc1OFx1Qjk3QyBcdUJDMUJcdUM1NDQgQkdOSl9TVE9SRVMgc2VlZCBcdUI5N0MgXHVCMzZFXHVDNUI0XHVDNTAwLlxuICAgICAgLy8gXHVDMTFDXHVCQzg0XHVDNUQwIFx1QzgxNVx1Qzc1OFx1QUMwMCBcdUJFNDRcdUM1QjQgXHVDNzg4XHVDNzNDXHVCQTc0IHNlZWQgXHVBQzAwIFx1QURGOFx1QjMwMFx1Qjg1QyBcdUM3MjBcdUM5QzAoXHVDQ0FCIFx1QzlDNFx1Qzc4NVx1Qzc5MFx1QzZBOSBcdUQzRjRcdUJDMzEpLlxuICAgICAgd2luZG93LkJHTkpfQVBJPy5ncmFkZXM/Lmxpc3Q/LigpPy50aGVuPy4oKHIpID0+IHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocj8uZ3JhZGVzKSAmJiByLmdyYWRlcy5sZW5ndGgpIHtcbiAgICAgICAgICB3aW5kb3cuQkdOSl9TVE9SRVMuZ3JhZGVzID0gci5ncmFkZXMubWFwKChnKSA9PiAoe1xuICAgICAgICAgICAgaWQ6IGcuaWQsIGxhYmVsOiBnLmxhYmVsLCBsZXZlbDogZy5sZXZlbCxcbiAgICAgICAgICAgIGNvbG9yOiBnLmNvbG9yLCBkZXNjOiBnLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgb3JkZXI6IGcuZGlzcGxheV9vcmRlciA/PyAwLFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk/LmNhdGNoPy4oKCkgPT4ge30pLFxuICAgICAgd2luZG93LkJHTkpfQVBJPy5jYXRlZ29yaWVzPy5saXN0Py4oKT8udGhlbj8uKChyKSA9PiB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHI/LmNhdGVnb3JpZXMpICYmIHIuY2F0ZWdvcmllcy5sZW5ndGgpIHtcbiAgICAgICAgICB3aW5kb3cuQkdOSl9TVE9SRVMuY2F0ZWdvcmllcyA9IHIuY2F0ZWdvcmllcy5tYXAoKGMpID0+ICh7XG4gICAgICAgICAgICBpZDogYy5pZCwgbGFiZWw6IGMubGFiZWwsXG4gICAgICAgICAgICBib2FyZFR5cGU6IGMuYm9hcmRfdHlwZSB8fCAnY29tbXVuaXR5JyxcbiAgICAgICAgICAgIG1pbkxldmVsOiBjLm1pbl9sZXZlbCA/PyAwLFxuICAgICAgICAgICAgcG9zdE1pbkxldmVsOiBjLnBvc3RfbWluX2xldmVsID8/IDEwLFxuICAgICAgICAgICAgZGVzYzogYy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHByZWZpeGVzOiBjLnByZWZpeGVzIHx8IFtdLFxuICAgICAgICAgICAgb3JkZXI6IGMuZGlzcGxheV9vcmRlciA/PyAwLFxuICAgICAgICAgICAgLy8gdjAwLjE0MSBcdTIwMTQgc2NoZW1hLXY4IFx1QUQ4Q1x1RDU1QyA0XHVDODg1LiB1bmRlZmluZWQvbnVsbCAobGVnYWN5KSBcdTIxOTIgdHJ1ZS5cbiAgICAgICAgICAgIGFsbG93UmVhZDogYy5hbGxvd19yZWFkID09PSAwID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgYWxsb3dXcml0ZTogYy5hbGxvd193cml0ZSA9PT0gMCA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICAgIGFsbG93Q29tbWVudFJlYWQ6IGMuYWxsb3dfY29tbWVudF9yZWFkID09PSAwID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgYWxsb3dDb21tZW50V3JpdGU6IGMuYWxsb3dfY29tbWVudF93cml0ZSA9PT0gMCA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0pPy5jYXRjaD8uKCgpID0+IHt9KSxcbiAgICBdKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgfSwgW10pO1xuXG4gIC8vIHYwMC4xMjkgXHUyMDE0IEJHTkpfQlJPQURDQVNUIFx1QUQ2Q1x1QjNDNTogYWRtaW4gXHVEMEVEXHVDNUQwXHVDMTFDICdsZWN0dXJlcycvJ3RvdXJzJy8nY29sdW1ucycvJ3Bvc3RzJy8nYm9va3MnXG4gIC8vIFx1QkNDMFx1QUNCRFx1Qzc3NCBcdUJDMUNcdUMwRERcdUQ1NThcdUJBNzQgXHVBQzE5XHVDNzQwIG9yaWdpbiBcdUM3NTggXHVCQUE4XHVCNEUwIFx1RDBFRFx1Qzc3NCBcdUQ1NzRcdUIyRjkgXHVENUVDXHVEMzdDIHJlZnJlc2ggKyBcdUQzOThcdUM3NzRcdUM5QzAgXHVDNzc0XHVCQ0E0XHVEMkI4IGRpc3BhdGNoLlxuICAvLyBcdUM2MDg6IFx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUQwRURcdUM1RDBcdUMxMUMgXHVBQzE1XHVDNUYwIFx1QzBBRFx1QzgxQyBcdTIxOTIgXHVENjQ4IFx1RDBFRFx1QzVEMFx1QzExQyBcdUM3OTBcdUIzRDlcdUM3M0NcdUI4NUMgXHVCMkU0XHVDNzRDIFx1QUMxNVx1QzVGMCBcdUNFNzRcdUI0REMgXHVBQzMxXHVDMkUwLlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghd2luZG93LkJHTkpfQlJPQURDQVNUPy5zdWJzY3JpYmUpIHJldHVybjtcbiAgICBjb25zdCB1bnN1YiA9IHdpbmRvdy5CR05KX0JST0FEQ0FTVC5zdWJzY3JpYmUoYXN5bmMgKG1zZykgPT4ge1xuICAgICAgY29uc3QgZCA9IG1zZz8uZG9tYWluO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGQgPT09ICdsZWN0dXJlcycpIGF3YWl0IHdpbmRvdy5CR05KX0xFQ1RVUkVTPy5yZWZyZXNoPy4oeyBpbmNsdWRlSGlkZGVuOiBmYWxzZSB9KTtcbiAgICAgICAgZWxzZSBpZiAoZCA9PT0gJ3RvdXJzJykgYXdhaXQgd2luZG93LkJHTkpfVE9VUlM/LnJlZnJlc2g/Lih7IGluY2x1ZGVIaWRkZW46IGZhbHNlIH0pO1xuICAgICAgICBlbHNlIGlmIChkID09PSAnY29sdW1ucycpIGF3YWl0IHdpbmRvdy5CR05KX0NPTFVNTlM/LnJlZnJlc2g/LigpO1xuICAgICAgICBlbHNlIGlmIChkID09PSAncG9zdHMnKSBhd2FpdCB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hQb3N0cz8uKCk7XG4gICAgICAgIGVsc2UgaWYgKGQgPT09ICdib29rcycpIGF3YWl0IHdpbmRvdy5CR05KX0JPT0tTPy5yZWZyZXNoPy4oKTtcbiAgICAgICAgZWxzZSBpZiAoZCA9PT0gJ3NpdGUtY29udGVudCcpIGF3YWl0IHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8ucmVmcmVzaD8uKCk7XG4gICAgICAgIC8vIHYwMC4xNDIgXHUyMDE0IFx1QzU3RFx1QUQwMC9cdUFDMUNcdUM3NzhcdUM4MTVcdUJDRjQgXHVCQ0MwXHVBQ0JEIGJyb2FkY2FzdCBcdTIxOTIgXHVCNDUwIHNsdWcgXHVCQUE4XHVCNDUwIHJlZnJlc2ggKyBMZWdhbFBhZ2UgXHVDN0FDXHVCODBDXHVCMzU0IFx1Qzc3NFx1QkNBNFx1RDJCOC5cbiAgICAgICAgZWxzZSBpZiAoZCA9PT0gJ2xlZ2FsJykge1xuICAgICAgICAgIGF3YWl0IHdpbmRvdy5CR05KX0xFR0FMPy5yZWZyZXNoPy4oJ3Rlcm1zJyk7XG4gICAgICAgICAgYXdhaXQgd2luZG93LkJHTkpfTEVHQUw/LnJlZnJlc2g/LigncHJpdmFjeScpO1xuICAgICAgICAgIHRyeSB7IHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnYmduai1sZWdhbC1yZWZyZXNoJykpOyB9IGNhdGNoIHt9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2gge31cbiAgICB9KTtcbiAgICByZXR1cm4gdW5zdWI7XG4gIH0sIFtdKTtcblxuICBjb25zdCBbY2FydCwgc2V0Q2FydF0gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdiZ25qX2NhcnQnKTtcbiAgICAgIHJldHVybiByYXcgPyBKU09OLnBhcnNlKHJhdykgOiBudWxsO1xuICAgIH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxuICB9KTtcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGNhcnQpIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdiZ25qX2NhcnQnLCBKU09OLnN0cmluZ2lmeShjYXJ0KSk7XG4gICAgICBlbHNlIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdiZ25qX2NhcnQnKTtcbiAgICB9IGNhdGNoIHt9XG4gIH0sIFtjYXJ0XSk7XG4gIGNvbnN0IFt0d2Vha3MsIHNldFR3ZWFrc10gPSBSZWFjdC51c2VTdGF0ZShUV0VBS19ERUZBVUxUUyk7XG4gIGNvbnN0IFtlZGl0TW9kZSwgc2V0RWRpdE1vZGVdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGdvID0gKHIpID0+IHtcbiAgICBzZXRSb3V0ZShyKTtcbiAgICBzZXRQb3N0SWQobnVsbCk7XG4gICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jnbmpfcm91dGUnLCByKTsgfSBjYXRjaCB7fVxuICAgIC8vIFx1QkUwQ1x1Qjc3Q1x1QzZCMFx1QzgwMCBcdUM4RkNcdUMxOENcdUI5N0MgXHVCM0Q5XHVBRTMwXHVENjU0IFx1MjAxNCBcdUFDMTlcdUM3NDAgXHVBQ0JEXHVCODVDXHVCQTc0IHB1c2ggXHVDMEREXHVCN0I1KFx1QkQ4OFx1RDU0NFx1QzY5NFx1RDU1QyBcdUMyQTRcdUQwREQgXHVCMjA0XHVDODAxIFx1QkMyOVx1QzlDMCkuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHJvdXRlVG9QYXRoKHIpO1xuICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSAhPT0gdGFyZ2V0KSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShudWxsLCAnJywgdGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHt9XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICB9O1xuXG4gIC8vIFx1QjRBNFx1Qjg1Qy9cdUM1NUVcdUM3M0NcdUI4NUMgXHVCQzg0XHVEMkJDIFx1QjNEOVx1QUUzMFx1RDY1NCBcdTIwMTQgcG9wc3RhdGUgXHVDMkRDIFVSTFx1Qzc0NCBcdUIyRTRcdUMyREMgXHVCNzdDXHVDNkIwXHVEMkI4XHVCODVDIFx1QkNDMFx1RDY1OC5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblBvcCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG5leHQgPSBwYXRoVG9Sb3V0ZSh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xuICAgICAgc2V0Um91dGUobmV4dCk7XG4gICAgICBzZXRQb3N0SWQobnVsbCk7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvblBvcCk7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIG9uUG9wKTtcbiAgfSwgW10pO1xuXG4gIC8vIFx1Qjc3Q1x1QzZCMFx1RDJCOFx1QkNDNCBkb2N1bWVudC50aXRsZSBcdTIwMTQgXHVCRDgxXHVCOUM4XHVEMDZDIC8gXHVBQ0Y1XHVDNzIwIC8gXHVEMEVEIFx1Qjc3Q1x1QkNBOCBcdUM3NThcdUJCRjhcdUQ2NTQuXG4gIC8vIFx1QzBBQ1x1Qzc3NFx1RDJCOCBcdUNGNThcdUQxNTBcdUNFMjAoXHVCRTBDXHVCNzlDXHVCNERDXHVCQTg1L09HKVx1QjNDNCBcdUJDQzBcdUFDQkQgXHVDMkRDIFx1QUMxOVx1Qzc3NCBcdUFDMzFcdUMyRTAuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc2MgPSB3aW5kb3cuQkdOSl9TSVRFX0NPTlRFTlQ/LmdldD8uKCkgfHwge307XG4gICAgY29uc3QgYnJhbmQgPSBzYy5icmFuZD8ubmFtZSB8fCAnXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwJztcbiAgICBjb25zdCB0YWdsaW5lID0gc2Mub2c/LnRpdGxlIHx8ICdcdUJDNDVcdUFFMzAgXHVEMEMwXHVBQ0UwIFx1RDU1Q1x1QUQ2RFx1Qzc0NCBcdUIyOTBcdUIwN0NcdUIyRTQnO1xuICAgIGNvbnN0IFJPVVRFX1RJVExFUyA9IHtcbiAgICAgIGhvbWU6IHRhZ2xpbmUsXG4gICAgICBlYXQ6ICdcdUJBMzlcdUFDRTAgXHVCMTgwXHVDNzkwJyxcbiAgICAgIHNsZWVwOiAnXHVDNzkwXHVBQ0UwIFx1QjE4MFx1Qzc5MCcsXG4gICAgICBzaG9wOiAnXHVDMEFDXHVBQ0UwIFx1QjE4MFx1Qzc5MCcsXG4gICAgICB0b3VyOiAnXHVEMjJDXHVDNUI0IFx1RDUwNFx1Qjg1Q1x1QURGOFx1QjdBOCcsXG4gICAgICBsZWN0dXJlczogJ1x1QUMxNVx1QzVGMCcsXG4gICAgICBjb2x1bW46ICdcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVDRTdDXHVCN0ZDJyxcbiAgICAgIGNvbW11bml0eTogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCcsXG4gICAgICBib29rOiAnXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXHVDNzU4IFx1QUUzOCcsXG4gICAgICBjaGVja291dDogJ1x1QUNCMFx1QzgxQycsXG4gICAgICBteXBhZ2U6ICdcdUI5QzhcdUM3NzRcdUQzOThcdUM3NzRcdUM5QzAnLFxuICAgICAgYWRtaW46ICdcdUFEMDBcdUI5QUNcdUM3OTAnLFxuICAgICAgbG9naW46ICdcdUI4NUNcdUFERjhcdUM3NzgnLFxuICAgICAgc2lnbnVwOiAnXHVENjhDXHVDNkQwXHVBQzAwXHVDNzg1JyxcbiAgICAgIGZhcTogJ1x1Qzc5MFx1QzhGQyBcdUJCM0JcdUIyOTQgXHVDOUM4XHVCQjM4JyxcbiAgICAgIHByaXZhY3k6ICdcdUFDMUNcdUM3NzhcdUM4MTVcdUJDRjQgXHVDQzk4XHVCOUFDXHVCQzI5XHVDRTY4JyxcbiAgICAgIHRlcm1zOiAnXHVDNzc0XHVDNkE5XHVDNTdEXHVBRDAwJyxcbiAgICB9O1xuICAgIGNvbnN0IHNlZyA9IFJPVVRFX1RJVExFU1tyb3V0ZV0gfHwgJyc7XG4gICAgY29uc3QgdGl0bGUgPSByb3V0ZSA9PT0gJ2hvbWUnID8gYCR7YnJhbmR9IFx1MjAxNCAke3RhZ2xpbmV9YCA6IGAke3NlZ30gXHUyMDE0ICR7YnJhbmR9YDtcbiAgICB0cnkgeyBkb2N1bWVudC50aXRsZSA9IHRpdGxlOyB9IGNhdGNoIHt9XG4gICAgLy8gcm91dGUgXHVCQ0MwXHVBQ0JEIFx1QzJEQyBcdUMwQUNcdUM3NzRcdUQyQjggXHVDRjU4XHVEMTUwXHVDRTIwIHJlZnJlc2ggXHVDNzc0XHVCQ0E0XHVEMkI4XHVCM0M0IGxpc3RlbiBcdTIwMTQgXHVCRTBDXHVCNzlDXHVCNERDXHVCQTg1L1x1RDBEQ1x1QURGOFx1Qjc3Q1x1Qzc3OCBcdUJDMTRcdUIwMENcdUJBNzQgXHVDOTg5XHVDMkRDIFx1QkMxOFx1QzYwMS5cbiAgICBjb25zdCBvblNjUmVmcmVzaCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHNjMiA9IHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fTtcbiAgICAgIGNvbnN0IGIyID0gc2MyLmJyYW5kPy5uYW1lIHx8ICdcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAnO1xuICAgICAgY29uc3QgdDIgPSBzYzIub2c/LnRpdGxlIHx8ICdcdUJDNDVcdUFFMzAgXHVEMEMwXHVBQ0UwIFx1RDU1Q1x1QUQ2RFx1Qzc0NCBcdUIyOTBcdUIwN0NcdUIyRTQnO1xuICAgICAgY29uc3QgcyA9IFJPVVRFX1RJVExFU1tyb3V0ZV0gfHwgJyc7XG4gICAgICBjb25zdCBuZXdUaXRsZSA9IHJvdXRlID09PSAnaG9tZScgPyBgJHtiMn0gXHUyMDE0ICR7dDJ9YCA6IGAke3N9IFx1MjAxNCAke2IyfWA7XG4gICAgICB0cnkgeyBkb2N1bWVudC50aXRsZSA9IG5ld1RpdGxlOyB9IGNhdGNoIHt9XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1zaXRlLWNvbnRlbnQtcmVmcmVzaCcsIG9uU2NSZWZyZXNoKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Jnbmotc2l0ZS1jb250ZW50LXJlZnJlc2gnLCBvblNjUmVmcmVzaCk7XG4gIH0sIFtyb3V0ZV0pO1xuXG4gIGNvbnN0IGxvZ291dCA9ICgpID0+IHtcbiAgICB3aW5kb3cuQkdOSl9BVVRILnNpZ25PdXQoKTtcbiAgICBzZXRVc2VyKG51bGwpO1xuICAgIHNldFBvc3RJZChudWxsKTtcbiAgICBzZXRSb3V0ZShcImhvbWVcIik7XG4gICAgdHJ5IHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3JvdXRlJywgJ2hvbWUnKTtcbiAgICB9IGNhdGNoIHt9XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICB9O1xuXG4gIC8vIEVkaXQtbW9kZSBwcm90b2NvbFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uTXNnID0gKGUpID0+IHtcbiAgICAgIGNvbnN0IGQgPSBlLmRhdGEgfHwge307XG4gICAgICBpZiAoZC50eXBlID09PSAnX19hY3RpdmF0ZV9lZGl0X21vZGUnKSBzZXRFZGl0TW9kZSh0cnVlKTtcbiAgICAgIGlmIChkLnR5cGUgPT09ICdfX2RlYWN0aXZhdGVfZWRpdF9tb2RlJykgc2V0RWRpdE1vZGUoZmFsc2UpO1xuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBvbk1zZyk7XG4gICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7IHR5cGU6ICdfX2VkaXRfbW9kZV9hdmFpbGFibGUnIH0sICcqJyk7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgb25Nc2cpO1xuICB9LCBbXSk7XG5cbiAgLy8gVVJMIFx1RDU3NFx1QzJEQyBcdUI1MjUgXHVCOUMxXHVEMDZDOiAjY29sLXtpZH0gXHUyMTkyIFx1Q0U3Q1x1QjdGQyBcdUMwQzFcdUMxMzgsICNwb3N0LXtpZH0gXHUyMTkyIFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdUMwQzFcdUMxMzhcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBhcHBseUhhc2ggPSAoKSA9PiB7XG4gICAgICBjb25zdCBoID0gd2luZG93LmxvY2F0aW9uLmhhc2ggfHwgJyc7XG4gICAgICBjb25zdCBjb2xNYXRjaCA9IGgubWF0Y2goL14jY29sLSguKykkLyk7XG4gICAgICBjb25zdCBwb3N0TWF0Y2ggPSBoLm1hdGNoKC9eI3Bvc3QtKC4rKSQvKTtcbiAgICAgIGNvbnN0IGxlY3R1cmVNYXRjaCA9IGgubWF0Y2goL14jbGVjdHVyZS0oLispJC8pO1xuICAgICAgaWYgKGNvbE1hdGNoKSB7XG4gICAgICAgIHRyeSB7IHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2JnbmpfcGVuZGluZ19jb2x1bW5faWQnLCBkZWNvZGVVUklDb21wb25lbnQoY29sTWF0Y2hbMV0pKTsgfSBjYXRjaCB7fVxuICAgICAgICBzZXRSb3V0ZSgnY29sdW1uJyk7XG4gICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3JvdXRlJywgJ2NvbHVtbicpOyB9IGNhdGNoIHt9XG4gICAgICB9IGVsc2UgaWYgKHBvc3RNYXRjaCkge1xuICAgICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcsIGRlY29kZVVSSUNvbXBvbmVudChwb3N0TWF0Y2hbMV0pKTsgfSBjYXRjaCB7fVxuICAgICAgICBzZXRSb3V0ZSgnY29tbXVuaXR5Jyk7XG4gICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3JvdXRlJywgJ2NvbW11bml0eScpOyB9IGNhdGNoIHt9XG4gICAgICB9IGVsc2UgaWYgKGxlY3R1cmVNYXRjaCkge1xuICAgICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfbGVjdHVyZV9pZCcsIGRlY29kZVVSSUNvbXBvbmVudChsZWN0dXJlTWF0Y2hbMV0pKTsgfSBjYXRjaCB7fVxuICAgICAgICBzZXRSb3V0ZSgnbGVjdHVyZXMnKTtcbiAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jnbmpfcm91dGUnLCAnbGVjdHVyZXMnKTsgfSBjYXRjaCB7fVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdG91ck1hdGNoID0gaC5tYXRjaCgvXiN0b3VyLSguKykkLyk7XG4gICAgICAgIGlmICh0b3VyTWF0Y2gpIHtcbiAgICAgICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfdG91cl9pZCcsIGRlY29kZVVSSUNvbXBvbmVudCh0b3VyTWF0Y2hbMV0pKTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHNldFJvdXRlKCd0b3VyJyk7XG4gICAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jnbmpfcm91dGUnLCAndG91cicpOyB9IGNhdGNoIHt9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGFwcGx5SGFzaCgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgYXBwbHlIYXNoKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBhcHBseUhhc2gpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgdXBkYXRlVHdlYWtzID0gKG5leHQpID0+IHtcbiAgICBzZXRUd2Vha3MobmV4dCk7XG4gICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7IHR5cGU6ICdfX2VkaXRfbW9kZV9zZXRfa2V5cycsIGVkaXRzOiBuZXh0IH0sICcqJyk7XG4gIH07XG5cbiAgY29uc3QgaGlkZU5hdiA9IHJvdXRlID09PSBcImxvZ2luXCIgfHwgcm91dGUgPT09IFwic2lnbnVwXCIgfHwgcm91dGUgPT09IFwiYWRtaW5cIjtcblxuICAvLyBcdUQzOThcdUM3NzRcdUM5QzAgXHVDRUY0XHVEM0VDXHVCMTBDXHVEMkI4XHVCOTdDIHdpbmRvdyBcdUM1RDBcdUMxMUMgZGVmZW5zaXZlIGxvb2t1cCBcdTIwMTQgYmFiZWwtc3RhbmRhbG9uZSBcdUMyQTRcdUQwNkNcdUI5QkRcdUQyQjggXHVCODVDXHVCNERDIFx1QzIxQ1x1QzExQy9cdUMyRTRcdUQzMjhcdUM1RDBcbiAgLy8gXHVBQ0FDXHVBQ0UwXHVENTU4XHVBQzhDIFx1QjNEOVx1Qzc5MS4gXHVDRUY0XHVEM0VDXHVCMTBDXHVEMkI4XHVBQzAwIFx1QzVDNlx1QzczQ1x1QkE3NCBmYWxsYmFjayBVSSBcdUI4MENcdUIzNTQoXHVDODA0XHVDQ0I0IFx1QzU3MSBcdUQyQjhcdUI5QUNcdUIyOTQgXHVDOEZEXHVDOUMwIFx1QzU0QVx1QUM4QykuXG4gIGNvbnN0IHJlbmRlclBhZ2UgPSAoKSA9PiB7XG4gICAgY29uc3QgVyA9IHdpbmRvdztcbiAgICBjb25zdCBmYWxsYmFjayA9IChsYWJlbCkgPT4gKCkgPT4gKFxuICAgICAgPGRpdiBzdHlsZT17e3BhZGRpbmc6NDgsIHRleHRBbGlnbjonY2VudGVyJywgY29sb3I6JyMxZjI5MzcnfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tmb250RmFtaWx5Oidtb25vc3BhY2UnLCBmb250U2l6ZToxMSwgY29sb3I6JyNkYzI2MjYnLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBtYXJnaW5Cb3R0b206OH19PlBBR0VfTk9UX0xPQURFRDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTonc2VyaWYnLCBmb250U2l6ZToxOCwgbWFyZ2luQm90dG9tOjZ9fT57bGFiZWx9IFx1RDM5OFx1Qzc3NFx1QzlDMFx1Qjk3QyBcdUJEODhcdUI3RUNcdUM2MjRcdUM5QzAgXHVCQUJCXHVENTg4XHVDMkI1XHVCMkM4XHVCMkU0PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tmb250U2l6ZToxMiwgY29sb3I6JyM2NDc0OGInLCBtYXJnaW5Cb3R0b206MTh9fT5cdUMwQzhcdUI4NUNcdUFDRTBcdUNFNjggXHVENkM0XHVDNUQwXHVCM0M0IFx1QUMxOVx1Qzc0MCBcdUQ2NTRcdUJBNzRcdUM3NzQgXHVCQ0Y0XHVDNzc4XHVCMkU0XHVCQTc0IFx1QzdBMFx1QzJEQyBcdUQ2QzQgXHVCMkU0XHVDMkRDIFx1QzJEQ1x1QjNDNFx1RDU3NCBcdUM4RkNcdUMxMzhcdUM2OTQuPC9kaXY+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4geyB0cnkgeyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7IH0gY2F0Y2gge30gfX0gc3R5bGU9e3twYWRkaW5nOic4cHggMTZweCcsIGN1cnNvcjoncG9pbnRlcid9fT5cdUQzOThcdUM3NzRcdUM5QzAgXHVDMEM4XHVCODVDXHVBQ0UwXHVDRTY4PC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICAgIGNvbnN0IHBpY2sgPSAobmFtZSwgbGFiZWwpID0+IFdbbmFtZV0gfHwgZmFsbGJhY2sobGFiZWwpO1xuICAgIHN3aXRjaCAocm91dGUpIHtcbiAgICAgIGNhc2UgXCJob21lXCI6ICAgICAgeyBjb25zdCBDID0gcGljaygnSG9tZVBhZ2UnLCdcdUQ2NDgnKTsgICAgICByZXR1cm4gPEMgZ289e2dvfSB0d2Vha3M9e3R3ZWFrc30vPjsgfVxuICAgICAgY2FzZSBcImVhdFwiOiAgICAgICB7IGNvbnN0IEMgPSBwaWNrKCdFYXRQYWdlJywnXHVCQTM5XHVBQ0UwIFx1QjE4MFx1Qzc5MCcpOyByZXR1cm4gPEMgZ289e2dvfSB1c2VyPXt1c2VyfS8+OyB9XG4gICAgICBjYXNlIFwic2xlZXBcIjogICAgIHsgY29uc3QgQyA9IHBpY2soJ1NsZWVwUGFnZScsJ1x1Qzc5MFx1QUNFMCBcdUIxODBcdUM3OTAnKTsgcmV0dXJuIDxDIGdvPXtnb30gdXNlcj17dXNlcn0vPjsgfVxuICAgICAgY2FzZSBcInNob3BcIjogICAgICB7IGNvbnN0IEMgPSBwaWNrKCdTaG9wUGFnZScsJ1x1QzBBQ1x1QUNFMCBcdUIxODBcdUM3OTAnKTsgcmV0dXJuIDxDIGdvPXtnb30gdXNlcj17dXNlcn0vPjsgfVxuICAgICAgY2FzZSBcImNvbW11bml0eVwiOiB7IGNvbnN0IEMgPSBwaWNrKCdDb21tdW5pdHlQYWdlJywnXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwJyk7IHJldHVybiA8QyBnbz17Z299IHBvc3RJZD17cG9zdElkfSBzZXRQb3N0SWQ9e3NldFBvc3RJZH0gdXNlcj17dXNlcn0vPjsgfVxuICAgICAgY2FzZSBcInRvdXJcIjogICAgICB7IGNvbnN0IEMgPSBwaWNrKCdUb3VyUGFnZScsJ1x1RDIyQ1x1QzVCNCcpOyByZXR1cm4gPEMgZ289e2dvfSB1c2VyPXt1c2VyfS8+OyB9XG4gICAgICBjYXNlIFwibGVjdHVyZXNcIjogIHsgY29uc3QgQyA9IHBpY2soJ0xlY3R1cmVzUGFnZScsJ1x1QUMxNVx1QzVGMCcpOyByZXR1cm4gPEMgZ289e2dvfSB1c2VyPXt1c2VyfS8+OyB9XG4gICAgICBjYXNlIFwicHJpdmFjeVwiOiAgIHsgY29uc3QgQyA9IHBpY2soJ0xlZ2FsUGFnZScsJ1x1QzU3RFx1QUQwMCcpOyByZXR1cm4gPEMgZ289e2dvfSBzbHVnPVwicHJpdmFjeVwiLz47IH1cbiAgICAgIGNhc2UgXCJ0ZXJtc1wiOiAgICAgeyBjb25zdCBDID0gcGljaygnTGVnYWxQYWdlJywnXHVDNTdEXHVBRDAwJyk7IHJldHVybiA8QyBnbz17Z299IHNsdWc9XCJ0ZXJtc1wiLz47IH1cbiAgICAgIGNhc2UgXCJmYXFcIjogICAgICAgeyBjb25zdCBDID0gcGljaygnRmFxUGFnZScsJ1x1Qzc5MFx1QzhGQyBcdUJCM0JcdUIyOTQgXHVDOUM4XHVCQjM4Jyk7IHJldHVybiA8QyBnbz17Z299Lz47IH1cbiAgICAgIGNhc2UgXCJjb2x1bW5cIjogICAgeyBjb25zdCBDID0gcGljaygnQ29sdW1uUGFnZScsJ1x1Q0U3Q1x1QjdGQycpOyByZXR1cm4gPEMgZ289e2dvfSB1c2VyPXt1c2VyfS8+OyB9XG4gICAgICBjYXNlIFwiYm9va1wiOiAgICAgIHsgY29uc3QgQyA9IHBpY2soJ0Jvb2tQYWdlJywnXHVDQzQ1Jyk7IHJldHVybiA8QyBnbz17Z299IGNhcnQ9e2NhcnR9IHNldENhcnQ9e3NldENhcnR9IHVzZXI9e3VzZXJ9Lz47IH1cbiAgICAgIGNhc2UgXCJjaGVja291dFwiOiAgeyBjb25zdCBDID0gcGljaygnQ2hlY2tvdXRQYWdlJywnXHVBQ0IwXHVDODFDJyk7IHJldHVybiA8QyBnbz17Z299IGNhcnQ9e2NhcnR9IHVzZXI9e3VzZXJ9Lz47IH1cbiAgICAgIGNhc2UgXCJteXBhZ2VcIjogICAgeyBjb25zdCBDID0gcGljaygnTXlQYWdlJywnXHVCOUM4XHVDNzc0XHVEMzk4XHVDNzc0XHVDOUMwJyk7IHJldHVybiA8QyBnbz17Z299IHVzZXI9e3VzZXJ9IGNhcnQ9e2NhcnR9Lz47IH1cbiAgICAgIGNhc2UgXCJsb2dpblwiOlxuICAgICAgY2FzZSBcInNpZ251cFwiOiAgICB7IGNvbnN0IEMgPSBwaWNrKCdMb2dpblBhZ2UnLCdcdUI4NUNcdUFERjhcdUM3NzgnKTsgcmV0dXJuIDxDIGdvPXtnb30gc2V0VXNlcj17c2V0VXNlcn0vPjsgfVxuICAgICAgY2FzZSBcImFkbWluXCI6ICAgICB7XG4gICAgICAgIGlmICghdXNlcj8uaXNBZG1pbikgeyBjb25zdCBEID0gcGljaygnQWRtaW5EZW5pZWQnLCdcdUFEMDBcdUI5QUMnKTsgcmV0dXJuIDxEIGdvPXtnb30gdXNlcj17dXNlcn0vPjsgfVxuICAgICAgICBjb25zdCBDID0gcGljaygnQWRtaW5QYWdlJywnXHVBRDAwXHVCOUFDJyk7IHJldHVybiA8QyBnbz17Z299IHVzZXI9e3VzZXJ9Lz47XG4gICAgICB9XG4gICAgICAvLyB2MDAuMTQ1IFx1MjAxNCA0MDQ6IFx1QzU0QyBcdUMyMTggXHVDNUM2XHVCMjk0IFx1Qjc3Q1x1QzZCMFx1RDJCOFx1QjI5NCBob21lIFx1QzczQ1x1Qjg1QyBcdUQzRjRcdUJDMzFcdUQ1NThcdUM5QzAgXHVDNTRBXHVBQ0UwIEVycm9yNDA0UGFnZSBcdUIxNzhcdUNEOUMuXG4gICAgICBkZWZhdWx0OiAgICAgICAgICB7IGNvbnN0IEMgPSBwaWNrKCdFcnJvcjQwNFBhZ2UnLCdcdUM2MjRcdUI5NTgnKTsgcmV0dXJuIDxDIGdvPXtnb30vPjsgfVxuICAgIH1cbiAgfTtcbiAgLy8gXHVEMzk4XHVDNzc0XHVDOUMwXHVCQ0M0IFx1QzVEMFx1QjdFQyBcdUJDMTRcdUM2QjRcdUIzNTRcdUI5QUMgXHUyMDE0IFx1RDU1QyBcdUQzOThcdUM3NzRcdUM5QzBcdUFDMDAgXHVCMzU4XHVDOUM0IFx1QzYyNFx1Qjk1OFx1QUMwMCBcdUM4MDRcdUM1RURcdUM3M0NcdUI4NUMgXHVCQzg4XHVDOUMwXHVDOUMwIFx1QzU0QVx1QUM4Qy4ga2V5PXJvdXRlIFx1Qjg1QyBcdUI3N0NcdUM2QjBcdUQyQjggXHVCQ0MwXHVBQ0JEIFx1QzJEQyBcdUM3OTBcdUIzRDkgcmVzZXQuXG4gIGNvbnN0IHBhZ2UgPSA8UGFnZUVycm9yQm91bmRhcnkga2V5PXtyb3V0ZX0gcm91dGU9e3JvdXRlfSBnbz17Z299PntyZW5kZXJQYWdlKCl9PC9QYWdlRXJyb3JCb3VuZGFyeT47XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcFwiPlxuICAgICAgey8qIHYwMC4xNDMgXHUyMDE0IFx1QzBBQ1x1Qzc3NFx1RDJCOCBcdUM2MjRcdUQ1MDggXHVDNTQ4XHVCMEI0IFx1QkMzMFx1QjEwOC4gXHVCQTU0XHVCMjc0IFx1QzcwNFx1Q0FCRCBzaXRld2lkZS4gXHVDMEFDXHVDNkE5XHVDNzkwIFx1QzY5NFx1Q0NBRCAnXHVCQTU0XHVCMjc0IFx1QzcwNFx1Q0FCRFx1QzVEMCcgKyBcdUMwQzggXHVCQjM4XHVBRDZDLiAqL31cbiAgICAgIHshaGlkZU5hdiAmJiAoXG4gICAgICAgIDxkaXYgcm9sZT1cInN0YXR1c1wiIGFyaWEtbGFiZWw9XCJcdUMwQUNcdUM3NzRcdUQyQjggXHVDNjI0XHVENTA4IFx1QzU0OFx1QjBCNFwiIHN0eWxlPXt7XG4gICAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMjQ1LCAyMTMsIDcyLCAwLjEyKScsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHZhcigtLWdvbGQtZGltLCAjQzlBNjMyKScsXG4gICAgICAgICAgY29sb3I6ICd2YXIoLS1pbmssICMwRjE3MkEpJyxcbiAgICAgICAgICBwYWRkaW5nOiAnMTBweCAxNnB4JyxcbiAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjU1LFxuICAgICAgICB9fT5cbiAgICAgICAgICBcdUQ4M0NcdURGMzEgPHN0cm9uZz5cdUQ2NDhcdUQzOThcdUM3NzRcdUM5QzBcdUI5N0MgXHVDNjI0XHVENTA4XHVENTVDIFx1QzlDMCBcdUM1QkNcdUI5QzggXHVCNDE4XHVDOUMwIFx1QzU0QVx1QzU1OFx1QzJCNVx1QjJDOFx1QjJFNC48L3N0cm9uZz57JyAnfVxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yXCI+XHVDNzc0XHVDNkE5XHVDNUQwIFx1QkQ4OFx1RDNCOFx1RDU1OFx1QzJFMCBcdUM4MTBcdUM3NzQgXHVDNzg4XHVCMkU0XHVCQTc0IDxzdHJvbmc+XHVDNjU1XHVDMEFDXHVCNEU0IFx1QzYyNFx1RDUwOFx1RDFBMVx1QkMyOTwvc3Ryb25nPlx1QzVEMCBcdUM1NENcdUI4MjRcdUM4RkNcdUMxMzhcdUM2OTQgXHUyMDE0IFx1QUNDNFx1QzE4RCBcdUM1QzVcdUIzNzBcdUM3NzRcdUQyQjhcdUQ1NzQgXHVCMDk4XHVBQzAwXHVBQ0EwXHVDMkI1XHVCMkM4XHVCMkU0LiBcdUQ2MDRcdUM3QUMgPHN0cm9uZz5QQyBcdUJDODRcdUM4MDQgXHVDRDVDXHVDODAxXHVENjU0PC9zdHJvbmc+XHVCODVDIFx1QzgxQ1x1Qzc5MVx1QjQxOFx1QzVCNCBcdUM3ODhcdUMyQjVcdUIyQzhcdUIyRTQuPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICA8TmF2IHJvdXRlPXtyb3V0ZX0gZ289e2dvfSB1c2VyPXt1c2VyfSBvbkxvZ291dD17bG9nb3V0fS8+XG4gICAgICA8bWFpbiBpZD1cIm1haW5cIiB0YWJJbmRleD1cIi0xXCIgc3R5bGU9e3tmbGV4OjEsIG91dGxpbmU6J25vbmUnfX0gYXJpYS1sYWJlbD17YCR7cm91dGV9IFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUJDRjhcdUJCMzhgfT57cGFnZX08L21haW4+XG4gICAgICB7IWhpZGVOYXYgJiYgPEZvb3RlciBnbz17Z299Lz59XG4gICAgICA8VHdlYWtzIHR3ZWFrcz17dHdlYWtzfSBzZXRUd2Vha3M9e3VwZGF0ZVR3ZWFrc30gdmlzaWJsZT17ZWRpdE1vZGV9Lz5cbiAgICAgIDxTY3JvbGxUb1RvcC8+XG4gICAgICA8Q29va2llQ29uc2VudC8+XG4gICAgICA8R2xvYmFsRXJyb3JUb2FzdC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCByb290ID0gUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKTtcbnJvb3QucmVuZGVyKDxBcHBFcnJvckJvdW5kYXJ5PjxBcHAvPjwvQXBwRXJyb3JCb3VuZGFyeT4pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBR0EsTUFBTSx5QkFBeUIsTUFBTSxVQUFVO0FBQUEsRUFDN0MsWUFBWSxPQUFPO0FBQUUsVUFBTSxLQUFLO0FBQUcsU0FBSyxRQUFRLEVBQUUsT0FBTyxNQUFNLE1BQU0sS0FBSztBQUFBLEVBQUc7QUFBQSxFQUM3RSxPQUFPLHlCQUF5QixLQUFLO0FBQUUsV0FBTyxFQUFFLE9BQU8sSUFBSTtBQUFBLEVBQUc7QUFBQSxFQUM5RCxrQkFBa0IsS0FBSyxNQUFNO0FBTi9CO0FBT0ksU0FBSyxTQUFTLEVBQUUsS0FBSyxDQUFDO0FBQ3RCLFFBQUk7QUFBRSxjQUFRLE1BQU0sc0JBQXNCLEtBQUssSUFBSTtBQUFBLElBQUcsU0FBUTtBQUFBLElBQUM7QUFFL0QsUUFBSTtBQUNGLHFDQUFPLGFBQVAsbUJBQWlCLGFBQWpCLG1CQUEyQixPQUFPO0FBQUEsUUFDaEMsT0FBTSwyQkFBSyxXQUFTLDJCQUFLLFNBQVE7QUFBQSxRQUNqQyxRQUFRO0FBQUEsUUFBTSxNQUFN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QUEsTUFBSTtBQUFBLE1BQ25HLEtBQUs7QUFBQSxNQUNMLEtBQUssVUFBYTtBQUFFLGNBQU0sSUFBSSxLQUFLLGFBQVksb0JBQUs7QUFBRyxlQUFPLG9DQUFDLEtBQUUsSUFBUSxTQUFpQjtBQUFBLE1BQUk7QUFBQSxNQUM5RixLQUFLLFNBQWE7QUFDaEIsWUFBSSxFQUFDLDZCQUFNLFVBQVM7QUFBRSxnQkFBTSxJQUFJLEtBQUssZUFBYyxjQUFJO0FBQUcsaUJBQU8sb0NBQUMsS0FBRSxJQUFRLE1BQVc7QUFBQSxRQUFJO0FBQzNGLGNBQU0sSUFBSSxLQUFLLGFBQVksY0FBSTtBQUFHLGVBQU8sb0NBQUMsS0FBRSxJQUFRLE1BQVc7QUFBQSxNQUNqRTtBQUFBO0FBQUEsTUFFQSxTQUFrQjtBQUFFLGNBQU0sSUFBSSxLQUFLLGdCQUFlLGNBQUk7QUFBRyxlQUFPLG9DQUFDLEtBQUUsSUFBTztBQUFBLE1BQUk7QUFBQSxJQUNoRjtBQUFBLEVBQ0Y7QUFFQSxRQUFNLE9BQU8sb0NBQUMscUJBQWtCLEtBQUssT0FBTyxPQUFjLE1BQVMsV0FBVyxDQUFFO0FBRWhGLFNBQ0Usb0NBQUMsU0FBSSxXQUFVLFNBRVosQ0FBQyxXQUNBLG9DQUFDLFNBQUksTUFBSyxVQUFTLGNBQVcsZ0RBQVksT0FBTztBQUFBLElBQy9DLFlBQVk7QUFBQSxJQUNaLGNBQWM7QUFBQSxJQUNkLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxFQUNkLEtBQUcsY0FDRSxvQ0FBQyxnQkFBTyxvSEFBd0IsR0FBVSxLQUM3QyxvQ0FBQyxVQUFLLFdBQVUsV0FBUSxnRkFBZ0Isb0NBQUMsZ0JBQU8sNkNBQVEsR0FBUyxnSkFBOEIsb0NBQUMsZ0JBQU8sb0NBQVMsR0FBUywyREFBWSxDQUN2SSxHQUVGLG9DQUFDLE9BQUksT0FBYyxJQUFRLE1BQVksVUFBVSxRQUFPLEdBQ3hELG9DQUFDLFVBQUssSUFBRyxRQUFPLFVBQVMsTUFBSyxPQUFPLEVBQUMsTUFBSyxHQUFHLFNBQVEsT0FBTSxHQUFHLGNBQVksR0FBRyxLQUFLLHNDQUFZLElBQUssR0FDbkcsQ0FBQyxXQUFXLG9DQUFDLFVBQU8sSUFBTyxHQUM1QixvQ0FBQyxVQUFPLFFBQWdCLFdBQVcsY0FBYyxTQUFTLFVBQVMsR0FDbkUsb0NBQUMsaUJBQVcsR0FDWixvQ0FBQyxtQkFBYSxHQUNkLG9DQUFDLHNCQUFnQixDQUNuQjtBQUVKO0FBRUEsTUFBTSxPQUFPLFNBQVMsV0FBVyxTQUFTLGVBQWUsTUFBTSxDQUFDO0FBQ2hFLEtBQUssT0FBTyxvQ0FBQyx3QkFBaUIsb0NBQUMsU0FBRyxDQUFFLENBQW1COyIsCiAgIm5hbWVzIjogWyJlIiwgIl9hIiwgIl9iIiwgIl9jIiwgIl9kIiwgIl9lIiwgIl9mIiwgIl9nIiwgIl9oIiwgIl9pIiwgIl9qIiwgIl9rIiwgIl9sIl0KfQo=

})();

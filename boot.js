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
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      const d = msg == null ? void 0 : msg.domain;
      try {
        if (d === "lectures") await ((_b = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.refresh) == null ? void 0 : _b.call(_a2, { includeHidden: false }));
        else if (d === "tours") await ((_d = (_c = window.BGNJ_TOURS) == null ? void 0 : _c.refresh) == null ? void 0 : _d.call(_c, { includeHidden: false }));
        else if (d === "columns") await ((_f = (_e = window.BGNJ_COLUMNS) == null ? void 0 : _e.refresh) == null ? void 0 : _f.call(_e));
        else if (d === "posts") await ((_h = (_g = window.BGNJ_COMMUNITY) == null ? void 0 : _g.refreshPosts) == null ? void 0 : _h.call(_g));
        else if (d === "books") await ((_j = (_i = window.BGNJ_BOOKS) == null ? void 0 : _i.refresh) == null ? void 0 : _j.call(_i));
        else if (d === "site-content") await ((_l = (_k = window.BGNJ_SITE_CONTENT) == null ? void 0 : _k.refresh) == null ? void 0 : _l.call(_k));
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYm9vdC5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdTIwMTQgXHVCRDgwXHVEMkI4XHVDMkE0XHVEMkI4XHVCN0E5IChBcHAgKyBBcHBFcnJvckJvdW5kYXJ5ICsgUmVhY3RET00ucmVuZGVyKVxuLy8gdjAwLjA3MSBcdTIwMTQgaW5kZXguaHRtbCBcdUM3NTggXHVDNzc4XHVCNzdDXHVDNzc4IDxzY3JpcHQgdHlwZT1cInRleHQvYmFiZWxcIj4gXHVCRTE0XHVCODVEXHVDNzQ0IFx1QkQ4NFx1QjlBQy4gZXNidWlsZCBcdUMwQUNcdUM4MDQgXHVDRUY0XHVEMzBDXHVDNzdDLlxuLy8gXHVDODA0XHVDQ0I0IFx1QzU3MSBcdUM1RDBcdUI3RUMgXHVCQzE0XHVDNkI0XHVCMzU0XHVCOUFDIFx1MjAxNCBcdUQ3NzAgXHVENjU0XHVCQTc0IFx1QkMyOVx1QzlDMCArIFx1QzgxNVx1RDY1NVx1RDU1QyBcdUM5QzRcdUIyRTggXHVDODE1XHVCQ0Y0IFx1QjE3OFx1Q0Q5Qy5cbmNsYXNzIEFwcEVycm9yQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsLCBpbmZvOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVyciwgaW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpbmZvIH0pO1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tBcHBFcnJvckJvdW5kYXJ5XScsIGVyciwgaW5mbyk7IH0gY2F0Y2gge31cbiAgICAvLyBcdUI4MENcdUIzNTRcdUI5QzEgXHVDNjI0XHVCOTU4XHVCM0M0IFx1QzExQ1x1QkM4NFx1QzVEMCBcdUFFMzBcdUI4NUQuXG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6IGVycj8uY29kZSB8fCAoZXJyPy5uYW1lIHx8ICdSRU5ERVJfRVJST1InKSxcbiAgICAgICAgc3RhdHVzOiBudWxsLCBraW5kOiAncmVuZGVyJyxcbiAgICAgICAgbWVzc2FnZTogZXJyPy5tZXNzYWdlIHx8IFN0cmluZyhlcnIpLFxuICAgICAgICBoaW50OiAnJywgdXJsOiAnJyxcbiAgICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLCBvcmlnaW46IGxvY2F0aW9uLm9yaWdpbixcbiAgICAgIH0pPy5jYXRjaD8uKCgpID0+IHt9KTtcbiAgICB9IGNhdGNoIHt9XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICBjb25zdCBlID0gdGhpcy5zdGF0ZS5lcnJvcjtcbiAgICAgIGNvbnN0IGNvZGUgPSBlPy5jb2RlIHx8IChlPy5zdGF0dXMgPyBgSFRUUF8ke2Uuc3RhdHVzfWAgOiAoZT8ubmFtZSB8fCAnUkVOREVSX0VSUk9SJykpO1xuICAgICAgY29uc3QgcmVhc29uID0gZT8ubWVzc2FnZSB8fCBTdHJpbmcoZSk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7cGFkZGluZzo0MCwgZm9udEZhbWlseTonbW9ub3NwYWNlJywgY29sb3I6JyMxZjI5MzcnLCBiYWNrZ3JvdW5kOicjZjhmYWZjJywgbWluSGVpZ2h0OicxMDB2aCd9fT5cbiAgICAgICAgICA8aDIgc3R5bGU9e3tjb2xvcjonI2RjMjYyNicsIG1hcmdpbkJvdHRvbToxMn19Plx1MjZBMCBcdUQzOThcdUM3NzRcdUM5QzAgXHVCODBDXHVCMzU0XHVCOUMxIFx1QzYyNFx1Qjk1ODwvaDI+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDonI2ZmZicsIHBhZGRpbmc6JzE0cHggMTZweCcsIGJvcmRlcjonMXB4IHNvbGlkICNmZWNhY2EnLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOjEyLCBmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIGNvbG9yOicjMWYyOTM3JyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tjb2xvcjonI2RjMjYyNicsIGZvbnRTaXplOjExLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBtYXJnaW5Cb3R0b206Nn19PlxuICAgICAgICAgICAgICBDT0RFIFx1MDBCNyB7Y29kZX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRXZWlnaHQ6NjAwLCBtYXJnaW5Cb3R0b206OH19PntyZWFzb259PC9kaXY+XG4gICAgICAgICAgICB7ZT8uc3RhY2sgJiYgKFxuICAgICAgICAgICAgICA8ZGV0YWlscyBzdHlsZT17e21hcmdpblRvcDo4fX0+XG4gICAgICAgICAgICAgICAgPHN1bW1hcnkgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknfX0+XHVDMkE0XHVEMEREIFx1Q0Q5NFx1QzgwMSAoXHVBQzFDXHVCQzFDXHVDNzkwXHVDNkE5KTwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgICA8cHJlIHN0eWxlPXt7d2hpdGVTcGFjZToncHJlLXdyYXAnLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknLCBtYXJnaW5Ub3A6OH19PntlLnN0YWNrfTwvcHJlPlxuICAgICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaW5mbz8uY29tcG9uZW50U3RhY2sgJiYgKFxuICAgICAgICAgICAgICA8ZGV0YWlscyBzdHlsZT17e21hcmdpblRvcDo4fX0+XG4gICAgICAgICAgICAgICAgPHN1bW1hcnkgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknfX0+XHVDRUY0XHVEM0VDXHVCMTBDXHVEMkI4IFx1QzJBNFx1RDBERCAoXHVBQzFDXHVCQzFDXHVDNzkwXHVDNkE5KTwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgICA8cHJlIHN0eWxlPXt7d2hpdGVTcGFjZToncHJlLXdyYXAnLCBmb250U2l6ZToxMSwgY29sb3I6JyM0NzU1NjknLCBtYXJnaW5Ub3A6OH19Pnt0aGlzLnN0YXRlLmluZm8uY29tcG9uZW50U3RhY2t9PC9wcmU+XG4gICAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHtlcnJvcjpudWxsLCBpbmZvOm51bGx9KX0gc3R5bGU9e3twYWRkaW5nOic4cHggMTZweCcsIGN1cnNvcjoncG9pbnRlcid9fT5cdUIyRTRcdUMyREMgXHVDMkRDXHVCM0M0PC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpOyB9IGNhdGNoIHt9IH19IHN0eWxlPXt7cGFkZGluZzonOHB4IDE2cHgnLCBjdXJzb3I6J3BvaW50ZXInfX0+XHVEMzk4XHVDNzc0XHVDOUMwIFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2ODwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxwIHN0eWxlPXt7bWFyZ2luVG9wOjEyLCBmb250U2l6ZToxMSwgY29sb3I6JyM2NDc0OGInfX0+XHUyNEQ4IFx1Q0Q5NFx1QUMwMCBcdUM4MTVcdUJDRjRcdUIyOTQgXHVCRTBDXHVCNzdDXHVDNkIwXHVDODAwIFx1QUMxQ1x1QkMxQ1x1Qzc5MCBcdUIzQzRcdUFENkMoRjEyKSBcdUNGNThcdUMxOTRcdUM1RDBcdUMxMUMgXHVENjU1XHVDNzc4XHVENTYwIFx1QzIxOCBcdUM3ODhcdUMyQjVcdUIyQzhcdUIyRTQuPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59XG5cbi8vIFx1RDM5OFx1Qzc3NFx1QzlDMFx1QkNDNCBcdUM1RDBcdUI3RUMgXHVCQzE0XHVDNkI0XHVCMzU0XHVCOUFDIFx1MjAxNCBcdUQ1NUMgXHVEMzk4XHVDNzc0XHVDOUMwXHVDNUQwXHVDMTFDIFx1QjM1OFx1QzlDNCBcdUM2MjRcdUI5NThcdUFDMDAgXHVDODA0XHVDNUVEIFx1RDJCOFx1QjlBQ1x1Qjk3QyBcdUFFNjhcdUI3MjhcdUI5QUNcdUM5QzAgXHVDNTRBXHVCM0M0XHVCODVEIFx1QUNBOVx1QjlBQy5cbi8vIHJvdXRlIFx1QUMwMCBcdUJDMTRcdUIwMENcdUJBNzQgXHVDNzkwXHVCM0Q5IHJlc2V0IChrZXkgcHJvcCBcdUM3M0NcdUI4NUMgXHVBQzE1XHVDODFDIHJlbW91bnQpLlxuY2xhc3MgUGFnZUVycm9yQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVyciwgaW5mbykge1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tQYWdlRXJyb3JCb3VuZGFyeV0nLCB0aGlzLnByb3BzLnJvdXRlLCBlcnIsIGluZm8pOyB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6IGVycj8uY29kZSB8fCAoZXJyPy5uYW1lIHx8ICdQQUdFX1JFTkRFUl9FUlJPUicpLFxuICAgICAgICBzdGF0dXM6IG51bGwsIGtpbmQ6ICdyZW5kZXInLFxuICAgICAgICBtZXNzYWdlOiBlcnI/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVyciksXG4gICAgICAgIGhpbnQ6IGByb3V0ZT0ke3RoaXMucHJvcHMucm91dGV9YCwgdXJsOiAnJyxcbiAgICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLCBvcmlnaW46IGxvY2F0aW9uLm9yaWdpbixcbiAgICAgIH0pPy5jYXRjaD8uKCgpID0+IHt9KTtcbiAgICB9IGNhdGNoIHt9XG4gIH1cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmIChwcmV2UHJvcHMucm91dGUgIT09IHRoaXMucHJvcHMucm91dGUgJiYgdGhpcy5zdGF0ZS5lcnJvcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiBudWxsIH0pO1xuICAgIH1cbiAgfVxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIGNvbnN0IGUgPSB0aGlzLnN0YXRlLmVycm9yO1xuICAgICAgY29uc3QgY29kZSA9IGU/LmNvZGUgfHwgKGU/LnN0YXR1cyA/IGBIVFRQXyR7ZS5zdGF0dXN9YCA6IChlPy5uYW1lIHx8ICdQQUdFX1JFTkRFUl9FUlJPUicpKTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOjQ4LCBmb250RmFtaWx5OidzYW5zLXNlcmlmJywgbWluSGVpZ2h0Oic2MHZoJywgdGV4dEFsaWduOidjZW50ZXInfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J21vbm9zcGFjZScsIGZvbnRTaXplOjExLCBjb2xvcjonI2RjMjYyNicsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIG1hcmdpbkJvdHRvbTo4fX0+e2NvZGV9PC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjE4LCBjb2xvcjonIzBmMTcyYScsIG1hcmdpbkJvdHRvbTo4LCBmb250V2VpZ2h0OjYwMH19Plx1Qzc3NCBcdUQzOThcdUM3NzRcdUM5QzBcdUI5N0MgXHVCRDg4XHVCN0VDXHVDNjI0XHVCMzU4IFx1QzkxMSBcdUM2MjRcdUI5NThcdUFDMDAgXHVCQzFDXHVDMEREXHVENTg4XHVDMkI1XHVCMkM4XHVCMkU0PC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjEzLCBjb2xvcjonIzQ3NTU2OScsIG1hcmdpbkJvdHRvbToxOCwgbWF4V2lkdGg6NTIwLCBtYXJnaW46JzAgYXV0byAxOHB4JywgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICAgIHtlPy5tZXNzYWdlIHx8ICdcdUM1NEMgXHVDMjE4IFx1QzVDNlx1QjI5NCBcdUM2MjRcdUI5NTgnfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidpbmxpbmUtZmxleCcsIGdhcDo4fX0+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogbnVsbCB9KX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMHB4IDE4cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBib3JkZXI6JzFweCBzb2xpZCAjY2JkNWUxJywgYmFja2dyb3VuZDonI2ZmZid9fT5cdUIyRTRcdUMyREMgXHVDMkRDXHVCM0M0PC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgdGhpcy5wcm9wcy5nbygnaG9tZScpOyB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IG51bGwgfSk7IH0gY2F0Y2gge30gfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMHB4IDE4cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBib3JkZXI6JzFweCBzb2xpZCAjY2JkNWUxJywgYmFja2dyb3VuZDonI2ZmZid9fT5cdUQ2NDhcdUM3M0NcdUI4NUM8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4geyB0cnkgeyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7IH0gY2F0Y2gge30gfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMHB4IDE4cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBib3JkZXI6JzFweCBzb2xpZCAjZjVkNTQ4JywgYmFja2dyb3VuZDonI2Y1ZDU0OCcsIGNvbG9yOicjMGYxNzJhJywgZm9udFdlaWdodDo2MDB9fT5cdUMwQzhcdUI4NUNcdUFDRTBcdUNFNjg8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbjtcbiAgfVxufVxuXG4vLyBcdUM4MDRcdUM1RUQgXHVCQkY4XHVDQzk4XHVCOUFDIFx1QzYyNFx1Qjk1OCBcdUQxQTBcdUMyQTRcdUQyQjggXHUyMDE0IFx1QkU0NFx1QjNEOVx1QUUzMC9Qcm9taXNlIFx1QUM3MFx1QkQ4MFx1QzY0MCBcdUM3OTBcdUM2RDAgXHVCODVDXHVCNERDIFx1QzJFNFx1RDMyOFx1QUU0Q1x1QzlDMCBcdUNFQTFcdUNDOTguXG4vLyBcdUJBQThcdUI0RTAgXHVDNjI0XHVCOTU4XHVCMjk0IFx1QzExQ1x1QkM4NChEMS5lcnJvcl9sb2cpIFx1QzVEMCBcdUM3OTBcdUIzRDkgXHVBRTMwXHVCODVEICsgMTBcdUNEMDggXHVENkM0IFx1Qzc5MFx1QjNEOSBcdUMxOENcdUFDNzAuXG5jb25zdCBUT0FTVF9ESVNNSVNTX01TID0gMTAwMDA7XG4vLyBcdUJCMzRcdUQ1NUMgXHVCOEU4XHVENTA0IFx1QUMwMFx1QjREQyBcdTIwMTQgZXJyb3ItbG9nIFx1QzVENFx1QjREQ1x1RDNFQ1x1Qzc3OFx1RDJCOCBcdUQ2MzhcdUNEOUMgXHVDNzkwXHVDQ0I0XHVBQzAwIFx1QzJFNFx1RDMyOFx1RDU2MCBcdUI1NEMgXHVCNjEwIFx1RDFBMFx1QzJBNFx1RDJCOFx1MjE5MnJlcG9ydFx1MjE5MmZhaWwgXHVBQzAwIFx1QkMxOFx1QkNGNVx1QjQxOFx1QjI5NCBcdUFDODNcdUM3NDQgXHVDQzI4XHVCMkU4LlxubGV0IF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTtcbmNvbnN0IHJlcG9ydEVycm9yVG9TZXJ2ZXIgPSAoZW50cnkpID0+IHtcbiAgaWYgKF9fcmVwb3J0aW5nRXJyb3IpIHJldHVybjtcbiAgLy8gZXJyb3ItbG9nIFx1QzVENFx1QjREQ1x1RDNFQ1x1Qzc3OFx1RDJCOCBcdUQ2MzhcdUNEOUMgXHVDNzkwXHVDQ0I0XHVDNUQwXHVDMTFDIFx1QkMxQ1x1QzBERFx1RDU1QyBcdUM2MjRcdUI5NThcdUIyOTQgXHVCQ0Y0XHVBQ0UwIFx1QjMwMFx1QzBDMVx1QzVEMFx1QzExQyBcdUM4MUNcdUM2NzguXG4gIGlmICh0eXBlb2YgZW50cnkudXJsID09PSAnc3RyaW5nJyAmJiBlbnRyeS51cmwuaW5jbHVkZXMoJy9hcGkvZXJyb3ItbG9nJykpIHJldHVybjtcbiAgX19yZXBvcnRpbmdFcnJvciA9IHRydWU7XG4gIHRyeSB7XG4gICAgY29uc3QgcCA9IHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICBjb2RlOiBlbnRyeS5jb2RlLCBzdGF0dXM6IGVudHJ5LnN0YXR1cywga2luZDogZW50cnkua2luZCxcbiAgICAgIG1lc3NhZ2U6IGVudHJ5Lm1lc3NhZ2UsIGhpbnQ6IGVudHJ5LmhpbnQsIHVybDogZW50cnkudXJsLFxuICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLCBvcmlnaW46IGxvY2F0aW9uLm9yaWdpbixcbiAgICB9KTtcbiAgICBpZiAocCAmJiB0eXBlb2YgcC5jYXRjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcC5jYXRjaCgoKSA9PiB7fSkuZmluYWxseSgoKSA9PiB7IF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTtcbiAgICB9XG4gIH0gY2F0Y2gge1xuICAgIF9fcmVwb3J0aW5nRXJyb3IgPSBmYWxzZTtcbiAgfVxufTtcbmNvbnN0IEdsb2JhbEVycm9yVG9hc3QgPSAoKSA9PiB7XG4gIGNvbnN0IFtlcnJvcnMsIHNldEVycm9yc10gPSBSZWFjdC51c2VTdGF0ZShbXSk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcHVzaCA9IChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgaWQgPSBEYXRlLm5vdygpICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIHNldEVycm9ycygocHJldikgPT4gWy4uLnByZXYsIHsgaWQsIC4uLmVudHJ5IH1dLnNsaWNlKC0zKSk7XG4gICAgICByZXBvcnRFcnJvclRvU2VydmVyKGVudHJ5KTtcbiAgICAgIC8vIDEwXHVDRDA4IFx1RDZDNCBcdUM3OTBcdUIzRDkgXHVDMThDXHVBQzcwLlxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHNldEVycm9ycygocHJldikgPT4gcHJldi5maWx0ZXIoKGUpID0+IGUuaWQgIT09IGlkKSk7XG4gICAgICB9LCBUT0FTVF9ESVNNSVNTX01TKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVqZWN0aW9uID0gKGV2KSA9PiB7XG4gICAgICBjb25zdCByID0gZXY/LnJlYXNvbjtcbiAgICAgIGlmICghcikgcmV0dXJuO1xuICAgICAgY29uc3QgY29kZSA9IHIuY29kZSB8fCAoci5zdGF0dXMgPyBgSFRUUF8ke3Iuc3RhdHVzfWAgOiAoci5uYW1lIHx8ICdQUk9NSVNFX1JFSkVDVElPTicpKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSByLm1lc3NhZ2UgfHwgU3RyaW5nKHIpO1xuICAgICAgcHVzaCh7IGNvZGUsIHN0YXR1czogci5zdGF0dXMgfHwgbnVsbCwgbWVzc2FnZSwgaGludDogci5oaW50IHx8ICcnLCB1cmw6IHIudXJsIHx8ICcnLCBraW5kOiByLmtpbmQgfHwgJ3Vua25vd24nIH0pO1xuICAgICAgdHJ5IHsgY29uc29sZS5lcnJvcignW0dsb2JhbEVycm9yVG9hc3RdJywgcik7IH0gY2F0Y2gge31cbiAgICB9O1xuICAgIGNvbnN0IG9uRXJyb3IgPSAoZXYpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBldj8ubWVzc2FnZSB8fCBldj8uZXJyb3I/Lm1lc3NhZ2UgfHwgJ1NjcmlwdCBlcnJvcic7XG4gICAgICBwdXNoKHsgY29kZTogJ1dJTkRPV19FUlJPUicsIHN0YXR1czogbnVsbCwgbWVzc2FnZSwgaGludDogJycsIHVybDogZXY/LmZpbGVuYW1lIHx8ICcnLCBraW5kOiAndW5rbm93bicgfSk7XG4gICAgICB0cnkgeyBjb25zb2xlLmVycm9yKCdbR2xvYmFsRXJyb3JUb2FzdF0nLCBldj8uZXJyb3IgfHwgZXYpOyB9IGNhdGNoIHt9XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgb25SZWplY3Rpb24pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgb25SZWplY3Rpb24pO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgfTtcbiAgfSwgW10pO1xuICBjb25zdCBkaXNtaXNzID0gKGlkKSA9PiBzZXRFcnJvcnMoKHByZXYpID0+IHByZXYuZmlsdGVyKChlKSA9PiBlLmlkICE9PSBpZCkpO1xuICBpZiAoIWVycm9ycy5sZW5ndGgpIHJldHVybiBudWxsO1xuICByZXR1cm4gKFxuICAgIDxkaXYgYXJpYS1saXZlPVwicG9saXRlXCIgc3R5bGU9e3tcbiAgICAgIHBvc2l0aW9uOidmaXhlZCcsIHJpZ2h0OjE2LCBib3R0b206MTYsIHpJbmRleDoyMDAwLFxuICAgICAgZGlzcGxheTonZmxleCcsIGZsZXhEaXJlY3Rpb246J2NvbHVtbicsIGdhcDo4LCBtYXhXaWR0aDo0MjAsXG4gICAgfX0+XG4gICAgICB7ZXJyb3JzLm1hcCgoZSkgPT4gKFxuICAgICAgICA8ZGl2IGtleT17ZS5pZH0gcm9sZT1cImFsZXJ0XCIgc3R5bGU9e3tcbiAgICAgICAgICBiYWNrZ3JvdW5kOicjZmZmJywgYm9yZGVyOicxcHggc29saWQgI2MyNGEzZCcsIGJveFNoYWRvdzonMCA4cHggMjRweCByZ2JhKDAsMCwwLDAuMTQpJyxcbiAgICAgICAgICBwYWRkaW5nOicxMnB4IDE0cHgnLCBmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIGNvbG9yOicjMWUyOTNiJyxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDoxMiwgbWFyZ2luQm90dG9tOjR9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7Zm9udEZhbWlseTonbW9ub3NwYWNlJywgZm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMTRlbScsIGNvbG9yOicjYzI0YTNkJ319PlxuICAgICAgICAgICAgICB7ZS5jb2RlfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZGlzbWlzcyhlLmlkKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidub25lJywgYm9yZGVyOidub25lJywgY3Vyc29yOidwb2ludGVyJywgY29sb3I6JyM5NGEzYjgnLCBmb250U2l6ZToxNH19XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJcdUIyRUJcdUFFMzBcIj5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFdlaWdodDo2MDAsIG1hcmdpbkJvdHRvbTplLmhpbnQgPyA0IDogMH19PntlLm1lc3NhZ2V9PC9kaXY+XG4gICAgICAgICAge2UuaGludCAmJiA8ZGl2IHN0eWxlPXt7Y29sb3I6JyM0NzU1NjknLCBmb250U2l6ZToxMn19PntlLmhpbnR9PC9kaXY+fVxuICAgICAgICAgIHtlLnVybCAmJiA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTonbW9ub3NwYWNlJywgZm9udFNpemU6MTAsIGNvbG9yOicjOTRhM2I4JywgbWFyZ2luVG9wOjYsIHdvcmRCcmVhazonYnJlYWstYWxsJ319PntlLnVybH08L2Rpdj59XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBUV0VBS19ERUZBVUxUUyA9IC8qRURJVE1PREUtQkVHSU4qL3tcbiAgXCJsaW5lU3R5bGVcIjogXCJvdXRsaW5lXCIsXG4gIFwiaW50ZW5zaXR5XCI6IDEsXG4gIFwiaGVyb0xheW91dFwiOiBcImNlbnRlclwiLFxuICBcImludGVyYWN0aXZlXCI6IHRydWVcbn0vKkVESVRNT0RFLUVORCovO1xuXG4vLyBVUkwgXHVBQ0JEXHVCODVDIFx1MjE5NCBcdUI3N0NcdUM2QjBcdUQyQjggXHVEMEE0IFx1QjlFNFx1RDU1MS5cbi8vIFx1QzU0Q1x1QjgyNFx1QzlDNCBcdUI3N0NcdUM2QjBcdUQyQjhcdUI5Q0MgXHVENjU0XHVDNzc0XHVEMkI4XHVCOUFDXHVDMkE0XHVEMkI4XHVCODVDIFx1QkMxQlx1QzU0NCBcdUM1NDhcdUM4MDRcdUQ1NThcdUFDOEMgXHVEM0Y0XHVCQzMxXHVENTVDXHVCMkU0KGhvbWUpLlxuY29uc3QgVkFMSURfUk9VVEVTID0gWydob21lJywnY29tbXVuaXR5JywnbGVjdHVyZXMnLCd0b3VyJywnY29sdW1uJywnYm9vaycsJ2NoZWNrb3V0JywnbXlwYWdlJywnYWRtaW4nLCdsb2dpbicsJ3NpZ251cCcsJ2ZhcScsJ3Rlcm1zJywncHJpdmFjeScsJ2VhdCcsJ3NsZWVwJywnc2hvcCddO1xuY29uc3QgcGF0aFRvUm91dGUgPSAocGF0aG5hbWUpID0+IHtcbiAgY29uc3QgcCA9IChwYXRobmFtZSB8fCAnLycpLnJlcGxhY2UoL1xcLyskLywgJycpIHx8ICcvJztcbiAgaWYgKHAgPT09ICcvJykgcmV0dXJuICdob21lJztcbiAgY29uc3Qgc2VnID0gcC5yZXBsYWNlKC9eXFwvLywgJycpLnNwbGl0KCcvJylbMF07XG4gIHJldHVybiBWQUxJRF9ST1VURVMuaW5jbHVkZXMoc2VnKSA/IHNlZyA6ICdob21lJztcbn07XG5jb25zdCByb3V0ZVRvUGF0aCA9IChyKSA9PiByID09PSAnaG9tZScgPyAnLycgOiAnLycgKyByO1xuXG5jb25zdCBBcHAgPSAoKSA9PiB7XG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgIC8vIFVSTCBcdUM2QjBcdUMxMjAuIFx1RDNGNFx1QkMzMVx1QzczQ1x1Qjg1QyBsb2NhbFN0b3JhZ2UuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZyb21QYXRoID0gcGF0aFRvUm91dGUod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgIGlmIChmcm9tUGF0aCAhPT0gJ2hvbWUnIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gJy8nKSByZXR1cm4gZnJvbVBhdGg7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jnbmpfcm91dGUnKSB8fCAnaG9tZSc7XG4gICAgfSBjYXRjaCB7IHJldHVybiAnaG9tZSc7IH1cbiAgfSk7XG4gIGNvbnN0IFtwb3N0SWQsIHNldFBvc3RJZF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4gd2luZG93LkJHTkpfQVVUSC5nZXRTZXNzaW9uVXNlcigpKTtcbiAgLy8gXHVDMTFDXHVCQzg0IFx1QzEzOFx1QzE1OFx1Qzc0NCAxXHVENjhDIFx1QUM4MFx1Qzk5RCBcdTIwMTQgXHVDRTkwXHVDMkRDXHVBQzAwIFx1QzJFMFx1QzEyMFx1RDU1OFx1QzlDMCBcdUM1NEFcdUM3NDQgXHVDMjE4IFx1Qzc4OFx1QzczQ1x1QkJDMFx1Qjg1QyBcdUM5QzRcdUM3ODUgXHVDMkRDIC9hcGkvYXV0aC9tZVx1Qjg1QyBcdUFDMzFcdUMyRTAuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIHdpbmRvdy5CR05KX0FVVEgucmVmcmVzaFNlc3Npb24/LigpLnRoZW4oKHUpID0+IHtcbiAgICAgIGlmICghY2FuY2VsbGVkKSBzZXRVc2VyKHUgfHwgbnVsbCk7XG4gICAgICBpZiAodT8uaWQpIHtcbiAgICAgICAgLy8gXHVCQzI5XHVCQjM4IFx1QUUzMFx1Qjg1RCBcdTIwMTQgXHVDNzkwXHVCM0Q5IFx1QzJCOVx1QUUwOSBcdUQzQzlcdUFDMDBcdUM3NTggdmlzaXRzTGFzdDMwRGF5cyBcdUNFMjFcdUM4MTVcdUM1RDAgXHVDMEFDXHVDNkE5LiBcdUFDMTlcdUM3NDAgXHVCMEEwIFx1Q0NBQiBcdUM5QzRcdUM3ODVcdUI5Q0MgXHVDRTc0XHVDNkI0XHVEMkI4LlxuICAgICAgICB0cnkgeyB3aW5kb3cuQkdOSl9WSVNJVFM/LnJlY29yZD8uKHUuaWQpOyB9IGNhdGNoIHt9XG4gICAgICAgIC8vIFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUMwQUNcdUM2QTlcdUM3OTBcdUI3N0NcdUJBNzQgXHVCQ0Y4XHVDNzc4IFx1RDY1Q1x1QjNEOSBcdUIzNzBcdUM3NzRcdUQxMzAgXHVDNzdDXHVBRDA0IFx1QjNEOVx1QUUzMFx1RDY1NC5cbiAgICAgICAgUHJvbWlzZS5hbGxTZXR0bGVkKFtcbiAgICAgICAgICB3aW5kb3cuQkdOSl9MRUNUVVJFUz8ucmVmcmVzaE1pbmU/LigpLFxuICAgICAgICAgIHdpbmRvdy5CR05KX1RPVVJTPy5yZWZyZXNoTWluZT8uKCksXG4gICAgICAgICAgd2luZG93LkJHTkpfQk9PS19PUkRFUlM/LnJlZnJlc2hNaW5lPy4oKSxcbiAgICAgICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hCb29rbWFya3M/Lih1LmlkKSxcbiAgICAgICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hOb3RpZmljYXRpb25zPy4odS5pZCksXG4gICAgICAgIF0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBcdUMxMUNcdUJDODQgc291cmNlIG9mIHRydXRoIFx1Qzc3OCBcdUM2QjRcdUM2MDEgXHVCMzcwXHVDNzc0XHVEMTMwXHVCNEU0XHVDNzQ0IFx1QzlDNFx1Qzc4NSBcdUMyREMgXHVDNzdDXHVBRDA0IFx1QjNEOVx1QUUzMFx1RDY1NC5cbiAgICAvLyBcdUFDMUNcdUJDQzQgXHVENUVDXHVEMzdDXHVCMjk0IFx1Qzc5MFx1Q0NCNCBcdUNFOTBcdUMyRENcdUI5N0MgXHVBQzMxXHVDMkUwXHVENTU4XHVBQ0UwICdiZ25qLSotcmVmcmVzaCcgXHVDNzc0XHVCQ0E0XHVEMkI4XHVCOTdDIFx1QkMxQ1x1RDY1NFx1RDU1Q1x1QjJFNC5cbiAgICBQcm9taXNlLmFsbFNldHRsZWQoW1xuICAgICAgd2luZG93LkJHTkpfU0lURV9DT05URU5UPy5yZWZyZXNoPy4oKSxcbiAgICAgIHdpbmRvdy5CR05KX0ZBUT8ucmVmcmVzaD8uKCksXG4gICAgICB3aW5kb3cuQkdOSl9MRUdBTD8ucmVmcmVzaD8uKCd0ZXJtcycpLFxuICAgICAgd2luZG93LkJHTkpfTEVHQUw/LnJlZnJlc2g/LigncHJpdmFjeScpLFxuICAgICAgd2luZG93LkJHTkpfTEVDVFVSRVM/LnJlZnJlc2g/Lih7IGluY2x1ZGVIaWRkZW46IHRydWUgfSksXG4gICAgICB3aW5kb3cuQkdOSl9UT1VSUz8ucmVmcmVzaD8uKHsgaW5jbHVkZUhpZGRlbjogdHJ1ZSB9KSxcbiAgICAgIHdpbmRvdy5CR05KX0JPT0tTPy5yZWZyZXNoPy4oKSxcbiAgICAgIHdpbmRvdy5CR05KX0JPT0tfT1JERVJTPy5yZWZyZXNoQmFua0FjY291bnQ/LigpLFxuICAgICAgd2luZG93LkJHTkpfQ09MVU1OUz8ucmVmcmVzaD8uKHsgYWRtaW46IHRydWUgfSksXG4gICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hQb3N0cz8uKCksXG4gICAgICAvLyBcdUI0RjFcdUFFMDkvXHVDRTc0XHVEMTRDXHVBQ0UwXHVCOUFDIFx1MjAxNCBEMSBcdUM1RDBcdUMxMUMgXHVDMTFDXHVCQzg0IFx1QzgxNVx1Qzc1OFx1Qjk3QyBcdUJDMUJcdUM1NDQgQkdOSl9TVE9SRVMgc2VlZCBcdUI5N0MgXHVCMzZFXHVDNUI0XHVDNTAwLlxuICAgICAgLy8gXHVDMTFDXHVCQzg0XHVDNUQwIFx1QzgxNVx1Qzc1OFx1QUMwMCBcdUJFNDRcdUM1QjQgXHVDNzg4XHVDNzNDXHVCQTc0IHNlZWQgXHVBQzAwIFx1QURGOFx1QjMwMFx1Qjg1QyBcdUM3MjBcdUM5QzAoXHVDQ0FCIFx1QzlDNFx1Qzc4NVx1Qzc5MFx1QzZBOSBcdUQzRjRcdUJDMzEpLlxuICAgICAgd2luZG93LkJHTkpfQVBJPy5ncmFkZXM/Lmxpc3Q/LigpPy50aGVuPy4oKHIpID0+IHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocj8uZ3JhZGVzKSAmJiByLmdyYWRlcy5sZW5ndGgpIHtcbiAgICAgICAgICB3aW5kb3cuQkdOSl9TVE9SRVMuZ3JhZGVzID0gci5ncmFkZXMubWFwKChnKSA9PiAoe1xuICAgICAgICAgICAgaWQ6IGcuaWQsIGxhYmVsOiBnLmxhYmVsLCBsZXZlbDogZy5sZXZlbCxcbiAgICAgICAgICAgIGNvbG9yOiBnLmNvbG9yLCBkZXNjOiBnLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgb3JkZXI6IGcuZGlzcGxheV9vcmRlciA/PyAwLFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk/LmNhdGNoPy4oKCkgPT4ge30pLFxuICAgICAgd2luZG93LkJHTkpfQVBJPy5jYXRlZ29yaWVzPy5saXN0Py4oKT8udGhlbj8uKChyKSA9PiB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHI/LmNhdGVnb3JpZXMpICYmIHIuY2F0ZWdvcmllcy5sZW5ndGgpIHtcbiAgICAgICAgICB3aW5kb3cuQkdOSl9TVE9SRVMuY2F0ZWdvcmllcyA9IHIuY2F0ZWdvcmllcy5tYXAoKGMpID0+ICh7XG4gICAgICAgICAgICBpZDogYy5pZCwgbGFiZWw6IGMubGFiZWwsXG4gICAgICAgICAgICBib2FyZFR5cGU6IGMuYm9hcmRfdHlwZSB8fCAnY29tbXVuaXR5JyxcbiAgICAgICAgICAgIG1pbkxldmVsOiBjLm1pbl9sZXZlbCA/PyAwLFxuICAgICAgICAgICAgcG9zdE1pbkxldmVsOiBjLnBvc3RfbWluX2xldmVsID8/IDEwLFxuICAgICAgICAgICAgZGVzYzogYy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHByZWZpeGVzOiBjLnByZWZpeGVzIHx8IFtdLFxuICAgICAgICAgICAgb3JkZXI6IGMuZGlzcGxheV9vcmRlciA/PyAwLFxuICAgICAgICAgICAgLy8gdjAwLjE0MSBcdTIwMTQgc2NoZW1hLXY4IFx1QUQ4Q1x1RDU1QyA0XHVDODg1LiB1bmRlZmluZWQvbnVsbCAobGVnYWN5KSBcdTIxOTIgdHJ1ZS5cbiAgICAgICAgICAgIGFsbG93UmVhZDogYy5hbGxvd19yZWFkID09PSAwID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgYWxsb3dXcml0ZTogYy5hbGxvd193cml0ZSA9PT0gMCA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICAgIGFsbG93Q29tbWVudFJlYWQ6IGMuYWxsb3dfY29tbWVudF9yZWFkID09PSAwID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgYWxsb3dDb21tZW50V3JpdGU6IGMuYWxsb3dfY29tbWVudF93cml0ZSA9PT0gMCA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0pPy5jYXRjaD8uKCgpID0+IHt9KSxcbiAgICBdKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgfSwgW10pO1xuXG4gIC8vIHYwMC4xMjkgXHUyMDE0IEJHTkpfQlJPQURDQVNUIFx1QUQ2Q1x1QjNDNTogYWRtaW4gXHVEMEVEXHVDNUQwXHVDMTFDICdsZWN0dXJlcycvJ3RvdXJzJy8nY29sdW1ucycvJ3Bvc3RzJy8nYm9va3MnXG4gIC8vIFx1QkNDMFx1QUNCRFx1Qzc3NCBcdUJDMUNcdUMwRERcdUQ1NThcdUJBNzQgXHVBQzE5XHVDNzQwIG9yaWdpbiBcdUM3NTggXHVCQUE4XHVCNEUwIFx1RDBFRFx1Qzc3NCBcdUQ1NzRcdUIyRjkgXHVENUVDXHVEMzdDIHJlZnJlc2ggKyBcdUQzOThcdUM3NzRcdUM5QzAgXHVDNzc0XHVCQ0E0XHVEMkI4IGRpc3BhdGNoLlxuICAvLyBcdUM2MDg6IFx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUQwRURcdUM1RDBcdUMxMUMgXHVBQzE1XHVDNUYwIFx1QzBBRFx1QzgxQyBcdTIxOTIgXHVENjQ4IFx1RDBFRFx1QzVEMFx1QzExQyBcdUM3OTBcdUIzRDlcdUM3M0NcdUI4NUMgXHVCMkU0XHVDNzRDIFx1QUMxNVx1QzVGMCBcdUNFNzRcdUI0REMgXHVBQzMxXHVDMkUwLlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghd2luZG93LkJHTkpfQlJPQURDQVNUPy5zdWJzY3JpYmUpIHJldHVybjtcbiAgICBjb25zdCB1bnN1YiA9IHdpbmRvdy5CR05KX0JST0FEQ0FTVC5zdWJzY3JpYmUoYXN5bmMgKG1zZykgPT4ge1xuICAgICAgY29uc3QgZCA9IG1zZz8uZG9tYWluO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGQgPT09ICdsZWN0dXJlcycpIGF3YWl0IHdpbmRvdy5CR05KX0xFQ1RVUkVTPy5yZWZyZXNoPy4oeyBpbmNsdWRlSGlkZGVuOiBmYWxzZSB9KTtcbiAgICAgICAgZWxzZSBpZiAoZCA9PT0gJ3RvdXJzJykgYXdhaXQgd2luZG93LkJHTkpfVE9VUlM/LnJlZnJlc2g/Lih7IGluY2x1ZGVIaWRkZW46IGZhbHNlIH0pO1xuICAgICAgICBlbHNlIGlmIChkID09PSAnY29sdW1ucycpIGF3YWl0IHdpbmRvdy5CR05KX0NPTFVNTlM/LnJlZnJlc2g/LigpO1xuICAgICAgICBlbHNlIGlmIChkID09PSAncG9zdHMnKSBhd2FpdCB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hQb3N0cz8uKCk7XG4gICAgICAgIGVsc2UgaWYgKGQgPT09ICdib29rcycpIGF3YWl0IHdpbmRvdy5CR05KX0JPT0tTPy5yZWZyZXNoPy4oKTtcbiAgICAgICAgZWxzZSBpZiAoZCA9PT0gJ3NpdGUtY29udGVudCcpIGF3YWl0IHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8ucmVmcmVzaD8uKCk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfSk7XG4gICAgcmV0dXJuIHVuc3ViO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgW2NhcnQsIHNldENhcnRdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYmdual9jYXJ0Jyk7XG4gICAgICByZXR1cm4gcmF3ID8gSlNPTi5wYXJzZShyYXcpIDogbnVsbDtcbiAgICB9IGNhdGNoIHsgcmV0dXJuIG51bGw7IH1cbiAgfSk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChjYXJ0KSBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYmdual9jYXJ0JywgSlNPTi5zdHJpbmdpZnkoY2FydCkpO1xuICAgICAgZWxzZSBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYmdual9jYXJ0Jyk7XG4gICAgfSBjYXRjaCB7fVxuICB9LCBbY2FydF0pO1xuICBjb25zdCBbdHdlYWtzLCBzZXRUd2Vha3NdID0gUmVhY3QudXNlU3RhdGUoVFdFQUtfREVGQVVMVFMpO1xuICBjb25zdCBbZWRpdE1vZGUsIHNldEVkaXRNb2RlXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBnbyA9IChyKSA9PiB7XG4gICAgc2V0Um91dGUocik7XG4gICAgc2V0UG9zdElkKG51bGwpO1xuICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3JvdXRlJywgcik7IH0gY2F0Y2gge31cbiAgICAvLyBcdUJFMENcdUI3N0NcdUM2QjBcdUM4MDAgXHVDOEZDXHVDMThDXHVCOTdDIFx1QjNEOVx1QUUzMFx1RDY1NCBcdTIwMTQgXHVBQzE5XHVDNzQwIFx1QUNCRFx1Qjg1Q1x1QkE3NCBwdXNoIFx1QzBERFx1QjdCNShcdUJEODhcdUQ1NDRcdUM2OTRcdUQ1NUMgXHVDMkE0XHVEMEREIFx1QjIwNFx1QzgwMSBcdUJDMjlcdUM5QzApLlxuICAgIHRyeSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSByb3V0ZVRvUGF0aChyKTtcbiAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgIT09IHRhcmdldCkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgJycsIHRhcmdldCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7fVxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgfTtcblxuICAvLyBcdUI0QTRcdUI4NUMvXHVDNTVFXHVDNzNDXHVCODVDIFx1QkM4NFx1RDJCQyBcdUIzRDlcdUFFMzBcdUQ2NTQgXHUyMDE0IHBvcHN0YXRlIFx1QzJEQyBVUkxcdUM3NDQgXHVCMkU0XHVDMkRDIFx1Qjc3Q1x1QzZCMFx1RDJCOFx1Qjg1QyBcdUJDQzBcdUQ2NTguXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Qb3AgPSAoKSA9PiB7XG4gICAgICBjb25zdCBuZXh0ID0gcGF0aFRvUm91dGUod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgIHNldFJvdXRlKG5leHQpO1xuICAgICAgc2V0UG9zdElkKG51bGwpO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25Qb3ApO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvblBvcCk7XG4gIH0sIFtdKTtcblxuICAvLyBcdUI3N0NcdUM2QjBcdUQyQjhcdUJDQzQgZG9jdW1lbnQudGl0bGUgXHUyMDE0IFx1QkQ4MVx1QjlDOFx1RDA2QyAvIFx1QUNGNVx1QzcyMCAvIFx1RDBFRCBcdUI3N0NcdUJDQTggXHVDNzU4XHVCQkY4XHVENjU0LlxuICAvLyBcdUMwQUNcdUM3NzRcdUQyQjggXHVDRjU4XHVEMTUwXHVDRTIwKFx1QkUwQ1x1Qjc5Q1x1QjREQ1x1QkE4NS9PRylcdUIzQzQgXHVCQ0MwXHVBQ0JEIFx1QzJEQyBcdUFDMTlcdUM3NzQgXHVBQzMxXHVDMkUwLlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHNjID0gd2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9O1xuICAgIGNvbnN0IGJyYW5kID0gc2MuYnJhbmQ/Lm5hbWUgfHwgJ1x1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCc7XG4gICAgY29uc3QgdGFnbGluZSA9IHNjLm9nPy50aXRsZSB8fCAnXHVCQzQ1XHVBRTMwIFx1RDBDMFx1QUNFMCBcdUQ1NUNcdUFENkRcdUM3NDQgXHVCMjkwXHVCMDdDXHVCMkU0JztcbiAgICBjb25zdCBST1VURV9USVRMRVMgPSB7XG4gICAgICBob21lOiB0YWdsaW5lLFxuICAgICAgZWF0OiAnXHVCQTM5XHVBQ0UwIFx1QjE4MFx1Qzc5MCcsXG4gICAgICBzbGVlcDogJ1x1Qzc5MFx1QUNFMCBcdUIxODBcdUM3OTAnLFxuICAgICAgc2hvcDogJ1x1QzBBQ1x1QUNFMCBcdUIxODBcdUM3OTAnLFxuICAgICAgdG91cjogJ1x1RDIyQ1x1QzVCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QTgnLFxuICAgICAgbGVjdHVyZXM6ICdcdUFDMTVcdUM1RjAnLFxuICAgICAgY29sdW1uOiAnXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0U3Q1x1QjdGQycsXG4gICAgICBjb21tdW5pdHk6ICdcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAnLFxuICAgICAgYm9vazogJ1x1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1Qzc1OCBcdUFFMzgnLFxuICAgICAgY2hlY2tvdXQ6ICdcdUFDQjBcdUM4MUMnLFxuICAgICAgbXlwYWdlOiAnXHVCOUM4XHVDNzc0XHVEMzk4XHVDNzc0XHVDOUMwJyxcbiAgICAgIGFkbWluOiAnXHVBRDAwXHVCOUFDXHVDNzkwJyxcbiAgICAgIGxvZ2luOiAnXHVCODVDXHVBREY4XHVDNzc4JyxcbiAgICAgIHNpZ251cDogJ1x1RDY4Q1x1QzZEMFx1QUMwMFx1Qzc4NScsXG4gICAgICBmYXE6ICdcdUM3OTBcdUM4RkMgXHVCQjNCXHVCMjk0IFx1QzlDOFx1QkIzOCcsXG4gICAgICBwcml2YWN5OiAnXHVBQzFDXHVDNzc4XHVDODE1XHVCQ0Y0IFx1Q0M5OFx1QjlBQ1x1QkMyOVx1Q0U2OCcsXG4gICAgICB0ZXJtczogJ1x1Qzc3NFx1QzZBOVx1QzU3RFx1QUQwMCcsXG4gICAgfTtcbiAgICBjb25zdCBzZWcgPSBST1VURV9USVRMRVNbcm91dGVdIHx8ICcnO1xuICAgIGNvbnN0IHRpdGxlID0gcm91dGUgPT09ICdob21lJyA/IGAke2JyYW5kfSBcdTIwMTQgJHt0YWdsaW5lfWAgOiBgJHtzZWd9IFx1MjAxNCAke2JyYW5kfWA7XG4gICAgdHJ5IHsgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTsgfSBjYXRjaCB7fVxuICAgIC8vIHJvdXRlIFx1QkNDMFx1QUNCRCBcdUMyREMgXHVDMEFDXHVDNzc0XHVEMkI4IFx1Q0Y1OFx1RDE1MFx1Q0UyMCByZWZyZXNoIFx1Qzc3NFx1QkNBNFx1RDJCOFx1QjNDNCBsaXN0ZW4gXHUyMDE0IFx1QkUwQ1x1Qjc5Q1x1QjREQ1x1QkE4NS9cdUQwRENcdUFERjhcdUI3N0NcdUM3NzggXHVCQzE0XHVCMDBDXHVCQTc0IFx1Qzk4OVx1QzJEQyBcdUJDMThcdUM2MDEuXG4gICAgY29uc3Qgb25TY1JlZnJlc2ggPSAoKSA9PiB7XG4gICAgICBjb25zdCBzYzIgPSB3aW5kb3cuQkdOSl9TSVRFX0NPTlRFTlQ/LmdldD8uKCkgfHwge307XG4gICAgICBjb25zdCBiMiA9IHNjMi5icmFuZD8ubmFtZSB8fCAnXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwJztcbiAgICAgIGNvbnN0IHQyID0gc2MyLm9nPy50aXRsZSB8fCAnXHVCQzQ1XHVBRTMwIFx1RDBDMFx1QUNFMCBcdUQ1NUNcdUFENkRcdUM3NDQgXHVCMjkwXHVCMDdDXHVCMkU0JztcbiAgICAgIGNvbnN0IHMgPSBST1VURV9USVRMRVNbcm91dGVdIHx8ICcnO1xuICAgICAgY29uc3QgbmV3VGl0bGUgPSByb3V0ZSA9PT0gJ2hvbWUnID8gYCR7YjJ9IFx1MjAxNCAke3QyfWAgOiBgJHtzfSBcdTIwMTQgJHtiMn1gO1xuICAgICAgdHJ5IHsgZG9jdW1lbnQudGl0bGUgPSBuZXdUaXRsZTsgfSBjYXRjaCB7fVxuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Jnbmotc2l0ZS1jb250ZW50LXJlZnJlc2gnLCBvblNjUmVmcmVzaCk7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZ25qLXNpdGUtY29udGVudC1yZWZyZXNoJywgb25TY1JlZnJlc2gpO1xuICB9LCBbcm91dGVdKTtcblxuICBjb25zdCBsb2dvdXQgPSAoKSA9PiB7XG4gICAgd2luZG93LkJHTkpfQVVUSC5zaWduT3V0KCk7XG4gICAgc2V0VXNlcihudWxsKTtcbiAgICBzZXRQb3N0SWQobnVsbCk7XG4gICAgc2V0Um91dGUoXCJob21lXCIpO1xuICAgIHRyeSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYmdual9yb3V0ZScsICdob21lJyk7XG4gICAgfSBjYXRjaCB7fVxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgfTtcblxuICAvLyBFZGl0LW1vZGUgcHJvdG9jb2xcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbk1zZyA9IChlKSA9PiB7XG4gICAgICBjb25zdCBkID0gZS5kYXRhIHx8IHt9O1xuICAgICAgaWYgKGQudHlwZSA9PT0gJ19fYWN0aXZhdGVfZWRpdF9tb2RlJykgc2V0RWRpdE1vZGUodHJ1ZSk7XG4gICAgICBpZiAoZC50eXBlID09PSAnX19kZWFjdGl2YXRlX2VkaXRfbW9kZScpIHNldEVkaXRNb2RlKGZhbHNlKTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgb25Nc2cpO1xuICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoeyB0eXBlOiAnX19lZGl0X21vZGVfYXZhaWxhYmxlJyB9LCAnKicpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG9uTXNnKTtcbiAgfSwgW10pO1xuXG4gIC8vIFVSTCBcdUQ1NzRcdUMyREMgXHVCNTI1IFx1QjlDMVx1RDA2QzogI2NvbC17aWR9IFx1MjE5MiBcdUNFN0NcdUI3RkMgXHVDMEMxXHVDMTM4LCAjcG9zdC17aWR9IFx1MjE5MiBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVDMEMxXHVDMTM4XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgYXBwbHlIYXNoID0gKCkgPT4ge1xuICAgICAgY29uc3QgaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICcnO1xuICAgICAgY29uc3QgY29sTWF0Y2ggPSBoLm1hdGNoKC9eI2NvbC0oLispJC8pO1xuICAgICAgY29uc3QgcG9zdE1hdGNoID0gaC5tYXRjaCgvXiNwb3N0LSguKykkLyk7XG4gICAgICBjb25zdCBsZWN0dXJlTWF0Y2ggPSBoLm1hdGNoKC9eI2xlY3R1cmUtKC4rKSQvKTtcbiAgICAgIGlmIChjb2xNYXRjaCkge1xuICAgICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfY29sdW1uX2lkJywgZGVjb2RlVVJJQ29tcG9uZW50KGNvbE1hdGNoWzFdKSk7IH0gY2F0Y2gge31cbiAgICAgICAgc2V0Um91dGUoJ2NvbHVtbicpO1xuICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYmdual9yb3V0ZScsICdjb2x1bW4nKTsgfSBjYXRjaCB7fVxuICAgICAgfSBlbHNlIGlmIChwb3N0TWF0Y2gpIHtcbiAgICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX3Bvc3RfaWQnLCBkZWNvZGVVUklDb21wb25lbnQocG9zdE1hdGNoWzFdKSk7IH0gY2F0Y2gge31cbiAgICAgICAgc2V0Um91dGUoJ2NvbW11bml0eScpO1xuICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYmdual9yb3V0ZScsICdjb21tdW5pdHknKTsgfSBjYXRjaCB7fVxuICAgICAgfSBlbHNlIGlmIChsZWN0dXJlTWF0Y2gpIHtcbiAgICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX2xlY3R1cmVfaWQnLCBkZWNvZGVVUklDb21wb25lbnQobGVjdHVyZU1hdGNoWzFdKSk7IH0gY2F0Y2gge31cbiAgICAgICAgc2V0Um91dGUoJ2xlY3R1cmVzJyk7XG4gICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3JvdXRlJywgJ2xlY3R1cmVzJyk7IH0gY2F0Y2gge31cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRvdXJNYXRjaCA9IGgubWF0Y2goL14jdG91ci0oLispJC8pO1xuICAgICAgICBpZiAodG91ck1hdGNoKSB7XG4gICAgICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX3RvdXJfaWQnLCBkZWNvZGVVUklDb21wb25lbnQodG91ck1hdGNoWzFdKSk7IH0gY2F0Y2gge31cbiAgICAgICAgICBzZXRSb3V0ZSgndG91cicpO1xuICAgICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3JvdXRlJywgJ3RvdXInKTsgfSBjYXRjaCB7fVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBhcHBseUhhc2goKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIGFwcGx5SGFzaCk7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgYXBwbHlIYXNoKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IHVwZGF0ZVR3ZWFrcyA9IChuZXh0KSA9PiB7XG4gICAgc2V0VHdlYWtzKG5leHQpO1xuICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoeyB0eXBlOiAnX19lZGl0X21vZGVfc2V0X2tleXMnLCBlZGl0czogbmV4dCB9LCAnKicpO1xuICB9O1xuXG4gIGNvbnN0IGhpZGVOYXYgPSByb3V0ZSA9PT0gXCJsb2dpblwiIHx8IHJvdXRlID09PSBcInNpZ251cFwiIHx8IHJvdXRlID09PSBcImFkbWluXCI7XG5cbiAgLy8gXHVEMzk4XHVDNzc0XHVDOUMwIFx1Q0VGNFx1RDNFQ1x1QjEwQ1x1RDJCOFx1Qjk3QyB3aW5kb3cgXHVDNUQwXHVDMTFDIGRlZmVuc2l2ZSBsb29rdXAgXHUyMDE0IGJhYmVsLXN0YW5kYWxvbmUgXHVDMkE0XHVEMDZDXHVCOUJEXHVEMkI4IFx1Qjg1Q1x1QjREQyBcdUMyMUNcdUMxMUMvXHVDMkU0XHVEMzI4XHVDNUQwXG4gIC8vIFx1QUNBQ1x1QUNFMFx1RDU1OFx1QUM4QyBcdUIzRDlcdUM3OTEuIFx1Q0VGNFx1RDNFQ1x1QjEwQ1x1RDJCOFx1QUMwMCBcdUM1QzZcdUM3M0NcdUJBNzQgZmFsbGJhY2sgVUkgXHVCODBDXHVCMzU0KFx1QzgwNFx1Q0NCNCBcdUM1NzEgXHVEMkI4XHVCOUFDXHVCMjk0IFx1QzhGRFx1QzlDMCBcdUM1NEFcdUFDOEMpLlxuICBjb25zdCByZW5kZXJQYWdlID0gKCkgPT4ge1xuICAgIGNvbnN0IFcgPSB3aW5kb3c7XG4gICAgY29uc3QgZmFsbGJhY2sgPSAobGFiZWwpID0+ICgpID0+IChcbiAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOjQ4LCB0ZXh0QWxpZ246J2NlbnRlcicsIGNvbG9yOicjMWYyOTM3J319PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTonbW9ub3NwYWNlJywgZm9udFNpemU6MTEsIGNvbG9yOicjZGMyNjI2JywgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgbWFyZ2luQm90dG9tOjh9fT5QQUdFX05PVF9MT0FERUQ8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J3NlcmlmJywgZm9udFNpemU6MTgsIG1hcmdpbkJvdHRvbTo2fX0+e2xhYmVsfSBcdUQzOThcdUM3NzRcdUM5QzBcdUI5N0MgXHVCRDg4XHVCN0VDXHVDNjI0XHVDOUMwIFx1QkFCQlx1RDU4OFx1QzJCNVx1QjJDOFx1QjJFNDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFNpemU6MTIsIGNvbG9yOicjNjQ3NDhiJywgbWFyZ2luQm90dG9tOjE4fX0+XHVDMEM4XHVCODVDXHVBQ0UwXHVDRTY4IFx1RDZDNFx1QzVEMFx1QjNDNCBcdUFDMTlcdUM3NDAgXHVENjU0XHVCQTc0XHVDNzc0IFx1QkNGNFx1Qzc3OFx1QjJFNFx1QkE3NCBcdUM3QTBcdUMyREMgXHVENkM0IFx1QjJFNFx1QzJEQyBcdUMyRENcdUIzQzRcdUQ1NzQgXHVDOEZDXHVDMTM4XHVDNjk0LjwvZGl2PlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpOyB9IGNhdGNoIHt9IH19IHN0eWxlPXt7cGFkZGluZzonOHB4IDE2cHgnLCBjdXJzb3I6J3BvaW50ZXInfX0+XHVEMzk4XHVDNzc0XHVDOUMwIFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2ODwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgICBjb25zdCBwaWNrID0gKG5hbWUsIGxhYmVsKSA9PiBXW25hbWVdIHx8IGZhbGxiYWNrKGxhYmVsKTtcbiAgICBzd2l0Y2ggKHJvdXRlKSB7XG4gICAgICBjYXNlIFwiaG9tZVwiOiAgICAgIHsgY29uc3QgQyA9IHBpY2soJ0hvbWVQYWdlJywnXHVENjQ4Jyk7ICAgICAgcmV0dXJuIDxDIGdvPXtnb30gdHdlYWtzPXt0d2Vha3N9Lz47IH1cbiAgICAgIGNhc2UgXCJlYXRcIjogICAgICAgeyBjb25zdCBDID0gcGljaygnRWF0UGFnZScsJ1x1QkEzOVx1QUNFMCBcdUIxODBcdUM3OTAnKTsgcmV0dXJuIDxDIGdvPXtnb30gdXNlcj17dXNlcn0vPjsgfVxuICAgICAgY2FzZSBcInNsZWVwXCI6ICAgICB7IGNvbnN0IEMgPSBwaWNrKCdTbGVlcFBhZ2UnLCdcdUM3OTBcdUFDRTAgXHVCMTgwXHVDNzkwJyk7IHJldHVybiA8QyBnbz17Z299IHVzZXI9e3VzZXJ9Lz47IH1cbiAgICAgIGNhc2UgXCJzaG9wXCI6ICAgICAgeyBjb25zdCBDID0gcGljaygnU2hvcFBhZ2UnLCdcdUMwQUNcdUFDRTAgXHVCMTgwXHVDNzkwJyk7IHJldHVybiA8QyBnbz17Z299IHVzZXI9e3VzZXJ9Lz47IH1cbiAgICAgIGNhc2UgXCJjb21tdW5pdHlcIjogeyBjb25zdCBDID0gcGljaygnQ29tbXVuaXR5UGFnZScsJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCcpOyByZXR1cm4gPEMgZ289e2dvfSBwb3N0SWQ9e3Bvc3RJZH0gc2V0UG9zdElkPXtzZXRQb3N0SWR9IHVzZXI9e3VzZXJ9Lz47IH1cbiAgICAgIGNhc2UgXCJ0b3VyXCI6ICAgICAgeyBjb25zdCBDID0gcGljaygnVG91clBhZ2UnLCdcdUQyMkNcdUM1QjQnKTsgcmV0dXJuIDxDIGdvPXtnb30gdXNlcj17dXNlcn0vPjsgfVxuICAgICAgY2FzZSBcImxlY3R1cmVzXCI6ICB7IGNvbnN0IEMgPSBwaWNrKCdMZWN0dXJlc1BhZ2UnLCdcdUFDMTVcdUM1RjAnKTsgcmV0dXJuIDxDIGdvPXtnb30gdXNlcj17dXNlcn0vPjsgfVxuICAgICAgY2FzZSBcInByaXZhY3lcIjogICB7IGNvbnN0IEMgPSBwaWNrKCdMZWdhbFBhZ2UnLCdcdUM1N0RcdUFEMDAnKTsgcmV0dXJuIDxDIGdvPXtnb30gc2x1Zz1cInByaXZhY3lcIi8+OyB9XG4gICAgICBjYXNlIFwidGVybXNcIjogICAgIHsgY29uc3QgQyA9IHBpY2soJ0xlZ2FsUGFnZScsJ1x1QzU3RFx1QUQwMCcpOyByZXR1cm4gPEMgZ289e2dvfSBzbHVnPVwidGVybXNcIi8+OyB9XG4gICAgICBjYXNlIFwiZmFxXCI6ICAgICAgIHsgY29uc3QgQyA9IHBpY2soJ0ZhcVBhZ2UnLCdcdUM3OTBcdUM4RkMgXHVCQjNCXHVCMjk0IFx1QzlDOFx1QkIzOCcpOyByZXR1cm4gPEMgZ289e2dvfS8+OyB9XG4gICAgICBjYXNlIFwiY29sdW1uXCI6ICAgIHsgY29uc3QgQyA9IHBpY2soJ0NvbHVtblBhZ2UnLCdcdUNFN0NcdUI3RkMnKTsgcmV0dXJuIDxDIGdvPXtnb30gdXNlcj17dXNlcn0vPjsgfVxuICAgICAgY2FzZSBcImJvb2tcIjogICAgICB7IGNvbnN0IEMgPSBwaWNrKCdCb29rUGFnZScsJ1x1Q0M0NScpOyByZXR1cm4gPEMgZ289e2dvfSBjYXJ0PXtjYXJ0fSBzZXRDYXJ0PXtzZXRDYXJ0fSB1c2VyPXt1c2VyfS8+OyB9XG4gICAgICBjYXNlIFwiY2hlY2tvdXRcIjogIHsgY29uc3QgQyA9IHBpY2soJ0NoZWNrb3V0UGFnZScsJ1x1QUNCMFx1QzgxQycpOyByZXR1cm4gPEMgZ289e2dvfSBjYXJ0PXtjYXJ0fSB1c2VyPXt1c2VyfS8+OyB9XG4gICAgICBjYXNlIFwibXlwYWdlXCI6ICAgIHsgY29uc3QgQyA9IHBpY2soJ015UGFnZScsJ1x1QjlDOFx1Qzc3NFx1RDM5OFx1Qzc3NFx1QzlDMCcpOyByZXR1cm4gPEMgZ289e2dvfSB1c2VyPXt1c2VyfSBjYXJ0PXtjYXJ0fS8+OyB9XG4gICAgICBjYXNlIFwibG9naW5cIjpcbiAgICAgIGNhc2UgXCJzaWdudXBcIjogICAgeyBjb25zdCBDID0gcGljaygnTG9naW5QYWdlJywnXHVCODVDXHVBREY4XHVDNzc4Jyk7IHJldHVybiA8QyBnbz17Z299IHNldFVzZXI9e3NldFVzZXJ9Lz47IH1cbiAgICAgIGNhc2UgXCJhZG1pblwiOiAgICAge1xuICAgICAgICBpZiAoIXVzZXI/LmlzQWRtaW4pIHsgY29uc3QgRCA9IHBpY2soJ0FkbWluRGVuaWVkJywnXHVBRDAwXHVCOUFDJyk7IHJldHVybiA8RCBnbz17Z299IHVzZXI9e3VzZXJ9Lz47IH1cbiAgICAgICAgY29uc3QgQyA9IHBpY2soJ0FkbWluUGFnZScsJ1x1QUQwMFx1QjlBQycpOyByZXR1cm4gPEMgZ289e2dvfSB1c2VyPXt1c2VyfS8+O1xuICAgICAgfVxuICAgICAgZGVmYXVsdDogICAgICAgICAgeyBjb25zdCBDID0gcGljaygnSG9tZVBhZ2UnLCdcdUQ2NDgnKTsgcmV0dXJuIDxDIGdvPXtnb30gdHdlYWtzPXt0d2Vha3N9Lz47IH1cbiAgICB9XG4gIH07XG4gIC8vIFx1RDM5OFx1Qzc3NFx1QzlDMFx1QkNDNCBcdUM1RDBcdUI3RUMgXHVCQzE0XHVDNkI0XHVCMzU0XHVCOUFDIFx1MjAxNCBcdUQ1NUMgXHVEMzk4XHVDNzc0XHVDOUMwXHVBQzAwIFx1QjM1OFx1QzlDNCBcdUM2MjRcdUI5NThcdUFDMDAgXHVDODA0XHVDNUVEXHVDNzNDXHVCODVDIFx1QkM4OFx1QzlDMFx1QzlDMCBcdUM1NEFcdUFDOEMuIGtleT1yb3V0ZSBcdUI4NUMgXHVCNzdDXHVDNkIwXHVEMkI4IFx1QkNDMFx1QUNCRCBcdUMyREMgXHVDNzkwXHVCM0Q5IHJlc2V0LlxuICBjb25zdCBwYWdlID0gPFBhZ2VFcnJvckJvdW5kYXJ5IGtleT17cm91dGV9IHJvdXRlPXtyb3V0ZX0gZ289e2dvfT57cmVuZGVyUGFnZSgpfTwvUGFnZUVycm9yQm91bmRhcnk+O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJhcHBcIj5cbiAgICAgIDxOYXYgcm91dGU9e3JvdXRlfSBnbz17Z299IHVzZXI9e3VzZXJ9IG9uTG9nb3V0PXtsb2dvdXR9Lz5cbiAgICAgIDxtYWluIGlkPVwibWFpblwiIHRhYkluZGV4PVwiLTFcIiBzdHlsZT17e2ZsZXg6MSwgb3V0bGluZTonbm9uZSd9fSBhcmlhLWxhYmVsPXtgJHtyb3V0ZX0gXHVEMzk4XHVDNzc0XHVDOUMwIFx1QkNGOFx1QkIzOGB9PntwYWdlfTwvbWFpbj5cbiAgICAgIHshaGlkZU5hdiAmJiA8Rm9vdGVyIGdvPXtnb30vPn1cbiAgICAgIDxUd2Vha3MgdHdlYWtzPXt0d2Vha3N9IHNldFR3ZWFrcz17dXBkYXRlVHdlYWtzfSB2aXNpYmxlPXtlZGl0TW9kZX0vPlxuICAgICAgPFNjcm9sbFRvVG9wLz5cbiAgICAgIDxDb29raWVDb25zZW50Lz5cbiAgICAgIDxHbG9iYWxFcnJvclRvYXN0Lz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IHJvb3QgPSBSZWFjdERPTS5jcmVhdGVSb290KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykpO1xucm9vdC5yZW5kZXIoPEFwcEVycm9yQm91bmRhcnk+PEFwcC8+PC9BcHBFcnJvckJvdW5kYXJ5Pik7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFHQSxNQUFNLHlCQUF5QixNQUFNLFVBQVU7QUFBQSxFQUM3QyxZQUFZLE9BQU87QUFBRSxVQUFNLEtBQUs7QUFBRyxTQUFLLFFBQVEsRUFBRSxPQUFPLE1BQU0sTUFBTSxLQUFLO0FBQUEsRUFBRztBQUFBLEVBQzdFLE9BQU8seUJBQXlCLEtBQUs7QUFBRSxXQUFPLEVBQUUsT0FBTyxJQUFJO0FBQUEsRUFBRztBQUFBLEVBQzlELGtCQUFrQixLQUFLLE1BQU07QUFOL0I7QUFPSSxTQUFLLFNBQVMsRUFBRSxLQUFLLENBQUM7QUFDdEIsUUFBSTtBQUFFLGNBQVEsTUFBTSxzQkFBc0IsS0FBSyxJQUFJO0FBQUEsSUFBRyxTQUFRO0FBQUEsSUFBQztBQUUvRCxRQUFJO0FBQ0YscUNBQU8sYUFBUCxtQkFBaUIsYUFBakIsbUJBQTJCLE9BQU87QUFBQSxRQUNoQyxPQUFNLDJCQUFLLFdBQVMsMkJBQUssU0FBUTtBQUFBLFFBQ2pDLFFBQVE7QUFBQSxRQUFNLE1BQU07QUFBQSxRQUNwQixVQUFTLDJCQUFLLFlB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LElBQVEsTUFBVztBQUFBLFFBQUk7QUFDM0YsY0FBTSxJQUFJLEtBQUssYUFBWSxjQUFJO0FBQUcsZUFBTyxvQ0FBQyxLQUFFLElBQVEsTUFBVztBQUFBLE1BQ2pFO0FBQUEsTUFDQSxTQUFrQjtBQUFFLGNBQU0sSUFBSSxLQUFLLFlBQVcsUUFBRztBQUFHLGVBQU8sb0NBQUMsS0FBRSxJQUFRLFFBQWU7QUFBQSxNQUFJO0FBQUEsSUFDM0Y7QUFBQSxFQUNGO0FBRUEsUUFBTSxPQUFPLG9DQUFDLHFCQUFrQixLQUFLLE9BQU8sT0FBYyxNQUFTLFdBQVcsQ0FBRTtBQUVoRixTQUNFLG9DQUFDLFNBQUksV0FBVSxTQUNiLG9DQUFDLE9BQUksT0FBYyxJQUFRLE1BQVksVUFBVSxRQUFPLEdBQ3hELG9DQUFDLFVBQUssSUFBRyxRQUFPLFVBQVMsTUFBSyxPQUFPLEVBQUMsTUFBSyxHQUFHLFNBQVEsT0FBTSxHQUFHLGNBQVksR0FBRyxLQUFLLHNDQUFZLElBQUssR0FDbkcsQ0FBQyxXQUFXLG9DQUFDLFVBQU8sSUFBTyxHQUM1QixvQ0FBQyxVQUFPLFFBQWdCLFdBQVcsY0FBYyxTQUFTLFVBQVMsR0FDbkUsb0NBQUMsaUJBQVcsR0FDWixvQ0FBQyxtQkFBYSxHQUNkLG9DQUFDLHNCQUFnQixDQUNuQjtBQUVKO0FBRUEsTUFBTSxPQUFPLFNBQVMsV0FBVyxTQUFTLGVBQWUsTUFBTSxDQUFDO0FBQ2hFLEtBQUssT0FBTyxvQ0FBQyx3QkFBaUIsb0NBQUMsU0FBRyxDQUFFLENBQW1COyIsCiAgIm5hbWVzIjogWyJlIiwgIl9hIiwgIl9iIiwgIl9jIiwgIl9kIiwgIl9lIiwgIl9mIiwgIl9nIiwgIl9oIiwgIl9pIiwgIl9qIiwgIl9rIiwgIl9sIl0KfQo=

})();

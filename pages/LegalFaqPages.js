(function(){
const G = window.BGNJ_GUARD || {
  call: (fn, fb) => {
    try {
      const v = fn();
      return v == null ? fb : v;
    } catch (e) {
      return fb;
    }
  },
  arr: (fn) => {
    try {
      const v = fn();
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  }
};
const LegalPage = ({ go, slug }) => {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      var _a, _b, _c, _d;
      await ((_b = (_a = window.BGNJ_LEGAL) == null ? void 0 : _a.refresh) == null ? void 0 : _b.call(_a, slug));
      const other = slug === "privacy" ? "terms" : "privacy";
      await ((_d = (_c = window.BGNJ_LEGAL) == null ? void 0 : _c.refresh) == null ? void 0 : _d.call(_c, other));
      if (!cancelled) setTick((t) => t + 1);
    })();
    const onRefresh = () => setTick((t) => t + 1);
    window.addEventListener("bgnj-legal-refresh", onRefresh);
    return () => {
      cancelled = true;
      window.removeEventListener("bgnj-legal-refresh", onRefresh);
    };
  }, [slug]);
  const doc = G.call(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_LEGAL) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a, slug);
  }, null) || { title: "", body: "" };
  const otherSlug = slug === "privacy" ? "terms" : "privacy";
  const otherDoc = G.call(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_LEGAL) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a, otherSlug);
  }, null);
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 760 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, slug === "privacy" ? "PRIVACY" : "TERMS"), /* @__PURE__ */ React.createElement("h1", { className: "section-title", style: { marginBottom: 14 } }, doc.title), doc.updatedAt && /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11, marginBottom: 32, letterSpacing: "0.16em" } }, "\uCD5C\uADFC \uAC31\uC2E0 \xB7 ", window.BGNJ_FMT.kstDate(doc.updatedAt)), /* @__PURE__ */ React.createElement(
    "article",
    {
      className: "post-body",
      style: { maxWidth: "68ch", margin: "0 auto" },
      dangerouslySetInnerHTML: { __html: window.BGNJ_SAFE_HTML(doc.body || '<p class="dim">\uC544\uC9C1 \uB4F1\uB85D\uB41C \uB0B4\uC6A9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</p>') }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 60, paddingTop: 32, borderTop: "1px solid var(--line-2)", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("home") }, "\u2190 \uD648\uC73C\uB85C"), otherDoc && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go(otherSlug === "privacy" ? "privacy" : "terms") }, otherDoc.title, " \u2192"))));
};
const FaqPage = ({ go }) => {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("\uC804\uCCB4");
  const [openId, setOpenId] = React.useState(null);
  const categories = G.arr(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_FAQ) == null ? void 0 : _a.listCategories) == null ? void 0 : _b.call(_a);
  });
  const filtered = G.arr(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_FAQ) == null ? void 0 : _a.search) == null ? void 0 : _b.call(_a, search, category);
  });
  const grouped = filtered.reduce((acc, f) => {
    const k = f.category || "\uC77C\uBC18";
    (acc[k] = acc[k] || []).push(f);
    return acc;
  }, {});
  const groupKeys = Object.keys(grouped);
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 840 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 48 } }, (() => {
    var _a, _b, _c, _d, _e;
    const _i = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).faqIntro || {};
    const eb = _i.eyebrow || "FAQ \xB7 \uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38";
    const tp = (_c = _i.titlePrefix) != null ? _c : "";
    const ta = (_d = _i.titleAccent) != null ? _d : "\uC790\uC8FC \uBB3B\uB294";
    const ts = (_e = _i.titleSuffix) != null ? _e : " \uC9C8\uBB38";
    const sb = _i.subtitle || "\uAC00\uC785\xB7\uACB0\uC81C\xB7\uAC15\uC5F0\xB7\uB2F5\uC0AC\xB7\uCC45 \uC8FC\uBB38\uC5D0 \uAD00\uD574 \uC790\uC8FC \uB4E4\uC5B4\uC624\uB294 \uC9C8\uBB38\uC744 \uC815\uB9AC\uD588\uC2B5\uB2C8\uB2E4.";
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", style: { justifyContent: "center" } }, eb), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, tp, /* @__PURE__ */ React.createElement("span", { className: "accent" }, ta), ts), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle", style: { margin: "16px auto 0" } }, sb));
  })()), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "\uC9C8\uBB38 \uB610\uB294 \uB2F5\uBCC0 \uAC80\uC0C9...",
      value: search,
      onChange: (e) => setSearch(e.target.value),
      style: { width: 280, padding: "10px 14px" }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 12, marginBottom: 40, flexWrap: "wrap" } }, categories.map((c) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: c,
      type: "button",
      onClick: () => setCategory(c),
      style: {
        padding: "10px 20px",
        border: category === c ? "1px solid var(--gold)" : "1px solid var(--line-2)",
        color: category === c ? "var(--gold)" : "var(--ink-2)",
        background: "transparent",
        fontSize: 12,
        letterSpacing: "0.1em",
        cursor: "pointer"
      }
    },
    c
  ))), filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 48, textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14 } }, "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uC9C8\uBB38\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 32 } }, groupKeys.map((k) => /* @__PURE__ */ React.createElement("section", { key: k }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.22em", marginBottom: 12 } }, k.toUpperCase()), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 } }, grouped[k].map((f) => {
    const open = openId === f.id;
    return /* @__PURE__ */ React.createElement("li", { key: f.id, className: "card", style: { padding: 0, overflow: "hidden" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => setOpenId(open ? null : f.id),
        style: {
          all: "unset",
          cursor: "pointer",
          display: "block",
          width: "100%",
          padding: "16px 20px",
          textAlign: "left"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: 15, lineHeight: 1.5 } }, "Q. ", f.question), /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 14 } }, open ? "\u2212" : "+"))
    ), open && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 18px", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, lineHeight: 1.9, marginTop: 14, whiteSpace: "pre-wrap" } }, "A. ", f.answer)));
  })))))));
};
Object.assign(window, { LegalPage, FaqPage });

})();

(function(){
const PlacePage = ({ go, kind, user }) => {
  var _a, _b;
  const KIND_FALLBACK = {
    eat: { categories: ["\uC804\uD1B5 \uD55C\uC815\uC2DD", "\uD5A5\uD1A0 \uC74C\uC2DD", "\uC2DC\uC7A5 \uBA39\uAC70\uB9AC", "\uC81C\uCCA0 \uC2DD\uC7AC", "\uC8FC\uC548\uC0C1\xB7\uBC1C\uD6A8"] },
    sleep: { categories: ["\uD55C\uC625 \uC2A4\uD14C\uC774", "\uACE0\uD0DD / \uC885\uAC00", "\uAC8C\uC2A4\uD2B8\uD558\uC6B0\uC2A4", "\uD15C\uD50C \uC2A4\uD14C\uC774", "\uB18D\uAC00 \uCCB4\uD5D8"] },
    shop: { categories: ["\uC804\uD1B5 \uACF5\uC608", "\uC9C0\uC5ED \uD1A0\uC0B0\uBB3C", "\uC758\uB958\xB7\uC804\uD1B5 \uC9C1\uBB3C", "\uB3C4\uC790\xB7\uAE08\uC18D", "\uBCF4\uC874\xB7\uBC1C\uD6A8 \uC2DD\uD488"] }
  };
  const _sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
  const _intro = _sc[`${kind}Intro`] || _sc.eatIntro || {};
  const meta = {
    eyebrow: _intro.eyebrow || "EAT \xB7 \uBA39\uACE0 \uB180\uC790",
    title: _intro.title || "\uBA39\uACE0 \uB180\uC790",
    sub: _intro.sub || "\uD55C\uAD6D\uC758 \uB9DB, \uD55C \uB07C\uC758 \uC778\uBB38\uD559",
    desc: _intro.desc || "\uC2DD(\u98DF) \u2014 \uC9C0\uC5ED\uC758 \uC2DD\uC7AC\uB8CC\uC640 \uC190\uB9DB\uC744 \uB530\uB77C\uAC00\uB294 \uC5EC\uC815. \uBC45\uAE30\uB178\uC790\uC640 \uD568\uAED8 \uAC80\uC99D\uB41C \uC2DD\uB2F9\uACFC \uC885\uAC00 \uC74C\uC2DD\uC744 \uB9CC\uB0A9\uB2C8\uB2E4.",
    accent: _intro.accent || "#E8A540",
    categories: Array.isArray(_intro.categories) && _intro.categories.length > 0 ? _intro.categories : (KIND_FALLBACK[kind] || KIND_FALLBACK.eat).categories
  };
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("header", { style: { marginBottom: 32 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, meta.eyebrow), /* @__PURE__ */ React.createElement("h1", { className: "section-title", style: { display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", null, meta.title), /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: "0.55em", color: meta.accent, fontStyle: "italic", fontWeight: 400 } }, meta.sub)), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle", style: { maxWidth: 780 } }, meta.desc)), /* @__PURE__ */ React.createElement("div", { className: "card card-gold", style: { padding: "18px 22px", marginBottom: 32, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 240 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 6 } }, "\u884C\u6587 \xB7 \uD589\uBB38"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: 0, fontSize: 13, lineHeight: 1.8 } }, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--ink)" } }, "\uC758\uC2DD\uC8FC(\u8863\u98DF\u4F4F) + \uD589\uBB38(\u884C\u6587)"), " \u2014 \uC0AC\uB78C\uC774 \uC0AC\uB294 \uB370 \uD544\uC694\uD55C 4 \uAC00\uC9C0 \uC694\uC18C\uAC00 \uD55C \uC5EC\uC815\uC5D0\uC11C \uB9CC\uB098\uB294 \uACF3\uC785\uB2C8\uB2E4. \uBA39\uACE0, \uC790\uACE0, \uC0AC\uACE0, \uADF8\uB9AC\uACE0 \uAE38\uC5D0\uC11C \uAE00\uC744 \uB9CC\uB098\uB294 \uC778\uBB38\uD559 \uC5EC\uD589."))), meta.categories && meta.categories.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 } }, meta.categories.map((c) => /* @__PURE__ */ React.createElement("span", { key: c, className: "badge", style: { borderColor: "var(--gold-dim)", color: "var(--gold)" } }, c))), (() => {
    const items = Array.isArray(_sc[`${kind}Items`]) ? _sc[`${kind}Items`].filter(Boolean) : [];
    if (items.length === 0) {
      return /* @__PURE__ */ React.createElement("section", { className: "card", style: { padding: 32, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.24em", marginBottom: 10 } }, "RESERVATION \xB7 \uC608\uC57D \uC548\uB0B4"), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 26, marginBottom: 14 } }, "\uACE7 \uB9CC\uB098\uC694"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, lineHeight: 1.9, maxWidth: 560, margin: "0 auto 22px" } }, "\uD050\uB808\uC774\uC158\xB7\uAC80\uC99D\uC744 \uAC70\uCE5C ", meta.title.replace("\uB180\uC790", "").trim(), " \uBAA9\uB85D\uC774 \uACE7 \uC5F4\uB9BD\uB2C8\uB2E4. \uC5C5\uB370\uC774\uD2B8 \uC54C\uB9BC\uC744 \uBC1B\uACE0 \uC2F6\uC73C\uC2DC\uBA74 \uD68C\uC6D0\uAC00\uC785 \uD6C4 \uC54C\uB9BC \uC124\uC815\uC744 \uCF1C \uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" } }, !user ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: () => go("signup") }, "\uD68C\uC6D0\uAC00\uC785 \u2192") : /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: () => go("community") }, "\uCEE4\uBBA4\uB2C8\uD2F0\uC5D0\uC11C \uD568\uAED8 \uC774\uC57C\uAE30 \u2192"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: () => go("tour") }, "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8 \uB458\uB7EC\uBCF4\uAE30")));
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 24, marginBottom: 18 } }, meta.title.replace("\uB180\uC790", "").trim()), /* @__PURE__ */ React.createElement("div", { className: "grid grid-3", style: { marginBottom: 48 } }, items.map((it, i) => {
      const tagList = typeof it.tags === "string" ? it.tags.split(/[,·]/).map((s) => s.trim()).filter(Boolean) : [];
      const Wrap = it.link ? "a" : "article";
      const wrapProps = it.link ? { href: it.link, target: "_blank", rel: "noopener noreferrer" } : {};
      return /* @__PURE__ */ React.createElement(
        Wrap,
        {
          key: it.id || i,
          className: "card",
          ...wrapProps,
          style: { padding: 0, overflow: "hidden", display: "block", textDecoration: "none", color: "inherit", background: "var(--bg)" }
        },
        /* @__PURE__ */ React.createElement("div", { style: { aspectRatio: "4/3", background: "var(--bg-2)", overflow: "hidden" } }, it.imageUrl ? /* @__PURE__ */ React.createElement("img", { src: it.imageUrl, alt: it.name || "", style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }) : window.CoverPlaceholder ? /* @__PURE__ */ React.createElement(window.CoverPlaceholder, { aspectRatio: "4/3", iconSize: 64 }) : null),
        /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 20px" } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 8, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 } }, /* @__PURE__ */ React.createElement("span", null, String(i + 1).padStart(2, "0"), it.region ? ` \xB7 ${it.region}` : ""), it.category && /* @__PURE__ */ React.createElement("span", { style: { color: meta.accent } }, it.category)), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 6 } }, it.name), it.address && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginBottom: 8 } }, it.address), it.desc && /* @__PURE__ */ React.createElement("p", { className: "dim bgnj-multiline", style: { fontSize: 13, lineHeight: 1.6, marginBottom: tagList.length > 0 ? 10 : 0 } }, it.desc), tagList.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap" } }, tagList.slice(0, 4).map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "badge", style: { fontSize: 9 } }, t))))
      );
    })));
  })()));
};
const EatPage = ({ go, user }) => /* @__PURE__ */ React.createElement(PlacePage, { go, user, kind: "eat" });
const SleepPage = ({ go, user }) => /* @__PURE__ */ React.createElement(PlacePage, { go, user, kind: "sleep" });
const ShopPage = ({ go, user }) => /* @__PURE__ */ React.createElement(PlacePage, { go, user, kind: "shop" });
Object.assign(window, { EatPage, SleepPage, ShopPage });

})();

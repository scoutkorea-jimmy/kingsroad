(function(){
const HomeNextPage = ({ go }) => {
  const G = window.BGNJ_GUARD || {
    arr: (fn) => {
      try {
        const v = fn();
        return Array.isArray(v) ? v : [];
      } catch (e) {
        return [];
      }
    },
    call: (fn, fb) => {
      try {
        const v = fn();
        return v === void 0 ? fb : v;
      } catch (e) {
        return fb;
      }
    }
  };
  const sc = React.useMemo(() => {
    var _a, _b;
    return ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
  }, []);
  const hero = sc.hero || {};
  const heroCtas = [
    { icon: "\u{1F4CB}", label: "\uD604\uB300 \uC0AC\uAD00 \uBAA8\uC9D1", action: () => go("community") },
    { icon: "\u{1F5FA}", label: "\uD0D0\uBC29 \uD504\uB85C\uADF8\uB7A8 \uC2E0\uCCAD\uD558\uAE30", action: () => go("tour") },
    { icon: "\u{1F4D6}", label: "\uCD9C\uAC04 \uC2E4\uB85D (\uB3C4\uC11C)", action: () => go("book") },
    { icon: "\u25B6", label: "\uC601\uC0C1 \uC2E4\uB85D (\uC720\uD29C\uBE0C)", action: () => {
      try {
        window.open("https://www.youtube.com/@banginoja", "_blank", "noopener");
      } catch (e) {
      }
    } }
  ];
  const programs = [
    {
      title: "\uD0D0\uBC29 \uD504\uB85C\uADF8\uB7A8",
      desc: "\uC655\uC758 \uAE38\uC744 \uB530\uB77C\n\uC5ED\uC0AC \uC18D \uD604\uC7A5\uC744 \uAC77\uB2E4",
      cta: "\uD504\uB85C\uADF8\uB7A8 \uBCF4\uAE30 \u2192",
      action: () => go("tour"),
      variant: "warm"
    },
    {
      title: "\uCD9C\uAC04 \uC2E4\uB85D",
      desc: "\uC6B0\uB9AC\uAC00 \uAE30\uB85D\uD55C\n\uC5ED\uC0AC\uC758 \uC21C\uAC04\uB4E4",
      cta: "\uB3C4\uC11C \uBCF4\uAE30 \u2192",
      action: () => go("book"),
      variant: "cream"
    },
    {
      title: "\uC5B8\uB860 \uAE30\uB85D",
      desc: "\uC5B8\uB860\uC774 \uAE30\uB85D\uD55C\n\uBC45\uAE30\uB178\uC790\uC758 \uBC1C\uC790\uCDE8",
      cta: "\uAE30\uC0AC \uBCF4\uAE30 \u2192",
      action: () => go("column"),
      variant: "light"
    },
    {
      title: "\uC601\uC0C1 \uC2E4\uB85D",
      desc: "5\uBD84 \uC5ED\uC0AC \uC774\uC57C\uAE30\uBD80\uD130\n\uD604\uC7A5 \uD0D0\uBC29 \uC601\uC0C1\uAE4C\uC9C0",
      cta: "\uC601\uC0C1 \uBCF4\uB7EC\uAC00\uAE30 \u2192",
      action: () => {
        try {
          window.open("https://www.youtube.com/@banginoja", "_blank", "noopener");
        } catch (e) {
        }
      },
      variant: "dark"
    }
  ];
  const statsData = [
    { icon: "\u{1F4CB}", label: "\uC0AC\uCD08(\uAE30\uB85D)", value: "1,200+", sub: "\uD0D0\uBC29 \uAE30\uB85D \uCF58\uD150\uCE20" },
    { icon: "\u{1F5FA}", label: "\uD0D0\uBC29 \uD504\uB85C\uADF8\uB7A8", value: "40+", sub: "\uB2E4\uC591\uD55C \uC5ED\uC0AC\uD0D0\uBC29 \uCF54\uC2A4" },
    { icon: "\u{1F465}", label: "\uCC38\uC5EC\uD55C \uC0AC\uAD00(\uD0D0\uBC29\uC790)", value: "3,000+", sub: "\uD568\uAED8\uD55C \uC778\uBB38\uAE30\uD589 \uB3D9\uD589" },
    { icon: "\u{1F4F0}", label: "\uC5B8\uB860 \uBCF4\uB3C4", value: "100+", sub: "\uC5B8\uB860\xB7\uBC29\uC1A1 \uBCF4\uB3C4" },
    { icon: "\u2764", label: "\uB098\uB214\uACFC \uAE30\uBD80", value: "20%", sub: "\uC218\uC775\uC758 20% \uC0AC\uD68C \uD658\uC6D0" }
  ];
  const books = G.arr(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_BOOKS) == null ? void 0 : _a.list) == null ? void 0 : _b.call(_a, { status: "published" });
  });
  const bookCovers = books.filter((b) => b.coverDataUri).slice(0, 3);
  return /* @__PURE__ */ React.createElement("div", { className: "hn-page" }, /* @__PURE__ */ React.createElement("section", { className: "hn-hero" }, (hero.bgDesktopUrl || hero.bgMobileUrl) && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "hn-hero-bg",
      "aria-hidden": "true",
      style: { backgroundImage: `url(${hero.bgDesktopUrl || hero.bgMobileUrl})` }
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "hn-hero-overlay", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "container hn-hero-inner" }, /* @__PURE__ */ React.createElement("div", { className: "hn-hero-text" }, /* @__PURE__ */ React.createElement("h1", { className: "hn-title" }, "\uC2DC\uAC04\uC744 \uAC77\uACE0,", /* @__PURE__ */ React.createElement("br", null), "\uC5ED\uC0AC\uB97C \uAE30\uB85D\uD558\uACE0,", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "hn-title-accent" }, "\uC0AC\uB78C\uC744 \uB9CC\uB098\uB294 \uC778\uBB38\uAE30\uD589")), /* @__PURE__ */ React.createElement("p", { className: "hn-subtitle-bold" }, "\uBC45\uAE30\uB178\uC790\uB294 \uD604\uB300\uC758 \uC0AC\uAD00\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("p", { className: "hn-desc" }, "\uC870\uC120\uC758 \uC0AC\uAD00\uC774 \uC2DC\uB300\uB97C \uAE30\uB85D\uD588\uB4EF,", /* @__PURE__ */ React.createElement("br", null), "\uC624\uB298 \uC6B0\uB9AC\uB294 \uAE38 \uC704\uC5D0\uC11C \uC0AC\uB78C\uACFC \uACF5\uAC04, \uBB38\uD654\uB97C \uAE30\uB85D\uD569\uB2C8\uB2E4.", /* @__PURE__ */ React.createElement("br", null), "\uC624\uB298\uC758 \uACBD\uD5D8\uC744 \uB0B4\uC77C\uC758 \uC2E4\uB85D\uC73C\uB85C \uB0A8\uAE30\uB294 \uC778\uBB38\uD0D0\uBC29 \uD50C\uB7AB\uD3FC\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { className: "hn-hero-ctas" }, heroCtas.map((c) => /* @__PURE__ */ React.createElement("button", { key: c.label, type: "button", className: "hn-hero-cta-btn", onClick: c.action }, /* @__PURE__ */ React.createElement("span", { className: "hn-hero-cta-icon" }, c.icon), /* @__PURE__ */ React.createElement("span", null, c.label))))))), /* @__PURE__ */ React.createElement("section", { className: "hn-programs" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hn-programs-grid" }, programs.map((p) => /* @__PURE__ */ React.createElement(
    "article",
    {
      key: p.title,
      className: `hn-program-card hn-program-card--${p.variant}`,
      onClick: p.action,
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          p.action();
        }
      }
    },
    /* @__PURE__ */ React.createElement("h3", { className: "hn-program-title" }, p.title),
    /* @__PURE__ */ React.createElement("p", { className: "hn-program-desc" }, p.desc),
    p.variant === "cream" && bookCovers.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "hn-program-books" }, bookCovers.map((b) => /* @__PURE__ */ React.createElement(
      "img",
      {
        key: b.id,
        src: b.coverDataUri,
        alt: b.title,
        className: "hn-program-book-thumb"
      }
    ))),
    p.variant === "dark" && /* @__PURE__ */ React.createElement("div", { className: "hn-program-yt-icon", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 48 34", width: "48", height: "34" }, /* @__PURE__ */ React.createElement("rect", { rx: "8", width: "48", height: "34", fill: "#FF0000" }), /* @__PURE__ */ React.createElement("polygon", { points: "19,8 19,26 34,17", fill: "#FFF" }))),
    /* @__PURE__ */ React.createElement("span", { className: "hn-program-cta" }, p.cta)
  ))))), /* @__PURE__ */ React.createElement("section", { className: "hn-stats" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hn-stats-grid" }, statsData.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.label, className: "hn-stat-item" }, /* @__PURE__ */ React.createElement("span", { className: "hn-stat-icon" }, s.icon), /* @__PURE__ */ React.createElement("div", { className: "hn-stat-body" }, /* @__PURE__ */ React.createElement("div", { className: "hn-stat-label" }, s.label), /* @__PURE__ */ React.createElement("div", { className: "hn-stat-value" }, s.value), /* @__PURE__ */ React.createElement("div", { className: "hn-stat-sub" }, s.sub))))))), /* @__PURE__ */ React.createElement("section", { className: "hn-bottom" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hn-bottom-grid" }, /* @__PURE__ */ React.createElement("div", { className: "hn-bottom-quote" }, /* @__PURE__ */ React.createElement("blockquote", { className: "hn-quote-text" }, '"\uD55C \uAC78\uC74C\uC758 \uAE30\uB85D\uC774', /* @__PURE__ */ React.createElement("br", null), '\uD55C \uC2DC\uB300\uC758 \uAE30\uC5B5\uC774 \uB429\uB2C8\uB2E4."')), /* @__PURE__ */ React.createElement("div", { className: "hn-bottom-about" }, /* @__PURE__ */ React.createElement("p", { className: "hn-about-text" }, "\uBC45\uAE30\uB178\uC790\uB294 \uC0AC\uB78C\uACFC \uACF5\uAC04, \uC2DC\uAC04\uACFC \uBB38\uD654\uB97C \uC5F0\uACB0\uD558\uC5EC \uC624\uB298\uC758 \uACBD\uD5D8\uC744 \uB0B4\uC77C\uC758 \uAE30\uB85D\uC73C\uB85C \uB0A8\uAE41\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "hn-about-btn", onClick: () => go("column") }, "\uBC45\uAE30\uB178\uC790 \uC18C\uAC1C \uBCF4\uAE30 \u2192")), /* @__PURE__ */ React.createElement("div", { className: "hn-bottom-cta" }, /* @__PURE__ */ React.createElement("h3", { className: "hn-cta-heading" }, "\uD604\uB300 \uC0AC\uAD00\uC774 \uB418\uC5B4\uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement("p", { className: "hn-cta-desc" }, "\uB2F9\uC2E0\uC758 \uC2DC\uC120\uACFC \uAE30\uB85D\uC774", /* @__PURE__ */ React.createElement("br", null), "\uC5ED\uC0AC\uAC00 \uB418\uB294 \uAE38\uC5D0 \uD568\uAED8 \uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "hn-cta-btn", onClick: () => go("signup") }, "\uD604\uB300 \uC0AC\uAD00\uB2E8 \uAC00\uC785\uD558\uAE30 \u2192"))))));
};
Object.assign(window, { HomeNextPage });

})();

(function(){
const HnImageSlot = ({ url, label, onUpload, onRemove }) => {
  const ref = React.useRef(null);
  const handleFile = async (e) => {
    var _a, _b, _c, _d, _e;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    try {
      const { url: uploaded } = await window.BGNJ_MEDIA.uploadFile(file, { folder: "home-next", maxBytes: 5 * 1024 * 1024 });
      onUpload(uploaded);
    } catch (err) {
      try {
        if (file.size > 1.5 * 1024 * 1024) {
          (_c = (_b = window.BGNJ_TOAST) == null ? void 0 : _b.error) == null ? void 0 : _c.call(_b, "R2 \uC5C5\uB85C\uB4DC \uC2E4\uD328 + \uD30C\uC77C\uC774 1.5MB \uCD08\uACFC");
          return;
        }
        const dataUri = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        onUpload(dataUri);
      } catch (err2) {
        (_e = (_d = window.BGNJ_TOAST) == null ? void 0 : _d.error) == null ? void 0 : _e.call(_d, "\uC774\uBBF8\uC9C0 \uC77D\uAE30 \uC2E4\uD328: " + ((err2 == null ? void 0 : err2.message) || ""));
      }
    }
    if (ref.current) ref.current.value = "";
  };
  return /* @__PURE__ */ React.createElement("div", { className: "hn-admin-slot" }, /* @__PURE__ */ React.createElement("div", { className: "hn-admin-slot-label" }, label), /* @__PURE__ */ React.createElement("div", { className: "hn-admin-slot-preview", onClick: () => {
    var _a;
    return (_a = ref.current) == null ? void 0 : _a.click();
  } }, url ? /* @__PURE__ */ React.createElement("img", { src: url, alt: label, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--ink-3)" } }, "\uD074\uB9AD\uD558\uC5EC \uC5C5\uB85C\uB4DC")), /* @__PURE__ */ React.createElement("input", { ref, type: "file", accept: "image/*", style: { display: "none" }, onChange: handleFile }), url && /* @__PURE__ */ React.createElement("button", { type: "button", className: "hn-admin-slot-remove", onClick: onRemove }, "\u2715"));
};
const HomeNextPage = ({ go }) => {
  var _a, _b, _c;
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
  const [scTick, setScTick] = React.useState(0);
  React.useEffect(() => {
    const onR = () => setScTick((v) => v + 1);
    window.addEventListener("bgnj-site-content-refresh", onR);
    return () => window.removeEventListener("bgnj-site-content-refresh", onR);
  }, []);
  const sc = React.useMemo(() => {
    var _a2, _b2;
    return ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
  }, [scTick]);
  const hero = sc.hero || {};
  const hn = sc.homeNext || {};
  const isAdmin = !!((_c = (_b = (_a = window.BGNJ_AUTH) == null ? void 0 : _a.currentUser) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.isAdmin);
  const [adminOpen, setAdminOpen] = React.useState(false);
  const saveHn = async (patch) => {
    var _a2, _b2, _c2, _d;
    try {
      await ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.saveSection) == null ? void 0 : _b2.call(_a2, "homeNext", patch));
      setScTick((v) => v + 1);
    } catch (err) {
      (_d = (_c2 = window.BGNJ_TOAST) == null ? void 0 : _c2.error) == null ? void 0 : _d.call(_c2, "\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    }
  };
  const updateImage = (key, index, url) => {
    const arr = [...hn[key] || []];
    arr[index] = url || "";
    saveHn({ [key]: arr });
  };
  const [postsTick, setPostsTick] = React.useState(0);
  const [toursTick, setToursTick] = React.useState(0);
  React.useEffect(() => {
    const onP = () => setPostsTick((v) => v + 1);
    const onT = () => setToursTick((v) => v + 1);
    window.addEventListener("bgnj-posts-refresh", onP);
    window.addEventListener("bgnj-tours-refresh", onT);
    return () => {
      window.removeEventListener("bgnj-posts-refresh", onP);
      window.removeEventListener("bgnj-tours-refresh", onT);
    };
  }, []);
  const allPosts = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.listPosts) == null ? void 0 : _b2.call(_a2);
  }), [postsTick]);
  const activeTours = React.useMemo(() => {
    return G.arr(() => {
      var _a2, _b2;
      return (_b2 = (_a2 = window.BGNJ_TOURS) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
    }).filter((t) => t && !t.hidden);
  }, [toursTick]);
  const pressCount = React.useMemo(() => {
    return allPosts.filter((p) => {
      const cat = String(p.category || "").toLowerCase();
      const board = String(p.boardName || p.board || "").toLowerCase();
      return cat.includes("\uC5B8\uB860") || board.includes("\uC5B8\uB860");
    }).length;
  }, [allPosts]);
  const ctaIcons = hn.ctaIcons || [];
  const programImages = hn.programImages || [];
  const heroCtas = [
    { label: "\uD604\uB300 \uC0AC\uAD00\n\uBAA8\uC9D1", action: () => go("community") },
    { label: "\uD0D0\uBC29 \uD504\uB85C\uADF8\uB7A8\n\uC2E0\uCCAD\uD558\uAE30", action: () => go("tour") },
    { label: "\uCD9C\uAC04 \uC2E4\uB85D\n(\uB3C4\uC11C)", action: () => go("book") },
    { label: "\uC601\uC0C1 \uC2E4\uB85D\n(\uC720\uD29C\uBE0C)", action: () => {
      try {
        window.open("https://www.youtube.com/@banginoja", "_blank", "noopener");
      } catch (e) {
      }
    } }
  ];
  const programs = [
    { title: "\uD0D0\uBC29 \uD504\uB85C\uADF8\uB7A8", desc: "\uC655\uC758 \uAE38\uC744 \uB530\uB77C\n\uC5ED\uC0AC \uC18D \uD604\uC7A5\uC744 \uAC77\uB2E4", cta: "\uD504\uB85C\uADF8\uB7A8 \uBCF4\uAE30 \u2192", action: () => go("tour"), variant: "warm" },
    { title: "\uCD9C\uAC04 \uC2E4\uB85D", desc: "\uC6B0\uB9AC\uAC00 \uAE30\uB85D\uD55C\n\uC5ED\uC0AC\uC758 \uC21C\uAC04\uB4E4", cta: "\uB3C4\uC11C \uBCF4\uAE30 \u2192", action: () => go("book"), variant: "cream" },
    { title: "\uC5B8\uB860 \uAE30\uB85D", desc: "\uC5B8\uB860\uC774 \uAE30\uB85D\uD55C\n\uBC45\uAE30\uB178\uC790\uC758 \uBC1C\uC790\uCDE8", cta: "\uAE30\uC0AC \uBCF4\uAE30 \u2192", action: () => go("column"), variant: "light" },
    { title: "\uC601\uC0C1 \uC2E4\uB85D", desc: "5\uBD84 \uC5ED\uC0AC \uC774\uC57C\uAE30\uBD80\uD130\n\uD604\uC7A5 \uD0D0\uBC29 \uC601\uC0C1\uAE4C\uC9C0", cta: "\uC601\uC0C1 \uBCF4\uB7EC\uAC00\uAE30 \u2192", action: () => {
      try {
        window.open("https://www.youtube.com/@banginoja", "_blank", "noopener");
      } catch (e) {
      }
    }, variant: "dark" }
  ];
  const books = G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_BOOKS) == null ? void 0 : _a2.list) == null ? void 0 : _b2.call(_a2, { status: "published" });
  });
  const bookCovers = books.filter((b) => b.coverDataUri).slice(0, 3);
  const overrides = hn.statsOverrides || {};
  const statsData = [
    { icon: ctaIcons[0], label: "\uC0AC\uCD08(\uAE30\uB85D)", value: allPosts.length > 0 ? `${allPosts.length.toLocaleString("ko-KR")}+` : overrides.posts || "0", sub: "\uD0D0\uBC29 \uAE30\uB85D \uCF58\uD150\uCE20" },
    { icon: ctaIcons[1], label: "\uD0D0\uBC29 \uD504\uB85C\uADF8\uB7A8", value: activeTours.length > 0 ? `${activeTours.length}+` : overrides.tours || "0", sub: "\uB2E4\uC591\uD55C \uC5ED\uC0AC\uD0D0\uBC29 \uCF54\uC2A4" },
    { icon: ctaIcons[2], label: "\uCC38\uC5EC\uD55C \uC0AC\uAD00(\uD0D0\uBC29\uC790)", value: overrides.members || "0", sub: "\uD568\uAED8\uD55C \uC778\uBB38\uAE30\uD589 \uB3D9\uD589" },
    { icon: ctaIcons[3], label: "\uC5B8\uB860 \uBCF4\uB3C4", value: pressCount > 0 ? `${pressCount}+` : overrides.press || "0", sub: "\uC5B8\uB860\xB7\uBC29\uC1A1 \uBCF4\uB3C4" },
    { icon: null, label: "\uB098\uB214\uACFC \uAE30\uBD80", value: overrides.donation || "20%", sub: "\uC218\uC775\uC758 20% \uC0AC\uD68C \uD658\uC6D0" }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "hn-page" }, isAdmin && /* @__PURE__ */ React.createElement("div", { className: "hn-admin-panel" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "hn-admin-toggle", onClick: () => setAdminOpen(!adminOpen) }, "\u{1F6E0} \uD648 \uD504\uB9AC\uBDF0 \uC774\uBBF8\uC9C0 \uC124\uC815 ", adminOpen ? "\u25B2" : "\u25BC"), adminOpen && /* @__PURE__ */ React.createElement("div", { className: "hn-admin-body" }, /* @__PURE__ */ React.createElement("div", { className: "hn-admin-section" }, /* @__PURE__ */ React.createElement("h4", null, "CTA \uBC84\uD2BC \uC544\uC774\uCF58 (4\uAC1C)"), /* @__PURE__ */ React.createElement("div", { className: "hn-admin-row" }, heroCtas.map((c, i) => /* @__PURE__ */ React.createElement(
    HnImageSlot,
    {
      key: i,
      url: ctaIcons[i],
      label: c.label.replace("\n", " "),
      onUpload: (url) => updateImage("ctaIcons", i, url),
      onRemove: () => updateImage("ctaIcons", i, "")
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "hn-admin-section" }, /* @__PURE__ */ React.createElement("h4", null, "\uD504\uB85C\uADF8\uB7A8 \uCE74\uB4DC \uBC30\uACBD \uC774\uBBF8\uC9C0 (4\uAC1C)"), /* @__PURE__ */ React.createElement("div", { className: "hn-admin-row" }, programs.map((p, i) => /* @__PURE__ */ React.createElement(
    HnImageSlot,
    {
      key: i,
      url: programImages[i],
      label: p.title,
      onUpload: (url) => updateImage("programImages", i, url),
      onRemove: () => updateImage("programImages", i, "")
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "hn-admin-section" }, /* @__PURE__ */ React.createElement("h4", null, "\uD1B5\uACC4 \uC218\uB3D9 \uC785\uB825 (\uB370\uC774\uD130 \uC5C6\uC744 \uB54C \uD45C\uC2DC)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" } }, [
    { key: "posts", label: "\uC0AC\uCD08(\uAE30\uB85D)" },
    { key: "tours", label: "\uD0D0\uBC29 \uD504\uB85C\uADF8\uB7A8" },
    { key: "members", label: "\uD68C\uC6D0 \uC218" },
    { key: "press", label: "\uC5B8\uB860\uBCF4\uB3C4" },
    { key: "donation", label: "\uB098\uB214 \uBE44\uC728" }
  ].map(({ key, label }) => /* @__PURE__ */ React.createElement("label", { key, style: { fontSize: 12 } }, label, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: overrides[key] || "",
      className: "field-input",
      style: { width: 80, marginLeft: 6, fontSize: 12, padding: "4px 6px" },
      onChange: (e) => saveHn({ statsOverrides: { ...overrides, [key]: e.target.value } })
    }
  ))))))), /* @__PURE__ */ React.createElement("section", { className: "hn-hero" }, (hero.bgDesktopUrl || hero.bgMobileUrl) && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "hn-hero-bg",
      "aria-hidden": "true",
      style: { backgroundImage: `url(${hero.bgDesktopUrl || hero.bgMobileUrl})` }
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "hn-hero-overlay", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "container hn-hero-inner" }, /* @__PURE__ */ React.createElement("div", { className: "hn-hero-text" }, /* @__PURE__ */ React.createElement("h1", { className: "hn-title" }, "\uC2DC\uAC04\uC744 \uAC77\uACE0,", /* @__PURE__ */ React.createElement("br", null), "\uC5ED\uC0AC\uB97C \uAE30\uB85D\uD558\uACE0,", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "hn-title-accent" }, "\uC0AC\uB78C\uC744 \uB9CC\uB098\uB294 \uC778\uBB38\uAE30\uD589")), /* @__PURE__ */ React.createElement("p", { className: "hn-subtitle-bold" }, "\uBC45\uAE30\uB178\uC790\uB294 \uD604\uB300\uC758 \uC0AC\uAD00\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("p", { className: "hn-desc" }, "\uC870\uC120\uC758 \uC0AC\uAD00\uC774 \uC2DC\uB300\uB97C \uAE30\uB85D\uD588\uB4EF,", /* @__PURE__ */ React.createElement("br", null), "\uC624\uB298 \uC6B0\uB9AC\uB294 \uAE38 \uC704\uC5D0\uC11C \uC0AC\uB78C\uACFC \uACF5\uAC04, \uBB38\uD654\uB97C \uAE30\uB85D\uD569\uB2C8\uB2E4.", /* @__PURE__ */ React.createElement("br", null), "\uC624\uB298\uC758 \uACBD\uD5D8\uC744 \uB0B4\uC77C\uC758 \uC2E4\uB85D\uC73C\uB85C \uB0A8\uAE30\uB294 \uC778\uBB38\uD0D0\uBC29 \uD50C\uB7AB\uD3FC\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { className: "hn-hero-ctas" }, heroCtas.map((c, i) => /* @__PURE__ */ React.createElement("button", { key: c.label, type: "button", className: "hn-hero-cta-btn", onClick: c.action }, ctaIcons[i] ? /* @__PURE__ */ React.createElement("img", { src: ctaIcons[i], alt: "", className: "hn-hero-cta-icon-img" }) : /* @__PURE__ */ React.createElement("span", { className: "hn-hero-cta-icon-placeholder" }), /* @__PURE__ */ React.createElement("span", { className: "hn-hero-cta-label" }, c.label))))))), /* @__PURE__ */ React.createElement("section", { className: "hn-programs" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hn-programs-grid" }, programs.map((p, i) => /* @__PURE__ */ React.createElement(
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
    programImages[i] && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "hn-program-card-bg",
        "aria-hidden": "true",
        style: { backgroundImage: `url(${programImages[i]})` }
      }
    ),
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
  ))))), /* @__PURE__ */ React.createElement("section", { className: "hn-stats" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hn-stats-grid" }, statsData.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.label, className: "hn-stat-item" }, s.icon ? /* @__PURE__ */ React.createElement("img", { src: s.icon, alt: "", className: "hn-stat-icon-img" }) : /* @__PURE__ */ React.createElement("span", { className: "hn-stat-icon-placeholder" }, "\u2764"), /* @__PURE__ */ React.createElement("div", { className: "hn-stat-body" }, /* @__PURE__ */ React.createElement("div", { className: "hn-stat-label" }, s.label), /* @__PURE__ */ React.createElement("div", { className: "hn-stat-value" }, s.value), /* @__PURE__ */ React.createElement("div", { className: "hn-stat-sub" }, s.sub))))))), /* @__PURE__ */ React.createElement("section", { className: "hn-bottom" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hn-bottom-grid" }, /* @__PURE__ */ React.createElement("div", { className: "hn-bottom-quote" }, /* @__PURE__ */ React.createElement("blockquote", { className: "hn-quote-text" }, '"\uD55C \uAC78\uC74C\uC758 \uAE30\uB85D\uC774', /* @__PURE__ */ React.createElement("br", null), '\uD55C \uC2DC\uB300\uC758 \uAE30\uC5B5\uC774 \uB429\uB2C8\uB2E4."')), /* @__PURE__ */ React.createElement("div", { className: "hn-bottom-about" }, /* @__PURE__ */ React.createElement("p", { className: "hn-about-text" }, "\uBC45\uAE30\uB178\uC790\uB294 \uC0AC\uB78C\uACFC \uACF5\uAC04, \uC2DC\uAC04\uACFC \uBB38\uD654\uB97C \uC5F0\uACB0\uD558\uC5EC \uC624\uB298\uC758 \uACBD\uD5D8\uC744 \uB0B4\uC77C\uC758 \uAE30\uB85D\uC73C\uB85C \uB0A8\uAE41\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "hn-about-btn", onClick: () => go("column") }, "\uBC45\uAE30\uB178\uC790 \uC18C\uAC1C \uBCF4\uAE30 \u2192")), /* @__PURE__ */ React.createElement("div", { className: "hn-bottom-cta" }, /* @__PURE__ */ React.createElement("h3", { className: "hn-cta-heading" }, "\uD604\uB300 \uC0AC\uAD00\uC774 \uB418\uC5B4\uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement("p", { className: "hn-cta-desc" }, "\uB2F9\uC2E0\uC758 \uC2DC\uC120\uACFC \uAE30\uB85D\uC774", /* @__PURE__ */ React.createElement("br", null), "\uC5ED\uC0AC\uAC00 \uB418\uB294 \uAE38\uC5D0 \uD568\uAED8 \uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "hn-cta-btn", onClick: () => go("signup") }, "\uD604\uB300 \uC0AC\uAD00\uB2E8 \uAC00\uC785\uD558\uAE30 \u2192"))))));
};
Object.assign(window, { HomeNextPage });

})();

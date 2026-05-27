(function(){
const HnImageSlot = ({ url, label, onUpload, onRemove, wide }) => {
  const ref = React.useRef(null);
  const handleFile = async (e) => {
    var _a, _b, _c, _d, _e;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    try {
      const { url: uploaded } = await window.BGNJ_MEDIA.uploadFile(file, { folder: "home-next", maxBytes: 5 * 1024 * 1024 });
      onUpload(uploaded);
    } catch (e2) {
      try {
        if (file.size > 1.5 * 1024 * 1024) {
          (_c = (_b = window.BGNJ_TOAST) == null ? void 0 : _b.error) == null ? void 0 : _c.call(_b, "\uD30C\uC77C\uC774 1.5MB \uCD08\uACFC");
          return;
        }
        const dataUri = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result || ""));
          r.onerror = rej;
          r.readAsDataURL(file);
        });
        onUpload(dataUri);
      } catch (err2) {
        (_e = (_d = window.BGNJ_TOAST) == null ? void 0 : _d.error) == null ? void 0 : _e.call(_d, "\uC774\uBBF8\uC9C0 \uC77D\uAE30 \uC2E4\uD328");
      }
    }
    if (ref.current) ref.current.value = "";
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "#78350F", fontWeight: 500, textAlign: "center", maxWidth: wide ? 120 : 72, lineHeight: 1.3 } }, label), /* @__PURE__ */ React.createElement("div", { onClick: () => {
    var _a;
    return (_a = ref.current) == null ? void 0 : _a.click();
  }, style: {
    width: wide ? 120 : 64,
    height: 64,
    border: "2px dashed #D6D3D1",
    borderRadius: 6,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    overflow: "hidden",
    background: "#FFF"
  } }, url ? /* @__PURE__ */ React.createElement("img", { src: url, alt: label, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--ink-3)" } }, "\uC5C5\uB85C\uB4DC")), /* @__PURE__ */ React.createElement("input", { ref, type: "file", accept: "image/*", style: { display: "none" }, onChange: handleFile }), url && /* @__PURE__ */ React.createElement("button", { type: "button", onClick: onRemove, style: {
    position: "absolute",
    top: 14,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: "none",
    background: "#EF4444",
    color: "#FFF",
    fontSize: 9,
    cursor: "pointer",
    display: "grid",
    placeItems: "center"
  } }, "\u2715"));
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
  const activeTours = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_TOURS) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
  }).filter((t) => t && !t.hidden), [toursTick]);
  const pressCount = React.useMemo(() => allPosts.filter((p) => {
    const cat = String(p.category || "").toLowerCase();
    const board = String(p.boardName || p.board || "").toLowerCase();
    return cat.includes("\uC5B8\uB860") || board.includes("\uC5B8\uB860");
  }).length, [allPosts]);
  const ctaIcons = hn.ctaIcons || [];
  const programImages = hn.programImages || [];
  const statIcons = hn.statIcons || [];
  const overrides = hn.statsOverrides || {};
  const books = G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_BOOKS) == null ? void 0 : _a2.list) == null ? void 0 : _b2.call(_a2, { status: "published" });
  });
  const bookCovers = books.filter((b) => b.coverDataUri).slice(0, 3);
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
  const statsData = [
    { label: "\uC0AC\uCD08(\uAE30\uB85D)", value: allPosts.length > 0 ? `${allPosts.length.toLocaleString("ko-KR")}+` : overrides.posts || "-", sub: "\uD0D0\uBC29 \uAE30\uB85D \uCF58\uD150\uCE20" },
    { label: "\uD0D0\uBC29 \uD504\uB85C\uADF8\uB7A8", value: activeTours.length > 0 ? `${activeTours.length}+` : overrides.tours || "-", sub: "\uB2E4\uC591\uD55C \uC5ED\uC0AC\uD0D0\uBC29 \uCF54\uC2A4" },
    { label: "\uCC38\uC5EC\uD55C \uC0AC\uAD00(\uD0D0\uBC29\uC790)", value: overrides.members || "-", sub: "\uD568\uAED8\uD55C \uC778\uBB38\uAE30\uD589 \uB3D9\uD589" },
    { label: "\uC5B8\uB860 \uBCF4\uB3C4", value: pressCount > 0 ? `${pressCount}+` : overrides.press || "-", sub: "\uC5B8\uB860\xB7\uBC29\uC1A1 \uBCF4\uB3C4" },
    { label: "\uB098\uB214\uACFC \uAE30\uBD80", value: overrides.donation || "20%", sub: "\uC218\uC775\uC758 20% \uC0AC\uD68C \uD658\uC6D0" }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "hn-page" }, isAdmin && /* @__PURE__ */ React.createElement("div", { className: "hn-admin-bar" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "hn-admin-toggle", onClick: () => setAdminOpen(!adminOpen) }, "\u{1F6E0} \uD648 \uD504\uB9AC\uBDF0 \uC774\uBBF8\uC9C0 \uC124\uC815 ", adminOpen ? "\u25B2" : "\u25BC"), adminOpen && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 14px", display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#78350F", marginBottom: 6 } }, "CTA \uBC84\uD2BC \uC544\uC774\uCF58"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, heroCtas.map((c, i) => /* @__PURE__ */ React.createElement(
    HnImageSlot,
    {
      key: i,
      url: ctaIcons[i],
      label: c.label.replace("\n", " "),
      onUpload: (u) => updateImage("ctaIcons", i, u),
      onRemove: () => updateImage("ctaIcons", i, "")
    }
  )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#78350F", marginBottom: 6 } }, "\uD504\uB85C\uADF8\uB7A8 \uCE74\uB4DC \uC774\uBBF8\uC9C0"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, ["\uD0D0\uBC29 \uD504\uB85C\uADF8\uB7A8", "\uCD9C\uAC04 \uC2E4\uB85D", "\uC5B8\uB860 \uAE30\uB85D", "\uC601\uC0C1 \uC2E4\uB85D"].map((t, i) => /* @__PURE__ */ React.createElement(
    HnImageSlot,
    {
      key: i,
      url: programImages[i],
      label: t,
      wide: true,
      onUpload: (u) => updateImage("programImages", i, u),
      onRemove: () => updateImage("programImages", i, "")
    }
  )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#78350F", marginBottom: 6 } }, "\uD1B5\uACC4 \uC544\uC774\uCF58"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, statsData.map((s, i) => /* @__PURE__ */ React.createElement(
    HnImageSlot,
    {
      key: i,
      url: statIcons[i],
      label: s.label,
      onUpload: (u) => updateImage("statIcons", i, u),
      onRemove: () => updateImage("statIcons", i, "")
    }
  )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#78350F", marginBottom: 6 } }, "\uD1B5\uACC4 \uC218\uB3D9 \uAC12"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, [{ k: "posts", l: "\uC0AC\uCD08" }, { k: "tours", l: "\uD0D0\uBC29" }, { k: "members", l: "\uD68C\uC6D0\uC218" }, { k: "press", l: "\uC5B8\uB860" }, { k: "donation", l: "\uB098\uB214" }].map(({ k, l }) => /* @__PURE__ */ React.createElement("label", { key: k, style: { fontSize: 11, display: "flex", alignItems: "center", gap: 4 } }, l, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: overrides[k] || "",
      className: "field-input",
      style: { width: 70, fontSize: 11, padding: "3px 5px" },
      onChange: (e) => saveHn({ statsOverrides: { ...overrides, [k]: e.target.value } })
    }
  ))))))), /* @__PURE__ */ React.createElement("section", { className: "hn-hero" }, (hero.bgDesktopUrl || hero.bgMobileUrl) && /* @__PURE__ */ React.createElement("div", { className: "hn-hero-bg", style: { backgroundImage: `url(${hero.bgDesktopUrl || hero.bgMobileUrl})` } }), /* @__PURE__ */ React.createElement("div", { className: "hn-hero-fade" }), /* @__PURE__ */ React.createElement("div", { className: "container hn-hero-inner" }, /* @__PURE__ */ React.createElement("h1", { className: "hn-h1" }, "\uC2DC\uAC04\uC744 \uAC77\uACE0,", /* @__PURE__ */ React.createElement("br", null), "\uC5ED\uC0AC\uB97C \uAE30\uB85D\uD558\uACE0,", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "hn-h1-accent" }, "\uC0AC\uB78C\uC744 \uB9CC\uB098\uB294 \uC778\uBB38\uAE30\uD589")), /* @__PURE__ */ React.createElement("p", { className: "hn-lead" }, "\uBC45\uAE30\uB178\uC790\uB294 \uD604\uB300\uC758 \uC0AC\uAD00\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("p", { className: "hn-sub" }, "\uC870\uC120\uC758 \uC0AC\uAD00\uC774 \uC2DC\uB300\uB97C \uAE30\uB85D\uD588\uB4EF,", /* @__PURE__ */ React.createElement("br", null), "\uC624\uB298 \uC6B0\uB9AC\uB294 \uAE38 \uC704\uC5D0\uC11C \uC0AC\uB78C\uACFC \uACF5\uAC04, \uBB38\uD654\uB97C \uAE30\uB85D\uD569\uB2C8\uB2E4.", /* @__PURE__ */ React.createElement("br", null), "\uC624\uB298\uC758 \uACBD\uD5D8\uC744 \uB0B4\uC77C\uC758 \uC2E4\uB85D\uC73C\uB85C \uB0A8\uAE30\uB294 \uC778\uBB38\uD0D0\uBC29 \uD50C\uB7AB\uD3FC\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { className: "hn-cta-row" }, heroCtas.map((c, i) => /* @__PURE__ */ React.createElement("button", { key: i, type: "button", className: "hn-cta-pill", onClick: c.action }, /* @__PURE__ */ React.createElement("span", { className: "hn-cta-pill-icon" }, ctaIcons[i] ? /* @__PURE__ */ React.createElement("img", { src: ctaIcons[i], alt: "" }) : /* @__PURE__ */ React.createElement("span", { className: "hn-cta-pill-ph" })), /* @__PURE__ */ React.createElement("span", { className: "hn-cta-pill-text" }, c.label)))))), /* @__PURE__ */ React.createElement("section", { className: "hn-cards" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hn-cards-grid" }, /* @__PURE__ */ React.createElement(
    "article",
    {
      className: "hn-card hn-card--warm",
      onClick: () => go("tour"),
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go("tour");
        }
      }
    },
    programImages[0] && /* @__PURE__ */ React.createElement("div", { className: "hn-card-img", style: { backgroundImage: `url(${programImages[0]})` } }),
    /* @__PURE__ */ React.createElement("div", { className: "hn-card-body" }, /* @__PURE__ */ React.createElement("h3", { className: "hn-card-title" }, "\uD0D0\uBC29 \uD504\uB85C\uADF8\uB7A8"), /* @__PURE__ */ React.createElement("p", { className: "hn-card-desc" }, "\uC655\uC758 \uAE38\uC744 \uB530\uB77C", /* @__PURE__ */ React.createElement("br", null), "\uC5ED\uC0AC \uC18D \uD604\uC7A5\uC744 \uAC77\uB2E4"), /* @__PURE__ */ React.createElement("span", { className: "hn-card-btn" }, "\uD504\uB85C\uADF8\uB7A8 \uBCF4\uAE30 \u2192"))
  ), /* @__PURE__ */ React.createElement(
    "article",
    {
      className: "hn-card hn-card--cream",
      onClick: () => go("book"),
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go("book");
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "hn-card-img hn-card-img--books" }, programImages[1] ? /* @__PURE__ */ React.createElement("img", { src: programImages[1], alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : bookCovers.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "center", alignItems: "center", height: "100%", padding: "0 12px" } }, bookCovers.map((b) => /* @__PURE__ */ React.createElement("img", { key: b.id, src: b.coverDataUri, alt: b.title, style: { height: "80%", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" } }))) : /* @__PURE__ */ React.createElement("div", { className: "hn-card-img-ph" }, "\uB3C4\uC11C \uC774\uBBF8\uC9C0")),
    /* @__PURE__ */ React.createElement("div", { className: "hn-card-body" }, /* @__PURE__ */ React.createElement("h3", { className: "hn-card-title" }, "\uCD9C\uAC04 \uC2E4\uB85D"), /* @__PURE__ */ React.createElement("p", { className: "hn-card-desc" }, "\uC6B0\uB9AC\uAC00 \uAE30\uB85D\uD55C", /* @__PURE__ */ React.createElement("br", null), "\uC5ED\uC0AC\uC758 \uC21C\uAC04\uB4E4"), /* @__PURE__ */ React.createElement("span", { className: "hn-card-btn" }, "\uB3C4\uC11C \uBCF4\uAE30 \u2192"))
  ), /* @__PURE__ */ React.createElement(
    "article",
    {
      className: "hn-card hn-card--light",
      onClick: () => go("column"),
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go("column");
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "hn-card-img" }, programImages[2] ? /* @__PURE__ */ React.createElement("img", { src: programImages[2], alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("div", { className: "hn-card-img-ph" }, "\uC5B8\uB860 \uC774\uBBF8\uC9C0")),
    /* @__PURE__ */ React.createElement("div", { className: "hn-card-body" }, /* @__PURE__ */ React.createElement("h3", { className: "hn-card-title" }, "\uC5B8\uB860 \uAE30\uB85D"), /* @__PURE__ */ React.createElement("p", { className: "hn-card-desc" }, "\uC5B8\uB860\uC774 \uAE30\uB85D\uD55C", /* @__PURE__ */ React.createElement("br", null), "\uBC45\uAE30\uB178\uC790\uC758 \uBC1C\uC790\uCDE8"), /* @__PURE__ */ React.createElement("span", { className: "hn-card-btn" }, "\uAE30\uC0AC \uBCF4\uAE30 \u2192"))
  ), /* @__PURE__ */ React.createElement(
    "article",
    {
      className: "hn-card hn-card--dark",
      role: "button",
      tabIndex: 0,
      onClick: () => {
        try {
          window.open("https://www.youtube.com/@banginoja", "_blank", "noopener");
        } catch (e) {
        }
      },
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          try {
            window.open("https://www.youtube.com/@banginoja", "_blank", "noopener");
          } catch (e2) {
          }
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "hn-card-img" }, programImages[3] ? /* @__PURE__ */ React.createElement("img", { src: programImages[3], alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("div", { className: "hn-card-img-ph", style: { color: "#A8A29E" } }, "\uC601\uC0C1 \uC774\uBBF8\uC9C0"), /* @__PURE__ */ React.createElement("div", { className: "hn-yt-badge" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 40 28", width: "40", height: "28" }, /* @__PURE__ */ React.createElement("rect", { rx: "6", width: "40", height: "28", fill: "#FF0000" }), /* @__PURE__ */ React.createElement("polygon", { points: "16,6 16,22 29,14", fill: "#FFF" })))),
    /* @__PURE__ */ React.createElement("div", { className: "hn-card-body" }, /* @__PURE__ */ React.createElement("h3", { className: "hn-card-title" }, "\uC601\uC0C1 \uC2E4\uB85D"), /* @__PURE__ */ React.createElement("p", { className: "hn-card-desc" }, "5\uBD84 \uC5ED\uC0AC \uC774\uC57C\uAE30\uBD80\uD130", /* @__PURE__ */ React.createElement("br", null), "\uD604\uC7A5 \uD0D0\uBC29 \uC601\uC0C1\uAE4C\uC9C0"), /* @__PURE__ */ React.createElement("span", { className: "hn-card-btn" }, "\uC601\uC0C1 \uBCF4\uB7EC\uAC00\uAE30 \u2192"))
  )))), /* @__PURE__ */ React.createElement("section", { className: "hn-stats" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hn-stats-row" }, statsData.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: s.label, className: "hn-stat" }, /* @__PURE__ */ React.createElement("span", { className: "hn-stat-ic" }, statIcons[i] ? /* @__PURE__ */ React.createElement("img", { src: statIcons[i], alt: "", className: "hn-stat-ic-img" }) : /* @__PURE__ */ React.createElement("span", { className: "hn-stat-ic-ph" }, ["\u{1F4CB}", "\u{1F5FA}", "\u{1F465}", "\u{1F4F0}", "\u2764"][i])), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "hn-stat-lbl" }, s.label), /* @__PURE__ */ React.createElement("div", { className: "hn-stat-val" }, s.value), /* @__PURE__ */ React.createElement("div", { className: "hn-stat-sub" }, s.sub))))))), /* @__PURE__ */ React.createElement("section", { className: "hn-foot" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hn-foot-grid" }, /* @__PURE__ */ React.createElement("div", { className: "hn-foot-quote" }, /* @__PURE__ */ React.createElement("blockquote", { className: "hn-bq" }, '"\uD55C \uAC78\uC74C\uC758 \uAE30\uB85D\uC774', /* @__PURE__ */ React.createElement("br", null), '\uD55C \uC2DC\uB300\uC758 \uAE30\uC5B5\uC774 \uB429\uB2C8\uB2E4."')), /* @__PURE__ */ React.createElement("div", { className: "hn-foot-about" }, /* @__PURE__ */ React.createElement("p", { className: "hn-foot-about-text" }, "\uBC45\uAE30\uB178\uC790\uB294 \uC0AC\uB78C\uACFC \uACF5\uAC04, \uC2DC\uAC04\uACFC \uBB38\uD654\uB97C \uC5F0\uACB0\uD558\uC5EC", /* @__PURE__ */ React.createElement("br", null), "\uC624\uB298\uC758 \uACBD\uD5D8\uC744 \uB0B4\uC77C\uC758 \uAE30\uB85D\uC73C\uB85C \uB0A8\uAE41\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "hn-foot-about-btn", onClick: () => go("column") }, "\uBC45\uAE30\uB178\uC790 \uC18C\uAC1C \uBCF4\uAE30 \u2192")), /* @__PURE__ */ React.createElement("div", { className: "hn-foot-cta" }, /* @__PURE__ */ React.createElement("h3", { className: "hn-foot-cta-h" }, "\uD604\uB300 \uC0AC\uAD00\uC774 \uB418\uC5B4\uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement("p", { className: "hn-foot-cta-p" }, "\uB2F9\uC2E0\uC758 \uC2DC\uC120\uACFC \uAE30\uB85D\uC774", /* @__PURE__ */ React.createElement("br", null), "\uC5ED\uC0AC\uAC00 \uB418\uB294 \uAE38\uC5D0 \uD568\uAED8 \uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "hn-foot-cta-btn", onClick: () => go("signup") }, "\uD604\uB300 \uC0AC\uAD00\uB2E8 \uAC00\uC785\uD558\uAE30 \u2192"))))));
};
Object.assign(window, { HomeNextPage });

})();

(function(){
class HomeSectionBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(err) {
    return { error: err };
  }
  componentDidCatch(err) {
    var _a, _b, _c, _d;
    try {
      console.error("[HomeSectionBoundary]", this.props.label || "section", err);
    } catch (e) {
    }
    try {
      (_d = (_c = (_b = (_a = window.BGNJ_API) == null ? void 0 : _a.errorLog) == null ? void 0 : _b.report({
        code: "HOME_SECTION_ERROR",
        status: null,
        kind: "render",
        message: (err == null ? void 0 : err.message) || String(err),
        hint: `section=${this.props.label || ""}`,
        url: "",
        pathname: location.pathname,
        origin: location.origin
      })) == null ? void 0 : _c.catch) == null ? void 0 : _d.call(_c, () => {
      });
    } catch (e) {
    }
  }
  render() {
    if (this.state.error) {
      return /* @__PURE__ */ React.createElement("section", { style: { padding: "24px 0", borderBottom: "1px solid var(--line)", textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { className: "mono dim-2", style: { fontSize: 11, letterSpacing: "0.18em" } }, "\u26A0 ", this.props.label || "\uC774 \uC139\uC158", " \uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4"));
    }
    return this.props.children;
  }
}
const RecommendationDetailModal = ({ rec, onClose, go }) => {
  var _a;
  (_a = window.useModalGuard) == null ? void 0 : _a.call(window, { open: true, dirty: false, onClose, onSaveDraft: null, label: (rec == null ? void 0 : rec.name) || "\uC5EC\uD589\uC9C0 \uC0C1\uC138" });
  const tags = Array.isArray(rec.tags) ? rec.tags : typeof rec.tags === "string" ? rec.tags.split(/[,·]/).map((s) => s.trim()).filter(Boolean) : [];
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `${rec.name || "\uCD94\uCC9C"} \uC0C1\uC138`,
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(15,23,42,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 20
      },
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      background: "var(--bg)",
      maxWidth: 720,
      width: "100%",
      maxHeight: "92vh",
      overflow: "auto",
      position: "relative",
      border: "1px solid var(--line)"
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onClose,
        "aria-label": "\uB2EB\uAE30",
        style: {
          position: "absolute",
          top: 14,
          right: 14,
          zIndex: 2,
          width: 36,
          height: 36,
          fontSize: 24,
          background: "var(--bg-2)",
          border: "1px solid var(--line)",
          cursor: "pointer",
          color: "var(--ink)",
          lineHeight: 1,
          fontWeight: 600
        }
      },
      "\xD7"
    ), rec.imageDataUri && /* @__PURE__ */ React.createElement("div", { style: {
      width: "100%",
      height: 280,
      background: `url(${rec.imageDataUri}) center/cover`,
      borderBottom: "1px solid var(--line)"
    } }), /* @__PURE__ */ React.createElement("div", { style: { padding: "28px 28px 24px" } }, rec.region && /* @__PURE__ */ React.createElement("div", { style: {
      display: "inline-block",
      padding: "4px 10px",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.18em",
      color: "var(--ink-2)",
      border: "1px solid var(--line-2)",
      marginBottom: 14
    } }, rec.region), /* @__PURE__ */ React.createElement("h2", { style: {
      fontFamily: "var(--font-serif)",
      fontSize: 32,
      fontWeight: 700,
      color: "var(--ink)",
      lineHeight: 1.2,
      marginBottom: 8
    } }, rec.name || "\uC81C\uBAA9 \uC5C6\uC74C"), rec.subtitle && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--secondary)",
      letterSpacing: "0.04em",
      marginBottom: 18
    } }, rec.subtitle), rec.desc && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, lineHeight: 1.85, color: "var(--ink-2)", marginBottom: 22 } }, rec.desc), tags.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 } }, tags.map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "badge", style: { fontSize: 10 } }, t))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: 18 } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => {
      go("tour");
      onClose();
    } }, "\uC774 \uC9C0\uC5ED \uD22C\uC5B4 \uBCF4\uAE30 \u2192"), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onClose }, "\uB2EB\uAE30"))))
  );
};
const truncatePreview = (text, max = 110) => {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  const slice = s.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut + "\u2026";
};
const HOME_TEXT_DEFAULT = {
  recEyebrow: "\uC6B4\uC601\uC790\uAC00 \uB2E4\uB140\uC628 \uACF3",
  recTitlePrefix: "\uC694\uC998 ",
  recTitleAccent: "\uB208\uC5D0 \uB4E4\uC5B4\uC628",
  recTitleSuffix: " \uC7A5\uC18C",
  recSubtitle: "\uC9C1\uC811 \uAC77\uACE0 \uBA39\uC5B4\uBCF8 \uB4A4 \uB2E4\uC2DC \uAEBC\uB0B4 \uBCF4\uACE0 \uC2F6\uC740 \uACF3\uB9CC \uACE8\uB790\uC2B5\uB2C8\uB2E4.",
  recAction: "\uC804\uCCB4 \uC77C\uC815 \u2192",
  tourEyebrow: "\uB2F5\uC0AC \uC77C\uC815",
  tourTitle: "\uC774\uBC88\uC5D0 \uD568\uAED8 \uAC78\uC744 \uAE38",
  tourSubtitle: "\uD070 \uBC84\uC2A4\uBCF4\uB2E4 \uC791\uC740 \uAC78\uC74C\uC5D0 \uB9DE\uCD98 \uB2F5\uC0AC\uC785\uB2C8\uB2E4. \uC7A5\uC18C\uC758 \uB0B4\uB825\uACFC \uC624\uB298\uC758 \uD45C\uC815\uC744 \uAC19\uC774 \uBD05\uB2C8\uB2E4.",
  tourAction: "\uC804\uCCB4 \uC77C\uC815 \u2192",
  tourNextLabel: "\uB2E4\uC74C \uC77C\uC815",
  tourPriceLabel: "\uCC38\uAC00\uBE44",
  communityEyebrow: "\uCEE4\uBBA4\uB2C8\uD2F0",
  communityTitle: "\uB2E4\uB140\uC628 \uC0AC\uB78C\uB4E4\uC758 \uAE30\uB85D",
  communitySubtitle: "\uC88B\uC558\uB358 \uC2DD\uB2F9, \uC560\uB9E4\uD588\uB358 \uB3D9\uC120, \uB2E4\uC2DC \uAC00\uACE0 \uC2F6\uC740 \uACE8\uBAA9\uAE4C\uC9C0 \uD3B8\uD558\uAC8C \uB0A8\uACA8\uC8FC\uC138\uC694.",
  communityAction: "\uCEE4\uBBA4\uB2C8\uD2F0 \uAC00\uAE30 \u2192",
  communityReplyLabel: "\uB313\uAE00",
  communityEmptyTitle: "\uCCAB \uBC88\uC9F8 \uC5EC\uD589 \uC774\uC57C\uAE30\uB97C \uC368\uC8FC\uC138\uC694",
  communityEmptySubtitle: "\uCEE4\uBBA4\uB2C8\uD2F0\uC5D0 \uC5EC\uD589 \uACBD\uD5D8\uC744 \uB098\uB204\uBA74 \uB354 \uB9CE\uC740 \uC5EC\uD589\uC790\uB4E4\uC774 \uBAA8\uC5EC\uB4ED\uB2C8\uB2E4.",
  communityEmptyCta: "\uAE00 \uC791\uC131\uD558\uAE30 \u2192",
  columnEyebrow: "\uC77D\uC744\uAC70\uB9AC",
  columnTitle: "\uAE38 \uC704\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uC0DD\uAC01",
  columnSubtitle: "\uB2F5\uC0AC\uC5D0\uC11C \uC2DC\uC791\uD574 \uCC45\uC0C1 \uC704\uB85C \uB3CC\uC544\uC628 \uC774\uC57C\uAE30\uB4E4\uC785\uB2C8\uB2E4.",
  columnAction: "\uCE7C\uB7FC \uC804\uCCB4 \uBCF4\uAE30 \u2192",
  columnReadMore: "\uB354 \uC77D\uAE30 \u2192",
  columnEmpty: "\uB2E4\uC74C \uCE7C\uB7FC \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4.",
  lecturesEyebrow: "\uAC15\uC5F0",
  lecturesTitle: "\uC549\uC544\uC11C \uBA3C\uC800 \uB5A0\uB098\uB294 \uC2DC\uAC04",
  lecturesAction: "\uC804\uCCB4 \uAC15\uC5F0 \uBCF4\uAE30 \u2192",
  lectureBadge: "\uAC15\uC5F0",
  heroRecentLectureLabel: "\uCD5C\uADFC \uAC15\uC5F0",
  heroNextLectureLabel: "\uB2E4\uC74C \uAC15\uC5F0",
  heroNextTourLabel: "\uB2E4\uC74C \uB2F5\uC0AC",
  heroNoLectureText: "\uC608\uC815\uB41C \uAC15\uC5F0\uC774 \uC544\uC9C1 \uC5C6\uC2B5\uB2C8\uB2E4.",
  heroNoLectureCta: "\uC804\uCCB4 \uAC15\uC5F0 \uBCF4\uAE30 \u2192",
  heroNoTourText: "\uC608\uC815\uB41C \uB2F5\uC0AC\uAC00 \uC544\uC9C1 \uC5C6\uC2B5\uB2C8\uB2E4.",
  heroNoTourCta: "\uC804\uCCB4 \uB2F5\uC0AC \uBCF4\uAE30 \u2192",
  venueFallback: "\uC7A5\uC18C \uBBF8\uC815",
  emptyFallback: "\u2014",
  bookEyebrowPrefix: "\uBC45\uAE30\uB178\uC790 \uCD9C\uD310",
  bookBuyCta: "\uAD6C\uB9E4\uD558\uAE30 \u2192",
  bookKrLabel: "\uAD6D\uBB38\uD310",
  bookEnLabel: "\uC601\uBB38\uD310",
  bookAuthorSuffix: "\uC9C0\uC74C"
};
const getHomeText = (sc) => ({ ...HOME_TEXT_DEFAULT, ...sc && typeof sc.homeText === "object" ? sc.homeText : {} });
const HeroProgramCards = ({ go, dataTick, text }) => {
  const _arr = (fn) => {
    try {
      const v = fn();
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  };
  const _validStarts = (l) => {
    if (!l || l.hidden || !l.startsAt) return false;
    return !isNaN(Date.parse(l.startsAt));
  };
  const lectures = React.useMemo(() => {
    const all = _arr(() => {
      var _a, _b;
      return (_b = (_a = window.BGNJ_LECTURES) == null ? void 0 : _a.listAll) == null ? void 0 : _b.call(_a);
    }).filter(_validStarts);
    const cutoff = Date.now() - 864e5;
    const upcoming = all.filter((l) => new Date(l.startsAt).getTime() >= cutoff).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    if (upcoming.length > 0) return upcoming;
    return all.filter((l) => new Date(l.startsAt).getTime() < cutoff).sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()).slice(0, 3);
  }, [dataTick]);
  const tours = React.useMemo(() => {
    return _arr(() => {
      var _a, _b;
      return (_b = (_a = window.BGNJ_TOURS) == null ? void 0 : _a.listAll) == null ? void 0 : _b.call(_a);
    }).filter(_validStarts).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()).filter((t) => new Date(t.startsAt).getTime() >= Date.now() - 864e5);
  }, [dataTick]);
  const nextLecture = lectures[0];
  const nextTour = tours[0];
  const lectureIsPast = nextLecture && nextLecture.startsAt && new Date(nextLecture.startsAt).getTime() < Date.now() - 864e5;
  const fmtDate = (iso) => {
    var _a;
    if (!iso) return "";
    if ((_a = window.BGNJ_FMT) == null ? void 0 : _a.kstFriendly) return window.BGNJ_FMT.kstFriendly(iso);
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    const dow = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"][d.getDay()];
    return `${d.getMonth() + 1}.${pad(d.getDate())} (${dow}) ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "home-program-stack" }, /* @__PURE__ */ React.createElement(
    "article",
    {
      onClick: () => {
        if (nextLecture) go("lectures");
      },
      className: "home-program-card",
      style: { cursor: nextLecture ? "pointer" : "default" },
      role: nextLecture ? "button" : void 0,
      tabIndex: nextLecture ? 0 : void 0,
      onKeyDown: (e) => {
        if (nextLecture && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          go("lectures");
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "home-program-label" }, lectureIsPast ? text.heroRecentLectureLabel : text.heroNextLectureLabel),
    nextLecture ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 8, color: "var(--ink)" } }, nextLecture.topic || nextLecture.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { className: "gold-2 mono", style: { fontSize: 13, fontWeight: 600 } }, fmtDate(nextLecture.startsAt)), /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 12 } }, nextLecture.venue || text.venueFallback))) : /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.7, margin: 0 } }, text.heroNoLectureText, " ", /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost gold", onClick: (e) => {
      e.stopPropagation();
      go("lectures");
    } }, text.heroNoLectureCta))
  ), /* @__PURE__ */ React.createElement(
    "article",
    {
      onClick: () => {
        if (nextTour) go("tour");
      },
      className: "home-program-card",
      style: { cursor: nextTour ? "pointer" : "default" },
      role: nextTour ? "button" : void 0,
      tabIndex: nextTour ? 0 : void 0,
      onKeyDown: (e) => {
        if (nextTour && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          go("tour");
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "home-program-label" }, text.heroNextTourLabel),
    nextTour ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 8, color: "var(--ink)" } }, nextTour.title), nextTour.subtitle && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 13, marginBottom: 8, fontStyle: "italic" } }, nextTour.subtitle), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { className: "gold-2 mono", style: { fontSize: 13, fontWeight: 600 } }, fmtDate(nextTour.startsAt)), /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 12 } }, nextTour.level && /* @__PURE__ */ React.createElement("span", { style: { marginRight: 8 } }, nextTour.level), nextTour.duration))) : /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.7, margin: 0 } }, text.heroNoTourText, " ", /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost gold", onClick: (e) => {
      e.stopPropagation();
      go("tour");
    } }, text.heroNoTourCta))
  ));
};
const BookCarouselSection = ({ go, dataTick, text }) => {
  const _arr = (fn) => {
    try {
      const v = fn();
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  };
  const [bookTick, setBookTick] = React.useState(0);
  React.useEffect(() => {
    const onR = () => setBookTick((v) => v + 1);
    window.addEventListener("bgnj-books-refresh", onR);
    return () => window.removeEventListener("bgnj-books-refresh", onR);
  }, []);
  const books = React.useMemo(() => {
    const all = _arr(() => {
      var _a, _b;
      return (_b = (_a = window.BGNJ_BOOKS) == null ? void 0 : _a.list) == null ? void 0 : _b.call(_a, { status: "published" });
    });
    return all.slice().sort((a, b) => {
      var _a, _b;
      if (a.primary && !b.primary) return -1;
      if (!a.primary && b.primary) return 1;
      return ((_a = a.order) != null ? _a : 0) - ((_b = b.order) != null ? _b : 0);
    });
  }, [dataTick, bookTick]);
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (books.length > 0 && idx >= books.length) setIdx(0);
  }, [books.length, idx]);
  const wrap = (n) => books.length === 0 ? 0 : (n + books.length) % books.length;
  const goPrev = () => setIdx((i) => wrap(i - 1));
  const goNext = () => setIdx((i) => wrap(i + 1));
  React.useEffect(() => {
    if (books.length < 2 || paused) return;
    const t = setTimeout(() => setIdx((i) => wrap(i + 1)), 7e3);
    return () => clearTimeout(t);
  }, [idx, books.length, paused]);
  if (books.length === 0) return null;
  const showChrome = books.length > 1;
  const renderBookCard = (b) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const hasPriceKR = Number(b.priceKR) > 0;
    const hasPriceEN = Number(b.priceEN) > 0;
    const yr = b.publishedAt ? new Date(b.publishedAt).getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
    const homeIntros = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).bookHomeIntros || {};
    const homeIntro = homeIntros[b.id] || homeIntros[String(b.id)] || "";
    const introText = homeIntro || b.desc || "";
    return /* @__PURE__ */ React.createElement("div", { className: "cta-grid", style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 80,
      alignItems: "center"
    } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, text.bookEyebrowPrefix, " \xB7 ", yr), /* @__PURE__ */ React.createElement("h2", { style: {
      fontFamily: "var(--font-serif)",
      fontSize: "clamp(36px, 4vw, 52px)",
      fontWeight: 600,
      lineHeight: 1.1,
      marginBottom: b.subtitle ? 8 : 16
    } }, "\u300E", b.title, "\u300F"), b.subtitle && /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--font-serif)",
      fontSize: 18,
      fontStyle: "italic",
      color: "var(--ink-2)",
      marginBottom: 20,
      lineHeight: 1.5
    } }, b.subtitle), introText && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, lineHeight: 1.85, color: "var(--ink-2)", marginBottom: 28, whiteSpace: "pre-wrap", maxWidth: 560 } }, introText), (hasPriceKR || hasPriceEN) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20, marginBottom: 32, alignItems: "flex-end" } }, hasPriceKR && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, text.bookKrLabel), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, marginTop: 4, color: "var(--ink)", fontWeight: 700 } }, (_e = (_d = (_c = window.BGNJ_FMT) == null ? void 0 : _c.won) == null ? void 0 : _d.call(_c, b.priceKR)) != null ? _e : "")), hasPriceKR && hasPriceEN && /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "var(--line-2)", alignSelf: "stretch" } }), hasPriceEN && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, text.bookEnLabel), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, marginTop: 4, color: "var(--ink)", fontWeight: 700 } }, (_h = (_g = (_f = window.BGNJ_FMT) == null ? void 0 : _f.won) == null ? void 0 : _g.call(_f, b.priceEN)) != null ? _h : ""))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("book") }, text.bookBuyCta)), /* @__PURE__ */ React.createElement("div", { style: {
      aspectRatio: "3/4",
      maxWidth: 280,
      margin: "0 auto",
      background: "var(--bg)",
      border: "1px solid var(--line-2)",
      display: "grid",
      placeItems: "center",
      overflow: "hidden"
    } }, b.coverDataUri ? /* @__PURE__ */ React.createElement(
      "img",
      {
        src: b.coverDataUri,
        alt: `${b.title} \uD45C\uC9C0`,
        style: { width: "100%", height: "100%", objectFit: "contain", display: "block" }
      }
    ) : /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "0 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--ink)", marginBottom: 10, fontWeight: 600 } }, b.title), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.2em" } }, b.author || "\uBC45\uAE30\uB178\uC790", " ", text.bookAuthorSuffix))));
  };
  return /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCC45 CTA" }, /* @__PURE__ */ React.createElement("section", { className: "section section--anchor" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      style: { position: "relative" }
    },
    /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, books.map((b, i) => {
      const active = i === idx;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: b.id || i,
          "aria-hidden": active ? void 0 : "true",
          style: {
            position: i === 0 ? "relative" : "absolute",
            top: 0,
            left: 0,
            right: 0,
            opacity: active ? 1 : 0,
            transform: active ? "translateX(0)" : i < idx ? "translateX(-24px)" : "translateX(24px)",
            transition: "opacity .55s ease, transform .55s ease",
            pointerEvents: active ? "auto" : "none"
          }
        },
        renderBookCard(b)
      );
    })),
    showChrome && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        "aria-label": "\uC774\uC804 \uCC45",
        onClick: goPrev,
        style: {
          position: "absolute",
          left: -8,
          top: "50%",
          transform: "translate(-100%, -50%)",
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1px solid var(--line)",
          background: "var(--bg)",
          color: "var(--ink)",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1
        }
      },
      "\u2039"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        "aria-label": "\uB2E4\uC74C \uCC45",
        onClick: goNext,
        style: {
          position: "absolute",
          right: -8,
          top: "50%",
          transform: "translate(100%, -50%)",
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1px solid var(--line)",
          background: "var(--bg)",
          color: "var(--ink)",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1
        }
      },
      "\u203A"
    ))
  ), showChrome && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 8, marginTop: 18 } }, books.map((b, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: b.id || i,
      type: "button",
      "aria-label": `${i + 1}\uBC88\uC9F8 \uCC45\uC73C\uB85C \uC774\uB3D9`,
      onClick: () => setIdx(i),
      style: {
        width: i === idx ? 24 : 8,
        height: 8,
        padding: 0,
        borderRadius: 4,
        border: "none",
        cursor: "pointer",
        background: i === idx ? "var(--primary)" : "var(--line-2)",
        transition: "all 0.2s"
      }
    }
  ))))));
};
const HomePage = ({ go }) => {
  var _a, _b, _c;
  const [scTick, setScTick] = React.useState(0);
  const [columnsTick, setColumnsTick] = React.useState(0);
  const [toursTick, setToursTick] = React.useState(0);
  const [lecturesTick, setLecturesTick] = React.useState(0);
  const [postsTick, setPostsTick] = React.useState(0);
  const dataTick = columnsTick + toursTick + lecturesTick + postsTick;
  React.useEffect(() => {
    const onR = () => setScTick((v) => v + 1);
    window.addEventListener("bgnj-site-content-refresh", onR);
    return () => window.removeEventListener("bgnj-site-content-refresh", onR);
  }, []);
  React.useEffect(() => {
    const onColumns = () => setColumnsTick((v) => v + 1);
    const onTours = () => setToursTick((v) => v + 1);
    const onLectures = () => setLecturesTick((v) => v + 1);
    const onPosts = () => setPostsTick((v) => v + 1);
    window.addEventListener("bgnj-columns-refresh", onColumns);
    window.addEventListener("bgnj-tours-refresh", onTours);
    window.addEventListener("bgnj-lectures-refresh", onLectures);
    window.addEventListener("bgnj-posts-refresh", onPosts);
    return () => {
      window.removeEventListener("bgnj-columns-refresh", onColumns);
      window.removeEventListener("bgnj-tours-refresh", onTours);
      window.removeEventListener("bgnj-lectures-refresh", onLectures);
      window.removeEventListener("bgnj-posts-refresh", onPosts);
    };
  }, []);
  const sc = React.useMemo(() => {
    var _a2, _b2;
    return ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
  }, [scTick]);
  const hero = sc.hero || {};
  const homeText = React.useMemo(() => getHomeText(sc), [sc]);
  const [isMobile, setIsMobile] = React.useState(() => {
    try {
      return !!(window.matchMedia && window.matchMedia("(max-width: 600px)").matches);
    } catch (e) {
      return false;
    }
  });
  React.useEffect(() => {
    try {
      const mq = window.matchMedia("(max-width: 600px)");
      const handler = (e) => setIsMobile(e.matches);
      if (mq.addEventListener) mq.addEventListener("change", handler);
      else if (mq.addListener) mq.addListener(handler);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener("change", handler);
        else if (mq.removeListener) mq.removeListener(handler);
      };
    } catch (e) {
    }
  }, []);
  const heroStyle = React.useMemo(
    () => {
      var _a2;
      return ((_a2 = window.BGNJ_HERO_STYLE) == null ? void 0 : _a2.call(window, isMobile ? "mobile" : "desktop")) || window.BGNJ_HERO_STYLE_DEFAULT;
    },
    [scTick, isMobile]
  );
  const recommendations = Array.isArray(sc.recommendations) ? sc.recommendations.filter(Boolean) : [];
  const [recDetail, setRecDetail] = React.useState(null);
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
  const publicColumns = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COLUMNS) == null ? void 0 : _a2.listPublic) == null ? void 0 : _b2.call(_a2);
  }), [columnsTick]);
  const recentFiveColumns = React.useMemo(() => publicColumns.slice(0, 5), [publicColumns]);
  const [featuredIdx, setFeaturedIdx] = React.useState(0);
  const [columnPaused, setColumnPaused] = React.useState(false);
  React.useEffect(() => {
    if (featuredIdx >= recentFiveColumns.length) setFeaturedIdx(0);
  }, [recentFiveColumns.length, featuredIdx]);
  React.useEffect(() => {
    if (columnPaused || recentFiveColumns.length <= 1) return;
    const id = setInterval(() => {
      setFeaturedIdx((i) => (i + 1) % recentFiveColumns.length);
    }, 5e3);
    return () => clearInterval(id);
  }, [columnPaused, recentFiveColumns.length]);
  const featuredColumn = recentFiveColumns[featuredIdx] || recentFiveColumns[0];
  const secondaryColumns = React.useMemo(
    () => recentFiveColumns.filter((_, i) => i !== featuredIdx),
    [recentFiveColumns, featuredIdx]
  );
  const recentPosts = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.listPosts) == null ? void 0 : _b2.call(_a2);
  }).slice(0, 4), [postsTick]);
  const _cutoff = Date.now() - 864e5;
  const _validStart = (x) => x && !x.hidden && x.startsAt && !isNaN(Date.parse(x.startsAt));
  const tours = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_TOURS) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
  }).filter(_validStart).filter((t) => Date.parse(t.startsAt) >= _cutoff).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt)).slice(0, 4), [toursTick]);
  const lectures = React.useMemo(() => {
    const all = G.arr(() => {
      var _a2, _b2;
      return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
    }).filter(_validStart);
    const upcoming = all.filter((l) => Date.parse(l.startsAt) >= _cutoff).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
    if (upcoming.length > 0) return upcoming.slice(0, 3);
    return all.filter((l) => Date.parse(l.startsAt) < _cutoff).sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt)).slice(0, 3);
  }, [lecturesTick]);
  const lecturesArePast = lectures.length > 0 && lectures.every((l) => Date.parse(l.startsAt) < _cutoff);
  const heroStats = Array.isArray(hero.stats) && hero.stats.length === 3 ? hero.stats : [
    { label: "\uC5EC\uD589\uC9C0", sub: "\uC8FC\uC694 \uB2F5\uC0AC\uC9C0 \uC6B4\uC601", valueFallback: "\uC804\uAD6D" },
    { label: "\uD22C\uC5B4", sub: "\uC9C1\uC811 \uAE30\uD68D \uD504\uB85C\uADF8\uB7A8", valueFallback: "\uC900\uBE44 \uC911" },
    { label: "\uCEE4\uBBA4\uB2C8\uD2F0", sub: "\uD568\uAED8 \uB9CC\uB4DC\uB294 \uC5EC\uD589", valueFallback: "\uC6B4\uC601 \uC911" }
  ];
  const allPostsCount = G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.listPosts) == null ? void 0 : _b2.call(_a2);
  }).length;
  const stats = [
    {
      l: heroStats[0].label,
      v: recommendations.length > 0 ? `${recommendations.length}\uACF3` : heroStats[0].valueFallback || "\uC804\uAD6D",
      s: heroStats[0].sub
    },
    {
      l: heroStats[1].label,
      v: tours.length > 0 ? `${tours.length}\uAC1C` : heroStats[1].valueFallback || "\uC900\uBE44 \uC911",
      s: heroStats[1].sub
    },
    {
      l: heroStats[2].label,
      v: allPostsCount > 0 ? `${allPostsCount}+` : heroStats[2].valueFallback || "\uC6B4\uC601 \uC911",
      s: heroStats[2].sub
    }
  ];
  const clickable = (onClick, label) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    onClick,
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    },
    style: { cursor: "pointer" }
  });
  const fontScale = (() => {
    var _a2;
    const v = Number((_a2 = homeText.fontScale) != null ? _a2 : 1);
    if (!isFinite(v)) return 1;
    return Math.max(0.85, Math.min(1.2, v));
  })();
  return /* @__PURE__ */ React.createElement("div", { className: "home-page", style: { fontSize: `${fontScale}em` } }, recDetail && /* @__PURE__ */ React.createElement(RecommendationDetailModal, { rec: recDetail, onClose: () => setRecDetail(null), go }), /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uD788\uC5B4\uB85C" }, /* @__PURE__ */ React.createElement(
    "section",
    {
      className: `home-hero${hero.bgDesktopUrl || hero.bgMobileUrl ? " has-bg" : ""}`,
      style: {
        position: "relative",
        overflow: "hidden",
        background: "var(--bg)",
        borderBottom: "1px solid var(--line)",
        padding: "72px 0 88px"
      }
    },
    hero.bgDesktopUrl && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "hero-bg-image hero-bg-desktop",
        "aria-hidden": "true",
        style: { backgroundImage: `url(${hero.bgDesktopUrl})` }
      }
    ),
    (hero.bgMobileUrl || hero.bgDesktopUrl) && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "hero-bg-image hero-bg-mobile",
        "aria-hidden": "true",
        style: { backgroundImage: `url(${hero.bgMobileUrl || hero.bgDesktopUrl})` }
      }
    ),
    /* @__PURE__ */ React.createElement("div", { className: "container", style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "hero-grid home-hero-grid", style: {
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: 56,
      alignItems: "center"
    } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: heroStyle.title.textAlign || "left" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", style: {
      fontSize: heroStyle.eyebrow.fontSize,
      fontWeight: heroStyle.eyebrow.fontWeight,
      letterSpacing: `${heroStyle.eyebrow.letterSpacing}em`,
      color: `var(${heroStyle.eyebrow.color})`,
      textTransform: heroStyle.eyebrow.textTransform || "uppercase"
    } }, /* @__PURE__ */ React.createElement("span", null, hero.eyebrow || "\uBA39\uACE0 \uC790\uACE0 \uAC77\uACE0 \uC77D\uB294 \uD55C\uAD6D")), /* @__PURE__ */ React.createElement("h1", { style: {
      fontFamily: "var(--font-display)",
      fontSize: `clamp(36px, 5vw, ${heroStyle.title.fontSize}px)`,
      fontWeight: heroStyle.title.fontWeight,
      lineHeight: heroStyle.title.lineHeight,
      letterSpacing: `${heroStyle.title.letterSpacing}em`,
      marginBottom: 22,
      color: `var(${heroStyle.title.color})`
    } }, hero.title1 || "\uD55C\uAD6D\uC744", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: `var(${heroStyle.title.accentColor})` } }, hero.title2 || "\uC9C1\uC811 \uAC77\uACE0"), /* @__PURE__ */ React.createElement("br", null), hero.title3 || "\uCC9C\uCC9C\uD788 \uC77D\uB2E4"), /* @__PURE__ */ React.createElement("p", { className: "bgnj-multiline", style: {
      fontSize: heroStyle.subtitle.fontSize,
      lineHeight: heroStyle.subtitle.lineHeight,
      color: `var(${heroStyle.subtitle.color})`,
      maxWidth: heroStyle.subtitle.maxWidth,
      marginBottom: 32,
      fontWeight: heroStyle.subtitle.fontWeight,
      marginLeft: heroStyle.title.textAlign === "center" ? "auto" : void 0,
      marginRight: heroStyle.title.textAlign === "center" ? "auto" : void 0
    } }, hero.subtitle || "\uAD81\uAD90\uACFC \uACE8\uBAA9, \uC2DC\uC7A5\uACFC \uC219\uC18C, \uCC45\uACFC \uAC15\uC5F0\uC744 \uC624\uAC00\uBA70 \uD55C\uAD6D\uC744 \uC870\uAE08 \uB354 \uAC00\uAE4C\uC774 \uBD05\uB2C8\uB2E4. \uBC45\uAE30\uB178\uC790\uB294 \uC5EC\uD589\uC744 \uAE30\uB85D\uD558\uACE0 \uD568\uAED8 \uB5A0\uB098\uB294 \uC0AC\uB78C\uB4E4\uC758 \uC791\uC740 \uBAA8\uC784\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 40,
      justifyContent: heroStyle.title.textAlign === "center" ? "center" : heroStyle.title.textAlign === "right" ? "flex-end" : "flex-start",
      fontWeight: heroStyle.cta.fontWeight
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-gold",
        onClick: () => go("community"),
        style: { fontWeight: heroStyle.cta.fontWeight }
      },
      hero.ctaPrimary || "\uCEE4\uBBA4\uB2C8\uD2F0 \uBCF4\uAE30"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn",
        onClick: () => go("tour"),
        style: { fontWeight: heroStyle.cta.fontWeight }
      },
      hero.ctaSecondary || "\uB2F5\uC0AC \uC77C\uC815 \uBCF4\uAE30"
    )), /* @__PURE__ */ React.createElement("div", { className: "hero-stats", style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 20,
      paddingTop: 24,
      borderTop: "1px solid var(--line)"
    } }, stats.map((stat) => /* @__PURE__ */ React.createElement("div", { key: stat.l }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--font-serif)",
      fontSize: heroStyle.stats.value.fontSize,
      fontWeight: heroStyle.stats.value.fontWeight,
      color: `var(${heroStyle.stats.value.color})`,
      marginBottom: 4
    } }, stat.v), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--font-mono)",
      fontSize: heroStyle.stats.label.fontSize,
      fontWeight: heroStyle.stats.label.fontWeight,
      letterSpacing: `${heroStyle.stats.label.letterSpacing}em`,
      color: `var(${heroStyle.stats.label.color})`,
      textTransform: heroStyle.stats.label.textTransform || "uppercase",
      marginBottom: 3
    } }, stat.l), /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: heroStyle.stats.sub.fontSize,
      color: `var(${heroStyle.stats.sub.color})`
    } }, stat.s))))), /* @__PURE__ */ React.createElement(HeroProgramCards, { go, dataTick, text: homeText })))
  )), recommendations.length > 0 && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uBC45\uAE30\uB178\uC790 \uCD94\uCC9C" }, /* @__PURE__ */ React.createElement("section", { className: "section section--anchor", style: { background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, (() => {
    var _a2, _b2, _c2, _d, _e, _f, _g, _h;
    const _i = (((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {}).recommendationsHeading || {};
    const eb = homeText.recEyebrow || _i.eyebrow || HOME_TEXT_DEFAULT.recEyebrow;
    const tp = (_d = (_c2 = homeText.recTitlePrefix) != null ? _c2 : _i.titlePrefix) != null ? _d : HOME_TEXT_DEFAULT.recTitlePrefix;
    const ta = (_f = (_e = homeText.recTitleAccent) != null ? _e : _i.titleAccent) != null ? _f : HOME_TEXT_DEFAULT.recTitleAccent;
    const ts = (_h = (_g = homeText.recTitleSuffix) != null ? _g : _i.titleSuffix) != null ? _h : HOME_TEXT_DEFAULT.recTitleSuffix;
    const sb = homeText.recSubtitle || _i.subtitle || HOME_TEXT_DEFAULT.recSubtitle;
    return /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        eyebrow: eb,
        title: /* @__PURE__ */ React.createElement(React.Fragment, null, tp, /* @__PURE__ */ React.createElement("span", { className: "accent" }, ta), ts),
        subtitle: sb,
        action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("tour") }, homeText.recAction)
      }
    );
  })(), /* @__PURE__ */ React.createElement("div", { className: recommendations.length >= 3 ? "grid grid-feature-2" : "grid grid-3" }, recommendations.map((r, ri) => {
    const tags = Array.isArray(r.tags) ? r.tags : typeof r.tags === "string" ? r.tags.split(/[,·]/).map((s) => s.trim()).filter(Boolean) : [];
    const isFeature = recommendations.length >= 3 && ri === 0;
    return /* @__PURE__ */ React.createElement(
      "article",
      {
        key: r.id || r.name,
        className: "card card--bare",
        ...clickable(() => setRecDetail(r), `${r.name || "\uCD94\uCC9C"} \uC0C1\uC138 \uBCF4\uAE30`),
        style: { cursor: "pointer", display: "flex", flexDirection: "column", padding: 0 }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        height: isFeature ? 320 : 160,
        marginBottom: 18,
        position: "relative",
        overflow: "hidden",
        background: r.imageDataUri ? `url(${r.imageDataUri}) center/cover` : "var(--bg-3)"
      } }, r.region && /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute",
        top: 10,
        left: 12,
        padding: "3px 8px",
        background: "var(--bg-2)",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.18em",
        color: "var(--ink-2)"
      } }, r.region)),
      tags.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" } }, tags.slice(0, 3).map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "badge", style: { fontSize: 9 } }, t))),
      /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: isFeature ? 30 : 22, fontWeight: 600, marginBottom: 5, lineHeight: 1.25 } }, r.name || "\uC81C\uBAA9 \uC5C6\uC74C"),
      r.subtitle && /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--secondary)",
        letterSpacing: "0.05em",
        marginBottom: 10
      } }, r.subtitle),
      r.desc && /* @__PURE__ */ React.createElement("p", { style: { fontSize: isFeature ? 14 : 13, lineHeight: 1.7, color: "var(--ink-2)" } }, r.desc)
    );
  }))))), /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8" }, /* @__PURE__ */ React.createElement("section", { className: "section-tight", style: {} }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "section-head section-head--inline" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, homeText.tourEyebrow), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, homeText.tourTitle, tours.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.18em",
    color: "var(--ink-3)",
    marginLeft: 14,
    verticalAlign: "middle"
  } }, "\xB7 ", tours.length, "\uAC1C \uC77C\uC815"))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("tour") }, homeText.tourAction)), tours.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "40px 24px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 18, color: "var(--ink-2)", marginBottom: 8 } }, "\uC774\uBC88\uC5D0 \uD568\uAED8 \uAC78\uC744 \uAE38\uC774 \uC544\uC9C1 \uC5C6\uC2B5\uB2C8\uB2E4"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.7, margin: 0 } }, "\uB2E4\uC74C \uB2F5\uC0AC \uC77C\uC815\uC744 \uC900\uBE44\uD558\uACE0 \uC788\uC5B4\uC694. ", /* @__PURE__ */ React.createElement("button", { type: "button", className: "link-inline", onClick: () => go("tour"), style: { background: "none", border: "none", padding: 0, color: "var(--secondary)", cursor: "pointer", font: "inherit", textDecoration: "underline" } }, "\uC804\uCCB4 \uC77C\uC815"), "\uC5D0\uC11C \uC9C0\uB09C \uB2F5\uC0AC \uAE30\uB85D\uC744 \uBCFC \uC218 \uC788\uC2B5\uB2C8\uB2E4.")) : /* @__PURE__ */ React.createElement("div", { className: "grid grid-2" }, tours.map((t, i) => {
    var _a2, _b2, _c2;
    return /* @__PURE__ */ React.createElement(
      "article",
      {
        key: t.id,
        className: "card",
        ...clickable(() => go("tour"), `\uD22C\uC5B4: ${t.title}`),
        style: { cursor: "pointer", position: "relative" }
      },
      /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
        position: "absolute",
        top: 20,
        right: 20,
        fontSize: 10,
        color: "var(--ink-3)",
        letterSpacing: "0.2em"
      } }, "0", i + 1),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" } }, t.level && /* @__PURE__ */ React.createElement("span", { className: "badge" }, t.level), t.duration && /* @__PURE__ */ React.createElement("span", { className: "badge" }, t.duration), t.group && /* @__PURE__ */ React.createElement("span", { className: "badge" }, t.group)),
      /* @__PURE__ */ React.createElement("h3", { className: "card-title", style: { fontSize: 22, marginBottom: 10 } }, t.title),
      t.desc && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.7, marginBottom: 20 } }, truncatePreview(t.desc, 110)),
      /* @__PURE__ */ React.createElement("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid var(--line)",
        paddingTop: 16
      } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, homeText.tourNextLabel), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, marginTop: 4, color: "var(--ink)", fontWeight: 500 } }, t.next || homeText.emptyFallback)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, homeText.tourPriceLabel), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 20, marginTop: 4, color: "var(--ink)", fontWeight: 600 } }, t.price ? typeof t.price === "number" ? (_c2 = (_b2 = (_a2 = window.BGNJ_FMT) == null ? void 0 : _a2.won) == null ? void 0 : _b2.call(_a2, t.price)) != null ? _c2 : "" : t.price : homeText.emptyFallback)))
    );
  }))))), /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCEE4\uBBA4\uB2C8\uD2F0" }, /* @__PURE__ */ React.createElement("section", { className: "section--mid", style: { background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 32,
    flexWrap: "wrap",
    marginBottom: 24
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 320px", minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, homeText.communityEyebrow), /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { fontSize: 28, marginBottom: 0 } }, homeText.communityTitle)), homeText.communitySubtitle && /* @__PURE__ */ React.createElement("p", { style: {
    flex: "1 1 280px",
    fontSize: 13,
    color: "var(--ink-3)",
    lineHeight: 1.7,
    margin: 0,
    maxWidth: 380
  } }, homeText.communitySubtitle), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("community") }, homeText.communityAction)), recentPosts.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { borderRadius: 12, overflow: "hidden" } }, recentPosts.map((post, i) => {
    var _a2;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: post.id,
        ...clickable(() => go("community"), post.title),
        style: {
          display: "flex",
          gap: 20,
          alignItems: "center",
          padding: "16px 22px",
          background: i % 2 === 0 ? "var(--bg)" : "var(--bg-2)"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 5, flexWrap: "wrap" } }, post.category && /* @__PURE__ */ React.createElement("span", { className: "badge", style: { fontSize: 9 } }, post.category), post.prefix && /* @__PURE__ */ React.createElement("span", { style: {
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        fontWeight: 700,
        color: "var(--secondary)",
        letterSpacing: "0.1em"
      } }, "[", post.prefix, "]")), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 15, color: "var(--ink)", marginBottom: 3, fontWeight: 500 } }, post.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" } }, post.author, " \xB7 ", post.date)),
      /* @__PURE__ */ React.createElement("div", { style: {
        display: "flex",
        gap: 14,
        color: "var(--ink-3)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        flexShrink: 0,
        fontWeight: 500
      } }, /* @__PURE__ */ React.createElement("span", null, homeText.communityReplyLabel, " ", (_a2 = post.replies) != null ? _a2 : 0), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-2)" } }, "\u2192"))
    );
  })) : /* @__PURE__ */ React.createElement("div", { className: "card", style: { textAlign: "center", padding: 60 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--ink)", marginBottom: 12, fontWeight: 600 } }, homeText.communityEmptyTitle), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-2)", marginBottom: 24, lineHeight: 1.7 } }, homeText.communityEmptySubtitle), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("community") }, homeText.communityEmptyCta))))), featuredColumn && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCE7C\uB7FC" }, /* @__PURE__ */ React.createElement("section", { className: "section--mid", style: {} }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 28,
    gap: 16,
    flexWrap: "wrap"
  } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true", style: { margin: 0 } }, homeText.columnEyebrow), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } }, !!((_c = (_b = (_a = window.BGNJ_AUTH) == null ? void 0 : _a.currentUser) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.isAdmin) && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-gold btn-small",
      onClick: () => {
        try {
          sessionStorage.setItem("bgnj_pending_column_write", "1");
        } catch (e) {
        }
        go("column");
      }
    },
    "\uFF0B \uAE00\uC4F0\uAE30"
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("column") }, homeText.columnAction))), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56 },
      className: "col-grid",
      onMouseEnter: () => setColumnPaused(true),
      onMouseLeave: () => setColumnPaused(false),
      onFocusCapture: () => setColumnPaused(true),
      onBlurCapture: () => setColumnPaused(false)
    },
    /* @__PURE__ */ React.createElement(
      "article",
      {
        key: featuredIdx,
        className: "column-featured-slide",
        style: { cursor: "pointer", position: "relative", minHeight: 600, display: "flex", flexDirection: "column" },
        ...clickable(() => go("column"), `\uCE7C\uB7FC: ${featuredColumn.title}`)
      },
      featuredColumn.coverUrl || featuredColumn.coverImage ? /* @__PURE__ */ React.createElement("div", { style: {
        height: 320,
        marginBottom: 24,
        flex: "0 0 auto",
        backgroundImage: `url(${featuredColumn.coverUrl || featuredColumn.coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      } }) : /* @__PURE__ */ React.createElement("div", { style: {
        height: 320,
        background: "var(--bg-2)",
        marginBottom: 24,
        flex: "0 0 auto",
        borderRadius: 12,
        display: "grid",
        placeItems: "center"
      } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.28em" } }, "FEATURED COLUMN")),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" } }, featuredColumn.category && /* @__PURE__ */ React.createElement("span", { className: "pill" }, featuredColumn.category), featuredColumn.date && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, featuredColumn.date), featuredColumn.readTime && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, "\xB7 ", featuredColumn.readTime)),
      /* @__PURE__ */ React.createElement("h2", { style: {
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(24px, 2.6vw, 32px)",
        fontWeight: 600,
        lineHeight: 1.25,
        marginBottom: 14,
        color: "var(--ink)",
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      } }, truncatePreview(featuredColumn.title, 20)),
      featuredColumn.excerpt && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, lineHeight: 1.75, color: "var(--ink-2)", marginBottom: 18, maxWidth: 580, minHeight: 80 } }, truncatePreview(featuredColumn.excerpt, 90)),
      /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--secondary)" } }, homeText.columnReadMore),
      recentFiveColumns.length > 1 && /* @__PURE__ */ React.createElement(
        "div",
        {
          style: { display: "flex", gap: 6, marginTop: 18, alignItems: "center" },
          onClick: (e) => e.stopPropagation()
        },
        recentFiveColumns.map((_, i) => /* @__PURE__ */ React.createElement(
          "button",
          {
            key: i,
            type: "button",
            "aria-label": `${i + 1}\uBC88\uC9F8 \uCE7C\uB7FC \uBCF4\uAE30`,
            "aria-current": i === featuredIdx ? "true" : void 0,
            onClick: () => setFeaturedIdx(i),
            style: {
              width: i === featuredIdx ? 22 : 8,
              height: 8,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: i === featuredIdx ? "var(--primary)" : "var(--line-2)",
              transition: "width .25s, background .2s",
              padding: 0
            }
          }
        )),
        /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 9, marginLeft: 8, letterSpacing: "0.15em" } }, columnPaused ? "\u23F8 HOVER" : "\u25B6 AUTO")
      )
    ),
    /* @__PURE__ */ React.createElement("aside", { style: { paddingTop: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.22em",
      color: "var(--ink-3)",
      marginBottom: 18,
      textTransform: "uppercase"
    } }, homeText.columnTitle), secondaryColumns.map((c, ci) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: c.id,
        ...clickable(() => go("column"), `\uCE7C\uB7FC: ${c.title}`),
        style: {
          padding: "14px 0",
          minHeight: 88,
          borderBottom: ci < secondaryColumns.length - 1 ? "1px solid var(--line)" : "none",
          cursor: "pointer"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" } }, c.category && /* @__PURE__ */ React.createElement("span", { className: "pill", style: { fontSize: 9, padding: "2px 8px" } }, c.category), c.date && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, c.date)),
      /* @__PURE__ */ React.createElement("h4", { className: "ko-serif", style: {
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: 4,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      } }, truncatePreview(c.title, 20)),
      c.excerpt && /* @__PURE__ */ React.createElement("p", { style: {
        fontSize: 12,
        lineHeight: 1.6,
        color: "var(--ink-3)",
        margin: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      } }, truncatePreview(c.excerpt, 38))
    )), secondaryColumns.length === 0 && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", padding: "16px 0" } }, homeText.columnEmpty))
  )))), lectures.length > 0 && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uAC15\uC5F0" }, /* @__PURE__ */ React.createElement("section", { className: "section-tight", style: { background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "section-head section-head--inline" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, homeText.lecturesEyebrow), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, homeText.lecturesTitle), lecturesArePast && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12.5, marginTop: 6, marginBottom: 0, color: "var(--ink-3)" } }, "\uD604\uC7AC \uC608\uC815\uB41C \uAC15\uC5F0\uC774 \uC5C6\uC5B4 \uC9C0\uB09C \uAC15\uC5F0\uC744 \uBCF4\uC5EC\uB4DC\uB9BD\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("lectures") }, homeText.lecturesAction)), /* @__PURE__ */ React.createElement("div", { className: `lecture-strip${lectures.length <= 2 ? " lecture-strip--grid" : ""}`, role: "list" }, lectures.map((lecture) => {
    var _a2, _b2;
    const heroMode = lectures.length === 1;
    const price = (_b2 = (_a2 = window.BGNJ_FMT) == null ? void 0 : _a2.priceOrFree) == null ? void 0 : _b2.call(_a2, lecture.price);
    const hours = lecture.durationMinutes ? `${Math.round(lecture.durationMinutes / 60 * 10) / 10}\uC2DC\uAC04` : null;
    const _now = Date.now();
    const _startsTs = lecture.startsAt ? Date.parse(lecture.startsAt) : NaN;
    const _createdTs = lecture.createdAt ? Date.parse(lecture.createdAt) : NaN;
    const _daysToStart = !isNaN(_startsTs) ? Math.ceil((_startsTs - _now) / 864e5) : null;
    const _daysSinceCreated = !isNaN(_createdTs) ? Math.floor((_now - _createdTs) / 864e5) : null;
    const isImminent = _daysToStart != null && _daysToStart > 0 && _daysToStart <= 7;
    const isNew = _daysSinceCreated != null && _daysSinceCreated <= 3;
    const isPast = !isNaN(_startsTs) && _startsTs < _now - 864e5;
    const metaCell = (label, value) => /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 3 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: heroMode ? 14 : 13, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4 } }, value || "-"));
    return /* @__PURE__ */ React.createElement(
      "article",
      {
        key: lecture.id,
        role: "listitem",
        className: "card",
        ...clickable(() => {
          try {
            sessionStorage.setItem("bgnj_pending_lecture_id", String(lecture.id));
          } catch (e) {
          }
          go("lectures");
        }, `\uAC15\uC5F0: ${lecture.topic || lecture.title}`),
        style: {
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          padding: heroMode ? "32px 32px 28px" : "20px 20px 18px"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "badge" }, homeText.lectureBadge), isPast && /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: "var(--ink-3)", color: "var(--ink-3)", background: "var(--bg-2)" } }, "\uC9C0\uB09C \uAC15\uC5F0"), isImminent && /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: "var(--danger)", color: "var(--danger)" } }, _daysToStart === 1 ? "\uB0B4\uC77C \uB9C8\uAC10" : `D-${_daysToStart}`), isNew && /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: "var(--primary)", color: "var(--primary-active)" } }, "NEW")),
      /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: heroMode ? 24 : 19, fontWeight: 600, lineHeight: 1.35, marginBottom: 10, flex: "0 0 auto", color: "var(--ink)" } }, lecture.topic || lecture.title),
      lecture.note && /* @__PURE__ */ React.createElement("p", { style: { fontSize: heroMode ? 15 : 14, lineHeight: 1.75, color: "var(--ink-2)", marginBottom: 18, flex: "1 1 auto" } }, truncatePreview(lecture.note, heroMode ? 180 : 110)),
      /* @__PURE__ */ React.createElement("div", { style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: heroMode ? "12px 24px" : "10px 14px",
        paddingTop: 14,
        paddingBottom: heroMode ? 14 : 10,
        borderTop: "1px solid var(--line)",
        marginTop: "auto"
      } }, metaCell("\uC77C\uC815", lecture.next), metaCell("\uCC38\uAC00\uBE44", price), metaCell("\uC815\uC6D0", lecture.capacity ? `${lecture.capacity}\uBA85` : null), metaCell("\uC18C\uC694\uC2DC\uAC04", hours)),
      lecture.venue && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: {
        fontSize: 11,
        marginTop: heroMode ? 12 : 8,
        paddingTop: heroMode ? 12 : 8,
        borderTop: heroMode ? "1px dashed var(--line)" : "none",
        letterSpacing: "0.02em"
      } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginRight: 6, color: "var(--ink-3)" } }, "\uC7A5\uC18C"), lecture.venue)
    );
  })), lectures.length >= 3 && /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.22em",
    color: "var(--ink-3)",
    textAlign: "right"
  } }, "\u2190 \uAC00\uB85C\uB85C \uC2A4\uD06C\uB864 \u2192")))), /* @__PURE__ */ React.createElement(BookCarouselSection, { go, dataTick, text: homeText }));
};
Object.assign(window, { HomePage });

})();

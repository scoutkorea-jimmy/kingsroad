(function(){
const DestinationMapModal = ({ onClose, go }) => {
  var _a;
  const [selectedDest, setSelectedDest] = React.useState(null);
  (_a = window.useModalGuard) == null ? void 0 : _a.call(window, { open: true, dirty: false, onClose, onSaveDraft: null, label: "\uC5EC\uD589\uC9C0 \uC9C0\uB3C4 \uD0D0\uC0C9" });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "\uC5EC\uD589\uC9C0 \uC9C0\uB3C4 \uD0D0\uC0C9",
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
      maxWidth: 680,
      width: "100%",
      maxHeight: "92vh",
      overflow: "auto",
      padding: "32px 28px 28px",
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
          width: 36,
          height: 36,
          fontSize: 24,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--ink-2)",
          lineHeight: 1
        }
      },
      "\xD7"
    ), /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", style: { marginBottom: 14 } }, "DESTINATIONS \xB7 \uC5EC\uD589\uC9C0 \uC9C0\uB3C4"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, marginBottom: 10, lineHeight: 1.2 } }, "\uC9C0\uB3C4\uB97C \uD074\uB9AD\uD574 \uD0D0\uC0C9\uD558\uC138\uC694"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-2)", marginBottom: 20, lineHeight: 1.7 } }, "\uC2DC\uB3C4\uB97C \uB204\uB974\uBA74 \uC815\uBCF4\uAC00 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4. \uD638\uBC84\uD558\uBA74 \uC9C0\uBA85\uC774 \uD45C\uC2DC\uB429\uB2C8\uB2E4."), typeof KoreaMap === "function" ? /* @__PURE__ */ React.createElement(
      KoreaMap,
      {
        onSelect: (dest) => setSelectedDest((selectedDest == null ? void 0 : selectedDest.id) === dest.id ? null : dest),
        selected: selectedDest == null ? void 0 : selectedDest.id
      }
    ) : /* @__PURE__ */ React.createElement("div", { style: { height: 300, display: "grid", placeItems: "center", color: "var(--ink-3)", fontSize: 13 } }, "\uC9C0\uB3C4 \uB85C\uB529 \uC911..."), selectedDest && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 18,
      padding: "18px 20px",
      background: "var(--bg-2)",
      border: "1px solid var(--line)"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--ink)", fontWeight: 600 } }, selectedDest.name), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.12em" } }, selectedDest.fullname)), selectedDest.desc && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 12 } }, selectedDest.desc), selectedDest.tags && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 } }, String(selectedDest.tags).split("\xB7").map((t) => t.trim()).filter(Boolean).map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "badge", style: { fontSize: 10 } }, t))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold btn-small", onClick: () => {
      go("tour");
      onClose();
    } }, "\uC774 \uC9C0\uC5ED \uD22C\uC5B4 \uBCF4\uAE30 \u2192")))
  );
};
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
    const hasPriceKR = Number(b.priceKR) > 0;
    const hasPriceEN = Number(b.priceEN) > 0;
    const yr = b.publishedAt ? new Date(b.publishedAt).getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
    return /* @__PURE__ */ React.createElement("div", { className: "card cta-grid", style: {
      padding: "72px 60px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 60,
      alignItems: "center",
      background: "var(--bg-2)",
      border: "1px solid var(--line)"
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
    } }, b.subtitle), b.desc && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, lineHeight: 1.85, color: "var(--ink-2)", marginBottom: 28, whiteSpace: "pre-wrap" } }, b.desc), (hasPriceKR || hasPriceEN) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20, marginBottom: 32, alignItems: "flex-end" } }, hasPriceKR && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, text.bookKrLabel), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, marginTop: 4, color: "var(--ink)", fontWeight: 700 } }, Number(b.priceKR).toLocaleString(), "\uC6D0")), hasPriceKR && hasPriceEN && /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "var(--line-2)", alignSelf: "stretch" } }), hasPriceEN && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, text.bookEnLabel), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, marginTop: 4, color: "var(--ink)", fontWeight: 700 } }, Number(b.priceEN).toLocaleString(), "\uC6D0"))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("book") }, text.bookBuyCta)), /* @__PURE__ */ React.createElement("div", { style: {
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
        style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
      }
    ) : /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "0 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--ink)", marginBottom: 10, fontWeight: 600 } }, b.title), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.2em" } }, b.author || "\uBC45\uAE30\uB178\uC790", " ", text.bookAuthorSuffix))));
  };
  return /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCC45 CTA" }, /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement(
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
        background: i === idx ? "var(--gold)" : "var(--line-2)",
        transition: "all 0.2s"
      }
    }
  ))))));
};
const HomePage = ({ go }) => {
  const [mapOpen, setMapOpen] = React.useState(false);
  const [scTick, setScTick] = React.useState(0);
  const [dataTick, setDataTick] = React.useState(0);
  React.useEffect(() => {
    const onR = () => setScTick((v) => v + 1);
    window.addEventListener("bgnj-site-content-refresh", onR);
    return () => window.removeEventListener("bgnj-site-content-refresh", onR);
  }, []);
  React.useEffect(() => {
    const tick = () => setDataTick((v) => v + 1);
    const evts = ["bgnj-columns-refresh", "bgnj-tours-refresh", "bgnj-lectures-refresh", "bgnj-posts-refresh"];
    evts.forEach((e) => window.addEventListener(e, tick));
    return () => evts.forEach((e) => window.removeEventListener(e, tick));
  }, []);
  const sc = React.useMemo(() => {
    var _a, _b;
    return ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
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
      var _a;
      return ((_a = window.BGNJ_HERO_STYLE) == null ? void 0 : _a.call(window, isMobile ? "mobile" : "desktop")) || window.BGNJ_HERO_STYLE_DEFAULT;
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
  const _hasValidDate = (iso) => {
    if (!iso) return false;
    const t = Date.parse(iso);
    return !isNaN(t);
  };
  const publicColumns = React.useMemo(() => G.arr(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_COLUMNS) == null ? void 0 : _a.listPublic) == null ? void 0 : _b.call(_a);
  }), [dataTick]);
  const featuredColumn = publicColumns[0];
  const secondaryColumns = publicColumns.slice(1, 5);
  const recentPosts = React.useMemo(() => G.arr(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a.listPosts) == null ? void 0 : _b.call(_a);
  }).slice(0, 4), [dataTick]);
  const tours = React.useMemo(() => G.arr(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_TOURS) == null ? void 0 : _a.listAll) == null ? void 0 : _b.call(_a);
  }).filter((t) => t && !t.hidden).slice(0, 4), [dataTick]);
  const lectures = React.useMemo(() => G.arr(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_LECTURES) == null ? void 0 : _a.listAll) == null ? void 0 : _b.call(_a);
  }).filter((l) => l && !l.hidden).slice(0, 3), [dataTick]);
  const heroStats = Array.isArray(hero.stats) && hero.stats.length === 3 ? hero.stats : [
    { label: "\uC5EC\uD589\uC9C0", sub: "\uC8FC\uC694 \uB2F5\uC0AC\uC9C0 \uC6B4\uC601", valueFallback: "\uC804\uAD6D" },
    { label: "\uD22C\uC5B4", sub: "\uC9C1\uC811 \uAE30\uD68D \uD504\uB85C\uADF8\uB7A8", valueFallback: "\uC900\uBE44 \uC911" },
    { label: "\uCEE4\uBBA4\uB2C8\uD2F0", sub: "\uD568\uAED8 \uB9CC\uB4DC\uB294 \uC5EC\uD589", valueFallback: "\uC6B4\uC601 \uC911" }
  ];
  const stats = [
    { l: heroStats[0].label, v: heroStats[0].valueFallback || "\uC804\uAD6D", s: heroStats[0].sub },
    { l: heroStats[1].label, v: tours.length > 0 ? `${tours.length}\uAC1C` : heroStats[1].valueFallback || "\uC900\uBE44 \uC911", s: heroStats[1].sub },
    { l: heroStats[2].label, v: recentPosts.length > 0 ? `${recentPosts.length}+` : heroStats[2].valueFallback || "\uC6B4\uC601 \uC911", s: heroStats[2].sub }
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
  return /* @__PURE__ */ React.createElement("div", { className: "home-page" }, mapOpen && /* @__PURE__ */ React.createElement(DestinationMapModal, { onClose: () => setMapOpen(false), go }), recDetail && /* @__PURE__ */ React.createElement(RecommendationDetailModal, { rec: recDetail, onClose: () => setRecDetail(null), go }), /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uD788\uC5B4\uB85C" }, /* @__PURE__ */ React.createElement("section", { className: "home-hero", style: {
    position: "relative",
    overflow: "hidden",
    background: "var(--bg)",
    borderBottom: "1px solid var(--line)",
    padding: "72px 0 88px"
  } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hero-grid home-hero-grid", style: {
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
  } }, stat.s))))), /* @__PURE__ */ React.createElement(HeroProgramCards, { go, dataTick, text: homeText }))))), recommendations.length > 0 && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uBC45\uAE30\uB178\uC790 \uCD94\uCC9C" }, /* @__PURE__ */ React.createElement("section", { className: "section", style: { background: "var(--bg-2)", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, (() => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const _i = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).recommendationsHeading || {};
    const eb = homeText.recEyebrow || _i.eyebrow || HOME_TEXT_DEFAULT.recEyebrow;
    const tp = (_d = (_c = homeText.recTitlePrefix) != null ? _c : _i.titlePrefix) != null ? _d : HOME_TEXT_DEFAULT.recTitlePrefix;
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
  })(), /* @__PURE__ */ React.createElement("div", { className: "grid grid-3" }, recommendations.map((r) => {
    const tags = Array.isArray(r.tags) ? r.tags : typeof r.tags === "string" ? r.tags.split(/[,·]/).map((s) => s.trim()).filter(Boolean) : [];
    return /* @__PURE__ */ React.createElement(
      "article",
      {
        key: r.id || r.name,
        className: "card",
        ...clickable(() => setRecDetail(r), `${r.name || "\uCD94\uCC9C"} \uC0C1\uC138 \uBCF4\uAE30`),
        style: { cursor: "pointer" }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        height: 160,
        marginBottom: 18,
        position: "relative",
        overflow: "hidden",
        background: r.imageDataUri ? `url(${r.imageDataUri}) center/cover` : "var(--bg-3)",
        borderBottom: r.imageDataUri ? "none" : "1px solid var(--line)"
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
      /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 22, fontWeight: 600, marginBottom: 5 } }, r.name || "\uC81C\uBAA9 \uC5C6\uC74C"),
      r.subtitle && /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--secondary)",
        letterSpacing: "0.05em",
        marginBottom: 10
      } }, r.subtitle),
      r.desc && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, lineHeight: 1.7, color: "var(--ink-2)" } }, r.desc)
    );
  }))))), tours.length > 0 && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8" }, /* @__PURE__ */ React.createElement("section", { className: "section", style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement(
    SectionHead,
    {
      eyebrow: homeText.tourEyebrow,
      title: /* @__PURE__ */ React.createElement(React.Fragment, null, homeText.tourTitle),
      subtitle: homeText.tourSubtitle,
      action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("tour") }, homeText.tourAction)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-2" }, tours.map((t, i) => /* @__PURE__ */ React.createElement(
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
    } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, homeText.tourNextLabel), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, marginTop: 4, color: "var(--ink)", fontWeight: 500 } }, t.next || homeText.emptyFallback)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, homeText.tourPriceLabel), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 20, marginTop: 4, color: "var(--ink)", fontWeight: 600 } }, t.price ? typeof t.price === "number" ? window.BGNJ_FMT.won(t.price) : t.price : homeText.emptyFallback)))
  )))))), /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCEE4\uBBA4\uB2C8\uD2F0" }, /* @__PURE__ */ React.createElement("section", { className: "section", style: { background: "var(--bg-2)", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement(
    SectionHead,
    {
      eyebrow: homeText.communityEyebrow,
      title: /* @__PURE__ */ React.createElement(React.Fragment, null, homeText.communityTitle),
      subtitle: homeText.communitySubtitle,
      action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("community") }, homeText.communityAction)
    }
  ), recentPosts.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--line)" } }, recentPosts.map((post, i) => {
    var _a;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: post.id,
        ...clickable(() => go("community"), post.title),
        style: {
          display: "flex",
          gap: 20,
          alignItems: "center",
          padding: "18px 24px",
          background: i % 2 === 0 ? "var(--bg)" : "var(--bg-2)",
          borderBottom: i < recentPosts.length - 1 ? "1px solid var(--line)" : "none"
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
      } }, /* @__PURE__ */ React.createElement("span", null, homeText.communityReplyLabel, " ", (_a = post.replies) != null ? _a : 0), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-2)" } }, "\u2192"))
    );
  })) : /* @__PURE__ */ React.createElement("div", { className: "card", style: { textAlign: "center", padding: 60 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--ink)", marginBottom: 12, fontWeight: 600 } }, homeText.communityEmptyTitle), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-2)", marginBottom: 24, lineHeight: 1.7 } }, homeText.communityEmptySubtitle), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("community") }, homeText.communityEmptyCta))))), featuredColumn && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCE7C\uB7FC" }, /* @__PURE__ */ React.createElement("section", { className: "section", style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement(
    SectionHead,
    {
      eyebrow: homeText.columnEyebrow,
      title: /* @__PURE__ */ React.createElement(React.Fragment, null, homeText.columnTitle),
      subtitle: homeText.columnSubtitle,
      action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("column") }, homeText.columnAction)
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40 }, className: "col-grid" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card",
      style: { padding: 0, overflow: "hidden", cursor: "pointer" },
      ...clickable(() => go("column"), `\uCE7C\uB7FC: ${featuredColumn.title}`)
    },
    featuredColumn.coverUrl || featuredColumn.coverImage ? /* @__PURE__ */ React.createElement("div", { style: {
      height: 200,
      backgroundImage: `url(${featuredColumn.coverUrl || featuredColumn.coverImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    } }) : /* @__PURE__ */ React.createElement("div", { style: {
      height: 140,
      background: "var(--bg-2)",
      borderBottom: "1px solid var(--line)",
      display: "grid",
      placeItems: "center"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.28em" } }, "FEATURED COLUMN")),
    /* @__PURE__ */ React.createElement("div", { style: { padding: 30 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" } }, featuredColumn.category && /* @__PURE__ */ React.createElement("span", { className: "pill" }, featuredColumn.category), featuredColumn.date && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, featuredColumn.date), featuredColumn.readTime && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, "\xB7 ", featuredColumn.readTime)), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 26, fontWeight: 600, lineHeight: 1.3, marginBottom: 12 } }, featuredColumn.title), featuredColumn.excerpt && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, lineHeight: 1.75, color: "var(--ink-2)" } }, featuredColumn.excerpt), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", marginTop: 20, color: "var(--secondary)" } }, homeText.columnReadMore))
  ), /* @__PURE__ */ React.createElement("div", null, secondaryColumns.map((c) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: c.id,
      ...clickable(() => go("column"), `\uCE7C\uB7FC: ${c.title}`),
      style: { padding: "18px 0", borderBottom: "1px solid var(--line)", cursor: "pointer" }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" } }, c.category && /* @__PURE__ */ React.createElement("span", { className: "pill", style: { fontSize: 9, padding: "2px 8px" } }, c.category), c.date && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, c.date)),
    /* @__PURE__ */ React.createElement("h4", { className: "ko-serif", style: { fontSize: 17, fontWeight: 600, lineHeight: 1.4, marginBottom: 5 } }, c.title),
    c.excerpt && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, lineHeight: 1.6, color: "var(--ink-3)" } }, (c.excerpt || "").slice(0, 65), "\u2026")
  )), secondaryColumns.length === 0 && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", padding: "18px 0" } }, homeText.columnEmpty)))))), lectures.length > 0 && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uAC15\uC5F0" }, /* @__PURE__ */ React.createElement("section", { className: "section-tight", style: { background: "var(--bg-2)", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement(
    SectionHead,
    {
      eyebrow: homeText.lecturesEyebrow,
      title: /* @__PURE__ */ React.createElement(React.Fragment, null, homeText.lecturesTitle),
      action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("lectures") }, homeText.lecturesAction)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-3" }, lectures.map((lecture) => /* @__PURE__ */ React.createElement(
    "article",
    {
      key: lecture.id,
      className: "card",
      ...clickable(() => {
        try {
          sessionStorage.setItem("bgnj_pending_lecture_id", String(lecture.id));
        } catch (e) {
        }
        go("lectures");
      }, `\uAC15\uC5F0: ${lecture.topic || lecture.title}`),
      style: { cursor: "pointer" }
    },
    /* @__PURE__ */ React.createElement("span", { className: "badge", style: { marginBottom: 16 } }, homeText.lectureBadge),
    /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, fontWeight: 600, marginBottom: 8 } }, lecture.topic || lecture.title),
    lecture.note && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, lineHeight: 1.7, color: "var(--ink-2)", marginBottom: 16 } }, truncatePreview(lecture.note, 110)),
    /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid var(--line)", paddingTop: 12, display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--ink-2)" } }, lecture.venue || homeText.emptyFallback), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink)" } }, lecture.next || homeText.emptyFallback))
  )))))), /* @__PURE__ */ React.createElement(BookCarouselSection, { go, dataTick, text: homeText }));
};
Object.assign(window, { HomePage });
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvSG9tZVBhZ2UuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVENjQ4XHVEMzk4XHVDNzc0XHVDOUMwIFx1MjAxNCBcdUQ1NUNcdUFENkQgXHVDNUVDXHVENTg5XHUwMEI3XHVDNUVEXHVDMEFDXHUwMEI3XHVCQjM4XHVENjU0IFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFxuLy8gXHVCMzcwXHVDNzc0XHVEMTMwIFx1QzZEMFx1Q0U1OSAodjAwLjA0Nik6XG4vLyAgIDEuIFx1QkFBOFx1QjRFMCBcdUNGNThcdUQxNTBcdUNFMjBcdUIyOTQgXHVDMTFDXHVCQzg0KEQxKSBzb3VyY2Utb2YtdHJ1dGguXG4vLyAgICAgIC0gc2MucmVjb21tZW5kYXRpb25zICAgIFx1MjE5MiBzaXRlX2NvbnRlbnRfa3YgKFx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUNGNThcdUQxNTBcdUNFMjAgXHVEMzI4XHVCMTEwKVxuLy8gICAgICAtIHB1YmxpY0NvbHVtbnMgICAgICAgICBcdTIxOTIgQkdOSl9BUEkuY29sdW1ucy5saXN0IChEMS51c2VyX2NvbHVtbnMpXG4vLyAgICAgIC0gdG91cnMgLyBsZWN0dXJlcyAgICAgIFx1MjE5MiBCR05KX0FQSS50b3Vycy9sZWN0dXJlcy5saXN0XG4vLyAgICAgIC0gcmVjZW50UG9zdHMgICAgICAgICAgIFx1MjE5MiBCR05KX0FQSS5jb21tdW5pdHkucG9zdHNcbi8vICAgMi4gQkFOR0lOT0pBX0RBVEEgXHVDODE1XHVDODAxIFx1QzJEQ1x1QjREQ1x1QjI5NCBcdUIzNTQgXHVDNzc0XHVDMEMxIFx1Q0MzOFx1Qzg3MFx1RDU1OFx1QzlDMCBcdUM1NEFcdUIyOTRcdUIyRTQuXG4vLyAgIDMuIFx1QzExQ1x1QkM4NCBcdUM3NTFcdUIyRjVcdUM3NzQgXHVCRTQ0XHVCQTc0IFx1RDU3NFx1QjJGOSBcdUMxMzlcdUMxNTggXHVDNzkwXHVDQ0I0XHVCOTdDIFx1QjgwQ1x1QjM1NFx1RDU1OFx1QzlDMCBcdUM1NEFcdUIyOTRcdUIyRTQgKFx1QUU2MVx1RDFCNSBcdUNFNzRcdUI0REMgXHVBRTA4XHVDOUMwKS5cbi8vICAgNC4gXHVCQUE4XHVCNEUwIFx1RDVFQ1x1RDM3QyBcdUQ2MzhcdUNEOUNcdUM3NDAgQkdOSl9HVUFSRC5hcnIvLmNhbGwgXHVCODVDIHRyeS9jYXRjaCArIFx1RDBDMFx1Qzc4NSBcdUFDMDBcdUI0REMgXHVEMUI1XHVBQ0ZDLlxuXG5jb25zdCBEZXN0aW5hdGlvbk1hcE1vZGFsID0gKHsgb25DbG9zZSwgZ28gfSkgPT4ge1xuICBjb25zdCBbc2VsZWN0ZWREZXN0LCBzZXRTZWxlY3RlZERlc3RdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIC8vIHYwMC4wNzcgXHUyMDE0IHVzZU1vZGFsR3VhcmQgXHVEMUI1XHVDNzdDIChFU0MgKyBib2R5IHNjcm9sbCBsb2NrICsgcG9wc3RhdGUpLiBcdUM3N0RcdUFFMzAgXHVDODA0XHVDNkE5IFx1MjE5MiBkaXJ0eT1mYWxzZS5cbiAgd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiBmYWxzZSwgb25DbG9zZSwgb25TYXZlRHJhZnQ6IG51bGwsIGxhYmVsOiAnXHVDNUVDXHVENTg5XHVDOUMwIFx1QzlDMFx1QjNDNCBcdUQwRDBcdUMwQzknIH0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIlx1QzVFQ1x1RDU4OVx1QzlDMCBcdUM5QzBcdUIzQzQgXHVEMEQwXHVDMEM5XCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGluc2V0OjAsIHpJbmRleDoyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6J3JnYmEoMTUsMjMsNDIsMC41NSknLFxuICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgcGFkZGluZzoyMCxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkgb25DbG9zZSgpOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgbWF4V2lkdGg6NjgwLCB3aWR0aDonMTAwJScsIG1heEhlaWdodDonOTJ2aCcsXG4gICAgICAgIG92ZXJmbG93OidhdXRvJywgcGFkZGluZzonMzJweCAyOHB4IDI4cHgnLCBwb3NpdGlvbjoncmVsYXRpdmUnLFxuICAgICAgICBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfSBhcmlhLWxhYmVsPVwiXHVCMkVCXHVBRTMwXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgdG9wOjE0LCByaWdodDoxNCxcbiAgICAgICAgICAgIHdpZHRoOjM2LCBoZWlnaHQ6MzYsIGZvbnRTaXplOjI0LFxuICAgICAgICAgICAgYmFja2dyb3VuZDondHJhbnNwYXJlbnQnLCBib3JkZXI6J25vbmUnLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgY29sb3I6J3ZhcigtLWluay0yKScsIGxpbmVIZWlnaHQ6MSxcbiAgICAgICAgICB9fT5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBzdHlsZT17e21hcmdpbkJvdHRvbToxNH19PkRFU1RJTkFUSU9OUyBcdTAwQjcgXHVDNUVDXHVENTg5XHVDOUMwIFx1QzlDMFx1QjNDNDwvZGl2PlxuICAgICAgICA8aDIgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LWRpc3BsYXkpJywgZm9udFNpemU6MjYsIGZvbnRXZWlnaHQ6OTAwLCBtYXJnaW5Cb3R0b206MTAsIGxpbmVIZWlnaHQ6MS4yfX0+XG4gICAgICAgICAgXHVDOUMwXHVCM0M0XHVCOTdDIFx1RDA3NFx1QjlBRFx1RDU3NCBcdUQwRDBcdUMwQzlcdUQ1NThcdUMxMzhcdUM2OTRcbiAgICAgICAgPC9oMj5cbiAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyMCwgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICBcdUMyRENcdUIzQzRcdUI5N0MgXHVCMjA0XHVCOTc0XHVCQTc0IFx1QzgxNVx1QkNGNFx1QUMwMCBcdUQzQkNcdUNDRDBcdUM5RDFcdUIyQzhcdUIyRTQuIFx1RDYzOFx1QkM4NFx1RDU1OFx1QkE3NCBcdUM5QzBcdUJBODVcdUM3NzQgXHVENDVDXHVDMkRDXHVCNDI5XHVCMkM4XHVCMkU0LlxuICAgICAgICA8L3A+XG4gICAgICAgIHt0eXBlb2YgS29yZWFNYXAgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgPEtvcmVhTWFwXG4gICAgICAgICAgICBvblNlbGVjdD17KGRlc3QpID0+IHNldFNlbGVjdGVkRGVzdChzZWxlY3RlZERlc3Q/LmlkID09PSBkZXN0LmlkID8gbnVsbCA6IGRlc3QpfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkRGVzdD8uaWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7aGVpZ2h0OjMwMCwgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIGNvbG9yOid2YXIoLS1pbmstMyknLCBmb250U2l6ZToxM319Plx1QzlDMFx1QjNDNCBcdUI4NUNcdUI1MjkgXHVDOTExLi4uPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHtzZWxlY3RlZERlc3QgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIG1hcmdpblRvcDoxOCwgcGFkZGluZzonMThweCAyMHB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidiYXNlbGluZScsIGdhcDoxMCwgbWFyZ2luQm90dG9tOjgsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MjIsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo2MDB9fT57c2VsZWN0ZWREZXN0Lm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMTJlbSd9fT57c2VsZWN0ZWREZXN0LmZ1bGxuYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge3NlbGVjdGVkRGVzdC5kZXNjICYmIChcbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxNCwgY29sb3I6J3ZhcigtLWluay0yKScsIGxpbmVIZWlnaHQ6MS43LCBtYXJnaW5Cb3R0b206MTJ9fT57c2VsZWN0ZWREZXN0LmRlc2N9PC9wPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtzZWxlY3RlZERlc3QudGFncyAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjYsIGZsZXhXcmFwOid3cmFwJywgbWFyZ2luQm90dG9tOjE0fX0+XG4gICAgICAgICAgICAgICAge1N0cmluZyhzZWxlY3RlZERlc3QudGFncykuc3BsaXQoJ1x1MDBCNycpLm1hcCgodCkgPT4gdC50cmltKCkpLmZpbHRlcihCb29sZWFuKS5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGtleT17dH0gY2xhc3NOYW1lPVwiYmFkZ2VcIiBzdHlsZT17e2ZvbnRTaXplOjEwfX0+e3R9PC9zcGFuPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiB7IGdvKCd0b3VyJyk7IG9uQ2xvc2UoKTsgfX0+XG4gICAgICAgICAgICAgIFx1Qzc3NCBcdUM5QzBcdUM1RUQgXHVEMjJDXHVDNUI0IFx1QkNGNFx1QUUzMCBcdTIxOTJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdUMxMzlcdUMxNTggXHVCMkU4XHVDNzA0IFx1QzVEMFx1QjdFQyBcdUJDMTRcdUM2QjRcdUIzNTRcdUI5QUMgXHUyMDE0IFx1RDU1QyBcdUMxMzlcdUMxNThcdUM3NzQgXHVCOUREXHVBQzAwXHVDODM4XHVCM0M0IFx1QjJFNFx1Qjk3OCBcdUMxMzlcdUMxNThcdUM3NDAgXHVDODE1XHVDMEMxIFx1QjgwQ1x1QjM1NC5cbmNsYXNzIEhvbWVTZWN0aW9uQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVycikge1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tIb21lU2VjdGlvbkJvdW5kYXJ5XScsIHRoaXMucHJvcHMubGFiZWwgfHwgJ3NlY3Rpb24nLCBlcnIpOyB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6ICdIT01FX1NFQ1RJT05fRVJST1InLCBzdGF0dXM6IG51bGwsIGtpbmQ6ICdyZW5kZXInLFxuICAgICAgICBtZXNzYWdlOiBlcnI/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVyciksXG4gICAgICAgIGhpbnQ6IGBzZWN0aW9uPSR7dGhpcy5wcm9wcy5sYWJlbCB8fCAnJ31gLCB1cmw6ICcnLFxuICAgICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsIG9yaWdpbjogbG9jYXRpb24ub3JpZ2luLFxuICAgICAgfSk/LmNhdGNoPy4oKCkgPT4ge30pO1xuICAgIH0gY2F0Y2gge31cbiAgfVxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIC8vIFx1QkIzNFx1Qzc0QyBcdUFDQTlcdUI5QUMgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QzVEMFx1QUM4QyBcdUJFNDggXHVDNzkwXHVCOUFDIFx1QjMwMFx1QzJFMCBcdUFDMDBcdUJDQkNcdUM2QjQgcGxhY2Vob2xkZXIgXHVENTVDIFx1QzkwNFx1QjlDQyBcdUQ0NUNcdUFFMzBcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzZWN0aW9uIHN0eWxlPXt7cGFkZGluZzonMjRweCAwJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB0ZXh0QWxpZ246J2NlbnRlcid9fT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgbGV0dGVyU3BhY2luZzonMC4xOGVtJ319PlxuICAgICAgICAgICAgXHUyNkEwIHt0aGlzLnByb3BzLmxhYmVsIHx8ICdcdUM3NzQgXHVDMTM5XHVDMTU4J30gXHVDNzQ0IFx1QkQ4OFx1QjdFQ1x1QzYyNFx1QzlDMCBcdUJBQkJcdUQ1ODhcdUMyQjVcdUIyQzhcdUIyRTRcbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59XG5cbi8vIFx1Q0Q5NFx1Q0M5QyBcdUM1RUNcdUQ1ODlcdUM5QzAgXHVDMEMxXHVDMTM4IFx1QkFBOFx1QjJFQyBcdTIwMTQgXHVDRTc0XHVCNERDIFx1RDA3NFx1QjlBRCBcdUMyREMgXHVCMzU0IFx1RDA3MCBcdUM3NzRcdUJCRjhcdUM5QzAgKyBcdUM4MDRcdUNDQjQgXHVDMTI0XHVCQTg1ICsgXHVEMERDXHVBREY4ICsgXHVEMjJDXHVDNUI0IFx1QkNGNFx1QUUzMCBDVEEuXG5jb25zdCBSZWNvbW1lbmRhdGlvbkRldGFpbE1vZGFsID0gKHsgcmVjLCBvbkNsb3NlLCBnbyB9KSA9PiB7XG4gIC8vIHYwMC4wNzcgXHUyMDE0IHVzZU1vZGFsR3VhcmQgXHVEMUI1XHVDNzdDIChFU0MgKyBib2R5IHNjcm9sbCBsb2NrICsgcG9wc3RhdGUpLiBcdUM3N0RcdUFFMzAgXHVDODA0XHVDNkE5IFx1MjE5MiBkaXJ0eT1mYWxzZS5cbiAgd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiBmYWxzZSwgb25DbG9zZSwgb25TYXZlRHJhZnQ6IG51bGwsIGxhYmVsOiByZWM/Lm5hbWUgfHwgJ1x1QzVFQ1x1RDU4OVx1QzlDMCBcdUMwQzFcdUMxMzgnIH0pO1xuICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheShyZWMudGFncylcbiAgICA/IHJlYy50YWdzXG4gICAgOiAodHlwZW9mIHJlYy50YWdzID09PSAnc3RyaW5nJyA/IHJlYy50YWdzLnNwbGl0KC9bLFx1MDBCN10vKS5tYXAoKHMpID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBhcmlhLWxhYmVsPXtgJHtyZWMubmFtZSB8fCAnXHVDRDk0XHVDQzlDJ30gXHVDMEMxXHVDMTM4YH1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGluc2V0OjAsIHpJbmRleDoyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6J3JnYmEoMTUsMjMsNDIsMC41NSknLFxuICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgcGFkZGluZzoyMCxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkgb25DbG9zZSgpOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgbWF4V2lkdGg6NzIwLCB3aWR0aDonMTAwJScsIG1heEhlaWdodDonOTJ2aCcsXG4gICAgICAgIG92ZXJmbG93OidhdXRvJywgcG9zaXRpb246J3JlbGF0aXZlJyxcbiAgICAgICAgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbG9zZX0gYXJpYS1sYWJlbD1cIlx1QjJFQlx1QUUzMFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDoxNCwgcmlnaHQ6MTQsIHpJbmRleDoyLFxuICAgICAgICAgICAgd2lkdGg6MzYsIGhlaWdodDozNiwgZm9udFNpemU6MjQsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgIGNvbG9yOid2YXIoLS1pbmspJywgbGluZUhlaWdodDoxLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICB9fT5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAge3JlYy5pbWFnZURhdGFVcmkgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOicxMDAlJywgaGVpZ2h0OjI4MCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGB1cmwoJHtyZWMuaW1hZ2VEYXRhVXJpfSkgY2VudGVyL2NvdmVyYCxcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICB9fS8+XG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOicyOHB4IDI4cHggMjRweCd9fT5cbiAgICAgICAgICB7cmVjLnJlZ2lvbiAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6J2lubGluZS1ibG9jaycsIHBhZGRpbmc6JzRweCAxMHB4JyxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBtYXJnaW5Cb3R0b206MTQsXG4gICAgICAgICAgICB9fT57cmVjLnJlZ2lvbn08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZTozMiwgZm9udFdlaWdodDo3MDAsXG4gICAgICAgICAgICBjb2xvcjondmFyKC0taW5rKScsIGxpbmVIZWlnaHQ6MS4yLCBtYXJnaW5Cb3R0b206OCxcbiAgICAgICAgICB9fT57cmVjLm5hbWUgfHwgJ1x1QzgxQ1x1QkFBOSBcdUM1QzZcdUM3NEMnfTwvaDI+XG4gICAgICAgICAge3JlYy5zdWJ0aXRsZSAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMywgZm9udFdlaWdodDo2MDAsXG4gICAgICAgICAgICAgIGNvbG9yOid2YXIoLS1zZWNvbmRhcnkpJywgbGV0dGVyU3BhY2luZzonMC4wNGVtJywgbWFyZ2luQm90dG9tOjE4LFxuICAgICAgICAgICAgfX0+e3JlYy5zdWJ0aXRsZX08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtyZWMuZGVzYyAmJiAoXG4gICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjE1LCBsaW5lSGVpZ2h0OjEuODUsIGNvbG9yOid2YXIoLS1pbmstMiknLCBtYXJnaW5Cb3R0b206MjJ9fT57cmVjLmRlc2N9PC9wPlxuICAgICAgICAgICl9XG4gICAgICAgICAge3RhZ3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo2LCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbToyMn19PlxuICAgICAgICAgICAgICB7dGFncy5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZToxMH19Pnt0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEwLCBmbGV4V3JhcDond3JhcCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgcGFkZGluZ1RvcDoxOH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGRcIiBvbkNsaWNrPXsoKSA9PiB7IGdvKCd0b3VyJyk7IG9uQ2xvc2UoKTsgfX0+XHVDNzc0IFx1QzlDMFx1QzVFRCBcdUQyMkNcdUM1QjQgXHVCQ0Y0XHVBRTMwIFx1MjE5MjwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXtvbkNsb3NlfT5cdUIyRUJcdUFFMzA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIHYwMC4wNzIgXHUyMDE0IFx1RDY0OCBcdUNFNzRcdUI0RENcdUM3NTggZGVzY3JpcHRpb24gLyBub3RlIFx1Qjk3QyBcdUM5RTdcdUFDOEMgXHVDNzkwXHVCOTc0XHVCMjk0IFx1RDVFQ1x1RDM3Qy5cbi8vIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUJDRjRcdUFDRTA6IFwiXHVENjQ4XHVDNUQwIFx1QjE3OFx1Q0Q5Q1x1QjQxOFx1QjI5NFx1QUM3NCBcdUM4MDFcdUIyRjlcdUQ3ODggXHVDOTA0XHVDNzc0XHVBQzcwXHVCMDk4IFx1RDY0OFx1QzZBOVx1QzczQ1x1Qjg1QyBcdUI1MzBcdUI4NUMgXHVBRTAwXHVDNzQ0IFx1QzRGMFx1QUM4QyBcdUQ1NzRcdUM1N0NcdUM5QzBcIiBcdTIwMTQgXHVDNkIwXHVDMTIwIHRydW5jYXRlLlxuLy8gXHVDOTA0XHVCQzE0XHVBRkM4XHVDNzQwIFx1QUNGNVx1QkMzMVx1QzczQ1x1Qjg1QyBcdUJDQzBcdUQ2NThcdUQ1NzQgXHVDRTc0XHVCNERDIFx1QjgwOFx1Qzc3NFx1QzU0NFx1QzZDM1x1Qzc3NCBcdUM1NDhcdUM4MTUuIFx1QjJFOFx1QzVCNCBcdUFDQkRcdUFDQzRcdUM1RDAgXHVCOURFXHVDREIwIFx1Qzc5MFx1Qjk3OCBcdUI0QTQgXCJcdTIwMjZcIiBcdUNDQThcdUJEODAuXG5jb25zdCB0cnVuY2F0ZVByZXZpZXcgPSAodGV4dCwgbWF4ID0gMTEwKSA9PiB7XG4gIGNvbnN0IHMgPSBTdHJpbmcodGV4dCB8fCAnJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKTtcbiAgaWYgKHMubGVuZ3RoIDw9IG1heCkgcmV0dXJuIHM7XG4gIC8vIFx1QjJFOFx1QzVCNCBcdUFDQkRcdUFDQzRcdUFFNENcdUM5QzAgYmFja3RyYWNrIFx1MjAxNCBcdUQ1NUNcdUFFMDBcdUM3NDAgXHVBQ0Y1XHVCQzMxXHVDNzc0IFx1QzgwMVx1QzVCNCBiYWNrdHJhY2sgXHVDMkU0XHVEMzI4XHVENTU4XHVCQTc0IFx1QURGOFx1QjBFNSBcdUM3OTBcdUI5NzRcdUFFMzAuXG4gIGNvbnN0IHNsaWNlID0gcy5zbGljZSgwLCBtYXgpO1xuICBjb25zdCBsYXN0U3BhY2UgPSBzbGljZS5sYXN0SW5kZXhPZignICcpO1xuICBjb25zdCBjdXQgPSBsYXN0U3BhY2UgPiBtYXggKiAwLjYgPyBzbGljZS5zbGljZSgwLCBsYXN0U3BhY2UpIDogc2xpY2U7XG4gIHJldHVybiBjdXQgKyAnXHUyMDI2Jztcbn07XG5cbmNvbnN0IEhPTUVfVEVYVF9ERUZBVUxUID0ge1xuICByZWNFeWVicm93OiAnXHVDNkI0XHVDNjAxXHVDNzkwXHVBQzAwIFx1QjJFNFx1QjE0MFx1QzYyOCBcdUFDRjMnLFxuICByZWNUaXRsZVByZWZpeDogJ1x1QzY5NFx1Qzk5OCAnLFxuICByZWNUaXRsZUFjY2VudDogJ1x1QjIwOFx1QzVEMCBcdUI0RTRcdUM1QjRcdUM2MjgnLFxuICByZWNUaXRsZVN1ZmZpeDogJyBcdUM3QTVcdUMxOEMnLFxuICByZWNTdWJ0aXRsZTogJ1x1QzlDMVx1QzgxMSBcdUFDNzdcdUFDRTAgXHVCQTM5XHVDNUI0XHVCQ0Y4IFx1QjRBNCBcdUIyRTRcdUMyREMgXHVBRUJDXHVCMEI0IFx1QkNGNFx1QUNFMCBcdUMyRjZcdUM3NDAgXHVBQ0YzXHVCOUNDIFx1QUNFOFx1Qjc5MFx1QzJCNVx1QjJDOFx1QjJFNC4nLFxuICByZWNBY3Rpb246ICdcdUM4MDRcdUNDQjQgXHVDNzdDXHVDODE1IFx1MjE5MicsXG4gIHRvdXJFeWVicm93OiAnXHVCMkY1XHVDMEFDIFx1Qzc3Q1x1QzgxNScsXG4gIHRvdXJUaXRsZTogJ1x1Qzc3NFx1QkM4OFx1QzVEMCBcdUQ1NjhcdUFFRDggXHVBQzc4XHVDNzQ0IFx1QUUzOCcsXG4gIHRvdXJTdWJ0aXRsZTogJ1x1RDA3MCBcdUJDODRcdUMyQTRcdUJDRjRcdUIyRTQgXHVDNzkxXHVDNzQwIFx1QUM3OFx1Qzc0Q1x1QzVEMCBcdUI5REVcdUNEOTggXHVCMkY1XHVDMEFDXHVDNzg1XHVCMkM4XHVCMkU0LiBcdUM3QTVcdUMxOENcdUM3NTggXHVCMEI0XHVCODI1XHVBQ0ZDIFx1QzYyNFx1QjI5OFx1Qzc1OCBcdUQ0NUNcdUM4MTVcdUM3NDQgXHVBQzE5XHVDNzc0IFx1QkQwNVx1QjJDOFx1QjJFNC4nLFxuICB0b3VyQWN0aW9uOiAnXHVDODA0XHVDQ0I0IFx1Qzc3Q1x1QzgxNSBcdTIxOTInLFxuICB0b3VyTmV4dExhYmVsOiAnXHVCMkU0XHVDNzRDIFx1Qzc3Q1x1QzgxNScsXG4gIHRvdXJQcmljZUxhYmVsOiAnXHVDQzM4XHVBQzAwXHVCRTQ0JyxcbiAgY29tbXVuaXR5RXllYnJvdzogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCcsXG4gIGNvbW11bml0eVRpdGxlOiAnXHVCMkU0XHVCMTQwXHVDNjI4IFx1QzBBQ1x1Qjc4Q1x1QjRFNFx1Qzc1OCBcdUFFMzBcdUI4NUQnLFxuICBjb21tdW5pdHlTdWJ0aXRsZTogJ1x1Qzg4Qlx1QzU1OFx1QjM1OCBcdUMyRERcdUIyRjksIFx1QzU2MFx1QjlFNFx1RDU4OFx1QjM1OCBcdUIzRDlcdUMxMjAsIFx1QjJFNFx1QzJEQyBcdUFDMDBcdUFDRTAgXHVDMkY2XHVDNzQwIFx1QUNFOFx1QkFBOVx1QUU0Q1x1QzlDMCBcdUQzQjhcdUQ1NThcdUFDOEMgXHVCMEE4XHVBQ0E4XHVDOEZDXHVDMTM4XHVDNjk0LicsXG4gIGNvbW11bml0eUFjdGlvbjogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdUFDMDBcdUFFMzAgXHUyMTkyJyxcbiAgY29tbXVuaXR5UmVwbHlMYWJlbDogJ1x1QjMxM1x1QUUwMCcsXG4gIGNvbW11bml0eUVtcHR5VGl0bGU6ICdcdUNDQUIgXHVCQzg4XHVDOUY4IFx1QzVFQ1x1RDU4OSBcdUM3NzRcdUM1N0NcdUFFMzBcdUI5N0MgXHVDMzY4XHVDOEZDXHVDMTM4XHVDNjk0JyxcbiAgY29tbXVuaXR5RW1wdHlTdWJ0aXRsZTogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFx1QzVEMCBcdUM1RUNcdUQ1ODkgXHVBQ0JEXHVENUQ4XHVDNzQ0IFx1QjA5OFx1QjIwNFx1QkE3NCBcdUIzNTQgXHVCOUNFXHVDNzQwIFx1QzVFQ1x1RDU4OVx1Qzc5MFx1QjRFNFx1Qzc3NCBcdUJBQThcdUM1RUNcdUI0RURcdUIyQzhcdUIyRTQuJyxcbiAgY29tbXVuaXR5RW1wdHlDdGE6ICdcdUFFMDAgXHVDNzkxXHVDMTMxXHVENTU4XHVBRTMwIFx1MjE5MicsXG4gIGNvbHVtbkV5ZWJyb3c6ICdcdUM3N0RcdUM3NDRcdUFDNzBcdUI5QUMnLFxuICBjb2x1bW5UaXRsZTogJ1x1QUUzOCBcdUM3MDRcdUM1RDBcdUMxMUMgXHVDNzc0XHVDNUI0XHVDOUMwXHVCMjk0IFx1QzBERFx1QUMwMScsXG4gIGNvbHVtblN1YnRpdGxlOiAnXHVCMkY1XHVDMEFDXHVDNUQwXHVDMTFDIFx1QzJEQ1x1Qzc5MVx1RDU3NCBcdUNDNDVcdUMwQzEgXHVDNzA0XHVCODVDIFx1QjNDQ1x1QzU0NFx1QzYyOCBcdUM3NzRcdUM1N0NcdUFFMzBcdUI0RTRcdUM3ODVcdUIyQzhcdUIyRTQuJyxcbiAgY29sdW1uQWN0aW9uOiAnXHVDRTdDXHVCN0ZDIFx1QzgwNFx1Q0NCNCBcdUJDRjRcdUFFMzAgXHUyMTkyJyxcbiAgY29sdW1uUmVhZE1vcmU6ICdcdUIzNTQgXHVDNzdEXHVBRTMwIFx1MjE5MicsXG4gIGNvbHVtbkVtcHR5OiAnXHVCMkU0XHVDNzRDIFx1Q0U3Q1x1QjdGQyBcdUM5MDBcdUJFNDQgXHVDOTExXHVDNzg1XHVCMkM4XHVCMkU0LicsXG4gIGxlY3R1cmVzRXllYnJvdzogJ1x1QUMxNVx1QzVGMCcsXG4gIGxlY3R1cmVzVGl0bGU6ICdcdUM1NDlcdUM1NDRcdUMxMUMgXHVCQTNDXHVDODAwIFx1QjVBMFx1QjA5OFx1QjI5NCBcdUMyRENcdUFDMDQnLFxuICBsZWN0dXJlc0FjdGlvbjogJ1x1QzgwNFx1Q0NCNCBcdUFDMTVcdUM1RjAgXHVCQ0Y0XHVBRTMwIFx1MjE5MicsXG4gIGxlY3R1cmVCYWRnZTogJ1x1QUMxNVx1QzVGMCcsXG4gIGhlcm9SZWNlbnRMZWN0dXJlTGFiZWw6ICdcdUNENUNcdUFERkMgXHVBQzE1XHVDNUYwJyxcbiAgaGVyb05leHRMZWN0dXJlTGFiZWw6ICdcdUIyRTRcdUM3NEMgXHVBQzE1XHVDNUYwJyxcbiAgaGVyb05leHRUb3VyTGFiZWw6ICdcdUIyRTRcdUM3NEMgXHVCMkY1XHVDMEFDJyxcbiAgaGVyb05vTGVjdHVyZVRleHQ6ICdcdUM2MDhcdUM4MTVcdUI0MUMgXHVBQzE1XHVDNUYwXHVDNzc0IFx1QzU0NFx1QzlDMSBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuJyxcbiAgaGVyb05vTGVjdHVyZUN0YTogJ1x1QzgwNFx1Q0NCNCBcdUFDMTVcdUM1RjAgXHVCQ0Y0XHVBRTMwIFx1MjE5MicsXG4gIGhlcm9Ob1RvdXJUZXh0OiAnXHVDNjA4XHVDODE1XHVCNDFDIFx1QjJGNVx1QzBBQ1x1QUMwMCBcdUM1NDRcdUM5QzEgXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LicsXG4gIGhlcm9Ob1RvdXJDdGE6ICdcdUM4MDRcdUNDQjQgXHVCMkY1XHVDMEFDIFx1QkNGNFx1QUUzMCBcdTIxOTInLFxuICB2ZW51ZUZhbGxiYWNrOiAnXHVDN0E1XHVDMThDIFx1QkJGOFx1QzgxNScsXG4gIGVtcHR5RmFsbGJhY2s6ICdcdTIwMTQnLFxuICBib29rRXllYnJvd1ByZWZpeDogJ1x1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNEOUNcdUQzMTAnLFxuICBib29rQnV5Q3RhOiAnXHVBRDZDXHVCOUU0XHVENTU4XHVBRTMwIFx1MjE5MicsXG4gIGJvb2tLckxhYmVsOiAnXHVBRDZEXHVCQjM4XHVEMzEwJyxcbiAgYm9va0VuTGFiZWw6ICdcdUM2MDFcdUJCMzhcdUQzMTAnLFxuICBib29rQXV0aG9yU3VmZml4OiAnXHVDOUMwXHVDNzRDJyxcbn07XG5cbmNvbnN0IGdldEhvbWVUZXh0ID0gKHNjKSA9PiAoeyAuLi5IT01FX1RFWFRfREVGQVVMVCwgLi4uKChzYyAmJiB0eXBlb2Ygc2MuaG9tZVRleHQgPT09ICdvYmplY3QnKSA/IHNjLmhvbWVUZXh0IDoge30pIH0pO1xuXG4vLyB2MDAuMTA2IFx1MjAxNCBcdUQ2NDggXHVENzg4XHVDNUI0XHVCODVDXHVDNzU4IFx1QzlDMFx1QjNDNCBcdUM3OTBcdUI5QUMuIFx1QjJFNFx1Qzc0QyBcdUFDMTVcdUM1RjAgKyBcdUIyRTRcdUM3NEMgXHVCMkY1XHVDMEFDIFx1QkJGOFx1QjJDOCBcdUNFNzRcdUI0REMuXG4vLyBcdUMwQUNcdUM2QTlcdUM3OTAgXHVDODFDXHVDNTQ4IEFcdUM1NDg6ICdcdUFDMTVcdUM1RjAvXHVCMkY1XHVDMEFDIFx1QkJGOFx1QjJDOCBcdUNFNzRcdUI0REMnIChcdUM2QjRcdUM2MDEgXHVBQzAwXHVDRTU4IFx1MjE5MSwgXHVDN0FDXHVCQzI5XHVCQjM4IFx1QUMwMFx1Q0U1OCBcdTIxOTEpLlxuY29uc3QgSGVyb1Byb2dyYW1DYXJkcyA9ICh7IGdvLCBkYXRhVGljaywgdGV4dCB9KSA9PiB7XG4gIC8vIHYwMC4xMTAgXHUyMDE0IG1vZHVsZS1zY29wZSBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjhcdUIyOTQgSG9tZVBhZ2UgXHVDNzU4IGBjb25zdCBHID0gd2luZG93LkJHTkpfR1VBUkQ7YCBcdUI5N0MgXHVDMEFDXHVDNkE5IFx1QkFCQiBcdUQ1NjguXG4gIC8vIHdpbmRvdy5CR05KX0dVQVJEIFx1Qjk3QyBcdUM5QzFcdUM4MTEgXHVDQzM4XHVDODcwICsgXHVDNTQ4XHVDODA0XHVENTVDIFx1RDNGNFx1QkMzMS5cbiAgY29uc3QgX2FyciA9IChmbikgPT4ge1xuICAgIHRyeSB7IGNvbnN0IHYgPSBmbigpOyByZXR1cm4gQXJyYXkuaXNBcnJheSh2KSA/IHYgOiBbXTsgfSBjYXRjaCB7IHJldHVybiBbXTsgfVxuICB9O1xuICAvLyB2MDAuMTE1IFx1MjAxNCBzdGFydHNBdCBcdUFDMDAgaW52YWxpZCBcdUQ1NUMgcm93IFx1QUMwMCBzb3J0IFx1QzVEMCBcdUI0RTRcdUM1QjRcdUFDMDBcdUJBNzQgXHVBQ0IwXHVBQ0ZDIFx1QzIxQ1x1QzExQ1x1QUMwMCBcdUM3ODRcdUM3NThcdUI4NUMgXHVBRTY4XHVDOUQwLlxuICAvLyBcdUQ1NUMgXHVCQzg4IFx1QjM1NCBEYXRlLnBhcnNlICFpc05hTiBcdUI4NUMgXHVBQzcwXHVCOTc4IFx1QjRBNCBzb3J0LlxuICBjb25zdCBfdmFsaWRTdGFydHMgPSAobCkgPT4ge1xuICAgIGlmICghbCB8fCBsLmhpZGRlbiB8fCAhbC5zdGFydHNBdCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiAhaXNOYU4oRGF0ZS5wYXJzZShsLnN0YXJ0c0F0KSk7XG4gIH07XG4gIC8vIHYwMC4xMjkgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM2OTRcdUNDQUQgJ1x1QzlDNFx1RDU4OSBcdUM2MDhcdUM4MTUgXHVBQzE1XHVDNUYwXHVDNzc0IFx1QzVDNlx1QzczQ1x1QkE3NCBcdUM5QzBcdUIwOUMgXHVBQzE1XHVDNUYwXHVDNzQ0IFx1QjE3OFx1Q0Q5QyAoM1x1QUMxQyBcdUM3NzRcdUIwQjQpJy5cbiAgLy8gMSkgXHVDNUI0XHVDODFDIFx1Qzc3NFx1RDZDNCBcdUFDMTVcdUM1RjAgXHVDNkIwXHVDMTIwLiAyKSBcdUM1QzZcdUM3M0NcdUJBNzQgXHVBQzAwXHVDN0E1IFx1Q0Q1Q1x1QURGQyBcdUM5QzBcdUIwOUMgXHVBQzE1XHVDNUYwIDNcdUFDMUNcdUI4NUMgXHVEM0Y0XHVCQzMxLlxuICBjb25zdCBsZWN0dXJlcyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGFsbCA9IF9hcnIoKCkgPT4gd2luZG93LkJHTkpfTEVDVFVSRVM/Lmxpc3RBbGw/LigpKVxuICAgICAgLmZpbHRlcihfdmFsaWRTdGFydHMpO1xuICAgIGNvbnN0IGN1dG9mZiA9IERhdGUubm93KCkgLSA4NjQwMDAwMDtcbiAgICBjb25zdCB1cGNvbWluZyA9IGFsbFxuICAgICAgLmZpbHRlcigobCkgPT4gbmV3IERhdGUobC5zdGFydHNBdCkuZ2V0VGltZSgpID49IGN1dG9mZilcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShhLnN0YXJ0c0F0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShiLnN0YXJ0c0F0KS5nZXRUaW1lKCkpO1xuICAgIGlmICh1cGNvbWluZy5sZW5ndGggPiAwKSByZXR1cm4gdXBjb21pbmc7XG4gICAgLy8gZmFsbGJhY2sgXHUyMDE0IFx1QUMwMFx1QzdBNSBcdUNENUNcdUFERkMgXHVDOUMwXHVCMDlDIFx1QUMxNVx1QzVGMCAzXHVBQzFDIChuZXdlc3QtZmlyc3QpLlxuICAgIHJldHVybiBhbGxcbiAgICAgIC5maWx0ZXIoKGwpID0+IG5ldyBEYXRlKGwuc3RhcnRzQXQpLmdldFRpbWUoKSA8IGN1dG9mZilcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShiLnN0YXJ0c0F0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShhLnN0YXJ0c0F0KS5nZXRUaW1lKCkpXG4gICAgICAuc2xpY2UoMCwgMyk7XG4gIH0sIFtkYXRhVGlja10pO1xuICBjb25zdCB0b3VycyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBfYXJyKCgpID0+IHdpbmRvdy5CR05KX1RPVVJTPy5saXN0QWxsPy4oKSlcbiAgICAgIC5maWx0ZXIoX3ZhbGlkU3RhcnRzKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGEuc3RhcnRzQXQpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGIuc3RhcnRzQXQpLmdldFRpbWUoKSlcbiAgICAgIC5maWx0ZXIoKHQpID0+IG5ldyBEYXRlKHQuc3RhcnRzQXQpLmdldFRpbWUoKSA+PSBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICB9LCBbZGF0YVRpY2tdKTtcblxuICBjb25zdCBuZXh0TGVjdHVyZSA9IGxlY3R1cmVzWzBdO1xuICBjb25zdCBuZXh0VG91ciA9IHRvdXJzWzBdO1xuICAvLyB2MDAuMTI5IFx1MjAxNCBcdUFDMTVcdUM1RjBcdUM3NzQgZmFsbGJhY2sgKFx1QzlDMFx1QjA5QyBcdUFDMTVcdUM1RjAgXHVCMTc4XHVDRDlDIFx1QkFBOFx1QjREQykgXHVDNzc4XHVDOUMwIFx1RDMxMFx1QzgxNS4gbmV4dExlY3R1cmUuc3RhcnRzQXQgXHVBQzAwIFx1QzVCNFx1QzgxQ1x1QkNGNFx1QjJFNCBcdUFDRkNcdUFDNzBcdUJBNzQgcGFzdCBtb2RlLlxuICBjb25zdCBsZWN0dXJlSXNQYXN0ID0gbmV4dExlY3R1cmUgJiYgbmV4dExlY3R1cmUuc3RhcnRzQXQgJiZcbiAgICAobmV3IERhdGUobmV4dExlY3R1cmUuc3RhcnRzQXQpLmdldFRpbWUoKSA8IERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG5cbiAgLy8gdjAwLjExMCBcdTIwMTQgXHVDMkRDXHVBQzA0IFx1RDQ1Q1x1QzJEQ1x1QjI5NCBcdUMwQUNcdUM3NzRcdUQyQjggXHVDODA0XHVCQzE4IEtTVCBcdUFFMzBcdUM5MDAuIEJHTkpfRk1ULmtzdEZyaWVuZGx5IFx1QzBBQ1x1QzZBOS5cbiAgY29uc3QgZm10RGF0ZSA9IChpc28pID0+IHtcbiAgICBpZiAoIWlzbykgcmV0dXJuICcnO1xuICAgIGlmICh3aW5kb3cuQkdOSl9GTVQ/LmtzdEZyaWVuZGx5KSByZXR1cm4gd2luZG93LkJHTkpfRk1ULmtzdEZyaWVuZGx5KGlzbyk7XG4gICAgLy8gXHVEM0Y0XHVCQzMxIChCR05KX0ZNVCBcdUJCRjhcdUI4NUNcdUI0REMgXHVDMkRDKVxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShpc28pO1xuICAgIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCBkb3cgPSBbJ1x1Qzc3QycsJ1x1QzZENCcsJ1x1RDY1NCcsJ1x1QzIxOCcsJ1x1QkFBOScsJ1x1QUUwOCcsJ1x1RDFBMCddW2QuZ2V0RGF5KCldO1xuICAgIHJldHVybiBgJHtkLmdldE1vbnRoKCkrMX0uJHtwYWQoZC5nZXREYXRlKCkpfSAoJHtkb3d9KSAke3BhZChkLmdldEhvdXJzKCkpfToke3BhZChkLmdldE1pbnV0ZXMoKSl9YDtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1wcm9ncmFtLXN0YWNrXCI+XG4gICAgICB7LyogXHVCMkU0XHVDNzRDIFx1QUMxNVx1QzVGMCBcdUNFNzRcdUI0REMgKi99XG4gICAgICA8YXJ0aWNsZVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IGlmIChuZXh0TGVjdHVyZSkgZ28oJ2xlY3R1cmVzJyk7IH19XG4gICAgICAgIGNsYXNzTmFtZT1cImhvbWUtcHJvZ3JhbS1jYXJkXCJcbiAgICAgICAgc3R5bGU9e3tjdXJzb3I6IG5leHRMZWN0dXJlID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnfX1cbiAgICAgICAgcm9sZT17bmV4dExlY3R1cmUgPyAnYnV0dG9uJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgdGFiSW5kZXg9e25leHRMZWN0dXJlID8gMCA6IHVuZGVmaW5lZH1cbiAgICAgICAgb25LZXlEb3duPXsoZSkgPT4geyBpZiAobmV4dExlY3R1cmUgJiYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpKSB7IGUucHJldmVudERlZmF1bHQoKTsgZ28oJ2xlY3R1cmVzJyk7IH0gfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1wcm9ncmFtLWxhYmVsXCI+XG4gICAgICAgICAge2xlY3R1cmVJc1Bhc3QgPyB0ZXh0Lmhlcm9SZWNlbnRMZWN0dXJlTGFiZWwgOiB0ZXh0Lmhlcm9OZXh0TGVjdHVyZUxhYmVsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge25leHRMZWN0dXJlID8gKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIwLCBtYXJnaW5Cb3R0b206OCwgY29sb3I6J3ZhcigtLWluayknfX0+e25leHRMZWN0dXJlLnRvcGljIHx8IG5leHRMZWN0dXJlLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonYmFzZWxpbmUnLCBmbGV4V3JhcDond3JhcCcsIGdhcDoxMH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NjAwfX0+e2ZtdERhdGUobmV4dExlY3R1cmUuc3RhcnRzQXQpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEyfX0+e25leHRMZWN0dXJlLnZlbnVlIHx8IHRleHQudmVudWVGYWxsYmFja308L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgbWFyZ2luOjB9fT5cbiAgICAgICAgICAgIHt0ZXh0Lmhlcm9Ob0xlY3R1cmVUZXh0fSA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3QgZ29sZFwiIG9uQ2xpY2s9eyhlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IGdvKCdsZWN0dXJlcycpOyB9fT57dGV4dC5oZXJvTm9MZWN0dXJlQ3RhfTwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgKX1cbiAgICAgIDwvYXJ0aWNsZT5cblxuICAgICAgey8qIFx1QjJFNFx1Qzc0QyBcdUIyRjVcdUMwQUMgXHVDRTc0XHVCNERDICovfVxuICAgICAgPGFydGljbGVcbiAgICAgICAgb25DbGljaz17KCkgPT4geyBpZiAobmV4dFRvdXIpIGdvKCd0b3VyJyk7IH19XG4gICAgICAgIGNsYXNzTmFtZT1cImhvbWUtcHJvZ3JhbS1jYXJkXCJcbiAgICAgICAgc3R5bGU9e3tjdXJzb3I6IG5leHRUb3VyID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnfX1cbiAgICAgICAgcm9sZT17bmV4dFRvdXIgPyAnYnV0dG9uJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgdGFiSW5kZXg9e25leHRUb3VyID8gMCA6IHVuZGVmaW5lZH1cbiAgICAgICAgb25LZXlEb3duPXsoZSkgPT4geyBpZiAobmV4dFRvdXIgJiYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpKSB7IGUucHJldmVudERlZmF1bHQoKTsgZ28oJ3RvdXInKTsgfSB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLXByb2dyYW0tbGFiZWxcIj5cbiAgICAgICAgICB7dGV4dC5oZXJvTmV4dFRvdXJMYWJlbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtuZXh0VG91ciA/IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMCwgbWFyZ2luQm90dG9tOjgsIGNvbG9yOid2YXIoLS1pbmspJ319PntuZXh0VG91ci50aXRsZX08L2gzPlxuICAgICAgICAgICAge25leHRUb3VyLnN1YnRpdGxlICYmIChcbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBtYXJnaW5Cb3R0b206OCwgZm9udFN0eWxlOidpdGFsaWMnfX0+e25leHRUb3VyLnN1YnRpdGxlfTwvcD5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonYmFzZWxpbmUnLCBmbGV4V3JhcDond3JhcCcsIGdhcDoxMH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NjAwfX0+e2ZtdERhdGUobmV4dFRvdXIuc3RhcnRzQXQpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEyfX0+XG4gICAgICAgICAgICAgICAge25leHRUb3VyLmxldmVsICYmIDxzcGFuIHN0eWxlPXt7bWFyZ2luUmlnaHQ6OH19PntuZXh0VG91ci5sZXZlbH08L3NwYW4+fVxuICAgICAgICAgICAgICAgIHtuZXh0VG91ci5kdXJhdGlvbn1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIG1hcmdpbjowfX0+XG4gICAgICAgICAgICB7dGV4dC5oZXJvTm9Ub3VyVGV4dH0gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0IGdvbGRcIiBvbkNsaWNrPXsoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBnbygndG91cicpOyB9fT57dGV4dC5oZXJvTm9Ub3VyQ3RhfTwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgKX1cbiAgICAgIDwvYXJ0aWNsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIHYwMC4xNTIgXHUyMDE0IFx1RDY0OCBcdUNDNDUgQ1RBIFx1QjJFNFx1QUQ4QyBcdUNFNzRcdUI4RThcdUMxNDAuIHYwMC4xNTEgXHVCMkU4XHVDNzdDLVx1Q0M0NSBJSUZFIFx1Qjk3QyBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjhcdUQ2NTQgKyBcdUM4OENcdUM2QjAgXHVCQjM0XHVENTVDIHdyYXAgKyBhdXRvcGxheS5cbi8vIFx1QjM3MFx1Qzc3NFx1RDEzMCBcdUMxOENcdUMyQTQ6IEJHTkpfQk9PS1MubGlzdCh7c3RhdHVzOidwdWJsaXNoZWQnfSkuIFx1QzgxNVx1QjgyQzogcHJpbWFyeSBcdUM2QjBcdUMxMjAgXHUyMTkyIG9yZGVyLiAwXHVBRDhDXHVDNzc0XHVCQTc0IFx1QzEzOVx1QzE1OCBoaWRlLlxuY29uc3QgQm9va0Nhcm91c2VsU2VjdGlvbiA9ICh7IGdvLCBkYXRhVGljaywgdGV4dCB9KSA9PiB7XG4gIGNvbnN0IF9hcnIgPSAoZm4pID0+IHsgdHJ5IHsgY29uc3QgdiA9IGZuKCk7IHJldHVybiBBcnJheS5pc0FycmF5KHYpID8gdiA6IFtdOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH07XG4gIC8vIGFkbWluIFx1Qzc1OCBcdUNDNDUgXHVCQ0MwXHVBQ0JEXHVDNzQ0IFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2OCBcdUM1QzZcdUM3NzQgXHVDOTg5XHVDMkRDIFx1QkMxOFx1QzYwMS4gZGF0YVRpY2sgKyBiZ25qLWJvb2tzLXJlZnJlc2ggXHVCNDU4IFx1QjJFNCBcdUNDQURcdUNERTguXG4gIGNvbnN0IFtib29rVGljaywgc2V0Qm9va1RpY2tdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25SID0gKCkgPT4gc2V0Qm9va1RpY2soKHYpID0+IHYgKyAxKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1ib29rcy1yZWZyZXNoJywgb25SKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotYm9va3MtcmVmcmVzaCcsIG9uUik7XG4gIH0sIFtdKTtcbiAgY29uc3QgYm9va3MgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBhbGwgPSBfYXJyKCgpID0+IHdpbmRvdy5CR05KX0JPT0tTPy5saXN0Py4oeyBzdGF0dXM6ICdwdWJsaXNoZWQnIH0pKTtcbiAgICByZXR1cm4gYWxsLnNsaWNlKCkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEucHJpbWFyeSAmJiAhYi5wcmltYXJ5KSByZXR1cm4gLTE7XG4gICAgICBpZiAoIWEucHJpbWFyeSAmJiBiLnByaW1hcnkpIHJldHVybiAxO1xuICAgICAgcmV0dXJuIChhLm9yZGVyID8/IDApIC0gKGIub3JkZXIgPz8gMCk7XG4gICAgfSk7XG4gIH0sIFtkYXRhVGljaywgYm9va1RpY2tdKTtcblxuICBjb25zdCBbaWR4LCBzZXRJZHhdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtwYXVzZWQsIHNldFBhdXNlZF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIC8vIFx1Q0M0NSBcdUJBQTlcdUI4NUQgXHVBRTM4XHVDNzc0IFx1QkNDMFx1QjNEOSBcdUMyREMgaWR4IFx1QzdBQ1x1QzgxNVx1QjgyQy5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYm9va3MubGVuZ3RoID4gMCAmJiBpZHggPj0gYm9va3MubGVuZ3RoKSBzZXRJZHgoMCk7XG4gIH0sIFtib29rcy5sZW5ndGgsIGlkeF0pO1xuXG4gIGNvbnN0IHdyYXAgPSAobikgPT4gYm9va3MubGVuZ3RoID09PSAwID8gMCA6IChuICsgYm9va3MubGVuZ3RoKSAlIGJvb2tzLmxlbmd0aDtcbiAgY29uc3QgZ29QcmV2ID0gKCkgPT4gc2V0SWR4KChpKSA9PiB3cmFwKGkgLSAxKSk7XG4gIGNvbnN0IGdvTmV4dCA9ICgpID0+IHNldElkeCgoaSkgPT4gd3JhcChpICsgMSkpO1xuXG4gIC8vIGF1dG9wbGF5IDdzIFx1MjAxNCAyXHVBRDhDIFx1Qzc3NFx1QzBDMSArIGhvdmVyIFx1QzgxNVx1QzlDMCBcdUM1NDRcdUIyRDAgXHVCNTRDXHVCOUNDLlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChib29rcy5sZW5ndGggPCAyIHx8IHBhdXNlZCkgcmV0dXJuO1xuICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHNldElkeCgoaSkgPT4gd3JhcChpICsgMSkpLCA3MDAwKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHQpO1xuICB9LCBbaWR4LCBib29rcy5sZW5ndGgsIHBhdXNlZF0pO1xuXG4gIGlmIChib29rcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICBjb25zdCBzaG93Q2hyb21lID0gYm9va3MubGVuZ3RoID4gMTtcblxuICAvLyB2MDAuMTYyIFx1MjAxNCBcdUIyRThcdUM3N0MgXHVDQzQ1IFx1Q0U3NFx1QjREQyBcdUI4MENcdUIzNTQgKHNsaWRlIGxheWVyIFx1QzU0OFx1QzVEMFx1QzExQyBcdUQ2MzhcdUNEOUMpLlxuICBjb25zdCByZW5kZXJCb29rQ2FyZCA9IChiKSA9PiB7XG4gICAgY29uc3QgaGFzUHJpY2VLUiA9IE51bWJlcihiLnByaWNlS1IpID4gMDtcbiAgICBjb25zdCBoYXNQcmljZUVOID0gTnVtYmVyKGIucHJpY2VFTikgPiAwO1xuICAgIGNvbnN0IHlyID0gYi5wdWJsaXNoZWRBdCA/IG5ldyBEYXRlKGIucHVibGlzaGVkQXQpLmdldEZ1bGxZZWFyKCkgOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBjdGEtZ3JpZFwiIHN0eWxlPXt7XG4gICAgICAgIHBhZGRpbmc6JzcycHggNjBweCcsXG4gICAgICAgIGRpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxZnIgMWZyJywgZ2FwOjYwLCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCI+e3RleHQuYm9va0V5ZWJyb3dQcmVmaXh9IFx1MDBCNyB7eXJ9PC9kaXY+XG4gICAgICAgICAgPGgyIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LXNlcmlmKScsIGZvbnRTaXplOidjbGFtcCgzNnB4LCA0dncsIDUycHgpJyxcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6NjAwLCBsaW5lSGVpZ2h0OjEuMSwgbWFyZ2luQm90dG9tOiBiLnN1YnRpdGxlID8gOCA6IDE2LFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgXHUzMDBFe2IudGl0bGV9XHUzMDBGXG4gICAgICAgICAgPC9oMj5cbiAgICAgICAgICB7LyogdjAwLjE2MiBcdTIwMTQgXHVENTVDIFx1QzkwNCBcdUMxOENcdUFDMUMgKHN1YnRpdGxlKS4gXHVDMEFDXHVDNkE5XHVDNzkwIFx1QzY5NFx1Q0NBRCAnXHVENTVDXHVDOTA0XHVDMThDXHVBQzFDXHVBQzAwIFx1QkNGNFx1Qzc3NFx1QUM4QycuICovfVxuICAgICAgICAgIHtiLnN1YnRpdGxlICYmIChcbiAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MTgsIGZvbnRTdHlsZTonaXRhbGljJyxcbiAgICAgICAgICAgICAgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyMCwgbGluZUhlaWdodDoxLjUsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2Iuc3VidGl0bGV9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7Yi5kZXNjICYmIChcbiAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6MTUsIGxpbmVIZWlnaHQ6MS44NSwgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyOCwgd2hpdGVTcGFjZToncHJlLXdyYXAnfX0+XG4gICAgICAgICAgICAgIHtiLmRlc2N9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7KGhhc1ByaWNlS1IgfHwgaGFzUHJpY2VFTikgJiYgKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MjAsIG1hcmdpbkJvdHRvbTozMiwgYWxpZ25JdGVtczonZmxleC1lbmQnfX0+XG4gICAgICAgICAgICAgIHtoYXNQcmljZUtSICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgZm9udFdlaWdodDo2MDAsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIGNvbG9yOid2YXIoLS1pbmstMyknfX0+e3RleHQuYm9va0tyTGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMiwgbWFyZ2luVG9wOjQsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo3MDB9fT57TnVtYmVyKGIucHJpY2VLUikudG9Mb2NhbGVTdHJpbmcoKX1cdUM2RDA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAge2hhc1ByaWNlS1IgJiYgaGFzUHJpY2VFTiAmJiA8ZGl2IHN0eWxlPXt7d2lkdGg6MSwgYmFja2dyb3VuZDondmFyKC0tbGluZS0yKScsIGFsaWduU2VsZjonc3RyZXRjaCd9fS8+fVxuICAgICAgICAgICAgICB7aGFzUHJpY2VFTiAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBjb2xvcjondmFyKC0taW5rLTMpJ319Pnt0ZXh0LmJvb2tFbkxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjIsIG1hcmdpblRvcDo0LCBjb2xvcjondmFyKC0taW5rKScsIGZvbnRXZWlnaHQ6NzAwfX0+e051bWJlcihiLnByaWNlRU4pLnRvTG9jYWxlU3RyaW5nKCl9XHVDNkQwPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkXCIgb25DbGljaz17KCkgPT4gZ28oJ2Jvb2snKX0+e3RleHQuYm9va0J1eUN0YX08L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBhc3BlY3RSYXRpbzonMy80JywgbWF4V2lkdGg6MjgwLCBtYXJnaW46JzAgYXV0bycsXG4gICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsXG4gICAgICAgICAgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIG92ZXJmbG93OidoaWRkZW4nLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7Yi5jb3ZlckRhdGFVcmkgPyAoXG4gICAgICAgICAgICA8aW1nIHNyYz17Yi5jb3ZlckRhdGFVcml9IGFsdD17YCR7Yi50aXRsZX0gXHVENDVDXHVDOUMwYH1cbiAgICAgICAgICAgICAgc3R5bGU9e3t3aWR0aDonMTAwJScsIGhlaWdodDonMTAwJScsIG9iamVjdEZpdDonY292ZXInLCBkaXNwbGF5OidibG9jayd9fS8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3t0ZXh0QWxpZ246J2NlbnRlcicsIHBhZGRpbmc6JzAgMjRweCd9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MjgsIGNvbG9yOid2YXIoLS1pbmspJywgbWFyZ2luQm90dG9tOjEwLCBmb250V2VpZ2h0OjYwMH19PntiLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjksIGZvbnRXZWlnaHQ6NjAwLCBjb2xvcjondmFyKC0taW5rLTMpJywgbGV0dGVyU3BhY2luZzonMC4yZW0nfX0+e2IuYXV0aG9yIHx8ICdcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAnfSB7dGV4dC5ib29rQXV0aG9yU3VmZml4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUNDNDUgQ1RBXCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwic2VjdGlvblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0UGF1c2VkKHRydWUpfVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0UGF1c2VkKGZhbHNlKX1cbiAgICAgICAgICBzdHlsZT17e3Bvc2l0aW9uOidyZWxhdGl2ZSd9fT5cbiAgICAgICAgICB7LyogdjAwLjE2MiBcdTIwMTQgXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDIFx1QjgwOFx1Qzc3NFx1QzVCNC4gXHVCQUE4XHVCNEUwIGJvb2tzIFx1Qjk3QyBsYXllcmVkIFx1Qjg1QyBcdUI4MENcdUIzNTQsIGFjdGl2ZSBcdUI5Q0Mgb3BhY2l0eSAxICsgdHJhbnNsYXRlWCAwLlxuICAgICAgICAgICAgICBqdW1wIFx1QzVDNlx1QjI5NCBcdUJEODBcdUI0RENcdUI3RUNcdUM2QjQgY3Jvc3NmYWRlLXNsaWRlLiBcdUNDQUIgXHVDQzQ1XHVCOUNDIHJlbGF0aXZlIFx1Qjg1QyB3cmFwcGVyIFx1QjE5Mlx1Qzc3NCBcdUJDRjRcdUM4NzQuICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICAgICAgICB7Ym9va3MubWFwKChiLCBpKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IGkgPT09IGlkeDtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGtleT17Yi5pZCB8fCBpfVxuICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49e2FjdGl2ZSA/IHVuZGVmaW5lZCA6ICd0cnVlJ31cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBpID09PSAwID8gJ3JlbGF0aXZlJyA6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCwgbGVmdDogMCwgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IGFjdGl2ZSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGFjdGl2ZVxuICAgICAgICAgICAgICAgICAgICAgID8gJ3RyYW5zbGF0ZVgoMCknXG4gICAgICAgICAgICAgICAgICAgICAgOiAoaSA8IGlkeCA/ICd0cmFuc2xhdGVYKC0yNHB4KScgOiAndHJhbnNsYXRlWCgyNHB4KScpLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAuNTVzIGVhc2UsIHRyYW5zZm9ybSAuNTVzIGVhc2UnLFxuICAgICAgICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiBhY3RpdmUgPyAnYXV0bycgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIHtyZW5kZXJCb29rQ2FyZChiKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAge3Nob3dDaHJvbWUgJiYgKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1sYWJlbD1cIlx1Qzc3NFx1QzgwNCBcdUNDNDVcIiBvbkNsaWNrPXtnb1ByZXZ9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIGxlZnQ6LTgsIHRvcDonNTAlJywgdHJhbnNmb3JtOid0cmFuc2xhdGUoLTEwMCUsIC01MCUpJyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOjQ0LCBoZWlnaHQ6NDQsIGJvcmRlclJhZGl1czonNTAlJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgY29sb3I6J3ZhcigtLWluayknLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIGZvbnRTaXplOjIyLCBmb250V2VpZ2h0OjYwMCwgbGluZUhlaWdodDoxLFxuICAgICAgICAgICAgICAgIH19Plx1MjAzOTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWxhYmVsPVwiXHVCMkU0XHVDNzRDIFx1Q0M0NVwiIG9uQ2xpY2s9e2dvTmV4dH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgcmlnaHQ6LTgsIHRvcDonNTAlJywgdHJhbnNmb3JtOid0cmFuc2xhdGUoMTAwJSwgLTUwJSknLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6NDQsIGhlaWdodDo0NCwgYm9yZGVyUmFkaXVzOic1MCUnLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBjb2xvcjondmFyKC0taW5rKScsIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgZm9udFNpemU6MjIsIGZvbnRXZWlnaHQ6NjAwLCBsaW5lSGVpZ2h0OjEsXG4gICAgICAgICAgICAgICAgfX0+XHUyMDNBPC9idXR0b24+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7c2hvd0Nocm9tZSAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonY2VudGVyJywgZ2FwOjgsIG1hcmdpblRvcDoxOH19PlxuICAgICAgICAgICAge2Jvb2tzLm1hcCgoYiwgaSkgPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT17Yi5pZCB8fCBpfSB0eXBlPVwiYnV0dG9uXCIgYXJpYS1sYWJlbD17YCR7aSsxfVx1QkM4OFx1QzlGOCBcdUNDNDVcdUM3M0NcdUI4NUMgXHVDNzc0XHVCM0Q5YH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJZHgoaSl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiBpID09PSBpZHggPyAyNCA6IDgsIGhlaWdodDogOCwgcGFkZGluZzogMCxcbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNCwgYm9yZGVyOiAnbm9uZScsIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogaSA9PT0gaWR4ID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lLTIpJyxcbiAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4ycycsXG4gICAgICAgICAgICAgICAgfX0vPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+PC9Ib21lU2VjdGlvbkJvdW5kYXJ5PlxuICApO1xufTtcblxuY29uc3QgSG9tZVBhZ2UgPSAoeyBnbyB9KSA9PiB7XG4gIGNvbnN0IFttYXBPcGVuLCBzZXRNYXBPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3NjVGljaywgc2V0U2NUaWNrXSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCBbZGF0YVRpY2ssIHNldERhdGFUaWNrXSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuXG4gIC8vIFNFTy9IZXJvL0JyYW5kIHJlZnJlc2ggXHUyMDE0IFx1Qzk4OVx1QzJEQyBcdUM3QUNcdUI4MENcdUIzNTRcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblIgPSAoKSA9PiBzZXRTY1RpY2soKHYpID0+IHYgKyAxKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1zaXRlLWNvbnRlbnQtcmVmcmVzaCcsIG9uUik7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZ25qLXNpdGUtY29udGVudC1yZWZyZXNoJywgb25SKTtcbiAgfSwgW10pO1xuXG4gIC8vIFx1QzExQ1x1QkM4NCBcdUIzNzBcdUM3NzRcdUQxMzAgcmVmcmVzaCBcdUM3NzRcdUJDQTRcdUQyQjggXHUyMDE0IFx1QzJFNFx1QzgxQyBcdUJDMUNcdUQ2NTQgXHVDNzc0XHVCOTg0XHVBQ0ZDIFx1Qzc3Q1x1Q0U1OCAoZGF0YS5qcyBcdUNDMzhcdUFDRTApLlxuICAvLyBiZ25qLXBvc3RzLXJlZnJlc2g6IFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdUFDOENcdUMyRENcdUFFMDAgLyBiZ25qLWNvbHVtbnMtcmVmcmVzaDogXHVDRTdDXHVCN0ZDIC8gYmduai10b3Vycy1yZWZyZXNoOiBcdUIyRjVcdUMwQUMgLyBiZ25qLWxlY3R1cmVzLXJlZnJlc2g6IFx1QUMxNVx1QzVGMCAvIGJnbmotc2l0ZS1jb250ZW50LXJlZnJlc2g6IFx1Q0Q5NFx1Q0M5QyhcdUM3NzRcdUJCRjggXHVDNzA0XHVDNUQwXHVDMTFDIGxpc3RlbilcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCB0aWNrID0gKCkgPT4gc2V0RGF0YVRpY2soKHYpID0+IHYgKyAxKTtcbiAgICBjb25zdCBldnRzID0gWydiZ25qLWNvbHVtbnMtcmVmcmVzaCcsICdiZ25qLXRvdXJzLXJlZnJlc2gnLCAnYmduai1sZWN0dXJlcy1yZWZyZXNoJywgJ2JnbmotcG9zdHMtcmVmcmVzaCddO1xuICAgIGV2dHMuZm9yRWFjaCgoZSkgPT4gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGljaykpO1xuICAgIHJldHVybiAoKSA9PiBldnRzLmZvckVhY2goKGUpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGUsIHRpY2spKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IHNjID0gUmVhY3QudXNlTWVtbygoKSA9PiAod2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9KSwgW3NjVGlja10pO1xuICBjb25zdCBoZXJvID0gc2MuaGVybyB8fCB7fTtcbiAgY29uc3QgaG9tZVRleHQgPSBSZWFjdC51c2VNZW1vKCgpID0+IGdldEhvbWVUZXh0KHNjKSwgW3NjXSk7XG4gIC8vIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUJEODRcdUFFMzAgXHUyMDE0IG1hdGNoTWVkaWEgXHVCQ0MwXHVBQ0JEIFx1QzJEQyBcdUM3OTBcdUIzRDkgXHVDN0FDXHVCODBDXHVCMzU0IChoZXJvU3R5bGUgXHVCM0M0IFx1QUMzMVx1QzJFMCkuXG4gIGNvbnN0IFtpc01vYmlsZSwgc2V0SXNNb2JpbGVdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgIHRyeSB7IHJldHVybiAhISh3aW5kb3cubWF0Y2hNZWRpYSAmJiB3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogNjAwcHgpJykubWF0Y2hlcyk7IH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbiAgfSk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1xID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtYXgtd2lkdGg6IDYwMHB4KScpO1xuICAgICAgY29uc3QgaGFuZGxlciA9IChlKSA9PiBzZXRJc01vYmlsZShlLm1hdGNoZXMpO1xuICAgICAgaWYgKG1xLmFkZEV2ZW50TGlzdGVuZXIpIG1xLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgZWxzZSBpZiAobXEuYWRkTGlzdGVuZXIpIG1xLmFkZExpc3RlbmVyKGhhbmRsZXIpO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKG1xLnJlbW92ZUV2ZW50TGlzdGVuZXIpIG1xLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgICBlbHNlIGlmIChtcS5yZW1vdmVMaXN0ZW5lcikgbXEucmVtb3ZlTGlzdGVuZXIoaGFuZGxlcik7XG4gICAgICB9O1xuICAgIH0gY2F0Y2gge31cbiAgfSwgW10pO1xuICBjb25zdCBoZXJvU3R5bGUgPSBSZWFjdC51c2VNZW1vKFxuICAgICgpID0+ICh3aW5kb3cuQkdOSl9IRVJPX1NUWUxFPy4oaXNNb2JpbGUgPyAnbW9iaWxlJyA6ICdkZXNrdG9wJykgfHwgd2luZG93LkJHTkpfSEVST19TVFlMRV9ERUZBVUxUKSxcbiAgICBbc2NUaWNrLCBpc01vYmlsZV1cbiAgKTtcbiAgY29uc3QgcmVjb21tZW5kYXRpb25zID0gQXJyYXkuaXNBcnJheShzYy5yZWNvbW1lbmRhdGlvbnMpID8gc2MucmVjb21tZW5kYXRpb25zLmZpbHRlcihCb29sZWFuKSA6IFtdO1xuICBjb25zdCBbcmVjRGV0YWlsLCBzZXRSZWNEZXRhaWxdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG5cbiAgLy8gXHVDMkU0XHVCMzcwXHVDNzc0XHVEMTMwXHVCOUNDIFx1MjAxNCBcdUMyRENcdUI0REMgXHVEM0Y0XHVCQzMxIFx1QzgxQ1x1QUM3MC4gXHVCQUE4XHVCNEUwIFx1RDVFQ1x1RDM3QyBcdUQ2MzhcdUNEOUNcdUM3NDAgQkdOSl9HVUFSRC5hcnIgXHVCODVDIHRyeS9jYXRjaCArIEFycmF5IFx1QUMwMFx1QjREQy5cbiAgLy8gdjAwLjExNSBcdTIwMTQgQkdOSl9HVUFSRCBcdUJCRjhcdUI4NUNcdUI0REMgKHNjcmlwdCBcdUI4NUNcdUI0REMgcmFjZSkgXHVDMkRDIFx1Qzc3OFx1Qjc3Q1x1Qzc3OCBmYWxsYmFjayBcdUM3M0NcdUI4NUMgXHVEMzk4XHVDNzc0XHVDOUMwIFx1QUU2OFx1QzlEMCBcdUJDMjlcdUM5QzAuXG4gIGNvbnN0IEcgPSB3aW5kb3cuQkdOSl9HVUFSRCB8fCB7XG4gICAgYXJyOiAoZm4pID0+IHsgdHJ5IHsgY29uc3QgdiA9IGZuKCk7IHJldHVybiBBcnJheS5pc0FycmF5KHYpID8gdiA6IFtdOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH0sXG4gICAgY2FsbDogKGZuLCBmYikgPT4geyB0cnkgeyBjb25zdCB2ID0gZm4oKTsgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/IGZiIDogdjsgfSBjYXRjaCB7IHJldHVybiBmYjsgfSB9LFxuICB9O1xuICAvLyBcdUM3MjBcdUQ2QThcdUQ1NUMgc3RhcnRzQXQoXHVEMzBDXHVDMkYxIFx1QUMwMFx1QjJBNVx1RDU1QyBcdUIwQTBcdUM5REMpIFx1QjlDQyBcdUQxQjVcdUFDRkMgXHUyMDE0IE5hTiBnZXRUaW1lIFx1QzczQ1x1Qjg1QyBzb3J0IFx1QUNCMFx1QUNGQ1x1QUMwMCBcdUFFNjhcdUM5QzBcdUIyOTQgXHVBQzgzIFx1QkMyOVx1QzlDMC5cbiAgY29uc3QgX2hhc1ZhbGlkRGF0ZSA9IChpc28pID0+IHtcbiAgICBpZiAoIWlzbykgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHQgPSBEYXRlLnBhcnNlKGlzbyk7XG4gICAgcmV0dXJuICFpc05hTih0KTtcbiAgfTtcbiAgY29uc3QgcHVibGljQ29sdW1ucyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfQ09MVU1OUz8ubGlzdFB1YmxpYz8uKCkpLCBbZGF0YVRpY2tdKTtcbiAgY29uc3QgZmVhdHVyZWRDb2x1bW4gPSBwdWJsaWNDb2x1bW5zWzBdO1xuICBjb25zdCBzZWNvbmRhcnlDb2x1bW5zID0gcHVibGljQ29sdW1ucy5zbGljZSgxLCA1KTtcbiAgY29uc3QgcmVjZW50UG9zdHMgPSBSZWFjdC51c2VNZW1vKCgpID0+IEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8ubGlzdFBvc3RzPy4oKSkuc2xpY2UoMCwgNCksIFtkYXRhVGlja10pO1xuICBjb25zdCB0b3VycyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfVE9VUlM/Lmxpc3RBbGw/LigpKS5maWx0ZXIoKHQpID0+IHQgJiYgIXQuaGlkZGVuKS5zbGljZSgwLCA0KSwgW2RhdGFUaWNrXSk7XG4gIGNvbnN0IGxlY3R1cmVzID0gUmVhY3QudXNlTWVtbygoKSA9PiBHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9MRUNUVVJFUz8ubGlzdEFsbD8uKCkpLmZpbHRlcigobCkgPT4gbCAmJiAhbC5oaWRkZW4pLnNsaWNlKDAsIDMpLCBbZGF0YVRpY2tdKTtcblxuICAvLyBoZXJvLnN0YXRzIFx1QUMwMCBcdUM3ODhcdUM3M0NcdUJBNzQgXHVDRjU4XHVEMTUwXHVDRTIwKGxhYmVsL3N1Yi92YWx1ZUZhbGxiYWNrKSBcdUI5N0MgXHVBQzcwXHVBRTMwXHVDMTFDLiBcdUIzRDlcdUM4MDEgdmFsdWUoXHVEMjJDXHVDNUI0L1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdUFDMkZcdUMyMTgpIFx1QjI5NCBcdUNGNTRcdUI0REMgXHVDRTIxIFx1QzZCMFx1QzEyMC5cbiAgY29uc3QgaGVyb1N0YXRzID0gQXJyYXkuaXNBcnJheShoZXJvLnN0YXRzKSAmJiBoZXJvLnN0YXRzLmxlbmd0aCA9PT0gMyA/IGhlcm8uc3RhdHMgOiBbXG4gICAgeyBsYWJlbDogJ1x1QzVFQ1x1RDU4OVx1QzlDMCcsICAgc3ViOiAnXHVDOEZDXHVDNjk0IFx1QjJGNVx1QzBBQ1x1QzlDMCBcdUM2QjRcdUM2MDEnLCAgIHZhbHVlRmFsbGJhY2s6ICdcdUM4MDRcdUFENkQnICAgIH0sXG4gICAgeyBsYWJlbDogJ1x1RDIyQ1x1QzVCNCcsICAgICBzdWI6ICdcdUM5QzFcdUM4MTEgXHVBRTMwXHVENjhEIFx1RDUwNFx1Qjg1Q1x1QURGOFx1QjdBOCcsIHZhbHVlRmFsbGJhY2s6ICdcdUM5MDBcdUJFNDQgXHVDOTExJyB9LFxuICAgIHsgbGFiZWw6ICdcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAnLCBzdWI6ICdcdUQ1NjhcdUFFRDggXHVCOUNDXHVCNERDXHVCMjk0IFx1QzVFQ1x1RDU4OScsICAgdmFsdWVGYWxsYmFjazogJ1x1QzZCNFx1QzYwMSBcdUM5MTEnIH0sXG4gIF07XG4gIGNvbnN0IHN0YXRzID0gW1xuICAgIHsgbDogaGVyb1N0YXRzWzBdLmxhYmVsLCB2OiBoZXJvU3RhdHNbMF0udmFsdWVGYWxsYmFjayB8fCAnXHVDODA0XHVBRDZEJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHM6IGhlcm9TdGF0c1swXS5zdWIgfSxcbiAgICB7IGw6IGhlcm9TdGF0c1sxXS5sYWJlbCwgdjogdG91cnMubGVuZ3RoID4gMCA/IGAke3RvdXJzLmxlbmd0aH1cdUFDMUNgIDogKGhlcm9TdGF0c1sxXS52YWx1ZUZhbGxiYWNrIHx8ICdcdUM5MDBcdUJFNDQgXHVDOTExJyksICAgICBzOiBoZXJvU3RhdHNbMV0uc3ViIH0sXG4gICAgeyBsOiBoZXJvU3RhdHNbMl0ubGFiZWwsIHY6IHJlY2VudFBvc3RzLmxlbmd0aCA+IDAgPyBgJHtyZWNlbnRQb3N0cy5sZW5ndGh9K2AgOiAoaGVyb1N0YXRzWzJdLnZhbHVlRmFsbGJhY2sgfHwgJ1x1QzZCNFx1QzYwMSBcdUM5MTEnKSwgczogaGVyb1N0YXRzWzJdLnN1YiB9LFxuICBdO1xuXG4gIGNvbnN0IGNsaWNrYWJsZSA9IChvbkNsaWNrLCBsYWJlbCkgPT4gKHtcbiAgICByb2xlOididXR0b24nLCB0YWJJbmRleDowLCAnYXJpYS1sYWJlbCc6bGFiZWwsIG9uQ2xpY2ssXG4gICAgb25LZXlEb3duOihlKSA9PiB7IGlmIChlLmtleT09PSdFbnRlcid8fGUua2V5PT09JyAnKSB7IGUucHJldmVudERlZmF1bHQoKTsgb25DbGljaygpOyB9IH0sXG4gICAgc3R5bGU6e2N1cnNvcjoncG9pbnRlcid9LFxuICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1wYWdlXCI+XG4gICAgICB7bWFwT3BlbiAmJiA8RGVzdGluYXRpb25NYXBNb2RhbCBvbkNsb3NlPXsoKSA9PiBzZXRNYXBPcGVuKGZhbHNlKX0gZ289e2dvfS8+fVxuICAgICAge3JlY0RldGFpbCAmJiA8UmVjb21tZW5kYXRpb25EZXRhaWxNb2RhbCByZWM9e3JlY0RldGFpbH0gb25DbG9zZT17KCkgPT4gc2V0UmVjRGV0YWlsKG51bGwpfSBnbz17Z299Lz59XG5cbiAgICAgIHsvKiB2MDAuMTQzIFx1MjAxNCBcdUM2MjRcdUQ1MDggXHVDNTQ4XHVCMEI0IFx1QkMzMFx1QjEwOFx1QjI5NCBib290LmpzeCBcdUI4NUMgXHVDNzc0XHVCM0Q5IChzaXRld2lkZSwgXHVCQTU0XHVCMjc0IFx1QzcwNFx1Q0FCRCkuICovfVxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIEhFUk8gKFx1RDE0RFx1QzJBNFx1RDJCOCArIFx1QzZCMFx1Q0UyMSBcdUM5QzBcdUIzQzQgXHVCQkY4XHVCOUFDXHVCQ0Y0XHVBRTMwLCBcdUJBQThcdUJDMTRcdUM3N0MgMVx1QjJFOCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUQ3ODhcdUM1QjRcdUI4NUNcIj48c2VjdGlvbiBjbGFzc05hbWU9XCJob21lLWhlcm9cIiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjoncmVsYXRpdmUnLCBvdmVyZmxvdzonaGlkZGVuJyxcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICBwYWRkaW5nOic3MnB4IDAgODhweCcsXG4gICAgICB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8tZ3JpZCBob21lLWhlcm8tZ3JpZFwiIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OidncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczonMS4yZnIgMWZyJywgZ2FwOjU2LCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgey8qIFx1Qzg4Q1x1Q0UyMTogXHVEMTREXHVDMkE0XHVEMkI4IFx1MjAxNCBoZXJvU3R5bGUgXHVEMkI4XHVDNzE3KFx1QUQwMFx1QjlBQ1x1Qzc5MCAnXHVENzg4XHVDNUI0XHVCODVDJyBcdUQwRUQpIFx1Qzc3OFx1Qjc3Q1x1Qzc3OCBcdUM4MDFcdUM2QTkgKi99XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7dGV4dEFsaWduOiBoZXJvU3R5bGUudGl0bGUudGV4dEFsaWduIHx8ICdsZWZ0J319PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tZXllYnJvd1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udFNpemU6IGhlcm9TdHlsZS5leWVicm93LmZvbnRTaXplLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5leWVicm93LmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogYCR7aGVyb1N0eWxlLmV5ZWJyb3cubGV0dGVyU3BhY2luZ31lbWAsXG4gICAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtoZXJvU3R5bGUuZXllYnJvdy5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBoZXJvU3R5bGUuZXllYnJvdy50ZXh0VHJhbnNmb3JtIHx8ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8c3Bhbj57aGVyby5leWVicm93IHx8IFwiXHVCQTM5XHVBQ0UwIFx1Qzc5MFx1QUNFMCBcdUFDNzdcdUFDRTAgXHVDNzdEXHVCMjk0IFx1RDU1Q1x1QUQ2RFwifTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxoMSBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtZGlzcGxheSknLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiBgY2xhbXAoMzZweCwgNXZ3LCAke2hlcm9TdHlsZS50aXRsZS5mb250U2l6ZX1weClgLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGhlcm9TdHlsZS50aXRsZS5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IGhlcm9TdHlsZS50aXRsZS5saW5lSGVpZ2h0LFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IGAke2hlcm9TdHlsZS50aXRsZS5sZXR0ZXJTcGFjaW5nfWVtYCxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206MjIsXG4gICAgICAgICAgICAgICAgY29sb3I6YHZhcigke2hlcm9TdHlsZS50aXRsZS5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAge2hlcm8udGl0bGUxIHx8IFwiXHVENTVDXHVBRDZEXHVDNzQ0XCJ9PGJyLz5cbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2NvbG9yOmB2YXIoJHtoZXJvU3R5bGUudGl0bGUuYWNjZW50Q29sb3J9KWB9fT57aGVyby50aXRsZTIgfHwgXCJcdUM5QzFcdUM4MTEgXHVBQzc3XHVBQ0UwXCJ9PC9zcGFuPjxici8+XG4gICAgICAgICAgICAgICAge2hlcm8udGl0bGUzIHx8IFwiXHVDQzlDXHVDQzlDXHVENzg4IFx1Qzc3RFx1QjJFNFwifVxuICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJiZ25qLW11bHRpbGluZVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udFNpemU6IGhlcm9TdHlsZS5zdWJ0aXRsZS5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiBoZXJvU3R5bGUuc3VidGl0bGUubGluZUhlaWdodCxcbiAgICAgICAgICAgICAgICBjb2xvcjogYHZhcigke2hlcm9TdHlsZS5zdWJ0aXRsZS5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogaGVyb1N0eWxlLnN1YnRpdGxlLm1heFdpZHRoLFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTozMixcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBoZXJvU3R5bGUuc3VidGl0bGUuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiBoZXJvU3R5bGUudGl0bGUudGV4dEFsaWduID09PSAnY2VudGVyJyA/ICdhdXRvJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXJnaW5SaWdodDogaGVyb1N0eWxlLnRpdGxlLnRleHRBbGlnbiA9PT0gJ2NlbnRlcicgPyAnYXV0bycgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHtoZXJvLnN1YnRpdGxlIHx8IFwiXHVBRDgxXHVBRDkwXHVBQ0ZDIFx1QUNFOFx1QkFBOSwgXHVDMkRDXHVDN0E1XHVBQ0ZDIFx1QzIxOVx1QzE4QywgXHVDQzQ1XHVBQ0ZDIFx1QUMxNVx1QzVGMFx1Qzc0NCBcdUM2MjRcdUFDMDBcdUJBNzAgXHVENTVDXHVBRDZEXHVDNzQ0IFx1Qzg3MFx1QUUwOCBcdUIzNTQgXHVBQzAwXHVBRTRDXHVDNzc0IFx1QkQwNVx1QjJDOFx1QjJFNC4gXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXHVCMjk0IFx1QzVFQ1x1RDU4OVx1Qzc0NCBcdUFFMzBcdUI4NURcdUQ1NThcdUFDRTAgXHVENTY4XHVBRUQ4IFx1QjVBMFx1QjA5OFx1QjI5NCBcdUMwQUNcdUI3OENcdUI0RTRcdUM3NTggXHVDNzkxXHVDNzQwIFx1QkFBOFx1Qzc4NFx1Qzc4NVx1QjJDOFx1QjJFNC5cIn1cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGdhcDoxMiwgZmxleFdyYXA6J3dyYXAnLCBtYXJnaW5Cb3R0b206NDAsXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IGhlcm9TdHlsZS50aXRsZS50ZXh0QWxpZ24gPT09ICdjZW50ZXInID8gJ2NlbnRlcicgOiAoaGVyb1N0eWxlLnRpdGxlLnRleHRBbGlnbiA9PT0gJ3JpZ2h0JyA/ICdmbGV4LWVuZCcgOiAnZmxleC1zdGFydCcpLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5jdGEuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgey8qIHYwMC4xNTIgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM2OTRcdUNDQUQgJ1x1QzlDMFx1QjNDNFx1QzVEMFx1QzExQyBcdUM1RUNcdUQ1ODlcdUM5QzAgXHVDQzNFXHVBRTMwIFx1QkM4NFx1RDJCQyBcdUMwQURcdUM4MUMnLiAqL31cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZFwiIG9uQ2xpY2s9eygpID0+IGdvKCdjb21tdW5pdHknKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFdlaWdodDogaGVyb1N0eWxlLmN0YS5mb250V2VpZ2h0fX0+XG4gICAgICAgICAgICAgICAgICB7aGVyby5jdGFQcmltYXJ5IHx8IFwiXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwIFx1QkNGNFx1QUUzMFwifVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17KCkgPT4gZ28oJ3RvdXInKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFdlaWdodDogaGVyb1N0eWxlLmN0YS5mb250V2VpZ2h0fX0+XG4gICAgICAgICAgICAgICAgICB7aGVyby5jdGFTZWNvbmRhcnkgfHwgXCJcdUIyRjVcdUMwQUMgXHVDNzdDXHVDODE1IFx1QkNGNFx1QUUzMFwifVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZXJvLXN0YXRzXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OidncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczoncmVwZWF0KDMsMWZyKScsIGdhcDoyMCxcbiAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOjI0LCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHtzdGF0cy5tYXAoKHN0YXQpID0+IChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtzdGF0Lmx9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBoZXJvU3R5bGUuc3RhdHMudmFsdWUuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLnN0YXRzLnZhbHVlLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtoZXJvU3R5bGUuc3RhdHMudmFsdWUuY29sb3J9KWAsXG4gICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOjQsXG4gICAgICAgICAgICAgICAgICAgIH19PntzdGF0LnZ9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogaGVyb1N0eWxlLnN0YXRzLmxhYmVsLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5zdGF0cy5sYWJlbC5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IGAke2hlcm9TdHlsZS5zdGF0cy5sYWJlbC5sZXR0ZXJTcGFjaW5nfWVtYCxcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYHZhcigke2hlcm9TdHlsZS5zdGF0cy5sYWJlbC5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBoZXJvU3R5bGUuc3RhdHMubGFiZWwudGV4dFRyYW5zZm9ybSB8fCAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206MyxcbiAgICAgICAgICAgICAgICAgICAgfX0+e3N0YXQubH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBoZXJvU3R5bGUuc3RhdHMuc3ViLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBgdmFyKCR7aGVyb1N0eWxlLnN0YXRzLnN1Yi5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgICAgICAgfX0+e3N0YXQuc308L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogXHVDNkIwXHVDRTIxOiBcdUM5QzBcdUIzQzQgXHVCQkY4XHVCOUFDXHVCQ0Y0XHVBRTMwIFx1MjAxNCBcdUMyRENcdUIzQzQgXHVEMDc0XHVCOUFEIFx1MjE5MiBcdUM4MDRcdUNDQjQgXHVCQUE4XHVCMkVDIChhMTF5OiBcdUM2NzhcdUFDRkQgZGl2IFx1QjI5NCBcdUIyRThcdUMyMUMgXHVDRUU4XHVEMTRDXHVDNzc0XHVCMTA4LCBcdUMyRTRcdUM4MUMgXHVCQzg0XHVEMkJDXHVDNzQwIHJlZ2lvbiBwYXRoIFx1QzY0MCBcdUM2QjBcdUMwQzFcdUIyRTggXHVEMTREXHVDMkE0XHVEMkI4IFx1QkM4NFx1RDJCQykuIFx1RDNGMChcdTIyNjQ2MDBweCkgXHVDNUQwXHVDMTFDXHVCMjk0IGhlcm8tbWFwLXByZXZpZXcgQ1NTIFx1Qjg1QyBcdUMyMjhcdUFFNDAgKyBDVEEgXHVCQzg0XHVEMkJDXHVCOUNDIFx1QjE3OFx1Q0Q5Qy4gKi99XG4gICAgICAgICAgICB7LyogdjAwLjEwNiBcdTIwMTQgXHVDOUMwXHVCM0M0IFx1MjE5MiBcdUIyRTRcdUM3NEMgXHVBQzE1XHVDNUYwIC8gXHVCMkU0XHVDNzRDIFx1QjJGNVx1QzBBQyBcdUJCRjhcdUIyQzggXHVDRTc0XHVCNERDIChBXHVDNTQ4KSAqL31cbiAgICAgICAgICAgIDxIZXJvUHJvZ3JhbUNhcmRzIGdvPXtnb30gZGF0YVRpY2s9e2RhdGFUaWNrfSB0ZXh0PXtob21lVGV4dH0vPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPC9Ib21lU2VjdGlvbkJvdW5kYXJ5PlxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNEOTRcdUNDOUMgKFx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUNGNThcdUQxNTBcdUNFMjAgXHVEMzI4XHVCMTEwXHVDNUQwXHVDMTFDIFx1Q0Q5NFx1QUMwMCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge3JlY29tbWVuZGF0aW9ucy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVDRDk0XHVDQzlDXCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwic2VjdGlvblwiIHN0eWxlPXt7YmFja2dyb3VuZDondmFyKC0tYmctMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKSd9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIHYwMC4wODMgXHUyMDE0IHNpdGVfY29udGVudF9rdi5yZWNvbW1lbmRhdGlvbnNIZWFkaW5nIFx1QzVEMFx1QzExQyBoZXJvIFx1Qzc3RFx1Qzc0QyAodjAwLjA3MyBzd2VlcCBcdUJCRjhcdUM2NDQgXHVDNzk0XHVDN0FDKS5cbiAgICAgICAgICAgICAgY29uc3QgX2kgPSAod2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9KS5yZWNvbW1lbmRhdGlvbnNIZWFkaW5nIHx8IHt9O1xuICAgICAgICAgICAgICBjb25zdCBlYiA9IGhvbWVUZXh0LnJlY0V5ZWJyb3cgfHwgX2kuZXllYnJvdyB8fCBIT01FX1RFWFRfREVGQVVMVC5yZWNFeWVicm93O1xuICAgICAgICAgICAgICBjb25zdCB0cCA9IGhvbWVUZXh0LnJlY1RpdGxlUHJlZml4ID8/IF9pLnRpdGxlUHJlZml4ID8/IEhPTUVfVEVYVF9ERUZBVUxULnJlY1RpdGxlUHJlZml4O1xuICAgICAgICAgICAgICBjb25zdCB0YSA9IGhvbWVUZXh0LnJlY1RpdGxlQWNjZW50ID8/IF9pLnRpdGxlQWNjZW50ID8/IEhPTUVfVEVYVF9ERUZBVUxULnJlY1RpdGxlQWNjZW50O1xuICAgICAgICAgICAgICBjb25zdCB0cyA9IGhvbWVUZXh0LnJlY1RpdGxlU3VmZml4ID8/IF9pLnRpdGxlU3VmZml4ID8/IEhPTUVfVEVYVF9ERUZBVUxULnJlY1RpdGxlU3VmZml4O1xuICAgICAgICAgICAgICBjb25zdCBzYiA9IGhvbWVUZXh0LnJlY1N1YnRpdGxlIHx8IF9pLnN1YnRpdGxlIHx8IEhPTUVfVEVYVF9ERUZBVUxULnJlY1N1YnRpdGxlO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxTZWN0aW9uSGVhZFxuICAgICAgICAgICAgICAgICAgZXllYnJvdz17ZWJ9XG4gICAgICAgICAgICAgICAgICB0aXRsZT17PD57dHB9PHNwYW4gY2xhc3NOYW1lPVwiYWNjZW50XCI+e3RhfTwvc3Bhbj57dHN9PC8+fVxuICAgICAgICAgICAgICAgICAgc3VidGl0bGU9e3NifVxuICAgICAgICAgICAgICAgICAgYWN0aW9uPXs8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBnbygndG91cicpfT57aG9tZVRleHQucmVjQWN0aW9ufTwvYnV0dG9uPn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLTNcIj5cbiAgICAgICAgICAgICAge3JlY29tbWVuZGF0aW9ucy5tYXAoKHIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheShyLnRhZ3MpID8gci50YWdzIDogKHR5cGVvZiByLnRhZ3MgPT09ICdzdHJpbmcnID8gci50YWdzLnNwbGl0KC9bLFx1MDBCN10vKS5tYXAoKHMpID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxhcnRpY2xlIGtleT17ci5pZCB8fCByLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhcmRcIlxuICAgICAgICAgICAgICAgICAgICB7Li4uY2xpY2thYmxlKCgpID0+IHNldFJlY0RldGFpbChyKSwgYCR7ci5uYW1lIHx8ICdcdUNEOTRcdUNDOUMnfSBcdUMwQzFcdUMxMzggXHVCQ0Y0XHVBRTMwYCl9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Y3Vyc29yOidwb2ludGVyJ319PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OjE2MCwgbWFyZ2luQm90dG9tOjE4LCBwb3NpdGlvbjoncmVsYXRpdmUnLCBvdmVyZmxvdzonaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiByLmltYWdlRGF0YVVyaSA/IGB1cmwoJHtyLmltYWdlRGF0YVVyaX0pIGNlbnRlci9jb3ZlcmAgOiAndmFyKC0tYmctMyknLFxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogci5pbWFnZURhdGFVcmkgPyAnbm9uZScgOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3IucmVnaW9uICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgdG9wOjEwLCBsZWZ0OjEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiczcHggOHB4JywgYmFja2dyb3VuZDondmFyKC0tYmctMiknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBjb2xvcjondmFyKC0taW5rLTIpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19PntyLnJlZ2lvbn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge3RhZ3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6NiwgbWFyZ2luQm90dG9tOjEwLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0YWdzLnNsaWNlKDAsIDMpLm1hcCgodCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZTo5fX0+e3R9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjIsIGZvbnRXZWlnaHQ6NjAwLCBtYXJnaW5Cb3R0b206NX19PntyLm5hbWUgfHwgJ1x1QzgxQ1x1QkFBOSBcdUM1QzZcdUM3NEMnfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgIHtyLnN1YnRpdGxlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6MTEsIGZvbnRXZWlnaHQ6NjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3ZhcigtLXNlY29uZGFyeSknLCBsZXR0ZXJTcGFjaW5nOicwLjA1ZW0nLCBtYXJnaW5Cb3R0b206MTAsXG4gICAgICAgICAgICAgICAgICAgICAgfX0+e3Iuc3VidGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIHtyLmRlc2MgJiYgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIGNvbG9yOid2YXIoLS1pbmstMiknfX0+e3IuZGVzY308L3A+fVxuICAgICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj48L0hvbWVTZWN0aW9uQm91bmRhcnk+XG4gICAgICApfVxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFx1RDIyQ1x1QzVCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QTggXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge3RvdXJzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1RDIyQ1x1QzVCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QThcIj48c2VjdGlvbiBjbGFzc05hbWU9XCJzZWN0aW9uXCIgc3R5bGU9e3tib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKSd9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPFNlY3Rpb25IZWFkXG4gICAgICAgICAgICAgIGV5ZWJyb3c9e2hvbWVUZXh0LnRvdXJFeWVicm93fVxuICAgICAgICAgICAgICB0aXRsZT17PD57aG9tZVRleHQudG91clRpdGxlfTwvPn1cbiAgICAgICAgICAgICAgc3VidGl0bGU9e2hvbWVUZXh0LnRvdXJTdWJ0aXRsZX1cbiAgICAgICAgICAgICAgYWN0aW9uPXs8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBnbygndG91cicpfT57aG9tZVRleHQudG91ckFjdGlvbn08L2J1dHRvbj59XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtMlwiPlxuICAgICAgICAgICAgICB7dG91cnMubWFwKCh0LCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGFydGljbGUga2V5PXt0LmlkfSBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ3RvdXInKSwgYFx1RDIyQ1x1QzVCNDogJHt0LnRpdGxlfWApfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBwb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6MjAsIHJpZ2h0OjIwLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZToxMCwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMmVtJyxcbiAgICAgICAgICAgICAgICAgIH19PjB7aSsxfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OCwgbWFyZ2luQm90dG9tOjE2LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAge3QubGV2ZWwgJiYgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2VcIj57dC5sZXZlbH08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICB7dC5kdXJhdGlvbiAmJiA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiPnt0LmR1cmF0aW9ufTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgIHt0Lmdyb3VwICYmIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCI+e3QuZ3JvdXB9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIiBzdHlsZT17e2ZvbnRTaXplOjIyLCBtYXJnaW5Cb3R0b206MTB9fT57dC50aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAge3QuZGVzYyAmJiA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgbWFyZ2luQm90dG9tOjIwfX0+e3RydW5jYXRlUHJldmlldyh0LmRlc2MsIDExMCl9PC9wPn1cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknLCBwYWRkaW5nVG9wOjE2LFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgZm9udFdlaWdodDo2MDAsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIGNvbG9yOid2YXIoLS1pbmstMyknfX0+e2hvbWVUZXh0LnRvdXJOZXh0TGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Ub3A6NCwgY29sb3I6J3ZhcigtLWluayknLCBmb250V2VpZ2h0OjUwMH19Pnt0Lm5leHQgfHwgaG9tZVRleHQuZW1wdHlGYWxsYmFja308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3t0ZXh0QWxpZ246J3JpZ2h0J319PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBjb2xvcjondmFyKC0taW5rLTMpJ319Pntob21lVGV4dC50b3VyUHJpY2VMYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMCwgbWFyZ2luVG9wOjQsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo2MDB9fT57dC5wcmljZSA/ICh0eXBlb2YgdC5wcmljZSA9PT0gJ251bWJlcicgPyB3aW5kb3cuQkdOSl9GTVQud29uKHQucHJpY2UpIDogdC5wcmljZSkgOiBob21lVGV4dC5lbXB0eUZhbGxiYWNrfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIDxIb21lU2VjdGlvbkJvdW5kYXJ5IGxhYmVsPVwiXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwXCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwic2VjdGlvblwiIHN0eWxlPXt7YmFja2dyb3VuZDondmFyKC0tYmctMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKSd9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8U2VjdGlvbkhlYWRcbiAgICAgICAgICAgIGV5ZWJyb3c9e2hvbWVUZXh0LmNvbW11bml0eUV5ZWJyb3d9XG4gICAgICAgICAgICB0aXRsZT17PD57aG9tZVRleHQuY29tbXVuaXR5VGl0bGV9PC8+fVxuICAgICAgICAgICAgc3VidGl0bGU9e2hvbWVUZXh0LmNvbW11bml0eVN1YnRpdGxlfVxuICAgICAgICAgICAgYWN0aW9uPXs8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBnbygnY29tbXVuaXR5Jyl9Pntob21lVGV4dC5jb21tdW5pdHlBY3Rpb259PC9idXR0b24+fVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3JlY2VudFBvc3RzLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Ym9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgICAgIHtyZWNlbnRQb3N0cy5tYXAoKHBvc3QsIGkpID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2IGtleT17cG9zdC5pZH1cbiAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ2NvbW11bml0eScpLCBwb3N0LnRpdGxlKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBnYXA6MjAsIGFsaWduSXRlbXM6J2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6JzE4cHggMjRweCcsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGkgJSAyID09PSAwID8gJ3ZhcigtLWJnKScgOiAndmFyKC0tYmctMiknLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IGkgPCByZWNlbnRQb3N0cy5sZW5ndGggLSAxID8gJzFweCBzb2xpZCB2YXIoLS1saW5lKScgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OjEsIG1pbldpZHRoOjB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OCwgYWxpZ25JdGVtczonY2VudGVyJywgbWFyZ2luQm90dG9tOjUsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgICAgICAgIHtwb3N0LmNhdGVnb3J5ICYmIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZTo5fX0+e3Bvc3QuY2F0ZWdvcnl9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7cG9zdC5wcmVmaXggJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjksIGZvbnRXZWlnaHQ6NzAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjondmFyKC0tc2Vjb25kYXJ5KScsIGxldHRlclNwYWNpbmc6JzAuMWVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19Plt7cG9zdC5wcmVmaXh9XTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MTUsIGNvbG9yOid2YXIoLS1pbmspJywgbWFyZ2luQm90dG9tOjMsIGZvbnRXZWlnaHQ6NTAwfX0+e3Bvc3QudGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3Bvc3QuYXV0aG9yfSBcdTAwQjcge3Bvc3QuZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGdhcDoxNCwgY29sb3I6J3ZhcigtLWluay0zKScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSwgZmxleFNocmluazowLCBmb250V2VpZ2h0OjUwMCxcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aG9tZVRleHQuY29tbXVuaXR5UmVwbHlMYWJlbH0ge3Bvc3QucmVwbGllcyA/PyAwfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tjb2xvcjondmFyKC0taW5rLTIpJ319Plx1MjE5Mjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17e3RleHRBbGlnbjonY2VudGVyJywgcGFkZGluZzo2MH19PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZToyMCwgY29sb3I6J3ZhcigtLWluayknLCBtYXJnaW5Cb3R0b206MTIsIGZvbnRXZWlnaHQ6NjAwfX0+XG4gICAgICAgICAgICAgICAge2hvbWVUZXh0LmNvbW11bml0eUVtcHR5VGl0bGV9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjEzLCBjb2xvcjondmFyKC0taW5rLTIpJywgbWFyZ2luQm90dG9tOjI0LCBsaW5lSGVpZ2h0OjEuN319PlxuICAgICAgICAgICAgICAgIHtob21lVGV4dC5jb21tdW5pdHlFbXB0eVN1YnRpdGxlfVxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkXCIgb25DbGljaz17KCkgPT4gZ28oJ2NvbW11bml0eScpfT57aG9tZVRleHQuY29tbXVuaXR5RW1wdHlDdGF9PC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj48L0hvbWVTZWN0aW9uQm91bmRhcnk+XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0U3Q1x1QjdGQyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICB7ZmVhdHVyZWRDb2x1bW4gJiYgKFxuICAgICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1Q0U3Q1x1QjdGQ1wiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb25cIiBzdHlsZT17e2JvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8U2VjdGlvbkhlYWRcbiAgICAgICAgICAgICAgZXllYnJvdz17aG9tZVRleHQuY29sdW1uRXllYnJvd31cbiAgICAgICAgICAgICAgdGl0bGU9ezw+e2hvbWVUZXh0LmNvbHVtblRpdGxlfTwvPn1cbiAgICAgICAgICAgICAgc3VidGl0bGU9e2hvbWVUZXh0LmNvbHVtblN1YnRpdGxlfVxuICAgICAgICAgICAgICBhY3Rpb249ezxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IGdvKCdjb2x1bW4nKX0+e2hvbWVUZXh0LmNvbHVtbkFjdGlvbn08L2J1dHRvbj59XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxLjNmciAxZnInLCBnYXA6NDB9fSBjbGFzc05hbWU9XCJjb2wtZ3JpZFwiPlxuICAgICAgICAgICAgICB7LyogXHVENTNDXHVDQzk4XHVCNERDIFx1Q0U3Q1x1QjdGQyAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e3BhZGRpbmc6MCwgb3ZlcmZsb3c6J2hpZGRlbicsIGN1cnNvcjoncG9pbnRlcid9fVxuICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ2NvbHVtbicpLCBgXHVDRTdDXHVCN0ZDOiAke2ZlYXR1cmVkQ29sdW1uLnRpdGxlfWApfT5cbiAgICAgICAgICAgICAgICB7LyogdjAwLjE0MCBcdTIwMTQgY292ZXJVcmwgXHVDMEFDXHVDNkE5IChzdGFsZSBmaWVsZCBcdUM3NzRcdUI5ODQgY292ZXJJbWFnZSBcdUFDMDAgXHVDNTQ0XHVCMkM4XHVCNzdDKS4gKi99XG4gICAgICAgICAgICAgICAgeyhmZWF0dXJlZENvbHVtbi5jb3ZlclVybCB8fCBmZWF0dXJlZENvbHVtbi5jb3ZlckltYWdlKSA/IChcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OjIwMCwgYmFja2dyb3VuZEltYWdlOmB1cmwoJHtmZWF0dXJlZENvbHVtbi5jb3ZlclVybCB8fCBmZWF0dXJlZENvbHVtbi5jb3ZlckltYWdlfSlgLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kU2l6ZTonY292ZXInLCBiYWNrZ3JvdW5kUG9zaXRpb246J2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICB9fS8+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OjE0MCwgYmFja2dyb3VuZDondmFyKC0tYmctMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBwbGFjZUl0ZW1zOidjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6OSwgZm9udFdlaWdodDo2MDAsIGNvbG9yOid2YXIoLS1pbmstMyknLCBsZXR0ZXJTcGFjaW5nOicwLjI4ZW0nfX0+RkVBVFVSRUQgQ09MVU1OPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOjMwfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxMiwgYWxpZ25JdGVtczonY2VudGVyJywgbWFyZ2luQm90dG9tOjE0LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAge2ZlYXR1cmVkQ29sdW1uLmNhdGVnb3J5ICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGxcIj57ZmVhdHVyZWRDb2x1bW4uY2F0ZWdvcnl9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAge2ZlYXR1cmVkQ29sdW1uLmRhdGUgJiYgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTF9fT57ZmVhdHVyZWRDb2x1bW4uZGF0ZX08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICB7ZmVhdHVyZWRDb2x1bW4ucmVhZFRpbWUgJiYgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTF9fT5cdTAwQjcge2ZlYXR1cmVkQ29sdW1uLnJlYWRUaW1lfTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjYsIGZvbnRXZWlnaHQ6NjAwLCBsaW5lSGVpZ2h0OjEuMywgbWFyZ2luQm90dG9tOjEyfX0+XG4gICAgICAgICAgICAgICAgICAgIHtmZWF0dXJlZENvbHVtbi50aXRsZX1cbiAgICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgICB7ZmVhdHVyZWRDb2x1bW4uZXhjZXJwdCAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6MTQsIGxpbmVIZWlnaHQ6MS43NSwgY29sb3I6J3ZhcigtLWluay0yKSd9fT57ZmVhdHVyZWRDb2x1bW4uZXhjZXJwdH08L3A+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgZm9udFdlaWdodDo3MDAsIGxldHRlclNwYWNpbmc6JzAuMmVtJywgbWFyZ2luVG9wOjIwLCBjb2xvcjondmFyKC0tc2Vjb25kYXJ5KSd9fT57aG9tZVRleHQuY29sdW1uUmVhZE1vcmV9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7LyogXHVDMTFDXHVCRTBDIFx1Q0U3Q1x1QjdGQyBcdUJBQTlcdUI4NUQgKi99XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge3NlY29uZGFyeUNvbHVtbnMubWFwKChjKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17Yy5pZH1cbiAgICAgICAgICAgICAgICAgICAgey4uLmNsaWNrYWJsZSgoKSA9PiBnbygnY29sdW1uJyksIGBcdUNFN0NcdUI3RkM6ICR7Yy50aXRsZX1gKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxOHB4IDAnLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIGN1cnNvcjoncG9pbnRlcid9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTAsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbTo4LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7Yy5jYXRlZ29yeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJwaWxsXCIgc3R5bGU9e3tmb250U2l6ZTo5LCBwYWRkaW5nOicycHggOHB4J319PntjLmNhdGVnb3J5fTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAge2MuZGF0ZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMH19PntjLmRhdGV9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MTcsIGZvbnRXZWlnaHQ6NjAwLCBsaW5lSGVpZ2h0OjEuNCwgbWFyZ2luQm90dG9tOjV9fT57Yy50aXRsZX08L2g0PlxuICAgICAgICAgICAgICAgICAgICB7Yy5leGNlcnB0ICYmIDxwIHN0eWxlPXt7Zm9udFNpemU6MTIsIGxpbmVIZWlnaHQ6MS42LCBjb2xvcjondmFyKC0taW5rLTMpJ319PnsoYy5leGNlcnB0fHwnJykuc2xpY2UoMCw2NSl9XHUyMDI2PC9wPn1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIHtzZWNvbmRhcnlDb2x1bW5zLmxlbmd0aCA9PT0gMCAmJiAoXG4gICAgICAgICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjEzLCBjb2xvcjondmFyKC0taW5rLTMpJywgcGFkZGluZzonMThweCAwJ319Pntob21lVGV4dC5jb2x1bW5FbXB0eX08L3A+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVBQzE1XHVDNUYwIFx1Qzc3Q1x1QzgxNSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICB7bGVjdHVyZXMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxIb21lU2VjdGlvbkJvdW5kYXJ5IGxhYmVsPVwiXHVBQzE1XHVDNUYwXCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwic2VjdGlvbi10aWdodFwiIHN0eWxlPXt7YmFja2dyb3VuZDondmFyKC0tYmctMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKSd9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPFNlY3Rpb25IZWFkXG4gICAgICAgICAgICAgIGV5ZWJyb3c9e2hvbWVUZXh0LmxlY3R1cmVzRXllYnJvd31cbiAgICAgICAgICAgICAgdGl0bGU9ezw+e2hvbWVUZXh0LmxlY3R1cmVzVGl0bGV9PC8+fVxuICAgICAgICAgICAgICBhY3Rpb249ezxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IGdvKCdsZWN0dXJlcycpfT57aG9tZVRleHQubGVjdHVyZXNBY3Rpb259PC9idXR0b24+fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLTNcIj5cbiAgICAgICAgICAgICAge2xlY3R1cmVzLm1hcCgobGVjdHVyZSkgPT4gKFxuICAgICAgICAgICAgICAgIDxhcnRpY2xlIGtleT17bGVjdHVyZS5pZH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhcmRcIlxuICAgICAgICAgICAgICAgICAgey4uLmNsaWNrYWJsZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7IHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2JnbmpfcGVuZGluZ19sZWN0dXJlX2lkJywgU3RyaW5nKGxlY3R1cmUuaWQpKTsgfSBjYXRjaCB7fVxuICAgICAgICAgICAgICAgICAgICBnbygnbGVjdHVyZXMnKTtcbiAgICAgICAgICAgICAgICAgIH0sIGBcdUFDMTVcdUM1RjA6ICR7bGVjdHVyZS50b3BpYyB8fCBsZWN0dXJlLnRpdGxlfWApfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInfX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiIHN0eWxlPXt7bWFyZ2luQm90dG9tOjE2fX0+e2hvbWVUZXh0LmxlY3R1cmVCYWRnZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIwLCBmb250V2VpZ2h0OjYwMCwgbWFyZ2luQm90dG9tOjh9fT57bGVjdHVyZS50b3BpYyB8fCBsZWN0dXJlLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICB7bGVjdHVyZS5ub3RlICYmIDxwIHN0eWxlPXt7Zm9udFNpemU6MTMsIGxpbmVIZWlnaHQ6MS43LCBjb2xvcjondmFyKC0taW5rLTIpJywgbWFyZ2luQm90dG9tOjE2fX0+e3RydW5jYXRlUHJldmlldyhsZWN0dXJlLm5vdGUsIDExMCl9PC9wPn1cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHBhZGRpbmdUb3A6MTIsIGRpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2Vlbid9fT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZToxMiwgY29sb3I6J3ZhcigtLWluay0yKSd9fT57bGVjdHVyZS52ZW51ZSB8fCBob21lVGV4dC5lbXB0eUZhbGxiYWNrfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZToxMiwgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRXZWlnaHQ6NjAwLCBjb2xvcjondmFyKC0taW5rKSd9fT57bGVjdHVyZS5uZXh0IHx8IGhvbWVUZXh0LmVtcHR5RmFsbGJhY2t9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+PC9Ib21lU2VjdGlvbkJvdW5kYXJ5PlxuICAgICAgKX1cblxuICAgICAgey8qIFx1MjUwMFx1MjUwMCBcdUNDNDUgQ1RBIFx1MjAxNCB2MDAuMTUyIFx1QjJFNFx1QUQ4QyBcdUNFNzRcdUI4RThcdUMxNDAgKyBcdUM4OENcdUM2QjAgXHVCQjM0XHVENTVDIFx1QkMxOFx1QkNGNSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICA8Qm9va0Nhcm91c2VsU2VjdGlvbiBnbz17Z299IGRhdGFUaWNrPXtkYXRhVGlja30gdGV4dD17aG9tZVRleHR9Lz5cblxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHsgSG9tZVBhZ2UgfSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFXQSxNQUFNLHNCQUFzQixDQUFDLEVBQUUsU0FBUyxHQUFHLE1BQU07QUFYakQ7QUFZRSxRQUFNLENBQUMsY0FBYyxlQUFlLElBQUksTUFBTSxTQUFTLElBQUk7QUFFM0QsZUFBTyxrQkFBUCxnQ0FBdUIsRUFBRSxNQUFNLE1BQU0sT0FBTyxPQUFPLFNBQVMsYUFBYSxNQUFNLE9BQU8sK0NBQVk7QUFDbEcsU0FDRTtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQUksTUFBSztBQUFBLE1BQVMsY0FBVztBQUFBLE1BQU8sY0FBVztBQUFBLE1BQzlDLE9BQU87QUFBQSxRQUNMLFVBQVM7QUFBQSxRQUFTLE9BQU07QUFBQSxRQUFHLFFBQU87QUFBQSxRQUNsQyxZQUFXO0FBQUEsUUFDWCxTQUFRO0FBQUEsUUFBUSxZQUFXO0FBQUEsUUFBVSxTQUFRO0FBQUEsTUFDL0M7QUFBQSxNQUNBLFNBQVMsQ0FBQyxNQUFNO0FBQUUsWUFBSSxFQUFFLFdBQVcsRUFBRSxjQUFlLFNBQVE7QUFBQSxNQUFHO0FBQUE7QUFBQSxJQUMvRCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFlBQVc7QUFBQSxNQUFhLFVBQVM7QUFBQSxNQUFLLE9BQU07QUFBQSxNQUFRLFdBQVU7QUFBQSxNQUM5RCxVQUFTO0FBQUEsTUFBUSxTQUFRO0FBQUEsTUFBa0IsVUFBUztBQUFBLE1BQ3BELFFBQU87QUFBQSxJQUNULEtBQ0U7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUFPLFNBQVM7QUFBQSxRQUFTLGNBQVc7QUFBQSxRQUNuQyxPQUFPO0FBQUEsVUFDTCxVQUFTO0FBQUEsVUFBWSxLQUFJO0FBQUEsVUFBSSxPQUFNO0FBQUEsVUFDbkMsT0FBTTtBQUFBLFVBQUksUUFBTztBQUFBLFVBQUksVUFBUztBQUFBLFVBQzlCLFlBQVc7QUFBQSxVQUFlLFFBQU87QUFBQSxVQUFRLFFBQU87QUFB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

})();

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
      padding: "96px 80px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 80,
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
  } }, stat.s))))), /* @__PURE__ */ React.createElement(HeroProgramCards, { go, dataTick, text: homeText }))))), recommendations.length > 0 && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uBC45\uAE30\uB178\uC790 \uCD94\uCC9C" }, /* @__PURE__ */ React.createElement("section", { className: "section section--anchor", style: { background: "var(--bg-2)", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, (() => {
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
  })(), /* @__PURE__ */ React.createElement("div", { className: recommendations.length >= 3 ? "grid grid-feature-2" : "grid grid-3" }, recommendations.map((r, ri) => {
    const tags = Array.isArray(r.tags) ? r.tags : typeof r.tags === "string" ? r.tags.split(/[,·]/).map((s) => s.trim()).filter(Boolean) : [];
    const isFeature = recommendations.length >= 3 && ri === 0;
    return /* @__PURE__ */ React.createElement(
      "article",
      {
        key: r.id || r.name,
        className: "card",
        ...clickable(() => setRecDetail(r), `${r.name || "\uCD94\uCC9C"} \uC0C1\uC138 \uBCF4\uAE30`),
        style: { cursor: "pointer", display: "flex", flexDirection: "column" }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        height: isFeature ? 320 : 160,
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
  }))))), tours.length > 0 && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8" }, /* @__PURE__ */ React.createElement("section", { className: "section-tight", style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "section-head section-head--inline" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, homeText.tourEyebrow), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, homeText.tourTitle, /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.18em",
    color: "var(--ink-3)",
    marginLeft: 14,
    verticalAlign: "middle"
  } }, "\xB7 ", tours.length, "\uAC1C \uC77C\uC815"))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("tour") }, homeText.tourAction)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-2" }, tours.map((t, i) => /* @__PURE__ */ React.createElement(
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
  )))))), /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCEE4\uBBA4\uB2C8\uD2F0" }, /* @__PURE__ */ React.createElement("section", { className: "section--mid", style: { background: "var(--bg-2)", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 32,
    flexWrap: "wrap",
    marginBottom: 32,
    paddingBottom: 18,
    borderBottom: "1px solid var(--line)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 320px", minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, homeText.communityEyebrow), /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { fontSize: 28, marginBottom: 0 } }, homeText.communityTitle)), homeText.communitySubtitle && /* @__PURE__ */ React.createElement("p", { style: {
    flex: "1 1 280px",
    fontSize: 13,
    color: "var(--ink-3)",
    lineHeight: 1.7,
    margin: 0,
    maxWidth: 380
  } }, homeText.communitySubtitle), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("community") }, homeText.communityAction)), recentPosts.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--line)" } }, recentPosts.map((post, i) => {
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
          padding: "16px 22px",
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
  })) : /* @__PURE__ */ React.createElement("div", { className: "card", style: { textAlign: "center", padding: 60 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--ink)", marginBottom: 12, fontWeight: 600 } }, homeText.communityEmptyTitle), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-2)", marginBottom: 24, lineHeight: 1.7 } }, homeText.communityEmptySubtitle), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("community") }, homeText.communityEmptyCta))))), featuredColumn && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCE7C\uB7FC" }, /* @__PURE__ */ React.createElement("section", { className: "section--mid", style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 28,
    gap: 16,
    flexWrap: "wrap"
  } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true", style: { margin: 0 } }, homeText.columnEyebrow), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("column") }, homeText.columnAction)), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56 }, className: "col-grid" }, /* @__PURE__ */ React.createElement(
    "article",
    {
      style: { cursor: "pointer" },
      ...clickable(() => go("column"), `\uCE7C\uB7FC: ${featuredColumn.title}`)
    },
    featuredColumn.coverUrl || featuredColumn.coverImage ? /* @__PURE__ */ React.createElement("div", { style: {
      height: 340,
      marginBottom: 28,
      backgroundImage: `url(${featuredColumn.coverUrl || featuredColumn.coverImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    } }) : /* @__PURE__ */ React.createElement("div", { style: {
      height: 260,
      background: "var(--bg-2)",
      marginBottom: 28,
      display: "grid",
      placeItems: "center",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.28em" } }, "FEATURED COLUMN")),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" } }, featuredColumn.category && /* @__PURE__ */ React.createElement("span", { className: "pill" }, featuredColumn.category), featuredColumn.date && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, featuredColumn.date), featuredColumn.readTime && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, "\xB7 ", featuredColumn.readTime)),
    /* @__PURE__ */ React.createElement("h2", { style: {
      fontFamily: "var(--font-serif)",
      fontSize: "clamp(28px, 3vw, 38px)",
      fontWeight: 600,
      lineHeight: 1.2,
      marginBottom: 14,
      color: "var(--ink)",
      letterSpacing: "-0.01em"
    } }, featuredColumn.title),
    featuredColumn.excerpt && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, lineHeight: 1.85, color: "var(--ink-2)", marginBottom: 18, maxWidth: 580 } }, featuredColumn.excerpt),
    /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--secondary)" } }, homeText.columnReadMore)
  ), /* @__PURE__ */ React.createElement("aside", { style: { paddingTop: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
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
        padding: "16px 0",
        borderBottom: ci < secondaryColumns.length - 1 ? "1px solid var(--line)" : "none",
        cursor: "pointer"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" } }, c.category && /* @__PURE__ */ React.createElement("span", { className: "pill", style: { fontSize: 9, padding: "2px 8px" } }, c.category), c.date && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, c.date)),
    /* @__PURE__ */ React.createElement("h4", { className: "ko-serif", style: { fontSize: 16, fontWeight: 600, lineHeight: 1.4, marginBottom: 4 } }, c.title),
    c.excerpt && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, lineHeight: 1.6, color: "var(--ink-3)", margin: 0 } }, (c.excerpt || "").slice(0, 65), "\u2026")
  )), secondaryColumns.length === 0 && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", padding: "16px 0" } }, homeText.columnEmpty)))))), lectures.length > 0 && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uAC15\uC5F0" }, /* @__PURE__ */ React.createElement("section", { className: "section-tight", style: { background: "var(--bg-2)", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "section-head section-head--inline" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, homeText.lecturesEyebrow), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, homeText.lecturesTitle)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("lectures") }, homeText.lecturesAction)), /* @__PURE__ */ React.createElement("div", { className: "lecture-strip", role: "list" }, lectures.map((lecture) => /* @__PURE__ */ React.createElement(
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
      style: { cursor: "pointer", display: "flex", flexDirection: "column" }
    },
    /* @__PURE__ */ React.createElement("span", { className: "badge", style: { marginBottom: 16, alignSelf: "flex-start" } }, homeText.lectureBadge),
    /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, fontWeight: 600, marginBottom: 8, flex: "0 0 auto" } }, lecture.topic || lecture.title),
    lecture.note && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, lineHeight: 1.7, color: "var(--ink-2)", marginBottom: 16, flex: "1 1 auto" } }, truncatePreview(lecture.note, 110)),
    /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid var(--line)", paddingTop: 12, display: "flex", justifyContent: "space-between", marginTop: "auto" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--ink-2)" } }, lecture.venue || homeText.emptyFallback), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink)" } }, lecture.next || homeText.emptyFallback))
  ))), lectures.length >= 3 && /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.22em",
    color: "var(--ink-3)",
    textAlign: "right"
  } }, "\u2190 \uAC00\uB85C\uB85C \uC2A4\uD06C\uB864 \u2192")))), /* @__PURE__ */ React.createElement(BookCarouselSection, { go, dataTick, text: homeText }));
};
Object.assign(window, { HomePage });
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvSG9tZVBhZ2UuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVENjQ4XHVEMzk4XHVDNzc0XHVDOUMwIFx1MjAxNCBcdUQ1NUNcdUFENkQgXHVDNUVDXHVENTg5XHUwMEI3XHVDNUVEXHVDMEFDXHUwMEI3XHVCQjM4XHVENjU0IFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFxuLy8gXHVCMzcwXHVDNzc0XHVEMTMwIFx1QzZEMFx1Q0U1OSAodjAwLjA0Nik6XG4vLyAgIDEuIFx1QkFBOFx1QjRFMCBcdUNGNThcdUQxNTBcdUNFMjBcdUIyOTQgXHVDMTFDXHVCQzg0KEQxKSBzb3VyY2Utb2YtdHJ1dGguXG4vLyAgICAgIC0gc2MucmVjb21tZW5kYXRpb25zICAgIFx1MjE5MiBzaXRlX2NvbnRlbnRfa3YgKFx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUNGNThcdUQxNTBcdUNFMjAgXHVEMzI4XHVCMTEwKVxuLy8gICAgICAtIHB1YmxpY0NvbHVtbnMgICAgICAgICBcdTIxOTIgQkdOSl9BUEkuY29sdW1ucy5saXN0IChEMS51c2VyX2NvbHVtbnMpXG4vLyAgICAgIC0gdG91cnMgLyBsZWN0dXJlcyAgICAgIFx1MjE5MiBCR05KX0FQSS50b3Vycy9sZWN0dXJlcy5saXN0XG4vLyAgICAgIC0gcmVjZW50UG9zdHMgICAgICAgICAgIFx1MjE5MiBCR05KX0FQSS5jb21tdW5pdHkucG9zdHNcbi8vICAgMi4gQkFOR0lOT0pBX0RBVEEgXHVDODE1XHVDODAxIFx1QzJEQ1x1QjREQ1x1QjI5NCBcdUIzNTQgXHVDNzc0XHVDMEMxIFx1Q0MzOFx1Qzg3MFx1RDU1OFx1QzlDMCBcdUM1NEFcdUIyOTRcdUIyRTQuXG4vLyAgIDMuIFx1QzExQ1x1QkM4NCBcdUM3NTFcdUIyRjVcdUM3NzQgXHVCRTQ0XHVCQTc0IFx1RDU3NFx1QjJGOSBcdUMxMzlcdUMxNTggXHVDNzkwXHVDQ0I0XHVCOTdDIFx1QjgwQ1x1QjM1NFx1RDU1OFx1QzlDMCBcdUM1NEFcdUIyOTRcdUIyRTQgKFx1QUU2MVx1RDFCNSBcdUNFNzRcdUI0REMgXHVBRTA4XHVDOUMwKS5cbi8vICAgNC4gXHVCQUE4XHVCNEUwIFx1RDVFQ1x1RDM3QyBcdUQ2MzhcdUNEOUNcdUM3NDAgQkdOSl9HVUFSRC5hcnIvLmNhbGwgXHVCODVDIHRyeS9jYXRjaCArIFx1RDBDMFx1Qzc4NSBcdUFDMDBcdUI0REMgXHVEMUI1XHVBQ0ZDLlxuXG5jb25zdCBEZXN0aW5hdGlvbk1hcE1vZGFsID0gKHsgb25DbG9zZSwgZ28gfSkgPT4ge1xuICBjb25zdCBbc2VsZWN0ZWREZXN0LCBzZXRTZWxlY3RlZERlc3RdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIC8vIHYwMC4wNzcgXHUyMDE0IHVzZU1vZGFsR3VhcmQgXHVEMUI1XHVDNzdDIChFU0MgKyBib2R5IHNjcm9sbCBsb2NrICsgcG9wc3RhdGUpLiBcdUM3N0RcdUFFMzAgXHVDODA0XHVDNkE5IFx1MjE5MiBkaXJ0eT1mYWxzZS5cbiAgd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiBmYWxzZSwgb25DbG9zZSwgb25TYXZlRHJhZnQ6IG51bGwsIGxhYmVsOiAnXHVDNUVDXHVENTg5XHVDOUMwIFx1QzlDMFx1QjNDNCBcdUQwRDBcdUMwQzknIH0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIlx1QzVFQ1x1RDU4OVx1QzlDMCBcdUM5QzBcdUIzQzQgXHVEMEQwXHVDMEM5XCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGluc2V0OjAsIHpJbmRleDoyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6J3JnYmEoMTUsMjMsNDIsMC41NSknLFxuICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgcGFkZGluZzoyMCxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkgb25DbG9zZSgpOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgbWF4V2lkdGg6NjgwLCB3aWR0aDonMTAwJScsIG1heEhlaWdodDonOTJ2aCcsXG4gICAgICAgIG92ZXJmbG93OidhdXRvJywgcGFkZGluZzonMzJweCAyOHB4IDI4cHgnLCBwb3NpdGlvbjoncmVsYXRpdmUnLFxuICAgICAgICBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfSBhcmlhLWxhYmVsPVwiXHVCMkVCXHVBRTMwXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgdG9wOjE0LCByaWdodDoxNCxcbiAgICAgICAgICAgIHdpZHRoOjM2LCBoZWlnaHQ6MzYsIGZvbnRTaXplOjI0LFxuICAgICAgICAgICAgYmFja2dyb3VuZDondHJhbnNwYXJlbnQnLCBib3JkZXI6J25vbmUnLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgY29sb3I6J3ZhcigtLWluay0yKScsIGxpbmVIZWlnaHQ6MSxcbiAgICAgICAgICB9fT5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBzdHlsZT17e21hcmdpbkJvdHRvbToxNH19PkRFU1RJTkFUSU9OUyBcdTAwQjcgXHVDNUVDXHVENTg5XHVDOUMwIFx1QzlDMFx1QjNDNDwvZGl2PlxuICAgICAgICA8aDIgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LWRpc3BsYXkpJywgZm9udFNpemU6MjYsIGZvbnRXZWlnaHQ6OTAwLCBtYXJnaW5Cb3R0b206MTAsIGxpbmVIZWlnaHQ6MS4yfX0+XG4gICAgICAgICAgXHVDOUMwXHVCM0M0XHVCOTdDIFx1RDA3NFx1QjlBRFx1RDU3NCBcdUQwRDBcdUMwQzlcdUQ1NThcdUMxMzhcdUM2OTRcbiAgICAgICAgPC9oMj5cbiAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyMCwgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICBcdUMyRENcdUIzQzRcdUI5N0MgXHVCMjA0XHVCOTc0XHVCQTc0IFx1QzgxNVx1QkNGNFx1QUMwMCBcdUQzQkNcdUNDRDBcdUM5RDFcdUIyQzhcdUIyRTQuIFx1RDYzOFx1QkM4NFx1RDU1OFx1QkE3NCBcdUM5QzBcdUJBODVcdUM3NzQgXHVENDVDXHVDMkRDXHVCNDI5XHVCMkM4XHVCMkU0LlxuICAgICAgICA8L3A+XG4gICAgICAgIHt0eXBlb2YgS29yZWFNYXAgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgPEtvcmVhTWFwXG4gICAgICAgICAgICBvblNlbGVjdD17KGRlc3QpID0+IHNldFNlbGVjdGVkRGVzdChzZWxlY3RlZERlc3Q/LmlkID09PSBkZXN0LmlkID8gbnVsbCA6IGRlc3QpfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkRGVzdD8uaWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7aGVpZ2h0OjMwMCwgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIGNvbG9yOid2YXIoLS1pbmstMyknLCBmb250U2l6ZToxM319Plx1QzlDMFx1QjNDNCBcdUI4NUNcdUI1MjkgXHVDOTExLi4uPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHtzZWxlY3RlZERlc3QgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIG1hcmdpblRvcDoxOCwgcGFkZGluZzonMThweCAyMHB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidiYXNlbGluZScsIGdhcDoxMCwgbWFyZ2luQm90dG9tOjgsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MjIsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo2MDB9fT57c2VsZWN0ZWREZXN0Lm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMTJlbSd9fT57c2VsZWN0ZWREZXN0LmZ1bGxuYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge3NlbGVjdGVkRGVzdC5kZXNjICYmIChcbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxNCwgY29sb3I6J3ZhcigtLWluay0yKScsIGxpbmVIZWlnaHQ6MS43LCBtYXJnaW5Cb3R0b206MTJ9fT57c2VsZWN0ZWREZXN0LmRlc2N9PC9wPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtzZWxlY3RlZERlc3QudGFncyAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjYsIGZsZXhXcmFwOid3cmFwJywgbWFyZ2luQm90dG9tOjE0fX0+XG4gICAgICAgICAgICAgICAge1N0cmluZyhzZWxlY3RlZERlc3QudGFncykuc3BsaXQoJ1x1MDBCNycpLm1hcCgodCkgPT4gdC50cmltKCkpLmZpbHRlcihCb29sZWFuKS5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGtleT17dH0gY2xhc3NOYW1lPVwiYmFkZ2VcIiBzdHlsZT17e2ZvbnRTaXplOjEwfX0+e3R9PC9zcGFuPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiB7IGdvKCd0b3VyJyk7IG9uQ2xvc2UoKTsgfX0+XG4gICAgICAgICAgICAgIFx1Qzc3NCBcdUM5QzBcdUM1RUQgXHVEMjJDXHVDNUI0IFx1QkNGNFx1QUUzMCBcdTIxOTJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdUMxMzlcdUMxNTggXHVCMkU4XHVDNzA0IFx1QzVEMFx1QjdFQyBcdUJDMTRcdUM2QjRcdUIzNTRcdUI5QUMgXHUyMDE0IFx1RDU1QyBcdUMxMzlcdUMxNThcdUM3NzQgXHVCOUREXHVBQzAwXHVDODM4XHVCM0M0IFx1QjJFNFx1Qjk3OCBcdUMxMzlcdUMxNThcdUM3NDAgXHVDODE1XHVDMEMxIFx1QjgwQ1x1QjM1NC5cbmNsYXNzIEhvbWVTZWN0aW9uQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVycikge1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tIb21lU2VjdGlvbkJvdW5kYXJ5XScsIHRoaXMucHJvcHMubGFiZWwgfHwgJ3NlY3Rpb24nLCBlcnIpOyB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6ICdIT01FX1NFQ1RJT05fRVJST1InLCBzdGF0dXM6IG51bGwsIGtpbmQ6ICdyZW5kZXInLFxuICAgICAgICBtZXNzYWdlOiBlcnI/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVyciksXG4gICAgICAgIGhpbnQ6IGBzZWN0aW9uPSR7dGhpcy5wcm9wcy5sYWJlbCB8fCAnJ31gLCB1cmw6ICcnLFxuICAgICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsIG9yaWdpbjogbG9jYXRpb24ub3JpZ2luLFxuICAgICAgfSk/LmNhdGNoPy4oKCkgPT4ge30pO1xuICAgIH0gY2F0Y2gge31cbiAgfVxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIC8vIFx1QkIzNFx1Qzc0QyBcdUFDQTlcdUI5QUMgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QzVEMFx1QUM4QyBcdUJFNDggXHVDNzkwXHVCOUFDIFx1QjMwMFx1QzJFMCBcdUFDMDBcdUJDQkNcdUM2QjQgcGxhY2Vob2xkZXIgXHVENTVDIFx1QzkwNFx1QjlDQyBcdUQ0NUNcdUFFMzBcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzZWN0aW9uIHN0eWxlPXt7cGFkZGluZzonMjRweCAwJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB0ZXh0QWxpZ246J2NlbnRlcid9fT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgbGV0dGVyU3BhY2luZzonMC4xOGVtJ319PlxuICAgICAgICAgICAgXHUyNkEwIHt0aGlzLnByb3BzLmxhYmVsIHx8ICdcdUM3NzQgXHVDMTM5XHVDMTU4J30gXHVDNzQ0IFx1QkQ4OFx1QjdFQ1x1QzYyNFx1QzlDMCBcdUJBQkJcdUQ1ODhcdUMyQjVcdUIyQzhcdUIyRTRcbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59XG5cbi8vIFx1Q0Q5NFx1Q0M5QyBcdUM1RUNcdUQ1ODlcdUM5QzAgXHVDMEMxXHVDMTM4IFx1QkFBOFx1QjJFQyBcdTIwMTQgXHVDRTc0XHVCNERDIFx1RDA3NFx1QjlBRCBcdUMyREMgXHVCMzU0IFx1RDA3MCBcdUM3NzRcdUJCRjhcdUM5QzAgKyBcdUM4MDRcdUNDQjQgXHVDMTI0XHVCQTg1ICsgXHVEMERDXHVBREY4ICsgXHVEMjJDXHVDNUI0IFx1QkNGNFx1QUUzMCBDVEEuXG5jb25zdCBSZWNvbW1lbmRhdGlvbkRldGFpbE1vZGFsID0gKHsgcmVjLCBvbkNsb3NlLCBnbyB9KSA9PiB7XG4gIC8vIHYwMC4wNzcgXHUyMDE0IHVzZU1vZGFsR3VhcmQgXHVEMUI1XHVDNzdDIChFU0MgKyBib2R5IHNjcm9sbCBsb2NrICsgcG9wc3RhdGUpLiBcdUM3N0RcdUFFMzAgXHVDODA0XHVDNkE5IFx1MjE5MiBkaXJ0eT1mYWxzZS5cbiAgd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiBmYWxzZSwgb25DbG9zZSwgb25TYXZlRHJhZnQ6IG51bGwsIGxhYmVsOiByZWM/Lm5hbWUgfHwgJ1x1QzVFQ1x1RDU4OVx1QzlDMCBcdUMwQzFcdUMxMzgnIH0pO1xuICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheShyZWMudGFncylcbiAgICA/IHJlYy50YWdzXG4gICAgOiAodHlwZW9mIHJlYy50YWdzID09PSAnc3RyaW5nJyA/IHJlYy50YWdzLnNwbGl0KC9bLFx1MDBCN10vKS5tYXAoKHMpID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBhcmlhLWxhYmVsPXtgJHtyZWMubmFtZSB8fCAnXHVDRDk0XHVDQzlDJ30gXHVDMEMxXHVDMTM4YH1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGluc2V0OjAsIHpJbmRleDoyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6J3JnYmEoMTUsMjMsNDIsMC41NSknLFxuICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgcGFkZGluZzoyMCxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkgb25DbG9zZSgpOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgbWF4V2lkdGg6NzIwLCB3aWR0aDonMTAwJScsIG1heEhlaWdodDonOTJ2aCcsXG4gICAgICAgIG92ZXJmbG93OidhdXRvJywgcG9zaXRpb246J3JlbGF0aXZlJyxcbiAgICAgICAgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbG9zZX0gYXJpYS1sYWJlbD1cIlx1QjJFQlx1QUUzMFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDoxNCwgcmlnaHQ6MTQsIHpJbmRleDoyLFxuICAgICAgICAgICAgd2lkdGg6MzYsIGhlaWdodDozNiwgZm9udFNpemU6MjQsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgIGNvbG9yOid2YXIoLS1pbmspJywgbGluZUhlaWdodDoxLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICB9fT5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAge3JlYy5pbWFnZURhdGFVcmkgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOicxMDAlJywgaGVpZ2h0OjI4MCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGB1cmwoJHtyZWMuaW1hZ2VEYXRhVXJpfSkgY2VudGVyL2NvdmVyYCxcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICB9fS8+XG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOicyOHB4IDI4cHggMjRweCd9fT5cbiAgICAgICAgICB7cmVjLnJlZ2lvbiAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6J2lubGluZS1ibG9jaycsIHBhZGRpbmc6JzRweCAxMHB4JyxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBtYXJnaW5Cb3R0b206MTQsXG4gICAgICAgICAgICB9fT57cmVjLnJlZ2lvbn08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZTozMiwgZm9udFdlaWdodDo3MDAsXG4gICAgICAgICAgICBjb2xvcjondmFyKC0taW5rKScsIGxpbmVIZWlnaHQ6MS4yLCBtYXJnaW5Cb3R0b206OCxcbiAgICAgICAgICB9fT57cmVjLm5hbWUgfHwgJ1x1QzgxQ1x1QkFBOSBcdUM1QzZcdUM3NEMnfTwvaDI+XG4gICAgICAgICAge3JlYy5zdWJ0aXRsZSAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMywgZm9udFdlaWdodDo2MDAsXG4gICAgICAgICAgICAgIGNvbG9yOid2YXIoLS1zZWNvbmRhcnkpJywgbGV0dGVyU3BhY2luZzonMC4wNGVtJywgbWFyZ2luQm90dG9tOjE4LFxuICAgICAgICAgICAgfX0+e3JlYy5zdWJ0aXRsZX08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtyZWMuZGVzYyAmJiAoXG4gICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjE1LCBsaW5lSGVpZ2h0OjEuODUsIGNvbG9yOid2YXIoLS1pbmstMiknLCBtYXJnaW5Cb3R0b206MjJ9fT57cmVjLmRlc2N9PC9wPlxuICAgICAgICAgICl9XG4gICAgICAgICAge3RhZ3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo2LCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbToyMn19PlxuICAgICAgICAgICAgICB7dGFncy5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZToxMH19Pnt0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEwLCBmbGV4V3JhcDond3JhcCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgcGFkZGluZ1RvcDoxOH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGRcIiBvbkNsaWNrPXsoKSA9PiB7IGdvKCd0b3VyJyk7IG9uQ2xvc2UoKTsgfX0+XHVDNzc0IFx1QzlDMFx1QzVFRCBcdUQyMkNcdUM1QjQgXHVCQ0Y0XHVBRTMwIFx1MjE5MjwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXtvbkNsb3NlfT5cdUIyRUJcdUFFMzA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIHYwMC4wNzIgXHUyMDE0IFx1RDY0OCBcdUNFNzRcdUI0RENcdUM3NTggZGVzY3JpcHRpb24gLyBub3RlIFx1Qjk3QyBcdUM5RTdcdUFDOEMgXHVDNzkwXHVCOTc0XHVCMjk0IFx1RDVFQ1x1RDM3Qy5cbi8vIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUJDRjRcdUFDRTA6IFwiXHVENjQ4XHVDNUQwIFx1QjE3OFx1Q0Q5Q1x1QjQxOFx1QjI5NFx1QUM3NCBcdUM4MDFcdUIyRjlcdUQ3ODggXHVDOTA0XHVDNzc0XHVBQzcwXHVCMDk4IFx1RDY0OFx1QzZBOVx1QzczQ1x1Qjg1QyBcdUI1MzBcdUI4NUMgXHVBRTAwXHVDNzQ0IFx1QzRGMFx1QUM4QyBcdUQ1NzRcdUM1N0NcdUM5QzBcIiBcdTIwMTQgXHVDNkIwXHVDMTIwIHRydW5jYXRlLlxuLy8gXHVDOTA0XHVCQzE0XHVBRkM4XHVDNzQwIFx1QUNGNVx1QkMzMVx1QzczQ1x1Qjg1QyBcdUJDQzBcdUQ2NThcdUQ1NzQgXHVDRTc0XHVCNERDIFx1QjgwOFx1Qzc3NFx1QzU0NFx1QzZDM1x1Qzc3NCBcdUM1NDhcdUM4MTUuIFx1QjJFOFx1QzVCNCBcdUFDQkRcdUFDQzRcdUM1RDAgXHVCOURFXHVDREIwIFx1Qzc5MFx1Qjk3OCBcdUI0QTQgXCJcdTIwMjZcIiBcdUNDQThcdUJEODAuXG5jb25zdCB0cnVuY2F0ZVByZXZpZXcgPSAodGV4dCwgbWF4ID0gMTEwKSA9PiB7XG4gIGNvbnN0IHMgPSBTdHJpbmcodGV4dCB8fCAnJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKTtcbiAgaWYgKHMubGVuZ3RoIDw9IG1heCkgcmV0dXJuIHM7XG4gIC8vIFx1QjJFOFx1QzVCNCBcdUFDQkRcdUFDQzRcdUFFNENcdUM5QzAgYmFja3RyYWNrIFx1MjAxNCBcdUQ1NUNcdUFFMDBcdUM3NDAgXHVBQ0Y1XHVCQzMxXHVDNzc0IFx1QzgwMVx1QzVCNCBiYWNrdHJhY2sgXHVDMkU0XHVEMzI4XHVENTU4XHVCQTc0IFx1QURGOFx1QjBFNSBcdUM3OTBcdUI5NzRcdUFFMzAuXG4gIGNvbnN0IHNsaWNlID0gcy5zbGljZSgwLCBtYXgpO1xuICBjb25zdCBsYXN0U3BhY2UgPSBzbGljZS5sYXN0SW5kZXhPZignICcpO1xuICBjb25zdCBjdXQgPSBsYXN0U3BhY2UgPiBtYXggKiAwLjYgPyBzbGljZS5zbGljZSgwLCBsYXN0U3BhY2UpIDogc2xpY2U7XG4gIHJldHVybiBjdXQgKyAnXHUyMDI2Jztcbn07XG5cbmNvbnN0IEhPTUVfVEVYVF9ERUZBVUxUID0ge1xuICByZWNFeWVicm93OiAnXHVDNkI0XHVDNjAxXHVDNzkwXHVBQzAwIFx1QjJFNFx1QjE0MFx1QzYyOCBcdUFDRjMnLFxuICByZWNUaXRsZVByZWZpeDogJ1x1QzY5NFx1Qzk5OCAnLFxuICByZWNUaXRsZUFjY2VudDogJ1x1QjIwOFx1QzVEMCBcdUI0RTRcdUM1QjRcdUM2MjgnLFxuICByZWNUaXRsZVN1ZmZpeDogJyBcdUM3QTVcdUMxOEMnLFxuICByZWNTdWJ0aXRsZTogJ1x1QzlDMVx1QzgxMSBcdUFDNzdcdUFDRTAgXHVCQTM5XHVDNUI0XHVCQ0Y4IFx1QjRBNCBcdUIyRTRcdUMyREMgXHVBRUJDXHVCMEI0IFx1QkNGNFx1QUNFMCBcdUMyRjZcdUM3NDAgXHVBQ0YzXHVCOUNDIFx1QUNFOFx1Qjc5MFx1QzJCNVx1QjJDOFx1QjJFNC4nLFxuICByZWNBY3Rpb246ICdcdUM4MDRcdUNDQjQgXHVDNzdDXHVDODE1IFx1MjE5MicsXG4gIHRvdXJFeWVicm93OiAnXHVCMkY1XHVDMEFDIFx1Qzc3Q1x1QzgxNScsXG4gIHRvdXJUaXRsZTogJ1x1Qzc3NFx1QkM4OFx1QzVEMCBcdUQ1NjhcdUFFRDggXHVBQzc4XHVDNzQ0IFx1QUUzOCcsXG4gIHRvdXJTdWJ0aXRsZTogJ1x1RDA3MCBcdUJDODRcdUMyQTRcdUJDRjRcdUIyRTQgXHVDNzkxXHVDNzQwIFx1QUM3OFx1Qzc0Q1x1QzVEMCBcdUI5REVcdUNEOTggXHVCMkY1XHVDMEFDXHVDNzg1XHVCMkM4XHVCMkU0LiBcdUM3QTVcdUMxOENcdUM3NTggXHVCMEI0XHVCODI1XHVBQ0ZDIFx1QzYyNFx1QjI5OFx1Qzc1OCBcdUQ0NUNcdUM4MTVcdUM3NDQgXHVBQzE5XHVDNzc0IFx1QkQwNVx1QjJDOFx1QjJFNC4nLFxuICB0b3VyQWN0aW9uOiAnXHVDODA0XHVDQ0I0IFx1Qzc3Q1x1QzgxNSBcdTIxOTInLFxuICB0b3VyTmV4dExhYmVsOiAnXHVCMkU0XHVDNzRDIFx1Qzc3Q1x1QzgxNScsXG4gIHRvdXJQcmljZUxhYmVsOiAnXHVDQzM4XHVBQzAwXHVCRTQ0JyxcbiAgY29tbXVuaXR5RXllYnJvdzogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCcsXG4gIGNvbW11bml0eVRpdGxlOiAnXHVCMkU0XHVCMTQwXHVDNjI4IFx1QzBBQ1x1Qjc4Q1x1QjRFNFx1Qzc1OCBcdUFFMzBcdUI4NUQnLFxuICBjb21tdW5pdHlTdWJ0aXRsZTogJ1x1Qzg4Qlx1QzU1OFx1QjM1OCBcdUMyRERcdUIyRjksIFx1QzU2MFx1QjlFNFx1RDU4OFx1QjM1OCBcdUIzRDlcdUMxMjAsIFx1QjJFNFx1QzJEQyBcdUFDMDBcdUFDRTAgXHVDMkY2XHVDNzQwIFx1QUNFOFx1QkFBOVx1QUU0Q1x1QzlDMCBcdUQzQjhcdUQ1NThcdUFDOEMgXHVCMEE4XHVBQ0E4XHVDOEZDXHVDMTM4XHVDNjk0LicsXG4gIGNvbW11bml0eUFjdGlvbjogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdUFDMDBcdUFFMzAgXHUyMTkyJyxcbiAgY29tbXVuaXR5UmVwbHlMYWJlbDogJ1x1QjMxM1x1QUUwMCcsXG4gIGNvbW11bml0eUVtcHR5VGl0bGU6ICdcdUNDQUIgXHVCQzg4XHVDOUY4IFx1QzVFQ1x1RDU4OSBcdUM3NzRcdUM1N0NcdUFFMzBcdUI5N0MgXHVDMzY4XHVDOEZDXHVDMTM4XHVDNjk0JyxcbiAgY29tbXVuaXR5RW1wdHlTdWJ0aXRsZTogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFx1QzVEMCBcdUM1RUNcdUQ1ODkgXHVBQ0JEXHVENUQ4XHVDNzQ0IFx1QjA5OFx1QjIwNFx1QkE3NCBcdUIzNTQgXHVCOUNFXHVDNzQwIFx1QzVFQ1x1RDU4OVx1Qzc5MFx1QjRFNFx1Qzc3NCBcdUJBQThcdUM1RUNcdUI0RURcdUIyQzhcdUIyRTQuJyxcbiAgY29tbXVuaXR5RW1wdHlDdGE6ICdcdUFFMDAgXHVDNzkxXHVDMTMxXHVENTU4XHVBRTMwIFx1MjE5MicsXG4gIGNvbHVtbkV5ZWJyb3c6ICdcdUM3N0RcdUM3NDRcdUFDNzBcdUI5QUMnLFxuICBjb2x1bW5UaXRsZTogJ1x1QUUzOCBcdUM3MDRcdUM1RDBcdUMxMUMgXHVDNzc0XHVDNUI0XHVDOUMwXHVCMjk0IFx1QzBERFx1QUMwMScsXG4gIGNvbHVtblN1YnRpdGxlOiAnXHVCMkY1XHVDMEFDXHVDNUQwXHVDMTFDIFx1QzJEQ1x1Qzc5MVx1RDU3NCBcdUNDNDVcdUMwQzEgXHVDNzA0XHVCODVDIFx1QjNDQ1x1QzU0NFx1QzYyOCBcdUM3NzRcdUM1N0NcdUFFMzBcdUI0RTRcdUM3ODVcdUIyQzhcdUIyRTQuJyxcbiAgY29sdW1uQWN0aW9uOiAnXHVDRTdDXHVCN0ZDIFx1QzgwNFx1Q0NCNCBcdUJDRjRcdUFFMzAgXHUyMTkyJyxcbiAgY29sdW1uUmVhZE1vcmU6ICdcdUIzNTQgXHVDNzdEXHVBRTMwIFx1MjE5MicsXG4gIGNvbHVtbkVtcHR5OiAnXHVCMkU0XHVDNzRDIFx1Q0U3Q1x1QjdGQyBcdUM5MDBcdUJFNDQgXHVDOTExXHVDNzg1XHVCMkM4XHVCMkU0LicsXG4gIGxlY3R1cmVzRXllYnJvdzogJ1x1QUMxNVx1QzVGMCcsXG4gIGxlY3R1cmVzVGl0bGU6ICdcdUM1NDlcdUM1NDRcdUMxMUMgXHVCQTNDXHVDODAwIFx1QjVBMFx1QjA5OFx1QjI5NCBcdUMyRENcdUFDMDQnLFxuICBsZWN0dXJlc0FjdGlvbjogJ1x1QzgwNFx1Q0NCNCBcdUFDMTVcdUM1RjAgXHVCQ0Y0XHVBRTMwIFx1MjE5MicsXG4gIGxlY3R1cmVCYWRnZTogJ1x1QUMxNVx1QzVGMCcsXG4gIGhlcm9SZWNlbnRMZWN0dXJlTGFiZWw6ICdcdUNENUNcdUFERkMgXHVBQzE1XHVDNUYwJyxcbiAgaGVyb05leHRMZWN0dXJlTGFiZWw6ICdcdUIyRTRcdUM3NEMgXHVBQzE1XHVDNUYwJyxcbiAgaGVyb05leHRUb3VyTGFiZWw6ICdcdUIyRTRcdUM3NEMgXHVCMkY1XHVDMEFDJyxcbiAgaGVyb05vTGVjdHVyZVRleHQ6ICdcdUM2MDhcdUM4MTVcdUI0MUMgXHVBQzE1XHVDNUYwXHVDNzc0IFx1QzU0NFx1QzlDMSBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuJyxcbiAgaGVyb05vTGVjdHVyZUN0YTogJ1x1QzgwNFx1Q0NCNCBcdUFDMTVcdUM1RjAgXHVCQ0Y0XHVBRTMwIFx1MjE5MicsXG4gIGhlcm9Ob1RvdXJUZXh0OiAnXHVDNjA4XHVDODE1XHVCNDFDIFx1QjJGNVx1QzBBQ1x1QUMwMCBcdUM1NDRcdUM5QzEgXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LicsXG4gIGhlcm9Ob1RvdXJDdGE6ICdcdUM4MDRcdUNDQjQgXHVCMkY1XHVDMEFDIFx1QkNGNFx1QUUzMCBcdTIxOTInLFxuICB2ZW51ZUZhbGxiYWNrOiAnXHVDN0E1XHVDMThDIFx1QkJGOFx1QzgxNScsXG4gIGVtcHR5RmFsbGJhY2s6ICdcdTIwMTQnLFxuICBib29rRXllYnJvd1ByZWZpeDogJ1x1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNEOUNcdUQzMTAnLFxuICBib29rQnV5Q3RhOiAnXHVBRDZDXHVCOUU0XHVENTU4XHVBRTMwIFx1MjE5MicsXG4gIGJvb2tLckxhYmVsOiAnXHVBRDZEXHVCQjM4XHVEMzEwJyxcbiAgYm9va0VuTGFiZWw6ICdcdUM2MDFcdUJCMzhcdUQzMTAnLFxuICBib29rQXV0aG9yU3VmZml4OiAnXHVDOUMwXHVDNzRDJyxcbn07XG5cbmNvbnN0IGdldEhvbWVUZXh0ID0gKHNjKSA9PiAoeyAuLi5IT01FX1RFWFRfREVGQVVMVCwgLi4uKChzYyAmJiB0eXBlb2Ygc2MuaG9tZVRleHQgPT09ICdvYmplY3QnKSA/IHNjLmhvbWVUZXh0IDoge30pIH0pO1xuXG4vLyB2MDAuMTA2IFx1MjAxNCBcdUQ2NDggXHVENzg4XHVDNUI0XHVCODVDXHVDNzU4IFx1QzlDMFx1QjNDNCBcdUM3OTBcdUI5QUMuIFx1QjJFNFx1Qzc0QyBcdUFDMTVcdUM1RjAgKyBcdUIyRTRcdUM3NEMgXHVCMkY1XHVDMEFDIFx1QkJGOFx1QjJDOCBcdUNFNzRcdUI0REMuXG4vLyBcdUMwQUNcdUM2QTlcdUM3OTAgXHVDODFDXHVDNTQ4IEFcdUM1NDg6ICdcdUFDMTVcdUM1RjAvXHVCMkY1XHVDMEFDIFx1QkJGOFx1QjJDOCBcdUNFNzRcdUI0REMnIChcdUM2QjRcdUM2MDEgXHVBQzAwXHVDRTU4IFx1MjE5MSwgXHVDN0FDXHVCQzI5XHVCQjM4IFx1QUMwMFx1Q0U1OCBcdTIxOTEpLlxuY29uc3QgSGVyb1Byb2dyYW1DYXJkcyA9ICh7IGdvLCBkYXRhVGljaywgdGV4dCB9KSA9PiB7XG4gIC8vIHYwMC4xMTAgXHUyMDE0IG1vZHVsZS1zY29wZSBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjhcdUIyOTQgSG9tZVBhZ2UgXHVDNzU4IGBjb25zdCBHID0gd2luZG93LkJHTkpfR1VBUkQ7YCBcdUI5N0MgXHVDMEFDXHVDNkE5IFx1QkFCQiBcdUQ1NjguXG4gIC8vIHdpbmRvdy5CR05KX0dVQVJEIFx1Qjk3QyBcdUM5QzFcdUM4MTEgXHVDQzM4XHVDODcwICsgXHVDNTQ4XHVDODA0XHVENTVDIFx1RDNGNFx1QkMzMS5cbiAgY29uc3QgX2FyciA9IChmbikgPT4ge1xuICAgIHRyeSB7IGNvbnN0IHYgPSBmbigpOyByZXR1cm4gQXJyYXkuaXNBcnJheSh2KSA/IHYgOiBbXTsgfSBjYXRjaCB7IHJldHVybiBbXTsgfVxuICB9O1xuICAvLyB2MDAuMTE1IFx1MjAxNCBzdGFydHNBdCBcdUFDMDAgaW52YWxpZCBcdUQ1NUMgcm93IFx1QUMwMCBzb3J0IFx1QzVEMCBcdUI0RTRcdUM1QjRcdUFDMDBcdUJBNzQgXHVBQ0IwXHVBQ0ZDIFx1QzIxQ1x1QzExQ1x1QUMwMCBcdUM3ODRcdUM3NThcdUI4NUMgXHVBRTY4XHVDOUQwLlxuICAvLyBcdUQ1NUMgXHVCQzg4IFx1QjM1NCBEYXRlLnBhcnNlICFpc05hTiBcdUI4NUMgXHVBQzcwXHVCOTc4IFx1QjRBNCBzb3J0LlxuICBjb25zdCBfdmFsaWRTdGFydHMgPSAobCkgPT4ge1xuICAgIGlmICghbCB8fCBsLmhpZGRlbiB8fCAhbC5zdGFydHNBdCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiAhaXNOYU4oRGF0ZS5wYXJzZShsLnN0YXJ0c0F0KSk7XG4gIH07XG4gIC8vIHYwMC4xMjkgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM2OTRcdUNDQUQgJ1x1QzlDNFx1RDU4OSBcdUM2MDhcdUM4MTUgXHVBQzE1XHVDNUYwXHVDNzc0IFx1QzVDNlx1QzczQ1x1QkE3NCBcdUM5QzBcdUIwOUMgXHVBQzE1XHVDNUYwXHVDNzQ0IFx1QjE3OFx1Q0Q5QyAoM1x1QUMxQyBcdUM3NzRcdUIwQjQpJy5cbiAgLy8gMSkgXHVDNUI0XHVDODFDIFx1Qzc3NFx1RDZDNCBcdUFDMTVcdUM1RjAgXHVDNkIwXHVDMTIwLiAyKSBcdUM1QzZcdUM3M0NcdUJBNzQgXHVBQzAwXHVDN0E1IFx1Q0Q1Q1x1QURGQyBcdUM5QzBcdUIwOUMgXHVBQzE1XHVDNUYwIDNcdUFDMUNcdUI4NUMgXHVEM0Y0XHVCQzMxLlxuICBjb25zdCBsZWN0dXJlcyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGFsbCA9IF9hcnIoKCkgPT4gd2luZG93LkJHTkpfTEVDVFVSRVM/Lmxpc3RBbGw/LigpKVxuICAgICAgLmZpbHRlcihfdmFsaWRTdGFydHMpO1xuICAgIGNvbnN0IGN1dG9mZiA9IERhdGUubm93KCkgLSA4NjQwMDAwMDtcbiAgICBjb25zdCB1cGNvbWluZyA9IGFsbFxuICAgICAgLmZpbHRlcigobCkgPT4gbmV3IERhdGUobC5zdGFydHNBdCkuZ2V0VGltZSgpID49IGN1dG9mZilcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShhLnN0YXJ0c0F0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShiLnN0YXJ0c0F0KS5nZXRUaW1lKCkpO1xuICAgIGlmICh1cGNvbWluZy5sZW5ndGggPiAwKSByZXR1cm4gdXBjb21pbmc7XG4gICAgLy8gZmFsbGJhY2sgXHUyMDE0IFx1QUMwMFx1QzdBNSBcdUNENUNcdUFERkMgXHVDOUMwXHVCMDlDIFx1QUMxNVx1QzVGMCAzXHVBQzFDIChuZXdlc3QtZmlyc3QpLlxuICAgIHJldHVybiBhbGxcbiAgICAgIC5maWx0ZXIoKGwpID0+IG5ldyBEYXRlKGwuc3RhcnRzQXQpLmdldFRpbWUoKSA8IGN1dG9mZilcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShiLnN0YXJ0c0F0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShhLnN0YXJ0c0F0KS5nZXRUaW1lKCkpXG4gICAgICAuc2xpY2UoMCwgMyk7XG4gIH0sIFtkYXRhVGlja10pO1xuICBjb25zdCB0b3VycyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBfYXJyKCgpID0+IHdpbmRvdy5CR05KX1RPVVJTPy5saXN0QWxsPy4oKSlcbiAgICAgIC5maWx0ZXIoX3ZhbGlkU3RhcnRzKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGEuc3RhcnRzQXQpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGIuc3RhcnRzQXQpLmdldFRpbWUoKSlcbiAgICAgIC5maWx0ZXIoKHQpID0+IG5ldyBEYXRlKHQuc3RhcnRzQXQpLmdldFRpbWUoKSA+PSBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICB9LCBbZGF0YVRpY2tdKTtcblxuICBjb25zdCBuZXh0TGVjdHVyZSA9IGxlY3R1cmVzWzBdO1xuICBjb25zdCBuZXh0VG91ciA9IHRvdXJzWzBdO1xuICAvLyB2MDAuMTI5IFx1MjAxNCBcdUFDMTVcdUM1RjBcdUM3NzQgZmFsbGJhY2sgKFx1QzlDMFx1QjA5QyBcdUFDMTVcdUM1RjAgXHVCMTc4XHVDRDlDIFx1QkFBOFx1QjREQykgXHVDNzc4XHVDOUMwIFx1RDMxMFx1QzgxNS4gbmV4dExlY3R1cmUuc3RhcnRzQXQgXHVBQzAwIFx1QzVCNFx1QzgxQ1x1QkNGNFx1QjJFNCBcdUFDRkNcdUFDNzBcdUJBNzQgcGFzdCBtb2RlLlxuICBjb25zdCBsZWN0dXJlSXNQYXN0ID0gbmV4dExlY3R1cmUgJiYgbmV4dExlY3R1cmUuc3RhcnRzQXQgJiZcbiAgICAobmV3IERhdGUobmV4dExlY3R1cmUuc3RhcnRzQXQpLmdldFRpbWUoKSA8IERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG5cbiAgLy8gdjAwLjExMCBcdTIwMTQgXHVDMkRDXHVBQzA0IFx1RDQ1Q1x1QzJEQ1x1QjI5NCBcdUMwQUNcdUM3NzRcdUQyQjggXHVDODA0XHVCQzE4IEtTVCBcdUFFMzBcdUM5MDAuIEJHTkpfRk1ULmtzdEZyaWVuZGx5IFx1QzBBQ1x1QzZBOS5cbiAgY29uc3QgZm10RGF0ZSA9IChpc28pID0+IHtcbiAgICBpZiAoIWlzbykgcmV0dXJuICcnO1xuICAgIGlmICh3aW5kb3cuQkdOSl9GTVQ/LmtzdEZyaWVuZGx5KSByZXR1cm4gd2luZG93LkJHTkpfRk1ULmtzdEZyaWVuZGx5KGlzbyk7XG4gICAgLy8gXHVEM0Y0XHVCQzMxIChCR05KX0ZNVCBcdUJCRjhcdUI4NUNcdUI0REMgXHVDMkRDKVxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShpc28pO1xuICAgIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCBkb3cgPSBbJ1x1Qzc3QycsJ1x1QzZENCcsJ1x1RDY1NCcsJ1x1QzIxOCcsJ1x1QkFBOScsJ1x1QUUwOCcsJ1x1RDFBMCddW2QuZ2V0RGF5KCldO1xuICAgIHJldHVybiBgJHtkLmdldE1vbnRoKCkrMX0uJHtwYWQoZC5nZXREYXRlKCkpfSAoJHtkb3d9KSAke3BhZChkLmdldEhvdXJzKCkpfToke3BhZChkLmdldE1pbnV0ZXMoKSl9YDtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1wcm9ncmFtLXN0YWNrXCI+XG4gICAgICB7LyogXHVCMkU0XHVDNzRDIFx1QUMxNVx1QzVGMCBcdUNFNzRcdUI0REMgKi99XG4gICAgICA8YXJ0aWNsZVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IGlmIChuZXh0TGVjdHVyZSkgZ28oJ2xlY3R1cmVzJyk7IH19XG4gICAgICAgIGNsYXNzTmFtZT1cImhvbWUtcHJvZ3JhbS1jYXJkXCJcbiAgICAgICAgc3R5bGU9e3tjdXJzb3I6IG5leHRMZWN0dXJlID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnfX1cbiAgICAgICAgcm9sZT17bmV4dExlY3R1cmUgPyAnYnV0dG9uJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgdGFiSW5kZXg9e25leHRMZWN0dXJlID8gMCA6IHVuZGVmaW5lZH1cbiAgICAgICAgb25LZXlEb3duPXsoZSkgPT4geyBpZiAobmV4dExlY3R1cmUgJiYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpKSB7IGUucHJldmVudERlZmF1bHQoKTsgZ28oJ2xlY3R1cmVzJyk7IH0gfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1wcm9ncmFtLWxhYmVsXCI+XG4gICAgICAgICAge2xlY3R1cmVJc1Bhc3QgPyB0ZXh0Lmhlcm9SZWNlbnRMZWN0dXJlTGFiZWwgOiB0ZXh0Lmhlcm9OZXh0TGVjdHVyZUxhYmVsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge25leHRMZWN0dXJlID8gKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIwLCBtYXJnaW5Cb3R0b206OCwgY29sb3I6J3ZhcigtLWluayknfX0+e25leHRMZWN0dXJlLnRvcGljIHx8IG5leHRMZWN0dXJlLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonYmFzZWxpbmUnLCBmbGV4V3JhcDond3JhcCcsIGdhcDoxMH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NjAwfX0+e2ZtdERhdGUobmV4dExlY3R1cmUuc3RhcnRzQXQpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEyfX0+e25leHRMZWN0dXJlLnZlbnVlIHx8IHRleHQudmVudWVGYWxsYmFja308L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgbWFyZ2luOjB9fT5cbiAgICAgICAgICAgIHt0ZXh0Lmhlcm9Ob0xlY3R1cmVUZXh0fSA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3QgZ29sZFwiIG9uQ2xpY2s9eyhlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IGdvKCdsZWN0dXJlcycpOyB9fT57dGV4dC5oZXJvTm9MZWN0dXJlQ3RhfTwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgKX1cbiAgICAgIDwvYXJ0aWNsZT5cblxuICAgICAgey8qIFx1QjJFNFx1Qzc0QyBcdUIyRjVcdUMwQUMgXHVDRTc0XHVCNERDICovfVxuICAgICAgPGFydGljbGVcbiAgICAgICAgb25DbGljaz17KCkgPT4geyBpZiAobmV4dFRvdXIpIGdvKCd0b3VyJyk7IH19XG4gICAgICAgIGNsYXNzTmFtZT1cImhvbWUtcHJvZ3JhbS1jYXJkXCJcbiAgICAgICAgc3R5bGU9e3tjdXJzb3I6IG5leHRUb3VyID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnfX1cbiAgICAgICAgcm9sZT17bmV4dFRvdXIgPyAnYnV0dG9uJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgdGFiSW5kZXg9e25leHRUb3VyID8gMCA6IHVuZGVmaW5lZH1cbiAgICAgICAgb25LZXlEb3duPXsoZSkgPT4geyBpZiAobmV4dFRvdXIgJiYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpKSB7IGUucHJldmVudERlZmF1bHQoKTsgZ28oJ3RvdXInKTsgfSB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLXByb2dyYW0tbGFiZWxcIj5cbiAgICAgICAgICB7dGV4dC5oZXJvTmV4dFRvdXJMYWJlbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtuZXh0VG91ciA/IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMCwgbWFyZ2luQm90dG9tOjgsIGNvbG9yOid2YXIoLS1pbmspJ319PntuZXh0VG91ci50aXRsZX08L2gzPlxuICAgICAgICAgICAge25leHRUb3VyLnN1YnRpdGxlICYmIChcbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBtYXJnaW5Cb3R0b206OCwgZm9udFN0eWxlOidpdGFsaWMnfX0+e25leHRUb3VyLnN1YnRpdGxlfTwvcD5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonYmFzZWxpbmUnLCBmbGV4V3JhcDond3JhcCcsIGdhcDoxMH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NjAwfX0+e2ZtdERhdGUobmV4dFRvdXIuc3RhcnRzQXQpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEyfX0+XG4gICAgICAgICAgICAgICAge25leHRUb3VyLmxldmVsICYmIDxzcGFuIHN0eWxlPXt7bWFyZ2luUmlnaHQ6OH19PntuZXh0VG91ci5sZXZlbH08L3NwYW4+fVxuICAgICAgICAgICAgICAgIHtuZXh0VG91ci5kdXJhdGlvbn1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIG1hcmdpbjowfX0+XG4gICAgICAgICAgICB7dGV4dC5oZXJvTm9Ub3VyVGV4dH0gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0IGdvbGRcIiBvbkNsaWNrPXsoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBnbygndG91cicpOyB9fT57dGV4dC5oZXJvTm9Ub3VyQ3RhfTwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgKX1cbiAgICAgIDwvYXJ0aWNsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIHYwMC4xNTIgXHUyMDE0IFx1RDY0OCBcdUNDNDUgQ1RBIFx1QjJFNFx1QUQ4QyBcdUNFNzRcdUI4RThcdUMxNDAuIHYwMC4xNTEgXHVCMkU4XHVDNzdDLVx1Q0M0NSBJSUZFIFx1Qjk3QyBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjhcdUQ2NTQgKyBcdUM4OENcdUM2QjAgXHVCQjM0XHVENTVDIHdyYXAgKyBhdXRvcGxheS5cbi8vIFx1QjM3MFx1Qzc3NFx1RDEzMCBcdUMxOENcdUMyQTQ6IEJHTkpfQk9PS1MubGlzdCh7c3RhdHVzOidwdWJsaXNoZWQnfSkuIFx1QzgxNVx1QjgyQzogcHJpbWFyeSBcdUM2QjBcdUMxMjAgXHUyMTkyIG9yZGVyLiAwXHVBRDhDXHVDNzc0XHVCQTc0IFx1QzEzOVx1QzE1OCBoaWRlLlxuY29uc3QgQm9va0Nhcm91c2VsU2VjdGlvbiA9ICh7IGdvLCBkYXRhVGljaywgdGV4dCB9KSA9PiB7XG4gIGNvbnN0IF9hcnIgPSAoZm4pID0+IHsgdHJ5IHsgY29uc3QgdiA9IGZuKCk7IHJldHVybiBBcnJheS5pc0FycmF5KHYpID8gdiA6IFtdOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH07XG4gIC8vIGFkbWluIFx1Qzc1OCBcdUNDNDUgXHVCQ0MwXHVBQ0JEXHVDNzQ0IFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2OCBcdUM1QzZcdUM3NzQgXHVDOTg5XHVDMkRDIFx1QkMxOFx1QzYwMS4gZGF0YVRpY2sgKyBiZ25qLWJvb2tzLXJlZnJlc2ggXHVCNDU4IFx1QjJFNCBcdUNDQURcdUNERTguXG4gIGNvbnN0IFtib29rVGljaywgc2V0Qm9va1RpY2tdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25SID0gKCkgPT4gc2V0Qm9va1RpY2soKHYpID0+IHYgKyAxKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1ib29rcy1yZWZyZXNoJywgb25SKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotYm9va3MtcmVmcmVzaCcsIG9uUik7XG4gIH0sIFtdKTtcbiAgY29uc3QgYm9va3MgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBhbGwgPSBfYXJyKCgpID0+IHdpbmRvdy5CR05KX0JPT0tTPy5saXN0Py4oeyBzdGF0dXM6ICdwdWJsaXNoZWQnIH0pKTtcbiAgICByZXR1cm4gYWxsLnNsaWNlKCkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEucHJpbWFyeSAmJiAhYi5wcmltYXJ5KSByZXR1cm4gLTE7XG4gICAgICBpZiAoIWEucHJpbWFyeSAmJiBiLnByaW1hcnkpIHJldHVybiAxO1xuICAgICAgcmV0dXJuIChhLm9yZGVyID8/IDApIC0gKGIub3JkZXIgPz8gMCk7XG4gICAgfSk7XG4gIH0sIFtkYXRhVGljaywgYm9va1RpY2tdKTtcblxuICBjb25zdCBbaWR4LCBzZXRJZHhdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtwYXVzZWQsIHNldFBhdXNlZF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIC8vIFx1Q0M0NSBcdUJBQTlcdUI4NUQgXHVBRTM4XHVDNzc0IFx1QkNDMFx1QjNEOSBcdUMyREMgaWR4IFx1QzdBQ1x1QzgxNVx1QjgyQy5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYm9va3MubGVuZ3RoID4gMCAmJiBpZHggPj0gYm9va3MubGVuZ3RoKSBzZXRJZHgoMCk7XG4gIH0sIFtib29rcy5sZW5ndGgsIGlkeF0pO1xuXG4gIGNvbnN0IHdyYXAgPSAobikgPT4gYm9va3MubGVuZ3RoID09PSAwID8gMCA6IChuICsgYm9va3MubGVuZ3RoKSAlIGJvb2tzLmxlbmd0aDtcbiAgY29uc3QgZ29QcmV2ID0gKCkgPT4gc2V0SWR4KChpKSA9PiB3cmFwKGkgLSAxKSk7XG4gIGNvbnN0IGdvTmV4dCA9ICgpID0+IHNldElkeCgoaSkgPT4gd3JhcChpICsgMSkpO1xuXG4gIC8vIGF1dG9wbGF5IDdzIFx1MjAxNCAyXHVBRDhDIFx1Qzc3NFx1QzBDMSArIGhvdmVyIFx1QzgxNVx1QzlDMCBcdUM1NDRcdUIyRDAgXHVCNTRDXHVCOUNDLlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChib29rcy5sZW5ndGggPCAyIHx8IHBhdXNlZCkgcmV0dXJuO1xuICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHNldElkeCgoaSkgPT4gd3JhcChpICsgMSkpLCA3MDAwKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHQpO1xuICB9LCBbaWR4LCBib29rcy5sZW5ndGgsIHBhdXNlZF0pO1xuXG4gIGlmIChib29rcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICBjb25zdCBzaG93Q2hyb21lID0gYm9va3MubGVuZ3RoID4gMTtcblxuICAvLyB2MDAuMTYyIFx1MjAxNCBcdUIyRThcdUM3N0MgXHVDQzQ1IFx1Q0U3NFx1QjREQyBcdUI4MENcdUIzNTQgKHNsaWRlIGxheWVyIFx1QzU0OFx1QzVEMFx1QzExQyBcdUQ2MzhcdUNEOUMpLlxuICBjb25zdCByZW5kZXJCb29rQ2FyZCA9IChiKSA9PiB7XG4gICAgY29uc3QgaGFzUHJpY2VLUiA9IE51bWJlcihiLnByaWNlS1IpID4gMDtcbiAgICBjb25zdCBoYXNQcmljZUVOID0gTnVtYmVyKGIucHJpY2VFTikgPiAwO1xuICAgIGNvbnN0IHlyID0gYi5wdWJsaXNoZWRBdCA/IG5ldyBEYXRlKGIucHVibGlzaGVkQXQpLmdldEZ1bGxZZWFyKCkgOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBjdGEtZ3JpZFwiIHN0eWxlPXt7XG4gICAgICAgIHBhZGRpbmc6Jzk2cHggODBweCcsXG4gICAgICAgIGRpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxZnIgMWZyJywgZ2FwOjgwLCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCI+e3RleHQuYm9va0V5ZWJyb3dQcmVmaXh9IFx1MDBCNyB7eXJ9PC9kaXY+XG4gICAgICAgICAgPGgyIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LXNlcmlmKScsIGZvbnRTaXplOidjbGFtcCgzNnB4LCA0dncsIDUycHgpJyxcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6NjAwLCBsaW5lSGVpZ2h0OjEuMSwgbWFyZ2luQm90dG9tOiBiLnN1YnRpdGxlID8gOCA6IDE2LFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgXHUzMDBFe2IudGl0bGV9XHUzMDBGXG4gICAgICAgICAgPC9oMj5cbiAgICAgICAgICB7LyogdjAwLjE2MiBcdTIwMTQgXHVENTVDIFx1QzkwNCBcdUMxOENcdUFDMUMgKHN1YnRpdGxlKS4gXHVDMEFDXHVDNkE5XHVDNzkwIFx1QzY5NFx1Q0NBRCAnXHVENTVDXHVDOTA0XHVDMThDXHVBQzFDXHVBQzAwIFx1QkNGNFx1Qzc3NFx1QUM4QycuICovfVxuICAgICAgICAgIHtiLnN1YnRpdGxlICYmIChcbiAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MTgsIGZvbnRTdHlsZTonaXRhbGljJyxcbiAgICAgICAgICAgICAgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyMCwgbGluZUhlaWdodDoxLjUsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2Iuc3VidGl0bGV9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7Yi5kZXNjICYmIChcbiAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6MTUsIGxpbmVIZWlnaHQ6MS44NSwgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyOCwgd2hpdGVTcGFjZToncHJlLXdyYXAnfX0+XG4gICAgICAgICAgICAgIHtiLmRlc2N9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7KGhhc1ByaWNlS1IgfHwgaGFzUHJpY2VFTikgJiYgKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MjAsIG1hcmdpbkJvdHRvbTozMiwgYWxpZ25JdGVtczonZmxleC1lbmQnfX0+XG4gICAgICAgICAgICAgIHtoYXNQcmljZUtSICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgZm9udFdlaWdodDo2MDAsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIGNvbG9yOid2YXIoLS1pbmstMyknfX0+e3RleHQuYm9va0tyTGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMiwgbWFyZ2luVG9wOjQsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo3MDB9fT57TnVtYmVyKGIucHJpY2VLUikudG9Mb2NhbGVTdHJpbmcoKX1cdUM2RDA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAge2hhc1ByaWNlS1IgJiYgaGFzUHJpY2VFTiAmJiA8ZGl2IHN0eWxlPXt7d2lkdGg6MSwgYmFja2dyb3VuZDondmFyKC0tbGluZS0yKScsIGFsaWduU2VsZjonc3RyZXRjaCd9fS8+fVxuICAgICAgICAgICAgICB7aGFzUHJpY2VFTiAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBjb2xvcjondmFyKC0taW5rLTMpJ319Pnt0ZXh0LmJvb2tFbkxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjIsIG1hcmdpblRvcDo0LCBjb2xvcjondmFyKC0taW5rKScsIGZvbnRXZWlnaHQ6NzAwfX0+e051bWJlcihiLnByaWNlRU4pLnRvTG9jYWxlU3RyaW5nKCl9XHVDNkQwPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkXCIgb25DbGljaz17KCkgPT4gZ28oJ2Jvb2snKX0+e3RleHQuYm9va0J1eUN0YX08L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBhc3BlY3RSYXRpbzonMy80JywgbWF4V2lkdGg6MjgwLCBtYXJnaW46JzAgYXV0bycsXG4gICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsXG4gICAgICAgICAgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIG92ZXJmbG93OidoaWRkZW4nLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7Yi5jb3ZlckRhdGFVcmkgPyAoXG4gICAgICAgICAgICA8aW1nIHNyYz17Yi5jb3ZlckRhdGFVcml9IGFsdD17YCR7Yi50aXRsZX0gXHVENDVDXHVDOUMwYH1cbiAgICAgICAgICAgICAgc3R5bGU9e3t3aWR0aDonMTAwJScsIGhlaWdodDonMTAwJScsIG9iamVjdEZpdDonY292ZXInLCBkaXNwbGF5OidibG9jayd9fS8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3t0ZXh0QWxpZ246J2NlbnRlcicsIHBhZGRpbmc6JzAgMjRweCd9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MjgsIGNvbG9yOid2YXIoLS1pbmspJywgbWFyZ2luQm90dG9tOjEwLCBmb250V2VpZ2h0OjYwMH19PntiLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjksIGZvbnRXZWlnaHQ6NjAwLCBjb2xvcjondmFyKC0taW5rLTMpJywgbGV0dGVyU3BhY2luZzonMC4yZW0nfX0+e2IuYXV0aG9yIHx8ICdcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAnfSB7dGV4dC5ib29rQXV0aG9yU3VmZml4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUNDNDUgQ1RBXCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwic2VjdGlvbiBzZWN0aW9uLS1hbmNob3JcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldFBhdXNlZCh0cnVlKX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldFBhdXNlZChmYWxzZSl9XG4gICAgICAgICAgc3R5bGU9e3twb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICAgICAgey8qIHYwMC4xNjIgXHUyMDE0IFx1QzJBQ1x1Qjc3Q1x1Qzc3NFx1QjREQyBcdUI4MDhcdUM3NzRcdUM1QjQuIFx1QkFBOFx1QjRFMCBib29rcyBcdUI5N0MgbGF5ZXJlZCBcdUI4NUMgXHVCODBDXHVCMzU0LCBhY3RpdmUgXHVCOUNDIG9wYWNpdHkgMSArIHRyYW5zbGF0ZVggMC5cbiAgICAgICAgICAgICAganVtcCBcdUM1QzZcdUIyOTQgXHVCRDgwXHVCNERDXHVCN0VDXHVDNkI0IGNyb3NzZmFkZS1zbGlkZS4gXHVDQ0FCIFx1Q0M0NVx1QjlDQyByZWxhdGl2ZSBcdUI4NUMgd3JhcHBlciBcdUIxOTJcdUM3NzQgXHVCQ0Y0XHVDODc0LiAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246J3JlbGF0aXZlJ319PlxuICAgICAgICAgICAge2Jvb2tzLm1hcCgoYiwgaSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBhY3RpdmUgPSBpID09PSBpZHg7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e2IuaWQgfHwgaX1cbiAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPXthY3RpdmUgPyB1bmRlZmluZWQgOiAndHJ1ZSd9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogaSA9PT0gMCA/ICdyZWxhdGl2ZScgOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBhY3RpdmUgPyAxIDogMCxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBhY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgICA/ICd0cmFuc2xhdGVYKDApJ1xuICAgICAgICAgICAgICAgICAgICAgIDogKGkgPCBpZHggPyAndHJhbnNsYXRlWCgtMjRweCknIDogJ3RyYW5zbGF0ZVgoMjRweCknKSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgLjU1cyBlYXNlLCB0cmFuc2Zvcm0gLjU1cyBlYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogYWN0aXZlID8gJ2F1dG8nIDogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICB7cmVuZGVyQm9va0NhcmQoYil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHtzaG93Q2hyb21lICYmIChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtbGFiZWw9XCJcdUM3NzRcdUM4MDQgXHVDQzQ1XCIgb25DbGljaz17Z29QcmV2fVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCBsZWZ0Oi04LCB0b3A6JzUwJScsIHRyYW5zZm9ybTondHJhbnNsYXRlKC0xMDAlLCAtNTAlKScsXG4gICAgICAgICAgICAgICAgICB3aWR0aDo0NCwgaGVpZ2h0OjQ0LCBib3JkZXJSYWRpdXM6JzUwJScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGNvbG9yOid2YXIoLS1pbmspJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBwbGFjZUl0ZW1zOidjZW50ZXInLCBmb250U2l6ZToyMiwgZm9udFdlaWdodDo2MDAsIGxpbmVIZWlnaHQ6MSxcbiAgICAgICAgICAgICAgICB9fT5cdTIwMzk8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1sYWJlbD1cIlx1QjJFNFx1Qzc0QyBcdUNDNDVcIiBvbkNsaWNrPXtnb05leHR9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHJpZ2h0Oi04LCB0b3A6JzUwJScsIHRyYW5zZm9ybTondHJhbnNsYXRlKDEwMCUsIC01MCUpJyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOjQ0LCBoZWlnaHQ6NDQsIGJvcmRlclJhZGl1czonNTAlJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgY29sb3I6J3ZhcigtLWluayknLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIGZvbnRTaXplOjIyLCBmb250V2VpZ2h0OjYwMCwgbGluZUhlaWdodDoxLFxuICAgICAgICAgICAgICAgIH19Plx1MjAzQTwvYnV0dG9uPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge3Nob3dDaHJvbWUgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J2NlbnRlcicsIGdhcDo4LCBtYXJnaW5Ub3A6MTh9fT5cbiAgICAgICAgICAgIHtib29rcy5tYXAoKGIsIGkpID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2IuaWQgfHwgaX0gdHlwZT1cImJ1dHRvblwiIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODhcdUM5RjggXHVDQzQ1XHVDNzNDXHVCODVDIFx1Qzc3NFx1QjNEOWB9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SWR4KGkpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICB3aWR0aDogaSA9PT0gaWR4ID8gMjQgOiA4LCBoZWlnaHQ6IDgsIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDQsIGJvcmRlcjogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGkgPT09IGlkeCA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0tbGluZS0yKScsXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuMnMnLFxuICAgICAgICAgICAgICAgIH19Lz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgKTtcbn07XG5cbmNvbnN0IEhvbWVQYWdlID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBbbWFwT3Blbiwgc2V0TWFwT3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzY1RpY2ssIHNldFNjVGlja10gPSBSZWFjdC51c2VTdGF0ZSgwKTtcbiAgY29uc3QgW2RhdGFUaWNrLCBzZXREYXRhVGlja10gPSBSZWFjdC51c2VTdGF0ZSgwKTtcblxuICAvLyBTRU8vSGVyby9CcmFuZCByZWZyZXNoIFx1MjAxNCBcdUM5ODlcdUMyREMgXHVDN0FDXHVCODBDXHVCMzU0XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25SID0gKCkgPT4gc2V0U2NUaWNrKCh2KSA9PiB2ICsgMSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Jnbmotc2l0ZS1jb250ZW50LXJlZnJlc2gnLCBvblIpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmduai1zaXRlLWNvbnRlbnQtcmVmcmVzaCcsIG9uUik7XG4gIH0sIFtdKTtcblxuICAvLyBcdUMxMUNcdUJDODQgXHVCMzcwXHVDNzc0XHVEMTMwIHJlZnJlc2ggXHVDNzc0XHVCQ0E0XHVEMkI4IFx1MjAxNCBcdUMyRTRcdUM4MUMgXHVCQzFDXHVENjU0IFx1Qzc3NFx1Qjk4NFx1QUNGQyBcdUM3N0NcdUNFNTggKGRhdGEuanMgXHVDQzM4XHVBQ0UwKS5cbiAgLy8gYmduai1wb3N0cy1yZWZyZXNoOiBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVBQzhDXHVDMkRDXHVBRTAwIC8gYmduai1jb2x1bW5zLXJlZnJlc2g6IFx1Q0U3Q1x1QjdGQyAvIGJnbmotdG91cnMtcmVmcmVzaDogXHVCMkY1XHVDMEFDIC8gYmduai1sZWN0dXJlcy1yZWZyZXNoOiBcdUFDMTVcdUM1RjAgLyBiZ25qLXNpdGUtY29udGVudC1yZWZyZXNoOiBcdUNEOTRcdUNDOUMoXHVDNzc0XHVCQkY4IFx1QzcwNFx1QzVEMFx1QzExQyBsaXN0ZW4pXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgdGljayA9ICgpID0+IHNldERhdGFUaWNrKCh2KSA9PiB2ICsgMSk7XG4gICAgY29uc3QgZXZ0cyA9IFsnYmduai1jb2x1bW5zLXJlZnJlc2gnLCAnYmduai10b3Vycy1yZWZyZXNoJywgJ2JnbmotbGVjdHVyZXMtcmVmcmVzaCcsICdiZ25qLXBvc3RzLXJlZnJlc2gnXTtcbiAgICBldnRzLmZvckVhY2goKGUpID0+IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGUsIHRpY2spKTtcbiAgICByZXR1cm4gKCkgPT4gZXZ0cy5mb3JFYWNoKChlKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLCB0aWNrKSk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBzYyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gKHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fSksIFtzY1RpY2tdKTtcbiAgY29uc3QgaGVybyA9IHNjLmhlcm8gfHwge307XG4gIGNvbnN0IGhvbWVUZXh0ID0gUmVhY3QudXNlTWVtbygoKSA9PiBnZXRIb21lVGV4dChzYyksIFtzY10pO1xuICAvLyBcdUJBQThcdUJDMTRcdUM3N0MgXHVCRDg0XHVBRTMwIFx1MjAxNCBtYXRjaE1lZGlhIFx1QkNDMFx1QUNCRCBcdUMyREMgXHVDNzkwXHVCM0Q5IFx1QzdBQ1x1QjgwQ1x1QjM1NCAoaGVyb1N0eWxlIFx1QjNDNCBcdUFDMzFcdUMyRTApLlxuICBjb25zdCBbaXNNb2JpbGUsIHNldElzTW9iaWxlXSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+IHtcbiAgICB0cnkgeyByZXR1cm4gISEod2luZG93Lm1hdGNoTWVkaWEgJiYgd2luZG93Lm1hdGNoTWVkaWEoJyhtYXgtd2lkdGg6IDYwMHB4KScpLm1hdGNoZXMpOyB9IGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH0pO1xuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBtcSA9IHdpbmRvdy5tYXRjaE1lZGlhKCcobWF4LXdpZHRoOiA2MDBweCknKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSAoZSkgPT4gc2V0SXNNb2JpbGUoZS5tYXRjaGVzKTtcbiAgICAgIGlmIChtcS5hZGRFdmVudExpc3RlbmVyKSBtcS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoYW5kbGVyKTtcbiAgICAgIGVsc2UgaWYgKG1xLmFkZExpc3RlbmVyKSBtcS5hZGRMaXN0ZW5lcihoYW5kbGVyKTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChtcS5yZW1vdmVFdmVudExpc3RlbmVyKSBtcS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoYW5kbGVyKTtcbiAgICAgICAgZWxzZSBpZiAobXEucmVtb3ZlTGlzdGVuZXIpIG1xLnJlbW92ZUxpc3RlbmVyKGhhbmRsZXIpO1xuICAgICAgfTtcbiAgICB9IGNhdGNoIHt9XG4gIH0sIFtdKTtcbiAgY29uc3QgaGVyb1N0eWxlID0gUmVhY3QudXNlTWVtbyhcbiAgICAoKSA9PiAod2luZG93LkJHTkpfSEVST19TVFlMRT8uKGlzTW9iaWxlID8gJ21vYmlsZScgOiAnZGVza3RvcCcpIHx8IHdpbmRvdy5CR05KX0hFUk9fU1RZTEVfREVGQVVMVCksXG4gICAgW3NjVGljaywgaXNNb2JpbGVdXG4gICk7XG4gIGNvbnN0IHJlY29tbWVuZGF0aW9ucyA9IEFycmF5LmlzQXJyYXkoc2MucmVjb21tZW5kYXRpb25zKSA/IHNjLnJlY29tbWVuZGF0aW9ucy5maWx0ZXIoQm9vbGVhbikgOiBbXTtcbiAgY29uc3QgW3JlY0RldGFpbCwgc2V0UmVjRGV0YWlsXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuXG4gIC8vIFx1QzJFNFx1QjM3MFx1Qzc3NFx1RDEzMFx1QjlDQyBcdTIwMTQgXHVDMkRDXHVCNERDIFx1RDNGNFx1QkMzMSBcdUM4MUNcdUFDNzAuIFx1QkFBOFx1QjRFMCBcdUQ1RUNcdUQzN0MgXHVENjM4XHVDRDlDXHVDNzQwIEJHTkpfR1VBUkQuYXJyIFx1Qjg1QyB0cnkvY2F0Y2ggKyBBcnJheSBcdUFDMDBcdUI0REMuXG4gIC8vIHYwMC4xMTUgXHUyMDE0IEJHTkpfR1VBUkQgXHVCQkY4XHVCODVDXHVCNERDIChzY3JpcHQgXHVCODVDXHVCNERDIHJhY2UpIFx1QzJEQyBcdUM3NzhcdUI3N0NcdUM3NzggZmFsbGJhY2sgXHVDNzNDXHVCODVDIFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUFFNjhcdUM5RDAgXHVCQzI5XHVDOUMwLlxuICBjb25zdCBHID0gd2luZG93LkJHTkpfR1VBUkQgfHwge1xuICAgIGFycjogKGZuKSA9PiB7IHRyeSB7IGNvbnN0IHYgPSBmbigpOyByZXR1cm4gQXJyYXkuaXNBcnJheSh2KSA/IHYgOiBbXTsgfSBjYXRjaCB7IHJldHVybiBbXTsgfSB9LFxuICAgIGNhbGw6IChmbiwgZmIpID0+IHsgdHJ5IHsgY29uc3QgdiA9IGZuKCk7IHJldHVybiB2ID09PSB1bmRlZmluZWQgPyBmYiA6IHY7IH0gY2F0Y2ggeyByZXR1cm4gZmI7IH0gfSxcbiAgfTtcbiAgLy8gXHVDNzIwXHVENkE4XHVENTVDIHN0YXJ0c0F0KFx1RDMwQ1x1QzJGMSBcdUFDMDBcdUIyQTVcdUQ1NUMgXHVCMEEwXHVDOURDKSBcdUI5Q0MgXHVEMUI1XHVBQ0ZDIFx1MjAxNCBOYU4gZ2V0VGltZSBcdUM3M0NcdUI4NUMgc29ydCBcdUFDQjBcdUFDRkNcdUFDMDAgXHVBRTY4XHVDOUMwXHVCMjk0IFx1QUM4MyBcdUJDMjlcdUM5QzAuXG4gIGNvbnN0IF9oYXNWYWxpZERhdGUgPSAoaXNvKSA9PiB7XG4gICAgaWYgKCFpc28pIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCB0ID0gRGF0ZS5wYXJzZShpc28pO1xuICAgIHJldHVybiAhaXNOYU4odCk7XG4gIH07XG4gIGNvbnN0IHB1YmxpY0NvbHVtbnMgPSBSZWFjdC51c2VNZW1vKCgpID0+IEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0NPTFVNTlM/Lmxpc3RQdWJsaWM/LigpKSwgW2RhdGFUaWNrXSk7XG4gIGNvbnN0IGZlYXR1cmVkQ29sdW1uID0gcHVibGljQ29sdW1uc1swXTtcbiAgY29uc3Qgc2Vjb25kYXJ5Q29sdW1ucyA9IHB1YmxpY0NvbHVtbnMuc2xpY2UoMSwgNSk7XG4gIGNvbnN0IHJlY2VudFBvc3RzID0gUmVhY3QudXNlTWVtbygoKSA9PiBHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9DT01NVU5JVFk/Lmxpc3RQb3N0cz8uKCkpLnNsaWNlKDAsIDQpLCBbZGF0YVRpY2tdKTtcbiAgY29uc3QgdG91cnMgPSBSZWFjdC51c2VNZW1vKCgpID0+IEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX1RPVVJTPy5saXN0QWxsPy4oKSkuZmlsdGVyKCh0KSA9PiB0ICYmICF0LmhpZGRlbikuc2xpY2UoMCwgNCksIFtkYXRhVGlja10pO1xuICBjb25zdCBsZWN0dXJlcyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfTEVDVFVSRVM/Lmxpc3RBbGw/LigpKS5maWx0ZXIoKGwpID0+IGwgJiYgIWwuaGlkZGVuKS5zbGljZSgwLCAzKSwgW2RhdGFUaWNrXSk7XG5cbiAgLy8gaGVyby5zdGF0cyBcdUFDMDAgXHVDNzg4XHVDNzNDXHVCQTc0IFx1Q0Y1OFx1RDE1MFx1Q0UyMChsYWJlbC9zdWIvdmFsdWVGYWxsYmFjaykgXHVCOTdDIFx1QUM3MFx1QUUzMFx1QzExQy4gXHVCM0Q5XHVDODAxIHZhbHVlKFx1RDIyQ1x1QzVCNC9cdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVBQzJGXHVDMjE4KSBcdUIyOTQgXHVDRjU0XHVCNERDIFx1Q0UyMSBcdUM2QjBcdUMxMjAuXG4gIGNvbnN0IGhlcm9TdGF0cyA9IEFycmF5LmlzQXJyYXkoaGVyby5zdGF0cykgJiYgaGVyby5zdGF0cy5sZW5ndGggPT09IDMgPyBoZXJvLnN0YXRzIDogW1xuICAgIHsgbGFiZWw6ICdcdUM1RUNcdUQ1ODlcdUM5QzAnLCAgIHN1YjogJ1x1QzhGQ1x1QzY5NCBcdUIyRjVcdUMwQUNcdUM5QzAgXHVDNkI0XHVDNjAxJywgICB2YWx1ZUZhbGxiYWNrOiAnXHVDODA0XHVBRDZEJyAgICB9LFxuICAgIHsgbGFiZWw6ICdcdUQyMkNcdUM1QjQnLCAgICAgc3ViOiAnXHVDOUMxXHVDODExIFx1QUUzMFx1RDY4RCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QTgnLCB2YWx1ZUZhbGxiYWNrOiAnXHVDOTAwXHVCRTQ0IFx1QzkxMScgfSxcbiAgICB7IGxhYmVsOiAnXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwJywgc3ViOiAnXHVENTY4XHVBRUQ4IFx1QjlDQ1x1QjREQ1x1QjI5NCBcdUM1RUNcdUQ1ODknLCAgIHZhbHVlRmFsbGJhY2s6ICdcdUM2QjRcdUM2MDEgXHVDOTExJyB9LFxuICBdO1xuICBjb25zdCBzdGF0cyA9IFtcbiAgICB7IGw6IGhlcm9TdGF0c1swXS5sYWJlbCwgdjogaGVyb1N0YXRzWzBdLnZhbHVlRmFsbGJhY2sgfHwgJ1x1QzgwNFx1QUQ2RCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzOiBoZXJvU3RhdHNbMF0uc3ViIH0sXG4gICAgeyBsOiBoZXJvU3RhdHNbMV0ubGFiZWwsIHY6IHRvdXJzLmxlbmd0aCA+IDAgPyBgJHt0b3Vycy5sZW5ndGh9XHVBQzFDYCA6IChoZXJvU3RhdHNbMV0udmFsdWVGYWxsYmFjayB8fCAnXHVDOTAwXHVCRTQ0IFx1QzkxMScpLCAgICAgczogaGVyb1N0YXRzWzFdLnN1YiB9LFxuICAgIHsgbDogaGVyb1N0YXRzWzJdLmxhYmVsLCB2OiByZWNlbnRQb3N0cy5sZW5ndGggPiAwID8gYCR7cmVjZW50UG9zdHMubGVuZ3RofStgIDogKGhlcm9TdGF0c1syXS52YWx1ZUZhbGxiYWNrIHx8ICdcdUM2QjRcdUM2MDEgXHVDOTExJyksIHM6IGhlcm9TdGF0c1syXS5zdWIgfSxcbiAgXTtcblxuICBjb25zdCBjbGlja2FibGUgPSAob25DbGljaywgbGFiZWwpID0+ICh7XG4gICAgcm9sZTonYnV0dG9uJywgdGFiSW5kZXg6MCwgJ2FyaWEtbGFiZWwnOmxhYmVsLCBvbkNsaWNrLFxuICAgIG9uS2V5RG93bjooZSkgPT4geyBpZiAoZS5rZXk9PT0nRW50ZXInfHxlLmtleT09PScgJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IG9uQ2xpY2soKTsgfSB9LFxuICAgIHN0eWxlOntjdXJzb3I6J3BvaW50ZXInfSxcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhvbWUtcGFnZVwiPlxuICAgICAge21hcE9wZW4gJiYgPERlc3RpbmF0aW9uTWFwTW9kYWwgb25DbG9zZT17KCkgPT4gc2V0TWFwT3BlbihmYWxzZSl9IGdvPXtnb30vPn1cbiAgICAgIHtyZWNEZXRhaWwgJiYgPFJlY29tbWVuZGF0aW9uRGV0YWlsTW9kYWwgcmVjPXtyZWNEZXRhaWx9IG9uQ2xvc2U9eygpID0+IHNldFJlY0RldGFpbChudWxsKX0gZ289e2dvfS8+fVxuXG4gICAgICB7LyogdjAwLjE0MyBcdTIwMTQgXHVDNjI0XHVENTA4IFx1QzU0OFx1QjBCNCBcdUJDMzBcdUIxMDhcdUIyOTQgYm9vdC5qc3ggXHVCODVDIFx1Qzc3NFx1QjNEOSAoc2l0ZXdpZGUsIFx1QkE1NFx1QjI3NCBcdUM3MDRcdUNBQkQpLiAqL31cblxuICAgICAgey8qIFx1MjUwMFx1MjUwMCBIRVJPIChcdUQxNERcdUMyQTRcdUQyQjggKyBcdUM2QjBcdUNFMjEgXHVDOUMwXHVCM0M0IFx1QkJGOFx1QjlBQ1x1QkNGNFx1QUUzMCwgXHVCQUE4XHVCQzE0XHVDNzdDIDFcdUIyRTgpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIDxIb21lU2VjdGlvbkJvdW5kYXJ5IGxhYmVsPVwiXHVENzg4XHVDNUI0XHVCODVDXCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwiaG9tZS1oZXJvXCIgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246J3JlbGF0aXZlJywgb3ZlcmZsb3c6J2hpZGRlbicsXG4gICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgcGFkZGluZzonNzJweCAwIDg4cHgnLFxuICAgICAgfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZXJvLWdyaWQgaG9tZS1oZXJvLWdyaWRcIiBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTonZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6JzEuMmZyIDFmcicsIGdhcDo1NiwgYWxpZ25JdGVtczonY2VudGVyJyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHsvKiBcdUM4OENcdUNFMjE6IFx1RDE0RFx1QzJBNFx1RDJCOCBcdTIwMTQgaGVyb1N0eWxlIFx1RDJCOFx1QzcxNyhcdUFEMDBcdUI5QUNcdUM3OTAgJ1x1RDc4OFx1QzVCNFx1Qjg1QycgXHVEMEVEKSBcdUM3NzhcdUI3N0NcdUM3NzggXHVDODAxXHVDNkE5ICovfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e3RleHRBbGlnbjogaGVyb1N0eWxlLnRpdGxlLnRleHRBbGlnbiB8fCAnbGVmdCd9fT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRTaXplOiBoZXJvU3R5bGUuZXllYnJvdy5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBoZXJvU3R5bGUuZXllYnJvdy5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IGAke2hlcm9TdHlsZS5leWVicm93LmxldHRlclNwYWNpbmd9ZW1gLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBgdmFyKCR7aGVyb1N0eWxlLmV5ZWJyb3cuY29sb3J9KWAsXG4gICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogaGVyb1N0eWxlLmV5ZWJyb3cudGV4dFRyYW5zZm9ybSB8fCAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgPHNwYW4+e2hlcm8uZXllYnJvdyB8fCBcIlx1QkEzOVx1QUNFMCBcdUM3OTBcdUFDRTAgXHVBQzc3XHVBQ0UwIFx1Qzc3RFx1QjI5NCBcdUQ1NUNcdUFENkRcIn08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8aDEgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LWRpc3BsYXkpJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogYGNsYW1wKDM2cHgsIDV2dywgJHtoZXJvU3R5bGUudGl0bGUuZm9udFNpemV9cHgpYCxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBoZXJvU3R5bGUudGl0bGUuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiBoZXJvU3R5bGUudGl0bGUubGluZUhlaWdodCxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBgJHtoZXJvU3R5bGUudGl0bGUubGV0dGVyU3BhY2luZ31lbWAsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOjIyLFxuICAgICAgICAgICAgICAgIGNvbG9yOmB2YXIoJHtoZXJvU3R5bGUudGl0bGUuY29sb3J9KWAsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHtoZXJvLnRpdGxlMSB8fCBcIlx1RDU1Q1x1QUQ2RFx1Qzc0NFwifTxici8+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tjb2xvcjpgdmFyKCR7aGVyb1N0eWxlLnRpdGxlLmFjY2VudENvbG9yfSlgfX0+e2hlcm8udGl0bGUyIHx8IFwiXHVDOUMxXHVDODExIFx1QUM3N1x1QUNFMFwifTwvc3Bhbj48YnIvPlxuICAgICAgICAgICAgICAgIHtoZXJvLnRpdGxlMyB8fCBcIlx1Q0M5Q1x1Q0M5Q1x1RDc4OCBcdUM3N0RcdUIyRTRcIn1cbiAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYmduai1tdWx0aWxpbmVcIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRTaXplOiBoZXJvU3R5bGUuc3VidGl0bGUuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogaGVyb1N0eWxlLnN1YnRpdGxlLmxpbmVIZWlnaHQsXG4gICAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtoZXJvU3R5bGUuc3VidGl0bGUuY29sb3J9KWAsXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IGhlcm9TdHlsZS5zdWJ0aXRsZS5tYXhXaWR0aCxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206MzIsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLnN1YnRpdGxlLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogaGVyb1N0eWxlLnRpdGxlLnRleHRBbGlnbiA9PT0gJ2NlbnRlcicgPyAnYXV0bycgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IGhlcm9TdHlsZS50aXRsZS50ZXh0QWxpZ24gPT09ICdjZW50ZXInID8gJ2F1dG8nIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICB7aGVyby5zdWJ0aXRsZSB8fCBcIlx1QUQ4MVx1QUQ5MFx1QUNGQyBcdUFDRThcdUJBQTksIFx1QzJEQ1x1QzdBNVx1QUNGQyBcdUMyMTlcdUMxOEMsIFx1Q0M0NVx1QUNGQyBcdUFDMTVcdUM1RjBcdUM3NDQgXHVDNjI0XHVBQzAwXHVCQTcwIFx1RDU1Q1x1QUQ2RFx1Qzc0NCBcdUM4NzBcdUFFMDggXHVCMzU0IFx1QUMwMFx1QUU0Q1x1Qzc3NCBcdUJEMDVcdUIyQzhcdUIyRTQuIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1QjI5NCBcdUM1RUNcdUQ1ODlcdUM3NDQgXHVBRTMwXHVCODVEXHVENTU4XHVBQ0UwIFx1RDU2OFx1QUVEOCBcdUI1QTBcdUIwOThcdUIyOTQgXHVDMEFDXHVCNzhDXHVCNEU0XHVDNzU4IFx1Qzc5MVx1Qzc0MCBcdUJBQThcdUM3ODRcdUM3ODVcdUIyQzhcdUIyRTQuXCJ9XG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBnYXA6MTIsIGZsZXhXcmFwOid3cmFwJywgbWFyZ2luQm90dG9tOjQwLFxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBoZXJvU3R5bGUudGl0bGUudGV4dEFsaWduID09PSAnY2VudGVyJyA/ICdjZW50ZXInIDogKGhlcm9TdHlsZS50aXRsZS50ZXh0QWxpZ24gPT09ICdyaWdodCcgPyAnZmxleC1lbmQnIDogJ2ZsZXgtc3RhcnQnKSxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBoZXJvU3R5bGUuY3RhLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHsvKiB2MDAuMTUyIFx1MjAxNCBcdUMwQUNcdUM2QTlcdUM3OTAgXHVDNjk0XHVDQ0FEICdcdUM5QzBcdUIzQzRcdUM1RDBcdUMxMUMgXHVDNUVDXHVENTg5XHVDOUMwIFx1Q0MzRVx1QUUzMCBcdUJDODRcdUQyQkMgXHVDMEFEXHVDODFDJy4gKi99XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGRcIiBvbkNsaWNrPXsoKSA9PiBnbygnY29tbXVuaXR5Jyl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5jdGEuZm9udFdlaWdodH19PlxuICAgICAgICAgICAgICAgICAge2hlcm8uY3RhUHJpbWFyeSB8fCBcIlx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdUJDRjRcdUFFMzBcIn1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9eygpID0+IGdvKCd0b3VyJyl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5jdGEuZm9udFdlaWdodH19PlxuICAgICAgICAgICAgICAgICAge2hlcm8uY3RhU2Vjb25kYXJ5IHx8IFwiXHVCMkY1XHVDMEFDIFx1Qzc3Q1x1QzgxNSBcdUJDRjRcdUFFMzBcIn1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyby1zdGF0c1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZGlzcGxheTonZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6J3JlcGVhdCgzLDFmciknLCBnYXA6MjAsXG4gICAgICAgICAgICAgICAgcGFkZGluZ1RvcDoyNCwgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICB7c3RhdHMubWFwKChzdGF0KSA9PiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17c3RhdC5sfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogaGVyb1N0eWxlLnN0YXRzLnZhbHVlLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5zdGF0cy52YWx1ZS5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBgdmFyKCR7aGVyb1N0eWxlLnN0YXRzLnZhbHVlLmNvbG9yfSlgLFxuICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTo0LFxuICAgICAgICAgICAgICAgICAgICB9fT57c3RhdC52fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IGhlcm9TdHlsZS5zdGF0cy5sYWJlbC5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBoZXJvU3R5bGUuc3RhdHMubGFiZWwuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBgJHtoZXJvU3R5bGUuc3RhdHMubGFiZWwubGV0dGVyU3BhY2luZ31lbWAsXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtoZXJvU3R5bGUuc3RhdHMubGFiZWwuY29sb3J9KWAsXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogaGVyb1N0eWxlLnN0YXRzLmxhYmVsLnRleHRUcmFuc2Zvcm0gfHwgJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOjMsXG4gICAgICAgICAgICAgICAgICAgIH19PntzdGF0Lmx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogaGVyb1N0eWxlLnN0YXRzLnN1Yi5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYHZhcigke2hlcm9TdHlsZS5zdGF0cy5zdWIuY29sb3J9KWAsXG4gICAgICAgICAgICAgICAgICAgIH19PntzdGF0LnN9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIFx1QzZCMFx1Q0UyMTogXHVDOUMwXHVCM0M0IFx1QkJGOFx1QjlBQ1x1QkNGNFx1QUUzMCBcdTIwMTQgXHVDMkRDXHVCM0M0IFx1RDA3NFx1QjlBRCBcdTIxOTIgXHVDODA0XHVDQ0I0IFx1QkFBOFx1QjJFQyAoYTExeTogXHVDNjc4XHVBQ0ZEIGRpdiBcdUIyOTQgXHVCMkU4XHVDMjFDIFx1Q0VFOFx1RDE0Q1x1Qzc3NFx1QjEwOCwgXHVDMkU0XHVDODFDIFx1QkM4NFx1RDJCQ1x1Qzc0MCByZWdpb24gcGF0aCBcdUM2NDAgXHVDNkIwXHVDMEMxXHVCMkU4IFx1RDE0RFx1QzJBNFx1RDJCOCBcdUJDODRcdUQyQkMpLiBcdUQzRjAoXHUyMjY0NjAwcHgpIFx1QzVEMFx1QzExQ1x1QjI5NCBoZXJvLW1hcC1wcmV2aWV3IENTUyBcdUI4NUMgXHVDMjI4XHVBRTQwICsgQ1RBIFx1QkM4NFx1RDJCQ1x1QjlDQyBcdUIxNzhcdUNEOUMuICovfVxuICAgICAgICAgICAgey8qIHYwMC4xMDYgXHUyMDE0IFx1QzlDMFx1QjNDNCBcdTIxOTIgXHVCMkU0XHVDNzRDIFx1QUMxNVx1QzVGMCAvIFx1QjJFNFx1Qzc0QyBcdUIyRjVcdUMwQUMgXHVCQkY4XHVCMkM4IFx1Q0U3NFx1QjREQyAoQVx1QzU0OCkgKi99XG4gICAgICAgICAgICA8SGVyb1Byb2dyYW1DYXJkcyBnbz17Z299IGRhdGFUaWNrPXtkYXRhVGlja30gdGV4dD17aG9tZVRleHR9Lz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cblxuICAgICAgey8qIFx1MjUwMFx1MjUwMCBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVDRDk0XHVDQzlDIChcdUFEMDBcdUI5QUNcdUM3OTAgXHVDRjU4XHVEMTUwXHVDRTIwIFx1RDMyOFx1QjExMFx1QzVEMFx1QzExQyBcdUNEOTRcdUFDMDApIFx1MjAxNCB2MDAuMTY0IGFuY2hvciBcdUJDMTVcdUM3OTAgKyBhc3ltbWV0cmljIGdyaWQgXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge3JlY29tbWVuZGF0aW9ucy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVDRDk0XHVDQzlDXCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwic2VjdGlvbiBzZWN0aW9uLS1hbmNob3JcIiBzdHlsZT17e2JhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAvLyB2MDAuMDgzIFx1MjAxNCBzaXRlX2NvbnRlbnRfa3YucmVjb21tZW5kYXRpb25zSGVhZGluZyBcdUM1RDBcdUMxMUMgaGVybyBcdUM3N0RcdUM3NEMgKHYwMC4wNzMgc3dlZXAgXHVCQkY4XHVDNjQ0IFx1Qzc5NFx1QzdBQykuXG4gICAgICAgICAgICAgIGNvbnN0IF9pID0gKHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fSkucmVjb21tZW5kYXRpb25zSGVhZGluZyB8fCB7fTtcbiAgICAgICAgICAgICAgY29uc3QgZWIgPSBob21lVGV4dC5yZWNFeWVicm93IHx8IF9pLmV5ZWJyb3cgfHwgSE9NRV9URVhUX0RFRkFVTFQucmVjRXllYnJvdztcbiAgICAgICAgICAgICAgY29uc3QgdHAgPSBob21lVGV4dC5yZWNUaXRsZVByZWZpeCA/PyBfaS50aXRsZVByZWZpeCA/PyBIT01FX1RFWFRfREVGQVVMVC5yZWNUaXRsZVByZWZpeDtcbiAgICAgICAgICAgICAgY29uc3QgdGEgPSBob21lVGV4dC5yZWNUaXRsZUFjY2VudCA/PyBfaS50aXRsZUFjY2VudCA/PyBIT01FX1RFWFRfREVGQVVMVC5yZWNUaXRsZUFjY2VudDtcbiAgICAgICAgICAgICAgY29uc3QgdHMgPSBob21lVGV4dC5yZWNUaXRsZVN1ZmZpeCA/PyBfaS50aXRsZVN1ZmZpeCA/PyBIT01FX1RFWFRfREVGQVVMVC5yZWNUaXRsZVN1ZmZpeDtcbiAgICAgICAgICAgICAgY29uc3Qgc2IgPSBob21lVGV4dC5yZWNTdWJ0aXRsZSB8fCBfaS5zdWJ0aXRsZSB8fCBIT01FX1RFWFRfREVGQVVMVC5yZWNTdWJ0aXRsZTtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8U2VjdGlvbkhlYWRcbiAgICAgICAgICAgICAgICAgIGV5ZWJyb3c9e2VifVxuICAgICAgICAgICAgICAgICAgdGl0bGU9ezw+e3RwfTxzcGFuIGNsYXNzTmFtZT1cImFjY2VudFwiPnt0YX08L3NwYW4+e3RzfTwvPn1cbiAgICAgICAgICAgICAgICAgIHN1YnRpdGxlPXtzYn1cbiAgICAgICAgICAgICAgICAgIGFjdGlvbj17PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gZ28oJ3RvdXInKX0+e2hvbWVUZXh0LnJlY0FjdGlvbn08L2J1dHRvbj59XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICB7LyogdjAwLjE2NCBcdTIwMTQgXHVDRDk0XHVDQzlDIFx1Q0U3NFx1QjREQyAzXHVBQzFDIFx1Qzc3NFx1QzBDMVx1Qzc3NFx1QkE3NCBhc3ltbWV0cmljIChcdUNDQUIgXHVDRTc0XHVCNERDIDJ4KS4gXHVBREY4IFx1QkJGOFx1QjlDQ1x1Qzc3NFx1QkE3NCBncmlkLTMgXHVEM0Y0XHVCQzMxLiAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtyZWNvbW1lbmRhdGlvbnMubGVuZ3RoID49IDMgPyAnZ3JpZCBncmlkLWZlYXR1cmUtMicgOiAnZ3JpZCBncmlkLTMnfT5cbiAgICAgICAgICAgICAge3JlY29tbWVuZGF0aW9ucy5tYXAoKHIsIHJpKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFncyA9IEFycmF5LmlzQXJyYXkoci50YWdzKSA/IHIudGFncyA6ICh0eXBlb2Ygci50YWdzID09PSAnc3RyaW5nJyA/IHIudGFncy5zcGxpdCgvWyxcdTAwQjddLykubWFwKChzKSA9PiBzLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pIDogW10pO1xuICAgICAgICAgICAgICAgIC8vIHYwMC4xNjQgXHUyMDE0IFx1Q0NBQiBcdUNFNzRcdUI0REMgKGFzeW1tZXRyaWMgXHVCQUE4XHVCNERDKSBcdUIyOTQgXHVDMEFDXHVDOUM0L1x1RDBDMFx1Qzc3NFx1RDJDMC9kZXNjIFx1QkFBOFx1QjQ1MCBcdUQwN0MuXG4gICAgICAgICAgICAgICAgY29uc3QgaXNGZWF0dXJlID0gcmVjb21tZW5kYXRpb25zLmxlbmd0aCA+PSAzICYmIHJpID09PSAwO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e3IuaWQgfHwgci5uYW1lfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgICAgICAgICAgICAgICAgey4uLmNsaWNrYWJsZSgoKSA9PiBzZXRSZWNEZXRhaWwociksIGAke3IubmFtZSB8fCAnXHVDRDk0XHVDQzlDJ30gXHVDMEMxXHVDMTM4IFx1QkNGNFx1QUUzMGApfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcicsIGRpc3BsYXk6J2ZsZXgnLCBmbGV4RGlyZWN0aW9uOidjb2x1bW4nfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGlzRmVhdHVyZSA/IDMyMCA6IDE2MCwgbWFyZ2luQm90dG9tOjE4LCBwb3NpdGlvbjoncmVsYXRpdmUnLCBvdmVyZmxvdzonaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiByLmltYWdlRGF0YVVyaSA/IGB1cmwoJHtyLmltYWdlRGF0YVVyaX0pIGNlbnRlci9jb3ZlcmAgOiAndmFyKC0tYmctMyknLFxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogci5pbWFnZURhdGFVcmkgPyAnbm9uZScgOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3IucmVnaW9uICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgdG9wOjEwLCBsZWZ0OjEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiczcHggOHB4JywgYmFja2dyb3VuZDondmFyKC0tYmctMiknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBjb2xvcjondmFyKC0taW5rLTIpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19PntyLnJlZ2lvbn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge3RhZ3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6NiwgbWFyZ2luQm90dG9tOjEwLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0YWdzLnNsaWNlKDAsIDMpLm1hcCgodCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZTo5fX0+e3R9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6IGlzRmVhdHVyZSA/IDMwIDogMjIsIGZvbnRXZWlnaHQ6NjAwLCBtYXJnaW5Cb3R0b206NSwgbGluZUhlaWdodDoxLjI1fX0+e3IubmFtZSB8fCAnXHVDODFDXHVCQUE5IFx1QzVDNlx1Qzc0Qyd9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAge3Iuc3VidGl0bGUgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSwgZm9udFdlaWdodDo2MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjondmFyKC0tc2Vjb25kYXJ5KScsIGxldHRlclNwYWNpbmc6JzAuMDVlbScsIG1hcmdpbkJvdHRvbToxMCxcbiAgICAgICAgICAgICAgICAgICAgICB9fT57ci5zdWJ0aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAge3IuZGVzYyAmJiA8cCBzdHlsZT17e2ZvbnRTaXplOiBpc0ZlYXR1cmUgPyAxNCA6IDEzLCBsaW5lSGVpZ2h0OjEuNywgY29sb3I6J3ZhcigtLWluay0yKSd9fT57ci5kZXNjfTwvcD59XG4gICAgICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVEMjJDXHVDNUI0IFx1RDUwNFx1Qjg1Q1x1QURGOFx1QjdBOCBcdTIwMTQgdjAwLjE2NCBpbmxpbmUgXHVENUU0XHVCMzU0ICsgc2VjdGlvbi10aWdodCAoXHVDOUMwXHVDNkQwIFx1QkMxNVx1Qzc5MCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge3RvdXJzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1RDIyQ1x1QzVCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QThcIj48c2VjdGlvbiBjbGFzc05hbWU9XCJzZWN0aW9uLXRpZ2h0XCIgc3R5bGU9e3tib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKSd9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgey8qIHYwMC4xNjQgXHUyMDE0IGlubGluZSBcdUQ1RTRcdUIzNTQ6IGV5ZWJyb3cgKyB0aXRsZSArIGNvdW50ICsgYWN0aW9uIFx1RDU1QyBcdUM5MDQuIHN1YnRpdGxlIFx1QzgxQ1x1QUM3MCAoc2VjdGlvbi1oZWFkLS1pbmxpbmUgXHVBQzAwIGhpZGUpLiAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1oZWFkIHNlY3Rpb24taGVhZC0taW5saW5lXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIj57aG9tZVRleHQudG91ckV5ZWJyb3d9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInNlY3Rpb24tdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgIHtob21lVGV4dC50b3VyVGl0bGV9XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjondmFyKC0taW5rLTMpJywgbWFyZ2luTGVmdDoxNCwgdmVydGljYWxBbGlnbjonbWlkZGxlJyxcbiAgICAgICAgICAgICAgICAgIH19Plx1MDBCNyB7dG91cnMubGVuZ3RofVx1QUMxQyBcdUM3N0NcdUM4MTU8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IGdvKCd0b3VyJyl9Pntob21lVGV4dC50b3VyQWN0aW9ufTwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC0yXCI+XG4gICAgICAgICAgICAgIHt0b3Vycy5tYXAoKHQsIGkpID0+IChcbiAgICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e3QuaWR9IGNsYXNzTmFtZT1cImNhcmRcIlxuICAgICAgICAgICAgICAgICAgey4uLmNsaWNrYWJsZSgoKSA9PiBnbygndG91cicpLCBgXHVEMjJDXHVDNUI0OiAke3QudGl0bGV9YCl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcicsIHBvc2l0aW9uOidyZWxhdGl2ZSd9fT5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDoyMCwgcmlnaHQ6MjAsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOjEwLCBjb2xvcjondmFyKC0taW5rLTMpJywgbGV0dGVyU3BhY2luZzonMC4yZW0nLFxuICAgICAgICAgICAgICAgICAgfX0+MHtpKzF9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo4LCBtYXJnaW5Cb3R0b206MTYsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgICAgICB7dC5sZXZlbCAmJiA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiPnt0LmxldmVsfTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgIHt0LmR1cmF0aW9uICYmIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCI+e3QuZHVyYXRpb259PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAge3QuZ3JvdXAgJiYgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2VcIj57dC5ncm91cH08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiIHN0eWxlPXt7Zm9udFNpemU6MjIsIG1hcmdpbkJvdHRvbToxMH19Pnt0LnRpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICB7dC5kZXNjICYmIDxwIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGxpbmVIZWlnaHQ6MS43LCBtYXJnaW5Cb3R0b206MjB9fT57dHJ1bmNhdGVQcmV2aWV3KHQuZGVzYywgMTEwKX08L3A+fVxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHBhZGRpbmdUb3A6MTYsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCwgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0zKSd9fT57aG9tZVRleHQudG91ck5leHRMYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFNpemU6MTQsIG1hcmdpblRvcDo0LCBjb2xvcjondmFyKC0taW5rKScsIGZvbnRXZWlnaHQ6NTAwfX0+e3QubmV4dCB8fCBob21lVGV4dC5lbXB0eUZhbGxiYWNrfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e3RleHRBbGlnbjoncmlnaHQnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgZm9udFdlaWdodDo2MDAsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIGNvbG9yOid2YXIoLS1pbmstMyknfX0+e2hvbWVUZXh0LnRvdXJQcmljZUxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIwLCBtYXJnaW5Ub3A6NCwgY29sb3I6J3ZhcigtLWluayknLCBmb250V2VpZ2h0OjYwMH19Pnt0LnByaWNlID8gKHR5cGVvZiB0LnByaWNlID09PSAnbnVtYmVyJyA/IHdpbmRvdy5CR05KX0ZNVC53b24odC5wcmljZSkgOiB0LnByaWNlKSA6IGhvbWVUZXh0LmVtcHR5RmFsbGJhY2t9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+PC9Ib21lU2VjdGlvbkJvdW5kYXJ5PlxuICAgICAgKX1cblxuICAgICAgey8qIFx1MjUwMFx1MjUwMCBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHUyMDE0IHYwMC4xNjQgbWlkIFx1QkMxNVx1Qzc5MCArIFx1RDVFNFx1QjM1NCBcdUJDMTVcdUM3OTAgXHVCQ0MwXHVENjE1IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIDxIb21lU2VjdGlvbkJvdW5kYXJ5IGxhYmVsPVwiXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwXCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwic2VjdGlvbi0tbWlkXCIgc3R5bGU9e3tiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIHsvKiB2MDAuMTY0IFx1MjAxNCBcdUNFRjRcdUQzMjlcdUQyQjggXHVENUU0XHVCMzU0ICsgc3VidGl0bGUgXHVDNkIwXHVDRTIxIFx1Qzc3OFx1Qjc3Q1x1Qzc3OCAoXHVBRTMwXHVDODc0IFNlY3Rpb25IZWFkIFx1Qzc1OCA0XHVCMkU4IFx1QkMxNVx1Qzc5MCBcdUFFNzgpLiAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidmbGV4LWVuZCcsXG4gICAgICAgICAgICBnYXA6MzIsIGZsZXhXcmFwOid3cmFwJywgbWFyZ2luQm90dG9tOjMyLCBwYWRkaW5nQm90dG9tOjE4LFxuICAgICAgICAgICAgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZsZXg6JzEgMSAzMjBweCcsIG1pbldpZHRoOjB9fT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIj57aG9tZVRleHQuY29tbXVuaXR5RXllYnJvd308L2Rpdj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInNlY3Rpb24tdGl0bGVcIiBzdHlsZT17e2ZvbnRTaXplOjI4LCBtYXJnaW5Cb3R0b206MH19Pntob21lVGV4dC5jb21tdW5pdHlUaXRsZX08L2gyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7aG9tZVRleHQuY29tbXVuaXR5U3VidGl0bGUgJiYgKFxuICAgICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZsZXg6JzEgMSAyODBweCcsIGZvbnRTaXplOjEzLCBjb2xvcjondmFyKC0taW5rLTMpJyxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OjEuNywgbWFyZ2luOjAsIG1heFdpZHRoOjM4MCxcbiAgICAgICAgICAgICAgfX0+e2hvbWVUZXh0LmNvbW11bml0eVN1YnRpdGxlfTwvcD5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBnbygnY29tbXVuaXR5Jyl9Pntob21lVGV4dC5jb21tdW5pdHlBY3Rpb259PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3JlY2VudFBvc3RzLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Ym9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgICAgIHtyZWNlbnRQb3N0cy5tYXAoKHBvc3QsIGkpID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2IGtleT17cG9zdC5pZH1cbiAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ2NvbW11bml0eScpLCBwb3N0LnRpdGxlKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBnYXA6MjAsIGFsaWduSXRlbXM6J2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6JzE2cHggMjJweCcsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGkgJSAyID09PSAwID8gJ3ZhcigtLWJnKScgOiAndmFyKC0tYmctMiknLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IGkgPCByZWNlbnRQb3N0cy5sZW5ndGggLSAxID8gJzFweCBzb2xpZCB2YXIoLS1saW5lKScgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OjEsIG1pbldpZHRoOjB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OCwgYWxpZ25JdGVtczonY2VudGVyJywgbWFyZ2luQm90dG9tOjUsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgICAgICAgIHtwb3N0LmNhdGVnb3J5ICYmIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZTo5fX0+e3Bvc3QuY2F0ZWdvcnl9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7cG9zdC5wcmVmaXggJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjksIGZvbnRXZWlnaHQ6NzAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjondmFyKC0tc2Vjb25kYXJ5KScsIGxldHRlclNwYWNpbmc6JzAuMWVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19Plt7cG9zdC5wcmVmaXh9XTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MTUsIGNvbG9yOid2YXIoLS1pbmspJywgbWFyZ2luQm90dG9tOjMsIGZvbnRXZWlnaHQ6NTAwfX0+e3Bvc3QudGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3Bvc3QuYXV0aG9yfSBcdTAwQjcge3Bvc3QuZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGdhcDoxNCwgY29sb3I6J3ZhcigtLWluay0zKScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSwgZmxleFNocmluazowLCBmb250V2VpZ2h0OjUwMCxcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aG9tZVRleHQuY29tbXVuaXR5UmVwbHlMYWJlbH0ge3Bvc3QucmVwbGllcyA/PyAwfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tjb2xvcjondmFyKC0taW5rLTIpJ319Plx1MjE5Mjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17e3RleHRBbGlnbjonY2VudGVyJywgcGFkZGluZzo2MH19PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZToyMCwgY29sb3I6J3ZhcigtLWluayknLCBtYXJnaW5Cb3R0b206MTIsIGZvbnRXZWlnaHQ6NjAwfX0+XG4gICAgICAgICAgICAgICAge2hvbWVUZXh0LmNvbW11bml0eUVtcHR5VGl0bGV9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjEzLCBjb2xvcjondmFyKC0taW5rLTIpJywgbWFyZ2luQm90dG9tOjI0LCBsaW5lSGVpZ2h0OjEuN319PlxuICAgICAgICAgICAgICAgIHtob21lVGV4dC5jb21tdW5pdHlFbXB0eVN1YnRpdGxlfVxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkXCIgb25DbGljaz17KCkgPT4gZ28oJ2NvbW11bml0eScpfT57aG9tZVRleHQuY29tbXVuaXR5RW1wdHlDdGF9PC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj48L0hvbWVTZWN0aW9uQm91bmRhcnk+XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0U3Q1x1QjdGQyBcdTIwMTQgdjAwLjE2NCBtYWdhemluZSBzcHJlYWQgXHVEMUE0IChcdUM2NzhcdUJEODAgU2VjdGlvbkhlYWQgXHVEM0QwXHVBRTMwKSBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICB7ZmVhdHVyZWRDb2x1bW4gJiYgKFxuICAgICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1Q0U3Q1x1QjdGQ1wiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb24tLW1pZFwiIHN0eWxlPXt7Ym9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIHsvKiB2MDAuMTY0IFx1MjAxNCBleWVicm93IFx1QjlDQyBcdUFDMDBcdUJDQkNcdUM2QjQgXHVENUU0XHVCMzU0LCB0aXRsZSBcdUM3NDAgZmVhdHVyZWQgXHVDRTc0XHVCNERDIFx1QzU0OFx1QzczQ1x1Qjg1QyBcdUQ3NjFcdUMyMTguICovfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidiYXNlbGluZScsXG4gICAgICAgICAgICAgIG1hcmdpbkJvdHRvbToyOCwgZ2FwOjE2LCBmbGV4V3JhcDond3JhcCcsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e21hcmdpbjowfX0+e2hvbWVUZXh0LmNvbHVtbkV5ZWJyb3d9PC9kaXY+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IGdvKCdjb2x1bW4nKX0+e2hvbWVUZXh0LmNvbHVtbkFjdGlvbn08L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxLjVmciAxZnInLCBnYXA6NTZ9fSBjbGFzc05hbWU9XCJjb2wtZ3JpZFwiPlxuICAgICAgICAgICAgICB7LyogdjAwLjE2NCBcdTIwMTQgXHVENTNDXHVDQzk4XHVCNERDID0gbWFnYXppbmUgc3ByZWFkLiBcdUNFNzRcdUI0REMgXHVCNzdDXHVDNzc4IFx1QzgxQ1x1QUM3MCAoLmNhcmQgXHVEM0QwXHVBRTMwKSwgXHVDMEFDXHVDOUM0IGZ1bGxibGVlZC1pc2ggKyBcdUQwNzAgXHVEMEMwXHVDNzc0XHVEMkMwLiAqL31cbiAgICAgICAgICAgICAgPGFydGljbGVcbiAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcid9fVxuICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ2NvbHVtbicpLCBgXHVDRTdDXHVCN0ZDOiAke2ZlYXR1cmVkQ29sdW1uLnRpdGxlfWApfT5cbiAgICAgICAgICAgICAgICB7KGZlYXR1cmVkQ29sdW1uLmNvdmVyVXJsIHx8IGZlYXR1cmVkQ29sdW1uLmNvdmVySW1hZ2UpID8gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6MzQwLCBtYXJnaW5Cb3R0b206MjgsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRJbWFnZTpgdXJsKCR7ZmVhdHVyZWRDb2x1bW4uY292ZXJVcmwgfHwgZmVhdHVyZWRDb2x1bW4uY292ZXJJbWFnZX0pYCxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZFNpemU6J2NvdmVyJywgYmFja2dyb3VuZFBvc2l0aW9uOidjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgfX0vPlxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDoyNjAsIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgbWFyZ2luQm90dG9tOjI4LFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZTo5LCBmb250V2VpZ2h0OjYwMCwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMjhlbSd9fT5GRUFUVVJFRCBDT0xVTU48L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTIsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbToxNCwgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICAgICAgICB7ZmVhdHVyZWRDb2x1bW4uY2F0ZWdvcnkgJiYgPHNwYW4gY2xhc3NOYW1lPVwicGlsbFwiPntmZWF0dXJlZENvbHVtbi5jYXRlZ29yeX08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAge2ZlYXR1cmVkQ29sdW1uLmRhdGUgJiYgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTF9fT57ZmVhdHVyZWRDb2x1bW4uZGF0ZX08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAge2ZlYXR1cmVkQ29sdW1uLnJlYWRUaW1lICYmIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjExfX0+XHUwMEI3IHtmZWF0dXJlZENvbHVtbi5yZWFkVGltZX08L3NwYW4+fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHsvKiBtYWdhemluZSBcdUNDOThcdUI3RkMgXHVEMDcwIFx1RDVFNFx1QjREQ1x1Qjc3Q1x1Qzc3OCAoY29sdW1uIHN1YnRpdGxlIFx1Qzc5MFx1QjlBQ1x1QjNDNCBcdUM3ODhcdUM3M0NcdUJBNzQgXHVCMTc4XHVDRDlDKSAqL31cbiAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6J2NsYW1wKDI4cHgsIDN2dywgMzhweCknLFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDo2MDAsIGxpbmVIZWlnaHQ6MS4yLCBtYXJnaW5Cb3R0b206MTQsIGNvbG9yOid2YXIoLS1pbmspJyxcbiAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6Jy0wLjAxZW0nLFxuICAgICAgICAgICAgICAgIH19PntmZWF0dXJlZENvbHVtbi50aXRsZX08L2gyPlxuICAgICAgICAgICAgICAgIHtmZWF0dXJlZENvbHVtbi5leGNlcnB0ICYmIChcbiAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6MTUsIGxpbmVIZWlnaHQ6MS44NSwgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToxOCwgbWF4V2lkdGg6NTgwfX0+e2ZlYXR1cmVkQ29sdW1uLmV4Y2VycHR9PC9wPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgZm9udFdlaWdodDo3MDAsIGxldHRlclNwYWNpbmc6JzAuMmVtJywgY29sb3I6J3ZhcigtLXNlY29uZGFyeSknfX0+e2hvbWVUZXh0LmNvbHVtblJlYWRNb3JlfTwvZGl2PlxuICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICAgIHsvKiB2MDAuMTY0IFx1MjAxNCBzaWRlYmFyID0gXHVBRTY4XHVCMDU3XHVENTVDIFx1RDE0RFx1QzJBNFx1RDJCOCBsaXN0LiBcdUNFNzRcdUI0REMgXHVCNzdDXHVDNzc4IFgsIFx1QUQ2Q1x1QkQ4NFx1QzEyMFx1QjlDQy4gKi99XG4gICAgICAgICAgICAgIDxhc2lkZSBzdHlsZT17e3BhZGRpbmdUb3A6OH19PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZToxMCwgZm9udFdlaWdodDo2MDAsIGxldHRlclNwYWNpbmc6JzAuMjJlbScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjondmFyKC0taW5rLTMpJywgbWFyZ2luQm90dG9tOjE4LCB0ZXh0VHJhbnNmb3JtOid1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICAgIH19Pntob21lVGV4dC5jb2x1bW5UaXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgICB7c2Vjb25kYXJ5Q29sdW1ucy5tYXAoKGMsIGNpKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17Yy5pZH1cbiAgICAgICAgICAgICAgICAgICAgey4uLmNsaWNrYWJsZSgoKSA9PiBnbygnY29sdW1uJyksIGBcdUNFN0NcdUI3RkM6ICR7Yy50aXRsZX1gKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOicxNnB4IDAnLFxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogY2kgPCBzZWNvbmRhcnlDb2x1bW5zLmxlbmd0aCAtIDEgPyAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyA6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTAsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbTo2LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7Yy5jYXRlZ29yeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJwaWxsXCIgc3R5bGU9e3tmb250U2l6ZTo5LCBwYWRkaW5nOicycHggOHB4J319PntjLmNhdGVnb3J5fTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAge2MuZGF0ZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMH19PntjLmRhdGV9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MTYsIGZvbnRXZWlnaHQ6NjAwLCBsaW5lSGVpZ2h0OjEuNCwgbWFyZ2luQm90dG9tOjR9fT57Yy50aXRsZX08L2g0PlxuICAgICAgICAgICAgICAgICAgICB7Yy5leGNlcnB0ICYmIDxwIHN0eWxlPXt7Zm9udFNpemU6MTIsIGxpbmVIZWlnaHQ6MS42LCBjb2xvcjondmFyKC0taW5rLTMpJywgbWFyZ2luOjB9fT57KGMuZXhjZXJwdHx8JycpLnNsaWNlKDAsNjUpfVx1MjAyNjwvcD59XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICB7c2Vjb25kYXJ5Q29sdW1ucy5sZW5ndGggPT09IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgY29sb3I6J3ZhcigtLWluay0zKScsIHBhZGRpbmc6JzE2cHggMCd9fT57aG9tZVRleHQuY29sdW1uRW1wdHl9PC9wPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvYXNpZGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVBQzE1XHVDNUYwIFx1Qzc3Q1x1QzgxNSBcdTIwMTQgdjAwLjE2NCBcdUFDMDBcdUI4NUMgXHVDMkE0XHVEMDZDXHVCODY0IHN0cmlwIChmaWxtIHN0cmlwIFx1RDFBNCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge2xlY3R1cmVzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1QUMxNVx1QzVGMFwiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb24tdGlnaHRcIiBzdHlsZT17e2JhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIHsvKiB2MDAuMTY0IFx1MjAxNCBpbmxpbmUgXHVENUU0XHVCMzU0ICgzXHVDNUY0IGdyaWQgXHVDNjQwIFx1QkIzNFx1QUM4QyBcdUIyRTRcdUI5NzggXHVCQzE1XHVDNzkwKS4gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24taGVhZCBzZWN0aW9uLWhlYWQtLWlubGluZVwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+e2hvbWVUZXh0LmxlY3R1cmVzRXllYnJvd308L2Rpdj5cbiAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwic2VjdGlvbi10aXRsZVwiPntob21lVGV4dC5sZWN0dXJlc1RpdGxlfTwvaDI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBnbygnbGVjdHVyZXMnKX0+e2hvbWVUZXh0LmxlY3R1cmVzQWN0aW9ufTwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7LyogdjAwLjE2NCBcdTIwMTQgZmlsbSBzdHJpcCBcdUFDMDBcdUI4NUMgXHVDMkE0XHVEMDZDXHVCODY0LiBcdUQzRUQgMzIwcHggXHVDRTc0XHVCNERDICsgc2Nyb2xsLXNuYXAuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsZWN0dXJlLXN0cmlwXCIgcm9sZT1cImxpc3RcIj5cbiAgICAgICAgICAgICAge2xlY3R1cmVzLm1hcCgobGVjdHVyZSkgPT4gKFxuICAgICAgICAgICAgICAgIDxhcnRpY2xlIGtleT17bGVjdHVyZS5pZH1cbiAgICAgICAgICAgICAgICAgIHJvbGU9XCJsaXN0aXRlbVwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfbGVjdHVyZV9pZCcsIFN0cmluZyhsZWN0dXJlLmlkKSk7IH0gY2F0Y2gge31cbiAgICAgICAgICAgICAgICAgICAgZ28oJ2xlY3R1cmVzJyk7XG4gICAgICAgICAgICAgICAgICB9LCBgXHVBQzE1XHVDNUYwOiAke2xlY3R1cmUudG9waWMgfHwgbGVjdHVyZS50aXRsZX1gKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Y3Vyc29yOidwb2ludGVyJywgZGlzcGxheTonZmxleCcsIGZsZXhEaXJlY3Rpb246J2NvbHVtbid9fT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3ttYXJnaW5Cb3R0b206MTYsIGFsaWduU2VsZjonZmxleC1zdGFydCd9fT57aG9tZVRleHQubGVjdHVyZUJhZGdlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjAsIGZvbnRXZWlnaHQ6NjAwLCBtYXJnaW5Cb3R0b206OCwgZmxleDonMCAwIGF1dG8nfX0+e2xlY3R1cmUudG9waWMgfHwgbGVjdHVyZS50aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAge2xlY3R1cmUubm90ZSAmJiA8cCBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToxNiwgZmxleDonMSAxIGF1dG8nfX0+e3RydW5jYXRlUHJldmlldyhsZWN0dXJlLm5vdGUsIDExMCl9PC9wPn1cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHBhZGRpbmdUb3A6MTIsIGRpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIG1hcmdpblRvcDonYXV0byd9fT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZToxMiwgY29sb3I6J3ZhcigtLWluay0yKSd9fT57bGVjdHVyZS52ZW51ZSB8fCBob21lVGV4dC5lbXB0eUZhbGxiYWNrfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZToxMiwgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRXZWlnaHQ6NjAwLCBjb2xvcjondmFyKC0taW5rKSd9fT57bGVjdHVyZS5uZXh0IHx8IGhvbWVUZXh0LmVtcHR5RmFsbGJhY2t9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgey8qIFx1QUMwMFx1Qjg1QyBcdUMyQTRcdUQwNkNcdUI4NjQgXHVENzhDXHVEMkI4IFx1MjAxNCBcdUNFNzRcdUI0REMgXHUyMjY1IDNcdUFDMUMgXHVDNzdDIFx1QjU0Q1x1QjlDQyAoXHVCQ0Y0XHVEMUI1IDMgXHVDNzc0XHVDMEMxXHVDNzc0XHVDOUMwXHVCOUNDIFx1QkMyOVx1QzVCNCkuICovfVxuICAgICAgICAgICAge2xlY3R1cmVzLmxlbmd0aCA+PSAzICYmIChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6MTQsIGZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCwgbGV0dGVyU3BhY2luZzonMC4yMmVtJyxcbiAgICAgICAgICAgICAgICBjb2xvcjondmFyKC0taW5rLTMpJywgdGV4dEFsaWduOidyaWdodCcsXG4gICAgICAgICAgICAgIH19Plx1MjE5MCBcdUFDMDBcdUI4NUNcdUI4NUMgXHVDMkE0XHVEMDZDXHVCODY0IFx1MjE5MjwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVDQzQ1IENUQSBcdTIwMTQgdjAwLjE1MiBcdUIyRTRcdUFEOEMgXHVDRTc0XHVCOEU4XHVDMTQwICsgXHVDODhDXHVDNkIwIFx1QkIzNFx1RDU1QyBcdUJDMThcdUJDRjUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAgPEJvb2tDYXJvdXNlbFNlY3Rpb24gZ289e2dvfSBkYXRhVGljaz17ZGF0YVRpY2t9IHRleHQ9e2hvbWVUZXh0fS8+XG5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IEhvbWVQYWdlIH0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBV0EsTUFBTSxzQkFBc0IsQ0FBQyxFQUFFLFNBQVMsR0FBRyxNQUFNO0FBWGpEO0FBWUUsUUFBTSxDQUFDLGNBQWMsZUFBZSxJQUFJLE1BQU0sU0FBUyxJQUFJO0FBRTNELGVBQU8sa0JBQVAsZ0NBQXVCLEVBQUUsTUFBTSxNQUFNLE9BQU8sT0FBTyxTQUFTLGFBQWEsTUFBTSxPQUFPLCtDQUFZO0FBQ2xHLFNBQ0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFJLE1BQUs7QUFBQSxNQUFTLGNBQVc7QUFBQSxNQUFPLGNBQVc7QUFBQSxNQUM5QyxPQUFPO0FBQUEsUUFDTCxVQUFTO0FBQUEsUUFBUyxPQUFNO0FBQUEsUUFBRyxRQUFPO0FBQUEsUUFDbEMsWUFBVztBQUFBLFFBQ1gsU0FBUTtBQUFBLFFBQVEsWUFBVztBQUFBLFFBQVUsU0FBUTtBQUFBLE1BQy9DO0FBQUEsTUFDQSxTQUFTLENBQUMsTUFBTTtBQUFFLFlBQUksRUFBRSxXQUFXLEVBQUUsY0FBZSxTQUFRO0FBQUEsTUFBRztBQUFBO0FBQUEsSUFDL0Qsb0NBQUMsU0FBSSxPQUFPO0FBQUEsTUFDVixZQUFXO0FBQUEsTUFBYSxVQUFTO0FBQUEsTUFBSyxPQUFNO0FBQUEsTUFBUSxXQUFVO0FBQUEsTUFDOUQsVUFBUztBQUFBLE1BQVEsU0FBUTtBQUFBLE1BQWtCLFVBQVM7QUFBQSxNQUNwRCxRQUFPO0FBQUEsSUFDVCxLQUNFO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFBTyxTQUFTO0FBQUEsUUFBUyxjQUFXO0FBQUEsUUFDbkMsT0FBTztBQUFBLFVBQ0wsVUFBUztBQUFBLFVBQVksS0FBSTtBQUFBLFVBQUksT0FBTTtBQUFBLFVBQ25DLE9BQU07QUFBQSxVQUFJLFFBQU87QUFBQSxVQUFJLFVBQVM7QUFBQSxVQUM5QixZQUFXO0FBQUEsVUFBZSxRQUFPO0FBQUEsVUFBUSxRQUFPO0FBQUEsVUFDaEQsT0FBTTtBQUFBLFVBQWdCLFlBQVc7QUFBQSxRQUNuQztBQUFBO0FBQUEsTUFBRztBQUFBLElBQUMsR0FDTixvQ0FBQyxTQUFJLFdBQVUsbUJBQWtCLE9BQU8sRUFBQyxjQUFhLEdBQUUsS0FBRyxtREFBcUIsR0FDaEYsb0NBQUMsUUFBRyxPQUFPLEVBQUMsWUFBVyx1QkFBdUIsVUFBUyxJQUFJLFlBQVcsS0FBSyxjQUFhLElBQUksWUFBVyxJQUFHLEtBQUcsc0VBRTdHLEdBQ0Esb0NBQUMsT0FBRSxPQUFPLEVBQUMsVUFBUyxJQUFJLE9BQU0sZ0JBQWdCLGNBQWEsSUFBSSxZQUFXLElBQUcsS0FBRyxzS0FFaEYsR0FDQyxPQUFPLGFBQWEsYUFDbkI7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLFVBQVUsQ0FBQyxTQUFTLGlCQUFnQiw2Q0FBYyxRQUFPLEtBQUssS0FBSyxPQUFPLElBQUk7QUFBQSxRQUM5RSxVQUFVLDZDQUFjO0FBQUE7QUFBQSxJQUMxQixJQUVBLG9DQUFDLFNBQUksT0FBTyxFQUFDLFFBQU8sS0FBSyxTQUFRLFFBQVEsWUFBVyxVQUFVLE9BQU0sZ0JBQWdCLFVBQVMsR0FBRSxLQUFHLHFDQUFVLEdBRTdHLGdCQUNDLG9DQUFDLFNBQUksT0FBTztBQUFBLE1BQ1YsV0FBVTtBQUFBLE1BQUksU0FBUTtBQUFBLE1BQ3RCLFlBQVc7QUFBQSxNQUFlLFFBQU87QUFBQSxJQUNuQyxLQUNFLG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsUUFBUSxZQUFXLFlBQVksS0FBSSxJQUFJLGNBQWEsR0FBRyxVQUFTLE9BQU0sS0FDekYsb0NBQUMsVUFBSyxPQUFPLEVBQUMsWUFBVyxxQkFBcUIsVUFBUyxJQUFJLE9BQU0sY0FBYyxZQUFXLElBQUcsS0FBSSxhQUFhLElBQUssR0FDbkgsb0NBQUMsVUFBSyxPQUFPLEVBQUMsWUFBVyxvQkFBb0IsVUFBUyxJQUFJLE9BQU0sZ0JBQWdCLGVBQWMsU0FBUSxLQUFJLGFBQWEsUUFBUyxDQUNsSSxHQUNDLGFBQWEsUUFDWixvQ0FBQyxPQUFFLE9BQU8sRUFBQyxVQUFTLElBQUksT0FBTSxnQkFBZ0IsWUFBVyxLQUFLLGNBQWEsR0FBRSxLQUFJLGFBQWEsSUFBSyxHQUVwRyxhQUFhLFFBQ1osb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLEtBQUksR0FBRyxVQUFTLFFBQVEsY0FBYSxHQUFFLEtBQ2pFLE9BQU8sYUFBYSxJQUFJLEVBQUUsTUFBTSxNQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFDOUUsb0NBQUMsVUFBSyxLQUFLLEdBQUcsV0FBVSxTQUFRLE9BQU8sRUFBQyxVQUFTLEdBQUUsS0FBSSxDQUFFLENBQzFELENBQ0gsR0FFRixvQ0FBQyxZQUFPLFdBQVUsMEJBQXlCLFNBQVMsTUFBTTtBQUFFLFNBQUcsTUFBTTtBQUFHLGNBQVE7QUFBQSxJQUFHLEtBQUcsc0RBRXRGLENBQ0YsQ0FFSjtBQUFBLEVBQ0Y7QUFFSjtBQUdBLE1BQU0sNEJBQTRCLE1BQU0sVUFBVTtBQUFBLEVBQ2hELFlBQVksT0FBTztBQUFFLFVBQU0sS0FBSztBQUFHLFNBQUssUUFBUSxFQUFFLE9BQU8sS0FBSztBQUFBLEVBQUc7QUFBQSxFQUNqRSxPQUFPLHlCQUF5QixLQUFLO0FBQUUsV0FBTyxFQUFFLE9BQU8sSUFBSTtBQUFBLEVBQUc7QUFBQSxFQUM5RCxrQkFBa0IsS0FBSztBQW5GekI7QUFvRkksUUFBSTtBQUFFLGNBQVEsTUFBTSx5QkFBeUIsS0FBSyxNQUFNLFNBQVMsV0FBVyxHQUFHO0FBQUEsSUFBRyxTQUFRO0FBQUEsSUFBQztBQUMzRixRQUFJO0FBQ0YscUNBQU8sYUFBUCxtQkFBaUIsYUFBakIsbUJBQTJCLE9BQU87QUFBQSxRQUNoQyxNQUFNO0FBQUEsUUFBc0IsUUFBUTtBQUFBLFFBQU0sTUFBTTtBQUFBLFFBQ2hELFVBQVMsMkJBQUssWUFBVyxPQUFPLEdBQUc7QUFBQSxRQUNuQyxNQUFNLFdBQVcsS0FBSyxNQUFNLFNBQVMsRUFBRTtBQUFBLFFBQUksS0FBSztBQUFBLFFBQ2hELFVBQVUsU0FBUztBQUFBLFFBQVUsUUFBUSxTQUFTO0FBQUEsTUFDaEQsT0FMQSxtQkFLSSxVQUxKLDRCQUtZLE1BQU07QUFBQSxNQUFDO0FBQUEsSUFDckIsU0FBUTtBQUFBLElBQUM7QUFBQSxFQUNYO0FBQUEsRUFDQSxTQUFTO0FBQ1AsUUFBSSxLQUFLLE1BQU0sT0FBTztBQUVwQixhQUNFLG9DQUFDLGFBQVEsT0FBTyxFQUFDLFNBQVEsVUFBVSxjQUFhLHlCQUF5QixXQUFVLFNBQVEsS0FDekYsb0NBQUMsT0FBRSxXQUFVLGNBQWEsT0FBTyxFQUFDLFVBQVMsSUFBSSxlQUFjLFNBQVEsS0FBRyxXQUNuRSxLQUFLLE1BQU0sU0FBUyx1QkFBTyxpRUFDaEMsQ0FDRjtBQUFBLElBRUo7QUFDQSxXQUFPLEtBQUssTUFBTTtBQUFBLEVBQ3BCO0FBQ0Y7QUFHQSxNQUFNLDRCQUE0QixDQUFDLEVBQUUsS0FBSyxTQUFTLEdBQUcsTUFBTTtBQTlHNUQ7QUFnSEUsZUFBTyxrQkFBUCxnQ0FBdUIsRUFBRSxNQUFNLE1BQU0sT0FBTyxPQUFPLFNBQVMsYUFBYSxNQUFNLFFBQU8sMkJBQUssU0FBUSxrQ0FBUztBQUM1RyxRQUFNLE9BQU8sTUFBTSxRQUFRLElBQUksSUFBSSxJQUMvQixJQUFJLE9BQ0gsT0FBTyxJQUFJLFNBQVMsV0FBVyxJQUFJLEtBQUssTUFBTSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLE9BQU8sSUFBSSxDQUFDO0FBQ25HLFNBQ0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFJLE1BQUs7QUFBQSxNQUFTLGNBQVc7QUFBQSxNQUFPLGNBQVksR0FBRyxJQUFJLFFBQVEsY0FBSTtBQUFBLE1BQ2xFLE9BQU87QUFBQSxRQUNMLFVBQVM7QUFBQSxRQUFTLE9BQU07QUFBQSxRQUFHLFFBQU87QUFBQSxRQUNsQyxZQUFXO0FBQUEsUUFDWCxTQUFRO0FBQUEsUUFBUSxZQUFXO0FBQUEsUUFBVSxTQUFRO0FBQUEsTUFDL0M7QUFBQSxNQUNBLFNBQVMsQ0FBQyxNQUFNO0FBQUUsWUFBSSxFQUFFLFdBQVcsRUFBRSxjQUFlLFNBQVE7QUFBQSxNQUFHO0FBQUE7QUFBQSxJQUMvRCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFlBQVc7QUFBQSxNQUFhLFVBQVM7QUFBQSxNQUFLLE9BQU07QUFBQSxNQUFRLFdBQVU7QUFBQSxNQUM5RCxVQUFTO0FBQUEsTUFBUSxVQUFTO0FBQUEsTUFDMUIsUUFBTztBQUFBLElBQ1QsS0FDRTtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQU8sU0FBUztBQUFBLFFBQVMsY0FBVztBQUFBLFFBQ25DLE9BQU87QUFBQSxVQUNMLFVBQVM7QUFBQSxVQUFZLEtBQUk7QUFBQSxVQUFJLE9BQU07QUFBQSxVQUFJLFFBQU87QUFBQSxVQUM5QyxPQUFNO0FBQUEsVUFBSSxRQUFPO0FBQUEsVUFBSSxVQUFTO0FBQUEsVUFDOUIsWUFBVztBQUFBLFVBQWUsUUFBTztBQUFBLFVBQXlCLFFBQU87QUFBQSxVQUNqRSxPQUFNO0FBQUEsVUFBYyxZQUFXO0FBQUEsVUFBRyxZQUFXO0FBQUEsUUFDL0M7QUFBQTtBQUFBLE1BQUc7QUFBQSxJQUFDLEdBQ0wsSUFBSSxnQkFDSCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLE9BQU07QUFBQSxNQUFRLFFBQU87QUFBQSxNQUNyQixZQUFZLE9BQU8sSUFBSSxZQUFZO0FBQUEsTUFDbkMsY0FBYTtBQUFBLElBQ2YsR0FBRSxHQUVKLG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsaUJBQWdCLEtBQ2xDLElBQUksVUFDSCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFNBQVE7QUFBQSxNQUFnQixTQUFRO0FBQUEsTUFDaEMsWUFBVztBQUFBLE1BQW9CLFVBQVM7QUFBQSxNQUFJLFlBQVc7QUFBQSxNQUN2RCxlQUFjO0FBQUEsTUFBVSxPQUFNO0FBQUEsTUFDOUIsUUFBTztBQUFBLE1BQTJCLGNBQWE7QUFBQSxJQUNqRCxLQUFJLElBQUksTUFBTyxHQUVqQixvQ0FBQyxRQUFHLE9BQU87QUFBQSxNQUNULFlBQVc7QUFBQSxNQUFxQixVQUFTO0FBQUEsTUFBSSxZQUFXO0FBQUEsTUFDeEQsT0FBTTtBQUFBLE1BQWMsWUFBVztBQUFBLE1BQUssY0FBYTtBQUFBLElBQ25ELEtBQUksSUFBSSxRQUFRLDJCQUFRLEdBQ3ZCLElBQUksWUFDSCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFlBQVc7QUFBQSxNQUFvQixVQUFTO0FBQUEsTUFBSSxZQUFXO0FBQUEsTUFDdkQsT0FBTTtBQUFBLE1BQW9CLGVBQWM7QUFBQSxNQUFVLGNBQWE7QUFBQSxJQUNqRSxLQUFJLElBQUksUUFBUyxHQUVsQixJQUFJLFFBQ0gsb0NBQUMsT0FBRSxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsTUFBTSxPQUFNLGdCQUFnQixjQUFhLEdBQUUsS0FBSSxJQUFJLElBQUssR0FFNUYsS0FBSyxTQUFTLEtBQ2Isb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLEtBQUksR0FBRyxVQUFTLFFBQVEsY0FBYSxHQUFFLEtBQ2pFLEtBQUssSUFBSSxDQUFDLE1BQ1Qsb0NBQUMsVUFBSyxLQUFLLEdBQUcsV0FBVSxTQUFRLE9BQU8sRUFBQyxVQUFTLEdBQUUsS0FBSSxDQUFFLENBQzFELENBQ0gsR0FFRixvQ0FBQyxTQUFJLE9BQU8sRUFBQyxTQUFRLFFBQVEsS0FBSSxJQUFJLFVBQVMsUUFBUSxXQUFVLHlCQUF5QixZQUFXLEdBQUUsS0FDcEcsb0NBQUMsWUFBTyxXQUFVLGdCQUFlLFNBQVMsTUFBTTtBQUFFLFNBQUcsTUFBTTtBQUFHLGNBQVE7QUFBQSxJQUFHLEtBQUcsc0RBQVksR0FDeEYsb0NBQUMsWUFBTyxXQUFVLE9BQU0sU0FBUyxXQUFTLGNBQUUsQ0FDOUMsQ0FDRixDQUNGO0FBQUEsRUFDRjtBQUVKO0FBS0EsTUFBTSxrQkFBa0IsQ0FBQyxNQUFNLE1BQU0sUUFBUTtBQUMzQyxRQUFNLElBQUksT0FBTyxRQUFRLEVBQUUsRUFBRSxRQUFRLFFBQVEsR0FBRyxFQUFFLEtBQUs7QUFDdkQsTUFBSSxFQUFFLFVBQVUsSUFBSyxRQUFPO0FBRTVCLFFBQU0sUUFBUSxFQUFFLE1BQU0sR0FBRyxHQUFHO0FBQzVCLFFBQU0sWUFBWSxNQUFNLFlBQVksR0FBRztBQUN2QyxRQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxNQUFNLEdBQUcsU0FBUyxJQUFJO0FBQ2hFLFNBQU8sTUFBTTtBQUNmO0FBRUEsTUFBTSxvQkFBb0I7QUFBQSxFQUN4QixZQUFZO0FBQUEsRUFDWixnQkFBZ0I7QUFBQSxFQUNoQixnQkFBZ0I7QUFBQSxFQUNoQixnQkFBZ0I7QUFBQSxFQUNoQixhQUFhO0FBQUEsRUFDYixXQUFXO0FBQUEsRUFDWCxhQUFhO0FBQUEsRUFDYixXQUFXO0FBQUEsRUFDWCxjQUFjO0FBQUEsRUFDZCxZQUFZO0FBQUEsRUFDWixlQUFlO0FBQUEsRUFDZixnQkFBZ0I7QUFBQSxFQUNoQixrQkFBa0I7QUFBQSxFQUNsQixnQkFBZ0I7QUFBQSxFQUNoQixtQkFBbUI7QUFBQSxFQUNuQixpQkFBaUI7QUFBQSxFQUNqQixxQkFBcUI7QUFBQSxFQUNyQixxQkFBcUI7QUFBQSxFQUNyQix3QkFBd0I7QUFBQSxFQUN4QixtQkFBbUI7QUFBQSxFQUNuQixlQUFlO0FBQUEsRUFDZixhQUFhO0FBQUEsRUFDYixnQkFBZ0I7QUFBQSxFQUNoQixjQUFjO0FBQUEsRUFDZCxnQkFBZ0I7QUFBQSxFQUNoQixhQUFhO0FBQUEsRUFDYixpQkFBaUI7QUFBQSxFQUNqQixlQUFlO0FBQUEsRUFDZixnQkFBZ0I7QUFBQSxFQUNoQixjQUFjO0FBQUEsRUFDZCx3QkFBd0I7QUFBQSxFQUN4QixzQkFBc0I7QUFBQSxFQUN0QixtQkFBbUI7QUFBQSxFQUNuQixtQkFBbUI7QUFBQSxFQUNuQixrQkFBa0I7QUFBQSxFQUNsQixnQkFBZ0I7QUFBQSxFQUNoQixlQUFlO0FBQUEsRUFDZixlQUFlO0FBQUEsRUFDZixlQUFlO0FBQUEsRUFDZixtQkFBbUI7QUFBQSxFQUNuQixZQUFZO0FBQUEsRUFDWixhQUFhO0FBQUEsRUFDYixhQUFhO0FBQUEsRUFDYixrQkFBa0I7QUFDcEI7QUFFQSxNQUFNLGNBQWMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxtQkFBbUIsR0FBSyxNQUFNLE9BQU8sR0FBRyxhQUFhLFdBQVksR0FBRyxXQUFXLENBQUMsRUFBRztBQUlySCxNQUFNLG1CQUFtQixDQUFDLEVBQUUsSUFBSSxVQUFVLEtBQUssTUFBTTtBQUduRCxRQUFNLE9BQU8sQ0FBQyxPQUFPO0FBQ25CLFFBQUk7QUFBRSxZQUFNLElBQUksR0FBRztBQUFHLGFBQU8sTUFBTSxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUM7QUFBQSxJQUFHLFNBQVE7QUFBRSxhQUFPLENBQUM7QUFBQSxJQUFHO0FBQUEsRUFDL0U7QUFHQSxRQUFNLGVBQWUsQ0FBQyxNQUFNO0FBQzFCLFFBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUUsU0FBVSxRQUFPO0FBQzFDLFdBQU8sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFLFFBQVEsQ0FBQztBQUFBLEVBQ3RDO0FBR0EsUUFBTSxXQUFXLE1BQU0sUUFBUSxNQUFNO0FBQ25DLFVBQU0sTUFBTSxLQUFLLE1BQUc7QUFyUXhCO0FBcVEyQixnQ0FBTyxrQkFBUCxtQkFBc0IsWUFBdEI7QUFBQSxLQUFpQyxFQUNyRCxPQUFPLFlBQVk7QUFDdEIsVUFBTSxTQUFTLEtBQUssSUFBSSxJQUFJO0FBQzVCLFVBQU0sV0FBVyxJQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEtBQUssTUFBTSxFQUN0RCxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztBQUNqRixRQUFJLFNBQVMsU0FBUyxFQUFHLFFBQU87QUFFaEMsV0FBTyxJQUNKLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksTUFBTSxFQUNyRCxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUM5RSxNQUFNLEdBQUcsQ0FBQztBQUFBLEVBQ2YsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNiLFFBQU0sUUFBUSxNQUFNLFFBQVEsTUFBTTtBQUNoQyxXQUFPLEtBQUssTUFBRztBQW5SbkI7QUFtUnNCLGdDQUFPLGVBQVAsbUJBQW1CLFlBQW5CO0FBQUEsS0FBOEIsRUFDN0MsT0FBTyxZQUFZLEVBQ25CLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsSUFBSSxJQUFJLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQzlFLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEtBQUssS0FBSyxJQUFJLElBQUksS0FBUTtBQUFBLEVBQzFFLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFFYixRQUFNLGNBQWMsU0FBUyxDQUFDO0FBQzlCLFFBQU0sV0FBVyxNQUFNLENBQUM7QUFFeEIsUUFBTSxnQkFBZ0IsZUFBZSxZQUFZLFlBQzlDLElBQUksS0FBSyxZQUFZLFFBQVEsRUFBRSxRQUFRLElBQUksS0FBSyxJQUFJLElBQUk7QUFHM0QsUUFBTSxVQUFVLENBQUMsUUFBUTtBQWhTM0I7QUFpU0ksUUFBSSxDQUFDLElBQUssUUFBTztBQUNqQixTQUFJLFlBQU8sYUFBUCxtQkFBaUIsWUFBYSxRQUFPLE9BQU8sU0FBUyxZQUFZLEdBQUc7QUFFeEUsVUFBTSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ3RCLFVBQU0sTUFBTSxDQUFDLE1BQU0sT0FBTyxDQUFDLEVBQUUsU0FBUyxHQUFHLEdBQUc7QUFDNUMsVUFBTSxNQUFNLENBQUMsVUFBSSxVQUFJLFVBQUksVUFBSSxVQUFJLFVBQUksUUFBRyxFQUFFLEVBQUUsT0FBTyxDQUFDO0FBQ3BELFdBQU8sR0FBRyxFQUFFLFNBQVMsSUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztBQUFBLEVBQ25HO0FBRUEsU0FDRSxvQ0FBQyxTQUFJLFdBQVUsd0JBRWI7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUNDLFNBQVMsTUFBTTtBQUFFLFlBQUksWUFBYSxJQUFHLFVBQVU7QUFBQSxNQUFHO0FBQUEsTUFDbEQsV0FBVTtBQUFBLE1BQ1YsT0FBTyxFQUFDLFFBQVEsY0FBYyxZQUFZLFVBQVM7QUFBQSxNQUNuRCxNQUFNLGNBQWMsV0FBVztBQUFBLE1BQy9CLFVBQVUsY0FBYyxJQUFJO0FBQUEsTUFDNUIsV0FBVyxDQUFDLE1BQU07QUFBRSxZQUFJLGdCQUFnQixFQUFFLFFBQVEsV0FBVyxFQUFFLFFBQVEsTUFBTTtBQUFFLFlBQUUsZUFBZTtBQUFHLGFBQUcsVUFBVTtBQUFBLFFBQUc7QUFBQSxNQUFFO0FBQUE7QUFBQSxJQUNySCxvQ0FBQyxTQUFJLFdBQVUsd0JBQ1osZ0JBQWdCLEtBQUsseUJBQXlCLEtBQUssb0JBQ3REO0FBQUEsSUFDQyxjQUNDLDBEQUNFLG9DQUFDLFFBQUcsV0FBVSxZQUFXLE9BQU8sRUFBQyxVQUFTLElBQUksY0FBYSxHQUFHLE9BQU0sYUFBWSxLQUFJLFlBQVksU0FBUyxZQUFZLEtBQU0sR0FDM0gsb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLGdCQUFlLGlCQUFpQixZQUFXLFlBQVksVUFBUyxRQUFRLEtBQUksR0FBRSxLQUN6RyxvQ0FBQyxVQUFLLFdBQVUsZUFBYyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsSUFBRyxLQUFJLFFBQVEsWUFBWSxRQUFRLENBQUUsR0FDbkcsb0NBQUMsVUFBSyxXQUFVLFNBQVEsT0FBTyxFQUFDLFVBQVMsR0FBRSxLQUFJLFlBQVksU0FBUyxLQUFLLGFBQWMsQ0FDekYsQ0FDRixJQUVBLG9DQUFDLE9BQUUsV0FBVSxPQUFNLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxLQUFLLFFBQU8sRUFBQyxLQUM3RCxLQUFLLG1CQUFrQixLQUFDLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsa0JBQWlCLFNBQVMsQ0FBQyxNQUFNO0FBQUUsUUFBRSxnQkFBZ0I7QUFBRyxTQUFHLFVBQVU7QUFBQSxJQUFHLEtBQUksS0FBSyxnQkFBaUIsQ0FDN0o7QUFBQSxFQUVKLEdBR0E7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUNDLFNBQVMsTUFBTTtBQUFFLFlBQUksU0FBVSxJQUFHLE1BQU07QUFBQSxNQUFHO0FBQUEsTUFDM0MsV0FBVTtBQUFBLE1BQ1YsT0FBTyxFQUFDLFFBQVEsV0FBVyxZQUFZLFVBQVM7QUFBQSxNQUNoRCxNQUFNLFdBQVcsV0FBVztBQUFBLE1BQzVCLFVBQVUsV0FBVyxJQUFJO0FBQUEsTUFDekIsV0FBVyxDQUFDLE1BQU07QUFBRSxZQUFJLGFBQWEsRUFBRSxRQUFRLFdBQVcsRUFBRSxRQUFRLE1BQU07QUFBRSxZQUFFLGVBQWU7QUFBRyxhQUFHLE1BQU07QUFBQSxRQUFHO0FBQUEsTUFBRTtBQUFBO0FBQUEsSUFDOUcsb0NBQUMsU0FBSSxXQUFVLHdCQUNaLEtBQUssaUJBQ1I7QUFBQSxJQUNDLFdBQ0MsMERBQ0Usb0NBQUMsUUFBRyxXQUFVLFlBQVcsT0FBTyxFQUFDLFVBQVMsSUFBSSxjQUFhLEdBQUcsT0FBTSxhQUFZLEtBQUksU0FBUyxLQUFNLEdBQ2xHLFNBQVMsWUFDUixvQ0FBQyxPQUFFLFdBQVUsU0FBUSxPQUFPLEVBQUMsVUFBUyxJQUFJLGNBQWEsR0FBRyxXQUFVLFNBQVEsS0FBSSxTQUFTLFFBQVMsR0FFcEcsb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLGdCQUFlLGlCQUFpQixZQUFXLFlBQVksVUFBUyxRQUFRLEtBQUksR0FBRSxLQUN6RyxvQ0FBQyxVQUFLLFdBQVUsZUFBYyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsSUFBRyxLQUFJLFFBQVEsU0FBUyxRQUFRLENBQUUsR0FDaEcsb0NBQUMsVUFBSyxXQUFVLFNBQVEsT0FBTyxFQUFDLFVBQVMsR0FBRSxLQUN4QyxTQUFTLFNBQVMsb0NBQUMsVUFBSyxPQUFPLEVBQUMsYUFBWSxFQUFDLEtBQUksU0FBUyxLQUFNLEdBQ2hFLFNBQVMsUUFDWixDQUNGLENBQ0YsSUFFQSxvQ0FBQyxPQUFFLFdBQVUsT0FBTSxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxRQUFPLEVBQUMsS0FDN0QsS0FBSyxnQkFBZSxLQUFDLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsa0JBQWlCLFNBQVMsQ0FBQyxNQUFNO0FBQUUsUUFBRSxnQkFBZ0I7QUFBRyxTQUFHLE1BQU07QUFBQSxJQUFHLEtBQUksS0FBSyxhQUFjLENBQ25KO0FBQUEsRUFFSixDQUNGO0FBRUo7QUFJQSxNQUFNLHNCQUFzQixDQUFDLEVBQUUsSUFBSSxVQUFVLEtBQUssTUFBTTtBQUN0RCxRQUFNLE9BQU8sQ0FBQyxPQUFPO0FBQUUsUUFBSTtBQUFFLFlBQU0sSUFBSSxHQUFHO0FBQUcsYUFBTyxNQUFNLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUFBLElBQUcsU0FBUTtBQUFFLGFBQU8sQ0FBQztBQUFBLElBQUc7QUFBQSxFQUFFO0FBRXRHLFFBQU0sQ0FBQyxVQUFVLFdBQVcsSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUNoRCxRQUFNLFVBQVUsTUFBTTtBQUNwQixVQUFNLE1BQU0sTUFBTSxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUM7QUFDMUMsV0FBTyxpQkFBaUIsc0JBQXNCLEdBQUc7QUFDakQsV0FBTyxNQUFNLE9BQU8sb0JBQW9CLHNCQUFzQixHQUFHO0FBQUEsRUFDbkUsR0FBRyxDQUFDLENBQUM7QUFDTCxRQUFNLFFBQVEsTUFBTSxRQUFRLE1BQU07QUFDaEMsVUFBTSxNQUFNLEtBQUssTUFBRztBQXJYeEI7QUFxWDJCLGdDQUFPLGVBQVAsbUJBQW1CLFNBQW5CLDRCQUEwQixFQUFFLFFBQVEsWUFBWTtBQUFBLEtBQUU7QUFDekUsV0FBTyxJQUFJLE1BQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNO0FBdFh0QztBQXVYTSxVQUFJLEVBQUUsV0FBVyxDQUFDLEVBQUUsUUFBUyxRQUFPO0FBQ3BDLFVBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxRQUFTLFFBQU87QUFDcEMsZUFBUSxPQUFFLFVBQUYsWUFBVyxPQUFNLE9BQUUsVUFBRixZQUFXO0FBQUEsSUFDdEMsQ0FBQztBQUFBLEVBQ0gsR0FBRyxDQUFDLFVBQVUsUUFBUSxDQUFDO0FBRXZCLFFBQU0sQ0FBQyxLQUFLLE1BQU0sSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUN0QyxRQUFNLENBQUMsUUFBUSxTQUFTLElBQUksTUFBTSxTQUFTLEtBQUs7QUFFaEQsUUFBTSxVQUFVLE1BQU07QUFDcEIsUUFBSSxNQUFNLFNBQVMsS0FBSyxPQUFPLE1BQU0sT0FBUSxRQUFPLENBQUM7QUFBQSxFQUN2RCxHQUFHLENBQUMsTUFBTSxRQUFRLEdBQUcsQ0FBQztBQUV0QixRQUFNLE9BQU8sQ0FBQyxNQUFNLE1BQU0sV0FBVyxJQUFJLEtBQUssSUFBSSxNQUFNLFVBQVUsTUFBTTtBQUN4RSxRQUFNLFNBQVMsTUFBTSxPQUFPLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQzlDLFFBQU0sU0FBUyxNQUFNLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUM7QUFHOUMsUUFBTSxVQUFVLE1BQU07QUFDcEIsUUFBSSxNQUFNLFNBQVMsS0FBSyxPQUFRO0FBQ2hDLFVBQU0sSUFBSSxXQUFXLE1BQU0sT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUk7QUFDM0QsV0FBTyxNQUFNLGFBQWEsQ0FBQztBQUFBLEVBQzdCLEdBQUcsQ0FBQyxLQUFLLE1BQU0sUUFBUSxNQUFNLENBQUM7QUFFOUIsTUFBSSxNQUFNLFdBQVcsRUFBRyxRQUFPO0FBQy9CLFFBQU0sYUFBYSxNQUFNLFNBQVM7QUFHbEMsUUFBTSxpQkFBaUIsQ0FBQyxNQUFNO0FBQzVCLFVBQU0sYUFBYSxPQUFPLEVBQUUsT0FBTyxJQUFJO0FBQ3ZDLFVBQU0sYUFBYSxPQUFPLEVBQUUsT0FBTyxJQUFJO0FBQ3ZDLFVBQU0sS0FBSyxFQUFFLGNBQWMsSUFBSSxLQUFLLEVBQUUsV0FBVyxFQUFFLFlBQVksS0FBSSxvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUMxRixXQUNFLG9DQUFDLFNBQUksV0FBVSxpQkFBZ0IsT0FBTztBQUFBLE1BQ3BDLFNBQVE7QUFBQSxNQUNSLFNBQVE7QUFBQSxNQUFRLHFCQUFvQjtBQUFBLE1BQVcsS0FBSTtBQUFBLE1BQUksWUFBVztBQUFBLE1BQ2xFLFlBQVc7QUFBQSxNQUFlLFFBQU87QUFBQSxJQUNuQyxLQUNFLG9DQUFDLGFBQ0Msb0NBQUMsU0FBSSxXQUFVLHFCQUFtQixLQUFLLG1CQUFrQixVQUFJLEVBQUcsR0FDaEUsb0NBQUMsUUFBRyxPQUFPO0FBQUEsTUFDVCxZQUFXO0FBQUEsTUFBcUIsVUFBUztBQUFBLE1BQ3pDLFlBQVc7QUFBQSxNQUFLLFlBQVc7QUFBQSxNQUFLLGNBQWMsRUFBRSxXQUFXLElBQUk7QUFBQSxJQUNqRSxLQUFHLFVBQ0MsRUFBRSxPQUFNLFFBQ1osR0FFQyxFQUFFLFlBQ0Qsb0NBQUMsT0FBRSxPQUFPO0FBQUEsTUFDUixZQUFXO0FBQUEsTUFBcUIsVUFBUztBQUFBLE1BQUksV0FBVTtBQUFBLE1BQ3ZELE9BQU07QUFBQSxNQUFnQixjQUFhO0FBQUEsTUFBSSxZQUFXO0FBQUEsSUFDcEQsS0FDRyxFQUFFLFFBQ0wsR0FFRCxFQUFFLFFBQ0Qsb0NBQUMsT0FBRSxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsTUFBTSxPQUFNLGdCQUFnQixjQUFhLElBQUksWUFBVyxXQUFVLEtBQ2xHLEVBQUUsSUFDTCxJQUVBLGNBQWMsZUFDZCxvQ0FBQyxTQUFJLE9BQU8sRUFBQyxTQUFRLFFBQVEsS0FBSSxJQUFJLGNBQWEsSUFBSSxZQUFXLFdBQVUsS0FDeEUsY0FDQyxvQ0FBQyxhQUNDLG9DQUFDLFNBQUksV0FBVSxRQUFPLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxLQUFLLGVBQWMsVUFBVSxPQUFNLGVBQWMsS0FBSSxLQUFLLFdBQVksR0FDNUgsb0NBQUMsU0FBSSxXQUFVLFlBQVcsT0FBTyxFQUFDLFVBQVMsSUFBSSxXQUFVLEdBQUcsT0FBTSxjQUFjLFlBQVcsSUFBRyxLQUFJLE9BQU8sRUFBRSxPQUFPLEVBQUUsZUFBZSxHQUFFLFFBQUMsQ0FDeEksR0FFRCxjQUFjLGNBQWMsb0NBQUMsU0FBSSxPQUFPLEVBQUMsT0FBTSxHQUFHLFlBQVcsaUJBQWlCLFdBQVUsVUFBUyxHQUFFLEdBQ25HLGNBQ0Msb0NBQUMsYUFDQyxvQ0FBQyxTQUFJLFdBQVUsUUFBTyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxlQUFjLFVBQVUsT0FBTSxlQUFjLEtBQUksS0FBSyxXQUFZLEdBQzVILG9DQUFDLFNBQUksV0FBVSxZQUFXLE9BQU8sRUFBQyxVQUFTLElBQUksV0FBVSxHQUFHLE9BQU0sY0FBYyxZQUFXLElBQUcsS0FBSSxPQUFPLEVBQUUsT0FBTyxFQUFFLGVBQWUsR0FBRSxRQUFDLENBQ3hJLENBRUosR0FFRixvQ0FBQyxZQUFPLFdBQVUsZ0JBQWUsU0FBUyxNQUFNLEdBQUcsTUFBTSxLQUFJLEtBQUssVUFBVyxDQUMvRSxHQUNBLG9DQUFDLFNBQUksT0FBTztBQUFBLE1BQ1YsYUFBWTtBQUFBLE1BQU8sVUFBUztBQUFBLE1BQUssUUFBTztBQUFBLE1BQ3hDLFlBQVc7QUFBQSxNQUFhLFFBQU87QUFBQSxNQUMvQixTQUFRO0FBQUEsTUFBUSxZQUFXO0FBQUEsTUFBVSxVQUFTO0FBQUEsSUFDaEQsS0FDRyxFQUFFLGVBQ0Q7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUFJLEtBQUssRUFBRTtBQUFBLFFBQWMsS0FBSyxHQUFHLEVBQUUsS0FBSztBQUFBLFFBQ3ZDLE9BQU8sRUFBQyxPQUFNLFFBQVEsUUFBTyxRQUFRLFdBQVUsU0FBUyxTQUFRLFFBQU87QUFBQTtBQUFBLElBQUUsSUFFM0Usb0NBQUMsU0FBSSxPQUFPLEVBQUMsV0FBVSxVQUFVLFNBQVEsU0FBUSxLQUMvQyxvQ0FBQyxTQUFJLE9BQU8sRUFBQyxZQUFXLHFCQUFxQixVQUFTLElBQUksT0FBTSxjQUFjLGNBQWEsSUFBSSxZQUFXLElBQUcsS0FBSSxFQUFFLEtBQU0sR0FDekgsb0NBQUMsU0FBSSxPQUFPLEVBQUMsWUFBVyxvQkFBb0IsVUFBUyxHQUFHLFlBQVcsS0FBSyxPQUFNLGdCQUFnQixlQUFjLFFBQU8sS0FBSSxFQUFFLFVBQVUsNEJBQU8sS0FBRSxLQUFLLGdCQUFpQixDQUNwSyxDQUVKLENBQ0Y7QUFBQSxFQUVKO0FBRUEsU0FDRSxvQ0FBQyx1QkFBb0IsT0FBTSxnQkFBUSxvQ0FBQyxhQUFRLFdBQVUsNkJBQ3BELG9DQUFDLFNBQUksV0FBVSxlQUNiO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFDQyxjQUFjLE1BQU0sVUFBVSxJQUFJO0FBQUEsTUFDbEMsY0FBYyxNQUFNLFVBQVUsS0FBSztBQUFBLE1BQ25DLE9BQU8sRUFBQyxVQUFTLFdBQVU7QUFBQTtBQUFBLElBRzNCLG9DQUFDLFNBQUksT0FBTyxFQUFDLFVBQVMsV0FBVSxLQUM3QixNQUFNLElBQUksQ0FBQyxHQUFHLE1BQU07QUFDbkIsWUFBTSxTQUFTLE1BQU07QUFDckIsYUFDRTtBQUFBLFFBQUM7QUFBQTtBQUFBLFVBQUksS0FBSyxFQUFFLE1BQU07QUFBQSxVQUNoQixlQUFhLFNBQVMsU0FBWTtBQUFBLFVBQ2xDLE9BQU87QUFBQSxZQUNMLFVBQVUsTUFBTSxJQUFJLGFBQWE7QUFBQSxZQUNqQyxLQUFLO0FBQUEsWUFBRyxNQUFNO0FBQUEsWUFBRyxPQUFPO0FBQUEsWUFDeEIsU0FBUyxTQUFTLElBQUk7QUFBQSxZQUN0QixXQUFXLFNBQ1Asa0JBQ0MsSUFBSSxNQUFNLHNCQUFzQjtBQUFBLFlBQ3JDLFlBQVk7QUFBQSxZQUNaLGVBQWUsU0FBUyxTQUFTO0FBQUEsVUFDbkM7QUFBQTtBQUFBLFFBQ0MsZUFBZSxDQUFDO0FBQUEsTUFDbkI7QUFBQSxJQUVKLENBQUMsQ0FDSDtBQUFBLElBRUMsY0FDQywwREFDRTtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQU8sTUFBSztBQUFBLFFBQVMsY0FBVztBQUFBLFFBQU8sU0FBUztBQUFBLFFBQy9DLE9BQU87QUFBQSxVQUNMLFVBQVM7QUFBQSxVQUFZLE1BQUs7QUFBQSxVQUFJLEtBQUk7QUFBQSxVQUFPLFdBQVU7QUFBQSxVQUNuRCxPQUFNO0FBQUEsVUFBSSxRQUFPO0FBQUEsVUFBSSxjQUFhO0FBQUEsVUFBTyxRQUFPO0FBQUEsVUFDaEQsWUFBVztBQUFBLFVBQWEsT0FBTTtBQUFBLFVBQWMsUUFBTztBQUFBLFVBQ25ELFNBQVE7QUFBQSxVQUFRLFlBQVc7QUFBQSxVQUFVLFVBQVM7QUFBQSxVQUFJLFlBQVc7QUFBQSxVQUFLLFlBQVc7QUFBQSxRQUMvRTtBQUFBO0FBQUEsTUFBRztBQUFBLElBQUMsR0FDTjtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQU8sTUFBSztBQUFBLFFBQVMsY0FBVztBQUFBLFFBQU8sU0FBUztBQUFBLFFBQy9DLE9BQU87QUFBQSxVQUNMLFVBQVM7QUFBQSxVQUFZLE9BQU07QUFBQSxVQUFJLEtBQUk7QUFBQSxVQUFPLFdBQVU7QUFBQSxVQUNwRCxPQUFNO0FBQUEsVUFBSSxRQUFPO0FBQUEsVUFBSSxjQUFhO0FBQUEsVUFBTyxRQUFPO0FBQUEsVUFDaEQsWUFBVztBQUFBLFVBQWEsT0FBTTtBQUFBLFVBQWMsUUFBTztBQUFBLFVBQ25ELFNBQVE7QUFBQSxVQUFRLFlBQVc7QUFBQSxVQUFVLFVBQVM7QUFBQSxVQUFJLFlBQVc7QUFBQSxVQUFLLFlBQVc7QUFBQSxRQUMvRTtBQUFBO0FBQUEsTUFBRztBQUFBLElBQUMsQ0FDUjtBQUFBLEVBRUosR0FFQyxjQUNDLG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsUUFBUSxnQkFBZSxVQUFVLEtBQUksR0FBRyxXQUFVLEdBQUUsS0FDdEUsTUFBTSxJQUFJLENBQUMsR0FBRyxNQUNiO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFBTyxLQUFLLEVBQUUsTUFBTTtBQUFBLE1BQUcsTUFBSztBQUFBLE1BQVMsY0FBWSxHQUFHLElBQUUsQ0FBQztBQUFBLE1BQ3RELFNBQVMsTUFBTSxPQUFPLENBQUM7QUFBQSxNQUN2QixPQUFPO0FBQUEsUUFDTCxPQUFPLE1BQU0sTUFBTSxLQUFLO0FBQUEsUUFBRyxRQUFRO0FBQUEsUUFBRyxTQUFTO0FBQUEsUUFDL0MsY0FBYztBQUFBLFFBQUcsUUFBUTtBQUFBLFFBQVEsUUFBUTtBQUFBLFFBQ3pDLFlBQVksTUFBTSxNQUFNLGdCQUFnQjtBQUFBLFFBQ3hDLFlBQVk7QUFBQSxNQUNkO0FBQUE7QUFBQSxFQUFFLENBQ0wsQ0FDSCxDQUVKLENBQ0YsQ0FBVTtBQUVkO0FBRUEsTUFBTSxXQUFXLENBQUMsRUFBRSxHQUFHLE1BQU07QUFDM0IsUUFBTSxDQUFDLFNBQVMsVUFBVSxJQUFJLE1BQU0sU0FBUyxLQUFLO0FBQ2xELFFBQU0sQ0FBQyxRQUFRLFNBQVMsSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUM1QyxRQUFNLENBQUMsVUFBVSxXQUFXLElBQUksTUFBTSxTQUFTLENBQUM7QUFHaEQsUUFBTSxVQUFVLE1BQU07QUFDcEIsVUFBTSxNQUFNLE1BQU0sVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDO0FBQ3hDLFdBQU8saUJBQWlCLDZCQUE2QixHQUFHO0FBQ3hELFdBQU8sTUFBTSxPQUFPLG9CQUFvQiw2QkFBNkIsR0FBRztBQUFBLEVBQzFFLEdBQUcsQ0FBQyxDQUFDO0FBSUwsUUFBTSxVQUFVLE1BQU07QUFDcEIsVUFBTSxPQUFPLE1BQU0sWUFBWSxDQUFDLE1BQU0sSUFBSSxDQUFDO0FBQzNDLFVBQU0sT0FBTyxDQUFDLHdCQUF3QixzQkFBc0IseUJBQXlCLG9CQUFvQjtBQUN6RyxTQUFLLFFBQVEsQ0FBQyxNQUFNLE9BQU8saUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQ3BELFdBQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQyxNQUFNLE9BQU8sb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQUEsRUFDdEUsR0FBRyxDQUFDLENBQUM7QUFFTCxRQUFNLEtBQUssTUFBTSxRQUFRLE1BQUc7QUFwakI5QjtBQW9qQmtDLCtCQUFPLHNCQUFQLG1CQUEwQixRQUExQixnQ0FBcUMsQ0FBQztBQUFBLEtBQUksQ0FBQyxNQUFNLENBQUM7QUFDbEYsUUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQU0sV0FBVyxNQUFNLFFBQVEsTUFBTSxZQUFZLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUUxRCxRQUFNLENBQUMsVUFBVSxXQUFXLElBQUksTUFBTSxTQUFTLE1BQU07QUFDbkQsUUFBSTtBQUFFLGFBQU8sQ0FBQyxFQUFFLE9BQU8sY0FBYyxPQUFPLFdBQVcsb0JBQW9CLEVBQUU7QUFBQSxJQUFVLFNBQVE7QUFBRSxhQUFPO0FBQUEsSUFBTztBQUFBLEVBQ2pILENBQUM7QUFDRCxRQUFNLFVBQVUsTUFBTTtBQUNwQixRQUFJO0FBQ0YsWUFBTSxLQUFLLE9BQU8sV0FBVyxvQkFBb0I7QUFDakQsWUFBTSxVQUFVLENBQUMsTUFBTSxZQUFZLEVBQUUsT0FBTztBQUM1QyxVQUFJLEdBQUcsaUJBQWtCLElBQUcsaUJBQWlCLFVBQVUsT0FBTztBQUFBLGVBQ3JELEdBQUcsWUFBYSxJQUFHLFlBQVksT0FBTztBQUMvQyxhQUFPLE1BQU07QUFDWCxZQUFJLEdBQUcsb0JBQXFCLElBQUcsb0JBQW9CLFVBQVUsT0FBTztBQUFBLGlCQUMzRCxHQUFHLGVBQWdCLElBQUcsZUFBZSxPQUFPO0FBQUEsTUFDdkQ7QUFBQSxJQUNGLFNBQVE7QUFBQSxJQUFDO0FBQUEsRUFDWCxHQUFHLENBQUMsQ0FBQztBQUNMLFFBQU0sWUFBWSxNQUFNO0FBQUEsSUFDdEIsTUFBRztBQXhrQlA7QUF3a0JXLDJCQUFPLG9CQUFQLGdDQUF5QixXQUFXLFdBQVcsZUFBYyxPQUFPO0FBQUE7QUFBQSxJQUMzRSxDQUFDLFFBQVEsUUFBUTtBQUFBLEVBQ25CO0FBQ0EsUUFBTSxrQkFBa0IsTUFBTSxRQUFRLEdBQUcsZUFBZSxJQUFJLEdBQUcsZ0JBQWdCLE9BQU8sT0FBTyxJQUFJLENBQUM7QUFDbEcsUUFBTSxDQUFDLFdBQVcsWUFBWSxJQUFJLE1BQU0sU0FBUyxJQUFJO0FBSXJELFFBQU0sSUFBSSxPQUFPLGNBQWM7QUFBQSxJQUM3QixLQUFLLENBQUMsT0FBTztBQUFFLFVBQUk7QUFBRSxjQUFNLElBQUksR0FBRztBQUFHLGVBQU8sTUFBTSxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUM7QUFBQSxNQUFHLFNBQVE7QUFBRSxlQUFPLENBQUM7QUFBQSxNQUFHO0FBQUEsSUFBRTtBQUFBLElBQzlGLE1BQU0sQ0FBQyxJQUFJLE9BQU87QUFBRSxVQUFJO0FBQUUsY0FBTSxJQUFJLEdBQUc7QUFBRyxlQUFPLE1BQU0sU0FBWSxLQUFLO0FBQUEsTUFBRyxTQUFRO0FBQUUsZUFBTztBQUFBLE1BQUk7QUFBQSxJQUFFO0FBQUEsRUFDcEc7QUFFQSxRQUFNLGdCQUFnQixDQUFDLFFBQVE7QUFDN0IsUUFBSSxDQUFDLElBQUssUUFBTztBQUNqQixVQUFNLElBQUksS0FBSyxNQUFNLEdBQUc7QUFDeEIsV0FBTyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCO0FBQ0EsUUFBTSxnQkFBZ0IsTUFBTSxRQUFRLE1BQU0sRUFBRSxJQUFJLE1BQUc7QUExbEJyRDtBQTBsQndELDhCQUFPLGlCQUFQLG1CQUFxQixlQUFyQjtBQUFBLEdBQW1DLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDdEcsUUFBTSxpQkFBaUIsY0FBYyxDQUFDO0FBQ3RDLFFBQU0sbUJBQW1CLGNBQWMsTUFBTSxHQUFHLENBQUM7QUFDakQsUUFBTSxjQUFjLE1BQU0sUUFBUSxNQUFNLEVBQUUsSUFBSSxNQUFHO0FBN2xCbkQ7QUE2bEJzRCw4QkFBTyxtQkFBUCxtQkFBdUIsY0FBdkI7QUFBQSxHQUFvQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDakgsUUFBTSxRQUFRLE1BQU0sUUFBUSxNQUFNLEVBQUUsSUFBSSxNQUFHO0FBOWxCN0M7QUE4bEJnRCw4QkFBTyxlQUFQLG1CQUFtQixZQUFuQjtBQUFBLEdBQThCLEVBQUUsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDbkksUUFBTSxXQUFXLE1BQU0sUUFBUSxNQUFNLEVBQUUsSUFBSSxNQUFHO0FBL2xCaEQ7QUErbEJtRCw4QkFBTyxrQkFBUCxtQkFBc0IsWUFBdEI7QUFBQSxHQUFpQyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBR3pJLFFBQU0sWUFBWSxNQUFNLFFBQVEsS0FBSyxLQUFLLEtBQUssS0FBSyxNQUFNLFdBQVcsSUFBSSxLQUFLLFFBQVE7QUFBQSxJQUNwRixFQUFFLE9BQU8sc0JBQVMsS0FBSyxnREFBZSxlQUFlLGVBQVE7QUFBQSxJQUM3RCxFQUFFLE9BQU8sZ0JBQVUsS0FBSyxzREFBYyxlQUFlLHNCQUFPO0FBQUEsSUFDNUQsRUFBRSxPQUFPLDRCQUFRLEtBQUssZ0RBQWUsZUFBZSxzQkFBTztBQUFBLEVBQzdEO0FBQ0EsUUFBTSxRQUFRO0FBQUEsSUFDWixFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUUsT0FBTyxHQUFHLFVBQVUsQ0FBQyxFQUFFLGlCQUFpQixnQkFBaUQsR0FBRyxVQUFVLENBQUMsRUFBRSxJQUFJO0FBQUEsSUFDL0gsRUFBRSxHQUFHLFVBQVUsQ0FBQyxFQUFFLE9BQU8sR0FBRyxNQUFNLFNBQVMsSUFBSSxHQUFHLE1BQU0sTUFBTSxXQUFPLFVBQVUsQ0FBQyxFQUFFLGlCQUFpQix1QkFBYSxHQUFHLFVBQVUsQ0FBQyxFQUFFLElBQUk7QUFBQSxJQUNwSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUUsT0FBTyxHQUFHLFlBQVksU0FBUyxJQUFJLEdBQUcsWUFBWSxNQUFNLE1BQU8sVUFBVSxDQUFDLEVBQUUsaUJBQWlCLHVCQUFTLEdBQUcsVUFBVSxDQUFDLEVBQUUsSUFBSTtBQUFBLEVBQzlJO0FBRUEsUUFBTSxZQUFZLENBQUMsU0FBUyxXQUFXO0FBQUEsSUFDckMsTUFBSztBQUFBLElBQVUsVUFBUztBQUFBLElBQUcsY0FBYTtBQUFBLElBQU87QUFBQSxJQUMvQyxXQUFVLENBQUMsTUFBTTtBQUFFLFVBQUksRUFBRSxRQUFNLFdBQVMsRUFBRSxRQUFNLEtBQUs7QUFBRSxVQUFFLGVBQWU7QUFBRyxnQkFBUTtBQUFBLE1BQUc7QUFBQSxJQUFFO0FBQUEsSUFDeEYsT0FBTSxFQUFDLFFBQU8sVUFBUztBQUFBLEVBQ3pCO0FBRUEsU0FDRSxvQ0FBQyxTQUFJLFdBQVUsZUFDWixXQUFXLG9DQUFDLHVCQUFvQixTQUFTLE1BQU0sV0FBVyxLQUFLLEdBQUcsSUFBTyxHQUN6RSxhQUFhLG9DQUFDLDZCQUEwQixLQUFLLFdBQVcsU0FBUyxNQUFNLGFBQWEsSUFBSSxHQUFHLElBQU8sR0FLbkcsb0NBQUMsdUJBQW9CLE9BQU0sd0JBQU0sb0NBQUMsYUFBUSxXQUFVLGFBQVksT0FBTztBQUFBLElBQ3JFLFVBQVM7QUFBQSxJQUFZLFVBQVM7QUFBQSxJQUM5QixZQUFXO0FBQUEsSUFBYSxjQUFhO0FBQUEsSUFDckMsU0FBUTtBQUFBLEVBQ1YsS0FDRSxvQ0FBQyxTQUFJLFdBQVUsZUFDYixvQ0FBQyxTQUFJLFdBQVUsNEJBQTJCLE9BQU87QUFBQSxJQUMvQyxTQUFRO0FBQUEsSUFBUSxxQkFBb0I7QUFBQSxJQUFhLEtBQUk7QUFBQSxJQUFJLFlBQVc7QUFBQSxFQUN0RSxLQUVFLG9DQUFDLFNBQUksT0FBTyxFQUFDLFdBQVcsVUFBVSxNQUFNLGFBQWEsT0FBTSxLQUN6RCxvQ0FBQyxTQUFJLFdBQVUsbUJBQWtCLE9BQU87QUFBQSxJQUN0QyxVQUFVLFVBQVUsUUFBUTtBQUFBLElBQzVCLFlBQVksVUFBVSxRQUFRO0FBQUEsSUFDOUIsZUFBZSxHQUFHLFVBQVUsUUFBUSxhQUFhO0FBQUEsSUFDakQsT0FBTyxPQUFPLFVBQVUsUUFBUSxLQUFLO0FBQUEsSUFDckMsZUFBZSxVQUFVLFFBQVEsaUJBQWlCO0FBQUEsRUFDcEQsS0FDRSxvQ0FBQyxjQUFNLEtBQUssV0FBVyxrRUFBaUIsQ0FDMUMsR0FDQSxvQ0FBQyxRQUFHLE9BQU87QUFBQSxJQUNULFlBQVc7QUFBQSxJQUNYLFVBQVUsb0JBQW9CLFVBQVUsTUFBTSxRQUFRO0FBQUEsSUFDdEQsWUFBWSxVQUFVLE1BQU07QUFBQSxJQUM1QixZQUFZLFVBQVUsTUFBTTtBQUFBLElBQzVCLGVBQWUsR0FBRyxVQUFVLE1BQU0sYUFBYTtBQUFBLElBQy9DLGNBQWE7QUFBQSxJQUNiLE9BQU0sT0FBTyxVQUFVLE1BQU0sS0FBSztBQUFBLEVBQ3BDLEtBQ0csS0FBSyxVQUFVLHNCQUFNLG9DQUFDLFVBQUUsR0FDekIsb0NBQUMsVUFBSyxPQUFPLEVBQUMsT0FBTSxPQUFPLFVBQVUsTUFBTSxXQUFXLElBQUcsS0FBSSxLQUFLLFVBQVUsMkJBQVEsR0FBTyxvQ0FBQyxVQUFFLEdBQzdGLEtBQUssVUFBVSxpQ0FDbEIsR0FDQSxvQ0FBQyxPQUFFLFdBQVUsa0JBQWlCLE9BQU87QUFBQSxJQUNuQyxVQUFVLFVBQVUsU0FBUztBQUFBLElBQzdCLFlBQVksVUFBVSxTQUFTO0FBQUEsSUFDL0IsT0FBTyxPQUFPLFVBQVUsU0FBUyxLQUFLO0FBQUEsSUFDdEMsVUFBVSxVQUFVLFNBQVM7QUFBQSxJQUM3QixjQUFhO0FBQUEsSUFDYixZQUFZLFVBQVUsU0FBUztBQUFBLElBQy9CLFlBQVksVUFBVSxNQUFNLGNBQWMsV0FBVyxTQUFTO0FBQUEsSUFDOUQsYUFBYSxVQUFVLE1BQU0sY0FBYyxXQUFXLFNBQVM7QUFBQSxFQUNqRSxLQUNHLEtBQUssWUFBWSxxWEFDcEIsR0FDQSxvQ0FBQyxTQUFJLE9BQU87QUFBQSxJQUNWLFNBQVE7QUFBQSxJQUFRLEtBQUk7QUFBQSxJQUFJLFVBQVM7QUFBQSxJQUFRLGNBQWE7QUFBQSxJQUN0RCxnQkFBZ0IsVUFBVSxNQUFNLGNBQWMsV0FBVyxXQUFZLFVBQVUsTUFBTSxjQUFjLFVBQVUsYUFBYTtBQUFBLElBQzFILFlBQVksVUFBVSxJQUFJO0FBQUEsRUFDNUIsS0FFRTtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQU8sV0FBVTtBQUFBLE1BQWUsU0FBUyxNQUFNLEdBQUcsV0FBVztBQUFBLE1BQzVELE9BQU8sRUFBQyxZQUFZLFVBQVUsSUFBSSxXQUFVO0FBQUE7QUFBQSxJQUMzQyxLQUFLLGNBQWM7QUFBQSxFQUN0QixHQUNBO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFBTyxXQUFVO0FBQUEsTUFBTSxTQUFTLE1BQU0sR0FBRyxNQUFNO0FBQUEsTUFDOUMsT0FBTyxFQUFDLFlBQVksVUFBVSxJQUFJLFdBQVU7QUFBQTtBQUFBLElBQzNDLEtBQUssZ0JBQWdCO0FBQUEsRUFDeEIsQ0FDRixHQUNBLG9DQUFDLFNBQUksV0FBVSxjQUFhLE9BQU87QUFBQSxJQUNqQyxTQUFRO0FBQUEsSUFBUSxxQkFBb0I7QUFBQSxJQUFpQixLQUFJO0FBQUEsSUFDekQsWUFBVztBQUFBLElBQUksV0FBVTtBQUFBLEVBQzNCLEtBQ0csTUFBTSxJQUFJLENBQUMsU0FDVixvQ0FBQyxTQUFJLEtBQUssS0FBSyxLQUNiLG9DQUFDLFNBQUksT0FBTztBQUFBLElBQ1YsWUFBVztBQUFBLElBQ1gsVUFBVSxVQUFVLE1BQU0sTUFBTTtBQUFBLElBQ2hDLFlBQVksVUFBVSxNQUFNLE1BQU07QUFBQSxJQUNsQyxPQUFPLE9BQU8sVUFBVSxNQUFNLE1BQU0sS0FBSztBQUFBLElBQ3pDLGNBQWE7QUFBQSxFQUNmLEtBQUksS0FBSyxDQUFFLEdBQ1gsb0NBQUMsU0FBSSxPQUFPO0FBQUEsSUFDVixZQUFXO0FBQUEsSUFDWCxVQUFVLFVBQVUsTUFBTSxNQUFNO0FBQUEsSUFDaEMsWUFBWSxVQUFVLE1BQU0sTUFBTTtBQUFBLElBQ2xDLGVBQWUsR0FBRyxVQUFVLE1BQU0sTUFBTSxhQUFhO0FBQUEsSUFDckQsT0FBTyxPQUFPLFVBQVUsTUFBTSxNQUFNLEtBQUs7QUFBQSxJQUN6QyxlQUFlLFVBQVUsTUFBTSxNQUFNLGlCQUFpQjtBQUFBLElBQ3RELGNBQWE7QUFBQSxFQUNmLEtBQUksS0FBSyxDQUFFLEdBQ1gsb0NBQUMsU0FBSSxPQUFPO0FBQUEsSUFDVixVQUFVLFVBQVUsTUFBTSxJQUFJO0FBQUEsSUFDOUIsT0FBTyxPQUFPLFVBQVUsTUFBTSxJQUFJLEtBQUs7QUFBQSxFQUN6QyxLQUFJLEtBQUssQ0FBRSxDQUNiLENBQ0QsQ0FDSCxDQUNGLEdBSUEsb0NBQUMsb0JBQWlCLElBQVEsVUFBb0IsTUFBTSxVQUFTLENBQy9ELENBQ0YsQ0FDRixDQUVBLEdBR0MsZ0JBQWdCLFNBQVMsS0FDeEIsb0NBQUMsdUJBQW9CLE9BQU0sMkNBQVUsb0NBQUMsYUFBUSxXQUFVLDJCQUEwQixPQUFPLEVBQUMsWUFBVyxlQUFlLGNBQWEsd0JBQXVCLEtBQ3RKLG9DQUFDLFNBQUksV0FBVSxnQkFDWCxNQUFNO0FBbnVCcEI7QUFxdUJjLFVBQU0sUUFBTSxrQkFBTyxzQkFBUCxtQkFBMEIsUUFBMUIsZ0NBQXFDLENBQUMsR0FBRywwQkFBMEIsQ0FBQztBQUNoRixVQUFNLEtBQUssU0FBUyxjQUFjLEdBQUcsV0FBVyxrQkFBa0I7QUFDbEUsVUFBTSxNQUFLLG9CQUFTLG1CQUFULFlBQTJCLEdBQUcsZ0JBQTlCLFlBQTZDLGtCQUFrQjtBQUMxRSxVQUFNLE1BQUssb0JBQVMsbUJBQVQsWUFBMkIsR0FBRyxnQkFBOUIsWUFBNkMsa0JBQWtCO0FBQzFFLFVBQU0sTUFBSyxvQkFBUyxtQkFBVCxZQUEyQixHQUFHLGdCQUE5QixZQUE2QyxrQkFBa0I7QUFDMUUsVUFBTSxLQUFLLFNBQVMsZUFBZSxHQUFHLFlBQVksa0JBQWtCO0FBQ3BFLFdBQ0U7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLFNBQVM7QUFBQSxRQUNULE9BQU8sMERBQUcsSUFBRyxvQ0FBQyxVQUFLLFdBQVUsWUFBVSxFQUFHLEdBQVEsRUFBRztBQUFBLFFBQ3JELFVBQVU7QUFBQSxRQUNWLFFBQVEsb0NBQUMsWUFBTyxNQUFLLFVBQVMsV0FBVSxhQUFZLFNBQVMsTUFBTSxHQUFHLE1BQU0sS0FBSSxTQUFTLFNBQVU7QUFBQTtBQUFBLElBQ3JHO0FBQUEsRUFFSixHQUFHLEdBRUgsb0NBQUMsU0FBSSxXQUFXLGdCQUFnQixVQUFVLElBQUksd0JBQXdCLGlCQUNuRSxnQkFBZ0IsSUFBSSxDQUFDLEdBQUcsT0FBTztBQUM5QixVQUFNLE9BQU8sTUFBTSxRQUFRLEVBQUUsSUFBSSxJQUFJLEVBQUUsT0FBUSxPQUFPLEVBQUUsU0FBUyxXQUFXLEVBQUUsS0FBSyxNQUFNLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sT0FBTyxJQUFJLENBQUM7QUFFekksVUFBTSxZQUFZLGdCQUFnQixVQUFVLEtBQUssT0FBTztBQUN4RCxXQUNFO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFBUSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQUEsUUFDdEIsV0FBVTtBQUFBLFFBQ1QsR0FBRyxVQUFVLE1BQU0sYUFBYSxDQUFDLEdBQUcsR0FBRyxFQUFFLFFBQVEsY0FBSSw0QkFBUTtBQUFBLFFBQzlELE9BQU8sRUFBQyxRQUFPLFdBQVcsU0FBUSxRQUFRLGVBQWMsU0FBUTtBQUFBO0FBQUEsTUFDaEUsb0NBQUMsU0FBSSxPQUFPO0FBQUEsUUFDVixRQUFRLFlBQVksTUFBTTtBQUFBLFFBQUssY0FBYTtBQUFBLFFBQUksVUFBUztBQUFBLFFBQVksVUFBUztBQUFBLFFBQzlFLFlBQVksRUFBRSxlQUFlLE9BQU8sRUFBRSxZQUFZLG1CQUFtQjtBQUFBLFFBQ3JFLGNBQWMsRUFBRSxlQUFlLFNBQVM7QUFBQSxNQUMxQyxLQUNHLEVBQUUsVUFDRCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxRQUNWLFVBQVM7QUFBQSxRQUFZLEtBQUk7QUFBQSxRQUFJLE1BQUs7QUFBQSxRQUNsQyxTQUFRO0FBQUEsUUFBVyxZQUFXO0FBQUEsUUFDOUIsWUFBVztBQUFBLFFBQW9CLFVBQVM7QUFBQSxRQUFJLFlBQVc7QUFBQSxRQUN2RCxlQUFjO0FBQUEsUUFBVSxPQUFNO0FBQUEsTUFDaEMsS0FBSSxFQUFFLE1BQU8sQ0FFakI7QUFBQSxNQUNDLEtBQUssU0FBUyxLQUNiLG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsUUFBUSxLQUFJLEdBQUcsY0FBYSxJQUFJLFVBQVMsT0FBTSxLQUNqRSxLQUFLLE1BQU0sR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQ3JCLG9DQUFDLFVBQUssS0FBSyxHQUFHLFdBQVUsU0FBUSxPQUFPLEVBQUMsVUFBUyxFQUFDLEtBQUksQ0FBRSxDQUN6RCxDQUNIO0FBQUEsTUFFRixvQ0FBQyxRQUFHLFdBQVUsWUFBVyxPQUFPLEVBQUMsVUFBVSxZQUFZLEtBQUssSUFBSSxZQUFXLEtBQUssY0FBYSxHQUFHLFlBQVcsS0FBSSxLQUFJLEVBQUUsUUFBUSwyQkFBUTtBQUFBLE1BQ3BJLEVBQUUsWUFDRCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxRQUNWLFlBQVc7QUFBQSxRQUFvQixVQUFTO0FBQUEsUUFBSSxZQUFXO0FBQUEsUUFDdkQsT0FBTTtBQUFBLFFBQW9CLGVBQWM7QUFBQSxRQUFVLGNBQWE7QUFBQSxNQUNqRSxLQUFJLEVBQUUsUUFBUztBQUFBLE1BRWhCLEVBQUUsUUFBUSxvQ0FBQyxPQUFFLE9BQU8sRUFBQyxVQUFVLFlBQVksS0FBSyxJQUFJLFlBQVcsS0FBSyxPQUFNLGVBQWMsS0FBSSxFQUFFLElBQUs7QUFBQSxJQUN0RztBQUFBLEVBRUosQ0FBQyxDQUNILENBQ0YsQ0FDRixDQUFVLEdBSVgsTUFBTSxTQUFTLEtBQ2Qsb0NBQUMsdUJBQW9CLE9BQU0sMkNBQVUsb0NBQUMsYUFBUSxXQUFVLGlCQUFnQixPQUFPLEVBQUMsY0FBYSx3QkFBdUIsS0FDbEgsb0NBQUMsU0FBSSxXQUFVLGVBRWIsb0NBQUMsU0FBSSxXQUFVLHVDQUNiLG9DQUFDLGFBQ0Msb0NBQUMsU0FBSSxXQUFVLG1CQUFrQixlQUFZLFVBQVEsU0FBUyxXQUFZLEdBQzFFLG9DQUFDLFFBQUcsV0FBVSxtQkFDWCxTQUFTLFdBQ1Ysb0NBQUMsVUFBSyxXQUFVLFFBQU8sT0FBTztBQUFBLElBQzVCLFVBQVM7QUFBQSxJQUFJLFlBQVc7QUFBQSxJQUFLLGVBQWM7QUFBQSxJQUMzQyxPQUFNO0FBQUEsSUFBZ0IsWUFBVztBQUFBLElBQUksZUFBYztBQUFBLEVBQ3JELEtBQUcsU0FBRyxNQUFNLFFBQU8scUJBQUksQ0FDekIsQ0FDRixHQUNBLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsYUFBWSxTQUFTLE1BQU0sR0FBRyxNQUFNLEtBQUksU0FBUyxVQUFXLENBQzlGLEdBQ0Esb0NBQUMsU0FBSSxXQUFVLGlCQUNaLE1BQU0sSUFBSSxDQUFDLEdBQUcsTUFDYjtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQVEsS0FBSyxFQUFFO0FBQUEsTUFBSSxXQUFVO0FBQUEsTUFDM0IsR0FBRyxVQUFVLE1BQU0sR0FBRyxNQUFNLEdBQUcsaUJBQU8sRUFBRSxLQUFLLEVBQUU7QUFBQSxNQUNoRCxPQUFPLEVBQUMsUUFBTyxXQUFXLFVBQVMsV0FBVTtBQUFBO0FBQUEsSUFDN0Msb0NBQUMsU0FBSSxXQUFVLFFBQU8sT0FBTztBQUFBLE1BQzNCLFVBQVM7QUFBQSxNQUFZLEtBQUk7QUFBQSxNQUFJLE9BQU07QUFBQSxNQUNuQyxVQUFTO0FBQUEsTUFBSSxPQUFNO0FBQUEsTUFBZ0IsZUFBYztBQUFBLElBQ25ELEtBQUcsS0FBRSxJQUFFLENBQUU7QUFBQSxJQUNULG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsUUFBUSxLQUFJLEdBQUcsY0FBYSxJQUFJLFVBQVMsT0FBTSxLQUNqRSxFQUFFLFNBQVMsb0NBQUMsVUFBSyxXQUFVLFdBQVMsRUFBRSxLQUFNLEdBQzVDLEVBQUUsWUFBWSxvQ0FBQyxVQUFLLFdBQVUsV0FBUyxFQUFFLFFBQVMsR0FDbEQsRUFBRSxTQUFTLG9DQUFDLFVBQUssV0FBVSxXQUFTLEVBQUUsS0FBTSxDQUMvQztBQUFBLElBQ0Esb0NBQUMsUUFBRyxXQUFVLGNBQWEsT0FBTyxFQUFDLFVBQVMsSUFBSSxjQUFhLEdBQUUsS0FBSSxFQUFFLEtBQU07QUFBQSxJQUMxRSxFQUFFLFFBQVEsb0NBQUMsT0FBRSxXQUFVLE9BQU0sT0FBTyxFQUFDLFVBQVMsSUFBSSxZQUFXLEtBQUssY0FBYSxHQUFFLEtBQUksZ0JBQWdCLEVBQUUsTUFBTSxHQUFHLENBQUU7QUFBQSxJQUNuSCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFNBQVE7QUFBQSxNQUFRLGdCQUFlO0FBQUEsTUFBaUIsWUFBVztBQUFBLE1BQzNELFdBQVU7QUFBQSxNQUF5QixZQUFXO0FBQUEsSUFDaEQsS0FDRSxvQ0FBQyxhQUNDLG9DQUFDLFNBQUksV0FBVSxRQUFPLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxLQUFLLGVBQWMsVUFBVSxPQUFNLGVBQWMsS0FBSSxTQUFTLGFBQWMsR0FDbEksb0NBQUMsU0FBSSxPQUFPLEVBQUMsVUFBUyxJQUFJLFdBQVUsR0FBRyxPQUFNLGNBQWMsWUFBVyxJQUFHLEtBQUksRUFBRSxRQUFRLFNBQVMsYUFBYyxDQUNoSCxHQUNBLG9DQUFDLFNBQUksT0FBTyxFQUFDLFdBQVUsUUFBTyxLQUM1QixvQ0FBQyxTQUFJLFdBQVUsUUFBTyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxlQUFjLFVBQVUsT0FBTSxlQUFjLEtBQUksU0FBUyxjQUFlLEdBQ25JLG9DQUFDLFNBQUksV0FBVSxZQUFXLE9BQU8sRUFBQyxVQUFTLElBQUksV0FBVSxHQUFHLE9BQU0sY0FBYyxZQUFXLElBQUcsS0FBSSxFQUFFLFFBQVMsT0FBTyxFQUFFLFVBQVUsV0FBVyxPQUFPLFNBQVMsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFLFFBQVMsU0FBUyxhQUFjLENBQzlNLENBQ0Y7QUFBQSxFQUNGLENBQ0QsQ0FDSCxDQUNGLENBQ0YsQ0FBVSxHQUlaLG9DQUFDLHVCQUFvQixPQUFNLDhCQUFPLG9DQUFDLGFBQVEsV0FBVSxnQkFBZSxPQUFPLEVBQUMsWUFBVyxlQUFlLGNBQWEsd0JBQXVCLEtBQ3hJLG9DQUFDLFNBQUksV0FBVSxlQUViLG9DQUFDLFNBQUksT0FBTztBQUFBLElBQ1YsU0FBUTtBQUFBLElBQVEsZ0JBQWU7QUFBQSxJQUFpQixZQUFXO0FBQUEsSUFDM0QsS0FBSTtBQUFBLElBQUksVUFBUztBQUFBLElBQVEsY0FBYTtBQUFBLElBQUksZUFBYztBQUFBLElBQ3hELGNBQWE7QUFBQSxFQUNmLEtBQ0Usb0NBQUMsU0FBSSxPQUFPLEVBQUMsTUFBSyxhQUFhLFVBQVMsRUFBQyxLQUN2QyxvQ0FBQyxTQUFJLFdBQVUsbUJBQWtCLGVBQVksVUFBUSxTQUFTLGdCQUFpQixHQUMvRSxvQ0FBQyxRQUFHLFdBQVUsaUJBQWdCLE9BQU8sRUFBQyxVQUFTLElBQUksY0FBYSxFQUFDLEtBQUksU0FBUyxjQUFlLENBQy9GLEdBQ0MsU0FBUyxxQkFDUixvQ0FBQyxPQUFFLE9BQU87QUFBQSxJQUNSLE1BQUs7QUFBQSxJQUFhLFVBQVM7QUFBQSxJQUFJLE9BQU07QUFBQSxJQUNyQyxZQUFXO0FBQUEsSUFBSyxRQUFPO0FBQUEsSUFBRyxVQUFTO0FBQUEsRUFDckMsS0FBSSxTQUFTLGlCQUFrQixHQUVqQyxvQ0FBQyxZQUFPLE1BQUssVUFBUyxXQUFVLGFBQVksU0FBUyxNQUFNLEdBQUcsV0FBVyxLQUFJLFNBQVMsZUFBZ0IsQ0FDeEcsR0FDQyxZQUFZLFNBQVMsSUFDcEIsb0NBQUMsU0FBSSxPQUFPLEVBQUMsUUFBTyx3QkFBdUIsS0FDeEMsWUFBWSxJQUFJLENBQUMsTUFBTSxNQUFHO0FBajNCekM7QUFrM0JnQjtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQUksS0FBSyxLQUFLO0FBQUEsUUFDWixHQUFHLFVBQVUsTUFBTSxHQUFHLFdBQVcsR0FBRyxLQUFLLEtBQUs7QUFBQSxRQUMvQyxPQUFPO0FBQUEsVUFDTCxTQUFRO0FBQUEsVUFBUSxLQUFJO0FBQUEsVUFBSSxZQUFXO0FBQUEsVUFDbkMsU0FBUTtBQUFBLFVBQ1IsWUFBWSxJQUFJLE1BQU0sSUFBSSxjQUFjO0FBQUEsVUFDeEMsY0FBYyxJQUFJLFlBQVksU0FBUyxJQUFJLDBCQUEwQjtBQUFBLFFBQ3ZFO0FBQUE7QUFBQSxNQUNBLG9DQUFDLFNBQUksT0FBTyxFQUFDLE1BQUssR0FBRyxVQUFTLEVBQUMsS0FDN0Isb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLEtBQUksR0FBRyxZQUFXLFVBQVUsY0FBYSxHQUFHLFVBQVMsT0FBTSxLQUNyRixLQUFLLFlBQVksb0NBQUMsVUFBSyxXQUFVLFNBQVEsT0FBTyxFQUFDLFVBQVMsRUFBQyxLQUFJLEtBQUssUUFBUyxHQUM3RSxLQUFLLFVBQ0osb0NBQUMsVUFBSyxPQUFPO0FBQUEsUUFDWCxZQUFXO0FBQUEsUUFBb0IsVUFBUztBQUFBLFFBQUcsWUFBVztBQUFBLFFBQ3RELE9BQU07QUFBQSxRQUFvQixlQUFjO0FBQUEsTUFDMUMsS0FBRyxLQUFFLEtBQUssUUFBTyxHQUFDLENBRXRCLEdBQ0Esb0NBQUMsU0FBSSxXQUFVLFlBQVcsT0FBTyxFQUFDLFVBQVMsSUFBSSxPQUFNLGNBQWMsY0FBYSxHQUFHLFlBQVcsSUFBRyxLQUFJLEtBQUssS0FBTSxHQUNoSCxvQ0FBQyxTQUFJLE9BQU8sRUFBQyxVQUFTLElBQUksT0FBTSxnQkFBZ0IsWUFBVyxtQkFBa0IsS0FDMUUsS0FBSyxRQUFPLFVBQUksS0FBSyxJQUN4QixDQUNGO0FBQUEsTUFDQSxvQ0FBQyxTQUFJLE9BQU87QUFBQSxRQUNWLFNBQVE7QUFBQSxRQUFRLEtBQUk7QUFBQSxRQUFJLE9BQU07QUFBQSxRQUM5QixZQUFXO0FBQUEsUUFBb0IsVUFBUztBQUFBLFFBQUksWUFBVztBQUFBLFFBQUcsWUFBVztBQUFBLE1BQ3ZFLEtBQ0Usb0NBQUMsY0FBTSxTQUFTLHFCQUFvQixNQUFFLFVBQUssWUFBTCxZQUFnQixDQUFFLEdBQ3hELG9DQUFDLFVBQUssT0FBTyxFQUFDLE9BQU0sZUFBYyxLQUFHLFFBQUMsQ0FDeEM7QUFBQSxJQUNGO0FBQUEsR0FDRCxDQUNILElBRUEsb0NBQUMsU0FBSSxXQUFVLFFBQU8sT0FBTyxFQUFDLFdBQVUsVUFBVSxTQUFRLEdBQUUsS0FDMUQsb0NBQUMsU0FBSSxPQUFPLEVBQUMsWUFBVyxxQkFBcUIsVUFBUyxJQUFJLE9BQU0sY0FBYyxjQUFhLElBQUksWUFBVyxJQUFHLEtBQzFHLFNBQVMsbUJBQ1osR0FDQSxvQ0FBQyxPQUFFLE9BQU8sRUFBQyxVQUFTLElBQUksT0FBTSxnQkFBZ0IsY0FBYSxJQUFJLFlBQVcsSUFBRyxLQUMxRSxTQUFTLHNCQUNaLEdBQ0Esb0NBQUMsWUFBTyxXQUFVLGdCQUFlLFNBQVMsTUFBTSxHQUFHLFdBQVcsS0FBSSxTQUFTLGlCQUFrQixDQUMvRixDQUVKLENBQ0YsQ0FBVSxHQUdULGtCQUNDLG9DQUFDLHVCQUFvQixPQUFNLGtCQUFLLG9DQUFDLGFBQVEsV0FBVSxnQkFBZSxPQUFPLEVBQUMsY0FBYSx3QkFBdUIsS0FDNUcsb0NBQUMsU0FBSSxXQUFVLGVBRWIsb0NBQUMsU0FBSSxPQUFPO0FBQUEsSUFDVixTQUFRO0FBQUEsSUFBUSxnQkFBZTtBQUFBLElBQWlCLFlBQVc7QUFBQSxJQUMzRCxjQUFhO0FBQUEsSUFBSSxLQUFJO0FBQUEsSUFBSSxVQUFTO0FBQUEsRUFDcEMsS0FDRSxvQ0FBQyxTQUFJLFdBQVUsbUJBQWtCLGVBQVksUUFBTyxPQUFPLEVBQUMsUUFBTyxFQUFDLEtBQUksU0FBUyxhQUFjLEdBQy9GLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsYUFBWSxTQUFTLE1BQU0sR0FBRyxRQUFRLEtBQUksU0FBUyxZQUFhLENBQ2xHLEdBQ0Esb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLHFCQUFvQixhQUFhLEtBQUksR0FBRSxHQUFHLFdBQVUsY0FFL0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUNDLE9BQU8sRUFBQyxRQUFPLFVBQVM7QUFBQSxNQUN2QixHQUFHLFVBQVUsTUFBTSxHQUFHLFFBQVEsR0FBRyxpQkFBTyxlQUFlLEtBQUssRUFBRTtBQUFBO0FBQUEsSUFDN0QsZUFBZSxZQUFZLGVBQWUsYUFDMUMsb0NBQUMsU0FBSSxPQUFPO0FBQUEsTUFDVixRQUFPO0FBQUEsTUFBSyxjQUFhO0FBQUEsTUFDekIsaUJBQWdCLE9BQU8sZUFBZSxZQUFZLGVBQWUsVUFBVTtBQUFBLE1BQzNFLGdCQUFlO0FBQUEsTUFBUyxvQkFBbUI7QUFBQSxJQUM3QyxHQUFFLElBRUYsb0NBQUMsU0FBSSxPQUFPO0FBQUEsTUFDVixRQUFPO0FBQUEsTUFBSyxZQUFXO0FBQUEsTUFBZSxjQUFhO0FBQUEsTUFDbkQsU0FBUTtBQUFBLE1BQVEsWUFBVztBQUFBLE1BQVUsV0FBVTtBQUFBLE1BQXlCLGNBQWE7QUFBQSxJQUN2RixLQUNFLG9DQUFDLFNBQUksT0FBTyxFQUFDLFlBQVcsb0JBQW9CLFVBQVMsR0FBRyxZQUFXLEtBQUssT0FBTSxnQkFBZ0IsZUFBYyxTQUFRLEtBQUcsaUJBQWUsQ0FDeEk7QUFBQSxJQUVGLG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsUUFBUSxLQUFJLElBQUksWUFBVyxVQUFVLGNBQWEsSUFBSSxVQUFTLE9BQU0sS0FDdkYsZUFBZSxZQUFZLG9DQUFDLFVBQUssV0FBVSxVQUFRLGVBQWUsUUFBUyxHQUMzRSxlQUFlLFFBQVEsb0NBQUMsVUFBSyxXQUFVLGNBQWEsT0FBTyxFQUFDLFVBQVMsR0FBRSxLQUFJLGVBQWUsSUFBSyxHQUMvRixlQUFlLFlBQVksb0NBQUMsVUFBSyxXQUFVLGNBQWEsT0FBTyxFQUFDLFVBQVMsR0FBRSxLQUFHLFNBQUcsZUFBZSxRQUFTLENBQzVHO0FBQUEsSUFFQSxvQ0FBQyxRQUFHLE9BQU87QUFBQSxNQUNULFlBQVc7QUFBQSxNQUFxQixVQUFTO0FBQUEsTUFDekMsWUFBVztBQUFBLE1BQUssWUFBVztBQUFBLE1BQUssY0FBYTtBQUFBLE1BQUksT0FBTTtBQUFBLE1BQ3ZELGVBQWM7QUFBQSxJQUNoQixLQUFJLGVBQWUsS0FBTTtBQUFBLElBQ3hCLGVBQWUsV0FDZCxvQ0FBQyxPQUFFLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxNQUFNLE9BQU0sZ0JBQWdCLGNBQWEsSUFBSSxVQUFTLElBQUcsS0FBSSxlQUFlLE9BQVE7QUFBQSxJQUV6SCxvQ0FBQyxTQUFJLFdBQVUsUUFBTyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxlQUFjLFNBQVMsT0FBTSxtQkFBa0IsS0FBSSxTQUFTLGNBQWU7QUFBQSxFQUN4SSxHQUVBLG9DQUFDLFdBQU0sT0FBTyxFQUFDLFlBQVcsRUFBQyxLQUN6QixvQ0FBQyxTQUFJLFdBQVUsUUFBTyxPQUFPO0FBQUEsSUFDM0IsVUFBUztBQUFBLElBQUksWUFBVztBQUFBLElBQUssZUFBYztBQUFBLElBQzNDLE9BQU07QUFBQSxJQUFnQixjQUFhO0FBQUEsSUFBSSxlQUFjO0FBQUEsRUFDdkQsS0FBSSxTQUFTLFdBQVksR0FDeEIsaUJBQWlCLElBQUksQ0FBQyxHQUFHLE9BQ3hCO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFBSSxLQUFLLEVBQUU7QUFBQSxNQUNULEdBQUcsVUFBVSxNQUFNLEdBQUcsUUFBUSxHQUFHLGlCQUFPLEVBQUUsS0FBSyxFQUFFO0FBQUEsTUFDbEQsT0FBTztBQUFBLFFBQ0wsU0FBUTtBQUFBLFFBQ1IsY0FBYyxLQUFLLGlCQUFpQixTQUFTLElBQUksMEJBQTBCO0FBQUEsUUFDM0UsUUFBTztBQUFBLE1BQ1Q7QUFBQTtBQUFBLElBQ0Esb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLEtBQUksSUFBSSxZQUFXLFVBQVUsY0FBYSxHQUFHLFVBQVMsT0FBTSxLQUN0RixFQUFFLFlBQVksb0NBQUMsVUFBSyxXQUFVLFFBQU8sT0FBTyxFQUFDLFVBQVMsR0FBRyxTQUFRLFVBQVMsS0FBSSxFQUFFLFFBQVMsR0FDekYsRUFBRSxRQUFRLG9DQUFDLFVBQUssV0FBVSxjQUFhLE9BQU8sRUFBQyxVQUFTLEdBQUUsS0FBSSxFQUFFLElBQUssQ0FDeEU7QUFBQSxJQUNBLG9DQUFDLFFBQUcsV0FBVSxZQUFXLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxLQUFLLFlBQVcsS0FBSyxjQUFhLEVBQUMsS0FBSSxFQUFFLEtBQU07QUFBQSxJQUN2RyxFQUFFLFdBQVcsb0NBQUMsT0FBRSxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxPQUFNLGdCQUFnQixRQUFPLEVBQUMsTUFBSyxFQUFFLFdBQVMsSUFBSSxNQUFNLEdBQUUsRUFBRSxHQUFFLFFBQUM7QUFBQSxFQUN2SCxDQUNELEdBQ0EsaUJBQWlCLFdBQVcsS0FDM0Isb0NBQUMsT0FBRSxPQUFPLEVBQUMsVUFBUyxJQUFJLE9BQU0sZ0JBQWdCLFNBQVEsU0FBUSxLQUFJLFNBQVMsV0FBWSxDQUUzRixDQUNGLENBQ0YsQ0FDRixDQUFVLEdBSVgsU0FBUyxTQUFTLEtBQ2pCLG9DQUFDLHVCQUFvQixPQUFNLGtCQUFLLG9DQUFDLGFBQVEsV0FBVSxpQkFBZ0IsT0FBTyxFQUFDLFlBQVcsZUFBZSxjQUFhLHdCQUF1QixLQUN2SSxvQ0FBQyxTQUFJLFdBQVUsZUFFYixvQ0FBQyxTQUFJLFdBQVUsdUNBQ2Isb0NBQUMsYUFDQyxvQ0FBQyxTQUFJLFdBQVUsbUJBQWtCLGVBQVksVUFBUSxTQUFTLGVBQWdCLEdBQzlFLG9DQUFDLFFBQUcsV0FBVSxtQkFBaUIsU0FBUyxhQUFjLENBQ3hELEdBQ0Esb0NBQUMsWUFBTyxNQUFLLFVBQVMsV0FBVSxhQUFZLFNBQVMsTUFBTSxHQUFHLFVBQVUsS0FBSSxTQUFTLGNBQWUsQ0FDdEcsR0FFQSxvQ0FBQyxTQUFJLFdBQVUsaUJBQWdCLE1BQUssVUFDakMsU0FBUyxJQUFJLENBQUMsWUFDYjtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQVEsS0FBSyxRQUFRO0FBQUEsTUFDcEIsTUFBSztBQUFBLE1BQ0wsV0FBVTtBQUFBLE1BQ1QsR0FBRyxVQUFVLE1BQU07QUFDbEIsWUFBSTtBQUFFLHlCQUFlLFFBQVEsMkJBQTJCLE9BQU8sUUFBUSxFQUFFLENBQUM7QUFBQSxRQUFHLFNBQVE7QUFBQSxRQUFDO0FBQ3RGLFdBQUcsVUFBVTtBQUFBLE1BQ2YsR0FBRyxpQkFBTyxRQUFRLFNBQVMsUUFBUSxLQUFLLEVBQUU7QUFBQSxNQUMxQyxPQUFPLEVBQUMsUUFBTyxXQUFXLFNBQVEsUUFBUSxlQUFjLFNBQVE7QUFBQTtBQUFBLElBQ2hFLG9DQUFDLFVBQUssV0FBVSxTQUFRLE9BQU8sRUFBQyxjQUFhLElBQUksV0FBVSxhQUFZLEtBQUksU0FBUyxZQUFhO0FBQUEsSUFDakcsb0NBQUMsUUFBRyxXQUFVLFlBQVcsT0FBTyxFQUFDLFVBQVMsSUFBSSxZQUFXLEtBQUssY0FBYSxHQUFHLE1BQUssV0FBVSxLQUFJLFFBQVEsU0FBUyxRQUFRLEtBQU07QUFBQSxJQUMvSCxRQUFRLFFBQVEsb0NBQUMsT0FBRSxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxPQUFNLGdCQUFnQixjQUFhLElBQUksTUFBSyxXQUFVLEtBQUksZ0JBQWdCLFFBQVEsTUFBTSxHQUFHLENBQUU7QUFBQSxJQUN0SixvQ0FBQyxTQUFJLE9BQU8sRUFBQyxXQUFVLHlCQUF5QixZQUFXLElBQUksU0FBUSxRQUFRLGdCQUFlLGlCQUFpQixXQUFVLE9BQU0sS0FDN0gsb0NBQUMsVUFBSyxPQUFPLEVBQUMsVUFBUyxJQUFJLE9BQU0sZUFBYyxLQUFJLFFBQVEsU0FBUyxTQUFTLGFBQWMsR0FDM0Ysb0NBQUMsVUFBSyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsb0JBQW9CLFlBQVcsS0FBSyxPQUFNLGFBQVksS0FBSSxRQUFRLFFBQVEsU0FBUyxhQUFjLENBQ3pJO0FBQUEsRUFDRixDQUNELENBQ0gsR0FFQyxTQUFTLFVBQVUsS0FDbEIsb0NBQUMsU0FBSSxXQUFVLFFBQU8sT0FBTztBQUFBLElBQzNCLFdBQVU7QUFBQSxJQUFJLFVBQVM7QUFBQSxJQUFJLFlBQVc7QUFBQSxJQUFLLGVBQWM7QUFBQSxJQUN6RCxPQUFNO0FBQUEsSUFBZ0IsV0FBVTtBQUFBLEVBQ2xDLEtBQUcscURBQVcsQ0FFbEIsQ0FDRixDQUFVLEdBSVosb0NBQUMsdUJBQW9CLElBQVEsVUFBb0IsTUFBTSxVQUFTLENBRWxFO0FBRUo7QUFFQSxPQUFPLE9BQU8sUUFBUSxFQUFFLFNBQVMsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

})();

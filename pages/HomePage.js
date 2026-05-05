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
    var _a, _b;
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
    } }, b.subtitle), introText && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, lineHeight: 1.85, color: "var(--ink-2)", marginBottom: 28, whiteSpace: "pre-wrap", maxWidth: 560 } }, introText), (hasPriceKR || hasPriceEN) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20, marginBottom: 32, alignItems: "flex-end" } }, hasPriceKR && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, text.bookKrLabel), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, marginTop: 4, color: "var(--ink)", fontWeight: 700 } }, Number(b.priceKR).toLocaleString(), "\uC6D0")), hasPriceKR && hasPriceEN && /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "var(--line-2)", alignSelf: "stretch" } }), hasPriceEN && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, text.bookEnLabel), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, marginTop: 4, color: "var(--ink)", fontWeight: 700 } }, Number(b.priceEN).toLocaleString(), "\uC6D0"))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("book") }, text.bookBuyCta)), /* @__PURE__ */ React.createElement("div", { style: {
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
  var _a, _b, _c;
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
  const _hasValidDate = (iso) => {
    if (!iso) return false;
    const t = Date.parse(iso);
    return !isNaN(t);
  };
  const publicColumns = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COLUMNS) == null ? void 0 : _a2.listPublic) == null ? void 0 : _b2.call(_a2);
  }), [dataTick]);
  const featuredColumn = publicColumns[0];
  const secondaryColumns = publicColumns.slice(1, 5);
  const recentPosts = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.listPosts) == null ? void 0 : _b2.call(_a2);
  }).slice(0, 4), [dataTick]);
  const tours = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_TOURS) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
  }).filter((t) => t && !t.hidden).slice(0, 4), [dataTick]);
  const lectures = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
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
      } }, /* @__PURE__ */ React.createElement("span", null, homeText.communityReplyLabel, " ", (_a2 = post.replies) != null ? _a2 : 0), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-2)" } }, "\u2192"))
    );
  })) : /* @__PURE__ */ React.createElement("div", { className: "card", style: { textAlign: "center", padding: 60 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--ink)", marginBottom: 12, fontWeight: 600 } }, homeText.communityEmptyTitle), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-2)", marginBottom: 24, lineHeight: 1.7 } }, homeText.communityEmptySubtitle), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("community") }, homeText.communityEmptyCta))))), featuredColumn && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCE7C\uB7FC" }, /* @__PURE__ */ React.createElement("section", { className: "section--mid", style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: {
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
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("column") }, homeText.columnAction))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56 }, className: "col-grid" }, /* @__PURE__ */ React.createElement(
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
      className: "card card--bare",
      ...clickable(() => {
        try {
          sessionStorage.setItem("bgnj_pending_lecture_id", String(lecture.id));
        } catch (e) {
        }
        go("lectures");
      }, `\uAC15\uC5F0: ${lecture.topic || lecture.title}`),
      style: { cursor: "pointer", display: "flex", flexDirection: "column", padding: "4px 4px 12px" }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvSG9tZVBhZ2UuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVENjQ4XHVEMzk4XHVDNzc0XHVDOUMwIFx1MjAxNCBcdUQ1NUNcdUFENkQgXHVDNUVDXHVENTg5XHUwMEI3XHVDNUVEXHVDMEFDXHUwMEI3XHVCQjM4XHVENjU0IFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFxuLy8gXHVCMzcwXHVDNzc0XHVEMTMwIFx1QzZEMFx1Q0U1OSAodjAwLjA0Nik6XG4vLyAgIDEuIFx1QkFBOFx1QjRFMCBcdUNGNThcdUQxNTBcdUNFMjBcdUIyOTQgXHVDMTFDXHVCQzg0KEQxKSBzb3VyY2Utb2YtdHJ1dGguXG4vLyAgICAgIC0gc2MucmVjb21tZW5kYXRpb25zICAgIFx1MjE5MiBzaXRlX2NvbnRlbnRfa3YgKFx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUNGNThcdUQxNTBcdUNFMjAgXHVEMzI4XHVCMTEwKVxuLy8gICAgICAtIHB1YmxpY0NvbHVtbnMgICAgICAgICBcdTIxOTIgQkdOSl9BUEkuY29sdW1ucy5saXN0IChEMS51c2VyX2NvbHVtbnMpXG4vLyAgICAgIC0gdG91cnMgLyBsZWN0dXJlcyAgICAgIFx1MjE5MiBCR05KX0FQSS50b3Vycy9sZWN0dXJlcy5saXN0XG4vLyAgICAgIC0gcmVjZW50UG9zdHMgICAgICAgICAgIFx1MjE5MiBCR05KX0FQSS5jb21tdW5pdHkucG9zdHNcbi8vICAgMi4gQkFOR0lOT0pBX0RBVEEgXHVDODE1XHVDODAxIFx1QzJEQ1x1QjREQ1x1QjI5NCBcdUIzNTQgXHVDNzc0XHVDMEMxIFx1Q0MzOFx1Qzg3MFx1RDU1OFx1QzlDMCBcdUM1NEFcdUIyOTRcdUIyRTQuXG4vLyAgIDMuIFx1QzExQ1x1QkM4NCBcdUM3NTFcdUIyRjVcdUM3NzQgXHVCRTQ0XHVCQTc0IFx1RDU3NFx1QjJGOSBcdUMxMzlcdUMxNTggXHVDNzkwXHVDQ0I0XHVCOTdDIFx1QjgwQ1x1QjM1NFx1RDU1OFx1QzlDMCBcdUM1NEFcdUIyOTRcdUIyRTQgKFx1QUU2MVx1RDFCNSBcdUNFNzRcdUI0REMgXHVBRTA4XHVDOUMwKS5cbi8vICAgNC4gXHVCQUE4XHVCNEUwIFx1RDVFQ1x1RDM3QyBcdUQ2MzhcdUNEOUNcdUM3NDAgQkdOSl9HVUFSRC5hcnIvLmNhbGwgXHVCODVDIHRyeS9jYXRjaCArIFx1RDBDMFx1Qzc4NSBcdUFDMDBcdUI0REMgXHVEMUI1XHVBQ0ZDLlxuXG5jb25zdCBEZXN0aW5hdGlvbk1hcE1vZGFsID0gKHsgb25DbG9zZSwgZ28gfSkgPT4ge1xuICBjb25zdCBbc2VsZWN0ZWREZXN0LCBzZXRTZWxlY3RlZERlc3RdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIC8vIHYwMC4wNzcgXHUyMDE0IHVzZU1vZGFsR3VhcmQgXHVEMUI1XHVDNzdDIChFU0MgKyBib2R5IHNjcm9sbCBsb2NrICsgcG9wc3RhdGUpLiBcdUM3N0RcdUFFMzAgXHVDODA0XHVDNkE5IFx1MjE5MiBkaXJ0eT1mYWxzZS5cbiAgd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiBmYWxzZSwgb25DbG9zZSwgb25TYXZlRHJhZnQ6IG51bGwsIGxhYmVsOiAnXHVDNUVDXHVENTg5XHVDOUMwIFx1QzlDMFx1QjNDNCBcdUQwRDBcdUMwQzknIH0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIlx1QzVFQ1x1RDU4OVx1QzlDMCBcdUM5QzBcdUIzQzQgXHVEMEQwXHVDMEM5XCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGluc2V0OjAsIHpJbmRleDoyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6J3JnYmEoMTUsMjMsNDIsMC41NSknLFxuICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgcGFkZGluZzoyMCxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkgb25DbG9zZSgpOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgbWF4V2lkdGg6NjgwLCB3aWR0aDonMTAwJScsIG1heEhlaWdodDonOTJ2aCcsXG4gICAgICAgIG92ZXJmbG93OidhdXRvJywgcGFkZGluZzonMzJweCAyOHB4IDI4cHgnLCBwb3NpdGlvbjoncmVsYXRpdmUnLFxuICAgICAgICBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfSBhcmlhLWxhYmVsPVwiXHVCMkVCXHVBRTMwXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgdG9wOjE0LCByaWdodDoxNCxcbiAgICAgICAgICAgIHdpZHRoOjM2LCBoZWlnaHQ6MzYsIGZvbnRTaXplOjI0LFxuICAgICAgICAgICAgYmFja2dyb3VuZDondHJhbnNwYXJlbnQnLCBib3JkZXI6J25vbmUnLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgY29sb3I6J3ZhcigtLWluay0yKScsIGxpbmVIZWlnaHQ6MSxcbiAgICAgICAgICB9fT5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBzdHlsZT17e21hcmdpbkJvdHRvbToxNH19PkRFU1RJTkFUSU9OUyBcdTAwQjcgXHVDNUVDXHVENTg5XHVDOUMwIFx1QzlDMFx1QjNDNDwvZGl2PlxuICAgICAgICA8aDIgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LWRpc3BsYXkpJywgZm9udFNpemU6MjYsIGZvbnRXZWlnaHQ6OTAwLCBtYXJnaW5Cb3R0b206MTAsIGxpbmVIZWlnaHQ6MS4yfX0+XG4gICAgICAgICAgXHVDOUMwXHVCM0M0XHVCOTdDIFx1RDA3NFx1QjlBRFx1RDU3NCBcdUQwRDBcdUMwQzlcdUQ1NThcdUMxMzhcdUM2OTRcbiAgICAgICAgPC9oMj5cbiAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyMCwgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICBcdUMyRENcdUIzQzRcdUI5N0MgXHVCMjA0XHVCOTc0XHVCQTc0IFx1QzgxNVx1QkNGNFx1QUMwMCBcdUQzQkNcdUNDRDBcdUM5RDFcdUIyQzhcdUIyRTQuIFx1RDYzOFx1QkM4NFx1RDU1OFx1QkE3NCBcdUM5QzBcdUJBODVcdUM3NzQgXHVENDVDXHVDMkRDXHVCNDI5XHVCMkM4XHVCMkU0LlxuICAgICAgICA8L3A+XG4gICAgICAgIHt0eXBlb2YgS29yZWFNYXAgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgPEtvcmVhTWFwXG4gICAgICAgICAgICBvblNlbGVjdD17KGRlc3QpID0+IHNldFNlbGVjdGVkRGVzdChzZWxlY3RlZERlc3Q/LmlkID09PSBkZXN0LmlkID8gbnVsbCA6IGRlc3QpfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkRGVzdD8uaWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7aGVpZ2h0OjMwMCwgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIGNvbG9yOid2YXIoLS1pbmstMyknLCBmb250U2l6ZToxM319Plx1QzlDMFx1QjNDNCBcdUI4NUNcdUI1MjkgXHVDOTExLi4uPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHtzZWxlY3RlZERlc3QgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIG1hcmdpblRvcDoxOCwgcGFkZGluZzonMThweCAyMHB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidiYXNlbGluZScsIGdhcDoxMCwgbWFyZ2luQm90dG9tOjgsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MjIsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo2MDB9fT57c2VsZWN0ZWREZXN0Lm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMTJlbSd9fT57c2VsZWN0ZWREZXN0LmZ1bGxuYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge3NlbGVjdGVkRGVzdC5kZXNjICYmIChcbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxNCwgY29sb3I6J3ZhcigtLWluay0yKScsIGxpbmVIZWlnaHQ6MS43LCBtYXJnaW5Cb3R0b206MTJ9fT57c2VsZWN0ZWREZXN0LmRlc2N9PC9wPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtzZWxlY3RlZERlc3QudGFncyAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjYsIGZsZXhXcmFwOid3cmFwJywgbWFyZ2luQm90dG9tOjE0fX0+XG4gICAgICAgICAgICAgICAge1N0cmluZyhzZWxlY3RlZERlc3QudGFncykuc3BsaXQoJ1x1MDBCNycpLm1hcCgodCkgPT4gdC50cmltKCkpLmZpbHRlcihCb29sZWFuKS5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGtleT17dH0gY2xhc3NOYW1lPVwiYmFkZ2VcIiBzdHlsZT17e2ZvbnRTaXplOjEwfX0+e3R9PC9zcGFuPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiB7IGdvKCd0b3VyJyk7IG9uQ2xvc2UoKTsgfX0+XG4gICAgICAgICAgICAgIFx1Qzc3NCBcdUM5QzBcdUM1RUQgXHVEMjJDXHVDNUI0IFx1QkNGNFx1QUUzMCBcdTIxOTJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdUMxMzlcdUMxNTggXHVCMkU4XHVDNzA0IFx1QzVEMFx1QjdFQyBcdUJDMTRcdUM2QjRcdUIzNTRcdUI5QUMgXHUyMDE0IFx1RDU1QyBcdUMxMzlcdUMxNThcdUM3NzQgXHVCOUREXHVBQzAwXHVDODM4XHVCM0M0IFx1QjJFNFx1Qjk3OCBcdUMxMzlcdUMxNThcdUM3NDAgXHVDODE1XHVDMEMxIFx1QjgwQ1x1QjM1NC5cbmNsYXNzIEhvbWVTZWN0aW9uQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVycikge1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tIb21lU2VjdGlvbkJvdW5kYXJ5XScsIHRoaXMucHJvcHMubGFiZWwgfHwgJ3NlY3Rpb24nLCBlcnIpOyB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6ICdIT01FX1NFQ1RJT05fRVJST1InLCBzdGF0dXM6IG51bGwsIGtpbmQ6ICdyZW5kZXInLFxuICAgICAgICBtZXNzYWdlOiBlcnI/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVyciksXG4gICAgICAgIGhpbnQ6IGBzZWN0aW9uPSR7dGhpcy5wcm9wcy5sYWJlbCB8fCAnJ31gLCB1cmw6ICcnLFxuICAgICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsIG9yaWdpbjogbG9jYXRpb24ub3JpZ2luLFxuICAgICAgfSk/LmNhdGNoPy4oKCkgPT4ge30pO1xuICAgIH0gY2F0Y2gge31cbiAgfVxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIC8vIFx1QkIzNFx1Qzc0QyBcdUFDQTlcdUI5QUMgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QzVEMFx1QUM4QyBcdUJFNDggXHVDNzkwXHVCOUFDIFx1QjMwMFx1QzJFMCBcdUFDMDBcdUJDQkNcdUM2QjQgcGxhY2Vob2xkZXIgXHVENTVDIFx1QzkwNFx1QjlDQyBcdUQ0NUNcdUFFMzBcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzZWN0aW9uIHN0eWxlPXt7cGFkZGluZzonMjRweCAwJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB0ZXh0QWxpZ246J2NlbnRlcid9fT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgbGV0dGVyU3BhY2luZzonMC4xOGVtJ319PlxuICAgICAgICAgICAgXHUyNkEwIHt0aGlzLnByb3BzLmxhYmVsIHx8ICdcdUM3NzQgXHVDMTM5XHVDMTU4J30gXHVDNzQ0IFx1QkQ4OFx1QjdFQ1x1QzYyNFx1QzlDMCBcdUJBQkJcdUQ1ODhcdUMyQjVcdUIyQzhcdUIyRTRcbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59XG5cbi8vIFx1Q0Q5NFx1Q0M5QyBcdUM1RUNcdUQ1ODlcdUM5QzAgXHVDMEMxXHVDMTM4IFx1QkFBOFx1QjJFQyBcdTIwMTQgXHVDRTc0XHVCNERDIFx1RDA3NFx1QjlBRCBcdUMyREMgXHVCMzU0IFx1RDA3MCBcdUM3NzRcdUJCRjhcdUM5QzAgKyBcdUM4MDRcdUNDQjQgXHVDMTI0XHVCQTg1ICsgXHVEMERDXHVBREY4ICsgXHVEMjJDXHVDNUI0IFx1QkNGNFx1QUUzMCBDVEEuXG5jb25zdCBSZWNvbW1lbmRhdGlvbkRldGFpbE1vZGFsID0gKHsgcmVjLCBvbkNsb3NlLCBnbyB9KSA9PiB7XG4gIC8vIHYwMC4wNzcgXHUyMDE0IHVzZU1vZGFsR3VhcmQgXHVEMUI1XHVDNzdDIChFU0MgKyBib2R5IHNjcm9sbCBsb2NrICsgcG9wc3RhdGUpLiBcdUM3N0RcdUFFMzAgXHVDODA0XHVDNkE5IFx1MjE5MiBkaXJ0eT1mYWxzZS5cbiAgd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiBmYWxzZSwgb25DbG9zZSwgb25TYXZlRHJhZnQ6IG51bGwsIGxhYmVsOiByZWM/Lm5hbWUgfHwgJ1x1QzVFQ1x1RDU4OVx1QzlDMCBcdUMwQzFcdUMxMzgnIH0pO1xuICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheShyZWMudGFncylcbiAgICA/IHJlYy50YWdzXG4gICAgOiAodHlwZW9mIHJlYy50YWdzID09PSAnc3RyaW5nJyA/IHJlYy50YWdzLnNwbGl0KC9bLFx1MDBCN10vKS5tYXAoKHMpID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBhcmlhLWxhYmVsPXtgJHtyZWMubmFtZSB8fCAnXHVDRDk0XHVDQzlDJ30gXHVDMEMxXHVDMTM4YH1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGluc2V0OjAsIHpJbmRleDoyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6J3JnYmEoMTUsMjMsNDIsMC41NSknLFxuICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgcGFkZGluZzoyMCxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkgb25DbG9zZSgpOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgbWF4V2lkdGg6NzIwLCB3aWR0aDonMTAwJScsIG1heEhlaWdodDonOTJ2aCcsXG4gICAgICAgIG92ZXJmbG93OidhdXRvJywgcG9zaXRpb246J3JlbGF0aXZlJyxcbiAgICAgICAgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbG9zZX0gYXJpYS1sYWJlbD1cIlx1QjJFQlx1QUUzMFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDoxNCwgcmlnaHQ6MTQsIHpJbmRleDoyLFxuICAgICAgICAgICAgd2lkdGg6MzYsIGhlaWdodDozNiwgZm9udFNpemU6MjQsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgIGNvbG9yOid2YXIoLS1pbmspJywgbGluZUhlaWdodDoxLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICB9fT5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAge3JlYy5pbWFnZURhdGFVcmkgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOicxMDAlJywgaGVpZ2h0OjI4MCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGB1cmwoJHtyZWMuaW1hZ2VEYXRhVXJpfSkgY2VudGVyL2NvdmVyYCxcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICB9fS8+XG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOicyOHB4IDI4cHggMjRweCd9fT5cbiAgICAgICAgICB7cmVjLnJlZ2lvbiAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6J2lubGluZS1ibG9jaycsIHBhZGRpbmc6JzRweCAxMHB4JyxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBtYXJnaW5Cb3R0b206MTQsXG4gICAgICAgICAgICB9fT57cmVjLnJlZ2lvbn08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZTozMiwgZm9udFdlaWdodDo3MDAsXG4gICAgICAgICAgICBjb2xvcjondmFyKC0taW5rKScsIGxpbmVIZWlnaHQ6MS4yLCBtYXJnaW5Cb3R0b206OCxcbiAgICAgICAgICB9fT57cmVjLm5hbWUgfHwgJ1x1QzgxQ1x1QkFBOSBcdUM1QzZcdUM3NEMnfTwvaDI+XG4gICAgICAgICAge3JlYy5zdWJ0aXRsZSAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMywgZm9udFdlaWdodDo2MDAsXG4gICAgICAgICAgICAgIGNvbG9yOid2YXIoLS1zZWNvbmRhcnkpJywgbGV0dGVyU3BhY2luZzonMC4wNGVtJywgbWFyZ2luQm90dG9tOjE4LFxuICAgICAgICAgICAgfX0+e3JlYy5zdWJ0aXRsZX08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtyZWMuZGVzYyAmJiAoXG4gICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjE1LCBsaW5lSGVpZ2h0OjEuODUsIGNvbG9yOid2YXIoLS1pbmstMiknLCBtYXJnaW5Cb3R0b206MjJ9fT57cmVjLmRlc2N9PC9wPlxuICAgICAgICAgICl9XG4gICAgICAgICAge3RhZ3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo2LCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbToyMn19PlxuICAgICAgICAgICAgICB7dGFncy5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZToxMH19Pnt0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEwLCBmbGV4V3JhcDond3JhcCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgcGFkZGluZ1RvcDoxOH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGRcIiBvbkNsaWNrPXsoKSA9PiB7IGdvKCd0b3VyJyk7IG9uQ2xvc2UoKTsgfX0+XHVDNzc0IFx1QzlDMFx1QzVFRCBcdUQyMkNcdUM1QjQgXHVCQ0Y0XHVBRTMwIFx1MjE5MjwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXtvbkNsb3NlfT5cdUIyRUJcdUFFMzA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIHYwMC4wNzIgXHUyMDE0IFx1RDY0OCBcdUNFNzRcdUI0RENcdUM3NTggZGVzY3JpcHRpb24gLyBub3RlIFx1Qjk3QyBcdUM5RTdcdUFDOEMgXHVDNzkwXHVCOTc0XHVCMjk0IFx1RDVFQ1x1RDM3Qy5cbi8vIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUJDRjRcdUFDRTA6IFwiXHVENjQ4XHVDNUQwIFx1QjE3OFx1Q0Q5Q1x1QjQxOFx1QjI5NFx1QUM3NCBcdUM4MDFcdUIyRjlcdUQ3ODggXHVDOTA0XHVDNzc0XHVBQzcwXHVCMDk4IFx1RDY0OFx1QzZBOVx1QzczQ1x1Qjg1QyBcdUI1MzBcdUI4NUMgXHVBRTAwXHVDNzQ0IFx1QzRGMFx1QUM4QyBcdUQ1NzRcdUM1N0NcdUM5QzBcIiBcdTIwMTQgXHVDNkIwXHVDMTIwIHRydW5jYXRlLlxuLy8gXHVDOTA0XHVCQzE0XHVBRkM4XHVDNzQwIFx1QUNGNVx1QkMzMVx1QzczQ1x1Qjg1QyBcdUJDQzBcdUQ2NThcdUQ1NzQgXHVDRTc0XHVCNERDIFx1QjgwOFx1Qzc3NFx1QzU0NFx1QzZDM1x1Qzc3NCBcdUM1NDhcdUM4MTUuIFx1QjJFOFx1QzVCNCBcdUFDQkRcdUFDQzRcdUM1RDAgXHVCOURFXHVDREIwIFx1Qzc5MFx1Qjk3OCBcdUI0QTQgXCJcdTIwMjZcIiBcdUNDQThcdUJEODAuXG5jb25zdCB0cnVuY2F0ZVByZXZpZXcgPSAodGV4dCwgbWF4ID0gMTEwKSA9PiB7XG4gIGNvbnN0IHMgPSBTdHJpbmcodGV4dCB8fCAnJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKTtcbiAgaWYgKHMubGVuZ3RoIDw9IG1heCkgcmV0dXJuIHM7XG4gIC8vIFx1QjJFOFx1QzVCNCBcdUFDQkRcdUFDQzRcdUFFNENcdUM5QzAgYmFja3RyYWNrIFx1MjAxNCBcdUQ1NUNcdUFFMDBcdUM3NDAgXHVBQ0Y1XHVCQzMxXHVDNzc0IFx1QzgwMVx1QzVCNCBiYWNrdHJhY2sgXHVDMkU0XHVEMzI4XHVENTU4XHVCQTc0IFx1QURGOFx1QjBFNSBcdUM3OTBcdUI5NzRcdUFFMzAuXG4gIGNvbnN0IHNsaWNlID0gcy5zbGljZSgwLCBtYXgpO1xuICBjb25zdCBsYXN0U3BhY2UgPSBzbGljZS5sYXN0SW5kZXhPZignICcpO1xuICBjb25zdCBjdXQgPSBsYXN0U3BhY2UgPiBtYXggKiAwLjYgPyBzbGljZS5zbGljZSgwLCBsYXN0U3BhY2UpIDogc2xpY2U7XG4gIHJldHVybiBjdXQgKyAnXHUyMDI2Jztcbn07XG5cbmNvbnN0IEhPTUVfVEVYVF9ERUZBVUxUID0ge1xuICByZWNFeWVicm93OiAnXHVDNkI0XHVDNjAxXHVDNzkwXHVBQzAwIFx1QjJFNFx1QjE0MFx1QzYyOCBcdUFDRjMnLFxuICByZWNUaXRsZVByZWZpeDogJ1x1QzY5NFx1Qzk5OCAnLFxuICByZWNUaXRsZUFjY2VudDogJ1x1QjIwOFx1QzVEMCBcdUI0RTRcdUM1QjRcdUM2MjgnLFxuICByZWNUaXRsZVN1ZmZpeDogJyBcdUM3QTVcdUMxOEMnLFxuICByZWNTdWJ0aXRsZTogJ1x1QzlDMVx1QzgxMSBcdUFDNzdcdUFDRTAgXHVCQTM5XHVDNUI0XHVCQ0Y4IFx1QjRBNCBcdUIyRTRcdUMyREMgXHVBRUJDXHVCMEI0IFx1QkNGNFx1QUNFMCBcdUMyRjZcdUM3NDAgXHVBQ0YzXHVCOUNDIFx1QUNFOFx1Qjc5MFx1QzJCNVx1QjJDOFx1QjJFNC4nLFxuICByZWNBY3Rpb246ICdcdUM4MDRcdUNDQjQgXHVDNzdDXHVDODE1IFx1MjE5MicsXG4gIHRvdXJFeWVicm93OiAnXHVCMkY1XHVDMEFDIFx1Qzc3Q1x1QzgxNScsXG4gIHRvdXJUaXRsZTogJ1x1Qzc3NFx1QkM4OFx1QzVEMCBcdUQ1NjhcdUFFRDggXHVBQzc4XHVDNzQ0IFx1QUUzOCcsXG4gIHRvdXJTdWJ0aXRsZTogJ1x1RDA3MCBcdUJDODRcdUMyQTRcdUJDRjRcdUIyRTQgXHVDNzkxXHVDNzQwIFx1QUM3OFx1Qzc0Q1x1QzVEMCBcdUI5REVcdUNEOTggXHVCMkY1XHVDMEFDXHVDNzg1XHVCMkM4XHVCMkU0LiBcdUM3QTVcdUMxOENcdUM3NTggXHVCMEI0XHVCODI1XHVBQ0ZDIFx1QzYyNFx1QjI5OFx1Qzc1OCBcdUQ0NUNcdUM4MTVcdUM3NDQgXHVBQzE5XHVDNzc0IFx1QkQwNVx1QjJDOFx1QjJFNC4nLFxuICB0b3VyQWN0aW9uOiAnXHVDODA0XHVDQ0I0IFx1Qzc3Q1x1QzgxNSBcdTIxOTInLFxuICB0b3VyTmV4dExhYmVsOiAnXHVCMkU0XHVDNzRDIFx1Qzc3Q1x1QzgxNScsXG4gIHRvdXJQcmljZUxhYmVsOiAnXHVDQzM4XHVBQzAwXHVCRTQ0JyxcbiAgY29tbXVuaXR5RXllYnJvdzogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCcsXG4gIGNvbW11bml0eVRpdGxlOiAnXHVCMkU0XHVCMTQwXHVDNjI4IFx1QzBBQ1x1Qjc4Q1x1QjRFNFx1Qzc1OCBcdUFFMzBcdUI4NUQnLFxuICBjb21tdW5pdHlTdWJ0aXRsZTogJ1x1Qzg4Qlx1QzU1OFx1QjM1OCBcdUMyRERcdUIyRjksIFx1QzU2MFx1QjlFNFx1RDU4OFx1QjM1OCBcdUIzRDlcdUMxMjAsIFx1QjJFNFx1QzJEQyBcdUFDMDBcdUFDRTAgXHVDMkY2XHVDNzQwIFx1QUNFOFx1QkFBOVx1QUU0Q1x1QzlDMCBcdUQzQjhcdUQ1NThcdUFDOEMgXHVCMEE4XHVBQ0E4XHVDOEZDXHVDMTM4XHVDNjk0LicsXG4gIGNvbW11bml0eUFjdGlvbjogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdUFDMDBcdUFFMzAgXHUyMTkyJyxcbiAgY29tbXVuaXR5UmVwbHlMYWJlbDogJ1x1QjMxM1x1QUUwMCcsXG4gIGNvbW11bml0eUVtcHR5VGl0bGU6ICdcdUNDQUIgXHVCQzg4XHVDOUY4IFx1QzVFQ1x1RDU4OSBcdUM3NzRcdUM1N0NcdUFFMzBcdUI5N0MgXHVDMzY4XHVDOEZDXHVDMTM4XHVDNjk0JyxcbiAgY29tbXVuaXR5RW1wdHlTdWJ0aXRsZTogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFx1QzVEMCBcdUM1RUNcdUQ1ODkgXHVBQ0JEXHVENUQ4XHVDNzQ0IFx1QjA5OFx1QjIwNFx1QkE3NCBcdUIzNTQgXHVCOUNFXHVDNzQwIFx1QzVFQ1x1RDU4OVx1Qzc5MFx1QjRFNFx1Qzc3NCBcdUJBQThcdUM1RUNcdUI0RURcdUIyQzhcdUIyRTQuJyxcbiAgY29tbXVuaXR5RW1wdHlDdGE6ICdcdUFFMDAgXHVDNzkxXHVDMTMxXHVENTU4XHVBRTMwIFx1MjE5MicsXG4gIGNvbHVtbkV5ZWJyb3c6ICdcdUM3N0RcdUM3NDRcdUFDNzBcdUI5QUMnLFxuICBjb2x1bW5UaXRsZTogJ1x1QUUzOCBcdUM3MDRcdUM1RDBcdUMxMUMgXHVDNzc0XHVDNUI0XHVDOUMwXHVCMjk0IFx1QzBERFx1QUMwMScsXG4gIGNvbHVtblN1YnRpdGxlOiAnXHVCMkY1XHVDMEFDXHVDNUQwXHVDMTFDIFx1QzJEQ1x1Qzc5MVx1RDU3NCBcdUNDNDVcdUMwQzEgXHVDNzA0XHVCODVDIFx1QjNDQ1x1QzU0NFx1QzYyOCBcdUM3NzRcdUM1N0NcdUFFMzBcdUI0RTRcdUM3ODVcdUIyQzhcdUIyRTQuJyxcbiAgY29sdW1uQWN0aW9uOiAnXHVDRTdDXHVCN0ZDIFx1QzgwNFx1Q0NCNCBcdUJDRjRcdUFFMzAgXHUyMTkyJyxcbiAgY29sdW1uUmVhZE1vcmU6ICdcdUIzNTQgXHVDNzdEXHVBRTMwIFx1MjE5MicsXG4gIGNvbHVtbkVtcHR5OiAnXHVCMkU0XHVDNzRDIFx1Q0U3Q1x1QjdGQyBcdUM5MDBcdUJFNDQgXHVDOTExXHVDNzg1XHVCMkM4XHVCMkU0LicsXG4gIGxlY3R1cmVzRXllYnJvdzogJ1x1QUMxNVx1QzVGMCcsXG4gIGxlY3R1cmVzVGl0bGU6ICdcdUM1NDlcdUM1NDRcdUMxMUMgXHVCQTNDXHVDODAwIFx1QjVBMFx1QjA5OFx1QjI5NCBcdUMyRENcdUFDMDQnLFxuICBsZWN0dXJlc0FjdGlvbjogJ1x1QzgwNFx1Q0NCNCBcdUFDMTVcdUM1RjAgXHVCQ0Y0XHVBRTMwIFx1MjE5MicsXG4gIGxlY3R1cmVCYWRnZTogJ1x1QUMxNVx1QzVGMCcsXG4gIGhlcm9SZWNlbnRMZWN0dXJlTGFiZWw6ICdcdUNENUNcdUFERkMgXHVBQzE1XHVDNUYwJyxcbiAgaGVyb05leHRMZWN0dXJlTGFiZWw6ICdcdUIyRTRcdUM3NEMgXHVBQzE1XHVDNUYwJyxcbiAgaGVyb05leHRUb3VyTGFiZWw6ICdcdUIyRTRcdUM3NEMgXHVCMkY1XHVDMEFDJyxcbiAgaGVyb05vTGVjdHVyZVRleHQ6ICdcdUM2MDhcdUM4MTVcdUI0MUMgXHVBQzE1XHVDNUYwXHVDNzc0IFx1QzU0NFx1QzlDMSBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuJyxcbiAgaGVyb05vTGVjdHVyZUN0YTogJ1x1QzgwNFx1Q0NCNCBcdUFDMTVcdUM1RjAgXHVCQ0Y0XHVBRTMwIFx1MjE5MicsXG4gIGhlcm9Ob1RvdXJUZXh0OiAnXHVDNjA4XHVDODE1XHVCNDFDIFx1QjJGNVx1QzBBQ1x1QUMwMCBcdUM1NDRcdUM5QzEgXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LicsXG4gIGhlcm9Ob1RvdXJDdGE6ICdcdUM4MDRcdUNDQjQgXHVCMkY1XHVDMEFDIFx1QkNGNFx1QUUzMCBcdTIxOTInLFxuICB2ZW51ZUZhbGxiYWNrOiAnXHVDN0E1XHVDMThDIFx1QkJGOFx1QzgxNScsXG4gIGVtcHR5RmFsbGJhY2s6ICdcdTIwMTQnLFxuICBib29rRXllYnJvd1ByZWZpeDogJ1x1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNEOUNcdUQzMTAnLFxuICBib29rQnV5Q3RhOiAnXHVBRDZDXHVCOUU0XHVENTU4XHVBRTMwIFx1MjE5MicsXG4gIGJvb2tLckxhYmVsOiAnXHVBRDZEXHVCQjM4XHVEMzEwJyxcbiAgYm9va0VuTGFiZWw6ICdcdUM2MDFcdUJCMzhcdUQzMTAnLFxuICBib29rQXV0aG9yU3VmZml4OiAnXHVDOUMwXHVDNzRDJyxcbn07XG5cbmNvbnN0IGdldEhvbWVUZXh0ID0gKHNjKSA9PiAoeyAuLi5IT01FX1RFWFRfREVGQVVMVCwgLi4uKChzYyAmJiB0eXBlb2Ygc2MuaG9tZVRleHQgPT09ICdvYmplY3QnKSA/IHNjLmhvbWVUZXh0IDoge30pIH0pO1xuXG4vLyB2MDAuMTA2IFx1MjAxNCBcdUQ2NDggXHVENzg4XHVDNUI0XHVCODVDXHVDNzU4IFx1QzlDMFx1QjNDNCBcdUM3OTBcdUI5QUMuIFx1QjJFNFx1Qzc0QyBcdUFDMTVcdUM1RjAgKyBcdUIyRTRcdUM3NEMgXHVCMkY1XHVDMEFDIFx1QkJGOFx1QjJDOCBcdUNFNzRcdUI0REMuXG4vLyBcdUMwQUNcdUM2QTlcdUM3OTAgXHVDODFDXHVDNTQ4IEFcdUM1NDg6ICdcdUFDMTVcdUM1RjAvXHVCMkY1XHVDMEFDIFx1QkJGOFx1QjJDOCBcdUNFNzRcdUI0REMnIChcdUM2QjRcdUM2MDEgXHVBQzAwXHVDRTU4IFx1MjE5MSwgXHVDN0FDXHVCQzI5XHVCQjM4IFx1QUMwMFx1Q0U1OCBcdTIxOTEpLlxuY29uc3QgSGVyb1Byb2dyYW1DYXJkcyA9ICh7IGdvLCBkYXRhVGljaywgdGV4dCB9KSA9PiB7XG4gIC8vIHYwMC4xMTAgXHUyMDE0IG1vZHVsZS1zY29wZSBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjhcdUIyOTQgSG9tZVBhZ2UgXHVDNzU4IGBjb25zdCBHID0gd2luZG93LkJHTkpfR1VBUkQ7YCBcdUI5N0MgXHVDMEFDXHVDNkE5IFx1QkFCQiBcdUQ1NjguXG4gIC8vIHdpbmRvdy5CR05KX0dVQVJEIFx1Qjk3QyBcdUM5QzFcdUM4MTEgXHVDQzM4XHVDODcwICsgXHVDNTQ4XHVDODA0XHVENTVDIFx1RDNGNFx1QkMzMS5cbiAgY29uc3QgX2FyciA9IChmbikgPT4ge1xuICAgIHRyeSB7IGNvbnN0IHYgPSBmbigpOyByZXR1cm4gQXJyYXkuaXNBcnJheSh2KSA/IHYgOiBbXTsgfSBjYXRjaCB7IHJldHVybiBbXTsgfVxuICB9O1xuICAvLyB2MDAuMTE1IFx1MjAxNCBzdGFydHNBdCBcdUFDMDAgaW52YWxpZCBcdUQ1NUMgcm93IFx1QUMwMCBzb3J0IFx1QzVEMCBcdUI0RTRcdUM1QjRcdUFDMDBcdUJBNzQgXHVBQ0IwXHVBQ0ZDIFx1QzIxQ1x1QzExQ1x1QUMwMCBcdUM3ODRcdUM3NThcdUI4NUMgXHVBRTY4XHVDOUQwLlxuICAvLyBcdUQ1NUMgXHVCQzg4IFx1QjM1NCBEYXRlLnBhcnNlICFpc05hTiBcdUI4NUMgXHVBQzcwXHVCOTc4IFx1QjRBNCBzb3J0LlxuICBjb25zdCBfdmFsaWRTdGFydHMgPSAobCkgPT4ge1xuICAgIGlmICghbCB8fCBsLmhpZGRlbiB8fCAhbC5zdGFydHNBdCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiAhaXNOYU4oRGF0ZS5wYXJzZShsLnN0YXJ0c0F0KSk7XG4gIH07XG4gIC8vIHYwMC4xMjkgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM2OTRcdUNDQUQgJ1x1QzlDNFx1RDU4OSBcdUM2MDhcdUM4MTUgXHVBQzE1XHVDNUYwXHVDNzc0IFx1QzVDNlx1QzczQ1x1QkE3NCBcdUM5QzBcdUIwOUMgXHVBQzE1XHVDNUYwXHVDNzQ0IFx1QjE3OFx1Q0Q5QyAoM1x1QUMxQyBcdUM3NzRcdUIwQjQpJy5cbiAgLy8gMSkgXHVDNUI0XHVDODFDIFx1Qzc3NFx1RDZDNCBcdUFDMTVcdUM1RjAgXHVDNkIwXHVDMTIwLiAyKSBcdUM1QzZcdUM3M0NcdUJBNzQgXHVBQzAwXHVDN0E1IFx1Q0Q1Q1x1QURGQyBcdUM5QzBcdUIwOUMgXHVBQzE1XHVDNUYwIDNcdUFDMUNcdUI4NUMgXHVEM0Y0XHVCQzMxLlxuICBjb25zdCBsZWN0dXJlcyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGFsbCA9IF9hcnIoKCkgPT4gd2luZG93LkJHTkpfTEVDVFVSRVM/Lmxpc3RBbGw/LigpKVxuICAgICAgLmZpbHRlcihfdmFsaWRTdGFydHMpO1xuICAgIGNvbnN0IGN1dG9mZiA9IERhdGUubm93KCkgLSA4NjQwMDAwMDtcbiAgICBjb25zdCB1cGNvbWluZyA9IGFsbFxuICAgICAgLmZpbHRlcigobCkgPT4gbmV3IERhdGUobC5zdGFydHNBdCkuZ2V0VGltZSgpID49IGN1dG9mZilcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShhLnN0YXJ0c0F0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShiLnN0YXJ0c0F0KS5nZXRUaW1lKCkpO1xuICAgIGlmICh1cGNvbWluZy5sZW5ndGggPiAwKSByZXR1cm4gdXBjb21pbmc7XG4gICAgLy8gZmFsbGJhY2sgXHUyMDE0IFx1QUMwMFx1QzdBNSBcdUNENUNcdUFERkMgXHVDOUMwXHVCMDlDIFx1QUMxNVx1QzVGMCAzXHVBQzFDIChuZXdlc3QtZmlyc3QpLlxuICAgIHJldHVybiBhbGxcbiAgICAgIC5maWx0ZXIoKGwpID0+IG5ldyBEYXRlKGwuc3RhcnRzQXQpLmdldFRpbWUoKSA8IGN1dG9mZilcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShiLnN0YXJ0c0F0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShhLnN0YXJ0c0F0KS5nZXRUaW1lKCkpXG4gICAgICAuc2xpY2UoMCwgMyk7XG4gIH0sIFtkYXRhVGlja10pO1xuICBjb25zdCB0b3VycyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBfYXJyKCgpID0+IHdpbmRvdy5CR05KX1RPVVJTPy5saXN0QWxsPy4oKSlcbiAgICAgIC5maWx0ZXIoX3ZhbGlkU3RhcnRzKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGEuc3RhcnRzQXQpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGIuc3RhcnRzQXQpLmdldFRpbWUoKSlcbiAgICAgIC5maWx0ZXIoKHQpID0+IG5ldyBEYXRlKHQuc3RhcnRzQXQpLmdldFRpbWUoKSA+PSBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICB9LCBbZGF0YVRpY2tdKTtcblxuICBjb25zdCBuZXh0TGVjdHVyZSA9IGxlY3R1cmVzWzBdO1xuICBjb25zdCBuZXh0VG91ciA9IHRvdXJzWzBdO1xuICAvLyB2MDAuMTI5IFx1MjAxNCBcdUFDMTVcdUM1RjBcdUM3NzQgZmFsbGJhY2sgKFx1QzlDMFx1QjA5QyBcdUFDMTVcdUM1RjAgXHVCMTc4XHVDRDlDIFx1QkFBOFx1QjREQykgXHVDNzc4XHVDOUMwIFx1RDMxMFx1QzgxNS4gbmV4dExlY3R1cmUuc3RhcnRzQXQgXHVBQzAwIFx1QzVCNFx1QzgxQ1x1QkNGNFx1QjJFNCBcdUFDRkNcdUFDNzBcdUJBNzQgcGFzdCBtb2RlLlxuICBjb25zdCBsZWN0dXJlSXNQYXN0ID0gbmV4dExlY3R1cmUgJiYgbmV4dExlY3R1cmUuc3RhcnRzQXQgJiZcbiAgICAobmV3IERhdGUobmV4dExlY3R1cmUuc3RhcnRzQXQpLmdldFRpbWUoKSA8IERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG5cbiAgLy8gdjAwLjExMCBcdTIwMTQgXHVDMkRDXHVBQzA0IFx1RDQ1Q1x1QzJEQ1x1QjI5NCBcdUMwQUNcdUM3NzRcdUQyQjggXHVDODA0XHVCQzE4IEtTVCBcdUFFMzBcdUM5MDAuIEJHTkpfRk1ULmtzdEZyaWVuZGx5IFx1QzBBQ1x1QzZBOS5cbiAgY29uc3QgZm10RGF0ZSA9IChpc28pID0+IHtcbiAgICBpZiAoIWlzbykgcmV0dXJuICcnO1xuICAgIGlmICh3aW5kb3cuQkdOSl9GTVQ/LmtzdEZyaWVuZGx5KSByZXR1cm4gd2luZG93LkJHTkpfRk1ULmtzdEZyaWVuZGx5KGlzbyk7XG4gICAgLy8gXHVEM0Y0XHVCQzMxIChCR05KX0ZNVCBcdUJCRjhcdUI4NUNcdUI0REMgXHVDMkRDKVxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShpc28pO1xuICAgIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCBkb3cgPSBbJ1x1Qzc3QycsJ1x1QzZENCcsJ1x1RDY1NCcsJ1x1QzIxOCcsJ1x1QkFBOScsJ1x1QUUwOCcsJ1x1RDFBMCddW2QuZ2V0RGF5KCldO1xuICAgIHJldHVybiBgJHtkLmdldE1vbnRoKCkrMX0uJHtwYWQoZC5nZXREYXRlKCkpfSAoJHtkb3d9KSAke3BhZChkLmdldEhvdXJzKCkpfToke3BhZChkLmdldE1pbnV0ZXMoKSl9YDtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1wcm9ncmFtLXN0YWNrXCI+XG4gICAgICB7LyogXHVCMkU0XHVDNzRDIFx1QUMxNVx1QzVGMCBcdUNFNzRcdUI0REMgKi99XG4gICAgICA8YXJ0aWNsZVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IGlmIChuZXh0TGVjdHVyZSkgZ28oJ2xlY3R1cmVzJyk7IH19XG4gICAgICAgIGNsYXNzTmFtZT1cImhvbWUtcHJvZ3JhbS1jYXJkXCJcbiAgICAgICAgc3R5bGU9e3tjdXJzb3I6IG5leHRMZWN0dXJlID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnfX1cbiAgICAgICAgcm9sZT17bmV4dExlY3R1cmUgPyAnYnV0dG9uJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgdGFiSW5kZXg9e25leHRMZWN0dXJlID8gMCA6IHVuZGVmaW5lZH1cbiAgICAgICAgb25LZXlEb3duPXsoZSkgPT4geyBpZiAobmV4dExlY3R1cmUgJiYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpKSB7IGUucHJldmVudERlZmF1bHQoKTsgZ28oJ2xlY3R1cmVzJyk7IH0gfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1wcm9ncmFtLWxhYmVsXCI+XG4gICAgICAgICAge2xlY3R1cmVJc1Bhc3QgPyB0ZXh0Lmhlcm9SZWNlbnRMZWN0dXJlTGFiZWwgOiB0ZXh0Lmhlcm9OZXh0TGVjdHVyZUxhYmVsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge25leHRMZWN0dXJlID8gKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIwLCBtYXJnaW5Cb3R0b206OCwgY29sb3I6J3ZhcigtLWluayknfX0+e25leHRMZWN0dXJlLnRvcGljIHx8IG5leHRMZWN0dXJlLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonYmFzZWxpbmUnLCBmbGV4V3JhcDond3JhcCcsIGdhcDoxMH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NjAwfX0+e2ZtdERhdGUobmV4dExlY3R1cmUuc3RhcnRzQXQpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEyfX0+e25leHRMZWN0dXJlLnZlbnVlIHx8IHRleHQudmVudWVGYWxsYmFja308L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgbWFyZ2luOjB9fT5cbiAgICAgICAgICAgIHt0ZXh0Lmhlcm9Ob0xlY3R1cmVUZXh0fSA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3QgZ29sZFwiIG9uQ2xpY2s9eyhlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IGdvKCdsZWN0dXJlcycpOyB9fT57dGV4dC5oZXJvTm9MZWN0dXJlQ3RhfTwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgKX1cbiAgICAgIDwvYXJ0aWNsZT5cblxuICAgICAgey8qIFx1QjJFNFx1Qzc0QyBcdUIyRjVcdUMwQUMgXHVDRTc0XHVCNERDICovfVxuICAgICAgPGFydGljbGVcbiAgICAgICAgb25DbGljaz17KCkgPT4geyBpZiAobmV4dFRvdXIpIGdvKCd0b3VyJyk7IH19XG4gICAgICAgIGNsYXNzTmFtZT1cImhvbWUtcHJvZ3JhbS1jYXJkXCJcbiAgICAgICAgc3R5bGU9e3tjdXJzb3I6IG5leHRUb3VyID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnfX1cbiAgICAgICAgcm9sZT17bmV4dFRvdXIgPyAnYnV0dG9uJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgdGFiSW5kZXg9e25leHRUb3VyID8gMCA6IHVuZGVmaW5lZH1cbiAgICAgICAgb25LZXlEb3duPXsoZSkgPT4geyBpZiAobmV4dFRvdXIgJiYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpKSB7IGUucHJldmVudERlZmF1bHQoKTsgZ28oJ3RvdXInKTsgfSB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLXByb2dyYW0tbGFiZWxcIj5cbiAgICAgICAgICB7dGV4dC5oZXJvTmV4dFRvdXJMYWJlbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtuZXh0VG91ciA/IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMCwgbWFyZ2luQm90dG9tOjgsIGNvbG9yOid2YXIoLS1pbmspJ319PntuZXh0VG91ci50aXRsZX08L2gzPlxuICAgICAgICAgICAge25leHRUb3VyLnN1YnRpdGxlICYmIChcbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBtYXJnaW5Cb3R0b206OCwgZm9udFN0eWxlOidpdGFsaWMnfX0+e25leHRUb3VyLnN1YnRpdGxlfTwvcD5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonYmFzZWxpbmUnLCBmbGV4V3JhcDond3JhcCcsIGdhcDoxMH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NjAwfX0+e2ZtdERhdGUobmV4dFRvdXIuc3RhcnRzQXQpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEyfX0+XG4gICAgICAgICAgICAgICAge25leHRUb3VyLmxldmVsICYmIDxzcGFuIHN0eWxlPXt7bWFyZ2luUmlnaHQ6OH19PntuZXh0VG91ci5sZXZlbH08L3NwYW4+fVxuICAgICAgICAgICAgICAgIHtuZXh0VG91ci5kdXJhdGlvbn1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIG1hcmdpbjowfX0+XG4gICAgICAgICAgICB7dGV4dC5oZXJvTm9Ub3VyVGV4dH0gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0IGdvbGRcIiBvbkNsaWNrPXsoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBnbygndG91cicpOyB9fT57dGV4dC5oZXJvTm9Ub3VyQ3RhfTwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgKX1cbiAgICAgIDwvYXJ0aWNsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIHYwMC4xNTIgXHUyMDE0IFx1RDY0OCBcdUNDNDUgQ1RBIFx1QjJFNFx1QUQ4QyBcdUNFNzRcdUI4RThcdUMxNDAuIHYwMC4xNTEgXHVCMkU4XHVDNzdDLVx1Q0M0NSBJSUZFIFx1Qjk3QyBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjhcdUQ2NTQgKyBcdUM4OENcdUM2QjAgXHVCQjM0XHVENTVDIHdyYXAgKyBhdXRvcGxheS5cbi8vIFx1QjM3MFx1Qzc3NFx1RDEzMCBcdUMxOENcdUMyQTQ6IEJHTkpfQk9PS1MubGlzdCh7c3RhdHVzOidwdWJsaXNoZWQnfSkuIFx1QzgxNVx1QjgyQzogcHJpbWFyeSBcdUM2QjBcdUMxMjAgXHUyMTkyIG9yZGVyLiAwXHVBRDhDXHVDNzc0XHVCQTc0IFx1QzEzOVx1QzE1OCBoaWRlLlxuY29uc3QgQm9va0Nhcm91c2VsU2VjdGlvbiA9ICh7IGdvLCBkYXRhVGljaywgdGV4dCB9KSA9PiB7XG4gIGNvbnN0IF9hcnIgPSAoZm4pID0+IHsgdHJ5IHsgY29uc3QgdiA9IGZuKCk7IHJldHVybiBBcnJheS5pc0FycmF5KHYpID8gdiA6IFtdOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH07XG4gIC8vIGFkbWluIFx1Qzc1OCBcdUNDNDUgXHVCQ0MwXHVBQ0JEXHVDNzQ0IFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2OCBcdUM1QzZcdUM3NzQgXHVDOTg5XHVDMkRDIFx1QkMxOFx1QzYwMS4gZGF0YVRpY2sgKyBiZ25qLWJvb2tzLXJlZnJlc2ggXHVCNDU4IFx1QjJFNCBcdUNDQURcdUNERTguXG4gIGNvbnN0IFtib29rVGljaywgc2V0Qm9va1RpY2tdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25SID0gKCkgPT4gc2V0Qm9va1RpY2soKHYpID0+IHYgKyAxKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1ib29rcy1yZWZyZXNoJywgb25SKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotYm9va3MtcmVmcmVzaCcsIG9uUik7XG4gIH0sIFtdKTtcbiAgY29uc3QgYm9va3MgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBhbGwgPSBfYXJyKCgpID0+IHdpbmRvdy5CR05KX0JPT0tTPy5saXN0Py4oeyBzdGF0dXM6ICdwdWJsaXNoZWQnIH0pKTtcbiAgICByZXR1cm4gYWxsLnNsaWNlKCkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEucHJpbWFyeSAmJiAhYi5wcmltYXJ5KSByZXR1cm4gLTE7XG4gICAgICBpZiAoIWEucHJpbWFyeSAmJiBiLnByaW1hcnkpIHJldHVybiAxO1xuICAgICAgcmV0dXJuIChhLm9yZGVyID8/IDApIC0gKGIub3JkZXIgPz8gMCk7XG4gICAgfSk7XG4gIH0sIFtkYXRhVGljaywgYm9va1RpY2tdKTtcblxuICBjb25zdCBbaWR4LCBzZXRJZHhdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtwYXVzZWQsIHNldFBhdXNlZF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIC8vIFx1Q0M0NSBcdUJBQTlcdUI4NUQgXHVBRTM4XHVDNzc0IFx1QkNDMFx1QjNEOSBcdUMyREMgaWR4IFx1QzdBQ1x1QzgxNVx1QjgyQy5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYm9va3MubGVuZ3RoID4gMCAmJiBpZHggPj0gYm9va3MubGVuZ3RoKSBzZXRJZHgoMCk7XG4gIH0sIFtib29rcy5sZW5ndGgsIGlkeF0pO1xuXG4gIGNvbnN0IHdyYXAgPSAobikgPT4gYm9va3MubGVuZ3RoID09PSAwID8gMCA6IChuICsgYm9va3MubGVuZ3RoKSAlIGJvb2tzLmxlbmd0aDtcbiAgY29uc3QgZ29QcmV2ID0gKCkgPT4gc2V0SWR4KChpKSA9PiB3cmFwKGkgLSAxKSk7XG4gIGNvbnN0IGdvTmV4dCA9ICgpID0+IHNldElkeCgoaSkgPT4gd3JhcChpICsgMSkpO1xuXG4gIC8vIGF1dG9wbGF5IDdzIFx1MjAxNCAyXHVBRDhDIFx1Qzc3NFx1QzBDMSArIGhvdmVyIFx1QzgxNVx1QzlDMCBcdUM1NDRcdUIyRDAgXHVCNTRDXHVCOUNDLlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChib29rcy5sZW5ndGggPCAyIHx8IHBhdXNlZCkgcmV0dXJuO1xuICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHNldElkeCgoaSkgPT4gd3JhcChpICsgMSkpLCA3MDAwKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHQpO1xuICB9LCBbaWR4LCBib29rcy5sZW5ndGgsIHBhdXNlZF0pO1xuXG4gIGlmIChib29rcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICBjb25zdCBzaG93Q2hyb21lID0gYm9va3MubGVuZ3RoID4gMTtcblxuICAvLyB2MDAuMTYyIFx1MjAxNCBcdUIyRThcdUM3N0MgXHVDQzQ1IFx1Q0U3NFx1QjREQyBcdUI4MENcdUIzNTQgKHNsaWRlIGxheWVyIFx1QzU0OFx1QzVEMFx1QzExQyBcdUQ2MzhcdUNEOUMpLlxuICAvLyB2MDAuMTcyIFx1MjAxNCBcdUQ2NDggQ1RBIFx1QkNGOFx1QkIzOFx1Qzc0MCBzaXRlX2NvbnRlbnRfa3YuYm9va0hvbWVJbnRyb3NbaWRdIFx1QzZCMFx1QzEyMCwgXHVDNUM2XHVDNzNDXHVCQTc0IGJvb2suZGVzYyBcdUQzRjRcdUJDMzEuXG4gIGNvbnN0IHJlbmRlckJvb2tDYXJkID0gKGIpID0+IHtcbiAgICBjb25zdCBoYXNQcmljZUtSID0gTnVtYmVyKGIucHJpY2VLUikgPiAwO1xuICAgIGNvbnN0IGhhc1ByaWNlRU4gPSBOdW1iZXIoYi5wcmljZUVOKSA+IDA7XG4gICAgY29uc3QgeXIgPSBiLnB1Ymxpc2hlZEF0ID8gbmV3IERhdGUoYi5wdWJsaXNoZWRBdCkuZ2V0RnVsbFllYXIoKSA6IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBob21lSW50cm9zID0gKHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fSkuYm9va0hvbWVJbnRyb3MgfHwge307XG4gICAgY29uc3QgaG9tZUludHJvID0gaG9tZUludHJvc1tiLmlkXSB8fCBob21lSW50cm9zW1N0cmluZyhiLmlkKV0gfHwgJyc7XG4gICAgY29uc3QgaW50cm9UZXh0ID0gaG9tZUludHJvIHx8IGIuZGVzYyB8fCAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjdGEtZ3JpZFwiIHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxZnIgMWZyJywgZ2FwOjgwLCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIj57dGV4dC5ib29rRXllYnJvd1ByZWZpeH0gXHUwMEI3IHt5cn08L2Rpdj5cbiAgICAgICAgICA8aDIgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6J2NsYW1wKDM2cHgsIDR2dywgNTJweCknLFxuICAgICAgICAgICAgZm9udFdlaWdodDo2MDAsIGxpbmVIZWlnaHQ6MS4xLCBtYXJnaW5Cb3R0b206IGIuc3VidGl0bGUgPyA4IDogMTYsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBcdTMwMEV7Yi50aXRsZX1cdTMwMEZcbiAgICAgICAgICA8L2gyPlxuICAgICAgICAgIHsvKiB2MDAuMTYyIFx1MjAxNCBcdUQ1NUMgXHVDOTA0IFx1QzE4Q1x1QUMxQyAoc3VidGl0bGUpLiBcdUMwQUNcdUM2QTlcdUM3OTAgXHVDNjk0XHVDQ0FEICdcdUQ1NUNcdUM5MDRcdUMxOENcdUFDMUNcdUFDMDAgXHVCQ0Y0XHVDNzc0XHVBQzhDJy4gKi99XG4gICAgICAgICAge2Iuc3VidGl0bGUgJiYgKFxuICAgICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZToxOCwgZm9udFN0eWxlOidpdGFsaWMnLFxuICAgICAgICAgICAgICBjb2xvcjondmFyKC0taW5rLTIpJywgbWFyZ2luQm90dG9tOjIwLCBsaW5lSGVpZ2h0OjEuNSxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7Yi5zdWJ0aXRsZX1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtpbnRyb1RleHQgJiYgKFxuICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxNSwgbGluZUhlaWdodDoxLjg1LCBjb2xvcjondmFyKC0taW5rLTIpJywgbWFyZ2luQm90dG9tOjI4LCB3aGl0ZVNwYWNlOidwcmUtd3JhcCcsIG1heFdpZHRoOjU2MH19PlxuICAgICAgICAgICAgICB7aW50cm9UZXh0fVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICl9XG4gICAgICAgICAgeyhoYXNQcmljZUtSIHx8IGhhc1ByaWNlRU4pICYmIChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjIwLCBtYXJnaW5Cb3R0b206MzIsIGFsaWduSXRlbXM6J2ZsZXgtZW5kJ319PlxuICAgICAgICAgICAgICB7aGFzUHJpY2VLUiAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBjb2xvcjondmFyKC0taW5rLTMpJ319Pnt0ZXh0LmJvb2tLckxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjIsIG1hcmdpblRvcDo0LCBjb2xvcjondmFyKC0taW5rKScsIGZvbnRXZWlnaHQ6NzAwfX0+e051bWJlcihiLnByaWNlS1IpLnRvTG9jYWxlU3RyaW5nKCl9XHVDNkQwPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHtoYXNQcmljZUtSICYmIGhhc1ByaWNlRU4gJiYgPGRpdiBzdHlsZT17e3dpZHRoOjEsIGJhY2tncm91bmQ6J3ZhcigtLWxpbmUtMiknLCBhbGlnblNlbGY6J3N0cmV0Y2gnfX0vPn1cbiAgICAgICAgICAgICAge2hhc1ByaWNlRU4gJiYgKFxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCwgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0zKSd9fT57dGV4dC5ib29rRW5MYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIyLCBtYXJnaW5Ub3A6NCwgY29sb3I6J3ZhcigtLWluayknLCBmb250V2VpZ2h0OjcwMH19PntOdW1iZXIoYi5wcmljZUVOKS50b0xvY2FsZVN0cmluZygpfVx1QzZEMDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZFwiIG9uQ2xpY2s9eygpID0+IGdvKCdib29rJyl9Pnt0ZXh0LmJvb2tCdXlDdGF9PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgYXNwZWN0UmF0aW86JzMvNCcsIG1heFdpZHRoOjI4MCwgbWFyZ2luOicwIGF1dG8nLFxuICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLFxuICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBwbGFjZUl0ZW1zOidjZW50ZXInLCBvdmVyZmxvdzonaGlkZGVuJyxcbiAgICAgICAgfX0+XG4gICAgICAgICAge2IuY292ZXJEYXRhVXJpID8gKFxuICAgICAgICAgICAgPGltZyBzcmM9e2IuY292ZXJEYXRhVXJpfSBhbHQ9e2Ake2IudGl0bGV9IFx1RDQ1Q1x1QzlDMGB9XG4gICAgICAgICAgICAgIHN0eWxlPXt7d2lkdGg6JzEwMCUnLCBoZWlnaHQ6JzEwMCUnLCBvYmplY3RGaXQ6J2NvdmVyJywgZGlzcGxheTonYmxvY2snfX0vPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7dGV4dEFsaWduOidjZW50ZXInLCBwYWRkaW5nOicwIDI0cHgnfX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LXNlcmlmKScsIGZvbnRTaXplOjI4LCBjb2xvcjondmFyKC0taW5rKScsIG1hcmdpbkJvdHRvbToxMCwgZm9udFdlaWdodDo2MDB9fT57Yi50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZTo5LCBmb250V2VpZ2h0OjYwMCwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMmVtJ319PntiLmF1dGhvciB8fCAnXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwJ30ge3RleHQuYm9va0F1dGhvclN1ZmZpeH08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxIb21lU2VjdGlvbkJvdW5kYXJ5IGxhYmVsPVwiXHVDQzQ1IENUQVwiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb24gc2VjdGlvbi0tYW5jaG9yXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRQYXVzZWQodHJ1ZSl9XG4gICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRQYXVzZWQoZmFsc2UpfVxuICAgICAgICAgIHN0eWxlPXt7cG9zaXRpb246J3JlbGF0aXZlJ319PlxuICAgICAgICAgIHsvKiB2MDAuMTYyIFx1MjAxNCBcdUMyQUNcdUI3N0NcdUM3NzRcdUI0REMgXHVCODA4XHVDNzc0XHVDNUI0LiBcdUJBQThcdUI0RTAgYm9va3MgXHVCOTdDIGxheWVyZWQgXHVCODVDIFx1QjgwQ1x1QjM1NCwgYWN0aXZlIFx1QjlDQyBvcGFjaXR5IDEgKyB0cmFuc2xhdGVYIDAuXG4gICAgICAgICAgICAgIGp1bXAgXHVDNUM2XHVCMjk0IFx1QkQ4MFx1QjREQ1x1QjdFQ1x1QzZCNCBjcm9zc2ZhZGUtc2xpZGUuIFx1Q0NBQiBcdUNDNDVcdUI5Q0MgcmVsYXRpdmUgXHVCODVDIHdyYXBwZXIgXHVCMTkyXHVDNzc0IFx1QkNGNFx1Qzg3NC4gKi99XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOidyZWxhdGl2ZSd9fT5cbiAgICAgICAgICAgIHtib29rcy5tYXAoKGIsIGkpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgYWN0aXZlID0gaSA9PT0gaWR4O1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtiLmlkIHx8IGl9XG4gICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj17YWN0aXZlID8gdW5kZWZpbmVkIDogJ3RydWUnfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGkgPT09IDAgPyAncmVsYXRpdmUnIDogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLCBsZWZ0OiAwLCByaWdodDogMCxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogYWN0aXZlID8gMSA6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogYWN0aXZlXG4gICAgICAgICAgICAgICAgICAgICAgPyAndHJhbnNsYXRlWCgwKSdcbiAgICAgICAgICAgICAgICAgICAgICA6IChpIDwgaWR4ID8gJ3RyYW5zbGF0ZVgoLTI0cHgpJyA6ICd0cmFuc2xhdGVYKDI0cHgpJyksXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IC41NXMgZWFzZSwgdHJhbnNmb3JtIC41NXMgZWFzZScsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6IGFjdGl2ZSA/ICdhdXRvJyA6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAge3JlbmRlckJvb2tDYXJkKGIpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7c2hvd0Nocm9tZSAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWxhYmVsPVwiXHVDNzc0XHVDODA0IFx1Q0M0NVwiIG9uQ2xpY2s9e2dvUHJldn1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgbGVmdDotOCwgdG9wOic1MCUnLCB0cmFuc2Zvcm06J3RyYW5zbGF0ZSgtMTAwJSwgLTUwJSknLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6NDQsIGhlaWdodDo0NCwgYm9yZGVyUmFkaXVzOic1MCUnLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBjb2xvcjondmFyKC0taW5rKScsIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgZm9udFNpemU6MjIsIGZvbnRXZWlnaHQ6NjAwLCBsaW5lSGVpZ2h0OjEsXG4gICAgICAgICAgICAgICAgfX0+XHUyMDM5PC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtbGFiZWw9XCJcdUIyRTRcdUM3NEMgXHVDQzQ1XCIgb25DbGljaz17Z29OZXh0fVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCByaWdodDotOCwgdG9wOic1MCUnLCB0cmFuc2Zvcm06J3RyYW5zbGF0ZSgxMDAlLCAtNTAlKScsXG4gICAgICAgICAgICAgICAgICB3aWR0aDo0NCwgaGVpZ2h0OjQ0LCBib3JkZXJSYWRpdXM6JzUwJScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGNvbG9yOid2YXIoLS1pbmspJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBwbGFjZUl0ZW1zOidjZW50ZXInLCBmb250U2l6ZToyMiwgZm9udFdlaWdodDo2MDAsIGxpbmVIZWlnaHQ6MSxcbiAgICAgICAgICAgICAgICB9fT5cdTIwM0E8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHtzaG93Q2hyb21lICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidjZW50ZXInLCBnYXA6OCwgbWFyZ2luVG9wOjE4fX0+XG4gICAgICAgICAgICB7Ym9va3MubWFwKChiLCBpKSA9PiAoXG4gICAgICAgICAgICAgIDxidXR0b24ga2V5PXtiLmlkIHx8IGl9IHR5cGU9XCJidXR0b25cIiBhcmlhLWxhYmVsPXtgJHtpKzF9XHVCQzg4XHVDOUY4IFx1Q0M0NVx1QzczQ1x1Qjg1QyBcdUM3NzRcdUIzRDlgfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElkeChpKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgd2lkdGg6IGkgPT09IGlkeCA/IDI0IDogOCwgaGVpZ2h0OiA4LCBwYWRkaW5nOiAwLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA0LCBib3JkZXI6ICdub25lJywgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpID09PSBpZHggPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWxpbmUtMiknLFxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjJzJyxcbiAgICAgICAgICAgICAgICB9fS8+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj48L0hvbWVTZWN0aW9uQm91bmRhcnk+XG4gICk7XG59O1xuXG5jb25zdCBIb21lUGFnZSA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgW21hcE9wZW4sIHNldE1hcE9wZW5dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbc2NUaWNrLCBzZXRTY1RpY2tdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtkYXRhVGljaywgc2V0RGF0YVRpY2tdID0gUmVhY3QudXNlU3RhdGUoMCk7XG5cbiAgLy8gU0VPL0hlcm8vQnJhbmQgcmVmcmVzaCBcdTIwMTQgXHVDOTg5XHVDMkRDIFx1QzdBQ1x1QjgwQ1x1QjM1NFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uUiA9ICgpID0+IHNldFNjVGljaygodikgPT4gdiArIDEpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZ25qLXNpdGUtY29udGVudC1yZWZyZXNoJywgb25SKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Jnbmotc2l0ZS1jb250ZW50LXJlZnJlc2gnLCBvblIpO1xuICB9LCBbXSk7XG5cbiAgLy8gXHVDMTFDXHVCQzg0IFx1QjM3MFx1Qzc3NFx1RDEzMCByZWZyZXNoIFx1Qzc3NFx1QkNBNFx1RDJCOCBcdTIwMTQgXHVDMkU0XHVDODFDIFx1QkMxQ1x1RDY1NCBcdUM3NzRcdUI5ODRcdUFDRkMgXHVDNzdDXHVDRTU4IChkYXRhLmpzIFx1Q0MzOFx1QUNFMCkuXG4gIC8vIGJnbmotcG9zdHMtcmVmcmVzaDogXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwIFx1QUM4Q1x1QzJEQ1x1QUUwMCAvIGJnbmotY29sdW1ucy1yZWZyZXNoOiBcdUNFN0NcdUI3RkMgLyBiZ25qLXRvdXJzLXJlZnJlc2g6IFx1QjJGNVx1QzBBQyAvIGJnbmotbGVjdHVyZXMtcmVmcmVzaDogXHVBQzE1XHVDNUYwIC8gYmduai1zaXRlLWNvbnRlbnQtcmVmcmVzaDogXHVDRDk0XHVDQzlDKFx1Qzc3NFx1QkJGOCBcdUM3MDRcdUM1RDBcdUMxMUMgbGlzdGVuKVxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHRpY2sgPSAoKSA9PiBzZXREYXRhVGljaygodikgPT4gdiArIDEpO1xuICAgIGNvbnN0IGV2dHMgPSBbJ2JnbmotY29sdW1ucy1yZWZyZXNoJywgJ2JnbmotdG91cnMtcmVmcmVzaCcsICdiZ25qLWxlY3R1cmVzLXJlZnJlc2gnLCAnYmduai1wb3N0cy1yZWZyZXNoJ107XG4gICAgZXZ0cy5mb3JFYWNoKChlKSA9PiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihlLCB0aWNrKSk7XG4gICAgcmV0dXJuICgpID0+IGV2dHMuZm9yRWFjaCgoZSkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZSwgdGljaykpO1xuICB9LCBbXSk7XG5cbiAgY29uc3Qgc2MgPSBSZWFjdC51c2VNZW1vKCgpID0+ICh3aW5kb3cuQkdOSl9TSVRFX0NPTlRFTlQ/LmdldD8uKCkgfHwge30pLCBbc2NUaWNrXSk7XG4gIGNvbnN0IGhlcm8gPSBzYy5oZXJvIHx8IHt9O1xuICBjb25zdCBob21lVGV4dCA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gZ2V0SG9tZVRleHQoc2MpLCBbc2NdKTtcbiAgLy8gXHVCQUE4XHVCQzE0XHVDNzdDIFx1QkQ4NFx1QUUzMCBcdTIwMTQgbWF0Y2hNZWRpYSBcdUJDQzBcdUFDQkQgXHVDMkRDIFx1Qzc5MFx1QjNEOSBcdUM3QUNcdUI4MENcdUIzNTQgKGhlcm9TdHlsZSBcdUIzQzQgXHVBQzMxXHVDMkUwKS5cbiAgY29uc3QgW2lzTW9iaWxlLCBzZXRJc01vYmlsZV0gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgdHJ5IHsgcmV0dXJuICEhKHdpbmRvdy5tYXRjaE1lZGlhICYmIHdpbmRvdy5tYXRjaE1lZGlhKCcobWF4LXdpZHRoOiA2MDBweCknKS5tYXRjaGVzKTsgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9KTtcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbXEgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogNjAwcHgpJyk7XG4gICAgICBjb25zdCBoYW5kbGVyID0gKGUpID0+IHNldElzTW9iaWxlKGUubWF0Y2hlcyk7XG4gICAgICBpZiAobXEuYWRkRXZlbnRMaXN0ZW5lcikgbXEuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaGFuZGxlcik7XG4gICAgICBlbHNlIGlmIChtcS5hZGRMaXN0ZW5lcikgbXEuYWRkTGlzdGVuZXIoaGFuZGxlcik7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAobXEucmVtb3ZlRXZlbnRMaXN0ZW5lcikgbXEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIGVsc2UgaWYgKG1xLnJlbW92ZUxpc3RlbmVyKSBtcS5yZW1vdmVMaXN0ZW5lcihoYW5kbGVyKTtcbiAgICAgIH07XG4gICAgfSBjYXRjaCB7fVxuICB9LCBbXSk7XG4gIGNvbnN0IGhlcm9TdHlsZSA9IFJlYWN0LnVzZU1lbW8oXG4gICAgKCkgPT4gKHdpbmRvdy5CR05KX0hFUk9fU1RZTEU/Lihpc01vYmlsZSA/ICdtb2JpbGUnIDogJ2Rlc2t0b3AnKSB8fCB3aW5kb3cuQkdOSl9IRVJPX1NUWUxFX0RFRkFVTFQpLFxuICAgIFtzY1RpY2ssIGlzTW9iaWxlXVxuICApO1xuICBjb25zdCByZWNvbW1lbmRhdGlvbnMgPSBBcnJheS5pc0FycmF5KHNjLnJlY29tbWVuZGF0aW9ucykgPyBzYy5yZWNvbW1lbmRhdGlvbnMuZmlsdGVyKEJvb2xlYW4pIDogW107XG4gIGNvbnN0IFtyZWNEZXRhaWwsIHNldFJlY0RldGFpbF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcblxuICAvLyBcdUMyRTRcdUIzNzBcdUM3NzRcdUQxMzBcdUI5Q0MgXHUyMDE0IFx1QzJEQ1x1QjREQyBcdUQzRjRcdUJDMzEgXHVDODFDXHVBQzcwLiBcdUJBQThcdUI0RTAgXHVENUVDXHVEMzdDIFx1RDYzOFx1Q0Q5Q1x1Qzc0MCBCR05KX0dVQVJELmFyciBcdUI4NUMgdHJ5L2NhdGNoICsgQXJyYXkgXHVBQzAwXHVCNERDLlxuICAvLyB2MDAuMTE1IFx1MjAxNCBCR05KX0dVQVJEIFx1QkJGOFx1Qjg1Q1x1QjREQyAoc2NyaXB0IFx1Qjg1Q1x1QjREQyByYWNlKSBcdUMyREMgXHVDNzc4XHVCNzdDXHVDNzc4IGZhbGxiYWNrIFx1QzczQ1x1Qjg1QyBcdUQzOThcdUM3NzRcdUM5QzAgXHVBRTY4XHVDOUQwIFx1QkMyOVx1QzlDMC5cbiAgY29uc3QgRyA9IHdpbmRvdy5CR05KX0dVQVJEIHx8IHtcbiAgICBhcnI6IChmbikgPT4geyB0cnkgeyBjb25zdCB2ID0gZm4oKTsgcmV0dXJuIEFycmF5LmlzQXJyYXkodikgPyB2IDogW107IH0gY2F0Y2ggeyByZXR1cm4gW107IH0gfSxcbiAgICBjYWxsOiAoZm4sIGZiKSA9PiB7IHRyeSB7IGNvbnN0IHYgPSBmbigpOyByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gZmIgOiB2OyB9IGNhdGNoIHsgcmV0dXJuIGZiOyB9IH0sXG4gIH07XG4gIC8vIFx1QzcyMFx1RDZBOFx1RDU1QyBzdGFydHNBdChcdUQzMENcdUMyRjEgXHVBQzAwXHVCMkE1XHVENTVDIFx1QjBBMFx1QzlEQykgXHVCOUNDIFx1RDFCNVx1QUNGQyBcdTIwMTQgTmFOIGdldFRpbWUgXHVDNzNDXHVCODVDIHNvcnQgXHVBQ0IwXHVBQ0ZDXHVBQzAwIFx1QUU2OFx1QzlDMFx1QjI5NCBcdUFDODMgXHVCQzI5XHVDOUMwLlxuICBjb25zdCBfaGFzVmFsaWREYXRlID0gKGlzbykgPT4ge1xuICAgIGlmICghaXNvKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgdCA9IERhdGUucGFyc2UoaXNvKTtcbiAgICByZXR1cm4gIWlzTmFOKHQpO1xuICB9O1xuICBjb25zdCBwdWJsaWNDb2x1bW5zID0gUmVhY3QudXNlTWVtbygoKSA9PiBHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9DT0xVTU5TPy5saXN0UHVibGljPy4oKSksIFtkYXRhVGlja10pO1xuICBjb25zdCBmZWF0dXJlZENvbHVtbiA9IHB1YmxpY0NvbHVtbnNbMF07XG4gIGNvbnN0IHNlY29uZGFyeUNvbHVtbnMgPSBwdWJsaWNDb2x1bW5zLnNsaWNlKDEsIDUpO1xuICBjb25zdCByZWNlbnRQb3N0cyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5saXN0UG9zdHM/LigpKS5zbGljZSgwLCA0KSwgW2RhdGFUaWNrXSk7XG4gIGNvbnN0IHRvdXJzID0gUmVhY3QudXNlTWVtbygoKSA9PiBHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9UT1VSUz8ubGlzdEFsbD8uKCkpLmZpbHRlcigodCkgPT4gdCAmJiAhdC5oaWRkZW4pLnNsaWNlKDAsIDQpLCBbZGF0YVRpY2tdKTtcbiAgY29uc3QgbGVjdHVyZXMgPSBSZWFjdC51c2VNZW1vKCgpID0+IEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0xFQ1RVUkVTPy5saXN0QWxsPy4oKSkuZmlsdGVyKChsKSA9PiBsICYmICFsLmhpZGRlbikuc2xpY2UoMCwgMyksIFtkYXRhVGlja10pO1xuXG4gIC8vIGhlcm8uc3RhdHMgXHVBQzAwIFx1Qzc4OFx1QzczQ1x1QkE3NCBcdUNGNThcdUQxNTBcdUNFMjAobGFiZWwvc3ViL3ZhbHVlRmFsbGJhY2spIFx1Qjk3QyBcdUFDNzBcdUFFMzBcdUMxMUMuIFx1QjNEOVx1QzgwMSB2YWx1ZShcdUQyMkNcdUM1QjQvXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwIFx1QUMyRlx1QzIxOCkgXHVCMjk0IFx1Q0Y1NFx1QjREQyBcdUNFMjEgXHVDNkIwXHVDMTIwLlxuICBjb25zdCBoZXJvU3RhdHMgPSBBcnJheS5pc0FycmF5KGhlcm8uc3RhdHMpICYmIGhlcm8uc3RhdHMubGVuZ3RoID09PSAzID8gaGVyby5zdGF0cyA6IFtcbiAgICB7IGxhYmVsOiAnXHVDNUVDXHVENTg5XHVDOUMwJywgICBzdWI6ICdcdUM4RkNcdUM2OTQgXHVCMkY1XHVDMEFDXHVDOUMwIFx1QzZCNFx1QzYwMScsICAgdmFsdWVGYWxsYmFjazogJ1x1QzgwNFx1QUQ2RCcgICAgfSxcbiAgICB7IGxhYmVsOiAnXHVEMjJDXHVDNUI0JywgICAgIHN1YjogJ1x1QzlDMVx1QzgxMSBcdUFFMzBcdUQ2OEQgXHVENTA0XHVCODVDXHVBREY4XHVCN0E4JywgdmFsdWVGYWxsYmFjazogJ1x1QzkwMFx1QkU0NCBcdUM5MTEnIH0sXG4gICAgeyBsYWJlbDogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCcsIHN1YjogJ1x1RDU2OFx1QUVEOCBcdUI5Q0NcdUI0RENcdUIyOTQgXHVDNUVDXHVENTg5JywgICB2YWx1ZUZhbGxiYWNrOiAnXHVDNkI0XHVDNjAxIFx1QzkxMScgfSxcbiAgXTtcbiAgY29uc3Qgc3RhdHMgPSBbXG4gICAgeyBsOiBoZXJvU3RhdHNbMF0ubGFiZWwsIHY6IGhlcm9TdGF0c1swXS52YWx1ZUZhbGxiYWNrIHx8ICdcdUM4MDRcdUFENkQnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgczogaGVyb1N0YXRzWzBdLnN1YiB9LFxuICAgIHsgbDogaGVyb1N0YXRzWzFdLmxhYmVsLCB2OiB0b3Vycy5sZW5ndGggPiAwID8gYCR7dG91cnMubGVuZ3RofVx1QUMxQ2AgOiAoaGVyb1N0YXRzWzFdLnZhbHVlRmFsbGJhY2sgfHwgJ1x1QzkwMFx1QkU0NCBcdUM5MTEnKSwgICAgIHM6IGhlcm9TdGF0c1sxXS5zdWIgfSxcbiAgICB7IGw6IGhlcm9TdGF0c1syXS5sYWJlbCwgdjogcmVjZW50UG9zdHMubGVuZ3RoID4gMCA/IGAke3JlY2VudFBvc3RzLmxlbmd0aH0rYCA6IChoZXJvU3RhdHNbMl0udmFsdWVGYWxsYmFjayB8fCAnXHVDNkI0XHVDNjAxIFx1QzkxMScpLCBzOiBoZXJvU3RhdHNbMl0uc3ViIH0sXG4gIF07XG5cbiAgY29uc3QgY2xpY2thYmxlID0gKG9uQ2xpY2ssIGxhYmVsKSA9PiAoe1xuICAgIHJvbGU6J2J1dHRvbicsIHRhYkluZGV4OjAsICdhcmlhLWxhYmVsJzpsYWJlbCwgb25DbGljayxcbiAgICBvbktleURvd246KGUpID0+IHsgaWYgKGUua2V5PT09J0VudGVyJ3x8ZS5rZXk9PT0nICcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBvbkNsaWNrKCk7IH0gfSxcbiAgICBzdHlsZTp7Y3Vyc29yOidwb2ludGVyJ30sXG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJob21lLXBhZ2VcIj5cbiAgICAgIHttYXBPcGVuICYmIDxEZXN0aW5hdGlvbk1hcE1vZGFsIG9uQ2xvc2U9eygpID0+IHNldE1hcE9wZW4oZmFsc2UpfSBnbz17Z299Lz59XG4gICAgICB7cmVjRGV0YWlsICYmIDxSZWNvbW1lbmRhdGlvbkRldGFpbE1vZGFsIHJlYz17cmVjRGV0YWlsfSBvbkNsb3NlPXsoKSA9PiBzZXRSZWNEZXRhaWwobnVsbCl9IGdvPXtnb30vPn1cblxuICAgICAgey8qIHYwMC4xNDMgXHUyMDE0IFx1QzYyNFx1RDUwOCBcdUM1NDhcdUIwQjQgXHVCQzMwXHVCMTA4XHVCMjk0IGJvb3QuanN4IFx1Qjg1QyBcdUM3NzRcdUIzRDkgKHNpdGV3aWRlLCBcdUJBNTRcdUIyNzQgXHVDNzA0XHVDQUJEKS4gKi99XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgSEVSTyAoXHVEMTREXHVDMkE0XHVEMkI4ICsgXHVDNkIwXHVDRTIxIFx1QzlDMFx1QjNDNCBcdUJCRjhcdUI5QUNcdUJDRjRcdUFFMzAsIFx1QkFBOFx1QkMxNFx1Qzc3QyAxXHVCMkU4KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1RDc4OFx1QzVCNFx1Qjg1Q1wiPjxzZWN0aW9uIGNsYXNzTmFtZT1cImhvbWUtaGVyb1wiIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidyZWxhdGl2ZScsIG92ZXJmbG93OidoaWRkZW4nLFxuICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgIHBhZGRpbmc6JzcycHggMCA4OHB4JyxcbiAgICAgIH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyby1ncmlkIGhvbWUtaGVyby1ncmlkXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxLjJmciAxZnInLCBnYXA6NTYsIGFsaWduSXRlbXM6J2NlbnRlcicsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7LyogXHVDODhDXHVDRTIxOiBcdUQxNERcdUMyQTRcdUQyQjggXHUyMDE0IGhlcm9TdHlsZSBcdUQyQjhcdUM3MTcoXHVBRDAwXHVCOUFDXHVDNzkwICdcdUQ3ODhcdUM1QjRcdUI4NUMnIFx1RDBFRCkgXHVDNzc4XHVCNzdDXHVDNzc4IFx1QzgwMVx1QzZBOSAqL31cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3t0ZXh0QWxpZ246IGhlcm9TdHlsZS50aXRsZS50ZXh0QWxpZ24gfHwgJ2xlZnQnfX0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogaGVyb1N0eWxlLmV5ZWJyb3cuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLmV5ZWJyb3cuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBgJHtoZXJvU3R5bGUuZXllYnJvdy5sZXR0ZXJTcGFjaW5nfWVtYCxcbiAgICAgICAgICAgICAgICBjb2xvcjogYHZhcigke2hlcm9TdHlsZS5leWVicm93LmNvbG9yfSlgLFxuICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06IGhlcm9TdHlsZS5leWVicm93LnRleHRUcmFuc2Zvcm0gfHwgJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIDxzcGFuPntoZXJvLmV5ZWJyb3cgfHwgXCJcdUJBMzlcdUFDRTAgXHVDNzkwXHVBQ0UwIFx1QUM3N1x1QUNFMCBcdUM3N0RcdUIyOTQgXHVENTVDXHVBRDZEXCJ9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGgxIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1kaXNwbGF5KScsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IGBjbGFtcCgzNnB4LCA1dncsICR7aGVyb1N0eWxlLnRpdGxlLmZvbnRTaXplfXB4KWAsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLnRpdGxlLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogaGVyb1N0eWxlLnRpdGxlLmxpbmVIZWlnaHQsXG4gICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogYCR7aGVyb1N0eWxlLnRpdGxlLmxldHRlclNwYWNpbmd9ZW1gLFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbToyMixcbiAgICAgICAgICAgICAgICBjb2xvcjpgdmFyKCR7aGVyb1N0eWxlLnRpdGxlLmNvbG9yfSlgLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICB7aGVyby50aXRsZTEgfHwgXCJcdUQ1NUNcdUFENkRcdUM3NDRcIn08YnIvPlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7Y29sb3I6YHZhcigke2hlcm9TdHlsZS50aXRsZS5hY2NlbnRDb2xvcn0pYH19PntoZXJvLnRpdGxlMiB8fCBcIlx1QzlDMVx1QzgxMSBcdUFDNzdcdUFDRTBcIn08L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgICB7aGVyby50aXRsZTMgfHwgXCJcdUNDOUNcdUNDOUNcdUQ3ODggXHVDNzdEXHVCMkU0XCJ9XG4gICAgICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImJnbmotbXVsdGlsaW5lXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogaGVyb1N0eWxlLnN1YnRpdGxlLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IGhlcm9TdHlsZS5zdWJ0aXRsZS5saW5lSGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNvbG9yOiBgdmFyKCR7aGVyb1N0eWxlLnN1YnRpdGxlLmNvbG9yfSlgLFxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBoZXJvU3R5bGUuc3VidGl0bGUubWF4V2lkdGgsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOjMyLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5zdWJ0aXRsZS5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IGhlcm9TdHlsZS50aXRsZS50ZXh0QWxpZ24gPT09ICdjZW50ZXInID8gJ2F1dG8nIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiBoZXJvU3R5bGUudGl0bGUudGV4dEFsaWduID09PSAnY2VudGVyJyA/ICdhdXRvJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAge2hlcm8uc3VidGl0bGUgfHwgXCJcdUFEODFcdUFEOTBcdUFDRkMgXHVBQ0U4XHVCQUE5LCBcdUMyRENcdUM3QTVcdUFDRkMgXHVDMjE5XHVDMThDLCBcdUNDNDVcdUFDRkMgXHVBQzE1XHVDNUYwXHVDNzQ0IFx1QzYyNFx1QUMwMFx1QkE3MCBcdUQ1NUNcdUFENkRcdUM3NDQgXHVDODcwXHVBRTA4IFx1QjM1NCBcdUFDMDBcdUFFNENcdUM3NzQgXHVCRDA1XHVCMkM4XHVCMkU0LiBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUIyOTQgXHVDNUVDXHVENTg5XHVDNzQ0IFx1QUUzMFx1Qjg1RFx1RDU1OFx1QUNFMCBcdUQ1NjhcdUFFRDggXHVCNUEwXHVCMDk4XHVCMjk0IFx1QzBBQ1x1Qjc4Q1x1QjRFNFx1Qzc1OCBcdUM3OTFcdUM3NDAgXHVCQUE4XHVDNzg0XHVDNzg1XHVCMkM4XHVCMkU0LlwifVxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OidmbGV4JywgZ2FwOjEyLCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbTo0MCxcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogaGVyb1N0eWxlLnRpdGxlLnRleHRBbGlnbiA9PT0gJ2NlbnRlcicgPyAnY2VudGVyJyA6IChoZXJvU3R5bGUudGl0bGUudGV4dEFsaWduID09PSAncmlnaHQnID8gJ2ZsZXgtZW5kJyA6ICdmbGV4LXN0YXJ0JyksXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLmN0YS5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICB7LyogdjAwLjE1MiBcdTIwMTQgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QzY5NFx1Q0NBRCAnXHVDOUMwXHVCM0M0XHVDNUQwXHVDMTFDIFx1QzVFQ1x1RDU4OVx1QzlDMCBcdUNDM0VcdUFFMzAgXHVCQzg0XHVEMkJDIFx1QzBBRFx1QzgxQycuICovfVxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkXCIgb25DbGljaz17KCkgPT4gZ28oJ2NvbW11bml0eScpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tmb250V2VpZ2h0OiBoZXJvU3R5bGUuY3RhLmZvbnRXZWlnaHR9fT5cbiAgICAgICAgICAgICAgICAgIHtoZXJvLmN0YVByaW1hcnkgfHwgXCJcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVCQ0Y0XHVBRTMwXCJ9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXsoKSA9PiBnbygndG91cicpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tmb250V2VpZ2h0OiBoZXJvU3R5bGUuY3RhLmZvbnRXZWlnaHR9fT5cbiAgICAgICAgICAgICAgICAgIHtoZXJvLmN0YVNlY29uZGFyeSB8fCBcIlx1QjJGNVx1QzBBQyBcdUM3N0NcdUM4MTUgXHVCQ0Y0XHVBRTMwXCJ9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8tc3RhdHNcIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOidyZXBlYXQoMywxZnIpJywgZ2FwOjIwLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6MjQsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAge3N0YXRzLm1hcCgoc3RhdCkgPT4gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3N0YXQubH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LXNlcmlmKScsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IGhlcm9TdHlsZS5zdGF0cy52YWx1ZS5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBoZXJvU3R5bGUuc3RhdHMudmFsdWUuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYHZhcigke2hlcm9TdHlsZS5zdGF0cy52YWx1ZS5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206NCxcbiAgICAgICAgICAgICAgICAgICAgfX0+e3N0YXQudn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBoZXJvU3R5bGUuc3RhdHMubGFiZWwuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLnN0YXRzLmxhYmVsLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogYCR7aGVyb1N0eWxlLnN0YXRzLmxhYmVsLmxldHRlclNwYWNpbmd9ZW1gLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBgdmFyKCR7aGVyb1N0eWxlLnN0YXRzLmxhYmVsLmNvbG9yfSlgLFxuICAgICAgICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06IGhlcm9TdHlsZS5zdGF0cy5sYWJlbC50ZXh0VHJhbnNmb3JtIHx8ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTozLFxuICAgICAgICAgICAgICAgICAgICB9fT57c3RhdC5sfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IGhlcm9TdHlsZS5zdGF0cy5zdWIuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtoZXJvU3R5bGUuc3RhdHMuc3ViLmNvbG9yfSlgLFxuICAgICAgICAgICAgICAgICAgICB9fT57c3RhdC5zfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBcdUM2QjBcdUNFMjE6IFx1QzlDMFx1QjNDNCBcdUJCRjhcdUI5QUNcdUJDRjRcdUFFMzAgXHUyMDE0IFx1QzJEQ1x1QjNDNCBcdUQwNzRcdUI5QUQgXHUyMTkyIFx1QzgwNFx1Q0NCNCBcdUJBQThcdUIyRUMgKGExMXk6IFx1QzY3OFx1QUNGRCBkaXYgXHVCMjk0IFx1QjJFOFx1QzIxQyBcdUNFRThcdUQxNENcdUM3NzRcdUIxMDgsIFx1QzJFNFx1QzgxQyBcdUJDODRcdUQyQkNcdUM3NDAgcmVnaW9uIHBhdGggXHVDNjQwIFx1QzZCMFx1QzBDMVx1QjJFOCBcdUQxNERcdUMyQTRcdUQyQjggXHVCQzg0XHVEMkJDKS4gXHVEM0YwKFx1MjI2NDYwMHB4KSBcdUM1RDBcdUMxMUNcdUIyOTQgaGVyby1tYXAtcHJldmlldyBDU1MgXHVCODVDIFx1QzIyOFx1QUU0MCArIENUQSBcdUJDODRcdUQyQkNcdUI5Q0MgXHVCMTc4XHVDRDlDLiAqL31cbiAgICAgICAgICAgIHsvKiB2MDAuMTA2IFx1MjAxNCBcdUM5QzBcdUIzQzQgXHUyMTkyIFx1QjJFNFx1Qzc0QyBcdUFDMTVcdUM1RjAgLyBcdUIyRTRcdUM3NEMgXHVCMkY1XHVDMEFDIFx1QkJGOFx1QjJDOCBcdUNFNzRcdUI0REMgKEFcdUM1NDgpICovfVxuICAgICAgICAgICAgPEhlcm9Qcm9ncmFtQ2FyZHMgZ289e2dvfSBkYXRhVGljaz17ZGF0YVRpY2t9IHRleHQ9e2hvbWVUZXh0fS8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8L0hvbWVTZWN0aW9uQm91bmRhcnk+XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0Q5NFx1Q0M5QyAoXHVBRDAwXHVCOUFDXHVDNzkwIFx1Q0Y1OFx1RDE1MFx1Q0UyMCBcdUQzMjhcdUIxMTBcdUM1RDBcdUMxMUMgXHVDRDk0XHVBQzAwKSBcdTIwMTQgdjAwLjE2NCBhbmNob3IgXHVCQzE1XHVDNzkwICsgYXN5bW1ldHJpYyBncmlkIFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIHtyZWNvbW1lbmRhdGlvbnMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxIb21lU2VjdGlvbkJvdW5kYXJ5IGxhYmVsPVwiXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0Q5NFx1Q0M5Q1wiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb24gc2VjdGlvbi0tYW5jaG9yXCIgc3R5bGU9e3tiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICAgICAgLy8gdjAwLjA4MyBcdTIwMTQgc2l0ZV9jb250ZW50X2t2LnJlY29tbWVuZGF0aW9uc0hlYWRpbmcgXHVDNUQwXHVDMTFDIGhlcm8gXHVDNzdEXHVDNzRDICh2MDAuMDczIHN3ZWVwIFx1QkJGOFx1QzY0NCBcdUM3OTRcdUM3QUMpLlxuICAgICAgICAgICAgICBjb25zdCBfaSA9ICh3aW5kb3cuQkdOSl9TSVRFX0NPTlRFTlQ/LmdldD8uKCkgfHwge30pLnJlY29tbWVuZGF0aW9uc0hlYWRpbmcgfHwge307XG4gICAgICAgICAgICAgIGNvbnN0IGViID0gaG9tZVRleHQucmVjRXllYnJvdyB8fCBfaS5leWVicm93IHx8IEhPTUVfVEVYVF9ERUZBVUxULnJlY0V5ZWJyb3c7XG4gICAgICAgICAgICAgIGNvbnN0IHRwID0gaG9tZVRleHQucmVjVGl0bGVQcmVmaXggPz8gX2kudGl0bGVQcmVmaXggPz8gSE9NRV9URVhUX0RFRkFVTFQucmVjVGl0bGVQcmVmaXg7XG4gICAgICAgICAgICAgIGNvbnN0IHRhID0gaG9tZVRleHQucmVjVGl0bGVBY2NlbnQgPz8gX2kudGl0bGVBY2NlbnQgPz8gSE9NRV9URVhUX0RFRkFVTFQucmVjVGl0bGVBY2NlbnQ7XG4gICAgICAgICAgICAgIGNvbnN0IHRzID0gaG9tZVRleHQucmVjVGl0bGVTdWZmaXggPz8gX2kudGl0bGVTdWZmaXggPz8gSE9NRV9URVhUX0RFRkFVTFQucmVjVGl0bGVTdWZmaXg7XG4gICAgICAgICAgICAgIGNvbnN0IHNiID0gaG9tZVRleHQucmVjU3VidGl0bGUgfHwgX2kuc3VidGl0bGUgfHwgSE9NRV9URVhUX0RFRkFVTFQucmVjU3VidGl0bGU7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFNlY3Rpb25IZWFkXG4gICAgICAgICAgICAgICAgICBleWVicm93PXtlYn1cbiAgICAgICAgICAgICAgICAgIHRpdGxlPXs8Pnt0cH08c3BhbiBjbGFzc05hbWU9XCJhY2NlbnRcIj57dGF9PC9zcGFuPnt0c308Lz59XG4gICAgICAgICAgICAgICAgICBzdWJ0aXRsZT17c2J9XG4gICAgICAgICAgICAgICAgICBhY3Rpb249ezxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IGdvKCd0b3VyJyl9Pntob21lVGV4dC5yZWNBY3Rpb259PC9idXR0b24+fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgey8qIHYwMC4xNjQgXHUyMDE0IFx1Q0Q5NFx1Q0M5QyBcdUNFNzRcdUI0REMgM1x1QUMxQyBcdUM3NzRcdUMwQzFcdUM3NzRcdUJBNzQgYXN5bW1ldHJpYyAoXHVDQ0FCIFx1Q0U3NFx1QjREQyAyeCkuIFx1QURGOCBcdUJCRjhcdUI5Q0NcdUM3NzRcdUJBNzQgZ3JpZC0zIFx1RDNGNFx1QkMzMS4gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17cmVjb21tZW5kYXRpb25zLmxlbmd0aCA+PSAzID8gJ2dyaWQgZ3JpZC1mZWF0dXJlLTInIDogJ2dyaWQgZ3JpZC0zJ30+XG4gICAgICAgICAgICAgIHtyZWNvbW1lbmRhdGlvbnMubWFwKChyLCByaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhZ3MgPSBBcnJheS5pc0FycmF5KHIudGFncykgPyByLnRhZ3MgOiAodHlwZW9mIHIudGFncyA9PT0gJ3N0cmluZycgPyByLnRhZ3Muc3BsaXQoL1ssXHUwMEI3XS8pLm1hcCgocykgPT4gcy50cmltKCkpLmZpbHRlcihCb29sZWFuKSA6IFtdKTtcbiAgICAgICAgICAgICAgICAvLyB2MDAuMTY0IFx1MjAxNCBcdUNDQUIgXHVDRTc0XHVCNERDIChhc3ltbWV0cmljIFx1QkFBOFx1QjREQykgXHVCMjk0IFx1QzBBQ1x1QzlDNC9cdUQwQzBcdUM3NzRcdUQyQzAvZGVzYyBcdUJBQThcdUI0NTAgXHVEMDdDLlxuICAgICAgICAgICAgICAgIGNvbnN0IGlzRmVhdHVyZSA9IHJlY29tbWVuZGF0aW9ucy5sZW5ndGggPj0gMyAmJiByaSA9PT0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGFydGljbGUga2V5PXtyLmlkIHx8IHIubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2FyZCBjYXJkLS1iYXJlXCJcbiAgICAgICAgICAgICAgICAgICAgey4uLmNsaWNrYWJsZSgoKSA9PiBzZXRSZWNEZXRhaWwociksIGAke3IubmFtZSB8fCAnXHVDRDk0XHVDQzlDJ30gXHVDMEMxXHVDMTM4IFx1QkNGNFx1QUUzMGApfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcicsIGRpc3BsYXk6J2ZsZXgnLCBmbGV4RGlyZWN0aW9uOidjb2x1bW4nLCBwYWRkaW5nOjB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogaXNGZWF0dXJlID8gMzIwIDogMTYwLCBtYXJnaW5Cb3R0b206MTgsIHBvc2l0aW9uOidyZWxhdGl2ZScsIG92ZXJmbG93OidoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHIuaW1hZ2VEYXRhVXJpID8gYHVybCgke3IuaW1hZ2VEYXRhVXJpfSkgY2VudGVyL2NvdmVyYCA6ICd2YXIoLS1iZy0zKScsXG4gICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgIHtyLnJlZ2lvbiAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDoxMCwgbGVmdDoxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzonM3B4IDhweCcsIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgICAgICAgICAgICB9fT57ci5yZWdpb259PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIHt0YWdzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjYsIG1hcmdpbkJvdHRvbToxMCwgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGFncy5zbGljZSgwLCAzKS5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4ga2V5PXt0fSBjbGFzc05hbWU9XCJiYWRnZVwiIHN0eWxlPXt7Zm9udFNpemU6OX19Pnt0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOiBpc0ZlYXR1cmUgPyAzMCA6IDIyLCBmb250V2VpZ2h0OjYwMCwgbWFyZ2luQm90dG9tOjUsIGxpbmVIZWlnaHQ6MS4yNX19PntyLm5hbWUgfHwgJ1x1QzgxQ1x1QkFBOSBcdUM1QzZcdUM3NEMnfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgIHtyLnN1YnRpdGxlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6MTEsIGZvbnRXZWlnaHQ6NjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3ZhcigtLXNlY29uZGFyeSknLCBsZXR0ZXJTcGFjaW5nOicwLjA1ZW0nLCBtYXJnaW5Cb3R0b206MTAsXG4gICAgICAgICAgICAgICAgICAgICAgfX0+e3Iuc3VidGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIHtyLmRlc2MgJiYgPHAgc3R5bGU9e3tmb250U2l6ZTogaXNGZWF0dXJlID8gMTQgOiAxMywgbGluZUhlaWdodDoxLjcsIGNvbG9yOid2YXIoLS1pbmstMiknfX0+e3IuZGVzY308L3A+fVxuICAgICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj48L0hvbWVTZWN0aW9uQm91bmRhcnk+XG4gICAgICApfVxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFx1RDIyQ1x1QzVCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QTggXHUyMDE0IHYwMC4xNjQgaW5saW5lIFx1RDVFNFx1QjM1NCArIHNlY3Rpb24tdGlnaHQgKFx1QzlDMFx1QzZEMCBcdUJDMTVcdUM3OTApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIHt0b3Vycy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUQyMkNcdUM1QjQgXHVENTA0XHVCODVDXHVBREY4XHVCN0E4XCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwic2VjdGlvbi10aWdodFwiIHN0eWxlPXt7Ym9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIHsvKiB2MDAuMTY0IFx1MjAxNCBpbmxpbmUgXHVENUU0XHVCMzU0OiBleWVicm93ICsgdGl0bGUgKyBjb3VudCArIGFjdGlvbiBcdUQ1NUMgXHVDOTA0LiBzdWJ0aXRsZSBcdUM4MUNcdUFDNzAgKHNlY3Rpb24taGVhZC0taW5saW5lIFx1QUMwMCBoaWRlKS4gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24taGVhZCBzZWN0aW9uLWhlYWQtLWlubGluZVwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+e2hvbWVUZXh0LnRvdXJFeWVicm93fTwvZGl2PlxuICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJzZWN0aW9uLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICB7aG9tZVRleHQudG91clRpdGxlfVxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOjEzLCBmb250V2VpZ2h0OjYwMCwgbGV0dGVyU3BhY2luZzonMC4xOGVtJyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6J3ZhcigtLWluay0zKScsIG1hcmdpbkxlZnQ6MTQsIHZlcnRpY2FsQWxpZ246J21pZGRsZScsXG4gICAgICAgICAgICAgICAgICB9fT5cdTAwQjcge3RvdXJzLmxlbmd0aH1cdUFDMUMgXHVDNzdDXHVDODE1PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBnbygndG91cicpfT57aG9tZVRleHQudG91ckFjdGlvbn08L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtMlwiPlxuICAgICAgICAgICAgICB7dG91cnMubWFwKCh0LCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGFydGljbGUga2V5PXt0LmlkfSBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ3RvdXInKSwgYFx1RDIyQ1x1QzVCNDogJHt0LnRpdGxlfWApfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBwb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6MjAsIHJpZ2h0OjIwLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZToxMCwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMmVtJyxcbiAgICAgICAgICAgICAgICAgIH19PjB7aSsxfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OCwgbWFyZ2luQm90dG9tOjE2LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAge3QubGV2ZWwgJiYgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2VcIj57dC5sZXZlbH08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICB7dC5kdXJhdGlvbiAmJiA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiPnt0LmR1cmF0aW9ufTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgIHt0Lmdyb3VwICYmIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCI+e3QuZ3JvdXB9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIiBzdHlsZT17e2ZvbnRTaXplOjIyLCBtYXJnaW5Cb3R0b206MTB9fT57dC50aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAge3QuZGVzYyAmJiA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgbWFyZ2luQm90dG9tOjIwfX0+e3RydW5jYXRlUHJldmlldyh0LmRlc2MsIDExMCl9PC9wPn1cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknLCBwYWRkaW5nVG9wOjE2LFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgZm9udFdlaWdodDo2MDAsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIGNvbG9yOid2YXIoLS1pbmstMyknfX0+e2hvbWVUZXh0LnRvdXJOZXh0TGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Ub3A6NCwgY29sb3I6J3ZhcigtLWluayknLCBmb250V2VpZ2h0OjUwMH19Pnt0Lm5leHQgfHwgaG9tZVRleHQuZW1wdHlGYWxsYmFja308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3t0ZXh0QWxpZ246J3JpZ2h0J319PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBjb2xvcjondmFyKC0taW5rLTMpJ319Pntob21lVGV4dC50b3VyUHJpY2VMYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMCwgbWFyZ2luVG9wOjQsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo2MDB9fT57dC5wcmljZSA/ICh0eXBlb2YgdC5wcmljZSA9PT0gJ251bWJlcicgPyB3aW5kb3cuQkdOSl9GTVQud29uKHQucHJpY2UpIDogdC5wcmljZSkgOiBob21lVGV4dC5lbXB0eUZhbGxiYWNrfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwIFx1MjAxNCB2MDAuMTY0IG1pZCBcdUJDMTVcdUM3OTAgKyBcdUQ1RTRcdUIzNTQgXHVCQzE1XHVDNzkwIFx1QkNDMFx1RDYxNSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFwiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb24tLW1pZFwiIHN0eWxlPXt7YmFja2dyb3VuZDondmFyKC0tYmctMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKSd9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICB7LyogdjAwLjE2NCBcdTIwMTQgXHVDRUY0XHVEMzI5XHVEMkI4IFx1RDVFNFx1QjM1NCArIHN1YnRpdGxlIFx1QzZCMFx1Q0UyMSBcdUM3NzhcdUI3N0NcdUM3NzggKFx1QUUzMFx1Qzg3NCBTZWN0aW9uSGVhZCBcdUM3NTggNFx1QjJFOCBcdUJDMTVcdUM3OTAgXHVBRTc4KS4gKi99XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonZmxleC1lbmQnLFxuICAgICAgICAgICAgZ2FwOjMyLCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbTozMiwgcGFkZGluZ0JvdHRvbToxOCxcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OicxIDEgMzIwcHgnLCBtaW5XaWR0aDowfX0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+e2hvbWVUZXh0LmNvbW11bml0eUV5ZWJyb3d9PC9kaXY+XG4gICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJzZWN0aW9uLXRpdGxlXCIgc3R5bGU9e3tmb250U2l6ZToyOCwgbWFyZ2luQm90dG9tOjB9fT57aG9tZVRleHQuY29tbXVuaXR5VGl0bGV9PC9oMj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2hvbWVUZXh0LmNvbW11bml0eVN1YnRpdGxlICYmIChcbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmbGV4OicxIDEgMjgwcHgnLCBmb250U2l6ZToxMywgY29sb3I6J3ZhcigtLWluay0zKScsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDoxLjcsIG1hcmdpbjowLCBtYXhXaWR0aDozODAsXG4gICAgICAgICAgICAgIH19Pntob21lVGV4dC5jb21tdW5pdHlTdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gZ28oJ2NvbW11bml0eScpfT57aG9tZVRleHQuY29tbXVuaXR5QWN0aW9ufTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtyZWNlbnRQb3N0cy5sZW5ndGggPiAwID8gKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2JvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgICAgICB7cmVjZW50UG9zdHMubWFwKChwb3N0LCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e3Bvc3QuaWR9XG4gICAgICAgICAgICAgICAgICB7Li4uY2xpY2thYmxlKCgpID0+IGdvKCdjb21tdW5pdHknKSwgcG9zdC50aXRsZSl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OidmbGV4JywgZ2FwOjIwLCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOicxNnB4IDIycHgnLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpICUgMiA9PT0gMCA/ICd2YXIoLS1iZyknIDogJ3ZhcigtLWJnLTIpJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBpIDwgcmVjZW50UG9zdHMubGVuZ3RoIC0gMSA/ICcxcHggc29saWQgdmFyKC0tbGluZSknIDogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZmxleDoxLCBtaW5XaWR0aDowfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjgsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbTo1LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7cG9zdC5jYXRlZ29yeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiIHN0eWxlPXt7Zm9udFNpemU6OX19Pntwb3N0LmNhdGVnb3J5fTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAge3Bvc3QucHJlZml4ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZTo5LCBmb250V2VpZ2h0OjcwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3ZhcigtLXNlY29uZGFyeSknLCBsZXR0ZXJTcGFjaW5nOicwLjFlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICB9fT5be3Bvc3QucHJlZml4fV08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjE1LCBjb2xvcjondmFyKC0taW5rKScsIG1hcmdpbkJvdHRvbTozLCBmb250V2VpZ2h0OjUwMH19Pntwb3N0LnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1pbmstMyknLCBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJ319PlxuICAgICAgICAgICAgICAgICAgICAgIHtwb3N0LmF1dGhvcn0gXHUwMEI3IHtwb3N0LmRhdGV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBnYXA6MTQsIGNvbG9yOid2YXIoLS1pbmstMyknLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6MTEsIGZsZXhTaHJpbms6MCwgZm9udFdlaWdodDo1MDAsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2hvbWVUZXh0LmNvbW11bml0eVJlcGx5TGFiZWx9IHtwb3N0LnJlcGxpZXMgPz8gMH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7Y29sb3I6J3ZhcigtLWluay0yKSd9fT5cdTIxOTI8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3t0ZXh0QWxpZ246J2NlbnRlcicsIHBhZGRpbmc6NjB9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MjAsIGNvbG9yOid2YXIoLS1pbmspJywgbWFyZ2luQm90dG9tOjEyLCBmb250V2VpZ2h0OjYwMH19PlxuICAgICAgICAgICAgICAgIHtob21lVGV4dC5jb21tdW5pdHlFbXB0eVRpdGxlfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyNCwgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICAgICAgICB7aG9tZVRleHQuY29tbXVuaXR5RW1wdHlTdWJ0aXRsZX1cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZFwiIG9uQ2xpY2s9eygpID0+IGdvKCdjb21tdW5pdHknKX0+e2hvbWVUZXh0LmNvbW11bml0eUVtcHR5Q3RhfTwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+PC9Ib21lU2VjdGlvbkJvdW5kYXJ5PlxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNFN0NcdUI3RkMgXHUyMDE0IHYwMC4xNjQgbWFnYXppbmUgc3ByZWFkIFx1RDFBNCAoXHVDNjc4XHVCRDgwIFNlY3Rpb25IZWFkIFx1RDNEMFx1QUUzMCkgXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge2ZlYXR1cmVkQ29sdW1uICYmIChcbiAgICAgICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUNFN0NcdUI3RkNcIj48c2VjdGlvbiBjbGFzc05hbWU9XCJzZWN0aW9uLS1taWRcIiBzdHlsZT17e2JvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICB7LyogdjAwLjE2NCBcdTIwMTQgZXllYnJvdyBcdUI5Q0MgXHVBQzAwXHVCQ0JDXHVDNkI0IFx1RDVFNFx1QjM1NCwgdGl0bGUgXHVDNzQwIGZlYXR1cmVkIFx1Q0U3NFx1QjREQyBcdUM1NDhcdUM3M0NcdUI4NUMgXHVENzYxXHVDMjE4LiAqL31cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonYmFzZWxpbmUnLFxuICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206MjgsIGdhcDoxNiwgZmxleFdyYXA6J3dyYXAnLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3ttYXJnaW46MH19Pntob21lVGV4dC5jb2x1bW5FeWVicm93fTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo4LCBhbGlnbkl0ZW1zOidjZW50ZXInLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICB7LyogdjAwLjE2OSBcdTIwMTQgYWRtaW4gXHVDODA0XHVDNkE5IFx1QUUwMFx1QzRGMFx1QUUzMCBcdUM5QzRcdUM3ODUuIC9jb2x1bW4gXHVDNzNDXHVCODVDIFx1Qzc3NFx1QjNEOVx1RDU1OFx1QkE3MCBzZXNzaW9uU3RvcmFnZSBmbGFnIFx1Qjg1QyBcdUJBQThcdUIyRUMgXHVDNzkwXHVCM0Q5IFx1QzYyNFx1RDUwOC4gKi99XG4gICAgICAgICAgICAgICAgeyEhd2luZG93LkJHTkpfQVVUSD8uY3VycmVudFVzZXI/LigpPy5pc0FkbWluICYmIChcbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX2NvbHVtbl93cml0ZScsICcxJyk7IH0gY2F0Y2gge31cbiAgICAgICAgICAgICAgICAgICAgICBnbygnY29sdW1uJyk7XG4gICAgICAgICAgICAgICAgICAgIH19Plx1RkYwQiBcdUFFMDBcdUM0RjBcdUFFMzA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IGdvKCdjb2x1bW4nKX0+e2hvbWVUZXh0LmNvbHVtbkFjdGlvbn08L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczonMS41ZnIgMWZyJywgZ2FwOjU2fX0gY2xhc3NOYW1lPVwiY29sLWdyaWRcIj5cbiAgICAgICAgICAgICAgey8qIHYwMC4xNjQgXHUyMDE0IFx1RDUzQ1x1Q0M5OFx1QjREQyA9IG1hZ2F6aW5lIHNwcmVhZC4gXHVDRTc0XHVCNERDIFx1Qjc3Q1x1Qzc3OCBcdUM4MUNcdUFDNzAgKC5jYXJkIFx1RDNEMFx1QUUzMCksIFx1QzBBQ1x1QzlDNCBmdWxsYmxlZWQtaXNoICsgXHVEMDcwIFx1RDBDMFx1Qzc3NFx1RDJDMC4gKi99XG4gICAgICAgICAgICAgIDxhcnRpY2xlXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInfX1cbiAgICAgICAgICAgICAgICB7Li4uY2xpY2thYmxlKCgpID0+IGdvKCdjb2x1bW4nKSwgYFx1Q0U3Q1x1QjdGQzogJHtmZWF0dXJlZENvbHVtbi50aXRsZX1gKX0+XG4gICAgICAgICAgICAgICAgeyhmZWF0dXJlZENvbHVtbi5jb3ZlclVybCB8fCBmZWF0dXJlZENvbHVtbi5jb3ZlckltYWdlKSA/IChcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OjM0MCwgbWFyZ2luQm90dG9tOjI4LFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6YHVybCgke2ZlYXR1cmVkQ29sdW1uLmNvdmVyVXJsIHx8IGZlYXR1cmVkQ29sdW1uLmNvdmVySW1hZ2V9KWAsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRTaXplOidjb3ZlcicsIGJhY2tncm91bmRQb3NpdGlvbjonY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgIH19Lz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6MjYwLCBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIG1hcmdpbkJvdHRvbToyOCxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6OSwgZm9udFdlaWdodDo2MDAsIGNvbG9yOid2YXIoLS1pbmstMyknLCBsZXR0ZXJTcGFjaW5nOicwLjI4ZW0nfX0+RkVBVFVSRUQgQ09MVU1OPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEyLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBtYXJnaW5Cb3R0b206MTQsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgICAge2ZlYXR1cmVkQ29sdW1uLmNhdGVnb3J5ICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGxcIj57ZmVhdHVyZWRDb2x1bW4uY2F0ZWdvcnl9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgIHtmZWF0dXJlZENvbHVtbi5kYXRlICYmIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjExfX0+e2ZlYXR1cmVkQ29sdW1uLmRhdGV9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgIHtmZWF0dXJlZENvbHVtbi5yZWFkVGltZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMX19Plx1MDBCNyB7ZmVhdHVyZWRDb2x1bW4ucmVhZFRpbWV9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7LyogbWFnYXppbmUgXHVDQzk4XHVCN0ZDIFx1RDA3MCBcdUQ1RTRcdUI0RENcdUI3N0NcdUM3NzggKGNvbHVtbiBzdWJ0aXRsZSBcdUM3OTBcdUI5QUNcdUIzQzQgXHVDNzg4XHVDNzNDXHVCQTc0IFx1QjE3OFx1Q0Q5QykgKi99XG4gICAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LXNlcmlmKScsIGZvbnRTaXplOidjbGFtcCgyOHB4LCAzdncsIDM4cHgpJyxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6NjAwLCBsaW5lSGVpZ2h0OjEuMiwgbWFyZ2luQm90dG9tOjE0LCBjb2xvcjondmFyKC0taW5rKScsXG4gICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOictMC4wMWVtJyxcbiAgICAgICAgICAgICAgICB9fT57ZmVhdHVyZWRDb2x1bW4udGl0bGV9PC9oMj5cbiAgICAgICAgICAgICAgICB7ZmVhdHVyZWRDb2x1bW4uZXhjZXJwdCAmJiAoXG4gICAgICAgICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjE1LCBsaW5lSGVpZ2h0OjEuODUsIGNvbG9yOid2YXIoLS1pbmstMiknLCBtYXJnaW5Cb3R0b206MTgsIG1heFdpZHRoOjU4MH19PntmZWF0dXJlZENvbHVtbi5leGNlcnB0fTwvcD5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTEsIGZvbnRXZWlnaHQ6NzAwLCBsZXR0ZXJTcGFjaW5nOicwLjJlbScsIGNvbG9yOid2YXIoLS1zZWNvbmRhcnkpJ319Pntob21lVGV4dC5jb2x1bW5SZWFkTW9yZX08L2Rpdj5cbiAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICB7LyogdjAwLjE2NCBcdTIwMTQgc2lkZWJhciA9IFx1QUU2OFx1QjA1N1x1RDU1QyBcdUQxNERcdUMyQTRcdUQyQjggbGlzdC4gXHVDRTc0XHVCNERDIFx1Qjc3Q1x1Qzc3OCBYLCBcdUFENkNcdUJEODRcdUMxMjBcdUI5Q0MuICovfVxuICAgICAgICAgICAgICA8YXNpZGUgc3R5bGU9e3twYWRkaW5nVG9wOjh9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjIyZW0nLFxuICAgICAgICAgICAgICAgICAgY29sb3I6J3ZhcigtLWluay0zKScsIG1hcmdpbkJvdHRvbToxOCwgdGV4dFRyYW5zZm9ybTondXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgICB9fT57aG9tZVRleHQuY29sdW1uVGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAge3NlY29uZGFyeUNvbHVtbnMubWFwKChjLCBjaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2MuaWR9XG4gICAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ2NvbHVtbicpLCBgXHVDRTdDXHVCN0ZDOiAke2MudGl0bGV9YCl9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzonMTZweCAwJyxcbiAgICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IGNpIDwgc2Vjb25kYXJ5Q29sdW1ucy5sZW5ndGggLSAxID8gJzFweCBzb2xpZCB2YXIoLS1saW5lKScgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEwLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBtYXJnaW5Cb3R0b206NiwgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICAgICAgICAgICAge2MuY2F0ZWdvcnkgJiYgPHNwYW4gY2xhc3NOYW1lPVwicGlsbFwiIHN0eWxlPXt7Zm9udFNpemU6OSwgcGFkZGluZzonMnB4IDhweCd9fT57Yy5jYXRlZ29yeX08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgIHtjLmRhdGUgJiYgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTB9fT57Yy5kYXRlfTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjE2LCBmb250V2VpZ2h0OjYwMCwgbGluZUhlaWdodDoxLjQsIG1hcmdpbkJvdHRvbTo0fX0+e2MudGl0bGV9PC9oND5cbiAgICAgICAgICAgICAgICAgICAge2MuZXhjZXJwdCAmJiA8cCBzdHlsZT17e2ZvbnRTaXplOjEyLCBsaW5lSGVpZ2h0OjEuNiwgY29sb3I6J3ZhcigtLWluay0zKScsIG1hcmdpbjowfX0+eyhjLmV4Y2VycHR8fCcnKS5zbGljZSgwLDY1KX1cdTIwMjY8L3A+fVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAge3NlY29uZGFyeUNvbHVtbnMubGVuZ3RoID09PSAwICYmIChcbiAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6MTMsIGNvbG9yOid2YXIoLS1pbmstMyknLCBwYWRkaW5nOicxNnB4IDAnfX0+e2hvbWVUZXh0LmNvbHVtbkVtcHR5fTwvcD5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2FzaWRlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj48L0hvbWVTZWN0aW9uQm91bmRhcnk+XG4gICAgICApfVxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFx1QUMxNVx1QzVGMCBcdUM3N0NcdUM4MTUgXHUyMDE0IHYwMC4xNjQgXHVBQzAwXHVCODVDIFx1QzJBNFx1RDA2Q1x1Qjg2NCBzdHJpcCAoZmlsbSBzdHJpcCBcdUQxQTQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIHtsZWN0dXJlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUFDMTVcdUM1RjBcIj48c2VjdGlvbiBjbGFzc05hbWU9XCJzZWN0aW9uLXRpZ2h0XCIgc3R5bGU9e3tiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICB7LyogdjAwLjE2NCBcdTIwMTQgaW5saW5lIFx1RDVFNFx1QjM1NCAoM1x1QzVGNCBncmlkIFx1QzY0MCBcdUJCMzRcdUFDOEMgXHVCMkU0XHVCOTc4IFx1QkMxNVx1Qzc5MCkuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWhlYWQgc2VjdGlvbi1oZWFkLS1pbmxpbmVcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tZXllYnJvd1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPntob21lVGV4dC5sZWN0dXJlc0V5ZWJyb3d9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInNlY3Rpb24tdGl0bGVcIj57aG9tZVRleHQubGVjdHVyZXNUaXRsZX08L2gyPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gZ28oJ2xlY3R1cmVzJyl9Pntob21lVGV4dC5sZWN0dXJlc0FjdGlvbn08L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgey8qIHYwMC4xNjQgXHUyMDE0IGZpbG0gc3RyaXAgXHVBQzAwXHVCODVDIFx1QzJBNFx1RDA2Q1x1Qjg2NC4gXHVEM0VEIDMyMHB4IFx1Q0U3NFx1QjREQyArIHNjcm9sbC1zbmFwLiAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGVjdHVyZS1zdHJpcFwiIHJvbGU9XCJsaXN0XCI+XG4gICAgICAgICAgICAgIHtsZWN0dXJlcy5tYXAoKGxlY3R1cmUpID0+IChcbiAgICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2xlY3R1cmUuaWR9XG4gICAgICAgICAgICAgICAgICByb2xlPVwibGlzdGl0ZW1cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2FyZCBjYXJkLS1iYXJlXCJcbiAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfbGVjdHVyZV9pZCcsIFN0cmluZyhsZWN0dXJlLmlkKSk7IH0gY2F0Y2gge31cbiAgICAgICAgICAgICAgICAgICAgZ28oJ2xlY3R1cmVzJyk7XG4gICAgICAgICAgICAgICAgICB9LCBgXHVBQzE1XHVDNUYwOiAke2xlY3R1cmUudG9waWMgfHwgbGVjdHVyZS50aXRsZX1gKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Y3Vyc29yOidwb2ludGVyJywgZGlzcGxheTonZmxleCcsIGZsZXhEaXJlY3Rpb246J2NvbHVtbicsIHBhZGRpbmc6JzRweCA0cHggMTJweCd9fT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3ttYXJnaW5Cb3R0b206MTYsIGFsaWduU2VsZjonZmxleC1zdGFydCd9fT57aG9tZVRleHQubGVjdHVyZUJhZGdlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjAsIGZvbnRXZWlnaHQ6NjAwLCBtYXJnaW5Cb3R0b206OCwgZmxleDonMCAwIGF1dG8nfX0+e2xlY3R1cmUudG9waWMgfHwgbGVjdHVyZS50aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAge2xlY3R1cmUubm90ZSAmJiA8cCBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToxNiwgZmxleDonMSAxIGF1dG8nfX0+e3RydW5jYXRlUHJldmlldyhsZWN0dXJlLm5vdGUsIDExMCl9PC9wPn1cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHBhZGRpbmdUb3A6MTIsIGRpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIG1hcmdpblRvcDonYXV0byd9fT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZToxMiwgY29sb3I6J3ZhcigtLWluay0yKSd9fT57bGVjdHVyZS52ZW51ZSB8fCBob21lVGV4dC5lbXB0eUZhbGxiYWNrfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZToxMiwgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRXZWlnaHQ6NjAwLCBjb2xvcjondmFyKC0taW5rKSd9fT57bGVjdHVyZS5uZXh0IHx8IGhvbWVUZXh0LmVtcHR5RmFsbGJhY2t9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgey8qIFx1QUMwMFx1Qjg1QyBcdUMyQTRcdUQwNkNcdUI4NjQgXHVENzhDXHVEMkI4IFx1MjAxNCBcdUNFNzRcdUI0REMgXHUyMjY1IDNcdUFDMUMgXHVDNzdDIFx1QjU0Q1x1QjlDQyAoXHVCQ0Y0XHVEMUI1IDMgXHVDNzc0XHVDMEMxXHVDNzc0XHVDOUMwXHVCOUNDIFx1QkMyOVx1QzVCNCkuICovfVxuICAgICAgICAgICAge2xlY3R1cmVzLmxlbmd0aCA+PSAzICYmIChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6MTQsIGZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCwgbGV0dGVyU3BhY2luZzonMC4yMmVtJyxcbiAgICAgICAgICAgICAgICBjb2xvcjondmFyKC0taW5rLTMpJywgdGV4dEFsaWduOidyaWdodCcsXG4gICAgICAgICAgICAgIH19Plx1MjE5MCBcdUFDMDBcdUI4NUNcdUI4NUMgXHVDMkE0XHVEMDZDXHVCODY0IFx1MjE5MjwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVDQzQ1IENUQSBcdTIwMTQgdjAwLjE1MiBcdUIyRTRcdUFEOEMgXHVDRTc0XHVCOEU4XHVDMTQwICsgXHVDODhDXHVDNkIwIFx1QkIzNFx1RDU1QyBcdUJDMThcdUJDRjUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAgPEJvb2tDYXJvdXNlbFNlY3Rpb24gZ289e2dvfSBkYXRhVGljaz17ZGF0YVRpY2t9IHRleHQ9e2hvbWVUZXh0fS8+XG5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IEhvbWVQYWdlIH0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBV0EsTUFBTSxzQkFBc0IsQ0FBQyxFQUFFLFNBQVMsR0FBRyxNQUFNO0FBWGpEO0FBWUUsUUFBTSxDQUFDLGNBQWMsZUFBZSxJQUFJLE1BQU0sU0FBUyxJQUFJO0FBRTNELGVBQU8sa0JBQVAsZ0NBQXVCLEVBQUUsTUFBTSxNQUFNLE9BQU8sT0FBTyxTQUFTLGFBQWEsTUFBTSxPQUFPLCtDQUFZO0FBQ2xHLFNBQ0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFJLE1BQUs7QUFBQSxNQUFTLGNBQVc7QUFBQSxNQUFPLGNBQVc7QUFBQSxNQUM5QyxPQUFPO0FBQUEsUUFDTCxVQUFTO0FBQUEsUUFBUyxPQUFNO0FBQUEsUUFBRyxRQUFPO0FBQUEsUUFDbEMsWUFBVztBQUFBLFFBQ1gsU0FBUTtBQUFBLFFBQVEsWUFBVztBQUFBLFFBQVUsU0FBUTtBQUFBLE1BQy9DO0FBQUEsTUFDQSxTQUFTLENBQUMsTUFBTTtBQUFFLFlBQUksRUFBRSxXQUFXLEVBQUUsY0FBZSxTQUFRO0FBQUEsTUFBRztBQUFBO0FBQUEsSUFDL0Qsb0NBQUMsU0FBSSxPQUFPO0FBQUEsTUFDVixZQUFXO0FBQUEsTUFBYSxVQUFTO0FBQUEsTUFBSyxPQUFNO0FBQUEsTUFBUSxXQUFVO0FBQUEsTUFDOUQsVUFBUztBQUFBLE1BQVEsU0FBUTtBQUFBLE1BQWtCLFVBQVM7QUFBQSxNQUNwRCxRQUFPO0FBQUEsSUFDVCxLQUNFO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFBTyxTQUFTO0FBQUEsUUFBUyxjQUFXO0FBQUEsUUFDbkMsT0FBTztBQUFBLFVBQ0wsVUFBUztBQUFBLFVBQVksS0FBSTtBQUFBLFVBQUksT0FBTTtBQUFBLFVBQ25DLE9BQU07QUFBQSxVQUFJLFFBQU87QUFBQSxVQUFJLFVBQVM7QUFBQSxVQUM5QixZQUFXO0FBQUEsVUFBZSxRQUFPO0FBQUEsVUFBUSxRQUFPO0FBQUEsVUFDaEQsT0FBTTtBQUFBLFVBQWdCLFlBQVc7QUFBQSxRQUNuQztBQUFBO0FBQUEsTUFBRztBQUFBLElBQUMsR0FDTixvQ0FBQyxTQUFJLFdBQVUsbUJBQWtCLE9BQU8sRUFBQyxjQUFhLEdBQUUsS0FBRyxtREFBcUIsR0FDaEYsb0NBQUMsUUFBRyxPQUFPLEVBQUMsWUFBVyx1QkFBdUIsVUFBUyxJQUFJLFlBQVcsS0FBSyxjQUFhLElBQUksWUFBVyxJQUFHLEtBQUcsc0VBRTdHLEdBQ0Esb0NBQUMsT0FBRSxPQUFPLEVBQUMsVUFBUyxJQUFJLE9BQU0sZ0JBQWdCLGNBQWEsSUFBSSxZQUFXLElBQUcsS0FBRyxzS0FFaEYsR0FDQyxPQUFPLGFBQWEsYUFDbkI7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLFVBQVUsQ0FBQyxTQUFTLGlCQUFnQiw2Q0FBYyxRQUFPLEtBQUssS0FBSyxPQUFPLElBQUk7QUFBQSxRQUM5RSxVQUFVLDZDQUFjO0FBQUE7QUFBQSxJQUMxQixJQUVBLG9DQUFDLFNBQUksT0FBTyxFQUFDLFFBQU8sS0FBSyxTQUFRLFFBQVEsWUFBVyxVQUFVLE9BQU0sZ0JBQWdCLFVBQVMsR0FBRSxLQUFHLHFDQUFVLEdBRTdHLGdCQUNDLG9DQUFDLFNBQUksT0FBTztBQUFBLE1BQ1YsV0FBVTtBQUFBLE1BQUksU0FBUTtBQUFBLE1BQ3RCLFlBQVc7QUFBQSxNQUFlLFFBQU87QUFBQSxJQUNuQyxLQUNFLG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsUUFBUSxZQUFXLFlBQVksS0FBSSxJQUFJLGNBQWEsR0FBRyxVQUFTLE9BQU0sS0FDekYsb0NBQUMsVUFBSyxPQUFPLEVBQUMsWUFBVyxxQkFBcUIsVUFBUyxJQUFJLE9BQU0sY0FBYyxZQUFXLElBQUcsS0FBSSxhQUFhLElBQUssR0FDbkgsb0NBQUMsVUFBSyxPQUFPLEVBQUMsWUFBVyxvQkFBb0IsVUFBUyxJQUFJLE9BQU0sZ0JBQWdCLGVBQWMsU0FBUSxLQUFJLGFBQWEsUUFBUyxDQUNsSSxHQUNDLGFBQWEsUUFDWixvQ0FBQyxPQUFFLE9BQU8sRUFBQyxVQUFTLElBQUksT0FBTSxnQkFBZ0IsWUFBVyxLQUFLLGNBQWEsR0FBRSxLQUFJLGFBQWEsSUFBSyxHQUVwRyxhQUFhLFFBQ1osb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLEtBQUksR0FBRyxVQUFTLFFBQVEsY0FBYSxHQUFFLEtBQ2pFLE9BQU8sYUFBYSxJQUFJLEVBQUUsTUFBTSxNQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFDOUUsb0NBQUMsVUFBSyxLQUFLLEdBQUcsV0FBVSxTQUFRLE9BQU8sRUFBQyxVQUFTLEdBQUUsS0FBSSxDQUFFLENBQzFELENBQ0gsR0FFRixvQ0FBQyxZQUFPLFdBQVUsMEJBQXlCLFNBQVMsTUFBTTtBQUFFLFNBQUcsTUFBTTtBQUFHLGNBQVE7QUFBQSxJQUFHLEtBQUcsc0RBRXRGLENBQ0YsQ0FFSjtBQUFBLEVBQ0Y7QUFFSjtBQUdBLE1BQU0sNEJBQTRCLE1BQU0sVUFBVTtBQUFBLEVBQ2hELFlBQVksT0FBTztBQUFFLFVBQU0sS0FBSztBQUFHLFNBQUssUUFBUSxFQUFFLE9BQU8sS0FBSztBQUFBLEVBQUc7QUFBQSxFQUNqRSxPQUFPLHlCQUF5QixLQUFLO0FBQUUsV0FBTyxFQUFFLE9BQU8sSUFBSTtBQUFBLEVBQUc7QUFBQSxFQUM5RCxrQkFBa0IsS0FBSztBQW5GekI7QUFvRkksUUFBSTtBQUFFLGNBQVEsTUFBTSx5QkFBeUIsS0FBSyxNQUFNLFNBQVMsV0FBVyxHQUFHO0FBQUEsSUFBRyxTQUFRO0FBQUEsSUFBQztBQUMzRixRQUFJO0FBQ0YscUNBQU8sYUFBUCxtQkFBaUIsYUFBakIsbUJBQTJCLE9BQU87QUFBQSxRQUNoQyxNQUFNO0FBQUEsUUFBc0IsUUFBUTtBQUFBLFFBQU0sTUFBTTtBQUFBLFFBQ2hELFVBQVMsMkJBQUssWUFBVyxPQUFPLEdBQUc7QUFBQSxRQUNuQyxNQUFNLFdBQVcsS0FBSyxNQUFNLFNBQVMsRUFBRTtBQUFBLFFBQUksS0FBSztBQUFBLFFBQ2hELFVBQVUsU0FBUztBQUFBLFFBQVUsUUFBUSxTQUFTO0FBQUEsTUFDaEQsT0FMQSxtQkFLSSxVQUxKLDRCQUtZLE1BQU07QUFBQSxNQUFDO0FBQUEsSUFDckIsU0FBUTtBQUFBLElBQUM7QUFBQSxFQUNYO0FBQUEsRUFDQSxTQUFTO0FBQ1AsUUFBSSxLQUFLLE1BQU0sT0FBTztBQUVwQixhQUNFLG9DQUFDLGFBQVEsT0FBTyxFQUFDLFNBQVEsVUFBVSxjQUFhLHlCQUF5QixXQUFVLFNBQVEsS0FDekYsb0NBQUMsT0FBRSxXQUFVLGNBQWEsT0FBTyxFQUFDLFVBQVMsSUFBSSxlQUFjLFNBQVEsS0FBRyxXQUNuRSxLQUFLLE1BQU0sU0FBUyx1QkFBTyxpRUFDaEMsQ0FDRjtBQUFBLElBRUo7QUFDQSxXQUFPLEtBQUssTUFBTTtBQUFBLEVBQ3BCO0FBQ0Y7QUFHQSxNQUFNLDRCQUE0QixDQUFDLEVBQUUsS0FBSyxTQUFTLEdBQUcsTUFBTTtBQTlHNUQ7QUFnSEUsZUFBTyxrQkFBUCxnQ0FBdUIsRUFBRSxNQUFNLE1BQU0sT0FBTyxPQUFPLFNBQVMsYUFBYSxNQUFNLFFBQU8sMkJBQUssU0FBUSxrQ0FBUztBQUM1RyxRQUFNLE9BQU8sTUFBTSxRQUFRLElBQUksSUFBSSxJQUMvQixJQUFJLE9BQ0gsT0FBTyxJQUFJLFNBQVMsV0FBVyxJQUFJLEtBQUssTUFBTSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLE9BQU8sSUFBSSxDQUFDO0FBQ25HLFNBQ0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFJLE1BQUs7QUFBQSxNQUFTLGNBQVc7QUFBQSxNQUFPLGNBQVksR0FBRyxJQUFJLFFBQVEsY0FBSTtBQUFBLE1BQ2xFLE9BQU87QUFBQSxRQUNMLFVBQVM7QUFBQSxRQUFTLE9BQU07QUFBQSxRQUFHLFFBQU87QUFBQSxRQUNsQyxZQUFXO0FBQUEsUUFDWCxTQUFRO0FBQUEsUUFBUSxZQUFXO0FBQUEsUUFBVSxTQUFRO0FBQUEsTUFDL0M7QUFBQSxNQUNBLFNBQVMsQ0FBQyxNQUFNO0FBQUUsWUFBSSxFQUFFLFdBQVcsRUFBRSxjQUFlLFNBQVE7QUFBQSxNQUFHO0FBQUE7QUFBQSxJQUMvRCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFlBQVc7QUFBQSxNQUFhLFVBQVM7QUFBQSxNQUFLLE9BQU07QUFBQSxNQUFRLFdBQVU7QUFBQSxNQUM5RCxVQUFTO0FBQUEsTUFBUSxVQUFTO0FBQUEsTUFDMUIsUUFBTztBQUFBLElBQ1QsS0FDRTtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQU8sU0FBUztBQUFBLFFBQVMsY0FBVztBQUFBLFFBQ25DLE9BQU87QUFBQSxVQUNMLFVBQVM7QUFBQSxVQUFZLEtBQUk7QUFBQSxVQUFJLE9BQU07QUFBQSxVQUFJLFFBQU87QUFBQSxVQUM5QyxPQUFNO0FBQUEsVUFBSSxRQUFPO0FBQUEsVUFBSSxVQUFTO0FBQUEsVUFDOUIsWUFBVztBQUFBLFVBQWUsUUFBTztBQUFBLFVBQXlCLFFBQU87QUFBQSxVQUNqRSxPQUFNO0FBQUEsVUFBYyxZQUFXO0FBQUEsVUFBRyxZQUFXO0FBQUEsUUFDL0M7QUFBQTtBQUFBLE1BQUc7QUFBQSxJQUFDLEdBQ0wsSUFBSSxnQkFDSCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLE9BQU07QUFBQSxNQUFRLFFBQU87QUFBQSxNQUNyQixZQUFZLE9BQU8sSUFBSSxZQUFZO0FBQUEsTUFDbkMsY0FBYTtBQUFBLElBQ2YsR0FBRSxHQUVKLG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsaUJBQWdCLEtBQ2xDLElBQUksVUFDSCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFNBQVE7QUFBQSxNQUFnQixTQUFRO0FBQUEsTUFDaEMsWUFBVztBQUFBLE1BQW9CLFVBQVM7QUFBQSxNQUFJLFlBQVc7QUFBQSxNQUN2RCxlQUFjO0FBQUEsTUFBVSxPQUFNO0FBQUEsTUFDOUIsUUFBTztBQUFBLE1BQTJCLGNBQWE7QUFBQSxJQUNqRCxLQUFJLElBQUksTUFBTyxHQUVqQixvQ0FBQyxRQUFHLE9BQU87QUFBQSxNQUNULFlBQVc7QUFBQSxNQUFxQixVQUFTO0FBQUEsTUFBSSxZQUFXO0FBQUEsTUFDeEQsT0FBTTtBQUFBLE1BQWMsWUFBVztBQUFBLE1BQUssY0FBYTtBQUFBLElBQ25ELEtBQUksSUFBSSxRQUFRLDJCQUFRLEdBQ3ZCLElBQUksWUFDSCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFlBQVc7QUFBQSxNQUFvQixVQUFTO0FBQUEsTUFBSSxZQUFXO0FBQUEsTUFDdkQsT0FBTTtBQUFBLE1BQW9CLGVBQWM7QUFBQSxNQUFVLGNBQWE7QUFBQSxJQUNqRSxLQUFJLElBQUksUUFBUyxHQUVsQixJQUFJLFFBQ0gsb0NBQUMsT0FBRSxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsTUFBTSxPQUFNLGdCQUFnQixjQUFhLEdBQUUsS0FBSSxJQUFJLElBQUssR0FFNUYsS0FBSyxTQUFTLEtBQ2Isb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLEtBQUksR0FBRyxVQUFTLFFBQVEsY0FBYSxHQUFFLEtBQ2pFLEtBQUssSUFBSSxDQUFDLE1BQ1Qsb0NBQUMsVUFBSyxLQUFLLEdBQUcsV0FBVSxTQUFRLE9BQU8sRUFBQyxVQUFTLEdBQUUsS0FBSSxDQUFFLENBQzFELENBQ0gsR0FFRixvQ0FBQyxTQUFJLE9BQU8sRUFBQyxTQUFRLFFBQVEsS0FBSSxJQUFJLFVBQVMsUUFBUSxXQUFVLHlCQUF5QixZQUFXLEdBQUUsS0FDcEcsb0NBQUMsWUFBTyxXQUFVLGdCQUFlLFNBQVMsTUFBTTtBQUFFLFNBQUcsTUFBTTtBQUFHLGNBQVE7QUFBQSxJQUFHLEtBQUcsc0RBQVksR0FDeEYsb0NBQUMsWUFBTyxXQUFVLE9BQU0sU0FBUyxXQUFTLGNBQUUsQ0FDOUMsQ0FDRixDQUNGO0FBQUEsRUFDRjtBQUVKO0FBS0EsTUFBTSxrQkFBa0IsQ0FBQyxNQUFNLE1BQU0sUUFBUTtBQUMzQyxRQUFNLElBQUksT0FBTyxRQUFRLEVBQUUsRUFBRSxRQUFRLFFBQVEsR0FBRyxFQUFFLEtBQUs7QUFDdkQsTUFBSSxFQUFFLFVBQVUsSUFBSyxRQUFPO0FBRTVCLFFBQU0sUUFBUSxFQUFFLE1BQU0sR0FBRyxHQUFHO0FBQzVCLFFBQU0sWUFBWSxNQUFNLFlBQVksR0FBRztBQUN2QyxRQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxNQUFNLEdBQUcsU0FBUyxJQUFJO0FBQ2hFLFNBQU8sTUFBTTtBQUNmO0FBRUEsTUFBTSxvQkFBb0I7QUFBQSxFQUN4QixZQUFZO0FBQUEsRUFDWixnQkFBZ0I7QUFBQSxFQUNoQixnQkFBZ0I7QUFBQSxFQUNoQixnQkFBZ0I7QUFBQSxFQUNoQixhQUFhO0FBQUEsRUFDYixXQUFXO0FBQUEsRUFDWCxhQUFhO0FBQUEsRUFDYixXQUFXO0FBQUEsRUFDWCxjQUFjO0FBQUEsRUFDZCxZQUFZO0FBQUEsRUFDWixlQUFlO0FBQUEsRUFDZixnQkFBZ0I7QUFBQSxFQUNoQixrQkFBa0I7QUFBQSxFQUNsQixnQkFBZ0I7QUFBQSxFQUNoQixtQkFBbUI7QUFBQSxFQUNuQixpQkFBaUI7QUFBQSxFQUNqQixxQkFBcUI7QUFBQSxFQUNyQixxQkFBcUI7QUFBQSxFQUNyQix3QkFBd0I7QUFBQSxFQUN4QixtQkFBbUI7QUFBQSxFQUNuQixlQUFlO0FBQUEsRUFDZixhQUFhO0FBQUEsRUFDYixnQkFBZ0I7QUFBQSxFQUNoQixjQUFjO0FBQUEsRUFDZCxnQkFBZ0I7QUFBQSxFQUNoQixhQUFhO0FBQUEsRUFDYixpQkFBaUI7QUFBQSxFQUNqQixlQUFlO0FBQUEsRUFDZixnQkFBZ0I7QUFBQSxFQUNoQixjQUFjO0FBQUEsRUFDZCx3QkFBd0I7QUFBQSxFQUN4QixzQkFBc0I7QUFBQSxFQUN0QixtQkFBbUI7QUFBQSxFQUNuQixtQkFBbUI7QUFBQSxFQUNuQixrQkFBa0I7QUFBQSxFQUNsQixnQkFBZ0I7QUFBQSxFQUNoQixlQUFlO0FBQUEsRUFDZixlQUFlO0FBQUEsRUFDZixlQUFlO0FBQUEsRUFDZixtQkFBbUI7QUFBQSxFQUNuQixZQUFZO0FBQUEsRUFDWixhQUFhO0FBQUEsRUFDYixhQUFhO0FBQUEsRUFDYixrQkFBa0I7QUFDcEI7QUFFQSxNQUFNLGNBQWMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxtQkFBbUIsR0FBSyxNQUFNLE9BQU8sR0FBRyxhQUFhLFdBQVksR0FBRyxXQUFXLENBQUMsRUFBRztBQUlySCxNQUFNLG1CQUFtQixDQUFDLEVBQUUsSUFBSSxVQUFVLEtBQUssTUFBTTtBQUduRCxRQUFNLE9BQU8sQ0FBQyxPQUFPO0FBQ25CLFFBQUk7QUFBRSxZQUFNLElBQUksR0FBRztBQUFHLGFBQU8sTUFBTSxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUM7QUFBQSxJQUFHLFNBQVE7QUFBRSxhQUFPLENBQUM7QUFBQSxJQUFHO0FBQUEsRUFDL0U7QUFHQSxRQUFNLGVBQWUsQ0FBQyxNQUFNO0FBQzFCLFFBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUUsU0FBVSxRQUFPO0FBQzFDLFdBQU8sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFLFFBQVEsQ0FBQztBQUFBLEVBQ3RDO0FBR0EsUUFBTSxXQUFXLE1BQU0sUUFBUSxNQUFNO0FBQ25DLFVBQU0sTUFBTSxLQUFLLE1BQUc7QUFyUXhCO0FBcVEyQixnQ0FBTyxrQkFBUCxtQkFBc0IsWUFBdEI7QUFBQSxLQUFpQyxFQUNyRCxPQUFPLFlBQVk7QUFDdEIsVUFBTSxTQUFTLEtBQUssSUFBSSxJQUFJO0FBQzVCLFVBQU0sV0FBVyxJQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEtBQUssTUFBTSxFQUN0RCxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztBQUNqRixRQUFJLFNBQVMsU0FBUyxFQUFHLFFBQU87QUFFaEMsV0FBTyxJQUNKLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksTUFBTSxFQUNyRCxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksSUFBSSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUM5RSxNQUFNLEdBQUcsQ0FBQztBQUFBLEVBQ2YsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNiLFFBQU0sUUFBUSxNQUFNLFFBQVEsTUFBTTtBQUNoQyxXQUFPLEtBQUssTUFBRztBQW5SbkI7QUFtUnNCLGdDQUFPLGVBQVAsbUJBQW1CLFlBQW5CO0FBQUEsS0FBOEIsRUFDN0MsT0FBTyxZQUFZLEVBQ25CLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsSUFBSSxJQUFJLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQzlFLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEtBQUssS0FBSyxJQUFJLElBQUksS0FBUTtBQUFBLEVBQzFFLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFFYixRQUFNLGNBQWMsU0FBUyxDQUFDO0FBQzlCLFFBQU0sV0FBVyxNQUFNLENBQUM7QUFFeEIsUUFBTSxnQkFBZ0IsZUFBZSxZQUFZLFlBQzlDLElBQUksS0FBSyxZQUFZLFFBQVEsRUFBRSxRQUFRLElBQUksS0FBSyxJQUFJLElBQUk7QUFHM0QsUUFBTSxVQUFVLENBQUMsUUFBUTtBQWhTM0I7QUFpU0ksUUFBSSxDQUFDLElBQUssUUFBTztBQUNqQixTQUFJLFlBQU8sYUFBUCxtQkFBaUIsWUFBYSxRQUFPLE9BQU8sU0FBUyxZQUFZLEdBQUc7QUFFeEUsVUFBTSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ3RCLFVBQU0sTUFBTSxDQUFDLE1BQU0sT0FBTyxDQUFDLEVBQUUsU0FBUyxHQUFHLEdBQUc7QUFDNUMsVUFBTSxNQUFNLENBQUMsVUFBSSxVQUFJLFVBQUksVUFBSSxVQUFJLFVBQUksUUFBRyxFQUFFLEVBQUUsT0FBTyxDQUFDO0FBQ3BELFdBQU8sR0FBRyxFQUFFLFNBQVMsSUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztBQUFBLEVBQ25HO0FBRUEsU0FDRSxvQ0FBQyxTQUFJLFdBQVUsd0JBRWI7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUNDLFNBQVMsTUFBTTtBQUFFLFlBQUksWUFBYSxJQUFHLFVBQVU7QUFBQSxNQUFHO0FBQUEsTUFDbEQsV0FBVTtBQUFBLE1BQ1YsT0FBTyxFQUFDLFFBQVEsY0FBYyxZQUFZLFVBQVM7QUFBQSxNQUNuRCxNQUFNLGNBQWMsV0FBVztBQUFBLE1BQy9CLFVBQVUsY0FBYyxJQUFJO0FBQUEsTUFDNUIsV0FBVyxDQUFDLE1BQU07QUFBRSxZQUFJLGdCQUFnQixFQUFFLFFBQVEsV0FBVyxFQUFFLFFBQVEsTUFBTTtBQUFFLFlBQUUsZUFBZTtBQUFHLGFBQUcsVUFBVTtBQUFBLFFBQUc7QUFBQSxNQUFFO0FBQUE7QUFBQSxJQUNySCxvQ0FBQyxTQUFJLFdBQVUsd0JBQ1osZ0JBQWdCLEtBQUsseUJBQXlCLEtBQUssb0JBQ3REO0FBQUEsSUFDQyxjQUNDLDBEQUNFLG9DQUFDLFFBQUcsV0FBVSxZQUFXLE9BQU8sRUFBQyxVQUFTLElBQUksY0FBYSxHQUFHLE9BQU0sYUFBWSxLQUFJLFlBQVksU0FBUyxZQUFZLEtBQU0sR0FDM0gsb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLGdCQUFlLGlCQUFpQixZQUFXLFlBQVksVUFBUyxRQUFRLEtBQUksR0FBRSxLQUN6RyxvQ0FBQyxVQUFLLFdBQVUsZUFBYyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsSUFBRyxLQUFJLFFBQVEsWUFBWSxRQUFRLENBQUUsR0FDbkcsb0NBQUMsVUFBSyxXQUFVLFNBQVEsT0FBTyxFQUFDLFVBQVMsR0FBRSxLQUFJLFlBQVksU0FBUyxLQUFLLGFBQWMsQ0FDekYsQ0FDRixJQUVBLG9DQUFDLE9BQUUsV0FBVSxPQUFNLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxLQUFLLFFBQU8sRUFBQyxLQUM3RCxLQUFLLG1CQUFrQixLQUFDLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsa0JBQWlCLFNBQVMsQ0FBQyxNQUFNO0FBQUUsUUFBRSxnQkFBZ0I7QUFBRyxTQUFHLFVBQVU7QUFBQSxJQUFHLEtBQUksS0FBSyxnQkFBaUIsQ0FDN0o7QUFBQSxFQUVKLEdBR0E7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUNDLFNBQVMsTUFBTTtBQUFFLFlBQUksU0FBVSxJQUFHLE1BQU07QUFBQSxNQUFHO0FBQUEsTUFDM0MsV0FBVTtBQUFBLE1BQ1YsT0FBTyxFQUFDLFFBQVEsV0FBVyxZQUFZLFVBQVM7QUFBQSxNQUNoRCxNQUFNLFdBQVcsV0FBVztBQUFBLE1BQzVCLFVBQVUsV0FBVyxJQUFJO0FBQUEsTUFDekIsV0FBVyxDQUFDLE1BQU07QUFBRSxZQUFJLGFBQWEsRUFBRSxRQUFRLFdBQVcsRUFBRSxRQUFRLE1BQU07QUFBRSxZQUFFLGVBQWU7QUFBRyxhQUFHLE1BQU07QUFBQSxRQUFHO0FBQUEsTUFBRTtBQUFBO0FBQUEsSUFDOUcsb0NBQUMsU0FBSSxXQUFVLHdCQUNaLEtBQUssaUJBQ1I7QUFBQSxJQUNDLFdBQ0MsMERBQ0Usb0NBQUMsUUFBRyxXQUFVLFlBQVcsT0FBTyxFQUFDLFVBQVMsSUFBSSxjQUFhLEdBQUcsT0FBTSxhQUFZLEtBQUksU0FBUyxLQUFNLEdBQ2xHLFNBQVMsWUFDUixvQ0FBQyxPQUFFLFdBQVUsU0FBUSxPQUFPLEVBQUMsVUFBUyxJQUFJLGNBQWEsR0FBRyxXQUFVLFNBQVEsS0FBSSxTQUFTLFFBQVMsR0FFcEcsb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLGdCQUFlLGlCQUFpQixZQUFXLFlBQVksVUFBUyxRQUFRLEtBQUksR0FBRSxLQUN6RyxvQ0FBQyxVQUFLLFdBQVUsZUFBYyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsSUFBRyxLQUFJLFFBQVEsU0FBUyxRQUFRLENBQUUsR0FDaEcsb0NBQUMsVUFBSyxXQUFVLFNBQVEsT0FBTyxFQUFDLFVBQVMsR0FBRSxLQUN4QyxTQUFTLFNBQVMsb0NBQUMsVUFBSyxPQUFPLEVBQUMsYUFBWSxFQUFDLEtBQUksU0FBUyxLQUFNLEdBQ2hFLFNBQVMsUUFDWixDQUNGLENBQ0YsSUFFQSxvQ0FBQyxPQUFFLFdBQVUsT0FBTSxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxRQUFPLEVBQUMsS0FDN0QsS0FBSyxnQkFBZSxLQUFDLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsa0JBQWlCLFNBQVMsQ0FBQyxNQUFNO0FBQUUsUUFBRSxnQkFBZ0I7QUFBRyxTQUFHLE1BQU07QUFBQSxJQUFHLEtBQUksS0FBSyxhQUFjLENBQ25KO0FBQUEsRUFFSixDQUNGO0FBRUo7QUFJQSxNQUFNLHNCQUFzQixDQUFDLEVBQUUsSUFBSSxVQUFVLEtBQUssTUFBTTtBQUN0RCxRQUFNLE9BQU8sQ0FBQyxPQUFPO0FBQUUsUUFBSTtBQUFFLFlBQU0sSUFBSSxHQUFHO0FBQUcsYUFBTyxNQUFNLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUFBLElBQUcsU0FBUTtBQUFFLGFBQU8sQ0FBQztBQUFBLElBQUc7QUFBQSxFQUFFO0FBRXRHLFFBQU0sQ0FBQyxVQUFVLFdBQVcsSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUNoRCxRQUFNLFVBQVUsTUFBTTtBQUNwQixVQUFNLE1BQU0sTUFBTSxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUM7QUFDMUMsV0FBTyxpQkFBaUIsc0JBQXNCLEdBQUc7QUFDakQsV0FBTyxNQUFNLE9BQU8sb0JBQW9CLHNCQUFzQixHQUFHO0FBQUEsRUFDbkUsR0FBRyxDQUFDLENBQUM7QUFDTCxRQUFNLFFBQVEsTUFBTSxRQUFRLE1BQU07QUFDaEMsVUFBTSxNQUFNLEtBQUssTUFBRztBQXJYeEI7QUFxWDJCLGdDQUFPLGVBQVAsbUJBQW1CLFNBQW5CLDRCQUEwQixFQUFFLFFBQVEsWUFBWTtBQUFBLEtBQUU7QUFDekUsV0FBTyxJQUFJLE1BQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNO0FBdFh0QztBQXVYTSxVQUFJLEVBQUUsV0FBVyxDQUFDLEVBQUUsUUFBUyxRQUFPO0FBQ3BDLFVBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxRQUFTLFFBQU87QUFDcEMsZUFBUSxPQUFFLFVBQUYsWUFBVyxPQUFNLE9BQUUsVUFBRixZQUFXO0FBQUEsSUFDdEMsQ0FBQztBQUFBLEVBQ0gsR0FBRyxDQUFDLFVBQVUsUUFBUSxDQUFDO0FBRXZCLFFBQU0sQ0FBQyxLQUFLLE1BQU0sSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUN0QyxRQUFNLENBQUMsUUFBUSxTQUFTLElBQUksTUFBTSxTQUFTLEtBQUs7QUFFaEQsUUFBTSxVQUFVLE1BQU07QUFDcEIsUUFBSSxNQUFNLFNBQVMsS0FBSyxPQUFPLE1BQU0sT0FBUSxRQUFPLENBQUM7QUFBQSxFQUN2RCxHQUFHLENBQUMsTUFBTSxRQUFRLEdBQUcsQ0FBQztBQUV0QixRQUFNLE9BQU8sQ0FBQyxNQUFNLE1BQU0sV0FBVyxJQUFJLEtBQUssSUFBSSxNQUFNLFVBQVUsTUFBTTtBQUN4RSxRQUFNLFNBQVMsTUFBTSxPQUFPLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQzlDLFFBQU0sU0FBUyxNQUFNLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUM7QUFHOUMsUUFBTSxVQUFVLE1BQU07QUFDcEIsUUFBSSxNQUFNLFNBQVMsS0FBSyxPQUFRO0FBQ2hDLFVBQU0sSUFBSSxXQUFXLE1BQU0sT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUk7QUFDM0QsV0FBTyxNQUFNLGFBQWEsQ0FBQztBQUFBLEVBQzdCLEdBQUcsQ0FBQyxLQUFLLE1BQU0sUUFBUSxNQUFNLENBQUM7QUFFOUIsTUFBSSxNQUFNLFdBQVcsRUFBRyxRQUFPO0FBQy9CLFFBQU0sYUFBYSxNQUFNLFNBQVM7QUFJbEMsUUFBTSxpQkFBaUIsQ0FBQyxNQUFNO0FBcFpoQztBQXFaSSxVQUFNLGFBQWEsT0FBTyxFQUFFLE9BQU8sSUFBSTtBQUN2QyxVQUFNLGFBQWEsT0FBTyxFQUFFLE9BQU8sSUFBSTtBQUN2QyxVQUFNLEtBQUssRUFBRSxjQUFjLElBQUksS0FBSyxFQUFFLFdBQVcsRUFBRSxZQUFZLEtBQUksb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFDMUYsVUFBTSxnQkFBYyxrQkFBTyxzQkFBUCxtQkFBMEIsUUFBMUIsZ0NBQXFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztBQUNoRixVQUFNLFlBQVksV0FBVyxFQUFFLEVBQUUsS0FBSyxXQUFXLE9BQU8sRUFBRSxFQUFFLENBQUMsS0FBSztBQUNsRSxVQUFNLFlBQVksYUFBYSxFQUFFLFFBQVE7QUFDekMsV0FDRSxvQ0FBQyxTQUFJLFdBQVUsWUFBVyxPQUFPO0FBQUEsTUFDL0IsU0FBUTtBQUFBLE1BQVEscUJBQW9CO0FBQUEsTUFBVyxLQUFJO0FBQUEsTUFBSSxZQUFXO0FBQUEsSUFDcEUsS0FDRSxvQ0FBQyxhQUNDLG9DQUFDLFNBQUksV0FBVSxxQkFBbUIsS0FBSyxtQkFBa0IsVUFBSSxFQUFHLEdBQ2hFLG9DQUFDLFFBQUcsT0FBTztBQUFBLE1BQ1QsWUFBVztBQUFBLE1BQXFCLFVBQVM7QUFBQSxNQUN6QyxZQUFXO0FBQUEsTUFBSyxZQUFXO0FBQUEsTUFBSyxjQUFjLEVBQUUsV0FBVyxJQUFJO0FBQUEsSUFDakUsS0FBRyxVQUNDLEVBQUUsT0FBTSxRQUNaLEdBRUMsRUFBRSxZQUNELG9DQUFDLE9BQUUsT0FBTztBQUFBLE1BQ1IsWUFBVztBQUFBLE1BQXFCLFVBQVM7QUFBQSxNQUFJLFdBQVU7QUFBQSxNQUN2RCxPQUFNO0FBQUEsTUFBZ0IsY0FBYTtBQUFBLE1BQUksWUFBVztBQUFBLElBQ3BELEtBQ0csRUFBRSxRQUNMLEdBRUQsYUFDQyxvQ0FBQyxPQUFFLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxNQUFNLE9BQU0sZ0JBQWdCLGNBQWEsSUFBSSxZQUFXLFlBQVksVUFBUyxJQUFHLEtBQ2hILFNBQ0gsSUFFQSxjQUFjLGVBQ2Qsb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLEtBQUksSUFBSSxjQUFhLElBQUksWUFBVyxXQUFVLEtBQ3hFLGNBQ0Msb0NBQUMsYUFDQyxvQ0FBQyxTQUFJLFdBQVUsUUFBTyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxlQUFjLFVBQVUsT0FBTSxlQUFjLEtBQUksS0FBSyxXQUFZLEdBQzVILG9DQUFDLFNBQUksV0FBVSxZQUFXLE9BQU8sRUFBQyxVQUFTLElBQUksV0FBVSxHQUFHLE9BQU0sY0FBYyxZQUFXLElBQUcsS0FBSSxPQUFPLEVBQUUsT0FBTyxFQUFFLGVBQWUsR0FBRSxRQUFDLENBQ3hJLEdBRUQsY0FBYyxjQUFjLG9DQUFDLFNBQUksT0FBTyxFQUFDLE9BQU0sR0FBRyxZQUFXLGlCQUFpQixXQUFVLFVBQVMsR0FBRSxHQUNuRyxjQUNDLG9DQUFDLGFBQ0Msb0NBQUMsU0FBSSxXQUFVLFFBQU8sT0FBTyxFQUFDLFVBQVMsSUFBSSxZQUFXLEtBQUssZUFBYyxVQUFVLE9BQU0sZUFBYyxLQUFJLEtBQUssV0FBWSxHQUM1SCxvQ0FBQyxTQUFJLFdBQVUsWUFBVyxPQUFPLEVBQUMsVUFBUyxJQUFJLFdBQVUsR0FBRyxPQUFNLGNBQWMsWUFBVyxJQUFHLEtBQUksT0FBTyxFQUFFLE9BQU8sRUFBRSxlQUFlLEdBQUUsUUFBQyxDQUN4SSxDQUVKLEdBRUYsb0NBQUMsWUFBTyxXQUFVLGdCQUFlLFNBQVMsTUFBTSxHQUFHLE1BQU0sS0FBSSxLQUFLLFVBQVcsQ0FDL0UsR0FDQSxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLGFBQVk7QUFBQSxNQUFPLFVBQVM7QUFBQSxNQUFLLFFBQU87QUFBQSxNQUN4QyxZQUFXO0FBQUEsTUFBYSxRQUFPO0FBQUEsTUFDL0IsU0FBUTtBQUFBLE1BQVEsWUFBVztBQUFBLE1BQVUsVUFBUztBQUFBLElBQ2hELEtBQ0csRUFBRSxlQUNEO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFBSSxLQUFLLEVBQUU7QUFBQSxRQUFjLEtBQUssR0FBRyxFQUFFLEtBQUs7QUFBQSxRQUN2QyxPQUFPLEVBQUMsT0FBTSxRQUFRLFFBQU8sUUFBUSxXQUFVLFNBQVMsU0FBUSxRQUFPO0FBQUE7QUFBQSxJQUFFLElBRTNFLG9DQUFDLFNBQUksT0FBTyxFQUFDLFdBQVUsVUFBVSxTQUFRLFNBQVEsS0FDL0Msb0NBQUMsU0FBSSxPQUFPLEVBQUMsWUFBVyxxQkFBcUIsVUFBUyxJQUFJLE9BQU0sY0FBYyxjQUFhLElBQUksWUFBVyxJQUFHLEtBQUksRUFBRSxLQUFNLEdBQ3pILG9DQUFDLFNBQUksT0FBTyxFQUFDLFlBQVcsb0JBQW9CLFVBQVMsR0FBRyxZQUFXLEtBQUssT0FBTSxnQkFBZ0IsZUFBYyxRQUFPLEtBQUksRUFBRSxVQUFVLDRCQUFPLEtBQUUsS0FBSyxnQkFBaUIsQ0FDcEssQ0FFSixDQUNGO0FBQUEsRUFFSjtBQUVBLFNBQ0Usb0NBQUMsdUJBQW9CLE9BQU0sZ0JBQVEsb0NBQUMsYUFBUSxXQUFVLDZCQUNwRCxvQ0FBQyxTQUFJLFdBQVUsZUFDYjtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQ0MsY0FBYyxNQUFNLFVBQVUsSUFBSTtBQUFBLE1BQ2xDLGNBQWMsTUFBTSxVQUFVLEtBQUs7QUFBQSxNQUNuQyxPQUFPLEVBQUMsVUFBUyxXQUFVO0FBQUE7QUFBQSxJQUczQixvQ0FBQyxTQUFJLE9BQU8sRUFBQyxVQUFTLFdBQVUsS0FDN0IsTUFBTSxJQUFJLENBQUMsR0FBRyxNQUFNO0FBQ25CLFlBQU0sU0FBUyxNQUFNO0FBQ3JCLGFBQ0U7QUFBQSxRQUFDO0FBQUE7QUFBQSxVQUFJLEtBQUssRUFBRSxNQUFNO0FBQUEsVUFDaEIsZUFBYSxTQUFTLFNBQVk7QUFBQSxVQUNsQyxPQUFPO0FBQUEsWUFDTCxVQUFVLE1BQU0sSUFBSSxhQUFhO0FBQUEsWUFDakMsS0FBSztBQUFBLFlBQUcsTUFBTTtBQUFBLFlBQUcsT0FBTztBQUFBLFlBQ3hCLFNBQVMsU0FBUyxJQUFJO0FBQUEsWUFDdEIsV0FBVyxTQUNQLGtCQUNDLElBQUksTUFBTSxzQkFBc0I7QUFBQSxZQUNyQyxZQUFZO0FBQUEsWUFDWixlQUFlLFNBQVMsU0FBUztBQUFBLFVBQ25DO0FBQUE7QUFBQSxRQUNDLGVBQWUsQ0FBQztBQUFBLE1BQ25CO0FBQUEsSUFFSixDQUFDLENBQ0g7QUFBQSxJQUVDLGNBQ0MsMERBQ0U7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUFPLE1BQUs7QUFBQSxRQUFTLGNBQVc7QUFBQSxRQUFPLFNBQVM7QUFBQSxRQUMvQyxPQUFPO0FBQUEsVUFDTCxVQUFTO0FBQUEsVUFBWSxNQUFLO0FBQUEsVUFBSSxLQUFJO0FBQUEsVUFBTyxXQUFVO0FBQUEsVUFDbkQsT0FBTTtBQUFBLFVBQUksUUFBTztBQUFBLFVBQUksY0FBYTtBQUFBLFVBQU8sUUFBTztBQUFBLFVBQ2hELFlBQVc7QUFBQSxVQUFhLE9BQU07QUFBQSxVQUFjLFFBQU87QUFBQSxVQUNuRCxTQUFRO0FBQUEsVUFBUSxZQUFXO0FBQUEsVUFBVSxVQUFTO0FBQUEsVUFBSSxZQUFXO0FBQUEsVUFBSyxZQUFXO0FBQUEsUUFDL0U7QUFBQTtBQUFBLE1BQUc7QUFBQSxJQUFDLEdBQ047QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUFPLE1BQUs7QUFBQSxRQUFTLGNBQVc7QUFBQSxRQUFPLFNBQVM7QUFBQSxRQUMvQyxPQUFPO0FBQUEsVUFDTCxVQUFTO0FBQUEsVUFBWSxPQUFNO0FBQUEsVUFBSSxLQUFJO0FBQUEsVUFBTyxXQUFVO0FBQUEsVUFDcEQsT0FBTTtBQUFBLFVBQUksUUFBTztBQUFBLFVBQUksY0FBYTtBQUFBLFVBQU8sUUFBTztBQUFBLFVBQ2hELFlBQVc7QUFBQSxVQUFhLE9BQU07QUFBQSxVQUFjLFFBQU87QUFBQSxVQUNuRCxTQUFRO0FBQUEsVUFBUSxZQUFXO0FBQUEsVUFBVSxVQUFTO0FBQUEsVUFBSSxZQUFXO0FBQUEsVUFBSyxZQUFXO0FBQUEsUUFDL0U7QUFBQTtBQUFBLE1BQUc7QUFBQSxJQUFDLENBQ1I7QUFBQSxFQUVKLEdBRUMsY0FDQyxvQ0FBQyxTQUFJLE9BQU8sRUFBQyxTQUFRLFFBQVEsZ0JBQWUsVUFBVSxLQUFJLEdBQUcsV0FBVSxHQUFFLEtBQ3RFLE1BQU0sSUFBSSxDQUFDLEdBQUcsTUFDYjtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQU8sS0FBSyxFQUFFLE1BQU07QUFBQSxNQUFHLE1BQUs7QUFBQSxNQUFTLGNBQVksR0FBRyxJQUFFLENBQUM7QUFBQSxNQUN0RCxTQUFTLE1BQU0sT0FBTyxDQUFDO0FBQUEsTUFDdkIsT0FBTztBQUFBLFFBQ0wsT0FBTyxNQUFNLE1BQU0sS0FBSztBQUFBLFFBQUcsUUFBUTtBQUFBLFFBQUcsU0FBUztBQUFBLFFBQy9DLGNBQWM7QUFBQSxRQUFHLFFBQVE7QUFBQSxRQUFRLFFBQVE7QUFBQSxRQUN6QyxZQUFZLE1BQU0sTUFBTSxnQkFBZ0I7QUFBQSxRQUN4QyxZQUFZO0FBQUEsTUFDZDtBQUFBO0FBQUEsRUFBRSxDQUNMLENBQ0gsQ0FFSixDQUNGLENBQVU7QUFFZDtBQUVBLE1BQU0sV0FBVyxDQUFDLEVBQUUsR0FBRyxNQUFNO0FBamlCN0I7QUFraUJFLFFBQU0sQ0FBQyxTQUFTLFVBQVUsSUFBSSxNQUFNLFNBQVMsS0FBSztBQUNsRCxRQUFNLENBQUMsUUFBUSxTQUFTLElBQUksTUFBTSxTQUFTLENBQUM7QUFDNUMsUUFBTSxDQUFDLFVBQVUsV0FBVyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBR2hELFFBQU0sVUFBVSxNQUFNO0FBQ3BCLFVBQU0sTUFBTSxNQUFNLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQztBQUN4QyxXQUFPLGlCQUFpQiw2QkFBNkIsR0FBRztBQUN4RCxXQUFPLE1BQU0sT0FBTyxvQkFBb0IsNkJBQTZCLEdBQUc7QUFBQSxFQUMxRSxHQUFHLENBQUMsQ0FBQztBQUlMLFFBQU0sVUFBVSxNQUFNO0FBQ3BCLFVBQU0sT0FBTyxNQUFNLFlBQVksQ0FBQyxNQUFNLElBQUksQ0FBQztBQUMzQyxVQUFNLE9BQU8sQ0FBQyx3QkFBd0Isc0JBQXNCLHlCQUF5QixvQkFBb0I7QUFDekcsU0FBSyxRQUFRLENBQUMsTUFBTSxPQUFPLGlCQUFpQixHQUFHLElBQUksQ0FBQztBQUNwRCxXQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTSxPQUFPLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUFBLEVBQ3RFLEdBQUcsQ0FBQyxDQUFDO0FBRUwsUUFBTSxLQUFLLE1BQU0sUUFBUSxNQUFHO0FBdGpCOUIsUUFBQUEsS0FBQUM7QUFzakJrQyxhQUFBQSxPQUFBRCxNQUFBLE9BQU8sc0JBQVAsZ0JBQUFBLElBQTBCLFFBQTFCLGdCQUFBQyxJQUFBLEtBQUFELFNBQXFDLENBQUM7QUFBQSxLQUFJLENBQUMsTUFBTSxDQUFDO0FBQ2xGLFFBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUN6QixRQUFNLFdBQVcsTUFBTSxRQUFRLE1BQU0sWUFBWSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFFMUQsUUFBTSxDQUFDLFVBQVUsV0FBVyxJQUFJLE1BQU0sU0FBUyxNQUFNO0FBQ25ELFFBQUk7QUFBRSxhQUFPLENBQUMsRUFBRSxPQUFPLGNBQWMsT0FBTyxXQUFXLG9CQUFvQixFQUFFO0FBQUEsSUFBVSxTQUFRO0FBQUUsYUFBTztBQUFBLElBQU87QUFBQSxFQUNqSCxDQUFDO0FBQ0QsUUFBTSxVQUFVLE1BQU07QUFDcEIsUUFBSTtBQUNGLFlBQU0sS0FBSyxPQUFPLFdBQVcsb0JBQW9CO0FBQ2pELFlBQU0sVUFBVSxDQUFDLE1BQU0sWUFBWSxFQUFFLE9BQU87QUFDNUMsVUFBSSxHQUFHLGlCQUFrQixJQUFHLGlCQUFpQixVQUFVLE9BQU87QUFBQSxlQUNyRCxHQUFHLFlBQWEsSUFBRyxZQUFZLE9BQU87QUFDL0MsYUFBTyxNQUFNO0FBQ1gsWUFBSSxHQUFHLG9CQUFxQixJQUFHLG9CQUFvQixVQUFVLE9BQU87QUFBQSxpQkFDM0QsR0FBRyxlQUFnQixJQUFHLGVBQWUsT0FBTztBQUFBLE1BQ3ZEO0FBQUEsSUFDRixTQUFRO0FBQUEsSUFBQztBQUFBLEVBQ1gsR0FBRyxDQUFDLENBQUM7QUFDTCxRQUFNLFlBQVksTUFBTTtBQUFBLElBQ3RCLE1BQUc7QUExa0JQLFVBQUFBO0FBMGtCVyxlQUFBQSxNQUFBLE9BQU8sb0JBQVAsZ0JBQUFBLElBQUEsYUFBeUIsV0FBVyxXQUFXLGVBQWMsT0FBTztBQUFBO0FBQUEsSUFDM0UsQ0FBQyxRQUFRLFFBQVE7QUFBQSxFQUNuQjtBQUNBLFFBQU0sa0JBQWtCLE1BQU0sUUFBUSxHQUFHLGVBQWUsSUFBSSxHQUFHLGdCQUFnQixPQUFPLE9BQU8sSUFBSSxDQUFDO0FBQ2xHLFFBQU0sQ0FBQyxXQUFXLFlBQVksSUFBSSxNQUFNLFNBQVMsSUFBSTtBQUlyRCxRQUFNLElBQUksT0FBTyxjQUFjO0FBQUEsSUFDN0IsS0FBSyxDQUFDLE9BQU87QUFBRSxVQUFJO0FBQUUsY0FBTSxJQUFJLEdBQUc7QUFBRyxlQUFPLE1BQU0sUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDO0FBQUEsTUFBRyxTQUFRO0FBQUUsZUFBTyxDQUFDO0FBQUEsTUFBRztBQUFBLElBQUU7QUFBQSxJQUM5RixNQUFNLENBQUMsSUFBSSxPQUFPO0FBQUUsVUFBSTtBQUFFLGNBQU0sSUFBSSxHQUFHO0FBQUcsZUFBTyxNQUFNLFNBQVksS0FBSztBQUFBLE1BQUcsU0FBUTtBQUFFLGVBQU87QUFBQSxNQUFJO0FBQUEsSUFBRTtBQUFBLEVBQ3BHO0FBRUEsUUFBTSxnQkFBZ0IsQ0FBQyxRQUFRO0FBQzdCLFFBQUksQ0FBQyxJQUFLLFFBQU87QUFDakIsVUFBTSxJQUFJLEtBQUssTUFBTSxHQUFHO0FBQ3hCLFdBQU8sQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQjtBQUNBLFFBQU0sZ0JBQWdCLE1BQU0sUUFBUSxNQUFNLEVBQUUsSUFBSSxNQUFHO0FBNWxCckQsUUFBQUEsS0FBQUM7QUE0bEJ3RCxZQUFBQSxPQUFBRCxNQUFBLE9BQU8saUJBQVAsZ0JBQUFBLElBQXFCLGVBQXJCLGdCQUFBQyxJQUFBLEtBQUFEO0FBQUEsR0FBbUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUN0RyxRQUFNLGlCQUFpQixjQUFjLENBQUM7QUFDdEMsUUFBTSxtQkFBbUIsY0FBYyxNQUFNLEdBQUcsQ0FBQztBQUNqRCxRQUFNLGNBQWMsTUFBTSxRQUFRLE1BQU0sRUFBRSxJQUFJLE1BQUc7QUEvbEJuRCxRQUFBQSxLQUFBQztBQStsQnNELFlBQUFBLE9BQUFELE1BQUEsT0FBTyxtQkFBUCxnQkFBQUEsSUFBdUIsY0FBdkIsZ0JBQUFDLElBQUEsS0FBQUQ7QUFBQSxHQUFvQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDakgsUUFBTSxRQUFRLE1BQU0sUUFBUSxNQUFNLEVBQUUsSUFBSSxNQUFHO0FBaG1CN0MsUUFBQUEsS0FBQUM7QUFnbUJnRCxZQUFBQSxPQUFBRCxNQUFBLE9BQU8sZUFBUCxnQkFBQUEsSUFBbUIsWUFBbkIsZ0JBQUFDLElBQUEsS0FBQUQ7QUFBQSxHQUE4QixFQUFFLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ25JLFFBQU0sV0FBVyxNQUFNLFFBQVEsTUFBTSxFQUFFLElBQUksTUFBRztBQWptQmhELFFBQUFBLEtBQUFDO0FBaW1CbUQsWUFBQUEsT0FBQUQsTUFBQSxPQUFPLGtCQUFQLGdCQUFBQSxJQUFzQixZQUF0QixnQkFBQUMsSUFBQSxLQUFBRDtBQUFBLEdBQWlDLEVBQUUsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFHekksUUFBTSxZQUFZLE1BQU0sUUFBUSxLQUFLLEtBQUssS0FBSyxLQUFLLE1BQU0sV0FBVyxJQUFJLEtBQUssUUFBUTtBQUFBLElBQ3BGLEVBQUUsT0FBTyxzQkFBUyxLQUFLLGdEQUFlLGVBQWUsZUFBUTtBQUFBLElBQzdELEVBQUUsT0FBTyxnQkFBVSxLQUFLLHNEQUFjLGVBQWUsc0JBQU87QUFBQSxJQUM1RCxFQUFFLE9BQU8sNEJBQVEsS0FBSyxnREFBZSxlQUFlLHNCQUFPO0FBQUEsRUFDN0Q7QUFDQSxRQUFNLFFBQVE7QUFBQSxJQUNaLEVBQUUsR0FBRyxVQUFVLENBQUMsRUFBRSxPQUFPLEdBQUcsVUFBVSxDQUFDLEVBQUUsaUJBQWlCLGdCQUFpRCxHQUFHLFVBQVUsQ0FBQyxFQUFFLElBQUk7QUFBQSxJQUMvSCxFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUUsT0FBTyxHQUFHLE1BQU0sU0FBUyxJQUFJLEdBQUcsTUFBTSxNQUFNLFdBQU8sVUFBVSxDQUFDLEVBQUUsaUJBQWlCLHVCQUFhLEdBQUcsVUFBVSxDQUFDLEVBQUUsSUFBSTtBQUFBLElBQ3BJLEVBQUUsR0FBRyxVQUFVLENBQUMsRUFBRSxPQUFPLEdBQUcsWUFBWSxTQUFTLElBQUksR0FBRyxZQUFZLE1BQU0sTUFBTyxVQUFVLENBQUMsRUFBRSxpQkFBaUIsdUJBQVMsR0FBRyxVQUFVLENBQUMsRUFBRSxJQUFJO0FBQUEsRUFDOUk7QUFFQSxRQUFNLFlBQVksQ0FBQyxTQUFTLFdBQVc7QUFBQSxJQUNyQyxNQUFLO0FBQUEsSUFBVSxVQUFTO0FBQUEsSUFBRyxjQUFhO0FBQUEsSUFBTztBQUFBLElBQy9DLFdBQVUsQ0FBQyxNQUFNO0FBQUUsVUFBSSxFQUFFLFFBQU0sV0FBUyxFQUFFLFFBQU0sS0FBSztBQUFFLFVBQUUsZUFBZTtBQUFHLGdCQUFRO0FBQUEsTUFBRztBQUFBLElBQUU7QUFBQSxJQUN4RixPQUFNLEVBQUMsUUFBTyxVQUFTO0FBQUEsRUFDekI7QUFFQSxTQUNFLG9DQUFDLFNBQUksV0FBVSxlQUNaLFdBQVcsb0NBQUMsdUJBQW9CLFNBQVMsTUFBTSxXQUFXLEtBQUssR0FBRyxJQUFPLEdBQ3pFLGFBQWEsb0NBQUMsNkJBQTBCLEtBQUssV0FBVyxTQUFTLE1BQU0sYUFBYSxJQUFJLEdBQUcsSUFBTyxHQUtuRyxvQ0FBQyx1QkFBb0IsT0FBTSx3QkFBTSxvQ0FBQyxhQUFRLFdBQVUsYUFBWSxPQUFPO0FBQUEsSUFDckUsVUFBUztBQUFBLElBQVksVUFBUztBQUFBLElBQzlCLFlBQVc7QUFBQSxJQUFhLGNBQWE7QUFBQSxJQUNyQyxTQUFRO0FBQUEsRUFDVixLQUNFLG9DQUFDLFNBQUksV0FBVSxlQUNiLG9DQUFDLFNBQUksV0FBVSw0QkFBMkIsT0FBTztBQUFBLElBQy9DLFNBQVE7QUFBQSxJQUFRLHFCQUFvQjtBQUFBLElBQWEsS0FBSTtBQUFBLElBQUksWUFBVztBQUFBLEVBQ3RFLEtBRUUsb0NBQUMsU0FBSSxPQUFPLEVBQUMsV0FBVyxVQUFVLE1BQU0sYUFBYSxPQUFNLEtBQ3pELG9DQUFDLFNBQUksV0FBVSxtQkFBa0IsT0FBTztBQUFBLElBQ3RDLFVBQVUsVUFBVSxRQUFRO0FBQUEsSUFDNUIsWUFBWSxVQUFVLFFBQVE7QUFBQSxJQUM5QixlQUFlLEdBQUcsVUFBVSxRQUFRLGFBQWE7QUFBQSxJQUNqRCxPQUFPLE9BQU8sVUFBVSxRQUFRLEtBQUs7QUFBQSxJQUNyQyxlQUFlLFVBQVUsUUFBUSxpQkFBaUI7QUFBQSxFQUNwRCxLQUNFLG9DQUFDLGNBQU0sS0FBSyxXQUFXLGtFQUFpQixDQUMxQyxHQUNBLG9DQUFDLFFBQUcsT0FBTztBQUFBLElBQ1QsWUFBVztBQUFBLElBQ1gsVUFBVSxvQkFBb0IsVUFBVSxNQUFNLFFBQVE7QUFBQSxJQUN0RCxZQUFZLFVBQVUsTUFBTTtBQUFBLElBQzVCLFlBQVksVUFBVSxNQUFNO0FBQUEsSUFDNUIsZUFBZSxHQUFHLFVBQVUsTUFBTSxhQUFhO0FBQUEsSUFDL0MsY0FBYTtBQUFBLElBQ2IsT0FBTSxPQUFPLFVBQVUsTUFBTSxLQUFLO0FBQUEsRUFDcEMsS0FDRyxLQUFLLFVBQVUsc0JBQU0sb0NBQUMsVUFBRSxHQUN6QixvQ0FBQyxVQUFLLE9BQU8sRUFBQyxPQUFNLE9BQU8sVUFBVSxNQUFNLFdBQVcsSUFBRyxLQUFJLEtBQUssVUFBVSwyQkFBUSxHQUFPLG9DQUFDLFVBQUUsR0FDN0YsS0FBSyxVQUFVLGlDQUNsQixHQUNBLG9DQUFDLE9BQUUsV0FBVSxrQkFBaUIsT0FBTztBQUFBLElBQ25DLFVBQVUsVUFBVSxTQUFTO0FBQUEsSUFDN0IsWUFBWSxVQUFVLFNBQVM7QUFBQSxJQUMvQixPQUFPLE9BQU8sVUFBVSxTQUFTLEtBQUs7QUFBQSxJQUN0QyxVQUFVLFVBQVUsU0FBUztBQUFBLElBQzdCLGNBQWE7QUFBQSxJQUNiLFlBQVksVUFBVSxTQUFTO0FBQUEsSUFDL0IsWUFBWSxVQUFVLE1BQU0sY0FBYyxXQUFXLFNBQVM7QUFBQSxJQUM5RCxhQUFhLFVBQVUsTUFBTSxjQUFjLFdBQVcsU0FBUztBQUFBLEVBQ2pFLEtBQ0csS0FBSyxZQUFZLHFYQUNwQixHQUNBLG9DQUFDLFNBQUksT0FBTztBQUFBLElBQ1YsU0FBUTtBQUFBLElBQVEsS0FBSTtBQUFBLElBQUksVUFBUztBQUFBLElBQVEsY0FBYTtBQUFBLElBQ3RELGdCQUFnQixVQUFVLE1BQU0sY0FBYyxXQUFXLFdBQVksVUFBVSxNQUFNLGNBQWMsVUFBVSxhQUFhO0FBQUEsSUFDMUgsWUFBWSxVQUFVLElBQUk7QUFBQSxFQUM1QixLQUVFO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFBTyxXQUFVO0FBQUEsTUFBZSxTQUFTLE1BQU0sR0FBRyxXQUFXO0FBQUEsTUFDNUQsT0FBTyxFQUFDLFlBQVksVUFBVSxJQUFJLFdBQVU7QUFBQTtBQUFBLElBQzNDLEtBQUssY0FBYztBQUFBLEVBQ3RCLEdBQ0E7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFPLFdBQVU7QUFBQSxNQUFNLFNBQVMsTUFBTSxHQUFHLE1BQU07QUFBQSxNQUM5QyxPQUFPLEVBQUMsWUFBWSxVQUFVLElBQUksV0FBVTtBQUFBO0FBQUEsSUFDM0MsS0FBSyxnQkFBZ0I7QUFBQSxFQUN4QixDQUNGLEdBQ0Esb0NBQUMsU0FBSSxXQUFVLGNBQWEsT0FBTztBQUFBLElBQ2pDLFNBQVE7QUFBQSxJQUFRLHFCQUFvQjtBQUFBLElBQWlCLEtBQUk7QUFBQSxJQUN6RCxZQUFXO0FBQUEsSUFBSSxXQUFVO0FBQUEsRUFDM0IsS0FDRyxNQUFNLElBQUksQ0FBQyxTQUNWLG9DQUFDLFNBQUksS0FBSyxLQUFLLEtBQ2Isb0NBQUMsU0FBSSxPQUFPO0FBQUEsSUFDVixZQUFXO0FBQUEsSUFDWCxVQUFVLFVBQVUsTUFBTSxNQUFNO0FBQUEsSUFDaEMsWUFBWSxVQUFVLE1BQU0sTUFBTTtBQUFBLElBQ2xDLE9BQU8sT0FBTyxVQUFVLE1BQU0sTUFBTSxLQUFLO0FBQUEsSUFDekMsY0FBYTtBQUFBLEVBQ2YsS0FBSSxLQUFLLENBQUUsR0FDWCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxJQUNWLFlBQVc7QUFBQSxJQUNYLFVBQVUsVUFBVSxNQUFNLE1BQU07QUFBQSxJQUNoQyxZQUFZLFVBQVUsTUFBTSxNQUFNO0FBQUEsSUFDbEMsZUFBZSxHQUFHLFVBQVUsTUFBTSxNQUFNLGFBQWE7QUFBQSxJQUNyRCxPQUFPLE9BQU8sVUFBVSxNQUFNLE1BQU0sS0FBSztBQUFBLElBQ3pDLGVBQWUsVUFBVSxNQUFNLE1BQU0saUJBQWlCO0FBQUEsSUFDdEQsY0FBYTtBQUFBLEVBQ2YsS0FBSSxLQUFLLENBQUUsR0FDWCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxJQUNWLFVBQVUsVUFBVSxNQUFNLElBQUk7QUFBQSxJQUM5QixPQUFPLE9BQU8sVUFBVSxNQUFNLElBQUksS0FBSztBQUFBLEVBQ3pDLEtBQUksS0FBSyxDQUFFLENBQ2IsQ0FDRCxDQUNILENBQ0YsR0FJQSxvQ0FBQyxvQkFBaUIsSUFBUSxVQUFvQixNQUFNLFVBQVMsQ0FDL0QsQ0FDRixDQUNGLENBRUEsR0FHQyxnQkFBZ0IsU0FBUyxLQUN4QixvQ0FBQyx1QkFBb0IsT0FBTSwyQ0FBVSxvQ0FBQyxhQUFRLFdBQVUsMkJBQTBCLE9BQU8sRUFBQyxZQUFXLGVBQWUsY0FBYSx3QkFBdUIsS0FDdEosb0NBQUMsU0FBSSxXQUFVLGdCQUNYLE1BQU07QUFydUJwQixRQUFBQSxLQUFBQyxLQUFBQyxLQUFBO0FBdXVCYyxVQUFNLFFBQU1ELE9BQUFELE1BQUEsT0FBTyxzQkFBUCxnQkFBQUEsSUFBMEIsUUFBMUIsZ0JBQUFDLElBQUEsS0FBQUQsU0FBcUMsQ0FBQyxHQUFHLDBCQUEwQixDQUFDO0FBQ2hGLFVBQU0sS0FBSyxTQUFTLGNBQWMsR0FBRyxXQUFXLGtCQUFrQjtBQUNsRSxVQUFNLE1BQUssTUFBQUUsTUFBQSxTQUFTLG1CQUFULE9BQUFBLE1BQTJCLEdBQUcsZ0JBQTlCLFlBQTZDLGtCQUFrQjtBQUMxRSxVQUFNLE1BQUssb0JBQVMsbUJBQVQsWUFBMkIsR0FBRyxnQkFBOUIsWUFBNkMsa0JBQWtCO0FBQzFFLFVBQU0sTUFBSyxvQkFBUyxtQkFBVCxZQUEyQixHQUFHLGdCQUE5QixZQUE2QyxrQkFBa0I7QUFDMUUsVUFBTSxLQUFLLFNBQVMsZUFBZSxHQUFHLFlBQVksa0JBQWtCO0FBQ3BFLFdBQ0U7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLFNBQVM7QUFBQSxRQUNULE9BQU8sMERBQUcsSUFBRyxvQ0FBQyxVQUFLLFdBQVUsWUFBVSxFQUFHLEdBQVEsRUFBRztBQUFBLFFBQ3JELFVBQVU7QUFBQSxRQUNWLFFBQVEsb0NBQUMsWUFBTyxNQUFLLFVBQVMsV0FBVSxhQUFZLFNBQVMsTUFBTSxHQUFHLE1BQU0sS0FBSSxTQUFTLFNBQVU7QUFBQTtBQUFBLElBQ3JHO0FBQUEsRUFFSixHQUFHLEdBRUgsb0NBQUMsU0FBSSxXQUFXLGdCQUFnQixVQUFVLElBQUksd0JBQXdCLGlCQUNuRSxnQkFBZ0IsSUFBSSxDQUFDLEdBQUcsT0FBTztBQUM5QixVQUFNLE9BQU8sTUFBTSxRQUFRLEVBQUUsSUFBSSxJQUFJLEVBQUUsT0FBUSxPQUFPLEVBQUUsU0FBUyxXQUFXLEVBQUUsS0FBSyxNQUFNLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sT0FBTyxJQUFJLENBQUM7QUFFekksVUFBTSxZQUFZLGdCQUFnQixVQUFVLEtBQUssT0FBTztBQUN4RCxXQUNFO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFBUSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQUEsUUFDdEIsV0FBVTtBQUFBLFFBQ1QsR0FBRyxVQUFVLE1BQU0sYUFBYSxDQUFDLEdBQUcsR0FBRyxFQUFFLFFBQVEsY0FBSSw0QkFBUTtBQUFBLFFBQzlELE9BQU8sRUFBQyxRQUFPLFdBQVcsU0FBUSxRQUFRLGVBQWMsVUFBVSxTQUFRLEVBQUM7QUFBQTtBQUFBLE1BQzNFLG9DQUFDLFNBQUksT0FBTztBQUFBLFFBQ1YsUUFBUSxZQUFZLE1BQU07QUFBQSxRQUFLLGNBQWE7QUFBQSxRQUFJLFVBQVM7QUFBQSxRQUFZLFVBQVM7QUFBQSxRQUM5RSxZQUFZLEVBQUUsZUFBZSxPQUFPLEVBQUUsWUFBWSxtQkFBbUI7QUFBQSxNQUN2RSxLQUNHLEVBQUUsVUFDRCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxRQUNWLFVBQVM7QUFBQSxRQUFZLEtBQUk7QUFBQSxRQUFJLE1BQUs7QUFBQSxRQUNsQyxTQUFRO0FBQUEsUUFBVyxZQUFXO0FBQUEsUUFDOUIsWUFBVztBQUFBLFFBQW9CLFVBQVM7QUFBQSxRQUFJLFlBQVc7QUFBQSxRQUN2RCxlQUFjO0FBQUEsUUFBVSxPQUFNO0FBQUEsTUFDaEMsS0FBSSxFQUFFLE1BQU8sQ0FFakI7QUFBQSxNQUNDLEtBQUssU0FBUyxLQUNiLG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsUUFBUSxLQUFJLEdBQUcsY0FBYSxJQUFJLFVBQVMsT0FBTSxLQUNqRSxLQUFLLE1BQU0sR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQ3JCLG9DQUFDLFVBQUssS0FBSyxHQUFHLFdBQVUsU0FBUSxPQUFPLEVBQUMsVUFBUyxFQUFDLEtBQUksQ0FBRSxDQUN6RCxDQUNIO0FBQUEsTUFFRixvQ0FBQyxRQUFHLFdBQVUsWUFBVyxPQUFPLEVBQUMsVUFBVSxZQUFZLEtBQUssSUFBSSxZQUFXLEtBQUssY0FBYSxHQUFHLFlBQVcsS0FBSSxLQUFJLEVBQUUsUUFBUSwyQkFBUTtBQUFBLE1BQ3BJLEVBQUUsWUFDRCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxRQUNWLFlBQVc7QUFBQSxRQUFvQixVQUFTO0FBQUEsUUFBSSxZQUFXO0FBQUEsUUFDdkQsT0FBTTtBQUFBLFFBQW9CLGVBQWM7QUFBQSxRQUFVLGNBQWE7QUFBQSxNQUNqRSxLQUFJLEVBQUUsUUFBUztBQUFBLE1BRWhCLEVBQUUsUUFBUSxvQ0FBQyxPQUFFLE9BQU8sRUFBQyxVQUFVLFlBQVksS0FBSyxJQUFJLFlBQVcsS0FBSyxPQUFNLGVBQWMsS0FBSSxFQUFFLElBQUs7QUFBQSxJQUN0RztBQUFBLEVBRUosQ0FBQyxDQUNILENBQ0YsQ0FDRixDQUFVLEdBSVgsTUFBTSxTQUFTLEtBQ2Qsb0NBQUMsdUJBQW9CLE9BQU0sMkNBQVUsb0NBQUMsYUFBUSxXQUFVLGlCQUFnQixPQUFPLEVBQUMsY0FBYSx3QkFBdUIsS0FDbEgsb0NBQUMsU0FBSSxXQUFVLGVBRWIsb0NBQUMsU0FBSSxXQUFVLHVDQUNiLG9DQUFDLGFBQ0Msb0NBQUMsU0FBSSxXQUFVLG1CQUFrQixlQUFZLFVBQVEsU0FBUyxXQUFZLEdBQzFFLG9DQUFDLFFBQUcsV0FBVSxtQkFDWCxTQUFTLFdBQ1Ysb0NBQUMsVUFBSyxXQUFVLFFBQU8sT0FBTztBQUFBLElBQzVCLFVBQVM7QUFBQSxJQUFJLFlBQVc7QUFBQSxJQUFLLGVBQWM7QUFBQSxJQUMzQyxPQUFNO0FBQUEsSUFBZ0IsWUFBVztBQUFBLElBQUksZUFBYztBQUFBLEVBQ3JELEtBQUcsU0FBRyxNQUFNLFFBQU8scUJBQUksQ0FDekIsQ0FDRixHQUNBLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsYUFBWSxTQUFTLE1BQU0sR0FBRyxNQUFNLEtBQUksU0FBUyxVQUFXLENBQzlGLEdBQ0Esb0NBQUMsU0FBSSxXQUFVLGlCQUNaLE1BQU0sSUFBSSxDQUFDLEdBQUcsTUFDYjtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQVEsS0FBSyxFQUFFO0FBQUEsTUFBSSxXQUFVO0FBQUEsTUFDM0IsR0FBRyxVQUFVLE1BQU0sR0FBRyxNQUFNLEdBQUcsaUJBQU8sRUFBRSxLQUFLLEVBQUU7QUFBQSxNQUNoRCxPQUFPLEVBQUMsUUFBTyxXQUFXLFVBQVMsV0FBVTtBQUFBO0FBQUEsSUFDN0Msb0NBQUMsU0FBSSxXQUFVLFFBQU8sT0FBTztBQUFBLE1BQzNCLFVBQVM7QUFBQSxNQUFZLEtBQUk7QUFBQSxNQUFJLE9BQU07QUFBQSxNQUNuQyxVQUFTO0FBQUEsTUFBSSxPQUFNO0FBQUEsTUFBZ0IsZUFBYztBQUFBLElBQ25ELEtBQUcsS0FBRSxJQUFFLENBQUU7QUFBQSxJQUNULG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsUUFBUSxLQUFJLEdBQUcsY0FBYSxJQUFJLFVBQVMsT0FBTSxLQUNqRSxFQUFFLFNBQVMsb0NBQUMsVUFBSyxXQUFVLFdBQVMsRUFBRSxLQUFNLEdBQzVDLEVBQUUsWUFBWSxvQ0FBQyxVQUFLLFdBQVUsV0FBUyxFQUFFLFFBQVMsR0FDbEQsRUFBRSxTQUFTLG9DQUFDLFVBQUssV0FBVSxXQUFTLEVBQUUsS0FBTSxDQUMvQztBQUFBLElBQ0Esb0NBQUMsUUFBRyxXQUFVLGNBQWEsT0FBTyxFQUFDLFVBQVMsSUFBSSxjQUFhLEdBQUUsS0FBSSxFQUFFLEtBQU07QUFBQSxJQUMxRSxFQUFFLFFBQVEsb0NBQUMsT0FBRSxXQUFVLE9BQU0sT0FBTyxFQUFDLFVBQVMsSUFBSSxZQUFXLEtBQUssY0FBYSxHQUFFLEtBQUksZ0JBQWdCLEVBQUUsTUFBTSxHQUFHLENBQUU7QUFBQSxJQUNuSCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFNBQVE7QUFBQSxNQUFRLGdCQUFlO0FBQUEsTUFBaUIsWUFBVztBQUFBLE1BQzNELFdBQVU7QUFBQSxNQUF5QixZQUFXO0FBQUEsSUFDaEQsS0FDRSxvQ0FBQyxhQUNDLG9DQUFDLFNBQUksV0FBVSxRQUFPLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxLQUFLLGVBQWMsVUFBVSxPQUFNLGVBQWMsS0FBSSxTQUFTLGFBQWMsR0FDbEksb0NBQUMsU0FBSSxPQUFPLEVBQUMsVUFBUyxJQUFJLFdBQVUsR0FBRyxPQUFNLGNBQWMsWUFBVyxJQUFHLEtBQUksRUFBRSxRQUFRLFNBQVMsYUFBYyxDQUNoSCxHQUNBLG9DQUFDLFNBQUksT0FBTyxFQUFDLFdBQVUsUUFBTyxLQUM1QixvQ0FBQyxTQUFJLFdBQVUsUUFBTyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxlQUFjLFVBQVUsT0FBTSxlQUFjLEtBQUksU0FBUyxjQUFlLEdBQ25JLG9DQUFDLFNBQUksV0FBVSxZQUFXLE9BQU8sRUFBQyxVQUFTLElBQUksV0FBVSxHQUFHLE9BQU0sY0FBYyxZQUFXLElBQUcsS0FBSSxFQUFFLFFBQVMsT0FBTyxFQUFFLFVBQVUsV0FBVyxPQUFPLFNBQVMsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFLFFBQVMsU0FBUyxhQUFjLENBQzlNLENBQ0Y7QUFBQSxFQUNGLENBQ0QsQ0FDSCxDQUNGLENBQ0YsQ0FBVSxHQUlaLG9DQUFDLHVCQUFvQixPQUFNLDhCQUFPLG9DQUFDLGFBQVEsV0FBVSxnQkFBZSxPQUFPLEVBQUMsWUFBVyxlQUFlLGNBQWEsd0JBQXVCLEtBQ3hJLG9DQUFDLFNBQUksV0FBVSxlQUViLG9DQUFDLFNBQUksT0FBTztBQUFBLElBQ1YsU0FBUTtBQUFBLElBQVEsZ0JBQWU7QUFBQSxJQUFpQixZQUFXO0FBQUEsSUFDM0QsS0FBSTtBQUFBLElBQUksVUFBUztBQUFBLElBQVEsY0FBYTtBQUFBLElBQUksZUFBYztBQUFBLElBQ3hELGNBQWE7QUFBQSxFQUNmLEtBQ0Usb0NBQUMsU0FBSSxPQUFPLEVBQUMsTUFBSyxhQUFhLFVBQVMsRUFBQyxLQUN2QyxvQ0FBQyxTQUFJLFdBQVUsbUJBQWtCLGVBQVksVUFBUSxTQUFTLGdCQUFpQixHQUMvRSxvQ0FBQyxRQUFHLFdBQVUsaUJBQWdCLE9BQU8sRUFBQyxVQUFTLElBQUksY0FBYSxFQUFDLEtBQUksU0FBUyxjQUFlLENBQy9GLEdBQ0MsU0FBUyxxQkFDUixvQ0FBQyxPQUFFLE9BQU87QUFBQSxJQUNSLE1BQUs7QUFBQSxJQUFhLFVBQVM7QUFBQSxJQUFJLE9BQU07QUFBQSxJQUNyQyxZQUFXO0FBQUEsSUFBSyxRQUFPO0FBQUEsSUFBRyxVQUFTO0FBQUEsRUFDckMsS0FBSSxTQUFTLGlCQUFrQixHQUVqQyxvQ0FBQyxZQUFPLE1BQUssVUFBUyxXQUFVLGFBQVksU0FBUyxNQUFNLEdBQUcsV0FBVyxLQUFJLFNBQVMsZUFBZ0IsQ0FDeEcsR0FDQyxZQUFZLFNBQVMsSUFDcEIsb0NBQUMsU0FBSSxPQUFPLEVBQUMsUUFBTyx3QkFBdUIsS0FDeEMsWUFBWSxJQUFJLENBQUMsTUFBTSxNQUFHO0FBbDNCekMsUUFBQUY7QUFtM0JnQjtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQUksS0FBSyxLQUFLO0FBQUEsUUFDWixHQUFHLFVBQVUsTUFBTSxHQUFHLFdBQVcsR0FBRyxLQUFLLEtBQUs7QUFBQSxRQUMvQyxPQUFPO0FBQUEsVUFDTCxTQUFRO0FBQUEsVUFBUSxLQUFJO0FBQUEsVUFBSSxZQUFXO0FBQUEsVUFDbkMsU0FBUTtBQUFBLFVBQ1IsWUFBWSxJQUFJLE1BQU0sSUFBSSxjQUFjO0FBQUEsVUFDeEMsY0FBYyxJQUFJLFlBQVksU0FBUyxJQUFJLDBCQUEwQjtBQUFBLFFBQ3ZFO0FBQUE7QUFBQSxNQUNBLG9DQUFDLFNBQUksT0FBTyxFQUFDLE1BQUssR0FBRyxVQUFTLEVBQUMsS0FDN0Isb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLEtBQUksR0FBRyxZQUFXLFVBQVUsY0FBYSxHQUFHLFVBQVMsT0FBTSxLQUNyRixLQUFLLFlBQVksb0NBQUMsVUFBSyxXQUFVLFNBQVEsT0FBTyxFQUFDLFVBQVMsRUFBQyxLQUFJLEtBQUssUUFBUyxHQUM3RSxLQUFLLFVBQ0osb0NBQUMsVUFBSyxPQUFPO0FBQUEsUUFDWCxZQUFXO0FBQUEsUUFBb0IsVUFBUztBQUFBLFFBQUcsWUFBVztBQUFBLFFBQ3RELE9BQU07QUFBQSxRQUFvQixlQUFjO0FBQUEsTUFDMUMsS0FBRyxLQUFFLEtBQUssUUFBTyxHQUFDLENBRXRCLEdBQ0Esb0NBQUMsU0FBSSxXQUFVLFlBQVcsT0FBTyxFQUFDLFVBQVMsSUFBSSxPQUFNLGNBQWMsY0FBYSxHQUFHLFlBQVcsSUFBRyxLQUFJLEtBQUssS0FBTSxHQUNoSCxvQ0FBQyxTQUFJLE9BQU8sRUFBQyxVQUFTLElBQUksT0FBTSxnQkFBZ0IsWUFBVyxtQkFBa0IsS0FDMUUsS0FBSyxRQUFPLFVBQUksS0FBSyxJQUN4QixDQUNGO0FBQUEsTUFDQSxvQ0FBQyxTQUFJLE9BQU87QUFBQSxRQUNWLFNBQVE7QUFBQSxRQUFRLEtBQUk7QUFBQSxRQUFJLE9BQU07QUFBQSxRQUM5QixZQUFXO0FBQUEsUUFBb0IsVUFBUztBQUFBLFFBQUksWUFBVztBQUFBLFFBQUcsWUFBVztBQUFBLE1BQ3ZFLEtBQ0Usb0NBQUMsY0FBTSxTQUFTLHFCQUFvQixNQUFFQSxNQUFBLEtBQUssWUFBTCxPQUFBQSxNQUFnQixDQUFFLEdBQ3hELG9DQUFDLFVBQUssT0FBTyxFQUFDLE9BQU0sZUFBYyxLQUFHLFFBQUMsQ0FDeEM7QUFBQSxJQUNGO0FBQUEsR0FDRCxDQUNILElBRUEsb0NBQUMsU0FBSSxXQUFVLFFBQU8sT0FBTyxFQUFDLFdBQVUsVUFBVSxTQUFRLEdBQUUsS0FDMUQsb0NBQUMsU0FBSSxPQUFPLEVBQUMsWUFBVyxxQkFBcUIsVUFBUyxJQUFJLE9BQU0sY0FBYyxjQUFhLElBQUksWUFBVyxJQUFHLEtBQzFHLFNBQVMsbUJBQ1osR0FDQSxvQ0FBQyxPQUFFLE9BQU8sRUFBQyxVQUFTLElBQUksT0FBTSxnQkFBZ0IsY0FBYSxJQUFJLFlBQVcsSUFBRyxLQUMxRSxTQUFTLHNCQUNaLEdBQ0Esb0NBQUMsWUFBTyxXQUFVLGdCQUFlLFNBQVMsTUFBTSxHQUFHLFdBQVcsS0FBSSxTQUFTLGlCQUFrQixDQUMvRixDQUVKLENBQ0YsQ0FBVSxHQUdULGtCQUNDLG9DQUFDLHVCQUFvQixPQUFNLGtCQUFLLG9DQUFDLGFBQVEsV0FBVSxnQkFBZSxPQUFPLEVBQUMsY0FBYSx3QkFBdUIsS0FDNUcsb0NBQUMsU0FBSSxXQUFVLGVBRWIsb0NBQUMsU0FBSSxPQUFPO0FBQUEsSUFDVixTQUFRO0FBQUEsSUFBUSxnQkFBZTtBQUFBLElBQWlCLFlBQVc7QUFBQSxJQUMzRCxjQUFhO0FBQUEsSUFBSSxLQUFJO0FBQUEsSUFBSSxVQUFTO0FBQUEsRUFDcEMsS0FDRSxvQ0FBQyxTQUFJLFdBQVUsbUJBQWtCLGVBQVksUUFBTyxPQUFPLEVBQUMsUUFBTyxFQUFDLEtBQUksU0FBUyxhQUFjLEdBQy9GLG9DQUFDLFNBQUksT0FBTyxFQUFDLFNBQVEsUUFBUSxLQUFJLEdBQUcsWUFBVyxVQUFVLFVBQVMsT0FBTSxLQUVyRSxDQUFDLEdBQUMsd0JBQU8sY0FBUCxtQkFBa0IsZ0JBQWxCLG1EQUFtQyxZQUNwQztBQUFBLElBQUM7QUFBQTtBQUFBLE1BQU8sTUFBSztBQUFBLE1BQVMsV0FBVTtBQUFBLE1BQzlCLFNBQVMsTUFBTTtBQUNiLFlBQUk7QUFBRSx5QkFBZSxRQUFRLDZCQUE2QixHQUFHO0FBQUEsUUFBRyxTQUFRO0FBQUEsUUFBQztBQUN6RSxXQUFHLFFBQVE7QUFBQSxNQUNiO0FBQUE7QUFBQSxJQUFHO0FBQUEsRUFBSyxHQUVaLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsYUFBWSxTQUFTLE1BQU0sR0FBRyxRQUFRLEtBQUksU0FBUyxZQUFhLENBQ2xHLENBQ0YsR0FDQSxvQ0FBQyxTQUFJLE9BQU8sRUFBQyxTQUFRLFFBQVEscUJBQW9CLGFBQWEsS0FBSSxHQUFFLEdBQUcsV0FBVSxjQUUvRTtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQ0MsT0FBTyxFQUFDLFFBQU8sVUFBUztBQUFBLE1BQ3ZCLEdBQUcsVUFBVSxNQUFNLEdBQUcsUUFBUSxHQUFHLGlCQUFPLGVBQWUsS0FBSyxFQUFFO0FBQUE7QUFBQSxJQUM3RCxlQUFlLFlBQVksZUFBZSxhQUMxQyxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFFBQU87QUFBQSxNQUFLLGNBQWE7QUFBQSxNQUN6QixpQkFBZ0IsT0FBTyxlQUFlLFlBQVksZUFBZSxVQUFVO0FBQUEsTUFDM0UsZ0JBQWU7QUFBQSxNQUFTLG9CQUFtQjtBQUFBLElBQzdDLEdBQUUsSUFFRixvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFFBQU87QUFBQSxNQUFLLFlBQVc7QUFBQSxNQUFlLGNBQWE7QUFBQSxNQUNuRCxTQUFRO0FBQUEsTUFBUSxZQUFXO0FBQUEsTUFBVSxXQUFVO0FBQUEsTUFBeUIsY0FBYTtBQUFBLElBQ3ZGLEtBQ0Usb0NBQUMsU0FBSSxPQUFPLEVBQUMsWUFBVyxvQkFBb0IsVUFBUyxHQUFHLFlBQVcsS0FBSyxPQUFNLGdCQUFnQixlQUFjLFNBQVEsS0FBRyxpQkFBZSxDQUN4STtBQUFBLElBRUYsb0NBQUMsU0FBSSxPQUFPLEVBQUMsU0FBUSxRQUFRLEtBQUksSUFBSSxZQUFXLFVBQVUsY0FBYSxJQUFJLFVBQVMsT0FBTSxLQUN2RixlQUFlLFlBQVksb0NBQUMsVUFBSyxXQUFVLFVBQVEsZUFBZSxRQUFTLEdBQzNFLGVBQWUsUUFBUSxvQ0FBQyxVQUFLLFdBQVUsY0FBYSxPQUFPLEVBQUMsVUFBUyxHQUFFLEtBQUksZUFBZSxJQUFLLEdBQy9GLGVBQWUsWUFBWSxvQ0FBQyxVQUFLLFdBQVUsY0FBYSxPQUFPLEVBQUMsVUFBUyxHQUFFLEtBQUcsU0FBRyxlQUFlLFFBQVMsQ0FDNUc7QUFBQSxJQUVBLG9DQUFDLFFBQUcsT0FBTztBQUFBLE1BQ1QsWUFBVztBQUFBLE1BQXFCLFVBQVM7QUFBQSxNQUN6QyxZQUFXO0FBQUEsTUFBSyxZQUFXO0FBQUEsTUFBSyxjQUFhO0FBQUEsTUFBSSxPQUFNO0FBQUEsTUFDdkQsZUFBYztBQUFBLElBQ2hCLEtBQUksZUFBZSxLQUFNO0FBQUEsSUFDeEIsZUFBZSxXQUNkLG9DQUFDLE9BQUUsT0FBTyxFQUFDLFVBQVMsSUFBSSxZQUFXLE1BQU0sT0FBTSxnQkFBZ0IsY0FBYSxJQUFJLFVBQVMsSUFBRyxLQUFJLGVBQWUsT0FBUTtBQUFBLElBRXpILG9DQUFDLFNBQUksV0FBVSxRQUFPLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxLQUFLLGVBQWMsU0FBUyxPQUFNLG1CQUFrQixLQUFJLFNBQVMsY0FBZTtBQUFBLEVBQ3hJLEdBRUEsb0NBQUMsV0FBTSxPQUFPLEVBQUMsWUFBVyxFQUFDLEtBQ3pCLG9DQUFDLFNBQUksV0FBVSxRQUFPLE9BQU87QUFBQSxJQUMzQixVQUFTO0FBQUEsSUFBSSxZQUFXO0FBQUEsSUFBSyxlQUFjO0FBQUEsSUFDM0MsT0FBTTtBQUFBLElBQWdCLGNBQWE7QUFBQSxJQUFJLGVBQWM7QUFBQSxFQUN2RCxLQUFJLFNBQVMsV0FBWSxHQUN4QixpQkFBaUIsSUFBSSxDQUFDLEdBQUcsT0FDeEI7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFJLEtBQUssRUFBRTtBQUFBLE1BQ1QsR0FBRyxVQUFVLE1BQU0sR0FBRyxRQUFRLEdBQUcsaUJBQU8sRUFBRSxLQUFLLEVBQUU7QUFBQSxNQUNsRCxPQUFPO0FBQUEsUUFDTCxTQUFRO0FBQUEsUUFDUixjQUFjLEtBQUssaUJBQWlCLFNBQVMsSUFBSSwwQkFBMEI7QUFBQSxRQUMzRSxRQUFPO0FBQUEsTUFDVDtBQUFBO0FBQUEsSUFDQSxvQ0FBQyxTQUFJLE9BQU8sRUFBQyxTQUFRLFFBQVEsS0FBSSxJQUFJLFlBQVcsVUFBVSxjQUFhLEdBQUcsVUFBUyxPQUFNLEtBQ3RGLEVBQUUsWUFBWSxvQ0FBQyxVQUFLLFdBQVUsUUFBTyxPQUFPLEVBQUMsVUFBUyxHQUFHLFNBQVEsVUFBUyxLQUFJLEVBQUUsUUFBUyxHQUN6RixFQUFFLFFBQVEsb0NBQUMsVUFBSyxXQUFVLGNBQWEsT0FBTyxFQUFDLFVBQVMsR0FBRSxLQUFJLEVBQUUsSUFBSyxDQUN4RTtBQUFBLElBQ0Esb0NBQUMsUUFBRyxXQUFVLFlBQVcsT0FBTyxFQUFDLFVBQVMsSUFBSSxZQUFXLEtBQUssWUFBVyxLQUFLLGNBQWEsRUFBQyxLQUFJLEVBQUUsS0FBTTtBQUFBLElBQ3ZHLEVBQUUsV0FBVyxvQ0FBQyxPQUFFLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxLQUFLLE9BQU0sZ0JBQWdCLFFBQU8sRUFBQyxNQUFLLEVBQUUsV0FBUyxJQUFJLE1BQU0sR0FBRSxFQUFFLEdBQUUsUUFBQztBQUFBLEVBQ3ZILENBQ0QsR0FDQSxpQkFBaUIsV0FBVyxLQUMzQixvQ0FBQyxPQUFFLE9BQU8sRUFBQyxVQUFTLElBQUksT0FBTSxnQkFBZ0IsU0FBUSxTQUFRLEtBQUksU0FBUyxXQUFZLENBRTNGLENBQ0YsQ0FDRixDQUNGLENBQVUsR0FJWCxTQUFTLFNBQVMsS0FDakIsb0NBQUMsdUJBQW9CLE9BQU0sa0JBQUssb0NBQUMsYUFBUSxXQUFVLGlCQUFnQixPQUFPLEVBQUMsWUFBVyxlQUFlLGNBQWEsd0JBQXVCLEtBQ3ZJLG9DQUFDLFNBQUksV0FBVSxlQUViLG9DQUFDLFNBQUksV0FBVSx1Q0FDYixvQ0FBQyxhQUNDLG9DQUFDLFNBQUksV0FBVSxtQkFBa0IsZUFBWSxVQUFRLFNBQVMsZUFBZ0IsR0FDOUUsb0NBQUMsUUFBRyxXQUFVLG1CQUFpQixTQUFTLGFBQWMsQ0FDeEQsR0FDQSxvQ0FBQyxZQUFPLE1BQUssVUFBUyxXQUFVLGFBQVksU0FBUyxNQUFNLEdBQUcsVUFBVSxLQUFJLFNBQVMsY0FBZSxDQUN0RyxHQUVBLG9DQUFDLFNBQUksV0FBVSxpQkFBZ0IsTUFBSyxVQUNqQyxTQUFTLElBQUksQ0FBQyxZQUNiO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFBUSxLQUFLLFFBQVE7QUFBQSxNQUNwQixNQUFLO0FBQUEsTUFDTCxXQUFVO0FBQUEsTUFDVCxHQUFHLFVBQVUsTUFBTTtBQUNsQixZQUFJO0FBQUUseUJBQWUsUUFBUSwyQkFBMkIsT0FBTyxRQUFRLEVBQUUsQ0FBQztBQUFBLFFBQUcsU0FBUTtBQUFBLFFBQUM7QUFDdEYsV0FBRyxVQUFVO0FBQUEsTUFDZixHQUFHLGlCQUFPLFFBQVEsU0FBUyxRQUFRLEtBQUssRUFBRTtBQUFBLE1BQzFDLE9BQU8sRUFBQyxRQUFPLFdBQVcsU0FBUSxRQUFRLGVBQWMsVUFBVSxTQUFRLGVBQWM7QUFBQTtBQUFBLElBQ3hGLG9DQUFDLFVBQUssV0FBVSxTQUFRLE9BQU8sRUFBQyxjQUFhLElBQUksV0FBVSxhQUFZLEtBQUksU0FBUyxZQUFhO0FBQUEsSUFDakcsb0NBQUMsUUFBRyxXQUFVLFlBQVcsT0FBTyxFQUFDLFVBQVMsSUFBSSxZQUFXLEtBQUssY0FBYSxHQUFHLE1BQUssV0FBVSxLQUFJLFFBQVEsU0FBUyxRQUFRLEtBQU07QUFBQSxJQUMvSCxRQUFRLFFBQVEsb0NBQUMsT0FBRSxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxPQUFNLGdCQUFnQixjQUFhLElBQUksTUFBSyxXQUFVLEtBQUksZ0JBQWdCLFFBQVEsTUFBTSxHQUFHLENBQUU7QUFBQSxJQUN0SixvQ0FBQyxTQUFJLE9BQU8sRUFBQyxXQUFVLHlCQUF5QixZQUFXLElBQUksU0FBUSxRQUFRLGdCQUFlLGlCQUFpQixXQUFVLE9BQU0sS0FDN0gsb0NBQUMsVUFBSyxPQUFPLEVBQUMsVUFBUyxJQUFJLE9BQU0sZUFBYyxLQUFJLFFBQVEsU0FBUyxTQUFTLGFBQWMsR0FDM0Ysb0NBQUMsVUFBSyxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsb0JBQW9CLFlBQVcsS0FBSyxPQUFNLGFBQVksS0FBSSxRQUFRLFFBQVEsU0FBUyxhQUFjLENBQ3pJO0FBQUEsRUFDRixDQUNELENBQ0gsR0FFQyxTQUFTLFVBQVUsS0FDbEIsb0NBQUMsU0FBSSxXQUFVLFFBQU8sT0FBTztBQUFBLElBQzNCLFdBQVU7QUFBQSxJQUFJLFVBQVM7QUFBQSxJQUFJLFlBQVc7QUFBQSxJQUFLLGVBQWM7QUFBQSxJQUN6RCxPQUFNO0FBQUEsSUFBZ0IsV0FBVTtBQUFBLEVBQ2xDLEtBQUcscURBQVcsQ0FFbEIsQ0FDRixDQUFVLEdBSVosb0NBQUMsdUJBQW9CLElBQVEsVUFBb0IsTUFBTSxVQUFTLENBRWxFO0FBRUo7QUFFQSxPQUFPLE9BQU8sUUFBUSxFQUFFLFNBQVMsQ0FBQzsiLAogICJuYW1lcyI6IFsiX2EiLCAiX2IiLCAiX2MiXQp9Cg==

})();

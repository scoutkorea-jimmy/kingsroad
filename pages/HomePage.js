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
const HeroProgramCards = ({ go, dataTick }) => {
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
  return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 14 } }, /* @__PURE__ */ React.createElement(
    "article",
    {
      onClick: () => {
        if (nextLecture) go("lectures");
      },
      style: {
        padding: "20px 22px",
        cursor: nextLecture ? "pointer" : "default",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        transition: "all 0.15s"
      },
      role: nextLecture ? "button" : void 0,
      tabIndex: nextLecture ? 0 : void 0,
      onKeyDown: (e) => {
        if (nextLecture && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          go("lectures");
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", color: "var(--ink-2)", marginBottom: 10 } }, lectureIsPast ? "RECENT LECTURE \xB7 \uCD5C\uADFC \uAC15\uC5F0" : "NEXT LECTURE \xB7 \uB2E4\uC74C \uAC15\uC5F0"),
    nextLecture ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 8, color: "var(--ink)" } }, nextLecture.topic || nextLecture.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { className: "gold-2 mono", style: { fontSize: 13, fontWeight: 600 } }, fmtDate(nextLecture.startsAt)), /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 12 } }, nextLecture.venue || "\uC7A5\uC18C \uBBF8\uC815"))) : /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.7, margin: 0 } }, "\uC608\uC815\uB41C \uAC15\uC5F0\uC774 \uC544\uC9C1 \uC5C6\uC2B5\uB2C8\uB2E4. ", /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost gold", onClick: (e) => {
      e.stopPropagation();
      go("lectures");
    } }, "\uC804\uCCB4 \uAC15\uC5F0 \uBCF4\uAE30 \u2192"))
  ), /* @__PURE__ */ React.createElement(
    "article",
    {
      onClick: () => {
        if (nextTour) go("tour");
      },
      style: {
        padding: "20px 22px",
        cursor: nextTour ? "pointer" : "default",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        transition: "all 0.15s"
      },
      role: nextTour ? "button" : void 0,
      tabIndex: nextTour ? 0 : void 0,
      onKeyDown: (e) => {
        if (nextTour && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          go("tour");
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", color: "var(--ink-2)", marginBottom: 10 } }, "NEXT TOUR \xB7 \uB2E4\uC74C \uB2F5\uC0AC"),
    nextTour ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 8, color: "var(--ink)" } }, nextTour.title), nextTour.subtitle && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 13, marginBottom: 8, fontStyle: "italic" } }, nextTour.subtitle), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { className: "gold-2 mono", style: { fontSize: 13, fontWeight: 600 } }, fmtDate(nextTour.startsAt)), /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 12 } }, nextTour.level && /* @__PURE__ */ React.createElement("span", { style: { marginRight: 8 } }, nextTour.level), nextTour.duration))) : /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.7, margin: 0 } }, "\uC608\uC815\uB41C \uB2F5\uC0AC\uAC00 \uC544\uC9C1 \uC5C6\uC2B5\uB2C8\uB2E4. ", /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost gold", onClick: (e) => {
      e.stopPropagation();
      go("tour");
    } }, "\uC804\uCCB4 \uB2F5\uC0AC \uBCF4\uAE30 \u2192"))
  ));
};
const BookCarouselSection = ({ go, dataTick }) => {
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
    } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, "\uBC45\uAE30\uB178\uC790 \uCD9C\uD310 \xB7 ", yr), /* @__PURE__ */ React.createElement("h2", { style: {
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
    } }, b.subtitle), b.desc && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, lineHeight: 1.85, color: "var(--ink-2)", marginBottom: 28, whiteSpace: "pre-wrap" } }, b.desc), (hasPriceKR || hasPriceEN) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20, marginBottom: 32, alignItems: "flex-end" } }, hasPriceKR && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, "\uAD6D\uBB38\uD310"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, marginTop: 4, color: "var(--ink)", fontWeight: 700 } }, Number(b.priceKR).toLocaleString(), "\uC6D0")), hasPriceKR && hasPriceEN && /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "var(--line-2)", alignSelf: "stretch" } }), hasPriceEN && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, "\uC601\uBB38\uD310"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, marginTop: 4, color: "var(--ink)", fontWeight: 700 } }, Number(b.priceEN).toLocaleString(), "\uC6D0"))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("book") }, "\uAD6C\uB9E4\uD558\uAE30 \u2192")), /* @__PURE__ */ React.createElement("div", { style: {
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
    ) : /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "0 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--ink)", marginBottom: 10, fontWeight: 600 } }, b.title), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.2em" } }, b.author || "\uBC45\uAE30\uB178\uC790", " \uC9C0\uC74C"))));
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
  return /* @__PURE__ */ React.createElement("div", null, mapOpen && /* @__PURE__ */ React.createElement(DestinationMapModal, { onClose: () => setMapOpen(false), go }), recDetail && /* @__PURE__ */ React.createElement(RecommendationDetailModal, { rec: recDetail, onClose: () => setRecDetail(null), go }), /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uD788\uC5B4\uB85C" }, /* @__PURE__ */ React.createElement("section", { style: {
    position: "relative",
    overflow: "hidden",
    background: "var(--bg)",
    borderBottom: "1px solid var(--line)",
    padding: "72px 0 88px"
  } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "hero-grid", style: {
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
  } }, /* @__PURE__ */ React.createElement("span", null, hero.eyebrow || "BANGINOJA \xB7 \uBC45\uAE30\uD0C0\uACE0 \uB178\uC790")), /* @__PURE__ */ React.createElement("h1", { style: {
    fontFamily: "var(--font-display)",
    fontSize: `clamp(36px, 5vw, ${heroStyle.title.fontSize}px)`,
    fontWeight: heroStyle.title.fontWeight,
    lineHeight: heroStyle.title.lineHeight,
    letterSpacing: `${heroStyle.title.letterSpacing}em`,
    marginBottom: 22,
    color: `var(${heroStyle.title.color})`
  } }, hero.title1 || "\uBC45\uAE30\uD0C0\uACE0", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: `var(${heroStyle.title.accentColor})` } }, hero.title2 || "\uD55C\uAD6D\uC744"), /* @__PURE__ */ React.createElement("br", null), hero.title3 || "\uB290\uB07C\uB2E4"), /* @__PURE__ */ React.createElement("p", { className: "bgnj-multiline", style: {
    fontSize: heroStyle.subtitle.fontSize,
    lineHeight: heroStyle.subtitle.lineHeight,
    color: `var(${heroStyle.subtitle.color})`,
    maxWidth: heroStyle.subtitle.maxWidth,
    marginBottom: 32,
    fontWeight: heroStyle.subtitle.fontWeight,
    marginLeft: heroStyle.title.textAlign === "center" ? "auto" : void 0,
    marginRight: heroStyle.title.textAlign === "center" ? "auto" : void 0
  } }, hero.subtitle || "\uAD81\uAD90 \uB2F5\uC0AC\uBD80\uD130 \uC9C0\uC5ED \uC5EC\uD589 \uCF54\uC2A4\uAE4C\uC9C0. \uBC45\uAE30\uB178\uC790\uC640 \uD568\uAED8 \uD55C\uAD6D\uC758 \uC5ED\uC0AC\xB7\uBB38\uD654\xB7\uC790\uC5F0\uC744 \uC628\uBAB8\uC73C\uB85C \uACBD\uD5D8\uD558\uB294 \uC5EC\uD589 \uCEE4\uBBA4\uB2C8\uD2F0\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: {
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
    hero.ctaPrimary || "\uCEE4\uBBA4\uB2C8\uD2F0 \uCC38\uC5EC\uD558\uAE30"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn",
      onClick: () => go("tour"),
      style: { fontWeight: heroStyle.cta.fontWeight }
    },
    hero.ctaSecondary || "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8 \uBCF4\uAE30"
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
  } }, stat.s))))), /* @__PURE__ */ React.createElement(HeroProgramCards, { go, dataTick }))))), recommendations.length > 0 && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uBC45\uAE30\uB178\uC790 \uCD94\uCC9C" }, /* @__PURE__ */ React.createElement("section", { className: "section", style: { background: "var(--bg-2)", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, (() => {
    var _a, _b, _c, _d, _e;
    const _i = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).recommendationsHeading || {};
    const eb = _i.eyebrow || "RECOMMENDATIONS \xB7 \uBC45\uAE30\uB178\uC790 \uCD94\uCC9C";
    const tp = (_c = _i.titlePrefix) != null ? _c : "\uBC45\uAE30\uB178\uC790\uAC00 ";
    const ta = (_d = _i.titleAccent) != null ? _d : "\uCD94\uCC9C";
    const ts = (_e = _i.titleSuffix) != null ? _e : "\uD569\uB2C8\uB2E4";
    const sb = _i.subtitle || "\uBC45\uAE30\uB178\uC790\uAC00 \uC9C1\uC811 \uAC77\uACE0, \uB9DB\uBCF4\uACE0, \uB290\uB080 \uACF3. \uC6B4\uC601\uC790\uAC00 \uD050\uB808\uC774\uC158\uD55C \uCD94\uCC9C \uC5EC\uD589\uC9C0\uC785\uB2C8\uB2E4.";
    return /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        eyebrow: eb,
        title: /* @__PURE__ */ React.createElement(React.Fragment, null, tp, /* @__PURE__ */ React.createElement("span", { className: "accent" }, ta), ts),
        subtitle: sb,
        action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("tour") }, "\uC804\uCCB4 \uD504\uB85C\uADF8\uB7A8 \u2192")
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
      eyebrow: "TOUR PROGRAM \xB7 \uBC45\uAE30\uB178\uC790 \uD22C\uC5B4",
      title: /* @__PURE__ */ React.createElement(React.Fragment, null, "\uC9C1\uC811 \uAC77\uB294 ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, "\uB2F5\uC0AC \uC5EC\uD589")),
      subtitle: "\uBC45\uAE30\uB178\uC790\uAC00 \uC9C1\uC811 \uAE30\uD68D\xB7\uC6B4\uC601\uD558\uB294 \uC18C\uADDC\uBAA8 \uB2F5\uC0AC \uD504\uB85C\uADF8\uB7A8. \uAE4A\uC774 \uC788\uB294 \uD574\uC124\uACFC \uD568\uAED8\uD558\uB294 \uC5EC\uD589.",
      action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("tour") }, "\uC804\uCCB4 \uD504\uB85C\uADF8\uB7A8 \u2192")
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
    } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, "\uB2E4\uC74C \uC77C\uC815"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, marginTop: 4, color: "var(--ink)", fontWeight: 500 } }, t.next || "\u2014")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, "\uCC38\uAC00\uBE44"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 20, marginTop: 4, color: "var(--ink)", fontWeight: 600 } }, t.price ? typeof t.price === "number" ? window.BGNJ_FMT.won(t.price) : t.price : "\u2014")))
  )))))), /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCEE4\uBBA4\uB2C8\uD2F0" }, /* @__PURE__ */ React.createElement("section", { className: "section", style: { background: "var(--bg-2)", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement(
    SectionHead,
    {
      eyebrow: "COMMUNITY \xB7 \uC5EC\uD589 \uC774\uC57C\uAE30",
      title: /* @__PURE__ */ React.createElement(React.Fragment, null, "\uD568\uAED8 \uB9CC\uB4E4\uC5B4\uAC00\uB294 ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, "\uC5EC\uD589")),
      subtitle: "\uC5EC\uD589 \uACBD\uD5D8\uC744 \uB098\uB204\uACE0, \uCF54\uC2A4\uB97C \uCD94\uCC9C\uD558\uACE0, \uD568\uAED8 \uB5A0\uB0A0 \uB3D9\uD589\uC744 \uCC3E\uC2B5\uB2C8\uB2E4.",
      action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("community") }, "\uCEE4\uBBA4\uB2C8\uD2F0 \uAC00\uAE30 \u2192")
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
      } }, /* @__PURE__ */ React.createElement("span", null, "\uB313\uAE00 ", (_a = post.replies) != null ? _a : 0), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-2)" } }, "\u2192"))
    );
  })) : /* @__PURE__ */ React.createElement("div", { className: "card", style: { textAlign: "center", padding: 60 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--ink)", marginBottom: 12, fontWeight: 600 } }, "\uCCAB \uBC88\uC9F8 \uC5EC\uD589 \uC774\uC57C\uAE30\uB97C \uC368\uC8FC\uC138\uC694"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-2)", marginBottom: 24, lineHeight: 1.7 } }, "\uCEE4\uBBA4\uB2C8\uD2F0\uC5D0 \uC5EC\uD589 \uACBD\uD5D8\uC744 \uB098\uB204\uBA74 \uB354 \uB9CE\uC740 \uC5EC\uD589\uC790\uB4E4\uC774 \uBAA8\uC5EC\uB4ED\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("community") }, "\uAE00 \uC791\uC131\uD558\uAE30 \u2192"))))), featuredColumn && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCE7C\uB7FC" }, /* @__PURE__ */ React.createElement("section", { className: "section", style: { borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement(
    SectionHead,
    {
      eyebrow: "COLUMN \xB7 \uBC45\uAE30\uB178\uC790\uC758 \uAE00",
      title: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "accent" }, "\uBC45\uAE30\uB178\uC790"), "\uAC00 \uC4F0\uB2E4"),
      subtitle: "\uD55C\uAD6D\uC758 \uC5ED\uC0AC\xB7\uBB38\uD654\xB7\uC5EC\uD589\uC744 \uAE4A\uC774 \uC788\uAC8C \uD480\uC5B4\uB0B4\uB294 \uBC45\uAE30\uB178\uC790\uC758 \uC815\uAE30 \uCE7C\uB7FC.",
      action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("column") }, "\uCE7C\uB7FC \uC804\uCCB4 \uBCF4\uAE30 \u2192")
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
    /* @__PURE__ */ React.createElement("div", { style: { padding: 30 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" } }, featuredColumn.category && /* @__PURE__ */ React.createElement("span", { className: "pill" }, featuredColumn.category), featuredColumn.date && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, featuredColumn.date), featuredColumn.readTime && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, "\xB7 ", featuredColumn.readTime)), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 26, fontWeight: 600, lineHeight: 1.3, marginBottom: 12 } }, featuredColumn.title), featuredColumn.excerpt && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, lineHeight: 1.75, color: "var(--ink-2)" } }, featuredColumn.excerpt), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", marginTop: 20, color: "var(--secondary)" } }, "\uB354 \uC77D\uAE30 \u2192"))
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
  )), secondaryColumns.length === 0 && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", padding: "18px 0" } }, "\uB2E4\uC74C \uCE7C\uB7FC \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4.")))))), lectures.length > 0 && /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uAC15\uC5F0" }, /* @__PURE__ */ React.createElement("section", { className: "section-tight", style: { background: "var(--bg-2)", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement(
    SectionHead,
    {
      eyebrow: "LECTURE \xB7 \uBC45\uAE30\uB178\uC790 \uAC15\uC5F0",
      title: /* @__PURE__ */ React.createElement(React.Fragment, null, "\uC774\uBC88 \uB2EC ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, "\uAC15\uC5F0 \uC77C\uC815")),
      action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", onClick: () => go("lectures") }, "\uC804\uCCB4 \uAC15\uC5F0 \uBCF4\uAE30 \u2192")
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
    /* @__PURE__ */ React.createElement("span", { className: "badge", style: { marginBottom: 16 } }, "\uAC15\uC5F0"),
    /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, fontWeight: 600, marginBottom: 8 } }, lecture.topic || lecture.title),
    lecture.note && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, lineHeight: 1.7, color: "var(--ink-2)", marginBottom: 16 } }, truncatePreview(lecture.note, 110)),
    /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid var(--line)", paddingTop: 12, display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--ink-2)" } }, lecture.venue || "\u2014"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink)" } }, lecture.next || "\u2014"))
  )))))), /* @__PURE__ */ React.createElement(BookCarouselSection, { go, dataTick }));
};
Object.assign(window, { HomePage });
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvSG9tZVBhZ2UuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVENjQ4XHVEMzk4XHVDNzc0XHVDOUMwIFx1MjAxNCBcdUQ1NUNcdUFENkQgXHVDNUVDXHVENTg5XHUwMEI3XHVDNUVEXHVDMEFDXHUwMEI3XHVCQjM4XHVENjU0IFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFxuLy8gXHVCMzcwXHVDNzc0XHVEMTMwIFx1QzZEMFx1Q0U1OSAodjAwLjA0Nik6XG4vLyAgIDEuIFx1QkFBOFx1QjRFMCBcdUNGNThcdUQxNTBcdUNFMjBcdUIyOTQgXHVDMTFDXHVCQzg0KEQxKSBzb3VyY2Utb2YtdHJ1dGguXG4vLyAgICAgIC0gc2MucmVjb21tZW5kYXRpb25zICAgIFx1MjE5MiBzaXRlX2NvbnRlbnRfa3YgKFx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUNGNThcdUQxNTBcdUNFMjAgXHVEMzI4XHVCMTEwKVxuLy8gICAgICAtIHB1YmxpY0NvbHVtbnMgICAgICAgICBcdTIxOTIgQkdOSl9BUEkuY29sdW1ucy5saXN0IChEMS51c2VyX2NvbHVtbnMpXG4vLyAgICAgIC0gdG91cnMgLyBsZWN0dXJlcyAgICAgIFx1MjE5MiBCR05KX0FQSS50b3Vycy9sZWN0dXJlcy5saXN0XG4vLyAgICAgIC0gcmVjZW50UG9zdHMgICAgICAgICAgIFx1MjE5MiBCR05KX0FQSS5jb21tdW5pdHkucG9zdHNcbi8vICAgMi4gQkFOR0lOT0pBX0RBVEEgXHVDODE1XHVDODAxIFx1QzJEQ1x1QjREQ1x1QjI5NCBcdUIzNTQgXHVDNzc0XHVDMEMxIFx1Q0MzOFx1Qzg3MFx1RDU1OFx1QzlDMCBcdUM1NEFcdUIyOTRcdUIyRTQuXG4vLyAgIDMuIFx1QzExQ1x1QkM4NCBcdUM3NTFcdUIyRjVcdUM3NzQgXHVCRTQ0XHVCQTc0IFx1RDU3NFx1QjJGOSBcdUMxMzlcdUMxNTggXHVDNzkwXHVDQ0I0XHVCOTdDIFx1QjgwQ1x1QjM1NFx1RDU1OFx1QzlDMCBcdUM1NEFcdUIyOTRcdUIyRTQgKFx1QUU2MVx1RDFCNSBcdUNFNzRcdUI0REMgXHVBRTA4XHVDOUMwKS5cbi8vICAgNC4gXHVCQUE4XHVCNEUwIFx1RDVFQ1x1RDM3QyBcdUQ2MzhcdUNEOUNcdUM3NDAgQkdOSl9HVUFSRC5hcnIvLmNhbGwgXHVCODVDIHRyeS9jYXRjaCArIFx1RDBDMFx1Qzc4NSBcdUFDMDBcdUI0REMgXHVEMUI1XHVBQ0ZDLlxuXG5jb25zdCBEZXN0aW5hdGlvbk1hcE1vZGFsID0gKHsgb25DbG9zZSwgZ28gfSkgPT4ge1xuICBjb25zdCBbc2VsZWN0ZWREZXN0LCBzZXRTZWxlY3RlZERlc3RdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIC8vIHYwMC4wNzcgXHUyMDE0IHVzZU1vZGFsR3VhcmQgXHVEMUI1XHVDNzdDIChFU0MgKyBib2R5IHNjcm9sbCBsb2NrICsgcG9wc3RhdGUpLiBcdUM3N0RcdUFFMzAgXHVDODA0XHVDNkE5IFx1MjE5MiBkaXJ0eT1mYWxzZS5cbiAgd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiBmYWxzZSwgb25DbG9zZSwgb25TYXZlRHJhZnQ6IG51bGwsIGxhYmVsOiAnXHVDNUVDXHVENTg5XHVDOUMwIFx1QzlDMFx1QjNDNCBcdUQwRDBcdUMwQzknIH0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIlx1QzVFQ1x1RDU4OVx1QzlDMCBcdUM5QzBcdUIzQzQgXHVEMEQwXHVDMEM5XCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGluc2V0OjAsIHpJbmRleDoyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6J3JnYmEoMTUsMjMsNDIsMC41NSknLFxuICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgcGFkZGluZzoyMCxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkgb25DbG9zZSgpOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgbWF4V2lkdGg6NjgwLCB3aWR0aDonMTAwJScsIG1heEhlaWdodDonOTJ2aCcsXG4gICAgICAgIG92ZXJmbG93OidhdXRvJywgcGFkZGluZzonMzJweCAyOHB4IDI4cHgnLCBwb3NpdGlvbjoncmVsYXRpdmUnLFxuICAgICAgICBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfSBhcmlhLWxhYmVsPVwiXHVCMkVCXHVBRTMwXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgdG9wOjE0LCByaWdodDoxNCxcbiAgICAgICAgICAgIHdpZHRoOjM2LCBoZWlnaHQ6MzYsIGZvbnRTaXplOjI0LFxuICAgICAgICAgICAgYmFja2dyb3VuZDondHJhbnNwYXJlbnQnLCBib3JkZXI6J25vbmUnLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgY29sb3I6J3ZhcigtLWluay0yKScsIGxpbmVIZWlnaHQ6MSxcbiAgICAgICAgICB9fT5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBzdHlsZT17e21hcmdpbkJvdHRvbToxNH19PkRFU1RJTkFUSU9OUyBcdTAwQjcgXHVDNUVDXHVENTg5XHVDOUMwIFx1QzlDMFx1QjNDNDwvZGl2PlxuICAgICAgICA8aDIgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LWRpc3BsYXkpJywgZm9udFNpemU6MjYsIGZvbnRXZWlnaHQ6OTAwLCBtYXJnaW5Cb3R0b206MTAsIGxpbmVIZWlnaHQ6MS4yfX0+XG4gICAgICAgICAgXHVDOUMwXHVCM0M0XHVCOTdDIFx1RDA3NFx1QjlBRFx1RDU3NCBcdUQwRDBcdUMwQzlcdUQ1NThcdUMxMzhcdUM2OTRcbiAgICAgICAgPC9oMj5cbiAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyMCwgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICBcdUMyRENcdUIzQzRcdUI5N0MgXHVCMjA0XHVCOTc0XHVCQTc0IFx1QzgxNVx1QkNGNFx1QUMwMCBcdUQzQkNcdUNDRDBcdUM5RDFcdUIyQzhcdUIyRTQuIFx1RDYzOFx1QkM4NFx1RDU1OFx1QkE3NCBcdUM5QzBcdUJBODVcdUM3NzQgXHVENDVDXHVDMkRDXHVCNDI5XHVCMkM4XHVCMkU0LlxuICAgICAgICA8L3A+XG4gICAgICAgIHt0eXBlb2YgS29yZWFNYXAgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgPEtvcmVhTWFwXG4gICAgICAgICAgICBvblNlbGVjdD17KGRlc3QpID0+IHNldFNlbGVjdGVkRGVzdChzZWxlY3RlZERlc3Q/LmlkID09PSBkZXN0LmlkID8gbnVsbCA6IGRlc3QpfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkRGVzdD8uaWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7aGVpZ2h0OjMwMCwgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIGNvbG9yOid2YXIoLS1pbmstMyknLCBmb250U2l6ZToxM319Plx1QzlDMFx1QjNDNCBcdUI4NUNcdUI1MjkgXHVDOTExLi4uPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHtzZWxlY3RlZERlc3QgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIG1hcmdpblRvcDoxOCwgcGFkZGluZzonMThweCAyMHB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidiYXNlbGluZScsIGdhcDoxMCwgbWFyZ2luQm90dG9tOjgsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MjIsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo2MDB9fT57c2VsZWN0ZWREZXN0Lm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMTJlbSd9fT57c2VsZWN0ZWREZXN0LmZ1bGxuYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge3NlbGVjdGVkRGVzdC5kZXNjICYmIChcbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxNCwgY29sb3I6J3ZhcigtLWluay0yKScsIGxpbmVIZWlnaHQ6MS43LCBtYXJnaW5Cb3R0b206MTJ9fT57c2VsZWN0ZWREZXN0LmRlc2N9PC9wPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtzZWxlY3RlZERlc3QudGFncyAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjYsIGZsZXhXcmFwOid3cmFwJywgbWFyZ2luQm90dG9tOjE0fX0+XG4gICAgICAgICAgICAgICAge1N0cmluZyhzZWxlY3RlZERlc3QudGFncykuc3BsaXQoJ1x1MDBCNycpLm1hcCgodCkgPT4gdC50cmltKCkpLmZpbHRlcihCb29sZWFuKS5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGtleT17dH0gY2xhc3NOYW1lPVwiYmFkZ2VcIiBzdHlsZT17e2ZvbnRTaXplOjEwfX0+e3R9PC9zcGFuPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiB7IGdvKCd0b3VyJyk7IG9uQ2xvc2UoKTsgfX0+XG4gICAgICAgICAgICAgIFx1Qzc3NCBcdUM5QzBcdUM1RUQgXHVEMjJDXHVDNUI0IFx1QkNGNFx1QUUzMCBcdTIxOTJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdUMxMzlcdUMxNTggXHVCMkU4XHVDNzA0IFx1QzVEMFx1QjdFQyBcdUJDMTRcdUM2QjRcdUIzNTRcdUI5QUMgXHUyMDE0IFx1RDU1QyBcdUMxMzlcdUMxNThcdUM3NzQgXHVCOUREXHVBQzAwXHVDODM4XHVCM0M0IFx1QjJFNFx1Qjk3OCBcdUMxMzlcdUMxNThcdUM3NDAgXHVDODE1XHVDMEMxIFx1QjgwQ1x1QjM1NC5cbmNsYXNzIEhvbWVTZWN0aW9uQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVycikge1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tIb21lU2VjdGlvbkJvdW5kYXJ5XScsIHRoaXMucHJvcHMubGFiZWwgfHwgJ3NlY3Rpb24nLCBlcnIpOyB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6ICdIT01FX1NFQ1RJT05fRVJST1InLCBzdGF0dXM6IG51bGwsIGtpbmQ6ICdyZW5kZXInLFxuICAgICAgICBtZXNzYWdlOiBlcnI/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVyciksXG4gICAgICAgIGhpbnQ6IGBzZWN0aW9uPSR7dGhpcy5wcm9wcy5sYWJlbCB8fCAnJ31gLCB1cmw6ICcnLFxuICAgICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsIG9yaWdpbjogbG9jYXRpb24ub3JpZ2luLFxuICAgICAgfSk/LmNhdGNoPy4oKCkgPT4ge30pO1xuICAgIH0gY2F0Y2gge31cbiAgfVxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIC8vIFx1QkIzNFx1Qzc0QyBcdUFDQTlcdUI5QUMgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QzVEMFx1QUM4QyBcdUJFNDggXHVDNzkwXHVCOUFDIFx1QjMwMFx1QzJFMCBcdUFDMDBcdUJDQkNcdUM2QjQgcGxhY2Vob2xkZXIgXHVENTVDIFx1QzkwNFx1QjlDQyBcdUQ0NUNcdUFFMzBcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzZWN0aW9uIHN0eWxlPXt7cGFkZGluZzonMjRweCAwJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB0ZXh0QWxpZ246J2NlbnRlcid9fT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgbGV0dGVyU3BhY2luZzonMC4xOGVtJ319PlxuICAgICAgICAgICAgXHUyNkEwIHt0aGlzLnByb3BzLmxhYmVsIHx8ICdcdUM3NzQgXHVDMTM5XHVDMTU4J30gXHVDNzQ0IFx1QkQ4OFx1QjdFQ1x1QzYyNFx1QzlDMCBcdUJBQkJcdUQ1ODhcdUMyQjVcdUIyQzhcdUIyRTRcbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59XG5cbi8vIFx1Q0Q5NFx1Q0M5QyBcdUM1RUNcdUQ1ODlcdUM5QzAgXHVDMEMxXHVDMTM4IFx1QkFBOFx1QjJFQyBcdTIwMTQgXHVDRTc0XHVCNERDIFx1RDA3NFx1QjlBRCBcdUMyREMgXHVCMzU0IFx1RDA3MCBcdUM3NzRcdUJCRjhcdUM5QzAgKyBcdUM4MDRcdUNDQjQgXHVDMTI0XHVCQTg1ICsgXHVEMERDXHVBREY4ICsgXHVEMjJDXHVDNUI0IFx1QkNGNFx1QUUzMCBDVEEuXG5jb25zdCBSZWNvbW1lbmRhdGlvbkRldGFpbE1vZGFsID0gKHsgcmVjLCBvbkNsb3NlLCBnbyB9KSA9PiB7XG4gIC8vIHYwMC4wNzcgXHUyMDE0IHVzZU1vZGFsR3VhcmQgXHVEMUI1XHVDNzdDIChFU0MgKyBib2R5IHNjcm9sbCBsb2NrICsgcG9wc3RhdGUpLiBcdUM3N0RcdUFFMzAgXHVDODA0XHVDNkE5IFx1MjE5MiBkaXJ0eT1mYWxzZS5cbiAgd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiBmYWxzZSwgb25DbG9zZSwgb25TYXZlRHJhZnQ6IG51bGwsIGxhYmVsOiByZWM/Lm5hbWUgfHwgJ1x1QzVFQ1x1RDU4OVx1QzlDMCBcdUMwQzFcdUMxMzgnIH0pO1xuICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheShyZWMudGFncylcbiAgICA/IHJlYy50YWdzXG4gICAgOiAodHlwZW9mIHJlYy50YWdzID09PSAnc3RyaW5nJyA/IHJlYy50YWdzLnNwbGl0KC9bLFx1MDBCN10vKS5tYXAoKHMpID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBhcmlhLWxhYmVsPXtgJHtyZWMubmFtZSB8fCAnXHVDRDk0XHVDQzlDJ30gXHVDMEMxXHVDMTM4YH1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGluc2V0OjAsIHpJbmRleDoyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6J3JnYmEoMTUsMjMsNDIsMC41NSknLFxuICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgcGFkZGluZzoyMCxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkgb25DbG9zZSgpOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgbWF4V2lkdGg6NzIwLCB3aWR0aDonMTAwJScsIG1heEhlaWdodDonOTJ2aCcsXG4gICAgICAgIG92ZXJmbG93OidhdXRvJywgcG9zaXRpb246J3JlbGF0aXZlJyxcbiAgICAgICAgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbG9zZX0gYXJpYS1sYWJlbD1cIlx1QjJFQlx1QUUzMFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDoxNCwgcmlnaHQ6MTQsIHpJbmRleDoyLFxuICAgICAgICAgICAgd2lkdGg6MzYsIGhlaWdodDozNiwgZm9udFNpemU6MjQsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgIGNvbG9yOid2YXIoLS1pbmspJywgbGluZUhlaWdodDoxLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICB9fT5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAge3JlYy5pbWFnZURhdGFVcmkgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOicxMDAlJywgaGVpZ2h0OjI4MCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGB1cmwoJHtyZWMuaW1hZ2VEYXRhVXJpfSkgY2VudGVyL2NvdmVyYCxcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICB9fS8+XG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOicyOHB4IDI4cHggMjRweCd9fT5cbiAgICAgICAgICB7cmVjLnJlZ2lvbiAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6J2lubGluZS1ibG9jaycsIHBhZGRpbmc6JzRweCAxMHB4JyxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBtYXJnaW5Cb3R0b206MTQsXG4gICAgICAgICAgICB9fT57cmVjLnJlZ2lvbn08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZTozMiwgZm9udFdlaWdodDo3MDAsXG4gICAgICAgICAgICBjb2xvcjondmFyKC0taW5rKScsIGxpbmVIZWlnaHQ6MS4yLCBtYXJnaW5Cb3R0b206OCxcbiAgICAgICAgICB9fT57cmVjLm5hbWUgfHwgJ1x1QzgxQ1x1QkFBOSBcdUM1QzZcdUM3NEMnfTwvaDI+XG4gICAgICAgICAge3JlYy5zdWJ0aXRsZSAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMywgZm9udFdlaWdodDo2MDAsXG4gICAgICAgICAgICAgIGNvbG9yOid2YXIoLS1zZWNvbmRhcnkpJywgbGV0dGVyU3BhY2luZzonMC4wNGVtJywgbWFyZ2luQm90dG9tOjE4LFxuICAgICAgICAgICAgfX0+e3JlYy5zdWJ0aXRsZX08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtyZWMuZGVzYyAmJiAoXG4gICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjE1LCBsaW5lSGVpZ2h0OjEuODUsIGNvbG9yOid2YXIoLS1pbmstMiknLCBtYXJnaW5Cb3R0b206MjJ9fT57cmVjLmRlc2N9PC9wPlxuICAgICAgICAgICl9XG4gICAgICAgICAge3RhZ3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo2LCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbToyMn19PlxuICAgICAgICAgICAgICB7dGFncy5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZToxMH19Pnt0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEwLCBmbGV4V3JhcDond3JhcCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgcGFkZGluZ1RvcDoxOH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGRcIiBvbkNsaWNrPXsoKSA9PiB7IGdvKCd0b3VyJyk7IG9uQ2xvc2UoKTsgfX0+XHVDNzc0IFx1QzlDMFx1QzVFRCBcdUQyMkNcdUM1QjQgXHVCQ0Y0XHVBRTMwIFx1MjE5MjwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXtvbkNsb3NlfT5cdUIyRUJcdUFFMzA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIHYwMC4wNzIgXHUyMDE0IFx1RDY0OCBcdUNFNzRcdUI0RENcdUM3NTggZGVzY3JpcHRpb24gLyBub3RlIFx1Qjk3QyBcdUM5RTdcdUFDOEMgXHVDNzkwXHVCOTc0XHVCMjk0IFx1RDVFQ1x1RDM3Qy5cbi8vIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUJDRjRcdUFDRTA6IFwiXHVENjQ4XHVDNUQwIFx1QjE3OFx1Q0Q5Q1x1QjQxOFx1QjI5NFx1QUM3NCBcdUM4MDFcdUIyRjlcdUQ3ODggXHVDOTA0XHVDNzc0XHVBQzcwXHVCMDk4IFx1RDY0OFx1QzZBOVx1QzczQ1x1Qjg1QyBcdUI1MzBcdUI4NUMgXHVBRTAwXHVDNzQ0IFx1QzRGMFx1QUM4QyBcdUQ1NzRcdUM1N0NcdUM5QzBcIiBcdTIwMTQgXHVDNkIwXHVDMTIwIHRydW5jYXRlLlxuLy8gXHVDOTA0XHVCQzE0XHVBRkM4XHVDNzQwIFx1QUNGNVx1QkMzMVx1QzczQ1x1Qjg1QyBcdUJDQzBcdUQ2NThcdUQ1NzQgXHVDRTc0XHVCNERDIFx1QjgwOFx1Qzc3NFx1QzU0NFx1QzZDM1x1Qzc3NCBcdUM1NDhcdUM4MTUuIFx1QjJFOFx1QzVCNCBcdUFDQkRcdUFDQzRcdUM1RDAgXHVCOURFXHVDREIwIFx1Qzc5MFx1Qjk3OCBcdUI0QTQgXCJcdTIwMjZcIiBcdUNDQThcdUJEODAuXG5jb25zdCB0cnVuY2F0ZVByZXZpZXcgPSAodGV4dCwgbWF4ID0gMTEwKSA9PiB7XG4gIGNvbnN0IHMgPSBTdHJpbmcodGV4dCB8fCAnJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKTtcbiAgaWYgKHMubGVuZ3RoIDw9IG1heCkgcmV0dXJuIHM7XG4gIC8vIFx1QjJFOFx1QzVCNCBcdUFDQkRcdUFDQzRcdUFFNENcdUM5QzAgYmFja3RyYWNrIFx1MjAxNCBcdUQ1NUNcdUFFMDBcdUM3NDAgXHVBQ0Y1XHVCQzMxXHVDNzc0IFx1QzgwMVx1QzVCNCBiYWNrdHJhY2sgXHVDMkU0XHVEMzI4XHVENTU4XHVCQTc0IFx1QURGOFx1QjBFNSBcdUM3OTBcdUI5NzRcdUFFMzAuXG4gIGNvbnN0IHNsaWNlID0gcy5zbGljZSgwLCBtYXgpO1xuICBjb25zdCBsYXN0U3BhY2UgPSBzbGljZS5sYXN0SW5kZXhPZignICcpO1xuICBjb25zdCBjdXQgPSBsYXN0U3BhY2UgPiBtYXggKiAwLjYgPyBzbGljZS5zbGljZSgwLCBsYXN0U3BhY2UpIDogc2xpY2U7XG4gIHJldHVybiBjdXQgKyAnXHUyMDI2Jztcbn07XG5cbi8vIHYwMC4xMDYgXHUyMDE0IFx1RDY0OCBcdUQ3ODhcdUM1QjRcdUI4NUNcdUM3NTggXHVDOUMwXHVCM0M0IFx1Qzc5MFx1QjlBQy4gXHVCMkU0XHVDNzRDIFx1QUMxNVx1QzVGMCArIFx1QjJFNFx1Qzc0QyBcdUIyRjVcdUMwQUMgXHVCQkY4XHVCMkM4IFx1Q0U3NFx1QjREQy5cbi8vIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM4MUNcdUM1NDggQVx1QzU0ODogJ1x1QUMxNVx1QzVGMC9cdUIyRjVcdUMwQUMgXHVCQkY4XHVCMkM4IFx1Q0U3NFx1QjREQycgKFx1QzZCNFx1QzYwMSBcdUFDMDBcdUNFNTggXHUyMTkxLCBcdUM3QUNcdUJDMjlcdUJCMzggXHVBQzAwXHVDRTU4IFx1MjE5MSkuXG5jb25zdCBIZXJvUHJvZ3JhbUNhcmRzID0gKHsgZ28sIGRhdGFUaWNrIH0pID0+IHtcbiAgLy8gdjAwLjExMCBcdTIwMTQgbW9kdWxlLXNjb3BlIFx1Q0VGNFx1RDNFQ1x1QjEwQ1x1RDJCOFx1QjI5NCBIb21lUGFnZSBcdUM3NTggYGNvbnN0IEcgPSB3aW5kb3cuQkdOSl9HVUFSRDtgIFx1Qjk3QyBcdUMwQUNcdUM2QTkgXHVCQUJCIFx1RDU2OC5cbiAgLy8gd2luZG93LkJHTkpfR1VBUkQgXHVCOTdDIFx1QzlDMVx1QzgxMSBcdUNDMzhcdUM4NzAgKyBcdUM1NDhcdUM4MDRcdUQ1NUMgXHVEM0Y0XHVCQzMxLlxuICBjb25zdCBfYXJyID0gKGZuKSA9PiB7XG4gICAgdHJ5IHsgY29uc3QgdiA9IGZuKCk7IHJldHVybiBBcnJheS5pc0FycmF5KHYpID8gdiA6IFtdOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9XG4gIH07XG4gIC8vIHYwMC4xMTUgXHUyMDE0IHN0YXJ0c0F0IFx1QUMwMCBpbnZhbGlkIFx1RDU1QyByb3cgXHVBQzAwIHNvcnQgXHVDNUQwIFx1QjRFNFx1QzVCNFx1QUMwMFx1QkE3NCBcdUFDQjBcdUFDRkMgXHVDMjFDXHVDMTFDXHVBQzAwIFx1Qzc4NFx1Qzc1OFx1Qjg1QyBcdUFFNjhcdUM5RDAuXG4gIC8vIFx1RDU1QyBcdUJDODggXHVCMzU0IERhdGUucGFyc2UgIWlzTmFOIFx1Qjg1QyBcdUFDNzBcdUI5NzggXHVCNEE0IHNvcnQuXG4gIGNvbnN0IF92YWxpZFN0YXJ0cyA9IChsKSA9PiB7XG4gICAgaWYgKCFsIHx8IGwuaGlkZGVuIHx8ICFsLnN0YXJ0c0F0KSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuICFpc05hTihEYXRlLnBhcnNlKGwuc3RhcnRzQXQpKTtcbiAgfTtcbiAgLy8gdjAwLjEyOSBcdTIwMTQgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QzY5NFx1Q0NBRCAnXHVDOUM0XHVENTg5IFx1QzYwOFx1QzgxNSBcdUFDMTVcdUM1RjBcdUM3NzQgXHVDNUM2XHVDNzNDXHVCQTc0IFx1QzlDMFx1QjA5QyBcdUFDMTVcdUM1RjBcdUM3NDQgXHVCMTc4XHVDRDlDICgzXHVBQzFDIFx1Qzc3NFx1QjBCNCknLlxuICAvLyAxKSBcdUM1QjRcdUM4MUMgXHVDNzc0XHVENkM0IFx1QUMxNVx1QzVGMCBcdUM2QjBcdUMxMjAuIDIpIFx1QzVDNlx1QzczQ1x1QkE3NCBcdUFDMDBcdUM3QTUgXHVDRDVDXHVBREZDIFx1QzlDMFx1QjA5QyBcdUFDMTVcdUM1RjAgM1x1QUMxQ1x1Qjg1QyBcdUQzRjRcdUJDMzEuXG4gIGNvbnN0IGxlY3R1cmVzID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgYWxsID0gX2FycigoKSA9PiB3aW5kb3cuQkdOSl9MRUNUVVJFUz8ubGlzdEFsbD8uKCkpXG4gICAgICAuZmlsdGVyKF92YWxpZFN0YXJ0cyk7XG4gICAgY29uc3QgY3V0b2ZmID0gRGF0ZS5ub3coKSAtIDg2NDAwMDAwO1xuICAgIGNvbnN0IHVwY29taW5nID0gYWxsXG4gICAgICAuZmlsdGVyKChsKSA9PiBuZXcgRGF0ZShsLnN0YXJ0c0F0KS5nZXRUaW1lKCkgPj0gY3V0b2ZmKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGEuc3RhcnRzQXQpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGIuc3RhcnRzQXQpLmdldFRpbWUoKSk7XG4gICAgaWYgKHVwY29taW5nLmxlbmd0aCA+IDApIHJldHVybiB1cGNvbWluZztcbiAgICAvLyBmYWxsYmFjayBcdTIwMTQgXHVBQzAwXHVDN0E1IFx1Q0Q1Q1x1QURGQyBcdUM5QzBcdUIwOUMgXHVBQzE1XHVDNUYwIDNcdUFDMUMgKG5ld2VzdC1maXJzdCkuXG4gICAgcmV0dXJuIGFsbFxuICAgICAgLmZpbHRlcigobCkgPT4gbmV3IERhdGUobC5zdGFydHNBdCkuZ2V0VGltZSgpIDwgY3V0b2ZmKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGIuc3RhcnRzQXQpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGEuc3RhcnRzQXQpLmdldFRpbWUoKSlcbiAgICAgIC5zbGljZSgwLCAzKTtcbiAgfSwgW2RhdGFUaWNrXSk7XG4gIGNvbnN0IHRvdXJzID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIF9hcnIoKCkgPT4gd2luZG93LkJHTkpfVE9VUlM/Lmxpc3RBbGw/LigpKVxuICAgICAgLmZpbHRlcihfdmFsaWRTdGFydHMpXG4gICAgICAuc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYS5zdGFydHNBdCkuZ2V0VGltZSgpIC0gbmV3IERhdGUoYi5zdGFydHNBdCkuZ2V0VGltZSgpKVxuICAgICAgLmZpbHRlcigodCkgPT4gbmV3IERhdGUodC5zdGFydHNBdCkuZ2V0VGltZSgpID49IERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gIH0sIFtkYXRhVGlja10pO1xuXG4gIGNvbnN0IG5leHRMZWN0dXJlID0gbGVjdHVyZXNbMF07XG4gIGNvbnN0IG5leHRUb3VyID0gdG91cnNbMF07XG4gIC8vIHYwMC4xMjkgXHUyMDE0IFx1QUMxNVx1QzVGMFx1Qzc3NCBmYWxsYmFjayAoXHVDOUMwXHVCMDlDIFx1QUMxNVx1QzVGMCBcdUIxNzhcdUNEOUMgXHVCQUE4XHVCNERDKSBcdUM3NzhcdUM5QzAgXHVEMzEwXHVDODE1LiBuZXh0TGVjdHVyZS5zdGFydHNBdCBcdUFDMDAgXHVDNUI0XHVDODFDXHVCQ0Y0XHVCMkU0IFx1QUNGQ1x1QUM3MFx1QkE3NCBwYXN0IG1vZGUuXG4gIGNvbnN0IGxlY3R1cmVJc1Bhc3QgPSBuZXh0TGVjdHVyZSAmJiBuZXh0TGVjdHVyZS5zdGFydHNBdCAmJlxuICAgIChuZXcgRGF0ZShuZXh0TGVjdHVyZS5zdGFydHNBdCkuZ2V0VGltZSgpIDwgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcblxuICAvLyB2MDAuMTEwIFx1MjAxNCBcdUMyRENcdUFDMDQgXHVENDVDXHVDMkRDXHVCMjk0IFx1QzBBQ1x1Qzc3NFx1RDJCOCBcdUM4MDRcdUJDMTggS1NUIFx1QUUzMFx1QzkwMC4gQkdOSl9GTVQua3N0RnJpZW5kbHkgXHVDMEFDXHVDNkE5LlxuICBjb25zdCBmbXREYXRlID0gKGlzbykgPT4ge1xuICAgIGlmICghaXNvKSByZXR1cm4gJyc7XG4gICAgaWYgKHdpbmRvdy5CR05KX0ZNVD8ua3N0RnJpZW5kbHkpIHJldHVybiB3aW5kb3cuQkdOSl9GTVQua3N0RnJpZW5kbHkoaXNvKTtcbiAgICAvLyBcdUQzRjRcdUJDMzEgKEJHTkpfRk1UIFx1QkJGOFx1Qjg1Q1x1QjREQyBcdUMyREMpXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKGlzbyk7XG4gICAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IGRvdyA9IFsnXHVDNzdDJywnXHVDNkQ0JywnXHVENjU0JywnXHVDMjE4JywnXHVCQUE5JywnXHVBRTA4JywnXHVEMUEwJ11bZC5nZXREYXkoKV07XG4gICAgcmV0dXJuIGAke2QuZ2V0TW9udGgoKSsxfS4ke3BhZChkLmdldERhdGUoKSl9ICgke2Rvd30pICR7cGFkKGQuZ2V0SG91cnMoKSl9OiR7cGFkKGQuZ2V0TWludXRlcygpKX1gO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2dyaWQnLCBnYXA6MTR9fT5cbiAgICAgIHsvKiBcdUIyRTRcdUM3NEMgXHVBQzE1XHVDNUYwIFx1Q0U3NFx1QjREQyAqL31cbiAgICAgIDxhcnRpY2xlXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHsgaWYgKG5leHRMZWN0dXJlKSBnbygnbGVjdHVyZXMnKTsgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOicyMHB4IDIycHgnLCBjdXJzb3I6IG5leHRMZWN0dXJlID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnLFxuICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIHRyYW5zaXRpb246J2FsbCAwLjE1cycsXG4gICAgICAgIH19XG4gICAgICAgIHJvbGU9e25leHRMZWN0dXJlID8gJ2J1dHRvbicgOiB1bmRlZmluZWR9XG4gICAgICAgIHRhYkluZGV4PXtuZXh0TGVjdHVyZSA/IDAgOiB1bmRlZmluZWR9XG4gICAgICAgIG9uS2V5RG93bj17KGUpID0+IHsgaWYgKG5leHRMZWN0dXJlICYmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IGdvKCdsZWN0dXJlcycpOyB9IH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCwgbGV0dGVyU3BhY2luZzonMC4yNGVtJywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToxMH19PlxuICAgICAgICAgIHtsZWN0dXJlSXNQYXN0ID8gJ1JFQ0VOVCBMRUNUVVJFIFx1MDBCNyBcdUNENUNcdUFERkMgXHVBQzE1XHVDNUYwJyA6ICdORVhUIExFQ1RVUkUgXHUwMEI3IFx1QjJFNFx1Qzc0QyBcdUFDMTVcdUM1RjAnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge25leHRMZWN0dXJlID8gKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIwLCBtYXJnaW5Cb3R0b206OCwgY29sb3I6J3ZhcigtLWluayknfX0+e25leHRMZWN0dXJlLnRvcGljIHx8IG5leHRMZWN0dXJlLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonYmFzZWxpbmUnLCBmbGV4V3JhcDond3JhcCcsIGdhcDoxMH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NjAwfX0+e2ZtdERhdGUobmV4dExlY3R1cmUuc3RhcnRzQXQpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEyfX0+e25leHRMZWN0dXJlLnZlbnVlIHx8ICdcdUM3QTVcdUMxOEMgXHVCQkY4XHVDODE1J308L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgbWFyZ2luOjB9fT5cbiAgICAgICAgICAgIFx1QzYwOFx1QzgxNVx1QjQxQyBcdUFDMTVcdUM1RjBcdUM3NzQgXHVDNTQ0XHVDOUMxIFx1QzVDNlx1QzJCNVx1QjJDOFx1QjJFNC4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0IGdvbGRcIiBvbkNsaWNrPXsoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBnbygnbGVjdHVyZXMnKTsgfX0+XHVDODA0XHVDQ0I0IFx1QUMxNVx1QzVGMCBcdUJDRjRcdUFFMzAgXHUyMTkyPC9idXR0b24+XG4gICAgICAgICAgPC9wPlxuICAgICAgICApfVxuICAgICAgPC9hcnRpY2xlPlxuXG4gICAgICB7LyogXHVCMkU0XHVDNzRDIFx1QjJGNVx1QzBBQyBcdUNFNzRcdUI0REMgKi99XG4gICAgICA8YXJ0aWNsZVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IGlmIChuZXh0VG91cikgZ28oJ3RvdXInKTsgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOicyMHB4IDIycHgnLCBjdXJzb3I6IG5leHRUb3VyID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnLFxuICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIHRyYW5zaXRpb246J2FsbCAwLjE1cycsXG4gICAgICAgIH19XG4gICAgICAgIHJvbGU9e25leHRUb3VyID8gJ2J1dHRvbicgOiB1bmRlZmluZWR9XG4gICAgICAgIHRhYkluZGV4PXtuZXh0VG91ciA/IDAgOiB1bmRlZmluZWR9XG4gICAgICAgIG9uS2V5RG93bj17KGUpID0+IHsgaWYgKG5leHRUb3VyICYmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IGdvKCd0b3VyJyk7IH0gfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjI0ZW0nLCBjb2xvcjondmFyKC0taW5rLTIpJywgbWFyZ2luQm90dG9tOjEwfX0+XG4gICAgICAgICAgTkVYVCBUT1VSIFx1MDBCNyBcdUIyRTRcdUM3NEMgXHVCMkY1XHVDMEFDXG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7bmV4dFRvdXIgPyAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjAsIG1hcmdpbkJvdHRvbTo4LCBjb2xvcjondmFyKC0taW5rKSd9fT57bmV4dFRvdXIudGl0bGV9PC9oMz5cbiAgICAgICAgICAgIHtuZXh0VG91ci5zdWJ0aXRsZSAmJiAoXG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMywgbWFyZ2luQm90dG9tOjgsIGZvbnRTdHlsZTonaXRhbGljJ319PntuZXh0VG91ci5zdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2Jhc2VsaW5lJywgZmxleFdyYXA6J3dyYXAnLCBnYXA6MTB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZC0yIG1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBmb250V2VpZ2h0OjYwMH19PntmbXREYXRlKG5leHRUb3VyLnN0YXJ0c0F0KX08L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMn19PlxuICAgICAgICAgICAgICAgIHtuZXh0VG91ci5sZXZlbCAmJiA8c3BhbiBzdHlsZT17e21hcmdpblJpZ2h0Ojh9fT57bmV4dFRvdXIubGV2ZWx9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICB7bmV4dFRvdXIuZHVyYXRpb259XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGxpbmVIZWlnaHQ6MS43LCBtYXJnaW46MH19PlxuICAgICAgICAgICAgXHVDNjA4XHVDODE1XHVCNDFDIFx1QjJGNVx1QzBBQ1x1QUMwMCBcdUM1NDRcdUM5QzEgXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3QgZ29sZFwiIG9uQ2xpY2s9eyhlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IGdvKCd0b3VyJyk7IH19Plx1QzgwNFx1Q0NCNCBcdUIyRjVcdUMwQUMgXHVCQ0Y0XHVBRTMwIFx1MjE5MjwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgKX1cbiAgICAgIDwvYXJ0aWNsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIHYwMC4xNTIgXHUyMDE0IFx1RDY0OCBcdUNDNDUgQ1RBIFx1QjJFNFx1QUQ4QyBcdUNFNzRcdUI4RThcdUMxNDAuIHYwMC4xNTEgXHVCMkU4XHVDNzdDLVx1Q0M0NSBJSUZFIFx1Qjk3QyBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjhcdUQ2NTQgKyBcdUM4OENcdUM2QjAgXHVCQjM0XHVENTVDIHdyYXAgKyBhdXRvcGxheS5cbi8vIFx1QjM3MFx1Qzc3NFx1RDEzMCBcdUMxOENcdUMyQTQ6IEJHTkpfQk9PS1MubGlzdCh7c3RhdHVzOidwdWJsaXNoZWQnfSkuIFx1QzgxNVx1QjgyQzogcHJpbWFyeSBcdUM2QjBcdUMxMjAgXHUyMTkyIG9yZGVyLiAwXHVBRDhDXHVDNzc0XHVCQTc0IFx1QzEzOVx1QzE1OCBoaWRlLlxuY29uc3QgQm9va0Nhcm91c2VsU2VjdGlvbiA9ICh7IGdvLCBkYXRhVGljayB9KSA9PiB7XG4gIGNvbnN0IF9hcnIgPSAoZm4pID0+IHsgdHJ5IHsgY29uc3QgdiA9IGZuKCk7IHJldHVybiBBcnJheS5pc0FycmF5KHYpID8gdiA6IFtdOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH07XG4gIC8vIGFkbWluIFx1Qzc1OCBcdUNDNDUgXHVCQ0MwXHVBQ0JEXHVDNzQ0IFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2OCBcdUM1QzZcdUM3NzQgXHVDOTg5XHVDMkRDIFx1QkMxOFx1QzYwMS4gZGF0YVRpY2sgKyBiZ25qLWJvb2tzLXJlZnJlc2ggXHVCNDU4IFx1QjJFNCBcdUNDQURcdUNERTguXG4gIGNvbnN0IFtib29rVGljaywgc2V0Qm9va1RpY2tdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25SID0gKCkgPT4gc2V0Qm9va1RpY2soKHYpID0+IHYgKyAxKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1ib29rcy1yZWZyZXNoJywgb25SKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotYm9va3MtcmVmcmVzaCcsIG9uUik7XG4gIH0sIFtdKTtcbiAgY29uc3QgYm9va3MgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBhbGwgPSBfYXJyKCgpID0+IHdpbmRvdy5CR05KX0JPT0tTPy5saXN0Py4oeyBzdGF0dXM6ICdwdWJsaXNoZWQnIH0pKTtcbiAgICByZXR1cm4gYWxsLnNsaWNlKCkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEucHJpbWFyeSAmJiAhYi5wcmltYXJ5KSByZXR1cm4gLTE7XG4gICAgICBpZiAoIWEucHJpbWFyeSAmJiBiLnByaW1hcnkpIHJldHVybiAxO1xuICAgICAgcmV0dXJuIChhLm9yZGVyID8/IDApIC0gKGIub3JkZXIgPz8gMCk7XG4gICAgfSk7XG4gIH0sIFtkYXRhVGljaywgYm9va1RpY2tdKTtcblxuICBjb25zdCBbaWR4LCBzZXRJZHhdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtwYXVzZWQsIHNldFBhdXNlZF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIC8vIFx1Q0M0NSBcdUJBQTlcdUI4NUQgXHVBRTM4XHVDNzc0IFx1QkNDMFx1QjNEOSBcdUMyREMgaWR4IFx1QzdBQ1x1QzgxNVx1QjgyQy5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYm9va3MubGVuZ3RoID4gMCAmJiBpZHggPj0gYm9va3MubGVuZ3RoKSBzZXRJZHgoMCk7XG4gIH0sIFtib29rcy5sZW5ndGgsIGlkeF0pO1xuXG4gIGNvbnN0IHdyYXAgPSAobikgPT4gYm9va3MubGVuZ3RoID09PSAwID8gMCA6IChuICsgYm9va3MubGVuZ3RoKSAlIGJvb2tzLmxlbmd0aDtcbiAgY29uc3QgZ29QcmV2ID0gKCkgPT4gc2V0SWR4KChpKSA9PiB3cmFwKGkgLSAxKSk7XG4gIGNvbnN0IGdvTmV4dCA9ICgpID0+IHNldElkeCgoaSkgPT4gd3JhcChpICsgMSkpO1xuXG4gIC8vIGF1dG9wbGF5IDdzIFx1MjAxNCAyXHVBRDhDIFx1Qzc3NFx1QzBDMSArIGhvdmVyIFx1QzgxNVx1QzlDMCBcdUM1NDRcdUIyRDAgXHVCNTRDXHVCOUNDLlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChib29rcy5sZW5ndGggPCAyIHx8IHBhdXNlZCkgcmV0dXJuO1xuICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHNldElkeCgoaSkgPT4gd3JhcChpICsgMSkpLCA3MDAwKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHQpO1xuICB9LCBbaWR4LCBib29rcy5sZW5ndGgsIHBhdXNlZF0pO1xuXG4gIGlmIChib29rcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICBjb25zdCBzaG93Q2hyb21lID0gYm9va3MubGVuZ3RoID4gMTtcblxuICAvLyB2MDAuMTYyIFx1MjAxNCBcdUIyRThcdUM3N0MgXHVDQzQ1IFx1Q0U3NFx1QjREQyBcdUI4MENcdUIzNTQgKHNsaWRlIGxheWVyIFx1QzU0OFx1QzVEMFx1QzExQyBcdUQ2MzhcdUNEOUMpLlxuICBjb25zdCByZW5kZXJCb29rQ2FyZCA9IChiKSA9PiB7XG4gICAgY29uc3QgaGFzUHJpY2VLUiA9IE51bWJlcihiLnByaWNlS1IpID4gMDtcbiAgICBjb25zdCBoYXNQcmljZUVOID0gTnVtYmVyKGIucHJpY2VFTikgPiAwO1xuICAgIGNvbnN0IHlyID0gYi5wdWJsaXNoZWRBdCA/IG5ldyBEYXRlKGIucHVibGlzaGVkQXQpLmdldEZ1bGxZZWFyKCkgOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBjdGEtZ3JpZFwiIHN0eWxlPXt7XG4gICAgICAgIHBhZGRpbmc6JzcycHggNjBweCcsXG4gICAgICAgIGRpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxZnIgMWZyJywgZ2FwOjYwLCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCI+XHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0Q5Q1x1RDMxMCBcdTAwQjcge3lyfTwvZGl2PlxuICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZTonY2xhbXAoMzZweCwgNHZ3LCA1MnB4KScsXG4gICAgICAgICAgICBmb250V2VpZ2h0OjYwMCwgbGluZUhlaWdodDoxLjEsIG1hcmdpbkJvdHRvbTogYi5zdWJ0aXRsZSA/IDggOiAxNixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIFx1MzAwRXtiLnRpdGxlfVx1MzAwRlxuICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgey8qIHYwMC4xNjIgXHUyMDE0IFx1RDU1QyBcdUM5MDQgXHVDMThDXHVBQzFDIChzdWJ0aXRsZSkuIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM2OTRcdUNDQUQgJ1x1RDU1Q1x1QzkwNFx1QzE4Q1x1QUMxQ1x1QUMwMCBcdUJDRjRcdUM3NzRcdUFDOEMnLiAqL31cbiAgICAgICAgICB7Yi5zdWJ0aXRsZSAmJiAoXG4gICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LXNlcmlmKScsIGZvbnRTaXplOjE4LCBmb250U3R5bGU6J2l0YWxpYycsXG4gICAgICAgICAgICAgIGNvbG9yOid2YXIoLS1pbmstMiknLCBtYXJnaW5Cb3R0b206MjAsIGxpbmVIZWlnaHQ6MS41LFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtiLnN1YnRpdGxlfVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICl9XG4gICAgICAgICAge2IuZGVzYyAmJiAoXG4gICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjE1LCBsaW5lSGVpZ2h0OjEuODUsIGNvbG9yOid2YXIoLS1pbmstMiknLCBtYXJnaW5Cb3R0b206MjgsIHdoaXRlU3BhY2U6J3ByZS13cmFwJ319PlxuICAgICAgICAgICAgICB7Yi5kZXNjfVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICl9XG4gICAgICAgICAgeyhoYXNQcmljZUtSIHx8IGhhc1ByaWNlRU4pICYmIChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjIwLCBtYXJnaW5Cb3R0b206MzIsIGFsaWduSXRlbXM6J2ZsZXgtZW5kJ319PlxuICAgICAgICAgICAgICB7aGFzUHJpY2VLUiAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBjb2xvcjondmFyKC0taW5rLTMpJ319Plx1QUQ2RFx1QkIzOFx1RDMxMDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjIsIG1hcmdpblRvcDo0LCBjb2xvcjondmFyKC0taW5rKScsIGZvbnRXZWlnaHQ6NzAwfX0+e051bWJlcihiLnByaWNlS1IpLnRvTG9jYWxlU3RyaW5nKCl9XHVDNkQwPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHtoYXNQcmljZUtSICYmIGhhc1ByaWNlRU4gJiYgPGRpdiBzdHlsZT17e3dpZHRoOjEsIGJhY2tncm91bmQ6J3ZhcigtLWxpbmUtMiknLCBhbGlnblNlbGY6J3N0cmV0Y2gnfX0vPn1cbiAgICAgICAgICAgICAge2hhc1ByaWNlRU4gJiYgKFxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCwgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0zKSd9fT5cdUM2MDFcdUJCMzhcdUQzMTA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIyLCBtYXJnaW5Ub3A6NCwgY29sb3I6J3ZhcigtLWluayknLCBmb250V2VpZ2h0OjcwMH19PntOdW1iZXIoYi5wcmljZUVOKS50b0xvY2FsZVN0cmluZygpfVx1QzZEMDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZFwiIG9uQ2xpY2s9eygpID0+IGdvKCdib29rJyl9Plx1QUQ2Q1x1QjlFNFx1RDU1OFx1QUUzMCBcdTIxOTI8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBhc3BlY3RSYXRpbzonMy80JywgbWF4V2lkdGg6MjgwLCBtYXJnaW46JzAgYXV0bycsXG4gICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsXG4gICAgICAgICAgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIG92ZXJmbG93OidoaWRkZW4nLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7Yi5jb3ZlckRhdGFVcmkgPyAoXG4gICAgICAgICAgICA8aW1nIHNyYz17Yi5jb3ZlckRhdGFVcml9IGFsdD17YCR7Yi50aXRsZX0gXHVENDVDXHVDOUMwYH1cbiAgICAgICAgICAgICAgc3R5bGU9e3t3aWR0aDonMTAwJScsIGhlaWdodDonMTAwJScsIG9iamVjdEZpdDonY292ZXInLCBkaXNwbGF5OidibG9jayd9fS8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3t0ZXh0QWxpZ246J2NlbnRlcicsIHBhZGRpbmc6JzAgMjRweCd9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MjgsIGNvbG9yOid2YXIoLS1pbmspJywgbWFyZ2luQm90dG9tOjEwLCBmb250V2VpZ2h0OjYwMH19PntiLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjksIGZvbnRXZWlnaHQ6NjAwLCBjb2xvcjondmFyKC0taW5rLTMpJywgbGV0dGVyU3BhY2luZzonMC4yZW0nfX0+e2IuYXV0aG9yIHx8ICdcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAnfSBcdUM5QzBcdUM3NEM8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxIb21lU2VjdGlvbkJvdW5kYXJ5IGxhYmVsPVwiXHVDQzQ1IENUQVwiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb25cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldFBhdXNlZCh0cnVlKX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldFBhdXNlZChmYWxzZSl9XG4gICAgICAgICAgc3R5bGU9e3twb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICAgICAgey8qIHYwMC4xNjIgXHUyMDE0IFx1QzJBQ1x1Qjc3Q1x1Qzc3NFx1QjREQyBcdUI4MDhcdUM3NzRcdUM1QjQuIFx1QkFBOFx1QjRFMCBib29rcyBcdUI5N0MgbGF5ZXJlZCBcdUI4NUMgXHVCODBDXHVCMzU0LCBhY3RpdmUgXHVCOUNDIG9wYWNpdHkgMSArIHRyYW5zbGF0ZVggMC5cbiAgICAgICAgICAgICAganVtcCBcdUM1QzZcdUIyOTQgXHVCRDgwXHVCNERDXHVCN0VDXHVDNkI0IGNyb3NzZmFkZS1zbGlkZS4gXHVDQ0FCIFx1Q0M0NVx1QjlDQyByZWxhdGl2ZSBcdUI4NUMgd3JhcHBlciBcdUIxOTJcdUM3NzQgXHVCQ0Y0XHVDODc0LiAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246J3JlbGF0aXZlJ319PlxuICAgICAgICAgICAge2Jvb2tzLm1hcCgoYiwgaSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBhY3RpdmUgPSBpID09PSBpZHg7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e2IuaWQgfHwgaX1cbiAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPXthY3RpdmUgPyB1bmRlZmluZWQgOiAndHJ1ZSd9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogaSA9PT0gMCA/ICdyZWxhdGl2ZScgOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBhY3RpdmUgPyAxIDogMCxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBhY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgICA/ICd0cmFuc2xhdGVYKDApJ1xuICAgICAgICAgICAgICAgICAgICAgIDogKGkgPCBpZHggPyAndHJhbnNsYXRlWCgtMjRweCknIDogJ3RyYW5zbGF0ZVgoMjRweCknKSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgLjU1cyBlYXNlLCB0cmFuc2Zvcm0gLjU1cyBlYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogYWN0aXZlID8gJ2F1dG8nIDogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICB7cmVuZGVyQm9va0NhcmQoYil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHtzaG93Q2hyb21lICYmIChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtbGFiZWw9XCJcdUM3NzRcdUM4MDQgXHVDQzQ1XCIgb25DbGljaz17Z29QcmV2fVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCBsZWZ0Oi04LCB0b3A6JzUwJScsIHRyYW5zZm9ybTondHJhbnNsYXRlKC0xMDAlLCAtNTAlKScsXG4gICAgICAgICAgICAgICAgICB3aWR0aDo0NCwgaGVpZ2h0OjQ0LCBib3JkZXJSYWRpdXM6JzUwJScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGNvbG9yOid2YXIoLS1pbmspJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBwbGFjZUl0ZW1zOidjZW50ZXInLCBmb250U2l6ZToyMiwgZm9udFdlaWdodDo2MDAsIGxpbmVIZWlnaHQ6MSxcbiAgICAgICAgICAgICAgICB9fT5cdTIwMzk8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1sYWJlbD1cIlx1QjJFNFx1Qzc0QyBcdUNDNDVcIiBvbkNsaWNrPXtnb05leHR9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHJpZ2h0Oi04LCB0b3A6JzUwJScsIHRyYW5zZm9ybTondHJhbnNsYXRlKDEwMCUsIC01MCUpJyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOjQ0LCBoZWlnaHQ6NDQsIGJvcmRlclJhZGl1czonNTAlJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgY29sb3I6J3ZhcigtLWluayknLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIGZvbnRTaXplOjIyLCBmb250V2VpZ2h0OjYwMCwgbGluZUhlaWdodDoxLFxuICAgICAgICAgICAgICAgIH19Plx1MjAzQTwvYnV0dG9uPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge3Nob3dDaHJvbWUgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J2NlbnRlcicsIGdhcDo4LCBtYXJnaW5Ub3A6MTh9fT5cbiAgICAgICAgICAgIHtib29rcy5tYXAoKGIsIGkpID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2IuaWQgfHwgaX0gdHlwZT1cImJ1dHRvblwiIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODhcdUM5RjggXHVDQzQ1XHVDNzNDXHVCODVDIFx1Qzc3NFx1QjNEOWB9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SWR4KGkpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICB3aWR0aDogaSA9PT0gaWR4ID8gMjQgOiA4LCBoZWlnaHQ6IDgsIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDQsIGJvcmRlcjogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGkgPT09IGlkeCA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0tbGluZS0yKScsXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuMnMnLFxuICAgICAgICAgICAgICAgIH19Lz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgKTtcbn07XG5cbmNvbnN0IEhvbWVQYWdlID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBbbWFwT3Blbiwgc2V0TWFwT3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzY1RpY2ssIHNldFNjVGlja10gPSBSZWFjdC51c2VTdGF0ZSgwKTtcbiAgY29uc3QgW2RhdGFUaWNrLCBzZXREYXRhVGlja10gPSBSZWFjdC51c2VTdGF0ZSgwKTtcblxuICAvLyBTRU8vSGVyby9CcmFuZCByZWZyZXNoIFx1MjAxNCBcdUM5ODlcdUMyREMgXHVDN0FDXHVCODBDXHVCMzU0XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25SID0gKCkgPT4gc2V0U2NUaWNrKCh2KSA9PiB2ICsgMSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Jnbmotc2l0ZS1jb250ZW50LXJlZnJlc2gnLCBvblIpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmduai1zaXRlLWNvbnRlbnQtcmVmcmVzaCcsIG9uUik7XG4gIH0sIFtdKTtcblxuICAvLyBcdUMxMUNcdUJDODQgXHVCMzcwXHVDNzc0XHVEMTMwIHJlZnJlc2ggXHVDNzc0XHVCQ0E0XHVEMkI4IFx1MjAxNCBcdUMyRTRcdUM4MUMgXHVCQzFDXHVENjU0IFx1Qzc3NFx1Qjk4NFx1QUNGQyBcdUM3N0NcdUNFNTggKGRhdGEuanMgXHVDQzM4XHVBQ0UwKS5cbiAgLy8gYmduai1wb3N0cy1yZWZyZXNoOiBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVBQzhDXHVDMkRDXHVBRTAwIC8gYmduai1jb2x1bW5zLXJlZnJlc2g6IFx1Q0U3Q1x1QjdGQyAvIGJnbmotdG91cnMtcmVmcmVzaDogXHVCMkY1XHVDMEFDIC8gYmduai1sZWN0dXJlcy1yZWZyZXNoOiBcdUFDMTVcdUM1RjAgLyBiZ25qLXNpdGUtY29udGVudC1yZWZyZXNoOiBcdUNEOTRcdUNDOUMoXHVDNzc0XHVCQkY4IFx1QzcwNFx1QzVEMFx1QzExQyBsaXN0ZW4pXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgdGljayA9ICgpID0+IHNldERhdGFUaWNrKCh2KSA9PiB2ICsgMSk7XG4gICAgY29uc3QgZXZ0cyA9IFsnYmduai1jb2x1bW5zLXJlZnJlc2gnLCAnYmduai10b3Vycy1yZWZyZXNoJywgJ2JnbmotbGVjdHVyZXMtcmVmcmVzaCcsICdiZ25qLXBvc3RzLXJlZnJlc2gnXTtcbiAgICBldnRzLmZvckVhY2goKGUpID0+IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGUsIHRpY2spKTtcbiAgICByZXR1cm4gKCkgPT4gZXZ0cy5mb3JFYWNoKChlKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLCB0aWNrKSk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBzYyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gKHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fSksIFtzY1RpY2tdKTtcbiAgY29uc3QgaGVybyA9IHNjLmhlcm8gfHwge307XG4gIC8vIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUJEODRcdUFFMzAgXHUyMDE0IG1hdGNoTWVkaWEgXHVCQ0MwXHVBQ0JEIFx1QzJEQyBcdUM3OTBcdUIzRDkgXHVDN0FDXHVCODBDXHVCMzU0IChoZXJvU3R5bGUgXHVCM0M0IFx1QUMzMVx1QzJFMCkuXG4gIGNvbnN0IFtpc01vYmlsZSwgc2V0SXNNb2JpbGVdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgIHRyeSB7IHJldHVybiAhISh3aW5kb3cubWF0Y2hNZWRpYSAmJiB3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogNjAwcHgpJykubWF0Y2hlcyk7IH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbiAgfSk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1xID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtYXgtd2lkdGg6IDYwMHB4KScpO1xuICAgICAgY29uc3QgaGFuZGxlciA9IChlKSA9PiBzZXRJc01vYmlsZShlLm1hdGNoZXMpO1xuICAgICAgaWYgKG1xLmFkZEV2ZW50TGlzdGVuZXIpIG1xLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgZWxzZSBpZiAobXEuYWRkTGlzdGVuZXIpIG1xLmFkZExpc3RlbmVyKGhhbmRsZXIpO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKG1xLnJlbW92ZUV2ZW50TGlzdGVuZXIpIG1xLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgICBlbHNlIGlmIChtcS5yZW1vdmVMaXN0ZW5lcikgbXEucmVtb3ZlTGlzdGVuZXIoaGFuZGxlcik7XG4gICAgICB9O1xuICAgIH0gY2F0Y2gge31cbiAgfSwgW10pO1xuICBjb25zdCBoZXJvU3R5bGUgPSBSZWFjdC51c2VNZW1vKFxuICAgICgpID0+ICh3aW5kb3cuQkdOSl9IRVJPX1NUWUxFPy4oaXNNb2JpbGUgPyAnbW9iaWxlJyA6ICdkZXNrdG9wJykgfHwgd2luZG93LkJHTkpfSEVST19TVFlMRV9ERUZBVUxUKSxcbiAgICBbc2NUaWNrLCBpc01vYmlsZV1cbiAgKTtcbiAgY29uc3QgcmVjb21tZW5kYXRpb25zID0gQXJyYXkuaXNBcnJheShzYy5yZWNvbW1lbmRhdGlvbnMpID8gc2MucmVjb21tZW5kYXRpb25zLmZpbHRlcihCb29sZWFuKSA6IFtdO1xuICBjb25zdCBbcmVjRGV0YWlsLCBzZXRSZWNEZXRhaWxdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG5cbiAgLy8gXHVDMkU0XHVCMzcwXHVDNzc0XHVEMTMwXHVCOUNDIFx1MjAxNCBcdUMyRENcdUI0REMgXHVEM0Y0XHVCQzMxIFx1QzgxQ1x1QUM3MC4gXHVCQUE4XHVCNEUwIFx1RDVFQ1x1RDM3QyBcdUQ2MzhcdUNEOUNcdUM3NDAgQkdOSl9HVUFSRC5hcnIgXHVCODVDIHRyeS9jYXRjaCArIEFycmF5IFx1QUMwMFx1QjREQy5cbiAgLy8gdjAwLjExNSBcdTIwMTQgQkdOSl9HVUFSRCBcdUJCRjhcdUI4NUNcdUI0REMgKHNjcmlwdCBcdUI4NUNcdUI0REMgcmFjZSkgXHVDMkRDIFx1Qzc3OFx1Qjc3Q1x1Qzc3OCBmYWxsYmFjayBcdUM3M0NcdUI4NUMgXHVEMzk4XHVDNzc0XHVDOUMwIFx1QUU2OFx1QzlEMCBcdUJDMjlcdUM5QzAuXG4gIGNvbnN0IEcgPSB3aW5kb3cuQkdOSl9HVUFSRCB8fCB7XG4gICAgYXJyOiAoZm4pID0+IHsgdHJ5IHsgY29uc3QgdiA9IGZuKCk7IHJldHVybiBBcnJheS5pc0FycmF5KHYpID8gdiA6IFtdOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH0sXG4gICAgY2FsbDogKGZuLCBmYikgPT4geyB0cnkgeyBjb25zdCB2ID0gZm4oKTsgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/IGZiIDogdjsgfSBjYXRjaCB7IHJldHVybiBmYjsgfSB9LFxuICB9O1xuICAvLyBcdUM3MjBcdUQ2QThcdUQ1NUMgc3RhcnRzQXQoXHVEMzBDXHVDMkYxIFx1QUMwMFx1QjJBNVx1RDU1QyBcdUIwQTBcdUM5REMpIFx1QjlDQyBcdUQxQjVcdUFDRkMgXHUyMDE0IE5hTiBnZXRUaW1lIFx1QzczQ1x1Qjg1QyBzb3J0IFx1QUNCMFx1QUNGQ1x1QUMwMCBcdUFFNjhcdUM5QzBcdUIyOTQgXHVBQzgzIFx1QkMyOVx1QzlDMC5cbiAgY29uc3QgX2hhc1ZhbGlkRGF0ZSA9IChpc28pID0+IHtcbiAgICBpZiAoIWlzbykgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHQgPSBEYXRlLnBhcnNlKGlzbyk7XG4gICAgcmV0dXJuICFpc05hTih0KTtcbiAgfTtcbiAgY29uc3QgcHVibGljQ29sdW1ucyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfQ09MVU1OUz8ubGlzdFB1YmxpYz8uKCkpLCBbZGF0YVRpY2tdKTtcbiAgY29uc3QgZmVhdHVyZWRDb2x1bW4gPSBwdWJsaWNDb2x1bW5zWzBdO1xuICBjb25zdCBzZWNvbmRhcnlDb2x1bW5zID0gcHVibGljQ29sdW1ucy5zbGljZSgxLCA1KTtcbiAgY29uc3QgcmVjZW50UG9zdHMgPSBSZWFjdC51c2VNZW1vKCgpID0+IEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8ubGlzdFBvc3RzPy4oKSkuc2xpY2UoMCwgNCksIFtkYXRhVGlja10pO1xuICBjb25zdCB0b3VycyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfVE9VUlM/Lmxpc3RBbGw/LigpKS5maWx0ZXIoKHQpID0+IHQgJiYgIXQuaGlkZGVuKS5zbGljZSgwLCA0KSwgW2RhdGFUaWNrXSk7XG4gIGNvbnN0IGxlY3R1cmVzID0gUmVhY3QudXNlTWVtbygoKSA9PiBHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9MRUNUVVJFUz8ubGlzdEFsbD8uKCkpLmZpbHRlcigobCkgPT4gbCAmJiAhbC5oaWRkZW4pLnNsaWNlKDAsIDMpLCBbZGF0YVRpY2tdKTtcblxuICAvLyBoZXJvLnN0YXRzIFx1QUMwMCBcdUM3ODhcdUM3M0NcdUJBNzQgXHVDRjU4XHVEMTUwXHVDRTIwKGxhYmVsL3N1Yi92YWx1ZUZhbGxiYWNrKSBcdUI5N0MgXHVBQzcwXHVBRTMwXHVDMTFDLiBcdUIzRDlcdUM4MDEgdmFsdWUoXHVEMjJDXHVDNUI0L1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdUFDMkZcdUMyMTgpIFx1QjI5NCBcdUNGNTRcdUI0REMgXHVDRTIxIFx1QzZCMFx1QzEyMC5cbiAgY29uc3QgaGVyb1N0YXRzID0gQXJyYXkuaXNBcnJheShoZXJvLnN0YXRzKSAmJiBoZXJvLnN0YXRzLmxlbmd0aCA9PT0gMyA/IGhlcm8uc3RhdHMgOiBbXG4gICAgeyBsYWJlbDogJ1x1QzVFQ1x1RDU4OVx1QzlDMCcsICAgc3ViOiAnXHVDOEZDXHVDNjk0IFx1QjJGNVx1QzBBQ1x1QzlDMCBcdUM2QjRcdUM2MDEnLCAgIHZhbHVlRmFsbGJhY2s6ICdcdUM4MDRcdUFENkQnICAgIH0sXG4gICAgeyBsYWJlbDogJ1x1RDIyQ1x1QzVCNCcsICAgICBzdWI6ICdcdUM5QzFcdUM4MTEgXHVBRTMwXHVENjhEIFx1RDUwNFx1Qjg1Q1x1QURGOFx1QjdBOCcsIHZhbHVlRmFsbGJhY2s6ICdcdUM5MDBcdUJFNDQgXHVDOTExJyB9LFxuICAgIHsgbGFiZWw6ICdcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAnLCBzdWI6ICdcdUQ1NjhcdUFFRDggXHVCOUNDXHVCNERDXHVCMjk0IFx1QzVFQ1x1RDU4OScsICAgdmFsdWVGYWxsYmFjazogJ1x1QzZCNFx1QzYwMSBcdUM5MTEnIH0sXG4gIF07XG4gIGNvbnN0IHN0YXRzID0gW1xuICAgIHsgbDogaGVyb1N0YXRzWzBdLmxhYmVsLCB2OiBoZXJvU3RhdHNbMF0udmFsdWVGYWxsYmFjayB8fCAnXHVDODA0XHVBRDZEJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHM6IGhlcm9TdGF0c1swXS5zdWIgfSxcbiAgICB7IGw6IGhlcm9TdGF0c1sxXS5sYWJlbCwgdjogdG91cnMubGVuZ3RoID4gMCA/IGAke3RvdXJzLmxlbmd0aH1cdUFDMUNgIDogKGhlcm9TdGF0c1sxXS52YWx1ZUZhbGxiYWNrIHx8ICdcdUM5MDBcdUJFNDQgXHVDOTExJyksICAgICBzOiBoZXJvU3RhdHNbMV0uc3ViIH0sXG4gICAgeyBsOiBoZXJvU3RhdHNbMl0ubGFiZWwsIHY6IHJlY2VudFBvc3RzLmxlbmd0aCA+IDAgPyBgJHtyZWNlbnRQb3N0cy5sZW5ndGh9K2AgOiAoaGVyb1N0YXRzWzJdLnZhbHVlRmFsbGJhY2sgfHwgJ1x1QzZCNFx1QzYwMSBcdUM5MTEnKSwgczogaGVyb1N0YXRzWzJdLnN1YiB9LFxuICBdO1xuXG4gIGNvbnN0IGNsaWNrYWJsZSA9IChvbkNsaWNrLCBsYWJlbCkgPT4gKHtcbiAgICByb2xlOididXR0b24nLCB0YWJJbmRleDowLCAnYXJpYS1sYWJlbCc6bGFiZWwsIG9uQ2xpY2ssXG4gICAgb25LZXlEb3duOihlKSA9PiB7IGlmIChlLmtleT09PSdFbnRlcid8fGUua2V5PT09JyAnKSB7IGUucHJldmVudERlZmF1bHQoKTsgb25DbGljaygpOyB9IH0sXG4gICAgc3R5bGU6e2N1cnNvcjoncG9pbnRlcid9LFxuICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICB7bWFwT3BlbiAmJiA8RGVzdGluYXRpb25NYXBNb2RhbCBvbkNsb3NlPXsoKSA9PiBzZXRNYXBPcGVuKGZhbHNlKX0gZ289e2dvfS8+fVxuICAgICAge3JlY0RldGFpbCAmJiA8UmVjb21tZW5kYXRpb25EZXRhaWxNb2RhbCByZWM9e3JlY0RldGFpbH0gb25DbG9zZT17KCkgPT4gc2V0UmVjRGV0YWlsKG51bGwpfSBnbz17Z299Lz59XG5cbiAgICAgIHsvKiB2MDAuMTQzIFx1MjAxNCBcdUM2MjRcdUQ1MDggXHVDNTQ4XHVCMEI0IFx1QkMzMFx1QjEwOFx1QjI5NCBib290LmpzeCBcdUI4NUMgXHVDNzc0XHVCM0Q5IChzaXRld2lkZSwgXHVCQTU0XHVCMjc0IFx1QzcwNFx1Q0FCRCkuICovfVxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIEhFUk8gKFx1RDE0RFx1QzJBNFx1RDJCOCArIFx1QzZCMFx1Q0UyMSBcdUM5QzBcdUIzQzQgXHVCQkY4XHVCOUFDXHVCQ0Y0XHVBRTMwLCBcdUJBQThcdUJDMTRcdUM3N0MgMVx1QjJFOCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUQ3ODhcdUM1QjRcdUI4NUNcIj48c2VjdGlvbiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjoncmVsYXRpdmUnLCBvdmVyZmxvdzonaGlkZGVuJyxcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICBwYWRkaW5nOic3MnB4IDAgODhweCcsXG4gICAgICB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8tZ3JpZFwiIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OidncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczonMS4yZnIgMWZyJywgZ2FwOjU2LCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgey8qIFx1Qzg4Q1x1Q0UyMTogXHVEMTREXHVDMkE0XHVEMkI4IFx1MjAxNCBoZXJvU3R5bGUgXHVEMkI4XHVDNzE3KFx1QUQwMFx1QjlBQ1x1Qzc5MCAnXHVENzg4XHVDNUI0XHVCODVDJyBcdUQwRUQpIFx1Qzc3OFx1Qjc3Q1x1Qzc3OCBcdUM4MDFcdUM2QTkgKi99XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7dGV4dEFsaWduOiBoZXJvU3R5bGUudGl0bGUudGV4dEFsaWduIHx8ICdsZWZ0J319PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tZXllYnJvd1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udFNpemU6IGhlcm9TdHlsZS5leWVicm93LmZvbnRTaXplLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5leWVicm93LmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogYCR7aGVyb1N0eWxlLmV5ZWJyb3cubGV0dGVyU3BhY2luZ31lbWAsXG4gICAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtoZXJvU3R5bGUuZXllYnJvdy5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBoZXJvU3R5bGUuZXllYnJvdy50ZXh0VHJhbnNmb3JtIHx8ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8c3Bhbj57aGVyby5leWVicm93IHx8IFwiQkFOR0lOT0pBIFx1MDBCNyBcdUJDNDVcdUFFMzBcdUQwQzBcdUFDRTAgXHVCMTc4XHVDNzkwXCJ9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGgxIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1kaXNwbGF5KScsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IGBjbGFtcCgzNnB4LCA1dncsICR7aGVyb1N0eWxlLnRpdGxlLmZvbnRTaXplfXB4KWAsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLnRpdGxlLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogaGVyb1N0eWxlLnRpdGxlLmxpbmVIZWlnaHQsXG4gICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogYCR7aGVyb1N0eWxlLnRpdGxlLmxldHRlclNwYWNpbmd9ZW1gLFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbToyMixcbiAgICAgICAgICAgICAgICBjb2xvcjpgdmFyKCR7aGVyb1N0eWxlLnRpdGxlLmNvbG9yfSlgLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICB7aGVyby50aXRsZTEgfHwgXCJcdUJDNDVcdUFFMzBcdUQwQzBcdUFDRTBcIn08YnIvPlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7Y29sb3I6YHZhcigke2hlcm9TdHlsZS50aXRsZS5hY2NlbnRDb2xvcn0pYH19PntoZXJvLnRpdGxlMiB8fCBcIlx1RDU1Q1x1QUQ2RFx1Qzc0NFwifTwvc3Bhbj48YnIvPlxuICAgICAgICAgICAgICAgIHtoZXJvLnRpdGxlMyB8fCBcIlx1QjI5MFx1QjA3Q1x1QjJFNFwifVxuICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJiZ25qLW11bHRpbGluZVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udFNpemU6IGhlcm9TdHlsZS5zdWJ0aXRsZS5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiBoZXJvU3R5bGUuc3VidGl0bGUubGluZUhlaWdodCxcbiAgICAgICAgICAgICAgICBjb2xvcjogYHZhcigke2hlcm9TdHlsZS5zdWJ0aXRsZS5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogaGVyb1N0eWxlLnN1YnRpdGxlLm1heFdpZHRoLFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTozMixcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBoZXJvU3R5bGUuc3VidGl0bGUuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiBoZXJvU3R5bGUudGl0bGUudGV4dEFsaWduID09PSAnY2VudGVyJyA/ICdhdXRvJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXJnaW5SaWdodDogaGVyb1N0eWxlLnRpdGxlLnRleHRBbGlnbiA9PT0gJ2NlbnRlcicgPyAnYXV0bycgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHtoZXJvLnN1YnRpdGxlIHx8IFwiXHVBRDgxXHVBRDkwIFx1QjJGNVx1QzBBQ1x1QkQ4MFx1RDEzMCBcdUM5QzBcdUM1RUQgXHVDNUVDXHVENTg5IFx1Q0Y1NFx1QzJBNFx1QUU0Q1x1QzlDMC4gXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXHVDNjQwIFx1RDU2OFx1QUVEOCBcdUQ1NUNcdUFENkRcdUM3NTggXHVDNUVEXHVDMEFDXHUwMEI3XHVCQjM4XHVENjU0XHUwMEI3XHVDNzkwXHVDNUYwXHVDNzQ0IFx1QzYyOFx1QkFCOFx1QzczQ1x1Qjg1QyBcdUFDQkRcdUQ1RDhcdUQ1NThcdUIyOTQgXHVDNUVDXHVENTg5IFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFx1Qzc4NVx1QjJDOFx1QjJFNC5cIn1cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGdhcDoxMiwgZmxleFdyYXA6J3dyYXAnLCBtYXJnaW5Cb3R0b206NDAsXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IGhlcm9TdHlsZS50aXRsZS50ZXh0QWxpZ24gPT09ICdjZW50ZXInID8gJ2NlbnRlcicgOiAoaGVyb1N0eWxlLnRpdGxlLnRleHRBbGlnbiA9PT0gJ3JpZ2h0JyA/ICdmbGV4LWVuZCcgOiAnZmxleC1zdGFydCcpLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5jdGEuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgey8qIHYwMC4xNTIgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM2OTRcdUNDQUQgJ1x1QzlDMFx1QjNDNFx1QzVEMFx1QzExQyBcdUM1RUNcdUQ1ODlcdUM5QzAgXHVDQzNFXHVBRTMwIFx1QkM4NFx1RDJCQyBcdUMwQURcdUM4MUMnLiAqL31cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZFwiIG9uQ2xpY2s9eygpID0+IGdvKCdjb21tdW5pdHknKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFdlaWdodDogaGVyb1N0eWxlLmN0YS5mb250V2VpZ2h0fX0+XG4gICAgICAgICAgICAgICAgICB7aGVyby5jdGFQcmltYXJ5IHx8IFwiXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwIFx1Q0MzOFx1QzVFQ1x1RDU1OFx1QUUzMFwifVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17KCkgPT4gZ28oJ3RvdXInKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFdlaWdodDogaGVyb1N0eWxlLmN0YS5mb250V2VpZ2h0fX0+XG4gICAgICAgICAgICAgICAgICB7aGVyby5jdGFTZWNvbmRhcnkgfHwgXCJcdUQyMkNcdUM1QjQgXHVENTA0XHVCODVDXHVBREY4XHVCN0E4IFx1QkNGNFx1QUUzMFwifVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZXJvLXN0YXRzXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OidncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczoncmVwZWF0KDMsMWZyKScsIGdhcDoyMCxcbiAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOjI0LCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHtzdGF0cy5tYXAoKHN0YXQpID0+IChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtzdGF0Lmx9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBoZXJvU3R5bGUuc3RhdHMudmFsdWUuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLnN0YXRzLnZhbHVlLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtoZXJvU3R5bGUuc3RhdHMudmFsdWUuY29sb3J9KWAsXG4gICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOjQsXG4gICAgICAgICAgICAgICAgICAgIH19PntzdGF0LnZ9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogaGVyb1N0eWxlLnN0YXRzLmxhYmVsLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5zdGF0cy5sYWJlbC5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IGAke2hlcm9TdHlsZS5zdGF0cy5sYWJlbC5sZXR0ZXJTcGFjaW5nfWVtYCxcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYHZhcigke2hlcm9TdHlsZS5zdGF0cy5sYWJlbC5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBoZXJvU3R5bGUuc3RhdHMubGFiZWwudGV4dFRyYW5zZm9ybSB8fCAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206MyxcbiAgICAgICAgICAgICAgICAgICAgfX0+e3N0YXQubH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBoZXJvU3R5bGUuc3RhdHMuc3ViLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBgdmFyKCR7aGVyb1N0eWxlLnN0YXRzLnN1Yi5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgICAgICAgfX0+e3N0YXQuc308L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogXHVDNkIwXHVDRTIxOiBcdUM5QzBcdUIzQzQgXHVCQkY4XHVCOUFDXHVCQ0Y0XHVBRTMwIFx1MjAxNCBcdUMyRENcdUIzQzQgXHVEMDc0XHVCOUFEIFx1MjE5MiBcdUM4MDRcdUNDQjQgXHVCQUE4XHVCMkVDIChhMTF5OiBcdUM2NzhcdUFDRkQgZGl2IFx1QjI5NCBcdUIyRThcdUMyMUMgXHVDRUU4XHVEMTRDXHVDNzc0XHVCMTA4LCBcdUMyRTRcdUM4MUMgXHVCQzg0XHVEMkJDXHVDNzQwIHJlZ2lvbiBwYXRoIFx1QzY0MCBcdUM2QjBcdUMwQzFcdUIyRTggXHVEMTREXHVDMkE0XHVEMkI4IFx1QkM4NFx1RDJCQykuIFx1RDNGMChcdTIyNjQ2MDBweCkgXHVDNUQwXHVDMTFDXHVCMjk0IGhlcm8tbWFwLXByZXZpZXcgQ1NTIFx1Qjg1QyBcdUMyMjhcdUFFNDAgKyBDVEEgXHVCQzg0XHVEMkJDXHVCOUNDIFx1QjE3OFx1Q0Q5Qy4gKi99XG4gICAgICAgICAgICB7LyogdjAwLjEwNiBcdTIwMTQgXHVDOUMwXHVCM0M0IFx1MjE5MiBcdUIyRTRcdUM3NEMgXHVBQzE1XHVDNUYwIC8gXHVCMkU0XHVDNzRDIFx1QjJGNVx1QzBBQyBcdUJCRjhcdUIyQzggXHVDRTc0XHVCNERDIChBXHVDNTQ4KSAqL31cbiAgICAgICAgICAgIDxIZXJvUHJvZ3JhbUNhcmRzIGdvPXtnb30gZGF0YVRpY2s9e2RhdGFUaWNrfS8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8L0hvbWVTZWN0aW9uQm91bmRhcnk+XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0Q5NFx1Q0M5QyAoXHVBRDAwXHVCOUFDXHVDNzkwIFx1Q0Y1OFx1RDE1MFx1Q0UyMCBcdUQzMjhcdUIxMTBcdUM1RDBcdUMxMUMgXHVDRDk0XHVBQzAwKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICB7cmVjb21tZW5kYXRpb25zLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNEOTRcdUNDOUNcIj48c2VjdGlvbiBjbGFzc05hbWU9XCJzZWN0aW9uXCIgc3R5bGU9e3tiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICAgICAgLy8gdjAwLjA4MyBcdTIwMTQgc2l0ZV9jb250ZW50X2t2LnJlY29tbWVuZGF0aW9uc0hlYWRpbmcgXHVDNUQwXHVDMTFDIGhlcm8gXHVDNzdEXHVDNzRDICh2MDAuMDczIHN3ZWVwIFx1QkJGOFx1QzY0NCBcdUM3OTRcdUM3QUMpLlxuICAgICAgICAgICAgICBjb25zdCBfaSA9ICh3aW5kb3cuQkdOSl9TSVRFX0NPTlRFTlQ/LmdldD8uKCkgfHwge30pLnJlY29tbWVuZGF0aW9uc0hlYWRpbmcgfHwge307XG4gICAgICAgICAgICAgIGNvbnN0IGViID0gX2kuZXllYnJvdyAgICAgIHx8ICdSRUNPTU1FTkRBVElPTlMgXHUwMEI3IFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNEOTRcdUNDOUMnO1xuICAgICAgICAgICAgICBjb25zdCB0cCA9IF9pLnRpdGxlUHJlZml4ICA/PyAnXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXHVBQzAwICc7XG4gICAgICAgICAgICAgIGNvbnN0IHRhID0gX2kudGl0bGVBY2NlbnQgID8/ICdcdUNEOTRcdUNDOUMnO1xuICAgICAgICAgICAgICBjb25zdCB0cyA9IF9pLnRpdGxlU3VmZml4ICA/PyAnXHVENTY5XHVCMkM4XHVCMkU0JztcbiAgICAgICAgICAgICAgY29uc3Qgc2IgPSBfaS5zdWJ0aXRsZSAgICAgfHwgJ1x1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1QUMwMCBcdUM5QzFcdUM4MTEgXHVBQzc3XHVBQ0UwLCBcdUI5REJcdUJDRjRcdUFDRTAsIFx1QjI5MFx1QjA4MCBcdUFDRjMuIFx1QzZCNFx1QzYwMVx1Qzc5MFx1QUMwMCBcdUQwNTBcdUI4MDhcdUM3NzRcdUMxNThcdUQ1NUMgXHVDRDk0XHVDQzlDIFx1QzVFQ1x1RDU4OVx1QzlDMFx1Qzc4NVx1QjJDOFx1QjJFNC4nO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxTZWN0aW9uSGVhZFxuICAgICAgICAgICAgICAgICAgZXllYnJvdz17ZWJ9XG4gICAgICAgICAgICAgICAgICB0aXRsZT17PD57dHB9PHNwYW4gY2xhc3NOYW1lPVwiYWNjZW50XCI+e3RhfTwvc3Bhbj57dHN9PC8+fVxuICAgICAgICAgICAgICAgICAgc3VidGl0bGU9e3NifVxuICAgICAgICAgICAgICAgICAgYWN0aW9uPXs8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBnbygndG91cicpfT5cdUM4MDRcdUNDQjQgXHVENTA0XHVCODVDXHVBREY4XHVCN0E4IFx1MjE5MjwvYnV0dG9uPn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLTNcIj5cbiAgICAgICAgICAgICAge3JlY29tbWVuZGF0aW9ucy5tYXAoKHIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheShyLnRhZ3MpID8gci50YWdzIDogKHR5cGVvZiByLnRhZ3MgPT09ICdzdHJpbmcnID8gci50YWdzLnNwbGl0KC9bLFx1MDBCN10vKS5tYXAoKHMpID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxhcnRpY2xlIGtleT17ci5pZCB8fCByLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhcmRcIlxuICAgICAgICAgICAgICAgICAgICB7Li4uY2xpY2thYmxlKCgpID0+IHNldFJlY0RldGFpbChyKSwgYCR7ci5uYW1lIHx8ICdcdUNEOTRcdUNDOUMnfSBcdUMwQzFcdUMxMzggXHVCQ0Y0XHVBRTMwYCl9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Y3Vyc29yOidwb2ludGVyJ319PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OjE2MCwgbWFyZ2luQm90dG9tOjE4LCBwb3NpdGlvbjoncmVsYXRpdmUnLCBvdmVyZmxvdzonaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiByLmltYWdlRGF0YVVyaSA/IGB1cmwoJHtyLmltYWdlRGF0YVVyaX0pIGNlbnRlci9jb3ZlcmAgOiAndmFyKC0tYmctMyknLFxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogci5pbWFnZURhdGFVcmkgPyAnbm9uZScgOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3IucmVnaW9uICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgdG9wOjEwLCBsZWZ0OjEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiczcHggOHB4JywgYmFja2dyb3VuZDondmFyKC0tYmctMiknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBjb2xvcjondmFyKC0taW5rLTIpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19PntyLnJlZ2lvbn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge3RhZ3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6NiwgbWFyZ2luQm90dG9tOjEwLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0YWdzLnNsaWNlKDAsIDMpLm1hcCgodCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZTo5fX0+e3R9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjIsIGZvbnRXZWlnaHQ6NjAwLCBtYXJnaW5Cb3R0b206NX19PntyLm5hbWUgfHwgJ1x1QzgxQ1x1QkFBOSBcdUM1QzZcdUM3NEMnfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgIHtyLnN1YnRpdGxlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6MTEsIGZvbnRXZWlnaHQ6NjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3ZhcigtLXNlY29uZGFyeSknLCBsZXR0ZXJTcGFjaW5nOicwLjA1ZW0nLCBtYXJnaW5Cb3R0b206MTAsXG4gICAgICAgICAgICAgICAgICAgICAgfX0+e3Iuc3VidGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIHtyLmRlc2MgJiYgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIGNvbG9yOid2YXIoLS1pbmstMiknfX0+e3IuZGVzY308L3A+fVxuICAgICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj48L0hvbWVTZWN0aW9uQm91bmRhcnk+XG4gICAgICApfVxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFx1RDIyQ1x1QzVCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QTggXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge3RvdXJzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1RDIyQ1x1QzVCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QThcIj48c2VjdGlvbiBjbGFzc05hbWU9XCJzZWN0aW9uXCIgc3R5bGU9e3tib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKSd9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPFNlY3Rpb25IZWFkXG4gICAgICAgICAgICAgIGV5ZWJyb3c9XCJUT1VSIFBST0dSQU0gXHUwMEI3IFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUQyMkNcdUM1QjRcIlxuICAgICAgICAgICAgICB0aXRsZT17PD5cdUM5QzFcdUM4MTEgXHVBQzc3XHVCMjk0IDxzcGFuIGNsYXNzTmFtZT1cImFjY2VudFwiPlx1QjJGNVx1QzBBQyBcdUM1RUNcdUQ1ODk8L3NwYW4+PC8+fVxuICAgICAgICAgICAgICBzdWJ0aXRsZT1cIlx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1QUMwMCBcdUM5QzFcdUM4MTEgXHVBRTMwXHVENjhEXHUwMEI3XHVDNkI0XHVDNjAxXHVENTU4XHVCMjk0IFx1QzE4Q1x1QUREQ1x1QkFBOCBcdUIyRjVcdUMwQUMgXHVENTA0XHVCODVDXHVBREY4XHVCN0E4LiBcdUFFNEFcdUM3NzQgXHVDNzg4XHVCMjk0IFx1RDU3NFx1QzEyNFx1QUNGQyBcdUQ1NjhcdUFFRDhcdUQ1NThcdUIyOTQgXHVDNUVDXHVENTg5LlwiXG4gICAgICAgICAgICAgIGFjdGlvbj17PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gZ28oJ3RvdXInKX0+XHVDODA0XHVDQ0I0IFx1RDUwNFx1Qjg1Q1x1QURGOFx1QjdBOCBcdTIxOTI8L2J1dHRvbj59XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtMlwiPlxuICAgICAgICAgICAgICB7dG91cnMubWFwKCh0LCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGFydGljbGUga2V5PXt0LmlkfSBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ3RvdXInKSwgYFx1RDIyQ1x1QzVCNDogJHt0LnRpdGxlfWApfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBwb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6MjAsIHJpZ2h0OjIwLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZToxMCwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMmVtJyxcbiAgICAgICAgICAgICAgICAgIH19PjB7aSsxfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OCwgbWFyZ2luQm90dG9tOjE2LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAge3QubGV2ZWwgJiYgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2VcIj57dC5sZXZlbH08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICB7dC5kdXJhdGlvbiAmJiA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiPnt0LmR1cmF0aW9ufTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgIHt0Lmdyb3VwICYmIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCI+e3QuZ3JvdXB9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImNhcmQtdGl0bGVcIiBzdHlsZT17e2ZvbnRTaXplOjIyLCBtYXJnaW5Cb3R0b206MTB9fT57dC50aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAge3QuZGVzYyAmJiA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgbWFyZ2luQm90dG9tOjIwfX0+e3RydW5jYXRlUHJldmlldyh0LmRlc2MsIDExMCl9PC9wPn1cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknLCBwYWRkaW5nVG9wOjE2LFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgZm9udFdlaWdodDo2MDAsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIGNvbG9yOid2YXIoLS1pbmstMyknfX0+XHVCMkU0XHVDNzRDIFx1Qzc3Q1x1QzgxNTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250U2l6ZToxNCwgbWFyZ2luVG9wOjQsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo1MDB9fT57dC5uZXh0IHx8ICdcdTIwMTQnfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e3RleHRBbGlnbjoncmlnaHQnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgZm9udFdlaWdodDo2MDAsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIGNvbG9yOid2YXIoLS1pbmstMyknfX0+XHVDQzM4XHVBQzAwXHVCRTQ0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjAsIG1hcmdpblRvcDo0LCBjb2xvcjondmFyKC0taW5rKScsIGZvbnRXZWlnaHQ6NjAwfX0+e3QucHJpY2UgPyAodHlwZW9mIHQucHJpY2UgPT09ICdudW1iZXInID8gd2luZG93LkJHTkpfRk1ULndvbih0LnByaWNlKSA6IHQucHJpY2UpIDogJ1x1MjAxNCd9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+PC9Ib21lU2VjdGlvbkJvdW5kYXJ5PlxuICAgICAgKX1cblxuICAgICAgey8qIFx1MjUwMFx1MjUwMCBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjBcIj48c2VjdGlvbiBjbGFzc05hbWU9XCJzZWN0aW9uXCIgc3R5bGU9e3tiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxTZWN0aW9uSGVhZFxuICAgICAgICAgICAgZXllYnJvdz1cIkNPTU1VTklUWSBcdTAwQjcgXHVDNUVDXHVENTg5IFx1Qzc3NFx1QzU3Q1x1QUUzMFwiXG4gICAgICAgICAgICB0aXRsZT17PD5cdUQ1NjhcdUFFRDggXHVCOUNDXHVCNEU0XHVDNUI0XHVBQzAwXHVCMjk0IDxzcGFuIGNsYXNzTmFtZT1cImFjY2VudFwiPlx1QzVFQ1x1RDU4OTwvc3Bhbj48Lz59XG4gICAgICAgICAgICBzdWJ0aXRsZT1cIlx1QzVFQ1x1RDU4OSBcdUFDQkRcdUQ1RDhcdUM3NDQgXHVCMDk4XHVCMjA0XHVBQ0UwLCBcdUNGNTRcdUMyQTRcdUI5N0MgXHVDRDk0XHVDQzlDXHVENTU4XHVBQ0UwLCBcdUQ1NjhcdUFFRDggXHVCNUEwXHVCMEEwIFx1QjNEOVx1RDU4OVx1Qzc0NCBcdUNDM0VcdUMyQjVcdUIyQzhcdUIyRTQuXCJcbiAgICAgICAgICAgIGFjdGlvbj17PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gZ28oJ2NvbW11bml0eScpfT5cdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVBQzAwXHVBRTMwIFx1MjE5MjwvYnV0dG9uPn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtyZWNlbnRQb3N0cy5sZW5ndGggPiAwID8gKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2JvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgICAgICB7cmVjZW50UG9zdHMubWFwKChwb3N0LCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e3Bvc3QuaWR9XG4gICAgICAgICAgICAgICAgICB7Li4uY2xpY2thYmxlKCgpID0+IGdvKCdjb21tdW5pdHknKSwgcG9zdC50aXRsZSl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OidmbGV4JywgZ2FwOjIwLCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOicxOHB4IDI0cHgnLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpICUgMiA9PT0gMCA/ICd2YXIoLS1iZyknIDogJ3ZhcigtLWJnLTIpJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBpIDwgcmVjZW50UG9zdHMubGVuZ3RoIC0gMSA/ICcxcHggc29saWQgdmFyKC0tbGluZSknIDogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZmxleDoxLCBtaW5XaWR0aDowfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjgsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbTo1LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7cG9zdC5jYXRlZ29yeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiIHN0eWxlPXt7Zm9udFNpemU6OX19Pntwb3N0LmNhdGVnb3J5fTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAge3Bvc3QucHJlZml4ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZTo5LCBmb250V2VpZ2h0OjcwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6J3ZhcigtLXNlY29uZGFyeSknLCBsZXR0ZXJTcGFjaW5nOicwLjFlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICB9fT5be3Bvc3QucHJlZml4fV08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjE1LCBjb2xvcjondmFyKC0taW5rKScsIG1hcmdpbkJvdHRvbTozLCBmb250V2VpZ2h0OjUwMH19Pntwb3N0LnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1pbmstMyknLCBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJ319PlxuICAgICAgICAgICAgICAgICAgICAgIHtwb3N0LmF1dGhvcn0gXHUwMEI3IHtwb3N0LmRhdGV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBnYXA6MTQsIGNvbG9yOid2YXIoLS1pbmstMyknLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6MTEsIGZsZXhTaHJpbms6MCwgZm9udFdlaWdodDo1MDAsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+XHVCMzEzXHVBRTAwIHtwb3N0LnJlcGxpZXMgPz8gMH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7Y29sb3I6J3ZhcigtLWluay0yKSd9fT5cdTIxOTI8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3t0ZXh0QWxpZ246J2NlbnRlcicsIHBhZGRpbmc6NjB9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MjAsIGNvbG9yOid2YXIoLS1pbmspJywgbWFyZ2luQm90dG9tOjEyLCBmb250V2VpZ2h0OjYwMH19PlxuICAgICAgICAgICAgICAgIFx1Q0NBQiBcdUJDODhcdUM5RjggXHVDNUVDXHVENTg5IFx1Qzc3NFx1QzU3Q1x1QUUzMFx1Qjk3QyBcdUMzNjhcdUM4RkNcdUMxMzhcdUM2OTRcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6MTMsIGNvbG9yOid2YXIoLS1pbmstMiknLCBtYXJnaW5Cb3R0b206MjQsIGxpbmVIZWlnaHQ6MS43fX0+XG4gICAgICAgICAgICAgICAgXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwXHVDNUQwIFx1QzVFQ1x1RDU4OSBcdUFDQkRcdUQ1RDhcdUM3NDQgXHVCMDk4XHVCMjA0XHVCQTc0IFx1QjM1NCBcdUI5Q0VcdUM3NDAgXHVDNUVDXHVENTg5XHVDNzkwXHVCNEU0XHVDNzc0IFx1QkFBOFx1QzVFQ1x1QjRFRFx1QjJDOFx1QjJFNC5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZFwiIG9uQ2xpY2s9eygpID0+IGdvKCdjb21tdW5pdHknKX0+XHVBRTAwIFx1Qzc5MVx1QzEzMVx1RDU1OFx1QUUzMCBcdTIxOTI8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cblxuICAgICAgey8qIFx1MjUwMFx1MjUwMCBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVDRTdDXHVCN0ZDIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIHtmZWF0dXJlZENvbHVtbiAmJiAoXG4gICAgICAgIDxIb21lU2VjdGlvbkJvdW5kYXJ5IGxhYmVsPVwiXHVDRTdDXHVCN0ZDXCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwic2VjdGlvblwiIHN0eWxlPXt7Ym9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxTZWN0aW9uSGVhZFxuICAgICAgICAgICAgICBleWVicm93PVwiQ09MVU1OIFx1MDBCNyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUM3NTggXHVBRTAwXCJcbiAgICAgICAgICAgICAgdGl0bGU9ezw+PHNwYW4gY2xhc3NOYW1lPVwiYWNjZW50XCI+XHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwPC9zcGFuPlx1QUMwMCBcdUM0RjBcdUIyRTQ8Lz59XG4gICAgICAgICAgICAgIHN1YnRpdGxlPVwiXHVENTVDXHVBRDZEXHVDNzU4IFx1QzVFRFx1QzBBQ1x1MDBCN1x1QkIzOFx1RDY1NFx1MDBCN1x1QzVFQ1x1RDU4OVx1Qzc0NCBcdUFFNEFcdUM3NzQgXHVDNzg4XHVBQzhDIFx1RDQ4MFx1QzVCNFx1QjBCNFx1QjI5NCBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUM3NTggXHVDODE1XHVBRTMwIFx1Q0U3Q1x1QjdGQy5cIlxuICAgICAgICAgICAgICBhY3Rpb249ezxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IGdvKCdjb2x1bW4nKX0+XHVDRTdDXHVCN0ZDIFx1QzgwNFx1Q0NCNCBcdUJDRjRcdUFFMzAgXHUyMTkyPC9idXR0b24+fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczonMS4zZnIgMWZyJywgZ2FwOjQwfX0gY2xhc3NOYW1lPVwiY29sLWdyaWRcIj5cbiAgICAgICAgICAgICAgey8qIFx1RDUzQ1x1Q0M5OFx1QjREQyBcdUNFN0NcdUI3RkMgKi99XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOjAsIG92ZXJmbG93OidoaWRkZW4nLCBjdXJzb3I6J3BvaW50ZXInfX1cbiAgICAgICAgICAgICAgICB7Li4uY2xpY2thYmxlKCgpID0+IGdvKCdjb2x1bW4nKSwgYFx1Q0U3Q1x1QjdGQzogJHtmZWF0dXJlZENvbHVtbi50aXRsZX1gKX0+XG4gICAgICAgICAgICAgICAgey8qIHYwMC4xNDAgXHUyMDE0IGNvdmVyVXJsIFx1QzBBQ1x1QzZBOSAoc3RhbGUgZmllbGQgXHVDNzc0XHVCOTg0IGNvdmVySW1hZ2UgXHVBQzAwIFx1QzU0NFx1QjJDOFx1Qjc3QykuICovfVxuICAgICAgICAgICAgICAgIHsoZmVhdHVyZWRDb2x1bW4uY292ZXJVcmwgfHwgZmVhdHVyZWRDb2x1bW4uY292ZXJJbWFnZSkgPyAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDoyMDAsIGJhY2tncm91bmRJbWFnZTpgdXJsKCR7ZmVhdHVyZWRDb2x1bW4uY292ZXJVcmwgfHwgZmVhdHVyZWRDb2x1bW4uY292ZXJJbWFnZX0pYCxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZFNpemU6J2NvdmVyJywgYmFja2dyb3VuZFBvc2l0aW9uOidjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgfX0vPlxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDoxNDAsIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjksIGZvbnRXZWlnaHQ6NjAwLCBjb2xvcjondmFyKC0taW5rLTMpJywgbGV0dGVyU3BhY2luZzonMC4yOGVtJ319PkZFQVRVUkVEIENPTFVNTjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cGFkZGluZzozMH19PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTIsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbToxNCwgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICAgICAgICAgIHtmZWF0dXJlZENvbHVtbi5jYXRlZ29yeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJwaWxsXCI+e2ZlYXR1cmVkQ29sdW1uLmNhdGVnb3J5fTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgIHtmZWF0dXJlZENvbHVtbi5kYXRlICYmIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjExfX0+e2ZlYXR1cmVkQ29sdW1uLmRhdGV9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAge2ZlYXR1cmVkQ29sdW1uLnJlYWRUaW1lICYmIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjExfX0+XHUwMEI3IHtmZWF0dXJlZENvbHVtbi5yZWFkVGltZX08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjI2LCBmb250V2VpZ2h0OjYwMCwgbGluZUhlaWdodDoxLjMsIG1hcmdpbkJvdHRvbToxMn19PlxuICAgICAgICAgICAgICAgICAgICB7ZmVhdHVyZWRDb2x1bW4udGl0bGV9XG4gICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAge2ZlYXR1cmVkQ29sdW1uLmV4Y2VycHQgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjE0LCBsaW5lSGVpZ2h0OjEuNzUsIGNvbG9yOid2YXIoLS1pbmstMiknfX0+e2ZlYXR1cmVkQ29sdW1uLmV4Y2VycHR9PC9wPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTEsIGZvbnRXZWlnaHQ6NzAwLCBsZXR0ZXJTcGFjaW5nOicwLjJlbScsIG1hcmdpblRvcDoyMCwgY29sb3I6J3ZhcigtLXNlY29uZGFyeSknfX0+XHVCMzU0IFx1Qzc3RFx1QUUzMCBcdTIxOTI8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIHsvKiBcdUMxMUNcdUJFMEMgXHVDRTdDXHVCN0ZDIFx1QkFBOVx1Qjg1RCAqL31cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICB7c2Vjb25kYXJ5Q29sdW1ucy5tYXAoKGMpID0+IChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtjLmlkfVxuICAgICAgICAgICAgICAgICAgICB7Li4uY2xpY2thYmxlKCgpID0+IGdvKCdjb2x1bW4nKSwgYFx1Q0U3Q1x1QjdGQzogJHtjLnRpdGxlfWApfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3BhZGRpbmc6JzE4cHggMCcsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgY3Vyc29yOidwb2ludGVyJ319PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxMCwgYWxpZ25JdGVtczonY2VudGVyJywgbWFyZ2luQm90dG9tOjgsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgICAgICAgIHtjLmNhdGVnb3J5ICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGxcIiBzdHlsZT17e2ZvbnRTaXplOjksIHBhZGRpbmc6JzJweCA4cHgnfX0+e2MuY2F0ZWdvcnl9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7Yy5kYXRlICYmIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEwfX0+e2MuZGF0ZX08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToxNywgZm9udFdlaWdodDo2MDAsIGxpbmVIZWlnaHQ6MS40LCBtYXJnaW5Cb3R0b206NX19PntjLnRpdGxlfTwvaDQ+XG4gICAgICAgICAgICAgICAgICAgIHtjLmV4Y2VycHQgJiYgPHAgc3R5bGU9e3tmb250U2l6ZToxMiwgbGluZUhlaWdodDoxLjYsIGNvbG9yOid2YXIoLS1pbmstMyknfX0+eyhjLmV4Y2VycHR8fCcnKS5zbGljZSgwLDY1KX1cdTIwMjY8L3A+fVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAge3NlY29uZGFyeUNvbHVtbnMubGVuZ3RoID09PSAwICYmIChcbiAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6MTMsIGNvbG9yOid2YXIoLS1pbmstMyknLCBwYWRkaW5nOicxOHB4IDAnfX0+XHVCMkU0XHVDNzRDIFx1Q0U3Q1x1QjdGQyBcdUM5MDBcdUJFNDQgXHVDOTExXHVDNzg1XHVCMkM4XHVCMkU0LjwvcD5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+PC9Ib21lU2VjdGlvbkJvdW5kYXJ5PlxuICAgICAgKX1cblxuICAgICAgey8qIFx1MjUwMFx1MjUwMCBcdUFDMTVcdUM1RjAgXHVDNzdDXHVDODE1IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIHtsZWN0dXJlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUFDMTVcdUM1RjBcIj48c2VjdGlvbiBjbGFzc05hbWU9XCJzZWN0aW9uLXRpZ2h0XCIgc3R5bGU9e3tiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8U2VjdGlvbkhlYWRcbiAgICAgICAgICAgICAgZXllYnJvdz1cIkxFQ1RVUkUgXHUwMEI3IFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUFDMTVcdUM1RjBcIlxuICAgICAgICAgICAgICB0aXRsZT17PD5cdUM3NzRcdUJDODggXHVCMkVDIDxzcGFuIGNsYXNzTmFtZT1cImFjY2VudFwiPlx1QUMxNVx1QzVGMCBcdUM3N0NcdUM4MTU8L3NwYW4+PC8+fVxuICAgICAgICAgICAgICBhY3Rpb249ezxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IGdvKCdsZWN0dXJlcycpfT5cdUM4MDRcdUNDQjQgXHVBQzE1XHVDNUYwIFx1QkNGNFx1QUUzMCBcdTIxOTI8L2J1dHRvbj59XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtM1wiPlxuICAgICAgICAgICAgICB7bGVjdHVyZXMubWFwKChsZWN0dXJlKSA9PiAoXG4gICAgICAgICAgICAgICAgPGFydGljbGUga2V5PXtsZWN0dXJlLmlkfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2FyZFwiXG4gICAgICAgICAgICAgICAgICB7Li4uY2xpY2thYmxlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX2xlY3R1cmVfaWQnLCBTdHJpbmcobGVjdHVyZS5pZCkpOyB9IGNhdGNoIHt9XG4gICAgICAgICAgICAgICAgICAgIGdvKCdsZWN0dXJlcycpO1xuICAgICAgICAgICAgICAgICAgfSwgYFx1QUMxNVx1QzVGMDogJHtsZWN0dXJlLnRvcGljIHx8IGxlY3R1cmUudGl0bGV9YCl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcid9fT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3ttYXJnaW5Cb3R0b206MTZ9fT5cdUFDMTVcdUM1RjA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIwLCBmb250V2VpZ2h0OjYwMCwgbWFyZ2luQm90dG9tOjh9fT57bGVjdHVyZS50b3BpYyB8fCBsZWN0dXJlLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICB7bGVjdHVyZS5ub3RlICYmIDxwIHN0eWxlPXt7Zm9udFNpemU6MTMsIGxpbmVIZWlnaHQ6MS43LCBjb2xvcjondmFyKC0taW5rLTIpJywgbWFyZ2luQm90dG9tOjE2fX0+e3RydW5jYXRlUHJldmlldyhsZWN0dXJlLm5vdGUsIDExMCl9PC9wPn1cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHBhZGRpbmdUb3A6MTIsIGRpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2Vlbid9fT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZToxMiwgY29sb3I6J3ZhcigtLWluay0yKSd9fT57bGVjdHVyZS52ZW51ZSB8fCAnXHUyMDE0J308L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7Zm9udFNpemU6MTIsIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250V2VpZ2h0OjYwMCwgY29sb3I6J3ZhcigtLWluayknfX0+e2xlY3R1cmUubmV4dCB8fCAnXHUyMDE0J308L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj48L0hvbWVTZWN0aW9uQm91bmRhcnk+XG4gICAgICApfVxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFx1Q0M0NSBDVEEgXHUyMDE0IHYwMC4xNTIgXHVCMkU0XHVBRDhDIFx1Q0U3NFx1QjhFOFx1QzE0MCArIFx1Qzg4Q1x1QzZCMCBcdUJCMzRcdUQ1NUMgXHVCQzE4XHVCQ0Y1IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIDxCb29rQ2Fyb3VzZWxTZWN0aW9uIGdvPXtnb30gZGF0YVRpY2s9e2RhdGFUaWNrfS8+XG5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IEhvbWVQYWdlIH0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBV0EsTUFBTSxzQkFBc0IsQ0FBQyxFQUFFLFNBQVMsR0FBRyxNQUFNO0FBWGpEO0FBWUUsUUFBTSxDQUFDLGNBQWMsZUFBZSxJQUFJLE1BQU0sU0FBUyxJQUFJO0FBRTNELGVBQU8sa0JBQVAsZ0NBQXVCLEVBQUUsTUFBTSxNQUFNLE9BQU8sT0FBTyxTQUFTLGFBQWEsTUFBTSxPQUFPLCtDQUFZO0FBQ2xHLFNBQ0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFJLE1BQUs7QUFBQSxNQUFTLGNBQVc7QUFBQSxNQUFPLGNBQVc7QUFBQSxNQUM5QyxPQUFPO0FBQUEsUUFDTCxVQUFTO0FBQUEsUUFBUyxPQUFNO0FBQUEsUUFBRyxRQUFPO0FBQUEsUUFDbEMsWUFBVztBQUFBLFFBQ1gsU0FBUTtBQUFBLFFBQVEsWUFBVztBQUFBLFFBQVUsU0FBUTtBQUFBLE1BQy9DO0FBQUEsTUFDQSxTQUFTLENBQUMsTUFBTTtBQUFFLFlBQUksRUFBRSxXQUFXLEVBQUUsY0FBZSxTQUFRO0FBQUEsTUFBRztBQUFBO0FBQUEsSUFDL0Qsb0NBQUMsU0FBSSxPQUFPO0FBQUEsTUFDVixZQUFXO0FBQUEsTUFBYSxVQUFTO0FBQUEsTUFBSyxPQUFNO0FBQUEsTUFBUSxXQUFVO0FBQUEsTUFDOUQsVUFBUztBQUFBLE1BQVEsU0FBUTtBQUFBLE1BQWtCLFVBQVM7QUFBQSxNQUNwRCxRQUFPO0FBQUEsSUFDVCxLQUNFO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFBTyxTQUFTO0FBQUEsUUFBUyxjQUFXO0FBQUEsUUFDbkMsT0FBTztBQUFBLFVBQ0wsVUFBUztBQUFBLFVBQVksS0FBSTtBQUFBLFVBQUksT0FBTTtBQUFBLFVBQ25DLE9BQU07QUFBQSxVQUFJLFFBQU87QUFBQSxVQUFJLFVBQVM7QUFBQSxVQUM5QixZQUFXO0FBQUEsVUFBZSxRQUFPO0FBQUEs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QSxJQUFDO0FBQUE7QUFBQSxNQUNDLFNBQVE7QUFBQSxNQUNSLE9BQU8sMERBQUUsd0JBQUssb0NBQUMsVUFBSyxXQUFVLFlBQVMsMkJBQUssQ0FBTztBQUFBLE1BQ25ELFFBQVEsb0NBQUMsWUFBTyxNQUFLLFVBQVMsV0FBVSxhQUFZLFNBQVMsTUFBTSxHQUFHLFVBQVUsS0FBRywrQ0FBVTtBQUFBO0FBQUEsRUFDL0YsR0FDQSxvQ0FBQyxTQUFJLFdBQVUsaUJBQ1osU0FBUyxJQUFJLENBQUMsWUFDYjtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQVEsS0FBSyxRQUFRO0FBQUEsTUFDcEIsV0FBVTtBQUFBLE1BQ1QsR0FBRyxVQUFVLE1BQU07QUFDbEIsWUFBSTtBQUFFLHlCQUFlLFFBQVEsMkJBQTJCLE9BQU8sUUFBUSxFQUFFLENBQUM7QUFBQSxRQUFHLFNBQVE7QUFBQSxRQUFDO0FBQ3RGLFdBQUcsVUFBVTtBQUFBLE1BQ2YsR0FBRyxpQkFBTyxRQUFRLFNBQVMsUUFBUSxLQUFLLEVBQUU7QUFBQSxNQUMxQyxPQUFPLEVBQUMsUUFBTyxVQUFTO0FBQUE7QUFBQSxJQUN4QixvQ0FBQyxVQUFLLFdBQVUsU0FBUSxPQUFPLEVBQUMsY0FBYSxHQUFFLEtBQUcsY0FBRTtBQUFBLElBQ3BELG9DQUFDLFFBQUcsV0FBVSxZQUFXLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxLQUFLLGNBQWEsRUFBQyxLQUFJLFFBQVEsU0FBUyxRQUFRLEtBQU07QUFBQSxJQUM5RyxRQUFRLFFBQVEsb0NBQUMsT0FBRSxPQUFPLEVBQUMsVUFBUyxJQUFJLFlBQVcsS0FBSyxPQUFNLGdCQUFnQixjQUFhLEdBQUUsS0FBSSxnQkFBZ0IsUUFBUSxNQUFNLEdBQUcsQ0FBRTtBQUFBLElBQ3JJLG9DQUFDLFNBQUksT0FBTyxFQUFDLFdBQVUseUJBQXlCLFlBQVcsSUFBSSxTQUFRLFFBQVEsZ0JBQWUsZ0JBQWUsS0FDM0csb0NBQUMsVUFBSyxPQUFPLEVBQUMsVUFBUyxJQUFJLE9BQU0sZUFBYyxLQUFJLFFBQVEsU0FBUyxRQUFJLEdBQ3hFLG9DQUFDLFVBQUssT0FBTyxFQUFDLFVBQVMsSUFBSSxZQUFXLG9CQUFvQixZQUFXLEtBQUssT0FBTSxhQUFZLEtBQUksUUFBUSxRQUFRLFFBQUksQ0FDdEg7QUFBQSxFQUNGLENBQ0QsQ0FDSCxDQUNGLENBQ0YsQ0FBVSxHQUlaLG9DQUFDLHVCQUFvQixJQUFRLFVBQW1CLENBRWxEO0FBRUo7QUFFQSxPQUFPLE9BQU8sUUFBUSxFQUFFLFNBQVMsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

})();

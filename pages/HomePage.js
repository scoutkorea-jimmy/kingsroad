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
  const cur = books[idx] || books[0];
  const hasPriceKR = Number(cur.priceKR) > 0;
  const hasPriceEN = Number(cur.priceEN) > 0;
  const yr = cur.publishedAt ? new Date(cur.publishedAt).getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
  const showChrome = books.length > 1;
  return /* @__PURE__ */ React.createElement(HomeSectionBoundary, { label: "\uCC45 CTA" }, /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      style: { position: "relative" }
    },
    /* @__PURE__ */ React.createElement("div", { className: "card cta-grid", style: {
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
      marginBottom: 16
    } }, "\u300E", cur.title, "\u300F"), cur.desc && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, lineHeight: 1.85, color: "var(--ink-2)", marginBottom: 28, whiteSpace: "pre-wrap" } }, cur.desc), (hasPriceKR || hasPriceEN) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20, marginBottom: 32, alignItems: "flex-end" } }, hasPriceKR && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, "\uAD6D\uBB38\uD310"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, marginTop: 4, color: "var(--ink)", fontWeight: 700 } }, Number(cur.priceKR).toLocaleString(), "\uC6D0")), hasPriceKR && hasPriceEN && /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "var(--line-2)", alignSelf: "stretch" } }), hasPriceEN && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", color: "var(--ink-3)" } }, "\uC601\uBB38\uD310"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, marginTop: 4, color: "var(--ink)", fontWeight: 700 } }, Number(cur.priceEN).toLocaleString(), "\uC6D0"))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("book") }, "\uAD6C\uB9E4\uD558\uAE30 \u2192")), /* @__PURE__ */ React.createElement("div", { style: {
      aspectRatio: "3/4",
      maxWidth: 280,
      margin: "0 auto",
      background: "var(--bg)",
      border: "1px solid var(--line-2)",
      display: "grid",
      placeItems: "center",
      overflow: "hidden"
    } }, cur.coverDataUri ? /* @__PURE__ */ React.createElement(
      "img",
      {
        src: cur.coverDataUri,
        alt: `${cur.title} \uD45C\uC9C0`,
        style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
      }
    ) : /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "0 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--ink)", marginBottom: 10, fontWeight: 600 } }, cur.title), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.2em" } }, cur.author || "\uBC45\uAE30\uB178\uC790", " \uC9C0\uC74C")))),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvSG9tZVBhZ2UuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVENjQ4XHVEMzk4XHVDNzc0XHVDOUMwIFx1MjAxNCBcdUQ1NUNcdUFENkQgXHVDNUVDXHVENTg5XHUwMEI3XHVDNUVEXHVDMEFDXHUwMEI3XHVCQjM4XHVENjU0IFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFxuLy8gXHVCMzcwXHVDNzc0XHVEMTMwIFx1QzZEMFx1Q0U1OSAodjAwLjA0Nik6XG4vLyAgIDEuIFx1QkFBOFx1QjRFMCBcdUNGNThcdUQxNTBcdUNFMjBcdUIyOTQgXHVDMTFDXHVCQzg0KEQxKSBzb3VyY2Utb2YtdHJ1dGguXG4vLyAgICAgIC0gc2MucmVjb21tZW5kYXRpb25zICAgIFx1MjE5MiBzaXRlX2NvbnRlbnRfa3YgKFx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUNGNThcdUQxNTBcdUNFMjAgXHVEMzI4XHVCMTEwKVxuLy8gICAgICAtIHB1YmxpY0NvbHVtbnMgICAgICAgICBcdTIxOTIgQkdOSl9BUEkuY29sdW1ucy5saXN0IChEMS51c2VyX2NvbHVtbnMpXG4vLyAgICAgIC0gdG91cnMgLyBsZWN0dXJlcyAgICAgIFx1MjE5MiBCR05KX0FQSS50b3Vycy9sZWN0dXJlcy5saXN0XG4vLyAgICAgIC0gcmVjZW50UG9zdHMgICAgICAgICAgIFx1MjE5MiBCR05KX0FQSS5jb21tdW5pdHkucG9zdHNcbi8vICAgMi4gQkFOR0lOT0pBX0RBVEEgXHVDODE1XHVDODAxIFx1QzJEQ1x1QjREQ1x1QjI5NCBcdUIzNTQgXHVDNzc0XHVDMEMxIFx1Q0MzOFx1Qzg3MFx1RDU1OFx1QzlDMCBcdUM1NEFcdUIyOTRcdUIyRTQuXG4vLyAgIDMuIFx1QzExQ1x1QkM4NCBcdUM3NTFcdUIyRjVcdUM3NzQgXHVCRTQ0XHVCQTc0IFx1RDU3NFx1QjJGOSBcdUMxMzlcdUMxNTggXHVDNzkwXHVDQ0I0XHVCOTdDIFx1QjgwQ1x1QjM1NFx1RDU1OFx1QzlDMCBcdUM1NEFcdUIyOTRcdUIyRTQgKFx1QUU2MVx1RDFCNSBcdUNFNzRcdUI0REMgXHVBRTA4XHVDOUMwKS5cbi8vICAgNC4gXHVCQUE4XHVCNEUwIFx1RDVFQ1x1RDM3QyBcdUQ2MzhcdUNEOUNcdUM3NDAgQkdOSl9HVUFSRC5hcnIvLmNhbGwgXHVCODVDIHRyeS9jYXRjaCArIFx1RDBDMFx1Qzc4NSBcdUFDMDBcdUI0REMgXHVEMUI1XHVBQ0ZDLlxuXG5jb25zdCBEZXN0aW5hdGlvbk1hcE1vZGFsID0gKHsgb25DbG9zZSwgZ28gfSkgPT4ge1xuICBjb25zdCBbc2VsZWN0ZWREZXN0LCBzZXRTZWxlY3RlZERlc3RdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIC8vIHYwMC4wNzcgXHUyMDE0IHVzZU1vZGFsR3VhcmQgXHVEMUI1XHVDNzdDIChFU0MgKyBib2R5IHNjcm9sbCBsb2NrICsgcG9wc3RhdGUpLiBcdUM3N0RcdUFFMzAgXHVDODA0XHVDNkE5IFx1MjE5MiBkaXJ0eT1mYWxzZS5cbiAgd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiBmYWxzZSwgb25DbG9zZSwgb25TYXZlRHJhZnQ6IG51bGwsIGxhYmVsOiAnXHVDNUVDXHVENTg5XHVDOUMwIFx1QzlDMFx1QjNDNCBcdUQwRDBcdUMwQzknIH0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIlx1QzVFQ1x1RDU4OVx1QzlDMCBcdUM5QzBcdUIzQzQgXHVEMEQwXHVDMEM5XCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGluc2V0OjAsIHpJbmRleDoyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6J3JnYmEoMTUsMjMsNDIsMC41NSknLFxuICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgcGFkZGluZzoyMCxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkgb25DbG9zZSgpOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgbWF4V2lkdGg6NjgwLCB3aWR0aDonMTAwJScsIG1heEhlaWdodDonOTJ2aCcsXG4gICAgICAgIG92ZXJmbG93OidhdXRvJywgcGFkZGluZzonMzJweCAyOHB4IDI4cHgnLCBwb3NpdGlvbjoncmVsYXRpdmUnLFxuICAgICAgICBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfSBhcmlhLWxhYmVsPVwiXHVCMkVCXHVBRTMwXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgdG9wOjE0LCByaWdodDoxNCxcbiAgICAgICAgICAgIHdpZHRoOjM2LCBoZWlnaHQ6MzYsIGZvbnRTaXplOjI0LFxuICAgICAgICAgICAgYmFja2dyb3VuZDondHJhbnNwYXJlbnQnLCBib3JkZXI6J25vbmUnLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgY29sb3I6J3ZhcigtLWluay0yKScsIGxpbmVIZWlnaHQ6MSxcbiAgICAgICAgICB9fT5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBzdHlsZT17e21hcmdpbkJvdHRvbToxNH19PkRFU1RJTkFUSU9OUyBcdTAwQjcgXHVDNUVDXHVENTg5XHVDOUMwIFx1QzlDMFx1QjNDNDwvZGl2PlxuICAgICAgICA8aDIgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LWRpc3BsYXkpJywgZm9udFNpemU6MjYsIGZvbnRXZWlnaHQ6OTAwLCBtYXJnaW5Cb3R0b206MTAsIGxpbmVIZWlnaHQ6MS4yfX0+XG4gICAgICAgICAgXHVDOUMwXHVCM0M0XHVCOTdDIFx1RDA3NFx1QjlBRFx1RDU3NCBcdUQwRDBcdUMwQzlcdUQ1NThcdUMxMzhcdUM2OTRcbiAgICAgICAgPC9oMj5cbiAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyMCwgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICBcdUMyRENcdUIzQzRcdUI5N0MgXHVCMjA0XHVCOTc0XHVCQTc0IFx1QzgxNVx1QkNGNFx1QUMwMCBcdUQzQkNcdUNDRDBcdUM5RDFcdUIyQzhcdUIyRTQuIFx1RDYzOFx1QkM4NFx1RDU1OFx1QkE3NCBcdUM5QzBcdUJBODVcdUM3NzQgXHVENDVDXHVDMkRDXHVCNDI5XHVCMkM4XHVCMkU0LlxuICAgICAgICA8L3A+XG4gICAgICAgIHt0eXBlb2YgS29yZWFNYXAgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgPEtvcmVhTWFwXG4gICAgICAgICAgICBvblNlbGVjdD17KGRlc3QpID0+IHNldFNlbGVjdGVkRGVzdChzZWxlY3RlZERlc3Q/LmlkID09PSBkZXN0LmlkID8gbnVsbCA6IGRlc3QpfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkRGVzdD8uaWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7aGVpZ2h0OjMwMCwgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIGNvbG9yOid2YXIoLS1pbmstMyknLCBmb250U2l6ZToxM319Plx1QzlDMFx1QjNDNCBcdUI4NUNcdUI1MjkgXHVDOTExLi4uPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHtzZWxlY3RlZERlc3QgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIG1hcmdpblRvcDoxOCwgcGFkZGluZzonMThweCAyMHB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidiYXNlbGluZScsIGdhcDoxMCwgbWFyZ2luQm90dG9tOjgsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MjIsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo2MDB9fT57c2VsZWN0ZWREZXN0Lm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMTJlbSd9fT57c2VsZWN0ZWREZXN0LmZ1bGxuYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge3NlbGVjdGVkRGVzdC5kZXNjICYmIChcbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxNCwgY29sb3I6J3ZhcigtLWluay0yKScsIGxpbmVIZWlnaHQ6MS43LCBtYXJnaW5Cb3R0b206MTJ9fT57c2VsZWN0ZWREZXN0LmRlc2N9PC9wPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtzZWxlY3RlZERlc3QudGFncyAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjYsIGZsZXhXcmFwOid3cmFwJywgbWFyZ2luQm90dG9tOjE0fX0+XG4gICAgICAgICAgICAgICAge1N0cmluZyhzZWxlY3RlZERlc3QudGFncykuc3BsaXQoJ1x1MDBCNycpLm1hcCgodCkgPT4gdC50cmltKCkpLmZpbHRlcihCb29sZWFuKS5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGtleT17dH0gY2xhc3NOYW1lPVwiYmFkZ2VcIiBzdHlsZT17e2ZvbnRTaXplOjEwfX0+e3R9PC9zcGFuPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiB7IGdvKCd0b3VyJyk7IG9uQ2xvc2UoKTsgfX0+XG4gICAgICAgICAgICAgIFx1Qzc3NCBcdUM5QzBcdUM1RUQgXHVEMjJDXHVDNUI0IFx1QkNGNFx1QUUzMCBcdTIxOTJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdUMxMzlcdUMxNTggXHVCMkU4XHVDNzA0IFx1QzVEMFx1QjdFQyBcdUJDMTRcdUM2QjRcdUIzNTRcdUI5QUMgXHUyMDE0IFx1RDU1QyBcdUMxMzlcdUMxNThcdUM3NzQgXHVCOUREXHVBQzAwXHVDODM4XHVCM0M0IFx1QjJFNFx1Qjk3OCBcdUMxMzlcdUMxNThcdUM3NDAgXHVDODE1XHVDMEMxIFx1QjgwQ1x1QjM1NC5cbmNsYXNzIEhvbWVTZWN0aW9uQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykgeyBzdXBlcihwcm9wcyk7IHRoaXMuc3RhdGUgPSB7IGVycm9yOiBudWxsIH07IH1cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnIpIHsgcmV0dXJuIHsgZXJyb3I6IGVyciB9OyB9XG4gIGNvbXBvbmVudERpZENhdGNoKGVycikge1xuICAgIHRyeSB7IGNvbnNvbGUuZXJyb3IoJ1tIb21lU2VjdGlvbkJvdW5kYXJ5XScsIHRoaXMucHJvcHMubGFiZWwgfHwgJ3NlY3Rpb24nLCBlcnIpOyB9IGNhdGNoIHt9XG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5CR05KX0FQST8uZXJyb3JMb2c/LnJlcG9ydCh7XG4gICAgICAgIGNvZGU6ICdIT01FX1NFQ1RJT05fRVJST1InLCBzdGF0dXM6IG51bGwsIGtpbmQ6ICdyZW5kZXInLFxuICAgICAgICBtZXNzYWdlOiBlcnI/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVyciksXG4gICAgICAgIGhpbnQ6IGBzZWN0aW9uPSR7dGhpcy5wcm9wcy5sYWJlbCB8fCAnJ31gLCB1cmw6ICcnLFxuICAgICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsIG9yaWdpbjogbG9jYXRpb24ub3JpZ2luLFxuICAgICAgfSk/LmNhdGNoPy4oKCkgPT4ge30pO1xuICAgIH0gY2F0Y2gge31cbiAgfVxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIC8vIFx1QkIzNFx1Qzc0QyBcdUFDQTlcdUI5QUMgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QzVEMFx1QUM4QyBcdUJFNDggXHVDNzkwXHVCOUFDIFx1QjMwMFx1QzJFMCBcdUFDMDBcdUJDQkNcdUM2QjQgcGxhY2Vob2xkZXIgXHVENTVDIFx1QzkwNFx1QjlDQyBcdUQ0NUNcdUFFMzBcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzZWN0aW9uIHN0eWxlPXt7cGFkZGluZzonMjRweCAwJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB0ZXh0QWxpZ246J2NlbnRlcid9fT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgbGV0dGVyU3BhY2luZzonMC4xOGVtJ319PlxuICAgICAgICAgICAgXHUyNkEwIHt0aGlzLnByb3BzLmxhYmVsIHx8ICdcdUM3NzQgXHVDMTM5XHVDMTU4J30gXHVDNzQ0IFx1QkQ4OFx1QjdFQ1x1QzYyNFx1QzlDMCBcdUJBQkJcdUQ1ODhcdUMyQjVcdUIyQzhcdUIyRTRcbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59XG5cbi8vIFx1Q0Q5NFx1Q0M5QyBcdUM1RUNcdUQ1ODlcdUM5QzAgXHVDMEMxXHVDMTM4IFx1QkFBOFx1QjJFQyBcdTIwMTQgXHVDRTc0XHVCNERDIFx1RDA3NFx1QjlBRCBcdUMyREMgXHVCMzU0IFx1RDA3MCBcdUM3NzRcdUJCRjhcdUM5QzAgKyBcdUM4MDRcdUNDQjQgXHVDMTI0XHVCQTg1ICsgXHVEMERDXHVBREY4ICsgXHVEMjJDXHVDNUI0IFx1QkNGNFx1QUUzMCBDVEEuXG5jb25zdCBSZWNvbW1lbmRhdGlvbkRldGFpbE1vZGFsID0gKHsgcmVjLCBvbkNsb3NlLCBnbyB9KSA9PiB7XG4gIC8vIHYwMC4wNzcgXHUyMDE0IHVzZU1vZGFsR3VhcmQgXHVEMUI1XHVDNzdDIChFU0MgKyBib2R5IHNjcm9sbCBsb2NrICsgcG9wc3RhdGUpLiBcdUM3N0RcdUFFMzAgXHVDODA0XHVDNkE5IFx1MjE5MiBkaXJ0eT1mYWxzZS5cbiAgd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiBmYWxzZSwgb25DbG9zZSwgb25TYXZlRHJhZnQ6IG51bGwsIGxhYmVsOiByZWM/Lm5hbWUgfHwgJ1x1QzVFQ1x1RDU4OVx1QzlDMCBcdUMwQzFcdUMxMzgnIH0pO1xuICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheShyZWMudGFncylcbiAgICA/IHJlYy50YWdzXG4gICAgOiAodHlwZW9mIHJlYy50YWdzID09PSAnc3RyaW5nJyA/IHJlYy50YWdzLnNwbGl0KC9bLFx1MDBCN10vKS5tYXAoKHMpID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikgOiBbXSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBhcmlhLWxhYmVsPXtgJHtyZWMubmFtZSB8fCAnXHVDRDk0XHVDQzlDJ30gXHVDMEMxXHVDMTM4YH1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGluc2V0OjAsIHpJbmRleDoyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6J3JnYmEoMTUsMjMsNDIsMC41NSknLFxuICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgcGFkZGluZzoyMCxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkgb25DbG9zZSgpOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgbWF4V2lkdGg6NzIwLCB3aWR0aDonMTAwJScsIG1heEhlaWdodDonOTJ2aCcsXG4gICAgICAgIG92ZXJmbG93OidhdXRvJywgcG9zaXRpb246J3JlbGF0aXZlJyxcbiAgICAgICAgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbG9zZX0gYXJpYS1sYWJlbD1cIlx1QjJFQlx1QUUzMFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDoxNCwgcmlnaHQ6MTQsIHpJbmRleDoyLFxuICAgICAgICAgICAgd2lkdGg6MzYsIGhlaWdodDozNiwgZm9udFNpemU6MjQsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgIGNvbG9yOid2YXIoLS1pbmspJywgbGluZUhlaWdodDoxLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICB9fT5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAge3JlYy5pbWFnZURhdGFVcmkgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOicxMDAlJywgaGVpZ2h0OjI4MCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGB1cmwoJHtyZWMuaW1hZ2VEYXRhVXJpfSkgY2VudGVyL2NvdmVyYCxcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICB9fS8+XG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOicyOHB4IDI4cHggMjRweCd9fT5cbiAgICAgICAgICB7cmVjLnJlZ2lvbiAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6J2lubGluZS1ibG9jaycsIHBhZGRpbmc6JzRweCAxMHB4JyxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCxcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBtYXJnaW5Cb3R0b206MTQsXG4gICAgICAgICAgICB9fT57cmVjLnJlZ2lvbn08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZTozMiwgZm9udFdlaWdodDo3MDAsXG4gICAgICAgICAgICBjb2xvcjondmFyKC0taW5rKScsIGxpbmVIZWlnaHQ6MS4yLCBtYXJnaW5Cb3R0b206OCxcbiAgICAgICAgICB9fT57cmVjLm5hbWUgfHwgJ1x1QzgxQ1x1QkFBOSBcdUM1QzZcdUM3NEMnfTwvaDI+XG4gICAgICAgICAge3JlYy5zdWJ0aXRsZSAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMywgZm9udFdlaWdodDo2MDAsXG4gICAgICAgICAgICAgIGNvbG9yOid2YXIoLS1zZWNvbmRhcnkpJywgbGV0dGVyU3BhY2luZzonMC4wNGVtJywgbWFyZ2luQm90dG9tOjE4LFxuICAgICAgICAgICAgfX0+e3JlYy5zdWJ0aXRsZX08L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtyZWMuZGVzYyAmJiAoXG4gICAgICAgICAgICA8cCBzdHlsZT17e2ZvbnRTaXplOjE1LCBsaW5lSGVpZ2h0OjEuODUsIGNvbG9yOid2YXIoLS1pbmstMiknLCBtYXJnaW5Cb3R0b206MjJ9fT57cmVjLmRlc2N9PC9wPlxuICAgICAgICAgICl9XG4gICAgICAgICAge3RhZ3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo2LCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbToyMn19PlxuICAgICAgICAgICAgICB7dGFncy5tYXAoKHQpID0+IChcbiAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZToxMH19Pnt0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEwLCBmbGV4V3JhcDond3JhcCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgcGFkZGluZ1RvcDoxOH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGRcIiBvbkNsaWNrPXsoKSA9PiB7IGdvKCd0b3VyJyk7IG9uQ2xvc2UoKTsgfX0+XHVDNzc0IFx1QzlDMFx1QzVFRCBcdUQyMkNcdUM1QjQgXHVCQ0Y0XHVBRTMwIFx1MjE5MjwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXtvbkNsb3NlfT5cdUIyRUJcdUFFMzA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIHYwMC4wNzIgXHUyMDE0IFx1RDY0OCBcdUNFNzRcdUI0RENcdUM3NTggZGVzY3JpcHRpb24gLyBub3RlIFx1Qjk3QyBcdUM5RTdcdUFDOEMgXHVDNzkwXHVCOTc0XHVCMjk0IFx1RDVFQ1x1RDM3Qy5cbi8vIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUJDRjRcdUFDRTA6IFwiXHVENjQ4XHVDNUQwIFx1QjE3OFx1Q0Q5Q1x1QjQxOFx1QjI5NFx1QUM3NCBcdUM4MDFcdUIyRjlcdUQ3ODggXHVDOTA0XHVDNzc0XHVBQzcwXHVCMDk4IFx1RDY0OFx1QzZBOVx1QzczQ1x1Qjg1QyBcdUI1MzBcdUI4NUMgXHVBRTAwXHVDNzQ0IFx1QzRGMFx1QUM4QyBcdUQ1NzRcdUM1N0NcdUM5QzBcIiBcdTIwMTQgXHVDNkIwXHVDMTIwIHRydW5jYXRlLlxuLy8gXHVDOTA0XHVCQzE0XHVBRkM4XHVDNzQwIFx1QUNGNVx1QkMzMVx1QzczQ1x1Qjg1QyBcdUJDQzBcdUQ2NThcdUQ1NzQgXHVDRTc0XHVCNERDIFx1QjgwOFx1Qzc3NFx1QzU0NFx1QzZDM1x1Qzc3NCBcdUM1NDhcdUM4MTUuIFx1QjJFOFx1QzVCNCBcdUFDQkRcdUFDQzRcdUM1RDAgXHVCOURFXHVDREIwIFx1Qzc5MFx1Qjk3OCBcdUI0QTQgXCJcdTIwMjZcIiBcdUNDQThcdUJEODAuXG5jb25zdCB0cnVuY2F0ZVByZXZpZXcgPSAodGV4dCwgbWF4ID0gMTEwKSA9PiB7XG4gIGNvbnN0IHMgPSBTdHJpbmcodGV4dCB8fCAnJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKTtcbiAgaWYgKHMubGVuZ3RoIDw9IG1heCkgcmV0dXJuIHM7XG4gIC8vIFx1QjJFOFx1QzVCNCBcdUFDQkRcdUFDQzRcdUFFNENcdUM5QzAgYmFja3RyYWNrIFx1MjAxNCBcdUQ1NUNcdUFFMDBcdUM3NDAgXHVBQ0Y1XHVCQzMxXHVDNzc0IFx1QzgwMVx1QzVCNCBiYWNrdHJhY2sgXHVDMkU0XHVEMzI4XHVENTU4XHVCQTc0IFx1QURGOFx1QjBFNSBcdUM3OTBcdUI5NzRcdUFFMzAuXG4gIGNvbnN0IHNsaWNlID0gcy5zbGljZSgwLCBtYXgpO1xuICBjb25zdCBsYXN0U3BhY2UgPSBzbGljZS5sYXN0SW5kZXhPZignICcpO1xuICBjb25zdCBjdXQgPSBsYXN0U3BhY2UgPiBtYXggKiAwLjYgPyBzbGljZS5zbGljZSgwLCBsYXN0U3BhY2UpIDogc2xpY2U7XG4gIHJldHVybiBjdXQgKyAnXHUyMDI2Jztcbn07XG5cbi8vIHYwMC4xMDYgXHUyMDE0IFx1RDY0OCBcdUQ3ODhcdUM1QjRcdUI4NUNcdUM3NTggXHVDOUMwXHVCM0M0IFx1Qzc5MFx1QjlBQy4gXHVCMkU0XHVDNzRDIFx1QUMxNVx1QzVGMCArIFx1QjJFNFx1Qzc0QyBcdUIyRjVcdUMwQUMgXHVCQkY4XHVCMkM4IFx1Q0U3NFx1QjREQy5cbi8vIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM4MUNcdUM1NDggQVx1QzU0ODogJ1x1QUMxNVx1QzVGMC9cdUIyRjVcdUMwQUMgXHVCQkY4XHVCMkM4IFx1Q0U3NFx1QjREQycgKFx1QzZCNFx1QzYwMSBcdUFDMDBcdUNFNTggXHUyMTkxLCBcdUM3QUNcdUJDMjlcdUJCMzggXHVBQzAwXHVDRTU4IFx1MjE5MSkuXG5jb25zdCBIZXJvUHJvZ3JhbUNhcmRzID0gKHsgZ28sIGRhdGFUaWNrIH0pID0+IHtcbiAgLy8gdjAwLjExMCBcdTIwMTQgbW9kdWxlLXNjb3BlIFx1Q0VGNFx1RDNFQ1x1QjEwQ1x1RDJCOFx1QjI5NCBIb21lUGFnZSBcdUM3NTggYGNvbnN0IEcgPSB3aW5kb3cuQkdOSl9HVUFSRDtgIFx1Qjk3QyBcdUMwQUNcdUM2QTkgXHVCQUJCIFx1RDU2OC5cbiAgLy8gd2luZG93LkJHTkpfR1VBUkQgXHVCOTdDIFx1QzlDMVx1QzgxMSBcdUNDMzhcdUM4NzAgKyBcdUM1NDhcdUM4MDRcdUQ1NUMgXHVEM0Y0XHVCQzMxLlxuICBjb25zdCBfYXJyID0gKGZuKSA9PiB7XG4gICAgdHJ5IHsgY29uc3QgdiA9IGZuKCk7IHJldHVybiBBcnJheS5pc0FycmF5KHYpID8gdiA6IFtdOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9XG4gIH07XG4gIC8vIHYwMC4xMTUgXHUyMDE0IHN0YXJ0c0F0IFx1QUMwMCBpbnZhbGlkIFx1RDU1QyByb3cgXHVBQzAwIHNvcnQgXHVDNUQwIFx1QjRFNFx1QzVCNFx1QUMwMFx1QkE3NCBcdUFDQjBcdUFDRkMgXHVDMjFDXHVDMTFDXHVBQzAwIFx1Qzc4NFx1Qzc1OFx1Qjg1QyBcdUFFNjhcdUM5RDAuXG4gIC8vIFx1RDU1QyBcdUJDODggXHVCMzU0IERhdGUucGFyc2UgIWlzTmFOIFx1Qjg1QyBcdUFDNzBcdUI5NzggXHVCNEE0IHNvcnQuXG4gIGNvbnN0IF92YWxpZFN0YXJ0cyA9IChsKSA9PiB7XG4gICAgaWYgKCFsIHx8IGwuaGlkZGVuIHx8ICFsLnN0YXJ0c0F0KSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuICFpc05hTihEYXRlLnBhcnNlKGwuc3RhcnRzQXQpKTtcbiAgfTtcbiAgLy8gdjAwLjEyOSBcdTIwMTQgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QzY5NFx1Q0NBRCAnXHVDOUM0XHVENTg5IFx1QzYwOFx1QzgxNSBcdUFDMTVcdUM1RjBcdUM3NzQgXHVDNUM2XHVDNzNDXHVCQTc0IFx1QzlDMFx1QjA5QyBcdUFDMTVcdUM1RjBcdUM3NDQgXHVCMTc4XHVDRDlDICgzXHVBQzFDIFx1Qzc3NFx1QjBCNCknLlxuICAvLyAxKSBcdUM1QjRcdUM4MUMgXHVDNzc0XHVENkM0IFx1QUMxNVx1QzVGMCBcdUM2QjBcdUMxMjAuIDIpIFx1QzVDNlx1QzczQ1x1QkE3NCBcdUFDMDBcdUM3QTUgXHVDRDVDXHVBREZDIFx1QzlDMFx1QjA5QyBcdUFDMTVcdUM1RjAgM1x1QUMxQ1x1Qjg1QyBcdUQzRjRcdUJDMzEuXG4gIGNvbnN0IGxlY3R1cmVzID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgYWxsID0gX2FycigoKSA9PiB3aW5kb3cuQkdOSl9MRUNUVVJFUz8ubGlzdEFsbD8uKCkpXG4gICAgICAuZmlsdGVyKF92YWxpZFN0YXJ0cyk7XG4gICAgY29uc3QgY3V0b2ZmID0gRGF0ZS5ub3coKSAtIDg2NDAwMDAwO1xuICAgIGNvbnN0IHVwY29taW5nID0gYWxsXG4gICAgICAuZmlsdGVyKChsKSA9PiBuZXcgRGF0ZShsLnN0YXJ0c0F0KS5nZXRUaW1lKCkgPj0gY3V0b2ZmKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGEuc3RhcnRzQXQpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGIuc3RhcnRzQXQpLmdldFRpbWUoKSk7XG4gICAgaWYgKHVwY29taW5nLmxlbmd0aCA+IDApIHJldHVybiB1cGNvbWluZztcbiAgICAvLyBmYWxsYmFjayBcdTIwMTQgXHVBQzAwXHVDN0E1IFx1Q0Q1Q1x1QURGQyBcdUM5QzBcdUIwOUMgXHVBQzE1XHVDNUYwIDNcdUFDMUMgKG5ld2VzdC1maXJzdCkuXG4gICAgcmV0dXJuIGFsbFxuICAgICAgLmZpbHRlcigobCkgPT4gbmV3IERhdGUobC5zdGFydHNBdCkuZ2V0VGltZSgpIDwgY3V0b2ZmKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGIuc3RhcnRzQXQpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGEuc3RhcnRzQXQpLmdldFRpbWUoKSlcbiAgICAgIC5zbGljZSgwLCAzKTtcbiAgfSwgW2RhdGFUaWNrXSk7XG4gIGNvbnN0IHRvdXJzID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIF9hcnIoKCkgPT4gd2luZG93LkJHTkpfVE9VUlM/Lmxpc3RBbGw/LigpKVxuICAgICAgLmZpbHRlcihfdmFsaWRTdGFydHMpXG4gICAgICAuc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYS5zdGFydHNBdCkuZ2V0VGltZSgpIC0gbmV3IERhdGUoYi5zdGFydHNBdCkuZ2V0VGltZSgpKVxuICAgICAgLmZpbHRlcigodCkgPT4gbmV3IERhdGUodC5zdGFydHNBdCkuZ2V0VGltZSgpID49IERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gIH0sIFtkYXRhVGlja10pO1xuXG4gIGNvbnN0IG5leHRMZWN0dXJlID0gbGVjdHVyZXNbMF07XG4gIGNvbnN0IG5leHRUb3VyID0gdG91cnNbMF07XG4gIC8vIHYwMC4xMjkgXHUyMDE0IFx1QUMxNVx1QzVGMFx1Qzc3NCBmYWxsYmFjayAoXHVDOUMwXHVCMDlDIFx1QUMxNVx1QzVGMCBcdUIxNzhcdUNEOUMgXHVCQUE4XHVCNERDKSBcdUM3NzhcdUM5QzAgXHVEMzEwXHVDODE1LiBuZXh0TGVjdHVyZS5zdGFydHNBdCBcdUFDMDAgXHVDNUI0XHVDODFDXHVCQ0Y0XHVCMkU0IFx1QUNGQ1x1QUM3MFx1QkE3NCBwYXN0IG1vZGUuXG4gIGNvbnN0IGxlY3R1cmVJc1Bhc3QgPSBuZXh0TGVjdHVyZSAmJiBuZXh0TGVjdHVyZS5zdGFydHNBdCAmJlxuICAgIChuZXcgRGF0ZShuZXh0TGVjdHVyZS5zdGFydHNBdCkuZ2V0VGltZSgpIDwgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcblxuICAvLyB2MDAuMTEwIFx1MjAxNCBcdUMyRENcdUFDMDQgXHVENDVDXHVDMkRDXHVCMjk0IFx1QzBBQ1x1Qzc3NFx1RDJCOCBcdUM4MDRcdUJDMTggS1NUIFx1QUUzMFx1QzkwMC4gQkdOSl9GTVQua3N0RnJpZW5kbHkgXHVDMEFDXHVDNkE5LlxuICBjb25zdCBmbXREYXRlID0gKGlzbykgPT4ge1xuICAgIGlmICghaXNvKSByZXR1cm4gJyc7XG4gICAgaWYgKHdpbmRvdy5CR05KX0ZNVD8ua3N0RnJpZW5kbHkpIHJldHVybiB3aW5kb3cuQkdOSl9GTVQua3N0RnJpZW5kbHkoaXNvKTtcbiAgICAvLyBcdUQzRjRcdUJDMzEgKEJHTkpfRk1UIFx1QkJGOFx1Qjg1Q1x1QjREQyBcdUMyREMpXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKGlzbyk7XG4gICAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IGRvdyA9IFsnXHVDNzdDJywnXHVDNkQ0JywnXHVENjU0JywnXHVDMjE4JywnXHVCQUE5JywnXHVBRTA4JywnXHVEMUEwJ11bZC5nZXREYXkoKV07XG4gICAgcmV0dXJuIGAke2QuZ2V0TW9udGgoKSsxfS4ke3BhZChkLmdldERhdGUoKSl9ICgke2Rvd30pICR7cGFkKGQuZ2V0SG91cnMoKSl9OiR7cGFkKGQuZ2V0TWludXRlcygpKX1gO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2dyaWQnLCBnYXA6MTR9fT5cbiAgICAgIHsvKiBcdUIyRTRcdUM3NEMgXHVBQzE1XHVDNUYwIFx1Q0U3NFx1QjREQyAqL31cbiAgICAgIDxhcnRpY2xlXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHsgaWYgKG5leHRMZWN0dXJlKSBnbygnbGVjdHVyZXMnKTsgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOicyMHB4IDIycHgnLCBjdXJzb3I6IG5leHRMZWN0dXJlID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnLFxuICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIHRyYW5zaXRpb246J2FsbCAwLjE1cycsXG4gICAgICAgIH19XG4gICAgICAgIHJvbGU9e25leHRMZWN0dXJlID8gJ2J1dHRvbicgOiB1bmRlZmluZWR9XG4gICAgICAgIHRhYkluZGV4PXtuZXh0TGVjdHVyZSA/IDAgOiB1bmRlZmluZWR9XG4gICAgICAgIG9uS2V5RG93bj17KGUpID0+IHsgaWYgKG5leHRMZWN0dXJlICYmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IGdvKCdsZWN0dXJlcycpOyB9IH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCwgbGV0dGVyU3BhY2luZzonMC4yNGVtJywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToxMH19PlxuICAgICAgICAgIHtsZWN0dXJlSXNQYXN0ID8gJ1JFQ0VOVCBMRUNUVVJFIFx1MDBCNyBcdUNENUNcdUFERkMgXHVBQzE1XHVDNUYwJyA6ICdORVhUIExFQ1RVUkUgXHUwMEI3IFx1QjJFNFx1Qzc0QyBcdUFDMTVcdUM1RjAnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge25leHRMZWN0dXJlID8gKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIwLCBtYXJnaW5Cb3R0b206OCwgY29sb3I6J3ZhcigtLWluayknfX0+e25leHRMZWN0dXJlLnRvcGljIHx8IG5leHRMZWN0dXJlLnRpdGxlfTwvaDM+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonYmFzZWxpbmUnLCBmbGV4V3JhcDond3JhcCcsIGdhcDoxMH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NjAwfX0+e2ZtdERhdGUobmV4dExlY3R1cmUuc3RhcnRzQXQpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEyfX0+e25leHRMZWN0dXJlLnZlbnVlIHx8ICdcdUM3QTVcdUMxOEMgXHVCQkY4XHVDODE1J308L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgbWFyZ2luOjB9fT5cbiAgICAgICAgICAgIFx1QzYwOFx1QzgxNVx1QjQxQyBcdUFDMTVcdUM1RjBcdUM3NzQgXHVDNTQ0XHVDOUMxIFx1QzVDNlx1QzJCNVx1QjJDOFx1QjJFNC4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0IGdvbGRcIiBvbkNsaWNrPXsoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBnbygnbGVjdHVyZXMnKTsgfX0+XHVDODA0XHVDQ0I0IFx1QUMxNVx1QzVGMCBcdUJDRjRcdUFFMzAgXHUyMTkyPC9idXR0b24+XG4gICAgICAgICAgPC9wPlxuICAgICAgICApfVxuICAgICAgPC9hcnRpY2xlPlxuXG4gICAgICB7LyogXHVCMkU0XHVDNzRDIFx1QjJGNVx1QzBBQyBcdUNFNzRcdUI0REMgKi99XG4gICAgICA8YXJ0aWNsZVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IGlmIChuZXh0VG91cikgZ28oJ3RvdXInKTsgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOicyMHB4IDIycHgnLCBjdXJzb3I6IG5leHRUb3VyID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnLFxuICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIHRyYW5zaXRpb246J2FsbCAwLjE1cycsXG4gICAgICAgIH19XG4gICAgICAgIHJvbGU9e25leHRUb3VyID8gJ2J1dHRvbicgOiB1bmRlZmluZWR9XG4gICAgICAgIHRhYkluZGV4PXtuZXh0VG91ciA/IDAgOiB1bmRlZmluZWR9XG4gICAgICAgIG9uS2V5RG93bj17KGUpID0+IHsgaWYgKG5leHRUb3VyICYmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IGdvKCd0b3VyJyk7IH0gfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjI0ZW0nLCBjb2xvcjondmFyKC0taW5rLTIpJywgbWFyZ2luQm90dG9tOjEwfX0+XG4gICAgICAgICAgTkVYVCBUT1VSIFx1MDBCNyBcdUIyRTRcdUM3NEMgXHVCMkY1XHVDMEFDXG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7bmV4dFRvdXIgPyAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjAsIG1hcmdpbkJvdHRvbTo4LCBjb2xvcjondmFyKC0taW5rKSd9fT57bmV4dFRvdXIudGl0bGV9PC9oMz5cbiAgICAgICAgICAgIHtuZXh0VG91ci5zdWJ0aXRsZSAmJiAoXG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMywgbWFyZ2luQm90dG9tOjgsIGZvbnRTdHlsZTonaXRhbGljJ319PntuZXh0VG91ci5zdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2Jhc2VsaW5lJywgZmxleFdyYXA6J3dyYXAnLCBnYXA6MTB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZC0yIG1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBmb250V2VpZ2h0OjYwMH19PntmbXREYXRlKG5leHRUb3VyLnN0YXJ0c0F0KX08L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMn19PlxuICAgICAgICAgICAgICAgIHtuZXh0VG91ci5sZXZlbCAmJiA8c3BhbiBzdHlsZT17e21hcmdpblJpZ2h0Ojh9fT57bmV4dFRvdXIubGV2ZWx9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICB7bmV4dFRvdXIuZHVyYXRpb259XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGxpbmVIZWlnaHQ6MS43LCBtYXJnaW46MH19PlxuICAgICAgICAgICAgXHVDNjA4XHVDODE1XHVCNDFDIFx1QjJGNVx1QzBBQ1x1QUMwMCBcdUM1NDRcdUM5QzEgXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3QgZ29sZFwiIG9uQ2xpY2s9eyhlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IGdvKCd0b3VyJyk7IH19Plx1QzgwNFx1Q0NCNCBcdUIyRjVcdUMwQUMgXHVCQ0Y0XHVBRTMwIFx1MjE5MjwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgKX1cbiAgICAgIDwvYXJ0aWNsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIHYwMC4xNTIgXHUyMDE0IFx1RDY0OCBcdUNDNDUgQ1RBIFx1QjJFNFx1QUQ4QyBcdUNFNzRcdUI4RThcdUMxNDAuIHYwMC4xNTEgXHVCMkU4XHVDNzdDLVx1Q0M0NSBJSUZFIFx1Qjk3QyBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjhcdUQ2NTQgKyBcdUM4OENcdUM2QjAgXHVCQjM0XHVENTVDIHdyYXAgKyBhdXRvcGxheS5cbi8vIFx1QjM3MFx1Qzc3NFx1RDEzMCBcdUMxOENcdUMyQTQ6IEJHTkpfQk9PS1MubGlzdCh7c3RhdHVzOidwdWJsaXNoZWQnfSkuIFx1QzgxNVx1QjgyQzogcHJpbWFyeSBcdUM2QjBcdUMxMjAgXHUyMTkyIG9yZGVyLiAwXHVBRDhDXHVDNzc0XHVCQTc0IFx1QzEzOVx1QzE1OCBoaWRlLlxuY29uc3QgQm9va0Nhcm91c2VsU2VjdGlvbiA9ICh7IGdvLCBkYXRhVGljayB9KSA9PiB7XG4gIGNvbnN0IF9hcnIgPSAoZm4pID0+IHsgdHJ5IHsgY29uc3QgdiA9IGZuKCk7IHJldHVybiBBcnJheS5pc0FycmF5KHYpID8gdiA6IFtdOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH07XG4gIC8vIGFkbWluIFx1Qzc1OCBcdUNDNDUgXHVCQ0MwXHVBQ0JEXHVDNzQ0IFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2OCBcdUM1QzZcdUM3NzQgXHVDOTg5XHVDMkRDIFx1QkMxOFx1QzYwMS4gZGF0YVRpY2sgKyBiZ25qLWJvb2tzLXJlZnJlc2ggXHVCNDU4IFx1QjJFNCBcdUNDQURcdUNERTguXG4gIGNvbnN0IFtib29rVGljaywgc2V0Qm9va1RpY2tdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25SID0gKCkgPT4gc2V0Qm9va1RpY2soKHYpID0+IHYgKyAxKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1ib29rcy1yZWZyZXNoJywgb25SKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotYm9va3MtcmVmcmVzaCcsIG9uUik7XG4gIH0sIFtdKTtcbiAgY29uc3QgYm9va3MgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBhbGwgPSBfYXJyKCgpID0+IHdpbmRvdy5CR05KX0JPT0tTPy5saXN0Py4oeyBzdGF0dXM6ICdwdWJsaXNoZWQnIH0pKTtcbiAgICByZXR1cm4gYWxsLnNsaWNlKCkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEucHJpbWFyeSAmJiAhYi5wcmltYXJ5KSByZXR1cm4gLTE7XG4gICAgICBpZiAoIWEucHJpbWFyeSAmJiBiLnByaW1hcnkpIHJldHVybiAxO1xuICAgICAgcmV0dXJuIChhLm9yZGVyID8/IDApIC0gKGIub3JkZXIgPz8gMCk7XG4gICAgfSk7XG4gIH0sIFtkYXRhVGljaywgYm9va1RpY2tdKTtcblxuICBjb25zdCBbaWR4LCBzZXRJZHhdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtwYXVzZWQsIHNldFBhdXNlZF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIC8vIFx1Q0M0NSBcdUJBQTlcdUI4NUQgXHVBRTM4XHVDNzc0IFx1QkNDMFx1QjNEOSBcdUMyREMgaWR4IFx1QzdBQ1x1QzgxNVx1QjgyQy5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYm9va3MubGVuZ3RoID4gMCAmJiBpZHggPj0gYm9va3MubGVuZ3RoKSBzZXRJZHgoMCk7XG4gIH0sIFtib29rcy5sZW5ndGgsIGlkeF0pO1xuXG4gIGNvbnN0IHdyYXAgPSAobikgPT4gYm9va3MubGVuZ3RoID09PSAwID8gMCA6IChuICsgYm9va3MubGVuZ3RoKSAlIGJvb2tzLmxlbmd0aDtcbiAgY29uc3QgZ29QcmV2ID0gKCkgPT4gc2V0SWR4KChpKSA9PiB3cmFwKGkgLSAxKSk7XG4gIGNvbnN0IGdvTmV4dCA9ICgpID0+IHNldElkeCgoaSkgPT4gd3JhcChpICsgMSkpO1xuXG4gIC8vIGF1dG9wbGF5IDdzIFx1MjAxNCAyXHVBRDhDIFx1Qzc3NFx1QzBDMSArIGhvdmVyIFx1QzgxNVx1QzlDMCBcdUM1NDRcdUIyRDAgXHVCNTRDXHVCOUNDLlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChib29rcy5sZW5ndGggPCAyIHx8IHBhdXNlZCkgcmV0dXJuO1xuICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHNldElkeCgoaSkgPT4gd3JhcChpICsgMSkpLCA3MDAwKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHQpO1xuICB9LCBbaWR4LCBib29rcy5sZW5ndGgsIHBhdXNlZF0pO1xuXG4gIGlmIChib29rcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICBjb25zdCBjdXIgPSBib29rc1tpZHhdIHx8IGJvb2tzWzBdO1xuICBjb25zdCBoYXNQcmljZUtSID0gTnVtYmVyKGN1ci5wcmljZUtSKSA+IDA7XG4gIGNvbnN0IGhhc1ByaWNlRU4gPSBOdW1iZXIoY3VyLnByaWNlRU4pID4gMDtcbiAgY29uc3QgeXIgPSBjdXIucHVibGlzaGVkQXQgPyBuZXcgRGF0ZShjdXIucHVibGlzaGVkQXQpLmdldEZ1bGxZZWFyKCkgOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIGNvbnN0IHNob3dDaHJvbWUgPSBib29rcy5sZW5ndGggPiAxO1xuXG4gIHJldHVybiAoXG4gICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUNDNDUgQ1RBXCI+PHNlY3Rpb24gY2xhc3NOYW1lPVwic2VjdGlvblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0UGF1c2VkKHRydWUpfVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0UGF1c2VkKGZhbHNlKX1cbiAgICAgICAgICBzdHlsZT17e3Bvc2l0aW9uOidyZWxhdGl2ZSd9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQgY3RhLWdyaWRcIiBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZzonNzJweCA2MHB4JyxcbiAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxZnIgMWZyJywgZ2FwOjYwLCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmctMiknLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tZXllYnJvd1wiPlx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNEOUNcdUQzMTAgXHUwMEI3IHt5cn08L2Rpdj5cbiAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZTonY2xhbXAoMzZweCwgNHZ3LCA1MnB4KScsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDo2MDAsIGxpbmVIZWlnaHQ6MS4xLCBtYXJnaW5Cb3R0b206MTYsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIFx1MzAwRXtjdXIudGl0bGV9XHUzMDBGXG4gICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgIHtjdXIuZGVzYyAmJiAoXG4gICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxNSwgbGluZUhlaWdodDoxLjg1LCBjb2xvcjondmFyKC0taW5rLTIpJywgbWFyZ2luQm90dG9tOjI4LCB3aGl0ZVNwYWNlOidwcmUtd3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgIHtjdXIuZGVzY31cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHsoaGFzUHJpY2VLUiB8fCBoYXNQcmljZUVOKSAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MjAsIG1hcmdpbkJvdHRvbTozMiwgYWxpZ25JdGVtczonZmxleC1lbmQnfX0+XG4gICAgICAgICAgICAgICAgICB7aGFzUHJpY2VLUiAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgZm9udFdlaWdodDo2MDAsIGxldHRlclNwYWNpbmc6JzAuMThlbScsIGNvbG9yOid2YXIoLS1pbmstMyknfX0+XHVBRDZEXHVCQjM4XHVEMzEwPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjIsIG1hcmdpblRvcDo0LCBjb2xvcjondmFyKC0taW5rKScsIGZvbnRXZWlnaHQ6NzAwfX0+e051bWJlcihjdXIucHJpY2VLUikudG9Mb2NhbGVTdHJpbmcoKX1cdUM2RDA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAge2hhc1ByaWNlS1IgJiYgaGFzUHJpY2VFTiAmJiA8ZGl2IHN0eWxlPXt7d2lkdGg6MSwgYmFja2dyb3VuZDondmFyKC0tbGluZS0yKScsIGFsaWduU2VsZjonc3RyZXRjaCd9fS8+fVxuICAgICAgICAgICAgICAgICAge2hhc1ByaWNlRU4gJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGZvbnRXZWlnaHQ6NjAwLCBsZXR0ZXJTcGFjaW5nOicwLjE4ZW0nLCBjb2xvcjondmFyKC0taW5rLTMpJ319Plx1QzYwMVx1QkIzOFx1RDMxMDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIyLCBtYXJnaW5Ub3A6NCwgY29sb3I6J3ZhcigtLWluayknLCBmb250V2VpZ2h0OjcwMH19PntOdW1iZXIoY3VyLnByaWNlRU4pLnRvTG9jYWxlU3RyaW5nKCl9XHVDNkQwPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGRcIiBvbkNsaWNrPXsoKSA9PiBnbygnYm9vaycpfT5cdUFENkNcdUI5RTRcdUQ1NThcdUFFMzAgXHUyMTkyPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYXNwZWN0UmF0aW86JzMvNCcsIG1heFdpZHRoOjI4MCwgbWFyZ2luOicwIGF1dG8nLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJyxcbiAgICAgICAgICAgICAgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIG92ZXJmbG93OidoaWRkZW4nLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtjdXIuY292ZXJEYXRhVXJpID8gKFxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtjdXIuY292ZXJEYXRhVXJpfSBhbHQ9e2Ake2N1ci50aXRsZX0gXHVENDVDXHVDOUMwYH1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7d2lkdGg6JzEwMCUnLCBoZWlnaHQ6JzEwMCUnLCBvYmplY3RGaXQ6J2NvdmVyJywgZGlzcGxheTonYmxvY2snfX0vPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3t0ZXh0QWxpZ246J2NlbnRlcicsIHBhZGRpbmc6JzAgMjRweCd9fT5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LXNlcmlmKScsIGZvbnRTaXplOjI4LCBjb2xvcjondmFyKC0taW5rKScsIG1hcmdpbkJvdHRvbToxMCwgZm9udFdlaWdodDo2MDB9fT57Y3VyLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZTo5LCBmb250V2VpZ2h0OjYwMCwgY29sb3I6J3ZhcigtLWluay0zKScsIGxldHRlclNwYWNpbmc6JzAuMmVtJ319PntjdXIuYXV0aG9yIHx8ICdcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAnfSBcdUM5QzBcdUM3NEM8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAge3Nob3dDaHJvbWUgJiYgKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1sYWJlbD1cIlx1Qzc3NFx1QzgwNCBcdUNDNDVcIiBvbkNsaWNrPXtnb1ByZXZ9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIGxlZnQ6LTgsIHRvcDonNTAlJywgdHJhbnNmb3JtOid0cmFuc2xhdGUoLTEwMCUsIC01MCUpJyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOjQ0LCBoZWlnaHQ6NDQsIGJvcmRlclJhZGl1czonNTAlJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgY29sb3I6J3ZhcigtLWluayknLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTonZ3JpZCcsIHBsYWNlSXRlbXM6J2NlbnRlcicsIGZvbnRTaXplOjIyLCBmb250V2VpZ2h0OjYwMCwgbGluZUhlaWdodDoxLFxuICAgICAgICAgICAgICAgIH19Plx1MjAzOTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWxhYmVsPVwiXHVCMkU0XHVDNzRDIFx1Q0M0NVwiIG9uQ2xpY2s9e2dvTmV4dH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgcmlnaHQ6LTgsIHRvcDonNTAlJywgdHJhbnNmb3JtOid0cmFuc2xhdGUoMTAwJSwgLTUwJSknLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6NDQsIGhlaWdodDo0NCwgYm9yZGVyUmFkaXVzOic1MCUnLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBjb2xvcjondmFyKC0taW5rKScsIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJywgZm9udFNpemU6MjIsIGZvbnRXZWlnaHQ6NjAwLCBsaW5lSGVpZ2h0OjEsXG4gICAgICAgICAgICAgICAgfX0+XHUyMDNBPC9idXR0b24+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7c2hvd0Nocm9tZSAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonY2VudGVyJywgZ2FwOjgsIG1hcmdpblRvcDoxOH19PlxuICAgICAgICAgICAge2Jvb2tzLm1hcCgoYiwgaSkgPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT17Yi5pZCB8fCBpfSB0eXBlPVwiYnV0dG9uXCIgYXJpYS1sYWJlbD17YCR7aSsxfVx1QkM4OFx1QzlGOCBcdUNDNDVcdUM3M0NcdUI4NUMgXHVDNzc0XHVCM0Q5YH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJZHgoaSl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiBpID09PSBpZHggPyAyNCA6IDgsIGhlaWdodDogOCwgcGFkZGluZzogMCxcbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNCwgYm9yZGVyOiAnbm9uZScsIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogaSA9PT0gaWR4ID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lLTIpJyxcbiAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4ycycsXG4gICAgICAgICAgICAgICAgfX0vPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L3NlY3Rpb24+PC9Ib21lU2VjdGlvbkJvdW5kYXJ5PlxuICApO1xufTtcblxuY29uc3QgSG9tZVBhZ2UgPSAoeyBnbyB9KSA9PiB7XG4gIGNvbnN0IFttYXBPcGVuLCBzZXRNYXBPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3NjVGljaywgc2V0U2NUaWNrXSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCBbZGF0YVRpY2ssIHNldERhdGFUaWNrXSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuXG4gIC8vIFNFTy9IZXJvL0JyYW5kIHJlZnJlc2ggXHUyMDE0IFx1Qzk4OVx1QzJEQyBcdUM3QUNcdUI4MENcdUIzNTRcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblIgPSAoKSA9PiBzZXRTY1RpY2soKHYpID0+IHYgKyAxKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1zaXRlLWNvbnRlbnQtcmVmcmVzaCcsIG9uUik7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZ25qLXNpdGUtY29udGVudC1yZWZyZXNoJywgb25SKTtcbiAgfSwgW10pO1xuXG4gIC8vIFx1QzExQ1x1QkM4NCBcdUIzNzBcdUM3NzRcdUQxMzAgcmVmcmVzaCBcdUM3NzRcdUJDQTRcdUQyQjggXHUyMDE0IFx1QzJFNFx1QzgxQyBcdUJDMUNcdUQ2NTQgXHVDNzc0XHVCOTg0XHVBQ0ZDIFx1Qzc3Q1x1Q0U1OCAoZGF0YS5qcyBcdUNDMzhcdUFDRTApLlxuICAvLyBiZ25qLXBvc3RzLXJlZnJlc2g6IFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdUFDOENcdUMyRENcdUFFMDAgLyBiZ25qLWNvbHVtbnMtcmVmcmVzaDogXHVDRTdDXHVCN0ZDIC8gYmduai10b3Vycy1yZWZyZXNoOiBcdUIyRjVcdUMwQUMgLyBiZ25qLWxlY3R1cmVzLXJlZnJlc2g6IFx1QUMxNVx1QzVGMCAvIGJnbmotc2l0ZS1jb250ZW50LXJlZnJlc2g6IFx1Q0Q5NFx1Q0M5QyhcdUM3NzRcdUJCRjggXHVDNzA0XHVDNUQwXHVDMTFDIGxpc3RlbilcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCB0aWNrID0gKCkgPT4gc2V0RGF0YVRpY2soKHYpID0+IHYgKyAxKTtcbiAgICBjb25zdCBldnRzID0gWydiZ25qLWNvbHVtbnMtcmVmcmVzaCcsICdiZ25qLXRvdXJzLXJlZnJlc2gnLCAnYmduai1sZWN0dXJlcy1yZWZyZXNoJywgJ2JnbmotcG9zdHMtcmVmcmVzaCddO1xuICAgIGV2dHMuZm9yRWFjaCgoZSkgPT4gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGljaykpO1xuICAgIHJldHVybiAoKSA9PiBldnRzLmZvckVhY2goKGUpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGUsIHRpY2spKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IHNjID0gUmVhY3QudXNlTWVtbygoKSA9PiAod2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9KSwgW3NjVGlja10pO1xuICBjb25zdCBoZXJvID0gc2MuaGVybyB8fCB7fTtcbiAgLy8gXHVCQUE4XHVCQzE0XHVDNzdDIFx1QkQ4NFx1QUUzMCBcdTIwMTQgbWF0Y2hNZWRpYSBcdUJDQzBcdUFDQkQgXHVDMkRDIFx1Qzc5MFx1QjNEOSBcdUM3QUNcdUI4MENcdUIzNTQgKGhlcm9TdHlsZSBcdUIzQzQgXHVBQzMxXHVDMkUwKS5cbiAgY29uc3QgW2lzTW9iaWxlLCBzZXRJc01vYmlsZV0gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgdHJ5IHsgcmV0dXJuICEhKHdpbmRvdy5tYXRjaE1lZGlhICYmIHdpbmRvdy5tYXRjaE1lZGlhKCcobWF4LXdpZHRoOiA2MDBweCknKS5tYXRjaGVzKTsgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9KTtcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbXEgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogNjAwcHgpJyk7XG4gICAgICBjb25zdCBoYW5kbGVyID0gKGUpID0+IHNldElzTW9iaWxlKGUubWF0Y2hlcyk7XG4gICAgICBpZiAobXEuYWRkRXZlbnRMaXN0ZW5lcikgbXEuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaGFuZGxlcik7XG4gICAgICBlbHNlIGlmIChtcS5hZGRMaXN0ZW5lcikgbXEuYWRkTGlzdGVuZXIoaGFuZGxlcik7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAobXEucmVtb3ZlRXZlbnRMaXN0ZW5lcikgbXEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIGVsc2UgaWYgKG1xLnJlbW92ZUxpc3RlbmVyKSBtcS5yZW1vdmVMaXN0ZW5lcihoYW5kbGVyKTtcbiAgICAgIH07XG4gICAgfSBjYXRjaCB7fVxuICB9LCBbXSk7XG4gIGNvbnN0IGhlcm9TdHlsZSA9IFJlYWN0LnVzZU1lbW8oXG4gICAgKCkgPT4gKHdpbmRvdy5CR05KX0hFUk9fU1RZTEU/Lihpc01vYmlsZSA/ICdtb2JpbGUnIDogJ2Rlc2t0b3AnKSB8fCB3aW5kb3cuQkdOSl9IRVJPX1NUWUxFX0RFRkFVTFQpLFxuICAgIFtzY1RpY2ssIGlzTW9iaWxlXVxuICApO1xuICBjb25zdCByZWNvbW1lbmRhdGlvbnMgPSBBcnJheS5pc0FycmF5KHNjLnJlY29tbWVuZGF0aW9ucykgPyBzYy5yZWNvbW1lbmRhdGlvbnMuZmlsdGVyKEJvb2xlYW4pIDogW107XG4gIGNvbnN0IFtyZWNEZXRhaWwsIHNldFJlY0RldGFpbF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcblxuICAvLyBcdUMyRTRcdUIzNzBcdUM3NzRcdUQxMzBcdUI5Q0MgXHUyMDE0IFx1QzJEQ1x1QjREQyBcdUQzRjRcdUJDMzEgXHVDODFDXHVBQzcwLiBcdUJBQThcdUI0RTAgXHVENUVDXHVEMzdDIFx1RDYzOFx1Q0Q5Q1x1Qzc0MCBCR05KX0dVQVJELmFyciBcdUI4NUMgdHJ5L2NhdGNoICsgQXJyYXkgXHVBQzAwXHVCNERDLlxuICAvLyB2MDAuMTE1IFx1MjAxNCBCR05KX0dVQVJEIFx1QkJGOFx1Qjg1Q1x1QjREQyAoc2NyaXB0IFx1Qjg1Q1x1QjREQyByYWNlKSBcdUMyREMgXHVDNzc4XHVCNzdDXHVDNzc4IGZhbGxiYWNrIFx1QzczQ1x1Qjg1QyBcdUQzOThcdUM3NzRcdUM5QzAgXHVBRTY4XHVDOUQwIFx1QkMyOVx1QzlDMC5cbiAgY29uc3QgRyA9IHdpbmRvdy5CR05KX0dVQVJEIHx8IHtcbiAgICBhcnI6IChmbikgPT4geyB0cnkgeyBjb25zdCB2ID0gZm4oKTsgcmV0dXJuIEFycmF5LmlzQXJyYXkodikgPyB2IDogW107IH0gY2F0Y2ggeyByZXR1cm4gW107IH0gfSxcbiAgICBjYWxsOiAoZm4sIGZiKSA9PiB7IHRyeSB7IGNvbnN0IHYgPSBmbigpOyByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gZmIgOiB2OyB9IGNhdGNoIHsgcmV0dXJuIGZiOyB9IH0sXG4gIH07XG4gIC8vIFx1QzcyMFx1RDZBOFx1RDU1QyBzdGFydHNBdChcdUQzMENcdUMyRjEgXHVBQzAwXHVCMkE1XHVENTVDIFx1QjBBMFx1QzlEQykgXHVCOUNDIFx1RDFCNVx1QUNGQyBcdTIwMTQgTmFOIGdldFRpbWUgXHVDNzNDXHVCODVDIHNvcnQgXHVBQ0IwXHVBQ0ZDXHVBQzAwIFx1QUU2OFx1QzlDMFx1QjI5NCBcdUFDODMgXHVCQzI5XHVDOUMwLlxuICBjb25zdCBfaGFzVmFsaWREYXRlID0gKGlzbykgPT4ge1xuICAgIGlmICghaXNvKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgdCA9IERhdGUucGFyc2UoaXNvKTtcbiAgICByZXR1cm4gIWlzTmFOKHQpO1xuICB9O1xuICBjb25zdCBwdWJsaWNDb2x1bW5zID0gUmVhY3QudXNlTWVtbygoKSA9PiBHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9DT0xVTU5TPy5saXN0UHVibGljPy4oKSksIFtkYXRhVGlja10pO1xuICBjb25zdCBmZWF0dXJlZENvbHVtbiA9IHB1YmxpY0NvbHVtbnNbMF07XG4gIGNvbnN0IHNlY29uZGFyeUNvbHVtbnMgPSBwdWJsaWNDb2x1bW5zLnNsaWNlKDEsIDUpO1xuICBjb25zdCByZWNlbnRQb3N0cyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5saXN0UG9zdHM/LigpKS5zbGljZSgwLCA0KSwgW2RhdGFUaWNrXSk7XG4gIGNvbnN0IHRvdXJzID0gUmVhY3QudXNlTWVtbygoKSA9PiBHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9UT1VSUz8ubGlzdEFsbD8uKCkpLmZpbHRlcigodCkgPT4gdCAmJiAhdC5oaWRkZW4pLnNsaWNlKDAsIDQpLCBbZGF0YVRpY2tdKTtcbiAgY29uc3QgbGVjdHVyZXMgPSBSZWFjdC51c2VNZW1vKCgpID0+IEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0xFQ1RVUkVTPy5saXN0QWxsPy4oKSkuZmlsdGVyKChsKSA9PiBsICYmICFsLmhpZGRlbikuc2xpY2UoMCwgMyksIFtkYXRhVGlja10pO1xuXG4gIC8vIGhlcm8uc3RhdHMgXHVBQzAwIFx1Qzc4OFx1QzczQ1x1QkE3NCBcdUNGNThcdUQxNTBcdUNFMjAobGFiZWwvc3ViL3ZhbHVlRmFsbGJhY2spIFx1Qjk3QyBcdUFDNzBcdUFFMzBcdUMxMUMuIFx1QjNEOVx1QzgwMSB2YWx1ZShcdUQyMkNcdUM1QjQvXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwIFx1QUMyRlx1QzIxOCkgXHVCMjk0IFx1Q0Y1NFx1QjREQyBcdUNFMjEgXHVDNkIwXHVDMTIwLlxuICBjb25zdCBoZXJvU3RhdHMgPSBBcnJheS5pc0FycmF5KGhlcm8uc3RhdHMpICYmIGhlcm8uc3RhdHMubGVuZ3RoID09PSAzID8gaGVyby5zdGF0cyA6IFtcbiAgICB7IGxhYmVsOiAnXHVDNUVDXHVENTg5XHVDOUMwJywgICBzdWI6ICdcdUM4RkNcdUM2OTQgXHVCMkY1XHVDMEFDXHVDOUMwIFx1QzZCNFx1QzYwMScsICAgdmFsdWVGYWxsYmFjazogJ1x1QzgwNFx1QUQ2RCcgICAgfSxcbiAgICB7IGxhYmVsOiAnXHVEMjJDXHVDNUI0JywgICAgIHN1YjogJ1x1QzlDMVx1QzgxMSBcdUFFMzBcdUQ2OEQgXHVENTA0XHVCODVDXHVBREY4XHVCN0E4JywgdmFsdWVGYWxsYmFjazogJ1x1QzkwMFx1QkU0NCBcdUM5MTEnIH0sXG4gICAgeyBsYWJlbDogJ1x1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCcsIHN1YjogJ1x1RDU2OFx1QUVEOCBcdUI5Q0NcdUI0RENcdUIyOTQgXHVDNUVDXHVENTg5JywgICB2YWx1ZUZhbGxiYWNrOiAnXHVDNkI0XHVDNjAxIFx1QzkxMScgfSxcbiAgXTtcbiAgY29uc3Qgc3RhdHMgPSBbXG4gICAgeyBsOiBoZXJvU3RhdHNbMF0ubGFiZWwsIHY6IGhlcm9TdGF0c1swXS52YWx1ZUZhbGxiYWNrIHx8ICdcdUM4MDRcdUFENkQnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgczogaGVyb1N0YXRzWzBdLnN1YiB9LFxuICAgIHsgbDogaGVyb1N0YXRzWzFdLmxhYmVsLCB2OiB0b3Vycy5sZW5ndGggPiAwID8gYCR7dG91cnMubGVuZ3RofVx1QUMxQ2AgOiAoaGVyb1N0YXRzWzFdLnZhbHVlRmFsbGJhY2sgfHwgJ1x1QzkwMFx1QkU0NCBcdUM5MTEnKSwgICAgIHM6IGhlcm9TdGF0c1sxXS5zdWIgfSxcbiAgICB7IGw6IGhlcm9TdGF0c1syXS5sYWJlbCwgdjogcmVjZW50UG9zdHMubGVuZ3RoID4gMCA/IGAke3JlY2VudFBvc3RzLmxlbmd0aH0rYCA6IChoZXJvU3RhdHNbMl0udmFsdWVGYWxsYmFjayB8fCAnXHVDNkI0XHVDNjAxIFx1QzkxMScpLCBzOiBoZXJvU3RhdHNbMl0uc3ViIH0sXG4gIF07XG5cbiAgY29uc3QgY2xpY2thYmxlID0gKG9uQ2xpY2ssIGxhYmVsKSA9PiAoe1xuICAgIHJvbGU6J2J1dHRvbicsIHRhYkluZGV4OjAsICdhcmlhLWxhYmVsJzpsYWJlbCwgb25DbGljayxcbiAgICBvbktleURvd246KGUpID0+IHsgaWYgKGUua2V5PT09J0VudGVyJ3x8ZS5rZXk9PT0nICcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBvbkNsaWNrKCk7IH0gfSxcbiAgICBzdHlsZTp7Y3Vyc29yOidwb2ludGVyJ30sXG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIHttYXBPcGVuICYmIDxEZXN0aW5hdGlvbk1hcE1vZGFsIG9uQ2xvc2U9eygpID0+IHNldE1hcE9wZW4oZmFsc2UpfSBnbz17Z299Lz59XG4gICAgICB7cmVjRGV0YWlsICYmIDxSZWNvbW1lbmRhdGlvbkRldGFpbE1vZGFsIHJlYz17cmVjRGV0YWlsfSBvbkNsb3NlPXsoKSA9PiBzZXRSZWNEZXRhaWwobnVsbCl9IGdvPXtnb30vPn1cblxuICAgICAgey8qIHYwMC4xNDMgXHUyMDE0IFx1QzYyNFx1RDUwOCBcdUM1NDhcdUIwQjQgXHVCQzMwXHVCMTA4XHVCMjk0IGJvb3QuanN4IFx1Qjg1QyBcdUM3NzRcdUIzRDkgKHNpdGV3aWRlLCBcdUJBNTRcdUIyNzQgXHVDNzA0XHVDQUJEKS4gKi99XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgSEVSTyAoXHVEMTREXHVDMkE0XHVEMkI4ICsgXHVDNkIwXHVDRTIxIFx1QzlDMFx1QjNDNCBcdUJCRjhcdUI5QUNcdUJDRjRcdUFFMzAsIFx1QkFBOFx1QkMxNFx1Qzc3QyAxXHVCMkU4KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1RDc4OFx1QzVCNFx1Qjg1Q1wiPjxzZWN0aW9uIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOidyZWxhdGl2ZScsIG92ZXJmbG93OidoaWRkZW4nLFxuICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgIHBhZGRpbmc6JzcycHggMCA4OHB4JyxcbiAgICAgIH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyby1ncmlkXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxLjJmciAxZnInLCBnYXA6NTYsIGFsaWduSXRlbXM6J2NlbnRlcicsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7LyogXHVDODhDXHVDRTIxOiBcdUQxNERcdUMyQTRcdUQyQjggXHUyMDE0IGhlcm9TdHlsZSBcdUQyQjhcdUM3MTcoXHVBRDAwXHVCOUFDXHVDNzkwICdcdUQ3ODhcdUM1QjRcdUI4NUMnIFx1RDBFRCkgXHVDNzc4XHVCNzdDXHVDNzc4IFx1QzgwMVx1QzZBOSAqL31cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3t0ZXh0QWxpZ246IGhlcm9TdHlsZS50aXRsZS50ZXh0QWxpZ24gfHwgJ2xlZnQnfX0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogaGVyb1N0eWxlLmV5ZWJyb3cuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLmV5ZWJyb3cuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBgJHtoZXJvU3R5bGUuZXllYnJvdy5sZXR0ZXJTcGFjaW5nfWVtYCxcbiAgICAgICAgICAgICAgICBjb2xvcjogYHZhcigke2hlcm9TdHlsZS5leWVicm93LmNvbG9yfSlgLFxuICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06IGhlcm9TdHlsZS5leWVicm93LnRleHRUcmFuc2Zvcm0gfHwgJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIDxzcGFuPntoZXJvLmV5ZWJyb3cgfHwgXCJCQU5HSU5PSkEgXHUwMEI3IFx1QkM0NVx1QUUzMFx1RDBDMFx1QUNFMCBcdUIxNzhcdUM3OTBcIn08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8aDEgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LWRpc3BsYXkpJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogYGNsYW1wKDM2cHgsIDV2dywgJHtoZXJvU3R5bGUudGl0bGUuZm9udFNpemV9cHgpYCxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBoZXJvU3R5bGUudGl0bGUuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiBoZXJvU3R5bGUudGl0bGUubGluZUhlaWdodCxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBgJHtoZXJvU3R5bGUudGl0bGUubGV0dGVyU3BhY2luZ31lbWAsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOjIyLFxuICAgICAgICAgICAgICAgIGNvbG9yOmB2YXIoJHtoZXJvU3R5bGUudGl0bGUuY29sb3J9KWAsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHtoZXJvLnRpdGxlMSB8fCBcIlx1QkM0NVx1QUUzMFx1RDBDMFx1QUNFMFwifTxici8+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tjb2xvcjpgdmFyKCR7aGVyb1N0eWxlLnRpdGxlLmFjY2VudENvbG9yfSlgfX0+e2hlcm8udGl0bGUyIHx8IFwiXHVENTVDXHVBRDZEXHVDNzQ0XCJ9PC9zcGFuPjxici8+XG4gICAgICAgICAgICAgICAge2hlcm8udGl0bGUzIHx8IFwiXHVCMjkwXHVCMDdDXHVCMkU0XCJ9XG4gICAgICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImJnbmotbXVsdGlsaW5lXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogaGVyb1N0eWxlLnN1YnRpdGxlLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IGhlcm9TdHlsZS5zdWJ0aXRsZS5saW5lSGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNvbG9yOiBgdmFyKCR7aGVyb1N0eWxlLnN1YnRpdGxlLmNvbG9yfSlgLFxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBoZXJvU3R5bGUuc3VidGl0bGUubWF4V2lkdGgsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOjMyLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGhlcm9TdHlsZS5zdWJ0aXRsZS5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IGhlcm9TdHlsZS50aXRsZS50ZXh0QWxpZ24gPT09ICdjZW50ZXInID8gJ2F1dG8nIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiBoZXJvU3R5bGUudGl0bGUudGV4dEFsaWduID09PSAnY2VudGVyJyA/ICdhdXRvJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAge2hlcm8uc3VidGl0bGUgfHwgXCJcdUFEODFcdUFEOTAgXHVCMkY1XHVDMEFDXHVCRDgwXHVEMTMwIFx1QzlDMFx1QzVFRCBcdUM1RUNcdUQ1ODkgXHVDRjU0XHVDMkE0XHVBRTRDXHVDOUMwLiBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUM2NDAgXHVENTY4XHVBRUQ4IFx1RDU1Q1x1QUQ2RFx1Qzc1OCBcdUM1RURcdUMwQUNcdTAwQjdcdUJCMzhcdUQ2NTRcdTAwQjdcdUM3OTBcdUM1RjBcdUM3NDQgXHVDNjI4XHVCQUI4XHVDNzNDXHVCODVDIFx1QUNCRFx1RDVEOFx1RDU1OFx1QjI5NCBcdUM1RUNcdUQ1ODkgXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwXHVDNzg1XHVCMkM4XHVCMkU0LlwifVxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OidmbGV4JywgZ2FwOjEyLCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbTo0MCxcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogaGVyb1N0eWxlLnRpdGxlLnRleHRBbGlnbiA9PT0gJ2NlbnRlcicgPyAnY2VudGVyJyA6IChoZXJvU3R5bGUudGl0bGUudGV4dEFsaWduID09PSAncmlnaHQnID8gJ2ZsZXgtZW5kJyA6ICdmbGV4LXN0YXJ0JyksXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLmN0YS5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICB7LyogdjAwLjE1MiBcdTIwMTQgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QzY5NFx1Q0NBRCAnXHVDOUMwXHVCM0M0XHVDNUQwXHVDMTFDIFx1QzVFQ1x1RDU4OVx1QzlDMCBcdUNDM0VcdUFFMzAgXHVCQzg0XHVEMkJDIFx1QzBBRFx1QzgxQycuICovfVxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkXCIgb25DbGljaz17KCkgPT4gZ28oJ2NvbW11bml0eScpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tmb250V2VpZ2h0OiBoZXJvU3R5bGUuY3RhLmZvbnRXZWlnaHR9fT5cbiAgICAgICAgICAgICAgICAgIHtoZXJvLmN0YVByaW1hcnkgfHwgXCJcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVDQzM4XHVDNUVDXHVENTU4XHVBRTMwXCJ9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXsoKSA9PiBnbygndG91cicpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tmb250V2VpZ2h0OiBoZXJvU3R5bGUuY3RhLmZvbnRXZWlnaHR9fT5cbiAgICAgICAgICAgICAgICAgIHtoZXJvLmN0YVNlY29uZGFyeSB8fCBcIlx1RDIyQ1x1QzVCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QTggXHVCQ0Y0XHVBRTMwXCJ9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm8tc3RhdHNcIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOidyZXBlYXQoMywxZnIpJywgZ2FwOjIwLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6MjQsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAge3N0YXRzLm1hcCgoc3RhdCkgPT4gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3N0YXQubH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LXNlcmlmKScsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IGhlcm9TdHlsZS5zdGF0cy52YWx1ZS5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBoZXJvU3R5bGUuc3RhdHMudmFsdWUuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYHZhcigke2hlcm9TdHlsZS5zdGF0cy52YWx1ZS5jb2xvcn0pYCxcbiAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206NCxcbiAgICAgICAgICAgICAgICAgICAgfX0+e3N0YXQudn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBoZXJvU3R5bGUuc3RhdHMubGFiZWwuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogaGVyb1N0eWxlLnN0YXRzLmxhYmVsLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogYCR7aGVyb1N0eWxlLnN0YXRzLmxhYmVsLmxldHRlclNwYWNpbmd9ZW1gLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBgdmFyKCR7aGVyb1N0eWxlLnN0YXRzLmxhYmVsLmNvbG9yfSlgLFxuICAgICAgICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06IGhlcm9TdHlsZS5zdGF0cy5sYWJlbC50ZXh0VHJhbnNmb3JtIHx8ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTozLFxuICAgICAgICAgICAgICAgICAgICB9fT57c3RhdC5sfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IGhlcm9TdHlsZS5zdGF0cy5zdWIuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtoZXJvU3R5bGUuc3RhdHMuc3ViLmNvbG9yfSlgLFxuICAgICAgICAgICAgICAgICAgICB9fT57c3RhdC5zfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBcdUM2QjBcdUNFMjE6IFx1QzlDMFx1QjNDNCBcdUJCRjhcdUI5QUNcdUJDRjRcdUFFMzAgXHUyMDE0IFx1QzJEQ1x1QjNDNCBcdUQwNzRcdUI5QUQgXHUyMTkyIFx1QzgwNFx1Q0NCNCBcdUJBQThcdUIyRUMgKGExMXk6IFx1QzY3OFx1QUNGRCBkaXYgXHVCMjk0IFx1QjJFOFx1QzIxQyBcdUNFRThcdUQxNENcdUM3NzRcdUIxMDgsIFx1QzJFNFx1QzgxQyBcdUJDODRcdUQyQkNcdUM3NDAgcmVnaW9uIHBhdGggXHVDNjQwIFx1QzZCMFx1QzBDMVx1QjJFOCBcdUQxNERcdUMyQTRcdUQyQjggXHVCQzg0XHVEMkJDKS4gXHVEM0YwKFx1MjI2NDYwMHB4KSBcdUM1RDBcdUMxMUNcdUIyOTQgaGVyby1tYXAtcHJldmlldyBDU1MgXHVCODVDIFx1QzIyOFx1QUU0MCArIENUQSBcdUJDODRcdUQyQkNcdUI5Q0MgXHVCMTc4XHVDRDlDLiAqL31cbiAgICAgICAgICAgIHsvKiB2MDAuMTA2IFx1MjAxNCBcdUM5QzBcdUIzQzQgXHUyMTkyIFx1QjJFNFx1Qzc0QyBcdUFDMTVcdUM1RjAgLyBcdUIyRTRcdUM3NEMgXHVCMkY1XHVDMEFDIFx1QkJGOFx1QjJDOCBcdUNFNzRcdUI0REMgKEFcdUM1NDgpICovfVxuICAgICAgICAgICAgPEhlcm9Qcm9ncmFtQ2FyZHMgZ289e2dvfSBkYXRhVGljaz17ZGF0YVRpY2t9Lz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cblxuICAgICAgey8qIFx1MjUwMFx1MjUwMCBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVDRDk0XHVDQzlDIChcdUFEMDBcdUI5QUNcdUM3OTAgXHVDRjU4XHVEMTUwXHVDRTIwIFx1RDMyOFx1QjExMFx1QzVEMFx1QzExQyBcdUNEOTRcdUFDMDApIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIHtyZWNvbW1lbmRhdGlvbnMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxIb21lU2VjdGlvbkJvdW5kYXJ5IGxhYmVsPVwiXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0Q5NFx1Q0M5Q1wiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb25cIiBzdHlsZT17e2JhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAvLyB2MDAuMDgzIFx1MjAxNCBzaXRlX2NvbnRlbnRfa3YucmVjb21tZW5kYXRpb25zSGVhZGluZyBcdUM1RDBcdUMxMUMgaGVybyBcdUM3N0RcdUM3NEMgKHYwMC4wNzMgc3dlZXAgXHVCQkY4XHVDNjQ0IFx1Qzc5NFx1QzdBQykuXG4gICAgICAgICAgICAgIGNvbnN0IF9pID0gKHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fSkucmVjb21tZW5kYXRpb25zSGVhZGluZyB8fCB7fTtcbiAgICAgICAgICAgICAgY29uc3QgZWIgPSBfaS5leWVicm93ICAgICAgfHwgJ1JFQ09NTUVOREFUSU9OUyBcdTAwQjcgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0Q5NFx1Q0M5Qyc7XG4gICAgICAgICAgICAgIGNvbnN0IHRwID0gX2kudGl0bGVQcmVmaXggID8/ICdcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUFDMDAgJztcbiAgICAgICAgICAgICAgY29uc3QgdGEgPSBfaS50aXRsZUFjY2VudCAgPz8gJ1x1Q0Q5NFx1Q0M5Qyc7XG4gICAgICAgICAgICAgIGNvbnN0IHRzID0gX2kudGl0bGVTdWZmaXggID8/ICdcdUQ1NjlcdUIyQzhcdUIyRTQnO1xuICAgICAgICAgICAgICBjb25zdCBzYiA9IF9pLnN1YnRpdGxlICAgICB8fCAnXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXHVBQzAwIFx1QzlDMVx1QzgxMSBcdUFDNzdcdUFDRTAsIFx1QjlEQlx1QkNGNFx1QUNFMCwgXHVCMjkwXHVCMDgwIFx1QUNGMy4gXHVDNkI0XHVDNjAxXHVDNzkwXHVBQzAwIFx1RDA1MFx1QjgwOFx1Qzc3NFx1QzE1OFx1RDU1QyBcdUNEOTRcdUNDOUMgXHVDNUVDXHVENTg5XHVDOUMwXHVDNzg1XHVCMkM4XHVCMkU0Lic7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFNlY3Rpb25IZWFkXG4gICAgICAgICAgICAgICAgICBleWVicm93PXtlYn1cbiAgICAgICAgICAgICAgICAgIHRpdGxlPXs8Pnt0cH08c3BhbiBjbGFzc05hbWU9XCJhY2NlbnRcIj57dGF9PC9zcGFuPnt0c308Lz59XG4gICAgICAgICAgICAgICAgICBzdWJ0aXRsZT17c2J9XG4gICAgICAgICAgICAgICAgICBhY3Rpb249ezxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IGdvKCd0b3VyJyl9Plx1QzgwNFx1Q0NCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QTggXHUyMTkyPC9idXR0b24+fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtM1wiPlxuICAgICAgICAgICAgICB7cmVjb21tZW5kYXRpb25zLm1hcCgocikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhZ3MgPSBBcnJheS5pc0FycmF5KHIudGFncykgPyByLnRhZ3MgOiAodHlwZW9mIHIudGFncyA9PT0gJ3N0cmluZycgPyByLnRhZ3Muc3BsaXQoL1ssXHUwMEI3XS8pLm1hcCgocykgPT4gcy50cmltKCkpLmZpbHRlcihCb29sZWFuKSA6IFtdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGFydGljbGUga2V5PXtyLmlkIHx8IHIubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2FyZFwiXG4gICAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gc2V0UmVjRGV0YWlsKHIpLCBgJHtyLm5hbWUgfHwgJ1x1Q0Q5NFx1Q0M5Qyd9IFx1QzBDMVx1QzEzOCBcdUJDRjRcdUFFMzBgKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6MTYwLCBtYXJnaW5Cb3R0b206MTgsIHBvc2l0aW9uOidyZWxhdGl2ZScsIG92ZXJmbG93OidoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHIuaW1hZ2VEYXRhVXJpID8gYHVybCgke3IuaW1hZ2VEYXRhVXJpfSkgY2VudGVyL2NvdmVyYCA6ICd2YXIoLS1iZy0zKScsXG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiByLmltYWdlRGF0YVVyaSA/ICdub25lJyA6ICcxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7ci5yZWdpb24gJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6MTAsIGxlZnQ6MTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6JzNweCA4cHgnLCBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMCwgZm9udFdlaWdodDo2MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6JzAuMThlbScsIGNvbG9yOid2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgICAgICAgICAgfX0+e3IucmVnaW9ufTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICB7dGFncy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo2LCBtYXJnaW5Cb3R0b206MTAsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAge3RhZ3Muc2xpY2UoMCwgMykubWFwKCh0KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGtleT17dH0gY2xhc3NOYW1lPVwiYmFkZ2VcIiBzdHlsZT17e2ZvbnRTaXplOjl9fT57dH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMiwgZm9udFdlaWdodDo2MDAsIG1hcmdpbkJvdHRvbTo1fX0+e3IubmFtZSB8fCAnXHVDODFDXHVCQUE5IFx1QzVDNlx1Qzc0Qyd9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAge3Iuc3VidGl0bGUgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSwgZm9udFdlaWdodDo2MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjondmFyKC0tc2Vjb25kYXJ5KScsIGxldHRlclNwYWNpbmc6JzAuMDVlbScsIG1hcmdpbkJvdHRvbToxMCxcbiAgICAgICAgICAgICAgICAgICAgICB9fT57ci5zdWJ0aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAge3IuZGVzYyAmJiA8cCBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuNywgY29sb3I6J3ZhcigtLWluay0yKSd9fT57ci5kZXNjfTwvcD59XG4gICAgICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVEMjJDXHVDNUI0IFx1RDUwNFx1Qjg1Q1x1QURGOFx1QjdBOCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICB7dG91cnMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxIb21lU2VjdGlvbkJvdW5kYXJ5IGxhYmVsPVwiXHVEMjJDXHVDNUI0IFx1RDUwNFx1Qjg1Q1x1QURGOFx1QjdBOFwiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb25cIiBzdHlsZT17e2JvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8U2VjdGlvbkhlYWRcbiAgICAgICAgICAgICAgZXllYnJvdz1cIlRPVVIgUFJPR1JBTSBcdTAwQjcgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1RDIyQ1x1QzVCNFwiXG4gICAgICAgICAgICAgIHRpdGxlPXs8Plx1QzlDMVx1QzgxMSBcdUFDNzdcdUIyOTQgPHNwYW4gY2xhc3NOYW1lPVwiYWNjZW50XCI+XHVCMkY1XHVDMEFDIFx1QzVFQ1x1RDU4OTwvc3Bhbj48Lz59XG4gICAgICAgICAgICAgIHN1YnRpdGxlPVwiXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXHVBQzAwIFx1QzlDMVx1QzgxMSBcdUFFMzBcdUQ2OERcdTAwQjdcdUM2QjRcdUM2MDFcdUQ1NThcdUIyOTQgXHVDMThDXHVBRERDXHVCQUE4IFx1QjJGNVx1QzBBQyBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QTguIFx1QUU0QVx1Qzc3NCBcdUM3ODhcdUIyOTQgXHVENTc0XHVDMTI0XHVBQ0ZDIFx1RDU2OFx1QUVEOFx1RDU1OFx1QjI5NCBcdUM1RUNcdUQ1ODkuXCJcbiAgICAgICAgICAgICAgYWN0aW9uPXs8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBnbygndG91cicpfT5cdUM4MDRcdUNDQjQgXHVENTA0XHVCODVDXHVBREY4XHVCN0E4IFx1MjE5MjwvYnV0dG9uPn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC0yXCI+XG4gICAgICAgICAgICAgIHt0b3Vycy5tYXAoKHQsIGkpID0+IChcbiAgICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e3QuaWR9IGNsYXNzTmFtZT1cImNhcmRcIlxuICAgICAgICAgICAgICAgICAgey4uLmNsaWNrYWJsZSgoKSA9PiBnbygndG91cicpLCBgXHVEMjJDXHVDNUI0OiAke3QudGl0bGV9YCl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcicsIHBvc2l0aW9uOidyZWxhdGl2ZSd9fT5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDoyMCwgcmlnaHQ6MjAsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOjEwLCBjb2xvcjondmFyKC0taW5rLTMpJywgbGV0dGVyU3BhY2luZzonMC4yZW0nLFxuICAgICAgICAgICAgICAgICAgfX0+MHtpKzF9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo4LCBtYXJnaW5Cb3R0b206MTYsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgICAgICB7dC5sZXZlbCAmJiA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiPnt0LmxldmVsfTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgIHt0LmR1cmF0aW9uICYmIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCI+e3QuZHVyYXRpb259PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAge3QuZ3JvdXAgJiYgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2VcIj57dC5ncm91cH08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2FyZC10aXRsZVwiIHN0eWxlPXt7Zm9udFNpemU6MjIsIG1hcmdpbkJvdHRvbToxMH19Pnt0LnRpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICB7dC5kZXNjICYmIDxwIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGxpbmVIZWlnaHQ6MS43LCBtYXJnaW5Cb3R0b206MjB9fT57dHJ1bmNhdGVQcmV2aWV3KHQuZGVzYywgMTEwKX08L3A+fVxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHBhZGRpbmdUb3A6MTYsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCwgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0zKSd9fT5cdUIyRTRcdUM3NEMgXHVDNzdDXHVDODE1PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Ub3A6NCwgY29sb3I6J3ZhcigtLWluayknLCBmb250V2VpZ2h0OjUwMH19Pnt0Lm5leHQgfHwgJ1x1MjAxNCd9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7dGV4dEFsaWduOidyaWdodCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBmb250V2VpZ2h0OjYwMCwgbGV0dGVyU3BhY2luZzonMC4xOGVtJywgY29sb3I6J3ZhcigtLWluay0zKSd9fT5cdUNDMzhcdUFDMDBcdUJFNDQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMCwgbWFyZ2luVG9wOjQsIGNvbG9yOid2YXIoLS1pbmspJywgZm9udFdlaWdodDo2MDB9fT57dC5wcmljZSA/ICh0eXBlb2YgdC5wcmljZSA9PT0gJ251bWJlcicgPyB3aW5kb3cuQkdOSl9GTVQud29uKHQucHJpY2UpIDogdC5wcmljZSkgOiAnXHUyMDE0J308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj48L0hvbWVTZWN0aW9uQm91bmRhcnk+XG4gICAgICApfVxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFwiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb25cIiBzdHlsZT17e2JhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgPFNlY3Rpb25IZWFkXG4gICAgICAgICAgICBleWVicm93PVwiQ09NTVVOSVRZIFx1MDBCNyBcdUM1RUNcdUQ1ODkgXHVDNzc0XHVDNTdDXHVBRTMwXCJcbiAgICAgICAgICAgIHRpdGxlPXs8Plx1RDU2OFx1QUVEOCBcdUI5Q0NcdUI0RTRcdUM1QjRcdUFDMDBcdUIyOTQgPHNwYW4gY2xhc3NOYW1lPVwiYWNjZW50XCI+XHVDNUVDXHVENTg5PC9zcGFuPjwvPn1cbiAgICAgICAgICAgIHN1YnRpdGxlPVwiXHVDNUVDXHVENTg5IFx1QUNCRFx1RDVEOFx1Qzc0NCBcdUIwOThcdUIyMDRcdUFDRTAsIFx1Q0Y1NFx1QzJBNFx1Qjk3QyBcdUNEOTRcdUNDOUNcdUQ1NThcdUFDRTAsIFx1RDU2OFx1QUVEOCBcdUI1QTBcdUIwQTAgXHVCM0Q5XHVENTg5XHVDNzQ0IFx1Q0MzRVx1QzJCNVx1QjJDOFx1QjJFNC5cIlxuICAgICAgICAgICAgYWN0aW9uPXs8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBnbygnY29tbXVuaXR5Jyl9Plx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMCBcdUFDMDBcdUFFMzAgXHUyMTkyPC9idXR0b24+fVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3JlY2VudFBvc3RzLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Ym9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgICAgIHtyZWNlbnRQb3N0cy5tYXAoKHBvc3QsIGkpID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2IGtleT17cG9zdC5pZH1cbiAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ2NvbW11bml0eScpLCBwb3N0LnRpdGxlKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBnYXA6MjAsIGFsaWduSXRlbXM6J2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6JzE4cHggMjRweCcsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGkgJSAyID09PSAwID8gJ3ZhcigtLWJnKScgOiAndmFyKC0tYmctMiknLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IGkgPCByZWNlbnRQb3N0cy5sZW5ndGggLSAxID8gJzFweCBzb2xpZCB2YXIoLS1saW5lKScgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OjEsIG1pbldpZHRoOjB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OCwgYWxpZ25JdGVtczonY2VudGVyJywgbWFyZ2luQm90dG9tOjUsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgICAgICAgIHtwb3N0LmNhdGVnb3J5ICYmIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCIgc3R5bGU9e3tmb250U2l6ZTo5fX0+e3Bvc3QuY2F0ZWdvcnl9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7cG9zdC5wcmVmaXggJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjksIGZvbnRXZWlnaHQ6NzAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjondmFyKC0tc2Vjb25kYXJ5KScsIGxldHRlclNwYWNpbmc6JzAuMWVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19Plt7cG9zdC5wcmVmaXh9XTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MTUsIGNvbG9yOid2YXIoLS1pbmspJywgbWFyZ2luQm90dG9tOjMsIGZvbnRXZWlnaHQ6NTAwfX0+e3Bvc3QudGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3Bvc3QuYXV0aG9yfSBcdTAwQjcge3Bvc3QuZGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGdhcDoxNCwgY29sb3I6J3ZhcigtLWluay0zKScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSwgZmxleFNocmluazowLCBmb250V2VpZ2h0OjUwMCxcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cdUIzMTNcdUFFMDAge3Bvc3QucmVwbGllcyA/PyAwfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tjb2xvcjondmFyKC0taW5rLTIpJ319Plx1MjE5Mjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17e3RleHRBbGlnbjonY2VudGVyJywgcGFkZGluZzo2MH19PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZToyMCwgY29sb3I6J3ZhcigtLWluayknLCBtYXJnaW5Cb3R0b206MTIsIGZvbnRXZWlnaHQ6NjAwfX0+XG4gICAgICAgICAgICAgICAgXHVDQ0FCIFx1QkM4OFx1QzlGOCBcdUM1RUNcdUQ1ODkgXHVDNzc0XHVDNTdDXHVBRTMwXHVCOTdDIFx1QzM2OFx1QzhGQ1x1QzEzOFx1QzY5NFxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgY29sb3I6J3ZhcigtLWluay0yKScsIG1hcmdpbkJvdHRvbToyNCwgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICAgICAgICBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjBcdUM1RDAgXHVDNUVDXHVENTg5IFx1QUNCRFx1RDVEOFx1Qzc0NCBcdUIwOThcdUIyMDRcdUJBNzQgXHVCMzU0IFx1QjlDRVx1Qzc0MCBcdUM1RUNcdUQ1ODlcdUM3OTBcdUI0RTRcdUM3NzQgXHVCQUE4XHVDNUVDXHVCNEVEXHVCMkM4XHVCMkU0LlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkXCIgb25DbGljaz17KCkgPT4gZ28oJ2NvbW11bml0eScpfT5cdUFFMDAgXHVDNzkxXHVDMTMxXHVENTU4XHVBRTMwIFx1MjE5MjwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+PC9Ib21lU2VjdGlvbkJvdW5kYXJ5PlxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNFN0NcdUI3RkMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge2ZlYXR1cmVkQ29sdW1uICYmIChcbiAgICAgICAgPEhvbWVTZWN0aW9uQm91bmRhcnkgbGFiZWw9XCJcdUNFN0NcdUI3RkNcIj48c2VjdGlvbiBjbGFzc05hbWU9XCJzZWN0aW9uXCIgc3R5bGU9e3tib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKSd9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPFNlY3Rpb25IZWFkXG4gICAgICAgICAgICAgIGV5ZWJyb3c9XCJDT0xVTU4gXHUwMEI3IFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1Qzc1OCBcdUFFMDBcIlxuICAgICAgICAgICAgICB0aXRsZT17PD48c3BhbiBjbGFzc05hbWU9XCJhY2NlbnRcIj5cdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTA8L3NwYW4+XHVBQzAwIFx1QzRGMFx1QjJFNDwvPn1cbiAgICAgICAgICAgICAgc3VidGl0bGU9XCJcdUQ1NUNcdUFENkRcdUM3NTggXHVDNUVEXHVDMEFDXHUwMEI3XHVCQjM4XHVENjU0XHUwMEI3XHVDNUVDXHVENTg5XHVDNzQ0IFx1QUU0QVx1Qzc3NCBcdUM3ODhcdUFDOEMgXHVENDgwXHVDNUI0XHVCMEI0XHVCMjk0IFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1Qzc1OCBcdUM4MTVcdUFFMzAgXHVDRTdDXHVCN0ZDLlwiXG4gICAgICAgICAgICAgIGFjdGlvbj17PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gZ28oJ2NvbHVtbicpfT5cdUNFN0NcdUI3RkMgXHVDODA0XHVDQ0I0IFx1QkNGNFx1QUUzMCBcdTIxOTI8L2J1dHRvbj59XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxLjNmciAxZnInLCBnYXA6NDB9fSBjbGFzc05hbWU9XCJjb2wtZ3JpZFwiPlxuICAgICAgICAgICAgICB7LyogXHVENTNDXHVDQzk4XHVCNERDIFx1Q0U3Q1x1QjdGQyAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e3BhZGRpbmc6MCwgb3ZlcmZsb3c6J2hpZGRlbicsIGN1cnNvcjoncG9pbnRlcid9fVxuICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ2NvbHVtbicpLCBgXHVDRTdDXHVCN0ZDOiAke2ZlYXR1cmVkQ29sdW1uLnRpdGxlfWApfT5cbiAgICAgICAgICAgICAgICB7LyogdjAwLjE0MCBcdTIwMTQgY292ZXJVcmwgXHVDMEFDXHVDNkE5IChzdGFsZSBmaWVsZCBcdUM3NzRcdUI5ODQgY292ZXJJbWFnZSBcdUFDMDAgXHVDNTQ0XHVCMkM4XHVCNzdDKS4gKi99XG4gICAgICAgICAgICAgICAgeyhmZWF0dXJlZENvbHVtbi5jb3ZlclVybCB8fCBmZWF0dXJlZENvbHVtbi5jb3ZlckltYWdlKSA/IChcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OjIwMCwgYmFja2dyb3VuZEltYWdlOmB1cmwoJHtmZWF0dXJlZENvbHVtbi5jb3ZlclVybCB8fCBmZWF0dXJlZENvbHVtbi5jb3ZlckltYWdlfSlgLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kU2l6ZTonY292ZXInLCBiYWNrZ3JvdW5kUG9zaXRpb246J2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICB9fS8+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OjE0MCwgYmFja2dyb3VuZDondmFyKC0tYmctMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBwbGFjZUl0ZW1zOidjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6OSwgZm9udFdlaWdodDo2MDAsIGNvbG9yOid2YXIoLS1pbmstMyknLCBsZXR0ZXJTcGFjaW5nOicwLjI4ZW0nfX0+RkVBVFVSRUQgQ09MVU1OPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twYWRkaW5nOjMwfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxMiwgYWxpZ25JdGVtczonY2VudGVyJywgbWFyZ2luQm90dG9tOjE0LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICAgICAge2ZlYXR1cmVkQ29sdW1uLmNhdGVnb3J5ICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGxcIj57ZmVhdHVyZWRDb2x1bW4uY2F0ZWdvcnl9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAge2ZlYXR1cmVkQ29sdW1uLmRhdGUgJiYgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTF9fT57ZmVhdHVyZWRDb2x1bW4uZGF0ZX08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICB7ZmVhdHVyZWRDb2x1bW4ucmVhZFRpbWUgJiYgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTF9fT5cdTAwQjcge2ZlYXR1cmVkQ29sdW1uLnJlYWRUaW1lfTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjYsIGZvbnRXZWlnaHQ6NjAwLCBsaW5lSGVpZ2h0OjEuMywgbWFyZ2luQm90dG9tOjEyfX0+XG4gICAgICAgICAgICAgICAgICAgIHtmZWF0dXJlZENvbHVtbi50aXRsZX1cbiAgICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgICB7ZmVhdHVyZWRDb2x1bW4uZXhjZXJwdCAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7Zm9udFNpemU6MTQsIGxpbmVIZWlnaHQ6MS43NSwgY29sb3I6J3ZhcigtLWluay0yKSd9fT57ZmVhdHVyZWRDb2x1bW4uZXhjZXJwdH08L3A+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgZm9udFdlaWdodDo3MDAsIGxldHRlclNwYWNpbmc6JzAuMmVtJywgbWFyZ2luVG9wOjIwLCBjb2xvcjondmFyKC0tc2Vjb25kYXJ5KSd9fT5cdUIzNTQgXHVDNzdEXHVBRTMwIFx1MjE5MjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgey8qIFx1QzExQ1x1QkUwQyBcdUNFN0NcdUI3RkMgXHVCQUE5XHVCODVEICovfVxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtzZWNvbmRhcnlDb2x1bW5zLm1hcCgoYykgPT4gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2MuaWR9XG4gICAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4gZ28oJ2NvbHVtbicpLCBgXHVDRTdDXHVCN0ZDOiAke2MudGl0bGV9YCl9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cGFkZGluZzonMThweCAwJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCBjdXJzb3I6J3BvaW50ZXInfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEwLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBtYXJnaW5Cb3R0b206OCwgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICAgICAgICAgICAge2MuY2F0ZWdvcnkgJiYgPHNwYW4gY2xhc3NOYW1lPVwicGlsbFwiIHN0eWxlPXt7Zm9udFNpemU6OSwgcGFkZGluZzonMnB4IDhweCd9fT57Yy5jYXRlZ29yeX08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgIHtjLmRhdGUgJiYgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTB9fT57Yy5kYXRlfTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjE3LCBmb250V2VpZ2h0OjYwMCwgbGluZUhlaWdodDoxLjQsIG1hcmdpbkJvdHRvbTo1fX0+e2MudGl0bGV9PC9oND5cbiAgICAgICAgICAgICAgICAgICAge2MuZXhjZXJwdCAmJiA8cCBzdHlsZT17e2ZvbnRTaXplOjEyLCBsaW5lSGVpZ2h0OjEuNiwgY29sb3I6J3ZhcigtLWluay0zKSd9fT57KGMuZXhjZXJwdHx8JycpLnNsaWNlKDAsNjUpfVx1MjAyNjwvcD59XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICB7c2Vjb25kYXJ5Q29sdW1ucy5sZW5ndGggPT09IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgY29sb3I6J3ZhcigtLWluay0zKScsIHBhZGRpbmc6JzE4cHggMCd9fT5cdUIyRTRcdUM3NEMgXHVDRTdDXHVCN0ZDIFx1QzkwMFx1QkU0NCBcdUM5MTFcdUM3ODVcdUIyQzhcdUIyRTQuPC9wPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj48L0hvbWVTZWN0aW9uQm91bmRhcnk+XG4gICAgICApfVxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFx1QUMxNVx1QzVGMCBcdUM3N0NcdUM4MTUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge2xlY3R1cmVzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8SG9tZVNlY3Rpb25Cb3VuZGFyeSBsYWJlbD1cIlx1QUMxNVx1QzVGMFwiPjxzZWN0aW9uIGNsYXNzTmFtZT1cInNlY3Rpb24tdGlnaHRcIiBzdHlsZT17e2JhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxTZWN0aW9uSGVhZFxuICAgICAgICAgICAgICBleWVicm93PVwiTEVDVFVSRSBcdTAwQjcgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1QUMxNVx1QzVGMFwiXG4gICAgICAgICAgICAgIHRpdGxlPXs8Plx1Qzc3NFx1QkM4OCBcdUIyRUMgPHNwYW4gY2xhc3NOYW1lPVwiYWNjZW50XCI+XHVBQzE1XHVDNUYwIFx1Qzc3Q1x1QzgxNTwvc3Bhbj48Lz59XG4gICAgICAgICAgICAgIGFjdGlvbj17PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gZ28oJ2xlY3R1cmVzJyl9Plx1QzgwNFx1Q0NCNCBcdUFDMTVcdUM1RjAgXHVCQ0Y0XHVBRTMwIFx1MjE5MjwvYnV0dG9uPn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC0zXCI+XG4gICAgICAgICAgICAgIHtsZWN0dXJlcy5tYXAoKGxlY3R1cmUpID0+IChcbiAgICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2xlY3R1cmUuaWR9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgICAgICAgICAgICAgIHsuLi5jbGlja2FibGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfbGVjdHVyZV9pZCcsIFN0cmluZyhsZWN0dXJlLmlkKSk7IH0gY2F0Y2gge31cbiAgICAgICAgICAgICAgICAgICAgZ28oJ2xlY3R1cmVzJyk7XG4gICAgICAgICAgICAgICAgICB9LCBgXHVBQzE1XHVDNUYwOiAke2xlY3R1cmUudG9waWMgfHwgbGVjdHVyZS50aXRsZX1gKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Y3Vyc29yOidwb2ludGVyJ319PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2VcIiBzdHlsZT17e21hcmdpbkJvdHRvbToxNn19Plx1QUMxNVx1QzVGMDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MjAsIGZvbnRXZWlnaHQ6NjAwLCBtYXJnaW5Cb3R0b206OH19PntsZWN0dXJlLnRvcGljIHx8IGxlY3R1cmUudGl0bGV9PC9oMz5cbiAgICAgICAgICAgICAgICAgIHtsZWN0dXJlLm5vdGUgJiYgPHAgc3R5bGU9e3tmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIGNvbG9yOid2YXIoLS1pbmstMiknLCBtYXJnaW5Cb3R0b206MTZ9fT57dHJ1bmNhdGVQcmV2aWV3KGxlY3R1cmUubm90ZSwgMTEwKX08L3A+fVxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2JvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgcGFkZGluZ1RvcDoxMiwgZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJ319PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZvbnRTaXplOjEyLCBjb2xvcjondmFyKC0taW5rLTIpJ319PntsZWN0dXJlLnZlbnVlIHx8ICdcdTIwMTQnfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmb250U2l6ZToxMiwgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRXZWlnaHQ6NjAwLCBjb2xvcjondmFyKC0taW5rKSd9fT57bGVjdHVyZS5uZXh0IHx8ICdcdTIwMTQnfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPjwvSG9tZVNlY3Rpb25Cb3VuZGFyeT5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgXHVDQzQ1IENUQSBcdTIwMTQgdjAwLjE1MiBcdUIyRTRcdUFEOEMgXHVDRTc0XHVCOEU4XHVDMTQwICsgXHVDODhDXHVDNkIwIFx1QkIzNFx1RDU1QyBcdUJDMThcdUJDRjUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAgPEJvb2tDYXJvdXNlbFNlY3Rpb24gZ289e2dvfSBkYXRhVGljaz17ZGF0YVRpY2t9Lz5cblxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHsgSG9tZVBhZ2UgfSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFXQSxNQUFNLHNCQUFzQixDQUFDLEVBQUUsU0FBUyxHQUFHLE1BQU07QUFYakQ7QUFZRSxRQUFNLENBQUMsY0FBYyxlQUFlLElBQUksTUFBTSxTQUFTLElBQUk7QUFFM0QsZUFBTyxrQkFBUCxnQ0FBdUIsRUFBRSxNQUFNLE1BQU0sT0FBTyxPQUFPLFNBQVMsYUFBYSxNQUFNLE9BQU8sK0NBQVk7QUFDbEcsU0FDRTtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQUksTUFBSztBQUFBLE1BQVMsY0FBVztBQUFBLE1BQU8sY0FBVztBQUFBLE1BQzlDLE9BQU87QUFBQSxRQUNMLFVBQVM7QUFBQSxRQUFTLE9BQU07QUFBQSxRQUFHLFFBQU87QUFBQSxRQUNsQyxZQUFXO0FBQUEsUUFDWCxTQUFRO0FBQUEsUUFBUSxZQUFXO0FBQUEsUUFBVSxTQUFRO0FBQUEsTUFDL0M7QUFBQSxNQUNBLFNBQVMsQ0FBQyxNQUFNO0FBQUUsWUFBSSxFQUFFLFdBQVcsRUFBRSxjQUFlLFNBQVE7QUFBQSxNQUFHO0FBQUE7QUFBQSxJQUMvRCxvQ0FBQyxTQUFJLE9BQU87QUFBQSxNQUNWLFlBQVc7QUFBQSxNQUFhLFVBQVM7QUFBQSxNQUFLLE9BQU07QUFBQSxNQUFRLFdBQVU7QUFBQSxNQUM5RCxVQUFTO0FB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

})();

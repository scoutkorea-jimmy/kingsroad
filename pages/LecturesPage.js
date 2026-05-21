(function(){
const LecturesPage = ({ go, user }) => {
  var _a, _b, _c, _d;
  const [tick, setTick] = React.useState(0);
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [bucket, setBucket] = React.useState("upcoming");
  const [pastDetailId, setPastDetailId] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState(null);
  const isAdmin = !!(user == null ? void 0 : user.isAdmin);
  const refresh = () => setTick((v) => v + 1);
  const G = window.BGNJ_GUARD;
  const allLectures = React.useMemo(
    () => G.arr(() => {
      var _a2, _b2;
      return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2, { includeHidden: isAdmin });
    }),
    [tick, isAdmin]
  );
  const bank = React.useMemo(() => G.call(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.getBankAccount) == null ? void 0 : _b2.call(_a2);
  }, {}), [tick]);
  React.useEffect(() => {
    var _a2, _b2;
    Promise.resolve((_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.refresh) == null ? void 0 : _b2.call(_a2, { includeHidden: true })).finally(() => refresh());
    const onR = () => refresh();
    window.addEventListener("bgnj-lectures-refresh", onR);
    return () => window.removeEventListener("bgnj-lectures-refresh", onR);
  }, []);
  const _now = Date.now();
  const _yesterday = _now - 864e5;
  const _isPast = (l) => {
    if (!(l == null ? void 0 : l.startsAt)) return false;
    const t = Date.parse(l.startsAt);
    return !isNaN(t) && t < _yesterday;
  };
  const lecturesUpcoming = React.useMemo(() => allLectures.filter((l) => !_isPast(l)), [allLectures]);
  const lecturesPast = React.useMemo(() => allLectures.filter(_isPast).sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt)), [allLectures]);
  const lectures = bucket === "past" ? lecturesPast : lecturesUpcoming;
  React.useEffect(() => {
    let pending = null;
    try {
      pending = sessionStorage.getItem("bgnj_pending_lecture_id");
    } catch (e) {
    }
    if (pending) {
      try {
        sessionStorage.removeItem("bgnj_pending_lecture_id");
      } catch (e) {
      }
      const inUpcoming = lecturesUpcoming.findIndex((l) => String(l.id) === String(pending));
      if (inUpcoming >= 0) {
        setBucket("upcoming");
        setSelectedIdx(inUpcoming);
        return;
      }
      const inPast = lecturesPast.findIndex((l) => String(l.id) === String(pending));
      if (inPast >= 0) {
        setBucket("past");
        setSelectedIdx(inPast);
        setPastDetailId(String(pending));
      }
    }
  }, []);
  React.useEffect(() => {
    setSelectedIdx(0);
    setPastDetailId(null);
  }, [bucket]);
  if (allLectures.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 560, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, marginBottom: isAdmin ? 18 : 0 } }, "\uB4F1\uB85D\uB41C \uAC15\uC5F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."), isAdmin && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: () => setAddOpen(true) }, "\uFF0B \uAC15\uC5F0 \uCD94\uAC00")), addOpen && isAdmin && /* @__PURE__ */ React.createElement(LectureQuickAddModal, { onClose: () => setAddOpen(false), onSaved: refresh }));
  }
  const safeIdx = Math.max(0, Math.min(selectedIdx, Math.max(0, lectures.length - 1)));
  const lecture = lectures[safeIdx];
  const seats = G.call(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.getSeats) == null ? void 0 : _b2.call(_a2, lecture.id);
  }, { capacity: 0, taken: 0, waitlist: 0, remaining: 0 });
  const myReg = user ? G.call(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.hasUserRegistered) == null ? void 0 : _b2.call(_a2, lecture.id, user.id);
  }, null) : null;
  const formatPrice = (p) => window.BGNJ_FMT.priceOrFree(p);
  const labelStatus = (s) => ({
    pending_payment: "\uC785\uAE08 \uB300\uAE30",
    confirmed: "\uCC38\uAC00 \uD655\uC815",
    waitlist: "\uB300\uAE30\uC790",
    refund_requested: "\uD658\uBD88 \uC2E0\uCCAD \uC911",
    cancelled: "\uCDE8\uC18C\uB428"
  })[s] || s;
  const tone = (s) => ({
    // v00.230 — confirmed = secondary (Caramel) 로 흰 배경 가독성 확보.
    confirmed: "var(--secondary)",
    waitlist: "var(--ink-2)",
    cancelled: "var(--danger)",
    pending_payment: "var(--ink-2)",
    refund_requested: "var(--warning)"
  })[s] || "var(--ink-2)";
  const _lscI = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).lectureIntro || {};
  const _lEyebrow = _lscI.eyebrow || "LECTURE \xB7 \uC655\uC0AC\uB0A8 \uAC15\uC5F0";
  const _lPrefix = (_c = _lscI.titlePrefix) != null ? _c : "\uC655\uC0AC\uB0A8 ";
  const _lAccent = (_d = _lscI.titleAccent) != null ? _d : "\uAC15\uC5F0 \uC77C\uC815";
  const _lSubtitle = _lscI.subtitle || "\uACF5\uAC1C / \uC2EC\uD654 / \uD604\uC7A5 \uAC15\uC5F0. \uD68C\uC6D0 \uC804\uC6A9 \uC2E0\uCCAD \xB7 \uBB34\uD1B5\uC7A5 \uC785\uAE08 \uACB0\uC81C.";
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 48 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, _lEyebrow), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, _lPrefix, /* @__PURE__ */ React.createElement("span", { className: "accent" }, _lAccent)), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, _lSubtitle)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" } }, [
    { k: "upcoming", label: `\uC9C4\uD589 \uC608\uC815 \uAC15\uC5F0 (${lecturesUpcoming.length})` },
    { k: "past", label: `\uC9C0\uB09C \uAC15\uC5F0 (${lecturesPast.length})` }
  ].map((b) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: b.k,
      type: "button",
      onClick: () => setBucket(b.k),
      "aria-pressed": bucket === b.k,
      style: {
        padding: "8px 18px",
        borderRadius: 999,
        fontSize: 13,
        cursor: "pointer",
        border: "1px solid " + (bucket === b.k ? "var(--primary)" : "var(--line)"),
        // v00.230 — 본문 텍스트는 secondary 로 (옐로우 on 옅은옐로우 = 대비 부족).
        color: bucket === b.k ? "var(--secondary)" : "var(--ink-2)",
        background: bucket === b.k ? "rgba(245,213,72,0.08)" : "transparent"
      }
    },
    b.label
  )), isAdmin && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-gold btn-small",
      style: { marginLeft: "auto" },
      onClick: () => setAddOpen(true)
    },
    "\uFF0B \uAC15\uC5F0 \uCD94\uAC00"
  )), lectures.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "60px 20px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14 } }, bucket === "upcoming" ? "\uC608\uC815\uB41C \uAC15\uC5F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." : "\uC9C0\uB09C \uAC15\uC5F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")), lectures.length > 0 && bucket === "past" && !pastDetailId && window.PastBoardList && /* @__PURE__ */ React.createElement(
    window.PastBoardList,
    {
      items: lectures,
      type: "lecture",
      onSelect: (id) => {
        const idx = lectures.findIndex((l) => String(l.id) === String(id));
        if (idx >= 0) setSelectedIdx(idx);
        setPastDetailId(String(id));
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e) {
        }
      }
    }
  ), lectures.length > 0 && (bucket !== "past" || pastDetailId) && /* @__PURE__ */ React.createElement(React.Fragment, null, bucket === "past" && pastDetailId && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setPastDetailId(null)
    },
    "\u2190 \uC9C0\uB09C \uAC15\uC5F0 \uBAA9\uB85D\uC73C\uB85C"
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 0, borderBottom: "1px solid var(--line-2)", marginBottom: 40, overflowX: "auto" } }, lectures.map((l, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: l.id,
      onClick: () => setSelectedIdx(i),
      style: {
        padding: "20px 28px",
        fontSize: 13,
        whiteSpace: "nowrap",
        fontFamily: "var(--font-serif)",
        // v00.230 — 탭 활성 라벨은 본문 텍스트라 secondary. 하단 indicator 는 옐로우 유지(브랜드).
        color: safeIdx === i ? "var(--secondary)" : "var(--ink-2)",
        background: "transparent",
        border: "none",
        borderBottom: safeIdx === i ? "2px solid var(--primary)" : "2px solid transparent",
        marginBottom: -1,
        cursor: "pointer"
      }
    },
    "0",
    i + 1,
    " \xB7 ",
    String(l.title || "").split(" \u2014 ")[0]
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 60 }, className: "tour-grid" }, /* @__PURE__ */ React.createElement("div", null, (() => {
    var _a2, _b2, _c2, _d2;
    const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
    const lp = ((_c2 = sc.lecturePages) == null ? void 0 : _c2[lecture.id]) || {};
    const galleryPrimary = (_d2 = window.pickPrimaryImage) == null ? void 0 : _d2.call(window, lp.images);
    const coverUri = (galleryPrimary == null ? void 0 : galleryPrimary.url) || lp.coverDataUri || "";
    if (coverUri) {
      return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: coverUri,
          alt: lecture.title || "\uAC15\uC5F0 \uD3EC\uC2A4\uD130",
          style: { width: "100%", height: "auto", display: "block", borderRadius: 2, background: "var(--bg-2)" }
        }
      ), (galleryPrimary == null ? void 0 : galleryPrimary.credit) && /* @__PURE__ */ React.createElement("div", { className: "dim mono", style: { fontSize: 10, letterSpacing: "0.05em", marginTop: 6, lineHeight: 1.5 } }, galleryPrimary.credit));
    }
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, window.CoverPlaceholder ? /* @__PURE__ */ React.createElement(window.CoverPlaceholder, { aspectRatio: "16/10", label: String(lecture.title || "").toUpperCase() }) : /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: { aspectRatio: "16/10", fontSize: 11 } }, String(lecture.title || "").toUpperCase()));
  })(), (() => {
    var _a2, _b2, _c2;
    const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
    const lp = ((_c2 = sc.lecturePages) == null ? void 0 : _c2[lecture.id]) || {};
    const organizer = lp.organizer || "";
    const chipBase = { fontSize: 10, letterSpacing: "0.18em", padding: "2px 8px", borderRadius: 3 };
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { ...chipBase, color: "var(--secondary)", background: "rgba(245,213,72,0.12)", border: "1px solid var(--primary-dim)" } }, "\u25C6 ", lecture.title), lecture.price === 0 ? /* @__PURE__ */ React.createElement("span", { className: "mono", style: { ...chipBase, color: "var(--secondary)", background: "rgba(245,213,72,0.12)", border: "1px solid var(--primary)" } }, "FREE") : /* @__PURE__ */ React.createElement("span", { className: "mono", style: { ...chipBase, color: "var(--ink-2)", background: "var(--bg-2)", border: "1px solid var(--line-2)" } }, "\u20A9 \uBB34\uD1B5\uC7A5 \uC785\uAE08"), lecture.host && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { ...chipBase, color: "var(--secondary)", background: "rgba(146,64,14,0.06)", border: "1px solid var(--secondary)" } }, "\uC8FC\uCD5C \xB7 ", lecture.host), organizer && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { ...chipBase, color: "var(--secondary-hover)", background: "rgba(124,45,18,0.06)", border: "1px solid var(--secondary-hover)" } }, "\uC8FC\uAD00 \xB7 ", organizer), lecture.venue && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { ...chipBase, color: "var(--tertiary)", background: "rgba(71,85,105,0.06)", border: "1px solid var(--tertiary)" } }, "\uC7A5\uC18C \xB7 ", lecture.venue), lecture.hidden && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: "var(--warning)", border: "1px solid var(--warning)", padding: "1px 6px" } }, "\u25C6 \uC228\uAE40 (\uAD00\uB9AC\uC790\uC5D0\uAC8C\uB9CC \uBCF4\uC784)"), isAdmin && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        style: { marginLeft: "auto", fontSize: 11, padding: "4px 10px" },
        onClick: () => setEditTarget(lecture)
      },
      "\u270E \uAC15\uC5F0 \uC218\uC815"
    ));
  })(), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 40, fontWeight: 500, lineHeight: 1.2, marginBottom: 24, whiteSpace: "pre-wrap" } }, lecture.topic), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 16, lineHeight: 1.9, marginBottom: 32, whiteSpace: "pre-wrap" } }, lecture.note), window.MediaGalleryView && (() => {
    var _a2, _b2, _c2, _d2;
    const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
    const imgs = (_d2 = (_c2 = sc.lecturePages) == null ? void 0 : _c2[lecture.id]) == null ? void 0 : _d2.images;
    return /* @__PURE__ */ React.createElement(window.MediaGalleryView, { images: imgs, title: lecture.title, sectionLabel: "\uD3EC\uC2A4\uD130" });
  })(), window.MediaGalleryView && _isPast(lecture) && (() => {
    var _a2, _b2, _c2, _d2;
    const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
    const photos = (_d2 = (_c2 = sc.lecturePages) == null ? void 0 : _c2[lecture.id]) == null ? void 0 : _d2.photos;
    return /* @__PURE__ */ React.createElement(window.MediaGalleryView, { images: photos, title: lecture.title, sectionLabel: "\uD604\uC7A5 \uC0AC\uC9C4", withCover: false });
  })(), (() => {
    var _a2, _b2;
    const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
    const perLec = sc.lecturePages && typeof sc.lecturePages === "object" && (lecture == null ? void 0 : lecture.id) ? sc.lecturePages[lecture.id] || null : null;
    const ovrSchedule = Array.isArray(perLec == null ? void 0 : perLec.schedule) ? perLec.schedule : null;
    const ovrNotes = Array.isArray(perLec == null ? void 0 : perLec.notes) ? perLec.notes : null;
    const schedule = ovrSchedule && ovrSchedule.length > 0 ? ovrSchedule.filter((s) => s && (s.t || s.l)) : Array.isArray(sc.lectureSchedule) ? sc.lectureSchedule.filter((s) => s && (s.t || s.l)) : [];
    const notes = ovrNotes && ovrNotes.length > 0 ? ovrNotes.filter(Boolean) : Array.isArray(sc.lectureNotes) ? sc.lectureNotes.filter(Boolean) : [];
    return /* @__PURE__ */ React.createElement(React.Fragment, null, schedule.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--line)" } }, "\uAC15\uC5F0 \uC9C4\uD589"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, schedule.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "100px 1fr", gap: 24, padding: "14px 0", borderBottom: "1px dashed var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 12, letterSpacing: "0.1em" } }, s.t), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 15 } }, s.l))))), notes.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--line)" } }, "\uCC38\uACE0"), /* @__PURE__ */ React.createElement("ul", { style: { paddingLeft: 20, color: "var(--ink-2)", lineHeight: 2, fontSize: 14, marginBottom: 48 } }, notes.map((n, i) => /* @__PURE__ */ React.createElement("li", { key: i }, n)))));
  })(), /* @__PURE__ */ React.createElement(LectureReviewsSection, { lecture, user, go, onRefresh: refresh })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    LectureBookingPanel,
    {
      lecture,
      user,
      bank,
      myReg,
      seats,
      labelStatus,
      tone,
      formatPrice,
      onRefresh: refresh,
      go
    }
  ))))), addOpen && isAdmin && /* @__PURE__ */ React.createElement(LectureQuickAddModal, { onClose: () => setAddOpen(false), onSaved: refresh }), editTarget && isAdmin && /* @__PURE__ */ React.createElement(LectureQuickAddModal, { onClose: () => setEditTarget(null), onSaved: refresh, initialLecture: editTarget }));
};
const LectureQuickAddModal = ({ onClose, onSaved, initialLecture = null }) => {
  var _a;
  const isEdit = !!(initialLecture == null ? void 0 : initialLecture.id);
  const _defaultStartLocal = (() => {
    const d = new Date(Date.now() + 7 * 864e5);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T19:00`;
  })();
  const _toLocalInput = (iso) => {
    if (!iso) return _defaultStartLocal;
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return _defaultStartLocal;
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch (e) {
      return _defaultStartLocal;
    }
  };
  const [title, setTitle] = React.useState((initialLecture == null ? void 0 : initialLecture.title) || "");
  const [topic, setTopic] = React.useState((initialLecture == null ? void 0 : initialLecture.topic) || "");
  const [venue, setVenue] = React.useState((initialLecture == null ? void 0 : initialLecture.venue) || "");
  const [host, setHost] = React.useState((initialLecture == null ? void 0 : initialLecture.host) || "\uBC45\uAE30\uB178\uC790");
  const [organizer, setOrganizer] = React.useState(() => {
    var _a2, _b, _c, _d;
    if (!(initialLecture == null ? void 0 : initialLecture.id)) return "";
    try {
      const sc = ((_b = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) || {};
      return ((_d = (_c = sc.lecturePages) == null ? void 0 : _c[initialLecture.id]) == null ? void 0 : _d.organizer) || "";
    } catch (e) {
      return "";
    }
  });
  const [startsAt, setStartsAt] = React.useState(_toLocalInput(initialLecture == null ? void 0 : initialLecture.startsAt));
  const [durationMinutes, setDurationMinutes] = React.useState((initialLecture == null ? void 0 : initialLecture.durationMinutes) || 90);
  const [capacity, setCapacity] = React.useState((initialLecture == null ? void 0 : initialLecture.capacity) || 30);
  const [price, setPrice] = React.useState((initialLecture == null ? void 0 : initialLecture.price) || 0);
  const [note, setNote] = React.useState((initialLecture == null ? void 0 : initialLecture.note) || "");
  const [images, setImages] = React.useState(() => {
    var _a2, _b, _c, _d;
    if (!(initialLecture == null ? void 0 : initialLecture.id)) return [];
    try {
      const sc = ((_b = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) || {};
      const arr = (_d = (_c = sc.lecturePages) == null ? void 0 : _c[initialLecture.id]) == null ? void 0 : _d.images;
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  });
  const [photos, setPhotos] = React.useState(() => {
    var _a2, _b, _c, _d;
    if (!(initialLecture == null ? void 0 : initialLecture.id)) return [];
    try {
      const sc = ((_b = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) || {};
      const arr = (_d = (_c = sc.lecturePages) == null ? void 0 : _c[initialLecture.id]) == null ? void 0 : _d.photos;
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  });
  const [hidden, setHidden] = React.useState(!!(initialLecture == null ? void 0 : initialLecture.hidden));
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const dirty = !!(title.trim() || topic.trim() || venue.trim() || note.trim() || images.length > 0);
  const guard = ((_a = window.useModalGuard) == null ? void 0 : _a.call(window, { open: true, dirty, onClose, onSaveDraft: null, label: isEdit ? "\uAC15\uC5F0 \uC218\uC815" : "\uAC15\uC5F0 \uCD94\uAC00" })) || {};
  const submit = async (e) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("\uAC15\uC5F0 \uC81C\uBAA9\uC740 \uD544\uC218\uC785\uB2C8\uB2E4.");
      return;
    }
    if (!startsAt) {
      setError("\uC77C\uC2DC\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    if (!isEdit && (!images || images.length === 0)) {
      setError('\uC0C8 \uAC15\uC5F0 \uB4F1\uB85D \uC2DC \uD3EC\uC2A4\uD130(\uB300\uD45C \uC0AC\uC9C4)\uB294 \uCD5C\uC18C 1\uC7A5 \uD544\uC218\uC785\uB2C8\uB2E4. \uC544\uB798 "\uAC15\uC5F0 \uD3EC\uC2A4\uD130" \uC5D0\uC11C \uCD94\uAC00\uD574 \uC8FC\uC138\uC694.');
      return;
    }
    setSaving(true);
    try {
      const dt = new Date(startsAt);
      if (isNaN(dt.getTime())) throw new Error("\uC77C\uC2DC \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
      const pad = (n) => String(n).padStart(2, "0");
      const next = `${dt.getFullYear()}.${pad(dt.getMonth() + 1)}.${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
      const id = isEdit ? initialLecture.id : `lecture-${Date.now()}`;
      await window.BGNJ_LECTURES.saveLecture({
        id,
        title: title.trim(),
        topic: topic.trim() || title.trim(),
        venue: venue.trim(),
        host: host.trim() || "\uBC45\uAE30\uB178\uC790",
        next,
        startsAt: dt.toISOString(),
        durationMinutes: Math.max(1, Number(durationMinutes) || 90),
        capacity: Math.max(1, Number(capacity) || 30),
        price: Math.max(0, Number(price) || 0),
        note: note.trim(),
        hidden: !!hidden
        // v00.236 — 숨김 토글 반영.
      });
      if (images.length > 0 || photos.length > 0 || organizer || isEdit) {
        try {
          const sc = ((_b = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) || {};
          const existing = sc.lecturePages && typeof sc.lecturePages === "object" && sc.lecturePages[id] || {};
          await window.BGNJ_SITE_CONTENT.saveSection("lecturePages", {
            [id]: { ...existing, images, photos, organizer: organizer.trim() }
          });
          try {
            (_d = (_c = window.BGNJ_BROADCAST) == null ? void 0 : _c.publish) == null ? void 0 : _d.call(_c, "site-content");
          } catch (e2) {
          }
        } catch (galleryErr) {
          try {
            console.warn("[LectureQuickAddModal] \uAC24\uB7EC\uB9AC/\uC8FC\uAD00 \uC800\uC7A5 \uC2E4\uD328:", galleryErr);
          } catch (e2) {
          }
          (_f = (_e = window.BGNJ_TOAST) == null ? void 0 : _e.error) == null ? void 0 : _f.call(_e, "\uAC15\uC5F0 \uC815\uBCF4\uB294 \uC800\uC7A5\uB410\uC9C0\uB9CC \uAC24\uB7EC\uB9AC\xB7\uC8FC\uAD00 \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
        }
      }
      try {
        await ((_h = (_g = window.BGNJ_AUDIT) == null ? void 0 : _g.log) == null ? void 0 : _h.call(_g, { action: isEdit ? "lecture.update" : "lecture.create", target: `lecture:${id}` }));
      } catch (e2) {
      }
      try {
        (_j = (_i = window.BGNJ_BROADCAST) == null ? void 0 : _i.publish) == null ? void 0 : _j.call(_i, "lectures");
      } catch (e2) {
      }
      (_l = (_k = window.BGNJ_TOAST) == null ? void 0 : _k.success) == null ? void 0 : _l.call(_k, isEdit ? "\uAC15\uC5F0\uC774 \uC218\uC815\uB418\uC5C8\uC2B5\uB2C8\uB2E4." : "\uAC15\uC5F0\uC774 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
      onSaved == null ? void 0 : onSaved();
      onClose == null ? void 0 : onClose();
    } catch (err) {
      setError(((_m = err == null ? void 0 : err.body) == null ? void 0 : _m.error) || (err == null ? void 0 : err.message) || (isEdit ? "\uAC15\uC5F0 \uC218\uC815 \uC2E4\uD328" : "\uAC15\uC5F0 \uC0DD\uC131 \uC2E4\uD328"));
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": isEdit ? "\uAC15\uC5F0 \uC218\uC815" : "\uAC15\uC5F0 \uCD94\uAC00",
      onClick: guard.onBackdropClick,
      style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1e3, display: "grid", placeItems: "start center", padding: 24, overflowY: "auto" }
    },
    /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: {
      width: "min(560px, 100%)",
      background: "var(--bg)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
      padding: 24,
      marginTop: 24,
      marginBottom: 48
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 18, margin: 0 } }, isEdit ? "\uAC15\uC5F0 \uC218\uC815" : "\uC0C8 \uAC15\uC5F0 \uCD94\uAC00"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onClose }, "\uB2EB\uAE30")), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginBottom: 18 } }, isEdit ? "\uAE30\uBCF8 \uC815\uBCF4\uB97C \uC218\uC815\uD569\uB2C8\uB2E4. \uC9C4\uD589 \uC77C\uC815\xB7\uCC38\uACE0\xB7\uCEE4\uBC84 \uC774\uBBF8\uC9C0 \uB4F1 \uC0C1\uC138\uB294 \uAD00\uB9AC\uC790 \uD328\uB110\uC5D0\uC11C \uD3B8\uC9D1\uD558\uC138\uC694." : "\uAE30\uBCF8 \uC815\uBCF4\uB9CC \uC785\uB825\uD574 \uBE60\uB974\uAC8C \uB4F1\uB85D\uD569\uB2C8\uB2E4. \uC9C4\uD589 \uC77C\uC815\xB7\uCC38\uACE0\xB7\uCEE4\uBC84 \uC774\uBBF8\uC9C0 \uB4F1 \uC0C1\uC138 \uD3B8\uC9D1\uC740 \uAD00\uB9AC\uC790 \uD328\uB110\uC5D0\uC11C \uC774\uC5B4\uC11C \uC9C4\uD589\uD558\uC138\uC694."), /* @__PURE__ */ React.createElement("form", { onSubmit: submit, style: { display: "grid", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uAC15\uC5F0 \uC81C\uBAA9 * (\uC904\uBC14\uAFC8 \uAC00\uB2A5)"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        className: "field-input",
        rows: 2,
        value: title,
        onChange: (e) => setTitle(e.target.value),
        placeholder: "\uC608: 2026 \uC5EC\uB984 \uD2B9\uAC15 \u2014 \uC601\uC870\uC640 \uC0AC\uB3C4\uC138\uC790\n(Enter \uB85C \uC904\uBC14\uAFC8)",
        autoFocus: true
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC8FC\uC81C (\uC120\uD0DD \u2014 \uBE44\uC6B0\uBA74 \uC81C\uBAA9 \uC0AC\uC6A9 / \uC904\uBC14\uAFC8 \uAC00\uB2A5)"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        className: "field-input",
        rows: 2,
        value: topic,
        onChange: (e) => setTopic(e.target.value),
        placeholder: "\uAC15\uC5F0 \uBCF8\uBB38 \uD398\uC774\uC9C0\uC758 \uD070 \uC81C\uBAA9"
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC7A5\uC18C"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: venue,
        onChange: (e) => setVenue(e.target.value),
        placeholder: "\uC608: \uC885\uB85C\uAD6C \uC548\uAD6D\uB3D9 \u2026"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC8FC\uCD5C (\uC9C4\uD589)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: host,
        onChange: (e) => setHost(e.target.value),
        placeholder: "\uC608: \uBC45\uAE30\uB178\uC790 / (\uC0AC)\uD55C\uAD6D\uC5EC\uC131\uAC74\uCD95\uAC00\uD611\uD68C \u2026"
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC8FC\uAD00 (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: organizer,
        onChange: (e) => setOrganizer(e.target.value),
        placeholder: "\uC608: \u321C\uC2B9\uBCF4\uC774\uC5D4\uC528\uAC74\uCD95\uC0AC\uC0AC\uBB34\uC18C (\uC6B4\uC601 \uC2E4\uBB34 \uB2F4\uB2F9 \uAE30\uAD00)"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC77C\uC2DC *"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "datetime-local",
        className: "field-input",
        value: startsAt,
        onChange: (e) => setStartsAt(e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC18C\uC694 (\uBD84)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: 1,
        className: "field-input",
        value: durationMinutes,
        onChange: (e) => setDurationMinutes(e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC815\uC6D0"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: 1,
        className: "field-input",
        value: capacity,
        onChange: (e) => setCapacity(e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uCC38\uAC00\uBE44 (\uC6D0)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: 0,
        step: 1e3,
        className: "field-input",
        value: price,
        onChange: (e) => setPrice(e.target.value)
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC548\uB0B4 (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        className: "field-input",
        rows: 3,
        value: note,
        onChange: (e) => setNote(e.target.value),
        placeholder: "\uAC15\uC5F0 \uC548\uB0B4\xB7\uB2F9\uBD80 \uC0AC\uD56D (\uC774\uD6C4 \uAD00\uB9AC\uC790 \uD328\uB110\uC5D0\uC11C \uBCF4\uAC15 \uAC00\uB2A5)"
      }
    )), window.MediaGalleryEditor && /* @__PURE__ */ React.createElement(
      window.MediaGalleryEditor,
      {
        value: images,
        onChange: setImages,
        folder: "lecture-poster",
        label: "\uAC15\uC5F0 \uD3EC\uC2A4\uD130 (\uD544\uC218, \uCD5C\uB300 10\uC7A5)",
        helpText: "\uB300\uD45C \uD3EC\uC2A4\uD130\uB294 \uAC15\uC5F0 \uCE74\uB4DC\uC640 \uC0C1\uB2E8 cover \uB85C \uC0AC\uC6A9\uB429\uB2C8\uB2E4. \uCD5C\uC18C 1\uC7A5 \uB4F1\uB85D \uD544\uC218. \uD074\uB9AD\uD558\uAC70\uB098 \uC0AC\uC9C4\uC744 \uB04C\uC5B4 \uB193\uC73C\uBA74 \uD55C \uBC88\uC5D0 \uC5EC\uB7EC \uC7A5 \uC5C5\uB85C\uB4DC \uAC00\uB2A5\uD569\uB2C8\uB2E4."
      }
    ), window.MediaGalleryEditor && /* @__PURE__ */ React.createElement(
      window.MediaGalleryEditor,
      {
        value: photos,
        onChange: setPhotos,
        folder: "lecture-photos",
        label: "\uD604\uC7A5 \uC0AC\uC9C4 (\uC120\uD0DD, \uC885\uB8CC\uB41C \uAC15\uC5F0\uC5D0 \uB178\uCD9C)",
        showPrimary: false,
        helpText: "\uAC15\uC5F0\uC774 \uB05D\uB09C \uB4A4 \uB4F1\uB85D\uD558\uB294 \uD604\uC7A5 \uC2A4\uCF00\uCE58. \uAC15\uC5F0 \uC77C\uC2DC\uAC00 \uC9C0\uB09C \uC2DC\uC810\uBD80\uD130 \uAC15\uC5F0 \uD398\uC774\uC9C0 \uD558\uB2E8\uC5D0 \uADF8\uB9AC\uB4DC\uB85C \uB178\uCD9C\uB429\uB2C8\uB2E4."
      }
    ), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", gap: 8, alignItems: "center", padding: "8px 12px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 6, fontSize: 12, color: "var(--ink-2)", cursor: "pointer" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: hidden,
        onChange: (e) => setHidden(e.target.checked),
        style: { accentColor: "var(--primary)" }
      }
    ), /* @__PURE__ */ React.createElement("span", null, '\uC784\uC2DC \uC228\uAE40 \u2014 \uC77C\uBC18 \uD68C\uC6D0\uC5D0\uAC8C \uB178\uCD9C \uC548 \uD568 (\uAD00\uB9AC\uC790\uC5D0\uAC8C\uB294 "\uC228\uAE40" \uB77C\uBCA8\uB85C \uD45C\uC2DC)')), error && /* @__PURE__ */ React.createElement("div", { role: "alert", style: { padding: "8px 10px", background: "rgba(194,74,61,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: 12 } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onClose, disabled: saving }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small", disabled: saving || !title.trim() }, saving ? "\uC800\uC7A5 \uC911..." : isEdit ? "\uAC15\uC5F0 \uC800\uC7A5" : "\uAC15\uC5F0 \uB4F1\uB85D"))))
  );
};
const LectureBookingPanel = ({ lecture, user, bank, myReg, seats, labelStatus, tone, formatPrice, onRefresh, go }) => {
  const [selectedBankId, setSelectedBankId] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState((user == null ? void 0 : user.name) || "");
  const [email, setEmail] = React.useState((user == null ? void 0 : user.email) || "");
  const [phone, setPhone] = React.useState("");
  const [count, setCount] = React.useState(1);
  const [note, setNote] = React.useState("");
  const [cashReceipt, setCashReceipt] = React.useState(() => {
    var _a, _b;
    return ((_b = (_a = window.BGNJ_CashReceipt) == null ? void 0 : _a.empty) == null ? void 0 : _b.call(_a)) || { requested: false, type: "personal", identifier: "" };
  });
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(null);
  const [refundMode, setRefundMode] = React.useState(false);
  const [refundReason, setRefundReason] = React.useState("");
  const [refundError, setRefundError] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  React.useEffect(() => {
    setOpen(false);
    setSubmitted(null);
    setError("");
    setCount(1);
    setNote("");
    setName((user == null ? void 0 : user.name) || "");
    setEmail((user == null ? void 0 : user.email) || "");
    setRefundMode(false);
    setRefundReason("");
    setRefundError("");
    setAgreed(false);
  }, [lecture.id, user == null ? void 0 : user.id]);
  const requireLogin = async (label) => {
    if (await window.BGNJ_CONFIRM(`${label}\uC740(\uB294) \uB85C\uADF8\uC778 \uD6C4 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) {
      go("login");
    }
  };
  const submit = async (e) => {
    var _a, _b, _c;
    e.preventDefault();
    setError("");
    if (!user) return requireLogin("\uAC15\uC5F0 \uC2E0\uCCAD");
    if (!name.trim() || !email.trim()) {
      setError("\uC774\uB984\uACFC \uC774\uBA54\uC77C\uC740 \uD544\uC218\uC785\uB2C8\uB2E4.");
      return;
    }
    if (!agreed) {
      setError("\uAC1C\uC778\uC815\uBCF4 \uD65C\uC6A9 \uBC0F \uC81C3\uC790 \uC81C\uACF5 \uB3D9\uC758\uB294 \uD544\uC218\uC785\uB2C8\uB2E4.");
      return;
    }
    try {
      const crPrefix = ((_b = (_a = window.BGNJ_CashReceipt) == null ? void 0 : _a.encode) == null ? void 0 : _b.call(_a, cashReceipt)) || "";
      const noteCombined = (crPrefix + (note.trim() || "")).trim();
      const result = await window.BGNJ_LECTURES.register(lecture.id, {
        userId: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        count: Math.max(1, Number(count) || 1),
        note: noteCombined
      });
      if (!(result == null ? void 0 : result.ok)) {
        setError((result == null ? void 0 : result.message) || "\uC2E0\uCCAD \uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
        return;
      }
      setSubmitted(result.registration);
      onRefresh();
      setOpen(false);
    } catch (err) {
      setError(((_c = err == null ? void 0 : err.body) == null ? void 0 : _c.error) || (err == null ? void 0 : err.message) || "\uC2E0\uCCAD \uCC98\uB9AC \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
    }
  };
  const cancelMyReg = async () => {
    var _a;
    if (!myReg) return;
    if (!await window.BGNJ_CONFIRM("\uC774 \uAC15\uC5F0 \uC2E0\uCCAD\uC744 \uCDE8\uC18C\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) return;
    try {
      await window.BGNJ_LECTURES.cancelRegistration(lecture.id, myReg.id);
      onRefresh();
      setSubmitted(null);
    } catch (err) {
      window.BGNJ_TOAST.error("\uCDE8\uC18C \uC2E4\uD328: " + (((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || (err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const submitRefund = async () => {
    var _a;
    setRefundError("");
    if (!refundReason.trim()) {
      setRefundError("\uD658\uBD88 \uC0AC\uC720\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    try {
      const result = await window.BGNJ_LECTURES.requestRefund(lecture.id, myReg.id, refundReason);
      if (!(result == null ? void 0 : result.ok)) {
        setRefundError((result == null ? void 0 : result.message) || "\uD658\uBD88 \uC2E0\uCCAD \uC2E4\uD328");
        return;
      }
      setRefundMode(false);
      setRefundReason("");
      onRefresh();
    } catch (err) {
      setRefundError(((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || (err == null ? void 0 : err.message) || "\uD658\uBD88 \uC2E0\uCCAD \uC911 \uC624\uB958");
    }
  };
  const downloadIcs = () => window.BGNJ_LECTURES.downloadIcs(lecture.id);
  const showPaymentInfo = (lecture.price || 0) > 0 && ((myReg == null ? void 0 : myReg.status) === "pending_payment" || (submitted == null ? void 0 : submitted.status) === "pending_payment");
  const isFull = seats.remaining <= 0;
  const isPaidConfirmed = (myReg == null ? void 0 : myReg.status) === "confirmed" && (lecture.price || 0) > 0;
  return /* @__PURE__ */ React.createElement("div", { className: "card card-gold mobile-release-sticky", style: { position: "sticky", top: 100 } }, /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 10, letterSpacing: "0.3em" } }, "NEXT SCHEDULE"), /* @__PURE__ */ React.createElement("div", { className: "gold-2 ko-serif", style: { fontSize: 24, margin: "8px 0 20px" } }, lecture.next), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uCC38\uAC00\uBE44"), /* @__PURE__ */ React.createElement("span", { className: "gold-2 ko-serif", style: { fontSize: 22 } }, formatPrice(lecture.price))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC18C\uC694"), /* @__PURE__ */ React.createElement("span", null, lecture.durationMinutes ? `${Math.round(lecture.durationMinutes / 60 * 10) / 10}\uC2DC\uAC04` : "-")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC815\uC6D0"), /* @__PURE__ */ React.createElement("span", null, lecture.capacity, "\uBA85")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC794\uC5EC"), /* @__PURE__ */ React.createElement("span", { style: { color: isFull ? "var(--danger)" : "var(--secondary)" } }, isFull ? `\uB300\uAE30 ${seats.waitlist}\uBA85` : `${seats.remaining}\uC11D`)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC9C4\uD589"), /* @__PURE__ */ React.createElement("span", { className: "gold" }, lecture.host)), myReg && /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "rgba(245,213,72,0.06)", border: "1px solid var(--primary-dim)", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", marginBottom: 6 } }, "MY REGISTRATION"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: 16 } }, labelStatus(myReg.status)), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 11, letterSpacing: "0.2em", color: tone(myReg.status) } }, myReg.count, "\uBA85 \xB7 ", formatPrice((lecture.price || 0) * (myReg.count || 1)))), myReg.status === "pending_payment" && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginTop: 8 } }, "\uACC4\uC88C\uB85C \uC785\uAE08 \uD6C4 \uC6B4\uC601\uC790\uAC00 \uD655\uC778\uD558\uBA74 \uCC38\uAC00\uAC00 \uD655\uC815\uB429\uB2C8\uB2E4."), myReg.status === "waitlist" && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginTop: 8 } }, "\uC815\uC6D0\uC774 \uCC28\uC11C \uB300\uAE30 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC790\uB9AC\uAC00 \uB098\uBA74 \uC790\uB3D9\uC73C\uB85C \uC804\uD658\uB429\uB2C8\uB2E4."), myReg.status === "refund_requested" && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginTop: 8 } }, "\uD658\uBD88 \uC2E0\uCCAD\uC774 \uC811\uC218\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC6B4\uC601\uC790 \uD655\uC778 \uD6C4 \uCC98\uB9AC\uB429\uB2C8\uB2E4.", myReg.refundReason && /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, " \xB7 \uC0AC\uC720: ", myReg.refundReason)), myReg.refundAdminNote && myReg.status === "confirmed" && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: "var(--danger)", marginTop: 6 } }, "\uD658\uBD88 \uBC18\uB824 \uBA54\uBAA8: ", myReg.refundAdminNote), !refundMode && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: downloadIcs }, "\uCE98\uB9B0\uB354 \uCD94\uAC00 (.ics)"), myReg.status !== "refund_requested" && (isPaidConfirmed ? /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setRefundMode(true),
      style: { borderColor: "var(--warning)", color: "var(--warning)", marginLeft: "auto" }
    },
    "\uD658\uBD88 \uC2E0\uCCAD"
  ) : /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: cancelMyReg,
      style: { borderColor: "var(--danger)", color: "var(--danger)", marginLeft: "auto" }
    },
    "\uC2E0\uCCAD \uCDE8\uC18C"
  ))), refundMode && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, padding: 12, background: "rgba(217,119,6,0.10)", border: "1px solid var(--warning)", borderRadius: 4 } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 11, lineHeight: 1.7, marginBottom: 8 } }, "\uD658\uBD88 \uC2E0\uCCAD \uD6C4 \uC6B4\uC601\uC790 \uD655\uC778\uC744 \uAC70\uCCD0 \uCC98\uB9AC\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: refundReason,
      onChange: (e) => setRefundReason(e.target.value),
      placeholder: "\uD658\uBD88 \uC0AC\uC720 (\uD544\uC218)",
      className: "field-input",
      rows: 2,
      style: { width: "100%", padding: "8px 10px", fontSize: 12, resize: "vertical", marginBottom: 6 }
    }
  ), refundError && /* @__PURE__ */ React.createElement("p", { style: { color: "var(--danger)", fontSize: 11, marginBottom: 6 } }, refundError), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      style: { borderColor: "var(--warning)", color: "var(--warning)" },
      onClick: submitRefund
    },
    "\uC2E0\uCCAD\uD558\uAE30"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => {
        setRefundMode(false);
        setRefundReason("");
        setRefundError("");
      }
    },
    "\uCDE8\uC18C"
  )))), !myReg && submitted && /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "rgba(245,213,72,0.06)", border: "1px solid var(--primary-dim)", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", marginBottom: 6 } }, "SUBMITTED"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 16, marginBottom: 6 } }, "\uC2E0\uCCAD \uC811\uC218 \u2014 ", labelStatus(submitted.status)), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7 } }, submitted.status === "pending_payment" ? "\uC544\uB798 \uACC4\uC88C\uB85C \uC785\uAE08 \uD6C4 \uC6B4\uC601\uC790\uAC00 \uD655\uC778\uD558\uBA74 \uCC38\uAC00\uAC00 \uD655\uC815\uB429\uB2C8\uB2E4." : submitted.status === "confirmed" ? "\uCC38\uAC00\uAC00 \uD655\uC815\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC77C\uC815\uC744 \uCE98\uB9B0\uB354\uC5D0 \uCD94\uAC00\uD574 \uB450\uC138\uC694." : "\uB300\uAE30\uC790\uB85C \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC790\uB9AC\uAC00 \uB098\uBA74 \uC790\uB3D9 \uC804\uD658\uB429\uB2C8\uB2E4.")), showPaymentInfo && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, window.BGNJ_BankAccountPicker ? /* @__PURE__ */ React.createElement(window.BGNJ_BankAccountPicker, { value: selectedBankId, onChange: setSelectedBankId }) : null, /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 10,
    padding: "10px 14px",
    background: "var(--bg-2)",
    border: "1px solid var(--line)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline"
  } }, /* @__PURE__ */ React.createElement("span", { className: "dim", style: { fontSize: 13 } }, "\uC785\uAE08 \uAE08\uC561"), /* @__PURE__ */ React.createElement("span", { className: "gold ko-serif", style: { fontSize: 18 } }, formatPrice((lecture.price || 0) * ((myReg == null ? void 0 : myReg.count) || (submitted == null ? void 0 : submitted.count) || 1))))), !myReg && !submitted && /* @__PURE__ */ React.createElement(React.Fragment, null, !open ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-gold btn-block",
      style: { marginBottom: 10 },
      onClick: () => {
        if (!user) {
          requireLogin("\uAC15\uC5F0 \uC2E0\uCCAD");
          return;
        }
        setOpen(true);
        setError("");
      }
    },
    isFull ? "\uB300\uAE30\uC790 \uB4F1\uB85D" : "\uAC15\uC5F0 \uC2E0\uCCAD"
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-block", onClick: downloadIcs }, "\uCE98\uB9B0\uB354\uC5D0 \uCD94\uAC00 (.ics)")) : /* @__PURE__ */ React.createElement("form", { onSubmit: submit }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: name, onChange: (e) => setName(e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement("input", { type: "email", className: "field-input", value: email, onChange: (e) => setEmail(e.target.value) })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 100px", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC5F0\uB77D\uCC98"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "010-..." })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC778\uC6D0"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: 1,
      max: Math.max(1, lecture.capacity),
      className: "field-input",
      value: count,
      onChange: (e) => setCount(e.target.value)
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBA54\uBAA8"), /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 2, value: note, onChange: (e) => setNote(e.target.value), placeholder: "\uB3D9\uD589\uC790 / \uD2B9\uC774\uC0AC\uD56D" })), (lecture.price || 0) > 0 && window.BGNJ_CashReceiptField && /* @__PURE__ */ React.createElement(window.BGNJ_CashReceiptField, { value: cashReceipt, onChange: setCashReceipt })), error && /* @__PURE__ */ React.createElement("div", { role: "alert", style: { padding: "8px 10px", background: "rgba(194,74,61,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: 12, marginBottom: 10 } }, error), /* @__PURE__ */ React.createElement("div", { className: "dim mono", style: { fontSize: 10, lineHeight: 1.7, marginBottom: 10, letterSpacing: "0.05em" } }, (lecture.price || 0) === 0 ? "\uBB34\uB8CC \uAC15\uC5F0\uC774\uB77C \uC2E0\uCCAD \uC989\uC2DC \uCC38\uAC00 \uD655\uC815\uB429\uB2C8\uB2E4." : `\uD569\uACC4 ${formatPrice((lecture.price || 0) * (Number(count) || 1))} \xB7 \uC2E0\uCCAD \u2192 \uC785\uAE08 \u2192 \uC6B4\uC601\uC790 \uD655\uC778 \u2192 \uCC38\uAC00 \uD655\uC815`, isFull && " \xB7 \uC815\uC6D0\uC774 \uCC28\uC11C \uC790\uB3D9 \uB300\uAE30\uC790 \uB4F1\uB85D\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", gap: 8, alignItems: "flex-start", padding: "10px 12px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 6, marginBottom: 10, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: agreed,
      onChange: (e) => setAgreed(e.target.checked),
      style: { marginTop: 3, accentColor: "var(--primary)" }
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, lineHeight: 1.6, color: "var(--ink-2)" } }, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--secondary)" } }, "[\uD544\uC218]"), " \uAC15\uC5F0 \uC2E0\uCCAD \uCC98\uB9AC(\uC774\uB984\xB7\uC774\uBA54\uC77C\xB7\uC5F0\uB77D\uCC98) \uC640 \uC6B4\uC601\uC790 \uC548\uB0B4 \uBC1C\uC1A1\uC744 \uC704\uD574 \uAC1C\uC778\uC815\uBCF4 \uD65C\uC6A9 \uBC0F \uC6B4\uC601 \uC81C\uD734\uC0AC\uB85C\uC758 \uC81C3\uC790 \uC81C\uACF5\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4. ", " ", /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => go("privacy"),
      style: { background: "none", border: "none", padding: 0, color: "var(--secondary)", textDecoration: "underline", cursor: "pointer", fontSize: "inherit" }
    },
    "\uC790\uC138\uD788 \uBCF4\uAE30"
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setOpen(false) }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small", disabled: !agreed }, "\uC2E0\uCCAD \uC811\uC218")))), !user && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.7, marginTop: 14, textAlign: "center" } }, "\uAC15\uC5F0 \uC2E0\uCCAD\uC740 \uD68C\uC6D0\uAC00\uC785\uD55C \uBD84\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4."));
};
const LectureReviewsSection = ({ lecture, user, go, onRefresh }) => {
  const reviews = window.BGNJ_LECTURES.listReviews(lecture.id);
  const canReview = user ? window.BGNJ_LECTURES.canReview(lecture.id, user.id) : false;
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState("");
  const gateContent = (() => {
    var _a, _b;
    const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
    const g = sc.lectureReviewsGate && typeof sc.lectureReviewsGate === "object" ? sc.lectureReviewsGate : {};
    return {
      gate: g.gate || "\uD6C4\uAE30\uB294 \uCC38\uAC00 \uD655\uC815\uB41C \uD68C\uC6D0\uB9CC \uC791\uC131\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC544\uC9C1 \uC2E0\uCCAD \uC804\uC774\uB77C\uBA74 \uC0AC\uC774\uB4DC\uBC14\uC5D0\uC11C \uAC15\uC5F0\uC744 \uC2E0\uCCAD\uD558\uACE0 \uC6B4\uC601\uC790 \uC785\uAE08 \uD655\uC778\uC744 \uBC1B\uC740 \uB4A4 \uB2E4\uC2DC \uC640 \uC8FC\uC138\uC694.",
      anonymous: g.anonymous || "\uD6C4\uAE30 \uC791\uC131\uC740 \uD68C\uC6D0 \uC804\uC6A9\uC785\uB2C8\uB2E4.",
      empty: g.empty || "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uD6C4\uAE30\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uCCAB \uBC88\uC9F8 \uD6C4\uAE30\uB97C \uB0A8\uACA8 \uC8FC\uC138\uC694."
    };
  })();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      if (await window.BGNJ_CONFIRM("\uD6C4\uAE30 \uC791\uC131\uC740 \uB85C\uADF8\uC778 \uD6C4 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) {
        go("login");
      }
      return;
    }
    if (!canReview) {
      setError("\uCC38\uAC00 \uD655\uC815\uB41C \uBD84\uB9CC \uD6C4\uAE30\uB97C \uC791\uC131\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
      return;
    }
    if (!text.trim()) {
      setError("\uD6C4\uAE30 \uB0B4\uC6A9\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    window.BGNJ_LECTURES.addReview(lecture.id, {
      userId: user.id,
      author: user.name,
      rating,
      text: text.trim()
    });
    setText("");
    setRating(5);
    onRefresh == null ? void 0 : onRefresh();
  };
  const remove = async (id) => {
    if (!await window.BGNJ_CONFIRM("\uC774 \uD6C4\uAE30\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) return;
    window.BGNJ_LECTURES.deleteReview(lecture.id, id);
    onRefresh == null ? void 0 : onRefresh();
  };
  const avgRating = reviews.length === 0 ? 0 : reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;
  const stars = (n) => "\u2605".repeat(Math.round(n)) + "\u2606".repeat(5 - Math.round(n));
  return /* @__PURE__ */ React.createElement("section", { "aria-labelledby": "lecture-reviews" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("h3", { id: "lecture-reviews", className: "ko-serif", style: { fontSize: 20 } }, "\uCC38\uC5EC \uD6C4\uAE30 ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 12, marginLeft: 6 } }, reviews.length, "\uAC74")), reviews.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 12, letterSpacing: "0.16em" } }, "\uD3C9\uADE0 ", avgRating.toFixed(1), " ", stars(avgRating))), user ? canReview ? /* @__PURE__ */ React.createElement("form", { onSubmit: submit, className: "card", style: { padding: 16, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 10 } }, "WRITE A REVIEW"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, alignItems: "center", marginBottom: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "dim", style: { fontSize: 12 } }, "\uD3C9\uC810"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 2 } }, [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: n,
      type: "button",
      onClick: () => setRating(n),
      "aria-label": `${n}\uC810`,
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: n <= rating ? "var(--primary)" : "var(--ink-3)",
        fontSize: 18,
        padding: "2px 4px"
      }
    },
    n <= rating ? "\u2605" : "\u2606"
  ))), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, rating, ".0")), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 3,
      value: text,
      onChange: (e) => setText(e.target.value),
      placeholder: "\uAC15\uC5F0\uC774 \uC5B4\uB560\uB294\uC9C0 \uC9E7\uAC8C \uB0A8\uACA8 \uC8FC\uC138\uC694.",
      style: { marginBottom: 10 }
    }
  ), error && /* @__PURE__ */ React.createElement("div", { role: "alert", style: { padding: "8px 10px", background: "rgba(194,74,61,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: 12, marginBottom: 10 } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small", disabled: !text.trim() }, "\uB4F1\uB85D"))) : /* @__PURE__ */ React.createElement("div", { className: "card dim", style: { padding: 16, marginBottom: 24, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" } }, gateContent.gate) : /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 24, textAlign: "center", background: "rgba(245,213,72,0.04)" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 10, whiteSpace: "pre-wrap" } }, gateContent.anonymous), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: () => go("login") }, "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("signup") }, "\uD68C\uC6D0\uAC00\uC785"))), reviews.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 13, padding: "24px 0", textAlign: "center", whiteSpace: "pre-wrap" } }, gateContent.empty) : /* @__PURE__ */ React.createElement("ol", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 } }, reviews.map((r) => /* @__PURE__ */ React.createElement("li", { key: r.id, className: "card", style: { padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 12, letterSpacing: "0.1em" } }, r.author, /* @__PURE__ */ React.createElement(AuthorGradeBadge, { authorId: r.userId, author: r.author })), /* @__PURE__ */ React.createElement("span", { className: "gold", style: { fontSize: 14 } }, stars(r.rating)), /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11 } }, window.BGNJ_FMT.kstDate(r.createdAt))), !!user && (user.isAdmin || r.userId === user.id) && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn-ghost",
      onClick: () => remove(r.id),
      style: { fontSize: 11, color: "var(--danger)" }
    },
    "\uC0AD\uC81C"
  )), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-reading)", fontSize: 14, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-wrap" } }, r.text)))));
};
Object.assign(window, { LecturesPage, LectureBookingPanel, LectureReviewsSection, LectureQuickAddModal });

})();

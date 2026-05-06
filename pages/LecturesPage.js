(function(){
const LecturesPage = ({ go, user }) => {
  var _a, _b, _c, _d;
  const [tick, setTick] = React.useState(0);
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [bucket, setBucket] = React.useState("upcoming");
  const refresh = () => setTick((v) => v + 1);
  const G = window.BGNJ_GUARD;
  const allLectures = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
  }), [tick]);
  const bank = React.useMemo(() => G.call(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.getBankAccount) == null ? void 0 : _b2.call(_a2);
  }, {}), [tick]);
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
      }
    }
  }, []);
  React.useEffect(() => {
    setSelectedIdx(0);
  }, [bucket]);
  if (allLectures.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 560, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14 } }, "\uB4F1\uB85D\uB41C \uAC15\uC5F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")));
  }
  const safeIdx = Math.max(0, Math.min(selectedIdx, Math.max(0, lectures.length - 1)));
  const lecture = lectures[safeIdx];
  if (!lecture) {
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 560, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, lineHeight: 1.8 } }, bucket === "past" ? "\uC9C0\uB09C \uAC15\uC5F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." : "\uC9C4\uD589 \uC608\uC815\uC778 \uAC15\uC5F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."), bucket === "past" && lecturesUpcoming.length > 0 && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", style: { marginTop: 18 }, onClick: () => setBucket("upcoming") }, "\uC9C4\uD589 \uC608\uC815 \uAC15\uC5F0 \uBCF4\uAE30 \u2192"), bucket === "upcoming" && lecturesPast.length > 0 && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", style: { marginTop: 18 }, onClick: () => setBucket("past") }, "\uC9C0\uB09C \uAC15\uC5F0 \uBCF4\uAE30 \u2192")));
  }
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
    confirmed: "var(--primary)",
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
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 48 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, _lEyebrow), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, _lPrefix, /* @__PURE__ */ React.createElement("span", { className: "accent" }, _lAccent)), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, _lSubtitle)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" } }, [
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
        color: bucket === b.k ? "var(--primary)" : "var(--ink-2)",
        background: bucket === b.k ? "rgba(245,213,72,0.08)" : "transparent"
      }
    },
    b.label
  ))), lectures.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "60px 20px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14 } }, bucket === "upcoming" ? "\uC608\uC815\uB41C \uAC15\uC5F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." : "\uC9C0\uB09C \uAC15\uC5F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")), lectures.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 0, borderBottom: "1px solid var(--line-2)", marginBottom: 40, overflowX: "auto" } }, lectures.map((l, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: l.id,
      onClick: () => setSelectedIdx(i),
      style: {
        padding: "20px 28px",
        fontSize: 13,
        whiteSpace: "nowrap",
        fontFamily: "var(--font-serif)",
        color: safeIdx === i ? "var(--primary)" : "var(--ink-2)",
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
    const coverUri = ((_d2 = (_c2 = sc.lecturePages) == null ? void 0 : _c2[lecture.id]) == null ? void 0 : _d2.coverDataUri) || "";
    if (coverUri) {
      return /* @__PURE__ */ React.createElement("div", { style: { aspectRatio: "16/10", marginBottom: 32, overflow: "hidden", borderRadius: 2, background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: coverUri,
          alt: lecture.title || "\uAC15\uC5F0 \uCEE4\uBC84",
          style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
        }
      ));
    }
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, window.CoverPlaceholder ? /* @__PURE__ */ React.createElement(window.CoverPlaceholder, { aspectRatio: "16/10", label: String(lecture.title || "").toUpperCase() }) : /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: { aspectRatio: "16/10", fontSize: 11 } }, String(lecture.title || "").toUpperCase()));
  })(), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "badge badge-gold" }, lecture.title), lecture.price === 0 ? /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: "var(--primary)", border: "1px solid var(--primary-dim)", padding: "1px 6px" } }, "FREE") : /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-2)", border: "1px solid var(--line-2)", padding: "1px 6px" } }, "\uBB34\uD1B5\uC7A5 \uC785\uAE08"), /* @__PURE__ */ React.createElement("span", { className: "badge" }, lecture.host), /* @__PURE__ */ React.createElement("span", { className: "badge" }, lecture.venue)), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 40, fontWeight: 500, lineHeight: 1.2, marginBottom: 24 } }, lecture.topic), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 16, lineHeight: 1.9, marginBottom: 32 } }, lecture.note), (() => {
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
  ))))));
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
  return /* @__PURE__ */ React.createElement("div", { className: "card card-gold", style: { position: "sticky", top: 100 } }, /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 10, letterSpacing: "0.3em" } }, "NEXT SCHEDULE"), /* @__PURE__ */ React.createElement("div", { className: "gold-2 ko-serif", style: { fontSize: 24, margin: "8px 0 20px" } }, lecture.next), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uCC38\uAC00\uBE44"), /* @__PURE__ */ React.createElement("span", { className: "gold-2 ko-serif", style: { fontSize: 22 } }, formatPrice(lecture.price))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC18C\uC694"), /* @__PURE__ */ React.createElement("span", null, lecture.durationMinutes ? `${Math.round(lecture.durationMinutes / 60 * 10) / 10}\uC2DC\uAC04` : "-")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC815\uC6D0"), /* @__PURE__ */ React.createElement("span", null, lecture.capacity, "\uBA85")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC794\uC5EC"), /* @__PURE__ */ React.createElement("span", { style: { color: isFull ? "var(--danger)" : "var(--primary)" } }, isFull ? `\uB300\uAE30 ${seats.waitlist}\uBA85` : `${seats.remaining}\uC11D`)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC9C4\uD589"), /* @__PURE__ */ React.createElement("span", { className: "gold" }, lecture.host)), myReg && /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "rgba(245,213,72,0.06)", border: "1px solid var(--primary-dim)", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", marginBottom: 6 } }, "MY REGISTRATION"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: 16 } }, labelStatus(myReg.status)), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 11, letterSpacing: "0.2em", color: tone(myReg.status) } }, myReg.count, "\uBA85 \xB7 ", formatPrice((lecture.price || 0) * (myReg.count || 1)))), myReg.status === "pending_payment" && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginTop: 8 } }, "\uACC4\uC88C\uB85C \uC785\uAE08 \uD6C4 \uC6B4\uC601\uC790\uAC00 \uD655\uC778\uD558\uBA74 \uCC38\uAC00\uAC00 \uD655\uC815\uB429\uB2C8\uB2E4."), myReg.status === "waitlist" && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginTop: 8 } }, "\uC815\uC6D0\uC774 \uCC28\uC11C \uB300\uAE30 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC790\uB9AC\uAC00 \uB098\uBA74 \uC790\uB3D9\uC73C\uB85C \uC804\uD658\uB429\uB2C8\uB2E4."), myReg.status === "refund_requested" && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginTop: 8 } }, "\uD658\uBD88 \uC2E0\uCCAD\uC774 \uC811\uC218\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC6B4\uC601\uC790 \uD655\uC778 \uD6C4 \uCC98\uB9AC\uB429\uB2C8\uB2E4.", myReg.refundReason && /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, " \xB7 \uC0AC\uC720: ", myReg.refundReason)), myReg.refundAdminNote && myReg.status === "confirmed" && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: "var(--danger)", marginTop: 6 } }, "\uD658\uBD88 \uBC18\uB824 \uBA54\uBAA8: ", myReg.refundAdminNote), !refundMode && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: downloadIcs }, "\uCE98\uB9B0\uB354 \uCD94\uAC00 (.ics)"), myReg.status !== "refund_requested" && (isPaidConfirmed ? /* @__PURE__ */ React.createElement(
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
  ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBA54\uBAA8"), /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 2, value: note, onChange: (e) => setNote(e.target.value), placeholder: "\uB3D9\uD589\uC790 / \uD2B9\uC774\uC0AC\uD56D" })), (lecture.price || 0) > 0 && window.BGNJ_CashReceiptField && /* @__PURE__ */ React.createElement(window.BGNJ_CashReceiptField, { value: cashReceipt, onChange: setCashReceipt })), error && /* @__PURE__ */ React.createElement("div", { role: "alert", style: { padding: "8px 10px", background: "rgba(194,74,61,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: 12, marginBottom: 10 } }, error), /* @__PURE__ */ React.createElement("div", { className: "dim mono", style: { fontSize: 10, lineHeight: 1.7, marginBottom: 10, letterSpacing: "0.05em" } }, (lecture.price || 0) === 0 ? "\uBB34\uB8CC \uAC15\uC5F0\uC774\uB77C \uC2E0\uCCAD \uC989\uC2DC \uCC38\uAC00 \uD655\uC815\uB429\uB2C8\uB2E4." : `\uD569\uACC4 ${formatPrice((lecture.price || 0) * (Number(count) || 1))} \xB7 \uC2E0\uCCAD \u2192 \uC785\uAE08 \u2192 \uC6B4\uC601\uC790 \uD655\uC778 \u2192 \uCC38\uAC00 \uD655\uC815`, isFull && " \xB7 \uC815\uC6D0\uC774 \uCC28\uC11C \uC790\uB3D9 \uB300\uAE30\uC790 \uB4F1\uB85D\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setOpen(false) }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small" }, "\uC2E0\uCCAD \uC811\uC218")))), !user && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.7, marginTop: 14, textAlign: "center" } }, "\uAC15\uC5F0 \uC2E0\uCCAD\uC740 \uD68C\uC6D0\uAC00\uC785\uD55C \uBD84\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4."));
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
Object.assign(window, { LecturesPage, LectureBookingPanel, LectureReviewsSection });

})();

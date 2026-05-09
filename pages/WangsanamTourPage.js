(function(){
const WangsanamPage = ({ go }) => {
  const members = [
    { name: "\uBC45\uAE30\uB178\uC790", role: "\uCEE4\uBBA4\uB2C8\uD2F0\uC7A5 \xB7 \uC218\uC11D \uAC00\uC774\uB4DC", spec: "\uC870\uC120 \uC815\uCE58\uC0AC \xB7 \uC2E4\uB85D \uB3C5\uD574", years: 15, desc: "15\uB144\uAC04 \uC2E4\uB85D\uACFC \uAD81\uAD90\uC744 \uAC77\uB2E4. \u300E\uC655\uC758\uAE38\u300F \uC800\uC790. \uBC45\uAE30\uB178\uC790 \uCEE4\uBBA4\uB2C8\uD2F0\uB97C \uC138\uC6B0\uACE0 \uC774\uB048\uB2E4." },
    { name: "\uC774\uACF5", role: "\uAC74\uCD95 \uAC00\uC774\uB4DC", spec: "\uAD81\uAD90 \uAC74\uCD95 \xB7 \uB3C4\uC2DC \uACF5\uAC04", years: 12, desc: "\uC870\uC120 \uAD81\uAD90\uC758 \uACF5\uAC04 \uC5B8\uC5B4\uB97C \uC77D\uB294\uB2E4. \uC218\uC6D0 \uD654\uC131 \uC804\uBB38." },
    { name: "\uC815\uC0AC\uAD00", role: "\uC0AC\uB8CC \uAC00\uC774\uB4DC", spec: "\uC870\uC120\uC655\uC870\uC2E4\uB85D \xB7 \uC2B9\uC815\uC6D0\uC77C\uAE30", years: 10, desc: "\uC6D0\uBB38 \uC0AC\uB8CC\uB97C \uD568\uAED8 \uC77D\uB294 \uD504\uB85C\uADF8\uB7A8\uC744 \uC6B4\uC601. \uACE0\uC804\uBC88\uC5ED\uC6D0 \uCD9C\uC2E0." },
    { name: "\uC5EC\uBC31", role: "\uBBF8\uD559 \uAC00\uC774\uB4DC", spec: "\uC870\uC120 \uD68C\uD654 \xB7 \uC655\uC2E4 \uBBF8\uC220", years: 8, desc: "\uC655\uC2E4 \uD68C\uD654\uC640 \uACF5\uC608\uB97C \uD1B5\uD574 \uAD70\uC8FC\uC758 \uBBF8\uC758\uC2DD\uC744 \uC9DA\uB294\uB2E4." },
    { name: "\uBB18\uC720", role: "\uCCA0\uD559 \uAC00\uC774\uB4DC", spec: "\uC131\uB9AC\uD559 \xB7 \uB3D9\uC591\uC0AC\uC0C1", years: 9, desc: "\uC720\uD559\uC801 \uC138\uACC4\uAD00 \uC18D \uC655\uC758 \uC790\uB9AC\uB97C \uC77D\uC5B4\uB0B8\uB2E4. \uC131\uADE0\uAD00\uB300 \uBC15\uC0AC." }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 80 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", style: { justifyContent: "center" } }, "ABOUT \xB7 \uC655\uC0AC\uB0A8"), /* @__PURE__ */ React.createElement("h1", { className: "section-title", style: { fontSize: 56 } }, "\uC655\uC758 \uC0AC\uB098\uC774 ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, "\uB2E4\uC12F")), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle", style: { margin: "0 auto", textAlign: "center" } }, "\uB2E4\uC12F \uBD84\uC57C\uC758 \uC5F0\uAD6C\uC790\uAC00 \uBAA8\uC5EC \uC870\uC120\uC744 \uC77D\uB294\uB2E4. \uC655\uC0AC\uB0A8\uC740 \uD574\uC124\uD558\uC9C0 \uC54A\uB294\uB2E4 \u2014 \uD568\uAED8 \uC9C8\uBB38\uD55C\uB2E4.")), /* @__PURE__ */ React.createElement(Ornament, null, "\u4E94"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 32, marginTop: 60 } }, members.map((m, i) => (
    // v00.184 — wsm-member-card 모바일 1열 폴백 클래스 추가 (디자인 룰 §2.5 모바일 정책).
    /* @__PURE__ */ React.createElement(
      "div",
      {
        key: i,
        className: `card wsm-member-card ${i === 0 ? "card-gold" : ""}`,
        style: { display: "grid", gridTemplateColumns: "200px 1fr auto", gap: 40, alignItems: "center", padding: 32 }
      },
      /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: { aspectRatio: "1", fontSize: 9 } }, i === 0 ? "\u2605 LEAD" : `\u25CB 0${i + 1}`),
      /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, letterSpacing: "0.3em", color: "var(--secondary)", marginBottom: 8 } }, String(i + 1).padStart(2, "0"), " / ", String(members.length).padStart(2, "0"), " \xB7 ", m.spec), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 28, fontWeight: 500, marginBottom: 6 } }, m.name, i === 0 && /* @__PURE__ */ React.createElement("span", { className: "gold", style: { fontSize: 14, marginLeft: 12 } }, "\u25C6 \uCEE4\uBBA4\uB2C8\uD2F0\uC7A5")), /* @__PURE__ */ React.createElement("div", { className: "dim mono", style: { fontSize: 12, letterSpacing: "0.1em", marginBottom: 12 } }, m.role), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, lineHeight: 1.7, maxWidth: 600 } }, m.desc)),
      /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "ko-serif gold-2", style: { fontSize: 40, lineHeight: 1 } }, m.years), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginTop: 4 } }, "YEARS"))
    )
  ))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 80, textAlign: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("tour") }, "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8 \uC0B4\uD3B4\uBCF4\uAE30 \u2192"))));
};
const TourPage = ({ go, user }) => {
  var _a, _b, _c, _d;
  const [tick, setTick] = React.useState(0);
  const G = window.BGNJ_GUARD;
  const tours = React.useMemo(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_TOURS) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
  }), [tick]);
  const bank = React.useMemo(() => G.call(() => {
    var _a2, _b2, _c2;
    return ((_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.getBankAccount) == null ? void 0 : _b2.call(_a2)) || ((_c2 = window.BGNJ_STORES) == null ? void 0 : _c2.bankAccount);
  }, {}), [tick]);
  const refresh = () => setTick((v) => v + 1);
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [addOpen, setAddOpen] = React.useState(false);
  const isAdmin = !!(user == null ? void 0 : user.isAdmin);
  React.useEffect(() => {
    let pending = null;
    try {
      pending = sessionStorage.getItem("bgnj_pending_tour_id");
    } catch (e) {
    }
    if (pending) {
      try {
        sessionStorage.removeItem("bgnj_pending_tour_id");
      } catch (e) {
      }
      const idx = tours.findIndex((t) => String(t.id) === String(pending));
      if (idx >= 0) setSelectedIdx(idx);
    }
  }, []);
  if (!tours.length) {
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 560, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { marginBottom: isAdmin ? 18 : 0 } }, "\uC608\uC815\uB41C \uB2F5\uC0AC \uD504\uB85C\uADF8\uB7A8\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."), isAdmin && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: () => setAddOpen(true) }, "\uFF0B \uD22C\uC5B4 \uCD94\uAC00")), addOpen && isAdmin && /* @__PURE__ */ React.createElement(TourQuickAddModal, { onClose: () => setAddOpen(false), onSaved: refresh }));
  }
  const safeIdx = Math.max(0, Math.min(selectedIdx, tours.length - 1));
  const tour = tours[safeIdx];
  const seats = G.call(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_TOURS) == null ? void 0 : _a2.getSeats) == null ? void 0 : _b2.call(_a2, tour.id);
  }, { capacity: 0, taken: 0, waitlist: 0, remaining: 0 });
  const myReg = user ? G.call(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_TOURS) == null ? void 0 : _a2.hasUserReserved) == null ? void 0 : _b2.call(_a2, tour.id, user.id);
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
    // v00.230 — confirmed = secondary (가독성).
    confirmed: "var(--secondary)",
    waitlist: "var(--ink-2)",
    cancelled: "var(--danger)",
    pending_payment: "var(--ink-2)",
    refund_requested: "var(--warning)"
  })[s] || "var(--ink-2)";
  const sc070 = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
  const intro = sc070.tourIntro && typeof sc070.tourIntro === "object" ? sc070.tourIntro : {};
  const introEyebrow = intro.eyebrow || "TOUR \xB7 \uB2F5\uC0AC";
  const introPrefix = (_c = intro.titlePrefix) != null ? _c : "\uBC1C\uB85C \uC77D\uB294 ";
  const introAccent = (_d = intro.titleAccent) != null ? _d : "\uC870\uC120";
  const introSubtitle = intro.subtitle || "\uBC45\uAE30\uB178\uC790\uC640 \uC655\uC0AC\uB0A8\uC774 \uC9C1\uC811 \uC6B4\uC601\uD558\uB294 \uD504\uB85C\uADF8\uB7A8. \uD68C\uC6D0 \uC804\uC6A9 \uC2E0\uCCAD \xB7 \uBB34\uD1B5\uC7A5 \uC785\uAE08 \uACB0\uC81C.";
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 48 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, introEyebrow), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, introPrefix, /* @__PURE__ */ React.createElement("span", { className: "accent" }, introAccent)), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, introSubtitle)), isAdmin && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: () => setAddOpen(true) }, "\uFF0B \uD22C\uC5B4 \uCD94\uAC00")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 0, borderBottom: "1px solid var(--line-2)", marginBottom: 40, overflowX: "auto" } }, tours.map((t, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t.id,
      onClick: () => setSelectedIdx(i),
      style: {
        padding: "20px 28px",
        fontSize: 13,
        whiteSpace: "nowrap",
        fontFamily: "var(--font-serif)",
        // v00.230 — 탭 활성 라벨은 secondary. indicator 는 옐로우 유지.
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
    String(t.title || "").split(" \u2014 ")[0]
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 60 }, className: "tour-grid" }, /* @__PURE__ */ React.createElement("div", null, (() => {
    var _a2, _b2, _c2, _d2;
    const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
    const coverUri = tour.coverUrl || ((_d2 = (_c2 = sc.tourPages) == null ? void 0 : _c2[tour.id]) == null ? void 0 : _d2.coverDataUri) || "";
    if (coverUri) {
      return /* @__PURE__ */ React.createElement("div", { style: { aspectRatio: "16/10", marginBottom: 32, overflow: "hidden", borderRadius: 2, background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: coverUri,
          alt: tour.title || "\uD22C\uC5B4 \uCEE4\uBC84",
          style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
        }
      ));
    }
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, window.CoverPlaceholder ? /* @__PURE__ */ React.createElement(window.CoverPlaceholder, { aspectRatio: "16/10", label: String(tour.title || "").toUpperCase() }) : /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: { aspectRatio: "16/10", fontSize: 11 } }, String(tour.title || "").toUpperCase()));
  })(), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "badge badge-gold" }, tour.level), /* @__PURE__ */ React.createElement("span", { className: "badge" }, tour.duration), /* @__PURE__ */ React.createElement("span", { className: "badge" }, tour.group), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-2)", border: "1px solid var(--line-2)", padding: "1px 6px" } }, "\uBB34\uD1B5\uC7A5 \uC785\uAE08")), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 40, fontWeight: 500, lineHeight: 1.2, marginBottom: tour.subtitle ? 6 : 24 } }, tour.title), tour.subtitle && /* @__PURE__ */ React.createElement("p", { className: "ko-serif gold-2", style: { fontSize: 18, lineHeight: 1.4, marginBottom: 24, fontStyle: "italic" } }, tour.subtitle), /* @__PURE__ */ React.createElement("p", { className: "dim bgnj-multiline", style: { fontSize: 16, lineHeight: 1.9, marginBottom: 32 } }, tour.desc), (() => {
    var _a2, _b2;
    const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
    const perTour = sc.tourPages && typeof sc.tourPages === "object" && (tour == null ? void 0 : tour.id) ? sc.tourPages[tour.id] || null : null;
    const ovrSchedule = Array.isArray(perTour == null ? void 0 : perTour.schedule) ? perTour.schedule : null;
    const ovrPrep = Array.isArray(perTour == null ? void 0 : perTour.prep) ? perTour.prep : null;
    const schedule = ovrSchedule && ovrSchedule.length > 0 ? ovrSchedule.filter((s) => s && (s.t || s.l)) : Array.isArray(sc.tourSchedule) ? sc.tourSchedule.filter((s) => s && (s.t || s.l)) : [];
    const prep = ovrPrep && ovrPrep.length > 0 ? ovrPrep.filter(Boolean) : Array.isArray(sc.tourPrep) ? sc.tourPrep.filter(Boolean) : [];
    return /* @__PURE__ */ React.createElement(React.Fragment, null, schedule.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--line)" } }, "\uB2F5\uC0AC \uC77C\uC815"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, schedule.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "100px 1fr", gap: 24, padding: "14px 0", borderBottom: "1px dashed var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 12, letterSpacing: "0.1em" } }, s.t), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 15 } }, s.l))))), prep.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--line)" } }, "\uC900\uBE44\uBB3C"), /* @__PURE__ */ React.createElement("ul", { style: { paddingLeft: 20, color: "var(--ink-2)", lineHeight: 2, fontSize: 14, marginBottom: 48 } }, prep.map((p, i) => /* @__PURE__ */ React.createElement("li", { key: i }, p)))));
  })(), (() => {
    var _a2, _b2;
    const sc = ((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {};
    const policy = tour.refundPolicy && tour.refundPolicy.trim() || sc.tourRefundPolicy && String(sc.tourRefundPolicy).trim() || "";
    if (!policy) return null;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--line)" } }, "\uD658\uBD88\uC815\uCC45"), /* @__PURE__ */ React.createElement("p", { className: "dim bgnj-multiline", style: { fontSize: 14, lineHeight: 1.9, marginBottom: 48 } }, policy));
  })(), /* @__PURE__ */ React.createElement(TourReviewsSection, { tour, user, go, onRefresh: refresh })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    TourBookingPanel,
    {
      tour,
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
  )))), addOpen && isAdmin && /* @__PURE__ */ React.createElement(TourQuickAddModal, { onClose: () => setAddOpen(false), onSaved: refresh }));
};
const TourQuickAddModal = ({ onClose, onSaved }) => {
  var _a;
  const _defaultStartLocal = (() => {
    const d = new Date(Date.now() + 14 * 864e5);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00`;
  })();
  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [level, setLevel] = React.useState("\uC785\uBB38");
  const [duration, setDuration] = React.useState("3\uC2DC\uAC04");
  const [group, setGroup] = React.useState("12\uC778 \uC774\uD558");
  const [startsAt, setStartsAt] = React.useState(_defaultStartLocal);
  const [durationMinutes, setDurationMinutes] = React.useState(180);
  const [capacity, setCapacity] = React.useState(12);
  const [price, setPrice] = React.useState(8e4);
  const [desc, setDesc] = React.useState("");
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const dirty = !!(title.trim() || subtitle.trim() || desc.trim());
  const guard = ((_a = window.useModalGuard) == null ? void 0 : _a.call(window, { open: true, dirty, onClose, onSaveDraft: null, label: "\uD22C\uC5B4 \uCD94\uAC00" })) || {};
  const submit = async (e) => {
    var _a2, _b, _c, _d, _e, _f, _g;
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("\uD22C\uC5B4 \uC81C\uBAA9\uC740 \uD544\uC218\uC785\uB2C8\uB2E4.");
      return;
    }
    if (!startsAt) {
      setError("\uC77C\uC2DC\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    setSaving(true);
    try {
      const dt = new Date(startsAt);
      if (isNaN(dt.getTime())) throw new Error("\uC77C\uC2DC \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
      const pad = (n) => String(n).padStart(2, "0");
      const next = `${dt.getFullYear()}.${pad(dt.getMonth() + 1)}.${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
      const id = `tour-${Date.now()}`;
      await window.BGNJ_TOURS.saveTour({
        id,
        title: title.trim(),
        subtitle: subtitle.trim(),
        level: level.trim() || "\uC785\uBB38",
        duration: duration.trim(),
        group: group.trim(),
        next,
        startsAt: dt.toISOString(),
        durationMinutes: Math.max(1, Number(durationMinutes) || 180),
        capacity: Math.max(1, Number(capacity) || 12),
        priceNumber: Math.max(0, Number(price) || 0),
        price: Math.max(0, Number(price) || 0),
        desc: desc.trim()
      });
      try {
        await ((_b = (_a2 = window.BGNJ_AUDIT) == null ? void 0 : _a2.log) == null ? void 0 : _b.call(_a2, { action: "tour.create", target: `tour:${id}` }));
      } catch (e2) {
      }
      try {
        (_d = (_c = window.BGNJ_BROADCAST) == null ? void 0 : _c.publish) == null ? void 0 : _d.call(_c, "tours");
      } catch (e2) {
      }
      (_f = (_e = window.BGNJ_TOAST) == null ? void 0 : _e.success) == null ? void 0 : _f.call(_e, "\uD22C\uC5B4\uAC00 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
      onSaved == null ? void 0 : onSaved();
      onClose == null ? void 0 : onClose();
    } catch (err) {
      setError(((_g = err == null ? void 0 : err.body) == null ? void 0 : _g.error) || (err == null ? void 0 : err.message) || "\uD22C\uC5B4 \uC0DD\uC131 \uC2E4\uD328");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "\uD22C\uC5B4 \uCD94\uAC00",
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
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 18, margin: 0 } }, "\uC0C8 \uD22C\uC5B4 \uCD94\uAC00"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onClose }, "\uB2EB\uAE30")), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginBottom: 18 } }, "\uAE30\uBCF8 \uC815\uBCF4\uB9CC \uC785\uB825\uD574 \uBE60\uB974\uAC8C \uB4F1\uB85D\uD569\uB2C8\uB2E4. \uC77C\uC815\xB7\uC900\uBE44\uBB3C\xB7\uCEE4\uBC84\xB7\uD658\uBD88\uC815\uCC45 \uB4F1 \uC0C1\uC138 \uD3B8\uC9D1\uC740 \uAD00\uB9AC\uC790 \uD328\uB110\uC5D0\uC11C \uC774\uC5B4\uC11C \uC9C4\uD589\uD558\uC138\uC694."), /* @__PURE__ */ React.createElement("form", { onSubmit: submit, style: { display: "grid", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uD22C\uC5B4 \uC81C\uBAA9 *"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: title,
        onChange: (e) => setTitle(e.target.value),
        placeholder: "\uC608: \uCC3D\uB355\uAD81 \uD6C4\uC6D0 \uB2F5\uC0AC",
        autoFocus: true
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBD80\uC81C (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: subtitle,
        onChange: (e) => setSubtitle(e.target.value),
        placeholder: "\uC608: \uC815\uC870\uC758 \uD6A8\uC2EC\uC744 \uB530\uB77C"
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uB09C\uC774\uB3C4"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: level,
        onChange: (e) => setLevel(e.target.value),
        placeholder: "\uC785\uBB38/\uC2EC\uD654"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC18C\uC694 (\uD45C\uC2DC)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: duration,
        onChange: (e) => setDuration(e.target.value),
        placeholder: "3\uC2DC\uAC04"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uADDC\uBAA8 (\uD45C\uC2DC)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: group,
        onChange: (e) => setGroup(e.target.value),
        placeholder: "12\uC778 \uC774\uD558"
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uCD9C\uBC1C \uC77C\uC2DC *"), /* @__PURE__ */ React.createElement(
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
    ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC18C\uAC1C (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        className: "field-input",
        rows: 3,
        value: desc,
        onChange: (e) => setDesc(e.target.value),
        placeholder: "\uB2F5\uC0AC \uC548\uB0B4 (\uC774\uD6C4 \uAD00\uB9AC\uC790 \uD328\uB110\uC5D0\uC11C \uBCF4\uAC15 \uAC00\uB2A5)"
      }
    )), error && /* @__PURE__ */ React.createElement("div", { role: "alert", style: { padding: "8px 10px", background: "rgba(194,74,61,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: 12 } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onClose, disabled: saving }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small", disabled: saving || !title.trim() }, saving ? "\uC800\uC7A5 \uC911..." : "\uD22C\uC5B4 \uB4F1\uB85D"))))
  );
};
const TourBookingPanel = ({ tour, user, bank, myReg, seats, labelStatus, tone, formatPrice, onRefresh, go }) => {
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
  }, [tour.id, user == null ? void 0 : user.id]);
  const requireLogin = async (label) => {
    if (await window.BGNJ_CONFIRM(`${label}\uC740(\uB294) \uB85C\uADF8\uC778 \uD6C4 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) {
      go("login");
    }
  };
  const submit = async (e) => {
    var _a, _b, _c;
    e.preventDefault();
    setError("");
    if (!user) return requireLogin("\uB2F5\uC0AC \uC2E0\uCCAD");
    if (!name.trim() || !email.trim()) {
      setError("\uC774\uB984\uACFC \uC774\uBA54\uC77C\uC740 \uD544\uC218\uC785\uB2C8\uB2E4.");
      return;
    }
    try {
      const crPrefix = ((_b = (_a = window.BGNJ_CashReceipt) == null ? void 0 : _a.encode) == null ? void 0 : _b.call(_a, cashReceipt)) || "";
      const noteCombined = (crPrefix + (note.trim() || "")).trim();
      const result = await window.BGNJ_TOURS.reserve(tour.id, {
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
      setSubmitted(result.reservation);
      onRefresh();
      setOpen(false);
    } catch (err) {
      setError(((_c = err == null ? void 0 : err.body) == null ? void 0 : _c.error) || (err == null ? void 0 : err.message) || "\uC2E0\uCCAD \uCC98\uB9AC \uC911 \uC624\uB958");
    }
  };
  const cancelMyReg = async () => {
    var _a;
    if (!myReg) return;
    if (!await window.BGNJ_CONFIRM("\uC774 \uB2F5\uC0AC \uC2E0\uCCAD\uC744 \uCDE8\uC18C\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) return;
    try {
      await window.BGNJ_TOURS.cancelReservation(tour.id, myReg.id);
      onRefresh();
      setSubmitted(null);
    } catch (err) {
      window.BGNJ_TOAST.error("\uCDE8\uC18C \uC2E4\uD328: " + (((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || (err == null ? void 0 : err.message) || ""));
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
      const result = await window.BGNJ_TOURS.requestRefund(tour.id, myReg.id, refundReason);
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
  const downloadIcs = () => window.BGNJ_TOURS.downloadIcs(tour.id);
  const showPaymentInfo = (tour.priceNumber || 0) > 0 && ((myReg == null ? void 0 : myReg.status) === "pending_payment" || (submitted == null ? void 0 : submitted.status) === "pending_payment");
  const isFull = seats.remaining <= 0;
  const isPaidConfirmed = (myReg == null ? void 0 : myReg.status) === "confirmed" && (tour.priceNumber || 0) > 0;
  return /* @__PURE__ */ React.createElement("div", { className: "card card-gold mobile-release-sticky", style: { position: "sticky", top: 100 } }, /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 10, letterSpacing: "0.3em" } }, "NEXT SCHEDULE"), /* @__PURE__ */ React.createElement("div", { className: "gold-2 ko-serif", style: { fontSize: 24, margin: "8px 0 20px" } }, tour.next), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uCC38\uAC00\uBE44"), /* @__PURE__ */ React.createElement("span", { className: "gold-2 ko-serif", style: { fontSize: 22 } }, formatPrice(tour.priceNumber))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC18C\uC694 \uC2DC\uAC04"), /* @__PURE__ */ React.createElement("span", null, tour.duration)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC815\uC6D0"), /* @__PURE__ */ React.createElement("span", null, tour.capacity, "\uBA85")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC794\uC5EC"), /* @__PURE__ */ React.createElement("span", { style: { color: isFull ? "var(--danger)" : "var(--secondary)" } }, isFull ? `\uB300\uAE30 ${seats.waitlist}\uBA85` : `${seats.remaining}\uC11D`)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uB09C\uC774\uB3C4"), /* @__PURE__ */ React.createElement("span", { className: "gold" }, tour.level)), myReg && /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "rgba(245,213,72,0.06)", border: "1px solid var(--primary-dim)", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", marginBottom: 6 } }, "MY RESERVATION"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: 16 } }, labelStatus(myReg.status)), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 11, letterSpacing: "0.2em", color: tone(myReg.status) } }, myReg.count, "\uBA85 \xB7 ", formatPrice((tour.priceNumber || 0) * (myReg.count || 1)))), myReg.status === "pending_payment" && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginTop: 8 } }, "\uACC4\uC88C\uB85C \uC785\uAE08 \uD6C4 \uC6B4\uC601\uC790\uAC00 \uD655\uC778\uD558\uBA74 \uCC38\uAC00\uAC00 \uD655\uC815\uB429\uB2C8\uB2E4."), myReg.status === "waitlist" && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginTop: 8 } }, "\uC815\uC6D0\uC774 \uCC28\uC11C \uB300\uAE30 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC790\uB9AC\uAC00 \uB098\uBA74 \uC790\uB3D9\uC73C\uB85C \uC804\uD658\uB429\uB2C8\uB2E4."), myReg.status === "refund_requested" && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginTop: 8 } }, "\uD658\uBD88 \uC2E0\uCCAD\uC774 \uC811\uC218\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC6B4\uC601\uC790 \uD655\uC778 \uD6C4 \uCC98\uB9AC\uB429\uB2C8\uB2E4.", myReg.refundReason && /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, " \xB7 \uC0AC\uC720: ", myReg.refundReason)), myReg.refundAdminNote && myReg.status === "confirmed" && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: "var(--danger)", marginTop: 6 } }, "\uD658\uBD88 \uBC18\uB824 \uBA54\uBAA8: ", myReg.refundAdminNote), !refundMode && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: downloadIcs }, "\uCE98\uB9B0\uB354 \uCD94\uAC00 (.ics)"), myReg.status !== "refund_requested" && (isPaidConfirmed ? /* @__PURE__ */ React.createElement(
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
  } }, /* @__PURE__ */ React.createElement("span", { className: "dim", style: { fontSize: 13 } }, "\uC785\uAE08 \uAE08\uC561"), /* @__PURE__ */ React.createElement("span", { className: "gold ko-serif", style: { fontSize: 18 } }, formatPrice((tour.priceNumber || 0) * ((myReg == null ? void 0 : myReg.count) || (submitted == null ? void 0 : submitted.count) || 1))))), !myReg && !submitted && /* @__PURE__ */ React.createElement(React.Fragment, null, !open ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-gold btn-block",
      style: { marginBottom: 10 },
      onClick: () => {
        if (!user) {
          requireLogin("\uB2F5\uC0AC \uC2E0\uCCAD");
          return;
        }
        setOpen(true);
        setError("");
      }
    },
    isFull ? "\uB300\uAE30\uC790 \uB4F1\uB85D" : "\uB2F5\uC0AC \uC2E0\uCCAD"
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-block", onClick: downloadIcs }, "\uCE98\uB9B0\uB354\uC5D0 \uCD94\uAC00 (.ics)")) : /* @__PURE__ */ React.createElement("form", { onSubmit: submit }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: name, onChange: (e) => setName(e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement("input", { type: "email", className: "field-input", value: email, onChange: (e) => setEmail(e.target.value) })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 100px", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC5F0\uB77D\uCC98"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "010-..." })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC778\uC6D0"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: 1,
      max: Math.max(1, tour.capacity),
      className: "field-input",
      value: count,
      onChange: (e) => setCount(e.target.value)
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBA54\uBAA8"), /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 2, value: note, onChange: (e) => setNote(e.target.value), placeholder: "\uB3D9\uD589\uC790 / \uD2B9\uC774\uC0AC\uD56D" })), (tour.priceNumber || 0) > 0 && window.BGNJ_CashReceiptField && /* @__PURE__ */ React.createElement(window.BGNJ_CashReceiptField, { value: cashReceipt, onChange: setCashReceipt })), error && /* @__PURE__ */ React.createElement("div", { role: "alert", style: { padding: "8px 10px", background: "rgba(194,74,61,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: 12, marginBottom: 10 } }, error), /* @__PURE__ */ React.createElement("div", { className: "dim mono", style: { fontSize: 10, lineHeight: 1.7, marginBottom: 10, letterSpacing: "0.05em" } }, (tour.priceNumber || 0) === 0 ? "\uBB34\uB8CC \uB2F5\uC0AC\uB77C \uC2E0\uCCAD \uC989\uC2DC \uCC38\uAC00 \uD655\uC815\uB429\uB2C8\uB2E4." : `\uD569\uACC4 ${formatPrice((tour.priceNumber || 0) * (Number(count) || 1))} \xB7 \uC2E0\uCCAD \u2192 \uC785\uAE08 \u2192 \uC6B4\uC601\uC790 \uD655\uC778 \u2192 \uCC38\uAC00 \uD655\uC815`, isFull && " \xB7 \uC815\uC6D0\uC774 \uCC28\uC11C \uC790\uB3D9 \uB300\uAE30\uC790 \uB4F1\uB85D\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setOpen(false) }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small" }, "\uC2E0\uCCAD \uC811\uC218")))), !user && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.7, marginTop: 14, textAlign: "center" } }, "\uB2F5\uC0AC \uC2E0\uCCAD\uC740 \uD68C\uC6D0\uAC00\uC785\uD55C \uBD84\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4."));
};
const TourReviewsSection = ({ tour, user, go, onRefresh }) => {
  const reviews = window.BGNJ_TOURS.listReviews(tour.id);
  const canReview = user ? window.BGNJ_TOURS.canReview(tour.id, user.id) : false;
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState("");
  const gateContent = (() => {
    var _a, _b;
    const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
    const g = sc.tourReviewsGate && typeof sc.tourReviewsGate === "object" ? sc.tourReviewsGate : {};
    return {
      gate: g.gate || "\uD6C4\uAE30\uB294 \uCC38\uAC00 \uD655\uC815\uB41C \uD68C\uC6D0\uB9CC \uC791\uC131\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC544\uC9C1 \uC2E0\uCCAD \uC804\uC774\uB77C\uBA74 \uC0AC\uC774\uB4DC\uBC14\uC5D0\uC11C \uB2F5\uC0AC\uB97C \uC2E0\uCCAD\uD558\uACE0 \uC6B4\uC601\uC790 \uC785\uAE08 \uD655\uC778\uC744 \uBC1B\uC740 \uB4A4 \uB2E4\uC2DC \uC640 \uC8FC\uC138\uC694.",
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
    window.BGNJ_TOURS.addReview(tour.id, {
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
    window.BGNJ_TOURS.deleteReview(tour.id, id);
    onRefresh == null ? void 0 : onRefresh();
  };
  const avgRating = reviews.length === 0 ? 0 : reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;
  const stars = (n) => "\u2605".repeat(Math.round(n)) + "\u2606".repeat(5 - Math.round(n));
  return /* @__PURE__ */ React.createElement("section", { "aria-labelledby": "tour-reviews" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("h3", { id: "tour-reviews", className: "ko-serif", style: { fontSize: 20 } }, "\uCC38\uC5EC \uD6C4\uAE30 ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 12, marginLeft: 6 } }, reviews.length, "\uAC74")), reviews.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 12, letterSpacing: "0.16em" } }, "\uD3C9\uADE0 ", avgRating.toFixed(1), " ", stars(avgRating))), user ? canReview ? /* @__PURE__ */ React.createElement("form", { onSubmit: submit, className: "card", style: { padding: 16, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 10 } }, "WRITE A REVIEW"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, alignItems: "center", marginBottom: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "dim", style: { fontSize: 12 } }, "\uD3C9\uC810"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 2 } }, [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ React.createElement(
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
      placeholder: "\uB2F5\uC0AC\uAC00 \uC5B4\uB560\uB294\uC9C0 \uC9E7\uAC8C \uB0A8\uACA8 \uC8FC\uC138\uC694.",
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
Object.assign(window, { WangsanamPage, TourPage, TourBookingPanel, TourReviewsSection, TourQuickAddModal });

})();

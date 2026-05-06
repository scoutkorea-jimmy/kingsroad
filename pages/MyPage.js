(function(){
const MyPage = ({ go, user, cart }) => {
  var _a, _b, _c, _d;
  const [tab, setTab] = React.useState("lectures");
  const [orderTick, setOrderTick] = React.useState(0);
  const [refundTarget, setRefundTarget] = React.useState(null);
  const [refundReason, setRefundReason] = React.useState("");
  const [refundError, setRefundError] = React.useState("");
  const refreshOrders = () => setOrderTick((v) => v + 1);
  React.useEffect(() => {
    var _a2, _b2, _c2, _d2, _e, _f, _g, _h;
    const onR = () => refreshOrders();
    const events = [
      "bgnj-orders-refresh",
      "bgnj-lectures-refresh",
      "bgnj-tours-refresh",
      "bgnj-notifications-refresh"
    ];
    events.forEach((e) => window.addEventListener(e, onR));
    if (user == null ? void 0 : user.id) {
      Promise.allSettled([
        (_b2 = (_a2 = window.BGNJ_BOOK_ORDERS) == null ? void 0 : _a2.refreshMine) == null ? void 0 : _b2.call(_a2),
        (_d2 = (_c2 = window.BGNJ_LECTURES) == null ? void 0 : _c2.refreshMine) == null ? void 0 : _d2.call(_c2),
        (_f = (_e = window.BGNJ_TOURS) == null ? void 0 : _e.refreshMine) == null ? void 0 : _f.call(_e),
        (_h = (_g = window.BGNJ_COMMUNITY) == null ? void 0 : _g.refreshNotifications) == null ? void 0 : _h.call(_g, user.id)
      ]).then(() => refreshOrders());
    }
    return () => events.forEach((e) => window.removeEventListener(e, onR));
  }, [user == null ? void 0 : user.id]);
  const G = window.BGNJ_GUARD;
  const grades = G.arr(() => {
    var _a2;
    return (_a2 = window.BGNJ_STORES) == null ? void 0 : _a2.grades;
  });
  const grade = grades.find((item) => item.id === (user == null ? void 0 : user.gradeId));
  const upcomingLecture = G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
  }).filter((l) => l && !l.hidden)[0];
  const upcomingTour = G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_TOURS) == null ? void 0 : _a2.listAll) == null ? void 0 : _b2.call(_a2);
  }).filter((t) => t && !t.hidden)[0];
  const communityPosts = G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.listPosts) == null ? void 0 : _b2.call(_a2);
  });
  const myCommunityPosts = communityPosts.filter((post) => post.authorId === (user == null ? void 0 : user.id) || post.author === (user == null ? void 0 : user.name));
  const recentPost = myCommunityPosts[0] || communityPosts[0];
  const notifications = user ? G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.listNotifications) == null ? void 0 : _b2.call(_a2, user.id);
  }) : [];
  const unreadCount = notifications.filter((n) => n && !n.read).length;
  const myLectureRegs = user ? G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_LECTURES) == null ? void 0 : _a2.listMyRegistrations) == null ? void 0 : _b2.call(_a2, user.id);
  }) : [];
  const myOrders = React.useMemo(() => user ? G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_BOOK_ORDERS) == null ? void 0 : _a2.listMine) == null ? void 0 : _b2.call(_a2, user.id);
  }) : [], [user, orderTick]);
  const myTourRegs = user ? G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_TOURS) == null ? void 0 : _a2.listMyReservations) == null ? void 0 : _b2.call(_a2, user.id);
  }) : [];
  const tourStatusLabel = (s) => ({
    pending_payment: "\uC785\uAE08 \uB300\uAE30",
    confirmed: "\uCC38\uAC00 \uD655\uC815",
    waitlist: "\uB300\uAE30\uC790",
    refund_requested: "\uD658\uBD88 \uC2E0\uCCAD \uC911",
    cancelled: "\uCDE8\uC18C\uB428"
  })[s] || s;
  const tourStatusTone = (s) => ({
    confirmed: "var(--primary)",
    waitlist: "var(--ink-2)",
    cancelled: "var(--danger)",
    pending_payment: "var(--ink-2)",
    refund_requested: "var(--warning)"
  })[s] || "var(--ink-2)";
  const goToTour = (tourId) => {
    try {
      sessionStorage.setItem("bgnj_pending_tour_id", String(tourId));
    } catch (e) {
    }
    go("tour");
  };
  const orderStatusLabel = (s) => ({
    pending_payment: "\uC785\uAE08 \uB300\uAE30",
    paid: "\uC785\uAE08 \uD655\uC778 \xB7 \uBC1C\uC1A1 \uC900\uBE44",
    shipped: "\uBC30\uC1A1\uC911",
    delivered: "\uBC30\uC1A1 \uC644\uB8CC",
    refund_requested: "\uD658\uBD88 \uC2E0\uCCAD \uC911",
    cancelled: "\uCDE8\uC18C\uB428"
  })[s] || s;
  const orderStatusTone = (s) => ({
    pending_payment: "var(--ink-2)",
    paid: "var(--primary)",
    shipped: "var(--primary)",
    delivered: "var(--primary)",
    refund_requested: "var(--warning)",
    cancelled: "var(--danger)"
  })[s] || "var(--ink-2)";
  const goToPost = (postId) => {
    try {
      sessionStorage.setItem("bgnj_pending_post_id", String(postId));
    } catch (e) {
    }
    go("community");
  };
  const goToLecture = (lectureId) => {
    try {
      sessionStorage.setItem("bgnj_pending_lecture_id", String(lectureId));
    } catch (e) {
    }
    go("lectures");
  };
  const lectureStatusLabel = (s) => ({
    pending_payment: "\uC785\uAE08 \uB300\uAE30",
    confirmed: "\uCC38\uAC00 \uD655\uC815",
    waitlist: "\uB300\uAE30\uC790",
    refund_requested: "\uD658\uBD88 \uC2E0\uCCAD \uC911",
    cancelled: "\uCDE8\uC18C\uB428"
  })[s] || s;
  const lectureStatusTone = (s) => ({
    confirmed: "var(--primary)",
    waitlist: "var(--ink-2)",
    cancelled: "var(--danger)",
    pending_payment: "var(--ink-2)",
    refund_requested: "var(--warning)"
  })[s] || "var(--ink-2)";
  if (!user) {
    return /* @__PURE__ */ React.createElement("div", { className: "section", style: { minHeight: "calc(100vh - 72px)", display: "grid", placeItems: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { maxWidth: 520, textAlign: "center", padding: 40 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.24em", marginBottom: 12 } }, "MY PAGE"), /* @__PURE__ */ React.createElement("h1", { className: "ko-serif", style: { fontSize: 28, marginBottom: 14 } }, "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 24 } }, "\uB9C8\uC774\uD398\uC774\uC9C0\uC5D0\uC11C\uB294 \uACC4\uC815 \uC815\uBCF4, \uC608\uC815\uB41C \uAC15\uC5F0\uACFC \uB2F5\uC0AC, \uC8FC\uBB38 \uC0C1\uD0DC\uB97C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: () => go("login") }, "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: () => go("home") }, "\uD648\uC73C\uB85C"))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, (() => {
    var _a2, _b2, _c2, _d2, _e;
    const _i = (((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {}).myPageIntro || {};
    const eb = _i.eyebrow || "MY PAGE \xB7 \uD68C\uC6D0 \uC815\uBCF4";
    const tp = (_c2 = _i.titlePrefix) != null ? _c2 : "";
    const taTpl = (_d2 = _i.titleAccent) != null ? _d2 : "{name}";
    const ts = (_e = _i.titleSuffix) != null ? _e : " \uB2D8\uC758 \uC11C\uC7AC";
    const sb = _i.subtitle || "\uBC45\uAE30\uB178\uC790\uC5D0\uC11C\uC758 \uACC4\uC815 \uC0C1\uD0DC, \uC608\uC815\uB41C \uD504\uB85C\uADF8\uB7A8, \uCD5C\uADFC \uD65C\uB3D9\uC744 \uD55C \uACF3\uC5D0\uC11C \uD655\uC778\uD569\uB2C8\uB2E4.";
    const ta = String(taTpl).replace("{name}", user.name || "\uD68C\uC6D0");
    return /* @__PURE__ */ React.createElement(
      SectionHead,
      {
        eyebrow: eb,
        title: /* @__PURE__ */ React.createElement(React.Fragment, null, tp, /* @__PURE__ */ React.createElement("span", { className: "accent" }, ta), ts),
        subtitle: sb,
        action: /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("community") }, "\uCEE4\uBBA4\uB2C8\uD2F0\uB85C \uC774\uB3D9")
      }
    );
  })(), /* @__PURE__ */ React.createElement("div", { className: "grid grid-2", style: { alignItems: "start", marginBottom: 32 } }, /* @__PURE__ */ React.createElement("div", { className: "card card-gold" }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "ACCOUNT"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 22, marginBottom: 16 } }, user.name), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement("span", null, user.email)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uD68C\uC6D0 \uB4F1\uAE09"), /* @__PURE__ */ React.createElement("span", { className: "gold" }, (grade == null ? void 0 : grade.label) || user.gradeId || "\uBBF8\uC124\uC815")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uAD8C\uD55C"), /* @__PURE__ */ React.createElement("span", null, user.isAdmin ? "\uAD00\uB9AC\uC790" : "\uC77C\uBC18 \uD68C\uC6D0")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uAC00\uC785 \uC2DC\uAC01"), /* @__PURE__ */ React.createElement("span", null, user.joinedAt ? window.BGNJ_FMT.kstDate(user.joinedAt) : "\uBBF8\uAE30\uB85D")))), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "PROFILE"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 22, marginBottom: 16 } }, "\uB4F1\uB85D \uC815\uBCF4"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC804\uD654\uBC88\uD638"), /* @__PURE__ */ React.createElement("span", null, ((_a = user.profile) == null ? void 0 : _a.phone) || "\uBBF8\uC785\uB825")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC0DD\uB144\uC6D4\uC77C"), /* @__PURE__ */ React.createElement("span", null, ((_b = user.profile) == null ? void 0 : _b.birthdate) || "\uBBF8\uC785\uB825")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uAD00\uC2EC \uBD84\uC57C"), /* @__PURE__ */ React.createElement("span", null, ((_c = user.profile) == null ? void 0 : _c.interest) || "\uBBF8\uC120\uD0DD")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uB9C8\uCF00\uD305 \uC218\uC2E0"), /* @__PURE__ */ React.createElement("span", null, ((_d = user.consents) == null ? void 0 : _d.marketing) ? "\uB3D9\uC758" : "\uBBF8\uB3D9\uC758"))))), /* @__PURE__ */ React.createElement("div", { role: "tablist", style: { display: "flex", gap: 0, borderBottom: "1px solid var(--line-2)", marginBottom: 32, overflowX: "auto" } }, [
    { k: "lectures", label: `\uB0B4 \uC2E0\uCCAD \uAC15\uC5F0 (${myLectureRegs.length})` },
    { k: "tours", label: `\uB0B4 \uB2F5\uC0AC \uC2E0\uCCAD (${myTourRegs.length})` },
    { k: "orders", label: `\uB0B4 \uC8FC\uBB38 (${myOrders.length})` },
    { k: "notifications", label: `\uC54C\uB9BC (${notifications.length}${unreadCount > 0 ? ` \xB7 \uC548\uC77D\uC74C ${unreadCount}` : ""})` },
    { k: "community", label: `\uCEE4\uBBA4\uB2C8\uD2F0 \uD65C\uB3D9 (${myCommunityPosts.length})` },
    { k: "profile", label: `\uD504\uB85C\uD544 \uC218\uC815` }
  ].map((t) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t.k,
      type: "button",
      role: "tab",
      "aria-selected": tab === t.k,
      onClick: () => setTab(t.k),
      style: {
        padding: "14px 22px",
        fontSize: 13,
        whiteSpace: "nowrap",
        cursor: "pointer",
        fontFamily: "var(--font-serif)",
        color: tab === t.k ? "var(--primary)" : "var(--ink-2)",
        background: "transparent",
        border: "none",
        borderBottom: tab === t.k ? "2px solid var(--primary)" : "2px solid transparent",
        marginBottom: -1
      }
    },
    t.label
  ))), tab === "lectures" && /* @__PURE__ */ React.createElement("div", { className: "grid grid-3", style: { marginBottom: 32 } }, /* @__PURE__ */ React.createElement("article", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "MY LECTURES"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 10 } }, "\uB0B4 \uC2E0\uCCAD \uAC15\uC5F0 ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 12 } }, myLectureRegs.length, "\uAC74")), myLectureRegs.length === 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 16 } }, "\uC544\uC9C1 \uC2E0\uCCAD\uD55C \uAC15\uC5F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uAC15\uC5F0 \uD398\uC774\uC9C0\uC5D0\uC11C \uC2E0\uCCAD\uD574 \uBCF4\uC138\uC694."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("lectures") }, "\uAC15\uC5F0 \uC77C\uC815 \uBCF4\uAE30")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10, marginBottom: 14 } }, myLectureRegs.slice(0, 4).map((r) => {
    var _a2, _b2;
    return /* @__PURE__ */ React.createElement("li", { key: r.id }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => goToLecture(r.lectureId),
        style: {
          all: "unset",
          cursor: "pointer",
          width: "100%",
          padding: "10px 12px",
          borderLeft: `2px solid ${lectureStatusTone(r.status)}`,
          background: "rgba(245,213,72,0.04)"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, lineHeight: 1.5, marginBottom: 4 } }, ((_a2 = r.lecture) == null ? void 0 : _a2.topic) || "\uAC15\uC5F0"),
      /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.1em" } }, ((_b2 = r.lecture) == null ? void 0 : _b2.next) || "", " \xB7 ", r.count, "\uBA85 \xB7", " ", /* @__PURE__ */ React.createElement("span", { style: { color: lectureStatusTone(r.status) } }, lectureStatusLabel(r.status)))
    ));
  })), myLectureRegs.length > 4 && /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11, textAlign: "right", marginBottom: 8 } }, "\uC678 ", myLectureRegs.length - 4, "\uAC74"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("lectures") }, "\uAC15\uC5F0 \uC804\uCCB4 \uBCF4\uAE30")))), tab === "tours" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("article", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "MY TOURS"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 10 } }, "\uB0B4 \uB2F5\uC0AC \uC2E0\uCCAD ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 12 } }, myTourRegs.length, "\uAC74")), myTourRegs.length === 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 14 } }, "\uC544\uC9C1 \uC2E0\uCCAD\uD55C \uB2F5\uC0AC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8\uC5D0\uC11C \uC2E0\uCCAD\uD574 \uBCF4\uC138\uC694."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("tour") }, "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8 \uBCF4\uAE30")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10, marginBottom: 14 } }, myTourRegs.slice(0, 4).map((r) => {
    var _a2, _b2;
    return /* @__PURE__ */ React.createElement("li", { key: r.id }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => goToTour(r.tourId),
        style: {
          all: "unset",
          cursor: "pointer",
          width: "100%",
          padding: "10px 12px",
          borderLeft: `2px solid ${tourStatusTone(r.status)}`,
          background: "rgba(245,213,72,0.04)"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, lineHeight: 1.5, marginBottom: 4 } }, ((_a2 = r.tour) == null ? void 0 : _a2.title) || "\uB2F5\uC0AC"),
      /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.1em" } }, ((_b2 = r.tour) == null ? void 0 : _b2.next) || "", " \xB7 ", r.count, "\uBA85 \xB7", " ", /* @__PURE__ */ React.createElement("span", { style: { color: tourStatusTone(r.status) } }, tourStatusLabel(r.status)))
    ));
  })), myTourRegs.length > 4 && /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11, textAlign: "right", marginBottom: 8 } }, "\uC678 ", myTourRegs.length - 4, "\uAC74"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("tour") }, "\uD22C\uC5B4 \uC804\uCCB4 \uBCF4\uAE30")))), tab === "orders" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("article", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 } }, "BOOK ORDERS \xB7 \uB3C4\uC11C \uC8FC\uBB38"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 20, marginBottom: 10 } }, "\uB0B4 \uC8FC\uBB38 \uB0B4\uC5ED ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 12 } }, myOrders.length, "\uAC74")), myOrders.length === 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 14 } }, cart ? "\uACB0\uC81C \uB2E8\uACC4\uB85C \uC774\uB3D9\uD574 \uC8FC\uBB38\uC744 \uB9C8\uBB34\uB9AC\uD558\uC138\uC694." : "\uC544\uC9C1 \uC8FC\uBB38 \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go(cart ? "checkout" : "book") }, cart ? "\uC8FC\uBB38 \uACC4\uC18D\uD558\uAE30" : "\uCC45 \uBCF4\uB7EC \uAC00\uAE30")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10, marginBottom: 14 } }, myOrders.slice(0, 4).map((o) => /* @__PURE__ */ React.createElement(
    "li",
    {
      key: o.id,
      style: {
        padding: "10px 12px",
        borderLeft: `2px solid ${orderStatusTone(o.status)}`,
        background: "rgba(245,213,72,0.04)"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.16em" } }, o.orderNo), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.16em", color: orderStatusTone(o.status) } }, orderStatusLabel(o.status))),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, lineHeight: 1.5 } }, "\u300E", window.BGNJ_BOOK_ORDERS.getOrderBookTitle(o), "\u300F \xB7 ", o.version === "KR" ? "\uAD6D\uBB38\uD310" : "\uC601\uBB38\uD310", " \xD7 ", o.qty, " \xB7 ", /* @__PURE__ */ React.createElement("span", { className: "gold" }, window.BGNJ_FMT.won(o.total))),
    o.tracking && /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 10, marginTop: 4 } }, "\uC1A1\uC7A5 ", o.tracking),
    o.refundReason && o.status === "refund_requested" && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, marginTop: 4 } }, "\uD658\uBD88 \uC0AC\uC720: ", o.refundReason),
    o.refundAdminNote && o.status !== "refund_requested" && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, marginTop: 4 } }, "\uC6B4\uC601\uC790 \uBA54\uBAA8: ", o.refundAdminNote),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-ghost",
        onClick: () => window.BGNJ_BOOK_ORDERS.downloadReceipt(o.id),
        style: { fontSize: 11, color: "var(--primary)" }
      },
      "\uC601\uC218\uC99D \u2193"
    ), o.status === "pending_payment" && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-ghost",
        onClick: async () => {
          var _a2;
          if (!await window.BGNJ_CONFIRM(`\uC8FC\uBB38 ${o.orderNo}\uC744(\uB97C) \uCDE8\uC18C\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
          try {
            await window.BGNJ_BOOK_ORDERS.cancelOrder(o.id);
            refreshOrders();
          } catch (err) {
            window.BGNJ_TOAST.error("\uCDE8\uC18C \uC2E4\uD328: " + (((_a2 = err == null ? void 0 : err.body) == null ? void 0 : _a2.error) || (err == null ? void 0 : err.message) || ""));
          }
        },
        style: { fontSize: 11, color: "var(--danger)" }
      },
      "\uC8FC\uBB38 \uCDE8\uC18C"
    ), ["paid", "shipped"].includes(o.status) && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-ghost",
        onClick: () => {
          setRefundTarget(o);
          setRefundReason("");
          setRefundError("");
        },
        style: { fontSize: 11, color: "var(--warning)" }
      },
      "\uD658\uBD88 \uC2E0\uCCAD"
    ))
  ))), refundTarget && /* @__PURE__ */ React.createElement("div", { style: { padding: "16px", border: "1px solid var(--warning)", borderRadius: 4, marginBottom: 14, background: "rgba(217,119,6,0.10)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: "var(--warning)", marginBottom: 10 } }, "REFUND REQUEST \xB7 ", refundTarget.orderNo), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginBottom: 10 } }, "\uD658\uBD88 \uC2E0\uCCAD \uD6C4 \uC6B4\uC601\uC790 \uD655\uC778\uC744 \uAC70\uCCD0 \uCC98\uB9AC\uB429\uB2C8\uB2E4. \uC774\uBBF8 \uC785\uAE08\uB41C \uACBD\uC6B0 \uD658\uBD88 \uACC4\uC88C\uB97C \uBA54\uBAA8\uB780\uC5D0 \uB0A8\uACA8 \uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: refundReason,
      onChange: (e) => setRefundReason(e.target.value),
      placeholder: "\uD658\uBD88 \uC0AC\uC720 (\uD544\uC218)",
      className: "field-input",
      rows: 2,
      style: { width: "100%", padding: "8px 10px", fontSize: 13, resize: "vertical", marginBottom: 8 }
    }
  ), refundError && /* @__PURE__ */ React.createElement("p", { style: { color: "var(--danger)", fontSize: 12, marginBottom: 8 } }, refundError), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      style: { borderColor: "var(--warning)", color: "var(--warning)" },
      onClick: async () => {
        var _a2;
        setRefundError("");
        if (!refundReason.trim()) {
          setRefundError("\uD658\uBD88 \uC0AC\uC720\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
          return;
        }
        try {
          const result = await window.BGNJ_BOOK_ORDERS.requestRefund(refundTarget.id, refundReason);
          if (!(result == null ? void 0 : result.ok)) {
            setRefundError((result == null ? void 0 : result.message) || "\uD658\uBD88 \uC2E0\uCCAD \uC2E4\uD328");
            return;
          }
          setRefundTarget(null);
          setRefundReason("");
          refreshOrders();
        } catch (err) {
          setRefundError(((_a2 = err == null ? void 0 : err.body) == null ? void 0 : _a2.error) || (err == null ? void 0 : err.message) || "\uD658\uBD88 \uC2E0\uCCAD \uC911 \uC624\uB958");
        }
      }
    },
    "\uC2E0\uCCAD\uD558\uAE30"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => {
        setRefundTarget(null);
        setRefundReason("");
        setRefundError("");
      }
    },
    "\uCDE8\uC18C"
  ))), myOrders.length > 4 && /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11, textAlign: "right", marginBottom: 8 } }, "\uC678 ", myOrders.length - 4, "\uAC74"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("book") }, "\uCC45 \uC815\uBCF4 \uB2E4\uC2DC \uBCF4\uAE30")))), tab === "notifications" && /* @__PURE__ */ React.createElement("article", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "NOTIFICATIONS"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 22, marginBottom: 12 } }, "\uC54C\uB9BC ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 12 } }, notifications.length, "\uAC74"), unreadCount > 0 && /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 11, marginLeft: 8 } }, "\xB7 \uC548 \uC77D\uC74C ", unreadCount)), notifications.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8 } }, "\uC544\uC9C1 \uBC1B\uC740 \uC54C\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uB0B4\uAC00 \uC791\uC131\uD55C \uAE00\uC5D0 \uB313\uAE00\uC774 \uB2EC\uB9AC\uBA74 \uC5EC\uAE30\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694.") : /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 } }, notifications.map((n) => /* @__PURE__ */ React.createElement("li", { key: n.id }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => {
        window.BGNJ_COMMUNITY.markNotificationRead(user.id, n.id);
        if (n.postId) goToPost(n.postId);
      },
      style: {
        all: "unset",
        cursor: "pointer",
        width: "100%",
        padding: "10px 12px",
        borderLeft: "2px solid " + (n.read ? "var(--line)" : "var(--primary)"),
        background: n.read ? "transparent" : "rgba(245,213,72,0.04)"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, lineHeight: 1.5, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "gold" }, n.fromName), /* @__PURE__ */ React.createElement("span", { className: "dim" }, " \xB7 ", n.message || "\uC0C8 \uC54C\uB9BC")),
    n.postTitle && /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 12, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, "\u25B8 ", n.postTitle),
    /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, marginTop: 4, letterSpacing: "0.1em" } }, window.BGNJ_FMT.kstDateTime(n.createdAt))
  ))))), tab === "community" && /* @__PURE__ */ React.createElement("article", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "MY COMMUNITY"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 22, marginBottom: 12 } }, "\uB0B4\uAC00 \uC791\uC131\uD55C \uAE00 ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 12 } }, myCommunityPosts.length, "\uAC74")), myCommunityPosts.length === 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginBottom: 14 } }, "\uC544\uC9C1 \uC791\uC131\uD55C \uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("community") }, "\uCEE4\uBBA4\uB2C8\uD2F0\uB85C \uC774\uB3D9")) : /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 } }, myCommunityPosts.map((post) => /* @__PURE__ */ React.createElement("li", { key: post.id }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => goToPost(post.id),
      style: {
        all: "unset",
        cursor: "pointer",
        width: "100%",
        padding: "10px 12px",
        borderLeft: "2px solid var(--primary-dim)",
        background: "rgba(245,213,72,0.04)"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "pill", style: { fontSize: 9 } }, post.category), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, post.date)),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, lineHeight: 1.5, marginBottom: 4 } }, post.title),
    /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 10 } }, "\uB313\uAE00 ", post.replies, "\uAC1C \xB7 \uC870\uD68C ", post.views, "\uD68C")
  ))))), tab === "profile" && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 18 } }, /* @__PURE__ */ React.createElement(ProfileEditor, { user, onSaved: () => {
  } }), /* @__PURE__ */ React.createElement(PasswordChangeForm, null))));
};
const ProfileEditor = ({ user, onSaved }) => {
  var _a, _b, _c, _d, _e;
  const [name, setName] = React.useState((user == null ? void 0 : user.name) || "");
  const [phone, setPhone] = React.useState(((_a = user == null ? void 0 : user.profile) == null ? void 0 : _a.phone) || "");
  const [birthdate, setBirthdate] = React.useState(((_b = user == null ? void 0 : user.profile) == null ? void 0 : _b.birthdate) || "");
  const [address, setAddress] = React.useState(((_c = user == null ? void 0 : user.profile) == null ? void 0 : _c.address) || "");
  const [addressDetail, setAddressDetail] = React.useState(((_d = user == null ? void 0 : user.profile) == null ? void 0 : _d.addressDetail) || "");
  const [interest, setInterest] = React.useState(((_e = user == null ? void 0 : user.profile) == null ? void 0 : _e.interest) || "");
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const submit = async (e) => {
    var _a2;
    (_a2 = e == null ? void 0 : e.preventDefault) == null ? void 0 : _a2.call(e);
    setMsg(null);
    setSaving(true);
    try {
      const result = await window.BGNJ_AUTH.updateProfile({
        name: name.trim(),
        profile: {
          ...(user == null ? void 0 : user.profile) || {},
          phone: phone.trim(),
          birthdate: birthdate.trim(),
          address: address.trim(),
          addressDetail: addressDetail.trim(),
          interest: interest.trim()
        }
      });
      if (!(result == null ? void 0 : result.ok)) {
        setMsg({ kind: "err", text: (result == null ? void 0 : result.message) || (result == null ? void 0 : result.hint) || "\uC800\uC7A5 \uC2E4\uD328" });
      } else {
        setMsg({ kind: "ok", text: "\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC0AC\uC774\uD2B8 \uC804\uCCB4\uC5D0 \uBC18\uC601\uB429\uB2C8\uB2E4." });
        onSaved == null ? void 0 : onSaved();
      }
    } catch (err) {
      setMsg({ kind: "err", text: (err == null ? void 0 : err.message) || "\uC800\uC7A5 \uC2E4\uD328" });
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ React.createElement("article", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "PROFILE EDIT"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 22, marginBottom: 16 } }, "\uAC1C\uC778\uC815\uBCF4 \uC218\uC815"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginBottom: 18 } }, "\uC774\uB984\uACFC \uD504\uB85C\uD544 \uC815\uBCF4(\uC804\uD654\uBC88\uD638 / \uC0DD\uB144\uC6D4\uC77C / \uC8FC\uC18C / \uAD00\uC2EC \uBD84\uC57C)\uB97C \uBCC0\uACBD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD\uC740 \uC544\uB798 \uCE74\uB4DC\uC5D0\uC11C \uAC00\uB2A5\uD558\uBA70, \uC774\uBA54\uC77C \uBCC0\uACBD\uC740 \uC6B4\uC601\uC790 \uBB38\uC758 (contact@bgnj.net)."), /* @__PURE__ */ React.createElement("form", { onSubmit: submit, style: { display: "grid", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "profile-name" }, "\uC774\uB984"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "profile-name",
      className: "field-input",
      value: name,
      onChange: (e) => setName(e.target.value),
      required: true,
      maxLength: 50
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "profile-phone" }, "\uC804\uD654\uBC88\uD638"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "profile-phone",
      type: "tel",
      className: "field-input",
      value: phone,
      onChange: (e) => setPhone(e.target.value),
      placeholder: "010-0000-0000"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "profile-birth" }, "\uC0DD\uB144\uC6D4\uC77C"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "profile-birth",
      type: "date",
      className: "field-input",
      value: birthdate,
      onChange: (e) => setBirthdate(e.target.value)
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "profile-addr" }, "\uC8FC\uC18C"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "profile-addr",
      className: "field-input",
      value: address,
      onChange: (e) => setAddress(e.target.value),
      placeholder: "\uB3C4/\uC2DC/\uAD6C/\uB3D9\uAE4C\uC9C0"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "profile-addr2" }, "\uC0C1\uC138 \uC8FC\uC18C"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "profile-addr2",
      className: "field-input",
      value: addressDetail,
      onChange: (e) => setAddressDetail(e.target.value),
      placeholder: "\uB3D9/\uD638\uC218 \uB4F1"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "profile-interest" }, "\uAD00\uC2EC \uBD84\uC57C"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "profile-interest",
      className: "field-input",
      value: interest,
      onChange: (e) => setInterest(e.target.value),
      placeholder: "\uC608: \uAD81\uAD90 \uB2F5\uC0AC, \uC870\uC120\uC655\uC870 \uC5ED\uC0AC"
    }
  )), msg && /* @__PURE__ */ React.createElement("div", { role: "status", style: {
    padding: "10px 14px",
    fontSize: 13,
    lineHeight: 1.6,
    border: "1px solid " + (msg.kind === "ok" ? "var(--primary-dim)" : "var(--danger)"),
    background: msg.kind === "ok" ? "rgba(245,213,72,0.06)" : "rgba(194,74,61,0.08)",
    color: msg.kind === "ok" ? "var(--ink)" : "var(--danger)"
  } }, msg.text), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold", disabled: saving || !name.trim() }, saving ? "\uC800\uC7A5 \uC911\u2026" : "\uC800\uC7A5"))));
};
const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const valid = currentPassword.length > 0 && newPassword.length >= 6 && newPassword === confirm && currentPassword !== newPassword;
  const submit = async (e) => {
    var _a, _b;
    (_a = e == null ? void 0 : e.preventDefault) == null ? void 0 : _a.call(e);
    if (!valid || saving) return;
    setMsg(null);
    setSaving(true);
    try {
      const r = await window.BGNJ_API.changePassword({ currentPassword, newPassword });
      if (r == null ? void 0 : r.ok) {
        setMsg({ kind: "ok", text: "\uBE44\uBC00\uBC88\uD638\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirm("");
      } else {
        setMsg({ kind: "err", text: (r == null ? void 0 : r.message) || "\uBCC0\uACBD \uC2E4\uD328" });
      }
    } catch (err) {
      setMsg({ kind: "err", text: ((_b = err == null ? void 0 : err.body) == null ? void 0 : _b.error) || (err == null ? void 0 : err.message) || "\uBCC0\uACBD \uC2E4\uD328" });
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ React.createElement("article", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "PASSWORD CHANGE"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 22, marginBottom: 16 } }, "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginBottom: 18 } }, "\uD604\uC7AC \uBE44\uBC00\uBC88\uD638 \uD655\uC778 \uD6C4 \uC0C8 \uBE44\uBC00\uBC88\uD638\uB85C \uBCC0\uACBD\uD569\uB2C8\uB2E4. \uC0C8 \uBE44\uBC00\uBC88\uD638\uB294 6\uC790 \uC774\uC0C1 \uAD8C\uC7A5."), /* @__PURE__ */ React.createElement("form", { onSubmit: submit, style: { display: "grid", gap: 14 }, autoComplete: "off" }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "pw-current" }, "\uD604\uC7AC \uBE44\uBC00\uBC88\uD638"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "pw-current",
      type: "password",
      className: "field-input",
      autoComplete: "current-password",
      value: currentPassword,
      onChange: (e) => setCurrentPassword(e.target.value),
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "pw-new" }, "\uC0C8 \uBE44\uBC00\uBC88\uD638 (6\uC790 \uC774\uC0C1)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "pw-new",
      type: "password",
      className: "field-input",
      autoComplete: "new-password",
      value: newPassword,
      onChange: (e) => setNewPassword(e.target.value),
      minLength: 6,
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "pw-confirm" }, "\uC0C8 \uBE44\uBC00\uBC88\uD638 \uD655\uC778"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "pw-confirm",
      type: "password",
      className: "field-input",
      autoComplete: "new-password",
      value: confirm,
      onChange: (e) => setConfirm(e.target.value),
      minLength: 6,
      required: true,
      style: { borderColor: confirm && newPassword !== confirm ? "var(--danger)" : void 0 }
    }
  ), confirm && newPassword !== confirm && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--danger)", marginTop: 4 } }, "\uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."))), msg && /* @__PURE__ */ React.createElement("div", { role: "status", style: {
    padding: "10px 14px",
    fontSize: 13,
    lineHeight: 1.6,
    border: "1px solid " + (msg.kind === "ok" ? "var(--primary-dim)" : "var(--danger)"),
    background: msg.kind === "ok" ? "rgba(245,213,72,0.06)" : "rgba(194,74,61,0.08)",
    color: msg.kind === "ok" ? "var(--ink)" : "var(--danger)"
  } }, msg.text), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold", disabled: !valid || saving }, saving ? "\uBCC0\uACBD \uC911\u2026" : "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD"))));
};
Object.assign(window, { MyPage });

})();

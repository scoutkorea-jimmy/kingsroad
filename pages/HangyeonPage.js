(function(){
const hkToday = () => new Date(Date.now() + 9 * 3600 * 1e3).toISOString().slice(0, 10);
const hkAddDays = (str, n) => new Date((/* @__PURE__ */ new Date(str + "T00:00:00Z")).getTime() + n * 864e5).toISOString().slice(0, 10);
const hkNightsBetween = (a, b) => Math.round((/* @__PURE__ */ new Date(b + "T00:00:00Z") - /* @__PURE__ */ new Date(a + "T00:00:00Z")) / 864e5);
const HK_WD = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"];
const hkFmtDate = (str) => {
  if (!str) return "";
  const d = /* @__PURE__ */ new Date(str + "T00:00:00Z");
  return `${str.slice(5).replace("-", ".")} (${HK_WD[d.getUTCDay()]})`;
};
const hkWon = (n) => {
  var _a;
  return ((_a = window.BGNJ_FMT) == null ? void 0 : _a.won) ? window.BGNJ_FMT.won(n) : `${Number(n || 0).toLocaleString("ko-KR")}\uC6D0`;
};
const HkCalendar = ({ roomTypeId, checkIn, checkOut, onSelect }) => {
  const today = hkToday();
  const [cursor, setCursor] = React.useState(today.slice(0, 7) + "-01");
  const [avail, setAvail] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (!roomTypeId) return;
    let alive = true;
    setLoading(true);
    const from = cursor;
    const to = hkAddDays(cursor, 42);
    window.BGNJ_HANGYEON.availability({ from, to, roomTypeId }).then((res) => {
      if (!alive) return;
      const map = {};
      const arr = res.availability && res.availability[roomTypeId] || [];
      arr.forEach((a) => {
        map[a.date] = { remaining: a.remaining, closed: a.closed };
      });
      setAvail(map);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [roomTypeId, cursor]);
  const year = Number(cursor.slice(0, 4));
  const month = Number(cursor.slice(5, 7)) - 1;
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${cursor.slice(0, 8)}${String(d).padStart(2, "0")}`);
  const inRange = (date) => checkIn && checkOut && date >= checkIn && date < checkOut;
  const monthLabel = `${year}\uB144 ${month + 1}\uC6D4`;
  const prevDisabled = cursor <= today.slice(0, 7) + "-01";
  const onCellClick = (date) => {
    var _a, _b;
    if (date < today) return;
    const a = avail[date];
    if (a && (a.closed || a.remaining < 1)) return;
    if (!checkIn || checkIn && checkOut || date <= checkIn) {
      onSelect(date, null);
      return;
    }
    for (let dd = checkIn; dd < date; dd = hkAddDays(dd, 1)) {
      const av = avail[dd];
      if (av && (av.closed || av.remaining < 1)) {
        (_b = (_a = window.BGNJ_TOAST) == null ? void 0 : _a.error) == null ? void 0 : _b.call(_a, "\uC120\uD0DD \uAD6C\uAC04\uC5D0 \uD310\uB9E4 \uBD88\uAC00 \uB0A0\uC9DC\uAC00 \uC788\uC5B4\uC694.");
        return;
      }
    }
    onSelect(checkIn, date);
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      disabled: prevDisabled,
      onClick: () => setCursor(`${new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 8)}01`),
      style: { opacity: prevDisabled ? 0.4 : 1 }
    },
    "\u2039"
  ), /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 15 } }, monthLabel, loading ? " \u2026" : ""), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setCursor(`${new Date(Date.UTC(year, month + 1, 1)).toISOString().slice(0, 8)}01`)
    },
    "\u203A"
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 } }, HK_WD.map((w, i) => /* @__PURE__ */ React.createElement("div", { key: w, className: "mono dim-2", style: { textAlign: "center", fontSize: 10, padding: "4px 0", color: i === 0 ? "var(--danger)" : "var(--ink-3)" } }, w)), cells.map((date, i) => {
    if (!date) return /* @__PURE__ */ React.createElement("div", { key: `e${i}` });
    const day = Number(date.slice(8));
    const a = avail[date];
    const past = date < today;
    const soldout = a && (a.closed || a.remaining < 1);
    const disabled = past || soldout;
    const isStart = date === checkIn;
    const isEnd = date === checkOut;
    const ranged = inRange(date);
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: date,
        type: "button",
        disabled,
        onClick: () => onCellClick(date),
        style: {
          aspectRatio: "1",
          border: "1px solid var(--line)",
          borderRadius: 6,
          cursor: disabled ? "default" : "pointer",
          background: isStart || isEnd ? "var(--secondary)" : ranged ? "var(--bg-2)" : "var(--bg)",
          color: isStart || isEnd ? "#fff" : disabled ? "var(--ink-3)" : "var(--ink)",
          opacity: past ? 0.35 : 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          fontSize: 13,
          fontWeight: isStart || isEnd ? 700 : 500,
          padding: 2,
          position: "relative"
        }
      },
      /* @__PURE__ */ React.createElement("span", null, day),
      !past && (soldout ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8, color: isStart || isEnd ? "#fff" : "var(--danger)" } }, "\uB9C8\uAC10") : a ? /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 8, color: isStart || isEnd ? "#fff" : "var(--ink-3)" } }, a.remaining, "\uC2E4") : null)
    );
  })), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 8 } }, "\uB0A0\uC9DC\uB97C \uB450 \uBC88 \uB20C\uB7EC \uCCB4\uD06C\uC778\xB7\uCCB4\uD06C\uC544\uC6C3\uC744 \uC120\uD0DD\uD558\uC138\uC694. \uC22B\uC790\uB294 \uC794\uC5EC \uAC1D\uC2E4 \uC218\uC785\uB2C8\uB2E4."));
};
const HkBookingModal = ({ roomType, user, onClose, onDone }) => {
  const [checkIn, setCheckIn] = React.useState(null);
  const [checkOut, setCheckOut] = React.useState(null);
  const [rooms, setRooms] = React.useState(1);
  const [guests, setGuests] = React.useState(1);
  const [coupon, setCoupon] = React.useState("");
  const [name, setName] = React.useState((user == null ? void 0 : user.name) || "");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState((user == null ? void 0 : user.email) || "");
  const [request, setRequest] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const [quote, setQuote] = React.useState(null);
  const [quoting, setQuoting] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  React.useEffect(() => {
    if (!checkIn || !checkOut) {
      setQuote(null);
      return;
    }
    let alive = true;
    setQuoting(true);
    window.BGNJ_HANGYEON.quote({ roomTypeId: roomType.id, checkIn, checkOut, rooms, couponCode: coupon.trim() || void 0 }).then((q) => {
      if (alive) {
        setQuote(q);
        setQuoting(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [checkIn, checkOut, rooms, coupon, roomType.id]);
  const submit = async () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    if (!checkIn || !checkOut) {
      (_b = (_a = window.BGNJ_TOAST) == null ? void 0 : _a.error) == null ? void 0 : _b.call(_a, "\uCCB4\uD06C\uC778\xB7\uCCB4\uD06C\uC544\uC6C3 \uB0A0\uC9DC\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      (_d = (_c = window.BGNJ_TOAST) == null ? void 0 : _c.error) == null ? void 0 : _d.call(_c, "\uC774\uB984\uACFC \uC5F0\uB77D\uCC98\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    if (!agreed) {
      (_f = (_e = window.BGNJ_TOAST) == null ? void 0 : _e.error) == null ? void 0 : _f.call(_e, "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9\uC5D0 \uB3D9\uC758\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    if (!(quote == null ? void 0 : quote.ok)) {
      (_h = (_g = window.BGNJ_TOAST) == null ? void 0 : _g.error) == null ? void 0 : _h.call(_g, (quote == null ? void 0 : quote.reason) || "\uC608\uC57D\uD560 \uC218 \uC5C6\uB294 \uC77C\uC815\uC785\uB2C8\uB2E4.");
      return;
    }
    setSubmitting(true);
    const res = await window.BGNJ_HANGYEON.book({
      roomTypeId: roomType.id,
      checkIn,
      checkOut,
      rooms,
      guests,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      request: request.trim(),
      couponCode: coupon.trim() || void 0
    });
    setSubmitting(false);
    if (res.ok) {
      (_k = (_i = window.BGNJ_TOAST) == null ? void 0 : _i.success) == null ? void 0 : _k.call(_i, `\uC608\uC57D \uC811\uC218 \uC644\uB8CC (${(_j = res.booking) == null ? void 0 : _j.code}). \uC785\uAE08 \uD655\uC778 \uD6C4 \uD655\uC815\uB429\uB2C8\uB2E4.`);
      onDone && onDone(res.booking);
      onClose();
    } else {
      (_m = (_l = window.BGNJ_TOAST) == null ? void 0 : _l.error) == null ? void 0 : _m.call(_l, res.message || "\uC608\uC57D \uC2E4\uD328");
    }
  };
  const nights = checkIn && checkOut ? hkNightsBetween(checkIn, checkOut) : 0;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "modal-overlay",
      onClick: onClose,
      style: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1e3, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "40px 16px" }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => e.stopPropagation(),
        className: "card",
        style: { maxWidth: 520, width: "100%", padding: 0, background: "var(--bg)" }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 19, margin: 0 } }, roomType.name, " \uC608\uC57D"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: onClose, style: { background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--ink-3)" } }, "\u2715")),
      /* @__PURE__ */ React.createElement("div", { style: { padding: 22, display: "flex", flexDirection: "column", gap: 18 } }, /* @__PURE__ */ React.createElement(
        HkCalendar,
        {
          roomTypeId: roomType.id,
          checkIn,
          checkOut,
          onSelect: (ci, co) => {
            setCheckIn(ci);
            setCheckOut(co);
          }
        }
      ), checkIn && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "12px 16px", background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14 } }, /* @__PURE__ */ React.createElement("strong", null, hkFmtDate(checkIn)), checkOut ? /* @__PURE__ */ React.createElement(React.Fragment, null, " \u2192 ", /* @__PURE__ */ React.createElement("strong", null, hkFmtDate(checkOut)), " \xB7 ", nights, "\uBC15") : /* @__PURE__ */ React.createElement("span", { className: "dim" }, " \xB7 \uCCB4\uD06C\uC544\uC6C3 \uB0A0\uC9DC\uB97C \uC120\uD0DD\uD558\uC138\uC694"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uAC1D\uC2E4 \uC218", /* @__PURE__ */ React.createElement("select", { className: "field-input", value: rooms, onChange: (e) => setRooms(Number(e.target.value)) }, [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ React.createElement("option", { key: n, value: n }, n, "\uC2E4")))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uD22C\uC219 \uC778\uC6D0", /* @__PURE__ */ React.createElement("select", { className: "field-input", value: guests, onChange: (e) => setGuests(Number(e.target.value)) }, Array.from({ length: (roomType.maxOccupancy || 2) * rooms }, (_, i) => i + 1).map((n) => /* @__PURE__ */ React.createElement("option", { key: n, value: n }, n, "\uBA85"))))), checkIn && checkOut && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "14px 16px" } }, quoting ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: 0, fontSize: 13 } }, "\uC694\uAE08 \uACC4\uC0B0 \uC911\u2026") : (quote == null ? void 0 : quote.ok) ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uAC1D\uC2E4 \uC694\uAE08 (", nights, "\uBC15 \xD7 ", rooms, "\uC2E4)"), /* @__PURE__ */ React.createElement("span", null, hkWon(quote.subtotal))), quote.stayDiscount > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", color: "var(--success)" } }, /* @__PURE__ */ React.createElement("span", null, quote.stayLabel), /* @__PURE__ */ React.createElement("span", null, "-", hkWon(quote.stayDiscount))), quote.couponDiscount > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", color: "var(--success)" } }, /* @__PURE__ */ React.createElement("span", null, "\uCFE0\uD3F0 (", quote.couponLabel, ")"), /* @__PURE__ */ React.createElement("span", null, "-", hkWon(quote.couponDiscount))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 6, fontWeight: 700, fontSize: 16 } }, /* @__PURE__ */ React.createElement("span", null, "\uD569\uACC4"), /* @__PURE__ */ React.createElement("span", { className: "ko-serif" }, hkWon(quote.total)))) : /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 13, color: "var(--danger)" } }, (quote == null ? void 0 : quote.reason) || "\uC608\uC57D \uBD88\uAC00"), (quote == null ? void 0 : quote.couponError) && /* @__PURE__ */ React.createElement("p", { style: { margin: "6px 0 0", fontSize: 12, color: "var(--danger)" } }, quote.couponError)), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC608\uC57D\uC790 \uC774\uB984 *", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: name, onChange: (e) => setName(e.target.value) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC5F0\uB77D\uCC98 *", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "010-0000-0000" })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC774\uBA54\uC77C", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: email, onChange: (e) => setEmail(e.target.value) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uCFE0\uD3F0 \uCF54\uB4DC", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: coupon, onChange: (e) => setCoupon(e.target.value.toUpperCase()), placeholder: "(\uC120\uD0DD)" }))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC694\uCCAD\uC0AC\uD56D", /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 2, value: request, onChange: (e) => setRequest(e.target.value), placeholder: "\uB2A6\uC740 \uCCB4\uD06C\uC778, \uC8FC\uCC28 \uB4F1" })), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: agreed, onChange: (e) => setAgreed(e.target.checked), style: { marginTop: 2 } }), /* @__PURE__ */ React.createElement("span", null, "\uC608\uC57D\uC744 \uC704\uD55C ", /* @__PURE__ */ React.createElement("strong", null, "\uAC1C\uC778\uC815\uBCF4(\uC774\uB984\xB7\uC5F0\uB77D\uCC98\xB7\uC774\uBA54\uC77C) \uC218\uC9D1\xB7\uC774\uC6A9"), "\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4. (\uC608\uC57D \uCC98\uB9AC\xB7\uD655\uC778 \uBAA9\uC801, \uAD00\uB828 \uBC95\uB839\uC5D0 \uB530\uB77C \uBCF4\uAD00)")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "10px 14px", background: "var(--bg-2)", fontSize: 12 } }, /* @__PURE__ */ React.createElement("strong", null, "\uACB0\uC81C \uC548\uB0B4"), " \u2014 \uC608\uC57D \uC811\uC218 \uD6C4 ", /* @__PURE__ */ React.createElement("strong", null, "\uBB34\uD1B5\uC7A5 \uC785\uAE08"), " \uB610\uB294 ", /* @__PURE__ */ React.createElement("strong", null, "\uD604\uC7A5 \uACB0\uC81C"), "\uB85C \uC9C4\uD589\uB429\uB2C8\uB2E4. \uC785\uAE08 \uD655\uC778 \uC2DC \uC608\uC57D\uC774 \uD655\uC815\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          className: "btn btn-gold",
          disabled: submitting || !(quote == null ? void 0 : quote.ok),
          onClick: submit,
          style: { opacity: submitting || !(quote == null ? void 0 : quote.ok) ? 0.5 : 1 }
        },
        submitting ? "\uC811\uC218 \uC911\u2026" : (quote == null ? void 0 : quote.ok) ? `${hkWon(quote.total)} \uC608\uC57D \uC811\uC218\uD558\uAE30` : "\uC608\uC57D\uD558\uAE30"
      ))
    )
  );
};
const HK_STATUS_LABEL = { pending: "\uC608\uC57D\uB300\uAE30", confirmed: "\uC608\uC57D\uD655\uC815", checked_in: "\uCCB4\uD06C\uC778", checked_out: "\uCCB4\uD06C\uC544\uC6C3", cancelled: "\uCDE8\uC18C", no_show: "\uB178\uC1FC" };
const HK_PAY_LABEL = { unpaid: "\uBBF8\uACB0\uC81C", partial: "\uBD80\uBD84\uACB0\uC81C", paid: "\uACB0\uC81C\uC644\uB8CC", refunded: "\uD658\uBD88\uC644\uB8CC" };
const HkMyBookings = ({ tick }) => {
  const [bookings, setBookings] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    window.BGNJ_HANGYEON.refreshMine().then((b) => {
      setBookings(b);
      setLoaded(true);
    });
  }, [tick]);
  const cancel = async (b) => {
    var _a, _b, _c, _d, _e;
    if (!await window.BGNJ_CONFIRM(`${b.code} \uC608\uC57D\uC744 \uCDE8\uC18C\uD560\uAE4C\uC694?`, { danger: true })) return;
    try {
      await window.BGNJ_HANGYEON.cancelBooking(b.id);
      window.BGNJ_HANGYEON.refreshMine().then(setBookings);
      (_b = (_a = window.BGNJ_TOAST) == null ? void 0 : _a.success) == null ? void 0 : _b.call(_a, "\uCDE8\uC18C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    } catch (err) {
      (_e = (_c = window.BGNJ_TOAST) == null ? void 0 : _c.error) == null ? void 0 : _e.call(_c, ((_d = err == null ? void 0 : err.body) == null ? void 0 : _d.error) || "\uCDE8\uC18C \uC2E4\uD328");
    }
  };
  if (!loaded || bookings.length === 0) return null;
  return /* @__PURE__ */ React.createElement("section", { className: "section-tight", style: { borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { fontSize: 24, marginBottom: 18 } }, "\uB0B4 \uD55C\uCF20 \uC608\uC57D"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-2" }, bookings.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.id, className: "card", style: { padding: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, b.code), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { className: "badge" }, HK_STATUS_LABEL[b.status] || b.status), /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: "var(--line)" } }, HK_PAY_LABEL[b.paymentStatus] || b.paymentStatus))), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 17, marginBottom: 6 } }, b.roomTypeName), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, margin: "0 0 6px" } }, hkFmtDate(b.checkIn), " \u2192 ", hkFmtDate(b.checkOut), " \xB7 ", b.nights, "\uBC15 ", b.rooms, "\uC2E4 ", b.guests, "\uBA85"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, fontWeight: 600, margin: "0 0 10px" } }, hkWon(b.totalPrice)), ["pending", "confirmed"].includes(b.status) && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => cancel(b) }, "\uC608\uC57D \uCDE8\uC18C"))))));
};
const HkRoomCard = ({ rt, onBook }) => {
  const cover = (rt.images || []).find((im) => im.isPrimary) || (rt.images || [])[0];
  return /* @__PURE__ */ React.createElement("article", { className: "card", style: { padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { aspectRatio: "4/3", background: "var(--bg-2)", overflow: "hidden" } }, cover ? /* @__PURE__ */ React.createElement("img", { src: cover.url, alt: rt.name, style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }) : window.CoverPlaceholder ? /* @__PURE__ */ React.createElement(window.CoverPlaceholder, { aspectRatio: "4/3", iconSize: 56 }) : null), /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8, flex: 1 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 19, margin: 0 } }, rt.name), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "badge" }, "\uCD5C\uB300 ", rt.maxOccupancy, "\uC778"), rt.bedConfig && /* @__PURE__ */ React.createElement("span", { className: "badge" }, rt.bedConfig)), rt.description && /* @__PURE__ */ React.createElement("p", { className: "dim bgnj-multiline", style: { fontSize: 13, lineHeight: 1.6, margin: 0 } }, rt.description), (rt.amenities || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap" } }, rt.amenities.slice(0, 6).map((a) => /* @__PURE__ */ React.createElement("span", { key: a, className: "badge", style: { fontSize: 9 } }, a))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, "1\uBC15"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 20, fontWeight: 700 } }, hkWon(rt.basePrice), "~")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: () => onBook(rt) }, "\uC608\uC57D\uD558\uAE30"))));
};
const HangyeonPage = ({ go, user }) => {
  var _a, _b;
  const [tick, setTick] = React.useState(0);
  const [roomTypes, setRoomTypes] = React.useState([]);
  const [booking, setBooking] = React.useState(null);
  const [scTick, setScTick] = React.useState(0);
  React.useEffect(() => {
    window.BGNJ_HANGYEON.refreshRoomTypes().then(setRoomTypes);
    const onR = () => setScTick((v) => v + 1);
    window.addEventListener("bgnj-site-content-refresh", onR);
    return () => window.removeEventListener("bgnj-site-content-refresh", onR);
  }, []);
  const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
  const info = sc.hangyeon || {};
  const name = info.name || "\uC804\uC8FC\uD55C\uCF20";
  const tagline = info.tagline || "\uC804\uC8FC \uB3C4\uC2EC \uC18D, \uC870\uC6A9\uD55C \uD558\uB8FB\uBC24";
  const desc = info.desc || "\uC804\uC8FC \uC804\uC790\uC0C1\uAC00 \uB4A4\uD3B8 \uC870\uC6A9\uD55C \uC8FC\uD0DD\uAC00\uC5D0 \uC790\uB9AC\uD55C \uACF5\uAC04 \u2018\uD55C\uCF20\u2019. \uB3C4\uC2EC \uD55C\uAC00\uC6B4\uB370\uC11C\uB3C4 \uCC28\uBD84\uD788 \uBA38\uBB3C\uBA70 \uC26C\uC5B4 \uAC08 \uC218 \uC788\uB294 \uD558\uB8FB\uBC24\uC744 \uC81C\uC548\uD569\uB2C8\uB2E4.";
  const address = info.address || "\uC804\uBD81 \uC804\uC8FC\uC2DC \uB355\uC9C4\uAD6C \uD314\uB2EC\uB85C 340-37";
  const directions = info.directions || "\uC804\uC8FC\uC5ED\uC5D0\uC11C \uCC28\uB7C9 10\uBD84, \uC804\uC8FC \uACE0\uC18D\uBC84\uC2A4\uD130\uBBF8\uB110\uC5D0\uC11C \uB3C4\uBCF4 15\uBD84 \uAC70\uB9AC\uB85C \uC811\uADFC\uC131\uC774 \uC88B\uC2B5\uB2C8\uB2E4. \uD55C\uC625\uB9C8\uC744\xB7\uC790\uB9CC\uBCBD\uD654\uB9C8\uC744\xB7\uACBD\uAE30\uC804\xB7\uD48D\uB0A8\uBB38 \uB4F1 \uC8FC\uC694 \uBA85\uC18C\uAE4C\uC9C0 \uCC28\uB7C9 5~10\uBD84\uC774\uBA74 \uB2FF\uC2B5\uB2C8\uB2E4. \uB3C4\uC2EC \uC18D\uC5D0\uC11C\uB3C4 \uC870\uC6A9\uD788 \uBA38\uBB3C\uBA70 \uC9D1\uC911\uD560 \uC218 \uC788\uB294 \uACF5\uAC04\uC785\uB2C8\uB2E4.";
  const images = Array.isArray(info.images) ? info.images : [];
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("header", { style: { marginBottom: 28 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, "STAY \xB7 \uC790\uACE0 \uB180\uC790"), /* @__PURE__ */ React.createElement("h1", { className: "section-title", style: { display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", null, name), /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: "0.5em", color: "var(--secondary)", fontStyle: "italic", fontWeight: 400 } }, tagline)), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle", style: { maxWidth: 760 } }, desc)), images.length > 0 && window.MediaGalleryView && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, /* @__PURE__ */ React.createElement(window.MediaGalleryView, { images, title: name, sectionLabel: "\uC219\uC18C \uC804\uACBD", withCover: true })), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "16px 20px", marginBottom: 28, fontSize: 13.5, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: directions ? 10 : 0 } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginRight: 8 } }, "\uC8FC\uC18C"), address), directions && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 4 } }, "\uCC3E\uC544\uAC00\uB294 \uAE38"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: 0 } }, directions)), info.notice && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: "10px 0 0" } }, info.notice))), /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { fontSize: 26, marginBottom: 18 } }, "\uAC1D\uC2E4"), roomTypes.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 40, textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: 0 } }, "\uD604\uC7AC \uB4F1\uB85D\uB41C \uAC1D\uC2E4\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uACE7 \uB9CC\uB098\uC694.")) : /* @__PURE__ */ React.createElement("div", { className: "grid grid-3", style: { marginBottom: 16 } }, roomTypes.map((rt) => /* @__PURE__ */ React.createElement(HkRoomCard, { key: rt.id, rt, onBook: setBooking })))), /* @__PURE__ */ React.createElement(HkMyBookings, { tick }), booking && /* @__PURE__ */ React.createElement(
    HkBookingModal,
    {
      roomType: booking,
      user,
      onClose: () => setBooking(null),
      onDone: () => setTick((v) => v + 1)
    }
  ));
};
Object.assign(window, { HangyeonPage });

})();

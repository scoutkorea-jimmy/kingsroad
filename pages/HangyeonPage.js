(function(){
const hkToday = () => new Date(Date.now() + 9 * 3600 * 1e3).toISOString().slice(0, 10);
const hkNowHM = () => new Date(Date.now() + 9 * 3600 * 1e3).toISOString().slice(11, 16);
const hkAddDays = (str, n) => new Date((/* @__PURE__ */ new Date(str + "T00:00:00Z")).getTime() + n * 864e5).toISOString().slice(0, 10);
const hkNights = (a, b) => Math.max(0, Math.round((/* @__PURE__ */ new Date(b + "T00:00:00Z") - /* @__PURE__ */ new Date(a + "T00:00:00Z")) / 864e5));
const HK_WD = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"];
const hkFmtDate = (str) => {
  if (!str) return "";
  const d = /* @__PURE__ */ new Date(str + "T00:00:00Z");
  return `${str.slice(0, 4)}.${str.slice(5, 7)}.${str.slice(8, 10)}(${HK_WD[d.getUTCDay()]})`;
};
const hkWon = (n) => {
  var _a;
  return ((_a = window.BGNJ_FMT) == null ? void 0 : _a.won) ? window.BGNJ_FMT.won(n) : `${Number(n || 0).toLocaleString("ko-KR")}\uC6D0`;
};
const hkMan = (n) => {
  if (n == null) return "";
  const m = n / 1e4;
  return (m >= 10 ? Math.round(m) : Math.round(m * 10) / 10) + "\uB9CC";
};
const HK_HOLIDAYS = {
  "2026-01-01": "\uC2E0\uC815",
  "2026-02-16": "\uC124\uB0A0",
  "2026-02-17": "\uC124\uB0A0",
  "2026-02-18": "\uC124\uB0A0",
  "2026-03-01": "\uC0BC\uC77C\uC808",
  "2026-05-05": "\uC5B4\uB9B0\uC774\uB0A0",
  "2026-05-24": "\uC11D\uAC00\uD0C4\uC2E0\uC77C",
  "2026-06-06": "\uD604\uCDA9\uC77C",
  "2026-08-15": "\uAD11\uBCF5\uC808",
  "2026-09-24": "\uCD94\uC11D",
  "2026-09-25": "\uCD94\uC11D",
  "2026-09-26": "\uCD94\uC11D",
  "2026-10-03": "\uAC1C\uCC9C\uC808",
  "2026-10-09": "\uD55C\uAE00\uB0A0",
  "2026-12-25": "\uC131\uD0C4\uC808"
};
const hk12h = (hm) => {
  if (!hm) return "";
  const [h, m] = hm.split(":").map(Number);
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${h < 12 ? "\uC624\uC804" : "\uC624\uD6C4"} ${hh}:${String(m).padStart(2, "0")}`;
};
const hkAmPm = (hm) => Number(hm.slice(0, 2)) < 12;
const SOFT = { background: "var(--bg)", borderRadius: 16, boxShadow: "0 1px 2px rgba(15,23,42,0.05), 0 8px 24px rgba(15,23,42,0.05)" };
const FIELD = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--line)", background: "var(--bg)", fontSize: 14, color: "var(--ink)", fontFamily: "inherit" };
const HkMiniMonth = ({ cursorYM, checkIn, checkOut, avail, today, onPick }) => {
  const year = Number(cursorYM.slice(0, 4)), month = Number(cursorYM.slice(5, 7)) - 1;
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(`${cursorYM.slice(0, 8)}${String(d).padStart(2, "0")}`);
  const inRange = (date) => checkIn && checkOut && date > checkIn && date < checkOut;
  return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 260 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontWeight: 700, fontSize: 15, marginBottom: 8 } }, year, ".", String(month + 1).padStart(2, "0")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7,1fr)" } }, HK_WD.map((w, i) => /* @__PURE__ */ React.createElement("div", { key: w, style: { textAlign: "center", fontSize: 11, padding: "4px 0", color: i === 0 ? "var(--danger)" : i === 6 ? "#2563EB" : "var(--ink-3)" } }, w)), cells.map((date, i) => {
    if (!date) return /* @__PURE__ */ React.createElement("div", { key: `e${i}` });
    const dow = (/* @__PURE__ */ new Date(date + "T00:00:00Z")).getUTCDay();
    const a = avail[date];
    const past = date < today;
    const full = a && a.remaining < 1;
    const isCI = date === checkIn, isCO = date === checkOut, ranged = inRange(date);
    const holiday = HK_HOLIDAYS[date];
    const disabled = past || full && !checkIn;
    const ends = isCI || isCO;
    const color = ends ? "#fff" : disabled ? "var(--ink-3)" : holiday || dow === 0 ? "var(--danger)" : dow === 6 ? "#2563EB" : "var(--ink)";
    return /* @__PURE__ */ React.createElement("div", { key: date, style: { display: "flex", justifyContent: "center", padding: "1px 0", background: ranged ? "var(--bg-2)" : "transparent" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        disabled: past,
        onClick: () => onPick(date),
        style: { width: 40, height: 46, borderRadius: 11, border: "none", cursor: past ? "default" : "pointer", background: ends ? "var(--ink)" : "transparent", color, opacity: past ? 0.35 : 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, fontSize: 14, fontWeight: ends ? 700 : 500 }
      },
      /* @__PURE__ */ React.createElement("span", null, Number(date.slice(8))),
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8.5, lineHeight: 1, color: ends ? "#fff" : full ? "var(--danger)" : "var(--success)", fontWeight: 600 } }, !past && (full ? "\uB9C8\uAC10" : a && a.price != null ? hkMan(a.price) : ""))
    ));
  })));
};
const HkDatePicker = ({ checkIn, checkOut, onApply, onClose }) => {
  const today = hkToday();
  const [base, setBase] = React.useState((checkIn || today).slice(0, 7) + "-01");
  const [avail, setAvail] = React.useState({});
  const [ci, setCi] = React.useState(checkIn);
  const [co, setCo] = React.useState(checkOut);
  React.useEffect(() => {
    let alive = true;
    window.BGNJ_HANGYEON.availability({ from: base, to: hkAddDays(base, 70) }).then((res) => {
      if (!alive) return;
      const agg = {};
      const av = res && res.availability || {};
      Object.keys(av).forEach((rid) => (av[rid] || []).forEach((a) => {
        const cur = agg[a.date] || { remaining: 0, price: null };
        cur.remaining += a.remaining;
        if (a.price != null && (cur.price == null || a.price < cur.price)) cur.price = a.price;
        agg[a.date] = cur;
      }));
      setAvail(agg);
    });
    return () => {
      alive = false;
    };
  }, [base]);
  const pick = (date) => {
    if (!ci || ci && co || date <= ci) {
      setCi(date);
      setCo(null);
    } else setCo(date);
  };
  const y = Number(base.slice(0, 4)), m = Number(base.slice(5, 7)) - 1;
  const nextYM = `${new Date(Date.UTC(y, m + 1, 1)).toISOString().slice(0, 8)}01`;
  const prevDisabled = base <= today.slice(0, 7) + "-01";
  const nights = ci && co ? hkNights(ci, co) : 0;
  return /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1100, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "60px 16px" } }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: { ...SOFT, maxWidth: 720, width: "100%", padding: 22 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("button", { type: "button", disabled: prevDisabled, onClick: () => setBase(`${new Date(Date.UTC(y, m - 1, 1)).toISOString().slice(0, 8)}01`), style: { background: "none", border: "none", fontSize: 20, cursor: prevDisabled ? "default" : "pointer", color: prevDisabled ? "var(--line)" : "var(--ink)" } }, "\u2039"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "center", fontSize: 13 }, className: "dim-2" }, ci ? co ? `${hkFmtDate(ci)} ~ ${hkFmtDate(co)} \xB7 ${nights}\uBC15` : `${hkFmtDate(ci)} \xB7 \uD1F4\uC2E4\uC77C \uC120\uD0DD` : "\uC785\uC2E4\uC77C\uC744 \uC120\uD0DD\uD558\uC138\uC694"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setBase(nextYM), style: { background: "none", border: "none", fontSize: 20, cursor: "pointer" } }, "\u203A")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(HkMiniMonth, { cursorYM: base, checkIn: ci, checkOut: co, avail, today, onPick: pick }), /* @__PURE__ */ React.createElement(HkMiniMonth, { cursorYM: nextYM, checkIn: ci, checkOut: co, avail, today, onPick: pick })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line-2, var(--line))" } }, /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 12 } }, "\uAC00\uACA9 : 1\uBC15 \uAE30\uC900 \uCD5C\uC800\uAC00"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", disabled: !ci || !co, onClick: () => {
    onApply(ci, co);
    onClose();
  }, style: { opacity: ci && co ? 1 : 0.5 } }, "\uC801\uC6A9\uD558\uAE30"))));
};
const HkStep = ({ label, value, onMinus, onPlus, min = 0 }) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" } }, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 15 } }, label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: onMinus, disabled: value <= min, style: { width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--bg)", cursor: value <= min ? "default" : "pointer", fontSize: 18, color: value <= min ? "var(--ink-3)" : "var(--ink)" } }, "\u2212"), /* @__PURE__ */ React.createElement("span", { style: { minWidth: 20, textAlign: "center", fontSize: 16, fontWeight: 600 } }, value), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: onPlus, style: { width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--bg)", cursor: "pointer", fontSize: 18 } }, "\uFF0B")));
const HkGuestPicker = ({ adults, children, onApply, onClose }) => {
  const [a, setA] = React.useState(adults);
  const [c, setC] = React.useState(children);
  return /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1100, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "80px 16px" } }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: { ...SOFT, maxWidth: 420, width: "100%", padding: 22 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-2)", borderRadius: 12, padding: "14px 16px", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 14 } }, "\uAE30\uC900\uC778\uC6D0 \uCD08\uACFC \uC2DC \uCD94\uAC00\uC694\uAE08\uC774 \uBC1C\uC0DD\uD560 \uC218 \uC788\uC5B4\uC694."), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12.5, margin: "6px 0 0", lineHeight: 1.6 } }, "\uAC1D\uC2E4\uB9C8\uB2E4 \uC544\uB3D9 \uC785\uC2E4 \uC5EC\uBD80\uC640 \uCD94\uAC00\uC694\uAE08\uC774 \uB2EC\uB77C\uC694. \uC774\uC6A9 \uC548\uB0B4 \uBC0F \uC608\uC57D \uACF5\uC9C0\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.")), /* @__PURE__ */ React.createElement(HkStep, { label: "\uC131\uC778", value: a, min: 1, onMinus: () => setA((v) => Math.max(1, v - 1)), onPlus: () => setA((v) => Math.min(10, v + 1)) }), /* @__PURE__ */ React.createElement(HkStep, { label: "\uC544\uB3D9", value: c, min: 0, onMinus: () => setC((v) => Math.max(0, v - 1)), onPlus: () => setC((v) => Math.min(10, v + 1)) }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 12 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: () => {
    onApply(a, c);
    onClose();
  } }, "\uC801\uC6A9\uD558\uAE30"))));
};
const HkHourSelect = ({ roomTypeId, date, minHours, start, hours, onStart, onHours }) => {
  const [info, setInfo] = React.useState({ hours: [], minHours: minHours || 3 });
  React.useEffect(() => {
    let alive = true;
    window.BGNJ_HANGYEON.slots({ roomTypeId, date }).then((res) => {
      if (alive) setInfo(res || { hours: [] });
    });
    return () => {
      alive = false;
    };
  }, [roomTypeId, date]);
  const today = hkToday();
  const nowHM = hkNowHM();
  const openH = info.hours.length ? Number(info.hours[0].hour.slice(0, 2)) : 9;
  const closeH = info.hours.length ? Number(info.hours[info.hours.length - 1].hour.slice(0, 2)) + 1 : 22;
  const minH = info.minHours || minHours || 3;
  const dur = [];
  for (let d = minH; d <= Math.max(minH, closeH - openH); d++) dur.push(d);
  const remAt = (h) => {
    const s = info.hours.find((x) => x.hour === `${String(h).padStart(2, "0")}:00`);
    return s ? s.remaining : 0;
  };
  const canStart = (h) => {
    if (h + hours > closeH) return false;
    if (date === today && `${String(h).padStart(2, "0")}:00` <= nowHM) return false;
    for (let x = h; x < h + hours; x++) if (remAt(x) < 1) return false;
    return true;
  };
  const grp = (label, arr) => arr.length === 0 ? null : /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12, marginBottom: 6 } }, label), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 } }, arr.map((s) => {
    const h = Number(s.hour.slice(0, 2));
    const ok = canStart(h);
    const sel = start === s.hour;
    return /* @__PURE__ */ React.createElement("button", { key: s.hour, type: "button", disabled: !ok, onClick: () => onStart(s.hour), style: { padding: "10px 0", borderRadius: 9, fontSize: 13, fontWeight: 600, border: `1px solid ${sel ? "var(--ink)" : "var(--line)"}`, background: sel ? "var(--ink)" : "var(--bg)", color: sel ? "#fff" : ok ? "var(--ink)" : "var(--ink-3)", cursor: ok ? "pointer" : "default", opacity: ok ? 1 : 0.4 } }, s.hour.replace(":00", "\uC2DC"));
  })));
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 14, display: "block", marginBottom: 8 } }, "\uC774\uC6A9 \uC2DC\uAC04 (\uCD5C\uC18C ", minH, "\uC2DC\uAC04)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, dur.map((d) => /* @__PURE__ */ React.createElement("button", { key: d, type: "button", onClick: () => onHours(d), style: { minWidth: 50, padding: "8px 0", borderRadius: 9, fontSize: 13, fontWeight: 600, flex: "1 1 0", border: `1px solid ${hours === d ? "var(--ink)" : "var(--line)"}`, background: hours === d ? "var(--ink)" : "var(--bg)", color: hours === d ? "#fff" : "var(--ink)", cursor: "pointer" } }, d, "\uC2DC\uAC04")))), /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 14, display: "block", marginBottom: 8 } }, "\uC2DC\uC791 \uC2DC\uAC04"), info.hours.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, "\uC774\uC6A9 \uAC00\uB2A5\uD55C \uC2DC\uAC04\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement(React.Fragment, null, grp("\uC624\uC804", info.hours.filter((s) => hkAmPm(s.hour))), grp("\uC624\uD6C4", info.hours.filter((s) => !hkAmPm(s.hour)))));
};
const HkBookingModal = ({ room, checkIn, checkOut, adults, children, user, property, go, memberDiscount, onClose, onDone }) => {
  const canStay = room.dailyEnabled, canHourly = room.hourlyEnabled;
  const [unit, setUnit] = React.useState(canStay ? "nightly" : "hourly");
  const [start, setStart] = React.useState(null);
  const [hours, setHours] = React.useState(room.minHours || 3);
  const [coupon, setCoupon] = React.useState("");
  const [name, setName] = React.useState((user == null ? void 0 : user.name) || "");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState((user == null ? void 0 : user.email) || "");
  const [request, setRequest] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const [quote, setQuote] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const guests = adults + children;
  const nights = hkNights(checkIn, checkOut);
  React.useEffect(() => {
    setStart(null);
  }, [unit]);
  React.useEffect(() => {
    let alive = true;
    if (unit === "hourly") {
      if (!start) {
        setQuote(null);
        return;
      }
      window.BGNJ_HANGYEON.quote({ roomTypeId: room.id, unit: "hourly", date: checkIn, slotStart: start, hours, guests, couponCode: coupon.trim() || void 0 }).then((q) => {
        if (alive) setQuote(q);
      });
    } else {
      window.BGNJ_HANGYEON.quote({ roomTypeId: room.id, unit: "nightly", checkIn, checkOut, rooms: 1, guests, couponCode: coupon.trim() || void 0 }).then((q) => {
        if (alive) setQuote(q);
      });
    }
    return () => {
      alive = false;
    };
  }, [unit, start, hours, coupon, room.id, checkIn, checkOut, guests]);
  const submit = async () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    if (!name.trim() || !phone.trim()) {
      (_b = (_a = window.BGNJ_TOAST) == null ? void 0 : _a.error) == null ? void 0 : _b.call(_a, "\uC774\uB984\uACFC \uC5F0\uB77D\uCC98\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    if (!agreed) {
      (_d = (_c = window.BGNJ_TOAST) == null ? void 0 : _c.error) == null ? void 0 : _d.call(_c, "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9\uC5D0 \uB3D9\uC758\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    if (!(quote == null ? void 0 : quote.ok)) {
      (_f = (_e = window.BGNJ_TOAST) == null ? void 0 : _e.error) == null ? void 0 : _f.call(_e, (quote == null ? void 0 : quote.reason) || "\uC608\uC57D\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return;
    }
    setSubmitting(true);
    const base = { roomTypeId: room.id, guests, name: name.trim(), phone: phone.trim(), email: email.trim(), request: request.trim(), couponCode: coupon.trim() || void 0 };
    const payload = unit === "hourly" ? { ...base, unit: "hourly", date: checkIn, slotStart: start, hours } : { ...base, unit: "nightly", checkIn, checkOut, rooms: 1 };
    const res = await window.BGNJ_HANGYEON.book(payload);
    setSubmitting(false);
    if (res.ok) {
      (_i = (_g = window.BGNJ_TOAST) == null ? void 0 : _g.success) == null ? void 0 : _i.call(_g, `\uC608\uC57D \uC811\uC218 \uC644\uB8CC (${(_h = res.booking) == null ? void 0 : _h.code}). \uC785\uAE08 \uD655\uC778 \uD6C4 \uD655\uC815\uB429\uB2C8\uB2E4.`);
      onDone && onDone();
      onClose();
    } else (_k = (_j = window.BGNJ_TOAST) == null ? void 0 : _j.error) == null ? void 0 : _k.call(_j, res.message || "\uC608\uC57D \uC2E4\uD328");
  };
  const cell = (label, date, time) => /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "center", padding: "12px 8px" } }, /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12, marginBottom: 4 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700 } }, hkFmtDate(date)), /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 13 } }, time));
  return /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1e3, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "40px 16px" } }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: { ...SOFT, maxWidth: 480, width: "100%", padding: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px" } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, margin: 0 } }, room.name), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: onClose, style: { background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--ink-3)" } }, "\u2715")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px 22px", display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12.5 } }, "\uAE30\uC900 ", Math.min(adults, room.maxOccupancy), "\uBA85 / \uCD5C\uB300 ", room.maxOccupancy, "\uBA85 \xB7 ", property == null ? void 0 : property.address), canStay && canHourly && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, ["nightly", "hourly"].map((u) => /* @__PURE__ */ React.createElement("button", { key: u, type: "button", onClick: () => setUnit(u), style: { flex: 1, padding: "11px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", border: "none", background: unit === u ? "var(--bg-2)" : "transparent", color: unit === u ? "var(--ink)" : "var(--ink-3)" } }, u === "nightly" ? `\uC219\uBC15 ${hkWon(room.dailyPrice)}~` : `\uC2DC\uAC04\uC81C ${hkWon(room.hourlyPrice)}/\uC2DC\uAC04`))), unit === "nightly" ? /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-2)", borderRadius: 12, display: "flex", alignItems: "center" } }, cell("\uCCB4\uD06C\uC778", checkIn, "15:00"), /* @__PURE__ */ React.createElement("span", { className: "badge", style: { flexShrink: 0 } }, nights, "\uBC15"), cell("\uCCB4\uD06C\uC544\uC6C3", checkOut, "11:00")) : /* @__PURE__ */ React.createElement(HkHourSelect, { roomTypeId: room.id, date: checkIn, minHours: room.minHours || 3, start, hours, onStart: setStart, onHours: setHours }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13.5 } }, /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\uC778\uC6D0"), /* @__PURE__ */ React.createElement("span", null, "\uC131\uC778 ", adults, children ? `, \uC544\uB3D9 ${children}` : "")), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-2)", borderRadius: 12, padding: "14px 16px" } }, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 14 } }, "\uACB0\uC81C \uAE08\uC561"), (quote == null ? void 0 : quote.ok) ? /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, display: "flex", flexDirection: "column", gap: 6, fontSize: 13 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC0C1\uD488 \uAE08\uC561 ", unit === "nightly" ? `(${nights}\uBC15)` : `(${quote.hours}\uC2DC\uAC04)`), /* @__PURE__ */ React.createElement("span", null, hkWon(quote.subtotal))), quote.couponDiscount > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", color: "var(--success)" } }, /* @__PURE__ */ React.createElement("span", null, "\uCFE0\uD3F0 ", quote.couponLabel), /* @__PURE__ */ React.createElement("span", null, "-", hkWon(quote.couponDiscount))), quote.memberDiscount > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", color: "var(--success)" } }, /* @__PURE__ */ React.createElement("span", null, "\uD68C\uC6D0 \uD560\uC778 (", quote.memberRate, "%)"), /* @__PURE__ */ React.createElement("span", null, "-", hkWon(quote.memberDiscount))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", null, "\uCD1D \uACB0\uC81C \uAE08\uC561"), /* @__PURE__ */ React.createElement("span", { className: "ko-serif" }, hkWon(quote.total)))) : /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 0", fontSize: 13, color: "var(--danger)" } }, (quote == null ? void 0 : quote.reason) || (unit === "hourly" ? "\uC2DC\uC791 \uC2DC\uAC04\uC744 \uC120\uD0DD\uD558\uC138\uC694" : "\uB0A0\uC9DC\uB97C \uD655\uC778\uD558\uC138\uC694")), (quote == null ? void 0 : quote.couponError) && /* @__PURE__ */ React.createElement("p", { style: { margin: "6px 0 0", fontSize: 12, color: "var(--danger)" } }, quote.couponError), !user && (quote == null ? void 0 : quote.ok) && memberDiscount > 0 && /* @__PURE__ */ React.createElement("div", { style: { margin: "10px 0 0", padding: "10px 12px", borderRadius: 10, background: "rgba(146,64,14,0.06)", fontSize: 12.5, lineHeight: 1.6 } }, "\u{1F4A1} ", /* @__PURE__ */ React.createElement("strong", null, "\uD68C\uC6D0\uAC00\uC785\uD558\uBA74 ", memberDiscount, "% \uD560\uC778"), " \u2014 \uD68C\uC6D0\uAC00 ", /* @__PURE__ */ React.createElement("strong", { className: "ko-serif", style: { color: "var(--secondary)", fontSize: 15 } }, hkWon(Math.round(quote.total * (100 - memberDiscount) / 100))), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go && go("signup"), style: { marginLeft: 8, background: "var(--secondary)", color: "#fff", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", font: "inherit", fontSize: 12, fontWeight: 600 } }, "\uD68C\uC6D0\uAC00\uC785\uD558\uACE0 \uD560\uC778\uBC1B\uAE30")), !user && (quote == null ? void 0 : quote.ok) && memberDiscount === 0 && /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 0", fontSize: 12, color: "var(--secondary)" } }, "\u{1F4A1} ", /* @__PURE__ */ React.createElement("strong", null, "\uD68C\uC6D0\uAC00\uC785/\uB85C\uADF8\uC778"), " \uC2DC \uD68C\uC6D0 \uD61C\uD0DD\uC774 \uC801\uC6A9\uB429\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 14, display: "block", marginBottom: 10 } }, "\uC608\uC57D\uC790 \uC815\uBCF4"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement("input", { style: FIELD, placeholder: "\uC131\uBA85 *", value: name, onChange: (e) => setName(e.target.value) }), /* @__PURE__ */ React.createElement("input", { style: FIELD, placeholder: "\uD734\uB300\uD3F0 \uBC88\uD638 * (010-0000-0000)", value: phone, onChange: (e) => setPhone(e.target.value) }), /* @__PURE__ */ React.createElement("input", { style: FIELD, placeholder: "\uC774\uBA54\uC77C (\uC120\uD0DD)", value: email, onChange: (e) => setEmail(e.target.value) }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement("input", { style: { ...FIELD, flex: 1 }, placeholder: "\uCFE0\uD3F0 \uCF54\uB4DC (\uC120\uD0DD)", value: coupon, onChange: (e) => setCoupon(e.target.value.toUpperCase()) })), /* @__PURE__ */ React.createElement("textarea", { style: { ...FIELD, resize: "vertical" }, rows: 2, placeholder: "\uC694\uCCAD\uC0AC\uD56D (\uC120\uD0DD)", value: request, onChange: (e) => setRequest(e.target.value) }))), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: agreed, onChange: (e) => setAgreed(e.target.checked), style: { marginTop: 2 } }), /* @__PURE__ */ React.createElement("span", null, "\uAC1C\uC778\uC815\uBCF4(\uC774\uB984\xB7\uC5F0\uB77D\uCC98\xB7\uC774\uBA54\uC77C) \uC218\uC9D1\xB7\uC774\uC6A9 \uBC0F \uC608\uC57D \uC9C4\uD589\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4. \uC218\uC9D1\uD55C \uAC1C\uC778\uC815\uBCF4\uB294 ", /* @__PURE__ */ React.createElement("strong", null, "1\uB144\uAC04 \uBCF4\uAD00 \uD6C4 \uD30C\uAE30"), "\uB418\uBA70, \uACB0\uC81C\uB294 ", /* @__PURE__ */ React.createElement("strong", null, "\uBB34\uD1B5\uC7A5 \uC785\uAE08/\uD604\uC7A5 \uACB0\uC81C"), "\uB85C \uC9C4\uD589\uB429\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", disabled: submitting || !(quote == null ? void 0 : quote.ok), onClick: submit, style: { opacity: submitting || !(quote == null ? void 0 : quote.ok) ? 0.5 : 1, padding: "14px", fontSize: 15 } }, submitting ? "\uC811\uC218 \uC911\u2026" : (quote == null ? void 0 : quote.ok) ? `${hkWon(quote.total)} \uC608\uC57D\uD558\uAE30` : "\uC608\uC57D\uD558\uAE30"))));
};
const HkGallery = ({ images, name }) => {
  const has = images.length > 0;
  const big = has ? images[0] : null;
  const side = has ? images.slice(1, 5) : [];
  const ph = () => window.CoverPlaceholder ? /* @__PURE__ */ React.createElement(window.CoverPlaceholder, { aspectRatio: "1/1", iconSize: 40 }) : /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-2)", width: "100%", height: "100%" } });
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 24, height: 360, borderRadius: 16, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 60%", background: "var(--bg-2)", overflow: "hidden" } }, big ? /* @__PURE__ */ React.createElement("img", { src: big.url, alt: name, style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }) : ph()), /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 40%", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 6, position: "relative" } }, [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { background: "var(--bg-2)", overflow: "hidden" } }, side[i] ? /* @__PURE__ */ React.createElement("img", { src: side[i].url, alt: "", style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }) : ph())), has && images.length > 1 && /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", right: 12, bottom: 12, background: "rgba(15,23,42,0.78)", color: "#fff", fontSize: 12, padding: "6px 12px", borderRadius: 999 } }, "\uC804\uCCB4 \uC0AC\uC9C4 ", images.length)));
};
const HkRoomCard = ({ room, onBook, memberDiscount }) => {
  const cover = (room.images || []).find((im) => im.isPrimary) || (room.images || [])[0];
  const available = room.stayAvailable || room.dayHourlyAvailable;
  const md = Number(memberDiscount) || 0;
  const mp = (p) => Math.round((p || 0) * (100 - md) / 100);
  const basePrice = room.stayAvailable ? room.stayTotal : room.hourlyPrice;
  return /* @__PURE__ */ React.createElement("div", { style: { ...SOFT, padding: 0, overflow: "hidden", display: "flex", flexWrap: "wrap", opacity: available ? 1 : 0.55 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "0 0 220px", minWidth: 180, background: "var(--bg-2)", overflow: "hidden" } }, cover ? /* @__PURE__ */ React.createElement("img", { src: cover.url, alt: room.name, style: { width: "100%", height: "100%", minHeight: 170, objectFit: "cover", display: "block" } }) : window.CoverPlaceholder ? /* @__PURE__ */ React.createElement(window.CoverPlaceholder, { aspectRatio: "4/3", iconSize: 44 }) : null), /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 280px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, margin: 0 } }, room.name), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12.5 } }, "\uAE30\uC900 2\uBA85 / \uCD5C\uB300 ", room.maxOccupancy, "\uBA85", room.bedConfig ? ` \xB7 ${room.bedConfig}` : ""), room.dailyEnabled && /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-2)", borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5 } }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\uCCB4\uD06C\uC778"), " 15:00"), /* @__PURE__ */ React.createElement("span", { className: "badge" }, room.nights, "\uBC15"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\uCCB4\uD06C\uC544\uC6C3"), " 11:00")), room.hourlyEnabled && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11.5 } }, "\uC2DC\uAC04\uC81C ", hkWon(room.hourlyPrice), "/\uC2DC\uAC04 (\uCD5C\uC18C ", room.minHours, "\uC2DC\uAC04)"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "auto", display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: 12, paddingTop: 8 } }, available ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11 } }, room.stayAvailable ? `${room.nights}\uBC15` : "\uC2DC\uAC04\uB2F9"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: md > 0 ? 16 : 22, fontWeight: 700, color: md > 0 ? "var(--ink-3)" : "var(--ink)", textDecoration: md > 0 ? "line-through" : "none" } }, hkWon(basePrice), !room.stayAvailable ? "~" : ""), md > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--secondary)", fontWeight: 700, marginRight: 4 } }, "\uD68C\uC6D0\uAC00 -", md, "%"), /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: 22, fontWeight: 700, color: "var(--secondary)" } }, hkWon(mp(basePrice)), !room.stayAvailable ? "~" : ""))) : /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: "var(--danger)", color: "var(--danger)" } }, "\uC608\uC57D \uB9C8\uAC10"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", disabled: !available, onClick: () => onBook(room), style: { opacity: available ? 1 : 0.5, minWidth: 110 } }, "\uC608\uC57D\uD558\uAE30"))));
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
  const span = (b) => b.bookingUnit === "hourly" ? `${hkFmtDate(b.checkIn)} ${hk12h(b.slotStart)}~${hk12h(b.slotEnd)}` : `${hkFmtDate(b.checkIn)} \u2192 ${hkFmtDate(b.checkOut)} \xB7 ${b.nights}\uBC15`;
  if (!loaded || bookings.length === 0) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { ...SOFT, padding: 22, marginTop: 28 } }, /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { fontSize: 20, marginBottom: 16 } }, "\uB0B4 \uC608\uC57D"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 } }, bookings.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.id, style: { background: "var(--bg-2)", borderRadius: 12, padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, b.code), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { className: "badge" }, HK_STATUS_LABEL[b.status] || b.status), /* @__PURE__ */ React.createElement("span", { className: "badge" }, HK_PAY_LABEL[b.paymentStatus] || b.paymentStatus))), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, marginBottom: 6 } }, b.roomTypeName), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, margin: "0 0 6px" } }, span(b), " \xB7 ", b.guests, "\uBA85"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, fontWeight: 600, margin: "0 0 10px" } }, hkWon(b.totalPrice)), ["pending", "confirmed"].includes(b.status) && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => cancel(b) }, "\uC608\uC57D \uCDE8\uC18C")))));
};
const HK_TABS = [["rooms", "\uAC1D\uC2E4\uC120\uD0DD"], ["loc", "\uC704\uCE58/\uAD50\uD1B5"], ["about", "\uC219\uC18C\uC18C\uAC1C"], ["fac", "\uC2DC\uC124/\uC11C\uBE44\uC2A4"], ["guide", "\uC774\uC6A9\uC548\uB0B4"]];
const HangyeonPage = ({ go, user }) => {
  var _a, _b;
  const [tick, setTick] = React.useState(0);
  const [checkIn, setCheckIn] = React.useState(hkToday());
  const [checkOut, setCheckOut] = React.useState(hkAddDays(hkToday(), 1));
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [dayRooms, setDayRooms] = React.useState([]);
  const [dayLoading, setDayLoading] = React.useState(true);
  const [booking, setBooking] = React.useState(null);
  const [pickDate, setPickDate] = React.useState(false);
  const [pickGuest, setPickGuest] = React.useState(false);
  const [scTick, setScTick] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("rooms");
  const refs = { rooms: React.useRef(null), loc: React.useRef(null), about: React.useRef(null), fac: React.useRef(null), guide: React.useRef(null) };
  React.useEffect(() => {
    const onR = () => setScTick((v) => v + 1);
    window.addEventListener("bgnj-site-content-refresh", onR);
    return () => window.removeEventListener("bgnj-site-content-refresh", onR);
  }, []);
  React.useEffect(() => {
    let alive = true;
    setDayLoading(true);
    window.BGNJ_HANGYEON.day({ from: checkIn, to: checkOut }).then((rooms) => {
      if (alive) {
        setDayRooms(rooms);
        setDayLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [checkIn, checkOut, tick]);
  const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
  const info = sc.hangyeon || {};
  const name = info.name || "\uC804\uC8FC\uD55C\uCF20";
  const tagline = info.tagline || "\uC804\uC8FC \uB3C4\uC2EC \uC18D, \uC870\uC6A9\uD55C \uD558\uB8FB\uBC24";
  const desc = info.desc || "\uC804\uC8FC \uC804\uC790\uC0C1\uAC00 \uB4A4\uD3B8 \uC870\uC6A9\uD55C \uC8FC\uD0DD\uAC00\uC5D0 \uC790\uB9AC\uD55C \uACF5\uAC04 \u2018\uD55C\uCF20\u2019.";
  const address = info.address || "\uC804\uBD81 \uC804\uC8FC\uC2DC \uB355\uC9C4\uAD6C \uD314\uB2EC\uB85C 340-37";
  const directions = info.directions || "\uC804\uC8FC\uC5ED\uC5D0\uC11C \uCC28\uB7C9 10\uBD84, \uC804\uC8FC \uACE0\uC18D\uBC84\uC2A4\uD130\uBBF8\uB110\uC5D0\uC11C \uB3C4\uBCF4 15\uBD84. \uD55C\uC625\uB9C8\uC744\xB7\uC790\uB9CC\uBCBD\uD654\uB9C8\uC744\xB7\uACBD\uAE30\uC804\xB7\uD48D\uB0A8\uBB38\uAE4C\uC9C0 \uCC28\uB7C9 5~10\uBD84.";
  const images = Array.isArray(info.images) ? info.images : [];
  const memberDiscount = Number(info.memberDiscount) || 0;
  const property = { name, address, directions, notice: info.notice };
  const amenities = Array.from(new Set(dayRooms.flatMap((r) => r.amenities || [])));
  const openClose = dayRooms.find((r) => r.hourlyEnabled);
  const nights = hkNights(checkIn, checkOut);
  const scrollTo = (k) => {
    setActiveTab(k);
    const el = refs[k].current;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const datePill = { flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "16px 18px", cursor: "pointer", fontSize: 15, fontWeight: 600, background: "none", border: "none", color: "var(--ink)" };
  return /* @__PURE__ */ React.createElement("div", { className: "section", style: { paddingTop: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 1080 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, flexWrap: "wrap", margin: "24px 0 22px" } }, /* @__PURE__ */ React.createElement("div", { style: { ...SOFT, flex: "2 1 360px", display: "flex", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { type: "button", style: datePill, onClick: () => setPickDate(true) }, "\u{1F4C5} ", /* @__PURE__ */ React.createElement("span", null, hkFmtDate(checkIn))), /* @__PURE__ */ React.createElement("span", { className: "badge", style: { flexShrink: 0 } }, nights, "\uBC15"), /* @__PURE__ */ React.createElement("button", { type: "button", style: { ...datePill, justifyContent: "flex-end" }, onClick: () => setPickDate(true) }, /* @__PURE__ */ React.createElement("span", null, hkFmtDate(checkOut)), " \u{1F4C5}")), /* @__PURE__ */ React.createElement("button", { type: "button", style: { ...SOFT, flex: "1 1 220px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 18px", cursor: "pointer", fontSize: 15, fontWeight: 600, border: "none", color: "var(--ink)" }, onClick: () => setPickGuest(true) }, "\u{1F464} \uC131\uC778 ", adults, children ? `, \uC544\uB3D9 ${children}` : ", \uC544\uB3D9 0")), /* @__PURE__ */ React.createElement(HkGallery, { images, name }), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement("h1", { className: "ko-serif", style: { fontSize: 28, margin: "0 0 6px" } }, name), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: 0, fontSize: 14 } }, tagline, " \xB7 ", /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => scrollTo("loc"), style: { background: "none", border: "none", padding: 0, color: "var(--secondary)", cursor: "pointer", font: "inherit" } }, "\uC704\uCE58 \uBCF4\uAE30"))), /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", top: 64, zIndex: 40, background: "var(--bg)", borderBottom: "1px solid var(--line-2, var(--line))", display: "flex", gap: 4, marginBottom: 24, overflowX: "auto" } }, HK_TABS.map(([k, label]) => /* @__PURE__ */ React.createElement("button", { key: k, type: "button", onClick: () => scrollTo(k), style: { padding: "14px 16px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === k ? "var(--ink)" : "transparent"}`, color: activeTab === k ? "var(--ink)" : "var(--ink-3)", fontWeight: activeTab === k ? 700 : 500, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" } }, label))), /* @__PURE__ */ React.createElement("section", { ref: refs.rooms, style: { scrollMarginTop: 120, marginBottom: 44 } }, /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { fontSize: 22, marginBottom: 4 } }, "\uAC1D\uC2E4 \uC120\uD0DD"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 13, marginBottom: 18 } }, hkFmtDate(checkIn), " \u2192 ", hkFmtDate(checkOut), " \xB7 ", nights, "\uBC15 \xB7 \uC131\uC778 ", adults, children ? `\xB7\uC544\uB3D9 ${children}` : ""), dayLoading ? /* @__PURE__ */ React.createElement("div", { style: { ...SOFT, padding: 40, textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: 0 } }, "\uBD88\uB7EC\uC624\uB294 \uC911\u2026")) : dayRooms.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { ...SOFT, padding: 50, textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: 0 } }, "\uB4F1\uB85D\uB41C \uAC1D\uC2E4\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")) : dayRooms.every((r) => !(r.stayAvailable || r.dayHourlyAvailable)) ? /* @__PURE__ */ React.createElement("div", { style: { ...SOFT, padding: 50, textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 6px", fontSize: 16, fontWeight: 600 } }, "\uC608\uC57D\uD560 \uC218 \uC788\uB294 \uAC1D\uC2E4\uC774 \uC5C6\uC5B4\uC694"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: "0 0 18px", fontSize: 13 } }, "\uB0A0\uC9DC\uB97C \uBCC0\uACBD\uD574 \uC8FC\uC138\uC694"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: () => setPickDate(true) }, "\uB0A0\uC9DC \uBCC0\uACBD\uD558\uAE30")) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, dayRooms.map((rm) => /* @__PURE__ */ React.createElement(HkRoomCard, { key: rm.id, room: rm, onBook: setBooking, memberDiscount })))), /* @__PURE__ */ React.createElement("section", { ref: refs.loc, style: { scrollMarginTop: 120, marginBottom: 44 } }, /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { fontSize: 22, marginBottom: 14 } }, "\uC704\uCE58/\uAD50\uD1B5"), /* @__PURE__ */ React.createElement("div", { style: { ...SOFT, padding: "18px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 600, marginBottom: 8 } }, "\u{1F4CD} ", address), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: 0, fontSize: 13.5, lineHeight: 1.8 } }, directions))), /* @__PURE__ */ React.createElement("section", { ref: refs.about, style: { scrollMarginTop: 120, marginBottom: 44 } }, /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { fontSize: 22, marginBottom: 14 } }, "\uC219\uC18C\uC18C\uAC1C"), /* @__PURE__ */ React.createElement("div", { style: { ...SOFT, padding: "18px 20px" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: 0, fontSize: 14, lineHeight: 1.9 } }, desc), info.notice && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: "10px 0 0", fontSize: 13 } }, info.notice))), /* @__PURE__ */ React.createElement("section", { ref: refs.fac, style: { scrollMarginTop: 120, marginBottom: 44 } }, /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { fontSize: 22, marginBottom: 14 } }, "\uC2DC\uC124/\uC11C\uBE44\uC2A4"), /* @__PURE__ */ React.createElement("div", { style: { ...SOFT, padding: "18px 20px" } }, amenities.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { margin: 0, fontSize: 13 } }, "\uB4F1\uB85D\uB41C \uD3B8\uC758\uC2DC\uC124 \uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12 } }, amenities.map((a) => /* @__PURE__ */ React.createElement("div", { key: a, style: { fontSize: 13.5 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--success)", marginRight: 6 } }, "\u2713"), a))))), /* @__PURE__ */ React.createElement("section", { ref: refs.guide, style: { scrollMarginTop: 120, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { fontSize: 22, marginBottom: 14 } }, "\uC774\uC6A9\uC548\uB0B4"), /* @__PURE__ */ React.createElement("div", { style: { ...SOFT, padding: "18px 20px", fontSize: 13.5, lineHeight: 2 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "\uCCB4\uD06C\uC778"), " 15:00 \xB7 ", /* @__PURE__ */ React.createElement("strong", null, "\uCCB4\uD06C\uC544\uC6C3"), " 11:00"), openClose && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "\uC2DC\uAC04\uC81C \uC6B4\uC601"), " ", openClose.openTime, " ~ ", openClose.closeTime, " (\uCD5C\uC18C ", openClose.minHours, "\uC2DC\uAC04)"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "\uACB0\uC81C"), " \uBB34\uD1B5\uC7A5 \uC785\uAE08 \uB610\uB294 \uD604\uC7A5 \uACB0\uC81C \u2014 \uC785\uAE08 \uD655\uC778 \uC2DC \uC608\uC57D \uD655\uC815"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "\uC608\uC57D \uCDE8\uC18C"), " \uC544\uB798 \u2018\uB0B4 \uC608\uC57D\u2019\uC5D0\uC11C \uAC00\uB2A5 (\uCCB4\uD06C\uC778 \uC804)"))), /* @__PURE__ */ React.createElement(HkMyBookings, { tick })), pickDate && /* @__PURE__ */ React.createElement(HkDatePicker, { checkIn, checkOut, onApply: (ci, co) => {
    setCheckIn(ci);
    setCheckOut(co);
  }, onClose: () => setPickDate(false) }), pickGuest && /* @__PURE__ */ React.createElement(HkGuestPicker, { adults, children, onApply: (a, c) => {
    setAdults(a);
    setChildren(c);
  }, onClose: () => setPickGuest(false) }), booking && /* @__PURE__ */ React.createElement(HkBookingModal, { room: booking, checkIn, checkOut, adults, children, user, property, go, memberDiscount, onClose: () => setBooking(null), onDone: () => setTick((v) => v + 1) }));
};
Object.assign(window, { HangyeonPage });

})();

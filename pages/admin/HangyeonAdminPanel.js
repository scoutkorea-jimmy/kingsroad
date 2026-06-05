(function(){
const hkaWon = (n) => {
  var _a;
  return ((_a = window.BGNJ_FMT) == null ? void 0 : _a.won) ? window.BGNJ_FMT.won(n) : `${Number(n || 0).toLocaleString("ko-KR")}\uC6D0`;
};
const hkaToday = () => new Date(Date.now() + 9 * 3600 * 1e3).toISOString().slice(0, 10);
const hkaAddDays = (str, n) => new Date((/* @__PURE__ */ new Date(str + "T00:00:00Z")).getTime() + n * 864e5).toISOString().slice(0, 10);
const HKA_WD = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"];
const hkaDate = (str) => {
  if (!str) return "-";
  const d = /* @__PURE__ */ new Date(str + "T00:00:00Z");
  return `${str.slice(2).replace(/-/g, ".")}(${HKA_WD[d.getUTCDay()]})`;
};
const HKA_STATUS = { pending: "\uC608\uC57D\uB300\uAE30", confirmed: "\uC608\uC57D\uD655\uC815", checked_in: "\uCCB4\uD06C\uC778", checked_out: "\uCCB4\uD06C\uC544\uC6C3", cancelled: "\uCDE8\uC18C", no_show: "\uB178\uC1FC" };
const HKA_STATUS_COLOR = { pending: "#D97706", confirmed: "#16A34A", checked_in: "#2563EB", checked_out: "#475569", cancelled: "#DC2626", no_show: "#9333EA" };
const HKA_PAY = { unpaid: "\uBBF8\uACB0\uC81C", partial: "\uBD80\uBD84\uACB0\uC81C", paid: "\uACB0\uC81C\uC644\uB8CC", refunded: "\uD658\uBD88\uC644\uB8CC" };
const hkaFlash = (msg, ok) => {
  var _a, _b, _c, _d;
  return ok === false ? (_b = (_a = window.BGNJ_TOAST) == null ? void 0 : _a.error) == null ? void 0 : _b.call(_a, msg) : (_d = (_c = window.BGNJ_TOAST) == null ? void 0 : _c.success) == null ? void 0 : _d.call(_c, msg);
};
const HkaRoomTypes = () => {
  const [list, setList] = React.useState([]);
  const [editing, setEditing] = React.useState(null);
  const reload = () => window.BGNJ_HANGYEON.refreshRoomTypes({ includeAll: true }).then(setList);
  React.useEffect(() => {
    reload();
  }, []);
  const blank = () => ({ name: "", description: "", images: [], quantity: 1, maxOccupancy: 2, bedConfig: "", amenities: [], basePrice: 0, weekendPrice: "", discounts: [], minNights: 1, maxNights: 30, status: "active", sortOrder: 0, bookingType: "nightly", openTime: "09:00", closeTime: "22:00", slotMinutes: 60, hourlyEnabled: true, hourlyPrice: 1e4, minHours: 3, dailyEnabled: true, dailyPrice: 6e4 });
  const save = async () => {
    var _a;
    if (!editing.name.trim()) {
      hkaFlash("\uAC1D\uC2E4 \uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694.", false);
      return;
    }
    try {
      await window.BGNJ_HANGYEON.saveRoomType(editing);
      setEditing(null);
      reload();
      hkaFlash("\uC800\uC7A5\uB428.");
    } catch (err) {
      hkaFlash(((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || "\uC800\uC7A5 \uC2E4\uD328", false);
    }
  };
  const del = async (rt) => {
    if (!await window.BGNJ_CONFIRM(`"${rt.name}" \uAC1D\uC2E4\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?`, { danger: true })) return;
    await window.BGNJ_HANGYEON.deleteRoomType(rt.id);
    reload();
    hkaFlash("\uC0AD\uC81C\uB428.");
  };
  const up = (patch) => setEditing((e) => ({ ...e, ...patch }));
  if (editing) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("h4", { style: { margin: 0 } }, editing.id ? "\uAC1D\uC2E4 \uC218\uC815" : "\uC0C8 \uAC1D\uC2E4"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uAC1D\uC2E4\uBA85", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: editing.name, onChange: (e) => up({ name: e.target.value }), placeholder: "\uB514\uB7ED\uC2A4\uB8F8 / \uC791\uC5C5\uC2E4" })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uD310\uB9E4 \uC0C1\uD0DC", /* @__PURE__ */ React.createElement("select", { className: "field-input", value: editing.status, onChange: (e) => up({ status: e.target.value }) }, /* @__PURE__ */ React.createElement("option", { value: "active" }, "\uD310\uB9E4 \uAC00\uB2A5"), /* @__PURE__ */ React.createElement("option", { value: "inactive" }, "\uD310\uB9E4 \uBD88\uAC00")))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uAC1D\uC2E4 \uC218\uB7C9", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: editing.quantity, onChange: (e) => up({ quantity: Number(e.target.value) }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uCD5C\uB300 \uC778\uC6D0", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: editing.maxOccupancy, onChange: (e) => up({ maxOccupancy: Number(e.target.value) }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uCE68\uB300 \uAD6C\uC131", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: editing.bedConfig, onChange: (e) => up({ bedConfig: e.target.value }), placeholder: "\uB354\uBE14 1" }))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 12, background: editing.hourlyEnabled ? "rgba(22,163,74,0.06)" : "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: !!editing.hourlyEnabled, onChange: (e) => up({ hourlyEnabled: e.target.checked }) }), "\uC2DC\uAC04\uB2F9 \uC608\uC57D \uBC1B\uAE30"), editing.hourlyEnabled && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginTop: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC2DC\uAC04\uB2F9 \uC694\uAE08", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: editing.hourlyPrice, onChange: (e) => up({ hourlyPrice: Number(e.target.value) }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uCD5C\uC18C \uC774\uC6A9\uC2DC\uAC04", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: editing.minHours, onChange: (e) => up({ minHours: Number(e.target.value) }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC6B4\uC601 \uC2DC\uC791", /* @__PURE__ */ React.createElement("input", { type: "time", className: "field-input", value: editing.openTime || "", onChange: (e) => up({ openTime: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC6B4\uC601 \uC885\uB8CC", /* @__PURE__ */ React.createElement("input", { type: "time", className: "field-input", value: editing.closeTime || "", onChange: (e) => up({ closeTime: e.target.value }) })))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 12, background: editing.dailyEnabled ? "rgba(22,163,74,0.06)" : "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: !!editing.dailyEnabled, onChange: (e) => up({ dailyEnabled: e.target.checked }) }), "\uD558\uB8E8(\uC804\uC77C) \uC608\uC57D \uBC1B\uAE30"), editing.dailyEnabled && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uD558\uB8E8 \uC694\uAE08", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: editing.dailyPrice, onChange: (e) => up({ dailyPrice: Number(e.target.value) }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC8FC\uB9D0(\uAE08\xB7\uD1A0) \uC694\uAE08", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: editing.weekendPrice, onChange: (e) => up({ weekendPrice: e.target.value }), placeholder: "(\uC120\uD0DD)" })))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC124\uBA85", /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 2, value: editing.description, onChange: (e) => up({ description: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uD3B8\uC758\uC2DC\uC124 (\uC27C\uD45C \uAD6C\uBD84)", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: (editing.amenities || []).join(", "), onChange: (e) => up({ amenities: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }), placeholder: "\uC5D0\uC5B4\uCEE8, \uC640\uC774\uD30C\uC774, \uCDE8\uC0AC, \uC8FC\uCC28" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, marginBottom: 6 } }, "\uC5F0\uBC15/\uC7A5\uAE30 \uD560\uC778"), (editing.discounts || []).map((d, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 8, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", style: { width: 90 }, value: d.minNights, placeholder: "N\uBC15\u2191", onChange: (e) => {
      const arr = [...editing.discounts];
      arr[i] = { ...d, minNights: Number(e.target.value) };
      up({ discounts: arr });
    } }), /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", style: { width: 80 }, value: d.percent, placeholder: "%", onChange: (e) => {
      const arr = [...editing.discounts];
      arr[i] = { ...d, percent: Number(e.target.value) };
      up({ discounts: arr });
    } }), /* @__PURE__ */ React.createElement("input", { className: "field-input", style: { flex: 1 }, value: d.label || "", placeholder: "\uB77C\uBCA8", onChange: (e) => {
      const arr = [...editing.discounts];
      arr[i] = { ...d, label: e.target.value };
      up({ discounts: arr });
    } }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => up({ discounts: editing.discounts.filter((_, j) => j !== i) }) }, "\u2715"))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => up({ discounts: [...editing.discounts || [], { minNights: 3, percent: 10, label: "3\uBC15 \uC774\uC0C1 10%" }] }) }, "+ \uD560\uC778 \uCD94\uAC00")), window.MediaGalleryEditor && /* @__PURE__ */ React.createElement(window.MediaGalleryEditor, { value: editing.images || [], onChange: (imgs) => up({ images: imgs }), folder: "hangyeon-rooms", label: "\uAC1D\uC2E4 \uC0AC\uC9C4", max: 10 }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: save }, "\uC800\uC7A5"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: () => setEditing(null) }, "\uCDE8\uC18C"), editing.id && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", style: { marginLeft: "auto", color: "var(--danger)" }, onClick: () => del(editing) }, "\uC0AD\uC81C")));
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, margin: 0 } }, "\uAC1D\uC2E4 \uD0C0\uC785 \xB7 \uC0AC\uC9C4 \xB7 \uC778\uC6D0 \xB7 \uC218\uB7C9 \xB7 \uCE68\uB300 \xB7 \uD3B8\uC758\uC2DC\uC124 \xB7 \uD310\uB9E4 \uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: () => setEditing(blank()) }, "+ \uAC1D\uC2E4 \uCD94\uAC00")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, list.map((rt) => /* @__PURE__ */ React.createElement("div", { key: rt.id, className: "card", style: { padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("strong", null, rt.name), " ", /* @__PURE__ */ React.createElement("span", { className: "badge", style: { marginLeft: 6 } }, rt.status === "active" ? "\uD310\uB9E4\uC911" : "\uD310\uB9E4\uC911\uC9C0"), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12, marginTop: 4 } }, rt.quantity, "\uC2E4 \xB7 \uCD5C\uB300 ", rt.maxOccupancy, "\uC778 \xB7 ", [rt.hourlyEnabled ? `\uC2DC\uAC04\uB2F9 ${hkaWon(rt.hourlyPrice)}` : null, rt.dailyEnabled ? `\uD558\uB8E8 ${hkaWon(rt.dailyPrice)}` : null].filter(Boolean).join(" / ") || "\uC694\uAE08 \uBBF8\uC124\uC815")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setEditing({ ...rt, weekendPrice: rt.weekendPrice == null ? "" : rt.weekendPrice }) }, "\uC218\uC815"))), list.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim" }, "\uB4F1\uB85D\uB41C \uAC1D\uC2E4\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")));
};
const HkaRates = () => {
  const [rules, setRules] = React.useState([]);
  const [coupons, setCoupons] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [rule, setRule] = React.useState(null);
  const [coupon, setCoupon] = React.useState(null);
  const [memberDiscount, setMemberDiscount] = React.useState(0);
  const reload = () => {
    var _a, _b;
    window.BGNJ_HANGYEON.rateRules().then(setRules);
    window.BGNJ_HANGYEON.coupons().then(setCoupons);
    window.BGNJ_HANGYEON.refreshRoomTypes({ includeAll: true }).then(setRooms);
    const h = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).hangyeon || {};
    setMemberDiscount(Number(h.memberDiscount) || 0);
  };
  React.useEffect(() => {
    reload();
  }, []);
  const saveMemberDiscount = async () => {
    var _a, _b, _c;
    try {
      const cur = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).hangyeon || {};
      await window.BGNJ_SITE_CONTENT.saveSection("hangyeon", { ...cur, memberDiscount: Math.max(0, Math.min(100, Number(memberDiscount) || 0)) });
      hkaFlash("\uD68C\uC6D0 \uD560\uC778\uC728 \uC800\uC7A5\uB428.");
    } catch (err) {
      hkaFlash(((_c = err == null ? void 0 : err.body) == null ? void 0 : _c.error) || (err == null ? void 0 : err.message) || "\uC2E4\uD328", false);
    }
  };
  const memberPrice = (p) => p == null ? null : Math.round(p * (100 - (Number(memberDiscount) || 0)) / 100);
  const saveRule = async () => {
    var _a;
    try {
      if (rule.id) await window.BGNJ_HANGYEON.updateRateRule(rule.id, rule);
      else await window.BGNJ_HANGYEON.createRateRule(rule);
      setRule(null);
      reload();
      hkaFlash("\uC694\uAE08 \uADDC\uCE59 \uC800\uC7A5\uB428.");
    } catch (err) {
      hkaFlash(((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || "\uC2E4\uD328", false);
    }
  };
  const delRule = async (r) => {
    if (!await window.BGNJ_CONFIRM("\uADDC\uCE59\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?", { danger: true })) return;
    await window.BGNJ_HANGYEON.deleteRateRule(r.id);
    reload();
  };
  const saveCoupon = async () => {
    var _a;
    if (!coupon.code.trim()) {
      hkaFlash("\uCF54\uB4DC\uB97C \uC785\uB825\uD558\uC138\uC694.", false);
      return;
    }
    try {
      await window.BGNJ_HANGYEON.upsertCoupon(coupon);
      setCoupon(null);
      reload();
      hkaFlash("\uCFE0\uD3F0 \uC800\uC7A5\uB428.");
    } catch (err) {
      hkaFlash(((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || "\uC2E4\uD328", false);
    }
  };
  const delCoupon = async (c) => {
    if (!await window.BGNJ_CONFIRM(`\uCFE0\uD3F0 ${c.code} \uC0AD\uC81C?`, { danger: true })) return;
    await window.BGNJ_HANGYEON.deleteCoupon(c.code);
    reload();
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 26 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 10px" } }, "\uD68C\uC6D0\uAC00 (\uD68C\uC6D0 \uC804\uC6A9 \uD560\uC778)"), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13 } }, "\uD68C\uC6D0(\uB85C\uADF8\uC778) \uC608\uC57D \uC2DC \uD560\uC778\uC728"), /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", style: { width: 90 }, value: memberDiscount, min: 0, max: 100, onChange: (e) => setMemberDiscount(e.target.value) }), " %", /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: saveMemberDiscount }, "\uC800\uC7A5"), /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 11 } }, "\uB85C\uADF8\uC778 \uC190\uB2D8\uC5D0\uAC8C \uC790\uB3D9 \uC801\uC6A9\xB7\uD45C\uC2DC\uB429\uB2C8\uB2E4. 0\uC774\uBA74 \uD68C\uC6D0\uAC00 \uBBF8\uC801\uC6A9.")), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("th", { style: { textAlign: "left", padding: "8px 10px", fontSize: 12, color: "var(--ink-3)" } }, "\uAC1D\uC2E4"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "right", padding: "8px 10px", fontSize: 12, color: "var(--ink-3)" } }, "\uC815\uC0C1\uAC00"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "right", padding: "8px 10px", fontSize: 12, color: "var(--ink-3)" } }, "\uD68C\uC6D0\uAC00"))), /* @__PURE__ */ React.createElement("tbody", null, rooms.map((r) => {
    const base = r.dailyEnabled ? r.dailyPrice : r.hourlyPrice;
    const unit = r.dailyEnabled ? "/\uBC15" : "/\uC2DC\uAC04";
    return /* @__PURE__ */ React.createElement("tr", { key: r.id }, /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", borderTop: "1px solid var(--line)" } }, r.name), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", borderTop: "1px solid var(--line)", textAlign: "right" } }, hkaWon(base), unit), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", borderTop: "1px solid var(--line)", textAlign: "right", fontWeight: 700, color: "var(--success)" } }, memberDiscount > 0 ? `${hkaWon(memberPrice(base))}${unit}` : "\u2014"));
  }), rooms.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", color: "var(--ink-3)" }, colSpan: 3 }, "\uAC1D\uC2E4\uC744 \uBA3C\uC800 \uB4F1\uB85D\uD558\uC138\uC694.")))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("h4", { style: { margin: 0 } }, "\uC694\uAE08 \uADDC\uCE59 (\uC2DC\uC98C\xB7\uACF5\uD734\uC77C\xB7\uD504\uB85C\uBAA8\uC158\xB7\uC694\uC77C)"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: () => setRule({ kind: "season", label: "", roomTypeId: "", startDate: "", endDate: "", dow: [], price: "", priority: 1, active: true }) }, "+ \uADDC\uCE59")), rule && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 10, display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC885\uB958", /* @__PURE__ */ React.createElement("select", { className: "field-input", value: rule.kind, onChange: (e) => setRule({ ...rule, kind: e.target.value }) }, /* @__PURE__ */ React.createElement("option", { value: "season" }, "\uC2DC\uC98C(\uC131\uC218\uAE30 \uB4F1)"), /* @__PURE__ */ React.createElement("option", { value: "holiday" }, "\uACF5\uD734\uC77C"), /* @__PURE__ */ React.createElement("option", { value: "promo" }, "\uD504\uB85C\uBAA8\uC158"), /* @__PURE__ */ React.createElement("option", { value: "dow" }, "\uC694\uC77C"))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC801\uC6A9 \uAC1D\uC2E4", /* @__PURE__ */ React.createElement("select", { className: "field-input", value: rule.roomTypeId || "", onChange: (e) => setRule({ ...rule, roomTypeId: e.target.value }) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\uC804\uCCB4 \uAC1D\uC2E4"), rooms.map((r) => /* @__PURE__ */ React.createElement("option", { key: r.id, value: r.id }, r.name)))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC801\uC6A9 \uC694\uAE08(\uC6D0)", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: rule.price, onChange: (e) => setRule({ ...rule, price: Number(e.target.value) }) }))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uB77C\uBCA8", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: rule.label, onChange: (e) => setRule({ ...rule, label: e.target.value }), placeholder: "\uC5EC\uB984 \uC131\uC218\uAE30" })), rule.kind === "dow" ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12 } }, "\uC801\uC6A9 \uC694\uC77C", /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 4 } }, HKA_WD.map((w, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i,
      type: "button",
      className: "btn btn-small",
      style: { background: (rule.dow || []).includes(i) ? "var(--secondary)" : "var(--bg)", color: (rule.dow || []).includes(i) ? "#fff" : "var(--ink)" },
      onClick: () => {
        const d = rule.dow || [];
        setRule({ ...rule, dow: d.includes(i) ? d.filter((x) => x !== i) : [...d, i] });
      }
    },
    w
  )))) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC2DC\uC791\uC77C", /* @__PURE__ */ React.createElement("input", { type: "date", className: "field-input", value: rule.startDate || "", onChange: (e) => setRule({ ...rule, startDate: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC885\uB8CC\uC77C", /* @__PURE__ */ React.createElement("input", { type: "date", className: "field-input", value: rule.endDate || "", onChange: (e) => setRule({ ...rule, endDate: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC6B0\uC120\uC21C\uC704", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: rule.priority, onChange: (e) => setRule({ ...rule, priority: Number(e.target.value) }) }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: saveRule }, "\uC800\uC7A5"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setRule(null) }, "\uCDE8\uC18C"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, rules.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, className: "card", style: { padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, fontSize: 13 } }, /* @__PURE__ */ React.createElement("span", { className: "badge" }, { season: "\uC2DC\uC98C", holiday: "\uACF5\uD734\uC77C", promo: "\uD504\uB85C\uBAA8\uC158", dow: "\uC694\uC77C" }[r.kind] || r.kind), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, r.label || "(\uB77C\uBCA8\uC5C6\uC74C)", " \xB7 ", r.kind === "dow" ? (r.dow || []).map((d) => HKA_WD[d]).join("") : `${r.startDate || ""}~${r.endDate || ""}`, " \xB7 ", /* @__PURE__ */ React.createElement("strong", null, hkaWon(r.price))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setRule(r) }, "\uC218\uC815"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => delRule(r) }, "\u2715"))), rules.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, "\uC694\uAE08 \uADDC\uCE59 \uC5C6\uC74C \u2014 \uAE30\uBCF8/\uC8FC\uB9D0 \uC694\uAE08\uB9CC \uC801\uC6A9\uB429\uB2C8\uB2E4."))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("h4", { style: { margin: 0 } }, "\uCFE0\uD3F0"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: () => setCoupon({ code: "", label: "", kind: "percent", value: 10, minAmount: 0, startsAt: "", expiresAt: "", active: true }) }, "+ \uCFE0\uD3F0")), coupon && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 10, display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uCF54\uB4DC", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: coupon.code, onChange: (e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() }), placeholder: "WELCOME10" })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC720\uD615", /* @__PURE__ */ React.createElement("select", { className: "field-input", value: coupon.kind, onChange: (e) => setCoupon({ ...coupon, kind: e.target.value }) }, /* @__PURE__ */ React.createElement("option", { value: "percent" }, "% \uD560\uC778"), /* @__PURE__ */ React.createElement("option", { value: "amount" }, "\uC815\uC561 \uD560\uC778"))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uAC12", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: coupon.value, onChange: (e) => setCoupon({ ...coupon, value: Number(e.target.value) }) }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uCD5C\uC18C \uAE08\uC561", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: coupon.minAmount, onChange: (e) => setCoupon({ ...coupon, minAmount: Number(e.target.value) }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC2DC\uC791\uC77C", /* @__PURE__ */ React.createElement("input", { type: "date", className: "field-input", value: coupon.startsAt || "", onChange: (e) => setCoupon({ ...coupon, startsAt: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uB9CC\uB8CC\uC77C", /* @__PURE__ */ React.createElement("input", { type: "date", className: "field-input", value: coupon.expiresAt || "", onChange: (e) => setCoupon({ ...coupon, expiresAt: e.target.value }) }))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uB77C\uBCA8", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: coupon.label, onChange: (e) => setCoupon({ ...coupon, label: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: saveCoupon }, "\uC800\uC7A5"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setCoupon(null) }, "\uCDE8\uC18C"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, coupons.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.code, className: "card", style: { padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, fontSize: 13 } }, /* @__PURE__ */ React.createElement("span", { className: "mono" }, /* @__PURE__ */ React.createElement("strong", null, c.code)), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, c.kind === "percent" ? `${c.value}%` : hkaWon(c.value), " ", c.label ? `\xB7 ${c.label}` : "", " ", c.active ? "" : "\xB7 (\uBE44\uD65C\uC131)"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setCoupon(c) }, "\uC218\uC815"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => delCoupon(c) }, "\u2715"))), coupons.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, "\uCFE0\uD3F0 \uC5C6\uC74C."))));
};
const HkaAvailability = () => {
  const [rooms, setRooms] = React.useState([]);
  const [roomId, setRoomId] = React.useState("");
  const [cursor, setCursor] = React.useState(hkaToday().slice(0, 7) + "-01");
  const [avail, setAvail] = React.useState({});
  const [form, setForm] = React.useState({ from: hkaToday(), to: hkaToday(), closed: false, qtyOverride: "", priceOverride: "" });
  React.useEffect(() => {
    window.BGNJ_HANGYEON.refreshRoomTypes({ includeAll: true }).then((r) => {
      setRooms(r);
      if (r[0]) setRoomId((id) => id || r[0].id);
    });
  }, []);
  const loadAvail = React.useCallback(() => {
    if (!roomId) return;
    window.BGNJ_HANGYEON.availability({ from: cursor, to: hkaAddDays(cursor, 42), roomTypeId: roomId }).then((res) => {
      const map = {};
      (res.availability && res.availability[roomId] || []).forEach((a) => {
        map[a.date] = a;
      });
      setAvail(map);
    });
  }, [roomId, cursor]);
  React.useEffect(() => {
    loadAvail();
  }, [loadAvail]);
  const apply = async () => {
    var _a;
    if (!roomId) {
      hkaFlash("\uAC1D\uC2E4\uC744 \uC120\uD0DD\uD558\uC138\uC694.", false);
      return;
    }
    try {
      await window.BGNJ_HANGYEON.setAvailability({ roomTypeId: roomId, from: form.from, to: form.to, closed: form.closed, qtyOverride: form.qtyOverride, priceOverride: form.priceOverride });
      loadAvail();
      hkaFlash("\uC801\uC6A9\uB428.");
    } catch (err) {
      hkaFlash(((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || "\uC2E4\uD328", false);
    }
  };
  const year = Number(cursor.slice(0, 4)), month = Number(cursor.slice(5, 7)) - 1;
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${cursor.slice(0, 8)}${String(d).padStart(2, "0")}`);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, margin: 0 } }, "\uB0A0\uC9DC\uBCC4 \uAC1D\uC2E4 \uC7AC\uACE0 / \uD310\uB9E4\uC911\uC9C0(\uC624\uBC84\uBD80\uD0B9 \uBC29\uC9C0) / \uC694\uAE08 \uC624\uBC84\uB77C\uC774\uB4DC. \uC794\uC5EC\uB294 \uC608\uC57D \uC2DC \uC790\uB3D9 \uCC28\uAC10\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, maxWidth: 280 } }, "\uAC1D\uC2E4", /* @__PURE__ */ React.createElement("select", { className: "field-input", value: roomId, onChange: (e) => setRoomId(e.target.value) }, rooms.map((r) => /* @__PURE__ */ React.createElement("option", { key: r.id, value: r.id }, r.name, " (", r.quantity, "\uC2E4)")))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 13 } }, "\uD310\uB9E4/\uC7AC\uACE0 \uC77C\uAD04 \uC124\uC815"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, alignItems: "end" } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC2DC\uC791", /* @__PURE__ */ React.createElement("input", { type: "date", className: "field-input", value: form.from, onChange: (e) => setForm({ ...form, from: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC885\uB8CC", /* @__PURE__ */ React.createElement("input", { type: "date", className: "field-input", value: form.to, onChange: (e) => setForm({ ...form, to: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: form.closed, onChange: (e) => setForm({ ...form, closed: e.target.checked }) }), "\uD310\uB9E4\uC911\uC9C0"), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC7AC\uACE0 \uC870\uC815", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: form.qtyOverride, onChange: (e) => setForm({ ...form, qtyOverride: e.target.value }), placeholder: "\uAE30\uBCF8" })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC694\uAE08 \uC870\uC815", /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", value: form.priceOverride, onChange: (e) => setForm({ ...form, priceOverride: e.target.value }), placeholder: "\uAE30\uBCF8" }))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", style: { alignSelf: "flex-start" }, onClick: apply }, "\uAD6C\uAC04 \uC801\uC6A9")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setCursor(`${new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 8)}01`) }, "\u2039"), /* @__PURE__ */ React.createElement("strong", null, year, "\uB144 ", month + 1, "\uC6D4"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setCursor(`${new Date(Date.UTC(year, month + 1, 1)).toISOString().slice(0, 8)}01`) }, "\u203A")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 } }, HKA_WD.map((w) => /* @__PURE__ */ React.createElement("div", { key: w, className: "mono dim-2", style: { textAlign: "center", fontSize: 10 } }, w)), cells.map((date, i) => {
    if (!date) return /* @__PURE__ */ React.createElement("div", { key: `e${i}` });
    const a = avail[date];
    return /* @__PURE__ */ React.createElement("div", { key: date, style: { aspectRatio: "1", border: "1px solid var(--line)", borderRadius: 6, padding: 3, fontSize: 11, background: (a == null ? void 0 : a.closed) ? "rgba(220,38,38,0.08)" : "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", null, Number(date.slice(8))), a && (a.closed ? /* @__PURE__ */ React.createElement("span", { style: { color: "var(--danger)", fontSize: 9 } }, "\uC911\uC9C0") : /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 9 } }, a.remaining, "/", a.qty)));
  }))));
};
const HkaBookingDetail = ({ booking, onClose, onChanged }) => {
  const [b, setB] = React.useState(booking);
  const [log, setLog] = React.useState([]);
  const [payments, setPayments] = React.useState([]);
  const [pay, setPay] = React.useState({ amount: "", method: "bank", memo: "" });
  const reloadSub = () => {
    window.BGNJ_HANGYEON.bookingLog(b.id).then(setLog);
    window.BGNJ_HANGYEON.payments(b.id).then(setPayments);
  };
  React.useEffect(() => {
    reloadSub();
  }, [b.id]);
  const patch = async (p) => {
    var _a;
    try {
      await window.BGNJ_HANGYEON.patchBooking(b.id, p);
      setB({ ...b, ...p });
      onChanged && onChanged();
      reloadSub();
      hkaFlash("\uBCC0\uACBD\uB428.");
    } catch (err) {
      hkaFlash(((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || "\uC2E4\uD328", false);
    }
  };
  const addPay = async () => {
    var _a;
    const amt = Number(pay.amount);
    if (!amt) {
      hkaFlash("\uAE08\uC561 \uC785\uB825", false);
      return;
    }
    try {
      const r = await window.BGNJ_HANGYEON.addPayment(b.id, { amount: amt, method: pay.method, memo: pay.memo });
      setB({ ...b, paidAmount: r.paidAmount, paymentStatus: r.paymentStatus });
      setPay({ amount: "", method: "bank", memo: "" });
      onChanged && onChanged();
      reloadSub();
      hkaFlash("\uAE30\uB85D\uB428.");
    } catch (err) {
      hkaFlash(((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || "\uC2E4\uD328", false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", onClick: onClose, style: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1e3, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "32px 16px" } }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), className: "card", style: { maxWidth: 560, width: "100%", padding: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, b.code), " ", /* @__PURE__ */ React.createElement("strong", { style: { marginLeft: 8 } }, b.roomTypeName)), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: onClose, style: { background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--ink-3)" } }, "\u2715")), /* @__PURE__ */ React.createElement("div", { style: { padding: 20, display: "flex", flexDirection: "column", gap: 14, fontSize: 13 } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "10px 14px", background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("div", null, b.name, " \xB7 ", b.phone, " ", b.email ? `\xB7 ${b.email}` : ""), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4 } }, hkaDate(b.checkIn), " \u2192 ", hkaDate(b.checkOut), " \xB7 ", b.nights, "\uBC15 ", b.rooms, "\uC2E4 ", b.guests, "\uBA85 \xB7 ", /* @__PURE__ */ React.createElement("strong", null, hkaWon(b.totalPrice))), b.guestRequest && /* @__PURE__ */ React.createElement("div", { className: "dim", style: { marginTop: 4 } }, "\uC694\uCCAD: ", b.guestRequest)), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC608\uC57D \uC0C1\uD0DC", /* @__PURE__ */ React.createElement("select", { className: "field-input", value: b.status, onChange: (e) => patch({ status: e.target.value }) }, Object.keys(HKA_STATUS).map((k) => /* @__PURE__ */ React.createElement("option", { key: k, value: k }, HKA_STATUS[k])))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uACB0\uC81C \uC0C1\uD0DC", /* @__PURE__ */ React.createElement("select", { className: "field-input", value: b.paymentStatus, onChange: (e) => patch({ paymentStatus: e.target.value }) }, Object.keys(HKA_PAY).map((k) => /* @__PURE__ */ React.createElement("option", { key: k, value: k }, HKA_PAY[k]))))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uAC1D\uC2E4 \uBC30\uC815", /* @__PURE__ */ React.createElement("input", { className: "field-input", defaultValue: b.roomAssignment, onBlur: (e) => e.target.value !== b.roomAssignment && patch({ roomAssignment: e.target.value }), placeholder: "101\uD638" })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uCCAD\uC18C/\uC6B4\uC601 \uBA54\uBAA8", /* @__PURE__ */ React.createElement("input", { className: "field-input", defaultValue: b.housekeeping, onBlur: (e) => e.target.value !== b.housekeeping && patch({ housekeeping: e.target.value }) }))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uAD00\uB9AC\uC790 \uBA54\uBAA8", /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 2, defaultValue: b.memo, onBlur: (e) => e.target.value !== b.memo && patch({ memo: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("strong", null, "\uACB0\uC81C \xB7 ", HKA_PAY[b.paymentStatus]), /* @__PURE__ */ React.createElement("span", null, "\uC785\uAE08 ", hkaWon(b.paidAmount), " / ", hkaWon(b.totalPrice))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "end", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("input", { type: "number", className: "field-input", style: { width: 110 }, placeholder: "\uAE08\uC561(\uD658\uBD88 -)", value: pay.amount, onChange: (e) => setPay({ ...pay, amount: e.target.value }) }), /* @__PURE__ */ React.createElement("select", { className: "field-input", style: { width: 90 }, value: pay.method, onChange: (e) => setPay({ ...pay, method: e.target.value }) }, /* @__PURE__ */ React.createElement("option", { value: "bank" }, "\uBB34\uD1B5\uC7A5"), /* @__PURE__ */ React.createElement("option", { value: "cash" }, "\uD604\uC7A5"), /* @__PURE__ */ React.createElement("option", { value: "onsite" }, "\uAE30\uD0C0")), /* @__PURE__ */ React.createElement("input", { className: "field-input", style: { flex: 1, minWidth: 100 }, placeholder: "\uBA54\uBAA8", value: pay.memo, onChange: (e) => setPay({ ...pay, memo: e.target.value }) }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: addPay }, "\uAE30\uB85D")), payments.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 12 } }, payments.map((p) => /* @__PURE__ */ React.createElement("div", { key: p.id, className: "dim-2" }, "\xB7 ", p.kind === "refund" ? "\uD658\uBD88" : "\uC785\uAE08", " ", hkaWon(p.amount), " (", p.method, ") ", p.memo)))), log.length > 0 && /* @__PURE__ */ React.createElement("details", null, /* @__PURE__ */ React.createElement("summary", { style: { cursor: "pointer", fontSize: 12 } }, "\uC608\uC57D \uC774\uB825 (", log.length, ")"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, fontSize: 11 } }, log.map((l) => /* @__PURE__ */ React.createElement("div", { key: l.id, className: "dim-2" }, "\xB7 [", (l.createdAt || "").slice(5, 16), "] ", l.action, ": ", l.detail, " (", l.actor, ")")))))));
};
const HkaBookings = () => {
  const [bookings, setBookings] = React.useState([]);
  const [status, setStatus] = React.useState("");
  const [detail, setDetail] = React.useState(null);
  const reload = () => window.BGNJ_HANGYEON.adminBookings(status ? { status } : {}).then(setBookings);
  React.useEffect(() => {
    reload();
  }, [status]);
  const th = { textAlign: "left", padding: "10px 10px", fontSize: 12, color: "var(--ink-3)", fontWeight: 600, whiteSpace: "nowrap" };
  const td = { padding: "10px 10px", fontSize: 13, borderTop: "1px solid var(--line)", verticalAlign: "middle" };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", style: { background: !status ? "var(--secondary)" : "var(--bg)", color: !status ? "#fff" : "var(--ink)" }, onClick: () => setStatus("") }, "\uC804\uCCB4"), Object.keys(HKA_STATUS).map((k) => /* @__PURE__ */ React.createElement("button", { key: k, type: "button", className: "btn btn-small", style: { background: status === k ? HKA_STATUS_COLOR[k] : "var(--bg)", color: status === k ? "#fff" : "var(--ink)", borderColor: HKA_STATUS_COLOR[k] }, onClick: () => setStatus(k) }, HKA_STATUS[k])), /* @__PURE__ */ React.createElement("span", { className: "dim-2", style: { fontSize: 12, marginLeft: "auto" } }, bookings.length, "\uAC74")), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", minWidth: 720 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("th", { style: th }, "\uC608\uC57D\uBC88\uD638"), /* @__PURE__ */ React.createElement("th", { style: th }, "\uC608\uC57D\uC790"), /* @__PURE__ */ React.createElement("th", { style: th }, "\uAC1D\uC2E4"), /* @__PURE__ */ React.createElement("th", { style: th }, "\uC77C\uC815"), /* @__PURE__ */ React.createElement("th", { style: { ...th, textAlign: "center" } }, "\uC778\uC6D0"), /* @__PURE__ */ React.createElement("th", { style: { ...th, textAlign: "right" } }, "\uAE08\uC561"), /* @__PURE__ */ React.createElement("th", { style: { ...th, textAlign: "center" } }, "\uC608\uC57D \uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("th", { style: { ...th, textAlign: "center" } }, "\uACB0\uC81C"))), /* @__PURE__ */ React.createElement("tbody", null, bookings.map((b) => /* @__PURE__ */ React.createElement(
    "tr",
    {
      key: b.id,
      onClick: () => setDetail(b),
      style: { cursor: "pointer" },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "var(--bg-2)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "transparent";
      }
    },
    /* @__PURE__ */ React.createElement("td", { style: { ...td, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" } }, b.code),
    /* @__PURE__ */ React.createElement("td", { style: td }, /* @__PURE__ */ React.createElement("strong", null, b.name), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11 } }, b.phone)),
    /* @__PURE__ */ React.createElement("td", { style: td }, b.roomTypeName),
    /* @__PURE__ */ React.createElement("td", { style: { ...td, whiteSpace: "nowrap" } }, b.bookingUnit === "hourly" ? `${hkaDate(b.checkIn)} ${b.slotStart || ""}` : `${hkaDate(b.checkIn)}~${hkaDate(b.checkOut)} (${b.nights}\uBC15)`),
    /* @__PURE__ */ React.createElement("td", { style: { ...td, textAlign: "center" } }, b.guests),
    /* @__PURE__ */ React.createElement("td", { style: { ...td, textAlign: "right", fontWeight: 600 } }, hkaWon(b.totalPrice)),
    /* @__PURE__ */ React.createElement("td", { style: { ...td, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, color: "#fff", background: HKA_STATUS_COLOR[b.status] || "var(--ink-3)" } }, HKA_STATUS[b.status] || b.status)),
    /* @__PURE__ */ React.createElement("td", { style: { ...td, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: "var(--line)" } }, HKA_PAY[b.paymentStatus]))
  )), bookings.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { style: { ...td, textAlign: "center", color: "var(--ink-3)" }, colSpan: 8 }, "\uC608\uC57D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."))))), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 10 } }, "\uD589\uC744 \uD074\uB9AD\uD558\uBA74 \uC0C1\uC138(\uC0C1\uD0DC \uBCC0\uACBD\xB7\uC785\uAE08 \uAE30\uB85D\xB7\uC774\uB825)\uB97C \uBCFC \uC218 \uC788\uC2B5\uB2C8\uB2E4."), detail && /* @__PURE__ */ React.createElement(HkaBookingDetail, { booking: detail, onClose: () => setDetail(null), onChanged: reload }));
};
const HkaGuests = () => {
  const [guests, setGuests] = React.useState([]);
  const reload = () => window.BGNJ_HANGYEON.guests().then(setGuests);
  React.useEffect(() => {
    reload();
  }, []);
  const toggle = async (g, field) => {
    await window.BGNJ_HANGYEON.patchGuest(g.id, { [field]: !g[field] });
    reload();
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, "\uD22C\uC219\uAC1D \uC815\uBCF4 \xB7 \uBC29\uBB38 \uD69F\uC218 \xB7 VIP \xB7 \uBE14\uB799\uB9AC\uC2A4\uD2B8. (\uC608\uC57D \uC2DC \uC790\uB3D9 \uC801\uB9BD, \uCCB4\uD06C\uC544\uC6C3 \uC2DC \uBC29\uBB38 +1)"), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "10px 14px", background: "var(--bg-2)", fontSize: 12, marginBottom: 12 } }, "\u24D8 ", /* @__PURE__ */ React.createElement("strong", null, "\uACE0\uAC1D \uAC1C\uC778\uC815\uBCF4\uB294 \uC218\uC9D1\uC77C\uB85C\uBD80\uD130 1\uB144\uAC04\uB9CC \uBCF4\uAD00"), "\uD55C \uB4A4 \uD30C\uAE30\uD569\uB2C8\uB2E4. (\uC608\uC57D\xB7\uBB38\uC758 \uCC98\uB9AC \uBAA9\uC801) \u2014 \uC190\uB2D8\uC5D0\uAC8C\uB3C4 \uC608\uC57D \uC2DC \uC548\uB0B4\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, guests.map((g) => /* @__PURE__ */ React.createElement("div", { key: g.id, className: "card", style: { padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, fontSize: 13 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("strong", null, g.name || "(\uC774\uB984\uC5C6\uC74C)"), " ", g.vip ? /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: "var(--primary)", color: "var(--primary-active)" } }, "VIP") : null, " ", g.blacklist ? /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: "var(--danger)", color: "var(--danger)" } }, "\uBE14\uB799") : null, /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12 } }, g.phone, " ", g.email ? `\xB7 ${g.email}` : "", " \xB7 \uBC29\uBB38 ", g.visits, "\uD68C")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => toggle(g, "vip") }, g.vip ? "VIP \uD574\uC81C" : "VIP"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", style: { color: g.blacklist ? "var(--ink)" : "var(--danger)" }, onClick: () => toggle(g, "blacklist") }, g.blacklist ? "\uBE14\uB799\uD574\uC81C" : "\uBE14\uB799\uB9AC\uC2A4\uD2B8"))), guests.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim" }, "\uACE0\uAC1D \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")));
};
const HkaPayments = () => {
  const [bookings, setBookings] = React.useState([]);
  React.useEffect(() => {
    window.BGNJ_HANGYEON.adminBookings().then(setBookings);
  }, []);
  const active = bookings.filter((b) => !["cancelled", "no_show"].includes(b.status));
  const totalDue = active.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const totalPaid = active.reduce((s, b) => s + (b.paidAmount || 0), 0);
  const byPay = { unpaid: 0, partial: 0, paid: 0, refunded: 0 };
  active.forEach((b) => {
    byPay[b.paymentStatus] = (byPay[b.paymentStatus] || 0) + 1;
  });
  const card = (label, val) => /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "14px 18px", flex: 1, minWidth: 140 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10 } }, label), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 22, fontWeight: 700 } }, val));
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, margin: 0 } }, "\uC815\uC0B0 \uC694\uC57D (\uCDE8\uC18C\xB7\uB178\uC1FC \uC81C\uC678). \uAC1C\uBCC4 \uC785\uAE08/\uD658\uBD88\uC740 \uC608\uC57D \uC0C1\uC138\uC5D0\uC11C \uAE30\uB85D\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, card("\uCD1D \uC608\uC57D \uAE08\uC561", hkaWon(totalDue)), card("\uC785\uAE08 \uB204\uACC4", hkaWon(totalPaid)), card("\uBBF8\uC218\uAE08", hkaWon(Math.max(0, totalDue - totalPaid)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, card("\uBBF8\uACB0\uC81C", `${byPay.unpaid}\uAC74`), card("\uBD80\uBD84\uACB0\uC81C", `${byPay.partial}\uAC74`), card("\uACB0\uC81C\uC644\uB8CC", `${byPay.paid}\uAC74`), card("\uD658\uBD88\uC644\uB8CC", `${byPay.refunded}\uAC74`)));
};
const HKA_UNIT = { vacant: "\uACF5\uC2E4", occupied: "\uD22C\uC219\uC911", cleaning: "\uCCAD\uC18C\uC911", maintenance: "\uC810\uAC80\uC911" };
const HKA_UNIT_COLOR = { vacant: "var(--ink-3)", occupied: "var(--success)", cleaning: "var(--warning)", maintenance: "var(--danger)" };
const HkaOperation = () => {
  const [units, setUnits] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const [adding, setAdding] = React.useState(null);
  const today = hkaToday();
  const reload = () => {
    window.BGNJ_HANGYEON.units().then(setUnits);
    window.BGNJ_HANGYEON.refreshRoomTypes({ includeAll: true }).then(setRooms);
    window.BGNJ_HANGYEON.adminBookings().then(setBookings);
  };
  React.useEffect(() => {
    reload();
  }, []);
  const setStatus = async (u, status) => {
    await window.BGNJ_HANGYEON.updateUnit(u.id, { status });
    reload();
  };
  const addUnit = async () => {
    if (!adding.unitNo.trim()) return;
    await window.BGNJ_HANGYEON.createUnit(adding);
    setAdding(null);
    reload();
  };
  const delUnit = async (u) => {
    if (!await window.BGNJ_CONFIRM(`${u.unitNo} \uC0AD\uC81C?`, { danger: true })) return;
    await window.BGNJ_HANGYEON.deleteUnit(u.id);
    reload();
  };
  const todayIn = bookings.filter((b) => b.checkIn === today && !["cancelled", "no_show"].includes(b.status));
  const todayOut = bookings.filter((b) => b.checkOut === today && !["cancelled", "no_show"].includes(b.status));
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, flex: 1, minWidth: 220 } }, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 13 } }, "\uC624\uB298 \uCCB4\uD06C\uC778 (", todayIn.length, ")"), todayIn.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.id, className: "dim-2", style: { fontSize: 12, marginTop: 4 } }, b.name, " \xB7 ", b.roomTypeName, " ", b.roomAssignment ? `(${b.roomAssignment})` : "")), todayIn.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, margin: "4px 0 0" } }, "\uC5C6\uC74C")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, flex: 1, minWidth: 220 } }, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 13 } }, "\uC624\uB298 \uCCB4\uD06C\uC544\uC6C3 (", todayOut.length, ")"), todayOut.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.id, className: "dim-2", style: { fontSize: 12, marginTop: 4 } }, b.name, " \xB7 ", b.roomTypeName, " ", b.roomAssignment ? `(${b.roomAssignment})` : "")), todayOut.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, margin: "4px 0 0" } }, "\uC5C6\uC74C"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("h4", { style: { margin: 0 } }, "\uAC1D\uC2E4 \uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: () => {
    var _a;
    return setAdding({ roomTypeId: ((_a = rooms[0]) == null ? void 0 : _a.id) || "", unitNo: "", status: "vacant", note: "" });
  } }, "+ \uAC1D\uC2E4 \uB2E8\uC704")), adding && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 12, marginBottom: 10, display: "flex", gap: 8, alignItems: "end", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uAC1D\uC2E4\uD0C0\uC785", /* @__PURE__ */ React.createElement("select", { className: "field-input", value: adding.roomTypeId, onChange: (e) => setAdding({ ...adding, roomTypeId: e.target.value }) }, rooms.map((r) => /* @__PURE__ */ React.createElement("option", { key: r.id, value: r.id }, r.name)))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uD638\uC2E4", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: adding.unitNo, onChange: (e) => setAdding({ ...adding, unitNo: e.target.value }), placeholder: "101" })), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: addUnit }, "\uCD94\uAC00"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setAdding(null) }, "\uCDE8\uC18C")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 8 } }, units.map((u) => /* @__PURE__ */ React.createElement("div", { key: u.id, className: "card", style: { padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("strong", null, u.unitNo || "(\uD638\uC2E4)"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => delUnit(u), style: { padding: "2px 6px" } }, "\u2715")), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, marginBottom: 6 } }, u.roomTypeName), /* @__PURE__ */ React.createElement("span", { className: "badge", style: { borderColor: HKA_UNIT_COLOR[u.status], color: HKA_UNIT_COLOR[u.status] } }, HKA_UNIT[u.status] || u.status), /* @__PURE__ */ React.createElement("select", { className: "field-input", style: { marginTop: 6, fontSize: 12 }, value: u.status, onChange: (e) => setStatus(u, e.target.value) }, Object.keys(HKA_UNIT).map((k) => /* @__PURE__ */ React.createElement("option", { key: k, value: k }, HKA_UNIT[k]))))), units.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, "\uB4F1\uB85D\uB41C \uAC1D\uC2E4 \uB2E8\uC704\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."))));
};
const HkaProperty = () => {
  const init = () => {
    var _a, _b, _c, _d;
    const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
    const h = sc.hangyeon || {};
    return { name: h.name || "\uC804\uC8FC\uD55C\uCF20", tagline: h.tagline || "", desc: h.desc || "", address: h.address || "", lat: (_c = h.lat) != null ? _c : "", lng: (_d = h.lng) != null ? _d : "", directions: h.directions || "", notice: h.notice || "", images: Array.isArray(h.images) ? h.images : [] };
  };
  const [form, setForm] = React.useState(init);
  const up = (patch) => setForm((f) => ({ ...f, ...patch }));
  const save = async () => {
    var _a;
    try {
      await window.BGNJ_SITE_CONTENT.saveSection("hangyeon", form);
      hkaFlash("\uC219\uC18C \uC815\uBCF4 \uC800\uC7A5\uB428.");
    } catch (err) {
      hkaFlash(((_a = err == null ? void 0 : err.body) == null ? void 0 : _a.error) || (err == null ? void 0 : err.message) || "\uC800\uC7A5 \uC2E4\uD328", false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, margin: 0 } }, "\uC190\uB2D8\uC774 \uBCF4\uB294 \uD55C\uCF20 \uC18C\uAC1C \uD398\uC774\uC9C0(\uC790\uACE0 \uB180\uC790) \uB0B4\uC6A9\uC785\uB2C8\uB2E4. \uC0AC\uC9C4\uC740 \uC5C6\uC5B4\uB3C4 \uC608\uC57D\uC740 \uC815\uC0C1 \uB3D9\uC791\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC219\uC18C \uC774\uB984", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: form.name, onChange: (e) => up({ name: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uD55C \uC904 \uC18C\uAC1C(\uD0DC\uADF8\uB77C\uC778)", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: form.tagline, onChange: (e) => up({ tagline: e.target.value }), placeholder: "\uC804\uC8FC \uB3C4\uC2EC \uC18D, \uC870\uC6A9\uD55C \uD558\uB8FB\uBC24" }))), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC18C\uAC1C\uAE00", /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 3, value: form.desc, onChange: (e) => up({ desc: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC8FC\uC18C", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: form.address, onChange: (e) => up({ address: e.target.value }), placeholder: "\uC804\uBD81 \uC804\uC8FC\uC2DC \uB355\uC9C4\uAD6C \uD314\uB2EC\uB85C 340-37" })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC9C0\uB3C4 \uC704\uB3C4(lat)", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: form.lat, onChange: (e) => up({ lat: e.target.value }), placeholder: "35.8313", inputMode: "decimal" })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC9C0\uB3C4 \uACBD\uB3C4(lng)", /* @__PURE__ */ React.createElement("input", { className: "field-input", value: form.lng, onChange: (e) => up({ lng: e.target.value }), placeholder: "127.1386", inputMode: "decimal" }))), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 11, margin: "-6px 0 0", lineHeight: 1.6 } }, "\uC190\uB2D8 \uD398\uC774\uC9C0 \uC704\uCE58/\uAD50\uD1B5\uC758 OpenStreetMap \uD540 \uC704\uCE58\uC785\uB2C8\uB2E4. openstreetmap.org\uC5D0\uC11C \uC815\uD655\uD55C \uAC74\uBB3C\uC744 \uC6B0\uD074\uB9AD \u2192 \u201C\uC774 \uC704\uCE58 \uD45C\uC2DC\u201D \uC2DC \uC8FC\uC18C\uCC3D URL\uC758 ", /* @__PURE__ */ React.createElement("code", null, "mlat"), "\xB7", /* @__PURE__ */ React.createElement("code", null, "mlon"), " \uAC12\uC744 \uADF8\uB300\uB85C \uB123\uC73C\uC138\uC694. \uBE44\uC6CC\uB450\uBA74 \uD314\uB2EC\uB85C \uAE30\uC900\uC73C\uB85C \uD45C\uC2DC\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uCC3E\uC544\uAC00\uB294 \uAE38", /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 3, value: form.directions, onChange: (e) => up({ directions: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12 } }, "\uC548\uB0B4/\uACF5\uC9C0(\uC120\uD0DD)", /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 2, value: form.notice, onChange: (e) => up({ notice: e.target.value }), placeholder: "\uC785\uC2E4 15:00 / \uD1F4\uC2E4 11:00 \uB4F1" })), window.MediaGalleryEditor && /* @__PURE__ */ React.createElement(window.MediaGalleryEditor, { value: form.images, onChange: (imgs) => up({ images: imgs }), folder: "hangyeon", label: "\uC219\uC18C \uB300\uD45C \uC0AC\uC9C4 (\uC120\uD0DD)", helpText: "\uC5C6\uC5B4\uB3C4 \uC608\uC57D\uC740 \uAC00\uB2A5\uD569\uB2C8\uB2E4.", max: 10 }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", style: { alignSelf: "flex-start" }, onClick: save }, "\uC219\uC18C \uC815\uBCF4 \uC800\uC7A5"));
};
const HK_TABS = [
  ["\uB300\uC2DC\uBCF4\uB4DC", HkaOperation],
  ["\uC219\uC18C \uAD00\uB9AC", HkaProperty],
  ["\uAC1D\uC2E4 \uAD00\uB9AC", HkaRoomTypes],
  ["\uD504\uB85C\uBAA8\uC158", HkaRates],
  ["\uC608\uC57D\uD604\uD669", HkaAvailability],
  ["\uC608\uC57D", HkaBookings],
  ["\uACE0\uAC1D", HkaGuests],
  ["\uACB0\uC81C", HkaPayments]
];
const HangyeonAdminPanel = () => {
  const [tab, setTab] = React.useState("\uB300\uC2DC\uBCF4\uB4DC");
  const Active = (HK_TABS.find((t) => t[0] === tab) || HK_TABS[0])[1];
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 14, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uD55C\uCF20 \uC608\uC57D \uAD00\uB9AC (PMS)"), " \u2014 \uC804\uC8FC \uC219\uC18C. \uB300\uC2DC\uBCF4\uB4DC\xB7\uC219\uC18C\xB7\uAC1D\uC2E4\xB7\uD504\uB85C\uBAA8\uC158\xB7\uC608\uC57D\uD604\uD669\xB7\uC608\uC57D\xB7\uACE0\uAC1D\xB7\uACB0\uC81C \uD1B5\uD569 \uAD00\uB9AC. \uB370\uC774\uD130\uB294 D1 \uC11C\uBC84 \uC800\uC7A5."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18, borderBottom: "1px solid var(--line)", paddingBottom: 12 } }, HK_TABS.map(([name]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: name,
      type: "button",
      className: "btn btn-small",
      style: { background: tab === name ? "var(--secondary)" : "var(--bg)", color: tab === name ? "#fff" : "var(--ink)" },
      onClick: () => setTab(name)
    },
    name
  ))), /* @__PURE__ */ React.createElement(Active, null));
};
Object.assign(window, { HangyeonAdminPanel });

})();

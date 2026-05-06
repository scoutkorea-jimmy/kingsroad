(function(){
const RecommendationsAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const items = React.useMemo(() => Array.isArray(sc.recommendations) ? sc.recommendations : [], [sc]);
  const [draft, setDraft] = React.useState(items);
  React.useEffect(() => {
    setDraft(items);
  }, [items.length, tick]);
  const [msg, setMsg] = React.useState("");
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2e3);
  };
  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const setItem = (idx, patch) => setDraft((arr) => arr.map((it, i) => i === idx ? { ...it, ...patch } : it));
  const addItem = () => setDraft((arr) => [...arr, {
    id: `rec-${Date.now()}`,
    region: "",
    name: "",
    subtitle: "",
    desc: "",
    tags: "",
    imageDataUri: ""
  }]);
  const removeItem = (idx) => {
    if (!confirm("\uC774 \uCD94\uCC9C\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?")) return;
    setDraft((arr) => arr.filter((_, i) => i !== idx));
  };
  const moveItem = (idx, dir) => {
    setDraft((arr) => {
      const next = arr.slice();
      const j = idx + dir;
      if (j < 0 || j >= next.length) return next;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };
  const onPickImage = async (idx, e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    e.target.value = "";
    if (!file) return;
    try {
      const { url } = await window.BGNJ_MEDIA.uploadFile(file, { folder: "recommendations", maxBytes: 5 * 1024 * 1024 });
      setItem(idx, { imageDataUri: url });
      return;
    } catch (err) {
      console.warn("[v00.084] R2 \uCD94\uCC9C \uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC \uC2E4\uD328 \u2014 dataURI \uD3F4\uBC31:", err);
    }
    if (file.size > 1.5 * 1024 * 1024) {
      alert(`\uC774\uBBF8\uC9C0\uAC00 \uB108\uBB34 \uD07D\uB2C8\uB2E4(${(file.size / 1024 / 1024).toFixed(1)}MB). R2 \uC2E4\uD328 + 1.5MB \uD3F4\uBC31 \uD55C\uB3C4 \uCD08\uACFC.`);
      return;
    }
    const dataUri = await fileToDataUri(file);
    setItem(idx, { imageDataUri: dataUri });
  };
  const save = async () => {
    const cleaned = draft.map((it) => ({
      id: it.id || `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      region: String(it.region || "").trim(),
      name: String(it.name || "").trim(),
      subtitle: String(it.subtitle || "").trim(),
      desc: String(it.desc || "").trim(),
      tags: String(it.tags || "").trim(),
      imageDataUri: it.imageDataUri || ""
    })).filter((it) => it.name);
    try {
      await window.BGNJ_SITE_CONTENT.saveSection("recommendations", cleaned);
      setTick((v) => v + 1);
      flash(`${cleaned.length}\uAC1C \uCD94\uCC9C\uC774 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`);
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "14px 18px", background: "var(--bg-2)", borderLeft: "3px solid var(--primary-dim)" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, lineHeight: 1.75, margin: 0, color: "var(--ink-2)" } }, "\u24D8 \uD648\uD398\uC774\uC9C0 ", /* @__PURE__ */ React.createElement("strong", null, "\uBC45\uAE30\uB178\uC790 \uCD94\uCC9C"), " \uC139\uC158\uC5D0 \uB178\uCD9C\uB420 \uC5EC\uD589\uC9C0\uB97C \uAD00\uB9AC\uD569\uB2C8\uB2E4. \uBE48 \uBC30\uC5F4\uC774\uBA74 \uC139\uC158\uC774 \uB178\uCD9C\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uC774\uBBF8\uC9C0\uB294 1.5MB \uC774\uD558 \uAD8C\uC7A5(\uAC00\uB85C\uD615 \uC0AC\uC9C4\uC774 \uCE74\uB4DC\uC5D0 \uC798 \uC5B4\uC6B8\uB9BD\uB2C8\uB2E4). \uD0DC\uADF8\uB294 \uC27C\uD45C(,) \uB610\uB294 \uAC00\uC6B4\uB383\uC810(\xB7)\uC73C\uB85C \uAD6C\uBD84.")), msg && /* @__PURE__ */ React.createElement("div", { role: "status", className: "card", style: { padding: "10px 14px", background: "rgba(245,213,72,0.10)", border: "1px solid var(--primary-dim)", color: "var(--secondary)", fontSize: 13 } }, msg), draft.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 32, textAlign: "center", color: "var(--ink-2)" } }, "\uB4F1\uB85D\uB41C \uCD94\uCC9C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798 \uBC84\uD2BC\uC73C\uB85C \uCCAB \uCD94\uCC9C\uC744 \uCD94\uAC00\uD574 \uC8FC\uC138\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 14 } }, draft.map((it, idx) => /* @__PURE__ */ React.createElement("article", { key: it.id || idx, className: "card", style: { padding: 16, display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 16, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 120,
    height: 90,
    border: "1px solid var(--line)",
    background: it.imageDataUri ? `url(${it.imageDataUri}) center/cover` : "var(--bg-3)",
    display: "grid",
    placeItems: "center"
  } }, !it.imageDataUri && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 9, color: "var(--ink-3)", letterSpacing: "0.18em" } }, "NO IMAGE")), /* @__PURE__ */ React.createElement("label", { className: "btn btn-small", style: { cursor: "pointer", textAlign: "center" } }, "\uC5C5\uB85C\uB4DC", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", style: { display: "none" }, onChange: (e) => onPickImage(idx, e) })), it.imageDataUri && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", style: { fontSize: 11, color: "var(--danger)" }, onClick: () => setItem(idx, { imageDataUri: "" }) }, "\uC774\uBBF8\uC9C0 \uC81C\uAC70")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }, className: "member-act-grid" }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC9C0\uC5ED (\uC608: \uC218\uB3C4\uAD8C)"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: it.region || "", onChange: (e) => setItem(idx, { region: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC81C\uBAA9 (\uC608: \uC11C\uC6B8)"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: it.name || "", onChange: (e) => setItem(idx, { name: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uBD80\uC81C (\uC608: \uAD81\uAD90\uACFC \uACE8\uBAA9\uC758 \uB3C4\uC2DC)"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: it.subtitle || "", onChange: (e) => setItem(idx, { subtitle: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uC124\uBA85"), /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 2, value: it.desc || "", onChange: (e) => setItem(idx, { desc: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, "\uD0DC\uADF8 (\uC27C\uD45C \uB610\uB294 \uAC00\uC6B4\uB383\uC810\uC73C\uB85C \uAD6C\uBD84 \u2014 \uC608: \uAD81\uAD90, \uD55C\uC625, \uC5ED\uC0AC)"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: it.tags || "", onChange: (e) => setItem(idx, { tags: e.target.value }) }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, alignItems: "stretch" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", disabled: idx === 0, onClick: () => moveItem(idx, -1), "aria-label": "\uC704\uB85C" }, "\u2191"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", disabled: idx === draft.length - 1, onClick: () => moveItem(idx, 1), "aria-label": "\uC544\uB798\uB85C" }, "\u2193"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", style: { color: "var(--danger)", borderColor: "var(--danger)" }, onClick: () => removeItem(idx) }, "\uC0AD\uC81C"))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: addItem }, "\uFF0B \uC0C8 \uCD94\uCC9C \uCD94\uAC00"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setDraft(items) }, "\uBCC0\uACBD \uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: save }, "\uC804\uCCB4 \uC800\uC7A5 (", draft.length, "\uAC1C)"))));
};
const TPE_RowActions = ({ i, total, onMove, onRemove }) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", disabled: i === 0, onClick: () => onMove(i, -1), "aria-label": "\uC704\uB85C", title: "\uC704\uB85C", style: { padding: "6px 10px", fontSize: 13 } }, "\u2191"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", disabled: i === total - 1, onClick: () => onMove(i, 1), "aria-label": "\uC544\uB798\uB85C", title: "\uC544\uB798\uB85C", style: { padding: "6px 10px", fontSize: 13 } }, "\u2193"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => onRemove(i), "aria-label": "\uC0AD\uC81C", title: "\uC0AD\uC81C", style: { padding: "6px 10px", fontSize: 11, borderColor: "var(--danger)", color: "var(--danger)" } }, "\u2715"));
const _parseTimeLabel = (label) => {
  const s = String(label || "").trim();
  const hMatch = s.match(/(\d+)\s*h/i);
  const mMatch = s.match(/(\d+)\s*m(?!s)/i);
  return {
    h: hMatch ? Number(hMatch[1]) : 0,
    m: mMatch ? Number(mMatch[1]) : 0
  };
};
const _formatTimeLabel = (h, m) => {
  const hi = Math.max(0, Math.min(99, Number(h) || 0));
  const mi = Math.max(0, Math.min(59, Number(m) || 0));
  return `${hi}h ${String(mi).padStart(2, "0")}m`;
};
const TPE_TimeInput = ({ value, onChange }) => {
  const { h, m } = _parseTimeLabel(value);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, alignItems: "center" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: "0",
      max: "99",
      value: h,
      onChange: (e) => onChange(_formatTimeLabel(e.target.value, m)),
      style: {
        width: 50,
        padding: "7px 6px",
        fontSize: 13,
        textAlign: "center",
        fontFamily: "var(--font-mono)",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        borderRadius: 2,
        color: "var(--ink)"
      },
      "aria-label": "\uC2DC\uAC04 (h)"
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11 } }, "h"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: "0",
      max: "59",
      value: m,
      onChange: (e) => onChange(_formatTimeLabel(h, e.target.value)),
      style: {
        width: 50,
        padding: "7px 6px",
        fontSize: 13,
        textAlign: "center",
        fontFamily: "var(--font-mono)",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        borderRadius: 2,
        color: "var(--ink)"
      },
      "aria-label": "\uBD84 (m)"
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11 } }, "m"));
};
const TPE_ScheduleEditor = ({ rows, onAdd, onRemove, onUpdate, onMove }) => /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.2em" } }, "\uB2F5\uC0AC \uC77C\uC815"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 4, lineHeight: 1.6 } }, "\uC2DC\uC791 \uC2DC\uAC01\uC73C\uB85C\uBD80\uD130 \uACBD\uACFC \uC2DC\uAC04 \uB2E8\uC704. \uCCAB \uD56D\uBAA9\uC740 \uBCF4\uD1B5 0h 0m.")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: onAdd }, "\uFF0B \uD56D\uBAA9 \uCD94\uAC00")), rows.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, lineHeight: 1.6, padding: "14px 0", textAlign: "center", background: "var(--bg-2)", border: "1px dashed var(--line)", borderRadius: 2 } }, "\u24D8 \uD56D\uBAA9\uC774 \uC5C6\uC73C\uBA74 \uD398\uC774\uC9C0\uC5D0\uC11C '\uB2F5\uC0AC \uC77C\uC815' \uC139\uC158 \uBBF8\uB178\uCD9C."), rows.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
  display: "grid",
  gridTemplateColumns: "24px 145px 1fr auto",
  gap: 10,
  marginBottom: 10,
  alignItems: "center",
  padding: "8px",
  background: i % 2 === 0 ? "var(--bg-2)" : "var(--bg)",
  borderRadius: 2
} }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11, textAlign: "center", fontWeight: 600 } }, String(i + 1).padStart(2, "0")), /* @__PURE__ */ React.createElement(TPE_TimeInput, { value: s.t || "", onChange: (v) => onUpdate(i, "t", v) }), /* @__PURE__ */ React.createElement(
  "input",
  {
    type: "text",
    className: "field-input",
    value: s.l || "",
    onChange: (e) => onUpdate(i, "l", e.target.value),
    placeholder: "\uC9C4\uD589 \uB0B4\uC6A9 (\uC608: \uC8FC\uC694 \uACF5\uAC04 \uB2F5\uC0AC)",
    style: { padding: "7px 10px", fontSize: 14 }
  }
), /* @__PURE__ */ React.createElement(TPE_RowActions, { i, total: rows.length, onMove, onRemove }))));
const TPE_PrepEditor = ({ rows, onAdd, onRemove, onUpdate, onMove }) => /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.2em" } }, "\uC900\uBE44\uBB3C"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 4, lineHeight: 1.6 } }, "\uCC38\uAC00\uC790\uAC00 \uAC00\uC838\uC640\uC57C \uD560 \uBB3C\uD488 / \uC548\uB0B4 \uC0AC\uD56D.")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: onAdd }, "\uFF0B \uD56D\uBAA9 \uCD94\uAC00")), rows.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, lineHeight: 1.6, padding: "14px 0", textAlign: "center", background: "var(--bg-2)", border: "1px dashed var(--line)", borderRadius: 2 } }, "\u24D8 \uD56D\uBAA9\uC774 \uC5C6\uC73C\uBA74 \uD398\uC774\uC9C0\uC5D0\uC11C '\uC900\uBE44\uBB3C' \uC139\uC158 \uBBF8\uB178\uCD9C."), rows.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
  display: "grid",
  gridTemplateColumns: "24px 1fr auto",
  gap: 10,
  marginBottom: 10,
  alignItems: "center",
  padding: "8px",
  background: i % 2 === 0 ? "var(--bg-2)" : "var(--bg)",
  borderRadius: 2
} }, /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 13, textAlign: "center", fontWeight: 600 } }, "\u2022"), /* @__PURE__ */ React.createElement(
  "input",
  {
    type: "text",
    className: "field-input",
    value: p || "",
    onChange: (e) => onUpdate(i, e.target.value),
    placeholder: "\uD3B8\uD55C \uC2E0\uBC1C (3~5km \uBCF4\uD589)",
    style: { padding: "7px 10px", fontSize: 14 }
  }
), /* @__PURE__ */ React.createElement(TPE_RowActions, { i, total: rows.length, onMove, onRemove }))));
const TPE_PreviewCard = ({ schedule, prep }) => /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 0, overflow: "hidden", position: "sticky", top: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", padding: "8px 12px", borderBottom: "1px solid var(--line)", background: "var(--bg-2)" } }, "PREVIEW \xB7 \uD22C\uC5B4 \uD398\uC774\uC9C0"), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px" } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--line)" } }, "\uB2F5\uC0AC \uC77C\uC815"), schedule.filter((s) => s && (s.t || s.l)).length > 0 ? schedule.filter((s) => s && (s.t || s.l)).map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "80px 1fr", gap: 16, padding: "10px 0", borderBottom: "1px dashed var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.1em" } }, s.t || "\u2014"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 13 } }, s.l || "\uB0B4\uC6A9 \uBBF8\uC785\uB825"))) : /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, fontStyle: "italic" } }, "(\uBBF8\uB178\uCD9C)"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginTop: 24, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--line)" } }, "\uC900\uBE44\uBB3C"), prep.filter(Boolean).length > 0 ? /* @__PURE__ */ React.createElement("ul", { style: { paddingLeft: 18, color: "var(--ink-2)", fontSize: 13, lineHeight: 1.9 } }, prep.filter(Boolean).map((p, i) => /* @__PURE__ */ React.createElement("li", { key: i }, p))) : /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, fontStyle: "italic" } }, "(\uBBF8\uB178\uCD9C)")));
const _arrAdd = (arr, item) => [...arr, item];
const _arrRemove = (arr, i) => arr.filter((_, j) => j !== i);
const _arrUpdate = (arr, i, value) => {
  const next = arr.slice();
  next[i] = value;
  return next;
};
const _arrMove = (arr, i, dir) => {
  const next = arr.slice();
  const j = i + dir;
  if (j < 0 || j >= next.length) return arr;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};
const TourPageEditorPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [mode, setMode] = React.useState("global");
  const [msg, setMsg] = React.useState("");
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2500);
  };
  const [gSchedule, setGSchedule] = React.useState(() => Array.isArray(sc.tourSchedule) ? sc.tourSchedule.slice() : []);
  const [gPrep, setGPrep] = React.useState(() => Array.isArray(sc.tourPrep) ? sc.tourPrep.slice() : []);
  const saveGlobal = async () => {
    try {
      const cleanS = gSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ""), l: String(s.l || "") }));
      const cleanP = gPrep.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      await window.BGNJ_SITE_CONTENT.saveSection("tourSchedule", cleanS);
      await window.BGNJ_SITE_CONTENT.saveSection("tourPrep", cleanP);
      setTick((v) => v + 1);
      flash("\uAE00\uB85C\uBC8C \uC800\uC7A5\uB428 \u2014 \uD22C\uC5B4 \uD398\uC774\uC9C0\uC5D0 \uC989\uC2DC \uBC18\uC601.");
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const resetGlobal = async () => {
    if (!confirm("\uAE00\uB85C\uBC8C \uB2F5\uC0AC \uC77C\uC815/\uC900\uBE44\uBB3C\uC744 default \uB85C \uBCF5\uC6D0\uD569\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?")) return;
    try {
      await window.BGNJ_SITE_CONTENT.resetSection("tourSchedule");
      await window.BGNJ_SITE_CONTENT.resetSection("tourPrep");
      const next = window.BGNJ_SITE_CONTENT.get();
      setGSchedule(Array.isArray(next.tourSchedule) ? next.tourSchedule.slice() : []);
      setGPrep(Array.isArray(next.tourPrep) ? next.tourPrep.slice() : []);
      setTick((v) => v + 1);
      flash("\uAE00\uB85C\uBC8C default \uBCF5\uC6D0\uB428.");
    } catch (err) {
      alert("\uBCF5\uC6D0 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const [templates, setTemplates] = React.useState(() => Array.isArray(sc.tourTemplates) ? sc.tourTemplates.slice() : []);
  const [activeTplIdx, setActiveTplIdx] = React.useState(-1);
  const activeTpl = activeTplIdx >= 0 ? templates[activeTplIdx] : null;
  const addTemplate = () => {
    const id = `tpl-${Date.now()}`;
    setTemplates((arr) => [...arr, { id, name: "\uC0C8 \uD15C\uD50C\uB9BF", schedule: [], prep: [] }]);
    setActiveTplIdx(templates.length);
  };
  const removeTemplate = (i) => {
    var _a;
    if (!confirm(`"${((_a = templates[i]) == null ? void 0 : _a.name) || "\uD15C\uD50C\uB9BF"}" \uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?`)) return;
    setTemplates((arr) => arr.filter((_, j) => j !== i));
    if (activeTplIdx >= templates.length - 1) setActiveTplIdx(-1);
  };
  const updateActiveTpl = (patch) => {
    if (activeTplIdx < 0) return;
    setTemplates((arr) => arr.map((t, j) => j === activeTplIdx ? { ...t, ...patch } : t));
  };
  const saveTemplates = async () => {
    try {
      const clean = templates.map((t) => ({
        id: t.id || `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: String(t.name || "\uC774\uB984 \uC5C6\uC74C"),
        schedule: (Array.isArray(t.schedule) ? t.schedule : []).filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ""), l: String(s.l || "") })),
        prep: (Array.isArray(t.prep) ? t.prep : []).filter((p) => p && String(p).trim()).map((p) => String(p).trim())
      }));
      await window.BGNJ_SITE_CONTENT.saveSection("tourTemplates", clean);
      setTick((v) => v + 1);
      flash("\uD15C\uD50C\uB9BF \uC800\uC7A5\uB428.");
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const tours = React.useMemo(() => {
    var _a, _b;
    try {
      return (((_b = (_a = window.BGNJ_TOURS) == null ? void 0 : _a.listAll) == null ? void 0 : _b.call(_a)) || []).slice();
    } catch (e) {
      return [];
    }
  }, [tick]);
  const [activeTourId, setActiveTourId] = React.useState("");
  const tourPages = sc.tourPages || {};
  const activeOverride = activeTourId ? tourPages[activeTourId] || null : null;
  const [pSchedule, setPSchedule] = React.useState([]);
  const [pPrep, setPPrep] = React.useState([]);
  const [pTemplateId, setPTemplateId] = React.useState("");
  const [pCover, setPCover] = React.useState("");
  React.useEffect(() => {
    if (!activeTourId) {
      setPSchedule([]);
      setPPrep([]);
      setPTemplateId("");
      setPCover("");
      return;
    }
    const ovr = tourPages[activeTourId] || {};
    setPSchedule(Array.isArray(ovr.schedule) ? ovr.schedule.slice() : []);
    setPPrep(Array.isArray(ovr.prep) ? ovr.prep.slice() : []);
    setPTemplateId(ovr.templateId || "");
    setPCover(ovr.coverDataUri || "");
  }, [activeTourId, tick]);
  const applyTplToPerTour = (tplId) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    setPSchedule(Array.isArray(tpl.schedule) ? tpl.schedule.map((s) => ({ ...s })) : []);
    setPPrep(Array.isArray(tpl.prep) ? tpl.prep.slice() : []);
    setPTemplateId(tplId);
  };
  const savePerTour = async () => {
    if (!activeTourId) {
      alert("\uD22C\uC5B4\uB97C \uBA3C\uC800 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    try {
      const cleanS = pSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ""), l: String(s.l || "") }));
      const cleanP = pPrep.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      const next = { ...tourPages, [activeTourId]: {
        schedule: cleanS,
        prep: cleanP,
        templateId: pTemplateId || void 0,
        coverDataUri: pCover || void 0
      } };
      await window.BGNJ_SITE_CONTENT.saveSection("tourPages", next);
      setTick((v) => v + 1);
      flash(`'${activeTourId}' \uD22C\uC5B4 override \uC800\uC7A5\uB428.`);
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const onPickCover = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert(`\uC774\uBBF8\uC9C0\uAC00 \uB108\uBB34 \uD07D\uB2C8\uB2E4(${(file.size / 1024 / 1024).toFixed(1)}MB). 1.5MB \uC774\uD558\uB85C \uC555\uCD95\uD574 \uC8FC\uC138\uC694.`);
      e.target.value = "";
      return;
    }
    const dataUri = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    setPCover(dataUri);
    e.target.value = "";
  };
  const clearPerTour = async () => {
    if (!activeTourId) return;
    if (!confirm(`'${activeTourId}' \uD22C\uC5B4\uC758 override \uB97C \uC81C\uAC70\uD558\uACE0 \uAE00\uB85C\uBC8C\uB85C \uD3F4\uBC31\uD558\uC2DC\uACA0\uC5B4\uC694?`)) return;
    try {
      const next = { ...tourPages };
      delete next[activeTourId];
      await window.BGNJ_SITE_CONTENT.saveSection("tourPages", next);
      setPSchedule([]);
      setPPrep([]);
      setPTemplateId("");
      setPCover("");
      setTick((v) => v + 1);
      flash("override \uC81C\uAC70\uB428 \u2014 \uAE00\uB85C\uBC8C fallback \uC801\uC6A9.");
    } catch (err) {
      alert("\uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const previewSchedule = mode === "global" ? gSchedule : mode === "templates" ? (activeTpl == null ? void 0 : activeTpl.schedule) || [] : pSchedule;
  const previewPrep = mode === "global" ? gPrep : mode === "templates" ? (activeTpl == null ? void 0 : activeTpl.prep) || [] : pPrep;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 14, lineHeight: 1.8 } }, /* @__PURE__ */ React.createElement("code", null, "/tour"), " \uD398\uC774\uC9C0\uC758 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uB2F5\uC0AC \uC77C\uC815"), "\uACFC ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uC900\uBE44\uBB3C"), " \uD3B8\uC9D1. \uC6B0\uC120\uC21C\uC704: ", /* @__PURE__ */ React.createElement("strong", null, "\uD22C\uC5B4\uBCC4 override"), " > ", /* @__PURE__ */ React.createElement("strong", null, "\uD15C\uD50C\uB9BF"), " > ", /* @__PURE__ */ React.createElement("strong", null, "\uAE00\uB85C\uBC8C"), " > \uCF54\uB4DC default."), /* @__PURE__ */ React.createElement("div", { role: "tablist", "aria-label": "\uD3B8\uC9D1 \uBAA8\uB4DC", style: { display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" } }, [
    { key: "global", label: "\uAE00\uB85C\uBC8C (\uBAA8\uB4E0 \uD22C\uC5B4 \uACF5\uD1B5)" },
    { key: "templates", label: "\uD15C\uD50C\uB9BF" },
    { key: "per_tour", label: "\uD22C\uC5B4\uBCC4 override" }
  ].map((m) => {
    const on = mode === m.key;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: m.key,
        type: "button",
        role: "tab",
        "aria-selected": on,
        onClick: () => setMode(m.key),
        className: "btn btn-small",
        style: {
          fontSize: 12,
          borderColor: on ? "var(--primary)" : "var(--line-2)",
          color: on ? "var(--primary)" : "var(--ink)",
          background: on ? "rgba(245,213,72,0.10)" : "var(--bg-2)",
          fontWeight: on ? 700 : 500
        }
      },
      m.label
    );
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 20 }, className: "hero-editor-grid" }, /* @__PURE__ */ React.createElement("div", null, mode === "global" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    TPE_ScheduleEditor,
    {
      rows: gSchedule,
      onAdd: () => setGSchedule((a) => _arrAdd(a, { t: "", l: "" })),
      onRemove: (i) => setGSchedule((a) => _arrRemove(a, i)),
      onUpdate: (i, k, v) => setGSchedule((a) => {
        const n = a.slice();
        n[i] = { ...n[i], [k]: v };
        return n;
      }),
      onMove: (i, d) => setGSchedule((a) => _arrMove(a, i, d))
    }
  ), /* @__PURE__ */ React.createElement(
    TPE_PrepEditor,
    {
      rows: gPrep,
      onAdd: () => setGPrep((a) => _arrAdd(a, "")),
      onRemove: (i) => setGPrep((a) => _arrRemove(a, i)),
      onUpdate: (i, v) => setGPrep((a) => _arrUpdate(a, i, v)),
      onMove: (i, d) => setGPrep((a) => _arrMove(a, i, d))
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: saveGlobal }, "\uC800\uC7A5"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: resetGlobal, style: { borderColor: "var(--line-2)" } }, "default \uBCF5\uC6D0"))), mode === "templates" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.2em" } }, "\uD15C\uD50C\uB9BF \uBAA9\uB85D"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: addTemplate }, "\uFF0B \uC0C8 \uD15C\uD50C\uB9BF")), templates.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.6 } }, "\uC544\uC9C1 \uD15C\uD50C\uB9BF\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC790\uC8FC \uC4F0\uB294 \uB2F5\uC0AC \uC77C\uC815/\uC900\uBE44\uBB3C \uD328\uD134\uC744 \uC800\uC7A5\uD574 \uB450\uBA74 \uD22C\uC5B4\uBCC4 override \uC5D0\uC11C \uBE60\uB974\uAC8C \uC801\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, templates.map((t, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t.id || i,
      type: "button",
      className: "btn btn-small",
      onClick: () => setActiveTplIdx(i),
      style: {
        fontSize: 11,
        borderColor: activeTplIdx === i ? "var(--primary)" : "var(--line-2)",
        color: activeTplIdx === i ? "var(--primary)" : "var(--ink)",
        fontWeight: activeTplIdx === i ? 700 : 500
      }
    },
    t.name || "\uC774\uB984 \uC5C6\uC74C"
  )))), activeTpl && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 5 } }, "\uD15C\uD50C\uB9BF \uC774\uB984"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "field-input",
      value: activeTpl.name || "",
      onChange: (e) => updateActiveTpl({ name: e.target.value }),
      style: { width: "100%", padding: "6px 10px", fontSize: 13 }
    }
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => removeTemplate(activeTplIdx),
      style: { borderColor: "var(--danger)", color: "var(--danger)", fontSize: 10 }
    },
    "\uC774 \uD15C\uD50C\uB9BF \uC0AD\uC81C"
  )), /* @__PURE__ */ React.createElement(
    TPE_ScheduleEditor,
    {
      rows: activeTpl.schedule || [],
      onAdd: () => updateActiveTpl({ schedule: _arrAdd(activeTpl.schedule || [], { t: "", l: "" }) }),
      onRemove: (i) => updateActiveTpl({ schedule: _arrRemove(activeTpl.schedule || [], i) }),
      onUpdate: (i, k, v) => {
        const n = (activeTpl.schedule || []).slice();
        n[i] = { ...n[i], [k]: v };
        updateActiveTpl({ schedule: n });
      },
      onMove: (i, d) => updateActiveTpl({ schedule: _arrMove(activeTpl.schedule || [], i, d) })
    }
  ), /* @__PURE__ */ React.createElement(
    TPE_PrepEditor,
    {
      rows: activeTpl.prep || [],
      onAdd: () => updateActiveTpl({ prep: _arrAdd(activeTpl.prep || [], "") }),
      onRemove: (i) => updateActiveTpl({ prep: _arrRemove(activeTpl.prep || [], i) }),
      onUpdate: (i, v) => updateActiveTpl({ prep: _arrUpdate(activeTpl.prep || [], i, v) }),
      onMove: (i, d) => updateActiveTpl({ prep: _arrMove(activeTpl.prep || [], i, d) })
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: saveTemplates }, "\uBAA8\uB4E0 \uD15C\uD50C\uB9BF \uC800\uC7A5"))), mode === "per_tour" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 5 } }, "\uD22C\uC5B4 \uC120\uD0DD"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: activeTourId,
      onChange: (e) => setActiveTourId(e.target.value),
      className: "field-input",
      style: { width: "100%", padding: "8px 10px", fontSize: 13 }
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 \uD22C\uC5B4\uB97C \uC120\uD0DD \u2014"),
    tours.map((t) => /* @__PURE__ */ React.createElement("option", { key: t.id, value: t.id }, t.title || t.id, " ", tourPages[t.id] ? "\xB7 override \uC788\uC74C" : ""))
  )), activeTourId && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.16em" } }, "\uD15C\uD50C\uB9BF \uC801\uC6A9:"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: pTemplateId || "",
      onChange: (e) => applyTplToPerTour(e.target.value),
      className: "field-input",
      style: { padding: "6px 8px", fontSize: 12, minWidth: 160 }
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 \uC9C1\uC811 \uD3B8\uC9D1 \u2014"),
    templates.map((t) => /* @__PURE__ */ React.createElement("option", { key: t.id, value: t.id }, t.name))
  ))), activeTourId ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.2em", marginBottom: 10 } }, "\uCEE4\uBC84 \uC774\uBBF8\uC9C0 (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 120,
    height: 75,
    flexShrink: 0,
    border: "1px solid var(--line)",
    background: "var(--bg-2)",
    display: "grid",
    placeItems: "center",
    overflow: "hidden"
  } }, pCover ? /* @__PURE__ */ React.createElement("img", { src: pCover, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 9, letterSpacing: "0.18em" } }, "NONE")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.5 } }, "\uB2F5\uC0AC \uC0C1\uC138 \uD398\uC774\uC9C0 \uC88C\uCE21 \uC0C1\uB2E8\uC5D0 \uD45C\uC2DC\uB420 \uCEE4\uBC84 \uC774\uBBF8\uC9C0. 1600\xD71000 \uAD8C\uC7A5 \xB7 1.5MB \uC774\uD558 \xB7 \uBE44\uC6B0\uBA74 placeholder.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("label", { className: "btn btn-small", style: { cursor: "pointer" } }, "\uC5C5\uB85C\uB4DC", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", onChange: onPickCover, style: { display: "none" } })), pCover && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setPCover(""),
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC81C\uAC70"
  )))), /* @__PURE__ */ React.createElement(
    TPE_ScheduleEditor,
    {
      rows: pSchedule,
      onAdd: () => setPSchedule((a) => _arrAdd(a, { t: "", l: "" })),
      onRemove: (i) => setPSchedule((a) => _arrRemove(a, i)),
      onUpdate: (i, k, v) => setPSchedule((a) => {
        const n = a.slice();
        n[i] = { ...n[i], [k]: v };
        return n;
      }),
      onMove: (i, d) => setPSchedule((a) => _arrMove(a, i, d))
    }
  ), /* @__PURE__ */ React.createElement(
    TPE_PrepEditor,
    {
      rows: pPrep,
      onAdd: () => setPPrep((a) => _arrAdd(a, "")),
      onRemove: (i) => setPPrep((a) => _arrRemove(a, i)),
      onUpdate: (i, v) => setPPrep((a) => _arrUpdate(a, i, v)),
      onMove: (i, d) => setPPrep((a) => _arrMove(a, i, d))
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: savePerTour }, "\uC774 \uD22C\uC5B4 \uC800\uC7A5"), activeOverride && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: clearPerTour,
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "override \uC81C\uAC70 (\uAE00\uB85C\uBC8C fallback)"
  ))) : /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, fontStyle: "italic" } }, "\uD22C\uC5B4\uB97C \uC120\uD0DD\uD558\uBA74 \uADF8 \uD22C\uC5B4\uC758 \uB2F5\uC0AC \uC77C\uC815/\uC900\uBE44\uBB3C\uC744 \uD3B8\uC9D1\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC800\uC7A5\uB41C override \uAC00 \uC5C6\uC73C\uBA74 \uAE00\uB85C\uBC8C\uC774 \uC0AC\uC6A9\uB429\uB2C8\uB2E4.")), msg && /* @__PURE__ */ React.createElement("p", { role: "status", className: "mono", style: { fontSize: 12, color: "var(--secondary)", fontWeight: 600, marginTop: 10 } }, msg)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(TPE_PreviewCard, { schedule: previewSchedule, prep: previewPrep }))));
};
const LPE_NotesEditor = ({ rows, onAdd, onRemove, onUpdate, onMove }) => /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.2em" } }, "\uCC38\uACE0 \uC548\uB0B4"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onAdd }, "\uFF0B \uD589 \uCD94\uAC00")), rows.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.6 } }, "\uC544\uC9C1 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uFF0B\uB85C \uCD94\uAC00\uD558\uC138\uC694."), rows.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginBottom: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement(
  "input",
  {
    type: "text",
    className: "field-input",
    value: p || "",
    onChange: (e) => onUpdate(i, e.target.value),
    placeholder: "\uD68C\uC6D0 \uAC00\uC785 \uD6C4 \uC2E0\uCCAD \uAC00\uB2A5 \u2014 \uBE44\uD68C\uC6D0\uC740 \uC790\uB3D9 \uCC28\uB2E8",
    style: { padding: "6px 8px", fontSize: 13 }
  }
), /* @__PURE__ */ React.createElement(TPE_RowActions, { i, total: rows.length, onMove, onRemove }))));
const LPE_PreviewCard = ({ schedule, notes }) => /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 0, overflow: "hidden", position: "sticky", top: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", padding: "8px 12px", borderBottom: "1px solid var(--line)", background: "var(--bg-2)" } }, "PREVIEW \xB7 \uAC15\uC5F0 \uD398\uC774\uC9C0"), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px" } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--line)" } }, "\uAC15\uC5F0 \uC9C4\uD589"), schedule.filter((s) => s && (s.t || s.l)).length > 0 ? schedule.filter((s) => s && (s.t || s.l)).map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "80px 1fr", gap: 16, padding: "10px 0", borderBottom: "1px dashed var(--line)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.1em" } }, s.t || "\u2014"), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 13 } }, s.l || "\uB0B4\uC6A9 \uBBF8\uC785\uB825"))) : /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, fontStyle: "italic" } }, "(\uBBF8\uB178\uCD9C)"), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginTop: 24, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--line)" } }, "\uCC38\uACE0"), notes.filter(Boolean).length > 0 ? /* @__PURE__ */ React.createElement("ul", { style: { paddingLeft: 18, color: "var(--ink-2)", fontSize: 13, lineHeight: 1.9 } }, notes.filter(Boolean).map((n, i) => /* @__PURE__ */ React.createElement("li", { key: i }, n))) : /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, fontStyle: "italic" } }, "(\uBBF8\uB178\uCD9C)")));
const LecturePageEditorPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [mode, setMode] = React.useState("global");
  const [msg, setMsg] = React.useState("");
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2500);
  };
  const [gSchedule, setGSchedule] = React.useState(() => Array.isArray(sc.lectureSchedule) ? sc.lectureSchedule.slice() : []);
  const [gNotes, setGNotes] = React.useState(() => Array.isArray(sc.lectureNotes) ? sc.lectureNotes.slice() : []);
  const saveGlobal = async () => {
    try {
      const cleanS = gSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ""), l: String(s.l || "") }));
      const cleanN = gNotes.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      await window.BGNJ_SITE_CONTENT.saveSection("lectureSchedule", cleanS);
      await window.BGNJ_SITE_CONTENT.saveSection("lectureNotes", cleanN);
      setTick((v) => v + 1);
      flash("\uAE00\uB85C\uBC8C \uC800\uC7A5\uB428 \u2014 \uAC15\uC5F0 \uD398\uC774\uC9C0\uC5D0 \uC989\uC2DC \uBC18\uC601.");
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const resetGlobal = async () => {
    if (!confirm("\uAE00\uB85C\uBC8C \uC9C4\uD589/\uCC38\uACE0\uB97C default \uB85C \uBCF5\uC6D0\uD569\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?")) return;
    try {
      await window.BGNJ_SITE_CONTENT.resetSection("lectureSchedule");
      await window.BGNJ_SITE_CONTENT.resetSection("lectureNotes");
      const next = window.BGNJ_SITE_CONTENT.get();
      setGSchedule(Array.isArray(next.lectureSchedule) ? next.lectureSchedule.slice() : []);
      setGNotes(Array.isArray(next.lectureNotes) ? next.lectureNotes.slice() : []);
      setTick((v) => v + 1);
      flash("\uAE00\uB85C\uBC8C default \uBCF5\uC6D0\uB428.");
    } catch (err) {
      alert("\uBCF5\uC6D0 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const [templates, setTemplates] = React.useState(() => Array.isArray(sc.lectureTemplates) ? sc.lectureTemplates.slice() : []);
  const [activeTplIdx, setActiveTplIdx] = React.useState(-1);
  const activeTpl = activeTplIdx >= 0 ? templates[activeTplIdx] : null;
  const addTemplate = () => {
    const id = `lec-tpl-${Date.now()}`;
    setTemplates((arr) => [...arr, { id, name: "\uC0C8 \uD15C\uD50C\uB9BF", schedule: [], notes: [] }]);
    setActiveTplIdx(templates.length);
  };
  const removeTemplate = (i) => {
    var _a;
    if (!confirm(`"${((_a = templates[i]) == null ? void 0 : _a.name) || "\uD15C\uD50C\uB9BF"}" \uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?`)) return;
    setTemplates((arr) => arr.filter((_, j) => j !== i));
    if (activeTplIdx >= templates.length - 1) setActiveTplIdx(-1);
  };
  const updateActiveTpl = (patch) => {
    if (activeTplIdx < 0) return;
    setTemplates((arr) => arr.map((t, j) => j === activeTplIdx ? { ...t, ...patch } : t));
  };
  const saveTemplates = async () => {
    try {
      const clean = templates.map((t) => ({
        id: t.id || `lec-tpl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: String(t.name || "\uC774\uB984 \uC5C6\uC74C"),
        schedule: (Array.isArray(t.schedule) ? t.schedule : []).filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ""), l: String(s.l || "") })),
        notes: (Array.isArray(t.notes) ? t.notes : []).filter((p) => p && String(p).trim()).map((p) => String(p).trim())
      }));
      await window.BGNJ_SITE_CONTENT.saveSection("lectureTemplates", clean);
      setTick((v) => v + 1);
      flash("\uD15C\uD50C\uB9BF \uC800\uC7A5\uB428.");
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const lectures = React.useMemo(() => {
    var _a, _b;
    try {
      return (((_b = (_a = window.BGNJ_LECTURES) == null ? void 0 : _a.listAll) == null ? void 0 : _b.call(_a)) || []).slice();
    } catch (e) {
      return [];
    }
  }, [tick]);
  const [activeLectureId, setActiveLectureId] = React.useState("");
  const lecturePages = sc.lecturePages || {};
  const activeOverride = activeLectureId ? lecturePages[activeLectureId] || null : null;
  const [pSchedule, setPSchedule] = React.useState([]);
  const [pNotes, setPNotes] = React.useState([]);
  const [pTemplateId, setPTemplateId] = React.useState("");
  const [pCover, setPCover] = React.useState("");
  React.useEffect(() => {
    if (!activeLectureId) {
      setPSchedule([]);
      setPNotes([]);
      setPTemplateId("");
      setPCover("");
      return;
    }
    const ovr = lecturePages[activeLectureId] || {};
    setPSchedule(Array.isArray(ovr.schedule) ? ovr.schedule.slice() : []);
    setPNotes(Array.isArray(ovr.notes) ? ovr.notes.slice() : []);
    setPTemplateId(ovr.templateId || "");
    setPCover(ovr.coverDataUri || "");
  }, [activeLectureId, tick]);
  const applyTplToPerLecture = (tplId) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    setPSchedule(Array.isArray(tpl.schedule) ? tpl.schedule.map((s) => ({ ...s })) : []);
    setPNotes(Array.isArray(tpl.notes) ? tpl.notes.slice() : []);
    setPTemplateId(tplId);
  };
  const savePerLecture = async () => {
    if (!activeLectureId) {
      alert("\uAC15\uC5F0\uC744 \uBA3C\uC800 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    try {
      const cleanS = pSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ""), l: String(s.l || "") }));
      const cleanN = pNotes.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      const next = { ...lecturePages, [activeLectureId]: {
        schedule: cleanS,
        notes: cleanN,
        templateId: pTemplateId || void 0,
        coverDataUri: pCover || void 0
      } };
      await window.BGNJ_SITE_CONTENT.saveSection("lecturePages", next);
      setTick((v) => v + 1);
      flash(`'${activeLectureId}' \uAC15\uC5F0 override \uC800\uC7A5\uB428.`);
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const onPickCover = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    try {
      const { url } = await window.BGNJ_MEDIA.uploadFile(file, { folder: "lecture-covers", maxBytes: 5 * 1024 * 1024 });
      setPCover(url);
      e.target.value = "";
      return;
    } catch (err) {
      console.warn("[v00.083] R2 \uC5C5\uB85C\uB4DC \uC2E4\uD328 \u2014 dataURI \uD3F4\uBC31:", err);
    }
    if (file.size > 1.5 * 1024 * 1024) {
      alert(`\uC774\uBBF8\uC9C0\uAC00 \uB108\uBB34 \uD07D\uB2C8\uB2E4(${(file.size / 1024 / 1024).toFixed(1)}MB). R2 \uC2E4\uD328 + 1.5MB \uD3F4\uBC31 \uD55C\uB3C4 \uCD08\uACFC.`);
      e.target.value = "";
      return;
    }
    const dataUri = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    setPCover(dataUri);
    e.target.value = "";
  };
  const clearPerLecture = async () => {
    if (!activeLectureId) return;
    if (!confirm(`'${activeLectureId}' \uAC15\uC5F0\uC758 override \uB97C \uC81C\uAC70\uD558\uACE0 \uAE00\uB85C\uBC8C\uB85C \uD3F4\uBC31\uD558\uC2DC\uACA0\uC5B4\uC694?`)) return;
    try {
      const next = { ...lecturePages };
      delete next[activeLectureId];
      await window.BGNJ_SITE_CONTENT.saveSection("lecturePages", next);
      setPSchedule([]);
      setPNotes([]);
      setPTemplateId("");
      setPCover("");
      setTick((v) => v + 1);
      flash("override \uC81C\uAC70\uB428 \u2014 \uAE00\uB85C\uBC8C fallback \uC801\uC6A9.");
    } catch (err) {
      alert("\uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const previewSchedule = mode === "global" ? gSchedule : mode === "templates" ? (activeTpl == null ? void 0 : activeTpl.schedule) || [] : pSchedule;
  const previewNotes = mode === "global" ? gNotes : mode === "templates" ? (activeTpl == null ? void 0 : activeTpl.notes) || [] : pNotes;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 14, lineHeight: 1.8 } }, /* @__PURE__ */ React.createElement("code", null, "/lectures"), " \uD398\uC774\uC9C0\uC758 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uAC15\uC5F0 \uC9C4\uD589"), "\uACFC ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uCC38\uACE0"), " \uD3B8\uC9D1. \uC6B0\uC120\uC21C\uC704: ", /* @__PURE__ */ React.createElement("strong", null, "\uAC15\uC5F0\uBCC4 override"), " > ", /* @__PURE__ */ React.createElement("strong", null, "\uD15C\uD50C\uB9BF"), " > ", /* @__PURE__ */ React.createElement("strong", null, "\uAE00\uB85C\uBC8C"), " > \uCF54\uB4DC default."), /* @__PURE__ */ React.createElement("div", { role: "tablist", "aria-label": "\uD3B8\uC9D1 \uBAA8\uB4DC", style: { display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" } }, [
    { key: "global", label: "\uAE00\uB85C\uBC8C (\uBAA8\uB4E0 \uAC15\uC5F0 \uACF5\uD1B5)" },
    { key: "templates", label: "\uD15C\uD50C\uB9BF" },
    { key: "per_lecture", label: "\uAC15\uC5F0\uBCC4 override" }
  ].map((m) => {
    const on = mode === m.key;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: m.key,
        type: "button",
        role: "tab",
        "aria-selected": on,
        onClick: () => setMode(m.key),
        className: "btn btn-small",
        style: {
          fontSize: 12,
          borderColor: on ? "var(--primary)" : "var(--line-2)",
          color: on ? "var(--primary)" : "var(--ink)",
          background: on ? "rgba(245,213,72,0.10)" : "var(--bg-2)",
          fontWeight: on ? 700 : 500
        }
      },
      m.label
    );
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 20 }, className: "hero-editor-grid" }, /* @__PURE__ */ React.createElement("div", null, mode === "global" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    TPE_ScheduleEditor,
    {
      rows: gSchedule,
      onAdd: () => setGSchedule((a) => _arrAdd(a, { t: "", l: "" })),
      onRemove: (i) => setGSchedule((a) => _arrRemove(a, i)),
      onUpdate: (i, k, v) => setGSchedule((a) => {
        const n = a.slice();
        n[i] = { ...n[i], [k]: v };
        return n;
      }),
      onMove: (i, d) => setGSchedule((a) => _arrMove(a, i, d))
    }
  ), /* @__PURE__ */ React.createElement(
    LPE_NotesEditor,
    {
      rows: gNotes,
      onAdd: () => setGNotes((a) => _arrAdd(a, "")),
      onRemove: (i) => setGNotes((a) => _arrRemove(a, i)),
      onUpdate: (i, v) => setGNotes((a) => _arrUpdate(a, i, v)),
      onMove: (i, d) => setGNotes((a) => _arrMove(a, i, d))
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: saveGlobal }, "\uC800\uC7A5"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: resetGlobal, style: { borderColor: "var(--line-2)" } }, "default \uBCF5\uC6D0"))), mode === "templates" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.2em" } }, "\uD15C\uD50C\uB9BF \uBAA9\uB85D"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: addTemplate }, "\uFF0B \uC0C8 \uD15C\uD50C\uB9BF")), templates.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.6 } }, "\uC544\uC9C1 \uD15C\uD50C\uB9BF\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC790\uC8FC \uC4F0\uB294 \uAC15\uC5F0 \uC9C4\uD589/\uCC38\uACE0 \uD328\uD134\uC744 \uC800\uC7A5\uD574 \uB450\uBA74 \uAC15\uC5F0\uBCC4 override \uC5D0\uC11C \uBE60\uB974\uAC8C \uC801\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, templates.map((t, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t.id || i,
      type: "button",
      className: "btn btn-small",
      onClick: () => setActiveTplIdx(i),
      style: {
        fontSize: 11,
        borderColor: activeTplIdx === i ? "var(--primary)" : "var(--line-2)",
        color: activeTplIdx === i ? "var(--primary)" : "var(--ink)",
        fontWeight: activeTplIdx === i ? 700 : 500
      }
    },
    t.name || "\uC774\uB984 \uC5C6\uC74C"
  )))), activeTpl && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 5 } }, "\uD15C\uD50C\uB9BF \uC774\uB984"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "field-input",
      value: activeTpl.name || "",
      onChange: (e) => updateActiveTpl({ name: e.target.value }),
      style: { width: "100%", padding: "6px 10px", fontSize: 13 }
    }
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => removeTemplate(activeTplIdx),
      style: { borderColor: "var(--danger)", color: "var(--danger)", fontSize: 10 }
    },
    "\uC774 \uD15C\uD50C\uB9BF \uC0AD\uC81C"
  )), /* @__PURE__ */ React.createElement(
    TPE_ScheduleEditor,
    {
      rows: activeTpl.schedule || [],
      onAdd: () => updateActiveTpl({ schedule: _arrAdd(activeTpl.schedule || [], { t: "", l: "" }) }),
      onRemove: (i) => updateActiveTpl({ schedule: _arrRemove(activeTpl.schedule || [], i) }),
      onUpdate: (i, k, v) => {
        const n = (activeTpl.schedule || []).slice();
        n[i] = { ...n[i], [k]: v };
        updateActiveTpl({ schedule: n });
      },
      onMove: (i, d) => updateActiveTpl({ schedule: _arrMove(activeTpl.schedule || [], i, d) })
    }
  ), /* @__PURE__ */ React.createElement(
    LPE_NotesEditor,
    {
      rows: activeTpl.notes || [],
      onAdd: () => updateActiveTpl({ notes: _arrAdd(activeTpl.notes || [], "") }),
      onRemove: (i) => updateActiveTpl({ notes: _arrRemove(activeTpl.notes || [], i) }),
      onUpdate: (i, v) => updateActiveTpl({ notes: _arrUpdate(activeTpl.notes || [], i, v) }),
      onMove: (i, d) => updateActiveTpl({ notes: _arrMove(activeTpl.notes || [], i, d) })
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: saveTemplates }, "\uBAA8\uB4E0 \uD15C\uD50C\uB9BF \uC800\uC7A5"))), mode === "per_lecture" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 5 } }, "\uAC15\uC5F0 \uC120\uD0DD"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: activeLectureId,
      onChange: (e) => setActiveLectureId(e.target.value),
      className: "field-input",
      style: { width: "100%", padding: "8px 10px", fontSize: 13 }
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 \uAC15\uC5F0\uC744 \uC120\uD0DD \u2014"),
    lectures.map((l) => /* @__PURE__ */ React.createElement("option", { key: l.id, value: l.id }, l.title || l.id, " ", lecturePages[l.id] ? "\xB7 override \uC788\uC74C" : ""))
  )), activeLectureId && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.16em" } }, "\uD15C\uD50C\uB9BF \uC801\uC6A9:"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: pTemplateId || "",
      onChange: (e) => applyTplToPerLecture(e.target.value),
      className: "field-input",
      style: { padding: "6px 8px", fontSize: 12, minWidth: 160 }
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 \uC9C1\uC811 \uD3B8\uC9D1 \u2014"),
    templates.map((t) => /* @__PURE__ */ React.createElement("option", { key: t.id, value: t.id }, t.name))
  ))), activeLectureId ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.2em", marginBottom: 10 } }, "\uCEE4\uBC84 \uC774\uBBF8\uC9C0 (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 120,
    height: 75,
    flexShrink: 0,
    border: "1px solid var(--line)",
    background: "var(--bg-2)",
    display: "grid",
    placeItems: "center",
    overflow: "hidden"
  } }, pCover ? /* @__PURE__ */ React.createElement("img", { src: pCover, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 9, letterSpacing: "0.18em" } }, "NONE")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.5 } }, "1600\xD71000 \uAD8C\uC7A5 \xB7 R2 5MB / dataURI \uD3F4\uBC31 1.5MB \xB7 \uBE44\uC6B0\uBA74 placeholder.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("label", { className: "btn btn-small", style: { cursor: "pointer" } }, "\uC5C5\uB85C\uB4DC", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", onChange: onPickCover, style: { display: "none" } })), pCover && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setPCover(""),
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC81C\uAC70"
  )))), /* @__PURE__ */ React.createElement(
    TPE_ScheduleEditor,
    {
      rows: pSchedule,
      onAdd: () => setPSchedule((a) => _arrAdd(a, { t: "", l: "" })),
      onRemove: (i) => setPSchedule((a) => _arrRemove(a, i)),
      onUpdate: (i, k, v) => setPSchedule((a) => {
        const n = a.slice();
        n[i] = { ...n[i], [k]: v };
        return n;
      }),
      onMove: (i, d) => setPSchedule((a) => _arrMove(a, i, d))
    }
  ), /* @__PURE__ */ React.createElement(
    LPE_NotesEditor,
    {
      rows: pNotes,
      onAdd: () => setPNotes((a) => _arrAdd(a, "")),
      onRemove: (i) => setPNotes((a) => _arrRemove(a, i)),
      onUpdate: (i, v) => setPNotes((a) => _arrUpdate(a, i, v)),
      onMove: (i, d) => setPNotes((a) => _arrMove(a, i, d))
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: savePerLecture }, "\uC774 \uAC15\uC5F0 \uC800\uC7A5"), activeOverride && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: clearPerLecture,
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "override \uC81C\uAC70 (\uAE00\uB85C\uBC8C fallback)"
  ))) : /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, fontStyle: "italic" } }, "\uAC15\uC5F0\uC744 \uC120\uD0DD\uD558\uBA74 \uADF8 \uAC15\uC5F0\uC758 \uC9C4\uD589/\uCC38\uACE0/\uCEE4\uBC84\uB97C \uD3B8\uC9D1\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC800\uC7A5\uB41C override \uAC00 \uC5C6\uC73C\uBA74 \uAE00\uB85C\uBC8C\uC774 \uC0AC\uC6A9\uB429\uB2C8\uB2E4.")), msg && /* @__PURE__ */ React.createElement("p", { role: "status", className: "mono", style: { fontSize: 12, color: "var(--secondary)", fontWeight: 600, marginTop: 10 } }, msg)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(LPE_PreviewCard, { schedule: previewSchedule, notes: previewNotes }))));
};
const FOOTER_COLOR_OPTIONS = [
  { value: "--ink", label: "\uBA54\uC778 \uC789\uD06C (--ink)" },
  { value: "--ink-2", label: "\uBCF4\uC870 \uC789\uD06C (--ink-2)" },
  { value: "--ink-3", label: "\uBA54\uD0C0 \uC789\uD06C (--ink-3)" },
  { value: "--primary", label: "\uC610\uB85C\uC6B0 (--primary)" },
  { value: "--secondary", label: "\uCE74\uB77C\uBA5C (--secondary)" },
  { value: "--tertiary", label: "\uC2AC\uB808\uC774\uD2B8 (--tertiary)" }
];
const FooterStyleEditor = () => {
  var _a, _b;
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [draft, setDraft] = React.useState(() => ({ ...sc.footerStyle && typeof sc.footerStyle === "object" ? sc.footerStyle : {} }));
  const [msg, setMsg] = React.useState("");
  const eff = React.useMemo(() => {
    const def = window.BGNJ_FOOTER_STYLE_DEFAULT;
    return {
      description: { ...def.description, ...draft.description || {} },
      signature: { ...def.signature, ...draft.signature || {} },
      heading: { ...def.heading, ...draft.heading || {} }
    };
  }, [draft]);
  const set = (group, key, value) => setDraft((d) => ({ ...d, [group]: { ...d[group] || {}, [key]: value } }));
  const resetGroup = (group) => setDraft((d) => {
    const next = { ...d };
    delete next[group];
    return next;
  });
  const save = async () => {
    try {
      await window.BGNJ_SITE_CONTENT.saveSection("footerStyle", draft);
      setTick((v) => v + 1);
      setMsg("\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4 \u2014 \uD478\uD130\uC5D0 \uC989\uC2DC \uBC18\uC601.");
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const resetAll = async () => {
    if (!confirm("\uD478\uD130 \uC2A4\uD0C0\uC77C\uC744 default \uB85C \uBCF5\uC6D0\uD569\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?")) return;
    try {
      await window.BGNJ_SITE_CONTENT.resetSection("footerStyle");
      setDraft({});
      setTick((v) => v + 1);
      setMsg("default \uB85C \uBCF5\uC6D0\uB428.");
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      alert("\uBCF5\uC6D0 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const Field = HE_Field;
  const NumberRange = HE_NumberRange;
  const Select = HE_Select;
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, marginBottom: 6 } }, "\uD478\uD130 \uC2A4\uD0C0\uC77C \uD2B8\uC717"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, marginBottom: 14, lineHeight: 1.7 } }, "\uD478\uD130 \uC601\uC5ED\uC758 \uD5E4\uB529(\uCF58\uD150\uCE20/\uC815\uBCF4/\uC5F0\uB77D) \xB7 \uC18C\uAC1C \uBB38\uB2E8 \xB7 \uD558\uB2E8 \uC11C\uBA85\uC758 \uD3F0\uD2B8\uC640 \uC0C9\uC0C1\uC744 \uC9C1\uC811 \uD3B8\uC9D1\uD569\uB2C8\uB2E4. \uC800\uC7A5 \uC2DC \uC989\uC2DC \uBC18\uC601."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 16 }, className: "hero-editor-grid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "DESCRIPTION (\uC18C\uAC1C \uBB38\uB2E8)", onResetGroup: () => resetGroup("description") }, /* @__PURE__ */ React.createElement(Field, { label: `\uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${eff.description.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.description.fontSize,
      min: 11,
      max: 20,
      step: 1,
      onChange: (v) => set("description", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uAD75\uAE30" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: String(eff.description.fontWeight),
      options: HERO_WEIGHTS.map(String),
      onChange: (v) => set("description", "fontWeight", Number(v))
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uD589\uAC04 \xB7 ${eff.description.lineHeight}` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.description.lineHeight,
      min: 1.2,
      max: 2.4,
      step: 0.05,
      onChange: (v) => set("description", "lineHeight", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uC0C9\uC0C1" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.description.color,
      options: FOOTER_COLOR_OPTIONS,
      onChange: (v) => set("description", "color", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uCD5C\uB300 \uB108\uBE44 \xB7 ${eff.description.maxWidth}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.description.maxWidth,
      min: 240,
      max: 600,
      step: 10,
      onChange: (v) => set("description", "maxWidth", v)
    }
  ))), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "HEADING (\uCF58\uD150\uCE20/\uC815\uBCF4/\uC5F0\uB77D)", onResetGroup: () => resetGroup("heading") }, /* @__PURE__ */ React.createElement(Field, { label: `\uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${eff.heading.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.heading.fontSize,
      min: 10,
      max: 20,
      step: 1,
      onChange: (v) => set("heading", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uAD75\uAE30" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: String(eff.heading.fontWeight),
      options: HERO_WEIGHTS.map(String),
      onChange: (v) => set("heading", "fontWeight", Number(v))
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uC790\uAC04 \xB7 ${eff.heading.letterSpacing}em` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.heading.letterSpacing,
      min: 0,
      max: 0.3,
      step: 0.01,
      onChange: (v) => set("heading", "letterSpacing", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uC0C9\uC0C1" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.heading.color,
      options: FOOTER_COLOR_OPTIONS,
      onChange: (v) => set("heading", "color", v)
    }
  ))), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "SIGNATURE (\uD558\uB2E8 \uC11C\uBA85)", onResetGroup: () => resetGroup("signature") }, /* @__PURE__ */ React.createElement(Field, { label: `\uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${eff.signature.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.signature.fontSize,
      min: 9,
      max: 16,
      step: 1,
      onChange: (v) => set("signature", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uAD75\uAE30" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: String(eff.signature.fontWeight),
      options: HERO_WEIGHTS.map(String),
      onChange: (v) => set("signature", "fontWeight", Number(v))
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uC790\uAC04 \xB7 ${eff.signature.letterSpacing}em` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.signature.letterSpacing,
      min: 0,
      max: 0.4,
      step: 0.01,
      onChange: (v) => set("signature", "letterSpacing", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uC0C9\uC0C1" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.signature.color,
      options: FOOTER_COLOR_OPTIONS,
      onChange: (v) => set("signature", "color", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uB300\uC18C\uBB38\uC790" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.signature.textTransform || "uppercase",
      options: HERO_TFORMS,
      onChange: (v) => set("signature", "textTransform", v)
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: save }, "\uC800\uC7A5"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: resetAll, style: { borderColor: "var(--line-2)" } }, "\uC804\uCCB4 default \uBCF5\uC6D0"), msg && /* @__PURE__ */ React.createElement("span", { role: "status", className: "mono", style: { fontSize: 12, color: "var(--secondary)", fontWeight: 600, alignSelf: "center" } }, msg))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 0, overflow: "hidden", position: "sticky", top: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", padding: "8px 12px", borderBottom: "1px solid var(--line)", background: "var(--bg-2)" } }, "PREVIEW \xB7 \uD478\uD130"), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px", background: "var(--bg)" } }, /* @__PURE__ */ React.createElement("p", { style: {
    fontSize: eff.description.fontSize,
    fontWeight: eff.description.fontWeight,
    lineHeight: eff.description.lineHeight,
    color: `var(${eff.description.color})`,
    maxWidth: eff.description.maxWidth,
    marginBottom: 24
  } }, ((_a = sc.footer) == null ? void 0 : _a.description) || "\uBC45\uAE30\uD0C0\uACE0 \uB178\uC790. \uBC45\uAE30\uB178\uC790\uB294 \uD55C\uAD6D\uC758 \uC5ED\uC0AC\xB7\uBB38\uD654\xB7\uC790\uC5F0\uC744 \uC9C1\uC811 \uAC77\uACE0 \uB290\uB07C\uBA70 \uB098\uB204\uB294 \uC5EC\uD589 \uCEE4\uBBA4\uB2C8\uD2F0\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 } }, ["\uCF58\uD150\uCE20", "\uC815\uBCF4"].map((h) => /* @__PURE__ */ React.createElement("div", { key: h }, /* @__PURE__ */ React.createElement("h4", { style: {
    fontSize: eff.heading.fontSize,
    fontWeight: eff.heading.fontWeight,
    letterSpacing: `${eff.heading.letterSpacing}em`,
    color: `var(${eff.heading.color})`,
    marginBottom: 8
  } }, h), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", padding: 0, margin: 0, fontSize: 12, color: "var(--ink-2)" } }, /* @__PURE__ */ React.createElement("li", { style: { marginBottom: 4 } }, "\uC608\uC2DC \uD56D\uBAA9 1"), /* @__PURE__ */ React.createElement("li", { style: { marginBottom: 4 } }, "\uC608\uC2DC \uD56D\uBAA9 2"))))), /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 14, borderTop: "1px solid var(--line)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--ink-3)" } }, "\xA9 2026 \uBC45\uAE30\uB178\uC790 BANGINOJA"), /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: eff.signature.fontSize,
    fontWeight: eff.signature.fontWeight,
    letterSpacing: `${eff.signature.letterSpacing}em`,
    color: `var(${eff.signature.color})`,
    textTransform: eff.signature.textTransform || "uppercase"
  } }, ((_b = sc.footer) == null ? void 0 : _b.signature) || "\uBC45\uAE30\uD0C0\uACE0 \uB178\uC790 \xB7 DESIGNED IN SEOUL")))))));
};
const HE_Field = ({ label, children, hint }) => /* @__PURE__ */ React.createElement("label", { style: { display: "block", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em", marginBottom: 6 } }, label), children, hint && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, marginTop: 4, lineHeight: 1.5 } }, hint));
const HE_Input = (props) => /* @__PURE__ */ React.createElement("input", { ...props, className: "field-input", style: { width: "100%", padding: "8px 10px", fontSize: 13, ...props.style } });
const HE_TextArea = (props) => /* @__PURE__ */ React.createElement("textarea", { ...props, className: "field-input", style: { width: "100%", padding: "8px 10px", fontSize: 13, minHeight: 64, fontFamily: "inherit", resize: "vertical", ...props.style } });
const HE_Select = ({ value, options, onChange, ...rest }) => /* @__PURE__ */ React.createElement(
  "select",
  {
    value,
    onChange: (e) => onChange(e.target.value),
    className: "field-input",
    style: { width: "100%", padding: "8px 10px", fontSize: 13 },
    ...rest
  },
  options.map((o) => typeof o === "object" ? /* @__PURE__ */ React.createElement("option", { key: o.value, value: o.value }, o.label) : /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o))
);
const HE_NumberRange = ({ value, min, max, step, onChange }) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement(
  "input",
  {
    type: "range",
    min,
    max,
    step,
    value,
    onChange: (e) => onChange(Number(e.target.value)),
    style: { flex: 1 }
  }
), /* @__PURE__ */ React.createElement(
  "input",
  {
    type: "number",
    min,
    max,
    step,
    value,
    onChange: (e) => onChange(Number(e.target.value)),
    className: "field-input",
    style: { width: 80, padding: "4px 6px", fontSize: 12, fontFamily: "var(--font-mono)" }
  }
));
const HE_StyleGroup = ({ title, children, onResetGroup }) => /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.2em" } }, title), onResetGroup && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onResetGroup, style: { fontSize: 10 } }, "\uC774 \uADF8\uB8F9 default")), children);
const HERO_COLOR_OPTIONS = [
  { value: "--ink", label: "\uBA54\uC778 \uC789\uD06C (--ink)" },
  { value: "--ink-2", label: "\uBCF4\uC870 \uC789\uD06C (--ink-2)" },
  { value: "--ink-3", label: "\uBA54\uD0C0 \uC789\uD06C (--ink-3)" },
  { value: "--primary", label: "\uC610\uB85C\uC6B0 (--primary)" },
  { value: "--primary-active", label: "\uB525 \uC610\uB85C\uC6B0 (--primary-active)" },
  { value: "--secondary", label: "\uCE74\uB77C\uBA5C (--secondary)" },
  { value: "--tertiary", label: "\uC2AC\uB808\uC774\uD2B8 (--tertiary)" }
];
const HERO_WEIGHTS = [300, 400, 500, 600, 700, 800, 900];
const HERO_ALIGNS = ["left", "center", "right"];
const HERO_TFORMS = ["none", "uppercase", "lowercase", "capitalize"];
const HeroEditorPanel = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [contentDraft, setContentDraft] = React.useState(() => ({ ...sc.hero || {} }));
  const [styleDraft, setStyleDraft] = React.useState(() => ({ ...sc.heroStyle && typeof sc.heroStyle === "object" ? sc.heroStyle : {} }));
  const [msg, setMsg] = React.useState("");
  const initialStats = Array.isArray((_a = sc.hero) == null ? void 0 : _a.stats) && sc.hero.stats.length === 3 ? sc.hero.stats : [
    { label: "\uC5EC\uD589\uC9C0", sub: "\uC8FC\uC694 \uB2F5\uC0AC\uC9C0 \uC6B4\uC601", valueFallback: "\uC804\uAD6D" },
    { label: "\uD22C\uC5B4", sub: "\uC9C1\uC811 \uAE30\uD68D \uD504\uB85C\uADF8\uB7A8", valueFallback: "\uC900\uBE44 \uC911" },
    { label: "\uCEE4\uBBA4\uB2C8\uD2F0", sub: "\uD568\uAED8 \uB9CC\uB4DC\uB294 \uC5EC\uD589", valueFallback: "\uC6B4\uC601 \uC911" }
  ];
  const [statsDraft, setStatsDraft] = React.useState(initialStats);
  const updateStats = (idx, key, value) => setStatsDraft((arr) => {
    const next = arr.slice();
    next[idx] = { ...next[idx], [key]: value };
    return next;
  });
  const updateContent = (k, v) => setContentDraft((d) => ({ ...d, [k]: v }));
  const updateStyle = (group, key, value) => setStyleDraft((d) => ({ ...d, [group]: { ...d[group] || {}, [key]: value } }));
  const resetGroup = (group) => setStyleDraft((d) => {
    const next = { ...d };
    delete next[group];
    return next;
  });
  const eff = React.useMemo(() => {
    var _a2, _b2, _c2;
    const def = window.BGNJ_HERO_STYLE_DEFAULT;
    return {
      eyebrow: { ...def.eyebrow, ...styleDraft.eyebrow || {} },
      title: { ...def.title, ...styleDraft.title || {} },
      subtitle: { ...def.subtitle, ...styleDraft.subtitle || {} },
      cta: { ...def.cta, ...styleDraft.cta || {} },
      stats: {
        label: { ...def.stats.label, ...((_a2 = styleDraft.stats) == null ? void 0 : _a2.label) || {} },
        value: { ...def.stats.value, ...((_b2 = styleDraft.stats) == null ? void 0 : _b2.value) || {} },
        sub: { ...def.stats.sub, ...((_c2 = styleDraft.stats) == null ? void 0 : _c2.sub) || {} }
      }
    };
  }, [styleDraft]);
  const effMobile = React.useMemo(() => {
    var _a2, _b2, _c2, _d2;
    const def = window.BGNJ_HERO_STYLE_DEFAULT;
    const m = { ...def.mobile || {}, ...styleDraft.mobile || {} };
    const merge = (k) => ({ ...def[k], ...styleDraft[k] || {}, ...m[k] || {} });
    const stats = {};
    for (const sub of ["label", "value", "sub"]) {
      stats[sub] = {
        ...def.stats[sub],
        ...((_a2 = styleDraft.stats) == null ? void 0 : _a2[sub]) || {},
        ...((_c2 = (_b2 = def.mobile) == null ? void 0 : _b2.stats) == null ? void 0 : _c2[sub]) || {},
        ...((_d2 = m.stats) == null ? void 0 : _d2[sub]) || {}
      };
    }
    return { eyebrow: merge("eyebrow"), title: merge("title"), subtitle: merge("subtitle"), cta: merge("cta"), stats };
  }, [styleDraft]);
  const [previewMode, setPreviewMode] = React.useState("desktop");
  const effPreview = previewMode === "mobile" ? effMobile : eff;
  const updateStatsStyle = (sub, key, value) => setStyleDraft((d) => ({ ...d, stats: { ...d.stats || {}, [sub]: { ...(d.stats || {})[sub] || {}, [key]: value } } }));
  const resetStatsGroup = (sub) => setStyleDraft((d) => {
    const stats = { ...d.stats || {} };
    delete stats[sub];
    return { ...d, stats };
  });
  const updateMobile = (group, key, value) => setStyleDraft((d) => ({
    ...d,
    mobile: {
      ...d.mobile || {},
      [group]: { ...(d.mobile || {})[group] || {}, [key]: value }
    }
  }));
  const updateMobileStats = (sub, key, value) => setStyleDraft((d) => {
    const mob = { ...d.mobile || {} };
    mob.stats = { ...mob.stats || {} };
    mob.stats[sub] = { ...mob.stats[sub] || {}, [key]: value };
    return { ...d, mobile: mob };
  });
  const resetMobileGroup = (group) => setStyleDraft((d) => {
    const mob = { ...d.mobile || {} };
    delete mob[group];
    return { ...d, mobile: mob };
  });
  const save = async () => {
    try {
      const heroPayload = { ...contentDraft, stats: statsDraft };
      await window.BGNJ_SITE_CONTENT.saveSection("hero", heroPayload);
      await window.BGNJ_SITE_CONTENT.saveSection("heroStyle", styleDraft);
      setTick((v) => v + 1);
      setMsg("\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4 \u2014 \uD648\uC5D0 \uC989\uC2DC \uBC18\uC601\uB429\uB2C8\uB2E4.");
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const resetAll = async () => {
    if (!confirm("\uD788\uC5B4\uB85C \uCF58\uD150\uCE20\uC640 \uC2A4\uD0C0\uC77C\uC744 \uBAA8\uB450 default \uB85C \uBCF5\uC6D0\uD569\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?")) return;
    try {
      await window.BGNJ_SITE_CONTENT.resetSection("hero");
      await window.BGNJ_SITE_CONTENT.resetSection("heroStyle");
      setContentDraft({});
      setStyleDraft({});
      setStatsDraft(initialStats);
      setTick((v) => v + 1);
      setMsg("default \uB85C \uBCF5\uC6D0\uB428.");
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      alert("\uBCF5\uC6D0 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const Field = HE_Field;
  const Input = HE_Input;
  const TextArea = HE_TextArea;
  const Select = HE_Select;
  const NumberRange = HE_NumberRange;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 16, lineHeight: 1.8 } }, "\uD648\uD398\uC774\uC9C0 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uD788\uC5B4\uB85C \uC601\uC5ED"), " \uC758 \uCF58\uD150\uCE20\uC640 \uC2A4\uD0C0\uC77C\uC744 \uC9C1\uC811 \uD3B8\uC9D1\uD569\uB2C8\uB2E4. \uC800\uC7A5 \uC2DC \uC989\uC2DC \uD648\uC5D0 \uBC18\uC601\uB429\uB2C8\uB2E4 (\uAD00\uB9AC\uC790 \uC678 \uD68C\uC6D0\uC5D0\uAC8C\uB3C4 \uC601\uD5A5). default \uB85C \uBCF5\uC6D0\uD558\uB824\uBA74 \uC6B0\uCE21 \uC0C1\uB2E8 \uBC84\uD2BC."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 20 }, className: "hero-editor-grid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, marginBottom: 10 } }, "\uCF58\uD150\uCE20"), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 20 } }, /* @__PURE__ */ React.createElement(Field, { label: "EYEBROW (\uC18C\uC81C\uBAA9)" }, /* @__PURE__ */ React.createElement(
    Input,
    {
      value: (_b = contentDraft.eyebrow) != null ? _b : "",
      onChange: (e) => updateContent("eyebrow", e.target.value),
      placeholder: "BANGINOJA \xB7 \uBC45\uAE30\uD0C0\uACE0 \uB178\uC790"
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "TITLE 1 (\uB300\uC81C\uBAA9 1\uD589)" }, /* @__PURE__ */ React.createElement(Input, { value: (_c = contentDraft.title1) != null ? _c : "", onChange: (e) => updateContent("title1", e.target.value), placeholder: "\uBC45\uAE30\uD0C0\uACE0" })), /* @__PURE__ */ React.createElement(Field, { label: "TITLE 2 (\uB300\uC81C\uBAA9 2\uD589 \u2014 \uC610\uB85C\uC6B0 \uAC15\uC870)" }, /* @__PURE__ */ React.createElement(Input, { value: (_d = contentDraft.title2) != null ? _d : "", onChange: (e) => updateContent("title2", e.target.value), placeholder: "\uD55C\uAD6D\uC744" })), /* @__PURE__ */ React.createElement(Field, { label: "TITLE 3 (\uB300\uC81C\uBAA9 3\uD589)" }, /* @__PURE__ */ React.createElement(Input, { value: (_e = contentDraft.title3) != null ? _e : "", onChange: (e) => updateContent("title3", e.target.value), placeholder: "\uB290\uB07C\uB2E4" })), /* @__PURE__ */ React.createElement(Field, { label: "SUBTITLE (\uBCF8\uBB38)" }, /* @__PURE__ */ React.createElement(
    TextArea,
    {
      value: (_f = contentDraft.subtitle) != null ? _f : "",
      onChange: (e) => updateContent("subtitle", e.target.value),
      placeholder: "\uAD81\uAD90 \uB2F5\uC0AC\uBD80\uD130 \u2026"
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "MAP HINT (\uC9C0\uB3C4 \uBC84\uD2BC \uD14D\uC2A4\uD2B8)" }, /* @__PURE__ */ React.createElement(
    Input,
    {
      value: (_g = contentDraft.mapHint) != null ? _g : "",
      onChange: (e) => updateContent("mapHint", e.target.value),
      placeholder: "\uC9C0\uB3C4\uC5D0\uC11C \uC5EC\uD589\uC9C0 \uCC3E\uAE30 \u2192"
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "CTA PRIMARY (\uCEE4\uBBA4\uB2C8\uD2F0 \uBC84\uD2BC)" }, /* @__PURE__ */ React.createElement(Input, { value: (_h = contentDraft.ctaPrimary) != null ? _h : "", onChange: (e) => updateContent("ctaPrimary", e.target.value), placeholder: "\uCEE4\uBBA4\uB2C8\uD2F0 \uCC38\uC5EC\uD558\uAE30" })), /* @__PURE__ */ React.createElement(Field, { label: "CTA SECONDARY (\uD22C\uC5B4 \uBC84\uD2BC)", hint: "\uBE44\uC6CC\uB450\uBA74 default \uC0AC\uC6A9. \uBAA8\uB4E0 \uD2B8\uC717\uC740 \uC989\uC2DC \uBBF8\uB9AC\uBCF4\uAE30\uC5D0 \uBC18\uC601." }, /* @__PURE__ */ React.createElement(Input, { value: (_i = contentDraft.ctaSecondary) != null ? _i : "", onChange: (e) => updateContent("ctaSecondary", e.target.value), placeholder: "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8 \uBCF4\uAE30" }))), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, marginBottom: 10 } }, "\uC2A4\uD0C0\uC77C \uD2B8\uC717"), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "EYEBROW \uC2A4\uD0C0\uC77C", onResetGroup: () => resetGroup("eyebrow") }, /* @__PURE__ */ React.createElement(Field, { label: `\uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${eff.eyebrow.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.eyebrow.fontSize,
      min: 8,
      max: 24,
      step: 1,
      onChange: (v) => updateStyle("eyebrow", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uAD75\uAE30" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: String(eff.eyebrow.fontWeight),
      options: HERO_WEIGHTS.map(String),
      onChange: (v) => updateStyle("eyebrow", "fontWeight", Number(v))
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uC790\uAC04 \xB7 ${eff.eyebrow.letterSpacing}em` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.eyebrow.letterSpacing,
      min: -0.05,
      max: 0.5,
      step: 0.01,
      onChange: (v) => updateStyle("eyebrow", "letterSpacing", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uC0C9\uC0C1" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.eyebrow.color,
      options: HERO_COLOR_OPTIONS,
      onChange: (v) => updateStyle("eyebrow", "color", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uB300\uC18C\uBB38\uC790" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.eyebrow.textTransform || "uppercase",
      options: HERO_TFORMS,
      onChange: (v) => updateStyle("eyebrow", "textTransform", v)
    }
  ))), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "TITLE \uC2A4\uD0C0\uC77C", onResetGroup: () => resetGroup("title") }, /* @__PURE__ */ React.createElement(Field, { label: `\uCD5C\uB300 \uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${eff.title.fontSize}px (\uBAA8\uBC14\uC77C\uC740 36px clamp)` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.title.fontSize,
      min: 32,
      max: 120,
      step: 1,
      onChange: (v) => updateStyle("title", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uAD75\uAE30" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: String(eff.title.fontWeight),
      options: HERO_WEIGHTS.map(String),
      onChange: (v) => updateStyle("title", "fontWeight", Number(v))
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uD589\uAC04 \xB7 ${eff.title.lineHeight}` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.title.lineHeight,
      min: 0.9,
      max: 1.6,
      step: 0.01,
      onChange: (v) => updateStyle("title", "lineHeight", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uC790\uAC04 \xB7 ${eff.title.letterSpacing}em` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.title.letterSpacing,
      min: -0.08,
      max: 0.1,
      step: 5e-3,
      onChange: (v) => updateStyle("title", "letterSpacing", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uC0C9\uC0C1" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.title.color,
      options: HERO_COLOR_OPTIONS,
      onChange: (v) => updateStyle("title", "color", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uAC15\uC870 \uC0C9\uC0C1 (TITLE 2)" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.title.accentColor,
      options: HERO_COLOR_OPTIONS,
      onChange: (v) => updateStyle("title", "accentColor", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uC815\uB82C (\uD788\uC5B4\uB85C \uC804\uCCB4)" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.title.textAlign || "left",
      options: HERO_ALIGNS,
      onChange: (v) => updateStyle("title", "textAlign", v)
    }
  ))), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "SUBTITLE \uC2A4\uD0C0\uC77C", onResetGroup: () => resetGroup("subtitle") }, /* @__PURE__ */ React.createElement(Field, { label: `\uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${eff.subtitle.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.subtitle.fontSize,
      min: 12,
      max: 28,
      step: 1,
      onChange: (v) => updateStyle("subtitle", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uAD75\uAE30" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: String(eff.subtitle.fontWeight),
      options: HERO_WEIGHTS.map(String),
      onChange: (v) => updateStyle("subtitle", "fontWeight", Number(v))
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uD589\uAC04 \xB7 ${eff.subtitle.lineHeight}` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.subtitle.lineHeight,
      min: 1.2,
      max: 2.4,
      step: 0.05,
      onChange: (v) => updateStyle("subtitle", "lineHeight", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uC0C9\uC0C1" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.subtitle.color,
      options: HERO_COLOR_OPTIONS,
      onChange: (v) => updateStyle("subtitle", "color", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uCD5C\uB300 \uB108\uBE44 \xB7 ${eff.subtitle.maxWidth}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.subtitle.maxWidth,
      min: 320,
      max: 800,
      step: 10,
      onChange: (v) => updateStyle("subtitle", "maxWidth", v)
    }
  ))), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "CTA \uBC84\uD2BC \uC2A4\uD0C0\uC77C", onResetGroup: () => resetGroup("cta") }, /* @__PURE__ */ React.createElement(Field, { label: "\uAD75\uAE30" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: String(eff.cta.fontWeight),
      options: HERO_WEIGHTS.map(String),
      onChange: (v) => updateStyle("cta", "fontWeight", Number(v))
    }
  ))), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, marginBottom: 10, marginTop: 20 } }, "\uBAA8\uBC14\uC77C \uBCC4\uB3C4 \uD2B8\uC717 (\u2264600px)"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginBottom: 10, lineHeight: 1.6 } }, "\u24D8 \uB370\uC2A4\uD06C\uD0D1 \uC2A4\uD0C0\uC77C \uC704\uC5D0 \uBA38\uC9C0\uB429\uB2C8\uB2E4. \uBE48 \uC2AC\uB86F\uC740 \uB370\uC2A4\uD06C\uD0D1 \uAC12 \uADF8\uB300\uB85C \uC0AC\uC6A9. \uBBF8\uB9AC\uBCF4\uAE30 \uC6B0\uC0C1\uB2E8\uC758 [\uBAA8\uBC14\uC77C] \uD1A0\uAE00\uB85C \uC989\uC2DC \uC2DC\uBBAC\uB808\uC774\uC158."), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "MOBILE \u2014 \uD0C0\uC774\uD2C0", onResetGroup: () => resetMobileGroup("title") }, /* @__PURE__ */ React.createElement(Field, { label: `\uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${effMobile.title.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: effMobile.title.fontSize,
      min: 20,
      max: 72,
      step: 1,
      onChange: (v) => updateMobile("title", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uD589\uAC04 \xB7 ${effMobile.title.lineHeight}` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: effMobile.title.lineHeight,
      min: 0.95,
      max: 1.6,
      step: 0.01,
      onChange: (v) => updateMobile("title", "lineHeight", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uC790\uAC04 \xB7 ${effMobile.title.letterSpacing}em` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: effMobile.title.letterSpacing,
      min: -0.05,
      max: 0.05,
      step: 5e-3,
      onChange: (v) => updateMobile("title", "letterSpacing", v)
    }
  ))), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "MOBILE \u2014 \uC11C\uBE0C\uD0C0\uC774\uD2C0", onResetGroup: () => resetMobileGroup("subtitle") }, /* @__PURE__ */ React.createElement(Field, { label: `\uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${effMobile.subtitle.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: effMobile.subtitle.fontSize,
      min: 11,
      max: 22,
      step: 1,
      onChange: (v) => updateMobile("subtitle", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uD589\uAC04 \xB7 ${effMobile.subtitle.lineHeight}` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: effMobile.subtitle.lineHeight,
      min: 1.3,
      max: 2.2,
      step: 0.05,
      onChange: (v) => updateMobile("subtitle", "lineHeight", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uCD5C\uB300 \uB108\uBE44 \xB7 ${effMobile.subtitle.maxWidth}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: effMobile.subtitle.maxWidth,
      min: 240,
      max: 500,
      step: 10,
      onChange: (v) => updateMobile("subtitle", "maxWidth", v)
    }
  ))), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "MOBILE \u2014 \uD1B5\uACC4 \uCE74\uB4DC \uAC12", onResetGroup: () => resetMobileGroup("stats") }, /* @__PURE__ */ React.createElement(Field, { label: `\uAC12 \uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${effMobile.stats.value.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: effMobile.stats.value.fontSize,
      min: 14,
      max: 32,
      step: 1,
      onChange: (v) => updateMobileStats("value", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uB77C\uBCA8 \uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${effMobile.stats.label.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: effMobile.stats.label.fontSize,
      min: 8,
      max: 14,
      step: 1,
      onChange: (v) => updateMobileStats("label", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uBD80\uC5F0 \uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${effMobile.stats.sub.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: effMobile.stats.sub.fontSize,
      min: 9,
      max: 16,
      step: 1,
      onChange: (v) => updateMobileStats("sub", "fontSize", v)
    }
  ))), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, marginBottom: 10, marginTop: 20 } }, "\uD1B5\uACC4 \uCE74\uB4DC \uCF58\uD150\uCE20"), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 14 } }, statsDraft.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: i < 2 ? 12 : 0 } }, /* @__PURE__ */ React.createElement(Field, { label: `#${i + 1} \uB77C\uBCA8` }, /* @__PURE__ */ React.createElement(Input, { value: s.label || "", onChange: (e) => updateStats(i, "label", e.target.value), placeholder: "\uC5EC\uD589\uC9C0" })), /* @__PURE__ */ React.createElement(Field, { label: `#${i + 1} \uD3F4\uBC31 \uAC12` }, /* @__PURE__ */ React.createElement(Input, { value: s.valueFallback || "", onChange: (e) => updateStats(i, "valueFallback", e.target.value), placeholder: "\uC804\uAD6D" })), /* @__PURE__ */ React.createElement(Field, { label: `#${i + 1} \uBD80\uC5F0` }, /* @__PURE__ */ React.createElement(Input, { value: s.sub || "", onChange: (e) => updateStats(i, "sub", e.target.value), placeholder: "\uC8FC\uC694 \uB2F5\uC0AC\uC9C0 \uC6B4\uC601" })))), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 8, lineHeight: 1.5 } }, "\u24D8 #2(\uD22C\uC5B4)\xB7#3(\uCEE4\uBBA4\uB2C8\uD2F0)\uB294 \uCF58\uD150\uCE20\uAC00 \uC788\uC73C\uBA74 \uAC2F\uC218(\uC608: ", /* @__PURE__ */ React.createElement("code", null, "3\uAC1C"), ") \uAC00 \uC6B0\uC120 \uD45C\uC2DC\uB418\uACE0, \uC5C6\uC744 \uB54C\uB9CC \uD3F4\uBC31 \uAC12\uC774 \uC0AC\uC6A9\uB429\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "\uD1B5\uACC4 \uCE74\uB4DC \u2014 \uB77C\uBCA8 \uC2A4\uD0C0\uC77C", onResetGroup: () => resetStatsGroup("label") }, /* @__PURE__ */ React.createElement(Field, { label: `\uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${eff.stats.label.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.stats.label.fontSize,
      min: 8,
      max: 20,
      step: 1,
      onChange: (v) => updateStatsStyle("label", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uAD75\uAE30" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: String(eff.stats.label.fontWeight),
      options: HERO_WEIGHTS.map(String),
      onChange: (v) => updateStatsStyle("label", "fontWeight", Number(v))
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: `\uC790\uAC04 \xB7 ${eff.stats.label.letterSpacing}em` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.stats.label.letterSpacing,
      min: 0,
      max: 0.5,
      step: 0.01,
      onChange: (v) => updateStatsStyle("label", "letterSpacing", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uC0C9\uC0C1" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.stats.label.color,
      options: HERO_COLOR_OPTIONS,
      onChange: (v) => updateStatsStyle("label", "color", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uB300\uC18C\uBB38\uC790" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.stats.label.textTransform || "uppercase",
      options: HERO_TFORMS,
      onChange: (v) => updateStatsStyle("label", "textTransform", v)
    }
  ))), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "\uD1B5\uACC4 \uCE74\uB4DC \u2014 \uAC12 \uC2A4\uD0C0\uC77C", onResetGroup: () => resetStatsGroup("value") }, /* @__PURE__ */ React.createElement(Field, { label: `\uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${eff.stats.value.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.stats.value.fontSize,
      min: 14,
      max: 48,
      step: 1,
      onChange: (v) => updateStatsStyle("value", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uAD75\uAE30" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: String(eff.stats.value.fontWeight),
      options: HERO_WEIGHTS.map(String),
      onChange: (v) => updateStatsStyle("value", "fontWeight", Number(v))
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uC0C9\uC0C1" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.stats.value.color,
      options: HERO_COLOR_OPTIONS,
      onChange: (v) => updateStatsStyle("value", "color", v)
    }
  ))), /* @__PURE__ */ React.createElement(HE_StyleGroup, { title: "\uD1B5\uACC4 \uCE74\uB4DC \u2014 \uBD80\uC5F0 \uC2A4\uD0C0\uC77C", onResetGroup: () => resetStatsGroup("sub") }, /* @__PURE__ */ React.createElement(Field, { label: `\uD3F0\uD2B8 \uD06C\uAE30 \xB7 ${eff.stats.sub.fontSize}px` }, /* @__PURE__ */ React.createElement(
    NumberRange,
    {
      value: eff.stats.sub.fontSize,
      min: 10,
      max: 20,
      step: 1,
      onChange: (v) => updateStatsStyle("sub", "fontSize", v)
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "\uC0C9\uC0C1" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      value: eff.stats.sub.color,
      options: HERO_COLOR_OPTIONS,
      onChange: (v) => updateStatsStyle("sub", "color", v)
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: save }, "\uC800\uC7A5"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: resetAll, style: { borderColor: "var(--line-2)" } }, "\uC804\uCCB4 default \uBCF5\uC6D0"), msg && /* @__PURE__ */ React.createElement("span", { role: "status", className: "mono", style: { fontSize: 12, color: "var(--secondary)", fontWeight: 600, alignSelf: "center" } }, msg))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16 } }, "\uB77C\uC774\uBE0C \uBBF8\uB9AC\uBCF4\uAE30"), /* @__PURE__ */ React.createElement("div", { role: "tablist", "aria-label": "\uBBF8\uB9AC\uBCF4\uAE30 viewport", style: { display: "flex", gap: 6 } }, [{ key: "desktop", label: "\uB370\uC2A4\uD06C\uD0D1" }, { key: "mobile", label: "\uBAA8\uBC14\uC77C" }].map((m) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: m.key,
      type: "button",
      role: "tab",
      "aria-selected": previewMode === m.key,
      onClick: () => setPreviewMode(m.key),
      className: "btn btn-small",
      style: {
        fontSize: 11,
        borderColor: previewMode === m.key ? "var(--primary)" : "var(--line-2)",
        color: previewMode === m.key ? "var(--primary)" : "var(--ink-2)",
        background: previewMode === m.key ? "rgba(245,213,72,0.10)" : "var(--bg-2)",
        fontWeight: previewMode === m.key ? 700 : 500
      }
    },
    m.label
  )))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 0, overflow: "hidden", position: "sticky", top: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", padding: "8px 12px", borderBottom: "1px solid var(--line)", background: "var(--bg-2)" } }, "PREVIEW \xB7 ", previewMode === "mobile" ? "360px \uBAA8\uBC14\uC77C \uC2DC\uBBAC\uB808\uC774\uC158" : "\uC2E4\uC81C \uD648 \uD788\uC5B4\uB85C\uC640 \uB3D9\uC77C \uB9C8\uD06C\uC5C5"), /* @__PURE__ */ React.createElement("div", { style: {
    padding: previewMode === "mobile" ? "24px 16px 24px" : "40px 24px 32px",
    maxWidth: previewMode === "mobile" ? 360 : "100%",
    margin: previewMode === "mobile" ? "0 auto" : void 0,
    textAlign: effPreview.title.textAlign || "left"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--font-mono)",
    fontSize: effPreview.eyebrow.fontSize,
    fontWeight: effPreview.eyebrow.fontWeight,
    letterSpacing: `${effPreview.eyebrow.letterSpacing}em`,
    color: `var(${effPreview.eyebrow.color})`,
    textTransform: effPreview.eyebrow.textTransform || "uppercase",
    marginBottom: 16
  } }, contentDraft.eyebrow || "BANGINOJA \xB7 \uBC45\uAE30\uD0C0\uACE0 \uB178\uC790"), /* @__PURE__ */ React.createElement("h1", { style: {
    fontFamily: "var(--font-display)",
    fontSize: previewMode === "mobile" ? `${effPreview.title.fontSize}px` : `clamp(28px, 5vw, ${effPreview.title.fontSize}px)`,
    fontWeight: effPreview.title.fontWeight,
    lineHeight: effPreview.title.lineHeight,
    letterSpacing: `${effPreview.title.letterSpacing}em`,
    marginBottom: 16,
    color: `var(${effPreview.title.color})`
  } }, contentDraft.title1 || "\uBC45\uAE30\uD0C0\uACE0", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: `var(${effPreview.title.accentColor})` } }, contentDraft.title2 || "\uD55C\uAD6D\uC744"), /* @__PURE__ */ React.createElement("br", null), contentDraft.title3 || "\uB290\uB07C\uB2E4"), /* @__PURE__ */ React.createElement("p", { style: {
    fontSize: effPreview.subtitle.fontSize,
    fontWeight: effPreview.subtitle.fontWeight,
    lineHeight: effPreview.subtitle.lineHeight,
    color: `var(${effPreview.subtitle.color})`,
    maxWidth: effPreview.subtitle.maxWidth,
    marginBottom: 22,
    marginLeft: effPreview.title.textAlign === "center" ? "auto" : void 0,
    marginRight: effPreview.title.textAlign === "center" ? "auto" : void 0,
    whiteSpace: "pre-wrap"
  } }, contentDraft.subtitle || "\uAD81\uAD90 \uB2F5\uC0AC\uBD80\uD130 \uC9C0\uC5ED \uC5EC\uD589 \uCF54\uC2A4\uAE4C\uC9C0. \uBC45\uAE30\uB178\uC790\uC640 \uD568\uAED8 \uD55C\uAD6D\uC758 \uC5ED\uC0AC\xB7\uBB38\uD654\xB7\uC790\uC5F0\uC744 \uC628\uBAB8\uC73C\uB85C \uACBD\uD5D8\uD558\uB294 \uC5EC\uD589 \uCEE4\uBBA4\uB2C8\uD2F0\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: effPreview.title.textAlign === "center" ? "center" : effPreview.title.textAlign === "right" ? "flex-end" : "flex-start"
  } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", style: { fontWeight: effPreview.cta.fontWeight } }, contentDraft.mapHint || "\uC9C0\uB3C4\uC5D0\uC11C \uC5EC\uD589\uC9C0 \uCC3E\uAE30 \u2192"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", style: { fontWeight: effPreview.cta.fontWeight } }, contentDraft.ctaPrimary || "\uCEE4\uBBA4\uB2C8\uD2F0 \uCC38\uC5EC\uD558\uAE30"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", style: { fontWeight: effPreview.cta.fontWeight } }, contentDraft.ctaSecondary || "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8 \uBCF4\uAE30")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, paddingTop: 18, borderTop: "1px solid var(--line)", marginTop: 24 } }, statsDraft.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--font-serif)",
    fontSize: effPreview.stats.value.fontSize,
    fontWeight: effPreview.stats.value.fontWeight,
    color: `var(${effPreview.stats.value.color})`,
    marginBottom: 4
  } }, s.valueFallback || "\u2014"), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--font-mono)",
    fontSize: effPreview.stats.label.fontSize,
    fontWeight: effPreview.stats.label.fontWeight,
    letterSpacing: `${effPreview.stats.label.letterSpacing}em`,
    color: `var(${effPreview.stats.label.color})`,
    textTransform: effPreview.stats.label.textTransform || "uppercase",
    marginBottom: 3
  } }, s.label || "\uB77C\uBCA8"), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: effPreview.stats.sub.fontSize,
    color: `var(${effPreview.stats.sub.color})`
  } }, s.sub || "\uBD80\uC5F0")))))))));
};
const ESS_CategoryEditor = ({ rows, onAdd, onRemove, onUpdate, onMove }) => /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em" } }, "\uCE74\uD14C\uACE0\uB9AC (", rows.length, ")"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: onAdd }, "\uFF0B \uCE74\uD14C\uACE0\uB9AC")), rows.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, fontStyle: "italic" } }, "(\uBBF8\uB178\uCD9C)"), rows.map((c, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: 6, marginBottom: 6, alignItems: "center" } }, /* @__PURE__ */ React.createElement(
  "input",
  {
    type: "text",
    className: "field-input",
    value: c || "",
    onChange: (e) => onUpdate(i, e.target.value),
    style: { padding: "5px 8px", fontSize: 13 }
  }
), /* @__PURE__ */ React.createElement(TPE_RowActions, { i, total: rows.length, onMove, onRemove }))));
const EatSleepShopAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [msg, setMsg] = React.useState("");
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2200);
  };
  const KINDS = [
    { key: "eatIntro", label: "\uBA39\uACE0 \uB180\uC790 (/eat)", accentDefault: "#E8A540" },
    { key: "sleepIntro", label: "\uC790\uACE0 \uB180\uC790 (/sleep)", accentDefault: "#5A8FBF" },
    { key: "shopIntro", label: "\uC0AC\uACE0 \uB180\uC790 (/shop)", accentDefault: "#9C6FB3" }
  ];
  const [drafts, setDrafts] = React.useState(() => {
    const out = {};
    for (const k of KINDS) {
      const cur = sc[k.key] || {};
      out[k.key] = {
        eyebrow: cur.eyebrow || "",
        title: cur.title || "",
        sub: cur.sub || "",
        desc: cur.desc || "",
        accent: cur.accent || k.accentDefault,
        categories: Array.isArray(cur.categories) ? cur.categories.slice() : []
      };
    }
    return out;
  });
  const update = (kind, patch) => setDrafts((prev) => ({ ...prev, [kind]: { ...prev[kind], ...patch } }));
  const save = async (kind) => {
    try {
      const d = drafts[kind];
      const clean = {
        eyebrow: String(d.eyebrow || ""),
        title: String(d.title || ""),
        sub: String(d.sub || ""),
        desc: String(d.desc || ""),
        accent: String(d.accent || ""),
        categories: (Array.isArray(d.categories) ? d.categories : []).filter((c) => c && String(c).trim()).map((c) => String(c).trim())
      };
      await window.BGNJ_SITE_CONTENT.saveSection(kind, clean);
      setTick((v) => v + 1);
      flash(`'${kind}' \uC800\uC7A5\uB428.`);
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 18, lineHeight: 1.8 } }, "\uB180\uC790 \uC2DC\uB9AC\uC988 \u2014 ", /* @__PURE__ */ React.createElement("code", null, "/eat"), " / ", /* @__PURE__ */ React.createElement("code", null, "/sleep"), " / ", /* @__PURE__ */ React.createElement("code", null, "/shop"), " \uD398\uC774\uC9C0\uC758 \uC778\uD2B8\uB85C (eyebrow / title / sub / desc / accent) + \uCE74\uD14C\uACE0\uB9AC \uBAA9\uB85D \uD3B8\uC9D1. \uCE74\uD14C\uACE0\uB9AC\uB294 \uC6B0\uCE21 \uC0AC\uC774\uB4DC \uADF8\uB9AC\uB4DC\uC758 \uCE69 \uB77C\uBCA8\uB85C \uB178\uCD9C\uB428. \uBE44\uC6B0\uBA74 \uD398\uC774\uC9C0\uC5D0\uC11C \uCE74\uD14C\uACE0\uB9AC \uC139\uC158 \uBBF8\uB178\uCD9C."), KINDS.map((k) => {
    const d = drafts[k.key];
    return /* @__PURE__ */ React.createElement("section", { key: k.key, className: "card", style: { padding: 18, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, margin: 0 } }, k.label), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: () => save(k.key) }, "\uC800\uC7A5")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uC544\uC774\uBE0C\uB85C\uC6B0"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: d.eyebrow,
        onChange: (e) => update(k.key, { eyebrow: e.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uD070 \uC81C\uBAA9"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: d.title,
        onChange: (e) => update(k.key, { title: e.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uC81C\uBAA9 \uC6B0\uCE21 \uC791\uC740 \uBD80\uC81C"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: d.sub,
        onChange: (e) => update(k.key, { sub: e.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uBCF8\uBB38 \uC124\uBA85"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        className: "field-input",
        rows: 3,
        value: d.desc,
        onChange: (e) => update(k.key, { desc: e.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uBD80\uC81C \uAC15\uC870 \uC0C9\uC0C1 (HEX)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "field-input",
        value: d.accent,
        onChange: (e) => update(k.key, { accent: e.target.value }),
        placeholder: k.accentDefault
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uC0C9\uC0C1 \uBBF8\uB9AC\uBCF4\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", border: "1px solid var(--line-2)", background: "var(--bg-2)", borderRadius: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", width: 24, height: 24, borderRadius: 3, background: d.accent || k.accentDefault, border: "1px solid var(--line-2)" } }), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, d.accent || k.accentDefault)))), /* @__PURE__ */ React.createElement(
      ESS_CategoryEditor,
      {
        rows: d.categories,
        onAdd: () => update(k.key, { categories: _arrAdd(d.categories, "") }),
        onRemove: (i) => update(k.key, { categories: _arrRemove(d.categories, i) }),
        onUpdate: (i, v) => update(k.key, { categories: _arrUpdate(d.categories, i, v) }),
        onMove: (i, dir) => update(k.key, { categories: _arrMove(d.categories, i, dir) })
      }
    ));
  }), msg && /* @__PURE__ */ React.createElement("p", { role: "status", className: "mono", style: { fontSize: 12, color: "var(--secondary)", fontWeight: 600, marginTop: 10 } }, msg));
};
const KIND_META = {
  eat: { label: "\uBA39\uACE0 \uB180\uC790", hint: "\uBC45\uAE30\uB178\uC790\uAC00 \uCD94\uCC9C\uD558\uB294 \uC2DD\uB2F9, \uC2DC\uC7A5, \uD5A5\uD1A0 \uC74C\uC2DD, \uC9C0\uC5ED \uCD95\uC81C. \uD30C\uD2B8\uB108 \uAC00\uAC8C \uB4F1\uB85D.", accentDefault: "#E8A540" },
  sleep: { label: "\uC790\uACE0 \uB180\uC790", hint: "\uBC45\uAE30\uB178\uC790 \uD30C\uD2B8\uB108 \uC219\uC18C / \uD55C\uC625 \uC2A4\uD14C\uC774 / \uACE0\uD0DD / \uCD94\uCC9C \uBA38\uBB34\uB984.", accentDefault: "#5A8FBF" },
  shop: { label: "\uC0AC\uACE0 \uB180\uC790", hint: "\uC9C0\uC5ED \uD2B9\uC0B0\uD488 / \uACF5\uC608 / \uD589\uC0AC / \uCD94\uCC9C \uAD6C\uB9E4\uCC98.", accentDefault: "#9C6FB3" }
};
const KindPagePanel = ({ kind = "eat" }) => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [msg, setMsg] = React.useState("");
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2200);
  };
  const meta = KIND_META[kind] || KIND_META.eat;
  const introKey = `${kind}Intro`;
  const itemsKey = `${kind}Items`;
  const initIntro = () => {
    const cur = sc[introKey] || {};
    return {
      eyebrow: cur.eyebrow || "",
      title: cur.title || "",
      sub: cur.sub || "",
      desc: cur.desc || "",
      accent: cur.accent || meta.accentDefault,
      categories: Array.isArray(cur.categories) ? cur.categories.slice() : []
    };
  };
  const [intro, setIntro] = React.useState(initIntro);
  React.useEffect(() => {
    setIntro(initIntro());
  }, [tick, kind]);
  const saveIntro = async () => {
    try {
      const clean = {
        eyebrow: String(intro.eyebrow || ""),
        title: String(intro.title || ""),
        sub: String(intro.sub || ""),
        desc: String(intro.desc || ""),
        accent: String(intro.accent || ""),
        categories: (Array.isArray(intro.categories) ? intro.categories : []).filter((c) => c && String(c).trim()).map((c) => String(c).trim())
      };
      await window.BGNJ_SITE_CONTENT.saveSection(introKey, clean);
      setTick((v) => v + 1);
      flash("\uC778\uD2B8\uB85C \uC800\uC7A5\uB428.");
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const initItems = () => Array.isArray(sc[itemsKey]) ? sc[itemsKey].slice() : [];
  const [items, setItems] = React.useState(initItems);
  React.useEffect(() => {
    setItems(initItems());
  }, [tick, kind]);
  const updateItem = (i, patch) => setItems((arr) => arr.map((it, j) => j === i ? { ...it, ...patch } : it));
  const addItem = () => {
    setItems((arr) => [...arr, {
      id: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: "",
      region: "",
      address: "",
      category: "",
      desc: "",
      imageUrl: "",
      link: "",
      tags: ""
    }]);
  };
  const removeItem = (i) => {
    var _a;
    if (!confirm(`"${((_a = items[i]) == null ? void 0 : _a.name) || "\uD56D\uBAA9"}" \uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?`)) return;
    setItems((arr) => arr.filter((_, j) => j !== i));
  };
  const moveItem = (i, dir) => {
    setItems((arr) => {
      const next = arr.slice();
      const j = i + dir;
      if (j < 0 || j >= next.length) return arr;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const onPickItemImage = async (i, e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    e.target.value = "";
    if (!file) return;
    try {
      const { url } = await window.BGNJ_MEDIA.uploadFile(file, { folder: `${kind}-items`, maxBytes: 5 * 1024 * 1024 });
      updateItem(i, { imageUrl: url });
      return;
    } catch (err) {
      console.warn("[v00.106] R2 \uB180\uC790 \uC544\uC774\uD15C \uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC \uC2E4\uD328 \u2014 dataURI \uD3F4\uBC31:", err);
    }
    if (file.size > 1.5 * 1024 * 1024) {
      alert(`\uC774\uBBF8\uC9C0\uAC00 \uB108\uBB34 \uD07D\uB2C8\uB2E4(${(file.size / 1024 / 1024).toFixed(1)}MB). R2 \uC2E4\uD328 + 1.5MB \uD3F4\uBC31 \uD55C\uB3C4 \uCD08\uACFC.`);
      return;
    }
    const dataUri = await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.readAsDataURL(file);
    });
    updateItem(i, { imageUrl: dataUri });
  };
  const saveItems = async () => {
    try {
      const clean = items.map((it) => ({
        id: it.id || `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: String(it.name || "").trim(),
        region: String(it.region || "").trim(),
        address: String(it.address || "").trim(),
        category: String(it.category || "").trim(),
        desc: String(it.desc || "").trim(),
        imageUrl: String(it.imageUrl || ""),
        link: String(it.link || "").trim(),
        tags: String(it.tags || "").trim()
      })).filter((it) => it.name);
      await window.BGNJ_SITE_CONTENT.saveSection(itemsKey, clean);
      setTick((v) => v + 1);
      flash(`${meta.label} \uCF58\uD150\uCE20 ${clean.length}\uAC1C \uC800\uC7A5\uB428.`);
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 18, lineHeight: 1.8 } }, /* @__PURE__ */ React.createElement("strong", { className: "gold" }, meta.label), " \u2014 ", meta.hint), /* @__PURE__ */ React.createElement("section", { className: "card", style: { padding: 18, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, margin: 0 } }, "\u2460 \uC778\uD2B8\uB85C (\uD398\uC774\uC9C0 \uC0C1\uB2E8)"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: saveIntro }, "\uC778\uD2B8\uB85C \uC800\uC7A5")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uC544\uC774\uBE0C\uB85C\uC6B0"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: intro.eyebrow, onChange: (e) => setIntro({ ...intro, eyebrow: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uD070 \uC81C\uBAA9"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: intro.title, onChange: (e) => setIntro({ ...intro, title: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uC81C\uBAA9 \uC6B0\uCE21 \uC791\uC740 \uBD80\uC81C"), /* @__PURE__ */ React.createElement("input", { className: "field-input", value: intro.sub, onChange: (e) => setIntro({ ...intro, sub: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uBCF8\uBB38 \uC124\uBA85"), /* @__PURE__ */ React.createElement("textarea", { className: "field-input", rows: 3, value: intro.desc, onChange: (e) => setIntro({ ...intro, desc: e.target.value }) })), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uBD80\uC81C \uAC15\uC870 \uC0C9\uC0C1 (HEX)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      value: intro.accent,
      placeholder: meta.accentDefault,
      onChange: (e) => setIntro({ ...intro, accent: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "\uC0C9\uC0C1 \uBBF8\uB9AC\uBCF4\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", border: "1px solid var(--line-2)", background: "var(--bg-2)", borderRadius: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", width: 24, height: 24, borderRadius: 3, background: intro.accent || meta.accentDefault, border: "1px solid var(--line-2)" } }), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, intro.accent || meta.accentDefault)))), /* @__PURE__ */ React.createElement(
    ESS_CategoryEditor,
    {
      rows: intro.categories,
      onAdd: () => setIntro({ ...intro, categories: _arrAdd(intro.categories, "") }),
      onRemove: (i) => setIntro({ ...intro, categories: _arrRemove(intro.categories, i) }),
      onUpdate: (i, v) => setIntro({ ...intro, categories: _arrUpdate(intro.categories, i, v) }),
      onMove: (i, dir) => setIntro({ ...intro, categories: _arrMove(intro.categories, i, dir) })
    }
  )), /* @__PURE__ */ React.createElement("section", { className: "card", style: { padding: 18, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, margin: 0 } }, "\u2461 \uCF58\uD150\uCE20 (\uD30C\uD2B8\uB108\xB7\uCD94\uCC9C\xB7\uD2B9\uC0B0\uD488)"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 4, lineHeight: 1.6 } }, "\uAC01 \uD56D\uBAA9: \uC774\uB984\xB7\uC9C0\uC5ED\xB7\uC8FC\uC18C\xB7\uCE74\uD14C\uACE0\uB9AC\xB7\uC124\uBA85\xB7\uC774\uBBF8\uC9C0\xB7\uB9C1\uD06C\xB7\uD0DC\uADF8.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: addItem }, "\uFF0B \uD56D\uBAA9 \uCD94\uAC00"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: saveItems }, "\uBAA8\uB4E0 \uD56D\uBAA9 \uC800\uC7A5"))), items.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, textAlign: "center", padding: "24px 0", background: "var(--bg-2)", border: "1px dashed var(--line)", borderRadius: 2 } }, "\u24D8 \uD56D\uBAA9\uC774 \uC5C6\uC73C\uBA74 \uD398\uC774\uC9C0\uC5D0\uC11C \uCF58\uD150\uCE20 \uC139\uC158 \uBBF8\uB178\uCD9C."), items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: it.id || i, style: {
    padding: "14px",
    marginBottom: 10,
    background: i % 2 === 0 ? "var(--bg-2)" : "var(--bg)",
    border: "1px solid var(--line)",
    borderRadius: 2
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11, fontWeight: 600 } }, String(i + 1).padStart(2, "0")), /* @__PURE__ */ React.createElement("span", { className: "ko-serif", style: { fontSize: 14, color: "var(--ink)" } }, it.name || "(\uC774\uB984 \uBBF8\uC785\uB825)")), /* @__PURE__ */ React.createElement(TPE_RowActions, { i, total: items.length, onMove: moveItem, onRemove: removeItem })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "140px 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    width: "100%",
    aspectRatio: "4/3",
    flexShrink: 0,
    border: "1px solid var(--line)",
    background: "var(--bg)",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    marginBottom: 6
  } }, it.imageUrl ? /* @__PURE__ */ React.createElement("img", { src: it.imageUrl, alt: it.name || "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 9, letterSpacing: "0.18em" } }, "NONE")), /* @__PURE__ */ React.createElement("label", { className: "btn btn-small", style: { cursor: "pointer", width: "100%", textAlign: "center", display: "block" } }, "\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", onChange: (e) => onPickItemImage(i, e), style: { display: "none" } })), it.imageUrl && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => updateItem(i, { imageUrl: "" }),
      style: { borderColor: "var(--danger)", color: "var(--danger)", width: "100%", marginTop: 4, fontSize: 10 }
    },
    "\uC774\uBBF8\uC9C0 \uC81C\uAC70"
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("span", { className: "field-label", style: { fontSize: 10 } }, "\uC774\uB984"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      value: it.name || "",
      onChange: (e) => updateItem(i, { name: e.target.value }),
      style: { padding: "6px 8px", fontSize: 13 }
    }
  )), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label", style: { fontSize: 10 } }, "\uC9C0\uC5ED"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      value: it.region || "",
      onChange: (e) => updateItem(i, { region: e.target.value }),
      placeholder: "\uC608: \uC11C\uC6B8 \uC885\uB85C\uAD6C",
      style: { padding: "6px 8px", fontSize: 13 }
    }
  )), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label", style: { fontSize: 10 } }, "\uCE74\uD14C\uACE0\uB9AC"), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "field-input",
      value: it.category || "",
      onChange: (e) => updateItem(i, { category: e.target.value }),
      style: { padding: "6px 8px", fontSize: 13 }
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 \uC120\uD0DD \u2014"),
    (intro.categories || []).map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c))
  )), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("span", { className: "field-label", style: { fontSize: 10 } }, "\uC8FC\uC18C"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      value: it.address || "",
      onChange: (e) => updateItem(i, { address: e.target.value }),
      style: { padding: "6px 8px", fontSize: 13 }
    }
  )), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0, gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("span", { className: "field-label", style: { fontSize: 10 } }, "\uC124\uBA85"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-input",
      rows: 2,
      value: it.desc || "",
      onChange: (e) => updateItem(i, { desc: e.target.value }),
      style: { padding: "6px 8px", fontSize: 13 }
    }
  )), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label", style: { fontSize: 10 } }, "\uC678\uBD80 \uB9C1\uD06C (\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      value: it.link || "",
      onChange: (e) => updateItem(i, { link: e.target.value }),
      placeholder: "https://...",
      style: { padding: "6px 8px", fontSize: 13 }
    }
  )), /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label", style: { fontSize: 10 } }, "\uD0DC\uADF8 (\uCF64\uB9C8 \uAD6C\uBD84)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      value: it.tags || "",
      onChange: (e) => updateItem(i, { tags: e.target.value }),
      placeholder: "\uC608: \uD55C\uC815\uC2DD, \uC885\uAC00",
      style: { padding: "6px 8px", fontSize: 13 }
    }
  ))))))), msg && /* @__PURE__ */ React.createElement("p", { role: "status", className: "mono", style: { fontSize: 12, color: "var(--secondary)", fontWeight: 600, marginTop: 10 } }, msg));
};
const HOME_PREVIEW_MODES = [
  { key: "desktop", label: "PC", width: 1180 },
  { key: "tablet", label: "\uD0DC\uBE14\uB9BF", width: 760 },
  { key: "mobile", label: "\uBAA8\uBC14\uC77C", width: 360 }
];
const HOME_TEXT_GROUPS = [
  {
    title: "\uD788\uC5B4\uB85C",
    section: "hero",
    fields: [
      ["eyebrow", "\uC0C1\uB2E8 \uC791\uC740 \uBB38\uAD6C", "\uBA39\uACE0 \uC790\uACE0 \uAC77\uACE0 \uC77D\uB294 \uD55C\uAD6D"],
      ["title1", "\uC81C\uBAA9 1\uD589", "\uD55C\uAD6D\uC744"],
      ["title2", "\uC81C\uBAA9 2\uD589", "\uC9C1\uC811 \uAC77\uACE0"],
      ["title3", "\uC81C\uBAA9 3\uD589", "\uCC9C\uCC9C\uD788 \uC77D\uB2E4"],
      ["subtitle", "\uBCF8\uBB38 \uC124\uBA85", "\uAD81\uAD90\uACFC \uACE8\uBAA9, \uC2DC\uC7A5\uACFC \uC219\uC18C, \uCC45\uACFC \uAC15\uC5F0\uC744 \uC624\uAC00\uBA70 \uD55C\uAD6D\uC744 \uC870\uAE08 \uB354 \uAC00\uAE4C\uC774 \uBD05\uB2C8\uB2E4."],
      ["ctaPrimary", "\uAE30\uBCF8 \uBC84\uD2BC", "\uCEE4\uBBA4\uB2C8\uD2F0 \uBCF4\uAE30"],
      ["ctaSecondary", "\uBCF4\uC870 \uBC84\uD2BC", "\uB2F5\uC0AC \uC77C\uC815 \uBCF4\uAE30"]
    ]
  },
  {
    title: "\uD788\uC5B4\uB85C \uC6B0\uCE21 \uC77C\uC815 \uCE74\uB4DC",
    fields: [
      ["heroRecentLectureLabel", "\uCD5C\uADFC \uAC15\uC5F0 \uB77C\uBCA8"],
      ["heroNextLectureLabel", "\uB2E4\uC74C \uAC15\uC5F0 \uB77C\uBCA8"],
      ["heroNextTourLabel", "\uB2E4\uC74C \uB2F5\uC0AC \uB77C\uBCA8"],
      ["heroNoLectureText", "\uAC15\uC5F0 \uC5C6\uC74C \uBB38\uAD6C"],
      ["heroNoLectureCta", "\uAC15\uC5F0 \uC5C6\uC74C \uBC84\uD2BC"],
      ["heroNoTourText", "\uB2F5\uC0AC \uC5C6\uC74C \uBB38\uAD6C"],
      ["heroNoTourCta", "\uB2F5\uC0AC \uC5C6\uC74C \uBC84\uD2BC"],
      ["venueFallback", "\uC7A5\uC18C \uBBF8\uC815 \uBB38\uAD6C"],
      ["emptyFallback", "\uBE48 \uAC12 \uD45C\uC2DC"]
    ]
  },
  {
    title: "\uCD94\uCC9C \uC5EC\uD589\uC9C0",
    fields: [
      ["recEyebrow", "\uC0C1\uB2E8 \uC791\uC740 \uBB38\uAD6C"],
      ["recTitlePrefix", "\uC81C\uBAA9 \uC55E"],
      ["recTitleAccent", "\uC81C\uBAA9 \uAC15\uC870"],
      ["recTitleSuffix", "\uC81C\uBAA9 \uB4A4"],
      ["recSubtitle", "\uC124\uBA85"],
      ["recAction", "\uBC84\uD2BC"]
    ]
  },
  {
    title: "\uB2F5\uC0AC \uC77C\uC815",
    fields: [
      ["tourEyebrow", "\uC0C1\uB2E8 \uC791\uC740 \uBB38\uAD6C"],
      ["tourTitle", "\uC81C\uBAA9"],
      ["tourSubtitle", "\uC124\uBA85"],
      ["tourAction", "\uBC84\uD2BC"],
      ["tourNextLabel", "\uCE74\uB4DC \uC77C\uC815 \uB77C\uBCA8"],
      ["tourPriceLabel", "\uCE74\uB4DC \uAC00\uACA9 \uB77C\uBCA8"]
    ]
  },
  {
    title: "\uCEE4\uBBA4\uB2C8\uD2F0",
    fields: [
      ["communityEyebrow", "\uC0C1\uB2E8 \uC791\uC740 \uBB38\uAD6C"],
      ["communityTitle", "\uC81C\uBAA9"],
      ["communitySubtitle", "\uC124\uBA85"],
      ["communityAction", "\uBC84\uD2BC"],
      ["communityReplyLabel", "\uB313\uAE00 \uB77C\uBCA8"],
      ["communityEmptyTitle", "\uBE48 \uC0C1\uD0DC \uC81C\uBAA9"],
      ["communityEmptySubtitle", "\uBE48 \uC0C1\uD0DC \uC124\uBA85"],
      ["communityEmptyCta", "\uBE48 \uC0C1\uD0DC \uBC84\uD2BC"]
    ]
  },
  {
    title: "\uCE7C\uB7FC",
    fields: [
      ["columnEyebrow", "\uC0C1\uB2E8 \uC791\uC740 \uBB38\uAD6C"],
      ["columnTitle", "\uC81C\uBAA9"],
      ["columnSubtitle", "\uC124\uBA85"],
      ["columnAction", "\uBC84\uD2BC"],
      ["columnReadMore", "\uB354 \uC77D\uAE30 \uB77C\uBCA8"],
      ["columnEmpty", "\uBAA9\uB85D \uC5C6\uC74C \uBB38\uAD6C"]
    ]
  },
  {
    title: "\uAC15\uC5F0",
    fields: [
      ["lecturesEyebrow", "\uC0C1\uB2E8 \uC791\uC740 \uBB38\uAD6C"],
      ["lecturesTitle", "\uC81C\uBAA9"],
      ["lecturesAction", "\uBC84\uD2BC"],
      ["lectureBadge", "\uCE74\uB4DC \uBC30\uC9C0"]
    ]
  },
  {
    title: "\uB3C4\uC11C CTA",
    fields: [
      ["bookEyebrowPrefix", "\uCD9C\uD310 \uB77C\uBCA8"],
      ["bookBuyCta", "\uAD6C\uB9E4 \uBC84\uD2BC"],
      ["bookKrLabel", "\uAD6D\uBB38\uD310 \uB77C\uBCA8"],
      ["bookEnLabel", "\uC601\uBB38\uD310 \uB77C\uBCA8"],
      ["bookAuthorSuffix", "\uC800\uC790 \uB4A4 \uBB38\uAD6C"]
    ]
  }
];
const HomeTextInput = ({ label, value, onChange, placeholder, multiline }) => /* @__PURE__ */ React.createElement("label", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, label), multiline ? /* @__PURE__ */ React.createElement(
  "textarea",
  {
    className: "field-input",
    rows: 3,
    value: value || "",
    placeholder: placeholder || "",
    onChange: (e) => onChange(e.target.value),
    style: { fontFamily: "inherit", resize: "vertical" }
  }
) : /* @__PURE__ */ React.createElement(
  "input",
  {
    className: "field-input",
    value: value || "",
    placeholder: placeholder || "",
    onChange: (e) => onChange(e.target.value)
  }
));
const HomePreviewSection = ({ eyebrow, title, subtitle, action }) => /* @__PURE__ */ React.createElement("section", { style: { padding: "26px 24px", borderBottom: "1px solid var(--line)", background: "var(--bg)" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", style: { marginBottom: 10 } }, eyebrow), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("h3", { className: "section-title", style: { fontSize: 28, marginBottom: 8 } }, title), subtitle && /* @__PURE__ */ React.createElement("p", { className: "section-subtitle", style: { fontSize: 13, maxWidth: 520 } }, subtitle)), action && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-ghost", style: { flexShrink: 0 } }, action)));
const HomeTextPreview = ({ hero, text, mode }) => {
  var _a;
  const isMobile = mode.key === "mobile";
  const isTablet = mode.key === "tablet";
  const heroTitleSize = isMobile ? 34 : isTablet ? 44 : 54;
  const _fs = Number((_a = text == null ? void 0 : text.fontScale) != null ? _a : 1);
  const fontScale = isFinite(_fs) ? Math.max(0.85, Math.min(1.2, _fs)) : 1;
  return /* @__PURE__ */ React.createElement("div", { style: {
    width: mode.width,
    maxWidth: "100%",
    margin: "0 auto",
    background: "var(--bg)",
    border: "1px solid var(--line)",
    boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
    overflow: "hidden",
    fontSize: `${fontScale}em`
  } }, /* @__PURE__ */ React.createElement("section", { className: "home-hero", style: { padding: isMobile ? "34px 20px" : "46px 32px", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr", gap: isMobile ? 24 : 34, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", style: { marginBottom: 14 } }, hero.eyebrow || "\uBA39\uACE0 \uC790\uACE0 \uAC77\uACE0 \uC77D\uB294 \uD55C\uAD6D"), /* @__PURE__ */ React.createElement("h2", { style: {
    fontFamily: "var(--font-display)",
    fontSize: heroTitleSize,
    lineHeight: 1.1,
    fontWeight: 800,
    marginBottom: 16
  } }, hero.title1 || "\uD55C\uAD6D\uC744", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--primary)" } }, hero.title2 || "\uC9C1\uC811 \uAC77\uACE0"), /* @__PURE__ */ React.createElement("br", null), hero.title3 || "\uCC9C\uCC9C\uD788 \uC77D\uB2E4"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, lineHeight: 1.75, color: "var(--ink-2)", maxWidth: 540, marginBottom: 20, whiteSpace: "pre-wrap" } }, hero.subtitle || "\uAD81\uAD90\uACFC \uACE8\uBAA9, \uC2DC\uC7A5\uACFC \uC219\uC18C, \uCC45\uACFC \uAC15\uC5F0\uC744 \uC624\uAC00\uBA70 \uD55C\uAD6D\uC744 \uC870\uAE08 \uB354 \uAC00\uAE4C\uC774 \uBD05\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small" }, hero.ctaPrimary || "\uCEE4\uBBA4\uB2C8\uD2F0 \uBCF4\uAE30"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small" }, hero.ctaSecondary || "\uB2F5\uC0AC \uC77C\uC815 \uBCF4\uAE30"))), /* @__PURE__ */ React.createElement("div", { className: "home-program-stack" }, /* @__PURE__ */ React.createElement("article", { className: "home-program-card" }, /* @__PURE__ */ React.createElement("div", { className: "home-program-label" }, text.heroNextLectureLabel), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 8 } }, "\uC655\uC758 \uAE38\uC744 \uC77D\uB294 \uC800\uB141"), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12 } }, text.venueFallback)), /* @__PURE__ */ React.createElement("article", { className: "home-program-card" }, /* @__PURE__ */ React.createElement("div", { className: "home-program-label" }, text.heroNextTourLabel), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 8 } }, "\uAD81\uAD90 \uB2F5\uC0AC \uC608\uC2DC"), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12 } }, "5.12 (\uD654) 10:00"))))), /* @__PURE__ */ React.createElement(
    HomePreviewSection,
    {
      eyebrow: text.recEyebrow,
      title: /* @__PURE__ */ React.createElement(React.Fragment, null, text.recTitlePrefix, /* @__PURE__ */ React.createElement("span", { className: "accent" }, text.recTitleAccent), text.recTitleSuffix),
      subtitle: text.recSubtitle,
      action: text.recAction
    }
  ), /* @__PURE__ */ React.createElement(HomePreviewSection, { eyebrow: text.tourEyebrow, title: text.tourTitle, subtitle: text.tourSubtitle, action: text.tourAction }), /* @__PURE__ */ React.createElement(HomePreviewSection, { eyebrow: text.communityEyebrow, title: text.communityTitle, subtitle: text.communitySubtitle, action: text.communityAction }), /* @__PURE__ */ React.createElement("section", { style: { padding: "22px 24px", borderBottom: "1px solid var(--line)", background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 18, marginBottom: 8 } }, text.communityEmptyTitle), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 14 } }, text.communityEmptySubtitle), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small" }, text.communityEmptyCta)), /* @__PURE__ */ React.createElement(HomePreviewSection, { eyebrow: text.columnEyebrow, title: text.columnTitle, subtitle: text.columnSubtitle, action: text.columnAction }), /* @__PURE__ */ React.createElement(HomePreviewSection, { eyebrow: text.lecturesEyebrow, title: text.lecturesTitle, action: text.lecturesAction }), /* @__PURE__ */ React.createElement("section", { style: { padding: "24px", background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, text.bookEyebrowPrefix, " \xB7 2026"), /* @__PURE__ */ React.createElement("h3", { style: { fontFamily: "var(--font-serif)", fontSize: 26, marginBottom: 12 } }, "\u300E\uC655\uC758\uAE38\u300F"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, text.bookKrLabel), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, text.bookEnLabel)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small" }, text.bookBuyCta)));
};
const HomeTextEditorPanel = () => {
  var _a, _b, _c;
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const defaults = window.BGNJ_HOME_TEXT_DEFAULT || {};
  const [heroDraft, setHeroDraft] = React.useState(() => ({ ...sc.hero || {} }));
  const [textDraft, setTextDraft] = React.useState(() => ({ ...defaults, ...sc.homeText && typeof sc.homeText === "object" ? sc.homeText : {} }));
  const [previewMode, setPreviewMode] = React.useState("desktop");
  const [msg, setMsg] = React.useState("");
  const mode = HOME_PREVIEW_MODES.find((m) => m.key === previewMode) || HOME_PREVIEW_MODES[0];
  const setHero = (key, value) => setHeroDraft((d) => ({ ...d, [key]: value }));
  const setText = (key, value) => setTextDraft((d) => ({ ...d, [key]: value }));
  const save = async () => {
    try {
      await window.BGNJ_SITE_CONTENT.saveSection("hero", heroDraft);
      await window.BGNJ_SITE_CONTENT.saveSection("homeText", textDraft);
      await window.BGNJ_SITE_CONTENT.saveSection("recommendationsHeading", {
        eyebrow: textDraft.recEyebrow,
        titlePrefix: textDraft.recTitlePrefix,
        titleAccent: textDraft.recTitleAccent,
        titleSuffix: textDraft.recTitleSuffix,
        subtitle: textDraft.recSubtitle
      });
      setTick((v) => v + 1);
      setMsg("\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4 \u2014 \uD648 \uD654\uBA74\uC5D0 \uC989\uC2DC \uBC18\uC601\uB429\uB2C8\uB2E4.");
      setTimeout(() => setMsg(""), 2400);
    } catch (err) {
      alert("\uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
    }
  };
  const resetText = () => {
    if (!confirm("\uD648 \uD14D\uC2A4\uD2B8 \uC785\uB825\uAC12\uC744 \uAE30\uBCF8 \uBB38\uAD6C\uB85C \uB418\uB3CC\uB9B4\uAE4C\uC694? \uC800\uC7A5 \uBC84\uD2BC\uC744 \uB20C\uB7EC\uC57C \uC2E4\uC81C \uBC18\uC601\uB429\uB2C8\uB2E4.")) return;
    setTextDraft({ ...defaults });
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 16, lineHeight: 1.8 } }, "\uD648\uD398\uC774\uC9C0\uC5D0 \uB178\uCD9C\uB418\uB294 \uACE0\uC815 \uBB38\uAD6C\uB97C \uD55C \uACF3\uC5D0\uC11C \uC218\uC815\uD569\uB2C8\uB2E4. \uC88C\uCE21\uC5D0\uC11C \uBC14\uAFB8\uBA74 \uC6B0\uCE21 \uBBF8\uB9AC\uBCF4\uAE30\uC5D0 \uBC14\uB85C \uBC18\uC601\uB418\uACE0, PC / \uD0DC\uBE14\uB9BF / \uBAA8\uBC14\uC77C \uBC84\uD2BC\uC73C\uB85C \uD3ED\uC744 \uC804\uD658\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { className: "home-text-editor-grid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("section", { className: "card", style: { padding: 16, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, marginBottom: 12 } }, "\uAE00\uC790 \uD06C\uAE30 \uD2B8\uC705"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginBottom: 12, lineHeight: 1.6 } }, "\uD648\uD398\uC774\uC9C0 \uBCF8\uBB38\xB7\uC81C\uBAA9\xB7\uCE74\uB4DC \uAE00\uC790 \uD06C\uAE30\uB97C \uBE44\uB840\uC801\uC73C\uB85C \uC870\uC808\uD569\uB2C8\uB2E4. 1.00 \uAE30\uBCF8 \xB7 0.85 \uC791\uAC8C \xB7 1.20 \uD06C\uAC8C. \uACFC\uD55C \uBCC0\uACBD\uC740 \uB808\uC774\uC544\uC6C3\uC744 \uD754\uB4E4 \uC218 \uC788\uC5B4 \xB120% \uBC94\uC704\uB85C \uD55C\uC815."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      min: "0.85",
      max: "1.20",
      step: "0.01",
      value: Number((_a = textDraft.fontScale) != null ? _a : 1),
      onChange: (e) => setText("fontScale", Number(e.target.value)),
      style: { flex: 1, minWidth: 200, accentColor: "var(--gold)" }
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 13, fontWeight: 700, color: "var(--gold)", minWidth: 60, textAlign: "right" } }, "\xD7", Number((_b = textDraft.fontScale) != null ? _b : 1).toFixed(2)), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setText("fontScale", 1),
      disabled: Number((_c = textDraft.fontScale) != null ? _c : 1) === 1,
      style: { fontSize: 11 }
    },
    "1.00 (\uAE30\uBCF8)"
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, [0.9, 0.95, 1, 1.05, 1.1].map((v) => {
    var _a2, _b2, _c2;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: v,
        type: "button",
        className: "btn btn-small",
        onClick: () => setText("fontScale", v),
        style: {
          fontSize: 11,
          padding: "4px 8px",
          borderColor: Number((_a2 = textDraft.fontScale) != null ? _a2 : 1).toFixed(2) === v.toFixed(2) ? "var(--primary)" : "var(--line-2)",
          background: Number((_b2 = textDraft.fontScale) != null ? _b2 : 1).toFixed(2) === v.toFixed(2) ? "rgba(245,213,72,0.12)" : "var(--bg-2)",
          fontWeight: Number((_c2 = textDraft.fontScale) != null ? _c2 : 1).toFixed(2) === v.toFixed(2) ? 800 : 500
        }
      },
      v.toFixed(2)
    );
  })))), HOME_TEXT_GROUPS.map((group) => /* @__PURE__ */ React.createElement("section", { key: group.title, className: "card", style: { padding: 16, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, marginBottom: 12 } }, group.title), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, className: "member-act-grid" }, group.fields.map(([key, label, placeholder]) => {
    const isHero = group.section === "hero";
    const value = isHero ? heroDraft[key] : textDraft[key];
    const onChange = (v) => isHero ? setHero(key, v) : setText(key, v);
    const multiline = /subtitle|Text|설명/.test(key) || ["subtitle", "recSubtitle", "tourSubtitle", "communitySubtitle", "communityEmptySubtitle", "columnSubtitle"].includes(key);
    return /* @__PURE__ */ React.createElement("div", { key, style: { gridColumn: multiline ? "1 / -1" : void 0 } }, /* @__PURE__ */ React.createElement(
      HomeTextInput,
      {
        label,
        value,
        onChange,
        placeholder: placeholder || defaults[key] || "",
        multiline
      }
    ));
  })))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", onClick: save }, "\uC804\uCCB4 \uC800\uC7A5"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: resetText }, "\uD648 \uBB38\uAD6C \uAE30\uBCF8\uAC12\uC73C\uB85C"), msg && /* @__PURE__ */ React.createElement("span", { role: "status", className: "mono", style: { fontSize: 12, color: "var(--secondary)", fontWeight: 700 } }, msg))), /* @__PURE__ */ React.createElement("aside", { className: "home-text-preview-pane" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, margin: 0 } }, "\uBBF8\uB9AC\uBCF4\uAE30"), /* @__PURE__ */ React.createElement("div", { role: "tablist", "aria-label": "\uD648 \uBBF8\uB9AC\uBCF4\uAE30 viewport", style: { display: "flex", gap: 6 } }, HOME_PREVIEW_MODES.map((m) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: m.key,
      type: "button",
      role: "tab",
      "aria-selected": previewMode === m.key,
      className: "btn btn-small",
      onClick: () => setPreviewMode(m.key),
      style: {
        fontSize: 11,
        borderColor: previewMode === m.key ? "var(--primary)" : "var(--line-2)",
        background: previewMode === m.key ? "rgba(245,213,72,0.12)" : "var(--bg-2)",
        color: previewMode === m.key ? "var(--ink)" : "var(--ink-2)",
        fontWeight: previewMode === m.key ? 800 : 500
      }
    },
    m.label
  )))), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.12em", marginBottom: 8 } }, mode.label, " \xB7 ", mode.width, "px"), /* @__PURE__ */ React.createElement("div", { style: { overflow: "auto", padding: "10px 0 20px" } }, /* @__PURE__ */ React.createElement(HomeTextPreview, { hero: heroDraft, text: textDraft, mode })))));
};
const LegacyMigrationPanel = () => {
  const [tourScan, setTourScan] = React.useState(null);
  const [lectureScan, setLectureScan] = React.useState(null);
  const [running, setRunning] = React.useState("");
  const [tourResult, setTourResult] = React.useState(null);
  const [lectureResult, setLectureResult] = React.useState(null);
  const isDataUri = (v) => typeof v === "string" && v.startsWith("data:");
  const scanTour = () => {
    var _a, _b, _c, _d;
    setRunning("tour-scan");
    try {
      const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
      const tourPages = sc.tourPages || {};
      const tours = ((_d = (_c = window.BGNJ_TOURS) == null ? void 0 : _c.listAll) == null ? void 0 : _d.call(_c, { includeHidden: true })) || [];
      const items = [];
      for (const [id, ovr] of Object.entries(tourPages)) {
        if (!ovr || !ovr.coverDataUri) continue;
        const tour = tours.find((t) => String(t.id) === String(id));
        items.push({
          id,
          title: (tour == null ? void 0 : tour.title) || "(\uC0AD\uC81C\uB41C \uD22C\uC5B4)",
          source: ovr.coverDataUri,
          hasD1: !!(tour == null ? void 0 : tour.coverUrl),
          isDataUri: isDataUri(ovr.coverDataUri)
        });
      }
      setTourScan({ count: items.length, items });
    } finally {
      setRunning("");
    }
  };
  const applyTour = async () => {
    var _a, _b;
    if (!tourScan || tourScan.items.length === 0) return;
    if (!confirm(`\uD22C\uC5B4 ${tourScan.items.length} \uAC1C\uC758 legacy cover \uB97C D1 cover_url \uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694? (\uC7AC\uC2E4\uD589 \uC548\uC804)`)) return;
    setRunning("tour-apply");
    const result = { migrated: 0, skipped: 0, failed: [] };
    try {
      const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
      const tourPages = { ...sc.tourPages || {} };
      for (const it of tourScan.items) {
        try {
          await window.BGNJ_TOURS.saveTour({ id: it.id, coverUrl: it.source });
          const { coverDataUri, ...rest } = tourPages[it.id] || {};
          if (Object.keys(rest).length > 0) tourPages[it.id] = rest;
          else delete tourPages[it.id];
          result.migrated += 1;
        } catch (err) {
          result.failed.push({ id: it.id, msg: (err == null ? void 0 : err.message) || String(err) });
        }
      }
      try {
        await window.BGNJ_SITE_CONTENT.saveSection("tourPages", tourPages);
      } catch (err) {
        result.failed.push({ id: "(site_content)", msg: "tourPages \uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "") });
      }
      setTourResult(result);
      setTourScan(null);
    } finally {
      setRunning("");
    }
  };
  const scanLecture = () => {
    var _a, _b, _c, _d;
    setRunning("lecture-scan");
    try {
      const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
      const lecturePages = sc.lecturePages || {};
      const lectures = ((_d = (_c = window.BGNJ_LECTURES) == null ? void 0 : _c.listAll) == null ? void 0 : _d.call(_c, { includeHidden: true })) || [];
      const items = [];
      for (const [id, ovr] of Object.entries(lecturePages)) {
        if (!ovr || !ovr.coverDataUri) continue;
        if (!isDataUri(ovr.coverDataUri)) continue;
        const lecture = lectures.find((l) => String(l.id) === String(id));
        items.push({
          id,
          title: (lecture == null ? void 0 : lecture.title) || "(\uC0AD\uC81C\uB41C \uAC15\uC5F0)",
          sizeBytes: ovr.coverDataUri.length
        });
      }
      setLectureScan({ count: items.length, items });
    } finally {
      setRunning("");
    }
  };
  const dataUriToFile = async (dataUri, filename) => {
    const res = await fetch(dataUri);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/png" });
  };
  const applyLecture = async () => {
    var _a, _b;
    if (!lectureScan || lectureScan.items.length === 0) return;
    if (!confirm(`\uAC15\uC5F0 ${lectureScan.items.length} \uAC1C\uC758 dataURI cover \uB97C R2 \uAC1D\uCCB4\uB85C \uBCC0\uD658\uD569\uB2C8\uB2E4. \uC9C4\uD589\uD560\uAE4C\uC694?`)) return;
    setRunning("lecture-apply");
    const result = { migrated: 0, skipped: 0, failed: [] };
    try {
      const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
      const lecturePages = { ...sc.lecturePages || {} };
      for (const it of lectureScan.items) {
        try {
          const ovr = lecturePages[it.id] || {};
          const file = await dataUriToFile(ovr.coverDataUri, `${it.id}-cover.png`);
          const { url } = await window.BGNJ_MEDIA.uploadFile(file, { folder: "lecture-covers", maxBytes: 10 * 1024 * 1024 });
          lecturePages[it.id] = { ...ovr, coverDataUri: url };
          result.migrated += 1;
        } catch (err) {
          result.failed.push({ id: it.id, msg: (err == null ? void 0 : err.message) || String(err) });
        }
      }
      try {
        await window.BGNJ_SITE_CONTENT.saveSection("lecturePages", lecturePages);
      } catch (err) {
        result.failed.push({ id: "(site_content)", msg: "lecturePages \uC800\uC7A5 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "") });
      }
      setLectureResult(result);
      setLectureScan(null);
    } finally {
      setRunning("");
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 18, lineHeight: 1.8 } }, "v00.070~082 \uC0AC\uC774\uD074\uC744 \uAC70\uCE58\uBA70 \uB204\uC801\uB41C legacy \uB370\uC774\uD130\uB97C \uC815\uC2DD \uC704\uCE58\uB85C \uC77C\uAD04 \uC774\uB3D9\uD569\uB2C8\uB2E4. \uBAA8\uB4E0 \uC791\uC5C5\uC740 idempotent \u2014 \uC911\uBCF5 \uC2E4\uD589 \uC548\uC804."), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 8 } }, "\u2460 \uD22C\uC5B4 legacy cover \u2192 D1 cover_url"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 14, lineHeight: 1.7 } }, "v00.081 D1 cover_url \uCEEC\uB7FC \uB3C4\uC785 \uC804 (v00.070) \uC2DC\uC810\uC758 site_content_kv.tourPages[id].coverDataUri \uAC12\uC744 \uC815\uC2DD D1 \uCEEC\uB7FC\uC73C\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4. \uC774\uC804 \uD6C4 site_content \uC758 \uD574\uB2F9 \uD0A4 \uC81C\uAC70 (schedule/prep/templateId \uB294 \uBCF4\uC874)."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", disabled: !!running, onClick: scanTour }, "\u2460 \uC2A4\uCE94"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-gold btn-small",
      disabled: !tourScan || tourScan.items.length === 0 || !!running,
      onClick: applyTour
    },
    "\u2461 \uC801\uC6A9 (",
    (tourScan == null ? void 0 : tourScan.count) || 0,
    "\uAC1C)"
  )), tourScan && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 18, fontSize: 12, lineHeight: 1.7 } }, tourScan.items.length === 0 ? /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\u25B8 \uB9C8\uC774\uADF8\uD560 \uD56D\uBAA9 \uC5C6\uC74C.") : /* @__PURE__ */ React.createElement("ul", { style: { paddingLeft: 18, margin: 0 } }, tourScan.items.map((it) => /* @__PURE__ */ React.createElement("li", { key: it.id }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2" }, it.id), " \xB7 ", it.title, it.hasD1 && /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { marginLeft: 8, fontSize: 10 } }, "D1 \uC774\uBBF8 \uC874\uC7AC \u2014 \uB36E\uC5B4\uC501\uB2C8\uB2E4"), !it.isDataUri && /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { marginLeft: 8, fontSize: 10 } }, "(URL \uD615\uD0DC \u2014 \uADF8\uB300\uB85C D1 \uB85C \uC774\uB3D9)"))))), tourResult && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 18, fontSize: 12, lineHeight: 1.7, borderColor: "var(--gold)" } }, "\u2705 \uB9C8\uC774\uADF8 \uC644\uB8CC \u2014 ", tourResult.migrated, " \uAC74 \uC774\uB3D9, ", tourResult.failed.length, " \uAC74 \uC2E4\uD328.", tourResult.failed.length > 0 && /* @__PURE__ */ React.createElement("ul", { style: { paddingLeft: 18, margin: "8px 0 0", color: "var(--danger)" } }, tourResult.failed.map((f, i) => /* @__PURE__ */ React.createElement("li", { key: i }, f.id, ": ", f.msg)))), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 10, marginTop: 24 } }, "\u2461 \uAC15\uC5F0 legacy cover dataURI \u2192 R2"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 12, marginBottom: 14, lineHeight: 1.7 } }, "v00.075~083 \uB3D9\uC548 site_content_kv.lecturePages[id].coverDataUri \uC5D0 base64 dataURI \uB85C \uC800\uC7A5\uB41C \uD56D\uBAA9\uC744 R2 \uAC1D\uCCB4\uB85C \uC5C5\uB85C\uB4DC \uD6C4 URL \uB85C \uAD50\uCCB4\uD569\uB2C8\uB2E4. \uC774\uBBF8 URL \uC778 \uD56D\uBAA9\uC740 skip."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", disabled: !!running, onClick: scanLecture }, "\u2460 \uC2A4\uCE94"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-gold btn-small",
      disabled: !lectureScan || lectureScan.items.length === 0 || !!running,
      onClick: applyLecture
    },
    "\u2461 \uC801\uC6A9 (",
    (lectureScan == null ? void 0 : lectureScan.count) || 0,
    "\uAC1C)"
  )), lectureScan && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 18, fontSize: 12, lineHeight: 1.7 } }, lectureScan.items.length === 0 ? /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\u25B8 \uB9C8\uC774\uADF8\uD560 \uD56D\uBAA9 \uC5C6\uC74C (\uBAA8\uB450 URL \uD615\uD0DC\uC774\uAC70\uB098 \uBE44\uC5B4\uC788\uC74C).") : /* @__PURE__ */ React.createElement("ul", { style: { paddingLeft: 18, margin: 0 } }, lectureScan.items.map((it) => /* @__PURE__ */ React.createElement("li", { key: it.id }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2" }, it.id), " \xB7 ", it.title, /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { marginLeft: 8, fontSize: 10 } }, "~", (it.sizeBytes / 1024 / 1.33).toFixed(0), " KB"))))), lectureResult && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 18, fontSize: 12, lineHeight: 1.7, borderColor: "var(--gold)" } }, "\u2705 \uB9C8\uC774\uADF8 \uC644\uB8CC \u2014 ", lectureResult.migrated, " \uAC74 R2 \uC5C5\uB85C\uB4DC, ", lectureResult.failed.length, " \uAC74 \uC2E4\uD328.", lectureResult.failed.length > 0 && /* @__PURE__ */ React.createElement("ul", { style: { paddingLeft: 18, margin: "8px 0 0", color: "var(--danger)" } }, lectureResult.failed.map((f, i) => /* @__PURE__ */ React.createElement("li", { key: i }, f.id, ": ", f.msg)))), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 24, lineHeight: 1.7 } }, "\u24D8 \uCD94\uAC00 \uB9C8\uC774\uADF8\uAC00 \uD544\uC694\uD55C \uD56D\uBAA9 (\uCC45 \uD45C\uC9C0/PDF dataURI, \uCD94\uCC9C \uC774\uBBF8\uC9C0, \uAC8C\uC2DC\uAE00 \uCCA8\uBD80) \uC740 \uD5A5\uD6C4 \uBCC4\uB3C4 \uB3C4\uAD6C. \uD604\uC7AC\uB294 v00.081/v00.083 \uC2E0\uADDC \uCEEC\uB7FC\xB7R2 \uD328\uC2A4 \uC801\uC6A9 \uC9C1\uD6C4\uC758 \uC794\uC7AC\uB9CC \uCC98\uB9AC."));
};
Object.assign(window, {
  RecommendationsAdminPanel,
  TPE_RowActions,
  TPE_ScheduleEditor,
  TPE_PrepEditor,
  TPE_PreviewCard,
  _arrAdd,
  _arrRemove,
  _arrUpdate,
  _arrMove,
  TourPageEditorPanel,
  LecturePageEditorPanel,
  // v00.083
  LPE_NotesEditor,
  LPE_PreviewCard,
  FOOTER_COLOR_OPTIONS,
  FooterStyleEditor,
  HE_Field,
  HE_Input,
  HE_TextArea,
  HE_Select,
  HE_NumberRange,
  HE_StyleGroup,
  HERO_COLOR_OPTIONS,
  HERO_WEIGHTS,
  HERO_ALIGNS,
  HERO_TFORMS,
  HeroEditorPanel,
  HomeTextEditorPanel,
  LegacyMigrationPanel,
  // v00.086
  EatSleepShopAdminPanel,
  ESS_CategoryEditor,
  // v00.105
  KindPagePanel,
  // v00.106
  TPE_TimeInput
  // v00.106 (헬퍼 — 외부 호출자 없음, 노출만)
});

})();

(function(){
const downloadBlob = (filename, content, mime = "text/plain;charset=utf-8") => {
  try {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("\uB2E4\uC6B4\uB85C\uB4DC \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
  }
};
const downloadCsv = (filename, csv) => downloadBlob(filename, csv, "text/csv;charset=utf-8");
const downloadJson = (filename, obj) => downloadBlob(filename, JSON.stringify(obj, null, 2), "application/json");
const pickImageWithR2Fallback = async (e, { folder, maxBytes = 5 * 1024 * 1024, fallbackMaxBytes = 1.5 * 1024 * 1024 } = {}) => {
  var _a;
  const file = (_a = e.target.files) == null ? void 0 : _a[0];
  if (!file) return null;
  try {
    const { url } = await window.BGNJ_MEDIA.uploadFile(file, { folder, maxBytes });
    e.target.value = "";
    return url;
  } catch (err) {
    try {
      console.warn(`[upload] R2 ${folder} \uC5C5\uB85C\uB4DC \uC2E4\uD328 \u2014 dataURI \uD3F4\uBC31:`, err);
    } catch (e2) {
    }
  }
  if (file.size > fallbackMaxBytes) {
    alert(`\uC774\uBBF8\uC9C0\uAC00 \uB108\uBB34 \uD07D\uB2C8\uB2E4(${(file.size / 1024 / 1024).toFixed(1)}MB). R2 \uC2E4\uD328 + ${(fallbackMaxBytes / 1024 / 1024).toFixed(1)}MB \uD3F4\uBC31 \uD55C\uB3C4 \uCD08\uACFC.`);
    e.target.value = "";
    return null;
  }
  try {
    const dataUri = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    e.target.value = "";
    return dataUri;
  } catch (err) {
    alert("\uC774\uBBF8\uC9C0 \uC77D\uAE30 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    e.target.value = "";
    return null;
  }
};
const MiniBarChart = ({ series, labels, height = 120, color = "var(--gold)", label, unit = "", formatTooltip, headerRight }) => {
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const max = Math.max(1, ...series);
  const W = 100;
  const H = 40;
  const barW = W / Math.max(1, series.length);
  const fmt = formatTooltip || ((v, l) => `${l ? l + " \xB7 " : ""}${v}${unit}`);
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 0", position: "relative" } }, (label || headerRight) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 } }, label && /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.18em" } }, label), headerRight && /* @__PURE__ */ React.createElement("div", null, headerRight)), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none", style: { width: "100%", height, display: "block" } }, series.map((v, i) => {
    const h = max > 0 ? v / max * (H - 6) : 0;
    const isOther = hoverIdx !== null && hoverIdx !== i;
    return /* @__PURE__ */ React.createElement(
      "g",
      {
        key: i,
        onMouseEnter: () => setHoverIdx(i),
        onMouseLeave: () => setHoverIdx((c) => c === i ? null : c),
        style: { cursor: "pointer" }
      },
      /* @__PURE__ */ React.createElement(
        "rect",
        {
          x: i * barW + 0.6,
          y: H - h,
          width: Math.max(0.4, barW - 1.2),
          height: h,
          fill: color,
          rx: 0.3,
          opacity: isOther ? 0.4 : 1,
          style: { transition: "opacity .12s" }
        }
      ),
      /* @__PURE__ */ React.createElement("rect", { x: i * barW, y: 0, width: barW, height: H, fill: "transparent" }),
      /* @__PURE__ */ React.createElement("title", null, fmt(v, (labels == null ? void 0 : labels[i]) || ""))
    );
  })), hoverIdx !== null && series[hoverIdx] !== void 0 && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: -28,
    left: `${(hoverIdx + 0.5) / Math.max(1, series.length) * 100}%`,
    transform: "translateX(-50%)",
    background: "var(--ink)",
    color: "var(--bg)",
    padding: "5px 10px",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    borderRadius: 3,
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    zIndex: 5
  } }, fmt(series[hoverIdx], (labels == null ? void 0 : labels[hoverIdx]) || ""))), labels && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: `repeat(${labels.length}, 1fr)`, fontSize: 9, color: "var(--ink-3)", marginTop: 6, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" } }, labels.map((l, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { textAlign: "center" } }, l))));
};
const RankedBarList = ({ items = [], unit = "", headerLeft, headerRight, emptyText = "\uB370\uC774\uD130 \uC5C6\uC74C", maxItems = 10, valueFormat }) => {
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const visible = items.slice(0, maxItems);
  const total = visible.reduce((s, it) => s + (Number(it.count) || 0), 0) || 1;
  const fmt = valueFormat || ((c) => `${c}${unit}`);
  return /* @__PURE__ */ React.createElement("article", { className: "card", style: { marginBottom: 24 } }, (headerLeft || headerRight) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em" } }, headerLeft), headerRight && /* @__PURE__ */ React.createElement("div", null, headerRight)), visible.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, emptyText) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 8 } }, visible.map((it, i) => {
    const pct = Math.round((Number(it.count) || 0) / total * 100);
    const isHov = hoverIdx === i;
    const isOther = hoverIdx !== null && hoverIdx !== i;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: it.id || it.label || i,
        onMouseEnter: () => setHoverIdx(i),
        onMouseLeave: () => setHoverIdx((c) => c === i ? null : c),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "4px 6px",
          background: isHov ? "rgba(245,213,72,0.06)" : "transparent",
          opacity: isOther ? 0.4 : 1,
          transition: "opacity .12s, background .12s",
          cursor: "default"
        },
        title: `${it.label || ""} \xB7 ${fmt(it.count)} \xB7 ${pct}%`
      },
      /* @__PURE__ */ React.createElement("span", { style: {
        minWidth: 28,
        textAlign: "right",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--ink-3)",
        fontWeight: 700
      } }, "#", i + 1),
      /* @__PURE__ */ React.createElement("div", { style: {
        minWidth: 180,
        fontSize: 13,
        color: "var(--ink)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        flex: "0 1 240px"
      } }, it.label),
      /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 8, background: "var(--bg-2)", overflow: "hidden", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: `${pct}%`,
        background: it.color || "var(--gold)",
        transition: "width .12s"
      } })),
      /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
        minWidth: 90,
        textAlign: "right",
        fontSize: 12,
        color: isHov ? "var(--ink)" : "var(--gold-2)",
        fontWeight: 600
      } }, pct, "% (", fmt(it.count), ")")
    );
  })));
};
const COHORT_OPTIONS = [
  { value: 1, label: "1\uC77C" },
  { value: 7, label: "7\uC77C" },
  { value: 14, label: "14\uC77C" },
  { value: 30, label: "30\uC77C" },
  { value: 90, label: "90\uC77C" }
];
const CohortSelector = ({ value, onChange, options = COHORT_OPTIONS }) => /* @__PURE__ */ React.createElement("div", { role: "tablist", "aria-label": "\uAE30\uAC04 \uC120\uD0DD", style: { display: "inline-flex", gap: 0, border: "1px solid var(--line-2)", borderRadius: 0 } }, options.map((opt, i) => /* @__PURE__ */ React.createElement(
  "button",
  {
    key: opt.value,
    type: "button",
    role: "tab",
    "aria-selected": value === opt.value,
    onClick: () => onChange(opt.value),
    style: {
      padding: "4px 10px",
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      fontWeight: value === opt.value ? 800 : 500,
      letterSpacing: "0.06em",
      border: "none",
      borderLeft: i === 0 ? "none" : "1px solid var(--line-2)",
      background: value === opt.value ? "rgba(245,213,72,0.14)" : "var(--bg)",
      color: value === opt.value ? "var(--ink)" : "var(--ink-2)",
      cursor: "pointer"
    }
  },
  opt.label
)));
const _CHANNEL_FOR_HOST = (host) => {
  const h = String(host || "").toLowerCase();
  if (!h || h === "\uC9C1\uC811 \uBC29\uBB38") return "\uC9C1\uC811 \uBC29\uBB38";
  if (/facebook|fb\./.test(h)) return "\uD398\uC774\uC2A4\uBD81";
  if (/instagram/.test(h)) return "\uC778\uC2A4\uD0C0\uADF8\uB7A8";
  if (/google|gstatic|gws/.test(h)) return "\uAD6C\uAE00";
  if (/naver/.test(h)) return "\uB124\uC774\uBC84";
  if (/youtube|youtu\.be/.test(h)) return "\uC720\uD29C\uBE0C";
  if (/twitter|t\.co|x\.com/.test(h)) return "\uD2B8\uC704\uD130/X";
  if (/threads/.test(h)) return "\uC2A4\uB808\uB4DC";
  if (/kakao/.test(h)) return "\uCE74\uCE74\uC624";
  if (/bgnj\.net|bgnj-/.test(h)) return "\uB0B4\uBD80 \uC774\uB3D9";
  return host;
};
const _STAGE_FOR_ROUTE = (route) => {
  const r = String(route || "").toLowerCase();
  if (r === "/" || r === "/home" || r === "") return "Awareness";
  if (/^\/(column|book|faq|terms|privacy|eat|sleep|shop)/.test(r)) return "Interest";
  if (/^\/(tour|lectures|signup|login|checkout|community|mypage|admin)/.test(r)) return "Consideration";
  return "Interest";
};
const _CHANNEL_COLORS = {
  "\uD398\uC774\uC2A4\uBD81": "#3b82f6",
  "\uC778\uC2A4\uD0C0\uADF8\uB7A8": "#ec4899",
  "\uAD6C\uAE00": "#10b981",
  "\uB124\uC774\uBC84": "#22c55e",
  "\uC720\uD29C\uBE0C": "#ef4444",
  "\uCE74\uCE74\uC624": "#f59e0b",
  "\uD2B8\uC704\uD130/X": "#0ea5e9",
  "\uC2A4\uB808\uB4DC": "#a855f7",
  "\uB0B4\uBD80 \uC774\uB3D9": "#94a3b8",
  "\uC9C1\uC811 \uBC29\uBB38": "#64748b"
};
const _CHANNEL_COLOR = (name) => _CHANNEL_COLORS[name] || "var(--gold)";
const SankeyFlow = ({ pairs, days, onDaysChange }) => {
  var _a, _b, _c;
  const [hover, setHover] = React.useState(null);
  const rows = React.useMemo(() => (pairs || []).map((p) => ({
    ...p,
    channel: _CHANNEL_FOR_HOST(p.referrer || "\uC9C1\uC811 \uBC29\uBB38"),
    stage: _STAGE_FOR_ROUTE(p.route)
  })), [pairs]);
  const channelSums = React.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => m.set(r.channel, (m.get(r.channel) || 0) + r.count));
    return Array.from(m.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [rows]);
  const stageOrder = ["Awareness", "Interest", "Consideration"];
  const stageSums = React.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => m.set(r.stage, (m.get(r.stage) || 0) + r.count));
    return stageOrder.map((s) => ({ name: s, count: m.get(s) || 0 })).filter((s) => s.count > 0);
  }, [rows]);
  const routeSums = React.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => m.set(r.route, (m.get(r.route) || 0) + r.count));
    return Array.from(m.entries()).map(([route, count]) => ({ name: route, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [rows]);
  const routeSet = React.useMemo(() => new Set(routeSums.map((r) => r.name)), [routeSums]);
  const linksA = React.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => {
      if (!routeSet.has(r.route)) return;
      const k = `${r.channel}|${r.stage}`;
      m.set(k, (m.get(k) || 0) + r.count);
    });
    return Array.from(m.entries()).map(([k, count]) => {
      const [channel, stage] = k.split("|");
      return { channel, stage, count };
    });
  }, [rows, routeSet]);
  const linksB = React.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => {
      if (!routeSet.has(r.route)) return;
      const k = `${r.stage}|${r.route}`;
      m.set(k, (m.get(k) || 0) + r.count);
    });
    return Array.from(m.entries()).map(([k, count]) => {
      const [stage, route] = k.split("|");
      return { stage, route, count };
    });
  }, [rows, routeSet]);
  const W = 1e3;
  const NODE_W = 14;
  const COL_X = [80, 480, 880];
  const TOP_PAD = 30;
  const BOT_PAD = 20;
  const NODE_GAP = 8;
  const colTotal = (arr) => arr.reduce((s, n) => s + n.count, 0);
  const totalCh = Math.max(1, colTotal(channelSums));
  const totalSt = Math.max(1, colTotal(stageSums));
  const totalRt = Math.max(1, colTotal(routeSums));
  const maxNodesInCol = Math.max(channelSums.length, stageSums.length, routeSums.length);
  const colSums = [totalCh, totalSt, totalRt];
  const maxTotal = Math.max(...colSums);
  const HEIGHT = Math.min(720, Math.max(320, maxNodesInCol * 36 + maxTotal / 2));
  const usableH = HEIGHT - TOP_PAD - BOT_PAD - (maxNodesInCol - 1) * NODE_GAP;
  const scale = usableH / maxTotal;
  const layout = (arr) => {
    const result = /* @__PURE__ */ new Map();
    let y = TOP_PAD;
    arr.forEach((n) => {
      const h = Math.max(2, n.count * scale);
      result.set(n.name, { y, h, count: n.count });
      y += h + NODE_GAP;
    });
    return result;
  };
  const chPos = layout(channelSums);
  const stPos = layout(stageSums);
  const rtPos = layout(routeSums);
  const chOffset = /* @__PURE__ */ new Map();
  const stOffsetIn = /* @__PURE__ */ new Map();
  const stOffsetOut = /* @__PURE__ */ new Map();
  const rtOffset = /* @__PURE__ */ new Map();
  const sortedA = linksA.slice().sort((a, b) => {
    var _a2, _b2, _c2, _d;
    const ay = (_b2 = (_a2 = chPos.get(a.channel)) == null ? void 0 : _a2.y) != null ? _b2 : 0;
    const by = (_d = (_c2 = chPos.get(b.channel)) == null ? void 0 : _c2.y) != null ? _d : 0;
    if (ay !== by) return ay - by;
    return b.count - a.count;
  });
  const ribbonsA = sortedA.map((lk) => {
    const ch = chPos.get(lk.channel);
    const st = stPos.get(lk.stage);
    if (!ch || !st) return null;
    const t = lk.count * scale;
    const offCh = chOffset.get(lk.channel) || 0;
    const offSt = stOffsetIn.get(lk.stage) || 0;
    const y1 = ch.y + offCh + t / 2;
    const y2 = st.y + offSt + t / 2;
    chOffset.set(lk.channel, offCh + t);
    stOffsetIn.set(lk.stage, offSt + t);
    return { ...lk, y1, y2, t };
  }).filter(Boolean);
  const sortedB = linksB.slice().sort((a, b) => {
    var _a2, _b2, _c2, _d;
    const ay = (_b2 = (_a2 = stPos.get(a.stage)) == null ? void 0 : _a2.y) != null ? _b2 : 0;
    const by = (_d = (_c2 = stPos.get(b.stage)) == null ? void 0 : _c2.y) != null ? _d : 0;
    if (ay !== by) return ay - by;
    return b.count - a.count;
  });
  const ribbonsB = sortedB.map((lk) => {
    const st = stPos.get(lk.stage);
    const rt = rtPos.get(lk.route);
    if (!st || !rt) return null;
    const t = lk.count * scale;
    const offSt = stOffsetOut.get(lk.stage) || 0;
    const offRt = rtOffset.get(lk.route) || 0;
    const y1 = st.y + offSt + t / 2;
    const y2 = rt.y + offRt + t / 2;
    stOffsetOut.set(lk.stage, offSt + t);
    rtOffset.set(lk.route, offRt + t);
    return { ...lk, y1, y2, t };
  }).filter(Boolean);
  if (channelSums.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.24em", marginBottom: 4 } }, "JOURNEY \xB7 \uACE0\uAC1D \uC5EC\uC815 \uD750\uB984"), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 18, margin: 0 } }, "\uC720\uC785 \uCC44\uB110 \u2192 \uB2E8\uACC4 \u2192 \uB300\uD45C \uB3C4\uCC29 \uD398\uC774\uC9C0")), /* @__PURE__ */ React.createElement(CohortSelector, { value: days, onChange: onDaysChange })), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.7 } }, "\uCD5C\uADFC ", days, "\uC77C\uAC04 \uCE21\uC815\uB41C \uD398\uC774\uC9C0\uBDF0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC0AC\uC6A9\uC790 \uBC29\uBB38\uC774 \uB204\uC801\uB418\uAC70\uB098 \uCF54\uD638\uD2B8\uB97C \uB298\uB9AC\uBA74 \uD45C\uC2DC\uB429\uB2C8\uB2E4."));
  }
  const cubicPath = (x1, y1, x2, y2, t) => {
    const cx1 = (x1 + x2) / 2;
    const cx2 = (x1 + x2) / 2;
    return [
      `M ${x1} ${y1 - t / 2}`,
      `C ${cx1} ${y1 - t / 2}, ${cx2} ${y2 - t / 2}, ${x2} ${y2 - t / 2}`,
      `L ${x2} ${y2 + t / 2}`,
      `C ${cx2} ${y2 + t / 2}, ${cx1} ${y1 + t / 2}, ${x1} ${y1 + t / 2}`,
      "Z"
    ].join(" ");
  };
  const channelLinked = (chName) => {
    const stages = new Set(linksA.filter((l) => l.channel === chName).map((l) => l.stage));
    const routes = new Set(linksB.filter((l) => stages.has(l.stage)).map((l) => l.route));
    return { stages, routes };
  };
  const routeLinked = (rtName) => {
    const stages = new Set(linksB.filter((l) => l.route === rtName).map((l) => l.stage));
    const channels = new Set(linksA.filter((l) => stages.has(l.stage)).map((l) => l.channel));
    return { stages, channels };
  };
  const stageLinked = (stName) => {
    const channels = new Set(linksA.filter((l) => l.stage === stName).map((l) => l.channel));
    const routes = new Set(linksB.filter((l) => l.stage === stName).map((l) => l.route));
    return { channels, routes };
  };
  const dim = (kind, key) => {
    if (!hover) return false;
    if (hover.type === "channel") {
      const { stages, routes } = channelLinked(hover.key);
      if (kind === "channel") return key !== hover.key;
      if (kind === "stage") return !stages.has(key);
      if (kind === "route") return !routes.has(key);
      if (kind === "linkA") return key.channel !== hover.key;
      if (kind === "linkB") return !stages.has(key.stage);
    } else if (hover.type === "stage") {
      const { channels, routes } = stageLinked(hover.key);
      if (kind === "channel") return !channels.has(key);
      if (kind === "stage") return key !== hover.key;
      if (kind === "route") return !routes.has(key);
      if (kind === "linkA") return key.stage !== hover.key;
      if (kind === "linkB") return key.stage !== hover.key;
    } else if (hover.type === "route") {
      const { stages, channels } = routeLinked(hover.key);
      if (kind === "channel") return !channels.has(key);
      if (kind === "stage") return !stages.has(key);
      if (kind === "route") return key !== hover.key;
      if (kind === "linkA") return !stages.has(key.stage);
      if (kind === "linkB") return key.route !== hover.key;
    }
    return false;
  };
  const truncate = (s, n) => String(s || "").length > n ? String(s).slice(0, n - 1) + "\u2026" : String(s || "");
  return /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.24em", marginBottom: 4 } }, "JOURNEY \xB7 \uACE0\uAC1D \uC5EC\uC815 \uD750\uB984"), /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 18, margin: 0 } }, "\uC720\uC785 \uCC44\uB110 \u2192 \uB2E8\uACC4 \u2192 \uB300\uD45C \uB3C4\uCC29 \uD398\uC774\uC9C0"), /* @__PURE__ */ React.createElement("p", { className: "dim-2", style: { fontSize: 11, marginTop: 6, lineHeight: 1.6 } }, "\uB178\uB4DC \uB610\uB294 \uACE1\uC120\uC5D0 \uD638\uBC84\uD558\uBA74 \uC5F0\uACB0\uB41C \uD750\uB984\uC774 \uAC15\uC870\uB429\uB2C8\uB2E4. \uC704\uCABD [\uAE30\uAC04] \uC73C\uB85C \uCF54\uD638\uD2B8 \uBCC0\uACBD.")), /* @__PURE__ */ React.createElement(CohortSelector, { value: days, onChange: onDaysChange })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", overflow: "auto" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${HEIGHT}`, style: { width: "100%", minWidth: 720, height: HEIGHT, display: "block" } }, /* @__PURE__ */ React.createElement(
    "text",
    {
      x: COL_X[0] + NODE_W / 2,
      y: 16,
      textAnchor: "middle",
      fill: "var(--ink-3)",
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.2em"
    },
    "\uC720\uC785 \uCC44\uB110"
  ), /* @__PURE__ */ React.createElement(
    "text",
    {
      x: COL_X[1] + NODE_W / 2,
      y: 16,
      textAnchor: "middle",
      fill: "var(--ink-3)",
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.2em"
    },
    "\uB2E8\uACC4"
  ), /* @__PURE__ */ React.createElement(
    "text",
    {
      x: COL_X[2] + NODE_W / 2,
      y: 16,
      textAnchor: "middle",
      fill: "var(--ink-3)",
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.2em"
    },
    "\uB3C4\uCC29 \uD398\uC774\uC9C0"
  ), ribbonsA.map((lk, i) => {
    const x1 = COL_X[0] + NODE_W;
    const x2 = COL_X[1];
    const faded = dim("linkA", lk);
    return /* @__PURE__ */ React.createElement(
      "path",
      {
        key: `A${i}`,
        d: cubicPath(x1, lk.y1, x2, lk.y2, lk.t),
        fill: _CHANNEL_COLOR(lk.channel),
        opacity: faded ? 0.06 : 0.32,
        style: { cursor: "pointer", transition: "opacity .12s" },
        onMouseEnter: () => setHover({ type: "linkA", key: lk }),
        onMouseLeave: () => setHover(null)
      },
      /* @__PURE__ */ React.createElement("title", null, `${lk.channel} \u2192 ${lk.stage}: ${lk.count}\uD68C`)
    );
  }), ribbonsB.map((lk, i) => {
    const x1 = COL_X[1] + NODE_W;
    const x2 = COL_X[2];
    const faded = dim("linkB", lk);
    const stageColor = lk.stage === "Awareness" ? "#fb923c" : lk.stage === "Interest" ? "#22c55e" : "#ef4444";
    return /* @__PURE__ */ React.createElement(
      "path",
      {
        key: `B${i}`,
        d: cubicPath(x1, lk.y1, x2, lk.y2, lk.t),
        fill: stageColor,
        opacity: faded ? 0.06 : 0.28,
        style: { cursor: "pointer", transition: "opacity .12s" },
        onMouseEnter: () => setHover({ type: "linkB", key: lk }),
        onMouseLeave: () => setHover(null)
      },
      /* @__PURE__ */ React.createElement("title", null, `${lk.stage} \u2192 ${lk.route}: ${lk.count}\uD68C`)
    );
  }), channelSums.map((n) => {
    const p = chPos.get(n.name);
    const faded = dim("channel", n.name);
    return /* @__PURE__ */ React.createElement(
      "g",
      {
        key: `ch-${n.name}`,
        onMouseEnter: () => setHover({ type: "channel", key: n.name }),
        onMouseLeave: () => setHover(null),
        style: { cursor: "pointer", opacity: faded ? 0.35 : 1, transition: "opacity .12s" }
      },
      /* @__PURE__ */ React.createElement("rect", { x: COL_X[0], y: p.y, width: NODE_W, height: p.h, fill: _CHANNEL_COLOR(n.name), rx: 1 }),
      /* @__PURE__ */ React.createElement(
        "text",
        {
          x: COL_X[0] - 8,
          y: p.y + p.h / 2,
          textAnchor: "end",
          dominantBaseline: "middle",
          fontSize: 12,
          fill: "var(--ink)",
          fontFamily: "var(--font-sans)"
        },
        truncate(n.name, 14)
      ),
      /* @__PURE__ */ React.createElement(
        "text",
        {
          x: COL_X[0] - 8,
          y: p.y + p.h / 2 + 14,
          textAnchor: "end",
          dominantBaseline: "middle",
          fontSize: 10,
          fill: "var(--ink-3)",
          fontFamily: "var(--font-mono)"
        },
        n.count
      ),
      /* @__PURE__ */ React.createElement("title", null, `${n.name}: ${n.count}\uD68C`)
    );
  }), stageSums.map((n) => {
    const p = stPos.get(n.name);
    const faded = dim("stage", n.name);
    const stColor = n.name === "Awareness" ? "#fb923c" : n.name === "Interest" ? "#22c55e" : "#ef4444";
    return /* @__PURE__ */ React.createElement(
      "g",
      {
        key: `st-${n.name}`,
        onMouseEnter: () => setHover({ type: "stage", key: n.name }),
        onMouseLeave: () => setHover(null),
        style: { cursor: "pointer", opacity: faded ? 0.35 : 1, transition: "opacity .12s" }
      },
      /* @__PURE__ */ React.createElement("rect", { x: COL_X[1], y: p.y, width: NODE_W, height: p.h, fill: stColor, rx: 1 }),
      /* @__PURE__ */ React.createElement(
        "text",
        {
          x: COL_X[1] + NODE_W + 8,
          y: p.y + p.h / 2,
          textAnchor: "start",
          dominantBaseline: "middle",
          fontSize: 12,
          fill: "var(--ink)",
          fontFamily: "var(--font-sans)"
        },
        n.name
      ),
      /* @__PURE__ */ React.createElement(
        "text",
        {
          x: COL_X[1] + NODE_W + 8,
          y: p.y + p.h / 2 + 14,
          textAnchor: "start",
          dominantBaseline: "middle",
          fontSize: 10,
          fill: "var(--ink-3)",
          fontFamily: "var(--font-mono)"
        },
        n.count
      ),
      /* @__PURE__ */ React.createElement("title", null, `${n.name}: ${n.count}\uD68C`)
    );
  }), routeSums.map((n) => {
    const p = rtPos.get(n.name);
    const faded = dim("route", n.name);
    const rtColor = _STAGE_FOR_ROUTE(n.name) === "Awareness" ? "#fb923c" : _STAGE_FOR_ROUTE(n.name) === "Interest" ? "#22c55e" : "#ef4444";
    return /* @__PURE__ */ React.createElement(
      "g",
      {
        key: `rt-${n.name}`,
        onMouseEnter: () => setHover({ type: "route", key: n.name }),
        onMouseLeave: () => setHover(null),
        style: { cursor: "pointer", opacity: faded ? 0.35 : 1, transition: "opacity .12s" }
      },
      /* @__PURE__ */ React.createElement("rect", { x: COL_X[2], y: p.y, width: NODE_W, height: p.h, fill: rtColor, rx: 1 }),
      /* @__PURE__ */ React.createElement(
        "text",
        {
          x: COL_X[2] + NODE_W + 8,
          y: p.y + p.h / 2,
          textAnchor: "start",
          dominantBaseline: "middle",
          fontSize: 12,
          fill: "var(--ink)",
          fontFamily: "var(--font-sans)"
        },
        truncate(n.name, 28)
      ),
      /* @__PURE__ */ React.createElement(
        "text",
        {
          x: COL_X[2] + NODE_W + 8,
          y: p.y + p.h / 2 + 14,
          textAnchor: "start",
          dominantBaseline: "middle",
          fontSize: 10,
          fill: "var(--ink-3)",
          fontFamily: "var(--font-mono)"
        },
        n.count
      ),
      /* @__PURE__ */ React.createElement("title", null, `${n.name}: ${n.count}\uD68C`)
    );
  })), hover && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "var(--ink)",
    color: "var(--bg)",
    padding: "8px 12px",
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.04em",
    borderRadius: 3,
    zIndex: 5,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    pointerEvents: "none"
  } }, hover.type === "channel" && `\uCC44\uB110: ${hover.key} \xB7 ${((_a = chPos.get(hover.key)) == null ? void 0 : _a.count) || 0}\uD68C`, hover.type === "stage" && `\uB2E8\uACC4: ${hover.key} \xB7 ${((_b = stPos.get(hover.key)) == null ? void 0 : _b.count) || 0}\uD68C`, hover.type === "route" && `\uD398\uC774\uC9C0: ${hover.key} \xB7 ${((_c = rtPos.get(hover.key)) == null ? void 0 : _c.count) || 0}\uD68C`, hover.type === "linkA" && `${hover.key.channel} \u2192 ${hover.key.stage} \xB7 ${hover.key.count}\uD68C`, hover.type === "linkB" && `${hover.key.stage} \u2192 ${hover.key.route} \xB7 ${hover.key.count}\uD68C`)));
};
const SubTabsView = ({ subTabs, defaultKey, storageKey }) => {
  const [active, setActive] = React.useState(() => {
    if (storageKey) {
      try {
        const v = localStorage.getItem(storageKey);
        if (v && subTabs.some((t) => t.key === v)) return v;
      } catch (e) {
      }
    }
    return defaultKey || subTabs[0] && subTabs[0].key;
  });
  React.useEffect(() => {
    if (storageKey) try {
      localStorage.setItem(storageKey, active);
    } catch (e) {
    }
  }, [active, storageKey]);
  const [previewMode, setPreviewMode] = React.useState(() => {
    if (storageKey) {
      try {
        const v = localStorage.getItem(storageKey + "_pmode");
        if (v && ["desktop", "tablet", "mobile"].includes(v)) return v;
      } catch (e) {
      }
    }
    return "desktop";
  });
  React.useEffect(() => {
    if (storageKey) try {
      localStorage.setItem(storageKey + "_pmode", previewMode);
    } catch (e) {
    }
  }, [previewMode, storageKey]);
  const [reloadTick, setReloadTick] = React.useState(0);
  React.useEffect(() => {
    const events = [
      "bgnj-site-content-refresh",
      "bgnj-legal-refresh",
      "bgnj-faqs-refresh",
      "bgnj-bank-accounts-refresh"
    ];
    const handler = () => setReloadTick((v) => v + 1);
    events.forEach((e) => window.addEventListener(e, handler));
    return () => events.forEach((e) => window.removeEventListener(e, handler));
  }, []);
  const Active = subTabs.find((t) => t.key === active);
  const previewUrl = Active && Active.previewUrl;
  const VIEWPORTS = { desktop: 1180, tablet: 760, mobile: 380 };
  const previewW = VIEWPORTS[previewMode] || 1180;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, previewUrl && /* @__PURE__ */ React.createElement("section", { style: { marginBottom: 24, paddingBottom: 18, borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 16, margin: 0, fontWeight: 700 } }, "\uC2E4\uC2DC\uAC04 \uBBF8\uB9AC\uBCF4\uAE30", /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11, marginLeft: 10, fontWeight: 500, letterSpacing: "0.12em" } }, previewUrl)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, [["desktop", "PC"], ["tablet", "\uD0DC\uBE14\uB9BF"], ["mobile", "\uBAA8\uBC14\uC77C"]].map(([k, l]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: k,
      type: "button",
      onClick: () => setPreviewMode(k),
      style: {
        padding: "5px 12px",
        fontSize: 12,
        fontFamily: "var(--font-mono)",
        fontWeight: previewMode === k ? 800 : 500,
        letterSpacing: "0.04em",
        border: "1px solid " + (previewMode === k ? "var(--primary)" : "var(--line-2)"),
        background: previewMode === k ? "rgba(245,213,72,0.12)" : "var(--bg)",
        color: previewMode === k ? "var(--ink)" : "var(--ink-2)",
        cursor: "pointer"
      }
    },
    l
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setReloadTick((v) => v + 1),
      "aria-label": "\uBBF8\uB9AC\uBCF4\uAE30 \uC0C8\uB85C\uACE0\uCE68",
      title: "\uBBF8\uB9AC\uBCF4\uAE30 \uC0C8\uB85C\uACE0\uCE68",
      style: {
        padding: "5px 12px",
        fontSize: 14,
        fontFamily: "var(--font-mono)",
        border: "1px solid var(--line-2)",
        background: "var(--bg)",
        color: "var(--ink-2)",
        cursor: "pointer"
      }
    },
    "\u21BB"
  ))), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.12em", marginBottom: 10 } }, previewMode.toUpperCase(), " \xB7 ", previewW, "px"), /* @__PURE__ */ React.createElement("div", { style: { overflow: "auto", background: "var(--bg)", border: "1px solid var(--line)", maxHeight: "70vh" } }, /* @__PURE__ */ React.createElement(
    "iframe",
    {
      key: reloadTick,
      src: previewUrl,
      title: `\uBBF8\uB9AC\uBCF4\uAE30 \u2014 ${Active.label}`,
      style: {
        width: previewMode === "desktop" ? "100%" : previewW + "px",
        minWidth: previewMode === "desktop" ? "100%" : previewW + "px",
        height: previewMode === "desktop" ? "70vh" : "600px",
        border: "0",
        display: "block",
        background: "var(--bg)"
      }
    }
  )), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 11, marginTop: 8, lineHeight: 1.6 } }, "\uC544\uB798 \uC11C\uBE0C \uD0ED\uC5D0\uC11C \uD3B8\uC9D1 \uD6C4 [\u{1F4BE} \uC800\uC7A5] \uD074\uB9AD \uC2DC \uC790\uB3D9 \uC0C8\uB85C\uACE0\uCE68. \uC989\uC2DC \uD655\uC778\uC740 ", /* @__PURE__ */ React.createElement("span", { className: "mono" }, "\u21BB"), " \uD074\uB9AD.")), /* @__PURE__ */ React.createElement("div", { role: "tablist", style: {
    borderBottom: "1px solid var(--line)",
    marginBottom: 24,
    display: "flex",
    gap: 0,
    flexWrap: "wrap"
  } }, subTabs.map((t) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t.key,
      type: "button",
      role: "tab",
      onClick: () => setActive(t.key),
      "aria-selected": active === t.key,
      style: {
        padding: "10px 18px",
        fontSize: 14,
        fontWeight: active === t.key ? 700 : 500,
        color: active === t.key ? "var(--secondary)" : "var(--ink-2)",
        background: "transparent",
        borderTop: "none",
        borderRight: "none",
        borderLeft: "none",
        borderBottom: active === t.key ? "2px solid var(--primary)" : "2px solid transparent",
        cursor: "pointer",
        letterSpacing: "0.01em",
        transition: "color .15s, border-color .15s"
      }
    },
    t.label
  ))), Active && Active.render());
};
const _DOW_LABELS = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"];
const HeatmapGrid = ({ data, label, headerRight, days = 30 }) => {
  const [hover, setHover] = React.useState(null);
  const grid = React.useMemo(() => {
    const g = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => ({ views: 0, uniq: 0 })));
    (Array.isArray(data) ? data : []).forEach((d) => {
      const dow = Number(d.dow);
      const h = Number(d.hour);
      if (dow >= 0 && dow < 7 && h >= 0 && h < 24) {
        g[dow][h] = { views: Number(d.views) || 0, uniq: Number(d.uniq) || 0 };
      }
    });
    return g;
  }, [data]);
  const max = React.useMemo(() => {
    let m = 0;
    grid.forEach((row) => row.forEach((c) => {
      if (c.views > m) m = c.views;
    }));
    return m;
  }, [grid]);
  const cellColor = (v) => {
    if (max <= 0 || v <= 0) return "rgba(255,255,255,0.02)";
    const alpha = Math.max(0.08, Math.min(0.95, v / max));
    return `rgba(245,213,72,${alpha.toFixed(3)})`;
  };
  return /* @__PURE__ */ React.createElement("article", { className: "card", style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 14, margin: 0, fontWeight: 700 } }, label || `\u{1F5D3} \uC811\uC18D \uC2DC\uAC04 \uD788\uD2B8\uB9F5 (\uCD5C\uADFC ${days}\uC77C \xB7 KST)`), headerRight), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: "auto repeat(24, minmax(18px, 1fr))",
    gridAutoRows: "18px",
    gap: 2,
    minWidth: 560
  } }, /* @__PURE__ */ React.createElement("div", null), Array.from({ length: 24 }, (_, h) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: `h-${h}`,
      className: "mono dim-2",
      style: { fontSize: 9, textAlign: "center", letterSpacing: "0.04em", lineHeight: "18px" }
    },
    h % 3 === 0 ? `${h}` : ""
  )), grid.map((row, dow) => /* @__PURE__ */ React.createElement(React.Fragment, { key: `r-${dow}` }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, lineHeight: "18px", paddingRight: 6, textAlign: "right" } }, _DOW_LABELS[dow]), row.map((cell, hour) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: `c-${dow}-${hour}`,
      onMouseEnter: (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setHover({ dow, hour, views: cell.views, uniq: cell.uniq, x: r.left + r.width / 2, y: r.top });
      },
      onMouseLeave: () => setHover(null),
      role: "img",
      "aria-label": `${_DOW_LABELS[dow]}\uC694\uC77C ${hour}\uC2DC: \uD398\uC774\uC9C0\uBDF0 ${cell.views}\uD68C, \uC138\uC158 ${cell.uniq}\uAC74`,
      style: {
        background: cellColor(cell.views),
        border: "1px solid var(--line)",
        cursor: cell.views > 0 ? "pointer" : "default"
      }
    }
  )))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginTop: 12, fontSize: 10 }, className: "dim-2 mono" }, /* @__PURE__ */ React.createElement("span", null, "\uC801\uC74C"), [0.1, 0.25, 0.5, 0.75, 1].map((a) => /* @__PURE__ */ React.createElement("span", { key: a, style: {
    display: "inline-block",
    width: 14,
    height: 14,
    background: `rgba(245,213,72,${a})`,
    border: "1px solid var(--line)"
  } })), /* @__PURE__ */ React.createElement("span", null, "\uB9CE\uC74C"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("span", null, "\uCD5C\uB300 ", max, " views/cell")), hover && /* @__PURE__ */ React.createElement("div", { style: {
    position: "fixed",
    left: hover.x,
    top: hover.y - 8,
    transform: "translate(-50%, -100%)",
    background: "var(--bg-2, #1a1a1a)",
    color: "var(--ink)",
    border: "1px solid var(--line-2)",
    padding: "6px 10px",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    pointerEvents: "none",
    zIndex: 1e3,
    whiteSpace: "nowrap"
  } }, _DOW_LABELS[hover.dow], " ", String(hover.hour).padStart(2, "0"), ":00 \xB7 ", hover.views, " views \xB7 ", hover.uniq, " sessions"));
};
Object.assign(window, {
  downloadBlob,
  downloadCsv,
  downloadJson,
  pickImageWithR2Fallback,
  MiniBarChart,
  RankedBarList,
  COHORT_OPTIONS,
  CohortSelector,
  SankeyFlow,
  SubTabsView,
  HeatmapGrid
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvYWRtaW4vQWRtaW5TaGFyZWQuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyA9PT0gcGFnZXMvYWRtaW4vQWRtaW5TaGFyZWQuanN4ICh2MDAuMTg3KSA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQXV0aEFkbWluUGFnZS5qc3ggOTA1NyBcdUM5MDQgXHVCRDg0XHVENTYwXHVDNzU4IFx1Qzc3Q1x1RDY1OC4gc2VsZi1jb250YWluZWQgVUkgcHJpbWl0aXZlcyArIGhlbHBlcnMgXHVCQUE4XHVDNzRDLlxuLy8gXHVCRDg0XHVENTYwIFx1QzZEMFx1Q0U1OTogUmVhY3QgXHVDNjc4XHVCRDgwIFx1Qzc1OFx1Qzg3NCBcdUM1QzZcdUIyOTQgXHVDRUY0XHVEM0VDXHVCMTBDXHVEMkI4L1x1QzIxQ1x1QzIxOCBcdUQ1NjhcdUMyMThcdUI5Q0MuIFx1RDMyOFx1QjExMCBcdUJFNDRcdUM5ODhcdUIyQzhcdUMyQTQgXHVCODVDXHVDOUMxXHVDNzQwIEF1dGhBZG1pblBhZ2UuanN4IFx1QzcyMFx1QzlDMC5cbi8vXG4vLyBcdUJEODRcdUI3QzkgKFx1Qzc3NFx1QzgwNCBBdXRoQWRtaW5QYWdlLmpzeCBcdUI3N0NcdUM3NzgpOiBcdUM1N0QgOTAwIGxpbmVzLlxuLy8gXHVEM0VDXHVENTY4OlxuLy8gICAxKSBcdUQzMENcdUM3N0MgXHVCMkU0XHVDNkI0XHVCODVDXHVCNERDIGhlbHBlcnMgXHUyMDE0IGRvd25sb2FkQmxvYiAvIGRvd25sb2FkQ3N2IC8gZG93bmxvYWRKc29uXG4vLyAgIDIpIFx1Qzc3NFx1QkJGOFx1QzlDMCBcdUM1QzVcdUI4NUNcdUI0REMgaGVscGVyIFx1MjAxNCBwaWNrSW1hZ2VXaXRoUjJGYWxsYmFja1xuLy8gICAzKSBcdUNDMjhcdUQyQjggXHUyMDE0IE1pbmlCYXJDaGFydCAvIFJhbmtlZEJhckxpc3QgLyBDT0hPUlRfT1BUSU9OUyAvIENvaG9ydFNlbGVjdG9yXG4vLyAgIDQpIFNhbmtleSBcdUQ3NTBcdUI5ODRcdUIzQzQgXHUyMDE0IF9DSEFOTkVMX0ZPUl9IT1NUIC8gX1NUQUdFX0ZPUl9ST1VURSAvIF9DSEFOTkVMX0NPTE9SUyAvIF9DSEFOTkVMX0NPTE9SIC8gU2Fua2V5Rmxvd1xuLy8gICA1KSBzdWItdGFiICsgcHJldmlldyBcdUI3OThcdUQzN0MgXHUyMDE0IFN1YlRhYnNWaWV3XG4vL1xuLy8gXHVCMTc4XHVDRDlDOiBcdUQzMENcdUM3N0MgXHVCMDVEIE9iamVjdC5hc3NpZ24od2luZG93LCB7Li4ufSkuIEF1dGhBZG1pblBhZ2UgXHVBQzAwIGNvbnN0IFggPSB3aW5kb3cuWCBcdUI4NUMgXHVDQzM4XHVDODcwLlxuLy8gXHVCODVDXHVCNERDIFx1QzIxQ1x1QzExQzogaW5kZXguaHRtbCBcdUM1RDBcdUMxMUMgQXV0aEFkbWluUGFnZS5qcyBcdUJDRjRcdUIyRTQgXHVCQTNDXHVDODAwIChkZWZlciArIFx1QzIxQ1x1QzExQyBcdUJDRjRcdUM3QTUpLlxuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIHYwMC4xODIgXHUyMDE0IERSWTogXHVEMzBDXHVDNzdDIFx1QjJFNFx1QzZCNFx1Qjg1Q1x1QjREQyBcdUFDRjVcdUQxQjUgaGVscGVyLiBDU1YgLyBKU09OIC8gXHVDNzg0XHVDNzU4IFx1RDE0RFx1QzJBNFx1RDJCOCBcdUJBQThcdUI0NTAgXHVDOUMwXHVDNkQwLlxuLy8gXHVDNzc0XHVDODA0XHVDNUQ0IGFkbWluIFx1RDMyOFx1QjExMCA2XHVBQ0YzXHVDNUQwXHVDMTFDIFx1QUMxOVx1Qzc0MCA4LWxpbmUgXHVEMzI4XHVEMTM0IChCbG9iIFx1MjE5MiBVUkwgXHUyMTkyIGEuY2xpY2sgXHUyMTkyIHJldm9rZSkgXHVCQzE4XHVCQ0Y1LlxuY29uc3QgZG93bmxvYWRCbG9iID0gKGZpbGVuYW1lLCBjb250ZW50LCBtaW1lID0gJ3RleHQvcGxhaW47Y2hhcnNldD11dGYtOCcpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2NvbnRlbnRdLCB7IHR5cGU6IG1pbWUgfSk7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDtcbiAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICBhLmNsaWNrKCk7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcbiAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGFsZXJ0KCdcdUIyRTRcdUM2QjRcdUI4NUNcdUI0REMgXHVDMkU0XHVEMzI4OiAnICsgKGVycj8ubWVzc2FnZSB8fCAnXHVDNTRDIFx1QzIxOCBcdUM1QzZcdUIyOTQgXHVDNjI0XHVCOTU4JykpO1xuICB9XG59O1xuY29uc3QgZG93bmxvYWRDc3YgPSAoZmlsZW5hbWUsIGNzdikgPT4gZG93bmxvYWRCbG9iKGZpbGVuYW1lLCBjc3YsICd0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04Jyk7XG5jb25zdCBkb3dubG9hZEpzb24gPSAoZmlsZW5hbWUsIG9iaikgPT4gZG93bmxvYWRCbG9iKGZpbGVuYW1lLCBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIHYwMC4xODQgXHUyMDE0IERSWTogXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzVDNVx1Qjg1Q1x1QjREQyBcdUFDRjVcdUQxQjUgaGVscGVyLlxuLy8gUjIgXHVDNUM1XHVCODVDXHVCNERDIFx1QzJEQ1x1QjNDNCBcdTIxOTIgXHVDMkU0XHVEMzI4IFx1QzJEQyBGaWxlUmVhZGVyIGRhdGFVUkkgXHVEM0Y0XHVCQzMxLiBsZWN0dXJlLWNvdmVycyAvIHRvdXItY292ZXJzIC8gYm9vay1jb3ZlcnMgLyBcdUI0RjEgNCsgXHVEMzI4XHVCMTEwIFx1QjNEOVx1Qzc3QyBcdUI4NUNcdUM5QzEuXG5jb25zdCBwaWNrSW1hZ2VXaXRoUjJGYWxsYmFjayA9IGFzeW5jIChlLCB7IGZvbGRlciwgbWF4Qnl0ZXMgPSA1ICogMTAyNCAqIDEwMjQsIGZhbGxiYWNrTWF4Qnl0ZXMgPSAxLjUgKiAxMDI0ICogMTAyNCB9ID0ge30pID0+IHtcbiAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzPy5bMF07XG4gIGlmICghZmlsZSkgcmV0dXJuIG51bGw7XG4gIHRyeSB7XG4gICAgY29uc3QgeyB1cmwgfSA9IGF3YWl0IHdpbmRvdy5CR05KX01FRElBLnVwbG9hZEZpbGUoZmlsZSwgeyBmb2xkZXIsIG1heEJ5dGVzIH0pO1xuICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgcmV0dXJuIHVybDtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdHJ5IHsgY29uc29sZS53YXJuKGBbdXBsb2FkXSBSMiAke2ZvbGRlcn0gXHVDNUM1XHVCODVDXHVCNERDIFx1QzJFNFx1RDMyOCBcdTIwMTQgZGF0YVVSSSBcdUQzRjRcdUJDMzE6YCwgZXJyKTsgfSBjYXRjaCB7fVxuICB9XG4gIGlmIChmaWxlLnNpemUgPiBmYWxsYmFja01heEJ5dGVzKSB7XG4gICAgYWxlcnQoYFx1Qzc3NFx1QkJGOFx1QzlDMFx1QUMwMCBcdUIxMDhcdUJCMzQgXHVEMDdEXHVCMkM4XHVCMkU0KCR7KGZpbGUuc2l6ZS8xMDI0LzEwMjQpLnRvRml4ZWQoMSl9TUIpLiBSMiBcdUMyRTRcdUQzMjggKyAkeyhmYWxsYmFja01heEJ5dGVzLzEwMjQvMTAyNCkudG9GaXhlZCgxKX1NQiBcdUQzRjRcdUJDMzEgXHVENTVDXHVCM0M0IFx1Q0QwOFx1QUNGQy5gKTtcbiAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YVVyaSA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIub25sb2FkID0gKCkgPT4gcmVzb2x2ZShTdHJpbmcocmVhZGVyLnJlc3VsdCB8fCAnJykpO1xuICAgICAgcmVhZGVyLm9uZXJyb3IgPSByZWplY3Q7XG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICB9KTtcbiAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xuICAgIHJldHVybiBkYXRhVXJpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBhbGVydCgnXHVDNzc0XHVCQkY4XHVDOUMwIFx1Qzc3RFx1QUUzMCBcdUMyRTRcdUQzMjg6ICcgKyAoZXJyPy5tZXNzYWdlIHx8ICcnKSk7XG4gICAgZS50YXJnZXQudmFsdWUgPSAnJztcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyB2MDAuMTczIFx1MjAxNCBcdUMwQUNcdUM2QTlcdUM3OTAgXHVCQ0Y0XHVBQ0UwICdcdUJBQThcdUI0RTAgXHVDQzI4XHVEMkI4XHVCNEU0XHVDNzQwIFx1RDYzOFx1QkM4NFx1RDU1OFx1QkE3NCBcdUNDMjhcdUQyQjggXHVCMEI0XHVDNkE5XHVCQjNDXHVDNzQ0IFx1QkNGQyBcdUMyMTggXHVDNzg4XHVBQzhDJy5cbi8vIFx1QUMwMSBcdUI5QzlcdUIzMDBcdUM1RDAgbW91c2VlbnRlci9sZWF2ZSBcdUI4NUMgaG92ZXJlZElkeCBcdUNEOTRcdUM4MDEgXHUyMTkyIFx1QkQ4MFx1QjNEOSBcdUQyMzRcdUQzMDEgXHVCMTc4XHVDRDlDLiB1bml0L2Zvcm1hdHRlciBwcm9wIFx1QzczQ1x1Qjg1QyBcdUI3N0NcdUJDQTggXHVDRUU0XHVDMkE0XHVEMTMwXHVCOUM4XHVDNzc0XHVDOTg4LlxuY29uc3QgTWluaUJhckNoYXJ0ID0gKHsgc2VyaWVzLCBsYWJlbHMsIGhlaWdodCA9IDEyMCwgY29sb3IgPSAndmFyKC0tZ29sZCknLCBsYWJlbCwgdW5pdCA9ICcnLCBmb3JtYXRUb29sdGlwLCBoZWFkZXJSaWdodCB9KSA9PiB7XG4gIGNvbnN0IFtob3ZlcklkeCwgc2V0SG92ZXJJZHhdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IG1heCA9IE1hdGgubWF4KDEsIC4uLnNlcmllcyk7XG4gIGNvbnN0IFcgPSAxMDA7IC8vIHZpZXdCb3ggXHVCMkU4XHVDNzA0XG4gIGNvbnN0IEggPSA0MDtcbiAgY29uc3QgYmFyVyA9IFcgLyBNYXRoLm1heCgxLCBzZXJpZXMubGVuZ3RoKTtcbiAgY29uc3QgZm10ID0gZm9ybWF0VG9vbHRpcCB8fCAoKHYsIGwpID0+IGAke2wgPyBsICsgJyBcdTAwQjcgJyA6ICcnfSR7dn0ke3VuaXR9YCk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e3BhZGRpbmc6JzEycHggMCcsIHBvc2l0aW9uOidyZWxhdGl2ZSd9fT5cbiAgICAgIHsobGFiZWwgfHwgaGVhZGVyUmlnaHQpICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbTo4LCBmbGV4V3JhcDond3JhcCcsIGdhcDo4fX0+XG4gICAgICAgICAge2xhYmVsICYmIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMThlbSd9fT57bGFiZWx9PC9kaXY+fVxuICAgICAgICAgIHtoZWFkZXJSaWdodCAmJiA8ZGl2PntoZWFkZXJSaWdodH08L2Rpdj59XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke1d9ICR7SH1gfSBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiIHN0eWxlPXt7d2lkdGg6JzEwMCUnLCBoZWlnaHQsIGRpc3BsYXk6J2Jsb2NrJ319PlxuICAgICAgICAgIHtzZXJpZXMubWFwKCh2LCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoID0gbWF4ID4gMCA/ICh2IC8gbWF4KSAqIChIIC0gNikgOiAwO1xuICAgICAgICAgICAgY29uc3QgaXNPdGhlciA9IGhvdmVySWR4ICE9PSBudWxsICYmIGhvdmVySWR4ICE9PSBpO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGcga2V5PXtpfVxuICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SG92ZXJJZHgoaSl9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcklkeCgoYykgPT4gYyA9PT0gaSA/IG51bGwgOiBjKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcid9fT5cbiAgICAgICAgICAgICAgICA8cmVjdCB4PXtpICogYmFyVyArIDAuNn0geT17SCAtIGh9XG4gICAgICAgICAgICAgICAgICB3aWR0aD17TWF0aC5tYXgoMC40LCBiYXJXIC0gMS4yKX0gaGVpZ2h0PXtofVxuICAgICAgICAgICAgICAgICAgZmlsbD17Y29sb3J9IHJ4PXswLjN9XG4gICAgICAgICAgICAgICAgICBvcGFjaXR5PXtpc090aGVyID8gMC40IDogMX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dHJhbnNpdGlvbjonb3BhY2l0eSAuMTJzJ319Lz5cbiAgICAgICAgICAgICAgICA8cmVjdCB4PXtpICogYmFyV30geT17MH0gd2lkdGg9e2Jhcld9IGhlaWdodD17SH0gZmlsbD1cInRyYW5zcGFyZW50XCIvPlxuICAgICAgICAgICAgICAgIDx0aXRsZT57Zm10KHYsIGxhYmVscz8uW2ldIHx8ICcnKX08L3RpdGxlPlxuICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L3N2Zz5cbiAgICAgICAge2hvdmVySWR4ICE9PSBudWxsICYmIHNlcmllc1tob3ZlcklkeF0gIT09IHVuZGVmaW5lZCAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogLTI4LFxuICAgICAgICAgICAgbGVmdDogYCR7KChob3ZlcklkeCArIDAuNSkgLyBNYXRoLm1heCgxLCBzZXJpZXMubGVuZ3RoKSkgKiAxMDB9JWAsXG4gICAgICAgICAgICB0cmFuc2Zvcm06J3RyYW5zbGF0ZVgoLTUwJSknLFxuICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0taW5rKScsIGNvbG9yOid2YXIoLS1iZyknLFxuICAgICAgICAgICAgcGFkZGluZzonNXB4IDEwcHgnLCBmb250U2l6ZToxMSxcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzonMC4wNGVtJyxcbiAgICAgICAgICAgIHdoaXRlU3BhY2U6J25vd3JhcCcsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOidub25lJyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czozLFxuICAgICAgICAgICAgYm94U2hhZG93OicwIDJweCA4cHggcmdiYSgwLDAsMCwwLjI1KScsXG4gICAgICAgICAgICB6SW5kZXg6NSxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtmbXQoc2VyaWVzW2hvdmVySWR4XSwgbGFiZWxzPy5baG92ZXJJZHhdIHx8ICcnKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAge2xhYmVscyAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczpgcmVwZWF0KCR7bGFiZWxzLmxlbmd0aH0sIDFmcilgLCBmb250U2l6ZTo5LCBjb2xvcjondmFyKC0taW5rLTMpJywgbWFyZ2luVG9wOjYsIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBsZXR0ZXJTcGFjaW5nOicwLjA0ZW0nfX0+XG4gICAgICAgICAge2xhYmVscy5tYXAoKGwsIGkpID0+IChcbiAgICAgICAgICAgIDxzcGFuIGtleT17aX0gc3R5bGU9e3t0ZXh0QWxpZ246J2NlbnRlcid9fT57bH08L3NwYW4+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gdjAwLjE3OSBcdTIwMTQgXHVCN0FEXHVEMEI5IFx1QUMwMFx1Qjg1QyBcdUI5QzlcdUIzMDAgXHVCOUFDXHVDMkE0XHVEMkI4IFx1QUNGNVx1RDFCNSBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjggKERSWSkuIFx1RDYzOFx1QkM4NCBcdUMyREMgXHVCMkU0XHVCOTc4IFx1RDU2RFx1QkFBOSBkaW0uXG4vLyBpdGVtczogW3sgbGFiZWwsIGNvdW50LCBzdWI/LCBjb2xvcj8gfV0uIHVuaXQ6IFx1QjJFOFx1QzcwNCAoXHVDNjA4OiAnXHVENjhDJykuIGhlYWRlckxlZnQgLyBoZWFkZXJSaWdodDogXHVENUU0XHVCMzU0IFx1QzJBQ1x1Qjg2Ri5cbmNvbnN0IFJhbmtlZEJhckxpc3QgPSAoeyBpdGVtcyA9IFtdLCB1bml0ID0gJycsIGhlYWRlckxlZnQsIGhlYWRlclJpZ2h0LCBlbXB0eVRleHQgPSAnXHVCMzcwXHVDNzc0XHVEMTMwIFx1QzVDNlx1Qzc0QycsIG1heEl0ZW1zID0gMTAsIHZhbHVlRm9ybWF0IH0pID0+IHtcbiAgY29uc3QgW2hvdmVySWR4LCBzZXRIb3ZlcklkeF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgdmlzaWJsZSA9IGl0ZW1zLnNsaWNlKDAsIG1heEl0ZW1zKTtcbiAgY29uc3QgdG90YWwgPSB2aXNpYmxlLnJlZHVjZSgocywgaXQpID0+IHMgKyAoTnVtYmVyKGl0LmNvdW50KSB8fCAwKSwgMCkgfHwgMTtcbiAgY29uc3QgZm10ID0gdmFsdWVGb3JtYXQgfHwgKChjKSA9PiBgJHtjfSR7dW5pdH1gKTtcbiAgcmV0dXJuIChcbiAgICA8YXJ0aWNsZSBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3ttYXJnaW5Cb3R0b206MjR9fT5cbiAgICAgIHsoaGVhZGVyTGVmdCB8fCBoZWFkZXJSaWdodCkgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonY2VudGVyJywgbWFyZ2luQm90dG9tOjE0LCBmbGV4V3JhcDond3JhcCcsIGdhcDo4fX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4yMmVtJ319PntoZWFkZXJMZWZ0fTwvZGl2PlxuICAgICAgICAgIHtoZWFkZXJSaWdodCAmJiA8ZGl2PntoZWFkZXJSaWdodH08L2Rpdj59XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHt2aXNpYmxlLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxM319PntlbXB0eVRleHR9PC9wPlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2dyaWQnLCBnYXA6OH19PlxuICAgICAgICAgIHt2aXNpYmxlLm1hcCgoaXQsIGkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBjdCA9IE1hdGgucm91bmQoKChOdW1iZXIoaXQuY291bnQpIHx8IDApIC8gdG90YWwpICogMTAwKTtcbiAgICAgICAgICAgIGNvbnN0IGlzSG92ID0gaG92ZXJJZHggPT09IGk7XG4gICAgICAgICAgICBjb25zdCBpc090aGVyID0gaG92ZXJJZHggIT09IG51bGwgJiYgaG92ZXJJZHggIT09IGk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8ZGl2IGtleT17aXQuaWQgfHwgaXQubGFiZWwgfHwgaX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldEhvdmVySWR4KGkpfVxuICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0SG92ZXJJZHgoKGMpID0+IGMgPT09IGkgPyBudWxsIDogYyl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBnYXA6MTIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nOic0cHggNnB4JyxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGlzSG92ID8gJ3JnYmEoMjQ1LDIxMyw3MiwwLjA2KScgOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgb3BhY2l0eTogaXNPdGhlciA/IDAuNCA6IDEsXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOidvcGFjaXR5IC4xMnMsIGJhY2tncm91bmQgLjEycycsXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6J2RlZmF1bHQnLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgdGl0bGU9e2Ake2l0LmxhYmVsIHx8ICcnfSBcdTAwQjcgJHtmbXQoaXQuY291bnQpfSBcdTAwQjcgJHtwY3R9JWB9PlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBtaW5XaWR0aDogMjgsIHRleHRBbGlnbjoncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjExLFxuICAgICAgICAgICAgICAgICAgY29sb3I6J3ZhcigtLWluay0zKScsIGZvbnRXZWlnaHQ6NzAwLFxuICAgICAgICAgICAgICAgIH19PiN7aSsxfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBtaW5XaWR0aDogMTgwLCBmb250U2l6ZTogMTMsIGNvbG9yOid2YXIoLS1pbmspJyxcbiAgICAgICAgICAgICAgICAgIG92ZXJmbG93OidoaWRkZW4nLCB0ZXh0T3ZlcmZsb3c6J2VsbGlwc2lzJywgd2hpdGVTcGFjZTonbm93cmFwJyxcbiAgICAgICAgICAgICAgICAgIGZsZXg6JzAgMSAyNDBweCcsXG4gICAgICAgICAgICAgICAgfX0+e2l0LmxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4OjEsIGhlaWdodDo4LCBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIG92ZXJmbG93OidoaWRkZW4nLCBwb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIGxlZnQ6MCwgdG9wOjAsIGJvdHRvbTowLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDpgJHtwY3R9JWAsIGJhY2tncm91bmQ6IGl0LmNvbG9yIHx8ICd2YXIoLS1nb2xkKScsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246J3dpZHRoIC4xMnMnLFxuICAgICAgICAgICAgICAgICAgfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ub1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBtaW5XaWR0aDogOTAsIHRleHRBbGlnbjoncmlnaHQnLCBmb250U2l6ZToxMixcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBpc0hvdiA/ICd2YXIoLS1pbmspJyA6ICd2YXIoLS1nb2xkLTIpJywgZm9udFdlaWdodDo2MDAsXG4gICAgICAgICAgICAgICAgfX0+e3BjdH0lICh7Zm10KGl0LmNvdW50KX0pPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvYXJ0aWNsZT5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gdjAwLjE3My8xNzYgXHUyMDE0IFx1Q0MyOFx1RDJCOCBcdUNGNTRcdUQ2MzhcdUQyQjggKFx1QUUzMFx1QUMwNCkgXHVDMTIwXHVEMEREIFx1QUNGNVx1RDFCNSBVSS5cbmNvbnN0IENPSE9SVF9PUFRJT05TID0gW1xuICB7IHZhbHVlOiAxLCAgbGFiZWw6ICcxXHVDNzdDJyB9LFxuICB7IHZhbHVlOiA3LCAgbGFiZWw6ICc3XHVDNzdDJyB9LFxuICB7IHZhbHVlOiAxNCwgbGFiZWw6ICcxNFx1Qzc3QycgfSxcbiAgeyB2YWx1ZTogMzAsIGxhYmVsOiAnMzBcdUM3N0MnIH0sXG4gIHsgdmFsdWU6IDkwLCBsYWJlbDogJzkwXHVDNzdDJyB9LFxuXTtcbmNvbnN0IENvaG9ydFNlbGVjdG9yID0gKHsgdmFsdWUsIG9uQ2hhbmdlLCBvcHRpb25zID0gQ09IT1JUX09QVElPTlMgfSkgPT4gKFxuICA8ZGl2IHJvbGU9XCJ0YWJsaXN0XCIgYXJpYS1sYWJlbD1cIlx1QUUzMFx1QUMwNCBcdUMxMjBcdUQwRERcIiBzdHlsZT17e2Rpc3BsYXk6J2lubGluZS1mbGV4JywgZ2FwOjAsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBib3JkZXJSYWRpdXM6MH19PlxuICAgIHtvcHRpb25zLm1hcCgob3B0LCBpKSA9PiAoXG4gICAgICA8YnV0dG9uIGtleT17b3B0LnZhbHVlfSB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cInRhYlwiXG4gICAgICAgIGFyaWEtc2VsZWN0ZWQ9e3ZhbHVlID09PSBvcHQudmFsdWV9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlKG9wdC52YWx1ZSl9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcGFkZGluZzonNHB4IDEwcHgnLFxuICAgICAgICAgIGZvbnRTaXplOjExLCBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJyxcbiAgICAgICAgICBmb250V2VpZ2h0OiB2YWx1ZSA9PT0gb3B0LnZhbHVlID8gODAwIDogNTAwLFxuICAgICAgICAgIGxldHRlclNwYWNpbmc6JzAuMDZlbScsXG4gICAgICAgICAgYm9yZGVyOidub25lJyxcbiAgICAgICAgICBib3JkZXJMZWZ0OiBpID09PSAwID8gJ25vbmUnIDogJzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YWx1ZSA9PT0gb3B0LnZhbHVlID8gJ3JnYmEoMjQ1LDIxMyw3MiwwLjE0KScgOiAndmFyKC0tYmcpJyxcbiAgICAgICAgICBjb2xvcjogdmFsdWUgPT09IG9wdC52YWx1ZSA/ICd2YXIoLS1pbmspJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgIH19PntvcHQubGFiZWx9PC9idXR0b24+XG4gICAgKSl9XG4gIDwvZGl2PlxuKTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyB2MDAuMTc0IFx1MjAxNCBTYW5rZXkgRmxvdyBDaGFydCBcdUQ1RUNcdUQzN0MgKyBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjguXG5jb25zdCBfQ0hBTk5FTF9GT1JfSE9TVCA9IChob3N0KSA9PiB7XG4gIGNvbnN0IGggPSBTdHJpbmcoaG9zdCB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFoIHx8IGggPT09ICdcdUM5QzFcdUM4MTEgXHVCQzI5XHVCQjM4JykgcmV0dXJuICdcdUM5QzFcdUM4MTEgXHVCQzI5XHVCQjM4JztcbiAgaWYgKC9mYWNlYm9va3xmYlxcLi8udGVzdChoKSkgcmV0dXJuICdcdUQzOThcdUM3NzRcdUMyQTRcdUJEODEnO1xuICBpZiAoL2luc3RhZ3JhbS8udGVzdChoKSkgcmV0dXJuICdcdUM3NzhcdUMyQTRcdUQwQzBcdUFERjhcdUI3QTgnO1xuICBpZiAoL2dvb2dsZXxnc3RhdGljfGd3cy8udGVzdChoKSkgcmV0dXJuICdcdUFENkNcdUFFMDAnO1xuICBpZiAoL25hdmVyLy50ZXN0KGgpKSByZXR1cm4gJ1x1QjEyNFx1Qzc3NFx1QkM4NCc7XG4gIGlmICgveW91dHViZXx5b3V0dVxcLmJlLy50ZXN0KGgpKSByZXR1cm4gJ1x1QzcyMFx1RDI5Q1x1QkUwQyc7XG4gIGlmICgvdHdpdHRlcnx0XFwuY298eFxcLmNvbS8udGVzdChoKSkgcmV0dXJuICdcdUQyQjhcdUM3MDRcdUQxMzAvWCc7XG4gIGlmICgvdGhyZWFkcy8udGVzdChoKSkgcmV0dXJuICdcdUMyQTRcdUI4MDhcdUI0REMnO1xuICBpZiAoL2tha2FvLy50ZXN0KGgpKSByZXR1cm4gJ1x1Q0U3NFx1Q0U3NFx1QzYyNCc7XG4gIGlmICgvYmdualxcLm5ldHxiZ25qLS8udGVzdChoKSkgcmV0dXJuICdcdUIwQjRcdUJEODAgXHVDNzc0XHVCM0Q5JztcbiAgcmV0dXJuIGhvc3Q7XG59O1xuY29uc3QgX1NUQUdFX0ZPUl9ST1VURSA9IChyb3V0ZSkgPT4ge1xuICBjb25zdCByID0gU3RyaW5nKHJvdXRlIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAociA9PT0gJy8nIHx8IHIgPT09ICcvaG9tZScgfHwgciA9PT0gJycpIHJldHVybiAnQXdhcmVuZXNzJztcbiAgaWYgKC9eXFwvKGNvbHVtbnxib29rfGZhcXx0ZXJtc3xwcml2YWN5fGVhdHxzbGVlcHxzaG9wKS8udGVzdChyKSkgcmV0dXJuICdJbnRlcmVzdCc7XG4gIGlmICgvXlxcLyh0b3VyfGxlY3R1cmVzfHNpZ251cHxsb2dpbnxjaGVja291dHxjb21tdW5pdHl8bXlwYWdlfGFkbWluKS8udGVzdChyKSkgcmV0dXJuICdDb25zaWRlcmF0aW9uJztcbiAgcmV0dXJuICdJbnRlcmVzdCc7XG59O1xuY29uc3QgX0NIQU5ORUxfQ09MT1JTID0ge1xuICAnXHVEMzk4XHVDNzc0XHVDMkE0XHVCRDgxJzogJyMzYjgyZjYnLFxuICAnXHVDNzc4XHVDMkE0XHVEMEMwXHVBREY4XHVCN0E4JzogJyNlYzQ4OTknLFxuICAnXHVBRDZDXHVBRTAwJzogJyMxMGI5ODEnLFxuICAnXHVCMTI0XHVDNzc0XHVCQzg0JzogJyMyMmM1NWUnLFxuICAnXHVDNzIwXHVEMjlDXHVCRTBDJzogJyNlZjQ0NDQnLFxuICAnXHVDRTc0XHVDRTc0XHVDNjI0JzogJyNmNTllMGInLFxuICAnXHVEMkI4XHVDNzA0XHVEMTMwL1gnOiAnIzBlYTVlOScsXG4gICdcdUMyQTRcdUI4MDhcdUI0REMnOiAnI2E4NTVmNycsXG4gICdcdUIwQjRcdUJEODAgXHVDNzc0XHVCM0Q5JzogJyM5NGEzYjgnLFxuICAnXHVDOUMxXHVDODExIFx1QkMyOVx1QkIzOCc6ICcjNjQ3NDhiJyxcbn07XG5jb25zdCBfQ0hBTk5FTF9DT0xPUiA9IChuYW1lKSA9PiBfQ0hBTk5FTF9DT0xPUlNbbmFtZV0gfHwgJ3ZhcigtLWdvbGQpJztcblxuY29uc3QgU2Fua2V5RmxvdyA9ICh7IHBhaXJzLCBkYXlzLCBvbkRheXNDaGFuZ2UgfSkgPT4ge1xuICBjb25zdCBbaG92ZXIsIHNldEhvdmVyXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuXG4gIGNvbnN0IHJvd3MgPSBSZWFjdC51c2VNZW1vKCgpID0+IChwYWlycyB8fCBbXSkubWFwKChwKSA9PiAoe1xuICAgIC4uLnAsXG4gICAgY2hhbm5lbDogX0NIQU5ORUxfRk9SX0hPU1QocC5yZWZlcnJlciB8fCAnXHVDOUMxXHVDODExIFx1QkMyOVx1QkIzOCcpLFxuICAgIHN0YWdlOiBfU1RBR0VfRk9SX1JPVVRFKHAucm91dGUpLFxuICB9KSksIFtwYWlyc10pO1xuXG4gIGNvbnN0IGNoYW5uZWxTdW1zID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgbSA9IG5ldyBNYXAoKTtcbiAgICByb3dzLmZvckVhY2goKHIpID0+IG0uc2V0KHIuY2hhbm5lbCwgKG0uZ2V0KHIuY2hhbm5lbCkgfHwgMCkgKyByLmNvdW50KSk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obS5lbnRyaWVzKCkpLm1hcCgoW25hbWUsIGNvdW50XSkgPT4gKHsgbmFtZSwgY291bnQgfSkpLnNvcnQoKGEsIGIpID0+IGIuY291bnQgLSBhLmNvdW50KTtcbiAgfSwgW3Jvd3NdKTtcblxuICBjb25zdCBzdGFnZU9yZGVyID0gWydBd2FyZW5lc3MnLCAnSW50ZXJlc3QnLCAnQ29uc2lkZXJhdGlvbiddO1xuICBjb25zdCBzdGFnZVN1bXMgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBtID0gbmV3IE1hcCgpO1xuICAgIHJvd3MuZm9yRWFjaCgocikgPT4gbS5zZXQoci5zdGFnZSwgKG0uZ2V0KHIuc3RhZ2UpIHx8IDApICsgci5jb3VudCkpO1xuICAgIHJldHVybiBzdGFnZU9yZGVyLm1hcCgocykgPT4gKHsgbmFtZTogcywgY291bnQ6IG0uZ2V0KHMpIHx8IDAgfSkpLmZpbHRlcigocykgPT4gcy5jb3VudCA+IDApO1xuICB9LCBbcm93c10pO1xuXG4gIGNvbnN0IHJvdXRlU3VtcyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IG0gPSBuZXcgTWFwKCk7XG4gICAgcm93cy5mb3JFYWNoKChyKSA9PiBtLnNldChyLnJvdXRlLCAobS5nZXQoci5yb3V0ZSkgfHwgMCkgKyByLmNvdW50KSk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obS5lbnRyaWVzKCkpLm1hcCgoW3JvdXRlLCBjb3VudF0pID0+ICh7IG5hbWU6IHJvdXRlLCBjb3VudCB9KSkuc29ydCgoYSwgYikgPT4gYi5jb3VudCAtIGEuY291bnQpLnNsaWNlKDAsIDgpO1xuICB9LCBbcm93c10pO1xuICBjb25zdCByb3V0ZVNldCA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gbmV3IFNldChyb3V0ZVN1bXMubWFwKChyKSA9PiByLm5hbWUpKSwgW3JvdXRlU3Vtc10pO1xuXG4gIGNvbnN0IGxpbmtzQSA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IG0gPSBuZXcgTWFwKCk7XG4gICAgcm93cy5mb3JFYWNoKChyKSA9PiB7XG4gICAgICBpZiAoIXJvdXRlU2V0LmhhcyhyLnJvdXRlKSkgcmV0dXJuO1xuICAgICAgY29uc3QgayA9IGAke3IuY2hhbm5lbH18JHtyLnN0YWdlfWA7XG4gICAgICBtLnNldChrLCAobS5nZXQoaykgfHwgMCkgKyByLmNvdW50KTtcbiAgICB9KTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShtLmVudHJpZXMoKSkubWFwKChbaywgY291bnRdKSA9PiB7XG4gICAgICBjb25zdCBbY2hhbm5lbCwgc3RhZ2VdID0gay5zcGxpdCgnfCcpO1xuICAgICAgcmV0dXJuIHsgY2hhbm5lbCwgc3RhZ2UsIGNvdW50IH07XG4gICAgfSk7XG4gIH0sIFtyb3dzLCByb3V0ZVNldF0pO1xuXG4gIGNvbnN0IGxpbmtzQiA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IG0gPSBuZXcgTWFwKCk7XG4gICAgcm93cy5mb3JFYWNoKChyKSA9PiB7XG4gICAgICBpZiAoIXJvdXRlU2V0LmhhcyhyLnJvdXRlKSkgcmV0dXJuO1xuICAgICAgY29uc3QgayA9IGAke3Iuc3RhZ2V9fCR7ci5yb3V0ZX1gO1xuICAgICAgbS5zZXQoaywgKG0uZ2V0KGspIHx8IDApICsgci5jb3VudCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obS5lbnRyaWVzKCkpLm1hcCgoW2ssIGNvdW50XSkgPT4ge1xuICAgICAgY29uc3QgW3N0YWdlLCByb3V0ZV0gPSBrLnNwbGl0KCd8Jyk7XG4gICAgICByZXR1cm4geyBzdGFnZSwgcm91dGUsIGNvdW50IH07XG4gICAgfSk7XG4gIH0sIFtyb3dzLCByb3V0ZVNldF0pO1xuXG4gIGNvbnN0IFcgPSAxMDAwO1xuICBjb25zdCBOT0RFX1cgPSAxNDtcbiAgY29uc3QgQ09MX1ggPSBbODAsIDQ4MCwgODgwXTtcbiAgY29uc3QgVE9QX1BBRCA9IDMwO1xuICBjb25zdCBCT1RfUEFEID0gMjA7XG4gIGNvbnN0IE5PREVfR0FQID0gODtcblxuICBjb25zdCBjb2xUb3RhbCA9IChhcnIpID0+IGFyci5yZWR1Y2UoKHMsIG4pID0+IHMgKyBuLmNvdW50LCAwKTtcbiAgY29uc3QgdG90YWxDaCA9IE1hdGgubWF4KDEsIGNvbFRvdGFsKGNoYW5uZWxTdW1zKSk7XG4gIGNvbnN0IHRvdGFsU3QgPSBNYXRoLm1heCgxLCBjb2xUb3RhbChzdGFnZVN1bXMpKTtcbiAgY29uc3QgdG90YWxSdCA9IE1hdGgubWF4KDEsIGNvbFRvdGFsKHJvdXRlU3VtcykpO1xuICBjb25zdCBtYXhOb2Rlc0luQ29sID0gTWF0aC5tYXgoY2hhbm5lbFN1bXMubGVuZ3RoLCBzdGFnZVN1bXMubGVuZ3RoLCByb3V0ZVN1bXMubGVuZ3RoKTtcbiAgY29uc3QgY29sU3VtcyA9IFt0b3RhbENoLCB0b3RhbFN0LCB0b3RhbFJ0XTtcbiAgY29uc3QgbWF4VG90YWwgPSBNYXRoLm1heCguLi5jb2xTdW1zKTtcbiAgY29uc3QgSEVJR0hUID0gTWF0aC5taW4oNzIwLCBNYXRoLm1heCgzMjAsIG1heE5vZGVzSW5Db2wgKiAzNiArIG1heFRvdGFsIC8gMikpO1xuICBjb25zdCB1c2FibGVIID0gSEVJR0hUIC0gVE9QX1BBRCAtIEJPVF9QQUQgLSAobWF4Tm9kZXNJbkNvbCAtIDEpICogTk9ERV9HQVA7XG4gIGNvbnN0IHNjYWxlID0gdXNhYmxlSCAvIG1heFRvdGFsO1xuXG4gIGNvbnN0IGxheW91dCA9IChhcnIpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgbGV0IHkgPSBUT1BfUEFEO1xuICAgIGFyci5mb3JFYWNoKChuKSA9PiB7XG4gICAgICBjb25zdCBoID0gTWF0aC5tYXgoMiwgbi5jb3VudCAqIHNjYWxlKTtcbiAgICAgIHJlc3VsdC5zZXQobi5uYW1lLCB7IHksIGgsIGNvdW50OiBuLmNvdW50IH0pO1xuICAgICAgeSArPSBoICsgTk9ERV9HQVA7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgY29uc3QgY2hQb3MgPSBsYXlvdXQoY2hhbm5lbFN1bXMpO1xuICBjb25zdCBzdFBvcyA9IGxheW91dChzdGFnZVN1bXMpO1xuICBjb25zdCBydFBvcyA9IGxheW91dChyb3V0ZVN1bXMpO1xuXG4gIGNvbnN0IGNoT2Zmc2V0ID0gbmV3IE1hcCgpO1xuICBjb25zdCBzdE9mZnNldEluID0gbmV3IE1hcCgpO1xuICBjb25zdCBzdE9mZnNldE91dCA9IG5ldyBNYXAoKTtcbiAgY29uc3QgcnRPZmZzZXQgPSBuZXcgTWFwKCk7XG5cbiAgY29uc3Qgc29ydGVkQSA9IGxpbmtzQS5zbGljZSgpLnNvcnQoKGEsIGIpID0+IHtcbiAgICBjb25zdCBheSA9IGNoUG9zLmdldChhLmNoYW5uZWwpPy55ID8/IDA7XG4gICAgY29uc3QgYnkgPSBjaFBvcy5nZXQoYi5jaGFubmVsKT8ueSA/PyAwO1xuICAgIGlmIChheSAhPT0gYnkpIHJldHVybiBheSAtIGJ5O1xuICAgIHJldHVybiBiLmNvdW50IC0gYS5jb3VudDtcbiAgfSk7XG4gIGNvbnN0IHJpYmJvbnNBID0gc29ydGVkQS5tYXAoKGxrKSA9PiB7XG4gICAgY29uc3QgY2ggPSBjaFBvcy5nZXQobGsuY2hhbm5lbCk7XG4gICAgY29uc3Qgc3QgPSBzdFBvcy5nZXQobGsuc3RhZ2UpO1xuICAgIGlmICghY2ggfHwgIXN0KSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCB0ID0gbGsuY291bnQgKiBzY2FsZTtcbiAgICBjb25zdCBvZmZDaCA9IGNoT2Zmc2V0LmdldChsay5jaGFubmVsKSB8fCAwO1xuICAgIGNvbnN0IG9mZlN0ID0gc3RPZmZzZXRJbi5nZXQobGsuc3RhZ2UpIHx8IDA7XG4gICAgY29uc3QgeTEgPSBjaC55ICsgb2ZmQ2ggKyB0IC8gMjtcbiAgICBjb25zdCB5MiA9IHN0LnkgKyBvZmZTdCArIHQgLyAyO1xuICAgIGNoT2Zmc2V0LnNldChsay5jaGFubmVsLCBvZmZDaCArIHQpO1xuICAgIHN0T2Zmc2V0SW4uc2V0KGxrLnN0YWdlLCBvZmZTdCArIHQpO1xuICAgIHJldHVybiB7IC4uLmxrLCB5MSwgeTIsIHQgfTtcbiAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIGNvbnN0IHNvcnRlZEIgPSBsaW5rc0Iuc2xpY2UoKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgY29uc3QgYXkgPSBzdFBvcy5nZXQoYS5zdGFnZSk/LnkgPz8gMDtcbiAgICBjb25zdCBieSA9IHN0UG9zLmdldChiLnN0YWdlKT8ueSA/PyAwO1xuICAgIGlmIChheSAhPT0gYnkpIHJldHVybiBheSAtIGJ5O1xuICAgIHJldHVybiBiLmNvdW50IC0gYS5jb3VudDtcbiAgfSk7XG4gIGNvbnN0IHJpYmJvbnNCID0gc29ydGVkQi5tYXAoKGxrKSA9PiB7XG4gICAgY29uc3Qgc3QgPSBzdFBvcy5nZXQobGsuc3RhZ2UpO1xuICAgIGNvbnN0IHJ0ID0gcnRQb3MuZ2V0KGxrLnJvdXRlKTtcbiAgICBpZiAoIXN0IHx8ICFydCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgdCA9IGxrLmNvdW50ICogc2NhbGU7XG4gICAgY29uc3Qgb2ZmU3QgPSBzdE9mZnNldE91dC5nZXQobGsuc3RhZ2UpIHx8IDA7XG4gICAgY29uc3Qgb2ZmUnQgPSBydE9mZnNldC5nZXQobGsucm91dGUpIHx8IDA7XG4gICAgY29uc3QgeTEgPSBzdC55ICsgb2ZmU3QgKyB0IC8gMjtcbiAgICBjb25zdCB5MiA9IHJ0LnkgKyBvZmZSdCArIHQgLyAyO1xuICAgIHN0T2Zmc2V0T3V0LnNldChsay5zdGFnZSwgb2ZmU3QgKyB0KTtcbiAgICBydE9mZnNldC5zZXQobGsucm91dGUsIG9mZlJ0ICsgdCk7XG4gICAgcmV0dXJuIHsgLi4ubGssIHkxLCB5MiwgdCB9O1xuICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgaWYgKGNoYW5uZWxTdW1zLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17e3BhZGRpbmc6MjR9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbToxNCwgZmxleFdyYXA6J3dyYXAnLCBnYXA6OH19PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZ29sZFwiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMjRlbScsIG1hcmdpbkJvdHRvbTo0fX0+Sk9VUk5FWSBcdTAwQjcgXHVBQ0UwXHVBQzFEIFx1QzVFQ1x1QzgxNSBcdUQ3NTBcdUI5ODQ8L2Rpdj5cbiAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MTgsIG1hcmdpbjowfX0+XHVDNzIwXHVDNzg1IFx1Q0M0NFx1QjExMCBcdTIxOTIgXHVCMkU4XHVBQ0M0IFx1MjE5MiBcdUIzMDBcdUQ0NUMgXHVCM0M0XHVDQzI5IFx1RDM5OFx1Qzc3NFx1QzlDMDwvaDI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPENvaG9ydFNlbGVjdG9yIHZhbHVlPXtkYXlzfSBvbkNoYW5nZT17b25EYXlzQ2hhbmdlfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBsaW5lSGVpZ2h0OjEuN319PlxuICAgICAgICAgIFx1Q0Q1Q1x1QURGQyB7ZGF5c31cdUM3N0NcdUFDMDQgXHVDRTIxXHVDODE1XHVCNDFDIFx1RDM5OFx1Qzc3NFx1QzlDMFx1QkRGMFx1QUMwMCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUJDMjlcdUJCMzhcdUM3NzQgXHVCMjA0XHVDODAxXHVCNDE4XHVBQzcwXHVCMDk4IFx1Q0Y1NFx1RDYzOFx1RDJCOFx1Qjk3QyBcdUIyOThcdUI5QUNcdUJBNzQgXHVENDVDXHVDMkRDXHVCNDI5XHVCMkM4XHVCMkU0LlxuICAgICAgICA8L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgY3ViaWNQYXRoID0gKHgxLCB5MSwgeDIsIHkyLCB0KSA9PiB7XG4gICAgY29uc3QgY3gxID0gKHgxICsgeDIpIC8gMjtcbiAgICBjb25zdCBjeDIgPSAoeDEgKyB4MikgLyAyO1xuICAgIHJldHVybiBbXG4gICAgICBgTSAke3gxfSAke3kxIC0gdC8yfWAsXG4gICAgICBgQyAke2N4MX0gJHt5MSAtIHQvMn0sICR7Y3gyfSAke3kyIC0gdC8yfSwgJHt4Mn0gJHt5MiAtIHQvMn1gLFxuICAgICAgYEwgJHt4Mn0gJHt5MiArIHQvMn1gLFxuICAgICAgYEMgJHtjeDJ9ICR7eTIgKyB0LzJ9LCAke2N4MX0gJHt5MSArIHQvMn0sICR7eDF9ICR7eTEgKyB0LzJ9YCxcbiAgICAgICdaJyxcbiAgICBdLmpvaW4oJyAnKTtcbiAgfTtcblxuICBjb25zdCBjaGFubmVsTGlua2VkID0gKGNoTmFtZSkgPT4ge1xuICAgIGNvbnN0IHN0YWdlcyA9IG5ldyBTZXQobGlua3NBLmZpbHRlcigobCkgPT4gbC5jaGFubmVsID09PSBjaE5hbWUpLm1hcCgobCkgPT4gbC5zdGFnZSkpO1xuICAgIGNvbnN0IHJvdXRlcyA9IG5ldyBTZXQobGlua3NCLmZpbHRlcigobCkgPT4gc3RhZ2VzLmhhcyhsLnN0YWdlKSkubWFwKChsKSA9PiBsLnJvdXRlKSk7XG4gICAgcmV0dXJuIHsgc3RhZ2VzLCByb3V0ZXMgfTtcbiAgfTtcbiAgY29uc3Qgcm91dGVMaW5rZWQgPSAocnROYW1lKSA9PiB7XG4gICAgY29uc3Qgc3RhZ2VzID0gbmV3IFNldChsaW5rc0IuZmlsdGVyKChsKSA9PiBsLnJvdXRlID09PSBydE5hbWUpLm1hcCgobCkgPT4gbC5zdGFnZSkpO1xuICAgIGNvbnN0IGNoYW5uZWxzID0gbmV3IFNldChsaW5rc0EuZmlsdGVyKChsKSA9PiBzdGFnZXMuaGFzKGwuc3RhZ2UpKS5tYXAoKGwpID0+IGwuY2hhbm5lbCkpO1xuICAgIHJldHVybiB7IHN0YWdlcywgY2hhbm5lbHMgfTtcbiAgfTtcbiAgY29uc3Qgc3RhZ2VMaW5rZWQgPSAoc3ROYW1lKSA9PiB7XG4gICAgY29uc3QgY2hhbm5lbHMgPSBuZXcgU2V0KGxpbmtzQS5maWx0ZXIoKGwpID0+IGwuc3RhZ2UgPT09IHN0TmFtZSkubWFwKChsKSA9PiBsLmNoYW5uZWwpKTtcbiAgICBjb25zdCByb3V0ZXMgPSBuZXcgU2V0KGxpbmtzQi5maWx0ZXIoKGwpID0+IGwuc3RhZ2UgPT09IHN0TmFtZSkubWFwKChsKSA9PiBsLnJvdXRlKSk7XG4gICAgcmV0dXJuIHsgY2hhbm5lbHMsIHJvdXRlcyB9O1xuICB9O1xuXG4gIGNvbnN0IGRpbSA9IChraW5kLCBrZXkpID0+IHtcbiAgICBpZiAoIWhvdmVyKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGhvdmVyLnR5cGUgPT09ICdjaGFubmVsJykge1xuICAgICAgY29uc3QgeyBzdGFnZXMsIHJvdXRlcyB9ID0gY2hhbm5lbExpbmtlZChob3Zlci5rZXkpO1xuICAgICAgaWYgKGtpbmQgPT09ICdjaGFubmVsJykgcmV0dXJuIGtleSAhPT0gaG92ZXIua2V5O1xuICAgICAgaWYgKGtpbmQgPT09ICdzdGFnZScpIHJldHVybiAhc3RhZ2VzLmhhcyhrZXkpO1xuICAgICAgaWYgKGtpbmQgPT09ICdyb3V0ZScpIHJldHVybiAhcm91dGVzLmhhcyhrZXkpO1xuICAgICAgaWYgKGtpbmQgPT09ICdsaW5rQScpIHJldHVybiBrZXkuY2hhbm5lbCAhPT0gaG92ZXIua2V5O1xuICAgICAgaWYgKGtpbmQgPT09ICdsaW5rQicpIHJldHVybiAhc3RhZ2VzLmhhcyhrZXkuc3RhZ2UpO1xuICAgIH0gZWxzZSBpZiAoaG92ZXIudHlwZSA9PT0gJ3N0YWdlJykge1xuICAgICAgY29uc3QgeyBjaGFubmVscywgcm91dGVzIH0gPSBzdGFnZUxpbmtlZChob3Zlci5rZXkpO1xuICAgICAgaWYgKGtpbmQgPT09ICdjaGFubmVsJykgcmV0dXJuICFjaGFubmVscy5oYXMoa2V5KTtcbiAgICAgIGlmIChraW5kID09PSAnc3RhZ2UnKSByZXR1cm4ga2V5ICE9PSBob3Zlci5rZXk7XG4gICAgICBpZiAoa2luZCA9PT0gJ3JvdXRlJykgcmV0dXJuICFyb3V0ZXMuaGFzKGtleSk7XG4gICAgICBpZiAoa2luZCA9PT0gJ2xpbmtBJykgcmV0dXJuIGtleS5zdGFnZSAhPT0gaG92ZXIua2V5O1xuICAgICAgaWYgKGtpbmQgPT09ICdsaW5rQicpIHJldHVybiBrZXkuc3RhZ2UgIT09IGhvdmVyLmtleTtcbiAgICB9IGVsc2UgaWYgKGhvdmVyLnR5cGUgPT09ICdyb3V0ZScpIHtcbiAgICAgIGNvbnN0IHsgc3RhZ2VzLCBjaGFubmVscyB9ID0gcm91dGVMaW5rZWQoaG92ZXIua2V5KTtcbiAgICAgIGlmIChraW5kID09PSAnY2hhbm5lbCcpIHJldHVybiAhY2hhbm5lbHMuaGFzKGtleSk7XG4gICAgICBpZiAoa2luZCA9PT0gJ3N0YWdlJykgcmV0dXJuICFzdGFnZXMuaGFzKGtleSk7XG4gICAgICBpZiAoa2luZCA9PT0gJ3JvdXRlJykgcmV0dXJuIGtleSAhPT0gaG92ZXIua2V5O1xuICAgICAgaWYgKGtpbmQgPT09ICdsaW5rQScpIHJldHVybiAhc3RhZ2VzLmhhcyhrZXkuc3RhZ2UpO1xuICAgICAgaWYgKGtpbmQgPT09ICdsaW5rQicpIHJldHVybiBrZXkucm91dGUgIT09IGhvdmVyLmtleTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IHRydW5jYXRlID0gKHMsIG4pID0+IChTdHJpbmcocyB8fCAnJykubGVuZ3RoID4gbiA/IFN0cmluZyhzKS5zbGljZSgwLCBuIC0gMSkgKyAnXHUyMDI2JyA6IFN0cmluZyhzIHx8ICcnKSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17e3BhZGRpbmc6MjQsIG1hcmdpbkJvdHRvbToxOH19PlxuICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2ZsZXgtZW5kJywgbWFyZ2luQm90dG9tOjE0LCBmbGV4V3JhcDond3JhcCcsIGdhcDo4fX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vIGdvbGRcIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBsZXR0ZXJTcGFjaW5nOicwLjI0ZW0nLCBtYXJnaW5Cb3R0b206NH19PkpPVVJORVkgXHUwMEI3IFx1QUNFMFx1QUMxRCBcdUM1RUNcdUM4MTUgXHVENzUwXHVCOTg0PC9kaXY+XG4gICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToxOCwgbWFyZ2luOjB9fT5cdUM3MjBcdUM3ODUgXHVDQzQ0XHVCMTEwIFx1MjE5MiBcdUIyRThcdUFDQzQgXHUyMTkyIFx1QjMwMFx1RDQ1QyBcdUIzQzRcdUNDMjkgXHVEMzk4XHVDNzc0XHVDOUMwPC9oMj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTEsIG1hcmdpblRvcDo2LCBsaW5lSGVpZ2h0OjEuNn19PlxuICAgICAgICAgICAgXHVCMTc4XHVCNERDIFx1QjYxMFx1QjI5NCBcdUFDRTFcdUMxMjBcdUM1RDAgXHVENjM4XHVCQzg0XHVENTU4XHVCQTc0IFx1QzVGMFx1QUNCMFx1QjQxQyBcdUQ3NTBcdUI5ODRcdUM3NzQgXHVBQzE1XHVDODcwXHVCNDI5XHVCMkM4XHVCMkU0LiBcdUM3MDRcdUNBQkQgW1x1QUUzMFx1QUMwNF0gXHVDNzNDXHVCODVDIFx1Q0Y1NFx1RDYzOFx1RDJCOCBcdUJDQzBcdUFDQkQuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPENvaG9ydFNlbGVjdG9yIHZhbHVlPXtkYXlzfSBvbkNoYW5nZT17b25EYXlzQ2hhbmdlfS8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjoncmVsYXRpdmUnLCBvdmVyZmxvdzonYXV0byd9fT5cbiAgICAgICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7V30gJHtIRUlHSFR9YH0gc3R5bGU9e3t3aWR0aDonMTAwJScsIG1pbldpZHRoOjcyMCwgaGVpZ2h0OkhFSUdIVCwgZGlzcGxheTonYmxvY2snfX0+XG4gICAgICAgICAgPHRleHQgeD17Q09MX1hbMF0gKyBOT0RFX1cgLyAyfSB5PXsxNn0gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZpbGw9XCJ2YXIoLS1pbmstMylcIlxuICAgICAgICAgICAgZm9udFNpemU9ezExfSBmb250RmFtaWx5PVwidmFyKC0tZm9udC1tb25vKVwiIGxldHRlclNwYWNpbmc9XCIwLjJlbVwiPlx1QzcyMFx1Qzc4NSBcdUNDNDRcdUIxMTA8L3RleHQ+XG4gICAgICAgICAgPHRleHQgeD17Q09MX1hbMV0gKyBOT0RFX1cgLyAyfSB5PXsxNn0gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZpbGw9XCJ2YXIoLS1pbmstMylcIlxuICAgICAgICAgICAgZm9udFNpemU9ezExfSBmb250RmFtaWx5PVwidmFyKC0tZm9udC1tb25vKVwiIGxldHRlclNwYWNpbmc9XCIwLjJlbVwiPlx1QjJFOFx1QUNDNDwvdGV4dD5cbiAgICAgICAgICA8dGV4dCB4PXtDT0xfWFsyXSArIE5PREVfVyAvIDJ9IHk9ezE2fSB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZmlsbD1cInZhcigtLWluay0zKVwiXG4gICAgICAgICAgICBmb250U2l6ZT17MTF9IGZvbnRGYW1pbHk9XCJ2YXIoLS1mb250LW1vbm8pXCIgbGV0dGVyU3BhY2luZz1cIjAuMmVtXCI+XHVCM0M0XHVDQzI5IFx1RDM5OFx1Qzc3NFx1QzlDMDwvdGV4dD5cblxuICAgICAgICAgIHtyaWJib25zQS5tYXAoKGxrLCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB4MSA9IENPTF9YWzBdICsgTk9ERV9XO1xuICAgICAgICAgICAgY29uc3QgeDIgPSBDT0xfWFsxXTtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVkID0gZGltKCdsaW5rQScsIGxrKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxwYXRoIGtleT17YEEke2l9YH1cbiAgICAgICAgICAgICAgICBkPXtjdWJpY1BhdGgoeDEsIGxrLnkxLCB4MiwgbGsueTIsIGxrLnQpfVxuICAgICAgICAgICAgICAgIGZpbGw9e19DSEFOTkVMX0NPTE9SKGxrLmNoYW5uZWwpfVxuICAgICAgICAgICAgICAgIG9wYWNpdHk9e2ZhZGVkID8gMC4wNiA6IDAuMzJ9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCB0cmFuc2l0aW9uOidvcGFjaXR5IC4xMnMnfX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldEhvdmVyKHsgdHlwZTogJ2xpbmtBJywga2V5OiBsayB9KX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldEhvdmVyKG51bGwpfT5cbiAgICAgICAgICAgICAgICA8dGl0bGU+e2Ake2xrLmNoYW5uZWx9IFx1MjE5MiAke2xrLnN0YWdlfTogJHtsay5jb3VudH1cdUQ2OENgfTwvdGl0bGU+XG4gICAgICAgICAgICAgIDwvcGF0aD5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgICAge3JpYmJvbnNCLm1hcCgobGssIGkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHgxID0gQ09MX1hbMV0gKyBOT0RFX1c7XG4gICAgICAgICAgICBjb25zdCB4MiA9IENPTF9YWzJdO1xuICAgICAgICAgICAgY29uc3QgZmFkZWQgPSBkaW0oJ2xpbmtCJywgbGspO1xuICAgICAgICAgICAgY29uc3Qgc3RhZ2VDb2xvciA9IGxrLnN0YWdlID09PSAnQXdhcmVuZXNzJyA/ICcjZmI5MjNjJ1xuICAgICAgICAgICAgICA6IGxrLnN0YWdlID09PSAnSW50ZXJlc3QnID8gJyMyMmM1NWUnXG4gICAgICAgICAgICAgIDogJyNlZjQ0NDQnO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPHBhdGgga2V5PXtgQiR7aX1gfVxuICAgICAgICAgICAgICAgIGQ9e2N1YmljUGF0aCh4MSwgbGsueTEsIHgyLCBsay55MiwgbGsudCl9XG4gICAgICAgICAgICAgICAgZmlsbD17c3RhZ2VDb2xvcn1cbiAgICAgICAgICAgICAgICBvcGFjaXR5PXtmYWRlZCA/IDAuMDYgOiAwLjI4fVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y3Vyc29yOidwb2ludGVyJywgdHJhbnNpdGlvbjonb3BhY2l0eSAuMTJzJ319XG4gICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRIb3Zlcih7IHR5cGU6ICdsaW5rQicsIGtleTogbGsgfSl9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcihudWxsKX0+XG4gICAgICAgICAgICAgICAgPHRpdGxlPntgJHtsay5zdGFnZX0gXHUyMTkyICR7bGsucm91dGV9OiAke2xrLmNvdW50fVx1RDY4Q2B9PC90aXRsZT5cbiAgICAgICAgICAgICAgPC9wYXRoPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cblxuICAgICAgICAgIHtjaGFubmVsU3Vtcy5tYXAoKG4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBjaFBvcy5nZXQobi5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVkID0gZGltKCdjaGFubmVsJywgbi5uYW1lKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxnIGtleT17YGNoLSR7bi5uYW1lfWB9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRIb3Zlcih7IHR5cGU6ICdjaGFubmVsJywga2V5OiBuLm5hbWUgfSl9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcihudWxsKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcicsIG9wYWNpdHk6IGZhZGVkID8gMC4zNSA6IDEsIHRyYW5zaXRpb246J29wYWNpdHkgLjEycyd9fT5cbiAgICAgICAgICAgICAgICA8cmVjdCB4PXtDT0xfWFswXX0geT17cC55fSB3aWR0aD17Tk9ERV9XfSBoZWlnaHQ9e3AuaH0gZmlsbD17X0NIQU5ORUxfQ09MT1Iobi5uYW1lKX0gcng9ezF9Lz5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXtDT0xfWFswXSAtIDh9IHk9e3AueSArIHAuaCAvIDJ9IHRleHRBbmNob3I9XCJlbmRcIiBkb21pbmFudEJhc2VsaW5lPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplPXsxMn0gZmlsbD1cInZhcigtLWluaylcIiBmb250RmFtaWx5PVwidmFyKC0tZm9udC1zYW5zKVwiPlxuICAgICAgICAgICAgICAgICAge3RydW5jYXRlKG4ubmFtZSwgMTQpfVxuICAgICAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXtDT0xfWFswXSAtIDh9IHk9e3AueSArIHAuaCAvIDIgKyAxNH0gdGV4dEFuY2hvcj1cImVuZFwiIGRvbWluYW50QmFzZWxpbmU9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgZm9udFNpemU9ezEwfSBmaWxsPVwidmFyKC0taW5rLTMpXCIgZm9udEZhbWlseT1cInZhcigtLWZvbnQtbW9ubylcIj5cbiAgICAgICAgICAgICAgICAgIHtuLmNvdW50fVxuICAgICAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGl0bGU+e2Ake24ubmFtZX06ICR7bi5jb3VudH1cdUQ2OENgfTwvdGl0bGU+XG4gICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG5cbiAgICAgICAgICB7c3RhZ2VTdW1zLm1hcCgobikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcCA9IHN0UG9zLmdldChuLm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgZmFkZWQgPSBkaW0oJ3N0YWdlJywgbi5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IHN0Q29sb3IgPSBuLm5hbWUgPT09ICdBd2FyZW5lc3MnID8gJyNmYjkyM2MnIDogbi5uYW1lID09PSAnSW50ZXJlc3QnID8gJyMyMmM1NWUnIDogJyNlZjQ0NDQnO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGcga2V5PXtgc3QtJHtuLm5hbWV9YH1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldEhvdmVyKHsgdHlwZTogJ3N0YWdlJywga2V5OiBuLm5hbWUgfSl9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcihudWxsKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcicsIG9wYWNpdHk6IGZhZGVkID8gMC4zNSA6IDEsIHRyYW5zaXRpb246J29wYWNpdHkgLjEycyd9fT5cbiAgICAgICAgICAgICAgICA8cmVjdCB4PXtDT0xfWFsxXX0geT17cC55fSB3aWR0aD17Tk9ERV9XfSBoZWlnaHQ9e3AuaH0gZmlsbD17c3RDb2xvcn0gcng9ezF9Lz5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXtDT0xfWFsxXSArIE5PREVfVyArIDh9IHk9e3AueSArIHAuaCAvIDJ9IHRleHRBbmNob3I9XCJzdGFydFwiIGRvbWluYW50QmFzZWxpbmU9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgZm9udFNpemU9ezEyfSBmaWxsPVwidmFyKC0taW5rKVwiIGZvbnRGYW1pbHk9XCJ2YXIoLS1mb250LXNhbnMpXCI+XG4gICAgICAgICAgICAgICAgICB7bi5uYW1lfVxuICAgICAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXtDT0xfWFsxXSArIE5PREVfVyArIDh9IHk9e3AueSArIHAuaCAvIDIgKyAxNH0gdGV4dEFuY2hvcj1cInN0YXJ0XCIgZG9taW5hbnRCYXNlbGluZT1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZT17MTB9IGZpbGw9XCJ2YXIoLS1pbmstMylcIiBmb250RmFtaWx5PVwidmFyKC0tZm9udC1tb25vKVwiPlxuICAgICAgICAgICAgICAgICAge24uY291bnR9XG4gICAgICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgICAgICAgIDx0aXRsZT57YCR7bi5uYW1lfTogJHtuLmNvdW50fVx1RDY4Q2B9PC90aXRsZT5cbiAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cblxuICAgICAgICAgIHtyb3V0ZVN1bXMubWFwKChuKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gcnRQb3MuZ2V0KG4ubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBmYWRlZCA9IGRpbSgncm91dGUnLCBuLm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgcnRDb2xvciA9IF9TVEFHRV9GT1JfUk9VVEUobi5uYW1lKSA9PT0gJ0F3YXJlbmVzcycgPyAnI2ZiOTIzYydcbiAgICAgICAgICAgICAgOiBfU1RBR0VfRk9SX1JPVVRFKG4ubmFtZSkgPT09ICdJbnRlcmVzdCcgPyAnIzIyYzU1ZScgOiAnI2VmNDQ0NCc7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8ZyBrZXk9e2BydC0ke24ubmFtZX1gfVxuICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SG92ZXIoeyB0eXBlOiAncm91dGUnLCBrZXk6IG4ubmFtZSB9KX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldEhvdmVyKG51bGwpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y3Vyc29yOidwb2ludGVyJywgb3BhY2l0eTogZmFkZWQgPyAwLjM1IDogMSwgdHJhbnNpdGlvbjonb3BhY2l0eSAuMTJzJ319PlxuICAgICAgICAgICAgICAgIDxyZWN0IHg9e0NPTF9YWzJdfSB5PXtwLnl9IHdpZHRoPXtOT0RFX1d9IGhlaWdodD17cC5ofSBmaWxsPXtydENvbG9yfSByeD17MX0vPlxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9e0NPTF9YWzJdICsgTk9ERV9XICsgOH0geT17cC55ICsgcC5oIC8gMn0gdGV4dEFuY2hvcj1cInN0YXJ0XCIgZG9taW5hbnRCYXNlbGluZT1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZT17MTJ9IGZpbGw9XCJ2YXIoLS1pbmspXCIgZm9udEZhbWlseT1cInZhcigtLWZvbnQtc2FucylcIj5cbiAgICAgICAgICAgICAgICAgIHt0cnVuY2F0ZShuLm5hbWUsIDI4KX1cbiAgICAgICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgICAgICAgPHRleHQgeD17Q09MX1hbMl0gKyBOT0RFX1cgKyA4fSB5PXtwLnkgKyBwLmggLyAyICsgMTR9IHRleHRBbmNob3I9XCJzdGFydFwiIGRvbWluYW50QmFzZWxpbmU9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgZm9udFNpemU9ezEwfSBmaWxsPVwidmFyKC0taW5rLTMpXCIgZm9udEZhbWlseT1cInZhcigtLWZvbnQtbW9ubylcIj5cbiAgICAgICAgICAgICAgICAgIHtuLmNvdW50fVxuICAgICAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGl0bGU+e2Ake24ubmFtZX06ICR7bi5jb3VudH1cdUQ2OENgfTwvdGl0bGU+XG4gICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvc3ZnPlxuICAgICAgICB7aG92ZXIgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDogOCwgcmlnaHQ6IDgsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1pbmspJywgY29sb3I6J3ZhcigtLWJnKScsXG4gICAgICAgICAgICBwYWRkaW5nOic4cHggMTJweCcsIGZvbnRTaXplOjEyLCBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJyxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6JzAuMDRlbScsIGJvcmRlclJhZGl1czozLCB6SW5kZXg6NSxcbiAgICAgICAgICAgIGJveFNoYWRvdzonMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMyknLCBwb2ludGVyRXZlbnRzOidub25lJyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtob3Zlci50eXBlID09PSAnY2hhbm5lbCcgJiYgYFx1Q0M0NFx1QjExMDogJHtob3Zlci5rZXl9IFx1MDBCNyAke2NoUG9zLmdldChob3Zlci5rZXkpPy5jb3VudCB8fCAwfVx1RDY4Q2B9XG4gICAgICAgICAgICB7aG92ZXIudHlwZSA9PT0gJ3N0YWdlJyAmJiBgXHVCMkU4XHVBQ0M0OiAke2hvdmVyLmtleX0gXHUwMEI3ICR7c3RQb3MuZ2V0KGhvdmVyLmtleSk/LmNvdW50IHx8IDB9XHVENjhDYH1cbiAgICAgICAgICAgIHtob3Zlci50eXBlID09PSAncm91dGUnICYmIGBcdUQzOThcdUM3NzRcdUM5QzA6ICR7aG92ZXIua2V5fSBcdTAwQjcgJHtydFBvcy5nZXQoaG92ZXIua2V5KT8uY291bnQgfHwgMH1cdUQ2OENgfVxuICAgICAgICAgICAge2hvdmVyLnR5cGUgPT09ICdsaW5rQScgJiYgYCR7aG92ZXIua2V5LmNoYW5uZWx9IFx1MjE5MiAke2hvdmVyLmtleS5zdGFnZX0gXHUwMEI3ICR7aG92ZXIua2V5LmNvdW50fVx1RDY4Q2B9XG4gICAgICAgICAgICB7aG92ZXIudHlwZSA9PT0gJ2xpbmtCJyAmJiBgJHtob3Zlci5rZXkuc3RhZ2V9IFx1MjE5MiAke2hvdmVyLmtleS5yb3V0ZX0gXHUwMEI3ICR7aG92ZXIua2V5LmNvdW50fVx1RDY4Q2B9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gdjAwLjE2Ni8xNjcvMTc2IFx1MjAxNCBcdUMwQUNcdUM3NzRcdUI0RENcdUJDMTQgXHVENTZEXHVCQUE5IFx1QkEzOFx1QzlDMFx1QzZBOSBzdWItdGFiIFx1Qjc5OFx1RDM3QyArIFx1Qjc3Q1x1Qzc3NFx1QkUwQyBcdUJCRjhcdUI5QUNcdUJDRjRcdUFFMzAgaWZyYW1lLlxuY29uc3QgU3ViVGFic1ZpZXcgPSAoeyBzdWJUYWJzLCBkZWZhdWx0S2V5LCBzdG9yYWdlS2V5IH0pID0+IHtcbiAgY29uc3QgW2FjdGl2ZSwgc2V0QWN0aXZlXSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+IHtcbiAgICBpZiAoc3RvcmFnZUtleSkge1xuICAgICAgdHJ5IHsgY29uc3QgdiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0b3JhZ2VLZXkpOyBpZiAodiAmJiBzdWJUYWJzLnNvbWUoKHQpID0+IHQua2V5ID09PSB2KSkgcmV0dXJuIHY7IH0gY2F0Y2gge31cbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRLZXkgfHwgKHN1YlRhYnNbMF0gJiYgc3ViVGFic1swXS5rZXkpO1xuICB9KTtcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc3RvcmFnZUtleSkgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc3RvcmFnZUtleSwgYWN0aXZlKTsgfSBjYXRjaCB7fVxuICB9LCBbYWN0aXZlLCBzdG9yYWdlS2V5XSk7XG5cbiAgY29uc3QgW3ByZXZpZXdNb2RlLCBzZXRQcmV2aWV3TW9kZV0gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgaWYgKHN0b3JhZ2VLZXkpIHtcbiAgICAgIHRyeSB7IGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzdG9yYWdlS2V5ICsgJ19wbW9kZScpOyBpZiAodiAmJiBbJ2Rlc2t0b3AnLCd0YWJsZXQnLCdtb2JpbGUnXS5pbmNsdWRlcyh2KSkgcmV0dXJuIHY7IH0gY2F0Y2gge31cbiAgICB9XG4gICAgcmV0dXJuICdkZXNrdG9wJztcbiAgfSk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHN0b3JhZ2VLZXkpIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKHN0b3JhZ2VLZXkgKyAnX3Btb2RlJywgcHJldmlld01vZGUpOyB9IGNhdGNoIHt9XG4gIH0sIFtwcmV2aWV3TW9kZSwgc3RvcmFnZUtleV0pO1xuICBjb25zdCBbcmVsb2FkVGljaywgc2V0UmVsb2FkVGlja10gPSBSZWFjdC51c2VTdGF0ZSgwKTtcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBldmVudHMgPSBbXG4gICAgICAnYmduai1zaXRlLWNvbnRlbnQtcmVmcmVzaCcsXG4gICAgICAnYmduai1sZWdhbC1yZWZyZXNoJyxcbiAgICAgICdiZ25qLWZhcXMtcmVmcmVzaCcsXG4gICAgICAnYmduai1iYW5rLWFjY291bnRzLXJlZnJlc2gnLFxuICAgIF07XG4gICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHNldFJlbG9hZFRpY2soKHYpID0+IHYgKyAxKTtcbiAgICBldmVudHMuZm9yRWFjaCgoZSkgPT4gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZSwgaGFuZGxlcikpO1xuICAgIHJldHVybiAoKSA9PiBldmVudHMuZm9yRWFjaCgoZSkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZSwgaGFuZGxlcikpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgQWN0aXZlID0gc3ViVGFicy5maW5kKCh0KSA9PiB0LmtleSA9PT0gYWN0aXZlKTtcbiAgY29uc3QgcHJldmlld1VybCA9IEFjdGl2ZSAmJiBBY3RpdmUucHJldmlld1VybDtcbiAgY29uc3QgVklFV1BPUlRTID0geyBkZXNrdG9wOiAxMTgwLCB0YWJsZXQ6IDc2MCwgbW9iaWxlOiAzODAgfTtcbiAgY29uc3QgcHJldmlld1cgPSBWSUVXUE9SVFNbcHJldmlld01vZGVdIHx8IDExODA7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge3ByZXZpZXdVcmwgJiYgKFxuICAgICAgICA8c2VjdGlvbiBzdHlsZT17e21hcmdpbkJvdHRvbToyNCwgcGFkZGluZ0JvdHRvbToxOCwgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbToxMiwgZmxleFdyYXA6J3dyYXAnLCBnYXA6OH19PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToxNiwgbWFyZ2luOjAsIGZvbnRXZWlnaHQ6NzAwfX0+XG4gICAgICAgICAgICAgIFx1QzJFNFx1QzJEQ1x1QUMwNCBcdUJCRjhcdUI5QUNcdUJDRjRcdUFFMzBcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTEsIG1hcmdpbkxlZnQ6MTAsIGZvbnRXZWlnaHQ6NTAwLCBsZXR0ZXJTcGFjaW5nOicwLjEyZW0nfX0+e3ByZXZpZXdVcmx9PC9zcGFuPlxuICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjZ9fT5cbiAgICAgICAgICAgICAge1tbJ2Rlc2t0b3AnLCdQQyddLFsndGFibGV0JywnXHVEMERDXHVCRTE0XHVCOUJGJ10sWydtb2JpbGUnLCdcdUJBQThcdUJDMTRcdUM3N0MnXV0ubWFwKChbayxsXSkgPT4gKFxuICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtrfSB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0UHJldmlld01vZGUoayl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOic1cHggMTJweCcsIGZvbnRTaXplOjEyLCBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJyxcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogcHJldmlld01vZGUgPT09IGsgPyA4MDAgOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6JzAuMDRlbScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjonMXB4IHNvbGlkICcgKyAocHJldmlld01vZGUgPT09IGsgPyAndmFyKC0tcHJpbWFyeSknIDogJ3ZhcigtLWxpbmUtMiknKSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogcHJldmlld01vZGUgPT09IGsgPyAncmdiYSgyNDUsMjEzLDcyLDAuMTIpJyA6ICd2YXIoLS1iZyknLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogcHJldmlld01vZGUgPT09IGsgPyAndmFyKC0taW5rKScgOiAndmFyKC0taW5rLTIpJyxcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgIH19PntsfTwvYnV0dG9uPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0UmVsb2FkVGljaygodikgPT4gdiArIDEpfSBhcmlhLWxhYmVsPVwiXHVCQkY4XHVCOUFDXHVCQ0Y0XHVBRTMwIFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2OFwiXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJcdUJCRjhcdUI5QUNcdUJDRjRcdUFFMzAgXHVDMEM4XHVCODVDXHVBQ0UwXHVDRTY4XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcGFkZGluZzonNXB4IDEycHgnLCBmb250U2l6ZToxNCwgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYmFja2dyb3VuZDondmFyKC0tYmcpJyxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOid2YXIoLS1pbmstMiknLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgICAgIH19Plx1MjFCQjwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4xMmVtJywgbWFyZ2luQm90dG9tOjEwfX0+XG4gICAgICAgICAgICB7cHJldmlld01vZGUudG9VcHBlckNhc2UoKX0gXHUwMEI3IHtwcmV2aWV3V31weFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHsvKiB2MDAuMTkxIFx1MjAxNCBcdUMwQUNcdUM2QTlcdUM3OTAgXHVCQ0Y0XHVBQ0UwICdQQyBcdUJCRjhcdUI5QUNcdUJDRjRcdUFFMzAgXHVBQzAwXHVCODVDIFx1Q0Q1Q1x1QjMwMCBcdUJFNDRcdUM3MjhcdUI4NUMnLiBkZXNrdG9wIFx1QkFBOFx1QjREQ1x1QjI5NCBcdUNFRThcdUQxNENcdUM3NzRcdUIxMDggMTAwJSBcdUQzRUQgKFx1QkFBOFx1QkMxNFx1Qzc3Qy9cdUQwRENcdUJFMTRcdUI5QkZcdUM3NDAgdmlld3BvcnQgXHVEM0VEIFx1QUNFMFx1QzgxNSkuICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tvdmVyZmxvdzonYXV0bycsIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgbWF4SGVpZ2h0Oic3MHZoJ319PlxuICAgICAgICAgICAgPGlmcmFtZSBrZXk9e3JlbG9hZFRpY2t9IHNyYz17cHJldmlld1VybH1cbiAgICAgICAgICAgICAgdGl0bGU9e2BcdUJCRjhcdUI5QUNcdUJDRjRcdUFFMzAgXHUyMDE0ICR7QWN0aXZlLmxhYmVsfWB9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHByZXZpZXdNb2RlID09PSAnZGVza3RvcCcgPyAnMTAwJScgOiAocHJldmlld1cgKyAncHgnKSxcbiAgICAgICAgICAgICAgICBtaW5XaWR0aDogcHJldmlld01vZGUgPT09ICdkZXNrdG9wJyA/ICcxMDAlJyA6IChwcmV2aWV3VyArICdweCcpLFxuICAgICAgICAgICAgICAgIGhlaWdodDogcHJldmlld01vZGUgPT09ICdkZXNrdG9wJyA/ICc3MHZoJyA6ICc2MDBweCcsXG4gICAgICAgICAgICAgICAgYm9yZGVyOicwJywgZGlzcGxheTonYmxvY2snLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsXG4gICAgICAgICAgICAgIH19Lz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjExLCBtYXJnaW5Ub3A6OCwgbGluZUhlaWdodDoxLjZ9fT5cbiAgICAgICAgICAgIFx1QzU0NFx1Qjc5OCBcdUMxMUNcdUJFMEMgXHVEMEVEXHVDNUQwXHVDMTFDIFx1RDNCOFx1QzlEMSBcdUQ2QzQgW1x1RDgzRFx1RENCRSBcdUM4MDBcdUM3QTVdIFx1RDA3NFx1QjlBRCBcdUMyREMgXHVDNzkwXHVCM0Q5IFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2OC4gXHVDOTg5XHVDMkRDIFx1RDY1NVx1Qzc3OFx1Qzc0MCA8c3BhbiBjbGFzc05hbWU9XCJtb25vXCI+XHUyMUJCPC9zcGFuPiBcdUQwNzRcdUI5QUQuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICApfVxuICAgICAgPGRpdiByb2xlPVwidGFibGlzdFwiIHN0eWxlPXt7XG4gICAgICAgIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgbWFyZ2luQm90dG9tOjI0LFxuICAgICAgICBkaXNwbGF5OidmbGV4JywgZ2FwOjAsIGZsZXhXcmFwOid3cmFwJyxcbiAgICAgIH19PlxuICAgICAgICB7c3ViVGFicy5tYXAoKHQpID0+IChcbiAgICAgICAgICA8YnV0dG9uIGtleT17dC5rZXl9IHR5cGU9XCJidXR0b25cIiByb2xlPVwidGFiXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZSh0LmtleSl9XG4gICAgICAgICAgICBhcmlhLXNlbGVjdGVkPXthY3RpdmUgPT09IHQua2V5fVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcGFkZGluZzonMTBweCAxOHB4JyxcbiAgICAgICAgICAgICAgZm9udFNpemU6MTQsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGFjdGl2ZSA9PT0gdC5rZXkgPyA3MDAgOiA1MDAsXG4gICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmUgPT09IHQua2V5ID8gJ3ZhcigtLXNlY29uZGFyeSknIDogJ3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6J3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOidub25lJywgYm9yZGVyUmlnaHQ6J25vbmUnLCBib3JkZXJMZWZ0Oidub25lJyxcbiAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBhY3RpdmUgPT09IHQua2V5ID8gJzJweCBzb2xpZCB2YXIoLS1wcmltYXJ5KScgOiAnMnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzonMC4wMWVtJyxcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjonY29sb3IgLjE1cywgYm9yZGVyLWNvbG9yIC4xNXMnLFxuICAgICAgICAgICAgfX0+e3QubGFiZWx9PC9idXR0b24+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgICB7QWN0aXZlICYmIEFjdGl2ZS5yZW5kZXIoKX1cbiAgICA8Lz5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gdjAwLjE5NCBcdTIwMTQgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QzY5NFx1Q0NBRCAnXHVCMzAwXHVDMkRDXHVCQ0Y0XHVCNERDXHVDNUQwIFx1QzgxMVx1QzE4RCBcdUMyRENcdUFDMDRcdUM1RDAgXHVCNTMwXHVCOTc4IFx1RDc4OFx1RDJCOFx1QjlGNScuXG4vLyAyNGggXHUwMEQ3IDdcdUM2OTRcdUM3N0MgXHVBREY4XHVCOUFDXHVCNERDLiBcdUFDMDEgXHVDMTQwXHVDNzQwIG1heCBcdUIzMDBcdUJFNDQgYWxwaGEgXHVBREY4XHVCNzdDXHVCMzcwXHVDNzc0XHVDMTU4ICsgaG92ZXIgdG9vbHRpcC5cbi8vIGRhdGE6IFt7IGRvdzogMH42ICgwPVx1Qzc3QyksIGhvdXI6IDB+MjMsIHZpZXdzLCB1bmlxIH1dXG5jb25zdCBfRE9XX0xBQkVMUyA9IFsnXHVDNzdDJywgJ1x1QzZENCcsICdcdUQ2NTQnLCAnXHVDMjE4JywgJ1x1QkFBOScsICdcdUFFMDgnLCAnXHVEMUEwJ107XG5jb25zdCBIZWF0bWFwR3JpZCA9ICh7IGRhdGEsIGxhYmVsLCBoZWFkZXJSaWdodCwgZGF5cyA9IDMwIH0pID0+IHtcbiAgY29uc3QgW2hvdmVyLCBzZXRIb3Zlcl0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTsgLy8ge2RvdywgaG91ciwgdmlld3MsIHVuaXEsIHgsIHl9XG4gIC8vIDdcdTAwRDcyNCBncmlkIFx1QUQ2Q1x1Q0Q5NS5cbiAgY29uc3QgZ3JpZCA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGcgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiA3IH0sICgpID0+IEFycmF5LmZyb20oeyBsZW5ndGg6IDI0IH0sICgpID0+ICh7IHZpZXdzOiAwLCB1bmlxOiAwIH0pKSk7XG4gICAgKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogW10pLmZvckVhY2goKGQpID0+IHtcbiAgICAgIGNvbnN0IGRvdyA9IE51bWJlcihkLmRvdyk7IGNvbnN0IGggPSBOdW1iZXIoZC5ob3VyKTtcbiAgICAgIGlmIChkb3cgPj0gMCAmJiBkb3cgPCA3ICYmIGggPj0gMCAmJiBoIDwgMjQpIHtcbiAgICAgICAgZ1tkb3ddW2hdID0geyB2aWV3czogTnVtYmVyKGQudmlld3MpIHx8IDAsIHVuaXE6IE51bWJlcihkLnVuaXEpIHx8IDAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZztcbiAgfSwgW2RhdGFdKTtcbiAgY29uc3QgbWF4ID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgbGV0IG0gPSAwO1xuICAgIGdyaWQuZm9yRWFjaCgocm93KSA9PiByb3cuZm9yRWFjaCgoYykgPT4geyBpZiAoYy52aWV3cyA+IG0pIG0gPSBjLnZpZXdzOyB9KSk7XG4gICAgcmV0dXJuIG07XG4gIH0sIFtncmlkXSk7XG5cbiAgY29uc3QgY2VsbENvbG9yID0gKHYpID0+IHtcbiAgICBpZiAobWF4IDw9IDAgfHwgdiA8PSAwKSByZXR1cm4gJ3JnYmEoMjU1LDI1NSwyNTUsMC4wMiknO1xuICAgIGNvbnN0IGFscGhhID0gTWF0aC5tYXgoMC4wOCwgTWF0aC5taW4oMC45NSwgdiAvIG1heCkpO1xuICAgIHJldHVybiBgcmdiYSgyNDUsMjEzLDcyLCR7YWxwaGEudG9GaXhlZCgzKX0pYDtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxhcnRpY2xlIGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17eyBwb3NpdGlvbjoncmVsYXRpdmUnIH19PlxuICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbToxNCwgZ2FwOjgsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW46MCwgZm9udFdlaWdodDo3MDB9fT5cbiAgICAgICAgICB7bGFiZWwgfHwgYFx1RDgzRFx1REREMyBcdUM4MTFcdUMxOEQgXHVDMkRDXHVBQzA0IFx1RDc4OFx1RDJCOFx1QjlGNSAoXHVDRDVDXHVBREZDICR7ZGF5c31cdUM3N0MgXHUwMEI3IEtTVClgfVxuICAgICAgICA8L2gzPlxuICAgICAgICB7aGVhZGVyUmlnaHR9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3tvdmVyZmxvd1g6J2F1dG8nfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OidncmlkJyxcbiAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOidhdXRvIHJlcGVhdCgyNCwgbWlubWF4KDE4cHgsIDFmcikpJyxcbiAgICAgICAgICBncmlkQXV0b1Jvd3M6JzE4cHgnLFxuICAgICAgICAgIGdhcDoyLFxuICAgICAgICAgIG1pbldpZHRoOjU2MCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgey8qIFx1RDVFNFx1QjM1NCBcdUQ1ODkgXHUyMDE0IFx1QzJEQ1x1QUMwNCBcdUI3N0NcdUJDQTggKi99XG4gICAgICAgICAgPGRpdi8+XG4gICAgICAgICAge0FycmF5LmZyb20oeyBsZW5ndGg6IDI0IH0sIChfLCBoKSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17YGgtJHtofWB9IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIlxuICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRTaXplOjksIHRleHRBbGlnbjonY2VudGVyJywgbGV0dGVyU3BhY2luZzonMC4wNGVtJywgbGluZUhlaWdodDonMThweCd9fT5cbiAgICAgICAgICAgICAge2ggJSAzID09PSAwID8gYCR7aH1gIDogJyd9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgICB7LyogN1x1RDU4OSBcdTAwRDcgMjRcdUM1RjQgKi99XG4gICAgICAgICAge2dyaWQubWFwKChyb3csIGRvdykgPT4gKFxuICAgICAgICAgICAgPFJlYWN0LkZyYWdtZW50IGtleT17YHItJHtkb3d9YH0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGxpbmVIZWlnaHQ6JzE4cHgnLCBwYWRkaW5nUmlnaHQ6NiwgdGV4dEFsaWduOidyaWdodCd9fT5cbiAgICAgICAgICAgICAgICB7X0RPV19MQUJFTFNbZG93XX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIHtyb3cubWFwKChjZWxsLCBob3VyKSA9PiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e2BjLSR7ZG93fS0ke2hvdXJ9YH1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgciA9IGUuY3VycmVudFRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0SG92ZXIoeyBkb3csIGhvdXIsIHZpZXdzOiBjZWxsLnZpZXdzLCB1bmlxOiBjZWxsLnVuaXEsIHg6IHIubGVmdCArIHIud2lkdGggLyAyLCB5OiByLnRvcCB9KTtcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldEhvdmVyKG51bGwpfVxuICAgICAgICAgICAgICAgICAgcm9sZT1cImltZ1wiXG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgJHtfRE9XX0xBQkVMU1tkb3ddfVx1QzY5NFx1Qzc3QyAke2hvdXJ9XHVDMkRDOiBcdUQzOThcdUM3NzRcdUM5QzBcdUJERjAgJHtjZWxsLnZpZXdzfVx1RDY4QywgXHVDMTM4XHVDMTU4ICR7Y2VsbC51bmlxfVx1QUM3NGB9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBjZWxsQ29sb3IoY2VsbC52aWV3cyksXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBjZWxsLnZpZXdzID4gMCA/ICdwb2ludGVyJyA6ICdkZWZhdWx0JyxcbiAgICAgICAgICAgICAgICAgIH19Lz5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgey8qIFx1QkM5NFx1Qjg0MCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJywgZ2FwOjEwLCBtYXJnaW5Ub3A6MTIsIGZvbnRTaXplOjEwfX0gY2xhc3NOYW1lPVwiZGltLTIgbW9ub1wiPlxuICAgICAgICA8c3Bhbj5cdUM4MDFcdUM3NEM8L3NwYW4+XG4gICAgICAgIHtbMC4xLCAwLjI1LCAwLjUsIDAuNzUsIDFdLm1hcCgoYSkgPT4gKFxuICAgICAgICAgIDxzcGFuIGtleT17YX0gc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6J2lubGluZS1ibG9jaycsIHdpZHRoOjE0LCBoZWlnaHQ6MTQsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOmByZ2JhKDI0NSwyMTMsNzIsJHthfSlgLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgfX0vPlxuICAgICAgICApKX1cbiAgICAgICAgPHNwYW4+XHVCOUNFXHVDNzRDPC9zcGFuPlxuICAgICAgICA8c3BhbiBzdHlsZT17e2ZsZXg6MX19Lz5cbiAgICAgICAgPHNwYW4+XHVDRDVDXHVCMzAwIHttYXh9IHZpZXdzL2NlbGw8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIHsvKiB0b29sdGlwICovfVxuICAgICAge2hvdmVyICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOidmaXhlZCcsIGxlZnQ6IGhvdmVyLngsIHRvcDogaG92ZXIueSAtIDgsXG4gICAgICAgICAgdHJhbnNmb3JtOid0cmFuc2xhdGUoLTUwJSwgLTEwMCUpJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yLCAjMWExYTFhKScsIGNvbG9yOid2YXIoLS1pbmspJyxcbiAgICAgICAgICBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgcGFkZGluZzonNnB4IDEwcHgnLFxuICAgICAgICAgIGZvbnRTaXplOjExLCBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJyxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOidub25lJywgekluZGV4OjEwMDAsIHdoaXRlU3BhY2U6J25vd3JhcCcsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtfRE9XX0xBQkVMU1tob3Zlci5kb3ddfSB7U3RyaW5nKGhvdmVyLmhvdXIpLnBhZFN0YXJ0KDIsJzAnKX06MDAgXHUwMEI3IHtob3Zlci52aWV3c30gdmlld3MgXHUwMEI3IHtob3Zlci51bmlxfSBzZXNzaW9uc1xuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9hcnRpY2xlPlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBcdUIxNzhcdUNEOUMgXHUyMDE0IEF1dGhBZG1pblBhZ2UgXHVBQzAwIGNvbnN0IFggPSB3aW5kb3cuWCBcdUI4NUMgXHVDQzM4XHVDODcwLlxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHtcbiAgZG93bmxvYWRCbG9iLCBkb3dubG9hZENzdiwgZG93bmxvYWRKc29uLFxuICBwaWNrSW1hZ2VXaXRoUjJGYWxsYmFjayxcbiAgTWluaUJhckNoYXJ0LCBSYW5rZWRCYXJMaXN0LCBDT0hPUlRfT1BUSU9OUywgQ29ob3J0U2VsZWN0b3IsXG4gIFNhbmtleUZsb3csIFN1YlRhYnNWaWV3LFxuICBIZWF0bWFwR3JpZCxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBa0JBLE1BQU0sZUFBZSxDQUFDLFVBQVUsU0FBUyxPQUFPLCtCQUErQjtBQUM3RSxNQUFJO0FBQ0YsVUFBTSxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQy9DLFVBQU0sTUFBTSxJQUFJLGdCQUFnQixJQUFJO0FBQ3BDLFVBQU0sSUFBSSxTQUFTLGNBQWMsR0FBRztBQUNwQyxNQUFFLE9BQU87QUFDVCxNQUFFLFdBQVc7QUFDYixhQUFTLEtBQUssWUFBWSxDQUFDO0FBQzNCLE1BQUUsTUFBTTtBQUNSLGFBQVMsS0FBSyxZQUFZLENBQUM7QUFDM0IsUUFBSSxnQkFBZ0IsR0FBRztBQUFBLEVBQ3pCLFNBQVMsS0FBSztBQUNaLFVBQU0sOENBQWUsMkJBQUssWUFBVywwQ0FBWTtBQUFBLEVBQ25EO0FBQ0Y7QUFDQSxNQUFNLGNBQWMsQ0FBQyxVQUFVLFFBQVEsYUFBYSxVQUFVLEtBQUssd0JBQXdCO0FBQzNGLE1BQU0sZUFBZSxDQUFDLFVBQVUsUUFBUSxhQUFhLFVBQVUsS0FBSyxVQUFVLEtBQUssTUFBTSxDQUFDLEdBQUcsa0JBQWtCO0FBSy9HLE1BQU0sMEJBQTBCLE9BQU8sR0FB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

})();

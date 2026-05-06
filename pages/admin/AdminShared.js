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
  } }, fmt(series[hoverIdx], (labels == null ? void 0 : labels[hoverIdx]) || ""))), labels && (() => {
    const rotated = labels.length > 14;
    return /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: `repeat(${labels.length}, 1fr)`,
      fontSize: 9,
      color: "var(--ink-3)",
      marginTop: rotated ? 10 : 6,
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.04em",
      minHeight: rotated ? 36 : "auto",
      overflow: "visible"
    } }, labels.map((l, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: {
      textAlign: rotated ? "right" : "center",
      ...rotated ? {
        transform: "rotate(-45deg)",
        transformOrigin: "top right",
        whiteSpace: "nowrap",
        paddingRight: 8
      } : {}
    } }, l)));
  })());
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvYWRtaW4vQWRtaW5TaGFyZWQuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyA9PT0gcGFnZXMvYWRtaW4vQWRtaW5TaGFyZWQuanN4ICh2MDAuMTg3KSA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQXV0aEFkbWluUGFnZS5qc3ggOTA1NyBcdUM5MDQgXHVCRDg0XHVENTYwXHVDNzU4IFx1Qzc3Q1x1RDY1OC4gc2VsZi1jb250YWluZWQgVUkgcHJpbWl0aXZlcyArIGhlbHBlcnMgXHVCQUE4XHVDNzRDLlxuLy8gXHVCRDg0XHVENTYwIFx1QzZEMFx1Q0U1OTogUmVhY3QgXHVDNjc4XHVCRDgwIFx1Qzc1OFx1Qzg3NCBcdUM1QzZcdUIyOTQgXHVDRUY0XHVEM0VDXHVCMTBDXHVEMkI4L1x1QzIxQ1x1QzIxOCBcdUQ1NjhcdUMyMThcdUI5Q0MuIFx1RDMyOFx1QjExMCBcdUJFNDRcdUM5ODhcdUIyQzhcdUMyQTQgXHVCODVDXHVDOUMxXHVDNzQwIEF1dGhBZG1pblBhZ2UuanN4IFx1QzcyMFx1QzlDMC5cbi8vXG4vLyBcdUJEODRcdUI3QzkgKFx1Qzc3NFx1QzgwNCBBdXRoQWRtaW5QYWdlLmpzeCBcdUI3N0NcdUM3NzgpOiBcdUM1N0QgOTAwIGxpbmVzLlxuLy8gXHVEM0VDXHVENTY4OlxuLy8gICAxKSBcdUQzMENcdUM3N0MgXHVCMkU0XHVDNkI0XHVCODVDXHVCNERDIGhlbHBlcnMgXHUyMDE0IGRvd25sb2FkQmxvYiAvIGRvd25sb2FkQ3N2IC8gZG93bmxvYWRKc29uXG4vLyAgIDIpIFx1Qzc3NFx1QkJGOFx1QzlDMCBcdUM1QzVcdUI4NUNcdUI0REMgaGVscGVyIFx1MjAxNCBwaWNrSW1hZ2VXaXRoUjJGYWxsYmFja1xuLy8gICAzKSBcdUNDMjhcdUQyQjggXHUyMDE0IE1pbmlCYXJDaGFydCAvIFJhbmtlZEJhckxpc3QgLyBDT0hPUlRfT1BUSU9OUyAvIENvaG9ydFNlbGVjdG9yXG4vLyAgIDQpIFNhbmtleSBcdUQ3NTBcdUI5ODRcdUIzQzQgXHUyMDE0IF9DSEFOTkVMX0ZPUl9IT1NUIC8gX1NUQUdFX0ZPUl9ST1VURSAvIF9DSEFOTkVMX0NPTE9SUyAvIF9DSEFOTkVMX0NPTE9SIC8gU2Fua2V5Rmxvd1xuLy8gICA1KSBzdWItdGFiICsgcHJldmlldyBcdUI3OThcdUQzN0MgXHUyMDE0IFN1YlRhYnNWaWV3XG4vL1xuLy8gXHVCMTc4XHVDRDlDOiBcdUQzMENcdUM3N0MgXHVCMDVEIE9iamVjdC5hc3NpZ24od2luZG93LCB7Li4ufSkuIEF1dGhBZG1pblBhZ2UgXHVBQzAwIGNvbnN0IFggPSB3aW5kb3cuWCBcdUI4NUMgXHVDQzM4XHVDODcwLlxuLy8gXHVCODVDXHVCNERDIFx1QzIxQ1x1QzExQzogaW5kZXguaHRtbCBcdUM1RDBcdUMxMUMgQXV0aEFkbWluUGFnZS5qcyBcdUJDRjRcdUIyRTQgXHVCQTNDXHVDODAwIChkZWZlciArIFx1QzIxQ1x1QzExQyBcdUJDRjRcdUM3QTUpLlxuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIHYwMC4xODIgXHUyMDE0IERSWTogXHVEMzBDXHVDNzdDIFx1QjJFNFx1QzZCNFx1Qjg1Q1x1QjREQyBcdUFDRjVcdUQxQjUgaGVscGVyLiBDU1YgLyBKU09OIC8gXHVDNzg0XHVDNzU4IFx1RDE0RFx1QzJBNFx1RDJCOCBcdUJBQThcdUI0NTAgXHVDOUMwXHVDNkQwLlxuLy8gXHVDNzc0XHVDODA0XHVDNUQ0IGFkbWluIFx1RDMyOFx1QjExMCA2XHVBQ0YzXHVDNUQwXHVDMTFDIFx1QUMxOVx1Qzc0MCA4LWxpbmUgXHVEMzI4XHVEMTM0IChCbG9iIFx1MjE5MiBVUkwgXHUyMTkyIGEuY2xpY2sgXHUyMTkyIHJldm9rZSkgXHVCQzE4XHVCQ0Y1LlxuY29uc3QgZG93bmxvYWRCbG9iID0gKGZpbGVuYW1lLCBjb250ZW50LCBtaW1lID0gJ3RleHQvcGxhaW47Y2hhcnNldD11dGYtOCcpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2NvbnRlbnRdLCB7IHR5cGU6IG1pbWUgfSk7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDtcbiAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICBhLmNsaWNrKCk7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcbiAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGFsZXJ0KCdcdUIyRTRcdUM2QjRcdUI4NUNcdUI0REMgXHVDMkU0XHVEMzI4OiAnICsgKGVycj8ubWVzc2FnZSB8fCAnXHVDNTRDIFx1QzIxOCBcdUM1QzZcdUIyOTQgXHVDNjI0XHVCOTU4JykpO1xuICB9XG59O1xuY29uc3QgZG93bmxvYWRDc3YgPSAoZmlsZW5hbWUsIGNzdikgPT4gZG93bmxvYWRCbG9iKGZpbGVuYW1lLCBjc3YsICd0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04Jyk7XG5jb25zdCBkb3dubG9hZEpzb24gPSAoZmlsZW5hbWUsIG9iaikgPT4gZG93bmxvYWRCbG9iKGZpbGVuYW1lLCBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIHYwMC4xODQgXHUyMDE0IERSWTogXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzVDNVx1Qjg1Q1x1QjREQyBcdUFDRjVcdUQxQjUgaGVscGVyLlxuLy8gUjIgXHVDNUM1XHVCODVDXHVCNERDIFx1QzJEQ1x1QjNDNCBcdTIxOTIgXHVDMkU0XHVEMzI4IFx1QzJEQyBGaWxlUmVhZGVyIGRhdGFVUkkgXHVEM0Y0XHVCQzMxLiBsZWN0dXJlLWNvdmVycyAvIHRvdXItY292ZXJzIC8gYm9vay1jb3ZlcnMgLyBcdUI0RjEgNCsgXHVEMzI4XHVCMTEwIFx1QjNEOVx1Qzc3QyBcdUI4NUNcdUM5QzEuXG5jb25zdCBwaWNrSW1hZ2VXaXRoUjJGYWxsYmFjayA9IGFzeW5jIChlLCB7IGZvbGRlciwgbWF4Qnl0ZXMgPSA1ICogMTAyNCAqIDEwMjQsIGZhbGxiYWNrTWF4Qnl0ZXMgPSAxLjUgKiAxMDI0ICogMTAyNCB9ID0ge30pID0+IHtcbiAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzPy5bMF07XG4gIGlmICghZmlsZSkgcmV0dXJuIG51bGw7XG4gIHRyeSB7XG4gICAgY29uc3QgeyB1cmwgfSA9IGF3YWl0IHdpbmRvdy5CR05KX01FRElBLnVwbG9hZEZpbGUoZmlsZSwgeyBmb2xkZXIsIG1heEJ5dGVzIH0pO1xuICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgcmV0dXJuIHVybDtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdHJ5IHsgY29uc29sZS53YXJuKGBbdXBsb2FkXSBSMiAke2ZvbGRlcn0gXHVDNUM1XHVCODVDXHVCNERDIFx1QzJFNFx1RDMyOCBcdTIwMTQgZGF0YVVSSSBcdUQzRjRcdUJDMzE6YCwgZXJyKTsgfSBjYXRjaCB7fVxuICB9XG4gIGlmIChmaWxlLnNpemUgPiBmYWxsYmFja01heEJ5dGVzKSB7XG4gICAgYWxlcnQoYFx1Qzc3NFx1QkJGOFx1QzlDMFx1QUMwMCBcdUIxMDhcdUJCMzQgXHVEMDdEXHVCMkM4XHVCMkU0KCR7KGZpbGUuc2l6ZS8xMDI0LzEwMjQpLnRvRml4ZWQoMSl9TUIpLiBSMiBcdUMyRTRcdUQzMjggKyAkeyhmYWxsYmFja01heEJ5dGVzLzEwMjQvMTAyNCkudG9GaXhlZCgxKX1NQiBcdUQzRjRcdUJDMzEgXHVENTVDXHVCM0M0IFx1Q0QwOFx1QUNGQy5gKTtcbiAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YVVyaSA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIub25sb2FkID0gKCkgPT4gcmVzb2x2ZShTdHJpbmcocmVhZGVyLnJlc3VsdCB8fCAnJykpO1xuICAgICAgcmVhZGVyLm9uZXJyb3IgPSByZWplY3Q7XG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICB9KTtcbiAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xuICAgIHJldHVybiBkYXRhVXJpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBhbGVydCgnXHVDNzc0XHVCQkY4XHVDOUMwIFx1Qzc3RFx1QUUzMCBcdUMyRTRcdUQzMjg6ICcgKyAoZXJyPy5tZXNzYWdlIHx8ICcnKSk7XG4gICAgZS50YXJnZXQudmFsdWUgPSAnJztcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyB2MDAuMTczIFx1MjAxNCBcdUMwQUNcdUM2QTlcdUM3OTAgXHVCQ0Y0XHVBQ0UwICdcdUJBQThcdUI0RTAgXHVDQzI4XHVEMkI4XHVCNEU0XHVDNzQwIFx1RDYzOFx1QkM4NFx1RDU1OFx1QkE3NCBcdUNDMjhcdUQyQjggXHVCMEI0XHVDNkE5XHVCQjNDXHVDNzQ0IFx1QkNGQyBcdUMyMTggXHVDNzg4XHVBQzhDJy5cbi8vIFx1QUMwMSBcdUI5QzlcdUIzMDBcdUM1RDAgbW91c2VlbnRlci9sZWF2ZSBcdUI4NUMgaG92ZXJlZElkeCBcdUNEOTRcdUM4MDEgXHUyMTkyIFx1QkQ4MFx1QjNEOSBcdUQyMzRcdUQzMDEgXHVCMTc4XHVDRDlDLiB1bml0L2Zvcm1hdHRlciBwcm9wIFx1QzczQ1x1Qjg1QyBcdUI3N0NcdUJDQTggXHVDRUU0XHVDMkE0XHVEMTMwXHVCOUM4XHVDNzc0XHVDOTg4LlxuY29uc3QgTWluaUJhckNoYXJ0ID0gKHsgc2VyaWVzLCBsYWJlbHMsIGhlaWdodCA9IDEyMCwgY29sb3IgPSAndmFyKC0tZ29sZCknLCBsYWJlbCwgdW5pdCA9ICcnLCBmb3JtYXRUb29sdGlwLCBoZWFkZXJSaWdodCB9KSA9PiB7XG4gIGNvbnN0IFtob3ZlcklkeCwgc2V0SG92ZXJJZHhdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IG1heCA9IE1hdGgubWF4KDEsIC4uLnNlcmllcyk7XG4gIGNvbnN0IFcgPSAxMDA7IC8vIHZpZXdCb3ggXHVCMkU4XHVDNzA0XG4gIGNvbnN0IEggPSA0MDtcbiAgY29uc3QgYmFyVyA9IFcgLyBNYXRoLm1heCgxLCBzZXJpZXMubGVuZ3RoKTtcbiAgY29uc3QgZm10ID0gZm9ybWF0VG9vbHRpcCB8fCAoKHYsIGwpID0+IGAke2wgPyBsICsgJyBcdTAwQjcgJyA6ICcnfSR7dn0ke3VuaXR9YCk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e3BhZGRpbmc6JzEycHggMCcsIHBvc2l0aW9uOidyZWxhdGl2ZSd9fT5cbiAgICAgIHsobGFiZWwgfHwgaGVhZGVyUmlnaHQpICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbTo4LCBmbGV4V3JhcDond3JhcCcsIGdhcDo4fX0+XG4gICAgICAgICAge2xhYmVsICYmIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMThlbSd9fT57bGFiZWx9PC9kaXY+fVxuICAgICAgICAgIHtoZWFkZXJSaWdodCAmJiA8ZGl2PntoZWFkZXJSaWdodH08L2Rpdj59XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke1d9ICR7SH1gfSBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiIHN0eWxlPXt7d2lkdGg6JzEwMCUnLCBoZWlnaHQsIGRpc3BsYXk6J2Jsb2NrJ319PlxuICAgICAgICAgIHtzZXJpZXMubWFwKCh2LCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoID0gbWF4ID4gMCA/ICh2IC8gbWF4KSAqIChIIC0gNikgOiAwO1xuICAgICAgICAgICAgY29uc3QgaXNPdGhlciA9IGhvdmVySWR4ICE9PSBudWxsICYmIGhvdmVySWR4ICE9PSBpO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGcga2V5PXtpfVxuICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SG92ZXJJZHgoaSl9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcklkeCgoYykgPT4gYyA9PT0gaSA/IG51bGwgOiBjKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcid9fT5cbiAgICAgICAgICAgICAgICA8cmVjdCB4PXtpICogYmFyVyArIDAuNn0geT17SCAtIGh9XG4gICAgICAgICAgICAgICAgICB3aWR0aD17TWF0aC5tYXgoMC40LCBiYXJXIC0gMS4yKX0gaGVpZ2h0PXtofVxuICAgICAgICAgICAgICAgICAgZmlsbD17Y29sb3J9IHJ4PXswLjN9XG4gICAgICAgICAgICAgICAgICBvcGFjaXR5PXtpc090aGVyID8gMC40IDogMX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dHJhbnNpdGlvbjonb3BhY2l0eSAuMTJzJ319Lz5cbiAgICAgICAgICAgICAgICA8cmVjdCB4PXtpICogYmFyV30geT17MH0gd2lkdGg9e2Jhcld9IGhlaWdodD17SH0gZmlsbD1cInRyYW5zcGFyZW50XCIvPlxuICAgICAgICAgICAgICAgIDx0aXRsZT57Zm10KHYsIGxhYmVscz8uW2ldIHx8ICcnKX08L3RpdGxlPlxuICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L3N2Zz5cbiAgICAgICAge2hvdmVySWR4ICE9PSBudWxsICYmIHNlcmllc1tob3ZlcklkeF0gIT09IHVuZGVmaW5lZCAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogLTI4LFxuICAgICAgICAgICAgbGVmdDogYCR7KChob3ZlcklkeCArIDAuNSkgLyBNYXRoLm1heCgxLCBzZXJpZXMubGVuZ3RoKSkgKiAxMDB9JWAsXG4gICAgICAgICAgICB0cmFuc2Zvcm06J3RyYW5zbGF0ZVgoLTUwJSknLFxuICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0taW5rKScsIGNvbG9yOid2YXIoLS1iZyknLFxuICAgICAgICAgICAgcGFkZGluZzonNXB4IDEwcHgnLCBmb250U2l6ZToxMSxcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzonMC4wNGVtJyxcbiAgICAgICAgICAgIHdoaXRlU3BhY2U6J25vd3JhcCcsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOidub25lJyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czozLFxuICAgICAgICAgICAgYm94U2hhZG93OicwIDJweCA4cHggcmdiYSgwLDAsMCwwLjI1KScsXG4gICAgICAgICAgICB6SW5kZXg6NSxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtmbXQoc2VyaWVzW2hvdmVySWR4XSwgbGFiZWxzPy5baG92ZXJJZHhdIHx8ICcnKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAge2xhYmVscyAmJiAoKCkgPT4ge1xuICAgICAgICAvLyB2MDAuMTk1IFx1MjAxNCBcdUMwQUNcdUM2QTlcdUM3OTAgXHVCQ0Y0XHVBQ0UwICdcdUM3ODRcdUM3NThcdUI4NUMgXHVDOTExXHVBQzA0XHVDNUQwIFx1QUMxMlx1QjRFNCBcdUNEOTVcdUM1N0RcdUQ1NThcdUM5QzBcdUI5QzgnLiBcdUJBQThcdUI0RTAgXHVCNzdDXHVCQ0E4IFx1RDQ1Q1x1QzJEQyBcdUM3NThcdUJCMzRcdUQ2NTQuXG4gICAgICAgIC8vIDE0XHVBQzFDIFx1Qzc3NFx1RDU1OFx1QkE3NCBcdUFDMDBcdUI4NUMgXHVBREY4XHVCMzAwXHVCODVDLCBcdUFERjggXHVDNzc0XHVDMEMxXHVDNzc0XHVCQTc0IC00NVx1MDBCMCBcdUQ2OENcdUM4MDQgKFx1Qjc3Q1x1QkNBOCBcdUIwN0NcdUI5QUMgXHVDNTQ4IFx1QUNCOVx1Q0U1OFx1QUM4QyArIFx1QkFBOFx1QjQ1MCBcdUQ0NUNcdUMyREMpLlxuICAgICAgICBjb25zdCByb3RhdGVkID0gbGFiZWxzLmxlbmd0aCA+IDE0O1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOmByZXBlYXQoJHtsYWJlbHMubGVuZ3RofSwgMWZyKWAsXG4gICAgICAgICAgICBmb250U2l6ZTo5LCBjb2xvcjondmFyKC0taW5rLTMpJyxcbiAgICAgICAgICAgIG1hcmdpblRvcDogcm90YXRlZCA/IDEwIDogNixcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBsZXR0ZXJTcGFjaW5nOicwLjA0ZW0nLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiByb3RhdGVkID8gMzYgOiAnYXV0bycsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAge2xhYmVscy5tYXAoKGwsIGkpID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtpfSBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogcm90YXRlZCA/ICdyaWdodCcgOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAuLi4ocm90YXRlZCA/IHtcbiAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybToncm90YXRlKC00NWRlZyknLFxuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOid0b3AgcmlnaHQnLFxuICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTonbm93cmFwJyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogOCxcbiAgICAgICAgICAgICAgICB9IDoge30pLFxuICAgICAgICAgICAgICB9fT57bH08L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICAgIH0pKCl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIHYwMC4xNzkgXHUyMDE0IFx1QjdBRFx1RDBCOSBcdUFDMDBcdUI4NUMgXHVCOUM5XHVCMzAwIFx1QjlBQ1x1QzJBNFx1RDJCOCBcdUFDRjVcdUQxQjUgXHVDRUY0XHVEM0VDXHVCMTBDXHVEMkI4IChEUlkpLiBcdUQ2MzhcdUJDODQgXHVDMkRDIFx1QjJFNFx1Qjk3OCBcdUQ1NkRcdUJBQTkgZGltLlxuLy8gaXRlbXM6IFt7IGxhYmVsLCBjb3VudCwgc3ViPywgY29sb3I/IH1dLiB1bml0OiBcdUIyRThcdUM3MDQgKFx1QzYwODogJ1x1RDY4QycpLiBoZWFkZXJMZWZ0IC8gaGVhZGVyUmlnaHQ6IFx1RDVFNFx1QjM1NCBcdUMyQUNcdUI4NkYuXG5jb25zdCBSYW5rZWRCYXJMaXN0ID0gKHsgaXRlbXMgPSBbXSwgdW5pdCA9ICcnLCBoZWFkZXJMZWZ0LCBoZWFkZXJSaWdodCwgZW1wdHlUZXh0ID0gJ1x1QjM3MFx1Qzc3NFx1RDEzMCBcdUM1QzZcdUM3NEMnLCBtYXhJdGVtcyA9IDEwLCB2YWx1ZUZvcm1hdCB9KSA9PiB7XG4gIGNvbnN0IFtob3ZlcklkeCwgc2V0SG92ZXJJZHhdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IHZpc2libGUgPSBpdGVtcy5zbGljZSgwLCBtYXhJdGVtcyk7XG4gIGNvbnN0IHRvdGFsID0gdmlzaWJsZS5yZWR1Y2UoKHMsIGl0KSA9PiBzICsgKE51bWJlcihpdC5jb3VudCkgfHwgMCksIDApIHx8IDE7XG4gIGNvbnN0IGZtdCA9IHZhbHVlRm9ybWF0IHx8ICgoYykgPT4gYCR7Y30ke3VuaXR9YCk7XG4gIHJldHVybiAoXG4gICAgPGFydGljbGUgY2xhc3NOYW1lPVwiY2FyZFwiIHN0eWxlPXt7bWFyZ2luQm90dG9tOjI0fX0+XG4gICAgICB7KGhlYWRlckxlZnQgfHwgaGVhZGVyUmlnaHQpICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbToxNCwgZmxleFdyYXA6J3dyYXAnLCBnYXA6OH19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMjJlbSd9fT57aGVhZGVyTGVmdH08L2Rpdj5cbiAgICAgICAgICB7aGVhZGVyUmlnaHQgJiYgPGRpdj57aGVhZGVyUmlnaHR9PC9kaXY+fVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7dmlzaWJsZS5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgIDxwIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7Zm9udFNpemU6MTN9fT57ZW1wdHlUZXh0fTwvcD5cbiAgICAgICkgOiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidncmlkJywgZ2FwOjh9fT5cbiAgICAgICAgICB7dmlzaWJsZS5tYXAoKGl0LCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwY3QgPSBNYXRoLnJvdW5kKCgoTnVtYmVyKGl0LmNvdW50KSB8fCAwKSAvIHRvdGFsKSAqIDEwMCk7XG4gICAgICAgICAgICBjb25zdCBpc0hvdiA9IGhvdmVySWR4ID09PSBpO1xuICAgICAgICAgICAgY29uc3QgaXNPdGhlciA9IGhvdmVySWR4ICE9PSBudWxsICYmIGhvdmVySWR4ICE9PSBpO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2l0LmlkIHx8IGl0LmxhYmVsIHx8IGl9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRIb3ZlcklkeChpKX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldEhvdmVySWR4KChjKSA9PiBjID09PSBpID8gbnVsbCA6IGMpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJywgZ2FwOjEyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZzonNHB4IDZweCcsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpc0hvdiA/ICdyZ2JhKDI0NSwyMTMsNzIsMC4wNiknIDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IGlzT3RoZXIgPyAwLjQgOiAxLFxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjonb3BhY2l0eSAuMTJzLCBiYWNrZ3JvdW5kIC4xMnMnLFxuICAgICAgICAgICAgICAgICAgY3Vyc29yOidkZWZhdWx0JyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIHRpdGxlPXtgJHtpdC5sYWJlbCB8fCAnJ30gXHUwMEI3ICR7Zm10KGl0LmNvdW50KX0gXHUwMEI3ICR7cGN0fSVgfT5cbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IDI4LCB0ZXh0QWxpZ246J3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMSxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOid2YXIoLS1pbmstMyknLCBmb250V2VpZ2h0OjcwMCxcbiAgICAgICAgICAgICAgICB9fT4je2krMX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IDE4MCwgZm9udFNpemU6IDEzLCBjb2xvcjondmFyKC0taW5rKScsXG4gICAgICAgICAgICAgICAgICBvdmVyZmxvdzonaGlkZGVuJywgdGV4dE92ZXJmbG93OidlbGxpcHNpcycsIHdoaXRlU3BhY2U6J25vd3JhcCcsXG4gICAgICAgICAgICAgICAgICBmbGV4OicwIDEgMjQwcHgnLFxuICAgICAgICAgICAgICAgIH19PntpdC5sYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZmxleDoxLCBoZWlnaHQ6OCwgYmFja2dyb3VuZDondmFyKC0tYmctMiknLCBvdmVyZmxvdzonaGlkZGVuJywgcG9zaXRpb246J3JlbGF0aXZlJ319PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCBsZWZ0OjAsIHRvcDowLCBib3R0b206MCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6YCR7cGN0fSVgLCBiYWNrZ3JvdW5kOiBpdC5jb2xvciB8fCAndmFyKC0tZ29sZCknLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOid3aWR0aCAuMTJzJyxcbiAgICAgICAgICAgICAgICAgIH19Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm9cIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IDkwLCB0ZXh0QWxpZ246J3JpZ2h0JywgZm9udFNpemU6MTIsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogaXNIb3YgPyAndmFyKC0taW5rKScgOiAndmFyKC0tZ29sZC0yKScsIGZvbnRXZWlnaHQ6NjAwLFxuICAgICAgICAgICAgICAgIH19PntwY3R9JSAoe2ZtdChpdC5jb3VudCl9KTwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2FydGljbGU+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIHYwMC4xNzMvMTc2IFx1MjAxNCBcdUNDMjhcdUQyQjggXHVDRjU0XHVENjM4XHVEMkI4IChcdUFFMzBcdUFDMDQpIFx1QzEyMFx1RDBERCBcdUFDRjVcdUQxQjUgVUkuXG5jb25zdCBDT0hPUlRfT1BUSU9OUyA9IFtcbiAgeyB2YWx1ZTogMSwgIGxhYmVsOiAnMVx1Qzc3QycgfSxcbiAgeyB2YWx1ZTogNywgIGxhYmVsOiAnN1x1Qzc3QycgfSxcbiAgeyB2YWx1ZTogMTQsIGxhYmVsOiAnMTRcdUM3N0MnIH0sXG4gIHsgdmFsdWU6IDMwLCBsYWJlbDogJzMwXHVDNzdDJyB9LFxuICB7IHZhbHVlOiA5MCwgbGFiZWw6ICc5MFx1Qzc3QycgfSxcbl07XG5jb25zdCBDb2hvcnRTZWxlY3RvciA9ICh7IHZhbHVlLCBvbkNoYW5nZSwgb3B0aW9ucyA9IENPSE9SVF9PUFRJT05TIH0pID0+IChcbiAgPGRpdiByb2xlPVwidGFibGlzdFwiIGFyaWEtbGFiZWw9XCJcdUFFMzBcdUFDMDQgXHVDMTIwXHVEMEREXCIgc3R5bGU9e3tkaXNwbGF5OidpbmxpbmUtZmxleCcsIGdhcDowLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyUmFkaXVzOjB9fT5cbiAgICB7b3B0aW9ucy5tYXAoKG9wdCwgaSkgPT4gKFxuICAgICAgPGJ1dHRvbiBrZXk9e29wdC52YWx1ZX0gdHlwZT1cImJ1dHRvblwiIHJvbGU9XCJ0YWJcIlxuICAgICAgICBhcmlhLXNlbGVjdGVkPXt2YWx1ZSA9PT0gb3B0LnZhbHVlfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZShvcHQudmFsdWUpfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBhZGRpbmc6JzRweCAxMHB4JyxcbiAgICAgICAgICBmb250U2l6ZToxMSwgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsXG4gICAgICAgICAgZm9udFdlaWdodDogdmFsdWUgPT09IG9wdC52YWx1ZSA/IDgwMCA6IDUwMCxcbiAgICAgICAgICBsZXR0ZXJTcGFjaW5nOicwLjA2ZW0nLFxuICAgICAgICAgIGJvcmRlcjonbm9uZScsXG4gICAgICAgICAgYm9yZGVyTGVmdDogaSA9PT0gMCA/ICdub25lJyA6ICcxcHggc29saWQgdmFyKC0tbGluZS0yKScsXG4gICAgICAgICAgYmFja2dyb3VuZDogdmFsdWUgPT09IG9wdC52YWx1ZSA/ICdyZ2JhKDI0NSwyMTMsNzIsMC4xNCknIDogJ3ZhcigtLWJnKScsXG4gICAgICAgICAgY29sb3I6IHZhbHVlID09PSBvcHQudmFsdWUgPyAndmFyKC0taW5rKScgOiAndmFyKC0taW5rLTIpJyxcbiAgICAgICAgICBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICB9fT57b3B0LmxhYmVsfTwvYnV0dG9uPlxuICAgICkpfVxuICA8L2Rpdj5cbik7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gdjAwLjE3NCBcdTIwMTQgU2Fua2V5IEZsb3cgQ2hhcnQgXHVENUVDXHVEMzdDICsgXHVDRUY0XHVEM0VDXHVCMTBDXHVEMkI4LlxuY29uc3QgX0NIQU5ORUxfRk9SX0hPU1QgPSAoaG9zdCkgPT4ge1xuICBjb25zdCBoID0gU3RyaW5nKGhvc3QgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gIGlmICghaCB8fCBoID09PSAnXHVDOUMxXHVDODExIFx1QkMyOVx1QkIzOCcpIHJldHVybiAnXHVDOUMxXHVDODExIFx1QkMyOVx1QkIzOCc7XG4gIGlmICgvZmFjZWJvb2t8ZmJcXC4vLnRlc3QoaCkpIHJldHVybiAnXHVEMzk4XHVDNzc0XHVDMkE0XHVCRDgxJztcbiAgaWYgKC9pbnN0YWdyYW0vLnRlc3QoaCkpIHJldHVybiAnXHVDNzc4XHVDMkE0XHVEMEMwXHVBREY4XHVCN0E4JztcbiAgaWYgKC9nb29nbGV8Z3N0YXRpY3xnd3MvLnRlc3QoaCkpIHJldHVybiAnXHVBRDZDXHVBRTAwJztcbiAgaWYgKC9uYXZlci8udGVzdChoKSkgcmV0dXJuICdcdUIxMjRcdUM3NzRcdUJDODQnO1xuICBpZiAoL3lvdXR1YmV8eW91dHVcXC5iZS8udGVzdChoKSkgcmV0dXJuICdcdUM3MjBcdUQyOUNcdUJFMEMnO1xuICBpZiAoL3R3aXR0ZXJ8dFxcLmNvfHhcXC5jb20vLnRlc3QoaCkpIHJldHVybiAnXHVEMkI4XHVDNzA0XHVEMTMwL1gnO1xuICBpZiAoL3RocmVhZHMvLnRlc3QoaCkpIHJldHVybiAnXHVDMkE0XHVCODA4XHVCNERDJztcbiAgaWYgKC9rYWthby8udGVzdChoKSkgcmV0dXJuICdcdUNFNzRcdUNFNzRcdUM2MjQnO1xuICBpZiAoL2JnbmpcXC5uZXR8Ymduai0vLnRlc3QoaCkpIHJldHVybiAnXHVCMEI0XHVCRDgwIFx1Qzc3NFx1QjNEOSc7XG4gIHJldHVybiBob3N0O1xufTtcbmNvbnN0IF9TVEFHRV9GT1JfUk9VVEUgPSAocm91dGUpID0+IHtcbiAgY29uc3QgciA9IFN0cmluZyhyb3V0ZSB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgaWYgKHIgPT09ICcvJyB8fCByID09PSAnL2hvbWUnIHx8IHIgPT09ICcnKSByZXR1cm4gJ0F3YXJlbmVzcyc7XG4gIGlmICgvXlxcLyhjb2x1bW58Ym9va3xmYXF8dGVybXN8cHJpdmFjeXxlYXR8c2xlZXB8c2hvcCkvLnRlc3QocikpIHJldHVybiAnSW50ZXJlc3QnO1xuICBpZiAoL15cXC8odG91cnxsZWN0dXJlc3xzaWdudXB8bG9naW58Y2hlY2tvdXR8Y29tbXVuaXR5fG15cGFnZXxhZG1pbikvLnRlc3QocikpIHJldHVybiAnQ29uc2lkZXJhdGlvbic7XG4gIHJldHVybiAnSW50ZXJlc3QnO1xufTtcbmNvbnN0IF9DSEFOTkVMX0NPTE9SUyA9IHtcbiAgJ1x1RDM5OFx1Qzc3NFx1QzJBNFx1QkQ4MSc6ICcjM2I4MmY2JyxcbiAgJ1x1Qzc3OFx1QzJBNFx1RDBDMFx1QURGOFx1QjdBOCc6ICcjZWM0ODk5JyxcbiAgJ1x1QUQ2Q1x1QUUwMCc6ICcjMTBiOTgxJyxcbiAgJ1x1QjEyNFx1Qzc3NFx1QkM4NCc6ICcjMjJjNTVlJyxcbiAgJ1x1QzcyMFx1RDI5Q1x1QkUwQyc6ICcjZWY0NDQ0JyxcbiAgJ1x1Q0U3NFx1Q0U3NFx1QzYyNCc6ICcjZjU5ZTBiJyxcbiAgJ1x1RDJCOFx1QzcwNFx1RDEzMC9YJzogJyMwZWE1ZTknLFxuICAnXHVDMkE0XHVCODA4XHVCNERDJzogJyNhODU1ZjcnLFxuICAnXHVCMEI0XHVCRDgwIFx1Qzc3NFx1QjNEOSc6ICcjOTRhM2I4JyxcbiAgJ1x1QzlDMVx1QzgxMSBcdUJDMjlcdUJCMzgnOiAnIzY0NzQ4YicsXG59O1xuY29uc3QgX0NIQU5ORUxfQ09MT1IgPSAobmFtZSkgPT4gX0NIQU5ORUxfQ09MT1JTW25hbWVdIHx8ICd2YXIoLS1nb2xkKSc7XG5cbmNvbnN0IFNhbmtleUZsb3cgPSAoeyBwYWlycywgZGF5cywgb25EYXlzQ2hhbmdlIH0pID0+IHtcbiAgY29uc3QgW2hvdmVyLCBzZXRIb3Zlcl0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcblxuICBjb25zdCByb3dzID0gUmVhY3QudXNlTWVtbygoKSA9PiAocGFpcnMgfHwgW10pLm1hcCgocCkgPT4gKHtcbiAgICAuLi5wLFxuICAgIGNoYW5uZWw6IF9DSEFOTkVMX0ZPUl9IT1NUKHAucmVmZXJyZXIgfHwgJ1x1QzlDMVx1QzgxMSBcdUJDMjlcdUJCMzgnKSxcbiAgICBzdGFnZTogX1NUQUdFX0ZPUl9ST1VURShwLnJvdXRlKSxcbiAgfSkpLCBbcGFpcnNdKTtcblxuICBjb25zdCBjaGFubmVsU3VtcyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IG0gPSBuZXcgTWFwKCk7XG4gICAgcm93cy5mb3JFYWNoKChyKSA9PiBtLnNldChyLmNoYW5uZWwsIChtLmdldChyLmNoYW5uZWwpIHx8IDApICsgci5jb3VudCkpO1xuICAgIHJldHVybiBBcnJheS5mcm9tKG0uZW50cmllcygpKS5tYXAoKFtuYW1lLCBjb3VudF0pID0+ICh7IG5hbWUsIGNvdW50IH0pKS5zb3J0KChhLCBiKSA9PiBiLmNvdW50IC0gYS5jb3VudCk7XG4gIH0sIFtyb3dzXSk7XG5cbiAgY29uc3Qgc3RhZ2VPcmRlciA9IFsnQXdhcmVuZXNzJywgJ0ludGVyZXN0JywgJ0NvbnNpZGVyYXRpb24nXTtcbiAgY29uc3Qgc3RhZ2VTdW1zID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgbSA9IG5ldyBNYXAoKTtcbiAgICByb3dzLmZvckVhY2goKHIpID0+IG0uc2V0KHIuc3RhZ2UsIChtLmdldChyLnN0YWdlKSB8fCAwKSArIHIuY291bnQpKTtcbiAgICByZXR1cm4gc3RhZ2VPcmRlci5tYXAoKHMpID0+ICh7IG5hbWU6IHMsIGNvdW50OiBtLmdldChzKSB8fCAwIH0pKS5maWx0ZXIoKHMpID0+IHMuY291bnQgPiAwKTtcbiAgfSwgW3Jvd3NdKTtcblxuICBjb25zdCByb3V0ZVN1bXMgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBtID0gbmV3IE1hcCgpO1xuICAgIHJvd3MuZm9yRWFjaCgocikgPT4gbS5zZXQoci5yb3V0ZSwgKG0uZ2V0KHIucm91dGUpIHx8IDApICsgci5jb3VudCkpO1xuICAgIHJldHVybiBBcnJheS5mcm9tKG0uZW50cmllcygpKS5tYXAoKFtyb3V0ZSwgY291bnRdKSA9PiAoeyBuYW1lOiByb3V0ZSwgY291bnQgfSkpLnNvcnQoKGEsIGIpID0+IGIuY291bnQgLSBhLmNvdW50KS5zbGljZSgwLCA4KTtcbiAgfSwgW3Jvd3NdKTtcbiAgY29uc3Qgcm91dGVTZXQgPSBSZWFjdC51c2VNZW1vKCgpID0+IG5ldyBTZXQocm91dGVTdW1zLm1hcCgocikgPT4gci5uYW1lKSksIFtyb3V0ZVN1bXNdKTtcblxuICBjb25zdCBsaW5rc0EgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBtID0gbmV3IE1hcCgpO1xuICAgIHJvd3MuZm9yRWFjaCgocikgPT4ge1xuICAgICAgaWYgKCFyb3V0ZVNldC5oYXMoci5yb3V0ZSkpIHJldHVybjtcbiAgICAgIGNvbnN0IGsgPSBgJHtyLmNoYW5uZWx9fCR7ci5zdGFnZX1gO1xuICAgICAgbS5zZXQoaywgKG0uZ2V0KGspIHx8IDApICsgci5jb3VudCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obS5lbnRyaWVzKCkpLm1hcCgoW2ssIGNvdW50XSkgPT4ge1xuICAgICAgY29uc3QgW2NoYW5uZWwsIHN0YWdlXSA9IGsuc3BsaXQoJ3wnKTtcbiAgICAgIHJldHVybiB7IGNoYW5uZWwsIHN0YWdlLCBjb3VudCB9O1xuICAgIH0pO1xuICB9LCBbcm93cywgcm91dGVTZXRdKTtcblxuICBjb25zdCBsaW5rc0IgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBtID0gbmV3IE1hcCgpO1xuICAgIHJvd3MuZm9yRWFjaCgocikgPT4ge1xuICAgICAgaWYgKCFyb3V0ZVNldC5oYXMoci5yb3V0ZSkpIHJldHVybjtcbiAgICAgIGNvbnN0IGsgPSBgJHtyLnN0YWdlfXwke3Iucm91dGV9YDtcbiAgICAgIG0uc2V0KGssIChtLmdldChrKSB8fCAwKSArIHIuY291bnQpO1xuICAgIH0pO1xuICAgIHJldHVybiBBcnJheS5mcm9tKG0uZW50cmllcygpKS5tYXAoKFtrLCBjb3VudF0pID0+IHtcbiAgICAgIGNvbnN0IFtzdGFnZSwgcm91dGVdID0gay5zcGxpdCgnfCcpO1xuICAgICAgcmV0dXJuIHsgc3RhZ2UsIHJvdXRlLCBjb3VudCB9O1xuICAgIH0pO1xuICB9LCBbcm93cywgcm91dGVTZXRdKTtcblxuICBjb25zdCBXID0gMTAwMDtcbiAgY29uc3QgTk9ERV9XID0gMTQ7XG4gIGNvbnN0IENPTF9YID0gWzgwLCA0ODAsIDg4MF07XG4gIGNvbnN0IFRPUF9QQUQgPSAzMDtcbiAgY29uc3QgQk9UX1BBRCA9IDIwO1xuICBjb25zdCBOT0RFX0dBUCA9IDg7XG5cbiAgY29uc3QgY29sVG90YWwgPSAoYXJyKSA9PiBhcnIucmVkdWNlKChzLCBuKSA9PiBzICsgbi5jb3VudCwgMCk7XG4gIGNvbnN0IHRvdGFsQ2ggPSBNYXRoLm1heCgxLCBjb2xUb3RhbChjaGFubmVsU3VtcykpO1xuICBjb25zdCB0b3RhbFN0ID0gTWF0aC5tYXgoMSwgY29sVG90YWwoc3RhZ2VTdW1zKSk7XG4gIGNvbnN0IHRvdGFsUnQgPSBNYXRoLm1heCgxLCBjb2xUb3RhbChyb3V0ZVN1bXMpKTtcbiAgY29uc3QgbWF4Tm9kZXNJbkNvbCA9IE1hdGgubWF4KGNoYW5uZWxTdW1zLmxlbmd0aCwgc3RhZ2VTdW1zLmxlbmd0aCwgcm91dGVTdW1zLmxlbmd0aCk7XG4gIGNvbnN0IGNvbFN1bXMgPSBbdG90YWxDaCwgdG90YWxTdCwgdG90YWxSdF07XG4gIGNvbnN0IG1heFRvdGFsID0gTWF0aC5tYXgoLi4uY29sU3Vtcyk7XG4gIGNvbnN0IEhFSUdIVCA9IE1hdGgubWluKDcyMCwgTWF0aC5tYXgoMzIwLCBtYXhOb2Rlc0luQ29sICogMzYgKyBtYXhUb3RhbCAvIDIpKTtcbiAgY29uc3QgdXNhYmxlSCA9IEhFSUdIVCAtIFRPUF9QQUQgLSBCT1RfUEFEIC0gKG1heE5vZGVzSW5Db2wgLSAxKSAqIE5PREVfR0FQO1xuICBjb25zdCBzY2FsZSA9IHVzYWJsZUggLyBtYXhUb3RhbDtcblxuICBjb25zdCBsYXlvdXQgPSAoYXJyKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hcCgpO1xuICAgIGxldCB5ID0gVE9QX1BBRDtcbiAgICBhcnIuZm9yRWFjaCgobikgPT4ge1xuICAgICAgY29uc3QgaCA9IE1hdGgubWF4KDIsIG4uY291bnQgKiBzY2FsZSk7XG4gICAgICByZXN1bHQuc2V0KG4ubmFtZSwgeyB5LCBoLCBjb3VudDogbi5jb3VudCB9KTtcbiAgICAgIHkgKz0gaCArIE5PREVfR0FQO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIGNvbnN0IGNoUG9zID0gbGF5b3V0KGNoYW5uZWxTdW1zKTtcbiAgY29uc3Qgc3RQb3MgPSBsYXlvdXQoc3RhZ2VTdW1zKTtcbiAgY29uc3QgcnRQb3MgPSBsYXlvdXQocm91dGVTdW1zKTtcblxuICBjb25zdCBjaE9mZnNldCA9IG5ldyBNYXAoKTtcbiAgY29uc3Qgc3RPZmZzZXRJbiA9IG5ldyBNYXAoKTtcbiAgY29uc3Qgc3RPZmZzZXRPdXQgPSBuZXcgTWFwKCk7XG4gIGNvbnN0IHJ0T2Zmc2V0ID0gbmV3IE1hcCgpO1xuXG4gIGNvbnN0IHNvcnRlZEEgPSBsaW5rc0Euc2xpY2UoKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgY29uc3QgYXkgPSBjaFBvcy5nZXQoYS5jaGFubmVsKT8ueSA/PyAwO1xuICAgIGNvbnN0IGJ5ID0gY2hQb3MuZ2V0KGIuY2hhbm5lbCk/LnkgPz8gMDtcbiAgICBpZiAoYXkgIT09IGJ5KSByZXR1cm4gYXkgLSBieTtcbiAgICByZXR1cm4gYi5jb3VudCAtIGEuY291bnQ7XG4gIH0pO1xuICBjb25zdCByaWJib25zQSA9IHNvcnRlZEEubWFwKChsaykgPT4ge1xuICAgIGNvbnN0IGNoID0gY2hQb3MuZ2V0KGxrLmNoYW5uZWwpO1xuICAgIGNvbnN0IHN0ID0gc3RQb3MuZ2V0KGxrLnN0YWdlKTtcbiAgICBpZiAoIWNoIHx8ICFzdCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgdCA9IGxrLmNvdW50ICogc2NhbGU7XG4gICAgY29uc3Qgb2ZmQ2ggPSBjaE9mZnNldC5nZXQobGsuY2hhbm5lbCkgfHwgMDtcbiAgICBjb25zdCBvZmZTdCA9IHN0T2Zmc2V0SW4uZ2V0KGxrLnN0YWdlKSB8fCAwO1xuICAgIGNvbnN0IHkxID0gY2gueSArIG9mZkNoICsgdCAvIDI7XG4gICAgY29uc3QgeTIgPSBzdC55ICsgb2ZmU3QgKyB0IC8gMjtcbiAgICBjaE9mZnNldC5zZXQobGsuY2hhbm5lbCwgb2ZmQ2ggKyB0KTtcbiAgICBzdE9mZnNldEluLnNldChsay5zdGFnZSwgb2ZmU3QgKyB0KTtcbiAgICByZXR1cm4geyAuLi5saywgeTEsIHkyLCB0IH07XG4gIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICBjb25zdCBzb3J0ZWRCID0gbGlua3NCLnNsaWNlKCkuc29ydCgoYSwgYikgPT4ge1xuICAgIGNvbnN0IGF5ID0gc3RQb3MuZ2V0KGEuc3RhZ2UpPy55ID8/IDA7XG4gICAgY29uc3QgYnkgPSBzdFBvcy5nZXQoYi5zdGFnZSk/LnkgPz8gMDtcbiAgICBpZiAoYXkgIT09IGJ5KSByZXR1cm4gYXkgLSBieTtcbiAgICByZXR1cm4gYi5jb3VudCAtIGEuY291bnQ7XG4gIH0pO1xuICBjb25zdCByaWJib25zQiA9IHNvcnRlZEIubWFwKChsaykgPT4ge1xuICAgIGNvbnN0IHN0ID0gc3RQb3MuZ2V0KGxrLnN0YWdlKTtcbiAgICBjb25zdCBydCA9IHJ0UG9zLmdldChsay5yb3V0ZSk7XG4gICAgaWYgKCFzdCB8fCAhcnQpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHQgPSBsay5jb3VudCAqIHNjYWxlO1xuICAgIGNvbnN0IG9mZlN0ID0gc3RPZmZzZXRPdXQuZ2V0KGxrLnN0YWdlKSB8fCAwO1xuICAgIGNvbnN0IG9mZlJ0ID0gcnRPZmZzZXQuZ2V0KGxrLnJvdXRlKSB8fCAwO1xuICAgIGNvbnN0IHkxID0gc3QueSArIG9mZlN0ICsgdCAvIDI7XG4gICAgY29uc3QgeTIgPSBydC55ICsgb2ZmUnQgKyB0IC8gMjtcbiAgICBzdE9mZnNldE91dC5zZXQobGsuc3RhZ2UsIG9mZlN0ICsgdCk7XG4gICAgcnRPZmZzZXQuc2V0KGxrLnJvdXRlLCBvZmZSdCArIHQpO1xuICAgIHJldHVybiB7IC4uLmxrLCB5MSwgeTIsIHQgfTtcbiAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIGlmIChjaGFubmVsU3Vtcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3twYWRkaW5nOjI0fX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBtYXJnaW5Cb3R0b206MTQsIGZsZXhXcmFwOid3cmFwJywgZ2FwOjh9fT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vIGdvbGRcIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBsZXR0ZXJTcGFjaW5nOicwLjI0ZW0nLCBtYXJnaW5Cb3R0b206NH19PkpPVVJORVkgXHUwMEI3IFx1QUNFMFx1QUMxRCBcdUM1RUNcdUM4MTUgXHVENzUwXHVCOTg0PC9kaXY+XG4gICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjE4LCBtYXJnaW46MH19Plx1QzcyMFx1Qzc4NSBcdUNDNDRcdUIxMTAgXHUyMTkyIFx1QjJFOFx1QUNDNCBcdTIxOTIgXHVCMzAwXHVENDVDIFx1QjNDNFx1Q0MyOSBcdUQzOThcdUM3NzRcdUM5QzA8L2gyPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxDb2hvcnRTZWxlY3RvciB2YWx1ZT17ZGF5c30gb25DaGFuZ2U9e29uRGF5c0NoYW5nZX0vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjd9fT5cbiAgICAgICAgICBcdUNENUNcdUFERkMge2RheXN9XHVDNzdDXHVBQzA0IFx1Q0UyMVx1QzgxNVx1QjQxQyBcdUQzOThcdUM3NzRcdUM5QzBcdUJERjBcdUFDMDAgXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LiBcdUMwQUNcdUM2QTlcdUM3OTAgXHVCQzI5XHVCQjM4XHVDNzc0IFx1QjIwNFx1QzgwMVx1QjQxOFx1QUM3MFx1QjA5OCBcdUNGNTRcdUQ2MzhcdUQyQjhcdUI5N0MgXHVCMjk4XHVCOUFDXHVCQTc0IFx1RDQ1Q1x1QzJEQ1x1QjQyOVx1QjJDOFx1QjJFNC5cbiAgICAgICAgPC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGN1YmljUGF0aCA9ICh4MSwgeTEsIHgyLCB5MiwgdCkgPT4ge1xuICAgIGNvbnN0IGN4MSA9ICh4MSArIHgyKSAvIDI7XG4gICAgY29uc3QgY3gyID0gKHgxICsgeDIpIC8gMjtcbiAgICByZXR1cm4gW1xuICAgICAgYE0gJHt4MX0gJHt5MSAtIHQvMn1gLFxuICAgICAgYEMgJHtjeDF9ICR7eTEgLSB0LzJ9LCAke2N4Mn0gJHt5MiAtIHQvMn0sICR7eDJ9ICR7eTIgLSB0LzJ9YCxcbiAgICAgIGBMICR7eDJ9ICR7eTIgKyB0LzJ9YCxcbiAgICAgIGBDICR7Y3gyfSAke3kyICsgdC8yfSwgJHtjeDF9ICR7eTEgKyB0LzJ9LCAke3gxfSAke3kxICsgdC8yfWAsXG4gICAgICAnWicsXG4gICAgXS5qb2luKCcgJyk7XG4gIH07XG5cbiAgY29uc3QgY2hhbm5lbExpbmtlZCA9IChjaE5hbWUpID0+IHtcbiAgICBjb25zdCBzdGFnZXMgPSBuZXcgU2V0KGxpbmtzQS5maWx0ZXIoKGwpID0+IGwuY2hhbm5lbCA9PT0gY2hOYW1lKS5tYXAoKGwpID0+IGwuc3RhZ2UpKTtcbiAgICBjb25zdCByb3V0ZXMgPSBuZXcgU2V0KGxpbmtzQi5maWx0ZXIoKGwpID0+IHN0YWdlcy5oYXMobC5zdGFnZSkpLm1hcCgobCkgPT4gbC5yb3V0ZSkpO1xuICAgIHJldHVybiB7IHN0YWdlcywgcm91dGVzIH07XG4gIH07XG4gIGNvbnN0IHJvdXRlTGlua2VkID0gKHJ0TmFtZSkgPT4ge1xuICAgIGNvbnN0IHN0YWdlcyA9IG5ldyBTZXQobGlua3NCLmZpbHRlcigobCkgPT4gbC5yb3V0ZSA9PT0gcnROYW1lKS5tYXAoKGwpID0+IGwuc3RhZ2UpKTtcbiAgICBjb25zdCBjaGFubmVscyA9IG5ldyBTZXQobGlua3NBLmZpbHRlcigobCkgPT4gc3RhZ2VzLmhhcyhsLnN0YWdlKSkubWFwKChsKSA9PiBsLmNoYW5uZWwpKTtcbiAgICByZXR1cm4geyBzdGFnZXMsIGNoYW5uZWxzIH07XG4gIH07XG4gIGNvbnN0IHN0YWdlTGlua2VkID0gKHN0TmFtZSkgPT4ge1xuICAgIGNvbnN0IGNoYW5uZWxzID0gbmV3IFNldChsaW5rc0EuZmlsdGVyKChsKSA9PiBsLnN0YWdlID09PSBzdE5hbWUpLm1hcCgobCkgPT4gbC5jaGFubmVsKSk7XG4gICAgY29uc3Qgcm91dGVzID0gbmV3IFNldChsaW5rc0IuZmlsdGVyKChsKSA9PiBsLnN0YWdlID09PSBzdE5hbWUpLm1hcCgobCkgPT4gbC5yb3V0ZSkpO1xuICAgIHJldHVybiB7IGNoYW5uZWxzLCByb3V0ZXMgfTtcbiAgfTtcblxuICBjb25zdCBkaW0gPSAoa2luZCwga2V5KSA9PiB7XG4gICAgaWYgKCFob3ZlcikgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChob3Zlci50eXBlID09PSAnY2hhbm5lbCcpIHtcbiAgICAgIGNvbnN0IHsgc3RhZ2VzLCByb3V0ZXMgfSA9IGNoYW5uZWxMaW5rZWQoaG92ZXIua2V5KTtcbiAgICAgIGlmIChraW5kID09PSAnY2hhbm5lbCcpIHJldHVybiBrZXkgIT09IGhvdmVyLmtleTtcbiAgICAgIGlmIChraW5kID09PSAnc3RhZ2UnKSByZXR1cm4gIXN0YWdlcy5oYXMoa2V5KTtcbiAgICAgIGlmIChraW5kID09PSAncm91dGUnKSByZXR1cm4gIXJvdXRlcy5oYXMoa2V5KTtcbiAgICAgIGlmIChraW5kID09PSAnbGlua0EnKSByZXR1cm4ga2V5LmNoYW5uZWwgIT09IGhvdmVyLmtleTtcbiAgICAgIGlmIChraW5kID09PSAnbGlua0InKSByZXR1cm4gIXN0YWdlcy5oYXMoa2V5LnN0YWdlKTtcbiAgICB9IGVsc2UgaWYgKGhvdmVyLnR5cGUgPT09ICdzdGFnZScpIHtcbiAgICAgIGNvbnN0IHsgY2hhbm5lbHMsIHJvdXRlcyB9ID0gc3RhZ2VMaW5rZWQoaG92ZXIua2V5KTtcbiAgICAgIGlmIChraW5kID09PSAnY2hhbm5lbCcpIHJldHVybiAhY2hhbm5lbHMuaGFzKGtleSk7XG4gICAgICBpZiAoa2luZCA9PT0gJ3N0YWdlJykgcmV0dXJuIGtleSAhPT0gaG92ZXIua2V5O1xuICAgICAgaWYgKGtpbmQgPT09ICdyb3V0ZScpIHJldHVybiAhcm91dGVzLmhhcyhrZXkpO1xuICAgICAgaWYgKGtpbmQgPT09ICdsaW5rQScpIHJldHVybiBrZXkuc3RhZ2UgIT09IGhvdmVyLmtleTtcbiAgICAgIGlmIChraW5kID09PSAnbGlua0InKSByZXR1cm4ga2V5LnN0YWdlICE9PSBob3Zlci5rZXk7XG4gICAgfSBlbHNlIGlmIChob3Zlci50eXBlID09PSAncm91dGUnKSB7XG4gICAgICBjb25zdCB7IHN0YWdlcywgY2hhbm5lbHMgfSA9IHJvdXRlTGlua2VkKGhvdmVyLmtleSk7XG4gICAgICBpZiAoa2luZCA9PT0gJ2NoYW5uZWwnKSByZXR1cm4gIWNoYW5uZWxzLmhhcyhrZXkpO1xuICAgICAgaWYgKGtpbmQgPT09ICdzdGFnZScpIHJldHVybiAhc3RhZ2VzLmhhcyhrZXkpO1xuICAgICAgaWYgKGtpbmQgPT09ICdyb3V0ZScpIHJldHVybiBrZXkgIT09IGhvdmVyLmtleTtcbiAgICAgIGlmIChraW5kID09PSAnbGlua0EnKSByZXR1cm4gIXN0YWdlcy5oYXMoa2V5LnN0YWdlKTtcbiAgICAgIGlmIChraW5kID09PSAnbGlua0InKSByZXR1cm4ga2V5LnJvdXRlICE9PSBob3Zlci5rZXk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCB0cnVuY2F0ZSA9IChzLCBuKSA9PiAoU3RyaW5nKHMgfHwgJycpLmxlbmd0aCA+IG4gPyBTdHJpbmcocykuc2xpY2UoMCwgbiAtIDEpICsgJ1x1MjAyNicgOiBTdHJpbmcocyB8fCAnJykpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3twYWRkaW5nOjI0LCBtYXJnaW5Cb3R0b206MTh9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidmbGV4LWVuZCcsIG1hcmdpbkJvdHRvbToxNCwgZmxleFdyYXA6J3dyYXAnLCBnYXA6OH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBnb2xkXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4yNGVtJywgbWFyZ2luQm90dG9tOjR9fT5KT1VSTkVZIFx1MDBCNyBcdUFDRTBcdUFDMUQgXHVDNUVDXHVDODE1IFx1RDc1MFx1Qjk4NDwvZGl2PlxuICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MTgsIG1hcmdpbjowfX0+XHVDNzIwXHVDNzg1IFx1Q0M0NFx1QjExMCBcdTIxOTIgXHVCMkU4XHVBQ0M0IFx1MjE5MiBcdUIzMDBcdUQ0NUMgXHVCM0M0XHVDQzI5IFx1RDM5OFx1Qzc3NFx1QzlDMDwvaDI+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjExLCBtYXJnaW5Ub3A6NiwgbGluZUhlaWdodDoxLjZ9fT5cbiAgICAgICAgICAgIFx1QjE3OFx1QjREQyBcdUI2MTBcdUIyOTQgXHVBQ0UxXHVDMTIwXHVDNUQwIFx1RDYzOFx1QkM4NFx1RDU1OFx1QkE3NCBcdUM1RjBcdUFDQjBcdUI0MUMgXHVENzUwXHVCOTg0XHVDNzc0IFx1QUMxNVx1Qzg3MFx1QjQyOVx1QjJDOFx1QjJFNC4gXHVDNzA0XHVDQUJEIFtcdUFFMzBcdUFDMDRdIFx1QzczQ1x1Qjg1QyBcdUNGNTRcdUQ2MzhcdUQyQjggXHVCQ0MwXHVBQ0JELlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxDb2hvcnRTZWxlY3RvciB2YWx1ZT17ZGF5c30gb25DaGFuZ2U9e29uRGF5c0NoYW5nZX0vPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246J3JlbGF0aXZlJywgb3ZlcmZsb3c6J2F1dG8nfX0+XG4gICAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke1d9ICR7SEVJR0hUfWB9IHN0eWxlPXt7d2lkdGg6JzEwMCUnLCBtaW5XaWR0aDo3MjAsIGhlaWdodDpIRUlHSFQsIGRpc3BsYXk6J2Jsb2NrJ319PlxuICAgICAgICAgIDx0ZXh0IHg9e0NPTF9YWzBdICsgTk9ERV9XIC8gMn0geT17MTZ9IHRleHRBbmNob3I9XCJtaWRkbGVcIiBmaWxsPVwidmFyKC0taW5rLTMpXCJcbiAgICAgICAgICAgIGZvbnRTaXplPXsxMX0gZm9udEZhbWlseT1cInZhcigtLWZvbnQtbW9ubylcIiBsZXR0ZXJTcGFjaW5nPVwiMC4yZW1cIj5cdUM3MjBcdUM3ODUgXHVDQzQ0XHVCMTEwPC90ZXh0PlxuICAgICAgICAgIDx0ZXh0IHg9e0NPTF9YWzFdICsgTk9ERV9XIC8gMn0geT17MTZ9IHRleHRBbmNob3I9XCJtaWRkbGVcIiBmaWxsPVwidmFyKC0taW5rLTMpXCJcbiAgICAgICAgICAgIGZvbnRTaXplPXsxMX0gZm9udEZhbWlseT1cInZhcigtLWZvbnQtbW9ubylcIiBsZXR0ZXJTcGFjaW5nPVwiMC4yZW1cIj5cdUIyRThcdUFDQzQ8L3RleHQ+XG4gICAgICAgICAgPHRleHQgeD17Q09MX1hbMl0gKyBOT0RFX1cgLyAyfSB5PXsxNn0gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZpbGw9XCJ2YXIoLS1pbmstMylcIlxuICAgICAgICAgICAgZm9udFNpemU9ezExfSBmb250RmFtaWx5PVwidmFyKC0tZm9udC1tb25vKVwiIGxldHRlclNwYWNpbmc9XCIwLjJlbVwiPlx1QjNDNFx1Q0MyOSBcdUQzOThcdUM3NzRcdUM5QzA8L3RleHQ+XG5cbiAgICAgICAgICB7cmliYm9uc0EubWFwKChsaywgaSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeDEgPSBDT0xfWFswXSArIE5PREVfVztcbiAgICAgICAgICAgIGNvbnN0IHgyID0gQ09MX1hbMV07XG4gICAgICAgICAgICBjb25zdCBmYWRlZCA9IGRpbSgnbGlua0EnLCBsayk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8cGF0aCBrZXk9e2BBJHtpfWB9XG4gICAgICAgICAgICAgICAgZD17Y3ViaWNQYXRoKHgxLCBsay55MSwgeDIsIGxrLnkyLCBsay50KX1cbiAgICAgICAgICAgICAgICBmaWxsPXtfQ0hBTk5FTF9DT0xPUihsay5jaGFubmVsKX1cbiAgICAgICAgICAgICAgICBvcGFjaXR5PXtmYWRlZCA/IDAuMDYgOiAwLjMyfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y3Vyc29yOidwb2ludGVyJywgdHJhbnNpdGlvbjonb3BhY2l0eSAuMTJzJ319XG4gICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRIb3Zlcih7IHR5cGU6ICdsaW5rQScsIGtleTogbGsgfSl9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcihudWxsKX0+XG4gICAgICAgICAgICAgICAgPHRpdGxlPntgJHtsay5jaGFubmVsfSBcdTIxOTIgJHtsay5zdGFnZX06ICR7bGsuY291bnR9XHVENjhDYH08L3RpdGxlPlxuICAgICAgICAgICAgICA8L3BhdGg+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICAgIHtyaWJib25zQi5tYXAoKGxrLCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB4MSA9IENPTF9YWzFdICsgTk9ERV9XO1xuICAgICAgICAgICAgY29uc3QgeDIgPSBDT0xfWFsyXTtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVkID0gZGltKCdsaW5rQicsIGxrKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YWdlQ29sb3IgPSBsay5zdGFnZSA9PT0gJ0F3YXJlbmVzcycgPyAnI2ZiOTIzYydcbiAgICAgICAgICAgICAgOiBsay5zdGFnZSA9PT0gJ0ludGVyZXN0JyA/ICcjMjJjNTVlJ1xuICAgICAgICAgICAgICA6ICcjZWY0NDQ0JztcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxwYXRoIGtleT17YEIke2l9YH1cbiAgICAgICAgICAgICAgICBkPXtjdWJpY1BhdGgoeDEsIGxrLnkxLCB4MiwgbGsueTIsIGxrLnQpfVxuICAgICAgICAgICAgICAgIGZpbGw9e3N0YWdlQ29sb3J9XG4gICAgICAgICAgICAgICAgb3BhY2l0eT17ZmFkZWQgPyAwLjA2IDogMC4yOH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcicsIHRyYW5zaXRpb246J29wYWNpdHkgLjEycyd9fVxuICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SG92ZXIoeyB0eXBlOiAnbGlua0InLCBrZXk6IGxrIH0pfVxuICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0SG92ZXIobnVsbCl9PlxuICAgICAgICAgICAgICAgIDx0aXRsZT57YCR7bGsuc3RhZ2V9IFx1MjE5MiAke2xrLnJvdXRlfTogJHtsay5jb3VudH1cdUQ2OENgfTwvdGl0bGU+XG4gICAgICAgICAgICAgIDwvcGF0aD5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG5cbiAgICAgICAgICB7Y2hhbm5lbFN1bXMubWFwKChuKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gY2hQb3MuZ2V0KG4ubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBmYWRlZCA9IGRpbSgnY2hhbm5lbCcsIG4ubmFtZSk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8ZyBrZXk9e2BjaC0ke24ubmFtZX1gfVxuICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SG92ZXIoeyB0eXBlOiAnY2hhbm5lbCcsIGtleTogbi5uYW1lIH0pfVxuICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0SG92ZXIobnVsbCl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBvcGFjaXR5OiBmYWRlZCA/IDAuMzUgOiAxLCB0cmFuc2l0aW9uOidvcGFjaXR5IC4xMnMnfX0+XG4gICAgICAgICAgICAgICAgPHJlY3QgeD17Q09MX1hbMF19IHk9e3AueX0gd2lkdGg9e05PREVfV30gaGVpZ2h0PXtwLmh9IGZpbGw9e19DSEFOTkVMX0NPTE9SKG4ubmFtZSl9IHJ4PXsxfS8+XG4gICAgICAgICAgICAgICAgPHRleHQgeD17Q09MX1hbMF0gLSA4fSB5PXtwLnkgKyBwLmggLyAyfSB0ZXh0QW5jaG9yPVwiZW5kXCIgZG9taW5hbnRCYXNlbGluZT1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZT17MTJ9IGZpbGw9XCJ2YXIoLS1pbmspXCIgZm9udEZhbWlseT1cInZhcigtLWZvbnQtc2FucylcIj5cbiAgICAgICAgICAgICAgICAgIHt0cnVuY2F0ZShuLm5hbWUsIDE0KX1cbiAgICAgICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgICAgICAgPHRleHQgeD17Q09MX1hbMF0gLSA4fSB5PXtwLnkgKyBwLmggLyAyICsgMTR9IHRleHRBbmNob3I9XCJlbmRcIiBkb21pbmFudEJhc2VsaW5lPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplPXsxMH0gZmlsbD1cInZhcigtLWluay0zKVwiIGZvbnRGYW1pbHk9XCJ2YXIoLS1mb250LW1vbm8pXCI+XG4gICAgICAgICAgICAgICAgICB7bi5jb3VudH1cbiAgICAgICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgICAgICAgPHRpdGxlPntgJHtuLm5hbWV9OiAke24uY291bnR9XHVENjhDYH08L3RpdGxlPlxuICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuXG4gICAgICAgICAge3N0YWdlU3Vtcy5tYXAoKG4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBzdFBvcy5nZXQobi5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGZhZGVkID0gZGltKCdzdGFnZScsIG4ubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBzdENvbG9yID0gbi5uYW1lID09PSAnQXdhcmVuZXNzJyA/ICcjZmI5MjNjJyA6IG4ubmFtZSA9PT0gJ0ludGVyZXN0JyA/ICcjMjJjNTVlJyA6ICcjZWY0NDQ0JztcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxnIGtleT17YHN0LSR7bi5uYW1lfWB9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRIb3Zlcih7IHR5cGU6ICdzdGFnZScsIGtleTogbi5uYW1lIH0pfVxuICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0SG92ZXIobnVsbCl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tjdXJzb3I6J3BvaW50ZXInLCBvcGFjaXR5OiBmYWRlZCA/IDAuMzUgOiAxLCB0cmFuc2l0aW9uOidvcGFjaXR5IC4xMnMnfX0+XG4gICAgICAgICAgICAgICAgPHJlY3QgeD17Q09MX1hbMV19IHk9e3AueX0gd2lkdGg9e05PREVfV30gaGVpZ2h0PXtwLmh9IGZpbGw9e3N0Q29sb3J9IHJ4PXsxfS8+XG4gICAgICAgICAgICAgICAgPHRleHQgeD17Q09MX1hbMV0gKyBOT0RFX1cgKyA4fSB5PXtwLnkgKyBwLmggLyAyfSB0ZXh0QW5jaG9yPVwic3RhcnRcIiBkb21pbmFudEJhc2VsaW5lPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplPXsxMn0gZmlsbD1cInZhcigtLWluaylcIiBmb250RmFtaWx5PVwidmFyKC0tZm9udC1zYW5zKVwiPlxuICAgICAgICAgICAgICAgICAge24ubmFtZX1cbiAgICAgICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgICAgICAgPHRleHQgeD17Q09MX1hbMV0gKyBOT0RFX1cgKyA4fSB5PXtwLnkgKyBwLmggLyAyICsgMTR9IHRleHRBbmNob3I9XCJzdGFydFwiIGRvbWluYW50QmFzZWxpbmU9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgZm9udFNpemU9ezEwfSBmaWxsPVwidmFyKC0taW5rLTMpXCIgZm9udEZhbWlseT1cInZhcigtLWZvbnQtbW9ubylcIj5cbiAgICAgICAgICAgICAgICAgIHtuLmNvdW50fVxuICAgICAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGl0bGU+e2Ake24ubmFtZX06ICR7bi5jb3VudH1cdUQ2OENgfTwvdGl0bGU+XG4gICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG5cbiAgICAgICAgICB7cm91dGVTdW1zLm1hcCgobikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcCA9IHJ0UG9zLmdldChuLm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgZmFkZWQgPSBkaW0oJ3JvdXRlJywgbi5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IHJ0Q29sb3IgPSBfU1RBR0VfRk9SX1JPVVRFKG4ubmFtZSkgPT09ICdBd2FyZW5lc3MnID8gJyNmYjkyM2MnXG4gICAgICAgICAgICAgIDogX1NUQUdFX0ZPUl9ST1VURShuLm5hbWUpID09PSAnSW50ZXJlc3QnID8gJyMyMmM1NWUnIDogJyNlZjQ0NDQnO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGcga2V5PXtgcnQtJHtuLm5hbWV9YH1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldEhvdmVyKHsgdHlwZTogJ3JvdXRlJywga2V5OiBuLm5hbWUgfSl9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcihudWxsKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2N1cnNvcjoncG9pbnRlcicsIG9wYWNpdHk6IGZhZGVkID8gMC4zNSA6IDEsIHRyYW5zaXRpb246J29wYWNpdHkgLjEycyd9fT5cbiAgICAgICAgICAgICAgICA8cmVjdCB4PXtDT0xfWFsyXX0geT17cC55fSB3aWR0aD17Tk9ERV9XfSBoZWlnaHQ9e3AuaH0gZmlsbD17cnRDb2xvcn0gcng9ezF9Lz5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXtDT0xfWFsyXSArIE5PREVfVyArIDh9IHk9e3AueSArIHAuaCAvIDJ9IHRleHRBbmNob3I9XCJzdGFydFwiIGRvbWluYW50QmFzZWxpbmU9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgZm9udFNpemU9ezEyfSBmaWxsPVwidmFyKC0taW5rKVwiIGZvbnRGYW1pbHk9XCJ2YXIoLS1mb250LXNhbnMpXCI+XG4gICAgICAgICAgICAgICAgICB7dHJ1bmNhdGUobi5uYW1lLCAyOCl9XG4gICAgICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9e0NPTF9YWzJdICsgTk9ERV9XICsgOH0geT17cC55ICsgcC5oIC8gMiArIDE0fSB0ZXh0QW5jaG9yPVwic3RhcnRcIiBkb21pbmFudEJhc2VsaW5lPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplPXsxMH0gZmlsbD1cInZhcigtLWluay0zKVwiIGZvbnRGYW1pbHk9XCJ2YXIoLS1mb250LW1vbm8pXCI+XG4gICAgICAgICAgICAgICAgICB7bi5jb3VudH1cbiAgICAgICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgICAgICAgPHRpdGxlPntgJHtuLm5hbWV9OiAke24uY291bnR9XHVENjhDYH08L3RpdGxlPlxuICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L3N2Zz5cbiAgICAgICAge2hvdmVyICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6IDgsIHJpZ2h0OiA4LFxuICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0taW5rKScsIGNvbG9yOid2YXIoLS1iZyknLFxuICAgICAgICAgICAgcGFkZGluZzonOHB4IDEycHgnLCBmb250U2l6ZToxMiwgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOicwLjA0ZW0nLCBib3JkZXJSYWRpdXM6MywgekluZGV4OjUsXG4gICAgICAgICAgICBib3hTaGFkb3c6JzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjMpJywgcG9pbnRlckV2ZW50czonbm9uZScsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7aG92ZXIudHlwZSA9PT0gJ2NoYW5uZWwnICYmIGBcdUNDNDRcdUIxMTA6ICR7aG92ZXIua2V5fSBcdTAwQjcgJHtjaFBvcy5nZXQoaG92ZXIua2V5KT8uY291bnQgfHwgMH1cdUQ2OENgfVxuICAgICAgICAgICAge2hvdmVyLnR5cGUgPT09ICdzdGFnZScgJiYgYFx1QjJFOFx1QUNDNDogJHtob3Zlci5rZXl9IFx1MDBCNyAke3N0UG9zLmdldChob3Zlci5rZXkpPy5jb3VudCB8fCAwfVx1RDY4Q2B9XG4gICAgICAgICAgICB7aG92ZXIudHlwZSA9PT0gJ3JvdXRlJyAmJiBgXHVEMzk4XHVDNzc0XHVDOUMwOiAke2hvdmVyLmtleX0gXHUwMEI3ICR7cnRQb3MuZ2V0KGhvdmVyLmtleSk/LmNvdW50IHx8IDB9XHVENjhDYH1cbiAgICAgICAgICAgIHtob3Zlci50eXBlID09PSAnbGlua0EnICYmIGAke2hvdmVyLmtleS5jaGFubmVsfSBcdTIxOTIgJHtob3Zlci5rZXkuc3RhZ2V9IFx1MDBCNyAke2hvdmVyLmtleS5jb3VudH1cdUQ2OENgfVxuICAgICAgICAgICAge2hvdmVyLnR5cGUgPT09ICdsaW5rQicgJiYgYCR7aG92ZXIua2V5LnN0YWdlfSBcdTIxOTIgJHtob3Zlci5rZXkucm91dGV9IFx1MDBCNyAke2hvdmVyLmtleS5jb3VudH1cdUQ2OENgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIHYwMC4xNjYvMTY3LzE3NiBcdTIwMTQgXHVDMEFDXHVDNzc0XHVCNERDXHVCQzE0IFx1RDU2RFx1QkFBOSBcdUJBMzhcdUM5QzBcdUM2QTkgc3ViLXRhYiBcdUI3OThcdUQzN0MgKyBcdUI3N0NcdUM3NzRcdUJFMEMgXHVCQkY4XHVCOUFDXHVCQ0Y0XHVBRTMwIGlmcmFtZS5cbmNvbnN0IFN1YlRhYnNWaWV3ID0gKHsgc3ViVGFicywgZGVmYXVsdEtleSwgc3RvcmFnZUtleSB9KSA9PiB7XG4gIGNvbnN0IFthY3RpdmUsIHNldEFjdGl2ZV0gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgaWYgKHN0b3JhZ2VLZXkpIHtcbiAgICAgIHRyeSB7IGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzdG9yYWdlS2V5KTsgaWYgKHYgJiYgc3ViVGFicy5zb21lKCh0KSA9PiB0LmtleSA9PT0gdikpIHJldHVybiB2OyB9IGNhdGNoIHt9XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0S2V5IHx8IChzdWJUYWJzWzBdICYmIHN1YlRhYnNbMF0ua2V5KTtcbiAgfSk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHN0b3JhZ2VLZXkpIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKHN0b3JhZ2VLZXksIGFjdGl2ZSk7IH0gY2F0Y2gge31cbiAgfSwgW2FjdGl2ZSwgc3RvcmFnZUtleV0pO1xuXG4gIGNvbnN0IFtwcmV2aWV3TW9kZSwgc2V0UHJldmlld01vZGVdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgIGlmIChzdG9yYWdlS2V5KSB7XG4gICAgICB0cnkgeyBjb25zdCB2ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RvcmFnZUtleSArICdfcG1vZGUnKTsgaWYgKHYgJiYgWydkZXNrdG9wJywndGFibGV0JywnbW9iaWxlJ10uaW5jbHVkZXModikpIHJldHVybiB2OyB9IGNhdGNoIHt9XG4gICAgfVxuICAgIHJldHVybiAnZGVza3RvcCc7XG4gIH0pO1xuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzdG9yYWdlS2V5KSB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzdG9yYWdlS2V5ICsgJ19wbW9kZScsIHByZXZpZXdNb2RlKTsgfSBjYXRjaCB7fVxuICB9LCBbcHJldmlld01vZGUsIHN0b3JhZ2VLZXldKTtcbiAgY29uc3QgW3JlbG9hZFRpY2ssIHNldFJlbG9hZFRpY2tdID0gUmVhY3QudXNlU3RhdGUoMCk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgZXZlbnRzID0gW1xuICAgICAgJ2Jnbmotc2l0ZS1jb250ZW50LXJlZnJlc2gnLFxuICAgICAgJ2JnbmotbGVnYWwtcmVmcmVzaCcsXG4gICAgICAnYmduai1mYXFzLXJlZnJlc2gnLFxuICAgICAgJ2JnbmotYmFuay1hY2NvdW50cy1yZWZyZXNoJyxcbiAgICBdO1xuICAgIGNvbnN0IGhhbmRsZXIgPSAoKSA9PiBzZXRSZWxvYWRUaWNrKCh2KSA9PiB2ICsgMSk7XG4gICAgZXZlbnRzLmZvckVhY2goKGUpID0+IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGUsIGhhbmRsZXIpKTtcbiAgICByZXR1cm4gKCkgPT4gZXZlbnRzLmZvckVhY2goKGUpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGUsIGhhbmRsZXIpKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IEFjdGl2ZSA9IHN1YlRhYnMuZmluZCgodCkgPT4gdC5rZXkgPT09IGFjdGl2ZSk7XG4gIGNvbnN0IHByZXZpZXdVcmwgPSBBY3RpdmUgJiYgQWN0aXZlLnByZXZpZXdVcmw7XG4gIGNvbnN0IFZJRVdQT1JUUyA9IHsgZGVza3RvcDogMTE4MCwgdGFibGV0OiA3NjAsIG1vYmlsZTogMzgwIH07XG4gIGNvbnN0IHByZXZpZXdXID0gVklFV1BPUlRTW3ByZXZpZXdNb2RlXSB8fCAxMTgwO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtwcmV2aWV3VXJsICYmIChcbiAgICAgICAgPHNlY3Rpb24gc3R5bGU9e3ttYXJnaW5Cb3R0b206MjQsIHBhZGRpbmdCb3R0b206MTgsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBtYXJnaW5Cb3R0b206MTIsIGZsZXhXcmFwOid3cmFwJywgZ2FwOjh9fT5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7Zm9udFNpemU6MTYsIG1hcmdpbjowLCBmb250V2VpZ2h0OjcwMH19PlxuICAgICAgICAgICAgICBcdUMyRTRcdUMyRENcdUFDMDQgXHVCQkY4XHVCOUFDXHVCQ0Y0XHVBRTMwXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjExLCBtYXJnaW5MZWZ0OjEwLCBmb250V2VpZ2h0OjUwMCwgbGV0dGVyU3BhY2luZzonMC4xMmVtJ319PntwcmV2aWV3VXJsfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo2fX0+XG4gICAgICAgICAgICAgIHtbWydkZXNrdG9wJywnUEMnXSxbJ3RhYmxldCcsJ1x1RDBEQ1x1QkUxNFx1QjlCRiddLFsnbW9iaWxlJywnXHVCQUE4XHVCQzE0XHVDNzdDJ11dLm1hcCgoW2ssbF0pID0+IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17a30gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldFByZXZpZXdNb2RlKGspfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzonNXB4IDEycHgnLCBmb250U2l6ZToxMiwgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IHByZXZpZXdNb2RlID09PSBrID8gODAwIDogNTAwLFxuICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOicwLjA0ZW0nLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6JzFweCBzb2xpZCAnICsgKHByZXZpZXdNb2RlID09PSBrID8gJ3ZhcigtLXByaW1hcnkpJyA6ICd2YXIoLS1saW5lLTIpJyksXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHByZXZpZXdNb2RlID09PSBrID8gJ3JnYmEoMjQ1LDIxMyw3MiwwLjEyKScgOiAndmFyKC0tYmcpJyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHByZXZpZXdNb2RlID09PSBrID8gJ3ZhcigtLWluayknIDogJ3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICB9fT57bH08L2J1dHRvbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldFJlbG9hZFRpY2soKHYpID0+IHYgKyAxKX0gYXJpYS1sYWJlbD1cIlx1QkJGOFx1QjlBQ1x1QkNGNFx1QUUzMCBcdUMwQzhcdUI4NUNcdUFDRTBcdUNFNjhcIlxuICAgICAgICAgICAgICAgIHRpdGxlPVwiXHVCQkY4XHVCOUFDXHVCQ0Y0XHVBRTMwIFx1QzBDOFx1Qjg1Q1x1QUNFMFx1Q0U2OFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6JzVweCAxMnB4JywgZm9udFNpemU6MTQsIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjondmFyKC0taW5rLTIpJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICB9fT5cdTIxQkI8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMTJlbScsIG1hcmdpbkJvdHRvbToxMH19PlxuICAgICAgICAgICAge3ByZXZpZXdNb2RlLnRvVXBwZXJDYXNlKCl9IFx1MDBCNyB7cHJldmlld1d9cHhcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7LyogdjAwLjE5MSBcdTIwMTQgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QkNGNFx1QUNFMCAnUEMgXHVCQkY4XHVCOUFDXHVCQ0Y0XHVBRTMwIFx1QUMwMFx1Qjg1QyBcdUNENUNcdUIzMDAgXHVCRTQ0XHVDNzI4XHVCODVDJy4gZGVza3RvcCBcdUJBQThcdUI0RENcdUIyOTQgXHVDRUU4XHVEMTRDXHVDNzc0XHVCMTA4IDEwMCUgXHVEM0VEIChcdUJBQThcdUJDMTRcdUM3N0MvXHVEMERDXHVCRTE0XHVCOUJGXHVDNzQwIHZpZXdwb3J0IFx1RDNFRCBcdUFDRTBcdUM4MTUpLiAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7b3ZlcmZsb3c6J2F1dG8nLCBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIG1heEhlaWdodDonNzB2aCd9fT5cbiAgICAgICAgICAgIDxpZnJhbWUga2V5PXtyZWxvYWRUaWNrfSBzcmM9e3ByZXZpZXdVcmx9XG4gICAgICAgICAgICAgIHRpdGxlPXtgXHVCQkY4XHVCOUFDXHVCQ0Y0XHVBRTMwIFx1MjAxNCAke0FjdGl2ZS5sYWJlbH1gfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHdpZHRoOiBwcmV2aWV3TW9kZSA9PT0gJ2Rlc2t0b3AnID8gJzEwMCUnIDogKHByZXZpZXdXICsgJ3B4JyksXG4gICAgICAgICAgICAgICAgbWluV2lkdGg6IHByZXZpZXdNb2RlID09PSAnZGVza3RvcCcgPyAnMTAwJScgOiAocHJldmlld1cgKyAncHgnKSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHByZXZpZXdNb2RlID09PSAnZGVza3RvcCcgPyAnNzB2aCcgOiAnNjAwcHgnLFxuICAgICAgICAgICAgICAgIGJvcmRlcjonMCcsIGRpc3BsYXk6J2Jsb2NrJyxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLFxuICAgICAgICAgICAgICB9fS8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgbWFyZ2luVG9wOjgsIGxpbmVIZWlnaHQ6MS42fX0+XG4gICAgICAgICAgICBcdUM1NDRcdUI3OTggXHVDMTFDXHVCRTBDIFx1RDBFRFx1QzVEMFx1QzExQyBcdUQzQjhcdUM5RDEgXHVENkM0IFtcdUQ4M0RcdURDQkUgXHVDODAwXHVDN0E1XSBcdUQwNzRcdUI5QUQgXHVDMkRDIFx1Qzc5MFx1QjNEOSBcdUMwQzhcdUI4NUNcdUFDRTBcdUNFNjguIFx1Qzk4OVx1QzJEQyBcdUQ2NTVcdUM3NzhcdUM3NDAgPHNwYW4gY2xhc3NOYW1lPVwibW9ub1wiPlx1MjFCQjwvc3Bhbj4gXHVEMDc0XHVCOUFELlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgKX1cbiAgICAgIDxkaXYgcm9sZT1cInRhYmxpc3RcIiBzdHlsZT17e1xuICAgICAgICBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIG1hcmdpbkJvdHRvbToyNCxcbiAgICAgICAgZGlzcGxheTonZmxleCcsIGdhcDowLCBmbGV4V3JhcDond3JhcCcsXG4gICAgICB9fT5cbiAgICAgICAge3N1YlRhYnMubWFwKCh0KSA9PiAoXG4gICAgICAgICAgPGJ1dHRvbiBrZXk9e3Qua2V5fSB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cInRhYlwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmUodC5rZXkpfVxuICAgICAgICAgICAgYXJpYS1zZWxlY3RlZD17YWN0aXZlID09PSB0LmtleX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBhZGRpbmc6JzEwcHggMThweCcsXG4gICAgICAgICAgICAgIGZvbnRTaXplOjE0LFxuICAgICAgICAgICAgICBmb250V2VpZ2h0OiBhY3RpdmUgPT09IHQua2V5ID8gNzAwIDogNTAwLFxuICAgICAgICAgICAgICBjb2xvcjogYWN0aXZlID09PSB0LmtleSA/ICd2YXIoLS1zZWNvbmRhcnkpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDonbm9uZScsIGJvcmRlclJpZ2h0Oidub25lJywgYm9yZGVyTGVmdDonbm9uZScsXG4gICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogYWN0aXZlID09PSB0LmtleSA/ICcycHggc29saWQgdmFyKC0tcHJpbWFyeSknIDogJzJweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6JzAuMDFlbScsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246J2NvbG9yIC4xNXMsIGJvcmRlci1jb2xvciAuMTVzJyxcbiAgICAgICAgICAgIH19Pnt0LmxhYmVsfTwvYnV0dG9uPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICAge0FjdGl2ZSAmJiBBY3RpdmUucmVuZGVyKCl9XG4gICAgPC8+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIHYwMC4xOTQgXHUyMDE0IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM2OTRcdUNDQUQgJ1x1QjMwMFx1QzJEQ1x1QkNGNFx1QjREQ1x1QzVEMCBcdUM4MTFcdUMxOEQgXHVDMkRDXHVBQzA0XHVDNUQwIFx1QjUzMFx1Qjk3OCBcdUQ3ODhcdUQyQjhcdUI5RjUnLlxuLy8gMjRoIFx1MDBENyA3XHVDNjk0XHVDNzdDIFx1QURGOFx1QjlBQ1x1QjREQy4gXHVBQzAxIFx1QzE0MFx1Qzc0MCBtYXggXHVCMzAwXHVCRTQ0IGFscGhhIFx1QURGOFx1Qjc3Q1x1QjM3MFx1Qzc3NFx1QzE1OCArIGhvdmVyIHRvb2x0aXAuXG4vLyBkYXRhOiBbeyBkb3c6IDB+NiAoMD1cdUM3N0MpLCBob3VyOiAwfjIzLCB2aWV3cywgdW5pcSB9XVxuY29uc3QgX0RPV19MQUJFTFMgPSBbJ1x1Qzc3QycsICdcdUM2RDQnLCAnXHVENjU0JywgJ1x1QzIxOCcsICdcdUJBQTknLCAnXHVBRTA4JywgJ1x1RDFBMCddO1xuY29uc3QgSGVhdG1hcEdyaWQgPSAoeyBkYXRhLCBsYWJlbCwgaGVhZGVyUmlnaHQsIGRheXMgPSAzMCB9KSA9PiB7XG4gIGNvbnN0IFtob3Zlciwgc2V0SG92ZXJdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7IC8vIHtkb3csIGhvdXIsIHZpZXdzLCB1bmlxLCB4LCB5fVxuICAvLyA3XHUwMEQ3MjQgZ3JpZCBcdUFENkNcdUNEOTUuXG4gIGNvbnN0IGdyaWQgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBnID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogNyB9LCAoKSA9PiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAyNCB9LCAoKSA9PiAoeyB2aWV3czogMCwgdW5pcTogMCB9KSkpO1xuICAgIChBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YSA6IFtdKS5mb3JFYWNoKChkKSA9PiB7XG4gICAgICBjb25zdCBkb3cgPSBOdW1iZXIoZC5kb3cpOyBjb25zdCBoID0gTnVtYmVyKGQuaG91cik7XG4gICAgICBpZiAoZG93ID49IDAgJiYgZG93IDwgNyAmJiBoID49IDAgJiYgaCA8IDI0KSB7XG4gICAgICAgIGdbZG93XVtoXSA9IHsgdmlld3M6IE51bWJlcihkLnZpZXdzKSB8fCAwLCB1bmlxOiBOdW1iZXIoZC51bmlxKSB8fCAwIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGc7XG4gIH0sIFtkYXRhXSk7XG4gIGNvbnN0IG1heCA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGxldCBtID0gMDtcbiAgICBncmlkLmZvckVhY2goKHJvdykgPT4gcm93LmZvckVhY2goKGMpID0+IHsgaWYgKGMudmlld3MgPiBtKSBtID0gYy52aWV3czsgfSkpO1xuICAgIHJldHVybiBtO1xuICB9LCBbZ3JpZF0pO1xuXG4gIGNvbnN0IGNlbGxDb2xvciA9ICh2KSA9PiB7XG4gICAgaWYgKG1heCA8PSAwIHx8IHYgPD0gMCkgcmV0dXJuICdyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpJztcbiAgICBjb25zdCBhbHBoYSA9IE1hdGgubWF4KDAuMDgsIE1hdGgubWluKDAuOTUsIHYgLyBtYXgpKTtcbiAgICByZXR1cm4gYHJnYmEoMjQ1LDIxMyw3Miwke2FscGhhLnRvRml4ZWQoMyl9KWA7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8YXJ0aWNsZSBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3sgcG9zaXRpb246J3JlbGF0aXZlJyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBtYXJnaW5Cb3R0b206MTQsIGdhcDo4LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgPGgzIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToxNCwgbWFyZ2luOjAsIGZvbnRXZWlnaHQ6NzAwfX0+XG4gICAgICAgICAge2xhYmVsIHx8IGBcdUQ4M0RcdURERDMgXHVDODExXHVDMThEIFx1QzJEQ1x1QUMwNCBcdUQ3ODhcdUQyQjhcdUI5RjUgKFx1Q0Q1Q1x1QURGQyAke2RheXN9XHVDNzdDIFx1MDBCNyBLU1QpYH1cbiAgICAgICAgPC9oMz5cbiAgICAgICAge2hlYWRlclJpZ2h0fVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7b3ZlcmZsb3dYOidhdXRvJ319PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTonZ3JpZCcsXG4gICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczonYXV0byByZXBlYXQoMjQsIG1pbm1heCgxOHB4LCAxZnIpKScsXG4gICAgICAgICAgZ3JpZEF1dG9Sb3dzOicxOHB4JyxcbiAgICAgICAgICBnYXA6MixcbiAgICAgICAgICBtaW5XaWR0aDo1NjAsXG4gICAgICAgIH19PlxuICAgICAgICAgIHsvKiBcdUQ1RTRcdUIzNTQgXHVENTg5IFx1MjAxNCBcdUMyRENcdUFDMDQgXHVCNzdDXHVCQ0E4ICovfVxuICAgICAgICAgIDxkaXYvPlxuICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiAyNCB9LCAoXywgaCkgPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2BoLSR7aH1gfSBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tmb250U2l6ZTo5LCB0ZXh0QWxpZ246J2NlbnRlcicsIGxldHRlclNwYWNpbmc6JzAuMDRlbScsIGxpbmVIZWlnaHQ6JzE4cHgnfX0+XG4gICAgICAgICAgICAgIHtoICUgMyA9PT0gMCA/IGAke2h9YCA6ICcnfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgICAgey8qIDdcdUQ1ODkgXHUwMEQ3IDI0XHVDNUY0ICovfVxuICAgICAgICAgIHtncmlkLm1hcCgocm93LCBkb3cpID0+IChcbiAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudCBrZXk9e2ByLSR7ZG93fWB9PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBsaW5lSGVpZ2h0OicxOHB4JywgcGFkZGluZ1JpZ2h0OjYsIHRleHRBbGlnbjoncmlnaHQnfX0+XG4gICAgICAgICAgICAgICAge19ET1dfTEFCRUxTW2Rvd119XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7cm93Lm1hcCgoY2VsbCwgaG91cikgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtgYy0ke2Rvd30tJHtob3VyfWB9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHNldEhvdmVyKHsgZG93LCBob3VyLCB2aWV3czogY2VsbC52aWV3cywgdW5pcTogY2VsbC51bmlxLCB4OiByLmxlZnQgKyByLndpZHRoIC8gMiwgeTogci50b3AgfSk7XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcihudWxsKX1cbiAgICAgICAgICAgICAgICAgIHJvbGU9XCJpbWdcIlxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YCR7X0RPV19MQUJFTFNbZG93XX1cdUM2OTRcdUM3N0MgJHtob3VyfVx1QzJEQzogXHVEMzk4XHVDNzc0XHVDOUMwXHVCREYwICR7Y2VsbC52aWV3c31cdUQ2OEMsIFx1QzEzOFx1QzE1OCAke2NlbGwudW5pcX1cdUFDNzRgfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogY2VsbENvbG9yKGNlbGwudmlld3MpLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogY2VsbC52aWV3cyA+IDAgPyAncG9pbnRlcicgOiAnZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgICB9fS8+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIHsvKiBcdUJDOTRcdUI4NDAgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDoxMCwgbWFyZ2luVG9wOjEyLCBmb250U2l6ZToxMH19IGNsYXNzTmFtZT1cImRpbS0yIG1vbm9cIj5cbiAgICAgICAgPHNwYW4+XHVDODAxXHVDNzRDPC9zcGFuPlxuICAgICAgICB7WzAuMSwgMC4yNSwgMC41LCAwLjc1LCAxXS5tYXAoKGEpID0+IChcbiAgICAgICAgICA8c3BhbiBrZXk9e2F9IHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OidpbmxpbmUtYmxvY2snLCB3aWR0aDoxNCwgaGVpZ2h0OjE0LFxuICAgICAgICAgICAgYmFja2dyb3VuZDpgcmdiYSgyNDUsMjEzLDcyLCR7YX0pYCwgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIH19Lz5cbiAgICAgICAgKSl9XG4gICAgICAgIDxzcGFuPlx1QjlDRVx1Qzc0Qzwvc3Bhbj5cbiAgICAgICAgPHNwYW4gc3R5bGU9e3tmbGV4OjF9fS8+XG4gICAgICAgIDxzcGFuPlx1Q0Q1Q1x1QjMwMCB7bWF4fSB2aWV3cy9jZWxsPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICB7LyogdG9vbHRpcCAqL31cbiAgICAgIHtob3ZlciAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjonZml4ZWQnLCBsZWZ0OiBob3Zlci54LCB0b3A6IGhvdmVyLnkgLSA4LFxuICAgICAgICAgIHRyYW5zZm9ybTondHJhbnNsYXRlKC01MCUsIC0xMDAlKScsXG4gICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmctMiwgIzFhMWExYSknLCBjb2xvcjondmFyKC0taW5rKScsXG4gICAgICAgICAgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIHBhZGRpbmc6JzZweCAxMHB4JyxcbiAgICAgICAgICBmb250U2l6ZToxMSwgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czonbm9uZScsIHpJbmRleDoxMDAwLCB3aGl0ZVNwYWNlOidub3dyYXAnLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7X0RPV19MQUJFTFNbaG92ZXIuZG93XX0ge1N0cmluZyhob3Zlci5ob3VyKS5wYWRTdGFydCgyLCcwJyl9OjAwIFx1MDBCNyB7aG92ZXIudmlld3N9IHZpZXdzIFx1MDBCNyB7aG92ZXIudW5pcX0gc2Vzc2lvbnNcbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvYXJ0aWNsZT5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gXHVCMTc4XHVDRDlDIFx1MjAxNCBBdXRoQWRtaW5QYWdlIFx1QUMwMCBjb25zdCBYID0gd2luZG93LlggXHVCODVDIFx1Q0MzOFx1Qzg3MC5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7XG4gIGRvd25sb2FkQmxvYiwgZG93bmxvYWRDc3YsIGRvd25sb2FkSnNvbixcbiAgcGlja0ltYWdlV2l0aFIyRmFsbGJhY2ssXG4gIE1pbmlCYXJDaGFydCwgUmFua2VkQmFyTGlzdCwgQ09IT1JUX09QVElPTlMsIENvaG9ydFNlbGVjdG9yLFxuICBTYW5rZXlGbG93LCBTdWJUYWJzVmlldyxcbiAgSGVhdG1hcEdyaWQsXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQWtCQSxNQUFNLGVBQWUsQ0FBQyxVQUFVLFNBQVMsT0FBTywrQkFBK0I7QUFDN0UsTUFBSTtBQUNGLFVBQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUMvQyxVQUFNLE1BQU0sSUFBSSxnQkFBZ0IsSUFBSTtBQUNwQyxVQUFNLElBQUksU0FBUyxjQUFjLEdBQUc7QUFDcEMsTUFBRSxPQUFPO0FBQ1QsTUFBRSxXQUFXO0FBQ2IsYUFBUyxLQUFLLFlBQVksQ0FBQztBQUMzQixNQUFFLE1BQU07QUFDUixhQUFTLEtBQUssWUFBWSxDQUFDO0FBQzNCLFFBQUksZ0JBQWdCLEdBQUc7QUFBQSxFQUN6QixTQUFTLEtBQUs7QUFDWixVQUFNLDhDQUFlLDJCQUFLLFlBQVcsMENBQVk7QUFBQSxFQUNuRDtBQUNGO0FBQ0EsTUFBTSxjQUFjLENBQUMsVUFBVSxRQUFRLGFBQWEsVUFBVSxLQUFLLHdCQUF3QjtBQUMzRixNQUFNLGVBQWUsQ0FBQyxVQUFVLFFBQVEsYUFBYSxVQUFVLEtBQUss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

})();

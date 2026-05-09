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
    window.BGNJ_TOAST.error("\uB2E4\uC6B4\uB85C\uB4DC \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"));
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
    window.BGNJ_TOAST.error(`\uC774\uBBF8\uC9C0\uAC00 \uB108\uBB34 \uD07D\uB2C8\uB2E4(${(file.size / 1024 / 1024).toFixed(1)}MB). R2 \uC2E4\uD328 + ${(fallbackMaxBytes / 1024 / 1024).toFixed(1)}MB \uD3F4\uBC31 \uD55C\uB3C4 \uCD08\uACFC.`);
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
    window.BGNJ_TOAST.error("\uC774\uBBF8\uC9C0 \uC77D\uAE30 \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || ""));
    e.target.value = "";
    return null;
  }
};
const MiniBarChart = ({ series, labels, height = 120, color = "var(--primary)", label, unit = "", formatTooltip, headerRight }) => {
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
        background: it.color || "var(--primary)",
        transition: "width .12s"
      } })),
      /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
        minWidth: 90,
        textAlign: "right",
        fontSize: 12,
        color: isHov ? "var(--ink)" : "var(--primary-hover)",
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
const _CHANNEL_COLOR = (name) => _CHANNEL_COLORS[name] || "var(--primary)";
const SankeyFlow = ({ pairs, days, onDaysChange }) => {
  var _a, _b, _c;
  const [hover, setHover] = React.useState(null);
  const rows = React.useMemo(() => (Array.isArray(pairs) ? pairs : []).map((p) => ({
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

})();

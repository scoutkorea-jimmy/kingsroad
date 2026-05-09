(function(){
const MAX_IMAGES = 10;
const _normalizeImages = (raw) => {
  if (!Array.isArray(raw)) return [];
  const cleaned = raw.filter((it) => it && typeof it === "object" && typeof it.url === "string" && it.url).slice(0, MAX_IMAGES).map((it) => ({
    url: String(it.url),
    credit: String(it.credit || ""),
    isPrimary: !!it.isPrimary
  }));
  if (cleaned.length === 0) return [];
  const primaryCount = cleaned.filter((it) => it.isPrimary).length;
  if (primaryCount === 0) cleaned[0].isPrimary = true;
  else if (primaryCount > 1) {
    let firstSeen = false;
    cleaned.forEach((it) => {
      if (it.isPrimary && !firstSeen) {
        firstSeen = true;
      } else {
        it.isPrimary = false;
      }
    });
  }
  return cleaned;
};
const _withPrimaryFirst = (images) => {
  const norm = _normalizeImages(images);
  const idx = norm.findIndex((it) => it.isPrimary);
  if (idx <= 0) return norm;
  return [norm[idx], ...norm.slice(0, idx), ...norm.slice(idx + 1)];
};
const MediaGalleryEditor = ({ value, onChange, folder = "gallery" }) => {
  const images = _normalizeImages(value);
  const [busy, setBusy] = React.useState(false);
  const [adminTick, setAdminTick] = React.useState(0);
  const fileInputRef = React.useRef(null);
  React.useEffect(() => {
    if (window.pickImageWithR2Fallback) return;
    const onLoaded = () => setAdminTick((v) => v + 1);
    window.addEventListener("bgnj-admin-scripts-loaded", onLoaded);
    if (typeof window.BGNJ_LOAD_ADMIN === "function") {
      window.BGNJ_LOAD_ADMIN().catch(() => {
      });
    }
    return () => window.removeEventListener("bgnj-admin-scripts-loaded", onLoaded);
  }, []);
  const handlePick = async (e) => {
    var _a, _b, _c, _d;
    if (images.length >= MAX_IMAGES) {
      (_b = (_a = window.BGNJ_TOAST) == null ? void 0 : _a.error) == null ? void 0 : _b.call(_a, `\uC0AC\uC9C4\uC740 \uCD5C\uB300 ${MAX_IMAGES}\uC7A5\uAE4C\uC9C0 \uCD94\uAC00\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`);
      e.target.value = "";
      return;
    }
    if (typeof window.pickImageWithR2Fallback !== "function") {
      (_d = (_c = window.BGNJ_TOAST) == null ? void 0 : _c.error) == null ? void 0 : _d.call(_c, "\uC5C5\uB85C\uB4DC \uD5EC\uD37C\uAC00 \uC900\uBE44\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
      e.target.value = "";
      return;
    }
    setBusy(true);
    try {
      const url = await window.pickImageWithR2Fallback(e, { folder });
      if (!url) return;
      const next = images.slice();
      next.push({ url, credit: "", isPrimary: next.length === 0 });
      onChange == null ? void 0 : onChange(_normalizeImages(next));
    } finally {
      setBusy(false);
    }
  };
  const updateAt = (idx, patch) => {
    const next = images.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange == null ? void 0 : onChange(_normalizeImages(next));
  };
  const setPrimary = (idx) => {
    const next = images.map((it, i) => ({ ...it, isPrimary: i === idx }));
    onChange == null ? void 0 : onChange(next);
  };
  const removeAt = (idx) => {
    const next = images.slice();
    next.splice(idx, 1);
    onChange == null ? void 0 : onChange(_normalizeImages(next));
  };
  const moveUp = (idx) => {
    if (idx <= 0) return;
    const next = images.slice();
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange == null ? void 0 : onChange(_normalizeImages(next));
  };
  return /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--line)", borderRadius: 6, padding: 14, background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 13 } }, "\uC0AC\uC9C4 \uAC24\uB7EC\uB9AC"), /* @__PURE__ */ React.createElement("span", { className: "dim mono", style: { fontSize: 10, marginLeft: 8, letterSpacing: "0.1em" } }, images.length, " / ", MAX_IMAGES)), /* @__PURE__ */ React.createElement("label", { className: "btn btn-small", style: { cursor: images.length >= MAX_IMAGES ? "not-allowed" : "pointer", opacity: busy || images.length >= MAX_IMAGES ? 0.55 : 1 } }, busy ? "\uC5C5\uB85C\uB4DC \uC911..." : "\uFF0B \uC0AC\uC9C4 \uCD94\uAC00", /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: fileInputRef,
      type: "file",
      accept: "image/*",
      onChange: handlePick,
      disabled: busy || images.length >= MAX_IMAGES,
      style: { display: "none" }
    }
  ))), images.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.6, padding: "12px 4px" } }, "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uC0AC\uC9C4\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC704 \uBC84\uD2BC\uC73C\uB85C \uCD5C\uB300 ", MAX_IMAGES, "\uC7A5\uAE4C\uC9C0 \uCD94\uAC00\uD560 \uC218 \uC788\uC5B4\uC694. \uCCAB \uC0AC\uC9C4\uC774 \uC790\uB3D9\uC73C\uB85C \uB300\uD45C\uC0AC\uC9C4\uC774 \uB418\uBA70, \uB77C\uB514\uC624\uB85C \uBCC0\uACBD \uAC00\uB2A5\uD569\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 } }, images.map((img, i) => /* @__PURE__ */ React.createElement("li", { key: img.url + i, style: {
    display: "grid",
    gridTemplateColumns: "88px 1fr auto",
    gap: 12,
    padding: 8,
    background: "var(--bg)",
    border: "1px solid var(--line)",
    borderRadius: 4,
    alignItems: "center"
  } }, /* @__PURE__ */ React.createElement("div", { style: { width: 88, height: 64, overflow: "hidden", borderRadius: 3, background: "var(--bg-3)" } }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: img.url,
      alt: `\uC0AC\uC9C4 ${i + 1}`,
      style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 6, minWidth: 0 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      type: "text",
      placeholder: "\uCD9C\uCC98 (\uC608: \uC0AC\uC9C4 \xA9 \uAE40\uC791\uAC00 / Unsplash)",
      value: img.credit,
      onChange: (e) => updateAt(i, { credit: e.target.value }),
      style: { padding: "6px 10px", fontSize: 12 }
    }
  ), /* @__PURE__ */ React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)", cursor: "pointer" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "radio",
      name: "gallery-primary",
      checked: !!img.isPrimary,
      onChange: () => setPrimary(i),
      style: { accentColor: "var(--primary)" }
    }
  ), /* @__PURE__ */ React.createElement("span", null, "\uB300\uD45C\uC0AC\uC9C4"), img.isPrimary && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, letterSpacing: "0.18em", color: "var(--secondary)", marginLeft: 4 } }, "\u2605 COVER"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => moveUp(i),
      disabled: i === 0,
      style: { padding: "2px 8px", fontSize: 11, opacity: i === 0 ? 0.4 : 1 }
    },
    "\u2191"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => removeAt(i),
      style: { padding: "2px 8px", fontSize: 11, color: "var(--danger)", borderColor: "var(--danger)" }
    },
    "\uC0AD\uC81C"
  ))))));
};
const MediaGalleryView = ({ images, title }) => {
  const norm = _withPrimaryFirst(images);
  if (!Array.isArray(norm) || norm.length < 2) return null;
  const rest = norm.slice(1);
  return /* @__PURE__ */ React.createElement("section", { "aria-label": `${title || ""} \uCD94\uAC00 \uC0AC\uC9C4`, style: { marginTop: 24, marginBottom: 32 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--line)" } }, "\uC0AC\uC9C4 ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11, marginLeft: 6 } }, rest.length, "\uC7A5")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 } }, rest.map((img, i) => /* @__PURE__ */ React.createElement("figure", { key: img.url + i, style: { margin: 0, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { aspectRatio: "4/3", background: "var(--bg-2)", overflow: "hidden", borderRadius: 3 } }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: img.url,
      alt: img.credit || `${title || "\uC0AC\uC9C4"} ${i + 2}`,
      loading: "lazy",
      style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
    }
  )), img.credit && /* @__PURE__ */ React.createElement("figcaption", { className: "dim mono", style: { fontSize: 10, letterSpacing: "0.05em", marginTop: 6, lineHeight: 1.5 } }, img.credit)))));
};
const pickPrimaryImage = (images) => {
  const norm = _normalizeImages(images);
  return norm.find((it) => it.isPrimary) || norm[0] || null;
};
Object.assign(window, {
  MediaGalleryEditor,
  MediaGalleryView,
  pickPrimaryImage,
  BGNJ_GALLERY_MAX: MAX_IMAGES
});

})();

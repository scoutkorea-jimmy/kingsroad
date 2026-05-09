(function(){
const MAX_IMAGES = 10;
const _normalizeImages = (raw, { showPrimary = true } = {}) => {
  if (!Array.isArray(raw)) return [];
  const cleaned = raw.filter((it) => it && typeof it === "object" && typeof it.url === "string" && it.url).slice(0, MAX_IMAGES).map((it) => ({
    url: String(it.url),
    credit: String(it.credit || ""),
    isPrimary: !!it.isPrimary
  }));
  if (cleaned.length === 0) return [];
  if (!showPrimary) {
    cleaned.forEach((it) => {
      it.isPrimary = false;
    });
    return cleaned;
  }
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
let _galleryUid = 0;
const _nextUid = () => `bgnj-gallery-${++_galleryUid}`;
const _uploadFiles = async (files, folder, onProgress) => {
  var _a, _b;
  if (typeof window.pickImageWithR2Fallback !== "function") {
    throw new Error("\uC5C5\uB85C\uB4DC \uD5EC\uD37C\uAC00 \uC900\uBE44\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
  }
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file || !((_b = (_a = file.type) == null ? void 0 : _a.startsWith) == null ? void 0 : _b.call(_a, "image/"))) continue;
    const fakeEvent = { target: { files: [file], value: "" } };
    try {
      const url = await window.pickImageWithR2Fallback(fakeEvent, { folder });
      if (url) urls.push(url);
    } catch (err) {
      try {
        console.warn("[MediaGalleryEditor] \uD55C \uC7A5 \uC5C5\uB85C\uB4DC \uC2E4\uD328 (\uB2E4\uC74C \uC7A5 \uC9C4\uD589):", err);
      } catch (e) {
      }
    }
    onProgress == null ? void 0 : onProgress(i + 1, files.length);
  }
  return urls;
};
const MediaGalleryEditor = ({
  value,
  onChange,
  folder = "gallery",
  label = "\uC0AC\uC9C4 \uAC24\uB7EC\uB9AC",
  helpText = "",
  showPrimary = true,
  max = MAX_IMAGES
}) => {
  const images = _normalizeImages(value, { showPrimary });
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState({ done: 0, total: 0 });
  const [dragOver, setDragOver] = React.useState(false);
  const [adminTick, setAdminTick] = React.useState(0);
  const radioName = React.useMemo(_nextUid, []);
  const limit = Math.min(MAX_IMAGES, Math.max(1, max));
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
  const handleFiles = async (fileList) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    if (!fileList || fileList.length === 0) return;
    const remaining = limit - images.length;
    if (remaining <= 0) {
      (_b = (_a = window.BGNJ_TOAST) == null ? void 0 : _a.error) == null ? void 0 : _b.call(_a, `\uC0AC\uC9C4\uC740 \uCD5C\uB300 ${limit}\uC7A5\uAE4C\uC9C0 \uCD94\uAC00\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`);
      return;
    }
    const accepted = Array.from(fileList).filter((f) => {
      var _a2, _b2;
      return f && ((_b2 = (_a2 = f.type) == null ? void 0 : _a2.startsWith) == null ? void 0 : _b2.call(_a2, "image/"));
    }).slice(0, remaining);
    if (accepted.length === 0) return;
    if (fileList.length > accepted.length) {
      (_d = (_c = window.BGNJ_TOAST) == null ? void 0 : _c.error) == null ? void 0 : _d.call(_c, `\uCD5C\uB300 ${limit}\uC7A5 \u2014 ${accepted.length}\uC7A5\uB9CC \uCD94\uAC00\uB429\uB2C8\uB2E4.`);
    }
    setBusy(true);
    setProgress({ done: 0, total: accepted.length });
    try {
      const urls = await _uploadFiles(accepted, folder, (done, total) => setProgress({ done, total }));
      if (urls.length === 0) {
        (_f = (_e = window.BGNJ_TOAST) == null ? void 0 : _e.error) == null ? void 0 : _f.call(_e, "\uC5C5\uB85C\uB4DC \uC2E4\uD328 \u2014 \uC774\uBBF8\uC9C0\uB97C \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        return;
      }
      const next = images.slice();
      urls.forEach((url) => {
        next.push({ url, credit: "", isPrimary: showPrimary && next.length === 0 });
      });
      onChange == null ? void 0 : onChange(_normalizeImages(next, { showPrimary }));
      (_h = (_g = window.BGNJ_TOAST) == null ? void 0 : _g.success) == null ? void 0 : _h.call(_g, `${urls.length}\uC7A5 \uCD94\uAC00\uB410\uC2B5\uB2C8\uB2E4.`);
    } catch (err) {
      (_j = (_i = window.BGNJ_TOAST) == null ? void 0 : _i.error) == null ? void 0 : _j.call(_i, (err == null ? void 0 : err.message) || "\uC5C5\uB85C\uB4DC \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
    } finally {
      setBusy(false);
      setProgress({ done: 0, total: 0 });
    }
  };
  const onPick = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };
  const onDrop = (e) => {
    var _a;
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (busy) return;
    handleFiles((_a = e.dataTransfer) == null ? void 0 : _a.files);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!busy) setDragOver(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };
  const updateAt = (idx, patch) => {
    const next = images.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange == null ? void 0 : onChange(_normalizeImages(next, { showPrimary }));
  };
  const setPrimary = (idx) => {
    const next = images.map((it, i) => ({ ...it, isPrimary: i === idx }));
    onChange == null ? void 0 : onChange(next);
  };
  const removeAt = (idx) => {
    const next = images.slice();
    next.splice(idx, 1);
    onChange == null ? void 0 : onChange(_normalizeImages(next, { showPrimary }));
  };
  const moveUp = (idx) => {
    if (idx <= 0) return;
    const next = images.slice();
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange == null ? void 0 : onChange(_normalizeImages(next, { showPrimary }));
  };
  const moveDown = (idx) => {
    if (idx >= images.length - 1) return;
    const next = images.slice();
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange == null ? void 0 : onChange(_normalizeImages(next, { showPrimary }));
  };
  const isFull = images.length >= limit;
  const dropZoneStyle = {
    border: `2px ${dragOver ? "solid" : "dashed"} ${dragOver ? "var(--primary)" : "var(--line-2)"}`,
    borderRadius: 6,
    padding: "20px 16px",
    textAlign: "center",
    background: dragOver ? "rgba(245,213,72,0.12)" : "var(--bg-3)",
    transition: "background .15s, border-color .15s",
    cursor: isFull || busy ? "not-allowed" : "pointer",
    marginBottom: 12
  };
  return /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--line-2)", borderRadius: 6, padding: 14, background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 13 } }, label), /* @__PURE__ */ React.createElement("span", { className: "dim mono", style: { fontSize: 10, marginLeft: 8, letterSpacing: "0.1em" } }, images.length, " / ", limit)), busy && progress.total > 0 && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, color: "var(--secondary)", letterSpacing: "0.1em" } }, "\uC5C5\uB85C\uB4DC \uC911 ", progress.done, " / ", progress.total)), helpText && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 11, lineHeight: 1.6, marginBottom: 10 } }, helpText), /* @__PURE__ */ React.createElement(
    "label",
    {
      onDrop,
      onDragOver,
      onDragLeave,
      onDragEnd: onDragLeave,
      style: dropZoneStyle
    },
    /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "file",
        accept: "image/*",
        multiple: true,
        onChange: onPick,
        disabled: busy || isFull,
        style: { display: "none" }
      }
    ),
    busy ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      border: "3px solid var(--line)",
      borderTopColor: "var(--primary)",
      animation: "bgnj-spin 0.7s linear infinite"
    }, "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 14, color: "var(--secondary)", fontWeight: 600 } }, "\uC0AC\uC9C4 \uC5C5\uB85C\uB4DC \uC911\u2026 ", progress.total > 0 && `${progress.done} / ${progress.total}`), progress.total > 0 && /* @__PURE__ */ React.createElement("div", { style: { width: "70%", maxWidth: 260, height: 6, background: "var(--bg-3)", borderRadius: 999, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: `${Math.round(progress.done / progress.total * 100)}%`,
      height: "100%",
      background: "var(--primary)",
      transition: "width .25s ease"
    } })), /* @__PURE__ */ React.createElement("div", { className: "dim mono", style: { fontSize: 10, letterSpacing: "0.1em" } }, "R2 \uC5C5\uB85C\uB4DC \u2014 \uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824 \uC8FC\uC138\uC694")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 14, marginBottom: 4, color: "var(--ink)" } }, isFull ? `\uCD5C\uB300 ${limit}\uC7A5 \uB3C4\uB2EC` : dragOver ? "\uC5EC\uAE30\uC5D0 \uB193\uC73C\uC138\uC694" : "\uFF0B \uC0AC\uC9C4 \uCD94\uAC00 (\uD074\uB9AD \uB610\uB294 \uB4DC\uB798\uADF8)"), /* @__PURE__ */ React.createElement("div", { className: "dim mono", style: { fontSize: 10, letterSpacing: "0.05em" } }, isFull ? "\uD55C \uC7A5 \uC0AD\uC81C \uD6C4 \uCD94\uAC00 \uAC00\uB2A5" : `\uC5EC\uB7EC \uC7A5 \uD55C \uBC88\uC5D0 \uAC00\uB2A5 \xB7 \uD55C \uC7A5\uB2F9 R2 5MB / \uD3F4\uBC31 1.5MB \xB7 \uB0A8\uC740 \uC2AC\uB86F ${limit - images.length}\uC7A5`))
  ), images.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.6, padding: "4px 4px 0" } }, "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uC0AC\uC9C4\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.", showPrimary && " \uCCAB \uC0AC\uC9C4\uC774 \uC790\uB3D9\uC73C\uB85C \uB300\uD45C\uC0AC\uC9C4\uC774 \uB418\uBA70, \uB77C\uB514\uC624\uB85C \uBCC0\uACBD \uAC00\uB2A5\uD569\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 } }, images.map((img, i) => /* @__PURE__ */ React.createElement("li", { key: img.url + i, style: {
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
      alt: `${label} ${i + 1}`,
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
  ), showPrimary && /* @__PURE__ */ React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)", cursor: "pointer" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "radio",
      name: radioName,
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
      onClick: () => moveDown(i),
      disabled: i === images.length - 1,
      style: { padding: "2px 8px", fontSize: 11, opacity: i === images.length - 1 ? 0.4 : 1 }
    },
    "\u2193"
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
const MediaGalleryView = ({ images, title, sectionLabel = "\uC0AC\uC9C4", withCover = true }) => {
  const norm = withCover ? _withPrimaryFirst(images) : _normalizeImages(images, { showPrimary: false });
  if (!Array.isArray(norm) || norm.length === 0) return null;
  const grid = withCover ? norm.slice(1) : norm;
  if (grid.length === 0) return null;
  return /* @__PURE__ */ React.createElement("section", { "aria-label": `${title || ""} ${sectionLabel}`, style: { marginTop: 24, marginBottom: 32 } }, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 18, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--line)" } }, sectionLabel, " ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11, marginLeft: 6 } }, grid.length, "\uC7A5")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 } }, grid.map((img, i) => /* @__PURE__ */ React.createElement("figure", { key: img.url + i, style: { margin: 0, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { aspectRatio: "4/3", background: "var(--bg-2)", overflow: "hidden", borderRadius: 3 } }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: img.url,
      alt: img.credit || `${title || sectionLabel} ${i + 1}`,
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

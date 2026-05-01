(function(){
const useUserLevel = (user) => React.useMemo(() => window.BGNJ_USER_LEVEL(user), [user]);
const getCategoriesForBoard = (boardType) => window.BGNJ_STORES.categories.filter((c) => c.boardType === boardType);
const HashtagInput = ({ tags, setTags, max = 10 }) => {
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef(null);
  const commit = (raw) => {
    const t = raw.trim().replace(/^#+/, "").replace(/\s+/g, "");
    if (!t) return;
    if (tags.includes(t)) return;
    if (tags.length >= max) return;
    setTags([...tags, t]);
  };
  const handleKey = (e) => {
    if (e.key === " " || e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(input);
      setInput("");
    } else if (e.key === "Backspace" && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "tag-input-wrap", onClick: () => {
    var _a;
    return (_a = inputRef.current) == null ? void 0 : _a.focus();
  } }, tags.map((t, i) => /* @__PURE__ */ React.createElement("span", { key: t, className: "tag-chip" }, "#", t, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setTags(tags.filter((x) => x !== t)),
      "aria-label": `${t} \uD0DC\uADF8 \uC0AD\uC81C`
    },
    "\u2715"
  ))), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: inputRef,
      value: input,
      onChange: (e) => setInput(e.target.value),
      onKeyDown: handleKey,
      onBlur: () => {
        if (input.trim()) {
          commit(input);
          setInput("");
        }
      },
      placeholder: tags.length ? "" : "\uD0DC\uADF8 \uC785\uB825 \uD6C4 \uC2A4\uD398\uC774\uC2A4\uBC14 (\uCD5C\uB300 10\uAC1C)",
      "aria-label": "\uD574\uC2DC\uD0DC\uADF8 \uC785\uB825"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field-hint", style: { marginTop: 6 } }, "\uC2A4\uD398\uC774\uC2A4\uBC14 \xB7 Enter \xB7 \uC27C\uD45C\uB85C \uD0DC\uADF8 \uAD6C\uBD84 \xB7 Backspace\uB85C \uB9C8\uC9C0\uB9C9 \uD0DC\uADF8 \uC0AD\uC81C \xB7 ", tags.length, "/", max));
};
const ImageSlider = ({ images, autoplayMs = 4e3 }) => {
  var _a;
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const prefersReduced = React.useMemo(() => {
    var _a2;
    return typeof window !== "undefined" && ((_a2 = window.matchMedia) == null ? void 0 : _a2.call(window, "(prefers-reduced-motion: reduce)").matches);
  }, []);
  React.useEffect(() => {
    if (images.length <= 1 || paused || prefersReduced) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), autoplayMs);
    return () => clearInterval(t);
  }, [images.length, paused, autoplayMs, prefersReduced]);
  if (!images.length) return null;
  const go = (i) => setIdx((i % images.length + images.length) % images.length);
  return /* @__PURE__ */ React.createElement(
    "figure",
    {
      "aria-roledescription": "carousel",
      "aria-label": "\uCCA8\uBD80 \uC774\uBBF8\uC9C0 \uC2AC\uB77C\uC774\uB4DC",
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onFocus: () => setPaused(true),
      onBlur: () => setPaused(false)
    },
    /* @__PURE__ */ React.createElement("div", { className: "img-slider" }, /* @__PURE__ */ React.createElement("div", { className: "img-slider-track", style: { transform: `translateX(-${idx * 100}%)` } }, images.map((img, i) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: i,
        className: "img-slider-slide",
        role: "group",
        "aria-roledescription": "slide",
        "aria-label": `${i + 1} / ${images.length}`,
        "aria-hidden": i !== idx
      },
      /* @__PURE__ */ React.createElement("img", { src: img.dataUrl || img.src, alt: img.alt || img.name || `\uC774\uBBF8\uC9C0 ${i + 1}` })
    ))), images.length > 1 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "img-slider-nav prev", onClick: () => go(idx - 1), "aria-label": "\uC774\uC804 \uC774\uBBF8\uC9C0" }, "\u2039"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "img-slider-nav next", onClick: () => go(idx + 1), "aria-label": "\uB2E4\uC74C \uC774\uBBF8\uC9C0" }, "\u203A"), /* @__PURE__ */ React.createElement("div", { className: "img-slider-caption" }, /* @__PURE__ */ React.createElement("span", { "aria-live": "polite" }, idx + 1, " / ", images.length)), /* @__PURE__ */ React.createElement("div", { className: "img-slider-dots", role: "tablist", "aria-label": "\uC2AC\uB77C\uC774\uB4DC \uC120\uD0DD" }, images.map((_, i) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        type: "button",
        role: "tab",
        "aria-current": i === idx,
        "aria-label": `${i + 1}\uBC88 \uC2AC\uB77C\uC774\uB4DC`,
        onClick: () => setIdx(i)
      }
    ))))),
    ((_a = images[idx]) == null ? void 0 : _a.caption) && /* @__PURE__ */ React.createElement("figcaption", { className: "dim", style: { fontSize: 12, marginTop: 8, textAlign: "center" } }, images[idx].caption)
  );
};
const ImageAttacher = ({ images, setImages, max = 10 }) => {
  const inputRef = React.useRef(null);
  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    const remaining = max - images.length;
    if (remaining <= 0) return;
    const toAdd = files.slice(0, remaining);
    const results = await Promise.all(toAdd.map(async (f) => {
      const meta = { name: f.name, size: f.size, alt: f.name.replace(/\.[^.]+$/, "") };
      try {
        const { url } = await window.BGNJ_MEDIA.uploadFile(f, { folder: "post-images", maxBytes: 10 * 1024 * 1024 });
        return { ...meta, dataUrl: url };
      } catch (err) {
        console.warn("[v00.085] R2 \uAC8C\uC2DC\uAE00 \uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC \uC2E4\uD328 \u2014 dataURI \uD3F4\uBC31:", err);
      }
      if (f.size > 5 * 1024 * 1024) {
        alert(`'${f.name}' R2 \uC2E4\uD328 + dataURI \uD3F4\uBC31 \uD55C\uB3C4 5MB \uCD08\uACFC \u2014 \uAC74\uB108\uB700.`);
        return null;
      }
      const dataUrl = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.readAsDataURL(f);
      });
      return { ...meta, dataUrl };
    }));
    setImages([...images, ...results.filter(Boolean)]);
  };
  const remove = (i) => setImages(images.filter((_, j) => j !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = images.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "field-label" }, "\uCCA8\uBD80 \uC774\uBBF8\uC9C0 ", /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "(", images.length, "/", max, ")")), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      disabled: images.length >= max,
      onClick: () => {
        var _a;
        return (_a = inputRef.current) == null ? void 0 : _a.click();
      }
    },
    "+ \uC774\uBBF8\uC9C0 \uC120\uD0DD"
  )), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: inputRef,
      type: "file",
      accept: "image/*",
      multiple: true,
      style: { display: "none" },
      onChange: (e) => {
        handleFiles(e.target.files);
        e.target.value = "";
      }
    }
  ), images.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "img-thumbs" }, images.map((img, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "img-thumb" }, /* @__PURE__ */ React.createElement("img", { src: img.dataUrl || img.src, alt: img.alt || `thumb-${i}` }), /* @__PURE__ */ React.createElement("span", { className: "img-thumb-order" }, String(i + 1).padStart(2, "0")), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "img-thumb-remove",
      onClick: () => remove(i),
      "aria-label": `${i + 1}\uBC88 \uC774\uBBF8\uC9C0 \uC81C\uAC70`
    },
    "\u2715"
  ), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 4, right: 4, display: "flex", gap: 2 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => move(i, -1),
      disabled: i === 0,
      "aria-label": `${i + 1}\uBC88 \uC774\uBBF8\uC9C0 \uC55E\uC73C\uB85C`,
      style: { background: "rgba(0,0,0,0.6)", border: "none", color: "var(--gold)", fontSize: 10, padding: "1px 5px", cursor: "pointer", minHeight: 0 }
    },
    "\u25C0"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => move(i, 1),
      disabled: i === images.length - 1,
      "aria-label": `${i + 1}\uBC88 \uC774\uBBF8\uC9C0 \uB4A4\uB85C`,
      style: { background: "rgba(0,0,0,0.6)", border: "none", color: "var(--gold)", fontSize: 10, padding: "1px 5px", cursor: "pointer", minHeight: 0 }
    },
    "\u25B6"
  ))))) : /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: { aspectRatio: "5/1", fontSize: 10 } }, "\uC774\uBBF8\uC9C0\uB97C \uCCA8\uBD80\uD558\uBA74 \uC0C1\uC138 \uD398\uC774\uC9C0 \uD558\uB2E8\uC5D0 \uC790\uB3D9 \uC2AC\uB77C\uC774\uB4DC\uB85C \uD45C\uC2DC\uB429\uB2C8\uB2E4"));
};
const FILE_MAX_SIZE = 10 * 1024 * 1024;
const FILE_MAX_COUNT = 3;
const _fmtSize = (n) => {
  if (!n && n !== 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
};
const FileAttacher = ({ files, setFiles, max = FILE_MAX_COUNT, maxSize = FILE_MAX_SIZE }) => {
  const inputRef = React.useRef(null);
  const [error, setError] = React.useState("");
  const handleFiles = async (fileList) => {
    setError("");
    const incoming = Array.from(fileList || []);
    const remaining = max - files.length;
    if (remaining <= 0) {
      setError(`\uCCA8\uBD80\uB294 \uCD5C\uB300 ${max}\uAC1C\uAE4C\uC9C0 \uAC00\uB2A5\uD569\uB2C8\uB2E4.`);
      return;
    }
    const accepted = [];
    for (const f of incoming.slice(0, remaining)) {
      if (f.size > maxSize) {
        setError(`'${f.name}' \uC740(\uB294) ${_fmtSize(maxSize)} \uCD08\uACFC \u2014 \uCCA8\uBD80 \uBD88\uAC00.`);
        continue;
      }
      accepted.push(f);
    }
    const results = await Promise.all(accepted.map(async (f) => {
      const meta = { name: f.name, type: f.type || "", size: f.size };
      try {
        const { url } = await window.BGNJ_MEDIA.uploadFile(f, { folder: "post-attachments", maxBytes: maxSize });
        return { ...meta, dataUrl: url };
      } catch (err) {
        console.warn("[v00.085] R2 \uAC8C\uC2DC\uAE00 \uCCA8\uBD80 \uC5C5\uB85C\uB4DC \uC2E4\uD328 \u2014 dataURI \uD3F4\uBC31:", err);
      }
      if (f.size > 5 * 1024 * 1024) {
        setError(`'${f.name}' R2 \uC2E4\uD328 + dataURI \uD3F4\uBC31 \uD55C\uB3C4 5MB \uCD08\uACFC \u2014 \uCCA8\uBD80 \uBD88\uAC00.`);
        return null;
      }
      const dataUrl = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.readAsDataURL(f);
      });
      return { ...meta, dataUrl };
    }));
    setFiles([...files, ...results.filter(Boolean)]);
  };
  const remove = (i) => setFiles(files.filter((_, j) => j !== i));
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "field-label" }, "\uCCA8\uBD80 \uD30C\uC77C ", /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "(", files.length, "/", max, " \xB7 \uAC01 ", _fmtSize(maxSize), " \uC774\uD558)")), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      disabled: files.length >= max,
      onClick: () => {
        var _a;
        return (_a = inputRef.current) == null ? void 0 : _a.click();
      }
    },
    "+ \uD30C\uC77C \uC120\uD0DD"
  )), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: inputRef,
      type: "file",
      multiple: true,
      style: { display: "none" },
      onChange: (e) => {
        handleFiles(e.target.files);
        e.target.value = "";
      }
    }
  ), error && /* @__PURE__ */ React.createElement("div", { role: "alert", style: { fontSize: 11, color: "var(--danger)", marginBottom: 8 } }, error), files.length > 0 ? /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 } }, files.map((f, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "1px solid var(--line)", background: "var(--bg-2)", fontSize: 12 } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u{1F4CE}"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, f.name), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, _fmtSize(f.size)), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => remove(i),
      "aria-label": `${f.name} \uC81C\uAC70`,
      style: { background: "none", border: "none", color: "var(--danger)", fontSize: 14, cursor: "pointer", padding: "2px 6px" }
    },
    "\u2715"
  )))) : /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: { aspectRatio: "8/1", fontSize: 10 } }, "PDF \xB7 DOCX \xB7 \uC774\uBBF8\uC9C0 \uC678 \uC790\uB8CC\uB97C \uCCA8\uBD80 (\uAC8C\uC2DC\uAE00 \uBCF8\uBB38 \uD558\uB2E8\uC5D0 \uB2E4\uC6B4\uB85C\uB4DC \uB9C1\uD06C\uB85C \uD45C\uC2DC)"));
};
const MAX_VISIBLE_DEPTH = 3;
const renderCommentText = (text) => {
  if (!text) return null;
  const parts = String(text).split(/(@[\p{L}\p{N}_]+)/gu);
  return parts.map((part, i) => {
    if (part.startsWith("@") && part.length > 1) {
      return /* @__PURE__ */ React.createElement("span", { key: i, className: "gold", style: { fontWeight: 500 } }, part);
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, part);
  });
};
const CommentTree = ({ comments, user, onDelete, onReply }) => {
  const topLevel = (comments || []).filter((c) => !c.parentId);
  const repliesOf = (parentId) => (comments || []).filter((c) => c.parentId === parentId);
  const [openReplyTo, setOpenReplyTo] = React.useState(null);
  const [draft, setDraft] = React.useState("");
  const allAuthors = React.useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    return (comments || []).map((c) => c.author).filter((n) => n && !seen.has(n) && (seen.add(n) || true));
  }, [comments]);
  const submitReply = (parentId) => {
    onReply == null ? void 0 : onReply(parentId, draft);
    setDraft("");
    setOpenReplyTo(null);
  };
  const [expanded, setExpanded] = React.useState({});
  const renderItem = (c, depth = 0) => {
    const children = repliesOf(c.id);
    const canReply = !!user;
    const visualDepth = Math.min(depth, MAX_VISIBLE_DEPTH);
    const isDeepCollapsed = depth >= MAX_VISIBLE_DEPTH && !expanded[c.id] && children.length > 0;
    return /* @__PURE__ */ React.createElement("li", { key: c.id, style: { padding: "18px 0", borderBottom: depth === 0 ? "1px solid var(--line)" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" } }, depth > 0 && /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11 } }, "\u21B3"), /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 12, letterSpacing: "0.1em", display: "inline-flex", alignItems: "center" } }, c.author, /* @__PURE__ */ React.createElement(AuthorGradeBadge, { authorId: c.authorId, author: c.author, authorEmail: c.authorEmail })), /* @__PURE__ */ React.createElement("time", { className: "mono dim-2", style: { fontSize: 11 } }, c.date)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, canReply && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-ghost",
        onClick: () => {
          setOpenReplyTo(openReplyTo === c.id ? null : c.id);
          setDraft(openReplyTo === c.id ? "" : `@${c.author} `);
        },
        style: { fontSize: 11, color: "var(--ink-2)" }
      },
      openReplyTo === c.id ? "\uCDE8\uC18C" : "\uB2F5\uAE00"
    ), !!user && (user.isAdmin || c.authorId === user.id || c.author === user.name) && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-ghost",
        onClick: () => onDelete == null ? void 0 : onDelete(c.id),
        style: { fontSize: 11, color: "var(--danger)" }
      },
      "\uC0AD\uC81C"
    ))), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-reading)", fontSize: depth > 0 ? 14 : 15, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-wrap" } }, renderCommentText(c.text)), openReplyTo === c.id && /* @__PURE__ */ React.createElement(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          submitReply(c.id);
        },
        style: { marginTop: 10, paddingLeft: 24, borderLeft: "2px solid var(--gold-dim)" }
      },
      /* @__PURE__ */ React.createElement(
        MentionTextarea,
        {
          value: draft,
          onChange: setDraft,
          authors: allAuthors,
          rows: 2,
          placeholder: `@${c.author}\uC5D0\uAC8C \uB2F5\uAE00... (@\uB97C \uC785\uB825\uD558\uBA74 \uBA58\uC158 \uC790\uB3D9\uC644\uC131)`,
          style: { marginBottom: 8 }
        }
      ),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => {
        setOpenReplyTo(null);
        setDraft("");
      } }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small", disabled: !draft.trim() }, "\uB2F5\uAE00 \uB4F1\uB85D"))
    ), children.length > 0 && (isDeepCollapsed ? /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-ghost",
        onClick: () => setExpanded((s) => ({ ...s, [c.id]: true })),
        style: {
          marginTop: 10,
          marginLeft: 24,
          fontSize: 11,
          color: "var(--ink-3)",
          padding: "4px 10px",
          border: "1px dashed var(--line)"
        }
      },
      "\u21B3 \uB2F5\uAE00 ",
      children.length,
      "\uAC1C \uD3BC\uCE58\uAE30"
    ) : /* @__PURE__ */ React.createElement("ol", { style: {
      listStyle: "none",
      padding: 0,
      margin: depth < MAX_VISIBLE_DEPTH ? "12px 0 0 24px" : "12px 0 0 12px",
      borderLeft: "2px solid var(--line)",
      paddingLeft: 14
    } }, children.map((r) => renderItem(r, depth + 1)), depth >= MAX_VISIBLE_DEPTH && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-ghost",
        onClick: () => setExpanded((s) => ({ ...s, [c.id]: false })),
        style: { fontSize: 11, color: "var(--ink-3)", padding: "4px 10px" }
      },
      "\u2191 \uB2F5\uAE00 \uC811\uAE30"
    )))));
  };
  return /* @__PURE__ */ React.createElement("ol", { style: { listStyle: "none", padding: 0, margin: 0 } }, topLevel.map((c) => renderItem(c, 0)));
};
const MentionTextarea = ({ value, onChange, authors, rows = 4, placeholder, style }) => {
  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [active, setActive] = React.useState(0);
  const candidates = React.useMemo(() => {
    if (!open) return [];
    const q = token.toLowerCase();
    return (authors || []).filter((a) => !q || a.toLowerCase().includes(q)).slice(0, 6);
  }, [authors, token, open]);
  const detectMention = (text, caret) => {
    const upto = text.slice(0, caret);
    const m = /@([\p{L}\p{N}_]*)$/u.exec(upto);
    if (m) {
      setToken(m[1]);
      setOpen(true);
      setActive(0);
    } else {
      setOpen(false);
      setToken("");
    }
  };
  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    detectMention(v, e.target.selectionStart || v.length);
  };
  const insertCandidate = (name) => {
    var _a;
    const el = ref.current;
    const caret = (_a = el == null ? void 0 : el.selectionStart) != null ? _a : value.length;
    const before = value.slice(0, caret);
    const after = value.slice(caret);
    const replaced = before.replace(/@([\p{L}\p{N}_]*)$/u, `@${name} `);
    const next = replaced + after;
    onChange(next);
    setOpen(false);
    setToken("");
    setTimeout(() => {
      try {
        const pos = replaced.length;
        el == null ? void 0 : el.focus();
        el == null ? void 0 : el.setSelectionRange(pos, pos);
      } catch (e) {
      }
    }, 0);
  };
  const handleKeyDown = (e) => {
    if (!open || candidates.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % candidates.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + candidates.length) % candidates.length);
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      insertCandidate(candidates[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      ref,
      className: "field-input",
      rows,
      value,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      placeholder,
      style
    }
  ), open && candidates.length > 0 && /* @__PURE__ */ React.createElement(
    "ul",
    {
      role: "listbox",
      "aria-label": "\uBA58\uC158 \uD6C4\uBCF4",
      style: {
        position: "absolute",
        zIndex: 50,
        top: "100%",
        left: 0,
        marginTop: 2,
        background: "var(--bg)",
        border: "1px solid var(--line)",
        listStyle: "none",
        padding: 4,
        minWidth: 180,
        maxWidth: 280,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }
    },
    candidates.map((name, i) => /* @__PURE__ */ React.createElement(
      "li",
      {
        key: name,
        role: "option",
        "aria-selected": i === active,
        onMouseDown: (e) => {
          e.preventDefault();
          insertCandidate(name);
        },
        style: {
          padding: "6px 10px",
          fontSize: 13,
          cursor: "pointer",
          background: i === active ? "rgba(245,213,72,0.12)" : "transparent",
          color: i === active ? "var(--gold)" : "var(--ink)"
        }
      },
      "@",
      name
    ))
  ));
};
const POSTS_PER_PAGE = 10;
const CommunityPage = ({ go, postId, setPostId, user }) => {
  const userLevel = useUserLevel(user);
  const categories = React.useMemo(() => getCategoriesForBoard("community"), [postId]);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [tab, setTab] = React.useState("all");
  const [activePrefix, setActivePrefix] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("latest");
  const [writing, setWriting] = React.useState(null);
  const [page, setPage] = React.useState(1);
  React.useEffect(() => {
    let pending = null;
    try {
      pending = sessionStorage.getItem("bgnj_pending_post_id");
    } catch (e) {
    }
    if (pending) {
      try {
        sessionStorage.removeItem("bgnj_pending_post_id");
      } catch (e) {
      }
      setPostId(pending);
    }
    let pendingBoard = null;
    try {
      pendingBoard = sessionStorage.getItem("bgnj_pending_board_id");
    } catch (e) {
    }
    if (pendingBoard) {
      try {
        sessionStorage.removeItem("bgnj_pending_board_id");
      } catch (e) {
      }
      setTab(pendingBoard);
    }
  }, []);
  React.useEffect(() => {
    var _a, _b;
    (_b = (_a = window.BGNJ_COMMUNITY).refreshPosts) == null ? void 0 : _b.call(_a);
    const onRefresh = () => setRefreshKey((v) => v + 1);
    window.addEventListener("bgnj-posts-refresh", onRefresh);
    return () => window.removeEventListener("bgnj-posts-refresh", onRefresh);
  }, []);
  const G = window.BGNJ_GUARD;
  const allPosts = React.useMemo(() => G.arr(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a.listPosts) == null ? void 0 : _b.call(_a);
  }), [refreshKey]);
  const visibleCats = categories.filter((c) => {
    var _a;
    return userLevel >= ((_a = c.minLevel) != null ? _a : 0);
  });
  const currentBoard = categories.find((c) => c.id === tab);
  const boardPrefixes = (currentBoard == null ? void 0 : currentBoard.prefixes) || [];
  const canReadPost = React.useCallback((post) => {
    var _a;
    if (!post) return false;
    const cat = categories.find((c) => c.id === post.categoryId) || categories.find((c) => c.label === post.category);
    return !cat || userLevel >= ((_a = cat.minLevel) != null ? _a : 0);
  }, [categories, userLevel]);
  React.useEffect(() => {
    setActivePrefix("");
  }, [tab]);
  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    const base = allPosts.filter((p) => {
      var _a, _b;
      const cat = categories.find((c) => c.id === p.categoryId) || categories.find((c) => c.label === p.category);
      if (cat && userLevel < ((_a = cat.minLevel) != null ? _a : 0)) return false;
      if (tab !== "all" && (p.categoryId !== tab && (cat == null ? void 0 : cat.id) !== tab)) return false;
      if (q && !p.title.toLowerCase().includes(q) && !String(((_b = p.body) == null ? void 0 : _b.text) || "").toLowerCase().includes(q)) return false;
      if (activePrefix && p.prefix !== activePrefix) return false;
      return true;
    });
    if (sort === "views") return [...base].sort((a, b) => {
      var _a, _b;
      return ((_a = b.views) != null ? _a : 0) - ((_b = a.views) != null ? _b : 0);
    });
    if (sort === "replies") return [...base].sort((a, b) => {
      var _a, _b;
      return ((_a = b.replies) != null ? _a : 0) - ((_b = a.replies) != null ? _b : 0);
    });
    if (sort === "likes") return [...base].sort((a, b) => (Array.isArray(b.likes) ? b.likes.length : 0) - (Array.isArray(a.likes) ? a.likes.length : 0));
    return base;
  }, [allPosts, categories, userLevel, tab, search, sort, activePrefix]);
  React.useEffect(() => {
    setPage(1);
  }, [tab, search, sort, activePrefix]);
  const PostComposeModal = ({ onClose }) => {
    var _a;
    const guard = ((_a = window.useModalGuard) == null ? void 0 : _a.call(window, { open: true, dirty: true, onClose, onSaveDraft: null, label: "\uAC8C\uC2DC\uAE00" })) || {};
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": writing === true ? "\uC0C8 \uAE00 \uC791\uC131" : "\uAC8C\uC2DC\uAE00 \uC218\uC815",
        onClick: guard.onBackdropClick,
        style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1e3, display: "grid", placeItems: "start center", padding: 24, overflowY: "auto" }
      },
      /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: {
        width: "min(1100px, 100%)",
        background: "var(--bg)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
        padding: 24,
        marginTop: 24,
        marginBottom: 48
      } }, /* @__PURE__ */ React.createElement(
        PostCompose,
        {
          key: writing === true ? "new" : String(writing.id),
          user,
          initialPost: writing === true ? null : writing,
          onCancel: onClose,
          onPublish: async (payload) => {
            let savedPost;
            try {
              savedPost = writing === true ? await window.BGNJ_COMMUNITY.createPostRemote(payload) : await window.BGNJ_COMMUNITY.updatePostRemote(writing.id, payload);
            } catch (err) {
              savedPost = writing === true ? window.BGNJ_COMMUNITY.createPost(payload) : window.BGNJ_COMMUNITY.updatePost(writing.id, payload);
            }
            onClose();
            setRefreshKey((value) => value + 1);
            if (savedPost) setPostId(savedPost.id);
          },
          categories,
          userLevel
        }
      ))
    );
  };
  if (postId) {
    const post = allPosts.find((p) => String(p.id) === String(postId)) || null;
    if (!post) {
      return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 760, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, marginBottom: 16 } }, "\uD574\uB2F9 \uAC8C\uC2DC\uAE00\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: () => setPostId(null) }, "\uBAA9\uB85D\uC73C\uB85C")));
    }
    if (!canReadPost(post)) {
      return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 760, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, marginBottom: 16 } }, "\uD604\uC7AC \uB4F1\uAE09\uC73C\uB85C\uB294 \uC774 \uAC8C\uC2DC\uAE00\uC744 \uBCFC \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: () => setPostId(null) }, "\uBAA9\uB85D\uC73C\uB85C")));
    }
    return /* @__PURE__ */ React.createElement(
      PostDetail,
      {
        post,
        go,
        setPostId,
        user,
        onRefresh: () => setRefreshKey((value) => value + 1),
        onEdit: (nextPost) => setWriting(nextPost)
      }
    );
  }
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(pageStart, pageStart + POSTS_PER_PAGE);
  const handleWrite = () => {
    if (!user) {
      if (confirm("\uAE00\uC4F0\uAE30\uB294 \uB85C\uADF8\uC778 \uD6C4 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9\uD558\uC2DC\uACA0\uC5B4\uC694?")) {
        go("login");
      }
      return;
    }
    const writable = categories.filter((c) => {
      var _a, _b;
      return userLevel >= ((_b = (_a = c.postMinLevel) != null ? _a : c.minLevel) != null ? _b : 0);
    });
    if (writable.length === 0) {
      alert("\uD604\uC7AC \uB4F1\uAE09\uC73C\uB85C\uB294 \uAE00\uC744 \uC791\uC131\uD560 \uC218 \uC788\uB294 \uAC8C\uC2DC\uD310\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return;
    }
    setWriting(true);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("header", { style: { marginBottom: 24 } }, (() => {
    var _a, _b, _c, _d;
    const _i = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).communityIntro || {};
    const eb = _i.eyebrow || "COMMUNITY \xB7 \uCEE4\uBBA4\uB2C8\uD2F0";
    const tp = (_c = _i.titlePrefix) != null ? _c : "\uB2E4\uC12F \uBD09\uC6B0\uB9AC ";
    const ta = (_d = _i.titleAccent) != null ? _d : "\uAD11\uC7A5";
    const sb = _i.subtitle || "\uBC45\uAE30\uB178\uC790\uC774 \uBAA8\uC5EC \uB098\uB204\uB294 \uC774\uC57C\uAE30. \uC9C8\uBB38\uB3C4 \uB2F5\uB3C4 \uD658\uC601\uD569\uB2C8\uB2E4.";
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, eb), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, tp, /* @__PURE__ */ React.createElement("span", { className: "accent" }, ta)), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, sb));
  })()), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 24, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "tablist",
      "aria-label": "\uAC8C\uC2DC\uD310 \uBD84\uB958",
      style: { display: "flex", gap: 0, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": tab === "all",
        onClick: () => setTab("all"),
        style: {
          padding: "14px 24px",
          fontSize: 13,
          letterSpacing: "0.1em",
          color: tab === "all" ? "var(--gold)" : "var(--ink-2)",
          borderBottom: tab === "all" ? "1px solid var(--gold)" : "1px solid transparent",
          marginBottom: -1
        }
      },
      "\uC804\uCCB4"
    ),
    visibleCats.map((c) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: c.id,
        type: "button",
        role: "tab",
        "aria-selected": tab === c.id,
        onClick: () => setTab(c.id),
        style: {
          padding: "14px 24px",
          fontSize: 13,
          letterSpacing: "0.1em",
          color: tab === c.id ? "var(--gold)" : "var(--ink-2)",
          borderBottom: tab === c.id ? "1px solid var(--gold)" : "1px solid transparent",
          marginBottom: -1
        }
      },
      c.label
    ))
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "community-search", className: "sr-only" }, "\uAC8C\uC2DC\uAE00 \uAC80\uC0C9"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "community-search",
      placeholder: tab === "all" ? "\uC804\uCCB4 \uAC8C\uC2DC\uD310 \uAC80\uC0C9..." : `${(currentBoard == null ? void 0 : currentBoard.label) || ""} \uAC8C\uC2DC\uD310 \uAC80\uC0C9...`,
      value: search,
      onChange: (e) => setSearch(e.target.value),
      className: "field-input",
      style: { width: 200, padding: "10px 14px" }
    }
  ), /* @__PURE__ */ React.createElement("label", { htmlFor: "community-sort", className: "sr-only" }, "\uC815\uB82C"), /* @__PURE__ */ React.createElement(
    "select",
    {
      id: "community-sort",
      value: sort,
      onChange: (e) => setSort(e.target.value),
      className: "field-input",
      style: { padding: "10px 12px", fontSize: 12, cursor: "pointer" }
    },
    /* @__PURE__ */ React.createElement("option", { value: "latest" }, "\uCD5C\uC2E0\uC21C"),
    /* @__PURE__ */ React.createElement("option", { value: "views" }, "\uC870\uD68C\uC21C"),
    /* @__PURE__ */ React.createElement("option", { value: "replies" }, "\uB313\uAE00\uC21C"),
    /* @__PURE__ */ React.createElement("option", { value: "likes" }, "\uC88B\uC544\uC694\uC21C")
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: handleWrite }, user ? "\uAE00\uC4F0\uAE30 \uFF0B" : "\uB85C\uADF8\uC778 \uD6C4 \uAE00\uC4F0\uAE30"))), tab !== "all" && (currentBoard == null ? void 0 : currentBoard.desc) && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "10px 16px",
    marginBottom: 16,
    background: "var(--bg-2)",
    borderLeft: "3px solid var(--gold)",
    fontSize: 13,
    color: "var(--ink-2)",
    lineHeight: 1.6
  } }, currentBoard.desc), boardPrefixes.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setActivePrefix(""),
      style: {
        padding: "4px 16px",
        border: "1px solid",
        borderColor: activePrefix === "" ? "var(--gold)" : "var(--line-2)",
        color: activePrefix === "" ? "var(--gold)" : "var(--ink-2)",
        background: activePrefix === "" ? "rgba(158,104,24,0.06)" : "none",
        cursor: "pointer",
        fontSize: 13,
        letterSpacing: "0.05em"
      }
    },
    "\uC804\uCCB4"
  ), boardPrefixes.map((p) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: p,
      type: "button",
      onClick: () => setActivePrefix(activePrefix === p ? "" : p),
      style: {
        padding: "4px 16px",
        border: "1px solid",
        borderColor: activePrefix === p ? "var(--gold)" : "var(--line-2)",
        color: activePrefix === p ? "var(--gold)" : "var(--ink-2)",
        background: activePrefix === p ? "rgba(158,104,24,0.06)" : "none",
        cursor: "pointer",
        fontSize: 13,
        letterSpacing: "0.05em"
      }
    },
    p
  ))), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } }, /* @__PURE__ */ React.createElement("caption", { className: "sr-only" }, "\uAC8C\uC2DC\uAE00 \uBAA9\uB85D"), /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-3)", textTransform: "uppercase" } }, /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "16px 8px", textAlign: "left", borderTop: "1px solid var(--line-2)", borderBottom: "1px solid var(--line)", width: 60 } }, "\uBC88\uD638"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "16px 8px", textAlign: "left", borderTop: "1px solid var(--line-2)", borderBottom: "1px solid var(--line)", width: 90 } }, "\uBD84\uB958"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "16px 8px", textAlign: "left", borderTop: "1px solid var(--line-2)", borderBottom: "1px solid var(--line)" } }, "\uC81C\uBAA9"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "16px 8px", textAlign: "left", borderTop: "1px solid var(--line-2)", borderBottom: "1px solid var(--line)", width: 120 } }, "\uC791\uC131\uC790"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "16px 8px", textAlign: "right", borderTop: "1px solid var(--line-2)", borderBottom: "1px solid var(--line)", width: 70 } }, "\uC870\uD68C"), /* @__PURE__ */ React.createElement("th", { scope: "col", style: { padding: "16px 8px", textAlign: "right", borderTop: "1px solid var(--line-2)", borderBottom: "1px solid var(--line)", width: 100 } }, "\uB0A0\uC9DC"))), /* @__PURE__ */ React.createElement("tbody", null, filtered.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 6, style: { padding: 48, textAlign: "center" }, className: "dim" }, "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")) : pagePosts.map((p, i) => {
    var _a, _b, _c;
    const cat = categories.find((c) => c.id === p.categoryId) || categories.find((c) => c.label === p.category) || { label: p.category };
    const likesCount = Array.isArray(p.likes) ? p.likes.length : 0;
    const bookmarked = user && G.call(() => {
      var _a2, _b2;
      return (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.isBookmarked) == null ? void 0 : _b2.call(_a2, user.id, p.id);
    }, false);
    return /* @__PURE__ */ React.createElement(
      "tr",
      {
        key: p.id,
        style: { borderBottom: "1px solid var(--line)", transition: "background .2s" },
        onMouseEnter: (e) => e.currentTarget.style.background = "rgba(245,213,72,0.03)",
        onMouseLeave: (e) => e.currentTarget.style.background = "transparent"
      },
      /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: "18px 8px", fontSize: 12 } }, String(filtered.length - (pageStart + i)).padStart(3, "0")),
      /* @__PURE__ */ React.createElement("td", { style: { padding: "18px 8px" } }, /* @__PURE__ */ React.createElement("span", { className: "badge" }, cat.label)),
      /* @__PURE__ */ React.createElement("td", { style: { padding: "18px 8px", fontSize: 15 }, className: "row-title" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: () => setPostId(p.id),
          style: { all: "unset", cursor: "pointer", textAlign: "left" }
        },
        bookmarked && /* @__PURE__ */ React.createElement("span", { className: "gold", style: { marginRight: 6, fontSize: 11 }, "aria-label": "\uBD81\uB9C8\uD06C" }, "\u2605"),
        p.title,
        ((_a = p.images) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { marginLeft: 8, fontSize: 10 }, "aria-label": "\uC774\uBBF8\uC9C0 \uCCA8\uBD80" }, "\u{1F4F7}", p.images.length),
        likesCount > 0 && /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { marginLeft: 8, fontSize: 10 }, "aria-label": "\uACF5\uAC10 \uC218" }, "\u2665", likesCount),
        ((_b = p.tags) == null ? void 0 : _b.length) > 0 && /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { marginLeft: 8, fontSize: 10 } }, p.tags.slice(0, 3).map((t) => `#${t}`).join(" ")),
        p.hot && /* @__PURE__ */ React.createElement("span", { className: "gold", style: { marginLeft: 8, fontSize: 10 } }, "HOT"),
        p._new && /* @__PURE__ */ React.createElement("span", { className: "gold", style: { marginLeft: 8, fontSize: 10 } }, "NEW")
      )),
      /* @__PURE__ */ React.createElement("td", { className: "mono dim", style: { padding: "18px 8px", fontSize: 12 } }, p.author, /* @__PURE__ */ React.createElement(AuthorGradeBadge, { authorId: p.authorId, author: p.author, authorEmail: p.authorEmail })),
      /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: "18px 8px", fontSize: 12, textAlign: "right" } }, (_c = p.views) != null ? _c : 0),
      /* @__PURE__ */ React.createElement("td", { className: "mono dim-2", style: { padding: "18px 8px", fontSize: 11, textAlign: "right" } }, /* @__PURE__ */ React.createElement("time", { dateTime: p.date.replace(/\./g, "-") }, p.date))
    );
  }))), filtered.length > 0 && totalPages > 1 && /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uAC8C\uC2DC\uAE00 \uD398\uC774\uC9C0 \uC774\uB3D9", style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 32, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setPage(Math.max(1, safePage - 1)),
      disabled: safePage <= 1
    },
    "\u2190 \uC774\uC804"
  ), Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: n,
      type: "button",
      className: "btn btn-small",
      "aria-current": n === safePage ? "page" : void 0,
      onClick: () => setPage(n),
      style: {
        borderColor: n === safePage ? "var(--gold)" : "var(--line)",
        color: n === safePage ? "var(--gold)" : "var(--ink-2)",
        background: n === safePage ? "rgba(245,213,72,0.08)" : "transparent",
        minWidth: 36
      }
    },
    n
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => setPage(Math.min(totalPages, safePage + 1)),
      disabled: safePage >= totalPages
    },
    "\uB2E4\uC74C \u2192"
  )), filtered.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { textAlign: "center", fontSize: 10, letterSpacing: "0.2em", marginTop: 12 } }, "\uC804\uCCB4 ", filtered.length, "\uAC74 \xB7 ", safePage, "/", totalPages, " \uD398\uC774\uC9C0"), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingTop: 24,
    borderTop: "1px solid var(--line)",
    flexWrap: "wrap"
  } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "community-search-bottom", className: "sr-only" }, "\uAC8C\uC2DC\uAE00 \uAC80\uC0C9"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "community-search-bottom",
      placeholder: tab === "all" ? "\uC804\uCCB4 \uAC8C\uC2DC\uD310 \uAC80\uC0C9..." : `${(currentBoard == null ? void 0 : currentBoard.label) || ""} \uAC8C\uC2DC\uD310 \uAC80\uC0C9...`,
      value: search,
      onChange: (e) => setSearch(e.target.value),
      className: "field-input",
      style: { width: 280, padding: "12px 16px", fontSize: 14 }
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-gold",
      onClick: handleWrite,
      style: { padding: "12px 28px", fontSize: 13 }
    },
    user ? "\uAE00\uC4F0\uAE30 \uFF0B" : "\uB85C\uADF8\uC778 \uD6C4 \uAE00\uC4F0\uAE30"
  ))), writing && /* @__PURE__ */ React.createElement(PostComposeModal, { onClose: () => setWriting(null) }));
};
const draftKeyFor = (userId) => `bgnj_post_draft_${userId || "guest"}`;
const PostCompose = ({ user, initialPost, onCancel, onPublish, categories, userLevel }) => {
  var _a, _b, _c, _d;
  const writable = categories.filter((c) => {
    var _a2, _b2;
    return userLevel >= ((_b2 = (_a2 = c.postMinLevel) != null ? _a2 : c.minLevel) != null ? _b2 : 0);
  });
  const defaultCategoryId = (initialPost == null ? void 0 : initialPost.categoryId) || ((_a = writable[0]) == null ? void 0 : _a.id) || ((_b = categories[0]) == null ? void 0 : _b.id) || "";
  const isEditing = !!initialPost;
  const draftKey = draftKeyFor(user == null ? void 0 : user.id);
  const initialDraft = React.useMemo(() => {
    if (isEditing) return null;
    try {
      const raw = localStorage.getItem(draftKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }, [draftKey, isEditing]);
  const [categoryId, setCategoryId] = React.useState((initialDraft == null ? void 0 : initialDraft.categoryId) || defaultCategoryId);
  const [title, setTitle] = React.useState((initialPost == null ? void 0 : initialPost.title) || (initialDraft == null ? void 0 : initialDraft.title) || "");
  const [prefix, setPrefix] = React.useState((initialPost == null ? void 0 : initialPost.prefix) || (initialDraft == null ? void 0 : initialDraft.prefix) || "");
  const [tags, setTags] = React.useState((initialPost == null ? void 0 : initialPost.tags) || (initialDraft == null ? void 0 : initialDraft.tags) || []);
  const [images, setImages] = React.useState((initialPost == null ? void 0 : initialPost.images) || (initialDraft == null ? void 0 : initialDraft.images) || []);
  const [attachments, setAttachments] = React.useState((initialPost == null ? void 0 : initialPost.attachments) || (initialDraft == null ? void 0 : initialDraft.attachments) || []);
  const [bodyHtml, setBodyHtml] = React.useState(((_c = initialPost == null ? void 0 : initialPost.body) == null ? void 0 : _c.html) || (initialDraft == null ? void 0 : initialDraft.bodyHtml) || "");
  const [bodyText, setBodyText] = React.useState(((_d = initialPost == null ? void 0 : initialPost.body) == null ? void 0 : _d.text) || (initialDraft == null ? void 0 : initialDraft.bodyText) || "");
  const _toLocalInput = (iso) => {
    var _a2, _b2;
    if (!iso) return "";
    try {
      const parts = (_b2 = (_a2 = window.BGNJ_FMT) == null ? void 0 : _a2.kstDateTime) == null ? void 0 : _b2.call(_a2, iso);
      if (parts) return parts.replace(" KST", "").replace(" ", "T").slice(0, 16);
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch (e) {
      return "";
    }
  };
  const [createdAt, setCreatedAt] = React.useState(_toLocalInput((initialPost == null ? void 0 : initialPost.createdAt) || (initialPost == null ? void 0 : initialPost.created_at) || ""));
  const [error, setError] = React.useState("");
  const [draftRestored, setDraftRestored] = React.useState(!!(initialDraft && (initialDraft.title || initialDraft.bodyText)));
  const [savedAt, setSavedAt] = React.useState((initialDraft == null ? void 0 : initialDraft.savedAt) || null);
  const prevCategoryIdRef = React.useRef(categoryId);
  React.useEffect(() => {
    if (isEditing) return;
    const hasContent = !!(title.trim() || bodyText.trim() || tags && tags.length || images && images.length || attachments && attachments.length);
    const t = setTimeout(() => {
      try {
        if (hasContent) {
          const snapshot = { categoryId, title, prefix, tags, images, attachments, bodyHtml, bodyText, savedAt: (/* @__PURE__ */ new Date()).toISOString() };
          localStorage.setItem(draftKey, JSON.stringify(snapshot));
          setSavedAt(snapshot.savedAt);
        } else {
          localStorage.removeItem(draftKey);
          setSavedAt(null);
        }
      } catch (e) {
      }
    }, 800);
    return () => clearTimeout(t);
  }, [draftKey, isEditing, categoryId, title, prefix, tags, images, attachments, bodyHtml, bodyText]);
  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch (e) {
    }
    setSavedAt(null);
    setDraftRestored(false);
  };
  React.useEffect(() => {
    var _a2, _b2;
    setCategoryId((initialPost == null ? void 0 : initialPost.categoryId) || defaultCategoryId);
    setTitle((initialPost == null ? void 0 : initialPost.title) || "");
    setPrefix((initialPost == null ? void 0 : initialPost.prefix) || "");
    setTags((initialPost == null ? void 0 : initialPost.tags) || []);
    setImages((initialPost == null ? void 0 : initialPost.images) || []);
    setAttachments((initialPost == null ? void 0 : initialPost.attachments) || []);
    setBodyHtml(((_a2 = initialPost == null ? void 0 : initialPost.body) == null ? void 0 : _a2.html) || "");
    setBodyText(((_b2 = initialPost == null ? void 0 : initialPost.body) == null ? void 0 : _b2.text) || "");
    setError("");
    prevCategoryIdRef.current = (initialPost == null ? void 0 : initialPost.categoryId) || defaultCategoryId;
  }, [initialPost, defaultCategoryId]);
  const selectedCat = categories.find((c) => c.id === categoryId);
  const boardPrefixes = (selectedCat == null ? void 0 : selectedCat.prefixes) || [];
  React.useEffect(() => {
    if (prevCategoryIdRef.current === categoryId) return;
    prevCategoryIdRef.current = categoryId;
    if (!isEditing || categoryId !== ((initialPost == null ? void 0 : initialPost.categoryId) || "")) {
      setPrefix("");
    }
  }, [categoryId, initialPost, isEditing]);
  const submit = () => {
    var _a2, _b2;
    setError("");
    if (!title.trim()) return setError("\uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
    if (!bodyText.trim()) return setError("\uBCF8\uBB38\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
    const cat = categories.find((c) => c.id === categoryId);
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    if (!isEditing) {
      try {
        localStorage.removeItem(draftKey);
      } catch (e) {
      }
    }
    const payload = {
      categoryId: cat.id,
      category: cat.label,
      prefix: prefix || "",
      title: title.trim(),
      author: (user == null ? void 0 : user.name) || "\uC775\uBA85",
      authorId: (user == null ? void 0 : user.id) || null,
      authorEmail: (user == null ? void 0 : user.email) || null,
      replies: (_a2 = initialPost == null ? void 0 : initialPost.replies) != null ? _a2 : 0,
      views: (_b2 = initialPost == null ? void 0 : initialPost.views) != null ? _b2 : 0,
      date: `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`,
      tags,
      images,
      attachments,
      _new: true,
      _userCreated: true,
      body: { html: bodyHtml, text: bodyText }
    };
    if ((user == null ? void 0 : user.isAdmin) && createdAt) {
      payload.createdAt = `${createdAt}:00+09:00`;
    }
    onPublish(payload);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 960 } }, /* @__PURE__ */ React.createElement("header", { style: { marginBottom: 32 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, "COMPOSE \xB7 \uAE00\uC4F0\uAE30"), /* @__PURE__ */ React.createElement("h1", { className: "section-title", style: { fontSize: 36 } }, isEditing ? "\uAC8C\uC2DC\uAE00 \uC218\uC815" : "\uC0C8 \uAE00 \uC791\uC131"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginTop: 8 } }, "\uC791\uC131\uC790: ", /* @__PURE__ */ React.createElement("span", { className: "gold" }, (user == null ? void 0 : user.name) || "\uC775\uBA85"), !isEditing && savedAt && /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { marginLeft: 14, fontSize: 11 } }, "\xB7 \uC784\uC2DC\uC800\uC7A5\uB428 (", new Date(savedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), ")")), !isEditing && draftRestored && /* @__PURE__ */ React.createElement("div", { role: "status", style: {
    marginTop: 14,
    padding: "10px 14px",
    background: "rgba(245,213,72,0.06)",
    border: "1px solid var(--gold-dim)",
    fontSize: 12,
    color: "var(--ink-2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  } }, /* @__PURE__ */ React.createElement("span", null, "\uC774\uC804\uC5D0 \uC791\uC131\uD558\uB358 \uAE00\uC744 \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn-ghost",
      onClick: () => {
        if (confirm("\uC784\uC2DC\uC800\uC7A5\uB41C \uAE00\uC744 \uC0AD\uC81C\uD558\uACE0 \uC0C8\uB85C \uC2DC\uC791\uD558\uC2DC\uACA0\uC5B4\uC694?")) {
          setTitle("");
          setPrefix("");
          setTags([]);
          setImages([]);
          setBodyHtml("");
          setBodyText("");
          clearDraft();
        }
      },
      style: { fontSize: 11, color: "var(--danger)", textDecoration: "underline" }
    },
    "\uC0C8\uB85C \uC2DC\uC791"
  ))), /* @__PURE__ */ React.createElement("form", { onSubmit: (e) => {
    e.preventDefault();
    submit();
  }, noValidate: true }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, marginBottom: boardPrefixes.length > 0 ? 12 : 20 } }, /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "post-cat" }, "\uAC8C\uC2DC\uD310"), /* @__PURE__ */ React.createElement(
    "select",
    {
      id: "post-cat",
      className: "field-input",
      value: categoryId,
      onChange: (e) => setCategoryId(e.target.value)
    },
    writable.map((c) => /* @__PURE__ */ React.createElement("option", { key: c.id, value: c.id }, c.label))
  )), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "post-title" }, "\uC81C\uBAA9 ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "post-title",
      className: "field-input",
      placeholder: "\uC81C\uBAA9\uC744 \uC785\uB825\uD558\uC138\uC694",
      value: title,
      onChange: (e) => setTitle(e.target.value),
      required: true,
      maxLength: 120
    }
  ))), boardPrefixes.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { className: "field-label" }, "\uB9D0\uBA38\uB9AC"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setPrefix(""),
      style: { padding: "4px 14px", border: "1px solid", borderColor: prefix === "" ? "var(--gold)" : "var(--line)", color: prefix === "" ? "var(--gold)" : "var(--ink-2)", background: "none", cursor: "pointer", fontSize: 13, letterSpacing: "0.05em" }
    },
    "\uC5C6\uC74C"
  ), boardPrefixes.map((p) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: p,
      type: "button",
      onClick: () => setPrefix(p),
      style: { padding: "4px 14px", border: "1px solid", borderColor: prefix === p ? "var(--gold)" : "var(--line)", color: prefix === p ? "var(--gold)" : "var(--ink-2)", background: prefix === p ? "rgba(245,213,72,0.08)" : "none", cursor: "pointer", fontSize: 13, letterSpacing: "0.05em" }
    },
    p
  )))), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("div", { className: "field-label" }, "\uD574\uC2DC\uD0DC\uADF8 / \uBA54\uD0C0\uD0DC\uADF8"), /* @__PURE__ */ React.createElement(HashtagInput, { tags, setTags })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("div", { className: "field-label" }, "\uBCF8\uBB38 ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement(
    TiptapEditor,
    {
      key: (initialPost == null ? void 0 : initialPost.id) || "new",
      preset: "simple",
      content: bodyHtml,
      onUpdate: (html, _json, text) => {
        setBodyHtml(html);
        setBodyText(text);
      },
      placeholder: "\uBCF8\uBB38\uC744 \uC785\uB825\uD558\uC138\uC694..."
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement(ImageAttacher, { images, setImages, max: 10 })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement(FileAttacher, { files: attachments, setFiles: setAttachments })), (user == null ? void 0 : user.isAdmin) && /* @__PURE__ */ React.createElement("div", { className: "field", style: { padding: "12px 14px", background: "rgba(245,213,72,0.04)", border: "1px dashed var(--gold-dim)", marginTop: 12 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "post-created-at", style: { display: "block", marginBottom: 6 } }, "\uC5C5\uB85C\uB4DC \uC2DC\uAC04 (\uAD00\uB9AC\uC790 \uC804\uC6A9 \xB7 \uBE44\uC6CC\uB450\uBA74 \uD604\uC7AC \uC2DC\uAC04)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "post-created-at",
      type: "datetime-local",
      className: "field-input",
      value: createdAt,
      onChange: (e) => setCreatedAt(e.target.value),
      style: { maxWidth: 280 }
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11, marginTop: 4 } }, "KST \uAE30\uC900. \uC785\uB825 \uC2DC \uAC8C\uC2DC\uAE00 \uD45C\uC2DC \uC2DC\uAC01\uC774 \uC774 \uAC12\uC73C\uB85C \uACE0\uC815\uB428.")), error && /* @__PURE__ */ React.createElement("div", { role: "alert", style: { padding: "12px 16px", background: "rgba(194,74,61,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: 13, marginBottom: 16 } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 20, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: onCancel }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold" }, isEditing ? "\uC218\uC815 \uC800\uC7A5 \u2192" : "\uAC8C\uC2DC\uD558\uAE30 \u2192")))));
};
const PostDetail = ({ post, go, setPostId, user, onRefresh, onEdit }) => {
  var _a, _b, _c, _d, _e;
  const G = window.BGNJ_GUARD;
  const [comment, setComment] = React.useState("");
  const [commentsList, setCommentsList] = React.useState(() => G.arr(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.getComments) == null ? void 0 : _b2.call(_a2, post.id);
  }));
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [reportSubmitted, setReportSubmitted] = React.useState(false);
  const canManagePost = !!user && (user.isAdmin || post.authorId === user.id || post.author === user.name);
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const liked = !!user && likes.includes(user.id);
  const likesCount = likes.length;
  const bookmarked = !!user && G.call(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.isBookmarked) == null ? void 0 : _b2.call(_a2, user.id, post.id);
  }, false);
  React.useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2, _f;
    setCommentsList(G.arr(() => {
      var _a3, _b3;
      return (_b3 = (_a3 = window.BGNJ_COMMUNITY) == null ? void 0 : _a3.getComments) == null ? void 0 : _b3.call(_a3, post.id);
    }));
    if (post._remote) {
      (_f = (_e2 = (_d2 = (_c2 = (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.refreshComments) == null ? void 0 : _b2.call(_a2, post.id)) == null ? void 0 : _c2.then) == null ? void 0 : _d2.call(_c2, () => {
        setCommentsList(G.arr(() => {
          var _a3, _b3;
          return (_b3 = (_a3 = window.BGNJ_COMMUNITY) == null ? void 0 : _a3.getComments) == null ? void 0 : _b3.call(_a3, post.id);
        }));
      })) == null ? void 0 : _e2.catch) == null ? void 0 : _f.call(_e2, () => {
      });
    }
    const onRefreshComments = (e) => {
      if (e.detail && String(e.detail.postId) === String(post.id)) {
        setCommentsList(window.BGNJ_COMMUNITY.getComments(post.id));
      }
    };
    window.addEventListener("bgnj-comments-refresh", onRefreshComments);
    return () => window.removeEventListener("bgnj-comments-refresh", onRefreshComments);
  }, [post.id]);
  React.useEffect(() => {
    const key = `bgnj_viewed_post_${post.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch (e) {
    }
    window.BGNJ_COMMUNITY.incrementViews(post.id);
    onRefresh == null ? void 0 : onRefresh();
  }, [post.id]);
  const requireLogin = (label) => {
    if (confirm(`${label}\uC740(\uB294) \uB85C\uADF8\uC778 \uD6C4 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9\uD558\uC2DC\uACA0\uC5B4\uC694?`)) {
      go("login");
    }
  };
  const handleLike = async () => {
    if (!user) return requireLogin("\uACF5\uAC10");
    try {
      await window.BGNJ_COMMUNITY.toggleLike(post.id, user.id);
      onRefresh == null ? void 0 : onRefresh();
    } catch (err) {
      alert(`\uACF5\uAC10 \uCC98\uB9AC \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
    }
  };
  const handleBookmark = async () => {
    if (!user) return requireLogin("\uBD81\uB9C8\uD06C");
    try {
      await window.BGNJ_COMMUNITY.toggleBookmark(user.id, post.id);
      onRefresh == null ? void 0 : onRefresh();
    } catch (err) {
      alert(`\uBD81\uB9C8\uD06C \uCC98\uB9AC \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
    }
  };
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.BGNJ_COMMUNITY.addReport({
        postId: post.id,
        postTitle: post.title,
        reporterId: (user == null ? void 0 : user.id) || null,
        reporterName: (user == null ? void 0 : user.name) || "\uC775\uBA85",
        reason: reportReason
      });
      setReportSubmitted(true);
      setReportReason("");
      setTimeout(() => {
        setReportOpen(false);
        setReportSubmitted(false);
      }, 1800);
    } catch (err) {
      alert(`\uC2E0\uACE0 \uC811\uC218 \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
    }
  };
  const submitComment = (e) => {
    e.preventDefault();
    if (!user) return;
    const trimmed = comment.trim();
    if (!trimmed) return;
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const next = window.BGNJ_COMMUNITY.addComment(post.id, {
      id: `comment-${Date.now()}`,
      author: user.name,
      authorId: user.id,
      authorEmail: user.email,
      date: `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      text: trimmed
    });
    setCommentsList(next);
    const isMyOwnPost = post.authorId === user.id || post.author === user.name;
    if (!isMyOwnPost && post.authorId) {
      window.BGNJ_COMMUNITY.addNotification(post.authorId, {
        type: "comment",
        postId: post.id,
        postTitle: post.title,
        fromName: user.name,
        message: "\uB0B4 \uAE00\uC5D0 \uC0C8 \uB313\uAE00\uC774 \uB2EC\uB838\uC2B5\uB2C8\uB2E4."
      });
    }
    onRefresh == null ? void 0 : onRefresh();
    setComment("");
  };
  const deletePost = () => {
    if (!confirm(`"${post.title}" \uAE00\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?`)) return;
    window.BGNJ_COMMUNITY.deletePost(post.id);
    onRefresh == null ? void 0 : onRefresh();
    setPostId(null);
  };
  const deleteComment = (commentId) => {
    const next = window.BGNJ_COMMUNITY.deleteComment(post.id, commentId);
    setCommentsList(next);
    onRefresh == null ? void 0 : onRefresh();
  };
  return /* @__PURE__ */ React.createElement("article", { className: "section post-read" }, /* @__PURE__ */ React.createElement("div", { className: "container post-read-container" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn-ghost",
      onClick: () => setPostId(null),
      style: { marginBottom: 32, color: "var(--ink-2)", fontSize: 12, letterSpacing: "0.1em" }
    },
    "\u2190 \uBAA9\uB85D\uC73C\uB85C"
  ), /* @__PURE__ */ React.createElement("header", { style: { borderBottom: "1px solid var(--line-2)", paddingBottom: 32, marginBottom: 48 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "badge badge-gold" }, post.category), post.hot && /* @__PURE__ */ React.createElement("span", { className: "badge" }, "HOT"), post._userCreated && /* @__PURE__ */ React.createElement("span", { className: "badge badge-gold" }, "\uC0C8 \uAE00")), /* @__PURE__ */ React.createElement("h1", { className: "post-title", style: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(28px, 3.5vw, 44px)",
    fontWeight: 500,
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
    marginBottom: 24,
    textWrap: "balance"
  } }, post.title), ((_a = post.tags) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 } }, post.tags.map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "tag-chip" }, "#", t))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "gold", style: { display: "inline-flex", alignItems: "center" } }, post.author, /* @__PURE__ */ React.createElement(AuthorGradeBadge, { authorId: post.authorId, author: post.author, authorEmail: post.authorEmail })), /* @__PURE__ */ React.createElement("time", { dateTime: post.date.replace(/\./g, "-") }, post.date), /* @__PURE__ */ React.createElement("span", null, "\uC870\uD68C ", (_b = post.views) != null ? _b : 0), /* @__PURE__ */ React.createElement("span", null, "\uB313\uAE00 ", commentsList.length), /* @__PURE__ */ React.createElement("span", null, "\uACF5\uAC10 ", likesCount))), ((_c = post.body) == null ? void 0 : _c.html) ? /* @__PURE__ */ React.createElement("div", { className: "post-body", dangerouslySetInnerHTML: { __html: window.BGNJ_SAFE_HTML(post.body.html) } }) : /* @__PURE__ */ React.createElement("div", { className: "post-body" }, /* @__PURE__ */ React.createElement("p", null, "\uC5B4\uC81C \uCC3D\uB355\uAD81 \uD6C4\uC6D0 \uC57C\uAC04 \uB2F5\uC0AC\uB97C \uB2E4\uB140\uC654\uC2B5\uB2C8\uB2E4. \uC6D0\uB798 \uB0AE\uC5D0\uB9CC \uAC00\uBD24\uB358 \uACF3\uC774\uC5B4\uC11C, \uD574\uAC00 \uB5A8\uC5B4\uC9C4 \uD6C4\uC758 \uACF5\uAC04\uC774 \uC5B4\uB5BB\uAC8C \uB2E4\uB974\uAC8C \uB2E4\uAC00\uC62C\uC9C0 \uBC18\uC2E0\uBC18\uC758\uD588\uB294\uB370\uC694."), /* @__PURE__ */ React.createElement("p", null, "\uAD00\uB78C\uC815 \uC55E\uC5D0 \uC130\uC744 \uB54C, \uBB38\uB4DD \uC655\uC774 \uC774 \uC790\uB9AC\uC5D0\uC11C \uBB34\uC5C7\uC744 \uBCF4\uC558\uC744\uAE4C \u2014 \uB77C\uB294 \uC9C8\uBB38\uC774 \uB5A0\uC62C\uB790\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("blockquote", null, /* @__PURE__ */ React.createElement("p", null, '"\uC655\uC758 \uC790\uB9AC\uAC00 \uC544\uB2C8\uB77C \uC655\uC774 \uBC14\uB77C\uBCF8 \uAE38\uC744 \uB530\uB77C\uAC00\uB77C."'), /* @__PURE__ */ React.createElement("cite", null, "\u2014 \uBC45\uAE30\uB178\uC790, \u300E\uC655\uC758\uAE38\u300F \uC11C\uBB38")), /* @__PURE__ */ React.createElement("p", null, "\uB2E4\uC74C \uB2F5\uC0AC\uAC00 \uBC8C\uC368 \uAE30\uB2E4\uB824\uC9D1\uB2C8\uB2E4.")), ((_d = post.images) == null ? void 0 : _d.length) > 0 && /* @__PURE__ */ React.createElement("section", { "aria-label": "\uCCA8\uBD80 \uC774\uBBF8\uC9C0", style: { margin: "48px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true", style: { marginBottom: 16 } }, "ATTACHMENTS \xB7 \uCCA8\uBD80 \uC774\uBBF8\uC9C0 (", post.images.length, "\uC7A5)"), /* @__PURE__ */ React.createElement(ImageSlider, { images: post.images })), ((_e = post.attachments) == null ? void 0 : _e.length) > 0 && /* @__PURE__ */ React.createElement("section", { "aria-label": "\uCCA8\uBD80 \uD30C\uC77C", style: { margin: "40px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true", style: { marginBottom: 14 } }, "FILES \xB7 \uCCA8\uBD80 \uD30C\uC77C (", post.attachments.length, ")"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 } }, post.attachments.map((a, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: "1px solid var(--line)", background: "var(--bg-2)", fontSize: 13 } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u{1F4CE}"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, color: "var(--ink)" } }, a.name), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, _fmtSize(a.size)), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: a.dataUrl,
      download: a.name,
      className: "btn btn-small",
      style: { fontSize: 11, padding: "4px 10px" },
      "aria-label": `${a.name} \uB2E4\uC6B4\uB85C\uB4DC`
    },
    "\uB2E4\uC6B4\uB85C\uB4DC"
  ))))), /* @__PURE__ */ React.createElement("div", { style: { margin: "60px 0", paddingTop: 32, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn",
      "aria-pressed": liked,
      onClick: handleLike,
      style: { borderColor: liked ? "var(--gold)" : void 0, color: liked ? "var(--gold)" : void 0 }
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u2665"),
    " \uACF5\uAC10 ",
    /* @__PURE__ */ React.createElement("span", { "aria-live": "polite" }, likesCount)
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn",
      "aria-pressed": bookmarked,
      onClick: handleBookmark,
      style: { borderColor: bookmarked ? "var(--gold)" : void 0, color: bookmarked ? "var(--gold)" : void 0 }
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, bookmarked ? "\u2605" : "\u2606"),
    " \uBD81\uB9C8\uD06C"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn",
      onClick: () => {
        if (!user) return requireLogin("\uC2E0\uACE0");
        setReportOpen((v) => !v);
      }
    },
    "\uC2E0\uACE0"
  ), canManagePost && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: () => onEdit(post) }, "\uC218\uC815"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn",
      onClick: deletePost,
      style: { borderColor: "var(--danger)", color: "var(--danger)" }
    },
    "\uC0AD\uC81C"
  ))), reportOpen && /* @__PURE__ */ React.createElement(
    "form",
    {
      onSubmit: handleReportSubmit,
      style: { maxWidth: 560, margin: "24px auto 0", padding: 20, border: "1px solid var(--line)", background: "rgba(194,74,61,0.04)" }
    },
    /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 } }, "REPORT \xB7 \uC2E0\uACE0 \uC0AC\uC720"),
    reportSubmitted ? /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 13, lineHeight: 1.7, padding: "8px 0", color: "var(--gold)" } }, "\uC2E0\uACE0\uAC00 \uC811\uC218\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC6B4\uC601\uC790\uAC00 \uD655\uC778 \uD6C4 \uCC98\uB9AC\uD569\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "textarea",
      {
        className: "field-input",
        placeholder: "\uC5B4\uB5A4 \uC810\uC774 \uBB38\uC81C\uC778\uC9C0 \uAC04\uB2E8\uD788 \uC801\uC5B4 \uC8FC\uC138\uC694.",
        value: reportReason,
        onChange: (e) => setReportReason(e.target.value),
        style: { minHeight: 80, resize: "vertical", marginBottom: 12 }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => setReportOpen(false) }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "submit",
        className: "btn btn-small",
        style: { borderColor: "var(--danger)", color: "var(--danger)" }
      },
      "\uC2E0\uACE0 \uC811\uC218"
    )))
  )), /* @__PURE__ */ React.createElement("section", { "aria-labelledby": "comments-heading" }, /* @__PURE__ */ React.createElement("h2", { id: "comments-heading", className: "ko-serif", style: { fontSize: 22, marginBottom: 24 } }, "\uB313\uAE00 ", /* @__PURE__ */ React.createElement("span", { className: "gold" }, commentsList.length)), user ? /* @__PURE__ */ React.createElement("form", { onSubmit: submitComment, style: { marginBottom: 32 } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "comment-input", className: "sr-only" }, "\uB313\uAE00 \uC785\uB825"), /* @__PURE__ */ React.createElement(
    MentionTextarea,
    {
      value: comment,
      onChange: setComment,
      authors: (commentsList || []).map((c) => c.author).concat(post.author).filter(Boolean),
      rows: 4,
      placeholder: "\uC0DD\uAC01\uC744 \uB098\uB204\uC5B4 \uC8FC\uC138\uC694... (@\uB97C \uC785\uB825\uD558\uBA74 \uBA58\uC158 \uC790\uB3D9\uC644\uC131)",
      style: { minHeight: 100, resize: "vertical", marginBottom: 12 }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11 } }, user.name, "(\uC73C)\uB85C \uB4F1\uB85D"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small", disabled: !comment.trim() }, "\uB4F1\uB85D"))) : /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, textAlign: "center", marginBottom: 32, background: "rgba(245,213,72,0.04)" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, marginBottom: 16 } }, "\uB313\uAE00 \uC791\uC131\uC740 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uB85C\uADF8\uC778\uD55C \uD68C\uC6D0"), "\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: () => go("login") }, "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("signup") }, "\uD68C\uC6D0\uAC00\uC785"))), /* @__PURE__ */ React.createElement(
    CommentTree,
    {
      comments: commentsList,
      user,
      onDelete: deleteComment,
      onReply: (parentId, text) => {
        if (!user || !text.trim()) return;
        const now = /* @__PURE__ */ new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const next = window.BGNJ_COMMUNITY.addComment(post.id, {
          id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 4)}`,
          author: user.name,
          authorId: user.id,
          authorEmail: user.email,
          date: `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
          text: text.trim(),
          parentId
        });
        setCommentsList(next);
        const isMyOwnPost = post.authorId === user.id || post.author === user.name;
        if (!isMyOwnPost && post.authorId) {
          window.BGNJ_COMMUNITY.addNotification(post.authorId, {
            type: "comment",
            postId: post.id,
            postTitle: post.title,
            fromName: user.name,
            message: "\uB0B4 \uAE00\uC5D0 \uC0C8 \uB2F5\uAE00\uC774 \uB2EC\uB838\uC2B5\uB2C8\uB2E4."
          });
        }
        onRefresh == null ? void 0 : onRefresh();
      }
    }
  ))));
};
Object.assign(window, { CommunityPage, ImageSlider, HashtagInput, ImageAttacher, CommentTree });
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvQ29tbXVuaXR5UGFnZS5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMDogXHVCQUE5XHVCODVEICsgXHVBRTAwIFx1QzBDMVx1QzEzOCArIFx1QUUwMCBcdUM3OTFcdUMxMzEgKFRpcHRhcClcbi8vIFx1QjRGMVx1QUUwOVx1QkNDNCBcdUM4MTFcdUFERkMgXHVDODFDXHVDNUI0OiBcdUM3N0RcdUFFMzAvXHVDNEYwXHVBRTMwIFx1QUQ4Q1x1RDU1Q1x1Qzc0MCBcdUNFNzRcdUQxNENcdUFDRTBcdUI5QUMubWluTGV2ZWwgLyBwb3N0TWluTGV2ZWxcdUI4NUMgXHVEMzEwXHVDODE1LlxuXG4vLyBcdUFDRjVcdUM2QTkgXHVENkM1IFx1MjAxNCBcdUFEOENcdUQ1NUMgXHVBQ0M0XHVDMEIwXG5jb25zdCB1c2VVc2VyTGV2ZWwgPSAodXNlcikgPT4gUmVhY3QudXNlTWVtbygoKSA9PiB3aW5kb3cuQkdOSl9VU0VSX0xFVkVMKHVzZXIpLCBbdXNlcl0pO1xuY29uc3QgZ2V0Q2F0ZWdvcmllc0ZvckJvYXJkID0gKGJvYXJkVHlwZSkgPT5cbiAgd2luZG93LkJHTkpfU1RPUkVTLmNhdGVnb3JpZXMuZmlsdGVyKGMgPT4gYy5ib2FyZFR5cGUgPT09IGJvYXJkVHlwZSk7XG5cbi8vID09PSBIYXNodGFnIGNoaXAgaW5wdXQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgSGFzaHRhZ0lucHV0ID0gKHsgdGFncywgc2V0VGFncywgbWF4ID0gMTAgfSkgPT4ge1xuICBjb25zdCBbaW5wdXQsIHNldElucHV0XSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBpbnB1dFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICBjb25zdCBjb21taXQgPSAocmF3KSA9PiB7XG4gICAgY29uc3QgdCA9IHJhdy50cmltKCkucmVwbGFjZSgvXiMrLywgJycpLnJlcGxhY2UoL1xccysvZywgJycpO1xuICAgIGlmICghdCkgcmV0dXJuO1xuICAgIGlmICh0YWdzLmluY2x1ZGVzKHQpKSByZXR1cm47XG4gICAgaWYgKHRhZ3MubGVuZ3RoID49IG1heCkgcmV0dXJuO1xuICAgIHNldFRhZ3MoWy4uLnRhZ3MsIHRdKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVLZXkgPSAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnLCcpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbW1pdChpbnB1dCk7XG4gICAgICBzZXRJbnB1dCgnJyk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0JhY2tzcGFjZScgJiYgIWlucHV0ICYmIHRhZ3MubGVuZ3RoKSB7XG4gICAgICBzZXRUYWdzKHRhZ3Muc2xpY2UoMCwgLTEpKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWctaW5wdXQtd3JhcFwiIG9uQ2xpY2s9eygpID0+IGlucHV0UmVmLmN1cnJlbnQ/LmZvY3VzKCl9PlxuICAgICAgICB7dGFncy5tYXAoKHQsIGkpID0+IChcbiAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cInRhZy1jaGlwXCI+XG4gICAgICAgICAgICAje3R9XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRUYWdzKHRhZ3MuZmlsdGVyKHggPT4geCAhPT0gdCkpfVxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgJHt0fSBcdUQwRENcdUFERjggXHVDMEFEXHVDODFDYH0+XHUyNzE1PC9idXR0b24+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApKX1cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgcmVmPXtpbnB1dFJlZn1cbiAgICAgICAgICB2YWx1ZT17aW5wdXR9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0SW5wdXQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIG9uS2V5RG93bj17aGFuZGxlS2V5fVxuICAgICAgICAgIG9uQmx1cj17KCkgPT4geyBpZiAoaW5wdXQudHJpbSgpKSB7IGNvbW1pdChpbnB1dCk7IHNldElucHV0KCcnKTsgfSB9fVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXt0YWdzLmxlbmd0aCA/IFwiXCIgOiBcIlx1RDBEQ1x1QURGOCBcdUM3ODVcdUI4MjUgXHVENkM0IFx1QzJBNFx1RDM5OFx1Qzc3NFx1QzJBNFx1QkMxNCAoXHVDRDVDXHVCMzAwIDEwXHVBQzFDKVwifVxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJcdUQ1NzRcdUMyRENcdUQwRENcdUFERjggXHVDNzg1XHVCODI1XCIvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWhpbnRcIiBzdHlsZT17e21hcmdpblRvcDo2fX0+XG4gICAgICAgIFx1QzJBNFx1RDM5OFx1Qzc3NFx1QzJBNFx1QkMxNCBcdTAwQjcgRW50ZXIgXHUwMEI3IFx1QzI3Q1x1RDQ1Q1x1Qjg1QyBcdUQwRENcdUFERjggXHVBRDZDXHVCRDg0IFx1MDBCNyBCYWNrc3BhY2VcdUI4NUMgXHVCOUM4XHVDOUMwXHVCOUM5IFx1RDBEQ1x1QURGOCBcdUMwQURcdUM4MUMgXHUwMEI3IHt0YWdzLmxlbmd0aH0ve21heH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09IEltYWdlIFNsaWRlciAodmlld2VyKSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgSW1hZ2VTbGlkZXIgPSAoeyBpbWFnZXMsIGF1dG9wbGF5TXMgPSA0MDAwIH0pID0+IHtcbiAgY29uc3QgW2lkeCwgc2V0SWR4XSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCBbcGF1c2VkLCBzZXRQYXVzZWRdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBwcmVmZXJzUmVkdWNlZCA9IFJlYWN0LnVzZU1lbW8oKCkgPT5cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHdpbmRvdy5tYXRjaE1lZGlhPy4oJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcywgW10pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGltYWdlcy5sZW5ndGggPD0gMSB8fCBwYXVzZWQgfHwgcHJlZmVyc1JlZHVjZWQpIHJldHVybjtcbiAgICBjb25zdCB0ID0gc2V0SW50ZXJ2YWwoKCkgPT4gc2V0SWR4KGkgPT4gKGkgKyAxKSAlIGltYWdlcy5sZW5ndGgpLCBhdXRvcGxheU1zKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbCh0KTtcbiAgfSwgW2ltYWdlcy5sZW5ndGgsIHBhdXNlZCwgYXV0b3BsYXlNcywgcHJlZmVyc1JlZHVjZWRdKTtcblxuICBpZiAoIWltYWdlcy5sZW5ndGgpIHJldHVybiBudWxsO1xuICBjb25zdCBnbyA9IChpKSA9PiBzZXRJZHgoKChpICUgaW1hZ2VzLmxlbmd0aCkgKyBpbWFnZXMubGVuZ3RoKSAlIGltYWdlcy5sZW5ndGgpO1xuXG4gIHJldHVybiAoXG4gICAgPGZpZ3VyZSBhcmlhLXJvbGVkZXNjcmlwdGlvbj1cImNhcm91c2VsXCIgYXJpYS1sYWJlbD1cIlx1Q0NBOFx1QkQ4MCBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDXCJcbiAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0UGF1c2VkKHRydWUpfSBvbk1vdXNlTGVhdmU9eygpID0+IHNldFBhdXNlZChmYWxzZSl9XG4gICAgICBvbkZvY3VzPXsoKSA9PiBzZXRQYXVzZWQodHJ1ZSl9IG9uQmx1cj17KCkgPT4gc2V0UGF1c2VkKGZhbHNlKX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy1zbGlkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLXRyYWNrXCIgc3R5bGU9e3t0cmFuc2Zvcm06IGB0cmFuc2xhdGVYKC0ke2lkeCAqIDEwMH0lKWB9fT5cbiAgICAgICAgICB7aW1hZ2VzLm1hcCgoaW1nLCBpKSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwiaW1nLXNsaWRlci1zbGlkZVwiXG4gICAgICAgICAgICAgIHJvbGU9XCJncm91cFwiIGFyaWEtcm9sZWRlc2NyaXB0aW9uPVwic2xpZGVcIiBhcmlhLWxhYmVsPXtgJHtpKzF9IC8gJHtpbWFnZXMubGVuZ3RofWB9XG4gICAgICAgICAgICAgIGFyaWEtaGlkZGVuPXtpICE9PSBpZHh9PlxuICAgICAgICAgICAgICA8aW1nIHNyYz17aW1nLmRhdGFVcmwgfHwgaW1nLnNyY30gYWx0PXtpbWcuYWx0IHx8IGltZy5uYW1lIHx8IGBcdUM3NzRcdUJCRjhcdUM5QzAgJHtpKzF9YH0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7aW1hZ2VzLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLW5hdiBwcmV2XCIgb25DbGljaz17KCkgPT4gZ28oaWR4IC0gMSl9IGFyaWEtbGFiZWw9XCJcdUM3NzRcdUM4MDQgXHVDNzc0XHVCQkY4XHVDOUMwXCI+XHUyMDM5PC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLW5hdiBuZXh0XCIgb25DbGljaz17KCkgPT4gZ28oaWR4ICsgMSl9IGFyaWEtbGFiZWw9XCJcdUIyRTRcdUM3NEMgXHVDNzc0XHVCQkY4XHVDOUMwXCI+XHUyMDNBPC9idXR0b24+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy1zbGlkZXItY2FwdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWxpdmU9XCJwb2xpdGVcIj57aWR4ICsgMX0gLyB7aW1hZ2VzLmxlbmd0aH08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW1nLXNsaWRlci1kb3RzXCIgcm9sZT1cInRhYmxpc3RcIiBhcmlhLWxhYmVsPVwiXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDIFx1QzEyMFx1RDBERFwiPlxuICAgICAgICAgICAgICB7aW1hZ2VzLm1hcCgoXywgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtpfSB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cInRhYlwiXG4gICAgICAgICAgICAgICAgICBhcmlhLWN1cnJlbnQ9e2kgPT09IGlkeH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODggXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDYH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElkeChpKX0vPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICB7aW1hZ2VzW2lkeF0/LmNhcHRpb24gJiYgKFxuICAgICAgICA8ZmlnY2FwdGlvbiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEyLCBtYXJnaW5Ub3A6OCwgdGV4dEFsaWduOidjZW50ZXInfX0+XG4gICAgICAgICAge2ltYWdlc1tpZHhdLmNhcHRpb259XG4gICAgICAgIDwvZmlnY2FwdGlvbj5cbiAgICAgICl9XG4gICAgPC9maWd1cmU+XG4gICk7XG59O1xuXG4vLyA9PT0gSW1hZ2UgcGlja2VyIChlZGl0b3Igc2lkZSkgXHUyMDE0IHVwIHRvIGBtYXhgIGltYWdlcyB3aXRoIHRodW1ibmFpbHMgPT09PT1cbmNvbnN0IEltYWdlQXR0YWNoZXIgPSAoeyBpbWFnZXMsIHNldEltYWdlcywgbWF4ID0gMTAgfSkgPT4ge1xuICBjb25zdCBpbnB1dFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICBjb25zdCBoYW5kbGVGaWxlcyA9IGFzeW5jIChmaWxlTGlzdCkgPT4ge1xuICAgIGNvbnN0IGZpbGVzID0gQXJyYXkuZnJvbShmaWxlTGlzdCB8fCBbXSk7XG4gICAgY29uc3QgcmVtYWluaW5nID0gbWF4IC0gaW1hZ2VzLmxlbmd0aDtcbiAgICBpZiAocmVtYWluaW5nIDw9IDApIHJldHVybjtcbiAgICBjb25zdCB0b0FkZCA9IGZpbGVzLnNsaWNlKDAsIHJlbWFpbmluZyk7XG4gICAgLy8gdjAwLjA4NSBcdTIwMTQgUjIgXHVDNkIwXHVDMTIwICgxME1CKSArIGRhdGFVUkkgXHVEM0Y0XHVCQzMxLiBkYXRhVXJsIFx1RDU0NFx1QjREQ1x1QkE4NSBcdUM3MjBcdUM5QzAgXHUyMDE0IFIyIFVSTCBcdUIzQzQgPGltZyBzcmM+IFx1Qjg1QyBcdUQ2MzhcdUQ2NTguXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKHRvQWRkLm1hcChhc3luYyAoZikgPT4ge1xuICAgICAgY29uc3QgbWV0YSA9IHsgbmFtZTogZi5uYW1lLCBzaXplOiBmLnNpemUsIGFsdDogZi5uYW1lLnJlcGxhY2UoL1xcLlteLl0rJC8sICcnKSB9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyB1cmwgfSA9IGF3YWl0IHdpbmRvdy5CR05KX01FRElBLnVwbG9hZEZpbGUoZiwgeyBmb2xkZXI6ICdwb3N0LWltYWdlcycsIG1heEJ5dGVzOiAxMCAqIDEwMjQgKiAxMDI0IH0pO1xuICAgICAgICByZXR1cm4geyAuLi5tZXRhLCBkYXRhVXJsOiB1cmwgfTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1t2MDAuMDg1XSBSMiBcdUFDOENcdUMyRENcdUFFMDAgXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzVDNVx1Qjg1Q1x1QjREQyBcdUMyRTRcdUQzMjggXHUyMDE0IGRhdGFVUkkgXHVEM0Y0XHVCQzMxOicsIGVycik7XG4gICAgICB9XG4gICAgICAvLyBcdUQzRjRcdUJDMzE6IDVNQiBcdUM3NzRcdUQ1NThcdUI5Q0MgZGF0YVVSSSBcdUM3NzhcdUI3N0NcdUM3NzggKEQxIFx1QkQ4MFx1QjJGNCBcdUFDMTBcdUM1NDgpLiBcdUNEMDhcdUFDRkMgXHVDMkRDIFx1QUM3MFx1QkQ4MC5cbiAgICAgIGlmIChmLnNpemUgPiA1ICogMTAyNCAqIDEwMjQpIHtcbiAgICAgICAgYWxlcnQoYCcke2YubmFtZX0nIFIyIFx1QzJFNFx1RDMyOCArIGRhdGFVUkkgXHVEM0Y0XHVCQzMxIFx1RDU1Q1x1QjNDNCA1TUIgXHVDRDA4XHVBQ0ZDIFx1MjAxNCBcdUFDNzRcdUIxMDhcdUI3MDAuYCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNvbnN0IHIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoci5yZXN1bHQpO1xuICAgICAgICByLnJlYWRBc0RhdGFVUkwoZik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7IC4uLm1ldGEsIGRhdGFVcmwgfTtcbiAgICB9KSk7XG4gICAgc2V0SW1hZ2VzKFsuLi5pbWFnZXMsIC4uLnJlc3VsdHMuZmlsdGVyKEJvb2xlYW4pXSk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlID0gKGkpID0+IHNldEltYWdlcyhpbWFnZXMuZmlsdGVyKChfLCBqKSA9PiBqICE9PSBpKSk7XG4gIGNvbnN0IG1vdmUgPSAoaSwgZGlyKSA9PiB7XG4gICAgY29uc3QgaiA9IGkgKyBkaXI7XG4gICAgaWYgKGogPCAwIHx8IGogPj0gaW1hZ2VzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IG5leHQgPSBpbWFnZXMuc2xpY2UoKTtcbiAgICBbbmV4dFtpXSwgbmV4dFtqXV0gPSBbbmV4dFtqXSwgbmV4dFtpXV07XG4gICAgc2V0SW1hZ2VzKG5leHQpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBtYXJnaW5Cb3R0b206OH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCI+XHVDQ0E4XHVCRDgwIFx1Qzc3NFx1QkJGOFx1QzlDMCA8c3BhbiBjbGFzc05hbWU9XCJkaW0tMlwiPih7aW1hZ2VzLmxlbmd0aH0ve21heH0pPC9zcGFuPjwvZGl2PlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICBkaXNhYmxlZD17aW1hZ2VzLmxlbmd0aCA+PSBtYXh9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gaW5wdXRSZWYuY3VycmVudD8uY2xpY2soKX0+XG4gICAgICAgICAgKyBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDMTIwXHVEMEREXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8aW5wdXQgcmVmPXtpbnB1dFJlZn0gdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgbXVsdGlwbGVcbiAgICAgICAgc3R5bGU9e3tkaXNwbGF5Oidub25lJ319XG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4geyBoYW5kbGVGaWxlcyhlLnRhcmdldC5maWxlcyk7IGUudGFyZ2V0LnZhbHVlID0gJyc7IH19Lz5cbiAgICAgIHtpbWFnZXMubGVuZ3RoID4gMCA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWctdGh1bWJzXCI+XG4gICAgICAgICAge2ltYWdlcy5tYXAoKGltZywgaSkgPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzTmFtZT1cImltZy10aHVtYlwiPlxuICAgICAgICAgICAgICA8aW1nIHNyYz17aW1nLmRhdGFVcmwgfHwgaW1nLnNyY30gYWx0PXtpbWcuYWx0IHx8IGB0aHVtYi0ke2l9YH0vPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbWctdGh1bWItb3JkZXJcIj57U3RyaW5nKGkgKyAxKS5wYWRTdGFydCgyLCAnMCcpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiaW1nLXRodW1iLXJlbW92ZVwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcmVtb3ZlKGkpfVxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODggXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzgxQ1x1QUM3MGB9Plx1MjcxNTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246J2Fic29sdXRlJywgYm90dG9tOjQsIHJpZ2h0OjQsIGRpc3BsYXk6J2ZsZXgnLCBnYXA6Mn19PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IG1vdmUoaSwgLTEpfSBkaXNhYmxlZD17aSA9PT0gMH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODggXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzU1RVx1QzczQ1x1Qjg1Q2B9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6J3JnYmEoMCwwLDAsMC42KScsIGJvcmRlcjonbm9uZScsIGNvbG9yOid2YXIoLS1nb2xkKScsIGZvbnRTaXplOjEwLCBwYWRkaW5nOicxcHggNXB4JywgY3Vyc29yOidwb2ludGVyJywgbWluSGVpZ2h0OjB9fT5cdTI1QzA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBtb3ZlKGksIDEpfSBkaXNhYmxlZD17aSA9PT0gaW1hZ2VzLmxlbmd0aCAtIDF9XG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgJHtpKzF9XHVCQzg4IFx1Qzc3NFx1QkJGOFx1QzlDMCBcdUI0QTRcdUI4NUNgfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidyZ2JhKDAsMCwwLDAuNiknLCBib3JkZXI6J25vbmUnLCBjb2xvcjondmFyKC0tZ29sZCknLCBmb250U2l6ZToxMCwgcGFkZGluZzonMXB4IDVweCcsIGN1cnNvcjoncG9pbnRlcicsIG1pbkhlaWdodDowfX0+XHUyNUI2PC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwbGFjZWhvbGRlclwiIHN0eWxlPXt7YXNwZWN0UmF0aW86JzUvMScsIGZvbnRTaXplOjEwfX0+XG4gICAgICAgICAgXHVDNzc0XHVCQkY4XHVDOUMwXHVCOTdDIFx1Q0NBOFx1QkQ4MFx1RDU1OFx1QkE3NCBcdUMwQzFcdUMxMzggXHVEMzk4XHVDNzc0XHVDOUMwIFx1RDU1OFx1QjJFOFx1QzVEMCBcdUM3OTBcdUIzRDkgXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDXHVCODVDIFx1RDQ1Q1x1QzJEQ1x1QjQyOVx1QjJDOFx1QjJFNFxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyA9PT0gRmlsZSBhdHRhY2hlciAodjAwLjA2OSkgXHUyMDE0IFx1QkU0NC1cdUM3NzRcdUJCRjhcdUM5QzAgXHVEMzBDXHVDNzdDIFx1Q0NBOFx1QkQ4MCwgMTBNQiBcdTAwRDcgXHVDRDVDXHVCMzAwIDMgPT09PT09XG4vLyBcdUFDOENcdUMyRENcdUFFMDBcdUM1RDAgYXR0YWNobWVudHM6IFt7IG5hbWUsIHR5cGUsIHNpemUsIGRhdGFVcmwgfV0gXHVDNzNDXHVCODVDIFx1QzgwMFx1QzdBNS4gZGF0YVVybCBcdUM3NDAgYmFzZTY0LlxuLy8gXHVCQ0Y0XHVBRDAwIFx1RDU1Q1x1QjNDNFx1QUMwMCBcdUM3OTFcdUM1NDQgdjEgXHVDNzQwIEQxIFx1Qzc3OFx1Qjc3Q1x1Qzc3OCBKU09OLiBcdUNEOTRcdUQ2QzQgUjIgXHVDNUM1XHVCODVDXHVCNERDIFx1RDc1MFx1Qjk4NFx1Qzc0MCBcdUJDQzRcdUIzQzQgXHVDMEFDXHVDNzc0XHVEMDc0LlxuY29uc3QgRklMRV9NQVhfU0laRSA9IDEwICogMTAyNCAqIDEwMjQ7IC8vIDEwTUJcbmNvbnN0IEZJTEVfTUFYX0NPVU5UID0gMztcbmNvbnN0IF9mbXRTaXplID0gKG4pID0+IHtcbiAgaWYgKCFuICYmIG4gIT09IDApIHJldHVybiAnJztcbiAgaWYgKG4gPCAxMDI0KSByZXR1cm4gYCR7bn0gQmA7XG4gIGlmIChuIDwgMTAyNCAqIDEwMjQpIHJldHVybiBgJHsobiAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgcmV0dXJuIGAkeyhuIC8gMTAyNCAvIDEwMjQpLnRvRml4ZWQoMSl9IE1CYDtcbn07XG5jb25zdCBGaWxlQXR0YWNoZXIgPSAoeyBmaWxlcywgc2V0RmlsZXMsIG1heCA9IEZJTEVfTUFYX0NPVU5ULCBtYXhTaXplID0gRklMRV9NQVhfU0laRSB9KSA9PiB7XG4gIGNvbnN0IGlucHV0UmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcblxuICBjb25zdCBoYW5kbGVGaWxlcyA9IGFzeW5jIChmaWxlTGlzdCkgPT4ge1xuICAgIHNldEVycm9yKCcnKTtcbiAgICBjb25zdCBpbmNvbWluZyA9IEFycmF5LmZyb20oZmlsZUxpc3QgfHwgW10pO1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IG1heCAtIGZpbGVzLmxlbmd0aDtcbiAgICBpZiAocmVtYWluaW5nIDw9IDApIHsgc2V0RXJyb3IoYFx1Q0NBOFx1QkQ4MFx1QjI5NCBcdUNENUNcdUIzMDAgJHttYXh9XHVBQzFDXHVBRTRDXHVDOUMwIFx1QUMwMFx1QjJBNVx1RDU2OVx1QjJDOFx1QjJFNC5gKTsgcmV0dXJuOyB9XG4gICAgY29uc3QgYWNjZXB0ZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgaW5jb21pbmcuc2xpY2UoMCwgcmVtYWluaW5nKSkge1xuICAgICAgaWYgKGYuc2l6ZSA+IG1heFNpemUpIHsgc2V0RXJyb3IoYCcke2YubmFtZX0nIFx1Qzc0MChcdUIyOTQpICR7X2ZtdFNpemUobWF4U2l6ZSl9IFx1Q0QwOFx1QUNGQyBcdTIwMTQgXHVDQ0E4XHVCRDgwIFx1QkQ4OFx1QUMwMC5gKTsgY29udGludWU7IH1cbiAgICAgIGFjY2VwdGVkLnB1c2goZik7XG4gICAgfVxuICAgIC8vIHYwMC4wODUgXHUyMDE0IFIyIFx1QzZCMFx1QzEyMCAobWF4U2l6ZT0xME1CKSArIGRhdGFVUkkgXHVEM0Y0XHVCQzMxLiBkYXRhVXJsIFx1RDU0NFx1QjREQ1x1QkE4NSBcdUM3MjBcdUM5QzAgXHUyMDE0IDxhIGhyZWY9e2RhdGFVcmx9IGRvd25sb2FkPiBcdUIzQzQgUjIgVVJMIFx1Qjg1QyBcdUQ2MzhcdUQ2NTguXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKGFjY2VwdGVkLm1hcChhc3luYyAoZikgPT4ge1xuICAgICAgY29uc3QgbWV0YSA9IHsgbmFtZTogZi5uYW1lLCB0eXBlOiBmLnR5cGUgfHwgJycsIHNpemU6IGYuc2l6ZSB9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyB1cmwgfSA9IGF3YWl0IHdpbmRvdy5CR05KX01FRElBLnVwbG9hZEZpbGUoZiwgeyBmb2xkZXI6ICdwb3N0LWF0dGFjaG1lbnRzJywgbWF4Qnl0ZXM6IG1heFNpemUgfSk7XG4gICAgICAgIHJldHVybiB7IC4uLm1ldGEsIGRhdGFVcmw6IHVybCB9O1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignW3YwMC4wODVdIFIyIFx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUNDQThcdUJEODAgXHVDNUM1XHVCODVDXHVCNERDIFx1QzJFNFx1RDMyOCBcdTIwMTQgZGF0YVVSSSBcdUQzRjRcdUJDMzE6JywgZXJyKTtcbiAgICAgIH1cbiAgICAgIC8vIFx1RDNGNFx1QkMzMTogNU1CIFx1Qzc3NFx1RDU1OFx1QjlDQyBkYXRhVVJJIFx1Qzc3OFx1Qjc3Q1x1Qzc3OC4gXHVDRDA4XHVBQ0ZDIFx1QzJEQyBcdUFDNzBcdUJEODAuXG4gICAgICBpZiAoZi5zaXplID4gNSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHNldEVycm9yKGAnJHtmLm5hbWV9JyBSMiBcdUMyRTRcdUQzMjggKyBkYXRhVVJJIFx1RDNGNFx1QkMzMSBcdUQ1NUNcdUIzQzQgNU1CIFx1Q0QwOFx1QUNGQyBcdTIwMTQgXHVDQ0E4XHVCRDgwIFx1QkQ4OFx1QUMwMC5gKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY29uc3QgciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHIub25sb2FkID0gKCkgPT4gcmVzb2x2ZShyLnJlc3VsdCk7XG4gICAgICAgIHIucmVhZEFzRGF0YVVSTChmKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHsgLi4ubWV0YSwgZGF0YVVybCB9O1xuICAgIH0pKTtcbiAgICBzZXRGaWxlcyhbLi4uZmlsZXMsIC4uLnJlc3VsdHMuZmlsdGVyKEJvb2xlYW4pXSk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlID0gKGkpID0+IHNldEZpbGVzKGZpbGVzLmZpbHRlcigoXywgaikgPT4gaiAhPT0gaSkpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBtYXJnaW5Cb3R0b206OH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCI+XHVDQ0E4XHVCRDgwIFx1RDMwQ1x1Qzc3QyA8c3BhbiBjbGFzc05hbWU9XCJkaW0tMlwiPih7ZmlsZXMubGVuZ3RofS97bWF4fSBcdTAwQjcgXHVBQzAxIHtfZm10U2l6ZShtYXhTaXplKX0gXHVDNzc0XHVENTU4KTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiXG4gICAgICAgICAgZGlzYWJsZWQ9e2ZpbGVzLmxlbmd0aCA+PSBtYXh9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gaW5wdXRSZWYuY3VycmVudD8uY2xpY2soKX0+XG4gICAgICAgICAgKyBcdUQzMENcdUM3N0MgXHVDMTIwXHVEMEREXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8aW5wdXQgcmVmPXtpbnB1dFJlZn0gdHlwZT1cImZpbGVcIiBtdWx0aXBsZVxuICAgICAgICBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX1cbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7IGhhbmRsZUZpbGVzKGUudGFyZ2V0LmZpbGVzKTsgZS50YXJnZXQudmFsdWUgPSAnJzsgfX0vPlxuICAgICAge2Vycm9yICYmIChcbiAgICAgICAgPGRpdiByb2xlPVwiYWxlcnRcIiBzdHlsZT17e2ZvbnRTaXplOjExLCBjb2xvcjondmFyKC0tZGFuZ2VyKScsIG1hcmdpbkJvdHRvbTo4fX0+e2Vycm9yfTwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtmaWxlcy5sZW5ndGggPiAwID8gKFxuICAgICAgICA8dWwgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBwYWRkaW5nOjAsIG1hcmdpbjowLCBkaXNwbGF5OidmbGV4JywgZmxleERpcmVjdGlvbjonY29sdW1uJywgZ2FwOjZ9fT5cbiAgICAgICAgICB7ZmlsZXMubWFwKChmLCBpKSA9PiAoXG4gICAgICAgICAgICA8bGkga2V5PXtpfSBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBnYXA6MTAsIHBhZGRpbmc6JzhweCAxMHB4JywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLCBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGZvbnRTaXplOjEyfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlx1RDgzRFx1RENDRTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmbGV4OjEsIGNvbG9yOid2YXIoLS1pbmspJywgb3ZlcmZsb3c6J2hpZGRlbicsIHRleHRPdmVyZmxvdzonZWxsaXBzaXMnLCB3aGl0ZVNwYWNlOidub3dyYXAnfX0+e2YubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEwfX0+e19mbXRTaXplKGYuc2l6ZSl9PC9zcGFuPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiByZW1vdmUoaSl9IGFyaWEtbGFiZWw9e2Ake2YubmFtZX0gXHVDODFDXHVBQzcwYH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6J25vbmUnLCBib3JkZXI6J25vbmUnLCBjb2xvcjondmFyKC0tZGFuZ2VyKScsIGZvbnRTaXplOjE0LCBjdXJzb3I6J3BvaW50ZXInLCBwYWRkaW5nOicycHggNnB4J319Plx1MjcxNTwvYnV0dG9uPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC91bD5cbiAgICAgICkgOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGxhY2Vob2xkZXJcIiBzdHlsZT17e2FzcGVjdFJhdGlvOic4LzEnLCBmb250U2l6ZToxMH19PlxuICAgICAgICAgIFBERiBcdTAwQjcgRE9DWCBcdTAwQjcgXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzY3OCBcdUM3OTBcdUI4Q0NcdUI5N0MgXHVDQ0E4XHVCRDgwIChcdUFDOENcdUMyRENcdUFFMDAgXHVCQ0Y4XHVCQjM4IFx1RDU1OFx1QjJFOFx1QzVEMCBcdUIyRTRcdUM2QjRcdUI4NUNcdUI0REMgXHVCOUMxXHVEMDZDXHVCODVDIFx1RDQ1Q1x1QzJEQylcbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09IENvbW1lbnQgdHJlZSAoXHVCMkU0XHVCMkU4XHVBQ0M0IFx1QjJGNVx1QUUwMCwgXHVDRDVDXHVCMzAwIFx1QUU0QVx1Qzc3NCBNQVhfREVQVEgpID09PT09PT09PT09PT09PT09PT09PT1cbi8vIEBcdUJBNThcdUMxNThcdUM3NDAgXHVCQ0Y4XHVCQjM4XHVDNUQwIEBcdUM3NzRcdUI5ODQgXHVEMUEwXHVEMDcwXHVDNzQ0IFx1QUNFOFx1QjREQyBjaGlwIFx1QzczQ1x1Qjg1QyBcdUI4MENcdUIzNTRcdUI5QzEuXG4vLyBcdUIyRjVcdUFFMDAgXHVEMkI4XHVCOUFDIFx1MjAxNCBcdUMyRENcdUFDMDFcdUM4MDEgXHVCNEU0XHVDNUVDXHVDNEYwXHVBRTMwIFx1QUUzMFx1QkNGOCBcdUNFQTEoMykuIFx1QURGOCBcdUM3NzRcdUMwQzFcdUM3NDAgXHVDNzkwXHVCM0Q5IFx1RDNCQ1x1Q0U2OC9cdUM4MTFcdUFFMzAgXHVEMUEwXHVBRTAwXHVCODVDIFx1QjE3OFx1Q0Q5Qy5cbmNvbnN0IE1BWF9WSVNJQkxFX0RFUFRIID0gMztcblxuY29uc3QgcmVuZGVyQ29tbWVudFRleHQgPSAodGV4dCkgPT4ge1xuICBpZiAoIXRleHQpIHJldHVybiBudWxsO1xuICAvLyBAXHVCMkM5XHVCMTI0XHVDNzg0IFx1RDFBMFx1RDA3MFx1QjlDQyBcdUFDMDBcdUJDQ0RcdUFDOEMgXHVBQzE1XHVDODcwKFx1QUNFOFx1QjREQywgbWVkaXVtKS4gXHVCQ0Y4XHVCQjM4XHVDNzQwIFx1RDNDOVx1QkIzOCBcdUFERjhcdUIzMDBcdUI4NUMuXG4gIGNvbnN0IHBhcnRzID0gU3RyaW5nKHRleHQpLnNwbGl0KC8oQFtcXHB7TH1cXHB7Tn1fXSspL2d1KTtcbiAgcmV0dXJuIHBhcnRzLm1hcCgocGFydCwgaSkgPT4ge1xuICAgIGlmIChwYXJ0LnN0YXJ0c1dpdGgoJ0AnKSAmJiBwYXJ0Lmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiA8c3BhbiBrZXk9e2l9IGNsYXNzTmFtZT1cImdvbGRcIiBzdHlsZT17e2ZvbnRXZWlnaHQ6NTAwfX0+e3BhcnR9PC9zcGFuPjtcbiAgICB9XG4gICAgcmV0dXJuIDxSZWFjdC5GcmFnbWVudCBrZXk9e2l9PntwYXJ0fTwvUmVhY3QuRnJhZ21lbnQ+O1xuICB9KTtcbn07XG5cbmNvbnN0IENvbW1lbnRUcmVlID0gKHsgY29tbWVudHMsIHVzZXIsIG9uRGVsZXRlLCBvblJlcGx5IH0pID0+IHtcbiAgY29uc3QgdG9wTGV2ZWwgPSAoY29tbWVudHMgfHwgW10pLmZpbHRlcigoYykgPT4gIWMucGFyZW50SWQpO1xuICBjb25zdCByZXBsaWVzT2YgPSAocGFyZW50SWQpID0+IChjb21tZW50cyB8fCBbXSkuZmlsdGVyKChjKSA9PiBjLnBhcmVudElkID09PSBwYXJlbnRJZCk7XG4gIGNvbnN0IFtvcGVuUmVwbHlUbywgc2V0T3BlblJlcGx5VG9dID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtkcmFmdCwgc2V0RHJhZnRdID0gUmVhY3QudXNlU3RhdGUoJycpO1xuXG4gIC8vIFx1QkE1OFx1QzE1OCBcdUM3OTBcdUIzRDlcdUM2NDRcdUMxMzEgXHUyMDE0IFx1QjMxM1x1QUUwMCBcdUM3OTFcdUMxMzFcdUM3OTAgKyBcdUFFMDAgXHVCMzEzXHVBRTAwXHVDNUQwIFx1QjRGMVx1QzdBNVx1RDU1QyBcdUJBQThcdUI0RTAgXHVCMkM5XHVCMTI0XHVDNzg0XHVDNzQ0IFx1RDZDNFx1QkNGNFx1Qjg1Qy5cbiAgY29uc3QgYWxsQXV0aG9ycyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgcmV0dXJuIChjb21tZW50cyB8fCBbXSlcbiAgICAgIC5tYXAoKGMpID0+IGMuYXV0aG9yKVxuICAgICAgLmZpbHRlcigobikgPT4gbiAmJiAhc2Vlbi5oYXMobikgJiYgKHNlZW4uYWRkKG4pIHx8IHRydWUpKTtcbiAgfSwgW2NvbW1lbnRzXSk7XG5cbiAgY29uc3Qgc3VibWl0UmVwbHkgPSAocGFyZW50SWQpID0+IHtcbiAgICBvblJlcGx5Py4ocGFyZW50SWQsIGRyYWZ0KTtcbiAgICBzZXREcmFmdCgnJyk7XG4gICAgc2V0T3BlblJlcGx5VG8obnVsbCk7XG4gIH07XG5cbiAgLy8gXHVBRTRBXHVDNzc0IFx1QzgxQ1x1RDU1Q1x1Qzc0NCBcdUQ0ODBcdUFDRTAgKFx1QzExQ1x1QkM4NFx1QjI5NCBcdUJCMzRcdUM4MUNcdUQ1NUMgXHVENUM4XHVDNkE5KSwgXHVDMkRDXHVBQzAxXHVCOUNDIE1BWF9WSVNJQkxFX0RFUFRIIFx1QUU0Q1x1QzlDMCBcdUI0RTRcdUM1RUNcdUM0RjBcdUFFMzAuXG4gIGNvbnN0IFtleHBhbmRlZCwgc2V0RXhwYW5kZWRdID0gUmVhY3QudXNlU3RhdGUoe30pOyAvLyBjb21tZW50SWQgLT4gdHJ1ZSAoXHVDMEFDXHVDNkE5XHVDNzkwIFx1RDNCQ1x1Q0U2OCBcdUQwNzRcdUI5QUQpXG4gIGNvbnN0IHJlbmRlckl0ZW0gPSAoYywgZGVwdGggPSAwKSA9PiB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSByZXBsaWVzT2YoYy5pZCk7XG4gICAgY29uc3QgY2FuUmVwbHkgPSAhIXVzZXI7IC8vIFx1QUU0QVx1Qzc3NCBcdUJCMzRcdUFEMDAgXHVCMkY1XHVBRTAwIFx1RDVDOFx1QzZBOVxuICAgIGNvbnN0IHZpc3VhbERlcHRoID0gTWF0aC5taW4oZGVwdGgsIE1BWF9WSVNJQkxFX0RFUFRIKTtcbiAgICBjb25zdCBpc0RlZXBDb2xsYXBzZWQgPSBkZXB0aCA+PSBNQVhfVklTSUJMRV9ERVBUSCAmJiAhZXhwYW5kZWRbYy5pZF0gJiYgY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpIGtleT17Yy5pZH0gc3R5bGU9e3twYWRkaW5nOicxOHB4IDAnLCBib3JkZXJCb3R0b206IGRlcHRoID09PSAwID8gJzFweCBzb2xpZCB2YXIoLS1saW5lKScgOiAnbm9uZSd9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTYsIGFsaWduSXRlbXM6J2NlbnRlcicsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgbWFyZ2luQm90dG9tOjEwfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTQsIGFsaWduSXRlbXM6J2NlbnRlcicsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAge2RlcHRoID4gMCAmJiA8c3BhbiBjbGFzc05hbWU9XCJkaW0tMiBtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMX19Plx1MjFCMzwvc3Bhbj59XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkIG1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEyLCBsZXR0ZXJTcGFjaW5nOicwLjFlbScsIGRpc3BsYXk6J2lubGluZS1mbGV4JywgYWxpZ25JdGVtczonY2VudGVyJ319PlxuICAgICAgICAgICAgICB7Yy5hdXRob3J9XG4gICAgICAgICAgICAgIDxBdXRob3JHcmFkZUJhZGdlIGF1dGhvcklkPXtjLmF1dGhvcklkfSBhdXRob3I9e2MuYXV0aG9yfSBhdXRob3JFbWFpbD17Yy5hdXRob3JFbWFpbH0vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHRpbWUgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTF9fT57Yy5kYXRlfTwvdGltZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo2LCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XG4gICAgICAgICAgICB7Y2FuUmVwbHkgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHNldE9wZW5SZXBseVRvKG9wZW5SZXBseVRvID09PSBjLmlkID8gbnVsbCA6IGMuaWQpO1xuICAgICAgICAgICAgICAgICAgc2V0RHJhZnQob3BlblJlcGx5VG8gPT09IGMuaWQgPyAnJyA6IGBAJHtjLmF1dGhvcn0gYCk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRTaXplOjExLCBjb2xvcjondmFyKC0taW5rLTIpJ319PlxuICAgICAgICAgICAgICAgIHtvcGVuUmVwbHlUbyA9PT0gYy5pZCA/ICdcdUNERThcdUMxOEMnIDogJ1x1QjJGNVx1QUUwMCd9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHshIXVzZXIgJiYgKHVzZXIuaXNBZG1pbiB8fCBjLmF1dGhvcklkID09PSB1c2VyLmlkIHx8IGMuYXV0aG9yID09PSB1c2VyLm5hbWUpICYmIChcbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gb25EZWxldGU/LihjLmlkKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRTaXplOjExLCBjb2xvcjondmFyKC0tZGFuZ2VyKSd9fT5cdUMwQURcdUM4MUM8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8cCBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtcmVhZGluZyknLCBmb250U2l6ZTogZGVwdGggPiAwID8gMTQgOiAxNSwgbGluZUhlaWdodDoxLjgsIGNvbG9yOid2YXIoLS1pbmspJywgd2hpdGVTcGFjZToncHJlLXdyYXAnfX0+XG4gICAgICAgICAge3JlbmRlckNvbW1lbnRUZXh0KGMudGV4dCl9XG4gICAgICAgIDwvcD5cblxuICAgICAgICB7LyogXHVCMkY1XHVBRTAwIFx1Qzc4NVx1QjgyNSBcdUQzRkMgKi99XG4gICAgICAgIHtvcGVuUmVwbHlUbyA9PT0gYy5pZCAmJiAoXG4gICAgICAgICAgPGZvcm0gb25TdWJtaXQ9eyhlKSA9PiB7IGUucHJldmVudERlZmF1bHQoKTsgc3VibWl0UmVwbHkoYy5pZCk7IH19XG4gICAgICAgICAgICBzdHlsZT17e21hcmdpblRvcDoxMCwgcGFkZGluZ0xlZnQ6MjQsIGJvcmRlckxlZnQ6JzJweCBzb2xpZCB2YXIoLS1nb2xkLWRpbSknfX0+XG4gICAgICAgICAgICA8TWVudGlvblRleHRhcmVhXG4gICAgICAgICAgICAgIHZhbHVlPXtkcmFmdH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldERyYWZ0fVxuICAgICAgICAgICAgICBhdXRob3JzPXthbGxBdXRob3JzfVxuICAgICAgICAgICAgICByb3dzPXsyfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17YEAke2MuYXV0aG9yfVx1QzVEMFx1QUM4QyBcdUIyRjVcdUFFMDAuLi4gKEBcdUI5N0MgXHVDNzg1XHVCODI1XHVENTU4XHVCQTc0IFx1QkE1OFx1QzE1OCBcdUM3OTBcdUIzRDlcdUM2NDRcdUMxMzEpYH1cbiAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW5Cb3R0b206OH19Lz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J2ZsZXgtZW5kJywgZ2FwOjZ9fT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IHsgc2V0T3BlblJlcGx5VG8obnVsbCk7IHNldERyYWZ0KCcnKTsgfX0+XHVDREU4XHVDMThDPC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBkaXNhYmxlZD17IWRyYWZ0LnRyaW0oKX0+XHVCMkY1XHVBRTAwIFx1QjRGMVx1Qjg1RDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9mb3JtPlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBcdUM3OTBcdUMyREQgXHVCMkY1XHVBRTAwXHVCNEU0IFx1MjAxNCBcdUFFNEFcdUM3NzQgXHVDRUExIFx1QjNDNFx1QjJFQyBcdUM4MDRcdUFFNENcdUM5QzAgXHVDN0FDXHVBREMwLCBcdUIzQzRcdUIyRUMgXHVENkM0XHVDNUQ0ICdcdUQzQkNcdUNFNThcdUFFMzAnIFx1RDFBMFx1QUUwMCAqL31cbiAgICAgICAge2NoaWxkcmVuLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIGlzRGVlcENvbGxhcHNlZCA/IChcbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkKChzKSA9PiAoeyAuLi5zLCBbYy5pZF06IHRydWUgfSkpfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIG1hcmdpblRvcDoxMCwgbWFyZ2luTGVmdDoyNCwgZm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1pbmstMyknLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6JzRweCAxMHB4JywgYm9yZGVyOicxcHggZGFzaGVkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIFx1MjFCMyBcdUIyRjVcdUFFMDAge2NoaWxkcmVuLmxlbmd0aH1cdUFDMUMgXHVEM0JDXHVDRTU4XHVBRTMwXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPG9sIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGxpc3RTdHlsZTonbm9uZScsIHBhZGRpbmc6MCxcbiAgICAgICAgICAgICAgbWFyZ2luOiBkZXB0aCA8IE1BWF9WSVNJQkxFX0RFUFRIID8gJzEycHggMCAwIDI0cHgnIDogJzEycHggMCAwIDEycHgnLFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OicycHggc29saWQgdmFyKC0tbGluZSknLCBwYWRkaW5nTGVmdDoxNCxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7Y2hpbGRyZW4ubWFwKChyKSA9PiByZW5kZXJJdGVtKHIsIGRlcHRoICsgMSkpfVxuICAgICAgICAgICAgICB7ZGVwdGggPj0gTUFYX1ZJU0lCTEVfREVQVEggJiYgKFxuICAgICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkKChzKSA9PiAoeyAuLi5zLCBbYy5pZF06IGZhbHNlIH0pKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsIHBhZGRpbmc6JzRweCAxMHB4J319PlxuICAgICAgICAgICAgICAgICAgICBcdTIxOTEgXHVCMkY1XHVBRTAwIFx1QzgxMVx1QUUzMFxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvb2w+XG4gICAgICAgICAgKVxuICAgICAgICApfVxuICAgICAgPC9saT5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPG9sIHN0eWxlPXt7bGlzdFN0eWxlOidub25lJywgcGFkZGluZzowLCBtYXJnaW46MH19PlxuICAgICAge3RvcExldmVsLm1hcCgoYykgPT4gcmVuZGVySXRlbShjLCAwKSl9XG4gICAgPC9vbD5cbiAgKTtcbn07XG5cbi8vID09PSBAXHVCQTU4XHVDMTU4IFx1Qzc5MFx1QjNEOVx1QzY0NFx1QzEzMSB0ZXh0YXJlYSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QUMwMCBAXHVDNzQ0IFx1Qzc4NVx1QjgyNVx1RDU1OFx1QkE3NCBcdUQ2QzRcdUJDRjQgXHVCOUFDXHVDMkE0XHVEMkI4XHVCOTdDIFx1Qjc0NFx1QzZCMFx1QUNFMCwgXHVEMDc0XHVCOUFEL0VudGVyIFx1Qjg1QyBcdUIyQzlcdUIxMjRcdUM3ODRcdUM3NDQgXHVDMEJEXHVDNzg1LlxuY29uc3QgTWVudGlvblRleHRhcmVhID0gKHsgdmFsdWUsIG9uQ2hhbmdlLCBhdXRob3JzLCByb3dzID0gNCwgcGxhY2Vob2xkZXIsIHN0eWxlIH0pID0+IHtcbiAgY29uc3QgcmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gUmVhY3QudXNlU3RhdGUoJycpO1xuICBjb25zdCBbYWN0aXZlLCBzZXRBY3RpdmVdID0gUmVhY3QudXNlU3RhdGUoMCk7XG5cbiAgY29uc3QgY2FuZGlkYXRlcyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuIFtdO1xuICAgIGNvbnN0IHEgPSB0b2tlbi50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiAoYXV0aG9ycyB8fCBbXSlcbiAgICAgIC5maWx0ZXIoKGEpID0+ICFxIHx8IGEudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKSlcbiAgICAgIC5zbGljZSgwLCA2KTtcbiAgfSwgW2F1dGhvcnMsIHRva2VuLCBvcGVuXSk7XG5cbiAgY29uc3QgZGV0ZWN0TWVudGlvbiA9ICh0ZXh0LCBjYXJldCkgPT4ge1xuICAgIC8vIFx1Q0U5MFx1QjdGRiBcdUM5QzFcdUM4MDRcdUM1RDBcdUMxMUMgXHVBQzAwXHVDN0E1IFx1QUMwMFx1QUU0Q1x1QzZCNCBAXHVCOTdDIFx1Q0MzRVx1QUNFMCwgQCBcdUIyRTRcdUM3NEMgXHVCQjM4XHVDNzkwXHVBQzAwIFx1QUNGNVx1QkMzMS9cdUM5MDRcdUJDMTRcdUFGQzhcdUM3NzQgXHVDNTQ0XHVCMkNDXHVDOUMwIFx1RDY1NVx1Qzc3OC5cbiAgICBjb25zdCB1cHRvID0gdGV4dC5zbGljZSgwLCBjYXJldCk7XG4gICAgY29uc3QgbSA9IC9AKFtcXHB7TH1cXHB7Tn1fXSopJC91LmV4ZWModXB0byk7XG4gICAgaWYgKG0pIHsgc2V0VG9rZW4obVsxXSk7IHNldE9wZW4odHJ1ZSk7IHNldEFjdGl2ZSgwKTsgfVxuICAgIGVsc2UgeyBzZXRPcGVuKGZhbHNlKTsgc2V0VG9rZW4oJycpOyB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKGUpID0+IHtcbiAgICBjb25zdCB2ID0gZS50YXJnZXQudmFsdWU7XG4gICAgb25DaGFuZ2Uodik7XG4gICAgZGV0ZWN0TWVudGlvbih2LCBlLnRhcmdldC5zZWxlY3Rpb25TdGFydCB8fCB2Lmxlbmd0aCk7XG4gIH07XG5cbiAgY29uc3QgaW5zZXJ0Q2FuZGlkYXRlID0gKG5hbWUpID0+IHtcbiAgICBjb25zdCBlbCA9IHJlZi5jdXJyZW50O1xuICAgIGNvbnN0IGNhcmV0ID0gZWw/LnNlbGVjdGlvblN0YXJ0ID8/IHZhbHVlLmxlbmd0aDtcbiAgICBjb25zdCBiZWZvcmUgPSB2YWx1ZS5zbGljZSgwLCBjYXJldCk7XG4gICAgY29uc3QgYWZ0ZXIgPSB2YWx1ZS5zbGljZShjYXJldCk7XG4gICAgY29uc3QgcmVwbGFjZWQgPSBiZWZvcmUucmVwbGFjZSgvQChbXFxwe0x9XFxwe059X10qKSQvdSwgYEAke25hbWV9IGApO1xuICAgIGNvbnN0IG5leHQgPSByZXBsYWNlZCArIGFmdGVyO1xuICAgIG9uQ2hhbmdlKG5leHQpO1xuICAgIHNldE9wZW4oZmFsc2UpO1xuICAgIHNldFRva2VuKCcnKTtcbiAgICAvLyBcdUNFOTBcdUI3RkZcdUM3NDQgXHVDMEJEXHVDNzg1IFx1QjA1RFx1QzczQ1x1Qjg1QyBcdUM3NzRcdUIzRDlcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHJlcGxhY2VkLmxlbmd0aDtcbiAgICAgICAgZWw/LmZvY3VzKCk7XG4gICAgICAgIGVsPy5zZXRTZWxlY3Rpb25SYW5nZShwb3MsIHBvcyk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfSwgMCk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgaWYgKCFvcGVuIHx8IGNhbmRpZGF0ZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dEb3duJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHNldEFjdGl2ZSgoaSkgPT4gKGkgKyAxKSAlIGNhbmRpZGF0ZXMubGVuZ3RoKTsgfVxuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnQXJyb3dVcCcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzZXRBY3RpdmUoKGkpID0+IChpIC0gMSArIGNhbmRpZGF0ZXMubGVuZ3RoKSAlIGNhbmRpZGF0ZXMubGVuZ3RoKTsgfVxuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgaW5zZXJ0Q2FuZGlkYXRlKGNhbmRpZGF0ZXNbYWN0aXZlXSk7IH1cbiAgICBlbHNlIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHsgc2V0T3BlbihmYWxzZSk7IH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICA8dGV4dGFyZWEgcmVmPXtyZWZ9IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgcm93cz17cm93c31cbiAgICAgICAgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBvbktleURvd249e2hhbmRsZUtleURvd259XG4gICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn0gc3R5bGU9e3N0eWxlfS8+XG4gICAgICB7b3BlbiAmJiBjYW5kaWRhdGVzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8dWwgcm9sZT1cImxpc3Rib3hcIiBhcmlhLWxhYmVsPVwiXHVCQTU4XHVDMTU4IFx1RDZDNFx1QkNGNFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHpJbmRleDo1MCwgdG9wOicxMDAlJywgbGVmdDowLCBtYXJnaW5Ub3A6MixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgIGxpc3RTdHlsZTonbm9uZScsIHBhZGRpbmc6NCwgbWluV2lkdGg6MTgwLCBtYXhXaWR0aDoyODAsXG4gICAgICAgICAgICBib3hTaGFkb3c6JzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjA4KScsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge2NhbmRpZGF0ZXMubWFwKChuYW1lLCBpKSA9PiAoXG4gICAgICAgICAgICA8bGkga2V5PXtuYW1lfSByb2xlPVwib3B0aW9uXCIgYXJpYS1zZWxlY3RlZD17aSA9PT0gYWN0aXZlfVxuICAgICAgICAgICAgICBvbk1vdXNlRG93bj17KGUpID0+IHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBpbnNlcnRDYW5kaWRhdGUobmFtZSk7IH19XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcGFkZGluZzonNnB4IDEwcHgnLCBmb250U2l6ZToxMywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpID09PSBhY3RpdmUgPyAncmdiYSgyNDUsMjEzLDcyLDAuMTIpJyA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgY29sb3I6IGkgPT09IGFjdGl2ZSA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0taW5rKScsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBAe25hbWV9XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3VsPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PSBDb21tdW5pdHkgUGFnZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IFBPU1RTX1BFUl9QQUdFID0gMTA7XG5cbmNvbnN0IENvbW11bml0eVBhZ2UgPSAoeyBnbywgcG9zdElkLCBzZXRQb3N0SWQsIHVzZXIgfSkgPT4ge1xuICBjb25zdCB1c2VyTGV2ZWwgPSB1c2VVc2VyTGV2ZWwodXNlcik7XG4gIGNvbnN0IGNhdGVnb3JpZXMgPSBSZWFjdC51c2VNZW1vKCgpID0+IGdldENhdGVnb3JpZXNGb3JCb2FyZChcImNvbW11bml0eVwiKSwgW3Bvc3RJZF0pO1xuICBjb25zdCBbcmVmcmVzaEtleSwgc2V0UmVmcmVzaEtleV0gPSBSZWFjdC51c2VTdGF0ZSgwKTtcbiAgY29uc3QgW3RhYiwgc2V0VGFiXSA9IFJlYWN0LnVzZVN0YXRlKFwiYWxsXCIpO1xuICBjb25zdCBbYWN0aXZlUHJlZml4LCBzZXRBY3RpdmVQcmVmaXhdID0gUmVhY3QudXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtzZWFyY2gsIHNldFNlYXJjaF0gPSBSZWFjdC51c2VTdGF0ZShcIlwiKTtcbiAgY29uc3QgW3NvcnQsIHNldFNvcnRdID0gUmVhY3QudXNlU3RhdGUoXCJsYXRlc3RcIik7XG4gIGNvbnN0IFt3cml0aW5nLCBzZXRXcml0aW5nXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbcGFnZSwgc2V0UGFnZV0gPSBSZWFjdC51c2VTdGF0ZSgxKTtcblxuICAvLyBcdUM1NENcdUI5QkMgXHVCQ0E4IC8gXHVDNjc4XHVCRDgwIFx1QzlDNFx1Qzc4NVx1QzVEMFx1QzExQyBzdGFzaFx1RDU3NCBcdUI0NTQgcG9zdElkXHVBQzAwIFx1Qzc4OFx1QzczQ1x1QkE3NCBcdUM3OTBcdUIzRDlcdUM3M0NcdUI4NUMgXHVDMEMxXHVDMTM4XHVCODVDIFx1Qzc3NFx1QjNEOVxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBwZW5kaW5nID0gbnVsbDtcbiAgICB0cnkgeyBwZW5kaW5nID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYmdual9wZW5kaW5nX3Bvc3RfaWQnKTsgfSBjYXRjaCB7fVxuICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcpOyB9IGNhdGNoIHt9XG4gICAgICBzZXRQb3N0SWQocGVuZGluZyk7XG4gICAgfVxuICAgIC8vIFx1QjBCNFx1QkU0NCBcdUJBNTRcdUFDMDBcdUJBNTRcdUIyNzRcdUM1RDBcdUMxMUMgXHVCNEU0XHVDNUI0XHVDNjI4IFx1QUM4Q1x1QzJEQ1x1RDMxMCBJRFxuICAgIGxldCBwZW5kaW5nQm9hcmQgPSBudWxsO1xuICAgIHRyeSB7IHBlbmRpbmdCb2FyZCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2JnbmpfcGVuZGluZ19ib2FyZF9pZCcpOyB9IGNhdGNoIHt9XG4gICAgaWYgKHBlbmRpbmdCb2FyZCkge1xuICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnYmdual9wZW5kaW5nX2JvYXJkX2lkJyk7IH0gY2F0Y2gge31cbiAgICAgIHNldFRhYihwZW5kaW5nQm9hcmQpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIC8vIFx1QzExQ1x1QkM4NCBcdUFDOENcdUMyRENcdUFFMDAgXHVCM0Q5XHVBRTMwXHVENjU0IFx1MjAxNCBcdUQzOThcdUM3NzRcdUM5QzAgXHVDOUM0XHVDNzg1IFx1QzJEQyAxXHVENjhDICsgJ2JnbmotcG9zdHMtcmVmcmVzaCcgXHVDNzc0XHVCQ0E0XHVEMkI4XHVCOUM4XHVCMkU0IFx1QzdBQ1x1QjgwQ1x1QjM1NFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5CR05KX0NPTU1VTklUWS5yZWZyZXNoUG9zdHM/LigpO1xuICAgIGNvbnN0IG9uUmVmcmVzaCA9ICgpID0+IHNldFJlZnJlc2hLZXkoKHYpID0+IHYgKyAxKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1wb3N0cy1yZWZyZXNoJywgb25SZWZyZXNoKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotcG9zdHMtcmVmcmVzaCcsIG9uUmVmcmVzaCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBHID0gd2luZG93LkJHTkpfR1VBUkQ7XG4gIGNvbnN0IGFsbFBvc3RzID0gUmVhY3QudXNlTWVtbygoKSA9PiBHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9DT01NVU5JVFk/Lmxpc3RQb3N0cz8uKCkpLCBbcmVmcmVzaEtleV0pO1xuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMCBcdUJBQThcdUI0RTAgaG9va1x1Qzc0MCBlYXJseSByZXR1cm4gXHVDODA0XHVDNUQwIFx1QzEyMFx1QzVCOCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgdmlzaWJsZUNhdHMgPSBjYXRlZ29yaWVzLmZpbHRlcihjID0+IHVzZXJMZXZlbCA+PSAoYy5taW5MZXZlbCA/PyAwKSk7XG4gIGNvbnN0IGN1cnJlbnRCb2FyZCA9IGNhdGVnb3JpZXMuZmluZChjID0+IGMuaWQgPT09IHRhYik7XG4gIGNvbnN0IGJvYXJkUHJlZml4ZXMgPSBjdXJyZW50Qm9hcmQ/LnByZWZpeGVzIHx8IFtdO1xuICBjb25zdCBjYW5SZWFkUG9zdCA9IFJlYWN0LnVzZUNhbGxiYWNrKChwb3N0KSA9PiB7XG4gICAgaWYgKCFwb3N0KSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgY2F0ID0gY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5pZCA9PT0gcG9zdC5jYXRlZ29yeUlkKSB8fCBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmxhYmVsID09PSBwb3N0LmNhdGVnb3J5KTtcbiAgICByZXR1cm4gIWNhdCB8fCB1c2VyTGV2ZWwgPj0gKGNhdC5taW5MZXZlbCA/PyAwKTtcbiAgfSwgW2NhdGVnb3JpZXMsIHVzZXJMZXZlbF0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7IHNldEFjdGl2ZVByZWZpeChcIlwiKTsgfSwgW3RhYl0pO1xuXG4gIGNvbnN0IGZpbHRlcmVkID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgcSA9IHNlYXJjaC50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGJhc2UgPSBhbGxQb3N0cy5maWx0ZXIocCA9PiB7XG4gICAgICBjb25zdCBjYXQgPSBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmlkID09PSBwLmNhdGVnb3J5SWQpIHx8IGNhdGVnb3JpZXMuZmluZChjID0+IGMubGFiZWwgPT09IHAuY2F0ZWdvcnkpO1xuICAgICAgaWYgKGNhdCAmJiB1c2VyTGV2ZWwgPCAoY2F0Lm1pbkxldmVsID8/IDApKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAodGFiICE9PSBcImFsbFwiICYmIChwLmNhdGVnb3J5SWQgIT09IHRhYiAmJiBjYXQ/LmlkICE9PSB0YWIpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAocSAmJiAhcC50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpICYmICFTdHJpbmcocC5ib2R5Py50ZXh0IHx8ICcnKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoYWN0aXZlUHJlZml4ICYmIHAucHJlZml4ICE9PSBhY3RpdmVQcmVmaXgpIHJldHVybiBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIGlmIChzb3J0ID09PSBcInZpZXdzXCIpIHJldHVybiBbLi4uYmFzZV0uc29ydCgoYSwgYikgPT4gKGIudmlld3MgPz8gMCkgLSAoYS52aWV3cyA/PyAwKSk7XG4gICAgaWYgKHNvcnQgPT09IFwicmVwbGllc1wiKSByZXR1cm4gWy4uLmJhc2VdLnNvcnQoKGEsIGIpID0+IChiLnJlcGxpZXMgPz8gMCkgLSAoYS5yZXBsaWVzID8/IDApKTtcbiAgICBpZiAoc29ydCA9PT0gXCJsaWtlc1wiKSByZXR1cm4gWy4uLmJhc2VdLnNvcnQoKGEsIGIpID0+IChBcnJheS5pc0FycmF5KGIubGlrZXMpID8gYi5saWtlcy5sZW5ndGggOiAwKSAtIChBcnJheS5pc0FycmF5KGEubGlrZXMpID8gYS5saWtlcy5sZW5ndGggOiAwKSk7XG4gICAgcmV0dXJuIGJhc2U7XG4gIH0sIFthbGxQb3N0cywgY2F0ZWdvcmllcywgdXNlckxldmVsLCB0YWIsIHNlYXJjaCwgc29ydCwgYWN0aXZlUHJlZml4XSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHsgc2V0UGFnZSgxKTsgfSwgW3RhYiwgc2VhcmNoLCBzb3J0LCBhY3RpdmVQcmVmaXhdKTtcbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLy8gdjAwLjA2OCBcdTIwMTQgUG9zdENvbXBvc2UgXHVCQUE4XHVCMkVDIHdyYXBwZXIuIFx1QkFBOVx1Qjg1RCBcdUM3MDRcdUM1RDAgXHVCQUE4XHVCMkVDXHVCODVDIFx1RDQ1Q1x1QzJEQy4gRVNDL1x1QzY3OFx1QkQ4MFx1RDA3NFx1QjlBRCBcdUMyREMgdXNlTW9kYWxHdWFyZCBcdUFDMDAgXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1IHByb21wdC5cbiAgLy8gUG9zdENvbXBvc2UgXHVDNzU4IG9uQ2FuY2VsIFx1Qzc3NCBjbG9zZU1vZGFsIFx1QzczQ1x1Qjg1QyBcdUM1RjBcdUFDQjBcdUI0MjggKFx1Q0RFOFx1QzE4QyBcdUJDODRcdUQyQkMgPSBcdUM5ODlcdUMyREMgXHVCMkVCXHVBRTMwKS5cbiAgY29uc3QgUG9zdENvbXBvc2VNb2RhbCA9ICh7IG9uQ2xvc2UgfSkgPT4ge1xuICAgIGNvbnN0IGd1YXJkID0gd2luZG93LnVzZU1vZGFsR3VhcmQ/Lih7IG9wZW46IHRydWUsIGRpcnR5OiB0cnVlLCBvbkNsb3NlLCBvblNhdmVEcmFmdDogbnVsbCwgbGFiZWw6ICdcdUFDOENcdUMyRENcdUFFMDAnIH0pIHx8IHt9O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHJvbGU9XCJkaWFsb2dcIiBhcmlhLW1vZGFsPVwidHJ1ZVwiIGFyaWEtbGFiZWw9e3dyaXRpbmcgPT09IHRydWUgPyAnXHVDMEM4IFx1QUUwMCBcdUM3OTFcdUMxMzEnIDogJ1x1QUM4Q1x1QzJEQ1x1QUUwMCBcdUMyMThcdUM4MTUnfVxuICAgICAgICBvbkNsaWNrPXtndWFyZC5vbkJhY2tkcm9wQ2xpY2t9XG4gICAgICAgIHN0eWxlPXt7cG9zaXRpb246J2ZpeGVkJywgaW5zZXQ6MCwgYmFja2dyb3VuZDoncmdiYSgwLDAsMCwwLjU1KScsIHpJbmRleDoxMDAwLCBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonc3RhcnQgY2VudGVyJywgcGFkZGluZzoyNCwgb3ZlcmZsb3dZOidhdXRvJ319PlxuICAgICAgICA8ZGl2IG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfSBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOidtaW4oMTEwMHB4LCAxMDAlKScsIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGJveFNoYWRvdzonMCAxNnB4IDQwcHggcmdiYSgwLDAsMCwwLjI1KScsXG4gICAgICAgICAgcGFkZGluZzoyNCwgbWFyZ2luVG9wOjI0LCBtYXJnaW5Cb3R0b206NDgsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxQb3N0Q29tcG9zZVxuICAgICAgICAgICAga2V5PXt3cml0aW5nID09PSB0cnVlID8gXCJuZXdcIiA6IFN0cmluZyh3cml0aW5nLmlkKX1cbiAgICAgICAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICAgICAgICBpbml0aWFsUG9zdD17d3JpdGluZyA9PT0gdHJ1ZSA/IG51bGwgOiB3cml0aW5nfVxuICAgICAgICAgICAgb25DYW5jZWw9e29uQ2xvc2V9XG4gICAgICAgICAgICBvblB1Ymxpc2g9e2FzeW5jIChwYXlsb2FkKSA9PiB7XG4gICAgICAgICAgICAgIGxldCBzYXZlZFBvc3Q7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc2F2ZWRQb3N0ID0gd3JpdGluZyA9PT0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgPyBhd2FpdCB3aW5kb3cuQkdOSl9DT01NVU5JVFkuY3JlYXRlUG9zdFJlbW90ZShwYXlsb2FkKVxuICAgICAgICAgICAgICAgICAgOiBhd2FpdCB3aW5kb3cuQkdOSl9DT01NVU5JVFkudXBkYXRlUG9zdFJlbW90ZSh3cml0aW5nLmlkLCBwYXlsb2FkKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gXHVDMTFDXHVCQzg0IFx1QzJFNFx1RDMyOCBcdUMyREMgXHVCODVDXHVDRUVDIFx1RDNGNFx1QkMzMS5cbiAgICAgICAgICAgICAgICBzYXZlZFBvc3QgPSB3cml0aW5nID09PSB0cnVlXG4gICAgICAgICAgICAgICAgICA/IHdpbmRvdy5CR05KX0NPTU1VTklUWS5jcmVhdGVQb3N0KHBheWxvYWQpXG4gICAgICAgICAgICAgICAgICA6IHdpbmRvdy5CR05KX0NPTU1VTklUWS51cGRhdGVQb3N0KHdyaXRpbmcuaWQsIHBheWxvYWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uQ2xvc2UoKTtcbiAgICAgICAgICAgICAgc2V0UmVmcmVzaEtleSgodmFsdWUpID0+IHZhbHVlICsgMSk7XG4gICAgICAgICAgICAgIGlmIChzYXZlZFBvc3QpIHNldFBvc3RJZChzYXZlZFBvc3QuaWQpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGNhdGVnb3JpZXM9e2NhdGVnb3JpZXN9XG4gICAgICAgICAgICB1c2VyTGV2ZWw9e3VzZXJMZXZlbH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH07XG5cbiAgaWYgKHBvc3RJZCkge1xuICAgIGNvbnN0IHBvc3QgPSBhbGxQb3N0cy5maW5kKHAgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcocG9zdElkKSkgfHwgbnVsbDtcbiAgICBpZiAoIXBvc3QpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgc3R5bGU9e3ttYXhXaWR0aDo3NjAsIHRleHRBbGlnbjonY2VudGVyJywgcGFkZGluZzonODBweCAyMHB4J319PlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxNCwgbWFyZ2luQm90dG9tOjE2fX0+XHVENTc0XHVCMkY5IFx1QUM4Q1x1QzJEQ1x1QUUwMFx1Qzc0NCBcdUNDM0VcdUM3NDQgXHVDMjE4IFx1QzVDNlx1QzJCNVx1QjJDOFx1QjJFNC48L3A+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXsoKSA9PiBzZXRQb3N0SWQobnVsbCl9Plx1QkFBOVx1Qjg1RFx1QzczQ1x1Qjg1QzwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIGlmICghY2FuUmVhZFBvc3QocG9zdCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgc3R5bGU9e3ttYXhXaWR0aDo3NjAsIHRleHRBbGlnbjonY2VudGVyJywgcGFkZGluZzonODBweCAyMHB4J319PlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxNCwgbWFyZ2luQm90dG9tOjE2fX0+XHVENjA0XHVDN0FDIFx1QjRGMVx1QUUwOVx1QzczQ1x1Qjg1Q1x1QjI5NCBcdUM3NzQgXHVBQzhDXHVDMkRDXHVBRTAwXHVDNzQ0IFx1QkNGQyBcdUMyMTggXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LjwvcD5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9eygpID0+IHNldFBvc3RJZChudWxsKX0+XHVCQUE5XHVCODVEXHVDNzNDXHVCODVDPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIDxQb3N0RGV0YWlsXG4gICAgICBwb3N0PXtwb3N0fVxuICAgICAgZ289e2dvfVxuICAgICAgc2V0UG9zdElkPXtzZXRQb3N0SWR9XG4gICAgICB1c2VyPXt1c2VyfVxuICAgICAgb25SZWZyZXNoPXsoKSA9PiBzZXRSZWZyZXNoS2V5KCh2YWx1ZSkgPT4gdmFsdWUgKyAxKX1cbiAgICAgIG9uRWRpdD17KG5leHRQb3N0KSA9PiBzZXRXcml0aW5nKG5leHRQb3N0KX1cbiAgICAvPjtcbiAgfVxuXG4gIGNvbnN0IHRvdGFsUGFnZXMgPSBNYXRoLm1heCgxLCBNYXRoLmNlaWwoZmlsdGVyZWQubGVuZ3RoIC8gUE9TVFNfUEVSX1BBR0UpKTtcbiAgY29uc3Qgc2FmZVBhZ2UgPSBNYXRoLm1pbihwYWdlLCB0b3RhbFBhZ2VzKTtcbiAgY29uc3QgcGFnZVN0YXJ0ID0gKHNhZmVQYWdlIC0gMSkgKiBQT1NUU19QRVJfUEFHRTtcbiAgY29uc3QgcGFnZVBvc3RzID0gZmlsdGVyZWQuc2xpY2UocGFnZVN0YXJ0LCBwYWdlU3RhcnQgKyBQT1NUU19QRVJfUEFHRSk7XG5cbiAgY29uc3QgaGFuZGxlV3JpdGUgPSAoKSA9PiB7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBpZiAoY29uZmlybShcIlx1QUUwMFx1QzRGMFx1QUUzMFx1QjI5NCBcdUI4NUNcdUFERjhcdUM3NzggXHVENkM0IFx1Qzc3NFx1QzZBOVx1RDU2MCBcdUMyMTggXHVDNzg4XHVDMkI1XHVCMkM4XHVCMkU0LiBcdUI4NUNcdUFERjhcdUM3NzggXHVEMzk4XHVDNzc0XHVDOUMwXHVCODVDIFx1Qzc3NFx1QjNEOVx1RDU1OFx1QzJEQ1x1QUNBMFx1QzVCNFx1QzY5ND9cIikpIHtcbiAgICAgICAgZ28oXCJsb2dpblwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gV3JpdGFibGUgY2F0ZWdvcmllcyBmb3IgY3VycmVudCB1c2VyXG4gICAgY29uc3Qgd3JpdGFibGUgPSBjYXRlZ29yaWVzLmZpbHRlcihjID0+IHVzZXJMZXZlbCA+PSAoYy5wb3N0TWluTGV2ZWwgPz8gYy5taW5MZXZlbCA/PyAwKSk7XG4gICAgaWYgKHdyaXRhYmxlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWxlcnQoXCJcdUQ2MDRcdUM3QUMgXHVCNEYxXHVBRTA5XHVDNzNDXHVCODVDXHVCMjk0IFx1QUUwMFx1Qzc0NCBcdUM3OTFcdUMxMzFcdUQ1NjAgXHVDMjE4IFx1Qzc4OFx1QjI5NCBcdUFDOENcdUMyRENcdUQzMTBcdUM3NzQgXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0V3JpdGluZyh0cnVlKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGhlYWRlciBzdHlsZT17e21hcmdpbkJvdHRvbToyNH19PlxuICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgLy8gdjAwLjA3MyBcdTIwMTQgc2l0ZV9jb250ZW50X2t2LmNvbW11bml0eUludHJvIFx1QzVEMFx1QzExQyBoZXJvIFx1Qzc3RFx1QUUzMC5cbiAgICAgICAgICAgIGNvbnN0IF9pID0gKHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fSkuY29tbXVuaXR5SW50cm8gfHwge307XG4gICAgICAgICAgICBjb25zdCBlYiA9IF9pLmV5ZWJyb3cgfHwgJ0NPTU1VTklUWSBcdTAwQjcgXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwJztcbiAgICAgICAgICAgIGNvbnN0IHRwID0gX2kudGl0bGVQcmVmaXggPz8gJ1x1QjJFNFx1QzEyRiBcdUJEMDlcdUM2QjBcdUI5QUMgJztcbiAgICAgICAgICAgIGNvbnN0IHRhID0gX2kudGl0bGVBY2NlbnQgPz8gJ1x1QUQxMVx1QzdBNSc7XG4gICAgICAgICAgICBjb25zdCBzYiA9IF9pLnN1YnRpdGxlIHx8ICdcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUM3NzQgXHVCQUE4XHVDNUVDIFx1QjA5OFx1QjIwNFx1QjI5NCBcdUM3NzRcdUM1N0NcdUFFMzAuIFx1QzlDOFx1QkIzOFx1QjNDNCBcdUIyRjVcdUIzQzQgXHVENjU4XHVDNjAxXHVENTY5XHVCMkM4XHVCMkU0Lic7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+e2VifTwvZGl2PlxuICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJzZWN0aW9uLXRpdGxlXCI+e3RwfTxzcGFuIGNsYXNzTmFtZT1cImFjY2VudFwiPnt0YX08L3NwYW4+PC9oMT5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzZWN0aW9uLXN1YnRpdGxlXCI+e3NifTwvcD5cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pKCl9XG4gICAgICAgIDwvaGVhZGVyPlxuXG5cbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbToyNCwgZ2FwOjI0LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICA8ZGl2IHJvbGU9XCJ0YWJsaXN0XCIgYXJpYS1sYWJlbD1cIlx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUJEODRcdUI5NThcIlxuICAgICAgICAgICAgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjAsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwidGFiXCIgYXJpYS1zZWxlY3RlZD17dGFiID09PSBcImFsbFwifVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRUYWIoXCJhbGxcIil9XG4gICAgICAgICAgICAgIHN0eWxlPXt7cGFkZGluZzonMTRweCAyNHB4JywgZm9udFNpemU6MTMsIGxldHRlclNwYWNpbmc6JzAuMWVtJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogdGFiID09PSBcImFsbFwiID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogdGFiID09PSBcImFsbFwiID8gJzFweCBzb2xpZCB2YXIoLS1nb2xkKScgOiAnMXB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206LTF9fT5cdUM4MDRcdUNDQjQ8L2J1dHRvbj5cbiAgICAgICAgICAgIHt2aXNpYmxlQ2F0cy5tYXAoYyA9PiAoXG4gICAgICAgICAgICAgIDxidXR0b24ga2V5PXtjLmlkfSB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cInRhYlwiIGFyaWEtc2VsZWN0ZWQ9e3RhYiA9PT0gYy5pZH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRUYWIoYy5pZCl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxNHB4IDI0cHgnLCBmb250U2l6ZToxMywgbGV0dGVyU3BhY2luZzonMC4xZW0nLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IHRhYiA9PT0gYy5pZCA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0taW5rLTIpJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogdGFiID09PSBjLmlkID8gJzFweCBzb2xpZCB2YXIoLS1nb2xkKScgOiAnMXB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTotMX19PntjLmxhYmVsfTwvYnV0dG9uPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTAsIGFsaWduSXRlbXM6J2NlbnRlcicsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjb21tdW5pdHktc2VhcmNoXCIgY2xhc3NOYW1lPVwic3Itb25seVwiPlx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUFDODBcdUMwQzk8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiY29tbXVuaXR5LXNlYXJjaFwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0YWIgPT09IFwiYWxsXCIgPyBcIlx1QzgwNFx1Q0NCNCBcdUFDOENcdUMyRENcdUQzMTAgXHVBQzgwXHVDMEM5Li4uXCIgOiBgJHtjdXJyZW50Qm9hcmQ/LmxhYmVsIHx8ICcnfSBcdUFDOENcdUMyRENcdUQzMTAgXHVBQzgwXHVDMEM5Li4uYH1cbiAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaH0gb25DaGFuZ2U9e2UgPT4gc2V0U2VhcmNoKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiBzdHlsZT17e3dpZHRoOjIwMCwgcGFkZGluZzonMTBweCAxNHB4J319Lz5cbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiY29tbXVuaXR5LXNvcnRcIiBjbGFzc05hbWU9XCJzci1vbmx5XCI+XHVDODE1XHVCODJDPC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJjb21tdW5pdHktc29ydFwiIHZhbHVlPXtzb3J0fSBvbkNoYW5nZT17ZSA9PiBzZXRTb3J0KGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiBzdHlsZT17e3BhZGRpbmc6JzEwcHggMTJweCcsIGZvbnRTaXplOjEyLCBjdXJzb3I6J3BvaW50ZXInfX0+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJsYXRlc3RcIj5cdUNENUNcdUMyRTBcdUMyMUM8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInZpZXdzXCI+XHVDODcwXHVENjhDXHVDMjFDPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyZXBsaWVzXCI+XHVCMzEzXHVBRTAwXHVDMjFDPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJsaWtlc1wiPlx1Qzg4Qlx1QzU0NFx1QzY5NFx1QzIxQzwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGQgYnRuLXNtYWxsXCIgb25DbGljaz17aGFuZGxlV3JpdGV9PlxuICAgICAgICAgICAgICB7dXNlciA/ICdcdUFFMDBcdUM0RjBcdUFFMzAgXHVGRjBCJyA6ICdcdUI4NUNcdUFERjhcdUM3NzggXHVENkM0IFx1QUUwMFx1QzRGMFx1QUUzMCd9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIFx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUMxMjRcdUJBODUgXHUyMDE0IFx1RDJCOVx1QzgxNSBcdUFDOENcdUMyRENcdUQzMTAgXHVCREYwXHVDNUQwXHVDMTFDXHVCOUNDIFx1RDQ1Q1x1QzJEQyAqL31cbiAgICAgICAge3RhYiAhPT0gXCJhbGxcIiAmJiBjdXJyZW50Qm9hcmQ/LmRlc2MgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBhZGRpbmc6JzEwcHggMTZweCcsIG1hcmdpbkJvdHRvbToxNixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyTGVmdDonM3B4IHNvbGlkIHZhcigtLWdvbGQpJyxcbiAgICAgICAgICAgIGZvbnRTaXplOjEzLCBjb2xvcjondmFyKC0taW5rLTIpJywgbGluZUhlaWdodDoxLjYsXG4gICAgICAgICAgfX0+e2N1cnJlbnRCb2FyZC5kZXNjfTwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBcdUI5RDBcdUJBMzhcdUI5QUMgXHVENTQ0XHVEMTMwIFx1MjAxNCBcdUQ1NzRcdUIyRjkgXHVBQzhDXHVDMkRDXHVEMzEwXHVDNUQwIFx1QjlEMFx1QkEzOFx1QjlBQ1x1QUMwMCBcdUM3ODhcdUM3NDQgXHVCNTRDXHVCOUNDIFx1RDQ1Q1x1QzJEQyAqL31cbiAgICAgICAge2JvYXJkUHJlZml4ZXMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OCwgZmxleFdyYXA6J3dyYXAnLCBtYXJnaW5Cb3R0b206MTZ9fT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVByZWZpeChcIlwiKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwYWRkaW5nOic0cHggMTZweCcsIGJvcmRlcjonMXB4IHNvbGlkJyxcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogYWN0aXZlUHJlZml4ID09PSBcIlwiID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lLTIpJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogYWN0aXZlUHJlZml4ID09PSBcIlwiID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZVByZWZpeCA9PT0gXCJcIiA/ICdyZ2JhKDE1OCwxMDQsMjQsMC4wNiknIDogJ25vbmUnLFxuICAgICAgICAgICAgICAgIGN1cnNvcjoncG9pbnRlcicsIGZvbnRTaXplOjEzLCBsZXR0ZXJTcGFjaW5nOicwLjA1ZW0nLFxuICAgICAgICAgICAgICB9fT5cdUM4MDRcdUNDQjQ8L2J1dHRvbj5cbiAgICAgICAgICAgIHtib2FyZFByZWZpeGVzLm1hcChwID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e3B9IHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVByZWZpeChhY3RpdmVQcmVmaXggPT09IHAgPyBcIlwiIDogcCl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6JzRweCAxNnB4JywgYm9yZGVyOicxcHggc29saWQnLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IGFjdGl2ZVByZWZpeCA9PT0gcCA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0tbGluZS0yKScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogYWN0aXZlUHJlZml4ID09PSBwID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYWN0aXZlUHJlZml4ID09PSBwID8gJ3JnYmEoMTU4LDEwNCwyNCwwLjA2KScgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMywgbGV0dGVyU3BhY2luZzonMC4wNWVtJyxcbiAgICAgICAgICAgICAgICB9fT57cH08L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIDx0YWJsZSBzdHlsZT17e3dpZHRoOicxMDAlJywgYm9yZGVyQ29sbGFwc2U6J2NvbGxhcHNlJ319PlxuICAgICAgICAgIDxjYXB0aW9uIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5cdUFDOENcdUMyRENcdUFFMDAgXHVCQUE5XHVCODVEPC9jYXB0aW9uPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0ciBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4yZW0nLCBjb2xvcjondmFyKC0taW5rLTMpJywgdGV4dFRyYW5zZm9ybTondXBwZXJjYXNlJ319PlxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIiBzdHlsZT17e3BhZGRpbmc6JzE2cHggOHB4JywgdGV4dEFsaWduOidsZWZ0JywgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgd2lkdGg6NjB9fT5cdUJDODhcdUQ2Mzg8L3RoPlxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIiBzdHlsZT17e3BhZGRpbmc6JzE2cHggOHB4JywgdGV4dEFsaWduOidsZWZ0JywgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgd2lkdGg6OTB9fT5cdUJEODRcdUI5NTg8L3RoPlxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIiBzdHlsZT17e3BhZGRpbmc6JzE2cHggOHB4JywgdGV4dEFsaWduOidsZWZ0JywgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319Plx1QzgxQ1x1QkFBOTwvdGg+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiIHN0eWxlPXt7cGFkZGluZzonMTZweCA4cHgnLCB0ZXh0QWxpZ246J2xlZnQnLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB3aWR0aDoxMjB9fT5cdUM3OTFcdUMxMzFcdUM3OTA8L3RoPlxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIiBzdHlsZT17e3BhZGRpbmc6JzE2cHggOHB4JywgdGV4dEFsaWduOidyaWdodCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHdpZHRoOjcwfX0+XHVDODcwXHVENjhDPC90aD5cbiAgICAgICAgICAgICAgPHRoIHNjb3BlPVwiY29sXCIgc3R5bGU9e3twYWRkaW5nOicxNnB4IDhweCcsIHRleHRBbGlnbjoncmlnaHQnLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB3aWR0aDoxMDB9fT5cdUIwQTBcdUM5REM8L3RoPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgIHtmaWx0ZXJlZC5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgIDx0cj48dGQgY29sU3Bhbj17Nn0gc3R5bGU9e3twYWRkaW5nOjQ4LCB0ZXh0QWxpZ246J2NlbnRlcid9fSBjbGFzc05hbWU9XCJkaW1cIj5cbiAgICAgICAgICAgICAgICBcdUM4NzBcdUFDNzRcdUM1RDAgXHVCOURFXHVCMjk0IFx1QUM4Q1x1QzJEQ1x1QUUwMFx1Qzc3NCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuXG4gICAgICAgICAgICAgIDwvdGQ+PC90cj5cbiAgICAgICAgICAgICkgOiBwYWdlUG9zdHMubWFwKChwLCBpKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGNhdCA9IGNhdGVnb3JpZXMuZmluZChjID0+IGMuaWQgPT09IHAuY2F0ZWdvcnlJZCkgfHwgY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5sYWJlbCA9PT0gcC5jYXRlZ29yeSkgfHwgeyBsYWJlbDogcC5jYXRlZ29yeSB9O1xuICAgICAgICAgICAgICBjb25zdCBsaWtlc0NvdW50ID0gQXJyYXkuaXNBcnJheShwLmxpa2VzKSA/IHAubGlrZXMubGVuZ3RoIDogMDtcbiAgICAgICAgICAgICAgY29uc3QgYm9va21hcmtlZCA9IHVzZXIgJiYgRy5jYWxsKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8uaXNCb29rbWFya2VkPy4odXNlci5pZCwgcC5pZCksIGZhbHNlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8dHIga2V5PXtwLmlkfSBzdHlsZT17e2JvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgdHJhbnNpdGlvbjonYmFja2dyb3VuZCAuMnMnfX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICdyZ2JhKDI0NSwyMTMsNzIsMC4wMyknfVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3RyYW5zcGFyZW50J30+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7cGFkZGluZzonMThweCA4cHgnLCBmb250U2l6ZToxMn19PntTdHJpbmcoZmlsdGVyZWQubGVuZ3RoIC0gKHBhZ2VTdGFydCArIGkpKS5wYWRTdGFydCgzLCAnMCcpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCd9fT48c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiPntjYXQubGFiZWx9PC9zcGFuPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCcsIGZvbnRTaXplOjE1fX0gY2xhc3NOYW1lPVwicm93LXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldFBvc3RJZChwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2FsbDondW5zZXQnLCBjdXJzb3I6J3BvaW50ZXInLCB0ZXh0QWxpZ246J2xlZnQnfX0+XG4gICAgICAgICAgICAgICAgICAgICAge2Jvb2ttYXJrZWQgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIHN0eWxlPXt7bWFyZ2luUmlnaHQ6NiwgZm9udFNpemU6MTF9fSBhcmlhLWxhYmVsPVwiXHVCRDgxXHVCOUM4XHVEMDZDXCI+XHUyNjA1PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7cC50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgICB7cC5pbWFnZXM/Lmxlbmd0aCA+IDAgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZCBtb25vXCIgc3R5bGU9e3ttYXJnaW5MZWZ0OjgsIGZvbnRTaXplOjEwfX0gYXJpYS1sYWJlbD1cIlx1Qzc3NFx1QkJGOFx1QzlDMCBcdUNDQThcdUJEODBcIj5cdUQ4M0RcdURDRjd7cC5pbWFnZXMubGVuZ3RofTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAge2xpa2VzQ291bnQgPiAwICYmIDxzcGFuIGNsYXNzTmFtZT1cImdvbGQgbW9ub1wiIHN0eWxlPXt7bWFyZ2luTGVmdDo4LCBmb250U2l6ZToxMH19IGFyaWEtbGFiZWw9XCJcdUFDRjVcdUFDMTAgXHVDMjE4XCI+XHUyNjY1e2xpa2VzQ291bnR9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7cC50YWdzPy5sZW5ndGggPiAwICYmIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yIG1vbm9cIiBzdHlsZT17e21hcmdpbkxlZnQ6OCwgZm9udFNpemU6MTB9fT57cC50YWdzLnNsaWNlKDAsMykubWFwKHQgPT4gYCMke3R9YCkuam9pbignICcpfTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAge3AuaG90ICYmIDxzcGFuIGNsYXNzTmFtZT1cImdvbGRcIiBzdHlsZT17e21hcmdpbkxlZnQ6OCwgZm9udFNpemU6MTB9fT5IT1Q8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgIHtwLl9uZXcgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIHN0eWxlPXt7bWFyZ2luTGVmdDo4LCBmb250U2l6ZToxMH19Pk5FVzwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJtb25vIGRpbVwiIHN0eWxlPXt7cGFkZGluZzonMThweCA4cHgnLCBmb250U2l6ZToxMn19PlxuICAgICAgICAgICAgICAgICAgICB7cC5hdXRob3J9XG4gICAgICAgICAgICAgICAgICAgIDxBdXRob3JHcmFkZUJhZGdlIGF1dGhvcklkPXtwLmF1dGhvcklkfSBhdXRob3I9e3AuYXV0aG9yfSBhdXRob3JFbWFpbD17cC5hdXRob3JFbWFpbH0vPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCcsIGZvbnRTaXplOjEyLCB0ZXh0QWxpZ246J3JpZ2h0J319PntwLnZpZXdzID8/IDB9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCcsIGZvbnRTaXplOjExLCB0ZXh0QWxpZ246J3JpZ2h0J319PlxuICAgICAgICAgICAgICAgICAgICA8dGltZSBkYXRlVGltZT17cC5kYXRlLnJlcGxhY2UoL1xcLi9nLCctJyl9PntwLmRhdGV9PC90aW1lPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cblxuICAgICAgICB7LyogUGFnaW5hdGlvbiAqL31cbiAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA+IDAgJiYgdG90YWxQYWdlcyA+IDEgJiYgKFxuICAgICAgICAgIDxuYXYgYXJpYS1sYWJlbD1cIlx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUQzOThcdUM3NzRcdUM5QzAgXHVDNzc0XHVCM0Q5XCIgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J2NlbnRlcicsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDo2LCBtYXJnaW5Ub3A6MzIsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFBhZ2UoTWF0aC5tYXgoMSwgc2FmZVBhZ2UgLSAxKSl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzYWZlUGFnZSA8PSAxfT5cdTIxOTAgXHVDNzc0XHVDODA0PC9idXR0b24+XG4gICAgICAgICAgICB7QXJyYXkuZnJvbSh7IGxlbmd0aDogdG90YWxQYWdlcyB9LCAoXywgaWR4KSA9PiBpZHggKyAxKS5tYXAoKG4pID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e259IHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICAgICAgICBhcmlhLWN1cnJlbnQ9e24gPT09IHNhZmVQYWdlID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFBhZ2Uobil9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBuID09PSBzYWZlUGFnZSA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IG4gPT09IHNhZmVQYWdlID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogbiA9PT0gc2FmZVBhZ2UgPyAncmdiYSgyNDUsMjEzLDcyLDAuMDgpJyA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICBtaW5XaWR0aDogMzYsXG4gICAgICAgICAgICAgICAgfX0+e259PC9idXR0b24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRQYWdlKE1hdGgubWluKHRvdGFsUGFnZXMsIHNhZmVQYWdlICsgMSkpfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17c2FmZVBhZ2UgPj0gdG90YWxQYWdlc30+XHVCMkU0XHVDNzRDIFx1MjE5MjwvYnV0dG9uPlxuICAgICAgICAgIDwvbmF2PlxuICAgICAgICApfVxuXG4gICAgICAgIHtmaWx0ZXJlZC5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e3RleHRBbGlnbjonY2VudGVyJywgZm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMmVtJywgbWFyZ2luVG9wOjEyfX0+XG4gICAgICAgICAgICBcdUM4MDRcdUNDQjQge2ZpbHRlcmVkLmxlbmd0aH1cdUFDNzQgXHUwMEI3IHtzYWZlUGFnZX0ve3RvdGFsUGFnZXN9IFx1RDM5OFx1Qzc3NFx1QzlDMFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBcdUQ1NThcdUIyRTggXHVBQzgwXHVDMEM5ICsgXHVBRTAwXHVDNEYwXHVBRTMwIFx1QkMxNCAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBnYXA6MTAsIGFsaWduSXRlbXM6J2NlbnRlcicsIGp1c3RpZnlDb250ZW50OidjZW50ZXInLFxuICAgICAgICAgIG1hcmdpblRvcDo0MCwgcGFkZGluZ1RvcDoyNCwgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIGZsZXhXcmFwOid3cmFwJyxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjb21tdW5pdHktc2VhcmNoLWJvdHRvbVwiIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5cdUFDOENcdUMyRENcdUFFMDAgXHVBQzgwXHVDMEM5PC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJjb21tdW5pdHktc2VhcmNoLWJvdHRvbVwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17dGFiID09PSBcImFsbFwiID8gXCJcdUM4MDRcdUNDQjQgXHVBQzhDXHVDMkRDXHVEMzEwIFx1QUM4MFx1QzBDOS4uLlwiIDogYCR7Y3VycmVudEJvYXJkPy5sYWJlbCB8fCAnJ30gXHVBQzhDXHVDMkRDXHVEMzEwIFx1QUM4MFx1QzBDOS4uLmB9XG4gICAgICAgICAgICB2YWx1ZT17c2VhcmNofSBvbkNoYW5nZT17ZSA9PiBzZXRTZWFyY2goZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgc3R5bGU9e3t3aWR0aDoyODAsIHBhZGRpbmc6JzEycHggMTZweCcsIGZvbnRTaXplOjE0fX0vPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZFwiIG9uQ2xpY2s9e2hhbmRsZVdyaXRlfVxuICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMnB4IDI4cHgnLCBmb250U2l6ZToxM319PlxuICAgICAgICAgICAge3VzZXIgPyAnXHVBRTAwXHVDNEYwXHVBRTMwIFx1RkYwQicgOiAnXHVCODVDXHVBREY4XHVDNzc4IFx1RDZDNCBcdUFFMDBcdUM0RjBcdUFFMzAnfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgey8qIHYwMC4wNjggXHUyMDE0IFx1QUUwMFx1QzRGMFx1QUUzMCBcdUJBQThcdUIyRUMgKFx1QkFBOVx1Qjg1RCBcdUM3MDRcdUM1RDAgXHVENDVDXHVDMkRDKS4gdXNlTW9kYWxHdWFyZCBcdUI4NUMgRVNDL1x1QzY3OFx1QkQ4MFx1RDA3NFx1QjlBRCBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgcHJvbXB0LiAqL31cbiAgICAgIHt3cml0aW5nICYmIDxQb3N0Q29tcG9zZU1vZGFsIG9uQ2xvc2U9eygpID0+IHNldFdyaXRpbmcobnVsbCl9Lz59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyA9PT0gUG9zdCBDb21wb3NlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFx1QzBDOCBcdUFFMDAgXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1IFx1RDBBNCBcdTIwMTQgXHVDMEFDXHVDNkE5XHVDNzkwXHVCQ0M0XHVCODVDIFx1QkQ4NFx1QjlBQyhcdUM1RUNcdUI3RUMgXHVBQ0M0XHVDODE1XHVDNzc0IFx1QUMxOVx1Qzc0MCBcdUJFMENcdUI3N0NcdUM2QjBcdUM4MDBcdUI5N0MgXHVDNEY4IFx1QjU0QyBcdUMxMUVcdUM3NzRcdUM5QzAgXHVDNTRBXHVCM0M0XHVCODVEKS5cbmNvbnN0IGRyYWZ0S2V5Rm9yID0gKHVzZXJJZCkgPT4gYGJnbmpfcG9zdF9kcmFmdF8ke3VzZXJJZCB8fCAnZ3Vlc3QnfWA7XG5cbmNvbnN0IFBvc3RDb21wb3NlID0gKHsgdXNlciwgaW5pdGlhbFBvc3QsIG9uQ2FuY2VsLCBvblB1Ymxpc2gsIGNhdGVnb3JpZXMsIHVzZXJMZXZlbCB9KSA9PiB7XG4gIGNvbnN0IHdyaXRhYmxlID0gY2F0ZWdvcmllcy5maWx0ZXIoYyA9PiB1c2VyTGV2ZWwgPj0gKGMucG9zdE1pbkxldmVsID8/IGMubWluTGV2ZWwgPz8gMCkpO1xuICBjb25zdCBkZWZhdWx0Q2F0ZWdvcnlJZCA9IGluaXRpYWxQb3N0Py5jYXRlZ29yeUlkIHx8IHdyaXRhYmxlWzBdPy5pZCB8fCBjYXRlZ29yaWVzWzBdPy5pZCB8fCBcIlwiO1xuICBjb25zdCBpc0VkaXRpbmcgPSAhIWluaXRpYWxQb3N0O1xuXG4gIC8vIFx1QzBDOCBcdUFFMDAgXHVDNzkxXHVDMTMxXHVDNzdDIFx1QjU0Q1x1QjlDQyBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgXHVCQ0Y1XHVDNkQwL1x1QzgwMFx1QzdBNS4gXHVDMjE4XHVDODE1IFx1QkFBOFx1QjREQ1x1QzVEMFx1QzExQ1x1QjI5NCBcdUM2RDBcdUJDRjggXHVBQzhDXHVDMkRDXHVBRTAwXHVDNzc0IHNvdXJjZSBvZiB0cnV0aC5cbiAgY29uc3QgZHJhZnRLZXkgPSBkcmFmdEtleUZvcih1c2VyPy5pZCk7XG4gIGNvbnN0IGluaXRpYWxEcmFmdCA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChpc0VkaXRpbmcpIHJldHVybiBudWxsO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShkcmFmdEtleSk7XG4gICAgICByZXR1cm4gcmF3ID8gSlNPTi5wYXJzZShyYXcpIDogbnVsbDtcbiAgICB9IGNhdGNoIHsgcmV0dXJuIG51bGw7IH1cbiAgfSwgW2RyYWZ0S2V5LCBpc0VkaXRpbmddKTtcblxuICBjb25zdCBbY2F0ZWdvcnlJZCwgc2V0Q2F0ZWdvcnlJZF0gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsRHJhZnQ/LmNhdGVnb3J5SWQgfHwgZGVmYXVsdENhdGVnb3J5SWQpO1xuICBjb25zdCBbdGl0bGUsIHNldFRpdGxlXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxQb3N0Py50aXRsZSB8fCBpbml0aWFsRHJhZnQ/LnRpdGxlIHx8IFwiXCIpO1xuICBjb25zdCBbcHJlZml4LCBzZXRQcmVmaXhdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LnByZWZpeCB8fCBpbml0aWFsRHJhZnQ/LnByZWZpeCB8fCBcIlwiKTtcbiAgY29uc3QgW3RhZ3MsIHNldFRhZ3NdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LnRhZ3MgfHwgaW5pdGlhbERyYWZ0Py50YWdzIHx8IFtdKTtcbiAgY29uc3QgW2ltYWdlcywgc2V0SW1hZ2VzXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxQb3N0Py5pbWFnZXMgfHwgaW5pdGlhbERyYWZ0Py5pbWFnZXMgfHwgW10pO1xuICBjb25zdCBbYXR0YWNobWVudHMsIHNldEF0dGFjaG1lbnRzXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxQb3N0Py5hdHRhY2htZW50cyB8fCBpbml0aWFsRHJhZnQ/LmF0dGFjaG1lbnRzIHx8IFtdKTtcbiAgY29uc3QgW2JvZHlIdG1sLCBzZXRCb2R5SHRtbF0gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsUG9zdD8uYm9keT8uaHRtbCB8fCBpbml0aWFsRHJhZnQ/LmJvZHlIdG1sIHx8IFwiXCIpO1xuICBjb25zdCBbYm9keVRleHQsIHNldEJvZHlUZXh0XSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxQb3N0Py5ib2R5Py50ZXh0IHx8IGluaXRpYWxEcmFmdD8uYm9keVRleHQgfHwgXCJcIik7XG4gIC8vIHYwMC4xMTUgXHUyMDE0IGFkbWluIFx1QjlDQyBcdUQ0NUNcdUMyREM6IFx1QzVDNVx1Qjg1Q1x1QjREQyBcdUMyRENcdUM4MTAgXHVDMkRDXHVBQzA0IFx1QzYyNFx1QkM4NFx1Qjc3Q1x1Qzc3NFx1QjREQy4gJ1lZWVktTU0tRERUSEg6TU0nIFx1RDYxNVx1QzJERCAoZGF0ZXRpbWUtbG9jYWwgaW5wdXQpLlxuICAvLyBcdUFFMzBcdUM4NzQgXHVBRTAwIFx1QzIxOFx1QzgxNSBcdUMyREMgaW5pdGlhbFBvc3QuY3JlYXRlZEF0IFx1Qzc1OCBLU1QgXHVCRDgwXHVCRDg0XHVDNzQ0IGRhdGV0aW1lLWxvY2FsIFx1RDNFQ1x1QjlGN1x1QzczQ1x1Qjg1QyBcdUQ2NThcdUMwQjBcdUQ1NzQgXHVCQkY4XHVCOUFDIFx1Q0M0NFx1QzZDMC5cbiAgY29uc3QgX3RvTG9jYWxJbnB1dCA9IChpc28pID0+IHtcbiAgICBpZiAoIWlzbykgcmV0dXJuIFwiXCI7XG4gICAgdHJ5IHtcbiAgICAgIC8vIEtTVCBcdUFFMzBcdUM5MDAgJ1lZWVktTU0tRERUSEg6TU0nLlxuICAgICAgY29uc3QgcGFydHMgPSB3aW5kb3cuQkdOSl9GTVQ/LmtzdERhdGVUaW1lPy4oaXNvKTtcbiAgICAgIGlmIChwYXJ0cykgcmV0dXJuIHBhcnRzLnJlcGxhY2UoJyBLU1QnLCAnJykucmVwbGFjZSgnICcsICdUJykuc2xpY2UoMCwgMTYpO1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKGlzbyk7XG4gICAgICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICByZXR1cm4gYCR7ZC5nZXRGdWxsWWVhcigpfS0ke3BhZChkLmdldE1vbnRoKCkrMSl9LSR7cGFkKGQuZ2V0RGF0ZSgpKX1UJHtwYWQoZC5nZXRIb3VycygpKX06JHtwYWQoZC5nZXRNaW51dGVzKCkpfWA7XG4gICAgfSBjYXRjaCB7IHJldHVybiBcIlwiOyB9XG4gIH07XG4gIGNvbnN0IFtjcmVhdGVkQXQsIHNldENyZWF0ZWRBdF0gPSBSZWFjdC51c2VTdGF0ZShfdG9Mb2NhbElucHV0KGluaXRpYWxQb3N0Py5jcmVhdGVkQXQgfHwgaW5pdGlhbFBvc3Q/LmNyZWF0ZWRfYXQgfHwgXCJcIikpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbZHJhZnRSZXN0b3JlZCwgc2V0RHJhZnRSZXN0b3JlZF0gPSBSZWFjdC51c2VTdGF0ZSghIShpbml0aWFsRHJhZnQgJiYgKGluaXRpYWxEcmFmdC50aXRsZSB8fCBpbml0aWFsRHJhZnQuYm9keVRleHQpKSk7XG4gIGNvbnN0IFtzYXZlZEF0LCBzZXRTYXZlZEF0XSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxEcmFmdD8uc2F2ZWRBdCB8fCBudWxsKTtcbiAgY29uc3QgcHJldkNhdGVnb3J5SWRSZWYgPSBSZWFjdC51c2VSZWYoY2F0ZWdvcnlJZCk7XG5cbiAgLy8gXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1IFx1MjAxNCBcdUMyMThcdUM4MTUgXHVCQUE4XHVCNERDIFx1QzgxQ1x1QzY3OCwgMVx1Q0QwOCBcdUI1MTRcdUJDMTRcdUM2QjRcdUMyQTRcdUI4NUMgXHVDODAwXHVDN0E1LlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpc0VkaXRpbmcpIHJldHVybjtcbiAgICBjb25zdCBoYXNDb250ZW50ID0gISEodGl0bGUudHJpbSgpIHx8IGJvZHlUZXh0LnRyaW0oKSB8fCAodGFncyAmJiB0YWdzLmxlbmd0aCkgfHwgKGltYWdlcyAmJiBpbWFnZXMubGVuZ3RoKSB8fCAoYXR0YWNobWVudHMgJiYgYXR0YWNobWVudHMubGVuZ3RoKSk7XG4gICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGhhc0NvbnRlbnQpIHtcbiAgICAgICAgICBjb25zdCBzbmFwc2hvdCA9IHsgY2F0ZWdvcnlJZCwgdGl0bGUsIHByZWZpeCwgdGFncywgaW1hZ2VzLCBhdHRhY2htZW50cywgYm9keUh0bWwsIGJvZHlUZXh0LCBzYXZlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfTtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShkcmFmdEtleSwgSlNPTi5zdHJpbmdpZnkoc25hcHNob3QpKTtcbiAgICAgICAgICBzZXRTYXZlZEF0KHNuYXBzaG90LnNhdmVkQXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGRyYWZ0S2V5KTtcbiAgICAgICAgICBzZXRTYXZlZEF0KG51bGwpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfSwgODAwKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHQpO1xuICB9LCBbZHJhZnRLZXksIGlzRWRpdGluZywgY2F0ZWdvcnlJZCwgdGl0bGUsIHByZWZpeCwgdGFncywgaW1hZ2VzLCBhdHRhY2htZW50cywgYm9keUh0bWwsIGJvZHlUZXh0XSk7XG5cbiAgY29uc3QgY2xlYXJEcmFmdCA9ICgpID0+IHtcbiAgICB0cnkgeyBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShkcmFmdEtleSk7IH0gY2F0Y2gge31cbiAgICBzZXRTYXZlZEF0KG51bGwpO1xuICAgIHNldERyYWZ0UmVzdG9yZWQoZmFsc2UpO1xuICB9O1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0Q2F0ZWdvcnlJZChpbml0aWFsUG9zdD8uY2F0ZWdvcnlJZCB8fCBkZWZhdWx0Q2F0ZWdvcnlJZCk7XG4gICAgc2V0VGl0bGUoaW5pdGlhbFBvc3Q/LnRpdGxlIHx8IFwiXCIpO1xuICAgIHNldFByZWZpeChpbml0aWFsUG9zdD8ucHJlZml4IHx8IFwiXCIpO1xuICAgIHNldFRhZ3MoaW5pdGlhbFBvc3Q/LnRhZ3MgfHwgW10pO1xuICAgIHNldEltYWdlcyhpbml0aWFsUG9zdD8uaW1hZ2VzIHx8IFtdKTtcbiAgICBzZXRBdHRhY2htZW50cyhpbml0aWFsUG9zdD8uYXR0YWNobWVudHMgfHwgW10pO1xuICAgIHNldEJvZHlIdG1sKGluaXRpYWxQb3N0Py5ib2R5Py5odG1sIHx8IFwiXCIpO1xuICAgIHNldEJvZHlUZXh0KGluaXRpYWxQb3N0Py5ib2R5Py50ZXh0IHx8IFwiXCIpO1xuICAgIHNldEVycm9yKFwiXCIpO1xuICAgIHByZXZDYXRlZ29yeUlkUmVmLmN1cnJlbnQgPSBpbml0aWFsUG9zdD8uY2F0ZWdvcnlJZCB8fCBkZWZhdWx0Q2F0ZWdvcnlJZDtcbiAgICAvLyBpbml0aWFsUG9zdCBcdUFDMDAgXHVCNEU0XHVDNUI0XHVDNjI0XHVCQTc0ICg9IFx1QzIxOFx1QzgxNSBcdUJBQThcdUI0REMpIFx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNVx1Qzc0MCBcdUJCMzRcdUMyREMuXG4gIH0sIFtpbml0aWFsUG9zdCwgZGVmYXVsdENhdGVnb3J5SWRdKTtcblxuICBjb25zdCBzZWxlY3RlZENhdCA9IGNhdGVnb3JpZXMuZmluZChjID0+IGMuaWQgPT09IGNhdGVnb3J5SWQpO1xuICBjb25zdCBib2FyZFByZWZpeGVzID0gc2VsZWN0ZWRDYXQ/LnByZWZpeGVzIHx8IFtdO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHByZXZDYXRlZ29yeUlkUmVmLmN1cnJlbnQgPT09IGNhdGVnb3J5SWQpIHJldHVybjtcbiAgICBwcmV2Q2F0ZWdvcnlJZFJlZi5jdXJyZW50ID0gY2F0ZWdvcnlJZDtcbiAgICBpZiAoIWlzRWRpdGluZyB8fCBjYXRlZ29yeUlkICE9PSAoaW5pdGlhbFBvc3Q/LmNhdGVnb3J5SWQgfHwgXCJcIikpIHtcbiAgICAgIHNldFByZWZpeChcIlwiKTtcbiAgICB9XG4gIH0sIFtjYXRlZ29yeUlkLCBpbml0aWFsUG9zdCwgaXNFZGl0aW5nXSk7XG5cbiAgY29uc3Qgc3VibWl0ID0gKCkgPT4ge1xuICAgIHNldEVycm9yKFwiXCIpO1xuICAgIGlmICghdGl0bGUudHJpbSgpKSByZXR1cm4gc2V0RXJyb3IoXCJcdUM4MUNcdUJBQTlcdUM3NDQgXHVDNzg1XHVCODI1XHVENTc0XHVDOEZDXHVDMTM4XHVDNjk0LlwiKTtcbiAgICBpZiAoIWJvZHlUZXh0LnRyaW0oKSkgcmV0dXJuIHNldEVycm9yKFwiXHVCQ0Y4XHVCQjM4XHVDNzQ0IFx1Qzc4NVx1QjgyNVx1RDU3NFx1QzhGQ1x1QzEzOFx1QzY5NC5cIik7XG4gICAgY29uc3QgY2F0ID0gY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5pZCA9PT0gY2F0ZWdvcnlJZCk7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgLy8gXHVCQzFDXHVENTg5IFx1QzEzMVx1QUNGNSBcdUFDMDBcdUM4MTVcdUM3M0NcdUI4NUMgXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1IFx1QzgxNVx1QjlBQyAoXHVDMkU0XHVEMzI4IFx1QzJEQyBvblB1Ymxpc2ggXHVDRTIxXHVDNUQwXHVDMTFDIFx1QjJFNFx1QzJEQyBcdUM4MDBcdUM3QTVcdUM3NDAgXHVDNTQ4IFx1RDU2OCkuXG4gICAgaWYgKCFpc0VkaXRpbmcpIHtcbiAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGRyYWZ0S2V5KTsgfSBjYXRjaCB7fVxuICAgIH1cbiAgICAvLyB2MDAuMTE1IFx1MjAxNCBhZG1pbiBcdUI5Q0MgY3JlYXRlZEF0IFx1QzYyNFx1QkM4NFx1Qjc3Q1x1Qzc3NFx1QjREQyBcdUFDMDBcdUIyQTUuIFx1QjJFNFx1Qjk3OCBcdUMwQUNcdUM2QTlcdUM3OTAgXHVBQzEyIFx1QzgwNFx1QzFBMVx1Qzc0MCBcdUM2Q0NcdUNFRTRcdUFDMDAgXHVCQjM0XHVDMkRDLlxuICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICBjYXRlZ29yeUlkOiBjYXQuaWQsXG4gICAgICBjYXRlZ29yeTogY2F0LmxhYmVsLFxuICAgICAgcHJlZml4OiBwcmVmaXggfHwgXCJcIixcbiAgICAgIHRpdGxlOiB0aXRsZS50cmltKCksXG4gICAgICBhdXRob3I6IHVzZXI/Lm5hbWUgfHwgXCJcdUM3NzVcdUJBODVcIixcbiAgICAgIGF1dGhvcklkOiB1c2VyPy5pZCB8fCBudWxsLFxuICAgICAgYXV0aG9yRW1haWw6IHVzZXI/LmVtYWlsIHx8IG51bGwsXG4gICAgICByZXBsaWVzOiBpbml0aWFsUG9zdD8ucmVwbGllcyA/PyAwLFxuICAgICAgdmlld3M6IGluaXRpYWxQb3N0Py52aWV3cyA/PyAwLFxuICAgICAgZGF0ZTogYCR7bm93LmdldEZ1bGxZZWFyKCl9LiR7cGFkKG5vdy5nZXRNb250aCgpKzEpfS4ke3BhZChub3cuZ2V0RGF0ZSgpKX1gLFxuICAgICAgdGFncyxcbiAgICAgIGltYWdlcyxcbiAgICAgIGF0dGFjaG1lbnRzLFxuICAgICAgX25ldzogdHJ1ZSxcbiAgICAgIF91c2VyQ3JlYXRlZDogdHJ1ZSxcbiAgICAgIGJvZHk6IHsgaHRtbDogYm9keUh0bWwsIHRleHQ6IGJvZHlUZXh0IH0sXG4gICAgfTtcbiAgICBpZiAodXNlcj8uaXNBZG1pbiAmJiBjcmVhdGVkQXQpIHtcbiAgICAgIC8vICdZWVlZLU1NLUREVEhIOk1NJyAoS1NUIFx1QUMwMFx1QzgxNSkgXHUyMTkyIElTTyA4NjAxIHdpdGggKzA5OjAwLlxuICAgICAgcGF5bG9hZC5jcmVhdGVkQXQgPSBgJHtjcmVhdGVkQXR9OjAwKzA5OjAwYDtcbiAgICB9XG4gICAgb25QdWJsaXNoKHBheWxvYWQpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiIHN0eWxlPXt7bWF4V2lkdGg6OTYwfX0+XG4gICAgICAgIDxoZWFkZXIgc3R5bGU9e3ttYXJnaW5Cb3R0b206MzJ9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tZXllYnJvd1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPkNPTVBPU0UgXHUwMEI3IFx1QUUwMFx1QzRGMFx1QUUzMDwvZGl2PlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJzZWN0aW9uLXRpdGxlXCIgc3R5bGU9e3tmb250U2l6ZTozNn19Pntpc0VkaXRpbmcgPyBcIlx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUMyMThcdUM4MTVcIiA6IFwiXHVDMEM4IFx1QUUwMCBcdUM3OTFcdUMxMzFcIn08L2gxPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7Zm9udFNpemU6MTMsIG1hcmdpblRvcDo4fX0+XG4gICAgICAgICAgICBcdUM3OTFcdUMxMzFcdUM3OTA6IDxzcGFuIGNsYXNzTmFtZT1cImdvbGRcIj57dXNlcj8ubmFtZSB8fCAnXHVDNzc1XHVCQTg1J308L3NwYW4+XG4gICAgICAgICAgICB7IWlzRWRpdGluZyAmJiBzYXZlZEF0ICYmIChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTIgbW9ub1wiIHN0eWxlPXt7bWFyZ2luTGVmdDoxNCwgZm9udFNpemU6MTF9fT5cbiAgICAgICAgICAgICAgICBcdTAwQjcgXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1XHVCNDI4ICh7bmV3IERhdGUoc2F2ZWRBdCkudG9Mb2NhbGVUaW1lU3RyaW5nKCdrby1LUicsIHtob3VyOicyLWRpZ2l0JywgbWludXRlOicyLWRpZ2l0J30pfSlcbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L3A+XG4gICAgICAgICAgeyFpc0VkaXRpbmcgJiYgZHJhZnRSZXN0b3JlZCAmJiAoXG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJzdGF0dXNcIiBzdHlsZT17e1xuICAgICAgICAgICAgICBtYXJnaW5Ub3A6MTQsIHBhZGRpbmc6JzEwcHggMTRweCcsIGJhY2tncm91bmQ6J3JnYmEoMjQ1LDIxMyw3MiwwLjA2KScsXG4gICAgICAgICAgICAgIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWdvbGQtZGltKScsIGZvbnRTaXplOjEyLCBjb2xvcjondmFyKC0taW5rLTIpJyxcbiAgICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonY2VudGVyJywgZ2FwOjEyLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxzcGFuPlx1Qzc3NFx1QzgwNFx1QzVEMCBcdUM3OTFcdUMxMzFcdUQ1NThcdUIzNTggXHVBRTAwXHVDNzQ0IFx1QkNGNVx1QzZEMFx1RDU4OFx1QzJCNVx1QjJDOFx1QjJFNC48L3NwYW4+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0oJ1x1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNVx1QjQxQyBcdUFFMDBcdUM3NDQgXHVDMEFEXHVDODFDXHVENTU4XHVBQ0UwIFx1QzBDOFx1Qjg1QyBcdUMyRENcdUM3OTFcdUQ1NThcdUMyRENcdUFDQTBcdUM1QjRcdUM2OTQ/JykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGl0bGUoJycpOyBzZXRQcmVmaXgoJycpOyBzZXRUYWdzKFtdKTsgc2V0SW1hZ2VzKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0Qm9keUh0bWwoJycpOyBzZXRCb2R5VGV4dCgnJyk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyRHJhZnQoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1kYW5nZXIpJywgdGV4dERlY29yYXRpb246J3VuZGVybGluZSd9fT5cbiAgICAgICAgICAgICAgICBcdUMwQzhcdUI4NUMgXHVDMkRDXHVDNzkxXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9oZWFkZXI+XG5cbiAgICAgICAgPGZvcm0gb25TdWJtaXQ9eyhlKSA9PiB7IGUucHJldmVudERlZmF1bHQoKTsgc3VibWl0KCk7IH19IG5vVmFsaWRhdGU+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOicxNjBweCAxZnInLCBnYXA6MTYsIG1hcmdpbkJvdHRvbTogYm9hcmRQcmVmaXhlcy5sZW5ndGggPiAwID8gMTIgOiAyMH19PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiIHN0eWxlPXt7bWFyZ2luOjB9fT5cbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCIgaHRtbEZvcj1cInBvc3QtY2F0XCI+XHVBQzhDXHVDMkRDXHVEMzEwPC9sYWJlbD5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInBvc3QtY2F0XCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtjYXRlZ29yeUlkfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldENhdGVnb3J5SWQoZS50YXJnZXQudmFsdWUpfT5cbiAgICAgICAgICAgICAgICB7d3JpdGFibGUubWFwKGMgPT4gKFxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2MuaWR9IHZhbHVlPXtjLmlkfT57Yy5sYWJlbH08L29wdGlvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIiBzdHlsZT17e21hcmdpbjowfX0+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbFwiIGh0bWxGb3I9XCJwb3N0LXRpdGxlXCI+XHVDODFDXHVCQUE5IDxzcGFuIGNsYXNzTmFtZT1cImdvbGRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj4qPC9zcGFuPjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cInBvc3QtdGl0bGVcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJcdUM4MUNcdUJBQTlcdUM3NDQgXHVDNzg1XHVCODI1XHVENTU4XHVDMTM4XHVDNjk0XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17dGl0bGV9IG9uQ2hhbmdlPXtlID0+IHNldFRpdGxlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICByZXF1aXJlZCBtYXhMZW5ndGg9ezEyMH0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogXHVCOUQwXHVCQTM4XHVCOUFDIFx1QzEyMFx1RDBERCBcdTIwMTQgXHVDMTIwXHVEMEREXHVCNDFDIFx1QUM4Q1x1QzJEQ1x1RDMxMFx1QzVEMCBcdUI5RDBcdUJBMzhcdUI5QUNcdUFDMDAgXHVDNzg4XHVDNzQ0IFx1QjU0Q1x1QjlDQyBcdUQ0NUNcdUMyREMgKi99XG4gICAgICAgICAge2JvYXJkUHJlZml4ZXMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCIgc3R5bGU9e3ttYXJnaW5Cb3R0b206MjB9fT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbFwiPlx1QjlEMFx1QkEzOFx1QjlBQzwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo4LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UHJlZml4KFwiXCIpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOic0cHggMTRweCcsIGJvcmRlcjonMXB4IHNvbGlkJywgYm9yZGVyQ29sb3I6IHByZWZpeCA9PT0gXCJcIiA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0tbGluZSknLCBjb2xvcjogcHJlZml4ID09PSBcIlwiID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLCBiYWNrZ3JvdW5kOidub25lJywgY3Vyc29yOidwb2ludGVyJywgZm9udFNpemU6MTMsIGxldHRlclNwYWNpbmc6JzAuMDVlbSd9fT5cbiAgICAgICAgICAgICAgICAgIFx1QzVDNlx1Qzc0Q1xuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIHtib2FyZFByZWZpeGVzLm1hcCgocCkgPT4gKFxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e3B9IHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRQcmVmaXgocCl9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cGFkZGluZzonNHB4IDE0cHgnLCBib3JkZXI6JzFweCBzb2xpZCcsIGJvcmRlckNvbG9yOiBwcmVmaXggPT09IHAgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWxpbmUpJywgY29sb3I6IHByZWZpeCA9PT0gcCA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0taW5rLTIpJywgYmFja2dyb3VuZDogcHJlZml4ID09PSBwID8gJ3JnYmEoMjQ1LDIxMyw3MiwwLjA4KScgOiAnbm9uZScsIGN1cnNvcjoncG9pbnRlcicsIGZvbnRTaXplOjEzLCBsZXR0ZXJTcGFjaW5nOicwLjA1ZW0nfX0+XG4gICAgICAgICAgICAgICAgICAgIHtwfVxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHsvKiBIYXNodGFncyAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCI+XHVENTc0XHVDMkRDXHVEMERDXHVBREY4IC8gXHVCQTU0XHVEMEMwXHVEMERDXHVBREY4PC9kaXY+XG4gICAgICAgICAgICA8SGFzaHRhZ0lucHV0IHRhZ3M9e3RhZ3N9IHNldFRhZ3M9e3NldFRhZ3N9Lz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBUaXB0YXAgZWRpdG9yICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCI+XHVCQ0Y4XHVCQjM4IDxzcGFuIGNsYXNzTmFtZT1cImdvbGRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj4qPC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgICA8VGlwdGFwRWRpdG9yIGtleT17aW5pdGlhbFBvc3Q/LmlkIHx8IFwibmV3XCJ9XG4gICAgICAgICAgICAgICAgcHJlc2V0PVwic2ltcGxlXCJcbiAgICAgICAgICAgICAgICBjb250ZW50PXtib2R5SHRtbH1cbiAgICAgICAgICAgICAgICBvblVwZGF0ZT17KGh0bWwsIF9qc29uLCB0ZXh0KSA9PiB7IHNldEJvZHlIdG1sKGh0bWwpOyBzZXRCb2R5VGV4dCh0ZXh0KTsgfX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlx1QkNGOFx1QkIzOFx1Qzc0NCBcdUM3ODVcdUI4MjVcdUQ1NThcdUMxMzhcdUM2OTQuLi5cIi8+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBJbWFnZSBhdHRhY2htZW50cyAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICA8SW1hZ2VBdHRhY2hlciBpbWFnZXM9e2ltYWdlc30gc2V0SW1hZ2VzPXtzZXRJbWFnZXN9IG1heD17MTB9Lz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBGaWxlIGF0dGFjaG1lbnRzICh2MDAuMDY5KSAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICA8RmlsZUF0dGFjaGVyIGZpbGVzPXthdHRhY2htZW50c30gc2V0RmlsZXM9e3NldEF0dGFjaG1lbnRzfS8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogdjAwLjExNSBcdTIwMTQgYWRtaW4gXHVCOUNDIFx1RDQ1Q1x1QzJEQzogXHVDNUM1XHVCODVDXHVCNERDIFx1QzJEQ1x1QzgxMCBcdUMyRENcdUFDMDQoXHVENDVDXHVDMkRDXHVDNkE5KSBcdUM2MjRcdUJDODRcdUI3N0NcdUM3NzRcdUI0REMuIFx1QkU0NFx1QzZCMFx1QkE3NCBcdUQ2MDRcdUM3QUMgXHVDMkRDXHVBQzA0LiAqL31cbiAgICAgICAgICB7dXNlcj8uaXNBZG1pbiAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCIgc3R5bGU9e3twYWRkaW5nOicxMnB4IDE0cHgnLCBiYWNrZ3JvdW5kOidyZ2JhKDI0NSwyMTMsNzIsMC4wNCknLCBib3JkZXI6JzFweCBkYXNoZWQgdmFyKC0tZ29sZC1kaW0pJywgbWFyZ2luVG9wOjEyfX0+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbFwiIGh0bWxGb3I9XCJwb3N0LWNyZWF0ZWQtYXRcIiBzdHlsZT17e2Rpc3BsYXk6J2Jsb2NrJywgbWFyZ2luQm90dG9tOjZ9fT5cbiAgICAgICAgICAgICAgICBcdUM1QzVcdUI4NUNcdUI0REMgXHVDMkRDXHVBQzA0IChcdUFEMDBcdUI5QUNcdUM3OTAgXHVDODA0XHVDNkE5IFx1MDBCNyBcdUJFNDRcdUM2Q0NcdUI0NTBcdUJBNzQgXHVENjA0XHVDN0FDIFx1QzJEQ1x1QUMwNClcbiAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwicG9zdC1jcmVhdGVkLWF0XCIgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtjcmVhdGVkQXR9IG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q3JlYXRlZEF0KGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e21heFdpZHRoOjI4MH19Lz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaW0tMiBtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgbWFyZ2luVG9wOjR9fT5cbiAgICAgICAgICAgICAgICBLU1QgXHVBRTMwXHVDOTAwLiBcdUM3ODVcdUI4MjUgXHVDMkRDIFx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUQ0NUNcdUMyREMgXHVDMkRDXHVBQzAxXHVDNzc0IFx1Qzc3NCBcdUFDMTJcdUM3M0NcdUI4NUMgXHVBQ0UwXHVDODE1XHVCNDI4LlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICAgICAgPGRpdiByb2xlPVwiYWxlcnRcIiBzdHlsZT17e3BhZGRpbmc6JzEycHggMTZweCcsIGJhY2tncm91bmQ6J3JnYmEoMTk0LDc0LDYxLDAuMSknLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1kYW5nZXIpJywgY29sb3I6J3ZhcigtLWRhbmdlciknLCBmb250U2l6ZToxMywgbWFyZ2luQm90dG9tOjE2fX0+XG4gICAgICAgICAgICAgIHtlcnJvcn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxMiwganVzdGlmeUNvbnRlbnQ6J2ZsZXgtZW5kJywgcGFkZGluZ1RvcDoyMCwgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXtvbkNhbmNlbH0+XHVDREU4XHVDMThDPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGRcIj57aXNFZGl0aW5nID8gXCJcdUMyMThcdUM4MTUgXHVDODAwXHVDN0E1IFx1MjE5MlwiIDogXCJcdUFDOENcdUMyRENcdUQ1NThcdUFFMzAgXHUyMTkyXCJ9PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09IFBvc3QgRGV0YWlsID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgUG9zdERldGFpbCA9ICh7IHBvc3QsIGdvLCBzZXRQb3N0SWQsIHVzZXIsIG9uUmVmcmVzaCwgb25FZGl0IH0pID0+IHtcbiAgY29uc3QgRyA9IHdpbmRvdy5CR05KX0dVQVJEO1xuICBjb25zdCBbY29tbWVudCwgc2V0Q29tbWVudF0gPSBSZWFjdC51c2VTdGF0ZShcIlwiKTtcbiAgY29uc3QgW2NvbW1lbnRzTGlzdCwgc2V0Q29tbWVudHNMaXN0XSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+IEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8uZ2V0Q29tbWVudHM/Lihwb3N0LmlkKSkpO1xuICBjb25zdCBbcmVwb3J0T3Blbiwgc2V0UmVwb3J0T3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtyZXBvcnRSZWFzb24sIHNldFJlcG9ydFJlYXNvbl0gPSBSZWFjdC51c2VTdGF0ZShcIlwiKTtcbiAgY29uc3QgW3JlcG9ydFN1Ym1pdHRlZCwgc2V0UmVwb3J0U3VibWl0dGVkXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgY2FuTWFuYWdlUG9zdCA9ICEhdXNlciAmJiAodXNlci5pc0FkbWluIHx8IHBvc3QuYXV0aG9ySWQgPT09IHVzZXIuaWQgfHwgcG9zdC5hdXRob3IgPT09IHVzZXIubmFtZSk7XG5cbiAgLy8gXHVDODhCXHVDNTQ0XHVDNjk0IC8gXHVCRDgxXHVCOUM4XHVEMDZDIFx1MjAxNCBcdUM4MDBcdUM3QTVcdUMxOEMgXHVBRTMwXHVCQzE4XG4gIGNvbnN0IGxpa2VzID0gQXJyYXkuaXNBcnJheShwb3N0Lmxpa2VzKSA/IHBvc3QubGlrZXMgOiBbXTtcbiAgY29uc3QgbGlrZWQgPSAhIXVzZXIgJiYgbGlrZXMuaW5jbHVkZXModXNlci5pZCk7XG4gIGNvbnN0IGxpa2VzQ291bnQgPSBsaWtlcy5sZW5ndGg7XG4gIGNvbnN0IGJvb2ttYXJrZWQgPSAhIXVzZXIgJiYgRy5jYWxsKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8uaXNCb29rbWFya2VkPy4odXNlci5pZCwgcG9zdC5pZCksIGZhbHNlKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldENvbW1lbnRzTGlzdChHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LmdldENvbW1lbnRzPy4ocG9zdC5pZCkpKTtcbiAgICAvLyBcdUMxMUNcdUJDODQgXHVBQzhDXHVDMkRDXHVBRTAwXHVDNzc0XHVCQTc0IFx1QzExQ1x1QkM4NFx1QzVEMFx1QzExQyBcdUIzMTNcdUFFMDAgXHVCM0Q5XHVBRTMwXHVENjU0XG4gICAgaWYgKHBvc3QuX3JlbW90ZSkge1xuICAgICAgd2luZG93LkJHTkpfQ09NTVVOSVRZPy5yZWZyZXNoQ29tbWVudHM/Lihwb3N0LmlkKT8udGhlbj8uKCgpID0+IHtcbiAgICAgICAgc2V0Q29tbWVudHNMaXN0KEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8uZ2V0Q29tbWVudHM/Lihwb3N0LmlkKSkpO1xuICAgICAgfSk/LmNhdGNoPy4oKCkgPT4ge30pO1xuICAgIH1cbiAgICBjb25zdCBvblJlZnJlc2hDb21tZW50cyA9IChlKSA9PiB7XG4gICAgICBpZiAoZS5kZXRhaWwgJiYgU3RyaW5nKGUuZGV0YWlsLnBvc3RJZCkgPT09IFN0cmluZyhwb3N0LmlkKSkge1xuICAgICAgICBzZXRDb21tZW50c0xpc3Qod2luZG93LkJHTkpfQ09NTVVOSVRZLmdldENvbW1lbnRzKHBvc3QuaWQpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZ25qLWNvbW1lbnRzLXJlZnJlc2gnLCBvblJlZnJlc2hDb21tZW50cyk7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZ25qLWNvbW1lbnRzLXJlZnJlc2gnLCBvblJlZnJlc2hDb21tZW50cyk7XG4gIH0sIFtwb3N0LmlkXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBrZXkgPSBgYmdual92aWV3ZWRfcG9zdF8ke3Bvc3QuaWR9YDtcbiAgICB0cnkge1xuICAgICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KSkgcmV0dXJuO1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIFwiMVwiKTtcbiAgICB9IGNhdGNoIHt9XG4gICAgd2luZG93LkJHTkpfQ09NTVVOSVRZLmluY3JlbWVudFZpZXdzKHBvc3QuaWQpO1xuICAgIG9uUmVmcmVzaD8uKCk7XG4gIH0sIFtwb3N0LmlkXSk7XG5cbiAgY29uc3QgcmVxdWlyZUxvZ2luID0gKGxhYmVsKSA9PiB7XG4gICAgaWYgKGNvbmZpcm0oYCR7bGFiZWx9XHVDNzQwKFx1QjI5NCkgXHVCODVDXHVBREY4XHVDNzc4IFx1RDZDNCBcdUM3NzRcdUM2QTlcdUQ1NjAgXHVDMjE4IFx1Qzc4OFx1QzJCNVx1QjJDOFx1QjJFNC4gXHVCODVDXHVBREY4XHVDNzc4IFx1RDM5OFx1Qzc3NFx1QzlDMFx1Qjg1QyBcdUM3NzRcdUIzRDlcdUQ1NThcdUMyRENcdUFDQTBcdUM1QjRcdUM2OTQ/YCkpIHtcbiAgICAgIGdvKCdsb2dpbicpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVMaWtlID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICghdXNlcikgcmV0dXJuIHJlcXVpcmVMb2dpbignXHVBQ0Y1XHVBQzEwJyk7XG4gICAgdHJ5IHsgYXdhaXQgd2luZG93LkJHTkpfQ09NTVVOSVRZLnRvZ2dsZUxpa2UocG9zdC5pZCwgdXNlci5pZCk7IG9uUmVmcmVzaD8uKCk7IH1cbiAgICBjYXRjaCAoZXJyKSB7IGFsZXJ0KGBcdUFDRjVcdUFDMTAgXHVDQzk4XHVCOUFDIFx1QzJFNFx1RDMyODogJHtlcnI/Lm1lc3NhZ2UgfHwgJ1x1QzU0QyBcdUMyMTggXHVDNUM2XHVCMjk0IFx1QzYyNFx1Qjk1OCd9YCk7IH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVCb29rbWFyayA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoIXVzZXIpIHJldHVybiByZXF1aXJlTG9naW4oJ1x1QkQ4MVx1QjlDOFx1RDA2QycpO1xuICAgIHRyeSB7IGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWS50b2dnbGVCb29rbWFyayh1c2VyLmlkLCBwb3N0LmlkKTsgb25SZWZyZXNoPy4oKTsgfVxuICAgIGNhdGNoIChlcnIpIHsgYWxlcnQoYFx1QkQ4MVx1QjlDOFx1RDA2QyBcdUNDOThcdUI5QUMgXHVDMkU0XHVEMzI4OiAke2Vycj8ubWVzc2FnZSB8fCAnXHVDNTRDIFx1QzIxOCBcdUM1QzZcdUIyOTQgXHVDNjI0XHVCOTU4J31gKTsgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVJlcG9ydFN1Ym1pdCA9IGFzeW5jIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB3aW5kb3cuQkdOSl9DT01NVU5JVFkuYWRkUmVwb3J0KHtcbiAgICAgICAgcG9zdElkOiBwb3N0LmlkLFxuICAgICAgICBwb3N0VGl0bGU6IHBvc3QudGl0bGUsXG4gICAgICAgIHJlcG9ydGVySWQ6IHVzZXI/LmlkIHx8IG51bGwsXG4gICAgICAgIHJlcG9ydGVyTmFtZTogdXNlcj8ubmFtZSB8fCAnXHVDNzc1XHVCQTg1JyxcbiAgICAgICAgcmVhc29uOiByZXBvcnRSZWFzb24sXG4gICAgICB9KTtcbiAgICAgIHNldFJlcG9ydFN1Ym1pdHRlZCh0cnVlKTtcbiAgICAgIHNldFJlcG9ydFJlYXNvbihcIlwiKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBzZXRSZXBvcnRPcGVuKGZhbHNlKTsgc2V0UmVwb3J0U3VibWl0dGVkKGZhbHNlKTsgfSwgMTgwMCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBhbGVydChgXHVDMkUwXHVBQ0UwIFx1QzgxMVx1QzIxOCBcdUMyRTRcdUQzMjg6ICR7ZXJyPy5tZXNzYWdlIHx8ICdcdUM1NEMgXHVDMjE4IFx1QzVDNlx1QjI5NCBcdUM2MjRcdUI5NTgnfWApO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzdWJtaXRDb21tZW50ID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKCF1c2VyKSByZXR1cm47XG4gICAgY29uc3QgdHJpbW1lZCA9IGNvbW1lbnQudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgcmV0dXJuO1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IG5leHQgPSB3aW5kb3cuQkdOSl9DT01NVU5JVFkuYWRkQ29tbWVudChwb3N0LmlkLCB7XG4gICAgICBpZDogYGNvbW1lbnQtJHtEYXRlLm5vdygpfWAsXG4gICAgICBhdXRob3I6IHVzZXIubmFtZSxcbiAgICAgIGF1dGhvcklkOiB1c2VyLmlkLFxuICAgICAgYXV0aG9yRW1haWw6IHVzZXIuZW1haWwsXG4gICAgICBkYXRlOiBgJHtub3cuZ2V0RnVsbFllYXIoKX0uJHtwYWQobm93LmdldE1vbnRoKCkrMSl9LiR7cGFkKG5vdy5nZXREYXRlKCkpfSAke3BhZChub3cuZ2V0SG91cnMoKSl9OiR7cGFkKG5vdy5nZXRNaW51dGVzKCkpfWAsXG4gICAgICB0ZXh0OiB0cmltbWVkLFxuICAgIH0pO1xuICAgIHNldENvbW1lbnRzTGlzdChuZXh0KTtcblxuICAgIC8vIFx1QkNGOFx1Qzc3OCBcdUFFMDBcdUM3NzQgXHVDNTQ0XHVCMkM4XHVCQTc0IFx1Qzc5MVx1QzEzMVx1Qzc5MFx1QzVEMFx1QUM4QyBcdUM1NENcdUI5QkMuIGF1dGhvcklkXHVBQzAwIFx1Qzc4OFx1QzVCNFx1QzU3QyBcdUQ0NzhcdUMyREMgXHVBQzAwXHVCMkE1LlxuICAgIGNvbnN0IGlzTXlPd25Qb3N0ID0gcG9zdC5hdXRob3JJZCA9PT0gdXNlci5pZCB8fCBwb3N0LmF1dGhvciA9PT0gdXNlci5uYW1lO1xuICAgIGlmICghaXNNeU93blBvc3QgJiYgcG9zdC5hdXRob3JJZCkge1xuICAgICAgd2luZG93LkJHTkpfQ09NTVVOSVRZLmFkZE5vdGlmaWNhdGlvbihwb3N0LmF1dGhvcklkLCB7XG4gICAgICAgIHR5cGU6ICdjb21tZW50JyxcbiAgICAgICAgcG9zdElkOiBwb3N0LmlkLFxuICAgICAgICBwb3N0VGl0bGU6IHBvc3QudGl0bGUsXG4gICAgICAgIGZyb21OYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgIG1lc3NhZ2U6ICdcdUIwQjQgXHVBRTAwXHVDNUQwIFx1QzBDOCBcdUIzMTNcdUFFMDBcdUM3NzQgXHVCMkVDXHVCODM4XHVDMkI1XHVCMkM4XHVCMkU0LicsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBvblJlZnJlc2g/LigpO1xuICAgIHNldENvbW1lbnQoXCJcIik7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlUG9zdCA9ICgpID0+IHtcbiAgICBpZiAoIWNvbmZpcm0oYFwiJHtwb3N0LnRpdGxlfVwiIFx1QUUwMFx1Qzc0NCBcdUMwQURcdUM4MUNcdUQ1NThcdUMyRENcdUFDQTBcdUM1QjRcdUM2OTQ/YCkpIHJldHVybjtcbiAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFkuZGVsZXRlUG9zdChwb3N0LmlkKTtcbiAgICBvblJlZnJlc2g/LigpO1xuICAgIHNldFBvc3RJZChudWxsKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVDb21tZW50ID0gKGNvbW1lbnRJZCkgPT4ge1xuICAgIGNvbnN0IG5leHQgPSB3aW5kb3cuQkdOSl9DT01NVU5JVFkuZGVsZXRlQ29tbWVudChwb3N0LmlkLCBjb21tZW50SWQpO1xuICAgIHNldENvbW1lbnRzTGlzdChuZXh0KTtcbiAgICBvblJlZnJlc2g/LigpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGFydGljbGUgY2xhc3NOYW1lPVwic2VjdGlvbiBwb3N0LXJlYWRcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyIHBvc3QtcmVhZC1jb250YWluZXJcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gc2V0UG9zdElkKG51bGwpfVxuICAgICAgICAgIHN0eWxlPXt7bWFyZ2luQm90dG9tOjMyLCBjb2xvcjondmFyKC0taW5rLTIpJywgZm9udFNpemU6MTIsIGxldHRlclNwYWNpbmc6JzAuMWVtJ319PlxuICAgICAgICAgIFx1MjE5MCBcdUJBQTlcdUI4NURcdUM3M0NcdUI4NUNcbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgPGhlYWRlciBzdHlsZT17e2JvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBwYWRkaW5nQm90dG9tOjMyLCBtYXJnaW5Cb3R0b206NDh9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxMiwgbWFyZ2luQm90dG9tOjIwLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlIGJhZGdlLWdvbGRcIj57cG9zdC5jYXRlZ29yeX08L3NwYW4+XG4gICAgICAgICAgICB7cG9zdC5ob3QgJiYgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2VcIj5IT1Q8L3NwYW4+fVxuICAgICAgICAgICAge3Bvc3QuX3VzZXJDcmVhdGVkICYmIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlIGJhZGdlLWdvbGRcIj5cdUMwQzggXHVBRTAwPC9zcGFuPn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwicG9zdC10aXRsZVwiIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LWRpc3BsYXkpJyxcbiAgICAgICAgICAgIGZvbnRTaXplOidjbGFtcCgyOHB4LCAzLjV2dywgNDRweCknLFxuICAgICAgICAgICAgZm9udFdlaWdodDo1MDAsIGxpbmVIZWlnaHQ6MS4yNSwgbGV0dGVyU3BhY2luZzonLTAuMDFlbScsXG4gICAgICAgICAgICBtYXJnaW5Cb3R0b206MjQsIHRleHRXcmFwOidiYWxhbmNlJ1xuICAgICAgICAgIH19Pntwb3N0LnRpdGxlfTwvaDE+XG5cbiAgICAgICAgICB7cG9zdC50YWdzPy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjYsIGZsZXhXcmFwOid3cmFwJywgbWFyZ2luQm90dG9tOjE2fX0+XG4gICAgICAgICAgICAgIHtwb3N0LnRhZ3MubWFwKHQgPT4gPHNwYW4ga2V5PXt0fSBjbGFzc05hbWU9XCJ0YWctY2hpcFwiPiN7dH08L3NwYW4+KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoyNCwgYWxpZ25JdGVtczonY2VudGVyJywgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjEyLCBjb2xvcjondmFyKC0taW5rLTMpJywgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCIgc3R5bGU9e3tkaXNwbGF5OidpbmxpbmUtZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cbiAgICAgICAgICAgICAge3Bvc3QuYXV0aG9yfVxuICAgICAgICAgICAgICA8QXV0aG9yR3JhZGVCYWRnZSBhdXRob3JJZD17cG9zdC5hdXRob3JJZH0gYXV0aG9yPXtwb3N0LmF1dGhvcn0gYXV0aG9yRW1haWw9e3Bvc3QuYXV0aG9yRW1haWx9Lz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDx0aW1lIGRhdGVUaW1lPXtwb3N0LmRhdGUucmVwbGFjZSgvXFwuL2csJy0nKX0+e3Bvc3QuZGF0ZX08L3RpbWU+XG4gICAgICAgICAgICA8c3Bhbj5cdUM4NzBcdUQ2OEMge3Bvc3Qudmlld3MgPz8gMH08L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj5cdUIzMTNcdUFFMDAge2NvbW1lbnRzTGlzdC5sZW5ndGh9PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+XHVBQ0Y1XHVBQzEwIHtsaWtlc0NvdW50fTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9oZWFkZXI+XG5cbiAgICAgICAge3Bvc3QuYm9keT8uaHRtbCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBvc3QtYm9keVwiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiB3aW5kb3cuQkdOSl9TQUZFX0hUTUwocG9zdC5ib2R5Lmh0bWwpfX0vPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicG9zdC1ib2R5XCI+XG4gICAgICAgICAgICA8cD5cdUM1QjRcdUM4MUMgXHVDQzNEXHVCMzU1XHVBRDgxIFx1RDZDNFx1QzZEMCBcdUM1N0NcdUFDMDQgXHVCMkY1XHVDMEFDXHVCOTdDIFx1QjJFNFx1QjE0MFx1QzY1NFx1QzJCNVx1QjJDOFx1QjJFNC4gXHVDNkQwXHVCNzk4IFx1QjBBRVx1QzVEMFx1QjlDQyBcdUFDMDBcdUJEMjRcdUIzNTggXHVBQ0YzXHVDNzc0XHVDNUI0XHVDMTFDLCBcdUQ1NzRcdUFDMDAgXHVCNUE4XHVDNUI0XHVDOUM0IFx1RDZDNFx1Qzc1OCBcdUFDRjVcdUFDMDRcdUM3NzQgXHVDNUI0XHVCNUJCXHVBQzhDIFx1QjJFNFx1Qjk3NFx1QUM4QyBcdUIyRTRcdUFDMDBcdUM2MkNcdUM5QzAgXHVCQzE4XHVDMkUwXHVCQzE4XHVDNzU4XHVENTg4XHVCMjk0XHVCMzcwXHVDNjk0LjwvcD5cbiAgICAgICAgICAgIDxwPlx1QUQwMFx1Qjc4Q1x1QzgxNSBcdUM1NUVcdUM1RDAgXHVDMTMwXHVDNzQ0IFx1QjU0QywgXHVCQjM4XHVCNEREIFx1QzY1NVx1Qzc3NCBcdUM3NzQgXHVDNzkwXHVCOUFDXHVDNUQwXHVDMTFDIFx1QkIzNFx1QzVDN1x1Qzc0NCBcdUJDRjRcdUM1NThcdUM3NDRcdUFFNEMgXHUyMDE0IFx1Qjc3Q1x1QjI5NCBcdUM5QzhcdUJCMzhcdUM3NzQgXHVCNUEwXHVDNjJDXHVCNzkwXHVDMkI1XHVCMkM4XHVCMkU0LjwvcD5cbiAgICAgICAgICAgIDxibG9ja3F1b3RlPlxuICAgICAgICAgICAgICA8cD5cIlx1QzY1NVx1Qzc1OCBcdUM3OTBcdUI5QUNcdUFDMDAgXHVDNTQ0XHVCMkM4XHVCNzdDIFx1QzY1NVx1Qzc3NCBcdUJDMTRcdUI3N0NcdUJDRjggXHVBRTM4XHVDNzQ0IFx1QjUzMFx1Qjc3Q1x1QUMwMFx1Qjc3Qy5cIjwvcD5cbiAgICAgICAgICAgICAgPGNpdGU+XHUyMDE0IFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCwgXHUzMDBFXHVDNjU1XHVDNzU4XHVBRTM4XHUzMDBGIFx1QzExQ1x1QkIzODwvY2l0ZT5cbiAgICAgICAgICAgIDwvYmxvY2txdW90ZT5cbiAgICAgICAgICAgIDxwPlx1QjJFNFx1Qzc0QyBcdUIyRjVcdUMwQUNcdUFDMDAgXHVCQzhDXHVDMzY4IFx1QUUzMFx1QjJFNFx1QjgyNFx1QzlEMVx1QjJDOFx1QjJFNC48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIEltYWdlIHNsaWRlciBhdCBib3R0b20gb2YgcG9zdCAqL31cbiAgICAgICAge3Bvc3QuaW1hZ2VzPy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8c2VjdGlvbiBhcmlhLWxhYmVsPVwiXHVDQ0E4XHVCRDgwIFx1Qzc3NFx1QkJGOFx1QzlDMFwiIHN0eWxlPXt7bWFyZ2luOic0OHB4IDAnfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tZXllYnJvd1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7bWFyZ2luQm90dG9tOjE2fX0+QVRUQUNITUVOVFMgXHUwMEI3IFx1Q0NBOFx1QkQ4MCBcdUM3NzRcdUJCRjhcdUM5QzAgKHtwb3N0LmltYWdlcy5sZW5ndGh9XHVDN0E1KTwvZGl2PlxuICAgICAgICAgICAgPEltYWdlU2xpZGVyIGltYWdlcz17cG9zdC5pbWFnZXN9Lz5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIEZpbGUgYXR0YWNobWVudHMgKHYwMC4wNjkpICovfVxuICAgICAgICB7cG9zdC5hdHRhY2htZW50cz8ubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgPHNlY3Rpb24gYXJpYS1sYWJlbD1cIlx1Q0NBOFx1QkQ4MCBcdUQzMENcdUM3N0NcIiBzdHlsZT17e21hcmdpbjonNDBweCAwJ319PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e21hcmdpbkJvdHRvbToxNH19PkZJTEVTIFx1MDBCNyBcdUNDQThcdUJEODAgXHVEMzBDXHVDNzdDICh7cG9zdC5hdHRhY2htZW50cy5sZW5ndGh9KTwvZGl2PlxuICAgICAgICAgICAgPHVsIHN0eWxlPXt7bGlzdFN0eWxlOidub25lJywgcGFkZGluZzowLCBtYXJnaW46MCwgZGlzcGxheTonZmxleCcsIGZsZXhEaXJlY3Rpb246J2NvbHVtbicsIGdhcDo4fX0+XG4gICAgICAgICAgICAgIHtwb3N0LmF0dGFjaG1lbnRzLm1hcCgoYSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e2l9IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDoxMiwgcGFkZGluZzonMTBweCAxNHB4JywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLCBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGZvbnRTaXplOjEzfX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj5cdUQ4M0RcdURDQ0U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZsZXg6MSwgY29sb3I6J3ZhcigtLWluayknfX0+e2EubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMX19PntfZm10U2l6ZShhLnNpemUpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2EuZGF0YVVybH0gZG93bmxvYWQ9e2EubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIHN0eWxlPXt7Zm9udFNpemU6MTEsIHBhZGRpbmc6JzRweCAxMHB4J319XG4gICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2EubmFtZX0gXHVCMkU0XHVDNkI0XHVCODVDXHVCNERDYH0+XHVCMkU0XHVDNkI0XHVCODVDXHVCNERDPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIEFjdGlvbnMgKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW46JzYwcHggMCcsIHBhZGRpbmdUb3A6MzIsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEyLCBqdXN0aWZ5Q29udGVudDonY2VudGVyJywgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG5cIiBhcmlhLXByZXNzZWQ9e2xpa2VkfVxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVMaWtlfVxuICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOiBsaWtlZCA/ICd2YXIoLS1nb2xkKScgOiB1bmRlZmluZWQsIGNvbG9yOiBsaWtlZCA/ICd2YXIoLS1nb2xkKScgOiB1bmRlZmluZWR9fT5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHUyNjY1PC9zcGFuPiBcdUFDRjVcdUFDMTAgPHNwYW4gYXJpYS1saXZlPVwicG9saXRlXCI+e2xpa2VzQ291bnR9PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG5cIiBhcmlhLXByZXNzZWQ9e2Jvb2ttYXJrZWR9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUJvb2ttYXJrfVxuICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOiBib29rbWFya2VkID8gJ3ZhcigtLWdvbGQpJyA6IHVuZGVmaW5lZCwgY29sb3I6IGJvb2ttYXJrZWQgPyAndmFyKC0tZ29sZCknIDogdW5kZWZpbmVkfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPntib29rbWFya2VkID8gJ1x1MjYwNScgOiAnXHUyNjA2J308L3NwYW4+IFx1QkQ4MVx1QjlDOFx1RDA2Q1xuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG5cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF1c2VyKSByZXR1cm4gcmVxdWlyZUxvZ2luKCdcdUMyRTBcdUFDRTAnKTtcbiAgICAgICAgICAgICAgICBzZXRSZXBvcnRPcGVuKCh2KSA9PiAhdik7XG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBcdUMyRTBcdUFDRTBcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAge2Nhbk1hbmFnZVBvc3QgJiYgKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9eygpID0+IG9uRWRpdChwb3N0KX0+XHVDMjE4XHVDODE1PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17ZGVsZXRlUG9zdH1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6J3ZhcigtLWRhbmdlciknLCBjb2xvcjondmFyKC0tZGFuZ2VyKSd9fT5cdUMwQURcdUM4MUM8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAge3JlcG9ydE9wZW4gJiYgKFxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVJlcG9ydFN1Ym1pdH1cbiAgICAgICAgICAgICAgc3R5bGU9e3ttYXhXaWR0aDo1NjAsIG1hcmdpbjonMjRweCBhdXRvIDAnLCBwYWRkaW5nOjIwLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIGJhY2tncm91bmQ6J3JnYmEoMTk0LDc0LDYxLDAuMDQpJ319PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBsZXR0ZXJTcGFjaW5nOicwLjIyZW0nLCBtYXJnaW5Cb3R0b206MTB9fT5SRVBPUlQgXHUwMEI3IFx1QzJFMFx1QUNFMCBcdUMwQUNcdUM3MjA8L2Rpdj5cbiAgICAgICAgICAgICAge3JlcG9ydFN1Ym1pdHRlZCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGxpbmVIZWlnaHQ6MS43LCBwYWRkaW5nOic4cHggMCcsIGNvbG9yOid2YXIoLS1nb2xkKSd9fT5cbiAgICAgICAgICAgICAgICAgIFx1QzJFMFx1QUNFMFx1QUMwMCBcdUM4MTFcdUMyMThcdUI0MThcdUM1QzhcdUMyQjVcdUIyQzhcdUIyRTQuIFx1QzZCNFx1QzYwMVx1Qzc5MFx1QUMwMCBcdUQ2NTVcdUM3NzggXHVENkM0IFx1Q0M5OFx1QjlBQ1x1RDU2OVx1QjJDOFx1QjJFNC5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJcdUM1QjRcdUI1QTQgXHVDODEwXHVDNzc0IFx1QkIzOFx1QzgxQ1x1Qzc3OFx1QzlDMCBcdUFDMDRcdUIyRThcdUQ3ODggXHVDODAxXHVDNUI0IFx1QzhGQ1x1QzEzOFx1QzY5NC5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVwb3J0UmVhc29ufVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFJlcG9ydFJlYXNvbihlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7bWluSGVpZ2h0OjgwLCByZXNpemU6J3ZlcnRpY2FsJywgbWFyZ2luQm90dG9tOjEyfX0vPlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonZmxleC1lbmQnLCBnYXA6OH19PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gc2V0UmVwb3J0T3BlbihmYWxzZSl9Plx1Q0RFOFx1QzE4QzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOid2YXIoLS1kYW5nZXIpJywgY29sb3I6J3ZhcigtLWRhbmdlciknfX0+XHVDMkUwXHVBQ0UwIFx1QzgxMVx1QzIxODwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIENvbW1lbnRzICovfVxuICAgICAgICA8c2VjdGlvbiBhcmlhLWxhYmVsbGVkYnk9XCJjb21tZW50cy1oZWFkaW5nXCI+XG4gICAgICAgICAgPGgyIGlkPVwiY29tbWVudHMtaGVhZGluZ1wiIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMiwgbWFyZ2luQm90dG9tOjI0fX0+XG4gICAgICAgICAgICBcdUIzMTNcdUFFMDAgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiPntjb21tZW50c0xpc3QubGVuZ3RofTwvc3Bhbj5cbiAgICAgICAgICA8L2gyPlxuXG4gICAgICAgICAge3VzZXIgPyAoXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17c3VibWl0Q29tbWVudH0gc3R5bGU9e3ttYXJnaW5Cb3R0b206MzJ9fT5cbiAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjb21tZW50LWlucHV0XCIgY2xhc3NOYW1lPVwic3Itb25seVwiPlx1QjMxM1x1QUUwMCBcdUM3ODVcdUI4MjU8L2xhYmVsPlxuICAgICAgICAgICAgICA8TWVudGlvblRleHRhcmVhXG4gICAgICAgICAgICAgICAgdmFsdWU9e2NvbW1lbnR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldENvbW1lbnR9XG4gICAgICAgICAgICAgICAgYXV0aG9ycz17KGNvbW1lbnRzTGlzdCB8fCBbXSkubWFwKChjKSA9PiBjLmF1dGhvcikuY29uY2F0KHBvc3QuYXV0aG9yKS5maWx0ZXIoQm9vbGVhbil9XG4gICAgICAgICAgICAgICAgcm93cz17NH1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlx1QzBERFx1QUMwMVx1Qzc0NCBcdUIwOThcdUIyMDRcdUM1QjQgXHVDOEZDXHVDMTM4XHVDNjk0Li4uIChAXHVCOTdDIFx1Qzc4NVx1QjgyNVx1RDU1OFx1QkE3NCBcdUJBNThcdUMxNTggXHVDNzkwXHVCM0Q5XHVDNjQ0XHVDMTMxKVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3ttaW5IZWlnaHQ6MTAwLCByZXNpemU6J3ZlcnRpY2FsJywgbWFyZ2luQm90dG9tOjEyfX0vPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonY2VudGVyJ319PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yIG1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjExfX0+e3VzZXIubmFtZX0oXHVDNzNDKVx1Qjg1QyBcdUI0RjFcdUI4NUQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkIGJ0bi1zbWFsbFwiIGRpc2FibGVkPXshY29tbWVudC50cmltKCl9Plx1QjRGMVx1Qjg1RDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3twYWRkaW5nOjI0LCB0ZXh0QWxpZ246J2NlbnRlcicsIG1hcmdpbkJvdHRvbTozMiwgYmFja2dyb3VuZDoncmdiYSgyNDUsMjEzLDcyLDAuMDQpJ319PlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Cb3R0b206MTZ9fT5cbiAgICAgICAgICAgICAgICBcdUIzMTNcdUFFMDAgXHVDNzkxXHVDMTMxXHVDNzQwIDxzdHJvbmcgY2xhc3NOYW1lPVwiZ29sZFwiPlx1Qjg1Q1x1QURGOFx1Qzc3OFx1RDU1QyBcdUQ2OENcdUM2RDA8L3N0cm9uZz5cdUI5Q0MgXHVBQzAwXHVCMkE1XHVENTY5XHVCMkM4XHVCMkU0LlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEwLCBqdXN0aWZ5Q29udGVudDonY2VudGVyJ319PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiBnbygnbG9naW4nKX0+XHVCODVDXHVBREY4XHVDNzc4PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IGdvKCdzaWdudXAnKX0+XHVENjhDXHVDNkQwXHVBQzAwXHVDNzg1PC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIDxDb21tZW50VHJlZVxuICAgICAgICAgICAgY29tbWVudHM9e2NvbW1lbnRzTGlzdH1cbiAgICAgICAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICAgICAgICBvbkRlbGV0ZT17ZGVsZXRlQ29tbWVudH1cbiAgICAgICAgICAgIG9uUmVwbHk9eyhwYXJlbnRJZCwgdGV4dCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIXVzZXIgfHwgIXRleHQudHJpbSgpKSByZXR1cm47XG4gICAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHdpbmRvdy5CR05KX0NPTU1VTklUWS5hZGRDb21tZW50KHBvc3QuaWQsIHtcbiAgICAgICAgICAgICAgICBpZDogYGNvbW1lbnQtJHtEYXRlLm5vdygpfS0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsNCl9YCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVzZXIubmFtZSxcbiAgICAgICAgICAgICAgICBhdXRob3JJZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICAgICAgICBkYXRlOiBgJHtub3cuZ2V0RnVsbFllYXIoKX0uJHtwYWQobm93LmdldE1vbnRoKCkrMSl9LiR7cGFkKG5vdy5nZXREYXRlKCkpfSAke3BhZChub3cuZ2V0SG91cnMoKSl9OiR7cGFkKG5vdy5nZXRNaW51dGVzKCkpfWAsXG4gICAgICAgICAgICAgICAgdGV4dDogdGV4dC50cmltKCksXG4gICAgICAgICAgICAgICAgcGFyZW50SWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBzZXRDb21tZW50c0xpc3QobmV4dCk7XG4gICAgICAgICAgICAgIGNvbnN0IGlzTXlPd25Qb3N0ID0gcG9zdC5hdXRob3JJZCA9PT0gdXNlci5pZCB8fCBwb3N0LmF1dGhvciA9PT0gdXNlci5uYW1lO1xuICAgICAgICAgICAgICBpZiAoIWlzTXlPd25Qb3N0ICYmIHBvc3QuYXV0aG9ySWQpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFkuYWRkTm90aWZpY2F0aW9uKHBvc3QuYXV0aG9ySWQsIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb21tZW50JyxcbiAgICAgICAgICAgICAgICAgIHBvc3RJZDogcG9zdC5pZCxcbiAgICAgICAgICAgICAgICAgIHBvc3RUaXRsZTogcG9zdC50aXRsZSxcbiAgICAgICAgICAgICAgICAgIGZyb21OYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnXHVCMEI0IFx1QUUwMFx1QzVEMCBcdUMwQzggXHVCMkY1XHVBRTAwXHVDNzc0IFx1QjJFQ1x1QjgzOFx1QzJCNVx1QjJDOFx1QjJFNC4nLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uUmVmcmVzaD8uKCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvYXJ0aWNsZT5cbiAgKTtcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IENvbW11bml0eVBhZ2UsIEltYWdlU2xpZGVyLCBIYXNodGFnSW5wdXQsIEltYWdlQXR0YWNoZXIs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

})();

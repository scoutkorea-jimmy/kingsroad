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
        window.BGNJ_TOAST.error(`'${f.name}' R2 \uC2E4\uD328 + dataURI \uD3F4\uBC31 \uD55C\uB3C4 5MB \uCD08\uACFC \u2014 \uAC74\uB108\uB700.`);
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
  const [loadError, setLoadError] = React.useState(null);
  React.useEffect(() => {
    var _a, _b;
    (_b = (_a = window.BGNJ_COMMUNITY).refreshPosts) == null ? void 0 : _b.call(_a);
    const onRefresh = () => {
      setLoadError(null);
      setRefreshKey((v) => v + 1);
    };
    const onError = (e) => {
      var _a2;
      return setLoadError(((_a2 = e == null ? void 0 : e.detail) == null ? void 0 : _a2.message) || "\uC11C\uBC84\uC5D0\uC11C \uAC8C\uC2DC\uAE00\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    };
    const onVisibility = () => {
      var _a2, _b2;
      if (document.visibilityState !== "visible") return;
      if (!window.BGNJ_COMMUNITY._serverLoaded) (_b2 = (_a2 = window.BGNJ_COMMUNITY).refreshPosts) == null ? void 0 : _b2.call(_a2);
    };
    window.addEventListener("bgnj-posts-refresh", onRefresh);
    window.addEventListener("bgnj-posts-refresh-error", onError);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("bgnj-posts-refresh", onRefresh);
      window.removeEventListener("bgnj-posts-refresh-error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
    };
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
  React.useEffect(() => {
    if (!postId) return;
    const post = allPosts.find((p) => String(p.id) === String(postId));
    if (!post) return;
    if (post.body && (post.body.html || post.body.text)) return;
    let alive = true;
    (async () => {
      var _a, _b;
      try {
        await ((_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a._hydratePostBody) == null ? void 0 : _b.call(_a, postId));
        if (alive) setRefreshKey((v) => v + 1);
      } catch (e) {
      }
    })();
    return () => {
      alive = false;
    };
  }, [postId]);
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
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      PostDetail,
      {
        post,
        go,
        setPostId,
        user,
        onRefresh: () => setRefreshKey((value) => value + 1),
        onEdit: (nextPost) => setWriting(nextPost)
      }
    ), writing && /* @__PURE__ */ React.createElement(PostComposeModal, { onClose: () => setWriting(null) }));
  }
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(pageStart, pageStart + POSTS_PER_PAGE);
  const handleWrite = async () => {
    if (!user) {
      if (await window.BGNJ_CONFIRM("\uAE00\uC4F0\uAE30\uB294 \uB85C\uADF8\uC778 \uD6C4 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) {
        go("login");
      }
      return;
    }
    const isAdmin = !!((user == null ? void 0 : user.isAdmin) || (user == null ? void 0 : user.gradeId) === "admin");
    const writable = categories.filter((c) => {
      var _a, _b;
      if (c.id === "notice" && !isAdmin) return false;
      if (c.allowWrite === false && !isAdmin) return false;
      return userLevel >= ((_b = (_a = c.postMinLevel) != null ? _a : c.minLevel) != null ? _b : 0);
    });
    if (writable.length === 0) {
      window.BGNJ_TOAST.error("\uD604\uC7AC \uB4F1\uAE09\uC73C\uB85C\uB294 \uAE00\uC744 \uC791\uC131\uD560 \uC218 \uC788\uB294 \uAC8C\uC2DC\uD310\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");
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
  })()), loadError && /* @__PURE__ */ React.createElement("div", { role: "alert", style: {
    border: "1px solid var(--danger, #b91c1c)",
    background: "rgba(185,28,28,0.08)",
    padding: "12px 16px",
    marginBottom: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap"
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--ink)" } }, "\u26A0 \uAC8C\uC2DC\uAE00\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. ", /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11 } }, loadError)), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      onClick: () => {
        var _a, _b;
        setLoadError(null);
        (_b = (_a = window.BGNJ_COMMUNITY).refreshPosts) == null ? void 0 : _b.call(_a);
      }
    },
    "\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30"
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 24, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
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
      onClick: async () => {
        if (await window.BGNJ_CONFIRM("\uC784\uC2DC\uC800\uC7A5\uB41C \uAE00\uC744 \uC0AD\uC81C\uD558\uACE0 \uC0C8\uB85C \uC2DC\uC791\uD558\uC2DC\uACA0\uC5B4\uC694?", { danger: true })) {
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
  var _a, _b, _c, _d, _e, _f;
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
    var _a2, _b2, _c2, _d2, _e2, _f2;
    setCommentsList(G.arr(() => {
      var _a3, _b3;
      return (_b3 = (_a3 = window.BGNJ_COMMUNITY) == null ? void 0 : _a3.getComments) == null ? void 0 : _b3.call(_a3, post.id);
    }));
    if (post._remote) {
      (_f2 = (_e2 = (_d2 = (_c2 = (_b2 = (_a2 = window.BGNJ_COMMUNITY) == null ? void 0 : _a2.refreshComments) == null ? void 0 : _b2.call(_a2, post.id)) == null ? void 0 : _c2.then) == null ? void 0 : _d2.call(_c2, () => {
        setCommentsList(G.arr(() => {
          var _a3, _b3;
          return (_b3 = (_a3 = window.BGNJ_COMMUNITY) == null ? void 0 : _a3.getComments) == null ? void 0 : _b3.call(_a3, post.id);
        }));
      })) == null ? void 0 : _e2.catch) == null ? void 0 : _f2.call(_e2, () => {
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
  const requireLogin = async (label) => {
    if (await window.BGNJ_CONFIRM(`${label}\uC740(\uB294) \uB85C\uADF8\uC778 \uD6C4 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) {
      go("login");
    }
  };
  const handleLike = async () => {
    if (!user) return requireLogin("\uACF5\uAC10");
    try {
      await window.BGNJ_COMMUNITY.toggleLike(post.id, user.id);
      onRefresh == null ? void 0 : onRefresh();
    } catch (err) {
      window.BGNJ_TOAST.error(`\uACF5\uAC10 \uCC98\uB9AC \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
    }
  };
  const handleBookmark = async () => {
    if (!user) return requireLogin("\uBD81\uB9C8\uD06C");
    try {
      await window.BGNJ_COMMUNITY.toggleBookmark(user.id, post.id);
      onRefresh == null ? void 0 : onRefresh();
    } catch (err) {
      window.BGNJ_TOAST.error(`\uBD81\uB9C8\uD06C \uCC98\uB9AC \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
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
      window.BGNJ_TOAST.error(`\uC2E0\uACE0 \uC811\uC218 \uC2E4\uD328: ${(err == null ? void 0 : err.message) || "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958"}`);
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
  const deletePost = async () => {
    if (!await window.BGNJ_CONFIRM(`"${post.title}" \uAE00\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC5B4\uC694?`, { danger: true })) return;
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
  } }, post.title), ((_a = post.tags) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 } }, post.tags.map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "tag-chip" }, "#", t))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "gold", style: { display: "inline-flex", alignItems: "center" } }, post.author, /* @__PURE__ */ React.createElement(AuthorGradeBadge, { authorId: post.authorId, author: post.author, authorEmail: post.authorEmail })), /* @__PURE__ */ React.createElement("time", { dateTime: (post.createdAt || post.date || "").toString() }, post.createdAt ? window.BGNJ_FMT.kstShort(post.createdAt) : post.date), /* @__PURE__ */ React.createElement("span", null, "\uC870\uD68C ", (_b = post.views) != null ? _b : 0), /* @__PURE__ */ React.createElement("span", null, "\uB313\uAE00 ", commentsList.length), /* @__PURE__ */ React.createElement("span", null, "\uACF5\uAC10 ", likesCount))), ((_c = post.body) == null ? void 0 : _c.html) ? /* @__PURE__ */ React.createElement("div", { className: "post-body", dangerouslySetInnerHTML: { __html: window.BGNJ_SAFE_HTML(post.body.html) } }) : ((_d = post.body) == null ? void 0 : _d.text) ? /* @__PURE__ */ React.createElement("div", { className: "post-body", style: { whiteSpace: "pre-wrap" } }, post.body.text) : /* @__PURE__ */ React.createElement("div", { className: "post-body dim-2", style: { fontStyle: "italic" } }, "\uBCF8\uBB38\uC774 \uBE44\uC5B4\uC788\uC2B5\uB2C8\uB2E4."), ((_e = post.images) == null ? void 0 : _e.length) > 0 && /* @__PURE__ */ React.createElement("section", { "aria-label": "\uCCA8\uBD80 \uC774\uBBF8\uC9C0", style: { margin: "48px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true", style: { marginBottom: 16 } }, "ATTACHMENTS \xB7 \uCCA8\uBD80 \uC774\uBBF8\uC9C0 (", post.images.length, "\uC7A5)"), /* @__PURE__ */ React.createElement(ImageSlider, { images: post.images })), ((_f = post.attachments) == null ? void 0 : _f.length) > 0 && /* @__PURE__ */ React.createElement("section", { "aria-label": "\uCCA8\uBD80 \uD30C\uC77C", style: { margin: "40px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true", style: { marginBottom: 14 } }, "FILES \xB7 \uCCA8\uBD80 \uD30C\uC77C (", post.attachments.length, ")"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 } }, post.attachments.map((a, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: "1px solid var(--line)", background: "var(--bg-2)", fontSize: 13 } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u{1F4CE}"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, color: "var(--ink)" } }, a.name), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, _fmtSize(a.size)), /* @__PURE__ */ React.createElement(
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

})();

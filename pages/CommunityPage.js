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
    const results = await Promise.all(toAdd.map((f) => new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve({ dataUrl: r.result, name: f.name, size: f.size, alt: f.name.replace(/\.[^.]+$/, "") });
      r.readAsDataURL(f);
    })));
    setImages([...images, ...results]);
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
    const results = await Promise.all(accepted.map((f) => new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve({ name: f.name, type: f.type || "", size: f.size, dataUrl: r.result });
      r.readAsDataURL(f);
    })));
    setFiles([...files, ...results]);
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
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("header", { style: { marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, "COMMUNITY \xB7 \uCEE4\uBBA4\uB2C8\uD2F0"), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, "\uB2E4\uC12F \uBD09\uC6B0\uB9AC ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, "\uAD11\uC7A5")), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "\uBC45\uAE30\uB178\uC790\uC774 \uBAA8\uC5EC \uB098\uB204\uB294 \uC774\uC57C\uAE30. \uC9C8\uBB38\uB3C4 \uB2F5\uB3C4 \uD658\uC601\uD569\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 24, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
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
    onPublish({
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
    });
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
  )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement(ImageAttacher, { images, setImages, max: 10 })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement(FileAttacher, { files: attachments, setFiles: setAttachments })), error && /* @__PURE__ */ React.createElement("div", { role: "alert", style: { padding: "12px 16px", background: "rgba(194,74,61,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: 13, marginBottom: 16 } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 20, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: onCancel }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold" }, isEditing ? "\uC218\uC815 \uC800\uC7A5 \u2192" : "\uAC8C\uC2DC\uD558\uAE30 \u2192")))));
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
  } }, post.title), ((_a = post.tags) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 } }, post.tags.map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "tag-chip" }, "#", t))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "gold", style: { display: "inline-flex", alignItems: "center" } }, post.author, /* @__PURE__ */ React.createElement(AuthorGradeBadge, { authorId: post.authorId, author: post.author, authorEmail: post.authorEmail })), /* @__PURE__ */ React.createElement("time", { dateTime: post.date.replace(/\./g, "-") }, post.date), /* @__PURE__ */ React.createElement("span", null, "\uC870\uD68C ", (_b = post.views) != null ? _b : 0), /* @__PURE__ */ React.createElement("span", null, "\uB313\uAE00 ", commentsList.length), /* @__PURE__ */ React.createElement("span", null, "\uACF5\uAC10 ", likesCount))), ((_c = post.body) == null ? void 0 : _c.html) ? /* @__PURE__ */ React.createElement("div", { className: "post-body", dangerouslySetInnerHTML: { __html: post.body.html } }) : /* @__PURE__ */ React.createElement("div", { className: "post-body" }, /* @__PURE__ */ React.createElement("p", null, "\uC5B4\uC81C \uCC3D\uB355\uAD81 \uD6C4\uC6D0 \uC57C\uAC04 \uB2F5\uC0AC\uB97C \uB2E4\uB140\uC654\uC2B5\uB2C8\uB2E4. \uC6D0\uB798 \uB0AE\uC5D0\uB9CC \uAC00\uBD24\uB358 \uACF3\uC774\uC5B4\uC11C, \uD574\uAC00 \uB5A8\uC5B4\uC9C4 \uD6C4\uC758 \uACF5\uAC04\uC774 \uC5B4\uB5BB\uAC8C \uB2E4\uB974\uAC8C \uB2E4\uAC00\uC62C\uC9C0 \uBC18\uC2E0\uBC18\uC758\uD588\uB294\uB370\uC694."), /* @__PURE__ */ React.createElement("p", null, "\uAD00\uB78C\uC815 \uC55E\uC5D0 \uC130\uC744 \uB54C, \uBB38\uB4DD \uC655\uC774 \uC774 \uC790\uB9AC\uC5D0\uC11C \uBB34\uC5C7\uC744 \uBCF4\uC558\uC744\uAE4C \u2014 \uB77C\uB294 \uC9C8\uBB38\uC774 \uB5A0\uC62C\uB790\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("blockquote", null, /* @__PURE__ */ React.createElement("p", null, '"\uC655\uC758 \uC790\uB9AC\uAC00 \uC544\uB2C8\uB77C \uC655\uC774 \uBC14\uB77C\uBCF8 \uAE38\uC744 \uB530\uB77C\uAC00\uB77C."'), /* @__PURE__ */ React.createElement("cite", null, "\u2014 \uBC45\uAE30\uB178\uC790, \u300E\uC655\uC758\uAE38\u300F \uC11C\uBB38")), /* @__PURE__ */ React.createElement("p", null, "\uB2E4\uC74C \uB2F5\uC0AC\uAC00 \uBC8C\uC368 \uAE30\uB2E4\uB824\uC9D1\uB2C8\uB2E4.")), ((_d = post.images) == null ? void 0 : _d.length) > 0 && /* @__PURE__ */ React.createElement("section", { "aria-label": "\uCCA8\uBD80 \uC774\uBBF8\uC9C0", style: { margin: "48px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true", style: { marginBottom: 16 } }, "ATTACHMENTS \xB7 \uCCA8\uBD80 \uC774\uBBF8\uC9C0 (", post.images.length, "\uC7A5)"), /* @__PURE__ */ React.createElement(ImageSlider, { images: post.images })), ((_e = post.attachments) == null ? void 0 : _e.length) > 0 && /* @__PURE__ */ React.createElement("section", { "aria-label": "\uCCA8\uBD80 \uD30C\uC77C", style: { margin: "40px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true", style: { marginBottom: 14 } }, "FILES \xB7 \uCCA8\uBD80 \uD30C\uC77C (", post.attachments.length, ")"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 } }, post.attachments.map((a, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: "1px solid var(--line)", background: "var(--bg-2)", fontSize: 13 } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u{1F4CE}"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, color: "var(--ink)" } }, a.name), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, _fmtSize(a.size)), /* @__PURE__ */ React.createElement(
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvQ29tbXVuaXR5UGFnZS5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMDogXHVCQUE5XHVCODVEICsgXHVBRTAwIFx1QzBDMVx1QzEzOCArIFx1QUUwMCBcdUM3OTFcdUMxMzEgKFRpcHRhcClcbi8vIFx1QjRGMVx1QUUwOVx1QkNDNCBcdUM4MTFcdUFERkMgXHVDODFDXHVDNUI0OiBcdUM3N0RcdUFFMzAvXHVDNEYwXHVBRTMwIFx1QUQ4Q1x1RDU1Q1x1Qzc0MCBcdUNFNzRcdUQxNENcdUFDRTBcdUI5QUMubWluTGV2ZWwgLyBwb3N0TWluTGV2ZWxcdUI4NUMgXHVEMzEwXHVDODE1LlxuXG4vLyBcdUFDRjVcdUM2QTkgXHVENkM1IFx1MjAxNCBcdUFEOENcdUQ1NUMgXHVBQ0M0XHVDMEIwXG5jb25zdCB1c2VVc2VyTGV2ZWwgPSAodXNlcikgPT4gUmVhY3QudXNlTWVtbygoKSA9PiB3aW5kb3cuQkdOSl9VU0VSX0xFVkVMKHVzZXIpLCBbdXNlcl0pO1xuY29uc3QgZ2V0Q2F0ZWdvcmllc0ZvckJvYXJkID0gKGJvYXJkVHlwZSkgPT5cbiAgd2luZG93LkJHTkpfU1RPUkVTLmNhdGVnb3JpZXMuZmlsdGVyKGMgPT4gYy5ib2FyZFR5cGUgPT09IGJvYXJkVHlwZSk7XG5cbi8vID09PSBIYXNodGFnIGNoaXAgaW5wdXQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgSGFzaHRhZ0lucHV0ID0gKHsgdGFncywgc2V0VGFncywgbWF4ID0gMTAgfSkgPT4ge1xuICBjb25zdCBbaW5wdXQsIHNldElucHV0XSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBpbnB1dFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICBjb25zdCBjb21taXQgPSAocmF3KSA9PiB7XG4gICAgY29uc3QgdCA9IHJhdy50cmltKCkucmVwbGFjZSgvXiMrLywgJycpLnJlcGxhY2UoL1xccysvZywgJycpO1xuICAgIGlmICghdCkgcmV0dXJuO1xuICAgIGlmICh0YWdzLmluY2x1ZGVzKHQpKSByZXR1cm47XG4gICAgaWYgKHRhZ3MubGVuZ3RoID49IG1heCkgcmV0dXJuO1xuICAgIHNldFRhZ3MoWy4uLnRhZ3MsIHRdKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVLZXkgPSAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnLCcpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbW1pdChpbnB1dCk7XG4gICAgICBzZXRJbnB1dCgnJyk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0JhY2tzcGFjZScgJiYgIWlucHV0ICYmIHRhZ3MubGVuZ3RoKSB7XG4gICAgICBzZXRUYWdzKHRhZ3Muc2xpY2UoMCwgLTEpKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWctaW5wdXQtd3JhcFwiIG9uQ2xpY2s9eygpID0+IGlucHV0UmVmLmN1cnJlbnQ/LmZvY3VzKCl9PlxuICAgICAgICB7dGFncy5tYXAoKHQsIGkpID0+IChcbiAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cInRhZy1jaGlwXCI+XG4gICAgICAgICAgICAje3R9XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRUYWdzKHRhZ3MuZmlsdGVyKHggPT4geCAhPT0gdCkpfVxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgJHt0fSBcdUQwRENcdUFERjggXHVDMEFEXHVDODFDYH0+XHUyNzE1PC9idXR0b24+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApKX1cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgcmVmPXtpbnB1dFJlZn1cbiAgICAgICAgICB2YWx1ZT17aW5wdXR9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0SW5wdXQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIG9uS2V5RG93bj17aGFuZGxlS2V5fVxuICAgICAgICAgIG9uQmx1cj17KCkgPT4geyBpZiAoaW5wdXQudHJpbSgpKSB7IGNvbW1pdChpbnB1dCk7IHNldElucHV0KCcnKTsgfSB9fVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXt0YWdzLmxlbmd0aCA/IFwiXCIgOiBcIlx1RDBEQ1x1QURGOCBcdUM3ODVcdUI4MjUgXHVENkM0IFx1QzJBNFx1RDM5OFx1Qzc3NFx1QzJBNFx1QkMxNCAoXHVDRDVDXHVCMzAwIDEwXHVBQzFDKVwifVxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJcdUQ1NzRcdUMyRENcdUQwRENcdUFERjggXHVDNzg1XHVCODI1XCIvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWhpbnRcIiBzdHlsZT17e21hcmdpblRvcDo2fX0+XG4gICAgICAgIFx1QzJBNFx1RDM5OFx1Qzc3NFx1QzJBNFx1QkMxNCBcdTAwQjcgRW50ZXIgXHUwMEI3IFx1QzI3Q1x1RDQ1Q1x1Qjg1QyBcdUQwRENcdUFERjggXHVBRDZDXHVCRDg0IFx1MDBCNyBCYWNrc3BhY2VcdUI4NUMgXHVCOUM4XHVDOUMwXHVCOUM5IFx1RDBEQ1x1QURGOCBcdUMwQURcdUM4MUMgXHUwMEI3IHt0YWdzLmxlbmd0aH0ve21heH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09IEltYWdlIFNsaWRlciAodmlld2VyKSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgSW1hZ2VTbGlkZXIgPSAoeyBpbWFnZXMsIGF1dG9wbGF5TXMgPSA0MDAwIH0pID0+IHtcbiAgY29uc3QgW2lkeCwgc2V0SWR4XSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCBbcGF1c2VkLCBzZXRQYXVzZWRdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBwcmVmZXJzUmVkdWNlZCA9IFJlYWN0LnVzZU1lbW8oKCkgPT5cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHdpbmRvdy5tYXRjaE1lZGlhPy4oJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcywgW10pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGltYWdlcy5sZW5ndGggPD0gMSB8fCBwYXVzZWQgfHwgcHJlZmVyc1JlZHVjZWQpIHJldHVybjtcbiAgICBjb25zdCB0ID0gc2V0SW50ZXJ2YWwoKCkgPT4gc2V0SWR4KGkgPT4gKGkgKyAxKSAlIGltYWdlcy5sZW5ndGgpLCBhdXRvcGxheU1zKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbCh0KTtcbiAgfSwgW2ltYWdlcy5sZW5ndGgsIHBhdXNlZCwgYXV0b3BsYXlNcywgcHJlZmVyc1JlZHVjZWRdKTtcblxuICBpZiAoIWltYWdlcy5sZW5ndGgpIHJldHVybiBudWxsO1xuICBjb25zdCBnbyA9IChpKSA9PiBzZXRJZHgoKChpICUgaW1hZ2VzLmxlbmd0aCkgKyBpbWFnZXMubGVuZ3RoKSAlIGltYWdlcy5sZW5ndGgpO1xuXG4gIHJldHVybiAoXG4gICAgPGZpZ3VyZSBhcmlhLXJvbGVkZXNjcmlwdGlvbj1cImNhcm91c2VsXCIgYXJpYS1sYWJlbD1cIlx1Q0NBOFx1QkQ4MCBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDXCJcbiAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0UGF1c2VkKHRydWUpfSBvbk1vdXNlTGVhdmU9eygpID0+IHNldFBhdXNlZChmYWxzZSl9XG4gICAgICBvbkZvY3VzPXsoKSA9PiBzZXRQYXVzZWQodHJ1ZSl9IG9uQmx1cj17KCkgPT4gc2V0UGF1c2VkKGZhbHNlKX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy1zbGlkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLXRyYWNrXCIgc3R5bGU9e3t0cmFuc2Zvcm06IGB0cmFuc2xhdGVYKC0ke2lkeCAqIDEwMH0lKWB9fT5cbiAgICAgICAgICB7aW1hZ2VzLm1hcCgoaW1nLCBpKSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwiaW1nLXNsaWRlci1zbGlkZVwiXG4gICAgICAgICAgICAgIHJvbGU9XCJncm91cFwiIGFyaWEtcm9sZWRlc2NyaXB0aW9uPVwic2xpZGVcIiBhcmlhLWxhYmVsPXtgJHtpKzF9IC8gJHtpbWFnZXMubGVuZ3RofWB9XG4gICAgICAgICAgICAgIGFyaWEtaGlkZGVuPXtpICE9PSBpZHh9PlxuICAgICAgICAgICAgICA8aW1nIHNyYz17aW1nLmRhdGFVcmwgfHwgaW1nLnNyY30gYWx0PXtpbWcuYWx0IHx8IGltZy5uYW1lIHx8IGBcdUM3NzRcdUJCRjhcdUM5QzAgJHtpKzF9YH0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7aW1hZ2VzLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLW5hdiBwcmV2XCIgb25DbGljaz17KCkgPT4gZ28oaWR4IC0gMSl9IGFyaWEtbGFiZWw9XCJcdUM3NzRcdUM4MDQgXHVDNzc0XHVCQkY4XHVDOUMwXCI+XHUyMDM5PC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLW5hdiBuZXh0XCIgb25DbGljaz17KCkgPT4gZ28oaWR4ICsgMSl9IGFyaWEtbGFiZWw9XCJcdUIyRTRcdUM3NEMgXHVDNzc0XHVCQkY4XHVDOUMwXCI+XHUyMDNBPC9idXR0b24+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy1zbGlkZXItY2FwdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWxpdmU9XCJwb2xpdGVcIj57aWR4ICsgMX0gLyB7aW1hZ2VzLmxlbmd0aH08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW1nLXNsaWRlci1kb3RzXCIgcm9sZT1cInRhYmxpc3RcIiBhcmlhLWxhYmVsPVwiXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDIFx1QzEyMFx1RDBERFwiPlxuICAgICAgICAgICAgICB7aW1hZ2VzLm1hcCgoXywgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtpfSB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cInRhYlwiXG4gICAgICAgICAgICAgICAgICBhcmlhLWN1cnJlbnQ9e2kgPT09IGlkeH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODggXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDYH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElkeChpKX0vPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICB7aW1hZ2VzW2lkeF0/LmNhcHRpb24gJiYgKFxuICAgICAgICA8ZmlnY2FwdGlvbiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEyLCBtYXJnaW5Ub3A6OCwgdGV4dEFsaWduOidjZW50ZXInfX0+XG4gICAgICAgICAge2ltYWdlc1tpZHhdLmNhcHRpb259XG4gICAgICAgIDwvZmlnY2FwdGlvbj5cbiAgICAgICl9XG4gICAgPC9maWd1cmU+XG4gICk7XG59O1xuXG4vLyA9PT0gSW1hZ2UgcGlja2VyIChlZGl0b3Igc2lkZSkgXHUyMDE0IHVwIHRvIGBtYXhgIGltYWdlcyB3aXRoIHRodW1ibmFpbHMgPT09PT1cbmNvbnN0IEltYWdlQXR0YWNoZXIgPSAoeyBpbWFnZXMsIHNldEltYWdlcywgbWF4ID0gMTAgfSkgPT4ge1xuICBjb25zdCBpbnB1dFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICBjb25zdCBoYW5kbGVGaWxlcyA9IGFzeW5jIChmaWxlTGlzdCkgPT4ge1xuICAgIGNvbnN0IGZpbGVzID0gQXJyYXkuZnJvbShmaWxlTGlzdCB8fCBbXSk7XG4gICAgY29uc3QgcmVtYWluaW5nID0gbWF4IC0gaW1hZ2VzLmxlbmd0aDtcbiAgICBpZiAocmVtYWluaW5nIDw9IDApIHJldHVybjtcbiAgICBjb25zdCB0b0FkZCA9IGZpbGVzLnNsaWNlKDAsIHJlbWFpbmluZyk7XG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKHRvQWRkLm1hcChmID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBjb25zdCByID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgIHIub25sb2FkID0gKCkgPT4gcmVzb2x2ZSh7IGRhdGFVcmw6IHIucmVzdWx0LCBuYW1lOiBmLm5hbWUsIHNpemU6IGYuc2l6ZSwgYWx0OiBmLm5hbWUucmVwbGFjZSgvXFwuW14uXSskLywgJycpIH0pO1xuICAgICAgci5yZWFkQXNEYXRhVVJMKGYpO1xuICAgIH0pKSk7XG4gICAgc2V0SW1hZ2VzKFsuLi5pbWFnZXMsIC4uLnJlc3VsdHNdKTtcbiAgfTtcblxuICBjb25zdCByZW1vdmUgPSAoaSkgPT4gc2V0SW1hZ2VzKGltYWdlcy5maWx0ZXIoKF8sIGopID0+IGogIT09IGkpKTtcbiAgY29uc3QgbW92ZSA9IChpLCBkaXIpID0+IHtcbiAgICBjb25zdCBqID0gaSArIGRpcjtcbiAgICBpZiAoaiA8IDAgfHwgaiA+PSBpbWFnZXMubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgbmV4dCA9IGltYWdlcy5zbGljZSgpO1xuICAgIFtuZXh0W2ldLCBuZXh0W2pdXSA9IFtuZXh0W2pdLCBuZXh0W2ldXTtcbiAgICBzZXRJbWFnZXMobmV4dCk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbTo4fX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIj5cdUNDQThcdUJEODAgXHVDNzc0XHVCQkY4XHVDOUMwIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yXCI+KHtpbWFnZXMubGVuZ3RofS97bWF4fSk8L3NwYW4+PC9kaXY+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICAgIGRpc2FibGVkPXtpbWFnZXMubGVuZ3RoID49IG1heH1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBpbnB1dFJlZi5jdXJyZW50Py5jbGljaygpfT5cbiAgICAgICAgICArIFx1Qzc3NFx1QkJGOFx1QzlDMCBcdUMxMjBcdUQwRERcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxpbnB1dCByZWY9e2lucHV0UmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBtdWx0aXBsZVxuICAgICAgICBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX1cbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7IGhhbmRsZUZpbGVzKGUudGFyZ2V0LmZpbGVzKTsgZS50YXJnZXQudmFsdWUgPSAnJzsgfX0vPlxuICAgICAge2ltYWdlcy5sZW5ndGggPiAwID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy10aHVtYnNcIj5cbiAgICAgICAgICB7aW1hZ2VzLm1hcCgoaW1nLCBpKSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwiaW1nLXRodW1iXCI+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWcuZGF0YVVybCB8fCBpbWcuc3JjfSBhbHQ9e2ltZy5hbHQgfHwgYHRodW1iLSR7aX1gfS8+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImltZy10aHVtYi1vcmRlclwiPntTdHJpbmcoaSArIDEpLnBhZFN0YXJ0KDIsICcwJyl9PC9zcGFuPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJpbWctdGh1bWItcmVtb3ZlXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZW1vdmUoaSl9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YCR7aSsxfVx1QkM4OCBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDODFDXHVBQzcwYH0+XHUyNzE1PC9idXR0b24+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjonYWJzb2x1dGUnLCBib3R0b206NCwgcmlnaHQ6NCwgZGlzcGxheTonZmxleCcsIGdhcDoyfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gbW92ZShpLCAtMSl9IGRpc2FibGVkPXtpID09PSAwfVxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YCR7aSsxfVx1QkM4OCBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDNTVFXHVDNzNDXHVCODVDYH1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDoncmdiYSgwLDAsMCwwLjYpJywgYm9yZGVyOidub25lJywgY29sb3I6J3ZhcigtLWdvbGQpJywgZm9udFNpemU6MTAsIHBhZGRpbmc6JzFweCA1cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBtaW5IZWlnaHQ6MH19Plx1MjVDMDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IG1vdmUoaSwgMSl9IGRpc2FibGVkPXtpID09PSBpbWFnZXMubGVuZ3RoIC0gMX1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODggXHVDNzc0XHVCQkY4XHVDOUMwIFx1QjRBNFx1Qjg1Q2B9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6J3JnYmEoMCwwLDAsMC42KScsIGJvcmRlcjonbm9uZScsIGNvbG9yOid2YXIoLS1nb2xkKScsIGZvbnRTaXplOjEwLCBwYWRkaW5nOicxcHggNXB4JywgY3Vyc29yOidwb2ludGVyJywgbWluSGVpZ2h0OjB9fT5cdTI1QjY8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBsYWNlaG9sZGVyXCIgc3R5bGU9e3thc3BlY3RSYXRpbzonNS8xJywgZm9udFNpemU6MTB9fT5cbiAgICAgICAgICBcdUM3NzRcdUJCRjhcdUM5QzBcdUI5N0MgXHVDQ0E4XHVCRDgwXHVENTU4XHVCQTc0IFx1QzBDMVx1QzEzOCBcdUQzOThcdUM3NzRcdUM5QzAgXHVENTU4XHVCMkU4XHVDNUQwIFx1Qzc5MFx1QjNEOSBcdUMyQUNcdUI3N0NcdUM3NzRcdUI0RENcdUI4NUMgXHVENDVDXHVDMkRDXHVCNDI5XHVCMkM4XHVCMkU0XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PSBGaWxlIGF0dGFjaGVyICh2MDAuMDY5KSBcdTIwMTQgXHVCRTQ0LVx1Qzc3NFx1QkJGOFx1QzlDMCBcdUQzMENcdUM3N0MgXHVDQ0E4XHVCRDgwLCAxME1CIFx1MDBENyBcdUNENUNcdUIzMDAgMyA9PT09PT1cbi8vIFx1QUM4Q1x1QzJEQ1x1QUUwMFx1QzVEMCBhdHRhY2htZW50czogW3sgbmFtZSwgdHlwZSwgc2l6ZSwgZGF0YVVybCB9XSBcdUM3M0NcdUI4NUMgXHVDODAwXHVDN0E1LiBkYXRhVXJsIFx1Qzc0MCBiYXNlNjQuXG4vLyBcdUJDRjRcdUFEMDAgXHVENTVDXHVCM0M0XHVBQzAwIFx1Qzc5MVx1QzU0NCB2MSBcdUM3NDAgRDEgXHVDNzc4XHVCNzdDXHVDNzc4IEpTT04uIFx1Q0Q5NFx1RDZDNCBSMiBcdUM1QzVcdUI4NUNcdUI0REMgXHVENzUwXHVCOTg0XHVDNzQwIFx1QkNDNFx1QjNDNCBcdUMwQUNcdUM3NzRcdUQwNzQuXG5jb25zdCBGSUxFX01BWF9TSVpFID0gMTAgKiAxMDI0ICogMTAyNDsgLy8gMTBNQlxuY29uc3QgRklMRV9NQVhfQ09VTlQgPSAzO1xuY29uc3QgX2ZtdFNpemUgPSAobikgPT4ge1xuICBpZiAoIW4gJiYgbiAhPT0gMCkgcmV0dXJuICcnO1xuICBpZiAobiA8IDEwMjQpIHJldHVybiBgJHtufSBCYDtcbiAgaWYgKG4gPCAxMDI0ICogMTAyNCkgcmV0dXJuIGAkeyhuIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICByZXR1cm4gYCR7KG4gLyAxMDI0IC8gMTAyNCkudG9GaXhlZCgxKX0gTUJgO1xufTtcbmNvbnN0IEZpbGVBdHRhY2hlciA9ICh7IGZpbGVzLCBzZXRGaWxlcywgbWF4ID0gRklMRV9NQVhfQ09VTlQsIG1heFNpemUgPSBGSUxFX01BWF9TSVpFIH0pID0+IHtcbiAgY29uc3QgaW5wdXRSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gUmVhY3QudXNlU3RhdGUoJycpO1xuXG4gIGNvbnN0IGhhbmRsZUZpbGVzID0gYXN5bmMgKGZpbGVMaXN0KSA9PiB7XG4gICAgc2V0RXJyb3IoJycpO1xuICAgIGNvbnN0IGluY29taW5nID0gQXJyYXkuZnJvbShmaWxlTGlzdCB8fCBbXSk7XG4gICAgY29uc3QgcmVtYWluaW5nID0gbWF4IC0gZmlsZXMubGVuZ3RoO1xuICAgIGlmIChyZW1haW5pbmcgPD0gMCkgeyBzZXRFcnJvcihgXHVDQ0E4XHVCRDgwXHVCMjk0IFx1Q0Q1Q1x1QjMwMCAke21heH1cdUFDMUNcdUFFNENcdUM5QzAgXHVBQzAwXHVCMkE1XHVENTY5XHVCMkM4XHVCMkU0LmApOyByZXR1cm47IH1cbiAgICBjb25zdCBhY2NlcHRlZCA9IFtdO1xuICAgIGZvciAoY29uc3QgZiBvZiBpbmNvbWluZy5zbGljZSgwLCByZW1haW5pbmcpKSB7XG4gICAgICBpZiAoZi5zaXplID4gbWF4U2l6ZSkgeyBzZXRFcnJvcihgJyR7Zi5uYW1lfScgXHVDNzQwKFx1QjI5NCkgJHtfZm10U2l6ZShtYXhTaXplKX0gXHVDRDA4XHVBQ0ZDIFx1MjAxNCBcdUNDQThcdUJEODAgXHVCRDg4XHVBQzAwLmApOyBjb250aW51ZTsgfVxuICAgICAgYWNjZXB0ZWQucHVzaChmKTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKGFjY2VwdGVkLm1hcCgoZikgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgci5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKHsgbmFtZTogZi5uYW1lLCB0eXBlOiBmLnR5cGUgfHwgJycsIHNpemU6IGYuc2l6ZSwgZGF0YVVybDogci5yZXN1bHQgfSk7XG4gICAgICByLnJlYWRBc0RhdGFVUkwoZik7XG4gICAgfSkpKTtcbiAgICBzZXRGaWxlcyhbLi4uZmlsZXMsIC4uLnJlc3VsdHNdKTtcbiAgfTtcblxuICBjb25zdCByZW1vdmUgPSAoaSkgPT4gc2V0RmlsZXMoZmlsZXMuZmlsdGVyKChfLCBqKSA9PiBqICE9PSBpKSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbTo4fX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIj5cdUNDQThcdUJEODAgXHVEMzBDXHVDNzdDIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yXCI+KHtmaWxlcy5sZW5ndGh9L3ttYXh9IFx1MDBCNyBcdUFDMDEge19mbXRTaXplKG1heFNpemUpfSBcdUM3NzRcdUQ1NTgpPC9zcGFuPjwvZGl2PlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICBkaXNhYmxlZD17ZmlsZXMubGVuZ3RoID49IG1heH1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBpbnB1dFJlZi5jdXJyZW50Py5jbGljaygpfT5cbiAgICAgICAgICArIFx1RDMwQ1x1Qzc3QyBcdUMxMjBcdUQwRERcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxpbnB1dCByZWY9e2lucHV0UmVmfSB0eXBlPVwiZmlsZVwiIG11bHRpcGxlXG4gICAgICAgIHN0eWxlPXt7ZGlzcGxheTonbm9uZSd9fVxuICAgICAgICBvbkNoYW5nZT17KGUpID0+IHsgaGFuZGxlRmlsZXMoZS50YXJnZXQuZmlsZXMpOyBlLnRhcmdldC52YWx1ZSA9ICcnOyB9fS8+XG4gICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICA8ZGl2IHJvbGU9XCJhbGVydFwiIHN0eWxlPXt7Zm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1kYW5nZXIpJywgbWFyZ2luQm90dG9tOjh9fT57ZXJyb3J9PC9kaXY+XG4gICAgICApfVxuICAgICAge2ZpbGVzLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgIDx1bCBzdHlsZT17e2xpc3RTdHlsZTonbm9uZScsIHBhZGRpbmc6MCwgbWFyZ2luOjAsIGRpc3BsYXk6J2ZsZXgnLCBmbGV4RGlyZWN0aW9uOidjb2x1bW4nLCBnYXA6Nn19PlxuICAgICAgICAgIHtmaWxlcy5tYXAoKGYsIGkpID0+IChcbiAgICAgICAgICAgIDxsaSBrZXk9e2l9IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDoxMCwgcGFkZGluZzonOHB4IDEwcHgnLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgZm9udFNpemU6MTJ9fT5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHVEODNEXHVEQ0NFPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZsZXg6MSwgY29sb3I6J3ZhcigtLWluayknLCBvdmVyZmxvdzonaGlkZGVuJywgdGV4dE92ZXJmbG93OidlbGxpcHNpcycsIHdoaXRlU3BhY2U6J25vd3JhcCd9fT57Zi5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTB9fT57X2ZtdFNpemUoZi5zaXplKX08L3NwYW4+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHJlbW92ZShpKX0gYXJpYS1sYWJlbD17YCR7Zi5uYW1lfSBcdUM4MUNcdUFDNzBgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDonbm9uZScsIGJvcmRlcjonbm9uZScsIGNvbG9yOid2YXIoLS1kYW5nZXIpJywgZm9udFNpemU6MTQsIGN1cnNvcjoncG9pbnRlcicsIHBhZGRpbmc6JzJweCA2cHgnfX0+XHUyNzE1PC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3VsPlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwbGFjZWhvbGRlclwiIHN0eWxlPXt7YXNwZWN0UmF0aW86JzgvMScsIGZvbnRTaXplOjEwfX0+XG4gICAgICAgICAgUERGIFx1MDBCNyBET0NYIFx1MDBCNyBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDNjc4IFx1Qzc5MFx1QjhDQ1x1Qjk3QyBcdUNDQThcdUJEODAgKFx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUJDRjhcdUJCMzggXHVENTU4XHVCMkU4XHVDNUQwIFx1QjJFNFx1QzZCNFx1Qjg1Q1x1QjREQyBcdUI5QzFcdUQwNkNcdUI4NUMgXHVENDVDXHVDMkRDKVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyA9PT0gQ29tbWVudCB0cmVlIChcdUIyRTRcdUIyRThcdUFDQzQgXHVCMkY1XHVBRTAwLCBcdUNENUNcdUIzMDAgXHVBRTRBXHVDNzc0IE1BWF9ERVBUSCkgPT09PT09PT09PT09PT09PT09PT09PVxuLy8gQFx1QkE1OFx1QzE1OFx1Qzc0MCBcdUJDRjhcdUJCMzhcdUM1RDAgQFx1Qzc3NFx1Qjk4NCBcdUQxQTBcdUQwNzBcdUM3NDQgXHVBQ0U4XHVCNERDIGNoaXAgXHVDNzNDXHVCODVDIFx1QjgwQ1x1QjM1NFx1QjlDMS5cbi8vIFx1QjJGNVx1QUUwMCBcdUQyQjhcdUI5QUMgXHUyMDE0IFx1QzJEQ1x1QUMwMVx1QzgwMSBcdUI0RTRcdUM1RUNcdUM0RjBcdUFFMzAgXHVBRTMwXHVCQ0Y4IFx1Q0VBMSgzKS4gXHVBREY4IFx1Qzc3NFx1QzBDMVx1Qzc0MCBcdUM3OTBcdUIzRDkgXHVEM0JDXHVDRTY4L1x1QzgxMVx1QUUzMCBcdUQxQTBcdUFFMDBcdUI4NUMgXHVCMTc4XHVDRDlDLlxuY29uc3QgTUFYX1ZJU0lCTEVfREVQVEggPSAzO1xuXG5jb25zdCByZW5kZXJDb21tZW50VGV4dCA9ICh0ZXh0KSA9PiB7XG4gIGlmICghdGV4dCkgcmV0dXJuIG51bGw7XG4gIC8vIEBcdUIyQzlcdUIxMjRcdUM3ODQgXHVEMUEwXHVEMDcwXHVCOUNDIFx1QUMwMFx1QkNDRFx1QUM4QyBcdUFDMTVcdUM4NzAoXHVBQ0U4XHVCNERDLCBtZWRpdW0pLiBcdUJDRjhcdUJCMzhcdUM3NDAgXHVEM0M5XHVCQjM4IFx1QURGOFx1QjMwMFx1Qjg1Qy5cbiAgY29uc3QgcGFydHMgPSBTdHJpbmcodGV4dCkuc3BsaXQoLyhAW1xccHtMfVxccHtOfV9dKykvZ3UpO1xuICByZXR1cm4gcGFydHMubWFwKChwYXJ0LCBpKSA9PiB7XG4gICAgaWYgKHBhcnQuc3RhcnRzV2l0aCgnQCcpICYmIHBhcnQubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIDxzcGFuIGtleT17aX0gY2xhc3NOYW1lPVwiZ29sZFwiIHN0eWxlPXt7Zm9udFdlaWdodDo1MDB9fT57cGFydH08L3NwYW4+O1xuICAgIH1cbiAgICByZXR1cm4gPFJlYWN0LkZyYWdtZW50IGtleT17aX0+e3BhcnR9PC9SZWFjdC5GcmFnbWVudD47XG4gIH0pO1xufTtcblxuY29uc3QgQ29tbWVudFRyZWUgPSAoeyBjb21tZW50cywgdXNlciwgb25EZWxldGUsIG9uUmVwbHkgfSkgPT4ge1xuICBjb25zdCB0b3BMZXZlbCA9IChjb21tZW50cyB8fCBbXSkuZmlsdGVyKChjKSA9PiAhYy5wYXJlbnRJZCk7XG4gIGNvbnN0IHJlcGxpZXNPZiA9IChwYXJlbnRJZCkgPT4gKGNvbW1lbnRzIHx8IFtdKS5maWx0ZXIoKGMpID0+IGMucGFyZW50SWQgPT09IHBhcmVudElkKTtcbiAgY29uc3QgW29wZW5SZXBseVRvLCBzZXRPcGVuUmVwbHlUb10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2RyYWZ0LCBzZXREcmFmdF0gPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG5cbiAgLy8gXHVCQTU4XHVDMTU4IFx1Qzc5MFx1QjNEOVx1QzY0NFx1QzEzMSBcdTIwMTQgXHVCMzEzXHVBRTAwIFx1Qzc5MVx1QzEzMVx1Qzc5MCArIFx1QUUwMCBcdUIzMTNcdUFFMDBcdUM1RDAgXHVCNEYxXHVDN0E1XHVENTVDIFx1QkFBOFx1QjRFMCBcdUIyQzlcdUIxMjRcdUM3ODRcdUM3NDQgXHVENkM0XHVCQ0Y0XHVCODVDLlxuICBjb25zdCBhbGxBdXRob3JzID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICByZXR1cm4gKGNvbW1lbnRzIHx8IFtdKVxuICAgICAgLm1hcCgoYykgPT4gYy5hdXRob3IpXG4gICAgICAuZmlsdGVyKChuKSA9PiBuICYmICFzZWVuLmhhcyhuKSAmJiAoc2Vlbi5hZGQobikgfHwgdHJ1ZSkpO1xuICB9LCBbY29tbWVudHNdKTtcblxuICBjb25zdCBzdWJtaXRSZXBseSA9IChwYXJlbnRJZCkgPT4ge1xuICAgIG9uUmVwbHk/LihwYXJlbnRJZCwgZHJhZnQpO1xuICAgIHNldERyYWZ0KCcnKTtcbiAgICBzZXRPcGVuUmVwbHlUbyhudWxsKTtcbiAgfTtcblxuICAvLyBcdUFFNEFcdUM3NzQgXHVDODFDXHVENTVDXHVDNzQ0IFx1RDQ4MFx1QUNFMCAoXHVDMTFDXHVCQzg0XHVCMjk0IFx1QkIzNFx1QzgxQ1x1RDU1QyBcdUQ1QzhcdUM2QTkpLCBcdUMyRENcdUFDMDFcdUI5Q0MgTUFYX1ZJU0lCTEVfREVQVEggXHVBRTRDXHVDOUMwIFx1QjRFNFx1QzVFQ1x1QzRGMFx1QUUzMC5cbiAgY29uc3QgW2V4cGFuZGVkLCBzZXRFeHBhbmRlZF0gPSBSZWFjdC51c2VTdGF0ZSh7fSk7IC8vIGNvbW1lbnRJZCAtPiB0cnVlIChcdUMwQUNcdUM2QTlcdUM3OTAgXHVEM0JDXHVDRTY4IFx1RDA3NFx1QjlBRClcbiAgY29uc3QgcmVuZGVySXRlbSA9IChjLCBkZXB0aCA9IDApID0+IHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IHJlcGxpZXNPZihjLmlkKTtcbiAgICBjb25zdCBjYW5SZXBseSA9ICEhdXNlcjsgLy8gXHVBRTRBXHVDNzc0IFx1QkIzNFx1QUQwMCBcdUIyRjVcdUFFMDAgXHVENUM4XHVDNkE5XG4gICAgY29uc3QgdmlzdWFsRGVwdGggPSBNYXRoLm1pbihkZXB0aCwgTUFYX1ZJU0lCTEVfREVQVEgpO1xuICAgIGNvbnN0IGlzRGVlcENvbGxhcHNlZCA9IGRlcHRoID49IE1BWF9WSVNJQkxFX0RFUFRIICYmICFleHBhbmRlZFtjLmlkXSAmJiBjaGlsZHJlbi5sZW5ndGggPiAwO1xuICAgIHJldHVybiAoXG4gICAgICA8bGkga2V5PXtjLmlkfSBzdHlsZT17e3BhZGRpbmc6JzE4cHggMCcsIGJvcmRlckJvdHRvbTogZGVwdGggPT09IDAgPyAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyA6ICdub25lJ319PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxNiwgYWxpZ25JdGVtczonY2VudGVyJywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBtYXJnaW5Cb3R0b206MTB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxNCwgYWxpZ25JdGVtczonY2VudGVyJywgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICB7ZGVwdGggPiAwICYmIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yIG1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjExfX0+XHUyMUIzPC9zcGFuPn1cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdvbGQgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTIsIGxldHRlclNwYWNpbmc6JzAuMWVtJywgZGlzcGxheTonaW5saW5lLWZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XG4gICAgICAgICAgICAgIHtjLmF1dGhvcn1cbiAgICAgICAgICAgICAgPEF1dGhvckdyYWRlQmFkZ2UgYXV0aG9ySWQ9e2MuYXV0aG9ySWR9IGF1dGhvcj17Yy5hdXRob3J9IGF1dGhvckVtYWlsPXtjLmF1dGhvckVtYWlsfS8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8dGltZSBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMX19PntjLmRhdGV9PC90aW1lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjYsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cbiAgICAgICAgICAgIHtjYW5SZXBseSAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgc2V0T3BlblJlcGx5VG8ob3BlblJlcGx5VG8gPT09IGMuaWQgPyBudWxsIDogYy5pZCk7XG4gICAgICAgICAgICAgICAgICBzZXREcmFmdChvcGVuUmVwbHlUbyA9PT0gYy5pZCA/ICcnIDogYEAke2MuYXV0aG9yfSBgKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1pbmstMiknfX0+XG4gICAgICAgICAgICAgICAge29wZW5SZXBseVRvID09PSBjLmlkID8gJ1x1Q0RFOFx1QzE4QycgOiAnXHVCMkY1XHVBRTAwJ31cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgeyEhdXNlciAmJiAodXNlci5pc0FkbWluIHx8IGMuYXV0aG9ySWQgPT09IHVzZXIuaWQgfHwgYy5hdXRob3IgPT09IHVzZXIubmFtZSkgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBvbkRlbGV0ZT8uKGMuaWQpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1kYW5nZXIpJ319Plx1QzBBRFx1QzgxQzwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxwIHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1yZWFkaW5nKScsIGZvbnRTaXplOiBkZXB0aCA+IDAgPyAxNCA6IDE1LCBsaW5lSGVpZ2h0OjEuOCwgY29sb3I6J3ZhcigtLWluayknLCB3aGl0ZVNwYWNlOidwcmUtd3JhcCd9fT5cbiAgICAgICAgICB7cmVuZGVyQ29tbWVudFRleHQoYy50ZXh0KX1cbiAgICAgICAgPC9wPlxuXG4gICAgICAgIHsvKiBcdUIyRjVcdUFFMDAgXHVDNzg1XHVCODI1IFx1RDNGQyAqL31cbiAgICAgICAge29wZW5SZXBseVRvID09PSBjLmlkICYmIChcbiAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17KGUpID0+IHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzdWJtaXRSZXBseShjLmlkKTsgfX1cbiAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luVG9wOjEwLCBwYWRkaW5nTGVmdDoyNCwgYm9yZGVyTGVmdDonMnB4IHNvbGlkIHZhcigtLWdvbGQtZGltKSd9fT5cbiAgICAgICAgICAgIDxNZW50aW9uVGV4dGFyZWFcbiAgICAgICAgICAgICAgdmFsdWU9e2RyYWZ0fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0RHJhZnR9XG4gICAgICAgICAgICAgIGF1dGhvcnM9e2FsbEF1dGhvcnN9XG4gICAgICAgICAgICAgIHJvd3M9ezJ9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtgQCR7Yy5hdXRob3J9XHVDNUQwXHVBQzhDIFx1QjJGNVx1QUUwMC4uLiAoQFx1Qjk3QyBcdUM3ODVcdUI4MjVcdUQ1NThcdUJBNzQgXHVCQTU4XHVDMTU4IFx1Qzc5MFx1QjNEOVx1QzY0NFx1QzEzMSlgfVxuICAgICAgICAgICAgICBzdHlsZT17e21hcmdpbkJvdHRvbTo4fX0vPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonZmxleC1lbmQnLCBnYXA6Nn19PlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4geyBzZXRPcGVuUmVwbHlUbyhudWxsKTsgc2V0RHJhZnQoJycpOyB9fT5cdUNERThcdUMxOEM8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkIGJ0bi1zbWFsbFwiIGRpc2FibGVkPXshZHJhZnQudHJpbSgpfT5cdUIyRjVcdUFFMDAgXHVCNEYxXHVCODVEPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFx1Qzc5MFx1QzJERCBcdUIyRjVcdUFFMDBcdUI0RTQgXHUyMDE0IFx1QUU0QVx1Qzc3NCBcdUNFQTEgXHVCM0M0XHVCMkVDIFx1QzgwNFx1QUU0Q1x1QzlDMCBcdUM3QUNcdUFEQzAsIFx1QjNDNFx1QjJFQyBcdUQ2QzRcdUM1RDQgJ1x1RDNCQ1x1Q0U1OFx1QUUzMCcgXHVEMUEwXHVBRTAwICovfVxuICAgICAgICB7Y2hpbGRyZW4ubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgaXNEZWVwQ29sbGFwc2VkID8gKFxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWQoKHMpID0+ICh7IC4uLnMsIFtjLmlkXTogdHJ1ZSB9KSl9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOjEwLCBtYXJnaW5MZWZ0OjI0LCBmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsXG4gICAgICAgICAgICAgICAgcGFkZGluZzonNHB4IDEwcHgnLCBib3JkZXI6JzFweCBkYXNoZWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgXHUyMUIzIFx1QjJGNVx1QUUwMCB7Y2hpbGRyZW4ubGVuZ3RofVx1QUMxQyBcdUQzQkNcdUNFNThcdUFFMzBcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8b2wgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbGlzdFN0eWxlOidub25lJywgcGFkZGluZzowLFxuICAgICAgICAgICAgICBtYXJnaW46IGRlcHRoIDwgTUFYX1ZJU0lCTEVfREVQVEggPyAnMTJweCAwIDAgMjRweCcgOiAnMTJweCAwIDAgMTJweCcsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6JzJweCBzb2xpZCB2YXIoLS1saW5lKScsIHBhZGRpbmdMZWZ0OjE0LFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtjaGlsZHJlbi5tYXAoKHIpID0+IHJlbmRlckl0ZW0ociwgZGVwdGggKyAxKSl9XG4gICAgICAgICAgICAgIHtkZXB0aCA+PSBNQVhfVklTSUJMRV9ERVBUSCAmJiAoXG4gICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWQoKHMpID0+ICh7IC4uLnMsIFtjLmlkXTogZmFsc2UgfSkpfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRTaXplOjExLCBjb2xvcjondmFyKC0taW5rLTMpJywgcGFkZGluZzonNHB4IDEwcHgnfX0+XG4gICAgICAgICAgICAgICAgICAgIFx1MjE5MSBcdUIyRjVcdUFFMDAgXHVDODExXHVBRTMwXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9vbD5cbiAgICAgICAgICApXG4gICAgICAgICl9XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8b2wgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBwYWRkaW5nOjAsIG1hcmdpbjowfX0+XG4gICAgICB7dG9wTGV2ZWwubWFwKChjKSA9PiByZW5kZXJJdGVtKGMsIDApKX1cbiAgICA8L29sPlxuICApO1xufTtcblxuLy8gPT09IEBcdUJBNThcdUMxNTggXHVDNzkwXHVCM0Q5XHVDNjQ0XHVDMTMxIHRleHRhcmVhID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gXHVDMEFDXHVDNkE5XHVDNzkwXHVBQzAwIEBcdUM3NDQgXHVDNzg1XHVCODI1XHVENTU4XHVCQTc0IFx1RDZDNFx1QkNGNCBcdUI5QUNcdUMyQTRcdUQyQjhcdUI5N0MgXHVCNzQ0XHVDNkIwXHVBQ0UwLCBcdUQwNzRcdUI5QUQvRW50ZXIgXHVCODVDIFx1QjJDOVx1QjEyNFx1Qzc4NFx1Qzc0NCBcdUMwQkRcdUM3ODUuXG5jb25zdCBNZW50aW9uVGV4dGFyZWEgPSAoeyB2YWx1ZSwgb25DaGFuZ2UsIGF1dGhvcnMsIHJvd3MgPSA0LCBwbGFjZWhvbGRlciwgc3R5bGUgfSkgPT4ge1xuICBjb25zdCByZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFthY3RpdmUsIHNldEFjdGl2ZV0gPSBSZWFjdC51c2VTdGF0ZSgwKTtcblxuICBjb25zdCBjYW5kaWRhdGVzID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFvcGVuKSByZXR1cm4gW107XG4gICAgY29uc3QgcSA9IHRva2VuLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIChhdXRob3JzIHx8IFtdKVxuICAgICAgLmZpbHRlcigoYSkgPT4gIXEgfHwgYS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpKVxuICAgICAgLnNsaWNlKDAsIDYpO1xuICB9LCBbYXV0aG9ycywgdG9rZW4sIG9wZW5dKTtcblxuICBjb25zdCBkZXRlY3RNZW50aW9uID0gKHRleHQsIGNhcmV0KSA9PiB7XG4gICAgLy8gXHVDRTkwXHVCN0ZGIFx1QzlDMVx1QzgwNFx1QzVEMFx1QzExQyBcdUFDMDBcdUM3QTUgXHVBQzAwXHVBRTRDXHVDNkI0IEBcdUI5N0MgXHVDQzNFXHVBQ0UwLCBAIFx1QjJFNFx1Qzc0QyBcdUJCMzhcdUM3OTBcdUFDMDAgXHVBQ0Y1XHVCQzMxL1x1QzkwNFx1QkMxNFx1QUZDOFx1Qzc3NCBcdUM1NDRcdUIyQ0NcdUM5QzAgXHVENjU1XHVDNzc4LlxuICAgIGNvbnN0IHVwdG8gPSB0ZXh0LnNsaWNlKDAsIGNhcmV0KTtcbiAgICBjb25zdCBtID0gL0AoW1xccHtMfVxccHtOfV9dKikkL3UuZXhlYyh1cHRvKTtcbiAgICBpZiAobSkgeyBzZXRUb2tlbihtWzFdKTsgc2V0T3Blbih0cnVlKTsgc2V0QWN0aXZlKDApOyB9XG4gICAgZWxzZSB7IHNldE9wZW4oZmFsc2UpOyBzZXRUb2tlbignJyk7IH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHYgPSBlLnRhcmdldC52YWx1ZTtcbiAgICBvbkNoYW5nZSh2KTtcbiAgICBkZXRlY3RNZW50aW9uKHYsIGUudGFyZ2V0LnNlbGVjdGlvblN0YXJ0IHx8IHYubGVuZ3RoKTtcbiAgfTtcblxuICBjb25zdCBpbnNlcnRDYW5kaWRhdGUgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IGVsID0gcmVmLmN1cnJlbnQ7XG4gICAgY29uc3QgY2FyZXQgPSBlbD8uc2VsZWN0aW9uU3RhcnQgPz8gdmFsdWUubGVuZ3RoO1xuICAgIGNvbnN0IGJlZm9yZSA9IHZhbHVlLnNsaWNlKDAsIGNhcmV0KTtcbiAgICBjb25zdCBhZnRlciA9IHZhbHVlLnNsaWNlKGNhcmV0KTtcbiAgICBjb25zdCByZXBsYWNlZCA9IGJlZm9yZS5yZXBsYWNlKC9AKFtcXHB7TH1cXHB7Tn1fXSopJC91LCBgQCR7bmFtZX0gYCk7XG4gICAgY29uc3QgbmV4dCA9IHJlcGxhY2VkICsgYWZ0ZXI7XG4gICAgb25DaGFuZ2UobmV4dCk7XG4gICAgc2V0T3BlbihmYWxzZSk7XG4gICAgc2V0VG9rZW4oJycpO1xuICAgIC8vIFx1Q0U5MFx1QjdGRlx1Qzc0NCBcdUMwQkRcdUM3ODUgXHVCMDVEXHVDNzNDXHVCODVDIFx1Qzc3NFx1QjNEOVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcG9zID0gcmVwbGFjZWQubGVuZ3RoO1xuICAgICAgICBlbD8uZm9jdXMoKTtcbiAgICAgICAgZWw/LnNldFNlbGVjdGlvblJhbmdlKHBvcywgcG9zKTtcbiAgICAgIH0gY2F0Y2gge31cbiAgICB9LCAwKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVLZXlEb3duID0gKGUpID0+IHtcbiAgICBpZiAoIW9wZW4gfHwgY2FuZGlkYXRlcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd0Rvd24nKSB7IGUucHJldmVudERlZmF1bHQoKTsgc2V0QWN0aXZlKChpKSA9PiAoaSArIDEpICUgY2FuZGlkYXRlcy5sZW5ndGgpOyB9XG4gICAgZWxzZSBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHNldEFjdGl2ZSgoaSkgPT4gKGkgLSAxICsgY2FuZGlkYXRlcy5sZW5ndGgpICUgY2FuZGlkYXRlcy5sZW5ndGgpOyB9XG4gICAgZWxzZSBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBpbnNlcnRDYW5kaWRhdGUoY2FuZGlkYXRlc1thY3RpdmVdKTsgfVxuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgeyBzZXRPcGVuKGZhbHNlKTsgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOidyZWxhdGl2ZSd9fT5cbiAgICAgIDx0ZXh0YXJlYSByZWY9e3JlZn0gY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiByb3dzPXtyb3dzfVxuICAgICAgICB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IG9uS2V5RG93bj17aGFuZGxlS2V5RG93bn1cbiAgICAgICAgcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyfSBzdHlsZT17c3R5bGV9Lz5cbiAgICAgIHtvcGVuICYmIGNhbmRpZGF0ZXMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDx1bCByb2xlPVwibGlzdGJveFwiIGFyaWEtbGFiZWw9XCJcdUJBNThcdUMxNTggXHVENkM0XHVCQ0Y0XCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgekluZGV4OjUwLCB0b3A6JzEwMCUnLCBsZWZ0OjAsIG1hcmdpblRvcDoyLFxuICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgbGlzdFN0eWxlOidub25lJywgcGFkZGluZzo0LCBtaW5XaWR0aDoxODAsIG1heFdpZHRoOjI4MCxcbiAgICAgICAgICAgIGJveFNoYWRvdzonMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMDgpJyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7Y2FuZGlkYXRlcy5tYXAoKG5hbWUsIGkpID0+IChcbiAgICAgICAgICAgIDxsaSBrZXk9e25hbWV9IHJvbGU9XCJvcHRpb25cIiBhcmlhLXNlbGVjdGVkPXtpID09PSBhY3RpdmV9XG4gICAgICAgICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4geyBlLnByZXZlbnREZWZhdWx0KCk7IGluc2VydENhbmRpZGF0ZShuYW1lKTsgfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwYWRkaW5nOic2cHggMTBweCcsIGZvbnRTaXplOjEzLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGkgPT09IGFjdGl2ZSA/ICdyZ2JhKDI0NSwyMTMsNzIsMC4xMiknIDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICBjb2xvcjogaSA9PT0gYWN0aXZlID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmspJyxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIEB7bmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvdWw+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09IENvbW11bml0eSBQYWdlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgUE9TVFNfUEVSX1BBR0UgPSAxMDtcblxuY29uc3QgQ29tbXVuaXR5UGFnZSA9ICh7IGdvLCBwb3N0SWQsIHNldFBvc3RJZCwgdXNlciB9KSA9PiB7XG4gIGNvbnN0IHVzZXJMZXZlbCA9IHVzZVVzZXJMZXZlbCh1c2VyKTtcbiAgY29uc3QgY2F0ZWdvcmllcyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gZ2V0Q2F0ZWdvcmllc0ZvckJvYXJkKFwiY29tbXVuaXR5XCIpLCBbcG9zdElkXSk7XG4gIGNvbnN0IFtyZWZyZXNoS2V5LCBzZXRSZWZyZXNoS2V5XSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCBbdGFiLCBzZXRUYWJdID0gUmVhY3QudXNlU3RhdGUoXCJhbGxcIik7XG4gIGNvbnN0IFthY3RpdmVQcmVmaXgsIHNldEFjdGl2ZVByZWZpeF0gPSBSZWFjdC51c2VTdGF0ZShcIlwiKTtcbiAgY29uc3QgW3NlYXJjaCwgc2V0U2VhcmNoXSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbc29ydCwgc2V0U29ydF0gPSBSZWFjdC51c2VTdGF0ZShcImxhdGVzdFwiKTtcbiAgY29uc3QgW3dyaXRpbmcsIHNldFdyaXRpbmddID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtwYWdlLCBzZXRQYWdlXSA9IFJlYWN0LnVzZVN0YXRlKDEpO1xuXG4gIC8vIFx1QzU0Q1x1QjlCQyBcdUJDQTggLyBcdUM2NzhcdUJEODAgXHVDOUM0XHVDNzg1XHVDNUQwXHVDMTFDIHN0YXNoXHVENTc0IFx1QjQ1NCBwb3N0SWRcdUFDMDAgXHVDNzg4XHVDNzNDXHVCQTc0IFx1Qzc5MFx1QjNEOVx1QzczQ1x1Qjg1QyBcdUMwQzFcdUMxMzhcdUI4NUMgXHVDNzc0XHVCM0Q5XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IHBlbmRpbmcgPSBudWxsO1xuICAgIHRyeSB7IHBlbmRpbmcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcpOyB9IGNhdGNoIHt9XG4gICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgIHRyeSB7IHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2JnbmpfcGVuZGluZ19wb3N0X2lkJyk7IH0gY2F0Y2gge31cbiAgICAgIHNldFBvc3RJZChwZW5kaW5nKTtcbiAgICB9XG4gICAgLy8gXHVCMEI0XHVCRTQ0IFx1QkE1NFx1QUMwMFx1QkE1NFx1QjI3NFx1QzVEMFx1QzExQyBcdUI0RTRcdUM1QjRcdUM2MjggXHVBQzhDXHVDMkRDXHVEMzEwIElEXG4gICAgbGV0IHBlbmRpbmdCb2FyZCA9IG51bGw7XG4gICAgdHJ5IHsgcGVuZGluZ0JvYXJkID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYmdual9wZW5kaW5nX2JvYXJkX2lkJyk7IH0gY2F0Y2gge31cbiAgICBpZiAocGVuZGluZ0JvYXJkKSB7XG4gICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdiZ25qX3BlbmRpbmdfYm9hcmRfaWQnKTsgfSBjYXRjaCB7fVxuICAgICAgc2V0VGFiKHBlbmRpbmdCb2FyZCk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgLy8gXHVDMTFDXHVCQzg0IFx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUIzRDlcdUFFMzBcdUQ2NTQgXHUyMDE0IFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUM5QzRcdUM3ODUgXHVDMkRDIDFcdUQ2OEMgKyAnYmduai1wb3N0cy1yZWZyZXNoJyBcdUM3NzRcdUJDQTRcdUQyQjhcdUI5QzhcdUIyRTQgXHVDN0FDXHVCODBDXHVCMzU0XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgd2luZG93LkJHTkpfQ09NTVVOSVRZLnJlZnJlc2hQb3N0cz8uKCk7XG4gICAgY29uc3Qgb25SZWZyZXNoID0gKCkgPT4gc2V0UmVmcmVzaEtleSgodikgPT4gdiArIDEpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZ25qLXBvc3RzLXJlZnJlc2gnLCBvblJlZnJlc2gpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmduai1wb3N0cy1yZWZyZXNoJywgb25SZWZyZXNoKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IEcgPSB3aW5kb3cuQkdOSl9HVUFSRDtcbiAgY29uc3QgYWxsUG9zdHMgPSBSZWFjdC51c2VNZW1vKCgpID0+IEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8ubGlzdFBvc3RzPy4oKSksIFtyZWZyZXNoS2V5XSk7XG5cbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFx1QkFBOFx1QjRFMCBob29rXHVDNzQwIGVhcmx5IHJldHVybiBcdUM4MDRcdUM1RDAgXHVDMTIwXHVDNUI4IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBjb25zdCB2aXNpYmxlQ2F0cyA9IGNhdGVnb3JpZXMuZmlsdGVyKGMgPT4gdXNlckxldmVsID49IChjLm1pbkxldmVsID8/IDApKTtcbiAgY29uc3QgY3VycmVudEJvYXJkID0gY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5pZCA9PT0gdGFiKTtcbiAgY29uc3QgYm9hcmRQcmVmaXhlcyA9IGN1cnJlbnRCb2FyZD8ucHJlZml4ZXMgfHwgW107XG4gIGNvbnN0IGNhblJlYWRQb3N0ID0gUmVhY3QudXNlQ2FsbGJhY2soKHBvc3QpID0+IHtcbiAgICBpZiAoIXBvc3QpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBjYXQgPSBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmlkID09PSBwb3N0LmNhdGVnb3J5SWQpIHx8IGNhdGVnb3JpZXMuZmluZChjID0+IGMubGFiZWwgPT09IHBvc3QuY2F0ZWdvcnkpO1xuICAgIHJldHVybiAhY2F0IHx8IHVzZXJMZXZlbCA+PSAoY2F0Lm1pbkxldmVsID8/IDApO1xuICB9LCBbY2F0ZWdvcmllcywgdXNlckxldmVsXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHsgc2V0QWN0aXZlUHJlZml4KFwiXCIpOyB9LCBbdGFiXSk7XG5cbiAgY29uc3QgZmlsdGVyZWQgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBxID0gc2VhcmNoLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgYmFzZSA9IGFsbFBvc3RzLmZpbHRlcihwID0+IHtcbiAgICAgIGNvbnN0IGNhdCA9IGNhdGVnb3JpZXMuZmluZChjID0+IGMuaWQgPT09IHAuY2F0ZWdvcnlJZCkgfHwgY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5sYWJlbCA9PT0gcC5jYXRlZ29yeSk7XG4gICAgICBpZiAoY2F0ICYmIHVzZXJMZXZlbCA8IChjYXQubWluTGV2ZWwgPz8gMCkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICh0YWIgIT09IFwiYWxsXCIgJiYgKHAuY2F0ZWdvcnlJZCAhPT0gdGFiICYmIGNhdD8uaWQgIT09IHRhYikpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChxICYmICFwLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSkgJiYgIVN0cmluZyhwLmJvZHk/LnRleHQgfHwgJycpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChhY3RpdmVQcmVmaXggJiYgcC5wcmVmaXggIT09IGFjdGl2ZVByZWZpeCkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgaWYgKHNvcnQgPT09IFwidmlld3NcIikgcmV0dXJuIFsuLi5iYXNlXS5zb3J0KChhLCBiKSA9PiAoYi52aWV3cyA/PyAwKSAtIChhLnZpZXdzID8/IDApKTtcbiAgICBpZiAoc29ydCA9PT0gXCJyZXBsaWVzXCIpIHJldHVybiBbLi4uYmFzZV0uc29ydCgoYSwgYikgPT4gKGIucmVwbGllcyA/PyAwKSAtIChhLnJlcGxpZXMgPz8gMCkpO1xuICAgIGlmIChzb3J0ID09PSBcImxpa2VzXCIpIHJldHVybiBbLi4uYmFzZV0uc29ydCgoYSwgYikgPT4gKEFycmF5LmlzQXJyYXkoYi5saWtlcykgPyBiLmxpa2VzLmxlbmd0aCA6IDApIC0gKEFycmF5LmlzQXJyYXkoYS5saWtlcykgPyBhLmxpa2VzLmxlbmd0aCA6IDApKTtcbiAgICByZXR1cm4gYmFzZTtcbiAgfSwgW2FsbFBvc3RzLCBjYXRlZ29yaWVzLCB1c2VyTGV2ZWwsIHRhYiwgc2VhcmNoLCBzb3J0LCBhY3RpdmVQcmVmaXhdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4geyBzZXRQYWdlKDEpOyB9LCBbdGFiLCBzZWFyY2gsIHNvcnQsIGFjdGl2ZVByZWZpeF0pO1xuICAvLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvLyB2MDAuMDY4IFx1MjAxNCBQb3N0Q29tcG9zZSBcdUJBQThcdUIyRUMgd3JhcHBlci4gXHVCQUE5XHVCODVEIFx1QzcwNFx1QzVEMCBcdUJBQThcdUIyRUNcdUI4NUMgXHVENDVDXHVDMkRDLiBFU0MvXHVDNjc4XHVCRDgwXHVEMDc0XHVCOUFEIFx1QzJEQyB1c2VNb2RhbEd1YXJkIFx1QUMwMCBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgcHJvbXB0LlxuICAvLyBQb3N0Q29tcG9zZSBcdUM3NTggb25DYW5jZWwgXHVDNzc0IGNsb3NlTW9kYWwgXHVDNzNDXHVCODVDIFx1QzVGMFx1QUNCMFx1QjQyOCAoXHVDREU4XHVDMThDIFx1QkM4NFx1RDJCQyA9IFx1Qzk4OVx1QzJEQyBcdUIyRUJcdUFFMzApLlxuICBjb25zdCBQb3N0Q29tcG9zZU1vZGFsID0gKHsgb25DbG9zZSB9KSA9PiB7XG4gICAgY29uc3QgZ3VhcmQgPSB3aW5kb3cudXNlTW9kYWxHdWFyZD8uKHsgb3BlbjogdHJ1ZSwgZGlydHk6IHRydWUsIG9uQ2xvc2UsIG9uU2F2ZURyYWZ0OiBudWxsLCBsYWJlbDogJ1x1QUM4Q1x1QzJEQ1x1QUUwMCcgfSkgfHwge307XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1sYWJlbD17d3JpdGluZyA9PT0gdHJ1ZSA/ICdcdUMwQzggXHVBRTAwIFx1Qzc5MVx1QzEzMScgOiAnXHVBQzhDXHVDMkRDXHVBRTAwIFx1QzIxOFx1QzgxNSd9XG4gICAgICAgIG9uQ2xpY2s9e2d1YXJkLm9uQmFja2Ryb3BDbGlja31cbiAgICAgICAgc3R5bGU9e3twb3NpdGlvbjonZml4ZWQnLCBpbnNldDowLCBiYWNrZ3JvdW5kOidyZ2JhKDAsMCwwLDAuNTUpJywgekluZGV4OjEwMDAsIGRpc3BsYXk6J2dyaWQnLCBwbGFjZUl0ZW1zOidzdGFydCBjZW50ZXInLCBwYWRkaW5nOjI0LCBvdmVyZmxvd1k6J2F1dG8nfX0+XG4gICAgICAgIDxkaXYgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9IHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6J21pbigxMTAwcHgsIDEwMCUpJywgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm94U2hhZG93OicwIDE2cHggNDBweCByZ2JhKDAsMCwwLDAuMjUpJyxcbiAgICAgICAgICBwYWRkaW5nOjI0LCBtYXJnaW5Ub3A6MjQsIG1hcmdpbkJvdHRvbTo0OCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPFBvc3RDb21wb3NlXG4gICAgICAgICAgICBrZXk9e3dyaXRpbmcgPT09IHRydWUgPyBcIm5ld1wiIDogU3RyaW5nKHdyaXRpbmcuaWQpfVxuICAgICAgICAgICAgdXNlcj17dXNlcn1cbiAgICAgICAgICAgIGluaXRpYWxQb3N0PXt3cml0aW5nID09PSB0cnVlID8gbnVsbCA6IHdyaXRpbmd9XG4gICAgICAgICAgICBvbkNhbmNlbD17b25DbG9zZX1cbiAgICAgICAgICAgIG9uUHVibGlzaD17YXN5bmMgKHBheWxvYWQpID0+IHtcbiAgICAgICAgICAgICAgbGV0IHNhdmVkUG9zdDtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzYXZlZFBvc3QgPSB3cml0aW5nID09PSB0cnVlXG4gICAgICAgICAgICAgICAgICA/IGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWS5jcmVhdGVQb3N0UmVtb3RlKHBheWxvYWQpXG4gICAgICAgICAgICAgICAgICA6IGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWS51cGRhdGVQb3N0UmVtb3RlKHdyaXRpbmcuaWQsIHBheWxvYWQpO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBcdUMxMUNcdUJDODQgXHVDMkU0XHVEMzI4IFx1QzJEQyBcdUI4NUNcdUNFRUMgXHVEM0Y0XHVCQzMxLlxuICAgICAgICAgICAgICAgIHNhdmVkUG9zdCA9IHdyaXRpbmcgPT09IHRydWVcbiAgICAgICAgICAgICAgICAgID8gd2luZG93LkJHTkpfQ09NTVVOSVRZLmNyZWF0ZVBvc3QocGF5bG9hZClcbiAgICAgICAgICAgICAgICAgIDogd2luZG93LkJHTkpfQ09NTVVOSVRZLnVwZGF0ZVBvc3Qod3JpdGluZy5pZCwgcGF5bG9hZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25DbG9zZSgpO1xuICAgICAgICAgICAgICBzZXRSZWZyZXNoS2V5KCh2YWx1ZSkgPT4gdmFsdWUgKyAxKTtcbiAgICAgICAgICAgICAgaWYgKHNhdmVkUG9zdCkgc2V0UG9zdElkKHNhdmVkUG9zdC5pZCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgY2F0ZWdvcmllcz17Y2F0ZWdvcmllc31cbiAgICAgICAgICAgIHVzZXJMZXZlbD17dXNlckxldmVsfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuICBpZiAocG9zdElkKSB7XG4gICAgY29uc3QgcG9zdCA9IGFsbFBvc3RzLmZpbmQocCA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwb3N0SWQpKSB8fCBudWxsO1xuICAgIGlmICghcG9zdCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIiBzdHlsZT17e21heFdpZHRoOjc2MCwgdGV4dEFsaWduOidjZW50ZXInLCBwYWRkaW5nOic4MHB4IDIwcHgnfX0+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Cb3R0b206MTZ9fT5cdUQ1NzRcdUIyRjkgXHVBQzhDXHVDMkRDXHVBRTAwXHVDNzQ0IFx1Q0MzRVx1Qzc0NCBcdUMyMTggXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LjwvcD5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9eygpID0+IHNldFBvc3RJZChudWxsKX0+XHVCQUE5XHVCODVEXHVDNzNDXHVCODVDPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKCFjYW5SZWFkUG9zdChwb3N0KSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIiBzdHlsZT17e21heFdpZHRoOjc2MCwgdGV4dEFsaWduOidjZW50ZXInLCBwYWRkaW5nOic4MHB4IDIwcHgnfX0+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Cb3R0b206MTZ9fT5cdUQ2MDRcdUM3QUMgXHVCNEYxXHVBRTA5XHVDNzNDXHVCODVDXHVCMjk0IFx1Qzc3NCBcdUFDOENcdUMyRENcdUFFMDBcdUM3NDQgXHVCQ0ZDIFx1QzIxOCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuPC9wPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17KCkgPT4gc2V0UG9zdElkKG51bGwpfT5cdUJBQTlcdUI4NURcdUM3M0NcdUI4NUM8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gPFBvc3REZXRhaWxcbiAgICAgIHBvc3Q9e3Bvc3R9XG4gICAgICBnbz17Z299XG4gICAgICBzZXRQb3N0SWQ9e3NldFBvc3RJZH1cbiAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICBvblJlZnJlc2g9eygpID0+IHNldFJlZnJlc2hLZXkoKHZhbHVlKSA9PiB2YWx1ZSArIDEpfVxuICAgICAgb25FZGl0PXsobmV4dFBvc3QpID0+IHNldFdyaXRpbmcobmV4dFBvc3QpfVxuICAgIC8+O1xuICB9XG5cbiAgY29uc3QgdG90YWxQYWdlcyA9IE1hdGgubWF4KDEsIE1hdGguY2VpbChmaWx0ZXJlZC5sZW5ndGggLyBQT1NUU19QRVJfUEFHRSkpO1xuICBjb25zdCBzYWZlUGFnZSA9IE1hdGgubWluKHBhZ2UsIHRvdGFsUGFnZXMpO1xuICBjb25zdCBwYWdlU3RhcnQgPSAoc2FmZVBhZ2UgLSAxKSAqIFBPU1RTX1BFUl9QQUdFO1xuICBjb25zdCBwYWdlUG9zdHMgPSBmaWx0ZXJlZC5zbGljZShwYWdlU3RhcnQsIHBhZ2VTdGFydCArIFBPU1RTX1BFUl9QQUdFKTtcblxuICBjb25zdCBoYW5kbGVXcml0ZSA9ICgpID0+IHtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIGlmIChjb25maXJtKFwiXHVBRTAwXHVDNEYwXHVBRTMwXHVCMjk0IFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUQ2QzQgXHVDNzc0XHVDNkE5XHVENTYwIFx1QzIxOCBcdUM3ODhcdUMyQjVcdUIyQzhcdUIyRTQuIFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUQzOThcdUM3NzRcdUM5QzBcdUI4NUMgXHVDNzc0XHVCM0Q5XHVENTU4XHVDMkRDXHVBQ0EwXHVDNUI0XHVDNjk0P1wiKSkge1xuICAgICAgICBnbyhcImxvZ2luXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBXcml0YWJsZSBjYXRlZ29yaWVzIGZvciBjdXJyZW50IHVzZXJcbiAgICBjb25zdCB3cml0YWJsZSA9IGNhdGVnb3JpZXMuZmlsdGVyKGMgPT4gdXNlckxldmVsID49IChjLnBvc3RNaW5MZXZlbCA/PyBjLm1pbkxldmVsID8/IDApKTtcbiAgICBpZiAod3JpdGFibGUubGVuZ3RoID09PSAwKSB7XG4gICAgICBhbGVydChcIlx1RDYwNFx1QzdBQyBcdUI0RjFcdUFFMDlcdUM3M0NcdUI4NUNcdUIyOTQgXHVBRTAwXHVDNzQ0IFx1Qzc5MVx1QzEzMVx1RDU2MCBcdUMyMTggXHVDNzg4XHVCMjk0IFx1QUM4Q1x1QzJEQ1x1RDMxMFx1Qzc3NCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRXcml0aW5nKHRydWUpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICA8aGVhZGVyIHN0eWxlPXt7bWFyZ2luQm90dG9tOjI0fX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5DT01NVU5JVFkgXHUwMEI3IFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMDwvZGl2PlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJzZWN0aW9uLXRpdGxlXCI+XHVCMkU0XHVDMTJGIFx1QkQwOVx1QzZCMFx1QjlBQyA8c3BhbiBjbGFzc05hbWU9XCJhY2NlbnRcIj5cdUFEMTFcdUM3QTU8L3NwYW4+PC9oMT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzZWN0aW9uLXN1YnRpdGxlXCI+XHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXHVDNzc0IFx1QkFBOFx1QzVFQyBcdUIwOThcdUIyMDRcdUIyOTQgXHVDNzc0XHVDNTdDXHVBRTMwLiBcdUM5QzhcdUJCMzhcdUIzQzQgXHVCMkY1XHVCM0M0IFx1RDY1OFx1QzYwMVx1RDU2OVx1QjJDOFx1QjJFNC48L3A+XG4gICAgICAgIDwvaGVhZGVyPlxuXG5cbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbToyNCwgZ2FwOjI0LCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICA8ZGl2IHJvbGU9XCJ0YWJsaXN0XCIgYXJpYS1sYWJlbD1cIlx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUJEODRcdUI5NThcIlxuICAgICAgICAgICAgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjAsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwidGFiXCIgYXJpYS1zZWxlY3RlZD17dGFiID09PSBcImFsbFwifVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRUYWIoXCJhbGxcIil9XG4gICAgICAgICAgICAgIHN0eWxlPXt7cGFkZGluZzonMTRweCAyNHB4JywgZm9udFNpemU6MTMsIGxldHRlclNwYWNpbmc6JzAuMWVtJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogdGFiID09PSBcImFsbFwiID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogdGFiID09PSBcImFsbFwiID8gJzFweCBzb2xpZCB2YXIoLS1nb2xkKScgOiAnMXB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206LTF9fT5cdUM4MDRcdUNDQjQ8L2J1dHRvbj5cbiAgICAgICAgICAgIHt2aXNpYmxlQ2F0cy5tYXAoYyA9PiAoXG4gICAgICAgICAgICAgIDxidXR0b24ga2V5PXtjLmlkfSB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cInRhYlwiIGFyaWEtc2VsZWN0ZWQ9e3RhYiA9PT0gYy5pZH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRUYWIoYy5pZCl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxNHB4IDI0cHgnLCBmb250U2l6ZToxMywgbGV0dGVyU3BhY2luZzonMC4xZW0nLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IHRhYiA9PT0gYy5pZCA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0taW5rLTIpJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogdGFiID09PSBjLmlkID8gJzFweCBzb2xpZCB2YXIoLS1nb2xkKScgOiAnMXB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTotMX19PntjLmxhYmVsfTwvYnV0dG9uPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTAsIGFsaWduSXRlbXM6J2NlbnRlcicsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjb21tdW5pdHktc2VhcmNoXCIgY2xhc3NOYW1lPVwic3Itb25seVwiPlx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUFDODBcdUMwQzk8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiY29tbXVuaXR5LXNlYXJjaFwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0YWIgPT09IFwiYWxsXCIgPyBcIlx1QzgwNFx1Q0NCNCBcdUFDOENcdUMyRENcdUQzMTAgXHVBQzgwXHVDMEM5Li4uXCIgOiBgJHtjdXJyZW50Qm9hcmQ/LmxhYmVsIHx8ICcnfSBcdUFDOENcdUMyRENcdUQzMTAgXHVBQzgwXHVDMEM5Li4uYH1cbiAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaH0gb25DaGFuZ2U9e2UgPT4gc2V0U2VhcmNoKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiBzdHlsZT17e3dpZHRoOjIwMCwgcGFkZGluZzonMTBweCAxNHB4J319Lz5cbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiY29tbXVuaXR5LXNvcnRcIiBjbGFzc05hbWU9XCJzci1vbmx5XCI+XHVDODE1XHVCODJDPC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJjb21tdW5pdHktc29ydFwiIHZhbHVlPXtzb3J0fSBvbkNoYW5nZT17ZSA9PiBzZXRTb3J0KGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiBzdHlsZT17e3BhZGRpbmc6JzEwcHggMTJweCcsIGZvbnRTaXplOjEyLCBjdXJzb3I6J3BvaW50ZXInfX0+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJsYXRlc3RcIj5cdUNENUNcdUMyRTBcdUMyMUM8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInZpZXdzXCI+XHVDODcwXHVENjhDXHVDMjFDPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyZXBsaWVzXCI+XHVCMzEzXHVBRTAwXHVDMjFDPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJsaWtlc1wiPlx1Qzg4Qlx1QzU0NFx1QzY5NFx1QzIxQzwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGQgYnRuLXNtYWxsXCIgb25DbGljaz17aGFuZGxlV3JpdGV9PlxuICAgICAgICAgICAgICB7dXNlciA/ICdcdUFFMDBcdUM0RjBcdUFFMzAgXHVGRjBCJyA6ICdcdUI4NUNcdUFERjhcdUM3NzggXHVENkM0IFx1QUUwMFx1QzRGMFx1QUUzMCd9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIFx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUMxMjRcdUJBODUgXHUyMDE0IFx1RDJCOVx1QzgxNSBcdUFDOENcdUMyRENcdUQzMTAgXHVCREYwXHVDNUQwXHVDMTFDXHVCOUNDIFx1RDQ1Q1x1QzJEQyAqL31cbiAgICAgICAge3RhYiAhPT0gXCJhbGxcIiAmJiBjdXJyZW50Qm9hcmQ/LmRlc2MgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBhZGRpbmc6JzEwcHggMTZweCcsIG1hcmdpbkJvdHRvbToxNixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgYm9yZGVyTGVmdDonM3B4IHNvbGlkIHZhcigtLWdvbGQpJyxcbiAgICAgICAgICAgIGZvbnRTaXplOjEzLCBjb2xvcjondmFyKC0taW5rLTIpJywgbGluZUhlaWdodDoxLjYsXG4gICAgICAgICAgfX0+e2N1cnJlbnRCb2FyZC5kZXNjfTwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBcdUI5RDBcdUJBMzhcdUI5QUMgXHVENTQ0XHVEMTMwIFx1MjAxNCBcdUQ1NzRcdUIyRjkgXHVBQzhDXHVDMkRDXHVEMzEwXHVDNUQwIFx1QjlEMFx1QkEzOFx1QjlBQ1x1QUMwMCBcdUM3ODhcdUM3NDQgXHVCNTRDXHVCOUNDIFx1RDQ1Q1x1QzJEQyAqL31cbiAgICAgICAge2JvYXJkUHJlZml4ZXMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OCwgZmxleFdyYXA6J3dyYXAnLCBtYXJnaW5Cb3R0b206MTZ9fT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVByZWZpeChcIlwiKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwYWRkaW5nOic0cHggMTZweCcsIGJvcmRlcjonMXB4IHNvbGlkJyxcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogYWN0aXZlUHJlZml4ID09PSBcIlwiID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lLTIpJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogYWN0aXZlUHJlZml4ID09PSBcIlwiID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZVByZWZpeCA9PT0gXCJcIiA/ICdyZ2JhKDE1OCwxMDQsMjQsMC4wNiknIDogJ25vbmUnLFxuICAgICAgICAgICAgICAgIGN1cnNvcjoncG9pbnRlcicsIGZvbnRTaXplOjEzLCBsZXR0ZXJTcGFjaW5nOicwLjA1ZW0nLFxuICAgICAgICAgICAgICB9fT5cdUM4MDRcdUNDQjQ8L2J1dHRvbj5cbiAgICAgICAgICAgIHtib2FyZFByZWZpeGVzLm1hcChwID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e3B9IHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVByZWZpeChhY3RpdmVQcmVmaXggPT09IHAgPyBcIlwiIDogcCl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6JzRweCAxNnB4JywgYm9yZGVyOicxcHggc29saWQnLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IGFjdGl2ZVByZWZpeCA9PT0gcCA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0tbGluZS0yKScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogYWN0aXZlUHJlZml4ID09PSBwID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYWN0aXZlUHJlZml4ID09PSBwID8gJ3JnYmEoMTU4LDEwNCwyNCwwLjA2KScgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMywgbGV0dGVyU3BhY2luZzonMC4wNWVtJyxcbiAgICAgICAgICAgICAgICB9fT57cH08L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIDx0YWJsZSBzdHlsZT17e3dpZHRoOicxMDAlJywgYm9yZGVyQ29sbGFwc2U6J2NvbGxhcHNlJ319PlxuICAgICAgICAgIDxjYXB0aW9uIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5cdUFDOENcdUMyRENcdUFFMDAgXHVCQUE5XHVCODVEPC9jYXB0aW9uPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0ciBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4yZW0nLCBjb2xvcjondmFyKC0taW5rLTMpJywgdGV4dFRyYW5zZm9ybTondXBwZXJjYXNlJ319PlxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIiBzdHlsZT17e3BhZGRpbmc6JzE2cHggOHB4JywgdGV4dEFsaWduOidsZWZ0JywgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgd2lkdGg6NjB9fT5cdUJDODhcdUQ2Mzg8L3RoPlxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIiBzdHlsZT17e3BhZGRpbmc6JzE2cHggOHB4JywgdGV4dEFsaWduOidsZWZ0JywgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgd2lkdGg6OTB9fT5cdUJEODRcdUI5NTg8L3RoPlxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIiBzdHlsZT17e3BhZGRpbmc6JzE2cHggOHB4JywgdGV4dEFsaWduOidsZWZ0JywgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319Plx1QzgxQ1x1QkFBOTwvdGg+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiIHN0eWxlPXt7cGFkZGluZzonMTZweCA4cHgnLCB0ZXh0QWxpZ246J2xlZnQnLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB3aWR0aDoxMjB9fT5cdUM3OTFcdUMxMzFcdUM3OTA8L3RoPlxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIiBzdHlsZT17e3BhZGRpbmc6JzE2cHggOHB4JywgdGV4dEFsaWduOidyaWdodCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHdpZHRoOjcwfX0+XHVDODcwXHVENjhDPC90aD5cbiAgICAgICAgICAgICAgPHRoIHNjb3BlPVwiY29sXCIgc3R5bGU9e3twYWRkaW5nOicxNnB4IDhweCcsIHRleHRBbGlnbjoncmlnaHQnLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB3aWR0aDoxMDB9fT5cdUIwQTBcdUM5REM8L3RoPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgIHtmaWx0ZXJlZC5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgIDx0cj48dGQgY29sU3Bhbj17Nn0gc3R5bGU9e3twYWRkaW5nOjQ4LCB0ZXh0QWxpZ246J2NlbnRlcid9fSBjbGFzc05hbWU9XCJkaW1cIj5cbiAgICAgICAgICAgICAgICBcdUM4NzBcdUFDNzRcdUM1RDAgXHVCOURFXHVCMjk0IFx1QUM4Q1x1QzJEQ1x1QUUwMFx1Qzc3NCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuXG4gICAgICAgICAgICAgIDwvdGQ+PC90cj5cbiAgICAgICAgICAgICkgOiBwYWdlUG9zdHMubWFwKChwLCBpKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGNhdCA9IGNhdGVnb3JpZXMuZmluZChjID0+IGMuaWQgPT09IHAuY2F0ZWdvcnlJZCkgfHwgY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5sYWJlbCA9PT0gcC5jYXRlZ29yeSkgfHwgeyBsYWJlbDogcC5jYXRlZ29yeSB9O1xuICAgICAgICAgICAgICBjb25zdCBsaWtlc0NvdW50ID0gQXJyYXkuaXNBcnJheShwLmxpa2VzKSA/IHAubGlrZXMubGVuZ3RoIDogMDtcbiAgICAgICAgICAgICAgY29uc3QgYm9va21hcmtlZCA9IHVzZXIgJiYgRy5jYWxsKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8uaXNCb29rbWFya2VkPy4odXNlci5pZCwgcC5pZCksIGZhbHNlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8dHIga2V5PXtwLmlkfSBzdHlsZT17e2JvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgdHJhbnNpdGlvbjonYmFja2dyb3VuZCAuMnMnfX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICdyZ2JhKDI0NSwyMTMsNzIsMC4wMyknfVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3RyYW5zcGFyZW50J30+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7cGFkZGluZzonMThweCA4cHgnLCBmb250U2l6ZToxMn19PntTdHJpbmcoZmlsdGVyZWQubGVuZ3RoIC0gKHBhZ2VTdGFydCArIGkpKS5wYWRTdGFydCgzLCAnMCcpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCd9fT48c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiPntjYXQubGFiZWx9PC9zcGFuPjwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCcsIGZvbnRTaXplOjE1fX0gY2xhc3NOYW1lPVwicm93LXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldFBvc3RJZChwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2FsbDondW5zZXQnLCBjdXJzb3I6J3BvaW50ZXInLCB0ZXh0QWxpZ246J2xlZnQnfX0+XG4gICAgICAgICAgICAgICAgICAgICAge2Jvb2ttYXJrZWQgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIHN0eWxlPXt7bWFyZ2luUmlnaHQ6NiwgZm9udFNpemU6MTF9fSBhcmlhLWxhYmVsPVwiXHVCRDgxXHVCOUM4XHVEMDZDXCI+XHUyNjA1PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7cC50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgICB7cC5pbWFnZXM/Lmxlbmd0aCA+IDAgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZCBtb25vXCIgc3R5bGU9e3ttYXJnaW5MZWZ0OjgsIGZvbnRTaXplOjEwfX0gYXJpYS1sYWJlbD1cIlx1Qzc3NFx1QkJGOFx1QzlDMCBcdUNDQThcdUJEODBcIj5cdUQ4M0RcdURDRjd7cC5pbWFnZXMubGVuZ3RofTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAge2xpa2VzQ291bnQgPiAwICYmIDxzcGFuIGNsYXNzTmFtZT1cImdvbGQgbW9ub1wiIHN0eWxlPXt7bWFyZ2luTGVmdDo4LCBmb250U2l6ZToxMH19IGFyaWEtbGFiZWw9XCJcdUFDRjVcdUFDMTAgXHVDMjE4XCI+XHUyNjY1e2xpa2VzQ291bnR9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7cC50YWdzPy5sZW5ndGggPiAwICYmIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yIG1vbm9cIiBzdHlsZT17e21hcmdpbkxlZnQ6OCwgZm9udFNpemU6MTB9fT57cC50YWdzLnNsaWNlKDAsMykubWFwKHQgPT4gYCMke3R9YCkuam9pbignICcpfTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAge3AuaG90ICYmIDxzcGFuIGNsYXNzTmFtZT1cImdvbGRcIiBzdHlsZT17e21hcmdpbkxlZnQ6OCwgZm9udFNpemU6MTB9fT5IT1Q8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgIHtwLl9uZXcgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIHN0eWxlPXt7bWFyZ2luTGVmdDo4LCBmb250U2l6ZToxMH19Pk5FVzwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJtb25vIGRpbVwiIHN0eWxlPXt7cGFkZGluZzonMThweCA4cHgnLCBmb250U2l6ZToxMn19PlxuICAgICAgICAgICAgICAgICAgICB7cC5hdXRob3J9XG4gICAgICAgICAgICAgICAgICAgIDxBdXRob3JHcmFkZUJhZGdlIGF1dGhvcklkPXtwLmF1dGhvcklkfSBhdXRob3I9e3AuYXV0aG9yfSBhdXRob3JFbWFpbD17cC5hdXRob3JFbWFpbH0vPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCcsIGZvbnRTaXplOjEyLCB0ZXh0QWxpZ246J3JpZ2h0J319PntwLnZpZXdzID8/IDB9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCcsIGZvbnRTaXplOjExLCB0ZXh0QWxpZ246J3JpZ2h0J319PlxuICAgICAgICAgICAgICAgICAgICA8dGltZSBkYXRlVGltZT17cC5kYXRlLnJlcGxhY2UoL1xcLi9nLCctJyl9PntwLmRhdGV9PC90aW1lPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cblxuICAgICAgICB7LyogUGFnaW5hdGlvbiAqL31cbiAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA+IDAgJiYgdG90YWxQYWdlcyA+IDEgJiYgKFxuICAgICAgICAgIDxuYXYgYXJpYS1sYWJlbD1cIlx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUQzOThcdUM3NzRcdUM5QzAgXHVDNzc0XHVCM0Q5XCIgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J2NlbnRlcicsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDo2LCBtYXJnaW5Ub3A6MzIsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFBhZ2UoTWF0aC5tYXgoMSwgc2FmZVBhZ2UgLSAxKSl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzYWZlUGFnZSA8PSAxfT5cdTIxOTAgXHVDNzc0XHVDODA0PC9idXR0b24+XG4gICAgICAgICAgICB7QXJyYXkuZnJvbSh7IGxlbmd0aDogdG90YWxQYWdlcyB9LCAoXywgaWR4KSA9PiBpZHggKyAxKS5tYXAoKG4pID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e259IHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICAgICAgICBhcmlhLWN1cnJlbnQ9e24gPT09IHNhZmVQYWdlID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFBhZ2Uobil9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBuID09PSBzYWZlUGFnZSA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IG4gPT09IHNhZmVQYWdlID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogbiA9PT0gc2FmZVBhZ2UgPyAncmdiYSgyNDUsMjEzLDcyLDAuMDgpJyA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICBtaW5XaWR0aDogMzYsXG4gICAgICAgICAgICAgICAgfX0+e259PC9idXR0b24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRQYWdlKE1hdGgubWluKHRvdGFsUGFnZXMsIHNhZmVQYWdlICsgMSkpfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17c2FmZVBhZ2UgPj0gdG90YWxQYWdlc30+XHVCMkU0XHVDNzRDIFx1MjE5MjwvYnV0dG9uPlxuICAgICAgICAgIDwvbmF2PlxuICAgICAgICApfVxuXG4gICAgICAgIHtmaWx0ZXJlZC5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e3RleHRBbGlnbjonY2VudGVyJywgZm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMmVtJywgbWFyZ2luVG9wOjEyfX0+XG4gICAgICAgICAgICBcdUM4MDRcdUNDQjQge2ZpbHRlcmVkLmxlbmd0aH1cdUFDNzQgXHUwMEI3IHtzYWZlUGFnZX0ve3RvdGFsUGFnZXN9IFx1RDM5OFx1Qzc3NFx1QzlDMFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBcdUQ1NThcdUIyRTggXHVBQzgwXHVDMEM5ICsgXHVBRTAwXHVDNEYwXHVBRTMwIFx1QkMxNCAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBnYXA6MTAsIGFsaWduSXRlbXM6J2NlbnRlcicsIGp1c3RpZnlDb250ZW50OidjZW50ZXInLFxuICAgICAgICAgIG1hcmdpblRvcDo0MCwgcGFkZGluZ1RvcDoyNCwgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgIGZsZXhXcmFwOid3cmFwJyxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjb21tdW5pdHktc2VhcmNoLWJvdHRvbVwiIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5cdUFDOENcdUMyRENcdUFFMDAgXHVBQzgwXHVDMEM5PC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJjb21tdW5pdHktc2VhcmNoLWJvdHRvbVwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17dGFiID09PSBcImFsbFwiID8gXCJcdUM4MDRcdUNDQjQgXHVBQzhDXHVDMkRDXHVEMzEwIFx1QUM4MFx1QzBDOS4uLlwiIDogYCR7Y3VycmVudEJvYXJkPy5sYWJlbCB8fCAnJ30gXHVBQzhDXHVDMkRDXHVEMzEwIFx1QUM4MFx1QzBDOS4uLmB9XG4gICAgICAgICAgICB2YWx1ZT17c2VhcmNofSBvbkNoYW5nZT17ZSA9PiBzZXRTZWFyY2goZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgc3R5bGU9e3t3aWR0aDoyODAsIHBhZGRpbmc6JzEycHggMTZweCcsIGZvbnRTaXplOjE0fX0vPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZFwiIG9uQ2xpY2s9e2hhbmRsZVdyaXRlfVxuICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxMnB4IDI4cHgnLCBmb250U2l6ZToxM319PlxuICAgICAgICAgICAge3VzZXIgPyAnXHVBRTAwXHVDNEYwXHVBRTMwIFx1RkYwQicgOiAnXHVCODVDXHVBREY4XHVDNzc4IFx1RDZDNCBcdUFFMDBcdUM0RjBcdUFFMzAnfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgey8qIHYwMC4wNjggXHUyMDE0IFx1QUUwMFx1QzRGMFx1QUUzMCBcdUJBQThcdUIyRUMgKFx1QkFBOVx1Qjg1RCBcdUM3MDRcdUM1RDAgXHVENDVDXHVDMkRDKS4gdXNlTW9kYWxHdWFyZCBcdUI4NUMgRVNDL1x1QzY3OFx1QkQ4MFx1RDA3NFx1QjlBRCBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgcHJvbXB0LiAqL31cbiAgICAgIHt3cml0aW5nICYmIDxQb3N0Q29tcG9zZU1vZGFsIG9uQ2xvc2U9eygpID0+IHNldFdyaXRpbmcobnVsbCl9Lz59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyA9PT0gUG9zdCBDb21wb3NlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFx1QzBDOCBcdUFFMDAgXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1IFx1RDBBNCBcdTIwMTQgXHVDMEFDXHVDNkE5XHVDNzkwXHVCQ0M0XHVCODVDIFx1QkQ4NFx1QjlBQyhcdUM1RUNcdUI3RUMgXHVBQ0M0XHVDODE1XHVDNzc0IFx1QUMxOVx1Qzc0MCBcdUJFMENcdUI3N0NcdUM2QjBcdUM4MDBcdUI5N0MgXHVDNEY4IFx1QjU0QyBcdUMxMUVcdUM3NzRcdUM5QzAgXHVDNTRBXHVCM0M0XHVCODVEKS5cbmNvbnN0IGRyYWZ0S2V5Rm9yID0gKHVzZXJJZCkgPT4gYGJnbmpfcG9zdF9kcmFmdF8ke3VzZXJJZCB8fCAnZ3Vlc3QnfWA7XG5cbmNvbnN0IFBvc3RDb21wb3NlID0gKHsgdXNlciwgaW5pdGlhbFBvc3QsIG9uQ2FuY2VsLCBvblB1Ymxpc2gsIGNhdGVnb3JpZXMsIHVzZXJMZXZlbCB9KSA9PiB7XG4gIGNvbnN0IHdyaXRhYmxlID0gY2F0ZWdvcmllcy5maWx0ZXIoYyA9PiB1c2VyTGV2ZWwgPj0gKGMucG9zdE1pbkxldmVsID8/IGMubWluTGV2ZWwgPz8gMCkpO1xuICBjb25zdCBkZWZhdWx0Q2F0ZWdvcnlJZCA9IGluaXRpYWxQb3N0Py5jYXRlZ29yeUlkIHx8IHdyaXRhYmxlWzBdPy5pZCB8fCBjYXRlZ29yaWVzWzBdPy5pZCB8fCBcIlwiO1xuICBjb25zdCBpc0VkaXRpbmcgPSAhIWluaXRpYWxQb3N0O1xuXG4gIC8vIFx1QzBDOCBcdUFFMDAgXHVDNzkxXHVDMTMxXHVDNzdDIFx1QjU0Q1x1QjlDQyBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgXHVCQ0Y1XHVDNkQwL1x1QzgwMFx1QzdBNS4gXHVDMjE4XHVDODE1IFx1QkFBOFx1QjREQ1x1QzVEMFx1QzExQ1x1QjI5NCBcdUM2RDBcdUJDRjggXHVBQzhDXHVDMkRDXHVBRTAwXHVDNzc0IHNvdXJjZSBvZiB0cnV0aC5cbiAgY29uc3QgZHJhZnRLZXkgPSBkcmFmdEtleUZvcih1c2VyPy5pZCk7XG4gIGNvbnN0IGluaXRpYWxEcmFmdCA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChpc0VkaXRpbmcpIHJldHVybiBudWxsO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShkcmFmdEtleSk7XG4gICAgICByZXR1cm4gcmF3ID8gSlNPTi5wYXJzZShyYXcpIDogbnVsbDtcbiAgICB9IGNhdGNoIHsgcmV0dXJuIG51bGw7IH1cbiAgfSwgW2RyYWZ0S2V5LCBpc0VkaXRpbmddKTtcblxuICBjb25zdCBbY2F0ZWdvcnlJZCwgc2V0Q2F0ZWdvcnlJZF0gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsRHJhZnQ/LmNhdGVnb3J5SWQgfHwgZGVmYXVsdENhdGVnb3J5SWQpO1xuICBjb25zdCBbdGl0bGUsIHNldFRpdGxlXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxQb3N0Py50aXRsZSB8fCBpbml0aWFsRHJhZnQ/LnRpdGxlIHx8IFwiXCIpO1xuICBjb25zdCBbcHJlZml4LCBzZXRQcmVmaXhdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LnByZWZpeCB8fCBpbml0aWFsRHJhZnQ/LnByZWZpeCB8fCBcIlwiKTtcbiAgY29uc3QgW3RhZ3MsIHNldFRhZ3NdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LnRhZ3MgfHwgaW5pdGlhbERyYWZ0Py50YWdzIHx8IFtdKTtcbiAgY29uc3QgW2ltYWdlcywgc2V0SW1hZ2VzXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxQb3N0Py5pbWFnZXMgfHwgaW5pdGlhbERyYWZ0Py5pbWFnZXMgfHwgW10pO1xuICBjb25zdCBbYXR0YWNobWVudHMsIHNldEF0dGFjaG1lbnRzXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxQb3N0Py5hdHRhY2htZW50cyB8fCBpbml0aWFsRHJhZnQ/LmF0dGFjaG1lbnRzIHx8IFtdKTtcbiAgY29uc3QgW2JvZHlIdG1sLCBzZXRCb2R5SHRtbF0gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsUG9zdD8uYm9keT8uaHRtbCB8fCBpbml0aWFsRHJhZnQ/LmJvZHlIdG1sIHx8IFwiXCIpO1xuICBjb25zdCBbYm9keVRleHQsIHNldEJvZHlUZXh0XSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxQb3N0Py5ib2R5Py50ZXh0IHx8IGluaXRpYWxEcmFmdD8uYm9keVRleHQgfHwgXCJcIik7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gUmVhY3QudXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtkcmFmdFJlc3RvcmVkLCBzZXREcmFmdFJlc3RvcmVkXSA9IFJlYWN0LnVzZVN0YXRlKCEhKGluaXRpYWxEcmFmdCAmJiAoaW5pdGlhbERyYWZ0LnRpdGxlIHx8IGluaXRpYWxEcmFmdC5ib2R5VGV4dCkpKTtcbiAgY29uc3QgW3NhdmVkQXQsIHNldFNhdmVkQXRdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbERyYWZ0Py5zYXZlZEF0IHx8IG51bGwpO1xuICBjb25zdCBwcmV2Q2F0ZWdvcnlJZFJlZiA9IFJlYWN0LnVzZVJlZihjYXRlZ29yeUlkKTtcblxuICAvLyBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgXHUyMDE0IFx1QzIxOFx1QzgxNSBcdUJBQThcdUI0REMgXHVDODFDXHVDNjc4LCAxXHVDRDA4IFx1QjUxNFx1QkMxNFx1QzZCNFx1QzJBNFx1Qjg1QyBcdUM4MDBcdUM3QTUuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzRWRpdGluZykgcmV0dXJuO1xuICAgIGNvbnN0IGhhc0NvbnRlbnQgPSAhISh0aXRsZS50cmltKCkgfHwgYm9keVRleHQudHJpbSgpIHx8ICh0YWdzICYmIHRhZ3MubGVuZ3RoKSB8fCAoaW1hZ2VzICYmIGltYWdlcy5sZW5ndGgpIHx8IChhdHRhY2htZW50cyAmJiBhdHRhY2htZW50cy5sZW5ndGgpKTtcbiAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaGFzQ29udGVudCkge1xuICAgICAgICAgIGNvbnN0IHNuYXBzaG90ID0geyBjYXRlZ29yeUlkLCB0aXRsZSwgcHJlZml4LCB0YWdzLCBpbWFnZXMsIGF0dGFjaG1lbnRzLCBib2R5SHRtbCwgYm9keVRleHQsIHNhdmVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9O1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGRyYWZ0S2V5LCBKU09OLnN0cmluZ2lmeShzbmFwc2hvdCkpO1xuICAgICAgICAgIHNldFNhdmVkQXQoc25hcHNob3Quc2F2ZWRBdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oZHJhZnRLZXkpO1xuICAgICAgICAgIHNldFNhdmVkQXQobnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2gge31cbiAgICB9LCA4MDApO1xuICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodCk7XG4gIH0sIFtkcmFmdEtleSwgaXNFZGl0aW5nLCBjYXRlZ29yeUlkLCB0aXRsZSwgcHJlZml4LCB0YWdzLCBpbWFnZXMsIGF0dGFjaG1lbnRzLCBib2R5SHRtbCwgYm9keVRleHRdKTtcblxuICBjb25zdCBjbGVhckRyYWZ0ID0gKCkgPT4ge1xuICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGRyYWZ0S2V5KTsgfSBjYXRjaCB7fVxuICAgIHNldFNhdmVkQXQobnVsbCk7XG4gICAgc2V0RHJhZnRSZXN0b3JlZChmYWxzZSk7XG4gIH07XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRDYXRlZ29yeUlkKGluaXRpYWxQb3N0Py5jYXRlZ29yeUlkIHx8IGRlZmF1bHRDYXRlZ29yeUlkKTtcbiAgICBzZXRUaXRsZShpbml0aWFsUG9zdD8udGl0bGUgfHwgXCJcIik7XG4gICAgc2V0UHJlZml4KGluaXRpYWxQb3N0Py5wcmVmaXggfHwgXCJcIik7XG4gICAgc2V0VGFncyhpbml0aWFsUG9zdD8udGFncyB8fCBbXSk7XG4gICAgc2V0SW1hZ2VzKGluaXRpYWxQb3N0Py5pbWFnZXMgfHwgW10pO1xuICAgIHNldEF0dGFjaG1lbnRzKGluaXRpYWxQb3N0Py5hdHRhY2htZW50cyB8fCBbXSk7XG4gICAgc2V0Qm9keUh0bWwoaW5pdGlhbFBvc3Q/LmJvZHk/Lmh0bWwgfHwgXCJcIik7XG4gICAgc2V0Qm9keVRleHQoaW5pdGlhbFBvc3Q/LmJvZHk/LnRleHQgfHwgXCJcIik7XG4gICAgc2V0RXJyb3IoXCJcIik7XG4gICAgcHJldkNhdGVnb3J5SWRSZWYuY3VycmVudCA9IGluaXRpYWxQb3N0Py5jYXRlZ29yeUlkIHx8IGRlZmF1bHRDYXRlZ29yeUlkO1xuICAgIC8vIGluaXRpYWxQb3N0IFx1QUMwMCBcdUI0RTRcdUM1QjRcdUM2MjRcdUJBNzQgKD0gXHVDMjE4XHVDODE1IFx1QkFBOFx1QjREQykgXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1XHVDNzQwIFx1QkIzNFx1QzJEQy5cbiAgfSwgW2luaXRpYWxQb3N0LCBkZWZhdWx0Q2F0ZWdvcnlJZF0pO1xuXG4gIGNvbnN0IHNlbGVjdGVkQ2F0ID0gY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5pZCA9PT0gY2F0ZWdvcnlJZCk7XG4gIGNvbnN0IGJvYXJkUHJlZml4ZXMgPSBzZWxlY3RlZENhdD8ucHJlZml4ZXMgfHwgW107XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAocHJldkNhdGVnb3J5SWRSZWYuY3VycmVudCA9PT0gY2F0ZWdvcnlJZCkgcmV0dXJuO1xuICAgIHByZXZDYXRlZ29yeUlkUmVmLmN1cnJlbnQgPSBjYXRlZ29yeUlkO1xuICAgIGlmICghaXNFZGl0aW5nIHx8IGNhdGVnb3J5SWQgIT09IChpbml0aWFsUG9zdD8uY2F0ZWdvcnlJZCB8fCBcIlwiKSkge1xuICAgICAgc2V0UHJlZml4KFwiXCIpO1xuICAgIH1cbiAgfSwgW2NhdGVnb3J5SWQsIGluaXRpYWxQb3N0LCBpc0VkaXRpbmddKTtcblxuICBjb25zdCBzdWJtaXQgPSAoKSA9PiB7XG4gICAgc2V0RXJyb3IoXCJcIik7XG4gICAgaWYgKCF0aXRsZS50cmltKCkpIHJldHVybiBzZXRFcnJvcihcIlx1QzgxQ1x1QkFBOVx1Qzc0NCBcdUM3ODVcdUI4MjVcdUQ1NzRcdUM4RkNcdUMxMzhcdUM2OTQuXCIpO1xuICAgIGlmICghYm9keVRleHQudHJpbSgpKSByZXR1cm4gc2V0RXJyb3IoXCJcdUJDRjhcdUJCMzhcdUM3NDQgXHVDNzg1XHVCODI1XHVENTc0XHVDOEZDXHVDMTM4XHVDNjk0LlwiKTtcbiAgICBjb25zdCBjYXQgPSBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmlkID09PSBjYXRlZ29yeUlkKTtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAvLyBcdUJDMUNcdUQ1ODkgXHVDMTMxXHVBQ0Y1IFx1QUMwMFx1QzgxNVx1QzczQ1x1Qjg1QyBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgXHVDODE1XHVCOUFDIChcdUMyRTRcdUQzMjggXHVDMkRDIG9uUHVibGlzaCBcdUNFMjFcdUM1RDBcdUMxMUMgXHVCMkU0XHVDMkRDIFx1QzgwMFx1QzdBNVx1Qzc0MCBcdUM1NDggXHVENTY4KS5cbiAgICBpZiAoIWlzRWRpdGluZykge1xuICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oZHJhZnRLZXkpOyB9IGNhdGNoIHt9XG4gICAgfVxuICAgIG9uUHVibGlzaCh7XG4gICAgICBjYXRlZ29yeUlkOiBjYXQuaWQsXG4gICAgICBjYXRlZ29yeTogY2F0LmxhYmVsLFxuICAgICAgcHJlZml4OiBwcmVmaXggfHwgXCJcIixcbiAgICAgIHRpdGxlOiB0aXRsZS50cmltKCksXG4gICAgICBhdXRob3I6IHVzZXI/Lm5hbWUgfHwgXCJcdUM3NzVcdUJBODVcIixcbiAgICAgIGF1dGhvcklkOiB1c2VyPy5pZCB8fCBudWxsLFxuICAgICAgYXV0aG9yRW1haWw6IHVzZXI/LmVtYWlsIHx8IG51bGwsXG4gICAgICByZXBsaWVzOiBpbml0aWFsUG9zdD8ucmVwbGllcyA/PyAwLFxuICAgICAgdmlld3M6IGluaXRpYWxQb3N0Py52aWV3cyA/PyAwLFxuICAgICAgZGF0ZTogYCR7bm93LmdldEZ1bGxZZWFyKCl9LiR7cGFkKG5vdy5nZXRNb250aCgpKzEpfS4ke3BhZChub3cuZ2V0RGF0ZSgpKX1gLFxuICAgICAgdGFncyxcbiAgICAgIGltYWdlcyxcbiAgICAgIGF0dGFjaG1lbnRzLFxuICAgICAgX25ldzogdHJ1ZSxcbiAgICAgIF91c2VyQ3JlYXRlZDogdHJ1ZSxcbiAgICAgIGJvZHk6IHsgaHRtbDogYm9keUh0bWwsIHRleHQ6IGJvZHlUZXh0IH0sXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb25cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgc3R5bGU9e3ttYXhXaWR0aDo5NjB9fT5cbiAgICAgICAgPGhlYWRlciBzdHlsZT17e21hcmdpbkJvdHRvbTozMn19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+Q09NUE9TRSBcdTAwQjcgXHVBRTAwXHVDNEYwXHVBRTMwPC9kaXY+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInNlY3Rpb24tdGl0bGVcIiBzdHlsZT17e2ZvbnRTaXplOjM2fX0+e2lzRWRpdGluZyA/IFwiXHVBQzhDXHVDMkRDXHVBRTAwIFx1QzIxOFx1QzgxNVwiIDogXCJcdUMwQzggXHVBRTAwIFx1Qzc5MVx1QzEzMVwifTwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxMywgbWFyZ2luVG9wOjh9fT5cbiAgICAgICAgICAgIFx1Qzc5MVx1QzEzMVx1Qzc5MDogPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiPnt1c2VyPy5uYW1lIHx8ICdcdUM3NzVcdUJBODUnfTwvc3Bhbj5cbiAgICAgICAgICAgIHshaXNFZGl0aW5nICYmIHNhdmVkQXQgJiYgKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaW0tMiBtb25vXCIgc3R5bGU9e3ttYXJnaW5MZWZ0OjE0LCBmb250U2l6ZToxMX19PlxuICAgICAgICAgICAgICAgIFx1MDBCNyBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTVcdUI0MjggKHtuZXcgRGF0ZShzYXZlZEF0KS50b0xvY2FsZVRpbWVTdHJpbmcoJ2tvLUtSJywge2hvdXI6JzItZGlnaXQnLCBtaW51dGU6JzItZGlnaXQnfSl9KVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICB7IWlzRWRpdGluZyAmJiBkcmFmdFJlc3RvcmVkICYmIChcbiAgICAgICAgICAgIDxkaXYgcm9sZT1cInN0YXR1c1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgIG1hcmdpblRvcDoxNCwgcGFkZGluZzonMTBweCAxNHB4JywgYmFja2dyb3VuZDoncmdiYSgyNDUsMjEzLDcyLDAuMDYpJyxcbiAgICAgICAgICAgICAgYm9yZGVyOicxcHggc29saWQgdmFyKC0tZ29sZC1kaW0pJywgZm9udFNpemU6MTIsIGNvbG9yOid2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICBkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBnYXA6MTIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHNwYW4+XHVDNzc0XHVDODA0XHVDNUQwIFx1Qzc5MVx1QzEzMVx1RDU1OFx1QjM1OCBcdUFFMDBcdUM3NDQgXHVCQ0Y1XHVDNkQwXHVENTg4XHVDMkI1XHVCMkM4XHVCMkU0Ljwvc3Bhbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoY29uZmlybSgnXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1XHVCNDFDIFx1QUUwMFx1Qzc0NCBcdUMwQURcdUM4MUNcdUQ1NThcdUFDRTAgXHVDMEM4XHVCODVDIFx1QzJEQ1x1Qzc5MVx1RDU1OFx1QzJEQ1x1QUNBMFx1QzVCNFx1QzY5ND8nKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaXRsZSgnJyk7IHNldFByZWZpeCgnJyk7IHNldFRhZ3MoW10pOyBzZXRJbWFnZXMoW10pO1xuICAgICAgICAgICAgICAgICAgICBzZXRCb2R5SHRtbCgnJyk7IHNldEJvZHlUZXh0KCcnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJEcmFmdCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWRhbmdlciknLCB0ZXh0RGVjb3JhdGlvbjondW5kZXJsaW5lJ319PlxuICAgICAgICAgICAgICAgIFx1QzBDOFx1Qjg1QyBcdUMyRENcdUM3OTFcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICA8Zm9ybSBvblN1Ym1pdD17KGUpID0+IHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzdWJtaXQoKTsgfX0gbm9WYWxpZGF0ZT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6JzE2MHB4IDFmcicsIGdhcDoxNiwgbWFyZ2luQm90dG9tOiBib2FyZFByZWZpeGVzLmxlbmd0aCA+IDAgPyAxMiA6IDIwfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCIgc3R5bGU9e3ttYXJnaW46MH19PlxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIiBodG1sRm9yPVwicG9zdC1jYXRcIj5cdUFDOENcdUMyRENcdUQzMTA8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwicG9zdC1jYXRcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2NhdGVnb3J5SWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0Q2F0ZWdvcnlJZChlLnRhcmdldC52YWx1ZSl9PlxuICAgICAgICAgICAgICAgIHt3cml0YWJsZS5tYXAoYyA9PiAoXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17Yy5pZH0gdmFsdWU9e2MuaWR9PntjLmxhYmVsfTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiIHN0eWxlPXt7bWFyZ2luOjB9fT5cbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCIgaHRtbEZvcj1cInBvc3QtdGl0bGVcIj5cdUM4MUNcdUJBQTkgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPio8L3NwYW4+PC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwicG9zdC10aXRsZVwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlx1QzgxQ1x1QkFBOVx1Qzc0NCBcdUM3ODVcdUI4MjVcdUQ1NThcdUMxMzhcdUM2OTRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXt0aXRsZX0gb25DaGFuZ2U9e2UgPT4gc2V0VGl0bGUoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHJlcXVpcmVkIG1heExlbmd0aD17MTIwfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBcdUI5RDBcdUJBMzhcdUI5QUMgXHVDMTIwXHVEMEREIFx1MjAxNCBcdUMxMjBcdUQwRERcdUI0MUMgXHVBQzhDXHVDMkRDXHVEMzEwXHVDNUQwIFx1QjlEMFx1QkEzOFx1QjlBQ1x1QUMwMCBcdUM3ODhcdUM3NDQgXHVCNTRDXHVCOUNDIFx1RDQ1Q1x1QzJEQyAqL31cbiAgICAgICAgICB7Ym9hcmRQcmVmaXhlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIiBzdHlsZT17e21hcmdpbkJvdHRvbToyMH19PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCI+XHVCOUQwXHVCQTM4XHVCOUFDPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjgsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRQcmVmaXgoXCJcIil9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e3BhZGRpbmc6JzRweCAxNHB4JywgYm9yZGVyOicxcHggc29saWQnLCBib3JkZXJDb2xvcjogcHJlZml4ID09PSBcIlwiID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lKScsIGNvbG9yOiBwcmVmaXggPT09IFwiXCIgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsIGJhY2tncm91bmQ6J25vbmUnLCBjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMywgbGV0dGVyU3BhY2luZzonMC4wNWVtJ319PlxuICAgICAgICAgICAgICAgICAgXHVDNUM2XHVDNzRDXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAge2JvYXJkUHJlZml4ZXMubWFwKChwKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17cH0gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFByZWZpeChwKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOic0cHggMTRweCcsIGJvcmRlcjonMXB4IHNvbGlkJywgYm9yZGVyQ29sb3I6IHByZWZpeCA9PT0gcCA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0tbGluZSknLCBjb2xvcjogcHJlZml4ID09PSBwID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLCBiYWNrZ3JvdW5kOiBwcmVmaXggPT09IHAgPyAncmdiYSgyNDUsMjEzLDcyLDAuMDgpJyA6ICdub25lJywgY3Vyc29yOidwb2ludGVyJywgZm9udFNpemU6MTMsIGxldHRlclNwYWNpbmc6JzAuMDVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAge3B9XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAgey8qIEhhc2h0YWdzICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIj5cdUQ1NzRcdUMyRENcdUQwRENcdUFERjggLyBcdUJBNTRcdUQwQzBcdUQwRENcdUFERjg8L2Rpdj5cbiAgICAgICAgICAgIDxIYXNodGFnSW5wdXQgdGFncz17dGFnc30gc2V0VGFncz17c2V0VGFnc30vPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFRpcHRhcCBlZGl0b3IgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIj5cdUJDRjhcdUJCMzggPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPio8L3NwYW4+PC9kaXY+XG4gICAgICAgICAgICAgIDxUaXB0YXBFZGl0b3Iga2V5PXtpbml0aWFsUG9zdD8uaWQgfHwgXCJuZXdcIn1cbiAgICAgICAgICAgICAgICBwcmVzZXQ9XCJzaW1wbGVcIlxuICAgICAgICAgICAgICAgIGNvbnRlbnQ9e2JvZHlIdG1sfVxuICAgICAgICAgICAgICAgIG9uVXBkYXRlPXsoaHRtbCwgX2pzb24sIHRleHQpID0+IHsgc2V0Qm9keUh0bWwoaHRtbCk7IHNldEJvZHlUZXh0KHRleHQpOyB9fVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiXHVCQ0Y4XHVCQjM4XHVDNzQ0IFx1Qzc4NVx1QjgyNVx1RDU1OFx1QzEzOFx1QzY5NC4uLlwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIEltYWdlIGF0dGFjaG1lbnRzICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgIDxJbWFnZUF0dGFjaGVyIGltYWdlcz17aW1hZ2VzfSBzZXRJbWFnZXM9e3NldEltYWdlc30gbWF4PXsxMH0vPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIEZpbGUgYXR0YWNobWVudHMgKHYwMC4wNjkpICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgIDxGaWxlQXR0YWNoZXIgZmlsZXM9e2F0dGFjaG1lbnRzfSBzZXRGaWxlcz17c2V0QXR0YWNobWVudHN9Lz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHtlcnJvciAmJiAoXG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJhbGVydFwiIHN0eWxlPXt7cGFkZGluZzonMTJweCAxNnB4JywgYmFja2dyb3VuZDoncmdiYSgxOTQsNzQsNjEsMC4xKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWRhbmdlciknLCBjb2xvcjondmFyKC0tZGFuZ2VyKScsIGZvbnRTaXplOjEzLCBtYXJnaW5Cb3R0b206MTZ9fT5cbiAgICAgICAgICAgICAge2Vycm9yfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEyLCBqdXN0aWZ5Q29udGVudDonZmxleC1lbmQnLCBwYWRkaW5nVG9wOjIwLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKSd9fT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9e29uQ2FuY2VsfT5cdUNERThcdUMxOEM8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZFwiPntpc0VkaXRpbmcgPyBcIlx1QzIxOFx1QzgxNSBcdUM4MDBcdUM3QTUgXHUyMTkyXCIgOiBcIlx1QUM4Q1x1QzJEQ1x1RDU1OFx1QUUzMCBcdTIxOTJcIn08L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyA9PT0gUG9zdCBEZXRhaWwgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCBQb3N0RGV0YWlsID0gKHsgcG9zdCwgZ28sIHNldFBvc3RJZCwgdXNlciwgb25SZWZyZXNoLCBvbkVkaXQgfSkgPT4ge1xuICBjb25zdCBHID0gd2luZG93LkJHTkpfR1VBUkQ7XG4gIGNvbnN0IFtjb21tZW50LCBzZXRDb21tZW50XSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbY29tbWVudHNMaXN0LCBzZXRDb21tZW50c0xpc3RdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4gRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5nZXRDb21tZW50cz8uKHBvc3QuaWQpKSk7XG4gIGNvbnN0IFtyZXBvcnRPcGVuLCBzZXRSZXBvcnRPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3JlcG9ydFJlYXNvbiwgc2V0UmVwb3J0UmVhc29uXSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbcmVwb3J0U3VibWl0dGVkLCBzZXRSZXBvcnRTdWJtaXR0ZWRdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBjYW5NYW5hZ2VQb3N0ID0gISF1c2VyICYmICh1c2VyLmlzQWRtaW4gfHwgcG9zdC5hdXRob3JJZCA9PT0gdXNlci5pZCB8fCBwb3N0LmF1dGhvciA9PT0gdXNlci5uYW1lKTtcblxuICAvLyBcdUM4OEJcdUM1NDRcdUM2OTQgLyBcdUJEODFcdUI5QzhcdUQwNkMgXHUyMDE0IFx1QzgwMFx1QzdBNVx1QzE4QyBcdUFFMzBcdUJDMThcbiAgY29uc3QgbGlrZXMgPSBBcnJheS5pc0FycmF5KHBvc3QubGlrZXMpID8gcG9zdC5saWtlcyA6IFtdO1xuICBjb25zdCBsaWtlZCA9ICEhdXNlciAmJiBsaWtlcy5pbmNsdWRlcyh1c2VyLmlkKTtcbiAgY29uc3QgbGlrZXNDb3VudCA9IGxpa2VzLmxlbmd0aDtcbiAgY29uc3QgYm9va21hcmtlZCA9ICEhdXNlciAmJiBHLmNhbGwoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5pc0Jvb2ttYXJrZWQ/Lih1c2VyLmlkLCBwb3N0LmlkKSwgZmFsc2UpO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0Q29tbWVudHNMaXN0KEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8uZ2V0Q29tbWVudHM/Lihwb3N0LmlkKSkpO1xuICAgIC8vIFx1QzExQ1x1QkM4NCBcdUFDOENcdUMyRENcdUFFMDBcdUM3NzRcdUJBNzQgXHVDMTFDXHVCQzg0XHVDNUQwXHVDMTFDIFx1QjMxM1x1QUUwMCBcdUIzRDlcdUFFMzBcdUQ2NTRcbiAgICBpZiAocG9zdC5fcmVtb3RlKSB7XG4gICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hDb21tZW50cz8uKHBvc3QuaWQpPy50aGVuPy4oKCkgPT4ge1xuICAgICAgICBzZXRDb21tZW50c0xpc3QoRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5nZXRDb21tZW50cz8uKHBvc3QuaWQpKSk7XG4gICAgICB9KT8uY2F0Y2g/LigoKSA9PiB7fSk7XG4gICAgfVxuICAgIGNvbnN0IG9uUmVmcmVzaENvbW1lbnRzID0gKGUpID0+IHtcbiAgICAgIGlmIChlLmRldGFpbCAmJiBTdHJpbmcoZS5kZXRhaWwucG9zdElkKSA9PT0gU3RyaW5nKHBvc3QuaWQpKSB7XG4gICAgICAgIHNldENvbW1lbnRzTGlzdCh3aW5kb3cuQkdOSl9DT01NVU5JVFkuZ2V0Q29tbWVudHMocG9zdC5pZCkpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JnbmotY29tbWVudHMtcmVmcmVzaCcsIG9uUmVmcmVzaENvbW1lbnRzKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotY29tbWVudHMtcmVmcmVzaCcsIG9uUmVmcmVzaENvbW1lbnRzKTtcbiAgfSwgW3Bvc3QuaWRdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGtleSA9IGBiZ25qX3ZpZXdlZF9wb3N0XyR7cG9zdC5pZH1gO1xuICAgIHRyeSB7XG4gICAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpKSByZXR1cm47XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSwgXCIxXCIpO1xuICAgIH0gY2F0Y2gge31cbiAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFkuaW5jcmVtZW50Vmlld3MocG9zdC5pZCk7XG4gICAgb25SZWZyZXNoPy4oKTtcbiAgfSwgW3Bvc3QuaWRdKTtcblxuICBjb25zdCByZXF1aXJlTG9naW4gPSAobGFiZWwpID0+IHtcbiAgICBpZiAoY29uZmlybShgJHtsYWJlbH1cdUM3NDAoXHVCMjk0KSBcdUI4NUNcdUFERjhcdUM3NzggXHVENkM0IFx1Qzc3NFx1QzZBOVx1RDU2MCBcdUMyMTggXHVDNzg4XHVDMkI1XHVCMkM4XHVCMkU0LiBcdUI4NUNcdUFERjhcdUM3NzggXHVEMzk4XHVDNzc0XHVDOUMwXHVCODVDIFx1Qzc3NFx1QjNEOVx1RDU1OFx1QzJEQ1x1QUNBMFx1QzVCNFx1QzY5ND9gKSkge1xuICAgICAgZ28oJ2xvZ2luJyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUxpa2UgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCF1c2VyKSByZXR1cm4gcmVxdWlyZUxvZ2luKCdcdUFDRjVcdUFDMTAnKTtcbiAgICB0cnkgeyBhd2FpdCB3aW5kb3cuQkdOSl9DT01NVU5JVFkudG9nZ2xlTGlrZShwb3N0LmlkLCB1c2VyLmlkKTsgb25SZWZyZXNoPy4oKTsgfVxuICAgIGNhdGNoIChlcnIpIHsgYWxlcnQoYFx1QUNGNVx1QUMxMCBcdUNDOThcdUI5QUMgXHVDMkU0XHVEMzI4OiAke2Vycj8ubWVzc2FnZSB8fCAnXHVDNTRDIFx1QzIxOCBcdUM1QzZcdUIyOTQgXHVDNjI0XHVCOTU4J31gKTsgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUJvb2ttYXJrID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICghdXNlcikgcmV0dXJuIHJlcXVpcmVMb2dpbignXHVCRDgxXHVCOUM4XHVEMDZDJyk7XG4gICAgdHJ5IHsgYXdhaXQgd2luZG93LkJHTkpfQ09NTVVOSVRZLnRvZ2dsZUJvb2ttYXJrKHVzZXIuaWQsIHBvc3QuaWQpOyBvblJlZnJlc2g/LigpOyB9XG4gICAgY2F0Y2ggKGVycikgeyBhbGVydChgXHVCRDgxXHVCOUM4XHVEMDZDIFx1Q0M5OFx1QjlBQyBcdUMyRTRcdUQzMjg6ICR7ZXJyPy5tZXNzYWdlIHx8ICdcdUM1NEMgXHVDMjE4IFx1QzVDNlx1QjI5NCBcdUM2MjRcdUI5NTgnfWApOyB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlUmVwb3J0U3VibWl0ID0gYXN5bmMgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWS5hZGRSZXBvcnQoe1xuICAgICAgICBwb3N0SWQ6IHBvc3QuaWQsXG4gICAgICAgIHBvc3RUaXRsZTogcG9zdC50aXRsZSxcbiAgICAgICAgcmVwb3J0ZXJJZDogdXNlcj8uaWQgfHwgbnVsbCxcbiAgICAgICAgcmVwb3J0ZXJOYW1lOiB1c2VyPy5uYW1lIHx8ICdcdUM3NzVcdUJBODUnLFxuICAgICAgICByZWFzb246IHJlcG9ydFJlYXNvbixcbiAgICAgIH0pO1xuICAgICAgc2V0UmVwb3J0U3VibWl0dGVkKHRydWUpO1xuICAgICAgc2V0UmVwb3J0UmVhc29uKFwiXCIpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHNldFJlcG9ydE9wZW4oZmFsc2UpOyBzZXRSZXBvcnRTdWJtaXR0ZWQoZmFsc2UpOyB9LCAxODAwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGFsZXJ0KGBcdUMyRTBcdUFDRTAgXHVDODExXHVDMjE4IFx1QzJFNFx1RDMyODogJHtlcnI/Lm1lc3NhZ2UgfHwgJ1x1QzU0QyBcdUMyMTggXHVDNUM2XHVCMjk0IFx1QzYyNFx1Qjk1OCd9YCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHN1Ym1pdENvbW1lbnQgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoIXVzZXIpIHJldHVybjtcbiAgICBjb25zdCB0cmltbWVkID0gY29tbWVudC50cmltKCk7XG4gICAgaWYgKCF0cmltbWVkKSByZXR1cm47XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgY29uc3QgbmV4dCA9IHdpbmRvdy5CR05KX0NPTU1VTklUWS5hZGRDb21tZW50KHBvc3QuaWQsIHtcbiAgICAgIGlkOiBgY29tbWVudC0ke0RhdGUubm93KCl9YCxcbiAgICAgIGF1dGhvcjogdXNlci5uYW1lLFxuICAgICAgYXV0aG9ySWQ6IHVzZXIuaWQsXG4gICAgICBhdXRob3JFbWFpbDogdXNlci5lbWFpbCxcbiAgICAgIGRhdGU6IGAke25vdy5nZXRGdWxsWWVhcigpfS4ke3BhZChub3cuZ2V0TW9udGgoKSsxKX0uJHtwYWQobm93LmdldERhdGUoKSl9ICR7cGFkKG5vdy5nZXRIb3VycygpKX06JHtwYWQobm93LmdldE1pbnV0ZXMoKSl9YCxcbiAgICAgIHRleHQ6IHRyaW1tZWQsXG4gICAgfSk7XG4gICAgc2V0Q29tbWVudHNMaXN0KG5leHQpO1xuXG4gICAgLy8gXHVCQ0Y4XHVDNzc4IFx1QUUwMFx1Qzc3NCBcdUM1NDRcdUIyQzhcdUJBNzQgXHVDNzkxXHVDMTMxXHVDNzkwXHVDNUQwXHVBQzhDIFx1QzU0Q1x1QjlCQy4gYXV0aG9ySWRcdUFDMDAgXHVDNzg4XHVDNUI0XHVDNTdDIFx1RDQ3OFx1QzJEQyBcdUFDMDBcdUIyQTUuXG4gICAgY29uc3QgaXNNeU93blBvc3QgPSBwb3N0LmF1dGhvcklkID09PSB1c2VyLmlkIHx8IHBvc3QuYXV0aG9yID09PSB1c2VyLm5hbWU7XG4gICAgaWYgKCFpc015T3duUG9zdCAmJiBwb3N0LmF1dGhvcklkKSB7XG4gICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFkuYWRkTm90aWZpY2F0aW9uKHBvc3QuYXV0aG9ySWQsIHtcbiAgICAgICAgdHlwZTogJ2NvbW1lbnQnLFxuICAgICAgICBwb3N0SWQ6IHBvc3QuaWQsXG4gICAgICAgIHBvc3RUaXRsZTogcG9zdC50aXRsZSxcbiAgICAgICAgZnJvbU5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1QjBCNCBcdUFFMDBcdUM1RDAgXHVDMEM4IFx1QjMxM1x1QUUwMFx1Qzc3NCBcdUIyRUNcdUI4MzhcdUMyQjVcdUIyQzhcdUIyRTQuJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uUmVmcmVzaD8uKCk7XG4gICAgc2V0Q29tbWVudChcIlwiKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVQb3N0ID0gKCkgPT4ge1xuICAgIGlmICghY29uZmlybShgXCIke3Bvc3QudGl0bGV9XCIgXHVBRTAwXHVDNzQ0IFx1QzBBRFx1QzgxQ1x1RDU1OFx1QzJEQ1x1QUNBMFx1QzVCNFx1QzY5ND9gKSkgcmV0dXJuO1xuICAgIHdpbmRvdy5CR05KX0NPTU1VTklUWS5kZWxldGVQb3N0KHBvc3QuaWQpO1xuICAgIG9uUmVmcmVzaD8uKCk7XG4gICAgc2V0UG9zdElkKG51bGwpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZUNvbW1lbnQgPSAoY29tbWVudElkKSA9PiB7XG4gICAgY29uc3QgbmV4dCA9IHdpbmRvdy5CR05KX0NPTU1VTklUWS5kZWxldGVDb21tZW50KHBvc3QuaWQsIGNvbW1lbnRJZCk7XG4gICAgc2V0Q29tbWVudHNMaXN0KG5leHQpO1xuICAgIG9uUmVmcmVzaD8uKCk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8YXJ0aWNsZSBjbGFzc05hbWU9XCJzZWN0aW9uIHBvc3QtcmVhZFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgcG9zdC1yZWFkLWNvbnRhaW5lclwiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBzZXRQb3N0SWQobnVsbCl9XG4gICAgICAgICAgc3R5bGU9e3ttYXJnaW5Cb3R0b206MzIsIGNvbG9yOid2YXIoLS1pbmstMiknLCBmb250U2l6ZToxMiwgbGV0dGVyU3BhY2luZzonMC4xZW0nfX0+XG4gICAgICAgICAgXHUyMTkwIFx1QkFBOVx1Qjg1RFx1QzczQ1x1Qjg1Q1xuICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICA8aGVhZGVyIHN0eWxlPXt7Ym9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIHBhZGRpbmdCb3R0b206MzIsIG1hcmdpbkJvdHRvbTo0OH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEyLCBtYXJnaW5Cb3R0b206MjAsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2UgYmFkZ2UtZ29sZFwiPntwb3N0LmNhdGVnb3J5fTwvc3Bhbj5cbiAgICAgICAgICAgIHtwb3N0LmhvdCAmJiA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiPkhPVDwvc3Bhbj59XG4gICAgICAgICAgICB7cG9zdC5fdXNlckNyZWF0ZWQgJiYgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2UgYmFkZ2UtZ29sZFwiPlx1QzBDOCBcdUFFMDA8L3NwYW4+fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJwb3N0LXRpdGxlXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtZGlzcGxheSknLFxuICAgICAgICAgICAgZm9udFNpemU6J2NsYW1wKDI4cHgsIDMuNXZ3LCA0NHB4KScsXG4gICAgICAgICAgICBmb250V2VpZ2h0OjUwMCwgbGluZUhlaWdodDoxLjI1LCBsZXR0ZXJTcGFjaW5nOictMC4wMWVtJyxcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbToyNCwgdGV4dFdyYXA6J2JhbGFuY2UnXG4gICAgICAgICAgfX0+e3Bvc3QudGl0bGV9PC9oMT5cblxuICAgICAgICAgIHtwb3N0LnRhZ3M/Lmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6NiwgZmxleFdyYXA6J3dyYXAnLCBtYXJnaW5Cb3R0b206MTZ9fT5cbiAgICAgICAgICAgICAge3Bvc3QudGFncy5tYXAodCA9PiA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cInRhZy1jaGlwXCI+I3t0fTwvc3Bhbj4pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjI0LCBhbGlnbkl0ZW1zOidjZW50ZXInLCBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6MTIsIGNvbG9yOid2YXIoLS1pbmstMyknLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdvbGRcIiBzdHlsZT17e2Rpc3BsYXk6J2lubGluZS1mbGV4JywgYWxpZ25JdGVtczonY2VudGVyJ319PlxuICAgICAgICAgICAgICB7cG9zdC5hdXRob3J9XG4gICAgICAgICAgICAgIDxBdXRob3JHcmFkZUJhZGdlIGF1dGhvcklkPXtwb3N0LmF1dGhvcklkfSBhdXRob3I9e3Bvc3QuYXV0aG9yfSBhdXRob3JFbWFpbD17cG9zdC5hdXRob3JFbWFpbH0vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHRpbWUgZGF0ZVRpbWU9e3Bvc3QuZGF0ZS5yZXBsYWNlKC9cXC4vZywnLScpfT57cG9zdC5kYXRlfTwvdGltZT5cbiAgICAgICAgICAgIDxzcGFuPlx1Qzg3MFx1RDY4QyB7cG9zdC52aWV3cyA/PyAwfTwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuPlx1QjMxM1x1QUUwMCB7Y29tbWVudHNMaXN0Lmxlbmd0aH08L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj5cdUFDRjVcdUFDMTAge2xpa2VzQ291bnR9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICB7cG9zdC5ib2R5Py5odG1sID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicG9zdC1ib2R5XCIgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IHBvc3QuYm9keS5odG1sfX0vPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicG9zdC1ib2R5XCI+XG4gICAgICAgICAgICA8cD5cdUM1QjRcdUM4MUMgXHVDQzNEXHVCMzU1XHVBRDgxIFx1RDZDNFx1QzZEMCBcdUM1N0NcdUFDMDQgXHVCMkY1XHVDMEFDXHVCOTdDIFx1QjJFNFx1QjE0MFx1QzY1NFx1QzJCNVx1QjJDOFx1QjJFNC4gXHVDNkQwXHVCNzk4IFx1QjBBRVx1QzVEMFx1QjlDQyBcdUFDMDBcdUJEMjRcdUIzNTggXHVBQ0YzXHVDNzc0XHVDNUI0XHVDMTFDLCBcdUQ1NzRcdUFDMDAgXHVCNUE4XHVDNUI0XHVDOUM0IFx1RDZDNFx1Qzc1OCBcdUFDRjVcdUFDMDRcdUM3NzQgXHVDNUI0XHVCNUJCXHVBQzhDIFx1QjJFNFx1Qjk3NFx1QUM4QyBcdUIyRTRcdUFDMDBcdUM2MkNcdUM5QzAgXHVCQzE4XHVDMkUwXHVCQzE4XHVDNzU4XHVENTg4XHVCMjk0XHVCMzcwXHVDNjk0LjwvcD5cbiAgICAgICAgICAgIDxwPlx1QUQwMFx1Qjc4Q1x1QzgxNSBcdUM1NUVcdUM1RDAgXHVDMTMwXHVDNzQ0IFx1QjU0QywgXHVCQjM4XHVCNEREIFx1QzY1NVx1Qzc3NCBcdUM3NzQgXHVDNzkwXHVCOUFDXHVDNUQwXHVDMTFDIFx1QkIzNFx1QzVDN1x1Qzc0NCBcdUJDRjRcdUM1NThcdUM3NDRcdUFFNEMgXHUyMDE0IFx1Qjc3Q1x1QjI5NCBcdUM5QzhcdUJCMzhcdUM3NzQgXHVCNUEwXHVDNjJDXHVCNzkwXHVDMkI1XHVCMkM4XHVCMkU0LjwvcD5cbiAgICAgICAgICAgIDxibG9ja3F1b3RlPlxuICAgICAgICAgICAgICA8cD5cIlx1QzY1NVx1Qzc1OCBcdUM3OTBcdUI5QUNcdUFDMDAgXHVDNTQ0XHVCMkM4XHVCNzdDIFx1QzY1NVx1Qzc3NCBcdUJDMTRcdUI3N0NcdUJDRjggXHVBRTM4XHVDNzQ0IFx1QjUzMFx1Qjc3Q1x1QUMwMFx1Qjc3Qy5cIjwvcD5cbiAgICAgICAgICAgICAgPGNpdGU+XHUyMDE0IFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCwgXHUzMDBFXHVDNjU1XHVDNzU4XHVBRTM4XHUzMDBGIFx1QzExQ1x1QkIzODwvY2l0ZT5cbiAgICAgICAgICAgIDwvYmxvY2txdW90ZT5cbiAgICAgICAgICAgIDxwPlx1QjJFNFx1Qzc0QyBcdUIyRjVcdUMwQUNcdUFDMDAgXHVCQzhDXHVDMzY4IFx1QUUzMFx1QjJFNFx1QjgyNFx1QzlEMVx1QjJDOFx1QjJFNC48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIEltYWdlIHNsaWRlciBhdCBib3R0b20gb2YgcG9zdCAqL31cbiAgICAgICAge3Bvc3QuaW1hZ2VzPy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8c2VjdGlvbiBhcmlhLWxhYmVsPVwiXHVDQ0E4XHVCRDgwIFx1Qzc3NFx1QkJGOFx1QzlDMFwiIHN0eWxlPXt7bWFyZ2luOic0OHB4IDAnfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tZXllYnJvd1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7bWFyZ2luQm90dG9tOjE2fX0+QVRUQUNITUVOVFMgXHUwMEI3IFx1Q0NBOFx1QkQ4MCBcdUM3NzRcdUJCRjhcdUM5QzAgKHtwb3N0LmltYWdlcy5sZW5ndGh9XHVDN0E1KTwvZGl2PlxuICAgICAgICAgICAgPEltYWdlU2xpZGVyIGltYWdlcz17cG9zdC5pbWFnZXN9Lz5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIEZpbGUgYXR0YWNobWVudHMgKHYwMC4wNjkpICovfVxuICAgICAgICB7cG9zdC5hdHRhY2htZW50cz8ubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgPHNlY3Rpb24gYXJpYS1sYWJlbD1cIlx1Q0NBOFx1QkQ4MCBcdUQzMENcdUM3N0NcIiBzdHlsZT17e21hcmdpbjonNDBweCAwJ319PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e21hcmdpbkJvdHRvbToxNH19PkZJTEVTIFx1MDBCNyBcdUNDQThcdUJEODAgXHVEMzBDXHVDNzdDICh7cG9zdC5hdHRhY2htZW50cy5sZW5ndGh9KTwvZGl2PlxuICAgICAgICAgICAgPHVsIHN0eWxlPXt7bGlzdFN0eWxlOidub25lJywgcGFkZGluZzowLCBtYXJnaW46MCwgZGlzcGxheTonZmxleCcsIGZsZXhEaXJlY3Rpb246J2NvbHVtbicsIGdhcDo4fX0+XG4gICAgICAgICAgICAgIHtwb3N0LmF0dGFjaG1lbnRzLm1hcCgoYSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e2l9IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDoxMiwgcGFkZGluZzonMTBweCAxNHB4JywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLCBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGZvbnRTaXplOjEzfX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj5cdUQ4M0RcdURDQ0U8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZsZXg6MSwgY29sb3I6J3ZhcigtLWluayknfX0+e2EubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMX19PntfZm10U2l6ZShhLnNpemUpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e2EuZGF0YVVybH0gZG93bmxvYWQ9e2EubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIHN0eWxlPXt7Zm9udFNpemU6MTEsIHBhZGRpbmc6JzRweCAxMHB4J319XG4gICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2EubmFtZX0gXHVCMkU0XHVDNkI0XHVCODVDXHVCNERDYH0+XHVCMkU0XHVDNkI0XHVCODVDXHVCNERDPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIEFjdGlvbnMgKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW46JzYwcHggMCcsIHBhZGRpbmdUb3A6MzIsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEyLCBqdXN0aWZ5Q29udGVudDonY2VudGVyJywgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG5cIiBhcmlhLXByZXNzZWQ9e2xpa2VkfVxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVMaWtlfVxuICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOiBsaWtlZCA/ICd2YXIoLS1nb2xkKScgOiB1bmRlZmluZWQsIGNvbG9yOiBsaWtlZCA/ICd2YXIoLS1nb2xkKScgOiB1bmRlZmluZWR9fT5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHUyNjY1PC9zcGFuPiBcdUFDRjVcdUFDMTAgPHNwYW4gYXJpYS1saXZlPVwicG9saXRlXCI+e2xpa2VzQ291bnR9PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG5cIiBhcmlhLXByZXNzZWQ9e2Jvb2ttYXJrZWR9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUJvb2ttYXJrfVxuICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOiBib29rbWFya2VkID8gJ3ZhcigtLWdvbGQpJyA6IHVuZGVmaW5lZCwgY29sb3I6IGJvb2ttYXJrZWQgPyAndmFyKC0tZ29sZCknIDogdW5kZWZpbmVkfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPntib29rbWFya2VkID8gJ1x1MjYwNScgOiAnXHUyNjA2J308L3NwYW4+IFx1QkQ4MVx1QjlDOFx1RDA2Q1xuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG5cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF1c2VyKSByZXR1cm4gcmVxdWlyZUxvZ2luKCdcdUMyRTBcdUFDRTAnKTtcbiAgICAgICAgICAgICAgICBzZXRSZXBvcnRPcGVuKCh2KSA9PiAhdik7XG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBcdUMyRTBcdUFDRTBcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAge2Nhbk1hbmFnZVBvc3QgJiYgKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9eygpID0+IG9uRWRpdChwb3N0KX0+XHVDMjE4XHVDODE1PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17ZGVsZXRlUG9zdH1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6J3ZhcigtLWRhbmdlciknLCBjb2xvcjondmFyKC0tZGFuZ2VyKSd9fT5cdUMwQURcdUM4MUM8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAge3JlcG9ydE9wZW4gJiYgKFxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVJlcG9ydFN1Ym1pdH1cbiAgICAgICAgICAgICAgc3R5bGU9e3ttYXhXaWR0aDo1NjAsIG1hcmdpbjonMjRweCBhdXRvIDAnLCBwYWRkaW5nOjIwLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIGJhY2tncm91bmQ6J3JnYmEoMTk0LDc0LDYxLDAuMDQpJ319PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBsZXR0ZXJTcGFjaW5nOicwLjIyZW0nLCBtYXJnaW5Cb3R0b206MTB9fT5SRVBPUlQgXHUwMEI3IFx1QzJFMFx1QUNFMCBcdUMwQUNcdUM3MjA8L2Rpdj5cbiAgICAgICAgICAgICAge3JlcG9ydFN1Ym1pdHRlZCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7Zm9udFNpemU6MTMsIGxpbmVIZWlnaHQ6MS43LCBwYWRkaW5nOic4cHggMCcsIGNvbG9yOid2YXIoLS1nb2xkKSd9fT5cbiAgICAgICAgICAgICAgICAgIFx1QzJFMFx1QUNFMFx1QUMwMCBcdUM4MTFcdUMyMThcdUI0MThcdUM1QzhcdUMyQjVcdUIyQzhcdUIyRTQuIFx1QzZCNFx1QzYwMVx1Qzc5MFx1QUMwMCBcdUQ2NTVcdUM3NzggXHVENkM0IFx1Q0M5OFx1QjlBQ1x1RDU2OVx1QjJDOFx1QjJFNC5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJcdUM1QjRcdUI1QTQgXHVDODEwXHVDNzc0IFx1QkIzOFx1QzgxQ1x1Qzc3OFx1QzlDMCBcdUFDMDRcdUIyRThcdUQ3ODggXHVDODAxXHVDNUI0IFx1QzhGQ1x1QzEzOFx1QzY5NC5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVwb3J0UmVhc29ufVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFJlcG9ydFJlYXNvbihlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7bWluSGVpZ2h0OjgwLCByZXNpemU6J3ZlcnRpY2FsJywgbWFyZ2luQm90dG9tOjEyfX0vPlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonZmxleC1lbmQnLCBnYXA6OH19PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gc2V0UmVwb3J0T3BlbihmYWxzZSl9Plx1Q0RFOFx1QzE4QzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOid2YXIoLS1kYW5nZXIpJywgY29sb3I6J3ZhcigtLWRhbmdlciknfX0+XHVDMkUwXHVBQ0UwIFx1QzgxMVx1QzIxODwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIENvbW1lbnRzICovfVxuICAgICAgICA8c2VjdGlvbiBhcmlhLWxhYmVsbGVkYnk9XCJjb21tZW50cy1oZWFkaW5nXCI+XG4gICAgICAgICAgPGgyIGlkPVwiY29tbWVudHMtaGVhZGluZ1wiIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3tmb250U2l6ZToyMiwgbWFyZ2luQm90dG9tOjI0fX0+XG4gICAgICAgICAgICBcdUIzMTNcdUFFMDAgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiPntjb21tZW50c0xpc3QubGVuZ3RofTwvc3Bhbj5cbiAgICAgICAgICA8L2gyPlxuXG4gICAgICAgICAge3VzZXIgPyAoXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17c3VibWl0Q29tbWVudH0gc3R5bGU9e3ttYXJnaW5Cb3R0b206MzJ9fT5cbiAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjb21tZW50LWlucHV0XCIgY2xhc3NOYW1lPVwic3Itb25seVwiPlx1QjMxM1x1QUUwMCBcdUM3ODVcdUI4MjU8L2xhYmVsPlxuICAgICAgICAgICAgICA8TWVudGlvblRleHRhcmVhXG4gICAgICAgICAgICAgICAgdmFsdWU9e2NvbW1lbnR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldENvbW1lbnR9XG4gICAgICAgICAgICAgICAgYXV0aG9ycz17KGNvbW1lbnRzTGlzdCB8fCBbXSkubWFwKChjKSA9PiBjLmF1dGhvcikuY29uY2F0KHBvc3QuYXV0aG9yKS5maWx0ZXIoQm9vbGVhbil9XG4gICAgICAgICAgICAgICAgcm93cz17NH1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlx1QzBERFx1QUMwMVx1Qzc0NCBcdUIwOThcdUIyMDRcdUM1QjQgXHVDOEZDXHVDMTM4XHVDNjk0Li4uIChAXHVCOTdDIFx1Qzc4NVx1QjgyNVx1RDU1OFx1QkE3NCBcdUJBNThcdUMxNTggXHVDNzkwXHVCM0Q5XHVDNjQ0XHVDMTMxKVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3ttaW5IZWlnaHQ6MTAwLCByZXNpemU6J3ZlcnRpY2FsJywgbWFyZ2luQm90dG9tOjEyfX0vPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonY2VudGVyJ319PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yIG1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjExfX0+e3VzZXIubmFtZX0oXHVDNzNDKVx1Qjg1QyBcdUI0RjFcdUI4NUQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkIGJ0bi1zbWFsbFwiIGRpc2FibGVkPXshY29tbWVudC50cmltKCl9Plx1QjRGMVx1Qjg1RDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3twYWRkaW5nOjI0LCB0ZXh0QWxpZ246J2NlbnRlcicsIG1hcmdpbkJvdHRvbTozMiwgYmFja2dyb3VuZDoncmdiYSgyNDUsMjEzLDcyLDAuMDQpJ319PlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Cb3R0b206MTZ9fT5cbiAgICAgICAgICAgICAgICBcdUIzMTNcdUFFMDAgXHVDNzkxXHVDMTMxXHVDNzQwIDxzdHJvbmcgY2xhc3NOYW1lPVwiZ29sZFwiPlx1Qjg1Q1x1QURGOFx1Qzc3OFx1RDU1QyBcdUQ2OENcdUM2RDA8L3N0cm9uZz5cdUI5Q0MgXHVBQzAwXHVCMkE1XHVENTY5XHVCMkM4XHVCMkU0LlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEwLCBqdXN0aWZ5Q29udGVudDonY2VudGVyJ319PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiBnbygnbG9naW4nKX0+XHVCODVDXHVBREY4XHVDNzc4PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IGdvKCdzaWdudXAnKX0+XHVENjhDXHVDNkQwXHVBQzAwXHVDNzg1PC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIDxDb21tZW50VHJlZVxuICAgICAgICAgICAgY29tbWVudHM9e2NvbW1lbnRzTGlzdH1cbiAgICAgICAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICAgICAgICBvbkRlbGV0ZT17ZGVsZXRlQ29tbWVudH1cbiAgICAgICAgICAgIG9uUmVwbHk9eyhwYXJlbnRJZCwgdGV4dCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIXVzZXIgfHwgIXRleHQudHJpbSgpKSByZXR1cm47XG4gICAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHdpbmRvdy5CR05KX0NPTU1VTklUWS5hZGRDb21tZW50KHBvc3QuaWQsIHtcbiAgICAgICAgICAgICAgICBpZDogYGNvbW1lbnQtJHtEYXRlLm5vdygpfS0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsNCl9YCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVzZXIubmFtZSxcbiAgICAgICAgICAgICAgICBhdXRob3JJZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICAgICAgICBkYXRlOiBgJHtub3cuZ2V0RnVsbFllYXIoKX0uJHtwYWQobm93LmdldE1vbnRoKCkrMSl9LiR7cGFkKG5vdy5nZXREYXRlKCkpfSAke3BhZChub3cuZ2V0SG91cnMoKSl9OiR7cGFkKG5vdy5nZXRNaW51dGVzKCkpfWAsXG4gICAgICAgICAgICAgICAgdGV4dDogdGV4dC50cmltKCksXG4gICAgICAgICAgICAgICAgcGFyZW50SWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBzZXRDb21tZW50c0xpc3QobmV4dCk7XG4gICAgICAgICAgICAgIGNvbnN0IGlzTXlPd25Qb3N0ID0gcG9zdC5hdXRob3JJZCA9PT0gdXNlci5pZCB8fCBwb3N0LmF1dGhvciA9PT0gdXNlci5uYW1lO1xuICAgICAgICAgICAgICBpZiAoIWlzTXlPd25Qb3N0ICYmIHBvc3QuYXV0aG9ySWQpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFkuYWRkTm90aWZpY2F0aW9uKHBvc3QuYXV0aG9ySWQsIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb21tZW50JyxcbiAgICAgICAgICAgICAgICAgIHBvc3RJZDogcG9zdC5pZCxcbiAgICAgICAgICAgICAgICAgIHBvc3RUaXRsZTogcG9zdC50aXRsZSxcbiAgICAgICAgICAgICAgICAgIGZyb21OYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnXHVCMEI0IFx1QUUwMFx1QzVEMCBcdUMwQzggXHVCMkY1XHVBRTAwXHVDNzc0IFx1QjJFQ1x1QjgzOFx1QzJCNVx1QjJDOFx1QjJFNC4nLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uUmVmcmVzaD8uKCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvYXJ0aWNsZT5cbiAgKTtcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IENvbW11bml0eVBhZ2UsIEltYWdlU2xpZGVyLCBIYXNodGFnSW5wdXQsIEltYWdlQXR0YWNoZXIsIENvbW1lbnRUcmVlIH0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBSUEsTUFBTSxlQUFlLENBQUMsU0FBUyxNQUFNLFFBQVEsTUFBTSxPQUFPLGdCQUFnQixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFDdkYsTUFBTSx3QkFBd0IsQ0FBQyxjQUM3QixPQUFPLFlBQVksV0FBVyxPQUFPLE9BQUssRUFBRSxjQUFjLFNBQVM7QUFHckUsTUFBTSxlQUFlLENBQUMsRUFBRSxNQUFNLFNBQVMsTUFBTSxHQUFHLE1BQU07QUFDcEQsUUFBTSxDQUFDLE9BQU8sUUFBUSxJQUFJLE1BQU0sU0FBUyxFQUFFO0FBQzNDLFFBQU0sV0FBVyxNQUFNLE9BQU8sSUFBSTtBQUVsQyxRQUFNLFNBQVMsQ0FBQyxRQUFRO0FBQ3RCLFVBQU0sSUFBSSxJQUFJLEtBQUssRUFBRSxRQUFRLE9BQU8sRUFBRSxFQUFFLFFBQVEsUUFBUSxFQUFFO0FBQzFELFFBQUksQ0FBQyxFQUFHO0FBQ1IsUUFBSSxLQUFLLFNBQVMsQ0FBQyxFQUFHO0FBQ3RCLFFBQUksS0FBSyxVQUFVLElBQUs7QUFDeEIsWUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFBQSxFQUN0QjtB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

})();

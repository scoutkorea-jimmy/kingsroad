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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvQ29tbXVuaXR5UGFnZS5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMDogXHVCQUE5XHVCODVEICsgXHVBRTAwIFx1QzBDMVx1QzEzOCArIFx1QUUwMCBcdUM3OTFcdUMxMzEgKFRpcHRhcClcbi8vIFx1QjRGMVx1QUUwOVx1QkNDNCBcdUM4MTFcdUFERkMgXHVDODFDXHVDNUI0OiBcdUM3N0RcdUFFMzAvXHVDNEYwXHVBRTMwIFx1QUQ4Q1x1RDU1Q1x1Qzc0MCBcdUNFNzRcdUQxNENcdUFDRTBcdUI5QUMubWluTGV2ZWwgLyBwb3N0TWluTGV2ZWxcdUI4NUMgXHVEMzEwXHVDODE1LlxuXG4vLyBcdUFDRjVcdUM2QTkgXHVENkM1IFx1MjAxNCBcdUFEOENcdUQ1NUMgXHVBQ0M0XHVDMEIwXG5jb25zdCB1c2VVc2VyTGV2ZWwgPSAodXNlcikgPT4gUmVhY3QudXNlTWVtbygoKSA9PiB3aW5kb3cuQkdOSl9VU0VSX0xFVkVMKHVzZXIpLCBbdXNlcl0pO1xuY29uc3QgZ2V0Q2F0ZWdvcmllc0ZvckJvYXJkID0gKGJvYXJkVHlwZSkgPT5cbiAgd2luZG93LkJHTkpfU1RPUkVTLmNhdGVnb3JpZXMuZmlsdGVyKGMgPT4gYy5ib2FyZFR5cGUgPT09IGJvYXJkVHlwZSk7XG5cbi8vID09PSBIYXNodGFnIGNoaXAgaW5wdXQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgSGFzaHRhZ0lucHV0ID0gKHsgdGFncywgc2V0VGFncywgbWF4ID0gMTAgfSkgPT4ge1xuICBjb25zdCBbaW5wdXQsIHNldElucHV0XSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBpbnB1dFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICBjb25zdCBjb21taXQgPSAocmF3KSA9PiB7XG4gICAgY29uc3QgdCA9IHJhdy50cmltKCkucmVwbGFjZSgvXiMrLywgJycpLnJlcGxhY2UoL1xccysvZywgJycpO1xuICAgIGlmICghdCkgcmV0dXJuO1xuICAgIGlmICh0YWdzLmluY2x1ZGVzKHQpKSByZXR1cm47XG4gICAgaWYgKHRhZ3MubGVuZ3RoID49IG1heCkgcmV0dXJuO1xuICAgIHNldFRhZ3MoWy4uLnRhZ3MsIHRdKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVLZXkgPSAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnLCcpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbW1pdChpbnB1dCk7XG4gICAgICBzZXRJbnB1dCgnJyk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0JhY2tzcGFjZScgJiYgIWlucHV0ICYmIHRhZ3MubGVuZ3RoKSB7XG4gICAgICBzZXRUYWdzKHRhZ3Muc2xpY2UoMCwgLTEpKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWctaW5wdXQtd3JhcFwiIG9uQ2xpY2s9eygpID0+IGlucHV0UmVmLmN1cnJlbnQ/LmZvY3VzKCl9PlxuICAgICAgICB7dGFncy5tYXAoKHQsIGkpID0+IChcbiAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cInRhZy1jaGlwXCI+XG4gICAgICAgICAgICAje3R9XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRUYWdzKHRhZ3MuZmlsdGVyKHggPT4geCAhPT0gdCkpfVxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgJHt0fSBcdUQwRENcdUFERjggXHVDMEFEXHVDODFDYH0+XHUyNzE1PC9idXR0b24+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApKX1cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgcmVmPXtpbnB1dFJlZn1cbiAgICAgICAgICB2YWx1ZT17aW5wdXR9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0SW5wdXQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIG9uS2V5RG93bj17aGFuZGxlS2V5fVxuICAgICAgICAgIG9uQmx1cj17KCkgPT4geyBpZiAoaW5wdXQudHJpbSgpKSB7IGNvbW1pdChpbnB1dCk7IHNldElucHV0KCcnKTsgfSB9fVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXt0YWdzLmxlbmd0aCA/IFwiXCIgOiBcIlx1RDBEQ1x1QURGOCBcdUM3ODVcdUI4MjUgXHVENkM0IFx1QzJBNFx1RDM5OFx1Qzc3NFx1QzJBNFx1QkMxNCAoXHVDRDVDXHVCMzAwIDEwXHVBQzFDKVwifVxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJcdUQ1NzRcdUMyRENcdUQwRENcdUFERjggXHVDNzg1XHVCODI1XCIvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWhpbnRcIiBzdHlsZT17e21hcmdpblRvcDo2fX0+XG4gICAgICAgIFx1QzJBNFx1RDM5OFx1Qzc3NFx1QzJBNFx1QkMxNCBcdTAwQjcgRW50ZXIgXHUwMEI3IFx1QzI3Q1x1RDQ1Q1x1Qjg1QyBcdUQwRENcdUFERjggXHVBRDZDXHVCRDg0IFx1MDBCNyBCYWNrc3BhY2VcdUI4NUMgXHVCOUM4XHVDOUMwXHVCOUM5IFx1RDBEQ1x1QURGOCBcdUMwQURcdUM4MUMgXHUwMEI3IHt0YWdzLmxlbmd0aH0ve21heH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09IEltYWdlIFNsaWRlciAodmlld2VyKSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgSW1hZ2VTbGlkZXIgPSAoeyBpbWFnZXMsIGF1dG9wbGF5TXMgPSA0MDAwIH0pID0+IHtcbiAgY29uc3QgW2lkeCwgc2V0SWR4XSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCBbcGF1c2VkLCBzZXRQYXVzZWRdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBwcmVmZXJzUmVkdWNlZCA9IFJlYWN0LnVzZU1lbW8oKCkgPT5cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHdpbmRvdy5tYXRjaE1lZGlhPy4oJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcywgW10pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGltYWdlcy5sZW5ndGggPD0gMSB8fCBwYXVzZWQgfHwgcHJlZmVyc1JlZHVjZWQpIHJldHVybjtcbiAgICBjb25zdCB0ID0gc2V0SW50ZXJ2YWwoKCkgPT4gc2V0SWR4KGkgPT4gKGkgKyAxKSAlIGltYWdlcy5sZW5ndGgpLCBhdXRvcGxheU1zKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbCh0KTtcbiAgfSwgW2ltYWdlcy5sZW5ndGgsIHBhdXNlZCwgYXV0b3BsYXlNcywgcHJlZmVyc1JlZHVjZWRdKTtcblxuICBpZiAoIWltYWdlcy5sZW5ndGgpIHJldHVybiBudWxsO1xuICBjb25zdCBnbyA9IChpKSA9PiBzZXRJZHgoKChpICUgaW1hZ2VzLmxlbmd0aCkgKyBpbWFnZXMubGVuZ3RoKSAlIGltYWdlcy5sZW5ndGgpO1xuXG4gIHJldHVybiAoXG4gICAgPGZpZ3VyZSBhcmlhLXJvbGVkZXNjcmlwdGlvbj1cImNhcm91c2VsXCIgYXJpYS1sYWJlbD1cIlx1Q0NBOFx1QkQ4MCBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDXCJcbiAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0UGF1c2VkKHRydWUpfSBvbk1vdXNlTGVhdmU9eygpID0+IHNldFBhdXNlZChmYWxzZSl9XG4gICAgICBvbkZvY3VzPXsoKSA9PiBzZXRQYXVzZWQodHJ1ZSl9IG9uQmx1cj17KCkgPT4gc2V0UGF1c2VkKGZhbHNlKX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy1zbGlkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLXRyYWNrXCIgc3R5bGU9e3t0cmFuc2Zvcm06IGB0cmFuc2xhdGVYKC0ke2lkeCAqIDEwMH0lKWB9fT5cbiAgICAgICAgICB7aW1hZ2VzLm1hcCgoaW1nLCBpKSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwiaW1nLXNsaWRlci1zbGlkZVwiXG4gICAgICAgICAgICAgIHJvbGU9XCJncm91cFwiIGFyaWEtcm9sZWRlc2NyaXB0aW9uPVwic2xpZGVcIiBhcmlhLWxhYmVsPXtgJHtpKzF9IC8gJHtpbWFnZXMubGVuZ3RofWB9XG4gICAgICAgICAgICAgIGFyaWEtaGlkZGVuPXtpICE9PSBpZHh9PlxuICAgICAgICAgICAgICA8aW1nIHNyYz17aW1nLmRhdGFVcmwgfHwgaW1nLnNyY30gYWx0PXtpbWcuYWx0IHx8IGltZy5uYW1lIHx8IGBcdUM3NzRcdUJCRjhcdUM5QzAgJHtpKzF9YH0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7aW1hZ2VzLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLW5hdiBwcmV2XCIgb25DbGljaz17KCkgPT4gZ28oaWR4IC0gMSl9IGFyaWEtbGFiZWw9XCJcdUM3NzRcdUM4MDQgXHVDNzc0XHVCQkY4XHVDOUMwXCI+XHUyMDM5PC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLW5hdiBuZXh0XCIgb25DbGljaz17KCkgPT4gZ28oaWR4ICsgMSl9IGFyaWEtbGFiZWw9XCJcdUIyRTRcdUM3NEMgXHVDNzc0XHVCQkY4XHVDOUMwXCI+XHUyMDNBPC9idXR0b24+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy1zbGlkZXItY2FwdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWxpdmU9XCJwb2xpdGVcIj57aWR4ICsgMX0gLyB7aW1hZ2VzLmxlbmd0aH08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW1nLXNsaWRlci1kb3RzXCIgcm9sZT1cInRhYmxpc3RcIiBhcmlhLWxhYmVsPVwiXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDIFx1QzEyMFx1RDBERFwiPlxuICAgICAgICAgICAgICB7aW1hZ2VzLm1hcCgoXywgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtpfSB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cInRhYlwiXG4gICAgICAgICAgICAgICAgICBhcmlhLWN1cnJlbnQ9e2kgPT09IGlkeH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODggXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDYH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElkeChpKX0vPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICB7aW1hZ2VzW2lkeF0/LmNhcHRpb24gJiYgKFxuICAgICAgICA8ZmlnY2FwdGlvbiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEyLCBtYXJnaW5Ub3A6OCwgdGV4dEFsaWduOidjZW50ZXInfX0+XG4gICAgICAgICAge2ltYWdlc1tpZHhdLmNhcHRpb259XG4gICAgICAgIDwvZmlnY2FwdGlvbj5cbiAgICAgICl9XG4gICAgPC9maWd1cmU+XG4gICk7XG59O1xuXG4vLyA9PT0gSW1hZ2UgcGlja2VyIChlZGl0b3Igc2lkZSkgXHUyMDE0IHVwIHRvIGBtYXhgIGltYWdlcyB3aXRoIHRodW1ibmFpbHMgPT09PT1cbmNvbnN0IEltYWdlQXR0YWNoZXIgPSAoeyBpbWFnZXMsIHNldEltYWdlcywgbWF4ID0gMTAgfSkgPT4ge1xuICBjb25zdCBpbnB1dFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICBjb25zdCBoYW5kbGVGaWxlcyA9IGFzeW5jIChmaWxlTGlzdCkgPT4ge1xuICAgIGNvbnN0IGZpbGVzID0gQXJyYXkuZnJvbShmaWxlTGlzdCB8fCBbXSk7XG4gICAgY29uc3QgcmVtYWluaW5nID0gbWF4IC0gaW1hZ2VzLmxlbmd0aDtcbiAgICBpZiAocmVtYWluaW5nIDw9IDApIHJldHVybjtcbiAgICBjb25zdCB0b0FkZCA9IGZpbGVzLnNsaWNlKDAsIHJlbWFpbmluZyk7XG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKHRvQWRkLm1hcChmID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBjb25zdCByID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgIHIub25sb2FkID0gKCkgPT4gcmVzb2x2ZSh7IGRhdGFVcmw6IHIucmVzdWx0LCBuYW1lOiBmLm5hbWUsIHNpemU6IGYuc2l6ZSwgYWx0OiBmLm5hbWUucmVwbGFjZSgvXFwuW14uXSskLywgJycpIH0pO1xuICAgICAgci5yZWFkQXNEYXRhVVJMKGYpO1xuICAgIH0pKSk7XG4gICAgc2V0SW1hZ2VzKFsuLi5pbWFnZXMsIC4uLnJlc3VsdHNdKTtcbiAgfTtcblxuICBjb25zdCByZW1vdmUgPSAoaSkgPT4gc2V0SW1hZ2VzKGltYWdlcy5maWx0ZXIoKF8sIGopID0+IGogIT09IGkpKTtcbiAgY29uc3QgbW92ZSA9IChpLCBkaXIpID0+IHtcbiAgICBjb25zdCBqID0gaSArIGRpcjtcbiAgICBpZiAoaiA8IDAgfHwgaiA+PSBpbWFnZXMubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgbmV4dCA9IGltYWdlcy5zbGljZSgpO1xuICAgIFtuZXh0W2ldLCBuZXh0W2pdXSA9IFtuZXh0W2pdLCBuZXh0W2ldXTtcbiAgICBzZXRJbWFnZXMobmV4dCk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbTo4fX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIj5cdUNDQThcdUJEODAgXHVDNzc0XHVCQkY4XHVDOUMwIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yXCI+KHtpbWFnZXMubGVuZ3RofS97bWF4fSk8L3NwYW4+PC9kaXY+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICAgIGRpc2FibGVkPXtpbWFnZXMubGVuZ3RoID49IG1heH1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBpbnB1dFJlZi5jdXJyZW50Py5jbGljaygpfT5cbiAgICAgICAgICArIFx1Qzc3NFx1QkJGOFx1QzlDMCBcdUMxMjBcdUQwRERcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxpbnB1dCByZWY9e2lucHV0UmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBtdWx0aXBsZVxuICAgICAgICBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX1cbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7IGhhbmRsZUZpbGVzKGUudGFyZ2V0LmZpbGVzKTsgZS50YXJnZXQudmFsdWUgPSAnJzsgfX0vPlxuICAgICAge2ltYWdlcy5sZW5ndGggPiAwID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy10aHVtYnNcIj5cbiAgICAgICAgICB7aW1hZ2VzLm1hcCgoaW1nLCBpKSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwiaW1nLXRodW1iXCI+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWcuZGF0YVVybCB8fCBpbWcuc3JjfSBhbHQ9e2ltZy5hbHQgfHwgYHRodW1iLSR7aX1gfS8+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImltZy10aHVtYi1vcmRlclwiPntTdHJpbmcoaSArIDEpLnBhZFN0YXJ0KDIsICcwJyl9PC9zcGFuPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJpbWctdGh1bWItcmVtb3ZlXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZW1vdmUoaSl9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YCR7aSsxfVx1QkM4OCBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDODFDXHVBQzcwYH0+XHUyNzE1PC9idXR0b24+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjonYWJzb2x1dGUnLCBib3R0b206NCwgcmlnaHQ6NCwgZGlzcGxheTonZmxleCcsIGdhcDoyfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gbW92ZShpLCAtMSl9IGRpc2FibGVkPXtpID09PSAwfVxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YCR7aSsxfVx1QkM4OCBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDNTVFXHVDNzNDXHVCODVDYH1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDoncmdiYSgwLDAsMCwwLjYpJywgYm9yZGVyOidub25lJywgY29sb3I6J3ZhcigtLWdvbGQpJywgZm9udFNpemU6MTAsIHBhZGRpbmc6JzFweCA1cHgnLCBjdXJzb3I6J3BvaW50ZXInLCBtaW5IZWlnaHQ6MH19Plx1MjVDMDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IG1vdmUoaSwgMSl9IGRpc2FibGVkPXtpID09PSBpbWFnZXMubGVuZ3RoIC0gMX1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODggXHVDNzc0XHVCQkY4XHVDOUMwIFx1QjRBNFx1Qjg1Q2B9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6J3JnYmEoMCwwLDAsMC42KScsIGJvcmRlcjonbm9uZScsIGNvbG9yOid2YXIoLS1nb2xkKScsIGZvbnRTaXplOjEwLCBwYWRkaW5nOicxcHggNXB4JywgY3Vyc29yOidwb2ludGVyJywgbWluSGVpZ2h0OjB9fT5cdTI1QjY8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBsYWNlaG9sZGVyXCIgc3R5bGU9e3thc3BlY3RSYXRpbzonNS8xJywgZm9udFNpemU6MTB9fT5cbiAgICAgICAgICBcdUM3NzRcdUJCRjhcdUM5QzBcdUI5N0MgXHVDQ0E4XHVCRDgwXHVENTU4XHVCQTc0IFx1QzBDMVx1QzEzOCBcdUQzOThcdUM3NzRcdUM5QzAgXHVENTU4XHVCMkU4XHVDNUQwIFx1Qzc5MFx1QjNEOSBcdUMyQUNcdUI3N0NcdUM3NzRcdUI0RENcdUI4NUMgXHVENDVDXHVDMkRDXHVCNDI5XHVCMkM4XHVCMkU0XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PSBGaWxlIGF0dGFjaGVyICh2MDAuMDY5KSBcdTIwMTQgXHVCRTQ0LVx1Qzc3NFx1QkJGOFx1QzlDMCBcdUQzMENcdUM3N0MgXHVDQ0E4XHVCRDgwLCAxME1CIFx1MDBENyBcdUNENUNcdUIzMDAgMyA9PT09PT1cbi8vIFx1QUM4Q1x1QzJEQ1x1QUUwMFx1QzVEMCBhdHRhY2htZW50czogW3sgbmFtZSwgdHlwZSwgc2l6ZSwgZGF0YVVybCB9XSBcdUM3M0NcdUI4NUMgXHVDODAwXHVDN0E1LiBkYXRhVXJsIFx1Qzc0MCBiYXNlNjQuXG4vLyBcdUJDRjRcdUFEMDAgXHVENTVDXHVCM0M0XHVBQzAwIFx1Qzc5MVx1QzU0NCB2MSBcdUM3NDAgRDEgXHVDNzc4XHVCNzdDXHVDNzc4IEpTT04uIFx1Q0Q5NFx1RDZDNCBSMiBcdUM1QzVcdUI4NUNcdUI0REMgXHVENzUwXHVCOTg0XHVDNzQwIFx1QkNDNFx1QjNDNCBcdUMwQUNcdUM3NzRcdUQwNzQuXG5jb25zdCBGSUxFX01BWF9TSVpFID0gMTAgKiAxMDI0ICogMTAyNDsgLy8gMTBNQlxuY29uc3QgRklMRV9NQVhfQ09VTlQgPSAzO1xuY29uc3QgX2ZtdFNpemUgPSAobikgPT4ge1xuICBpZiAoIW4gJiYgbiAhPT0gMCkgcmV0dXJuICcnO1xuICBpZiAobiA8IDEwMjQpIHJldHVybiBgJHtufSBCYDtcbiAgaWYgKG4gPCAxMDI0ICogMTAyNCkgcmV0dXJuIGAkeyhuIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICByZXR1cm4gYCR7KG4gLyAxMDI0IC8gMTAyNCkudG9GaXhlZCgxKX0gTUJgO1xufTtcbmNvbnN0IEZpbGVBdHRhY2hlciA9ICh7IGZpbGVzLCBzZXRGaWxlcywgbWF4ID0gRklMRV9NQVhfQ09VTlQsIG1heFNpemUgPSBGSUxFX01BWF9TSVpFIH0pID0+IHtcbiAgY29uc3QgaW5wdXRSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gUmVhY3QudXNlU3RhdGUoJycpO1xuXG4gIGNvbnN0IGhhbmRsZUZpbGVzID0gYXN5bmMgKGZpbGVMaXN0KSA9PiB7XG4gICAgc2V0RXJyb3IoJycpO1xuICAgIGNvbnN0IGluY29taW5nID0gQXJyYXkuZnJvbShmaWxlTGlzdCB8fCBbXSk7XG4gICAgY29uc3QgcmVtYWluaW5nID0gbWF4IC0gZmlsZXMubGVuZ3RoO1xuICAgIGlmIChyZW1haW5pbmcgPD0gMCkgeyBzZXRFcnJvcihgXHVDQ0E4XHVCRDgwXHVCMjk0IFx1Q0Q1Q1x1QjMwMCAke21heH1cdUFDMUNcdUFFNENcdUM5QzAgXHVBQzAwXHVCMkE1XHVENTY5XHVCMkM4XHVCMkU0LmApOyByZXR1cm47IH1cbiAgICBjb25zdCBhY2NlcHRlZCA9IFtdO1xuICAgIGZvciAoY29uc3QgZiBvZiBpbmNvbWluZy5zbGljZSgwLCByZW1haW5pbmcpKSB7XG4gICAgICBpZiAoZi5zaXplID4gbWF4U2l6ZSkgeyBzZXRFcnJvcihgJyR7Zi5uYW1lfScgXHVDNzQwKFx1QjI5NCkgJHtfZm10U2l6ZShtYXhTaXplKX0gXHVDRDA4XHVBQ0ZDIFx1MjAxNCBcdUNDQThcdUJEODAgXHVCRDg4XHVBQzAwLmApOyBjb250aW51ZTsgfVxuICAgICAgYWNjZXB0ZWQucHVzaChmKTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKGFjY2VwdGVkLm1hcCgoZikgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgci5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKHsgbmFtZTogZi5uYW1lLCB0eXBlOiBmLnR5cGUgfHwgJycsIHNpemU6IGYuc2l6ZSwgZGF0YVVybDogci5yZXN1bHQgfSk7XG4gICAgICByLnJlYWRBc0RhdGFVUkwoZik7XG4gICAgfSkpKTtcbiAgICBzZXRGaWxlcyhbLi4uZmlsZXMsIC4uLnJlc3VsdHNdKTtcbiAgfTtcblxuICBjb25zdCByZW1vdmUgPSAoaSkgPT4gc2V0RmlsZXMoZmlsZXMuZmlsdGVyKChfLCBqKSA9PiBqICE9PSBpKSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIG1hcmdpbkJvdHRvbTo4fX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIj5cdUNDQThcdUJEODAgXHVEMzBDXHVDNzdDIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yXCI+KHtmaWxlcy5sZW5ndGh9L3ttYXh9IFx1MDBCNyBcdUFDMDEge19mbXRTaXplKG1heFNpemUpfSBcdUM3NzRcdUQ1NTgpPC9zcGFuPjwvZGl2PlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICBkaXNhYmxlZD17ZmlsZXMubGVuZ3RoID49IG1heH1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBpbnB1dFJlZi5jdXJyZW50Py5jbGljaygpfT5cbiAgICAgICAgICArIFx1RDMwQ1x1Qzc3QyBcdUMxMjBcdUQwRERcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxpbnB1dCByZWY9e2lucHV0UmVmfSB0eXBlPVwiZmlsZVwiIG11bHRpcGxlXG4gICAgICAgIHN0eWxlPXt7ZGlzcGxheTonbm9uZSd9fVxuICAgICAgICBvbkNoYW5nZT17KGUpID0+IHsgaGFuZGxlRmlsZXMoZS50YXJnZXQuZmlsZXMpOyBlLnRhcmdldC52YWx1ZSA9ICcnOyB9fS8+XG4gICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICA8ZGl2IHJvbGU9XCJhbGVydFwiIHN0eWxlPXt7Zm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1kYW5nZXIpJywgbWFyZ2luQm90dG9tOjh9fT57ZXJyb3J9PC9kaXY+XG4gICAgICApfVxuICAgICAge2ZpbGVzLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgIDx1bCBzdHlsZT17e2xpc3RTdHlsZTonbm9uZScsIHBhZGRpbmc6MCwgbWFyZ2luOjAsIGRpc3BsYXk6J2ZsZXgnLCBmbGV4RGlyZWN0aW9uOidjb2x1bW4nLCBnYXA6Nn19PlxuICAgICAgICAgIHtmaWxlcy5tYXAoKGYsIGkpID0+IChcbiAgICAgICAgICAgIDxsaSBrZXk9e2l9IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDoxMCwgcGFkZGluZzonOHB4IDEwcHgnLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgZm9udFNpemU6MTJ9fT5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHVEODNEXHVEQ0NFPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e2ZsZXg6MSwgY29sb3I6J3ZhcigtLWluayknLCBvdmVyZmxvdzonaGlkZGVuJywgdGV4dE92ZXJmbG93OidlbGxpcHNpcycsIHdoaXRlU3BhY2U6J25vd3JhcCd9fT57Zi5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTB9fT57X2ZtdFNpemUoZi5zaXplKX08L3NwYW4+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHJlbW92ZShpKX0gYXJpYS1sYWJlbD17YCR7Zi5uYW1lfSBcdUM4MUNcdUFDNzBgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDonbm9uZScsIGJvcmRlcjonbm9uZScsIGNvbG9yOid2YXIoLS1kYW5nZXIpJywgZm9udFNpemU6MTQsIGN1cnNvcjoncG9pbnRlcicsIHBhZGRpbmc6JzJweCA2cHgnfX0+XHUyNzE1PC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3VsPlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwbGFjZWhvbGRlclwiIHN0eWxlPXt7YXNwZWN0UmF0aW86JzgvMScsIGZvbnRTaXplOjEwfX0+XG4gICAgICAgICAgUERGIFx1MDBCNyBET0NYIFx1MDBCNyBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDNjc4IFx1Qzc5MFx1QjhDQ1x1Qjk3QyBcdUNDQThcdUJEODAgKFx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUJDRjhcdUJCMzggXHVENTU4XHVCMkU4XHVDNUQwIFx1QjJFNFx1QzZCNFx1Qjg1Q1x1QjREQyBcdUI5QzFcdUQwNkNcdUI4NUMgXHVENDVDXHVDMkRDKVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyA9PT0gQ29tbWVudCB0cmVlIChcdUIyRTRcdUIyRThcdUFDQzQgXHVCMkY1XHVBRTAwLCBcdUNENUNcdUIzMDAgXHVBRTRBXHVDNzc0IE1BWF9ERVBUSCkgPT09PT09PT09PT09PT09PT09PT09PVxuLy8gQFx1QkE1OFx1QzE1OFx1Qzc0MCBcdUJDRjhcdUJCMzhcdUM1RDAgQFx1Qzc3NFx1Qjk4NCBcdUQxQTBcdUQwNzBcdUM3NDQgXHVBQ0U4XHVCNERDIGNoaXAgXHVDNzNDXHVCODVDIFx1QjgwQ1x1QjM1NFx1QjlDMS5cbi8vIFx1QjJGNVx1QUUwMCBcdUQyQjhcdUI5QUMgXHUyMDE0IFx1QzJEQ1x1QUMwMVx1QzgwMSBcdUI0RTRcdUM1RUNcdUM0RjBcdUFFMzAgXHVBRTMwXHVCQ0Y4IFx1Q0VBMSgzKS4gXHVBREY4IFx1Qzc3NFx1QzBDMVx1Qzc0MCBcdUM3OTBcdUIzRDkgXHVEM0JDXHVDRTY4L1x1QzgxMVx1QUUzMCBcdUQxQTBcdUFFMDBcdUI4NUMgXHVCMTc4XHVDRDlDLlxuY29uc3QgTUFYX1ZJU0lCTEVfREVQVEggPSAzO1xuXG5jb25zdCByZW5kZXJDb21tZW50VGV4dCA9ICh0ZXh0KSA9PiB7XG4gIGlmICghdGV4dCkgcmV0dXJuIG51bGw7XG4gIC8vIEBcdUIyQzlcdUIxMjRcdUM3ODQgXHVEMUEwXHVEMDcwXHVCOUNDIFx1QUMwMFx1QkNDRFx1QUM4QyBcdUFDMTVcdUM4NzAoXHVBQ0U4XHVCNERDLCBtZWRpdW0pLiBcdUJDRjhcdUJCMzhcdUM3NDAgXHVEM0M5XHVCQjM4IFx1QURGOFx1QjMwMFx1Qjg1Qy5cbiAgY29uc3QgcGFydHMgPSBTdHJpbmcodGV4dCkuc3BsaXQoLyhAW1xccHtMfVxccHtOfV9dKykvZ3UpO1xuICByZXR1cm4gcGFydHMubWFwKChwYXJ0LCBpKSA9PiB7XG4gICAgaWYgKHBhcnQuc3RhcnRzV2l0aCgnQCcpICYmIHBhcnQubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIDxzcGFuIGtleT17aX0gY2xhc3NOYW1lPVwiZ29sZFwiIHN0eWxlPXt7Zm9udFdlaWdodDo1MDB9fT57cGFydH08L3NwYW4+O1xuICAgIH1cbiAgICByZXR1cm4gPFJlYWN0LkZyYWdtZW50IGtleT17aX0+e3BhcnR9PC9SZWFjdC5GcmFnbWVudD47XG4gIH0pO1xufTtcblxuY29uc3QgQ29tbWVudFRyZWUgPSAoeyBjb21tZW50cywgdXNlciwgb25EZWxldGUsIG9uUmVwbHkgfSkgPT4ge1xuICBjb25zdCB0b3BMZXZlbCA9IChjb21tZW50cyB8fCBbXSkuZmlsdGVyKChjKSA9PiAhYy5wYXJlbnRJZCk7XG4gIGNvbnN0IHJlcGxpZXNPZiA9IChwYXJlbnRJZCkgPT4gKGNvbW1lbnRzIHx8IFtdKS5maWx0ZXIoKGMpID0+IGMucGFyZW50SWQgPT09IHBhcmVudElkKTtcbiAgY29uc3QgW29wZW5SZXBseVRvLCBzZXRPcGVuUmVwbHlUb10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2RyYWZ0LCBzZXREcmFmdF0gPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG5cbiAgLy8gXHVCQTU4XHVDMTU4IFx1Qzc5MFx1QjNEOVx1QzY0NFx1QzEzMSBcdTIwMTQgXHVCMzEzXHVBRTAwIFx1Qzc5MVx1QzEzMVx1Qzc5MCArIFx1QUUwMCBcdUIzMTNcdUFFMDBcdUM1RDAgXHVCNEYxXHVDN0E1XHVENTVDIFx1QkFBOFx1QjRFMCBcdUIyQzlcdUIxMjRcdUM3ODRcdUM3NDQgXHVENkM0XHVCQ0Y0XHVCODVDLlxuICBjb25zdCBhbGxBdXRob3JzID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICByZXR1cm4gKGNvbW1lbnRzIHx8IFtdKVxuICAgICAgLm1hcCgoYykgPT4gYy5hdXRob3IpXG4gICAgICAuZmlsdGVyKChuKSA9PiBuICYmICFzZWVuLmhhcyhuKSAmJiAoc2Vlbi5hZGQobikgfHwgdHJ1ZSkpO1xuICB9LCBbY29tbWVudHNdKTtcblxuICBjb25zdCBzdWJtaXRSZXBseSA9IChwYXJlbnRJZCkgPT4ge1xuICAgIG9uUmVwbHk/LihwYXJlbnRJZCwgZHJhZnQpO1xuICAgIHNldERyYWZ0KCcnKTtcbiAgICBzZXRPcGVuUmVwbHlUbyhudWxsKTtcbiAgfTtcblxuICAvLyBcdUFFNEFcdUM3NzQgXHVDODFDXHVENTVDXHVDNzQ0IFx1RDQ4MFx1QUNFMCAoXHVDMTFDXHVCQzg0XHVCMjk0IFx1QkIzNFx1QzgxQ1x1RDU1QyBcdUQ1QzhcdUM2QTkpLCBcdUMyRENcdUFDMDFcdUI5Q0MgTUFYX1ZJU0lCTEVfREVQVEggXHVBRTRDXHVDOUMwIFx1QjRFNFx1QzVFQ1x1QzRGMFx1QUUzMC5cbiAgY29uc3QgW2V4cGFuZGVkLCBzZXRFeHBhbmRlZF0gPSBSZWFjdC51c2VTdGF0ZSh7fSk7IC8vIGNvbW1lbnRJZCAtPiB0cnVlIChcdUMwQUNcdUM2QTlcdUM3OTAgXHVEM0JDXHVDRTY4IFx1RDA3NFx1QjlBRClcbiAgY29uc3QgcmVuZGVySXRlbSA9IChjLCBkZXB0aCA9IDApID0+IHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IHJlcGxpZXNPZihjLmlkKTtcbiAgICBjb25zdCBjYW5SZXBseSA9ICEhdXNlcjsgLy8gXHVBRTRBXHVDNzc0IFx1QkIzNFx1QUQwMCBcdUIyRjVcdUFFMDAgXHVENUM4XHVDNkE5XG4gICAgY29uc3QgdmlzdWFsRGVwdGggPSBNYXRoLm1pbihkZXB0aCwgTUFYX1ZJU0lCTEVfREVQVEgpO1xuICAgIGNvbnN0IGlzRGVlcENvbGxhcHNlZCA9IGRlcHRoID49IE1BWF9WSVNJQkxFX0RFUFRIICYmICFleHBhbmRlZFtjLmlkXSAmJiBjaGlsZHJlbi5sZW5ndGggPiAwO1xuICAgIHJldHVybiAoXG4gICAgICA8bGkga2V5PXtjLmlkfSBzdHlsZT17e3BhZGRpbmc6JzE4cHggMCcsIGJvcmRlckJvdHRvbTogZGVwdGggPT09IDAgPyAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyA6ICdub25lJ319PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxNiwgYWxpZ25JdGVtczonY2VudGVyJywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBtYXJnaW5Cb3R0b206MTB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxNCwgYWxpZ25JdGVtczonY2VudGVyJywgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICB7ZGVwdGggPiAwICYmIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yIG1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjExfX0+XHUyMUIzPC9zcGFuPn1cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdvbGQgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTIsIGxldHRlclNwYWNpbmc6JzAuMWVtJywgZGlzcGxheTonaW5saW5lLWZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XG4gICAgICAgICAgICAgIHtjLmF1dGhvcn1cbiAgICAgICAgICAgICAgPEF1dGhvckdyYWRlQmFkZ2UgYXV0aG9ySWQ9e2MuYXV0aG9ySWR9IGF1dGhvcj17Yy5hdXRob3J9IGF1dGhvckVtYWlsPXtjLmF1dGhvckVtYWlsfS8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8dGltZSBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMX19PntjLmRhdGV9PC90aW1lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjYsIGFsaWduSXRlbXM6J2NlbnRlcid9fT5cbiAgICAgICAgICAgIHtjYW5SZXBseSAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgc2V0T3BlblJlcGx5VG8ob3BlblJlcGx5VG8gPT09IGMuaWQgPyBudWxsIDogYy5pZCk7XG4gICAgICAgICAgICAgICAgICBzZXREcmFmdChvcGVuUmVwbHlUbyA9PT0gYy5pZCA/ICcnIDogYEAke2MuYXV0aG9yfSBgKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1pbmstMiknfX0+XG4gICAgICAgICAgICAgICAge29wZW5SZXBseVRvID09PSBjLmlkID8gJ1x1Q0RFOFx1QzE4QycgOiAnXHVCMkY1XHVBRTAwJ31cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgeyEhdXNlciAmJiAodXNlci5pc0FkbWluIHx8IGMuYXV0aG9ySWQgPT09IHVzZXIuaWQgfHwgYy5hdXRob3IgPT09IHVzZXIubmFtZSkgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBvbkRlbGV0ZT8uKGMuaWQpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1kYW5nZXIpJ319Plx1QzBBRFx1QzgxQzwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxwIHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1yZWFkaW5nKScsIGZvbnRTaXplOiBkZXB0aCA+IDAgPyAxNCA6IDE1LCBsaW5lSGVpZ2h0OjEuOCwgY29sb3I6J3ZhcigtLWluayknLCB3aGl0ZVNwYWNlOidwcmUtd3JhcCd9fT5cbiAgICAgICAgICB7cmVuZGVyQ29tbWVudFRleHQoYy50ZXh0KX1cbiAgICAgICAgPC9wPlxuXG4gICAgICAgIHsvKiBcdUIyRjVcdUFFMDAgXHVDNzg1XHVCODI1IFx1RDNGQyAqL31cbiAgICAgICAge29wZW5SZXBseVRvID09PSBjLmlkICYmIChcbiAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17KGUpID0+IHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzdWJtaXRSZXBseShjLmlkKTsgfX1cbiAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luVG9wOjEwLCBwYWRkaW5nTGVmdDoyNCwgYm9yZGVyTGVmdDonMnB4IHNvbGlkIHZhcigtLWdvbGQtZGltKSd9fT5cbiAgICAgICAgICAgIDxNZW50aW9uVGV4dGFyZWFcbiAgICAgICAgICAgICAgdmFsdWU9e2RyYWZ0fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0RHJhZnR9XG4gICAgICAgICAgICAgIGF1dGhvcnM9e2FsbEF1dGhvcnN9XG4gICAgICAgICAgICAgIHJvd3M9ezJ9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtgQCR7Yy5hdXRob3J9XHVDNUQwXHVBQzhDIFx1QjJGNVx1QUUwMC4uLiAoQFx1Qjk3QyBcdUM3ODVcdUI4MjVcdUQ1NThcdUJBNzQgXHVCQTU4XHVDMTU4IFx1Qzc5MFx1QjNEOVx1QzY0NFx1QzEzMSlgfVxuICAgICAgICAgICAgICBzdHlsZT17e21hcmdpbkJvdHRvbTo4fX0vPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonZmxleC1lbmQnLCBnYXA6Nn19PlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4geyBzZXRPcGVuUmVwbHlUbyhudWxsKTsgc2V0RHJhZnQoJycpOyB9fT5cdUNERThcdUMxOEM8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkIGJ0bi1zbWFsbFwiIGRpc2FibGVkPXshZHJhZnQudHJpbSgpfT5cdUIyRjVcdUFFMDAgXHVCNEYxXHVCODVEPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFx1Qzc5MFx1QzJERCBcdUIyRjVcdUFFMDBcdUI0RTQgXHUyMDE0IFx1QUU0QVx1Qzc3NCBcdUNFQTEgXHVCM0M0XHVCMkVDIFx1QzgwNFx1QUU0Q1x1QzlDMCBcdUM3QUNcdUFEQzAsIFx1QjNDNFx1QjJFQyBcdUQ2QzRcdUM1RDQgJ1x1RDNCQ1x1Q0U1OFx1QUUzMCcgXHVEMUEwXHVBRTAwICovfVxuICAgICAgICB7Y2hpbGRyZW4ubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgaXNEZWVwQ29sbGFwc2VkID8gKFxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWQoKHMpID0+ICh7IC4uLnMsIFtjLmlkXTogdHJ1ZSB9KSl9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOjEwLCBtYXJnaW5MZWZ0OjI0LCBmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsXG4gICAgICAgICAgICAgICAgcGFkZGluZzonNHB4IDEwcHgnLCBib3JkZXI6JzFweCBkYXNoZWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgXHUyMUIzIFx1QjJGNVx1QUUwMCB7Y2hpbGRyZW4ubGVuZ3RofVx1QUMxQyBcdUQzQkNcdUNFNThcdUFFMzBcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8b2wgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbGlzdFN0eWxlOidub25lJywgcGFkZGluZzowLFxuICAgICAgICAgICAgICBtYXJnaW46IGRlcHRoIDwgTUFYX1ZJU0lCTEVfREVQVEggPyAnMTJweCAwIDAgMjRweCcgOiAnMTJweCAwIDAgMTJweCcsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6JzJweCBzb2xpZCB2YXIoLS1saW5lKScsIHBhZGRpbmdMZWZ0OjE0LFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtjaGlsZHJlbi5tYXAoKHIpID0+IHJlbmRlckl0ZW0ociwgZGVwdGggKyAxKSl9XG4gICAgICAgICAgICAgIHtkZXB0aCA+PSBNQVhfVklTSUJMRV9ERVBUSCAmJiAoXG4gICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWQoKHMpID0+ICh7IC4uLnMsIFtjLmlkXTogZmFsc2UgfSkpfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRTaXplOjExLCBjb2xvcjondmFyKC0taW5rLTMpJywgcGFkZGluZzonNHB4IDEwcHgnfX0+XG4gICAgICAgICAgICAgICAgICAgIFx1MjE5MSBcdUIyRjVcdUFFMDAgXHVDODExXHVBRTMwXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9vbD5cbiAgICAgICAgICApXG4gICAgICAgICl9XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8b2wgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBwYWRkaW5nOjAsIG1hcmdpbjowfX0+XG4gICAgICB7dG9wTGV2ZWwubWFwKChjKSA9PiByZW5kZXJJdGVtKGMsIDApKX1cbiAgICA8L29sPlxuICApO1xufTtcblxuLy8gPT09IEBcdUJBNThcdUMxNTggXHVDNzkwXHVCM0Q5XHVDNjQ0XHVDMTMxIHRleHRhcmVhID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gXHVDMEFDXHVDNkE5XHVDNzkwXHVBQzAwIEBcdUM3NDQgXHVDNzg1XHVCODI1XHVENTU4XHVCQTc0IFx1RDZDNFx1QkNGNCBcdUI5QUNcdUMyQTRcdUQyQjhcdUI5N0MgXHVCNzQ0XHVDNkIwXHVBQ0UwLCBcdUQwNzRcdUI5QUQvRW50ZXIgXHVCODVDIFx1QjJDOVx1QjEyNFx1Qzc4NFx1Qzc0NCBcdUMwQkRcdUM3ODUuXG5jb25zdCBNZW50aW9uVGV4dGFyZWEgPSAoeyB2YWx1ZSwgb25DaGFuZ2UsIGF1dGhvcnMsIHJvd3MgPSA0LCBwbGFjZWhvbGRlciwgc3R5bGUgfSkgPT4ge1xuICBjb25zdCByZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFthY3RpdmUsIHNldEFjdGl2ZV0gPSBSZWFjdC51c2VTdGF0ZSgwKTtcblxuICBjb25zdCBjYW5kaWRhdGVzID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFvcGVuKSByZXR1cm4gW107XG4gICAgY29uc3QgcSA9IHRva2VuLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIChhdXRob3JzIHx8IFtdKVxuICAgICAgLmZpbHRlcigoYSkgPT4gIXEgfHwgYS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpKVxuICAgICAgLnNsaWNlKDAsIDYpO1xuICB9LCBbYXV0aG9ycywgdG9rZW4sIG9wZW5dKTtcblxuICBjb25zdCBkZXRlY3RNZW50aW9uID0gKHRleHQsIGNhcmV0KSA9PiB7XG4gICAgLy8gXHVDRTkwXHVCN0ZGIFx1QzlDMVx1QzgwNFx1QzVEMFx1QzExQyBcdUFDMDBcdUM3QTUgXHVBQzAwXHVBRTRDXHVDNkI0IEBcdUI5N0MgXHVDQzNFXHVBQ0UwLCBAIFx1QjJFNFx1Qzc0QyBcdUJCMzhcdUM3OTBcdUFDMDAgXHVBQ0Y1XHVCQzMxL1x1QzkwNFx1QkMxNFx1QUZDOFx1Qzc3NCBcdUM1NDRcdUIyQ0NcdUM5QzAgXHVENjU1XHVDNzc4LlxuICAgIGNvbnN0IHVwdG8gPSB0ZXh0LnNsaWNlKDAsIGNhcmV0KTtcbiAgICBjb25zdCBtID0gL0AoW1xccHtMfVxccHtOfV9dKikkL3UuZXhlYyh1cHRvKTtcbiAgICBpZiAobSkgeyBzZXRUb2tlbihtWzFdKTsgc2V0T3Blbih0cnVlKTsgc2V0QWN0aXZlKDApOyB9XG4gICAgZWxzZSB7IHNldE9wZW4oZmFsc2UpOyBzZXRUb2tlbignJyk7IH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHYgPSBlLnRhcmdldC52YWx1ZTtcbiAgICBvbkNoYW5nZSh2KTtcbiAgICBkZXRlY3RNZW50aW9uKHYsIGUudGFyZ2V0LnNlbGVjdGlvblN0YXJ0IHx8IHYubGVuZ3RoKTtcbiAgfTtcblxuICBjb25zdCBpbnNlcnRDYW5kaWRhdGUgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IGVsID0gcmVmLmN1cnJlbnQ7XG4gICAgY29uc3QgY2FyZXQgPSBlbD8uc2VsZWN0aW9uU3RhcnQgPz8gdmFsdWUubGVuZ3RoO1xuICAgIGNvbnN0IGJlZm9yZSA9IHZhbHVlLnNsaWNlKDAsIGNhcmV0KTtcbiAgICBjb25zdCBhZnRlciA9IHZhbHVlLnNsaWNlKGNhcmV0KTtcbiAgICBjb25zdCByZXBsYWNlZCA9IGJlZm9yZS5yZXBsYWNlKC9AKFtcXHB7TH1cXHB7Tn1fXSopJC91LCBgQCR7bmFtZX0gYCk7XG4gICAgY29uc3QgbmV4dCA9IHJlcGxhY2VkICsgYWZ0ZXI7XG4gICAgb25DaGFuZ2UobmV4dCk7XG4gICAgc2V0T3BlbihmYWxzZSk7XG4gICAgc2V0VG9rZW4oJycpO1xuICAgIC8vIFx1Q0U5MFx1QjdGRlx1Qzc0NCBcdUMwQkRcdUM3ODUgXHVCMDVEXHVDNzNDXHVCODVDIFx1Qzc3NFx1QjNEOVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcG9zID0gcmVwbGFjZWQubGVuZ3RoO1xuICAgICAgICBlbD8uZm9jdXMoKTtcbiAgICAgICAgZWw/LnNldFNlbGVjdGlvblJhbmdlKHBvcywgcG9zKTtcbiAgICAgIH0gY2F0Y2gge31cbiAgICB9LCAwKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVLZXlEb3duID0gKGUpID0+IHtcbiAgICBpZiAoIW9wZW4gfHwgY2FuZGlkYXRlcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd0Rvd24nKSB7IGUucHJldmVudERlZmF1bHQoKTsgc2V0QWN0aXZlKChpKSA9PiAoaSArIDEpICUgY2FuZGlkYXRlcy5sZW5ndGgpOyB9XG4gICAgZWxzZSBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHNldEFjdGl2ZSgoaSkgPT4gKGkgLSAxICsgY2FuZGlkYXRlcy5sZW5ndGgpICUgY2FuZGlkYXRlcy5sZW5ndGgpOyB9XG4gICAgZWxzZSBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBpbnNlcnRDYW5kaWRhdGUoY2FuZGlkYXRlc1thY3RpdmVdKTsgfVxuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgeyBzZXRPcGVuKGZhbHNlKTsgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOidyZWxhdGl2ZSd9fT5cbiAgICAgIDx0ZXh0YXJlYSByZWY9e3JlZn0gY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiByb3dzPXtyb3dzfVxuICAgICAgICB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IG9uS2V5RG93bj17aGFuZGxlS2V5RG93bn1cbiAgICAgICAgcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyfSBzdHlsZT17c3R5bGV9Lz5cbiAgICAgIHtvcGVuICYmIGNhbmRpZGF0ZXMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDx1bCByb2xlPVwibGlzdGJveFwiIGFyaWEtbGFiZWw9XCJcdUJBNThcdUMxNTggXHVENkM0XHVCQ0Y0XCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgekluZGV4OjUwLCB0b3A6JzEwMCUnLCBsZWZ0OjAsIG1hcmdpblRvcDoyLFxuICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgbGlzdFN0eWxlOidub25lJywgcGFkZGluZzo0LCBtaW5XaWR0aDoxODAsIG1heFdpZHRoOjI4MCxcbiAgICAgICAgICAgIGJveFNoYWRvdzonMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMDgpJyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7Y2FuZGlkYXRlcy5tYXAoKG5hbWUsIGkpID0+IChcbiAgICAgICAgICAgIDxsaSBrZXk9e25hbWV9IHJvbGU9XCJvcHRpb25cIiBhcmlhLXNlbGVjdGVkPXtpID09PSBhY3RpdmV9XG4gICAgICAgICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4geyBlLnByZXZlbnREZWZhdWx0KCk7IGluc2VydENhbmRpZGF0ZShuYW1lKTsgfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwYWRkaW5nOic2cHggMTBweCcsIGZvbnRTaXplOjEzLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGkgPT09IGFjdGl2ZSA/ICdyZ2JhKDI0NSwyMTMsNzIsMC4xMiknIDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICBjb2xvcjogaSA9PT0gYWN0aXZlID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmspJyxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIEB7bmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvdWw+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09IENvbW11bml0eSBQYWdlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgUE9TVFNfUEVSX1BBR0UgPSAxMDtcblxuY29uc3QgQ29tbXVuaXR5UGFnZSA9ICh7IGdvLCBwb3N0SWQsIHNldFBvc3RJZCwgdXNlciB9KSA9PiB7XG4gIGNvbnN0IHVzZXJMZXZlbCA9IHVzZVVzZXJMZXZlbCh1c2VyKTtcbiAgY29uc3QgY2F0ZWdvcmllcyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4gZ2V0Q2F0ZWdvcmllc0ZvckJvYXJkKFwiY29tbXVuaXR5XCIpLCBbcG9zdElkXSk7XG4gIGNvbnN0IFtyZWZyZXNoS2V5LCBzZXRSZWZyZXNoS2V5XSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCBbdGFiLCBzZXRUYWJdID0gUmVhY3QudXNlU3RhdGUoXCJhbGxcIik7XG4gIGNvbnN0IFthY3RpdmVQcmVmaXgsIHNldEFjdGl2ZVByZWZpeF0gPSBSZWFjdC51c2VTdGF0ZShcIlwiKTtcbiAgY29uc3QgW3NlYXJjaCwgc2V0U2VhcmNoXSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbc29ydCwgc2V0U29ydF0gPSBSZWFjdC51c2VTdGF0ZShcImxhdGVzdFwiKTtcbiAgY29uc3QgW3dyaXRpbmcsIHNldFdyaXRpbmddID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtwYWdlLCBzZXRQYWdlXSA9IFJlYWN0LnVzZVN0YXRlKDEpO1xuXG4gIC8vIFx1QzU0Q1x1QjlCQyBcdUJDQTggLyBcdUM2NzhcdUJEODAgXHVDOUM0XHVDNzg1XHVDNUQwXHVDMTFDIHN0YXNoXHVENTc0IFx1QjQ1NCBwb3N0SWRcdUFDMDAgXHVDNzg4XHVDNzNDXHVCQTc0IFx1Qzc5MFx1QjNEOVx1QzczQ1x1Qjg1QyBcdUMwQzFcdUMxMzhcdUI4NUMgXHVDNzc0XHVCM0Q5XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IHBlbmRpbmcgPSBudWxsO1xuICAgIHRyeSB7IHBlbmRpbmcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcpOyB9IGNhdGNoIHt9XG4gICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgIHRyeSB7IHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2JnbmpfcGVuZGluZ19wb3N0X2lkJyk7IH0gY2F0Y2gge31cbiAgICAgIHNldFBvc3RJZChwZW5kaW5nKTtcbiAgICB9XG4gICAgLy8gXHVCMEI0XHVCRTQ0IFx1QkE1NFx1QUMwMFx1QkE1NFx1QjI3NFx1QzVEMFx1QzExQyBcdUI0RTRcdUM1QjRcdUM2MjggXHVBQzhDXHVDMkRDXHVEMzEwIElEXG4gICAgbGV0IHBlbmRpbmdCb2FyZCA9IG51bGw7XG4gICAgdHJ5IHsgcGVuZGluZ0JvYXJkID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYmdual9wZW5kaW5nX2JvYXJkX2lkJyk7IH0gY2F0Y2gge31cbiAgICBpZiAocGVuZGluZ0JvYXJkKSB7XG4gICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdiZ25qX3BlbmRpbmdfYm9hcmRfaWQnKTsgfSBjYXRjaCB7fVxuICAgICAgc2V0VGFiKHBlbmRpbmdCb2FyZCk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgLy8gXHVDMTFDXHVCQzg0IFx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUIzRDlcdUFFMzBcdUQ2NTQgXHUyMDE0IFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUM5QzRcdUM3ODUgXHVDMkRDIDFcdUQ2OEMgKyAnYmduai1wb3N0cy1yZWZyZXNoJyBcdUM3NzRcdUJDQTRcdUQyQjhcdUI5QzhcdUIyRTQgXHVDN0FDXHVCODBDXHVCMzU0XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgd2luZG93LkJHTkpfQ09NTVVOSVRZLnJlZnJlc2hQb3N0cz8uKCk7XG4gICAgY29uc3Qgb25SZWZyZXNoID0gKCkgPT4gc2V0UmVmcmVzaEtleSgodikgPT4gdiArIDEpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZ25qLXBvc3RzLXJlZnJlc2gnLCBvblJlZnJlc2gpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmduai1wb3N0cy1yZWZyZXNoJywgb25SZWZyZXNoKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IEcgPSB3aW5kb3cuQkdOSl9HVUFSRDtcbiAgY29uc3QgYWxsUG9zdHMgPSBSZWFjdC51c2VNZW1vKCgpID0+IEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8ubGlzdFBvc3RzPy4oKSksIFtyZWZyZXNoS2V5XSk7XG5cbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFx1QkFBOFx1QjRFMCBob29rXHVDNzQwIGVhcmx5IHJldHVybiBcdUM4MDRcdUM1RDAgXHVDMTIwXHVDNUI4IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBjb25zdCB2aXNpYmxlQ2F0cyA9IGNhdGVnb3JpZXMuZmlsdGVyKGMgPT4gdXNlckxldmVsID49IChjLm1pbkxldmVsID8/IDApKTtcbiAgY29uc3QgY3VycmVudEJvYXJkID0gY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5pZCA9PT0gdGFiKTtcbiAgY29uc3QgYm9hcmRQcmVmaXhlcyA9IGN1cnJlbnRCb2FyZD8ucHJlZml4ZXMgfHwgW107XG4gIGNvbnN0IGNhblJlYWRQb3N0ID0gUmVhY3QudXNlQ2FsbGJhY2soKHBvc3QpID0+IHtcbiAgICBpZiAoIXBvc3QpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBjYXQgPSBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmlkID09PSBwb3N0LmNhdGVnb3J5SWQpIHx8IGNhdGVnb3JpZXMuZmluZChjID0+IGMubGFiZWwgPT09IHBvc3QuY2F0ZWdvcnkpO1xuICAgIHJldHVybiAhY2F0IHx8IHVzZXJMZXZlbCA+PSAoY2F0Lm1pbkxldmVsID8/IDApO1xuICB9LCBbY2F0ZWdvcmllcywgdXNlckxldmVsXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHsgc2V0QWN0aXZlUHJlZml4KFwiXCIpOyB9LCBbdGFiXSk7XG5cbiAgY29uc3QgZmlsdGVyZWQgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBxID0gc2VhcmNoLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgYmFzZSA9IGFsbFBvc3RzLmZpbHRlcihwID0+IHtcbiAgICAgIGNvbnN0IGNhdCA9IGNhdGVnb3JpZXMuZmluZChjID0+IGMuaWQgPT09IHAuY2F0ZWdvcnlJZCkgfHwgY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5sYWJlbCA9PT0gcC5jYXRlZ29yeSk7XG4gICAgICBpZiAoY2F0ICYmIHVzZXJMZXZlbCA8IChjYXQubWluTGV2ZWwgPz8gMCkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICh0YWIgIT09IFwiYWxsXCIgJiYgKHAuY2F0ZWdvcnlJZCAhPT0gdGFiICYmIGNhdD8uaWQgIT09IHRhYikpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChxICYmICFwLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSkgJiYgIVN0cmluZyhwLmJvZHk/LnRleHQgfHwgJycpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChhY3RpdmVQcmVmaXggJiYgcC5wcmVmaXggIT09IGFjdGl2ZVByZWZpeCkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgaWYgKHNvcnQgPT09IFwidmlld3NcIikgcmV0dXJuIFsuLi5iYXNlXS5zb3J0KChhLCBiKSA9PiAoYi52aWV3cyA/PyAwKSAtIChhLnZpZXdzID8/IDApKTtcbiAgICBpZiAoc29ydCA9PT0gXCJyZXBsaWVzXCIpIHJldHVybiBbLi4uYmFzZV0uc29ydCgoYSwgYikgPT4gKGIucmVwbGllcyA/PyAwKSAtIChhLnJlcGxpZXMgPz8gMCkpO1xuICAgIGlmIChzb3J0ID09PSBcImxpa2VzXCIpIHJldHVybiBbLi4uYmFzZV0uc29ydCgoYSwgYikgPT4gKEFycmF5LmlzQXJyYXkoYi5saWtlcykgPyBiLmxpa2VzLmxlbmd0aCA6IDApIC0gKEFycmF5LmlzQXJyYXkoYS5saWtlcykgPyBhLmxpa2VzLmxlbmd0aCA6IDApKTtcbiAgICByZXR1cm4gYmFzZTtcbiAgfSwgW2FsbFBvc3RzLCBjYXRlZ29yaWVzLCB1c2VyTGV2ZWwsIHRhYiwgc2VhcmNoLCBzb3J0LCBhY3RpdmVQcmVmaXhdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4geyBzZXRQYWdlKDEpOyB9LCBbdGFiLCBzZWFyY2gsIHNvcnQsIGFjdGl2ZVByZWZpeF0pO1xuICAvLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvLyB2MDAuMDY4IFx1MjAxNCBQb3N0Q29tcG9zZSBcdUJBQThcdUIyRUMgd3JhcHBlci4gXHVCQUE5XHVCODVEIFx1QzcwNFx1QzVEMCBcdUJBQThcdUIyRUNcdUI4NUMgXHVENDVDXHVDMkRDLiBFU0MvXHVDNjc4XHVCRDgwXHVEMDc0XHVCOUFEIFx1QzJEQyB1c2VNb2RhbEd1YXJkIFx1QUMwMCBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgcHJvbXB0LlxuICAvLyBQb3N0Q29tcG9zZSBcdUM3NTggb25DYW5jZWwgXHVDNzc0IGNsb3NlTW9kYWwgXHVDNzNDXHVCODVDIFx1QzVGMFx1QUNCMFx1QjQyOCAoXHVDREU4XHVDMThDIFx1QkM4NFx1RDJCQyA9IFx1Qzk4OVx1QzJEQyBcdUIyRUJcdUFFMzApLlxuICBjb25zdCBQb3N0Q29tcG9zZU1vZGFsID0gKHsgb25DbG9zZSB9KSA9PiB7XG4gICAgY29uc3QgZ3VhcmQgPSB3aW5kb3cudXNlTW9kYWxHdWFyZD8uKHsgb3BlbjogdHJ1ZSwgZGlydHk6IHRydWUsIG9uQ2xvc2UsIG9uU2F2ZURyYWZ0OiBudWxsLCBsYWJlbDogJ1x1QUM4Q1x1QzJEQ1x1QUUwMCcgfSkgfHwge307XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1sYWJlbD17d3JpdGluZyA9PT0gdHJ1ZSA/ICdcdUMwQzggXHVBRTAwIFx1Qzc5MVx1QzEzMScgOiAnXHVBQzhDXHVDMkRDXHVBRTAwIFx1QzIxOFx1QzgxNSd9XG4gICAgICAgIG9uQ2xpY2s9e2d1YXJkLm9uQmFja2Ryb3BDbGlja31cbiAgICAgICAgc3R5bGU9e3twb3NpdGlvbjonZml4ZWQnLCBpbnNldDowLCBiYWNrZ3JvdW5kOidyZ2JhKDAsMCwwLDAuNTUpJywgekluZGV4OjEwMDAsIGRpc3BsYXk6J2dyaWQnLCBwbGFjZUl0ZW1zOidzdGFydCBjZW50ZXInLCBwYWRkaW5nOjI0LCBvdmVyZmxvd1k6J2F1dG8nfX0+XG4gICAgICAgIDxkaXYgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9IHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6J21pbigxMTAwcHgsIDEwMCUpJywgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm94U2hhZG93OicwIDE2cHggNDBweCByZ2JhKDAsMCwwLDAuMjUpJyxcbiAgICAgICAgICBwYWRkaW5nOjI0LCBtYXJnaW5Ub3A6MjQsIG1hcmdpbkJvdHRvbTo0OCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPFBvc3RDb21wb3NlXG4gICAgICAgICAgICBrZXk9e3dyaXRpbmcgPT09IHRydWUgPyBcIm5ld1wiIDogU3RyaW5nKHdyaXRpbmcuaWQpfVxuICAgICAgICAgICAgdXNlcj17dXNlcn1cbiAgICAgICAgICAgIGluaXRpYWxQb3N0PXt3cml0aW5nID09PSB0cnVlID8gbnVsbCA6IHdyaXRpbmd9XG4gICAgICAgICAgICBvbkNhbmNlbD17b25DbG9zZX1cbiAgICAgICAgICAgIG9uUHVibGlzaD17YXN5bmMgKHBheWxvYWQpID0+IHtcbiAgICAgICAgICAgICAgbGV0IHNhdmVkUG9zdDtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzYXZlZFBvc3QgPSB3cml0aW5nID09PSB0cnVlXG4gICAgICAgICAgICAgICAgICA/IGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWS5jcmVhdGVQb3N0UmVtb3RlKHBheWxvYWQpXG4gICAgICAgICAgICAgICAgICA6IGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWS51cGRhdGVQb3N0UmVtb3RlKHdyaXRpbmcuaWQsIHBheWxvYWQpO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBcdUMxMUNcdUJDODQgXHVDMkU0XHVEMzI4IFx1QzJEQyBcdUI4NUNcdUNFRUMgXHVEM0Y0XHVCQzMxLlxuICAgICAgICAgICAgICAgIHNhdmVkUG9zdCA9IHdyaXRpbmcgPT09IHRydWVcbiAgICAgICAgICAgICAgICAgID8gd2luZG93LkJHTkpfQ09NTVVOSVRZLmNyZWF0ZVBvc3QocGF5bG9hZClcbiAgICAgICAgICAgICAgICAgIDogd2luZG93LkJHTkpfQ09NTVVOSVRZLnVwZGF0ZVBvc3Qod3JpdGluZy5pZCwgcGF5bG9hZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25DbG9zZSgpO1xuICAgICAgICAgICAgICBzZXRSZWZyZXNoS2V5KCh2YWx1ZSkgPT4gdmFsdWUgKyAxKTtcbiAgICAgICAgICAgICAgaWYgKHNhdmVkUG9zdCkgc2V0UG9zdElkKHNhdmVkUG9zdC5pZCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgY2F0ZWdvcmllcz17Y2F0ZWdvcmllc31cbiAgICAgICAgICAgIHVzZXJMZXZlbD17dXNlckxldmVsfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuICBpZiAocG9zdElkKSB7XG4gICAgY29uc3QgcG9zdCA9IGFsbFBvc3RzLmZpbmQocCA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwb3N0SWQpKSB8fCBudWxsO1xuICAgIGlmICghcG9zdCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIiBzdHlsZT17e21heFdpZHRoOjc2MCwgdGV4dEFsaWduOidjZW50ZXInLCBwYWRkaW5nOic4MHB4IDIwcHgnfX0+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Cb3R0b206MTZ9fT5cdUQ1NzRcdUIyRjkgXHVBQzhDXHVDMkRDXHVBRTAwXHVDNzQ0IFx1Q0MzRVx1Qzc0NCBcdUMyMTggXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LjwvcD5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9eygpID0+IHNldFBvc3RJZChudWxsKX0+XHVCQUE5XHVCODVEXHVDNzNDXHVCODVDPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKCFjYW5SZWFkUG9zdChwb3N0KSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIiBzdHlsZT17e21heFdpZHRoOjc2MCwgdGV4dEFsaWduOidjZW50ZXInLCBwYWRkaW5nOic4MHB4IDIwcHgnfX0+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Cb3R0b206MTZ9fT5cdUQ2MDRcdUM3QUMgXHVCNEYxXHVBRTA5XHVDNzNDXHVCODVDXHVCMjk0IFx1Qzc3NCBcdUFDOENcdUMyRENcdUFFMDBcdUM3NDQgXHVCQ0ZDIFx1QzIxOCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuPC9wPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17KCkgPT4gc2V0UG9zdElkKG51bGwpfT5cdUJBQTlcdUI4NURcdUM3M0NcdUI4NUM8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gPFBvc3REZXRhaWxcbiAgICAgIHBvc3Q9e3Bvc3R9XG4gICAgICBnbz17Z299XG4gICAgICBzZXRQb3N0SWQ9e3NldFBvc3RJZH1cbiAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICBvblJlZnJlc2g9eygpID0+IHNldFJlZnJlc2hLZXkoKHZhbHVlKSA9PiB2YWx1ZSArIDEpfVxuICAgICAgb25FZGl0PXsobmV4dFBvc3QpID0+IHNldFdyaXRpbmcobmV4dFBvc3QpfVxuICAgIC8+O1xuICB9XG5cbiAgY29uc3QgdG90YWxQYWdlcyA9IE1hdGgubWF4KDEsIE1hdGguY2VpbChmaWx0ZXJlZC5sZW5ndGggLyBQT1NUU19QRVJfUEFHRSkpO1xuICBjb25zdCBzYWZlUGFnZSA9IE1hdGgubWluKHBhZ2UsIHRvdGFsUGFnZXMpO1xuICBjb25zdCBwYWdlU3RhcnQgPSAoc2FmZVBhZ2UgLSAxKSAqIFBPU1RTX1BFUl9QQUdFO1xuICBjb25zdCBwYWdlUG9zdHMgPSBmaWx0ZXJlZC5zbGljZShwYWdlU3RhcnQsIHBhZ2VTdGFydCArIFBPU1RTX1BFUl9QQUdFKTtcblxuICBjb25zdCBoYW5kbGVXcml0ZSA9ICgpID0+IHtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIGlmIChjb25maXJtKFwiXHVBRTAwXHVDNEYwXHVBRTMwXHVCMjk0IFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUQ2QzQgXHVDNzc0XHVDNkE5XHVENTYwIFx1QzIxOCBcdUM3ODhcdUMyQjVcdUIyQzhcdUIyRTQuIFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUQzOThcdUM3NzRcdUM5QzBcdUI4NUMgXHVDNzc0XHVCM0Q5XHVENTU4XHVDMkRDXHVBQ0EwXHVDNUI0XHVDNjk0P1wiKSkge1xuICAgICAgICBnbyhcImxvZ2luXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBXcml0YWJsZSBjYXRlZ29yaWVzIGZvciBjdXJyZW50IHVzZXJcbiAgICBjb25zdCB3cml0YWJsZSA9IGNhdGVnb3JpZXMuZmlsdGVyKGMgPT4gdXNlckxldmVsID49IChjLnBvc3RNaW5MZXZlbCA/PyBjLm1pbkxldmVsID8/IDApKTtcbiAgICBpZiAod3JpdGFibGUubGVuZ3RoID09PSAwKSB7XG4gICAgICBhbGVydChcIlx1RDYwNFx1QzdBQyBcdUI0RjFcdUFFMDlcdUM3M0NcdUI4NUNcdUIyOTQgXHVBRTAwXHVDNzQ0IFx1Qzc5MVx1QzEzMVx1RDU2MCBcdUMyMTggXHVDNzg4XHVCMjk0IFx1QUM4Q1x1QzJEQ1x1RDMxMFx1Qzc3NCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRXcml0aW5nKHRydWUpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICA8aGVhZGVyIHN0eWxlPXt7bWFyZ2luQm90dG9tOjI0fX0+XG4gICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAvLyB2MDAuMDczIFx1MjAxNCBzaXRlX2NvbnRlbnRfa3YuY29tbXVuaXR5SW50cm8gXHVDNUQwXHVDMTFDIGhlcm8gXHVDNzdEXHVBRTMwLlxuICAgICAgICAgICAgY29uc3QgX2kgPSAod2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9KS5jb21tdW5pdHlJbnRybyB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IGViID0gX2kuZXllYnJvdyB8fCAnQ09NTVVOSVRZIFx1MDBCNyBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAnO1xuICAgICAgICAgICAgY29uc3QgdHAgPSBfaS50aXRsZVByZWZpeCA/PyAnXHVCMkU0XHVDMTJGIFx1QkQwOVx1QzZCMFx1QjlBQyAnO1xuICAgICAgICAgICAgY29uc3QgdGEgPSBfaS50aXRsZUFjY2VudCA/PyAnXHVBRDExXHVDN0E1JztcbiAgICAgICAgICAgIGNvbnN0IHNiID0gX2kuc3VidGl0bGUgfHwgJ1x1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1Qzc3NCBcdUJBQThcdUM1RUMgXHVCMDk4XHVCMjA0XHVCMjk0IFx1Qzc3NFx1QzU3Q1x1QUUzMC4gXHVDOUM4XHVCQjM4XHVCM0M0IFx1QjJGNVx1QjNDNCBcdUQ2NThcdUM2MDFcdUQ1NjlcdUIyQzhcdUIyRTQuJztcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIj57ZWJ9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInNlY3Rpb24tdGl0bGVcIj57dHB9PHNwYW4gY2xhc3NOYW1lPVwiYWNjZW50XCI+e3RhfTwvc3Bhbj48L2gxPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInNlY3Rpb24tc3VidGl0bGVcIj57c2J9PC9wPlxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSkoKX1cbiAgICAgICAgPC9oZWFkZXI+XG5cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonY2VudGVyJywgbWFyZ2luQm90dG9tOjI0LCBnYXA6MjQsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgIDxkaXYgcm9sZT1cInRhYmxpc3RcIiBhcmlhLWxhYmVsPVwiXHVBQzhDXHVDMkRDXHVEMzEwIFx1QkQ4NFx1Qjk1OFwiXG4gICAgICAgICAgICBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MCwgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHJvbGU9XCJ0YWJcIiBhcmlhLXNlbGVjdGVkPXt0YWIgPT09IFwiYWxsXCJ9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFRhYihcImFsbFwiKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxNHB4IDI0cHgnLCBmb250U2l6ZToxMywgbGV0dGVyU3BhY2luZzonMC4xZW0nLFxuICAgICAgICAgICAgICAgIGNvbG9yOiB0YWIgPT09IFwiYWxsXCIgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiB0YWIgPT09IFwiYWxsXCIgPyAnMXB4IHNvbGlkIHZhcigtLWdvbGQpJyA6ICcxcHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTotMX19Plx1QzgwNFx1Q0NCNDwvYnV0dG9uPlxuICAgICAgICAgICAge3Zpc2libGVDYXRzLm1hcChjID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2MuaWR9IHR5cGU9XCJidXR0b25cIiByb2xlPVwidGFiXCIgYXJpYS1zZWxlY3RlZD17dGFiID09PSBjLmlkfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFRhYihjLmlkKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e3BhZGRpbmc6JzE0cHggMjRweCcsIGZvbnRTaXplOjEzLCBsZXR0ZXJTcGFjaW5nOicwLjFlbScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogdGFiID09PSBjLmlkID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiB0YWIgPT09IGMuaWQgPyAnMXB4IHNvbGlkIHZhcigtLWdvbGQpJyA6ICcxcHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOi0xfX0+e2MubGFiZWx9PC9idXR0b24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxMCwgYWxpZ25JdGVtczonY2VudGVyJywgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImNvbW11bml0eS1zZWFyY2hcIiBjbGFzc05hbWU9XCJzci1vbmx5XCI+XHVBQzhDXHVDMkRDXHVBRTAwIFx1QUM4MFx1QzBDOTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJjb21tdW5pdHktc2VhcmNoXCJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RhYiA9PT0gXCJhbGxcIiA/IFwiXHVDODA0XHVDQ0I0IFx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUFDODBcdUMwQzkuLi5cIiA6IGAke2N1cnJlbnRCb2FyZD8ubGFiZWwgfHwgJyd9IFx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUFDODBcdUMwQzkuLi5gfVxuICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNofSBvbkNoYW5nZT17ZSA9PiBzZXRTZWFyY2goZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHN0eWxlPXt7d2lkdGg6MjAwLCBwYWRkaW5nOicxMHB4IDE0cHgnfX0vPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjb21tdW5pdHktc29ydFwiIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5cdUM4MTVcdUI4MkM8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBpZD1cImNvbW11bml0eS1zb3J0XCIgdmFsdWU9e3NvcnR9IG9uQ2hhbmdlPXtlID0+IHNldFNvcnQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHN0eWxlPXt7cGFkZGluZzonMTBweCAxMnB4JywgZm9udFNpemU6MTIsIGN1cnNvcjoncG9pbnRlcid9fT5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImxhdGVzdFwiPlx1Q0Q1Q1x1QzJFMFx1QzIxQzwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwidmlld3NcIj5cdUM4NzBcdUQ2OENcdUMyMUM8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJlcGxpZXNcIj5cdUIzMTNcdUFFMDBcdUMyMUM8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImxpa2VzXCI+XHVDODhCXHVDNTQ0XHVDNjk0XHVDMjFDPC9vcHRpb24+XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBvbkNsaWNrPXtoYW5kbGVXcml0ZX0+XG4gICAgICAgICAgICAgIHt1c2VyID8gJ1x1QUUwMFx1QzRGMFx1QUUzMCBcdUZGMEInIDogJ1x1Qjg1Q1x1QURGOFx1Qzc3OCBcdUQ2QzQgXHVBRTAwXHVDNEYwXHVBRTMwJ31cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogXHVBQzhDXHVDMkRDXHVEMzEwIFx1QzEyNFx1QkE4NSBcdTIwMTQgXHVEMkI5XHVDODE1IFx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUJERjBcdUM1RDBcdUMxMUNcdUI5Q0MgXHVENDVDXHVDMkRDICovfVxuICAgICAgICB7dGFiICE9PSBcImFsbFwiICYmIGN1cnJlbnRCb2FyZD8uZGVzYyAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZzonMTBweCAxNnB4JywgbWFyZ2luQm90dG9tOjE2LFxuICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmctMiknLCBib3JkZXJMZWZ0OiczcHggc29saWQgdmFyKC0tZ29sZCknLFxuICAgICAgICAgICAgZm9udFNpemU6MTMsIGNvbG9yOid2YXIoLS1pbmstMiknLCBsaW5lSGVpZ2h0OjEuNixcbiAgICAgICAgICB9fT57Y3VycmVudEJvYXJkLmRlc2N9PC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFx1QjlEMFx1QkEzOFx1QjlBQyBcdUQ1NDRcdUQxMzAgXHUyMDE0IFx1RDU3NFx1QjJGOSBcdUFDOENcdUMyRENcdUQzMTBcdUM1RDAgXHVCOUQwXHVCQTM4XHVCOUFDXHVBQzAwIFx1Qzc4OFx1Qzc0NCBcdUI1NENcdUI5Q0MgXHVENDVDXHVDMkRDICovfVxuICAgICAgICB7Ym9hcmRQcmVmaXhlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo4LCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbToxNn19PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlUHJlZml4KFwiXCIpfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6JzRweCAxNnB4JywgYm9yZGVyOicxcHggc29saWQnLFxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBhY3RpdmVQcmVmaXggPT09IFwiXCIgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWxpbmUtMiknLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmVQcmVmaXggPT09IFwiXCIgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYWN0aXZlUHJlZml4ID09PSBcIlwiID8gJ3JnYmEoMTU4LDEwNCwyNCwwLjA2KScgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgY3Vyc29yOidwb2ludGVyJywgZm9udFNpemU6MTMsIGxldHRlclNwYWNpbmc6JzAuMDVlbScsXG4gICAgICAgICAgICAgIH19Plx1QzgwNFx1Q0NCNDwvYnV0dG9uPlxuICAgICAgICAgICAge2JvYXJkUHJlZml4ZXMubWFwKHAgPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT17cH0gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlUHJlZml4KGFjdGl2ZVByZWZpeCA9PT0gcCA/IFwiXCIgOiBwKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcGFkZGluZzonNHB4IDE2cHgnLCBib3JkZXI6JzFweCBzb2xpZCcsXG4gICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogYWN0aXZlUHJlZml4ID09PSBwID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lLTIpJyxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmVQcmVmaXggPT09IHAgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBhY3RpdmVQcmVmaXggPT09IHAgPyAncmdiYSgxNTgsMTA0LDI0LDAuMDYpJyA6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjoncG9pbnRlcicsIGZvbnRTaXplOjEzLCBsZXR0ZXJTcGFjaW5nOicwLjA1ZW0nLFxuICAgICAgICAgICAgICAgIH19PntwfTwvYnV0dG9uPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgPHRhYmxlIHN0eWxlPXt7d2lkdGg6JzEwMCUnLCBib3JkZXJDb2xsYXBzZTonY29sbGFwc2UnfX0+XG4gICAgICAgICAgPGNhcHRpb24gY2xhc3NOYW1lPVwic3Itb25seVwiPlx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUJBQTlcdUI4NUQ8L2NhcHRpb24+XG4gICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyIHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjEwLCBsZXR0ZXJTcGFjaW5nOicwLjJlbScsIGNvbG9yOid2YXIoLS1pbmstMyknLCB0ZXh0VHJhbnNmb3JtOid1cHBlcmNhc2UnfX0+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiIHN0eWxlPXt7cGFkZGluZzonMTZweCA4cHgnLCB0ZXh0QWxpZ246J2xlZnQnLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB3aWR0aDo2MH19Plx1QkM4OFx1RDYzODwvdGg+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiIHN0eWxlPXt7cGFkZGluZzonMTZweCA4cHgnLCB0ZXh0QWxpZ246J2xlZnQnLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB3aWR0aDo5MH19Plx1QkQ4NFx1Qjk1ODwvdGg+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiIHN0eWxlPXt7cGFkZGluZzonMTZweCA4cHgnLCB0ZXh0QWxpZ246J2xlZnQnLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XHVDODFDXHVCQUE5PC90aD5cbiAgICAgICAgICAgICAgPHRoIHNjb3BlPVwiY29sXCIgc3R5bGU9e3twYWRkaW5nOicxNnB4IDhweCcsIHRleHRBbGlnbjonbGVmdCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHdpZHRoOjEyMH19Plx1Qzc5MVx1QzEzMVx1Qzc5MDwvdGg+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiIHN0eWxlPXt7cGFkZGluZzonMTZweCA4cHgnLCB0ZXh0QWxpZ246J3JpZ2h0JywgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgd2lkdGg6NzB9fT5cdUM4NzBcdUQ2OEM8L3RoPlxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIiBzdHlsZT17e3BhZGRpbmc6JzE2cHggOHB4JywgdGV4dEFsaWduOidyaWdodCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHdpZHRoOjEwMH19Plx1QjBBMFx1QzlEQzwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgPHRyPjx0ZCBjb2xTcGFuPXs2fSBzdHlsZT17e3BhZGRpbmc6NDgsIHRleHRBbGlnbjonY2VudGVyJ319IGNsYXNzTmFtZT1cImRpbVwiPlxuICAgICAgICAgICAgICAgIFx1Qzg3MFx1QUM3NFx1QzVEMCBcdUI5REVcdUIyOTQgXHVBQzhDXHVDMkRDXHVBRTAwXHVDNzc0IFx1QzVDNlx1QzJCNVx1QjJDOFx1QjJFNC5cbiAgICAgICAgICAgICAgPC90ZD48L3RyPlxuICAgICAgICAgICAgKSA6IHBhZ2VQb3N0cy5tYXAoKHAsIGkpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgY2F0ID0gY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5pZCA9PT0gcC5jYXRlZ29yeUlkKSB8fCBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmxhYmVsID09PSBwLmNhdGVnb3J5KSB8fCB7IGxhYmVsOiBwLmNhdGVnb3J5IH07XG4gICAgICAgICAgICAgIGNvbnN0IGxpa2VzQ291bnQgPSBBcnJheS5pc0FycmF5KHAubGlrZXMpID8gcC5saWtlcy5sZW5ndGggOiAwO1xuICAgICAgICAgICAgICBjb25zdCBib29rbWFya2VkID0gdXNlciAmJiBHLmNhbGwoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5pc0Jvb2ttYXJrZWQ/Lih1c2VyLmlkLCBwLmlkKSwgZmFsc2UpO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDx0ciBrZXk9e3AuaWR9IHN0eWxlPXt7Ym9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB0cmFuc2l0aW9uOidiYWNrZ3JvdW5kIC4ycyd9fVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYmEoMjQ1LDIxMyw3MiwwLjAzKSd9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnfT5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCcsIGZvbnRTaXplOjEyfX0+e1N0cmluZyhmaWx0ZXJlZC5sZW5ndGggLSAocGFnZVN0YXJ0ICsgaSkpLnBhZFN0YXJ0KDMsICcwJyl9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17e3BhZGRpbmc6JzE4cHggOHB4J319PjxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCI+e2NhdC5sYWJlbH08L3NwYW4+PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17e3BhZGRpbmc6JzE4cHggOHB4JywgZm9udFNpemU6MTV9fSBjbGFzc05hbWU9XCJyb3ctdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0UG9zdElkKHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YWxsOid1bnNldCcsIGN1cnNvcjoncG9pbnRlcicsIHRleHRBbGlnbjonbGVmdCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7Ym9va21hcmtlZCAmJiA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCIgc3R5bGU9e3ttYXJnaW5SaWdodDo2LCBmb250U2l6ZToxMX19IGFyaWEtbGFiZWw9XCJcdUJEODFcdUI5QzhcdUQwNkNcIj5cdTI2MDU8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgIHtwLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgIHtwLmltYWdlcz8ubGVuZ3RoID4gMCAmJiA8c3BhbiBjbGFzc05hbWU9XCJnb2xkIG1vbm9cIiBzdHlsZT17e21hcmdpbkxlZnQ6OCwgZm9udFNpemU6MTB9fSBhcmlhLWxhYmVsPVwiXHVDNzc0XHVCQkY4XHVDOUMwIFx1Q0NBOFx1QkQ4MFwiPlx1RDgzRFx1RENGN3twLmltYWdlcy5sZW5ndGh9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7bGlrZXNDb3VudCA+IDAgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZCBtb25vXCIgc3R5bGU9e3ttYXJnaW5MZWZ0OjgsIGZvbnRTaXplOjEwfX0gYXJpYS1sYWJlbD1cIlx1QUNGNVx1QUMxMCBcdUMyMThcIj5cdTI2NjV7bGlrZXNDb3VudH08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgIHtwLnRhZ3M/Lmxlbmd0aCA+IDAgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTIgbW9ub1wiIHN0eWxlPXt7bWFyZ2luTGVmdDo4LCBmb250U2l6ZToxMH19PntwLnRhZ3Muc2xpY2UoMCwzKS5tYXAodCA9PiBgIyR7dH1gKS5qb2luKCcgJyl9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7cC5ob3QgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIHN0eWxlPXt7bWFyZ2luTGVmdDo4LCBmb250U2l6ZToxMH19PkhPVDwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAge3AuX25ldyAmJiA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCIgc3R5bGU9e3ttYXJnaW5MZWZ0OjgsIGZvbnRTaXplOjEwfX0+TkVXPC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm1vbm8gZGltXCIgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCcsIGZvbnRTaXplOjEyfX0+XG4gICAgICAgICAgICAgICAgICAgIHtwLmF1dGhvcn1cbiAgICAgICAgICAgICAgICAgICAgPEF1dGhvckdyYWRlQmFkZ2UgYXV0aG9ySWQ9e3AuYXV0aG9ySWR9IGF1dGhvcj17cC5hdXRob3J9IGF1dGhvckVtYWlsPXtwLmF1dGhvckVtYWlsfS8+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e3BhZGRpbmc6JzE4cHggOHB4JywgZm9udFNpemU6MTIsIHRleHRBbGlnbjoncmlnaHQnfX0+e3Audmlld3MgPz8gMH08L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e3BhZGRpbmc6JzE4cHggOHB4JywgZm9udFNpemU6MTEsIHRleHRBbGlnbjoncmlnaHQnfX0+XG4gICAgICAgICAgICAgICAgICAgIDx0aW1lIGRhdGVUaW1lPXtwLmRhdGUucmVwbGFjZSgvXFwuL2csJy0nKX0+e3AuZGF0ZX08L3RpbWU+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuXG4gICAgICAgIHsvKiBQYWdpbmF0aW9uICovfVxuICAgICAgICB7ZmlsdGVyZWQubGVuZ3RoID4gMCAmJiB0b3RhbFBhZ2VzID4gMSAmJiAoXG4gICAgICAgICAgPG5hdiBhcmlhLWxhYmVsPVwiXHVBQzhDXHVDMkRDXHVBRTAwIFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUM3NzRcdUIzRDlcIiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonY2VudGVyJywgYWxpZ25JdGVtczonY2VudGVyJywgZ2FwOjYsIG1hcmdpblRvcDozMiwgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UGFnZShNYXRoLm1heCgxLCBzYWZlUGFnZSAtIDEpKX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3NhZmVQYWdlIDw9IDF9Plx1MjE5MCBcdUM3NzRcdUM4MDQ8L2J1dHRvbj5cbiAgICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiB0b3RhbFBhZ2VzIH0sIChfLCBpZHgpID0+IGlkeCArIDEpLm1hcCgobikgPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT17bn0gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICAgICAgICAgIGFyaWEtY3VycmVudD17biA9PT0gc2FmZVBhZ2UgPyAncGFnZScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UGFnZShuKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IG4gPT09IHNhZmVQYWdlID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogbiA9PT0gc2FmZVBhZ2UgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBuID09PSBzYWZlUGFnZSA/ICdyZ2JhKDI0NSwyMTMsNzIsMC4wOCknIDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiAzNixcbiAgICAgICAgICAgICAgICB9fT57bn08L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFBhZ2UoTWF0aC5taW4odG90YWxQYWdlcywgc2FmZVBhZ2UgKyAxKSl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzYWZlUGFnZSA+PSB0b3RhbFBhZ2VzfT5cdUIyRTRcdUM3NEMgXHUyMTkyPC9idXR0b24+XG4gICAgICAgICAgPC9uYXY+XG4gICAgICAgICl9XG5cbiAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7dGV4dEFsaWduOidjZW50ZXInLCBmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4yZW0nLCBtYXJnaW5Ub3A6MTJ9fT5cbiAgICAgICAgICAgIFx1QzgwNFx1Q0NCNCB7ZmlsdGVyZWQubGVuZ3RofVx1QUM3NCBcdTAwQjcge3NhZmVQYWdlfS97dG90YWxQYWdlc30gXHVEMzk4XHVDNzc0XHVDOUMwXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFx1RDU1OFx1QjJFOCBcdUFDODBcdUMwQzkgKyBcdUFFMDBcdUM0RjBcdUFFMzAgXHVCQzE0ICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTonZmxleCcsIGdhcDoxMCwgYWxpZ25JdGVtczonY2VudGVyJywganVzdGlmeUNvbnRlbnQ6J2NlbnRlcicsXG4gICAgICAgICAgbWFyZ2luVG9wOjQwLCBwYWRkaW5nVG9wOjI0LCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgZmxleFdyYXA6J3dyYXAnLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImNvbW11bml0eS1zZWFyY2gtYm90dG9tXCIgY2xhc3NOYW1lPVwic3Itb25seVwiPlx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUFDODBcdUMwQzk8L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dCBpZD1cImNvbW11bml0eS1zZWFyY2gtYm90dG9tXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0YWIgPT09IFwiYWxsXCIgPyBcIlx1QzgwNFx1Q0NCNCBcdUFDOENcdUMyRENcdUQzMTAgXHVBQzgwXHVDMEM5Li4uXCIgOiBgJHtjdXJyZW50Qm9hcmQ/LmxhYmVsIHx8ICcnfSBcdUFDOENcdUMyRENcdUQzMTAgXHVBQzgwXHVDMEM5Li4uYH1cbiAgICAgICAgICAgIHZhbHVlPXtzZWFyY2h9IG9uQ2hhbmdlPXtlID0+IHNldFNlYXJjaChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICBzdHlsZT17e3dpZHRoOjI4MCwgcGFkZGluZzonMTJweCAxNnB4JywgZm9udFNpemU6MTR9fS8+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkXCIgb25DbGljaz17aGFuZGxlV3JpdGV9XG4gICAgICAgICAgICBzdHlsZT17e3BhZGRpbmc6JzEycHggMjhweCcsIGZvbnRTaXplOjEzfX0+XG4gICAgICAgICAgICB7dXNlciA/ICdcdUFFMDBcdUM0RjBcdUFFMzAgXHVGRjBCJyA6ICdcdUI4NUNcdUFERjhcdUM3NzggXHVENkM0IFx1QUUwMFx1QzRGMFx1QUUzMCd9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7LyogdjAwLjA2OCBcdTIwMTQgXHVBRTAwXHVDNEYwXHVBRTMwIFx1QkFBOFx1QjJFQyAoXHVCQUE5XHVCODVEIFx1QzcwNFx1QzVEMCBcdUQ0NUNcdUMyREMpLiB1c2VNb2RhbEd1YXJkIFx1Qjg1QyBFU0MvXHVDNjc4XHVCRDgwXHVEMDc0XHVCOUFEIFx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNSBwcm9tcHQuICovfVxuICAgICAge3dyaXRpbmcgJiYgPFBvc3RDb21wb3NlTW9kYWwgb25DbG9zZT17KCkgPT4gc2V0V3JpdGluZyhudWxsKX0vPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PSBQb3N0IENvbXBvc2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gXHVDMEM4IFx1QUUwMCBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgXHVEMEE0IFx1MjAxNCBcdUMwQUNcdUM2QTlcdUM3OTBcdUJDQzRcdUI4NUMgXHVCRDg0XHVCOUFDKFx1QzVFQ1x1QjdFQyBcdUFDQzRcdUM4MTVcdUM3NzQgXHVBQzE5XHVDNzQwIFx1QkUwQ1x1Qjc3Q1x1QzZCMFx1QzgwMFx1Qjk3QyBcdUM0RjggXHVCNTRDIFx1QzExRVx1Qzc3NFx1QzlDMCBcdUM1NEFcdUIzQzRcdUI4NUQpLlxuY29uc3QgZHJhZnRLZXlGb3IgPSAodXNlcklkKSA9PiBgYmdual9wb3N0X2RyYWZ0XyR7dXNlcklkIHx8ICdndWVzdCd9YDtcblxuY29uc3QgUG9zdENvbXBvc2UgPSAoeyB1c2VyLCBpbml0aWFsUG9zdCwgb25DYW5jZWwsIG9uUHVibGlzaCwgY2F0ZWdvcmllcywgdXNlckxldmVsIH0pID0+IHtcbiAgY29uc3Qgd3JpdGFibGUgPSBjYXRlZ29yaWVzLmZpbHRlcihjID0+IHVzZXJMZXZlbCA+PSAoYy5wb3N0TWluTGV2ZWwgPz8gYy5taW5MZXZlbCA/PyAwKSk7XG4gIGNvbnN0IGRlZmF1bHRDYXRlZ29yeUlkID0gaW5pdGlhbFBvc3Q/LmNhdGVnb3J5SWQgfHwgd3JpdGFibGVbMF0/LmlkIHx8IGNhdGVnb3JpZXNbMF0/LmlkIHx8IFwiXCI7XG4gIGNvbnN0IGlzRWRpdGluZyA9ICEhaW5pdGlhbFBvc3Q7XG5cbiAgLy8gXHVDMEM4IFx1QUUwMCBcdUM3OTFcdUMxMzFcdUM3N0MgXHVCNTRDXHVCOUNDIFx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNSBcdUJDRjVcdUM2RDAvXHVDODAwXHVDN0E1LiBcdUMyMThcdUM4MTUgXHVCQUE4XHVCNERDXHVDNUQwXHVDMTFDXHVCMjk0IFx1QzZEMFx1QkNGOCBcdUFDOENcdUMyRENcdUFFMDBcdUM3NzQgc291cmNlIG9mIHRydXRoLlxuICBjb25zdCBkcmFmdEtleSA9IGRyYWZ0S2V5Rm9yKHVzZXI/LmlkKTtcbiAgY29uc3QgaW5pdGlhbERyYWZ0ID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGlzRWRpdGluZykgcmV0dXJuIG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGRyYWZ0S2V5KTtcbiAgICAgIHJldHVybiByYXcgPyBKU09OLnBhcnNlKHJhdykgOiBudWxsO1xuICAgIH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxuICB9LCBbZHJhZnRLZXksIGlzRWRpdGluZ10pO1xuXG4gIGNvbnN0IFtjYXRlZ29yeUlkLCBzZXRDYXRlZ29yeUlkXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxEcmFmdD8uY2F0ZWdvcnlJZCB8fCBkZWZhdWx0Q2F0ZWdvcnlJZCk7XG4gIGNvbnN0IFt0aXRsZSwgc2V0VGl0bGVdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LnRpdGxlIHx8IGluaXRpYWxEcmFmdD8udGl0bGUgfHwgXCJcIik7XG4gIGNvbnN0IFtwcmVmaXgsIHNldFByZWZpeF0gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsUG9zdD8ucHJlZml4IHx8IGluaXRpYWxEcmFmdD8ucHJlZml4IHx8IFwiXCIpO1xuICBjb25zdCBbdGFncywgc2V0VGFnc10gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsUG9zdD8udGFncyB8fCBpbml0aWFsRHJhZnQ/LnRhZ3MgfHwgW10pO1xuICBjb25zdCBbaW1hZ2VzLCBzZXRJbWFnZXNdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LmltYWdlcyB8fCBpbml0aWFsRHJhZnQ/LmltYWdlcyB8fCBbXSk7XG4gIGNvbnN0IFthdHRhY2htZW50cywgc2V0QXR0YWNobWVudHNdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LmF0dGFjaG1lbnRzIHx8IGluaXRpYWxEcmFmdD8uYXR0YWNobWVudHMgfHwgW10pO1xuICBjb25zdCBbYm9keUh0bWwsIHNldEJvZHlIdG1sXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxQb3N0Py5ib2R5Py5odG1sIHx8IGluaXRpYWxEcmFmdD8uYm9keUh0bWwgfHwgXCJcIik7XG4gIGNvbnN0IFtib2R5VGV4dCwgc2V0Qm9keVRleHRdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LmJvZHk/LnRleHQgfHwgaW5pdGlhbERyYWZ0Py5ib2R5VGV4dCB8fCBcIlwiKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSBSZWFjdC51c2VTdGF0ZShcIlwiKTtcbiAgY29uc3QgW2RyYWZ0UmVzdG9yZWQsIHNldERyYWZ0UmVzdG9yZWRdID0gUmVhY3QudXNlU3RhdGUoISEoaW5pdGlhbERyYWZ0ICYmIChpbml0aWFsRHJhZnQudGl0bGUgfHwgaW5pdGlhbERyYWZ0LmJvZHlUZXh0KSkpO1xuICBjb25zdCBbc2F2ZWRBdCwgc2V0U2F2ZWRBdF0gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsRHJhZnQ/LnNhdmVkQXQgfHwgbnVsbCk7XG4gIGNvbnN0IHByZXZDYXRlZ29yeUlkUmVmID0gUmVhY3QudXNlUmVmKGNhdGVnb3J5SWQpO1xuXG4gIC8vIFx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNSBcdTIwMTQgXHVDMjE4XHVDODE1IFx1QkFBOFx1QjREQyBcdUM4MUNcdUM2NzgsIDFcdUNEMDggXHVCNTE0XHVCQzE0XHVDNkI0XHVDMkE0XHVCODVDIFx1QzgwMFx1QzdBNS5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNFZGl0aW5nKSByZXR1cm47XG4gICAgY29uc3QgaGFzQ29udGVudCA9ICEhKHRpdGxlLnRyaW0oKSB8fCBib2R5VGV4dC50cmltKCkgfHwgKHRhZ3MgJiYgdGFncy5sZW5ndGgpIHx8IChpbWFnZXMgJiYgaW1hZ2VzLmxlbmd0aCkgfHwgKGF0dGFjaG1lbnRzICYmIGF0dGFjaG1lbnRzLmxlbmd0aCkpO1xuICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChoYXNDb250ZW50KSB7XG4gICAgICAgICAgY29uc3Qgc25hcHNob3QgPSB7IGNhdGVnb3J5SWQsIHRpdGxlLCBwcmVmaXgsIHRhZ3MsIGltYWdlcywgYXR0YWNobWVudHMsIGJvZHlIdG1sLCBib2R5VGV4dCwgc2F2ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH07XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oZHJhZnRLZXksIEpTT04uc3RyaW5naWZ5KHNuYXBzaG90KSk7XG4gICAgICAgICAgc2V0U2F2ZWRBdChzbmFwc2hvdC5zYXZlZEF0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShkcmFmdEtleSk7XG4gICAgICAgICAgc2V0U2F2ZWRBdChudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7fVxuICAgIH0sIDgwMCk7XG4gICAgcmV0dXJuICgpID0+IGNsZWFyVGltZW91dCh0KTtcbiAgfSwgW2RyYWZ0S2V5LCBpc0VkaXRpbmcsIGNhdGVnb3J5SWQsIHRpdGxlLCBwcmVmaXgsIHRhZ3MsIGltYWdlcywgYXR0YWNobWVudHMsIGJvZHlIdG1sLCBib2R5VGV4dF0pO1xuXG4gIGNvbnN0IGNsZWFyRHJhZnQgPSAoKSA9PiB7XG4gICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oZHJhZnRLZXkpOyB9IGNhdGNoIHt9XG4gICAgc2V0U2F2ZWRBdChudWxsKTtcbiAgICBzZXREcmFmdFJlc3RvcmVkKGZhbHNlKTtcbiAgfTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldENhdGVnb3J5SWQoaW5pdGlhbFBvc3Q/LmNhdGVnb3J5SWQgfHwgZGVmYXVsdENhdGVnb3J5SWQpO1xuICAgIHNldFRpdGxlKGluaXRpYWxQb3N0Py50aXRsZSB8fCBcIlwiKTtcbiAgICBzZXRQcmVmaXgoaW5pdGlhbFBvc3Q/LnByZWZpeCB8fCBcIlwiKTtcbiAgICBzZXRUYWdzKGluaXRpYWxQb3N0Py50YWdzIHx8IFtdKTtcbiAgICBzZXRJbWFnZXMoaW5pdGlhbFBvc3Q/LmltYWdlcyB8fCBbXSk7XG4gICAgc2V0QXR0YWNobWVudHMoaW5pdGlhbFBvc3Q/LmF0dGFjaG1lbnRzIHx8IFtdKTtcbiAgICBzZXRCb2R5SHRtbChpbml0aWFsUG9zdD8uYm9keT8uaHRtbCB8fCBcIlwiKTtcbiAgICBzZXRCb2R5VGV4dChpbml0aWFsUG9zdD8uYm9keT8udGV4dCB8fCBcIlwiKTtcbiAgICBzZXRFcnJvcihcIlwiKTtcbiAgICBwcmV2Q2F0ZWdvcnlJZFJlZi5jdXJyZW50ID0gaW5pdGlhbFBvc3Q/LmNhdGVnb3J5SWQgfHwgZGVmYXVsdENhdGVnb3J5SWQ7XG4gICAgLy8gaW5pdGlhbFBvc3QgXHVBQzAwIFx1QjRFNFx1QzVCNFx1QzYyNFx1QkE3NCAoPSBcdUMyMThcdUM4MTUgXHVCQUE4XHVCNERDKSBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTVcdUM3NDAgXHVCQjM0XHVDMkRDLlxuICB9LCBbaW5pdGlhbFBvc3QsIGRlZmF1bHRDYXRlZ29yeUlkXSk7XG5cbiAgY29uc3Qgc2VsZWN0ZWRDYXQgPSBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmlkID09PSBjYXRlZ29yeUlkKTtcbiAgY29uc3QgYm9hcmRQcmVmaXhlcyA9IHNlbGVjdGVkQ2F0Py5wcmVmaXhlcyB8fCBbXTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChwcmV2Q2F0ZWdvcnlJZFJlZi5jdXJyZW50ID09PSBjYXRlZ29yeUlkKSByZXR1cm47XG4gICAgcHJldkNhdGVnb3J5SWRSZWYuY3VycmVudCA9IGNhdGVnb3J5SWQ7XG4gICAgaWYgKCFpc0VkaXRpbmcgfHwgY2F0ZWdvcnlJZCAhPT0gKGluaXRpYWxQb3N0Py5jYXRlZ29yeUlkIHx8IFwiXCIpKSB7XG4gICAgICBzZXRQcmVmaXgoXCJcIik7XG4gICAgfVxuICB9LCBbY2F0ZWdvcnlJZCwgaW5pdGlhbFBvc3QsIGlzRWRpdGluZ10pO1xuXG4gIGNvbnN0IHN1Ym1pdCA9ICgpID0+IHtcbiAgICBzZXRFcnJvcihcIlwiKTtcbiAgICBpZiAoIXRpdGxlLnRyaW0oKSkgcmV0dXJuIHNldEVycm9yKFwiXHVDODFDXHVCQUE5XHVDNzQ0IFx1Qzc4NVx1QjgyNVx1RDU3NFx1QzhGQ1x1QzEzOFx1QzY5NC5cIik7XG4gICAgaWYgKCFib2R5VGV4dC50cmltKCkpIHJldHVybiBzZXRFcnJvcihcIlx1QkNGOFx1QkIzOFx1Qzc0NCBcdUM3ODVcdUI4MjVcdUQ1NzRcdUM4RkNcdUMxMzhcdUM2OTQuXCIpO1xuICAgIGNvbnN0IGNhdCA9IGNhdGVnb3JpZXMuZmluZChjID0+IGMuaWQgPT09IGNhdGVnb3J5SWQpO1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIC8vIFx1QkMxQ1x1RDU4OSBcdUMxMzFcdUFDRjUgXHVBQzAwXHVDODE1XHVDNzNDXHVCODVDIFx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNSBcdUM4MTVcdUI5QUMgKFx1QzJFNFx1RDMyOCBcdUMyREMgb25QdWJsaXNoIFx1Q0UyMVx1QzVEMFx1QzExQyBcdUIyRTRcdUMyREMgXHVDODAwXHVDN0E1XHVDNzQwIFx1QzU0OCBcdUQ1NjgpLlxuICAgIGlmICghaXNFZGl0aW5nKSB7XG4gICAgICB0cnkgeyBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShkcmFmdEtleSk7IH0gY2F0Y2gge31cbiAgICB9XG4gICAgb25QdWJsaXNoKHtcbiAgICAgIGNhdGVnb3J5SWQ6IGNhdC5pZCxcbiAgICAgIGNhdGVnb3J5OiBjYXQubGFiZWwsXG4gICAgICBwcmVmaXg6IHByZWZpeCB8fCBcIlwiLFxuICAgICAgdGl0bGU6IHRpdGxlLnRyaW0oKSxcbiAgICAgIGF1dGhvcjogdXNlcj8ubmFtZSB8fCBcIlx1Qzc3NVx1QkE4NVwiLFxuICAgICAgYXV0aG9ySWQ6IHVzZXI/LmlkIHx8IG51bGwsXG4gICAgICBhdXRob3JFbWFpbDogdXNlcj8uZW1haWwgfHwgbnVsbCxcbiAgICAgIHJlcGxpZXM6IGluaXRpYWxQb3N0Py5yZXBsaWVzID8/IDAsXG4gICAgICB2aWV3czogaW5pdGlhbFBvc3Q/LnZpZXdzID8/IDAsXG4gICAgICBkYXRlOiBgJHtub3cuZ2V0RnVsbFllYXIoKX0uJHtwYWQobm93LmdldE1vbnRoKCkrMSl9LiR7cGFkKG5vdy5nZXREYXRlKCkpfWAsXG4gICAgICB0YWdzLFxuICAgICAgaW1hZ2VzLFxuICAgICAgYXR0YWNobWVudHMsXG4gICAgICBfbmV3OiB0cnVlLFxuICAgICAgX3VzZXJDcmVhdGVkOiB0cnVlLFxuICAgICAgYm9keTogeyBodG1sOiBib2R5SHRtbCwgdGV4dDogYm9keVRleHQgfSxcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIiBzdHlsZT17e21heFdpZHRoOjk2MH19PlxuICAgICAgICA8aGVhZGVyIHN0eWxlPXt7bWFyZ2luQm90dG9tOjMyfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5DT01QT1NFIFx1MDBCNyBcdUFFMDBcdUM0RjBcdUFFMzA8L2Rpdj5cbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwic2VjdGlvbi10aXRsZVwiIHN0eWxlPXt7Zm9udFNpemU6MzZ9fT57aXNFZGl0aW5nID8gXCJcdUFDOENcdUMyRENcdUFFMDAgXHVDMjE4XHVDODE1XCIgOiBcIlx1QzBDOCBcdUFFMDAgXHVDNzkxXHVDMTMxXCJ9PC9oMT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEzLCBtYXJnaW5Ub3A6OH19PlxuICAgICAgICAgICAgXHVDNzkxXHVDMTMxXHVDNzkwOiA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCI+e3VzZXI/Lm5hbWUgfHwgJ1x1Qzc3NVx1QkE4NSd9PC9zcGFuPlxuICAgICAgICAgICAgeyFpc0VkaXRpbmcgJiYgc2F2ZWRBdCAmJiAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbS0yIG1vbm9cIiBzdHlsZT17e21hcmdpbkxlZnQ6MTQsIGZvbnRTaXplOjExfX0+XG4gICAgICAgICAgICAgICAgXHUwMEI3IFx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNVx1QjQyOCAoe25ldyBEYXRlKHNhdmVkQXQpLnRvTG9jYWxlVGltZVN0cmluZygna28tS1InLCB7aG91cjonMi1kaWdpdCcsIG1pbnV0ZTonMi1kaWdpdCd9KX0pXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIHshaXNFZGl0aW5nICYmIGRyYWZ0UmVzdG9yZWQgJiYgKFxuICAgICAgICAgICAgPGRpdiByb2xlPVwic3RhdHVzXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOjE0LCBwYWRkaW5nOicxMHB4IDE0cHgnLCBiYWNrZ3JvdW5kOidyZ2JhKDI0NSwyMTMsNzIsMC4wNiknLFxuICAgICAgICAgICAgICBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1nb2xkLWRpbSknLCBmb250U2l6ZToxMiwgY29sb3I6J3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6J2NlbnRlcicsIGdhcDoxMixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8c3Bhbj5cdUM3NzRcdUM4MDRcdUM1RDAgXHVDNzkxXHVDMTMxXHVENTU4XHVCMzU4IFx1QUUwMFx1Qzc0NCBcdUJDRjVcdUM2RDBcdUQ1ODhcdUMyQjVcdUIyQzhcdUIyRTQuPC9zcGFuPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChjb25maXJtKCdcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTVcdUI0MUMgXHVBRTAwXHVDNzQ0IFx1QzBBRFx1QzgxQ1x1RDU1OFx1QUNFMCBcdUMwQzhcdUI4NUMgXHVDMkRDXHVDNzkxXHVENTU4XHVDMkRDXHVBQ0EwXHVDNUI0XHVDNjk0PycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpdGxlKCcnKTsgc2V0UHJlZml4KCcnKTsgc2V0VGFncyhbXSk7IHNldEltYWdlcyhbXSk7XG4gICAgICAgICAgICAgICAgICAgIHNldEJvZHlIdG1sKCcnKTsgc2V0Qm9keVRleHQoJycpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhckRyYWZ0KCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRTaXplOjExLCBjb2xvcjondmFyKC0tZGFuZ2VyKScsIHRleHREZWNvcmF0aW9uOid1bmRlcmxpbmUnfX0+XG4gICAgICAgICAgICAgICAgXHVDMEM4XHVCODVDIFx1QzJEQ1x1Qzc5MVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvaGVhZGVyPlxuXG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXsoZSkgPT4geyBlLnByZXZlbnREZWZhdWx0KCk7IHN1Ym1pdCgpOyB9fSBub1ZhbGlkYXRlPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczonMTYwcHggMWZyJywgZ2FwOjE2LCBtYXJnaW5Cb3R0b206IGJvYXJkUHJlZml4ZXMubGVuZ3RoID4gMCA/IDEyIDogMjB9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIiBzdHlsZT17e21hcmdpbjowfX0+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbFwiIGh0bWxGb3I9XCJwb3N0LWNhdFwiPlx1QUM4Q1x1QzJEQ1x1RDMxMDwvbGFiZWw+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJwb3N0LWNhdFwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17Y2F0ZWdvcnlJZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRDYXRlZ29yeUlkKGUudGFyZ2V0LnZhbHVlKX0+XG4gICAgICAgICAgICAgICAge3dyaXRhYmxlLm1hcChjID0+IChcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtjLmlkfSB2YWx1ZT17Yy5pZH0+e2MubGFiZWx9PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCIgc3R5bGU9e3ttYXJnaW46MH19PlxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIiBodG1sRm9yPVwicG9zdC10aXRsZVwiPlx1QzgxQ1x1QkFBOSA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+Kjwvc3Bhbj48L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJwb3N0LXRpdGxlXCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiXHVDODFDXHVCQUE5XHVDNzQ0IFx1Qzc4NVx1QjgyNVx1RDU1OFx1QzEzOFx1QzY5NFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3RpdGxlfSBvbkNoYW5nZT17ZSA9PiBzZXRUaXRsZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcmVxdWlyZWQgbWF4TGVuZ3RoPXsxMjB9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFx1QjlEMFx1QkEzOFx1QjlBQyBcdUMxMjBcdUQwREQgXHUyMDE0IFx1QzEyMFx1RDBERFx1QjQxQyBcdUFDOENcdUMyRENcdUQzMTBcdUM1RDAgXHVCOUQwXHVCQTM4XHVCOUFDXHVBQzAwIFx1Qzc4OFx1Qzc0NCBcdUI1NENcdUI5Q0MgXHVENDVDXHVDMkRDICovfVxuICAgICAgICAgIHtib2FyZFByZWZpeGVzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiIHN0eWxlPXt7bWFyZ2luQm90dG9tOjIwfX0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIj5cdUI5RDBcdUJBMzhcdUI5QUM8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6OCwgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFByZWZpeChcIlwiKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cGFkZGluZzonNHB4IDE0cHgnLCBib3JkZXI6JzFweCBzb2xpZCcsIGJvcmRlckNvbG9yOiBwcmVmaXggPT09IFwiXCIgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWxpbmUpJywgY29sb3I6IHByZWZpeCA9PT0gXCJcIiA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0taW5rLTIpJywgYmFja2dyb3VuZDonbm9uZScsIGN1cnNvcjoncG9pbnRlcicsIGZvbnRTaXplOjEzLCBsZXR0ZXJTcGFjaW5nOicwLjA1ZW0nfX0+XG4gICAgICAgICAgICAgICAgICBcdUM1QzZcdUM3NENcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICB7Ym9hcmRQcmVmaXhlcy5tYXAoKHApID0+IChcbiAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtwfSB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UHJlZml4KHApfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3BhZGRpbmc6JzRweCAxNHB4JywgYm9yZGVyOicxcHggc29saWQnLCBib3JkZXJDb2xvcjogcHJlZml4ID09PSBwID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lKScsIGNvbG9yOiBwcmVmaXggPT09IHAgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsIGJhY2tncm91bmQ6IHByZWZpeCA9PT0gcCA/ICdyZ2JhKDI0NSwyMTMsNzIsMC4wOCknIDogJ25vbmUnLCBjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMywgbGV0dGVyU3BhY2luZzonMC4wNWVtJ319PlxuICAgICAgICAgICAgICAgICAgICB7cH1cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7LyogSGFzaHRhZ3MgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbFwiPlx1RDU3NFx1QzJEQ1x1RDBEQ1x1QURGOCAvIFx1QkE1NFx1RDBDMFx1RDBEQ1x1QURGODwvZGl2PlxuICAgICAgICAgICAgPEhhc2h0YWdJbnB1dCB0YWdzPXt0YWdzfSBzZXRUYWdzPXtzZXRUYWdzfS8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogVGlwdGFwIGVkaXRvciAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbFwiPlx1QkNGOFx1QkIzOCA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+Kjwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgPFRpcHRhcEVkaXRvciBrZXk9e2luaXRpYWxQb3N0Py5pZCB8fCBcIm5ld1wifVxuICAgICAgICAgICAgICAgIHByZXNldD1cInNpbXBsZVwiXG4gICAgICAgICAgICAgICAgY29udGVudD17Ym9keUh0bWx9XG4gICAgICAgICAgICAgICAgb25VcGRhdGU9eyhodG1sLCBfanNvbiwgdGV4dCkgPT4geyBzZXRCb2R5SHRtbChodG1sKTsgc2V0Qm9keVRleHQodGV4dCk7IH19XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJcdUJDRjhcdUJCMzhcdUM3NDQgXHVDNzg1XHVCODI1XHVENTU4XHVDMTM4XHVDNjk0Li4uXCIvPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogSW1hZ2UgYXR0YWNobWVudHMgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgPEltYWdlQXR0YWNoZXIgaW1hZ2VzPXtpbWFnZXN9IHNldEltYWdlcz17c2V0SW1hZ2VzfSBtYXg9ezEwfS8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogRmlsZSBhdHRhY2htZW50cyAodjAwLjA2OSkgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgPEZpbGVBdHRhY2hlciBmaWxlcz17YXR0YWNobWVudHN9IHNldEZpbGVzPXtzZXRBdHRhY2htZW50c30vPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAge2Vycm9yICYmIChcbiAgICAgICAgICAgIDxkaXYgcm9sZT1cImFsZXJ0XCIgc3R5bGU9e3twYWRkaW5nOicxMnB4IDE2cHgnLCBiYWNrZ3JvdW5kOidyZ2JhKDE5NCw3NCw2MSwwLjEpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tZGFuZ2VyKScsIGNvbG9yOid2YXIoLS1kYW5nZXIpJywgZm9udFNpemU6MTMsIG1hcmdpbkJvdHRvbToxNn19PlxuICAgICAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTIsIGp1c3RpZnlDb250ZW50OidmbGV4LWVuZCcsIHBhZGRpbmdUb3A6MjAsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJ319PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17b25DYW5jZWx9Plx1Q0RFOFx1QzE4QzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkXCI+e2lzRWRpdGluZyA/IFwiXHVDMjE4XHVDODE1IFx1QzgwMFx1QzdBNSBcdTIxOTJcIiA6IFwiXHVBQzhDXHVDMkRDXHVENTU4XHVBRTMwIFx1MjE5MlwifTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Zvcm0+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PSBQb3N0IERldGFpbCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IFBvc3REZXRhaWwgPSAoeyBwb3N0LCBnbywgc2V0UG9zdElkLCB1c2VyLCBvblJlZnJlc2gsIG9uRWRpdCB9KSA9PiB7XG4gIGNvbnN0IEcgPSB3aW5kb3cuQkdOSl9HVUFSRDtcbiAgY29uc3QgW2NvbW1lbnQsIHNldENvbW1lbnRdID0gUmVhY3QudXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtjb21tZW50c0xpc3QsIHNldENvbW1lbnRzTGlzdF0gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiBHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LmdldENvbW1lbnRzPy4ocG9zdC5pZCkpKTtcbiAgY29uc3QgW3JlcG9ydE9wZW4sIHNldFJlcG9ydE9wZW5dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbcmVwb3J0UmVhc29uLCBzZXRSZXBvcnRSZWFzb25dID0gUmVhY3QudXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtyZXBvcnRTdWJtaXR0ZWQsIHNldFJlcG9ydFN1Ym1pdHRlZF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IGNhbk1hbmFnZVBvc3QgPSAhIXVzZXIgJiYgKHVzZXIuaXNBZG1pbiB8fCBwb3N0LmF1dGhvcklkID09PSB1c2VyLmlkIHx8IHBvc3QuYXV0aG9yID09PSB1c2VyLm5hbWUpO1xuXG4gIC8vIFx1Qzg4Qlx1QzU0NFx1QzY5NCAvIFx1QkQ4MVx1QjlDOFx1RDA2QyBcdTIwMTQgXHVDODAwXHVDN0E1XHVDMThDIFx1QUUzMFx1QkMxOFxuICBjb25zdCBsaWtlcyA9IEFycmF5LmlzQXJyYXkocG9zdC5saWtlcykgPyBwb3N0Lmxpa2VzIDogW107XG4gIGNvbnN0IGxpa2VkID0gISF1c2VyICYmIGxpa2VzLmluY2x1ZGVzKHVzZXIuaWQpO1xuICBjb25zdCBsaWtlc0NvdW50ID0gbGlrZXMubGVuZ3RoO1xuICBjb25zdCBib29rbWFya2VkID0gISF1c2VyICYmIEcuY2FsbCgoKSA9PiB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LmlzQm9va21hcmtlZD8uKHVzZXIuaWQsIHBvc3QuaWQpLCBmYWxzZSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRDb21tZW50c0xpc3QoRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5nZXRDb21tZW50cz8uKHBvc3QuaWQpKSk7XG4gICAgLy8gXHVDMTFDXHVCQzg0IFx1QUM4Q1x1QzJEQ1x1QUUwMFx1Qzc3NFx1QkE3NCBcdUMxMUNcdUJDODRcdUM1RDBcdUMxMUMgXHVCMzEzXHVBRTAwIFx1QjNEOVx1QUUzMFx1RDY1NFxuICAgIGlmIChwb3N0Ll9yZW1vdGUpIHtcbiAgICAgIHdpbmRvdy5CR05KX0NPTU1VTklUWT8ucmVmcmVzaENvbW1lbnRzPy4ocG9zdC5pZCk/LnRoZW4/LigoKSA9PiB7XG4gICAgICAgIHNldENvbW1lbnRzTGlzdChHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LmdldENvbW1lbnRzPy4ocG9zdC5pZCkpKTtcbiAgICAgIH0pPy5jYXRjaD8uKCgpID0+IHt9KTtcbiAgICB9XG4gICAgY29uc3Qgb25SZWZyZXNoQ29tbWVudHMgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUuZGV0YWlsICYmIFN0cmluZyhlLmRldGFpbC5wb3N0SWQpID09PSBTdHJpbmcocG9zdC5pZCkpIHtcbiAgICAgICAgc2V0Q29tbWVudHNMaXN0KHdpbmRvdy5CR05KX0NPTU1VTklUWS5nZXRDb21tZW50cyhwb3N0LmlkKSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1jb21tZW50cy1yZWZyZXNoJywgb25SZWZyZXNoQ29tbWVudHMpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmduai1jb21tZW50cy1yZWZyZXNoJywgb25SZWZyZXNoQ29tbWVudHMpO1xuICB9LCBbcG9zdC5pZF0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qga2V5ID0gYGJnbmpfdmlld2VkX3Bvc3RfJHtwb3N0LmlkfWA7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSkpIHJldHVybjtcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oa2V5LCBcIjFcIik7XG4gICAgfSBjYXRjaCB7fVxuICAgIHdpbmRvdy5CR05KX0NPTU1VTklUWS5pbmNyZW1lbnRWaWV3cyhwb3N0LmlkKTtcbiAgICBvblJlZnJlc2g/LigpO1xuICB9LCBbcG9zdC5pZF0pO1xuXG4gIGNvbnN0IHJlcXVpcmVMb2dpbiA9IChsYWJlbCkgPT4ge1xuICAgIGlmIChjb25maXJtKGAke2xhYmVsfVx1Qzc0MChcdUIyOTQpIFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUQ2QzQgXHVDNzc0XHVDNkE5XHVENTYwIFx1QzIxOCBcdUM3ODhcdUMyQjVcdUIyQzhcdUIyRTQuIFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUQzOThcdUM3NzRcdUM5QzBcdUI4NUMgXHVDNzc0XHVCM0Q5XHVENTU4XHVDMkRDXHVBQ0EwXHVDNUI0XHVDNjk0P2ApKSB7XG4gICAgICBnbygnbG9naW4nKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlTGlrZSA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoIXVzZXIpIHJldHVybiByZXF1aXJlTG9naW4oJ1x1QUNGNVx1QUMxMCcpO1xuICAgIHRyeSB7IGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWS50b2dnbGVMaWtlKHBvc3QuaWQsIHVzZXIuaWQpOyBvblJlZnJlc2g/LigpOyB9XG4gICAgY2F0Y2ggKGVycikgeyBhbGVydChgXHVBQ0Y1XHVBQzEwIFx1Q0M5OFx1QjlBQyBcdUMyRTRcdUQzMjg6ICR7ZXJyPy5tZXNzYWdlIHx8ICdcdUM1NEMgXHVDMjE4IFx1QzVDNlx1QjI5NCBcdUM2MjRcdUI5NTgnfWApOyB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQm9va21hcmsgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCF1c2VyKSByZXR1cm4gcmVxdWlyZUxvZ2luKCdcdUJEODFcdUI5QzhcdUQwNkMnKTtcbiAgICB0cnkgeyBhd2FpdCB3aW5kb3cuQkdOSl9DT01NVU5JVFkudG9nZ2xlQm9va21hcmsodXNlci5pZCwgcG9zdC5pZCk7IG9uUmVmcmVzaD8uKCk7IH1cbiAgICBjYXRjaCAoZXJyKSB7IGFsZXJ0KGBcdUJEODFcdUI5QzhcdUQwNkMgXHVDQzk4XHVCOUFDIFx1QzJFNFx1RDMyODogJHtlcnI/Lm1lc3NhZ2UgfHwgJ1x1QzU0QyBcdUMyMTggXHVDNUM2XHVCMjk0IFx1QzYyNFx1Qjk1OCd9YCk7IH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVSZXBvcnRTdWJtaXQgPSBhc3luYyAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgd2luZG93LkJHTkpfQ09NTVVOSVRZLmFkZFJlcG9ydCh7XG4gICAgICAgIHBvc3RJZDogcG9zdC5pZCxcbiAgICAgICAgcG9zdFRpdGxlOiBwb3N0LnRpdGxlLFxuICAgICAgICByZXBvcnRlcklkOiB1c2VyPy5pZCB8fCBudWxsLFxuICAgICAgICByZXBvcnRlck5hbWU6IHVzZXI/Lm5hbWUgfHwgJ1x1Qzc3NVx1QkE4NScsXG4gICAgICAgIHJlYXNvbjogcmVwb3J0UmVhc29uLFxuICAgICAgfSk7XG4gICAgICBzZXRSZXBvcnRTdWJtaXR0ZWQodHJ1ZSk7XG4gICAgICBzZXRSZXBvcnRSZWFzb24oXCJcIik7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgc2V0UmVwb3J0T3BlbihmYWxzZSk7IHNldFJlcG9ydFN1Ym1pdHRlZChmYWxzZSk7IH0sIDE4MDApO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgYWxlcnQoYFx1QzJFMFx1QUNFMCBcdUM4MTFcdUMyMTggXHVDMkU0XHVEMzI4OiAke2Vycj8ubWVzc2FnZSB8fCAnXHVDNTRDIFx1QzIxOCBcdUM1QzZcdUIyOTQgXHVDNjI0XHVCOTU4J31gKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc3VibWl0Q29tbWVudCA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICghdXNlcikgcmV0dXJuO1xuICAgIGNvbnN0IHRyaW1tZWQgPSBjb21tZW50LnRyaW0oKTtcbiAgICBpZiAoIXRyaW1tZWQpIHJldHVybjtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCBuZXh0ID0gd2luZG93LkJHTkpfQ09NTVVOSVRZLmFkZENvbW1lbnQocG9zdC5pZCwge1xuICAgICAgaWQ6IGBjb21tZW50LSR7RGF0ZS5ub3coKX1gLFxuICAgICAgYXV0aG9yOiB1c2VyLm5hbWUsXG4gICAgICBhdXRob3JJZDogdXNlci5pZCxcbiAgICAgIGF1dGhvckVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgZGF0ZTogYCR7bm93LmdldEZ1bGxZZWFyKCl9LiR7cGFkKG5vdy5nZXRNb250aCgpKzEpfS4ke3BhZChub3cuZ2V0RGF0ZSgpKX0gJHtwYWQobm93LmdldEhvdXJzKCkpfToke3BhZChub3cuZ2V0TWludXRlcygpKX1gLFxuICAgICAgdGV4dDogdHJpbW1lZCxcbiAgICB9KTtcbiAgICBzZXRDb21tZW50c0xpc3QobmV4dCk7XG5cbiAgICAvLyBcdUJDRjhcdUM3NzggXHVBRTAwXHVDNzc0IFx1QzU0NFx1QjJDOFx1QkE3NCBcdUM3OTFcdUMxMzFcdUM3OTBcdUM1RDBcdUFDOEMgXHVDNTRDXHVCOUJDLiBhdXRob3JJZFx1QUMwMCBcdUM3ODhcdUM1QjRcdUM1N0MgXHVENDc4XHVDMkRDIFx1QUMwMFx1QjJBNS5cbiAgICBjb25zdCBpc015T3duUG9zdCA9IHBvc3QuYXV0aG9ySWQgPT09IHVzZXIuaWQgfHwgcG9zdC5hdXRob3IgPT09IHVzZXIubmFtZTtcbiAgICBpZiAoIWlzTXlPd25Qb3N0ICYmIHBvc3QuYXV0aG9ySWQpIHtcbiAgICAgIHdpbmRvdy5CR05KX0NPTU1VTklUWS5hZGROb3RpZmljYXRpb24ocG9zdC5hdXRob3JJZCwge1xuICAgICAgICB0eXBlOiAnY29tbWVudCcsXG4gICAgICAgIHBvc3RJZDogcG9zdC5pZCxcbiAgICAgICAgcG9zdFRpdGxlOiBwb3N0LnRpdGxlLFxuICAgICAgICBmcm9tTmFtZTogdXNlci5uYW1lLFxuICAgICAgICBtZXNzYWdlOiAnXHVCMEI0IFx1QUUwMFx1QzVEMCBcdUMwQzggXHVCMzEzXHVBRTAwXHVDNzc0IFx1QjJFQ1x1QjgzOFx1QzJCNVx1QjJDOFx1QjJFNC4nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25SZWZyZXNoPy4oKTtcbiAgICBzZXRDb21tZW50KFwiXCIpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVBvc3QgPSAoKSA9PiB7XG4gICAgaWYgKCFjb25maXJtKGBcIiR7cG9zdC50aXRsZX1cIiBcdUFFMDBcdUM3NDQgXHVDMEFEXHVDODFDXHVENTU4XHVDMkRDXHVBQ0EwXHVDNUI0XHVDNjk0P2ApKSByZXR1cm47XG4gICAgd2luZG93LkJHTkpfQ09NTVVOSVRZLmRlbGV0ZVBvc3QocG9zdC5pZCk7XG4gICAgb25SZWZyZXNoPy4oKTtcbiAgICBzZXRQb3N0SWQobnVsbCk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlQ29tbWVudCA9IChjb21tZW50SWQpID0+IHtcbiAgICBjb25zdCBuZXh0ID0gd2luZG93LkJHTkpfQ09NTVVOSVRZLmRlbGV0ZUNvbW1lbnQocG9zdC5pZCwgY29tbWVudElkKTtcbiAgICBzZXRDb21tZW50c0xpc3QobmV4dCk7XG4gICAgb25SZWZyZXNoPy4oKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxhcnRpY2xlIGNsYXNzTmFtZT1cInNlY3Rpb24gcG9zdC1yZWFkXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBwb3N0LXJlYWQtY29udGFpbmVyXCI+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IHNldFBvc3RJZChudWxsKX1cbiAgICAgICAgICBzdHlsZT17e21hcmdpbkJvdHRvbTozMiwgY29sb3I6J3ZhcigtLWluay0yKScsIGZvbnRTaXplOjEyLCBsZXR0ZXJTcGFjaW5nOicwLjFlbSd9fT5cbiAgICAgICAgICBcdTIxOTAgXHVCQUE5XHVCODVEXHVDNzNDXHVCODVDXG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIDxoZWFkZXIgc3R5bGU9e3tib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgcGFkZGluZ0JvdHRvbTozMiwgbWFyZ2luQm90dG9tOjQ4fX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTIsIG1hcmdpbkJvdHRvbToyMCwgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZSBiYWRnZS1nb2xkXCI+e3Bvc3QuY2F0ZWdvcnl9PC9zcGFuPlxuICAgICAgICAgICAge3Bvc3QuaG90ICYmIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCI+SE9UPC9zcGFuPn1cbiAgICAgICAgICAgIHtwb3N0Ll91c2VyQ3JlYXRlZCAmJiA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZSBiYWRnZS1nb2xkXCI+XHVDMEM4IFx1QUUwMDwvc3Bhbj59XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInBvc3QtdGl0bGVcIiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1kaXNwbGF5KScsXG4gICAgICAgICAgICBmb250U2l6ZTonY2xhbXAoMjhweCwgMy41dncsIDQ0cHgpJyxcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6NTAwLCBsaW5lSGVpZ2h0OjEuMjUsIGxldHRlclNwYWNpbmc6Jy0wLjAxZW0nLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOjI0LCB0ZXh0V3JhcDonYmFsYW5jZSdcbiAgICAgICAgICB9fT57cG9zdC50aXRsZX08L2gxPlxuXG4gICAgICAgICAge3Bvc3QudGFncz8ubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo2LCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbToxNn19PlxuICAgICAgICAgICAgICB7cG9zdC50YWdzLm1hcCh0ID0+IDxzcGFuIGtleT17dH0gY2xhc3NOYW1lPVwidGFnLWNoaXBcIj4je3R9PC9zcGFuPil9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MjQsIGFsaWduSXRlbXM6J2NlbnRlcicsIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBmb250U2l6ZToxMiwgY29sb3I6J3ZhcigtLWluay0zKScsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIHN0eWxlPXt7ZGlzcGxheTonaW5saW5lLWZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XG4gICAgICAgICAgICAgIHtwb3N0LmF1dGhvcn1cbiAgICAgICAgICAgICAgPEF1dGhvckdyYWRlQmFkZ2UgYXV0aG9ySWQ9e3Bvc3QuYXV0aG9ySWR9IGF1dGhvcj17cG9zdC5hdXRob3J9IGF1dGhvckVtYWlsPXtwb3N0LmF1dGhvckVtYWlsfS8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8dGltZSBkYXRlVGltZT17cG9zdC5kYXRlLnJlcGxhY2UoL1xcLi9nLCctJyl9Pntwb3N0LmRhdGV9PC90aW1lPlxuICAgICAgICAgICAgPHNwYW4+XHVDODcwXHVENjhDIHtwb3N0LnZpZXdzID8/IDB9PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+XHVCMzEzXHVBRTAwIHtjb21tZW50c0xpc3QubGVuZ3RofTwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuPlx1QUNGNVx1QUMxMCB7bGlrZXNDb3VudH08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvaGVhZGVyPlxuXG4gICAgICAgIHtwb3N0LmJvZHk/Lmh0bWwgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwb3N0LWJvZHlcIiBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogcG9zdC5ib2R5Lmh0bWx9fS8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwb3N0LWJvZHlcIj5cbiAgICAgICAgICAgIDxwPlx1QzVCNFx1QzgxQyBcdUNDM0RcdUIzNTVcdUFEODEgXHVENkM0XHVDNkQwIFx1QzU3Q1x1QUMwNCBcdUIyRjVcdUMwQUNcdUI5N0MgXHVCMkU0XHVCMTQwXHVDNjU0XHVDMkI1XHVCMkM4XHVCMkU0LiBcdUM2RDBcdUI3OTggXHVCMEFFXHVDNUQwXHVCOUNDIFx1QUMwMFx1QkQyNFx1QjM1OCBcdUFDRjNcdUM3NzRcdUM1QjRcdUMxMUMsIFx1RDU3NFx1QUMwMCBcdUI1QThcdUM1QjRcdUM5QzQgXHVENkM0XHVDNzU4IFx1QUNGNVx1QUMwNFx1Qzc3NCBcdUM1QjRcdUI1QkJcdUFDOEMgXHVCMkU0XHVCOTc0XHVBQzhDIFx1QjJFNFx1QUMwMFx1QzYyQ1x1QzlDMCBcdUJDMThcdUMyRTBcdUJDMThcdUM3NThcdUQ1ODhcdUIyOTRcdUIzNzBcdUM2OTQuPC9wPlxuICAgICAgICAgICAgPHA+XHVBRDAwXHVCNzhDXHVDODE1IFx1QzU1RVx1QzVEMCBcdUMxMzBcdUM3NDQgXHVCNTRDLCBcdUJCMzhcdUI0REQgXHVDNjU1XHVDNzc0IFx1Qzc3NCBcdUM3OTBcdUI5QUNcdUM1RDBcdUMxMUMgXHVCQjM0XHVDNUM3XHVDNzQ0IFx1QkNGNFx1QzU1OFx1Qzc0NFx1QUU0QyBcdTIwMTQgXHVCNzdDXHVCMjk0IFx1QzlDOFx1QkIzOFx1Qzc3NCBcdUI1QTBcdUM2MkNcdUI3OTBcdUMyQjVcdUIyQzhcdUIyRTQuPC9wPlxuICAgICAgICAgICAgPGJsb2NrcXVvdGU+XG4gICAgICAgICAgICAgIDxwPlwiXHVDNjU1XHVDNzU4IFx1Qzc5MFx1QjlBQ1x1QUMwMCBcdUM1NDRcdUIyQzhcdUI3N0MgXHVDNjU1XHVDNzc0IFx1QkMxNFx1Qjc3Q1x1QkNGOCBcdUFFMzhcdUM3NDQgXHVCNTMwXHVCNzdDXHVBQzAwXHVCNzdDLlwiPC9wPlxuICAgICAgICAgICAgICA8Y2l0ZT5cdTIwMTQgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwLCBcdTMwMEVcdUM2NTVcdUM3NThcdUFFMzhcdTMwMEYgXHVDMTFDXHVCQjM4PC9jaXRlPlxuICAgICAgICAgICAgPC9ibG9ja3F1b3RlPlxuICAgICAgICAgICAgPHA+XHVCMkU0XHVDNzRDIFx1QjJGNVx1QzBBQ1x1QUMwMCBcdUJDOENcdUMzNjggXHVBRTMwXHVCMkU0XHVCODI0XHVDOUQxXHVCMkM4XHVCMkU0LjwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogSW1hZ2Ugc2xpZGVyIGF0IGJvdHRvbSBvZiBwb3N0ICovfVxuICAgICAgICB7cG9zdC5pbWFnZXM/Lmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIDxzZWN0aW9uIGFyaWEtbGFiZWw9XCJcdUNDQThcdUJEODAgXHVDNzc0XHVCQkY4XHVDOUMwXCIgc3R5bGU9e3ttYXJnaW46JzQ4cHggMCd9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3ttYXJnaW5Cb3R0b206MTZ9fT5BVFRBQ0hNRU5UUyBcdTAwQjcgXHVDQ0E4XHVCRDgwIFx1Qzc3NFx1QkJGOFx1QzlDMCAoe3Bvc3QuaW1hZ2VzLmxlbmd0aH1cdUM3QTUpPC9kaXY+XG4gICAgICAgICAgICA8SW1hZ2VTbGlkZXIgaW1hZ2VzPXtwb3N0LmltYWdlc30vPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogRmlsZSBhdHRhY2htZW50cyAodjAwLjA2OSkgKi99XG4gICAgICAgIHtwb3N0LmF0dGFjaG1lbnRzPy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8c2VjdGlvbiBhcmlhLWxhYmVsPVwiXHVDQ0E4XHVCRDgwIFx1RDMwQ1x1Qzc3Q1wiIHN0eWxlPXt7bWFyZ2luOic0MHB4IDAnfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tZXllYnJvd1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7bWFyZ2luQm90dG9tOjE0fX0+RklMRVMgXHUwMEI3IFx1Q0NBOFx1QkQ4MCBcdUQzMENcdUM3N0MgKHtwb3N0LmF0dGFjaG1lbnRzLmxlbmd0aH0pPC9kaXY+XG4gICAgICAgICAgICA8dWwgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBwYWRkaW5nOjAsIG1hcmdpbjowLCBkaXNwbGF5OidmbGV4JywgZmxleERpcmVjdGlvbjonY29sdW1uJywgZ2FwOjh9fT5cbiAgICAgICAgICAgICAge3Bvc3QuYXR0YWNobWVudHMubWFwKChhLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGxpIGtleT17aX0gc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJywgZ2FwOjEyLCBwYWRkaW5nOicxMHB4IDE0cHgnLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgZm9udFNpemU6MTN9fT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlx1RDgzRFx1RENDRTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7ZmxleDoxLCBjb2xvcjondmFyKC0taW5rKSd9fT57YS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjExfX0+e19mbXRTaXplKGEuc2l6ZSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj17YS5kYXRhVXJsfSBkb3dubG9hZD17YS5uYW1lfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgcGFkZGluZzonNHB4IDEwcHgnfX1cbiAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YCR7YS5uYW1lfSBcdUIyRTRcdUM2QjRcdUI4NUNcdUI0RENgfT5cdUIyRTRcdUM2QjRcdUI4NUNcdUI0REM8L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogQWN0aW9ucyAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpbjonNjBweCAwJywgcGFkZGluZ1RvcDozMiwgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTIsIGp1c3RpZnlDb250ZW50OidjZW50ZXInLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIGFyaWEtcHJlc3NlZD17bGlrZWR9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUxpa2V9XG4gICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6IGxpa2VkID8gJ3ZhcigtLWdvbGQpJyA6IHVuZGVmaW5lZCwgY29sb3I6IGxpa2VkID8gJ3ZhcigtLWdvbGQpJyA6IHVuZGVmaW5lZH19PlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj5cdTI2NjU8L3NwYW4+IFx1QUNGNVx1QUMxMCA8c3BhbiBhcmlhLWxpdmU9XCJwb2xpdGVcIj57bGlrZXNDb3VudH08L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIGFyaWEtcHJlc3NlZD17Ym9va21hcmtlZH1cbiAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQm9va21hcmt9XG4gICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6IGJvb2ttYXJrZWQgPyAndmFyKC0tZ29sZCknIDogdW5kZWZpbmVkLCBjb2xvcjogYm9va21hcmtlZCA/ICd2YXIoLS1nb2xkKScgOiB1bmRlZmluZWR9fT5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+e2Jvb2ttYXJrZWQgPyAnXHUyNjA1JyA6ICdcdTI2MDYnfTwvc3Bhbj4gXHVCRDgxXHVCOUM4XHVEMDZDXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXVzZXIpIHJldHVybiByZXF1aXJlTG9naW4oJ1x1QzJFMFx1QUNFMCcpO1xuICAgICAgICAgICAgICAgIHNldFJlcG9ydE9wZW4oKHYpID0+ICF2KTtcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIFx1QzJFMFx1QUNFMFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICB7Y2FuTWFuYWdlUG9zdCAmJiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17KCkgPT4gb25FZGl0KHBvc3QpfT5cdUMyMThcdUM4MTU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXtkZWxldGVQb3N0fVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXJDb2xvcjondmFyKC0tZGFuZ2VyKScsIGNvbG9yOid2YXIoLS1kYW5nZXIpJ319Plx1QzBBRFx1QzgxQzwvYnV0dG9uPlxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7cmVwb3J0T3BlbiAmJiAoXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlUmVwb3J0U3VibWl0fVxuICAgICAgICAgICAgICBzdHlsZT17e21heFdpZHRoOjU2MCwgbWFyZ2luOicyNHB4IGF1dG8gMCcsIHBhZGRpbmc6MjAsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgYmFja2dyb3VuZDoncmdiYSgxOTQsNzQsNjEsMC4wNCknfX0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMjJlbScsIG1hcmdpbkJvdHRvbToxMH19PlJFUE9SVCBcdTAwQjcgXHVDMkUwXHVBQ0UwIFx1QzBBQ1x1QzcyMDwvZGl2PlxuICAgICAgICAgICAgICB7cmVwb3J0U3VibWl0dGVkID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIHBhZGRpbmc6JzhweCAwJywgY29sb3I6J3ZhcigtLWdvbGQpJ319PlxuICAgICAgICAgICAgICAgICAgXHVDMkUwXHVBQ0UwXHVBQzAwIFx1QzgxMVx1QzIxOFx1QjQxOFx1QzVDOFx1QzJCNVx1QjJDOFx1QjJFNC4gXHVDNkI0XHVDNjAxXHVDNzkwXHVBQzAwIFx1RDY1NVx1Qzc3OCBcdUQ2QzQgXHVDQzk4XHVCOUFDXHVENTY5XHVCMkM4XHVCMkU0LlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlx1QzVCNFx1QjVBNCBcdUM4MTBcdUM3NzQgXHVCQjM4XHVDODFDXHVDNzc4XHVDOUMwIFx1QUMwNFx1QjJFOFx1RDc4OCBcdUM4MDFcdUM1QjQgXHVDOEZDXHVDMTM4XHVDNjk0LlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZXBvcnRSZWFzb259XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0UmVwb3J0UmVhc29uKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttaW5IZWlnaHQ6ODAsIHJlc2l6ZTondmVydGljYWwnLCBtYXJnaW5Cb3R0b206MTJ9fS8+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidmbGV4LWVuZCcsIGdhcDo4fX0+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiBzZXRSZXBvcnRPcGVuKGZhbHNlKX0+XHVDREU4XHVDMThDPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6J3ZhcigtLWRhbmdlciknLCBjb2xvcjondmFyKC0tZGFuZ2VyKSd9fT5cdUMyRTBcdUFDRTAgXHVDODExXHVDMjE4PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogQ29tbWVudHMgKi99XG4gICAgICAgIDxzZWN0aW9uIGFyaWEtbGFiZWxsZWRieT1cImNvbW1lbnRzLWhlYWRpbmdcIj5cbiAgICAgICAgICA8aDIgaWQ9XCJjb21tZW50cy1oZWFkaW5nXCIgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIyLCBtYXJnaW5Cb3R0b206MjR9fT5cbiAgICAgICAgICAgIFx1QjMxM1x1QUUwMCA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCI+e2NvbW1lbnRzTGlzdC5sZW5ndGh9PC9zcGFuPlxuICAgICAgICAgIDwvaDI+XG5cbiAgICAgICAgICB7dXNlciA/IChcbiAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXtzdWJtaXRDb21tZW50fSBzdHlsZT17e21hcmdpbkJvdHRvbTozMn19PlxuICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImNvbW1lbnQtaW5wdXRcIiBjbGFzc05hbWU9XCJzci1vbmx5XCI+XHVCMzEzXHVBRTAwIFx1Qzc4NVx1QjgyNTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxNZW50aW9uVGV4dGFyZWFcbiAgICAgICAgICAgICAgICB2YWx1ZT17Y29tbWVudH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0Q29tbWVudH1cbiAgICAgICAgICAgICAgICBhdXRob3JzPXsoY29tbWVudHNMaXN0IHx8IFtdKS5tYXAoKGMpID0+IGMuYXV0aG9yKS5jb25jYXQocG9zdC5hdXRob3IpLmZpbHRlcihCb29sZWFuKX1cbiAgICAgICAgICAgICAgICByb3dzPXs0fVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiXHVDMEREXHVBQzAxXHVDNzQ0IFx1QjA5OFx1QjIwNFx1QzVCNCBcdUM4RkNcdUMxMzhcdUM2OTQuLi4gKEBcdUI5N0MgXHVDNzg1XHVCODI1XHVENTU4XHVCQTc0IFx1QkE1OFx1QzE1OCBcdUM3OTBcdUIzRDlcdUM2NDRcdUMxMzEpXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e21pbkhlaWdodDoxMDAsIHJlc2l6ZTondmVydGljYWwnLCBtYXJnaW5Cb3R0b206MTJ9fS8+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTF9fT57dXNlci5uYW1lfShcdUM3M0MpXHVCODVDIFx1QjRGMVx1Qjg1RDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGQgYnRuLXNtYWxsXCIgZGlzYWJsZWQ9eyFjb21tZW50LnRyaW0oKX0+XHVCNEYxXHVCODVEPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17e3BhZGRpbmc6MjQsIHRleHRBbGlnbjonY2VudGVyJywgbWFyZ2luQm90dG9tOjMyLCBiYWNrZ3JvdW5kOidyZ2JhKDI0NSwyMTMsNzIsMC4wNCknfX0+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7Zm9udFNpemU6MTQsIG1hcmdpbkJvdHRvbToxNn19PlxuICAgICAgICAgICAgICAgIFx1QjMxM1x1QUUwMCBcdUM3OTFcdUMxMzFcdUM3NDAgPHN0cm9uZyBjbGFzc05hbWU9XCJnb2xkXCI+XHVCODVDXHVBREY4XHVDNzc4XHVENTVDIFx1RDY4Q1x1QzZEMDwvc3Ryb25nPlx1QjlDQyBcdUFDMDBcdUIyQTVcdUQ1NjlcdUIyQzhcdUIyRTQuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTAsIGp1c3RpZnlDb250ZW50OidjZW50ZXInfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IGdvKCdsb2dpbicpfT5cdUI4NUNcdUFERjhcdUM3Nzg8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gZ28oJ3NpZ251cCcpfT5cdUQ2OENcdUM2RDBcdUFDMDBcdUM3ODU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAgPENvbW1lbnRUcmVlXG4gICAgICAgICAgICBjb21tZW50cz17Y29tbWVudHNMaXN0fVxuICAgICAgICAgICAgdXNlcj17dXNlcn1cbiAgICAgICAgICAgIG9uRGVsZXRlPXtkZWxldGVDb21tZW50fVxuICAgICAgICAgICAgb25SZXBseT17KHBhcmVudElkLCB0ZXh0KSA9PiB7XG4gICAgICAgICAgICAgIGlmICghdXNlciB8fCAhdGV4dC50cmltKCkpIHJldHVybjtcbiAgICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gd2luZG93LkJHTkpfQ09NTVVOSVRZLmFkZENvbW1lbnQocG9zdC5pZCwge1xuICAgICAgICAgICAgICAgIGlkOiBgY29tbWVudC0ke0RhdGUubm93KCl9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiw0KX1gLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdXNlci5uYW1lLFxuICAgICAgICAgICAgICAgIGF1dGhvcklkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgICAgIGRhdGU6IGAke25vdy5nZXRGdWxsWWVhcigpfS4ke3BhZChub3cuZ2V0TW9udGgoKSsxKX0uJHtwYWQobm93LmdldERhdGUoKSl9ICR7cGFkKG5vdy5nZXRIb3VycygpKX06JHtwYWQobm93LmdldE1pbnV0ZXMoKSl9YCxcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LnRyaW0oKSxcbiAgICAgICAgICAgICAgICBwYXJlbnRJZCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHNldENvbW1lbnRzTGlzdChuZXh0KTtcbiAgICAgICAgICAgICAgY29uc3QgaXNNeU93blBvc3QgPSBwb3N0LmF1dGhvcklkID09PSB1c2VyLmlkIHx8IHBvc3QuYXV0aG9yID09PSB1c2VyLm5hbWU7XG4gICAgICAgICAgICAgIGlmICghaXNNeU93blBvc3QgJiYgcG9zdC5hdXRob3JJZCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5CR05KX0NPTU1VTklUWS5hZGROb3RpZmljYXRpb24ocG9zdC5hdXRob3JJZCwge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbW1lbnQnLFxuICAgICAgICAgICAgICAgICAgcG9zdElkOiBwb3N0LmlkLFxuICAgICAgICAgICAgICAgICAgcG9zdFRpdGxlOiBwb3N0LnRpdGxlLFxuICAgICAgICAgICAgICAgICAgZnJvbU5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdcdUIwQjQgXHVBRTAwXHVDNUQwIFx1QzBDOCBcdUIyRjVcdUFFMDBcdUM3NzQgXHVCMkVDXHVCODM4XHVDMkI1XHVCMkM4XHVCMkU0LicsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25SZWZyZXNoPy4oKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9hcnRpY2xlPlxuICApO1xufTtcblxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHsgQ29tbXVuaXR5UGFnZSwgSW1hZ2VTbGlkZXIsIEhhc2h0YWdJbnB1dCwgSW1hZ2VBdHRhY2hlciwgQ29tbWVudFRyZWUgfSk7XG4iXSwK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

})();

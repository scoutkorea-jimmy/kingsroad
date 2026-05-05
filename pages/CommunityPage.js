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
    const isAdmin = !!((user == null ? void 0 : user.isAdmin) || (user == null ? void 0 : user.gradeId) === "admin");
    const writable = categories.filter((c) => {
      var _a, _b;
      if (c.id === "notice" && !isAdmin) return false;
      if (c.allowWrite === false && !isAdmin) return false;
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
  } }, post.title), ((_a = post.tags) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 } }, post.tags.map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "tag-chip" }, "#", t))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "gold", style: { display: "inline-flex", alignItems: "center" } }, post.author, /* @__PURE__ */ React.createElement(AuthorGradeBadge, { authorId: post.authorId, author: post.author, authorEmail: post.authorEmail })), /* @__PURE__ */ React.createElement("time", { dateTime: post.date.replace(/\./g, "-") }, post.date), /* @__PURE__ */ React.createElement("span", null, "\uC870\uD68C ", (_b = post.views) != null ? _b : 0), /* @__PURE__ */ React.createElement("span", null, "\uB313\uAE00 ", commentsList.length), /* @__PURE__ */ React.createElement("span", null, "\uACF5\uAC10 ", likesCount))), ((_c = post.body) == null ? void 0 : _c.html) ? /* @__PURE__ */ React.createElement("div", { className: "post-body", dangerouslySetInnerHTML: { __html: window.BGNJ_SAFE_HTML(post.body.html) } }) : ((_d = post.body) == null ? void 0 : _d.text) ? /* @__PURE__ */ React.createElement("div", { className: "post-body", style: { whiteSpace: "pre-wrap" } }, post.body.text) : /* @__PURE__ */ React.createElement("div", { className: "post-body dim-2", style: { fontStyle: "italic" } }, "\uBCF8\uBB38\uC774 \uBE44\uC5B4\uC788\uC2B5\uB2C8\uB2E4."), ((_e = post.images) == null ? void 0 : _e.length) > 0 && /* @__PURE__ */ React.createElement("section", { "aria-label": "\uCCA8\uBD80 \uC774\uBBF8\uC9C0", style: { margin: "48px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true", style: { marginBottom: 16 } }, "ATTACHMENTS \xB7 \uCCA8\uBD80 \uC774\uBBF8\uC9C0 (", post.images.length, "\uC7A5)"), /* @__PURE__ */ React.createElement(ImageSlider, { images: post.images })), ((_f = post.attachments) == null ? void 0 : _f.length) > 0 && /* @__PURE__ */ React.createElement("section", { "aria-label": "\uCCA8\uBD80 \uD30C\uC77C", style: { margin: "40px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true", style: { marginBottom: 14 } }, "FILES \xB7 \uCCA8\uBD80 \uD30C\uC77C (", post.attachments.length, ")"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 } }, post.attachments.map((a, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: "1px solid var(--line)", background: "var(--bg-2)", fontSize: 13 } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u{1F4CE}"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, color: "var(--ink)" } }, a.name), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, _fmtSize(a.size)), /* @__PURE__ */ React.createElement(
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFnZXMvQ29tbXVuaXR5UGFnZS5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMDogXHVCQUE5XHVCODVEICsgXHVBRTAwIFx1QzBDMVx1QzEzOCArIFx1QUUwMCBcdUM3OTFcdUMxMzEgKFRpcHRhcClcbi8vIFx1QjRGMVx1QUUwOVx1QkNDNCBcdUM4MTFcdUFERkMgXHVDODFDXHVDNUI0OiBcdUM3N0RcdUFFMzAvXHVDNEYwXHVBRTMwIFx1QUQ4Q1x1RDU1Q1x1Qzc0MCBcdUNFNzRcdUQxNENcdUFDRTBcdUI5QUMubWluTGV2ZWwgLyBwb3N0TWluTGV2ZWxcdUI4NUMgXHVEMzEwXHVDODE1LlxuXG4vLyBcdUFDRjVcdUM2QTkgXHVENkM1IFx1MjAxNCBcdUFEOENcdUQ1NUMgXHVBQ0M0XHVDMEIwXG5jb25zdCB1c2VVc2VyTGV2ZWwgPSAodXNlcikgPT4gUmVhY3QudXNlTWVtbygoKSA9PiB3aW5kb3cuQkdOSl9VU0VSX0xFVkVMKHVzZXIpLCBbdXNlcl0pO1xuY29uc3QgZ2V0Q2F0ZWdvcmllc0ZvckJvYXJkID0gKGJvYXJkVHlwZSkgPT5cbiAgd2luZG93LkJHTkpfU1RPUkVTLmNhdGVnb3JpZXMuZmlsdGVyKGMgPT4gYy5ib2FyZFR5cGUgPT09IGJvYXJkVHlwZSk7XG5cbi8vID09PSBIYXNodGFnIGNoaXAgaW5wdXQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgSGFzaHRhZ0lucHV0ID0gKHsgdGFncywgc2V0VGFncywgbWF4ID0gMTAgfSkgPT4ge1xuICBjb25zdCBbaW5wdXQsIHNldElucHV0XSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBpbnB1dFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICBjb25zdCBjb21taXQgPSAocmF3KSA9PiB7XG4gICAgY29uc3QgdCA9IHJhdy50cmltKCkucmVwbGFjZSgvXiMrLywgJycpLnJlcGxhY2UoL1xccysvZywgJycpO1xuICAgIGlmICghdCkgcmV0dXJuO1xuICAgIGlmICh0YWdzLmluY2x1ZGVzKHQpKSByZXR1cm47XG4gICAgaWYgKHRhZ3MubGVuZ3RoID49IG1heCkgcmV0dXJuO1xuICAgIHNldFRhZ3MoWy4uLnRhZ3MsIHRdKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVLZXkgPSAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnLCcpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbW1pdChpbnB1dCk7XG4gICAgICBzZXRJbnB1dCgnJyk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0JhY2tzcGFjZScgJiYgIWlucHV0ICYmIHRhZ3MubGVuZ3RoKSB7XG4gICAgICBzZXRUYWdzKHRhZ3Muc2xpY2UoMCwgLTEpKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWctaW5wdXQtd3JhcFwiIG9uQ2xpY2s9eygpID0+IGlucHV0UmVmLmN1cnJlbnQ/LmZvY3VzKCl9PlxuICAgICAgICB7dGFncy5tYXAoKHQsIGkpID0+IChcbiAgICAgICAgICA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cInRhZy1jaGlwXCI+XG4gICAgICAgICAgICAje3R9XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRUYWdzKHRhZ3MuZmlsdGVyKHggPT4geCAhPT0gdCkpfVxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgJHt0fSBcdUQwRENcdUFERjggXHVDMEFEXHVDODFDYH0+XHUyNzE1PC9idXR0b24+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApKX1cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgcmVmPXtpbnB1dFJlZn1cbiAgICAgICAgICB2YWx1ZT17aW5wdXR9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0SW5wdXQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIG9uS2V5RG93bj17aGFuZGxlS2V5fVxuICAgICAgICAgIG9uQmx1cj17KCkgPT4geyBpZiAoaW5wdXQudHJpbSgpKSB7IGNvbW1pdChpbnB1dCk7IHNldElucHV0KCcnKTsgfSB9fVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXt0YWdzLmxlbmd0aCA/IFwiXCIgOiBcIlx1RDBEQ1x1QURGOCBcdUM3ODVcdUI4MjUgXHVENkM0IFx1QzJBNFx1RDM5OFx1Qzc3NFx1QzJBNFx1QkMxNCAoXHVDRDVDXHVCMzAwIDEwXHVBQzFDKVwifVxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJcdUQ1NzRcdUMyRENcdUQwRENcdUFERjggXHVDNzg1XHVCODI1XCIvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWhpbnRcIiBzdHlsZT17e21hcmdpblRvcDo2fX0+XG4gICAgICAgIFx1QzJBNFx1RDM5OFx1Qzc3NFx1QzJBNFx1QkMxNCBcdTAwQjcgRW50ZXIgXHUwMEI3IFx1QzI3Q1x1RDQ1Q1x1Qjg1QyBcdUQwRENcdUFERjggXHVBRDZDXHVCRDg0IFx1MDBCNyBCYWNrc3BhY2VcdUI4NUMgXHVCOUM4XHVDOUMwXHVCOUM5IFx1RDBEQ1x1QURGOCBcdUMwQURcdUM4MUMgXHUwMEI3IHt0YWdzLmxlbmd0aH0ve21heH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09IEltYWdlIFNsaWRlciAodmlld2VyKSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgSW1hZ2VTbGlkZXIgPSAoeyBpbWFnZXMsIGF1dG9wbGF5TXMgPSA0MDAwIH0pID0+IHtcbiAgY29uc3QgW2lkeCwgc2V0SWR4XSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCBbcGF1c2VkLCBzZXRQYXVzZWRdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBwcmVmZXJzUmVkdWNlZCA9IFJlYWN0LnVzZU1lbW8oKCkgPT5cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHdpbmRvdy5tYXRjaE1lZGlhPy4oJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcywgW10pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGltYWdlcy5sZW5ndGggPD0gMSB8fCBwYXVzZWQgfHwgcHJlZmVyc1JlZHVjZWQpIHJldHVybjtcbiAgICBjb25zdCB0ID0gc2V0SW50ZXJ2YWwoKCkgPT4gc2V0SWR4KGkgPT4gKGkgKyAxKSAlIGltYWdlcy5sZW5ndGgpLCBhdXRvcGxheU1zKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbCh0KTtcbiAgfSwgW2ltYWdlcy5sZW5ndGgsIHBhdXNlZCwgYXV0b3BsYXlNcywgcHJlZmVyc1JlZHVjZWRdKTtcblxuICBpZiAoIWltYWdlcy5sZW5ndGgpIHJldHVybiBudWxsO1xuICBjb25zdCBnbyA9IChpKSA9PiBzZXRJZHgoKChpICUgaW1hZ2VzLmxlbmd0aCkgKyBpbWFnZXMubGVuZ3RoKSAlIGltYWdlcy5sZW5ndGgpO1xuXG4gIHJldHVybiAoXG4gICAgPGZpZ3VyZSBhcmlhLXJvbGVkZXNjcmlwdGlvbj1cImNhcm91c2VsXCIgYXJpYS1sYWJlbD1cIlx1Q0NBOFx1QkQ4MCBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDXCJcbiAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0UGF1c2VkKHRydWUpfSBvbk1vdXNlTGVhdmU9eygpID0+IHNldFBhdXNlZChmYWxzZSl9XG4gICAgICBvbkZvY3VzPXsoKSA9PiBzZXRQYXVzZWQodHJ1ZSl9IG9uQmx1cj17KCkgPT4gc2V0UGF1c2VkKGZhbHNlKX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy1zbGlkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLXRyYWNrXCIgc3R5bGU9e3t0cmFuc2Zvcm06IGB0cmFuc2xhdGVYKC0ke2lkeCAqIDEwMH0lKWB9fT5cbiAgICAgICAgICB7aW1hZ2VzLm1hcCgoaW1nLCBpKSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwiaW1nLXNsaWRlci1zbGlkZVwiXG4gICAgICAgICAgICAgIHJvbGU9XCJncm91cFwiIGFyaWEtcm9sZWRlc2NyaXB0aW9uPVwic2xpZGVcIiBhcmlhLWxhYmVsPXtgJHtpKzF9IC8gJHtpbWFnZXMubGVuZ3RofWB9XG4gICAgICAgICAgICAgIGFyaWEtaGlkZGVuPXtpICE9PSBpZHh9PlxuICAgICAgICAgICAgICA8aW1nIHNyYz17aW1nLmRhdGFVcmwgfHwgaW1nLnNyY30gYWx0PXtpbWcuYWx0IHx8IGltZy5uYW1lIHx8IGBcdUM3NzRcdUJCRjhcdUM5QzAgJHtpKzF9YH0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7aW1hZ2VzLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLW5hdiBwcmV2XCIgb25DbGljaz17KCkgPT4gZ28oaWR4IC0gMSl9IGFyaWEtbGFiZWw9XCJcdUM3NzRcdUM4MDQgXHVDNzc0XHVCQkY4XHVDOUMwXCI+XHUyMDM5PC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJpbWctc2xpZGVyLW5hdiBuZXh0XCIgb25DbGljaz17KCkgPT4gZ28oaWR4ICsgMSl9IGFyaWEtbGFiZWw9XCJcdUIyRTRcdUM3NEMgXHVDNzc0XHVCQkY4XHVDOUMwXCI+XHUyMDNBPC9idXR0b24+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy1zbGlkZXItY2FwdGlvblwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWxpdmU9XCJwb2xpdGVcIj57aWR4ICsgMX0gLyB7aW1hZ2VzLmxlbmd0aH08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW1nLXNsaWRlci1kb3RzXCIgcm9sZT1cInRhYmxpc3RcIiBhcmlhLWxhYmVsPVwiXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDIFx1QzEyMFx1RDBERFwiPlxuICAgICAgICAgICAgICB7aW1hZ2VzLm1hcCgoXywgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtpfSB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cInRhYlwiXG4gICAgICAgICAgICAgICAgICBhcmlhLWN1cnJlbnQ9e2kgPT09IGlkeH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODggXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDYH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElkeChpKX0vPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICB7aW1hZ2VzW2lkeF0/LmNhcHRpb24gJiYgKFxuICAgICAgICA8ZmlnY2FwdGlvbiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjEyLCBtYXJnaW5Ub3A6OCwgdGV4dEFsaWduOidjZW50ZXInfX0+XG4gICAgICAgICAge2ltYWdlc1tpZHhdLmNhcHRpb259XG4gICAgICAgIDwvZmlnY2FwdGlvbj5cbiAgICAgICl9XG4gICAgPC9maWd1cmU+XG4gICk7XG59O1xuXG4vLyA9PT0gSW1hZ2UgcGlja2VyIChlZGl0b3Igc2lkZSkgXHUyMDE0IHVwIHRvIGBtYXhgIGltYWdlcyB3aXRoIHRodW1ibmFpbHMgPT09PT1cbmNvbnN0IEltYWdlQXR0YWNoZXIgPSAoeyBpbWFnZXMsIHNldEltYWdlcywgbWF4ID0gMTAgfSkgPT4ge1xuICBjb25zdCBpbnB1dFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICBjb25zdCBoYW5kbGVGaWxlcyA9IGFzeW5jIChmaWxlTGlzdCkgPT4ge1xuICAgIGNvbnN0IGZpbGVzID0gQXJyYXkuZnJvbShmaWxlTGlzdCB8fCBbXSk7XG4gICAgY29uc3QgcmVtYWluaW5nID0gbWF4IC0gaW1hZ2VzLmxlbmd0aDtcbiAgICBpZiAocmVtYWluaW5nIDw9IDApIHJldHVybjtcbiAgICBjb25zdCB0b0FkZCA9IGZpbGVzLnNsaWNlKDAsIHJlbWFpbmluZyk7XG4gICAgLy8gdjAwLjA4NSBcdTIwMTQgUjIgXHVDNkIwXHVDMTIwICgxME1CKSArIGRhdGFVUkkgXHVEM0Y0XHVCQzMxLiBkYXRhVXJsIFx1RDU0NFx1QjREQ1x1QkE4NSBcdUM3MjBcdUM5QzAgXHUyMDE0IFIyIFVSTCBcdUIzQzQgPGltZyBzcmM+IFx1Qjg1QyBcdUQ2MzhcdUQ2NTguXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKHRvQWRkLm1hcChhc3luYyAoZikgPT4ge1xuICAgICAgY29uc3QgbWV0YSA9IHsgbmFtZTogZi5uYW1lLCBzaXplOiBmLnNpemUsIGFsdDogZi5uYW1lLnJlcGxhY2UoL1xcLlteLl0rJC8sICcnKSB9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyB1cmwgfSA9IGF3YWl0IHdpbmRvdy5CR05KX01FRElBLnVwbG9hZEZpbGUoZiwgeyBmb2xkZXI6ICdwb3N0LWltYWdlcycsIG1heEJ5dGVzOiAxMCAqIDEwMjQgKiAxMDI0IH0pO1xuICAgICAgICByZXR1cm4geyAuLi5tZXRhLCBkYXRhVXJsOiB1cmwgfTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1t2MDAuMDg1XSBSMiBcdUFDOENcdUMyRENcdUFFMDAgXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzVDNVx1Qjg1Q1x1QjREQyBcdUMyRTRcdUQzMjggXHUyMDE0IGRhdGFVUkkgXHVEM0Y0XHVCQzMxOicsIGVycik7XG4gICAgICB9XG4gICAgICAvLyBcdUQzRjRcdUJDMzE6IDVNQiBcdUM3NzRcdUQ1NThcdUI5Q0MgZGF0YVVSSSBcdUM3NzhcdUI3N0NcdUM3NzggKEQxIFx1QkQ4MFx1QjJGNCBcdUFDMTBcdUM1NDgpLiBcdUNEMDhcdUFDRkMgXHVDMkRDIFx1QUM3MFx1QkQ4MC5cbiAgICAgIGlmIChmLnNpemUgPiA1ICogMTAyNCAqIDEwMjQpIHtcbiAgICAgICAgYWxlcnQoYCcke2YubmFtZX0nIFIyIFx1QzJFNFx1RDMyOCArIGRhdGFVUkkgXHVEM0Y0XHVCQzMxIFx1RDU1Q1x1QjNDNCA1TUIgXHVDRDA4XHVBQ0ZDIFx1MjAxNCBcdUFDNzRcdUIxMDhcdUI3MDAuYCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNvbnN0IHIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoci5yZXN1bHQpO1xuICAgICAgICByLnJlYWRBc0RhdGFVUkwoZik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7IC4uLm1ldGEsIGRhdGFVcmwgfTtcbiAgICB9KSk7XG4gICAgc2V0SW1hZ2VzKFsuLi5pbWFnZXMsIC4uLnJlc3VsdHMuZmlsdGVyKEJvb2xlYW4pXSk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlID0gKGkpID0+IHNldEltYWdlcyhpbWFnZXMuZmlsdGVyKChfLCBqKSA9PiBqICE9PSBpKSk7XG4gIGNvbnN0IG1vdmUgPSAoaSwgZGlyKSA9PiB7XG4gICAgY29uc3QgaiA9IGkgKyBkaXI7XG4gICAgaWYgKGogPCAwIHx8IGogPj0gaW1hZ2VzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IG5leHQgPSBpbWFnZXMuc2xpY2UoKTtcbiAgICBbbmV4dFtpXSwgbmV4dFtqXV0gPSBbbmV4dFtqXSwgbmV4dFtpXV07XG4gICAgc2V0SW1hZ2VzKG5leHQpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBtYXJnaW5Cb3R0b206OH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCI+XHVDQ0E4XHVCRDgwIFx1Qzc3NFx1QkJGOFx1QzlDMCA8c3BhbiBjbGFzc05hbWU9XCJkaW0tMlwiPih7aW1hZ2VzLmxlbmd0aH0ve21heH0pPC9zcGFuPjwvZGl2PlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICBkaXNhYmxlZD17aW1hZ2VzLmxlbmd0aCA+PSBtYXh9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gaW5wdXRSZWYuY3VycmVudD8uY2xpY2soKX0+XG4gICAgICAgICAgKyBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDMTIwXHVEMEREXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8aW5wdXQgcmVmPXtpbnB1dFJlZn0gdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgbXVsdGlwbGVcbiAgICAgICAgc3R5bGU9e3tkaXNwbGF5Oidub25lJ319XG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4geyBoYW5kbGVGaWxlcyhlLnRhcmdldC5maWxlcyk7IGUudGFyZ2V0LnZhbHVlID0gJyc7IH19Lz5cbiAgICAgIHtpbWFnZXMubGVuZ3RoID4gMCA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWctdGh1bWJzXCI+XG4gICAgICAgICAge2ltYWdlcy5tYXAoKGltZywgaSkgPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzTmFtZT1cImltZy10aHVtYlwiPlxuICAgICAgICAgICAgICA8aW1nIHNyYz17aW1nLmRhdGFVcmwgfHwgaW1nLnNyY30gYWx0PXtpbWcuYWx0IHx8IGB0aHVtYi0ke2l9YH0vPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbWctdGh1bWItb3JkZXJcIj57U3RyaW5nKGkgKyAxKS5wYWRTdGFydCgyLCAnMCcpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiaW1nLXRodW1iLXJlbW92ZVwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcmVtb3ZlKGkpfVxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODggXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzgxQ1x1QUM3MGB9Plx1MjcxNTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246J2Fic29sdXRlJywgYm90dG9tOjQsIHJpZ2h0OjQsIGRpc3BsYXk6J2ZsZXgnLCBnYXA6Mn19PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IG1vdmUoaSwgLTEpfSBkaXNhYmxlZD17aSA9PT0gMH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2Ake2krMX1cdUJDODggXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzU1RVx1QzczQ1x1Qjg1Q2B9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6J3JnYmEoMCwwLDAsMC42KScsIGJvcmRlcjonbm9uZScsIGNvbG9yOid2YXIoLS1nb2xkKScsIGZvbnRTaXplOjEwLCBwYWRkaW5nOicxcHggNXB4JywgY3Vyc29yOidwb2ludGVyJywgbWluSGVpZ2h0OjB9fT5cdTI1QzA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBtb3ZlKGksIDEpfSBkaXNhYmxlZD17aSA9PT0gaW1hZ2VzLmxlbmd0aCAtIDF9XG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgJHtpKzF9XHVCQzg4IFx1Qzc3NFx1QkJGOFx1QzlDMCBcdUI0QTRcdUI4NUNgfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidyZ2JhKDAsMCwwLDAuNiknLCBib3JkZXI6J25vbmUnLCBjb2xvcjondmFyKC0tZ29sZCknLCBmb250U2l6ZToxMCwgcGFkZGluZzonMXB4IDVweCcsIGN1cnNvcjoncG9pbnRlcicsIG1pbkhlaWdodDowfX0+XHUyNUI2PC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwbGFjZWhvbGRlclwiIHN0eWxlPXt7YXNwZWN0UmF0aW86JzUvMScsIGZvbnRTaXplOjEwfX0+XG4gICAgICAgICAgXHVDNzc0XHVCQkY4XHVDOUMwXHVCOTdDIFx1Q0NBOFx1QkQ4MFx1RDU1OFx1QkE3NCBcdUMwQzFcdUMxMzggXHVEMzk4XHVDNzc0XHVDOUMwIFx1RDU1OFx1QjJFOFx1QzVEMCBcdUM3OTBcdUIzRDkgXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDXHVCODVDIFx1RDQ1Q1x1QzJEQ1x1QjQyOVx1QjJDOFx1QjJFNFxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyA9PT0gRmlsZSBhdHRhY2hlciAodjAwLjA2OSkgXHUyMDE0IFx1QkU0NC1cdUM3NzRcdUJCRjhcdUM5QzAgXHVEMzBDXHVDNzdDIFx1Q0NBOFx1QkQ4MCwgMTBNQiBcdTAwRDcgXHVDRDVDXHVCMzAwIDMgPT09PT09XG4vLyBcdUFDOENcdUMyRENcdUFFMDBcdUM1RDAgYXR0YWNobWVudHM6IFt7IG5hbWUsIHR5cGUsIHNpemUsIGRhdGFVcmwgfV0gXHVDNzNDXHVCODVDIFx1QzgwMFx1QzdBNS4gZGF0YVVybCBcdUM3NDAgYmFzZTY0LlxuLy8gXHVCQ0Y0XHVBRDAwIFx1RDU1Q1x1QjNDNFx1QUMwMCBcdUM3OTFcdUM1NDQgdjEgXHVDNzQwIEQxIFx1Qzc3OFx1Qjc3Q1x1Qzc3OCBKU09OLiBcdUNEOTRcdUQ2QzQgUjIgXHVDNUM1XHVCODVDXHVCNERDIFx1RDc1MFx1Qjk4NFx1Qzc0MCBcdUJDQzRcdUIzQzQgXHVDMEFDXHVDNzc0XHVEMDc0LlxuY29uc3QgRklMRV9NQVhfU0laRSA9IDEwICogMTAyNCAqIDEwMjQ7IC8vIDEwTUJcbmNvbnN0IEZJTEVfTUFYX0NPVU5UID0gMztcbmNvbnN0IF9mbXRTaXplID0gKG4pID0+IHtcbiAgaWYgKCFuICYmIG4gIT09IDApIHJldHVybiAnJztcbiAgaWYgKG4gPCAxMDI0KSByZXR1cm4gYCR7bn0gQmA7XG4gIGlmIChuIDwgMTAyNCAqIDEwMjQpIHJldHVybiBgJHsobiAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgcmV0dXJuIGAkeyhuIC8gMTAyNCAvIDEwMjQpLnRvRml4ZWQoMSl9IE1CYDtcbn07XG5jb25zdCBGaWxlQXR0YWNoZXIgPSAoeyBmaWxlcywgc2V0RmlsZXMsIG1heCA9IEZJTEVfTUFYX0NPVU5ULCBtYXhTaXplID0gRklMRV9NQVhfU0laRSB9KSA9PiB7XG4gIGNvbnN0IGlucHV0UmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcblxuICBjb25zdCBoYW5kbGVGaWxlcyA9IGFzeW5jIChmaWxlTGlzdCkgPT4ge1xuICAgIHNldEVycm9yKCcnKTtcbiAgICBjb25zdCBpbmNvbWluZyA9IEFycmF5LmZyb20oZmlsZUxpc3QgfHwgW10pO1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IG1heCAtIGZpbGVzLmxlbmd0aDtcbiAgICBpZiAocmVtYWluaW5nIDw9IDApIHsgc2V0RXJyb3IoYFx1Q0NBOFx1QkQ4MFx1QjI5NCBcdUNENUNcdUIzMDAgJHttYXh9XHVBQzFDXHVBRTRDXHVDOUMwIFx1QUMwMFx1QjJBNVx1RDU2OVx1QjJDOFx1QjJFNC5gKTsgcmV0dXJuOyB9XG4gICAgY29uc3QgYWNjZXB0ZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgaW5jb21pbmcuc2xpY2UoMCwgcmVtYWluaW5nKSkge1xuICAgICAgaWYgKGYuc2l6ZSA+IG1heFNpemUpIHsgc2V0RXJyb3IoYCcke2YubmFtZX0nIFx1Qzc0MChcdUIyOTQpICR7X2ZtdFNpemUobWF4U2l6ZSl9IFx1Q0QwOFx1QUNGQyBcdTIwMTQgXHVDQ0E4XHVCRDgwIFx1QkQ4OFx1QUMwMC5gKTsgY29udGludWU7IH1cbiAgICAgIGFjY2VwdGVkLnB1c2goZik7XG4gICAgfVxuICAgIC8vIHYwMC4wODUgXHUyMDE0IFIyIFx1QzZCMFx1QzEyMCAobWF4U2l6ZT0xME1CKSArIGRhdGFVUkkgXHVEM0Y0XHVCQzMxLiBkYXRhVXJsIFx1RDU0NFx1QjREQ1x1QkE4NSBcdUM3MjBcdUM5QzAgXHUyMDE0IDxhIGhyZWY9e2RhdGFVcmx9IGRvd25sb2FkPiBcdUIzQzQgUjIgVVJMIFx1Qjg1QyBcdUQ2MzhcdUQ2NTguXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKGFjY2VwdGVkLm1hcChhc3luYyAoZikgPT4ge1xuICAgICAgY29uc3QgbWV0YSA9IHsgbmFtZTogZi5uYW1lLCB0eXBlOiBmLnR5cGUgfHwgJycsIHNpemU6IGYuc2l6ZSB9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyB1cmwgfSA9IGF3YWl0IHdpbmRvdy5CR05KX01FRElBLnVwbG9hZEZpbGUoZiwgeyBmb2xkZXI6ICdwb3N0LWF0dGFjaG1lbnRzJywgbWF4Qnl0ZXM6IG1heFNpemUgfSk7XG4gICAgICAgIHJldHVybiB7IC4uLm1ldGEsIGRhdGFVcmw6IHVybCB9O1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignW3YwMC4wODVdIFIyIFx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUNDQThcdUJEODAgXHVDNUM1XHVCODVDXHVCNERDIFx1QzJFNFx1RDMyOCBcdTIwMTQgZGF0YVVSSSBcdUQzRjRcdUJDMzE6JywgZXJyKTtcbiAgICAgIH1cbiAgICAgIC8vIFx1RDNGNFx1QkMzMTogNU1CIFx1Qzc3NFx1RDU1OFx1QjlDQyBkYXRhVVJJIFx1Qzc3OFx1Qjc3Q1x1Qzc3OC4gXHVDRDA4XHVBQ0ZDIFx1QzJEQyBcdUFDNzBcdUJEODAuXG4gICAgICBpZiAoZi5zaXplID4gNSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHNldEVycm9yKGAnJHtmLm5hbWV9JyBSMiBcdUMyRTRcdUQzMjggKyBkYXRhVVJJIFx1RDNGNFx1QkMzMSBcdUQ1NUNcdUIzQzQgNU1CIFx1Q0QwOFx1QUNGQyBcdTIwMTQgXHVDQ0E4XHVCRDgwIFx1QkQ4OFx1QUMwMC5gKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY29uc3QgciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHIub25sb2FkID0gKCkgPT4gcmVzb2x2ZShyLnJlc3VsdCk7XG4gICAgICAgIHIucmVhZEFzRGF0YVVSTChmKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHsgLi4ubWV0YSwgZGF0YVVybCB9O1xuICAgIH0pKTtcbiAgICBzZXRGaWxlcyhbLi4uZmlsZXMsIC4uLnJlc3VsdHMuZmlsdGVyKEJvb2xlYW4pXSk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlID0gKGkpID0+IHNldEZpbGVzKGZpbGVzLmZpbHRlcigoXywgaikgPT4gaiAhPT0gaSkpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBtYXJnaW5Cb3R0b206OH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCI+XHVDQ0E4XHVCRDgwIFx1RDMwQ1x1Qzc3QyA8c3BhbiBjbGFzc05hbWU9XCJkaW0tMlwiPih7ZmlsZXMubGVuZ3RofS97bWF4fSBcdTAwQjcgXHVBQzAxIHtfZm10U2l6ZShtYXhTaXplKX0gXHVDNzc0XHVENTU4KTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiXG4gICAgICAgICAgZGlzYWJsZWQ9e2ZpbGVzLmxlbmd0aCA+PSBtYXh9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gaW5wdXRSZWYuY3VycmVudD8uY2xpY2soKX0+XG4gICAgICAgICAgKyBcdUQzMENcdUM3N0MgXHVDMTIwXHVEMEREXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8aW5wdXQgcmVmPXtpbnB1dFJlZn0gdHlwZT1cImZpbGVcIiBtdWx0aXBsZVxuICAgICAgICBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX1cbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7IGhhbmRsZUZpbGVzKGUudGFyZ2V0LmZpbGVzKTsgZS50YXJnZXQudmFsdWUgPSAnJzsgfX0vPlxuICAgICAge2Vycm9yICYmIChcbiAgICAgICAgPGRpdiByb2xlPVwiYWxlcnRcIiBzdHlsZT17e2ZvbnRTaXplOjExLCBjb2xvcjondmFyKC0tZGFuZ2VyKScsIG1hcmdpbkJvdHRvbTo4fX0+e2Vycm9yfTwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtmaWxlcy5sZW5ndGggPiAwID8gKFxuICAgICAgICA8dWwgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBwYWRkaW5nOjAsIG1hcmdpbjowLCBkaXNwbGF5OidmbGV4JywgZmxleERpcmVjdGlvbjonY29sdW1uJywgZ2FwOjZ9fT5cbiAgICAgICAgICB7ZmlsZXMubWFwKChmLCBpKSA9PiAoXG4gICAgICAgICAgICA8bGkga2V5PXtpfSBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBnYXA6MTAsIHBhZGRpbmc6JzhweCAxMHB4JywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLCBiYWNrZ3JvdW5kOid2YXIoLS1iZy0yKScsIGZvbnRTaXplOjEyfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlx1RDgzRFx1RENDRTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tmbGV4OjEsIGNvbG9yOid2YXIoLS1pbmspJywgb3ZlcmZsb3c6J2hpZGRlbicsIHRleHRPdmVyZmxvdzonZWxsaXBzaXMnLCB3aGl0ZVNwYWNlOidub3dyYXAnfX0+e2YubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEwfX0+e19mbXRTaXplKGYuc2l6ZSl9PC9zcGFuPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiByZW1vdmUoaSl9IGFyaWEtbGFiZWw9e2Ake2YubmFtZX0gXHVDODFDXHVBQzcwYH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6J25vbmUnLCBib3JkZXI6J25vbmUnLCBjb2xvcjondmFyKC0tZGFuZ2VyKScsIGZvbnRTaXplOjE0LCBjdXJzb3I6J3BvaW50ZXInLCBwYWRkaW5nOicycHggNnB4J319Plx1MjcxNTwvYnV0dG9uPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC91bD5cbiAgICAgICkgOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGxhY2Vob2xkZXJcIiBzdHlsZT17e2FzcGVjdFJhdGlvOic4LzEnLCBmb250U2l6ZToxMH19PlxuICAgICAgICAgIFBERiBcdTAwQjcgRE9DWCBcdTAwQjcgXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzY3OCBcdUM3OTBcdUI4Q0NcdUI5N0MgXHVDQ0E4XHVCRDgwIChcdUFDOENcdUMyRENcdUFFMDAgXHVCQ0Y4XHVCQjM4IFx1RDU1OFx1QjJFOFx1QzVEMCBcdUIyRTRcdUM2QjRcdUI4NUNcdUI0REMgXHVCOUMxXHVEMDZDXHVCODVDIFx1RDQ1Q1x1QzJEQylcbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09IENvbW1lbnQgdHJlZSAoXHVCMkU0XHVCMkU4XHVBQ0M0IFx1QjJGNVx1QUUwMCwgXHVDRDVDXHVCMzAwIFx1QUU0QVx1Qzc3NCBNQVhfREVQVEgpID09PT09PT09PT09PT09PT09PT09PT1cbi8vIEBcdUJBNThcdUMxNThcdUM3NDAgXHVCQ0Y4XHVCQjM4XHVDNUQwIEBcdUM3NzRcdUI5ODQgXHVEMUEwXHVEMDcwXHVDNzQ0IFx1QUNFOFx1QjREQyBjaGlwIFx1QzczQ1x1Qjg1QyBcdUI4MENcdUIzNTRcdUI5QzEuXG4vLyBcdUIyRjVcdUFFMDAgXHVEMkI4XHVCOUFDIFx1MjAxNCBcdUMyRENcdUFDMDFcdUM4MDEgXHVCNEU0XHVDNUVDXHVDNEYwXHVBRTMwIFx1QUUzMFx1QkNGOCBcdUNFQTEoMykuIFx1QURGOCBcdUM3NzRcdUMwQzFcdUM3NDAgXHVDNzkwXHVCM0Q5IFx1RDNCQ1x1Q0U2OC9cdUM4MTFcdUFFMzAgXHVEMUEwXHVBRTAwXHVCODVDIFx1QjE3OFx1Q0Q5Qy5cbmNvbnN0IE1BWF9WSVNJQkxFX0RFUFRIID0gMztcblxuY29uc3QgcmVuZGVyQ29tbWVudFRleHQgPSAodGV4dCkgPT4ge1xuICBpZiAoIXRleHQpIHJldHVybiBudWxsO1xuICAvLyBAXHVCMkM5XHVCMTI0XHVDNzg0IFx1RDFBMFx1RDA3MFx1QjlDQyBcdUFDMDBcdUJDQ0RcdUFDOEMgXHVBQzE1XHVDODcwKFx1QUNFOFx1QjREQywgbWVkaXVtKS4gXHVCQ0Y4XHVCQjM4XHVDNzQwIFx1RDNDOVx1QkIzOCBcdUFERjhcdUIzMDBcdUI4NUMuXG4gIGNvbnN0IHBhcnRzID0gU3RyaW5nKHRleHQpLnNwbGl0KC8oQFtcXHB7TH1cXHB7Tn1fXSspL2d1KTtcbiAgcmV0dXJuIHBhcnRzLm1hcCgocGFydCwgaSkgPT4ge1xuICAgIGlmIChwYXJ0LnN0YXJ0c1dpdGgoJ0AnKSAmJiBwYXJ0Lmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiA8c3BhbiBrZXk9e2l9IGNsYXNzTmFtZT1cImdvbGRcIiBzdHlsZT17e2ZvbnRXZWlnaHQ6NTAwfX0+e3BhcnR9PC9zcGFuPjtcbiAgICB9XG4gICAgcmV0dXJuIDxSZWFjdC5GcmFnbWVudCBrZXk9e2l9PntwYXJ0fTwvUmVhY3QuRnJhZ21lbnQ+O1xuICB9KTtcbn07XG5cbmNvbnN0IENvbW1lbnRUcmVlID0gKHsgY29tbWVudHMsIHVzZXIsIG9uRGVsZXRlLCBvblJlcGx5IH0pID0+IHtcbiAgY29uc3QgdG9wTGV2ZWwgPSAoY29tbWVudHMgfHwgW10pLmZpbHRlcigoYykgPT4gIWMucGFyZW50SWQpO1xuICBjb25zdCByZXBsaWVzT2YgPSAocGFyZW50SWQpID0+IChjb21tZW50cyB8fCBbXSkuZmlsdGVyKChjKSA9PiBjLnBhcmVudElkID09PSBwYXJlbnRJZCk7XG4gIGNvbnN0IFtvcGVuUmVwbHlUbywgc2V0T3BlblJlcGx5VG9dID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtkcmFmdCwgc2V0RHJhZnRdID0gUmVhY3QudXNlU3RhdGUoJycpO1xuXG4gIC8vIFx1QkE1OFx1QzE1OCBcdUM3OTBcdUIzRDlcdUM2NDRcdUMxMzEgXHUyMDE0IFx1QjMxM1x1QUUwMCBcdUM3OTFcdUMxMzFcdUM3OTAgKyBcdUFFMDAgXHVCMzEzXHVBRTAwXHVDNUQwIFx1QjRGMVx1QzdBNVx1RDU1QyBcdUJBQThcdUI0RTAgXHVCMkM5XHVCMTI0XHVDNzg0XHVDNzQ0IFx1RDZDNFx1QkNGNFx1Qjg1Qy5cbiAgY29uc3QgYWxsQXV0aG9ycyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgcmV0dXJuIChjb21tZW50cyB8fCBbXSlcbiAgICAgIC5tYXAoKGMpID0+IGMuYXV0aG9yKVxuICAgICAgLmZpbHRlcigobikgPT4gbiAmJiAhc2Vlbi5oYXMobikgJiYgKHNlZW4uYWRkKG4pIHx8IHRydWUpKTtcbiAgfSwgW2NvbW1lbnRzXSk7XG5cbiAgY29uc3Qgc3VibWl0UmVwbHkgPSAocGFyZW50SWQpID0+IHtcbiAgICBvblJlcGx5Py4ocGFyZW50SWQsIGRyYWZ0KTtcbiAgICBzZXREcmFmdCgnJyk7XG4gICAgc2V0T3BlblJlcGx5VG8obnVsbCk7XG4gIH07XG5cbiAgLy8gXHVBRTRBXHVDNzc0IFx1QzgxQ1x1RDU1Q1x1Qzc0NCBcdUQ0ODBcdUFDRTAgKFx1QzExQ1x1QkM4NFx1QjI5NCBcdUJCMzRcdUM4MUNcdUQ1NUMgXHVENUM4XHVDNkE5KSwgXHVDMkRDXHVBQzAxXHVCOUNDIE1BWF9WSVNJQkxFX0RFUFRIIFx1QUU0Q1x1QzlDMCBcdUI0RTRcdUM1RUNcdUM0RjBcdUFFMzAuXG4gIGNvbnN0IFtleHBhbmRlZCwgc2V0RXhwYW5kZWRdID0gUmVhY3QudXNlU3RhdGUoe30pOyAvLyBjb21tZW50SWQgLT4gdHJ1ZSAoXHVDMEFDXHVDNkE5XHVDNzkwIFx1RDNCQ1x1Q0U2OCBcdUQwNzRcdUI5QUQpXG4gIGNvbnN0IHJlbmRlckl0ZW0gPSAoYywgZGVwdGggPSAwKSA9PiB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSByZXBsaWVzT2YoYy5pZCk7XG4gICAgY29uc3QgY2FuUmVwbHkgPSAhIXVzZXI7IC8vIFx1QUU0QVx1Qzc3NCBcdUJCMzRcdUFEMDAgXHVCMkY1XHVBRTAwIFx1RDVDOFx1QzZBOVxuICAgIGNvbnN0IHZpc3VhbERlcHRoID0gTWF0aC5taW4oZGVwdGgsIE1BWF9WSVNJQkxFX0RFUFRIKTtcbiAgICBjb25zdCBpc0RlZXBDb2xsYXBzZWQgPSBkZXB0aCA+PSBNQVhfVklTSUJMRV9ERVBUSCAmJiAhZXhwYW5kZWRbYy5pZF0gJiYgY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpIGtleT17Yy5pZH0gc3R5bGU9e3twYWRkaW5nOicxOHB4IDAnLCBib3JkZXJCb3R0b206IGRlcHRoID09PSAwID8gJzFweCBzb2xpZCB2YXIoLS1saW5lKScgOiAnbm9uZSd9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTYsIGFsaWduSXRlbXM6J2NlbnRlcicsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgbWFyZ2luQm90dG9tOjEwfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTQsIGFsaWduSXRlbXM6J2NlbnRlcicsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAge2RlcHRoID4gMCAmJiA8c3BhbiBjbGFzc05hbWU9XCJkaW0tMiBtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMX19Plx1MjFCMzwvc3Bhbj59XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkIG1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjEyLCBsZXR0ZXJTcGFjaW5nOicwLjFlbScsIGRpc3BsYXk6J2lubGluZS1mbGV4JywgYWxpZ25JdGVtczonY2VudGVyJ319PlxuICAgICAgICAgICAgICB7Yy5hdXRob3J9XG4gICAgICAgICAgICAgIDxBdXRob3JHcmFkZUJhZGdlIGF1dGhvcklkPXtjLmF1dGhvcklkfSBhdXRob3I9e2MuYXV0aG9yfSBhdXRob3JFbWFpbD17Yy5hdXRob3JFbWFpbH0vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHRpbWUgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTF9fT57Yy5kYXRlfTwvdGltZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo2LCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XG4gICAgICAgICAgICB7Y2FuUmVwbHkgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHNldE9wZW5SZXBseVRvKG9wZW5SZXBseVRvID09PSBjLmlkID8gbnVsbCA6IGMuaWQpO1xuICAgICAgICAgICAgICAgICAgc2V0RHJhZnQob3BlblJlcGx5VG8gPT09IGMuaWQgPyAnJyA6IGBAJHtjLmF1dGhvcn0gYCk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRTaXplOjExLCBjb2xvcjondmFyKC0taW5rLTIpJ319PlxuICAgICAgICAgICAgICAgIHtvcGVuUmVwbHlUbyA9PT0gYy5pZCA/ICdcdUNERThcdUMxOEMnIDogJ1x1QjJGNVx1QUUwMCd9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHshIXVzZXIgJiYgKHVzZXIuaXNBZG1pbiB8fCBjLmF1dGhvcklkID09PSB1c2VyLmlkIHx8IGMuYXV0aG9yID09PSB1c2VyLm5hbWUpICYmIChcbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gb25EZWxldGU/LihjLmlkKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRTaXplOjExLCBjb2xvcjondmFyKC0tZGFuZ2VyKSd9fT5cdUMwQURcdUM4MUM8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8cCBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtcmVhZGluZyknLCBmb250U2l6ZTogZGVwdGggPiAwID8gMTQgOiAxNSwgbGluZUhlaWdodDoxLjgsIGNvbG9yOid2YXIoLS1pbmspJywgd2hpdGVTcGFjZToncHJlLXdyYXAnfX0+XG4gICAgICAgICAge3JlbmRlckNvbW1lbnRUZXh0KGMudGV4dCl9XG4gICAgICAgIDwvcD5cblxuICAgICAgICB7LyogXHVCMkY1XHVBRTAwIFx1Qzc4NVx1QjgyNSBcdUQzRkMgKi99XG4gICAgICAgIHtvcGVuUmVwbHlUbyA9PT0gYy5pZCAmJiAoXG4gICAgICAgICAgPGZvcm0gb25TdWJtaXQ9eyhlKSA9PiB7IGUucHJldmVudERlZmF1bHQoKTsgc3VibWl0UmVwbHkoYy5pZCk7IH19XG4gICAgICAgICAgICBzdHlsZT17e21hcmdpblRvcDoxMCwgcGFkZGluZ0xlZnQ6MjQsIGJvcmRlckxlZnQ6JzJweCBzb2xpZCB2YXIoLS1nb2xkLWRpbSknfX0+XG4gICAgICAgICAgICA8TWVudGlvblRleHRhcmVhXG4gICAgICAgICAgICAgIHZhbHVlPXtkcmFmdH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldERyYWZ0fVxuICAgICAgICAgICAgICBhdXRob3JzPXthbGxBdXRob3JzfVxuICAgICAgICAgICAgICByb3dzPXsyfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17YEAke2MuYXV0aG9yfVx1QzVEMFx1QUM4QyBcdUIyRjVcdUFFMDAuLi4gKEBcdUI5N0MgXHVDNzg1XHVCODI1XHVENTU4XHVCQTc0IFx1QkE1OFx1QzE1OCBcdUM3OTBcdUIzRDlcdUM2NDRcdUMxMzEpYH1cbiAgICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW5Cb3R0b206OH19Lz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J2ZsZXgtZW5kJywgZ2FwOjZ9fT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IHsgc2V0T3BlblJlcGx5VG8obnVsbCk7IHNldERyYWZ0KCcnKTsgfX0+XHVDREU4XHVDMThDPC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBkaXNhYmxlZD17IWRyYWZ0LnRyaW0oKX0+XHVCMkY1XHVBRTAwIFx1QjRGMVx1Qjg1RDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9mb3JtPlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBcdUM3OTBcdUMyREQgXHVCMkY1XHVBRTAwXHVCNEU0IFx1MjAxNCBcdUFFNEFcdUM3NzQgXHVDRUExIFx1QjNDNFx1QjJFQyBcdUM4MDRcdUFFNENcdUM5QzAgXHVDN0FDXHVBREMwLCBcdUIzQzRcdUIyRUMgXHVENkM0XHVDNUQ0ICdcdUQzQkNcdUNFNThcdUFFMzAnIFx1RDFBMFx1QUUwMCAqL31cbiAgICAgICAge2NoaWxkcmVuLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIGlzRGVlcENvbGxhcHNlZCA/IChcbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkKChzKSA9PiAoeyAuLi5zLCBbYy5pZF06IHRydWUgfSkpfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIG1hcmdpblRvcDoxMCwgbWFyZ2luTGVmdDoyNCwgZm9udFNpemU6MTEsIGNvbG9yOid2YXIoLS1pbmstMyknLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6JzRweCAxMHB4JywgYm9yZGVyOicxcHggZGFzaGVkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIFx1MjFCMyBcdUIyRjVcdUFFMDAge2NoaWxkcmVuLmxlbmd0aH1cdUFDMUMgXHVEM0JDXHVDRTU4XHVBRTMwXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPG9sIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGxpc3RTdHlsZTonbm9uZScsIHBhZGRpbmc6MCxcbiAgICAgICAgICAgICAgbWFyZ2luOiBkZXB0aCA8IE1BWF9WSVNJQkxFX0RFUFRIID8gJzEycHggMCAwIDI0cHgnIDogJzEycHggMCAwIDEycHgnLFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OicycHggc29saWQgdmFyKC0tbGluZSknLCBwYWRkaW5nTGVmdDoxNCxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7Y2hpbGRyZW4ubWFwKChyKSA9PiByZW5kZXJJdGVtKHIsIGRlcHRoICsgMSkpfVxuICAgICAgICAgICAgICB7ZGVwdGggPj0gTUFYX1ZJU0lCTEVfREVQVEggJiYgKFxuICAgICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkKChzKSA9PiAoeyAuLi5zLCBbYy5pZF06IGZhbHNlIH0pKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWluay0zKScsIHBhZGRpbmc6JzRweCAxMHB4J319PlxuICAgICAgICAgICAgICAgICAgICBcdTIxOTEgXHVCMkY1XHVBRTAwIFx1QzgxMVx1QUUzMFxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvb2w+XG4gICAgICAgICAgKVxuICAgICAgICApfVxuICAgICAgPC9saT5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPG9sIHN0eWxlPXt7bGlzdFN0eWxlOidub25lJywgcGFkZGluZzowLCBtYXJnaW46MH19PlxuICAgICAge3RvcExldmVsLm1hcCgoYykgPT4gcmVuZGVySXRlbShjLCAwKSl9XG4gICAgPC9vbD5cbiAgKTtcbn07XG5cbi8vID09PSBAXHVCQTU4XHVDMTU4IFx1Qzc5MFx1QjNEOVx1QzY0NFx1QzEzMSB0ZXh0YXJlYSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QUMwMCBAXHVDNzQ0IFx1Qzc4NVx1QjgyNVx1RDU1OFx1QkE3NCBcdUQ2QzRcdUJDRjQgXHVCOUFDXHVDMkE0XHVEMkI4XHVCOTdDIFx1Qjc0NFx1QzZCMFx1QUNFMCwgXHVEMDc0XHVCOUFEL0VudGVyIFx1Qjg1QyBcdUIyQzlcdUIxMjRcdUM3ODRcdUM3NDQgXHVDMEJEXHVDNzg1LlxuY29uc3QgTWVudGlvblRleHRhcmVhID0gKHsgdmFsdWUsIG9uQ2hhbmdlLCBhdXRob3JzLCByb3dzID0gNCwgcGxhY2Vob2xkZXIsIHN0eWxlIH0pID0+IHtcbiAgY29uc3QgcmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gUmVhY3QudXNlU3RhdGUoJycpO1xuICBjb25zdCBbYWN0aXZlLCBzZXRBY3RpdmVdID0gUmVhY3QudXNlU3RhdGUoMCk7XG5cbiAgY29uc3QgY2FuZGlkYXRlcyA9IFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuIFtdO1xuICAgIGNvbnN0IHEgPSB0b2tlbi50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiAoYXV0aG9ycyB8fCBbXSlcbiAgICAgIC5maWx0ZXIoKGEpID0+ICFxIHx8IGEudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKSlcbiAgICAgIC5zbGljZSgwLCA2KTtcbiAgfSwgW2F1dGhvcnMsIHRva2VuLCBvcGVuXSk7XG5cbiAgY29uc3QgZGV0ZWN0TWVudGlvbiA9ICh0ZXh0LCBjYXJldCkgPT4ge1xuICAgIC8vIFx1Q0U5MFx1QjdGRiBcdUM5QzFcdUM4MDRcdUM1RDBcdUMxMUMgXHVBQzAwXHVDN0E1IFx1QUMwMFx1QUU0Q1x1QzZCNCBAXHVCOTdDIFx1Q0MzRVx1QUNFMCwgQCBcdUIyRTRcdUM3NEMgXHVCQjM4XHVDNzkwXHVBQzAwIFx1QUNGNVx1QkMzMS9cdUM5MDRcdUJDMTRcdUFGQzhcdUM3NzQgXHVDNTQ0XHVCMkNDXHVDOUMwIFx1RDY1NVx1Qzc3OC5cbiAgICBjb25zdCB1cHRvID0gdGV4dC5zbGljZSgwLCBjYXJldCk7XG4gICAgY29uc3QgbSA9IC9AKFtcXHB7TH1cXHB7Tn1fXSopJC91LmV4ZWModXB0byk7XG4gICAgaWYgKG0pIHsgc2V0VG9rZW4obVsxXSk7IHNldE9wZW4odHJ1ZSk7IHNldEFjdGl2ZSgwKTsgfVxuICAgIGVsc2UgeyBzZXRPcGVuKGZhbHNlKTsgc2V0VG9rZW4oJycpOyB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKGUpID0+IHtcbiAgICBjb25zdCB2ID0gZS50YXJnZXQudmFsdWU7XG4gICAgb25DaGFuZ2Uodik7XG4gICAgZGV0ZWN0TWVudGlvbih2LCBlLnRhcmdldC5zZWxlY3Rpb25TdGFydCB8fCB2Lmxlbmd0aCk7XG4gIH07XG5cbiAgY29uc3QgaW5zZXJ0Q2FuZGlkYXRlID0gKG5hbWUpID0+IHtcbiAgICBjb25zdCBlbCA9IHJlZi5jdXJyZW50O1xuICAgIGNvbnN0IGNhcmV0ID0gZWw/LnNlbGVjdGlvblN0YXJ0ID8/IHZhbHVlLmxlbmd0aDtcbiAgICBjb25zdCBiZWZvcmUgPSB2YWx1ZS5zbGljZSgwLCBjYXJldCk7XG4gICAgY29uc3QgYWZ0ZXIgPSB2YWx1ZS5zbGljZShjYXJldCk7XG4gICAgY29uc3QgcmVwbGFjZWQgPSBiZWZvcmUucmVwbGFjZSgvQChbXFxwe0x9XFxwe059X10qKSQvdSwgYEAke25hbWV9IGApO1xuICAgIGNvbnN0IG5leHQgPSByZXBsYWNlZCArIGFmdGVyO1xuICAgIG9uQ2hhbmdlKG5leHQpO1xuICAgIHNldE9wZW4oZmFsc2UpO1xuICAgIHNldFRva2VuKCcnKTtcbiAgICAvLyBcdUNFOTBcdUI3RkZcdUM3NDQgXHVDMEJEXHVDNzg1IFx1QjA1RFx1QzczQ1x1Qjg1QyBcdUM3NzRcdUIzRDlcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IHJlcGxhY2VkLmxlbmd0aDtcbiAgICAgICAgZWw/LmZvY3VzKCk7XG4gICAgICAgIGVsPy5zZXRTZWxlY3Rpb25SYW5nZShwb3MsIHBvcyk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfSwgMCk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlS2V5RG93biA9IChlKSA9PiB7XG4gICAgaWYgKCFvcGVuIHx8IGNhbmRpZGF0ZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dEb3duJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHNldEFjdGl2ZSgoaSkgPT4gKGkgKyAxKSAlIGNhbmRpZGF0ZXMubGVuZ3RoKTsgfVxuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnQXJyb3dVcCcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzZXRBY3RpdmUoKGkpID0+IChpIC0gMSArIGNhbmRpZGF0ZXMubGVuZ3RoKSAlIGNhbmRpZGF0ZXMubGVuZ3RoKTsgfVxuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgaW5zZXJ0Q2FuZGlkYXRlKGNhbmRpZGF0ZXNbYWN0aXZlXSk7IH1cbiAgICBlbHNlIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHsgc2V0T3BlbihmYWxzZSk7IH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjoncmVsYXRpdmUnfX0+XG4gICAgICA8dGV4dGFyZWEgcmVmPXtyZWZ9IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgcm93cz17cm93c31cbiAgICAgICAgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBvbktleURvd249e2hhbmRsZUtleURvd259XG4gICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn0gc3R5bGU9e3N0eWxlfS8+XG4gICAgICB7b3BlbiAmJiBjYW5kaWRhdGVzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8dWwgcm9sZT1cImxpc3Rib3hcIiBhcmlhLWxhYmVsPVwiXHVCQTU4XHVDMTU4IFx1RDZDNFx1QkNGNFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHpJbmRleDo1MCwgdG9wOicxMDAlJywgbGVmdDowLCBtYXJnaW5Ub3A6MixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgIGxpc3RTdHlsZTonbm9uZScsIHBhZGRpbmc6NCwgbWluV2lkdGg6MTgwLCBtYXhXaWR0aDoyODAsXG4gICAgICAgICAgICBib3hTaGFkb3c6JzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjA4KScsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge2NhbmRpZGF0ZXMubWFwKChuYW1lLCBpKSA9PiAoXG4gICAgICAgICAgICA8bGkga2V5PXtuYW1lfSByb2xlPVwib3B0aW9uXCIgYXJpYS1zZWxlY3RlZD17aSA9PT0gYWN0aXZlfVxuICAgICAgICAgICAgICBvbk1vdXNlRG93bj17KGUpID0+IHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBpbnNlcnRDYW5kaWRhdGUobmFtZSk7IH19XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcGFkZGluZzonNnB4IDEwcHgnLCBmb250U2l6ZToxMywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpID09PSBhY3RpdmUgPyAncmdiYSgyNDUsMjEzLDcyLDAuMTIpJyA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgY29sb3I6IGkgPT09IGFjdGl2ZSA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0taW5rKScsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBAe25hbWV9XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3VsPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PSBDb21tdW5pdHkgUGFnZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IFBPU1RTX1BFUl9QQUdFID0gMTA7XG5cbmNvbnN0IENvbW11bml0eVBhZ2UgPSAoeyBnbywgcG9zdElkLCBzZXRQb3N0SWQsIHVzZXIgfSkgPT4ge1xuICBjb25zdCB1c2VyTGV2ZWwgPSB1c2VVc2VyTGV2ZWwodXNlcik7XG4gIGNvbnN0IGNhdGVnb3JpZXMgPSBSZWFjdC51c2VNZW1vKCgpID0+IGdldENhdGVnb3JpZXNGb3JCb2FyZChcImNvbW11bml0eVwiKSwgW3Bvc3RJZF0pO1xuICBjb25zdCBbcmVmcmVzaEtleSwgc2V0UmVmcmVzaEtleV0gPSBSZWFjdC51c2VTdGF0ZSgwKTtcbiAgY29uc3QgW3RhYiwgc2V0VGFiXSA9IFJlYWN0LnVzZVN0YXRlKFwiYWxsXCIpO1xuICBjb25zdCBbYWN0aXZlUHJlZml4LCBzZXRBY3RpdmVQcmVmaXhdID0gUmVhY3QudXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtzZWFyY2gsIHNldFNlYXJjaF0gPSBSZWFjdC51c2VTdGF0ZShcIlwiKTtcbiAgY29uc3QgW3NvcnQsIHNldFNvcnRdID0gUmVhY3QudXNlU3RhdGUoXCJsYXRlc3RcIik7XG4gIGNvbnN0IFt3cml0aW5nLCBzZXRXcml0aW5nXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbcGFnZSwgc2V0UGFnZV0gPSBSZWFjdC51c2VTdGF0ZSgxKTtcblxuICAvLyBcdUM1NENcdUI5QkMgXHVCQ0E4IC8gXHVDNjc4XHVCRDgwIFx1QzlDNFx1Qzc4NVx1QzVEMFx1QzExQyBzdGFzaFx1RDU3NCBcdUI0NTQgcG9zdElkXHVBQzAwIFx1Qzc4OFx1QzczQ1x1QkE3NCBcdUM3OTBcdUIzRDlcdUM3M0NcdUI4NUMgXHVDMEMxXHVDMTM4XHVCODVDIFx1Qzc3NFx1QjNEOVxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBwZW5kaW5nID0gbnVsbDtcbiAgICB0cnkgeyBwZW5kaW5nID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYmdual9wZW5kaW5nX3Bvc3RfaWQnKTsgfSBjYXRjaCB7fVxuICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICB0cnkgeyBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcpOyB9IGNhdGNoIHt9XG4gICAgICBzZXRQb3N0SWQocGVuZGluZyk7XG4gICAgfVxuICAgIC8vIFx1QjBCNFx1QkU0NCBcdUJBNTRcdUFDMDBcdUJBNTRcdUIyNzRcdUM1RDBcdUMxMUMgXHVCNEU0XHVDNUI0XHVDNjI4IFx1QUM4Q1x1QzJEQ1x1RDMxMCBJRFxuICAgIGxldCBwZW5kaW5nQm9hcmQgPSBudWxsO1xuICAgIHRyeSB7IHBlbmRpbmdCb2FyZCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2JnbmpfcGVuZGluZ19ib2FyZF9pZCcpOyB9IGNhdGNoIHt9XG4gICAgaWYgKHBlbmRpbmdCb2FyZCkge1xuICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnYmdual9wZW5kaW5nX2JvYXJkX2lkJyk7IH0gY2F0Y2gge31cbiAgICAgIHNldFRhYihwZW5kaW5nQm9hcmQpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIC8vIFx1QzExQ1x1QkM4NCBcdUFDOENcdUMyRENcdUFFMDAgXHVCM0Q5XHVBRTMwXHVENjU0IFx1MjAxNCBcdUQzOThcdUM3NzRcdUM5QzAgXHVDOUM0XHVDNzg1IFx1QzJEQyAxXHVENjhDICsgJ2JnbmotcG9zdHMtcmVmcmVzaCcgXHVDNzc0XHVCQ0E0XHVEMkI4XHVCOUM4XHVCMkU0IFx1QzdBQ1x1QjgwQ1x1QjM1NFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5CR05KX0NPTU1VTklUWS5yZWZyZXNoUG9zdHM/LigpO1xuICAgIGNvbnN0IG9uUmVmcmVzaCA9ICgpID0+IHNldFJlZnJlc2hLZXkoKHYpID0+IHYgKyAxKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai1wb3N0cy1yZWZyZXNoJywgb25SZWZyZXNoKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotcG9zdHMtcmVmcmVzaCcsIG9uUmVmcmVzaCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBHID0gd2luZG93LkJHTkpfR1VBUkQ7XG4gIGNvbnN0IGFsbFBvc3RzID0gUmVhY3QudXNlTWVtbygoKSA9PiBHLmFycigoKSA9PiB3aW5kb3cuQkdOSl9DT01NVU5JVFk/Lmxpc3RQb3N0cz8uKCkpLCBbcmVmcmVzaEtleV0pO1xuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMCBcdUJBQThcdUI0RTAgaG9va1x1Qzc0MCBlYXJseSByZXR1cm4gXHVDODA0XHVDNUQwIFx1QzEyMFx1QzVCOCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgdmlzaWJsZUNhdHMgPSBjYXRlZ29yaWVzLmZpbHRlcihjID0+IHVzZXJMZXZlbCA+PSAoYy5taW5MZXZlbCA/PyAwKSk7XG4gIGNvbnN0IGN1cnJlbnRCb2FyZCA9IGNhdGVnb3JpZXMuZmluZChjID0+IGMuaWQgPT09IHRhYik7XG4gIGNvbnN0IGJvYXJkUHJlZml4ZXMgPSBjdXJyZW50Qm9hcmQ/LnByZWZpeGVzIHx8IFtdO1xuICBjb25zdCBjYW5SZWFkUG9zdCA9IFJlYWN0LnVzZUNhbGxiYWNrKChwb3N0KSA9PiB7XG4gICAgaWYgKCFwb3N0KSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgY2F0ID0gY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5pZCA9PT0gcG9zdC5jYXRlZ29yeUlkKSB8fCBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmxhYmVsID09PSBwb3N0LmNhdGVnb3J5KTtcbiAgICByZXR1cm4gIWNhdCB8fCB1c2VyTGV2ZWwgPj0gKGNhdC5taW5MZXZlbCA/PyAwKTtcbiAgfSwgW2NhdGVnb3JpZXMsIHVzZXJMZXZlbF0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7IHNldEFjdGl2ZVByZWZpeChcIlwiKTsgfSwgW3RhYl0pO1xuXG4gIGNvbnN0IGZpbHRlcmVkID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgcSA9IHNlYXJjaC50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGJhc2UgPSBhbGxQb3N0cy5maWx0ZXIocCA9PiB7XG4gICAgICBjb25zdCBjYXQgPSBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmlkID09PSBwLmNhdGVnb3J5SWQpIHx8IGNhdGVnb3JpZXMuZmluZChjID0+IGMubGFiZWwgPT09IHAuY2F0ZWdvcnkpO1xuICAgICAgaWYgKGNhdCAmJiB1c2VyTGV2ZWwgPCAoY2F0Lm1pbkxldmVsID8/IDApKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAodGFiICE9PSBcImFsbFwiICYmIChwLmNhdGVnb3J5SWQgIT09IHRhYiAmJiBjYXQ/LmlkICE9PSB0YWIpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAocSAmJiAhcC50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpICYmICFTdHJpbmcocC5ib2R5Py50ZXh0IHx8ICcnKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoYWN0aXZlUHJlZml4ICYmIHAucHJlZml4ICE9PSBhY3RpdmVQcmVmaXgpIHJldHVybiBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIGlmIChzb3J0ID09PSBcInZpZXdzXCIpIHJldHVybiBbLi4uYmFzZV0uc29ydCgoYSwgYikgPT4gKGIudmlld3MgPz8gMCkgLSAoYS52aWV3cyA/PyAwKSk7XG4gICAgaWYgKHNvcnQgPT09IFwicmVwbGllc1wiKSByZXR1cm4gWy4uLmJhc2VdLnNvcnQoKGEsIGIpID0+IChiLnJlcGxpZXMgPz8gMCkgLSAoYS5yZXBsaWVzID8/IDApKTtcbiAgICBpZiAoc29ydCA9PT0gXCJsaWtlc1wiKSByZXR1cm4gWy4uLmJhc2VdLnNvcnQoKGEsIGIpID0+IChBcnJheS5pc0FycmF5KGIubGlrZXMpID8gYi5saWtlcy5sZW5ndGggOiAwKSAtIChBcnJheS5pc0FycmF5KGEubGlrZXMpID8gYS5saWtlcy5sZW5ndGggOiAwKSk7XG4gICAgcmV0dXJuIGJhc2U7XG4gIH0sIFthbGxQb3N0cywgY2F0ZWdvcmllcywgdXNlckxldmVsLCB0YWIsIHNlYXJjaCwgc29ydCwgYWN0aXZlUHJlZml4XSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHsgc2V0UGFnZSgxKTsgfSwgW3RhYiwgc2VhcmNoLCBzb3J0LCBhY3RpdmVQcmVmaXhdKTtcblxuICAvLyB2MDAuMTcwIFx1MjAxNCBcdUMwQzFcdUMxMzggXHVDOUM0XHVDNzg1IFx1QzJEQyBib2R5IFx1QUMwMCBcdUJFNDRcdUM1QjRcdUM3ODhcdUM3M0NcdUJBNzQgXHVCMkU4XHVDNzdDIHBvc3QgXHVDODcwXHVENjhDXHVCODVDIFx1QkNGNFx1QUMxNS5cbiAgLy8gXHVDNkNDXHVDRUU0IGxpc3QgXHVDNzUxXHVCMkY1XHVDNzc0IGJvZHkgXHVDRUVDXHVCN0ZDXHVDNzQ0IFNFTEVDVCBcdUQ1NThcdUM5QzAgXHVDNTRBXHVCMzU4IFx1QUQ2Q1x1QkM4NFx1QzgwNCBcdUQ2NThcdUFDQkQgXHVENjM4XHVENjU4LlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghcG9zdElkKSByZXR1cm47XG4gICAgY29uc3QgcG9zdCA9IGFsbFBvc3RzLmZpbmQoKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKHBvc3RJZCkpO1xuICAgIGlmICghcG9zdCkgcmV0dXJuO1xuICAgIGlmIChwb3N0LmJvZHkgJiYgKHBvc3QuYm9keS5odG1sIHx8IHBvc3QuYm9keS50ZXh0KSkgcmV0dXJuO1xuICAgIGxldCBhbGl2ZSA9IHRydWU7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWT8uX2h5ZHJhdGVQb3N0Qm9keT8uKHBvc3RJZCk7XG4gICAgICAgIGlmIChhbGl2ZSkgc2V0UmVmcmVzaEtleSgodikgPT4gdiArIDEpO1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH0pKCk7XG4gICAgcmV0dXJuICgpID0+IHsgYWxpdmUgPSBmYWxzZTsgfTtcbiAgfSwgW3Bvc3RJZF0pO1xuICAvLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvLyB2MDAuMDY4IFx1MjAxNCBQb3N0Q29tcG9zZSBcdUJBQThcdUIyRUMgd3JhcHBlci4gXHVCQUE5XHVCODVEIFx1QzcwNFx1QzVEMCBcdUJBQThcdUIyRUNcdUI4NUMgXHVENDVDXHVDMkRDLiBFU0MvXHVDNjc4XHVCRDgwXHVEMDc0XHVCOUFEIFx1QzJEQyB1c2VNb2RhbEd1YXJkIFx1QUMwMCBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgcHJvbXB0LlxuICAvLyBQb3N0Q29tcG9zZSBcdUM3NTggb25DYW5jZWwgXHVDNzc0IGNsb3NlTW9kYWwgXHVDNzNDXHVCODVDIFx1QzVGMFx1QUNCMFx1QjQyOCAoXHVDREU4XHVDMThDIFx1QkM4NFx1RDJCQyA9IFx1Qzk4OVx1QzJEQyBcdUIyRUJcdUFFMzApLlxuICBjb25zdCBQb3N0Q29tcG9zZU1vZGFsID0gKHsgb25DbG9zZSB9KSA9PiB7XG4gICAgY29uc3QgZ3VhcmQgPSB3aW5kb3cudXNlTW9kYWxHdWFyZD8uKHsgb3BlbjogdHJ1ZSwgZGlydHk6IHRydWUsIG9uQ2xvc2UsIG9uU2F2ZURyYWZ0OiBudWxsLCBsYWJlbDogJ1x1QUM4Q1x1QzJEQ1x1QUUwMCcgfSkgfHwge307XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1sYWJlbD17d3JpdGluZyA9PT0gdHJ1ZSA/ICdcdUMwQzggXHVBRTAwIFx1Qzc5MVx1QzEzMScgOiAnXHVBQzhDXHVDMkRDXHVBRTAwIFx1QzIxOFx1QzgxNSd9XG4gICAgICAgIG9uQ2xpY2s9e2d1YXJkLm9uQmFja2Ryb3BDbGlja31cbiAgICAgICAgc3R5bGU9e3twb3NpdGlvbjonZml4ZWQnLCBpbnNldDowLCBiYWNrZ3JvdW5kOidyZ2JhKDAsMCwwLDAuNTUpJywgekluZGV4OjEwMDAsIGRpc3BsYXk6J2dyaWQnLCBwbGFjZUl0ZW1zOidzdGFydCBjZW50ZXInLCBwYWRkaW5nOjI0LCBvdmVyZmxvd1k6J2F1dG8nfX0+XG4gICAgICAgIDxkaXYgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9IHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6J21pbigxMTAwcHgsIDEwMCUpJywgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm94U2hhZG93OicwIDE2cHggNDBweCByZ2JhKDAsMCwwLDAuMjUpJyxcbiAgICAgICAgICBwYWRkaW5nOjI0LCBtYXJnaW5Ub3A6MjQsIG1hcmdpbkJvdHRvbTo0OCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPFBvc3RDb21wb3NlXG4gICAgICAgICAgICBrZXk9e3dyaXRpbmcgPT09IHRydWUgPyBcIm5ld1wiIDogU3RyaW5nKHdyaXRpbmcuaWQpfVxuICAgICAgICAgICAgdXNlcj17dXNlcn1cbiAgICAgICAgICAgIGluaXRpYWxQb3N0PXt3cml0aW5nID09PSB0cnVlID8gbnVsbCA6IHdyaXRpbmd9XG4gICAgICAgICAgICBvbkNhbmNlbD17b25DbG9zZX1cbiAgICAgICAgICAgIG9uUHVibGlzaD17YXN5bmMgKHBheWxvYWQpID0+IHtcbiAgICAgICAgICAgICAgbGV0IHNhdmVkUG9zdDtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzYXZlZFBvc3QgPSB3cml0aW5nID09PSB0cnVlXG4gICAgICAgICAgICAgICAgICA/IGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWS5jcmVhdGVQb3N0UmVtb3RlKHBheWxvYWQpXG4gICAgICAgICAgICAgICAgICA6IGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWS51cGRhdGVQb3N0UmVtb3RlKHdyaXRpbmcuaWQsIHBheWxvYWQpO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBcdUMxMUNcdUJDODQgXHVDMkU0XHVEMzI4IFx1QzJEQyBcdUI4NUNcdUNFRUMgXHVEM0Y0XHVCQzMxLlxuICAgICAgICAgICAgICAgIHNhdmVkUG9zdCA9IHdyaXRpbmcgPT09IHRydWVcbiAgICAgICAgICAgICAgICAgID8gd2luZG93LkJHTkpfQ09NTVVOSVRZLmNyZWF0ZVBvc3QocGF5bG9hZClcbiAgICAgICAgICAgICAgICAgIDogd2luZG93LkJHTkpfQ09NTVVOSVRZLnVwZGF0ZVBvc3Qod3JpdGluZy5pZCwgcGF5bG9hZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25DbG9zZSgpO1xuICAgICAgICAgICAgICBzZXRSZWZyZXNoS2V5KCh2YWx1ZSkgPT4gdmFsdWUgKyAxKTtcbiAgICAgICAgICAgICAgaWYgKHNhdmVkUG9zdCkgc2V0UG9zdElkKHNhdmVkUG9zdC5pZCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgY2F0ZWdvcmllcz17Y2F0ZWdvcmllc31cbiAgICAgICAgICAgIHVzZXJMZXZlbD17dXNlckxldmVsfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuICBpZiAocG9zdElkKSB7XG4gICAgY29uc3QgcG9zdCA9IGFsbFBvc3RzLmZpbmQocCA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwb3N0SWQpKSB8fCBudWxsO1xuICAgIGlmICghcG9zdCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIiBzdHlsZT17e21heFdpZHRoOjc2MCwgdGV4dEFsaWduOidjZW50ZXInLCBwYWRkaW5nOic4MHB4IDIwcHgnfX0+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Cb3R0b206MTZ9fT5cdUQ1NzRcdUIyRjkgXHVBQzhDXHVDMkRDXHVBRTAwXHVDNzQ0IFx1Q0MzRVx1Qzc0NCBcdUMyMTggXHVDNUM2XHVDMkI1XHVCMkM4XHVCMkU0LjwvcD5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9eygpID0+IHNldFBvc3RJZChudWxsKX0+XHVCQUE5XHVCODVEXHVDNzNDXHVCODVDPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKCFjYW5SZWFkUG9zdChwb3N0KSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIiBzdHlsZT17e21heFdpZHRoOjc2MCwgdGV4dEFsaWduOidjZW50ZXInLCBwYWRkaW5nOic4MHB4IDIwcHgnfX0+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e2ZvbnRTaXplOjE0LCBtYXJnaW5Cb3R0b206MTZ9fT5cdUQ2MDRcdUM3QUMgXHVCNEYxXHVBRTA5XHVDNzNDXHVCODVDXHVCMjk0IFx1Qzc3NCBcdUFDOENcdUMyRENcdUFFMDBcdUM3NDQgXHVCQ0ZDIFx1QzIxOCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuPC9wPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17KCkgPT4gc2V0UG9zdElkKG51bGwpfT5cdUJBQTlcdUI4NURcdUM3M0NcdUI4NUM8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gPFBvc3REZXRhaWxcbiAgICAgIHBvc3Q9e3Bvc3R9XG4gICAgICBnbz17Z299XG4gICAgICBzZXRQb3N0SWQ9e3NldFBvc3RJZH1cbiAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICBvblJlZnJlc2g9eygpID0+IHNldFJlZnJlc2hLZXkoKHZhbHVlKSA9PiB2YWx1ZSArIDEpfVxuICAgICAgb25FZGl0PXsobmV4dFBvc3QpID0+IHNldFdyaXRpbmcobmV4dFBvc3QpfVxuICAgIC8+O1xuICB9XG5cbiAgY29uc3QgdG90YWxQYWdlcyA9IE1hdGgubWF4KDEsIE1hdGguY2VpbChmaWx0ZXJlZC5sZW5ndGggLyBQT1NUU19QRVJfUEFHRSkpO1xuICBjb25zdCBzYWZlUGFnZSA9IE1hdGgubWluKHBhZ2UsIHRvdGFsUGFnZXMpO1xuICBjb25zdCBwYWdlU3RhcnQgPSAoc2FmZVBhZ2UgLSAxKSAqIFBPU1RTX1BFUl9QQUdFO1xuICBjb25zdCBwYWdlUG9zdHMgPSBmaWx0ZXJlZC5zbGljZShwYWdlU3RhcnQsIHBhZ2VTdGFydCArIFBPU1RTX1BFUl9QQUdFKTtcblxuICBjb25zdCBoYW5kbGVXcml0ZSA9ICgpID0+IHtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIGlmIChjb25maXJtKFwiXHVBRTAwXHVDNEYwXHVBRTMwXHVCMjk0IFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUQ2QzQgXHVDNzc0XHVDNkE5XHVENTYwIFx1QzIxOCBcdUM3ODhcdUMyQjVcdUIyQzhcdUIyRTQuIFx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUQzOThcdUM3NzRcdUM5QzBcdUI4NUMgXHVDNzc0XHVCM0Q5XHVENTU4XHVDMkRDXHVBQ0EwXHVDNUI0XHVDNjk0P1wiKSkge1xuICAgICAgICBnbyhcImxvZ2luXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBXcml0YWJsZSBjYXRlZ29yaWVzIGZvciBjdXJyZW50IHVzZXIuXG4gICAgLy8gdjAwLjE0MSBcdTIwMTQgYWxsb3dfd3JpdGUgXHVBQzAwIFx1QkE4NVx1QzJEQyBmYWxzZSBcdUM3NzggXHVBQzhDXHVDMkRDXHVEMzEwXHVDNzQwIFx1QkU0NFx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUM4MUNcdUM2NzguXG4gICAgLy8gdjAwLjE0NiBcdTIwMTQgXHVBQ0Y1XHVDOUMwKG5vdGljZSkgXHVCMjk0IFx1QzVCNFx1QjVBMFx1RDU1QyBcdUFDQkRcdUM2QjBcdUM1RDBcdUIzQzQgXHVBRDAwXHVCOUFDXHVDNzkwXHVCOUNDIFx1Qzc5MVx1QzEzMSAoXHVBQzE1XHVDODFDIFx1QUREQ1x1Q0U1OSkuXG4gICAgY29uc3QgaXNBZG1pbiA9ICEhKHVzZXI/LmlzQWRtaW4gfHwgdXNlcj8uZ3JhZGVJZCA9PT0gJ2FkbWluJyk7XG4gICAgY29uc3Qgd3JpdGFibGUgPSBjYXRlZ29yaWVzLmZpbHRlcigoYykgPT4ge1xuICAgICAgaWYgKGMuaWQgPT09ICdub3RpY2UnICYmICFpc0FkbWluKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoYy5hbGxvd1dyaXRlID09PSBmYWxzZSAmJiAhaXNBZG1pbikgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIHVzZXJMZXZlbCA+PSAoYy5wb3N0TWluTGV2ZWwgPz8gYy5taW5MZXZlbCA/PyAwKTtcbiAgICB9KTtcbiAgICBpZiAod3JpdGFibGUubGVuZ3RoID09PSAwKSB7XG4gICAgICBhbGVydChcIlx1RDYwNFx1QzdBQyBcdUI0RjFcdUFFMDlcdUM3M0NcdUI4NUNcdUIyOTQgXHVBRTAwXHVDNzQ0IFx1Qzc5MVx1QzEzMVx1RDU2MCBcdUMyMTggXHVDNzg4XHVCMjk0IFx1QUM4Q1x1QzJEQ1x1RDMxMFx1Qzc3NCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRXcml0aW5nKHRydWUpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICA8aGVhZGVyIHN0eWxlPXt7bWFyZ2luQm90dG9tOjI0fX0+XG4gICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAvLyB2MDAuMDczIFx1MjAxNCBzaXRlX2NvbnRlbnRfa3YuY29tbXVuaXR5SW50cm8gXHVDNUQwXHVDMTFDIGhlcm8gXHVDNzdEXHVBRTMwLlxuICAgICAgICAgICAgY29uc3QgX2kgPSAod2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9KS5jb21tdW5pdHlJbnRybyB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IGViID0gX2kuZXllYnJvdyB8fCAnQ09NTVVOSVRZIFx1MDBCNyBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAnO1xuICAgICAgICAgICAgY29uc3QgdHAgPSBfaS50aXRsZVByZWZpeCA/PyAnXHVCMkU0XHVDMTJGIFx1QkQwOVx1QzZCMFx1QjlBQyAnO1xuICAgICAgICAgICAgY29uc3QgdGEgPSBfaS50aXRsZUFjY2VudCA/PyAnXHVBRDExXHVDN0E1JztcbiAgICAgICAgICAgIGNvbnN0IHNiID0gX2kuc3VidGl0bGUgfHwgJ1x1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1Qzc3NCBcdUJBQThcdUM1RUMgXHVCMDk4XHVCMjA0XHVCMjk0IFx1Qzc3NFx1QzU3Q1x1QUUzMC4gXHVDOUM4XHVCQjM4XHVCM0M0IFx1QjJGNVx1QjNDNCBcdUQ2NThcdUM2MDFcdUQ1NjlcdUIyQzhcdUIyRTQuJztcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIj57ZWJ9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInNlY3Rpb24tdGl0bGVcIj57dHB9PHNwYW4gY2xhc3NOYW1lPVwiYWNjZW50XCI+e3RhfTwvc3Bhbj48L2gxPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInNlY3Rpb24tc3VidGl0bGVcIj57c2J9PC9wPlxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSkoKX1cbiAgICAgICAgPC9oZWFkZXI+XG5cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczonY2VudGVyJywgbWFyZ2luQm90dG9tOjI0LCBnYXA6MjQsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgIDxkaXYgcm9sZT1cInRhYmxpc3RcIiBhcmlhLWxhYmVsPVwiXHVBQzhDXHVDMkRDXHVEMzEwIFx1QkQ4NFx1Qjk1OFwiXG4gICAgICAgICAgICBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MCwgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHJvbGU9XCJ0YWJcIiBhcmlhLXNlbGVjdGVkPXt0YWIgPT09IFwiYWxsXCJ9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFRhYihcImFsbFwiKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOicxNHB4IDI0cHgnLCBmb250U2l6ZToxMywgbGV0dGVyU3BhY2luZzonMC4xZW0nLFxuICAgICAgICAgICAgICAgIGNvbG9yOiB0YWIgPT09IFwiYWxsXCIgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiB0YWIgPT09IFwiYWxsXCIgPyAnMXB4IHNvbGlkIHZhcigtLWdvbGQpJyA6ICcxcHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTotMX19Plx1QzgwNFx1Q0NCNDwvYnV0dG9uPlxuICAgICAgICAgICAge3Zpc2libGVDYXRzLm1hcChjID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2MuaWR9IHR5cGU9XCJidXR0b25cIiByb2xlPVwidGFiXCIgYXJpYS1zZWxlY3RlZD17dGFiID09PSBjLmlkfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFRhYihjLmlkKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e3BhZGRpbmc6JzE0cHggMjRweCcsIGZvbnRTaXplOjEzLCBsZXR0ZXJTcGFjaW5nOicwLjFlbScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogdGFiID09PSBjLmlkID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiB0YWIgPT09IGMuaWQgPyAnMXB4IHNvbGlkIHZhcigtLWdvbGQpJyA6ICcxcHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOi0xfX0+e2MubGFiZWx9PC9idXR0b24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDoxMCwgYWxpZ25JdGVtczonY2VudGVyJywgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImNvbW11bml0eS1zZWFyY2hcIiBjbGFzc05hbWU9XCJzci1vbmx5XCI+XHVBQzhDXHVDMkRDXHVBRTAwIFx1QUM4MFx1QzBDOTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJjb21tdW5pdHktc2VhcmNoXCJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RhYiA9PT0gXCJhbGxcIiA/IFwiXHVDODA0XHVDQ0I0IFx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUFDODBcdUMwQzkuLi5cIiA6IGAke2N1cnJlbnRCb2FyZD8ubGFiZWwgfHwgJyd9IFx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUFDODBcdUMwQzkuLi5gfVxuICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNofSBvbkNoYW5nZT17ZSA9PiBzZXRTZWFyY2goZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHN0eWxlPXt7d2lkdGg6MjAwLCBwYWRkaW5nOicxMHB4IDE0cHgnfX0vPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjb21tdW5pdHktc29ydFwiIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5cdUM4MTVcdUI4MkM8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBpZD1cImNvbW11bml0eS1zb3J0XCIgdmFsdWU9e3NvcnR9IG9uQ2hhbmdlPXtlID0+IHNldFNvcnQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHN0eWxlPXt7cGFkZGluZzonMTBweCAxMnB4JywgZm9udFNpemU6MTIsIGN1cnNvcjoncG9pbnRlcid9fT5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImxhdGVzdFwiPlx1Q0Q1Q1x1QzJFMFx1QzIxQzwvb3B0aW9uPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwidmlld3NcIj5cdUM4NzBcdUQ2OENcdUMyMUM8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJlcGxpZXNcIj5cdUIzMTNcdUFFMDBcdUMyMUM8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImxpa2VzXCI+XHVDODhCXHVDNTQ0XHVDNjk0XHVDMjFDPC9vcHRpb24+XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZCBidG4tc21hbGxcIiBvbkNsaWNrPXtoYW5kbGVXcml0ZX0+XG4gICAgICAgICAgICAgIHt1c2VyID8gJ1x1QUUwMFx1QzRGMFx1QUUzMCBcdUZGMEInIDogJ1x1Qjg1Q1x1QURGOFx1Qzc3OCBcdUQ2QzQgXHVBRTAwXHVDNEYwXHVBRTMwJ31cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogXHVBQzhDXHVDMkRDXHVEMzEwIFx1QzEyNFx1QkE4NSBcdTIwMTQgXHVEMkI5XHVDODE1IFx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUJERjBcdUM1RDBcdUMxMUNcdUI5Q0MgXHVENDVDXHVDMkRDICovfVxuICAgICAgICB7dGFiICE9PSBcImFsbFwiICYmIGN1cnJlbnRCb2FyZD8uZGVzYyAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZzonMTBweCAxNnB4JywgbWFyZ2luQm90dG9tOjE2LFxuICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmctMiknLCBib3JkZXJMZWZ0OiczcHggc29saWQgdmFyKC0tZ29sZCknLFxuICAgICAgICAgICAgZm9udFNpemU6MTMsIGNvbG9yOid2YXIoLS1pbmstMiknLCBsaW5lSGVpZ2h0OjEuNixcbiAgICAgICAgICB9fT57Y3VycmVudEJvYXJkLmRlc2N9PC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFx1QjlEMFx1QkEzOFx1QjlBQyBcdUQ1NDRcdUQxMzAgXHUyMDE0IFx1RDU3NFx1QjJGOSBcdUFDOENcdUMyRENcdUQzMTBcdUM1RDAgXHVCOUQwXHVCQTM4XHVCOUFDXHVBQzAwIFx1Qzc4OFx1Qzc0NCBcdUI1NENcdUI5Q0MgXHVENDVDXHVDMkRDICovfVxuICAgICAgICB7Ym9hcmRQcmVmaXhlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGdhcDo4LCBmbGV4V3JhcDond3JhcCcsIG1hcmdpbkJvdHRvbToxNn19PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlUHJlZml4KFwiXCIpfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6JzRweCAxNnB4JywgYm9yZGVyOicxcHggc29saWQnLFxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBhY3RpdmVQcmVmaXggPT09IFwiXCIgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWxpbmUtMiknLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmVQcmVmaXggPT09IFwiXCIgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYWN0aXZlUHJlZml4ID09PSBcIlwiID8gJ3JnYmEoMTU4LDEwNCwyNCwwLjA2KScgOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgY3Vyc29yOidwb2ludGVyJywgZm9udFNpemU6MTMsIGxldHRlclNwYWNpbmc6JzAuMDVlbScsXG4gICAgICAgICAgICAgIH19Plx1QzgwNFx1Q0NCNDwvYnV0dG9uPlxuICAgICAgICAgICAge2JvYXJkUHJlZml4ZXMubWFwKHAgPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT17cH0gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlUHJlZml4KGFjdGl2ZVByZWZpeCA9PT0gcCA/IFwiXCIgOiBwKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcGFkZGluZzonNHB4IDE2cHgnLCBib3JkZXI6JzFweCBzb2xpZCcsXG4gICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogYWN0aXZlUHJlZml4ID09PSBwID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lLTIpJyxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmVQcmVmaXggPT09IHAgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBhY3RpdmVQcmVmaXggPT09IHAgPyAncmdiYSgxNTgsMTA0LDI0LDAuMDYpJyA6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjoncG9pbnRlcicsIGZvbnRTaXplOjEzLCBsZXR0ZXJTcGFjaW5nOicwLjA1ZW0nLFxuICAgICAgICAgICAgICAgIH19PntwfTwvYnV0dG9uPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgPHRhYmxlIHN0eWxlPXt7d2lkdGg6JzEwMCUnLCBib3JkZXJDb2xsYXBzZTonY29sbGFwc2UnfX0+XG4gICAgICAgICAgPGNhcHRpb24gY2xhc3NOYW1lPVwic3Itb25seVwiPlx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUJBQTlcdUI4NUQ8L2NhcHRpb24+XG4gICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyIHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsIGZvbnRTaXplOjEwLCBsZXR0ZXJTcGFjaW5nOicwLjJlbScsIGNvbG9yOid2YXIoLS1pbmstMyknLCB0ZXh0VHJhbnNmb3JtOid1cHBlcmNhc2UnfX0+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiIHN0eWxlPXt7cGFkZGluZzonMTZweCA4cHgnLCB0ZXh0QWxpZ246J2xlZnQnLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB3aWR0aDo2MH19Plx1QkM4OFx1RDYzODwvdGg+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiIHN0eWxlPXt7cGFkZGluZzonMTZweCA4cHgnLCB0ZXh0QWxpZ246J2xlZnQnLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB3aWR0aDo5MH19Plx1QkQ4NFx1Qjk1ODwvdGg+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiIHN0eWxlPXt7cGFkZGluZzonMTZweCA4cHgnLCB0ZXh0QWxpZ246J2xlZnQnLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJywgYm9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XHVDODFDXHVCQUE5PC90aD5cbiAgICAgICAgICAgICAgPHRoIHNjb3BlPVwiY29sXCIgc3R5bGU9e3twYWRkaW5nOicxNnB4IDhweCcsIHRleHRBbGlnbjonbGVmdCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHdpZHRoOjEyMH19Plx1Qzc5MVx1QzEzMVx1Qzc5MDwvdGg+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiIHN0eWxlPXt7cGFkZGluZzonMTZweCA4cHgnLCB0ZXh0QWxpZ246J3JpZ2h0JywgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIGJvcmRlckJvdHRvbTonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgd2lkdGg6NzB9fT5cdUM4NzBcdUQ2OEM8L3RoPlxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIiBzdHlsZT17e3BhZGRpbmc6JzE2cHggOHB4JywgdGV4dEFsaWduOidyaWdodCcsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLCBib3JkZXJCb3R0b206JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIHdpZHRoOjEwMH19Plx1QjBBMFx1QzlEQzwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgPHRyPjx0ZCBjb2xTcGFuPXs2fSBzdHlsZT17e3BhZGRpbmc6NDgsIHRleHRBbGlnbjonY2VudGVyJ319IGNsYXNzTmFtZT1cImRpbVwiPlxuICAgICAgICAgICAgICAgIFx1Qzg3MFx1QUM3NFx1QzVEMCBcdUI5REVcdUIyOTQgXHVBQzhDXHVDMkRDXHVBRTAwXHVDNzc0IFx1QzVDNlx1QzJCNVx1QjJDOFx1QjJFNC5cbiAgICAgICAgICAgICAgPC90ZD48L3RyPlxuICAgICAgICAgICAgKSA6IHBhZ2VQb3N0cy5tYXAoKHAsIGkpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgY2F0ID0gY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5pZCA9PT0gcC5jYXRlZ29yeUlkKSB8fCBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmxhYmVsID09PSBwLmNhdGVnb3J5KSB8fCB7IGxhYmVsOiBwLmNhdGVnb3J5IH07XG4gICAgICAgICAgICAgIGNvbnN0IGxpa2VzQ291bnQgPSBBcnJheS5pc0FycmF5KHAubGlrZXMpID8gcC5saWtlcy5sZW5ndGggOiAwO1xuICAgICAgICAgICAgICBjb25zdCBib29rbWFya2VkID0gdXNlciAmJiBHLmNhbGwoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5pc0Jvb2ttYXJrZWQ/Lih1c2VyLmlkLCBwLmlkKSwgZmFsc2UpO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDx0ciBrZXk9e3AuaWR9IHN0eWxlPXt7Ym9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZSknLCB0cmFuc2l0aW9uOidiYWNrZ3JvdW5kIC4ycyd9fVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYmEoMjQ1LDIxMyw3MiwwLjAzKSd9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnfT5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCcsIGZvbnRTaXplOjEyfX0+e1N0cmluZyhmaWx0ZXJlZC5sZW5ndGggLSAocGFnZVN0YXJ0ICsgaSkpLnBhZFN0YXJ0KDMsICcwJyl9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17e3BhZGRpbmc6JzE4cHggOHB4J319PjxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCI+e2NhdC5sYWJlbH08L3NwYW4+PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17e3BhZGRpbmc6JzE4cHggOHB4JywgZm9udFNpemU6MTV9fSBjbGFzc05hbWU9XCJyb3ctdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0UG9zdElkKHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YWxsOid1bnNldCcsIGN1cnNvcjoncG9pbnRlcicsIHRleHRBbGlnbjonbGVmdCd9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7Ym9va21hcmtlZCAmJiA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCIgc3R5bGU9e3ttYXJnaW5SaWdodDo2LCBmb250U2l6ZToxMX19IGFyaWEtbGFiZWw9XCJcdUJEODFcdUI5QzhcdUQwNkNcIj5cdTI2MDU8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgIHtwLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgIHtwLmltYWdlcz8ubGVuZ3RoID4gMCAmJiA8c3BhbiBjbGFzc05hbWU9XCJnb2xkIG1vbm9cIiBzdHlsZT17e21hcmdpbkxlZnQ6OCwgZm9udFNpemU6MTB9fSBhcmlhLWxhYmVsPVwiXHVDNzc0XHVCQkY4XHVDOUMwIFx1Q0NBOFx1QkQ4MFwiPlx1RDgzRFx1RENGN3twLmltYWdlcy5sZW5ndGh9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7bGlrZXNDb3VudCA+IDAgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZCBtb25vXCIgc3R5bGU9e3ttYXJnaW5MZWZ0OjgsIGZvbnRTaXplOjEwfX0gYXJpYS1sYWJlbD1cIlx1QUNGNVx1QUMxMCBcdUMyMThcIj5cdTI2NjV7bGlrZXNDb3VudH08L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgIHtwLnRhZ3M/Lmxlbmd0aCA+IDAgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTIgbW9ub1wiIHN0eWxlPXt7bWFyZ2luTGVmdDo4LCBmb250U2l6ZToxMH19PntwLnRhZ3Muc2xpY2UoMCwzKS5tYXAodCA9PiBgIyR7dH1gKS5qb2luKCcgJyl9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICB7cC5ob3QgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIHN0eWxlPXt7bWFyZ2luTGVmdDo4LCBmb250U2l6ZToxMH19PkhPVDwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAge3AuX25ldyAmJiA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCIgc3R5bGU9e3ttYXJnaW5MZWZ0OjgsIGZvbnRTaXplOjEwfX0+TkVXPC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm1vbm8gZGltXCIgc3R5bGU9e3twYWRkaW5nOicxOHB4IDhweCcsIGZvbnRTaXplOjEyfX0+XG4gICAgICAgICAgICAgICAgICAgIHtwLmF1dGhvcn1cbiAgICAgICAgICAgICAgICAgICAgPEF1dGhvckdyYWRlQmFkZ2UgYXV0aG9ySWQ9e3AuYXV0aG9ySWR9IGF1dGhvcj17cC5hdXRob3J9IGF1dGhvckVtYWlsPXtwLmF1dGhvckVtYWlsfS8+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e3BhZGRpbmc6JzE4cHggOHB4JywgZm9udFNpemU6MTIsIHRleHRBbGlnbjoncmlnaHQnfX0+e3Audmlld3MgPz8gMH08L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e3BhZGRpbmc6JzE4cHggOHB4JywgZm9udFNpemU6MTEsIHRleHRBbGlnbjoncmlnaHQnfX0+XG4gICAgICAgICAgICAgICAgICAgIDx0aW1lIGRhdGVUaW1lPXtwLmRhdGUucmVwbGFjZSgvXFwuL2csJy0nKX0+e3AuZGF0ZX08L3RpbWU+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuXG4gICAgICAgIHsvKiBQYWdpbmF0aW9uICovfVxuICAgICAgICB7ZmlsdGVyZWQubGVuZ3RoID4gMCAmJiB0b3RhbFBhZ2VzID4gMSAmJiAoXG4gICAgICAgICAgPG5hdiBhcmlhLWxhYmVsPVwiXHVBQzhDXHVDMkRDXHVBRTAwIFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUM3NzRcdUIzRDlcIiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBqdXN0aWZ5Q29udGVudDonY2VudGVyJywgYWxpZ25JdGVtczonY2VudGVyJywgZ2FwOjYsIG1hcmdpblRvcDozMiwgZmxleFdyYXA6J3dyYXAnfX0+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UGFnZShNYXRoLm1heCgxLCBzYWZlUGFnZSAtIDEpKX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3NhZmVQYWdlIDw9IDF9Plx1MjE5MCBcdUM3NzRcdUM4MDQ8L2J1dHRvbj5cbiAgICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiB0b3RhbFBhZ2VzIH0sIChfLCBpZHgpID0+IGlkeCArIDEpLm1hcCgobikgPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT17bn0gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICAgICAgICAgIGFyaWEtY3VycmVudD17biA9PT0gc2FmZVBhZ2UgPyAncGFnZScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UGFnZShuKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IG4gPT09IHNhZmVQYWdlID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogbiA9PT0gc2FmZVBhZ2UgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBuID09PSBzYWZlUGFnZSA/ICdyZ2JhKDI0NSwyMTMsNzIsMC4wOCknIDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiAzNixcbiAgICAgICAgICAgICAgICB9fT57bn08L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFBhZ2UoTWF0aC5taW4odG90YWxQYWdlcywgc2FmZVBhZ2UgKyAxKSl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzYWZlUGFnZSA+PSB0b3RhbFBhZ2VzfT5cdUIyRTRcdUM3NEMgXHUyMTkyPC9idXR0b24+XG4gICAgICAgICAgPC9uYXY+XG4gICAgICAgICl9XG5cbiAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7dGV4dEFsaWduOidjZW50ZXInLCBmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4yZW0nLCBtYXJnaW5Ub3A6MTJ9fT5cbiAgICAgICAgICAgIFx1QzgwNFx1Q0NCNCB7ZmlsdGVyZWQubGVuZ3RofVx1QUM3NCBcdTAwQjcge3NhZmVQYWdlfS97dG90YWxQYWdlc30gXHVEMzk4XHVDNzc0XHVDOUMwXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFx1RDU1OFx1QjJFOCBcdUFDODBcdUMwQzkgKyBcdUFFMDBcdUM0RjBcdUFFMzAgXHVCQzE0ICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTonZmxleCcsIGdhcDoxMCwgYWxpZ25JdGVtczonY2VudGVyJywganVzdGlmeUNvbnRlbnQ6J2NlbnRlcicsXG4gICAgICAgICAgbWFyZ2luVG9wOjQwLCBwYWRkaW5nVG9wOjI0LCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgZmxleFdyYXA6J3dyYXAnLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImNvbW11bml0eS1zZWFyY2gtYm90dG9tXCIgY2xhc3NOYW1lPVwic3Itb25seVwiPlx1QUM4Q1x1QzJEQ1x1QUUwMCBcdUFDODBcdUMwQzk8L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dCBpZD1cImNvbW11bml0eS1zZWFyY2gtYm90dG9tXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0YWIgPT09IFwiYWxsXCIgPyBcIlx1QzgwNFx1Q0NCNCBcdUFDOENcdUMyRENcdUQzMTAgXHVBQzgwXHVDMEM5Li4uXCIgOiBgJHtjdXJyZW50Qm9hcmQ/LmxhYmVsIHx8ICcnfSBcdUFDOENcdUMyRENcdUQzMTAgXHVBQzgwXHVDMEM5Li4uYH1cbiAgICAgICAgICAgIHZhbHVlPXtzZWFyY2h9IG9uQ2hhbmdlPXtlID0+IHNldFNlYXJjaChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICBzdHlsZT17e3dpZHRoOjI4MCwgcGFkZGluZzonMTJweCAxNnB4JywgZm9udFNpemU6MTR9fS8+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkXCIgb25DbGljaz17aGFuZGxlV3JpdGV9XG4gICAgICAgICAgICBzdHlsZT17e3BhZGRpbmc6JzEycHggMjhweCcsIGZvbnRTaXplOjEzfX0+XG4gICAgICAgICAgICB7dXNlciA/ICdcdUFFMDBcdUM0RjBcdUFFMzAgXHVGRjBCJyA6ICdcdUI4NUNcdUFERjhcdUM3NzggXHVENkM0IFx1QUUwMFx1QzRGMFx1QUUzMCd9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7LyogdjAwLjA2OCBcdTIwMTQgXHVBRTAwXHVDNEYwXHVBRTMwIFx1QkFBOFx1QjJFQyAoXHVCQUE5XHVCODVEIFx1QzcwNFx1QzVEMCBcdUQ0NUNcdUMyREMpLiB1c2VNb2RhbEd1YXJkIFx1Qjg1QyBFU0MvXHVDNjc4XHVCRDgwXHVEMDc0XHVCOUFEIFx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNSBwcm9tcHQuICovfVxuICAgICAge3dyaXRpbmcgJiYgPFBvc3RDb21wb3NlTW9kYWwgb25DbG9zZT17KCkgPT4gc2V0V3JpdGluZyhudWxsKX0vPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PSBQb3N0IENvbXBvc2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gXHVDMEM4IFx1QUUwMCBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgXHVEMEE0IFx1MjAxNCBcdUMwQUNcdUM2QTlcdUM3OTBcdUJDQzRcdUI4NUMgXHVCRDg0XHVCOUFDKFx1QzVFQ1x1QjdFQyBcdUFDQzRcdUM4MTVcdUM3NzQgXHVBQzE5XHVDNzQwIFx1QkUwQ1x1Qjc3Q1x1QzZCMFx1QzgwMFx1Qjk3QyBcdUM0RjggXHVCNTRDIFx1QzExRVx1Qzc3NFx1QzlDMCBcdUM1NEFcdUIzQzRcdUI4NUQpLlxuY29uc3QgZHJhZnRLZXlGb3IgPSAodXNlcklkKSA9PiBgYmdual9wb3N0X2RyYWZ0XyR7dXNlcklkIHx8ICdndWVzdCd9YDtcblxuY29uc3QgUG9zdENvbXBvc2UgPSAoeyB1c2VyLCBpbml0aWFsUG9zdCwgb25DYW5jZWwsIG9uUHVibGlzaCwgY2F0ZWdvcmllcywgdXNlckxldmVsIH0pID0+IHtcbiAgY29uc3Qgd3JpdGFibGUgPSBjYXRlZ29yaWVzLmZpbHRlcihjID0+IHVzZXJMZXZlbCA+PSAoYy5wb3N0TWluTGV2ZWwgPz8gYy5taW5MZXZlbCA/PyAwKSk7XG4gIGNvbnN0IGRlZmF1bHRDYXRlZ29yeUlkID0gaW5pdGlhbFBvc3Q/LmNhdGVnb3J5SWQgfHwgd3JpdGFibGVbMF0/LmlkIHx8IGNhdGVnb3JpZXNbMF0/LmlkIHx8IFwiXCI7XG4gIGNvbnN0IGlzRWRpdGluZyA9ICEhaW5pdGlhbFBvc3Q7XG5cbiAgLy8gXHVDMEM4IFx1QUUwMCBcdUM3OTFcdUMxMzFcdUM3N0MgXHVCNTRDXHVCOUNDIFx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNSBcdUJDRjVcdUM2RDAvXHVDODAwXHVDN0E1LiBcdUMyMThcdUM4MTUgXHVCQUE4XHVCNERDXHVDNUQwXHVDMTFDXHVCMjk0IFx1QzZEMFx1QkNGOCBcdUFDOENcdUMyRENcdUFFMDBcdUM3NzQgc291cmNlIG9mIHRydXRoLlxuICBjb25zdCBkcmFmdEtleSA9IGRyYWZ0S2V5Rm9yKHVzZXI/LmlkKTtcbiAgY29uc3QgaW5pdGlhbERyYWZ0ID0gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGlzRWRpdGluZykgcmV0dXJuIG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGRyYWZ0S2V5KTtcbiAgICAgIHJldHVybiByYXcgPyBKU09OLnBhcnNlKHJhdykgOiBudWxsO1xuICAgIH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxuICB9LCBbZHJhZnRLZXksIGlzRWRpdGluZ10pO1xuXG4gIGNvbnN0IFtjYXRlZ29yeUlkLCBzZXRDYXRlZ29yeUlkXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxEcmFmdD8uY2F0ZWdvcnlJZCB8fCBkZWZhdWx0Q2F0ZWdvcnlJZCk7XG4gIGNvbnN0IFt0aXRsZSwgc2V0VGl0bGVdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LnRpdGxlIHx8IGluaXRpYWxEcmFmdD8udGl0bGUgfHwgXCJcIik7XG4gIGNvbnN0IFtwcmVmaXgsIHNldFByZWZpeF0gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsUG9zdD8ucHJlZml4IHx8IGluaXRpYWxEcmFmdD8ucHJlZml4IHx8IFwiXCIpO1xuICBjb25zdCBbdGFncywgc2V0VGFnc10gPSBSZWFjdC51c2VTdGF0ZShpbml0aWFsUG9zdD8udGFncyB8fCBpbml0aWFsRHJhZnQ/LnRhZ3MgfHwgW10pO1xuICBjb25zdCBbaW1hZ2VzLCBzZXRJbWFnZXNdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LmltYWdlcyB8fCBpbml0aWFsRHJhZnQ/LmltYWdlcyB8fCBbXSk7XG4gIGNvbnN0IFthdHRhY2htZW50cywgc2V0QXR0YWNobWVudHNdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LmF0dGFjaG1lbnRzIHx8IGluaXRpYWxEcmFmdD8uYXR0YWNobWVudHMgfHwgW10pO1xuICBjb25zdCBbYm9keUh0bWwsIHNldEJvZHlIdG1sXSA9IFJlYWN0LnVzZVN0YXRlKGluaXRpYWxQb3N0Py5ib2R5Py5odG1sIHx8IGluaXRpYWxEcmFmdD8uYm9keUh0bWwgfHwgXCJcIik7XG4gIGNvbnN0IFtib2R5VGV4dCwgc2V0Qm9keVRleHRdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbFBvc3Q/LmJvZHk/LnRleHQgfHwgaW5pdGlhbERyYWZ0Py5ib2R5VGV4dCB8fCBcIlwiKTtcbiAgLy8gdjAwLjExNSBcdTIwMTQgYWRtaW4gXHVCOUNDIFx1RDQ1Q1x1QzJEQzogXHVDNUM1XHVCODVDXHVCNERDIFx1QzJEQ1x1QzgxMCBcdUMyRENcdUFDMDQgXHVDNjI0XHVCQzg0XHVCNzdDXHVDNzc0XHVCNERDLiAnWVlZWS1NTS1ERFRISDpNTScgXHVENjE1XHVDMkREIChkYXRldGltZS1sb2NhbCBpbnB1dCkuXG4gIC8vIFx1QUUzMFx1Qzg3NCBcdUFFMDAgXHVDMjE4XHVDODE1IFx1QzJEQyBpbml0aWFsUG9zdC5jcmVhdGVkQXQgXHVDNzU4IEtTVCBcdUJEODBcdUJEODRcdUM3NDQgZGF0ZXRpbWUtbG9jYWwgXHVEM0VDXHVCOUY3XHVDNzNDXHVCODVDIFx1RDY1OFx1QzBCMFx1RDU3NCBcdUJCRjhcdUI5QUMgXHVDQzQ0XHVDNkMwLlxuICBjb25zdCBfdG9Mb2NhbElucHV0ID0gKGlzbykgPT4ge1xuICAgIGlmICghaXNvKSByZXR1cm4gXCJcIjtcbiAgICB0cnkge1xuICAgICAgLy8gS1NUIFx1QUUzMFx1QzkwMCAnWVlZWS1NTS1ERFRISDpNTScuXG4gICAgICBjb25zdCBwYXJ0cyA9IHdpbmRvdy5CR05KX0ZNVD8ua3N0RGF0ZVRpbWU/Lihpc28pO1xuICAgICAgaWYgKHBhcnRzKSByZXR1cm4gcGFydHMucmVwbGFjZSgnIEtTVCcsICcnKS5yZXBsYWNlKCcgJywgJ1QnKS5zbGljZSgwLCAxNik7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoaXNvKTtcbiAgICAgIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIHJldHVybiBgJHtkLmdldEZ1bGxZZWFyKCl9LSR7cGFkKGQuZ2V0TW9udGgoKSsxKX0tJHtwYWQoZC5nZXREYXRlKCkpfVQke3BhZChkLmdldEhvdXJzKCkpfToke3BhZChkLmdldE1pbnV0ZXMoKSl9YDtcbiAgICB9IGNhdGNoIHsgcmV0dXJuIFwiXCI7IH1cbiAgfTtcbiAgY29uc3QgW2NyZWF0ZWRBdCwgc2V0Q3JlYXRlZEF0XSA9IFJlYWN0LnVzZVN0YXRlKF90b0xvY2FsSW5wdXQoaW5pdGlhbFBvc3Q/LmNyZWF0ZWRBdCB8fCBpbml0aWFsUG9zdD8uY3JlYXRlZF9hdCB8fCBcIlwiKSk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gUmVhY3QudXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtkcmFmdFJlc3RvcmVkLCBzZXREcmFmdFJlc3RvcmVkXSA9IFJlYWN0LnVzZVN0YXRlKCEhKGluaXRpYWxEcmFmdCAmJiAoaW5pdGlhbERyYWZ0LnRpdGxlIHx8IGluaXRpYWxEcmFmdC5ib2R5VGV4dCkpKTtcbiAgY29uc3QgW3NhdmVkQXQsIHNldFNhdmVkQXRdID0gUmVhY3QudXNlU3RhdGUoaW5pdGlhbERyYWZ0Py5zYXZlZEF0IHx8IG51bGwpO1xuICBjb25zdCBwcmV2Q2F0ZWdvcnlJZFJlZiA9IFJlYWN0LnVzZVJlZihjYXRlZ29yeUlkKTtcblxuICAvLyBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgXHUyMDE0IFx1QzIxOFx1QzgxNSBcdUJBQThcdUI0REMgXHVDODFDXHVDNjc4LCAxXHVDRDA4IFx1QjUxNFx1QkMxNFx1QzZCNFx1QzJBNFx1Qjg1QyBcdUM4MDBcdUM3QTUuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzRWRpdGluZykgcmV0dXJuO1xuICAgIGNvbnN0IGhhc0NvbnRlbnQgPSAhISh0aXRsZS50cmltKCkgfHwgYm9keVRleHQudHJpbSgpIHx8ICh0YWdzICYmIHRhZ3MubGVuZ3RoKSB8fCAoaW1hZ2VzICYmIGltYWdlcy5sZW5ndGgpIHx8IChhdHRhY2htZW50cyAmJiBhdHRhY2htZW50cy5sZW5ndGgpKTtcbiAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaGFzQ29udGVudCkge1xuICAgICAgICAgIGNvbnN0IHNuYXBzaG90ID0geyBjYXRlZ29yeUlkLCB0aXRsZSwgcHJlZml4LCB0YWdzLCBpbWFnZXMsIGF0dGFjaG1lbnRzLCBib2R5SHRtbCwgYm9keVRleHQsIHNhdmVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9O1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGRyYWZ0S2V5LCBKU09OLnN0cmluZ2lmeShzbmFwc2hvdCkpO1xuICAgICAgICAgIHNldFNhdmVkQXQoc25hcHNob3Quc2F2ZWRBdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oZHJhZnRLZXkpO1xuICAgICAgICAgIHNldFNhdmVkQXQobnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2gge31cbiAgICB9LCA4MDApO1xuICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodCk7XG4gIH0sIFtkcmFmdEtleSwgaXNFZGl0aW5nLCBjYXRlZ29yeUlkLCB0aXRsZSwgcHJlZml4LCB0YWdzLCBpbWFnZXMsIGF0dGFjaG1lbnRzLCBib2R5SHRtbCwgYm9keVRleHRdKTtcblxuICBjb25zdCBjbGVhckRyYWZ0ID0gKCkgPT4ge1xuICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGRyYWZ0S2V5KTsgfSBjYXRjaCB7fVxuICAgIHNldFNhdmVkQXQobnVsbCk7XG4gICAgc2V0RHJhZnRSZXN0b3JlZChmYWxzZSk7XG4gIH07XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRDYXRlZ29yeUlkKGluaXRpYWxQb3N0Py5jYXRlZ29yeUlkIHx8IGRlZmF1bHRDYXRlZ29yeUlkKTtcbiAgICBzZXRUaXRsZShpbml0aWFsUG9zdD8udGl0bGUgfHwgXCJcIik7XG4gICAgc2V0UHJlZml4KGluaXRpYWxQb3N0Py5wcmVmaXggfHwgXCJcIik7XG4gICAgc2V0VGFncyhpbml0aWFsUG9zdD8udGFncyB8fCBbXSk7XG4gICAgc2V0SW1hZ2VzKGluaXRpYWxQb3N0Py5pbWFnZXMgfHwgW10pO1xuICAgIHNldEF0dGFjaG1lbnRzKGluaXRpYWxQb3N0Py5hdHRhY2htZW50cyB8fCBbXSk7XG4gICAgc2V0Qm9keUh0bWwoaW5pdGlhbFBvc3Q/LmJvZHk/Lmh0bWwgfHwgXCJcIik7XG4gICAgc2V0Qm9keVRleHQoaW5pdGlhbFBvc3Q/LmJvZHk/LnRleHQgfHwgXCJcIik7XG4gICAgc2V0RXJyb3IoXCJcIik7XG4gICAgcHJldkNhdGVnb3J5SWRSZWYuY3VycmVudCA9IGluaXRpYWxQb3N0Py5jYXRlZ29yeUlkIHx8IGRlZmF1bHRDYXRlZ29yeUlkO1xuICAgIC8vIGluaXRpYWxQb3N0IFx1QUMwMCBcdUI0RTRcdUM1QjRcdUM2MjRcdUJBNzQgKD0gXHVDMjE4XHVDODE1IFx1QkFBOFx1QjREQykgXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1XHVDNzQwIFx1QkIzNFx1QzJEQy5cbiAgfSwgW2luaXRpYWxQb3N0LCBkZWZhdWx0Q2F0ZWdvcnlJZF0pO1xuXG4gIGNvbnN0IHNlbGVjdGVkQ2F0ID0gY2F0ZWdvcmllcy5maW5kKGMgPT4gYy5pZCA9PT0gY2F0ZWdvcnlJZCk7XG4gIGNvbnN0IGJvYXJkUHJlZml4ZXMgPSBzZWxlY3RlZENhdD8ucHJlZml4ZXMgfHwgW107XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAocHJldkNhdGVnb3J5SWRSZWYuY3VycmVudCA9PT0gY2F0ZWdvcnlJZCkgcmV0dXJuO1xuICAgIHByZXZDYXRlZ29yeUlkUmVmLmN1cnJlbnQgPSBjYXRlZ29yeUlkO1xuICAgIGlmICghaXNFZGl0aW5nIHx8IGNhdGVnb3J5SWQgIT09IChpbml0aWFsUG9zdD8uY2F0ZWdvcnlJZCB8fCBcIlwiKSkge1xuICAgICAgc2V0UHJlZml4KFwiXCIpO1xuICAgIH1cbiAgfSwgW2NhdGVnb3J5SWQsIGluaXRpYWxQb3N0LCBpc0VkaXRpbmddKTtcblxuICBjb25zdCBzdWJtaXQgPSAoKSA9PiB7XG4gICAgc2V0RXJyb3IoXCJcIik7XG4gICAgaWYgKCF0aXRsZS50cmltKCkpIHJldHVybiBzZXRFcnJvcihcIlx1QzgxQ1x1QkFBOVx1Qzc0NCBcdUM3ODVcdUI4MjVcdUQ1NzRcdUM4RkNcdUMxMzhcdUM2OTQuXCIpO1xuICAgIGlmICghYm9keVRleHQudHJpbSgpKSByZXR1cm4gc2V0RXJyb3IoXCJcdUJDRjhcdUJCMzhcdUM3NDQgXHVDNzg1XHVCODI1XHVENTc0XHVDOEZDXHVDMTM4XHVDNjk0LlwiKTtcbiAgICBjb25zdCBjYXQgPSBjYXRlZ29yaWVzLmZpbmQoYyA9PiBjLmlkID09PSBjYXRlZ29yeUlkKTtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAvLyBcdUJDMUNcdUQ1ODkgXHVDMTMxXHVBQ0Y1IFx1QUMwMFx1QzgxNVx1QzczQ1x1Qjg1QyBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgXHVDODE1XHVCOUFDIChcdUMyRTRcdUQzMjggXHVDMkRDIG9uUHVibGlzaCBcdUNFMjFcdUM1RDBcdUMxMUMgXHVCMkU0XHVDMkRDIFx1QzgwMFx1QzdBNVx1Qzc0MCBcdUM1NDggXHVENTY4KS5cbiAgICBpZiAoIWlzRWRpdGluZykge1xuICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oZHJhZnRLZXkpOyB9IGNhdGNoIHt9XG4gICAgfVxuICAgIC8vIHYwMC4xMTUgXHUyMDE0IGFkbWluIFx1QjlDQyBjcmVhdGVkQXQgXHVDNjI0XHVCQzg0XHVCNzdDXHVDNzc0XHVCNERDIFx1QUMwMFx1QjJBNS4gXHVCMkU0XHVCOTc4IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUFDMTIgXHVDODA0XHVDMUExXHVDNzQwIFx1QzZDQ1x1Q0VFNFx1QUMwMCBcdUJCMzRcdUMyREMuXG4gICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgIGNhdGVnb3J5SWQ6IGNhdC5pZCxcbiAgICAgIGNhdGVnb3J5OiBjYXQubGFiZWwsXG4gICAgICBwcmVmaXg6IHByZWZpeCB8fCBcIlwiLFxuICAgICAgdGl0bGU6IHRpdGxlLnRyaW0oKSxcbiAgICAgIGF1dGhvcjogdXNlcj8ubmFtZSB8fCBcIlx1Qzc3NVx1QkE4NVwiLFxuICAgICAgYXV0aG9ySWQ6IHVzZXI/LmlkIHx8IG51bGwsXG4gICAgICBhdXRob3JFbWFpbDogdXNlcj8uZW1haWwgfHwgbnVsbCxcbiAgICAgIHJlcGxpZXM6IGluaXRpYWxQb3N0Py5yZXBsaWVzID8/IDAsXG4gICAgICB2aWV3czogaW5pdGlhbFBvc3Q/LnZpZXdzID8/IDAsXG4gICAgICBkYXRlOiBgJHtub3cuZ2V0RnVsbFllYXIoKX0uJHtwYWQobm93LmdldE1vbnRoKCkrMSl9LiR7cGFkKG5vdy5nZXREYXRlKCkpfWAsXG4gICAgICB0YWdzLFxuICAgICAgaW1hZ2VzLFxuICAgICAgYXR0YWNobWVudHMsXG4gICAgICBfbmV3OiB0cnVlLFxuICAgICAgX3VzZXJDcmVhdGVkOiB0cnVlLFxuICAgICAgYm9keTogeyBodG1sOiBib2R5SHRtbCwgdGV4dDogYm9keVRleHQgfSxcbiAgICB9O1xuICAgIGlmICh1c2VyPy5pc0FkbWluICYmIGNyZWF0ZWRBdCkge1xuICAgICAgLy8gJ1lZWVktTU0tRERUSEg6TU0nIChLU1QgXHVBQzAwXHVDODE1KSBcdTIxOTIgSVNPIDg2MDEgd2l0aCArMDk6MDAuXG4gICAgICBwYXlsb2FkLmNyZWF0ZWRBdCA9IGAke2NyZWF0ZWRBdH06MDArMDk6MDBgO1xuICAgIH1cbiAgICBvblB1Ymxpc2gocGF5bG9hZCk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb25cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgc3R5bGU9e3ttYXhXaWR0aDo5NjB9fT5cbiAgICAgICAgPGhlYWRlciBzdHlsZT17e21hcmdpbkJvdHRvbTozMn19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+Q09NUE9TRSBcdTAwQjcgXHVBRTAwXHVDNEYwXHVBRTMwPC9kaXY+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInNlY3Rpb24tdGl0bGVcIiBzdHlsZT17e2ZvbnRTaXplOjM2fX0+e2lzRWRpdGluZyA/IFwiXHVBQzhDXHVDMkRDXHVBRTAwIFx1QzIxOFx1QzgxNVwiIDogXCJcdUMwQzggXHVBRTAwIFx1Qzc5MVx1QzEzMVwifTwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxMywgbWFyZ2luVG9wOjh9fT5cbiAgICAgICAgICAgIFx1Qzc5MVx1QzEzMVx1Qzc5MDogPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiPnt1c2VyPy5uYW1lIHx8ICdcdUM3NzVcdUJBODUnfTwvc3Bhbj5cbiAgICAgICAgICAgIHshaXNFZGl0aW5nICYmIHNhdmVkQXQgJiYgKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaW0tMiBtb25vXCIgc3R5bGU9e3ttYXJnaW5MZWZ0OjE0LCBmb250U2l6ZToxMX19PlxuICAgICAgICAgICAgICAgIFx1MDBCNyBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTVcdUI0MjggKHtuZXcgRGF0ZShzYXZlZEF0KS50b0xvY2FsZVRpbWVTdHJpbmcoJ2tvLUtSJywge2hvdXI6JzItZGlnaXQnLCBtaW51dGU6JzItZGlnaXQnfSl9KVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICB7IWlzRWRpdGluZyAmJiBkcmFmdFJlc3RvcmVkICYmIChcbiAgICAgICAgICAgIDxkaXYgcm9sZT1cInN0YXR1c1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgIG1hcmdpblRvcDoxNCwgcGFkZGluZzonMTBweCAxNHB4JywgYmFja2dyb3VuZDoncmdiYSgyNDUsMjEzLDcyLDAuMDYpJyxcbiAgICAgICAgICAgICAgYm9yZGVyOicxcHggc29saWQgdmFyKC0tZ29sZC1kaW0pJywgZm9udFNpemU6MTIsIGNvbG9yOid2YXIoLS1pbmstMiknLFxuICAgICAgICAgICAgICBkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBnYXA6MTIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHNwYW4+XHVDNzc0XHVDODA0XHVDNUQwIFx1Qzc5MVx1QzEzMVx1RDU1OFx1QjM1OCBcdUFFMDBcdUM3NDQgXHVCQ0Y1XHVDNkQwXHVENTg4XHVDMkI1XHVCMkM4XHVCMkU0Ljwvc3Bhbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoY29uZmlybSgnXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1XHVCNDFDIFx1QUUwMFx1Qzc0NCBcdUMwQURcdUM4MUNcdUQ1NThcdUFDRTAgXHVDMEM4XHVCODVDIFx1QzJEQ1x1Qzc5MVx1RDU1OFx1QzJEQ1x1QUNBMFx1QzVCNFx1QzY5ND8nKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaXRsZSgnJyk7IHNldFByZWZpeCgnJyk7IHNldFRhZ3MoW10pOyBzZXRJbWFnZXMoW10pO1xuICAgICAgICAgICAgICAgICAgICBzZXRCb2R5SHRtbCgnJyk7IHNldEJvZHlUZXh0KCcnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJEcmFmdCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tmb250U2l6ZToxMSwgY29sb3I6J3ZhcigtLWRhbmdlciknLCB0ZXh0RGVjb3JhdGlvbjondW5kZXJsaW5lJ319PlxuICAgICAgICAgICAgICAgIFx1QzBDOFx1Qjg1QyBcdUMyRENcdUM3OTFcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICA8Zm9ybSBvblN1Ym1pdD17KGUpID0+IHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzdWJtaXQoKTsgfX0gbm9WYWxpZGF0ZT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6JzE2MHB4IDFmcicsIGdhcDoxNiwgbWFyZ2luQm90dG9tOiBib2FyZFByZWZpeGVzLmxlbmd0aCA+IDAgPyAxMiA6IDIwfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCIgc3R5bGU9e3ttYXJnaW46MH19PlxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIiBodG1sRm9yPVwicG9zdC1jYXRcIj5cdUFDOENcdUMyRENcdUQzMTA8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwicG9zdC1jYXRcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2NhdGVnb3J5SWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0Q2F0ZWdvcnlJZChlLnRhcmdldC52YWx1ZSl9PlxuICAgICAgICAgICAgICAgIHt3cml0YWJsZS5tYXAoYyA9PiAoXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17Yy5pZH0gdmFsdWU9e2MuaWR9PntjLmxhYmVsfTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiIHN0eWxlPXt7bWFyZ2luOjB9fT5cbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCIgaHRtbEZvcj1cInBvc3QtdGl0bGVcIj5cdUM4MUNcdUJBQTkgPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPio8L3NwYW4+PC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwicG9zdC10aXRsZVwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlx1QzgxQ1x1QkFBOVx1Qzc0NCBcdUM3ODVcdUI4MjVcdUQ1NThcdUMxMzhcdUM2OTRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXt0aXRsZX0gb25DaGFuZ2U9e2UgPT4gc2V0VGl0bGUoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHJlcXVpcmVkIG1heExlbmd0aD17MTIwfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBcdUI5RDBcdUJBMzhcdUI5QUMgXHVDMTIwXHVEMEREIFx1MjAxNCBcdUMxMjBcdUQwRERcdUI0MUMgXHVBQzhDXHVDMkRDXHVEMzEwXHVDNUQwIFx1QjlEMFx1QkEzOFx1QjlBQ1x1QUMwMCBcdUM3ODhcdUM3NDQgXHVCNTRDXHVCOUNDIFx1RDQ1Q1x1QzJEQyAqL31cbiAgICAgICAgICB7Ym9hcmRQcmVmaXhlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIiBzdHlsZT17e21hcmdpbkJvdHRvbToyMH19PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCI+XHVCOUQwXHVCQTM4XHVCOUFDPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjgsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRQcmVmaXgoXCJcIil9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e3BhZGRpbmc6JzRweCAxNHB4JywgYm9yZGVyOicxcHggc29saWQnLCBib3JkZXJDb2xvcjogcHJlZml4ID09PSBcIlwiID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1saW5lKScsIGNvbG9yOiBwcmVmaXggPT09IFwiXCIgPyAndmFyKC0tZ29sZCknIDogJ3ZhcigtLWluay0yKScsIGJhY2tncm91bmQ6J25vbmUnLCBjdXJzb3I6J3BvaW50ZXInLCBmb250U2l6ZToxMywgbGV0dGVyU3BhY2luZzonMC4wNWVtJ319PlxuICAgICAgICAgICAgICAgICAgXHVDNUM2XHVDNzRDXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAge2JvYXJkUHJlZml4ZXMubWFwKChwKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17cH0gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFByZWZpeChwKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nOic0cHggMTRweCcsIGJvcmRlcjonMXB4IHNvbGlkJywgYm9yZGVyQ29sb3I6IHByZWZpeCA9PT0gcCA/ICd2YXIoLS1nb2xkKScgOiAndmFyKC0tbGluZSknLCBjb2xvcjogcHJlZml4ID09PSBwID8gJ3ZhcigtLWdvbGQpJyA6ICd2YXIoLS1pbmstMiknLCBiYWNrZ3JvdW5kOiBwcmVmaXggPT09IHAgPyAncmdiYSgyNDUsMjEzLDcyLDAuMDgpJyA6ICdub25lJywgY3Vyc29yOidwb2ludGVyJywgZm9udFNpemU6MTMsIGxldHRlclNwYWNpbmc6JzAuMDVlbSd9fT5cbiAgICAgICAgICAgICAgICAgICAge3B9XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAgey8qIEhhc2h0YWdzICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIj5cdUQ1NzRcdUMyRENcdUQwRENcdUFERjggLyBcdUJBNTRcdUQwQzBcdUQwRENcdUFERjg8L2Rpdj5cbiAgICAgICAgICAgIDxIYXNodGFnSW5wdXQgdGFncz17dGFnc30gc2V0VGFncz17c2V0VGFnc30vPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFRpcHRhcCBlZGl0b3IgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWxcIj5cdUJDRjhcdUJCMzggPHNwYW4gY2xhc3NOYW1lPVwiZ29sZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPio8L3NwYW4+PC9kaXY+XG4gICAgICAgICAgICAgIDxUaXB0YXBFZGl0b3Iga2V5PXtpbml0aWFsUG9zdD8uaWQgfHwgXCJuZXdcIn1cbiAgICAgICAgICAgICAgICBwcmVzZXQ9XCJzaW1wbGVcIlxuICAgICAgICAgICAgICAgIGNvbnRlbnQ9e2JvZHlIdG1sfVxuICAgICAgICAgICAgICAgIG9uVXBkYXRlPXsoaHRtbCwgX2pzb24sIHRleHQpID0+IHsgc2V0Qm9keUh0bWwoaHRtbCk7IHNldEJvZHlUZXh0KHRleHQpOyB9fVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiXHVCQ0Y4XHVCQjM4XHVDNzQ0IFx1Qzc4NVx1QjgyNVx1RDU1OFx1QzEzOFx1QzY5NC4uLlwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIEltYWdlIGF0dGFjaG1lbnRzICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgIDxJbWFnZUF0dGFjaGVyIGltYWdlcz17aW1hZ2VzfSBzZXRJbWFnZXM9e3NldEltYWdlc30gbWF4PXsxMH0vPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIEZpbGUgYXR0YWNobWVudHMgKHYwMC4wNjkpICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgIDxGaWxlQXR0YWNoZXIgZmlsZXM9e2F0dGFjaG1lbnRzfSBzZXRGaWxlcz17c2V0QXR0YWNobWVudHN9Lz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiB2MDAuMTE1IFx1MjAxNCBhZG1pbiBcdUI5Q0MgXHVENDVDXHVDMkRDOiBcdUM1QzVcdUI4NUNcdUI0REMgXHVDMkRDXHVDODEwIFx1QzJEQ1x1QUMwNChcdUQ0NUNcdUMyRENcdUM2QTkpIFx1QzYyNFx1QkM4NFx1Qjc3Q1x1Qzc3NFx1QjREQy4gXHVCRTQ0XHVDNkIwXHVCQTc0IFx1RDYwNFx1QzdBQyBcdUMyRENcdUFDMDQuICovfVxuICAgICAgICAgIHt1c2VyPy5pc0FkbWluICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIiBzdHlsZT17e3BhZGRpbmc6JzEycHggMTRweCcsIGJhY2tncm91bmQ6J3JnYmEoMjQ1LDIxMyw3MiwwLjA0KScsIGJvcmRlcjonMXB4IGRhc2hlZCB2YXIoLS1nb2xkLWRpbSknLCBtYXJnaW5Ub3A6MTJ9fT5cbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsXCIgaHRtbEZvcj1cInBvc3QtY3JlYXRlZC1hdFwiIHN0eWxlPXt7ZGlzcGxheTonYmxvY2snLCBtYXJnaW5Cb3R0b206Nn19PlxuICAgICAgICAgICAgICAgIFx1QzVDNVx1Qjg1Q1x1QjREQyBcdUMyRENcdUFDMDQgKFx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUM4MDRcdUM2QTkgXHUwMEI3IFx1QkU0NFx1QzZDQ1x1QjQ1MFx1QkE3NCBcdUQ2MDRcdUM3QUMgXHVDMkRDXHVBQzA0KVxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJwb3N0LWNyZWF0ZWQtYXRcIiB0eXBlPVwiZGF0ZXRpbWUtbG9jYWxcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2NyZWF0ZWRBdH0gb25DaGFuZ2U9eyhlKSA9PiBzZXRDcmVhdGVkQXQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7bWF4V2lkdGg6MjgwfX0vPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpbS0yIG1vbm9cIiBzdHlsZT17e2ZvbnRTaXplOjExLCBtYXJnaW5Ub3A6NH19PlxuICAgICAgICAgICAgICAgIEtTVCBcdUFFMzBcdUM5MDAuIFx1Qzc4NVx1QjgyNSBcdUMyREMgXHVBQzhDXHVDMkRDXHVBRTAwIFx1RDQ1Q1x1QzJEQyBcdUMyRENcdUFDMDFcdUM3NzQgXHVDNzc0IFx1QUMxMlx1QzczQ1x1Qjg1QyBcdUFDRTBcdUM4MTVcdUI0MjguXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtlcnJvciAmJiAoXG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJhbGVydFwiIHN0eWxlPXt7cGFkZGluZzonMTJweCAxNnB4JywgYmFja2dyb3VuZDoncmdiYSgxOTQsNzQsNjEsMC4xKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWRhbmdlciknLCBjb2xvcjondmFyKC0tZGFuZ2VyKScsIGZvbnRTaXplOjEzLCBtYXJnaW5Cb3R0b206MTZ9fT5cbiAgICAgICAgICAgICAge2Vycm9yfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEyLCBqdXN0aWZ5Q29udGVudDonZmxleC1lbmQnLCBwYWRkaW5nVG9wOjIwLCBib3JkZXJUb3A6JzFweCBzb2xpZCB2YXIoLS1saW5lKSd9fT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9e29uQ2FuY2VsfT5cdUNERThcdUMxOEM8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ29sZFwiPntpc0VkaXRpbmcgPyBcIlx1QzIxOFx1QzgxNSBcdUM4MDBcdUM3QTUgXHUyMTkyXCIgOiBcIlx1QUM4Q1x1QzJEQ1x1RDU1OFx1QUUzMCBcdTIxOTJcIn08L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyA9PT0gUG9zdCBEZXRhaWwgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCBQb3N0RGV0YWlsID0gKHsgcG9zdCwgZ28sIHNldFBvc3RJZCwgdXNlciwgb25SZWZyZXNoLCBvbkVkaXQgfSkgPT4ge1xuICBjb25zdCBHID0gd2luZG93LkJHTkpfR1VBUkQ7XG4gIGNvbnN0IFtjb21tZW50LCBzZXRDb21tZW50XSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbY29tbWVudHNMaXN0LCBzZXRDb21tZW50c0xpc3RdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4gRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5nZXRDb21tZW50cz8uKHBvc3QuaWQpKSk7XG4gIGNvbnN0IFtyZXBvcnRPcGVuLCBzZXRSZXBvcnRPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3JlcG9ydFJlYXNvbiwgc2V0UmVwb3J0UmVhc29uXSA9IFJlYWN0LnVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbcmVwb3J0U3VibWl0dGVkLCBzZXRSZXBvcnRTdWJtaXR0ZWRdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBjYW5NYW5hZ2VQb3N0ID0gISF1c2VyICYmICh1c2VyLmlzQWRtaW4gfHwgcG9zdC5hdXRob3JJZCA9PT0gdXNlci5pZCB8fCBwb3N0LmF1dGhvciA9PT0gdXNlci5uYW1lKTtcblxuICAvLyBcdUM4OEJcdUM1NDRcdUM2OTQgLyBcdUJEODFcdUI5QzhcdUQwNkMgXHUyMDE0IFx1QzgwMFx1QzdBNVx1QzE4QyBcdUFFMzBcdUJDMThcbiAgY29uc3QgbGlrZXMgPSBBcnJheS5pc0FycmF5KHBvc3QubGlrZXMpID8gcG9zdC5saWtlcyA6IFtdO1xuICBjb25zdCBsaWtlZCA9ICEhdXNlciAmJiBsaWtlcy5pbmNsdWRlcyh1c2VyLmlkKTtcbiAgY29uc3QgbGlrZXNDb3VudCA9IGxpa2VzLmxlbmd0aDtcbiAgY29uc3QgYm9va21hcmtlZCA9ICEhdXNlciAmJiBHLmNhbGwoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5pc0Jvb2ttYXJrZWQ/Lih1c2VyLmlkLCBwb3N0LmlkKSwgZmFsc2UpO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0Q29tbWVudHNMaXN0KEcuYXJyKCgpID0+IHdpbmRvdy5CR05KX0NPTU1VTklUWT8uZ2V0Q29tbWVudHM/Lihwb3N0LmlkKSkpO1xuICAgIC8vIFx1QzExQ1x1QkM4NCBcdUFDOENcdUMyRENcdUFFMDBcdUM3NzRcdUJBNzQgXHVDMTFDXHVCQzg0XHVDNUQwXHVDMTFDIFx1QjMxM1x1QUUwMCBcdUIzRDlcdUFFMzBcdUQ2NTRcbiAgICBpZiAocG9zdC5fcmVtb3RlKSB7XG4gICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFk/LnJlZnJlc2hDb21tZW50cz8uKHBvc3QuaWQpPy50aGVuPy4oKCkgPT4ge1xuICAgICAgICBzZXRDb21tZW50c0xpc3QoRy5hcnIoKCkgPT4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5nZXRDb21tZW50cz8uKHBvc3QuaWQpKSk7XG4gICAgICB9KT8uY2F0Y2g/LigoKSA9PiB7fSk7XG4gICAgfVxuICAgIGNvbnN0IG9uUmVmcmVzaENvbW1lbnRzID0gKGUpID0+IHtcbiAgICAgIGlmIChlLmRldGFpbCAmJiBTdHJpbmcoZS5kZXRhaWwucG9zdElkKSA9PT0gU3RyaW5nKHBvc3QuaWQpKSB7XG4gICAgICAgIHNldENvbW1lbnRzTGlzdCh3aW5kb3cuQkdOSl9DT01NVU5JVFkuZ2V0Q29tbWVudHMocG9zdC5pZCkpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JnbmotY29tbWVudHMtcmVmcmVzaCcsIG9uUmVmcmVzaENvbW1lbnRzKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotY29tbWVudHMtcmVmcmVzaCcsIG9uUmVmcmVzaENvbW1lbnRzKTtcbiAgfSwgW3Bvc3QuaWRdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGtleSA9IGBiZ25qX3ZpZXdlZF9wb3N0XyR7cG9zdC5pZH1gO1xuICAgIHRyeSB7XG4gICAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpKSByZXR1cm47XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSwgXCIxXCIpO1xuICAgIH0gY2F0Y2gge31cbiAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFkuaW5jcmVtZW50Vmlld3MocG9zdC5pZCk7XG4gICAgb25SZWZyZXNoPy4oKTtcbiAgfSwgW3Bvc3QuaWRdKTtcblxuICBjb25zdCByZXF1aXJlTG9naW4gPSAobGFiZWwpID0+IHtcbiAgICBpZiAoY29uZmlybShgJHtsYWJlbH1cdUM3NDAoXHVCMjk0KSBcdUI4NUNcdUFERjhcdUM3NzggXHVENkM0IFx1Qzc3NFx1QzZBOVx1RDU2MCBcdUMyMTggXHVDNzg4XHVDMkI1XHVCMkM4XHVCMkU0LiBcdUI4NUNcdUFERjhcdUM3NzggXHVEMzk4XHVDNzc0XHVDOUMwXHVCODVDIFx1Qzc3NFx1QjNEOVx1RDU1OFx1QzJEQ1x1QUNBMFx1QzVCNFx1QzY5ND9gKSkge1xuICAgICAgZ28oJ2xvZ2luJyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUxpa2UgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCF1c2VyKSByZXR1cm4gcmVxdWlyZUxvZ2luKCdcdUFDRjVcdUFDMTAnKTtcbiAgICB0cnkgeyBhd2FpdCB3aW5kb3cuQkdOSl9DT01NVU5JVFkudG9nZ2xlTGlrZShwb3N0LmlkLCB1c2VyLmlkKTsgb25SZWZyZXNoPy4oKTsgfVxuICAgIGNhdGNoIChlcnIpIHsgYWxlcnQoYFx1QUNGNVx1QUMxMCBcdUNDOThcdUI5QUMgXHVDMkU0XHVEMzI4OiAke2Vycj8ubWVzc2FnZSB8fCAnXHVDNTRDIFx1QzIxOCBcdUM1QzZcdUIyOTQgXHVDNjI0XHVCOTU4J31gKTsgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUJvb2ttYXJrID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICghdXNlcikgcmV0dXJuIHJlcXVpcmVMb2dpbignXHVCRDgxXHVCOUM4XHVEMDZDJyk7XG4gICAgdHJ5IHsgYXdhaXQgd2luZG93LkJHTkpfQ09NTVVOSVRZLnRvZ2dsZUJvb2ttYXJrKHVzZXIuaWQsIHBvc3QuaWQpOyBvblJlZnJlc2g/LigpOyB9XG4gICAgY2F0Y2ggKGVycikgeyBhbGVydChgXHVCRDgxXHVCOUM4XHVEMDZDIFx1Q0M5OFx1QjlBQyBcdUMyRTRcdUQzMjg6ICR7ZXJyPy5tZXNzYWdlIHx8ICdcdUM1NEMgXHVDMjE4IFx1QzVDNlx1QjI5NCBcdUM2MjRcdUI5NTgnfWApOyB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlUmVwb3J0U3VibWl0ID0gYXN5bmMgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHdpbmRvdy5CR05KX0NPTU1VTklUWS5hZGRSZXBvcnQoe1xuICAgICAgICBwb3N0SWQ6IHBvc3QuaWQsXG4gICAgICAgIHBvc3RUaXRsZTogcG9zdC50aXRsZSxcbiAgICAgICAgcmVwb3J0ZXJJZDogdXNlcj8uaWQgfHwgbnVsbCxcbiAgICAgICAgcmVwb3J0ZXJOYW1lOiB1c2VyPy5uYW1lIHx8ICdcdUM3NzVcdUJBODUnLFxuICAgICAgICByZWFzb246IHJlcG9ydFJlYXNvbixcbiAgICAgIH0pO1xuICAgICAgc2V0UmVwb3J0U3VibWl0dGVkKHRydWUpO1xuICAgICAgc2V0UmVwb3J0UmVhc29uKFwiXCIpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHNldFJlcG9ydE9wZW4oZmFsc2UpOyBzZXRSZXBvcnRTdWJtaXR0ZWQoZmFsc2UpOyB9LCAxODAwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGFsZXJ0KGBcdUMyRTBcdUFDRTAgXHVDODExXHVDMjE4IFx1QzJFNFx1RDMyODogJHtlcnI/Lm1lc3NhZ2UgfHwgJ1x1QzU0QyBcdUMyMTggXHVDNUM2XHVCMjk0IFx1QzYyNFx1Qjk1OCd9YCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHN1Ym1pdENvbW1lbnQgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoIXVzZXIpIHJldHVybjtcbiAgICBjb25zdCB0cmltbWVkID0gY29tbWVudC50cmltKCk7XG4gICAgaWYgKCF0cmltbWVkKSByZXR1cm47XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgY29uc3QgbmV4dCA9IHdpbmRvdy5CR05KX0NPTU1VTklUWS5hZGRDb21tZW50KHBvc3QuaWQsIHtcbiAgICAgIGlkOiBgY29tbWVudC0ke0RhdGUubm93KCl9YCxcbiAgICAgIGF1dGhvcjogdXNlci5uYW1lLFxuICAgICAgYXV0aG9ySWQ6IHVzZXIuaWQsXG4gICAgICBhdXRob3JFbWFpbDogdXNlci5lbWFpbCxcbiAgICAgIGRhdGU6IGAke25vdy5nZXRGdWxsWWVhcigpfS4ke3BhZChub3cuZ2V0TW9udGgoKSsxKX0uJHtwYWQobm93LmdldERhdGUoKSl9ICR7cGFkKG5vdy5nZXRIb3VycygpKX06JHtwYWQobm93LmdldE1pbnV0ZXMoKSl9YCxcbiAgICAgIHRleHQ6IHRyaW1tZWQsXG4gICAgfSk7XG4gICAgc2V0Q29tbWVudHNMaXN0KG5leHQpO1xuXG4gICAgLy8gXHVCQ0Y4XHVDNzc4IFx1QUUwMFx1Qzc3NCBcdUM1NDRcdUIyQzhcdUJBNzQgXHVDNzkxXHVDMTMxXHVDNzkwXHVDNUQwXHVBQzhDIFx1QzU0Q1x1QjlCQy4gYXV0aG9ySWRcdUFDMDAgXHVDNzg4XHVDNUI0XHVDNTdDIFx1RDQ3OFx1QzJEQyBcdUFDMDBcdUIyQTUuXG4gICAgY29uc3QgaXNNeU93blBvc3QgPSBwb3N0LmF1dGhvcklkID09PSB1c2VyLmlkIHx8IHBvc3QuYXV0aG9yID09PSB1c2VyLm5hbWU7XG4gICAgaWYgKCFpc015T3duUG9zdCAmJiBwb3N0LmF1dGhvcklkKSB7XG4gICAgICB3aW5kb3cuQkdOSl9DT01NVU5JVFkuYWRkTm90aWZpY2F0aW9uKHBvc3QuYXV0aG9ySWQsIHtcbiAgICAgICAgdHlwZTogJ2NvbW1lbnQnLFxuICAgICAgICBwb3N0SWQ6IHBvc3QuaWQsXG4gICAgICAgIHBvc3RUaXRsZTogcG9zdC50aXRsZSxcbiAgICAgICAgZnJvbU5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgbWVzc2FnZTogJ1x1QjBCNCBcdUFFMDBcdUM1RDAgXHVDMEM4IFx1QjMxM1x1QUUwMFx1Qzc3NCBcdUIyRUNcdUI4MzhcdUMyQjVcdUIyQzhcdUIyRTQuJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uUmVmcmVzaD8uKCk7XG4gICAgc2V0Q29tbWVudChcIlwiKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVQb3N0ID0gKCkgPT4ge1xuICAgIGlmICghY29uZmlybShgXCIke3Bvc3QudGl0bGV9XCIgXHVBRTAwXHVDNzQ0IFx1QzBBRFx1QzgxQ1x1RDU1OFx1QzJEQ1x1QUNBMFx1QzVCNFx1QzY5ND9gKSkgcmV0dXJuO1xuICAgIHdpbmRvdy5CR05KX0NPTU1VTklUWS5kZWxldGVQb3N0KHBvc3QuaWQpO1xuICAgIG9uUmVmcmVzaD8uKCk7XG4gICAgc2V0UG9zdElkKG51bGwpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZUNvbW1lbnQgPSAoY29tbWVudElkKSA9PiB7XG4gICAgY29uc3QgbmV4dCA9IHdpbmRvdy5CR05KX0NPTU1VTklUWS5kZWxldGVDb21tZW50KHBvc3QuaWQsIGNvbW1lbnRJZCk7XG4gICAgc2V0Q29tbWVudHNMaXN0KG5leHQpO1xuICAgIG9uUmVmcmVzaD8uKCk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8YXJ0aWNsZSBjbGFzc05hbWU9XCJzZWN0aW9uIHBvc3QtcmVhZFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgcG9zdC1yZWFkLWNvbnRhaW5lclwiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBzZXRQb3N0SWQobnVsbCl9XG4gICAgICAgICAgc3R5bGU9e3ttYXJnaW5Cb3R0b206MzIsIGNvbG9yOid2YXIoLS1pbmstMiknLCBmb250U2l6ZToxMiwgbGV0dGVyU3BhY2luZzonMC4xZW0nfX0+XG4gICAgICAgICAgXHUyMTkwIFx1QkFBOVx1Qjg1RFx1QzczQ1x1Qjg1Q1xuICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICA8aGVhZGVyIHN0eWxlPXt7Ym9yZGVyQm90dG9tOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsIHBhZGRpbmdCb3R0b206MzIsIG1hcmdpbkJvdHRvbTo0OH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjEyLCBtYXJnaW5Cb3R0b206MjAsIGZsZXhXcmFwOid3cmFwJ319PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2UgYmFkZ2UtZ29sZFwiPntwb3N0LmNhdGVnb3J5fTwvc3Bhbj5cbiAgICAgICAgICAgIHtwb3N0LmhvdCAmJiA8c3BhbiBjbGFzc05hbWU9XCJiYWRnZVwiPkhPVDwvc3Bhbj59XG4gICAgICAgICAgICB7cG9zdC5fdXNlckNyZWF0ZWQgJiYgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2UgYmFkZ2UtZ29sZFwiPlx1QzBDOCBcdUFFMDA8L3NwYW4+fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJwb3N0LXRpdGxlXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtZGlzcGxheSknLFxuICAgICAgICAgICAgZm9udFNpemU6J2NsYW1wKDI4cHgsIDMuNXZ3LCA0NHB4KScsXG4gICAgICAgICAgICBmb250V2VpZ2h0OjUwMCwgbGluZUhlaWdodDoxLjI1LCBsZXR0ZXJTcGFjaW5nOictMC4wMWVtJyxcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbToyNCwgdGV4dFdyYXA6J2JhbGFuY2UnXG4gICAgICAgICAgfX0+e3Bvc3QudGl0bGV9PC9oMT5cblxuICAgICAgICAgIHtwb3N0LnRhZ3M/Lmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6NiwgZmxleFdyYXA6J3dyYXAnLCBtYXJnaW5Cb3R0b206MTZ9fT5cbiAgICAgICAgICAgICAge3Bvc3QudGFncy5tYXAodCA9PiA8c3BhbiBrZXk9e3R9IGNsYXNzTmFtZT1cInRhZy1jaGlwXCI+I3t0fTwvc3Bhbj4pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgZ2FwOjI0LCBhbGlnbkl0ZW1zOidjZW50ZXInLCBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgZm9udFNpemU6MTIsIGNvbG9yOid2YXIoLS1pbmstMyknLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdvbGRcIiBzdHlsZT17e2Rpc3BsYXk6J2lubGluZS1mbGV4JywgYWxpZ25JdGVtczonY2VudGVyJ319PlxuICAgICAgICAgICAgICB7cG9zdC5hdXRob3J9XG4gICAgICAgICAgICAgIDxBdXRob3JHcmFkZUJhZGdlIGF1dGhvcklkPXtwb3N0LmF1dGhvcklkfSBhdXRob3I9e3Bvc3QuYXV0aG9yfSBhdXRob3JFbWFpbD17cG9zdC5hdXRob3JFbWFpbH0vPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHRpbWUgZGF0ZVRpbWU9e3Bvc3QuZGF0ZS5yZXBsYWNlKC9cXC4vZywnLScpfT57cG9zdC5kYXRlfTwvdGltZT5cbiAgICAgICAgICAgIDxzcGFuPlx1Qzg3MFx1RDY4QyB7cG9zdC52aWV3cyA/PyAwfTwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuPlx1QjMxM1x1QUUwMCB7Y29tbWVudHNMaXN0Lmxlbmd0aH08L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj5cdUFDRjVcdUFDMTAge2xpa2VzQ291bnR9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICB7LyogdjAwLjEzMCBcdTIwMTQgYm9keSBcdUFDMDAgXHVENTZEXHVDMEMxIHtodG1sLCB0ZXh0fSBcdUI4NUMgXHVDODE1XHVBRERDXHVENjU0XHVCNDE4XHVCQkMwXHVCODVDIGZhbGxiYWNrIHBsYWNlaG9sZGVyIFx1QzgxQ1x1QUM3MC5cbiAgICAgICAgICAgIFx1QzE5MFx1QzBDMVx1QjQxQyBcdUM2MUIgcm93IFx1QjI5NCBfbm9ybWFsaXplUG9zdEJvZHkgXHVBQzAwIFx1QUNCRFx1QUNFMCBcdUQxNERcdUMyQTRcdUQyQjhcdUI4NUMgXHVCMzAwXHVDQ0I0LiAqL31cbiAgICAgICAge3Bvc3QuYm9keT8uaHRtbCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBvc3QtYm9keVwiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiB3aW5kb3cuQkdOSl9TQUZFX0hUTUwocG9zdC5ib2R5Lmh0bWwpfX0vPlxuICAgICAgICApIDogcG9zdC5ib2R5Py50ZXh0ID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicG9zdC1ib2R5XCIgc3R5bGU9e3t3aGl0ZVNwYWNlOidwcmUtd3JhcCd9fT57cG9zdC5ib2R5LnRleHR9PC9kaXY+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwb3N0LWJvZHkgZGltLTJcIiBzdHlsZT17e2ZvbnRTdHlsZTonaXRhbGljJ319PlxuICAgICAgICAgICAgXHVCQ0Y4XHVCQjM4XHVDNzc0IFx1QkU0NFx1QzVCNFx1Qzc4OFx1QzJCNVx1QjJDOFx1QjJFNC5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogSW1hZ2Ugc2xpZGVyIGF0IGJvdHRvbSBvZiBwb3N0ICovfVxuICAgICAgICB7cG9zdC5pbWFnZXM/Lmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIDxzZWN0aW9uIGFyaWEtbGFiZWw9XCJcdUNDQThcdUJEODAgXHVDNzc0XHVCQkY4XHVDOUMwXCIgc3R5bGU9e3ttYXJnaW46JzQ4cHggMCd9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3ttYXJnaW5Cb3R0b206MTZ9fT5BVFRBQ0hNRU5UUyBcdTAwQjcgXHVDQ0E4XHVCRDgwIFx1Qzc3NFx1QkJGOFx1QzlDMCAoe3Bvc3QuaW1hZ2VzLmxlbmd0aH1cdUM3QTUpPC9kaXY+XG4gICAgICAgICAgICA8SW1hZ2VTbGlkZXIgaW1hZ2VzPXtwb3N0LmltYWdlc30vPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogRmlsZSBhdHRhY2htZW50cyAodjAwLjA2OSkgKi99XG4gICAgICAgIHtwb3N0LmF0dGFjaG1lbnRzPy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8c2VjdGlvbiBhcmlhLWxhYmVsPVwiXHVDQ0E4XHVCRDgwIFx1RDMwQ1x1Qzc3Q1wiIHN0eWxlPXt7bWFyZ2luOic0MHB4IDAnfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tZXllYnJvd1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7bWFyZ2luQm90dG9tOjE0fX0+RklMRVMgXHUwMEI3IFx1Q0NBOFx1QkQ4MCBcdUQzMENcdUM3N0MgKHtwb3N0LmF0dGFjaG1lbnRzLmxlbmd0aH0pPC9kaXY+XG4gICAgICAgICAgICA8dWwgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBwYWRkaW5nOjAsIG1hcmdpbjowLCBkaXNwbGF5OidmbGV4JywgZmxleERpcmVjdGlvbjonY29sdW1uJywgZ2FwOjh9fT5cbiAgICAgICAgICAgICAge3Bvc3QuYXR0YWNobWVudHMubWFwKChhLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGxpIGtleT17aX0gc3R5bGU9e3tkaXNwbGF5OidmbGV4JywgYWxpZ25JdGVtczonY2VudGVyJywgZ2FwOjEyLCBwYWRkaW5nOicxMHB4IDE0cHgnLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsIGJhY2tncm91bmQ6J3ZhcigtLWJnLTIpJywgZm9udFNpemU6MTN9fT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlx1RDgzRFx1RENDRTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7ZmxleDoxLCBjb2xvcjondmFyKC0taW5rKSd9fT57YS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjExfX0+e19mbXRTaXplKGEuc2l6ZSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj17YS5kYXRhVXJsfSBkb3dubG9hZD17YS5uYW1lfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgcGFkZGluZzonNHB4IDEwcHgnfX1cbiAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YCR7YS5uYW1lfSBcdUIyRTRcdUM2QjRcdUI4NUNcdUI0RENgfT5cdUIyRTRcdUM2QjRcdUI4NUNcdUI0REM8L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogQWN0aW9ucyAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpbjonNjBweCAwJywgcGFkZGluZ1RvcDozMiwgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTIsIGp1c3RpZnlDb250ZW50OidjZW50ZXInLCBmbGV4V3JhcDond3JhcCd9fT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIGFyaWEtcHJlc3NlZD17bGlrZWR9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUxpa2V9XG4gICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6IGxpa2VkID8gJ3ZhcigtLWdvbGQpJyA6IHVuZGVmaW5lZCwgY29sb3I6IGxpa2VkID8gJ3ZhcigtLWdvbGQpJyA6IHVuZGVmaW5lZH19PlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj5cdTI2NjU8L3NwYW4+IFx1QUNGNVx1QUMxMCA8c3BhbiBhcmlhLWxpdmU9XCJwb2xpdGVcIj57bGlrZXNDb3VudH08L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiIGFyaWEtcHJlc3NlZD17Ym9va21hcmtlZH1cbiAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQm9va21hcmt9XG4gICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6IGJvb2ttYXJrZWQgPyAndmFyKC0tZ29sZCknIDogdW5kZWZpbmVkLCBjb2xvcjogYm9va21hcmtlZCA/ICd2YXIoLS1nb2xkKScgOiB1bmRlZmluZWR9fT5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+e2Jvb2ttYXJrZWQgPyAnXHUyNjA1JyA6ICdcdTI2MDYnfTwvc3Bhbj4gXHVCRDgxXHVCOUM4XHVEMDZDXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0blwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXVzZXIpIHJldHVybiByZXF1aXJlTG9naW4oJ1x1QzJFMFx1QUNFMCcpO1xuICAgICAgICAgICAgICAgIHNldFJlcG9ydE9wZW4oKHYpID0+ICF2KTtcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIFx1QzJFMFx1QUNFMFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICB7Y2FuTWFuYWdlUG9zdCAmJiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17KCkgPT4gb25FZGl0KHBvc3QpfT5cdUMyMThcdUM4MTU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXtkZWxldGVQb3N0fVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXJDb2xvcjondmFyKC0tZGFuZ2VyKScsIGNvbG9yOid2YXIoLS1kYW5nZXIpJ319Plx1QzBBRFx1QzgxQzwvYnV0dG9uPlxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7cmVwb3J0T3BlbiAmJiAoXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlUmVwb3J0U3VibWl0fVxuICAgICAgICAgICAgICBzdHlsZT17e21heFdpZHRoOjU2MCwgbWFyZ2luOicyNHB4IGF1dG8gMCcsIHBhZGRpbmc6MjAsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgYmFja2dyb3VuZDoncmdiYSgxOTQsNzQsNjEsMC4wNCknfX0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMjJlbScsIG1hcmdpbkJvdHRvbToxMH19PlJFUE9SVCBcdTAwQjcgXHVDMkUwXHVBQ0UwIFx1QzBBQ1x1QzcyMDwvZGl2PlxuICAgICAgICAgICAgICB7cmVwb3J0U3VibWl0dGVkID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3tmb250U2l6ZToxMywgbGluZUhlaWdodDoxLjcsIHBhZGRpbmc6JzhweCAwJywgY29sb3I6J3ZhcigtLWdvbGQpJ319PlxuICAgICAgICAgICAgICAgICAgXHVDMkUwXHVBQ0UwXHVBQzAwIFx1QzgxMVx1QzIxOFx1QjQxOFx1QzVDOFx1QzJCNVx1QjJDOFx1QjJFNC4gXHVDNkI0XHVDNjAxXHVDNzkwXHVBQzAwIFx1RDY1NVx1Qzc3OCBcdUQ2QzQgXHVDQzk4XHVCOUFDXHVENTY5XHVCMkM4XHVCMkU0LlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlx1QzVCNFx1QjVBNCBcdUM4MTBcdUM3NzQgXHVCQjM4XHVDODFDXHVDNzc4XHVDOUMwIFx1QUMwNFx1QjJFOFx1RDc4OCBcdUM4MDFcdUM1QjQgXHVDOEZDXHVDMTM4XHVDNjk0LlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZXBvcnRSZWFzb259XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0UmVwb3J0UmVhc29uKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ttaW5IZWlnaHQ6ODAsIHJlc2l6ZTondmVydGljYWwnLCBtYXJnaW5Cb3R0b206MTJ9fS8+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonZmxleCcsIGp1c3RpZnlDb250ZW50OidmbGV4LWVuZCcsIGdhcDo4fX0+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiBzZXRSZXBvcnRPcGVuKGZhbHNlKX0+XHVDREU4XHVDMThDPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6J3ZhcigtLWRhbmdlciknLCBjb2xvcjondmFyKC0tZGFuZ2VyKSd9fT5cdUMyRTBcdUFDRTAgXHVDODExXHVDMjE4PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogQ29tbWVudHMgKi99XG4gICAgICAgIDxzZWN0aW9uIGFyaWEtbGFiZWxsZWRieT1cImNvbW1lbnRzLWhlYWRpbmdcIj5cbiAgICAgICAgICA8aDIgaWQ9XCJjb21tZW50cy1oZWFkaW5nXCIgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17e2ZvbnRTaXplOjIyLCBtYXJnaW5Cb3R0b206MjR9fT5cbiAgICAgICAgICAgIFx1QjMxM1x1QUUwMCA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCI+e2NvbW1lbnRzTGlzdC5sZW5ndGh9PC9zcGFuPlxuICAgICAgICAgIDwvaDI+XG5cbiAgICAgICAgICB7dXNlciA/IChcbiAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXtzdWJtaXRDb21tZW50fSBzdHlsZT17e21hcmdpbkJvdHRvbTozMn19PlxuICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImNvbW1lbnQtaW5wdXRcIiBjbGFzc05hbWU9XCJzci1vbmx5XCI+XHVCMzEzXHVBRTAwIFx1Qzc4NVx1QjgyNTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxNZW50aW9uVGV4dGFyZWFcbiAgICAgICAgICAgICAgICB2YWx1ZT17Y29tbWVudH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0Q29tbWVudH1cbiAgICAgICAgICAgICAgICBhdXRob3JzPXsoY29tbWVudHNMaXN0IHx8IFtdKS5tYXAoKGMpID0+IGMuYXV0aG9yKS5jb25jYXQocG9zdC5hdXRob3IpLmZpbHRlcihCb29sZWFuKX1cbiAgICAgICAgICAgICAgICByb3dzPXs0fVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiXHVDMEREXHVBQzAxXHVDNzQ0IFx1QjA5OFx1QjIwNFx1QzVCNCBcdUM4RkNcdUMxMzhcdUM2OTQuLi4gKEBcdUI5N0MgXHVDNzg1XHVCODI1XHVENTU4XHVCQTc0IFx1QkE1OFx1QzE1OCBcdUM3OTBcdUIzRDlcdUM2NDRcdUMxMzEpXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e21pbkhlaWdodDoxMDAsIHJlc2l6ZTondmVydGljYWwnLCBtYXJnaW5Cb3R0b206MTJ9fS8+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OidmbGV4JywganVzdGlmeUNvbnRlbnQ6J3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOidjZW50ZXInfX0+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTF9fT57dXNlci5uYW1lfShcdUM3M0MpXHVCODVDIFx1QjRGMVx1Qjg1RDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdvbGQgYnRuLXNtYWxsXCIgZGlzYWJsZWQ9eyFjb21tZW50LnRyaW0oKX0+XHVCNEYxXHVCODVEPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17e3BhZGRpbmc6MjQsIHRleHRBbGlnbjonY2VudGVyJywgbWFyZ2luQm90dG9tOjMyLCBiYWNrZ3JvdW5kOidyZ2JhKDI0NSwyMTMsNzIsMC4wNCknfX0+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7Zm9udFNpemU6MTQsIG1hcmdpbkJvdHRvbToxNn19PlxuICAgICAgICAgICAgICAgIFx1QjMxM1x1QUUwMCBcdUM3OTFcdUMxMzFcdUM3NDAgPHN0cm9uZyBjbGFzc05hbWU9XCJnb2xkXCI+XHVCODVDXHVBREY4XHVDNzc4XHVENTVDIFx1RDY4Q1x1QzZEMDwvc3Ryb25nPlx1QjlDQyBcdUFDMDBcdUIyQTVcdUQ1NjlcdUIyQzhcdUIyRTQuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J2ZsZXgnLCBnYXA6MTAsIGp1c3RpZnlDb250ZW50OidjZW50ZXInfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1nb2xkIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IGdvKCdsb2dpbicpfT5cdUI4NUNcdUFERjhcdUM3Nzg8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gZ28oJ3NpZ251cCcpfT5cdUQ2OENcdUM2RDBcdUFDMDBcdUM3ODU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAgPENvbW1lbnRUcmVlXG4gICAgICAgICAgICBjb21tZW50cz17Y29tbWVudHNMaXN0fVxuICAgICAgICAgICAgdXNlcj17dXNlcn1cbiAgICAgICAgICAgIG9uRGVsZXRlPXtkZWxldGVDb21tZW50fVxuICAgICAgICAgICAgb25SZXBseT17KHBhcmVudElkLCB0ZXh0KSA9PiB7XG4gICAgICAgICAgICAgIGlmICghdXNlciB8fCAhdGV4dC50cmltKCkpIHJldHVybjtcbiAgICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gd2luZG93LkJHTkpfQ09NTVVOSVRZLmFkZENvbW1lbnQocG9zdC5pZCwge1xuICAgICAgICAgICAgICAgIGlkOiBgY29tbWVudC0ke0RhdGUubm93KCl9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiw0KX1gLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdXNlci5uYW1lLFxuICAgICAgICAgICAgICAgIGF1dGhvcklkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgICAgIGRhdGU6IGAke25vdy5nZXRGdWxsWWVhcigpfS4ke3BhZChub3cuZ2V0TW9udGgoKSsxKX0uJHtwYWQobm93LmdldERhdGUoKSl9ICR7cGFkKG5vdy5nZXRIb3VycygpKX06JHtwYWQobm93LmdldE1pbnV0ZXMoKSl9YCxcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LnRyaW0oKSxcbiAgICAgICAgICAgICAgICBwYXJlbnRJZCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHNldENvbW1lbnRzTGlzdChuZXh0KTtcbiAgICAgICAgICAgICAgY29uc3QgaXNNeU93blBvc3QgPSBwb3N0LmF1dGhvcklkID09PSB1c2VyLmlkIHx8IHBvc3QuYXV0aG9yID09PSB1c2VyLm5hbWU7XG4gICAgICAgICAgICAgIGlmICghaXNNeU93blBvc3QgJiYgcG9zdC5hdXRob3JJZCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5CR05KX0NPTU1VTklUWS5hZGROb3RpZmljYXRpb24ocG9zdC5hdXRob3JJZCwge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbW1lbnQnLFxuICAgICAgICAgICAgICAgICAgcG9zdElkOiBwb3N0LmlkLFxuICAgICAgICAgICAgICAgICAgcG9zdFRpdGxlOiBwb3N0LnRpdGxlLFxuICAgICAgICAgICAgICAgICAgZnJvbU5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdcdUIwQjQgXHVBRTAwXHVDNUQwIFx1QzBDOCBcdUIyRjVcdUFFMDBcdUM3NzQgXHVCMkVDXHVCODM4XHVDMkI1XHVCMkM4XHVCMkU0LicsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25SZWZyZXNoPy4oKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9hcnRpY2xlPlxuICApO1xufTtcblxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHsgQ29tbXVuaXR5UGFnZSwgSW1hZ2VTbGlkZXIsIEhhc2h0YWdJbnB1dCwgSW1hZ2VBdHRhY2hlciwgQ29tbWVudFRyZWUgfSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFJQSxNQUFNLGVBQWUsQ0FBQyxTQUFTLE1BQU0sUUFBUSxNQUFNLE9BQU8sZ0JBQWdCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQztBQUN2RixNQUFNLHdCQUF3QixDQUFDLGNBQzdCLE9BQU8sWUFBWSxXQUFXLE9BQU8sT0FB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O0FBQUEsVUFDekgsTUFBTSxLQUFLLEtBQUs7QUFBQSxVQUNoQjtBQUFBLFFBQ0YsQ0FBQztBQUNELHdCQUFnQixJQUFJO0FBQ3BCLGNBQU0sY0FBYyxLQUFLLGFBQWEsS0FBSyxNQUFNLEtBQUssV0FBVyxLQUFLO0FBQ3RFLFlBQUksQ0FBQyxlQUFlLEtBQUssVUFBVTtBQUNqQyxpQkFBTyxlQUFlLGdCQUFnQixLQUFLLFVBQVU7QUFBQSxZQUNuRCxNQUFNO0FBQUEsWUFDTixRQUFRLEtBQUs7QUFBQSxZQUNiLFdBQVcsS0FBSztBQUFBLFlBQ2hCLFVBQVUsS0FBSztBQUFBLFlBQ2YsU0FBUztBQUFBLFVBQ1gsQ0FBQztBQUFBLFFBQ0g7QUFDQTtBQUFBLE1BQ0Y7QUFBQTtBQUFBLEVBQ0YsQ0FDRixDQUNGLENBQ0Y7QUFFSjtBQUVBLE9BQU8sT0FBTyxRQUFRLEVBQUUsZUFBZSxhQUFhLGNBQWMsZUFBZSxZQUFZLENBQUM7IiwKICAibmFtZXMiOiBbIl9hIiwgIl9iIiwgIl9jIiwgIl9kIiwgIl9lIiwgIl9mIl0KfQo=

})();

(function(){
const ColumnPage = ({ go, user }) => {
  var _a, _b, _c;
  const [tick, setTick] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("\uC804\uCCB4");
  const [comment, setComment] = React.useState("");
  const [shareMsg, setShareMsg] = React.useState("");
  const [writerOpen, setWriterOpen] = React.useState(false);
  const isAdmin = !!(user == null ? void 0 : user.isAdmin);
  const refresh = () => setTick((v) => v + 1);
  const publicColumns = React.useMemo(
    () => window.BGNJ_COLUMNS.listPublic(),
    [tick]
  );
  const categories = React.useMemo(
    () => ["\uC804\uCCB4", ...Array.from(new Set(publicColumns.map((c) => c.category)))],
    [publicColumns]
  );
  const filtered = React.useMemo(
    () => window.BGNJ_COLUMNS.searchPublic({ query: search, category }),
    [search, category, tick]
  );
  React.useEffect(() => {
    let pending = null;
    try {
      pending = sessionStorage.getItem("bgnj_pending_column_id");
    } catch (e) {
    }
    if (pending) {
      try {
        sessionStorage.removeItem("bgnj_pending_column_id");
      } catch (e) {
      }
      setSelectedId(pending);
    }
  }, []);
  React.useEffect(() => {
    let pendingWrite = null;
    try {
      pendingWrite = sessionStorage.getItem("bgnj_pending_column_write");
    } catch (e) {
    }
    if (pendingWrite) {
      try {
        sessionStorage.removeItem("bgnj_pending_column_write");
      } catch (e) {
      }
      if (user == null ? void 0 : user.isAdmin) setWriterOpen(true);
    }
  }, [user]);
  React.useEffect(() => {
    var _a2, _b2;
    Promise.resolve((_b2 = (_a2 = window.BGNJ_COLUMNS) == null ? void 0 : _a2.refresh) == null ? void 0 : _b2.call(_a2)).finally(() => refresh());
    const onR = () => refresh();
    window.addEventListener("bgnj-columns-refresh", onR);
    return () => window.removeEventListener("bgnj-columns-refresh", onR);
  }, []);
  React.useEffect(() => {
    if (!selectedId) return;
    const key = `bgnj_viewed_col_${selectedId}`;
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        Promise.resolve(window.BGNJ_COLUMNS.incrementViews(selectedId)).then(() => refresh());
      }
    } catch (e) {
    }
  }, [selectedId]);
  const requireLogin = (label) => {
    if (confirm(`${label}\uC740(\uB294) \uB85C\uADF8\uC778 \uD6C4 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9\uD558\uC2DC\uACA0\uC5B4\uC694?`)) {
      go("login");
    }
  };
  const handleLike = async () => {
    if (!user) return requireLogin("\uACF5\uAC10");
    await window.BGNJ_COLUMNS.toggleLike(selectedId, user.id);
    refresh();
  };
  const handleShare = async () => {
    const url = `${location.origin}${location.pathname}#col-${selectedId}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("\uACF5\uC720 \uB9C1\uD06C\uAC00 \uBCF5\uC0AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    } catch (e) {
      setShareMsg(url);
    }
    setTimeout(() => setShareMsg(""), 2400);
  };
  const submitComment = (e) => {
    e.preventDefault();
    if (!user) return requireLogin("\uB313\uAE00 \uC791\uC131");
    const trimmed = comment.trim();
    if (!trimmed) return;
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    window.BGNJ_COLUMNS.addComment(selectedId, {
      id: `comment-${Date.now()}`,
      author: user.name,
      authorId: user.id,
      authorEmail: user.email,
      date: `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      text: trimmed
    });
    setComment("");
    refresh();
  };
  const removeComment = (commentId) => {
    window.BGNJ_COLUMNS.deleteComment(selectedId, commentId);
    refresh();
  };
  if (selectedId !== null) {
    const c = window.BGNJ_COLUMNS.getColumn(selectedId);
    if (!c) {
      return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 760, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, marginBottom: 16 } }, "\uD574\uB2F9 \uCE7C\uB7FC\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: () => setSelectedId(null) }, "\uC544\uCE74\uC774\uBE0C\uB85C")));
    }
    const idx = publicColumns.findIndex((x) => String(x.id) === String(c.id));
    const prevCol = idx > 0 ? publicColumns[idx - 1] : null;
    const nextCol = idx >= 0 && idx < publicColumns.length - 1 ? publicColumns[idx + 1] : null;
    const G = window.BGNJ_GUARD;
    const likes = G.arr(() => {
      var _a2, _b2;
      return (_b2 = (_a2 = window.BGNJ_COLUMNS) == null ? void 0 : _a2.getLikes) == null ? void 0 : _b2.call(_a2, c.id);
    });
    const liked = !!user && likes.includes(user.id);
    const views = G.num(() => {
      var _a2, _b2;
      return (_b2 = (_a2 = window.BGNJ_COLUMNS) == null ? void 0 : _a2.getViews) == null ? void 0 : _b2.call(_a2, c.id);
    }, 0);
    const comments = G.arr(() => {
      var _a2, _b2;
      return (_b2 = (_a2 = window.BGNJ_COLUMNS) == null ? void 0 : _a2.listComments) == null ? void 0 : _b2.call(_a2, c.id);
    });
    const readTime = ((_a = c.body) == null ? void 0 : _a.text) ? window.BGNJ_COLUMNS.estimateReadTime(c.body.text) : c.readTime;
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 760 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-ghost",
        onClick: () => setSelectedId(null),
        style: { marginBottom: 32, cursor: "pointer", color: "var(--ink-2)", fontSize: 12, letterSpacing: "0.1em" }
      },
      "\u2190 \uC544\uCE74\uC774\uBE0C\uB85C"
    ), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 40 } }, /* @__PURE__ */ React.createElement("span", { className: "pill" }, c.category), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 500, lineHeight: 1.2, margin: "20px 0 16px" } }, c.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20, justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "gold" }, c.author || "\uBC45\uAE30\uB178\uC790"), /* @__PURE__ */ React.createElement("span", null, c.createdAt ? window.BGNJ_FMT.kstShort(c.createdAt) : c.date || ""), /* @__PURE__ */ React.createElement("span", null, "\uC77D\uB294 \uC2DC\uAC04 \xB7 ", readTime), /* @__PURE__ */ React.createElement("span", null, "\uC870\uD68C ", views), /* @__PURE__ */ React.createElement("span", null, "\uACF5\uAC10 ", likes.length), /* @__PURE__ */ React.createElement("span", null, "\uB313\uAE00 ", comments.length))), c.coverUrl && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 40 } }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: c.coverUrl,
        alt: c.title || "\uCE7C\uB7FC \uB300\uD45C \uC774\uBBF8\uC9C0",
        style: { width: "100%", display: "block", objectFit: "cover" }
      }
    ), c.coverCredit && /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, textAlign: "right", marginTop: 6, letterSpacing: "0.08em" } }, "\xA9 ", c.coverCredit)), !c.coverUrl && !((_b = c.body) == null ? void 0 : _b.html) && /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: { aspectRatio: "16/9", marginBottom: 40, fontSize: 11 } }, "COLUMN HERO IMAGE \xB7 1600\xD7900"), /* @__PURE__ */ React.createElement("article", { style: { fontFamily: "var(--font-serif)", fontSize: 18, lineHeight: 2, color: "var(--ink)", fontWeight: 300 } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 22, lineHeight: 1.7, color: "var(--gold-ink)", marginBottom: 32, fontStyle: "italic", fontWeight: 300 } }, c.excerpt), ((_c = c.body) == null ? void 0 : _c.html) ? /* @__PURE__ */ React.createElement("div", { dangerouslySetInnerHTML: { __html: window.BGNJ_SAFE_HTML(c.body.html) } }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { style: { marginBottom: 28 } }, "\uC870\uC120\uC758 \uC655\uB4E4\uC740 \uB9E4\uC77C \uC544\uCE68 \uAC19\uC740 \uD48D\uACBD\uC744 \uB9C8\uC8FC\uD588\uB2E4. \uC5B4\uC88C\uC5D0 \uC624\uB974\uBA74 \uB4F1 \uB4A4\uC5D0\uB294 \uC5B8\uC81C\uB098 \uB2E4\uC12F \uBD09\uC6B0\uB9AC\uAC00 \uD3BC\uCCD0\uC838 \uC788\uC5C8\uACE0, \uD574\uC640 \uB2EC\uC774 \uB3D9\uC2DC\uC5D0 \uB5A0 \uC788\uC5C8\uB2E4. \uC790\uC5F0\uC5D0\uC11C\uB294 \uBD88\uAC00\uB2A5\uD55C \uC77C\uC774 \uC655\uC758 \uC790\uB9AC\uC5D0\uC11C\uB294 \uB9E4\uC77C \uC77C\uC5B4\uB0AC\uB2E4."), /* @__PURE__ */ React.createElement("p", { style: { marginBottom: 28 } }, "\uC5B4\uC88C \uB4A4 \uB2E4\uC12F \uBD09\uC6B0\uB9AC \uBCD1\uD48D\uC740 \uB2E8\uC21C\uD55C \uC7A5\uC2DD\uC774 \uC544\uB2C8\uB2E4. \uADF8\uAC83\uC740 \uC7A5\uCE58\uB2E4. \uC655\uC73C\uB85C \uD558\uC5EC\uAE08 \uB9E4\uC77C \uC6B0\uC8FC\uB97C \uB5A0\uC62C\uB9AC\uAC8C \uD558\uB294 \uC7A5\uCE58, \uC790\uC2E0\uC774 \uB204\uAD6C\uB97C \uC704\uD574 \uC549\uC544 \uC788\uB294\uC9C0\uB97C \uC78A\uC9C0 \uBABB\uD558\uAC8C \uD558\uB294 \uC7A5\uCE58\uC600\uB2E4."), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 24, fontWeight: 500, margin: "48px 0 20px", color: "var(--gold-2)" } }, "\uB2E4\uC12F \uBD09\uC6B0\uB9AC\uC758 \uC758\uBBF8"), /* @__PURE__ */ React.createElement("p", { style: { marginBottom: 28 } }, "\uB2E4\uC12F\uC774\uB77C\uB294 \uC22B\uC790\uC5D0\uB294 \uC774\uC720\uAC00 \uC788\uB2E4. \uC624\uD589(\u4E94\u884C) \u2014 \uBAA9\uD654\uD1A0\uAE08\uC218. \uD55C \uC655\uC870\uAC00 \uC6B0\uC8FC\uC758 \uC9C8\uC11C\uC640 \uC77C\uCE58\uD55C\uB2E4\uB294 \uC120\uC5B8\uC774\uC790, \uB3D9\uC2DC\uC5D0 \uADF8 \uC9C8\uC11C\uB97C \uD754\uB4E4\uBA74 \uC815\uD1B5\uC131\uC744 \uC783\uB294\uB2E4\uB294 \uACBD\uACE0\uC774\uAE30\uB3C4 \uD588\uB2E4."), /* @__PURE__ */ React.createElement("blockquote", { style: { borderLeft: "3px solid var(--gold)", paddingLeft: 32, margin: "40px 0", fontStyle: "italic", color: "var(--gold-ink)" } }, "\uC655\uC774\uB77C\uB294 \uC790\uB9AC\uB294 \uC800\uC808\uB85C \uC11C \uC788\uB294 \uAC83\uC774 \uC544\uB2C8\uB2E4.", /* @__PURE__ */ React.createElement("br", null), "\uB2E4\uC12F \uBD09\uC6B0\uB9AC\uAC00 \uB9E4\uC77C \uADF8\uB97C \uC77C\uC73C\uCF1C \uC138\uC6E0\uB2E4."), /* @__PURE__ */ React.createElement("p", { style: { marginBottom: 28 } }, "\uC624\uB298\uC744 \uC0AC\uB294 \uC6B0\uB9AC\uC5D0\uAC8C \uADF8 \uBCD1\uD48D\uC740 \uB354 \uC774\uC0C1 \uBC30\uACBD\uC774 \uC544\uB2C8\uB2E4. \uADF8\uAC83\uC740 \uD558\uB098\uC758 \uC9C8\uBB38\uC774\uB2E4 \u2014 \uB2F9\uC2E0\uC758 \uC790\uB9AC \uB4A4\uC5D0\uB294 \uBB34\uC5C7\uC774 \uC788\uB294\uAC00."))), (c.sourceCredit || c.sourceUrl) && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--line)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.24em", marginBottom: 8 } }, "SOURCE \xB7 \uCD9C\uCC98"), c.sourceUrl ? /* @__PURE__ */ React.createElement(
      "a",
      {
        href: c.sourceUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        style: { color: "var(--gold-2)", textDecoration: "underline" }
      },
      c.sourceCredit || c.sourceUrl,
      " ",
      /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { marginLeft: 4 } }, "\u2197")
    ) : /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-2)" } }, c.sourceCredit)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "center", margin: "60px 0 32px", paddingTop: 32, borderTop: "1px solid var(--line)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
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
      /* @__PURE__ */ React.createElement("span", { "aria-live": "polite" }, likes.length)
    ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn", onClick: handleShare }, "\uACF5\uC720 (\uB9C1\uD06C \uBCF5\uC0AC)")), shareMsg && /* @__PURE__ */ React.createElement("div", { role: "status", className: "mono gold", style: { fontSize: 12, textAlign: "center", marginBottom: 32, letterSpacing: "0.1em" } }, shareMsg), /* @__PURE__ */ React.createElement("section", { "aria-labelledby": "col-comments", style: { marginTop: 32 } }, /* @__PURE__ */ React.createElement("h2", { id: "col-comments", className: "ko-serif", style: { fontSize: 22, marginBottom: 24 } }, "\uB313\uAE00 ", /* @__PURE__ */ React.createElement("span", { className: "gold" }, comments.length)), user ? /* @__PURE__ */ React.createElement("form", { onSubmit: submitComment, style: { marginBottom: 32 } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "col-comment-input", className: "sr-only" }, "\uB313\uAE00 \uC785\uB825"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        id: "col-comment-input",
        className: "field-input",
        placeholder: "\uC774 \uAE00\uC5D0 \uB300\uD55C \uC0DD\uAC01\uC744 \uB098\uB204\uC5B4 \uC8FC\uC138\uC694...",
        value: comment,
        onChange: (e) => setComment(e.target.value),
        style: { minHeight: 100, resize: "vertical", marginBottom: 12 }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 11 } }, user.name, "(\uC73C)\uB85C \uB4F1\uB85D"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-gold btn-small", disabled: !comment.trim() }, "\uB4F1\uB85D"))) : /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, textAlign: "center", marginBottom: 32, background: "rgba(245,213,72,0.04)" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, marginBottom: 16 } }, "\uB313\uAE00 \uC791\uC131\uC740 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uB85C\uADF8\uC778\uD55C \uD68C\uC6D0"), "\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold btn-small", onClick: () => go("login") }, "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => go("signup") }, "\uD68C\uC6D0\uAC00\uC785"))), /* @__PURE__ */ React.createElement(
      CommentTree,
      {
        comments,
        user,
        onDelete: removeComment,
        onReply: (parentId, text) => {
          if (!user || !text.trim()) return;
          const now = /* @__PURE__ */ new Date();
          const pad = (n) => String(n).padStart(2, "0");
          window.BGNJ_COLUMNS.addComment(c.id, {
            id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 4)}`,
            author: user.name,
            authorId: user.id,
            authorEmail: user.email,
            date: `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
            text: text.trim(),
            parentId
          });
          refresh();
        }
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 60, paddingTop: 40, borderTop: "1px solid var(--line-2)", display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" } }, prevCol && /* @__PURE__ */ React.createElement(
      "div",
      {
        role: "button",
        tabIndex: 0,
        "aria-label": `\uC774\uC804 \uCE7C\uB7FC: ${prevCol.title}`,
        style: { cursor: "pointer", flex: 1, minWidth: 240 },
        onClick: () => setSelectedId(prevCol.id),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedId(prevCol.id);
          }
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 } }, "\u2190 \uC774\uC804 \uCE7C\uB7FC"),
      /* @__PURE__ */ React.createElement("div", { className: "ko-serif gold", style: { fontSize: 16 } }, prevCol.title)
    ), nextCol && /* @__PURE__ */ React.createElement(
      "div",
      {
        role: "button",
        tabIndex: 0,
        "aria-label": `\uB2E4\uC74C \uCE7C\uB7FC: ${nextCol.title}`,
        style: { cursor: "pointer", textAlign: "right", flex: 1, minWidth: 240 },
        onClick: () => setSelectedId(nextCol.id),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedId(nextCol.id);
          }
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 } }, "\uB2E4\uC74C \uCE7C\uB7FC \u2192"),
      /* @__PURE__ */ React.createElement("div", { className: "ko-serif gold", style: { fontSize: 16 } }, nextCol.title)
    ))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 48 } }, (() => {
    var _a2, _b2, _c2, _d, _e;
    const _i = (((_b2 = (_a2 = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2)) || {}).columnIntro || {};
    const eb = _i.eyebrow || "COLUMN \xB7 \uBC45\uAE30\uB178\uC790\uC758 \uAE00";
    const tp = (_c2 = _i.titlePrefix) != null ? _c2 : "";
    const ta = (_d = _i.titleAccent) != null ? _d : "\uBC45\uAE30\uB178\uC790";
    const ts = (_e = _i.titleSuffix) != null ? _e : "\uAC00 \uC4F0\uB2E4";
    const sb = _i.subtitle || "\uCEE4\uBBA4\uB2C8\uD2F0\uC7A5 \uBC45\uAE30\uB178\uC790\uC758 \uC815\uAE30 \uCE7C\uB7FC. \uC870\uC120\uC758 \uC655\uB4E4\uC744 \uACBD\uC720\uD574 \uC624\uB298\uC744 \uBB3B\uB294\uB2E4.";
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", style: { justifyContent: "center" } }, eb), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, tp, /* @__PURE__ */ React.createElement("span", { className: "accent" }, ta), ts), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle", style: { margin: "16px auto 0" } }, sb));
  })()), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "col-search", className: "sr-only" }, "\uCE7C\uB7FC \uAC80\uC0C9"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "col-search",
      className: "field-input",
      placeholder: "\uC81C\uBAA9 \xB7 \uBC1C\uCDCC \xB7 \uBCF8\uBB38 \uAC80\uC0C9...",
      value: search,
      onChange: (e) => setSearch(e.target.value),
      style: { width: 280, padding: "10px 14px" }
    }
  ), isAdmin && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-gold btn-small",
      onClick: () => setWriterOpen(true)
    },
    "\uFF0B \uAE00\uC4F0\uAE30"
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 12, marginBottom: 48, flexWrap: "wrap" } }, categories.map((c) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: c,
      type: "button",
      onClick: () => setCategory(c),
      style: {
        padding: "10px 20px",
        border: category === c ? "1px solid var(--gold)" : "1px solid var(--line-2)",
        color: category === c ? "var(--gold)" : "var(--ink-2)",
        background: "transparent",
        fontSize: 12,
        letterSpacing: "0.1em",
        cursor: "pointer"
      }
    },
    c
  ))), filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 48, textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14 } }, "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uCE7C\uB7FC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")) : /* @__PURE__ */ React.createElement("div", { className: "grid grid-3" }, filtered.map((c, i) => {
    var _a2;
    const G = window.BGNJ_GUARD;
    const likes = G.arr(() => {
      var _a3, _b2;
      return (_b2 = (_a3 = window.BGNJ_COLUMNS) == null ? void 0 : _a3.getLikes) == null ? void 0 : _b2.call(_a3, c.id);
    });
    const views = G.num(() => {
      var _a3, _b2;
      return (_b2 = (_a3 = window.BGNJ_COLUMNS) == null ? void 0 : _a3.getViews) == null ? void 0 : _b2.call(_a3, c.id);
    }, 0);
    const readTime = ((_a2 = c.body) == null ? void 0 : _a2.text) ? G.call(() => {
      var _a3, _b2;
      return (_b2 = (_a3 = window.BGNJ_COLUMNS) == null ? void 0 : _a3.estimateReadTime) == null ? void 0 : _b2.call(_a3, c.body.text);
    }, c.readTime) : c.readTime;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: c.id,
        onClick: () => setSelectedId(c.id),
        className: "card",
        style: { padding: 0, cursor: "pointer", overflow: "hidden" }
      },
      c.coverUrl ? /* @__PURE__ */ React.createElement("div", { style: { aspectRatio: "4/3", borderBottom: "1px solid var(--line)", overflow: "hidden", background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: c.coverUrl,
          alt: c.title || "\uCE7C\uB7FC \uB300\uD45C \uC774\uBBF8\uC9C0",
          loading: "lazy",
          style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
        }
      )) : /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: { aspectRatio: "4/3", borderLeft: "none", borderRight: "none", borderTop: "none", fontSize: 9 } }, "0", i + 1),
      /* @__PURE__ */ React.createElement("div", { style: { padding: 28 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: "pill" }, c.category), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, readTime), likes.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 10 } }, "\u2665", likes.length), views > 0 && /* @__PURE__ */ React.createElement("span", { className: "dim-2 mono", style: { fontSize: 10 } }, "\uC870\uD68C ", views)), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 19, fontWeight: 500, lineHeight: 1.35, marginBottom: 10, minHeight: 50 } }, c.title), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.6, marginBottom: 16 } }, String(c.excerpt || "").slice(0, 90), "\u2026"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, c.date), /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 10, letterSpacing: "0.2em" } }, "READ \u2192")))
    );
  })), filtered.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { textAlign: "center", fontSize: 10, letterSpacing: "0.2em", marginTop: 32 } }, "\uCD1D ", filtered.length, "\uAC1C \uCE7C\uB7FC \xB7 ", category, " ", search && `\xB7 "${search}"`)), writerOpen && isAdmin && /* @__PURE__ */ React.createElement(ColumnWriterModal, { onClose: () => setWriterOpen(false) }));
};
const ColumnWriterModal = ({ onClose }) => {
  var _a, _b, _c;
  const [payload, setPayload] = React.useState(null);
  const dirty = !!(payload && (((_a = payload.title) == null ? void 0 : _a.trim()) || ((_b = payload.text) == null ? void 0 : _b.trim())));
  const saveDraft = () => {
    var _a2, _b2;
    if (!payload) return;
    try {
      (_b2 = (_a2 = window.BGNJ_DRAFTS) == null ? void 0 : _a2.save) == null ? void 0 : _b2.call(_a2, "column", {
        title: payload.title || "",
        category: payload.category || "",
        excerpt: payload.excerpt || "",
        html: payload.html || "",
        text: payload.text || "",
        publishAt: payload.publishAt || ""
      });
    } catch (e) {
    }
  };
  const guard = ((_c = window.useModalGuard) == null ? void 0 : _c.call(window, {
    open: true,
    dirty,
    onClose,
    onSaveDraft: saveDraft,
    label: "\uCE7C\uB7FC"
  })) || {};
  const Editor = window.AdminColumnEditor;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "\uCE7C\uB7FC \uC791\uC131",
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
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("h2", { className: "ko-serif", style: { fontSize: 18, margin: 0 } }, "\uC0C8 \uCE7C\uB7FC \uC791\uC131"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: () => {
      const ok = !dirty || window.confirm("\uC791\uC131 \uC911\uC778 \uB0B4\uC6A9\uC744 \uC784\uC2DC\uC800\uC7A5 \uD6C4 \uB2EB\uC73C\uC2DC\uACA0\uC5B4\uC694?\n[\uD655\uC778]=\uC784\uC2DC\uC800\uC7A5 \uD6C4 \uB2EB\uAE30 / [\uCDE8\uC18C]=\uADF8\uB0E5 \uB2EB\uAE30");
      if (ok && dirty) saveDraft();
      onClose == null ? void 0 : onClose();
    } }, "\uB2EB\uAE30")), Editor ? /* @__PURE__ */ React.createElement(
      Editor,
      {
        onPayloadChange: setPayload,
        onAfterSave: (status) => {
          if (status === "published" || status === "scheduled") onClose == null ? void 0 : onClose();
        }
      }
    ) : /* @__PURE__ */ React.createElement("p", { className: "dim", style: { padding: 24 } }, "\uC5D0\uB514\uD130 \uB85C\uB529 \uC911..."))
  );
};
Object.assign(window, { ColumnPage });

})();

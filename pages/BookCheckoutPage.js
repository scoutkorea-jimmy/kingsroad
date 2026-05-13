(function(){
const STARS = ["\u2605", "\u2605\u2605", "\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605", "\u2605\u2605\u2605\u2605\u2605"];
const _G = window.BGNJ_GUARD || {
  call: (fn, fb) => {
    try {
      const v = fn();
      return v == null ? fb : v;
    } catch (e) {
      return fb;
    }
  },
  arr: (fn) => {
    try {
      const v = fn();
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  }
};
const BookReviewSection = ({ user, bookTitle }) => {
  const _t = bookTitle || "\uCC45";
  const [reviews, setReviews] = React.useState(() => _G.arr(() => {
    var _a, _b;
    return (_b = (_a = window.BGNJ_BOOK_ORDERS) == null ? void 0 : _a.listReviews) == null ? void 0 : _b.call(_a);
  }));
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const canReview = user && window.BGNJ_BOOK_ORDERS.canReview(user.id);
  const hasReviewed = user && window.BGNJ_BOOK_ORDERS.hasReviewed(user.id);
  const submit = () => {
    setError("");
    setSuccess("");
    const result = window.BGNJ_BOOK_ORDERS.addReview({ userId: user == null ? void 0 : user.id, userName: user == null ? void 0 : user.name, rating, text });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setReviews(window.BGNJ_BOOK_ORDERS.listReviews());
    setText("");
    setSuccess("\uB9AC\uBDF0\uAC00 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uAC10\uC0AC\uD569\uB2C8\uB2E4.");
  };
  const remove = async (reviewId) => {
    if (!await window.BGNJ_CONFIRM("\uC774 \uB9AC\uBDF0\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?", { danger: true })) return;
    window.BGNJ_BOOK_ORDERS.deleteReview(reviewId);
    setReviews(window.BGNJ_BOOK_ORDERS.listReviews());
  };
  const isAdmin = user == null ? void 0 : user.isAdmin;
  return /* @__PURE__ */ React.createElement("div", null, canReview && !hasReviewed && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, marginBottom: 28 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 12 } }, "WRITE REVIEW \xB7 \uB9AC\uBDF0 \uC791\uC131"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "dim", style: { fontSize: 13 } }, "\uBCC4\uC810"), [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: n,
      type: "button",
      onClick: () => setRating(n),
      style: { fontSize: 20, color: n <= rating ? "var(--primary)" : "var(--line-2)", background: "none", border: "none", cursor: "pointer", padding: "0 2px" }
    },
    "\u2605"
  )), /* @__PURE__ */ React.createElement("span", { className: "gold mono", style: { fontSize: 12, marginLeft: 4 } }, rating, "/5")), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: text,
      onChange: (e) => setText(e.target.value),
      placeholder: `\u300E${_t}\u300F\uC744 \uC77D\uACE0 \uB290\uB080 \uC810\uC744 \uC790\uC720\uB86D\uAC8C \uC368 \uC8FC\uC138\uC694.`,
      className: "field-input",
      rows: 3,
      style: { width: "100%", resize: "vertical", padding: 12, fontSize: 14, lineHeight: 1.7 }
    }
  ), error && /* @__PURE__ */ React.createElement("p", { style: { color: "var(--danger)", fontSize: 13, marginTop: 8 } }, error), success && /* @__PURE__ */ React.createElement("p", { className: "gold", style: { fontSize: 13, marginTop: 8 } }, success), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-gold", style: { marginTop: 12 }, onClick: submit }, "\uB9AC\uBDF0 \uB4F1\uB85D")), hasReviewed && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 20 } }, "\uC774\uBBF8 \uB9AC\uBDF0\uB97C \uC791\uC131\uD558\uC168\uC2B5\uB2C8\uB2E4."), !user && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 20 } }, "\uB9AC\uBDF0\uB294 \u300E", _t, "\u300F \uBC30\uC1A1 \uC644\uB8CC \uD68C\uC6D0\uB9CC \uC791\uC131\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), user && !canReview && !hasReviewed && /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, marginBottom: 20 } }, "\uBC30\uC1A1 \uC644\uB8CC\uB41C \uC8FC\uBB38\uC774 \uD655\uC778\uB418\uBA74 \uB9AC\uBDF0\uB97C \uC791\uC131\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), reviews.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, padding: "24px 0" } }, "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uB9AC\uBDF0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uCCAB \uB9AC\uBDF0\uB97C \uB0A8\uACA8 \uBCF4\uC138\uC694.") : reviews.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, style: { padding: "20px 0", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "gold", style: { fontSize: 16 } }, STARS[r.rating - 1]), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11 } }, r.userName), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10 } }, window.BGNJ_FMT.kstDate(r.createdAt))), (isAdmin || (user == null ? void 0 : user.id) === r.userId) && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn-ghost",
      onClick: () => remove(r.id),
      style: { fontSize: 11, color: "var(--danger)" }
    },
    "\uC0AD\uC81C"
  )), /* @__PURE__ */ React.createElement("p", { className: "ko-serif", style: { fontSize: 15, lineHeight: 1.8 } }, r.text))));
};
const BookPage = ({ go, cart, setCart, user }) => {
  const G = window.BGNJ_GUARD;
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const onR = () => setTick((v) => v + 1);
    window.addEventListener("bgnj-books-refresh", onR);
    return () => window.removeEventListener("bgnj-books-refresh", onR);
  }, []);
  const books = React.useMemo(() => {
    const all = G.arr(() => {
      var _a, _b;
      return (_b = (_a = window.BGNJ_BOOKS) == null ? void 0 : _a.list) == null ? void 0 : _b.call(_a, { status: "published" });
    });
    return all.slice().sort((a, b) => {
      var _a, _b;
      if (a.primary && !b.primary) return -1;
      if (!a.primary && b.primary) return 1;
      return ((_a = a.order) != null ? _a : 0) - ((_b = b.order) != null ? _b : 0);
    });
  }, [tick]);
  const [selectedId, setSelectedId] = React.useState(null);
  React.useEffect(() => {
    if (books.length === 0) return;
    if (!selectedId || !books.find((b) => b.id === selectedId)) {
      setSelectedId(books[0].id);
    }
  }, [books, selectedId]);
  const book = books.find((b) => b.id === selectedId) || books[0] || null;
  const [version, setVersion] = React.useState("KR");
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState("\uC18C\uAC1C");
  React.useEffect(() => {
    setVersion("KR");
    setQty(1);
    setTab("\uC18C\uAC1C");
  }, [selectedId]);
  if (!book) {
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 560, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--ink-2)" } }, "\uCC45 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4\u2026")));
  }
  const price = version === "KR" ? book.priceKR || 0 : book.priceEN || 0;
  const addToCart = () => {
    setCart({ bookId: book.id, version, qty, price });
    go("checkout");
  };
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 48 } }, (() => {
    var _a, _b, _c, _d, _e;
    const _i = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).bookIntro || {};
    const eb = _i.eyebrow || "BOOKS \xB7 \uBC45\uAE30\uB178\uC790 \uB3C4\uC11C";
    const tp = (_c = _i.titlePrefix) != null ? _c : "";
    const ta = (_d = _i.titleAccent) != null ? _d : "\uBC45\uAE30\uB178\uC790";
    const ts = (_e = _i.titleSuffix) != null ? _e : "\uAC00 \uC9D3\uB2E4";
    const sb = _i.subtitle || "\uD55C\uAD6D\uC758 \uC5ED\uC0AC\uC640 \uD48D\uACBD\uC744, \uCC45\uC73C\uB85C.";
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", style: { justifyContent: "center" } }, eb), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, tp, /* @__PURE__ */ React.createElement("span", { className: "accent" }, ta), ts), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle", style: { margin: "16px auto 0" } }, sb));
  })()), books.length > 1 && /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 0,
    borderBottom: "1px solid var(--line)",
    marginBottom: 48,
    overflowX: "auto"
  } }, books.map((b) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: b.id,
      type: "button",
      onClick: () => setSelectedId(b.id),
      style: {
        padding: "14px 28px",
        fontFamily: "var(--font-serif)",
        fontSize: 16,
        color: b.id === book.id ? "var(--primary)" : "var(--ink-2)",
        borderBottom: b.id === book.id ? "2px solid var(--primary)" : "2px solid transparent",
        marginBottom: -1,
        whiteSpace: "nowrap",
        background: "none",
        border: "none",
        borderBottomWidth: 2,
        borderBottomStyle: "solid",
        borderBottomColor: b.id === book.id ? "var(--primary)" : "transparent",
        cursor: "pointer"
      }
    },
    "\u300E",
    b.title,
    "\u300F"
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80 }, className: "book-grid" }, /* @__PURE__ */ React.createElement("div", { className: "book-cover-col", style: { position: "sticky", top: 100, alignSelf: "start" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", maxWidth: 440, margin: "0 auto" } }, book.coverDataUri ? /* @__PURE__ */ React.createElement("div", { style: { aspectRatio: "3/4", border: "1px solid var(--primary-dim)", overflow: "hidden", background: "var(--bg-2)" } }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: book.coverDataUri,
      alt: `${book.title} \uD45C\uC9C0`,
      style: { width: "100%", height: "100%", objectFit: "contain", display: "block" }
    }
  )) : /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: {
    aspectRatio: "3/4",
    background: `linear-gradient(135deg, var(--bg-3), #000),
                    repeating-linear-gradient(45deg, rgba(245,213,72,0.06) 0 6px, transparent 6px 12px)`,
    border: "1px solid var(--primary-dim)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "40px 32px",
    fontSize: 12,
    color: "var(--primary)"
  } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, letterSpacing: "0.3em", marginBottom: 8 } }, "BANGINOJA PRESS"), /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.2em" } }, version === "KR" ? "KR EDITION" : "EN EDITION")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 36, color: "var(--primary-hover)", lineHeight: 1.2 } }, book.title), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, letterSpacing: "0.3em", marginTop: 20, color: "var(--ink-2)" } }, "\u2014 ", book.author || "\uBC45\uAE30\uB178\uC790", " \u2014")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement(BanginojaIcon, { size: 28 }))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 16, left: 16, right: -16, bottom: -16, border: "1px solid var(--line-2)", zIndex: -1 } })), (book.coverDataUri || book.backCoverDataUri || book.pdfPreviewDataUri) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "center", marginTop: 32 } }, book.coverDataUri && /* @__PURE__ */ React.createElement("div", { style: { width: 60, aspectRatio: "3/4", border: "1px solid var(--line)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("img", { src: book.coverDataUri, alt: "\uC55E\uD45C\uC9C0", style: { width: "100%", height: "100%", objectFit: "contain" } })), book.backCoverDataUri && /* @__PURE__ */ React.createElement("div", { style: { width: 60, aspectRatio: "3/4", border: "1px solid var(--line)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("img", { src: book.backCoverDataUri, alt: "\uB4B7\uD45C\uC9C0", style: { width: "100%", height: "100%", objectFit: "contain" } })), book.pdfPreviewDataUri && /* @__PURE__ */ React.createElement(
    "a",
    {
      href: book.pdfPreviewDataUri,
      target: "_blank",
      rel: "noopener noreferrer",
      style: { width: 60, aspectRatio: "3/4", border: "1px solid var(--primary-dim)", display: "grid", placeItems: "center", textDecoration: "none", color: "var(--primary)", fontSize: 9, padding: 4, textAlign: "center", lineHeight: 1.3 },
      title: "\uBCF8\uBB38 \uBBF8\uB9AC\uBCF4\uAE30 (PDF)"
    },
    "\u{1F4C4}",
    /* @__PURE__ */ React.createElement("br", null),
    "\uBCF8\uBB38",
    /* @__PURE__ */ React.createElement("br", null),
    "\uBBF8\uB9AC\uBCF4\uAE30"
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.3em", marginBottom: 16 } }, "NEW RELEASE \xB7 2026"), /* @__PURE__ */ React.createElement("h2", { style: { fontFamily: "var(--font-serif)", fontSize: 56, fontWeight: 500, lineHeight: 1.05, marginBottom: 12 } }, "\u300E", /* @__PURE__ */ React.createElement("span", { className: "gold" }, book.title), "\u300F"), (() => {
    var _a, _b;
    const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
    const map = sc.bookFieldVisibility || {};
    const vis = map[book.id] || map[String(book.id)] || {};
    const show = (key) => vis[key] !== false;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, show("subtitle") && book.subtitle && /* @__PURE__ */ React.createElement("div", { className: "ko-serif dim", style: { fontSize: 20, marginBottom: 24, fontStyle: "italic" } }, book.subtitle), (show("author") || show("publisher") || show("pages")) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, paddingBottom: 24, borderBottom: "1px solid var(--line)", marginBottom: 32, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)", flexWrap: "wrap" } }, show("author") && book.author && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\uC800\uC790"), " ", /* @__PURE__ */ React.createElement("span", { className: "gold" }, book.author)), show("publisher") && book.publisher && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\uCD9C\uD310"), " ", book.publisher), show("pages") && book.pages > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "\uCABD\uC218"), " ", book.pages, "p"), show("isbn") && book.isbn && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "dim-2" }, "ISBN"), " ", book.isbn)));
  })(), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 15, lineHeight: 1.9, marginBottom: 32 } }, book.desc), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.25em", marginBottom: 12, textTransform: "uppercase" } }, "\uD310\uBCF8 \uC120\uD0DD"), (() => {
    var _a, _b;
    const _sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
    const _vis = (_sc.bookFieldVisibility || {})[book.id] || (_sc.bookFieldVisibility || {})[String(book.id)] || {};
    const versions = [];
    if (Number(book.priceKR) > 0 && _vis.priceKR !== false) versions.push({ k: "KR", label: "\uAD6D\uBB38\uD310", sub: "Korean", price: book.priceKR });
    if (Number(book.priceEN) > 0 && _vis.priceEN !== false) versions.push({ k: "EN", label: "\uC601\uBB38\uD310", sub: "English", price: book.priceEN });
    if (versions.length === 0) return /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, "\uD310\uB9E4 \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4.");
    return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: versions.length === 1 ? "1fr" : "1fr 1fr", gap: 12 } }, versions.map((v) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: v.k,
        onClick: () => setVersion(v.k),
        style: {
          padding: "20px",
          border: version === v.k ? "1px solid var(--primary)" : "1px solid var(--line-2)",
          background: version === v.k ? "rgba(245,213,72,0.05)" : "transparent",
          textAlign: "left",
          cursor: "pointer"
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, letterSpacing: "0.2em", color: version === v.k ? "var(--primary)" : "var(--ink-3)" } }, v.sub.toUpperCase()),
      /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 20, marginTop: 4 } }, v.label),
      /* @__PURE__ */ React.createElement("div", { className: "gold-2 ko-serif", style: { fontSize: 20, marginTop: 8 } }, window.BGNJ_FMT.won(v.price))
    )));
  })()), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.25em", marginBottom: 12, textTransform: "uppercase" } }, "\uC218\uB7C9"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 0, border: "1px solid var(--line-2)", width: "fit-content" } }, /* @__PURE__ */ React.createElement("button", { style: { width: 44, height: 44, color: "var(--ink-2)", borderRight: "1px solid var(--line-2)" }, onClick: () => setQty(Math.max(1, qty - 1)) }, "\u2212"), /* @__PURE__ */ React.createElement("div", { style: { width: 60, textAlign: "center" }, className: "ko-serif" }, qty), /* @__PURE__ */ React.createElement("button", { style: { width: 44, height: 44, color: "var(--ink-2)", borderLeft: "1px solid var(--line-2)" }, onClick: () => setQty(qty + 1) }, "+"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { letterSpacing: "0.2em", fontSize: 11 } }, "TOTAL"), /* @__PURE__ */ React.createElement("span", { className: "ko-serif gold-2", style: { fontSize: 36 } }, window.BGNJ_FMT.won(price * qty))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold btn-block", onClick: addToCart }, "\uBC14\uB85C \uAD6C\uB9E4"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-block" }, "\uC7A5\uBC14\uAD6C\uB2C8")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 60, borderTop: "1px solid var(--line-2)", paddingTop: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 0, borderBottom: "1px solid var(--line)", marginBottom: 32 } }, ["\uC18C\uAC1C", "\uBAA9\uCC28", "\uC800\uC790", "\uB9AC\uBDF0"].map((t) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t,
      onClick: () => setTab(t),
      style: {
        padding: "14px 24px",
        fontFamily: "var(--font-serif)",
        fontSize: 15,
        color: tab === t ? "var(--primary)" : "var(--ink-2)",
        borderBottom: tab === t ? "2px solid var(--primary)" : "2px solid transparent",
        marginBottom: -1
      }
    },
    t
  ))), tab === "\uC18C\uAC1C" && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.9, color: "var(--ink-2)" } }, book.intro || book.desc ? /* @__PURE__ */ React.createElement("p", { style: { whiteSpace: "pre-wrap", margin: 0 } }, book.intro || book.desc) : /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, "\uCC45 \uC18C\uAC1C\uAC00 \uC544\uC9C1 \uC785\uB825\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.")), tab === "\uBAA9\uCC28" && (() => {
    const groupChapters = (chapters) => {
      const out = [];
      for (const raw of Array.isArray(chapters) ? chapters : []) {
        if (typeof raw !== "string") continue;
        const trimmed = raw.replace(/^\s+/, "");
        if (trimmed.startsWith("- ")) {
          const sub = trimmed.slice(2).trim();
          if (!sub) continue;
          if (out.length === 0) {
            out.push({ title: sub, items: [] });
            continue;
          }
          out[out.length - 1].items.push(sub);
        } else if (trimmed) {
          out.push({ title: trimmed, items: [] });
        }
      }
      return out;
    };
    const groups = groupChapters(book.chapters);
    if (groups.length === 0) {
      return /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--ink-3)", padding: "16px 0" } }, "\uBAA9\uCC28 \uC815\uBCF4\uAC00 \uC544\uC9C1 \uC785\uB825\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.");
    }
    return /* @__PURE__ */ React.createElement("div", null, groups.map((g, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "16px 0", borderBottom: "1px solid var(--line)", display: "flex", gap: 24 } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { width: 40, fontSize: 12, color: "var(--secondary)", fontWeight: 700, flexShrink: 0 } }, String(i + 1).padStart(2, "0")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 17 } }, g.title), g.items.length > 0 && /* @__PURE__ */ React.createElement("ul", { style: { margin: "10px 0 0 0", padding: 0, listStyle: "none", display: "grid", gap: 4 } }, g.items.map((it, j) => /* @__PURE__ */ React.createElement("li", { key: j, className: "dim", style: { fontSize: 14, lineHeight: 1.7, paddingLeft: 16, position: "relative" } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", left: 0, top: 0, color: "var(--ink-3)" } }, "\xB7"), it)))))));
  })(), tab === "\uC800\uC790" && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: { width: 140, aspectRatio: "3/4", flexShrink: 0 } }, book.author || "\uC800\uC790"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "ko-serif gold", style: { fontSize: 22, marginBottom: 12 } }, book.author || "\uC800\uC790 \uBBF8\uC785\uB825"), book.authorBio ? /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap" } }, book.authorBio) : /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13 } }, "\uC800\uC790 \uC18C\uAC1C\uAC00 \uC544\uC9C1 \uC785\uB825\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4."))), tab === "\uB9AC\uBDF0" && /* @__PURE__ */ React.createElement(BookReviewSection, { user, bookTitle: book.title }))))));
};
const CheckoutPage = ({ go, cart, user }) => {
  const G = window.BGNJ_GUARD;
  const book = G.call(() => {
    var _a, _b, _c, _d;
    const id = cart == null ? void 0 : cart.bookId;
    return id && ((_b = (_a = window.BGNJ_BOOKS) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a, id)) || ((_d = (_c = window.BGNJ_BOOKS) == null ? void 0 : _c.primary) == null ? void 0 : _d.call(_c)) || null;
  }, null);
  const version = cart ? cart.version : "KR";
  const qty = cart ? cart.qty : 1;
  const unit = book ? version === "EN" ? book.priceEN || 0 : book.priceKR || 0 : 0;
  const subtotal = unit * qty;
  const shipping = subtotal >= 3e4 ? 0 : 3e3;
  const total = subtotal + shipping;
  const bank = G.call(() => {
    var _a, _b, _c;
    return ((_b = (_a = window.BGNJ_LECTURES) == null ? void 0 : _a.getBankAccount) == null ? void 0 : _b.call(_a)) || ((_c = window.BGNJ_STORES) == null ? void 0 : _c.bankAccount);
  }, {});
  const [selectedBankId, setSelectedBankId] = React.useState(null);
  const [recipient, setRecipient] = React.useState((user == null ? void 0 : user.name) || "");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [addressDetail, setAddressDetail] = React.useState("");
  const [memo, setMemo] = React.useState("");
  const [cashReceipt, setCashReceipt] = React.useState(() => {
    var _a, _b;
    return ((_b = (_a = window.BGNJ_CashReceipt) == null ? void 0 : _a.empty) == null ? void 0 : _b.call(_a)) || { requested: false, type: "personal", identifier: "" };
  });
  const [error, setError] = React.useState("");
  const [submittedOrder, setSubmittedOrder] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  if (!book) {
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 560, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--ink-2)" } }, "\uCC45 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4\u2026")));
  }
  if (!user) {
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 560, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.3em", marginBottom: 16 } }, "CHECKOUT \xB7 \uACB0\uC81C"), /* @__PURE__ */ React.createElement("h1", { className: "ko-serif", style: { fontSize: 32, marginBottom: 20 } }, "\uD68C\uC6D0 \uC804\uC6A9 \uC8FC\uBB38"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 15, lineHeight: 1.8, marginBottom: 32 } }, "\u300E", book.title, "\u300F \uC8FC\uBB38\uC740 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uD68C\uC6D0\uAC00\uC785\uD55C \uBD84"), "\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("login") }, "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => go("signup") }, "\uD68C\uC6D0\uAC00\uC785"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost", onClick: () => go("book") }, "\uCC45 \uC815\uBCF4\uB85C \uB3CC\uC544\uAC00\uAE30"))));
  }
  if (!cart) {
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 560, textAlign: "center", padding: "80px 20px" } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 11, letterSpacing: "0.3em", marginBottom: 16 } }, "CHECKOUT \xB7 \uACB0\uC81C"), /* @__PURE__ */ React.createElement("h1", { className: "ko-serif", style: { fontSize: 32, marginBottom: 20 } }, "\uC7A5\uBC14\uAD6C\uB2C8\uAC00 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 15, lineHeight: 1.8, marginBottom: 32 } }, "\uBC14\uB85C \uACB0\uC81C \uD654\uBA74\uC73C\uB85C \uB4E4\uC5B4\uC628 \uC0C1\uD0DC\uC785\uB2C8\uB2E4. \uCC45 \uC815\uBCF4\uB97C \uD655\uC778\uD55C \uB4A4 \uB2E4\uC2DC \uC8FC\uBB38\uC744 \uC9C4\uD589\uD574 \uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("book") }, "\uCC45 \uC815\uBCF4\uB85C \uC774\uB3D9"), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => go("home") }, "\uD648\uC73C\uB85C"))));
  }
  if (submittedOrder) {
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container", style: { maxWidth: 600, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 40, display: "inline-block" } }, /* @__PURE__ */ React.createElement(BanginojaIcon, { size: 60 })), /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 12, letterSpacing: "0.3em", marginBottom: 16 } }, "ORDER RECEIVED"), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 500, marginBottom: 20 } }, "\uC8FC\uBB38\uC774 ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, "\uC811\uC218"), "\uB418\uC5C8\uC2B5\uB2C8\uB2E4"), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 15, lineHeight: 1.8, marginBottom: 32 } }, "\uC8FC\uBB38\uBC88\uD638 ", /* @__PURE__ */ React.createElement("span", { className: "gold mono" }, submittedOrder.orderNo), /* @__PURE__ */ React.createElement("br", null), "\uC544\uB798 \uACC4\uC88C\uB85C \uC785\uAE08\uC774 \uD655\uC778\uB418\uBA74 \uBC1C\uC1A1 \uC900\uBE44\uB97C \uC2DC\uC791\uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "left", marginBottom: 24 } }, window.BGNJ_BankAccountPicker ? /* @__PURE__ */ React.createElement(window.BGNJ_BankAccountPicker, { value: selectedBankId, onChange: setSelectedBankId }) : null, /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 10,
      padding: "12px 16px",
      background: "var(--bg-2)",
      border: "1px solid var(--line)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uC785\uAE08 \uAE08\uC561"), /* @__PURE__ */ React.createElement("span", { className: "gold ko-serif", style: { fontSize: 22 } }, window.BGNJ_FMT.won(submittedOrder.total))), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, lineHeight: 1.7, marginTop: 10 } }, "\uC785\uAE08\uC790\uBA85\uC5D0 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, submittedOrder.recipient), " \uB610\uB294 \uC8FC\uBB38\uBC88\uD638 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, submittedOrder.orderNo), "\uB97C \uB0A8\uACA8 \uC8FC\uC138\uC694.")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { textAlign: "left", marginBottom: 32, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 12 } }, "ORDER SUMMARY"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\u300E", book.title, "\u300F (", submittedOrder.version === "KR" ? "\uAD6D\uBB38\uD310" : "\uC601\uBB38\uD310", ") \xD7 ", submittedOrder.qty), /* @__PURE__ */ React.createElement("span", null, window.BGNJ_FMT.won(submittedOrder.subtotal))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "dim" }, "\uBC30\uC1A1\uBE44"), /* @__PURE__ */ React.createElement("span", null, submittedOrder.shipping === 0 ? "\uBB34\uB8CC" : window.BGNJ_FMT.won(submittedOrder.shipping))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--line)", marginTop: 6 } }, /* @__PURE__ */ React.createElement("span", null, "\uACB0\uC81C \uAE08\uC561"), /* @__PURE__ */ React.createElement("span", { className: "gold-2 ko-serif", style: { fontSize: 22 } }, window.BGNJ_FMT.won(submittedOrder.total))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, paddingTop: 12, borderTop: "1px dashed var(--line)", fontSize: 13, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 6 } }, "SHIPPING TO"), submittedOrder.recipient, " \xB7 ", submittedOrder.phone, /* @__PURE__ */ React.createElement("br", null), submittedOrder.address, submittedOrder.addressDetail && ` ${submittedOrder.addressDetail}`, submittedOrder.memo && /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 12, marginTop: 4 } }, "\xB7 ", submittedOrder.memo))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => go("home") }, "\uD648\uC73C\uB85C"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-gold", onClick: () => go("mypage") }, "\uC8FC\uBB38 \uB0B4\uC5ED \uBCF4\uAE30"))));
  }
  const submit = async (e) => {
    var _a, _b, _c;
    e.preventDefault();
    if (submitting) return;
    setError("");
    if (!recipient.trim()) return setError("\uBC1B\uB294 \uBD84 \uC774\uB984\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
    if (!phone.trim()) return setError("\uC5F0\uB77D\uCC98\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
    if (!address.trim()) return setError("\uAE30\uBCF8 \uC8FC\uC18C\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
    setSubmitting(true);
    try {
      const crPrefix = ((_b = (_a = window.BGNJ_CashReceipt) == null ? void 0 : _a.encode) == null ? void 0 : _b.call(_a, cashReceipt)) || "";
      const memoCombined = (crPrefix + (memo.trim() || "")).trim();
      const result = await window.BGNJ_BOOK_ORDERS.createOrder({
        userId: user.id,
        bookId: book.id,
        unit,
        version,
        qty,
        recipient: recipient.trim(),
        phone: phone.trim(),
        address: address.trim(),
        addressDetail: addressDetail.trim(),
        memo: memoCombined
      });
      if (!(result == null ? void 0 : result.ok)) {
        setSubmitting(false);
        return setError((result == null ? void 0 : result.message) || "\uC8FC\uBB38 \uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
      }
      setSubmittedOrder(result.order);
    } catch (err) {
      setError(((_c = err == null ? void 0 : err.body) == null ? void 0 : _c.error) || (err == null ? void 0 : err.message) || "\uC8FC\uBB38 \uCC98\uB9AC \uC911 \uC624\uB958");
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, (() => {
    var _a, _b, _c, _d;
    const _i = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).bookCheckoutIntro || {};
    const eb = _i.eyebrow || "CHECKOUT \xB7 \uACB0\uC81C";
    const tp = (_c = _i.titlePrefix) != null ? _c : "\uC8FC\uBB38 / ";
    const ta = (_d = _i.titleAccent) != null ? _d : "\uACB0\uC81C";
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, eb), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, tp, /* @__PURE__ */ React.createElement("span", { className: "accent" }, ta)));
  })(), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, marginTop: 14, maxWidth: 680 } }, "\uD604\uC7AC \uACB0\uC81C \uC218\uB2E8\uC740 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uBB34\uD1B5\uC7A5 \uC785\uAE08"), "\uB9CC \uC9C0\uC6D0\uD569\uB2C8\uB2E4. \uC8FC\uBB38 \uD6C4 \uC548\uB0B4\uB41C \uACC4\uC88C\uB85C \uC785\uAE08\uD558\uC2DC\uBA74 \uC6B4\uC601\uC790\uAC00 \uD655\uC778 \uD6C4 \uBC1C\uC1A1\uC744 \uC2DC\uC791\uD569\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("form", { onSubmit: submit, style: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 60 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 22, marginBottom: 20 } }, "\uBC30\uC1A1 \uC815\uBCF4"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 } }, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "ck-name" }, "\uBC1B\uB294 \uBD84 ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement("input", { id: "ck-name", className: "field-input", value: recipient, onChange: (e) => setRecipient(e.target.value), placeholder: "\uC774\uB984" })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "ck-phone" }, "\uC5F0\uB77D\uCC98 ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement("input", { id: "ck-phone", className: "field-input", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "010-0000-0000" }))), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "ck-addr" }, "\uAE30\uBCF8 \uC8FC\uC18C ", /* @__PURE__ */ React.createElement("span", { className: "gold", "aria-hidden": "true" }, "*")), /* @__PURE__ */ React.createElement("input", { id: "ck-addr", className: "field-input", value: address, onChange: (e) => setAddress(e.target.value), placeholder: "\uC6B0\uD3B8\uBC88\uD638 + \uAE30\uBCF8 \uC8FC\uC18C" })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "ck-addr2" }, "\uC0C1\uC138 \uC8FC\uC18C"), /* @__PURE__ */ React.createElement("input", { id: "ck-addr2", className: "field-input", value: addressDetail, onChange: (e) => setAddressDetail(e.target.value), placeholder: "\uB3D9/\uD638\uC218 \uB4F1" })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field-label", htmlFor: "ck-memo" }, "\uBC30\uC1A1 \uBA54\uBAA8"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      id: "ck-memo",
      className: "field-input",
      value: memo,
      onChange: (e) => setMemo(e.target.value),
      placeholder: "\uBD80\uC7AC \uC2DC \uACBD\uBE44\uC2E4\uC5D0 \uB9E1\uACA8\uC8FC\uC138\uC694",
      style: { minHeight: 80, resize: "vertical" }
    }
  )), window.BGNJ_CashReceiptField && /* @__PURE__ */ React.createElement(window.BGNJ_CashReceiptField, { value: cashReceipt, onChange: setCashReceipt }), /* @__PURE__ */ React.createElement("h3", { className: "ko-serif", style: { fontSize: 22, marginTop: 24, marginBottom: 14 } }, "\uACB0\uC81C \uC218\uB2E8 \u2014 \uBB34\uD1B5\uC7A5 \uC785\uAE08"), window.BGNJ_BankAccountPicker ? /* @__PURE__ */ React.createElement(window.BGNJ_BankAccountPicker, { value: selectedBankId, onChange: setSelectedBankId }) : /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 13, lineHeight: 1.8, padding: "12px 14px", border: "1px solid var(--line)" } }, "\uC6B4\uC601\uC790 \uACC4\uC88C\uAC00 \uB4F1\uB85D\uB418\uC5B4 \uC788\uC5B4\uC57C \uC8FC\uBB38\uC774 \uC9C4\uD589\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 12, marginTop: 10, lineHeight: 1.7 } }, "\uC8FC\uBB38 \uC811\uC218 \uD6C4 \uC704 \uACC4\uC88C\uB85C \uC785\uAE08\uD558\uC2DC\uBA74 \uC6B4\uC601\uC790\uAC00 \uD655\uC778\uD558\uC5EC \uBC1C\uC1A1\uC744 \uC2DC\uC791\uD569\uB2C8\uB2E4."), error && /* @__PURE__ */ React.createElement("div", { role: "alert", style: { padding: "12px 16px", background: "rgba(194,74,61,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: 13, marginTop: 20 } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, marginTop: 24 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-block", onClick: () => go("book") }, "\u2190 \uCC45 \uC815\uBCF4"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      className: "btn btn-gold btn-block",
      disabled: submitting,
      style: submitting ? { opacity: 0.6, cursor: "wait" } : void 0
    },
    submitting ? "\uC8FC\uBB38 \uCC98\uB9AC \uC911\u2026" : `\uC8FC\uBB38 \uC811\uC218 \xB7 ${window.BGNJ_FMT.won(total)}`
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "card card-gold mobile-release-sticky", style: { position: "sticky", top: 100 } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.3em", marginBottom: 20 } }, "ORDER SUMMARY"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--line)" } }, book.coverDataUri ? /* @__PURE__ */ React.createElement("div", { style: { width: 72, aspectRatio: "3/4", flexShrink: 0, border: "1px solid var(--line-2)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("img", { src: book.coverDataUri, alt: `${book.title} \uD45C\uC9C0`, style: { width: "100%", height: "100%", objectFit: "contain", display: "block" } })) : /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: { width: 72, aspectRatio: "3/4", fontSize: 8, flexShrink: 0 } }, (book.title || "\uCC45").slice(0, 1)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "ko-serif", style: { fontSize: 17, marginBottom: 4 } }, "\u300E", book.title, "\u300F"), /* @__PURE__ */ React.createElement("div", { className: "dim-2 mono", style: { fontSize: 11 } }, version === "KR" ? "\uAD6D\uBB38\uD310" : "\uC601\uBB38\uD310", " \xB7 ", qty, "\uAD8C"), /* @__PURE__ */ React.createElement("div", { className: "gold ko-serif", style: { fontSize: 16, marginTop: 8 } }, window.BGNJ_FMT.won(subtotal)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 0", color: "var(--ink-2)" } }, /* @__PURE__ */ React.createElement("span", null, "\uC0C1\uD488 \uD569\uACC4"), /* @__PURE__ */ React.createElement("span", null, window.BGNJ_FMT.won(subtotal))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 0", color: "var(--ink-2)" } }, /* @__PURE__ */ React.createElement("span", null, "\uBC30\uC1A1\uBE44"), /* @__PURE__ */ React.createElement("span", null, shipping === 0 ? "\uBB34\uB8CC" : window.BGNJ_FMT.won(shipping))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "16px 0", borderTop: "1px solid var(--line)", marginTop: 8 } }, /* @__PURE__ */ React.createElement("span", null, "\uACB0\uC81C \uAE08\uC561"), /* @__PURE__ */ React.createElement("span", { className: "gold-2 ko-serif", style: { fontSize: 24 } }, window.BGNJ_FMT.won(total))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24, padding: "16px", background: "rgba(245,213,72,0.04)", border: "1px dashed var(--primary-dim)" } }, /* @__PURE__ */ React.createElement("div", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 } }, "\u25C6 \uC6B4\uC601 \uC548\uB0B4"), /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 12, lineHeight: 1.7 } }, "\xB7 \uC785\uAE08 \uD655\uC778 \uD6C4 \uD3C9\uC77C 1-2\uC77C \uB0B4 \uBC1C\uC1A1", /* @__PURE__ */ React.createElement("br", null), "\xB7 \uC8FC\uBB38 \uCDE8\uC18C\xB7\uD658\uBD88\uC740 \uB9C8\uC774\uD398\uC774\uC9C0\uC5D0\uC11C \uC694\uCCAD")))))));
};
Object.assign(window, { BookPage, CheckoutPage });

})();

(function(){
window.useModalGuard = function useModalGuard({ open, dirty, onClose, onSaveDraft, label }) {
  const promptName = label || "\uC791\uC131 \uC911\uC778 \uB0B4\uC6A9";
  const stateRef = React.useRef({ dirty, onClose, onSaveDraft, promptName });
  stateRef.current = { dirty, onClose, onSaveDraft, promptName };
  const handleAttemptClose = React.useCallback(() => {
    var _a, _b, _c;
    const s = stateRef.current;
    if (!s.dirty) {
      (_a = s.onClose) == null ? void 0 : _a.call(s);
      return;
    }
    if (s.onSaveDraft) {
      const yes = window.confirm(`${s.promptName}\uC774(\uAC00) \uC800\uC7A5\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.
\uC784\uC2DC\uC800\uC7A5 \uD558\uC2DC\uACA0\uC5B4\uC694?

[\uD655\uC778] = \uC784\uC2DC\uC800\uC7A5 \uD6C4 \uB2EB\uAE30
[\uCDE8\uC18C] = \uADF8\uB0E5 \uB2EB\uAE30 (\uBCC0\uACBD \uB0B4\uC6A9 \uBC84\uB9BC)`);
      if (yes) {
        try {
          s.onSaveDraft();
        } catch (e) {
        }
      }
      (_b = s.onClose) == null ? void 0 : _b.call(s);
    } else {
      const ok = window.confirm(`${s.promptName}\uC774(\uAC00) \uC800\uC7A5\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC815\uB9D0 \uB2EB\uC73C\uC2DC\uACA0\uC5B4\uC694?`);
      if (ok) (_c = s.onClose) == null ? void 0 : _c.call(s);
    }
  }, []);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        handleAttemptClose();
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let pushed = false;
    try {
      window.history.pushState({ bgnjModal: true }, "");
      pushed = true;
    } catch (e) {
    }
    const onPop = () => {
      handleAttemptClose();
    };
    if (pushed) window.addEventListener("popstate", onPop);
    return () => {
      var _a;
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (pushed) {
        window.removeEventListener("popstate", onPop);
        try {
          if ((_a = window.history.state) == null ? void 0 : _a.bgnjModal) window.history.back();
        } catch (e) {
        }
      }
    };
  }, [open, handleAttemptClose]);
  const onBackdropClick = React.useCallback((e) => {
    if (e.target === e.currentTarget) handleAttemptClose();
  }, [handleAttemptClose]);
  return { onBackdropClick, handleAttemptClose };
};
const ScrollToTop = () => {
  const [visible, setVisible] = React.useState(false);
  const findScroller = () => {
    var _a;
    return ((_a = document.querySelector("main")) == null ? void 0 : _a.closest("main")) || document.documentElement;
  };
  const getScrollY = () => {
    const adminScroller = document.querySelector('div[aria-label="\uAD00\uB9AC\uC790 \uBA54\uB274"] + div');
    if (adminScroller) {
      return Math.max(adminScroller.scrollTop || 0, window.scrollY || 0);
    }
    return window.scrollY || 0;
  };
  React.useEffect(() => {
    const onScroll = () => setVisible(getScrollY() > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const adminScroller = document.querySelector('div[aria-label="\uAD00\uB9AC\uC790 \uBA54\uB274"] + div');
    if (adminScroller) adminScroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (adminScroller) adminScroller.removeEventListener("scroll", onScroll);
    };
  }, []);
  const goTop = () => {
    const adminScroller = document.querySelector('div[aria-label="\uAD00\uB9AC\uC790 \uBA54\uB274"] + div');
    if (adminScroller && adminScroller.scrollTop > 0) {
      adminScroller.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (!visible) return null;
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: goTop,
      "aria-label": "\uB9E8 \uC704\uB85C",
      title: "\uB9E8 \uC704\uB85C",
      style: {
        position: "fixed",
        right: 24,
        bottom: 28,
        zIndex: 60,
        width: 48,
        height: 48,
        background: "var(--bg-2)",
        color: "var(--gold)",
        border: "1px solid var(--gold-dim)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-serif)",
        fontSize: 22
      }
    },
    "\u2191"
  );
};
const AuthorGradeBadge = ({ authorId, author, authorEmail, size = "sm" }) => {
  var _a;
  const grade = (_a = window.BGNJ_AUTHOR_GRADE) == null ? void 0 : _a.call(window, { authorId, author, authorEmail });
  if (!grade) return null;
  const small = size === "sm";
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      className: "mono",
      title: `${grade.label} \xB7 ${grade.desc || ""}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        marginLeft: 6,
        padding: small ? "1px 6px" : "2px 8px",
        fontSize: small ? 9 : 10,
        letterSpacing: "0.14em",
        color: grade.color || "var(--gold)",
        border: `1px solid ${grade.color || "var(--gold-dim)"}`,
        borderRadius: 2,
        textTransform: "uppercase",
        verticalAlign: "middle"
      }
    },
    grade.label
  );
};
const NotificationBell = ({ user, onPick }) => {
  const [open, setOpen] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "bgnj_notifications") setTick((t) => t + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  if (!user) return null;
  const rawList = (() => {
    var _a, _b;
    try {
      return (_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a.listNotifications) == null ? void 0 : _b.call(_a, user.id);
    } catch (e) {
      return [];
    }
  })();
  const list = Array.isArray(rawList) ? rawList : [];
  const unread = list.filter((n) => n && !n.read).length;
  const pick = (n) => {
    var _a, _b;
    try {
      (_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a.markNotificationRead) == null ? void 0 : _b.call(_a, user.id, n.id);
    } catch (e) {
    }
    setOpen(false);
    if (onPick) onPick(n);
    setTick((t) => t + 1);
  };
  const markAll = () => {
    var _a, _b;
    try {
      (_b = (_a = window.BGNJ_COMMUNITY) == null ? void 0 : _a.markAllNotificationsRead) == null ? void 0 : _b.call(_a, user.id);
    } catch (e) {
    }
    setTick((t) => t + 1);
  };
  return /* @__PURE__ */ React.createElement("div", { ref, style: { position: "relative" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-small",
      "aria-label": `\uC54C\uB9BC ${unread > 0 ? `${unread}\uAC74 \uC548 \uC77D\uC74C` : ""}`,
      onClick: () => setOpen((v) => !v),
      style: { position: "relative", padding: "6px 10px", minWidth: 36 }
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        "aria-hidden": "true",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: { display: "block", verticalAlign: "middle" }
      },
      /* @__PURE__ */ React.createElement("path", { d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }),
      /* @__PURE__ */ React.createElement("path", { d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" })
    ),
    unread > 0 && /* @__PURE__ */ React.createElement(
      "span",
      {
        "aria-hidden": "true",
        style: {
          position: "absolute",
          top: -4,
          right: -4,
          background: "var(--gold)",
          color: "var(--bg)",
          borderRadius: 999,
          fontSize: 9,
          fontWeight: 700,
          padding: "1px 5px",
          letterSpacing: 0,
          minWidth: 14,
          textAlign: "center",
          lineHeight: 1.4
        }
      },
      unread > 9 ? "9+" : unread
    )
  ), open && /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-label": "\uC54C\uB9BC \uBAA9\uB85D",
      style: {
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: 320,
        maxHeight: 400,
        overflow: "auto",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        zIndex: 50
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "mono gold", style: { fontSize: 10, letterSpacing: "0.22em" } }, "\uC54C\uB9BC \xB7 ", list.length), unread > 0 && /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: markAll,
        className: "btn-ghost",
        style: { fontSize: 11, color: "var(--ink-2)" }
      },
      "\uBAA8\uB450 \uC77D\uC74C"
    )),
    list.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "dim", style: { padding: 24, textAlign: "center", fontSize: 13 } }, "\uC544\uC9C1 \uBC1B\uC740 \uC54C\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0 } }, list.map((n) => /* @__PURE__ */ React.createElement("li", { key: n.id }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => pick(n),
        style: {
          width: "100%",
          textAlign: "left",
          padding: "12px 14px",
          background: n.read ? "transparent" : "rgba(245,213,72,0.06)",
          borderBottom: "1px solid var(--line)",
          cursor: "pointer"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink)", marginBottom: 4, lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement("span", { className: "gold" }, n.fromName), /* @__PURE__ */ React.createElement("span", { className: "dim" }, " \xB7 ", n.message || "\uC0C8 \uC54C\uB9BC")),
      n.postTitle && /* @__PURE__ */ React.createElement("div", { className: "dim", style: { fontSize: 11, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, "\u25B8 ", n.postTitle),
      /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, marginTop: 4, letterSpacing: "0.1em" } }, window.BGNJ_FMT.kstDateTime(n.createdAt))
    ))))
  ));
};
const BanginojaIcon = ({ size = 22 }) => /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 64 64", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("rect", { width: "64", height: "64", rx: "9", ry: "9", fill: "#F5D548" }), /* @__PURE__ */ React.createElement(
  "path",
  {
    fillRule: "evenodd",
    d: "M 9 8 L 9 56 L 32 56 C 42 56 47 51 47 44.5 C 47 39.5 44 36 39.5 35 C 43 33.5 45.5 30.5 45.5 26 C 45.5 18.5 40 14 30 14 L 9 14 Z M 18 19 L 28 19 C 33 19 36 21 36 25 C 36 29 33 31 28 31 L 18 31 Z M 18 36 L 30 36 C 36 36 39 38.5 39 43 C 39 47.5 36 50 30 50 L 18 50 Z",
    fill: "#FFFFFF"
  }
), /* @__PURE__ */ React.createElement(
  "path",
  {
    d: "M 26 22.5 C 27 21.5 28 21.5 28.5 22.5 L 31 27 L 38 25 C 38.8 24.8 39.4 25.2 39.5 26 C 39.6 26.6 39.3 27.1 38.8 27.4 L 32.5 30.7 L 33.5 36.5 L 36 37.8 C 36.4 38 36.5 38.4 36.3 38.7 C 36.2 39 35.9 39.1 35.6 39 L 31.5 38 L 28 39.5 C 27.7 39.6 27.3 39.4 27.2 39 C 27.1 38.7 27.3 38.4 27.6 38.2 L 30 37 L 28.7 32 L 24 33.5 C 23.4 33.7 22.9 33.4 22.8 32.8 C 22.7 32.3 23 31.9 23.5 31.7 L 27.5 30.2 L 26.3 26 L 25.5 24.5 C 25.2 24 25.4 23.3 26 23 Z",
    fill: "#F5D548"
  }
), /* @__PURE__ */ React.createElement("g", { fill: "#FFFFFF" }, /* @__PURE__ */ React.createElement("path", { d: "M 53 15 L 54.5 18 L 57.5 19.5 L 54.5 21 L 53 24 L 51.5 21 L 48.5 19.5 L 51.5 18 Z" }), /* @__PURE__ */ React.createElement("path", { d: "M 58 26 L 59 28 L 61 29 L 59 30 L 58 32 L 57 30 L 55 29 L 57 28 Z" }), /* @__PURE__ */ React.createElement("path", { d: "M 50 33 L 50.7 34.5 L 52.2 35 L 50.7 35.5 L 50 37 L 49.3 35.5 L 47.8 35 L 49.3 34.5 Z" }), /* @__PURE__ */ React.createElement("path", { d: "M 55 40 L 55.5 41 L 56.5 41.5 L 55.5 42 L 55 43 L 54.5 42 L 53.5 41.5 L 54.5 41 Z" }), /* @__PURE__ */ React.createElement("path", { d: "M 59 36 L 59.4 37 L 60.4 37.5 L 59.4 38 L 59 39 L 58.6 38 L 57.6 37.5 L 58.6 37 Z" })));
const Brand = ({ onClick }) => {
  var _a, _b, _c;
  const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
  const brand = sc.brand || { name: "\uBC45\uAE30\uB178\uC790", sub: "BANGINOJA" };
  const logo = (_c = sc.branding) == null ? void 0 : _c.logoDataUri;
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "brand",
      onClick,
      "aria-label": `${brand.name} \uD648\uC73C\uB85C`,
      style: { background: "none", border: "none", padding: 0, cursor: "pointer" }
    },
    /* @__PURE__ */ React.createElement("span", { className: "brand-mark", "aria-hidden": "true" }, logo ? /* @__PURE__ */ React.createElement("img", { src: logo, alt: "", style: { width: 22, height: 22, objectFit: "contain", display: "block" } }) : /* @__PURE__ */ React.createElement(BanginojaIcon, { size: 22 })),
    /* @__PURE__ */ React.createElement("span", { className: "brand-name" }, brand.name, /* @__PURE__ */ React.createElement("span", { className: "sub", lang: "en" }, brand.sub))
  );
};
const Nav = ({ route, go, user, onLogout }) => {
  var _a, _b, _c;
  const navL = (((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {}).nav || {};
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => {
    setMobileOpen(false);
  }, [route]);
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);
  const playChildren = [
    { key: "eat", label: navL.eat || "\uBA39\uACE0 \uB180\uC790", desc: "\uC2DD \u98DF \u2014 \uD55C\uC815\uC2DD\xB7\uD5A5\uD1A0\uC74C\uC2DD\xB7\uC2DC\uC7A5" },
    { key: "sleep", label: navL.sleep || "\uC790\uACE0 \uB180\uC790", desc: "\uC8FC \u4F4F \u2014 \uD55C\uC625\xB7\uACE0\uD0DD\xB7\uD15C\uD50C\uC2A4\uD14C\uC774" },
    { key: "shop", label: navL.shop || "\uC0AC\uACE0 \uB180\uC790", desc: "\uC758 \u8863 \u2014 \uC804\uD1B5\uACF5\uC608\xB7\uD1A0\uC0B0\uBB3C" }
  ];
  const playKeys = playChildren.map((p) => p.key);
  const items = [
    { key: "home", label: navL.home || "\uD648" },
    { key: "play", label: navL.play || "\uB180\uC790", isMega: "play", defaultRoute: "eat" },
    { key: "tour", label: navL.tour || "\uD22C\uC5B4" },
    { key: "lectures", label: navL.lectures || "\uAC15\uC5F0" },
    { key: "column", label: navL.column || "\uCE7C\uB7FC" },
    { key: "book", label: navL.book || "\uCC45" },
    { key: "community", label: navL.community || "\uCEE4\uBBA4\uB2C8\uD2F0", isMega: "community" }
  ];
  const userLevel = window.BGNJ_USER_LEVEL ? window.BGNJ_USER_LEVEL(user) : user ? 10 : 0;
  const communityBoards = (((_c = window.BGNJ_STORES) == null ? void 0 : _c.categories) || []).filter((c) => {
    var _a2;
    return c.boardType === "community" && userLevel >= ((_a2 = c.minLevel) != null ? _a2 : 0);
  });
  const goBoard = (boardId) => {
    try {
      sessionStorage.setItem("bgnj_pending_board_id", boardId);
    } catch (e) {
    }
    go("community");
  };
  const isActive = (it) => {
    if (it.isMega === "play") return playKeys.includes(route);
    return route === it.key;
  };
  return /* @__PURE__ */ React.createElement("nav", { className: `nav ${mobileOpen ? "mobile-open" : ""}`, "aria-label": "\uC8FC \uBA54\uB274" }, /* @__PURE__ */ React.createElement("div", { className: "container nav-inner" }, /* @__PURE__ */ React.createElement(Brand, { onClick: () => go("home") }), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "nav-toggle",
      "aria-label": mobileOpen ? "\uBA54\uB274 \uB2EB\uAE30" : "\uBA54\uB274 \uC5F4\uAE30",
      "aria-expanded": mobileOpen,
      "aria-controls": "primary-nav-menu",
      onClick: () => setMobileOpen((v) => !v)
    },
    /* @__PURE__ */ React.createElement("span", { className: "nav-toggle-bars", "aria-hidden": "true" })
  ), /* @__PURE__ */ React.createElement("ul", { id: "primary-nav-menu", className: "nav-menu", role: "list", style: { listStyle: "none", margin: 0, padding: 0 } }, items.map((it) => {
    const hasMega = it.isMega === "play" || it.isMega === "community" && communityBoards.length > 0;
    const onClick = () => go(it.defaultRoute || it.key);
    return /* @__PURE__ */ React.createElement("li", { key: it.key, style: { position: "relative" }, className: hasMega ? "nav-has-mega" : "" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: `nav-link ${isActive(it) ? "active" : ""}`,
        "aria-current": isActive(it) ? "page" : void 0,
        "aria-haspopup": hasMega ? "menu" : void 0,
        onClick
      },
      it.label,
      hasMega ? " \u25BE" : ""
    ), it.isMega === "play" && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "nav-mega",
        role: "menu",
        "aria-label": "\uB180\uC790 \u2014 \uC758\uC2DD\uC8FC \uCE74\uD14C\uACE0\uB9AC",
        style: {
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          minWidth: 280,
          padding: "10px 0",
          background: "var(--bg)",
          border: "1px solid var(--line)",
          boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
          visibility: "hidden",
          opacity: 0,
          transition: "opacity .12s ease",
          zIndex: 50
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", padding: "6px 16px 8px" } }, "\uC758\uC2DD\uC8FC \u8863\u98DF\u4F4F"),
      /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0 } }, playChildren.map((p) => /* @__PURE__ */ React.createElement("li", { key: p.key }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          role: "menuitem",
          onClick: () => go(p.key),
          style: {
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "10px 16px",
            background: "transparent",
            color: "var(--ink-2)",
            border: "none",
            cursor: "pointer"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = "var(--bg-2)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "transparent";
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500 } }, p.label),
        /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.05em", marginTop: 2 } }, p.desc)
      ))))
    ), it.isMega === "play" && /* @__PURE__ */ React.createElement("ul", { className: "nav-mobile-submenu", role: "list", "aria-label": "\uB180\uC790 \uD558\uC704", style: { listStyle: "none", margin: 0, padding: 0 } }, playChildren.map((p) => /* @__PURE__ */ React.createElement("li", { key: p.key }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: `nav-link nav-sub-link ${route === p.key ? "active" : ""}`,
        "aria-current": route === p.key ? "page" : void 0,
        onClick: () => go(p.key)
      },
      p.label
    )))), it.isMega === "community" && communityBoards.length > 0 && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "nav-mega",
        role: "menu",
        "aria-label": "\uAC8C\uC2DC\uD310 \uBAA9\uB85D",
        style: {
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          minWidth: 220,
          padding: "10px 0",
          background: "var(--bg)",
          border: "1px solid var(--line)",
          boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
          visibility: "hidden",
          opacity: 0,
          transition: "opacity .12s ease",
          zIndex: 50
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 9, letterSpacing: "0.22em", padding: "6px 16px 8px" } }, "BOARDS"),
      /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0 } }, communityBoards.map((b) => /* @__PURE__ */ React.createElement("li", { key: b.id }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          role: "menuitem",
          onClick: () => goBoard(b.id),
          style: {
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "8px 16px",
            fontSize: 13,
            background: "transparent",
            color: "var(--ink-2)",
            border: "none",
            cursor: "pointer"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = "var(--bg-2)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "transparent";
          }
        },
        /* @__PURE__ */ React.createElement("span", null, b.label)
      ))), /* @__PURE__ */ React.createElement("li", { style: { borderTop: "1px solid var(--line)", marginTop: 6, paddingTop: 6 } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          role: "menuitem",
          onClick: () => go("community"),
          style: {
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "8px 16px",
            fontSize: 12,
            letterSpacing: "0.18em",
            background: "transparent",
            color: "var(--secondary)",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-mono)"
          }
        },
        "\uC804\uCCB4 \uBCF4\uAE30 \u2192"
      )))
    ));
  }), /* @__PURE__ */ React.createElement("li", { className: "nav-mobile-only nav-mobile-divider", "aria-hidden": "true" }), user ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("li", { className: "nav-mobile-only" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "nav-link", onClick: () => go("mypage") }, "\uB9C8\uC774\uD398\uC774\uC9C0")), user.isAdmin && /* @__PURE__ */ React.createElement("li", { className: "nav-mobile-only" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "nav-link", onClick: () => go("admin") }, "\uAD00\uB9AC")), /* @__PURE__ */ React.createElement("li", { className: "nav-mobile-only" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "nav-link", onClick: onLogout }, "\uB85C\uADF8\uC544\uC6C3"))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("li", { className: "nav-mobile-only" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "nav-link", onClick: () => go("login") }, "\uB85C\uADF8\uC778")), /* @__PURE__ */ React.createElement("li", { className: "nav-mobile-only" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "nav-link", onClick: () => go("signup") }, "\uD68C\uC6D0\uAC00\uC785")))), /* @__PURE__ */ React.createElement("div", { className: "nav-actions" }, user ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "span",
    {
      className: "mono",
      "aria-label": `\uB85C\uADF8\uC778: ${user.name}`,
      style: { fontSize: 11, letterSpacing: "0.15em", color: "var(--ink-2)" }
    },
    user.name
  ), /* @__PURE__ */ React.createElement(NotificationBell, { user, onPick: (n) => {
    try {
      if (n.type === "comment" && n.postId) {
        sessionStorage.setItem("bgnj_pending_post_id", String(n.postId));
        go("community");
        return;
      }
      if (n.type === "lecture_confirmed" || n.type === "lecture_promoted") {
        if (n.lectureId) sessionStorage.setItem("bgnj_pending_lecture_id", String(n.lectureId));
        go("lectures");
        return;
      }
      if (n.type === "tour_confirmed" || n.type === "tour_promoted") {
        if (n.tourId) sessionStorage.setItem("bgnj_pending_tour_id", String(n.tourId));
        go("tour");
        return;
      }
      if (String(n.type || "").startsWith("order_")) {
        go("mypage");
        return;
      }
      if (n.postId) {
        sessionStorage.setItem("bgnj_pending_post_id", String(n.postId));
        go("community");
      }
    } catch (e) {
    }
  } }), /* @__PURE__ */ React.createElement("button", { className: "btn btn-small", onClick: () => go("mypage") }, "\uB9C8\uC774\uD398\uC774\uC9C0"), user.isAdmin && /* @__PURE__ */ React.createElement("button", { className: "btn btn-small", onClick: () => go("admin") }, "\uAD00\uB9AC"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-small", onClick: onLogout }, "\uB85C\uADF8\uC544\uC6C3")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn-ghost nav-link",
      onClick: () => go("login"),
      style: { fontSize: 12, letterSpacing: "0.1em", color: "var(--ink-2)" }
    },
    "\uB85C\uADF8\uC778"
  ), /* @__PURE__ */ React.createElement("button", { className: "btn btn-small", onClick: () => go("signup") }, "\uD68C\uC6D0\uAC00\uC785")))));
};
const Footer = ({ go }) => {
  var _a, _b, _c, _d, _e;
  const sc = ((_b = (_a = window.BGNJ_SITE_CONTENT) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || {};
  const contact = sc.contact || {};
  const footer = sc.footer || {};
  const fStyle = ((_c = window.BGNJ_FOOTER_STYLE) == null ? void 0 : _c.call(window)) || window.BGNJ_FOOTER_STYLE_DEFAULT;
  const email = contact.email || "contact@bgnj.net";
  const address = contact.address || "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uC11C\uCD08\uAD6C \uC11C\uCD08\uB300\uB85C73\uAE38 40, 7\uCE35 13\uD638 (\uC11C\uCD08\uB3D9, \uAC15\uB0A8\uC624\uD53C\uC2A4\uD154)";
  const companyName = contact.companyName || "\uC8FC\uC2DD\uD68C\uC0AC \uBC45\uAE30\uB178\uC790";
  const ceo = contact.ceo || "";
  const bizRegNo = contact.bizRegNo || "";
  const corpRegNo = contact.corpRegNo || "";
  const founded = contact.founded || "";
  const headingStyle = {
    fontSize: fStyle.heading.fontSize,
    fontWeight: fStyle.heading.fontWeight,
    letterSpacing: `${fStyle.heading.letterSpacing}em`,
    color: `var(${fStyle.heading.color})`
  };
  return /* @__PURE__ */ React.createElement("footer", { className: "footer", "aria-label": "\uC0AC\uC774\uD2B8 \uC815\uBCF4 \uBC0F \uD478\uD130" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "footer-grid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Brand, { onClick: () => go("home") }), /* @__PURE__ */ React.createElement("p", { className: "dim bgnj-multiline", style: {
    marginTop: 20,
    fontSize: fStyle.description.fontSize,
    fontWeight: fStyle.description.fontWeight,
    lineHeight: fStyle.description.lineHeight,
    color: `var(${fStyle.description.color})`,
    maxWidth: fStyle.description.maxWidth
  } }, footer.description || "\uBC45\uAE30\uD0C0\uACE0 \uB178\uC790. \uBC45\uAE30\uB178\uC790\uB294 \uD55C\uAD6D\uC758 \uC5ED\uC0AC\xB7\uBB38\uD654\xB7\uC790\uC5F0\uC744 \uC9C1\uC811 \uAC77\uACE0 \uB290\uB07C\uBA70 \uB098\uB204\uB294 \uC5EC\uD589 \uCEE4\uBBA4\uB2C8\uD2F0\uC785\uB2C8\uB2E4. \uAD81\uAD90 \uB2F5\uC0AC\uBD80\uD130 \uC9C0\uC5ED \uC5EC\uD589\uAE4C\uC9C0, \uD568\uAED8 \uB9CC\uB4E4\uC5B4\uAC00\uB294 \uC5EC\uD589.")), /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uCF58\uD150\uCE20 \uBC14\uB85C\uAC00\uAE30" }, /* @__PURE__ */ React.createElement("h4", { id: "ft-content", style: headingStyle }, footer.headingContent || "\uCF58\uD150\uCE20"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-content" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("column") }, "\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("tour") }, "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("community") }, "\uCEE4\uBBA4\uB2C8\uD2F0")))), /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uC815\uBCF4 \uBC14\uB85C\uAC00\uAE30" }, /* @__PURE__ */ React.createElement("h4", { id: "ft-info", style: headingStyle }, footer.headingInfo || "\uC815\uBCF4"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-info" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("home") }, "\uAC15\uC5F0 \uC77C\uC815")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("community") }, "\uACF5\uC9C0\uC0AC\uD56D")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("faq") }, "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("terms") }, "\uC774\uC6A9\uC57D\uAD00")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("privacy") }, "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68")))), /* @__PURE__ */ React.createElement("address", { style: { fontStyle: "normal" } }, /* @__PURE__ */ React.createElement("h4", { id: "ft-contact", style: headingStyle }, footer.headingContact || "\uC5F0\uB77D"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-contact" }, email && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: `mailto:${email}` }, email)), address && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("span", null, address))))), (companyName || bizRegNo || ceo) && /* @__PURE__ */ React.createElement("div", { className: "footer-biz", style: {
    marginTop: 24,
    paddingTop: 16,
    borderTop: "1px solid var(--line-2)",
    fontSize: 11,
    lineHeight: 1.85,
    color: "var(--ink-3)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.04em",
    display: "flex",
    gap: "2px 18px",
    flexWrap: "wrap"
  } }, companyName && /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--ink-2)" } }, companyName)), ceo && /* @__PURE__ */ React.createElement("span", null, "\uB300\uD45C\uC790 ", ceo), bizRegNo && /* @__PURE__ */ React.createElement("span", null, "\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638 ", bizRegNo), corpRegNo && /* @__PURE__ */ React.createElement("span", null, "\uBC95\uC778\uB4F1\uB85D\uBC88\uD638 ", corpRegNo), founded && /* @__PURE__ */ React.createElement("span", null, "\uC124\uB9BD ", founded)), /* @__PURE__ */ React.createElement("div", { className: "footer-bottom", style: { marginTop: 24 } }, /* @__PURE__ */ React.createElement("span", null, footer.copyright || "\xA9 2026 \uBC45\uAE30\uB178\uC790 BANGINOJA \u2014 ALL RIGHTS RESERVED"), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.14em" } }, "v", ((_d = window.BGNJ_VERSION) == null ? void 0 : _d.version) || "0.0.0", " \xB7 ", ((_e = window.BGNJ_VERSION) == null ? void 0 : _e.build) || "\u2014"), /* @__PURE__ */ React.createElement(ThemeToggle, null), /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: fStyle.signature.fontSize,
    fontWeight: fStyle.signature.fontWeight,
    letterSpacing: `${fStyle.signature.letterSpacing}em`,
    color: `var(${fStyle.signature.color})`,
    textTransform: fStyle.signature.textTransform || "uppercase"
  } }, footer.signature || "\uBC45\uAE30\uD0C0\uACE0 \uB178\uC790 \xB7 DESIGNED IN SEOUL"))));
};
const ThemeToggle = () => {
  const [mode, setMode] = React.useState(() => {
    var _a, _b;
    return ((_b = (_a = window.BGNJ_THEME) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || "auto";
  });
  React.useEffect(() => {
    const onChange = () => {
      var _a, _b;
      return setMode(((_b = (_a = window.BGNJ_THEME) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) || "auto");
    };
    window.addEventListener("bgnj-theme-change", onChange);
    return () => window.removeEventListener("bgnj-theme-change", onChange);
  }, []);
  if (!window.BGNJ_THEME) return null;
  const next = window.BGNJ_THEME.cycle.bind(window.BGNJ_THEME);
  const icon = mode === "dark" ? "\u{1F319}" : mode === "light" ? "\u2600" : "\u25D0";
  const label = mode === "dark" ? "DARK" : mode === "light" ? "LIGHT" : "AUTO";
  return /* @__PURE__ */ React.createElement("button", { type: "button", className: "theme-toggle", onClick: () => next(), "aria-label": `\uD14C\uB9C8 \uC804\uD658 \u2014 \uD604\uC7AC ${label}`, title: "\uD14C\uB9C8: \uB77C\uC774\uD2B8 / \uB2E4\uD06C / \uC790\uB3D9" }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, icon), /* @__PURE__ */ React.createElement("span", null, label));
};
const Ornament = ({ children }) => /* @__PURE__ */ React.createElement("div", { className: "ornament", style: { margin: "40px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-serif)", fontSize: 14, letterSpacing: "0.3em", color: "var(--gold)" } }, children || "\u4E94"));
const SectionHead = ({ eyebrow, title, subtitle, action, level = 2 }) => {
  const H = `h${level}`;
  return /* @__PURE__ */ React.createElement("div", { className: "section-head" }, /* @__PURE__ */ React.createElement("div", null, eyebrow && /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow", "aria-hidden": "true" }, eyebrow), /* @__PURE__ */ React.createElement(H, { className: "section-title" }, title), subtitle && /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, subtitle)), action);
};
const Tweaks = ({ tweaks, setTweaks, visible }) => {
  if (!visible) return null;
  const set = (k, v) => setTweaks({ ...tweaks, [k]: v });
  return /* @__PURE__ */ React.createElement("div", { className: "tweaks" }, /* @__PURE__ */ React.createElement("h3", null, "Tweaks"), /* @__PURE__ */ React.createElement("div", { className: "tweaks-row" }, /* @__PURE__ */ React.createElement("div", { className: "tweaks-label" }, "\uC2EC\uBCFC \uC2A4\uD0C0\uC77C"), /* @__PURE__ */ React.createElement("div", { className: "tweaks-options" }, ["outline", "filled", "dashed"].map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s,
      className: tweaks.lineStyle === s ? "on" : "",
      onClick: () => set("lineStyle", s)
    },
    s === "outline" ? "\uC120" : s === "filled" ? "\uCC44\uC6C0" : "\uD30C\uC120"
  )))), /* @__PURE__ */ React.createElement("div", { className: "tweaks-row" }, /* @__PURE__ */ React.createElement("div", { className: "tweaks-label" }, "\uACE8\uB4DC \uAC15\uB3C4 \xB7 ", tweaks.intensity.toFixed(1)), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      className: "tweaks-slider",
      min: "0.3",
      max: "1.8",
      step: "0.1",
      value: tweaks.intensity,
      onChange: (e) => set("intensity", parseFloat(e.target.value))
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "tweaks-row" }, /* @__PURE__ */ React.createElement("div", { className: "tweaks-label" }, "\uD788\uC5B4\uB85C \uB808\uC774\uC544\uC6C3"), /* @__PURE__ */ React.createElement("div", { className: "tweaks-options" }, ["center", "split", "fullbleed"].map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s,
      className: tweaks.heroLayout === s ? "on" : "",
      onClick: () => set("heroLayout", s)
    },
    s === "center" ? "\uC911\uC559" : s === "split" ? "\uBD84\uD560" : "\uD480\uBE14\uB9AC\uB4DC"
  )))), /* @__PURE__ */ React.createElement("div", { className: "tweaks-row" }, /* @__PURE__ */ React.createElement("div", { className: "tweaks-label" }, "\uC778\uD130\uB799\uC158"), /* @__PURE__ */ React.createElement("div", { className: "tweaks-options" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: tweaks.interactive ? "on" : "",
      onClick: () => set("interactive", !tweaks.interactive)
    },
    tweaks.interactive ? "ON" : "OFF"
  ))));
};
const CookieConsent = () => {
  const KEY = "bgnj_cookie_consent";
  const [decision, setDecision] = React.useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [details, setDetails] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);
  const persist = (next) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {
    }
    setDecision(next);
    try {
      window.dispatchEvent(new CustomEvent("bgnj-cookie-consent", { detail: next }));
    } catch (e) {
    }
  };
  const acceptAll = () => persist({ necessary: true, analytics: true, marketing: true, ts: (/* @__PURE__ */ new Date()).toISOString() });
  const rejectAll = () => persist({ necessary: true, analytics: false, marketing: false, ts: (/* @__PURE__ */ new Date()).toISOString() });
  const saveCustom = () => persist({ necessary: true, analytics: !!analytics, marketing: !!marketing, ts: (/* @__PURE__ */ new Date()).toISOString() });
  if (decision) return null;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "false",
      "aria-labelledby": "cookie-banner-title",
      style: {
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        maxWidth: 720,
        margin: "0 auto",
        zIndex: 80,
        background: "var(--bg-2)",
        border: "1px solid var(--gold-dim)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
        padding: "20px 22px",
        borderRadius: 4
      }
    },
    /* @__PURE__ */ React.createElement("h2", { id: "cookie-banner-title", className: "ko-serif", style: { fontSize: 16, marginBottom: 8 } }, "\uCFE0\uD0A4 \uC0AC\uC6A9 \uB3D9\uC758"),
    /* @__PURE__ */ React.createElement("p", { className: "dim", style: { fontSize: 13, lineHeight: 1.7, marginBottom: 14 } }, "\uBC45\uAE30\uB178\uC790\uB294 \uC11C\uBE44\uC2A4 \uC6B4\uC601\uC744 \uC704\uD55C ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uD544\uC218 \uCFE0\uD0A4"), "\uC640, \uC0AC\uC774\uD2B8 \uAC1C\uC120\uC744 \uC704\uD55C", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, " \uBD84\uC11D \uCFE0\uD0A4"), "\xB7", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uB9C8\uCF00\uD305 \uCFE0\uD0A4"), "\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4. \uC138\uBD80 \uC124\uC815\uC5D0\uC11C \uD56D\uBAA9\uBCC4\uB85C \uC120\uD0DD\uD558\uC2E4 \uC218 \uC788\uC5B4\uC694."),
    details && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14, paddingTop: 10, borderTop: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("fieldset", { style: { border: "none", padding: 0, margin: 0 } }, /* @__PURE__ */ React.createElement("legend", { className: "sr-only" }, "\uCFE0\uD0A4 \uD56D\uBAA9\uBCC4 \uB3D9\uC758"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "flex", gap: 10, alignItems: "flex-start", opacity: 0.7 } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: true, readOnly: true, "aria-label": "\uD544\uC218 \uCFE0\uD0A4 (\uD56D\uC0C1 \uD65C\uC131)" }), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 13 } }, "\uD544\uC218"), /* @__PURE__ */ React.createElement("span", { className: "dim", style: { fontSize: 12, display: "block" } }, "\uB85C\uADF8\uC778 \uC138\uC158, \uBCF4\uC548, \uD544\uC218 \uAE30\uB2A5 \uB3D9\uC791\uC5D0 \uC0AC\uC6A9. \uAC70\uBD80 \uBD88\uAC00."))), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: analytics,
        onChange: (e) => setAnalytics(e.target.checked),
        "aria-label": "\uBD84\uC11D \uCFE0\uD0A4 \uB3D9\uC758"
      }
    ), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 13 } }, "\uBD84\uC11D"), /* @__PURE__ */ React.createElement("span", { className: "dim", style: { fontSize: 12, display: "block" } }, "\uBC29\uBB38 \uD1B5\uACC4\xB7\uD398\uC774\uC9C0 \uC131\uB2A5 \uAC1C\uC120\uC6A9. \uC2DD\uBCC4\uC790 \uC775\uBA85 \uCC98\uB9AC."))), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: marketing,
        onChange: (e) => setMarketing(e.target.checked),
        "aria-label": "\uB9C8\uCF00\uD305 \uCFE0\uD0A4 \uB3D9\uC758"
      }
    ), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 13 } }, "\uB9C8\uCF00\uD305"), /* @__PURE__ */ React.createElement("span", { className: "dim", style: { fontSize: 12, display: "block" } }, "\uAD00\uC2EC\uC0AC \uAE30\uBC18 \uC548\uB0B4, \uC678\uBD80 \uAD11\uACE0 \uB9E4\uCCB4 \uC5F0\uB3D9\uC5D0 \uC0AC\uC6A9.")))))),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn btn-small",
        onClick: () => setDetails((v) => !v),
        "aria-expanded": details
      },
      details ? "\uAC04\uB2E8\uD788" : "\uC138\uBD80 \uC124\uC815"
    ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small", onClick: rejectAll }, "\uBAA8\uB450 \uAC70\uBD80"), details ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: saveCustom }, "\uC120\uD0DD \uC800\uC7A5") : /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-small btn-gold", onClick: acceptAll }, "\uBAA8\uB450 \uB3D9\uC758"))
  );
};
const CoverPlaceholder = ({ aspectRatio = "16/10", label, iconSize = 88 }) => /* @__PURE__ */ React.createElement("div", { className: "placeholder", style: {
  aspectRatio,
  position: "relative",
  display: "grid",
  placeItems: "center",
  background: "var(--bg-2)",
  border: "1px solid var(--line-2)"
} }, /* @__PURE__ */ React.createElement("div", { style: { opacity: 0.5, display: "grid", placeItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(BanginojaIcon, { size: iconSize }), label && /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.22em" } }, label)));
Object.assign(window, { Brand, Nav, Footer, Ornament, SectionHead, Tweaks, AuthorGradeBadge, NotificationBell, ScrollToTop, BanginojaIcon, CoverPlaceholder, CookieConsent });
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29tcG9uZW50cy9TaGVsbC5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1QUNGNVx1RDFCNSBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjg6IE5hdiwgRm9vdGVyLCBUd2Vha3MsIEJyYW5kLCBBdXRob3JHcmFkZUJhZGdlLCBOb3RpZmljYXRpb25CZWxsLCBTY3JvbGxUb1RvcFxuXG4vLyA9PT0gXHVCQUE4XHVCMkVDIFx1QUMwMFx1QjREQyBcdUQ2QzUgKHYwMC4wNjcpID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRVNDIFx1RDBBNCArIFx1QzY3OFx1QkQ4MCBcdUQwNzRcdUI5QUQoYmFja2Ryb3ApICsgXHVCRTBDXHVCNzdDXHVDNkIwXHVDODAwIFx1QjRBNFx1Qjg1Q1x1QUMwMFx1QUUzMCBcdUMyREMgXHVCQUE4XHVCMkVDXHVDNzQ0IFx1QjJFQlx1QUUzMCBcdUM4MDRcdUM1RDAgZGlydHkgXHVDMEMxXHVEMERDXHVCQTc0IFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QzVEMFx1QUM4QyBjb25maXJtLlxuLy8gXHVDMEFDXHVDNkE5XHVCQzk1OlxuLy8gICBjb25zdCB7IG9uQmFja2Ryb3BDbGljayB9ID0gdXNlTW9kYWxHdWFyZCh7IG9wZW4sIGRpcnR5LCBvbkNsb3NlLCBvblNhdmVEcmFmdCB9KTtcbi8vICAgPGRpdiBvbkNsaWNrPXtvbkJhY2tkcm9wQ2xpY2t9Pi4uLjwvZGl2PlxuLy8gb25TYXZlRHJhZnQgXHVBQzAwIFx1Qzc4OFx1QUNFMCBkaXJ0eSBcdUJBNzQgcHJvbXB0IFx1MjAxNCBcdUM4MDBcdUM3QTUgLyBcdUJDODRcdUI5QUNcdUFFMzAgLyBcdUNERThcdUMxOEMuXG53aW5kb3cudXNlTW9kYWxHdWFyZCA9IGZ1bmN0aW9uIHVzZU1vZGFsR3VhcmQoeyBvcGVuLCBkaXJ0eSwgb25DbG9zZSwgb25TYXZlRHJhZnQsIGxhYmVsIH0pIHtcbiAgY29uc3QgcHJvbXB0TmFtZSA9IGxhYmVsIHx8ICdcdUM3OTFcdUMxMzEgXHVDOTExXHVDNzc4IFx1QjBCNFx1QzZBOSc7XG4gIC8vIHYwMC4xMjcgXHUyMDE0IGhhbmRsZUF0dGVtcHRDbG9zZSBcdUI5N0MgcmVmIFx1Qjg1QyBcdUM1NDhcdUM4MTVcdUQ2NTQuIFx1Qzc3NFx1QzgwNFx1QzVENCBkaXJ0eS9vbkNsb3NlL29uU2F2ZURyYWZ0IFx1QUMwMCBcdUJEODBcdUJBQThcbiAgLy8gcmUtcmVuZGVyIFx1QjlDOFx1QjJFNCBcdUMwQzggcmVmIFx1MjE5MiBoYW5kbGVBdHRlbXB0Q2xvc2UgXHVDMEM4IHJlZiBcdTIxOTIgdXNlRWZmZWN0IFx1Qzc1OCBkZXBzIFx1QkNDMFx1QUNCRCBcdTIxOTIgY2xlYW51cCBcdUMyRTRcdUQ1ODlcbiAgLy8gXHUyMTkyIGhpc3RvcnkuYmFjaygpIFx1RDYzOFx1Q0Q5QyBcdTIxOTIgcG9wc3RhdGUgXHVCQzFDXHVDMEREIFx1MjE5MiBtb2RhbCBcdUIyRUJcdUQ3OTguIChcdUJBQThcdUIyRUNcdUM3NzQgXHVCNUI0XHVCMkU0IFx1Qzk4OVx1QzJEQyBcdUMwQUNcdUI3N0NcdUM5QzBcdUIyOTQgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QkNGNFx1QUNFMClcbiAgLy8gcmVmIFx1RDMyOFx1RDEzNFx1QzczQ1x1Qjg1QyB1c2VFZmZlY3QgXHVCMjk0IFtvcGVuXSBcdUI5Q0MgXHVDNzU4XHVDODc0LCBoYW5kbGVBdHRlbXB0Q2xvc2UgXHVCMjk0IFx1RDU2RFx1QzBDMSBcdUNENUNcdUMyRTAgXHVDMEMxXHVEMERDIFx1QzBBQ1x1QzZBOS5cbiAgY29uc3Qgc3RhdGVSZWYgPSBSZWFjdC51c2VSZWYoeyBkaXJ0eSwgb25DbG9zZSwgb25TYXZlRHJhZnQsIHByb21wdE5hbWUgfSk7XG4gIHN0YXRlUmVmLmN1cnJlbnQgPSB7IGRpcnR5LCBvbkNsb3NlLCBvblNhdmVEcmFmdCwgcHJvbXB0TmFtZSB9O1xuXG4gIGNvbnN0IGhhbmRsZUF0dGVtcHRDbG9zZSA9IFJlYWN0LnVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCBzID0gc3RhdGVSZWYuY3VycmVudDtcbiAgICBpZiAoIXMuZGlydHkpIHsgcy5vbkNsb3NlPy4oKTsgcmV0dXJuOyB9XG4gICAgaWYgKHMub25TYXZlRHJhZnQpIHtcbiAgICAgIGNvbnN0IHllcyA9IHdpbmRvdy5jb25maXJtKGAke3MucHJvbXB0TmFtZX1cdUM3NzQoXHVBQzAwKSBcdUM4MDBcdUM3QTVcdUI0MThcdUM5QzAgXHVDNTRBXHVDNTU4XHVDMkI1XHVCMkM4XHVCMkU0Llxcblx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNSBcdUQ1NThcdUMyRENcdUFDQTBcdUM1QjRcdUM2OTQ/XFxuXFxuW1x1RDY1NVx1Qzc3OF0gPSBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgXHVENkM0IFx1QjJFQlx1QUUzMFxcbltcdUNERThcdUMxOENdID0gXHVBREY4XHVCMEU1IFx1QjJFQlx1QUUzMCAoXHVCQ0MwXHVBQ0JEIFx1QjBCNFx1QzZBOSBcdUJDODRcdUI5QkMpYCk7XG4gICAgICBpZiAoeWVzKSB7IHRyeSB7IHMub25TYXZlRHJhZnQoKTsgfSBjYXRjaCB7fSB9XG4gICAgICBzLm9uQ2xvc2U/LigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBvayA9IHdpbmRvdy5jb25maXJtKGAke3MucHJvbXB0TmFtZX1cdUM3NzQoXHVBQzAwKSBcdUM4MDBcdUM3QTVcdUI0MThcdUM5QzAgXHVDNTRBXHVDNTU4XHVDMkI1XHVCMkM4XHVCMkU0LiBcdUM4MTVcdUI5RDAgXHVCMkVCXHVDNzNDXHVDMkRDXHVBQ0EwXHVDNUI0XHVDNjk0P2ApO1xuICAgICAgaWYgKG9rKSBzLm9uQ2xvc2U/LigpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvcGVuKSByZXR1cm47XG4gICAgY29uc3Qgb25LZXkgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyB8fCBlLmtleSA9PT0gJ0VzYycpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBoYW5kbGVBdHRlbXB0Q2xvc2UoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgIGNvbnN0IHByZXZPdmVyZmxvdyA9IGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3c7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIGxldCBwdXNoZWQgPSBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgYmduak1vZGFsOiB0cnVlIH0sICcnKTtcbiAgICAgIHB1c2hlZCA9IHRydWU7XG4gICAgfSBjYXRjaCB7fVxuICAgIGNvbnN0IG9uUG9wID0gKCkgPT4geyBoYW5kbGVBdHRlbXB0Q2xvc2UoKTsgfTtcbiAgICBpZiAocHVzaGVkKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvblBvcCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IHByZXZPdmVyZmxvdztcbiAgICAgIGlmIChwdXNoZWQpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25Qb3ApO1xuICAgICAgICB0cnkgeyBpZiAod2luZG93Lmhpc3Rvcnkuc3RhdGU/LmJnbmpNb2RhbCkgd2luZG93Lmhpc3RvcnkuYmFjaygpOyB9IGNhdGNoIHt9XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW29wZW4sIGhhbmRsZUF0dGVtcHRDbG9zZV0pO1xuXG4gIGNvbnN0IG9uQmFja2Ryb3BDbGljayA9IFJlYWN0LnVzZUNhbGxiYWNrKChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQpIGhhbmRsZUF0dGVtcHRDbG9zZSgpO1xuICB9LCBbaGFuZGxlQXR0ZW1wdENsb3NlXSk7XG5cbiAgcmV0dXJuIHsgb25CYWNrZHJvcENsaWNrLCBoYW5kbGVBdHRlbXB0Q2xvc2UgfTtcbn07XG5cbi8vIFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUM2QjBcdUQ1NThcdUIyRTggJ1x1QjlFOCBcdUM3MDRcdUI4NUMnIFx1RDUwQ1x1Qjg1Q1x1RDMwNSBcdUJDODRcdUQyQkMgXHUyMDE0IFx1Qzc3Q1x1QzgxNSBcdUFDNzBcdUI5QUMgXHVDNzc0XHVDMEMxIFx1QzJBNFx1RDA2Q1x1Qjg2NFx1QjQxQyBcdUQ2QzQgXHVCMTc4XHVDRDlDXG5jb25zdCBTY3JvbGxUb1RvcCA9ICgpID0+IHtcbiAgY29uc3QgW3Zpc2libGUsIHNldFZpc2libGVdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBmaW5kU2Nyb2xsZXIgPSAoKSA9PiB7XG4gICAgLy8gXHVBRDAwXHVCOUFDXHVDNzkwIFx1RDM5OFx1Qzc3NFx1QzlDMFx1QjI5NCBcdUIwQjRcdUJEODAgXHVDRUU4XHVEMTRDXHVDNzc0XHVCMTA4XHVBQzAwIFx1QjUzMFx1Qjg1QyBcdUMyQTRcdUQwNkNcdUI4NjRcdUI0MThcdUJCQzBcdUI4NUMgXHVBREY4XHVDQUJEXHVCM0M0IFx1RDU2OFx1QUVEOCBcdUFDMTBcdUMyRENcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpPy5jbG9zZXN0KCdtYWluJykgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9O1xuICBjb25zdCBnZXRTY3JvbGxZID0gKCkgPT4ge1xuICAgIGNvbnN0IGFkbWluU2Nyb2xsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbYXJpYS1sYWJlbD1cIlx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUJBNTRcdUIyNzRcIl0gKyBkaXYnKTtcbiAgICBpZiAoYWRtaW5TY3JvbGxlcikge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KGFkbWluU2Nyb2xsZXIuc2Nyb2xsVG9wIHx8IDAsIHdpbmRvdy5zY3JvbGxZIHx8IDApO1xuICAgIH1cbiAgICByZXR1cm4gd2luZG93LnNjcm9sbFkgfHwgMDtcbiAgfTtcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblNjcm9sbCA9ICgpID0+IHNldFZpc2libGUoZ2V0U2Nyb2xsWSgpID4gMzIwKTtcbiAgICBvblNjcm9sbCgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvblNjcm9sbCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIGNvbnN0IGFkbWluU2Nyb2xsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbYXJpYS1sYWJlbD1cIlx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUJBNTRcdUIyNzRcIl0gKyBkaXYnKTtcbiAgICBpZiAoYWRtaW5TY3JvbGxlcikgYWRtaW5TY3JvbGxlci5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvblNjcm9sbCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgICAgaWYgKGFkbWluU2Nyb2xsZXIpIGFkbWluU2Nyb2xsZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICBjb25zdCBnb1RvcCA9ICgpID0+IHtcbiAgICBjb25zdCBhZG1pblNjcm9sbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2FyaWEtbGFiZWw9XCJcdUFEMDBcdUI5QUNcdUM3OTAgXHVCQTU0XHVCMjc0XCJdICsgZGl2Jyk7XG4gICAgaWYgKGFkbWluU2Nyb2xsZXIgJiYgYWRtaW5TY3JvbGxlci5zY3JvbGxUb3AgPiAwKSB7XG4gICAgICBhZG1pblNjcm9sbGVyLnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgfVxuICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICB9O1xuXG4gIGlmICghdmlzaWJsZSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBvbkNsaWNrPXtnb1RvcH1cbiAgICAgIGFyaWEtbGFiZWw9XCJcdUI5RTggXHVDNzA0XHVCODVDXCJcbiAgICAgIHRpdGxlPVwiXHVCOUU4IFx1QzcwNFx1Qjg1Q1wiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgcmlnaHQ6IDI0LCBib3R0b206IDI4LCB6SW5kZXg6IDYwLFxuICAgICAgICB3aWR0aDogNDgsIGhlaWdodDogNDgsXG4gICAgICAgIGJhY2tncm91bmQ6ICd2YXIoLS1iZy0yKScsIGNvbG9yOiAndmFyKC0tZ29sZCknLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tZ29sZC1kaW0pJyxcbiAgICAgICAgYm94U2hhZG93OiAnMCA4cHggMjRweCByZ2JhKDAsMCwwLDAuNDUpJyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2VyaWYpJyxcbiAgICAgICAgZm9udFNpemU6IDIyLFxuICAgICAgfX0+XG4gICAgICBcdTIxOTFcbiAgICA8L2J1dHRvbj5cbiAgKTtcbn07XG5cblxuLy8gXHVDNzkxXHVDMTMxXHVDNzkwIFx1QjRGMVx1QUUwOSBcdUJDMzBcdUM5QzAgXHUyMDE0IFx1QUM4Q1x1QzJEQ1x1QUUwMC9cdUIzMTNcdUFFMDAgXHVDNzkxXHVDMTMxXHVDNzkwIFx1QzYwNlx1QzVEMCBcdUM3NzhcdUI3N0NcdUM3NzhcdUM3M0NcdUI4NUMgXHVENDVDXHVDMkRDXG5jb25zdCBBdXRob3JHcmFkZUJhZGdlID0gKHsgYXV0aG9ySWQsIGF1dGhvciwgYXV0aG9yRW1haWwsIHNpemUgPSBcInNtXCIgfSkgPT4ge1xuICBjb25zdCBncmFkZSA9IHdpbmRvdy5CR05KX0FVVEhPUl9HUkFERT8uKHsgYXV0aG9ySWQsIGF1dGhvciwgYXV0aG9yRW1haWwgfSk7XG4gIGlmICghZ3JhZGUpIHJldHVybiBudWxsO1xuICBjb25zdCBzbWFsbCA9IHNpemUgPT09IFwic21cIjtcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgY2xhc3NOYW1lPVwibW9ub1wiXG4gICAgICB0aXRsZT17YCR7Z3JhZGUubGFiZWx9IFx1MDBCNyAke2dyYWRlLmRlc2MgfHwgJyd9YH1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBtYXJnaW5MZWZ0OiA2LFxuICAgICAgICBwYWRkaW5nOiBzbWFsbCA/ICcxcHggNnB4JyA6ICcycHggOHB4JyxcbiAgICAgICAgZm9udFNpemU6IHNtYWxsID8gOSA6IDEwLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4xNGVtJyxcbiAgICAgICAgY29sb3I6IGdyYWRlLmNvbG9yIHx8ICd2YXIoLS1nb2xkKScsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke2dyYWRlLmNvbG9yIHx8ICd2YXIoLS1nb2xkLWRpbSknfWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogMixcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgfX0+XG4gICAgICB7Z3JhZGUubGFiZWx9XG4gICAgPC9zcGFuPlxuICApO1xufTtcblxuLy8gXHVDNTRDXHVCOUJDIFx1QkNBOCBcdTIwMTQgXHVDNkIwXHVDMEMxXHVCMkU4IFx1QjBCNFx1QkU0NFx1QUM4Q1x1Qzc3NFx1QzE1OFx1QzVEMCBcdUIxNzhcdUNEOUNcbmNvbnN0IE5vdGlmaWNhdGlvbkJlbGwgPSAoeyB1c2VyLCBvblBpY2sgfSkgPT4ge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFt0aWNrLCBzZXRUaWNrXSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCByZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG5cbiAgLy8gXHVCMkU0XHVCOTc4IFx1RDBFRC9cdUMxMzhcdUMxNThcdUM1RDBcdUMxMUMgXHVDNTRDXHVCOUJDXHVDNzc0IFx1Q0Q5NFx1QUMwMFx1QjQxOFx1QkE3NCBzdG9yYWdlIFx1Qzc3NFx1QkNBNFx1RDJCOFx1Qjg1QyBcdUFDMzFcdUMyRTBcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblN0b3JhZ2UgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnYmdual9ub3RpZmljYXRpb25zJykgc2V0VGljaygodCkgPT4gdCArIDEpO1xuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3JhZ2UnLCBvblN0b3JhZ2UpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3RvcmFnZScsIG9uU3RvcmFnZSk7XG4gIH0sIFtdKTtcblxuICAvLyBcdUM2NzhcdUJEODAgXHVEMDc0XHVCOUFEXHVDNzNDXHVCODVDIFx1QjJFQlx1QUUzMFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuO1xuICAgIGNvbnN0IG9uRG9jID0gKGUpID0+IHtcbiAgICAgIGlmIChyZWYuY3VycmVudCAmJiAhcmVmLmN1cnJlbnQuY29udGFpbnMoZS50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKTtcbiAgICB9O1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jKTtcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2MpO1xuICB9LCBbb3Blbl0pO1xuXG4gIGlmICghdXNlcikgcmV0dXJuIG51bGw7XG4gIC8vIEJHTkpfQ09NTVVOSVRZIFx1QUMwMCBcdUJEODBcdUJEODQgXHVCODVDXHVCNERDXHVCNDFDIFx1QzJEQ1x1QzgxMFx1QzVEMCBcdUQ2MzhcdUNEOUNcdUIzRkNcdUIzQzQgXHVENjU0XHVCQTc0XHVDNzc0IFx1QUU2OFx1QzlDMFx1QzlDMCBcdUM1NEFcdUIzQzRcdUI4NUQgXHVCQUE4XHVCNEUwIFx1RDYzOFx1Q0Q5Q1x1QzVEMCBcdUM2MzVcdUMxNTRcdUIxMTAgXHVDQ0I0XHVDNzc0XHVCMkREICsgXHVBQzAwXHVCNERDXG4gIGNvbnN0IHJhd0xpc3QgPSAoKCkgPT4geyB0cnkgeyByZXR1cm4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5saXN0Tm90aWZpY2F0aW9ucz8uKHVzZXIuaWQpOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH0pKCk7XG4gIGNvbnN0IGxpc3QgPSBBcnJheS5pc0FycmF5KHJhd0xpc3QpID8gcmF3TGlzdCA6IFtdO1xuICBjb25zdCB1bnJlYWQgPSBsaXN0LmZpbHRlcigobikgPT4gbiAmJiAhbi5yZWFkKS5sZW5ndGg7XG5cbiAgY29uc3QgcGljayA9IChuKSA9PiB7XG4gICAgdHJ5IHsgd2luZG93LkJHTkpfQ09NTVVOSVRZPy5tYXJrTm90aWZpY2F0aW9uUmVhZD8uKHVzZXIuaWQsIG4uaWQpOyB9IGNhdGNoIHt9XG4gICAgc2V0T3BlbihmYWxzZSk7XG4gICAgaWYgKG9uUGljaykgb25QaWNrKG4pO1xuICAgIHNldFRpY2soKHQpID0+IHQgKyAxKTtcbiAgfTtcblxuICBjb25zdCBtYXJrQWxsID0gKCkgPT4ge1xuICAgIHRyeSB7IHdpbmRvdy5CR05KX0NPTU1VTklUWT8ubWFya0FsbE5vdGlmaWNhdGlvbnNSZWFkPy4odXNlci5pZCk7IH0gY2F0Y2gge31cbiAgICBzZXRUaWNrKCh0KSA9PiB0ICsgMSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHJlZj17cmVmfSBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9fT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICBhcmlhLWxhYmVsPXtgXHVDNTRDXHVCOUJDICR7dW5yZWFkID4gMCA/IGAke3VucmVhZH1cdUFDNzQgXHVDNTQ4IFx1Qzc3RFx1Qzc0Q2AgOiAnJ31gfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2KSA9PiAhdil9XG4gICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBwYWRkaW5nOiAnNnB4IDEwcHgnLCBtaW5XaWR0aDogMzYgfX0+XG4gICAgICAgIDxzdmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCJcbiAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjEuNlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnIH19PlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNiA4YTYgNiAwIDAgMSAxMiAwYzAgNyAzIDkgMyA5SDNzMy0yIDMtOVwiLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTEwLjMgMjFhMS45NCAxLjk0IDAgMCAwIDMuNCAwXCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAge3VucmVhZCA+IDAgJiYgKFxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogLTQsIHJpZ2h0OiAtNCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3ZhcigtLWdvbGQpJywgY29sb3I6ICd2YXIoLS1iZyknLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDk5OSwgZm9udFNpemU6IDksIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzFweCA1cHgnLCBsZXR0ZXJTcGFjaW5nOiAwLFxuICAgICAgICAgICAgICBtaW5XaWR0aDogMTQsIHRleHRBbGlnbjogJ2NlbnRlcicsIGxpbmVIZWlnaHQ6IDEuNCxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3VucmVhZCA+IDkgPyAnOSsnIDogdW5yZWFkfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gJiYgKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIlx1QzU0Q1x1QjlCQyBcdUJBQTlcdUI4NURcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnY2FsYygxMDAlICsgOHB4KScsIHJpZ2h0OiAwLFxuICAgICAgICAgICAgd2lkdGg6IDMyMCwgbWF4SGVpZ2h0OiA0MDAsIG92ZXJmbG93OiAnYXV0bycsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAndmFyKC0tYmctMiknLCBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnMCAxNnB4IDQwcHggcmdiYSgwLDAsMCwwLjUpJyxcbiAgICAgICAgICAgIHpJbmRleDogNTAsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCAxNHB4JywgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZ29sZFwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogJzAuMjJlbScgfX0+XHVDNTRDXHVCOUJDIFx1MDBCNyB7bGlzdC5sZW5ndGh9PC9zcGFuPlxuICAgICAgICAgICAge3VucmVhZCA+IDAgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXttYXJrQWxsfSBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgY29sb3I6ICd2YXIoLS1pbmstMiknIH19Plx1QkFBOFx1QjQ1MCBcdUM3N0RcdUM3NEM8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2xpc3QubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17eyBwYWRkaW5nOiAyNCwgdGV4dEFsaWduOiAnY2VudGVyJywgZm9udFNpemU6IDEzIH19PlxuICAgICAgICAgICAgICBcdUM1NDRcdUM5QzEgXHVCQzFCXHVDNzQwIFx1QzU0Q1x1QjlCQ1x1Qzc3NCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPHVsIHN0eWxlPXt7IGxpc3RTdHlsZTogJ25vbmUnLCBtYXJnaW46IDAsIHBhZGRpbmc6IDAgfX0+XG4gICAgICAgICAgICAgIHtsaXN0Lm1hcCgobikgPT4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e24uaWR9PlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gcGljayhuKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLCB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTJweCAxNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBuLnJlYWQgPyAndHJhbnNwYXJlbnQnIDogJ3JnYmEoMjQ1LDIxMyw3MiwwLjA2KScsXG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IDEyLCBjb2xvcjogJ3ZhcigtLWluayknLCBtYXJnaW5Cb3R0b206IDQsIGxpbmVIZWlnaHQ6IDEuNSB9fT5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCI+e24uZnJvbU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbVwiPiBcdTAwQjcge24ubWVzc2FnZSB8fCAnXHVDMEM4IFx1QzU0Q1x1QjlCQyd9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge24ucG9zdFRpdGxlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgbGluZUhlaWdodDogMS41LCBvdmVyZmxvdzogJ2hpZGRlbicsIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJywgd2hpdGVTcGFjZTogJ25vd3JhcCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBcdTI1Qjgge24ucG9zdFRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17eyBmb250U2l6ZTogMTAsIG1hcmdpblRvcDogNCwgbGV0dGVyU3BhY2luZzogJzAuMWVtJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7d2luZG93LkJHTkpfRk1ULmtzdERhdGVUaW1lKG4uY3JlYXRlZEF0KX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1QkUwQ1x1Qjc5Q1x1QjREQyBcdUI5QzhcdUQwNkMgXHUyMDE0IFx1QjE3OFx1Qjc4MCBcdUI3N0NcdUM2QjRcdUI0REMgXHVDMEFDXHVBQzAxXHVENjE1ICsgJ0InIFx1Q0VGN1x1QzU0NFx1QzZDMyArIFx1QkM0NVx1QUUzMCArIFx1QkNDNFx1QjRFNC5cbi8vIFBERiBcdUM2RDBcdUJDRjggXHVBRTMwXHVCQzE4XHVDNzNDXHVCODVDIFNWRyBcdUM3QUNcdUFENkNcdUMxMzEuIFx1QzhGQyBcdUMwQzlcdUMwQzFcdUM3NDAgXHVCRTBDXHVCNzlDXHVCNERDIFx1QjE3OFx1Qjc4MFx1QzBDOSAjRjVENTQ4LlxuY29uc3QgQmFuZ2lub2phSWNvbiA9ICh7IHNpemUgPSAyMiB9KSA9PiAoXG4gIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gdmlld0JveD1cIjAgMCA2NCA2NFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgIHsvKiBcdUI3N0NcdUM2QjRcdUI0REMgXHVDMEFDXHVBQzAxXHVENjE1IFx1QkMzMFx1QUNCRCAqL31cbiAgICA8cmVjdCB3aWR0aD1cIjY0XCIgaGVpZ2h0PVwiNjRcIiByeD1cIjlcIiByeT1cIjlcIiBmaWxsPVwiI0Y1RDU0OFwiLz5cbiAgICB7LyogJ0InIFx1Q0VGN1x1QzU0NFx1QzZDMyBcdTIwMTQgXHVCNDUwIFx1QUMxQ1x1Qzc1OCBcdUI0NjVcdUFERkMgXHVCQ0ZDXHVCOTY4XHVDNzc0IFx1Qzg4Q1x1Q0UyMSBcdUMxMzhcdUI4NUMgXHVBRTMwXHVCNDY1XHVDNUQwIFx1QkQ5OVx1Qzc0MCBcdUQ2MTVcdUQwREMuIGZpbGxSdWxlPWV2ZW5vZGQgXHVCODVDIFx1QzU0OFx1Q0FCRCBcdUJFNDggXHVBQ0Y1XHVBQzA0XHVDNzQ0IFx1Q0VGN1x1QzU0NFx1QzZDMy4gKi99XG4gICAgPHBhdGhcbiAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICBkPVwiTSA5IDggTCA5IDU2IEwgMzIgNTYgQyA0MiA1NiA0NyA1MSA0NyA0NC41IEMgNDcgMzkuNSA0NCAzNiAzOS41IDM1IEMgNDMgMzMuNSA0NS41IDMwLjUgNDUuNSAyNiBDIDQ1LjUgMTguNSA0MCAxNCAzMCAxNCBMIDkgMTQgWiBNIDE4IDE5IEwgMjggMTkgQyAzMyAxOSAzNiAyMSAzNiAyNSBDIDM2IDI5IDMzIDMxIDI4IDMxIEwgMTggMzEgWiBNIDE4IDM2IEwgMzAgMzYgQyAzNiAzNiAzOSAzOC41IDM5IDQzIEMgMzkgNDcuNSAzNiA1MCAzMCA1MCBMIDE4IDUwIFpcIlxuICAgICAgZmlsbD1cIiNGRkZGRkZcIi8+XG4gICAgey8qIFx1QkM0NVx1QUUzMCAoXHVCRTQ0XHVENTg5XHVBRTMwKSBcdTIwMTQgQiBcdUM3NTggXHVDMEMxXHVCMkU4IFx1QkU0OCBcdUFDRjVcdUFDMDRcdUM3NDQgXHVBQzAwXHVCODVDXHVDOUMwXHVCOTc0XHVCQTcwIFx1Qzg4Q1x1Q0UyMSBcdUM3MDRcdUM1RDBcdUMxMUMgXHVDNkIwXHVDRTIxIFx1QzU0NFx1Qjc5OFx1Qjg1QyAqL31cbiAgICA8cGF0aFxuICAgICAgZD1cIk0gMjYgMjIuNSBDIDI3IDIxLjUgMjggMjEuNSAyOC41IDIyLjUgTCAzMSAyNyBMIDM4IDI1IEMgMzguOCAyNC44IDM5LjQgMjUuMiAzOS41IDI2IEMgMzkuNiAyNi42IDM5LjMgMjcuMSAzOC44IDI3LjQgTCAzMi41IDMwLjcgTCAzMy41IDM2LjUgTCAzNiAzNy44IEMgMzYuNCAzOCAzNi41IDM4LjQgMzYuMyAzOC43IEMgMzYuMiAzOSAzNS45IDM5LjEgMzUuNiAzOSBMIDMxLjUgMzggTCAyOCAzOS41IEMgMjcuNyAzOS42IDI3LjMgMzkuNCAyNy4yIDM5IEMgMjcuMSAzOC43IDI3LjMgMzguNCAyNy42IDM4LjIgTCAzMCAzNyBMIDI4LjcgMzIgTCAyNCAzMy41IEMgMjMuNCAzMy43IDIyLjkgMzMuNCAyMi44IDMyLjggQyAyMi43IDMyLjMgMjMgMzEuOSAyMy41IDMxLjcgTCAyNy41IDMwLjIgTCAyNi4zIDI2IEwgMjUuNSAyNC41IEMgMjUuMiAyNCAyNS40IDIzLjMgMjYgMjMgWlwiXG4gICAgICBmaWxsPVwiI0Y1RDU0OFwiLz5cbiAgICB7LyogXHVCQ0M0IChzcGFya2xlKSBcdTIwMTQgNC1cdUM4MTAgXHVCMkU0XHVDNzc0XHVDNTQ0XHVCQUFDXHVCNERDIDUgXHVBQzFDLiBcdUM2QjBcdUNFMjEgXHVDMEMxXHVCMkU4XHVDNUQwXHVDMTFDIFx1QzZCMFx1Q0UyMSBcdUQ1NThcdUIyRThcdUM3M0NcdUI4NUMgXHVENzY5XHVDNUI0XHVDOUQwICovfVxuICAgIDxnIGZpbGw9XCIjRkZGRkZGXCI+XG4gICAgICA8cGF0aCBkPVwiTSA1MyAxNSBMIDU0LjUgMTggTCA1Ny41IDE5LjUgTCA1NC41IDIxIEwgNTMgMjQgTCA1MS41IDIxIEwgNDguNSAxOS41IEwgNTEuNSAxOCBaXCIvPlxuICAgICAgPHBhdGggZD1cIk0gNTggMjYgTCA1OSAyOCBMIDYxIDI5IEwgNTkgMzAgTCA1OCAzMiBMIDU3IDMwIEwgNTUgMjkgTCA1NyAyOCBaXCIvPlxuICAgICAgPHBhdGggZD1cIk0gNTAgMzMgTCA1MC43IDM0LjUgTCA1Mi4yIDM1IEwgNTAuNyAzNS41IEwgNTAgMzcgTCA0OS4zIDM1LjUgTCA0Ny44IDM1IEwgNDkuMyAzNC41IFpcIi8+XG4gICAgICA8cGF0aCBkPVwiTSA1NSA0MCBMIDU1LjUgNDEgTCA1Ni41IDQxLjUgTCA1NS41IDQyIEwgNTUgNDMgTCA1NC41IDQyIEwgNTMuNSA0MS41IEwgNTQuNSA0MSBaXCIvPlxuICAgICAgPHBhdGggZD1cIk0gNTkgMzYgTCA1OS40IDM3IEwgNjAuNCAzNy41IEwgNTkuNCAzOCBMIDU5IDM5IEwgNTguNiAzOCBMIDU3LjYgMzcuNSBMIDU4LjYgMzcgWlwiLz5cbiAgICA8L2c+XG4gIDwvc3ZnPlxuKTtcblxuY29uc3QgQnJhbmQgPSAoeyBvbkNsaWNrIH0pID0+IHtcbiAgY29uc3Qgc2MgPSB3aW5kb3cuQkdOSl9TSVRFX0NPTlRFTlQ/LmdldD8uKCkgfHwge307XG4gIGNvbnN0IGJyYW5kID0gc2MuYnJhbmQgfHwgeyBuYW1lOiBcIlx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFwiLCBzdWI6IFwiQkFOR0lOT0pBXCIgfTtcbiAgY29uc3QgbG9nbyA9IHNjLmJyYW5kaW5nPy5sb2dvRGF0YVVyaTtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICBjbGFzc05hbWU9XCJicmFuZFwiXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgYXJpYS1sYWJlbD17YCR7YnJhbmQubmFtZX0gXHVENjQ4XHVDNzNDXHVCODVDYH1cbiAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDonbm9uZScsIGJvcmRlcjonbm9uZScsIHBhZGRpbmc6MCwgY3Vyc29yOidwb2ludGVyJ319PlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYnJhbmQtbWFya1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICB7bG9nb1xuICAgICAgICAgID8gPGltZyBzcmM9e2xvZ299IGFsdD1cIlwiIHN0eWxlPXt7d2lkdGg6MjIsIGhlaWdodDoyMiwgb2JqZWN0Rml0Oidjb250YWluJywgZGlzcGxheTonYmxvY2snfX0vPlxuICAgICAgICAgIDogPEJhbmdpbm9qYUljb24gc2l6ZT17MjJ9Lz59XG4gICAgICA8L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJicmFuZC1uYW1lXCI+XG4gICAgICAgIHticmFuZC5uYW1lfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzdWJcIiBsYW5nPVwiZW5cIj57YnJhbmQuc3VifTwvc3Bhbj5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbiAgKTtcbn07XG5cbmNvbnN0IE5hdiA9ICh7IHJvdXRlLCBnbywgdXNlciwgb25Mb2dvdXQgfSkgPT4ge1xuICBjb25zdCBuYXZMID0gKHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fSkubmF2IHx8IHt9O1xuICBjb25zdCBbbW9iaWxlT3Blbiwgc2V0TW9iaWxlT3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIC8vIFx1Qjc3Q1x1QzZCMFx1RDJCOCBcdUJDQzBcdUFDQkQgXHVDMkRDIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUJBNTRcdUIyNzQgXHVDNzkwXHVCM0Q5IFx1QjJFQlx1RDc5OFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4geyBzZXRNb2JpbGVPcGVuKGZhbHNlKTsgfSwgW3JvdXRlXSk7XG4gIC8vIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUJBNTRcdUIyNzQgXHVDNUY0XHVCOUJDIFx1QzJEQzogRXNjYXBlIFx1QjJFQlx1QUUzMCArIGJvZHkgc2Nyb2xsIGxvY2sgKyB2aWV3cG9ydCBcdUQ2NTVcdUIzMDAgXHVDMkRDIFx1Qzc5MFx1QjNEOSBcdUIyRUJcdUQ3OThcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW1vYmlsZU9wZW4pIHJldHVybjtcbiAgICBjb25zdCBvbktleSA9IChlKSA9PiB7IGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHNldE1vYmlsZU9wZW4oZmFsc2UpOyB9O1xuICAgIGNvbnN0IG9uUmVzaXplID0gKCkgPT4geyBpZiAod2luZG93LmlubmVyV2lkdGggPiA5MDApIHNldE1vYmlsZU9wZW4oZmFsc2UpOyB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvblJlc2l6ZSk7XG4gICAgY29uc3QgcHJldiA9IGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3c7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5KTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvblJlc2l6ZSk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gcHJldjtcbiAgICB9O1xuICB9LCBbbW9iaWxlT3Blbl0pO1xuICAvLyBcdUIxODBcdUM3OTAgXHVCQTU0XHVBQzAwXHVCQTU0XHVCMjc0IFx1Qzc5MFx1QzJERCAoXHVDNzU4XHVDMkREXHVDOEZDOiBcdUJBMzlcdUFDRTAvXHVDNzkwXHVBQ0UwL1x1QzBBQ1x1QUNFMCkuIFwiXHVCMTgwXHVDNzkwXCIgXHVDNzkwXHVDQ0I0IFx1RDA3NFx1QjlBRCBcdUMyREMgXHVDQ0FCIFx1RDU2RFx1QkFBOVx1QzczQ1x1Qjg1QyBcdUM5QzRcdUM3ODUuXG4gIGNvbnN0IHBsYXlDaGlsZHJlbiA9IFtcbiAgICB7IGtleTogXCJlYXRcIiwgICBsYWJlbDogbmF2TC5lYXQgICB8fCBcIlx1QkEzOVx1QUNFMCBcdUIxODBcdUM3OTBcIiwgIGRlc2M6IFwiXHVDMkREIFx1OThERiBcdTIwMTQgXHVENTVDXHVDODE1XHVDMkREXHUwMEI3XHVENUE1XHVEMUEwXHVDNzRDXHVDMkREXHUwMEI3XHVDMkRDXHVDN0E1XCIgfSxcbiAgICB7IGtleTogXCJzbGVlcFwiLCBsYWJlbDogbmF2TC5zbGVlcCB8fCBcIlx1Qzc5MFx1QUNFMCBcdUIxODBcdUM3OTBcIiwgIGRlc2M6IFwiXHVDOEZDIFx1NEY0RiBcdTIwMTQgXHVENTVDXHVDNjI1XHUwMEI3XHVBQ0UwXHVEMEREXHUwMEI3XHVEMTVDXHVENTBDXHVDMkE0XHVEMTRDXHVDNzc0XCIgfSxcbiAgICB7IGtleTogXCJzaG9wXCIsICBsYWJlbDogbmF2TC5zaG9wICB8fCBcIlx1QzBBQ1x1QUNFMCBcdUIxODBcdUM3OTBcIiwgIGRlc2M6IFwiXHVDNzU4IFx1ODg2MyBcdTIwMTQgXHVDODA0XHVEMUI1XHVBQ0Y1XHVDNjA4XHUwMEI3XHVEMUEwXHVDMEIwXHVCQjNDXCIgfSxcbiAgXTtcbiAgY29uc3QgcGxheUtleXMgPSBwbGF5Q2hpbGRyZW4ubWFwKChwKSA9PiBwLmtleSk7XG5cbiAgLy8gdjAwLjE0NyBcdTIwMTQgJ1x1Q0M0NScgXHVCQTU0XHVCMjc0IFx1Q0Q5NFx1QUMwMC4gXHVDMEFDXHVDNkE5XHVDNzkwIFx1QzY5NFx1Q0NBRCAnXHVDMEMxXHVCMkU4XHVDNUQwIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNDNDVcdUM3NDQgXHVCQ0ZDIFx1QzIxOCBcdUM3ODhcdUIyOTQgXHVCQTU0XHVCMjc0Jy5cbiAgY29uc3QgaXRlbXMgPSBbXG4gICAgeyBrZXk6IFwiaG9tZVwiLCBsYWJlbDogbmF2TC5ob21lIHx8IFwiXHVENjQ4XCIgfSxcbiAgICB7IGtleTogXCJwbGF5XCIsIGxhYmVsOiBuYXZMLnBsYXkgfHwgXCJcdUIxODBcdUM3OTBcIiwgaXNNZWdhOiAncGxheScsIGRlZmF1bHRSb3V0ZTogJ2VhdCcgfSxcbiAgICB7IGtleTogXCJ0b3VyXCIsIGxhYmVsOiBuYXZMLnRvdXIgfHwgXCJcdUQyMkNcdUM1QjRcIiB9LFxuICAgIHsga2V5OiBcImxlY3R1cmVzXCIsIGxhYmVsOiBuYXZMLmxlY3R1cmVzIHx8IFwiXHVBQzE1XHVDNUYwXCIgfSxcbiAgICB7IGtleTogXCJjb2x1bW5cIiwgbGFiZWw6IG5hdkwuY29sdW1uIHx8IFwiXHVDRTdDXHVCN0ZDXCIgfSxcbiAgICB7IGtleTogXCJib29rXCIsIGxhYmVsOiBuYXZMLmJvb2sgfHwgXCJcdUNDNDVcIiB9LFxuICAgIHsga2V5OiBcImNvbW11bml0eVwiLCBsYWJlbDogbmF2TC5jb21tdW5pdHkgfHwgXCJcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjBcIiwgaXNNZWdhOiAnY29tbXVuaXR5JyB9LFxuICBdO1xuICAvLyBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVCQTU0XHVBQzAwXHVCQTU0XHVCMjc0OiBCR05KX1NUT1JFUy5jYXRlZ29yaWVzXHVDNzU4IGJvYXJkVHlwZT1jb21tdW5pdHkgKyBcdUMwQUNcdUM2QTlcdUM3OTAgXHVCNEYxXHVBRTA5IFx1QUMwMFx1QzJEQyBcdUNFNzRcdUQxNENcdUFDRTBcdUI5QUNcbiAgY29uc3QgdXNlckxldmVsID0gd2luZG93LkJHTkpfVVNFUl9MRVZFTCA/IHdpbmRvdy5CR05KX1VTRVJfTEVWRUwodXNlcikgOiAodXNlciA/IDEwIDogMCk7XG4gIGNvbnN0IGNvbW11bml0eUJvYXJkcyA9ICh3aW5kb3cuQkdOSl9TVE9SRVM/LmNhdGVnb3JpZXMgfHwgW10pXG4gICAgLmZpbHRlcigoYykgPT4gYy5ib2FyZFR5cGUgPT09ICdjb21tdW5pdHknICYmIHVzZXJMZXZlbCA+PSAoYy5taW5MZXZlbCA/PyAwKSk7XG5cbiAgY29uc3QgZ29Cb2FyZCA9IChib2FyZElkKSA9PiB7XG4gICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX2JvYXJkX2lkJywgYm9hcmRJZCk7IH0gY2F0Y2gge31cbiAgICBnbygnY29tbXVuaXR5Jyk7XG4gIH07XG5cbiAgLy8gXHVENjVDXHVDMTMxIFx1QzBDMVx1RDBEQyBcdUQzMTBcdUM4MTUgXHUyMDE0IFx1QkE1NFx1QUMwMCBcdUFERjhcdUI4RjlcdUM3NDAgXHVDNzkwXHVDMkREIFx1Qjc3Q1x1QzZCMFx1RDJCOFx1QjNDNCBcdUQ2NUNcdUMxMzFcdUM3M0NcdUI4NUMgXHVBQzA0XHVDOEZDXG4gIGNvbnN0IGlzQWN0aXZlID0gKGl0KSA9PiB7XG4gICAgaWYgKGl0LmlzTWVnYSA9PT0gJ3BsYXknKSByZXR1cm4gcGxheUtleXMuaW5jbHVkZXMocm91dGUpO1xuICAgIHJldHVybiByb3V0ZSA9PT0gaXQua2V5O1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPG5hdiBjbGFzc05hbWU9e2BuYXYgJHttb2JpbGVPcGVuID8gJ21vYmlsZS1vcGVuJyA6ICcnfWB9IGFyaWEtbGFiZWw9XCJcdUM4RkMgXHVCQTU0XHVCMjc0XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBuYXYtaW5uZXJcIj5cbiAgICAgICAgPEJyYW5kIG9uQ2xpY2s9eygpID0+IGdvKFwiaG9tZVwiKX0gLz5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm5hdi10b2dnbGVcIlxuICAgICAgICAgIGFyaWEtbGFiZWw9e21vYmlsZU9wZW4gPyBcIlx1QkE1NFx1QjI3NCBcdUIyRUJcdUFFMzBcIiA6IFwiXHVCQTU0XHVCMjc0IFx1QzVGNFx1QUUzMFwifVxuICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e21vYmlsZU9wZW59XG4gICAgICAgICAgYXJpYS1jb250cm9scz1cInByaW1hcnktbmF2LW1lbnVcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE1vYmlsZU9wZW4oKHYpID0+ICF2KX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmF2LXRvZ2dsZS1iYXJzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPHVsIGlkPVwicHJpbWFyeS1uYXYtbWVudVwiIGNsYXNzTmFtZT1cIm5hdi1tZW51XCIgcm9sZT1cImxpc3RcIiBzdHlsZT17e2xpc3RTdHlsZTonbm9uZScsIG1hcmdpbjowLCBwYWRkaW5nOjB9fT5cbiAgICAgICAgICB7aXRlbXMubWFwKGl0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc01lZ2EgPSBpdC5pc01lZ2EgPT09ICdwbGF5JyB8fCAoaXQuaXNNZWdhID09PSAnY29tbXVuaXR5JyAmJiBjb21tdW5pdHlCb2FyZHMubGVuZ3RoID4gMCk7XG4gICAgICAgICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4gZ28oaXQuZGVmYXVsdFJvdXRlIHx8IGl0LmtleSk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8bGkga2V5PXtpdC5rZXl9IHN0eWxlPXt7cG9zaXRpb246J3JlbGF0aXZlJ319IGNsYXNzTmFtZT17aGFzTWVnYSA/ICduYXYtaGFzLW1lZ2EnIDogJyd9PlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgbmF2LWxpbmsgJHtpc0FjdGl2ZShpdCkgPyBcImFjdGl2ZVwiIDogXCJcIn1gfVxuICAgICAgICAgICAgICAgICAgYXJpYS1jdXJyZW50PXtpc0FjdGl2ZShpdCkgPyBcInBhZ2VcIiA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9e2hhc01lZ2EgPyAnbWVudScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfT57aXQubGFiZWx9e2hhc01lZ2EgPyAnIFx1MjVCRScgOiAnJ308L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgIHtpdC5pc01lZ2EgPT09ICdwbGF5JyAmJiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1tZWdhXCIgcm9sZT1cIm1lbnVcIiBhcmlhLWxhYmVsPVwiXHVCMTgwXHVDNzkwIFx1MjAxNCBcdUM3NThcdUMyRERcdUM4RkMgXHVDRTc0XHVEMTRDXHVBQ0UwXHVCOUFDXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6JzEwMCUnLCBsZWZ0Oic1MCUnLCB0cmFuc2Zvcm06J3RyYW5zbGF0ZVgoLTUwJSknLFxuICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOjI4MCwgcGFkZGluZzonMTBweCAwJyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OicwIDE2cHggNDBweCByZ2JhKDE1LDIzLDQyLDAuMTApJyxcbiAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OidoaWRkZW4nLCBvcGFjaXR5OjAsIHRyYW5zaXRpb246J29wYWNpdHkgLjEycyBlYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6NTAsXG4gICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjksIGxldHRlclNwYWNpbmc6JzAuMjJlbScsIHBhZGRpbmc6JzZweCAxNnB4IDhweCd9fT5cdUM3NThcdUMyRERcdUM4RkMgXHU4ODYzXHU5OERGXHU0RjRGPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBzdHlsZT17e2xpc3RTdHlsZTonbm9uZScsIG1hcmdpbjowLCBwYWRkaW5nOjB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7cGxheUNoaWxkcmVuLm1hcCgocCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17cC5rZXl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvKHAua2V5KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonYmxvY2snLCB3aWR0aDonMTAwJScsIHRleHRBbGlnbjonbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOicxMHB4IDE2cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDondHJhbnNwYXJlbnQnLCBjb2xvcjondmFyKC0taW5rLTIpJywgYm9yZGVyOidub25lJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KGUpID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAndmFyKC0tYmctMiknOyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KGUpID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnOyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NTAwfX0+e3AubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4wNWVtJywgbWFyZ2luVG9wOjJ9fT57cC5kZXNjfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgey8qIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUM4MDRcdUM2QTk6IFx1QjE4MFx1Qzc5MCBcdUJBNTRcdUFDMDAgXHVDNzkwXHVDMkREXHVCNEU0XHVDNzQ0IFx1Qzc3OFx1Qjc3Q1x1Qzc3OCBcdUQzQkNcdUNFNjhcdUM3M0NcdUI4NUMgXHVCMTc4XHVDRDlDICovfVxuICAgICAgICAgICAgICAgIHtpdC5pc01lZ2EgPT09ICdwbGF5JyAmJiAoXG4gICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1zdWJtZW51XCIgcm9sZT1cImxpc3RcIiBhcmlhLWxhYmVsPVwiXHVCMTgwXHVDNzkwIFx1RDU1OFx1QzcwNFwiIHN0eWxlPXt7bGlzdFN0eWxlOidub25lJywgbWFyZ2luOjAsIHBhZGRpbmc6MH19PlxuICAgICAgICAgICAgICAgICAgICB7cGxheUNoaWxkcmVuLm1hcCgocCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e3Aua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YG5hdi1saW5rIG5hdi1zdWItbGluayAke3JvdXRlID09PSBwLmtleSA/ICdhY3RpdmUnIDogJyd9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1jdXJyZW50PXtyb3V0ZSA9PT0gcC5rZXkgPyAncGFnZScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvKHAua2V5KX0+e3AubGFiZWx9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAge2l0LmlzTWVnYSA9PT0gJ2NvbW11bml0eScgJiYgY29tbXVuaXR5Qm9hcmRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXYtbWVnYVwiIHJvbGU9XCJtZW51XCIgYXJpYS1sYWJlbD1cIlx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUJBQTlcdUI4NURcIlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDonMTAwJScsIGxlZnQ6JzUwJScsIHRyYW5zZm9ybTondHJhbnNsYXRlWCgtNTAlKScsXG4gICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6MjIwLCBwYWRkaW5nOicxMHB4IDAnLFxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6JzAgMTZweCA0MHB4IHJnYmEoMTUsMjMsNDIsMC4xMCknLFxuICAgICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6J2hpZGRlbicsIG9wYWNpdHk6MCwgdHJhbnNpdGlvbjonb3BhY2l0eSAuMTJzIGVhc2UnLFxuICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDo1MCxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6OSwgbGV0dGVyU3BhY2luZzonMC4yMmVtJywgcGFkZGluZzonNnB4IDE2cHggOHB4J319PkJPQVJEUzwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8dWwgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBtYXJnaW46MCwgcGFkZGluZzowfX0+XG4gICAgICAgICAgICAgICAgICAgICAge2NvbW11bml0eUJvYXJkcy5tYXAoKGIpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2IuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvQm9hcmQoYi5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2Jsb2NrJywgd2lkdGg6JzEwMCUnLCB0ZXh0QWxpZ246J2xlZnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzonOHB4IDE2cHgnLCBmb250U2l6ZToxMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3RyYW5zcGFyZW50JywgY29sb3I6J3ZhcigtLWluay0yKScsIGJvcmRlcjonbm9uZScsIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhlKSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3ZhcigtLWJnLTIpJzsgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhlKSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3RyYW5zcGFyZW50JzsgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2IubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgPGxpIHN0eWxlPXt7Ym9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknLCBtYXJnaW5Ub3A6NiwgcGFkZGluZ1RvcDo2fX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnbygnY29tbXVuaXR5Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonYmxvY2snLCB3aWR0aDonMTAwJScsIHRleHRBbGlnbjonbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzonOHB4IDE2cHgnLCBmb250U2l6ZToxMiwgbGV0dGVyU3BhY2luZzonMC4xOGVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid0cmFuc3BhcmVudCcsIGNvbG9yOid2YXIoLS1zZWNvbmRhcnkpJywgYm9yZGVyOidub25lJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHVDODA0XHVDQ0I0IFx1QkNGNFx1QUUzMCBcdTIxOTI8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgICAgey8qIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUM4MDRcdUM2QTk6IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM1NjFcdUMxNThcdUM3NDQgXHVCQTU0XHVCMjc0IFx1QjBCNFx1QkQ4MFx1QzVEMCBcdUIxNzhcdUNEOUMuIFx1QjM3MFx1QzJBNFx1RDA2Q1x1RDBEMVx1QzVEMFx1QzEyMCAubmF2LW1vYmlsZS1vbmx5IENTUyBcdUI4NUMgXHVDMjI4XHVBRTQwLiAqL31cbiAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1vbmx5IG5hdi1tb2JpbGUtZGl2aWRlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiLz5cbiAgICAgICAgICB7dXNlciA/IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtbW9iaWxlLW9ubHlcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXYtbGlua1wiIG9uQ2xpY2s9eygpID0+IGdvKFwibXlwYWdlXCIpfT5cdUI5QzhcdUM3NzRcdUQzOThcdUM3NzRcdUM5QzA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAge3VzZXIuaXNBZG1pbiAmJiAoXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1tb2JpbGUtb25seVwiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBvbkNsaWNrPXsoKSA9PiBnbyhcImFkbWluXCIpfT5cdUFEMDBcdUI5QUM8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1vbmx5XCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBvbkNsaWNrPXtvbkxvZ291dH0+XHVCODVDXHVBREY4XHVDNTQ0XHVDNkMzPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1tb2JpbGUtb25seVwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgb25DbGljaz17KCkgPT4gZ28oXCJsb2dpblwiKX0+XHVCODVDXHVBREY4XHVDNzc4PC9idXR0b24+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtbW9iaWxlLW9ubHlcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXYtbGlua1wiIG9uQ2xpY2s9eygpID0+IGdvKFwic2lnbnVwXCIpfT5cdUQ2OENcdUM2RDBcdUFDMDBcdUM3ODU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvdWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2LWFjdGlvbnNcIj5cbiAgICAgICAgICB7dXNlciA/IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm9cIiBhcmlhLWxhYmVsPXtgXHVCODVDXHVBREY4XHVDNzc4OiAke3VzZXIubmFtZX1gfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTEsIGxldHRlclNwYWNpbmc6JzAuMTVlbScsIGNvbG9yOid2YXIoLS1pbmstMiknfX0+e3VzZXIubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDxOb3RpZmljYXRpb25CZWxsIHVzZXI9e3VzZXJ9IG9uUGljaz17KG4pID0+IHtcbiAgICAgICAgICAgICAgICAvLyBcdUM1NENcdUI5QkMgXHVEMEMwXHVDNzg1XHVCQ0M0IFx1Qjc3Q1x1QzZCMFx1RDMwNSBcdTIwMTQgXHVBQzE1XHVDNUYwL1x1RDIyQ1x1QzVCNC9cdUM4RkNcdUJCMzgvXHVCMzEzXHVBRTAwXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGlmIChuLnR5cGUgPT09ICdjb21tZW50JyAmJiBuLnBvc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcsIFN0cmluZyhuLnBvc3RJZCkpO1xuICAgICAgICAgICAgICAgICAgICBnbygnY29tbXVuaXR5Jyk7IHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChuLnR5cGUgPT09ICdsZWN0dXJlX2NvbmZpcm1lZCcgfHwgbi50eXBlID09PSAnbGVjdHVyZV9wcm9tb3RlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4ubGVjdHVyZUlkKSBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfbGVjdHVyZV9pZCcsIFN0cmluZyhuLmxlY3R1cmVJZCkpO1xuICAgICAgICAgICAgICAgICAgICBnbygnbGVjdHVyZXMnKTsgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKG4udHlwZSA9PT0gJ3RvdXJfY29uZmlybWVkJyB8fCBuLnR5cGUgPT09ICd0b3VyX3Byb21vdGVkJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobi50b3VySWQpIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2JnbmpfcGVuZGluZ190b3VyX2lkJywgU3RyaW5nKG4udG91cklkKSk7XG4gICAgICAgICAgICAgICAgICAgIGdvKCd0b3VyJyk7IHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChTdHJpbmcobi50eXBlIHx8ICcnKS5zdGFydHNXaXRoKCdvcmRlcl8nKSkge1xuICAgICAgICAgICAgICAgICAgICBnbygnbXlwYWdlJyk7IHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIC8vIFx1RDNGNFx1QkMzMSBcdTIwMTQgcG9zdElkXHVBQzAwIFx1Qzc4OFx1QzczQ1x1QkE3NCBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjBcbiAgICAgICAgICAgICAgICAgIGlmIChuLnBvc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcsIFN0cmluZyhuLnBvc3RJZCkpO1xuICAgICAgICAgICAgICAgICAgICBnbygnY29tbXVuaXR5Jyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgICAgICAgICB9fS8+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IGdvKFwibXlwYWdlXCIpfT5cdUI5QzhcdUM3NzRcdUQzOThcdUM3NzRcdUM5QzA8L2J1dHRvbj5cbiAgICAgICAgICAgICAge3VzZXIuaXNBZG1pbiAmJiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gZ28oXCJhZG1pblwiKX0+XHVBRDAwXHVCOUFDPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9e29uTG9nb3V0fT5cdUI4NUNcdUFERjhcdUM1NDRcdUM2QzM8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3QgbmF2LWxpbmtcIiBvbkNsaWNrPXsoKSA9PiBnbyhcImxvZ2luXCIpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTIsIGxldHRlclNwYWNpbmc6JzAuMWVtJywgY29sb3I6J3ZhcigtLWluay0yKSd9fT5cdUI4NUNcdUFERjhcdUM3Nzg8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gZ28oXCJzaWdudXBcIil9Plx1RDY4Q1x1QzZEMFx1QUMwMFx1Qzc4NTwvYnV0dG9uPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25hdj5cbiAgKTtcbn07XG5cbmNvbnN0IEZvb3RlciA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3Qgc2MgPSAod2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9KTtcbiAgY29uc3QgY29udGFjdCA9IHNjLmNvbnRhY3QgfHwge307XG4gIGNvbnN0IGZvb3RlciA9IHNjLmZvb3RlciB8fCB7fTtcbiAgY29uc3QgZlN0eWxlID0gKHdpbmRvdy5CR05KX0ZPT1RFUl9TVFlMRT8uKCkgfHwgd2luZG93LkJHTkpfRk9PVEVSX1NUWUxFX0RFRkFVTFQpO1xuICAvLyB2MDAuMTQ0IFx1MjAxNCBcdUM4MDRcdUQ2NTRcdUJDODhcdUQ2MzggXHVDODFDXHVBQzcwICsgXHVDMEFDXHVDNUM1XHVDNzkwIFx1QzgxNVx1QkNGNCAoXHVENjhDXHVDMEFDXHVCQTg1IC8gXHVCMzAwXHVENDVDXHVDNzkwIC8gXHVDMEFDXHVDNUM1XHVDNzkwXHVCNEYxXHVCODVEXHVCQzg4XHVENjM4IC8gXHVCQzk1XHVDNzc4XHVCNEYxXHVCODVEXHVCQzg4XHVENjM4IC8gXHVBQzFDXHVDNUM1XHVDNzdDKSBcdUIxNzhcdUNEOUMuXG4gIGNvbnN0IGVtYWlsID0gY29udGFjdC5lbWFpbCB8fCBcImNvbnRhY3RAYmduai5uZXRcIjtcbiAgY29uc3QgYWRkcmVzcyA9IGNvbnRhY3QuYWRkcmVzcyB8fCBcIlx1QzExQ1x1QzZCOFx1RDJCOVx1QkNDNFx1QzJEQyBcdUMxMUNcdUNEMDhcdUFENkMgXHVDMTFDXHVDRDA4XHVCMzAwXHVCODVDNzNcdUFFMzggNDAsIDdcdUNFMzUgMTNcdUQ2MzggKFx1QzExQ1x1Q0QwOFx1QjNEOSwgXHVBQzE1XHVCMEE4XHVDNjI0XHVENTNDXHVDMkE0XHVEMTU0KVwiO1xuICBjb25zdCBjb21wYW55TmFtZSA9IGNvbnRhY3QuY29tcGFueU5hbWUgfHwgXCJcdUM4RkNcdUMyRERcdUQ2OENcdUMwQUMgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXCI7XG4gIGNvbnN0IGNlbyA9IGNvbnRhY3QuY2VvIHx8IFwiXCI7XG4gIGNvbnN0IGJpelJlZ05vID0gY29udGFjdC5iaXpSZWdObyB8fCBcIlwiO1xuICBjb25zdCBjb3JwUmVnTm8gPSBjb250YWN0LmNvcnBSZWdObyB8fCBcIlwiO1xuICBjb25zdCBmb3VuZGVkID0gY29udGFjdC5mb3VuZGVkIHx8IFwiXCI7XG4gIGNvbnN0IGhlYWRpbmdTdHlsZSA9IHtcbiAgICBmb250U2l6ZTogZlN0eWxlLmhlYWRpbmcuZm9udFNpemUsXG4gICAgZm9udFdlaWdodDogZlN0eWxlLmhlYWRpbmcuZm9udFdlaWdodCxcbiAgICBsZXR0ZXJTcGFjaW5nOiBgJHtmU3R5bGUuaGVhZGluZy5sZXR0ZXJTcGFjaW5nfWVtYCxcbiAgICBjb2xvcjogYHZhcigke2ZTdHlsZS5oZWFkaW5nLmNvbG9yfSlgLFxuICB9O1xuICByZXR1cm4gKFxuICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiZm9vdGVyXCIgYXJpYS1sYWJlbD1cIlx1QzBBQ1x1Qzc3NFx1RDJCOCBcdUM4MTVcdUJDRjQgXHVCQzBGIFx1RDQ3OFx1RDEzMFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItZ3JpZFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8QnJhbmQgb25DbGljaz17KCkgPT4gZ28oXCJob21lXCIpfS8+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW0gYmduai1tdWx0aWxpbmVcIiBzdHlsZT17e1xuICAgICAgICAgICAgICBtYXJnaW5Ub3A6MjAsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBmU3R5bGUuZGVzY3JpcHRpb24uZm9udFNpemUsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGZTdHlsZS5kZXNjcmlwdGlvbi5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiBmU3R5bGUuZGVzY3JpcHRpb24ubGluZUhlaWdodCxcbiAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtmU3R5bGUuZGVzY3JpcHRpb24uY29sb3J9KWAsXG4gICAgICAgICAgICAgIG1heFdpZHRoOiBmU3R5bGUuZGVzY3JpcHRpb24ubWF4V2lkdGgsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2Zvb3Rlci5kZXNjcmlwdGlvbiB8fCBcIlx1QkM0NVx1QUUzMFx1RDBDMFx1QUNFMCBcdUIxNzhcdUM3OTAuIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1QjI5NCBcdUQ1NUNcdUFENkRcdUM3NTggXHVDNUVEXHVDMEFDXHUwMEI3XHVCQjM4XHVENjU0XHUwMEI3XHVDNzkwXHVDNUYwXHVDNzQ0IFx1QzlDMVx1QzgxMSBcdUFDNzdcdUFDRTAgXHVCMjkwXHVCMDdDXHVCQTcwIFx1QjA5OFx1QjIwNFx1QjI5NCBcdUM1RUNcdUQ1ODkgXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwXHVDNzg1XHVCMkM4XHVCMkU0LiBcdUFEODFcdUFEOTAgXHVCMkY1XHVDMEFDXHVCRDgwXHVEMTMwIFx1QzlDMFx1QzVFRCBcdUM1RUNcdUQ1ODlcdUFFNENcdUM5QzAsIFx1RDU2OFx1QUVEOCBcdUI5Q0NcdUI0RTRcdUM1QjRcdUFDMDBcdUIyOTQgXHVDNUVDXHVENTg5LlwifVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxuYXYgYXJpYS1sYWJlbD1cIlx1Q0Y1OFx1RDE1MFx1Q0UyMCBcdUJDMTRcdUI4NUNcdUFDMDBcdUFFMzBcIj5cbiAgICAgICAgICAgIDxoNCBpZD1cImZ0LWNvbnRlbnRcIiBzdHlsZT17aGVhZGluZ1N0eWxlfT57Zm9vdGVyLmhlYWRpbmdDb250ZW50IHx8IFwiXHVDRjU4XHVEMTUwXHVDRTIwXCJ9PC9oND5cbiAgICAgICAgICAgIDx1bCBhcmlhLWxhYmVsbGVkYnk9XCJmdC1jb250ZW50XCI+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcImNvbHVtblwiKX0+XHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0U3Q1x1QjdGQzwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcInRvdXJcIil9Plx1RDIyQ1x1QzVCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QTg8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgICB7LyogdjAwLjE0NyBcdTIwMTQgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QzY5NFx1Q0NBRCAnXHVENTU4XHVCMkU4XHVDNUQwIFx1QzY1NVx1Qzc1OFx1QUUzOFx1Qzc0MCBcdUMwQURcdUM4MUMnLiBcdUNDNDVcdUM3NDAgXHVDMEMxXHVCMkU4IG5hdiBcdUM3NTggJ1x1Q0M0NScgXHVCQTU0XHVCMjc0XHVDNUQwXHVDMTFDIFx1QzlDNFx1Qzc4NS4gKi99XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcImNvbW11bml0eVwiKX0+XHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwPC9idXR0b24+PC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgPG5hdiBhcmlhLWxhYmVsPVwiXHVDODE1XHVCQ0Y0IFx1QkMxNFx1Qjg1Q1x1QUMwMFx1QUUzMFwiPlxuICAgICAgICAgICAgPGg0IGlkPVwiZnQtaW5mb1wiIHN0eWxlPXtoZWFkaW5nU3R5bGV9Pntmb290ZXIuaGVhZGluZ0luZm8gfHwgXCJcdUM4MTVcdUJDRjRcIn08L2g0PlxuICAgICAgICAgICAgPHVsIGFyaWEtbGFiZWxsZWRieT1cImZ0LWluZm9cIj5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwiaG9tZVwiKX0+XHVBQzE1XHVDNUYwIFx1Qzc3Q1x1QzgxNTwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcImNvbW11bml0eVwiKX0+XHVBQ0Y1XHVDOUMwXHVDMEFDXHVENTZEPC9idXR0b24+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwiZmFxXCIpfT5cdUM3OTBcdUM4RkMgXHVCQjNCXHVCMjk0IFx1QzlDOFx1QkIzODwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcInRlcm1zXCIpfT5cdUM3NzRcdUM2QTlcdUM1N0RcdUFEMDA8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJwcml2YWN5XCIpfT5cdUFDMUNcdUM3NzhcdUM4MTVcdUJDRjQgXHVDQzk4XHVCOUFDXHVCQzI5XHVDRTY4PC9idXR0b24+PC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgPGFkZHJlc3Mgc3R5bGU9e3tmb250U3R5bGU6J25vcm1hbCd9fT5cbiAgICAgICAgICAgIDxoNCBpZD1cImZ0LWNvbnRhY3RcIiBzdHlsZT17aGVhZGluZ1N0eWxlfT57Zm9vdGVyLmhlYWRpbmdDb250YWN0IHx8IFwiXHVDNUYwXHVCNzdEXCJ9PC9oND5cbiAgICAgICAgICAgIDx1bCBhcmlhLWxhYmVsbGVkYnk9XCJmdC1jb250YWN0XCI+XG4gICAgICAgICAgICAgIHtlbWFpbCAmJiA8bGk+PGEgaHJlZj17YG1haWx0bzoke2VtYWlsfWB9PntlbWFpbH08L2E+PC9saT59XG4gICAgICAgICAgICAgIHthZGRyZXNzICYmIDxsaT48c3Bhbj57YWRkcmVzc308L3NwYW4+PC9saT59XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvYWRkcmVzcz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsvKiB2MDAuMTQ0IFx1MjAxNCBcdUMwQUNcdUM1QzVcdUM3OTAgXHVDODE1XHVCQ0Y0IFx1QkUxNFx1Qjg1RCAoXHVDNzc0XHVDNkE5XHVDNTdEXHVBRDAwICsgXHVDMEFDXHVDNUM1XHVDNzkwXHVCNEYxXHVCODVEXHVDOTlEIFx1QkQ4MFx1RDU2OSkuIFx1RDU1Q1x1QUQ2RCBcdUM2RjlcdUMwQUNcdUM3NzRcdUQyQjggXHVENDVDXHVDOTAwIFx1RDQ3OFx1RDEzMCBcdUQzMjhcdUQxMzQuICovfVxuICAgICAgICB7KGNvbXBhbnlOYW1lIHx8IGJpelJlZ05vIHx8IGNlbykgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyLWJpelwiIHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW5Ub3A6MjQsIHBhZGRpbmdUb3A6MTYsIGJvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLFxuICAgICAgICAgICAgZm9udFNpemU6MTEsIGxpbmVIZWlnaHQ6MS44NSwgY29sb3I6J3ZhcigtLWluay0zKScsXG4gICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJywgbGV0dGVyU3BhY2luZzonMC4wNGVtJyxcbiAgICAgICAgICAgIGRpc3BsYXk6J2ZsZXgnLCBnYXA6JzJweCAxOHB4JywgZmxleFdyYXA6J3dyYXAnLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAge2NvbXBhbnlOYW1lICYmIDxzcGFuPjxzdHJvbmcgc3R5bGU9e3tjb2xvcjondmFyKC0taW5rLTIpJ319Pntjb21wYW55TmFtZX08L3N0cm9uZz48L3NwYW4+fVxuICAgICAgICAgICAge2NlbyAmJiA8c3Bhbj5cdUIzMDBcdUQ0NUNcdUM3OTAge2Nlb308L3NwYW4+fVxuICAgICAgICAgICAge2JpelJlZ05vICYmIDxzcGFuPlx1QzBBQ1x1QzVDNVx1Qzc5MFx1QjRGMVx1Qjg1RFx1QkM4OFx1RDYzOCB7Yml6UmVnTm99PC9zcGFuPn1cbiAgICAgICAgICAgIHtjb3JwUmVnTm8gJiYgPHNwYW4+XHVCQzk1XHVDNzc4XHVCNEYxXHVCODVEXHVCQzg4XHVENjM4IHtjb3JwUmVnTm99PC9zcGFuPn1cbiAgICAgICAgICAgIHtmb3VuZGVkICYmIDxzcGFuPlx1QzEyNFx1QjlCRCB7Zm91bmRlZH08L3NwYW4+fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvb3Rlci1ib3R0b21cIiBzdHlsZT17e21hcmdpblRvcDoyNH19PlxuICAgICAgICAgIDxzcGFuPntmb290ZXIuY29weXJpZ2h0IHx8IFwiXHUwMEE5IDIwMjYgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIEJBTkdJTk9KQSBcdTIwMTQgQUxMIFJJR0hUUyBSRVNFUlZFRFwifTwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4xNGVtJ319PlxuICAgICAgICAgICAgdnt3aW5kb3cuQkdOSl9WRVJTSU9OPy52ZXJzaW9uIHx8ICcwLjAuMCd9IFx1MDBCNyB7d2luZG93LkJHTkpfVkVSU0lPTj8uYnVpbGQgfHwgJ1x1MjAxNCd9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxUaGVtZVRvZ2dsZS8+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRTaXplOiBmU3R5bGUuc2lnbmF0dXJlLmZvbnRTaXplLFxuICAgICAgICAgICAgZm9udFdlaWdodDogZlN0eWxlLnNpZ25hdHVyZS5mb250V2VpZ2h0LFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogYCR7ZlN0eWxlLnNpZ25hdHVyZS5sZXR0ZXJTcGFjaW5nfWVtYCxcbiAgICAgICAgICAgIGNvbG9yOiBgdmFyKCR7ZlN0eWxlLnNpZ25hdHVyZS5jb2xvcn0pYCxcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06IGZTdHlsZS5zaWduYXR1cmUudGV4dFRyYW5zZm9ybSB8fCAndXBwZXJjYXNlJyxcbiAgICAgICAgICB9fT57Zm9vdGVyLnNpZ25hdHVyZSB8fCBcIlx1QkM0NVx1QUUzMFx1RDBDMFx1QUNFMCBcdUIxNzhcdUM3OTAgXHUwMEI3IERFU0lHTkVEIElOIFNFT1VMXCJ9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZm9vdGVyPlxuICApO1xufTtcblxuLy8gXHVEMTRDXHVCOUM4IFx1RDFBMFx1QUUwMCBcdTIwMTQgbGlnaHQgXHUyMTkyIGRhcmsgXHUyMTkyIGF1dG8gXHUyMTkyIGxpZ2h0IFx1QzIxQ1x1RDY1OC4gQkdOSl9USEVNRSBcdUQ1RUNcdUQzN0NcdUM2NDAgXHVDOURELlxuY29uc3QgVGhlbWVUb2dnbGUgPSAoKSA9PiB7XG4gIGNvbnN0IFttb2RlLCBzZXRNb2RlXSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+ICh3aW5kb3cuQkdOSl9USEVNRT8uZ2V0Py4oKSB8fCAnYXV0bycpKTtcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkNoYW5nZSA9ICgpID0+IHNldE1vZGUod2luZG93LkJHTkpfVEhFTUU/LmdldD8uKCkgfHwgJ2F1dG8nKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmduai10aGVtZS1jaGFuZ2UnLCBvbkNoYW5nZSk7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZ25qLXRoZW1lLWNoYW5nZScsIG9uQ2hhbmdlKTtcbiAgfSwgW10pO1xuICBpZiAoIXdpbmRvdy5CR05KX1RIRU1FKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbmV4dCA9IHdpbmRvdy5CR05KX1RIRU1FLmN5Y2xlLmJpbmQod2luZG93LkJHTkpfVEhFTUUpO1xuICBjb25zdCBpY29uID0gbW9kZSA9PT0gJ2RhcmsnID8gJ1x1RDgzQ1x1REYxOScgOiBtb2RlID09PSAnbGlnaHQnID8gJ1x1MjYwMCcgOiAnXHUyNUQwJztcbiAgY29uc3QgbGFiZWwgPSBtb2RlID09PSAnZGFyaycgPyAnREFSSycgOiBtb2RlID09PSAnbGlnaHQnID8gJ0xJR0hUJyA6ICdBVVRPJztcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0aGVtZS10b2dnbGVcIiBvbkNsaWNrPXsoKSA9PiBuZXh0KCl9IGFyaWEtbGFiZWw9e2BcdUQxNENcdUI5QzggXHVDODA0XHVENjU4IFx1MjAxNCBcdUQ2MDRcdUM3QUMgJHtsYWJlbH1gfSB0aXRsZT1cIlx1RDE0Q1x1QjlDODogXHVCNzdDXHVDNzc0XHVEMkI4IC8gXHVCMkU0XHVEMDZDIC8gXHVDNzkwXHVCM0Q5XCI+XG4gICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj57aWNvbn08L3NwYW4+PHNwYW4+e2xhYmVsfTwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbiAgKTtcbn07XG5cbmNvbnN0IE9ybmFtZW50ID0gKHsgY2hpbGRyZW4gfSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cIm9ybmFtZW50XCIgc3R5bGU9e3ttYXJnaW46XCI0MHB4IDBcIn19PlxuICAgIDxzcGFuIHN0eWxlPXt7Zm9udEZhbWlseTondmFyKC0tZm9udC1zZXJpZiknLCBmb250U2l6ZToxNCwgbGV0dGVyU3BhY2luZzonMC4zZW0nLCBjb2xvcjondmFyKC0tZ29sZCknfX0+XG4gICAgICB7Y2hpbGRyZW4gfHwgXCJcdTRFOTRcIn1cbiAgICA8L3NwYW4+XG4gIDwvZGl2PlxuKTtcblxuLy8gdGl0bGUgYWNjZXB0cyBzdHJpbmcgT1IgUmVhY3Qgbm9kZS4gRm9yIGFjY2VudCwgcGFzcyBKU1g6IDw+XHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXHVDNUQwIDxzcGFuIGNsYXNzTmFtZT1cImFjY2VudFwiPlx1QzgwNFx1RDU1OFx1QjI5NCBcdUI5RDA8L3NwYW4+PC8+XG5jb25zdCBTZWN0aW9uSGVhZCA9ICh7IGV5ZWJyb3csIHRpdGxlLCBzdWJ0aXRsZSwgYWN0aW9uLCBsZXZlbCA9IDIgfSkgPT4ge1xuICBjb25zdCBIID0gYGgke2xldmVsfWA7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWhlYWRcIj5cbiAgICAgIDxkaXY+XG4gICAgICAgIHtleWVicm93ICYmIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1leWVicm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+e2V5ZWJyb3d9PC9kaXY+fVxuICAgICAgICA8SCBjbGFzc05hbWU9XCJzZWN0aW9uLXRpdGxlXCI+e3RpdGxlfTwvSD5cbiAgICAgICAge3N1YnRpdGxlICYmIDxwIGNsYXNzTmFtZT1cInNlY3Rpb24tc3VidGl0bGVcIj57c3VidGl0bGV9PC9wPn1cbiAgICAgIDwvZGl2PlxuICAgICAge2FjdGlvbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IFR3ZWFrcyA9ICh7IHR3ZWFrcywgc2V0VHdlYWtzLCB2aXNpYmxlIH0pID0+IHtcbiAgaWYgKCF2aXNpYmxlKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgc2V0ID0gKGssIHYpID0+IHNldFR3ZWFrcyh7IC4uLnR3ZWFrcywgW2tdOiB2IH0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzXCI+XG4gICAgICA8aDM+VHdlYWtzPC9oMz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLXJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1sYWJlbFwiPlx1QzJFQ1x1QkNGQyBcdUMyQTRcdUQwQzBcdUM3N0M8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3Mtb3B0aW9uc1wiPlxuICAgICAgICAgIHtbXCJvdXRsaW5lXCIsIFwiZmlsbGVkXCIsIFwiZGFzaGVkXCJdLm1hcChzID0+IChcbiAgICAgICAgICAgIDxidXR0b24ga2V5PXtzfSBjbGFzc05hbWU9e3R3ZWFrcy5saW5lU3R5bGUgPT09IHMgPyBcIm9uXCIgOiBcIlwifVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXQoXCJsaW5lU3R5bGVcIiwgcyl9PlxuICAgICAgICAgICAgICB7cyA9PT0gXCJvdXRsaW5lXCIgPyBcIlx1QzEyMFwiIDogcyA9PT0gXCJmaWxsZWRcIiA/IFwiXHVDQzQ0XHVDNkMwXCIgOiBcIlx1RDMwQ1x1QzEyMFwifVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1yb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3MtbGFiZWxcIj5cdUFDRThcdUI0REMgXHVBQzE1XHVCM0M0IFx1MDBCNyB7dHdlYWtzLmludGVuc2l0eS50b0ZpeGVkKDEpfTwvZGl2PlxuICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgY2xhc3NOYW1lPVwidHdlYWtzLXNsaWRlclwiXG4gICAgICAgICAgbWluPVwiMC4zXCIgbWF4PVwiMS44XCIgc3RlcD1cIjAuMVwiXG4gICAgICAgICAgdmFsdWU9e3R3ZWFrcy5pbnRlbnNpdHl9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0KFwiaW50ZW5zaXR5XCIsIHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpKX0vPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1yb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3MtbGFiZWxcIj5cdUQ3ODhcdUM1QjRcdUI4NUMgXHVCODA4XHVDNzc0XHVDNTQ0XHVDNkMzPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLW9wdGlvbnNcIj5cbiAgICAgICAgICB7W1wiY2VudGVyXCIsIFwic3BsaXRcIiwgXCJmdWxsYmxlZWRcIl0ubWFwKHMgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e3N9IGNsYXNzTmFtZT17dHdlYWtzLmhlcm9MYXlvdXQgPT09IHMgPyBcIm9uXCIgOiBcIlwifVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXQoXCJoZXJvTGF5b3V0XCIsIHMpfT5cbiAgICAgICAgICAgICAge3MgPT09IFwiY2VudGVyXCIgPyBcIlx1QzkxMVx1QzU1OVwiIDogcyA9PT0gXCJzcGxpdFwiID8gXCJcdUJEODRcdUQ1NjBcIiA6IFwiXHVENDgwXHVCRTE0XHVCOUFDXHVCNERDXCJ9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLXJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1sYWJlbFwiPlx1Qzc3OFx1RDEzMFx1Qjc5OVx1QzE1ODwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1vcHRpb25zXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e3R3ZWFrcy5pbnRlcmFjdGl2ZSA/IFwib25cIiA6IFwiXCJ9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXQoXCJpbnRlcmFjdGl2ZVwiLCAhdHdlYWtzLmludGVyYWN0aXZlKX0+XG4gICAgICAgICAgICB7dHdlYWtzLmludGVyYWN0aXZlID8gXCJPTlwiIDogXCJPRkZcIn1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1Q0ZFMFx1RDBBNCBcdUMyQjlcdUM3NzggXHVCQzMwXHVCMTA4IFx1MjAxNCBcdUNDQUIgXHVCQzI5XHVCQjM4IFx1QzJEQyBcdUQ0NUNcdUMyREMuIFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QUMwMCBcdUFDQjBcdUM4MTVcdUQ1NThcdUJBNzQgbG9jYWxTdG9yYWdlXHVDNUQwIFx1QzYwMVx1QzE4RFx1RDY1NC5cbi8vIFBJUEEgLyBHRFBSIFx1QUMwMFx1Qzc3NFx1QjREQ1x1Qjc3Q1x1Qzc3ODogXHVENTQ0XHVDMjE4KFx1QUUzMFx1QjJBNSlcdUIyOTQgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QUM3MFx1QkQ4MCBcdUJEODhcdUFDMDAsIFx1QkQ4NFx1QzExRFx1MDBCN1x1QjlDOFx1Q0YwMFx1RDMwNVx1Qzc0MCBcdUM2MzVcdUQyQjhcdUM3NzguXG4vLyBcdUM4MDBcdUM3QTUgXHVENjE1XHVEMERDOiB7IG5lY2Vzc2FyeTp0cnVlLCBhbmFseXRpY3M6Ym9vbCwgbWFya2V0aW5nOmJvb2wsIHRzOklTTyB9XG5jb25zdCBDb29raWVDb25zZW50ID0gKCkgPT4ge1xuICBjb25zdCBLRVkgPSAnYmdual9jb29raWVfY29uc2VudCc7XG4gIGNvbnN0IFtkZWNpc2lvbiwgc2V0RGVjaXNpb25dID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgIHRyeSB7IGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKEtFWSk7IHJldHVybiByYXcgPyBKU09OLnBhcnNlKHJhdykgOiBudWxsOyB9IGNhdGNoIHsgcmV0dXJuIG51bGw7IH1cbiAgfSk7XG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2FuYWx5dGljcywgc2V0QW5hbHl0aWNzXSA9IFJlYWN0LnVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbbWFya2V0aW5nLCBzZXRNYXJrZXRpbmddID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IHBlcnNpc3QgPSAobmV4dCkgPT4ge1xuICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKEtFWSwgSlNPTi5zdHJpbmdpZnkobmV4dCkpOyB9IGNhdGNoIHt9XG4gICAgc2V0RGVjaXNpb24obmV4dCk7XG4gICAgdHJ5IHsgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdiZ25qLWNvb2tpZS1jb25zZW50JywgeyBkZXRhaWw6IG5leHQgfSkpOyB9IGNhdGNoIHt9XG4gIH07XG5cbiAgY29uc3QgYWNjZXB0QWxsID0gKCkgPT4gcGVyc2lzdCh7IG5lY2Vzc2FyeTogdHJ1ZSwgYW5hbHl0aWNzOiB0cnVlLCBtYXJrZXRpbmc6IHRydWUsIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSk7XG4gIGNvbnN0IHJlamVjdEFsbCA9ICgpID0+IHBlcnNpc3QoeyBuZWNlc3Nhcnk6IHRydWUsIGFuYWx5dGljczogZmFsc2UsIG1hcmtldGluZzogZmFsc2UsIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSk7XG4gIGNvbnN0IHNhdmVDdXN0b20gPSAoKSA9PiBwZXJzaXN0KHsgbmVjZXNzYXJ5OiB0cnVlLCBhbmFseXRpY3M6ICEhYW5hbHl0aWNzLCBtYXJrZXRpbmc6ICEhbWFya2V0aW5nLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0pO1xuXG4gIGlmIChkZWNpc2lvbikgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHJvbGU9XCJkaWFsb2dcIiBhcmlhLW1vZGFsPVwiZmFsc2VcIiBhcmlhLWxhYmVsbGVkYnk9XCJjb29raWUtYmFubmVyLXRpdGxlXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLCBsZWZ0OiAxNiwgcmlnaHQ6IDE2LCBib3R0b206IDE2LFxuICAgICAgICBtYXhXaWR0aDogNzIwLCBtYXJnaW46ICcwIGF1dG8nLCB6SW5kZXg6IDgwLFxuICAgICAgICBiYWNrZ3JvdW5kOiAndmFyKC0tYmctMiknLCBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tZ29sZC1kaW0pJyxcbiAgICAgICAgYm94U2hhZG93OiAnMCAxNnB4IDQwcHggcmdiYSgwLDAsMCwwLjQ1KScsXG4gICAgICAgIHBhZGRpbmc6ICcyMHB4IDIycHgnLCBib3JkZXJSYWRpdXM6IDQsXG4gICAgICB9fT5cbiAgICAgIDxoMiBpZD1cImNvb2tpZS1iYW5uZXItdGl0bGVcIiBjbGFzc05hbWU9XCJrby1zZXJpZlwiIHN0eWxlPXt7IGZvbnRTaXplOiAxNiwgbWFyZ2luQm90dG9tOiA4IH19Plx1Q0ZFMFx1RDBBNCBcdUMwQUNcdUM2QTkgXHVCM0Q5XHVDNzU4PC9oMj5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMywgbGluZUhlaWdodDogMS43LCBtYXJnaW5Cb3R0b206IDE0IH19PlxuICAgICAgICBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUIyOTQgXHVDMTFDXHVCRTQ0XHVDMkE0IFx1QzZCNFx1QzYwMVx1Qzc0NCBcdUM3MDRcdUQ1NUMgPHN0cm9uZyBjbGFzc05hbWU9XCJnb2xkXCI+XHVENTQ0XHVDMjE4IFx1Q0ZFMFx1RDBBNDwvc3Ryb25nPlx1QzY0MCwgXHVDMEFDXHVDNzc0XHVEMkI4IFx1QUMxQ1x1QzEyMFx1Qzc0NCBcdUM3MDRcdUQ1NUNcbiAgICAgICAgPHN0cm9uZyBjbGFzc05hbWU9XCJnb2xkXCI+IFx1QkQ4NFx1QzExRCBcdUNGRTBcdUQwQTQ8L3N0cm9uZz5cdTAwQjc8c3Ryb25nIGNsYXNzTmFtZT1cImdvbGRcIj5cdUI5QzhcdUNGMDBcdUQzMDUgXHVDRkUwXHVEMEE0PC9zdHJvbmc+XHVCOTdDIFx1QzBBQ1x1QzZBOVx1RDU2OVx1QjJDOFx1QjJFNC5cbiAgICAgICAgXHVDMTM4XHVCRDgwIFx1QzEyNFx1QzgxNVx1QzVEMFx1QzExQyBcdUQ1NkRcdUJBQTlcdUJDQzRcdUI4NUMgXHVDMTIwXHVEMEREXHVENTU4XHVDMkU0IFx1QzIxOCBcdUM3ODhcdUM1QjRcdUM2OTQuXG4gICAgICA8L3A+XG4gICAgICB7ZGV0YWlscyAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAxNCwgcGFkZGluZ1RvcDogMTAsIGJvcmRlclRvcDogJzFweCBzb2xpZCB2YXIoLS1saW5lKScgfX0+XG4gICAgICAgICAgPGZpZWxkc2V0IHN0eWxlPXt7IGJvcmRlcjogJ25vbmUnLCBwYWRkaW5nOiAwLCBtYXJnaW46IDAgfX0+XG4gICAgICAgICAgICA8bGVnZW5kIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5cdUNGRTBcdUQwQTQgXHVENTZEXHVCQUE5XHVCQ0M0IFx1QjNEOVx1Qzc1ODwvbGVnZW5kPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZ3JpZCcsIGdhcDogMTAgfX0+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogMTAsIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0Jywgb3BhY2l0eTogMC43IH19PlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkIHJlYWRPbmx5IGFyaWEtbGFiZWw9XCJcdUQ1NDRcdUMyMTggXHVDRkUwXHVEMEE0IChcdUQ1NkRcdUMwQzEgXHVENjVDXHVDMTMxKVwiLz5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgZm9udFNpemU6IDEzIH19Plx1RDU0NFx1QzIxODwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3sgZm9udFNpemU6IDEyLCBkaXNwbGF5OiAnYmxvY2snIH19Plx1Qjg1Q1x1QURGOFx1Qzc3OCBcdUMxMzhcdUMxNTgsIFx1QkNGNFx1QzU0OCwgXHVENTQ0XHVDMjE4IFx1QUUzMFx1QjJBNSBcdUIzRDlcdUM3OTFcdUM1RDAgXHVDMEFDXHVDNkE5LiBcdUFDNzBcdUJEODAgXHVCRDg4XHVBQzAwLjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogMTAsIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JyB9fT5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17YW5hbHl0aWNzfSBvbkNoYW5nZT17KGUpID0+IHNldEFuYWx5dGljcyhlLnRhcmdldC5jaGVja2VkKX1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJcdUJEODRcdUMxMUQgXHVDRkUwXHVEMEE0IFx1QjNEOVx1Qzc1OFwiLz5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgZm9udFNpemU6IDEzIH19Plx1QkQ4NFx1QzExRDwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3sgZm9udFNpemU6IDEyLCBkaXNwbGF5OiAnYmxvY2snIH19Plx1QkMyOVx1QkIzOCBcdUQxQjVcdUFDQzRcdTAwQjdcdUQzOThcdUM3NzRcdUM5QzAgXHVDMTMxXHVCMkE1IFx1QUMxQ1x1QzEyMFx1QzZBOS4gXHVDMkREXHVCQ0M0XHVDNzkwIFx1Qzc3NVx1QkE4NSBcdUNDOThcdUI5QUMuPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAxMCwgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnIH19PlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXttYXJrZXRpbmd9IG9uQ2hhbmdlPXsoZSkgPT4gc2V0TWFya2V0aW5nKGUudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlx1QjlDOFx1Q0YwMFx1RDMwNSBcdUNGRTBcdUQwQTQgXHVCM0Q5XHVDNzU4XCIvPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBmb250U2l6ZTogMTMgfX0+XHVCOUM4XHVDRjAwXHVEMzA1PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17eyBmb250U2l6ZTogMTIsIGRpc3BsYXk6ICdibG9jaycgfX0+XHVBRDAwXHVDMkVDXHVDMEFDIFx1QUUzMFx1QkMxOCBcdUM1NDhcdUIwQjQsIFx1QzY3OFx1QkQ4MCBcdUFEMTFcdUFDRTAgXHVCOUU0XHVDQ0I0IFx1QzVGMFx1QjNEOVx1QzVEMCBcdUMwQUNcdUM2QTkuPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6IDgsIGZsZXhXcmFwOiAnd3JhcCcsIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnIH19PlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gc2V0RGV0YWlscygodikgPT4gIXYpfVxuICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e2RldGFpbHN9PlxuICAgICAgICAgIHtkZXRhaWxzID8gJ1x1QUMwNFx1QjJFOFx1RDc4OCcgOiAnXHVDMTM4XHVCRDgwIFx1QzEyNFx1QzgxNSd9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17cmVqZWN0QWxsfT5cdUJBQThcdUI0NTAgXHVBQzcwXHVCRDgwPC9idXR0b24+XG4gICAgICAgIHtkZXRhaWxzXG4gICAgICAgICAgPyA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsIGJ0bi1nb2xkXCIgb25DbGljaz17c2F2ZUN1c3RvbX0+XHVDMTIwXHVEMEREIFx1QzgwMFx1QzdBNTwvYnV0dG9uPlxuICAgICAgICAgIDogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbCBidG4tZ29sZFwiIG9uQ2xpY2s9e2FjY2VwdEFsbH0+XHVCQUE4XHVCNDUwIFx1QjNEOVx1Qzc1ODwvYnV0dG9uPn1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gdjAwLjEwNSBcdTIwMTQgXHVDRUU0XHVCQzg0IFx1Qzc3NFx1QkJGOFx1QzlDMCBwbGFjZWhvbGRlci4gQkFOR0lOT0pBIFx1Qjg1Q1x1QUNFMFx1Qjk3QyA1MCUgXHVEMjJDXHVCQTg1XHVCM0M0XHVCODVDIFx1QzkxMVx1QzU1OSBcdUQ0NUNcdUMyREMuXG4vLyBcdUMwQUNcdUM2QTlcdUNDOTg6IFx1RDIyQ1x1QzVCNC9cdUFDMTVcdUM1RjAgXHVDMEMxXHVDMTM4IFx1RDM5OFx1Qzc3NFx1QzlDMCBjb3ZlciBcdUJCRjhcdUMxMjRcdUM4MTUgXHVDMkRDICsgXHVDQzQ1IFx1Q0U3NFx1RDBDOFx1Qjg1Q1x1QURGOCBjb3ZlciBcdUJCRjhcdUMxMjRcdUM4MTUgXHVDMkRDLlxuY29uc3QgQ292ZXJQbGFjZWhvbGRlciA9ICh7IGFzcGVjdFJhdGlvID0gJzE2LzEwJywgbGFiZWwsIGljb25TaXplID0gODggfSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cInBsYWNlaG9sZGVyXCIgc3R5bGU9e3tcbiAgICBhc3BlY3RSYXRpbywgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgZGlzcGxheTogJ2dyaWQnLCBwbGFjZUl0ZW1zOiAnY2VudGVyJyxcbiAgICBiYWNrZ3JvdW5kOiAndmFyKC0tYmctMiknLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1saW5lLTIpJyxcbiAgfX0+XG4gICAgPGRpdiBzdHlsZT17eyBvcGFjaXR5OiAwLjUsIGRpc3BsYXk6ICdncmlkJywgcGxhY2VJdGVtczogJ2NlbnRlcicsIGdhcDogMTAgfX0+XG4gICAgICA8QmFuZ2lub2phSWNvbiBzaXplPXtpY29uU2l6ZX0vPlxuICAgICAge2xhYmVsICYmIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogJzAuMjJlbScgfX0+XG4gICAgICAgICAge2xhYmVsfVxuICAgICAgICA8L3NwYW4+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbik7XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IEJyYW5kLCBOYXYsIEZvb3RlciwgT3JuYW1lbnQsIFNlY3Rpb25IZWFkLCBUd2Vha3MsIEF1dGhvckdyYWRlQmFkZ2UsIE5vdGlmaWNhdGlvbkJlbGwsIFNjcm9sbFRvVG9wLCBCYW5naW5vamFJY29uLCBDb3ZlclBsYWNlaG9sZGVyLCBDb29raWVDb25zZW50IH0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBUUEsT0FBTyxnQkFBZ0IsU0FBUyxjQUFjLEVBQUUsTUFBTSxPQUFPLFNBQVMsYUFBYSxNQUFNLEdBQUc7QUFDMUYsUUFBTSxhQUFhLFNBQVM7QUFLNUIsUUFBTSxXQUFXLE1BQU0sT0FBTyxFQUFFLE9BQU8sU0FBUyxhQUFhLFdBQVcsQ0FBQztBQUN6RSxXQUFTLFVBQVUsRUFBRSxPQUFPLFNBQVMsYUFBYSxXQUFXO0FBRTdELFFBQU0scUJBQXFCLE1BQU0sWUFBWSxNQUFNO0FBakJyRDtBQWtCSSxVQUFNLElBQUksU0FBUztBQUNuQixRQUFJLENBQUMsRUFBRSxPQUFPO0FBQUUsY0FBRSxZQUFGO0FBQWU7QUFBQSxJQUFRO0FBQ3ZDLFFBQUksRUFBRSxhQUFhO0FBQ2pCLFlBQU0sTUFBTSxPQUFPLFFBQVEsR0FBRyxFQUFFLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQSxvRkFBNEU7QUFDdEgsVUFBSSxLQUFLO0FBQUUsWUFBSTtBQUFFLFlBQUUsWUFBWTtBQUFBLFFBQUcsU0FBUTtBQUFBLFFBQUM7QUFBQSxNQUFFO0FBQzdDLGNBQUUsWUFBRjtBQUFBLElBQ0YsT0FBTztBQUNMLFlBQU0sS0FBSyxPQUFPLFFBQVEsR0FBRyxFQUFFLFVBQVUsNEhBQTZCO0FBQ3RFLFVBQUksR0FBSSxTQUFFLFlBQUY7QUFBQSxJQUNWO0FBQUEsRUFDRixHQUFHLENBQUMsQ0FBQztBQUVMLFFBQU0sVUFBVSxNQUFNO0FBQ3BCLFFBQUksQ0FBQyxLQUFNO0FBQ1gsVUFBTSxRQUFRLENBQUMsTUFBTTtBQUNuQixVQUFJLEVBQUUsUUFBUSxZQUFZLEVBQUUsUUFBUSxPQUFPO0FBQ3pDLFVBQUUsZUFBZTtBQUNqQiwyQkFBbUI7QUFBQSxNQUNyQjtBQUFBLElBQ0Y7QUFDQSxXQUFPLGlCQUFpQixXQUFXLEtBQUs7QUFDeEMsVUFBTSxlQUFlLFNBQVMsS0FBSyxNQUFNO0FBQ3pDLGFBQVMsS0FBSyxNQUFNLFdBQVc7QUFDL0IsUUFBSSxTQUFTO0FBQ2IsUUFBSTtBQUNGLGFBQU8sUUFBUSxVQUFVLEVBQUUsV0FBVyxLQUFLLEdBQUcsRUFBRTtBQUNoRCxlQUFTO0FBQUEsSUFDWCxTQUFRO0FBQUEsSUFBQztBQUNULFVBQU0sUUFBUSxNQUFNO0FBQUUseUJBQW1CO0FBQUEsSUFBRztBQUM1QyxRQUFJLE9BQVEsUUFBTyxpQkFBaUIsWUFBWSxLQUFLO0FBQ3JELFdBQU8sTUFBTTtBQWhEakI7QUFpRE0sYUFBTyxvQkFBb0IsV0FBVyxLQUFLO0FBQzNDLGVBQVMsS0FBSyxNQUFNLFdBQVc7QUFDL0IsVUFBSSxRQUFRO0FBQ1YsZUFBTyxvQkFBb0IsWUFBWSxLQUFLO0FBQzVDLFlBQUk7QUFBRSxlQUFJLFlBQU8sUUFBUSxVQUFmLG1CQUFzQixVQUFXLFFBQU8sUUFBUSxLQUFLO0FBQUEsUUFBRyxTQUFRO0FBQUEsUUFBQztBQUFBLE1BQzdFO0FBQUEsSUFDRjtBQUFBLEVBQ0YsR0FBRyxDQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFN0IsUUFBTSxrQkFBa0IsTUFBTSxZQUFZLENBQUMsTUFBTTtBQUMvQyxRQUFJLEVBQUUsV0FBVyxFQUFFLGNBQWUsb0JBQW1CO0FBQUEsRUFDdkQsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0FBRXZCLFNBQU8sRUFBRSxpQkFBaUIsbUJBQW1CO0FBQy9DO0FBR0EsTUFBTSxjQUFjLE1BQU07QUFDeEIsUUFBTSxDQUFDLFNBQVMsVUFBVSxJQUFJLE1BQU0sU0FBUyxLQUFLO0FBQ2xELFFBQU0sZUFBZSxNQUFNO0FBcEU3QjtBQXNFSSxhQUFPLGNBQVMsY0FBYyxNQUFNLE1BQTdCLG1CQUFnQyxRQUFRLFlBQVcsU0FBUztBQUFBLEVBQ3JFO0FBQ0EsUUFBTSxhQUFhLE1BQU07QUFDdkIsVUFBTSxnQkFBZ0IsU0FBUyxjQUFjLHlEQUFnQztBQUM3RSxRQUFJLGVBQWU7QUFDakIsYUFBTyxLQUFLLElBQUksY0FBYyxhQUFhLEdBQUcsT0FBTyxXQUFXLENBQUM7QUFBQSxJQUNuRTtBQUNBLFdBQU8sT0FBTyxXQUFXO0FBQUEsRUFDM0I7QUFDQSxRQUFNLFVBQVUsTUFBTTtBQUNwQixVQUFNLFdBQVcsTUFBTSxXQUFXLFdBQVcsSUFBSSxHQUFHO0FBQ3BELGFBQVM7QUFDVCxXQUFPLGlCQUFpQixVQUFVLFVBQVUsRUFBRSxTQUFTLEtBQUssQ0FBQztBQUM3RCxVQUFNLGdCQUFnQixTQUFTLGNBQWMseURBQWdDO0FBQzdFLFFBQUksY0FBZSxlQUFjLGlCQUFpQixVQUFVLFVBQVUsRUFBRSxTQUFTLEtBQUssQ0FBQztBQUN2RixXQUFPLE1BQU07QUFDWCxhQUFPLG9CQUFvQixVQUFVLFFBQVE7QUFDN0MsVUFBSSxjQUFlLGVBQWMsb0JBQW9CLFVBQVUsUUFBUTtBQUFBLElBQ3pFO0FBQUEsRUFDRixHQUFHLENBQUMsQ0FBQztBQUVMLFFBQU0sUUFBUSxNQUFNO0FBQ2xCLFVBQU0sZ0JBQWdCLFNBQVMsY0FBYyx5REFBZ0M7QUFDN0UsUUFBSSxpQkFBaUIsY0FBYyxZQUFZLEdBQUc7QUFDaEQsb0JBQWMsU0FBUyxFQUFFLEtBQUssR0FBRyxVQUFVLFNBQVMsQ0FBQztBQUFBLElBQ3ZEO0FBQ0EsV0FBTyxTQUFTLEVBQUUsS0FBSyxHQUFHLFVBQVUsU0FBUyxDQUFDO0FBQUEsRUFDaEQ7QUFFQSxNQUFJLENBQUMsUUFBUyxRQUFPO0FBQ3JCLFNBQ0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUNDLE1BQUs7QUFBQSxNQUNMLFNBQVM7QUFBQSxNQUNULGNBQVc7QUFBQSxNQUNYLE9BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFVBQVU7QUFBQSxRQUFTLE9BQU87QUFBQSxRQUFJLFFBQVE7QUFBQSxRQUFJLFFBQVE7QUFBQSxRQUNsRCxPQUFPO0FBQUEsUUFBSSxRQUFRO0FBQUEsUUFDbkIsWUFBWTtBQUFBLFFBQWUsT0FBTztBQUFBLFFBQ2xDLFFBQVE7QUFBQSxRQUNSLFdBQVc7QUFBQSxRQUNYLFFBQVE7QUFBQSxRQUNSLFNBQVM7QUFBQSxRQUFRLFlBQVk7QUFBQSxRQUFVLGdCQUFnQjtBQUFBLFFBQ3ZELFlBQVk7QUFBQSxRQUNaLFVBQVU7QUFBQSxNQUNaO0FBQUE7QUFBQSxJQUFHO0FBQUEsRUFFTDtBQUVKO0FBSUEsTUFBTSxtQkFBbUIsQ0FBQyxFQUFFLFVBQVUsUUFBUSxhQUFhLE9BQU8sS0FBSyxNQUFNO0FBNUg3RTtBQTZIRSxRQUFNLFNBQVEsWUFBTyxzQkFBUCxnQ0FBMkIsRUFBRSxVQUFVLFFBQVEsWUFBWTtBQUN6RSxNQUFJLENBQUMsTUFBTyxRQUFPO0FBQ25CLFFBQU0sUUFBUSxTQUFTO0FBQ3ZCLFNBQ0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUNDLFdBQVU7QUFBQSxNQUNWLE9BQU8sR0FBRyxNQUFNLEtBQUssU0FBTSxNQUFNLFFBQVEsRUFBRTtBQUFBLE1BQzNDLE9BQU87QUFBQSxRQUNMLFNBQVM7QUFBQSxRQUNULFlBQVk7QUFBQSxRQUNaLFlBQVk7QUFBQSxRQUNaLFNBQVMsUUFBUSxZQUFZO0FBQUEsUUFDN0IsVUFBVSxRQUFRLElBQUk7QUFBQSxRQUN0QixlQUFlO0FBQUEsUUFDZixPQUFPLE1BQU0sU0FBUztBQUFBLFFBQ3RCLFFBQVEsYUFBYSxNQUFNLFNBQVMsaUJBQWlCO0FBQUEsUUFDckQsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLFFBQ2YsZUFBZTtBQUFBLE1BQ2pCO0FBQUE7QUFBQSxJQUNDLE1BQU07QUFBQSxFQUNUO0FBRUo7QUFHQSxNQUFNLG1CQUFtQixDQUFDLEVBQUUsTUFBTSxPQUFPLE1BQU07QUFDN0MsUUFBTSxDQUFDLE1BQU0sT0FBTyxJQUFJLE1BQU0sU0FBUyxLQUFLO0FBQzVDLFFBQU0sQ0FBQyxNQUFNLE9BQU8sSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUN4QyxRQUFNLE1BQU0sTUFBTSxPQUFPLElBQUk7QUFHN0IsUUFBTSxVQUFVLE1BQU07QUFDcEIsVUFBTSxZQUFZLENBQUMsTUFBTTtBQUN2QixVQUFJLEVBQUUsUUFBUSxxQkFBc0IsU0FBUSxDQUFDLE1BQU0sSUFBSSxDQUFDO0FBQUEsSUFDMUQ7QUFDQSxXQUFPLGlCQUFpQixXQUFXLFNBQVM7QUFDNUMsV0FBTyxNQUFNLE9BQU8sb0JBQW9CLFdBQVcsU0FBUztBQUFBLEVBQzlELEdBQUcsQ0FBQyxDQUFDO0FBR0wsUUFBTSxVQUFVLE1BQU07QUFDcEIsUUFBSSxDQUFDLEtBQU07QUFDWCxVQUFNLFFBQVEsQ0FBQyxNQUFNO0FBQ25CLFVBQUksSUFBSSxXQUFXLENBQUMsSUFBSSxRQUFRLFNBQVMsRUFBRSxNQUFNLEVBQUcsU0FBUSxLQUFLO0FBQUEsSUFDbkU7QUFDQSxhQUFTLGlCQUFpQixhQUFhLEtBQUs7QUFDNUMsV0FBTyxNQUFNLFNBQVMsb0JBQW9CLGFBQWEsS0FBSztBQUFBLEVBQzlELEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFFVCxNQUFJLENBQUMsS0FBTSxRQUFPO0FBRWxCLFFBQU0sV0FBVyxNQUFNO0FBakx6QjtBQWlMMkIsUUFBSTtBQUFFLGNBQU8sa0JBQU8sbUJBQVAsbUJBQXVCLHNCQUF2Qiw0QkFBMkMsS0FBSztBQUFBLElBQUssU0FBUTtBQUFFLGFBQU8sQ0FBQztBQUFBLElBQUc7QUFBQSxFQUFFLEdBQUc7QUFDckgsUUFBTSxPQUFPLE1BQU0sUUFBUSxPQUFPLElBQUksVUFBVSxDQUFDO0FBQ2pELFFBQU0sU0FBUyxLQUFLLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRTtBQUVoRCxRQUFNLE9BQU8sQ0FBQyxNQUFNO0FBckx0QjtBQXNMSSxRQUFJO0FBQUUseUJBQU8sbUJBQVAsbUJBQXVCLHlCQUF2Qiw0QkFBOEMsS0FBSyxJQUFJLEVBQUU7QUFBQSxJQUFLLFNBQVE7QUFBQSxJQUFDO0FBQzdFLFlBQVEsS0FBSztBQUNiLFFBQUksT0FBUSxRQUFPLENBQUM7QUFDcEIsWUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDO0FBQUEsRUFDdEI7QUFFQSxRQUFNLFVBQVUsTUFBTTtBQTVMeEI7QUE2TEksUUFBSTtBQUFFLHlCQUFPLG1CQUFQLG1CQUF1Qiw2QkFBdkIsNEJBQWtELEtBQUs7QUFBQSxJQUFLLFNBQVE7QUFBQSxJQUFDO0FBQzNFLFlBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQztBQUFBLEVBQ3RCO0FBRUEsU0FDRSxvQ0FBQyxTQUFJLEtBQVUsT0FBTyxFQUFFLFVBQVUsV0FBVyxLQUMzQztBQUFBLElBQUM7QUFBQTtBQUFBLE1BQ0MsTUFBSztBQUFBLE1BQ0wsV0FBVTtBQUFBLE1BQ1YsY0FBWSxnQkFBTSxTQUFTLElBQUksR0FBRyxNQUFNLCtCQUFXLEVBQUU7QUFBQSxNQUNyRCxTQUFTLE1BQU0sUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQUEsTUFDaEMsT0FBTyxFQUFFLFVBQVUsWUFBWSxTQUFTLFlBQVksVUFBVSxHQUFHO0FBQUE7QUFBQSxJQUNqRTtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQUksZUFBWTtBQUFBLFFBQU8sT0FBTTtBQUFBLFFBQUssUUFBTztBQUFBLFFBQUssU0FBUTtBQUFBLFFBQVksTUFBSztBQUFBLFFBQ3RFLFFBQU87QUFBQSxRQUFlLGFBQVk7QUFBQSxRQUFNLGVBQWM7QUFBQSxRQUFRLGdCQUFlO0FBQUEsUUFDN0UsT0FBTyxFQUFFLFNBQVMsU0FBUyxlQUFlLFNBQVM7QUFBQTtBQUFBLE1BQ25ELG9DQUFDLFVBQUssR0FBRSw2Q0FBMkM7QUFBQSxNQUNuRCxvQ0FBQyxVQUFLLEdBQUUsa0NBQWdDO0FBQUEsSUFDMUM7QUFBQSxJQUNDLFNBQVMsS0FDUjtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQ0MsZUFBWTtBQUFBLFFBQ1osT0FBTztBQUFBLFVBQ0wsVUFBVTtBQUFBLFVBQVksS0FBSztBQUFBLFVBQUksT0FBTztBQUFBLFVBQ3RDLFlBQVk7QUFBQSxVQUFlLE9BQU87QUFBQSxVQUNsQyxjQUFjO0FBQUEsVUFBSyxVQUFVO0FBQUEsVUFBRyxZQUFZO0FBQUEsVUFDNUMsU0FBUztBQUFBLFVBQVcsZUFBZTtBQUFBLFVBQ25DLFVBQVU7QUFBQSxVQUFJLFdBQVc7QUFBQSxVQUFVLFlBQVk7QUFBQSxRQUNqRDtBQUFBO0FBQUEsTUFDQyxTQUFTLElBQUksT0FBTztBQUFBLElBQ3ZCO0FBQUEsRUFFSixHQUNDLFFBQ0M7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUNDLE1BQUs7QUFBQSxNQUNMLGNBQVc7QUFBQSxNQUNYLE9BQU87QUFBQSxRQUNMLFVBQVU7QUFBQSxRQUFZLEtBQUs7QUFBQSxRQUFvQixPQUFPO0FBQUEsUUFDdEQsT0FBTztBQUFBLFFBQUssV0FBVztBQUFBLFFBQUssVUFBVTtBQUFBLFFBQ3RDLFlBQVk7QUFBQSxRQUFlLFFBQVE7QUFBQSxRQUNuQyxXQUFXO0FBQUEsUUFDWCxRQUFRO0FBQUEsTUFDVjtBQUFBO0FBQUEsSUFDQSxvQ0FBQyxTQUFJLE9BQU8sRUFBRSxTQUFTLGFBQWEsY0FBYyx5QkFBeUIsU0FBUyxRQUFRLGdCQUFnQixpQkFBaUIsWUFBWSxTQUFTLEtBQ2hKLG9DQUFDLFVBQUssV0FBVSxhQUFZLE9BQU8sRUFBRSxVQUFVLElBQUksZUFBZSxTQUFTLEtBQUcsc0JBQU0sS0FBSyxNQUFPLEdBQy9GLFNBQVMsS0FDUjtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQU8sTUFBSztBQUFBLFFBQVMsU0FBUztBQUFBLFFBQVMsV0FBVTtBQUFBLFFBQ2hELE9BQU8sRUFBRSxVQUFVLElBQUksT0FBTyxlQUFlO0FBQUE7QUFBQSxNQUFHO0FBQUEsSUFBSyxDQUUzRDtBQUFBLElBQ0MsS0FBSyxXQUFXLElBQ2Ysb0NBQUMsU0FBSSxXQUFVLE9BQU0sT0FBTyxFQUFFLFNBQVMsSUFBSSxXQUFXLFVBQVUsVUFBVSxHQUFHLEtBQUcsd0VBRWhGLElBRUEsb0NBQUMsUUFBRyxPQUFPLEVBQUUsV0FBVyxRQUFRLFFBQVEsR0FBRyxTQUFTLEVBQUUsS0FDbkQsS0FBSyxJQUFJLENBQUMsTUFDVCxvQ0FBQyxRQUFHLEtBQUssRUFBRSxNQUNUO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFBTyxNQUFLO0FBQUEsUUFBUyxTQUFTLE1BQU0sS0FBSyxDQUFDO0FBQUEsUUFDekMsT0FBTztBQUFBLFVBQ0wsT0FBTztBQUFBLFVBQVEsV0FBVztBQUFBLFVBQzFCLFNBQVM7QUFBQSxVQUNULFlBQVksRUFBRSxPQUFPLGdCQUFnQjtBQUFBLFVBQ3JDLGNBQWM7QUFBQSxVQUNkLFFBQVE7QUFBQSxRQUNWO0FBQUE7QUFBQSxNQUNBLG9DQUFDLFNBQUksT0FBTyxFQUFFLFVBQVUsSUFBSSxPQUFPLGNBQWMsY0FBYyxHQUFHLFlBQVksSUFBSSxLQUNoRixvQ0FBQyxVQUFLLFdBQVUsVUFBUSxFQUFFLFFBQVMsR0FDbkMsb0NBQUMsVUFBSyxXQUFVLFNBQU0sVUFBSSxFQUFFLFdBQVcscUJBQU8sQ0FDaEQ7QUFBQSxNQUNDLEVBQUUsYUFDRCxvQ0FBQyxTQUFJLFdBQVUsT0FBTSxPQUFPLEVBQUUsVUFBVSxJQUFJLFlBQVksS0FBSyxVQUFVLFVBQVUsY0FBYyxZQUFZLFlBQVksU0FBUyxLQUFHLFdBQzlILEVBQUUsU0FDUDtBQUFBLE1BRUYsb0NBQUMsU0FBSSxXQUFVLGNBQWEsT0FBTyxFQUFFLFVBQVUsSUFBSSxXQUFXLEdBQUcsZUFBZSxRQUFRLEtBQ3JGLE9BQU8sU0FBUyxZQUFZLEVBQUUsU0FBUyxDQUMxQztBQUFBLElBQ0YsQ0FDRixDQUNELENBQ0g7QUFBQSxFQUVKLENBRUo7QUFFSjtBQUlBLE1BQU0sZ0JBQWdCLENBQUMsRUFBRSxPQUFPLEdBQUcsTUFDakMsb0NBQUMsU0FBSSxPQUFPLE1BQU0sUUFBUSxNQUFNLFNBQVEsYUFBWSxlQUFZLFVBRTlELG9DQUFDLFVBQUssT0FBTSxNQUFLLFFBQU8sTUFBSyxJQUFHLEtBQUksSUFBRyxLQUFJLE1BQUssV0FBUyxHQUV6RDtBQUFBLEVBQUM7QUFBQTtBQUFBLElBQ0MsVUFBUztBQUFBLElBQ1QsR0FBRTtBQUFBLElBQ0YsTUFBSztBQUFBO0FBQVMsR0FFaEI7QUFBQSxFQUFDO0FBQUE7QUFBQSxJQUNDLEdBQUU7QUFBQSxJQUNGLE1BQUs7QUFBQTtBQUFTLEdBRWhCLG9DQUFDLE9BQUUsTUFBSyxhQUNOLG9DQUFDLFVBQUssR0FBRSxxRkFBbUYsR0FDM0Ysb0NBQUMsVUFBSyxHQUFFLHFFQUFtRSxHQUMzRSxvQ0FBQyxVQUFLLEdBQUUseUZBQXVGLEdBQy9GLG9DQUFDLFVBQUssR0FBRSxxRkFBbUYsR0FDM0Ysb0NBQUMsVUFBSyxHQUFFLHFGQUFtRixDQUM3RixDQUNGO0FBR0YsTUFBTSxRQUFRLENBQUMsRUFBRSxRQUFRLE1BQU07QUFoVC9CO0FBaVRFLFFBQU0sT0FBSyxrQkFBTyxzQkFBUCxtQkFBMEIsUUFBMUIsZ0NBQXFDLENBQUM7QUFDakQsUUFBTSxRQUFRLEdBQUcsU0FBUyxFQUFFLE1BQU0sNEJBQVEsS0FBSyxZQUFZO0FBQzNELFFBQU0sUUFBTyxRQUFHLGFBQUgsbUJBQWE7QUFDMUIsU0FDRTtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQ0MsV0FBVTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLGNBQVksR0FBRyxNQUFNLElBQUk7QUFBQSxNQUN6QixPQUFPLEVBQUMsWUFBVyxRQUFRLFFBQU8sUUFBUSxTQUFRLEdBQUcsUUFBTyxVQUFTO0FBQUE7QUFBQSxJQUNyRSxvQ0FBQyxVQUFLLFdBQVUsY0FBYSxlQUFZLFVBQ3RDLE9BQ0csb0NBQUMsU0FBSSxLQUFLLE1BQU0sS0FBSSxJQUFHLE9BQU8sRUFBQyxPQUFNLElBQUksUUFBTyxJQUFJLFdBQVUsV0FBVyxTQUFRLFFBQU8sR0FBRSxJQUMxRixvQ0FBQyxpQkFBYyxNQUFNLElBQUcsQ0FDOUI7QUFBQSxJQUNBLG9DQUFDLFVBQUssV0FBVSxnQkFDYixNQUFNLE1BQ1Asb0NBQUMsVUFBSyxXQUFVLE9BQU0sTUFBSyxRQUFNLE1BQU0sR0FBSSxDQUM3QztBQUFBLEVBQ0Y7QUFFSjtBQUVBLE1BQU0sTUFBTSxDQUFDLEVBQUUsT0FBTyxJQUFJLE1BQU0sU0FBUyxNQUFNO0FBdlUvQztBQXdVRSxRQUFNLFVBQVEsa0JBQU8sc0JBQVAsbUJBQTBCLFFBQTFCLGdDQUFxQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQy9ELFFBQU0sQ0FBQyxZQUFZLGFBQWEsSUFBSSxNQUFNLFNBQVMsS0FBSztBQUV4RCxRQUFNLFVBQVUsTUFBTTtBQUFFLGtCQUFjLEtBQUs7QUFBQSxFQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFFeEQsUUFBTSxVQUFVLE1BQU07QUFDcEIsUUFBSSxDQUFDLFdBQVk7QUFDakIsVUFBTSxRQUFRLENBQUMsTUFBTTtBQUFFLFVBQUksRUFBRSxRQUFRLFNBQVUsZUFBYyxLQUFLO0FBQUEsSUFBRztBQUNyRSxVQUFNLFdBQVcsTUFBTTtBQUFFLFVBQUksT0FBTyxhQUFhLElBQUssZUFBYyxLQUFLO0FBQUEsSUFBRztBQUM1RSxXQUFPLGlCQUFpQixXQUFXLEtBQUs7QUFDeEMsV0FBTyxpQkFBaUIsVUFBVSxRQUFRO0FBQzFDLFVBQU0sT0FBTyxTQUFTLEtBQUssTUFBTTtBQUNqQyxhQUFTLEtBQUssTUFBTSxXQUFXO0FBQy9CLFdBQU8sTUFBTTtBQUNYLGFBQU8sb0JBQW9CLFdBQVcsS0FBSztBQUMzQyxhQUFPLG9CQUFvQixVQUFVLFFBQVE7QUFDN0MsZUFBUyxLQUFLLE1BQU0sV0FBVztBQUFBLElBQ2pDO0FBQUEsRUFDRixHQUFHLENBQUMsVUFBVSxDQUFDO0FBRWYsUUFBTSxlQUFlO0FBQUEsSUFDbkIsRUFBRSxLQUFLLE9BQVMsT0FBTyxLQUFLLE9BQVMsNkJBQVUsTUFBTSxzRkFBb0I7QUFBQSxJQUN6RSxFQUFFLEtBQUssU0FBUyxPQUFPLEtBQUssU0FBUyw2QkFBVSxNQUFNLHNGQUFvQjtBQUFBLElBQ3pFLEVBQUUsS0FBSyxRQUFTLE9BQU8sS0FBSyxRQUFTLDZCQUFVLE1BQU0sc0VBQWlCO0FBQUEsRUFDeEU7QUFDQSxRQUFNLFdBQVcsYUFBYSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUc7QUFHOUMsUUFBTSxRQUFRO0FBQUEsSUFDWixFQUFFLEtBQUssUUFBUSxPQUFPLEtBQUssUUFBUSxTQUFJO0FBQUEsSUFDdkMsRUFBRSxLQUFLLFFBQVEsT0FBTyxLQUFLLFFBQVEsZ0JBQU0sUUFBUSxRQUFRLGNBQWMsTUFBTTtBQUFBLElBQzdFLEVBQUUsS0FBSyxRQUFRLE9BQU8sS0FBSyxRQUFRLGVBQUs7QUFBQSxJQUN4QyxFQUFFLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxlQUFLO0FBQUEsSUFDaEQsRUFBRSxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsZUFBSztBQUFBLElBQzVDLEVBQUUsS0FBSyxRQUFRLE9BQU8sS0FBSyxRQUFRLFNBQUk7QUFBQSxJQUN2QyxFQUFFLEtBQUssYUFBYSxPQUFPLEtBQUssYUFBYSw0QkFBUSxRQUFRLFlBQVk7QUFBQSxFQUMzRTtBQUVBLFFBQU0sWUFBWSxPQUFPLGtCQUFrQixPQUFPLGdCQUFnQixJQUFJLElBQUssT0FBTyxLQUFLO0FBQ3ZGLFFBQU0scUJBQW1CLFlBQU8sZ0JBQVAsbUJBQW9CLGVBQWMsQ0FBQyxHQUN6RCxPQUFPLENBQUMsTUFBRztBQWhYaEIsUUFBQUE7QUFnWG1CLGFBQUUsY0FBYyxlQUFlLGVBQWNBLE1BQUEsRUFBRSxhQUFGLE9BQUFBLE1BQWM7QUFBQSxHQUFFO0FBRTlFLFFBQU0sVUFBVSxDQUFDLFlBQVk7QUFDM0IsUUFBSTtBQUFFLHFCQUFlLFFBQVEseUJBQXlCLE9BQU87QUFBQSxJQUFHLFNBQVE7QUFBQSxJQUFDO0FBQ3pFLE9BQUcsV0FBVztBQUFBLEVBQ2hCO0FBR0EsUUFBTSxXQUFXLENBQUMsT0FBTztBQUN2QixRQUFJLEdBQUcsV0FBVyxPQUFRLFFBQU8sU0FBUyxTQUFTLEtBQUs7QUFDeEQsV0FBTyxVQUFVLEdBQUc7QUFBQSxFQUN0QjtBQUVBLFNBQ0Usb0NBQUMsU0FBSSxXQUFXLE9BQU8sYUFBYSxnQkFBZ0IsRUFBRSxJQUFJLGNBQVcseUJBQ25FLG9DQUFDLFNBQUksV0FBVSx5QkFDYixvQ0FBQyxTQUFNLFNBQVMsTUFBTSxHQUFHLE1BQU0sR0FBRyxHQUNsQztBQUFBLElBQUM7QUFBQTtBQUFBLE1BQ0MsTUFBSztBQUFBLE1BQ0wsV0FBVTtBQUFBLE1BQ1YsY0FBWSxhQUFhLDhCQUFVO0FBQUEsTUFDbkMsaUJBQWU7QUFBQSxNQUNmLGlCQUFjO0FBQUEsTUFDZCxTQUFTLE1BQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQUE7QUFBQSxJQUN0QyxvQ0FBQyxVQUFLLFdBQVUsbUJBQWtCLGVBQVksUUFBTTtBQUFBLEVBQ3RELEdBQ0Esb0NBQUMsUUFBRyxJQUFHLG9CQUFtQixXQUFVLFlBQVcsTUFBSyxRQUFPLE9BQU8sRUFBQyxXQUFVLFFBQVEsUUFBTyxHQUFHLFNBQVEsRUFBQyxLQUNyRyxNQUFNLElBQUksUUFBTTtBQUNmLFVBQU0sVUFBVSxHQUFHLFdBQVcsVUFBVyxHQUFHLFdBQVcsZUFBZSxnQkFBZ0IsU0FBUztBQUMvRixVQUFNLFVBQVUsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLEdBQUcsR0FBRztBQUNsRCxXQUNFLG9DQUFDLFFBQUcsS0FBSyxHQUFHLEtBQUssT0FBTyxFQUFDLFVBQVMsV0FBVSxHQUFHLFdBQVcsVUFBVSxpQkFBaUIsTUFDbkY7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLE1BQUs7QUFBQSxRQUNMLFdBQVcsWUFBWSxTQUFTLEVBQUUsSUFBSSxXQUFXLEVBQUU7QUFBQSxRQUNuRCxnQkFBYyxTQUFTLEVBQUUsSUFBSSxTQUFTO0FBQUEsUUFDdEMsaUJBQWUsVUFBVSxTQUFTO0FBQUEsUUFDbEM7QUFBQTtBQUFBLE1BQW1CLEdBQUc7QUFBQSxNQUFPLFVBQVUsWUFBTztBQUFBLElBQUcsR0FFbEQsR0FBRyxXQUFXLFVBQ2I7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUFJLFdBQVU7QUFBQSxRQUFXLE1BQUs7QUFBQSxRQUFPLGNBQVc7QUFBQSxRQUMvQyxPQUFPO0FBQUEsVUFDTCxVQUFTO0FBQUEsVUFBWSxLQUFJO0FBQUEsVUFBUSxNQUFLO0FBQUEsVUFBTyxXQUFVO0FBQUEsVUFDdkQsVUFBUztBQUFBLFVBQUssU0FBUTtBQUFBLFVBQ3RCLFlBQVc7QUFBQSxVQUFhLFFBQU87QUFBQSxVQUMvQixXQUFVO0FBQUEsVUFDVixZQUFXO0FBQUEsVUFBVSxTQUFRO0FBQUEsVUFBRyxZQUFXO0FBQUEsVUFDM0MsUUFBTztBQUFBLFFBQ1Q7QUFBQTtBQUFBLE1BQ0Esb0NBQUMsU0FBSSxXQUFVLGNBQWEsT0FBTyxFQUFDLFVBQVMsR0FBRyxlQUFjLFVBQVUsU0FBUSxlQUFjLEtBQUcsdUNBQU87QUFBQSxNQUN4RyxvQ0FBQyxRQUFHLE9BQU8sRUFBQyxXQUFVLFFBQVEsUUFBTyxHQUFHLFNBQVEsRUFBQyxLQUM5QyxhQUFhLElBQUksQ0FBQyxNQUNqQixvQ0FBQyxRQUFHLEtBQUssRUFBRSxPQUNUO0FBQUEsUUFBQztBQUFBO0FBQUEsVUFBTyxNQUFLO0FBQUEsVUFBUyxNQUFLO0FBQUEsVUFDekIsU0FBUyxNQUFNLEdBQUcsRUFBRSxHQUFHO0FBQUEsVUFDdkIsT0FBTztBQUFBLFlBQ0wsU0FBUTtBQUFBLFlBQVMsT0FBTTtBQUFBLFlBQVEsV0FBVTtBQUFBLFlBQ3pDLFNBQVE7QUFBQSxZQUNSLFlBQVc7QUFBQSxZQUFlLE9BQU07QUFBQSxZQUFnQixRQUFPO0FBQUEsWUFBUSxRQUFPO0FBQUEsVUFDeEU7QUFBQSxVQUNBLGNBQWMsQ0FBQyxNQUFNO0FBQUUsY0FBRSxjQUFjLE1BQU0sYUFBYTtBQUFBLFVBQWU7QUFBQSxVQUN6RSxjQUFjLENBQUMsTUFBTTtBQUFFLGNBQUUsY0FBYyxNQUFNLGFBQWE7QUFBQSxVQUFlO0FBQUE7QUFBQSxRQUN6RSxvQ0FBQyxTQUFJLE9BQU8sRUFBQyxVQUFTLElBQUksWUFBVyxJQUFHLEtBQUksRUFBRSxLQUFNO0FBQUEsUUFDcEQsb0NBQUMsU0FBSSxXQUFVLGNBQWEsT0FBTyxFQUFDLFVBQVMsSUFBSSxlQUFjLFVBQVUsV0FBVSxFQUFDLEtBQUksRUFBRSxJQUFLO0FBQUEsTUFDakcsQ0FDRixDQUNELENBQ0g7QUFBQSxJQUNGLEdBSUQsR0FBRyxXQUFXLFVBQ2Isb0NBQUMsUUFBRyxXQUFVLHNCQUFxQixNQUFLLFFBQU8sY0FBVyw2QkFBUSxPQUFPLEVBQUMsV0FBVSxRQUFRLFFBQU8sR0FBRyxTQUFRLEVBQUMsS0FDNUcsYUFBYSxJQUFJLENBQUMsTUFDakIsb0NBQUMsUUFBRyxLQUFLLEVBQUUsT0FDVDtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQU8sTUFBSztBQUFBLFFBQ1gsV0FBVyx5QkFBeUIsVUFBVSxFQUFFLE1BQU0sV0FBVyxFQUFFO0FBQUEsUUFDbkUsZ0JBQWMsVUFBVSxFQUFFLE1BQU0sU0FBUztBQUFBLFFBQ3pDLFNBQVMsTUFBTSxHQUFHLEVBQUUsR0FBRztBQUFBO0FBQUEsTUFBSSxFQUFFO0FBQUEsSUFBTSxDQUN2QyxDQUNELENBQ0gsR0FFRCxHQUFHLFdBQVcsZUFBZSxnQkFBZ0IsU0FBUyxLQUNyRDtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQUksV0FBVTtBQUFBLFFBQVcsTUFBSztBQUFBLFFBQU8sY0FBVztBQUFBLFFBQy9DLE9BQU87QUFBQSxVQUNMLFVBQVM7QUFBQSxVQUFZLEtBQUk7QUFBQSxVQUFRLE1BQUs7QUFBQSxVQUFPLFdBQVU7QUFBQSxVQUN2RCxVQUFTO0FBQUEsVUFBSyxTQUFRO0FBQUEsVUFDdEIsWUFBVztBQUFBLFVBQWEsUUFBTztBQUFBLFVBQy9CLFdBQVU7QUFBQSxVQUNWLFlBQVc7QUFBQSxVQUFVLFNBQVE7QUFBQSxVQUFHLFlBQVc7QUFBQSxVQUMzQyxRQUFPO0FBQUEsUUFDVDtBQUFBO0FBQUEsTUFDQSxvQ0FBQyxTQUFJLFdBQVUsY0FBYSxPQUFPLEVBQUMsVUFBUyxHQUFHLGVBQWMsVUFBVSxTQUFRLGVBQWMsS0FBRyxRQUFNO0FBQUEsTUFDdkcsb0NBQUMsUUFBRyxPQUFPLEVBQUMsV0FBVSxRQUFRLFFBQU8sR0FBRyxTQUFRLEVBQUMsS0FDOUMsZ0JBQWdCLElBQUksQ0FBQyxNQUNwQixvQ0FBQyxRQUFHLEtBQUssRUFBRSxNQUNUO0FBQUEsUUFBQztBQUFBO0FBQUEsVUFBTyxNQUFLO0FBQUEsVUFBUyxNQUFLO0FBQUEsVUFDekIsU0FBUyxNQUFNLFFBQVEsRUFBRSxFQUFFO0FBQUEsVUFDM0IsT0FBTztBQUFBLFlBQ0wsU0FBUTtBQUFBLFlBQVMsT0FBTTtBQUFBLFlBQVEsV0FBVTtBQUFBLFlBQ3pDLFNBQVE7QUFBQSxZQUFZLFVBQVM7QUFBQSxZQUM3QixZQUFXO0FBQUEsWUFBZSxPQUFNO0FBQUEsWUFBZ0IsUUFBTztBQUFBLFlBQVEsUUFBTztBQUFBLFVBQ3hFO0FBQUEsVUFDQSxjQUFjLENBQUMsTUFBTTtBQUFFLGNBQUUsY0FBYyxNQUFNLGFBQWE7QUFBQSxVQUFlO0FBQUEsVUFDekUsY0FBYyxDQUFDLE1BQU07QUFBRSxjQUFFLGNBQWMsTUFBTSxhQUFhO0FBQUEsVUFBZTtBQUFBO0FBQUEsUUFDekUsb0NBQUMsY0FBTSxFQUFFLEtBQU07QUFBQSxNQUNqQixDQUNGLENBQ0QsR0FDRCxvQ0FBQyxRQUFHLE9BQU8sRUFBQyxXQUFVLHlCQUF5QixXQUFVLEdBQUcsWUFBVyxFQUFDLEtBQ3RFO0FBQUEsUUFBQztBQUFBO0FBQUEsVUFBTyxNQUFLO0FBQUEsVUFBUyxNQUFLO0FBQUEsVUFDekIsU0FBUyxNQUFNLEdBQUcsV0FBVztBQUFBLFVBQzdCLE9BQU87QUFBQSxZQUNMLFNBQVE7QUFBQSxZQUFTLE9BQU07QUFBQSxZQUFRLFdBQVU7QUFBQSxZQUN6QyxTQUFRO0FBQUEsWUFBWSxVQUFTO0FBQUEsWUFBSSxlQUFjO0FBQUEsWUFDL0MsWUFBVztBQUFBLFlBQWUsT0FBTTtBQUFBLFlBQW9CLFFBQU87QUFBQSxZQUFRLFFBQU87QUFBQSxZQUMxRSxZQUFXO0FBQUEsVUFDYjtBQUFBO0FBQUEsUUFBRztBQUFBLE1BQU8sQ0FDZCxDQUNGO0FBQUEsSUFDRixDQUVKO0FBQUEsRUFFSixDQUFDLEdBRUQsb0NBQUMsUUFBRyxXQUFVLHNDQUFxQyxlQUFZLFFBQU0sR0FDcEUsT0FDQywwREFDRSxvQ0FBQyxRQUFHLFdBQVUscUJBQ1osb0NBQUMsWUFBTyxNQUFLLFVBQVMsV0FBVSxZQUFXLFNBQVMsTUFBTSxHQUFHLFFBQVEsS0FBRyxnQ0FBSyxDQUMvRSxHQUNDLEtBQUssV0FDSixvQ0FBQyxRQUFHLFdBQVUscUJBQ1osb0NBQUMsWUFBTyxNQUFLLFVBQVMsV0FBVSxZQUFXLFNBQVMsTUFBTSxHQUFHLE9BQU8sS0FBRyxjQUFFLENBQzNFLEdBRUYsb0NBQUMsUUFBRyxXQUFVLHFCQUNaLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsWUFBVyxTQUFTLFlBQVUsMEJBQUksQ0FDcEUsQ0FDRixJQUVBLDBEQUNFLG9DQUFDLFFBQUcsV0FBVSxxQkFDWixvQ0FBQyxZQUFPLE1BQUssVUFBUyxXQUFVLFlBQVcsU0FBUyxNQUFNLEdBQUcsT0FBTyxLQUFHLG9CQUFHLENBQzVFLEdBQ0Esb0NBQUMsUUFBRyxXQUFVLHFCQUNaLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsWUFBVyxTQUFTLE1BQU0sR0FBRyxRQUFRLEtBQUcsMEJBQUksQ0FDOUUsQ0FDRixDQUVKLEdBQ0Esb0NBQUMsU0FBSSxXQUFVLGlCQUNaLE9BQ0MsMERBQ0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFLLFdBQVU7QUFBQSxNQUFPLGNBQVksdUJBQVEsS0FBSyxJQUFJO0FBQUEsTUFDbEQsT0FBTyxFQUFDLFVBQVMsSUFBSSxlQUFjLFVBQVUsT0FBTSxlQUFjO0FBQUE7QUFBQSxJQUFJLEtBQUs7QUFBQSxFQUFLLEdBQ2pGLG9DQUFDLG9CQUFpQixNQUFZLFFBQVEsQ0FBQyxNQUFNO0FBRTNDLFFBQUk7QUFDRixVQUFJLEVBQUUsU0FBUyxhQUFhLEVBQUUsUUFBUTtBQUNwQyx1QkFBZSxRQUFRLHdCQUF3QixPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQy9ELFdBQUcsV0FBVztBQUFHO0FBQUEsTUFDbkI7QUFDQSxVQUFJLEVBQUUsU0FBUyx1QkFBdUIsRUFBRSxTQUFTLG9CQUFvQjtBQUNuRSxZQUFJLEVBQUUsVUFBVyxnQkFBZSxRQUFRLDJCQUEyQixPQUFPLEVBQUUsU0FBUyxDQUFDO0FBQ3RGLFdBQUcsVUFBVTtBQUFHO0FBQUEsTUFDbEI7QUFDQSxVQUFJLEVBQUUsU0FBUyxvQkFBb0IsRUFBRSxTQUFTLGlCQUFpQjtBQUM3RCxZQUFJLEVBQUUsT0FBUSxnQkFBZSxRQUFRLHdCQUF3QixPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQzdFLFdBQUcsTUFBTTtBQUFHO0FBQUEsTUFDZDtBQUNBLFVBQUksT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLFdBQVcsUUFBUSxHQUFHO0FBQzdDLFdBQUcsUUFBUTtBQUFHO0FBQUEsTUFDaEI7QUFFQSxVQUFJLEVBQUUsUUFBUTtBQUNaLHVCQUFlLFFBQVEsd0JBQXdCLE9BQU8sRUFBRSxNQUFNLENBQUM7QUFDL0QsV0FBRyxXQUFXO0FBQUEsTUFDaEI7QUFBQSxJQUNGLFNBQVE7QUFBQSxJQUFDO0FBQUEsRUFDWCxHQUFFLEdBQ0Ysb0NBQUMsWUFBTyxXQUFVLGlCQUFnQixTQUFTLE1BQU0sR0FBRyxRQUFRLEtBQUcsZ0NBQUssR0FDbkUsS0FBSyxXQUNKLG9DQUFDLFlBQU8sV0FBVSxpQkFBZ0IsU0FBUyxNQUFNLEdBQUcsT0FBTyxLQUFHLGNBQUUsR0FFbEUsb0NBQUMsWUFBTyxXQUFVLGlCQUFnQixTQUFTLFlBQVUsMEJBQUksQ0FDM0QsSUFFQSwwREFDRTtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQU8sTUFBSztBQUFBLE1BQVMsV0FBVTtBQUFBLE1BQXFCLFNBQVMsTUFBTSxHQUFHLE9BQU87QUFBQSxNQUM1RSxPQUFPLEVBQUMsVUFBUyxJQUFJLGVBQWMsU0FBUyxPQUFNLGVBQWM7QUFBQTtBQUFBLElBQUc7QUFBQSxFQUFHLEdBQ3hFLG9DQUFDLFlBQU8sV0FBVSxpQkFBZ0IsU0FBUyxNQUFNLEdBQUcsUUFBUSxLQUFHLDBCQUFJLENBQ3JFLENBRUosQ0FDRixDQUNGO0FBRUo7QUFFQSxNQUFNLFNBQVMsQ0FBQyxFQUFFLEdBQUcsTUFBTTtBQTNqQjNCO0FBNGpCRSxRQUFNLE9BQU0sa0JBQU8sc0JBQVAsbUJBQTBCLFFBQTFCLGdDQUFxQyxDQUFDO0FBQ2xELFFBQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQztBQUMvQixRQUFNLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDN0IsUUFBTSxXQUFVLFlBQU8sc0JBQVAsb0NBQWdDLE9BQU87QUFFdkQsUUFBTSxRQUFRLFFBQVEsU0FBUztBQUMvQixRQUFNLFVBQVUsUUFBUSxXQUFXO0FBQ25DLFFBQU0sY0FBYyxRQUFRLGVBQWU7QUFDM0MsUUFBTSxNQUFNLFFBQVEsT0FBTztBQUMzQixRQUFNLFdBQVcsUUFBUSxZQUFZO0FBQ3JDLFFBQU0sWUFBWSxRQUFRLGFBQWE7QUFDdkMsUUFBTSxVQUFVLFFBQVEsV0FBVztBQUNuQyxRQUFNLGVBQWU7QUFBQSxJQUNuQixVQUFVLE9BQU8sUUFBUTtBQUFBLElBQ3pCLFlBQVksT0FBTyxRQUFRO0FBQUEsSUFDM0IsZUFBZSxHQUFHLE9BQU8sUUFBUSxhQUFhO0FBQUEsSUFDOUMsT0FBTyxPQUFPLE9BQU8sUUFBUSxLQUFLO0FBQUEsRUFDcEM7QUFDQSxTQUNFLG9DQUFDLFlBQU8sV0FBVSxVQUFTLGNBQVcseURBQ3BDLG9DQUFDLFNBQUksV0FBVSxlQUNiLG9DQUFDLFNBQUksV0FBVSxpQkFDYixvQ0FBQyxhQUNDLG9DQUFDLFNBQU0sU0FBUyxNQUFNLEdBQUcsTUFBTSxHQUFFLEdBQ2pDLG9DQUFDLE9BQUUsV0FBVSxzQkFBcUIsT0FBTztBQUFBLElBQ3ZDLFdBQVU7QUFBQSxJQUNWLFVBQVUsT0FBTyxZQUFZO0FBQUEsSUFDN0IsWUFBWSxPQUFPLFlBQVk7QUFBQSxJQUMvQixZQUFZLE9BQU8sWUFBWTtBQUFBLElBQy9CLE9BQU8sT0FBTyxPQUFPLFlBQVksS0FBSztBQUFBLElBQ3RDLFVBQVUsT0FBTyxZQUFZO0FBQUEsRUFDL0IsS0FDRyxPQUFPLGVBQWUsNllBQ3pCLENBQ0YsR0FDQSxvQ0FBQyxTQUFJLGNBQVcsaURBQ2Qsb0NBQUMsUUFBRyxJQUFHLGNBQWEsT0FBTyxnQkFBZSxPQUFPLGtCQUFrQixvQkFBTSxHQUN6RSxvQ0FBQyxRQUFHLG1CQUFnQixnQkFDbEIsb0NBQUMsWUFBRyxvQ0FBQyxZQUFPLE1BQUssVUFBUyxTQUFTLE1BQU0sR0FBRyxRQUFRLEtBQUcsdUNBQU8sQ0FBUyxHQUN2RSxvQ0FBQyxZQUFHLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFNBQVMsTUFBTSxHQUFHLE1BQU0sS0FBRyx1Q0FBTyxDQUFTLEdBRXJFLG9DQUFDLFlBQUcsb0NBQUMsWUFBTyxNQUFLLFVBQVMsU0FBUyxNQUFNLEdBQUcsV0FBVyxLQUFHLDBCQUFJLENBQVMsQ0FDekUsQ0FDRixHQUNBLG9DQUFDLFNBQUksY0FBVywyQ0FDZCxvQ0FBQyxRQUFHLElBQUcsV0FBVSxPQUFPLGdCQUFlLE9BQU8sZUFBZSxjQUFLLEdBQ2xFLG9DQUFDLFFBQUcsbUJBQWdCLGFBQ2xCLG9DQUFDLFlBQUcsb0NBQUMsWUFBTyxNQUFLLFVBQVMsU0FBUyxNQUFNLEdBQUcsTUFBTSxLQUFHLDJCQUFLLENBQVMsR0FDbkUsb0NBQUMsWUFBRyxvQ0FBQyxZQUFPLE1BQUssVUFBUyxTQUFTLE1BQU0sR0FBRyxXQUFXLEtBQUcsMEJBQUksQ0FBUyxHQUN2RSxvQ0FBQyxZQUFHLG9DQUFDLFlBQU8sTUFBSyxVQUFTLFNBQVMsTUFBTSxHQUFHLEtBQUssS0FBRyx3Q0FBUSxDQUFTLEdBQ3JFLG9DQUFDLFlBQUcsb0NBQUMsWUFBTyxNQUFLLFVBQVMsU0FBUyxNQUFNLEdBQUcsT0FBTyxLQUFHLDBCQUFJLENBQVMsR0FDbkUsb0NBQUMsWUFBRyxvQ0FBQyxZQUFPLE1BQUssVUFBUyxTQUFTLE1BQU0sR0FBRyxTQUFTLEtBQUcsbURBQVMsQ0FBUyxDQUM1RSxDQUNGLEdBQ0Esb0NBQUMsYUFBUSxPQUFPLEVBQUMsV0FBVSxTQUFRLEtBQ2pDLG9DQUFDLFFBQUcsSUFBRyxjQUFhLE9BQU8sZ0JBQWUsT0FBTyxrQkFBa0IsY0FBSyxHQUN4RSxvQ0FBQyxRQUFHLG1CQUFnQixnQkFDakIsU0FBUyxvQ0FBQyxZQUFHLG9DQUFDLE9BQUUsTUFBTSxVQUFVLEtBQUssTUFBSyxLQUFNLENBQUksR0FDcEQsV0FBVyxvQ0FBQyxZQUFHLG9DQUFDLGNBQU0sT0FBUSxDQUFPLENBQ3hDLENBQ0YsQ0FDRixJQUVFLGVBQWUsWUFBWSxRQUMzQixvQ0FBQyxTQUFJLFdBQVUsY0FBYSxPQUFPO0FBQUEsSUFDakMsV0FBVTtBQUFBLElBQUksWUFBVztBQUFBLElBQUksV0FBVTtBQUFBLElBQ3ZDLFVBQVM7QUFBQSxJQUFJLFlBQVc7QUFBQSxJQUFNLE9BQU07QUFBQSxJQUNwQyxZQUFXO0FBQUEsSUFBb0IsZUFBYztBQUFBLElBQzdDLFNBQVE7QUFBQSxJQUFRLEtBQUk7QUFBQSxJQUFZLFVBQVM7QUFBQSxFQUMzQyxLQUNHLGVBQWUsb0NBQUMsY0FBSyxvQ0FBQyxZQUFPLE9BQU8sRUFBQyxPQUFNLGVBQWMsS0FBSSxXQUFZLENBQVMsR0FDbEYsT0FBTyxvQ0FBQyxjQUFLLHVCQUFLLEdBQUksR0FDdEIsWUFBWSxvQ0FBQyxjQUFLLCtDQUFTLFFBQVMsR0FDcEMsYUFBYSxvQ0FBQyxjQUFLLHlDQUFRLFNBQVUsR0FDckMsV0FBVyxvQ0FBQyxjQUFLLGlCQUFJLE9BQVEsQ0FDaEMsR0FFRixvQ0FBQyxTQUFJLFdBQVUsaUJBQWdCLE9BQU8sRUFBQyxXQUFVLEdBQUUsS0FDakQsb0NBQUMsY0FBTSxPQUFPLGFBQWEseUVBQThDLEdBQ3pFLG9DQUFDLFVBQUssV0FBVSxjQUFhLE9BQU8sRUFBQyxVQUFTLElBQUksZUFBYyxTQUFRLEtBQUcsT0FDdkUsWUFBTyxpQkFBUCxtQkFBcUIsWUFBVyxTQUFRLFlBQUksWUFBTyxpQkFBUCxtQkFBcUIsVUFBUyxRQUM5RSxHQUNBLG9DQUFDLGlCQUFXLEdBQ1osb0NBQUMsVUFBSyxPQUFPO0FBQUEsSUFDWCxVQUFVLE9BQU8sVUFBVTtBQUFBLElBQzNCLFlBQVksT0FBTyxVQUFVO0FBQUEsSUFDN0IsZUFBZSxHQUFHLE9BQU8sVUFBVSxhQUFhO0FBQUEsSUFDaEQsT0FBTyxPQUFPLE9BQU8sVUFBVSxLQUFLO0FBQUEsSUFDcEMsZUFBZSxPQUFPLFVBQVUsaUJBQWlCO0FBQUEsRUFDbkQsS0FBSSxPQUFPLGFBQWEsOERBQThCLENBQ3hELENBQ0YsQ0FDRjtBQUVKO0FBR0EsTUFBTSxjQUFjLE1BQU07QUFDeEIsUUFBTSxDQUFDLE1BQU0sT0FBTyxJQUFJLE1BQU0sU0FBUyxNQUFHO0FBOXBCNUM7QUE4cEJnRCwrQkFBTyxlQUFQLG1CQUFtQixRQUFuQixnQ0FBOEI7QUFBQSxHQUFPO0FBQ25GLFFBQU0sVUFBVSxNQUFNO0FBQ3BCLFVBQU0sV0FBVyxNQUFHO0FBaHFCeEI7QUFncUIyQix1QkFBUSxrQkFBTyxlQUFQLG1CQUFtQixRQUFuQixnQ0FBOEIsTUFBTTtBQUFBO0FBQ25FLFdBQU8saUJBQWlCLHFCQUFxQixRQUFRO0FBQ3JELFdBQU8sTUFBTSxPQUFPLG9CQUFvQixxQkFBcUIsUUFBUTtBQUFBLEVBQ3ZFLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsTUFBSSxDQUFDLE9BQU8sV0FBWSxRQUFPO0FBQy9CLFFBQU0sT0FBTyxPQUFPLFdBQVcsTUFBTSxLQUFLLE9BQU8sVUFBVTtBQUMzRCxRQUFNLE9BQU8sU0FBUyxTQUFTLGNBQU8sU0FBUyxVQUFVLFdBQU07QUFDL0QsUUFBTSxRQUFRLFNBQVMsU0FBUyxTQUFTLFNBQVMsVUFBVSxVQUFVO0FBQ3RFLFNBQ0Usb0NBQUMsWUFBTyxNQUFLLFVBQVMsV0FBVSxnQkFBZSxTQUFTLE1BQU0sS0FBSyxHQUFHLGNBQVksaURBQWMsS0FBSyxJQUFJLE9BQU0sb0VBQzdHLG9DQUFDLFVBQUssZUFBWSxVQUFRLElBQUssR0FBTyxvQ0FBQyxjQUFNLEtBQU0sQ0FDckQ7QUFFSjtBQUVBLE1BQU0sV0FBVyxDQUFDLEVBQUUsU0FBUyxNQUMzQixvQ0FBQyxTQUFJLFdBQVUsWUFBVyxPQUFPLEVBQUMsUUFBTyxTQUFRLEtBQy9DLG9DQUFDLFVBQUssT0FBTyxFQUFDLFlBQVcscUJBQXFCLFVBQVMsSUFBSSxlQUFjLFNBQVMsT0FBTSxjQUFhLEtBQ2xHLFlBQVksUUFDZixDQUNGO0FBSUYsTUFBTSxjQUFjLENBQUMsRUFBRSxTQUFTLE9BQU8sVUFBVSxRQUFRLFFBQVEsRUFBRSxNQUFNO0FBQ3ZFLFFBQU0sSUFBSSxJQUFJLEtBQUs7QUFDbkIsU0FDRSxvQ0FBQyxTQUFJLFdBQVUsa0JBQ2Isb0NBQUMsYUFDRSxXQUFXLG9DQUFDLFNBQUksV0FBVSxtQkFBa0IsZUFBWSxVQUFRLE9BQVEsR0FDekUsb0NBQUMsS0FBRSxXQUFVLG1CQUFpQixLQUFNLEdBQ25DLFlBQVksb0NBQUMsT0FBRSxXQUFVLHNCQUFvQixRQUFTLENBQ3pELEdBQ0MsTUFDSDtBQUVKO0FBRUEsTUFBTSxTQUFTLENBQUMsRUFBRSxRQUFRLFdBQVcsUUFBUSxNQUFNO0FBQ2pELE1BQUksQ0FBQyxRQUFTLFFBQU87QUFDckIsUUFBTSxNQUFNLENBQUMsR0FBRyxNQUFNLFVBQVUsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JELFNBQ0Usb0NBQUMsU0FBSSxXQUFVLFlBQ2Isb0NBQUMsWUFBRyxRQUFNLEdBQ1Ysb0NBQUMsU0FBSSxXQUFVLGdCQUNiLG9DQUFDLFNBQUksV0FBVSxrQkFBZSxpQ0FBTSxHQUNwQyxvQ0FBQyxTQUFJLFdBQVUsb0JBQ1osQ0FBQyxXQUFXLFVBQVUsUUFBUSxFQUFFLElBQUksT0FDbkM7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFPLEtBQUs7QUFBQSxNQUFHLFdBQVcsT0FBTyxjQUFjLElBQUksT0FBTztBQUFBLE1BQ3pELFNBQVMsTUFBTSxJQUFJLGFBQWEsQ0FBQztBQUFBO0FBQUEsSUFDaEMsTUFBTSxZQUFZLFdBQU0sTUFBTSxXQUFXLGlCQUFPO0FBQUEsRUFDbkQsQ0FDRCxDQUNILENBQ0YsR0FDQSxvQ0FBQyxTQUFJLFdBQVUsZ0JBQ2Isb0NBQUMsU0FBSSxXQUFVLGtCQUFlLG1DQUFTLE9BQU8sVUFBVSxRQUFRLENBQUMsQ0FBRSxHQUNuRTtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQU0sTUFBSztBQUFBLE1BQVEsV0FBVTtBQUFBLE1BQzVCLEtBQUk7QUFBQSxNQUFNLEtBQUk7QUFBQSxNQUFNLE1BQUs7QUFBQSxNQUN6QixPQUFPLE9BQU87QUFBQSxNQUNkLFVBQVUsT0FBSyxJQUFJLGFBQWEsV0FBVyxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQUE7QUFBQSxFQUFFLENBQ2hFLEdBQ0Esb0NBQUMsU0FBSSxXQUFVLGdCQUNiLG9DQUFDLFNBQUksV0FBVSxrQkFBZSw2Q0FBUSxHQUN0QyxvQ0FBQyxTQUFJLFdBQVUsb0JBQ1osQ0FBQyxVQUFVLFNBQVMsV0FBVyxFQUFFLElBQUksT0FDcEM7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFPLEtBQUs7QUFBQSxNQUFHLFdBQVcsT0FBTyxlQUFlLElBQUksT0FBTztBQUFBLE1BQzFELFNBQVMsTUFBTSxJQUFJLGNBQWMsQ0FBQztBQUFBO0FBQUEsSUFDakMsTUFBTSxXQUFXLGlCQUFPLE1BQU0sVUFBVSxpQkFBTztBQUFBLEVBQ2xELENBQ0QsQ0FDSCxDQUNGLEdBQ0Esb0NBQUMsU0FBSSxXQUFVLGdCQUNiLG9DQUFDLFNBQUksV0FBVSxrQkFBZSwwQkFBSSxHQUNsQyxvQ0FBQyxTQUFJLFdBQVUsb0JBQ2I7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFPLFdBQVcsT0FBTyxjQUFjLE9BQU87QUFBQSxNQUM3QyxTQUFTLE1BQU0sSUFBSSxlQUFlLENBQUMsT0FBTyxXQUFXO0FBQUE7QUFBQSxJQUNwRCxPQUFPLGNBQWMsT0FBTztBQUFBLEVBQy9CLENBQ0YsQ0FDRixDQUNGO0FBRUo7QUFLQSxNQUFNLGdCQUFnQixNQUFNO0FBQzFCLFFBQU0sTUFBTTtBQUNaLFFBQU0sQ0FBQyxVQUFVLFdBQVcsSUFBSSxNQUFNLFNBQVMsTUFBTTtBQUNuRCxRQUFJO0FBQUUsWUFBTSxNQUFNLGFBQWEsUUFBUSxHQUFHO0FBQUcsYUFBTyxNQUFNLEtBQUssTUFBTSxHQUFHLElBQUk7QUFBQSxJQUFNLFNBQVE7QUFBRSxhQUFPO0FBQUEsSUFBTTtBQUFBLEVBQzNHLENBQUM7QUFDRCxRQUFNLENBQUMsU0FBUyxVQUFVLElBQUksTUFBTSxTQUFTLEtBQUs7QUFDbEQsUUFBTSxDQUFDLFdBQVcsWUFBWSxJQUFJLE1BQU0sU0FBUyxJQUFJO0FBQ3JELFFBQU0sQ0FBQyxXQUFXLFlBQVksSUFBSSxNQUFNLFNBQVMsS0FBSztBQUV0RCxRQUFNLFVBQVUsQ0FBQyxTQUFTO0FBQ3hCLFFBQUk7QUFBRSxtQkFBYSxRQUFRLEtBQUssS0FBSyxVQUFVLElBQUksQ0FBQztBQUFBLElBQUcsU0FBUTtBQUFBLElBQUM7QUFDaEUsZ0JBQVksSUFBSTtBQUNoQixRQUFJO0FBQUUsYUFBTyxjQUFjLElBQUksWUFBWSx1QkFBdUIsRUFBRSxRQUFRLEtBQUssQ0FBQyxDQUFDO0FBQUEsSUFBRyxTQUFRO0FBQUEsSUFBQztBQUFBLEVBQ2pHO0FBRUEsUUFBTSxZQUFZLE1BQU0sUUFBUSxFQUFFLFdBQVcsTUFBTSxXQUFXLE1BQU0sV0FBVyxNQUFNLEtBQUksb0JBQUksS0FBSyxHQUFFLFlBQVksRUFBRSxDQUFDO0FBQ25ILFFBQU0sWUFBWSxNQUFNLFFBQVEsRUFBRSxXQUFXLE1BQU0sV0FBVyxPQUFPLFdBQVcsT0FBTyxLQUFJLG9CQUFJLEtBQUssR0FBRSxZQUFZLEVBQUUsQ0FBQztBQUNySCxRQUFNLGFBQWEsTUFBTSxRQUFRLEVBQUUsV0FBVyxNQUFNLFdBQVcsQ0FBQyxDQUFDLFdBQVcsV0FBVyxDQUFDLENBQUMsV0FBVyxLQUFJLG9CQUFJLEtBQUssR0FBRSxZQUFZLEVBQUUsQ0FBQztBQUVsSSxNQUFJLFNBQVUsUUFBTztBQUVyQixTQUNFO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFBSSxNQUFLO0FBQUEsTUFBUyxjQUFXO0FBQUEsTUFBUSxtQkFBZ0I7QUFBQSxNQUNwRCxPQUFPO0FBQUEsUUFDTCxVQUFVO0FBQUEsUUFBUyxNQUFNO0FBQUEsUUFBSSxPQUFPO0FBQUEsUUFBSSxRQUFRO0FBQUEsUUFDaEQsVUFBVTtBQUFBLFFBQUssUUFBUTtBQUFBLFFBQVUsUUFBUTtBQUFBLFFBQ3pDLFlBQVk7QUFBQSxRQUFlLFFBQVE7QUFBQSxRQUNuQyxXQUFXO0FBQUEsUUFDWCxTQUFTO0FBQUEsUUFBYSxjQUFjO0FBQUEsTUFDdEM7QUFBQTtBQUFBLElBQ0Esb0NBQUMsUUFBRyxJQUFHLHVCQUFzQixXQUFVLFlBQVcsT0FBTyxFQUFFLFVBQVUsSUFBSSxjQUFjLEVBQUUsS0FBRyx3Q0FBUTtBQUFBLElBQ3BHLG9DQUFDLE9BQUUsV0FBVSxPQUFNLE9BQU8sRUFBRSxVQUFVLElBQUksWUFBWSxLQUFLLGNBQWMsR0FBRyxLQUFHLHNGQUM1RCxvQ0FBQyxZQUFPLFdBQVUsVUFBTywyQkFBSyxHQUFTLDhEQUN4RCxvQ0FBQyxZQUFPLFdBQVUsVUFBTyw0QkFBTSxHQUFTLFFBQUMsb0NBQUMsWUFBTyxXQUFVLFVBQU8saUNBQU0sR0FBUywySkFFbkY7QUFBQSxJQUNDLFdBQ0Msb0NBQUMsU0FBSSxPQUFPLEVBQUUsY0FBYyxJQUFJLFlBQVksSUFBSSxXQUFXLHdCQUF3QixLQUNqRixvQ0FBQyxjQUFTLE9BQU8sRUFBRSxRQUFRLFFBQVEsU0FBUyxHQUFHLFFBQVEsRUFBRSxLQUN2RCxvQ0FBQyxZQUFPLFdBQVUsYUFBVSw4Q0FBUyxHQUNyQyxvQ0FBQyxTQUFJLE9BQU8sRUFBRSxTQUFTLFFBQVEsS0FBSyxHQUFHLEtBQ3JDLG9DQUFDLFdBQU0sT0FBTyxFQUFFLFNBQVMsUUFBUSxLQUFLLElBQUksWUFBWSxjQUFjLFNBQVMsSUFBSSxLQUMvRSxvQ0FBQyxXQUFNLE1BQUssWUFBVyxTQUFPLE1BQUMsVUFBUSxNQUFDLGNBQVcseURBQWUsR0FDbEUsb0NBQUMsY0FDQyxvQ0FBQyxZQUFPLE9BQU8sRUFBRSxVQUFVLEdBQUcsS0FBRyxjQUFFLEdBQ25DLG9DQUFDLFVBQUssV0FBVSxPQUFNLE9BQU8sRUFBRSxVQUFVLElBQUksU0FBUyxRQUFRLEtBQUcsc0lBQWdDLENBQ25HLENBQ0YsR0FDQSxvQ0FBQyxXQUFNLE9BQU8sRUFBRSxTQUFTLFFBQVEsS0FBSyxJQUFJLFlBQVksYUFBYSxLQUNqRTtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQU0sTUFBSztBQUFBLFFBQVcsU0FBUztBQUFBLFFBQVcsVUFBVSxDQUFDLE1BQU0sYUFBYSxFQUFFLE9BQU8sT0FBTztBQUFBLFFBQ3ZGLGNBQVc7QUFBQTtBQUFBLElBQVUsR0FDdkIsb0NBQUMsY0FDQyxvQ0FBQyxZQUFPLE9BQU8sRUFBRSxVQUFVLEdBQUcsS0FBRyxjQUFFLEdBQ25DLG9DQUFDLFVBQUssV0FBVSxPQUFNLE9BQU8sRUFBRSxVQUFVLElBQUksU0FBUyxRQUFRLEtBQUcsZ0lBQTRCLENBQy9GLENBQ0YsR0FDQSxvQ0FBQyxXQUFNLE9BQU8sRUFBRSxTQUFTLFFBQVEsS0FBSyxJQUFJLFlBQVksYUFBYSxLQUNqRTtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQU0sTUFBSztBQUFBLFFBQVcsU0FBUztBQUFBLFFBQVcsVUFBVSxDQUFDLE1BQU0sYUFBYSxFQUFFLE9BQU8sT0FBTztBQUFBLFFBQ3ZGLGNBQVc7QUFBQTtBQUFBLElBQVcsR0FDeEIsb0NBQUMsY0FDQyxvQ0FBQyxZQUFPLE9BQU8sRUFBRSxVQUFVLEdBQUcsS0FBRyxvQkFBRyxHQUNwQyxvQ0FBQyxVQUFLLFdBQVUsT0FBTSxPQUFPLEVBQUUsVUFBVSxJQUFJLFNBQVMsUUFBUSxLQUFHLHVIQUEyQixDQUM5RixDQUNGLENBQ0YsQ0FDRixDQUNGO0FBQUEsSUFFRixvQ0FBQyxTQUFJLE9BQU8sRUFBRSxTQUFTLFFBQVEsS0FBSyxHQUFHLFVBQVUsUUFBUSxnQkFBZ0IsV0FBVyxLQUNsRjtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQU8sTUFBSztBQUFBLFFBQVMsV0FBVTtBQUFBLFFBQWdCLFNBQVMsTUFBTSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFBQSxRQUNqRixpQkFBZTtBQUFBO0FBQUEsTUFDZCxVQUFVLHVCQUFRO0FBQUEsSUFDckIsR0FDQSxvQ0FBQyxZQUFPLE1BQUssVUFBUyxXQUFVLGlCQUFnQixTQUFTLGFBQVcsMkJBQUssR0FDeEUsVUFDRyxvQ0FBQyxZQUFPLE1BQUssVUFBUyxXQUFVLDBCQUF5QixTQUFTLGNBQVksMkJBQUssSUFDbkYsb0NBQUMsWUFBTyxNQUFLLFVBQVMsV0FBVSwwQkFBeUIsU0FBUyxhQUFXLDJCQUFLLENBQ3hGO0FBQUEsRUFDRjtBQUVKO0FBSUEsTUFBTSxtQkFBbUIsQ0FBQyxFQUFFLGNBQWMsU0FBUyxPQUFPLFdBQVcsR0FBRyxNQUN0RSxvQ0FBQyxTQUFJLFdBQVUsZUFBYyxPQUFPO0FBQUEsRUFDbEM7QUFBQSxFQUFhLFVBQVU7QUFBQSxFQUN2QixTQUFTO0FBQUEsRUFBUSxZQUFZO0FBQUEsRUFDN0IsWUFBWTtBQUFBLEVBQ1osUUFBUTtBQUNWLEtBQ0Usb0NBQUMsU0FBSSxPQUFPLEVBQUUsU0FBUyxLQUFLLFNBQVMsUUFBUSxZQUFZLFVBQVUsS0FBSyxHQUFHLEtBQ3pFLG9DQUFDLGlCQUFjLE1BQU0sVUFBUyxHQUM3QixTQUNDLG9DQUFDLFVBQUssV0FBVSxjQUFhLE9BQU8sRUFBRSxVQUFVLElBQUksZUFBZSxTQUFTLEtBQ3pFLEtBQ0gsQ0FFSixDQUNGO0FBR0YsT0FBTyxPQUFPLFFBQVEsRUFBRSxPQUFPLEtBQUssUUFBUSxVQUFVLGFBQWEsUUFBUSxrQkFBa0Isa0JBQWtCLGFBQWEsZUFBZSxrQkFBa0IsY0FBYyxDQUFDOyIsCiAgIm5hbWVzIjogWyJfYSJdCn0K

})();

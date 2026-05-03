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
  } }, footer.description || "\uBC45\uAE30\uD0C0\uACE0 \uB178\uC790. \uBC45\uAE30\uB178\uC790\uB294 \uD55C\uAD6D\uC758 \uC5ED\uC0AC\xB7\uBB38\uD654\xB7\uC790\uC5F0\uC744 \uC9C1\uC811 \uAC77\uACE0 \uB290\uB07C\uBA70 \uB098\uB204\uB294 \uC5EC\uD589 \uCEE4\uBBA4\uB2C8\uD2F0\uC785\uB2C8\uB2E4. \uAD81\uAD90 \uB2F5\uC0AC\uBD80\uD130 \uC9C0\uC5ED \uC5EC\uD589\uAE4C\uC9C0, \uD568\uAED8 \uB9CC\uB4E4\uC5B4\uAC00\uB294 \uC5EC\uD589.")), /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uCF58\uD150\uCE20 \uBC14\uB85C\uAC00\uAE30" }, /* @__PURE__ */ React.createElement("h4", { id: "ft-content", style: headingStyle }, footer.headingContent || "\uCF58\uD150\uCE20"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-content" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("column") }, "\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("tour") }, "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("book") }, "\u300E\uC655\uC758\uAE38\u300F")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("community") }, "\uCEE4\uBBA4\uB2C8\uD2F0")))), /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uC815\uBCF4 \uBC14\uB85C\uAC00\uAE30" }, /* @__PURE__ */ React.createElement("h4", { id: "ft-info", style: headingStyle }, footer.headingInfo || "\uC815\uBCF4"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-info" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("home") }, "\uAC15\uC5F0 \uC77C\uC815")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("community") }, "\uACF5\uC9C0\uC0AC\uD56D")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("faq") }, "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("terms") }, "\uC774\uC6A9\uC57D\uAD00")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("privacy") }, "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68")))), /* @__PURE__ */ React.createElement("address", { style: { fontStyle: "normal" } }, /* @__PURE__ */ React.createElement("h4", { id: "ft-contact", style: headingStyle }, footer.headingContact || "\uC5F0\uB77D"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-contact" }, email && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: `mailto:${email}` }, email)), address && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("span", null, address))))), (companyName || bizRegNo || ceo) && /* @__PURE__ */ React.createElement("div", { className: "footer-biz", style: {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29tcG9uZW50cy9TaGVsbC5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1QUNGNVx1RDFCNSBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjg6IE5hdiwgRm9vdGVyLCBUd2Vha3MsIEJyYW5kLCBBdXRob3JHcmFkZUJhZGdlLCBOb3RpZmljYXRpb25CZWxsLCBTY3JvbGxUb1RvcFxuXG4vLyA9PT0gXHVCQUE4XHVCMkVDIFx1QUMwMFx1QjREQyBcdUQ2QzUgKHYwMC4wNjcpID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRVNDIFx1RDBBNCArIFx1QzY3OFx1QkQ4MCBcdUQwNzRcdUI5QUQoYmFja2Ryb3ApICsgXHVCRTBDXHVCNzdDXHVDNkIwXHVDODAwIFx1QjRBNFx1Qjg1Q1x1QUMwMFx1QUUzMCBcdUMyREMgXHVCQUE4XHVCMkVDXHVDNzQ0IFx1QjJFQlx1QUUzMCBcdUM4MDRcdUM1RDAgZGlydHkgXHVDMEMxXHVEMERDXHVCQTc0IFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QzVEMFx1QUM4QyBjb25maXJtLlxuLy8gXHVDMEFDXHVDNkE5XHVCQzk1OlxuLy8gICBjb25zdCB7IG9uQmFja2Ryb3BDbGljayB9ID0gdXNlTW9kYWxHdWFyZCh7IG9wZW4sIGRpcnR5LCBvbkNsb3NlLCBvblNhdmVEcmFmdCB9KTtcbi8vICAgPGRpdiBvbkNsaWNrPXtvbkJhY2tkcm9wQ2xpY2t9Pi4uLjwvZGl2PlxuLy8gb25TYXZlRHJhZnQgXHVBQzAwIFx1Qzc4OFx1QUNFMCBkaXJ0eSBcdUJBNzQgcHJvbXB0IFx1MjAxNCBcdUM4MDBcdUM3QTUgLyBcdUJDODRcdUI5QUNcdUFFMzAgLyBcdUNERThcdUMxOEMuXG53aW5kb3cudXNlTW9kYWxHdWFyZCA9IGZ1bmN0aW9uIHVzZU1vZGFsR3VhcmQoeyBvcGVuLCBkaXJ0eSwgb25DbG9zZSwgb25TYXZlRHJhZnQsIGxhYmVsIH0pIHtcbiAgY29uc3QgcHJvbXB0TmFtZSA9IGxhYmVsIHx8ICdcdUM3OTFcdUMxMzEgXHVDOTExXHVDNzc4IFx1QjBCNFx1QzZBOSc7XG4gIC8vIHYwMC4xMjcgXHUyMDE0IGhhbmRsZUF0dGVtcHRDbG9zZSBcdUI5N0MgcmVmIFx1Qjg1QyBcdUM1NDhcdUM4MTVcdUQ2NTQuIFx1Qzc3NFx1QzgwNFx1QzVENCBkaXJ0eS9vbkNsb3NlL29uU2F2ZURyYWZ0IFx1QUMwMCBcdUJEODBcdUJBQThcbiAgLy8gcmUtcmVuZGVyIFx1QjlDOFx1QjJFNCBcdUMwQzggcmVmIFx1MjE5MiBoYW5kbGVBdHRlbXB0Q2xvc2UgXHVDMEM4IHJlZiBcdTIxOTIgdXNlRWZmZWN0IFx1Qzc1OCBkZXBzIFx1QkNDMFx1QUNCRCBcdTIxOTIgY2xlYW51cCBcdUMyRTRcdUQ1ODlcbiAgLy8gXHUyMTkyIGhpc3RvcnkuYmFjaygpIFx1RDYzOFx1Q0Q5QyBcdTIxOTIgcG9wc3RhdGUgXHVCQzFDXHVDMEREIFx1MjE5MiBtb2RhbCBcdUIyRUJcdUQ3OTguIChcdUJBQThcdUIyRUNcdUM3NzQgXHVCNUI0XHVCMkU0IFx1Qzk4OVx1QzJEQyBcdUMwQUNcdUI3N0NcdUM5QzBcdUIyOTQgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QkNGNFx1QUNFMClcbiAgLy8gcmVmIFx1RDMyOFx1RDEzNFx1QzczQ1x1Qjg1QyB1c2VFZmZlY3QgXHVCMjk0IFtvcGVuXSBcdUI5Q0MgXHVDNzU4XHVDODc0LCBoYW5kbGVBdHRlbXB0Q2xvc2UgXHVCMjk0IFx1RDU2RFx1QzBDMSBcdUNENUNcdUMyRTAgXHVDMEMxXHVEMERDIFx1QzBBQ1x1QzZBOS5cbiAgY29uc3Qgc3RhdGVSZWYgPSBSZWFjdC51c2VSZWYoeyBkaXJ0eSwgb25DbG9zZSwgb25TYXZlRHJhZnQsIHByb21wdE5hbWUgfSk7XG4gIHN0YXRlUmVmLmN1cnJlbnQgPSB7IGRpcnR5LCBvbkNsb3NlLCBvblNhdmVEcmFmdCwgcHJvbXB0TmFtZSB9O1xuXG4gIGNvbnN0IGhhbmRsZUF0dGVtcHRDbG9zZSA9IFJlYWN0LnVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCBzID0gc3RhdGVSZWYuY3VycmVudDtcbiAgICBpZiAoIXMuZGlydHkpIHsgcy5vbkNsb3NlPy4oKTsgcmV0dXJuOyB9XG4gICAgaWYgKHMub25TYXZlRHJhZnQpIHtcbiAgICAgIGNvbnN0IHllcyA9IHdpbmRvdy5jb25maXJtKGAke3MucHJvbXB0TmFtZX1cdUM3NzQoXHVBQzAwKSBcdUM4MDBcdUM3QTVcdUI0MThcdUM5QzAgXHVDNTRBXHVDNTU4XHVDMkI1XHVCMkM4XHVCMkU0Llxcblx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNSBcdUQ1NThcdUMyRENcdUFDQTBcdUM1QjRcdUM2OTQ/XFxuXFxuW1x1RDY1NVx1Qzc3OF0gPSBcdUM3ODRcdUMyRENcdUM4MDBcdUM3QTUgXHVENkM0IFx1QjJFQlx1QUUzMFxcbltcdUNERThcdUMxOENdID0gXHVBREY4XHVCMEU1IFx1QjJFQlx1QUUzMCAoXHVCQ0MwXHVBQ0JEIFx1QjBCNFx1QzZBOSBcdUJDODRcdUI5QkMpYCk7XG4gICAgICBpZiAoeWVzKSB7IHRyeSB7IHMub25TYXZlRHJhZnQoKTsgfSBjYXRjaCB7fSB9XG4gICAgICBzLm9uQ2xvc2U/LigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBvayA9IHdpbmRvdy5jb25maXJtKGAke3MucHJvbXB0TmFtZX1cdUM3NzQoXHVBQzAwKSBcdUM4MDBcdUM3QTVcdUI0MThcdUM5QzAgXHVDNTRBXHVDNTU4XHVDMkI1XHVCMkM4XHVCMkU0LiBcdUM4MTVcdUI5RDAgXHVCMkVCXHVDNzNDXHVDMkRDXHVBQ0EwXHVDNUI0XHVDNjk0P2ApO1xuICAgICAgaWYgKG9rKSBzLm9uQ2xvc2U/LigpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvcGVuKSByZXR1cm47XG4gICAgY29uc3Qgb25LZXkgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyB8fCBlLmtleSA9PT0gJ0VzYycpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBoYW5kbGVBdHRlbXB0Q2xvc2UoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgIGNvbnN0IHByZXZPdmVyZmxvdyA9IGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3c7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIGxldCBwdXNoZWQgPSBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgYmduak1vZGFsOiB0cnVlIH0sICcnKTtcbiAgICAgIHB1c2hlZCA9IHRydWU7XG4gICAgfSBjYXRjaCB7fVxuICAgIGNvbnN0IG9uUG9wID0gKCkgPT4geyBoYW5kbGVBdHRlbXB0Q2xvc2UoKTsgfTtcbiAgICBpZiAocHVzaGVkKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvblBvcCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IHByZXZPdmVyZmxvdztcbiAgICAgIGlmIChwdXNoZWQpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25Qb3ApO1xuICAgICAgICB0cnkgeyBpZiAod2luZG93Lmhpc3Rvcnkuc3RhdGU/LmJnbmpNb2RhbCkgd2luZG93Lmhpc3RvcnkuYmFjaygpOyB9IGNhdGNoIHt9XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW29wZW4sIGhhbmRsZUF0dGVtcHRDbG9zZV0pO1xuXG4gIGNvbnN0IG9uQmFja2Ryb3BDbGljayA9IFJlYWN0LnVzZUNhbGxiYWNrKChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQpIGhhbmRsZUF0dGVtcHRDbG9zZSgpO1xuICB9LCBbaGFuZGxlQXR0ZW1wdENsb3NlXSk7XG5cbiAgcmV0dXJuIHsgb25CYWNrZHJvcENsaWNrLCBoYW5kbGVBdHRlbXB0Q2xvc2UgfTtcbn07XG5cbi8vIFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUM2QjBcdUQ1NThcdUIyRTggJ1x1QjlFOCBcdUM3MDRcdUI4NUMnIFx1RDUwQ1x1Qjg1Q1x1RDMwNSBcdUJDODRcdUQyQkMgXHUyMDE0IFx1Qzc3Q1x1QzgxNSBcdUFDNzBcdUI5QUMgXHVDNzc0XHVDMEMxIFx1QzJBNFx1RDA2Q1x1Qjg2NFx1QjQxQyBcdUQ2QzQgXHVCMTc4XHVDRDlDXG5jb25zdCBTY3JvbGxUb1RvcCA9ICgpID0+IHtcbiAgY29uc3QgW3Zpc2libGUsIHNldFZpc2libGVdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBmaW5kU2Nyb2xsZXIgPSAoKSA9PiB7XG4gICAgLy8gXHVBRDAwXHVCOUFDXHVDNzkwIFx1RDM5OFx1Qzc3NFx1QzlDMFx1QjI5NCBcdUIwQjRcdUJEODAgXHVDRUU4XHVEMTRDXHVDNzc0XHVCMTA4XHVBQzAwIFx1QjUzMFx1Qjg1QyBcdUMyQTRcdUQwNkNcdUI4NjRcdUI0MThcdUJCQzBcdUI4NUMgXHVBREY4XHVDQUJEXHVCM0M0IFx1RDU2OFx1QUVEOCBcdUFDMTBcdUMyRENcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpPy5jbG9zZXN0KCdtYWluJykgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9O1xuICBjb25zdCBnZXRTY3JvbGxZID0gKCkgPT4ge1xuICAgIGNvbnN0IGFkbWluU2Nyb2xsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbYXJpYS1sYWJlbD1cIlx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUJBNTRcdUIyNzRcIl0gKyBkaXYnKTtcbiAgICBpZiAoYWRtaW5TY3JvbGxlcikge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KGFkbWluU2Nyb2xsZXIuc2Nyb2xsVG9wIHx8IDAsIHdpbmRvdy5zY3JvbGxZIHx8IDApO1xuICAgIH1cbiAgICByZXR1cm4gd2luZG93LnNjcm9sbFkgfHwgMDtcbiAgfTtcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblNjcm9sbCA9ICgpID0+IHNldFZpc2libGUoZ2V0U2Nyb2xsWSgpID4gMzIwKTtcbiAgICBvblNjcm9sbCgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvblNjcm9sbCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIGNvbnN0IGFkbWluU2Nyb2xsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbYXJpYS1sYWJlbD1cIlx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUJBNTRcdUIyNzRcIl0gKyBkaXYnKTtcbiAgICBpZiAoYWRtaW5TY3JvbGxlcikgYWRtaW5TY3JvbGxlci5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvblNjcm9sbCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgICAgaWYgKGFkbWluU2Nyb2xsZXIpIGFkbWluU2Nyb2xsZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICBjb25zdCBnb1RvcCA9ICgpID0+IHtcbiAgICBjb25zdCBhZG1pblNjcm9sbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2FyaWEtbGFiZWw9XCJcdUFEMDBcdUI5QUNcdUM3OTAgXHVCQTU0XHVCMjc0XCJdICsgZGl2Jyk7XG4gICAgaWYgKGFkbWluU2Nyb2xsZXIgJiYgYWRtaW5TY3JvbGxlci5zY3JvbGxUb3AgPiAwKSB7XG4gICAgICBhZG1pblNjcm9sbGVyLnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgfVxuICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICB9O1xuXG4gIGlmICghdmlzaWJsZSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBvbkNsaWNrPXtnb1RvcH1cbiAgICAgIGFyaWEtbGFiZWw9XCJcdUI5RTggXHVDNzA0XHVCODVDXCJcbiAgICAgIHRpdGxlPVwiXHVCOUU4IFx1QzcwNFx1Qjg1Q1wiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgcmlnaHQ6IDI0LCBib3R0b206IDI4LCB6SW5kZXg6IDYwLFxuICAgICAgICB3aWR0aDogNDgsIGhlaWdodDogNDgsXG4gICAgICAgIGJhY2tncm91bmQ6ICd2YXIoLS1iZy0yKScsIGNvbG9yOiAndmFyKC0tZ29sZCknLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tZ29sZC1kaW0pJyxcbiAgICAgICAgYm94U2hhZG93OiAnMCA4cHggMjRweCByZ2JhKDAsMCwwLDAuNDUpJyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2VyaWYpJyxcbiAgICAgICAgZm9udFNpemU6IDIyLFxuICAgICAgfX0+XG4gICAgICBcdTIxOTFcbiAgICA8L2J1dHRvbj5cbiAgKTtcbn07XG5cblxuLy8gXHVDNzkxXHVDMTMxXHVDNzkwIFx1QjRGMVx1QUUwOSBcdUJDMzBcdUM5QzAgXHUyMDE0IFx1QUM4Q1x1QzJEQ1x1QUUwMC9cdUIzMTNcdUFFMDAgXHVDNzkxXHVDMTMxXHVDNzkwIFx1QzYwNlx1QzVEMCBcdUM3NzhcdUI3N0NcdUM3NzhcdUM3M0NcdUI4NUMgXHVENDVDXHVDMkRDXG5jb25zdCBBdXRob3JHcmFkZUJhZGdlID0gKHsgYXV0aG9ySWQsIGF1dGhvciwgYXV0aG9yRW1haWwsIHNpemUgPSBcInNtXCIgfSkgPT4ge1xuICBjb25zdCBncmFkZSA9IHdpbmRvdy5CR05KX0FVVEhPUl9HUkFERT8uKHsgYXV0aG9ySWQsIGF1dGhvciwgYXV0aG9yRW1haWwgfSk7XG4gIGlmICghZ3JhZGUpIHJldHVybiBudWxsO1xuICBjb25zdCBzbWFsbCA9IHNpemUgPT09IFwic21cIjtcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgY2xhc3NOYW1lPVwibW9ub1wiXG4gICAgICB0aXRsZT17YCR7Z3JhZGUubGFiZWx9IFx1MDBCNyAke2dyYWRlLmRlc2MgfHwgJyd9YH1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBtYXJnaW5MZWZ0OiA2LFxuICAgICAgICBwYWRkaW5nOiBzbWFsbCA/ICcxcHggNnB4JyA6ICcycHggOHB4JyxcbiAgICAgICAgZm9udFNpemU6IHNtYWxsID8gOSA6IDEwLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4xNGVtJyxcbiAgICAgICAgY29sb3I6IGdyYWRlLmNvbG9yIHx8ICd2YXIoLS1nb2xkKScsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke2dyYWRlLmNvbG9yIHx8ICd2YXIoLS1nb2xkLWRpbSknfWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogMixcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgfX0+XG4gICAgICB7Z3JhZGUubGFiZWx9XG4gICAgPC9zcGFuPlxuICApO1xufTtcblxuLy8gXHVDNTRDXHVCOUJDIFx1QkNBOCBcdTIwMTQgXHVDNkIwXHVDMEMxXHVCMkU4IFx1QjBCNFx1QkU0NFx1QUM4Q1x1Qzc3NFx1QzE1OFx1QzVEMCBcdUIxNzhcdUNEOUNcbmNvbnN0IE5vdGlmaWNhdGlvbkJlbGwgPSAoeyB1c2VyLCBvblBpY2sgfSkgPT4ge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFt0aWNrLCBzZXRUaWNrXSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCByZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG5cbiAgLy8gXHVCMkU0XHVCOTc4IFx1RDBFRC9cdUMxMzhcdUMxNThcdUM1RDBcdUMxMUMgXHVDNTRDXHVCOUJDXHVDNzc0IFx1Q0Q5NFx1QUMwMFx1QjQxOFx1QkE3NCBzdG9yYWdlIFx1Qzc3NFx1QkNBNFx1RDJCOFx1Qjg1QyBcdUFDMzFcdUMyRTBcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblN0b3JhZ2UgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnYmdual9ub3RpZmljYXRpb25zJykgc2V0VGljaygodCkgPT4gdCArIDEpO1xuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3JhZ2UnLCBvblN0b3JhZ2UpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3RvcmFnZScsIG9uU3RvcmFnZSk7XG4gIH0sIFtdKTtcblxuICAvLyBcdUM2NzhcdUJEODAgXHVEMDc0XHVCOUFEXHVDNzNDXHVCODVDIFx1QjJFQlx1QUUzMFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuO1xuICAgIGNvbnN0IG9uRG9jID0gKGUpID0+IHtcbiAgICAgIGlmIChyZWYuY3VycmVudCAmJiAhcmVmLmN1cnJlbnQuY29udGFpbnMoZS50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKTtcbiAgICB9O1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jKTtcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2MpO1xuICB9LCBbb3Blbl0pO1xuXG4gIGlmICghdXNlcikgcmV0dXJuIG51bGw7XG4gIC8vIEJHTkpfQ09NTVVOSVRZIFx1QUMwMCBcdUJEODBcdUJEODQgXHVCODVDXHVCNERDXHVCNDFDIFx1QzJEQ1x1QzgxMFx1QzVEMCBcdUQ2MzhcdUNEOUNcdUIzRkNcdUIzQzQgXHVENjU0XHVCQTc0XHVDNzc0IFx1QUU2OFx1QzlDMFx1QzlDMCBcdUM1NEFcdUIzQzRcdUI4NUQgXHVCQUE4XHVCNEUwIFx1RDYzOFx1Q0Q5Q1x1QzVEMCBcdUM2MzVcdUMxNTRcdUIxMTAgXHVDQ0I0XHVDNzc0XHVCMkREICsgXHVBQzAwXHVCNERDXG4gIGNvbnN0IHJhd0xpc3QgPSAoKCkgPT4geyB0cnkgeyByZXR1cm4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5saXN0Tm90aWZpY2F0aW9ucz8uKHVzZXIuaWQpOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH0pKCk7XG4gIGNvbnN0IGxpc3QgPSBBcnJheS5pc0FycmF5KHJhd0xpc3QpID8gcmF3TGlzdCA6IFtdO1xuICBjb25zdCB1bnJlYWQgPSBsaXN0LmZpbHRlcigobikgPT4gbiAmJiAhbi5yZWFkKS5sZW5ndGg7XG5cbiAgY29uc3QgcGljayA9IChuKSA9PiB7XG4gICAgdHJ5IHsgd2luZG93LkJHTkpfQ09NTVVOSVRZPy5tYXJrTm90aWZpY2F0aW9uUmVhZD8uKHVzZXIuaWQsIG4uaWQpOyB9IGNhdGNoIHt9XG4gICAgc2V0T3BlbihmYWxzZSk7XG4gICAgaWYgKG9uUGljaykgb25QaWNrKG4pO1xuICAgIHNldFRpY2soKHQpID0+IHQgKyAxKTtcbiAgfTtcblxuICBjb25zdCBtYXJrQWxsID0gKCkgPT4ge1xuICAgIHRyeSB7IHdpbmRvdy5CR05KX0NPTU1VTklUWT8ubWFya0FsbE5vdGlmaWNhdGlvbnNSZWFkPy4odXNlci5pZCk7IH0gY2F0Y2gge31cbiAgICBzZXRUaWNrKCh0KSA9PiB0ICsgMSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHJlZj17cmVmfSBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9fT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICBhcmlhLWxhYmVsPXtgXHVDNTRDXHVCOUJDICR7dW5yZWFkID4gMCA/IGAke3VucmVhZH1cdUFDNzQgXHVDNTQ4IFx1Qzc3RFx1Qzc0Q2AgOiAnJ31gfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2KSA9PiAhdil9XG4gICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBwYWRkaW5nOiAnNnB4IDEwcHgnLCBtaW5XaWR0aDogMzYgfX0+XG4gICAgICAgIDxzdmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCJcbiAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjEuNlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnIH19PlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNiA4YTYgNiAwIDAgMSAxMiAwYzAgNyAzIDkgMyA5SDNzMy0yIDMtOVwiLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTEwLjMgMjFhMS45NCAxLjk0IDAgMCAwIDMuNCAwXCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAge3VucmVhZCA+IDAgJiYgKFxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogLTQsIHJpZ2h0OiAtNCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3ZhcigtLWdvbGQpJywgY29sb3I6ICd2YXIoLS1iZyknLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDk5OSwgZm9udFNpemU6IDksIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzFweCA1cHgnLCBsZXR0ZXJTcGFjaW5nOiAwLFxuICAgICAgICAgICAgICBtaW5XaWR0aDogMTQsIHRleHRBbGlnbjogJ2NlbnRlcicsIGxpbmVIZWlnaHQ6IDEuNCxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3VucmVhZCA+IDkgPyAnOSsnIDogdW5yZWFkfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gJiYgKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIlx1QzU0Q1x1QjlCQyBcdUJBQTlcdUI4NURcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnY2FsYygxMDAlICsgOHB4KScsIHJpZ2h0OiAwLFxuICAgICAgICAgICAgd2lkdGg6IDMyMCwgbWF4SGVpZ2h0OiA0MDAsIG92ZXJmbG93OiAnYXV0bycsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAndmFyKC0tYmctMiknLCBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnMCAxNnB4IDQwcHggcmdiYSgwLDAsMCwwLjUpJyxcbiAgICAgICAgICAgIHpJbmRleDogNTAsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCAxNHB4JywgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZ29sZFwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogJzAuMjJlbScgfX0+XHVDNTRDXHVCOUJDIFx1MDBCNyB7bGlzdC5sZW5ndGh9PC9zcGFuPlxuICAgICAgICAgICAge3VucmVhZCA+IDAgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXttYXJrQWxsfSBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgY29sb3I6ICd2YXIoLS1pbmstMiknIH19Plx1QkFBOFx1QjQ1MCBcdUM3N0RcdUM3NEM8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2xpc3QubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17eyBwYWRkaW5nOiAyNCwgdGV4dEFsaWduOiAnY2VudGVyJywgZm9udFNpemU6IDEzIH19PlxuICAgICAgICAgICAgICBcdUM1NDRcdUM5QzEgXHVCQzFCXHVDNzQwIFx1QzU0Q1x1QjlCQ1x1Qzc3NCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPHVsIHN0eWxlPXt7IGxpc3RTdHlsZTogJ25vbmUnLCBtYXJnaW46IDAsIHBhZGRpbmc6IDAgfX0+XG4gICAgICAgICAgICAgIHtsaXN0Lm1hcCgobikgPT4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e24uaWR9PlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gcGljayhuKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLCB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTJweCAxNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBuLnJlYWQgPyAndHJhbnNwYXJlbnQnIDogJ3JnYmEoMjQ1LDIxMyw3MiwwLjA2KScsXG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IDEyLCBjb2xvcjogJ3ZhcigtLWluayknLCBtYXJnaW5Cb3R0b206IDQsIGxpbmVIZWlnaHQ6IDEuNSB9fT5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCI+e24uZnJvbU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbVwiPiBcdTAwQjcge24ubWVzc2FnZSB8fCAnXHVDMEM4IFx1QzU0Q1x1QjlCQyd9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge24ucG9zdFRpdGxlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgbGluZUhlaWdodDogMS41LCBvdmVyZmxvdzogJ2hpZGRlbicsIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJywgd2hpdGVTcGFjZTogJ25vd3JhcCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBcdTI1Qjgge24ucG9zdFRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17eyBmb250U2l6ZTogMTAsIG1hcmdpblRvcDogNCwgbGV0dGVyU3BhY2luZzogJzAuMWVtJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7d2luZG93LkJHTkpfRk1ULmtzdERhdGVUaW1lKG4uY3JlYXRlZEF0KX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1QkUwQ1x1Qjc5Q1x1QjREQyBcdUI5QzhcdUQwNkMgXHUyMDE0IFx1QjE3OFx1Qjc4MCBcdUI3N0NcdUM2QjRcdUI0REMgXHVDMEFDXHVBQzAxXHVENjE1ICsgJ0InIFx1Q0VGN1x1QzU0NFx1QzZDMyArIFx1QkM0NVx1QUUzMCArIFx1QkNDNFx1QjRFNC5cbi8vIFBERiBcdUM2RDBcdUJDRjggXHVBRTMwXHVCQzE4XHVDNzNDXHVCODVDIFNWRyBcdUM3QUNcdUFENkNcdUMxMzEuIFx1QzhGQyBcdUMwQzlcdUMwQzFcdUM3NDAgXHVCRTBDXHVCNzlDXHVCNERDIFx1QjE3OFx1Qjc4MFx1QzBDOSAjRjVENTQ4LlxuY29uc3QgQmFuZ2lub2phSWNvbiA9ICh7IHNpemUgPSAyMiB9KSA9PiAoXG4gIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gdmlld0JveD1cIjAgMCA2NCA2NFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgIHsvKiBcdUI3N0NcdUM2QjRcdUI0REMgXHVDMEFDXHVBQzAxXHVENjE1IFx1QkMzMFx1QUNCRCAqL31cbiAgICA8cmVjdCB3aWR0aD1cIjY0XCIgaGVpZ2h0PVwiNjRcIiByeD1cIjlcIiByeT1cIjlcIiBmaWxsPVwiI0Y1RDU0OFwiLz5cbiAgICB7LyogJ0InIFx1Q0VGN1x1QzU0NFx1QzZDMyBcdTIwMTQgXHVCNDUwIFx1QUMxQ1x1Qzc1OCBcdUI0NjVcdUFERkMgXHVCQ0ZDXHVCOTY4XHVDNzc0IFx1Qzg4Q1x1Q0UyMSBcdUMxMzhcdUI4NUMgXHVBRTMwXHVCNDY1XHVDNUQwIFx1QkQ5OVx1Qzc0MCBcdUQ2MTVcdUQwREMuIGZpbGxSdWxlPWV2ZW5vZGQgXHVCODVDIFx1QzU0OFx1Q0FCRCBcdUJFNDggXHVBQ0Y1XHVBQzA0XHVDNzQ0IFx1Q0VGN1x1QzU0NFx1QzZDMy4gKi99XG4gICAgPHBhdGhcbiAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICBkPVwiTSA5IDggTCA5IDU2IEwgMzIgNTYgQyA0MiA1NiA0NyA1MSA0NyA0NC41IEMgNDcgMzkuNSA0NCAzNiAzOS41IDM1IEMgNDMgMzMuNSA0NS41IDMwLjUgNDUuNSAyNiBDIDQ1LjUgMTguNSA0MCAxNCAzMCAxNCBMIDkgMTQgWiBNIDE4IDE5IEwgMjggMTkgQyAzMyAxOSAzNiAyMSAzNiAyNSBDIDM2IDI5IDMzIDMxIDI4IDMxIEwgMTggMzEgWiBNIDE4IDM2IEwgMzAgMzYgQyAzNiAzNiAzOSAzOC41IDM5IDQzIEMgMzkgNDcuNSAzNiA1MCAzMCA1MCBMIDE4IDUwIFpcIlxuICAgICAgZmlsbD1cIiNGRkZGRkZcIi8+XG4gICAgey8qIFx1QkM0NVx1QUUzMCAoXHVCRTQ0XHVENTg5XHVBRTMwKSBcdTIwMTQgQiBcdUM3NTggXHVDMEMxXHVCMkU4IFx1QkU0OCBcdUFDRjVcdUFDMDRcdUM3NDQgXHVBQzAwXHVCODVDXHVDOUMwXHVCOTc0XHVCQTcwIFx1Qzg4Q1x1Q0UyMSBcdUM3MDRcdUM1RDBcdUMxMUMgXHVDNkIwXHVDRTIxIFx1QzU0NFx1Qjc5OFx1Qjg1QyAqL31cbiAgICA8cGF0aFxuICAgICAgZD1cIk0gMjYgMjIuNSBDIDI3IDIxLjUgMjggMjEuNSAyOC41IDIyLjUgTCAzMSAyNyBMIDM4IDI1IEMgMzguOCAyNC44IDM5LjQgMjUuMiAzOS41IDI2IEMgMzkuNiAyNi42IDM5LjMgMjcuMSAzOC44IDI3LjQgTCAzMi41IDMwLjcgTCAzMy41IDM2LjUgTCAzNiAzNy44IEMgMzYuNCAzOCAzNi41IDM4LjQgMzYuMyAzOC43IEMgMzYuMiAzOSAzNS45IDM5LjEgMzUuNiAzOSBMIDMxLjUgMzggTCAyOCAzOS41IEMgMjcuNyAzOS42IDI3LjMgMzkuNCAyNy4yIDM5IEMgMjcuMSAzOC43IDI3LjMgMzguNCAyNy42IDM4LjIgTCAzMCAzNyBMIDI4LjcgMzIgTCAyNCAzMy41IEMgMjMuNCAzMy43IDIyLjkgMzMuNCAyMi44IDMyLjggQyAyMi43IDMyLjMgMjMgMzEuOSAyMy41IDMxLjcgTCAyNy41IDMwLjIgTCAyNi4zIDI2IEwgMjUuNSAyNC41IEMgMjUuMiAyNCAyNS40IDIzLjMgMjYgMjMgWlwiXG4gICAgICBmaWxsPVwiI0Y1RDU0OFwiLz5cbiAgICB7LyogXHVCQ0M0IChzcGFya2xlKSBcdTIwMTQgNC1cdUM4MTAgXHVCMkU0XHVDNzc0XHVDNTQ0XHVCQUFDXHVCNERDIDUgXHVBQzFDLiBcdUM2QjBcdUNFMjEgXHVDMEMxXHVCMkU4XHVDNUQwXHVDMTFDIFx1QzZCMFx1Q0UyMSBcdUQ1NThcdUIyRThcdUM3M0NcdUI4NUMgXHVENzY5XHVDNUI0XHVDOUQwICovfVxuICAgIDxnIGZpbGw9XCIjRkZGRkZGXCI+XG4gICAgICA8cGF0aCBkPVwiTSA1MyAxNSBMIDU0LjUgMTggTCA1Ny41IDE5LjUgTCA1NC41IDIxIEwgNTMgMjQgTCA1MS41IDIxIEwgNDguNSAxOS41IEwgNTEuNSAxOCBaXCIvPlxuICAgICAgPHBhdGggZD1cIk0gNTggMjYgTCA1OSAyOCBMIDYxIDI5IEwgNTkgMzAgTCA1OCAzMiBMIDU3IDMwIEwgNTUgMjkgTCA1NyAyOCBaXCIvPlxuICAgICAgPHBhdGggZD1cIk0gNTAgMzMgTCA1MC43IDM0LjUgTCA1Mi4yIDM1IEwgNTAuNyAzNS41IEwgNTAgMzcgTCA0OS4zIDM1LjUgTCA0Ny44IDM1IEwgNDkuMyAzNC41IFpcIi8+XG4gICAgICA8cGF0aCBkPVwiTSA1NSA0MCBMIDU1LjUgNDEgTCA1Ni41IDQxLjUgTCA1NS41IDQyIEwgNTUgNDMgTCA1NC41IDQyIEwgNTMuNSA0MS41IEwgNTQuNSA0MSBaXCIvPlxuICAgICAgPHBhdGggZD1cIk0gNTkgMzYgTCA1OS40IDM3IEwgNjAuNCAzNy41IEwgNTkuNCAzOCBMIDU5IDM5IEwgNTguNiAzOCBMIDU3LjYgMzcuNSBMIDU4LjYgMzcgWlwiLz5cbiAgICA8L2c+XG4gIDwvc3ZnPlxuKTtcblxuY29uc3QgQnJhbmQgPSAoeyBvbkNsaWNrIH0pID0+IHtcbiAgY29uc3Qgc2MgPSB3aW5kb3cuQkdOSl9TSVRFX0NPTlRFTlQ/LmdldD8uKCkgfHwge307XG4gIGNvbnN0IGJyYW5kID0gc2MuYnJhbmQgfHwgeyBuYW1lOiBcIlx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFwiLCBzdWI6IFwiQkFOR0lOT0pBXCIgfTtcbiAgY29uc3QgbG9nbyA9IHNjLmJyYW5kaW5nPy5sb2dvRGF0YVVyaTtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICBjbGFzc05hbWU9XCJicmFuZFwiXG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgYXJpYS1sYWJlbD17YCR7YnJhbmQubmFtZX0gXHVENjQ4XHVDNzNDXHVCODVDYH1cbiAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDonbm9uZScsIGJvcmRlcjonbm9uZScsIHBhZGRpbmc6MCwgY3Vyc29yOidwb2ludGVyJ319PlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYnJhbmQtbWFya1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICB7bG9nb1xuICAgICAgICAgID8gPGltZyBzcmM9e2xvZ299IGFsdD1cIlwiIHN0eWxlPXt7d2lkdGg6MjIsIGhlaWdodDoyMiwgb2JqZWN0Rml0Oidjb250YWluJywgZGlzcGxheTonYmxvY2snfX0vPlxuICAgICAgICAgIDogPEJhbmdpbm9qYUljb24gc2l6ZT17MjJ9Lz59XG4gICAgICA8L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJicmFuZC1uYW1lXCI+XG4gICAgICAgIHticmFuZC5uYW1lfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzdWJcIiBsYW5nPVwiZW5cIj57YnJhbmQuc3VifTwvc3Bhbj5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbiAgKTtcbn07XG5cbmNvbnN0IE5hdiA9ICh7IHJvdXRlLCBnbywgdXNlciwgb25Mb2dvdXQgfSkgPT4ge1xuICBjb25zdCBuYXZMID0gKHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fSkubmF2IHx8IHt9O1xuICBjb25zdCBbbW9iaWxlT3Blbiwgc2V0TW9iaWxlT3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIC8vIFx1Qjc3Q1x1QzZCMFx1RDJCOCBcdUJDQzBcdUFDQkQgXHVDMkRDIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUJBNTRcdUIyNzQgXHVDNzkwXHVCM0Q5IFx1QjJFQlx1RDc5OFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4geyBzZXRNb2JpbGVPcGVuKGZhbHNlKTsgfSwgW3JvdXRlXSk7XG4gIC8vIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUJBNTRcdUIyNzQgXHVDNUY0XHVCOUJDIFx1QzJEQzogRXNjYXBlIFx1QjJFQlx1QUUzMCArIGJvZHkgc2Nyb2xsIGxvY2sgKyB2aWV3cG9ydCBcdUQ2NTVcdUIzMDAgXHVDMkRDIFx1Qzc5MFx1QjNEOSBcdUIyRUJcdUQ3OThcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW1vYmlsZU9wZW4pIHJldHVybjtcbiAgICBjb25zdCBvbktleSA9IChlKSA9PiB7IGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHNldE1vYmlsZU9wZW4oZmFsc2UpOyB9O1xuICAgIGNvbnN0IG9uUmVzaXplID0gKCkgPT4geyBpZiAod2luZG93LmlubmVyV2lkdGggPiA5MDApIHNldE1vYmlsZU9wZW4oZmFsc2UpOyB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvblJlc2l6ZSk7XG4gICAgY29uc3QgcHJldiA9IGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3c7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5KTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvblJlc2l6ZSk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gcHJldjtcbiAgICB9O1xuICB9LCBbbW9iaWxlT3Blbl0pO1xuICAvLyBcdUIxODBcdUM3OTAgXHVCQTU0XHVBQzAwXHVCQTU0XHVCMjc0IFx1Qzc5MFx1QzJERCAoXHVDNzU4XHVDMkREXHVDOEZDOiBcdUJBMzlcdUFDRTAvXHVDNzkwXHVBQ0UwL1x1QzBBQ1x1QUNFMCkuIFwiXHVCMTgwXHVDNzkwXCIgXHVDNzkwXHVDQ0I0IFx1RDA3NFx1QjlBRCBcdUMyREMgXHVDQ0FCIFx1RDU2RFx1QkFBOVx1QzczQ1x1Qjg1QyBcdUM5QzRcdUM3ODUuXG4gIGNvbnN0IHBsYXlDaGlsZHJlbiA9IFtcbiAgICB7IGtleTogXCJlYXRcIiwgICBsYWJlbDogbmF2TC5lYXQgICB8fCBcIlx1QkEzOVx1QUNFMCBcdUIxODBcdUM3OTBcIiwgIGRlc2M6IFwiXHVDMkREIFx1OThERiBcdTIwMTQgXHVENTVDXHVDODE1XHVDMkREXHUwMEI3XHVENUE1XHVEMUEwXHVDNzRDXHVDMkREXHUwMEI3XHVDMkRDXHVDN0E1XCIgfSxcbiAgICB7IGtleTogXCJzbGVlcFwiLCBsYWJlbDogbmF2TC5zbGVlcCB8fCBcIlx1Qzc5MFx1QUNFMCBcdUIxODBcdUM3OTBcIiwgIGRlc2M6IFwiXHVDOEZDIFx1NEY0RiBcdTIwMTQgXHVENTVDXHVDNjI1XHUwMEI3XHVBQ0UwXHVEMEREXHUwMEI3XHVEMTVDXHVENTBDXHVDMkE0XHVEMTRDXHVDNzc0XCIgfSxcbiAgICB7IGtleTogXCJzaG9wXCIsICBsYWJlbDogbmF2TC5zaG9wICB8fCBcIlx1QzBBQ1x1QUNFMCBcdUIxODBcdUM3OTBcIiwgIGRlc2M6IFwiXHVDNzU4IFx1ODg2MyBcdTIwMTQgXHVDODA0XHVEMUI1XHVBQ0Y1XHVDNjA4XHUwMEI3XHVEMUEwXHVDMEIwXHVCQjNDXCIgfSxcbiAgXTtcbiAgY29uc3QgcGxheUtleXMgPSBwbGF5Q2hpbGRyZW4ubWFwKChwKSA9PiBwLmtleSk7XG5cbiAgY29uc3QgaXRlbXMgPSBbXG4gICAgeyBrZXk6IFwiaG9tZVwiLCBsYWJlbDogbmF2TC5ob21lIHx8IFwiXHVENjQ4XCIgfSxcbiAgICB7IGtleTogXCJwbGF5XCIsIGxhYmVsOiBuYXZMLnBsYXkgfHwgXCJcdUIxODBcdUM3OTBcIiwgaXNNZWdhOiAncGxheScsIGRlZmF1bHRSb3V0ZTogJ2VhdCcgfSxcbiAgICB7IGtleTogXCJ0b3VyXCIsIGxhYmVsOiBuYXZMLnRvdXIgfHwgXCJcdUQyMkNcdUM1QjRcIiB9LFxuICAgIHsga2V5OiBcImxlY3R1cmVzXCIsIGxhYmVsOiBuYXZMLmxlY3R1cmVzIHx8IFwiXHVBQzE1XHVDNUYwXCIgfSxcbiAgICB7IGtleTogXCJjb2x1bW5cIiwgbGFiZWw6IG5hdkwuY29sdW1uIHx8IFwiXHVDRTdDXHVCN0ZDXCIgfSxcbiAgICB7IGtleTogXCJjb21tdW5pdHlcIiwgbGFiZWw6IG5hdkwuY29tbXVuaXR5IHx8IFwiXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwXCIsIGlzTWVnYTogJ2NvbW11bml0eScgfSxcbiAgXTtcbiAgLy8gXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwIFx1QkE1NFx1QUMwMFx1QkE1NFx1QjI3NDogQkdOSl9TVE9SRVMuY2F0ZWdvcmllc1x1Qzc1OCBib2FyZFR5cGU9Y29tbXVuaXR5ICsgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QjRGMVx1QUUwOSBcdUFDMDBcdUMyREMgXHVDRTc0XHVEMTRDXHVBQ0UwXHVCOUFDXG4gIGNvbnN0IHVzZXJMZXZlbCA9IHdpbmRvdy5CR05KX1VTRVJfTEVWRUwgPyB3aW5kb3cuQkdOSl9VU0VSX0xFVkVMKHVzZXIpIDogKHVzZXIgPyAxMCA6IDApO1xuICBjb25zdCBjb21tdW5pdHlCb2FyZHMgPSAod2luZG93LkJHTkpfU1RPUkVTPy5jYXRlZ29yaWVzIHx8IFtdKVxuICAgIC5maWx0ZXIoKGMpID0+IGMuYm9hcmRUeXBlID09PSAnY29tbXVuaXR5JyAmJiB1c2VyTGV2ZWwgPj0gKGMubWluTGV2ZWwgPz8gMCkpO1xuXG4gIGNvbnN0IGdvQm9hcmQgPSAoYm9hcmRJZCkgPT4ge1xuICAgIHRyeSB7IHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2JnbmpfcGVuZGluZ19ib2FyZF9pZCcsIGJvYXJkSWQpOyB9IGNhdGNoIHt9XG4gICAgZ28oJ2NvbW11bml0eScpO1xuICB9O1xuXG4gIC8vIFx1RDY1Q1x1QzEzMSBcdUMwQzFcdUQwREMgXHVEMzEwXHVDODE1IFx1MjAxNCBcdUJBNTRcdUFDMDAgXHVBREY4XHVCOEY5XHVDNzQwIFx1Qzc5MFx1QzJERCBcdUI3N0NcdUM2QjBcdUQyQjhcdUIzQzQgXHVENjVDXHVDMTMxXHVDNzNDXHVCODVDIFx1QUMwNFx1QzhGQ1xuICBjb25zdCBpc0FjdGl2ZSA9IChpdCkgPT4ge1xuICAgIGlmIChpdC5pc01lZ2EgPT09ICdwbGF5JykgcmV0dXJuIHBsYXlLZXlzLmluY2x1ZGVzKHJvdXRlKTtcbiAgICByZXR1cm4gcm91dGUgPT09IGl0LmtleTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxuYXYgY2xhc3NOYW1lPXtgbmF2ICR7bW9iaWxlT3BlbiA/ICdtb2JpbGUtb3BlbicgOiAnJ31gfSBhcmlhLWxhYmVsPVwiXHVDOEZDIFx1QkE1NFx1QjI3NFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgbmF2LWlubmVyXCI+XG4gICAgICAgIDxCcmFuZCBvbkNsaWNrPXsoKSA9PiBnbyhcImhvbWVcIil9IC8+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJuYXYtdG9nZ2xlXCJcbiAgICAgICAgICBhcmlhLWxhYmVsPXttb2JpbGVPcGVuID8gXCJcdUJBNTRcdUIyNzQgXHVCMkVCXHVBRTMwXCIgOiBcIlx1QkE1NFx1QjI3NCBcdUM1RjRcdUFFMzBcIn1cbiAgICAgICAgICBhcmlhLWV4cGFuZGVkPXttb2JpbGVPcGVufVxuICAgICAgICAgIGFyaWEtY29udHJvbHM9XCJwcmltYXJ5LW5hdi1tZW51XCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRNb2JpbGVPcGVuKCh2KSA9PiAhdil9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm5hdi10b2dnbGUtYmFyc1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDx1bCBpZD1cInByaW1hcnktbmF2LW1lbnVcIiBjbGFzc05hbWU9XCJuYXYtbWVudVwiIHJvbGU9XCJsaXN0XCIgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBtYXJnaW46MCwgcGFkZGluZzowfX0+XG4gICAgICAgICAge2l0ZW1zLm1hcChpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYXNNZWdhID0gaXQuaXNNZWdhID09PSAncGxheScgfHwgKGl0LmlzTWVnYSA9PT0gJ2NvbW11bml0eScgJiYgY29tbXVuaXR5Qm9hcmRzLmxlbmd0aCA+IDApO1xuICAgICAgICAgICAgY29uc3Qgb25DbGljayA9ICgpID0+IGdvKGl0LmRlZmF1bHRSb3V0ZSB8fCBpdC5rZXkpO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGxpIGtleT17aXQua2V5fSBzdHlsZT17e3Bvc2l0aW9uOidyZWxhdGl2ZSd9fSBjbGFzc05hbWU9e2hhc01lZ2EgPyAnbmF2LWhhcy1tZWdhJyA6ICcnfT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YG5hdi1saW5rICR7aXNBY3RpdmUoaXQpID8gXCJhY3RpdmVcIiA6IFwiXCJ9YH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtY3VycmVudD17aXNBY3RpdmUoaXQpID8gXCJwYWdlXCIgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPXtoYXNNZWdhID8gJ21lbnUnIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17b25DbGlja30+e2l0LmxhYmVsfXtoYXNNZWdhID8gJyBcdTI1QkUnIDogJyd9PC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICB7aXQuaXNNZWdhID09PSAncGxheScgJiYgKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXYtbWVnYVwiIHJvbGU9XCJtZW51XCIgYXJpYS1sYWJlbD1cIlx1QjE4MFx1Qzc5MCBcdTIwMTQgXHVDNzU4XHVDMkREXHVDOEZDIFx1Q0U3NFx1RDE0Q1x1QUNFMFx1QjlBQ1wiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246J2Fic29sdXRlJywgdG9wOicxMDAlJywgbGVmdDonNTAlJywgdHJhbnNmb3JtOid0cmFuc2xhdGVYKC01MCUpJyxcbiAgICAgICAgICAgICAgICAgICAgICBtaW5XaWR0aDoyODAsIHBhZGRpbmc6JzEwcHggMCcsXG4gICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDondmFyKC0tYmcpJywgYm9yZGVyOicxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzonMCAxNnB4IDQwcHggcmdiYSgxNSwyMyw0MiwwLjEwKScsXG4gICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTonaGlkZGVuJywgb3BhY2l0eTowLCB0cmFuc2l0aW9uOidvcGFjaXR5IC4xMnMgZWFzZScsXG4gICAgICAgICAgICAgICAgICAgICAgekluZGV4OjUwLFxuICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZTo5LCBsZXR0ZXJTcGFjaW5nOicwLjIyZW0nLCBwYWRkaW5nOic2cHggMTZweCA4cHgnfX0+XHVDNzU4XHVDMkREXHVDOEZDIFx1ODg2M1x1OThERlx1NEY0RjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8dWwgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBtYXJnaW46MCwgcGFkZGluZzowfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3BsYXlDaGlsZHJlbi5tYXAoKHApID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e3Aua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cIm1lbnVpdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnbyhwLmtleSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2Jsb2NrJywgd2lkdGg6JzEwMCUnLCB0ZXh0QWxpZ246J2xlZnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzonMTBweCAxNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3RyYW5zcGFyZW50JywgY29sb3I6J3ZhcigtLWluay0yKScsIGJvcmRlcjonbm9uZScsIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhlKSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3ZhcigtLWJnLTIpJzsgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhlKSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3RyYW5zcGFyZW50JzsgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2ZvbnRTaXplOjEzLCBmb250V2VpZ2h0OjUwMH19PntwLmxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMDVlbScsIG1hcmdpblRvcDoyfX0+e3AuZGVzY308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgIHsvKiBcdUJBQThcdUJDMTRcdUM3N0MgXHVDODA0XHVDNkE5OiBcdUIxODBcdUM3OTAgXHVCQTU0XHVBQzAwIFx1Qzc5MFx1QzJERFx1QjRFNFx1Qzc0NCBcdUM3NzhcdUI3N0NcdUM3NzggXHVEM0JDXHVDRTY4XHVDNzNDXHVCODVDIFx1QjE3OFx1Q0Q5QyAqL31cbiAgICAgICAgICAgICAgICB7aXQuaXNNZWdhID09PSAncGxheScgJiYgKFxuICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdi1tb2JpbGUtc3VibWVudVwiIHJvbGU9XCJsaXN0XCIgYXJpYS1sYWJlbD1cIlx1QjE4MFx1Qzc5MCBcdUQ1NThcdUM3MDRcIiBzdHlsZT17e2xpc3RTdHlsZTonbm9uZScsIG1hcmdpbjowLCBwYWRkaW5nOjB9fT5cbiAgICAgICAgICAgICAgICAgICAge3BsYXlDaGlsZHJlbi5tYXAoKHApID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8bGkga2V5PXtwLmtleX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BuYXYtbGluayBuYXYtc3ViLWxpbmsgJHtyb3V0ZSA9PT0gcC5rZXkgPyAnYWN0aXZlJyA6ICcnfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtY3VycmVudD17cm91dGUgPT09IHAua2V5ID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnbyhwLmtleSl9PntwLmxhYmVsfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHtpdC5pc01lZ2EgPT09ICdjb21tdW5pdHknICYmIGNvbW11bml0eUJvYXJkcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2LW1lZ2FcIiByb2xlPVwibWVudVwiIGFyaWEtbGFiZWw9XCJcdUFDOENcdUMyRENcdUQzMTAgXHVCQUE5XHVCODVEXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6JzEwMCUnLCBsZWZ0Oic1MCUnLCB0cmFuc2Zvcm06J3RyYW5zbGF0ZVgoLTUwJSknLFxuICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOjIyMCwgcGFkZGluZzonMTBweCAwJyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OicwIDE2cHggNDBweCByZ2JhKDE1LDIzLDQyLDAuMTApJyxcbiAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OidoaWRkZW4nLCBvcGFjaXR5OjAsIHRyYW5zaXRpb246J29wYWNpdHkgLjEycyBlYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6NTAsXG4gICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjksIGxldHRlclNwYWNpbmc6JzAuMjJlbScsIHBhZGRpbmc6JzZweCAxNnB4IDhweCd9fT5CT0FSRFM8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPHVsIHN0eWxlPXt7bGlzdFN0eWxlOidub25lJywgbWFyZ2luOjAsIHBhZGRpbmc6MH19PlxuICAgICAgICAgICAgICAgICAgICAgIHtjb21tdW5pdHlCb2FyZHMubWFwKChiKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkga2V5PXtiLmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cIm1lbnVpdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnb0JvYXJkKGIuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OidibG9jaycsIHdpZHRoOicxMDAlJywgdGV4dEFsaWduOidsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6JzhweCAxNnB4JywgZm9udFNpemU6MTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid0cmFuc3BhcmVudCcsIGNvbG9yOid2YXIoLS1pbmstMiknLCBib3JkZXI6J25vbmUnLCBjdXJzb3I6J3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoZSkgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICd2YXIoLS1iZy0yKSc7IH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoZSkgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICd0cmFuc3BhcmVudCc7IH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntiLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBzdHlsZT17e2JvcmRlclRvcDonMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgbWFyZ2luVG9wOjYsIHBhZGRpbmdUb3A6Nn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcm9sZT1cIm1lbnVpdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZ28oJ2NvbW11bml0eScpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2Jsb2NrJywgd2lkdGg6JzEwMCUnLCB0ZXh0QWxpZ246J2xlZnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6JzhweCAxNnB4JywgZm9udFNpemU6MTIsIGxldHRlclNwYWNpbmc6JzAuMThlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDondHJhbnNwYXJlbnQnLCBjb2xvcjondmFyKC0tc2Vjb25kYXJ5KScsIGJvcmRlcjonbm9uZScsIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTondmFyKC0tZm9udC1tb25vKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19Plx1QzgwNFx1Q0NCNCBcdUJDRjRcdUFFMzAgXHUyMTkyPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICAgIHsvKiBcdUJBQThcdUJDMTRcdUM3N0MgXHVDODA0XHVDNkE5OiBcdUMwQUNcdUM2QTlcdUM3OTAgXHVDNTYxXHVDMTU4XHVDNzQ0IFx1QkE1NFx1QjI3NCBcdUIwQjRcdUJEODBcdUM1RDAgXHVCMTc4XHVDRDlDLiBcdUIzNzBcdUMyQTRcdUQwNkNcdUQwRDFcdUM1RDBcdUMxMjAgLm5hdi1tb2JpbGUtb25seSBDU1MgXHVCODVDIFx1QzIyOFx1QUU0MC4gKi99XG4gICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1tb2JpbGUtb25seSBuYXYtbW9iaWxlLWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgICAge3VzZXIgPyAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1vbmx5XCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBvbkNsaWNrPXsoKSA9PiBnbyhcIm15cGFnZVwiKX0+XHVCOUM4XHVDNzc0XHVEMzk4XHVDNzc0XHVDOUMwPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIHt1c2VyLmlzQWRtaW4gJiYgKFxuICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtbW9iaWxlLW9ubHlcIj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgb25DbGljaz17KCkgPT4gZ28oXCJhZG1pblwiKX0+XHVBRDAwXHVCOUFDPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1tb2JpbGUtb25seVwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgb25DbGljaz17b25Mb2dvdXR9Plx1Qjg1Q1x1QURGOFx1QzU0NFx1QzZDMzwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtbW9iaWxlLW9ubHlcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXYtbGlua1wiIG9uQ2xpY2s9eygpID0+IGdvKFwibG9naW5cIil9Plx1Qjg1Q1x1QURGOFx1Qzc3ODwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1vbmx5XCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBvbkNsaWNrPXsoKSA9PiBnbyhcInNpZ251cFwiKX0+XHVENjhDXHVDNkQwXHVBQzAwXHVDNzg1PC9idXR0b24+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApfVxuICAgICAgICA8L3VsPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1hY3Rpb25zXCI+XG4gICAgICAgICAge3VzZXIgPyAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb25vXCIgYXJpYS1sYWJlbD17YFx1Qjg1Q1x1QURGOFx1Qzc3ODogJHt1c2VyLm5hbWV9YH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRTaXplOjExLCBsZXR0ZXJTcGFjaW5nOicwLjE1ZW0nLCBjb2xvcjondmFyKC0taW5rLTIpJ319Pnt1c2VyLm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICA8Tm90aWZpY2F0aW9uQmVsbCB1c2VyPXt1c2VyfSBvblBpY2s9eyhuKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gXHVDNTRDXHVCOUJDIFx1RDBDMFx1Qzc4NVx1QkNDNCBcdUI3N0NcdUM2QjBcdUQzMDUgXHUyMDE0IFx1QUMxNVx1QzVGMC9cdUQyMkNcdUM1QjQvXHVDOEZDXHVCQjM4L1x1QjMxM1x1QUUwMFxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBpZiAobi50eXBlID09PSAnY29tbWVudCcgJiYgbi5wb3N0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX3Bvc3RfaWQnLCBTdHJpbmcobi5wb3N0SWQpKTtcbiAgICAgICAgICAgICAgICAgICAgZ28oJ2NvbW11bml0eScpOyByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAobi50eXBlID09PSAnbGVjdHVyZV9jb25maXJtZWQnIHx8IG4udHlwZSA9PT0gJ2xlY3R1cmVfcHJvbW90ZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuLmxlY3R1cmVJZCkgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX2xlY3R1cmVfaWQnLCBTdHJpbmcobi5sZWN0dXJlSWQpKTtcbiAgICAgICAgICAgICAgICAgICAgZ28oJ2xlY3R1cmVzJyk7IHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChuLnR5cGUgPT09ICd0b3VyX2NvbmZpcm1lZCcgfHwgbi50eXBlID09PSAndG91cl9wcm9tb3RlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4udG91cklkKSBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfdG91cl9pZCcsIFN0cmluZyhuLnRvdXJJZCkpO1xuICAgICAgICAgICAgICAgICAgICBnbygndG91cicpOyByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoU3RyaW5nKG4udHlwZSB8fCAnJykuc3RhcnRzV2l0aCgnb3JkZXJfJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZ28oJ215cGFnZScpOyByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvLyBcdUQzRjRcdUJDMzEgXHUyMDE0IHBvc3RJZFx1QUMwMCBcdUM3ODhcdUM3M0NcdUJBNzQgXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwXG4gICAgICAgICAgICAgICAgICBpZiAobi5wb3N0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX3Bvc3RfaWQnLCBTdHJpbmcobi5wb3N0SWQpKTtcbiAgICAgICAgICAgICAgICAgICAgZ28oJ2NvbW11bml0eScpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge31cbiAgICAgICAgICAgICAgfX0vPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiBnbyhcIm15cGFnZVwiKX0+XHVCOUM4XHVDNzc0XHVEMzk4XHVDNzc0XHVDOUMwPC9idXR0b24+XG4gICAgICAgICAgICAgIHt1c2VyLmlzQWRtaW4gJiYgKFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IGdvKFwiYWRtaW5cIil9Plx1QUQwMFx1QjlBQzwvYnV0dG9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIiBvbkNsaWNrPXtvbkxvZ291dH0+XHVCODVDXHVBREY4XHVDNTQ0XHVDNkMzPC9idXR0b24+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuLWdob3N0IG5hdi1saW5rXCIgb25DbGljaz17KCkgPT4gZ28oXCJsb2dpblwiKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e2ZvbnRTaXplOjEyLCBsZXR0ZXJTcGFjaW5nOicwLjFlbScsIGNvbG9yOid2YXIoLS1pbmstMiknfX0+XHVCODVDXHVBREY4XHVDNzc4PC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IGdvKFwic2lnbnVwXCIpfT5cdUQ2OENcdUM2RDBcdUFDMDBcdUM3ODU8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9uYXY+XG4gICk7XG59O1xuXG5jb25zdCBGb290ZXIgPSAoeyBnbyB9KSA9PiB7XG4gIGNvbnN0IHNjID0gKHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fSk7XG4gIGNvbnN0IGNvbnRhY3QgPSBzYy5jb250YWN0IHx8IHt9O1xuICBjb25zdCBmb290ZXIgPSBzYy5mb290ZXIgfHwge307XG4gIGNvbnN0IGZTdHlsZSA9ICh3aW5kb3cuQkdOSl9GT09URVJfU1RZTEU/LigpIHx8IHdpbmRvdy5CR05KX0ZPT1RFUl9TVFlMRV9ERUZBVUxUKTtcbiAgLy8gdjAwLjE0NCBcdTIwMTQgXHVDODA0XHVENjU0XHVCQzg4XHVENjM4IFx1QzgxQ1x1QUM3MCArIFx1QzBBQ1x1QzVDNVx1Qzc5MCBcdUM4MTVcdUJDRjQgKFx1RDY4Q1x1QzBBQ1x1QkE4NSAvIFx1QjMwMFx1RDQ1Q1x1Qzc5MCAvIFx1QzBBQ1x1QzVDNVx1Qzc5MFx1QjRGMVx1Qjg1RFx1QkM4OFx1RDYzOCAvIFx1QkM5NVx1Qzc3OFx1QjRGMVx1Qjg1RFx1QkM4OFx1RDYzOCAvIFx1QUMxQ1x1QzVDNVx1Qzc3QykgXHVCMTc4XHVDRDlDLlxuICBjb25zdCBlbWFpbCA9IGNvbnRhY3QuZW1haWwgfHwgXCJjb250YWN0QGJnbmoubmV0XCI7XG4gIGNvbnN0IGFkZHJlc3MgPSBjb250YWN0LmFkZHJlc3MgfHwgXCJcdUMxMUNcdUM2QjhcdUQyQjlcdUJDQzRcdUMyREMgXHVDMTFDXHVDRDA4XHVBRDZDIFx1QzExQ1x1Q0QwOFx1QjMwMFx1Qjg1QzczXHVBRTM4IDQwLCA3XHVDRTM1IDEzXHVENjM4IChcdUMxMUNcdUNEMDhcdUIzRDksIFx1QUMxNVx1QjBBOFx1QzYyNFx1RDUzQ1x1QzJBNFx1RDE1NClcIjtcbiAgY29uc3QgY29tcGFueU5hbWUgPSBjb250YWN0LmNvbXBhbnlOYW1lIHx8IFwiXHVDOEZDXHVDMkREXHVENjhDXHVDMEFDIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFwiO1xuICBjb25zdCBjZW8gPSBjb250YWN0LmNlbyB8fCBcIlwiO1xuICBjb25zdCBiaXpSZWdObyA9IGNvbnRhY3QuYml6UmVnTm8gfHwgXCJcIjtcbiAgY29uc3QgY29ycFJlZ05vID0gY29udGFjdC5jb3JwUmVnTm8gfHwgXCJcIjtcbiAgY29uc3QgZm91bmRlZCA9IGNvbnRhY3QuZm91bmRlZCB8fCBcIlwiO1xuICBjb25zdCBoZWFkaW5nU3R5bGUgPSB7XG4gICAgZm9udFNpemU6IGZTdHlsZS5oZWFkaW5nLmZvbnRTaXplLFxuICAgIGZvbnRXZWlnaHQ6IGZTdHlsZS5oZWFkaW5nLmZvbnRXZWlnaHQsXG4gICAgbGV0dGVyU3BhY2luZzogYCR7ZlN0eWxlLmhlYWRpbmcubGV0dGVyU3BhY2luZ31lbWAsXG4gICAgY29sb3I6IGB2YXIoJHtmU3R5bGUuaGVhZGluZy5jb2xvcn0pYCxcbiAgfTtcbiAgcmV0dXJuIChcbiAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cImZvb3RlclwiIGFyaWEtbGFiZWw9XCJcdUMwQUNcdUM3NzRcdUQyQjggXHVDODE1XHVCQ0Y0IFx1QkMwRiBcdUQ0NzhcdUQxMzBcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyLWdyaWRcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPEJyYW5kIG9uQ2xpY2s9eygpID0+IGdvKFwiaG9tZVwiKX0vPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltIGJnbmotbXVsdGlsaW5lXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOjIwLFxuICAgICAgICAgICAgICBmb250U2l6ZTogZlN0eWxlLmRlc2NyaXB0aW9uLmZvbnRTaXplLFxuICAgICAgICAgICAgICBmb250V2VpZ2h0OiBmU3R5bGUuZGVzY3JpcHRpb24uZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogZlN0eWxlLmRlc2NyaXB0aW9uLmxpbmVIZWlnaHQsXG4gICAgICAgICAgICAgIGNvbG9yOiBgdmFyKCR7ZlN0eWxlLmRlc2NyaXB0aW9uLmNvbG9yfSlgLFxuICAgICAgICAgICAgICBtYXhXaWR0aDogZlN0eWxlLmRlc2NyaXB0aW9uLm1heFdpZHRoLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtmb290ZXIuZGVzY3JpcHRpb24gfHwgXCJcdUJDNDVcdUFFMzBcdUQwQzBcdUFDRTAgXHVCMTc4XHVDNzkwLiBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUIyOTQgXHVENTVDXHVBRDZEXHVDNzU4IFx1QzVFRFx1QzBBQ1x1MDBCN1x1QkIzOFx1RDY1NFx1MDBCN1x1Qzc5MFx1QzVGMFx1Qzc0NCBcdUM5QzFcdUM4MTEgXHVBQzc3XHVBQ0UwIFx1QjI5MFx1QjA3Q1x1QkE3MCBcdUIwOThcdUIyMDRcdUIyOTQgXHVDNUVDXHVENTg5IFx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMFx1Qzc4NVx1QjJDOFx1QjJFNC4gXHVBRDgxXHVBRDkwIFx1QjJGNVx1QzBBQ1x1QkQ4MFx1RDEzMCBcdUM5QzBcdUM1RUQgXHVDNUVDXHVENTg5XHVBRTRDXHVDOUMwLCBcdUQ1NjhcdUFFRDggXHVCOUNDXHVCNEU0XHVDNUI0XHVBQzAwXHVCMjk0IFx1QzVFQ1x1RDU4OS5cIn1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8bmF2IGFyaWEtbGFiZWw9XCJcdUNGNThcdUQxNTBcdUNFMjAgXHVCQzE0XHVCODVDXHVBQzAwXHVBRTMwXCI+XG4gICAgICAgICAgICA8aDQgaWQ9XCJmdC1jb250ZW50XCIgc3R5bGU9e2hlYWRpbmdTdHlsZX0+e2Zvb3Rlci5oZWFkaW5nQ29udGVudCB8fCBcIlx1Q0Y1OFx1RDE1MFx1Q0UyMFwifTwvaDQ+XG4gICAgICAgICAgICA8dWwgYXJpYS1sYWJlbGxlZGJ5PVwiZnQtY29udGVudFwiPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJjb2x1bW5cIil9Plx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBcdUNFN0NcdUI3RkM8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJ0b3VyXCIpfT5cdUQyMkNcdUM1QjQgXHVENTA0XHVCODVDXHVBREY4XHVCN0E4PC9idXR0b24+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwiYm9va1wiKX0+XHUzMDBFXHVDNjU1XHVDNzU4XHVBRTM4XHUzMDBGPC9idXR0b24+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwiY29tbXVuaXR5XCIpfT5cdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjA8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L25hdj5cbiAgICAgICAgICA8bmF2IGFyaWEtbGFiZWw9XCJcdUM4MTVcdUJDRjQgXHVCQzE0XHVCODVDXHVBQzAwXHVBRTMwXCI+XG4gICAgICAgICAgICA8aDQgaWQ9XCJmdC1pbmZvXCIgc3R5bGU9e2hlYWRpbmdTdHlsZX0+e2Zvb3Rlci5oZWFkaW5nSW5mbyB8fCBcIlx1QzgxNVx1QkNGNFwifTwvaDQ+XG4gICAgICAgICAgICA8dWwgYXJpYS1sYWJlbGxlZGJ5PVwiZnQtaW5mb1wiPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJob21lXCIpfT5cdUFDMTVcdUM1RjAgXHVDNzdDXHVDODE1PC9idXR0b24+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwiY29tbXVuaXR5XCIpfT5cdUFDRjVcdUM5QzBcdUMwQUNcdUQ1NkQ8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJmYXFcIil9Plx1Qzc5MFx1QzhGQyBcdUJCM0JcdUIyOTQgXHVDOUM4XHVCQjM4PC9idXR0b24+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwidGVybXNcIil9Plx1Qzc3NFx1QzZBOVx1QzU3RFx1QUQwMDwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcInByaXZhY3lcIil9Plx1QUMxQ1x1Qzc3OFx1QzgxNVx1QkNGNCBcdUNDOThcdUI5QUNcdUJDMjlcdUNFNjg8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L25hdj5cbiAgICAgICAgICA8YWRkcmVzcyBzdHlsZT17e2ZvbnRTdHlsZTonbm9ybWFsJ319PlxuICAgICAgICAgICAgPGg0IGlkPVwiZnQtY29udGFjdFwiIHN0eWxlPXtoZWFkaW5nU3R5bGV9Pntmb290ZXIuaGVhZGluZ0NvbnRhY3QgfHwgXCJcdUM1RjBcdUI3N0RcIn08L2g0PlxuICAgICAgICAgICAgPHVsIGFyaWEtbGFiZWxsZWRieT1cImZ0LWNvbnRhY3RcIj5cbiAgICAgICAgICAgICAge2VtYWlsICYmIDxsaT48YSBocmVmPXtgbWFpbHRvOiR7ZW1haWx9YH0+e2VtYWlsfTwvYT48L2xpPn1cbiAgICAgICAgICAgICAge2FkZHJlc3MgJiYgPGxpPjxzcGFuPnthZGRyZXNzfTwvc3Bhbj48L2xpPn1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9hZGRyZXNzPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgey8qIHYwMC4xNDQgXHUyMDE0IFx1QzBBQ1x1QzVDNVx1Qzc5MCBcdUM4MTVcdUJDRjQgXHVCRTE0XHVCODVEIChcdUM3NzRcdUM2QTlcdUM1N0RcdUFEMDAgKyBcdUMwQUNcdUM1QzVcdUM3OTBcdUI0RjFcdUI4NURcdUM5OUQgXHVCRDgwXHVENTY5KS4gXHVENTVDXHVBRDZEIFx1QzZGOVx1QzBBQ1x1Qzc3NFx1RDJCOCBcdUQ0NUNcdUM5MDAgXHVENDc4XHVEMTMwIFx1RDMyOFx1RDEzNC4gKi99XG4gICAgICAgIHsoY29tcGFueU5hbWUgfHwgYml6UmVnTm8gfHwgY2VvKSAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItYml6XCIgc3R5bGU9e3tcbiAgICAgICAgICAgIG1hcmdpblRvcDoyNCwgcGFkZGluZ1RvcDoxNiwgYm9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZS0yKScsXG4gICAgICAgICAgICBmb250U2l6ZToxMSwgbGluZUhlaWdodDoxLjg1LCBjb2xvcjondmFyKC0taW5rLTMpJyxcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtbW9ubyknLCBsZXR0ZXJTcGFjaW5nOicwLjA0ZW0nLFxuICAgICAgICAgICAgZGlzcGxheTonZmxleCcsIGdhcDonMnB4IDE4cHgnLCBmbGV4V3JhcDond3JhcCcsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7Y29tcGFueU5hbWUgJiYgPHNwYW4+PHN0cm9uZyBzdHlsZT17e2NvbG9yOid2YXIoLS1pbmstMiknfX0+e2NvbXBhbnlOYW1lfTwvc3Ryb25nPjwvc3Bhbj59XG4gICAgICAgICAgICB7Y2VvICYmIDxzcGFuPlx1QjMwMFx1RDQ1Q1x1Qzc5MCB7Y2VvfTwvc3Bhbj59XG4gICAgICAgICAgICB7Yml6UmVnTm8gJiYgPHNwYW4+XHVDMEFDXHVDNUM1XHVDNzkwXHVCNEYxXHVCODVEXHVCQzg4XHVENjM4IHtiaXpSZWdOb308L3NwYW4+fVxuICAgICAgICAgICAge2NvcnBSZWdObyAmJiA8c3Bhbj5cdUJDOTVcdUM3NzhcdUI0RjFcdUI4NURcdUJDODhcdUQ2Mzgge2NvcnBSZWdOb308L3NwYW4+fVxuICAgICAgICAgICAge2ZvdW5kZWQgJiYgPHNwYW4+XHVDMTI0XHVCOUJEIHtmb3VuZGVkfTwvc3Bhbj59XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyLWJvdHRvbVwiIHN0eWxlPXt7bWFyZ2luVG9wOjI0fX0+XG4gICAgICAgICAgPHNwYW4+e2Zvb3Rlci5jb3B5cmlnaHQgfHwgXCJcdTAwQTkgMjAyNiBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgQkFOR0lOT0pBIFx1MjAxNCBBTEwgUklHSFRTIFJFU0VSVkVEXCJ9PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBsZXR0ZXJTcGFjaW5nOicwLjE0ZW0nfX0+XG4gICAgICAgICAgICB2e3dpbmRvdy5CR05KX1ZFUlNJT04/LnZlcnNpb24gfHwgJzAuMC4wJ30gXHUwMEI3IHt3aW5kb3cuQkdOSl9WRVJTSU9OPy5idWlsZCB8fCAnXHUyMDE0J31cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPFRoZW1lVG9nZ2xlLz5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udFNpemU6IGZTdHlsZS5zaWduYXR1cmUuZm9udFNpemUsXG4gICAgICAgICAgICBmb250V2VpZ2h0OiBmU3R5bGUuc2lnbmF0dXJlLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBgJHtmU3R5bGUuc2lnbmF0dXJlLmxldHRlclNwYWNpbmd9ZW1gLFxuICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtmU3R5bGUuc2lnbmF0dXJlLmNvbG9yfSlgLFxuICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogZlN0eWxlLnNpZ25hdHVyZS50ZXh0VHJhbnNmb3JtIHx8ICd1cHBlcmNhc2UnLFxuICAgICAgICAgIH19Pntmb290ZXIuc2lnbmF0dXJlIHx8IFwiXHVCQzQ1XHVBRTMwXHVEMEMwXHVBQ0UwIFx1QjE3OFx1Qzc5MCBcdTAwQjcgREVTSUdORUQgSU4gU0VPVUxcIn08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9mb290ZXI+XG4gICk7XG59O1xuXG4vLyBcdUQxNENcdUI5QzggXHVEMUEwXHVBRTAwIFx1MjAxNCBsaWdodCBcdTIxOTIgZGFyayBcdTIxOTIgYXV0byBcdTIxOTIgbGlnaHQgXHVDMjFDXHVENjU4LiBCR05KX1RIRU1FIFx1RDVFQ1x1RDM3Q1x1QzY0MCBcdUM5REQuXG5jb25zdCBUaGVtZVRvZ2dsZSA9ICgpID0+IHtcbiAgY29uc3QgW21vZGUsIHNldE1vZGVdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4gKHdpbmRvdy5CR05KX1RIRU1FPy5nZXQ/LigpIHx8ICdhdXRvJykpO1xuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uQ2hhbmdlID0gKCkgPT4gc2V0TW9kZSh3aW5kb3cuQkdOSl9USEVNRT8uZ2V0Py4oKSB8fCAnYXV0bycpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZ25qLXRoZW1lLWNoYW5nZScsIG9uQ2hhbmdlKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotdGhlbWUtY2hhbmdlJywgb25DaGFuZ2UpO1xuICB9LCBbXSk7XG4gIGlmICghd2luZG93LkJHTkpfVEhFTUUpIHJldHVybiBudWxsO1xuICBjb25zdCBuZXh0ID0gd2luZG93LkJHTkpfVEhFTUUuY3ljbGUuYmluZCh3aW5kb3cuQkdOSl9USEVNRSk7XG4gIGNvbnN0IGljb24gPSBtb2RlID09PSAnZGFyaycgPyAnXHVEODNDXHVERjE5JyA6IG1vZGUgPT09ICdsaWdodCcgPyAnXHUyNjAwJyA6ICdcdTI1RDAnO1xuICBjb25zdCBsYWJlbCA9IG1vZGUgPT09ICdkYXJrJyA/ICdEQVJLJyA6IG1vZGUgPT09ICdsaWdodCcgPyAnTElHSFQnIDogJ0FVVE8nO1xuICByZXR1cm4gKFxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRoZW1lLXRvZ2dsZVwiIG9uQ2xpY2s9eygpID0+IG5leHQoKX0gYXJpYS1sYWJlbD17YFx1RDE0Q1x1QjlDOCBcdUM4MDRcdUQ2NTggXHUyMDE0IFx1RDYwNFx1QzdBQyAke2xhYmVsfWB9IHRpdGxlPVwiXHVEMTRDXHVCOUM4OiBcdUI3N0NcdUM3NzRcdUQyQjggLyBcdUIyRTRcdUQwNkMgLyBcdUM3OTBcdUIzRDlcIj5cbiAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPntpY29ufTwvc3Bhbj48c3Bhbj57bGFiZWx9PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApO1xufTtcblxuY29uc3QgT3JuYW1lbnQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwib3JuYW1lbnRcIiBzdHlsZT17e21hcmdpbjpcIjQwcHggMFwifX0+XG4gICAgPHNwYW4gc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LXNlcmlmKScsIGZvbnRTaXplOjE0LCBsZXR0ZXJTcGFjaW5nOicwLjNlbScsIGNvbG9yOid2YXIoLS1nb2xkKSd9fT5cbiAgICAgIHtjaGlsZHJlbiB8fCBcIlx1NEU5NFwifVxuICAgIDwvc3Bhbj5cbiAgPC9kaXY+XG4pO1xuXG4vLyB0aXRsZSBhY2NlcHRzIHN0cmluZyBPUiBSZWFjdCBub2RlLiBGb3IgYWNjZW50LCBwYXNzIEpTWDogPD5cdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUM1RDAgPHNwYW4gY2xhc3NOYW1lPVwiYWNjZW50XCI+XHVDODA0XHVENTU4XHVCMjk0IFx1QjlEMDwvc3Bhbj48Lz5cbmNvbnN0IFNlY3Rpb25IZWFkID0gKHsgZXllYnJvdywgdGl0bGUsIHN1YnRpdGxlLCBhY3Rpb24sIGxldmVsID0gMiB9KSA9PiB7XG4gIGNvbnN0IEggPSBgaCR7bGV2ZWx9YDtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24taGVhZFwiPlxuICAgICAgPGRpdj5cbiAgICAgICAge2V5ZWJyb3cgJiYgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIj57ZXllYnJvd308L2Rpdj59XG4gICAgICAgIDxIIGNsYXNzTmFtZT1cInNlY3Rpb24tdGl0bGVcIj57dGl0bGV9PC9IPlxuICAgICAgICB7c3VidGl0bGUgJiYgPHAgY2xhc3NOYW1lPVwic2VjdGlvbi1zdWJ0aXRsZVwiPntzdWJ0aXRsZX08L3A+fVxuICAgICAgPC9kaXY+XG4gICAgICB7YWN0aW9ufVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgVHdlYWtzID0gKHsgdHdlYWtzLCBzZXRUd2Vha3MsIHZpc2libGUgfSkgPT4ge1xuICBpZiAoIXZpc2libGUpIHJldHVybiBudWxsO1xuICBjb25zdCBzZXQgPSAoaywgdikgPT4gc2V0VHdlYWtzKHsgLi4udHdlYWtzLCBba106IHYgfSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3NcIj5cbiAgICAgIDxoMz5Ud2Vha3M8L2gzPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3Mtcm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLWxhYmVsXCI+XHVDMkVDXHVCQ0ZDIFx1QzJBNFx1RDBDMFx1Qzc3QzwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1vcHRpb25zXCI+XG4gICAgICAgICAge1tcIm91dGxpbmVcIiwgXCJmaWxsZWRcIiwgXCJkYXNoZWRcIl0ubWFwKHMgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e3N9IGNsYXNzTmFtZT17dHdlYWtzLmxpbmVTdHlsZSA9PT0gcyA/IFwib25cIiA6IFwiXCJ9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldChcImxpbmVTdHlsZVwiLCBzKX0+XG4gICAgICAgICAgICAgIHtzID09PSBcIm91dGxpbmVcIiA/IFwiXHVDMTIwXCIgOiBzID09PSBcImZpbGxlZFwiID8gXCJcdUNDNDRcdUM2QzBcIiA6IFwiXHVEMzBDXHVDMTIwXCJ9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLXJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1sYWJlbFwiPlx1QUNFOFx1QjREQyBcdUFDMTVcdUIzQzQgXHUwMEI3IHt0d2Vha3MuaW50ZW5zaXR5LnRvRml4ZWQoMSl9PC9kaXY+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBjbGFzc05hbWU9XCJ0d2Vha3Mtc2xpZGVyXCJcbiAgICAgICAgICBtaW49XCIwLjNcIiBtYXg9XCIxLjhcIiBzdGVwPVwiMC4xXCJcbiAgICAgICAgICB2YWx1ZT17dHdlYWtzLmludGVuc2l0eX1cbiAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXQoXCJpbnRlbnNpdHlcIiwgcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSkpfS8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLXJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1sYWJlbFwiPlx1RDc4OFx1QzVCNFx1Qjg1QyBcdUI4MDhcdUM3NzRcdUM1NDRcdUM2QzM8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3Mtb3B0aW9uc1wiPlxuICAgICAgICAgIHtbXCJjZW50ZXJcIiwgXCJzcGxpdFwiLCBcImZ1bGxibGVlZFwiXS5tYXAocyA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uIGtleT17c30gY2xhc3NOYW1lPXt0d2Vha3MuaGVyb0xheW91dCA9PT0gcyA/IFwib25cIiA6IFwiXCJ9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldChcImhlcm9MYXlvdXRcIiwgcyl9PlxuICAgICAgICAgICAgICB7cyA9PT0gXCJjZW50ZXJcIiA/IFwiXHVDOTExXHVDNTU5XCIgOiBzID09PSBcInNwbGl0XCIgPyBcIlx1QkQ4NFx1RDU2MFwiIDogXCJcdUQ0ODBcdUJFMTRcdUI5QUNcdUI0RENcIn1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3Mtcm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLWxhYmVsXCI+XHVDNzc4XHVEMTMwXHVCNzk5XHVDMTU4PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLW9wdGlvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17dHdlYWtzLmludGVyYWN0aXZlID8gXCJvblwiIDogXCJcIn1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldChcImludGVyYWN0aXZlXCIsICF0d2Vha3MuaW50ZXJhY3RpdmUpfT5cbiAgICAgICAgICAgIHt0d2Vha3MuaW50ZXJhY3RpdmUgPyBcIk9OXCIgOiBcIk9GRlwifVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHVDRkUwXHVEMEE0IFx1QzJCOVx1Qzc3OCBcdUJDMzBcdUIxMDggXHUyMDE0IFx1Q0NBQiBcdUJDMjlcdUJCMzggXHVDMkRDIFx1RDQ1Q1x1QzJEQy4gXHVDMEFDXHVDNkE5XHVDNzkwXHVBQzAwIFx1QUNCMFx1QzgxNVx1RDU1OFx1QkE3NCBsb2NhbFN0b3JhZ2VcdUM1RDAgXHVDNjAxXHVDMThEXHVENjU0LlxuLy8gUElQQSAvIEdEUFIgXHVBQzAwXHVDNzc0XHVCNERDXHVCNzdDXHVDNzc4OiBcdUQ1NDRcdUMyMTgoXHVBRTMwXHVCMkE1KVx1QjI5NCBcdUMwQUNcdUM2QTlcdUM3OTAgXHVBQzcwXHVCRDgwIFx1QkQ4OFx1QUMwMCwgXHVCRDg0XHVDMTFEXHUwMEI3XHVCOUM4XHVDRjAwXHVEMzA1XHVDNzQwIFx1QzYzNVx1RDJCOFx1Qzc3OC5cbi8vIFx1QzgwMFx1QzdBNSBcdUQ2MTVcdUQwREM6IHsgbmVjZXNzYXJ5OnRydWUsIGFuYWx5dGljczpib29sLCBtYXJrZXRpbmc6Ym9vbCwgdHM6SVNPIH1cbmNvbnN0IENvb2tpZUNvbnNlbnQgPSAoKSA9PiB7XG4gIGNvbnN0IEtFWSA9ICdiZ25qX2Nvb2tpZV9jb25zZW50JztcbiAgY29uc3QgW2RlY2lzaW9uLCBzZXREZWNpc2lvbl0gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgdHJ5IHsgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oS0VZKTsgcmV0dXJuIHJhdyA/IEpTT04ucGFyc2UocmF3KSA6IG51bGw7IH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxuICB9KTtcbiAgY29uc3QgW2RldGFpbHMsIHNldERldGFpbHNdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbYW5hbHl0aWNzLCBzZXRBbmFseXRpY3NdID0gUmVhY3QudXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFttYXJrZXRpbmcsIHNldE1hcmtldGluZ10gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgcGVyc2lzdCA9IChuZXh0KSA9PiB7XG4gICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLCBKU09OLnN0cmluZ2lmeShuZXh0KSk7IH0gY2F0Y2gge31cbiAgICBzZXREZWNpc2lvbihuZXh0KTtcbiAgICB0cnkgeyB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2JnbmotY29va2llLWNvbnNlbnQnLCB7IGRldGFpbDogbmV4dCB9KSk7IH0gY2F0Y2gge31cbiAgfTtcblxuICBjb25zdCBhY2NlcHRBbGwgPSAoKSA9PiBwZXJzaXN0KHsgbmVjZXNzYXJ5OiB0cnVlLCBhbmFseXRpY3M6IHRydWUsIG1hcmtldGluZzogdHJ1ZSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9KTtcbiAgY29uc3QgcmVqZWN0QWxsID0gKCkgPT4gcGVyc2lzdCh7IG5lY2Vzc2FyeTogdHJ1ZSwgYW5hbHl0aWNzOiBmYWxzZSwgbWFya2V0aW5nOiBmYWxzZSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9KTtcbiAgY29uc3Qgc2F2ZUN1c3RvbSA9ICgpID0+IHBlcnNpc3QoeyBuZWNlc3Nhcnk6IHRydWUsIGFuYWx5dGljczogISFhbmFseXRpY3MsIG1hcmtldGluZzogISFtYXJrZXRpbmcsIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSk7XG5cbiAgaWYgKGRlY2lzaW9uKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJmYWxzZVwiIGFyaWEtbGFiZWxsZWRieT1cImNvb2tpZS1iYW5uZXItdGl0bGVcIlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsIGxlZnQ6IDE2LCByaWdodDogMTYsIGJvdHRvbTogMTYsXG4gICAgICAgIG1heFdpZHRoOiA3MjAsIG1hcmdpbjogJzAgYXV0bycsIHpJbmRleDogODAsXG4gICAgICAgIGJhY2tncm91bmQ6ICd2YXIoLS1iZy0yKScsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1nb2xkLWRpbSknLFxuICAgICAgICBib3hTaGFkb3c6ICcwIDE2cHggNDBweCByZ2JhKDAsMCwwLDAuNDUpJyxcbiAgICAgICAgcGFkZGluZzogJzIwcHggMjJweCcsIGJvcmRlclJhZGl1czogNCxcbiAgICAgIH19PlxuICAgICAgPGgyIGlkPVwiY29va2llLWJhbm5lci10aXRsZVwiIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3sgZm9udFNpemU6IDE2LCBtYXJnaW5Cb3R0b206IDggfX0+XHVDRkUwXHVEMEE0IFx1QzBBQ1x1QzZBOSBcdUIzRDlcdUM3NTg8L2gyPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3sgZm9udFNpemU6IDEzLCBsaW5lSGVpZ2h0OiAxLjcsIG1hcmdpbkJvdHRvbTogMTQgfX0+XG4gICAgICAgIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1QjI5NCBcdUMxMUNcdUJFNDRcdUMyQTQgXHVDNkI0XHVDNjAxXHVDNzQ0IFx1QzcwNFx1RDU1QyA8c3Ryb25nIGNsYXNzTmFtZT1cImdvbGRcIj5cdUQ1NDRcdUMyMTggXHVDRkUwXHVEMEE0PC9zdHJvbmc+XHVDNjQwLCBcdUMwQUNcdUM3NzRcdUQyQjggXHVBQzFDXHVDMTIwXHVDNzQ0IFx1QzcwNFx1RDU1Q1xuICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cImdvbGRcIj4gXHVCRDg0XHVDMTFEIFx1Q0ZFMFx1RDBBNDwvc3Ryb25nPlx1MDBCNzxzdHJvbmcgY2xhc3NOYW1lPVwiZ29sZFwiPlx1QjlDOFx1Q0YwMFx1RDMwNSBcdUNGRTBcdUQwQTQ8L3N0cm9uZz5cdUI5N0MgXHVDMEFDXHVDNkE5XHVENTY5XHVCMkM4XHVCMkU0LlxuICAgICAgICBcdUMxMzhcdUJEODAgXHVDMTI0XHVDODE1XHVDNUQwXHVDMTFDIFx1RDU2RFx1QkFBOVx1QkNDNFx1Qjg1QyBcdUMxMjBcdUQwRERcdUQ1NThcdUMyRTQgXHVDMjE4IFx1Qzc4OFx1QzVCNFx1QzY5NC5cbiAgICAgIDwvcD5cbiAgICAgIHtkZXRhaWxzICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDE0LCBwYWRkaW5nVG9wOiAxMCwgYm9yZGVyVG9wOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyB9fT5cbiAgICAgICAgICA8ZmllbGRzZXQgc3R5bGU9e3sgYm9yZGVyOiAnbm9uZScsIHBhZGRpbmc6IDAsIG1hcmdpbjogMCB9fT5cbiAgICAgICAgICAgIDxsZWdlbmQgY2xhc3NOYW1lPVwic3Itb25seVwiPlx1Q0ZFMFx1RDBBNCBcdUQ1NkRcdUJBQTlcdUJDQzQgXHVCM0Q5XHVDNzU4PC9sZWdlbmQ+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ2FwOiAxMCB9fT5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAxMCwgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLCBvcGFjaXR5OiAwLjcgfX0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQgcmVhZE9ubHkgYXJpYS1sYWJlbD1cIlx1RDU0NFx1QzIxOCBcdUNGRTBcdUQwQTQgKFx1RDU2RFx1QzBDMSBcdUQ2NUNcdUMxMzEpXCIvPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBmb250U2l6ZTogMTMgfX0+XHVENTQ0XHVDMjE4PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17eyBmb250U2l6ZTogMTIsIGRpc3BsYXk6ICdibG9jaycgfX0+XHVCODVDXHVBREY4XHVDNzc4IFx1QzEzOFx1QzE1OCwgXHVCQ0Y0XHVDNTQ4LCBcdUQ1NDRcdUMyMTggXHVBRTMwXHVCMkE1IFx1QjNEOVx1Qzc5MVx1QzVEMCBcdUMwQUNcdUM2QTkuIFx1QUM3MFx1QkQ4MCBcdUJEODhcdUFDMDAuPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAxMCwgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnIH19PlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXthbmFseXRpY3N9IG9uQ2hhbmdlPXsoZSkgPT4gc2V0QW5hbHl0aWNzKGUudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlx1QkQ4NFx1QzExRCBcdUNGRTBcdUQwQTQgXHVCM0Q5XHVDNzU4XCIvPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBmb250U2l6ZTogMTMgfX0+XHVCRDg0XHVDMTFEPC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17eyBmb250U2l6ZTogMTIsIGRpc3BsYXk6ICdibG9jaycgfX0+XHVCQzI5XHVCQjM4IFx1RDFCNVx1QUNDNFx1MDBCN1x1RDM5OFx1Qzc3NFx1QzlDMCBcdUMxMzFcdUIyQTUgXHVBQzFDXHVDMTIwXHVDNkE5LiBcdUMyRERcdUJDQzRcdUM3OTAgXHVDNzc1XHVCQTg1IFx1Q0M5OFx1QjlBQy48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6IDEwLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcgfX0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e21hcmtldGluZ30gb25DaGFuZ2U9eyhlKSA9PiBzZXRNYXJrZXRpbmcoZS50YXJnZXQuY2hlY2tlZCl9XG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiXHVCOUM4XHVDRjAwXHVEMzA1IFx1Q0ZFMFx1RDBBNCBcdUIzRDlcdUM3NThcIi8+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGZvbnRTaXplOiAxMyB9fT5cdUI5QzhcdUNGMDBcdUQzMDU8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMiwgZGlzcGxheTogJ2Jsb2NrJyB9fT5cdUFEMDBcdUMyRUNcdUMwQUMgXHVBRTMwXHVCQzE4IFx1QzU0OFx1QjBCNCwgXHVDNjc4XHVCRDgwIFx1QUQxMVx1QUNFMCBcdUI5RTRcdUNDQjQgXHVDNUYwXHVCM0Q5XHVDNUQwIFx1QzBBQ1x1QzZBOS48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogOCwgZmxleFdyYXA6ICd3cmFwJywganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcgfX0+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiBzZXREZXRhaWxzKCh2KSA9PiAhdil9XG4gICAgICAgICAgYXJpYS1leHBhbmRlZD17ZGV0YWlsc30+XG4gICAgICAgICAge2RldGFpbHMgPyAnXHVBQzA0XHVCMkU4XHVENzg4JyA6ICdcdUMxMzhcdUJEODAgXHVDMTI0XHVDODE1J31cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIiBvbkNsaWNrPXtyZWplY3RBbGx9Plx1QkFBOFx1QjQ1MCBcdUFDNzBcdUJEODA8L2J1dHRvbj5cbiAgICAgICAge2RldGFpbHNcbiAgICAgICAgICA/IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGwgYnRuLWdvbGRcIiBvbkNsaWNrPXtzYXZlQ3VzdG9tfT5cdUMxMjBcdUQwREQgXHVDODAwXHVDN0E1PC9idXR0b24+XG4gICAgICAgICAgOiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsIGJ0bi1nb2xkXCIgb25DbGljaz17YWNjZXB0QWxsfT5cdUJBQThcdUI0NTAgXHVCM0Q5XHVDNzU4PC9idXR0b24+fVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyB2MDAuMTA1IFx1MjAxNCBcdUNFRTRcdUJDODQgXHVDNzc0XHVCQkY4XHVDOUMwIHBsYWNlaG9sZGVyLiBCQU5HSU5PSkEgXHVCODVDXHVBQ0UwXHVCOTdDIDUwJSBcdUQyMkNcdUJBODVcdUIzQzRcdUI4NUMgXHVDOTExXHVDNTU5IFx1RDQ1Q1x1QzJEQy5cbi8vIFx1QzBBQ1x1QzZBOVx1Q0M5ODogXHVEMjJDXHVDNUI0L1x1QUMxNVx1QzVGMCBcdUMwQzFcdUMxMzggXHVEMzk4XHVDNzc0XHVDOUMwIGNvdmVyIFx1QkJGOFx1QzEyNFx1QzgxNSBcdUMyREMgKyBcdUNDNDUgXHVDRTc0XHVEMEM4XHVCODVDXHVBREY4IGNvdmVyIFx1QkJGOFx1QzEyNFx1QzgxNSBcdUMyREMuXG5jb25zdCBDb3ZlclBsYWNlaG9sZGVyID0gKHsgYXNwZWN0UmF0aW8gPSAnMTYvMTAnLCBsYWJlbCwgaWNvblNpemUgPSA4OCB9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwicGxhY2Vob2xkZXJcIiBzdHlsZT17e1xuICAgIGFzcGVjdFJhdGlvLCBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBkaXNwbGF5OiAnZ3JpZCcsIHBsYWNlSXRlbXM6ICdjZW50ZXInLFxuICAgIGJhY2tncm91bmQ6ICd2YXIoLS1iZy0yKScsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUtMiknLFxuICB9fT5cbiAgICA8ZGl2IHN0eWxlPXt7IG9wYWNpdHk6IDAuNSwgZGlzcGxheTogJ2dyaWQnLCBwbGFjZUl0ZW1zOiAnY2VudGVyJywgZ2FwOiAxMCB9fT5cbiAgICAgIDxCYW5naW5vamFJY29uIHNpemU9e2ljb25TaXplfS8+XG4gICAgICB7bGFiZWwgJiYgKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3sgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiAnMC4yMmVtJyB9fT5cbiAgICAgICAgICB7bGFiZWx9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuKTtcblxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHsgQnJhbmQsIE5hdiwgRm9vdGVyLCBPcm5hbWVudCwgU2VjdGlvbkhlYWQsIFR3ZWFrcywgQXV0aG9yR3JhZGVCYWRnZSwgTm90aWZpY2F0aW9uQmVsbCwgU2Nyb2xsVG9Ub3AsIEJhbmdpbm9qYUljb24sIENvdmVyUGxhY2Vob2xkZXIsIENvb2tpZUNvbnNlbnQgfSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFRQSxPQUFPLGdCQUFnQixTQUFTLGNBQWMsRUFBRSxNQUFNLE9BQU8sU0FBUyxhQUFhLE1BQU0sR0FBRztBQUMxRixRQUFNLGFBQWEsU0FBUztBQUs1QixRQUFNLFdBQVcsTUFBTSxPQUFPLEVBQUUsT0FBTyxTQUFTLGFBQWEsV0FBVyxDQUFDO0FBQ3pFLFdBQVMsVUFBVSxFQUFFLE9BQU8sU0FBUyxhQUFhLFdBQVc7QUFFN0QsUUFBTSxxQkFBcUIsTUFBTSxZQUFZLE1BQU07QUFqQnJEO0FBa0JJLFVBQU0sSUFBSSxTQUFTO0FBQ25CLFFBQUksQ0FBQyxFQUFFLE9BQU87QUFBRSxjQUFFLFlBQUY7QUFBZTtBQUFBLElBQVE7QUFDdkMsUUFBSSxFQUFFLGFBQWE7QUFDakIsWUFBTSxNQUFNLE9BQU8sUUFBUSxHQUFHLEVBQUUsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBLG9GQUE0RTtBQUN0SCxVQUFJLEtBQUs7QUFBRSxZQUFJO0FBQUUsWUFBRSxZQUFZO0FBQUEsUUFBRyxTQUFRO0FBQUEsUUFBQztBQUFBLE1BQUU7QUFDN0MsY0FBRSxZQUFGO0FBQUEsSUFDRixPQUFPO0FBQ0wsWUFBTSxLQUFLLE9BQU8sUUFBUSxHQUFHLEVBQUUsVUFBVSw0SEFBNkI7QUFDdEUsVUFBSSxHQUFJLFNBQUUsWUFBRjtBQUFBLElBQ1Y7QUFBQSxFQUNGLEdBQUcsQ0FBQyxDQUFDO0FBRUwsUUFBTSxVQUFVLE1BQU07QUFDcEIsUUFBSSxDQUFDLEtBQU07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

})();

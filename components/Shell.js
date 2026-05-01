(function(){
window.useModalGuard = function useModalGuard({ open, dirty, onClose, onSaveDraft, label }) {
  const promptName = label || "\uC791\uC131 \uC911\uC778 \uB0B4\uC6A9";
  const handleAttemptClose = React.useCallback(() => {
    if (!dirty) {
      onClose == null ? void 0 : onClose();
      return;
    }
    if (onSaveDraft) {
      const yes = window.confirm(`${promptName}\uC774(\uAC00) \uC800\uC7A5\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.
\uC784\uC2DC\uC800\uC7A5 \uD558\uC2DC\uACA0\uC5B4\uC694?

[\uD655\uC778] = \uC784\uC2DC\uC800\uC7A5 \uD6C4 \uB2EB\uAE30
[\uCDE8\uC18C] = \uADF8\uB0E5 \uB2EB\uAE30 (\uBCC0\uACBD \uB0B4\uC6A9 \uBC84\uB9BC)`);
      if (yes) {
        try {
          onSaveDraft();
        } catch (e) {
        }
      }
      onClose == null ? void 0 : onClose();
    } else {
      const ok = window.confirm(`${promptName}\uC774(\uAC00) \uC800\uC7A5\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC815\uB9D0 \uB2EB\uC73C\uC2DC\uACA0\uC5B4\uC694?`);
      if (ok) onClose == null ? void 0 : onClose();
    }
  }, [dirty, onClose, onSaveDraft, promptName]);
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
    const onPop = (e) => {
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
      /* @__PURE__ */ React.createElement("div", { className: "mono dim-2", style: { fontSize: 10, marginTop: 4, letterSpacing: "0.1em" } }, new Date(n.createdAt).toLocaleString("ko-KR"))
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
  const email = contact.email || "hello@bgnj.net";
  const phone = contact.phone || "02-0000-0000";
  const phoneHref = contact.phoneHref || "tel:" + (phone || "").replace(/[^0-9+]/g, "");
  const address = contact.address || "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC";
  const headingStyle = {
    fontSize: fStyle.heading.fontSize,
    fontWeight: fStyle.heading.fontWeight,
    letterSpacing: `${fStyle.heading.letterSpacing}em`,
    color: `var(${fStyle.heading.color})`
  };
  return /* @__PURE__ */ React.createElement("footer", { className: "footer", "aria-label": "\uC0AC\uC774\uD2B8 \uC815\uBCF4 \uBC0F \uD478\uD130" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "footer-grid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Brand, { onClick: () => go("home") }), /* @__PURE__ */ React.createElement("p", { className: "dim", style: {
    marginTop: 20,
    fontSize: fStyle.description.fontSize,
    fontWeight: fStyle.description.fontWeight,
    lineHeight: fStyle.description.lineHeight,
    color: `var(${fStyle.description.color})`,
    maxWidth: fStyle.description.maxWidth
  } }, footer.description || "\uBC45\uAE30\uD0C0\uACE0 \uB178\uC790. \uBC45\uAE30\uB178\uC790\uB294 \uD55C\uAD6D\uC758 \uC5ED\uC0AC\xB7\uBB38\uD654\xB7\uC790\uC5F0\uC744 \uC9C1\uC811 \uAC77\uACE0 \uB290\uB07C\uBA70 \uB098\uB204\uB294 \uC5EC\uD589 \uCEE4\uBBA4\uB2C8\uD2F0\uC785\uB2C8\uB2E4. \uAD81\uAD90 \uB2F5\uC0AC\uBD80\uD130 \uC9C0\uC5ED \uC5EC\uD589\uAE4C\uC9C0, \uD568\uAED8 \uB9CC\uB4E4\uC5B4\uAC00\uB294 \uC5EC\uD589.")), /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uCF58\uD150\uCE20 \uBC14\uB85C\uAC00\uAE30" }, /* @__PURE__ */ React.createElement("h4", { id: "ft-content", style: headingStyle }, "\uCF58\uD150\uCE20"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-content" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("column") }, "\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("tour") }, "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("book") }, "\u300E\uC655\uC758\uAE38\u300F")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("community") }, "\uCEE4\uBBA4\uB2C8\uD2F0")))), /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uC815\uBCF4 \uBC14\uB85C\uAC00\uAE30" }, /* @__PURE__ */ React.createElement("h4", { id: "ft-info", style: headingStyle }, "\uC815\uBCF4"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-info" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("home") }, "\uAC15\uC5F0 \uC77C\uC815")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("community") }, "\uACF5\uC9C0\uC0AC\uD56D")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("faq") }, "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("terms") }, "\uC774\uC6A9\uC57D\uAD00")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("privacy") }, "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68")))), /* @__PURE__ */ React.createElement("address", { style: { fontStyle: "normal" } }, /* @__PURE__ */ React.createElement("h4", { id: "ft-contact", style: headingStyle }, "\uC5F0\uB77D"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-contact" }, email && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: `mailto:${email}` }, email)), phone && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: phoneHref }, phone)), address && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("span", null, address))))), /* @__PURE__ */ React.createElement("div", { className: "footer-bottom", style: { marginTop: 24 } }, /* @__PURE__ */ React.createElement("span", null, "\xA9 2026 \uBC45\uAE30\uB178\uC790 BANGINOJA \u2014 ALL RIGHTS RESERVED"), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.14em" } }, "v", ((_d = window.BGNJ_VERSION) == null ? void 0 : _d.version) || "0.0.0", " \xB7 ", ((_e = window.BGNJ_VERSION) == null ? void 0 : _e.build) || "\u2014"), /* @__PURE__ */ React.createElement(ThemeToggle, null), /* @__PURE__ */ React.createElement("span", { style: {
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
Object.assign(window, { Brand, Nav, Footer, Ornament, SectionHead, Tweaks, AuthorGradeBadge, NotificationBell, ScrollToTop, BanginojaIcon, CookieConsent });
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29tcG9uZW50cy9TaGVsbC5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1QUNGNVx1RDFCNSBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjg6IE5hdiwgRm9vdGVyLCBUd2Vha3MsIEJyYW5kLCBBdXRob3JHcmFkZUJhZGdlLCBOb3RpZmljYXRpb25CZWxsLCBTY3JvbGxUb1RvcFxuXG4vLyA9PT0gXHVCQUE4XHVCMkVDIFx1QUMwMFx1QjREQyBcdUQ2QzUgKHYwMC4wNjcpID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRVNDIFx1RDBBNCArIFx1QzY3OFx1QkQ4MCBcdUQwNzRcdUI5QUQoYmFja2Ryb3ApICsgXHVCRTBDXHVCNzdDXHVDNkIwXHVDODAwIFx1QjRBNFx1Qjg1Q1x1QUMwMFx1QUUzMCBcdUMyREMgXHVCQUE4XHVCMkVDXHVDNzQ0IFx1QjJFQlx1QUUzMCBcdUM4MDRcdUM1RDAgZGlydHkgXHVDMEMxXHVEMERDXHVCQTc0IFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QzVEMFx1QUM4QyBjb25maXJtLlxuLy8gXHVDMEFDXHVDNkE5XHVCQzk1OlxuLy8gICBjb25zdCB7IG9uQmFja2Ryb3BDbGljayB9ID0gdXNlTW9kYWxHdWFyZCh7IG9wZW4sIGRpcnR5LCBvbkNsb3NlLCBvblNhdmVEcmFmdCB9KTtcbi8vICAgPGRpdiBvbkNsaWNrPXtvbkJhY2tkcm9wQ2xpY2t9Pi4uLjwvZGl2PlxuLy8gb25TYXZlRHJhZnQgXHVBQzAwIFx1Qzc4OFx1QUNFMCBkaXJ0eSBcdUJBNzQgcHJvbXB0IFx1MjAxNCBcdUM4MDBcdUM3QTUgLyBcdUJDODRcdUI5QUNcdUFFMzAgLyBcdUNERThcdUMxOEMuXG53aW5kb3cudXNlTW9kYWxHdWFyZCA9IGZ1bmN0aW9uIHVzZU1vZGFsR3VhcmQoeyBvcGVuLCBkaXJ0eSwgb25DbG9zZSwgb25TYXZlRHJhZnQsIGxhYmVsIH0pIHtcbiAgY29uc3QgcHJvbXB0TmFtZSA9IGxhYmVsIHx8ICdcdUM3OTFcdUMxMzEgXHVDOTExXHVDNzc4IFx1QjBCNFx1QzZBOSc7XG4gIGNvbnN0IGhhbmRsZUF0dGVtcHRDbG9zZSA9IFJlYWN0LnVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoIWRpcnR5KSB7IG9uQ2xvc2U/LigpOyByZXR1cm47IH1cbiAgICBpZiAob25TYXZlRHJhZnQpIHtcbiAgICAgIC8vIFx1QzgwMFx1QzdBNShPSykgLyBcdUFERjhcdUIwRTUgXHVCMkVCXHVBRTMwKENhbmNlbCkuIFx1QjM1NCBcdUQ0OERcdUJEODBcdUQ1NUMgMy13YXkgXHVCMkU0XHVDNzc0XHVDNUJDXHVCODVDXHVBREY4XHVCMjk0IFx1RDZDNFx1QzE4RCBcdUMwQUNcdUM3NzRcdUQwNzQuXG4gICAgICBjb25zdCB5ZXMgPSB3aW5kb3cuY29uZmlybShgJHtwcm9tcHROYW1lfVx1Qzc3NChcdUFDMDApIFx1QzgwMFx1QzdBNVx1QjQxOFx1QzlDMCBcdUM1NEFcdUM1NThcdUMyQjVcdUIyQzhcdUIyRTQuXFxuXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1IFx1RDU1OFx1QzJEQ1x1QUNBMFx1QzVCNFx1QzY5ND9cXG5cXG5bXHVENjU1XHVDNzc4XSA9IFx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNSBcdUQ2QzQgXHVCMkVCXHVBRTMwXFxuW1x1Q0RFOFx1QzE4Q10gPSBcdUFERjhcdUIwRTUgXHVCMkVCXHVBRTMwIChcdUJDQzBcdUFDQkQgXHVCMEI0XHVDNkE5IFx1QkM4NFx1QjlCQylgKTtcbiAgICAgIGlmICh5ZXMpIHtcbiAgICAgICAgdHJ5IHsgb25TYXZlRHJhZnQoKTsgfSBjYXRjaCB7fVxuICAgICAgfVxuICAgICAgb25DbG9zZT8uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG9rID0gd2luZG93LmNvbmZpcm0oYCR7cHJvbXB0TmFtZX1cdUM3NzQoXHVBQzAwKSBcdUM4MDBcdUM3QTVcdUI0MThcdUM5QzAgXHVDNTRBXHVDNTU4XHVDMkI1XHVCMkM4XHVCMkU0LiBcdUM4MTVcdUI5RDAgXHVCMkVCXHVDNzNDXHVDMkRDXHVBQ0EwXHVDNUI0XHVDNjk0P2ApO1xuICAgICAgaWYgKG9rKSBvbkNsb3NlPy4oKTtcbiAgICB9XG4gIH0sIFtkaXJ0eSwgb25DbG9zZSwgb25TYXZlRHJhZnQsIHByb21wdE5hbWVdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuO1xuICAgIC8vIEVTQyBcdUQwQTQgXHVDQzk4XHVCOUFDXG4gICAgY29uc3Qgb25LZXkgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyB8fCBlLmtleSA9PT0gJ0VzYycpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBoYW5kbGVBdHRlbXB0Q2xvc2UoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgIC8vIGJvZHkgc2Nyb2xsIGxvY2tcbiAgICBjb25zdCBwcmV2T3ZlcmZsb3cgPSBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93O1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAvLyBoaXN0b3J5IFx1QjRBNFx1Qjg1Q1x1QUMwMFx1QUUzMCBcdUNDOThcdUI5QUMgXHUyMDE0IHB1c2hTdGF0ZSArIHBvcHN0YXRlXG4gICAgbGV0IHB1c2hlZCA9IGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBiZ25qTW9kYWw6IHRydWUgfSwgJycpO1xuICAgICAgcHVzaGVkID0gdHJ1ZTtcbiAgICB9IGNhdGNoIHt9XG4gICAgY29uc3Qgb25Qb3AgPSAoZSkgPT4geyBoYW5kbGVBdHRlbXB0Q2xvc2UoKTsgfTtcbiAgICBpZiAocHVzaGVkKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvblBvcCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IHByZXZPdmVyZmxvdztcbiAgICAgIGlmIChwdXNoZWQpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25Qb3ApO1xuICAgICAgICAvLyBcdUJBQThcdUIyRUNcdUM3NzQgXHVDODE1XHVDMEMxIFx1QjJFQlx1RDYxNFx1QzczQ1x1QkE3NCBoaXN0b3J5IHB1c2hTdGF0ZSBcdUIzQzQgXHVCNDE4XHVCM0NDXHVCOUJDLlxuICAgICAgICB0cnkgeyBpZiAod2luZG93Lmhpc3Rvcnkuc3RhdGU/LmJnbmpNb2RhbCkgd2luZG93Lmhpc3RvcnkuYmFjaygpOyB9IGNhdGNoIHt9XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW29wZW4sIGhhbmRsZUF0dGVtcHRDbG9zZV0pO1xuXG4gIC8vIGJhY2tkcm9wIFx1RDA3NFx1QjlBRCBcdUQ1NzhcdUI0RTRcdUI3RUMgXHUyMDE0IGNvbnRlbnQgXHVDNjc4XHVCRDgwIFx1RDA3NFx1QjlBRFx1QjlDQyBhdHRlbXB0Q2xvc2UuXG4gIGNvbnN0IG9uQmFja2Ryb3BDbGljayA9IFJlYWN0LnVzZUNhbGxiYWNrKChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQpIGhhbmRsZUF0dGVtcHRDbG9zZSgpO1xuICB9LCBbaGFuZGxlQXR0ZW1wdENsb3NlXSk7XG5cbiAgcmV0dXJuIHsgb25CYWNrZHJvcENsaWNrLCBoYW5kbGVBdHRlbXB0Q2xvc2UgfTtcbn07XG5cbi8vIFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUM2QjBcdUQ1NThcdUIyRTggJ1x1QjlFOCBcdUM3MDRcdUI4NUMnIFx1RDUwQ1x1Qjg1Q1x1RDMwNSBcdUJDODRcdUQyQkMgXHUyMDE0IFx1Qzc3Q1x1QzgxNSBcdUFDNzBcdUI5QUMgXHVDNzc0XHVDMEMxIFx1QzJBNFx1RDA2Q1x1Qjg2NFx1QjQxQyBcdUQ2QzQgXHVCMTc4XHVDRDlDXG5jb25zdCBTY3JvbGxUb1RvcCA9ICgpID0+IHtcbiAgY29uc3QgW3Zpc2libGUsIHNldFZpc2libGVdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBmaW5kU2Nyb2xsZXIgPSAoKSA9PiB7XG4gICAgLy8gXHVBRDAwXHVCOUFDXHVDNzkwIFx1RDM5OFx1Qzc3NFx1QzlDMFx1QjI5NCBcdUIwQjRcdUJEODAgXHVDRUU4XHVEMTRDXHVDNzc0XHVCMTA4XHVBQzAwIFx1QjUzMFx1Qjg1QyBcdUMyQTRcdUQwNkNcdUI4NjRcdUI0MThcdUJCQzBcdUI4NUMgXHVBREY4XHVDQUJEXHVCM0M0IFx1RDU2OFx1QUVEOCBcdUFDMTBcdUMyRENcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpPy5jbG9zZXN0KCdtYWluJykgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9O1xuICBjb25zdCBnZXRTY3JvbGxZID0gKCkgPT4ge1xuICAgIGNvbnN0IGFkbWluU2Nyb2xsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbYXJpYS1sYWJlbD1cIlx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUJBNTRcdUIyNzRcIl0gKyBkaXYnKTtcbiAgICBpZiAoYWRtaW5TY3JvbGxlcikge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KGFkbWluU2Nyb2xsZXIuc2Nyb2xsVG9wIHx8IDAsIHdpbmRvdy5zY3JvbGxZIHx8IDApO1xuICAgIH1cbiAgICByZXR1cm4gd2luZG93LnNjcm9sbFkgfHwgMDtcbiAgfTtcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblNjcm9sbCA9ICgpID0+IHNldFZpc2libGUoZ2V0U2Nyb2xsWSgpID4gMzIwKTtcbiAgICBvblNjcm9sbCgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvblNjcm9sbCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIGNvbnN0IGFkbWluU2Nyb2xsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbYXJpYS1sYWJlbD1cIlx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUJBNTRcdUIyNzRcIl0gKyBkaXYnKTtcbiAgICBpZiAoYWRtaW5TY3JvbGxlcikgYWRtaW5TY3JvbGxlci5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvblNjcm9sbCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgICAgaWYgKGFkbWluU2Nyb2xsZXIpIGFkbWluU2Nyb2xsZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICBjb25zdCBnb1RvcCA9ICgpID0+IHtcbiAgICBjb25zdCBhZG1pblNjcm9sbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2FyaWEtbGFiZWw9XCJcdUFEMDBcdUI5QUNcdUM3OTAgXHVCQTU0XHVCMjc0XCJdICsgZGl2Jyk7XG4gICAgaWYgKGFkbWluU2Nyb2xsZXIgJiYgYWRtaW5TY3JvbGxlci5zY3JvbGxUb3AgPiAwKSB7XG4gICAgICBhZG1pblNjcm9sbGVyLnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgfVxuICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICB9O1xuXG4gIGlmICghdmlzaWJsZSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBvbkNsaWNrPXtnb1RvcH1cbiAgICAgIGFyaWEtbGFiZWw9XCJcdUI5RTggXHVDNzA0XHVCODVDXCJcbiAgICAgIHRpdGxlPVwiXHVCOUU4IFx1QzcwNFx1Qjg1Q1wiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgcmlnaHQ6IDI0LCBib3R0b206IDI4LCB6SW5kZXg6IDYwLFxuICAgICAgICB3aWR0aDogNDgsIGhlaWdodDogNDgsXG4gICAgICAgIGJhY2tncm91bmQ6ICd2YXIoLS1iZy0yKScsIGNvbG9yOiAndmFyKC0tZ29sZCknLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tZ29sZC1kaW0pJyxcbiAgICAgICAgYm94U2hhZG93OiAnMCA4cHggMjRweCByZ2JhKDAsMCwwLDAuNDUpJyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2VyaWYpJyxcbiAgICAgICAgZm9udFNpemU6IDIyLFxuICAgICAgfX0+XG4gICAgICBcdTIxOTFcbiAgICA8L2J1dHRvbj5cbiAgKTtcbn07XG5cblxuLy8gXHVDNzkxXHVDMTMxXHVDNzkwIFx1QjRGMVx1QUUwOSBcdUJDMzBcdUM5QzAgXHUyMDE0IFx1QUM4Q1x1QzJEQ1x1QUUwMC9cdUIzMTNcdUFFMDAgXHVDNzkxXHVDMTMxXHVDNzkwIFx1QzYwNlx1QzVEMCBcdUM3NzhcdUI3N0NcdUM3NzhcdUM3M0NcdUI4NUMgXHVENDVDXHVDMkRDXG5jb25zdCBBdXRob3JHcmFkZUJhZGdlID0gKHsgYXV0aG9ySWQsIGF1dGhvciwgYXV0aG9yRW1haWwsIHNpemUgPSBcInNtXCIgfSkgPT4ge1xuICBjb25zdCBncmFkZSA9IHdpbmRvdy5CR05KX0FVVEhPUl9HUkFERT8uKHsgYXV0aG9ySWQsIGF1dGhvciwgYXV0aG9yRW1haWwgfSk7XG4gIGlmICghZ3JhZGUpIHJldHVybiBudWxsO1xuICBjb25zdCBzbWFsbCA9IHNpemUgPT09IFwic21cIjtcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgY2xhc3NOYW1lPVwibW9ub1wiXG4gICAgICB0aXRsZT17YCR7Z3JhZGUubGFiZWx9IFx1MDBCNyAke2dyYWRlLmRlc2MgfHwgJyd9YH1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBtYXJnaW5MZWZ0OiA2LFxuICAgICAgICBwYWRkaW5nOiBzbWFsbCA/ICcxcHggNnB4JyA6ICcycHggOHB4JyxcbiAgICAgICAgZm9udFNpemU6IHNtYWxsID8gOSA6IDEwLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4xNGVtJyxcbiAgICAgICAgY29sb3I6IGdyYWRlLmNvbG9yIHx8ICd2YXIoLS1nb2xkKScsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke2dyYWRlLmNvbG9yIHx8ICd2YXIoLS1nb2xkLWRpbSknfWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogMixcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgfX0+XG4gICAgICB7Z3JhZGUubGFiZWx9XG4gICAgPC9zcGFuPlxuICApO1xufTtcblxuLy8gXHVDNTRDXHVCOUJDIFx1QkNBOCBcdTIwMTQgXHVDNkIwXHVDMEMxXHVCMkU4IFx1QjBCNFx1QkU0NFx1QUM4Q1x1Qzc3NFx1QzE1OFx1QzVEMCBcdUIxNzhcdUNEOUNcbmNvbnN0IE5vdGlmaWNhdGlvbkJlbGwgPSAoeyB1c2VyLCBvblBpY2sgfSkgPT4ge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFt0aWNrLCBzZXRUaWNrXSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCByZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG5cbiAgLy8gXHVCMkU0XHVCOTc4IFx1RDBFRC9cdUMxMzhcdUMxNThcdUM1RDBcdUMxMUMgXHVDNTRDXHVCOUJDXHVDNzc0IFx1Q0Q5NFx1QUMwMFx1QjQxOFx1QkE3NCBzdG9yYWdlIFx1Qzc3NFx1QkNBNFx1RDJCOFx1Qjg1QyBcdUFDMzFcdUMyRTBcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblN0b3JhZ2UgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnYmdual9ub3RpZmljYXRpb25zJykgc2V0VGljaygodCkgPT4gdCArIDEpO1xuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3JhZ2UnLCBvblN0b3JhZ2UpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3RvcmFnZScsIG9uU3RvcmFnZSk7XG4gIH0sIFtdKTtcblxuICAvLyBcdUM2NzhcdUJEODAgXHVEMDc0XHVCOUFEXHVDNzNDXHVCODVDIFx1QjJFQlx1QUUzMFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuO1xuICAgIGNvbnN0IG9uRG9jID0gKGUpID0+IHtcbiAgICAgIGlmIChyZWYuY3VycmVudCAmJiAhcmVmLmN1cnJlbnQuY29udGFpbnMoZS50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKTtcbiAgICB9O1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jKTtcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2MpO1xuICB9LCBbb3Blbl0pO1xuXG4gIGlmICghdXNlcikgcmV0dXJuIG51bGw7XG4gIC8vIEJHTkpfQ09NTVVOSVRZIFx1QUMwMCBcdUJEODBcdUJEODQgXHVCODVDXHVCNERDXHVCNDFDIFx1QzJEQ1x1QzgxMFx1QzVEMCBcdUQ2MzhcdUNEOUNcdUIzRkNcdUIzQzQgXHVENjU0XHVCQTc0XHVDNzc0IFx1QUU2OFx1QzlDMFx1QzlDMCBcdUM1NEFcdUIzQzRcdUI4NUQgXHVCQUE4XHVCNEUwIFx1RDYzOFx1Q0Q5Q1x1QzVEMCBcdUM2MzVcdUMxNTRcdUIxMTAgXHVDQ0I0XHVDNzc0XHVCMkREICsgXHVBQzAwXHVCNERDXG4gIGNvbnN0IHJhd0xpc3QgPSAoKCkgPT4geyB0cnkgeyByZXR1cm4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5saXN0Tm90aWZpY2F0aW9ucz8uKHVzZXIuaWQpOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH0pKCk7XG4gIGNvbnN0IGxpc3QgPSBBcnJheS5pc0FycmF5KHJhd0xpc3QpID8gcmF3TGlzdCA6IFtdO1xuICBjb25zdCB1bnJlYWQgPSBsaXN0LmZpbHRlcigobikgPT4gbiAmJiAhbi5yZWFkKS5sZW5ndGg7XG5cbiAgY29uc3QgcGljayA9IChuKSA9PiB7XG4gICAgdHJ5IHsgd2luZG93LkJHTkpfQ09NTVVOSVRZPy5tYXJrTm90aWZpY2F0aW9uUmVhZD8uKHVzZXIuaWQsIG4uaWQpOyB9IGNhdGNoIHt9XG4gICAgc2V0T3BlbihmYWxzZSk7XG4gICAgaWYgKG9uUGljaykgb25QaWNrKG4pO1xuICAgIHNldFRpY2soKHQpID0+IHQgKyAxKTtcbiAgfTtcblxuICBjb25zdCBtYXJrQWxsID0gKCkgPT4ge1xuICAgIHRyeSB7IHdpbmRvdy5CR05KX0NPTU1VTklUWT8ubWFya0FsbE5vdGlmaWNhdGlvbnNSZWFkPy4odXNlci5pZCk7IH0gY2F0Y2gge31cbiAgICBzZXRUaWNrKCh0KSA9PiB0ICsgMSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHJlZj17cmVmfSBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9fT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICBhcmlhLWxhYmVsPXtgXHVDNTRDXHVCOUJDICR7dW5yZWFkID4gMCA/IGAke3VucmVhZH1cdUFDNzQgXHVDNTQ4IFx1Qzc3RFx1Qzc0Q2AgOiAnJ31gfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2KSA9PiAhdil9XG4gICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBwYWRkaW5nOiAnNnB4IDEwcHgnLCBtaW5XaWR0aDogMzYgfX0+XG4gICAgICAgIDxzdmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCJcbiAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjEuNlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnIH19PlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNiA4YTYgNiAwIDAgMSAxMiAwYzAgNyAzIDkgMyA5SDNzMy0yIDMtOVwiLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTEwLjMgMjFhMS45NCAxLjk0IDAgMCAwIDMuNCAwXCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAge3VucmVhZCA+IDAgJiYgKFxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogLTQsIHJpZ2h0OiAtNCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3ZhcigtLWdvbGQpJywgY29sb3I6ICd2YXIoLS1iZyknLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDk5OSwgZm9udFNpemU6IDksIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzFweCA1cHgnLCBsZXR0ZXJTcGFjaW5nOiAwLFxuICAgICAgICAgICAgICBtaW5XaWR0aDogMTQsIHRleHRBbGlnbjogJ2NlbnRlcicsIGxpbmVIZWlnaHQ6IDEuNCxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3VucmVhZCA+IDkgPyAnOSsnIDogdW5yZWFkfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gJiYgKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIlx1QzU0Q1x1QjlCQyBcdUJBQTlcdUI4NURcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnY2FsYygxMDAlICsgOHB4KScsIHJpZ2h0OiAwLFxuICAgICAgICAgICAgd2lkdGg6IDMyMCwgbWF4SGVpZ2h0OiA0MDAsIG92ZXJmbG93OiAnYXV0bycsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAndmFyKC0tYmctMiknLCBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnMCAxNnB4IDQwcHggcmdiYSgwLDAsMCwwLjUpJyxcbiAgICAgICAgICAgIHpJbmRleDogNTAsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCAxNHB4JywgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZ29sZFwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogJzAuMjJlbScgfX0+XHVDNTRDXHVCOUJDIFx1MDBCNyB7bGlzdC5sZW5ndGh9PC9zcGFuPlxuICAgICAgICAgICAge3VucmVhZCA+IDAgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXttYXJrQWxsfSBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgY29sb3I6ICd2YXIoLS1pbmstMiknIH19Plx1QkFBOFx1QjQ1MCBcdUM3N0RcdUM3NEM8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2xpc3QubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17eyBwYWRkaW5nOiAyNCwgdGV4dEFsaWduOiAnY2VudGVyJywgZm9udFNpemU6IDEzIH19PlxuICAgICAgICAgICAgICBcdUM1NDRcdUM5QzEgXHVCQzFCXHVDNzQwIFx1QzU0Q1x1QjlCQ1x1Qzc3NCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPHVsIHN0eWxlPXt7IGxpc3RTdHlsZTogJ25vbmUnLCBtYXJnaW46IDAsIHBhZGRpbmc6IDAgfX0+XG4gICAgICAgICAgICAgIHtsaXN0Lm1hcCgobikgPT4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e24uaWR9PlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gcGljayhuKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLCB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTJweCAxNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBuLnJlYWQgPyAndHJhbnNwYXJlbnQnIDogJ3JnYmEoMjQ1LDIxMyw3MiwwLjA2KScsXG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IDEyLCBjb2xvcjogJ3ZhcigtLWluayknLCBtYXJnaW5Cb3R0b206IDQsIGxpbmVIZWlnaHQ6IDEuNSB9fT5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCI+e24uZnJvbU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbVwiPiBcdTAwQjcge24ubWVzc2FnZSB8fCAnXHVDMEM4IFx1QzU0Q1x1QjlCQyd9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge24ucG9zdFRpdGxlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgbGluZUhlaWdodDogMS41LCBvdmVyZmxvdzogJ2hpZGRlbicsIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJywgd2hpdGVTcGFjZTogJ25vd3JhcCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBcdTI1Qjgge24ucG9zdFRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17eyBmb250U2l6ZTogMTAsIG1hcmdpblRvcDogNCwgbGV0dGVyU3BhY2luZzogJzAuMWVtJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7bmV3IERhdGUobi5jcmVhdGVkQXQpLnRvTG9jYWxlU3RyaW5nKCdrby1LUicpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVCRTBDXHVCNzlDXHVCNERDIFx1QjlDOFx1RDA2QyBcdTIwMTQgXHVCMTc4XHVCNzgwIFx1Qjc3Q1x1QzZCNFx1QjREQyBcdUMwQUNcdUFDMDFcdUQ2MTUgKyAnQicgXHVDRUY3XHVDNTQ0XHVDNkMzICsgXHVCQzQ1XHVBRTMwICsgXHVCQ0M0XHVCNEU0LlxuLy8gUERGIFx1QzZEMFx1QkNGOCBcdUFFMzBcdUJDMThcdUM3M0NcdUI4NUMgU1ZHIFx1QzdBQ1x1QUQ2Q1x1QzEzMS4gXHVDOEZDIFx1QzBDOVx1QzBDMVx1Qzc0MCBcdUJFMENcdUI3OUNcdUI0REMgXHVCMTc4XHVCNzgwXHVDMEM5ICNGNUQ1NDguXG5jb25zdCBCYW5naW5vamFJY29uID0gKHsgc2l6ZSA9IDIyIH0pID0+IChcbiAgPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSB2aWV3Qm94PVwiMCAwIDY0IDY0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgey8qIFx1Qjc3Q1x1QzZCNFx1QjREQyBcdUMwQUNcdUFDMDFcdUQ2MTUgXHVCQzMwXHVBQ0JEICovfVxuICAgIDxyZWN0IHdpZHRoPVwiNjRcIiBoZWlnaHQ9XCI2NFwiIHJ4PVwiOVwiIHJ5PVwiOVwiIGZpbGw9XCIjRjVENTQ4XCIvPlxuICAgIHsvKiAnQicgXHVDRUY3XHVDNTQ0XHVDNkMzIFx1MjAxNCBcdUI0NTAgXHVBQzFDXHVDNzU4IFx1QjQ2NVx1QURGQyBcdUJDRkNcdUI5NjhcdUM3NzQgXHVDODhDXHVDRTIxIFx1QzEzOFx1Qjg1QyBcdUFFMzBcdUI0NjVcdUM1RDAgXHVCRDk5XHVDNzQwIFx1RDYxNVx1RDBEQy4gZmlsbFJ1bGU9ZXZlbm9kZCBcdUI4NUMgXHVDNTQ4XHVDQUJEIFx1QkU0OCBcdUFDRjVcdUFDMDRcdUM3NDQgXHVDRUY3XHVDNTQ0XHVDNkMzLiAqL31cbiAgICA8cGF0aFxuICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgIGQ9XCJNIDkgOCBMIDkgNTYgTCAzMiA1NiBDIDQyIDU2IDQ3IDUxIDQ3IDQ0LjUgQyA0NyAzOS41IDQ0IDM2IDM5LjUgMzUgQyA0MyAzMy41IDQ1LjUgMzAuNSA0NS41IDI2IEMgNDUuNSAxOC41IDQwIDE0IDMwIDE0IEwgOSAxNCBaIE0gMTggMTkgTCAyOCAxOSBDIDMzIDE5IDM2IDIxIDM2IDI1IEMgMzYgMjkgMzMgMzEgMjggMzEgTCAxOCAzMSBaIE0gMTggMzYgTCAzMCAzNiBDIDM2IDM2IDM5IDM4LjUgMzkgNDMgQyAzOSA0Ny41IDM2IDUwIDMwIDUwIEwgMTggNTAgWlwiXG4gICAgICBmaWxsPVwiI0ZGRkZGRlwiLz5cbiAgICB7LyogXHVCQzQ1XHVBRTMwIChcdUJFNDRcdUQ1ODlcdUFFMzApIFx1MjAxNCBCIFx1Qzc1OCBcdUMwQzFcdUIyRTggXHVCRTQ4IFx1QUNGNVx1QUMwNFx1Qzc0NCBcdUFDMDBcdUI4NUNcdUM5QzBcdUI5NzRcdUJBNzAgXHVDODhDXHVDRTIxIFx1QzcwNFx1QzVEMFx1QzExQyBcdUM2QjBcdUNFMjEgXHVDNTQ0XHVCNzk4XHVCODVDICovfVxuICAgIDxwYXRoXG4gICAgICBkPVwiTSAyNiAyMi41IEMgMjcgMjEuNSAyOCAyMS41IDI4LjUgMjIuNSBMIDMxIDI3IEwgMzggMjUgQyAzOC44IDI0LjggMzkuNCAyNS4yIDM5LjUgMjYgQyAzOS42IDI2LjYgMzkuMyAyNy4xIDM4LjggMjcuNCBMIDMyLjUgMzAuNyBMIDMzLjUgMzYuNSBMIDM2IDM3LjggQyAzNi40IDM4IDM2LjUgMzguNCAzNi4zIDM4LjcgQyAzNi4yIDM5IDM1LjkgMzkuMSAzNS42IDM5IEwgMzEuNSAzOCBMIDI4IDM5LjUgQyAyNy43IDM5LjYgMjcuMyAzOS40IDI3LjIgMzkgQyAyNy4xIDM4LjcgMjcuMyAzOC40IDI3LjYgMzguMiBMIDMwIDM3IEwgMjguNyAzMiBMIDI0IDMzLjUgQyAyMy40IDMzLjcgMjIuOSAzMy40IDIyLjggMzIuOCBDIDIyLjcgMzIuMyAyMyAzMS45IDIzLjUgMzEuNyBMIDI3LjUgMzAuMiBMIDI2LjMgMjYgTCAyNS41IDI0LjUgQyAyNS4yIDI0IDI1LjQgMjMuMyAyNiAyMyBaXCJcbiAgICAgIGZpbGw9XCIjRjVENTQ4XCIvPlxuICAgIHsvKiBcdUJDQzQgKHNwYXJrbGUpIFx1MjAxNCA0LVx1QzgxMCBcdUIyRTRcdUM3NzRcdUM1NDRcdUJBQUNcdUI0REMgNSBcdUFDMUMuIFx1QzZCMFx1Q0UyMSBcdUMwQzFcdUIyRThcdUM1RDBcdUMxMUMgXHVDNkIwXHVDRTIxIFx1RDU1OFx1QjJFOFx1QzczQ1x1Qjg1QyBcdUQ3NjlcdUM1QjRcdUM5RDAgKi99XG4gICAgPGcgZmlsbD1cIiNGRkZGRkZcIj5cbiAgICAgIDxwYXRoIGQ9XCJNIDUzIDE1IEwgNTQuNSAxOCBMIDU3LjUgMTkuNSBMIDU0LjUgMjEgTCA1MyAyNCBMIDUxLjUgMjEgTCA0OC41IDE5LjUgTCA1MS41IDE4IFpcIi8+XG4gICAgICA8cGF0aCBkPVwiTSA1OCAyNiBMIDU5IDI4IEwgNjEgMjkgTCA1OSAzMCBMIDU4IDMyIEwgNTcgMzAgTCA1NSAyOSBMIDU3IDI4IFpcIi8+XG4gICAgICA8cGF0aCBkPVwiTSA1MCAzMyBMIDUwLjcgMzQuNSBMIDUyLjIgMzUgTCA1MC43IDM1LjUgTCA1MCAzNyBMIDQ5LjMgMzUuNSBMIDQ3LjggMzUgTCA0OS4zIDM0LjUgWlwiLz5cbiAgICAgIDxwYXRoIGQ9XCJNIDU1IDQwIEwgNTUuNSA0MSBMIDU2LjUgNDEuNSBMIDU1LjUgNDIgTCA1NSA0MyBMIDU0LjUgNDIgTCA1My41IDQxLjUgTCA1NC41IDQxIFpcIi8+XG4gICAgICA8cGF0aCBkPVwiTSA1OSAzNiBMIDU5LjQgMzcgTCA2MC40IDM3LjUgTCA1OS40IDM4IEwgNTkgMzkgTCA1OC42IDM4IEwgNTcuNiAzNy41IEwgNTguNiAzNyBaXCIvPlxuICAgIDwvZz5cbiAgPC9zdmc+XG4pO1xuXG5jb25zdCBCcmFuZCA9ICh7IG9uQ2xpY2sgfSkgPT4ge1xuICBjb25zdCBzYyA9IHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fTtcbiAgY29uc3QgYnJhbmQgPSBzYy5icmFuZCB8fCB7IG5hbWU6IFwiXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXCIsIHN1YjogXCJCQU5HSU5PSkFcIiB9O1xuICBjb25zdCBsb2dvID0gc2MuYnJhbmRpbmc/LmxvZ29EYXRhVXJpO1xuICByZXR1cm4gKFxuICAgIDxidXR0b25cbiAgICAgIGNsYXNzTmFtZT1cImJyYW5kXCJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICBhcmlhLWxhYmVsPXtgJHticmFuZC5uYW1lfSBcdUQ2NDhcdUM3M0NcdUI4NUNgfVxuICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidub25lJywgYm9yZGVyOidub25lJywgcGFkZGluZzowLCBjdXJzb3I6J3BvaW50ZXInfX0+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJicmFuZC1tYXJrXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgIHtsb2dvXG4gICAgICAgICAgPyA8aW1nIHNyYz17bG9nb30gYWx0PVwiXCIgc3R5bGU9e3t3aWR0aDoyMiwgaGVpZ2h0OjIyLCBvYmplY3RGaXQ6J2NvbnRhaW4nLCBkaXNwbGF5OidibG9jayd9fS8+XG4gICAgICAgICAgOiA8QmFuZ2lub2phSWNvbiBzaXplPXsyMn0vPn1cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJyYW5kLW5hbWVcIj5cbiAgICAgICAge2JyYW5kLm5hbWV9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN1YlwiIGxhbmc9XCJlblwiPnticmFuZC5zdWJ9PC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApO1xufTtcblxuY29uc3QgTmF2ID0gKHsgcm91dGUsIGdvLCB1c2VyLCBvbkxvZ291dCB9KSA9PiB7XG4gIGNvbnN0IG5hdkwgPSAod2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9KS5uYXYgfHwge307XG4gIGNvbnN0IFttb2JpbGVPcGVuLCBzZXRNb2JpbGVPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgLy8gXHVCNzdDXHVDNkIwXHVEMkI4IFx1QkNDMFx1QUNCRCBcdUMyREMgXHVCQUE4XHVCQzE0XHVDNzdDIFx1QkE1NFx1QjI3NCBcdUM3OTBcdUIzRDkgXHVCMkVCXHVENzk4XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7IHNldE1vYmlsZU9wZW4oZmFsc2UpOyB9LCBbcm91dGVdKTtcbiAgLy8gXHVCQUE4XHVCQzE0XHVDNzdDIFx1QkE1NFx1QjI3NCBcdUM1RjRcdUI5QkMgXHVDMkRDOiBFc2NhcGUgXHVCMkVCXHVBRTMwICsgYm9keSBzY3JvbGwgbG9jayArIHZpZXdwb3J0IFx1RDY1NVx1QjMwMCBcdUMyREMgXHVDNzkwXHVCM0Q5IFx1QjJFQlx1RDc5OFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbW9iaWxlT3BlbikgcmV0dXJuO1xuICAgIGNvbnN0IG9uS2V5ID0gKGUpID0+IHsgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgc2V0TW9iaWxlT3BlbihmYWxzZSk7IH07XG4gICAgY29uc3Qgb25SZXNpemUgPSAoKSA9PiB7IGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDkwMCkgc2V0TW9iaWxlT3BlbihmYWxzZSk7IH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uUmVzaXplKTtcbiAgICBjb25zdCBwcmV2ID0gZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdztcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uUmVzaXplKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBwcmV2O1xuICAgIH07XG4gIH0sIFttb2JpbGVPcGVuXSk7XG4gIC8vIFx1QjE4MFx1Qzc5MCBcdUJBNTRcdUFDMDBcdUJBNTRcdUIyNzQgXHVDNzkwXHVDMkREIChcdUM3NThcdUMyRERcdUM4RkM6IFx1QkEzOVx1QUNFMC9cdUM3OTBcdUFDRTAvXHVDMEFDXHVBQ0UwKS4gXCJcdUIxODBcdUM3OTBcIiBcdUM3OTBcdUNDQjQgXHVEMDc0XHVCOUFEIFx1QzJEQyBcdUNDQUIgXHVENTZEXHVCQUE5XHVDNzNDXHVCODVDIFx1QzlDNFx1Qzc4NS5cbiAgY29uc3QgcGxheUNoaWxkcmVuID0gW1xuICAgIHsga2V5OiBcImVhdFwiLCAgIGxhYmVsOiBuYXZMLmVhdCAgIHx8IFwiXHVCQTM5XHVBQ0UwIFx1QjE4MFx1Qzc5MFwiLCAgZGVzYzogXCJcdUMyREQgXHU5OERGIFx1MjAxNCBcdUQ1NUNcdUM4MTVcdUMyRERcdTAwQjdcdUQ1QTVcdUQxQTBcdUM3NENcdUMyRERcdTAwQjdcdUMyRENcdUM3QTVcIiB9LFxuICAgIHsga2V5OiBcInNsZWVwXCIsIGxhYmVsOiBuYXZMLnNsZWVwIHx8IFwiXHVDNzkwXHVBQ0UwIFx1QjE4MFx1Qzc5MFwiLCAgZGVzYzogXCJcdUM4RkMgXHU0RjRGIFx1MjAxNCBcdUQ1NUNcdUM2MjVcdTAwQjdcdUFDRTBcdUQwRERcdTAwQjdcdUQxNUNcdUQ1MENcdUMyQTRcdUQxNENcdUM3NzRcIiB9LFxuICAgIHsga2V5OiBcInNob3BcIiwgIGxhYmVsOiBuYXZMLnNob3AgIHx8IFwiXHVDMEFDXHVBQ0UwIFx1QjE4MFx1Qzc5MFwiLCAgZGVzYzogXCJcdUM3NTggXHU4ODYzIFx1MjAxNCBcdUM4MDRcdUQxQjVcdUFDRjVcdUM2MDhcdTAwQjdcdUQxQTBcdUMwQjBcdUJCM0NcIiB9LFxuICBdO1xuICBjb25zdCBwbGF5S2V5cyA9IHBsYXlDaGlsZHJlbi5tYXAoKHApID0+IHAua2V5KTtcblxuICBjb25zdCBpdGVtcyA9IFtcbiAgICB7IGtleTogXCJob21lXCIsIGxhYmVsOiBuYXZMLmhvbWUgfHwgXCJcdUQ2NDhcIiB9LFxuICAgIHsga2V5OiBcInBsYXlcIiwgbGFiZWw6IG5hdkwucGxheSB8fCBcIlx1QjE4MFx1Qzc5MFwiLCBpc01lZ2E6ICdwbGF5JywgZGVmYXVsdFJvdXRlOiAnZWF0JyB9LFxuICAgIHsga2V5OiBcInRvdXJcIiwgbGFiZWw6IG5hdkwudG91ciB8fCBcIlx1RDIyQ1x1QzVCNFwiIH0sXG4gICAgeyBrZXk6IFwibGVjdHVyZXNcIiwgbGFiZWw6IG5hdkwubGVjdHVyZXMgfHwgXCJcdUFDMTVcdUM1RjBcIiB9LFxuICAgIHsga2V5OiBcImNvbHVtblwiLCBsYWJlbDogbmF2TC5jb2x1bW4gfHwgXCJcdUNFN0NcdUI3RkNcIiB9LFxuICAgIHsga2V5OiBcImNvbW11bml0eVwiLCBsYWJlbDogbmF2TC5jb21tdW5pdHkgfHwgXCJcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjBcIiwgaXNNZWdhOiAnY29tbXVuaXR5JyB9LFxuICBdO1xuICAvLyBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVCQTU0XHVBQzAwXHVCQTU0XHVCMjc0OiBCR05KX1NUT1JFUy5jYXRlZ29yaWVzXHVDNzU4IGJvYXJkVHlwZT1jb21tdW5pdHkgKyBcdUMwQUNcdUM2QTlcdUM3OTAgXHVCNEYxXHVBRTA5IFx1QUMwMFx1QzJEQyBcdUNFNzRcdUQxNENcdUFDRTBcdUI5QUNcbiAgY29uc3QgdXNlckxldmVsID0gd2luZG93LkJHTkpfVVNFUl9MRVZFTCA/IHdpbmRvdy5CR05KX1VTRVJfTEVWRUwodXNlcikgOiAodXNlciA/IDEwIDogMCk7XG4gIGNvbnN0IGNvbW11bml0eUJvYXJkcyA9ICh3aW5kb3cuQkdOSl9TVE9SRVM/LmNhdGVnb3JpZXMgfHwgW10pXG4gICAgLmZpbHRlcigoYykgPT4gYy5ib2FyZFR5cGUgPT09ICdjb21tdW5pdHknICYmIHVzZXJMZXZlbCA+PSAoYy5taW5MZXZlbCA/PyAwKSk7XG5cbiAgY29uc3QgZ29Cb2FyZCA9IChib2FyZElkKSA9PiB7XG4gICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX2JvYXJkX2lkJywgYm9hcmRJZCk7IH0gY2F0Y2gge31cbiAgICBnbygnY29tbXVuaXR5Jyk7XG4gIH07XG5cbiAgLy8gXHVENjVDXHVDMTMxIFx1QzBDMVx1RDBEQyBcdUQzMTBcdUM4MTUgXHUyMDE0IFx1QkE1NFx1QUMwMCBcdUFERjhcdUI4RjlcdUM3NDAgXHVDNzkwXHVDMkREIFx1Qjc3Q1x1QzZCMFx1RDJCOFx1QjNDNCBcdUQ2NUNcdUMxMzFcdUM3M0NcdUI4NUMgXHVBQzA0XHVDOEZDXG4gIGNvbnN0IGlzQWN0aXZlID0gKGl0KSA9PiB7XG4gICAgaWYgKGl0LmlzTWVnYSA9PT0gJ3BsYXknKSByZXR1cm4gcGxheUtleXMuaW5jbHVkZXMocm91dGUpO1xuICAgIHJldHVybiByb3V0ZSA9PT0gaXQua2V5O1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPG5hdiBjbGFzc05hbWU9e2BuYXYgJHttb2JpbGVPcGVuID8gJ21vYmlsZS1vcGVuJyA6ICcnfWB9IGFyaWEtbGFiZWw9XCJcdUM4RkMgXHVCQTU0XHVCMjc0XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBuYXYtaW5uZXJcIj5cbiAgICAgICAgPEJyYW5kIG9uQ2xpY2s9eygpID0+IGdvKFwiaG9tZVwiKX0gLz5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm5hdi10b2dnbGVcIlxuICAgICAgICAgIGFyaWEtbGFiZWw9e21vYmlsZU9wZW4gPyBcIlx1QkE1NFx1QjI3NCBcdUIyRUJcdUFFMzBcIiA6IFwiXHVCQTU0XHVCMjc0IFx1QzVGNFx1QUUzMFwifVxuICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e21vYmlsZU9wZW59XG4gICAgICAgICAgYXJpYS1jb250cm9scz1cInByaW1hcnktbmF2LW1lbnVcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE1vYmlsZU9wZW4oKHYpID0+ICF2KX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmF2LXRvZ2dsZS1iYXJzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPHVsIGlkPVwicHJpbWFyeS1uYXYtbWVudVwiIGNsYXNzTmFtZT1cIm5hdi1tZW51XCIgcm9sZT1cImxpc3RcIiBzdHlsZT17e2xpc3RTdHlsZTonbm9uZScsIG1hcmdpbjowLCBwYWRkaW5nOjB9fT5cbiAgICAgICAgICB7aXRlbXMubWFwKGl0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc01lZ2EgPSBpdC5pc01lZ2EgPT09ICdwbGF5JyB8fCAoaXQuaXNNZWdhID09PSAnY29tbXVuaXR5JyAmJiBjb21tdW5pdHlCb2FyZHMubGVuZ3RoID4gMCk7XG4gICAgICAgICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4gZ28oaXQuZGVmYXVsdFJvdXRlIHx8IGl0LmtleSk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8bGkga2V5PXtpdC5rZXl9IHN0eWxlPXt7cG9zaXRpb246J3JlbGF0aXZlJ319IGNsYXNzTmFtZT17aGFzTWVnYSA/ICduYXYtaGFzLW1lZ2EnIDogJyd9PlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgbmF2LWxpbmsgJHtpc0FjdGl2ZShpdCkgPyBcImFjdGl2ZVwiIDogXCJcIn1gfVxuICAgICAgICAgICAgICAgICAgYXJpYS1jdXJyZW50PXtpc0FjdGl2ZShpdCkgPyBcInBhZ2VcIiA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9e2hhc01lZ2EgPyAnbWVudScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfT57aXQubGFiZWx9e2hhc01lZ2EgPyAnIFx1MjVCRScgOiAnJ308L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgIHtpdC5pc01lZ2EgPT09ICdwbGF5JyAmJiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1tZWdhXCIgcm9sZT1cIm1lbnVcIiBhcmlhLWxhYmVsPVwiXHVCMTgwXHVDNzkwIFx1MjAxNCBcdUM3NThcdUMyRERcdUM4RkMgXHVDRTc0XHVEMTRDXHVBQ0UwXHVCOUFDXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6JzEwMCUnLCBsZWZ0Oic1MCUnLCB0cmFuc2Zvcm06J3RyYW5zbGF0ZVgoLTUwJSknLFxuICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOjI4MCwgcGFkZGluZzonMTBweCAwJyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OicwIDE2cHggNDBweCByZ2JhKDE1LDIzLDQyLDAuMTApJyxcbiAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OidoaWRkZW4nLCBvcGFjaXR5OjAsIHRyYW5zaXRpb246J29wYWNpdHkgLjEycyBlYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6NTAsXG4gICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjksIGxldHRlclNwYWNpbmc6JzAuMjJlbScsIHBhZGRpbmc6JzZweCAxNnB4IDhweCd9fT5cdUM3NThcdUMyRERcdUM4RkMgXHU4ODYzXHU5OERGXHU0RjRGPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBzdHlsZT17e2xpc3RTdHlsZTonbm9uZScsIG1hcmdpbjowLCBwYWRkaW5nOjB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7cGxheUNoaWxkcmVuLm1hcCgocCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17cC5rZXl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvKHAua2V5KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonYmxvY2snLCB3aWR0aDonMTAwJScsIHRleHRBbGlnbjonbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOicxMHB4IDE2cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDondHJhbnNwYXJlbnQnLCBjb2xvcjondmFyKC0taW5rLTIpJywgYm9yZGVyOidub25lJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KGUpID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAndmFyKC0tYmctMiknOyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KGUpID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnOyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NTAwfX0+e3AubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4wNWVtJywgbWFyZ2luVG9wOjJ9fT57cC5kZXNjfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgey8qIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUM4MDRcdUM2QTk6IFx1QjE4MFx1Qzc5MCBcdUJBNTRcdUFDMDAgXHVDNzkwXHVDMkREXHVCNEU0XHVDNzQ0IFx1Qzc3OFx1Qjc3Q1x1Qzc3OCBcdUQzQkNcdUNFNjhcdUM3M0NcdUI4NUMgXHVCMTc4XHVDRDlDICovfVxuICAgICAgICAgICAgICAgIHtpdC5pc01lZ2EgPT09ICdwbGF5JyAmJiAoXG4gICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1zdWJtZW51XCIgcm9sZT1cImxpc3RcIiBhcmlhLWxhYmVsPVwiXHVCMTgwXHVDNzkwIFx1RDU1OFx1QzcwNFwiIHN0eWxlPXt7bGlzdFN0eWxlOidub25lJywgbWFyZ2luOjAsIHBhZGRpbmc6MH19PlxuICAgICAgICAgICAgICAgICAgICB7cGxheUNoaWxkcmVuLm1hcCgocCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e3Aua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YG5hdi1saW5rIG5hdi1zdWItbGluayAke3JvdXRlID09PSBwLmtleSA/ICdhY3RpdmUnIDogJyd9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1jdXJyZW50PXtyb3V0ZSA9PT0gcC5rZXkgPyAncGFnZScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvKHAua2V5KX0+e3AubGFiZWx9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAge2l0LmlzTWVnYSA9PT0gJ2NvbW11bml0eScgJiYgY29tbXVuaXR5Qm9hcmRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXYtbWVnYVwiIHJvbGU9XCJtZW51XCIgYXJpYS1sYWJlbD1cIlx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUJBQTlcdUI4NURcIlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDonMTAwJScsIGxlZnQ6JzUwJScsIHRyYW5zZm9ybTondHJhbnNsYXRlWCgtNTAlKScsXG4gICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6MjIwLCBwYWRkaW5nOicxMHB4IDAnLFxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6JzAgMTZweCA0MHB4IHJnYmEoMTUsMjMsNDIsMC4xMCknLFxuICAgICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6J2hpZGRlbicsIG9wYWNpdHk6MCwgdHJhbnNpdGlvbjonb3BhY2l0eSAuMTJzIGVhc2UnLFxuICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDo1MCxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6OSwgbGV0dGVyU3BhY2luZzonMC4yMmVtJywgcGFkZGluZzonNnB4IDE2cHggOHB4J319PkJPQVJEUzwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8dWwgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBtYXJnaW46MCwgcGFkZGluZzowfX0+XG4gICAgICAgICAgICAgICAgICAgICAge2NvbW11bml0eUJvYXJkcy5tYXAoKGIpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2IuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvQm9hcmQoYi5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2Jsb2NrJywgd2lkdGg6JzEwMCUnLCB0ZXh0QWxpZ246J2xlZnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzonOHB4IDE2cHgnLCBmb250U2l6ZToxMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3RyYW5zcGFyZW50JywgY29sb3I6J3ZhcigtLWluay0yKScsIGJvcmRlcjonbm9uZScsIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhlKSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3ZhcigtLWJnLTIpJzsgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhlKSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3RyYW5zcGFyZW50JzsgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2IubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgPGxpIHN0eWxlPXt7Ym9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknLCBtYXJnaW5Ub3A6NiwgcGFkZGluZ1RvcDo2fX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnbygnY29tbXVuaXR5Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonYmxvY2snLCB3aWR0aDonMTAwJScsIHRleHRBbGlnbjonbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzonOHB4IDE2cHgnLCBmb250U2l6ZToxMiwgbGV0dGVyU3BhY2luZzonMC4xOGVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid0cmFuc3BhcmVudCcsIGNvbG9yOid2YXIoLS1zZWNvbmRhcnkpJywgYm9yZGVyOidub25lJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHVDODA0XHVDQ0I0IFx1QkNGNFx1QUUzMCBcdTIxOTI8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgICAgey8qIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUM4MDRcdUM2QTk6IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM1NjFcdUMxNThcdUM3NDQgXHVCQTU0XHVCMjc0IFx1QjBCNFx1QkQ4MFx1QzVEMCBcdUIxNzhcdUNEOUMuIFx1QjM3MFx1QzJBNFx1RDA2Q1x1RDBEMVx1QzVEMFx1QzEyMCAubmF2LW1vYmlsZS1vbmx5IENTUyBcdUI4NUMgXHVDMjI4XHVBRTQwLiAqL31cbiAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1vbmx5IG5hdi1tb2JpbGUtZGl2aWRlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiLz5cbiAgICAgICAgICB7dXNlciA/IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtbW9iaWxlLW9ubHlcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXYtbGlua1wiIG9uQ2xpY2s9eygpID0+IGdvKFwibXlwYWdlXCIpfT5cdUI5QzhcdUM3NzRcdUQzOThcdUM3NzRcdUM5QzA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAge3VzZXIuaXNBZG1pbiAmJiAoXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1tb2JpbGUtb25seVwiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBvbkNsaWNrPXsoKSA9PiBnbyhcImFkbWluXCIpfT5cdUFEMDBcdUI5QUM8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1vbmx5XCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBvbkNsaWNrPXtvbkxvZ291dH0+XHVCODVDXHVBREY4XHVDNTQ0XHVDNkMzPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1tb2JpbGUtb25seVwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgb25DbGljaz17KCkgPT4gZ28oXCJsb2dpblwiKX0+XHVCODVDXHVBREY4XHVDNzc4PC9idXR0b24+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtbW9iaWxlLW9ubHlcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXYtbGlua1wiIG9uQ2xpY2s9eygpID0+IGdvKFwic2lnbnVwXCIpfT5cdUQ2OENcdUM2RDBcdUFDMDBcdUM3ODU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvdWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2LWFjdGlvbnNcIj5cbiAgICAgICAgICB7dXNlciA/IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm9cIiBhcmlhLWxhYmVsPXtgXHVCODVDXHVBREY4XHVDNzc4OiAke3VzZXIubmFtZX1gfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTEsIGxldHRlclNwYWNpbmc6JzAuMTVlbScsIGNvbG9yOid2YXIoLS1pbmstMiknfX0+e3VzZXIubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDxOb3RpZmljYXRpb25CZWxsIHVzZXI9e3VzZXJ9IG9uUGljaz17KG4pID0+IHtcbiAgICAgICAgICAgICAgICAvLyBcdUM1NENcdUI5QkMgXHVEMEMwXHVDNzg1XHVCQ0M0IFx1Qjc3Q1x1QzZCMFx1RDMwNSBcdTIwMTQgXHVBQzE1XHVDNUYwL1x1RDIyQ1x1QzVCNC9cdUM4RkNcdUJCMzgvXHVCMzEzXHVBRTAwXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGlmIChuLnR5cGUgPT09ICdjb21tZW50JyAmJiBuLnBvc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcsIFN0cmluZyhuLnBvc3RJZCkpO1xuICAgICAgICAgICAgICAgICAgICBnbygnY29tbXVuaXR5Jyk7IHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChuLnR5cGUgPT09ICdsZWN0dXJlX2NvbmZpcm1lZCcgfHwgbi50eXBlID09PSAnbGVjdHVyZV9wcm9tb3RlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4ubGVjdHVyZUlkKSBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfbGVjdHVyZV9pZCcsIFN0cmluZyhuLmxlY3R1cmVJZCkpO1xuICAgICAgICAgICAgICAgICAgICBnbygnbGVjdHVyZXMnKTsgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKG4udHlwZSA9PT0gJ3RvdXJfY29uZmlybWVkJyB8fCBuLnR5cGUgPT09ICd0b3VyX3Byb21vdGVkJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobi50b3VySWQpIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2JnbmpfcGVuZGluZ190b3VyX2lkJywgU3RyaW5nKG4udG91cklkKSk7XG4gICAgICAgICAgICAgICAgICAgIGdvKCd0b3VyJyk7IHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChTdHJpbmcobi50eXBlIHx8ICcnKS5zdGFydHNXaXRoKCdvcmRlcl8nKSkge1xuICAgICAgICAgICAgICAgICAgICBnbygnbXlwYWdlJyk7IHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIC8vIFx1RDNGNFx1QkMzMSBcdTIwMTQgcG9zdElkXHVBQzAwIFx1Qzc4OFx1QzczQ1x1QkE3NCBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjBcbiAgICAgICAgICAgICAgICAgIGlmIChuLnBvc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcsIFN0cmluZyhuLnBvc3RJZCkpO1xuICAgICAgICAgICAgICAgICAgICBnbygnY29tbXVuaXR5Jyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgICAgICAgICB9fS8+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IGdvKFwibXlwYWdlXCIpfT5cdUI5QzhcdUM3NzRcdUQzOThcdUM3NzRcdUM5QzA8L2J1dHRvbj5cbiAgICAgICAgICAgICAge3VzZXIuaXNBZG1pbiAmJiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gZ28oXCJhZG1pblwiKX0+XHVBRDAwXHVCOUFDPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9e29uTG9nb3V0fT5cdUI4NUNcdUFERjhcdUM1NDRcdUM2QzM8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3QgbmF2LWxpbmtcIiBvbkNsaWNrPXsoKSA9PiBnbyhcImxvZ2luXCIpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTIsIGxldHRlclNwYWNpbmc6JzAuMWVtJywgY29sb3I6J3ZhcigtLWluay0yKSd9fT5cdUI4NUNcdUFERjhcdUM3Nzg8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gZ28oXCJzaWdudXBcIil9Plx1RDY4Q1x1QzZEMFx1QUMwMFx1Qzc4NTwvYnV0dG9uPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25hdj5cbiAgKTtcbn07XG5cbmNvbnN0IEZvb3RlciA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3Qgc2MgPSAod2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9KTtcbiAgY29uc3QgY29udGFjdCA9IHNjLmNvbnRhY3QgfHwge307XG4gIGNvbnN0IGZvb3RlciA9IHNjLmZvb3RlciB8fCB7fTtcbiAgY29uc3QgZlN0eWxlID0gKHdpbmRvdy5CR05KX0ZPT1RFUl9TVFlMRT8uKCkgfHwgd2luZG93LkJHTkpfRk9PVEVSX1NUWUxFX0RFRkFVTFQpO1xuICBjb25zdCBlbWFpbCA9IGNvbnRhY3QuZW1haWwgfHwgXCJoZWxsb0BiZ25qLm5ldFwiO1xuICBjb25zdCBwaG9uZSA9IGNvbnRhY3QucGhvbmUgfHwgXCIwMi0wMDAwLTAwMDBcIjtcbiAgY29uc3QgcGhvbmVIcmVmID0gY29udGFjdC5waG9uZUhyZWYgfHwgKFwidGVsOlwiICsgKHBob25lIHx8IFwiXCIpLnJlcGxhY2UoL1teMC05K10vZywgXCJcIikpO1xuICBjb25zdCBhZGRyZXNzID0gY29udGFjdC5hZGRyZXNzIHx8IFwiXHVDMTFDXHVDNkI4XHVEMkI5XHVCQ0M0XHVDMkRDXCI7XG4gIGNvbnN0IGhlYWRpbmdTdHlsZSA9IHtcbiAgICBmb250U2l6ZTogZlN0eWxlLmhlYWRpbmcuZm9udFNpemUsXG4gICAgZm9udFdlaWdodDogZlN0eWxlLmhlYWRpbmcuZm9udFdlaWdodCxcbiAgICBsZXR0ZXJTcGFjaW5nOiBgJHtmU3R5bGUuaGVhZGluZy5sZXR0ZXJTcGFjaW5nfWVtYCxcbiAgICBjb2xvcjogYHZhcigke2ZTdHlsZS5oZWFkaW5nLmNvbG9yfSlgLFxuICB9O1xuICByZXR1cm4gKFxuICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiZm9vdGVyXCIgYXJpYS1sYWJlbD1cIlx1QzBBQ1x1Qzc3NFx1RDJCOCBcdUM4MTVcdUJDRjQgXHVCQzBGIFx1RDQ3OFx1RDEzMFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItZ3JpZFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8QnJhbmQgb25DbGljaz17KCkgPT4gZ28oXCJob21lXCIpfS8+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e1xuICAgICAgICAgICAgICBtYXJnaW5Ub3A6MjAsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBmU3R5bGUuZGVzY3JpcHRpb24uZm9udFNpemUsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGZTdHlsZS5kZXNjcmlwdGlvbi5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiBmU3R5bGUuZGVzY3JpcHRpb24ubGluZUhlaWdodCxcbiAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtmU3R5bGUuZGVzY3JpcHRpb24uY29sb3J9KWAsXG4gICAgICAgICAgICAgIG1heFdpZHRoOiBmU3R5bGUuZGVzY3JpcHRpb24ubWF4V2lkdGgsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2Zvb3Rlci5kZXNjcmlwdGlvbiB8fCBcIlx1QkM0NVx1QUUzMFx1RDBDMFx1QUNFMCBcdUIxNzhcdUM3OTAuIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1QjI5NCBcdUQ1NUNcdUFENkRcdUM3NTggXHVDNUVEXHVDMEFDXHUwMEI3XHVCQjM4XHVENjU0XHUwMEI3XHVDNzkwXHVDNUYwXHVDNzQ0IFx1QzlDMVx1QzgxMSBcdUFDNzdcdUFDRTAgXHVCMjkwXHVCMDdDXHVCQTcwIFx1QjA5OFx1QjIwNFx1QjI5NCBcdUM1RUNcdUQ1ODkgXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwXHVDNzg1XHVCMkM4XHVCMkU0LiBcdUFEODFcdUFEOTAgXHVCMkY1XHVDMEFDXHVCRDgwXHVEMTMwIFx1QzlDMFx1QzVFRCBcdUM1RUNcdUQ1ODlcdUFFNENcdUM5QzAsIFx1RDU2OFx1QUVEOCBcdUI5Q0NcdUI0RTRcdUM1QjRcdUFDMDBcdUIyOTQgXHVDNUVDXHVENTg5LlwifVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxuYXYgYXJpYS1sYWJlbD1cIlx1Q0Y1OFx1RDE1MFx1Q0UyMCBcdUJDMTRcdUI4NUNcdUFDMDBcdUFFMzBcIj5cbiAgICAgICAgICAgIDxoNCBpZD1cImZ0LWNvbnRlbnRcIiBzdHlsZT17aGVhZGluZ1N0eWxlfT5cdUNGNThcdUQxNTBcdUNFMjA8L2g0PlxuICAgICAgICAgICAgPHVsIGFyaWEtbGFiZWxsZWRieT1cImZ0LWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwiY29sdW1uXCIpfT5cdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVDRTdDXHVCN0ZDPC9idXR0b24+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwidG91clwiKX0+XHVEMjJDXHVDNUI0IFx1RDUwNFx1Qjg1Q1x1QURGOFx1QjdBODwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcImJvb2tcIil9Plx1MzAwRVx1QzY1NVx1Qzc1OFx1QUUzOFx1MzAwRjwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcImNvbW11bml0eVwiKX0+XHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwPC9idXR0b24+PC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgPG5hdiBhcmlhLWxhYmVsPVwiXHVDODE1XHVCQ0Y0IFx1QkMxNFx1Qjg1Q1x1QUMwMFx1QUUzMFwiPlxuICAgICAgICAgICAgPGg0IGlkPVwiZnQtaW5mb1wiIHN0eWxlPXtoZWFkaW5nU3R5bGV9Plx1QzgxNVx1QkNGNDwvaDQ+XG4gICAgICAgICAgICA8dWwgYXJpYS1sYWJlbGxlZGJ5PVwiZnQtaW5mb1wiPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJob21lXCIpfT5cdUFDMTVcdUM1RjAgXHVDNzdDXHVDODE1PC9idXR0b24+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwiY29tbXVuaXR5XCIpfT5cdUFDRjVcdUM5QzBcdUMwQUNcdUQ1NkQ8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJmYXFcIil9Plx1Qzc5MFx1QzhGQyBcdUJCM0JcdUIyOTQgXHVDOUM4XHVCQjM4PC9idXR0b24+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwidGVybXNcIil9Plx1Qzc3NFx1QzZBOVx1QzU3RFx1QUQwMDwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcInByaXZhY3lcIil9Plx1QUMxQ1x1Qzc3OFx1QzgxNVx1QkNGNCBcdUNDOThcdUI5QUNcdUJDMjlcdUNFNjg8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L25hdj5cbiAgICAgICAgICA8YWRkcmVzcyBzdHlsZT17e2ZvbnRTdHlsZTonbm9ybWFsJ319PlxuICAgICAgICAgICAgPGg0IGlkPVwiZnQtY29udGFjdFwiIHN0eWxlPXtoZWFkaW5nU3R5bGV9Plx1QzVGMFx1Qjc3RDwvaDQ+XG4gICAgICAgICAgICA8dWwgYXJpYS1sYWJlbGxlZGJ5PVwiZnQtY29udGFjdFwiPlxuICAgICAgICAgICAgICB7ZW1haWwgJiYgPGxpPjxhIGhyZWY9e2BtYWlsdG86JHtlbWFpbH1gfT57ZW1haWx9PC9hPjwvbGk+fVxuICAgICAgICAgICAgICB7cGhvbmUgJiYgPGxpPjxhIGhyZWY9e3Bob25lSHJlZn0+e3Bob25lfTwvYT48L2xpPn1cbiAgICAgICAgICAgICAge2FkZHJlc3MgJiYgPGxpPjxzcGFuPnthZGRyZXNzfTwvc3Bhbj48L2xpPn1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9hZGRyZXNzPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItYm90dG9tXCIgc3R5bGU9e3ttYXJnaW5Ub3A6MjR9fT5cbiAgICAgICAgICA8c3Bhbj5cdTAwQTkgMjAyNiBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgQkFOR0lOT0pBIFx1MjAxNCBBTEwgUklHSFRTIFJFU0VSVkVEPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjEwLCBsZXR0ZXJTcGFjaW5nOicwLjE0ZW0nfX0+XG4gICAgICAgICAgICB2e3dpbmRvdy5CR05KX1ZFUlNJT04/LnZlcnNpb24gfHwgJzAuMC4wJ30gXHUwMEI3IHt3aW5kb3cuQkdOSl9WRVJTSU9OPy5idWlsZCB8fCAnXHUyMDE0J31cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPFRoZW1lVG9nZ2xlLz5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udFNpemU6IGZTdHlsZS5zaWduYXR1cmUuZm9udFNpemUsXG4gICAgICAgICAgICBmb250V2VpZ2h0OiBmU3R5bGUuc2lnbmF0dXJlLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBgJHtmU3R5bGUuc2lnbmF0dXJlLmxldHRlclNwYWNpbmd9ZW1gLFxuICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtmU3R5bGUuc2lnbmF0dXJlLmNvbG9yfSlgLFxuICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogZlN0eWxlLnNpZ25hdHVyZS50ZXh0VHJhbnNmb3JtIHx8ICd1cHBlcmNhc2UnLFxuICAgICAgICAgIH19Pntmb290ZXIuc2lnbmF0dXJlIHx8IFwiXHVCQzQ1XHVBRTMwXHVEMEMwXHVBQ0UwIFx1QjE3OFx1Qzc5MCBcdTAwQjcgREVTSUdORUQgSU4gU0VPVUxcIn08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9mb290ZXI+XG4gICk7XG59O1xuXG4vLyBcdUQxNENcdUI5QzggXHVEMUEwXHVBRTAwIFx1MjAxNCBsaWdodCBcdTIxOTIgZGFyayBcdTIxOTIgYXV0byBcdTIxOTIgbGlnaHQgXHVDMjFDXHVENjU4LiBCR05KX1RIRU1FIFx1RDVFQ1x1RDM3Q1x1QzY0MCBcdUM5REQuXG5jb25zdCBUaGVtZVRvZ2dsZSA9ICgpID0+IHtcbiAgY29uc3QgW21vZGUsIHNldE1vZGVdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4gKHdpbmRvdy5CR05KX1RIRU1FPy5nZXQ/LigpIHx8ICdhdXRvJykpO1xuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uQ2hhbmdlID0gKCkgPT4gc2V0TW9kZSh3aW5kb3cuQkdOSl9USEVNRT8uZ2V0Py4oKSB8fCAnYXV0bycpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZ25qLXRoZW1lLWNoYW5nZScsIG9uQ2hhbmdlKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JnbmotdGhlbWUtY2hhbmdlJywgb25DaGFuZ2UpO1xuICB9LCBbXSk7XG4gIGlmICghd2luZG93LkJHTkpfVEhFTUUpIHJldHVybiBudWxsO1xuICBjb25zdCBuZXh0ID0gd2luZG93LkJHTkpfVEhFTUUuY3ljbGUuYmluZCh3aW5kb3cuQkdOSl9USEVNRSk7XG4gIGNvbnN0IGljb24gPSBtb2RlID09PSAnZGFyaycgPyAnXHVEODNDXHVERjE5JyA6IG1vZGUgPT09ICdsaWdodCcgPyAnXHUyNjAwJyA6ICdcdTI1RDAnO1xuICBjb25zdCBsYWJlbCA9IG1vZGUgPT09ICdkYXJrJyA/ICdEQVJLJyA6IG1vZGUgPT09ICdsaWdodCcgPyAnTElHSFQnIDogJ0FVVE8nO1xuICByZXR1cm4gKFxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRoZW1lLXRvZ2dsZVwiIG9uQ2xpY2s9eygpID0+IG5leHQoKX0gYXJpYS1sYWJlbD17YFx1RDE0Q1x1QjlDOCBcdUM4MDRcdUQ2NTggXHUyMDE0IFx1RDYwNFx1QzdBQyAke2xhYmVsfWB9IHRpdGxlPVwiXHVEMTRDXHVCOUM4OiBcdUI3N0NcdUM3NzRcdUQyQjggLyBcdUIyRTRcdUQwNkMgLyBcdUM3OTBcdUIzRDlcIj5cbiAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPntpY29ufTwvc3Bhbj48c3Bhbj57bGFiZWx9PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApO1xufTtcblxuY29uc3QgT3JuYW1lbnQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwib3JuYW1lbnRcIiBzdHlsZT17e21hcmdpbjpcIjQwcHggMFwifX0+XG4gICAgPHNwYW4gc3R5bGU9e3tmb250RmFtaWx5Oid2YXIoLS1mb250LXNlcmlmKScsIGZvbnRTaXplOjE0LCBsZXR0ZXJTcGFjaW5nOicwLjNlbScsIGNvbG9yOid2YXIoLS1nb2xkKSd9fT5cbiAgICAgIHtjaGlsZHJlbiB8fCBcIlx1NEU5NFwifVxuICAgIDwvc3Bhbj5cbiAgPC9kaXY+XG4pO1xuXG4vLyB0aXRsZSBhY2NlcHRzIHN0cmluZyBPUiBSZWFjdCBub2RlLiBGb3IgYWNjZW50LCBwYXNzIEpTWDogPD5cdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTBcdUM1RDAgPHNwYW4gY2xhc3NOYW1lPVwiYWNjZW50XCI+XHVDODA0XHVENTU4XHVCMjk0IFx1QjlEMDwvc3Bhbj48Lz5cbmNvbnN0IFNlY3Rpb25IZWFkID0gKHsgZXllYnJvdywgdGl0bGUsIHN1YnRpdGxlLCBhY3Rpb24sIGxldmVsID0gMiB9KSA9PiB7XG4gIGNvbnN0IEggPSBgaCR7bGV2ZWx9YDtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24taGVhZFwiPlxuICAgICAgPGRpdj5cbiAgICAgICAge2V5ZWJyb3cgJiYgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uLWV5ZWJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIj57ZXllYnJvd308L2Rpdj59XG4gICAgICAgIDxIIGNsYXNzTmFtZT1cInNlY3Rpb24tdGl0bGVcIj57dGl0bGV9PC9IPlxuICAgICAgICB7c3VidGl0bGUgJiYgPHAgY2xhc3NOYW1lPVwic2VjdGlvbi1zdWJ0aXRsZVwiPntzdWJ0aXRsZX08L3A+fVxuICAgICAgPC9kaXY+XG4gICAgICB7YWN0aW9ufVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgVHdlYWtzID0gKHsgdHdlYWtzLCBzZXRUd2Vha3MsIHZpc2libGUgfSkgPT4ge1xuICBpZiAoIXZpc2libGUpIHJldHVybiBudWxsO1xuICBjb25zdCBzZXQgPSAoaywgdikgPT4gc2V0VHdlYWtzKHsgLi4udHdlYWtzLCBba106IHYgfSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3NcIj5cbiAgICAgIDxoMz5Ud2Vha3M8L2gzPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3Mtcm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLWxhYmVsXCI+XHVDMkVDXHVCQ0ZDIFx1QzJBNFx1RDBDMFx1Qzc3QzwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1vcHRpb25zXCI+XG4gICAgICAgICAge1tcIm91dGxpbmVcIiwgXCJmaWxsZWRcIiwgXCJkYXNoZWRcIl0ubWFwKHMgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e3N9IGNsYXNzTmFtZT17dHdlYWtzLmxpbmVTdHlsZSA9PT0gcyA/IFwib25cIiA6IFwiXCJ9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldChcImxpbmVTdHlsZVwiLCBzKX0+XG4gICAgICAgICAgICAgIHtzID09PSBcIm91dGxpbmVcIiA/IFwiXHVDMTIwXCIgOiBzID09PSBcImZpbGxlZFwiID8gXCJcdUNDNDRcdUM2QzBcIiA6IFwiXHVEMzBDXHVDMTIwXCJ9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLXJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1sYWJlbFwiPlx1QUNFOFx1QjREQyBcdUFDMTVcdUIzQzQgXHUwMEI3IHt0d2Vha3MuaW50ZW5zaXR5LnRvRml4ZWQoMSl9PC9kaXY+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBjbGFzc05hbWU9XCJ0d2Vha3Mtc2xpZGVyXCJcbiAgICAgICAgICBtaW49XCIwLjNcIiBtYXg9XCIxLjhcIiBzdGVwPVwiMC4xXCJcbiAgICAgICAgICB2YWx1ZT17dHdlYWtzLmludGVuc2l0eX1cbiAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXQoXCJpbnRlbnNpdHlcIiwgcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSkpfS8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLXJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1sYWJlbFwiPlx1RDc4OFx1QzVCNFx1Qjg1QyBcdUI4MDhcdUM3NzRcdUM1NDRcdUM2QzM8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3Mtb3B0aW9uc1wiPlxuICAgICAgICAgIHtbXCJjZW50ZXJcIiwgXCJzcGxpdFwiLCBcImZ1bGxibGVlZFwiXS5tYXAocyA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uIGtleT17c30gY2xhc3NOYW1lPXt0d2Vha3MuaGVyb0xheW91dCA9PT0gcyA/IFwib25cIiA6IFwiXCJ9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldChcImhlcm9MYXlvdXRcIiwgcyl9PlxuICAgICAgICAgICAgICB7cyA9PT0gXCJjZW50ZXJcIiA/IFwiXHVDOTExXHVDNTU5XCIgOiBzID09PSBcInNwbGl0XCIgPyBcIlx1QkQ4NFx1RDU2MFwiIDogXCJcdUQ0ODBcdUJFMTRcdUI5QUNcdUI0RENcIn1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3Mtcm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLWxhYmVsXCI+XHVDNzc4XHVEMTMwXHVCNzk5XHVDMTU4PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLW9wdGlvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17dHdlYWtzLmludGVyYWN0aXZlID8gXCJvblwiIDogXCJcIn1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldChcImludGVyYWN0aXZlXCIsICF0d2Vha3MuaW50ZXJhY3RpdmUpfT5cbiAgICAgICAgICAgIHt0d2Vha3MuaW50ZXJhY3RpdmUgPyBcIk9OXCIgOiBcIk9GRlwifVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHVDRkUwXHVEMEE0IFx1QzJCOVx1Qzc3OCBcdUJDMzBcdUIxMDggXHUyMDE0IFx1Q0NBQiBcdUJDMjlcdUJCMzggXHVDMkRDIFx1RDQ1Q1x1QzJEQy4gXHVDMEFDXHVDNkE5XHVDNzkwXHVBQzAwIFx1QUNCMFx1QzgxNVx1RDU1OFx1QkE3NCBsb2NhbFN0b3JhZ2VcdUM1RDAgXHVDNjAxXHVDMThEXHVENjU0LlxuLy8gUElQQSAvIEdEUFIgXHVBQzAwXHVDNzc0XHVCNERDXHVCNzdDXHVDNzc4OiBcdUQ1NDRcdUMyMTgoXHVBRTMwXHVCMkE1KVx1QjI5NCBcdUMwQUNcdUM2QTlcdUM3OTAgXHVBQzcwXHVCRDgwIFx1QkQ4OFx1QUMwMCwgXHVCRDg0XHVDMTFEXHUwMEI3XHVCOUM4XHVDRjAwXHVEMzA1XHVDNzQwIFx1QzYzNVx1RDJCOFx1Qzc3OC5cbi8vIFx1QzgwMFx1QzdBNSBcdUQ2MTVcdUQwREM6IHsgbmVjZXNzYXJ5OnRydWUsIGFuYWx5dGljczpib29sLCBtYXJrZXRpbmc6Ym9vbCwgdHM6SVNPIH1cbmNvbnN0IENvb2tpZUNvbnNlbnQgPSAoKSA9PiB7XG4gIGNvbnN0IEtFWSA9ICdiZ25qX2Nvb2tpZV9jb25zZW50JztcbiAgY29uc3QgW2RlY2lzaW9uLCBzZXREZWNpc2lvbl0gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgdHJ5IHsgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oS0VZKTsgcmV0dXJuIHJhdyA/IEpTT04ucGFyc2UocmF3KSA6IG51bGw7IH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxuICB9KTtcbiAgY29uc3QgW2RldGFpbHMsIHNldERldGFpbHNdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbYW5hbHl0aWNzLCBzZXRBbmFseXRpY3NdID0gUmVhY3QudXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFttYXJrZXRpbmcsIHNldE1hcmtldGluZ10gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgcGVyc2lzdCA9IChuZXh0KSA9PiB7XG4gICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLCBKU09OLnN0cmluZ2lmeShuZXh0KSk7IH0gY2F0Y2gge31cbiAgICBzZXREZWNpc2lvbihuZXh0KTtcbiAgICB0cnkgeyB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2JnbmotY29va2llLWNvbnNlbnQnLCB7IGRldGFpbDogbmV4dCB9KSk7IH0gY2F0Y2gge31cbiAgfTtcblxuICBjb25zdCBhY2NlcHRBbGwgPSAoKSA9PiBwZXJzaXN0KHsgbmVjZXNzYXJ5OiB0cnVlLCBhbmFseXRpY3M6IHRydWUsIG1hcmtldGluZzogdHJ1ZSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9KTtcbiAgY29uc3QgcmVqZWN0QWxsID0gKCkgPT4gcGVyc2lzdCh7IG5lY2Vzc2FyeTogdHJ1ZSwgYW5hbHl0aWNzOiBmYWxzZSwgbWFya2V0aW5nOiBmYWxzZSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9KTtcbiAgY29uc3Qgc2F2ZUN1c3RvbSA9ICgpID0+IHBlcnNpc3QoeyBuZWNlc3Nhcnk6IHRydWUsIGFuYWx5dGljczogISFhbmFseXRpY3MsIG1hcmtldGluZzogISFtYXJrZXRpbmcsIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSk7XG5cbiAgaWYgKGRlY2lzaW9uKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJmYWxzZVwiIGFyaWEtbGFiZWxsZWRieT1cImNvb2tpZS1iYW5uZXItdGl0bGVcIlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsIGxlZnQ6IDE2LCByaWdodDogMTYsIGJvdHRvbTogMTYsXG4gICAgICAgIG1heFdpZHRoOiA3MjAsIG1hcmdpbjogJzAgYXV0bycsIHpJbmRleDogODAsXG4gICAgICAgIGJhY2tncm91bmQ6ICd2YXIoLS1iZy0yKScsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1nb2xkLWRpbSknLFxuICAgICAgICBib3hTaGFkb3c6ICcwIDE2cHggNDBweCByZ2JhKDAsMCwwLDAuNDUpJyxcbiAgICAgICAgcGFkZGluZzogJzIwcHggMjJweCcsIGJvcmRlclJhZGl1czogNCxcbiAgICAgIH19PlxuICAgICAgPGgyIGlkPVwiY29va2llLWJhbm5lci10aXRsZVwiIGNsYXNzTmFtZT1cImtvLXNlcmlmXCIgc3R5bGU9e3sgZm9udFNpemU6IDE2LCBtYXJnaW5Cb3R0b206IDggfX0+XHVDRkUwXHVEMEE0IFx1QzBBQ1x1QzZBOSBcdUIzRDlcdUM3NTg8L2gyPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3sgZm9udFNpemU6IDEzLCBsaW5lSGVpZ2h0OiAxLjcsIG1hcmdpbkJvdHRvbTogMTQgfX0+XG4gICAgICAgIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1QjI5NCBcdUMxMUNcdUJFNDRcdUMyQTQgXHVDNkI0XHVDNjAxXHVDNzQ0IFx1QzcwNFx1RDU1QyA8c3Ryb25nIGNsYXNzTmFtZT1cImdvbGRcIj5cdUQ1NDRcdUMyMTggXHVDRkUwXHVEMEE0PC9zdHJvbmc+XHVDNjQwLCBcdUMwQUNcdUM3NzRcdUQyQjggXHVBQzFDXHVDMTIwXHVDNzQ0IFx1QzcwNFx1RDU1Q1xuICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cImdvbGRcIj4gXHVCRDg0XHVDMTFEIFx1Q0ZFMFx1RDBBNDwvc3Ryb25nPlx1MDBCNzxzdHJvbmcgY2xhc3NOYW1lPVwiZ29sZFwiPlx1QjlDOFx1Q0YwMFx1RDMwNSBcdUNGRTBcdUQwQTQ8L3N0cm9uZz5cdUI5N0MgXHVDMEFDXHVDNkE5XHVENTY5XHVCMkM4XHVCMkU0LlxuICAgICAgICBcdUMxMzhcdUJEODAgXHVDMTI0XHVDODE1XHVDNUQwXHVDMTFDIFx1RDU2RFx1QkFBOVx1QkNDNFx1Qjg1QyBcdUMxMjBcdUQwRERcdUQ1NThcdUMyRTQgXHVDMjE4IFx1Qzc4OFx1QzVCNFx1QzY5NC5cbiAgICAgIDwvcD5cbiAgICAgIHtkZXRhaWxzICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDE0LCBwYWRkaW5nVG9wOiAxMCwgYm9yZGVyVG9wOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyB9fT5cbiAgICAgICAgICA8ZmllbGRzZXQgc3R5bGU9e3sgYm9yZGVyOiAnbm9uZScsIHBhZGRpbmc6IDAsIG1hcmdpbjogMCB9fT5cbiAgICAgICAgICAgIDxsZWdlbmQgY2xhc3NOYW1lPVwic3Itb25seVwiPlx1Q0ZFMFx1RDBBNCBcdUQ1NkRcdUJBQTlcdUJDQzQgXHVCM0Q5XHVDNzU4PC9sZWdlbmQ+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ2FwOiAxMCB9fT5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAxMCwgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLCBvcGFjaXR5OiAwLjcgfX0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQgcmVhZE9ubHkgYXJpYS1sYWJlbD1cIlx1RDU0NFx1QzIxOCBcdUNGRTBcdUQwQTQgKFx1RDU2RFx1QzBDMSBcdUQ2NUNcdUMxMzEpXCIvPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBmb250U2l6ZTogMTMgfX0+XHVENTQ0XHVDMjE4PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17eyBmb250U2l6ZTogMTIsIGRpc3BsYXk6ICdibG9jaycgfX0+XHVCODVDXHVBREY4XHVDNzc4IFx1QzEzOFx1QzE1OCwgXHVCQ0Y0XHVDNTQ4LCBcdUQ1NDRcdUMyMTggXHVBRTMwXHVCMkE1IFx1QjNEOVx1Qzc5MVx1QzVEMCBcdUMwQUNcdUM2QTkuIFx1QUM3MFx1QkQ4MCBcdUJEODhcdUFDMDAuPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAxMCwgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnIH19PlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXthbmFseXRpY3N9IG9uQ2hhbmdlPXsoZSkgPT4gc2V0QW5hbHl0aWNzKGUudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlx1QkQ4NFx1QzExRCBcdUNGRTBcdUQwQTQgXHVCM0Q5XHVDNzU4XCIvPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBmb250U2l6ZTogMTMgfX0+XHVCRDg0XHVDMTFEPC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17eyBmb250U2l6ZTogMTIsIGRpc3BsYXk6ICdibG9jaycgfX0+XHVCQzI5XHVCQjM4IFx1RDFCNVx1QUNDNFx1MDBCN1x1RDM5OFx1Qzc3NFx1QzlDMCBcdUMxMzFcdUIyQTUgXHVBQzFDXHVDMTIwXHVDNkE5LiBcdUMyRERcdUJDQzRcdUM3OTAgXHVDNzc1XHVCQTg1IFx1Q0M5OFx1QjlBQy48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6IDEwLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcgfX0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e21hcmtldGluZ30gb25DaGFuZ2U9eyhlKSA9PiBzZXRNYXJrZXRpbmcoZS50YXJnZXQuY2hlY2tlZCl9XG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiXHVCOUM4XHVDRjAwXHVEMzA1IFx1Q0ZFMFx1RDBBNCBcdUIzRDlcdUM3NThcIi8+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGZvbnRTaXplOiAxMyB9fT5cdUI5QzhcdUNGMDBcdUQzMDU8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMiwgZGlzcGxheTogJ2Jsb2NrJyB9fT5cdUFEMDBcdUMyRUNcdUMwQUMgXHVBRTMwXHVCQzE4IFx1QzU0OFx1QjBCNCwgXHVDNjc4XHVCRDgwIFx1QUQxMVx1QUNFMCBcdUI5RTRcdUNDQjQgXHVDNUYwXHVCM0Q5XHVDNUQwIFx1QzBBQ1x1QzZBOS48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogOCwgZmxleFdyYXA6ICd3cmFwJywganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcgfX0+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIiBvbkNsaWNrPXsoKSA9PiBzZXREZXRhaWxzKCh2KSA9PiAhdil9XG4gICAgICAgICAgYXJpYS1leHBhbmRlZD17ZGV0YWlsc30+XG4gICAgICAgICAge2RldGFpbHMgPyAnXHVBQzA0XHVCMkU4XHVENzg4JyA6ICdcdUMxMzhcdUJEODAgXHVDMTI0XHVDODE1J31cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIiBvbkNsaWNrPXtyZWplY3RBbGx9Plx1QkFBOFx1QjQ1MCBcdUFDNzBcdUJEODA8L2J1dHRvbj5cbiAgICAgICAge2RldGFpbHNcbiAgICAgICAgICA/IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGwgYnRuLWdvbGRcIiBvbkNsaWNrPXtzYXZlQ3VzdG9tfT5cdUMxMjBcdUQwREQgXHVDODAwXHVDN0E1PC9idXR0b24+XG4gICAgICAgICAgOiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsIGJ0bi1nb2xkXCIgb25DbGljaz17YWNjZXB0QWxsfT5cdUJBQThcdUI0NTAgXHVCM0Q5XHVDNzU4PC9idXR0b24+fVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5PYmplY3QuYXNzaWduKHdpbmRvdywgeyBCcmFuZCwgTmF2LCBGb290ZXIsIE9ybmFtZW50LCBTZWN0aW9uSGVhZCwgVHdlYWtzLCBBdXRob3JHcmFkZUJhZGdlLCBOb3RpZmljYXRpb25CZWxsLCBTY3JvbGxUb1RvcCwgQmFuZ2lub2phSWNvbiwgQ29va2llQ29uc2VudCB9KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQVFBLE9BQU8sZ0JBQWdCLFNBQVMsY0FBYyxFQUFFLE1BQU0sT0FBTyxTQUFTLGFBQWEsTUFBTSxHQUFHO0FBQzFGLFFBQU0sYUFBYSxTQUFTO0FBQzVCLFFBQU0scUJBQXFCLE1BQU0sWUFBWSxNQUFNO0FBQ2pELFFBQUksQ0FBQyxPQUFPO0FBQUU7QUFBYTtBQUFBLElBQVE7QUFDbkMsUUFBSSxhQUFhO0FBRWYsWUFBTSxNQUFNLE9BQU8sUUFBUSxHQUFHLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQSxvRkFBNEU7QUFDcEgsVUFBSSxLQUFLO0FBQ1AsWUFBSTtBQUFFLHNCQUFZO0FBQUEsUUFBRyxTQUFRO0FBQUEsUUFBQztBQUFBLE1BQ2hDO0FBQ0E7QUFBQSxJQUNGLE9BQU87QUFDTCxZQUFNLEtBQUssT0FBTyxRQUFRLEdBQUcsVUFBVSw0SEFBNkI7QUFDcEUsVUFBSSxHQUFJO0FBQUEsSUFDVjtBQUFBLEVBQ0YsR0FBRyxDQUFDLE9BQU8sU0FBUyxhQUFhLFVBQVUsQ0FBQztBQUU1QyxRQUFNLFVBQVUsTUFBTTtBQUNwQixRQUFJLENBQUMsS0FBTTtBQUVYLFVBQU0sUUFBUSxDQUFDLE1BQU07QUFDbkIsVUFBSSxFQUFFLFFBQVEsWUFBWSxFQUFFLFFBQVEsT0FBTztBQUN6QyxVQUFFLGVBQWU7QUFDakIsMkJBQW1CO0FBQUEsTUFDckI7QUFBQSxJQUNGO0FBQ0EsV0FBTyxpQkFBaUIsV0FBVyxLQUFLO0FBRXhDLFVBQU0sZUFBZSxTQUFTLEtBQUssTUFBTTtBQUN6QyxhQUFTLEtBQUssTUFBTSxXQUFXO0FBRS9CLFFBQUksU0FBUztBQUNiLFFBQUk7QUFDRixhQUFPLFFBQVEsVUFBVSxFQUFFLFdBQVcsS0FBSyxHQUFHLEVBQUU7QUFDaEQsZUFBUztBQUFBLElBQ1gsU0FBUTtBQUFB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

})();

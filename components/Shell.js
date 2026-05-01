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
  } }, footer.description || "\uBC45\uAE30\uD0C0\uACE0 \uB178\uC790. \uBC45\uAE30\uB178\uC790\uB294 \uD55C\uAD6D\uC758 \uC5ED\uC0AC\xB7\uBB38\uD654\xB7\uC790\uC5F0\uC744 \uC9C1\uC811 \uAC77\uACE0 \uB290\uB07C\uBA70 \uB098\uB204\uB294 \uC5EC\uD589 \uCEE4\uBBA4\uB2C8\uD2F0\uC785\uB2C8\uB2E4. \uAD81\uAD90 \uB2F5\uC0AC\uBD80\uD130 \uC9C0\uC5ED \uC5EC\uD589\uAE4C\uC9C0, \uD568\uAED8 \uB9CC\uB4E4\uC5B4\uAC00\uB294 \uC5EC\uD589.")), /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uCF58\uD150\uCE20 \uBC14\uB85C\uAC00\uAE30" }, /* @__PURE__ */ React.createElement("h4", { id: "ft-content", style: headingStyle }, footer.headingContent || "\uCF58\uD150\uCE20"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-content" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("column") }, "\uBC45\uAE30\uB178\uC790 \uCE7C\uB7FC")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("tour") }, "\uD22C\uC5B4 \uD504\uB85C\uADF8\uB7A8")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("book") }, "\u300E\uC655\uC758\uAE38\u300F")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("community") }, "\uCEE4\uBBA4\uB2C8\uD2F0")))), /* @__PURE__ */ React.createElement("nav", { "aria-label": "\uC815\uBCF4 \uBC14\uB85C\uAC00\uAE30" }, /* @__PURE__ */ React.createElement("h4", { id: "ft-info", style: headingStyle }, footer.headingInfo || "\uC815\uBCF4"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-info" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("home") }, "\uAC15\uC5F0 \uC77C\uC815")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("community") }, "\uACF5\uC9C0\uC0AC\uD56D")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("faq") }, "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("terms") }, "\uC774\uC6A9\uC57D\uAD00")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go("privacy") }, "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68")))), /* @__PURE__ */ React.createElement("address", { style: { fontStyle: "normal" } }, /* @__PURE__ */ React.createElement("h4", { id: "ft-contact", style: headingStyle }, footer.headingContact || "\uC5F0\uB77D"), /* @__PURE__ */ React.createElement("ul", { "aria-labelledby": "ft-contact" }, email && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: `mailto:${email}` }, email)), phone && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: phoneHref }, phone)), address && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("span", null, address))))), /* @__PURE__ */ React.createElement("div", { className: "footer-bottom", style: { marginTop: 24 } }, /* @__PURE__ */ React.createElement("span", null, footer.copyright || "\xA9 2026 \uBC45\uAE30\uB178\uC790 BANGINOJA \u2014 ALL RIGHTS RESERVED"), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.14em" } }, "v", ((_d = window.BGNJ_VERSION) == null ? void 0 : _d.version) || "0.0.0", " \xB7 ", ((_e = window.BGNJ_VERSION) == null ? void 0 : _e.build) || "\u2014"), /* @__PURE__ */ React.createElement(ThemeToggle, null), /* @__PURE__ */ React.createElement("span", { style: {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29tcG9uZW50cy9TaGVsbC5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFx1QUNGNVx1RDFCNSBcdUNFRjRcdUQzRUNcdUIxMENcdUQyQjg6IE5hdiwgRm9vdGVyLCBUd2Vha3MsIEJyYW5kLCBBdXRob3JHcmFkZUJhZGdlLCBOb3RpZmljYXRpb25CZWxsLCBTY3JvbGxUb1RvcFxuXG4vLyA9PT0gXHVCQUE4XHVCMkVDIFx1QUMwMFx1QjREQyBcdUQ2QzUgKHYwMC4wNjcpID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRVNDIFx1RDBBNCArIFx1QzY3OFx1QkQ4MCBcdUQwNzRcdUI5QUQoYmFja2Ryb3ApICsgXHVCRTBDXHVCNzdDXHVDNkIwXHVDODAwIFx1QjRBNFx1Qjg1Q1x1QUMwMFx1QUUzMCBcdUMyREMgXHVCQUE4XHVCMkVDXHVDNzQ0IFx1QjJFQlx1QUUzMCBcdUM4MDRcdUM1RDAgZGlydHkgXHVDMEMxXHVEMERDXHVCQTc0IFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QzVEMFx1QUM4QyBjb25maXJtLlxuLy8gXHVDMEFDXHVDNkE5XHVCQzk1OlxuLy8gICBjb25zdCB7IG9uQmFja2Ryb3BDbGljayB9ID0gdXNlTW9kYWxHdWFyZCh7IG9wZW4sIGRpcnR5LCBvbkNsb3NlLCBvblNhdmVEcmFmdCB9KTtcbi8vICAgPGRpdiBvbkNsaWNrPXtvbkJhY2tkcm9wQ2xpY2t9Pi4uLjwvZGl2PlxuLy8gb25TYXZlRHJhZnQgXHVBQzAwIFx1Qzc4OFx1QUNFMCBkaXJ0eSBcdUJBNzQgcHJvbXB0IFx1MjAxNCBcdUM4MDBcdUM3QTUgLyBcdUJDODRcdUI5QUNcdUFFMzAgLyBcdUNERThcdUMxOEMuXG53aW5kb3cudXNlTW9kYWxHdWFyZCA9IGZ1bmN0aW9uIHVzZU1vZGFsR3VhcmQoeyBvcGVuLCBkaXJ0eSwgb25DbG9zZSwgb25TYXZlRHJhZnQsIGxhYmVsIH0pIHtcbiAgY29uc3QgcHJvbXB0TmFtZSA9IGxhYmVsIHx8ICdcdUM3OTFcdUMxMzEgXHVDOTExXHVDNzc4IFx1QjBCNFx1QzZBOSc7XG4gIGNvbnN0IGhhbmRsZUF0dGVtcHRDbG9zZSA9IFJlYWN0LnVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoIWRpcnR5KSB7IG9uQ2xvc2U/LigpOyByZXR1cm47IH1cbiAgICBpZiAob25TYXZlRHJhZnQpIHtcbiAgICAgIC8vIFx1QzgwMFx1QzdBNShPSykgLyBcdUFERjhcdUIwRTUgXHVCMkVCXHVBRTMwKENhbmNlbCkuIFx1QjM1NCBcdUQ0OERcdUJEODBcdUQ1NUMgMy13YXkgXHVCMkU0XHVDNzc0XHVDNUJDXHVCODVDXHVBREY4XHVCMjk0IFx1RDZDNFx1QzE4RCBcdUMwQUNcdUM3NzRcdUQwNzQuXG4gICAgICBjb25zdCB5ZXMgPSB3aW5kb3cuY29uZmlybShgJHtwcm9tcHROYW1lfVx1Qzc3NChcdUFDMDApIFx1QzgwMFx1QzdBNVx1QjQxOFx1QzlDMCBcdUM1NEFcdUM1NThcdUMyQjVcdUIyQzhcdUIyRTQuXFxuXHVDNzg0XHVDMkRDXHVDODAwXHVDN0E1IFx1RDU1OFx1QzJEQ1x1QUNBMFx1QzVCNFx1QzY5ND9cXG5cXG5bXHVENjU1XHVDNzc4XSA9IFx1Qzc4NFx1QzJEQ1x1QzgwMFx1QzdBNSBcdUQ2QzQgXHVCMkVCXHVBRTMwXFxuW1x1Q0RFOFx1QzE4Q10gPSBcdUFERjhcdUIwRTUgXHVCMkVCXHVBRTMwIChcdUJDQzBcdUFDQkQgXHVCMEI0XHVDNkE5IFx1QkM4NFx1QjlCQylgKTtcbiAgICAgIGlmICh5ZXMpIHtcbiAgICAgICAgdHJ5IHsgb25TYXZlRHJhZnQoKTsgfSBjYXRjaCB7fVxuICAgICAgfVxuICAgICAgb25DbG9zZT8uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG9rID0gd2luZG93LmNvbmZpcm0oYCR7cHJvbXB0TmFtZX1cdUM3NzQoXHVBQzAwKSBcdUM4MDBcdUM3QTVcdUI0MThcdUM5QzAgXHVDNTRBXHVDNTU4XHVDMkI1XHVCMkM4XHVCMkU0LiBcdUM4MTVcdUI5RDAgXHVCMkVCXHVDNzNDXHVDMkRDXHVBQ0EwXHVDNUI0XHVDNjk0P2ApO1xuICAgICAgaWYgKG9rKSBvbkNsb3NlPy4oKTtcbiAgICB9XG4gIH0sIFtkaXJ0eSwgb25DbG9zZSwgb25TYXZlRHJhZnQsIHByb21wdE5hbWVdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuO1xuICAgIC8vIEVTQyBcdUQwQTQgXHVDQzk4XHVCOUFDXG4gICAgY29uc3Qgb25LZXkgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyB8fCBlLmtleSA9PT0gJ0VzYycpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBoYW5kbGVBdHRlbXB0Q2xvc2UoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgIC8vIGJvZHkgc2Nyb2xsIGxvY2tcbiAgICBjb25zdCBwcmV2T3ZlcmZsb3cgPSBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93O1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAvLyBoaXN0b3J5IFx1QjRBNFx1Qjg1Q1x1QUMwMFx1QUUzMCBcdUNDOThcdUI5QUMgXHUyMDE0IHB1c2hTdGF0ZSArIHBvcHN0YXRlXG4gICAgbGV0IHB1c2hlZCA9IGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBiZ25qTW9kYWw6IHRydWUgfSwgJycpO1xuICAgICAgcHVzaGVkID0gdHJ1ZTtcbiAgICB9IGNhdGNoIHt9XG4gICAgY29uc3Qgb25Qb3AgPSAoZSkgPT4geyBoYW5kbGVBdHRlbXB0Q2xvc2UoKTsgfTtcbiAgICBpZiAocHVzaGVkKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvblBvcCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IHByZXZPdmVyZmxvdztcbiAgICAgIGlmIChwdXNoZWQpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25Qb3ApO1xuICAgICAgICAvLyBcdUJBQThcdUIyRUNcdUM3NzQgXHVDODE1XHVDMEMxIFx1QjJFQlx1RDYxNFx1QzczQ1x1QkE3NCBoaXN0b3J5IHB1c2hTdGF0ZSBcdUIzQzQgXHVCNDE4XHVCM0NDXHVCOUJDLlxuICAgICAgICB0cnkgeyBpZiAod2luZG93Lmhpc3Rvcnkuc3RhdGU/LmJnbmpNb2RhbCkgd2luZG93Lmhpc3RvcnkuYmFjaygpOyB9IGNhdGNoIHt9XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW29wZW4sIGhhbmRsZUF0dGVtcHRDbG9zZV0pO1xuXG4gIC8vIGJhY2tkcm9wIFx1RDA3NFx1QjlBRCBcdUQ1NzhcdUI0RTRcdUI3RUMgXHUyMDE0IGNvbnRlbnQgXHVDNjc4XHVCRDgwIFx1RDA3NFx1QjlBRFx1QjlDQyBhdHRlbXB0Q2xvc2UuXG4gIGNvbnN0IG9uQmFja2Ryb3BDbGljayA9IFJlYWN0LnVzZUNhbGxiYWNrKChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQpIGhhbmRsZUF0dGVtcHRDbG9zZSgpO1xuICB9LCBbaGFuZGxlQXR0ZW1wdENsb3NlXSk7XG5cbiAgcmV0dXJuIHsgb25CYWNrZHJvcENsaWNrLCBoYW5kbGVBdHRlbXB0Q2xvc2UgfTtcbn07XG5cbi8vIFx1RDM5OFx1Qzc3NFx1QzlDMCBcdUM2QjBcdUQ1NThcdUIyRTggJ1x1QjlFOCBcdUM3MDRcdUI4NUMnIFx1RDUwQ1x1Qjg1Q1x1RDMwNSBcdUJDODRcdUQyQkMgXHUyMDE0IFx1Qzc3Q1x1QzgxNSBcdUFDNzBcdUI5QUMgXHVDNzc0XHVDMEMxIFx1QzJBNFx1RDA2Q1x1Qjg2NFx1QjQxQyBcdUQ2QzQgXHVCMTc4XHVDRDlDXG5jb25zdCBTY3JvbGxUb1RvcCA9ICgpID0+IHtcbiAgY29uc3QgW3Zpc2libGUsIHNldFZpc2libGVdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBmaW5kU2Nyb2xsZXIgPSAoKSA9PiB7XG4gICAgLy8gXHVBRDAwXHVCOUFDXHVDNzkwIFx1RDM5OFx1Qzc3NFx1QzlDMFx1QjI5NCBcdUIwQjRcdUJEODAgXHVDRUU4XHVEMTRDXHVDNzc0XHVCMTA4XHVBQzAwIFx1QjUzMFx1Qjg1QyBcdUMyQTRcdUQwNkNcdUI4NjRcdUI0MThcdUJCQzBcdUI4NUMgXHVBREY4XHVDQUJEXHVCM0M0IFx1RDU2OFx1QUVEOCBcdUFDMTBcdUMyRENcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpPy5jbG9zZXN0KCdtYWluJykgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9O1xuICBjb25zdCBnZXRTY3JvbGxZID0gKCkgPT4ge1xuICAgIGNvbnN0IGFkbWluU2Nyb2xsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbYXJpYS1sYWJlbD1cIlx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUJBNTRcdUIyNzRcIl0gKyBkaXYnKTtcbiAgICBpZiAoYWRtaW5TY3JvbGxlcikge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KGFkbWluU2Nyb2xsZXIuc2Nyb2xsVG9wIHx8IDAsIHdpbmRvdy5zY3JvbGxZIHx8IDApO1xuICAgIH1cbiAgICByZXR1cm4gd2luZG93LnNjcm9sbFkgfHwgMDtcbiAgfTtcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblNjcm9sbCA9ICgpID0+IHNldFZpc2libGUoZ2V0U2Nyb2xsWSgpID4gMzIwKTtcbiAgICBvblNjcm9sbCgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvblNjcm9sbCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIGNvbnN0IGFkbWluU2Nyb2xsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbYXJpYS1sYWJlbD1cIlx1QUQwMFx1QjlBQ1x1Qzc5MCBcdUJBNTRcdUIyNzRcIl0gKyBkaXYnKTtcbiAgICBpZiAoYWRtaW5TY3JvbGxlcikgYWRtaW5TY3JvbGxlci5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvblNjcm9sbCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgICAgaWYgKGFkbWluU2Nyb2xsZXIpIGFkbWluU2Nyb2xsZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICBjb25zdCBnb1RvcCA9ICgpID0+IHtcbiAgICBjb25zdCBhZG1pblNjcm9sbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2FyaWEtbGFiZWw9XCJcdUFEMDBcdUI5QUNcdUM3OTAgXHVCQTU0XHVCMjc0XCJdICsgZGl2Jyk7XG4gICAgaWYgKGFkbWluU2Nyb2xsZXIgJiYgYWRtaW5TY3JvbGxlci5zY3JvbGxUb3AgPiAwKSB7XG4gICAgICBhZG1pblNjcm9sbGVyLnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgfVxuICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICB9O1xuXG4gIGlmICghdmlzaWJsZSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBvbkNsaWNrPXtnb1RvcH1cbiAgICAgIGFyaWEtbGFiZWw9XCJcdUI5RTggXHVDNzA0XHVCODVDXCJcbiAgICAgIHRpdGxlPVwiXHVCOUU4IFx1QzcwNFx1Qjg1Q1wiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgcmlnaHQ6IDI0LCBib3R0b206IDI4LCB6SW5kZXg6IDYwLFxuICAgICAgICB3aWR0aDogNDgsIGhlaWdodDogNDgsXG4gICAgICAgIGJhY2tncm91bmQ6ICd2YXIoLS1iZy0yKScsIGNvbG9yOiAndmFyKC0tZ29sZCknLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tZ29sZC1kaW0pJyxcbiAgICAgICAgYm94U2hhZG93OiAnMCA4cHggMjRweCByZ2JhKDAsMCwwLDAuNDUpJyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtc2VyaWYpJyxcbiAgICAgICAgZm9udFNpemU6IDIyLFxuICAgICAgfX0+XG4gICAgICBcdTIxOTFcbiAgICA8L2J1dHRvbj5cbiAgKTtcbn07XG5cblxuLy8gXHVDNzkxXHVDMTMxXHVDNzkwIFx1QjRGMVx1QUUwOSBcdUJDMzBcdUM5QzAgXHUyMDE0IFx1QUM4Q1x1QzJEQ1x1QUUwMC9cdUIzMTNcdUFFMDAgXHVDNzkxXHVDMTMxXHVDNzkwIFx1QzYwNlx1QzVEMCBcdUM3NzhcdUI3N0NcdUM3NzhcdUM3M0NcdUI4NUMgXHVENDVDXHVDMkRDXG5jb25zdCBBdXRob3JHcmFkZUJhZGdlID0gKHsgYXV0aG9ySWQsIGF1dGhvciwgYXV0aG9yRW1haWwsIHNpemUgPSBcInNtXCIgfSkgPT4ge1xuICBjb25zdCBncmFkZSA9IHdpbmRvdy5CR05KX0FVVEhPUl9HUkFERT8uKHsgYXV0aG9ySWQsIGF1dGhvciwgYXV0aG9yRW1haWwgfSk7XG4gIGlmICghZ3JhZGUpIHJldHVybiBudWxsO1xuICBjb25zdCBzbWFsbCA9IHNpemUgPT09IFwic21cIjtcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgY2xhc3NOYW1lPVwibW9ub1wiXG4gICAgICB0aXRsZT17YCR7Z3JhZGUubGFiZWx9IFx1MDBCNyAke2dyYWRlLmRlc2MgfHwgJyd9YH1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBtYXJnaW5MZWZ0OiA2LFxuICAgICAgICBwYWRkaW5nOiBzbWFsbCA/ICcxcHggNnB4JyA6ICcycHggOHB4JyxcbiAgICAgICAgZm9udFNpemU6IHNtYWxsID8gOSA6IDEwLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4xNGVtJyxcbiAgICAgICAgY29sb3I6IGdyYWRlLmNvbG9yIHx8ICd2YXIoLS1nb2xkKScsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke2dyYWRlLmNvbG9yIHx8ICd2YXIoLS1nb2xkLWRpbSknfWAsXG4gICAgICAgIGJvcmRlclJhZGl1czogMixcbiAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgfX0+XG4gICAgICB7Z3JhZGUubGFiZWx9XG4gICAgPC9zcGFuPlxuICApO1xufTtcblxuLy8gXHVDNTRDXHVCOUJDIFx1QkNBOCBcdTIwMTQgXHVDNkIwXHVDMEMxXHVCMkU4IFx1QjBCNFx1QkU0NFx1QUM4Q1x1Qzc3NFx1QzE1OFx1QzVEMCBcdUIxNzhcdUNEOUNcbmNvbnN0IE5vdGlmaWNhdGlvbkJlbGwgPSAoeyB1c2VyLCBvblBpY2sgfSkgPT4ge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFt0aWNrLCBzZXRUaWNrXSA9IFJlYWN0LnVzZVN0YXRlKDApO1xuICBjb25zdCByZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG5cbiAgLy8gXHVCMkU0XHVCOTc4IFx1RDBFRC9cdUMxMzhcdUMxNThcdUM1RDBcdUMxMUMgXHVDNTRDXHVCOUJDXHVDNzc0IFx1Q0Q5NFx1QUMwMFx1QjQxOFx1QkE3NCBzdG9yYWdlIFx1Qzc3NFx1QkNBNFx1RDJCOFx1Qjg1QyBcdUFDMzFcdUMyRTBcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvblN0b3JhZ2UgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnYmdual9ub3RpZmljYXRpb25zJykgc2V0VGljaygodCkgPT4gdCArIDEpO1xuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3JhZ2UnLCBvblN0b3JhZ2UpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3RvcmFnZScsIG9uU3RvcmFnZSk7XG4gIH0sIFtdKTtcblxuICAvLyBcdUM2NzhcdUJEODAgXHVEMDc0XHVCOUFEXHVDNzNDXHVCODVDIFx1QjJFQlx1QUUzMFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuO1xuICAgIGNvbnN0IG9uRG9jID0gKGUpID0+IHtcbiAgICAgIGlmIChyZWYuY3VycmVudCAmJiAhcmVmLmN1cnJlbnQuY29udGFpbnMoZS50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKTtcbiAgICB9O1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jKTtcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2MpO1xuICB9LCBbb3Blbl0pO1xuXG4gIGlmICghdXNlcikgcmV0dXJuIG51bGw7XG4gIC8vIEJHTkpfQ09NTVVOSVRZIFx1QUMwMCBcdUJEODBcdUJEODQgXHVCODVDXHVCNERDXHVCNDFDIFx1QzJEQ1x1QzgxMFx1QzVEMCBcdUQ2MzhcdUNEOUNcdUIzRkNcdUIzQzQgXHVENjU0XHVCQTc0XHVDNzc0IFx1QUU2OFx1QzlDMFx1QzlDMCBcdUM1NEFcdUIzQzRcdUI4NUQgXHVCQUE4XHVCNEUwIFx1RDYzOFx1Q0Q5Q1x1QzVEMCBcdUM2MzVcdUMxNTRcdUIxMTAgXHVDQ0I0XHVDNzc0XHVCMkREICsgXHVBQzAwXHVCNERDXG4gIGNvbnN0IHJhd0xpc3QgPSAoKCkgPT4geyB0cnkgeyByZXR1cm4gd2luZG93LkJHTkpfQ09NTVVOSVRZPy5saXN0Tm90aWZpY2F0aW9ucz8uKHVzZXIuaWQpOyB9IGNhdGNoIHsgcmV0dXJuIFtdOyB9IH0pKCk7XG4gIGNvbnN0IGxpc3QgPSBBcnJheS5pc0FycmF5KHJhd0xpc3QpID8gcmF3TGlzdCA6IFtdO1xuICBjb25zdCB1bnJlYWQgPSBsaXN0LmZpbHRlcigobikgPT4gbiAmJiAhbi5yZWFkKS5sZW5ndGg7XG5cbiAgY29uc3QgcGljayA9IChuKSA9PiB7XG4gICAgdHJ5IHsgd2luZG93LkJHTkpfQ09NTVVOSVRZPy5tYXJrTm90aWZpY2F0aW9uUmVhZD8uKHVzZXIuaWQsIG4uaWQpOyB9IGNhdGNoIHt9XG4gICAgc2V0T3BlbihmYWxzZSk7XG4gICAgaWYgKG9uUGljaykgb25QaWNrKG4pO1xuICAgIHNldFRpY2soKHQpID0+IHQgKyAxKTtcbiAgfTtcblxuICBjb25zdCBtYXJrQWxsID0gKCkgPT4ge1xuICAgIHRyeSB7IHdpbmRvdy5CR05KX0NPTU1VTklUWT8ubWFya0FsbE5vdGlmaWNhdGlvbnNSZWFkPy4odXNlci5pZCk7IH0gY2F0Y2gge31cbiAgICBzZXRUaWNrKCh0KSA9PiB0ICsgMSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHJlZj17cmVmfSBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9fT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGxcIlxuICAgICAgICBhcmlhLWxhYmVsPXtgXHVDNTRDXHVCOUJDICR7dW5yZWFkID4gMCA/IGAke3VucmVhZH1cdUFDNzQgXHVDNTQ4IFx1Qzc3RFx1Qzc0Q2AgOiAnJ31gfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2KSA9PiAhdil9XG4gICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBwYWRkaW5nOiAnNnB4IDEwcHgnLCBtaW5XaWR0aDogMzYgfX0+XG4gICAgICAgIDxzdmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCJcbiAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjEuNlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnIH19PlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNiA4YTYgNiAwIDAgMSAxMiAwYzAgNyAzIDkgMyA5SDNzMy0yIDMtOVwiLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTEwLjMgMjFhMS45NCAxLjk0IDAgMCAwIDMuNCAwXCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAge3VucmVhZCA+IDAgJiYgKFxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogLTQsIHJpZ2h0OiAtNCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3ZhcigtLWdvbGQpJywgY29sb3I6ICd2YXIoLS1iZyknLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDk5OSwgZm9udFNpemU6IDksIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzFweCA1cHgnLCBsZXR0ZXJTcGFjaW5nOiAwLFxuICAgICAgICAgICAgICBtaW5XaWR0aDogMTQsIHRleHRBbGlnbjogJ2NlbnRlcicsIGxpbmVIZWlnaHQ6IDEuNCxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3VucmVhZCA+IDkgPyAnOSsnIDogdW5yZWFkfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gJiYgKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIlx1QzU0Q1x1QjlCQyBcdUJBQTlcdUI4NURcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnY2FsYygxMDAlICsgOHB4KScsIHJpZ2h0OiAwLFxuICAgICAgICAgICAgd2lkdGg6IDMyMCwgbWF4SGVpZ2h0OiA0MDAsIG92ZXJmbG93OiAnYXV0bycsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAndmFyKC0tYmctMiknLCBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tbGluZSknLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnMCAxNnB4IDQwcHggcmdiYSgwLDAsMCwwLjUpJyxcbiAgICAgICAgICAgIHpJbmRleDogNTAsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCAxNHB4JywgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJywgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZ29sZFwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogJzAuMjJlbScgfX0+XHVDNTRDXHVCOUJDIFx1MDBCNyB7bGlzdC5sZW5ndGh9PC9zcGFuPlxuICAgICAgICAgICAge3VucmVhZCA+IDAgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXttYXJrQWxsfSBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgY29sb3I6ICd2YXIoLS1pbmstMiknIH19Plx1QkFBOFx1QjQ1MCBcdUM3N0RcdUM3NEM8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2xpc3QubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17eyBwYWRkaW5nOiAyNCwgdGV4dEFsaWduOiAnY2VudGVyJywgZm9udFNpemU6IDEzIH19PlxuICAgICAgICAgICAgICBcdUM1NDRcdUM5QzEgXHVCQzFCXHVDNzQwIFx1QzU0Q1x1QjlCQ1x1Qzc3NCBcdUM1QzZcdUMyQjVcdUIyQzhcdUIyRTQuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPHVsIHN0eWxlPXt7IGxpc3RTdHlsZTogJ25vbmUnLCBtYXJnaW46IDAsIHBhZGRpbmc6IDAgfX0+XG4gICAgICAgICAgICAgIHtsaXN0Lm1hcCgobikgPT4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e24uaWR9PlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gcGljayhuKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLCB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTJweCAxNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBuLnJlYWQgPyAndHJhbnNwYXJlbnQnIDogJ3JnYmEoMjQ1LDIxMyw3MiwwLjA2KScsXG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IDEyLCBjb2xvcjogJ3ZhcigtLWluayknLCBtYXJnaW5Cb3R0b206IDQsIGxpbmVIZWlnaHQ6IDEuNSB9fT5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnb2xkXCI+e24uZnJvbU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbVwiPiBcdTAwQjcge24ubWVzc2FnZSB8fCAnXHVDMEM4IFx1QzU0Q1x1QjlCQyd9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge24ucG9zdFRpdGxlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgbGluZUhlaWdodDogMS41LCBvdmVyZmxvdzogJ2hpZGRlbicsIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJywgd2hpdGVTcGFjZTogJ25vd3JhcCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBcdTI1Qjgge24ucG9zdFRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17eyBmb250U2l6ZTogMTAsIG1hcmdpblRvcDogNCwgbGV0dGVyU3BhY2luZzogJzAuMWVtJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7bmV3IERhdGUobi5jcmVhdGVkQXQpLnRvTG9jYWxlU3RyaW5nKCdrby1LUicpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVCRTBDXHVCNzlDXHVCNERDIFx1QjlDOFx1RDA2QyBcdTIwMTQgXHVCMTc4XHVCNzgwIFx1Qjc3Q1x1QzZCNFx1QjREQyBcdUMwQUNcdUFDMDFcdUQ2MTUgKyAnQicgXHVDRUY3XHVDNTQ0XHVDNkMzICsgXHVCQzQ1XHVBRTMwICsgXHVCQ0M0XHVCNEU0LlxuLy8gUERGIFx1QzZEMFx1QkNGOCBcdUFFMzBcdUJDMThcdUM3M0NcdUI4NUMgU1ZHIFx1QzdBQ1x1QUQ2Q1x1QzEzMS4gXHVDOEZDIFx1QzBDOVx1QzBDMVx1Qzc0MCBcdUJFMENcdUI3OUNcdUI0REMgXHVCMTc4XHVCNzgwXHVDMEM5ICNGNUQ1NDguXG5jb25zdCBCYW5naW5vamFJY29uID0gKHsgc2l6ZSA9IDIyIH0pID0+IChcbiAgPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSB2aWV3Qm94PVwiMCAwIDY0IDY0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgey8qIFx1Qjc3Q1x1QzZCNFx1QjREQyBcdUMwQUNcdUFDMDFcdUQ2MTUgXHVCQzMwXHVBQ0JEICovfVxuICAgIDxyZWN0IHdpZHRoPVwiNjRcIiBoZWlnaHQ9XCI2NFwiIHJ4PVwiOVwiIHJ5PVwiOVwiIGZpbGw9XCIjRjVENTQ4XCIvPlxuICAgIHsvKiAnQicgXHVDRUY3XHVDNTQ0XHVDNkMzIFx1MjAxNCBcdUI0NTAgXHVBQzFDXHVDNzU4IFx1QjQ2NVx1QURGQyBcdUJDRkNcdUI5NjhcdUM3NzQgXHVDODhDXHVDRTIxIFx1QzEzOFx1Qjg1QyBcdUFFMzBcdUI0NjVcdUM1RDAgXHVCRDk5XHVDNzQwIFx1RDYxNVx1RDBEQy4gZmlsbFJ1bGU9ZXZlbm9kZCBcdUI4NUMgXHVDNTQ4XHVDQUJEIFx1QkU0OCBcdUFDRjVcdUFDMDRcdUM3NDQgXHVDRUY3XHVDNTQ0XHVDNkMzLiAqL31cbiAgICA8cGF0aFxuICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgIGQ9XCJNIDkgOCBMIDkgNTYgTCAzMiA1NiBDIDQyIDU2IDQ3IDUxIDQ3IDQ0LjUgQyA0NyAzOS41IDQ0IDM2IDM5LjUgMzUgQyA0MyAzMy41IDQ1LjUgMzAuNSA0NS41IDI2IEMgNDUuNSAxOC41IDQwIDE0IDMwIDE0IEwgOSAxNCBaIE0gMTggMTkgTCAyOCAxOSBDIDMzIDE5IDM2IDIxIDM2IDI1IEMgMzYgMjkgMzMgMzEgMjggMzEgTCAxOCAzMSBaIE0gMTggMzYgTCAzMCAzNiBDIDM2IDM2IDM5IDM4LjUgMzkgNDMgQyAzOSA0Ny41IDM2IDUwIDMwIDUwIEwgMTggNTAgWlwiXG4gICAgICBmaWxsPVwiI0ZGRkZGRlwiLz5cbiAgICB7LyogXHVCQzQ1XHVBRTMwIChcdUJFNDRcdUQ1ODlcdUFFMzApIFx1MjAxNCBCIFx1Qzc1OCBcdUMwQzFcdUIyRTggXHVCRTQ4IFx1QUNGNVx1QUMwNFx1Qzc0NCBcdUFDMDBcdUI4NUNcdUM5QzBcdUI5NzRcdUJBNzAgXHVDODhDXHVDRTIxIFx1QzcwNFx1QzVEMFx1QzExQyBcdUM2QjBcdUNFMjEgXHVDNTQ0XHVCNzk4XHVCODVDICovfVxuICAgIDxwYXRoXG4gICAgICBkPVwiTSAyNiAyMi41IEMgMjcgMjEuNSAyOCAyMS41IDI4LjUgMjIuNSBMIDMxIDI3IEwgMzggMjUgQyAzOC44IDI0LjggMzkuNCAyNS4yIDM5LjUgMjYgQyAzOS42IDI2LjYgMzkuMyAyNy4xIDM4LjggMjcuNCBMIDMyLjUgMzAuNyBMIDMzLjUgMzYuNSBMIDM2IDM3LjggQyAzNi40IDM4IDM2LjUgMzguNCAzNi4zIDM4LjcgQyAzNi4yIDM5IDM1LjkgMzkuMSAzNS42IDM5IEwgMzEuNSAzOCBMIDI4IDM5LjUgQyAyNy43IDM5LjYgMjcuMyAzOS40IDI3LjIgMzkgQyAyNy4xIDM4LjcgMjcuMyAzOC40IDI3LjYgMzguMiBMIDMwIDM3IEwgMjguNyAzMiBMIDI0IDMzLjUgQyAyMy40IDMzLjcgMjIuOSAzMy40IDIyLjggMzIuOCBDIDIyLjcgMzIuMyAyMyAzMS45IDIzLjUgMzEuNyBMIDI3LjUgMzAuMiBMIDI2LjMgMjYgTCAyNS41IDI0LjUgQyAyNS4yIDI0IDI1LjQgMjMuMyAyNiAyMyBaXCJcbiAgICAgIGZpbGw9XCIjRjVENTQ4XCIvPlxuICAgIHsvKiBcdUJDQzQgKHNwYXJrbGUpIFx1MjAxNCA0LVx1QzgxMCBcdUIyRTRcdUM3NzRcdUM1NDRcdUJBQUNcdUI0REMgNSBcdUFDMUMuIFx1QzZCMFx1Q0UyMSBcdUMwQzFcdUIyRThcdUM1RDBcdUMxMUMgXHVDNkIwXHVDRTIxIFx1RDU1OFx1QjJFOFx1QzczQ1x1Qjg1QyBcdUQ3NjlcdUM1QjRcdUM5RDAgKi99XG4gICAgPGcgZmlsbD1cIiNGRkZGRkZcIj5cbiAgICAgIDxwYXRoIGQ9XCJNIDUzIDE1IEwgNTQuNSAxOCBMIDU3LjUgMTkuNSBMIDU0LjUgMjEgTCA1MyAyNCBMIDUxLjUgMjEgTCA0OC41IDE5LjUgTCA1MS41IDE4IFpcIi8+XG4gICAgICA8cGF0aCBkPVwiTSA1OCAyNiBMIDU5IDI4IEwgNjEgMjkgTCA1OSAzMCBMIDU4IDMyIEwgNTcgMzAgTCA1NSAyOSBMIDU3IDI4IFpcIi8+XG4gICAgICA8cGF0aCBkPVwiTSA1MCAzMyBMIDUwLjcgMzQuNSBMIDUyLjIgMzUgTCA1MC43IDM1LjUgTCA1MCAzNyBMIDQ5LjMgMzUuNSBMIDQ3LjggMzUgTCA0OS4zIDM0LjUgWlwiLz5cbiAgICAgIDxwYXRoIGQ9XCJNIDU1IDQwIEwgNTUuNSA0MSBMIDU2LjUgNDEuNSBMIDU1LjUgNDIgTCA1NSA0MyBMIDU0LjUgNDIgTCA1My41IDQxLjUgTCA1NC41IDQxIFpcIi8+XG4gICAgICA8cGF0aCBkPVwiTSA1OSAzNiBMIDU5LjQgMzcgTCA2MC40IDM3LjUgTCA1OS40IDM4IEwgNTkgMzkgTCA1OC42IDM4IEwgNTcuNiAzNy41IEwgNTguNiAzNyBaXCIvPlxuICAgIDwvZz5cbiAgPC9zdmc+XG4pO1xuXG5jb25zdCBCcmFuZCA9ICh7IG9uQ2xpY2sgfSkgPT4ge1xuICBjb25zdCBzYyA9IHdpbmRvdy5CR05KX1NJVEVfQ09OVEVOVD8uZ2V0Py4oKSB8fCB7fTtcbiAgY29uc3QgYnJhbmQgPSBzYy5icmFuZCB8fCB7IG5hbWU6IFwiXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXCIsIHN1YjogXCJCQU5HSU5PSkFcIiB9O1xuICBjb25zdCBsb2dvID0gc2MuYnJhbmRpbmc/LmxvZ29EYXRhVXJpO1xuICByZXR1cm4gKFxuICAgIDxidXR0b25cbiAgICAgIGNsYXNzTmFtZT1cImJyYW5kXCJcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICBhcmlhLWxhYmVsPXtgJHticmFuZC5uYW1lfSBcdUQ2NDhcdUM3M0NcdUI4NUNgfVxuICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidub25lJywgYm9yZGVyOidub25lJywgcGFkZGluZzowLCBjdXJzb3I6J3BvaW50ZXInfX0+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJicmFuZC1tYXJrXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgIHtsb2dvXG4gICAgICAgICAgPyA8aW1nIHNyYz17bG9nb30gYWx0PVwiXCIgc3R5bGU9e3t3aWR0aDoyMiwgaGVpZ2h0OjIyLCBvYmplY3RGaXQ6J2NvbnRhaW4nLCBkaXNwbGF5OidibG9jayd9fS8+XG4gICAgICAgICAgOiA8QmFuZ2lub2phSWNvbiBzaXplPXsyMn0vPn1cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJyYW5kLW5hbWVcIj5cbiAgICAgICAge2JyYW5kLm5hbWV9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN1YlwiIGxhbmc9XCJlblwiPnticmFuZC5zdWJ9PC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApO1xufTtcblxuY29uc3QgTmF2ID0gKHsgcm91dGUsIGdvLCB1c2VyLCBvbkxvZ291dCB9KSA9PiB7XG4gIGNvbnN0IG5hdkwgPSAod2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9KS5uYXYgfHwge307XG4gIGNvbnN0IFttb2JpbGVPcGVuLCBzZXRNb2JpbGVPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgLy8gXHVCNzdDXHVDNkIwXHVEMkI4IFx1QkNDMFx1QUNCRCBcdUMyREMgXHVCQUE4XHVCQzE0XHVDNzdDIFx1QkE1NFx1QjI3NCBcdUM3OTBcdUIzRDkgXHVCMkVCXHVENzk4XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7IHNldE1vYmlsZU9wZW4oZmFsc2UpOyB9LCBbcm91dGVdKTtcbiAgLy8gXHVCQUE4XHVCQzE0XHVDNzdDIFx1QkE1NFx1QjI3NCBcdUM1RjRcdUI5QkMgXHVDMkRDOiBFc2NhcGUgXHVCMkVCXHVBRTMwICsgYm9keSBzY3JvbGwgbG9jayArIHZpZXdwb3J0IFx1RDY1NVx1QjMwMCBcdUMyREMgXHVDNzkwXHVCM0Q5IFx1QjJFQlx1RDc5OFxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbW9iaWxlT3BlbikgcmV0dXJuO1xuICAgIGNvbnN0IG9uS2V5ID0gKGUpID0+IHsgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgc2V0TW9iaWxlT3BlbihmYWxzZSk7IH07XG4gICAgY29uc3Qgb25SZXNpemUgPSAoKSA9PiB7IGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDkwMCkgc2V0TW9iaWxlT3BlbihmYWxzZSk7IH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uUmVzaXplKTtcbiAgICBjb25zdCBwcmV2ID0gZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdztcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uUmVzaXplKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBwcmV2O1xuICAgIH07XG4gIH0sIFttb2JpbGVPcGVuXSk7XG4gIC8vIFx1QjE4MFx1Qzc5MCBcdUJBNTRcdUFDMDBcdUJBNTRcdUIyNzQgXHVDNzkwXHVDMkREIChcdUM3NThcdUMyRERcdUM4RkM6IFx1QkEzOVx1QUNFMC9cdUM3OTBcdUFDRTAvXHVDMEFDXHVBQ0UwKS4gXCJcdUIxODBcdUM3OTBcIiBcdUM3OTBcdUNDQjQgXHVEMDc0XHVCOUFEIFx1QzJEQyBcdUNDQUIgXHVENTZEXHVCQUE5XHVDNzNDXHVCODVDIFx1QzlDNFx1Qzc4NS5cbiAgY29uc3QgcGxheUNoaWxkcmVuID0gW1xuICAgIHsga2V5OiBcImVhdFwiLCAgIGxhYmVsOiBuYXZMLmVhdCAgIHx8IFwiXHVCQTM5XHVBQ0UwIFx1QjE4MFx1Qzc5MFwiLCAgZGVzYzogXCJcdUMyREQgXHU5OERGIFx1MjAxNCBcdUQ1NUNcdUM4MTVcdUMyRERcdTAwQjdcdUQ1QTVcdUQxQTBcdUM3NENcdUMyRERcdTAwQjdcdUMyRENcdUM3QTVcIiB9LFxuICAgIHsga2V5OiBcInNsZWVwXCIsIGxhYmVsOiBuYXZMLnNsZWVwIHx8IFwiXHVDNzkwXHVBQ0UwIFx1QjE4MFx1Qzc5MFwiLCAgZGVzYzogXCJcdUM4RkMgXHU0RjRGIFx1MjAxNCBcdUQ1NUNcdUM2MjVcdTAwQjdcdUFDRTBcdUQwRERcdTAwQjdcdUQxNUNcdUQ1MENcdUMyQTRcdUQxNENcdUM3NzRcIiB9LFxuICAgIHsga2V5OiBcInNob3BcIiwgIGxhYmVsOiBuYXZMLnNob3AgIHx8IFwiXHVDMEFDXHVBQ0UwIFx1QjE4MFx1Qzc5MFwiLCAgZGVzYzogXCJcdUM3NTggXHU4ODYzIFx1MjAxNCBcdUM4MDRcdUQxQjVcdUFDRjVcdUM2MDhcdTAwQjdcdUQxQTBcdUMwQjBcdUJCM0NcIiB9LFxuICBdO1xuICBjb25zdCBwbGF5S2V5cyA9IHBsYXlDaGlsZHJlbi5tYXAoKHApID0+IHAua2V5KTtcblxuICBjb25zdCBpdGVtcyA9IFtcbiAgICB7IGtleTogXCJob21lXCIsIGxhYmVsOiBuYXZMLmhvbWUgfHwgXCJcdUQ2NDhcIiB9LFxuICAgIHsga2V5OiBcInBsYXlcIiwgbGFiZWw6IG5hdkwucGxheSB8fCBcIlx1QjE4MFx1Qzc5MFwiLCBpc01lZ2E6ICdwbGF5JywgZGVmYXVsdFJvdXRlOiAnZWF0JyB9LFxuICAgIHsga2V5OiBcInRvdXJcIiwgbGFiZWw6IG5hdkwudG91ciB8fCBcIlx1RDIyQ1x1QzVCNFwiIH0sXG4gICAgeyBrZXk6IFwibGVjdHVyZXNcIiwgbGFiZWw6IG5hdkwubGVjdHVyZXMgfHwgXCJcdUFDMTVcdUM1RjBcIiB9LFxuICAgIHsga2V5OiBcImNvbHVtblwiLCBsYWJlbDogbmF2TC5jb2x1bW4gfHwgXCJcdUNFN0NcdUI3RkNcIiB9LFxuICAgIHsga2V5OiBcImNvbW11bml0eVwiLCBsYWJlbDogbmF2TC5jb21tdW5pdHkgfHwgXCJcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjBcIiwgaXNNZWdhOiAnY29tbXVuaXR5JyB9LFxuICBdO1xuICAvLyBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVCQTU0XHVBQzAwXHVCQTU0XHVCMjc0OiBCR05KX1NUT1JFUy5jYXRlZ29yaWVzXHVDNzU4IGJvYXJkVHlwZT1jb21tdW5pdHkgKyBcdUMwQUNcdUM2QTlcdUM3OTAgXHVCNEYxXHVBRTA5IFx1QUMwMFx1QzJEQyBcdUNFNzRcdUQxNENcdUFDRTBcdUI5QUNcbiAgY29uc3QgdXNlckxldmVsID0gd2luZG93LkJHTkpfVVNFUl9MRVZFTCA/IHdpbmRvdy5CR05KX1VTRVJfTEVWRUwodXNlcikgOiAodXNlciA/IDEwIDogMCk7XG4gIGNvbnN0IGNvbW11bml0eUJvYXJkcyA9ICh3aW5kb3cuQkdOSl9TVE9SRVM/LmNhdGVnb3JpZXMgfHwgW10pXG4gICAgLmZpbHRlcigoYykgPT4gYy5ib2FyZFR5cGUgPT09ICdjb21tdW5pdHknICYmIHVzZXJMZXZlbCA+PSAoYy5taW5MZXZlbCA/PyAwKSk7XG5cbiAgY29uc3QgZ29Cb2FyZCA9IChib2FyZElkKSA9PiB7XG4gICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYmdual9wZW5kaW5nX2JvYXJkX2lkJywgYm9hcmRJZCk7IH0gY2F0Y2gge31cbiAgICBnbygnY29tbXVuaXR5Jyk7XG4gIH07XG5cbiAgLy8gXHVENjVDXHVDMTMxIFx1QzBDMVx1RDBEQyBcdUQzMTBcdUM4MTUgXHUyMDE0IFx1QkE1NFx1QUMwMCBcdUFERjhcdUI4RjlcdUM3NDAgXHVDNzkwXHVDMkREIFx1Qjc3Q1x1QzZCMFx1RDJCOFx1QjNDNCBcdUQ2NUNcdUMxMzFcdUM3M0NcdUI4NUMgXHVBQzA0XHVDOEZDXG4gIGNvbnN0IGlzQWN0aXZlID0gKGl0KSA9PiB7XG4gICAgaWYgKGl0LmlzTWVnYSA9PT0gJ3BsYXknKSByZXR1cm4gcGxheUtleXMuaW5jbHVkZXMocm91dGUpO1xuICAgIHJldHVybiByb3V0ZSA9PT0gaXQua2V5O1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPG5hdiBjbGFzc05hbWU9e2BuYXYgJHttb2JpbGVPcGVuID8gJ21vYmlsZS1vcGVuJyA6ICcnfWB9IGFyaWEtbGFiZWw9XCJcdUM4RkMgXHVCQTU0XHVCMjc0XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBuYXYtaW5uZXJcIj5cbiAgICAgICAgPEJyYW5kIG9uQ2xpY2s9eygpID0+IGdvKFwiaG9tZVwiKX0gLz5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm5hdi10b2dnbGVcIlxuICAgICAgICAgIGFyaWEtbGFiZWw9e21vYmlsZU9wZW4gPyBcIlx1QkE1NFx1QjI3NCBcdUIyRUJcdUFFMzBcIiA6IFwiXHVCQTU0XHVCMjc0IFx1QzVGNFx1QUUzMFwifVxuICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e21vYmlsZU9wZW59XG4gICAgICAgICAgYXJpYS1jb250cm9scz1cInByaW1hcnktbmF2LW1lbnVcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE1vYmlsZU9wZW4oKHYpID0+ICF2KX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmF2LXRvZ2dsZS1iYXJzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPHVsIGlkPVwicHJpbWFyeS1uYXYtbWVudVwiIGNsYXNzTmFtZT1cIm5hdi1tZW51XCIgcm9sZT1cImxpc3RcIiBzdHlsZT17e2xpc3RTdHlsZTonbm9uZScsIG1hcmdpbjowLCBwYWRkaW5nOjB9fT5cbiAgICAgICAgICB7aXRlbXMubWFwKGl0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc01lZ2EgPSBpdC5pc01lZ2EgPT09ICdwbGF5JyB8fCAoaXQuaXNNZWdhID09PSAnY29tbXVuaXR5JyAmJiBjb21tdW5pdHlCb2FyZHMubGVuZ3RoID4gMCk7XG4gICAgICAgICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4gZ28oaXQuZGVmYXVsdFJvdXRlIHx8IGl0LmtleSk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8bGkga2V5PXtpdC5rZXl9IHN0eWxlPXt7cG9zaXRpb246J3JlbGF0aXZlJ319IGNsYXNzTmFtZT17aGFzTWVnYSA/ICduYXYtaGFzLW1lZ2EnIDogJyd9PlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgbmF2LWxpbmsgJHtpc0FjdGl2ZShpdCkgPyBcImFjdGl2ZVwiIDogXCJcIn1gfVxuICAgICAgICAgICAgICAgICAgYXJpYS1jdXJyZW50PXtpc0FjdGl2ZShpdCkgPyBcInBhZ2VcIiA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9e2hhc01lZ2EgPyAnbWVudScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfT57aXQubGFiZWx9e2hhc01lZ2EgPyAnIFx1MjVCRScgOiAnJ308L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgIHtpdC5pc01lZ2EgPT09ICdwbGF5JyAmJiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1tZWdhXCIgcm9sZT1cIm1lbnVcIiBhcmlhLWxhYmVsPVwiXHVCMTgwXHVDNzkwIFx1MjAxNCBcdUM3NThcdUMyRERcdUM4RkMgXHVDRTc0XHVEMTRDXHVBQ0UwXHVCOUFDXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjonYWJzb2x1dGUnLCB0b3A6JzEwMCUnLCBsZWZ0Oic1MCUnLCB0cmFuc2Zvcm06J3RyYW5zbGF0ZVgoLTUwJSknLFxuICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOjI4MCwgcGFkZGluZzonMTBweCAwJyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid2YXIoLS1iZyknLCBib3JkZXI6JzFweCBzb2xpZCB2YXIoLS1saW5lKScsXG4gICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OicwIDE2cHggNDBweCByZ2JhKDE1LDIzLDQyLDAuMTApJyxcbiAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OidoaWRkZW4nLCBvcGFjaXR5OjAsIHRyYW5zaXRpb246J29wYWNpdHkgLjEycyBlYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6NTAsXG4gICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjksIGxldHRlclNwYWNpbmc6JzAuMjJlbScsIHBhZGRpbmc6JzZweCAxNnB4IDhweCd9fT5cdUM3NThcdUMyRERcdUM4RkMgXHU4ODYzXHU5OERGXHU0RjRGPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBzdHlsZT17e2xpc3RTdHlsZTonbm9uZScsIG1hcmdpbjowLCBwYWRkaW5nOjB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7cGxheUNoaWxkcmVuLm1hcCgocCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17cC5rZXl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvKHAua2V5KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonYmxvY2snLCB3aWR0aDonMTAwJScsIHRleHRBbGlnbjonbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOicxMHB4IDE2cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDondHJhbnNwYXJlbnQnLCBjb2xvcjondmFyKC0taW5rLTIpJywgYm9yZGVyOidub25lJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KGUpID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAndmFyKC0tYmctMiknOyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KGUpID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnOyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Zm9udFNpemU6MTMsIGZvbnRXZWlnaHQ6NTAwfX0+e3AubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgbGV0dGVyU3BhY2luZzonMC4wNWVtJywgbWFyZ2luVG9wOjJ9fT57cC5kZXNjfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgey8qIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUM4MDRcdUM2QTk6IFx1QjE4MFx1Qzc5MCBcdUJBNTRcdUFDMDAgXHVDNzkwXHVDMkREXHVCNEU0XHVDNzQ0IFx1Qzc3OFx1Qjc3Q1x1Qzc3OCBcdUQzQkNcdUNFNjhcdUM3M0NcdUI4NUMgXHVCMTc4XHVDRDlDICovfVxuICAgICAgICAgICAgICAgIHtpdC5pc01lZ2EgPT09ICdwbGF5JyAmJiAoXG4gICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1zdWJtZW51XCIgcm9sZT1cImxpc3RcIiBhcmlhLWxhYmVsPVwiXHVCMTgwXHVDNzkwIFx1RDU1OFx1QzcwNFwiIHN0eWxlPXt7bGlzdFN0eWxlOidub25lJywgbWFyZ2luOjAsIHBhZGRpbmc6MH19PlxuICAgICAgICAgICAgICAgICAgICB7cGxheUNoaWxkcmVuLm1hcCgocCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e3Aua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YG5hdi1saW5rIG5hdi1zdWItbGluayAke3JvdXRlID09PSBwLmtleSA/ICdhY3RpdmUnIDogJyd9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1jdXJyZW50PXtyb3V0ZSA9PT0gcC5rZXkgPyAncGFnZScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvKHAua2V5KX0+e3AubGFiZWx9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAge2l0LmlzTWVnYSA9PT0gJ2NvbW11bml0eScgJiYgY29tbXVuaXR5Qm9hcmRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXYtbWVnYVwiIHJvbGU9XCJtZW51XCIgYXJpYS1sYWJlbD1cIlx1QUM4Q1x1QzJEQ1x1RDMxMCBcdUJBQTlcdUI4NURcIlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOidhYnNvbHV0ZScsIHRvcDonMTAwJScsIGxlZnQ6JzUwJScsIHRyYW5zZm9ybTondHJhbnNsYXRlWCgtNTAlKScsXG4gICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6MjIwLCBwYWRkaW5nOicxMHB4IDAnLFxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3ZhcigtLWJnKScsIGJvcmRlcjonMXB4IHNvbGlkIHZhcigtLWxpbmUpJyxcbiAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6JzAgMTZweCA0MHB4IHJnYmEoMTUsMjMsNDIsMC4xMCknLFxuICAgICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6J2hpZGRlbicsIG9wYWNpdHk6MCwgdHJhbnNpdGlvbjonb3BhY2l0eSAuMTJzIGVhc2UnLFxuICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDo1MCxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6OSwgbGV0dGVyU3BhY2luZzonMC4yMmVtJywgcGFkZGluZzonNnB4IDE2cHggOHB4J319PkJPQVJEUzwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8dWwgc3R5bGU9e3tsaXN0U3R5bGU6J25vbmUnLCBtYXJnaW46MCwgcGFkZGluZzowfX0+XG4gICAgICAgICAgICAgICAgICAgICAge2NvbW11bml0eUJvYXJkcy5tYXAoKGIpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2IuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvQm9hcmQoYi5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6J2Jsb2NrJywgd2lkdGg6JzEwMCUnLCB0ZXh0QWxpZ246J2xlZnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzonOHB4IDE2cHgnLCBmb250U2l6ZToxMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6J3RyYW5zcGFyZW50JywgY29sb3I6J3ZhcigtLWluay0yKScsIGJvcmRlcjonbm9uZScsIGN1cnNvcjoncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhlKSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3ZhcigtLWJnLTIpJzsgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhlKSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3RyYW5zcGFyZW50JzsgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2IubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgPGxpIHN0eWxlPXt7Ym9yZGVyVG9wOicxcHggc29saWQgdmFyKC0tbGluZSknLCBtYXJnaW5Ub3A6NiwgcGFkZGluZ1RvcDo2fX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnbygnY29tbXVuaXR5Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTonYmxvY2snLCB3aWR0aDonMTAwJScsIHRleHRBbGlnbjonbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzonOHB4IDE2cHgnLCBmb250U2l6ZToxMiwgbGV0dGVyU3BhY2luZzonMC4xOGVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOid0cmFuc3BhcmVudCcsIGNvbG9yOid2YXIoLS1zZWNvbmRhcnkpJywgYm9yZGVyOidub25lJywgY3Vyc29yOidwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5Oid2YXIoLS1mb250LW1vbm8pJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHVDODA0XHVDQ0I0IFx1QkNGNFx1QUUzMCBcdTIxOTI8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgICAgey8qIFx1QkFBOFx1QkMxNFx1Qzc3QyBcdUM4MDRcdUM2QTk6IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM1NjFcdUMxNThcdUM3NDQgXHVCQTU0XHVCMjc0IFx1QjBCNFx1QkQ4MFx1QzVEMCBcdUIxNzhcdUNEOUMuIFx1QjM3MFx1QzJBNFx1RDA2Q1x1RDBEMVx1QzVEMFx1QzEyMCAubmF2LW1vYmlsZS1vbmx5IENTUyBcdUI4NUMgXHVDMjI4XHVBRTQwLiAqL31cbiAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1vbmx5IG5hdi1tb2JpbGUtZGl2aWRlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiLz5cbiAgICAgICAgICB7dXNlciA/IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtbW9iaWxlLW9ubHlcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXYtbGlua1wiIG9uQ2xpY2s9eygpID0+IGdvKFwibXlwYWdlXCIpfT5cdUI5QzhcdUM3NzRcdUQzOThcdUM3NzRcdUM5QzA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAge3VzZXIuaXNBZG1pbiAmJiAoXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1tb2JpbGUtb25seVwiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBvbkNsaWNrPXsoKSA9PiBnbyhcImFkbWluXCIpfT5cdUFEMDBcdUI5QUM8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LW1vYmlsZS1vbmx5XCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiBvbkNsaWNrPXtvbkxvZ291dH0+XHVCODVDXHVBREY4XHVDNTQ0XHVDNkMzPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1tb2JpbGUtb25seVwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgb25DbGljaz17KCkgPT4gZ28oXCJsb2dpblwiKX0+XHVCODVDXHVBREY4XHVDNzc4PC9idXR0b24+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtbW9iaWxlLW9ubHlcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXYtbGlua1wiIG9uQ2xpY2s9eygpID0+IGdvKFwic2lnbnVwXCIpfT5cdUQ2OENcdUM2RDBcdUFDMDBcdUM3ODU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvdWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2LWFjdGlvbnNcIj5cbiAgICAgICAgICB7dXNlciA/IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm9cIiBhcmlhLWxhYmVsPXtgXHVCODVDXHVBREY4XHVDNzc4OiAke3VzZXIubmFtZX1gfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTEsIGxldHRlclNwYWNpbmc6JzAuMTVlbScsIGNvbG9yOid2YXIoLS1pbmstMiknfX0+e3VzZXIubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDxOb3RpZmljYXRpb25CZWxsIHVzZXI9e3VzZXJ9IG9uUGljaz17KG4pID0+IHtcbiAgICAgICAgICAgICAgICAvLyBcdUM1NENcdUI5QkMgXHVEMEMwXHVDNzg1XHVCQ0M0IFx1Qjc3Q1x1QzZCMFx1RDMwNSBcdTIwMTQgXHVBQzE1XHVDNUYwL1x1RDIyQ1x1QzVCNC9cdUM4RkNcdUJCMzgvXHVCMzEzXHVBRTAwXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGlmIChuLnR5cGUgPT09ICdjb21tZW50JyAmJiBuLnBvc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcsIFN0cmluZyhuLnBvc3RJZCkpO1xuICAgICAgICAgICAgICAgICAgICBnbygnY29tbXVuaXR5Jyk7IHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChuLnR5cGUgPT09ICdsZWN0dXJlX2NvbmZpcm1lZCcgfHwgbi50eXBlID09PSAnbGVjdHVyZV9wcm9tb3RlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4ubGVjdHVyZUlkKSBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfbGVjdHVyZV9pZCcsIFN0cmluZyhuLmxlY3R1cmVJZCkpO1xuICAgICAgICAgICAgICAgICAgICBnbygnbGVjdHVyZXMnKTsgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKG4udHlwZSA9PT0gJ3RvdXJfY29uZmlybWVkJyB8fCBuLnR5cGUgPT09ICd0b3VyX3Byb21vdGVkJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobi50b3VySWQpIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2JnbmpfcGVuZGluZ190b3VyX2lkJywgU3RyaW5nKG4udG91cklkKSk7XG4gICAgICAgICAgICAgICAgICAgIGdvKCd0b3VyJyk7IHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChTdHJpbmcobi50eXBlIHx8ICcnKS5zdGFydHNXaXRoKCdvcmRlcl8nKSkge1xuICAgICAgICAgICAgICAgICAgICBnbygnbXlwYWdlJyk7IHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIC8vIFx1RDNGNFx1QkMzMSBcdTIwMTQgcG9zdElkXHVBQzAwIFx1Qzc4OFx1QzczQ1x1QkE3NCBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjBcbiAgICAgICAgICAgICAgICAgIGlmIChuLnBvc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdiZ25qX3BlbmRpbmdfcG9zdF9pZCcsIFN0cmluZyhuLnBvc3RJZCkpO1xuICAgICAgICAgICAgICAgICAgICBnbygnY29tbXVuaXR5Jyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgICAgICAgICB9fS8+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IGdvKFwibXlwYWdlXCIpfT5cdUI5QzhcdUM3NzRcdUQzOThcdUM3NzRcdUM5QzA8L2J1dHRvbj5cbiAgICAgICAgICAgICAge3VzZXIuaXNBZG1pbiAmJiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gZ28oXCJhZG1pblwiKX0+XHVBRDAwXHVCOUFDPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9e29uTG9nb3V0fT5cdUI4NUNcdUFERjhcdUM1NDRcdUM2QzM8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4tZ2hvc3QgbmF2LWxpbmtcIiBvbkNsaWNrPXsoKSA9PiBnbyhcImxvZ2luXCIpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Zm9udFNpemU6MTIsIGxldHRlclNwYWNpbmc6JzAuMWVtJywgY29sb3I6J3ZhcigtLWluay0yKSd9fT5cdUI4NUNcdUFERjhcdUM3Nzg8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXNtYWxsXCIgb25DbGljaz17KCkgPT4gZ28oXCJzaWdudXBcIil9Plx1RDY4Q1x1QzZEMFx1QUMwMFx1Qzc4NTwvYnV0dG9uPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25hdj5cbiAgKTtcbn07XG5cbmNvbnN0IEZvb3RlciA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3Qgc2MgPSAod2luZG93LkJHTkpfU0lURV9DT05URU5UPy5nZXQ/LigpIHx8IHt9KTtcbiAgY29uc3QgY29udGFjdCA9IHNjLmNvbnRhY3QgfHwge307XG4gIGNvbnN0IGZvb3RlciA9IHNjLmZvb3RlciB8fCB7fTtcbiAgY29uc3QgZlN0eWxlID0gKHdpbmRvdy5CR05KX0ZPT1RFUl9TVFlMRT8uKCkgfHwgd2luZG93LkJHTkpfRk9PVEVSX1NUWUxFX0RFRkFVTFQpO1xuICBjb25zdCBlbWFpbCA9IGNvbnRhY3QuZW1haWwgfHwgXCJoZWxsb0BiZ25qLm5ldFwiO1xuICBjb25zdCBwaG9uZSA9IGNvbnRhY3QucGhvbmUgfHwgXCIwMi0wMDAwLTAwMDBcIjtcbiAgY29uc3QgcGhvbmVIcmVmID0gY29udGFjdC5waG9uZUhyZWYgfHwgKFwidGVsOlwiICsgKHBob25lIHx8IFwiXCIpLnJlcGxhY2UoL1teMC05K10vZywgXCJcIikpO1xuICBjb25zdCBhZGRyZXNzID0gY29udGFjdC5hZGRyZXNzIHx8IFwiXHVDMTFDXHVDNkI4XHVEMkI5XHVCQ0M0XHVDMkRDXCI7XG4gIGNvbnN0IGhlYWRpbmdTdHlsZSA9IHtcbiAgICBmb250U2l6ZTogZlN0eWxlLmhlYWRpbmcuZm9udFNpemUsXG4gICAgZm9udFdlaWdodDogZlN0eWxlLmhlYWRpbmcuZm9udFdlaWdodCxcbiAgICBsZXR0ZXJTcGFjaW5nOiBgJHtmU3R5bGUuaGVhZGluZy5sZXR0ZXJTcGFjaW5nfWVtYCxcbiAgICBjb2xvcjogYHZhcigke2ZTdHlsZS5oZWFkaW5nLmNvbG9yfSlgLFxuICB9O1xuICByZXR1cm4gKFxuICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiZm9vdGVyXCIgYXJpYS1sYWJlbD1cIlx1QzBBQ1x1Qzc3NFx1RDJCOCBcdUM4MTVcdUJDRjQgXHVCQzBGIFx1RDQ3OFx1RDEzMFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItZ3JpZFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8QnJhbmQgb25DbGljaz17KCkgPT4gZ28oXCJob21lXCIpfS8+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17e1xuICAgICAgICAgICAgICBtYXJnaW5Ub3A6MjAsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBmU3R5bGUuZGVzY3JpcHRpb24uZm9udFNpemUsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGZTdHlsZS5kZXNjcmlwdGlvbi5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiBmU3R5bGUuZGVzY3JpcHRpb24ubGluZUhlaWdodCxcbiAgICAgICAgICAgICAgY29sb3I6IGB2YXIoJHtmU3R5bGUuZGVzY3JpcHRpb24uY29sb3J9KWAsXG4gICAgICAgICAgICAgIG1heFdpZHRoOiBmU3R5bGUuZGVzY3JpcHRpb24ubWF4V2lkdGgsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2Zvb3Rlci5kZXNjcmlwdGlvbiB8fCBcIlx1QkM0NVx1QUUzMFx1RDBDMFx1QUNFMCBcdUIxNzhcdUM3OTAuIFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1QjI5NCBcdUQ1NUNcdUFENkRcdUM3NTggXHVDNUVEXHVDMEFDXHUwMEI3XHVCQjM4XHVENjU0XHUwMEI3XHVDNzkwXHVDNUYwXHVDNzQ0IFx1QzlDMVx1QzgxMSBcdUFDNzdcdUFDRTAgXHVCMjkwXHVCMDdDXHVCQTcwIFx1QjA5OFx1QjIwNFx1QjI5NCBcdUM1RUNcdUQ1ODkgXHVDRUU0XHVCQkE0XHVCMkM4XHVEMkYwXHVDNzg1XHVCMkM4XHVCMkU0LiBcdUFEODFcdUFEOTAgXHVCMkY1XHVDMEFDXHVCRDgwXHVEMTMwIFx1QzlDMFx1QzVFRCBcdUM1RUNcdUQ1ODlcdUFFNENcdUM5QzAsIFx1RDU2OFx1QUVEOCBcdUI5Q0NcdUI0RTRcdUM1QjRcdUFDMDBcdUIyOTQgXHVDNUVDXHVENTg5LlwifVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxuYXYgYXJpYS1sYWJlbD1cIlx1Q0Y1OFx1RDE1MFx1Q0UyMCBcdUJDMTRcdUI4NUNcdUFDMDBcdUFFMzBcIj5cbiAgICAgICAgICAgIDxoNCBpZD1cImZ0LWNvbnRlbnRcIiBzdHlsZT17aGVhZGluZ1N0eWxlfT57Zm9vdGVyLmhlYWRpbmdDb250ZW50IHx8IFwiXHVDRjU4XHVEMTUwXHVDRTIwXCJ9PC9oND5cbiAgICAgICAgICAgIDx1bCBhcmlhLWxhYmVsbGVkYnk9XCJmdC1jb250ZW50XCI+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcImNvbHVtblwiKX0+XHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwIFx1Q0U3Q1x1QjdGQzwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcInRvdXJcIil9Plx1RDIyQ1x1QzVCNCBcdUQ1MDRcdUI4NUNcdUFERjhcdUI3QTg8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJib29rXCIpfT5cdTMwMEVcdUM2NTVcdUM3NThcdUFFMzhcdTMwMEY8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJjb21tdW5pdHlcIil9Plx1Q0VFNFx1QkJBNFx1QjJDOFx1RDJGMDwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgIDxuYXYgYXJpYS1sYWJlbD1cIlx1QzgxNVx1QkNGNCBcdUJDMTRcdUI4NUNcdUFDMDBcdUFFMzBcIj5cbiAgICAgICAgICAgIDxoNCBpZD1cImZ0LWluZm9cIiBzdHlsZT17aGVhZGluZ1N0eWxlfT57Zm9vdGVyLmhlYWRpbmdJbmZvIHx8IFwiXHVDODE1XHVCQ0Y0XCJ9PC9oND5cbiAgICAgICAgICAgIDx1bCBhcmlhLWxhYmVsbGVkYnk9XCJmdC1pbmZvXCI+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcImhvbWVcIil9Plx1QUMxNVx1QzVGMCBcdUM3N0NcdUM4MTU8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJjb21tdW5pdHlcIil9Plx1QUNGNVx1QzlDMFx1QzBBQ1x1RDU2RDwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBnbyhcImZhcVwiKX0+XHVDNzkwXHVDOEZDIFx1QkIzQlx1QjI5NCBcdUM5QzhcdUJCMzg8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gZ28oXCJ0ZXJtc1wiKX0+XHVDNzc0XHVDNkE5XHVDNTdEXHVBRDAwPC9idXR0b24+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGdvKFwicHJpdmFjeVwiKX0+XHVBQzFDXHVDNzc4XHVDODE1XHVCQ0Y0IFx1Q0M5OFx1QjlBQ1x1QkMyOVx1Q0U2ODwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgIDxhZGRyZXNzIHN0eWxlPXt7Zm9udFN0eWxlOidub3JtYWwnfX0+XG4gICAgICAgICAgICA8aDQgaWQ9XCJmdC1jb250YWN0XCIgc3R5bGU9e2hlYWRpbmdTdHlsZX0+e2Zvb3Rlci5oZWFkaW5nQ29udGFjdCB8fCBcIlx1QzVGMFx1Qjc3RFwifTwvaDQ+XG4gICAgICAgICAgICA8dWwgYXJpYS1sYWJlbGxlZGJ5PVwiZnQtY29udGFjdFwiPlxuICAgICAgICAgICAgICB7ZW1haWwgJiYgPGxpPjxhIGhyZWY9e2BtYWlsdG86JHtlbWFpbH1gfT57ZW1haWx9PC9hPjwvbGk+fVxuICAgICAgICAgICAgICB7cGhvbmUgJiYgPGxpPjxhIGhyZWY9e3Bob25lSHJlZn0+e3Bob25lfTwvYT48L2xpPn1cbiAgICAgICAgICAgICAge2FkZHJlc3MgJiYgPGxpPjxzcGFuPnthZGRyZXNzfTwvc3Bhbj48L2xpPn1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9hZGRyZXNzPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXItYm90dG9tXCIgc3R5bGU9e3ttYXJnaW5Ub3A6MjR9fT5cbiAgICAgICAgICA8c3Bhbj57Zm9vdGVyLmNvcHlyaWdodCB8fCBcIlx1MDBBOSAyMDI2IFx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MCBCQU5HSU5PSkEgXHUyMDE0IEFMTCBSSUdIVFMgUkVTRVJWRURcIn08L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibW9ubyBkaW0tMlwiIHN0eWxlPXt7Zm9udFNpemU6MTAsIGxldHRlclNwYWNpbmc6JzAuMTRlbSd9fT5cbiAgICAgICAgICAgIHZ7d2luZG93LkJHTkpfVkVSU0lPTj8udmVyc2lvbiB8fCAnMC4wLjAnfSBcdTAwQjcge3dpbmRvdy5CR05KX1ZFUlNJT04/LmJ1aWxkIHx8ICdcdTIwMTQnfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8VGhlbWVUb2dnbGUvPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250U2l6ZTogZlN0eWxlLnNpZ25hdHVyZS5mb250U2l6ZSxcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGZTdHlsZS5zaWduYXR1cmUuZm9udFdlaWdodCxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IGAke2ZTdHlsZS5zaWduYXR1cmUubGV0dGVyU3BhY2luZ31lbWAsXG4gICAgICAgICAgICBjb2xvcjogYHZhcigke2ZTdHlsZS5zaWduYXR1cmUuY29sb3J9KWAsXG4gICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBmU3R5bGUuc2lnbmF0dXJlLnRleHRUcmFuc2Zvcm0gfHwgJ3VwcGVyY2FzZScsXG4gICAgICAgICAgfX0+e2Zvb3Rlci5zaWduYXR1cmUgfHwgXCJcdUJDNDVcdUFFMzBcdUQwQzBcdUFDRTAgXHVCMTc4XHVDNzkwIFx1MDBCNyBERVNJR05FRCBJTiBTRU9VTFwifTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Zvb3Rlcj5cbiAgKTtcbn07XG5cbi8vIFx1RDE0Q1x1QjlDOCBcdUQxQTBcdUFFMDAgXHUyMDE0IGxpZ2h0IFx1MjE5MiBkYXJrIFx1MjE5MiBhdXRvIFx1MjE5MiBsaWdodCBcdUMyMUNcdUQ2NTguIEJHTkpfVEhFTUUgXHVENUVDXHVEMzdDXHVDNjQwIFx1QzlERC5cbmNvbnN0IFRoZW1lVG9nZ2xlID0gKCkgPT4ge1xuICBjb25zdCBbbW9kZSwgc2V0TW9kZV0gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiAod2luZG93LkJHTkpfVEhFTUU/LmdldD8uKCkgfHwgJ2F1dG8nKSk7XG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25DaGFuZ2UgPSAoKSA9PiBzZXRNb2RlKHdpbmRvdy5CR05KX1RIRU1FPy5nZXQ/LigpIHx8ICdhdXRvJyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JnbmotdGhlbWUtY2hhbmdlJywgb25DaGFuZ2UpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmduai10aGVtZS1jaGFuZ2UnLCBvbkNoYW5nZSk7XG4gIH0sIFtdKTtcbiAgaWYgKCF3aW5kb3cuQkdOSl9USEVNRSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG5leHQgPSB3aW5kb3cuQkdOSl9USEVNRS5jeWNsZS5iaW5kKHdpbmRvdy5CR05KX1RIRU1FKTtcbiAgY29uc3QgaWNvbiA9IG1vZGUgPT09ICdkYXJrJyA/ICdcdUQ4M0NcdURGMTknIDogbW9kZSA9PT0gJ2xpZ2h0JyA/ICdcdTI2MDAnIDogJ1x1MjVEMCc7XG4gIGNvbnN0IGxhYmVsID0gbW9kZSA9PT0gJ2RhcmsnID8gJ0RBUksnIDogbW9kZSA9PT0gJ2xpZ2h0JyA/ICdMSUdIVCcgOiAnQVVUTyc7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidGhlbWUtdG9nZ2xlXCIgb25DbGljaz17KCkgPT4gbmV4dCgpfSBhcmlhLWxhYmVsPXtgXHVEMTRDXHVCOUM4IFx1QzgwNFx1RDY1OCBcdTIwMTQgXHVENjA0XHVDN0FDICR7bGFiZWx9YH0gdGl0bGU9XCJcdUQxNENcdUI5Qzg6IFx1Qjc3Q1x1Qzc3NFx1RDJCOCAvIFx1QjJFNFx1RDA2QyAvIFx1Qzc5MFx1QjNEOVwiPlxuICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+e2ljb259PC9zcGFuPjxzcGFuPntsYWJlbH08L3NwYW4+XG4gICAgPC9idXR0b24+XG4gICk7XG59O1xuXG5jb25zdCBPcm5hbWVudCA9ICh7IGNoaWxkcmVuIH0pID0+IChcbiAgPGRpdiBjbGFzc05hbWU9XCJvcm5hbWVudFwiIHN0eWxlPXt7bWFyZ2luOlwiNDBweCAwXCJ9fT5cbiAgICA8c3BhbiBzdHlsZT17e2ZvbnRGYW1pbHk6J3ZhcigtLWZvbnQtc2VyaWYpJywgZm9udFNpemU6MTQsIGxldHRlclNwYWNpbmc6JzAuM2VtJywgY29sb3I6J3ZhcigtLWdvbGQpJ319PlxuICAgICAge2NoaWxkcmVuIHx8IFwiXHU0RTk0XCJ9XG4gICAgPC9zcGFuPlxuICA8L2Rpdj5cbik7XG5cbi8vIHRpdGxlIGFjY2VwdHMgc3RyaW5nIE9SIFJlYWN0IG5vZGUuIEZvciBhY2NlbnQsIHBhc3MgSlNYOiA8Plx1QkM0NVx1QUUzMFx1QjE3OFx1Qzc5MFx1QzVEMCA8c3BhbiBjbGFzc05hbWU9XCJhY2NlbnRcIj5cdUM4MDRcdUQ1NThcdUIyOTQgXHVCOUQwPC9zcGFuPjwvPlxuY29uc3QgU2VjdGlvbkhlYWQgPSAoeyBleWVicm93LCB0aXRsZSwgc3VidGl0bGUsIGFjdGlvbiwgbGV2ZWwgPSAyIH0pID0+IHtcbiAgY29uc3QgSCA9IGBoJHtsZXZlbH1gO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1oZWFkXCI+XG4gICAgICA8ZGl2PlxuICAgICAgICB7ZXllYnJvdyAmJiA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb24tZXllYnJvd1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPntleWVicm93fTwvZGl2Pn1cbiAgICAgICAgPEggY2xhc3NOYW1lPVwic2VjdGlvbi10aXRsZVwiPnt0aXRsZX08L0g+XG4gICAgICAgIHtzdWJ0aXRsZSAmJiA8cCBjbGFzc05hbWU9XCJzZWN0aW9uLXN1YnRpdGxlXCI+e3N1YnRpdGxlfTwvcD59XG4gICAgICA8L2Rpdj5cbiAgICAgIHthY3Rpb259XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBUd2Vha3MgPSAoeyB0d2Vha3MsIHNldFR3ZWFrcywgdmlzaWJsZSB9KSA9PiB7XG4gIGlmICghdmlzaWJsZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHNldCA9IChrLCB2KSA9PiBzZXRUd2Vha3MoeyAuLi50d2Vha3MsIFtrXTogdiB9KTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrc1wiPlxuICAgICAgPGgzPlR3ZWFrczwvaDM+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1yb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3MtbGFiZWxcIj5cdUMyRUNcdUJDRkMgXHVDMkE0XHVEMEMwXHVDNzdDPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLW9wdGlvbnNcIj5cbiAgICAgICAgICB7W1wib3V0bGluZVwiLCBcImZpbGxlZFwiLCBcImRhc2hlZFwiXS5tYXAocyA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uIGtleT17c30gY2xhc3NOYW1lPXt0d2Vha3MubGluZVN0eWxlID09PSBzID8gXCJvblwiIDogXCJcIn1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0KFwibGluZVN0eWxlXCIsIHMpfT5cbiAgICAgICAgICAgICAge3MgPT09IFwib3V0bGluZVwiID8gXCJcdUMxMjBcIiA6IHMgPT09IFwiZmlsbGVkXCIgPyBcIlx1Q0M0NFx1QzZDMFwiIDogXCJcdUQzMENcdUMxMjBcIn1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3Mtcm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLWxhYmVsXCI+XHVBQ0U4XHVCNERDIFx1QUMxNVx1QjNDNCBcdTAwQjcge3R3ZWFrcy5pbnRlbnNpdHkudG9GaXhlZCgxKX08L2Rpdj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIGNsYXNzTmFtZT1cInR3ZWFrcy1zbGlkZXJcIlxuICAgICAgICAgIG1pbj1cIjAuM1wiIG1heD1cIjEuOFwiIHN0ZXA9XCIwLjFcIlxuICAgICAgICAgIHZhbHVlPXt0d2Vha3MuaW50ZW5zaXR5fVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldChcImludGVuc2l0eVwiLCBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKSl9Lz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3Mtcm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHdlYWtzLWxhYmVsXCI+XHVENzg4XHVDNUI0XHVCODVDIFx1QjgwOFx1Qzc3NFx1QzU0NFx1QzZDMzwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1vcHRpb25zXCI+XG4gICAgICAgICAge1tcImNlbnRlclwiLCBcInNwbGl0XCIsIFwiZnVsbGJsZWVkXCJdLm1hcChzID0+IChcbiAgICAgICAgICAgIDxidXR0b24ga2V5PXtzfSBjbGFzc05hbWU9e3R3ZWFrcy5oZXJvTGF5b3V0ID09PSBzID8gXCJvblwiIDogXCJcIn1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0KFwiaGVyb0xheW91dFwiLCBzKX0+XG4gICAgICAgICAgICAgIHtzID09PSBcImNlbnRlclwiID8gXCJcdUM5MTFcdUM1NTlcIiA6IHMgPT09IFwic3BsaXRcIiA/IFwiXHVCRDg0XHVENTYwXCIgOiBcIlx1RDQ4MFx1QkUxNFx1QjlBQ1x1QjREQ1wifVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInR3ZWFrcy1yb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3MtbGFiZWxcIj5cdUM3NzhcdUQxMzBcdUI3OTlcdUMxNTg8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0d2Vha3Mtb3B0aW9uc1wiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXt0d2Vha3MuaW50ZXJhY3RpdmUgPyBcIm9uXCIgOiBcIlwifVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0KFwiaW50ZXJhY3RpdmVcIiwgIXR3ZWFrcy5pbnRlcmFjdGl2ZSl9PlxuICAgICAgICAgICAge3R3ZWFrcy5pbnRlcmFjdGl2ZSA/IFwiT05cIiA6IFwiT0ZGXCJ9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdUNGRTBcdUQwQTQgXHVDMkI5XHVDNzc4IFx1QkMzMFx1QjEwOCBcdTIwMTQgXHVDQ0FCIFx1QkMyOVx1QkIzOCBcdUMyREMgXHVENDVDXHVDMkRDLiBcdUMwQUNcdUM2QTlcdUM3OTBcdUFDMDAgXHVBQ0IwXHVDODE1XHVENTU4XHVCQTc0IGxvY2FsU3RvcmFnZVx1QzVEMCBcdUM2MDFcdUMxOERcdUQ2NTQuXG4vLyBQSVBBIC8gR0RQUiBcdUFDMDBcdUM3NzRcdUI0RENcdUI3N0NcdUM3Nzg6IFx1RDU0NFx1QzIxOChcdUFFMzBcdUIyQTUpXHVCMjk0IFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUFDNzBcdUJEODAgXHVCRDg4XHVBQzAwLCBcdUJEODRcdUMxMURcdTAwQjdcdUI5QzhcdUNGMDBcdUQzMDVcdUM3NDAgXHVDNjM1XHVEMkI4XHVDNzc4LlxuLy8gXHVDODAwXHVDN0E1IFx1RDYxNVx1RDBEQzogeyBuZWNlc3Nhcnk6dHJ1ZSwgYW5hbHl0aWNzOmJvb2wsIG1hcmtldGluZzpib29sLCB0czpJU08gfVxuY29uc3QgQ29va2llQ29uc2VudCA9ICgpID0+IHtcbiAgY29uc3QgS0VZID0gJ2JnbmpfY29va2llX2NvbnNlbnQnO1xuICBjb25zdCBbZGVjaXNpb24sIHNldERlY2lzaW9uXSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+IHtcbiAgICB0cnkgeyBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShLRVkpOyByZXR1cm4gcmF3ID8gSlNPTi5wYXJzZShyYXcpIDogbnVsbDsgfSBjYXRjaCB7IHJldHVybiBudWxsOyB9XG4gIH0pO1xuICBjb25zdCBbZGV0YWlscywgc2V0RGV0YWlsc10gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFthbmFseXRpY3MsIHNldEFuYWx5dGljc10gPSBSZWFjdC51c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW21hcmtldGluZywgc2V0TWFya2V0aW5nXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBwZXJzaXN0ID0gKG5leHQpID0+IHtcbiAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShLRVksIEpTT04uc3RyaW5naWZ5KG5leHQpKTsgfSBjYXRjaCB7fVxuICAgIHNldERlY2lzaW9uKG5leHQpO1xuICAgIHRyeSB7IHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnYmduai1jb29raWUtY29uc2VudCcsIHsgZGV0YWlsOiBuZXh0IH0pKTsgfSBjYXRjaCB7fVxuICB9O1xuXG4gIGNvbnN0IGFjY2VwdEFsbCA9ICgpID0+IHBlcnNpc3QoeyBuZWNlc3Nhcnk6IHRydWUsIGFuYWx5dGljczogdHJ1ZSwgbWFya2V0aW5nOiB0cnVlLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0pO1xuICBjb25zdCByZWplY3RBbGwgPSAoKSA9PiBwZXJzaXN0KHsgbmVjZXNzYXJ5OiB0cnVlLCBhbmFseXRpY3M6IGZhbHNlLCBtYXJrZXRpbmc6IGZhbHNlLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0pO1xuICBjb25zdCBzYXZlQ3VzdG9tID0gKCkgPT4gcGVyc2lzdCh7IG5lY2Vzc2FyeTogdHJ1ZSwgYW5hbHl0aWNzOiAhIWFuYWx5dGljcywgbWFya2V0aW5nOiAhIW1hcmtldGluZywgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9KTtcblxuICBpZiAoZGVjaXNpb24pIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cImZhbHNlXCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29va2llLWJhbm5lci10aXRsZVwiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgbGVmdDogMTYsIHJpZ2h0OiAxNiwgYm90dG9tOiAxNixcbiAgICAgICAgbWF4V2lkdGg6IDcyMCwgbWFyZ2luOiAnMCBhdXRvJywgekluZGV4OiA4MCxcbiAgICAgICAgYmFja2dyb3VuZDogJ3ZhcigtLWJnLTIpJywgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWdvbGQtZGltKScsXG4gICAgICAgIGJveFNoYWRvdzogJzAgMTZweCA0MHB4IHJnYmEoMCwwLDAsMC40NSknLFxuICAgICAgICBwYWRkaW5nOiAnMjBweCAyMnB4JywgYm9yZGVyUmFkaXVzOiA0LFxuICAgICAgfX0+XG4gICAgICA8aDIgaWQ9XCJjb29raWUtYmFubmVyLXRpdGxlXCIgY2xhc3NOYW1lPVwia28tc2VyaWZcIiBzdHlsZT17eyBmb250U2l6ZTogMTYsIG1hcmdpbkJvdHRvbTogOCB9fT5cdUNGRTBcdUQwQTQgXHVDMEFDXHVDNkE5IFx1QjNEOVx1Qzc1ODwvaDI+XG4gICAgICA8cCBjbGFzc05hbWU9XCJkaW1cIiBzdHlsZT17eyBmb250U2l6ZTogMTMsIGxpbmVIZWlnaHQ6IDEuNywgbWFyZ2luQm90dG9tOiAxNCB9fT5cbiAgICAgICAgXHVCQzQ1XHVBRTMwXHVCMTc4XHVDNzkwXHVCMjk0IFx1QzExQ1x1QkU0NFx1QzJBNCBcdUM2QjRcdUM2MDFcdUM3NDQgXHVDNzA0XHVENTVDIDxzdHJvbmcgY2xhc3NOYW1lPVwiZ29sZFwiPlx1RDU0NFx1QzIxOCBcdUNGRTBcdUQwQTQ8L3N0cm9uZz5cdUM2NDAsIFx1QzBBQ1x1Qzc3NFx1RDJCOCBcdUFDMUNcdUMxMjBcdUM3NDQgXHVDNzA0XHVENTVDXG4gICAgICAgIDxzdHJvbmcgY2xhc3NOYW1lPVwiZ29sZFwiPiBcdUJEODRcdUMxMUQgXHVDRkUwXHVEMEE0PC9zdHJvbmc+XHUwMEI3PHN0cm9uZyBjbGFzc05hbWU9XCJnb2xkXCI+XHVCOUM4XHVDRjAwXHVEMzA1IFx1Q0ZFMFx1RDBBNDwvc3Ryb25nPlx1Qjk3QyBcdUMwQUNcdUM2QTlcdUQ1NjlcdUIyQzhcdUIyRTQuXG4gICAgICAgIFx1QzEzOFx1QkQ4MCBcdUMxMjRcdUM4MTVcdUM1RDBcdUMxMUMgXHVENTZEXHVCQUE5XHVCQ0M0XHVCODVDIFx1QzEyMFx1RDBERFx1RDU1OFx1QzJFNCBcdUMyMTggXHVDNzg4XHVDNUI0XHVDNjk0LlxuICAgICAgPC9wPlxuICAgICAge2RldGFpbHMgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogMTQsIHBhZGRpbmdUb3A6IDEwLCBib3JkZXJUb3A6ICcxcHggc29saWQgdmFyKC0tbGluZSknIH19PlxuICAgICAgICAgIDxmaWVsZHNldCBzdHlsZT17eyBib3JkZXI6ICdub25lJywgcGFkZGluZzogMCwgbWFyZ2luOiAwIH19PlxuICAgICAgICAgICAgPGxlZ2VuZCBjbGFzc05hbWU9XCJzci1vbmx5XCI+XHVDRkUwXHVEMEE0IFx1RDU2RFx1QkFBOVx1QkNDNCBcdUIzRDlcdUM3NTg8L2xlZ2VuZD5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2dyaWQnLCBnYXA6IDEwIH19PlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6IDEwLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcsIG9wYWNpdHk6IDAuNyB9fT5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZCByZWFkT25seSBhcmlhLWxhYmVsPVwiXHVENTQ0XHVDMjE4IFx1Q0ZFMFx1RDBBNCAoXHVENTZEXHVDMEMxIFx1RDY1Q1x1QzEzMSlcIi8+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGZvbnRTaXplOiAxMyB9fT5cdUQ1NDRcdUMyMTg8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMiwgZGlzcGxheTogJ2Jsb2NrJyB9fT5cdUI4NUNcdUFERjhcdUM3NzggXHVDMTM4XHVDMTU4LCBcdUJDRjRcdUM1NDgsIFx1RDU0NFx1QzIxOCBcdUFFMzBcdUIyQTUgXHVCM0Q5XHVDNzkxXHVDNUQwIFx1QzBBQ1x1QzZBOS4gXHVBQzcwXHVCRDgwIFx1QkQ4OFx1QUMwMC48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6IDEwLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcgfX0+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e2FuYWx5dGljc30gb25DaGFuZ2U9eyhlKSA9PiBzZXRBbmFseXRpY3MoZS50YXJnZXQuY2hlY2tlZCl9XG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiXHVCRDg0XHVDMTFEIFx1Q0ZFMFx1RDBBNCBcdUIzRDlcdUM3NThcIi8+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGZvbnRTaXplOiAxMyB9fT5cdUJEODRcdUMxMUQ8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRpbVwiIHN0eWxlPXt7IGZvbnRTaXplOiAxMiwgZGlzcGxheTogJ2Jsb2NrJyB9fT5cdUJDMjlcdUJCMzggXHVEMUI1XHVBQ0M0XHUwMEI3XHVEMzk4XHVDNzc0XHVDOUMwIFx1QzEzMVx1QjJBNSBcdUFDMUNcdUMxMjBcdUM2QTkuIFx1QzJERFx1QkNDNFx1Qzc5MCBcdUM3NzVcdUJBODUgXHVDQzk4XHVCOUFDLjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogMTAsIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JyB9fT5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17bWFya2V0aW5nfSBvbkNoYW5nZT17KGUpID0+IHNldE1hcmtldGluZyhlLnRhcmdldC5jaGVja2VkKX1cbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJcdUI5QzhcdUNGMDBcdUQzMDUgXHVDRkUwXHVEMEE0IFx1QjNEOVx1Qzc1OFwiLz5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgZm9udFNpemU6IDEzIH19Plx1QjlDOFx1Q0YwMFx1RDMwNTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGltXCIgc3R5bGU9e3sgZm9udFNpemU6IDEyLCBkaXNwbGF5OiAnYmxvY2snIH19Plx1QUQwMFx1QzJFQ1x1QzBBQyBcdUFFMzBcdUJDMTggXHVDNTQ4XHVCMEI0LCBcdUM2NzhcdUJEODAgXHVBRDExXHVBQ0UwIFx1QjlFNFx1Q0NCNCBcdUM1RjBcdUIzRDlcdUM1RDAgXHVDMEFDXHVDNkE5Ljwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiA4LCBmbGV4V3JhcDogJ3dyYXAnLCBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyB9fT5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9eygpID0+IHNldERldGFpbHMoKHYpID0+ICF2KX1cbiAgICAgICAgICBhcmlhLWV4cGFuZGVkPXtkZXRhaWxzfT5cbiAgICAgICAgICB7ZGV0YWlscyA/ICdcdUFDMDRcdUIyRThcdUQ3ODgnIDogJ1x1QzEzOFx1QkQ4MCBcdUMxMjRcdUM4MTUnfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbFwiIG9uQ2xpY2s9e3JlamVjdEFsbH0+XHVCQUE4XHVCNDUwIFx1QUM3MFx1QkQ4MDwvYnV0dG9uPlxuICAgICAgICB7ZGV0YWlsc1xuICAgICAgICAgID8gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbWFsbCBidG4tZ29sZFwiIG9uQ2xpY2s9e3NhdmVDdXN0b219Plx1QzEyMFx1RDBERCBcdUM4MDBcdUM3QTU8L2J1dHRvbj5cbiAgICAgICAgICA6IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc21hbGwgYnRuLWdvbGRcIiBvbkNsaWNrPXthY2NlcHRBbGx9Plx1QkFBOFx1QjQ1MCBcdUIzRDlcdUM3NTg8L2J1dHRvbj59XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IEJyYW5kLCBOYXYsIEZvb3RlciwgT3JuYW1lbnQsIFNlY3Rpb25IZWFkLCBUd2Vha3MsIEF1dGhvckdyYWRlQmFkZ2UsIE5vdGlmaWNhdGlvbkJlbGwsIFNjcm9sbFRvVG9wLCBCYW5naW5vamFJY29uLCBDb29raWVDb25zZW50IH0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBUUEsT0FBTyxnQkFBZ0IsU0FBUyxjQUFjLEVBQUUsTUFBTSxPQUFPLFNBQVMsYUFBYSxNQUFNLEdBQUc7QUFDMUYsUUFBTSxhQUFhLFNBQVM7QUFDNUIsUUFBTSxxQkFBcUIsTUFBTSxZQUFZLE1BQU07QUFDakQsUUFBSSxDQUFDLE9BQU87QUFBRTtBQUFhO0FBQUEsSUFBUTtBQUNuQyxRQUFJLGFBQWE7QUFFZixZQUFNLE1BQU0sT0FBTyxRQUFRLEdBQUcsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBLG9GQUE0RTtBQUNwSCxVQUFJLEtBQUs7QUFDUCxZQUFJO0FBQUUsc0JBQVk7QUFBQSxRQUFHLFNBQVE7QUFBQSxRQUFDO0FBQUEsTUFDaEM7QUFDQTtBQUFBLElBQ0YsT0FBTztBQUNMLFlBQU0sS0FBSyxPQUFPLFFBQVEsR0FBRyxVQUFVLDRIQUE2QjtBQUNwRSxVQUFJLEdBQUk7QUFBQSxJQUNWO0FBQUEsRUFDRixHQUFHLENBQUMsT0FBTyxTQUFTLGFBQWEsVUFBVSxDQUFDO0FBRTVDLFFBQU0sVUFBVSxNQUFNO0FBQ3BCLFFBQUksQ0FBQyxLQUFNO0FBRVgsVUFBTSxRQUFRLENBQUMsTUFBTTtBQUNuQixVQUFJLEVBQUUsUUFBUSxZQUFZLEVBQUUsUUFBUSxPQUFPO0FBQ3pDLFVBQUUsZUFBZTtBQUNqQiwyQkFBbUI7QUFBQSxNQUNyQjtBQUFBLElBQ0Y7QUFDQSxXQUFPLGlCQUFpQixXQUFXLEtBQUs7QUFFeEMsVUFBTSxlQUFlLFNBQVMsS0FBSyxNQUFNO0FBQ3pDLGFBQVMs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

})();

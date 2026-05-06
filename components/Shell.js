(function(){
window.useModalGuard = function useModalGuard({ open, dirty, onClose, onSaveDraft, label, contentRef }) {
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
  React.useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement;
    let container = null;
    const findContainer = () => (contentRef == null ? void 0 : contentRef.current) || document.querySelector('[role="dialog"][aria-modal="true"]') || document.querySelector('[data-bgnj-modal="true"]');
    container = findContainer();
    let raf = null;
    if (!container) {
      raf = requestAnimationFrame(() => {
        container = findContainer();
        attach();
      });
    }
    const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const listFocusables = () => {
      if (!container) return [];
      return Array.from(container.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    };
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const fs = listFocusables();
      if (fs.length === 0) return;
      const first = fs[0], last = fs[fs.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        try {
          last.focus();
        } catch (e2) {
        }
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        try {
          first.focus();
        } catch (e2) {
        }
      }
    };
    function attach() {
      if (!container) return;
      const fs = listFocusables();
      if (fs.length > 0 && !container.contains(document.activeElement)) {
        try {
          fs[0].focus();
        } catch (e) {
        }
      }
      container.addEventListener("keydown", onKey);
    }
    attach();
    return () => {
      var _a;
      if (raf) cancelAnimationFrame(raf);
      if (container) container.removeEventListener("keydown", onKey);
      try {
        (_a = prevFocus == null ? void 0 : prevFocus.focus) == null ? void 0 : _a.call(prevFocus);
      } catch (e) {
      }
    };
  }, [open, contentRef]);
  return { onBackdropClick, handleAttemptClose };
};
const ScrollToTop = React.memo(() => {
  const [visible, setVisible] = React.useState(false);
  const visibleRef = React.useRef(visible);
  visibleRef.current = visible;
  React.useEffect(() => {
    const adminScroller = document.querySelector('div[aria-label="\uAD00\uB9AC\uC790 \uBA54\uB274"] + div');
    let queued = false;
    const tick = () => {
      queued = false;
      const sy = adminScroller ? Math.max(adminScroller.scrollTop || 0, window.scrollY || 0) : window.scrollY || 0;
      const next = sy > 320;
      if (next !== visibleRef.current) setVisible(next);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
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
});
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
    { key: "book", label: navL.book || "\uBC45\uAE30\uB178\uC790 \uB3C4\uC11C" },
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
const _MemoNav = React.memo(Nav);
const _MemoFooter = React.memo(Footer);
const _MemoCookieConsent = React.memo(CookieConsent);
Object.assign(window, {
  Brand,
  Nav: _MemoNav,
  Footer: _MemoFooter,
  Ornament,
  SectionHead,
  Tweaks,
  AuthorGradeBadge,
  NotificationBell,
  ScrollToTop,
  BanginojaIcon,
  CoverPlaceholder,
  CookieConsent: _MemoCookieConsent
});

})();

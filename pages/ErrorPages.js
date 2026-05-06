(function(){
const _ErrorBrand = () => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "18px 22px", borderBottom: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
  width: 22,
  height: 22,
  display: "inline-grid",
  placeItems: "center",
  background: "var(--primary)",
  color: "#0F172A",
  fontWeight: 800,
  fontSize: 11,
  borderRadius: 4,
  fontFamily: "var(--font-mono)"
} }, "B"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", color: "var(--ink)" } }, "\uBC45\uAE30\uB178\uC790"));
const _ErrorIllustration = ({ src, alt }) => {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    setFailed(false);
  }, [src]);
  return /* @__PURE__ */ React.createElement("div", { style: { margin: "24px auto 12px", width: "100%", maxWidth: 300, aspectRatio: "1 / 1" } }, !failed ? /* @__PURE__ */ React.createElement(
    "img",
    {
      src,
      alt,
      onError: () => setFailed(true),
      style: { width: "100%", height: "100%", objectFit: "contain", display: "block" }
    }
  ) : /* @__PURE__ */ React.createElement("div", { style: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    fontSize: 80,
    background: "rgba(245,213,72,0.12)",
    borderRadius: 24,
    color: "var(--primary)"
  }, "aria-hidden": "true", title: alt + " (\uC774\uBBF8\uC9C0 \uBBF8\uC5C5\uB85C\uB4DC)" }, "\u2708\uFE0F"));
};
const ErrorCard = ({
  code,
  title,
  subtitle,
  imageSrc,
  imageAlt,
  primaryAction,
  secondaryAction,
  tertiaryAction
}) => /* @__PURE__ */ React.createElement("article", { style: {
  width: "100%",
  maxWidth: 520,
  background: "var(--bg)",
  border: "1px solid var(--line)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
  borderRadius: 16,
  overflow: "hidden",
  margin: "0 auto"
} }, /* @__PURE__ */ React.createElement(_ErrorBrand, null), /* @__PURE__ */ React.createElement("div", { style: { padding: "28px 28px 24px", textAlign: "center" } }, code && /* @__PURE__ */ React.createElement("div", { style: {
  fontSize: 54,
  fontWeight: 800,
  color: "var(--primary)",
  letterSpacing: "-0.02em",
  lineHeight: 1,
  marginBottom: 14,
  fontFamily: 'var(--font-serif, "ChosunIlboMyungjo", serif)'
} }, code), /* @__PURE__ */ React.createElement("h1", { style: {
  fontSize: 18,
  fontWeight: 700,
  color: "var(--ink)",
  lineHeight: 1.5,
  margin: "0 0 12px",
  wordBreak: "keep-all"
} }, title), subtitle && /* @__PURE__ */ React.createElement("p", { style: {
  fontSize: 13,
  color: "var(--ink-3)",
  lineHeight: 1.7,
  margin: 0,
  wordBreak: "keep-all"
} }, subtitle), /* @__PURE__ */ React.createElement(_ErrorIllustration, { src: imageSrc, alt: imageAlt || title }), /* @__PURE__ */ React.createElement("div", { style: {
  display: "flex",
  flexDirection: tertiaryAction ? "column" : "row",
  gap: 10,
  marginTop: 8
} }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flex: 1 } }, primaryAction && /* @__PURE__ */ React.createElement(
  "button",
  {
    type: "button",
    onClick: primaryAction.onClick,
    style: {
      flex: 1,
      padding: "12px 16px",
      fontSize: 13,
      fontWeight: 600,
      background: "var(--primary)",
      color: "#0F172A",
      border: "1px solid var(--primary)",
      borderRadius: 10,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6
    }
  },
  primaryAction.icon && /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, primaryAction.icon),
  primaryAction.label
), secondaryAction && /* @__PURE__ */ React.createElement(
  "button",
  {
    type: "button",
    onClick: secondaryAction.onClick,
    style: {
      flex: 1,
      padding: "12px 16px",
      fontSize: 13,
      fontWeight: 600,
      background: "var(--bg)",
      color: "var(--ink)",
      border: "1px solid var(--line-2)",
      borderRadius: 10,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6
    }
  },
  secondaryAction.icon && /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, secondaryAction.icon),
  secondaryAction.label
)), tertiaryAction && /* @__PURE__ */ React.createElement(
  "button",
  {
    type: "button",
    onClick: tertiaryAction.onClick,
    style: {
      padding: "10px 16px",
      fontSize: 12,
      fontWeight: 500,
      background: "transparent",
      color: "var(--ink-2)",
      border: "1px solid var(--line-2)",
      borderRadius: 10,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6
    }
  },
  tertiaryAction.icon && /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, tertiaryAction.icon),
  tertiaryAction.label
))));
const ErrorScreen = ({ embedded, children }) => embedded ? children : /* @__PURE__ */ React.createElement("div", { style: { minHeight: "calc(100vh - 80px)", display: "grid", placeItems: "center", padding: "40px 16px", background: "var(--bg)" } }, children);
const Error404Page = ({ go, embedded }) => /* @__PURE__ */ React.createElement(ErrorScreen, { embedded }, /* @__PURE__ */ React.createElement(
  ErrorCard,
  {
    code: "404",
    title: "\uBE44\uD589\uAE30\uAC00 \uC7A0\uC2DC \uB2E4\uB978 \uD56D\uB85C\uB85C \uB4E4\uC5B4\uAC14\uC5B4\uC694.",
    subtitle: /* @__PURE__ */ React.createElement(React.Fragment, null, "\uCC3E\uC73C\uC2DC\uB294 \uD398\uC774\uC9C0\uAC00 \uC774\uB3D9\uB418\uC5C8\uAC70\uB098,", /* @__PURE__ */ React.createElement("br", null), "\uC8FC\uC18C\uAC00 \uC798\uBABB \uC785\uB825\uB418\uC5C8\uC744 \uC218 \uC788\uC5B4\uC694."),
    imageSrc: "/assets/errors/404.png",
    imageAlt: "\uAE38\uC744 \uC783\uC740 \uBE44\uD589\uAE30",
    primaryAction: { label: "\uD648\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30", icon: "\u{1F3E0}", onClick: () => go == null ? void 0 : go("home") },
    secondaryAction: { label: "\uD22C\uC5B4 \uB458\uB7EC\uBCF4\uAE30", icon: "\u{1F9ED}", onClick: () => go == null ? void 0 : go("tour") },
    tertiaryAction: { label: "\uC774\uC804 \uD398\uC774\uC9C0\uB85C", icon: "\u2190", onClick: () => {
      try {
        history.back();
      } catch (e) {
      }
    } }
  }
));
const Error500Page = ({ go, onRetry, embedded }) => /* @__PURE__ */ React.createElement(ErrorScreen, { embedded }, /* @__PURE__ */ React.createElement(
  ErrorCard,
  {
    code: "500",
    title: "\uAD00\uC81C\uD0D1\uC5D0\uC11C \uC7A0\uC2DC \uC2E0\uD638\uB97C \uC815\uB9AC\uD558\uACE0 \uC788\uC5B4\uC694.",
    subtitle: /* @__PURE__ */ React.createElement(React.Fragment, null, "\uC11C\uBE44\uC2A4 \uCC98\uB9AC \uC911 \uC77C\uC2DC\uC801\uC778 \uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694.", /* @__PURE__ */ React.createElement("br", null), "\uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694."),
    imageSrc: "/assets/errors/500.png",
    imageAlt: "\uC2E0\uD638\uB97C \uC815\uB9AC\uD558\uB294 \uAD00\uC81C\uD0D1",
    primaryAction: { label: "\uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAE30", icon: "\u{1F504}", onClick: () => {
      try {
        onRetry ? onRetry() : window.location.reload();
      } catch (e) {
      }
    } },
    secondaryAction: { label: "\uD648\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30", icon: "\u{1F3E0}", onClick: () => go == null ? void 0 : go("home") }
  }
));
const Error403Page = ({ go, embedded }) => /* @__PURE__ */ React.createElement(ErrorScreen, { embedded }, /* @__PURE__ */ React.createElement(
  ErrorCard,
  {
    code: "403",
    title: "\uC774 \uD56D\uACF5\uD3B8\uC740 \uD0D1\uC2B9 \uAD8C\uD55C\uC774 \uD544\uC694\uD574\uC694.",
    subtitle: "\uD604\uC7AC \uACC4\uC815\uC73C\uB85C\uB294 \uC811\uADFC\uD560 \uC218 \uC5C6\uB294 \uD398\uC774\uC9C0\uC785\uB2C8\uB2E4.",
    imageSrc: "/assets/errors/403.png",
    imageAlt: "\uC7A0\uAE34 \uC790\uBB3C\uC1E0",
    primaryAction: { label: "\uB85C\uADF8\uC778\uD558\uAE30", icon: "\u{1F464}", onClick: () => go == null ? void 0 : go("login") },
    secondaryAction: { label: "\uD648\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30", icon: "\u{1F3E0}", onClick: () => go == null ? void 0 : go("home") }
  }
));
const Error401Page = ({ go, embedded }) => /* @__PURE__ */ React.createElement(ErrorScreen, { embedded }, /* @__PURE__ */ React.createElement(
  ErrorCard,
  {
    code: "401",
    title: "\uD0D1\uC2B9\uAD8C \uD655\uC778\uC774 \uD544\uC694\uD574\uC694.",
    subtitle: /* @__PURE__ */ React.createElement(React.Fragment, null, "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD55C \uC11C\uBE44\uC2A4\uC785\uB2C8\uB2E4.", /* @__PURE__ */ React.createElement("br", null), "\uACC4\uC18D \uC774\uC6A9\uD558\uB824\uBA74 \uBA3C\uC800 \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694."),
    imageSrc: "/assets/errors/401.png",
    imageAlt: "\uD0D1\uC2B9\uAD8C \uD655\uC778",
    primaryAction: { label: "\uB85C\uADF8\uC778\uD558\uAE30", icon: "\u{1F464}", onClick: () => go == null ? void 0 : go("login") },
    secondaryAction: { label: "\uD68C\uC6D0\uAC00\uC785\uD558\uAE30", icon: "\u{1F465}", onClick: () => go == null ? void 0 : go("signup") }
  }
));
const ErrorNetworkPage = ({ onRetry, embedded }) => /* @__PURE__ */ React.createElement(ErrorScreen, { embedded }, /* @__PURE__ */ React.createElement(
  ErrorCard,
  {
    code: null,
    title: "\uD558\uB298\uAE38 \uC5F0\uACB0\uC774 \uC7A0\uC2DC \uBD88\uC548\uC815\uD574\uC694.",
    subtitle: /* @__PURE__ */ React.createElement(React.Fragment, null, "\uC778\uD130\uB137 \uC5F0\uACB0 \uC0C1\uD0DC\uB97C \uD655\uC778\uD55C \uB4A4", /* @__PURE__ */ React.createElement("br", null), "\uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694."),
    imageSrc: "/assets/errors/network.png",
    imageAlt: "\uB124\uD2B8\uC6CC\uD06C \uC2E0\uD638 \uC57D\uD568",
    primaryAction: { label: "\uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAE30", icon: "\u{1F504}", onClick: () => {
      try {
        onRetry ? onRetry() : window.location.reload();
      } catch (e) {
      }
    } }
  }
));
const ErrorMaintenancePage = ({ go, embedded }) => /* @__PURE__ */ React.createElement(ErrorScreen, { embedded }, /* @__PURE__ */ React.createElement(
  ErrorCard,
  {
    code: null,
    title: "\uC11C\uBE44\uC2A4 \uC810\uAC80 \uC911\uC774\uC5D0\uC694.",
    subtitle: /* @__PURE__ */ React.createElement(React.Fragment, null, "\uB354 \uC88B\uC740 \uC5EC\uD589\uC744 \uC704\uD574 \uC7A0\uC2DC \uC815\uBE44 \uC911\uC774\uC5D0\uC694.", /* @__PURE__ */ React.createElement("br", null), "\uD604\uC7AC \uC11C\uBE44\uC2A4 \uC810\uAC80\uC774 \uC9C4\uD589 \uC911\uC785\uB2C8\uB2E4. \uACE7 \uB2E4\uC2DC \uC774\uC6A9\uD558\uC2E4 \uC218 \uC788\uC5B4\uC694."),
    imageSrc: "/assets/errors/maintenance.png",
    imageAlt: "\uC810\uAC80 \uC548\uB0B4",
    primaryAction: { label: "\uACF5\uC9C0\uC0AC\uD56D \uBCF4\uAE30", icon: "\u{1F4E2}", onClick: () => go == null ? void 0 : go("community") },
    secondaryAction: { label: "\uD648\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30", icon: "\u{1F3E0}", onClick: () => go == null ? void 0 : go("home") }
  }
));
Object.assign(window, {
  ErrorCard,
  ErrorScreen,
  Error404Page,
  Error500Page,
  Error403Page,
  Error401Page,
  ErrorNetworkPage,
  ErrorMaintenancePage
});

})();

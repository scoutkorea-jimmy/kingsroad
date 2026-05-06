(function(){
const KoreaMap = ({ onSelect, selected }) => {
  const [hovered, setHovered] = React.useState(null);
  const regions = window.KOREA_REGIONS || [];
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%" } }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      viewBox: "0 0 524 631",
      style: { width: "100%", height: "auto", display: "block", overflow: "visible" },
      "aria-label": "\uB300\uD55C\uBBFC\uAD6D \uAD11\uC5ED\uC2DC\uB3C4 \uC9C0\uB3C4"
    },
    /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("filter", { id: "map-shadow", x: "-8%", y: "-8%", width: "116%", height: "116%" }, /* @__PURE__ */ React.createElement("feDropShadow", { dx: "0", dy: "2", stdDeviation: "3", floodColor: "#92400E", floodOpacity: "0.18" }))),
    regions.map((r) => {
      const isHovered = hovered === r.id;
      const isSelected = selected === r.id;
      const isActive = isHovered || isSelected;
      return /* @__PURE__ */ React.createElement("g", { key: r.id }, /* @__PURE__ */ React.createElement(
        "path",
        {
          d: r.path,
          fill: isSelected ? "var(--secondary)" : isHovered ? "var(--primary-dim)" : "var(--bg-2)",
          stroke: isActive ? "var(--primary-active)" : "var(--line-2)",
          strokeWidth: isActive ? 1.6 : 1.1,
          style: { cursor: "pointer", transition: "fill 0.15s ease, stroke 0.15s ease" },
          filter: isActive ? "url(#map-shadow)" : void 0,
          onClick: () => onSelect && onSelect(r),
          onMouseEnter: () => setHovered(r.id),
          onMouseLeave: () => setHovered(null),
          role: "button",
          "aria-label": r.fullname,
          tabIndex: 0,
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect && onSelect(r);
            }
          }
        }
      ), /* @__PURE__ */ React.createElement(
        "text",
        {
          x: r.cx,
          y: r.cy,
          textAnchor: "middle",
          fontSize: r.id === "sejong" ? 6 : r.id === "incheon" || r.id === "gwangju" || r.id === "daejeon" || r.id === "ulsan" ? 7.5 : 9,
          fill: isSelected ? "var(--bg)" : "var(--secondary)",
          fontFamily: "var(--font-sans)",
          fontWeight: "700",
          opacity: isActive ? 1 : 0,
          style: { pointerEvents: "none", userSelect: "none", transition: "opacity 0.15s ease, fill 0.15s ease" },
          "aria-hidden": isActive ? void 0 : "true"
        },
        r.name
      ));
    })
  ));
};
Object.assign(window, { KoreaMap });

})();

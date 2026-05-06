(function(){
const _emptyCashReceipt = () => ({ requested: false, type: "personal", identifier: "" });
const CashReceiptField = ({ value, onChange }) => {
  const v = value || _emptyCashReceipt();
  const set = (patch) => onChange == null ? void 0 : onChange({ ...v, ...patch });
  const idLabel = v.type === "business" ? "\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638" : "\uD734\uB300\uD3F0 \uBC88\uD638";
  const idPlaceholder = v.type === "business" ? "000-00-00000" : "010-0000-0000";
  return /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: "0 0 14px" } }, /* @__PURE__ */ React.createElement("div", { className: "field-label", style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", null, "\uD604\uAE08\uC601\uC218\uC99D"), /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 10, letterSpacing: "0.14em" } }, "CASH RECEIPT")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: v.requested ? 10 : 0, flexWrap: "wrap" } }, [
    { k: false, l: "\uBBF8\uC2E0\uCCAD" },
    { k: true, l: "\uC2E0\uCCAD" }
  ].map((opt) => {
    const active = v.requested === opt.k;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: String(opt.k),
        type: "button",
        onClick: () => set({ requested: opt.k }),
        "aria-pressed": active,
        style: {
          padding: "8px 16px",
          fontSize: 13,
          background: active ? "rgba(245,213,72,0.14)" : "var(--bg)",
          color: active ? "var(--secondary)" : "var(--ink-2)",
          border: "1px solid " + (active ? "var(--primary)" : "var(--line)"),
          fontWeight: active ? 700 : 500,
          cursor: "pointer"
        }
      },
      opt.l
    );
  })), v.requested && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 10, padding: "12px 14px", background: "var(--bg-2)", border: "1px solid var(--line)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, [
    { k: "personal", l: "\uAC1C\uC778 \uC18C\uB4DD\uACF5\uC81C" },
    { k: "business", l: "\uC0AC\uC5C5\uC790 \uC9C0\uCD9C\uC99D\uBE59" }
  ].map((opt) => {
    const active = v.type === opt.k;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: opt.k,
        type: "button",
        onClick: () => set({ type: opt.k }),
        "aria-pressed": active,
        style: {
          padding: "7px 10px",
          fontSize: 12,
          background: active ? "rgba(245,213,72,0.10)" : "var(--bg)",
          color: active ? "var(--secondary)" : "var(--ink-2)",
          border: "1px solid " + (active ? "var(--primary)" : "var(--line)"),
          fontWeight: active ? 700 : 500,
          cursor: "pointer"
        }
      },
      opt.l
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "field", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("label", { className: "field-label", style: { fontSize: 11 } }, idLabel), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "field-input",
      value: v.identifier,
      onChange: (e) => set({ identifier: e.target.value }),
      placeholder: idPlaceholder,
      autoComplete: "off",
      inputMode: v.type === "business" ? "numeric" : "tel"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "dim-2", style: { fontSize: 11, lineHeight: 1.7 } }, "\u24D8 \uC785\uAE08 \uD655\uC778 \uD6C4 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "3\uC77C \uC774\uB0B4"), " \uAD6D\uC138\uCCAD \uD604\uAE08\uC601\uC218\uC99D \uAC00\uB9F9\uC810 \uC2DC\uC2A4\uD15C\uC5D0\uC11C \uBC1C\uAE09\uB429\uB2C8\uB2E4. \uBC1C\uAE09\uC774 \uD655\uC778\uB418\uC9C0 \uC54A\uC73C\uBA74 ", /* @__PURE__ */ React.createElement("strong", { className: "gold" }, "\uB2F9\uD574(\uC5F0\uB0B4)"), "\uC5D0 ", /* @__PURE__ */ React.createElement("a", { className: "gold", href: "mailto:contact@bgnj.net" }, "contact@bgnj.net"), " \uC73C\uB85C \uC5F0\uB77D \uC8FC\uC138\uC694.")));
};
const encodeCashReceipt = (value) => {
  const v = value || {};
  if (!v.requested) return "";
  const type = v.type === "business" ? "\uC0AC\uC5C5\uC790 \uC9C0\uCD9C\uC99D\uBE59" : "\uAC1C\uC778 \uC18C\uB4DD\uACF5\uC81C";
  const id = (v.identifier || "").trim() || "\uBBF8\uC785\uB825";
  return `[\uD604\uAE08\uC601\uC218\uC99D \uC2E0\uCCAD \u2014 ${type} / \uC2DD\uBCC4\uBC88\uD638: ${id}]
`;
};
window.BGNJ_CashReceiptField = CashReceiptField;
window.BGNJ_CashReceipt = { encode: encodeCashReceipt, empty: _emptyCashReceipt };

})();

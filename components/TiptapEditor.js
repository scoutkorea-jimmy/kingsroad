(function(){
const TiptapEditor = ({ preset = "simple", content = "", onUpdate, onReady, placeholder = "\uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC138\uC694..." }) => {
  const host = React.useRef(null);
  const editorRef = React.useRef(null);
  const [ready, setReady] = React.useState(Boolean(window.BGNJ_TIPTAP));
  const [, forceRender] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    if (ready) return;
    const h = () => setReady(true);
    window.addEventListener("wsd-tiptap-ready", h);
    return () => window.removeEventListener("wsd-tiptap-ready", h);
  }, [ready]);
  React.useEffect(() => {
    if (!ready || !host.current) return;
    const T = window.BGNJ_TIPTAP;
    const { Editor, StarterKit, Placeholder, Image, Typography } = T;
    const extensions = [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } },
        dropcursor: { color: "var(--primary)", width: 2 }
        // codeBlock / underline 등 기타 기본값 (true) 사용.
      }),
      Placeholder.configure({ placeholder }),
      Typography
    ];
    if (T.Highlight) extensions.push(T.Highlight.configure({ multicolor: true }));
    if (T.TextAlign) extensions.push(T.TextAlign.configure({ types: ["heading", "paragraph"] }));
    if (T.Subscript) extensions.push(T.Subscript);
    if (T.Superscript) extensions.push(T.Superscript);
    if (T.TaskList && T.TaskItem) {
      extensions.push(T.TaskList);
      extensions.push(T.TaskItem.configure({ nested: true }));
    }
    if (T.TextStyle) extensions.push(T.TextStyle);
    if (T.Color && T.TextStyle) extensions.push(T.Color);
    if (T.Table && T.TableRow && T.TableCell && T.TableHeader) {
      extensions.push(T.Table.configure({ resizable: true }));
      extensions.push(T.TableRow);
      extensions.push(T.TableHeader);
      extensions.push(T.TableCell);
    }
    if (T.Youtube) extensions.push(T.Youtube.configure({ inline: false, controls: true, allowFullscreen: true }));
    if (preset === "column" || preset === "rich") {
      extensions.push(
        Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: "tiptap-img" } })
      );
    }
    const editor = new Editor({
      element: host.current,
      extensions,
      content,
      editorProps: {
        attributes: {
          class: "tiptap-editor",
          "aria-label": "\uBCF8\uBB38 \uC5D0\uB514\uD130 \u2014 \uB9C8\uD06C\uB2E4\uC6B4 \uB2E8\uCD95\uD0A4 \uC9C0\uC6D0"
        },
        // v00.135 — plain text 붙여넣기 시 줄바꿈 보존. 사용자 보고 '외부 글을 갈무리해서 올 때 줄바꿈이 적용 안 됨'.
        // ProseMirror 기본은 plain text 의 단일 \n 을 무시하고 공백으로 처리. 단일 \n → <br/>,
        // 빈 줄(\n\n) → 새 단락 으로 정상 변환. text/html 페이로드가 있으면 default 처리(예: HTML 보존).
        handlePaste: (view, event) => {
          const cd = event.clipboardData;
          if (!cd) return false;
          const html = cd.getData("text/html");
          if (html) return false;
          const text = cd.getData("text/plain");
          if (!text || !/\n/.test(text)) return false;
          event.preventDefault();
          const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
          const out = text.split(/\n{2,}/).map((para) => "<p>" + esc(para).split("\n").join("<br/>") + "</p>").join("");
          editor.commands.insertContent(out);
          return true;
        }
      },
      onUpdate: ({ editor: editor2 }) => {
        onUpdate == null ? void 0 : onUpdate(editor2.getHTML(), editor2.getJSON(), editor2.getText());
        forceRender();
      },
      onSelectionUpdate: () => forceRender()
    });
    editorRef.current = editor;
    onReady == null ? void 0 : onReady(editor);
    return () => {
      try {
        editor.destroy();
      } catch (e) {
      }
    };
  }, [ready, preset]);
  if (!ready) {
    return /* @__PURE__ */ React.createElement("div", { className: "tiptap-host", style: { minHeight: 320, display: "grid", placeItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "mono dim-2", style: { fontSize: 11, letterSpacing: "0.2em" } }, "\uC5D0\uB514\uD130 \uB85C\uB529 \uC911\u2026"));
  }
  const ed = editorRef.current;
  const can = (fn) => ed && fn(ed);
  const isActive = (name, attrs) => {
    var _a;
    return ((_a = ed == null ? void 0 : ed.isActive) == null ? void 0 : _a.call(ed, name, attrs)) || false;
  };
  const insertInlineImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      var _a;
      const f = (_a = input.files) == null ? void 0 : _a[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => ed.chain().focus().setImage({ src: r.result, alt: f.name }).run();
      r.readAsDataURL(f);
    };
    input.click();
  };
  const addLink = () => {
    const prev = ed.getAttributes("link").href;
    const url = window.prompt("\uB9C1\uD06C URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      ed.chain().focus().unsetLink().run();
      return;
    }
    ed.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  const addYoutube = () => {
    const url = window.prompt("YouTube URL", "https://youtu.be/...");
    if (!url) return;
    try {
      ed.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
    } catch (e) {
    }
  };
  const insertTable = () => {
    try {
      ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    } catch (e) {
    }
  };
  const pickColor = () => {
    const color = window.prompt("\uD14D\uC2A4\uD2B8 \uC0C9\uC0C1 (hex \uB610\uB294 CSS \uBCC0\uC218)", "#92400E");
    if (!color) return;
    try {
      ed.chain().focus().setColor(color).run();
    } catch (e) {
    }
  };
  const Btn = ({ cmd, label, active, disabled, shortcut }) => /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: cmd,
      disabled,
      "aria-pressed": active || false,
      "aria-label": label + (shortcut ? ` (${shortcut})` : ""),
      title: shortcut ? `${label} \xB7 ${shortcut}` : label,
      className: `tt-btn ${active ? "on" : ""}`
    },
    label
  );
  return /* @__PURE__ */ React.createElement("div", { className: `tiptap-wrap tiptap-${preset}` }, /* @__PURE__ */ React.createElement("div", { className: "tiptap-toolbar", role: "toolbar", "aria-label": "\uC11C\uC2DD \uB3C4\uAD6C" }, /* @__PURE__ */ React.createElement("div", { className: "tt-group" }, /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "H1",
      shortcut: "\u2318\u23251",
      active: isActive("heading", { level: 1 }),
      cmd: () => can((e) => e.chain().focus().toggleHeading({ level: 1 }).run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "H2",
      shortcut: "\u2318\u23252",
      active: isActive("heading", { level: 2 }),
      cmd: () => can((e) => e.chain().focus().toggleHeading({ level: 2 }).run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "H3",
      shortcut: "\u2318\u23253",
      active: isActive("heading", { level: 3 }),
      cmd: () => can((e) => e.chain().focus().toggleHeading({ level: 3 }).run())
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "tt-divider", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "tt-group" }, /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "B",
      shortcut: "\u2318B",
      active: isActive("bold"),
      cmd: () => can((e) => e.chain().focus().toggleBold().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "I",
      shortcut: "\u2318I",
      active: isActive("italic"),
      cmd: () => can((e) => e.chain().focus().toggleItalic().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "U",
      shortcut: "\u2318U",
      active: isActive("underline"),
      cmd: () => can((e) => e.chain().focus().toggleUnderline().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "S",
      shortcut: "\u2318\u21E7X",
      active: isActive("strike"),
      cmd: () => can((e) => e.chain().focus().toggleStrike().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u270F",
      shortcut: "\uD615\uAD11\uD39C",
      active: isActive("highlight"),
      cmd: () => can((e) => e.chain().focus().toggleHighlight().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "</>",
      shortcut: "\u2318E",
      active: isActive("code"),
      cmd: () => can((e) => e.chain().focus().toggleCode().run())
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "tt-divider", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "tt-group" }, /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "X\xB2",
      active: isActive("superscript"),
      cmd: () => can((e) => e.chain().focus().toggleSuperscript().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "X\u2082",
      active: isActive("subscript"),
      cmd: () => can((e) => e.chain().focus().toggleSubscript().run())
    }
  ), /* @__PURE__ */ React.createElement(Btn, { label: "\u{1F3A8}", shortcut: "\uD14D\uC2A4\uD2B8 \uC0C9\uC0C1", cmd: pickColor })), /* @__PURE__ */ React.createElement("div", { className: "tt-divider", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "tt-group" }, /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u2022",
      active: isActive("bulletList"),
      cmd: () => can((e) => e.chain().focus().toggleBulletList().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "1.",
      active: isActive("orderedList"),
      cmd: () => can((e) => e.chain().focus().toggleOrderedList().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u2610",
      active: isActive("taskList"),
      cmd: () => can((e) => e.chain().focus().toggleTaskList().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u275D",
      active: isActive("blockquote"),
      cmd: () => can((e) => e.chain().focus().toggleBlockquote().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "{ }",
      active: isActive("codeBlock"),
      cmd: () => can((e) => e.chain().focus().toggleCodeBlock().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u2014",
      cmd: () => can((e) => e.chain().focus().setHorizontalRule().run())
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "tt-divider", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "tt-group" }, /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u21E4",
      shortcut: "\uC67C\uCABD \uC815\uB82C",
      active: isActive({ textAlign: "left" }),
      cmd: () => can((e) => e.chain().focus().setTextAlign("left").run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u21D4",
      shortcut: "\uAC00\uC6B4\uB370 \uC815\uB82C",
      active: isActive({ textAlign: "center" }),
      cmd: () => can((e) => e.chain().focus().setTextAlign("center").run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u21E5",
      shortcut: "\uC624\uB978\uCABD \uC815\uB82C",
      active: isActive({ textAlign: "right" }),
      cmd: () => can((e) => e.chain().focus().setTextAlign("right").run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u2263",
      shortcut: "\uC591\uCABD \uC815\uB82C",
      active: isActive({ textAlign: "justify" }),
      cmd: () => can((e) => e.chain().focus().setTextAlign("justify").run())
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "tt-divider", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "tt-group" }, /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u{1F517}",
      active: isActive("link"),
      cmd: addLink
    }
  ), /* @__PURE__ */ React.createElement(Btn, { label: "\u{1F4FA} YT", shortcut: "YouTube", cmd: addYoutube }), /* @__PURE__ */ React.createElement(Btn, { label: "\u229E \uD45C", cmd: insertTable }), (preset === "column" || preset === "rich") && /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u{1F5BC} \uBCF8\uBB38 \uC774\uBBF8\uC9C0",
      cmd: insertInlineImage
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "tt-divider", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "tt-group" }, /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u21B6",
      shortcut: "\u2318Z",
      disabled: !(ed == null ? void 0 : ed.can().undo()),
      cmd: () => can((e) => e.chain().focus().undo().run())
    }
  ), /* @__PURE__ */ React.createElement(
    Btn,
    {
      label: "\u21B7",
      shortcut: "\u2318\u21E7Z",
      disabled: !(ed == null ? void 0 : ed.can().redo()),
      cmd: () => can((e) => e.chain().focus().redo().run())
    }
  ))), /* @__PURE__ */ React.createElement("div", { ref: host, className: "tiptap-host" }), preset === "column" && /* @__PURE__ */ React.createElement("p", { className: "dim-2 mono", style: { fontSize: 10, marginTop: 6, letterSpacing: "0.1em" } }, "\uBCF8\uBB38 \uC774\uBBF8\uC9C0\uB294 \uB4DC\uB798\uADF8\uB85C \uC790\uC720\uB86D\uAC8C \uC774\uB3D9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC774\uBBF8\uC9C0\uB97C \uB04C\uC5B4 \uC6D0\uD558\uB294 \uC704\uCE58\uB85C \uB193\uC73C\uC138\uC694."));
};
Object.assign(window, { TiptapEditor });
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29tcG9uZW50cy9UaXB0YXBFZGl0b3IuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVBQ0Y1XHVDNkE5IFRpcHRhcCBcdUM1RDBcdUI1MTRcdUQxMzBcbi8vIFx1QjQ1MCBcdUQ1MDRcdUI5QUNcdUMxNEI6XG4vLyAgIC0gXCJzaW1wbGVcIiAgOiBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVBRTAwXHVDNEYwXHVBRTMwXHVDNkE5IChcdUJDRjhcdUJCMzggXHVDNzc0XHVCQkY4XHVDOUMwIFx1QkQ4OFx1QUMwMCwgXHVBRTMwXHVCQ0Y4IFx1RDNFQ1x1QjlGN1x1QjlDQylcbi8vICAgLSBcImNvbHVtblwiICA6IFx1Q0U3Q1x1QjdGQ1x1QzZBOSAoXHVCQ0Y4XHVCQjM4IFx1QjBCNCBcdUM3NzRcdUJCRjhcdUM5QzAgKyBcdUI0RENcdUI3OThcdUFERjggXHVDNzA0XHVDRTU4IFx1Qzc3NFx1QjNEOSlcbi8vXG4vLyBcdUMwQUNcdUM2QTk6IDxUaXB0YXBFZGl0b3IgcHJlc2V0PVwic2ltcGxlXCIgY29udGVudD1cIi4uLlwiIG9uVXBkYXRlPXsoaHRtbCwganNvbiwgdGV4dCkgPT4gLi4ufSAvPlxuXG5jb25zdCBUaXB0YXBFZGl0b3IgPSAoeyBwcmVzZXQgPSBcInNpbXBsZVwiLCBjb250ZW50ID0gXCJcIiwgb25VcGRhdGUsIG9uUmVhZHksIHBsYWNlaG9sZGVyID0gXCJcdUIwQjRcdUM2QTlcdUM3NDQgXHVDNzg1XHVCODI1XHVENTU4XHVDMTM4XHVDNjk0Li4uXCIgfSkgPT4ge1xuICBjb25zdCBob3N0ID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICBjb25zdCBlZGl0b3JSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gIGNvbnN0IFtyZWFkeSwgc2V0UmVhZHldID0gUmVhY3QudXNlU3RhdGUoQm9vbGVhbih3aW5kb3cuQkdOSl9USVBUQVApKTtcbiAgY29uc3QgWywgZm9yY2VSZW5kZXJdID0gUmVhY3QudXNlUmVkdWNlcih4ID0+IHggKyAxLCAwKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChyZWFkeSkgcmV0dXJuO1xuICAgIGNvbnN0IGggPSAoKSA9PiBzZXRSZWFkeSh0cnVlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignd3NkLXRpcHRhcC1yZWFkeScsIGgpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignd3NkLXRpcHRhcC1yZWFkeScsIGgpO1xuICB9LCBbcmVhZHldKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghcmVhZHkgfHwgIWhvc3QuY3VycmVudCkgcmV0dXJuO1xuICAgIGNvbnN0IFQgPSB3aW5kb3cuQkdOSl9USVBUQVA7XG4gICAgY29uc3QgeyBFZGl0b3IsIFN0YXJ0ZXJLaXQsIFBsYWNlaG9sZGVyLCBJbWFnZSwgVHlwb2dyYXBoeSB9ID0gVDtcblxuICAgIC8vIHYwMC4wOTAgXHUyMDE0IFRpcHRhcCAzOiBTdGFydGVyS2l0IFx1Qzc3NCB1bmRlcmxpbmUgLyBsaW5rIC8gZHJvcGN1cnNvciBcdUI5N0MgXHVBRTMwXHVCQ0Y4IFx1RDNFQ1x1RDU2OC5cbiAgICAvLyBcdUM3NzRcdUM4MDQgc3RhbmRhbG9uZSBVbmRlcmxpbmUgLyBMaW5rIC8gRHJvcGN1cnNvciBcdUIyOTQgXHVDODFDXHVBQzcwICsgXHVDNjM1XHVDMTU4XHVDNzQ0IFN0YXJ0ZXJLaXQuY29uZmlndXJlIFx1Qjg1QyBcdUM3NzRcdUM4MDQuXG4gICAgY29uc3QgZXh0ZW5zaW9ucyA9IFtcbiAgICAgIFN0YXJ0ZXJLaXQuY29uZmlndXJlKHtcbiAgICAgICAgaGVhZGluZzogeyBsZXZlbHM6IFsxLCAyLCAzXSB9LFxuICAgICAgICBsaW5rOiB7IG9wZW5PbkNsaWNrOiBmYWxzZSwgSFRNTEF0dHJpYnV0ZXM6IHsgcmVsOiAnbm9vcGVuZXIgbm9yZWZlcnJlcicgfSB9LFxuICAgICAgICBkcm9wY3Vyc29yOiB7IGNvbG9yOiAndmFyKC0tcHJpbWFyeSknLCB3aWR0aDogMiB9LFxuICAgICAgICAvLyBjb2RlQmxvY2sgLyB1bmRlcmxpbmUgXHVCNEYxIFx1QUUzMFx1RDBDMCBcdUFFMzBcdUJDRjhcdUFDMTIgKHRydWUpIFx1QzBBQ1x1QzZBOS5cbiAgICAgIH0pLFxuICAgICAgUGxhY2Vob2xkZXIuY29uZmlndXJlKHsgcGxhY2Vob2xkZXIgfSksXG4gICAgICBUeXBvZ3JhcGh5LFxuICAgIF07XG4gICAgLy8gdjAwLjA2ODogXHVCQjM0XHVCOENDIGV4dGVuc2lvbiBcdUQ0OERcdUJEODBcdUQ2NTQgXHUyMDE0IFx1QkFBOFx1QjRFMCBwcmVzZXQgXHVDNUQwXHVDMTFDIFx1QzBBQ1x1QzZBOSBcdUFDMDBcdUIyQTUuICh2MyBcdUQ2MzhcdUQ2NTgpXG4gICAgaWYgKFQuSGlnaGxpZ2h0KSAgIGV4dGVuc2lvbnMucHVzaChULkhpZ2hsaWdodC5jb25maWd1cmUoeyBtdWx0aWNvbG9yOiB0cnVlIH0pKTtcbiAgICBpZiAoVC5UZXh0QWxpZ24pICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGV4dEFsaWduLmNvbmZpZ3VyZSh7IHR5cGVzOiBbJ2hlYWRpbmcnLCAncGFyYWdyYXBoJ10gfSkpO1xuICAgIGlmIChULlN1YnNjcmlwdCkgICBleHRlbnNpb25zLnB1c2goVC5TdWJzY3JpcHQpO1xuICAgIGlmIChULlN1cGVyc2NyaXB0KSBleHRlbnNpb25zLnB1c2goVC5TdXBlcnNjcmlwdCk7XG4gICAgaWYgKFQuVGFza0xpc3QgJiYgVC5UYXNrSXRlbSkge1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFza0xpc3QpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFza0l0ZW0uY29uZmlndXJlKHsgbmVzdGVkOiB0cnVlIH0pKTtcbiAgICB9XG4gICAgaWYgKFQuVGV4dFN0eWxlKSBleHRlbnNpb25zLnB1c2goVC5UZXh0U3R5bGUpO1xuICAgIGlmIChULkNvbG9yICYmIFQuVGV4dFN0eWxlKSBleHRlbnNpb25zLnB1c2goVC5Db2xvcik7XG4gICAgaWYgKFQuVGFibGUgJiYgVC5UYWJsZVJvdyAmJiBULlRhYmxlQ2VsbCAmJiBULlRhYmxlSGVhZGVyKSB7XG4gICAgICBleHRlbnNpb25zLnB1c2goVC5UYWJsZS5jb25maWd1cmUoeyByZXNpemFibGU6IHRydWUgfSkpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFibGVSb3cpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFibGVIZWFkZXIpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFibGVDZWxsKTtcbiAgICB9XG4gICAgaWYgKFQuWW91dHViZSkgZXh0ZW5zaW9ucy5wdXNoKFQuWW91dHViZS5jb25maWd1cmUoeyBpbmxpbmU6IGZhbHNlLCBjb250cm9sczogdHJ1ZSwgYWxsb3dGdWxsc2NyZWVuOiB0cnVlIH0pKTtcbiAgICAvLyBcdUJDRjhcdUJCMzggXHVDNzc4XHVCNzdDXHVDNzc4IFx1Qzc3NFx1QkJGOFx1QzlDMCBcdTIwMTQgY29sdW1uIC8gcmljaCBwcmVzZXQgXHVDNUQwXHVDMTFDIFx1RDY1Q1x1QzEzMS4gc2ltcGxlIFx1Qzc0MCBcdUNDQThcdUJEODAgXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDXHVCOUNDIFx1QzBBQ1x1QzZBOS5cbiAgICAvLyAodjMpIERyb3BjdXJzb3IgXHVCMjk0IFN0YXJ0ZXJLaXQgXHVDNUQwIFx1RDNFQ1x1RDU2OFx1QjQxOFx1QzVCNCBcdUM3OTBcdUIzRDkgXHVENjVDXHVDMTMxLiBJbWFnZSBcdUI5Q0Mgc3RhbmRhbG9uZS5cbiAgICBpZiAocHJlc2V0ID09PSBcImNvbHVtblwiIHx8IHByZXNldCA9PT0gXCJyaWNoXCIpIHtcbiAgICAgIGV4dGVuc2lvbnMucHVzaChcbiAgICAgICAgSW1hZ2UuY29uZmlndXJlKHsgaW5saW5lOiBmYWxzZSwgYWxsb3dCYXNlNjQ6IHRydWUsIEhUTUxBdHRyaWJ1dGVzOiB7IGNsYXNzOiAndGlwdGFwLWltZycgfSB9KSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdG9yID0gbmV3IEVkaXRvcih7XG4gICAgICBlbGVtZW50OiBob3N0LmN1cnJlbnQsXG4gICAgICBleHRlbnNpb25zLFxuICAgICAgY29udGVudCxcbiAgICAgIGVkaXRvclByb3BzOiB7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3RpcHRhcC1lZGl0b3InLFxuICAgICAgICAgICdhcmlhLWxhYmVsJzogJ1x1QkNGOFx1QkIzOCBcdUM1RDBcdUI1MTRcdUQxMzAgXHUyMDE0IFx1QjlDOFx1RDA2Q1x1QjJFNFx1QzZCNCBcdUIyRThcdUNEOTVcdUQwQTQgXHVDOUMwXHVDNkQwJyxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdjAwLjEzNSBcdTIwMTQgcGxhaW4gdGV4dCBcdUJEOTlcdUM1RUNcdUIxMjNcdUFFMzAgXHVDMkRDIFx1QzkwNFx1QkMxNFx1QUZDOCBcdUJDRjRcdUM4NzQuIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUJDRjRcdUFDRTAgJ1x1QzY3OFx1QkQ4MCBcdUFFMDBcdUM3NDQgXHVBQzA4XHVCQjM0XHVCOUFDXHVENTc0XHVDMTFDIFx1QzYyQyBcdUI1NEMgXHVDOTA0XHVCQzE0XHVBRkM4XHVDNzc0IFx1QzgwMVx1QzZBOSBcdUM1NDggXHVCNDI4Jy5cbiAgICAgICAgLy8gUHJvc2VNaXJyb3IgXHVBRTMwXHVCQ0Y4XHVDNzQwIHBsYWluIHRleHQgXHVDNzU4IFx1QjJFOFx1Qzc3QyBcXG4gXHVDNzQ0IFx1QkIzNFx1QzJEQ1x1RDU1OFx1QUNFMCBcdUFDRjVcdUJDMzFcdUM3M0NcdUI4NUMgXHVDQzk4XHVCOUFDLiBcdUIyRThcdUM3N0MgXFxuIFx1MjE5MiA8YnIvPixcbiAgICAgICAgLy8gXHVCRTQ4IFx1QzkwNChcXG5cXG4pIFx1MjE5MiBcdUMwQzggXHVCMkU4XHVCNzdEIFx1QzczQ1x1Qjg1QyBcdUM4MTVcdUMwQzEgXHVCQ0MwXHVENjU4LiB0ZXh0L2h0bWwgXHVEMzk4XHVDNzc0XHVCODVDXHVCNERDXHVBQzAwIFx1Qzc4OFx1QzczQ1x1QkE3NCBkZWZhdWx0IFx1Q0M5OFx1QjlBQyhcdUM2MDg6IEhUTUwgXHVCQ0Y0XHVDODc0KS5cbiAgICAgICAgaGFuZGxlUGFzdGU6ICh2aWV3LCBldmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNkID0gZXZlbnQuY2xpcGJvYXJkRGF0YTtcbiAgICAgICAgICBpZiAoIWNkKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgY29uc3QgaHRtbCA9IGNkLmdldERhdGEoJ3RleHQvaHRtbCcpO1xuICAgICAgICAgIGlmIChodG1sKSByZXR1cm4gZmFsc2U7IC8vIEhUTUwgXHVDNzc0IFx1Qzc4OFx1QzczQ1x1QkE3NCBkZWZhdWx0IFx1Q0M5OFx1QjlBQy5cbiAgICAgICAgICBjb25zdCB0ZXh0ID0gY2QuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgICAgICAgIGlmICghdGV4dCB8fCAhL1xcbi8udGVzdCh0ZXh0KSkgcmV0dXJuIGZhbHNlOyAvLyBcdUM5MDRcdUJDMTRcdUFGQzggXHVDNUM2XHVDNzNDXHVCQTc0IGRlZmF1bHQuXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBjb25zdCBlc2MgPSAocykgPT4gcy5yZXBsYWNlKC9bJjw+XS9nLCAoYykgPT4gKHsgJyYnOiAnJmFtcDsnLCAnPCc6ICcmbHQ7JywgJz4nOiAnJmd0OycgfVtjXSkpO1xuICAgICAgICAgIGNvbnN0IG91dCA9IHRleHRcbiAgICAgICAgICAgIC5zcGxpdCgvXFxuezIsfS8pXG4gICAgICAgICAgICAubWFwKChwYXJhKSA9PiAnPHA+JyArIGVzYyhwYXJhKS5zcGxpdCgnXFxuJykuam9pbignPGJyLz4nKSArICc8L3A+JylcbiAgICAgICAgICAgIC5qb2luKCcnKTtcbiAgICAgICAgICBlZGl0b3IuY29tbWFuZHMuaW5zZXJ0Q29udGVudChvdXQpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG9uVXBkYXRlOiAoeyBlZGl0b3IgfSkgPT4ge1xuICAgICAgICBvblVwZGF0ZT8uKGVkaXRvci5nZXRIVE1MKCksIGVkaXRvci5nZXRKU09OKCksIGVkaXRvci5nZXRUZXh0KCkpO1xuICAgICAgICBmb3JjZVJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIG9uU2VsZWN0aW9uVXBkYXRlOiAoKSA9PiBmb3JjZVJlbmRlcigpLFxuICAgIH0pO1xuICAgIGVkaXRvclJlZi5jdXJyZW50ID0gZWRpdG9yO1xuICAgIG9uUmVhZHk/LihlZGl0b3IpO1xuICAgIHJldHVybiAoKSA9PiB7IHRyeSB7IGVkaXRvci5kZXN0cm95KCk7IH0gY2F0Y2ggKGUpIHt9IH07XG4gIH0sIFtyZWFkeSwgcHJlc2V0XSk7XG5cbiAgaWYgKCFyZWFkeSkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpcHRhcC1ob3N0XCIgc3R5bGU9e3ttaW5IZWlnaHQ6MzIwLCBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJ319PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgbGV0dGVyU3BhY2luZzonMC4yZW0nfX0+XHVDNUQwXHVCNTE0XHVEMTMwIFx1Qjg1Q1x1QjUyOSBcdUM5MTFcdTIwMjY8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgZWQgPSBlZGl0b3JSZWYuY3VycmVudDtcbiAgY29uc3QgY2FuID0gKGZuKSA9PiBlZCAmJiBmbihlZCk7XG4gIGNvbnN0IGlzQWN0aXZlID0gKG5hbWUsIGF0dHJzKSA9PiBlZD8uaXNBY3RpdmU/LihuYW1lLCBhdHRycykgfHwgZmFsc2U7XG5cbiAgLy8gXHVCQ0Y4XHVCQjM4IFx1QjBCNCBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDMEJEXHVDNzg1IChjb2x1bW4gcHJlc2V0IFx1QzgwNFx1QzZBOSBcdTIwMTQgXHVEMzBDXHVDNzdDIFx1QzEyMFx1RDBERCBcdUI2MTBcdUIyOTQgVVJMKVxuICBjb25zdCBpbnNlcnRJbmxpbmVJbWFnZSA9ICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgaW5wdXQudHlwZSA9ICdmaWxlJztcbiAgICBpbnB1dC5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgaW5wdXQub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBmID0gaW5wdXQuZmlsZXM/LlswXTtcbiAgICAgIGlmICghZikgcmV0dXJuO1xuICAgICAgY29uc3QgciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByLm9ubG9hZCA9ICgpID0+IGVkLmNoYWluKCkuZm9jdXMoKS5zZXRJbWFnZSh7IHNyYzogci5yZXN1bHQsIGFsdDogZi5uYW1lIH0pLnJ1bigpO1xuICAgICAgci5yZWFkQXNEYXRhVVJMKGYpO1xuICAgIH07XG4gICAgaW5wdXQuY2xpY2soKTtcbiAgfTtcblxuICBjb25zdCBhZGRMaW5rID0gKCkgPT4ge1xuICAgIGNvbnN0IHByZXYgPSBlZC5nZXRBdHRyaWJ1dGVzKCdsaW5rJykuaHJlZjtcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cucHJvbXB0KCdcdUI5QzFcdUQwNkMgVVJMJywgcHJldiB8fCAnaHR0cHM6Ly8nKTtcbiAgICBpZiAodXJsID09PSBudWxsKSByZXR1cm47XG4gICAgaWYgKHVybCA9PT0gJycpIHsgZWQuY2hhaW4oKS5mb2N1cygpLnVuc2V0TGluaygpLnJ1bigpOyByZXR1cm47IH1cbiAgICBlZC5jaGFpbigpLmZvY3VzKCkuZXh0ZW5kTWFya1JhbmdlKCdsaW5rJykuc2V0TGluayh7IGhyZWY6IHVybCB9KS5ydW4oKTtcbiAgfTtcblxuICAvLyB2MDAuMDY4IFx1MjAxNCBZb3V0dWJlIFx1Qzc4NFx1QkNBMFx1QjREQy5cbiAgY29uc3QgYWRkWW91dHViZSA9ICgpID0+IHtcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cucHJvbXB0KCdZb3VUdWJlIFVSTCcsICdodHRwczovL3lvdXR1LmJlLy4uLicpO1xuICAgIGlmICghdXJsKSByZXR1cm47XG4gICAgdHJ5IHsgZWQuY2hhaW4oKS5mb2N1cygpLnNldFlvdXR1YmVWaWRlbyh7IHNyYzogdXJsLCB3aWR0aDogNjQwLCBoZWlnaHQ6IDM2MCB9KS5ydW4oKTsgfSBjYXRjaCB7fVxuICB9O1xuICAvLyBcdUQ0NUMgXHVDMEJEXHVDNzg1LlxuICBjb25zdCBpbnNlcnRUYWJsZSA9ICgpID0+IHtcbiAgICB0cnkgeyBlZC5jaGFpbigpLmZvY3VzKCkuaW5zZXJ0VGFibGUoeyByb3dzOiAzLCBjb2xzOiAzLCB3aXRoSGVhZGVyUm93OiB0cnVlIH0pLnJ1bigpOyB9IGNhdGNoIHt9XG4gIH07XG4gIC8vIFx1RDE0RFx1QzJBNFx1RDJCOCBcdUMwQzlcdUMwQzEuXG4gIGNvbnN0IHBpY2tDb2xvciA9ICgpID0+IHtcbiAgICBjb25zdCBjb2xvciA9IHdpbmRvdy5wcm9tcHQoJ1x1RDE0RFx1QzJBNFx1RDJCOCBcdUMwQzlcdUMwQzEgKGhleCBcdUI2MTBcdUIyOTQgQ1NTIFx1QkNDMFx1QzIxOCknLCAnIzkyNDAwRScpO1xuICAgIGlmICghY29sb3IpIHJldHVybjtcbiAgICB0cnkgeyBlZC5jaGFpbigpLmZvY3VzKCkuc2V0Q29sb3IoY29sb3IpLnJ1bigpOyB9IGNhdGNoIHt9XG4gIH07XG5cbiAgY29uc3QgQnRuID0gKHsgY21kLCBsYWJlbCwgYWN0aXZlLCBkaXNhYmxlZCwgc2hvcnRjdXQgfSkgPT4gKFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgb25DbGljaz17Y21kfVxuICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgYXJpYS1wcmVzc2VkPXthY3RpdmUgfHwgZmFsc2V9XG4gICAgICBhcmlhLWxhYmVsPXtsYWJlbCArIChzaG9ydGN1dCA/IGAgKCR7c2hvcnRjdXR9KWAgOiAnJyl9XG4gICAgICB0aXRsZT17c2hvcnRjdXQgPyBgJHtsYWJlbH0gXHUwMEI3ICR7c2hvcnRjdXR9YCA6IGxhYmVsfVxuICAgICAgY2xhc3NOYW1lPXtgdHQtYnRuICR7YWN0aXZlID8gJ29uJyA6ICcnfWB9PlxuICAgICAge2xhYmVsfVxuICAgIDwvYnV0dG9uPlxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2B0aXB0YXAtd3JhcCB0aXB0YXAtJHtwcmVzZXR9YH0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpcHRhcC10b29sYmFyXCIgcm9sZT1cInRvb2xiYXJcIiBhcmlhLWxhYmVsPVwiXHVDMTFDXHVDMkREIFx1QjNDNFx1QUQ2Q1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWdyb3VwXCI+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIkgxXCIgc2hvcnRjdXQ9XCJcdTIzMThcdTIzMjUxXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2hlYWRpbmcnLCB7IGxldmVsOiAxIH0pfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVIZWFkaW5nKHsgbGV2ZWw6IDEgfSkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIkgyXCIgc2hvcnRjdXQ9XCJcdTIzMThcdTIzMjUyXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2hlYWRpbmcnLCB7IGxldmVsOiAyIH0pfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVIZWFkaW5nKHsgbGV2ZWw6IDIgfSkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIkgzXCIgc2hvcnRjdXQ9XCJcdTIzMThcdTIzMjUzXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2hlYWRpbmcnLCB7IGxldmVsOiAzIH0pfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVIZWFkaW5nKHsgbGV2ZWw6IDMgfSkucnVuKCkpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZ3JvdXBcIj5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiQlwiIHNob3J0Y3V0PVwiXHUyMzE4QlwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdib2xkJyl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnRvZ2dsZUJvbGQoKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiSVwiIHNob3J0Y3V0PVwiXHUyMzE4SVwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdpdGFsaWMnKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlSXRhbGljKCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlVcIiBzaG9ydGN1dD1cIlx1MjMxOFVcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgndW5kZXJsaW5lJyl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnRvZ2dsZVVuZGVybGluZSgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJTXCIgc2hvcnRjdXQ9XCJcdTIzMThcdTIxRTdYXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ3N0cmlrZScpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVTdHJpa2UoKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyNzBGXCIgc2hvcnRjdXQ9XCJcdUQ2MTVcdUFEMTFcdUQzOUNcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnaGlnaGxpZ2h0Jyl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnRvZ2dsZUhpZ2hsaWdodCgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCI8Lz5cIiBzaG9ydGN1dD1cIlx1MjMxOEVcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnY29kZScpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVDb2RlKCkucnVuKCkpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZ3JvdXBcIj5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiWFx1MDBCMlwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdzdXBlcnNjcmlwdCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVTdXBlcnNjcmlwdCgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJYXHUyMDgyXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ3N1YnNjcmlwdCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVTdWJzY3JpcHQoKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHVEODNDXHVERkE4XCIgc2hvcnRjdXQ9XCJcdUQxNERcdUMyQTRcdUQyQjggXHVDMEM5XHVDMEMxXCIgY21kPXtwaWNrQ29sb3J9Lz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZGl2aWRlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0dC1ncm91cFwiPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdTIwMjJcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnYnVsbGV0TGlzdCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVCdWxsZXRMaXN0KCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIjEuXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ29yZGVyZWRMaXN0Jyl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnRvZ2dsZU9yZGVyZWRMaXN0KCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjYxMFwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCd0YXNrTGlzdCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVUYXNrTGlzdCgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdTI3NURcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnYmxvY2txdW90ZScpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVCbG9ja3F1b3RlKCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cInsgfVwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdjb2RlQmxvY2snKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlQ29kZUJsb2NrKCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjAxNFwiXG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnNldEhvcml6b250YWxSdWxlKCkucnVuKCkpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZ3JvdXBcIj5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyMUU0XCIgc2hvcnRjdXQ9XCJcdUM2N0NcdUNBQkQgXHVDODE1XHVCODJDXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoeyB0ZXh0QWxpZ246ICdsZWZ0JyB9KX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkuc2V0VGV4dEFsaWduKCdsZWZ0JykucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjFENFwiIHNob3J0Y3V0PVwiXHVBQzAwXHVDNkI0XHVCMzcwIFx1QzgxNVx1QjgyQ1wiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKHsgdGV4dEFsaWduOiAnY2VudGVyJyB9KX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkuc2V0VGV4dEFsaWduKCdjZW50ZXInKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyMUU1XCIgc2hvcnRjdXQ9XCJcdUM2MjRcdUI5NzhcdUNBQkQgXHVDODE1XHVCODJDXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoeyB0ZXh0QWxpZ246ICdyaWdodCcgfSl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnNldFRleHRBbGlnbigncmlnaHQnKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyMjYzXCIgc2hvcnRjdXQ9XCJcdUM1OTFcdUNBQkQgXHVDODE1XHVCODJDXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoeyB0ZXh0QWxpZ246ICdqdXN0aWZ5JyB9KX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkuc2V0VGV4dEFsaWduKCdqdXN0aWZ5JykucnVuKCkpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZ3JvdXBcIj5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHVEODNEXHVERDE3XCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2xpbmsnKX1cbiAgICAgICAgICAgIGNtZD17YWRkTGlua30vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdUQ4M0RcdURDRkEgWVRcIiBzaG9ydGN1dD1cIllvdVR1YmVcIiBjbWQ9e2FkZFlvdXR1YmV9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyMjlFIFx1RDQ1Q1wiIGNtZD17aW5zZXJ0VGFibGV9Lz5cbiAgICAgICAgICB7KHByZXNldCA9PT0gXCJjb2x1bW5cIiB8fCBwcmVzZXQgPT09IFwicmljaFwiKSAmJiAoXG4gICAgICAgICAgICA8QnRuIGxhYmVsPVwiXHVEODNEXHVEREJDIFx1QkNGOFx1QkIzOCBcdUM3NzRcdUJCRjhcdUM5QzBcIlxuICAgICAgICAgICAgICBjbWQ9e2luc2VydElubGluZUltYWdlfS8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZGl2aWRlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0dC1ncm91cFwiPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdTIxQjZcIiBzaG9ydGN1dD1cIlx1MjMxOFpcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFlZD8uY2FuKCkudW5kbygpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS51bmRvKCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjFCN1wiIHNob3J0Y3V0PVwiXHUyMzE4XHUyMUU3WlwiXG4gICAgICAgICAgICBkaXNhYmxlZD17IWVkPy5jYW4oKS5yZWRvKCl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnJlZG8oKS5ydW4oKSl9Lz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgcmVmPXtob3N0fSBjbGFzc05hbWU9XCJ0aXB0YXAtaG9zdFwiLz5cbiAgICAgIHtwcmVzZXQgPT09IFwiY29sdW1uXCIgJiYgKFxuICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW0tMiBtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgbWFyZ2luVG9wOjYsIGxldHRlclNwYWNpbmc6JzAuMWVtJ319PlxuICAgICAgICAgIFx1QkNGOFx1QkIzOCBcdUM3NzRcdUJCRjhcdUM5QzBcdUIyOTQgXHVCNERDXHVCNzk4XHVBREY4XHVCODVDIFx1Qzc5MFx1QzcyMFx1Qjg2RFx1QUM4QyBcdUM3NzRcdUIzRDlcdUQ1NjAgXHVDMjE4IFx1Qzc4OFx1QzJCNVx1QjJDOFx1QjJFNC4gXHVDNzc0XHVCQkY4XHVDOUMwXHVCOTdDIFx1QjA0Q1x1QzVCNCBcdUM2RDBcdUQ1NThcdUIyOTQgXHVDNzA0XHVDRTU4XHVCODVDIFx1QjE5M1x1QzczQ1x1QzEzOFx1QzY5NC5cbiAgICAgICAgPC9wPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IFRpcHRhcEVkaXRvciB9KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQU9BLE1BQU0sZUFBZSxDQUFDLEVBQUUsU0FBUyxVQUFVLFVBQVUsSUFBSSxVQUFVLFNBQVMsY0FBYyx1REFBZSxNQUFNO0FBQzdHLFFBQU0sT0FBTyxNQUFNLE9BQU8sSUFBSTtBQUM5QixRQUFNLFlBQVksTUFBTSxPQUFPLElBQUk7QUFDbkMs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QztBQUFBO0FBQUEsRUFBRSxHQUNyRTtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQUksT0FBTTtBQUFBLE1BQUksVUFBUztBQUFBLE1BQ3RCLFFBQVEsU0FBUyxFQUFFLFdBQVcsVUFBVSxDQUFDO0FBQUEsTUFDekMsS0FBSyxNQUFNLElBQUksT0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYSxTQUFTLEVBQUUsSUFBSSxDQUFDO0FBQUE7QUFBQSxFQUFFLENBQ3pFLEdBQ0Esb0NBQUMsU0FBSSxXQUFVLGNBQWEsZUFBWSxRQUFNLEdBQzlDLG9DQUFDLFNBQUksV0FBVSxjQUNiO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFBSSxPQUFNO0FBQUEsTUFDVCxRQUFRLFNBQVMsTUFBTTtBQUFBLE1BQ3ZCLEtBQUs7QUFBQTtBQUFBLEVBQVEsR0FDZixvQ0FBQyxPQUFJLE9BQU0sZ0JBQVEsVUFBUyxXQUFVLEtBQUssWUFBVyxHQUN0RCxvQ0FBQyxPQUFJLE9BQU0saUJBQU0sS0FBSyxhQUFZLElBQ2hDLFdBQVcsWUFBWSxXQUFXLFdBQ2xDO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFBSSxPQUFNO0FBQUEsTUFDVCxLQUFLO0FBQUE7QUFBQSxFQUFrQixDQUU3QixHQUNBLG9DQUFDLFNBQUksV0FBVSxjQUFhLGVBQVksUUFBTSxHQUM5QyxvQ0FBQyxTQUFJLFdBQVUsY0FDYjtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQUksT0FBTTtBQUFBLE1BQUksVUFBUztBQUFBLE1BQ3RCLFVBQVUsRUFBQyx5QkFBSSxNQUFNO0FBQUEsTUFDckIsS0FBSyxNQUFNLElBQUksT0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQztBQUFBO0FBQUEsRUFBRSxHQUN0RDtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQUksT0FBTTtBQUFBLE1BQUksVUFBUztBQUFBLE1BQ3RCLFVBQVUsRUFBQyx5QkFBSSxNQUFNO0FBQUEsTUFDckIsS0FBSyxNQUFNLElBQUksT0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQztBQUFBO0FBQUEsRUFBRSxDQUN4RCxDQUNGLEdBQ0Esb0NBQUMsU0FBSSxLQUFLLE1BQU0sV0FBVSxlQUFhLEdBQ3RDLFdBQVcsWUFDVixvQ0FBQyxPQUFFLFdBQVUsY0FBYSxPQUFPLEVBQUMsVUFBUyxJQUFJLFdBQVUsR0FBRyxlQUFjLFFBQU8sS0FBRyxtUEFFcEYsQ0FFSjtBQUVKO0FBRUEsT0FBTyxPQUFPLFFBQVEsRUFBRSxhQUFhLENBQUM7IiwKICAibmFtZXMiOiBbImVkaXRvciJdCn0K

})();

(function(){
const TiptapEditor = ({ preset = "simple", content = "", onUpdate, onReady, placeholder = "\uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC138\uC694..." }) => {
  const host = React.useRef(null);
  const editorRef = React.useRef(null);
  const [ready, setReady] = React.useState(Boolean(window.BGNJ_TIPTAP));
  const [, forceRender] = React.useReducer((x) => x + 1, 0);
  const [uploadingImage, setUploadingImage] = React.useState(false);
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
    input.onchange = async () => {
      var _a;
      const f = (_a = input.files) == null ? void 0 : _a[0];
      if (!f) return;
      const folder = preset === "column" ? "column-images" : "post-images";
      try {
        setUploadingImage(true);
        const { url } = await window.BGNJ_MEDIA.uploadFile(f, { folder, maxBytes: 10 * 1024 * 1024 });
        ed.chain().focus().setImage({ src: url, alt: f.name }).run();
      } catch (err) {
        try {
          window.alert("\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || err));
        } catch (e) {
        }
      } finally {
        setUploadingImage(false);
      }
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
      label: uploadingImage ? "\u23F3 \uC5C5\uB85C\uB4DC \uC911\u2026" : "\u{1F5BC} \uBCF8\uBB38 \uC774\uBBF8\uC9C0",
      disabled: uploadingImage,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29tcG9uZW50cy9UaXB0YXBFZGl0b3IuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVBQ0Y1XHVDNkE5IFRpcHRhcCBcdUM1RDBcdUI1MTRcdUQxMzBcbi8vIFx1QjQ1MCBcdUQ1MDRcdUI5QUNcdUMxNEI6XG4vLyAgIC0gXCJzaW1wbGVcIiAgOiBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVBRTAwXHVDNEYwXHVBRTMwXHVDNkE5IChcdUJDRjhcdUJCMzggXHVDNzc0XHVCQkY4XHVDOUMwIFx1QkQ4OFx1QUMwMCwgXHVBRTMwXHVCQ0Y4IFx1RDNFQ1x1QjlGN1x1QjlDQylcbi8vICAgLSBcImNvbHVtblwiICA6IFx1Q0U3Q1x1QjdGQ1x1QzZBOSAoXHVCQ0Y4XHVCQjM4IFx1QjBCNCBcdUM3NzRcdUJCRjhcdUM5QzAgKyBcdUI0RENcdUI3OThcdUFERjggXHVDNzA0XHVDRTU4IFx1Qzc3NFx1QjNEOSlcbi8vXG4vLyBcdUMwQUNcdUM2QTk6IDxUaXB0YXBFZGl0b3IgcHJlc2V0PVwic2ltcGxlXCIgY29udGVudD1cIi4uLlwiIG9uVXBkYXRlPXsoaHRtbCwganNvbiwgdGV4dCkgPT4gLi4ufSAvPlxuXG5jb25zdCBUaXB0YXBFZGl0b3IgPSAoeyBwcmVzZXQgPSBcInNpbXBsZVwiLCBjb250ZW50ID0gXCJcIiwgb25VcGRhdGUsIG9uUmVhZHksIHBsYWNlaG9sZGVyID0gXCJcdUIwQjRcdUM2QTlcdUM3NDQgXHVDNzg1XHVCODI1XHVENTU4XHVDMTM4XHVDNjk0Li4uXCIgfSkgPT4ge1xuICBjb25zdCBob3N0ID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICBjb25zdCBlZGl0b3JSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gIGNvbnN0IFtyZWFkeSwgc2V0UmVhZHldID0gUmVhY3QudXNlU3RhdGUoQm9vbGVhbih3aW5kb3cuQkdOSl9USVBUQVApKTtcbiAgY29uc3QgWywgZm9yY2VSZW5kZXJdID0gUmVhY3QudXNlUmVkdWNlcih4ID0+IHggKyAxLCAwKTtcbiAgLy8gdjAwLjEzOCBcdTIwMTQgXHVCQ0Y4XHVCQjM4IFx1Qzc3NFx1QkJGOFx1QzlDMCBSMiBcdUM1QzVcdUI4NUNcdUI0REMgXHVDMEMxXHVEMERDLiBlYXJseSByZXR1cm4gXHVDNzc0XHVDODA0XHVDNUQwIFx1QzEyMFx1QzVCOCAoUnVsZXMgb2YgSG9va3MpLlxuICBjb25zdCBbdXBsb2FkaW5nSW1hZ2UsIHNldFVwbG9hZGluZ0ltYWdlXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChyZWFkeSkgcmV0dXJuO1xuICAgIGNvbnN0IGggPSAoKSA9PiBzZXRSZWFkeSh0cnVlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignd3NkLXRpcHRhcC1yZWFkeScsIGgpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignd3NkLXRpcHRhcC1yZWFkeScsIGgpO1xuICB9LCBbcmVhZHldKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghcmVhZHkgfHwgIWhvc3QuY3VycmVudCkgcmV0dXJuO1xuICAgIGNvbnN0IFQgPSB3aW5kb3cuQkdOSl9USVBUQVA7XG4gICAgY29uc3QgeyBFZGl0b3IsIFN0YXJ0ZXJLaXQsIFBsYWNlaG9sZGVyLCBJbWFnZSwgVHlwb2dyYXBoeSB9ID0gVDtcblxuICAgIC8vIHYwMC4wOTAgXHUyMDE0IFRpcHRhcCAzOiBTdGFydGVyS2l0IFx1Qzc3NCB1bmRlcmxpbmUgLyBsaW5rIC8gZHJvcGN1cnNvciBcdUI5N0MgXHVBRTMwXHVCQ0Y4IFx1RDNFQ1x1RDU2OC5cbiAgICAvLyBcdUM3NzRcdUM4MDQgc3RhbmRhbG9uZSBVbmRlcmxpbmUgLyBMaW5rIC8gRHJvcGN1cnNvciBcdUIyOTQgXHVDODFDXHVBQzcwICsgXHVDNjM1XHVDMTU4XHVDNzQ0IFN0YXJ0ZXJLaXQuY29uZmlndXJlIFx1Qjg1QyBcdUM3NzRcdUM4MDQuXG4gICAgY29uc3QgZXh0ZW5zaW9ucyA9IFtcbiAgICAgIFN0YXJ0ZXJLaXQuY29uZmlndXJlKHtcbiAgICAgICAgaGVhZGluZzogeyBsZXZlbHM6IFsxLCAyLCAzXSB9LFxuICAgICAgICBsaW5rOiB7IG9wZW5PbkNsaWNrOiBmYWxzZSwgSFRNTEF0dHJpYnV0ZXM6IHsgcmVsOiAnbm9vcGVuZXIgbm9yZWZlcnJlcicgfSB9LFxuICAgICAgICBkcm9wY3Vyc29yOiB7IGNvbG9yOiAndmFyKC0tcHJpbWFyeSknLCB3aWR0aDogMiB9LFxuICAgICAgICAvLyBjb2RlQmxvY2sgLyB1bmRlcmxpbmUgXHVCNEYxIFx1QUUzMFx1RDBDMCBcdUFFMzBcdUJDRjhcdUFDMTIgKHRydWUpIFx1QzBBQ1x1QzZBOS5cbiAgICAgIH0pLFxuICAgICAgUGxhY2Vob2xkZXIuY29uZmlndXJlKHsgcGxhY2Vob2xkZXIgfSksXG4gICAgICBUeXBvZ3JhcGh5LFxuICAgIF07XG4gICAgLy8gdjAwLjA2ODogXHVCQjM0XHVCOENDIGV4dGVuc2lvbiBcdUQ0OERcdUJEODBcdUQ2NTQgXHUyMDE0IFx1QkFBOFx1QjRFMCBwcmVzZXQgXHVDNUQwXHVDMTFDIFx1QzBBQ1x1QzZBOSBcdUFDMDBcdUIyQTUuICh2MyBcdUQ2MzhcdUQ2NTgpXG4gICAgaWYgKFQuSGlnaGxpZ2h0KSAgIGV4dGVuc2lvbnMucHVzaChULkhpZ2hsaWdodC5jb25maWd1cmUoeyBtdWx0aWNvbG9yOiB0cnVlIH0pKTtcbiAgICBpZiAoVC5UZXh0QWxpZ24pICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGV4dEFsaWduLmNvbmZpZ3VyZSh7IHR5cGVzOiBbJ2hlYWRpbmcnLCAncGFyYWdyYXBoJ10gfSkpO1xuICAgIGlmIChULlN1YnNjcmlwdCkgICBleHRlbnNpb25zLnB1c2goVC5TdWJzY3JpcHQpO1xuICAgIGlmIChULlN1cGVyc2NyaXB0KSBleHRlbnNpb25zLnB1c2goVC5TdXBlcnNjcmlwdCk7XG4gICAgaWYgKFQuVGFza0xpc3QgJiYgVC5UYXNrSXRlbSkge1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFza0xpc3QpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFza0l0ZW0uY29uZmlndXJlKHsgbmVzdGVkOiB0cnVlIH0pKTtcbiAgICB9XG4gICAgaWYgKFQuVGV4dFN0eWxlKSBleHRlbnNpb25zLnB1c2goVC5UZXh0U3R5bGUpO1xuICAgIGlmIChULkNvbG9yICYmIFQuVGV4dFN0eWxlKSBleHRlbnNpb25zLnB1c2goVC5Db2xvcik7XG4gICAgaWYgKFQuVGFibGUgJiYgVC5UYWJsZVJvdyAmJiBULlRhYmxlQ2VsbCAmJiBULlRhYmxlSGVhZGVyKSB7XG4gICAgICBleHRlbnNpb25zLnB1c2goVC5UYWJsZS5jb25maWd1cmUoeyByZXNpemFibGU6IHRydWUgfSkpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFibGVSb3cpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFibGVIZWFkZXIpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFibGVDZWxsKTtcbiAgICB9XG4gICAgaWYgKFQuWW91dHViZSkgZXh0ZW5zaW9ucy5wdXNoKFQuWW91dHViZS5jb25maWd1cmUoeyBpbmxpbmU6IGZhbHNlLCBjb250cm9sczogdHJ1ZSwgYWxsb3dGdWxsc2NyZWVuOiB0cnVlIH0pKTtcbiAgICAvLyBcdUJDRjhcdUJCMzggXHVDNzc4XHVCNzdDXHVDNzc4IFx1Qzc3NFx1QkJGOFx1QzlDMCBcdTIwMTQgY29sdW1uIC8gcmljaCBwcmVzZXQgXHVDNUQwXHVDMTFDIFx1RDY1Q1x1QzEzMS4gc2ltcGxlIFx1Qzc0MCBcdUNDQThcdUJEODAgXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDXHVCOUNDIFx1QzBBQ1x1QzZBOS5cbiAgICAvLyAodjMpIERyb3BjdXJzb3IgXHVCMjk0IFN0YXJ0ZXJLaXQgXHVDNUQwIFx1RDNFQ1x1RDU2OFx1QjQxOFx1QzVCNCBcdUM3OTBcdUIzRDkgXHVENjVDXHVDMTMxLiBJbWFnZSBcdUI5Q0Mgc3RhbmRhbG9uZS5cbiAgICBpZiAocHJlc2V0ID09PSBcImNvbHVtblwiIHx8IHByZXNldCA9PT0gXCJyaWNoXCIpIHtcbiAgICAgIGV4dGVuc2lvbnMucHVzaChcbiAgICAgICAgSW1hZ2UuY29uZmlndXJlKHsgaW5saW5lOiBmYWxzZSwgYWxsb3dCYXNlNjQ6IHRydWUsIEhUTUxBdHRyaWJ1dGVzOiB7IGNsYXNzOiAndGlwdGFwLWltZycgfSB9KSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdG9yID0gbmV3IEVkaXRvcih7XG4gICAgICBlbGVtZW50OiBob3N0LmN1cnJlbnQsXG4gICAgICBleHRlbnNpb25zLFxuICAgICAgY29udGVudCxcbiAgICAgIGVkaXRvclByb3BzOiB7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3RpcHRhcC1lZGl0b3InLFxuICAgICAgICAgICdhcmlhLWxhYmVsJzogJ1x1QkNGOFx1QkIzOCBcdUM1RDBcdUI1MTRcdUQxMzAgXHUyMDE0IFx1QjlDOFx1RDA2Q1x1QjJFNFx1QzZCNCBcdUIyRThcdUNEOTVcdUQwQTQgXHVDOUMwXHVDNkQwJyxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdjAwLjEzNSBcdTIwMTQgcGxhaW4gdGV4dCBcdUJEOTlcdUM1RUNcdUIxMjNcdUFFMzAgXHVDMkRDIFx1QzkwNFx1QkMxNFx1QUZDOCBcdUJDRjRcdUM4NzQuIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUJDRjRcdUFDRTAgJ1x1QzY3OFx1QkQ4MCBcdUFFMDBcdUM3NDQgXHVBQzA4XHVCQjM0XHVCOUFDXHVENTc0XHVDMTFDIFx1QzYyQyBcdUI1NEMgXHVDOTA0XHVCQzE0XHVBRkM4XHVDNzc0IFx1QzgwMVx1QzZBOSBcdUM1NDggXHVCNDI4Jy5cbiAgICAgICAgLy8gUHJvc2VNaXJyb3IgXHVBRTMwXHVCQ0Y4XHVDNzQwIHBsYWluIHRleHQgXHVDNzU4IFx1QjJFOFx1Qzc3QyBcXG4gXHVDNzQ0IFx1QkIzNFx1QzJEQ1x1RDU1OFx1QUNFMCBcdUFDRjVcdUJDMzFcdUM3M0NcdUI4NUMgXHVDQzk4XHVCOUFDLiBcdUIyRThcdUM3N0MgXFxuIFx1MjE5MiA8YnIvPixcbiAgICAgICAgLy8gXHVCRTQ4IFx1QzkwNChcXG5cXG4pIFx1MjE5MiBcdUMwQzggXHVCMkU4XHVCNzdEIFx1QzczQ1x1Qjg1QyBcdUM4MTVcdUMwQzEgXHVCQ0MwXHVENjU4LiB0ZXh0L2h0bWwgXHVEMzk4XHVDNzc0XHVCODVDXHVCNERDXHVBQzAwIFx1Qzc4OFx1QzczQ1x1QkE3NCBkZWZhdWx0IFx1Q0M5OFx1QjlBQyhcdUM2MDg6IEhUTUwgXHVCQ0Y0XHVDODc0KS5cbiAgICAgICAgaGFuZGxlUGFzdGU6ICh2aWV3LCBldmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNkID0gZXZlbnQuY2xpcGJvYXJkRGF0YTtcbiAgICAgICAgICBpZiAoIWNkKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgY29uc3QgaHRtbCA9IGNkLmdldERhdGEoJ3RleHQvaHRtbCcpO1xuICAgICAgICAgIGlmIChodG1sKSByZXR1cm4gZmFsc2U7IC8vIEhUTUwgXHVDNzc0IFx1Qzc4OFx1QzczQ1x1QkE3NCBkZWZhdWx0IFx1Q0M5OFx1QjlBQy5cbiAgICAgICAgICBjb25zdCB0ZXh0ID0gY2QuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgICAgICAgIGlmICghdGV4dCB8fCAhL1xcbi8udGVzdCh0ZXh0KSkgcmV0dXJuIGZhbHNlOyAvLyBcdUM5MDRcdUJDMTRcdUFGQzggXHVDNUM2XHVDNzNDXHVCQTc0IGRlZmF1bHQuXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBjb25zdCBlc2MgPSAocykgPT4gcy5yZXBsYWNlKC9bJjw+XS9nLCAoYykgPT4gKHsgJyYnOiAnJmFtcDsnLCAnPCc6ICcmbHQ7JywgJz4nOiAnJmd0OycgfVtjXSkpO1xuICAgICAgICAgIGNvbnN0IG91dCA9IHRleHRcbiAgICAgICAgICAgIC5zcGxpdCgvXFxuezIsfS8pXG4gICAgICAgICAgICAubWFwKChwYXJhKSA9PiAnPHA+JyArIGVzYyhwYXJhKS5zcGxpdCgnXFxuJykuam9pbignPGJyLz4nKSArICc8L3A+JylcbiAgICAgICAgICAgIC5qb2luKCcnKTtcbiAgICAgICAgICBlZGl0b3IuY29tbWFuZHMuaW5zZXJ0Q29udGVudChvdXQpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG9uVXBkYXRlOiAoeyBlZGl0b3IgfSkgPT4ge1xuICAgICAgICBvblVwZGF0ZT8uKGVkaXRvci5nZXRIVE1MKCksIGVkaXRvci5nZXRKU09OKCksIGVkaXRvci5nZXRUZXh0KCkpO1xuICAgICAgICBmb3JjZVJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIG9uU2VsZWN0aW9uVXBkYXRlOiAoKSA9PiBmb3JjZVJlbmRlcigpLFxuICAgIH0pO1xuICAgIGVkaXRvclJlZi5jdXJyZW50ID0gZWRpdG9yO1xuICAgIG9uUmVhZHk/LihlZGl0b3IpO1xuICAgIHJldHVybiAoKSA9PiB7IHRyeSB7IGVkaXRvci5kZXN0cm95KCk7IH0gY2F0Y2ggKGUpIHt9IH07XG4gIH0sIFtyZWFkeSwgcHJlc2V0XSk7XG5cbiAgaWYgKCFyZWFkeSkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpcHRhcC1ob3N0XCIgc3R5bGU9e3ttaW5IZWlnaHQ6MzIwLCBkaXNwbGF5OidncmlkJywgcGxhY2VJdGVtczonY2VudGVyJ319PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb25vIGRpbS0yXCIgc3R5bGU9e3tmb250U2l6ZToxMSwgbGV0dGVyU3BhY2luZzonMC4yZW0nfX0+XHVDNUQwXHVCNTE0XHVEMTMwIFx1Qjg1Q1x1QjUyOSBcdUM5MTFcdTIwMjY8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgZWQgPSBlZGl0b3JSZWYuY3VycmVudDtcbiAgY29uc3QgY2FuID0gKGZuKSA9PiBlZCAmJiBmbihlZCk7XG4gIGNvbnN0IGlzQWN0aXZlID0gKG5hbWUsIGF0dHJzKSA9PiBlZD8uaXNBY3RpdmU/LihuYW1lLCBhdHRycykgfHwgZmFsc2U7XG5cbiAgLy8gXHVCQ0Y4XHVCQjM4IFx1QjBCNCBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDMEJEXHVDNzg1IFx1MjAxNCB2MDAuMTM4IFIyIFx1QzVDNVx1Qjg1Q1x1QjREQyBcdUMwQUNcdUM2QTkuIFx1Qzc3NFx1QzgwNFx1QzVENCBGaWxlUmVhZGVyIFx1MjE5MiBkYXRhVVJJIGJhc2U2NCBcdUM3NzhcdUI3N0NcdUM3NzhcdUM3NzRcdUM1QzhcdUM5QzBcdUI5Q0NcbiAgLy8gXHUyNDYwIEQxIHJvdyBcdUFDMDAgXHVCRTQ0XHVCMzAwXHVENTc0XHVDOUMwXHVBQ0UwIFx1MjQ2MSBzYW5pdGl6ZS90cmFuc3BvcnQgXHVCRTQ0XHVDNkE5XHVDNzc0IFx1RDA2Q1x1QUNFMCBcdTI0NjIgXHVDMEFDXHVDNkE5XHVDNzkwIFx1QkNGNFx1QUNFMCBcIlx1Qzc3NFx1QkJGOFx1QzlDMFx1QjI5NCBcdUQzMENcdUM3N0NcdUI4NUMgXHVDNUM1XHVCODVDXHVCNERDXCIgXHVDNjk0XHVBRDZDLlxuICAvLyBcdUM1QzVcdUI4NUNcdUI0REMgXHVDMkU0XHVEMzI4IFx1QzJEQyBcdUMwQUNcdUM2QTlcdUM3OTBcdUM1RDBcdUFDOEMgXHVCQTg1XHVDMkRDXHVDODAxXHVDNzNDXHVCODVDIFx1QzU0Q1x1QjlCQyAoc2lsZW50IGRhdGFVUkkgXHVEM0Y0XHVCQzMxIFx1QzVDNlx1Qzc0QyBcdTIwMTQgXHVCMzcwXHVDNzc0XHVEMTMwIFx1QkU0NFx1QjMwMCBcdUJDMjlcdUM5QzApLlxuICBjb25zdCBpbnNlcnRJbmxpbmVJbWFnZSA9ICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgaW5wdXQudHlwZSA9ICdmaWxlJztcbiAgICBpbnB1dC5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgaW5wdXQub25jaGFuZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBmID0gaW5wdXQuZmlsZXM/LlswXTtcbiAgICAgIGlmICghZikgcmV0dXJuO1xuICAgICAgY29uc3QgZm9sZGVyID0gcHJlc2V0ID09PSAnY29sdW1uJyA/ICdjb2x1bW4taW1hZ2VzJyA6ICdwb3N0LWltYWdlcyc7XG4gICAgICB0cnkge1xuICAgICAgICBzZXRVcGxvYWRpbmdJbWFnZSh0cnVlKTtcbiAgICAgICAgY29uc3QgeyB1cmwgfSA9IGF3YWl0IHdpbmRvdy5CR05KX01FRElBLnVwbG9hZEZpbGUoZiwgeyBmb2xkZXIsIG1heEJ5dGVzOiAxMCAqIDEwMjQgKiAxMDI0IH0pO1xuICAgICAgICBlZC5jaGFpbigpLmZvY3VzKCkuc2V0SW1hZ2UoeyBzcmM6IHVybCwgYWx0OiBmLm5hbWUgfSkucnVuKCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdHJ5IHsgd2luZG93LmFsZXJ0KCdcdUM3NzRcdUJCRjhcdUM5QzAgXHVDNUM1XHVCODVDXHVCNERDIFx1QzJFNFx1RDMyODogJyArIChlcnI/Lm1lc3NhZ2UgfHwgZXJyKSk7IH0gY2F0Y2gge31cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHNldFVwbG9hZGluZ0ltYWdlKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlucHV0LmNsaWNrKCk7XG4gIH07XG5cbiAgY29uc3QgYWRkTGluayA9ICgpID0+IHtcbiAgICBjb25zdCBwcmV2ID0gZWQuZ2V0QXR0cmlidXRlcygnbGluaycpLmhyZWY7XG4gICAgY29uc3QgdXJsID0gd2luZG93LnByb21wdCgnXHVCOUMxXHVEMDZDIFVSTCcsIHByZXYgfHwgJ2h0dHBzOi8vJyk7XG4gICAgaWYgKHVybCA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmICh1cmwgPT09ICcnKSB7IGVkLmNoYWluKCkuZm9jdXMoKS51bnNldExpbmsoKS5ydW4oKTsgcmV0dXJuOyB9XG4gICAgZWQuY2hhaW4oKS5mb2N1cygpLmV4dGVuZE1hcmtSYW5nZSgnbGluaycpLnNldExpbmsoeyBocmVmOiB1cmwgfSkucnVuKCk7XG4gIH07XG5cbiAgLy8gdjAwLjA2OCBcdTIwMTQgWW91dHViZSBcdUM3ODRcdUJDQTBcdUI0REMuXG4gIGNvbnN0IGFkZFlvdXR1YmUgPSAoKSA9PiB7XG4gICAgY29uc3QgdXJsID0gd2luZG93LnByb21wdCgnWW91VHViZSBVUkwnLCAnaHR0cHM6Ly95b3V0dS5iZS8uLi4nKTtcbiAgICBpZiAoIXVybCkgcmV0dXJuO1xuICAgIHRyeSB7IGVkLmNoYWluKCkuZm9jdXMoKS5zZXRZb3V0dWJlVmlkZW8oeyBzcmM6IHVybCwgd2lkdGg6IDY0MCwgaGVpZ2h0OiAzNjAgfSkucnVuKCk7IH0gY2F0Y2gge31cbiAgfTtcbiAgLy8gXHVENDVDIFx1QzBCRFx1Qzc4NS5cbiAgY29uc3QgaW5zZXJ0VGFibGUgPSAoKSA9PiB7XG4gICAgdHJ5IHsgZWQuY2hhaW4oKS5mb2N1cygpLmluc2VydFRhYmxlKHsgcm93czogMywgY29sczogMywgd2l0aEhlYWRlclJvdzogdHJ1ZSB9KS5ydW4oKTsgfSBjYXRjaCB7fVxuICB9O1xuICAvLyBcdUQxNERcdUMyQTRcdUQyQjggXHVDMEM5XHVDMEMxLlxuICBjb25zdCBwaWNrQ29sb3IgPSAoKSA9PiB7XG4gICAgY29uc3QgY29sb3IgPSB3aW5kb3cucHJvbXB0KCdcdUQxNERcdUMyQTRcdUQyQjggXHVDMEM5XHVDMEMxIChoZXggXHVCNjEwXHVCMjk0IENTUyBcdUJDQzBcdUMyMTgpJywgJyM5MjQwMEUnKTtcbiAgICBpZiAoIWNvbG9yKSByZXR1cm47XG4gICAgdHJ5IHsgZWQuY2hhaW4oKS5mb2N1cygpLnNldENvbG9yKGNvbG9yKS5ydW4oKTsgfSBjYXRjaCB7fVxuICB9O1xuXG4gIGNvbnN0IEJ0biA9ICh7IGNtZCwgbGFiZWwsIGFjdGl2ZSwgZGlzYWJsZWQsIHNob3J0Y3V0IH0pID0+IChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIG9uQ2xpY2s9e2NtZH1cbiAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgIGFyaWEtcHJlc3NlZD17YWN0aXZlIHx8IGZhbHNlfVxuICAgICAgYXJpYS1sYWJlbD17bGFiZWwgKyAoc2hvcnRjdXQgPyBgICgke3Nob3J0Y3V0fSlgIDogJycpfVxuICAgICAgdGl0bGU9e3Nob3J0Y3V0ID8gYCR7bGFiZWx9IFx1MDBCNyAke3Nob3J0Y3V0fWAgOiBsYWJlbH1cbiAgICAgIGNsYXNzTmFtZT17YHR0LWJ0biAke2FjdGl2ZSA/ICdvbicgOiAnJ31gfT5cbiAgICAgIHtsYWJlbH1cbiAgICA8L2J1dHRvbj5cbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtgdGlwdGFwLXdyYXAgdGlwdGFwLSR7cHJlc2V0fWB9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXB0YXAtdG9vbGJhclwiIHJvbGU9XCJ0b29sYmFyXCIgYXJpYS1sYWJlbD1cIlx1QzExQ1x1QzJERCBcdUIzQzRcdUFENkNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0dC1ncm91cFwiPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJIMVwiIHNob3J0Y3V0PVwiXHUyMzE4XHUyMzI1MVwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdoZWFkaW5nJywgeyBsZXZlbDogMSB9KX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlSGVhZGluZyh7IGxldmVsOiAxIH0pLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJIMlwiIHNob3J0Y3V0PVwiXHUyMzE4XHUyMzI1MlwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdoZWFkaW5nJywgeyBsZXZlbDogMiB9KX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlSGVhZGluZyh7IGxldmVsOiAyIH0pLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJIM1wiIHNob3J0Y3V0PVwiXHUyMzE4XHUyMzI1M1wiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdoZWFkaW5nJywgeyBsZXZlbDogMyB9KX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlSGVhZGluZyh7IGxldmVsOiAzIH0pLnJ1bigpKX0vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0dC1kaXZpZGVyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWdyb3VwXCI+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIkJcIiBzaG9ydGN1dD1cIlx1MjMxOEJcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnYm9sZCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVCb2xkKCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIklcIiBzaG9ydGN1dD1cIlx1MjMxOElcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnaXRhbGljJyl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnRvZ2dsZUl0YWxpYygpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJVXCIgc2hvcnRjdXQ9XCJcdTIzMThVXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ3VuZGVybGluZScpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVVbmRlcmxpbmUoKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiU1wiIHNob3J0Y3V0PVwiXHUyMzE4XHUyMUU3WFwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdzdHJpa2UnKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlU3RyaWtlKCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjcwRlwiIHNob3J0Y3V0PVwiXHVENjE1XHVBRDExXHVEMzlDXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2hpZ2hsaWdodCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVIaWdobGlnaHQoKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiPC8+XCIgc2hvcnRjdXQ9XCJcdTIzMThFXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2NvZGUnKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlQ29kZSgpLnJ1bigpKX0vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0dC1kaXZpZGVyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWdyb3VwXCI+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlhcdTAwQjJcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnc3VwZXJzY3JpcHQnKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlU3VwZXJzY3JpcHQoKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiWFx1MjA4MlwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdzdWJzY3JpcHQnKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlU3Vic2NyaXB0KCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1RDgzQ1x1REZBOFwiIHNob3J0Y3V0PVwiXHVEMTREXHVDMkE0XHVEMkI4IFx1QzBDOVx1QzBDMVwiIGNtZD17cGlja0NvbG9yfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZ3JvdXBcIj5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyMDIyXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2J1bGxldExpc3QnKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlQnVsbGV0TGlzdCgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCIxLlwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdvcmRlcmVkTGlzdCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVPcmRlcmVkTGlzdCgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdTI2MTBcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgndGFza0xpc3QnKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlVGFza0xpc3QoKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyNzVEXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2Jsb2NrcXVvdGUnKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlQmxvY2txdW90ZSgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJ7IH1cIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnY29kZUJsb2NrJyl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnRvZ2dsZUNvZGVCbG9jaygpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdTIwMTRcIlxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS5zZXRIb3Jpem9udGFsUnVsZSgpLnJ1bigpKX0vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0dC1kaXZpZGVyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWdyb3VwXCI+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjFFNFwiIHNob3J0Y3V0PVwiXHVDNjdDXHVDQUJEIFx1QzgxNVx1QjgyQ1wiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKHsgdGV4dEFsaWduOiAnbGVmdCcgfSl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnNldFRleHRBbGlnbignbGVmdCcpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdTIxRDRcIiBzaG9ydGN1dD1cIlx1QUMwMFx1QzZCNFx1QjM3MCBcdUM4MTVcdUI4MkNcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSh7IHRleHRBbGlnbjogJ2NlbnRlcicgfSl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnNldFRleHRBbGlnbignY2VudGVyJykucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjFFNVwiIHNob3J0Y3V0PVwiXHVDNjI0XHVCOTc4XHVDQUJEIFx1QzgxNVx1QjgyQ1wiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKHsgdGV4dEFsaWduOiAncmlnaHQnIH0pfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS5zZXRUZXh0QWxpZ24oJ3JpZ2h0JykucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjI2M1wiIHNob3J0Y3V0PVwiXHVDNTkxXHVDQUJEIFx1QzgxNVx1QjgyQ1wiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKHsgdGV4dEFsaWduOiAnanVzdGlmeScgfSl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnNldFRleHRBbGlnbignanVzdGlmeScpLnJ1bigpKX0vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0dC1kaXZpZGVyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWdyb3VwXCI+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1RDgzRFx1REQxN1wiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdsaW5rJyl9XG4gICAgICAgICAgICBjbWQ9e2FkZExpbmt9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHVEODNEXHVEQ0ZBIFlUXCIgc2hvcnRjdXQ9XCJZb3VUdWJlXCIgY21kPXthZGRZb3V0dWJlfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjI5RSBcdUQ0NUNcIiBjbWQ9e2luc2VydFRhYmxlfS8+XG4gICAgICAgICAgeyhwcmVzZXQgPT09IFwiY29sdW1uXCIgfHwgcHJlc2V0ID09PSBcInJpY2hcIikgJiYgKFxuICAgICAgICAgICAgPEJ0biBsYWJlbD17dXBsb2FkaW5nSW1hZ2UgPyBcIlx1MjNGMyBcdUM1QzVcdUI4NUNcdUI0REMgXHVDOTExXHUyMDI2XCIgOiBcIlx1RDgzRFx1RERCQyBcdUJDRjhcdUJCMzggXHVDNzc0XHVCQkY4XHVDOUMwXCJ9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXt1cGxvYWRpbmdJbWFnZX1cbiAgICAgICAgICAgICAgY21kPXtpbnNlcnRJbmxpbmVJbWFnZX0vPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZ3JvdXBcIj5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyMUI2XCIgc2hvcnRjdXQ9XCJcdTIzMThaXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXshZWQ/LmNhbigpLnVuZG8oKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudW5kbygpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdTIxQjdcIiBzaG9ydGN1dD1cIlx1MjMxOFx1MjFFN1pcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFlZD8uY2FuKCkucmVkbygpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS5yZWRvKCkucnVuKCkpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHJlZj17aG9zdH0gY2xhc3NOYW1lPVwidGlwdGFwLWhvc3RcIi8+XG4gICAgICB7cHJlc2V0ID09PSBcImNvbHVtblwiICYmIChcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGltLTIgbW9ub1wiIHN0eWxlPXt7Zm9udFNpemU6MTAsIG1hcmdpblRvcDo2LCBsZXR0ZXJTcGFjaW5nOicwLjFlbSd9fT5cbiAgICAgICAgICBcdUJDRjhcdUJCMzggXHVDNzc0XHVCQkY4XHVDOUMwXHVCMjk0IFx1QjREQ1x1Qjc5OFx1QURGOFx1Qjg1QyBcdUM3OTBcdUM3MjBcdUI4NkRcdUFDOEMgXHVDNzc0XHVCM0Q5XHVENTYwIFx1QzIxOCBcdUM3ODhcdUMyQjVcdUIyQzhcdUIyRTQuIFx1Qzc3NFx1QkJGOFx1QzlDMFx1Qjk3QyBcdUIwNENcdUM1QjQgXHVDNkQwXHVENTU4XHVCMjk0IFx1QzcwNFx1Q0U1OFx1Qjg1QyBcdUIxOTNcdUM3M0NcdUMxMzhcdUM2OTQuXG4gICAgICAgIDwvcD5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5PYmplY3QuYXNzaWduKHdpbmRvdywgeyBUaXB0YXBFZGl0b3IgfSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFPQSxNQUFNLGVBQWUsQ0FBQyxFQUFFLFNBQVMsVUFBVSxVQUFVLElBQUksVUFBVSxTQUFTLGNBQWMsdURBQWUsTUFBTTtBQUM3RyxRQUFNLE9BQU8sTUFBTSxPQUFPLElBQUk7QUFDOUIsUUFBTSxZQUFZLE1BQU0sT0FBTyxJQUFJO0FBQ25DLFFBQU0sQ0FBQyxPQUFPLFFBQVEsSUFBSSxNQUFNLFNBQVMsUUFBUSxPQUFPLFdBQVcsQ0FBQztBQUNwRSxRQUFNLENBQUMsRUFBRSxXQUFXLElBQUksTUFBTSxXQUFXLE9BQUssSUFBSSxHQUFHLENBQUM7QUFFdEQsUUFBTSxDQUFDLGdCQUFnQixpQkFBaUIsSUFBSSxNQUFNLFNBQVMsS0FBSztBQUVoRSxRQUFNLFVBQVUsTUFBTTtBQUNwQixRQUFJLE1BQU87QUFDWCxVQUFNLElBQUksTUFBTSxTQUFTLElBQUk7QUFDN0IsV0FBTyxpQkFBaUIsb0JBQW9CLENBQUM7QUFDN0MsV0FBTyxNQUFNLE9BQU8sb0JBQW9CLG9CQUFvQixDQUFDO0FBQUEsRUFDL0QsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUVWLFFBQU0sVUFBVSxNQUFNO0FBQ3BCLFFBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxRQUFTO0FBQzdCLFVBQU0sSUFBSSxPQUFPO0FBQ2pCLFVBQU0sRUFBRSxRQUFRLFlBQVksYUFBYSxPQUFPLFdBQVcsSUFBSTtBQUkvRCxVQUFNLGFBQWE7QUFBQSxNQUNqQixXQUFXLFVBQVU7QUFBQSxRQUNuQixTQUFTLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUU7QUFBQSxRQUM3QixNQUFNLEVBQUUsYUFBYSxPQUFPLGdCQUFnQixFQUFFLEtBQUssc0JB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

})();

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
        // v00.139 — Enter 1회=<br>(hard break, 공백 없음), Enter 2회=<p>(새 단락, 공백 1줄).
        // 사용자 요청 '엔터 1번 치면 줄바꿈, 엔터 2번 치면 줄바꿈+공백 1줄'. ProseMirror 기본은 반대 (Enter=새 단락).
        // 단락(paragraph) 안에서만 적용 — 헤딩/리스트/코드블록/인용/표는 default (Enter=split block) 유지.
        handleKeyDown: (view, event) => {
          if (event.key !== "Enter" || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return false;
          const { state } = view;
          const { $from, empty } = state.selection;
          if (!empty) return false;
          if ($from.parent.type.name !== "paragraph") return false;
          const schema = state.schema;
          if (!schema.nodes.hardBreak) return false;
          const before = $from.nodeBefore;
          if (before && before.type.name === "hardBreak") {
            event.preventDefault();
            const tr = state.tr.delete($from.pos - before.nodeSize, $from.pos);
            const splitPos = tr.selection.from;
            tr.split(splitPos);
            view.dispatch(tr.scrollIntoView());
            return true;
          }
          event.preventDefault();
          view.dispatch(state.tr.replaceSelectionWith(schema.nodes.hardBreak.create()).scrollIntoView());
          return true;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29tcG9uZW50cy9UaXB0YXBFZGl0b3IuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBcdUJDNDVcdUFFMzBcdUIxNzhcdUM3OTAgXHVBQ0Y1XHVDNkE5IFRpcHRhcCBcdUM1RDBcdUI1MTRcdUQxMzBcbi8vIFx1QjQ1MCBcdUQ1MDRcdUI5QUNcdUMxNEI6XG4vLyAgIC0gXCJzaW1wbGVcIiAgOiBcdUNFRTRcdUJCQTRcdUIyQzhcdUQyRjAgXHVBRTAwXHVDNEYwXHVBRTMwXHVDNkE5IChcdUJDRjhcdUJCMzggXHVDNzc0XHVCQkY4XHVDOUMwIFx1QkQ4OFx1QUMwMCwgXHVBRTMwXHVCQ0Y4IFx1RDNFQ1x1QjlGN1x1QjlDQylcbi8vICAgLSBcImNvbHVtblwiICA6IFx1Q0U3Q1x1QjdGQ1x1QzZBOSAoXHVCQ0Y4XHVCQjM4IFx1QjBCNCBcdUM3NzRcdUJCRjhcdUM5QzAgKyBcdUI0RENcdUI3OThcdUFERjggXHVDNzA0XHVDRTU4IFx1Qzc3NFx1QjNEOSlcbi8vXG4vLyBcdUMwQUNcdUM2QTk6IDxUaXB0YXBFZGl0b3IgcHJlc2V0PVwic2ltcGxlXCIgY29udGVudD1cIi4uLlwiIG9uVXBkYXRlPXsoaHRtbCwganNvbiwgdGV4dCkgPT4gLi4ufSAvPlxuXG5jb25zdCBUaXB0YXBFZGl0b3IgPSAoeyBwcmVzZXQgPSBcInNpbXBsZVwiLCBjb250ZW50ID0gXCJcIiwgb25VcGRhdGUsIG9uUmVhZHksIHBsYWNlaG9sZGVyID0gXCJcdUIwQjRcdUM2QTlcdUM3NDQgXHVDNzg1XHVCODI1XHVENTU4XHVDMTM4XHVDNjk0Li4uXCIgfSkgPT4ge1xuICBjb25zdCBob3N0ID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICBjb25zdCBlZGl0b3JSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gIGNvbnN0IFtyZWFkeSwgc2V0UmVhZHldID0gUmVhY3QudXNlU3RhdGUoQm9vbGVhbih3aW5kb3cuQkdOSl9USVBUQVApKTtcbiAgY29uc3QgWywgZm9yY2VSZW5kZXJdID0gUmVhY3QudXNlUmVkdWNlcih4ID0+IHggKyAxLCAwKTtcbiAgLy8gdjAwLjEzOCBcdTIwMTQgXHVCQ0Y4XHVCQjM4IFx1Qzc3NFx1QkJGOFx1QzlDMCBSMiBcdUM1QzVcdUI4NUNcdUI0REMgXHVDMEMxXHVEMERDLiBlYXJseSByZXR1cm4gXHVDNzc0XHVDODA0XHVDNUQwIFx1QzEyMFx1QzVCOCAoUnVsZXMgb2YgSG9va3MpLlxuICBjb25zdCBbdXBsb2FkaW5nSW1hZ2UsIHNldFVwbG9hZGluZ0ltYWdlXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChyZWFkeSkgcmV0dXJuO1xuICAgIGNvbnN0IGggPSAoKSA9PiBzZXRSZWFkeSh0cnVlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignd3NkLXRpcHRhcC1yZWFkeScsIGgpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignd3NkLXRpcHRhcC1yZWFkeScsIGgpO1xuICB9LCBbcmVhZHldKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghcmVhZHkgfHwgIWhvc3QuY3VycmVudCkgcmV0dXJuO1xuICAgIGNvbnN0IFQgPSB3aW5kb3cuQkdOSl9USVBUQVA7XG4gICAgY29uc3QgeyBFZGl0b3IsIFN0YXJ0ZXJLaXQsIFBsYWNlaG9sZGVyLCBJbWFnZSwgVHlwb2dyYXBoeSB9ID0gVDtcblxuICAgIC8vIHYwMC4wOTAgXHUyMDE0IFRpcHRhcCAzOiBTdGFydGVyS2l0IFx1Qzc3NCB1bmRlcmxpbmUgLyBsaW5rIC8gZHJvcGN1cnNvciBcdUI5N0MgXHVBRTMwXHVCQ0Y4IFx1RDNFQ1x1RDU2OC5cbiAgICAvLyBcdUM3NzRcdUM4MDQgc3RhbmRhbG9uZSBVbmRlcmxpbmUgLyBMaW5rIC8gRHJvcGN1cnNvciBcdUIyOTQgXHVDODFDXHVBQzcwICsgXHVDNjM1XHVDMTU4XHVDNzQ0IFN0YXJ0ZXJLaXQuY29uZmlndXJlIFx1Qjg1QyBcdUM3NzRcdUM4MDQuXG4gICAgY29uc3QgZXh0ZW5zaW9ucyA9IFtcbiAgICAgIFN0YXJ0ZXJLaXQuY29uZmlndXJlKHtcbiAgICAgICAgaGVhZGluZzogeyBsZXZlbHM6IFsxLCAyLCAzXSB9LFxuICAgICAgICBsaW5rOiB7IG9wZW5PbkNsaWNrOiBmYWxzZSwgSFRNTEF0dHJpYnV0ZXM6IHsgcmVsOiAnbm9vcGVuZXIgbm9yZWZlcnJlcicgfSB9LFxuICAgICAgICBkcm9wY3Vyc29yOiB7IGNvbG9yOiAndmFyKC0tcHJpbWFyeSknLCB3aWR0aDogMiB9LFxuICAgICAgICAvLyBjb2RlQmxvY2sgLyB1bmRlcmxpbmUgXHVCNEYxIFx1QUUzMFx1RDBDMCBcdUFFMzBcdUJDRjhcdUFDMTIgKHRydWUpIFx1QzBBQ1x1QzZBOS5cbiAgICAgIH0pLFxuICAgICAgUGxhY2Vob2xkZXIuY29uZmlndXJlKHsgcGxhY2Vob2xkZXIgfSksXG4gICAgICBUeXBvZ3JhcGh5LFxuICAgIF07XG4gICAgLy8gdjAwLjA2ODogXHVCQjM0XHVCOENDIGV4dGVuc2lvbiBcdUQ0OERcdUJEODBcdUQ2NTQgXHUyMDE0IFx1QkFBOFx1QjRFMCBwcmVzZXQgXHVDNUQwXHVDMTFDIFx1QzBBQ1x1QzZBOSBcdUFDMDBcdUIyQTUuICh2MyBcdUQ2MzhcdUQ2NTgpXG4gICAgaWYgKFQuSGlnaGxpZ2h0KSAgIGV4dGVuc2lvbnMucHVzaChULkhpZ2hsaWdodC5jb25maWd1cmUoeyBtdWx0aWNvbG9yOiB0cnVlIH0pKTtcbiAgICBpZiAoVC5UZXh0QWxpZ24pICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGV4dEFsaWduLmNvbmZpZ3VyZSh7IHR5cGVzOiBbJ2hlYWRpbmcnLCAncGFyYWdyYXBoJ10gfSkpO1xuICAgIGlmIChULlN1YnNjcmlwdCkgICBleHRlbnNpb25zLnB1c2goVC5TdWJzY3JpcHQpO1xuICAgIGlmIChULlN1cGVyc2NyaXB0KSBleHRlbnNpb25zLnB1c2goVC5TdXBlcnNjcmlwdCk7XG4gICAgaWYgKFQuVGFza0xpc3QgJiYgVC5UYXNrSXRlbSkge1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFza0xpc3QpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFza0l0ZW0uY29uZmlndXJlKHsgbmVzdGVkOiB0cnVlIH0pKTtcbiAgICB9XG4gICAgaWYgKFQuVGV4dFN0eWxlKSBleHRlbnNpb25zLnB1c2goVC5UZXh0U3R5bGUpO1xuICAgIGlmIChULkNvbG9yICYmIFQuVGV4dFN0eWxlKSBleHRlbnNpb25zLnB1c2goVC5Db2xvcik7XG4gICAgaWYgKFQuVGFibGUgJiYgVC5UYWJsZVJvdyAmJiBULlRhYmxlQ2VsbCAmJiBULlRhYmxlSGVhZGVyKSB7XG4gICAgICBleHRlbnNpb25zLnB1c2goVC5UYWJsZS5jb25maWd1cmUoeyByZXNpemFibGU6IHRydWUgfSkpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFibGVSb3cpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFibGVIZWFkZXIpO1xuICAgICAgZXh0ZW5zaW9ucy5wdXNoKFQuVGFibGVDZWxsKTtcbiAgICB9XG4gICAgaWYgKFQuWW91dHViZSkgZXh0ZW5zaW9ucy5wdXNoKFQuWW91dHViZS5jb25maWd1cmUoeyBpbmxpbmU6IGZhbHNlLCBjb250cm9sczogdHJ1ZSwgYWxsb3dGdWxsc2NyZWVuOiB0cnVlIH0pKTtcbiAgICAvLyBcdUJDRjhcdUJCMzggXHVDNzc4XHVCNzdDXHVDNzc4IFx1Qzc3NFx1QkJGOFx1QzlDMCBcdTIwMTQgY29sdW1uIC8gcmljaCBwcmVzZXQgXHVDNUQwXHVDMTFDIFx1RDY1Q1x1QzEzMS4gc2ltcGxlIFx1Qzc0MCBcdUNDQThcdUJEODAgXHVDMkFDXHVCNzdDXHVDNzc0XHVCNERDXHVCOUNDIFx1QzBBQ1x1QzZBOS5cbiAgICAvLyAodjMpIERyb3BjdXJzb3IgXHVCMjk0IFN0YXJ0ZXJLaXQgXHVDNUQwIFx1RDNFQ1x1RDU2OFx1QjQxOFx1QzVCNCBcdUM3OTBcdUIzRDkgXHVENjVDXHVDMTMxLiBJbWFnZSBcdUI5Q0Mgc3RhbmRhbG9uZS5cbiAgICBpZiAocHJlc2V0ID09PSBcImNvbHVtblwiIHx8IHByZXNldCA9PT0gXCJyaWNoXCIpIHtcbiAgICAgIGV4dGVuc2lvbnMucHVzaChcbiAgICAgICAgSW1hZ2UuY29uZmlndXJlKHsgaW5saW5lOiBmYWxzZSwgYWxsb3dCYXNlNjQ6IHRydWUsIEhUTUxBdHRyaWJ1dGVzOiB7IGNsYXNzOiAndGlwdGFwLWltZycgfSB9KSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdG9yID0gbmV3IEVkaXRvcih7XG4gICAgICBlbGVtZW50OiBob3N0LmN1cnJlbnQsXG4gICAgICBleHRlbnNpb25zLFxuICAgICAgY29udGVudCxcbiAgICAgIGVkaXRvclByb3BzOiB7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGFzczogJ3RpcHRhcC1lZGl0b3InLFxuICAgICAgICAgICdhcmlhLWxhYmVsJzogJ1x1QkNGOFx1QkIzOCBcdUM1RDBcdUI1MTRcdUQxMzAgXHUyMDE0IFx1QjlDOFx1RDA2Q1x1QjJFNFx1QzZCNCBcdUIyRThcdUNEOTVcdUQwQTQgXHVDOUMwXHVDNkQwJyxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdjAwLjEzOSBcdTIwMTQgRW50ZXIgMVx1RDY4Qz08YnI+KGhhcmQgYnJlYWssIFx1QUNGNVx1QkMzMSBcdUM1QzZcdUM3NEMpLCBFbnRlciAyXHVENjhDPTxwPihcdUMwQzggXHVCMkU4XHVCNzdELCBcdUFDRjVcdUJDMzEgMVx1QzkwNCkuXG4gICAgICAgIC8vIFx1QzBBQ1x1QzZBOVx1Qzc5MCBcdUM2OTRcdUNDQUQgJ1x1QzVENFx1RDEzMCAxXHVCQzg4IFx1Q0U1OFx1QkE3NCBcdUM5MDRcdUJDMTRcdUFGQzgsIFx1QzVENFx1RDEzMCAyXHVCQzg4IFx1Q0U1OFx1QkE3NCBcdUM5MDRcdUJDMTRcdUFGQzgrXHVBQ0Y1XHVCQzMxIDFcdUM5MDQnLiBQcm9zZU1pcnJvciBcdUFFMzBcdUJDRjhcdUM3NDAgXHVCQzE4XHVCMzAwIChFbnRlcj1cdUMwQzggXHVCMkU4XHVCNzdEKS5cbiAgICAgICAgLy8gXHVCMkU4XHVCNzdEKHBhcmFncmFwaCkgXHVDNTQ4XHVDNUQwXHVDMTFDXHVCOUNDIFx1QzgwMVx1QzZBOSBcdTIwMTQgXHVENUU0XHVCNTI5L1x1QjlBQ1x1QzJBNFx1RDJCOC9cdUNGNTRcdUI0RENcdUJFMTRcdUI4NUQvXHVDNzc4XHVDNkE5L1x1RDQ1Q1x1QjI5NCBkZWZhdWx0IChFbnRlcj1zcGxpdCBibG9jaykgXHVDNzIwXHVDOUMwLlxuICAgICAgICBoYW5kbGVLZXlEb3duOiAodmlldywgZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQua2V5ICE9PSAnRW50ZXInIHx8IGV2ZW50LnNoaWZ0S2V5IHx8IGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQuY3RybEtleSB8fCBldmVudC5hbHRLZXkgfHwgZXZlbnQuaXNDb21wb3NpbmcpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICBjb25zdCB7IHN0YXRlIH0gPSB2aWV3O1xuICAgICAgICAgIGNvbnN0IHsgJGZyb20sIGVtcHR5IH0gPSBzdGF0ZS5zZWxlY3Rpb247XG4gICAgICAgICAgaWYgKCFlbXB0eSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIGlmICgkZnJvbS5wYXJlbnQudHlwZS5uYW1lICE9PSAncGFyYWdyYXBoJykgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIGNvbnN0IHNjaGVtYSA9IHN0YXRlLnNjaGVtYTtcbiAgICAgICAgICBpZiAoIXNjaGVtYS5ub2Rlcy5oYXJkQnJlYWspIHJldHVybiBmYWxzZTtcbiAgICAgICAgICBjb25zdCBiZWZvcmUgPSAkZnJvbS5ub2RlQmVmb3JlO1xuICAgICAgICAgIC8vIFx1QzlDMVx1QzgwNCBcdUIxNzhcdUI0RENcdUFDMDAgaGFyZEJyZWFrIFx1QkE3NCBcdUI0NTAgXHVCQzg4XHVDOUY4IEVudGVyIFx1MjAxNCBoYXJkQnJlYWsgXHVDODFDXHVBQzcwICsgXHVCMkU4XHVCNzdEIFx1QkQ4NFx1RDU2MC5cbiAgICAgICAgICBpZiAoYmVmb3JlICYmIGJlZm9yZS50eXBlLm5hbWUgPT09ICdoYXJkQnJlYWsnKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgdHIgPSBzdGF0ZS50ci5kZWxldGUoJGZyb20ucG9zIC0gYmVmb3JlLm5vZGVTaXplLCAkZnJvbS5wb3MpO1xuICAgICAgICAgICAgY29uc3Qgc3BsaXRQb3MgPSB0ci5zZWxlY3Rpb24uZnJvbTtcbiAgICAgICAgICAgIHRyLnNwbGl0KHNwbGl0UG9zKTtcbiAgICAgICAgICAgIHZpZXcuZGlzcGF0Y2godHIuc2Nyb2xsSW50b1ZpZXcoKSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gXHVDQ0FCIFx1QkM4OFx1QzlGOCBFbnRlciBcdTIwMTQgaGFyZCBicmVhayBcdUMwQkRcdUM3ODUuXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB2aWV3LmRpc3BhdGNoKHN0YXRlLnRyLnJlcGxhY2VTZWxlY3Rpb25XaXRoKHNjaGVtYS5ub2Rlcy5oYXJkQnJlYWsuY3JlYXRlKCkpLnNjcm9sbEludG9WaWV3KCkpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAvLyB2MDAuMTM1IFx1MjAxNCBwbGFpbiB0ZXh0IFx1QkQ5OVx1QzVFQ1x1QjEyM1x1QUUzMCBcdUMyREMgXHVDOTA0XHVCQzE0XHVBRkM4IFx1QkNGNFx1Qzg3NC4gXHVDMEFDXHVDNkE5XHVDNzkwIFx1QkNGNFx1QUNFMCAnXHVDNjc4XHVCRDgwIFx1QUUwMFx1Qzc0NCBcdUFDMDhcdUJCMzRcdUI5QUNcdUQ1NzRcdUMxMUMgXHVDNjJDIFx1QjU0QyBcdUM5MDRcdUJDMTRcdUFGQzhcdUM3NzQgXHVDODAxXHVDNkE5IFx1QzU0OCBcdUI0MjgnLlxuICAgICAgICAvLyBQcm9zZU1pcnJvciBcdUFFMzBcdUJDRjhcdUM3NDAgcGxhaW4gdGV4dCBcdUM3NTggXHVCMkU4XHVDNzdDIFxcbiBcdUM3NDQgXHVCQjM0XHVDMkRDXHVENTU4XHVBQ0UwIFx1QUNGNVx1QkMzMVx1QzczQ1x1Qjg1QyBcdUNDOThcdUI5QUMuIFx1QjJFOFx1Qzc3QyBcXG4gXHUyMTkyIDxici8+LFxuICAgICAgICAvLyBcdUJFNDggXHVDOTA0KFxcblxcbikgXHUyMTkyIFx1QzBDOCBcdUIyRThcdUI3N0QgXHVDNzNDXHVCODVDIFx1QzgxNVx1QzBDMSBcdUJDQzBcdUQ2NTguIHRleHQvaHRtbCBcdUQzOThcdUM3NzRcdUI4NUNcdUI0RENcdUFDMDAgXHVDNzg4XHVDNzNDXHVCQTc0IGRlZmF1bHQgXHVDQzk4XHVCOUFDKFx1QzYwODogSFRNTCBcdUJDRjRcdUM4NzQpLlxuICAgICAgICBoYW5kbGVQYXN0ZTogKHZpZXcsIGV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgY2QgPSBldmVudC5jbGlwYm9hcmREYXRhO1xuICAgICAgICAgIGlmICghY2QpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICBjb25zdCBodG1sID0gY2QuZ2V0RGF0YSgndGV4dC9odG1sJyk7XG4gICAgICAgICAgaWYgKGh0bWwpIHJldHVybiBmYWxzZTsgLy8gSFRNTCBcdUM3NzQgXHVDNzg4XHVDNzNDXHVCQTc0IGRlZmF1bHQgXHVDQzk4XHVCOUFDLlxuICAgICAgICAgIGNvbnN0IHRleHQgPSBjZC5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gICAgICAgICAgaWYgKCF0ZXh0IHx8ICEvXFxuLy50ZXN0KHRleHQpKSByZXR1cm4gZmFsc2U7IC8vIFx1QzkwNFx1QkMxNFx1QUZDOCBcdUM1QzZcdUM3M0NcdUJBNzQgZGVmYXVsdC5cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGNvbnN0IGVzYyA9IChzKSA9PiBzLnJlcGxhY2UoL1smPD5dL2csIChjKSA9PiAoeyAnJic6ICcmYW1wOycsICc8JzogJyZsdDsnLCAnPic6ICcmZ3Q7JyB9W2NdKSk7XG4gICAgICAgICAgY29uc3Qgb3V0ID0gdGV4dFxuICAgICAgICAgICAgLnNwbGl0KC9cXG57Mix9LylcbiAgICAgICAgICAgIC5tYXAoKHBhcmEpID0+ICc8cD4nICsgZXNjKHBhcmEpLnNwbGl0KCdcXG4nKS5qb2luKCc8YnIvPicpICsgJzwvcD4nKVxuICAgICAgICAgICAgLmpvaW4oJycpO1xuICAgICAgICAgIGVkaXRvci5jb21tYW5kcy5pbnNlcnRDb250ZW50KG91dCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgb25VcGRhdGU6ICh7IGVkaXRvciB9KSA9PiB7XG4gICAgICAgIG9uVXBkYXRlPy4oZWRpdG9yLmdldEhUTUwoKSwgZWRpdG9yLmdldEpTT04oKSwgZWRpdG9yLmdldFRleHQoKSk7XG4gICAgICAgIGZvcmNlUmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgb25TZWxlY3Rpb25VcGRhdGU6ICgpID0+IGZvcmNlUmVuZGVyKCksXG4gICAgfSk7XG4gICAgZWRpdG9yUmVmLmN1cnJlbnQgPSBlZGl0b3I7XG4gICAgb25SZWFkeT8uKGVkaXRvcik7XG4gICAgcmV0dXJuICgpID0+IHsgdHJ5IHsgZWRpdG9yLmRlc3Ryb3koKTsgfSBjYXRjaCAoZSkge30gfTtcbiAgfSwgW3JlYWR5LCBwcmVzZXRdKTtcblxuICBpZiAoIXJlYWR5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGlwdGFwLWhvc3RcIiBzdHlsZT17e21pbkhlaWdodDozMjAsIGRpc3BsYXk6J2dyaWQnLCBwbGFjZUl0ZW1zOidjZW50ZXInfX0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vbm8gZGltLTJcIiBzdHlsZT17e2ZvbnRTaXplOjExLCBsZXR0ZXJTcGFjaW5nOicwLjJlbSd9fT5cdUM1RDBcdUI1MTRcdUQxMzAgXHVCODVDXHVCNTI5IFx1QzkxMVx1MjAyNjwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBjb25zdCBlZCA9IGVkaXRvclJlZi5jdXJyZW50O1xuICBjb25zdCBjYW4gPSAoZm4pID0+IGVkICYmIGZuKGVkKTtcbiAgY29uc3QgaXNBY3RpdmUgPSAobmFtZSwgYXR0cnMpID0+IGVkPy5pc0FjdGl2ZT8uKG5hbWUsIGF0dHJzKSB8fCBmYWxzZTtcblxuICAvLyBcdUJDRjhcdUJCMzggXHVCMEI0IFx1Qzc3NFx1QkJGOFx1QzlDMCBcdUMwQkRcdUM3ODUgXHUyMDE0IHYwMC4xMzggUjIgXHVDNUM1XHVCODVDXHVCNERDIFx1QzBBQ1x1QzZBOS4gXHVDNzc0XHVDODA0XHVDNUQ0IEZpbGVSZWFkZXIgXHUyMTkyIGRhdGFVUkkgYmFzZTY0IFx1Qzc3OFx1Qjc3Q1x1Qzc3OFx1Qzc3NFx1QzVDOFx1QzlDMFx1QjlDQ1xuICAvLyBcdTI0NjAgRDEgcm93IFx1QUMwMCBcdUJFNDRcdUIzMDBcdUQ1NzRcdUM5QzBcdUFDRTAgXHUyNDYxIHNhbml0aXplL3RyYW5zcG9ydCBcdUJFNDRcdUM2QTlcdUM3NzQgXHVEMDZDXHVBQ0UwIFx1MjQ2MiBcdUMwQUNcdUM2QTlcdUM3OTAgXHVCQ0Y0XHVBQ0UwIFwiXHVDNzc0XHVCQkY4XHVDOUMwXHVCMjk0IFx1RDMwQ1x1Qzc3Q1x1Qjg1QyBcdUM1QzVcdUI4NUNcdUI0RENcIiBcdUM2OTRcdUFENkMuXG4gIC8vIFx1QzVDNVx1Qjg1Q1x1QjREQyBcdUMyRTRcdUQzMjggXHVDMkRDIFx1QzBBQ1x1QzZBOVx1Qzc5MFx1QzVEMFx1QUM4QyBcdUJBODVcdUMyRENcdUM4MDFcdUM3M0NcdUI4NUMgXHVDNTRDXHVCOUJDIChzaWxlbnQgZGF0YVVSSSBcdUQzRjRcdUJDMzEgXHVDNUM2XHVDNzRDIFx1MjAxNCBcdUIzNzBcdUM3NzRcdUQxMzAgXHVCRTQ0XHVCMzAwIFx1QkMyOVx1QzlDMCkuXG4gIGNvbnN0IGluc2VydElubGluZUltYWdlID0gKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBpbnB1dC50eXBlID0gJ2ZpbGUnO1xuICAgIGlucHV0LmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICBpbnB1dC5vbmNoYW5nZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGYgPSBpbnB1dC5maWxlcz8uWzBdO1xuICAgICAgaWYgKCFmKSByZXR1cm47XG4gICAgICBjb25zdCBmb2xkZXIgPSBwcmVzZXQgPT09ICdjb2x1bW4nID8gJ2NvbHVtbi1pbWFnZXMnIDogJ3Bvc3QtaW1hZ2VzJztcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldFVwbG9hZGluZ0ltYWdlKHRydWUpO1xuICAgICAgICBjb25zdCB7IHVybCB9ID0gYXdhaXQgd2luZG93LkJHTkpfTUVESUEudXBsb2FkRmlsZShmLCB7IGZvbGRlciwgbWF4Qnl0ZXM6IDEwICogMTAyNCAqIDEwMjQgfSk7XG4gICAgICAgIGVkLmNoYWluKCkuZm9jdXMoKS5zZXRJbWFnZSh7IHNyYzogdXJsLCBhbHQ6IGYubmFtZSB9KS5ydW4oKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0cnkgeyB3aW5kb3cuYWxlcnQoJ1x1Qzc3NFx1QkJGOFx1QzlDMCBcdUM1QzVcdUI4NUNcdUI0REMgXHVDMkU0XHVEMzI4OiAnICsgKGVycj8ubWVzc2FnZSB8fCBlcnIpKTsgfSBjYXRjaCB7fVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0VXBsb2FkaW5nSW1hZ2UoZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgaW5wdXQuY2xpY2soKTtcbiAgfTtcblxuICBjb25zdCBhZGRMaW5rID0gKCkgPT4ge1xuICAgIGNvbnN0IHByZXYgPSBlZC5nZXRBdHRyaWJ1dGVzKCdsaW5rJykuaHJlZjtcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cucHJvbXB0KCdcdUI5QzFcdUQwNkMgVVJMJywgcHJldiB8fCAnaHR0cHM6Ly8nKTtcbiAgICBpZiAodXJsID09PSBudWxsKSByZXR1cm47XG4gICAgaWYgKHVybCA9PT0gJycpIHsgZWQuY2hhaW4oKS5mb2N1cygpLnVuc2V0TGluaygpLnJ1bigpOyByZXR1cm47IH1cbiAgICBlZC5jaGFpbigpLmZvY3VzKCkuZXh0ZW5kTWFya1JhbmdlKCdsaW5rJykuc2V0TGluayh7IGhyZWY6IHVybCB9KS5ydW4oKTtcbiAgfTtcblxuICAvLyB2MDAuMDY4IFx1MjAxNCBZb3V0dWJlIFx1Qzc4NFx1QkNBMFx1QjREQy5cbiAgY29uc3QgYWRkWW91dHViZSA9ICgpID0+IHtcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cucHJvbXB0KCdZb3VUdWJlIFVSTCcsICdodHRwczovL3lvdXR1LmJlLy4uLicpO1xuICAgIGlmICghdXJsKSByZXR1cm47XG4gICAgdHJ5IHsgZWQuY2hhaW4oKS5mb2N1cygpLnNldFlvdXR1YmVWaWRlbyh7IHNyYzogdXJsLCB3aWR0aDogNjQwLCBoZWlnaHQ6IDM2MCB9KS5ydW4oKTsgfSBjYXRjaCB7fVxuICB9O1xuICAvLyBcdUQ0NUMgXHVDMEJEXHVDNzg1LlxuICBjb25zdCBpbnNlcnRUYWJsZSA9ICgpID0+IHtcbiAgICB0cnkgeyBlZC5jaGFpbigpLmZvY3VzKCkuaW5zZXJ0VGFibGUoeyByb3dzOiAzLCBjb2xzOiAzLCB3aXRoSGVhZGVyUm93OiB0cnVlIH0pLnJ1bigpOyB9IGNhdGNoIHt9XG4gIH07XG4gIC8vIFx1RDE0RFx1QzJBNFx1RDJCOCBcdUMwQzlcdUMwQzEuXG4gIGNvbnN0IHBpY2tDb2xvciA9ICgpID0+IHtcbiAgICBjb25zdCBjb2xvciA9IHdpbmRvdy5wcm9tcHQoJ1x1RDE0RFx1QzJBNFx1RDJCOCBcdUMwQzlcdUMwQzEgKGhleCBcdUI2MTBcdUIyOTQgQ1NTIFx1QkNDMFx1QzIxOCknLCAnIzkyNDAwRScpO1xuICAgIGlmICghY29sb3IpIHJldHVybjtcbiAgICB0cnkgeyBlZC5jaGFpbigpLmZvY3VzKCkuc2V0Q29sb3IoY29sb3IpLnJ1bigpOyB9IGNhdGNoIHt9XG4gIH07XG5cbiAgY29uc3QgQnRuID0gKHsgY21kLCBsYWJlbCwgYWN0aXZlLCBkaXNhYmxlZCwgc2hvcnRjdXQgfSkgPT4gKFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgb25DbGljaz17Y21kfVxuICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgYXJpYS1wcmVzc2VkPXthY3RpdmUgfHwgZmFsc2V9XG4gICAgICBhcmlhLWxhYmVsPXtsYWJlbCArIChzaG9ydGN1dCA/IGAgKCR7c2hvcnRjdXR9KWAgOiAnJyl9XG4gICAgICB0aXRsZT17c2hvcnRjdXQgPyBgJHtsYWJlbH0gXHUwMEI3ICR7c2hvcnRjdXR9YCA6IGxhYmVsfVxuICAgICAgY2xhc3NOYW1lPXtgdHQtYnRuICR7YWN0aXZlID8gJ29uJyA6ICcnfWB9PlxuICAgICAge2xhYmVsfVxuICAgIDwvYnV0dG9uPlxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2B0aXB0YXAtd3JhcCB0aXB0YXAtJHtwcmVzZXR9YH0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpcHRhcC10b29sYmFyXCIgcm9sZT1cInRvb2xiYXJcIiBhcmlhLWxhYmVsPVwiXHVDMTFDXHVDMkREIFx1QjNDNFx1QUQ2Q1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWdyb3VwXCI+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIkgxXCIgc2hvcnRjdXQ9XCJcdTIzMThcdTIzMjUxXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2hlYWRpbmcnLCB7IGxldmVsOiAxIH0pfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVIZWFkaW5nKHsgbGV2ZWw6IDEgfSkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIkgyXCIgc2hvcnRjdXQ9XCJcdTIzMThcdTIzMjUyXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2hlYWRpbmcnLCB7IGxldmVsOiAyIH0pfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVIZWFkaW5nKHsgbGV2ZWw6IDIgfSkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIkgzXCIgc2hvcnRjdXQ9XCJcdTIzMThcdTIzMjUzXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2hlYWRpbmcnLCB7IGxldmVsOiAzIH0pfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVIZWFkaW5nKHsgbGV2ZWw6IDMgfSkucnVuKCkpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZ3JvdXBcIj5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiQlwiIHNob3J0Y3V0PVwiXHUyMzE4QlwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdib2xkJyl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnRvZ2dsZUJvbGQoKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiSVwiIHNob3J0Y3V0PVwiXHUyMzE4SVwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdpdGFsaWMnKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlSXRhbGljKCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlVcIiBzaG9ydGN1dD1cIlx1MjMxOFVcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgndW5kZXJsaW5lJyl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnRvZ2dsZVVuZGVybGluZSgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJTXCIgc2hvcnRjdXQ9XCJcdTIzMThcdTIxRTdYXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ3N0cmlrZScpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVTdHJpa2UoKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyNzBGXCIgc2hvcnRjdXQ9XCJcdUQ2MTVcdUFEMTFcdUQzOUNcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnaGlnaGxpZ2h0Jyl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnRvZ2dsZUhpZ2hsaWdodCgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCI8Lz5cIiBzaG9ydGN1dD1cIlx1MjMxOEVcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnY29kZScpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVDb2RlKCkucnVuKCkpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZ3JvdXBcIj5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiWFx1MDBCMlwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdzdXBlcnNjcmlwdCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVTdXBlcnNjcmlwdCgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJYXHUyMDgyXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ3N1YnNjcmlwdCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVTdWJzY3JpcHQoKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHVEODNDXHVERkE4XCIgc2hvcnRjdXQ9XCJcdUQxNERcdUMyQTRcdUQyQjggXHVDMEM5XHVDMEMxXCIgY21kPXtwaWNrQ29sb3J9Lz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZGl2aWRlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0dC1ncm91cFwiPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdTIwMjJcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnYnVsbGV0TGlzdCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVCdWxsZXRMaXN0KCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIjEuXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ29yZGVyZWRMaXN0Jyl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnRvZ2dsZU9yZGVyZWRMaXN0KCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjYxMFwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCd0YXNrTGlzdCcpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVUYXNrTGlzdCgpLnJ1bigpKX0vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdTI3NURcIlxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZSgnYmxvY2txdW90ZScpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS50b2dnbGVCbG9ja3F1b3RlKCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cInsgfVwiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKCdjb2RlQmxvY2snKX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkudG9nZ2xlQ29kZUJsb2NrKCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjAxNFwiXG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnNldEhvcml6b250YWxSdWxlKCkucnVuKCkpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZ3JvdXBcIj5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyMUU0XCIgc2hvcnRjdXQ9XCJcdUM2N0NcdUNBQkQgXHVDODE1XHVCODJDXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoeyB0ZXh0QWxpZ246ICdsZWZ0JyB9KX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkuc2V0VGV4dEFsaWduKCdsZWZ0JykucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjFENFwiIHNob3J0Y3V0PVwiXHVBQzAwXHVDNkI0XHVCMzcwIFx1QzgxNVx1QjgyQ1wiXG4gICAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlKHsgdGV4dEFsaWduOiAnY2VudGVyJyB9KX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkuc2V0VGV4dEFsaWduKCdjZW50ZXInKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyMUU1XCIgc2hvcnRjdXQ9XCJcdUM2MjRcdUI5NzhcdUNBQkQgXHVDODE1XHVCODJDXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoeyB0ZXh0QWxpZ246ICdyaWdodCcgfSl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnNldFRleHRBbGlnbigncmlnaHQnKS5ydW4oKSl9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyMjYzXCIgc2hvcnRjdXQ9XCJcdUM1OTFcdUNBQkQgXHVDODE1XHVCODJDXCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoeyB0ZXh0QWxpZ246ICdqdXN0aWZ5JyB9KX1cbiAgICAgICAgICAgIGNtZD17KCkgPT4gY2FuKGUgPT4gZS5jaGFpbigpLmZvY3VzKCkuc2V0VGV4dEFsaWduKCdqdXN0aWZ5JykucnVuKCkpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR0LWRpdmlkZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZ3JvdXBcIj5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHVEODNEXHVERDE3XCJcbiAgICAgICAgICAgIGFjdGl2ZT17aXNBY3RpdmUoJ2xpbmsnKX1cbiAgICAgICAgICAgIGNtZD17YWRkTGlua30vPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdUQ4M0RcdURDRkEgWVRcIiBzaG9ydGN1dD1cIllvdVR1YmVcIiBjbWQ9e2FkZFlvdXR1YmV9Lz5cbiAgICAgICAgICA8QnRuIGxhYmVsPVwiXHUyMjlFIFx1RDQ1Q1wiIGNtZD17aW5zZXJ0VGFibGV9Lz5cbiAgICAgICAgICB7KHByZXNldCA9PT0gXCJjb2x1bW5cIiB8fCBwcmVzZXQgPT09IFwicmljaFwiKSAmJiAoXG4gICAgICAgICAgICA8QnRuIGxhYmVsPXt1cGxvYWRpbmdJbWFnZSA/IFwiXHUyM0YzIFx1QzVDNVx1Qjg1Q1x1QjREQyBcdUM5MTFcdTIwMjZcIiA6IFwiXHVEODNEXHVEREJDIFx1QkNGOFx1QkIzOCBcdUM3NzRcdUJCRjhcdUM5QzBcIn1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3VwbG9hZGluZ0ltYWdlfVxuICAgICAgICAgICAgICBjbWQ9e2luc2VydElubGluZUltYWdlfS8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHQtZGl2aWRlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0dC1ncm91cFwiPlxuICAgICAgICAgIDxCdG4gbGFiZWw9XCJcdTIxQjZcIiBzaG9ydGN1dD1cIlx1MjMxOFpcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFlZD8uY2FuKCkudW5kbygpfVxuICAgICAgICAgICAgY21kPXsoKSA9PiBjYW4oZSA9PiBlLmNoYWluKCkuZm9jdXMoKS51bmRvKCkucnVuKCkpfS8+XG4gICAgICAgICAgPEJ0biBsYWJlbD1cIlx1MjFCN1wiIHNob3J0Y3V0PVwiXHUyMzE4XHUyMUU3WlwiXG4gICAgICAgICAgICBkaXNhYmxlZD17IWVkPy5jYW4oKS5yZWRvKCl9XG4gICAgICAgICAgICBjbWQ9eygpID0+IGNhbihlID0+IGUuY2hhaW4oKS5mb2N1cygpLnJlZG8oKS5ydW4oKSl9Lz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgcmVmPXtob3N0fSBjbGFzc05hbWU9XCJ0aXB0YXAtaG9zdFwiLz5cbiAgICAgIHtwcmVzZXQgPT09IFwiY29sdW1uXCIgJiYgKFxuICAgICAgICA8cCBjbGFzc05hbWU9XCJkaW0tMiBtb25vXCIgc3R5bGU9e3tmb250U2l6ZToxMCwgbWFyZ2luVG9wOjYsIGxldHRlclNwYWNpbmc6JzAuMWVtJ319PlxuICAgICAgICAgIFx1QkNGOFx1QkIzOCBcdUM3NzRcdUJCRjhcdUM5QzBcdUIyOTQgXHVCNERDXHVCNzk4XHVBREY4XHVCODVDIFx1Qzc5MFx1QzcyMFx1Qjg2RFx1QUM4QyBcdUM3NzRcdUIzRDlcdUQ1NjAgXHVDMjE4IFx1Qzc4OFx1QzJCNVx1QjJDOFx1QjJFNC4gXHVDNzc0XHVCQkY4XHVDOUMwXHVCOTdDIFx1QjA0Q1x1QzVCNCBcdUM2RDBcdUQ1NThcdUIyOTQgXHVDNzA0XHVDRTU4XHVCODVDIFx1QjE5M1x1QzczQ1x1QzEzOFx1QzY5NC5cbiAgICAgICAgPC9wPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IFRpcHRhcEVkaXRvciB9KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQU9BLE1BQU0sZUFBZSxDQUFDLEVBQUUsU0FBUyxVQUFVLFVBQVUsSUFBSSxVQUFVLFNBQVMsY0FBYyx1REFBZSxNQUFNO0FBQzdHLFFBQU0sT0FBTyxNQUFNLE9BQU8sSUFBSTtBQUM5QixRQUFNLFlBQVksTUFBTSxPQUFPLElBQUk7QUFDbkMsUUFBTSxDQUFDLE9BQU8sUUFBUSxJQUFJLE1BQU0sU0FBUyxRQUFRLE9BQU8sV0FBVyxDQUFDO0FBQ3BFLFFBQU0sQ0FBQyxFQUFFLFdBQVcsSUFBSSxNQUFNLFdBQVcsT0FBSyxJQUFJLEdBQUcsQ0FBQztBQUV0RCxRQUFNLENBQUMsZ0JBQWdCLGlCQUFpQixJQUFJLE1BQU0sU0FBUyxLQUFLO0FBRWhFLFFBQU0sVUFBVSxNQUFNO0FBQ3BCLFFBQUksTUFBTztBQUNYLFVBQU0sSUFBSSxNQUFNLFNBQVMsSUFBSTtBQUM3QixXQUFPLGlCQUFpQixvQkFBb0IsQ0FBQztBQUM3QyxXQUFPLE1BQU0sT0FBTyxvQkFBb0Isb0JBQW9CLENBQUM7QUFBQSxFQUMvRCxHQUFHLENBQUMsS0FBSyxDQUFDO0FBRVYsUUFBTSxVQUFVLE1BQU07QUFDcEIsUUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFFBQVM7QUFDN0IsVUFBTSxJQUFJLE9BQU87QUFDakIsVUFBTSxFQUFFLFFBQVEsWUFBWSxhQUFhLE9BQU8sV0FBVyxJQUFJO0FBSS9ELFVBQU0sYUFBYTtBQUFBLE1BQ2pCLFdBQVcsVUFBVTtBQUFBLFFBQ25CLFNBQVMsRUFBRSxRQUFRLENBQUMsR0FBRyxH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

})();

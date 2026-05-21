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
          window.BGNJ_TOAST.error("\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC \uC2E4\uD328: " + ((err == null ? void 0 : err.message) || err));
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
  ))), /* @__PURE__ */ React.createElement("div", { ref: host, className: "tiptap-host" }), (preset === "column" || preset === "rich") && /* @__PURE__ */ React.createElement("p", { className: "dim-2 mono", style: { fontSize: 10, marginTop: 6, letterSpacing: "0.1em" } }, "\uBCF8\uBB38 \uC774\uBBF8\uC9C0\uB294 \uB4DC\uB798\uADF8\uB85C \uC790\uC720\uB86D\uAC8C \uC774\uB3D9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC774\uBBF8\uC9C0\uB97C \uB04C\uC5B4 \uC6D0\uD558\uB294 \uC704\uCE58\uB85C \uB193\uC73C\uC138\uC694."));
};
Object.assign(window, { TiptapEditor });

})();

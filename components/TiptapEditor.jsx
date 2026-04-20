// 왕사들 공용 Tiptap 에디터
// 두 프리셋:
//   - "simple"  : 커뮤니티 글쓰기용 (본문 이미지 불가, 기본 포맷만)
//   - "column"  : 칼럼용 (본문 내 이미지 + 드래그 위치 이동)
//
// 사용: <TiptapEditor preset="simple" content="..." onUpdate={(html, json, text) => ...} />

const TiptapEditor = ({ preset = "simple", content = "", onUpdate, onReady, placeholder = "내용을 입력하세요..." }) => {
  const host = React.useRef(null);
  const editorRef = React.useRef(null);
  const [ready, setReady] = React.useState(Boolean(window.WSD_TIPTAP));
  const [, forceRender] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    if (ready) return;
    const h = () => setReady(true);
    window.addEventListener('wsd-tiptap-ready', h);
    return () => window.removeEventListener('wsd-tiptap-ready', h);
  }, [ready]);

  React.useEffect(() => {
    if (!ready || !host.current) return;
    const { Editor, StarterKit, Placeholder, Image, Link, Typography, Dropcursor } = window.WSD_TIPTAP;

    const extensions = [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Typography,
    ];
    if (preset === "column") {
      extensions.push(
        Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: 'tiptap-img' } }),
        Dropcursor.configure({ color: '#D4AF37', width: 2 }),
      );
    }

    const editor = new Editor({
      element: host.current,
      extensions,
      content,
      editorProps: {
        attributes: {
          class: 'tiptap-editor',
          'aria-label': '본문 에디터 — 마크다운 단축키 지원',
        },
      },
      onUpdate: ({ editor }) => {
        onUpdate?.(editor.getHTML(), editor.getJSON(), editor.getText());
        forceRender();
      },
      onSelectionUpdate: () => forceRender(),
    });
    editorRef.current = editor;
    onReady?.(editor);
    return () => { try { editor.destroy(); } catch (e) {} };
  }, [ready, preset]);

  if (!ready) {
    return (
      <div className="tiptap-host" style={{minHeight:320, display:'grid', placeItems:'center'}}>
        <span className="mono dim-2" style={{fontSize:11, letterSpacing:'0.2em'}}>에디터 로딩 중…</span>
      </div>
    );
  }

  const ed = editorRef.current;
  const can = (fn) => ed && fn(ed);
  const isActive = (name, attrs) => ed?.isActive?.(name, attrs) || false;

  // 본문 내 이미지 삽입 (column preset 전용 — 파일 선택 또는 URL)
  const insertInlineImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const f = input.files?.[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => ed.chain().focus().setImage({ src: r.result, alt: f.name }).run();
      r.readAsDataURL(f);
    };
    input.click();
  };

  const addLink = () => {
    const prev = ed.getAttributes('link').href;
    const url = window.prompt('링크 URL', prev || 'https://');
    if (url === null) return;
    if (url === '') { ed.chain().focus().unsetLink().run(); return; }
    ed.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const Btn = ({ cmd, label, active, disabled, shortcut }) => (
    <button
      type="button"
      onClick={cmd}
      disabled={disabled}
      aria-pressed={active || false}
      aria-label={label + (shortcut ? ` (${shortcut})` : '')}
      title={shortcut ? `${label} · ${shortcut}` : label}
      className={`tt-btn ${active ? 'on' : ''}`}>
      {label}
    </button>
  );

  return (
    <div className={`tiptap-wrap tiptap-${preset}`}>
      <div className="tiptap-toolbar" role="toolbar" aria-label="서식 도구">
        <div className="tt-group">
          <Btn label="H1" shortcut="⌘⌥1"
            active={isActive('heading', { level: 1 })}
            cmd={() => can(e => e.chain().focus().toggleHeading({ level: 1 }).run())}/>
          <Btn label="H2" shortcut="⌘⌥2"
            active={isActive('heading', { level: 2 })}
            cmd={() => can(e => e.chain().focus().toggleHeading({ level: 2 }).run())}/>
          <Btn label="H3" shortcut="⌘⌥3"
            active={isActive('heading', { level: 3 })}
            cmd={() => can(e => e.chain().focus().toggleHeading({ level: 3 }).run())}/>
        </div>
        <div className="tt-divider" aria-hidden="true"/>
        <div className="tt-group">
          <Btn label="B" shortcut="⌘B"
            active={isActive('bold')}
            cmd={() => can(e => e.chain().focus().toggleBold().run())}/>
          <Btn label="I" shortcut="⌘I"
            active={isActive('italic')}
            cmd={() => can(e => e.chain().focus().toggleItalic().run())}/>
          <Btn label="S" shortcut="⌘⇧X"
            active={isActive('strike')}
            cmd={() => can(e => e.chain().focus().toggleStrike().run())}/>
          <Btn label="</>" shortcut="⌘E"
            active={isActive('code')}
            cmd={() => can(e => e.chain().focus().toggleCode().run())}/>
        </div>
        <div className="tt-divider" aria-hidden="true"/>
        <div className="tt-group">
          <Btn label="•"
            active={isActive('bulletList')}
            cmd={() => can(e => e.chain().focus().toggleBulletList().run())}/>
          <Btn label="1."
            active={isActive('orderedList')}
            cmd={() => can(e => e.chain().focus().toggleOrderedList().run())}/>
          <Btn label="❝"
            active={isActive('blockquote')}
            cmd={() => can(e => e.chain().focus().toggleBlockquote().run())}/>
          <Btn label="—"
            cmd={() => can(e => e.chain().focus().setHorizontalRule().run())}/>
        </div>
        <div className="tt-divider" aria-hidden="true"/>
        <div className="tt-group">
          <Btn label="🔗"
            active={isActive('link')}
            cmd={addLink}/>
          {preset === "column" && (
            <Btn label="🖼 본문 이미지"
              cmd={insertInlineImage}/>
          )}
        </div>
        <div className="tt-divider" aria-hidden="true"/>
        <div className="tt-group">
          <Btn label="↶" shortcut="⌘Z"
            disabled={!ed?.can().undo()}
            cmd={() => can(e => e.chain().focus().undo().run())}/>
          <Btn label="↷" shortcut="⌘⇧Z"
            disabled={!ed?.can().redo()}
            cmd={() => can(e => e.chain().focus().redo().run())}/>
        </div>
      </div>
      <div ref={host} className="tiptap-host"/>
      {preset === "column" && (
        <p className="dim-2 mono" style={{fontSize:10, marginTop:6, letterSpacing:'0.1em'}}>
          본문 이미지는 드래그로 자유롭게 이동할 수 있습니다. 이미지를 끌어 원하는 위치로 놓으세요.
        </p>
      )}
    </div>
  );
};

Object.assign(window, { TiptapEditor });

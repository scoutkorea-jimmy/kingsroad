// 뱅기노자 공용 Tiptap 에디터
// 두 프리셋:
//   - "simple"  : 커뮤니티 글쓰기용 (본문 이미지 불가, 기본 포맷만)
//   - "column"  : 칼럼용 (본문 내 이미지 + 드래그 위치 이동)
//
// 사용: <TiptapEditor preset="simple" content="..." onUpdate={(html, json, text) => ...} />

const TiptapEditor = ({ preset = "simple", content = "", onUpdate, onReady, placeholder = "내용을 입력하세요..." }) => {
  const host = React.useRef(null);
  const editorRef = React.useRef(null);
  const [ready, setReady] = React.useState(Boolean(window.BGNJ_TIPTAP));
  const [, forceRender] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    if (ready) return;
    const h = () => setReady(true);
    window.addEventListener('wsd-tiptap-ready', h);
    return () => window.removeEventListener('wsd-tiptap-ready', h);
  }, [ready]);

  React.useEffect(() => {
    if (!ready || !host.current) return;
    const T = window.BGNJ_TIPTAP;
    const { Editor, StarterKit, Placeholder, Image, Link, Typography, Dropcursor } = T;

    const extensions = [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // codeBlock 은 StarterKit 의 기본값(true) 사용 — v00.068.
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Typography,
    ];
    // v00.068: 무료 extension 풍부화 — 모든 preset 에서 사용 가능.
    if (T.Underline)   extensions.push(T.Underline);
    if (T.Highlight)   extensions.push(T.Highlight.configure({ multicolor: true }));
    if (T.TextAlign)   extensions.push(T.TextAlign.configure({ types: ['heading', 'paragraph'] }));
    if (T.Subscript)   extensions.push(T.Subscript);
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
    // 본문 인라인 이미지 — column / rich preset 에서 활성. simple 은 첨부 슬라이드만 사용.
    if (preset === "column" || preset === "rich") {
      extensions.push(
        Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: 'tiptap-img' } }),
        Dropcursor.configure({ color: 'var(--primary)', width: 2 }),
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

  // v00.068 — Youtube 임베드.
  const addYoutube = () => {
    const url = window.prompt('YouTube URL', 'https://youtu.be/...');
    if (!url) return;
    try { ed.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run(); } catch {}
  };
  // 표 삽입.
  const insertTable = () => {
    try { ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); } catch {}
  };
  // 텍스트 색상.
  const pickColor = () => {
    const color = window.prompt('텍스트 색상 (hex 또는 CSS 변수)', '#92400E');
    if (!color) return;
    try { ed.chain().focus().setColor(color).run(); } catch {}
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
          <Btn label="U" shortcut="⌘U"
            active={isActive('underline')}
            cmd={() => can(e => e.chain().focus().toggleUnderline().run())}/>
          <Btn label="S" shortcut="⌘⇧X"
            active={isActive('strike')}
            cmd={() => can(e => e.chain().focus().toggleStrike().run())}/>
          <Btn label="✏" shortcut="형광펜"
            active={isActive('highlight')}
            cmd={() => can(e => e.chain().focus().toggleHighlight().run())}/>
          <Btn label="</>" shortcut="⌘E"
            active={isActive('code')}
            cmd={() => can(e => e.chain().focus().toggleCode().run())}/>
        </div>
        <div className="tt-divider" aria-hidden="true"/>
        <div className="tt-group">
          <Btn label="X²"
            active={isActive('superscript')}
            cmd={() => can(e => e.chain().focus().toggleSuperscript().run())}/>
          <Btn label="X₂"
            active={isActive('subscript')}
            cmd={() => can(e => e.chain().focus().toggleSubscript().run())}/>
          <Btn label="🎨" shortcut="텍스트 색상" cmd={pickColor}/>
        </div>
        <div className="tt-divider" aria-hidden="true"/>
        <div className="tt-group">
          <Btn label="•"
            active={isActive('bulletList')}
            cmd={() => can(e => e.chain().focus().toggleBulletList().run())}/>
          <Btn label="1."
            active={isActive('orderedList')}
            cmd={() => can(e => e.chain().focus().toggleOrderedList().run())}/>
          <Btn label="☐"
            active={isActive('taskList')}
            cmd={() => can(e => e.chain().focus().toggleTaskList().run())}/>
          <Btn label="❝"
            active={isActive('blockquote')}
            cmd={() => can(e => e.chain().focus().toggleBlockquote().run())}/>
          <Btn label="{ }"
            active={isActive('codeBlock')}
            cmd={() => can(e => e.chain().focus().toggleCodeBlock().run())}/>
          <Btn label="—"
            cmd={() => can(e => e.chain().focus().setHorizontalRule().run())}/>
        </div>
        <div className="tt-divider" aria-hidden="true"/>
        <div className="tt-group">
          <Btn label="⇤" shortcut="왼쪽 정렬"
            active={isActive({ textAlign: 'left' })}
            cmd={() => can(e => e.chain().focus().setTextAlign('left').run())}/>
          <Btn label="⇔" shortcut="가운데 정렬"
            active={isActive({ textAlign: 'center' })}
            cmd={() => can(e => e.chain().focus().setTextAlign('center').run())}/>
          <Btn label="⇥" shortcut="오른쪽 정렬"
            active={isActive({ textAlign: 'right' })}
            cmd={() => can(e => e.chain().focus().setTextAlign('right').run())}/>
          <Btn label="≣" shortcut="양쪽 정렬"
            active={isActive({ textAlign: 'justify' })}
            cmd={() => can(e => e.chain().focus().setTextAlign('justify').run())}/>
        </div>
        <div className="tt-divider" aria-hidden="true"/>
        <div className="tt-group">
          <Btn label="🔗"
            active={isActive('link')}
            cmd={addLink}/>
          <Btn label="📺 YT" shortcut="YouTube" cmd={addYoutube}/>
          <Btn label="⊞ 표" cmd={insertTable}/>
          {(preset === "column" || preset === "rich") && (
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

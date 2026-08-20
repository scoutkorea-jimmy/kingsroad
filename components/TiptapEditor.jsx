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
  // v00.138 — 본문 이미지 R2 업로드 상태. early return 이전에 선언 (Rules of Hooks).
  const [uploadingImage, setUploadingImage] = React.useState(false);

  React.useEffect(() => {
    if (ready) return;
    const h = () => setReady(true);
    window.addEventListener('wsd-tiptap-ready', h);
    return () => window.removeEventListener('wsd-tiptap-ready', h);
  }, [ready]);

  React.useEffect(() => {
    if (!ready || !host.current) return;
    const T = window.BGNJ_TIPTAP;
    const { Editor, StarterKit, Placeholder, Image, Typography } = T;

    // v00.090 — Tiptap 3: StarterKit 이 underline / link / dropcursor 를 기본 포함.
    // 이전 standalone Underline / Link / Dropcursor 는 제거 + 옵션을 StarterKit.configure 로 이전.
    const extensions = [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } },
        dropcursor: { color: 'var(--primary)', width: 2 },
        // codeBlock / underline 등 기타 기본값 (true) 사용.
      }),
      Placeholder.configure({ placeholder }),
      Typography,
    ];
    // v00.068: 무료 extension 풍부화 — 모든 preset 에서 사용 가능. (v3 호환)
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
    // (v3) Dropcursor 는 StarterKit 에 포함되어 자동 활성. Image 만 standalone.
    if (preset === "column" || preset === "rich") {
      extensions.push(
        Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: 'tiptap-img' } }),
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
        // v00.139 — Enter 1회=<br>(hard break, 공백 없음), Enter 2회=<p>(새 단락, 공백 1줄).
        // 사용자 요청 '엔터 1번 치면 줄바꿈, 엔터 2번 치면 줄바꿈+공백 1줄'. ProseMirror 기본은 반대 (Enter=새 단락).
        // 단락(paragraph) 안에서만 적용 — 헤딩/리스트/코드블록/인용/표는 default (Enter=split block) 유지.
        handleKeyDown: (view, event) => {
          if (event.key !== 'Enter' || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return false;
          const { state } = view;
          const { $from, empty } = state.selection;
          if (!empty) return false;
          if ($from.parent.type.name !== 'paragraph') return false;
          const schema = state.schema;
          if (!schema.nodes.hardBreak) return false;
          const before = $from.nodeBefore;
          // 직전 노드가 hardBreak 면 두 번째 Enter — hardBreak 제거 + 단락 분할.
          if (before && before.type.name === 'hardBreak') {
            event.preventDefault();
            const tr = state.tr.delete($from.pos - before.nodeSize, $from.pos);
            const splitPos = tr.selection.from;
            tr.split(splitPos);
            view.dispatch(tr.scrollIntoView());
            return true;
          }
          // 첫 번째 Enter — hard break 삽입.
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

          // v00.294.006 — 붙여넣기로 들어오는 이미지를 R2 로 올린다.
          // v00.138 에서 '본문 이미지' 버튼은 base64 를 버리고 R2 업로드로 바꿨는데,
          // 붙여넣기 경로는 그대로 남아 있었다. Image 확장이 allowBase64 이고
          // sanitizer 도 data:image/* 를 허용해서, 스크린샷을 붙여넣으면 수 MB 짜리
          // base64 가 본문에 박힌다 → ① 1초마다 localStorage 임시저장이 용량 초과로
          // 조용히 실패하고 ② 발행 시 D1 row 가 통째로 비대해진다.
          // 파일로 오는 붙여넣기(스크린샷·이미지 복사)가 이 경로의 대부분이다.
          const pastedFiles = Array.from(cd.files || []).filter((f) => f.type.startsWith('image/'));
          if (pastedFiles.length > 0) {
            event.preventDefault();
            const folder = preset === 'column' ? 'column-images' : 'post-images';
            (async () => {
              setUploadingImage(true);
              for (const f of pastedFiles) {
                try {
                  const { url } = await window.BGNJ_MEDIA.uploadFile(f, { folder, maxBytes: 10 * 1024 * 1024 });
                  editor.chain().focus().setImage({ src: url, alt: f.name || '붙여넣은 이미지' }).run();
                } catch (err) {
                  // 조용한 base64 폴백을 두지 않는다 — 그게 바로 위 ①② 를 부른다.
                  window.BGNJ_TOAST?.error?.(`이미지 업로드 실패 — '${f.name || '붙여넣은 이미지'}' 는 본문에 넣지 못했습니다. 잠시 후 '🖼 본문 이미지' 버튼으로 다시 시도해 주세요.`);
                }
              }
              setUploadingImage(false);
            })();
            return true;
          }

          const html = cd.getData('text/html');
          if (html) {
            // 외부 문서에서 복사하면 text/html 안에 base64 <img> 가 딸려 오기도 한다.
            // 파일이 아니라 문자열이라 업로드할 대상이 없다 — 그 이미지만 걷어내고 글은 살린다.
            if (/<img[^>]+src\s*=\s*["']data:image\//i.test(html)) {
              event.preventDefault();
              const stripped = html.replace(/<img[^>]+src\s*=\s*["']data:image\/[^>]*>/gi, '');
              editor.commands.insertContent(stripped);
              window.BGNJ_TOAST?.error?.('붙여넣은 글 안의 이미지는 제외했습니다. 용량이 매우 커서 글이 저장되지 않을 수 있어 막았습니다 — 이미지는 \'🖼 본문 이미지\' 버튼으로 올려 주세요.');
              return true;
            }
            return false; // HTML 이 있으면 default 처리.
          }
          const text = cd.getData('text/plain');
          if (!text || !/\n/.test(text)) return false; // 줄바꿈 없으면 default.
          event.preventDefault();
          const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
          const out = text
            .split(/\n{2,}/)
            .map((para) => '<p>' + esc(para).split('\n').join('<br/>') + '</p>')
            .join('');
          editor.commands.insertContent(out);
          return true;
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
    return () => { try { editor.destroy(); } catch (_e) { console.warn('[bgnj] TiptapEditor.jsx:168 오류(무시하고 진행)', _e); } };
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

  // 본문 내 이미지 삽입 — v00.138 R2 업로드 사용. 이전엔 FileReader → dataURI base64 인라인이었지만
  // ① D1 row 가 비대해지고 ② sanitize/transport 비용이 크고 ③ 사용자 보고 "이미지는 파일로 업로드" 요구.
  // 업로드 실패 시 사용자에게 명시적으로 알림 (silent dataURI 폴백 없음 — 데이터 비대 방지).
  const insertInlineImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      const folder = preset === 'column' ? 'column-images' : 'post-images';
      try {
        setUploadingImage(true);
        const { url } = await window.BGNJ_MEDIA.uploadFile(f, { folder, maxBytes: 10 * 1024 * 1024 });
        ed.chain().focus().setImage({ src: url, alt: f.name }).run();
      } catch (err) {
        try { window.BGNJ_TOAST.error('이미지 업로드 실패: ' + (err?.message || err)); } catch (_e) { console.warn('[bgnj] TiptapEditor.jsx:199 오류(무시하고 진행)', _e); }
      } finally {
        setUploadingImage(false);
      }
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
    try { ed.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run(); } catch (_e) { console.warn('[bgnj] 스크롤·포커스 (TiptapEditor.jsx:219)', _e); }
  };
  // 표 삽입.
  const insertTable = () => {
    try { ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); } catch (_e) { console.warn('[bgnj] 스크롤·포커스 (TiptapEditor.jsx:223)', _e); }
  };
  // 텍스트 색상.
  const pickColor = () => {
    const color = window.prompt('텍스트 색상 (hex 또는 CSS 변수)', '#92400E');
    if (!color) return;
    try { ed.chain().focus().setColor(color).run(); } catch (_e) { console.warn('[bgnj] 스크롤·포커스 (TiptapEditor.jsx:229)', _e); }
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
            <Btn label={uploadingImage ? "⏳ 업로드 중…" : "🖼 본문 이미지"}
              disabled={uploadingImage}
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
      {(preset === "column" || preset === "rich") && (
        <p className="dim-2 mono" style={{fontSize:10, marginTop:6, letterSpacing:'0.1em'}}>
          본문 이미지는 드래그로 자유롭게 이동할 수 있습니다. 이미지를 끌어 원하는 위치로 놓으세요.
        </p>
      )}
    </div>
  );
};

// (window 노출 제거 — ESM 전환)

// v00.287 ESM (main) — 모듈 export (window 병행).
export { TiptapEditor };

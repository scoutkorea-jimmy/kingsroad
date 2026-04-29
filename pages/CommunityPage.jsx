// 커뮤니티: 목록 + 글 상세 + 글 작성 (Tiptap)
// 등급별 접근 제어: 읽기/쓰기 권한은 카테고리.minLevel / postMinLevel로 판정.

// 공용 훅 — 권한 계산
const useUserLevel = (user) => React.useMemo(() => window.BGNJ_USER_LEVEL(user), [user]);
const getCategoriesForBoard = (boardType) =>
  window.BGNJ_STORES.categories.filter(c => c.boardType === boardType);

// === Hashtag chip input =================================================
const HashtagInput = ({ tags, setTags, max = 10 }) => {
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef(null);

  const commit = (raw) => {
    const t = raw.trim().replace(/^#+/, '').replace(/\s+/g, '');
    if (!t) return;
    if (tags.includes(t)) return;
    if (tags.length >= max) return;
    setTags([...tags, t]);
  };

  const handleKey = (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit(input);
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div>
      <div className="tag-input-wrap" onClick={() => inputRef.current?.focus()}>
        {tags.map((t, i) => (
          <span key={t} className="tag-chip">
            #{t}
            <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}
              aria-label={`${t} 태그 삭제`}>✕</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => { if (input.trim()) { commit(input); setInput(''); } }}
          placeholder={tags.length ? "" : "태그 입력 후 스페이스바 (최대 10개)"}
          aria-label="해시태그 입력"/>
      </div>
      <div className="field-hint" style={{marginTop:6}}>
        스페이스바 · Enter · 쉼표로 태그 구분 · Backspace로 마지막 태그 삭제 · {tags.length}/{max}
      </div>
    </div>
  );
};

// === Image Slider (viewer) ===============================================
const ImageSlider = ({ images, autoplayMs = 4000 }) => {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const prefersReduced = React.useMemo(() =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);

  React.useEffect(() => {
    if (images.length <= 1 || paused || prefersReduced) return;
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), autoplayMs);
    return () => clearInterval(t);
  }, [images.length, paused, autoplayMs, prefersReduced]);

  if (!images.length) return null;
  const go = (i) => setIdx(((i % images.length) + images.length) % images.length);

  return (
    <figure aria-roledescription="carousel" aria-label="첨부 이미지 슬라이드"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="img-slider">
        <div className="img-slider-track" style={{transform: `translateX(-${idx * 100}%)`}}>
          {images.map((img, i) => (
            <div key={i} className="img-slider-slide"
              role="group" aria-roledescription="slide" aria-label={`${i+1} / ${images.length}`}
              aria-hidden={i !== idx}>
              <img src={img.dataUrl || img.src} alt={img.alt || img.name || `이미지 ${i+1}`}/>
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" className="img-slider-nav prev" onClick={() => go(idx - 1)} aria-label="이전 이미지">‹</button>
            <button type="button" className="img-slider-nav next" onClick={() => go(idx + 1)} aria-label="다음 이미지">›</button>
            <div className="img-slider-caption">
              <span aria-live="polite">{idx + 1} / {images.length}</span>
            </div>
            <div className="img-slider-dots" role="tablist" aria-label="슬라이드 선택">
              {images.map((_, i) => (
                <button key={i} type="button" role="tab"
                  aria-current={i === idx}
                  aria-label={`${i+1}번 슬라이드`}
                  onClick={() => setIdx(i)}/>
              ))}
            </div>
          </>
        )}
      </div>
      {images[idx]?.caption && (
        <figcaption className="dim" style={{fontSize:12, marginTop:8, textAlign:'center'}}>
          {images[idx].caption}
        </figcaption>
      )}
    </figure>
  );
};

// === Image picker (editor side) — up to `max` images with thumbnails =====
const ImageAttacher = ({ images, setImages, max = 10 }) => {
  const inputRef = React.useRef(null);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    const remaining = max - images.length;
    if (remaining <= 0) return;
    const toAdd = files.slice(0, remaining);
    const results = await Promise.all(toAdd.map(f => new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve({ dataUrl: r.result, name: f.name, size: f.size, alt: f.name.replace(/\.[^.]+$/, '') });
      r.readAsDataURL(f);
    })));
    setImages([...images, ...results]);
  };

  const remove = (i) => setImages(images.filter((_, j) => j !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = images.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <div className="field-label">첨부 이미지 <span className="dim-2">({images.length}/{max})</span></div>
        <button type="button" className="btn btn-small"
          disabled={images.length >= max}
          onClick={() => inputRef.current?.click()}>
          + 이미지 선택
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple
        style={{display:'none'}}
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}/>
      {images.length > 0 ? (
        <div className="img-thumbs">
          {images.map((img, i) => (
            <div key={i} className="img-thumb">
              <img src={img.dataUrl || img.src} alt={img.alt || `thumb-${i}`}/>
              <span className="img-thumb-order">{String(i + 1).padStart(2, '0')}</span>
              <button type="button" className="img-thumb-remove"
                onClick={() => remove(i)}
                aria-label={`${i+1}번 이미지 제거`}>✕</button>
              <div style={{position:'absolute', bottom:4, right:4, display:'flex', gap:2}}>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                  aria-label={`${i+1}번 이미지 앞으로`}
                  style={{background:'rgba(0,0,0,0.6)', border:'none', color:'var(--gold)', fontSize:10, padding:'1px 5px', cursor:'pointer', minHeight:0}}>◀</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1}
                  aria-label={`${i+1}번 이미지 뒤로`}
                  style={{background:'rgba(0,0,0,0.6)', border:'none', color:'var(--gold)', fontSize:10, padding:'1px 5px', cursor:'pointer', minHeight:0}}>▶</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="placeholder" style={{aspectRatio:'5/1', fontSize:10}}>
          이미지를 첨부하면 상세 페이지 하단에 자동 슬라이드로 표시됩니다
        </div>
      )}
    </div>
  );
};

// === Comment tree (다단계 답글, 최대 깊이 MAX_DEPTH) ======================
// @멘션은 본문에 @이름 토큰을 골드 chip 으로 렌더링.
// 답글 트리 — 시각적 들여쓰기 기본 캡(3). 그 이상은 자동 펼침/접기 토글로 노출.
const MAX_VISIBLE_DEPTH = 3;

const renderCommentText = (text) => {
  if (!text) return null;
  // @닉네임 토큰만 가볍게 강조(골드, medium). 본문은 평문 그대로.
  const parts = String(text).split(/(@[\p{L}\p{N}_]+)/gu);
  return parts.map((part, i) => {
    if (part.startsWith('@') && part.length > 1) {
      return <span key={i} className="gold" style={{fontWeight:500}}>{part}</span>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

const CommentTree = ({ comments, user, onDelete, onReply }) => {
  const topLevel = (comments || []).filter((c) => !c.parentId);
  const repliesOf = (parentId) => (comments || []).filter((c) => c.parentId === parentId);
  const [openReplyTo, setOpenReplyTo] = React.useState(null);
  const [draft, setDraft] = React.useState('');

  // 멘션 자동완성 — 댓글 작성자 + 글 댓글에 등장한 모든 닉네임을 후보로.
  const allAuthors = React.useMemo(() => {
    const seen = new Set();
    return (comments || [])
      .map((c) => c.author)
      .filter((n) => n && !seen.has(n) && (seen.add(n) || true));
  }, [comments]);

  const submitReply = (parentId) => {
    onReply?.(parentId, draft);
    setDraft('');
    setOpenReplyTo(null);
  };

  // 깊이 제한을 풀고 (서버는 무제한 허용), 시각만 MAX_VISIBLE_DEPTH 까지 들여쓰기.
  const [expanded, setExpanded] = React.useState({}); // commentId -> true (사용자 펼침 클릭)
  const renderItem = (c, depth = 0) => {
    const children = repliesOf(c.id);
    const canReply = !!user; // 깊이 무관 답글 허용
    const visualDepth = Math.min(depth, MAX_VISIBLE_DEPTH);
    const isDeepCollapsed = depth >= MAX_VISIBLE_DEPTH && !expanded[c.id] && children.length > 0;
    return (
      <li key={c.id} style={{padding:'18px 0', borderBottom: depth === 0 ? '1px solid var(--line)' : 'none'}}>
        <div style={{display:'flex', gap:16, alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
          <div style={{display:'flex', gap:14, alignItems:'center', flexWrap:'wrap'}}>
            {depth > 0 && <span className="dim-2 mono" style={{fontSize:11}}>↳</span>}
            <span className="gold mono" style={{fontSize:12, letterSpacing:'0.1em', display:'inline-flex', alignItems:'center'}}>
              {c.author}
              <AuthorGradeBadge authorId={c.authorId} author={c.author} authorEmail={c.authorEmail}/>
            </span>
            <time className="mono dim-2" style={{fontSize:11}}>{c.date}</time>
          </div>
          <div style={{display:'flex', gap:6, alignItems:'center'}}>
            {canReply && (
              <button type="button" className="btn-ghost"
                onClick={() => {
                  setOpenReplyTo(openReplyTo === c.id ? null : c.id);
                  setDraft(openReplyTo === c.id ? '' : `@${c.author} `);
                }}
                style={{fontSize:11, color:'var(--ink-2)'}}>
                {openReplyTo === c.id ? '취소' : '답글'}
              </button>
            )}
            {!!user && (user.isAdmin || c.authorId === user.id || c.author === user.name) && (
              <button type="button" className="btn-ghost" onClick={() => onDelete?.(c.id)}
                style={{fontSize:11, color:'var(--danger)'}}>삭제</button>
            )}
          </div>
        </div>
        <p style={{fontFamily:'var(--font-reading)', fontSize: depth > 0 ? 14 : 15, lineHeight:1.8, color:'var(--ink)', whiteSpace:'pre-wrap'}}>
          {renderCommentText(c.text)}
        </p>

        {/* 답글 입력 폼 */}
        {openReplyTo === c.id && (
          <form onSubmit={(e) => { e.preventDefault(); submitReply(c.id); }}
            style={{marginTop:10, paddingLeft:24, borderLeft:'2px solid var(--gold-dim)'}}>
            <MentionTextarea
              value={draft}
              onChange={setDraft}
              authors={allAuthors}
              rows={2}
              placeholder={`@${c.author}에게 답글... (@를 입력하면 멘션 자동완성)`}
              style={{marginBottom:8}}/>
            <div style={{display:'flex', justifyContent:'flex-end', gap:6}}>
              <button type="button" className="btn btn-small" onClick={() => { setOpenReplyTo(null); setDraft(''); }}>취소</button>
              <button type="submit" className="btn btn-gold btn-small" disabled={!draft.trim()}>답글 등록</button>
            </div>
          </form>
        )}

        {/* 자식 답글들 — 깊이 캡 도달 전까지 재귀, 도달 후엔 '펼치기' 토글 */}
        {children.length > 0 && (
          isDeepCollapsed ? (
            <button type="button" className="btn-ghost"
              onClick={() => setExpanded((s) => ({ ...s, [c.id]: true }))}
              style={{
                marginTop:10, marginLeft:24, fontSize:11, color:'var(--ink-3)',
                padding:'4px 10px', border:'1px dashed var(--line)',
              }}>
              ↳ 답글 {children.length}개 펼치기
            </button>
          ) : (
            <ol style={{
              listStyle:'none', padding:0,
              margin: depth < MAX_VISIBLE_DEPTH ? '12px 0 0 24px' : '12px 0 0 12px',
              borderLeft:'2px solid var(--line)', paddingLeft:14,
            }}>
              {children.map((r) => renderItem(r, depth + 1))}
              {depth >= MAX_VISIBLE_DEPTH && (
                <li>
                  <button type="button" className="btn-ghost"
                    onClick={() => setExpanded((s) => ({ ...s, [c.id]: false }))}
                    style={{fontSize:11, color:'var(--ink-3)', padding:'4px 10px'}}>
                    ↑ 답글 접기
                  </button>
                </li>
              )}
            </ol>
          )
        )}
      </li>
    );
  };

  return (
    <ol style={{listStyle:'none', padding:0, margin:0}}>
      {topLevel.map((c) => renderItem(c, 0))}
    </ol>
  );
};

// === @멘션 자동완성 textarea =============================================
// 사용자가 @을 입력하면 후보 리스트를 띄우고, 클릭/Enter 로 닉네임을 삽입.
const MentionTextarea = ({ value, onChange, authors, rows = 4, placeholder, style }) => {
  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [active, setActive] = React.useState(0);

  const candidates = React.useMemo(() => {
    if (!open) return [];
    const q = token.toLowerCase();
    return (authors || [])
      .filter((a) => !q || a.toLowerCase().includes(q))
      .slice(0, 6);
  }, [authors, token, open]);

  const detectMention = (text, caret) => {
    // 캐럿 직전에서 가장 가까운 @를 찾고, @ 다음 문자가 공백/줄바꿈이 아닌지 확인.
    const upto = text.slice(0, caret);
    const m = /@([\p{L}\p{N}_]*)$/u.exec(upto);
    if (m) { setToken(m[1]); setOpen(true); setActive(0); }
    else { setOpen(false); setToken(''); }
  };

  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    detectMention(v, e.target.selectionStart || v.length);
  };

  const insertCandidate = (name) => {
    const el = ref.current;
    const caret = el?.selectionStart ?? value.length;
    const before = value.slice(0, caret);
    const after = value.slice(caret);
    const replaced = before.replace(/@([\p{L}\p{N}_]*)$/u, `@${name} `);
    const next = replaced + after;
    onChange(next);
    setOpen(false);
    setToken('');
    // 캐럿을 삽입 끝으로 이동
    setTimeout(() => {
      try {
        const pos = replaced.length;
        el?.focus();
        el?.setSelectionRange(pos, pos);
      } catch {}
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (!open || candidates.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % candidates.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + candidates.length) % candidates.length); }
    else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); insertCandidate(candidates[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div style={{position:'relative'}}>
      <textarea ref={ref} className="field-input" rows={rows}
        value={value} onChange={handleChange} onKeyDown={handleKeyDown}
        placeholder={placeholder} style={style}/>
      {open && candidates.length > 0 && (
        <ul role="listbox" aria-label="멘션 후보"
          style={{
            position:'absolute', zIndex:50, top:'100%', left:0, marginTop:2,
            background:'var(--bg)', border:'1px solid var(--line)',
            listStyle:'none', padding:4, minWidth:180, maxWidth:280,
            boxShadow:'0 4px 12px rgba(0,0,0,0.08)',
          }}>
          {candidates.map((name, i) => (
            <li key={name} role="option" aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); insertCandidate(name); }}
              style={{
                padding:'6px 10px', fontSize:13, cursor:'pointer',
                background: i === active ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: i === active ? 'var(--gold)' : 'var(--ink)',
              }}>
              @{name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// === Community Page ======================================================
const POSTS_PER_PAGE = 10;

const CommunityPage = ({ go, postId, setPostId, user }) => {
  const userLevel = useUserLevel(user);
  const categories = React.useMemo(() => getCategoriesForBoard("community"), [postId]);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [tab, setTab] = React.useState("all");
  const [activePrefix, setActivePrefix] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("latest");
  const [writing, setWriting] = React.useState(null);
  const [page, setPage] = React.useState(1);

  // 알림 벨 / 외부 진입에서 stash해 둔 postId가 있으면 자동으로 상세로 이동
  React.useEffect(() => {
    let pending = null;
    try { pending = sessionStorage.getItem('bgnj_pending_post_id'); } catch {}
    if (pending) {
      try { sessionStorage.removeItem('bgnj_pending_post_id'); } catch {}
      setPostId(pending);
    }
    // 내비 메가메뉴에서 들어온 게시판 ID
    let pendingBoard = null;
    try { pendingBoard = sessionStorage.getItem('bgnj_pending_board_id'); } catch {}
    if (pendingBoard) {
      try { sessionStorage.removeItem('bgnj_pending_board_id'); } catch {}
      setTab(pendingBoard);
    }
  }, []);

  // 서버 게시글 동기화 — 페이지 진입 시 1회 + 'bgnj-posts-refresh' 이벤트마다 재렌더
  React.useEffect(() => {
    window.BGNJ_COMMUNITY.refreshPosts?.();
    const onRefresh = () => setRefreshKey((v) => v + 1);
    window.addEventListener('bgnj-posts-refresh', onRefresh);
    return () => window.removeEventListener('bgnj-posts-refresh', onRefresh);
  }, []);

  const allPosts = React.useMemo(() => {
    return window.BGNJ_COMMUNITY.listPosts();
  }, [refreshKey]);

  // ─── 모든 hook은 early return 전에 선언 ───────────────────────────────
  const visibleCats = categories.filter(c => userLevel >= (c.minLevel ?? 0));
  const currentBoard = categories.find(c => c.id === tab);
  const boardPrefixes = currentBoard?.prefixes || [];
  const canReadPost = React.useCallback((post) => {
    if (!post) return false;
    const cat = categories.find(c => c.id === post.categoryId) || categories.find(c => c.label === post.category);
    return !cat || userLevel >= (cat.minLevel ?? 0);
  }, [categories, userLevel]);

  React.useEffect(() => { setActivePrefix(""); }, [tab]);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    const base = allPosts.filter(p => {
      const cat = categories.find(c => c.id === p.categoryId) || categories.find(c => c.label === p.category);
      if (cat && userLevel < (cat.minLevel ?? 0)) return false;
      if (tab !== "all" && (p.categoryId !== tab && cat?.id !== tab)) return false;
      if (q && !p.title.toLowerCase().includes(q) && !String(p.body?.text || '').toLowerCase().includes(q)) return false;
      if (activePrefix && p.prefix !== activePrefix) return false;
      return true;
    });
    if (sort === "views") return [...base].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    if (sort === "replies") return [...base].sort((a, b) => (b.replies ?? 0) - (a.replies ?? 0));
    if (sort === "likes") return [...base].sort((a, b) => (Array.isArray(b.likes) ? b.likes.length : 0) - (Array.isArray(a.likes) ? a.likes.length : 0));
    return base;
  }, [allPosts, categories, userLevel, tab, search, sort, activePrefix]);

  React.useEffect(() => { setPage(1); }, [tab, search, sort, activePrefix]);
  // ─────────────────────────────────────────────────────────────────────

  if (writing) {
    return <PostCompose
      key={writing === true ? "new" : String(writing.id)}
      user={user}
      initialPost={writing === true ? null : writing}
      onCancel={() => setWriting(null)}
      onPublish={async (payload) => {
        let savedPost;
        try {
          savedPost = writing === true
            ? await window.BGNJ_COMMUNITY.createPostRemote(payload)
            : await window.BGNJ_COMMUNITY.updatePostRemote(writing.id, payload);
        } catch (err) {
          // 서버 실패 시 로컬 폴백 — 비로그인/네트워크 단절 환경에서도 작성은 보존.
          savedPost = writing === true
            ? window.BGNJ_COMMUNITY.createPost(payload)
            : window.BGNJ_COMMUNITY.updatePost(writing.id, payload);
        }
        setWriting(null);
        setRefreshKey((value) => value + 1);
        if (savedPost) setPostId(savedPost.id);
      }}
      categories={categories}
      userLevel={userLevel}
    />;
  }

  if (postId) {
    const post = allPosts.find(p => String(p.id) === String(postId)) || null;
    if (!post) {
      return (
        <div className="section">
          <div className="container" style={{maxWidth:760, textAlign:'center', padding:'80px 20px'}}>
            <p className="dim" style={{fontSize:14, marginBottom:16}}>해당 게시글을 찾을 수 없습니다.</p>
            <button type="button" className="btn" onClick={() => setPostId(null)}>목록으로</button>
          </div>
        </div>
      );
    }
    if (!canReadPost(post)) {
      return (
        <div className="section">
          <div className="container" style={{maxWidth:760, textAlign:'center', padding:'80px 20px'}}>
            <p className="dim" style={{fontSize:14, marginBottom:16}}>현재 등급으로는 이 게시글을 볼 수 없습니다.</p>
            <button type="button" className="btn" onClick={() => setPostId(null)}>목록으로</button>
          </div>
        </div>
      );
    }
    return <PostDetail
      post={post}
      go={go}
      setPostId={setPostId}
      user={user}
      onRefresh={() => setRefreshKey((value) => value + 1)}
      onEdit={(nextPost) => setWriting(nextPost)}
    />;
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(pageStart, pageStart + POSTS_PER_PAGE);

  const handleWrite = () => {
    if (!user) {
      if (confirm("글쓰기는 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?")) {
        go("login");
      }
      return;
    }
    // Writable categories for current user
    const writable = categories.filter(c => userLevel >= (c.postMinLevel ?? c.minLevel ?? 0));
    if (writable.length === 0) {
      alert("현재 등급으로는 글을 작성할 수 있는 게시판이 없습니다.");
      return;
    }
    setWriting(true);
  };

  return (
    <div className="section">
      <div className="container">
        <header style={{marginBottom:24}}>
          <div className="section-eyebrow" aria-hidden="true">COMMUNITY · 커뮤니티</div>
          <h1 className="section-title">다섯 봉우리 <span className="accent">광장</span></h1>
          <p className="section-subtitle">뱅기노자이 모여 나누는 이야기. 질문도 답도 환영합니다.</p>
        </header>


        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, gap:24, flexWrap:'wrap'}}>
          <div role="tablist" aria-label="게시판 분류"
            style={{display:'flex', gap:0, borderBottom:'1px solid var(--line)', flexWrap:'wrap'}}>
            <button type="button" role="tab" aria-selected={tab === "all"}
              onClick={() => setTab("all")}
              style={{padding:'14px 24px', fontSize:13, letterSpacing:'0.1em',
                color: tab === "all" ? 'var(--gold)' : 'var(--ink-2)',
                borderBottom: tab === "all" ? '1px solid var(--gold)' : '1px solid transparent',
                marginBottom:-1}}>전체</button>
            {visibleCats.map(c => (
              <button key={c.id} type="button" role="tab" aria-selected={tab === c.id}
                onClick={() => setTab(c.id)}
                style={{padding:'14px 24px', fontSize:13, letterSpacing:'0.1em',
                  color: tab === c.id ? 'var(--gold)' : 'var(--ink-2)',
                  borderBottom: tab === c.id ? '1px solid var(--gold)' : '1px solid transparent',
                  marginBottom:-1}}>{c.label}</button>
            ))}
          </div>
          <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
            <label htmlFor="community-search" className="sr-only">게시글 검색</label>
            <input id="community-search"
              placeholder={tab === "all" ? "전체 게시판 검색..." : `${currentBoard?.label || ''} 게시판 검색...`}
              value={search} onChange={e => setSearch(e.target.value)}
              className="field-input" style={{width:200, padding:'10px 14px'}}/>
            <label htmlFor="community-sort" className="sr-only">정렬</label>
            <select id="community-sort" value={sort} onChange={e => setSort(e.target.value)}
              className="field-input" style={{padding:'10px 12px', fontSize:12, cursor:'pointer'}}>
              <option value="latest">최신순</option>
              <option value="views">조회순</option>
              <option value="replies">댓글순</option>
              <option value="likes">좋아요순</option>
            </select>
            <button type="button" className="btn btn-gold btn-small" onClick={handleWrite}>
              {user ? '글쓰기 ＋' : '로그인 후 글쓰기'}
            </button>
          </div>
        </div>

        {/* 게시판 설명 — 특정 게시판 뷰에서만 표시 */}
        {tab !== "all" && currentBoard?.desc && (
          <div style={{
            padding:'10px 16px', marginBottom:16,
            background:'var(--bg-2)', borderLeft:'3px solid var(--gold)',
            fontSize:13, color:'var(--ink-2)', lineHeight:1.6,
          }}>{currentBoard.desc}</div>
        )}

        {/* 말머리 필터 — 해당 게시판에 말머리가 있을 때만 표시 */}
        {boardPrefixes.length > 0 && (
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:16}}>
            <button type="button"
              onClick={() => setActivePrefix("")}
              style={{
                padding:'4px 16px', border:'1px solid',
                borderColor: activePrefix === "" ? 'var(--gold)' : 'var(--line-2)',
                color: activePrefix === "" ? 'var(--gold)' : 'var(--ink-2)',
                background: activePrefix === "" ? 'rgba(158,104,24,0.06)' : 'none',
                cursor:'pointer', fontSize:13, letterSpacing:'0.05em',
              }}>전체</button>
            {boardPrefixes.map(p => (
              <button key={p} type="button"
                onClick={() => setActivePrefix(activePrefix === p ? "" : p)}
                style={{
                  padding:'4px 16px', border:'1px solid',
                  borderColor: activePrefix === p ? 'var(--gold)' : 'var(--line-2)',
                  color: activePrefix === p ? 'var(--gold)' : 'var(--ink-2)',
                  background: activePrefix === p ? 'rgba(158,104,24,0.06)' : 'none',
                  cursor:'pointer', fontSize:13, letterSpacing:'0.05em',
                }}>{p}</button>
            ))}
          </div>
        )}

        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <caption className="sr-only">게시글 목록</caption>
          <thead>
            <tr style={{fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
              <th scope="col" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:60}}>번호</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:90}}>분류</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)'}}>제목</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:120}}>작성자</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'right', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:70}}>조회</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'right', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:100}}>날짜</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{padding:48, textAlign:'center'}} className="dim">
                조건에 맞는 게시글이 없습니다.
              </td></tr>
            ) : pagePosts.map((p, i) => {
              const cat = categories.find(c => c.id === p.categoryId) || categories.find(c => c.label === p.category) || { label: p.category };
              const likesCount = Array.isArray(p.likes) ? p.likes.length : 0;
              const bookmarked = user && window.BGNJ_COMMUNITY.isBookmarked(user.id, p.id);
              return (
                <tr key={p.id} style={{borderBottom:'1px solid var(--line)', transition:'background .2s'}}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="mono dim-2" style={{padding:'18px 8px', fontSize:12}}>{String(filtered.length - (pageStart + i)).padStart(3, '0')}</td>
                  <td style={{padding:'18px 8px'}}><span className="badge">{cat.label}</span></td>
                  <td style={{padding:'18px 8px', fontSize:15}} className="row-title">
                    <button type="button" onClick={() => setPostId(p.id)}
                      style={{all:'unset', cursor:'pointer', textAlign:'left'}}>
                      {bookmarked && <span className="gold" style={{marginRight:6, fontSize:11}} aria-label="북마크">★</span>}
                      {p.title}
                      {p.images?.length > 0 && <span className="gold mono" style={{marginLeft:8, fontSize:10}} aria-label="이미지 첨부">📷{p.images.length}</span>}
                      {likesCount > 0 && <span className="gold mono" style={{marginLeft:8, fontSize:10}} aria-label="공감 수">♥{likesCount}</span>}
                      {p.tags?.length > 0 && <span className="dim-2 mono" style={{marginLeft:8, fontSize:10}}>{p.tags.slice(0,3).map(t => `#${t}`).join(' ')}</span>}
                      {p.hot && <span className="gold" style={{marginLeft:8, fontSize:10}}>HOT</span>}
                      {p._new && <span className="gold" style={{marginLeft:8, fontSize:10}}>NEW</span>}
                    </button>
                  </td>
                  <td className="mono dim" style={{padding:'18px 8px', fontSize:12}}>
                    {p.author}
                    <AuthorGradeBadge authorId={p.authorId} author={p.author} authorEmail={p.authorEmail}/>
                  </td>
                  <td className="mono dim-2" style={{padding:'18px 8px', fontSize:12, textAlign:'right'}}>{p.views ?? 0}</td>
                  <td className="mono dim-2" style={{padding:'18px 8px', fontSize:11, textAlign:'right'}}>
                    <time dateTime={p.date.replace(/\./g,'-')}>{p.date}</time>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <nav aria-label="게시글 페이지 이동" style={{display:'flex', justifyContent:'center', alignItems:'center', gap:6, marginTop:32, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small"
              onClick={() => setPage(Math.max(1, safePage - 1))}
              disabled={safePage <= 1}>← 이전</button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
              <button key={n} type="button" className="btn btn-small"
                aria-current={n === safePage ? 'page' : undefined}
                onClick={() => setPage(n)}
                style={{
                  borderColor: n === safePage ? 'var(--gold)' : 'var(--line)',
                  color: n === safePage ? 'var(--gold)' : 'var(--ink-2)',
                  background: n === safePage ? 'rgba(212,175,55,0.08)' : 'transparent',
                  minWidth: 36,
                }}>{n}</button>
            ))}
            <button type="button" className="btn btn-small"
              onClick={() => setPage(Math.min(totalPages, safePage + 1))}
              disabled={safePage >= totalPages}>다음 →</button>
          </nav>
        )}

        {filtered.length > 0 && (
          <div className="mono dim-2" style={{textAlign:'center', fontSize:10, letterSpacing:'0.2em', marginTop:12}}>
            전체 {filtered.length}건 · {safePage}/{totalPages} 페이지
          </div>
        )}

        {/* 하단 검색 + 글쓰기 바 */}
        <div style={{
          display:'flex', gap:10, alignItems:'center', justifyContent:'center',
          marginTop:40, paddingTop:24, borderTop:'1px solid var(--line)',
          flexWrap:'wrap',
        }}>
          <label htmlFor="community-search-bottom" className="sr-only">게시글 검색</label>
          <input id="community-search-bottom"
            placeholder={tab === "all" ? "전체 게시판 검색..." : `${currentBoard?.label || ''} 게시판 검색...`}
            value={search} onChange={e => setSearch(e.target.value)}
            className="field-input"
            style={{width:280, padding:'12px 16px', fontSize:14}}/>
          <button type="button" className="btn btn-gold" onClick={handleWrite}
            style={{padding:'12px 28px', fontSize:13}}>
            {user ? '글쓰기 ＋' : '로그인 후 글쓰기'}
          </button>
        </div>
      </div>
    </div>
  );
};

// === Post Compose =======================================================
// 새 글 임시저장 키 — 사용자별로 분리(여러 계정이 같은 브라우저를 쓸 때 섞이지 않도록).
const draftKeyFor = (userId) => `bgnj_post_draft_${userId || 'guest'}`;

const PostCompose = ({ user, initialPost, onCancel, onPublish, categories, userLevel }) => {
  const writable = categories.filter(c => userLevel >= (c.postMinLevel ?? c.minLevel ?? 0));
  const defaultCategoryId = initialPost?.categoryId || writable[0]?.id || categories[0]?.id || "";
  const isEditing = !!initialPost;

  // 새 글 작성일 때만 임시저장 복원/저장. 수정 모드에서는 원본 게시글이 source of truth.
  const draftKey = draftKeyFor(user?.id);
  const initialDraft = React.useMemo(() => {
    if (isEditing) return null;
    try {
      const raw = localStorage.getItem(draftKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, [draftKey, isEditing]);

  const [categoryId, setCategoryId] = React.useState(initialDraft?.categoryId || defaultCategoryId);
  const [title, setTitle] = React.useState(initialPost?.title || initialDraft?.title || "");
  const [prefix, setPrefix] = React.useState(initialPost?.prefix || initialDraft?.prefix || "");
  const [tags, setTags] = React.useState(initialPost?.tags || initialDraft?.tags || []);
  const [images, setImages] = React.useState(initialPost?.images || initialDraft?.images || []);
  const [bodyHtml, setBodyHtml] = React.useState(initialPost?.body?.html || initialDraft?.bodyHtml || "");
  const [bodyText, setBodyText] = React.useState(initialPost?.body?.text || initialDraft?.bodyText || "");
  const [error, setError] = React.useState("");
  const [draftRestored, setDraftRestored] = React.useState(!!(initialDraft && (initialDraft.title || initialDraft.bodyText)));
  const [savedAt, setSavedAt] = React.useState(initialDraft?.savedAt || null);
  const prevCategoryIdRef = React.useRef(categoryId);

  // 임시저장 — 수정 모드 제외, 1초 디바운스로 저장.
  React.useEffect(() => {
    if (isEditing) return;
    const hasContent = !!(title.trim() || bodyText.trim() || (tags && tags.length) || (images && images.length));
    const t = setTimeout(() => {
      try {
        if (hasContent) {
          const snapshot = { categoryId, title, prefix, tags, images, bodyHtml, bodyText, savedAt: new Date().toISOString() };
          localStorage.setItem(draftKey, JSON.stringify(snapshot));
          setSavedAt(snapshot.savedAt);
        } else {
          localStorage.removeItem(draftKey);
          setSavedAt(null);
        }
      } catch {}
    }, 800);
    return () => clearTimeout(t);
  }, [draftKey, isEditing, categoryId, title, prefix, tags, images, bodyHtml, bodyText]);

  const clearDraft = () => {
    try { localStorage.removeItem(draftKey); } catch {}
    setSavedAt(null);
    setDraftRestored(false);
  };

  React.useEffect(() => {
    setCategoryId(initialPost?.categoryId || defaultCategoryId);
    setTitle(initialPost?.title || "");
    setPrefix(initialPost?.prefix || "");
    setTags(initialPost?.tags || []);
    setImages(initialPost?.images || []);
    setBodyHtml(initialPost?.body?.html || "");
    setBodyText(initialPost?.body?.text || "");
    setError("");
    prevCategoryIdRef.current = initialPost?.categoryId || defaultCategoryId;
    // initialPost 가 들어오면 (= 수정 모드) 임시저장은 무시.
  }, [initialPost, defaultCategoryId]);

  const selectedCat = categories.find(c => c.id === categoryId);
  const boardPrefixes = selectedCat?.prefixes || [];

  React.useEffect(() => {
    if (prevCategoryIdRef.current === categoryId) return;
    prevCategoryIdRef.current = categoryId;
    if (!isEditing || categoryId !== (initialPost?.categoryId || "")) {
      setPrefix("");
    }
  }, [categoryId, initialPost, isEditing]);

  const submit = () => {
    setError("");
    if (!title.trim()) return setError("제목을 입력해주세요.");
    if (!bodyText.trim()) return setError("본문을 입력해주세요.");
    const cat = categories.find(c => c.id === categoryId);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    // 발행 성공 가정으로 임시저장 정리 (실패 시 onPublish 측에서 다시 저장은 안 함).
    if (!isEditing) {
      try { localStorage.removeItem(draftKey); } catch {}
    }
    onPublish({
      categoryId: cat.id,
      category: cat.label,
      prefix: prefix || "",
      title: title.trim(),
      author: user?.name || "익명",
      authorId: user?.id || null,
      authorEmail: user?.email || null,
      replies: initialPost?.replies ?? 0,
      views: initialPost?.views ?? 0,
      date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())}`,
      tags,
      images,
      _new: true,
      _userCreated: true,
      body: { html: bodyHtml, text: bodyText },
    });
  };

  return (
    <div className="section">
      <div className="container" style={{maxWidth:960}}>
        <header style={{marginBottom:32}}>
          <div className="section-eyebrow" aria-hidden="true">COMPOSE · 글쓰기</div>
          <h1 className="section-title" style={{fontSize:36}}>{isEditing ? "게시글 수정" : "새 글 작성"}</h1>
          <p className="dim" style={{fontSize:13, marginTop:8}}>
            작성자: <span className="gold">{user?.name || '익명'}</span>
            {!isEditing && savedAt && (
              <span className="dim-2 mono" style={{marginLeft:14, fontSize:11}}>
                · 임시저장됨 ({new Date(savedAt).toLocaleTimeString('ko-KR', {hour:'2-digit', minute:'2-digit'})})
              </span>
            )}
          </p>
          {!isEditing && draftRestored && (
            <div role="status" style={{
              marginTop:14, padding:'10px 14px', background:'rgba(212,175,55,0.06)',
              border:'1px solid var(--gold-dim)', fontSize:12, color:'var(--ink-2)',
              display:'flex', justifyContent:'space-between', alignItems:'center', gap:12,
            }}>
              <span>이전에 작성하던 글을 복원했습니다.</span>
              <button type="button" className="btn-ghost"
                onClick={() => {
                  if (confirm('임시저장된 글을 삭제하고 새로 시작하시겠어요?')) {
                    setTitle(''); setPrefix(''); setTags([]); setImages([]);
                    setBodyHtml(''); setBodyText('');
                    clearDraft();
                  }
                }}
                style={{fontSize:11, color:'var(--danger)', textDecoration:'underline'}}>
                새로 시작
              </button>
            </div>
          )}
        </header>

        <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
          <div style={{display:'grid', gridTemplateColumns:'160px 1fr', gap:16, marginBottom: boardPrefixes.length > 0 ? 12 : 20}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="post-cat">게시판</label>
              <select id="post-cat" className="field-input"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}>
                {writable.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="post-title">제목 <span className="gold" aria-hidden="true">*</span></label>
              <input id="post-title" className="field-input"
                placeholder="제목을 입력하세요"
                value={title} onChange={e => setTitle(e.target.value)}
                required maxLength={120}/>
            </div>
          </div>

          {/* 말머리 선택 — 선택된 게시판에 말머리가 있을 때만 표시 */}
          {boardPrefixes.length > 0 && (
            <div className="field" style={{marginBottom:20}}>
              <div className="field-label">말머리</div>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                <button type="button"
                  onClick={() => setPrefix("")}
                  style={{padding:'4px 14px', border:'1px solid', borderColor: prefix === "" ? 'var(--gold)' : 'var(--line)', color: prefix === "" ? 'var(--gold)' : 'var(--ink-2)', background:'none', cursor:'pointer', fontSize:13, letterSpacing:'0.05em'}}>
                  없음
                </button>
                {boardPrefixes.map((p) => (
                  <button key={p} type="button"
                    onClick={() => setPrefix(p)}
                    style={{padding:'4px 14px', border:'1px solid', borderColor: prefix === p ? 'var(--gold)' : 'var(--line)', color: prefix === p ? 'var(--gold)' : 'var(--ink-2)', background: prefix === p ? 'rgba(212,175,55,0.08)' : 'none', cursor:'pointer', fontSize:13, letterSpacing:'0.05em'}}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hashtags */}
          <div className="field">
            <div className="field-label">해시태그 / 메타태그</div>
            <HashtagInput tags={tags} setTags={setTags}/>
          </div>

          {/* Tiptap editor */}
            <div className="field">
              <div className="field-label">본문 <span className="gold" aria-hidden="true">*</span></div>
              <TiptapEditor key={initialPost?.id || "new"}
                preset="simple"
                content={bodyHtml}
                onUpdate={(html, _json, text) => { setBodyHtml(html); setBodyText(text); }}
                placeholder="본문을 입력하세요..."/>
            </div>

          {/* Image attachments */}
          <div className="field">
            <ImageAttacher images={images} setImages={setImages} max={10}/>
          </div>

          {error && (
            <div role="alert" style={{padding:'12px 16px', background:'rgba(194,74,61,0.1)', border:'1px solid var(--danger)', color:'var(--danger)', fontSize:13, marginBottom:16}}>
              {error}
            </div>
          )}

          <div style={{display:'flex', gap:12, justifyContent:'flex-end', paddingTop:20, borderTop:'1px solid var(--line)'}}>
            <button type="button" className="btn" onClick={onCancel}>취소</button>
            <button type="submit" className="btn btn-gold">{isEditing ? "수정 저장 →" : "게시하기 →"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// === Post Detail =========================================================
const PostDetail = ({ post, go, setPostId, user, onRefresh, onEdit }) => {
  const [comment, setComment] = React.useState("");
  const [commentsList, setCommentsList] = React.useState(() => window.BGNJ_COMMUNITY.getComments(post.id));
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [reportSubmitted, setReportSubmitted] = React.useState(false);
  const canManagePost = !!user && (user.isAdmin || post.authorId === user.id || post.author === user.name);

  // 좋아요 / 북마크 — 저장소 기반
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const liked = !!user && likes.includes(user.id);
  const likesCount = likes.length;
  const bookmarked = !!user && window.BGNJ_COMMUNITY.isBookmarked(user.id, post.id);

  React.useEffect(() => {
    setCommentsList(window.BGNJ_COMMUNITY.getComments(post.id));
    // 서버 게시글이면 서버에서 댓글 동기화
    if (post._remote) {
      window.BGNJ_COMMUNITY.refreshComments?.(post.id).then(() => {
        setCommentsList(window.BGNJ_COMMUNITY.getComments(post.id));
      });
    }
    const onRefreshComments = (e) => {
      if (e.detail && String(e.detail.postId) === String(post.id)) {
        setCommentsList(window.BGNJ_COMMUNITY.getComments(post.id));
      }
    };
    window.addEventListener('bgnj-comments-refresh', onRefreshComments);
    return () => window.removeEventListener('bgnj-comments-refresh', onRefreshComments);
  }, [post.id]);

  React.useEffect(() => {
    const key = `bgnj_viewed_post_${post.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    window.BGNJ_COMMUNITY.incrementViews(post.id);
    onRefresh?.();
  }, [post.id]);

  const requireLogin = (label) => {
    if (confirm(`${label}은(는) 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?`)) {
      go('login');
    }
  };

  const handleLike = async () => {
    if (!user) return requireLogin('공감');
    try { await window.BGNJ_COMMUNITY.toggleLike(post.id, user.id); onRefresh?.(); }
    catch (err) { alert(`공감 처리 실패: ${err?.message || '알 수 없는 오류'}`); }
  };

  const handleBookmark = async () => {
    if (!user) return requireLogin('북마크');
    try { await window.BGNJ_COMMUNITY.toggleBookmark(user.id, post.id); onRefresh?.(); }
    catch (err) { alert(`북마크 처리 실패: ${err?.message || '알 수 없는 오류'}`); }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.BGNJ_COMMUNITY.addReport({
        postId: post.id,
        postTitle: post.title,
        reporterId: user?.id || null,
        reporterName: user?.name || '익명',
        reason: reportReason,
      });
      setReportSubmitted(true);
      setReportReason("");
      setTimeout(() => { setReportOpen(false); setReportSubmitted(false); }, 1800);
    } catch (err) {
      alert(`신고 접수 실패: ${err?.message || '알 수 없는 오류'}`);
    }
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!user) return;
    const trimmed = comment.trim();
    if (!trimmed) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const next = window.BGNJ_COMMUNITY.addComment(post.id, {
      id: `comment-${Date.now()}`,
      author: user.name,
      authorId: user.id,
      authorEmail: user.email,
      date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      text: trimmed,
    });
    setCommentsList(next);

    // 본인 글이 아니면 작성자에게 알림. authorId가 있어야 푸시 가능.
    const isMyOwnPost = post.authorId === user.id || post.author === user.name;
    if (!isMyOwnPost && post.authorId) {
      window.BGNJ_COMMUNITY.addNotification(post.authorId, {
        type: 'comment',
        postId: post.id,
        postTitle: post.title,
        fromName: user.name,
        message: '내 글에 새 댓글이 달렸습니다.',
      });
    }

    onRefresh?.();
    setComment("");
  };

  const deletePost = () => {
    if (!confirm(`"${post.title}" 글을 삭제하시겠어요?`)) return;
    window.BGNJ_COMMUNITY.deletePost(post.id);
    onRefresh?.();
    setPostId(null);
  };

  const deleteComment = (commentId) => {
    const next = window.BGNJ_COMMUNITY.deleteComment(post.id, commentId);
    setCommentsList(next);
    onRefresh?.();
  };

  return (
    <article className="section post-read">
      <div className="container post-read-container">
        <button type="button" className="btn-ghost" onClick={() => setPostId(null)}
          style={{marginBottom:32, color:'var(--ink-2)', fontSize:12, letterSpacing:'0.1em'}}>
          ← 목록으로
        </button>

        <header style={{borderBottom:'1px solid var(--line-2)', paddingBottom:32, marginBottom:48}}>
          <div style={{display:'flex', gap:12, marginBottom:20, flexWrap:'wrap'}}>
            <span className="badge badge-gold">{post.category}</span>
            {post.hot && <span className="badge">HOT</span>}
            {post._userCreated && <span className="badge badge-gold">새 글</span>}
          </div>
          <h1 className="post-title" style={{
            fontFamily:'var(--font-display)',
            fontSize:'clamp(28px, 3.5vw, 44px)',
            fontWeight:500, lineHeight:1.25, letterSpacing:'-0.01em',
            marginBottom:24, textWrap:'balance'
          }}>{post.title}</h1>

          {post.tags?.length > 0 && (
            <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:16}}>
              {post.tags.map(t => <span key={t} className="tag-chip">#{t}</span>)}
            </div>
          )}

          <div style={{display:'flex', gap:24, alignItems:'center', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-3)', flexWrap:'wrap'}}>
            <span className="gold" style={{display:'inline-flex', alignItems:'center'}}>
              {post.author}
              <AuthorGradeBadge authorId={post.authorId} author={post.author} authorEmail={post.authorEmail}/>
            </span>
            <time dateTime={post.date.replace(/\./g,'-')}>{post.date}</time>
            <span>조회 {post.views ?? 0}</span>
            <span>댓글 {commentsList.length}</span>
            <span>공감 {likesCount}</span>
          </div>
        </header>

        {post.body?.html ? (
          <div className="post-body" dangerouslySetInnerHTML={{__html: post.body.html}}/>
        ) : (
          <div className="post-body">
            <p>어제 창덕궁 후원 야간 답사를 다녀왔습니다. 원래 낮에만 가봤던 곳이어서, 해가 떨어진 후의 공간이 어떻게 다르게 다가올지 반신반의했는데요.</p>
            <p>관람정 앞에 섰을 때, 문득 왕이 이 자리에서 무엇을 보았을까 — 라는 질문이 떠올랐습니다.</p>
            <blockquote>
              <p>"왕의 자리가 아니라 왕이 바라본 길을 따라가라."</p>
              <cite>— 뱅기노자, 『왕의길』 서문</cite>
            </blockquote>
            <p>다음 답사가 벌써 기다려집니다.</p>
          </div>
        )}

        {/* Image slider at bottom of post */}
        {post.images?.length > 0 && (
          <section aria-label="첨부 이미지" style={{margin:'48px 0'}}>
            <div className="section-eyebrow" aria-hidden="true" style={{marginBottom:16}}>ATTACHMENTS · 첨부 이미지 ({post.images.length}장)</div>
            <ImageSlider images={post.images}/>
          </section>
        )}

        {/* Actions */}
        <div style={{margin:'60px 0', paddingTop:32, borderTop:'1px solid var(--line)'}}>
          <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
            <button type="button" className="btn" aria-pressed={liked}
              onClick={handleLike}
              style={{borderColor: liked ? 'var(--gold)' : undefined, color: liked ? 'var(--gold)' : undefined}}>
              <span aria-hidden="true">♥</span> 공감 <span aria-live="polite">{likesCount}</span>
            </button>
            <button type="button" className="btn" aria-pressed={bookmarked}
              onClick={handleBookmark}
              style={{borderColor: bookmarked ? 'var(--gold)' : undefined, color: bookmarked ? 'var(--gold)' : undefined}}>
              <span aria-hidden="true">{bookmarked ? '★' : '☆'}</span> 북마크
            </button>
            <button type="button" className="btn"
              onClick={() => {
                if (!user) return requireLogin('신고');
                setReportOpen((v) => !v);
              }}>
              신고
            </button>
            {canManagePost && (
              <>
                <button type="button" className="btn" onClick={() => onEdit(post)}>수정</button>
                <button type="button" className="btn" onClick={deletePost}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
              </>
            )}
          </div>

          {reportOpen && (
            <form onSubmit={handleReportSubmit}
              style={{maxWidth:560, margin:'24px auto 0', padding:20, border:'1px solid var(--line)', background:'rgba(194,74,61,0.04)'}}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>REPORT · 신고 사유</div>
              {reportSubmitted ? (
                <div className="dim" style={{fontSize:13, lineHeight:1.7, padding:'8px 0', color:'var(--gold)'}}>
                  신고가 접수되었습니다. 운영자가 확인 후 처리합니다.
                </div>
              ) : (
                <>
                  <textarea
                    className="field-input"
                    placeholder="어떤 점이 문제인지 간단히 적어 주세요."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    style={{minHeight:80, resize:'vertical', marginBottom:12}}/>
                  <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
                    <button type="button" className="btn btn-small" onClick={() => setReportOpen(false)}>취소</button>
                    <button type="submit" className="btn btn-small"
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>신고 접수</button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

        {/* Comments */}
        <section aria-labelledby="comments-heading">
          <h2 id="comments-heading" className="ko-serif" style={{fontSize:22, marginBottom:24}}>
            댓글 <span className="gold">{commentsList.length}</span>
          </h2>

          {user ? (
            <form onSubmit={submitComment} style={{marginBottom:32}}>
              <label htmlFor="comment-input" className="sr-only">댓글 입력</label>
              <MentionTextarea
                value={comment}
                onChange={setComment}
                authors={(commentsList || []).map((c) => c.author).concat(post.author).filter(Boolean)}
                rows={4}
                placeholder="생각을 나누어 주세요... (@를 입력하면 멘션 자동완성)"
                style={{minHeight:100, resize:'vertical', marginBottom:12}}/>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span className="dim-2 mono" style={{fontSize:11}}>{user.name}(으)로 등록</span>
                <button type="submit" className="btn btn-gold btn-small" disabled={!comment.trim()}>등록</button>
              </div>
            </form>
          ) : (
            <div className="card" style={{padding:24, textAlign:'center', marginBottom:32, background:'rgba(212,175,55,0.04)'}}>
              <p className="dim" style={{fontSize:14, marginBottom:16}}>
                댓글 작성은 <strong className="gold">로그인한 회원</strong>만 가능합니다.
              </p>
              <div style={{display:'flex', gap:10, justifyContent:'center'}}>
                <button type="button" className="btn btn-gold btn-small" onClick={() => go('login')}>로그인</button>
                <button type="button" className="btn btn-small" onClick={() => go('signup')}>회원가입</button>
              </div>
            </div>
          )}

          <CommentTree
            comments={commentsList}
            user={user}
            onDelete={deleteComment}
            onReply={(parentId, text) => {
              if (!user || !text.trim()) return;
              const now = new Date();
              const pad = (n) => String(n).padStart(2, '0');
              const next = window.BGNJ_COMMUNITY.addComment(post.id, {
                id: `comment-${Date.now()}-${Math.random().toString(36).slice(2,4)}`,
                author: user.name,
                authorId: user.id,
                authorEmail: user.email,
                date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
                text: text.trim(),
                parentId,
              });
              setCommentsList(next);
              const isMyOwnPost = post.authorId === user.id || post.author === user.name;
              if (!isMyOwnPost && post.authorId) {
                window.BGNJ_COMMUNITY.addNotification(post.authorId, {
                  type: 'comment',
                  postId: post.id,
                  postTitle: post.title,
                  fromName: user.name,
                  message: '내 글에 새 답글이 달렸습니다.',
                });
              }
              onRefresh?.();
            }}
          />
        </section>
      </div>
    </article>
  );
};

Object.assign(window, { CommunityPage, ImageSlider, HashtagInput, ImageAttacher, CommentTree });

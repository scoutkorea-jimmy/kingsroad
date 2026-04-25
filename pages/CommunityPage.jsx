// 커뮤니티: 목록 + 글 상세 + 글 작성 (Tiptap)
// 등급별 접근 제어: 읽기/쓰기 권한은 카테고리.minLevel / postMinLevel로 판정.

// 공용 훅 — 권한 계산
const useUserLevel = (user) => React.useMemo(() => window.WSD_USER_LEVEL(user), [user]);
const getCategoriesForBoard = (boardType) =>
  window.WSD_STORES.categories.filter(c => c.boardType === boardType);

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

// === Comment tree (1단계 답글) ============================================
const CommentTree = ({ comments, user, onDelete, onReply }) => {
  const topLevel = (comments || []).filter((c) => !c.parentId);
  const repliesOf = (parentId) => (comments || []).filter((c) => c.parentId === parentId);
  const [openReplyTo, setOpenReplyTo] = React.useState(null);
  const [draft, setDraft] = React.useState('');

  const submitReply = (parentId) => {
    onReply?.(parentId, draft);
    setDraft('');
    setOpenReplyTo(null);
  };

  const renderItem = (c, depth = 0) => (
    <li key={c.id} style={{padding:'18px 0', borderBottom: depth === 0 ? '1px solid var(--line)' : 'none', marginLeft: depth * 24}}>
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
          {!!user && depth === 0 && (
            <button type="button" className="btn-ghost"
              onClick={() => { setOpenReplyTo(openReplyTo === c.id ? null : c.id); setDraft(''); }}
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
      <p style={{fontFamily:'var(--font-reading)', fontSize: depth > 0 ? 14 : 15, lineHeight:1.8, color:'var(--ink)', whiteSpace:'pre-wrap'}}>{c.text}</p>

      {/* 답글 입력 폼 */}
      {openReplyTo === c.id && (
        <form onSubmit={(e) => { e.preventDefault(); submitReply(c.id); }}
          style={{marginTop:10, paddingLeft:24, borderLeft:'2px solid var(--gold-dim)'}}>
          <textarea className="field-input" rows={2} value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`@${c.author}에게 답글...`}
            style={{marginBottom:8}}/>
          <div style={{display:'flex', justifyContent:'flex-end', gap:6}}>
            <button type="button" className="btn btn-small" onClick={() => { setOpenReplyTo(null); setDraft(''); }}>취소</button>
            <button type="submit" className="btn btn-gold btn-small" disabled={!draft.trim()}>답글 등록</button>
          </div>
        </form>
      )}

      {/* 자식 답글들 */}
      {depth === 0 && repliesOf(c.id).length > 0 && (
        <ol style={{listStyle:'none', padding:0, margin:'12px 0 0', borderLeft:'2px solid var(--line)', paddingLeft:14}}>
          {repliesOf(c.id).map((r) => renderItem(r, depth + 1))}
        </ol>
      )}
    </li>
  );

  return (
    <ol style={{listStyle:'none', padding:0, margin:0}}>
      {topLevel.map((c) => renderItem(c, 0))}
    </ol>
  );
};

// === Community Page ======================================================
const POSTS_PER_PAGE = 10;

const CommunityPage = ({ go, postId, setPostId, user }) => {
  const userLevel = useUserLevel(user);
  const categories = React.useMemo(() => getCategoriesForBoard("community"), [postId]);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [tab, setTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [writing, setWriting] = React.useState(null);
  const [page, setPage] = React.useState(1);

  // 알림 벨 / 외부 진입에서 stash해 둔 postId가 있으면 자동으로 상세로 이동
  React.useEffect(() => {
    let pending = null;
    try { pending = sessionStorage.getItem('wsd_pending_post_id'); } catch {}
    if (pending) {
      try { sessionStorage.removeItem('wsd_pending_post_id'); } catch {}
      setPostId(pending);
    }
    // 내비 메가메뉴에서 들어온 게시판 ID
    let pendingBoard = null;
    try { pendingBoard = sessionStorage.getItem('wsd_pending_board_id'); } catch {}
    if (pendingBoard) {
      try { sessionStorage.removeItem('wsd_pending_board_id'); } catch {}
      setTab(pendingBoard);
    }
  }, []);

  const allPosts = React.useMemo(() => {
    return window.WSD_COMMUNITY.listPosts();
  }, [refreshKey]);

  if (writing) {
    return <PostCompose
      user={user}
      initialPost={writing === true ? null : writing}
      onCancel={() => setWriting(null)}
      onPublish={(payload) => {
        const savedPost = writing === true
          ? window.WSD_COMMUNITY.createPost(payload)
          : window.WSD_COMMUNITY.updatePost(writing.id, payload);
        setWriting(null);
        setRefreshKey((value) => value + 1);
        setPostId(savedPost.id);
      }}
      categories={categories}
      userLevel={userLevel}
    />;
  }

  if (postId) {
    const post = allPosts.find(p => p.id === postId) || allPosts[0];
    return <PostDetail
      post={post}
      go={go}
      setPostId={setPostId}
      user={user}
      onRefresh={() => setRefreshKey((value) => value + 1)}
      onEdit={(nextPost) => setWriting(nextPost)}
    />;
  }

  const visibleCats = categories.filter(c => userLevel >= (c.minLevel ?? 0));
  const filtered = allPosts.filter(p => {
    const cat = categories.find(c => c.id === p.categoryId) || categories.find(c => c.label === p.category);
    if (cat && userLevel < (cat.minLevel ?? 0)) return false;
    if (tab !== "all" && (p.categoryId !== tab && cat?.id !== tab)) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // 검색어/탭이 바뀌면 페이지를 1로 되돌림
  React.useEffect(() => { setPage(1); }, [tab, search]);

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
          <p className="section-subtitle">왕사들이 모여 나누는 이야기. 질문도 답도 환영합니다.</p>
        </header>

        {/* 내 등급 / 쓰기 가능 게시판 안내 배너 */}
        {(() => {
          const myGrade = window.WSD_USER_GRADE?.(user) || null;
          const readable = categories.filter((c) => userLevel >= (c.minLevel ?? 0));
          const writable = categories.filter((c) => userLevel >= (c.postMinLevel ?? c.minLevel ?? 0));
          const writableLabels = writable.map((c) => c.label).join(' · ') || '없음';
          return (
            <div className="card" style={{padding:14, marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center', gap:14, flexWrap:'wrap'}}>
              <div style={{display:'flex', alignItems:'baseline', gap:10, flexWrap:'wrap'}}>
                <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em'}}>MY ACCESS</span>
                {user ? (
                  <>
                    <span className="ko-serif" style={{fontSize:14}}>
                      {user.name}
                      {myGrade && (
                        <span className="mono" style={{fontSize:10, letterSpacing:'0.14em', color: myGrade.color || 'var(--gold)', border:`1px solid ${myGrade.color || 'var(--gold-dim)'}`, padding:'1px 6px', marginLeft:8}}>{myGrade.label}</span>
                      )}
                      <span className="dim-2 mono" style={{fontSize:10, marginLeft:8}}>Lv {userLevel}</span>
                    </span>
                  </>
                ) : (
                  <span className="dim" style={{fontSize:13}}>비로그인 · 일부 게시판만 읽기 가능</span>
                )}
              </div>
              <div className="dim mono" style={{fontSize:11, letterSpacing:'0.05em'}}>
                읽기 가능 {readable.length}개 · 쓰기 가능 {writable.length}개{writable.length > 0 ? ` (${writableLabels})` : ''}
              </div>
            </div>
          );
        })()}

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
          <div style={{display:'flex', gap:12}}>
            <label htmlFor="community-search" className="sr-only">게시글 검색</label>
            <input id="community-search" placeholder="검색..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="field-input" style={{width:200, padding:'10px 14px'}}/>
            <button type="button" className="btn btn-gold btn-small" onClick={handleWrite}>
              {user ? '글쓰기 ＋' : '로그인 후 글쓰기'}
            </button>
          </div>
        </div>

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
              const bookmarked = user && window.WSD_COMMUNITY.isBookmarked(user.id, p.id);
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
      </div>
    </div>
  );
};

// === Post Compose =======================================================
const PostCompose = ({ user, initialPost, onCancel, onPublish, categories, userLevel }) => {
  const writable = categories.filter(c => userLevel >= (c.postMinLevel ?? c.minLevel ?? 0));
  const [categoryId, setCategoryId] = React.useState(initialPost?.categoryId || writable[0]?.id || categories[0]?.id);
  const [title, setTitle] = React.useState(initialPost?.title || "");
  const [tags, setTags] = React.useState(initialPost?.tags || []);
  const [images, setImages] = React.useState(initialPost?.images || []);
  const [bodyHtml, setBodyHtml] = React.useState(initialPost?.body?.html || "");
  const [bodyText, setBodyText] = React.useState(initialPost?.body?.text || "");
  const [error, setError] = React.useState("");
  const isEditing = !!initialPost;

  const submit = () => {
    setError("");
    if (!title.trim()) return setError("제목을 입력해주세요.");
    if (!bodyText.trim()) return setError("본문을 입력해주세요.");
    const cat = categories.find(c => c.id === categoryId);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    onPublish({
      categoryId: cat.id,
      category: cat.label,
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
          </p>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
          <div style={{display:'grid', gridTemplateColumns:'160px 1fr', gap:16, marginBottom:20}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="post-cat">분류</label>
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

          {/* Hashtags */}
          <div className="field">
            <div className="field-label">해시태그 / 메타태그</div>
            <HashtagInput tags={tags} setTags={setTags}/>
          </div>

          {/* Tiptap editor */}
            <div className="field">
              <div className="field-label">본문 <span className="gold" aria-hidden="true">*</span></div>
              <TiptapEditor preset="simple"
                content={initialPost?.body?.html || ""}
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
  const [commentsList, setCommentsList] = React.useState(() => window.WSD_COMMUNITY.getComments(post.id));
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [reportSubmitted, setReportSubmitted] = React.useState(false);
  const canManagePost = !!user && (user.isAdmin || post.authorId === user.id || post.author === user.name);

  // 좋아요 / 북마크 — 저장소 기반
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const liked = !!user && likes.includes(user.id);
  const likesCount = likes.length;
  const bookmarked = !!user && window.WSD_COMMUNITY.isBookmarked(user.id, post.id);

  React.useEffect(() => {
    setCommentsList(window.WSD_COMMUNITY.getComments(post.id));
  }, [post.id]);

  React.useEffect(() => {
    const key = `wsd_viewed_post_${post.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    window.WSD_COMMUNITY.incrementViews(post.id);
    onRefresh?.();
  }, [post.id]);

  const requireLogin = (label) => {
    if (confirm(`${label}은(는) 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?`)) {
      go('login');
    }
  };

  const handleLike = () => {
    if (!user) return requireLogin('공감');
    window.WSD_COMMUNITY.toggleLike(post.id, user.id);
    onRefresh?.();
  };

  const handleBookmark = () => {
    if (!user) return requireLogin('북마크');
    window.WSD_COMMUNITY.toggleBookmark(user.id, post.id);
    onRefresh?.();
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    window.WSD_COMMUNITY.addReport({
      postId: post.id,
      postTitle: post.title,
      reporterId: user?.id || null,
      reporterName: user?.name || '익명',
      reason: reportReason,
    });
    setReportSubmitted(true);
    setReportReason("");
    setTimeout(() => { setReportOpen(false); setReportSubmitted(false); }, 1800);
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!user) return;
    const trimmed = comment.trim();
    if (!trimmed) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const next = window.WSD_COMMUNITY.addComment(post.id, {
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
      window.WSD_COMMUNITY.addNotification(post.authorId, {
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
    window.WSD_COMMUNITY.deletePost(post.id);
    onRefresh?.();
    setPostId(null);
  };

  const deleteComment = (commentId) => {
    const next = window.WSD_COMMUNITY.deleteComment(post.id, commentId);
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
              <textarea id="comment-input" className="field-input"
                placeholder="생각을 나누어 주세요..."
                value={comment} onChange={e => setComment(e.target.value)}
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
              const next = window.WSD_COMMUNITY.addComment(post.id, {
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
                window.WSD_COMMUNITY.addNotification(post.authorId, {
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

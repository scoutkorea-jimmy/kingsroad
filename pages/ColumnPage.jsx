// 뱅기노자 칼럼 아카이브
const ColumnPage = ({ go, user }) => {
  const [tick, setTick] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("전체");
  const [comment, setComment] = React.useState("");
  const [shareMsg, setShareMsg] = React.useState("");

  const refresh = () => setTick((v) => v + 1);

  const publicColumns = React.useMemo(
    () => window.BGNJ_COLUMNS.listPublic(),
    [tick]
  );
  const categories = React.useMemo(
    () => ["전체", ...Array.from(new Set(publicColumns.map((c) => c.category)))],
    [publicColumns]
  );
  const filtered = React.useMemo(
    () => window.BGNJ_COLUMNS.searchPublic({ query: search, category }),
    [search, category, tick]
  );

  // 외부 진입 (해시 / 마이페이지 / 알림 등)으로 들어오는 칼럼 ID
  React.useEffect(() => {
    let pending = null;
    try { pending = sessionStorage.getItem("bgnj_pending_column_id"); } catch {}
    if (pending) {
      try { sessionStorage.removeItem("bgnj_pending_column_id"); } catch {}
      setSelectedId(pending);
    }
  }, []);

  // 상세 진입 시 조회수 증가 (세션당 1회)
  React.useEffect(() => {
    if (!selectedId) return;
    const key = `bgnj_viewed_col_${selectedId}`;
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        Promise.resolve(window.BGNJ_COLUMNS.incrementViews(selectedId)).then(() => refresh());
      }
    } catch {}
  }, [selectedId]);

  const requireLogin = (label) => {
    if (confirm(`${label}은(는) 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?`)) {
      go("login");
    }
  };

  const handleLike = async () => {
    if (!user) return requireLogin("공감");
    await window.BGNJ_COLUMNS.toggleLike(selectedId, user.id);
    refresh();
  };

  const handleShare = async () => {
    const url = `${location.origin}${location.pathname}#col-${selectedId}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("공유 링크가 복사되었습니다.");
    } catch {
      setShareMsg(url);
    }
    setTimeout(() => setShareMsg(""), 2400);
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!user) return requireLogin("댓글 작성");
    const trimmed = comment.trim();
    if (!trimmed) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    window.BGNJ_COLUMNS.addComment(selectedId, {
      id: `comment-${Date.now()}`,
      author: user.name,
      authorId: user.id,
      authorEmail: user.email,
      date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      text: trimmed,
    });
    setComment("");
    refresh();
  };

  const removeComment = (commentId) => {
    window.BGNJ_COLUMNS.deleteComment(selectedId, commentId);
    refresh();
  };

  // ── 상세 보기 ─────────────────────────────────────────────────
  if (selectedId !== null) {
    const c = window.BGNJ_COLUMNS.getColumn(selectedId);
    if (!c) {
      return (
        <div className="section">
          <div className="container" style={{maxWidth:760, textAlign:'center', padding:'80px 20px'}}>
            <p className="dim" style={{fontSize:14, marginBottom:16}}>해당 칼럼을 찾을 수 없습니다.</p>
            <button type="button" className="btn" onClick={() => setSelectedId(null)}>아카이브로</button>
          </div>
        </div>
      );
    }

    const idx = publicColumns.findIndex((x) => String(x.id) === String(c.id));
    const prevCol = idx > 0 ? publicColumns[idx - 1] : null;
    const nextCol = idx >= 0 && idx < publicColumns.length - 1 ? publicColumns[idx + 1] : null;
    const likes = window.BGNJ_COLUMNS.getLikes(c.id);
    const liked = !!user && likes.includes(user.id);
    const views = window.BGNJ_COLUMNS.getViews(c.id);
    const comments = window.BGNJ_COLUMNS.listComments(c.id);
    const readTime = c.body?.text
      ? window.BGNJ_COLUMNS.estimateReadTime(c.body.text)
      : c.readTime;

    return (
      <div className="section">
        <div className="container" style={{maxWidth:760}}>
          <button className="btn-ghost" onClick={() => setSelectedId(null)}
            style={{marginBottom:32, cursor:'pointer', color:'var(--ink-2)', fontSize:12, letterSpacing:'0.1em'}}>
            ← 아카이브로
          </button>
          <div style={{textAlign:'center', marginBottom:40}}>
            <span className="pill">{c.category}</span>
            <h1 style={{fontFamily:'var(--font-serif)', fontSize:48, fontWeight:500, lineHeight:1.2, margin:'20px 0 16px'}}>
              {c.title}
            </h1>
            <div style={{display:'flex', gap:20, justifyContent:'center', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-3)', flexWrap:'wrap'}}>
              <span className="gold">뱅기노자</span>
              <span>{c.date}</span>
              <span>읽는 시간 · {readTime}</span>
              <span>조회 {views}</span>
              <span>공감 {likes.length}</span>
              <span>댓글 {comments.length}</span>
            </div>
          </div>
          {!c.body?.html && (
            <div className="placeholder" style={{aspectRatio:'16/9', marginBottom:40, fontSize:11}}>
              COLUMN HERO IMAGE · 1600×900
            </div>
          )}
          <article style={{fontFamily:'var(--font-serif)', fontSize:18, lineHeight:2, color:'var(--ink)'}}>
            <p style={{fontSize:22, lineHeight:1.7, color:'var(--gold-ink)', marginBottom:32, fontStyle:'italic'}}>
              {c.excerpt}
            </p>
            {c.body?.html ? (
              <div dangerouslySetInnerHTML={{ __html: c.body.html }} />
            ) : (
              <>
                <p style={{marginBottom:28}}>
                  조선의 왕들은 매일 아침 같은 풍경을 마주했다. 어좌에 오르면 등 뒤에는 언제나 다섯 봉우리가 펼쳐져 있었고, 해와 달이 동시에 떠 있었다. 자연에서는 불가능한 일이 왕의 자리에서는 매일 일어났다.
                </p>
                <p style={{marginBottom:28}}>
                  어좌 뒤 다섯 봉우리 병풍은 단순한 장식이 아니다. 그것은 장치다. 왕으로 하여금 매일 우주를 떠올리게 하는 장치, 자신이 누구를 위해 앉아 있는지를 잊지 못하게 하는 장치였다.
                </p>
                <h3 style={{fontSize:24, fontWeight:500, margin:'48px 0 20px', color:'var(--gold-2)'}}>다섯 봉우리의 의미</h3>
                <p style={{marginBottom:28}}>
                  다섯이라는 숫자에는 이유가 있다. 오행(五行) — 목화토금수. 한 왕조가 우주의 질서와 일치한다는 선언이자, 동시에 그 질서를 흔들면 정통성을 잃는다는 경고이기도 했다.
                </p>
                <blockquote style={{borderLeft:'3px solid var(--gold)', paddingLeft:32, margin:'40px 0', fontStyle:'italic', color:'var(--gold-ink)'}}>
                  왕이라는 자리는 저절로 서 있는 것이 아니다.<br/>
                  다섯 봉우리가 매일 그를 일으켜 세웠다.
                </blockquote>
                <p style={{marginBottom:28}}>
                  오늘을 사는 우리에게 그 병풍은 더 이상 배경이 아니다. 그것은 하나의 질문이다 — 당신의 자리 뒤에는 무엇이 있는가.
                </p>
              </>
            )}
          </article>

          {/* 액션 — 공감 / 공유 */}
          <div style={{display:'flex', gap:12, justifyContent:'center', margin:'60px 0 32px', paddingTop:32, borderTop:'1px solid var(--line)', flexWrap:'wrap'}}>
            <button type="button" className="btn" aria-pressed={liked} onClick={handleLike}
              style={{borderColor: liked ? 'var(--gold)' : undefined, color: liked ? 'var(--gold)' : undefined}}>
              <span aria-hidden="true">♥</span> 공감 <span aria-live="polite">{likes.length}</span>
            </button>
            <button type="button" className="btn" onClick={handleShare}>공유 (링크 복사)</button>
          </div>
          {shareMsg && (
            <div role="status" className="mono gold" style={{fontSize:12, textAlign:'center', marginBottom:32, letterSpacing:'0.1em'}}>
              {shareMsg}
            </div>
          )}

          {/* 댓글 */}
          <section aria-labelledby="col-comments" style={{marginTop:32}}>
            <h2 id="col-comments" className="ko-serif" style={{fontSize:22, marginBottom:24}}>
              댓글 <span className="gold">{comments.length}</span>
            </h2>

            {user ? (
              <form onSubmit={submitComment} style={{marginBottom:32}}>
                <label htmlFor="col-comment-input" className="sr-only">댓글 입력</label>
                <textarea id="col-comment-input" className="field-input"
                  placeholder="이 글에 대한 생각을 나누어 주세요..."
                  value={comment} onChange={(e) => setComment(e.target.value)}
                  style={{minHeight:100, resize:'vertical', marginBottom:12}}/>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span className="dim-2 mono" style={{fontSize:11}}>{user.name}(으)로 등록</span>
                  <button type="submit" className="btn btn-gold btn-small" disabled={!comment.trim()}>등록</button>
                </div>
              </form>
            ) : (
              <div className="card" style={{padding:24, textAlign:'center', marginBottom:32, background:'rgba(245,213,72,0.04)'}}>
                <p className="dim" style={{fontSize:14, marginBottom:16}}>
                  댓글 작성은 <strong className="gold">로그인한 회원</strong>만 가능합니다.
                </p>
                <div style={{display:'flex', gap:10, justifyContent:'center'}}>
                  <button type="button" className="btn btn-gold btn-small" onClick={() => go("login")}>로그인</button>
                  <button type="button" className="btn btn-small" onClick={() => go("signup")}>회원가입</button>
                </div>
              </div>
            )}

            <CommentTree
              comments={comments}
              user={user}
              onDelete={removeComment}
              onReply={(parentId, text) => {
                if (!user || !text.trim()) return;
                const now = new Date();
                const pad = (n) => String(n).padStart(2, '0');
                window.BGNJ_COLUMNS.addComment(c.id, {
                  id: `comment-${Date.now()}-${Math.random().toString(36).slice(2,4)}`,
                  author: user.name,
                  authorId: user.id,
                  authorEmail: user.email,
                  date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
                  text: text.trim(),
                  parentId,
                });
                refresh();
              }}
            />
          </section>

          {/* prev / next */}
          <div style={{marginTop:60, paddingTop:40, borderTop:'1px solid var(--line-2)', display:'flex', justifyContent:'space-between', gap:24, flexWrap:'wrap'}}>
            {prevCol && (
              <div style={{cursor:'pointer', flex:1, minWidth:240}} onClick={() => setSelectedId(prevCol.id)}>
                <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>← 이전 칼럼</div>
                <div className="ko-serif gold" style={{fontSize:16}}>{prevCol.title}</div>
              </div>
            )}
            {nextCol && (
              <div style={{cursor:'pointer', textAlign:'right', flex:1, minWidth:240}} onClick={() => setSelectedId(nextCol.id)}>
                <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>다음 칼럼 →</div>
                <div className="ko-serif gold" style={{fontSize:16}}>{nextCol.title}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 아카이브 (목록) ────────────────────────────────────────────
  return (
    <div className="section">
      <div className="container">
        <div style={{textAlign:'center', marginBottom:48}}>
          <div className="section-eyebrow" style={{justifyContent:'center'}}>COLUMN · 뱅기노자의 글</div>
          <h1 className="section-title">
            <span className="accent">뱅기노자</span>가 쓰다
          </h1>
          <p className="section-subtitle" style={{margin:'16px auto 0'}}>
            커뮤니티장 뱅기노자의 정기 칼럼. 조선의 왕들을 경유해 오늘을 묻는다.
          </p>
        </div>

        {/* 검색 + 카테고리 */}
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:16, marginBottom:24, flexWrap:'wrap'}}>
          <label htmlFor="col-search" className="sr-only">칼럼 검색</label>
          <input id="col-search" className="field-input"
            placeholder="제목 · 발췌 · 본문 검색..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{width:280, padding:'10px 14px'}}/>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:12, marginBottom:48, flexWrap:'wrap'}}>
          {categories.map((c) => (
            <button key={c}
              type="button"
              onClick={() => setCategory(c)}
              style={{
                padding:'10px 20px',
                border: category === c ? '1px solid var(--gold)' : '1px solid var(--line-2)',
                color: category === c ? 'var(--gold)' : 'var(--ink-2)',
                background: 'transparent',
                fontSize:12,
                letterSpacing:'0.1em',
                cursor:'pointer',
              }}>{c}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{padding:48, textAlign:'center'}}>
            <p className="dim" style={{fontSize:14}}>조건에 맞는 칼럼이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filtered.map((c, i) => {
              const likes = window.BGNJ_COLUMNS.getLikes(c.id);
              const views = window.BGNJ_COLUMNS.getViews(c.id);
              const readTime = c.body?.text
                ? window.BGNJ_COLUMNS.estimateReadTime(c.body.text)
                : c.readTime;
              return (
                <div key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className="card"
                  style={{padding:0, cursor:'pointer', overflow:'hidden'}}>
                  <div className="placeholder" style={{aspectRatio:'4/3', borderLeft:'none', borderRight:'none', borderTop:'none', fontSize:9}}>
                    0{i+1}
                  </div>
                  <div style={{padding:28}}>
                    <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:12, flexWrap:'wrap'}}>
                      <span className="pill">{c.category}</span>
                      <span className="mono dim-2" style={{fontSize:10}}>{readTime}</span>
                      {likes.length > 0 && <span className="gold mono" style={{fontSize:10}}>♥{likes.length}</span>}
                      {views > 0 && <span className="dim-2 mono" style={{fontSize:10}}>조회 {views}</span>}
                    </div>
                    <h3 className="ko-serif" style={{fontSize:19, fontWeight:500, lineHeight:1.35, marginBottom:10, minHeight:50}}>
                      {c.title}
                    </h3>
                    <p className="dim" style={{fontSize:13, lineHeight:1.6, marginBottom:16}}>
                      {String(c.excerpt || '').slice(0, 90)}…
                    </p>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:16, borderTop:'1px solid var(--line)'}}>
                      <span className="mono dim-2" style={{fontSize:10}}>{c.date}</span>
                      <span className="gold mono" style={{fontSize:10, letterSpacing:'0.2em'}}>READ →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mono dim-2" style={{textAlign:'center', fontSize:10, letterSpacing:'0.2em', marginTop:32}}>
            총 {filtered.length}개 칼럼 · {category} {search && `· "${search}"`}
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { ColumnPage });

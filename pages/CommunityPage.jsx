// 커뮤니티 목록 + 게시글 상세 + 글 작성
// 글 작성은 TOAST UI Editor 사용 — 로그인 회원만 가능

// In-memory store for user-created posts (prototype only — prod: API call)
if (!window.WSD_USER_POSTS) window.WSD_USER_POSTS = [];
if (!window.WSD_COMMENTS) window.WSD_COMMENTS = {};

const CATEGORY_TABS = [
  { key: "all",  label: "전체" },
  { key: "공지", label: "공지" },
  { key: "자유", label: "자유" },
  { key: "질문", label: "질문" },
  { key: "정보", label: "정보" },
];

const CommunityPage = ({ go, postId, setPostId, user }) => {
  const data = window.WANGSADEUL_DATA;
  const [tab, setTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [writing, setWriting] = React.useState(false);

  // merged list: user-created posts appear first (newest)
  const allPosts = React.useMemo(() => {
    return [...window.WSD_USER_POSTS, ...data.posts];
  }, [writing]);

  if (writing) {
    return <PostCompose user={user} onCancel={() => setWriting(false)} onPublish={(p) => {
      window.WSD_USER_POSTS = [p, ...window.WSD_USER_POSTS];
      setWriting(false);
      setPostId(p.id);
    }}/>;
  }

  if (postId) {
    const post = allPosts.find(p => p.id === postId) || allPosts[0];
    return <PostDetail post={post} go={go} setPostId={setPostId} user={user}/>;
  }

  const filtered = allPosts.filter(p =>
    (tab === "all" || p.category === tab) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleWrite = () => {
    if (!user) {
      if (confirm("글쓰기는 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?")) {
        go("login");
      }
      return;
    }
    setWriting(true);
  };

  return (
    <div className="section">
      <div className="container">
        <header style={{marginBottom:40}}>
          <div className="section-eyebrow" aria-hidden="true">COMMUNITY · 커뮤니티</div>
          <h1 className="section-title">다섯 봉우리 <span className="accent">광장</span></h1>
          <p className="section-subtitle">왕사들이 모여 나누는 이야기. 질문도 답도 환영합니다.</p>
        </header>

        {/* Toolbar */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, gap:24, flexWrap:'wrap'}}>
          <div role="tablist" aria-label="게시판 분류"
            style={{display:'flex', gap:0, borderBottom:'1px solid var(--line)'}}>
            {CATEGORY_TABS.map(t => (
              <button key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding:'14px 24px',
                  fontSize:13,
                  letterSpacing:'0.1em',
                  color: tab === t.key ? 'var(--gold)' : 'var(--ink-2)',
                  borderBottom: tab === t.key ? '1px solid var(--gold)' : '1px solid transparent',
                  marginBottom:-1,
                }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{display:'flex', gap:12}}>
            <label htmlFor="community-search" className="sr-only">게시글 검색</label>
            <input id="community-search"
              placeholder="검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="field-input"
              style={{width:200, padding:'10px 14px'}}/>
            <button type="button" className="btn btn-gold btn-small" onClick={handleWrite}
              aria-label={user ? "새 글쓰기" : "로그인 후 글쓰기"}>
              {user ? '글쓰기 ＋' : '로그인 후 글쓰기'}
            </button>
          </div>
        </div>

        {/* Pinned notices */}
        <div style={{marginBottom:32}}>
          {data.notices.filter(n => n.pinned).map(n => (
            <div key={n.id} className="row"
              role="button" tabIndex={0}
              aria-label={`공지: ${n.title}`}
              onClick={() => go("community")}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go("community"); } }}
              style={{background:'rgba(212,175,55,0.04)', paddingLeft:16, paddingRight:16}}>
              <div className="row-num gold" aria-hidden="true">◆</div>
              <div>
                <span className="badge badge-gold" style={{marginRight:12}}>{n.tag}</span>
                <span className="row-title">{n.title}</span>
              </div>
              <div className="row-meta"><time dateTime={n.date.replace(/\./g,'-')}>{n.date}</time></div>
              <div className="gold" aria-hidden="true">→</div>
            </div>
          ))}
        </div>

        {/* Post list as real table — screen readers announce columns */}
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <caption className="sr-only">게시글 목록 — 제목 클릭 시 상세로 이동</caption>
          <thead>
            <tr style={{fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
              <th scope="col" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:60}}>번호</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:90}}>분류</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)'}}>제목</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:120}}>작성자</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'right', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:70}}>댓글</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'right', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:70}}>조회</th>
              <th scope="col" style={{padding:'16px 8px', textAlign:'right', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:100}}>날짜</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id}
                style={{borderBottom:'1px solid var(--line)', cursor:'pointer', transition:'background .2s'}}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td className="mono dim-2" style={{padding:'18px 8px', fontSize:12}}>{String(filtered.length - i).padStart(3, '0')}</td>
                <td style={{padding:'18px 8px'}}><span className="badge">{p.category}</span></td>
                <td style={{padding:'18px 8px', fontFamily:'var(--font-serif)', fontSize:15}}>
                  <button type="button"
                    onClick={() => setPostId(p.id)}
                    style={{all:'unset', cursor:'pointer', textAlign:'left'}}>
                    {p.title}
                    {p.hot && <span className="gold" style={{marginLeft:8, fontSize:10}} aria-label="HOT 게시물">HOT</span>}
                    {p._new && <span className="gold" style={{marginLeft:8, fontSize:10}} aria-label="새 게시물">NEW</span>}
                  </button>
                </td>
                <td className="mono dim" style={{padding:'18px 8px', fontSize:12}}>{p.author}</td>
                <td className="mono dim-2" style={{padding:'18px 8px', fontSize:12, textAlign:'right'}}>{p.replies ?? 0}</td>
                <td className="mono dim-2" style={{padding:'18px 8px', fontSize:12, textAlign:'right'}}>{p.views ?? 0}</td>
                <td className="mono dim-2" style={{padding:'18px 8px', fontSize:11, textAlign:'right'}}>
                  <time dateTime={p.date.replace(/\./g,'-')}>{p.date}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <nav aria-label="페이지 탐색" style={{display:'flex', justifyContent:'center', gap:4, marginTop:40}}>
          {["<", "1", "2", "3", "4", "5", ">"].map((n, i) => (
            <button key={i}
              type="button"
              aria-label={n === "<" ? "이전 페이지" : n === ">" ? "다음 페이지" : `${n}페이지`}
              aria-current={n === "1" ? "page" : undefined}
              style={{
                width:36, height:36,
                border: n === "1" ? '1px solid var(--gold)' : '1px solid var(--line)',
                color: n === "1" ? 'var(--gold)' : 'var(--ink-2)',
                fontSize:12,
                fontFamily:'var(--font-mono)',
              }}>{n}</button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// === Post Compose (TOAST UI Editor) =====================================
const PostCompose = ({ user, onCancel, onPublish }) => {
  const editorHost = React.useRef(null);
  const editorInst = React.useRef(null);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("자유");
  const [error, setError] = React.useState("");

  // Detect dark mode preference — apply TOAST UI dark theme (site is dark-themed)
  React.useEffect(() => {
    if (!editorHost.current || !window.toastui?.Editor) return;
    const editor = new window.toastui.Editor({
      el: editorHost.current,
      height: '520px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      placeholder: '내용을 입력하세요...',
      theme: 'dark',
      usageStatistics: false,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task'],
        ['link'],
        ['code', 'codeblock'],
        ['scrollSync'],
      ],
    });
    editorInst.current = editor;
    return () => { try { editor.destroy(); } catch (e) {} };
  }, []);

  const submit = () => {
    if (!title.trim()) { setError("제목을 입력해주세요."); return; }
    const md = editorInst.current?.getMarkdown() || "";
    const html = editorInst.current?.getHTML() || "";
    if (!md.trim()) { setError("본문을 입력해주세요."); return; }
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    onPublish({
      id: `u-${Date.now()}`,
      category,
      title: title.trim(),
      author: user?.name || "익명",
      replies: 0,
      views: 0,
      date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())}`,
      _new: true,
      _userCreated: true,
      body: { md, html },
    });
  };

  return (
    <div className="section">
      <div className="container" style={{maxWidth:960}}>
        <header style={{marginBottom:32}}>
          <div className="section-eyebrow" aria-hidden="true">COMPOSE · 글쓰기</div>
          <h1 className="section-title" style={{fontSize:36}}>새 글 작성</h1>
          <p className="dim" style={{fontSize:13, marginTop:8}}>
            작성자: <span className="gold">{user?.name || '익명'}</span> · 게시 전 운영진 검토를 거칠 수 있습니다.
          </p>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); submit(); }}
          aria-labelledby="compose-heading" noValidate>
          <h2 id="compose-heading" className="sr-only">글 작성 폼</h2>

          <div style={{display:'grid', gridTemplateColumns:'140px 1fr', gap:16, marginBottom:20}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="post-cat">분류</label>
              <select id="post-cat" className="field-input"
                value={category}
                onChange={e => setCategory(e.target.value)}>
                <option value="자유">자유</option>
                <option value="질문">질문</option>
                <option value="정보">정보</option>
              </select>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="post-title">제목 <span aria-hidden="true" className="gold">*</span><span className="sr-only">(필수)</span></label>
              <input id="post-title" className="field-input"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required aria-required="true"
                maxLength={120}/>
            </div>
          </div>

          <div className="field" style={{marginBottom:16}}>
            <label className="field-label" htmlFor="post-editor">본문 <span aria-hidden="true" className="gold">*</span><span className="sr-only">(필수)</span></label>
            <div id="post-editor" ref={editorHost} aria-label="본문 에디터"
              style={{border:'1px solid var(--line-2)'}}/>
          </div>

          {error && (
            <div role="alert" style={{padding:'12px 16px', background:'rgba(194,74,61,0.1)', border:'1px solid var(--danger)', color:'var(--danger)', fontSize:13, marginBottom:16}}>
              {error}
            </div>
          )}

          <div style={{display:'flex', gap:12, justifyContent:'flex-end', paddingTop:20, borderTop:'1px solid var(--line)'}}>
            <button type="button" className="btn" onClick={onCancel}>취소</button>
            <button type="submit" className="btn btn-gold">게시하기 →</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// === Post Detail — readability-focused ==================================
const PostDetail = ({ post, go, setPostId, user }) => {
  const [comment, setComment] = React.useState("");
  const [likes, setLikes] = React.useState(post._userCreated ? 0 : 42);
  const [liked, setLiked] = React.useState(false);
  const [commentsList, setCommentsList] = React.useState(() => {
    if (window.WSD_COMMENTS[post.id]) return window.WSD_COMMENTS[post.id];
    if (post._userCreated) return [];
    return [
      { author: "돌담아래",  date: "2026.04.17 14:22", text: "깊이 있는 글 감사합니다. 특히 '어좌 뒤에서 바라본 것' 부분이 마음에 와닿네요." },
      { author: "고궁지기",  date: "2026.04.17 16:05", text: "창덕궁 후원 답사 후 다시 읽으니 완전히 다르게 보입니다. 뱅기노자 선생님 칼럼의 힘인 것 같아요." },
      { author: "역사애호",  date: "2026.04.18 09:10", text: "관련해서 질문이 있습니다. 정조대의 기록에서 유사한 사례를 찾아볼 수 있을까요?" },
    ];
  });

  const submitComment = (e) => {
    e.preventDefault();
    if (!user) return;
    const trimmed = comment.trim();
    if (!trimmed) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const next = [...commentsList, {
      author: user.name,
      date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      text: trimmed,
    }];
    setCommentsList(next);
    window.WSD_COMMENTS[post.id] = next;
    setComment("");
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
            fontFamily:'var(--font-serif)',
            fontSize:'clamp(28px, 3.5vw, 44px)',
            fontWeight:500,
            lineHeight:1.25,
            letterSpacing:'-0.01em',
            marginBottom:24,
            textWrap:'balance'
          }}>
            {post.title}
          </h1>
          <div style={{display:'flex', gap:24, alignItems:'center', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-3)', flexWrap:'wrap'}}>
            <span className="gold" aria-label="작성자">{post.author}</span>
            <time dateTime={post.date.replace(/\./g,'-')}>{post.date}</time>
            <span>조회 {post.views ?? 0}</span>
            <span>댓글 {commentsList.length}</span>
          </div>
        </header>

        {post._userCreated && post.body?.html ? (
          <div className="post-body"
            // User-submitted content — in prod, sanitize with DOMPurify before render.
            // TOAST UI's getHTML escapes basic input; this is prototype scope.
            dangerouslySetInnerHTML={{__html: post.body.html}}/>
        ) : (
          <div className="post-body">
            <p>
              어제 창덕궁 후원 야간 답사를 다녀왔습니다. 원래 낮에만 가봤던 곳이어서, 해가 떨어진 후의 공간이 어떻게 다르게 다가올지 반신반의했는데요.
            </p>
            <p>
              관람정 앞에 섰을 때, 문득 왕이 이 자리에서 무엇을 보았을까 — 라는 질문이 떠올랐습니다. 낮의 후원은 관상의 대상이지만, 밤의 후원은 사유의 공간이었을 것 같다는 인상을 받았습니다.
            </p>
            <blockquote>
              <p>"왕의 자리가 아니라 왕이 바라본 길을 따라가라."</p>
              <cite>— 뱅기노자, 『왕의길』 서문</cite>
            </blockquote>
            <p>
              뱅기노자 선생님께서 가이드해주신 '어좌 뒤에서 바라본 것' 파트가 특히 인상 깊었습니다. 일월오봉도가 단순한 배경이 아니라 왕이 매일 마주해야 했던 우주론이었다는 해석이, 이 어둠 속에서 훨씬 더 설득력 있게 다가왔습니다.
            </p>
            <p>
              다음 답사가 벌써 기다려집니다. 함께하신 분들 덕분에 더욱 풍성한 시간이었습니다.
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{display:'flex', gap:12, justifyContent:'center', margin:'60px 0', paddingTop:32, borderTop:'1px solid var(--line)'}}>
          <button type="button" className="btn"
            aria-pressed={liked}
            onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
            style={{borderColor: liked ? 'var(--gold)' : undefined, color: liked ? 'var(--gold)' : undefined}}>
            <span aria-hidden="true">♥</span> 공감 <span aria-live="polite">{likes}</span>
          </button>
          <button type="button" className="btn">공유</button>
          <button type="button" className="btn">신고</button>
        </div>

        {/* Comments */}
        <section aria-labelledby="comments-heading">
          <h2 id="comments-heading" className="ko-serif" style={{fontSize:22, marginBottom:24}}>
            댓글 <span className="gold">{commentsList.length}</span>
          </h2>

          {user ? (
            <form onSubmit={submitComment} style={{marginBottom:32}}>
              <label htmlFor="comment-input" className="sr-only">댓글 입력</label>
              <textarea
                id="comment-input"
                className="field-input"
                placeholder="생각을 나누어 주세요..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{minHeight:100, resize:'vertical', marginBottom:12}}/>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span className="dim-2 mono" style={{fontSize:11}}>
                  {user.name}(으)로 등록됩니다
                </span>
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

          <ol style={{listStyle:'none', padding:0, margin:0}}>
            {commentsList.map((c, i) => (
              <li key={i} style={{padding:'24px 0', borderBottom:'1px solid var(--line)'}}>
                <div style={{display:'flex', gap:16, alignItems:'center', marginBottom:10}}>
                  <span className="gold mono" style={{fontSize:12, letterSpacing:'0.1em'}}>{c.author}</span>
                  <time className="mono dim-2" style={{fontSize:11}}>{c.date}</time>
                </div>
                <p style={{fontFamily:'var(--font-serif)', fontSize:15, lineHeight:1.8, color:'var(--ink)'}}>{c.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
};

Object.assign(window, { CommunityPage });

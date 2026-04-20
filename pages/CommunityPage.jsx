// 커뮤니티 목록 + 게시글 상세
const CommunityPage = ({ go, postId, setPostId }) => {
  const data = window.WANGSADEUL_DATA;
  const [tab, setTab] = React.useState("all");
  const [search, setSearch] = React.useState("");

  if (postId) {
    const post = data.posts.find(p => p.id === postId) || data.posts[0];
    return <PostDetail post={post} go={go} setPostId={setPostId}/>;
  }

  const filtered = data.posts.filter(p =>
    (tab === "all" || p.category === tab) &&
    (!search || p.title.includes(search))
  );

  const tabs = [
    { key: "all", label: "전체" },
    { key: "공지", label: "공지" },
    { key: "자유", label: "자유" },
    { key: "질문", label: "질문" },
    { key: "정보", label: "정보" },
  ];

  return (
    <div className="section">
      <div className="container">
        <div style={{marginBottom:40}}>
          <div className="section-eyebrow">COMMUNITY · 커뮤니티</div>
          <h1 className="section-title">다섯 봉우리 <span className="accent">광장</span></h1>
          <p className="section-subtitle">왕사들이 모여 나누는 이야기. 질문도 답도 환영합니다.</p>
        </div>

        {/* Toolbar */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, gap:24, flexWrap:'wrap'}}>
          <div style={{display:'flex', gap:0, borderBottom:'1px solid var(--line)'}}>
            {tabs.map(t => (
              <button key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding:'14px 24px',
                  fontSize:13,
                  letterSpacing:'0.1em',
                  color: tab === t.key ? 'var(--gold)' : 'var(--ink-2)',
                  borderBottom: tab === t.key ? '1px solid var(--gold)' : '1px solid transparent',
                  marginBottom:-1,
                  transition:'all .2s',
                }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{display:'flex', gap:12}}>
            <input
              placeholder="검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="field-input"
              style={{width:200, padding:'10px 14px'}}/>
            <button className="btn btn-gold btn-small">글쓰기</button>
          </div>
        </div>

        {/* Pinned notices */}
        <div style={{marginBottom:32}}>
          {data.notices.filter(n => n.pinned).map(n => (
            <div key={n.id} className="row" style={{background:'rgba(212,175,55,0.04)', paddingLeft:16, paddingRight:16}}>
              <div className="row-num gold">◆</div>
              <div>
                <span className="badge badge-gold" style={{marginRight:12}}>{n.tag}</span>
                <span className="row-title">{n.title}</span>
              </div>
              <div className="row-meta">{n.date}</div>
              <div className="gold">→</div>
            </div>
          ))}
        </div>

        {/* Post list */}
        <div style={{borderTop:'1px solid var(--line-2)'}}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'60px 100px 1fr 120px 80px 80px 100px',
            gap:24,
            padding:'16px 0',
            borderBottom:'1px solid var(--line)',
            fontFamily:'var(--font-mono)',
            fontSize:10,
            letterSpacing:'0.2em',
            color:'var(--ink-3)',
            textTransform:'uppercase'
          }}>
            <div>번호</div>
            <div>분류</div>
            <div>제목</div>
            <div>작성자</div>
            <div style={{textAlign:'right'}}>댓글</div>
            <div style={{textAlign:'right'}}>조회</div>
            <div style={{textAlign:'right'}}>날짜</div>
          </div>
          {filtered.map((p, i) => (
            <div key={p.id}
              onClick={() => setPostId(p.id)}
              style={{
                display:'grid',
                gridTemplateColumns:'60px 100px 1fr 120px 80px 80px 100px',
                gap:24,
                padding:'18px 0',
                borderBottom:'1px solid var(--line)',
                alignItems:'center',
                cursor:'pointer',
                transition:'background .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div className="mono dim-2" style={{fontSize:12}}>{String(filtered.length - i).padStart(3, '0')}</div>
              <div><span className="badge">{p.category}</span></div>
              <div style={{fontFamily:'var(--font-serif)', fontSize:15}}>
                {p.title}
                {p.hot && <span className="gold" style={{marginLeft:8, fontSize:10}}>HOT</span>}
                {p.replies > 20 && <span className="dim-2 mono" style={{marginLeft:8, fontSize:10}}>[{p.replies}]</span>}
              </div>
              <div className="mono dim" style={{fontSize:12}}>{p.author}</div>
              <div className="mono dim-2" style={{fontSize:12, textAlign:'right'}}>{p.replies}</div>
              <div className="mono dim-2" style={{fontSize:12, textAlign:'right'}}>{p.views}</div>
              <div className="mono dim-2" style={{fontSize:11, textAlign:'right'}}>{p.date}</div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{display:'flex', justifyContent:'center', gap:4, marginTop:40}}>
          {["<", "1", "2", "3", "4", "5", ">"].map((n, i) => (
            <button key={i}
              style={{
                width:36, height:36,
                border: n === "1" ? '1px solid var(--gold)' : '1px solid var(--line)',
                color: n === "1" ? 'var(--gold)' : 'var(--ink-2)',
                fontSize:12,
                fontFamily:'var(--font-mono)',
              }}>{n}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PostDetail = ({ post, go, setPostId }) => {
  const [comment, setComment] = React.useState("");
  const [likes, setLikes] = React.useState(42);
  const [liked, setLiked] = React.useState(false);
  const comments = [
    { author: "돌담아래", date: "2026.04.17 14:22", text: "깊이 있는 글 감사합니다. 특히 '어좌 뒤에서 바라본 것' 부분이 마음에 와닿네요." },
    { author: "고궁지기", date: "2026.04.17 16:05", text: "창덕궁 후원 답사 후 다시 읽으니 완전히 다르게 보입니다. 뱅기노자 선생님 칼럼의 힘인 것 같아요." },
    { author: "역사애호", date: "2026.04.18 09:10", text: "관련해서 질문이 있습니다. 정조대의 기록에서 유사한 사례를 찾아볼 수 있을까요?" },
  ];

  return (
    <div className="section">
      <div className="container" style={{maxWidth:900}}>
        <button className="btn-ghost" onClick={() => setPostId(null)}
          style={{marginBottom:32, cursor:'pointer', color:'var(--ink-2)', fontSize:12, letterSpacing:'0.1em'}}>
          ← 목록으로
        </button>

        <div style={{borderBottom:'1px solid var(--line-2)', paddingBottom:32, marginBottom:40}}>
          <div style={{display:'flex', gap:12, marginBottom:20}}>
            <span className="badge badge-gold">{post.category}</span>
            {post.hot && <span className="badge">HOT</span>}
          </div>
          <h1 style={{fontFamily:'var(--font-serif)', fontSize:38, fontWeight:500, lineHeight:1.25, marginBottom:24}}>
            {post.title}
          </h1>
          <div style={{display:'flex', gap:24, alignItems:'center', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-3)'}}>
            <span className="gold">{post.author}</span>
            <span>{post.date}</span>
            <span>조회 {post.views}</span>
            <span>댓글 {post.replies}</span>
          </div>
        </div>

        <article style={{fontFamily:'var(--font-serif)', fontSize:17, lineHeight:2, color:'var(--ink)'}}>
          <p style={{marginBottom:24}}>
            어제 창덕궁 후원 야간 답사를 다녀왔습니다. 원래 낮에만 가봤던 곳이어서, 해가 떨어진 후의 공간이 어떻게 다르게 다가올지 반신반의했는데요.
          </p>
          <p style={{marginBottom:24}}>
            관람정 앞에 섰을 때, 문득 왕이 이 자리에서 무엇을 보았을까 — 라는 질문이 떠올랐습니다. 낮의 후원은 관상의 대상이지만, 밤의 후원은 사유의 공간이었을 것 같다는 인상을 받았습니다.
          </p>
          <blockquote style={{borderLeft:'2px solid var(--gold)', paddingLeft:24, margin:'32px 0', color:'var(--gold-ink)', fontStyle:'italic'}}>
            "왕의 자리가 아니라 왕이 바라본 길을 따라가라."<br/>
            <span className="mono" style={{fontSize:12, color:'var(--ink-3)', fontStyle:'normal'}}>— 뱅기노자, 『왕의길』 서문</span>
          </blockquote>
          <p style={{marginBottom:24}}>
            뱅기노자 선생님께서 가이드해주신 '어좌 뒤에서 바라본 것' 파트가 특히 인상 깊었습니다. 일월오봉도가 단순한 배경이 아니라 왕이 매일 마주해야 했던 우주론이었다는 해석이, 이 어둠 속에서 훨씬 더 설득력 있게 다가왔습니다.
          </p>
          <p style={{marginBottom:24}}>
            다음 답사가 벌써 기다려집니다. 함께하신 분들 덕분에 더욱 풍성한 시간이었습니다.
          </p>
        </article>

        {/* Actions */}
        <div style={{display:'flex', gap:12, justifyContent:'center', margin:'60px 0', paddingTop:32, borderTop:'1px solid var(--line)'}}>
          <button className="btn" onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
            style={{borderColor: liked ? 'var(--gold)' : undefined, color: liked ? 'var(--gold)' : undefined}}>
            ♥ 공감 {likes}
          </button>
          <button className="btn">공유</button>
          <button className="btn">신고</button>
        </div>

        {/* Comments */}
        <div>
          <h3 className="ko-serif" style={{fontSize:22, marginBottom:24}}>
            댓글 <span className="gold">{comments.length}</span>
          </h3>

          <div style={{marginBottom:32}}>
            <textarea
              className="field-input"
              placeholder="생각을 나누어 주세요..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{minHeight:100, resize:'vertical', marginBottom:12}}/>
            <div style={{display:'flex', justifyContent:'flex-end'}}>
              <button className="btn btn-gold btn-small">등록</button>
            </div>
          </div>

          {comments.map((c, i) => (
            <div key={i} style={{padding:'24px 0', borderBottom:'1px solid var(--line)'}}>
              <div style={{display:'flex', gap:16, alignItems:'center', marginBottom:10}}>
                <span className="gold mono" style={{fontSize:12, letterSpacing:'0.1em'}}>{c.author}</span>
                <span className="mono dim-2" style={{fontSize:11}}>{c.date}</span>
              </div>
              <p style={{fontFamily:'var(--font-serif)', fontSize:15, lineHeight:1.8}}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CommunityPage });

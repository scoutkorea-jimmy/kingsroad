// 뱅기노자 칼럼 아카이브
// v00.287 ESM (main) — cross-module import (전역 결합 제거).
import { CommentTree } from './CommunityPage.jsx';

const ColumnPage = ({ go, user }) => {
  const [tick, setTick] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("전체");
  const [comment, setComment] = React.useState("");
  const [shareMsg, setShareMsg] = React.useState("");
  // v00.169 — admin 전용 글쓰기 모달 (사용자 요청 '뱅기노자 칼럼에 글쓰기 버튼 활성화').
  const [writerOpen, setWriterOpen] = React.useState(false);
  // v00.234 — admin 전용 칼럼 수정 (선택된 칼럼 객체 → 모달).
  const [editColumn, setEditColumn] = React.useState(null);
  const isAdmin = !!user?.isAdmin;

  const refresh = () => setTick((v) => v + 1);

  // v00.278 — 데이터 번들 로드 전(BGNJ_COLUMNS 미정의) 첫 렌더 크래시 방지 — 가드 + 배열 보장.
  const _arr = (fn) => { try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; } };
  const publicColumns = React.useMemo(
    () => _arr(() => window.BGNJ_COLUMNS?.listPublic?.()),
    [tick]
  );
  const categories = React.useMemo(
    () => ["전체", ...Array.from(new Set(publicColumns.map((c) => c.category)))],
    [publicColumns]
  );
  const filtered = React.useMemo(
    () => _arr(() => window.BGNJ_COLUMNS?.searchPublic?.({ query: search, category })),
    [search, category, tick]
  );

  // 외부 진입 (해시 / 마이페이지 / 알림 등)으로 들어오는 칼럼 ID
  React.useEffect(() => {
    let pending = null;
    try { pending = sessionStorage.getItem("bgnj_pending_column_id"); } catch {}  // bgnj-allow-silent — 저장소 읽기 — 실패 시 기본값
    if (pending) {
      try { sessionStorage.removeItem("bgnj_pending_column_id"); } catch {}  // bgnj-allow-silent — 저장소 정리
      setSelectedId(pending);
    }
  }, []);

  // v00.169 — 홈 '＋ 글쓰기' 진입 → 모달 자동 오픈 (admin 전용 플래그).
  React.useEffect(() => {
    let pendingWrite = null;
    try { pendingWrite = sessionStorage.getItem("bgnj_pending_column_write"); } catch {}  // bgnj-allow-silent — 저장소 읽기 — 실패 시 기본값
    if (pendingWrite) {
      try { sessionStorage.removeItem("bgnj_pending_column_write"); } catch {}  // bgnj-allow-silent — 저장소 정리
      if (user?.isAdmin) setWriterOpen(true);
    }
  }, [user]);

  // v00.134 — 칼럼 데이터 동기화. boot.jsx Promise.allSettled 가 비동기 완료
  // 또는 admin 탭에서 BGNJ_BROADCAST 발화 → 자동 새로고침. 사용자 보고
  // '칼럼도 있는데 자꾸 사라지네' — listener 누락이 원인.
  React.useEffect(() => {
    // 진입 시 1회 강제 동기.
    Promise.resolve(window.BGNJ_COLUMNS?.refresh?.()).finally(() => refresh());
    const onR = () => refresh();
    window.addEventListener('bgnj-columns-refresh', onR);
    return () => window.removeEventListener('bgnj-columns-refresh', onR);
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
    } catch {}  // bgnj-allow-silent — 저장소 읽기 — 실패 시 기본값
  }, [selectedId]);

  const requireLogin = async (label) => {
    if ((await window.BGNJ_CONFIRM(`${label}은(는) 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?`, { danger: true }))) {
      go("login");
    }
  };

  const handleLike = async () => {
    if (!user) return requireLogin("공감");
    await window.BGNJ_COLUMNS.toggleLike(selectedId, user.id);
    refresh();
  };

  const handleShare = async () => {
    // v00.219 — 공유 URL 단축: #col-{id} → #col-{N} (일련번호). 보내기 쉽고 짧음.
    const num = window.BGNJ_COLUMNS?.numberOf?.(selectedId);
    const slug = num ? `col-${num}` : `col-${selectedId}`;
    const url = `${location.origin}${location.pathname}#${slug}`;
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
    const G = window.BGNJ_GUARD;
    const likes = G.arr(() => window.BGNJ_COLUMNS?.getLikes?.(c.id));
    const liked = !!user && likes.includes(user.id);
    const views = G.num(() => window.BGNJ_COLUMNS?.getViews?.(c.id), 0);
    const comments = G.arr(() => window.BGNJ_COLUMNS?.listComments?.(c.id));
    const readTime = c.body?.text
      ? window.BGNJ_COLUMNS.estimateReadTime(c.body.text)
      : c.readTime;

    return (
      <div className="section">
        <div className="container" style={{maxWidth:760}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:8}}>
            <button className="btn-ghost" onClick={() => setSelectedId(null)}
              style={{cursor:'pointer', color:'var(--ink-2)', fontSize:12, letterSpacing:'0.1em'}}>
              ← 아카이브로
            </button>
            {/* v00.234 — admin 전용 프론트 칼럼 수정 진입로. 모달은 admin 번들의 AdminColumnEditor 사용. */}
            {isAdmin && (
              <button type="button" className="btn btn-small"
                style={{fontSize:11, padding:'4px 10px'}}
                onClick={() => setEditColumn(c)}>
                ✎ 칼럼 수정
              </button>
            )}
          </div>
          <div style={{textAlign:'center', marginBottom:40}}>
            {/* v00.219 — 칼럼 일련번호. 공유 URL #col-N 과 동일 번호. */}
            {(() => {
              const num = window.BGNJ_COLUMNS?.numberOf?.(c.id);
              return num ? (
                <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:14}}>
                  COLUMN #{String(num).padStart(3, '0')}
                </div>
              ) : null;
            })()}
            <span className="pill">{c.category}</span>
            <h1 style={{fontFamily:'var(--font-serif)', fontSize:48, fontWeight:500, lineHeight:1.2, margin:'20px 0 16px'}}>
              {c.title}
            </h1>
            <div style={{display:'flex', gap:20, justifyContent:'center', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-3)', flexWrap:'wrap'}}>
              <span className="gold">{c.author || '뱅기노자'}</span>
              {/* v00.136 — 작성일 KST. createdAt 없으면 date(YYYY.MM.DD) 폴백. */}
              <span>{c.createdAt ? window.BGNJ_FMT.kstShort(c.createdAt) : (c.date || '')}</span>
              <span>읽는 시간 · {readTime}</span>
              <span>조회 {views}</span>
              <span>공감 {likes.length}</span>
              <span>댓글 {comments.length}</span>
            </div>
          </div>
          {/* v00.136 — 칼럼 대표이미지 + 출처 표기 (사용자 요청). coverUrl 있으면 표시. */}
          {c.coverUrl && (
            <div style={{marginBottom:40}}>
              <img src={c.coverUrl} alt={c.title || '칼럼 대표 이미지'}
                style={{width:'100%', display:'block', objectFit:'cover'}}/>
              {c.coverCredit && (
                <div className="mono dim-2" style={{fontSize:10, textAlign:'right', marginTop:6, letterSpacing:'0.08em'}}>
                  © {c.coverCredit}
                </div>
              )}
            </div>
          )}
          {!c.coverUrl && !c.body?.html && (
            <div className="placeholder" style={{aspectRatio:'16/9', marginBottom:40, fontSize:11}}>
              COLUMN HERO IMAGE · 1600×900
            </div>
          )}
          {/* v00.133 — 본문 폰트 가벼움. 사용자 요청 '본문 내용은 좀 얇은 폰트였으면'.
              fontWeight 300 (Noto Serif KR Light) + 부제목 발췌도 light italic. */}
          <article style={{fontFamily:'var(--font-serif)', fontSize:18, lineHeight:2, color:'var(--ink)', fontWeight:300}}>
            <p style={{fontSize:22, lineHeight:1.7, color:'var(--secondary)', marginBottom:32, fontStyle:'italic', fontWeight:300}}>
              {c.excerpt}
            </p>
            {c.body?.html ? (
              <div dangerouslySetInnerHTML={{ __html: window.BGNJ_SAFE_HTML(c.body.html) }} />
            ) : (
              <>
                <p style={{marginBottom:28}}>
                  조선의 왕들은 매일 아침 같은 풍경을 마주했다. 어좌에 오르면 등 뒤에는 언제나 다섯 봉우리가 펼쳐져 있었고, 해와 달이 동시에 떠 있었다. 자연에서는 불가능한 일이 왕의 자리에서는 매일 일어났다.
                </p>
                <p style={{marginBottom:28}}>
                  어좌 뒤 다섯 봉우리 병풍은 단순한 장식이 아니다. 그것은 장치다. 왕으로 하여금 매일 우주를 떠올리게 하는 장치, 자신이 누구를 위해 앉아 있는지를 잊지 못하게 하는 장치였다.
                </p>
                <h3 style={{fontSize:24, fontWeight:500, margin:'48px 0 20px', color:'var(--primary-hover)'}}>다섯 봉우리의 의미</h3>
                <p style={{marginBottom:28}}>
                  다섯이라는 숫자에는 이유가 있다. 오행(五行) — 목화토금수. 한 왕조가 우주의 질서와 일치한다는 선언이자, 동시에 그 질서를 흔들면 정통성을 잃는다는 경고이기도 했다.
                </p>
                <blockquote style={{borderLeft:'3px solid var(--primary)', paddingLeft:32, margin:'40px 0', fontStyle:'italic', color:'var(--secondary)'}}>
                  왕이라는 자리는 저절로 서 있는 것이 아니다.<br/>
                  다섯 봉우리가 매일 그를 일으켜 세웠다.
                </blockquote>
                <p style={{marginBottom:28}}>
                  오늘을 사는 우리에게 그 병풍은 더 이상 배경이 아니다. 그것은 하나의 질문이다 — 당신의 자리 뒤에는 무엇이 있는가.
                </p>
              </>
            )}
          </article>

          {/* v00.127 — 외부 기고처 + 원문 링크 (옵셔널). 본문 끝, 액션 위. */}
          {(c.sourceCredit || c.sourceUrl) && (
            <div style={{marginTop:48, paddingTop:24, borderTop:'1px solid var(--line)', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-3)'}}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>SOURCE · 출처</div>
              {c.sourceUrl ? (
                <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer"
                  style={{color:'var(--primary-hover)', textDecoration:'underline'}}>
                  {c.sourceCredit || c.sourceUrl} <span aria-hidden="true" style={{marginLeft:4}}>↗</span>
                </a>
              ) : (
                <span style={{color:'var(--ink-2)'}}>{c.sourceCredit}</span>
              )}
            </div>
          )}

          {/* 액션 — 공감 / 공유 */}
          <div style={{display:'flex', gap:12, justifyContent:'center', margin:'60px 0 32px', paddingTop:32, borderTop:'1px solid var(--line)', flexWrap:'wrap'}}>
            <button type="button" className="btn" aria-pressed={liked} onClick={handleLike}
              style={{borderColor: liked ? 'var(--primary)' : undefined, color: liked ? 'var(--primary)' : undefined}}>
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
              <div role="button" tabIndex={0}
                aria-label={`이전 칼럼: ${prevCol.title}`}
                style={{cursor:'pointer', flex:1, minWidth:240}}
                onClick={() => setSelectedId(prevCol.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedId(prevCol.id); } }}>
                <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>← 이전 칼럼</div>
                <div className="ko-serif gold" style={{fontSize:16}}>{prevCol.title}</div>
              </div>
            )}
            {nextCol && (
              <div role="button" tabIndex={0}
                aria-label={`다음 칼럼: ${nextCol.title}`}
                style={{cursor:'pointer', textAlign:'right', flex:1, minWidth:240}}
                onClick={() => setSelectedId(nextCol.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedId(nextCol.id); } }}>
                <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>다음 칼럼 →</div>
                <div className="ko-serif gold" style={{fontSize:16}}>{nextCol.title}</div>
              </div>
            )}
          </div>
        </div>
        {/* v00.234 — admin 전용 칼럼 수정 모달. detail view 안에서도 진입 가능. */}
        {editColumn && isAdmin && <ColumnWriterModal onClose={() => setEditColumn(null)} initialColumn={editColumn}/>}
      </div>
    );
  }

  // ── 아카이브 (목록) ────────────────────────────────────────────
  return (
    <div className="section">
      <div className="container">
        <div style={{textAlign:'center', marginBottom:48}}>
          {(() => {
            // v00.073 — site_content_kv.columnIntro 에서 hero 읽기.
            const _i = (window.BGNJ_SITE_CONTENT?.get?.() || {}).columnIntro || {};
            const eb = _i.eyebrow || 'COLUMN · 뱅기노자의 글';
            const tp = _i.titlePrefix ?? '';
            const ta = _i.titleAccent ?? '뱅기노자';
            const ts = _i.titleSuffix ?? '가 쓰다';
            const sb = _i.subtitle || '커뮤니티장 뱅기노자의 정기 칼럼. 조선의 왕들을 경유해 오늘을 묻는다.';
            return (
              <>
                <div className="section-eyebrow" style={{justifyContent:'center'}}>{eb}</div>
                <h1 className="section-title">{tp}<span className="accent">{ta}</span>{ts}</h1>
                <p className="section-subtitle" style={{margin:'16px auto 0'}}>{sb}</p>
              </>
            );
          })()}
        </div>

        {/* 검색 + 카테고리 + (admin) 글쓰기 */}
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:16, marginBottom:24, flexWrap:'wrap'}}>
          <label htmlFor="col-search" className="sr-only">칼럼 검색</label>
          <input id="col-search" className="field-input"
            placeholder="제목 · 발췌 · 본문 검색..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{width:280, padding:'10px 14px'}}/>
          {/* v00.169 — admin 전용 글쓰기 진입. 비로그인/일반회원은 노출 X. */}
          {isAdmin && (
            <button type="button" className="btn btn-gold btn-small"
              onClick={() => setWriterOpen(true)}>
              ＋ 글쓰기
            </button>
          )}
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:12, marginBottom:48, flexWrap:'wrap'}}>
          {categories.map((c) => (
            <button key={c}
              type="button"
              onClick={() => setCategory(c)}
              style={{
                padding:'10px 20px',
                border: category === c ? '1px solid var(--primary)' : '1px solid var(--line-2)',
                color: category === c ? 'var(--primary)' : 'var(--ink-2)',
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
              const G = window.BGNJ_GUARD;
              const likes = G.arr(() => window.BGNJ_COLUMNS?.getLikes?.(c.id));
              const views = G.num(() => window.BGNJ_COLUMNS?.getViews?.(c.id), 0);
              const readTime = c.body?.text
                ? G.call(() => window.BGNJ_COLUMNS?.estimateReadTime?.(c.body.text), c.readTime)
                : c.readTime;
              return (
                <div key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className="card"
                  style={{padding:0, cursor:'pointer', overflow:'hidden'}}>
                  {/* v00.140 — coverUrl 있으면 표시, 없으면 placeholder. 사용자 보고 '대표이미지 설정했는데 반영 안 됨'. */}
                  {c.coverUrl ? (
                    <div style={{aspectRatio:'4/3', borderBottom:'1px solid var(--line)', overflow:'hidden', background:'var(--bg-2)'}}>
                      <img src={c.coverUrl} alt={c.title || '칼럼 대표 이미지'}
                        loading="lazy"
                        style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
                    </div>
                  ) : (
                    <div className="placeholder" style={{aspectRatio:'4/3', borderLeft:'none', borderRight:'none', borderTop:'none', fontSize:9}}>
                      0{i+1}
                    </div>
                  )}
                  <div style={{padding:28}}>
                    <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:12, flexWrap:'wrap'}}>
                      {/* v00.219 — 일련번호 #NNN. 공유 URL 의 #col-N 과 동일. */}
                      {(() => {
                        const num = window.BGNJ_COLUMNS?.numberOf?.(c.id);
                        return num ? <span className="mono gold" style={{fontSize:10, letterSpacing:'0.16em'}}>#{String(num).padStart(3, '0')}</span> : null;
                      })()}
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

      {/* v00.169 — admin 전용 칼럼 작성 모달. 저장 시 bgnj-columns-refresh 이벤트가 위 useEffect 에서 청취되어 자동 새로고침. */}
      {writerOpen && isAdmin && <ColumnWriterModal onClose={() => setWriterOpen(false)}/>}
    </div>
  );
};

// v00.169 — admin 전용 칼럼 작성 모달 (ColumnPage 진입 경로). admin 콘솔의 ColumnEditorModalContent 와 동일 패턴.
// v00.210 — admin 번들이 lazy-load 라 ColumnPage 에서 첫 진입 시 AdminColumnEditor 가 undefined.
//           모달 mount 시 BGNJ_LOAD_ADMIN() 호출 + bgnj-admin-scripts-loaded 이벤트 청취해 리렌더.
// v00.234 — initialColumn prop 으로 edit 모드 확장. AdminColumnEditor 가 이미 prop 지원.
const ColumnWriterModal = ({ onClose, initialColumn = null }) => {
  const isEdit = !!initialColumn?.id;
  const [payload, setPayload] = React.useState(null);
  const [adminTick, setAdminTick] = React.useState(0); // admin 번들 로드 완료 시 리렌더용
  const [loadError, setLoadError] = React.useState(false);
  const dirty = !!(payload && (payload.title?.trim() || payload.text?.trim()));
  const saveDraft = () => {
    if (!payload) return;
    try {
      // v00.294.009 — 두 가지가 겹쳐 있었다.
      // ① save() 는 인자를 **하나**(객체) 만 받는데 ('column', {...}) 로 두 개를 넘겼다.
      //    첫 인자인 문자열이 payload 로 들어가 kind 가 비고, 글자들이 흩어져 저장됐다.
      //    → list('column') 이 kind 로 거르므로 임시저장 목록에 **영영 안 나왔다.**
      // ② 실패해도 catch {} 로 삼켜서 저장이 안 된 사실 자체를 알 수 없었다.
      window.BGNJ_DRAFTS?.save?.({
        kind: 'column',
        title: payload.title || '',
        category: payload.category || '',
        excerpt: payload.excerpt || '',
        html: payload.html || '',
        text: payload.text || '',
        publishAt: payload.publishAt || '',
      });
      window.BGNJ_TOAST?.success?.('임시저장됐습니다.');
    } catch (err) {
      console.warn('[column draft] 임시저장 실패:', err);
      window.BGNJ_TOAST?.error?.(
        String(err?.name || '').includes('Quota')
          ? '임시저장 공간이 가득 찼습니다. 지난 임시저장 글을 지우거나 발행해 주세요.'
          : '임시저장에 실패했습니다. 창을 닫기 전에 발행해 주세요.'
      );
    }
  };
  // v00.210 — admin 번들 로드 트리거 + 리렌더
  React.useEffect(() => {
    if (window.AdminColumnEditor) return; // 이미 로드됨
    const onLoaded = () => setAdminTick((v) => v + 1);
    window.addEventListener('bgnj-admin-scripts-loaded', onLoaded);
    if (typeof window.BGNJ_LOAD_ADMIN === 'function') {
      window.BGNJ_LOAD_ADMIN().catch(() => setLoadError(true));
    } else {
      setLoadError(true);
    }
    return () => window.removeEventListener('bgnj-admin-scripts-loaded', onLoaded);
  }, []);
  const guard = window.useModalGuard?.({
    open: true, dirty, onClose, onSaveDraft: saveDraft, label: '칼럼',
  }) || {};
  const Editor = window.AdminColumnEditor;
  return (
    <div role="dialog" aria-modal="true" aria-label="칼럼 작성"
      onClick={guard.onBackdropClick}
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'grid', placeItems:'start center', padding:24, overflowY:'auto'}}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width:'min(1100px, 100%)', background:'var(--bg)', boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
        padding:24, marginTop:24, marginBottom:48,
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14}}>
          <h2 className="ko-serif" style={{fontSize:18, margin:0}}>{isEdit ? '칼럼 수정' : '새 칼럼 작성'}</h2>
          <button type="button" className="btn btn-small" onClick={async () => {
            const ok = !dirty || (await window.BGNJ_CONFIRM('작성 중인 내용을 임시저장 후 닫으시겠어요?', { hint: '[확인]=임시저장 후 닫기 / [취소]=그냥 닫기', confirmLabel: '임시저장' }));
            if (ok && dirty) saveDraft();
            onClose?.();
          }}>닫기</button>
        </div>
        {Editor ? (
          <Editor
            initialColumn={initialColumn || undefined}
            onPayloadChange={setPayload}
            onAfterSave={(status) => {
              if (status === 'published' || status === 'scheduled') onClose?.();
            }}/>
        ) : loadError ? (
          <div style={{padding:24, fontSize:13, lineHeight:1.7}}>
            <div className="mono" style={{fontSize:11, color:'var(--danger)', marginBottom:6}}>EDITOR_LOAD_FAILED</div>
            <p className="dim">에디터를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.</p>
          </div>
        ) : (
          <p className="dim" style={{padding:24}}>에디터 로딩 중... <span className="mono dim-2" style={{fontSize:10, marginLeft:4}}>tick {adminTick}</span></p>
        )}
      </div>
    </div>
  );
};

// (window 노출 제거 — ESM 전환)

// v00.287 ESM (main) — 라우터용 export (window 병행).
export { ColumnPage };

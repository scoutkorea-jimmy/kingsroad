// === 독자 리뷰 서브컴포넌트 ============================================
const STARS = ['★', '★★', '★★★', '★★★★', '★★★★★'];

// v00.159 — helper 직접 호출 race 가드. mount-time 호출(useState 초기화)이 helper 미로드 시 throw → 페이지 전체 다운.
const _G = window.BGNJ_GUARD || {
  call: (fn, fb) => { try { const v = fn(); return v == null ? fb : v; } catch { return fb; } },
  arr: (fn) => { try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; } },
};

const BookReviewSection = ({ user, bookTitle }) => {
  // v00.153 — 책 제목 동적화. props 미전달 시 빈 문자열로 안전 폴백.
  const _t = bookTitle || '책';
  // v00.159 — helper 미로드 race 가드.
  const [reviews, setReviews] = React.useState(() => _G.arr(() => window.BGNJ_BOOK_ORDERS?.listReviews?.()));
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const canReview = !!(user && window.BGNJ_BOOK_ORDERS?.canReview?.(user.id));
  const hasReviewed = !!(user && window.BGNJ_BOOK_ORDERS?.hasReviewed?.(user.id));

  // v00.278 — addReview 는 async. await 누락 시 result 가 Promise → 항상 실패하던 버그 수정.
  const submit = async () => {
    setError(''); setSuccess('');
    try {
      const result = await window.BGNJ_BOOK_ORDERS.addReview({ userId: user?.id, userName: user?.name, rating, text });
      if (!result?.ok) { setError(result?.message || '리뷰 등록에 실패했습니다.'); return; }
      setReviews(_G.arr(() => window.BGNJ_BOOK_ORDERS?.listReviews?.()));
      setText(''); setSuccess('리뷰가 등록되었습니다. 감사합니다.');
    } catch (err) { setError(err?.body?.error || err?.message || '리뷰 등록에 실패했습니다.'); }
  };

  const remove = async (reviewId) => {
    if (!(await window.BGNJ_CONFIRM('이 리뷰를 삭제하시겠습니까?', { danger: true }))) return;
    window.BGNJ_BOOK_ORDERS.deleteReview(reviewId);
    setReviews(window.BGNJ_BOOK_ORDERS.listReviews());
  };

  const isAdmin = user?.isAdmin;

  return (
    <div>
      {/* 작성 폼 */}
      {canReview && !hasReviewed && (
        <div className="card" style={{padding:24, marginBottom:28}}>
          <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:12}}>WRITE REVIEW · 리뷰 작성</div>
          <div style={{display:'flex', gap:8, marginBottom:14, alignItems:'center'}}>
            <span className="dim" style={{fontSize:13}}>별점</span>
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setRating(n)}
                style={{fontSize:20, color: n <= rating ? 'var(--primary)' : 'var(--line-2)', background:'none', border:'none', cursor:'pointer', padding:'0 2px'}}>
                ★
              </button>
            ))}
            <span className="gold mono" style={{fontSize:12, marginLeft:4}}>{rating}/5</span>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder={`『${_t}』을 읽고 느낀 점을 자유롭게 써 주세요.`}
            className="field-input" rows={3}
            style={{width:'100%', resize:'vertical', padding:12, fontSize:14, lineHeight:1.7}}/>
          {error && <p style={{color:'var(--danger)', fontSize:13, marginTop:8}}>{error}</p>}
          {success && <p className="gold" style={{fontSize:13, marginTop:8}}>{success}</p>}
          <button type="button" className="btn btn-gold" style={{marginTop:12}} onClick={submit}>리뷰 등록</button>
        </div>
      )}
      {hasReviewed && (
        <p className="dim" style={{fontSize:13, marginBottom:20}}>이미 리뷰를 작성하셨습니다.</p>
      )}
      {!user && (
        <p className="dim" style={{fontSize:13, marginBottom:20}}>리뷰는 『{_t}』 배송 완료 회원만 작성할 수 있습니다.</p>
      )}
      {user && !canReview && !hasReviewed && (
        <p className="dim" style={{fontSize:13, marginBottom:20}}>배송 완료된 주문이 확인되면 리뷰를 작성할 수 있습니다.</p>
      )}

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <p className="dim" style={{fontSize:14, padding:'24px 0'}}>아직 등록된 리뷰가 없습니다. 첫 리뷰를 남겨 보세요.</p>
      ) : (
        reviews.map(r => (
          <div key={r.id} style={{padding:'20px 0', borderBottom:'1px solid var(--line)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8}}>
              <div style={{display:'flex', gap:12, alignItems:'center'}}>
                <span className="gold" style={{fontSize:16}}>{STARS[r.rating - 1]}</span>
                <span className="mono dim-2" style={{fontSize:11}}>{r.userName}</span>
                <span className="mono dim-2" style={{fontSize:10}}>{window.BGNJ_FMT.kstDate(r.createdAt)}</span>
              </div>
              {(isAdmin || user?.id === r.userId) && (
                <button type="button" className="btn-ghost"
                  onClick={() => remove(r.id)}
                  style={{fontSize:11, color:'var(--danger)'}}>삭제</button>
              )}
            </div>
            <p className="ko-serif" style={{fontSize:15, lineHeight:1.8}}>{r.text}</p>
          </div>
        ))
      )}
    </div>
  );
};

// 책 구매 페이지
// v00.153 — 다권 지원. 책 ≥2권일 때 상단 책 선택 탭 노출.
// 데이터 원칙: BGNJ_BOOKS.list({status:'published'}). primary 우선 → order. 시드(BANGINOJA_DATA.book) 직접 참조 금지.
const BookPage = ({ go, cart, setCart, user }) => {
  const G = window.BGNJ_GUARD;
  const [tick, setTick] = React.useState(0);
  // 책 정보가 서버에서 도착하면 재렌더
  React.useEffect(() => {
    const onR = () => setTick((v) => v + 1);
    window.addEventListener('bgnj-books-refresh', onR);
    return () => window.removeEventListener('bgnj-books-refresh', onR);
  }, []);
  const books = React.useMemo(() => {
    const all = G.arr(() => window.BGNJ_BOOKS?.list?.({ status: 'published' }));
    return all.slice().sort((a, b) => {
      if (a.primary && !b.primary) return -1;
      if (!a.primary && b.primary) return 1;
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [tick]);
  const [selectedId, setSelectedId] = React.useState(null);
  // books 변경 시 selectedId 가 유효하지 않으면 첫 권으로 폴백.
  React.useEffect(() => {
    if (books.length === 0) return;
    if (!selectedId || !books.find((b) => b.id === selectedId)) {
      setSelectedId(books[0].id);
    }
  }, [books, selectedId]);
  const book = books.find((b) => b.id === selectedId) || books[0] || null;
  const [version, setVersion] = React.useState("KR");
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState("소개");
  // 책 변경 시 판본/수량/탭 초기화 — 새 책의 판매 가능 판본이 다를 수 있음.
  React.useEffect(() => {
    setVersion("KR"); setQty(1); setTab("소개");
  }, [selectedId]);

  if (!book) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:560, textAlign:'center', padding:'80px 20px'}}>
          <p style={{fontSize:14, color:'var(--ink-2)'}}>책 정보를 불러오는 중입니다…</p>
        </div>
      </div>
    );
  }

  const price = version === "KR" ? (book.priceKR || 0) : (book.priceEN || 0);

  const addToCart = () => {
    // v00.154 — cart 에 bookId 포함. CheckoutPage 가 책 lookup 하여 다권 cart-flow 지원.
    setCart({ bookId: book.id, version, qty, price });
    go("checkout");
  };

  return (
    <div className="section">
      <div className="container">
        {/* v00.162 — 칼럼 패턴 hero. site_content_kv.bookIntro 에서 admin 편집 가능. */}
        <div style={{textAlign:'center', marginBottom:48}}>
          {(() => {
            const _i = (window.BGNJ_SITE_CONTENT?.get?.() || {}).bookIntro || {};
            const eb = _i.eyebrow || 'BOOKS · 뱅기노자 도서';
            const tp = _i.titlePrefix ?? '';
            const ta = _i.titleAccent ?? '뱅기노자';
            const ts = _i.titleSuffix ?? '가 짓다';
            const sb = _i.subtitle || '한국의 역사와 풍경을, 책으로.';
            return (
              <>
                <div className="section-eyebrow" style={{justifyContent:'center'}}>{eb}</div>
                <h1 className="section-title">{tp}<span className="accent">{ta}</span>{ts}</h1>
                <p className="section-subtitle" style={{margin:'16px auto 0'}}>{sb}</p>
              </>
            );
          })()}
        </div>
        {/* v00.153 — 다권 책 선택 탭. ≥2권일 때만 노출. */}
        {books.length > 1 && (
          <div style={{
            display:'flex', gap:0, borderBottom:'1px solid var(--line)',
            marginBottom:48, overflowX:'auto',
          }}>
            {books.map((b) => (
              <button key={b.id}
                type="button"
                onClick={() => setSelectedId(b.id)}
                style={{
                  padding:'14px 28px',
                  fontFamily:'var(--font-serif)', fontSize:16,
                  color: b.id === book.id ? 'var(--primary)' : 'var(--ink-2)',
                  borderBottom: b.id === book.id ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom:-1, whiteSpace:'nowrap',
                  background:'none', border:'none', borderBottomWidth:2,
                  borderBottomStyle:'solid',
                  borderBottomColor: b.id === book.id ? 'var(--primary)' : 'transparent',
                  cursor:'pointer',
                }}>
                『{b.title}』
              </button>
            ))}
          </div>
        )}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:80}} className="book-grid">
          {/* LEFT: cover — v00.151 실제 book.coverDataUri 우선, 없으면 generic placeholder.
              v00.221 — 모바일에서 sticky 해제 (.book-cover-col CSS 가 max-width:900px 에서 position:static 강제). */}
          <div className="book-cover-col" style={{position:'sticky', top:100, alignSelf:'start'}}>
            <div style={{position:'relative', maxWidth:440, margin:'0 auto'}}>
              {book.coverDataUri ? (
                <div style={{aspectRatio:'3/4', border:'1px solid var(--primary-dim)', overflow:'hidden', background:'var(--bg-2)'}}>
                  <img src={book.coverDataUri} alt={`${book.title} 표지`}
                    style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}}/>
                </div>
              ) : (
                <div className="placeholder" style={{
                  aspectRatio:'3/4',
                  background:`linear-gradient(135deg, var(--bg-3), #000),
                    repeating-linear-gradient(45deg, rgba(245,213,72,0.06) 0 6px, transparent 6px 12px)`,
                  border:'1px solid var(--primary-dim)',
                  display:'flex', flexDirection:'column', justifyContent:'space-between',
                  padding:'40px 32px', fontSize:12, color:'var(--primary)',
                }}>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', marginBottom:8}}>BANGINOJA PRESS</div>
                    <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.2em'}}>{version === "KR" ? "KR EDITION" : "EN EDITION"}</div>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontFamily:'var(--font-serif)', fontSize:36, color:'var(--primary-hover)', lineHeight:1.2}}>
                      {book.title}
                    </div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', marginTop:20, color:'var(--ink-2)'}}>
                      — {book.author || '뱅기노자'} —
                    </div>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <BanginojaIcon size={28}/>
                  </div>
                </div>
              )}
              {/* subtle shadow offset */}
              <div style={{position:'absolute', top:16, left:16, right:-16, bottom:-16, border:'1px solid var(--line-2)', zIndex:-1}}/>
            </div>

            {/* v00.147 — thumbnails 는 실제 표지 / 뒷표지 / PDF 미리보기 자산이 있을 때만 노출.
                사용자 요청 '본문 미리보기 없으면 노출하지 말고 보여주지 마'. */}
            {(book.coverDataUri || book.backCoverDataUri || book.pdfPreviewDataUri) && (
              <div style={{display:'flex', gap:12, justifyContent:'center', marginTop:32}}>
                {book.coverDataUri && (
                  <div style={{width:60, aspectRatio:'3/4', border:'1px solid var(--line)', overflow:'hidden'}}>
                    <img src={book.coverDataUri} alt="앞표지" style={{width:'100%', height:'100%', objectFit:'contain'}}/>
                  </div>
                )}
                {book.backCoverDataUri && (
                  <div style={{width:60, aspectRatio:'3/4', border:'1px solid var(--line)', overflow:'hidden'}}>
                    <img src={book.backCoverDataUri} alt="뒷표지" style={{width:'100%', height:'100%', objectFit:'contain'}}/>
                  </div>
                )}
                {book.pdfPreviewDataUri && (
                  <a href={book.pdfPreviewDataUri} target="_blank" rel="noopener noreferrer"
                    style={{width:60, aspectRatio:'3/4', border:'1px solid var(--primary-dim)', display:'grid', placeItems:'center', textDecoration:'none', color:'var(--primary)', fontSize:9, padding:4, textAlign:'center', lineHeight:1.3}}
                    title="본문 미리보기 (PDF)">
                    📄<br/>본문<br/>미리보기
                  </a>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: purchase panel */}
          <div>
            <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:16}}>NEW RELEASE · 2026</div>
            {/* v00.188 a11y — 페이지 h1 은 hero(line 170). 책 제목은 h2 로 위계. */}
            <h2 style={{fontFamily:'var(--font-serif)', fontSize:56, fontWeight:500, lineHeight:1.05, marginBottom:12}}>
              『<span className="gold">{book.title}</span>』
            </h2>
            {/* v00.199 — 사용자 요청 '책 어떤 정보들을 노출할지 선택'. site_content_kv.bookFieldVisibility[id] 가 false 인 항목은 숨김. */}
            {(() => {
              const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
              const map = sc.bookFieldVisibility || {};
              const vis = map[book.id] || map[String(book.id)] || {};
              const show = (key) => vis[key] !== false; // 기본 true
              return (
                <>
                  {show('subtitle') && book.subtitle && (
                    <div className="ko-serif dim" style={{fontSize:20, marginBottom:24, fontStyle:'italic'}}>
                      {book.subtitle}
                    </div>
                  )}
                  {(show('author') || show('publisher') || show('pages')) && (
                    <div style={{display:'flex', gap:24, paddingBottom:24, borderBottom:'1px solid var(--line)', marginBottom:32, fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-2)', flexWrap:'wrap'}}>
                      {show('author') && book.author && (
                        <div><span className="dim-2">저자</span> <span className="gold">{book.author}</span></div>
                      )}
                      {show('publisher') && book.publisher && (
                        <div><span className="dim-2">출판</span> {book.publisher}</div>
                      )}
                      {show('pages') && book.pages > 0 && (
                        <div><span className="dim-2">쪽수</span> {book.pages}p</div>
                      )}
                      {show('isbn') && book.isbn && (
                        <div><span className="dim-2">ISBN</span> {book.isbn}</div>
                      )}
                    </div>
                  )}
                </>
              );
            })()}

            <p className="dim" style={{fontSize:15, lineHeight:1.9, marginBottom:32}}>{book.desc}</p>

            {/* version selector */}
            <div style={{marginBottom:24}}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12, textTransform:'uppercase'}}>
                판본 선택
              </div>
              {/* v00.151 — 입력된 가격만 노출. priceEN 0/null 이면 영문판 버튼 자체 hide.
                  v00.199 — bookFieldVisibility.priceKR/priceEN false 면 해당 판본 버튼 숨김. */}
              {(() => {
                const _sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
                const _vis = (_sc.bookFieldVisibility || {})[book.id] || (_sc.bookFieldVisibility || {})[String(book.id)] || {};
                const versions = [];
                if (Number(book.priceKR) > 0 && _vis.priceKR !== false) versions.push({ k: 'KR', label: '국문판', sub: 'Korean', price: book.priceKR });
                if (Number(book.priceEN) > 0 && _vis.priceEN !== false) versions.push({ k: 'EN', label: '영문판', sub: 'English', price: book.priceEN });
                if (versions.length === 0) return <p className="dim" style={{fontSize:13}}>판매 준비 중입니다.</p>;
                return (
                  <div style={{display:'grid', gridTemplateColumns: versions.length === 1 ? '1fr' : '1fr 1fr', gap:12}}>
                    {versions.map(v => (
                      <button key={v.k}
                        onClick={() => setVersion(v.k)}
                        style={{
                          padding:'20px',
                          border: version === v.k ? '1px solid var(--primary)' : '1px solid var(--line-2)',
                          background: version === v.k ? 'rgba(245,213,72,0.05)' : 'transparent',
                          textAlign:'left',
                          cursor:'pointer',
                        }}>
                        <div className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: version === v.k ? 'var(--primary)' : 'var(--ink-3)'}}>{v.sub.toUpperCase()}</div>
                        <div className="ko-serif" style={{fontSize:20, marginTop:4}}>{v.label}</div>
                        <div className="gold-2 ko-serif" style={{fontSize:20, marginTop:8}}>{window.BGNJ_FMT.won(v.price)}</div>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* qty */}
            <div style={{marginBottom:32}}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12, textTransform:'uppercase'}}>수량</div>
              <div style={{display:'flex', alignItems:'center', gap:0, border:'1px solid var(--line-2)', width:'fit-content'}}>
                <button style={{width:44, height:44, color:'var(--ink-2)', borderRight:'1px solid var(--line-2)'}} onClick={() => setQty(Math.max(1, qty-1))}>−</button>
                <div style={{width:60, textAlign:'center'}} className="ko-serif">{qty}</div>
                <button style={{width:44, height:44, color:'var(--ink-2)', borderLeft:'1px solid var(--line-2)'}} onClick={() => setQty(qty+1)}>+</button>
              </div>
            </div>

            {/* total */}
            <div style={{padding:'24px 0', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
              <span className="mono dim-2" style={{letterSpacing:'0.2em', fontSize:11}}>TOTAL</span>
              <span className="ko-serif gold-2" style={{fontSize:36}}>{window.BGNJ_FMT.won(price * qty)}</span>
            </div>

            <div style={{display:'flex', gap:12}}>
              <button className="btn btn-gold btn-block" onClick={addToCart}>바로 구매</button>
              <button className="btn btn-block">장바구니</button>
            </div>

            {/* Tabs */}
            <div style={{marginTop:60, borderTop:'1px solid var(--line-2)', paddingTop:40}}>
              <div style={{display:'flex', gap:0, borderBottom:'1px solid var(--line)', marginBottom:32}}>
                {["소개", "목차", "저자", "리뷰"].map(t => (
                  <button key={t}
                    onClick={() => setTab(t)}
                    style={{
                      padding:'14px 24px',
                      fontFamily:'var(--font-serif)',
                      fontSize:15,
                      color: tab === t ? 'var(--primary)' : 'var(--ink-2)',
                      borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
                      marginBottom:-1,
                    }}>{t}</button>
                ))}
              </div>

              {tab === "소개" && (
                <div style={{fontFamily:'var(--font-serif)', fontSize:15, lineHeight:1.9, color:'var(--ink-2)'}}>
                  {/* v00.153 — book.intro 우선, 없으면 desc 폴백, 둘 다 없으면 안내. 줄바꿈 공백 보존. */}
                  {(book.intro || book.desc) ? (
                    <p style={{whiteSpace:'pre-wrap', margin:0}}>{book.intro || book.desc}</p>
                  ) : (
                    <p className="dim" style={{fontSize:13}}>책 소개가 아직 입력되지 않았습니다.</p>
                  )}
                </div>
              )}
              {tab === "목차" && (() => {
                // v00.155 — chapters string[] 그룹핑. '- ' 로 시작하면 직전 챕터의 sub-item.
                // 데이터 구조 변경 없이 표시만 그룹화. 첫 줄이 sub 면 챕터로 격상 (데이터 손실 방지).
                const groupChapters = (chapters) => {
                  const out = [];
                  for (const raw of (Array.isArray(chapters) ? chapters : [])) {
                    if (typeof raw !== 'string') continue;
                    const trimmed = raw.replace(/^\s+/, '');
                    if (trimmed.startsWith('- ')) {
                      const sub = trimmed.slice(2).trim();
                      if (!sub) continue;
                      if (out.length === 0) { out.push({ title: sub, items: [] }); continue; }
                      out[out.length - 1].items.push(sub);
                    } else if (trimmed) {
                      out.push({ title: trimmed, items: [] });
                    }
                  }
                  return out;
                };
                const groups = groupChapters(book.chapters);
                if (groups.length === 0) {
                  return <p style={{fontSize:13, color:'var(--ink-3)', padding:'16px 0'}}>목차 정보가 아직 입력되지 않았습니다.</p>;
                }
                return (
                  <div>
                    {groups.map((g, i) => (
                      <div key={i} style={{padding:'16px 0', borderBottom:'1px solid var(--line)', display:'flex', gap:24}}>
                        <span className="mono" style={{width:40, fontSize:12, color:'var(--secondary)', fontWeight:700, flexShrink:0}}>{String(i+1).padStart(2,'0')}</span>
                        <div style={{flex:1, minWidth:0}}>
                          <div className="ko-serif" style={{fontSize:17}}>{g.title}</div>
                          {g.items.length > 0 && (
                            <ul style={{margin:'10px 0 0 0', padding:0, listStyle:'none', display:'grid', gap:4}}>
                              {g.items.map((it, j) => (
                                <li key={j} className="dim" style={{fontSize:14, lineHeight:1.7, paddingLeft:16, position:'relative'}}>
                                  <span aria-hidden="true" style={{position:'absolute', left:0, top:0, color:'var(--ink-3)'}}>·</span>
                                  {it}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
              {tab === "저자" && (
                <div style={{display:'flex', gap:24, alignItems:'flex-start'}}>
                  <div className="placeholder" style={{width:140, aspectRatio:'3/4', flexShrink:0}}>{book.author || '저자'}</div>
                  <div>
                    <h4 className="ko-serif gold" style={{fontSize:22, marginBottom:12}}>{book.author || '저자 미입력'}</h4>
                    {/* v00.153 — book.authorBio 사용. 없으면 안내. */}
                    {book.authorBio ? (
                      <p className="dim" style={{fontSize:14, lineHeight:1.9, whiteSpace:'pre-wrap'}}>{book.authorBio}</p>
                    ) : (
                      <p className="dim" style={{fontSize:13}}>저자 소개가 아직 입력되지 않았습니다.</p>
                    )}
                  </div>
                </div>
              )}
              {tab === "리뷰" && <BookReviewSection user={user} bookTitle={book.title} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 결제 페이지 — 회원 전용 + 무통장 입금 단일 흐름
// v00.154 — cart.bookId 로 책 lookup, 폴백 primary(). 모든 표기 동적.
const CheckoutPage = ({ go, cart, user }) => {
  const G = window.BGNJ_GUARD;
  const book = G.call(() => {
    const id = cart?.bookId;
    return (id && window.BGNJ_BOOKS?.get?.(id)) || window.BGNJ_BOOKS?.primary?.() || null;
  }, null);
  const version = cart ? cart.version : "KR";
  const qty = cart ? cart.qty : 1;
  const unit = book ? (version === "EN" ? (book.priceEN || 0) : (book.priceKR || 0)) : 0;
  const subtotal = unit * qty;
  const shipping = subtotal >= 30000 ? 0 : 3000;
  const total = subtotal + shipping;

  const bank = G.call(() => window.BGNJ_LECTURES?.getBankAccount?.() || window.BGNJ_STORES?.bankAccount, {});
  const [selectedBankId, setSelectedBankId] = React.useState(null);
  const [recipient, setRecipient] = React.useState(user?.name || "");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [addressDetail, setAddressDetail] = React.useState("");
  const [memo, setMemo] = React.useState("");
  const [cashReceipt, setCashReceipt] = React.useState(() => window.BGNJ_CashReceipt?.empty?.() || { requested: false, type: 'personal', identifier: '' });
  const [error, setError] = React.useState("");
  const [submittedOrder, setSubmittedOrder] = React.useState(null);
  // v00.262.002 — 이중 제출 가드(A1). 더블클릭/엔터 중복으로 같은 주문 2건 INSERT 되는 사고 방지.
  // worker 측 idempotency-key 가 없으므로 클라이언트 single-submit guard 가 1차 방어선.
  const [submitting, setSubmitting] = React.useState(false);

  // 책 정보 미로드 — 서버에서 도착 전이거나 D1.books 가 비어 있음.
  if (!book) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:560, textAlign:'center', padding:'80px 20px'}}>
          <p style={{fontSize:14, color:'var(--ink-2)'}}>책 정보를 불러오는 중입니다…</p>
        </div>
      </div>
    );
  }

  // 비로그인 차단 안내
  if (!user) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:560, textAlign:'center', padding:'80px 20px'}}>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:16}}>CHECKOUT · 결제</div>
          <h1 className="ko-serif" style={{fontSize:32, marginBottom:20}}>회원 전용 주문</h1>
          <p className="dim" style={{fontSize:15, lineHeight:1.8, marginBottom:32}}>
            『{book.title}』 주문은 <strong className="gold">회원가입한 분</strong>만 가능합니다.
            로그인 후 다시 시도해 주세요.
          </p>
          <div style={{display:'flex', gap:10, justifyContent:'center'}}>
            <button className="btn btn-gold" onClick={() => go('login')}>로그인</button>
            <button className="btn" onClick={() => go('signup')}>회원가입</button>
            <button className="btn btn-ghost" onClick={() => go('book')}>책 정보로 돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:560, textAlign:'center', padding:'80px 20px'}}>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:16}}>CHECKOUT · 결제</div>
          <h1 className="ko-serif" style={{fontSize:32, marginBottom:20}}>장바구니가 비어 있습니다</h1>
          <p className="dim" style={{fontSize:15, lineHeight:1.8, marginBottom:32}}>
            바로 결제 화면으로 들어온 상태입니다. 책 정보를 확인한 뒤 다시 주문을 진행해 주세요.
          </p>
          <div style={{display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap'}}>
            <button className="btn btn-gold" onClick={() => go('book')}>책 정보로 이동</button>
            <button className="btn" onClick={() => go('home')}>홈으로</button>
          </div>
        </div>
      </div>
    );
  }

  // 주문 완료 화면
  if (submittedOrder) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:600, textAlign:'center'}}>
          <div style={{marginBottom:40, display:'inline-block'}}>
            <BanginojaIcon size={60}/>
          </div>
          <div className="mono gold" style={{fontSize:12, letterSpacing:'0.3em', marginBottom:16}}>ORDER RECEIVED</div>
          <h1 style={{fontFamily:'var(--font-serif)', fontSize:40, fontWeight:500, marginBottom:20}}>
            주문이 <span className="accent">접수</span>되었습니다
          </h1>
          <p className="dim" style={{fontSize:15, lineHeight:1.8, marginBottom:32}}>
            주문번호 <span className="gold mono">{submittedOrder.orderNo}</span><br/>
            아래 계좌로 입금이 확인되면 발송 준비를 시작합니다.
          </p>

          {/* 무통장 입금 안내 — picker (멀티 계좌 지원) */}
          <div style={{textAlign:'left', marginBottom:24}}>
            {window.BGNJ_BankAccountPicker
              ? <window.BGNJ_BankAccountPicker value={selectedBankId} onChange={setSelectedBankId}/>
              : null}
            <div style={{
              marginTop:10, padding:'12px 16px', background:'var(--bg-2)',
              border:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'baseline',
            }}>
              <span className="dim">입금 금액</span>
              <span className="gold ko-serif" style={{fontSize:22}}>{window.BGNJ_FMT.won(submittedOrder.total)}</span>
            </div>
            <p className="dim" style={{fontSize:12, lineHeight:1.7, marginTop:10}}>
              입금자명에 <strong className="gold">{submittedOrder.recipient}</strong> 또는 주문번호 <strong className="gold">{submittedOrder.orderNo}</strong>를 남겨 주세요.
            </p>
          </div>

          <div className="card" style={{textAlign:'left', marginBottom:32, padding:20}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:12}}>ORDER SUMMARY</div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
              <span className="dim">『{book.title}』 ({submittedOrder.version === "KR" ? "국문판" : "영문판"}) × {submittedOrder.qty}</span>
              <span>{window.BGNJ_FMT.won(submittedOrder.subtotal)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
              <span className="dim">배송비</span>
              <span>{submittedOrder.shipping === 0 ? '무료' : window.BGNJ_FMT.won(submittedOrder.shipping)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--line)', marginTop:6}}>
              <span>결제 금액</span>
              <span className="gold-2 ko-serif" style={{fontSize:22}}>{window.BGNJ_FMT.won(submittedOrder.total)}</span>
            </div>
            <div style={{marginTop:14, paddingTop:12, borderTop:'1px dashed var(--line)', fontSize:13, lineHeight:1.7}}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:6}}>SHIPPING TO</div>
              {submittedOrder.recipient} · {submittedOrder.phone}<br/>
              {submittedOrder.address}{submittedOrder.addressDetail && ` ${submittedOrder.addressDetail}`}
              {submittedOrder.memo && <div className="dim-2" style={{fontSize:12, marginTop:4}}>· {submittedOrder.memo}</div>}
            </div>
          </div>

          <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
            <button className="btn" onClick={() => go("home")}>홈으로</button>
            <button className="btn btn-gold" onClick={() => go("mypage")}>주문 내역 보기</button>
          </div>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return; // v00.262.002 — 이중 제출 차단
    setError("");
    if (!recipient.trim()) return setError("받는 분 이름을 입력해 주세요.");
    if (!phone.trim()) return setError("연락처를 입력해 주세요.");
    if (!address.trim()) return setError("기본 주소를 입력해 주세요.");
    setSubmitting(true);
    try {
      // v00.218 — 현금영수증 신청 정보를 memo prefix 로 인코딩 (백엔드 스키마 마이그레이션 전).
      const crPrefix = window.BGNJ_CashReceipt?.encode?.(cashReceipt) || '';
      const memoCombined = (crPrefix + (memo.trim() || '')).trim();
      const result = await window.BGNJ_BOOK_ORDERS.createOrder({
        userId: user.id,
        bookId: book.id,
        unit,
        version,
        qty,
        recipient: recipient.trim(),
        phone: phone.trim(),
        address: address.trim(),
        addressDetail: addressDetail.trim(),
        memo: memoCombined,
      });
      if (!result?.ok) { setSubmitting(false); return setError(result?.message || "주문 처리에 실패했습니다."); }
      setSubmittedOrder(result.order);
      // 성공 시 페이지가 submittedOrder 화면으로 전환되므로 submitting=false 불필요.
    } catch (err) {
      setError(err?.body?.error || err?.message || '주문 처리 중 오류');
      setSubmitting(false); // v00.262.002 — 실패 시 재시도 가능하도록 해제
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{marginBottom:32}}>
          {(() => {
            // v00.073 — site_content_kv.bookCheckoutIntro
            const _i = (window.BGNJ_SITE_CONTENT?.get?.() || {}).bookCheckoutIntro || {};
            const eb = _i.eyebrow || 'CHECKOUT · 결제';
            const tp = _i.titlePrefix ?? '주문 / ';
            const ta = _i.titleAccent ?? '결제';
            return (
              <>
                <div className="section-eyebrow">{eb}</div>
                <h1 className="section-title">{tp}<span className="accent">{ta}</span></h1>
              </>
            );
          })()}
          <p className="dim" style={{fontSize:13, lineHeight:1.8, marginTop:14, maxWidth:680}}>
            현재 결제 수단은 <strong className="gold">무통장 입금</strong>만 지원합니다. 주문 후 안내된 계좌로 입금하시면 운영자가 확인 후 발송을 시작합니다.
          </p>
        </div>

        <form onSubmit={submit} style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:60}}>
          <div>
            <h3 className="ko-serif" style={{fontSize:22, marginBottom:20}}>배송 정보</h3>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
              <div className="field">
                <label className="field-label" htmlFor="ck-name">받는 분 <span className="gold" aria-hidden="true">*</span></label>
                <input id="ck-name" className="field-input" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="이름"/>
              </div>
              <div className="field">
                <label className="field-label" htmlFor="ck-phone">연락처 <span className="gold" aria-hidden="true">*</span></label>
                <input id="ck-phone" className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000"/>
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="ck-addr">기본 주소 <span className="gold" aria-hidden="true">*</span></label>
              <input id="ck-addr" className="field-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="우편번호 + 기본 주소"/>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="ck-addr2">상세 주소</label>
              <input id="ck-addr2" className="field-input" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} placeholder="동/호수 등"/>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="ck-memo">배송 메모</label>
              <textarea id="ck-memo" className="field-input" value={memo} onChange={(e) => setMemo(e.target.value)}
                placeholder="부재 시 경비실에 맡겨주세요" style={{minHeight:80, resize:'vertical'}}/>
            </div>

            {/* v00.218 — 현금영수증 신청 */}
            {window.BGNJ_CashReceiptField && (
              <window.BGNJ_CashReceiptField value={cashReceipt} onChange={setCashReceipt}/>
            )}

            <h3 className="ko-serif" style={{fontSize:22, marginTop:24, marginBottom:14}}>결제 수단 — 무통장 입금</h3>
            {window.BGNJ_BankAccountPicker
              ? <window.BGNJ_BankAccountPicker value={selectedBankId} onChange={setSelectedBankId}/>
              : (
                <div className="dim" style={{fontSize:13, lineHeight:1.8, padding:'12px 14px', border:'1px solid var(--line)'}}>
                  운영자 계좌가 등록되어 있어야 주문이 진행됩니다.
                </div>
              )}
            <p className="dim" style={{fontSize:12, marginTop:10, lineHeight:1.7}}>
              주문 접수 후 위 계좌로 입금하시면 운영자가 확인하여 발송을 시작합니다.
            </p>

            {error && (
              <div role="alert" style={{padding:'12px 16px', background:'rgba(194,74,61,0.1)', border:'1px solid var(--danger)', color:'var(--danger)', fontSize:13, marginTop:20}}>
                {error}
              </div>
            )}

            <div style={{display:'flex', gap:12, marginTop:24}}>
              <button type="button" className="btn btn-block" onClick={() => go("book")}>← 책 정보</button>
              <button type="submit" className="btn btn-gold btn-block" disabled={submitting}
                style={submitting ? {opacity: 0.6, cursor: 'wait'} : undefined}>
                {submitting ? '주문 처리 중…' : `주문 접수 · ${window.BGNJ_FMT.won(total)}`}
              </button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card card-gold mobile-release-sticky" style={{position:'sticky', top:100}}>
              <div className="mono gold" style={{fontSize:10, letterSpacing:'0.3em', marginBottom:20}}>ORDER SUMMARY</div>
              <div style={{display:'flex', gap:16, marginBottom:24, paddingBottom:24, borderBottom:'1px solid var(--line)'}}>
                {book.coverDataUri ? (
                  <div style={{width:72, aspectRatio:'3/4', flexShrink:0, border:'1px solid var(--line-2)', overflow:'hidden'}}>
                    <img src={book.coverDataUri} alt={`${book.title} 표지`} style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}}/>
                  </div>
                ) : (
                  <div className="placeholder" style={{width:72, aspectRatio:'3/4', fontSize:8, flexShrink:0}}>{(book.title || '책').slice(0,1)}</div>
                )}
                <div>
                  <div className="ko-serif" style={{fontSize:17, marginBottom:4}}>『{book.title}』</div>
                  <div className="dim-2 mono" style={{fontSize:11}}>{version === "KR" ? "국문판" : "영문판"} · {qty}권</div>
                  <div className="gold ko-serif" style={{fontSize:16, marginTop:8}}>{window.BGNJ_FMT.won(subtotal)}</div>
                </div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', color:'var(--ink-2)'}}>
                <span>상품 합계</span>
                <span>{window.BGNJ_FMT.won(subtotal)}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', color:'var(--ink-2)'}}>
                <span>배송비</span>
                <span>{shipping === 0 ? "무료" : window.BGNJ_FMT.won(shipping)}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', padding:'16px 0', borderTop:'1px solid var(--line)', marginTop:8}}>
                <span>결제 금액</span>
                <span className="gold-2 ko-serif" style={{fontSize:24}}>{window.BGNJ_FMT.won(total)}</span>
              </div>

              <div style={{marginTop:24, padding:'16px', background:'rgba(245,213,72,0.04)', border:'1px dashed var(--primary-dim)'}}>
                <div className="mono gold" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>◆ 운영 안내</div>
                <div className="dim" style={{fontSize:12, lineHeight:1.7}}>
                  · 입금 확인 후 평일 1-2일 내 발송<br/>
                  · 주문 취소·환불은 마이페이지에서 요청
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

Object.assign(window, { BookPage, CheckoutPage });

// === 독자 리뷰 서브컴포넌트 ============================================
const STARS = ['★', '★★', '★★★', '★★★★', '★★★★★'];

const BookReviewSection = ({ user }) => {
  const [reviews, setReviews] = React.useState(() => window.BGNJ_BOOK_ORDERS.listReviews());
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const canReview = user && window.BGNJ_BOOK_ORDERS.canReview(user.id);
  const hasReviewed = user && window.BGNJ_BOOK_ORDERS.hasReviewed(user.id);

  const submit = () => {
    setError(''); setSuccess('');
    const result = window.BGNJ_BOOK_ORDERS.addReview({ userId: user?.id, userName: user?.name, rating, text });
    if (!result.ok) { setError(result.message); return; }
    setReviews(window.BGNJ_BOOK_ORDERS.listReviews());
    setText(''); setSuccess('리뷰가 등록되었습니다. 감사합니다.');
  };

  const remove = (reviewId) => {
    if (!confirm('이 리뷰를 삭제하시겠습니까?')) return;
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
                style={{fontSize:20, color: n <= rating ? 'var(--gold)' : 'var(--line-2)', background:'none', border:'none', cursor:'pointer', padding:'0 2px'}}>
                ★
              </button>
            ))}
            <span className="gold mono" style={{fontSize:12, marginLeft:4}}>{rating}/5</span>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="『왕의길』을 읽고 느낀 점을 자유롭게 써 주세요."
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
        <p className="dim" style={{fontSize:13, marginBottom:20}}>리뷰는 『왕의길』 배송 완료 회원만 작성할 수 있습니다.</p>
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
                <span className="mono dim-2" style={{fontSize:10}}>{new Date(r.createdAt).toLocaleDateString('ko-KR')}</span>
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
const BookPage = ({ go, cart, setCart, user }) => {
  const book = window.BANGINOJA_DATA.book;
  const [version, setVersion] = React.useState("KR");
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState("소개");

  const price = version === "KR" ? book.priceKR : book.priceEN;

  const addToCart = () => {
    setCart({ version, qty, price });
    go("checkout");
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:80}} className="book-grid">
          {/* LEFT: cover */}
          <div style={{position:'sticky', top:100, alignSelf:'start'}}>
            <div style={{position:'relative', maxWidth:440, margin:'0 auto'}}>
              <div className="placeholder" style={{
                aspectRatio:'3/4',
                background:`linear-gradient(135deg, var(--bg-3), #000),
                  repeating-linear-gradient(45deg, rgba(245,213,72,0.06) 0 6px, transparent 6px 12px)`,
                border:'1px solid var(--gold-dim)',
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                padding:'40px 32px',
                fontSize:12,
                color:'var(--gold)',
              }}>
                <div>
                  <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', marginBottom:8}}>BANGINOJA PRESS · 2026</div>
                  <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.2em'}}>{version === "KR" ? "KR EDITION" : "EN EDITION"}</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontFamily:'var(--font-serif)', fontSize:68, color:'var(--gold-2)', lineHeight:1}}>
                    {version === "KR" ? "王의길" : "The"}
                  </div>
                  {version === "EN" && (
                    <div style={{fontFamily:'var(--font-serif)', fontSize:38, color:'var(--gold-2)', marginTop:8}}>
                      King's<br/>Path
                    </div>
                  )}
                  <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', marginTop:20, color:'var(--ink-2)'}}>
                    {version === "KR" ? "— 뱅기노자 —" : "— BANGINOJA —"}
                  </div>
                </div>
                <div style={{textAlign:'center'}}>
                  <BanginojaIcon size={28}/>
                </div>
              </div>
              {/* subtle shadow offset */}
              <div style={{position:'absolute', top:16, left:16, right:-16, bottom:-16, border:'1px solid var(--line-2)', zIndex:-1}}/>
            </div>

            {/* thumbnails */}
            <div style={{display:'flex', gap:12, justifyContent:'center', marginTop:32}}>
              {["앞표지","뒷표지","미리보기 1","미리보기 2"].map((t, i) => (
                <div key={i} className="placeholder" style={{width:60, aspectRatio:'3/4', fontSize:8, padding:4}}>{i+1}</div>
              ))}
            </div>
          </div>

          {/* RIGHT: purchase panel */}
          <div>
            <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:16}}>NEW RELEASE · 2026</div>
            <h1 style={{fontFamily:'var(--font-serif)', fontSize:56, fontWeight:500, lineHeight:1.05, marginBottom:12}}>
              『<span className="gold">왕의길</span>』
            </h1>
            <div className="ko-serif dim" style={{fontSize:20, marginBottom:24, fontStyle:'italic'}}>
              {book.subtitle}
            </div>
            <div style={{display:'flex', gap:24, paddingBottom:24, borderBottom:'1px solid var(--line)', marginBottom:32, fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-2)'}}>
              <div><span className="dim-2">저자</span> <span className="gold">{book.author}</span></div>
              <div><span className="dim-2">출판</span> {book.publisher}</div>
              <div><span className="dim-2">쪽수</span> {book.pages}p</div>
            </div>

            <p className="dim" style={{fontSize:15, lineHeight:1.9, marginBottom:32}}>{book.desc}</p>

            {/* version selector */}
            <div style={{marginBottom:24}}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12, textTransform:'uppercase'}}>
                판본 선택
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                {[
                  { k: "KR", label: "국문판", sub: "Korean", price: book.priceKR },
                  { k: "EN", label: "영문판", sub: "English", price: book.priceEN },
                ].map(v => (
                  <button key={v.k}
                    onClick={() => setVersion(v.k)}
                    style={{
                      padding:'20px',
                      border: version === v.k ? '1px solid var(--gold)' : '1px solid var(--line-2)',
                      background: version === v.k ? 'rgba(245,213,72,0.05)' : 'transparent',
                      textAlign:'left',
                      cursor:'pointer',
                    }}>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: version === v.k ? 'var(--gold)' : 'var(--ink-3)'}}>{v.sub.toUpperCase()}</div>
                    <div className="ko-serif" style={{fontSize:20, marginTop:4}}>{v.label}</div>
                    <div className="gold-2 ko-serif" style={{fontSize:20, marginTop:8}}>{v.price.toLocaleString()}원</div>
                  </button>
                ))}
              </div>
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
              <span className="ko-serif gold-2" style={{fontSize:36}}>{(price * qty).toLocaleString()}원</span>
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
                      color: tab === t ? 'var(--gold)' : 'var(--ink-2)',
                      borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
                      marginBottom:-1,
                    }}>{t}</button>
                ))}
              </div>

              {tab === "소개" && (
                <div style={{fontFamily:'var(--font-serif)', fontSize:15, lineHeight:1.9, color:'var(--ink-2)'}}>
                  <p style={{marginBottom:16}}>왕의 자리에 선 자는 누구인가. 이 책은 그 자리에서 무엇을 보았는지를 묻는다.</p>
                  <p style={{marginBottom:16}}>저자 뱅기노자는 15년간 실록과 궁궐을 오가며 쌓아올린 기록을 한 권으로 엮었다. 왕의 자리가 아니라 왕이 바라본 길 — 그 시선의 각도를 오늘의 언어로 재구성한다.</p>
                  <p>총 5부 22장. 조선 27명의 왕 중 11명을 깊이 있게 다룬다.</p>
                </div>
              )}
              {tab === "목차" && (
                <div>
                  {book.chapters.map((c, i) => (
                    <div key={i} style={{padding:'16px 0', borderBottom:'1px solid var(--line)', display:'flex', gap:24}}>
                      <span className="mono gold" style={{width:40, fontSize:12}}>0{i+1}</span>
                      <span className="ko-serif" style={{fontSize:17}}>{c}</span>
                    </div>
                  ))}
                </div>
              )}
              {tab === "저자" && (
                <div style={{display:'flex', gap:24, alignItems:'flex-start'}}>
                  <div className="placeholder" style={{width:140, aspectRatio:'3/4', flexShrink:0}}>뱅기노자</div>
                  <div>
                    <h4 className="ko-serif gold" style={{fontSize:22, marginBottom:12}}>뱅기노자 · BANGINOJA</h4>
                    <p className="dim" style={{fontSize:14, lineHeight:1.9}}>
                      뱅기노자 커뮤니티 창립자. 15년간 조선왕조실록과 궁궐을 오갔다. 답사와 강연을 통해 조선의 왕들을 오늘의 자리에 소환한다. 『왕의길』은 그의 첫 단독 저서다.
                    </p>
                  </div>
                </div>
              )}
              {tab === "리뷰" && <BookReviewSection user={user} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 결제 페이지 — 회원 전용 + 무통장 입금 단일 흐름
const CheckoutPage = ({ go, cart, user }) => {
  const book = window.BANGINOJA_DATA.book;
  const version = cart ? cart.version : "KR";
  const qty = cart ? cart.qty : 1;
  const unit = version === "EN" ? book.priceEN : book.priceKR;
  const subtotal = unit * qty;
  const shipping = subtotal >= 30000 ? 0 : 3000;
  const total = subtotal + shipping;

  const bank = (window.BGNJ_LECTURES?.getBankAccount?.() || window.BGNJ_STORES.bankAccount || {});
  const [selectedBankId, setSelectedBankId] = React.useState(null);
  const [recipient, setRecipient] = React.useState(user?.name || "");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [addressDetail, setAddressDetail] = React.useState("");
  const [memo, setMemo] = React.useState("");
  const [error, setError] = React.useState("");
  const [submittedOrder, setSubmittedOrder] = React.useState(null);

  // 비로그인 차단 안내
  if (!user) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:560, textAlign:'center', padding:'80px 20px'}}>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:16}}>CHECKOUT · 결제</div>
          <h1 className="ko-serif" style={{fontSize:32, marginBottom:20}}>회원 전용 주문</h1>
          <p className="dim" style={{fontSize:15, lineHeight:1.8, marginBottom:32}}>
            『왕의길』 주문은 <strong className="gold">회원가입한 분</strong>만 가능합니다.
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
              <span className="gold ko-serif" style={{fontSize:22}}>{submittedOrder.total.toLocaleString()}원</span>
            </div>
            <p className="dim" style={{fontSize:12, lineHeight:1.7, marginTop:10}}>
              입금자명에 <strong className="gold">{submittedOrder.recipient}</strong> 또는 주문번호 <strong className="gold">{submittedOrder.orderNo}</strong>를 남겨 주세요.
            </p>
          </div>

          <div className="card" style={{textAlign:'left', marginBottom:32, padding:20}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:12}}>ORDER SUMMARY</div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
              <span className="dim">『왕의길』 ({submittedOrder.version === "KR" ? "국문판" : "영문판"}) × {submittedOrder.qty}</span>
              <span>{submittedOrder.subtotal.toLocaleString()}원</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
              <span className="dim">배송비</span>
              <span>{submittedOrder.shipping === 0 ? '무료' : `${submittedOrder.shipping.toLocaleString()}원`}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--line)', marginTop:6}}>
              <span>결제 금액</span>
              <span className="gold-2 ko-serif" style={{fontSize:22}}>{submittedOrder.total.toLocaleString()}원</span>
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
    setError("");
    if (!recipient.trim()) return setError("받는 분 이름을 입력해 주세요.");
    if (!phone.trim()) return setError("연락처를 입력해 주세요.");
    if (!address.trim()) return setError("기본 주소를 입력해 주세요.");
    try {
      const result = await window.BGNJ_BOOK_ORDERS.createOrder({
        userId: user.id,
        version,
        qty,
        recipient: recipient.trim(),
        phone: phone.trim(),
        address: address.trim(),
        addressDetail: addressDetail.trim(),
        memo: memo.trim(),
      });
      if (!result?.ok) return setError(result?.message || "주문 처리에 실패했습니다.");
      setSubmittedOrder(result.order);
    } catch (err) {
      setError(err?.body?.error || err?.message || '주문 처리 중 오류');
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{marginBottom:32}}>
          <div className="section-eyebrow">CHECKOUT · 결제</div>
          <h1 className="section-title">주문 / <span className="accent">결제</span></h1>
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
              <button type="submit" className="btn btn-gold btn-block">주문 접수 · {total.toLocaleString()}원</button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card card-gold" style={{position:'sticky', top:100}}>
              <div className="mono gold" style={{fontSize:10, letterSpacing:'0.3em', marginBottom:20}}>ORDER SUMMARY</div>
              <div style={{display:'flex', gap:16, marginBottom:24, paddingBottom:24, borderBottom:'1px solid var(--line)'}}>
                <div className="placeholder" style={{width:72, aspectRatio:'3/4', fontSize:8, flexShrink:0}}>王</div>
                <div>
                  <div className="ko-serif" style={{fontSize:17, marginBottom:4}}>『왕의길』</div>
                  <div className="dim-2 mono" style={{fontSize:11}}>{version === "KR" ? "국문판" : "영문판"} · {qty}권</div>
                  <div className="gold ko-serif" style={{fontSize:16, marginTop:8}}>{subtotal.toLocaleString()}원</div>
                </div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', color:'var(--ink-2)'}}>
                <span>상품 합계</span>
                <span>{subtotal.toLocaleString()}원</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', color:'var(--ink-2)'}}>
                <span>배송비</span>
                <span>{shipping === 0 ? "무료" : `${shipping.toLocaleString()}원`}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', padding:'16px 0', borderTop:'1px solid var(--line)', marginTop:8}}>
                <span>결제 금액</span>
                <span className="gold-2 ko-serif" style={{fontSize:24}}>{total.toLocaleString()}원</span>
              </div>

              <div style={{marginTop:24, padding:'16px', background:'rgba(245,213,72,0.04)', border:'1px dashed var(--gold-dim)'}}>
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

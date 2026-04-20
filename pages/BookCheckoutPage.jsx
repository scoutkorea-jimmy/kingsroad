// 책 구매 페이지
const BookPage = ({ go, cart, setCart }) => {
  const book = window.WANGSADEUL_DATA.book;
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
                  repeating-linear-gradient(45deg, rgba(212,175,55,0.06) 0 6px, transparent 6px 12px)`,
                border:'1px solid var(--gold-dim)',
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                padding:'40px 32px',
                fontSize:12,
                color:'var(--gold)',
              }}>
                <div>
                  <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', marginBottom:8}}>WANGSADEUL PRESS · 2026</div>
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
                  <IlwolMark size={28}/>
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
                      background: version === v.k ? 'rgba(212,175,55,0.05)' : 'transparent',
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

            <p className="dim-2" style={{fontSize:11, textAlign:'center', marginTop:20, lineHeight:1.8}}>
              3만원 이상 무료배송 · 영문판 해외 배송 가능<br/>
              회원 10% 적립 · 사인본 한정 수량
            </p>

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
                  <p style={{marginBottom:16}}>일월오봉도 앞에 선 자는 누구인가. 이 책은 그 자리에서 무엇을 보았는지를 묻는다.</p>
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
                      왕사들 커뮤니티 창립자. 15년간 조선왕조실록과 궁궐을 오갔다. 답사와 강연을 통해 조선의 왕들을 오늘의 자리에 소환한다. 『왕의길』은 그의 첫 단독 저서다.
                    </p>
                  </div>
                </div>
              )}
              {tab === "리뷰" && (
                <div>
                  {[
                    { n: "★★★★★", a: "돌담아래", t: "10년 만에 만난 진짜 조선 왕실 책입니다." },
                    { n: "★★★★★", a: "고궁지기", t: "답사 전후로 두 번 읽었는데 완전히 다르게 읽힙니다." },
                    { n: "★★★★☆", a: "역사애호", t: "중후반부로 갈수록 몰입감이 깊어집니다." },
                  ].map((r, i) => (
                    <div key={i} style={{padding:'20px 0', borderBottom:'1px solid var(--line)'}}>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                        <span className="gold">{r.n}</span>
                        <span className="mono dim-2" style={{fontSize:11}}>{r.a}</span>
                      </div>
                      <p className="ko-serif" style={{fontSize:15}}>{r.t}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 결제 페이지
const CheckoutPage = ({ go, cart }) => {
  const book = window.WANGSADEUL_DATA.book;
  const price = cart ? cart.price : book.priceKR;
  const qty = cart ? cart.qty : 1;
  const version = cart ? cart.version : "KR";
  const subtotal = price * qty;
  const shipping = subtotal >= 30000 ? 0 : 3000;
  const total = subtotal + shipping;

  const [step, setStep] = React.useState(1);
  const [method, setMethod] = React.useState("카드");
  const [complete, setComplete] = React.useState(false);

  if (complete) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth:600, textAlign:'center'}}>
          <div style={{marginBottom:40, display:'inline-block'}}>
            <IlwolMark size={60}/>
          </div>
          <div className="mono gold" style={{fontSize:12, letterSpacing:'0.3em', marginBottom:16}}>ORDER COMPLETE</div>
          <h1 style={{fontFamily:'var(--font-serif)', fontSize:44, fontWeight:500, marginBottom:20}}>
            주문이 <span className="accent">접수</span>되었습니다
          </h1>
          <p className="dim" style={{fontSize:15, lineHeight:1.8, marginBottom:40}}>
            주문번호 <span className="gold mono">WSD-2026-04-{Math.floor(Math.random()*9000+1000)}</span><br/>
            영수증이 이메일로 발송되었습니다. 평일 기준 1-2일 내 발송됩니다.
          </p>
          <div className="card card-gold" style={{textAlign:'left', marginBottom:32}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
              <span className="dim">『왕의길』 ({version === "KR" ? "국문판" : "영문판"}) × {qty}</span>
              <span>{subtotal.toLocaleString()}원</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:16}}>
              <span className="dim">배송비</span>
              <span>{shipping === 0 ? "무료" : `${shipping.toLocaleString()}원`}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', paddingTop:16, borderTop:'1px solid var(--line)'}}>
              <span>결제금액</span>
              <span className="gold-2 ko-serif" style={{fontSize:22}}>{total.toLocaleString()}원</span>
            </div>
          </div>
          <div style={{display:'flex', gap:12, justifyContent:'center'}}>
            <button className="btn" onClick={() => go("home")}>홈으로</button>
            <button className="btn btn-gold">주문 상세 보기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div style={{marginBottom:40}}>
          <div className="section-eyebrow">CHECKOUT · 결제</div>
          <h1 className="section-title">주문 / <span className="accent">결제</span></h1>
        </div>

        {/* Step indicator */}
        <div style={{display:'flex', gap:0, marginBottom:60, borderBottom:'1px solid var(--line)'}}>
          {["배송 정보", "결제 수단", "최종 확인"].map((s, i) => (
            <div key={i}
              onClick={() => setStep(i+1)}
              style={{
                flex:1, padding:'20px', textAlign:'center', cursor:'pointer',
                borderBottom: step === i+1 ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom:-1,
              }}>
              <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', color: step >= i+1 ? 'var(--gold)' : 'var(--ink-3)'}}>
                STEP 0{i+1}
              </div>
              <div className="ko-serif" style={{fontSize:17, color: step === i+1 ? 'var(--gold)' : step > i+1 ? 'var(--ink)' : 'var(--ink-3)', marginTop:4}}>
                {s}
              </div>
            </div>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:60}}>
          <div>
            {step === 1 && (
              <div>
                <h3 className="ko-serif" style={{fontSize:22, marginBottom:24}}>배송 정보</h3>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
                  <div className="field">
                    <div className="field-label">받는 분</div>
                    <input className="field-input" placeholder="이름"/>
                  </div>
                  <div className="field">
                    <div className="field-label">연락처</div>
                    <input className="field-input" placeholder="010-0000-0000"/>
                  </div>
                </div>
                <div className="field">
                  <div className="field-label">주소</div>
                  <input className="field-input" placeholder="우편번호" style={{marginBottom:10}}/>
                  <input className="field-input" placeholder="기본 주소" style={{marginBottom:10}}/>
                  <input className="field-input" placeholder="상세 주소"/>
                </div>
                <div className="field">
                  <div className="field-label">배송 메모</div>
                  <textarea className="field-input" placeholder="부재 시 경비실에 맡겨주세요" style={{minHeight:80, resize:'vertical'}}/>
                </div>
                <button className="btn btn-gold btn-block" onClick={() => setStep(2)}>다음 단계 →</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="ko-serif" style={{fontSize:22, marginBottom:24}}>결제 수단</h3>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:32}}>
                  {["카드", "계좌이체", "간편결제", "무통장"].map(m => (
                    <button key={m}
                      onClick={() => setMethod(m)}
                      style={{
                        padding:'24px 12px',
                        border: method === m ? '1px solid var(--gold)' : '1px solid var(--line-2)',
                        background: method === m ? 'rgba(212,175,55,0.05)' : 'transparent',
                        color: method === m ? 'var(--gold)' : 'var(--ink-2)',
                        fontFamily:'var(--font-serif)',
                        fontSize:16,
                      }}>{m}</button>
                  ))}
                </div>
                {method === "카드" && (
                  <>
                    <div className="field">
                      <div className="field-label">카드 번호</div>
                      <input className="field-input" placeholder="0000  0000  0000  0000"/>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20}}>
                      <div className="field">
                        <div className="field-label">유효기간</div>
                        <input className="field-input" placeholder="MM/YY"/>
                      </div>
                      <div className="field">
                        <div className="field-label">CVC</div>
                        <input className="field-input" placeholder="•••"/>
                      </div>
                      <div className="field">
                        <div className="field-label">할부</div>
                        <select className="field-input">
                          <option>일시불</option>
                          <option>3개월</option>
                          <option>6개월</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
                {method !== "카드" && (
                  <div style={{padding:40, border:'1px dashed var(--line-2)', textAlign:'center', color:'var(--ink-3)', fontSize:13}}>
                    <div className="mono" style={{letterSpacing:'0.2em'}}>{method.toUpperCase()} 결제 창이 열립니다</div>
                  </div>
                )}
                <div style={{display:'flex', gap:12, marginTop:32}}>
                  <button className="btn btn-block" onClick={() => setStep(1)}>← 이전</button>
                  <button className="btn btn-gold btn-block" onClick={() => setStep(3)}>다음 단계 →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="ko-serif" style={{fontSize:22, marginBottom:24}}>최종 확인</h3>
                <div className="card" style={{marginBottom:20}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12}}>SHIPPING TO</div>
                  <div className="ko-serif" style={{fontSize:15, lineHeight:1.7}}>
                    홍길동 · 010-0000-0000<br/>
                    서울 종로구 사직로 102, 1층<br/>
                    <span className="dim-2" style={{fontSize:12}}>부재 시 경비실에 맡겨주세요</span>
                  </div>
                </div>
                <div className="card" style={{marginBottom:20}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12}}>PAYMENT</div>
                  <div className="ko-serif" style={{fontSize:15}}>{method} · 일시불</div>
                </div>
                <label style={{display:'flex', gap:12, alignItems:'center', padding:'16px 0', fontSize:13, color:'var(--ink-2)'}}>
                  <input type="checkbox" defaultChecked style={{accentColor:'var(--gold)'}}/>
                  주문 내용을 확인하였으며 결제에 동의합니다
                </label>
                <div style={{display:'flex', gap:12, marginTop:24}}>
                  <button className="btn btn-block" onClick={() => setStep(2)}>← 이전</button>
                  <button className="btn btn-gold btn-block" onClick={() => setComplete(true)}>결제하기 · {total.toLocaleString()}원</button>
                </div>
              </div>
            )}
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
                  <div className="gold ko-serif" style={{fontSize:16, marginTop:8}}>{(price * qty).toLocaleString()}원</div>
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

              <div style={{marginTop:24, padding:'16px', background:'rgba(212,175,55,0.04)', border:'1px dashed var(--gold-dim)'}}>
                <div className="mono gold" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>◆ 회원 혜택</div>
                <div className="dim" style={{fontSize:12, lineHeight:1.7}}>
                  · 10% 포인트 적립<br/>
                  · 사인본 우선 배정<br/>
                  · 답사 프로그램 우선 예약
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BookPage, CheckoutPage });

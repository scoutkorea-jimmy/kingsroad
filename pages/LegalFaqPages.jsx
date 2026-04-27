// 약관 / 개인정보 처리방침 / FAQ 공개 페이지
const LegalPage = ({ go, slug }) => {
  const doc = window.BGNJ_LEGAL.get(slug) || { title: '', body: '' };
  const otherSlug = slug === 'privacy' ? 'terms' : 'privacy';
  const otherDoc = window.BGNJ_LEGAL.get(otherSlug);
  return (
    <div className="section">
      <div className="container" style={{maxWidth:760}}>
        <div className="section-eyebrow">{slug === 'privacy' ? 'PRIVACY' : 'TERMS'}</div>
        <h1 className="section-title" style={{marginBottom:14}}>{doc.title}</h1>
        {doc.updatedAt && (
          <div className="dim-2 mono" style={{fontSize:11, marginBottom:32, letterSpacing:'0.16em'}}>
            최근 갱신 · {new Date(doc.updatedAt).toLocaleDateString('ko-KR')}
          </div>
        )}
        <article className="post-body" style={{maxWidth:'68ch', margin:'0 auto'}}
          dangerouslySetInnerHTML={{ __html: doc.body || '<p class="dim">아직 등록된 내용이 없습니다.</p>' }}/>
        <div style={{marginTop:60, paddingTop:32, borderTop:'1px solid var(--line-2)', display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap'}}>
          <button type="button" className="btn btn-small" onClick={() => go('home')}>← 홈으로</button>
          {otherDoc && (
            <button type="button" className="btn btn-small" onClick={() => go(otherSlug === 'privacy' ? 'privacy' : 'terms')}>
              {otherDoc.title} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const FaqPage = ({ go }) => {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('전체');
  const [openId, setOpenId] = React.useState(null);

  const categories = window.BGNJ_FAQ.listCategories();
  const filtered = window.BGNJ_FAQ.search(search, category);

  // 카테고리별 그룹핑
  const grouped = filtered.reduce((acc, f) => {
    const k = f.category || '일반';
    (acc[k] = acc[k] || []).push(f);
    return acc;
  }, {});
  const groupKeys = Object.keys(grouped);

  return (
    <div className="section">
      <div className="container" style={{maxWidth:840}}>
        <div style={{textAlign:'center', marginBottom:48}}>
          <div className="section-eyebrow" style={{justifyContent:'center'}}>FAQ · 자주 묻는 질문</div>
          <h1 className="section-title">
            <span className="accent">자주 묻는</span> 질문
          </h1>
          <p className="section-subtitle" style={{margin:'16px auto 0'}}>
            가입·결제·강연·답사·책 주문에 관해 자주 들어오는 질문을 정리했습니다.
          </p>
        </div>

        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:16, marginBottom:24, flexWrap:'wrap'}}>
          <input className="field-input" placeholder="질문 또는 답변 검색..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{width:280, padding:'10px 14px'}}/>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:12, marginBottom:40, flexWrap:'wrap'}}>
          {categories.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)}
              style={{
                padding:'10px 20px',
                border: category === c ? '1px solid var(--gold)' : '1px solid var(--line-2)',
                color: category === c ? 'var(--gold)' : 'var(--ink-2)',
                background: 'transparent',
                fontSize: 12,
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}>{c}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{padding:48, textAlign:'center'}}>
            <p className="dim" style={{fontSize:14}}>조건에 맞는 질문이 없습니다.</p>
          </div>
        ) : (
          <div style={{display:'grid', gap:32}}>
            {groupKeys.map((k) => (
              <section key={k}>
                <div className="mono gold" style={{fontSize:11, letterSpacing:'0.22em', marginBottom:12}}>
                  {k.toUpperCase()}
                </div>
                <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:8}}>
                  {grouped[k].map((f) => {
                    const open = openId === f.id;
                    return (
                      <li key={f.id} className="card" style={{padding:0, overflow:'hidden'}}>
                        <button type="button" onClick={() => setOpenId(open ? null : f.id)}
                          style={{
                            all:'unset', cursor:'pointer', display:'block', width:'100%',
                            padding:'16px 20px', textAlign:'left',
                          }}>
                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:14}}>
                            <span className="ko-serif" style={{fontSize:15, lineHeight:1.5}}>Q. {f.question}</span>
                            <span className="gold mono" style={{fontSize:14}}>{open ? '−' : '+'}</span>
                          </div>
                        </button>
                        {open && (
                          <div style={{padding:'0 20px 18px', borderTop:'1px solid var(--line)'}}>
                            <p className="dim" style={{fontSize:14, lineHeight:1.9, marginTop:14, whiteSpace:'pre-wrap'}}>
                              A. {f.answer}
                            </p>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { LegalPage, FaqPage });

// 뱅기노자 칼럼 아카이브
const ColumnPage = ({ go }) => {
  const data = window.WANGSADEUL_DATA;
  const [category, setCategory] = React.useState("전체");
  const categories = ["전체", ...new Set(data.columns.map(c => c.category))];
  const filtered = category === "전체" ? data.columns : data.columns.filter(c => c.category === category);
  const [selected, setSelected] = React.useState(null);

  if (selected !== null) {
    const c = data.columns[selected];
    return (
      <div className="section">
        <div className="container" style={{maxWidth:760}}>
          <button className="btn-ghost" onClick={() => setSelected(null)}
            style={{marginBottom:32, cursor:'pointer', color:'var(--ink-2)', fontSize:12, letterSpacing:'0.1em'}}>
            ← 아카이브로
          </button>
          <div style={{textAlign:'center', marginBottom:40}}>
            <span className="pill">{c.category}</span>
            <h1 style={{fontFamily:'var(--font-serif)', fontSize:48, fontWeight:500, lineHeight:1.2, margin:'20px 0 16px'}}>
              {c.title}
            </h1>
            <div style={{display:'flex', gap:20, justifyContent:'center', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-3)'}}>
              <span className="gold">뱅기노자</span>
              <span>{c.date}</span>
              <span>읽는 시간 · {c.readTime}</span>
            </div>
          </div>
          <div className="placeholder" style={{aspectRatio:'16/9', marginBottom:40, fontSize:11}}>
            COLUMN HERO IMAGE · 1600×900
          </div>
          <article style={{fontFamily:'var(--font-serif)', fontSize:18, lineHeight:2, color:'var(--ink)'}}>
            <p style={{fontSize:22, lineHeight:1.7, color:'var(--gold-ink)', marginBottom:32, fontStyle:'italic'}}>
              {c.excerpt}
            </p>
            <p style={{marginBottom:28}}>
              조선의 왕들은 매일 아침 같은 풍경을 마주했다. 어좌에 오르면 등 뒤에는 언제나 다섯 봉우리가 펼쳐져 있었고, 해와 달이 동시에 떠 있었다. 자연에서는 불가능한 일이 왕의 자리에서는 매일 일어났다.
            </p>
            <p style={{marginBottom:28}}>
              일월오봉도는 병풍이 아니다. 그것은 장치다. 왕으로 하여금 매일 우주를 떠올리게 하는 장치, 자신이 누구를 위해 앉아 있는지를 잊지 못하게 하는 장치였다.
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
              오늘을 사는 우리에게 일월오봉도는 더 이상 배경이 아니다. 그것은 하나의 질문이다 — 당신의 자리 뒤에는 무엇이 있는가.
            </p>
          </article>
          <div style={{marginTop:60, paddingTop:40, borderTop:'1px solid var(--line-2)', display:'flex', justifyContent:'space-between', gap:24, flexWrap:'wrap'}}>
            {selected > 0 && (
              <div style={{cursor:'pointer', flex:1, minWidth:240}} onClick={() => setSelected(selected - 1)}>
                <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>← 이전 칼럼</div>
                <div className="ko-serif gold" style={{fontSize:16}}>{data.columns[selected-1].title}</div>
              </div>
            )}
            {selected < data.columns.length - 1 && (
              <div style={{cursor:'pointer', textAlign:'right', flex:1, minWidth:240}} onClick={() => setSelected(selected + 1)}>
                <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>다음 칼럼 →</div>
                <div className="ko-serif gold" style={{fontSize:16}}>{data.columns[selected+1].title}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div style={{textAlign:'center', marginBottom:60}}>
          <div className="section-eyebrow" style={{justifyContent:'center'}}>COLUMN · 뱅기노자의 글</div>
          <h1 className="section-title">
            <span className="accent">뱅기노자</span>가 쓰다
          </h1>
          <p className="section-subtitle" style={{margin:'16px auto 0'}}>
            커뮤니티장 뱅기노자의 정기 칼럼. 조선의 왕들을 경유해 오늘을 묻는다.
          </p>
        </div>

        <div style={{display:'flex', justifyContent:'center', gap:16, marginBottom:60, flexWrap:'wrap'}}>
          {categories.map(c => (
            <button key={c}
              onClick={() => setCategory(c)}
              style={{
                padding:'10px 20px',
                border: category === c ? '1px solid var(--gold)' : '1px solid var(--line-2)',
                color: category === c ? 'var(--gold)' : 'var(--ink-2)',
                fontSize:12,
                letterSpacing:'0.1em',
              }}>{c}</button>
          ))}
        </div>

        <div className="grid grid-3">
          {filtered.map((c, i) => {
            const idx = data.columns.findIndex(x => x.id === c.id);
            return (
              <div key={c.id}
                onClick={() => setSelected(idx)}
                className="card"
                style={{padding:0, cursor:'pointer', overflow:'hidden'}}>
                <div className="placeholder" style={{aspectRatio:'4/3', borderLeft:'none', borderRight:'none', borderTop:'none', fontSize:9}}>
                  0{idx+1}
                </div>
                <div style={{padding:28}}>
                  <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:12}}>
                    <span className="pill">{c.category}</span>
                    <span className="mono dim-2" style={{fontSize:10}}>{c.readTime}</span>
                  </div>
                  <h3 className="ko-serif" style={{fontSize:19, fontWeight:500, lineHeight:1.35, marginBottom:10, minHeight:50}}>
                    {c.title}
                  </h3>
                  <p className="dim" style={{fontSize:13, lineHeight:1.6, marginBottom:16}}>
                    {c.excerpt.slice(0, 90)}…
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
      </div>
    </div>
  );
};

Object.assign(window, { ColumnPage });

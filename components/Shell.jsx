// 공통 컴포넌트: Nav, Footer, Tweaks, Brand
const Brand = ({ onClick }) => (
  <div className="brand" onClick={onClick}>
    <div className="brand-mark"><IlwolMark size={22}/></div>
    <div className="brand-name">
      왕사들
      <span className="sub">WANGSADEUL</span>
    </div>
  </div>
);

const Nav = ({ route, go, user }) => {
  const items = [
    { key: "home", label: "홈" },
    { key: "community", label: "커뮤니티" },
    { key: "wangsanam", label: "왕사남 소개" },
    { key: "tour", label: "투어 프로그램" },
    { key: "column", label: "뱅기노자 칼럼" },
    { key: "book", label: "왕의길" },
  ];
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Brand onClick={() => go("home")} />
        <div className="nav-menu">
          {items.map(it => (
            <span key={it.key}
              className={`nav-link ${route === it.key ? "active" : ""}`}
              onClick={() => go(it.key)}>{it.label}</span>
          ))}
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="mono" style={{fontSize:11, letterSpacing:'0.15em', color:'var(--gold)'}}>{user.name}</span>
              <button className="btn btn-small" onClick={() => go("admin")}>관리</button>
            </>
          ) : (
            <>
              <span className="btn-ghost" onClick={() => go("login")}
                style={{fontSize:12, letterSpacing:'0.1em', cursor:'pointer', color:'var(--ink-2)'}}>로그인</span>
              <button className="btn btn-small" onClick={() => go("signup")}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = ({ go }) => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <Brand/>
          <p className="dim" style={{marginTop:20, fontSize:13, lineHeight:1.7, maxWidth:360}}>
            일월오봉도 아래 모인 사람들. 왕사들은 조선의 왕들과 그들이 걸었던 길을 오늘의 언어로 다시 읽어내는 커뮤니티입니다.
          </p>
        </div>
        <div>
          <h4>콘텐츠</h4>
          <ul>
            <li onClick={() => go("column")}>뱅기노자 칼럼</li>
            <li onClick={() => go("tour")}>투어 프로그램</li>
            <li onClick={() => go("book")}>『왕의길』</li>
            <li onClick={() => go("community")}>커뮤니티</li>
          </ul>
        </div>
        <div>
          <h4>정보</h4>
          <ul>
            <li onClick={() => go("wangsanam")}>왕사남 소개</li>
            <li>공지사항</li>
            <li>자주 묻는 질문</li>
            <li>이용약관</li>
          </ul>
        </div>
        <div>
          <h4>연락</h4>
          <ul>
            <li>hello@wangsadeul.kr</li>
            <li>02-0000-0000</li>
            <li>서울 종로구 사직로</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 WANGSADEUL — ALL RIGHTS RESERVED</span>
        <span>日月五峯 · DESIGNED IN SEOUL</span>
      </div>
    </div>
  </footer>
);

const Ornament = ({ children }) => (
  <div className="ornament" style={{margin:"40px 0"}}>
    <span style={{fontFamily:'var(--font-serif)', fontSize:14, letterSpacing:'0.3em', color:'var(--gold)'}}>
      {children || "五"}
    </span>
  </div>
);

const SectionHead = ({ eyebrow, title, subtitle, action }) => (
  <div className="section-head">
    <div>
      {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
      <h2 className="section-title" dangerouslySetInnerHTML={{__html: title}}/>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Tweaks = ({ tweaks, setTweaks, visible }) => {
  if (!visible) return null;
  const set = (k, v) => setTweaks({ ...tweaks, [k]: v });
  return (
    <div className="tweaks">
      <h3>Tweaks</h3>
      <div className="tweaks-row">
        <div className="tweaks-label">심볼 스타일</div>
        <div className="tweaks-options">
          {["outline", "filled", "dashed"].map(s => (
            <button key={s} className={tweaks.lineStyle === s ? "on" : ""}
              onClick={() => set("lineStyle", s)}>
              {s === "outline" ? "선" : s === "filled" ? "채움" : "파선"}
            </button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">골드 강도 · {tweaks.intensity.toFixed(1)}</div>
        <input type="range" className="tweaks-slider"
          min="0.3" max="1.8" step="0.1"
          value={tweaks.intensity}
          onChange={e => set("intensity", parseFloat(e.target.value))}/>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">히어로 레이아웃</div>
        <div className="tweaks-options">
          {["center", "split", "fullbleed"].map(s => (
            <button key={s} className={tweaks.heroLayout === s ? "on" : ""}
              onClick={() => set("heroLayout", s)}>
              {s === "center" ? "중앙" : s === "split" ? "분할" : "풀블리드"}
            </button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">인터랙션</div>
        <div className="tweaks-options">
          <button className={tweaks.interactive ? "on" : ""}
            onClick={() => set("interactive", !tweaks.interactive)}>
            {tweaks.interactive ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Brand, Nav, Footer, Ornament, SectionHead, Tweaks });

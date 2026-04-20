// 공통 컴포넌트: Nav, Footer, Tweaks, Brand
const Brand = ({ onClick }) => (
  <button
    className="brand"
    onClick={onClick}
    aria-label="왕사들 홈으로"
    style={{background:'none', border:'none', padding:0, cursor:'pointer'}}>
    <span className="brand-mark" aria-hidden="true"><IlwolMark size={22}/></span>
    <span className="brand-name">
      왕사들
      <span className="sub" lang="en">WANGSADEUL</span>
    </span>
  </button>
);

const Nav = ({ route, go, user, readFont, setReadFont }) => {
  const items = [
    { key: "home", label: "홈" },
    { key: "community", label: "커뮤니티" },
    { key: "wangsanam", label: "왕사남 소개" },
    { key: "tour", label: "투어 프로그램" },
    { key: "column", label: "뱅기노자 칼럼" },
    { key: "book", label: "왕의길" },
  ];
  return (
    <nav className="nav" aria-label="주 메뉴">
      <div className="container nav-inner">
        <Brand onClick={() => go("home")} />
        <ul className="nav-menu" role="list" style={{listStyle:'none', margin:0, padding:0}}>
          {items.map(it => (
            <li key={it.key}>
              <button
                type="button"
                className={`nav-link ${route === it.key ? "active" : ""}`}
                aria-current={route === it.key ? "page" : undefined}
                onClick={() => go(it.key)}>{it.label}</button>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          {setReadFont && (
            <div className="read-toggle" role="group" aria-label="읽기 폰트 선택">
              <button type="button"
                aria-pressed={readFont === 'sans'}
                onClick={() => setReadFont('sans')}
                title="고딕계열로 읽기">고딕</button>
              <button type="button"
                aria-pressed={readFont === 'serif'}
                onClick={() => setReadFont('serif')}
                title="명조계열(조선일보명조)로 읽기"
                style={{fontFamily: "'ChosunIlboMyungjo', serif"}}>명조</button>
            </div>
          )}
          {user ? (
            <>
              <span className="mono" aria-label={`로그인: ${user.name}`}
                style={{fontSize:11, letterSpacing:'0.15em', color:'var(--gold)'}}>{user.name}</span>
              <button className="btn btn-small" onClick={() => go("admin")}>관리</button>
            </>
          ) : (
            <>
              <button type="button" className="btn-ghost nav-link" onClick={() => go("login")}
                style={{fontSize:12, letterSpacing:'0.1em', color:'var(--ink-2)'}}>로그인</button>
              <button className="btn btn-small" onClick={() => go("signup")}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = ({ go }) => (
  <footer className="footer" aria-label="사이트 정보 및 푸터">
    <div className="container">
      <div className="footer-grid">
        <div>
          <Brand onClick={() => go("home")}/>
          <p className="dim" style={{marginTop:20, fontSize:13, lineHeight:1.7, maxWidth:360}}>
            일월오봉도 아래 모인 사람들. 왕사들은 조선의 왕들과 그들이 걸었던 길을 오늘의 언어로 다시 읽어내는 커뮤니티입니다.
          </p>
          <button type="button" className="btn btn-small" onClick={() => go("admin")}
            style={{marginTop:20}}>개인정보 처리 · 관리자</button>
        </div>
        <nav aria-label="콘텐츠 바로가기">
          <h4 id="ft-content">콘텐츠</h4>
          <ul aria-labelledby="ft-content">
            <li><button type="button" onClick={() => go("column")}>뱅기노자 칼럼</button></li>
            <li><button type="button" onClick={() => go("tour")}>투어 프로그램</button></li>
            <li><button type="button" onClick={() => go("book")}>『왕의길』</button></li>
            <li><button type="button" onClick={() => go("community")}>커뮤니티</button></li>
          </ul>
        </nav>
        <nav aria-label="정보 바로가기">
          <h4 id="ft-info">정보</h4>
          <ul aria-labelledby="ft-info">
            <li><button type="button" onClick={() => go("wangsanam")}>왕사남 소개</button></li>
            <li><button type="button" onClick={() => go("community")}>공지사항</button></li>
            <li><button type="button">자주 묻는 질문</button></li>
            <li><button type="button">이용약관</button></li>
            <li><button type="button">개인정보 처리방침</button></li>
          </ul>
        </nav>
        <address style={{fontStyle:'normal'}}>
          <h4 id="ft-contact">연락</h4>
          <ul aria-labelledby="ft-contact">
            <li><a href="mailto:hello@wangsadeul.kr">hello@wangsadeul.kr</a></li>
            <li><a href="tel:+82-2-0000-0000">02-0000-0000</a></li>
            <li><span>서울 종로구 사직로</span></li>
          </ul>
        </address>
      </div>
      <div className="footer-bottom">
        <span>© 2026 WANGSADEUL — ALL RIGHTS RESERVED</span>
        <span lang="zh-Hant">日月五峯</span><span> · DESIGNED IN SEOUL</span>
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

// title accepts string OR React node. For accent, pass JSX: <>왕사들에 <span className="accent">전하는 말</span></>
const SectionHead = ({ eyebrow, title, subtitle, action, level = 2 }) => {
  const H = `h${level}`;
  return (
    <div className="section-head">
      <div>
        {eyebrow && <div className="section-eyebrow" aria-hidden="true">{eyebrow}</div>}
        <H className="section-title">{title}</H>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
};

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

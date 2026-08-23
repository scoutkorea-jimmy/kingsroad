// 로그인, 회원가입, 관리자 페이지
// v00.285 — 로그인/회원가입 흐름(LegalModal·AuthErrorPanel·INTEREST_OPTIONS·LoginPage)은
//   pages/admin/AdminLogin.jsx 로 분리. LoginPage 는 window.LoginPage 로 노출되어 boot 가 사용.

// 분석/시간 유틸은 AdminShared.jsx 에 정의 + window 노출 (v00.285).
// v00.286 ESM — cross-module import (전역 결합 제거).
// v00.286 ESM — window.X 멤버 읽기 → import 전환.
import { HangyeonAdminPanel } from './admin/HangyeonAdminPanel.jsx';
import { KindPagePanel } from './admin/AdminContentEditors.jsx';

import { BooksAdminPanel } from './admin/AdminBooksPanel.jsx';
import { BankAccountPanel, BookOrderAdminPanel } from './admin/AdminCommercePanels.jsx';
import { BannerEditorPanel, HeroEditorPanel, HomeTextEditorPanel, RecommendationsAdminPanel } from './admin/AdminContentEditors.jsx';
import { DashboardPanel, UserJourneyPanel } from './admin/AdminDashboardPanel.jsx';
import { ADMIN_VERSION_HISTORY, DesignSystemView, FEATURE_DOMAINS, MISSION_OVERVIEW } from './admin/AdminDesignHub.jsx';
import { LectureAdminPanel, TourAdminPanel } from './admin/AdminEventsPanels.jsx';
import { ActivityLogPanel, AuditLogPanel } from './admin/AdminLogPanels.jsx';
import { MemberAdminPanel } from './admin/AdminMemberPanel.jsx';
import { ErrorLogPanel, SEOAdminPanel, SearchConsoleAdminPanel } from './admin/AdminMonitorPanels.jsx';
import { FaqAdminPanel, LegalAdminPanel } from './admin/AdminPolicyPanels.jsx';
import { MetricCard, MiniBarChart, SubTabsView, downloadCsv, downloadJson } from './admin/AdminShared.jsx';
import { SiteContentAdminPanel } from './admin/AdminSiteContentPanel.jsx';

import { _countSince } from './admin/AdminShared.jsx';
import { _dailySeries } from './admin/AdminShared.jsx';
import { formatTimeLeft } from './admin/AdminShared.jsx';

// 라우터 패널 묶음은 admin/AdminRouterPanels.jsx 로 분리 (v00.285).
import { PRIVACY_DATA } from './admin/AdminRouterPanels.jsx';
import { DSR_LABELS } from './admin/AdminRouterPanels.jsx';
import { CorruptedBodyInspector } from './admin/AdminRouterPanels.jsx';
import { ReportQueuePanel } from './admin/AdminRouterPanels.jsx';
import { ErrorPagesPreviewPanel } from './admin/AdminRouterPanels.jsx';
import { InternalAlarmPanel } from './admin/AdminRouterPanels.jsx';
import { CommunityPostsAdminPanel } from './admin/AdminRouterPanels.jsx';


// === Admin Page ===================================================
// 데이터 원칙: 모든 콘텐츠는 BGNJ_* 헬퍼 경유 (D1 source-of-truth). BANGINOJA_DATA 직접 참조 금지.
const AdminPage = ({ go }) => {
  const G = window.BGNJ_GUARD;
  // v00.300 — 새로고침해도 보던 자리로 돌아온다.
  //   주소에 `#admin=탭|상세id|하위탭` 형태로 남긴다. 관리자 화면은 URL 이 늘 /admin 이라
  //   새로고침하면 무조건 첫 화면(대시보드)으로 튕겼다.
  //   해시를 쓰는 이유: 서버 라우팅이 필요 없고, 뒤로가기도 그대로 동작한다.
  //   기존 딥링크(#col- / #post- / #lecture- / #tour-)와 접두사가 겹치지 않는다.
  const [tab, setTab] = React.useState(() => {
    try {
      const m = (window.location.hash || '').match(/^#admin=([^|]*)/);
      if (m && m[1]) return decodeURIComponent(m[1]);
    } catch (_e) { console.warn('[bgnj] 관리자 탭 복원 실패 — 대시보드로 (AuthAdminPage)', _e); }
    return "대시보드";
  });
  // 탭이 바뀌면 주소도 따라간다. 상세 부분은 각 패널이 이어 붙인다(BGNJ_ADMIN_HASH).
  React.useEffect(() => {
    try {
      const cur = window.location.hash || '';
      const rest = cur.startsWith('#admin=') ? cur.slice(7).split('|').slice(1).join('|') : '';
      const next = `#admin=${encodeURIComponent(tab)}${rest ? '|' + rest : ''}`;
      if (cur !== next) window.history.replaceState(null, '', next);
    } catch (_e) { console.warn('[bgnj] 관리자 주소 갱신 실패 — 화면은 정상 (AuthAdminPage)', _e); }
  }, [tab]);
  const [kmsTab, setKmsTab] = React.useState("기능정의서");
  // v00.180 — postSearch/postFilter/selectedPostIds/viewingPostId/bulkTargetCat/bulkTargetPrefix
  // 모두 CommunityPostsAdminPanel 내부 state 로 이전.
  const [postRefreshKey, setPostRefreshKey] = React.useState(0);
  const [versionPage, setVersionPage] = React.useState(1);

  // v00.195 — 사용자 보고 '가입자 2명인데 추이 차트 0'.
  // root cause: allUsers memo 가 postRefreshKey 만 의존 → BGNJ_AUTH.refreshUsers 가 발화하는
  // 'bgnj-users-refresh' 이벤트는 postRefreshKey 증가 안 시킴 → memo 가 빈 _usersCache 로 영구 stuck.
  // 해결: AdminPage 마운트 시 refreshUsers 직접 호출 + 모든 store 변경 이벤트를 postRefreshKey 로 통합.
  // v00.300 — 관리자 화면은 어떤 경우에도 색인되면 안 된다.
  //   1차 방어선은 robots.txt(모든 크롤러 그룹에 Disallow 명시) 이고,
  //   2차로 JS 를 실행하는 크롤러를 위해 화면에 들어온 동안 noindex 메타를 심는다.
  //   3차는 GitHub Pages 자체 — /admin 정적 파일이 없어 크롤러는 404 를 받는다.
  React.useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex';
    meta.setAttribute('data-bgnj-admin-noindex', '1');
    document.head.appendChild(meta);
    return () => { try { meta.remove(); } catch (_e) { console.warn('[bgnj] noindex 메타 정리 실패 (AuthAdminPage)', _e); } };
  }, []);

  React.useEffect(() => {
    window.BGNJ_AUTH?.refreshUsers?.();
    const bump = () => setPostRefreshKey((v) => v + 1);
    const events = [
      'bgnj-users-refresh',
      'bgnj-posts-refresh',
      'bgnj-columns-refresh',
      'bgnj-books-refresh',
      'bgnj-book-orders-refresh',
    ];
    events.forEach((e) => window.addEventListener(e, bump));
    return () => events.forEach((e) => window.removeEventListener(e, bump));
  }, []);

  const allCommunityPosts = React.useMemo(() => window.BGNJ_COMMUNITY.listPosts(), [postRefreshKey]);
  const allUsers = React.useMemo(() => window.BGNJ_AUTH.listUsers(), [postRefreshKey]);
  const allColumns = React.useMemo(() => G.arr(() => window.BGNJ_COLUMNS?.listPublic?.()), [postRefreshKey]);
  // v00.079 — D1.comments 가 단독 source. 서버 fetch 결과(BGNJ_COMMUNITY._commentsCache) 합산.
  // _commentsCache 는 게시글 본문 모달 열 때 채워지므로 대시보드에선 0 일 수 있음 — 정확한 카운트는 서버 metrics 사용 권장.
  const totalComments = React.useMemo(
    () => Object.values(window.BGNJ_COMMUNITY?._commentsCache || {}).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0),
    [postRefreshKey]
  );
  const allBookOrders = React.useMemo(() => window.BGNJ_BOOK_ORDERS?.listAll?.() || [], [postRefreshKey]);
  const pendingBookOrders = allBookOrders.filter((o) => o.status === 'pending_payment').length;
  const refundRequestedOrders = allBookOrders.filter((o) => o.status === 'refund_requested').length;
  const dashboardStats = React.useMemo(() => {
    // v00.157 — 호버 popover 용 details 계산. 모든 카드에 분포·세부 숫자.
    const adminCount = allUsers.filter((u) => u.isAdmin).length;
    const superAdminCount = allUsers.filter((u) => u.isSuperAdmin).length;
    const userCount = allUsers.length - adminCount;
    // v00.194 — 같은 'createdAt' vs 'joinedAt' 버그 (위 DashboardPanel 와 동일 원인).
    const userToday = _countSince(allUsers, 'joinedAt', 1);
    const userWeek = _countSince(allUsers, 'joinedAt', 7);
    const userMonth = _countSince(allUsers, 'joinedAt', 30);

    const postToday = _countSince(allCommunityPosts, 'createdAt', 1);
    const postWeek = _countSince(allCommunityPosts, 'createdAt', 7);
    const postMonth = _countSince(allCommunityPosts, 'createdAt', 30);
    const postCatCounts = {};
    allCommunityPosts.forEach((p) => {
      const k = p.category || p.categoryId || '미분류';
      postCatCounts[k] = (postCatCounts[k] || 0) + 1;
    });
    const topCats = Object.entries(postCatCounts).sort((a,b) => b[1]-a[1]).slice(0, 5);
    const avgComments = allCommunityPosts.length > 0
      ? (totalComments / allCommunityPosts.length).toFixed(1)
      : '0';

    const userColsAll = (window.BGNJ_STORES.userColumns || []);
    const colsPublished = userColsAll.filter((c) => (c.status || 'published') === 'published').length;
    const colsDraft = userColsAll.filter((c) => c.status === 'draft').length;
    const colsScheduled = userColsAll.filter((c) => c.status === 'scheduled').length;
    const colsArchived = userColsAll.filter((c) => c.status === 'archived').length;

    const orderStatuses = ['pending_payment', 'paid', 'shipped', 'delivered', 'refund_requested', 'cancelled'];
    const orderStatusLabel = { pending_payment: '입금 대기', paid: '입금 확인', shipped: '배송중', delivered: '배송 완료', refund_requested: '환불 신청', cancelled: '취소' };
    const orderCounts = orderStatuses.map((s) => ({
      label: orderStatusLabel[s] || s,
      value: allBookOrders.filter((o) => o.status === s).length,
    }));

    return [
      {
        l: "전체 회원", v: String(allUsers.length),
        d: `관리자 ${adminCount}명 포함`, p: true,
        details: [
          { label: '일반 회원',    value: userCount },
          { label: '관리자',       value: adminCount },
          { label: '슈퍼 관리자',  value: superAdminCount },
          { label: '오늘 가입',    value: userToday },
          { label: '최근 7일 가입', value: userWeek },
          { label: '최근 30일 가입', value: userMonth },
        ],
      },
      {
        l: "커뮤니티 게시글", v: String(allCommunityPosts.length),
        d: `댓글 ${totalComments}개 누적`, p: true,
        details: [
          { label: '오늘 작성',    value: postToday },
          { label: '최근 7일',     value: postWeek },
          { label: '최근 30일',    value: postMonth },
          { label: '평균 댓글/글', value: avgComments },
          ...topCats.map(([k, v]) => ({ label: `· ${k}`, value: v })),
        ],
      },
      {
        l: "공개 칼럼", v: String(allColumns.length),
        d: `관리자 발행 ${colsPublished}건 · 임시/예약 ${colsDraft + colsScheduled}건`, p: true,
        details: [
          { label: '게시 (published)',    value: colsPublished },
          { label: '임시 (draft)',         value: colsDraft },
          { label: '예약 (scheduled)',     value: colsScheduled },
          { label: '보관 (archived)',      value: colsArchived },
          { label: '관리자 칼럼 총합',      value: userColsAll.length },
        ],
      },
      {
        l: "도서 주문", v: String(allBookOrders.length),
        d: `입금 대기 ${pendingBookOrders}건${refundRequestedOrders > 0 ? ` · 환불 신청 ${refundRequestedOrders}건` : ''}`,
        p: pendingBookOrders === 0 && refundRequestedOrders === 0,
        details: orderCounts,
      },
    ];
  }, [allUsers, allCommunityPosts, totalComments, allColumns, allBookOrders, pendingBookOrders, refundRequestedOrders]);
  const latestCommunityPost = allCommunityPosts[0] || null;
  const latestColumn = allColumns[0] || null;
  // v00.180 — visibleCommunityPosts 도 CommunityPostsAdminPanel 내부로 이전.

  // v00.146 — 사이드바 그룹 재구성. 사용자 요청 '관리자 그룹핑을 다시 고려해줘'.
  // 핵심 원칙: 비슷한 일을 하는 메뉴를 인접하게. 데이터 분석 = 요약, 사용자 활동 = 커뮤니티, 콘텐츠 ≠ 프로그램.
  // v00.165 — 9 그룹 → 8 그룹 (프로그램 + 쇼핑 머지). collapsible 로 시각 부하 절감.
  const tabGroups = [
    { group: "요약",          items: ["대시보드", "사용자 여정"] },
    { group: "콘텐츠",        items: ["뱅기노자 칼럼", "추천 여행지", "자고 놀자"] },
    { group: "프로그램·쇼핑", items: ["강연", "투어 프로그램", "책 카탈로그", "책 주문"] },
    // v00.267 — 한켠(자고 놀자) 숙소 예약 PMS. 찾기 쉽게 독립 그룹으로 분리.
    { group: "한켠 숙소",     items: ["한켠 예약"] },
    // v00.177 — 사용자 보고 '커뮤니티게시판이랑 커뮤니티랑 겹쳐 매우 불편'. 단일 [커뮤니티] sub-tab 통합 (게시글/게시판/신고).
    { group: "커뮤니티",      items: ["커뮤니티"] },
    { group: "회원",          items: ["회원", "회원 등급"] },
    // v00.166 — 사이트 설정 7 항목을 단일 "사이트 설정" 으로 머지. SubTabsView 가 내부에서 7 sub-tab 노출.
    { group: "사이트 설정",   items: ["사이트 설정"] },
    { group: "개인정보·법무", items: ["정보주체 권리", "동의 관리", "처리활동(ROPA)", "쿠키·추적", "보안 사고", "보유·파기", "국외 이전", "감사 로그"] },
    // v00.171 — '데이터 정리' (LegacyMigrationPanel) 폐기. 사용자 보고 '필요없으면 모두 다 지워'. 마이그레이션 완료 (v00.123).
    // v00.183 — 내부 인원 알람 항목 추가. v00.190 — 활동 로그 추가.
    { group: "시스템",        items: ["활동 로그", "내부 알람", "버전 기록", "KMS", "오류 로그", "오류 페이지 미리보기", "설정"] },
  ];

  const exportMemberData = (m) => {
    const snapshot = {
      exported_at: new Date().toISOString(),
      legal_basis: "GDPR Art.15 / PIPA §35",
      subject: m,
      consents: m.consents.map(k => PRIVACY_DATA.consentDefs.find(c => c.key === k)).filter(Boolean),
      processing_activities: PRIVACY_DATA.ropa,
      retention: PRIVACY_DATA.retentionPolicies,
    };
    downloadJson(`dsr-access-${m.id}-${new Date().toISOString().slice(0,10)}.json`, snapshot);
  };

  // v00.180 — 게시글 export/delete/bulk* 핸들러 모두 CommunityPostsAdminPanel 로 이전. AdminPage 는 onChange 콜백으로 새로고침만.

  // 모바일 사이드바 drawer 상태 — ≤900px 에서 햄버거 토글로 사이드바 슬라이드.
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  // 탭 변경 시 자동 닫힘 + Esc 닫기 + body scroll lock.
  React.useEffect(() => { setSidebarOpen(false); }, [tab, kmsTab]);

  // v00.165 — 사이드바 그룹 collapsible. 33 개 탭 동시 노출 → 시각 부하. 현재 탭의 그룹만 디폴트 펼침.
  const _findGroup = React.useCallback((tabName) => {
    const g = tabGroups.find((grp) => grp.items.includes(tabName));
    return g ? g.group : tabGroups[0].group;
  }, [tabGroups]);
  const currentGroup = React.useMemo(() => _findGroup(tab), [_findGroup, tab]);
  // v00.267 — 현재 탭 그룹 + 한켠 숙소 그룹은 기본 펼침(신규 기능 발견성).
  const [openGroups, setOpenGroups] = React.useState(() => new Set([_findGroup(tab), "한켠 숙소"]));
  // 다른 곳에서 setTab 호출로 탭 바뀌면 그 그룹 자동 펼침 (이미 펼쳐져 있으면 그대로).
  React.useEffect(() => {
    setOpenGroups((prev) => {
      if (prev.has(currentGroup)) return prev;
      const next = new Set(prev);
      next.add(currentGroup);
      return next;
    });
  }, [currentGroup]);
  const toggleGroup = (name) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  // v00.165 — 사이드바 항목 클릭 시 admin-main 영역 / 윈도우 스크롤 최상단.
  // 사용자 요청: '사이드 메뉴를 클릭하면 자동으로 제일 위로 올라갈수있게'.
  const handleTabClick = React.useCallback((nextTab) => {
    setTab(nextTab);
    // 다음 paint 에 스크롤 (탭 컨텐츠 마운트 후).
    requestAnimationFrame(() => {
      try {
        const main = document.querySelector('.admin-main');
        if (main && typeof main.scrollTo === 'function') main.scrollTo({ top: 0, behavior: 'smooth' });
        if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (_e) { console.warn('[bgnj] 스크롤·포커스 (AuthAdminPage.jsx:237)', _e); }
    });
  }, []);
  React.useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    const onResize = () => { if (window.innerWidth > 900) setSidebarOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    // v00.260 — Shell.jsx 의 글로벌 BGNJ_SCROLL_LOCK 카운터 사용.
    // 이전 prev 스냅샷 패턴은 다른 모달과 겹치면 'hidden' 영구 잠김 회귀 발생.
    window.BGNJ_SCROLL_LOCK?.lock?.();
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      window.BGNJ_SCROLL_LOCK?.unlock?.();
    };
  }, [sidebarOpen]);

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : ''}`} style={{display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'calc(100vh - 72px)', position:'relative'}}>
      {/* 모바일 햄버거 — ≤900px 에서만 보임 (CSS) */}
      <button
        type="button"
        className="admin-sidebar-toggle"
        aria-label={sidebarOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={sidebarOpen}
        aria-controls="admin-sidebar"
        onClick={() => setSidebarOpen((v) => !v)}>
        <span className="nav-toggle-bars" aria-hidden="true"/>
      </button>
      {/* 모바일 백드롭 — 클릭 시 닫힘 */}
      {sidebarOpen && <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true"/>}
      {/* Sidebar */}
      <aside id="admin-sidebar" aria-label="관리자 메뉴" className="admin-sidebar" style={{background:'var(--bg-2)', borderRight:'1px solid var(--line)', padding:'32px 0', overflowY:'auto'}}>
        <div style={{padding:'0 24px 24px', borderBottom:'1px solid var(--line)'}}>
          {/* v00.192 — 사이드바 제일 위쪽에 현재 홈페이지 버전.
              v00.238 — 사용자 민원 '좌측 메뉴 가독성 안 좋다'. 노란 primary 텍스트가 흰 배경에서
              대비 미달 → ink-2 슬레이트 + bg-3 배경으로 교체. KMS §2 옐로우 5% 룰 정합. */}
          <div style={{
            display:'inline-block', padding:'3px 10px', marginBottom:10,
            border:'1px solid var(--line-2)', background:'var(--bg-3)',
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:700,
            letterSpacing:'0.12em', color:'var(--ink-2)',
          }}>
            v{window.BGNJ_VERSION?.version || '?'} · {window.BGNJ_VERSION?.build || '?'}
          </div>
          <div className="mono" style={{fontSize:10, letterSpacing:'0.3em', color:'var(--ink-3)'}}>◆ ADMIN CONSOLE</div>
          <div className="ko-serif" style={{fontSize:20, marginTop:8, color:'var(--ink)'}}>관리자</div>
          <div className="mono" style={{fontSize:11, marginTop:4, color:'var(--ink-3)'}}>contact@bgnj.net</div>
          <div style={{marginTop:12, padding:'8px 10px', background:'var(--bg-3)', border:'1px solid var(--line-2)', fontFamily:'var(--font-mono)', fontSize:10, color:'var(--ink-2)', letterSpacing:'0.15em'}}>
            DPO · contact@bgnj.net
          </div>
          <div className="mono" style={{fontSize:10, marginTop:6, letterSpacing:'0.1em', color:'var(--ink-3)'}}>적용법: GDPR + PIPA</div>
          <div className="mono" style={{fontSize:10, letterSpacing:'0.1em', color:'var(--ink-3)'}}>최근 DPIA: 2026.03.02</div>
        </div>
        {/* v00.165 collapsible 그룹 · v00.216 시각 위계 강화: 그룹 헤더-서브 들여쓰기·가이드 라인·활성 표시 명료화 */}
        {tabGroups.map(grp => {
          const isOpen = openGroups.has(grp.group);
          const hasCurrent = grp.items.includes(tab);
          return (
            <div key={grp.group} style={{padding:'2px 0'}}>
              <button
                type="button"
                onClick={() => toggleGroup(grp.group)}
                aria-expanded={isOpen}
                className="mono"
                style={{
                  width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'12px 24px',
                  // v00.242 — 사용자 민원 '좌측 메뉴 가독성'. mono 11px → 12px + ink 강도 ↑.
                  // 활성 그룹은 secondary 보다 ink + 좌측 4px primary border 로 시각 위계 명료화.
                  fontSize:12, fontWeight:700, letterSpacing:'0.18em',
                  color: hasCurrent ? 'var(--ink)' : 'var(--ink-2)',
                  background: isOpen ? 'rgba(15,23,42,0.04)' : 'transparent',
                  borderLeft: hasCurrent ? '4px solid var(--primary)' : '4px solid transparent',
                  border:'none', borderLeftWidth: 4, borderLeftStyle:'solid',
                  borderLeftColor: hasCurrent ? 'var(--primary)' : 'transparent',
                  cursor:'pointer',
                  textTransform:'uppercase',
                }}>
                <span>
                  {grp.group}
                  <span style={{fontSize:10, color:'var(--ink-3)', marginLeft:8, fontWeight:500, letterSpacing:'0.1em'}}>· {grp.items.length}</span>
                </span>
                <span aria-hidden="true" style={{
                  fontSize:11, color:'var(--ink-3)',
                  transition:'transform .2s', display:'inline-block',
                  transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                }}>▾</span>
              </button>
              {isOpen && (
                <ul role="list" style={{
                  listStyle:'none', margin:0, padding:'4px 0 10px',
                  // 그룹 펼친 영역 좌측 세로 가이드 라인 — 트리 위계 시각화
                  position:'relative',
                  background:'rgba(15,23,42,0.015)',
                  borderBottom:'1px solid var(--line)',
                }}>
                  {/* 세로 가이드 라인 (서브 영역 좌측) */}
                  <span aria-hidden="true" style={{
                    position:'absolute', left:32, top:6, bottom:10,
                    width:1, background:'var(--line-2)',
                  }}/>
                  {grp.items.map(t => {
                    const active = tab === t;
                    return (
                      <li key={t}>
                        <button
                          type="button"
                          onClick={() => handleTabClick(t)}
                          aria-current={active ? "page" : undefined}
                          style={{
                            width:'100%', textAlign:'left',
                            padding:'10px 24px 10px 44px',
                            // v00.242 — sub-tab 가독성 ↑. 14/medium + ink (비활성) / ink + bold + primary 배경 (활성).
                            fontSize:14,
                            fontWeight: active ? 700 : 500,
                            background: active ? 'rgba(245,213,72,0.18)' : 'transparent',
                            color: active ? 'var(--ink)' : 'var(--ink)',
                            border:'none',
                            borderLeft: active ? '4px solid var(--primary)' : '4px solid transparent',
                            letterSpacing:'0.01em',
                            cursor:'pointer',
                            position:'relative',
                          }}
                          onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(15,23,42,0.04)'; }}
                          onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                          {t}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </aside>

      {/* Main */}
      <div className="admin-main" style={{padding:40, overflow:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32}}>
          <div>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em'}}>ADMIN / {tab.toUpperCase()}</div>
            <h1 className="ko-serif" style={{fontSize:32, fontWeight:500, marginTop:6}}>{tab}</h1>
          </div>
          <time className="mono dim-2" style={{fontSize:11}} dateTime={new Date().toISOString()}>
            {window.BGNJ_FMT.kstDateTime()}
          </time>
        </div>

        {/* 대시보드 — v00.146 일/주/월 가입자 + 활동 + 유입 추적 */}
        {tab === "대시보드" && <DashboardPanel
          dashboardStats={dashboardStats}
          allUsers={allUsers}
          allCommunityPosts={allCommunityPosts}
          latestCommunityPost={latestCommunityPost}
          latestColumn={latestColumn}
          setTab={setTab}
          G={G}/>}

        {false && (() => {
          const dailySignups = _countSince(allUsers, 'createdAt', 1);
          const weeklySignups = _countSince(allUsers, 'createdAt', 7);
          const monthlySignups = _countSince(allUsers, 'createdAt', 30);
          const dailyPosts = _countSince(allCommunityPosts, 'date', 1);
          const weeklyPosts = _countSince(allCommunityPosts, 'date', 7);
          const monthlyPosts = _countSince(allCommunityPosts, 'date', 30);
          const signupSeries = _dailySeries(allUsers, 'createdAt', 14);
          const postSeries = _dailySeries(allCommunityPosts, 'date', 14);
          const referrerData = [
            { src: '직접 방문', pct: 42 },
          ];
          return (
          <>
            {/* 1줄: 기존 4종 (전체 회원 / 게시글 / 칼럼 / 책 주문) */}
            <div className="grid grid-4" style={{marginBottom:18}}>
              {dashboardStats.map((s, i) => (
                <div key={i} className="card">
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12}}>{s.l}</div>
                  <div className="ko-serif" style={{fontSize:32, color:'var(--ink)'}}>{s.v}<span style={{fontSize:14, marginLeft:4}} className="dim-2">{s.unit||''}</span></div>
                  <div style={{fontSize:11, color: s.p ? 'var(--primary)' : 'var(--danger)', marginTop:8}}>{s.d}</div>
                </div>
              ))}
            </div>
            {/* 2줄: 일/주/월 방문자 (현재는 작성 활동 proxy) + 일일 가입자 */}
            <div className="admin-section__title">활동 · 방문 (활동량 proxy — 정확한 page-view tracking 은 v0.147+)</div>
            <div className="grid grid-4" style={{marginBottom:18}}>
              <MetricCard icon="📅" label="일일 활동자" value={dailyPosts}
                accent="var(--primary)" sub={`최근 24시간 게시글 ${dailyPosts}건`}/>
              <MetricCard icon="📊" label="주간 활동자" value={weeklyPosts}
                accent="var(--primary-hover)" sub={`최근 7일 게시글 ${weeklyPosts}건`}/>
              <MetricCard icon="📈" label="월간 활동자" value={monthlyPosts}
                accent="var(--gold-3, var(--primary-hover))" sub={`최근 30일 게시글 ${monthlyPosts}건`}/>
              <MetricCard icon="✨" label="오늘 신규 가입" value={dailySignups}
                accent="var(--secondary, #1F7A8C)"
                sub={`주간 ${weeklySignups}명 · 월간 ${monthlySignups}명`}/>
            </div>
            {/* 3줄: 추이 차트 */}
            <div className="grid grid-2" style={{marginBottom:18}}>
              <article className="card">
                <MiniBarChart label="📊 14일 가입 추이" series={signupSeries.counts} labels={signupSeries.labels} color="var(--secondary, #1F7A8C)" height={140}/>
                <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
                  최근 14일간 일별 신규 가입자 수. 막대에 마우스 hover 로 정확한 값 확인.
                </p>
              </article>
              <article className="card">
                <MiniBarChart label="📊 14일 게시글 추이" series={postSeries.counts} labels={postSeries.labels} color="var(--primary)" height={140}/>
                <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
                  최근 14일간 일별 신규 게시글 수. 활동량의 일별 변동 파악용.
                </p>
              </article>
            </div>
            {/* 4줄: 유입 경로 */}
            <div className="admin-section__title">유입 경로 (추정값 — referrer tracking infrastructure v0.147+ 예정)</div>
            <article className="card" style={{marginBottom:24}}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:14}}>TRAFFIC SOURCES</div>
              <div style={{display:'grid', gap:10}}>
                {referrerData.map((r, i) => (
                  <div key={i} style={{display:'flex', alignItems:'center', gap:12}}>
                    <div style={{minWidth:160, fontSize:13, color:'var(--ink)'}}>{r.src}</div>
                    <div style={{flex:1, height:8, background:'var(--bg-2)', borderRadius:4, overflow:'hidden', position:'relative'}}>
                      <div style={{position:'absolute', left:0, top:0, bottom:0, width:`${r.pct}%`, background:'var(--primary)', borderRadius:4}}/>
                    </div>
                    <div className="mono" style={{minWidth:40, textAlign:'right', fontSize:12, color:'var(--ink)', fontWeight:600}}>{r.pct}%</div>
                  </div>
                ))}
              </div>
              <p className="dim-2" style={{fontSize:11, marginTop:14, lineHeight:1.6}}>
                ⓘ 현재는 추정값. 실제 referrer 트래킹은 다음 사이클에 page-view 엔드포인트 + D1 page_views 테이블 추가 시 정확한 값 표시 예정.
              </p>
            </article>
            {/* 5줄: 기존 latest community + ops snapshot */}
            <div className="grid grid-2">
              <article className="card card-gold">
                <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>LATEST COMMUNITY</div>
                <h2 className="ko-serif" style={{fontSize:20, marginBottom:12}}>가장 최근 커뮤니티 글</h2>
                {latestCommunityPost ? (
                  <>
                    <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:10}}>
                      <span className="badge badge-gold">{latestCommunityPost.category}</span>
                      <span className="mono dim-2" style={{fontSize:11}}>{latestCommunityPost.date}</span>
                    </div>
                    <p style={{fontSize:16, marginBottom:10}}>{latestCommunityPost.title}</p>
                    <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
                      작성자 {latestCommunityPost.author} · 조회 {latestCommunityPost.views} · 댓글 {latestCommunityPost.replies}
                    </p>
                  </>
                ) : (
                  <p className="dim">등록된 게시글이 없습니다.</p>
                )}
                <button type="button" className="btn btn-small" onClick={() => setTab("커뮤니티")}>커뮤니티 관리로 이동</button>
              </article>

              <article className="card">
                <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>OPERATIONS SNAPSHOT</div>
                <h2 className="ko-serif" style={{fontSize:20, marginBottom:12}}>운영 요약</h2>
                <div style={{display:'grid', gap:12, marginBottom:18}}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">최근 칼럼</span><span>{latestColumn?.title || "없음"}</span></div>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">다음 강연</span><span>{G.arr(() => window.BGNJ_LECTURES?.listAll?.()).filter((l) => l && !l.hidden)[0]?.next || "없음"}</span></div>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">다음 투어</span><span>{G.arr(() => window.BGNJ_TOURS?.listAll?.()).filter((t) => t && !t.hidden)[0]?.next || "없음"}</span></div>
                  <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">DSR 대기</span><span>{PRIVACY_DATA.dsrRequests.filter(r => r.status !== 'done').length}건</span></div>
                </div>
                <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
                  <button type="button" className="btn btn-small" onClick={() => setTab("뱅기노자 칼럼")}>칼럼 관리</button>
                  <button type="button" className="btn btn-small" onClick={() => setTab("투어 프로그램")}>투어 관리</button>
                  <button type="button" className="btn btn-small" onClick={() => setTab("정보주체 권리")}>권리 요청 처리</button>
                </div>
              </article>
            </div>
          </>
          );
        })()}

        {tab === "사용자 여정" && <UserJourneyPanel/>}

        {tab === "버전 기록" && (() => {
          const VERSIONS_PER_PAGE = 10;
          const total = ADMIN_VERSION_HISTORY.length;
          const totalPages = Math.max(1, Math.ceil(total / VERSIONS_PER_PAGE));
          const safePage = Math.min(versionPage, totalPages);
          const start = (safePage - 1) * VERSIONS_PER_PAGE;
          const slice = ADMIN_VERSION_HISTORY.slice(start, start + VERSIONS_PER_PAGE);
          const latest = ADMIN_VERSION_HISTORY[0];
          return (
            <div style={{display:'grid', gap:16}}>
              <div className="card" style={{padding:18, display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap'}}>
                <div>
                  <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:6}}>VERSION HISTORY</div>
                  <div style={{fontSize:14, lineHeight:1.6}}>
                    총 <span className="ko-serif gold-2" style={{fontSize:20}}>{total}</span>개 버전 기록
                    {latest && <span className="dim-2 mono" style={{fontSize:11, marginLeft:10}}>
                      최신 {latest.version} · {latest.datetime ? (window.BGNJ_FMT?.kstDateTime?.(latest.datetime) || latest.date) : latest.date}
                    </span>}
                  </div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:14, flexWrap:'wrap'}}>
                  <button type="button" className="btn btn-small" onClick={() => {
                    // v00.107 — CSV 다운로드. version, datetime(KST), date, summary, details(joined), context.
                    const esc = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
                    const rows = [['version', 'datetime_kst', 'date', 'summary', 'details', 'context']];
                    for (const e of ADMIN_VERSION_HISTORY) {
                      rows.push([
                        e.version || '',
                        e.datetime ? (window.BGNJ_FMT?.kstDateTime?.(e.datetime) || '') : '',
                        e.date || '',
                        e.summary || '',
                        Array.isArray(e.details) ? e.details.join(' | ') : '',
                        e.context || '',
                      ]);
                    }
                    const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n'); // BOM for Excel KR.
                    downloadCsv(`bgnj-version-history-${new Date().toISOString().slice(0,10)}.csv`, csv);
                  }}>📥 CSV 다운로드</button>
                  <div className="mono dim-2" style={{fontSize:11, letterSpacing:'0.16em'}}>
                    {safePage} / {totalPages} 페이지 · {start + 1}–{Math.min(start + VERSIONS_PER_PAGE, total)}건 표시
                  </div>
                </div>
              </div>

              {slice.map((entry) => (
                <article key={entry.version} className="card card-gold" style={{padding:24}}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:16, alignItems:'start', marginBottom:16, flexWrap:'wrap'}}>
                    <div>
                      <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>VERSION LOG</div>
                      <h2 className="ko-serif" style={{fontSize:24}}>v{entry.version}</h2>
                    </div>
                    <div className="mono dim-2" style={{fontSize:11, textAlign:'right'}}>
                      {entry.datetime
                        ? (<><div>{window.BGNJ_FMT?.kstDateTime?.(entry.datetime) || entry.date}</div></>)
                        : entry.date}
                    </div>
                  </div>

                  <div style={{marginBottom:18}}>
                    <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>핵심 수정사항</div>
                    <p className="dim" style={{fontSize:13, lineHeight:1.8}}>{entry.summary}</p>
                  </div>

                  <div style={{marginBottom:18}}>
                    <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>세부 업데이트 내역</div>
                    <div style={{display:'grid', gap:8}}>
                      {entry.details.map((detail) => (
                        <div key={detail} className="card" style={{padding:14}}>{detail}</div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>수정 계기와 배경</div>
                    <div className="card" style={{padding:14}}>
                      <p className="dim" style={{fontSize:13, lineHeight:1.8}}>{entry.context}</p>
                    </div>
                  </div>
                </article>
              ))}

              {totalPages > 1 && (
                <nav aria-label="버전 기록 페이지 이동" style={{display:'flex', justifyContent:'center', alignItems:'center', gap:6, marginTop:8, flexWrap:'wrap'}}>
                  <button type="button" className="btn btn-small"
                    onClick={() => setVersionPage(Math.max(1, safePage - 1))}
                    disabled={safePage <= 1}>← 이전</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button key={n} type="button" className="btn btn-small"
                      aria-current={n === safePage ? 'page' : undefined}
                      onClick={() => setVersionPage(n)}
                      style={{
                        borderColor: n === safePage ? 'var(--primary)' : 'var(--line)',
                        color: n === safePage ? 'var(--primary)' : 'var(--ink-2)',
                        background: n === safePage ? 'rgba(245,213,72,0.08)' : 'transparent',
                        minWidth: 36,
                      }}>{n}</button>
                  ))}
                  <button type="button" className="btn btn-small"
                    onClick={() => setVersionPage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage >= totalPages}>다음 →</button>
                </nav>
              )}
            </div>
          );
        })()}

        {tab === "KMS" && (
          <div style={{display:'grid', gap:16}}>
            <div className="card card-gold" style={{padding:24}}>
              <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>KMS SUMMARY</div>
              <h2 className="ko-serif" style={{fontSize:24, marginBottom:12}}>KMS는 두 개의 탭으로 구성됩니다</h2>
              <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:14}}>
                KMS의 제1 기능은 기능정의서입니다. 사이트가 존재하는 5가지 미션(뱅기노자 커뮤니티 / 강연 일정 / 칼럼 / 투어 프로그램 / 책 판매)을 기준으로 현재 어떤 기능이 있고
                무엇이 비어 있는지를 먼저 보여주고, 그 위에 디자인 원칙을 함께 둡니다. KMS에 진입하면 기본은 `기능정의서` 탭입니다.
              </p>
              <div style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 1fr))', gap:12}} className="stats-grid">
                <div className="card" style={{padding:14}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:6}}>탭 1 · 기본</div>
                  <div className="ko-serif" style={{fontSize:18}}>기능정의서</div>
                  <div className="dim" style={{fontSize:12, marginTop:6, lineHeight:1.6}}>5개 미션 + 공통 기반을 영역 단위로 정리하고, 영역마다 기능 / 기술 스펙 / 유의할 점 / 개발 이슈를 함께 기록합니다.</div>
                </div>
                <div className="card" style={{padding:14}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:6}}>탭 2</div>
                  <div className="ko-serif" style={{fontSize:18}}>디자인</div>
                  <div className="dim" style={{fontSize:12, marginTop:6, lineHeight:1.6}}>새 화면을 만들거나 기존 UI를 바꿀 때 먼저 확인하는 브랜드 무드, 컬러, 타이포, 레이아웃, 금지 원칙입니다.</div>
                </div>
              </div>
            </div>

            <div style={{display:'flex', gap:8, flexWrap:'wrap'}} role="tablist" aria-label="KMS 영역 선택">
              {["기능정의서", "디자인"].map((item) => {
                const on = kmsTab === item;
                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    className="btn btn-small"
                    onClick={() => setKmsTab(item)}
                    style={{
                      borderColor: on ? 'var(--primary)' : 'var(--line-2)',
                      color: on ? 'var(--primary)' : 'var(--ink)',
                      background: on ? 'rgba(245,213,72,0.10)' : 'var(--bg-2)',
                      fontWeight: on ? 700 : 500,
                    }}>
                    {item}
                  </button>
                );
              })}
            </div>

            {kmsTab === "기능정의서" && (
              <div style={{display:'grid', gridTemplateColumns:'minmax(0, 1fr) 240px', gap:24, alignItems:'start'}} className="kms-fdef-layout">
                <div style={{display:'grid', gap:16, minWidth:0}}>
                  <article id="fdef-overview" className="card card-gold" style={{padding:24, scrollMarginTop:24}}>
                    <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>MISSION OVERVIEW</div>
                    <h2 className="ko-serif" style={{fontSize:22, marginBottom:10}}>5가지 미션 평가 요약</h2>
                    <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:18}}>
                      이 사이트가 존재하는 이유는 다음 다섯 가지입니다.
                      각 미션은 아래 영역으로 이어지며, 각 영역의 평가와 빈 칸은 본 기능정의서 본문에서 영역별로 자세히 기록합니다.
                    </p>
                    <div style={{display:'grid', gap:10}}>
                      {MISSION_OVERVIEW.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            const el = document.getElementById(`fdef-${m.id}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="card"
                          style={{padding:14, textAlign:'left', cursor:'pointer', background:'transparent'}}>
                          <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:6}}>
                            <div style={{display:'flex', gap:10, alignItems:'baseline'}}>
                              <span className="mono dim-2" style={{fontSize:11, letterSpacing:'0.18em'}}>MISSION {m.number}</span>
                              <span className="ko-serif" style={{fontSize:16}}>{m.title}</span>
                            </div>
                            <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', color:'var(--secondary)'}}>{m.state} · {m.coverage}</span>
                          </div>
                          <div className="dim" style={{fontSize:13, lineHeight:1.7, marginBottom:6}}>{m.short}</div>
                          <div style={{fontSize:12, lineHeight:1.7, color:'var(--ink-2)'}}>{m.verdict}</div>
                        </button>
                      ))}
                    </div>
                  </article>

                  {FEATURE_DOMAINS.map((domain) => {
                    const statusTone = domain.status?.includes('미구현')
                      ? 'var(--danger)'
                      : domain.status?.includes('부분') || domain.status?.includes('카탈로그') || domain.status?.includes('UI')
                        ? 'var(--ink-2)'
                        : 'var(--primary)';
                    return (
                      <article id={`fdef-${domain.id}`} key={domain.id} className="card" style={{padding:24, scrollMarginTop:24}}>
                        <header style={{borderBottom:'1px solid var(--line)', paddingBottom:16, marginBottom:18}}>
                          <div style={{display:'flex', justifyContent:'space-between', gap:16, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                            <div style={{display:'flex', gap:12, alignItems:'baseline'}}>
                              <span className="mono dim-2" style={{fontSize:11, letterSpacing:'0.22em'}}>{domain.id === 'infra' ? 'BASE' : `MISSION ${domain.number}`}</span>
                              <h2 className="ko-serif" style={{fontSize:24}}>{domain.title}</h2>
                            </div>
                            <span className="mono" style={{fontSize:11, letterSpacing:'0.2em', color: statusTone}}>STATUS · {domain.status}</span>
                          </div>
                          <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:10}}>{domain.role}</p>
                          <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em'}}>routes: {domain.routes.join(' · ')}</div>
                        </header>

                        <div style={{display:'grid', gap:18}}>
                          <section>
                            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>현재 평가</div>
                            <div className="card" style={{padding:14, lineHeight:1.8}}>{domain.evaluation}</div>
                          </section>

                          {domain.missing && domain.missing.length > 0 && (
                            <section>
                              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>없는 기능 / 완성도를 높이려면 필요한 것</div>
                              <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
                                {domain.missing.map((item) => (
                                  <li key={item} style={{padding:'8px 12px', borderLeft:'2px solid var(--primary-dim)', background:'rgba(245,213,72,0.04)', fontSize:13, lineHeight:1.7}}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </section>
                          )}

                          <section>
                            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>기능 ({domain.features.length})</div>
                            <div style={{display:'grid', gap:12}}>
                              {domain.features.map((feature) => {
                                const fTone = feature.status === '구현됨'
                                  ? 'var(--primary)'
                                  : feature.status === '미구현' || feature.status?.startsWith('UI만')
                                    ? 'var(--danger)'
                                    : 'var(--ink-2)';
                                return (
                                  <div key={feature.name} className="card" style={{padding:16, borderColor:'var(--line-2)'}}>
                                    <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:8}}>
                                      <h3 className="ko-serif" style={{fontSize:17}}>{feature.name}</h3>
                                      <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: fTone}}>{feature.status}</span>
                                    </div>
                                    {feature.summary && (
                                      <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:12}}>{feature.summary}</p>
                                    )}
                                    {feature.elements && feature.elements.length > 0 && (
                                      <div style={{marginBottom:12}}>
                                        <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:6}}>요소</div>
                                        <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:4}}>
                                          {feature.elements.map((el) => (
                                            <li key={el} style={{fontSize:12, lineHeight:1.7, paddingLeft:14, position:'relative'}}>
                                              <span style={{position:'absolute', left:0, color:'var(--primary-dim)'}}>·</span>
                                              {el}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {feature.techSpec && (
                                      <div style={{marginBottom:10}}>
                                        <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:4}}>기술 스펙</div>
                                        <div style={{fontSize:12, lineHeight:1.7, color:'var(--ink-2)'}}>{feature.techSpec}</div>
                                      </div>
                                    )}
                                    {feature.caution && (
                                      <div style={{marginBottom:10}}>
                                        <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:4}}>유의할 점</div>
                                        <div style={{fontSize:12, lineHeight:1.7, color:'var(--ink-2)'}}>{feature.caution}</div>
                                      </div>
                                    )}
                                    {feature.issues && feature.issues.length > 0 && (
                                      <div>
                                        <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:4}}>개발 이슈</div>
                                        <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:3}}>
                                          {feature.issues.map((issue) => (
                                            <li key={issue} style={{fontSize:12, lineHeight:1.7, paddingLeft:14, position:'relative', color:'var(--ink-2)'}}>
                                              <span style={{position:'absolute', left:0, color:'var(--danger)'}}>!</span>
                                              {issue}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </section>

                          {domain.techSpec && (
                            <section>
                              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>영역 차원 · 기술 스펙</div>
                              <div className="card" style={{padding:14, lineHeight:1.8, fontSize:13}}>{domain.techSpec}</div>
                            </section>
                          )}

                          {domain.cautions && domain.cautions.length > 0 && (
                            <section>
                              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>영역 차원 · 유의할 점</div>
                              <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
                                {domain.cautions.map((c) => (
                                  <li key={c} style={{padding:'8px 12px', borderLeft:'2px solid var(--ink-3)', fontSize:13, lineHeight:1.7}}>{c}</li>
                                ))}
                              </ul>
                            </section>
                          )}

                          {domain.issues && domain.issues.length > 0 && (
                            <section>
                              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>영역 차원 · 개발과정에서 마주한 이슈</div>
                              <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
                                {domain.issues.map((iss) => (
                                  <li key={iss} style={{padding:'8px 12px', borderLeft:'2px solid var(--danger)', fontSize:13, lineHeight:1.7}}>{iss}</li>
                                ))}
                              </ul>
                            </section>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <aside aria-label="기능정의서 목차" style={{position:'sticky', top:24, alignSelf:'start'}} className="kms-fdef-toc">
                  <div className="card" style={{padding:16}}>
                    <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:12}}>TABLE OF CONTENTS</div>
                    <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:4}}>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('fdef-overview');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          style={{
                            width:'100%', textAlign:'left', padding:'8px 10px',
                            background:'transparent', border:'1px solid transparent',
                            color:'var(--ink-2)', fontSize:12, lineHeight:1.5, cursor:'pointer',
                            borderLeft:'2px solid var(--primary)',
                          }}>
                          5가지 미션 평가
                        </button>
                      </li>
                      {FEATURE_DOMAINS.map((d) => (
                        <li key={d.id}>
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById(`fdef-${d.id}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            style={{
                              width:'100%', textAlign:'left', padding:'8px 10px',
                              background:'transparent', border:'1px solid transparent',
                              color:'var(--ink-2)', fontSize:12, lineHeight:1.5, cursor:'pointer',
                              borderLeft:'2px solid var(--line-2)',
                            }}>
                            <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.2em', marginBottom:2}}>
                              {d.id === 'infra' ? 'BASE' : `MISSION ${d.number}`}
                            </div>
                            {d.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div style={{borderTop:'1px solid var(--line)', marginTop:14, paddingTop:12}}>
                      <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:6}}>구성</div>
                      <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:4, fontSize:11, lineHeight:1.7, color:'var(--ink-3)'}}>
                        <li>· 영역 평가</li>
                        <li>· 없는 기능 정리</li>
                        <li>· 기능 + 요소</li>
                        <li>· 기술 스펙</li>
                        <li>· 유의할 점</li>
                        <li>· 개발 이슈</li>
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            )}

            {kmsTab === "디자인" && <DesignSystemView/>}

          </div>
        )}

        {/* 게시글 */}
        {/* v00.177 — 커뮤니티 통합. 게시글(현재 인라인 JSX) + 게시판(CommunityBoardsPanel) + 신고. SubTabsView. */}
        {tab === "커뮤니티" && (
          <SubTabsView
            storageKey="bgnj_admin_subtab_community"
            defaultKey="posts"
            subTabs={[
              // v00.180 — 인라인 JSX → CommunityPostsAdminPanel 호출 (DRY 추출).
              { key: "posts", label: "게시글", render: () => (
                <CommunityPostsAdminPanel
                  posts={allCommunityPosts}
                  onChange={() => setPostRefreshKey((v) => v + 1)}/>
              )},
              { key: "boards", label: "게시판", render: () => <CommunityBoardsPanel/> },
              // v00.305.001 — 말머리 전용 탭. 그전까지 말머리를 등록할 자리가
              //   화면에 아예 없었다(AdminCategoryPanel 이 렌더되지 않았다).
              { key: "prefixes", label: "말머리", render: () => <PrefixTagsPanel/> },
              { key: "reports", label: "신고", render: () => (
                <>
                  <CorruptedBodyInspector go={go}/>
                  <ReportQueuePanel onRefresh={() => setPostRefreshKey((v) => v + 1)} go={go}/>
                </>
              )},
            ]}/>
        )}

        {/* v00.177 — '신고' 별도 라우트 폐기. '커뮤니티' SubTabsView 안으로 이동. */}

        {/* 칼럼 — 통합 허브 (목록 + 글쓰기 모달). v00.067 */}
        {tab === "뱅기노자 칼럼" && <ColumnsHubPanel allColumns={allColumns}/>}

        {/* 강연 */}
        {tab === "강연" && <LectureAdminPanel go={go}/>}

        {/* 투어 프로그램 */}
        {tab === "투어 프로그램" && <TourAdminPanel go={go}/>}

        {/* 회원 */}
        {tab === "회원" && <MemberAdminPanel go={go}/>}

        {/* 도서 주문 운영 (v00.153 다권화 이후 일반화) */}
        {tab === "책 주문" && <BookOrderAdminPanel go={go}/>}
        {tab === "책 카탈로그" && <BooksAdminPanel/>}

        {/* 정보주체 권리 */}
        {tab === "정보주체 권리" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.15–22 / PIPA §35–38. 응답기한: <strong className="gold">GDPR 1개월</strong> / <strong className="gold">PIPA 10일</strong>.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>ID</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>권리유형</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>정보주체</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>적용법</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>접수</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>기한</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>상태</th>
                  <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.dsrRequests.map(r => {
                  const left = r.status === 'done' ? null : formatTimeLeft(r.dueAt);
                  const toneColor = left?.tone === 'danger' ? 'var(--danger)' : left?.tone === 'warn' ? 'var(--primary-hover)' : 'var(--ink-2)';
                  const label = DSR_LABELS[r.type];
                  return (
                    <tr key={r.id} style={{borderBottom:'1px solid var(--line)'}}>
                      <td className="mono gold" style={{padding:14}}>{r.id}</td>
                      <td style={{padding:14}}>
                        <div className="ko-serif">{label?.ko}</div>
                        <div className="mono dim-2" style={{fontSize:10}}>{label?.gdpr} · {label?.pipa}</div>
                      </td>
                      <td style={{padding:14}}>
                        <div>{r.user}</div>
                        <div className="mono dim-2" style={{fontSize:10}}>{r.email}</div>
                      </td>
                      <td style={{padding:14}}><span className="badge">{r.law}</span></td>
                      <td className="mono dim-2" style={{padding:14}}>{r.openedAt.slice(0,10)}</td>
                      <td className="mono" style={{padding:14, color: toneColor}}>
                        {r.status === 'done' ? '완료' : left?.text}
                      </td>
                      <td style={{padding:14}}>
                        <span className="badge" style={{
                          borderColor: r.status==='done' ? 'var(--primary-dim)' : r.status==='in_progress' ? 'var(--primary)' : 'var(--line-2)',
                          color: r.status==='done' ? 'var(--primary-dim)' : r.status==='in_progress' ? 'var(--primary)' : 'var(--ink-2)',
                        }}>{r.status==='open'?'접수':r.status==='in_progress'?'처리중':'완료'}</span>
                      </td>
                      <td style={{padding:14, textAlign:'right'}}>
                        <button type="button" className="btn btn-small">처리</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {/* 동의 관리 */}
        {tab === "동의 관리" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.7 / PIPA §15, §22. 동의는 <strong className="gold">자유·구체·고지·철회 가능</strong>해야 하며, 버전별 이력이 보존됩니다.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>항목</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>필수</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>버전</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>법적 근거</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>개정일</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.consentDefs.map(c => (
                  <tr key={c.key} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="ko-serif" style={{padding:14}}>{c.label}</td>
                    <td style={{padding:14}}>
                      <span className="badge" style={{borderColor: c.required?'var(--primary)':'var(--line-2)', color: c.required?'var(--primary)':'var(--ink-2)'}}>{c.required ? '필수' : '선택'}</span>
                    </td>
                    <td className="mono gold" style={{padding:14}}>{c.version}</td>
                    <td style={{padding:14}}>{c.lawful}</td>
                    <td className="mono dim-2" style={{padding:14}}>{c.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ROPA */}
        {tab === "처리활동(ROPA)" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.30. 모든 처리 목적·법적 근거·보유기간·수탁자·국외이전을 문서화합니다.
            </p>
            <div style={{overflowX:'auto', border:'1px solid var(--line)'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:880}}>
                <thead>
                  <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:90}}>ID</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left'}}>처리 목적</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:120}}>법적 근거</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left'}}>수집 항목</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:140}}>보유기간</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:140}}>수탁사</th>
                    <th scope="col" style={{padding:'12px 14px', textAlign:'left', width:120}}>국외이전</th>
                  </tr>
                </thead>
                <tbody>
                  {PRIVACY_DATA.ropa.map((r) => (
                    <tr key={r.id} style={{borderTop:'1px solid var(--line)'}}>
                      <td className="mono gold" style={{padding:'12px 14px', fontSize:11, letterSpacing:'0.14em', verticalAlign:'top'}}>{r.id}</td>
                      <td className="ko-serif" style={{padding:'12px 14px', fontWeight:500, verticalAlign:'top'}}>{r.purpose}</td>
                      <td className="gold" style={{padding:'12px 14px', verticalAlign:'top'}}>{r.lawful}</td>
                      <td style={{padding:'12px 14px', verticalAlign:'top'}}>{r.items}</td>
                      <td style={{padding:'12px 14px', verticalAlign:'top'}}>{r.retention}</td>
                      <td style={{padding:'12px 14px', verticalAlign:'top'}}>{r.processor}</td>
                      <td style={{padding:'12px 14px', verticalAlign:'top'}}>{r.transfer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 쿠키 */}
        {tab === "쿠키·추적" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              ePrivacy Directive / PIPA §39의8. 필수 외 쿠키는 사전 <strong className="gold">옵트인 동의</strong>가 필요합니다.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>쿠키명</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>분류</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>목적</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>보관</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>당사자</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.cookies.map(c => (
                  <tr key={c.name} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="mono gold" style={{padding:14}}>{c.name}</td>
                    <td style={{padding:14}}><span className="badge" style={{borderColor: c.cat==='필수' ? 'var(--primary)' : 'var(--line-2)', color: c.cat==='필수' ? 'var(--primary)' : 'var(--ink-2)'}}>{c.cat}</span></td>
                    <td style={{padding:14}}>{c.purpose}</td>
                    <td className="mono dim-2" style={{padding:14}}>{c.ttl}</td>
                    <td className="mono dim-2" style={{padding:14}}>{c.party}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* 보안 사고 */}
        {tab === "보안 사고" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.33 — 인지 후 <strong className="gold">72시간 내 감독기관 통지</strong>. PIPA §34 — 인지 후 72시간 내 정보주체 및 개인정보위 통지.
            </p>
            {PRIVACY_DATA.breaches.map(b => {
              const toneColor = b.severity==='high' ? 'var(--danger)' : b.severity==='medium' ? 'var(--primary-hover)' : 'var(--ink-2)';
              return (
                <article key={b.id} className="card" style={{marginBottom:16}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
                    <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em'}}>{b.id}</div>
                    <span className="badge" style={{borderColor:toneColor, color:toneColor}}>심각도: {b.severity}</span>
                  </div>
                  <h3 className="ko-serif" style={{fontSize:18, marginBottom:8}}>{b.kind}</h3>
                  <dl style={{display:'grid', gridTemplateColumns:'120px 1fr', gap:'4px 16px', fontSize:12, lineHeight:1.7}}>
                    <dt className="dim-2 mono" style={{fontSize:10}}>감지</dt><dd className="mono">{b.detectedAt}</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>72h 기한</dt><dd className="mono">{b.notifyDueAt}</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>영향 주체</dt><dd>{window.BGNJ_FMT.currency(b.affected)}명</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>당국 통지</dt><dd className={b.authorityNotified?'gold':'dim-2'}>{b.authorityNotified?'✓ 완료':'—'}</dd>
                    <dt className="dim-2 mono" style={{fontSize:10}}>주체 통지</dt><dd className={b.subjectNotified?'gold':'dim-2'}>{b.subjectNotified?'✓ 완료':'—'}</dd>
                  </dl>
                  {b.note && <p className="dim" style={{fontSize:12, marginTop:12, lineHeight:1.7}}>{b.note}</p>}
                </article>
              );
            })}
            <button type="button" className="btn btn-gold">새 사고 접수 →</button>
          </>
        )}

        {/* 보유·파기 */}
        {tab === "보유·파기" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Art.5(1)(e) 저장제한 원칙 / PIPA §21. 목적 달성 후 지체 없이 파기합니다.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>데이터 분류</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>보유기간</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>근거</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.retentionPolicies.map((r, i) => (
                  <tr key={i} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="ko-serif" style={{padding:14}}>{r.category}</td>
                    <td className="mono gold" style={{padding:14}}>{r.period}</td>
                    <td style={{padding:14}}>{r.lawful}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* 국외 이전 */}
        {tab === "국외 이전" && (
          <>
            <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
              GDPR Chapter V / PIPA §28의8. 제3국 이전 시 적정성 결정 또는 SCCs 등 안전장치가 필요합니다.
            </p>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
              <thead>
                <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>수탁·이전 대상</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>국가</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>목적</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>항목</th>
                  <th scope="col" style={{padding:12, textAlign:'left'}}>안전장치</th>
                </tr>
              </thead>
              <tbody>
                {PRIVACY_DATA.transfers.map((t, i) => (
                  <tr key={i} style={{borderBottom:'1px solid var(--line)'}}>
                    <td className="ko-serif" style={{padding:14}}>{t.recipient}</td>
                    <td style={{padding:14}}>{t.country}</td>
                    <td className="dim" style={{padding:14}}>{t.purpose}</td>
                    <td className="mono" style={{padding:14, fontSize:11}}>{t.items}</td>
                    <td className="gold mono" style={{padding:14, fontSize:11}}>{t.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === "추천 여행지" && <RecommendationsAdminPanel/>}
        {/* v00.290 — 먹고/사고 놀자 삭제. 자고 놀자(=한켠)만 유지. */}
        {tab === "자고 놀자" && KindPagePanel && <window.KindPagePanel kind="sleep"/>}
        {/* v00.267 — 한켠 숙소 예약 PMS (7 탭) */}
        {tab === "한켠 예약" && HangyeonAdminPanel && <window.HangyeonAdminPanel/>}
        {/* 카테고리 CRUD */}
        {/* v00.166 — 사이트 설정 7 항목 단일 머지. v00.167 — 우측 라이브 미리보기 iframe. */}
        {tab === "사이트 설정" && (
          <SubTabsView
            storageKey="bgnj_admin_subtab_site_settings"
            defaultKey="content"
            subTabs={[
              // v00.193 — 사용자 요청 '모든 메뉴에 실시간 미리보기, 메뉴별 매칭 화면'.
              // 이전에 home/hero/bank 는 previewUrl 미지정 (자체 임베드 또는 노출 페이지 없음) → 모두 '/' 폴백.
              { key: "content",  label: "사이트 콘텐츠",   previewUrl: "/",        render: () => <SiteContentAdminPanel/> },
              { key: "banner",   label: "공지·배너",        previewUrl: "/",        render: () => <BannerEditorPanel/> },
              { key: "home",     label: "홈 텍스트",        previewUrl: "/",        render: () => <HomeTextEditorPanel/> },
              { key: "hero",     label: "히어로",           previewUrl: "/",        render: () => <HeroEditorPanel/> },
              { key: "seo",      label: "SEO",             previewUrl: "/",        render: () => <SEOAdminPanel/> },
              // v00.196 — 검색콘솔 (Google/Naver/Bing/Yandex) 검증 + sitemap ping.
              { key: "search",   label: "검색엔진",         previewUrl: "/",        render: () => <SearchConsoleAdminPanel/> },
              { key: "legal",    label: "약관/개인정보",   previewUrl: "/terms",   render: () => <LegalAdminPanel/> },
              { key: "faq",      label: "자주 묻는 질문",  previewUrl: "/faq",     render: () => <FaqAdminPanel/> },
              { key: "bank",     label: "계좌번호",         previewUrl: "/faq",     render: () => <BankAccountPanel/> },
            ]}/>
        )}
        {/* v00.105 — '투어 페이지' / '강연 페이지' 탭 제거. TourAdminPanel / LectureAdminPanel 상단에 inline 통합. */}
        {/* v00.175 — '카테고리' 탭 폐기. AdminCategoryPanel 컴포넌트는 코드 보존(향후 칼럼 카테고리 등 재사용 여지). */}
        {/* v00.177 — '커뮤니티 게시판' 별도 라우트 폐기. '커뮤니티' SubTabsView 안으로 이동. */}
        {/* v00.166 — 약관/개인정보, 자주 묻는 질문, SEO 는 "사이트 설정" 머지로 이동. */}
        {tab === "감사 로그" && <AuditLogPanel/>}
        {/* v00.183 — 내부 인원 알람. */}
        {tab === "내부 알람" && <InternalAlarmPanel/>}
        {/* v00.190 — 통합 활동 로그. */}
        {tab === "활동 로그" && <ActivityLogPanel/>}
        {tab === "오류 로그" && <ErrorLogPanel/>}
        {tab === "오류 페이지 미리보기" && <ErrorPagesPreviewPanel go={go}/>}
        {/* v00.171 — '데이터 정리' 탭 폐기. 마이그레이션 완료. LegacyMigrationPanel 컴포넌트는 코드 유지(향후 재사용 여지). */}

        {/* 회원 등급 CRUD */}
        {tab === "회원 등급" && <AdminGradePanel/>}

        {/* 칼럼 작성 (관리자 전용, Tiptap column preset — 이미지 본문 삽입/이동 가능) */}
        {/* '칼럼 작성' 탭은 v00.067 에 '뱅기노자 칼럼' 의 모달로 통합 (구 진입 경로 호환). */}
        {tab === "칼럼 작성" && <ColumnsHubPanel allColumns={allColumns}/>}

        {/* 계좌번호 설정 */}
        {/* v00.166 — 계좌번호 설정 → "사이트 설정" sub-tab 으로 이동. */}

        {/* 설정 — 입금 계좌는 별도 '계좌번호 설정' 탭에서 관리. */}
        {tab === "설정" && (
          <div style={{display:'grid', gap:24}}>
            <div className="card" style={{padding:'14px 18px', background:'var(--bg-2)', borderLeft:'3px solid var(--primary-dim)'}}>
              <p className="dim" style={{fontSize:13, lineHeight:1.7, margin:0}}>
                ⓘ 무통장 입금 계좌는 좌측 메뉴의 <strong className="gold">계좌번호 설정</strong> 탭에서 관리합니다 (멀티 계좌 지원).
              </p>
            </div>
            <div className="card">
              <h2 className="ko-serif" style={{fontSize:20, marginBottom:16}}>사이트 설정</h2>
              <dl style={{display:'grid', gridTemplateColumns:'200px 1fr', gap:'8px 24px', fontSize:13, lineHeight:1.8}}>
                <dt className="dim-2 mono" style={{fontSize:11}}>DPO</dt><dd>contact@bgnj.net · 02-0000-0001</dd>
                <dt className="dim-2 mono" style={{fontSize:11}}>개인정보 책임자</dt><dd>뱅기노자 / contact@bgnj.net</dd>
                <dt className="dim-2 mono" style={{fontSize:11}}>최근 DPIA</dt><dd>2026-03-02</dd>
                <dt className="dim-2 mono" style={{fontSize:11}}>적용 법역</dt><dd>대한민국(PIPA) · 유럽연합(GDPR)</dd>
                <dt className="dim-2 mono" style={{fontSize:11}}>감독기관</dt><dd>개인정보보호위원회 / 관할 EU DPA</dd>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// AdminCategoryPanel · PromoChip · CommunityBoardsPanel 은 admin/AdminCommunityConfigPanels.jsx 로 분리 (v00.285).
import { AdminCategoryPanel, PrefixTagsPanel } from './admin/AdminCommunityConfigPanels.jsx';
import { CommunityBoardsPanel } from './admin/AdminCommunityConfigPanels.jsx';


// 등급/칼럼 클러스터(AdminGradePanel·AdminColumnEditor·ColumnsHubPanel + 종속)는 admin/AdminGradeColumnPanels.jsx 로 분리 (v00.285).
import { AdminGradePanel } from './admin/AdminGradeColumnPanels.jsx';
import { ColumnsHubPanel } from './admin/AdminGradeColumnPanels.jsx';


const AdminDenied = ({ go, user }) => (
  <div className="section" style={{minHeight:'calc(100vh - 72px)', display:'grid', placeItems:'center'}}>
    <div className="card" style={{maxWidth:480, textAlign:'center', padding:48}}>
      <div className="mono gold" style={{fontSize:11, letterSpacing:'0.3em', marginBottom:12}}>◆ ACCESS DENIED</div>
      <h1 className="ko-serif" style={{fontSize:24, marginBottom:16}}>관리자 권한이 필요합니다</h1>
      <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:24}}>
        {user
          ? <>현재 로그인 계정(<span className="gold">{user.email}</span>)은 관리자 권한이 없습니다.</>
          : "이 페이지는 로그인한 관리자만 접근할 수 있습니다."}
      </p>
      <div style={{display:'flex', gap:10, justifyContent:'center'}}>
        <button type="button" className="btn btn-gold btn-small" onClick={() => go(user ? "home" : "login")}>
          {user ? "홈으로" : "로그인"}
        </button>
      </div>
    </div>
  </div>
);

// LoginPage 는 AdminLogin.jsx 로 분리되어 거기서 window 노출.
Object.assign(window, { AdminPage, AdminDenied });

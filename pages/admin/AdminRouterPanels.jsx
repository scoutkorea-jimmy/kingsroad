// 뱅기노자 — 관리자 라우터 패널 묶음 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// AdminPage 라우터가 탭별로 렌더하는 패널/데이터: PRIVACY_DATA·DSR_LABELS(GDPR/PIPA 모의) ·
// CorruptedBodyInspector · ReportQueuePanel · ErrorPagesPreviewPanel · PostViewerModal(공유 모달) ·
// InternalAlarmPanel · CommunityPostsAdminPanel(+게시글 페이지네이션 상수).
// 자기완결적 — 의존은 모두 window 전역. entry-admin 에서 AuthAdminPage(라우터) 앞에 로드.
// 라우터가 참조하는 7개 심볼만 window 노출.

// === GDPR/PIPA 모의 데이터 ========================================
// v00.286 ESM — cross-module import (전역 결합 제거).
import { downloadCsv } from './AdminShared.jsx';

const PRIVACY_DATA = {
  // Data Subject Rights — 정보주체 권리 요청 큐
  // GDPR Art.15–22 / PIPA §35–38. 기본 응답기한: GDPR 1개월, PIPA 10일. 72h 타이머는 권고.
  dsrRequests: [
    { id: "DSR-2026-041", type: "access",     user: "돌담아래",    email: "stone@example.com", openedAt: "2026-04-19T09:12:00Z", dueAt: "2026-05-19T23:59:00Z", law: "GDPR+PIPA", status: "open" },
    { id: "DSR-2026-040", type: "erasure",    user: "overseas_reader", email: "r@eu.example", openedAt: "2026-04-18T16:04:00Z", dueAt: "2026-05-18T23:59:00Z", law: "GDPR",      status: "in_progress", assignee: "DPO" },
    { id: "DSR-2026-039", type: "rectify",    user: "역사애호",    email: "h@example.com",    openedAt: "2026-04-16T11:30:00Z", dueAt: "2026-04-26T23:59:00Z", law: "PIPA",      status: "in_progress", assignee: "김관리" },
    { id: "DSR-2026-038", type: "portability",user: "봄밤의자",    email: "s@eu.example",     openedAt: "2026-04-14T10:00:00Z", dueAt: "2026-05-14T23:59:00Z", law: "GDPR",      status: "done",   resolvedAt: "2026-04-17T15:22:00Z" },
    { id: "DSR-2026-037", type: "restrict",   user: "입문자",      email: "b@example.com",    openedAt: "2026-04-10T08:00:00Z", dueAt: "2026-04-20T23:59:00Z", law: "PIPA",      status: "done",   resolvedAt: "2026-04-13T09:10:00Z" },
  ],
  // 동의 항목 정의 (버전 관리)
  consentDefs: [
    { key: "terms",     label: "이용약관",               required: true,  version: "v3.1", updated: "2026-03-02", lawful: "계약 이행" },
    { key: "privacy",   label: "개인정보 처리방침",      required: true,  version: "v4.0", updated: "2026-03-02", lawful: "법적 의무(PIPA §15)" },
    { key: "marketing", label: "마케팅 정보 수신 (이메일)", required: false, version: "v2.0", updated: "2026-01-15", lawful: "명시적 동의(GDPR Art.6(1)(a))" },
    { key: "sms",       label: "SMS 수신",               required: false, version: "v1.2", updated: "2025-11-10", lawful: "명시적 동의" },
    { key: "profiling", label: "관심사 기반 추천 프로파일링", required: false, version: "v1.0", updated: "2026-02-01", lawful: "명시적 동의(GDPR Art.22)" },
  ],
  // ROPA — Record of Processing Activities (GDPR Art.30)
  ropa: [
    { id: "ROPA-01", purpose: "회원 식별·계정 운영",   lawful: "계약 이행",     items: "이름, 이메일, 비밀번호(해시)", retention: "탈퇴 후 즉시 파기", controller: "뱅기노자", processor: "AWS(서울)", transfer: "없음" },
    { id: "ROPA-02", purpose: "결제 및 주문 처리",     lawful: "계약 이행",     items: "주소, 전화번호, 카드토큰",     retention: "전자상거래법 5년",   controller: "뱅기노자", processor: "토스페이먼츠", transfer: "없음" },
    { id: "ROPA-03", purpose: "마케팅·뉴스레터",       lawful: "명시적 동의",   items: "이메일, 관심분야",             retention: "철회 시 즉시",       controller: "뱅기노자", processor: "Mailgun(US)", transfer: "미국(SCCs)" },
    { id: "ROPA-04", purpose: "사이트 분석·개선",      lawful: "정당한 이익",   items: "쿠키ID, 접속로그, UA",         retention: "13개월",             controller: "뱅기노자", processor: "Plausible(EU)", transfer: "EU(적정성)" },
    { id: "ROPA-05", purpose: "투어 참가자 관리",      lawful: "계약 이행",     items: "이름, 연락처, 참가일자",       retention: "행사 종료 후 6개월", controller: "뱅기노자", processor: "자체",         transfer: "없음" },
  ],
  cookies: [
    { name: "bgnj_session", cat: "필수",  purpose: "로그인 상태 유지",   ttl: "세션",   party: "1st" },
    { name: "bgnj_route",   cat: "필수",  purpose: "마지막 방문 경로",   ttl: "영구(로컬)", party: "1st" },
    { name: "_pl_visits",  cat: "분석",  purpose: "방문 통계(Plausible)", ttl: "24시간", party: "3rd" },
    { name: "_mkt_lead",   cat: "마케팅", purpose: "캠페인 효과 측정",   ttl: "90일",   party: "3rd" },
  ],
  breaches: [
    { id: "INC-2026-02", detectedAt: "2026-04-15T02:41:00Z", severity: "low",    affected: 0,   kind: "접근 시도 차단", notifyDueAt: "2026-04-18T02:41:00Z", authorityNotified: false, subjectNotified: false, status: "closed", note: "WAF에서 자동 차단. 유출 없음." },
    { id: "INC-2026-01", detectedAt: "2026-02-02T13:10:00Z", severity: "medium", affected: 42,  kind: "이메일 오발송",  notifyDueAt: "2026-02-05T13:10:00Z", authorityNotified: true,  subjectNotified: true,  status: "closed" },
  ],
  retentionPolicies: [
    { category: "계정 정보",       period: "탈퇴 후 즉시",            lawful: "PIPA §21" },
    { category: "전자상거래 기록", period: "5년",                     lawful: "전자상거래법 §6" },
    { category: "로그인 기록",     period: "3개월",                   lawful: "통신비밀보호법" },
    { category: "접속 IP",         period: "3개월",                   lawful: "PIPA §21" },
    { category: "결제 기록",       period: "5년",                     lawful: "전자금융거래법" },
    { category: "마케팅 동의",     period: "철회 시 즉시",            lawful: "정보통신망법 §50" },
  ],
  transfers: [
    { recipient: "Mailgun Technologies, Inc.",      country: "미국",  purpose: "이메일 발송",          basis: "GDPR SCCs, PIPA §28의8",  items: "이메일, 이름" },
    { recipient: "Amazon Web Services, Inc.",       country: "한국(서울)", purpose: "클라우드 인프라",   basis: "국내 처리",               items: "전 데이터" },
    { recipient: "Plausible Insights OÜ",           country: "에스토니아(EU)", purpose: "사이트 분석", basis: "GDPR 적정성 결정(EU 내부)", items: "쿠키ID, UA" },
  ],
  members: [
    { id: 8734, handle: "돌담아래", email: "stone@example.com",    joined: "2025-08-12", region: "KR", consents: ["terms","privacy","marketing"] },
    { id: 8735, handle: "역사애호", email: "h@example.com",        joined: "2025-09-02", region: "KR", consents: ["terms","privacy"] },
    { id: 8736, handle: "봄밤의자", email: "s@eu.example",         joined: "2025-10-21", region: "EU", consents: ["terms","privacy","profiling"] },
    { id: 8737, handle: "overseas_reader", email: "r@eu.example",  joined: "2025-12-04", region: "EU", consents: ["terms","privacy","marketing"] },
    { id: 8738, handle: "입문자",   email: "b@example.com",        joined: "2026-01-15", region: "KR", consents: ["terms","privacy"] },
  ],
};

const DSR_LABELS = {
  access:      { ko: "열람 요청",     gdpr: "Art.15", pipa: "§35" },
  rectify:     { ko: "정정·수정",     gdpr: "Art.16", pipa: "§36" },
  erasure:     { ko: "삭제(잊혀질 권리)", gdpr: "Art.17", pipa: "§36②" },
  restrict:    { ko: "처리 제한",     gdpr: "Art.18", pipa: "§37" },
  portability: { ko: "데이터 이동",   gdpr: "Art.20", pipa: "—" },
  object:      { ko: "처리 거부",     gdpr: "Art.21", pipa: "§37" },
};


// === v00.070 trampoline =================================================
// ADMIN_VERSION_HISTORY / ADMIN_DESIGN_SECTIONS / MISSION_OVERVIEW / FEATURE_DOMAINS / DesignSystemView
// 는 pages/admin/AdminDesignHub.jsx 로 분할(이 파일이 8000 줄을 넘어 large_file lint 위반 → 분할).
// 인덱스에서 AdminDesignHub.jsx 가 본 파일보다 먼저 로드되므로 window 에서 안전하게 가져올 수 있다.

// === v00.078 trampoline ================================================
// 콘텐츠 편집 패널 묶음(~1300 줄)을 pages/admin/AdminContentEditors.jsx 로 분할.
// AdminContentEditors.jsx 가 본 파일보다 먼저 로드 → window 에서 받아 사용.


// === Report Queue Panel ===========================================
// v00.131 — 커뮤니티 게시글 본문 손상 점검. v00.129 이하에서 작성된 글은 D1 에 "[object Object]"
// 로 저장됐을 수 있음 (v00.130 hotfix 이전). 본 도구가 그 row 들을 찾아 작성자에게 알려줌 +
// 본문 직접 수정 빠른 진입.
const CorruptedBodyInspector = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const G = window.BGNJ_GUARD;
  React.useEffect(() => {
    window.BGNJ_COMMUNITY?.refreshPosts?.().finally(() => setTick((v) => v + 1));
  }, []);
  const posts = G.arr(() => window.BGNJ_COMMUNITY?.listPosts?.());
  const corrupted = posts.filter((p) => {
    const html = p?.body?.html || '';
    const text = p?.body?.text || '';
    // v00.130 _normalizePostBody 가 손상 row 를 경고 텍스트로 wrap. 'v00.129 이하 작성' 패턴 매칭.
    return /v00\.129 이하/.test(html) || /v00\.129 이하/.test(text) || html === '[object Object]' || text === '[object Object]';
  });
  return (
    <div className="card" style={{padding:18, marginBottom:18, border:'1px dashed var(--primary-dim)'}}>
      <h4 className="ko-serif" style={{fontSize:15, margin:'0 0 10px'}}>🔍 커뮤니티 본문 손상 점검 (v00.130 hotfix)</h4>
      <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:12}}>
        v00.129 이하에서 작성된 글은 D1 에 본문이 <code>[object Object]</code> 로 저장돼 화면에 경고 텍스트가 표시될 수 있습니다.
        해당 글을 클릭해 작성자가 다시 저장하면 정상 본문으로 복구됩니다.
      </p>
      {corrupted.length === 0 ? (
        <div className="gold mono" style={{fontSize:12}}>✅ 손상 글 0건 — 모두 정상.</div>
      ) : (
        <>
          <div style={{marginBottom:10, fontSize:13}}>
            ⚠ 손상 의심 글 <strong style={{color:'var(--danger)'}}>{corrupted.length}</strong>건 발견
          </div>
          <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
            {corrupted.slice(0, 30).map((p) => (
              <li key={p.id} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 10px', border:'1px solid var(--line)', fontSize:12}}>
                <span className="pill" style={{fontSize:10}}>{p.category || '?'}</span>
                <span style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.title || '(제목 없음)'}</span>
                <span className="dim-2 mono" style={{fontSize:10}}>{p.author || '?'} · {p.date || ''}</span>
                <button type="button" className="btn btn-small" onClick={() => {
                  try { sessionStorage.setItem('bgnj_pending_post_id', String(p.id)); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (AdminRouterPanels.jsx:129)', _e); }
                  go('community');
                }}>열기</button>
              </li>
            ))}
            {corrupted.length > 30 && (
              <li className="dim-2 mono" style={{fontSize:11, textAlign:'right'}}>외 {corrupted.length - 30}건</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

const ReportQueuePanel = ({ onRefresh, go }) => {
  const [filter, setFilter] = React.useState("open");
  const [tick, setTick] = React.useState(0);
  const [viewingPostId, setViewingPostId] = React.useState(null);
  const reports = React.useMemo(() => window.BGNJ_COMMUNITY.listReports(filter), [filter, tick]);
  const counts = React.useMemo(() => ({
    open: window.BGNJ_COMMUNITY.listReports('open').length,
    resolved: window.BGNJ_COMMUNITY.listReports('resolved').length,
    dismissed: window.BGNJ_COMMUNITY.listReports('dismissed').length,
    all: window.BGNJ_COMMUNITY.listReports('all').length,
  }), [tick]);

  const setStatus = (id, status) => {
    window.BGNJ_COMMUNITY.updateReportStatus(id, status);
    setTick((v) => v + 1);
  };

  const removePostFromReport = async (report) => {
    if (!report.postId) return;
    if (!(await window.BGNJ_CONFIRM(`"${report.postTitle}" 게시글을 삭제하고 신고를 처리 완료로 표시하시겠어요?`, { danger: true }))) return;
    window.BGNJ_COMMUNITY.deletePost(report.postId);
    window.BGNJ_COMMUNITY.updateReportStatus(report.id, 'resolved');
    setTick((v) => v + 1);
    onRefresh?.();
  };

  return (
    <div>
      <div style={{display:'flex', gap:8, marginBottom:20, flexWrap:'wrap'}}>
        {[
          { key: 'open', label: '미처리' },
          { key: 'resolved', label: '처리 완료' },
          { key: 'dismissed', label: '반려' },
          { key: 'all', label: '전체' },
        ].map((f) => (
          <button key={f.key} type="button" className="btn btn-small"
            onClick={() => setFilter(f.key)}
            style={{
              borderColor: filter === f.key ? 'var(--primary)' : 'var(--line)',
              color: filter === f.key ? 'var(--primary)' : 'var(--ink-2)',
              background: filter === f.key ? 'rgba(245,213,72,0.06)' : 'transparent',
            }}>
            {f.label} <span className="mono dim-2" style={{ fontSize: 10, marginLeft: 4 }}>{counts[f.key] ?? 0}</span>
          </button>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>
          해당 상태의 신고가 없습니다.
        </div>
      ) : (
        <div style={{display:'grid', gap:12}}>
          {reports.map((r) => {
            const tone = r.status === 'open'
              ? 'var(--danger)'
              : r.status === 'resolved'
                ? 'var(--primary)'
                : 'var(--ink-3)';
            const statusLabel = r.status === 'open' ? '미처리' : r.status === 'resolved' ? '처리 완료' : '반려';
            return (
              <article key={r.id} className="card" style={{padding:18}}>
                <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                  <div className="ko-serif" style={{fontSize:16}}>{r.postTitle}</div>
                  <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: tone}}>{statusLabel.toUpperCase()}</span>
                </div>
                <div style={{display:'grid', gap:6, marginBottom:12}}>
                  <div style={{fontSize:13, lineHeight:1.7}}>
                    <span className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.2em', marginRight:8}}>사유</span>
                    {r.reason}
                  </div>
                  <div className="dim-2 mono" style={{fontSize:11}}>
                    신고자 {r.reporterName} · {window.BGNJ_FMT.kstDateTime(r.createdAt)}
                  </div>
                </div>
                <div style={{display:'flex', gap:8, justifyContent:'flex-end', flexWrap:'wrap'}}>
                  {r.postId && (
                    <button type="button" className="btn btn-small"
                      onClick={() => setViewingPostId(r.postId)}>게시글 열기</button>
                  )}
                  {r.status !== 'resolved' && (
                    <button type="button" className="btn btn-small" onClick={() => setStatus(r.id, 'resolved')}>처리 완료</button>
                  )}
                  {r.status !== 'dismissed' && (
                    <button type="button" className="btn btn-small" onClick={() => setStatus(r.id, 'dismissed')}>반려</button>
                  )}
                  {r.status === 'open' && r.postId && (
                    <button type="button" className="btn btn-small"
                      onClick={() => removePostFromReport(r)}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>게시글 삭제 + 처리</button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      {viewingPostId && (
        <PostViewerModal postId={viewingPostId} onClose={() => setViewingPostId(null)}/>
      )}
    </div>
  );
};

// === Admin UI primitives (v00.142) ================================
// 사용자 요청 '관리자페이지의 모든 GUI를 통일성 있게'.
// 모든 panel 에서 재사용. 기존 인라인 style 들을 점진 교체.

// v00.285 — Admin UI primitives 는 AdminShared.jsx 로 이동. const alias 로 받아 기존 참조 유지.
import { AdminPanelHeader } from './AdminShared.jsx';
import { AdminEmpty } from './AdminShared.jsx';
import { AdminFilterChips } from './AdminShared.jsx';

// === Dashboard helpers (v00.146) ==================================
// 일/주/월 활동 metrics + 가입 추이 + 활동 차트.
// data source: BGNJ_AUTH.listUsers().created_at + BGNJ_COMMUNITY.listPosts().date + comments.
// v00.285 — HoverDetailsPopover / StatTile / MetricCard 는 AdminShared.jsx 로 이동. const alias.

// 간단한 SVG 막대 차트 — series: number[], labels: string[].
// v00.187 — MiniBarChart / RankedBarList / COHORT_OPTIONS / CohortSelector 모두 AdminShared.jsx 로 이동.
// 외부 module-scope 정의를 const alias 로 가져와 closure 내부 사용 패턴 유지.


// DashboardPanel · UserJourneyPanel 은 admin/AdminDashboardPanel.jsx 로 분리 (v00.285).


// BulkLectureImport · LectureAdminPanel · TourAdminPanel 은 admin/AdminEventsPanels.jsx 로 분리 (v00.285).


// BankAccountPanel · BookOrderAdminPanel (+BGNJ_BankAccountPicker) 은 admin/AdminCommercePanels.jsx 로 분리 (v00.285).


// LegalAdminPanel · FaqAdminPanel 은 admin/AdminPolicyPanels.jsx 로 분리 (v00.285).


// SiteContentAdminPanel · OgPreviewBlock 은 admin/AdminSiteContentPanel.jsx 로 분리 (v00.285).


// BooksAdminPanel 은 admin/AdminBooksPanel.jsx 로 분리 (v00.285).

// === Error Pages Preview Panel ====================================
// v00.145 — 사용자 요청 '관리자 페이지에서 오류 페이지들 미리보기'.
// 6 종 오류 페이지 (404 / 500 / 403 / 401 / Network / Maintenance) 를 chip 으로 선택해 inline 렌더.
const ErrorPagesPreviewPanel = ({ go }) => {
  const [active, setActive] = React.useState('404');
  // v00.149 — window.Error*Page 는 ErrorPages.js 가 로드된 후에만 존재.
  // tick 으로 강제 재평가 + 100ms 마다 5회 재시도 (스크립트 로드 race 대비).
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    let count = 0;
    const id = setInterval(() => {
      if (window.Error404Page || count >= 5) {
        setTick((v) => v + 1);
        clearInterval(id);
      }
      count++;
    }, 100);
    return () => clearInterval(id);
  }, []);

  const variants = React.useMemo(() => [
    { k: '404',         l: '404 페이지 없음',  Comp: window.Error404Page },
    { k: '500',         l: '500 서버 오류',    Comp: window.Error500Page },
    { k: '403',         l: '403 권한 부족',    Comp: window.Error403Page },
    { k: '401',         l: '401 로그인 필요',  Comp: window.Error401Page },
    { k: 'network',     l: '네트워크 오류',    Comp: window.ErrorNetworkPage },
    { k: 'maintenance', l: '점검 중',          Comp: window.ErrorMaintenancePage },
  ], [tick]);
  const current = variants.find((v) => v.k === active) || variants[0];
  const Preview = current.Comp;
  // 미리보기 안에서 go 가 호출되면 실제로 라우팅하면 곤란하니 noop 으로 가로채기.
  const previewGo = (route) => { try { console.warn('[preview] go(', route, ') — 미리보기에서는 실제 이동 안 함'); } catch (_e) { console.warn('[bgnj] AdminRouterPanels.jsx:315 오류(무시하고 진행)', _e); } };
  return (
    <div>
      <AdminPanelHeader
        eyebrow="ERROR PAGES · 미리보기"
        title="오류 페이지 미리보기"
        description="404 / 500 / 403 / 401 / 네트워크 / 점검 중 6종을 카드로 미리 봅니다. 일러스트는 assets/errors/ 에 위치 — 파일 누락 시 ✈️ 이모지 폴백."/>
      <div className="admin-toolbar">
        <AdminFilterChips
          ariaLabel="오류 페이지 종류"
          items={variants.map((v) => ({ key: v.k, label: v.l }))}
          value={active} onChange={setActive}/>
      </div>
      <div style={{
        border:'1px solid var(--line)', borderRadius:8, overflow:'hidden',
        background:'var(--bg-2)', padding:24, display:'grid', placeItems:'center',
      }}>
        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:14, alignSelf:'flex-start'}}>
          PREVIEW · {current.l}
        </div>
        {Preview ? (
          // v00.149 — embedded prop 으로 full-viewport wrapper 비활성 (preview 컨테이너에 fit).
          <Preview go={previewGo} embedded/>
        ) : (
          <AdminEmpty>
            오류 페이지 컴포넌트 ({current.k}) 가 아직 로드되지 않았습니다.
            ErrorPages.js 가 캐시에 잡혔는지 확인 후 hard reload (Cmd+Shift+R) 해 주세요.
          </AdminEmpty>
        )}
      </div>
      <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.7}}>
        ⓘ 미리보기 안의 버튼은 실제 라우팅하지 않습니다 (콘솔에 로그만 출력).
        라이브 페이지에서는 정상 동작합니다.
      </p>
    </div>
  );
};

// ErrorLogPanel · SEOAdminPanel · SearchConsoleAdminPanel 은 admin/AdminMonitorPanels.jsx 로 분리 (v00.285).

// AuditDetailsCell · AuditLogPanel · ActivityLogPanel 은 admin/AdminLogPanels.jsx 로 분리 (v00.285).

// 게시글 뷰어 모달 — 관리자 패널에서 페이지 이동 없이 본문/메타/댓글을 한눈에.
const PostViewerModal = ({ postId, onClose }) => {
  const [post, setPost] = React.useState(() => window.BGNJ_COMMUNITY?.getPost?.(postId) || null);
  const [comments, setComments] = React.useState(() => window.BGNJ_COMMUNITY?.getComments?.(postId) || []);
  // v00.077 — useModalGuard 통일 (ESC + body lock + popstate). 읽기 전용 → dirty=false.
  window.useModalGuard?.({ open: true, dirty: false, onClose, onSaveDraft: null, label: '게시글 보기' });
  React.useEffect(() => {
    // 서버 게시글이면 댓글 동기화 시도.
    try { window.BGNJ_COMMUNITY?.refreshComments?.(postId).then(() => {
      setComments(window.BGNJ_COMMUNITY.getComments(postId));
    }); } catch (_e) { console.warn('[bgnj] AdminRouterPanels.jsx:367 오류(무시하고 진행)', _e); }
  }, [postId]);

  if (!post) {
    return (
      <div role="dialog" aria-modal="true" onClick={onClose}
        style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'grid', placeItems:'center', padding:24}}>
        <div onClick={(e) => e.stopPropagation()}
          style={{background:'var(--bg)', maxWidth:520, width:'100%', padding:28, border:'1px solid var(--line)'}}>
          <div className="dim" style={{fontSize:14, marginBottom:16}}>해당 게시글을 찾을 수 없습니다.</div>
          <div style={{textAlign:'right'}}><button type="button" className="btn" onClick={onClose}>닫기</button></div>
        </div>
      </div>
    );
  }

  const likes = Array.isArray(post.likes) ? post.likes.length : 0;
  const tagList = post.tags || [];

  return (
    <div role="dialog" aria-modal="true" aria-label={post.title}
      onClick={onClose}
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'grid', placeItems:'center', padding:24}}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background:'var(--bg)', width:'100%', maxWidth:860, maxHeight:'88vh',
          overflow:'auto', padding:'28px 32px', border:'1px solid var(--line)',
          boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
        }}>
        {/* 상단 메타 */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, marginBottom:14}}>
          <div className="mono dim-2" style={{fontSize:11, letterSpacing:'0.18em'}}>
            POST · #{String(post.id).padStart(4, '0')}
          </div>
          <button type="button" className="btn btn-small" onClick={onClose} aria-label="닫기">닫기</button>
        </div>

        {/* 제목 + 배지 */}
        <div style={{display:'flex', gap:10, marginBottom:14, flexWrap:'wrap'}}>
          <span className="badge badge-gold">{post.category}</span>
          {post.prefix && <span className="badge">{post.prefix}</span>}
          {post.hot && <span className="badge">HOT</span>}
        </div>
        <h2 className="ko-serif" style={{fontSize:26, lineHeight:1.3, marginBottom:14}}>{post.title}</h2>

        {tagList.length > 0 && (
          <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:14}}>
            {tagList.map((t) => <span key={t} className="tag-chip">#{t}</span>)}
          </div>
        )}

        {/* 작성자/일시/조회/공감/댓글 */}
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12,
          padding:'12px 14px', background:'var(--bg-2)', border:'1px solid var(--line)',
          marginBottom:18, fontSize:12,
        }}>
          {[
            ['작성자', post.author || '-'],
            ['작성일', post.date || (post.createdAt ? window.BGNJ_FMT.kstDateTime(post.createdAt) : '-')],
            ['조회', post.views ?? 0],
            ['공감', likes],
            ['댓글', comments.length],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em', marginBottom:4}}>{label}</div>
              <div style={{fontSize:13}}>{value}</div>
            </div>
          ))}
        </div>

        {/* 본문 */}
        <div className="post-body" style={{
          padding:'18px 4px', borderTop:'1px solid var(--line)',
          fontFamily:'var(--font-reading)', fontSize:15, lineHeight:1.85, color:'var(--ink)',
        }}>
          {post.body?.html ? (
            <div dangerouslySetInnerHTML={{__html: window.BGNJ_SAFE_HTML(post.body.html)}}/>
          ) : post.body?.text ? (
            <div style={{whiteSpace:'pre-wrap'}}>{post.body.text}</div>
          ) : (
            <div className="dim-2" style={{fontStyle:'italic'}}>(본문 없음)</div>
          )}
        </div>

        {/* 첨부 이미지 */}
        {Array.isArray(post.images) && post.images.length > 0 && (
          <div style={{marginTop:18}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:10}}>ATTACHMENTS · {post.images.length}</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))', gap:10}}>
              {post.images.map((src, i) => (
                <a key={i} href={src} target="_blank" rel="noreferrer"
                  style={{border:'1px solid var(--line)', display:'block'}}>
                  <img src={src} alt="" style={{display:'block', width:'100%', height:120, objectFit:'cover'}}/>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 댓글 */}
        <div style={{marginTop:24, paddingTop:18, borderTop:'1px solid var(--line)'}}>
          <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:10}}>COMMENTS · {comments.length}</div>
          {comments.length === 0 ? (
            <div className="dim-2" style={{fontSize:13}}>아직 댓글이 없습니다.</div>
          ) : (
            <ul style={{listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:10}}>
              {comments.map((c) => (
                <li key={c.id} style={{padding:'10px 12px', background:'var(--bg-2)', border:'1px solid var(--line)', fontSize:13}}>
                  <div style={{display:'flex', justifyContent:'space-between', gap:10, marginBottom:4}}>
                    <span className="gold mono" style={{fontSize:11, letterSpacing:'0.1em'}}>
                      {c.parentId ? '↳ ' : ''}{c.author || '-'}
                    </span>
                    <span className="mono dim-2" style={{fontSize:10}}>{c.date || (c.createdAt ? window.BGNJ_FMT.kstDateTime(c.createdAt) : '')}</span>
                  </div>
                  <div style={{lineHeight:1.7, whiteSpace:'pre-wrap'}}>{c.text || c.body || '-'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// === Internal Alarm Panel (v00.183) ================================
// 사용자 보고 '내부 인원들에게 알람을 보낼 수 있는 기능'.
// v00.191 — 그룹 선택 재설계 (사용자 보고 '특정 사용자 개인보다 그룹이 합리적').
// scope: 'all_admins' | 'all_members' | 'all_non_admins' | 'grade'.
const InternalAlarmPanel = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [scope, setScope] = React.useState('all_admins');
  const [selectedGrade, setSelectedGrade] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [resultMsg, setResultMsg] = React.useState('');
  const [excludeSelf, setExcludeSelf] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await window.BGNJ_API?.admin?.users?.list?.();
        if (cancelled) return;
        setUsers(Array.isArray(data?.users) ? data.users : []);
      } catch (_e) { console.warn('[bgnj] AdminRouterPanels.jsx:515 오류(무시하고 진행)', _e); } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const admins = users.filter((u) => u.isAdmin || u.is_admin);
  // v00.191 — 등급별 회원 카운트 (그룹 선택 시 미리보기).
  const grades = (window.BGNJ_STORES?.grades || []).slice().sort((a, b) => (a.level || 0) - (b.level || 0));
  const gradeCounts = React.useMemo(() => {
    const counts = {};
    users.forEach((u) => {
      const gid = u.gradeId || u.grade_id || 'member';
      counts[gid] = (counts[gid] || 0) + 1;
    });
    return counts;
  }, [users]);
  const totalMembers = users.length;
  const totalNonAdmins = users.filter((u) => !(u.isAdmin || u.is_admin)).length;

  const send = async () => {
    if (!message.trim()) { setResultMsg('✗ 메시지를 입력해 주세요.'); return; }
    if (scope === 'select' && selectedIds.size === 0) { setResultMsg('✗ 수신자를 선택해 주세요.'); return; }
    const __confirmMsg = scope === 'all_admins'
      ? `모든 관리자(${admins.length}명${excludeSelf ? ' - 본인 제외' : ''})에게 알람을 보내시겠어요?`
      : `선택한 ${selectedIds.size}명에게 알람을 보내시겠어요?`;
    if (!(await window.BGNJ_CONFIRM(__confirmMsg, { danger: true }))) return;
    setSending(true); setResultMsg('');
    try {
      // v00.191 — 그룹 기반 recipients. scope: 'all_admins' / 'all_members' / 'all_non_admins' / 'grade'.
      let recipients;
      if (scope === 'grade' && selectedGrade) {
        recipients = { grade: selectedGrade };
      } else if (scope === 'all_admins' || scope === 'all_members' || scope === 'all_non_admins') {
        recipients = scope;
      } else {
        recipients = 'all_admins'; // 기본
      }
      const res = await window.BGNJ_API?.internalAlarm?.send?.({
        recipients, title: title.trim(), message: message.trim(), excludeSelf,
      });
      setResultMsg(`✓ ${res?.group ? res.group + ' — ' : ''}${res?.sent ?? 0}명에게 알람이 발송되었습니다.`);
      setTitle(''); setMessage('');
      setTimeout(() => setResultMsg(''), 4000);
    } catch (err) {
      setResultMsg('✗ 발송 실패: ' + (err?.message || '알 수 없는 오류'));
    } finally { setSending(false); }
  };

  // v00.191 — scope 별 미리보기 카운트 (전송 전 명확히).
  const scopeCount = (() => {
    if (scope === 'all_admins') return admins.length - (excludeSelf ? 1 : 0);
    if (scope === 'all_members') return totalMembers - (excludeSelf ? 1 : 0);
    if (scope === 'all_non_admins') return totalNonAdmins;
    if (scope === 'grade' && selectedGrade) return gradeCounts[selectedGrade] || 0;
    return 0;
  })();

  return (
    <div>
      <AdminPanelHeader
        eyebrow="ALARM · 내부 알람"
        title="내부 인원 알람 보내기"
        description="그룹 단위로 알람을 broadcast — 전체 관리자 / 전체 회원 / 일반 회원 / 특정 등급 중 선택. 수신자의 🔔 에 즉시 표시. D1 notifications 저장 (server-first)."/>

      <article className="admin-form-card" style={{padding:18, marginBottom:18}}>
        <div className="admin-form-card__eyebrow">📣 알람 작성</div>

        {/* v00.191 — 수신 그룹 (4가지 그룹 + 본인 제외) */}
        <fieldset style={{border:'1px solid var(--line)', padding:'12px 14px', marginBottom:14}}>
          <legend className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', padding:'0 6px'}}>수신 그룹</legend>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:8}}>
            {[
              { key: 'all_admins',     label: '전체 관리자',  count: admins.length,        desc: 'is_admin=1 모든 회원' },
              { key: 'all_members',    label: '전체 회원',    count: totalMembers,         desc: 'admin 포함 모든 회원' },
              { key: 'all_non_admins', label: '일반 회원만',  count: totalNonAdmins,       desc: 'admin 제외 일반 회원' },
              { key: 'grade',          label: '특정 등급',    count: scope === 'grade' && selectedGrade ? (gradeCounts[selectedGrade] || 0) : '—', desc: '아래 등급 select' },
            ].map((opt) => {
              const active = scope === opt.key;
              return (
                <label key={opt.key} style={{
                  display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer',
                  padding:'10px 12px',
                  border: `1px solid ${active ? 'var(--primary)' : 'var(--line-2)'}`,
                  background: active ? 'rgba(245,213,72,0.06)' : 'transparent',
                  transition:'border-color .12s, background .12s',
                }}>
                  <input type="radio" name="alarm-scope" checked={active}
                    onChange={() => setScope(opt.key)}
                    style={{marginTop:2}}/>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:13, fontWeight:600, color:'var(--ink)', display:'flex', justifyContent:'space-between', gap:8}}>
                      <span>{opt.label}</span>
                      <span className="mono gold" style={{fontSize:11, fontWeight:700}}>{opt.count}{typeof opt.count === 'number' ? '명' : ''}</span>
                    </div>
                    <div className="dim-2" style={{fontSize:11, marginTop:2, lineHeight:1.4}}>{opt.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
          {scope === 'grade' && (
            <div style={{marginTop:12, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
              <label htmlFor="alarm-grade" className="mono dim-2" style={{fontSize:11, letterSpacing:'0.1em'}}>등급 선택</label>
              <select id="alarm-grade" className="field-input"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                style={{maxWidth:280, padding:'6px 10px'}}>
                <option value="">— 등급 선택 —</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    Lv {g.level} · {g.label} ({gradeCounts[g.id] || 0}명)
                  </option>
                ))}
              </select>
              {selectedGrade && (
                <span className="mono" style={{fontSize:11, color:'var(--secondary)', fontWeight:700}}>
                  → {gradeCounts[selectedGrade] || 0}명 발송 예정
                </span>
              )}
            </div>
          )}
          <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer', marginTop:14, fontSize:12}}>
            <input type="checkbox" checked={excludeSelf} onChange={(e) => setExcludeSelf(e.target.checked)}/>
            <span>본인은 수신자에서 제외</span>
          </label>
        </fieldset>

        {/* 제목 + 메시지 */}
        <div className="field" style={{marginBottom:12}}>
          <label className="field-label" htmlFor="alarm-title">제목 (선택)</label>
          <input id="alarm-title" className="field-input" value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 환불 처리 요청 / 긴급 점검 안내"/>
        </div>
        <div className="field" style={{marginBottom:14}}>
          <label className="field-label" htmlFor="alarm-message">메시지 <span className="gold">*</span></label>
          <textarea id="alarm-message" className="field-input" rows={5} value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="알림 내용을 입력하세요."
            style={{fontFamily:'inherit', resize:'vertical', lineHeight:1.6}}/>
        </div>

        <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
          <button type="button" className="btn btn-gold" onClick={send}
            disabled={sending || !message.trim() || (scope === 'grade' && !selectedGrade) || scopeCount === 0}>
            {sending ? '발송 중…' : `📣 발송 (${scopeCount}명 예정)`}
          </button>
          <button type="button" className="btn btn-small" onClick={() => { setTitle(''); setMessage(''); setSelectedGrade(''); setResultMsg(''); }}>
            초기화
          </button>
          {resultMsg && (
            <span className="mono" style={{fontSize:12, fontWeight:700,
              color: resultMsg.startsWith('✗') ? 'var(--danger)' : 'var(--secondary)'}}>{resultMsg}</span>
          )}
        </div>
      </article>

      <p className="dim-2" style={{fontSize:11, lineHeight:1.7}}>
        ⓘ 알람은 D1 <code style={{padding:'1px 5px', background:'var(--bg-2)', border:'1px solid var(--line-2)'}}>notifications</code> 테이블에 type=<code style={{padding:'1px 5px', background:'var(--bg-2)', border:'1px solid var(--line-2)'}}>internal_alarm</code> 으로 저장됩니다.
        수신자는 헤더의 알림 종(🔔) 에서 즉시 확인할 수 있습니다.
      </p>
    </div>
  );
};

// === Community Posts Admin Panel (v00.180 추출) =====================
// 사용자 코드 리뷰 룰 1번 (DRY): 인라인 JSX 였던 게시글 관리 부분을 별도 컴포넌트로.
// 자체 state(검색/필터/선택/일괄/모달) + 핸들러(export/delete/bulk) 모두 내장.
// 부모(AdminPage) 는 posts (allCommunityPosts) + onChange (refresh trigger) 만 전달.
// v00.264.003 — admin 게시글 패널 페이지당 갯수 선택. 홈과 동일 옵션. localStorage 보존.
const ADMIN_POSTS_PER_PAGE_OPTIONS = [10, 30, 50, 100];
const ADMIN_POSTS_PER_PAGE_LS_KEY = 'bgnj_admin_posts_per_page';
const ADMIN_POSTS_PER_PAGE_DEFAULT = 30;

const CommunityPostsAdminPanel = ({ posts, onChange }) => {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [selectedIds, setSelectedIds] = React.useState(new Set());
  const [viewingId, setViewingId] = React.useState(null);
  const [bulkCat, setBulkCat] = React.useState('');
  const [bulkPrefix, setBulkPrefix] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSizeState] = React.useState(() => {
    try {
      const v = Number(localStorage.getItem(ADMIN_POSTS_PER_PAGE_LS_KEY));
      return ADMIN_POSTS_PER_PAGE_OPTIONS.includes(v) ? v : ADMIN_POSTS_PER_PAGE_DEFAULT;
    } catch { return ADMIN_POSTS_PER_PAGE_DEFAULT; }
  });
  const setPageSize = (n) => {
    setPageSizeState(n);
    try { localStorage.setItem(ADMIN_POSTS_PER_PAGE_LS_KEY, String(n)); } catch (_e) { console.warn('[bgnj] AdminRouterPanels.jsx:705 오류(무시하고 진행)', _e); }
    setPage(1);
  };

  const visible = React.useMemo(() => posts.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || String(p.author || '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || p.categoryId === filter;
    return matchSearch && matchFilter;
  }), [posts, search, filter]);

  // 검색/필터 변경 시 page 리셋.
  React.useEffect(() => { setPage(1); }, [search, filter]);

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pagePosts = visible.slice(pageStart, pageStart + pageSize);

  const exportCsv = () => {
    downloadCsv(`community-posts-${new Date().toISOString().slice(0, 10)}.csv`, window.BGNJ_COMMUNITY.exportCsv());
  };

  const removeOne = async (post) => {
    if (!(await window.BGNJ_CONFIRM(`"${post.title}" 게시글을 삭제하시겠어요?`, { danger: true }))) return;
    window.BGNJ_COMMUNITY.deletePost(post.id);
    setSelectedIds((prev) => { const next = new Set(prev); next.delete(post.id); return next; });
    onChange?.();
  };

  const bulkRemove = async () => {
    if (selectedIds.size === 0) return;
    if (!(await window.BGNJ_CONFIRM(`선택한 ${selectedIds.size}개 게시글을 삭제할까요?`, { danger: true }))) return;
    selectedIds.forEach((id) => window.BGNJ_COMMUNITY.deletePost(id));
    setSelectedIds(new Set());
    onChange?.();
  };

  const bulkMove = () => {
    if (selectedIds.size === 0) return;
    if (!bulkCat) { window.BGNJ_TOAST.error('이동할 게시판을 선택하세요.'); return; }
    const cat = window.BGNJ_STORES.categories.find((c) => c.id === bulkCat);
    if (!cat) return;
    selectedIds.forEach((id) => window.BGNJ_COMMUNITY.updatePost(id, { categoryId: cat.id, category: cat.label }));
    setSelectedIds(new Set());
    setBulkCat('');
    onChange?.();
  };

  const bulkApplyPrefix = () => {
    if (selectedIds.size === 0) return;
    const next = bulkPrefix.trim();
    selectedIds.forEach((id) => window.BGNJ_COMMUNITY.updatePost(id, { prefix: next || null }));
    setSelectedIds(new Set());
    setBulkPrefix('');
    onChange?.();
  };

  return (
    <div>
      {/* 게시판 칩 (검색 위) */}
      <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:12}} role="tablist" aria-label="게시판 필터">
        {[{ id: 'all', label: '전체', count: posts.length }]
          .concat(window.BGNJ_STORES.categories
            .filter((item) => item.boardType === 'community')
            .map((c) => ({ id: c.id, label: c.label, count: posts.filter((p) => p.categoryId === c.id).length })))
          .map((chip) => {
            const active = filter === chip.id;
            return (
              <button key={chip.id} type="button" role="tab" aria-selected={active}
                onClick={() => { setFilter(chip.id); setSelectedIds(new Set()); }}
                style={{
                  padding: '6px 14px', fontSize: 12,
                  fontFamily: 'var(--font-serif)',
                  background: active ? 'var(--primary)' : 'transparent',
                  color: active ? 'var(--bg)' : 'var(--ink-2)',
                  border: `1px solid ${active ? 'var(--primary)' : 'var(--line-2)'}`,
                  borderRadius: 999,
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                <span>{chip.label}</span>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '0.05em', opacity: active ? 0.85 : 0.55 }}>{chip.count}</span>
              </button>
            );
          })}
      </div>
      <div style={{display:'flex', gap:12, marginBottom:16, alignItems:'center', flexWrap:'wrap'}}>
        <label htmlFor="post-search" className="sr-only">게시글 검색</label>
        <input id="post-search" className="field-input" placeholder="제목 또는 작성자 검색..." style={{flex:1, minWidth:200}}
          value={search} onChange={(e) => setSearch(e.target.value)}/>
        <label htmlFor="admin-post-per-page" className="sr-only">한 페이지 게시글 수</label>
        <select id="admin-post-per-page" className="field-input"
          value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
          style={{padding:'10px 12px', fontSize:12, cursor:'pointer'}}
          title="한 페이지에 표시할 게시글 갯수">
          {ADMIN_POSTS_PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}개</option>
          ))}
        </select>
        <button type="button" className="btn btn-small" onClick={exportCsv}>CSV 다운로드</button>
      </div>

      {/* 일괄 작업 바 */}
      {selectedIds.size > 0 && (
        <div style={{display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'rgba(59,130,246,0.07)', border:'1px solid var(--primary-dim)', marginBottom:12, flexWrap:'wrap'}}>
          <span className="mono gold" style={{fontSize:11}}>{selectedIds.size}개 선택됨</span>
          <button type="button" className="btn btn-small" style={{borderColor:'var(--danger)', color:'var(--danger)'}} onClick={bulkRemove}>선택 삭제</button>
          <span aria-hidden="true" style={{width:1, alignSelf:'stretch', background:'var(--line)'}}/>
          <select className="field-input" style={{maxWidth:160, padding:'4px 8px'}} value={bulkCat} onChange={(e) => setBulkCat(e.target.value)}>
            <option value="">게시판 선택...</option>
            {window.BGNJ_STORES.categories.filter((c) => c.boardType === 'community').map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <button type="button" className="btn btn-small btn-gold" onClick={bulkMove}>이동</button>
          <span aria-hidden="true" style={{width:1, alignSelf:'stretch', background:'var(--line)'}}/>
          <input type="text" className="field-input" style={{maxWidth:140, padding:'4px 8px'}} placeholder="말머리 (비우면 제거)" value={bulkPrefix} onChange={(e) => setBulkPrefix(e.target.value)} aria-label="일괄 적용할 말머리"/>
          <button type="button" className="btn btn-small btn-gold" onClick={bulkApplyPrefix}>말머리 적용</button>
          <button type="button" className="btn btn-small" style={{marginLeft:'auto'}} onClick={() => setSelectedIds(new Set())}>선택 해제</button>
        </div>
      )}

      <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
        <thead>
          <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
            <th scope="col" style={{padding:'12px 8px', textAlign:'center', width:36}}>
              <input type="checkbox"
                checked={pagePosts.length > 0 && pagePosts.every((p) => selectedIds.has(p.id))}
                onChange={(e) => {
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    if (e.target.checked) pagePosts.forEach((p) => next.add(p.id));
                    else pagePosts.forEach((p) => next.delete(p.id));
                    return next;
                  });
                }}
                aria-label="현재 페이지 전체 선택"/>
            </th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>ID</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>분류</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>말머리</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>제목</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>작성자</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>날짜</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
          </tr>
        </thead>
        <tbody>
          {pagePosts.map((p) => (
            <tr key={p.id} style={{borderBottom:'1px solid var(--line)', background: selectedIds.has(p.id) ? 'rgba(245,213,72,0.04)' : undefined}}>
              <td style={{padding:'14px 8px', textAlign:'center'}}>
                <input type="checkbox" checked={selectedIds.has(p.id)}
                  onChange={(e) => {
                    setSelectedIds((prev) => {
                      const next = new Set(prev);
                      if (e.target.checked) next.add(p.id); else next.delete(p.id);
                      return next;
                    });
                  }}
                  aria-label={`"${p.title}" 선택`}/>
              </td>
              <td className="mono dim-2" style={{padding:14}}>#{String(p.id).padStart(4,'0')}</td>
              <td style={{padding:14}}><span className="badge" style={{fontSize:9}}>{p.category}</span></td>
              <td style={{padding:14}}>
                {p.prefix ? <span className="mono" style={{fontSize:9, padding:'1px 6px', border:'1px solid var(--primary-dim)', color:'var(--secondary)'}}>{p.prefix}</span> : <span className="dim-2" style={{fontSize:10}}>—</span>}
              </td>
              <td className="ko-serif" style={{padding:14, fontSize:14}}>{p.title}</td>
              <td className="dim mono" style={{padding:14}}>{p.author}</td>
              <td className="mono dim-2" style={{padding:14}}>{p.date}</td>
              <td style={{padding:14, textAlign:'right', display:'flex', justifyContent:'flex-end', gap:8}}>
                <button type="button" className="btn btn-small" onClick={() => setViewingId(p.id)}>열기</button>
                <button type="button" className="btn btn-small" onClick={() => removeOne(p)}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {visible.length === 0 && (
        <div className="card" style={{padding:24, marginTop:16, textAlign:'center'}}>
          조건에 맞는 게시글이 없습니다.
        </div>
      )}

      {/* v00.264.003 — admin 패널 페이지네이션 (홈과 동일 스타일) */}
      {visible.length > 0 && totalPages > 1 && (
        <nav aria-label="게시글 페이지 이동" style={{display:'flex', justifyContent:'center', alignItems:'center', gap:6, marginTop:18, flexWrap:'wrap'}}>
          <button type="button" className="btn btn-small"
            onClick={() => setPage(Math.max(1, safePage - 1))}
            disabled={safePage <= 1}>← 이전</button>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
            <button key={n} type="button" className="btn btn-small"
              aria-current={n === safePage ? 'page' : undefined}
              onClick={() => setPage(n)}
              style={{
                borderColor: n === safePage ? 'var(--primary)' : 'var(--line)',
                color: n === safePage ? 'var(--primary)' : 'var(--ink-2)',
                background: n === safePage ? 'rgba(245,213,72,0.08)' : 'transparent',
                minWidth: 36,
              }}>{n}</button>
          ))}
          <button type="button" className="btn btn-small"
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage >= totalPages}>다음 →</button>
        </nav>
      )}
      {visible.length > 0 && (
        <div className="mono dim-2" style={{textAlign:'center', fontSize:10, letterSpacing:'0.2em', marginTop:8}}>
          전체 {visible.length}건 · {safePage}/{totalPages} 페이지
        </div>
      )}

      {viewingId && (
        <PostViewerModal postId={viewingId} onClose={() => setViewingId(null)}/>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────

export { CommunityPostsAdminPanel, CorruptedBodyInspector, DSR_LABELS, ErrorPagesPreviewPanel, InternalAlarmPanel, PRIVACY_DATA, ReportQueuePanel };

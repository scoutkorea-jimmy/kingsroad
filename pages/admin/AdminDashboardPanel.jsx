// 뱅기노자 — 대시보드/고객여정 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// DashboardPanel(page-view analytics 요약) · UserJourneyPanel(유입→도착 Sankey 흐름).
// 자기완결적 — 의존은 모두 window 전역(BGNJ_API/GUARD/FMT, SankeyFlow 등 AdminShared 글로벌).
// entry-admin 에서 AuthAdminPage 앞에 로드. DashboardPanel·UserJourneyPanel window 노출.

// 분석 유틸은 AdminShared.jsx 에 정의 + window 노출 (v00.285 — 가장 먼저 로드되어 load-order 안전).
// v00.286 ESM — cross-module import (전역 결합 제거).
import { AdminPanelHeader, CohortSelector, MetricCard, MiniBarChart, RankedBarList, StatTile } from './AdminShared.jsx';

import { _countSince } from './AdminShared.jsx';
import { _hourlySeries } from './AdminShared.jsx';
import { _dailySeries } from './AdminShared.jsx';

// === Dashboard Panel (v00.148) — 실제 page-view analytics summary 사용 ====
const DashboardPanel = ({ dashboardStats, allUsers, allCommunityPosts, latestCommunityPost, latestColumn, setTab, G }) => {
  const [summary, setSummary] = React.useState(null);
  const [loadingSummary, setLoadingSummary] = React.useState(true);
  const [summaryError, setSummaryError] = React.useState('');

  // v00.173 — 차트별 코호트(기간). 페이지뷰 차트 + 가입 차트 각각 독립.
  // v00.179 — 유입 경로 / 인기 페이지 도 자체 cohort. 모두 단일 summary 호출 days 파라미터에 매핑.
  const [pvDays, setPvDays] = React.useState(14);
  const [signupDays, setSignupDays] = React.useState(14);
  const [refDays, setRefDays] = React.useState(30);
  const [routeDays, setRouteDays] = React.useState(7);
  const [heatmapDays, setHeatmapDays] = React.useState(30);

  // v00.308.000 — '오늘' 지표. 한국 시간 자정 기준으로 서버가 센 값을 받는다.
  //   ⚠ 이 코드는 v00.306.009 에 AuthAdminPage.jsx 의 `{false && …}` 죽은 덩어리 안에 들어가
  //     **화면에 한 번도 뜬 적이 없었다.** 진짜 대시보드는 이 파일이다. 여기 두어야 보인다.
  //   화면에 없는 숫자(댓글·공감·손볼 것)라 서버가 세야 한다. 프론트가 셀 수 있는 값이 아니다.
  const [todayStats, setTodayStats] = React.useState(null);
  const [todayError, setTodayError] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    const load = () => window.BGNJ_API?.admin?.today?.()
      .then((j) => { if (!cancelled) { setTodayStats(j); setTodayError(null); } })
      .catch((e) => { if (!cancelled) setTodayError(e?.message || '불러오지 못했습니다'); });
    load();
    // 하루를 지켜보는 숫자다. 5분마다 갱신하면 관리자가 새로고침하지 않아도 최신이다.
    const t = setInterval(load, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  const loadSummary = React.useCallback(async () => {
    setLoadingSummary(true);
    setSummaryError('');
    try {
      // v00.179 — pvDays + refDays + routeDays 를 함께 전달. 한 번의 fetch 로 모든 차트 갱신.
      // v00.194 — heatmapDays 포함.
      const data = await window.BGNJ_API?.analytics?.summary?.({ days: pvDays, refDays, routeDays, heatmapDays });
      if (data?.error) {
        setSummaryError(data.error);
        setSummary(data);
      } else {
        setSummary(data || null);
      }
    } catch (err) {
      setSummaryError(err?.message || '요청 실패');
      setSummary(null);
    } finally { setLoadingSummary(false); }
  }, [pvDays, refDays, routeDays, heatmapDays]);

  React.useEffect(() => { loadSummary(); }, [loadSummary]);

  // v00.195 — 사용자 보고 '페이지뷰와 가입 추이 모두 다 현행화'.
  // 대시보드 마운트 시 BGNJ_AUTH.refreshUsers 강제 호출 (allUsers 가 stale 상태로 들어오는 경우 대비).
  // 그 후 부모 (AuthAdminPage) 가 'bgnj-users-refresh' 이벤트로 allUsers 재계산 → signup 차트 즉시 갱신.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try { await window.BGNJ_AUTH?.refreshUsers?.(); } catch (_e) { console.warn('[bgnj] AdminDashboardPanel.jsx:56 오류(무시하고 진행)', _e); }
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, []);

  // 가입 추이 — 클라이언트 derived (정확한 값).
  // v00.194 — 사용자 보고 '회원가입추이도 정상작동 안하는듯'.
  // root cause: BGNJ_AUTH._usersCache 매퍼 (data.js:1248) 가 `joinedAt` 으로 노출하지만
  // 차트 코드는 `createdAt` 으로 읽어 모든 카운트가 0. 타 호출 측은 모두 joinedAt 사용 → 차트 측 정정.
  const dailySignups = _countSince(allUsers, 'joinedAt', 1);
  const weeklySignups = _countSince(allUsers, 'joinedAt', 7);
  const monthlySignups = _countSince(allUsers, 'joinedAt', 30);
  // v00.173 — signupDays 코호트로 series 길이 동적. v00.176 — 1일이면 시간 단위.
  const signupSeries = signupDays === 1
    ? _hourlySeries(allUsers, 'joinedAt', 24)
    : _dailySeries(allUsers, 'joinedAt', signupDays);

  // 페이지뷰 — 서버 값 우선, 없으면 게시글 작성 횟수 폴백.
  const pv = summary || {};
  const dayViews = pv.day ?? null;
  const weekViews = pv.week ?? null;
  const monthViews = pv.month ?? null;
  const dayUnique = pv.dayUnique ?? null;
  const weekUnique = pv.weekUnique ?? null;
  const monthUnique = pv.monthUnique ?? null;

  // v00.173 — pvDays 코호트로 series 길이 동적. v00.176 — 1일이면 24시간 hourly.
  const pvSeries = (() => {
    if (pvDays === 1) {
      // 시간 단위 (워커 hourlySeries 응답).
      const hours = 24;
      const counts = new Array(hours).fill(0);
      const labels = new Array(hours).fill('');
      const now = new Date(); now.setMinutes(0, 0, 0);
      const baseTs = now.getTime() - (hours - 1) * 3600000;
      (pv.hourlySeries || []).forEach(({ hour, views }) => {
        // hour 형식: 'YYYY-MM-DDTHH' (ISO prefix). 직접 파싱.
        const t = Date.parse((hour || '') + ':00:00+09:00');
        if (isNaN(t)) return;
        const idx = Math.floor((t - baseTs) / 3600000);
        if (idx >= 0 && idx < hours) counts[idx] = Number(views) || 0;
      });
      // v00.192 — 사용자 보고 '시간 라벨 중간에 생략하지 말고 매시'. 24시간 모두 라벨.
      for (let i = 0; i < hours; i++) {
        const dt = new Date(baseTs + i * 3600000);
        labels[i] = (i === hours - 1) ? '지금' : `${dt.getHours()}시`;
      }
      return { counts, labels };
    }
    const days = pvDays;
    const counts = new Array(days).fill(0);
    const labels = new Array(days).fill('');
    const todayMid = (() => { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); })();
    (pv.dailySeries || []).forEach(({ day, views }) => {
      const t = Date.parse(day + 'T00:00:00+09:00');
      if (isNaN(t)) return;
      const idx = Math.floor((t - todayMid) / 86400000) + (days - 1);
      if (idx >= 0 && idx < days) counts[idx] = Number(views) || 0;
    });
    // v00.195 — 사용자 보고 '임의로 중간에 값들을 축약하지마'. 모든 일자에 라벨 (이전엔 days 길이별 매 N일마다).
    for (let i = 0; i < days; i++) {
      const dt = new Date(todayMid + (i - (days - 1)) * 86400000);
      labels[i] = (i === days - 1) ? '오늘' : `${dt.getMonth()+1}/${dt.getDate()}`;
    }
    return { counts, labels };
  })();

  // 유입 경로 — 서버 referrers 가 있으면 사용, 없으면 추정 폴백.
  const refs = pv.referrers || [];
  const refTotal = refs.reduce((s, r) => s + r.count, 0) || 1;

  // v00.308.000 — 오늘 카드. 숫자만 있으면 그게 많은 건지 적은 건지 알 수 없어 어제와 견준다.
  //   호버해야 보이는 값이 아니라 **카드 자체에 숫자가 적혀 있어야 한다**(사용자 지시).
  const TodayCard = ({ label, value, prev, sub, warn }) => {
    const 준비중 = value === null || value === undefined;
    const diff = 준비중 || prev === null || prev === undefined ? null : value - prev;
    const 손볼게있다 = warn && !준비중 && value > 0;
    return (
      <div className="card">
        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12}}>{label}</div>
        <div className="ko-serif" style={{fontSize:32, color: 손볼게있다 ? 'var(--danger)' : 'var(--ink)'}}>
          {준비중 ? <span className="dim-2" style={{fontSize:18}}>—</span> : value.toLocaleString('ko-KR')}
        </div>
        <div style={{fontSize:11, marginTop:8, color:'var(--ink-2)', wordBreak:'keep-all', overflowWrap:'break-word'}}>
          {준비중 ? (todayError ? '불러오지 못했습니다' : '집계하는 중…') : (
            <>
              {diff === null ? '' : diff === 0 ? '어제와 같음'
                : diff > 0 ? <span className="gold">어제보다 +{diff}</span>
                : <span className="dim-2">어제보다 {diff}</span>}
              {sub ? <span className="dim-2">{diff === null ? '' : ' · '}{sub}</span> : null}
            </>
          )}
        </div>
      </div>
    );
  };
  const T = todayStats?.today || {};
  const Y = todayStats?.yesterday || {};
  const TB = todayStats?.todoBreakdown || {};
  const LB = todayStats?.likeBreakdown || {};
  const todoSub = [
    TB.reports ? `신고 ${TB.reports}` : null,
    TB.orders ? `입금대기 ${TB.orders}` : null,
    TB.errors ? `오류 ${TB.errors}` : null,
  ].filter(Boolean).join(' · ') || '처리할 것 없음';

  return (
    <>
      {/* v00.308.000 — 0줄: 오늘 하루. 운영자가 가장 먼저 보고 싶은 숫자를 맨 위에 둔다. */}
      <div className="admin-section__title">
        오늘 (한국 시간 자정 기준 · 5분마다 갱신){todayError ? ' ⚠ 불러오지 못했습니다' : ''}
      </div>
      <div className="grid grid-4" style={{marginBottom:18}}>
        <TodayCard label="오늘 작성된 글"   value={todayStats ? T.posts : null}    prev={Y.posts}/>
        <TodayCard label="오늘 작성된 댓글" value={todayStats ? T.comments : null} prev={Y.comments}/>
        <TodayCard label="오늘 받은 공감"   value={todayStats ? T.likes : null}    prev={Y.likes}
          sub={todayStats ? `글 ${Number(LB.posts || 0)} · 댓글 ${Number(LB.comments || 0)}` : ''}/>
        <TodayCard label="손볼 것" warn value={todayStats ? T.todo : null} prev={null} sub={todoSub}/>
      </div>

      {/* 1줄: 기존 4종 (전체 회원 / 게시글 / 칼럼 / 책 주문) — v00.157 hover popover 활성. */}
      <div className="grid grid-4" style={{marginBottom:18}}>
        {dashboardStats.map((s, i) => (
          <StatTile key={i} stat={s}/>
        ))}
      </div>

      {/* 2줄: 일/주/월 페이지뷰 + 가입자 */}
      <div className="admin-section__title">
        방문자 · 가입 {summaryError ? '⚠ 분석 데이터 미수신 (schema-v9 미적용 또는 워커 미배포)' : (loadingSummary ? '· ⏳ 불러오는 중…' : '')}
      </div>
      <div className="grid grid-4" style={{marginBottom:18}}>
        <MetricCard icon="📅" label="일일 방문" value={dayViews ?? '—'}
          accent="var(--primary)" sub={dayUnique != null ? `세션 ${dayUnique}건 · 페이지뷰 ${dayViews}` : '서버 데이터 미수신'}
          details={dayUnique != null ? [
            { label: '페이지뷰', value: dayViews },
            { label: '세션 (unique)', value: dayUnique },
            { label: '페이지/세션', value: dayUnique > 0 ? (dayViews / dayUnique).toFixed(2) : '—' },
          ] : null}/>
        <MetricCard icon="📊" label="주간 방문" value={weekViews ?? '—'}
          accent="var(--primary-hover)" sub={weekUnique != null ? `세션 ${weekUnique}건 · 페이지뷰 ${weekViews}` : '서버 데이터 미수신'}
          details={weekUnique != null ? [
            { label: '페이지뷰', value: weekViews },
            { label: '세션 (unique)', value: weekUnique },
            { label: '일평균 페이지뷰', value: (weekViews / 7).toFixed(1) },
            { label: '일평균 세션', value: (weekUnique / 7).toFixed(1) },
          ] : null}/>
        <MetricCard icon="📈" label="월간 방문" value={monthViews ?? '—'}
          accent="var(--primary)" sub={monthUnique != null ? `세션 ${monthUnique}건 · 페이지뷰 ${monthViews}` : '서버 데이터 미수신'}
          details={monthUnique != null ? [
            { label: '페이지뷰', value: monthViews },
            { label: '세션 (unique)', value: monthUnique },
            { label: '일평균 페이지뷰', value: (monthViews / 30).toFixed(1) },
            { label: '일평균 세션', value: (monthUnique / 30).toFixed(1) },
          ] : null}/>
        <MetricCard icon="✨" label="오늘 신규 가입" value={dailySignups}
          accent="var(--secondary, #1F7A8C)"
          sub={`주간 ${weeklySignups}명 · 월간 ${monthlySignups}명`}
          details={[
            { label: '오늘 신규',   value: dailySignups },
            { label: '최근 7일',    value: weeklySignups },
            { label: '최근 30일',   value: monthlySignups },
            { label: '누적 회원',   value: allUsers.length },
            { label: '7일 일평균',  value: (weeklySignups / 7).toFixed(1) },
            { label: '30일 일평균', value: (monthlySignups / 30).toFixed(2) },
          ]}/>
      </div>

      {/* 3줄: 추이 차트 — v00.173 코호트 selector + 호버 툴팁. */}
      <div className="grid grid-2" style={{marginBottom:18}}>
        <article className="card">
          <MiniBarChart
            label={`📊 ${pvDays === 1 ? '24시간 (1시간 단위)' : pvDays + '일'} 페이지뷰 추이`}
            series={pvSeries.counts}
            labels={pvSeries.labels}
            color="var(--primary)"
            height={140}
            unit="회"
            formatTooltip={(v, l) => `${l || ''} · 페이지뷰 ${v}회`}
            headerRight={<CohortSelector value={pvDays} onChange={setPvDays}/>}/>
          <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
            {summaryError ? '서버 분석 데이터 없음 — schema-v9 + 워커 deploy 필요.' : (pvDays === 1 ? '최근 24시간 시간별 페이지뷰. 막대 호버 시 정확한 값.' : '실제 측정된 일별 페이지뷰 (page_views D1). 막대에 호버하면 정확한 값.')}
          </p>
        </article>
        <article className="card">
          <MiniBarChart
            label={`📊 ${signupDays === 1 ? '24시간 (1시간 단위)' : signupDays + '일'} 가입 추이`}
            series={signupSeries.counts}
            labels={signupSeries.labels}
            color="var(--secondary, #1F7A8C)"
            height={140}
            unit="명"
            formatTooltip={(v, l) => `${l || ''} · 신규 가입 ${v}명`}
            headerRight={<CohortSelector value={signupDays} onChange={setSignupDays}/>}/>
          <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
            {signupDays === 1 ? '최근 24시간 시간별 신규 가입자.' : `최근 ${signupDays}일간 일별 신규 가입자 수.`} 막대에 호버하면 정확한 값.
          </p>
        </article>
      </div>

      {/* v00.196 — 사용자 요청 '회원 등급별 분포 현황'. allUsers × BGNJ_STORES.grades 매핑 → RankedBarList. */}
      <div className="admin-section__title">회원 등급별 분포</div>
      {(() => {
        const grades = window.BGNJ_STORES?.grades || [];
        const counts = {};
        const adminCount = allUsers.filter((u) => u.isAdmin || u.isSuperAdmin).length;
        const totalNonAdmin = allUsers.length - adminCount;
        allUsers.forEach((u) => {
          if (u.isAdmin || u.isSuperAdmin) return;
          const gid = u.gradeId || 'unranked';
          counts[gid] = (counts[gid] || 0) + 1;
        });
        // 등급 정의 순서 유지 + unranked 마지막. admin 별도 처리.
        const items = grades
          .map((g) => ({ id: g.id, label: g.name || g.id, count: counts[g.id] || 0, sub: g.tag || '' }))
          .filter((it) => it.count > 0 || (grades.find((g) => g.id === it.id)?.id));
        // 미분류 (gradeId 없는 회원).
        if (counts.unranked) items.push({ id: 'unranked', label: '미분류', count: counts.unranked, color: 'var(--ink-3)' });
        if (adminCount > 0) items.push({ id: '__admin', label: '관리자', count: adminCount, color: 'var(--secondary)' });
        items.sort((a, b) => b.count - a.count);
        return (
          <RankedBarList
            items={items}
            unit="명"
            emptyText={allUsers.length === 0 ? '회원 데이터 미수신 — refreshUsers 호출 직후 자동 갱신.' : '등급이 부여된 회원이 아직 없습니다.'}
            headerLeft="GRADE DISTRIBUTION"
            headerRight={
              <span className="dim-2 mono" style={{fontSize:11}}>
                전체 {allUsers.length}명 · 관리자 {adminCount} · 일반 {totalNonAdmin}
              </span>
            }/>
        );
      })()}

      {/* v00.194 — 사용자 요청 '대시보드에 접속 시간에 따른 히트맵'. KST 기준 24h × 7요일. */}
      <div style={{marginBottom:18}}>
        <window.HeatmapGrid
          data={pv.heatmap || []}
          days={pv.heatmapDays || heatmapDays}
          label={`🗓 접속 시간 히트맵 (최근 ${heatmapDays}일 · KST · 요일×시간)`}
          headerRight={<CohortSelector value={heatmapDays} onChange={setHeatmapDays}/>}/>
        <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
          {summaryError ? '서버 분석 데이터 없음 — schema-v9 + 워커 deploy 필요.' : '셀에 호버하면 정확한 페이지뷰 / 세션 수 확인. 색이 진할수록 트래픽이 몰린 시간대.'}
        </p>
      </div>

      {/* 4줄: 유입 경로 — v00.179 RankedBarList 공통 컴포넌트 + cohort + 호버. */}
      <div className="admin-section__title">유입 경로 (최근 {refDays}일)</div>
      <RankedBarList
        items={refs.map((r) => ({
          label: r.host === 'self' ? '직접 방문 (사이트 내)' : r.host,
          count: r.count,
        }))}
        unit="회"
        emptyText={summaryError ? '서버 분석 데이터 미수신.' : '아직 referrer 데이터가 충분하지 않습니다. 사용자 방문이 누적되면 자동 표시.'}
        headerLeft="TRAFFIC SOURCES"
        headerRight={
          <div style={{display:'flex', gap:6, alignItems:'center'}}>
            <CohortSelector value={refDays} onChange={setRefDays}/>
            <button type="button" className="btn btn-small" onClick={loadSummary} disabled={loadingSummary} style={{padding:'4px 10px', fontSize:11}}>
              {loadingSummary ? '⏳' : '🔄'}
            </button>
          </div>
        }/>

      {/* 인기 라우트 — v00.179 RankedBarList. */}
      <div className="admin-section__title">인기 페이지 (최근 {routeDays}일)</div>
      <RankedBarList
        items={(pv.topRoutes || []).map((r) => ({
          label: r.route,
          count: r.count,
          color: 'var(--secondary, #1F7A8C)',
        }))}
        valueFormat={(c) => `${c} views`}
        emptyText={summaryError ? '서버 분석 데이터 미수신.' : '데이터가 누적되면 자동 표시.'}
        headerLeft="POPULAR PAGES"
        headerRight={<CohortSelector value={routeDays} onChange={setRouteDays}/>}/>

      {/* 5줄: 기존 latest community + ops snapshot */}
      <div className="grid grid-2">
        <article className="card card-gold">
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>LATEST COMMUNITY</div>
          <h2 className="ko-serif" style={{fontSize:20, marginBottom:12}}>가장 최근 커뮤니티 글</h2>
          {latestCommunityPost ? (
            <>
              <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:10}}>
                <span className="badge badge-gold">{window.BGNJ_BOARD_LABEL?.(latestCommunityPost)}</span>
                <span className="mono dim-2" style={{fontSize:11}}>{latestCommunityPost.date}</span>
              </div>
              <p style={{fontSize:16, marginBottom:10}}>{latestCommunityPost.title}</p>
              <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:16}}>
                작성자 {latestCommunityPost.author} · 조회 {latestCommunityPost.views} · 댓글 {latestCommunityPost.replies}
              </p>
            </>
          ) : (<p className="dim">등록된 게시글이 없습니다.</p>)}
          <button type="button" className="btn btn-small" onClick={() => setTab("커뮤니티")}>커뮤니티 관리로 이동</button>
        </article>

        <article className="card">
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>OPERATIONS SNAPSHOT</div>
          <h2 className="ko-serif" style={{fontSize:20, marginBottom:12}}>운영 요약</h2>
          <div style={{display:'grid', gap:12, marginBottom:18}}>
            <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">최근 칼럼</span><span>{latestColumn?.title || "없음"}</span></div>
            <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">다음 강연</span><span>{G.arr(() => window.BGNJ_LECTURES?.listAll?.()).filter((l) => l && !l.hidden)[0]?.next || "없음"}</span></div>
            <div style={{display:'flex', justifyContent:'space-between', gap:12}}><span className="dim">다음 투어</span><span>{G.arr(() => window.BGNJ_TOURS?.listAll?.()).filter((t) => t && !t.hidden)[0]?.next || "없음"}</span></div>
          </div>
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small" onClick={() => setTab("뱅기노자 칼럼")}>칼럼 관리</button>
            <button type="button" className="btn btn-small" onClick={() => setTab("투어 프로그램")}>투어 관리</button>
          </div>
        </article>
      </div>
    </>
  );
};

// v00.187 — Sankey 흐름도 + 헬퍼 모두 AdminShared.jsx 로 이동. SankeyFlow 만 외부 사용.
import { SankeyFlow } from './AdminShared.jsx';

// === User Journey Panel (v00.178 단순화) ===========================
// v00.146 시작 (회원별 타임라인) → v00.174 Sankey 추가 → v00.176 사용자 보고 '회원 단위 X, 전체적으로만'
// → v00.178 회원 목록/타임라인 + 관련 state/effect/memo 모두 삭제. SankeyFlow 만 노출.
// 데이터: analytics summary 의 flowPairs (referrer × route 집계).
// v00.308.000 — 사용자 여정 4단계 깔때기.
//   ⚠ 서버가 네 단계를 **포함 관계로** 센다(뒤 단계는 앞 단계의 부분집합). 그래서 막대는 절대 늘어나지 않는다.
//     이 성질이 깨지면 '몇 %가 다음으로 넘어갔나' 라는 말 자체가 성립하지 않는다.
const FUNNEL_STAGES = [
  { key: 'visits',  label: '방문',        desc: '사이트에 들어온 사람(세션)' },
  { key: 'reached', label: '콘텐츠 열람',  desc: '광장·칼럼·답사·배움·도서·한켠 중 하나를 연 사람' },
  { key: 'browsed', label: '여러 쪽 탐색', desc: '그중 두 쪽 이상 본 사람' },
  { key: 'logged',  label: '로그인',      desc: '그중 로그인한 사람' },
];

const JourneyFunnel = ({ funnel }) => {
  const f = funnel || {};
  const rows = FUNNEL_STAGES.map((s) => ({ ...s, value: Number(f[s.key] || 0) }));
  const top = rows[0]?.value || 0;
  // 가장 많이 빠지는 구간 — 손댈 곳을 한 줄로 짚어 준다. 숫자만 늘어놓으면 아무도 안 읽는다.
  let worst = null;
  for (let i = 1; i < rows.length; i++) {
    const lost = rows[i - 1].value - rows[i].value;
    if (!worst || lost > worst.lost) worst = { lost, from: rows[i - 1].label, to: rows[i].label };
  }
  if (!top) {
    return (
      <div className="card" style={{padding:24}}>
        <p className="dim" style={{fontSize:13}}>아직 집계된 방문이 없습니다.</p>
      </div>
    );
  }
  return (
    <div className="card" style={{padding:24}}>
      <ol style={{listStyle:'none', padding:0, margin:0}}>
        {rows.map((r, i) => {
          const prev = i === 0 ? null : rows[i - 1].value;
          const rate = prev ? Math.round((r.value / prev) * 100) : null;
          const share = Math.max(2, Math.round((r.value / top) * 100));
          return (
            <li key={r.key} style={{marginBottom: i === rows.length - 1 ? 0 : 18}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12, marginBottom:6, flexWrap:'wrap'}}>
                <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em'}}>
                  {i + 1}. {r.label}
                </span>
                <span style={{fontSize:13}}>
                  <strong className="ko-serif" style={{fontSize:20}}>{r.value.toLocaleString('ko-KR')}</strong>
                  <span className="dim-2" style={{fontSize:11}}>명</span>
                  {rate === null ? null : (
                    <span className="dim-2 mono" style={{fontSize:11, marginLeft:8}}>
                      앞 단계의 {rate}%
                    </span>
                  )}
                </span>
              </div>
              <div style={{height:10, background:'var(--line)', overflow:'hidden'}}>
                <div style={{width:`${share}%`, height:'100%', background:'var(--ink)'}}/>
              </div>
              <div className="dim-2" style={{fontSize:11, marginTop:6, wordBreak:'keep-all', overflowWrap:'break-word'}}>
                {r.desc}
              </div>
            </li>
          );
        })}
      </ol>
      {rows[3]?.value === 0 && top > 0 && (
        <p className="dim-2" style={{fontSize:11, marginTop:14, wordBreak:'keep-all', overflowWrap:'break-word'}}>
          ※ 로그인 단계가 0인 이유 — 누가 로그인했는지 기록하는 코드에 없는 함수 이름이 적혀 있어
          v00.308.000 이전 방문에는 이 값이 비어 있습니다. 지금부터 쌓입니다.
        </p>
      )}
      {worst && worst.lost > 0 && (
        <p style={{fontSize:12, marginTop:20, paddingTop:16, borderTop:'1px solid var(--line)', color:'var(--ink-2)', wordBreak:'keep-all', overflowWrap:'break-word'}}>
          가장 많이 빠지는 곳 — <strong>{worst.from} → {worst.to}</strong> 에서 {worst.lost.toLocaleString('ko-KR')}명이 떠났습니다.
        </p>
      )}
    </div>
  );
};

const UserJourneyPanel = () => {
  const [flowPairs, setFlowPairs] = React.useState([]);
  const [funnel, setFunnel] = React.useState(null);
  const [flowDays, setFlowDays] = React.useState(30);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await window.BGNJ_API?.analytics?.summary?.({ days: flowDays });
        if (cancelled) return;
        setFlowPairs(Array.isArray(data?.flowPairs) ? data.flowPairs : []);
        setFunnel(data?.funnel || null);
      } catch {
        if (cancelled) return;
        setFlowPairs([]);
        setFunnel(null);
      }
    })();
    return () => { cancelled = true; };
  }, [flowDays]);

  return (
    <>
      <AdminPanelHeader
        eyebrow="JOURNEY · 사용자 여정"
        title="고객 여정 흐름"
        description="들어와서 어디까지 갔는지를 네 단계로 나눠 봅니다. 아래 Sankey 는 유입 채널 → 도착 페이지의 세부 흐름입니다. 우상단 [기간] 으로 코호트 변경."/>
      <div className="admin-section__title">여정 4단계 (최근 {funnel?.days || flowDays}일)</div>
      <div style={{marginBottom:18}}>
        <JourneyFunnel funnel={funnel}/>
      </div>
      <div className="admin-section__title">유입 → 도착 세부 흐름</div>
      <SankeyFlow pairs={flowPairs} days={flowDays} onDaysChange={setFlowDays}/>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────

// v00.286 ESM — 모듈 export (window 노출과 병행, 점진 전환).
export { DashboardPanel, UserJourneyPanel };

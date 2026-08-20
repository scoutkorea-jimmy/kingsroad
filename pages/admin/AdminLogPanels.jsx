// 뱅기노자 — 감사/활동 로그 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// AuditDetailsCell · AuditLogPanel(감사 로그) · ActivityLogPanel(통합 활동 로그).
// 자기완결적 — 의존은 모두 window 전역(BGNJ_API/AUDIT/FMT/COMMUNITY 등).
// entry-admin 에서 AuthAdminPage 앞에 로드. AuditLogPanel·ActivityLogPanel 만 window 노출.

// 감사 로그 details — JSON 덤프 대신 key/value 칩 리스트로 노출.
// v00.286 ESM — cross-module import (전역 결합 제거).
import { AdminEmpty, AdminPanelHeader, downloadCsv } from './AdminShared.jsx';

const AuditDetailsCell = ({ details }) => {
  if (!details || (typeof details === 'object' && !Object.keys(details).length)) {
    return <span className="dim-2">—</span>;
  }
  if (typeof details !== 'object') {
    return <span className="mono dim">{String(details)}</span>;
  }
  return (
    <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
      {Object.entries(details).map(([k, v]) => (
        <span key={k} style={{
          display:'inline-flex', gap:4, alignItems:'baseline',
          padding:'2px 8px', background:'var(--bg-2)', border:'1px solid var(--line)',
          fontSize:11,
        }}>
          <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.1em'}}>{k}</span>
          <span style={{color:'var(--ink)'}}>{
            typeof v === 'object' ? JSON.stringify(v) : String(v)
          }</span>
        </span>
      ))}
    </div>
  );
};

// SuspendDialog · ProfileFields · MemberAdminPanel 은 admin/AdminMemberPanel.jsx 로 분리 (v00.285).


// === Audit Log Panel ==============================================
const AuditLogPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const refresh = () => setTick((v) => v + 1);
  const list = React.useMemo(() => window.BGNJ_AUDIT?.list?.({ search, limit: 200 }) || [], [search, tick]);

  const exportCsv = () => {
    const all = window.BGNJ_AUDIT.list({ limit: 1000 });
    const header = ['id', 'ts', 'action', 'target', 'by', 'details'];
    const rows = all.map((e) => [e.id, e.ts, e.action, e.target, e.by, e.details ? JSON.stringify(e.details) : '']);
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadCsv(`audit-log-${new Date().toISOString().slice(0,10)}.csv`, csv);
  };

  const clear = async () => {
    if (!(await window.BGNJ_CONFIRM('감사 로그 전체를 삭제하시겠어요? 되돌릴 수 없습니다.', { danger: true }))) return;
    window.BGNJ_AUDIT.clear();
    refresh();
  };

  return (
    <div>
      <AdminPanelHeader
        eyebrow="AUDIT · 감사 로그"
        title="운영자 액션 이력"
        description="운영자가 회원·강연·투어·책 주문에 대해 행한 변경이 시각순으로 기록됩니다. 최근 500건까지 보관, 정지·삭제·입금 확인·발송·등급 변경 등 핵심 액션 자동 기록."
        actions={(
          <>
            <button type="button" className="btn btn-small" onClick={exportCsv}>CSV 다운로드</button>
            <button type="button" className="btn btn-small" onClick={clear}
              style={{borderColor:'var(--danger)', color:'var(--danger)'}}>전체 삭제</button>
          </>
        )}/>

      <div className="admin-toolbar">
        <input className="field-input" placeholder="액션 / 대상 / 작업자 검색..." style={{flex:1, minWidth:240}}
          value={search} onChange={(e) => setSearch(e.target.value)}/>
      </div>

      {list.length === 0 ? (
        <AdminEmpty>표시할 감사 로그가 없습니다.</AdminEmpty>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" style={{fontSize:12}}>
            <thead>
              <tr>
                <th scope="col" style={{width:170}}>시각</th>
                <th scope="col" style={{width:220}}>액션</th>
                <th scope="col">대상</th>
                <th scope="col">작업자</th>
                <th scope="col">세부</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id}>
                  <td className="mono dim-2" style={{fontSize:11}}>{window.BGNJ_FMT.kstDateTime(e.ts)}</td>
                  <td className="mono gold" style={{fontSize:11}}>{e.action}</td>
                  <td className="mono" style={{fontSize:11}}>{e.target}</td>
                  <td style={{fontSize:12}}>{e.by}</td>
                  <td style={{fontSize:11, lineHeight:1.6}}>
                    <AuditDetailsCell details={e.details}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="dim-2 mono" style={{fontSize:11, marginTop:12, textAlign:'right'}}>
        표시 {list.length}건 (전체 최근 500건 중)
      </div>
    </div>
  );
};


// === Activity Log Panel (v00.190) ==================================
// 사용자 보고 '관리자 활동 로그뿐 아니라 일반 회원 활동까지 모든 기록' — 통합 활동 로그.
// 다중 소스를 병합 시간 역순:
//   1) audit_log (admin actions + signup) via BGNJ_API.admin.audit.list
//   2) error_log (모든 사용자 오류) via BGNJ_API.admin.errorLog.list
//   3) 최근 게시글 / 댓글 (회원 활동) via 로컬 BGNJ_COMMUNITY 캐시
// 필터: 전체 / admin / signup / error / post / comment.
const ActivityLogPanel = () => {
  const [auditRows, setAuditRows] = React.useState([]);
  const [errorRows, setErrorRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all');
  const [refreshKey, setRefreshKey] = React.useState(0);
  // v00.190 추가: 검색 + 정렬 + 기간 필터 (사용자 보고 '필터+정렬+검색 꼭 넣어달라').
  const [search, setSearch] = React.useState('');
  const [sortKey, setSortKey] = React.useState('ts_desc'); // ts_desc / ts_asc / actor_asc / type_asc
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const [auditRes, errorRes] = await Promise.allSettled([
          window.BGNJ_API?.admin?.audit?.list?.({ limit: 300 }),
          window.BGNJ_API?.admin?.errorLog?.list?.({ limit: 200 }),
        ]);
        if (cancelled) return;
        const audits = (auditRes.status === 'fulfilled' && Array.isArray(auditRes.value?.entries)) ? auditRes.value.entries : [];
        const errors = (errorRes.status === 'fulfilled' && Array.isArray(errorRes.value?.entries)) ? errorRes.value.entries : [];
        setAuditRows(audits);
        setErrorRows(errors);
      } catch {} finally { if (!cancelled) setLoading(false); }  // bgnj-allow-silent — 오류 보고 자체 — 실패해도 재보고하면 무한루프
    })();
    return () => { cancelled = true; };
  }, [refreshKey]);

  // 회원 활동 — 최근 게시글 (BGNJ_COMMUNITY 로컬 캐시).
  const recentPosts = React.useMemo(() => {
    try { return (window.BGNJ_COMMUNITY?.listPosts?.() || []).slice(0, 100); } catch { return []; }
  }, [refreshKey]);

  // 통합 entries — 공통 shape: { ts, type, actor, action, detail, source }.
  const merged = React.useMemo(() => {
    const out = [];
    auditRows.forEach((a) => {
      const action = String(a.action || '');
      // signup / grade.* / category.* / admin.* / lecture.* / tour.* / alarm.* 분류.
      const type = action.startsWith('user.signup') ? 'signup'
        : action.startsWith('admin.') ? 'admin'
        : action.startsWith('grade.') ? 'grade'
        : action.startsWith('category.') ? 'category'
        : action.startsWith('lecture.') ? 'content'
        : action.startsWith('tour.') ? 'content'
        : action.startsWith('alarm.') ? 'alarm'
        : 'admin';
      const details = a.details_json ? (() => { try { return JSON.parse(a.details_json); } catch { return null; } })() : null;
      out.push({
        ts: a.ts, type,
        actor: a.actor || '?',
        action, target: a.target || '',
        detail: details ? Object.entries(details).map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`).join(' · ') : '',
        ip: a.ip,
        source: 'audit',
      });
    });
    errorRows.forEach((e) => {
      out.push({
        ts: e.ts, type: 'error',
        actor: e.user_id || (e.user_agent || '').slice(0, 24) || 'anonymous',
        action: `${e.code || 'ERROR'} (${e.kind || ''})`,
        target: e.pathname || e.url || '',
        detail: e.message || '',
        ip: '',
        source: 'error',
      });
    });
    recentPosts.forEach((p) => {
      out.push({
        ts: p.createdAt || p.date || '', type: 'post',
        actor: p.author || '?',
        action: `post.create [${p.category || ''}]`,
        target: `post:${p.id}`,
        detail: p.title || '',
        ip: '',
        source: 'post',
      });
    });
    return out.sort((a, b) => String(b.ts || '').localeCompare(String(a.ts || '')));
  }, [auditRows, errorRows, recentPosts]);

  // v00.190 — 통합 필터: 유형 + 검색 + 기간 + 정렬.
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTs = dateFrom ? Date.parse(dateFrom + 'T00:00:00+09:00') : null;
    const toTs = dateTo ? Date.parse(dateTo + 'T23:59:59+09:00') : null;
    let rows = merged;
    if (filter !== 'all') rows = rows.filter((e) => e.type === filter);
    if (q) {
      rows = rows.filter((e) => {
        const haystack = `${e.actor || ''} ${e.action || ''} ${e.target || ''} ${e.detail || ''} ${e.ip || ''}`.toLowerCase();
        return haystack.includes(q);
      });
    }
    if (fromTs || toTs) {
      rows = rows.filter((e) => {
        const t = Date.parse(e.ts || '');
        if (isNaN(t)) return false;
        if (fromTs && t < fromTs) return false;
        if (toTs && t > toTs) return false;
        return true;
      });
    }
    // 정렬.
    const cmpStr = (a, b) => String(a || '').localeCompare(String(b || ''));
    rows = rows.slice().sort((a, b) => {
      switch (sortKey) {
        case 'ts_asc':    return cmpStr(a.ts, b.ts);
        case 'actor_asc': return cmpStr(a.actor, b.actor) || cmpStr(b.ts, a.ts);
        case 'type_asc':  return cmpStr(a.type, b.type) || cmpStr(b.ts, a.ts);
        case 'ts_desc':
        default:          return cmpStr(b.ts, a.ts);
      }
    });
    return rows;
  }, [merged, filter, search, dateFrom, dateTo, sortKey]);

  const TYPES = [
    { id: 'all', label: '전체', count: merged.length },
    { id: 'admin', label: '관리자', count: merged.filter((e) => e.type === 'admin').length },
    { id: 'signup', label: '회원가입', count: merged.filter((e) => e.type === 'signup').length },
    { id: 'grade', label: '등급', count: merged.filter((e) => e.type === 'grade').length },
    { id: 'category', label: '카테고리', count: merged.filter((e) => e.type === 'category').length },
    { id: 'content', label: '콘텐츠', count: merged.filter((e) => e.type === 'content').length },
    { id: 'alarm', label: '알람', count: merged.filter((e) => e.type === 'alarm').length },
    { id: 'post', label: '게시글', count: merged.filter((e) => e.type === 'post').length },
    { id: 'error', label: '오류', count: merged.filter((e) => e.type === 'error').length },
  ];

  const TYPE_COLOR = {
    admin: 'var(--primary-hover)',
    signup: 'var(--secondary)',
    grade: '#a855f7',
    category: '#0ea5e9',
    content: '#22c55e',
    alarm: '#f59e0b',
    post: '#94a3b8',
    error: 'var(--danger)',
  };
  const TYPE_LABEL = {
    admin: '관리자', signup: '가입', grade: '등급', category: '카테고리',
    content: '콘텐츠', alarm: '알람', post: '게시글', error: '오류',
  };

  return (
    <div>
      <AdminPanelHeader
        eyebrow="ACTIVITY · 활동 로그"
        title="통합 활동 로그"
        description="관리자 활동 + 회원 활동(가입/게시글) + 오류 보고를 시간 역순으로 통합. 트러블슈팅·운영 모니터링용. 칩으로 유형 필터."/>

      {/* 1행: 유형 필터 칩 + 새로고침 */}
      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:10}} role="tablist" aria-label="활동 유형 필터">
        {TYPES.map((t) => {
          const active = filter === t.id;
          return (
            <button key={t.id} type="button" role="tab" aria-selected={active}
              onClick={() => setFilter(t.id)}
              style={{
                padding:'5px 12px', fontSize:12,
                fontFamily:'var(--font-serif)',
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? 'var(--bg)' : 'var(--ink-2)',
                border:`1px solid ${active ? 'var(--primary)' : 'var(--line-2)'}`,
                borderRadius:999,
                cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap:6,
              }}>
              <span>{t.label}</span>
              <span className="mono" style={{fontSize:10, opacity: active ? 0.85 : 0.55}}>{t.count}</span>
            </button>
          );
        })}
        <button type="button" className="btn btn-small" onClick={() => setRefreshKey((v) => v + 1)}
          style={{marginLeft:'auto', padding:'4px 10px', fontSize:11}}>
          🔄 새로고침
        </button>
      </div>

      {/* 2행: 검색 + 기간 + 정렬 (v00.190 사용자 보고 — 모든 필터링 도구) */}
      <div style={{display:'grid', gridTemplateColumns:'minmax(220px, 1fr) auto auto auto', gap:10, marginBottom:14, alignItems:'center'}} className="activity-filter-row">
        <input
          type="text"
          className="field-input"
          placeholder="검색 (주체/액션/대상/상세/IP — 부분 일치)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="활동 로그 검색"
          style={{padding:'8px 12px', fontSize:13}}/>
        <input
          type="date"
          className="field-input"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          aria-label="시작일 (KST)"
          style={{padding:'8px 12px', fontSize:12, fontFamily:'var(--font-mono)'}}/>
        <input
          type="date"
          className="field-input"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          aria-label="종료일 (KST)"
          style={{padding:'8px 12px', fontSize:12, fontFamily:'var(--font-mono)'}}/>
        <select
          className="field-input"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          aria-label="정렬"
          style={{padding:'8px 12px', fontSize:12, fontFamily:'var(--font-mono)', minWidth:140}}>
          <option value="ts_desc">최신순 ↓</option>
          <option value="ts_asc">오래된순 ↑</option>
          <option value="actor_asc">주체 (가나다)</option>
          <option value="type_asc">유형순</option>
        </select>
      </div>
      {(search || dateFrom || dateTo) && (
        <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:10, flexWrap:'wrap'}}>
          <span className="mono dim-2" style={{fontSize:11, letterSpacing:'0.1em'}}>
            필터 적용: {filtered.length}건 (전체 {merged.length})
          </span>
          <button type="button" className="btn btn-small" onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); }}
            style={{padding:'2px 8px', fontSize:10}}>
            ✕ 필터 초기화
          </button>
        </div>
      )}

      {loading && (
        <p className="dim" style={{fontSize:13, padding:'12px 0'}}>⏳ 활동 로그 로딩 중…</p>
      )}

      {!loading && filtered.length === 0 ? (
        <AdminEmpty>해당 유형의 활동 기록이 없습니다.</AdminEmpty>
      ) : (
        <div style={{border:'1px solid var(--line)', overflow:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:840}}>
            <thead>
              <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.18em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                <th scope="col" style={{padding:12, textAlign:'left', minWidth:140}}>시간 (KST)</th>
                <th scope="col" style={{padding:12, textAlign:'left', minWidth:80}}>유형</th>
                <th scope="col" style={{padding:12, textAlign:'left', minWidth:160}}>주체</th>
                <th scope="col" style={{padding:12, textAlign:'left', minWidth:200}}>액션 / 대상</th>
                <th scope="col" style={{padding:12, textAlign:'left'}}>상세</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 500).map((e, i) => (
                <tr key={i} style={{borderBottom:'1px solid var(--line)'}}>
                  <td className="mono dim-2" style={{padding:'10px 12px', whiteSpace:'nowrap'}}>
                    {window.BGNJ_FMT?.kstShort?.(e.ts) || String(e.ts || '').slice(0, 19)}
                  </td>
                  <td style={{padding:'10px 12px'}}>
                    <span className="mono" style={{
                      fontSize:9, padding:'2px 7px',
                      letterSpacing:'0.12em', fontWeight:700,
                      border:`1px solid ${TYPE_COLOR[e.type] || 'var(--line-2)'}`,
                      color: TYPE_COLOR[e.type] || 'var(--ink-2)',
                    }}>{TYPE_LABEL[e.type] || e.type}</span>
                  </td>
                  <td className="mono" style={{padding:'10px 12px', fontSize:11, color:'var(--ink)'}}>
                    {e.actor}
                    {e.ip && <span className="dim-2" style={{marginLeft:8, fontSize:10}}>· {e.ip}</span>}
                  </td>
                  <td style={{padding:'10px 12px', fontFamily:'var(--font-mono)', fontSize:11}}>
                    <span style={{color:'var(--ink)'}}>{e.action}</span>
                    {e.target && <span className="dim-2" style={{marginLeft:8, fontSize:10}}>{e.target}</span>}
                  </td>
                  <td className="dim" style={{padding:'10px 12px', fontSize:12, lineHeight:1.5, wordBreak:'break-word', maxWidth:540}}>
                    {e.detail || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 500 && (
            <div className="dim-2 mono" style={{padding:'10px 14px', fontSize:11, textAlign:'center', borderTop:'1px solid var(--line)'}}>
              상위 500건만 표시. 더 오래된 기록은 [감사 로그] 또는 [오류 로그] 별도 패널에서 검색.
            </div>
          )}
        </div>
      )}

      <p className="dim-2" style={{fontSize:11, marginTop:12, lineHeight:1.7}}>
        ⓘ 데이터 소스: <code style={{padding:'1px 5px', background:'var(--bg-2)', border:'1px solid var(--line-2)'}}>audit_log</code>(D1 — 관리자 행동 + 회원가입) +
        <code style={{padding:'1px 5px', background:'var(--bg-2)', border:'1px solid var(--line-2)', marginLeft:6}}>error_log</code>(D1 — 오류 보고) +
        최근 게시글(BGNJ_COMMUNITY 캐시). 트러블슈팅 시 시간 역순으로 사고 발생 직전 활동을 추적.
      </p>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────

// v00.286 ESM — 모듈 export (window 노출과 병행, 점진 전환).
export { ActivityLogPanel, AuditLogPanel };

// === pages/admin/AdminShared.jsx (v00.187) ==========================
// AuthAdminPage.jsx 9057 줄 분할의 일환. self-contained UI primitives + helpers 모음.
// 분할 원칙: React 외부 의존 없는 컴포넌트/순수 함수만. 패널 비즈니스 로직은 AuthAdminPage.jsx 유지.
//
// 분량 (이전 AuthAdminPage.jsx 라인): 약 900 lines.
// 포함:
//   1) 파일 다운로드 helpers — downloadBlob / downloadCsv / downloadJson
//   2) 이미지 업로드 helper — pickImageWithR2Fallback
//   3) 차트 — MiniBarChart / RankedBarList / COHORT_OPTIONS / CohortSelector
//   4) Sankey 흐름도 — _CHANNEL_FOR_HOST / _STAGE_FOR_ROUTE / _CHANNEL_COLORS / _CHANNEL_COLOR / SankeyFlow
//   5) sub-tab + preview 래퍼 — SubTabsView
//
// 노출: 파일 끝 Object.assign(window, {...}). AuthAdminPage 가 const X = window.X 로 참조.
// 로드 순서: index.html 에서 AuthAdminPage.js 보다 먼저 (defer + 순서 보장).

// ─────────────────────────────────────────────────────────────────
// v00.182 — DRY: 파일 다운로드 공통 helper. CSV / JSON / 임의 텍스트 모두 지원.
// 이전엔 admin 패널 6곳에서 같은 8-line 패턴 (Blob → URL → a.click → revoke) 반복.
const downloadBlob = (filename, content, mime = 'text/plain;charset=utf-8') => {
  try {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('다운로드 실패: ' + (err?.message || '알 수 없는 오류'));
  }
};
const downloadCsv = (filename, csv) => downloadBlob(filename, csv, 'text/csv;charset=utf-8');
const downloadJson = (filename, obj) => downloadBlob(filename, JSON.stringify(obj, null, 2), 'application/json');

// ─────────────────────────────────────────────────────────────────
// v00.184 — DRY: 이미지 업로드 공통 helper.
// R2 업로드 시도 → 실패 시 FileReader dataURI 폴백. lecture-covers / tour-covers / book-covers / 등 4+ 패널 동일 로직.
const pickImageWithR2Fallback = async (e, { folder, maxBytes = 5 * 1024 * 1024, fallbackMaxBytes = 1.5 * 1024 * 1024 } = {}) => {
  const file = e.target.files?.[0];
  if (!file) return null;
  try {
    const { url } = await window.BGNJ_MEDIA.uploadFile(file, { folder, maxBytes });
    e.target.value = '';
    return url;
  } catch (err) {
    try { console.warn(`[upload] R2 ${folder} 업로드 실패 — dataURI 폴백:`, err); } catch {}
  }
  if (file.size > fallbackMaxBytes) {
    alert(`이미지가 너무 큽니다(${(file.size/1024/1024).toFixed(1)}MB). R2 실패 + ${(fallbackMaxBytes/1024/1024).toFixed(1)}MB 폴백 한도 초과.`);
    e.target.value = '';
    return null;
  }
  try {
    const dataUri = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    e.target.value = '';
    return dataUri;
  } catch (err) {
    alert('이미지 읽기 실패: ' + (err?.message || ''));
    e.target.value = '';
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────
// v00.173 — 사용자 보고 '모든 차트들은 호버하면 차트 내용물을 볼 수 있게'.
// 각 막대에 mouseenter/leave 로 hoveredIdx 추적 → 부동 툴팁 노출. unit/formatter prop 으로 라벨 커스터마이즈.
const MiniBarChart = ({ series, labels, height = 120, color = 'var(--gold)', label, unit = '', formatTooltip, headerRight }) => {
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const max = Math.max(1, ...series);
  const W = 100; // viewBox 단위
  const H = 40;
  const barW = W / Math.max(1, series.length);
  const fmt = formatTooltip || ((v, l) => `${l ? l + ' · ' : ''}${v}${unit}`);
  return (
    <div style={{padding:'12px 0', position:'relative'}}>
      {(label || headerRight) && (
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:8}}>
          {label && <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em'}}>{label}</div>}
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      <div style={{position:'relative'}}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{width:'100%', height, display:'block'}}>
          {series.map((v, i) => {
            const h = max > 0 ? (v / max) * (H - 6) : 0;
            const isOther = hoverIdx !== null && hoverIdx !== i;
            return (
              <g key={i}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx((c) => c === i ? null : c)}
                style={{cursor:'pointer'}}>
                <rect x={i * barW + 0.6} y={H - h}
                  width={Math.max(0.4, barW - 1.2)} height={h}
                  fill={color} rx={0.3}
                  opacity={isOther ? 0.4 : 1}
                  style={{transition:'opacity .12s'}}/>
                <rect x={i * barW} y={0} width={barW} height={H} fill="transparent"/>
                <title>{fmt(v, labels?.[i] || '')}</title>
              </g>
            );
          })}
        </svg>
        {hoverIdx !== null && series[hoverIdx] !== undefined && (
          <div style={{
            position:'absolute',
            top: -28,
            left: `${((hoverIdx + 0.5) / Math.max(1, series.length)) * 100}%`,
            transform:'translateX(-50%)',
            background:'var(--ink)', color:'var(--bg)',
            padding:'5px 10px', fontSize:11,
            fontFamily:'var(--font-mono)',
            letterSpacing:'0.04em',
            whiteSpace:'nowrap',
            pointerEvents:'none',
            borderRadius:3,
            boxShadow:'0 2px 8px rgba(0,0,0,0.25)',
            zIndex:5,
          }}>
            {fmt(series[hoverIdx], labels?.[hoverIdx] || '')}
          </div>
        )}
      </div>
      {labels && (() => {
        // v00.195 — 사용자 보고 '임의로 중간에 값들 축약하지마'. 모든 라벨 표시 의무화.
        // 14개 이하면 가로 그대로, 그 이상이면 -45° 회전 (라벨 끼리 안 겹치게 + 모두 표시).
        const rotated = labels.length > 14;
        return (
          <div style={{
            display:'grid', gridTemplateColumns:`repeat(${labels.length}, 1fr)`,
            fontSize:9, color:'var(--ink-3)',
            marginTop: rotated ? 10 : 6,
            fontFamily:'var(--font-mono)', letterSpacing:'0.04em',
            minHeight: rotated ? 36 : 'auto',
            overflow: 'visible',
          }}>
            {labels.map((l, i) => (
              <span key={i} style={{
                textAlign: rotated ? 'right' : 'center',
                ...(rotated ? {
                  transform:'rotate(-45deg)',
                  transformOrigin:'top right',
                  whiteSpace:'nowrap',
                  paddingRight: 8,
                } : {}),
              }}>{l}</span>
            ))}
          </div>
        );
      })()}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// v00.179 — 랭킹 가로 막대 리스트 공통 컴포넌트 (DRY). 호버 시 다른 항목 dim.
// items: [{ label, count, sub?, color? }]. unit: 단위 (예: '회'). headerLeft / headerRight: 헤더 슬롯.
const RankedBarList = ({ items = [], unit = '', headerLeft, headerRight, emptyText = '데이터 없음', maxItems = 10, valueFormat }) => {
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const visible = items.slice(0, maxItems);
  const total = visible.reduce((s, it) => s + (Number(it.count) || 0), 0) || 1;
  const fmt = valueFormat || ((c) => `${c}${unit}`);
  return (
    <article className="card" style={{marginBottom:24}}>
      {(headerLeft || headerRight) && (
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:8}}>
          <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em'}}>{headerLeft}</div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      {visible.length === 0 ? (
        <p className="dim" style={{fontSize:13}}>{emptyText}</p>
      ) : (
        <div style={{display:'grid', gap:8}}>
          {visible.map((it, i) => {
            const pct = Math.round(((Number(it.count) || 0) / total) * 100);
            const isHov = hoverIdx === i;
            const isOther = hoverIdx !== null && hoverIdx !== i;
            return (
              <div key={it.id || it.label || i}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx((c) => c === i ? null : c)}
                style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'4px 6px',
                  background: isHov ? 'rgba(245,213,72,0.06)' : 'transparent',
                  opacity: isOther ? 0.4 : 1,
                  transition:'opacity .12s, background .12s',
                  cursor:'default',
                }}
                title={`${it.label || ''} · ${fmt(it.count)} · ${pct}%`}>
                <span style={{
                  minWidth: 28, textAlign:'right',
                  fontFamily:'var(--font-mono)', fontSize:11,
                  color:'var(--ink-3)', fontWeight:700,
                }}>#{i+1}</span>
                <div style={{
                  minWidth: 180, fontSize: 13, color:'var(--ink)',
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  flex:'0 1 240px',
                }}>{it.label}</div>
                <div style={{flex:1, height:8, background:'var(--bg-2)', overflow:'hidden', position:'relative'}}>
                  <div style={{
                    position:'absolute', left:0, top:0, bottom:0,
                    width:`${pct}%`, background: it.color || 'var(--gold)',
                    transition:'width .12s',
                  }}/>
                </div>
                <div className="mono" style={{
                  minWidth: 90, textAlign:'right', fontSize:12,
                  color: isHov ? 'var(--ink)' : 'var(--gold-2)', fontWeight:600,
                }}>{pct}% ({fmt(it.count)})</div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
};

// ─────────────────────────────────────────────────────────────────
// v00.173/176 — 차트 코호트 (기간) 선택 공통 UI.
const COHORT_OPTIONS = [
  { value: 1,  label: '1일' },
  { value: 7,  label: '7일' },
  { value: 14, label: '14일' },
  { value: 30, label: '30일' },
  { value: 90, label: '90일' },
];
const CohortSelector = ({ value, onChange, options = COHORT_OPTIONS }) => (
  <div role="tablist" aria-label="기간 선택" style={{display:'inline-flex', gap:0, border:'1px solid var(--line-2)', borderRadius:0}}>
    {options.map((opt, i) => (
      <button key={opt.value} type="button" role="tab"
        aria-selected={value === opt.value}
        onClick={() => onChange(opt.value)}
        style={{
          padding:'4px 10px',
          fontSize:11, fontFamily:'var(--font-mono)',
          fontWeight: value === opt.value ? 800 : 500,
          letterSpacing:'0.06em',
          border:'none',
          borderLeft: i === 0 ? 'none' : '1px solid var(--line-2)',
          background: value === opt.value ? 'rgba(245,213,72,0.14)' : 'var(--bg)',
          color: value === opt.value ? 'var(--ink)' : 'var(--ink-2)',
          cursor:'pointer',
        }}>{opt.label}</button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// v00.174 — Sankey Flow Chart 헬퍼 + 컴포넌트.
const _CHANNEL_FOR_HOST = (host) => {
  const h = String(host || '').toLowerCase();
  if (!h || h === '직접 방문') return '직접 방문';
  if (/facebook|fb\./.test(h)) return '페이스북';
  if (/instagram/.test(h)) return '인스타그램';
  if (/google|gstatic|gws/.test(h)) return '구글';
  if (/naver/.test(h)) return '네이버';
  if (/youtube|youtu\.be/.test(h)) return '유튜브';
  if (/twitter|t\.co|x\.com/.test(h)) return '트위터/X';
  if (/threads/.test(h)) return '스레드';
  if (/kakao/.test(h)) return '카카오';
  if (/bgnj\.net|bgnj-/.test(h)) return '내부 이동';
  return host;
};
const _STAGE_FOR_ROUTE = (route) => {
  const r = String(route || '').toLowerCase();
  if (r === '/' || r === '/home' || r === '') return 'Awareness';
  if (/^\/(column|book|faq|terms|privacy|eat|sleep|shop)/.test(r)) return 'Interest';
  if (/^\/(tour|lectures|signup|login|checkout|community|mypage|admin)/.test(r)) return 'Consideration';
  return 'Interest';
};
const _CHANNEL_COLORS = {
  '페이스북': '#3b82f6',
  '인스타그램': '#ec4899',
  '구글': '#10b981',
  '네이버': '#22c55e',
  '유튜브': '#ef4444',
  '카카오': '#f59e0b',
  '트위터/X': '#0ea5e9',
  '스레드': '#a855f7',
  '내부 이동': '#94a3b8',
  '직접 방문': '#64748b',
};
const _CHANNEL_COLOR = (name) => _CHANNEL_COLORS[name] || 'var(--gold)';

const SankeyFlow = ({ pairs, days, onDaysChange }) => {
  const [hover, setHover] = React.useState(null);

  const rows = React.useMemo(() => (pairs || []).map((p) => ({
    ...p,
    channel: _CHANNEL_FOR_HOST(p.referrer || '직접 방문'),
    stage: _STAGE_FOR_ROUTE(p.route),
  })), [pairs]);

  const channelSums = React.useMemo(() => {
    const m = new Map();
    rows.forEach((r) => m.set(r.channel, (m.get(r.channel) || 0) + r.count));
    return Array.from(m.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [rows]);

  const stageOrder = ['Awareness', 'Interest', 'Consideration'];
  const stageSums = React.useMemo(() => {
    const m = new Map();
    rows.forEach((r) => m.set(r.stage, (m.get(r.stage) || 0) + r.count));
    return stageOrder.map((s) => ({ name: s, count: m.get(s) || 0 })).filter((s) => s.count > 0);
  }, [rows]);

  const routeSums = React.useMemo(() => {
    const m = new Map();
    rows.forEach((r) => m.set(r.route, (m.get(r.route) || 0) + r.count));
    return Array.from(m.entries()).map(([route, count]) => ({ name: route, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [rows]);
  const routeSet = React.useMemo(() => new Set(routeSums.map((r) => r.name)), [routeSums]);

  const linksA = React.useMemo(() => {
    const m = new Map();
    rows.forEach((r) => {
      if (!routeSet.has(r.route)) return;
      const k = `${r.channel}|${r.stage}`;
      m.set(k, (m.get(k) || 0) + r.count);
    });
    return Array.from(m.entries()).map(([k, count]) => {
      const [channel, stage] = k.split('|');
      return { channel, stage, count };
    });
  }, [rows, routeSet]);

  const linksB = React.useMemo(() => {
    const m = new Map();
    rows.forEach((r) => {
      if (!routeSet.has(r.route)) return;
      const k = `${r.stage}|${r.route}`;
      m.set(k, (m.get(k) || 0) + r.count);
    });
    return Array.from(m.entries()).map(([k, count]) => {
      const [stage, route] = k.split('|');
      return { stage, route, count };
    });
  }, [rows, routeSet]);

  const W = 1000;
  const NODE_W = 14;
  const COL_X = [80, 480, 880];
  const TOP_PAD = 30;
  const BOT_PAD = 20;
  const NODE_GAP = 8;

  const colTotal = (arr) => arr.reduce((s, n) => s + n.count, 0);
  const totalCh = Math.max(1, colTotal(channelSums));
  const totalSt = Math.max(1, colTotal(stageSums));
  const totalRt = Math.max(1, colTotal(routeSums));
  const maxNodesInCol = Math.max(channelSums.length, stageSums.length, routeSums.length);
  const colSums = [totalCh, totalSt, totalRt];
  const maxTotal = Math.max(...colSums);
  const HEIGHT = Math.min(720, Math.max(320, maxNodesInCol * 36 + maxTotal / 2));
  const usableH = HEIGHT - TOP_PAD - BOT_PAD - (maxNodesInCol - 1) * NODE_GAP;
  const scale = usableH / maxTotal;

  const layout = (arr) => {
    const result = new Map();
    let y = TOP_PAD;
    arr.forEach((n) => {
      const h = Math.max(2, n.count * scale);
      result.set(n.name, { y, h, count: n.count });
      y += h + NODE_GAP;
    });
    return result;
  };
  const chPos = layout(channelSums);
  const stPos = layout(stageSums);
  const rtPos = layout(routeSums);

  const chOffset = new Map();
  const stOffsetIn = new Map();
  const stOffsetOut = new Map();
  const rtOffset = new Map();

  const sortedA = linksA.slice().sort((a, b) => {
    const ay = chPos.get(a.channel)?.y ?? 0;
    const by = chPos.get(b.channel)?.y ?? 0;
    if (ay !== by) return ay - by;
    return b.count - a.count;
  });
  const ribbonsA = sortedA.map((lk) => {
    const ch = chPos.get(lk.channel);
    const st = stPos.get(lk.stage);
    if (!ch || !st) return null;
    const t = lk.count * scale;
    const offCh = chOffset.get(lk.channel) || 0;
    const offSt = stOffsetIn.get(lk.stage) || 0;
    const y1 = ch.y + offCh + t / 2;
    const y2 = st.y + offSt + t / 2;
    chOffset.set(lk.channel, offCh + t);
    stOffsetIn.set(lk.stage, offSt + t);
    return { ...lk, y1, y2, t };
  }).filter(Boolean);

  const sortedB = linksB.slice().sort((a, b) => {
    const ay = stPos.get(a.stage)?.y ?? 0;
    const by = stPos.get(b.stage)?.y ?? 0;
    if (ay !== by) return ay - by;
    return b.count - a.count;
  });
  const ribbonsB = sortedB.map((lk) => {
    const st = stPos.get(lk.stage);
    const rt = rtPos.get(lk.route);
    if (!st || !rt) return null;
    const t = lk.count * scale;
    const offSt = stOffsetOut.get(lk.stage) || 0;
    const offRt = rtOffset.get(lk.route) || 0;
    const y1 = st.y + offSt + t / 2;
    const y2 = rt.y + offRt + t / 2;
    stOffsetOut.set(lk.stage, offSt + t);
    rtOffset.set(lk.route, offRt + t);
    return { ...lk, y1, y2, t };
  }).filter(Boolean);

  if (channelSums.length === 0) {
    return (
      <div className="card" style={{padding:24}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:8}}>
          <div>
            <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:4}}>JOURNEY · 고객 여정 흐름</div>
            <h2 className="ko-serif" style={{fontSize:18, margin:0}}>유입 채널 → 단계 → 대표 도착 페이지</h2>
          </div>
          <CohortSelector value={days} onChange={onDaysChange}/>
        </div>
        <p className="dim" style={{fontSize:13, lineHeight:1.7}}>
          최근 {days}일간 측정된 페이지뷰가 없습니다. 사용자 방문이 누적되거나 코호트를 늘리면 표시됩니다.
        </p>
      </div>
    );
  }

  const cubicPath = (x1, y1, x2, y2, t) => {
    const cx1 = (x1 + x2) / 2;
    const cx2 = (x1 + x2) / 2;
    return [
      `M ${x1} ${y1 - t/2}`,
      `C ${cx1} ${y1 - t/2}, ${cx2} ${y2 - t/2}, ${x2} ${y2 - t/2}`,
      `L ${x2} ${y2 + t/2}`,
      `C ${cx2} ${y2 + t/2}, ${cx1} ${y1 + t/2}, ${x1} ${y1 + t/2}`,
      'Z',
    ].join(' ');
  };

  const channelLinked = (chName) => {
    const stages = new Set(linksA.filter((l) => l.channel === chName).map((l) => l.stage));
    const routes = new Set(linksB.filter((l) => stages.has(l.stage)).map((l) => l.route));
    return { stages, routes };
  };
  const routeLinked = (rtName) => {
    const stages = new Set(linksB.filter((l) => l.route === rtName).map((l) => l.stage));
    const channels = new Set(linksA.filter((l) => stages.has(l.stage)).map((l) => l.channel));
    return { stages, channels };
  };
  const stageLinked = (stName) => {
    const channels = new Set(linksA.filter((l) => l.stage === stName).map((l) => l.channel));
    const routes = new Set(linksB.filter((l) => l.stage === stName).map((l) => l.route));
    return { channels, routes };
  };

  const dim = (kind, key) => {
    if (!hover) return false;
    if (hover.type === 'channel') {
      const { stages, routes } = channelLinked(hover.key);
      if (kind === 'channel') return key !== hover.key;
      if (kind === 'stage') return !stages.has(key);
      if (kind === 'route') return !routes.has(key);
      if (kind === 'linkA') return key.channel !== hover.key;
      if (kind === 'linkB') return !stages.has(key.stage);
    } else if (hover.type === 'stage') {
      const { channels, routes } = stageLinked(hover.key);
      if (kind === 'channel') return !channels.has(key);
      if (kind === 'stage') return key !== hover.key;
      if (kind === 'route') return !routes.has(key);
      if (kind === 'linkA') return key.stage !== hover.key;
      if (kind === 'linkB') return key.stage !== hover.key;
    } else if (hover.type === 'route') {
      const { stages, channels } = routeLinked(hover.key);
      if (kind === 'channel') return !channels.has(key);
      if (kind === 'stage') return !stages.has(key);
      if (kind === 'route') return key !== hover.key;
      if (kind === 'linkA') return !stages.has(key.stage);
      if (kind === 'linkB') return key.route !== hover.key;
    }
    return false;
  };

  const truncate = (s, n) => (String(s || '').length > n ? String(s).slice(0, n - 1) + '…' : String(s || ''));

  return (
    <div className="card" style={{padding:24, marginBottom:18}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14, flexWrap:'wrap', gap:8}}>
        <div>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:4}}>JOURNEY · 고객 여정 흐름</div>
          <h2 className="ko-serif" style={{fontSize:18, margin:0}}>유입 채널 → 단계 → 대표 도착 페이지</h2>
          <p className="dim-2" style={{fontSize:11, marginTop:6, lineHeight:1.6}}>
            노드 또는 곡선에 호버하면 연결된 흐름이 강조됩니다. 위쪽 [기간] 으로 코호트 변경.
          </p>
        </div>
        <CohortSelector value={days} onChange={onDaysChange}/>
      </div>
      <div style={{position:'relative', overflow:'auto'}}>
        <svg viewBox={`0 0 ${W} ${HEIGHT}`} style={{width:'100%', minWidth:720, height:HEIGHT, display:'block'}}>
          <text x={COL_X[0] + NODE_W / 2} y={16} textAnchor="middle" fill="var(--ink-3)"
            fontSize={11} fontFamily="var(--font-mono)" letterSpacing="0.2em">유입 채널</text>
          <text x={COL_X[1] + NODE_W / 2} y={16} textAnchor="middle" fill="var(--ink-3)"
            fontSize={11} fontFamily="var(--font-mono)" letterSpacing="0.2em">단계</text>
          <text x={COL_X[2] + NODE_W / 2} y={16} textAnchor="middle" fill="var(--ink-3)"
            fontSize={11} fontFamily="var(--font-mono)" letterSpacing="0.2em">도착 페이지</text>

          {ribbonsA.map((lk, i) => {
            const x1 = COL_X[0] + NODE_W;
            const x2 = COL_X[1];
            const faded = dim('linkA', lk);
            return (
              <path key={`A${i}`}
                d={cubicPath(x1, lk.y1, x2, lk.y2, lk.t)}
                fill={_CHANNEL_COLOR(lk.channel)}
                opacity={faded ? 0.06 : 0.32}
                style={{cursor:'pointer', transition:'opacity .12s'}}
                onMouseEnter={() => setHover({ type: 'linkA', key: lk })}
                onMouseLeave={() => setHover(null)}>
                <title>{`${lk.channel} → ${lk.stage}: ${lk.count}회`}</title>
              </path>
            );
          })}
          {ribbonsB.map((lk, i) => {
            const x1 = COL_X[1] + NODE_W;
            const x2 = COL_X[2];
            const faded = dim('linkB', lk);
            const stageColor = lk.stage === 'Awareness' ? '#fb923c'
              : lk.stage === 'Interest' ? '#22c55e'
              : '#ef4444';
            return (
              <path key={`B${i}`}
                d={cubicPath(x1, lk.y1, x2, lk.y2, lk.t)}
                fill={stageColor}
                opacity={faded ? 0.06 : 0.28}
                style={{cursor:'pointer', transition:'opacity .12s'}}
                onMouseEnter={() => setHover({ type: 'linkB', key: lk })}
                onMouseLeave={() => setHover(null)}>
                <title>{`${lk.stage} → ${lk.route}: ${lk.count}회`}</title>
              </path>
            );
          })}

          {channelSums.map((n) => {
            const p = chPos.get(n.name);
            const faded = dim('channel', n.name);
            return (
              <g key={`ch-${n.name}`}
                onMouseEnter={() => setHover({ type: 'channel', key: n.name })}
                onMouseLeave={() => setHover(null)}
                style={{cursor:'pointer', opacity: faded ? 0.35 : 1, transition:'opacity .12s'}}>
                <rect x={COL_X[0]} y={p.y} width={NODE_W} height={p.h} fill={_CHANNEL_COLOR(n.name)} rx={1}/>
                <text x={COL_X[0] - 8} y={p.y + p.h / 2} textAnchor="end" dominantBaseline="middle"
                  fontSize={12} fill="var(--ink)" fontFamily="var(--font-sans)">
                  {truncate(n.name, 14)}
                </text>
                <text x={COL_X[0] - 8} y={p.y + p.h / 2 + 14} textAnchor="end" dominantBaseline="middle"
                  fontSize={10} fill="var(--ink-3)" fontFamily="var(--font-mono)">
                  {n.count}
                </text>
                <title>{`${n.name}: ${n.count}회`}</title>
              </g>
            );
          })}

          {stageSums.map((n) => {
            const p = stPos.get(n.name);
            const faded = dim('stage', n.name);
            const stColor = n.name === 'Awareness' ? '#fb923c' : n.name === 'Interest' ? '#22c55e' : '#ef4444';
            return (
              <g key={`st-${n.name}`}
                onMouseEnter={() => setHover({ type: 'stage', key: n.name })}
                onMouseLeave={() => setHover(null)}
                style={{cursor:'pointer', opacity: faded ? 0.35 : 1, transition:'opacity .12s'}}>
                <rect x={COL_X[1]} y={p.y} width={NODE_W} height={p.h} fill={stColor} rx={1}/>
                <text x={COL_X[1] + NODE_W + 8} y={p.y + p.h / 2} textAnchor="start" dominantBaseline="middle"
                  fontSize={12} fill="var(--ink)" fontFamily="var(--font-sans)">
                  {n.name}
                </text>
                <text x={COL_X[1] + NODE_W + 8} y={p.y + p.h / 2 + 14} textAnchor="start" dominantBaseline="middle"
                  fontSize={10} fill="var(--ink-3)" fontFamily="var(--font-mono)">
                  {n.count}
                </text>
                <title>{`${n.name}: ${n.count}회`}</title>
              </g>
            );
          })}

          {routeSums.map((n) => {
            const p = rtPos.get(n.name);
            const faded = dim('route', n.name);
            const rtColor = _STAGE_FOR_ROUTE(n.name) === 'Awareness' ? '#fb923c'
              : _STAGE_FOR_ROUTE(n.name) === 'Interest' ? '#22c55e' : '#ef4444';
            return (
              <g key={`rt-${n.name}`}
                onMouseEnter={() => setHover({ type: 'route', key: n.name })}
                onMouseLeave={() => setHover(null)}
                style={{cursor:'pointer', opacity: faded ? 0.35 : 1, transition:'opacity .12s'}}>
                <rect x={COL_X[2]} y={p.y} width={NODE_W} height={p.h} fill={rtColor} rx={1}/>
                <text x={COL_X[2] + NODE_W + 8} y={p.y + p.h / 2} textAnchor="start" dominantBaseline="middle"
                  fontSize={12} fill="var(--ink)" fontFamily="var(--font-sans)">
                  {truncate(n.name, 28)}
                </text>
                <text x={COL_X[2] + NODE_W + 8} y={p.y + p.h / 2 + 14} textAnchor="start" dominantBaseline="middle"
                  fontSize={10} fill="var(--ink-3)" fontFamily="var(--font-mono)">
                  {n.count}
                </text>
                <title>{`${n.name}: ${n.count}회`}</title>
              </g>
            );
          })}
        </svg>
        {hover && (
          <div style={{
            position:'absolute', top: 8, right: 8,
            background:'var(--ink)', color:'var(--bg)',
            padding:'8px 12px', fontSize:12, fontFamily:'var(--font-mono)',
            letterSpacing:'0.04em', borderRadius:3, zIndex:5,
            boxShadow:'0 4px 12px rgba(0,0,0,0.3)', pointerEvents:'none',
          }}>
            {hover.type === 'channel' && `채널: ${hover.key} · ${chPos.get(hover.key)?.count || 0}회`}
            {hover.type === 'stage' && `단계: ${hover.key} · ${stPos.get(hover.key)?.count || 0}회`}
            {hover.type === 'route' && `페이지: ${hover.key} · ${rtPos.get(hover.key)?.count || 0}회`}
            {hover.type === 'linkA' && `${hover.key.channel} → ${hover.key.stage} · ${hover.key.count}회`}
            {hover.type === 'linkB' && `${hover.key.stage} → ${hover.key.route} · ${hover.key.count}회`}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// v00.166/167/176 — 사이드바 항목 머지용 sub-tab 래퍼 + 라이브 미리보기 iframe.
const SubTabsView = ({ subTabs, defaultKey, storageKey }) => {
  const [active, setActive] = React.useState(() => {
    if (storageKey) {
      try { const v = localStorage.getItem(storageKey); if (v && subTabs.some((t) => t.key === v)) return v; } catch {}
    }
    return defaultKey || (subTabs[0] && subTabs[0].key);
  });
  React.useEffect(() => {
    if (storageKey) try { localStorage.setItem(storageKey, active); } catch {}
  }, [active, storageKey]);

  const [previewMode, setPreviewMode] = React.useState(() => {
    if (storageKey) {
      try { const v = localStorage.getItem(storageKey + '_pmode'); if (v && ['desktop','tablet','mobile'].includes(v)) return v; } catch {}
    }
    return 'desktop';
  });
  React.useEffect(() => {
    if (storageKey) try { localStorage.setItem(storageKey + '_pmode', previewMode); } catch {}
  }, [previewMode, storageKey]);
  const [reloadTick, setReloadTick] = React.useState(0);
  React.useEffect(() => {
    const events = [
      'bgnj-site-content-refresh',
      'bgnj-legal-refresh',
      'bgnj-faqs-refresh',
      'bgnj-bank-accounts-refresh',
    ];
    const handler = () => setReloadTick((v) => v + 1);
    events.forEach((e) => window.addEventListener(e, handler));
    return () => events.forEach((e) => window.removeEventListener(e, handler));
  }, []);

  const Active = subTabs.find((t) => t.key === active);
  const previewUrl = Active && Active.previewUrl;
  const VIEWPORTS = { desktop: 1180, tablet: 760, mobile: 380 };
  const previewW = VIEWPORTS[previewMode] || 1180;

  return (
    <>
      {previewUrl && (
        <section style={{marginBottom:24, paddingBottom:18, borderBottom:'1px solid var(--line)'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, flexWrap:'wrap', gap:8}}>
            <h3 className="ko-serif" style={{fontSize:16, margin:0, fontWeight:700}}>
              실시간 미리보기
              <span className="mono dim-2" style={{fontSize:11, marginLeft:10, fontWeight:500, letterSpacing:'0.12em'}}>{previewUrl}</span>
            </h3>
            <div style={{display:'flex', gap:6}}>
              {[['desktop','PC'],['tablet','태블릿'],['mobile','모바일']].map(([k,l]) => (
                <button key={k} type="button" onClick={() => setPreviewMode(k)}
                  style={{
                    padding:'5px 12px', fontSize:12, fontFamily:'var(--font-mono)',
                    fontWeight: previewMode === k ? 800 : 500,
                    letterSpacing:'0.04em',
                    border:'1px solid ' + (previewMode === k ? 'var(--primary)' : 'var(--line-2)'),
                    background: previewMode === k ? 'rgba(245,213,72,0.12)' : 'var(--bg)',
                    color: previewMode === k ? 'var(--ink)' : 'var(--ink-2)',
                    cursor:'pointer',
                  }}>{l}</button>
              ))}
              <button type="button" onClick={() => setReloadTick((v) => v + 1)} aria-label="미리보기 새로고침"
                title="미리보기 새로고침"
                style={{
                  padding:'5px 12px', fontSize:14, fontFamily:'var(--font-mono)',
                  border:'1px solid var(--line-2)', background:'var(--bg)',
                  color:'var(--ink-2)', cursor:'pointer',
                }}>↻</button>
            </div>
          </div>
          <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.12em', marginBottom:10}}>
            {previewMode.toUpperCase()} · {previewW}px
          </div>
          {/* v00.191 — 사용자 보고 'PC 미리보기 가로 최대 비율로'. desktop 모드는 컨테이너 100% 폭 (모바일/태블릿은 viewport 폭 고정). */}
          <div style={{overflow:'auto', background:'var(--bg)', border:'1px solid var(--line)', maxHeight:'70vh'}}>
            <iframe key={reloadTick} src={previewUrl}
              title={`미리보기 — ${Active.label}`}
              style={{
                width: previewMode === 'desktop' ? '100%' : (previewW + 'px'),
                minWidth: previewMode === 'desktop' ? '100%' : (previewW + 'px'),
                height: previewMode === 'desktop' ? '70vh' : '600px',
                border:'0', display:'block',
                background:'var(--bg)',
              }}/>
          </div>
          <p className="dim" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
            아래 서브 탭에서 편집 후 [💾 저장] 클릭 시 자동 새로고침. 즉시 확인은 <span className="mono">↻</span> 클릭.
          </p>
        </section>
      )}
      <div role="tablist" style={{
        borderBottom:'1px solid var(--line)', marginBottom:24,
        display:'flex', gap:0, flexWrap:'wrap',
      }}>
        {subTabs.map((t) => (
          <button key={t.key} type="button" role="tab"
            onClick={() => setActive(t.key)}
            aria-selected={active === t.key}
            style={{
              padding:'10px 18px',
              fontSize:14,
              fontWeight: active === t.key ? 700 : 500,
              color: active === t.key ? 'var(--secondary)' : 'var(--ink-2)',
              background:'transparent',
              borderTop:'none', borderRight:'none', borderLeft:'none',
              borderBottom: active === t.key ? '2px solid var(--primary)' : '2px solid transparent',
              cursor:'pointer',
              letterSpacing:'0.01em',
              transition:'color .15s, border-color .15s',
            }}>{t.label}</button>
        ))}
      </div>
      {Active && Active.render()}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────
// v00.194 — 사용자 요청 '대시보드에 접속 시간에 따른 히트맵'.
// 24h × 7요일 그리드. 각 셀은 max 대비 alpha 그라데이션 + hover tooltip.
// data: [{ dow: 0~6 (0=일), hour: 0~23, views, uniq }]
const _DOW_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const HeatmapGrid = ({ data, label, headerRight, days = 30 }) => {
  const [hover, setHover] = React.useState(null); // {dow, hour, views, uniq, x, y}
  // 7×24 grid 구축.
  const grid = React.useMemo(() => {
    const g = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => ({ views: 0, uniq: 0 })));
    (Array.isArray(data) ? data : []).forEach((d) => {
      const dow = Number(d.dow); const h = Number(d.hour);
      if (dow >= 0 && dow < 7 && h >= 0 && h < 24) {
        g[dow][h] = { views: Number(d.views) || 0, uniq: Number(d.uniq) || 0 };
      }
    });
    return g;
  }, [data]);
  const max = React.useMemo(() => {
    let m = 0;
    grid.forEach((row) => row.forEach((c) => { if (c.views > m) m = c.views; }));
    return m;
  }, [grid]);

  const cellColor = (v) => {
    if (max <= 0 || v <= 0) return 'rgba(255,255,255,0.02)';
    const alpha = Math.max(0.08, Math.min(0.95, v / max));
    return `rgba(245,213,72,${alpha.toFixed(3)})`;
  };

  return (
    <article className="card" style={{ position:'relative' }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, gap:8, flexWrap:'wrap'}}>
        <h3 className="ko-serif" style={{fontSize:14, margin:0, fontWeight:700}}>
          {label || `🗓 접속 시간 히트맵 (최근 ${days}일 · KST)`}
        </h3>
        {headerRight}
      </div>
      <div style={{overflowX:'auto'}}>
        <div style={{
          display:'grid',
          gridTemplateColumns:'auto repeat(24, minmax(18px, 1fr))',
          gridAutoRows:'18px',
          gap:2,
          minWidth:560,
        }}>
          {/* 헤더 행 — 시간 라벨 */}
          <div/>
          {Array.from({ length: 24 }, (_, h) => (
            <div key={`h-${h}`} className="mono dim-2"
              style={{fontSize:9, textAlign:'center', letterSpacing:'0.04em', lineHeight:'18px'}}>
              {h % 3 === 0 ? `${h}` : ''}
            </div>
          ))}
          {/* 7행 × 24열 */}
          {grid.map((row, dow) => (
            <React.Fragment key={`r-${dow}`}>
              <div className="mono dim-2" style={{fontSize:10, lineHeight:'18px', paddingRight:6, textAlign:'right'}}>
                {_DOW_LABELS[dow]}
              </div>
              {row.map((cell, hour) => (
                <div key={`c-${dow}-${hour}`}
                  onMouseEnter={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setHover({ dow, hour, views: cell.views, uniq: cell.uniq, x: r.left + r.width / 2, y: r.top });
                  }}
                  onMouseLeave={() => setHover(null)}
                  role="img"
                  aria-label={`${_DOW_LABELS[dow]}요일 ${hour}시: 페이지뷰 ${cell.views}회, 세션 ${cell.uniq}건`}
                  style={{
                    background: cellColor(cell.views),
                    border:'1px solid var(--line)',
                    cursor: cell.views > 0 ? 'pointer' : 'default',
                  }}/>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* 범례 */}
      <div style={{display:'flex', alignItems:'center', gap:10, marginTop:12, fontSize:10}} className="dim-2 mono">
        <span>적음</span>
        {[0.1, 0.25, 0.5, 0.75, 1].map((a) => (
          <span key={a} style={{
            display:'inline-block', width:14, height:14,
            background:`rgba(245,213,72,${a})`, border:'1px solid var(--line)',
          }}/>
        ))}
        <span>많음</span>
        <span style={{flex:1}}/>
        <span>최대 {max} views/cell</span>
      </div>
      {/* tooltip */}
      {hover && (
        <div style={{
          position:'fixed', left: hover.x, top: hover.y - 8,
          transform:'translate(-50%, -100%)',
          background:'var(--bg-2, #1a1a1a)', color:'var(--ink)',
          border:'1px solid var(--line-2)', padding:'6px 10px',
          fontSize:11, fontFamily:'var(--font-mono)',
          pointerEvents:'none', zIndex:1000, whiteSpace:'nowrap',
        }}>
          {_DOW_LABELS[hover.dow]} {String(hover.hour).padStart(2,'0')}:00 · {hover.views} views · {hover.uniq} sessions
        </div>
      )}
    </article>
  );
};

// ─────────────────────────────────────────────────────────────────
// 노출 — AuthAdminPage 가 const X = window.X 로 참조.
Object.assign(window, {
  downloadBlob, downloadCsv, downloadJson,
  pickImageWithR2Fallback,
  MiniBarChart, RankedBarList, COHORT_OPTIONS, CohortSelector,
  SankeyFlow, SubTabsView,
  HeatmapGrid,
});

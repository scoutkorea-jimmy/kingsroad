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
    window.BGNJ_TOAST.error('다운로드 실패: ' + (err?.message || '알 수 없는 오류'));
  }
};
const downloadCsv = (filename, csv) => downloadBlob(filename, csv, 'text/csv;charset=utf-8');
const downloadJson = (filename, obj) => downloadBlob(filename, JSON.stringify(obj, null, 2), 'application/json');

// ─────────────────────────────────────────────────────────────────
// v00.184 — DRY: 이미지 업로드 공통 helper.
// R2 업로드 시도 → 실패 시 FileReader dataURI 폴백. lecture-covers / tour-covers / book-covers / 등 4+ 패널 동일 로직.
const pickImageWithR2Fallback = async (e, { folder, maxBytes = 5 * 1024 * 1024, fallbackMaxBytes = 1.5 * 1024 * 1024 } = {}) => {
  const raw = e.target.files?.[0];
  if (!raw) return null;
  // v00.295.004 — 큰 사진은 올리기 전에 줄일지 물어본다.
  //   2026-08-20 에 6.0MB 커버가 5MB 한도에 걸려 5번 연속 실패했다. 그때는 방법이 없었다.
  //   null 이면 한도를 넘는데 원본을 고집한 경우 — 사용자에겐 이미 안내가 갔다.
  const file = await window.BGNJ_IMAGE_SHRINK.maybeShrinkOne(raw, { limitBytes: maxBytes });
  if (!file) { e.target.value = ''; return null; }
  try {
    const { url } = await window.BGNJ_MEDIA.uploadFile(file, { folder, maxBytes });
    e.target.value = '';
    return url;
  } catch (err) {
    try { console.warn(`[upload] R2 ${folder} 업로드 실패 — dataURI 폴백:`, err); } catch (_e) { console.warn('[bgnj] AdminShared.jsx:48 오류(무시하고 진행)', _e); }
  }
  if (file.size > fallbackMaxBytes) {
    window.BGNJ_TOAST.error(`이미지가 너무 큽니다(${(file.size/1024/1024).toFixed(1)}MB). R2 실패 + ${(fallbackMaxBytes/1024/1024).toFixed(1)}MB 폴백 한도 초과.`);
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
    window.BGNJ_TOAST.error('이미지 읽기 실패: ' + (err?.message || ''));
    e.target.value = '';
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────
// v00.173 — 사용자 보고 '모든 차트들은 호버하면 차트 내용물을 볼 수 있게'.
// 각 막대에 mouseenter/leave 로 hoveredIdx 추적 → 부동 툴팁 노출. unit/formatter prop 으로 라벨 커스터마이즈.
const MiniBarChart = ({ series, labels, height = 120, color = 'var(--primary)', label, unit = '', formatTooltip, headerRight }) => {
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
                    width:`${pct}%`, background: it.color || 'var(--primary)',
                    transition:'width .12s',
                  }}/>
                </div>
                <div className="mono" style={{
                  minWidth: 90, textAlign:'right', fontSize:12,
                  color: isHov ? 'var(--ink)' : 'var(--primary-hover)', fontWeight:600,
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
const _CHANNEL_COLOR = (name) => _CHANNEL_COLORS[name] || 'var(--primary)';

const SankeyFlow = ({ pairs, days, onDaysChange }) => {
  const [hover, setHover] = React.useState(null);

  const rows = React.useMemo(() => (Array.isArray(pairs) ? pairs : []).map((p) => ({
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
      try { const v = localStorage.getItem(storageKey); if (v && subTabs.some((t) => t.key === v)) return v; } catch (_e) { console.warn('[bgnj] 저장소 읽기 — 실패 시 기본값 (AdminShared.jsx:652)', _e); }
    }
    return defaultKey || (subTabs[0] && subTabs[0].key);
  });
  React.useEffect(() => {
    if (storageKey) try { localStorage.setItem(storageKey, active); } catch (_e) { console.warn('[bgnj] AdminShared.jsx:657 오류(무시하고 진행)', _e); }
  }, [active, storageKey]);

  const [previewMode, setPreviewMode] = React.useState(() => {
    if (storageKey) {
      try { const v = localStorage.getItem(storageKey + '_pmode'); if (v && ['desktop','tablet','mobile'].includes(v)) return v; } catch (_e) { console.warn('[bgnj] 저장소 읽기 — 실패 시 기본값 (AdminShared.jsx:662)', _e); }
    }
    return 'desktop';
  });
  React.useEffect(() => {
    if (storageKey) try { localStorage.setItem(storageKey + '_pmode', previewMode); } catch (_e) { console.warn('[bgnj] AdminShared.jsx:667 오류(무시하고 진행)', _e); }
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
// Admin UI primitives (v00.285 — AuthAdminPage 에서 이동). 모든 panel 에서 재사용.
// 자기완결적(React + CSS 클래스 + 그룹 내부 참조만). AuthAdminPage 는 const X = window.X 로 받는다.

const AdminPanelHeader = ({ eyebrow, title, description, actions }) => (
  <header className="admin-panel-header">
    <div className="admin-panel-header__main">
      {eyebrow && <div className="admin-panel-header__eyebrow">{eyebrow}</div>}
      {title && <h2 className="admin-panel-header__title">{title}</h2>}
      {description && <p className="admin-panel-header__desc">{description}</p>}
    </div>
    {actions && <div className="admin-panel-header__actions">{actions}</div>}
  </header>
);

// 상태 뱃지 — variant: gold | neutral | ink | danger | success
const StatusBadge = ({ variant = 'neutral', children, title }) => (
  <span className={`status-badge status-badge--${variant}`} title={title}>{children}</span>
);

// 빈 상태
const AdminEmpty = ({ children }) => (
  <div className="admin-empty">{children}</div>
);

// 필터 chips — items: [{ key, label, count? }]
const AdminFilterChips = ({ items, value, onChange, ariaLabel = '필터' }) => (
  <div className="admin-toolbar__filters" role="tablist" aria-label={ariaLabel}>
    {items.map((it) => (
      <button key={it.key} type="button" role="tab"
        aria-selected={value === it.key}
        className={`admin-filter-chip ${value === it.key ? 'admin-filter-chip--active' : ''}`}
        onClick={() => onChange?.(it.key)}>
        {it.label}{typeof it.count === 'number' ? ` (${it.count})` : ''}
      </button>
    ))}
  </div>
);

// 저장 바
const AdminSaveBar = ({ children, message, messageVariant = 'success' }) => (
  <div className="admin-savebar">
    {children}
    {message && (
      <span className={`admin-savebar__msg admin-savebar__msg--${messageVariant}`}>{message}</span>
    )}
  </div>
);

// 카드 호버/포커스 시 details popover. dashboardStats 카드와 MetricCard 둘 다 사용.
// details: [{ label, value }, ...] — 비어있거나 미전달 시 popover 자체 미노출.
const HoverDetailsPopover = ({ details, open, id, anchor = 'right' }) => {
  if (!open || !Array.isArray(details) || details.length === 0) return null;
  return (
    <div role="tooltip" id={id}
      style={{
        position:'absolute', top:'100%', marginTop:8,
        [anchor === 'left' ? 'left' : 'right']: 0,
        background:'var(--bg)', border:'1px solid var(--primary-dim)',
        boxShadow:'0 8px 24px rgba(0,0,0,0.18)', padding:'14px 16px',
        minWidth:240, maxWidth:320, zIndex:50, borderRadius:8,
      }}>
      <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', marginBottom:10}}>DETAILS</div>
      <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
        {details.map((d, i) => (
          <li key={i} style={{display:'flex', justifyContent:'space-between', gap:14, fontSize:12, alignItems:'baseline'}}>
            <span className="dim" style={{flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis'}}>{d.label}</span>
            <span className="mono" style={{fontWeight:600, color:'var(--secondary)', whiteSpace:'nowrap'}}>{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// dashboardStats 4 카드 — hover/focus 로 popover 노출. details 미전달 시 종전 동작 그대로.
const StatTile = ({ stat }) => {
  const [open, setOpen] = React.useState(false);
  const id = React.useId ? React.useId() : `stat-${stat.l}`;
  const hasDetails = Array.isArray(stat.details) && stat.details.length > 0;
  return (
    <div className="card" style={{position:'relative'}}
      onMouseEnter={() => hasDetails && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => hasDetails && setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={hasDetails ? 0 : undefined}
      aria-describedby={open ? id : undefined}>
      <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.25em', marginBottom:12}}>{stat.l}</div>
      <div className="ko-serif" style={{fontSize:32, color:'var(--ink)'}}>
        {stat.v}<span style={{fontSize:14, marginLeft:4}} className="dim-2">{stat.unit||''}</span>
      </div>
      <div style={{fontSize:11, color: stat.p ? 'var(--primary)' : 'var(--danger)', marginTop:8}}>{stat.d}</div>
      <HoverDetailsPopover details={stat.details} open={open} id={id}/>
    </div>
  );
};

const MetricCard = ({ label, value, sub, accent, icon, details }) => {
  const [open, setOpen] = React.useState(false);
  const id = React.useId ? React.useId() : `metric-${label}`;
  const hasDetails = Array.isArray(details) && details.length > 0;
  return (
    <article className="metric-card" style={{
      padding:'18px 20px', background:'var(--bg-2)', border:'1px solid var(--line)',
      borderRadius:10, position:'relative', overflow:'visible',
    }}
      onMouseEnter={() => hasDetails && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => hasDetails && setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={hasDetails ? 0 : undefined}
      aria-describedby={open ? id : undefined}>
      <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
        {icon && <span style={{fontSize:18}} aria-hidden="true">{icon}</span>}
        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase'}}>{label}</div>
      </div>
      <div className="ko-serif" style={{fontSize:32, fontWeight:600, color: accent || 'var(--primary-hover)', lineHeight:1.1}}>
        {value}
      </div>
      {sub && <div className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.5}}>{sub}</div>}
      <HoverDetailsPopover details={details} open={open} id={id}/>
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
  AdminPanelHeader, StatusBadge, AdminEmpty, AdminFilterChips, AdminSaveBar,
  HoverDetailsPopover, StatTile, MetricCard,
});


// ── 분석/시간 유틸 (v00.285 — AuthAdminPage→AdminRouterPanels 에서 이동, 가장 먼저 로드되는 공용 파일로).
//    Dashboard/UserJourney/Community 등 여러 패널이 공유 → load-order 안전하게 AdminShared 에 정의 + window 노출.
const formatTimeLeft = (dueIso) => {
  const diff = new Date(dueIso).getTime() - Date.now();
  if (diff <= 0) return { text: "기한 경과", tone: "danger" };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d === 0) return { text: `${h}시간 남음`, tone: "warn" };
  if (d <= 3) return { text: `${d}일 ${h}시간 남음`, tone: "warn" };
  return { text: `${d}일 남음`, tone: "ok" };
};

// 일/주/월 카운트 헬퍼 — items 의 dateField 가 ISO 또는 'YYYY.MM.DD'.
const _toDate = (v) => {
  if (!v) return null;
  const t = Date.parse(v);
  if (!isNaN(t)) return new Date(t);
  // 'YYYY.MM.DD' 형식
  const m = String(v).match(/^(\d{4})[.-](\d{1,2})[.-](\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return null;
};
const _countSince = (items, dateField, days) => {
  const cutoff = Date.now() - days * 86400000;
  return items.filter((it) => {
    const d = _toDate(it[dateField]);
    return d && d.getTime() >= cutoff;
  }).length;
};
// v00.176 — 24시간 시간단위 series (days=1 코호트용). 현재 시각 포함 24시간 (1시간 간격).
// v00.191 — 사용자 보고 '시간 단위로 볼 때 모든 시간에 라벨 달아줘'. 이전 매 3시간만 라벨 → 매 시간 표시.
const _hourlySeries = (items, dateField, hours = 24) => {
  const counts = new Array(hours).fill(0);
  const labels = new Array(hours).fill('');
  const now = new Date(); now.setMinutes(0, 0, 0);
  const baseTs = now.getTime() - (hours - 1) * 3600000;
  items.forEach((it) => {
    const d = _toDate(it[dateField]);
    if (!d) return;
    const idx = Math.floor((d.getTime() - baseTs) / 3600000);
    if (idx >= 0 && idx < hours) counts[idx]++;
  });
  for (let i = 0; i < hours; i++) {
    const dt = new Date(baseTs + i * 3600000);
    labels[i] = (i === hours - 1) ? '지금' : `${dt.getHours()}시`;
  }
  return { counts, labels };
};

// 14일치 일별 카운트 series — 오늘 포함 14개.
const _dailySeries = (items, dateField, days = 14) => {
  const counts = new Array(days).fill(0);
  const labels = new Array(days).fill('');
  const todayMid = (() => { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); })();
  items.forEach((it) => {
    const d = _toDate(it[dateField]);
    if (!d) return;
    d.setHours(0, 0, 0, 0);
    const idx = Math.floor((d.getTime() - todayMid) / 86400000) + (days - 1);
    if (idx >= 0 && idx < days) counts[idx]++;
  });
  // v00.195 — 사용자 보고 '임의로 중간에 값들을 축약하지마'. 모든 일자에 라벨 (이전엔 짝수 인덱스만).
  for (let i = 0; i < days; i++) {
    const dt = new Date(todayMid + (i - (days - 1)) * 86400000);
    labels[i] = (i === days - 1) ? '오늘' : `${dt.getMonth()+1}/${dt.getDate()}`;
  }
  return { counts, labels };
};


// v00.313 — 관리자 저장의 공통 관문.
//   왜: 관리자 패널 다수가 서버 저장을 **기다리지 않고** 곧바로 '저장되었습니다' 를 띄웠다.
//   저장 함수는 전부 async 인데 await 도 .catch 도 없으니, 서버가 거절해도 화면은
//   성공이라고 말한 뒤 목록만 다시 그린다. 운영자는 저장된 줄 알고 창을 닫는다.
//   (전역 unhandledrejection 이 토스트를 띄우긴 하지만 **'저장됨' 다음에** 뜬다 —
//    두 개가 동시에 뜨면 사람은 앞의 초록을 믿는다.)
//   → 끝난 뒤에만 성공을 말하고, 실패는 사람의 말로 알린다. 성공 여부를 돌려준다.
const adminSave = async (work, { ok, fail = '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.', onOk } = {}) => {
  try {
    const r = typeof work === 'function' ? await work() : await work;
    if (ok) window.BGNJ_TOAST?.success?.(ok);
    onOk?.(r);
    return true;
  } catch (err) {
    console.error('[adminSave]', err);
    window.BGNJ_TOAST?.error?.(`${fail}${err?.message ? ` (${err.message})` : ''}`);
    return false;
  }
};

// v00.286 ESM — 모듈 export (window 노출과 병행, 점진 전환).
export { AdminEmpty, AdminPanelHeader, AdminSaveBar, CohortSelector, MetricCard, MiniBarChart, RankedBarList, StatTile, SubTabsView, downloadCsv, downloadJson, pickImageWithR2Fallback };

export { AdminFilterChips, SankeyFlow, _countSince, _dailySeries, _hourlySeries, formatTimeLeft };

export { adminSave };

// v00.296.001 — window 등록 복원.
//   v00.287 ESM 전환 때 `window.X = X` 가 사라졌는데, 사용처는 `<window.X/>` 로 남아 있었다.
//   가드가 window 를 보면 조용히 기능이 사라지고, import 를 보면 undefined 를 렌더해
//   React #130 으로 화면이 통째로 깨진다(관리자 '한켠 예약' 탭에서 실제로 발생).
//   사용처를 건드리는 대신 여기서 등록한다 — 회귀 위험이 가장 작다.
//   tools/check-globals.mjs 가 이 짝이 어긋나면 커밋을 막는다.
window.HeatmapGrid = HeatmapGrid;
window.BGNJ_ADMIN_SAVE = adminSave;

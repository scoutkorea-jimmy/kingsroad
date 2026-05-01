// === pages/admin/AdminContentEditors.jsx =================================
// v00.078 — AuthAdminPage.jsx 2차 분할. 콘텐츠 편집 패널 묶음 (~1300 줄 이동).
// 포함:
//   - RecommendationsAdminPanel (추천 여행지 CRUD)
//   - TPE_RowActions / TPE_ScheduleEditor / TPE_PrepEditor / TPE_PreviewCard (투어/강연 공통)
//   - _arrAdd / _arrRemove / _arrUpdate / _arrMove (배열 헬퍼)
//   - TourPageEditorPanel (글로벌/템플릿/투어별)
//   - FOOTER_COLOR_OPTIONS / FooterStyleEditor
//   - HE_* (Hero 편집기 호이스팅 컴포넌트) + HERO_COLOR_OPTIONS / HERO_WEIGHTS / HERO_ALIGNS / HERO_TFORMS
//   - HeroEditorPanel
//
// 본 파일은 index.html 에서 AuthAdminPage.js 보다 먼저 로드.
// 파일 끝에서 Object.assign(window, {...}) 로 노출 — AuthAdminPage 가 trampoline 으로 가져감.
// === 추천 여행지 CRUD =====================================================
// 저장소: site_content_kv 의 'recommendations' 키. 배열로 통째 저장 (BGNJ_SITE_CONTENT v2 array merge).
// 운영: 관리자가 카드 형태로 region/name/subtitle/desc/tags/image 를 채우고 저장 → 홈 '뱅기노자 추천' 섹션에 즉시 반영.
const RecommendationsAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const items = React.useMemo(() => Array.isArray(sc.recommendations) ? sc.recommendations : [], [sc]);
  const [draft, setDraft] = React.useState(items);
  React.useEffect(() => { setDraft(items); }, [items.length, tick]);
  const [msg, setMsg] = React.useState('');
  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2000); };

  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    if (!file) { resolve(''); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const setItem = (idx, patch) => setDraft((arr) => arr.map((it, i) => i === idx ? { ...it, ...patch } : it));
  const addItem = () => setDraft((arr) => [...arr, {
    id: `rec-${Date.now()}`,
    region: '', name: '', subtitle: '', desc: '',
    tags: '', imageDataUri: '',
  }]);
  const removeItem = (idx) => {
    if (!confirm('이 추천을 삭제할까요?')) return;
    setDraft((arr) => arr.filter((_, i) => i !== idx));
  };
  const moveItem = (idx, dir) => {
    setDraft((arr) => {
      const next = arr.slice();
      const j = idx + dir;
      if (j < 0 || j >= next.length) return next;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };
  // v00.084 — R2 우선 (5MB) + dataURI 폴백 (1.5MB).
  const onPickImage = async (idx, e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const { url } = await window.BGNJ_MEDIA.uploadFile(file, { folder: 'recommendations', maxBytes: 5 * 1024 * 1024 });
      setItem(idx, { imageDataUri: url });
      return;
    } catch (err) {
      console.warn('[v00.084] R2 추천 이미지 업로드 실패 — dataURI 폴백:', err);
    }
    if (file.size > 1.5 * 1024 * 1024) {
      alert(`이미지가 너무 큽니다(${(file.size/1024/1024).toFixed(1)}MB). R2 실패 + 1.5MB 폴백 한도 초과.`);
      return;
    }
    const dataUri = await fileToDataUri(file);
    setItem(idx, { imageDataUri: dataUri });
  };

  const save = async () => {
    // 빈 항목 제거 + 정규화
    const cleaned = draft
      .map((it) => ({
        id: it.id || `rec-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        region: String(it.region || '').trim(),
        name: String(it.name || '').trim(),
        subtitle: String(it.subtitle || '').trim(),
        desc: String(it.desc || '').trim(),
        tags: String(it.tags || '').trim(),
        imageDataUri: it.imageDataUri || '',
      }))
      .filter((it) => it.name); // 이름 없으면 제외
    try {
      await window.BGNJ_SITE_CONTENT.saveSection('recommendations', cleaned);
      setTick((v) => v + 1);
      flash(`${cleaned.length}개 추천이 저장되었습니다.`);
    } catch (err) {
      alert('저장 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  return (
    <div style={{display:'grid', gap:18}}>
      <div className="card" style={{padding:'14px 18px', background:'var(--bg-2)', borderLeft:'3px solid var(--primary-dim)'}}>
        <p style={{fontSize:13, lineHeight:1.75, margin:0, color:'var(--ink-2)'}}>
          ⓘ 홈페이지 <strong>뱅기노자 추천</strong> 섹션에 노출될 여행지를 관리합니다. 빈 배열이면 섹션이 노출되지 않습니다.
          이미지는 1.5MB 이하 권장(가로형 사진이 카드에 잘 어울립니다). 태그는 쉼표(,) 또는 가운뎃점(·)으로 구분.
        </p>
      </div>

      {msg && <div role="status" className="card" style={{padding:'10px 14px', background:'rgba(245,213,72,0.10)', border:'1px solid var(--primary-dim)', color:'var(--secondary)', fontSize:13}}>{msg}</div>}

      {draft.length === 0 ? (
        <div className="card" style={{padding:32, textAlign:'center', color:'var(--ink-2)'}}>
          등록된 추천이 없습니다. 아래 버튼으로 첫 추천을 추가해 주세요.
        </div>
      ) : (
        <div style={{display:'grid', gap:14}}>
          {draft.map((it, idx) => (
            <article key={it.id || idx} className="card" style={{padding:16, display:'grid', gridTemplateColumns:'120px 1fr auto', gap:16, alignItems:'flex-start'}}>
              {/* 이미지 미리보기/업로드 */}
              <div style={{display:'flex', flexDirection:'column', gap:6}}>
                <div style={{
                  width:120, height:90, border:'1px solid var(--line)',
                  background: it.imageDataUri ? `url(${it.imageDataUri}) center/cover` : 'var(--bg-3)',
                  display:'grid', placeItems:'center',
                }}>
                  {!it.imageDataUri && <span className="mono" style={{fontSize:9, color:'var(--ink-3)', letterSpacing:'0.18em'}}>NO IMAGE</span>}
                </div>
                <label className="btn btn-small" style={{cursor:'pointer', textAlign:'center'}}>
                  업로드<input type="file" accept="image/*" style={{display:'none'}} onChange={(e) => onPickImage(idx, e)}/>
                </label>
                {it.imageDataUri && (
                  <button type="button" className="btn-ghost" style={{fontSize:11, color:'var(--danger)'}} onClick={() => setItem(idx, { imageDataUri: '' })}>이미지 제거</button>
                )}
              </div>

              {/* 폼 필드 */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}} className="member-act-grid">
                <div className="field" style={{margin:0}}>
                  <label className="field-label">지역 (예: 수도권)</label>
                  <input className="field-input" value={it.region || ''} onChange={(e) => setItem(idx, { region: e.target.value })}/>
                </div>
                <div className="field" style={{margin:0}}>
                  <label className="field-label">제목 (예: 서울)</label>
                  <input className="field-input" value={it.name || ''} onChange={(e) => setItem(idx, { name: e.target.value })}/>
                </div>
                <div className="field" style={{margin:0, gridColumn:'1 / -1'}}>
                  <label className="field-label">부제 (예: 궁궐과 골목의 도시)</label>
                  <input className="field-input" value={it.subtitle || ''} onChange={(e) => setItem(idx, { subtitle: e.target.value })}/>
                </div>
                <div className="field" style={{margin:0, gridColumn:'1 / -1'}}>
                  <label className="field-label">설명</label>
                  <textarea className="field-input" rows={2} value={it.desc || ''} onChange={(e) => setItem(idx, { desc: e.target.value })}/>
                </div>
                <div className="field" style={{margin:0, gridColumn:'1 / -1'}}>
                  <label className="field-label">태그 (쉼표 또는 가운뎃점으로 구분 — 예: 궁궐, 한옥, 역사)</label>
                  <input className="field-input" value={it.tags || ''} onChange={(e) => setItem(idx, { tags: e.target.value })}/>
                </div>
              </div>

              {/* 우측: 순서 / 삭제 */}
              <div style={{display:'flex', flexDirection:'column', gap:6, alignItems:'stretch'}}>
                <button type="button" className="btn btn-small" disabled={idx === 0} onClick={() => moveItem(idx, -1)} aria-label="위로">↑</button>
                <button type="button" className="btn btn-small" disabled={idx === draft.length - 1} onClick={() => moveItem(idx, +1)} aria-label="아래로">↓</button>
                <button type="button" className="btn btn-small" style={{color:'var(--danger)', borderColor:'var(--danger)'}} onClick={() => removeItem(idx)}>삭제</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div style={{display:'flex', gap:10, justifyContent:'space-between', alignItems:'center', flexWrap:'wrap'}}>
        <button type="button" className="btn" onClick={addItem}>＋ 새 추천 추가</button>
        <div style={{display:'flex', gap:8}}>
          <button type="button" className="btn btn-small" onClick={() => setDraft(items)}>변경 취소</button>
          <button type="button" className="btn btn-gold" onClick={save}>전체 저장 ({draft.length}개)</button>
        </div>
      </div>
    </div>
  );
};

// === Tour Schedule / Prep Editor (v00.065 / v00.066) ====================
// 투어 페이지 '답사 일정' + '준비물' 편집. 3 모드:
//   - 글로벌: site_content_kv.tourSchedule / .tourPrep — 기본 폴백.
//   - 템플릿: site_content_kv.tourTemplates [{id, name, schedule, prep}] — 자주 쓰는 패턴.
//   - 투어별: site_content_kv.tourPages[tourId] = { schedule, prep, templateId? } — per-tour override.
// 우선순위: per-tour override(직접 편집) > per-tour templateId > 글로벌 > 코드 default.

// 모듈 최상위 헬퍼 — IME 안전 (한글 입력 핫픽스 v00.058 패턴).
const TPE_RowActions = ({ i, total, onMove, onRemove }) => (
  <div style={{display:'flex', gap:4}}>
    <button type="button" className="btn btn-small" disabled={i === 0} onClick={() => onMove(i, -1)} aria-label="위로" style={{padding:'4px 8px', fontSize:11}}>↑</button>
    <button type="button" className="btn btn-small" disabled={i === total - 1} onClick={() => onMove(i, 1)} aria-label="아래로" style={{padding:'4px 8px', fontSize:11}}>↓</button>
    <button type="button" className="btn btn-small" onClick={() => onRemove(i)} aria-label="삭제" style={{padding:'4px 8px', fontSize:11, borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
  </div>
);
const TPE_ScheduleEditor = ({ rows, onAdd, onRemove, onUpdate, onMove }) => (
  <div className="card" style={{padding:16, marginBottom:14}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
      <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em'}}>답사 일정</div>
      <button type="button" className="btn btn-small" onClick={onAdd}>＋ 항목 추가</button>
    </div>
    {rows.length === 0 && (
      <p className="dim-2" style={{fontSize:11, lineHeight:1.6}}>ⓘ 항목이 없으면 페이지에서 '답사 일정' 섹션이 노출되지 않습니다.</p>
    )}
    {rows.map((s, i) => (
      <div key={i} style={{display:'grid', gridTemplateColumns:'90px 1fr auto', gap:8, marginBottom:8, alignItems:'center'}}>
        <input type="text" className="field-input" value={s.t || ''}
          onChange={(e) => onUpdate(i, 't', e.target.value)} placeholder="0h 30m"
          style={{padding:'6px 8px', fontSize:12, fontFamily:'var(--font-mono)'}}/>
        <input type="text" className="field-input" value={s.l || ''}
          onChange={(e) => onUpdate(i, 'l', e.target.value)} placeholder="주요 공간 답사"
          style={{padding:'6px 8px', fontSize:13}}/>
        <TPE_RowActions i={i} total={rows.length} onMove={onMove} onRemove={onRemove}/>
      </div>
    ))}
  </div>
);
const TPE_PrepEditor = ({ rows, onAdd, onRemove, onUpdate, onMove }) => (
  <div className="card" style={{padding:16, marginBottom:14}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
      <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em'}}>준비물</div>
      <button type="button" className="btn btn-small" onClick={onAdd}>＋ 항목 추가</button>
    </div>
    {rows.length === 0 && (
      <p className="dim-2" style={{fontSize:11, lineHeight:1.6}}>ⓘ 항목이 없으면 페이지에서 '준비물' 섹션이 노출되지 않습니다.</p>
    )}
    {rows.map((p, i) => (
      <div key={i} style={{display:'grid', gridTemplateColumns:'1fr auto', gap:8, marginBottom:8, alignItems:'center'}}>
        <input type="text" className="field-input" value={p || ''}
          onChange={(e) => onUpdate(i, e.target.value)} placeholder="편한 신발"
          style={{padding:'6px 8px', fontSize:13}}/>
        <TPE_RowActions i={i} total={rows.length} onMove={onMove} onRemove={onRemove}/>
      </div>
    ))}
  </div>
);
const TPE_PreviewCard = ({ schedule, prep }) => (
  <div className="card" style={{padding:0, overflow:'hidden', position:'sticky', top:24}}>
    <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', padding:'8px 12px', borderBottom:'1px solid var(--line)', background:'var(--bg-2)'}}>
      PREVIEW · 투어 페이지
    </div>
    <div style={{padding:'24px'}}>
      <h3 className="ko-serif" style={{fontSize:18, marginBottom:14, paddingBottom:10, borderBottom:'1px solid var(--line)'}}>답사 일정</h3>
      {schedule.filter((s) => s && (s.t || s.l)).length > 0 ? schedule.filter((s) => s && (s.t || s.l)).map((s, i) => (
        <div key={i} style={{display:'grid', gridTemplateColumns:'80px 1fr', gap:16, padding:'10px 0', borderBottom:'1px dashed var(--line)'}}>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.1em'}}>{s.t || '—'}</div>
          <div className="ko-serif" style={{fontSize:13}}>{s.l || '내용 미입력'}</div>
        </div>
      )) : (
        <p className="dim-2" style={{fontSize:12, fontStyle:'italic'}}>(미노출)</p>
      )}
      <h3 className="ko-serif" style={{fontSize:18, marginTop:24, marginBottom:14, paddingBottom:10, borderBottom:'1px solid var(--line)'}}>준비물</h3>
      {prep.filter(Boolean).length > 0 ? (
        <ul style={{paddingLeft:18, color:'var(--ink-2)', fontSize:13, lineHeight:1.9}}>
          {prep.filter(Boolean).map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      ) : (
        <p className="dim-2" style={{fontSize:12, fontStyle:'italic'}}>(미노출)</p>
      )}
    </div>
  </div>
);

// 배열 helper — 비파괴 조작.
const _arrAdd = (arr, item) => [...arr, item];
const _arrRemove = (arr, i) => arr.filter((_, j) => j !== i);
const _arrUpdate = (arr, i, value) => { const next = arr.slice(); next[i] = value; return next; };
const _arrMove = (arr, i, dir) => {
  const next = arr.slice();
  const j = i + dir;
  if (j < 0 || j >= next.length) return arr;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

const TourPageEditorPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [mode, setMode] = React.useState('global'); // 'global' | 'templates' | 'per_tour'
  const [msg, setMsg] = React.useState('');
  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2500); };

  // ── 글로벌 ─────────────────────────────────────
  const [gSchedule, setGSchedule] = React.useState(() => Array.isArray(sc.tourSchedule) ? sc.tourSchedule.slice() : []);
  const [gPrep, setGPrep] = React.useState(() => Array.isArray(sc.tourPrep) ? sc.tourPrep.slice() : []);
  const saveGlobal = async () => {
    try {
      const cleanS = gSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ''), l: String(s.l || '') }));
      const cleanP = gPrep.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      await window.BGNJ_SITE_CONTENT.saveSection('tourSchedule', cleanS);
      await window.BGNJ_SITE_CONTENT.saveSection('tourPrep', cleanP);
      setTick((v) => v + 1);
      flash('글로벌 저장됨 — 투어 페이지에 즉시 반영.');
    } catch (err) { alert('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };
  const resetGlobal = async () => {
    if (!confirm('글로벌 답사 일정/준비물을 default 로 복원합니다. 진행할까요?')) return;
    try {
      await window.BGNJ_SITE_CONTENT.resetSection('tourSchedule');
      await window.BGNJ_SITE_CONTENT.resetSection('tourPrep');
      const next = window.BGNJ_SITE_CONTENT.get();
      setGSchedule(Array.isArray(next.tourSchedule) ? next.tourSchedule.slice() : []);
      setGPrep(Array.isArray(next.tourPrep) ? next.tourPrep.slice() : []);
      setTick((v) => v + 1);
      flash('글로벌 default 복원됨.');
    } catch (err) { alert('복원 실패: ' + (err?.message || '알 수 없는 오류')); }
  };

  // ── 템플릿 ─────────────────────────────────────
  const [templates, setTemplates] = React.useState(() => Array.isArray(sc.tourTemplates) ? sc.tourTemplates.slice() : []);
  const [activeTplIdx, setActiveTplIdx] = React.useState(-1);
  const activeTpl = activeTplIdx >= 0 ? templates[activeTplIdx] : null;
  const addTemplate = () => {
    const id = `tpl-${Date.now()}`;
    setTemplates((arr) => [...arr, { id, name: '새 템플릿', schedule: [], prep: [] }]);
    setActiveTplIdx(templates.length);
  };
  const removeTemplate = (i) => {
    if (!confirm(`"${templates[i]?.name || '템플릿'}" 을 삭제하시겠어요?`)) return;
    setTemplates((arr) => arr.filter((_, j) => j !== i));
    if (activeTplIdx >= templates.length - 1) setActiveTplIdx(-1);
  };
  const updateActiveTpl = (patch) => {
    if (activeTplIdx < 0) return;
    setTemplates((arr) => arr.map((t, j) => j === activeTplIdx ? { ...t, ...patch } : t));
  };
  const saveTemplates = async () => {
    try {
      const clean = templates.map((t) => ({
        id: t.id || `tpl-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
        name: String(t.name || '이름 없음'),
        schedule: (Array.isArray(t.schedule) ? t.schedule : []).filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ''), l: String(s.l || '') })),
        prep: (Array.isArray(t.prep) ? t.prep : []).filter((p) => p && String(p).trim()).map((p) => String(p).trim()),
      }));
      await window.BGNJ_SITE_CONTENT.saveSection('tourTemplates', clean);
      setTick((v) => v + 1);
      flash('템플릿 저장됨.');
    } catch (err) { alert('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };

  // ── 투어별 ─────────────────────────────────────
  const tours = React.useMemo(() => {
    try { return (window.BGNJ_TOURS?.listAll?.() || []).slice(); } catch { return []; }
  }, [tick]);
  const [activeTourId, setActiveTourId] = React.useState('');
  const tourPages = sc.tourPages || {};
  const activeOverride = activeTourId ? (tourPages[activeTourId] || null) : null;
  const [pSchedule, setPSchedule] = React.useState([]);
  const [pPrep, setPPrep] = React.useState([]);
  const [pTemplateId, setPTemplateId] = React.useState('');
  const [pCover, setPCover] = React.useState('');
  React.useEffect(() => {
    if (!activeTourId) { setPSchedule([]); setPPrep([]); setPTemplateId(''); setPCover(''); return; }
    const ovr = tourPages[activeTourId] || {};
    setPSchedule(Array.isArray(ovr.schedule) ? ovr.schedule.slice() : []);
    setPPrep(Array.isArray(ovr.prep) ? ovr.prep.slice() : []);
    setPTemplateId(ovr.templateId || '');
    setPCover(ovr.coverDataUri || '');
  }, [activeTourId, tick]);
  const applyTplToPerTour = (tplId) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    setPSchedule(Array.isArray(tpl.schedule) ? tpl.schedule.map((s) => ({ ...s })) : []);
    setPPrep(Array.isArray(tpl.prep) ? tpl.prep.slice() : []);
    setPTemplateId(tplId);
  };
  const savePerTour = async () => {
    if (!activeTourId) { alert('투어를 먼저 선택해 주세요.'); return; }
    try {
      const cleanS = pSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ''), l: String(s.l || '') }));
      const cleanP = pPrep.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      const next = { ...tourPages, [activeTourId]: {
        schedule: cleanS, prep: cleanP,
        templateId: pTemplateId || undefined,
        coverDataUri: pCover || undefined,
      } };
      await window.BGNJ_SITE_CONTENT.saveSection('tourPages', next);
      setTick((v) => v + 1);
      flash(`'${activeTourId}' 투어 override 저장됨.`);
    } catch (err) { alert('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };
  // v00.070 — 커버 이미지 업로드 헬퍼. 1.5MB 이하 dataURI.
  const onPickCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert(`이미지가 너무 큽니다(${(file.size/1024/1024).toFixed(1)}MB). 1.5MB 이하로 압축해 주세요.`);
      e.target.value = ''; return;
    }
    const dataUri = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    setPCover(dataUri);
    e.target.value = '';
  };
  const clearPerTour = async () => {
    if (!activeTourId) return;
    if (!confirm(`'${activeTourId}' 투어의 override 를 제거하고 글로벌로 폴백하시겠어요?`)) return;
    try {
      const next = { ...tourPages };
      delete next[activeTourId];
      await window.BGNJ_SITE_CONTENT.saveSection('tourPages', next);
      setPSchedule([]); setPPrep([]); setPTemplateId(''); setPCover('');
      setTick((v) => v + 1);
      flash('override 제거됨 — 글로벌 fallback 적용.');
    } catch (err) { alert('실패: ' + (err?.message || '알 수 없는 오류')); }
  };

  // 미리보기 입력 (모드별).
  const previewSchedule = mode === 'global' ? gSchedule : (mode === 'templates' ? (activeTpl?.schedule || []) : pSchedule);
  const previewPrep     = mode === 'global' ? gPrep     : (mode === 'templates' ? (activeTpl?.prep     || []) : pPrep);

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:14, lineHeight:1.8}}>
        <code>/tour</code> 페이지의 <strong className="gold">답사 일정</strong>과 <strong className="gold">준비물</strong> 편집.
        우선순위: <strong>투어별 override</strong> &gt; <strong>템플릿</strong> &gt; <strong>글로벌</strong> &gt; 코드 default.
      </p>
      <div role="tablist" aria-label="편집 모드" style={{display:'flex', gap:6, marginBottom:14, flexWrap:'wrap'}}>
        {[
          { key: 'global',    label: '글로벌 (모든 투어 공통)' },
          { key: 'templates', label: '템플릿' },
          { key: 'per_tour',  label: '투어별 override' },
        ].map((m) => {
          const on = mode === m.key;
          return (
            <button key={m.key} type="button" role="tab" aria-selected={on}
              onClick={() => setMode(m.key)}
              className="btn btn-small"
              style={{
                fontSize:12,
                borderColor: on ? 'var(--primary)' : 'var(--line-2)',
                color: on ? 'var(--primary)' : 'var(--ink)',
                background: on ? 'rgba(245,213,72,0.10)' : 'var(--bg-2)',
                fontWeight: on ? 700 : 500,
              }}>{m.label}</button>
          );
        })}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'minmax(0, 1fr) minmax(0, 1fr)', gap:20}} className="hero-editor-grid">
        {/* 좌: 편집 */}
        <div>
          {mode === 'global' && (
            <>
              <TPE_ScheduleEditor rows={gSchedule}
                onAdd={() => setGSchedule((a) => _arrAdd(a, { t: '', l: '' }))}
                onRemove={(i) => setGSchedule((a) => _arrRemove(a, i))}
                onUpdate={(i, k, v) => setGSchedule((a) => { const n = a.slice(); n[i] = { ...n[i], [k]: v }; return n; })}
                onMove={(i, d) => setGSchedule((a) => _arrMove(a, i, d))}/>
              <TPE_PrepEditor rows={gPrep}
                onAdd={() => setGPrep((a) => _arrAdd(a, ''))}
                onRemove={(i) => setGPrep((a) => _arrRemove(a, i))}
                onUpdate={(i, v) => setGPrep((a) => _arrUpdate(a, i, v))}
                onMove={(i, d) => setGPrep((a) => _arrMove(a, i, d))}/>
              <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                <button type="button" className="btn btn-gold" onClick={saveGlobal}>저장</button>
                <button type="button" className="btn btn-small" onClick={resetGlobal} style={{borderColor:'var(--line-2)'}}>default 복원</button>
              </div>
            </>
          )}

          {mode === 'templates' && (
            <>
              <div className="card" style={{padding:14, marginBottom:14}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
                  <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em'}}>템플릿 목록</div>
                  <button type="button" className="btn btn-small" onClick={addTemplate}>＋ 새 템플릿</button>
                </div>
                {templates.length === 0 && (
                  <p className="dim-2" style={{fontSize:11, lineHeight:1.6}}>아직 템플릿이 없습니다. 자주 쓰는 답사 일정/준비물 패턴을 저장해 두면 투어별 override 에서 빠르게 적용할 수 있습니다.</p>
                )}
                <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                  {templates.map((t, i) => (
                    <button key={t.id || i} type="button" className="btn btn-small"
                      onClick={() => setActiveTplIdx(i)}
                      style={{
                        fontSize:11,
                        borderColor: activeTplIdx === i ? 'var(--primary)' : 'var(--line-2)',
                        color: activeTplIdx === i ? 'var(--primary)' : 'var(--ink)',
                        fontWeight: activeTplIdx === i ? 700 : 500,
                      }}>{t.name || '이름 없음'}</button>
                  ))}
                </div>
              </div>
              {activeTpl && (
                <>
                  <div className="card" style={{padding:14, marginBottom:14}}>
                    <label style={{display:'block', marginBottom:8}}>
                      <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:5}}>템플릿 이름</div>
                      <input type="text" className="field-input" value={activeTpl.name || ''}
                        onChange={(e) => updateActiveTpl({ name: e.target.value })}
                        style={{width:'100%', padding:'6px 10px', fontSize:13}}/>
                    </label>
                    <button type="button" className="btn btn-small" onClick={() => removeTemplate(activeTplIdx)}
                      style={{borderColor:'var(--danger)', color:'var(--danger)', fontSize:10}}>이 템플릿 삭제</button>
                  </div>
                  <TPE_ScheduleEditor rows={activeTpl.schedule || []}
                    onAdd={() => updateActiveTpl({ schedule: _arrAdd(activeTpl.schedule || [], { t: '', l: '' }) })}
                    onRemove={(i) => updateActiveTpl({ schedule: _arrRemove(activeTpl.schedule || [], i) })}
                    onUpdate={(i, k, v) => { const n = (activeTpl.schedule || []).slice(); n[i] = { ...n[i], [k]: v }; updateActiveTpl({ schedule: n }); }}
                    onMove={(i, d) => updateActiveTpl({ schedule: _arrMove(activeTpl.schedule || [], i, d) })}/>
                  <TPE_PrepEditor rows={activeTpl.prep || []}
                    onAdd={() => updateActiveTpl({ prep: _arrAdd(activeTpl.prep || [], '') })}
                    onRemove={(i) => updateActiveTpl({ prep: _arrRemove(activeTpl.prep || [], i) })}
                    onUpdate={(i, v) => updateActiveTpl({ prep: _arrUpdate(activeTpl.prep || [], i, v) })}
                    onMove={(i, d) => updateActiveTpl({ prep: _arrMove(activeTpl.prep || [], i, d) })}/>
                </>
              )}
              <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                <button type="button" className="btn btn-gold" onClick={saveTemplates}>모든 템플릿 저장</button>
              </div>
            </>
          )}

          {mode === 'per_tour' && (
            <>
              <div className="card" style={{padding:14, marginBottom:14}}>
                <label style={{display:'block', marginBottom:10}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:5}}>투어 선택</div>
                  <select value={activeTourId} onChange={(e) => setActiveTourId(e.target.value)} className="field-input"
                    style={{width:'100%', padding:'8px 10px', fontSize:13}}>
                    <option value="">— 투어를 선택 —</option>
                    {tours.map((t) => (
                      <option key={t.id} value={t.id}>{t.title || t.id} {tourPages[t.id] ? '· override 있음' : ''}</option>
                    ))}
                  </select>
                </label>
                {activeTourId && (
                  <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
                    <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.16em'}}>템플릿 적용:</span>
                    <select value={pTemplateId || ''} onChange={(e) => applyTplToPerTour(e.target.value)} className="field-input"
                      style={{padding:'6px 8px', fontSize:12, minWidth:160}}>
                      <option value="">— 직접 편집 —</option>
                      {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
              {activeTourId ? (
                <>
                  {/* v00.070 — 투어 커버 이미지 업로드 (per-tour). 비면 라이브 페이지에서 placeholder. */}
                  <div className="card" style={{padding:14, marginBottom:14}}>
                    <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em', marginBottom:10}}>커버 이미지 (선택)</div>
                    <div style={{display:'flex', gap:14, alignItems:'center'}}>
                      <div style={{
                        width:120, height:75, flexShrink:0,
                        border:'1px solid var(--line)', background:'var(--bg-2)',
                        display:'grid', placeItems:'center', overflow:'hidden',
                      }}>
                        {pCover
                          ? <img src={pCover} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                          : <span className="dim-2 mono" style={{fontSize:9, letterSpacing:'0.18em'}}>NONE</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div className="dim-2" style={{fontSize:11, lineHeight:1.5}}>
                          답사 상세 페이지 좌측 상단에 표시될 커버 이미지. 1600×1000 권장 · 1.5MB 이하 · 비우면 placeholder.
                        </div>
                      </div>
                      <div style={{display:'flex', gap:8}}>
                        <label className="btn btn-small" style={{cursor:'pointer'}}>
                          업로드
                          <input type="file" accept="image/*" onChange={onPickCover} style={{display:'none'}}/>
                        </label>
                        {pCover && (
                          <button type="button" className="btn btn-small" onClick={() => setPCover('')}
                            style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                        )}
                      </div>
                    </div>
                  </div>
                  <TPE_ScheduleEditor rows={pSchedule}
                    onAdd={() => setPSchedule((a) => _arrAdd(a, { t: '', l: '' }))}
                    onRemove={(i) => setPSchedule((a) => _arrRemove(a, i))}
                    onUpdate={(i, k, v) => setPSchedule((a) => { const n = a.slice(); n[i] = { ...n[i], [k]: v }; return n; })}
                    onMove={(i, d) => setPSchedule((a) => _arrMove(a, i, d))}/>
                  <TPE_PrepEditor rows={pPrep}
                    onAdd={() => setPPrep((a) => _arrAdd(a, ''))}
                    onRemove={(i) => setPPrep((a) => _arrRemove(a, i))}
                    onUpdate={(i, v) => setPPrep((a) => _arrUpdate(a, i, v))}
                    onMove={(i, d) => setPPrep((a) => _arrMove(a, i, d))}/>
                  <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                    <button type="button" className="btn btn-gold" onClick={savePerTour}>이 투어 저장</button>
                    {activeOverride && (
                      <button type="button" className="btn btn-small" onClick={clearPerTour}
                        style={{borderColor:'var(--danger)', color:'var(--danger)'}}>override 제거 (글로벌 fallback)</button>
                    )}
                  </div>
                </>
              ) : (
                <p className="dim-2" style={{fontSize:12, fontStyle:'italic'}}>투어를 선택하면 그 투어의 답사 일정/준비물을 편집할 수 있습니다. 저장된 override 가 없으면 글로벌이 사용됩니다.</p>
              )}
            </>
          )}

          {msg && <p role="status" className="mono" style={{fontSize:12, color:'var(--secondary)', fontWeight:600, marginTop:10}}>{msg}</p>}
        </div>

        {/* 우: 미리보기 */}
        <div>
          <TPE_PreviewCard schedule={previewSchedule} prep={previewPrep}/>
        </div>
      </div>
    </div>
  );
};

// === Lecture Schedule / Notes Editor (v00.083) ============================
// TourPageEditorPanel 의 글로벌 / 템플릿 / per-lecture 패턴 복제.
// site_content_kv: lectureSchedule (글로벌 진행) / lectureNotes (글로벌 참고) /
//   lectureTemplates (템플릿 모음) / lecturePages[id] (per-lecture override).
// 우선순위: per-lecture > 템플릿 > 글로벌 > 코드 default.

const LPE_NotesEditor = ({ rows, onAdd, onRemove, onUpdate, onMove }) => (
  <div className="card" style={{padding:14, marginBottom:14}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
      <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em'}}>참고 안내</div>
      <button type="button" className="btn btn-small" onClick={onAdd}>＋ 행 추가</button>
    </div>
    {rows.length === 0 && <p className="dim-2" style={{fontSize:11, lineHeight:1.6}}>아직 항목이 없습니다. ＋로 추가하세요.</p>}
    {rows.map((p, i) => (
      <div key={i} style={{display:'grid', gridTemplateColumns:'1fr auto', gap:8, marginBottom:8, alignItems:'center'}}>
        <input type="text" className="field-input" value={p || ''}
          onChange={(e) => onUpdate(i, e.target.value)} placeholder="회원 가입 후 신청 가능 — 비회원은 자동 차단"
          style={{padding:'6px 8px', fontSize:13}}/>
        <TPE_RowActions i={i} total={rows.length} onMove={onMove} onRemove={onRemove}/>
      </div>
    ))}
  </div>
);

const LPE_PreviewCard = ({ schedule, notes }) => (
  <div className="card" style={{padding:0, overflow:'hidden', position:'sticky', top:24}}>
    <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', padding:'8px 12px', borderBottom:'1px solid var(--line)', background:'var(--bg-2)'}}>
      PREVIEW · 강연 페이지
    </div>
    <div style={{padding:'24px'}}>
      <h3 className="ko-serif" style={{fontSize:18, marginBottom:14, paddingBottom:10, borderBottom:'1px solid var(--line)'}}>강연 진행</h3>
      {schedule.filter((s) => s && (s.t || s.l)).length > 0 ? schedule.filter((s) => s && (s.t || s.l)).map((s, i) => (
        <div key={i} style={{display:'grid', gridTemplateColumns:'80px 1fr', gap:16, padding:'10px 0', borderBottom:'1px dashed var(--line)'}}>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.1em'}}>{s.t || '—'}</div>
          <div className="ko-serif" style={{fontSize:13}}>{s.l || '내용 미입력'}</div>
        </div>
      )) : (
        <p className="dim-2" style={{fontSize:12, fontStyle:'italic'}}>(미노출)</p>
      )}
      <h3 className="ko-serif" style={{fontSize:18, marginTop:24, marginBottom:14, paddingBottom:10, borderBottom:'1px solid var(--line)'}}>참고</h3>
      {notes.filter(Boolean).length > 0 ? (
        <ul style={{paddingLeft:18, color:'var(--ink-2)', fontSize:13, lineHeight:1.9}}>
          {notes.filter(Boolean).map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      ) : (
        <p className="dim-2" style={{fontSize:12, fontStyle:'italic'}}>(미노출)</p>
      )}
    </div>
  </div>
);

const LecturePageEditorPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [mode, setMode] = React.useState('global'); // 'global' | 'templates' | 'per_lecture'
  const [msg, setMsg] = React.useState('');
  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2500); };

  // ── 글로벌 ─────────────────────────────────────
  const [gSchedule, setGSchedule] = React.useState(() => Array.isArray(sc.lectureSchedule) ? sc.lectureSchedule.slice() : []);
  const [gNotes, setGNotes] = React.useState(() => Array.isArray(sc.lectureNotes) ? sc.lectureNotes.slice() : []);
  const saveGlobal = async () => {
    try {
      const cleanS = gSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ''), l: String(s.l || '') }));
      const cleanN = gNotes.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      await window.BGNJ_SITE_CONTENT.saveSection('lectureSchedule', cleanS);
      await window.BGNJ_SITE_CONTENT.saveSection('lectureNotes', cleanN);
      setTick((v) => v + 1);
      flash('글로벌 저장됨 — 강연 페이지에 즉시 반영.');
    } catch (err) { alert('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };
  const resetGlobal = async () => {
    if (!confirm('글로벌 진행/참고를 default 로 복원합니다. 진행할까요?')) return;
    try {
      await window.BGNJ_SITE_CONTENT.resetSection('lectureSchedule');
      await window.BGNJ_SITE_CONTENT.resetSection('lectureNotes');
      const next = window.BGNJ_SITE_CONTENT.get();
      setGSchedule(Array.isArray(next.lectureSchedule) ? next.lectureSchedule.slice() : []);
      setGNotes(Array.isArray(next.lectureNotes) ? next.lectureNotes.slice() : []);
      setTick((v) => v + 1);
      flash('글로벌 default 복원됨.');
    } catch (err) { alert('복원 실패: ' + (err?.message || '알 수 없는 오류')); }
  };

  // ── 템플릿 ─────────────────────────────────────
  const [templates, setTemplates] = React.useState(() => Array.isArray(sc.lectureTemplates) ? sc.lectureTemplates.slice() : []);
  const [activeTplIdx, setActiveTplIdx] = React.useState(-1);
  const activeTpl = activeTplIdx >= 0 ? templates[activeTplIdx] : null;
  const addTemplate = () => {
    const id = `lec-tpl-${Date.now()}`;
    setTemplates((arr) => [...arr, { id, name: '새 템플릿', schedule: [], notes: [] }]);
    setActiveTplIdx(templates.length);
  };
  const removeTemplate = (i) => {
    if (!confirm(`"${templates[i]?.name || '템플릿'}" 을 삭제하시겠어요?`)) return;
    setTemplates((arr) => arr.filter((_, j) => j !== i));
    if (activeTplIdx >= templates.length - 1) setActiveTplIdx(-1);
  };
  const updateActiveTpl = (patch) => {
    if (activeTplIdx < 0) return;
    setTemplates((arr) => arr.map((t, j) => j === activeTplIdx ? { ...t, ...patch } : t));
  };
  const saveTemplates = async () => {
    try {
      const clean = templates.map((t) => ({
        id: t.id || `lec-tpl-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
        name: String(t.name || '이름 없음'),
        schedule: (Array.isArray(t.schedule) ? t.schedule : []).filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ''), l: String(s.l || '') })),
        notes: (Array.isArray(t.notes) ? t.notes : []).filter((p) => p && String(p).trim()).map((p) => String(p).trim()),
      }));
      await window.BGNJ_SITE_CONTENT.saveSection('lectureTemplates', clean);
      setTick((v) => v + 1);
      flash('템플릿 저장됨.');
    } catch (err) { alert('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };

  // ── 강연별 ─────────────────────────────────────
  const lectures = React.useMemo(() => {
    try { return (window.BGNJ_LECTURES?.listAll?.() || []).slice(); } catch { return []; }
  }, [tick]);
  const [activeLectureId, setActiveLectureId] = React.useState('');
  const lecturePages = sc.lecturePages || {};
  const activeOverride = activeLectureId ? (lecturePages[activeLectureId] || null) : null;
  const [pSchedule, setPSchedule] = React.useState([]);
  const [pNotes, setPNotes] = React.useState([]);
  const [pTemplateId, setPTemplateId] = React.useState('');
  const [pCover, setPCover] = React.useState('');
  React.useEffect(() => {
    if (!activeLectureId) { setPSchedule([]); setPNotes([]); setPTemplateId(''); setPCover(''); return; }
    const ovr = lecturePages[activeLectureId] || {};
    setPSchedule(Array.isArray(ovr.schedule) ? ovr.schedule.slice() : []);
    setPNotes(Array.isArray(ovr.notes) ? ovr.notes.slice() : []);
    setPTemplateId(ovr.templateId || '');
    setPCover(ovr.coverDataUri || '');
  }, [activeLectureId, tick]);
  const applyTplToPerLecture = (tplId) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    setPSchedule(Array.isArray(tpl.schedule) ? tpl.schedule.map((s) => ({ ...s })) : []);
    setPNotes(Array.isArray(tpl.notes) ? tpl.notes.slice() : []);
    setPTemplateId(tplId);
  };
  const savePerLecture = async () => {
    if (!activeLectureId) { alert('강연을 먼저 선택해 주세요.'); return; }
    try {
      const cleanS = pSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ''), l: String(s.l || '') }));
      const cleanN = pNotes.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      const next = { ...lecturePages, [activeLectureId]: {
        schedule: cleanS, notes: cleanN,
        templateId: pTemplateId || undefined,
        coverDataUri: pCover || undefined,
      } };
      await window.BGNJ_SITE_CONTENT.saveSection('lecturePages', next);
      setTick((v) => v + 1);
      flash(`'${activeLectureId}' 강연 override 저장됨.`);
    } catch (err) { alert('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };
  // v00.083 — 커버 이미지 업로드. R2 우선 (5MB) + dataURI 폴백 (1.5MB).
  const onPickCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await window.BGNJ_MEDIA.uploadFile(file, { folder: 'lecture-covers', maxBytes: 5 * 1024 * 1024 });
      setPCover(url);
      e.target.value = '';
      return;
    } catch (err) {
      console.warn('[v00.083] R2 업로드 실패 — dataURI 폴백:', err);
    }
    if (file.size > 1.5 * 1024 * 1024) {
      alert(`이미지가 너무 큽니다(${(file.size/1024/1024).toFixed(1)}MB). R2 실패 + 1.5MB 폴백 한도 초과.`);
      e.target.value = ''; return;
    }
    const dataUri = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    setPCover(dataUri);
    e.target.value = '';
  };
  const clearPerLecture = async () => {
    if (!activeLectureId) return;
    if (!confirm(`'${activeLectureId}' 강연의 override 를 제거하고 글로벌로 폴백하시겠어요?`)) return;
    try {
      const next = { ...lecturePages };
      delete next[activeLectureId];
      await window.BGNJ_SITE_CONTENT.saveSection('lecturePages', next);
      setPSchedule([]); setPNotes([]); setPTemplateId(''); setPCover('');
      setTick((v) => v + 1);
      flash('override 제거됨 — 글로벌 fallback 적용.');
    } catch (err) { alert('실패: ' + (err?.message || '알 수 없는 오류')); }
  };

  // 미리보기 입력 (모드별).
  const previewSchedule = mode === 'global' ? gSchedule : (mode === 'templates' ? (activeTpl?.schedule || []) : pSchedule);
  const previewNotes    = mode === 'global' ? gNotes    : (mode === 'templates' ? (activeTpl?.notes    || []) : pNotes);

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:14, lineHeight:1.8}}>
        <code>/lectures</code> 페이지의 <strong className="gold">강연 진행</strong>과 <strong className="gold">참고</strong> 편집.
        우선순위: <strong>강연별 override</strong> &gt; <strong>템플릿</strong> &gt; <strong>글로벌</strong> &gt; 코드 default.
      </p>
      <div role="tablist" aria-label="편집 모드" style={{display:'flex', gap:6, marginBottom:14, flexWrap:'wrap'}}>
        {[
          { key: 'global',       label: '글로벌 (모든 강연 공통)' },
          { key: 'templates',    label: '템플릿' },
          { key: 'per_lecture',  label: '강연별 override' },
        ].map((m) => {
          const on = mode === m.key;
          return (
            <button key={m.key} type="button" role="tab" aria-selected={on}
              onClick={() => setMode(m.key)}
              className="btn btn-small"
              style={{
                fontSize:12,
                borderColor: on ? 'var(--primary)' : 'var(--line-2)',
                color: on ? 'var(--primary)' : 'var(--ink)',
                background: on ? 'rgba(245,213,72,0.10)' : 'var(--bg-2)',
                fontWeight: on ? 700 : 500,
              }}>{m.label}</button>
          );
        })}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'minmax(0, 1fr) minmax(0, 1fr)', gap:20}} className="hero-editor-grid">
        {/* 좌: 편집 */}
        <div>
          {mode === 'global' && (
            <>
              <TPE_ScheduleEditor rows={gSchedule}
                onAdd={() => setGSchedule((a) => _arrAdd(a, { t: '', l: '' }))}
                onRemove={(i) => setGSchedule((a) => _arrRemove(a, i))}
                onUpdate={(i, k, v) => setGSchedule((a) => { const n = a.slice(); n[i] = { ...n[i], [k]: v }; return n; })}
                onMove={(i, d) => setGSchedule((a) => _arrMove(a, i, d))}/>
              <LPE_NotesEditor rows={gNotes}
                onAdd={() => setGNotes((a) => _arrAdd(a, ''))}
                onRemove={(i) => setGNotes((a) => _arrRemove(a, i))}
                onUpdate={(i, v) => setGNotes((a) => _arrUpdate(a, i, v))}
                onMove={(i, d) => setGNotes((a) => _arrMove(a, i, d))}/>
              <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                <button type="button" className="btn btn-gold" onClick={saveGlobal}>저장</button>
                <button type="button" className="btn btn-small" onClick={resetGlobal} style={{borderColor:'var(--line-2)'}}>default 복원</button>
              </div>
            </>
          )}

          {mode === 'templates' && (
            <>
              <div className="card" style={{padding:14, marginBottom:14}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
                  <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em'}}>템플릿 목록</div>
                  <button type="button" className="btn btn-small" onClick={addTemplate}>＋ 새 템플릿</button>
                </div>
                {templates.length === 0 && (
                  <p className="dim-2" style={{fontSize:11, lineHeight:1.6}}>아직 템플릿이 없습니다. 자주 쓰는 강연 진행/참고 패턴을 저장해 두면 강연별 override 에서 빠르게 적용할 수 있습니다.</p>
                )}
                <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                  {templates.map((t, i) => (
                    <button key={t.id || i} type="button" className="btn btn-small"
                      onClick={() => setActiveTplIdx(i)}
                      style={{
                        fontSize:11,
                        borderColor: activeTplIdx === i ? 'var(--primary)' : 'var(--line-2)',
                        color: activeTplIdx === i ? 'var(--primary)' : 'var(--ink)',
                        fontWeight: activeTplIdx === i ? 700 : 500,
                      }}>{t.name || '이름 없음'}</button>
                  ))}
                </div>
              </div>
              {activeTpl && (
                <>
                  <div className="card" style={{padding:14, marginBottom:14}}>
                    <label style={{display:'block', marginBottom:8}}>
                      <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:5}}>템플릿 이름</div>
                      <input type="text" className="field-input" value={activeTpl.name || ''}
                        onChange={(e) => updateActiveTpl({ name: e.target.value })}
                        style={{width:'100%', padding:'6px 10px', fontSize:13}}/>
                    </label>
                    <button type="button" className="btn btn-small" onClick={() => removeTemplate(activeTplIdx)}
                      style={{borderColor:'var(--danger)', color:'var(--danger)', fontSize:10}}>이 템플릿 삭제</button>
                  </div>
                  <TPE_ScheduleEditor rows={activeTpl.schedule || []}
                    onAdd={() => updateActiveTpl({ schedule: _arrAdd(activeTpl.schedule || [], { t: '', l: '' }) })}
                    onRemove={(i) => updateActiveTpl({ schedule: _arrRemove(activeTpl.schedule || [], i) })}
                    onUpdate={(i, k, v) => { const n = (activeTpl.schedule || []).slice(); n[i] = { ...n[i], [k]: v }; updateActiveTpl({ schedule: n }); }}
                    onMove={(i, d) => updateActiveTpl({ schedule: _arrMove(activeTpl.schedule || [], i, d) })}/>
                  <LPE_NotesEditor rows={activeTpl.notes || []}
                    onAdd={() => updateActiveTpl({ notes: _arrAdd(activeTpl.notes || [], '') })}
                    onRemove={(i) => updateActiveTpl({ notes: _arrRemove(activeTpl.notes || [], i) })}
                    onUpdate={(i, v) => updateActiveTpl({ notes: _arrUpdate(activeTpl.notes || [], i, v) })}
                    onMove={(i, d) => updateActiveTpl({ notes: _arrMove(activeTpl.notes || [], i, d) })}/>
                </>
              )}
              <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                <button type="button" className="btn btn-gold" onClick={saveTemplates}>모든 템플릿 저장</button>
              </div>
            </>
          )}

          {mode === 'per_lecture' && (
            <>
              <div className="card" style={{padding:14, marginBottom:14}}>
                <label style={{display:'block', marginBottom:10}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:5}}>강연 선택</div>
                  <select value={activeLectureId} onChange={(e) => setActiveLectureId(e.target.value)} className="field-input"
                    style={{width:'100%', padding:'8px 10px', fontSize:13}}>
                    <option value="">— 강연을 선택 —</option>
                    {lectures.map((l) => (
                      <option key={l.id} value={l.id}>{l.title || l.id} {lecturePages[l.id] ? '· override 있음' : ''}</option>
                    ))}
                  </select>
                </label>
                {activeLectureId && (
                  <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
                    <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.16em'}}>템플릿 적용:</span>
                    <select value={pTemplateId || ''} onChange={(e) => applyTplToPerLecture(e.target.value)} className="field-input"
                      style={{padding:'6px 8px', fontSize:12, minWidth:160}}>
                      <option value="">— 직접 편집 —</option>
                      {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
              {activeLectureId ? (
                <>
                  {/* 커버 이미지 (R2 우선) */}
                  <div className="card" style={{padding:14, marginBottom:14}}>
                    <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em', marginBottom:10}}>커버 이미지 (선택)</div>
                    <div style={{display:'flex', gap:14, alignItems:'center'}}>
                      <div style={{
                        width:120, height:75, flexShrink:0,
                        border:'1px solid var(--line)', background:'var(--bg-2)',
                        display:'grid', placeItems:'center', overflow:'hidden',
                      }}>
                        {pCover
                          ? <img src={pCover} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                          : <span className="dim-2 mono" style={{fontSize:9, letterSpacing:'0.18em'}}>NONE</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div className="dim-2" style={{fontSize:11, lineHeight:1.5}}>
                          1600×1000 권장 · R2 5MB / dataURI 폴백 1.5MB · 비우면 placeholder.
                        </div>
                      </div>
                      <div style={{display:'flex', gap:6}}>
                        <label className="btn btn-small" style={{cursor:'pointer'}}>
                          업로드
                          <input type="file" accept="image/*" onChange={onPickCover} style={{display:'none'}}/>
                        </label>
                        {pCover && (
                          <button type="button" className="btn btn-small" onClick={() => setPCover('')}
                            style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                        )}
                      </div>
                    </div>
                  </div>
                  <TPE_ScheduleEditor rows={pSchedule}
                    onAdd={() => setPSchedule((a) => _arrAdd(a, { t: '', l: '' }))}
                    onRemove={(i) => setPSchedule((a) => _arrRemove(a, i))}
                    onUpdate={(i, k, v) => setPSchedule((a) => { const n = a.slice(); n[i] = { ...n[i], [k]: v }; return n; })}
                    onMove={(i, d) => setPSchedule((a) => _arrMove(a, i, d))}/>
                  <LPE_NotesEditor rows={pNotes}
                    onAdd={() => setPNotes((a) => _arrAdd(a, ''))}
                    onRemove={(i) => setPNotes((a) => _arrRemove(a, i))}
                    onUpdate={(i, v) => setPNotes((a) => _arrUpdate(a, i, v))}
                    onMove={(i, d) => setPNotes((a) => _arrMove(a, i, d))}/>
                  <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                    <button type="button" className="btn btn-gold" onClick={savePerLecture}>이 강연 저장</button>
                    {activeOverride && (
                      <button type="button" className="btn btn-small" onClick={clearPerLecture}
                        style={{borderColor:'var(--danger)', color:'var(--danger)'}}>override 제거 (글로벌 fallback)</button>
                    )}
                  </div>
                </>
              ) : (
                <p className="dim-2" style={{fontSize:12, fontStyle:'italic'}}>강연을 선택하면 그 강연의 진행/참고/커버를 편집할 수 있습니다. 저장된 override 가 없으면 글로벌이 사용됩니다.</p>
              )}
            </>
          )}

          {msg && <p role="status" className="mono" style={{fontSize:12, color:'var(--secondary)', fontWeight:600, marginTop:10}}>{msg}</p>}
        </div>

        {/* 우: 미리보기 */}
        <div>
          <LPE_PreviewCard schedule={previewSchedule} notes={previewNotes}/>
        </div>
      </div>
    </div>
  );
};

// === Footer Style Editor (v00.057) =====================================
// 푸터 3 그룹(description/signature/heading) 의 폰트·색상 GUI 편집.
// site_content_kv.footerStyle 저장 → Shell.jsx Footer 가 BGNJ_FOOTER_STYLE() 로 인라인 적용.
const FOOTER_COLOR_OPTIONS = [
  { value: '--ink',           label: '메인 잉크 (--ink)' },
  { value: '--ink-2',         label: '보조 잉크 (--ink-2)' },
  { value: '--ink-3',         label: '메타 잉크 (--ink-3)' },
  { value: '--primary',       label: '옐로우 (--primary)' },
  { value: '--secondary',     label: '카라멜 (--secondary)' },
  { value: '--tertiary',      label: '슬레이트 (--tertiary)' },
];
const FooterStyleEditor = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [draft, setDraft] = React.useState(() => ({ ...(sc.footerStyle && typeof sc.footerStyle === 'object' ? sc.footerStyle : {}) }));
  const [msg, setMsg] = React.useState('');

  const eff = React.useMemo(() => {
    const def = window.BGNJ_FOOTER_STYLE_DEFAULT;
    return {
      description: { ...def.description, ...(draft.description || {}) },
      signature:   { ...def.signature,   ...(draft.signature   || {}) },
      heading:     { ...def.heading,     ...(draft.heading     || {}) },
    };
  }, [draft]);

  const set = (group, key, value) =>
    setDraft((d) => ({ ...d, [group]: { ...(d[group] || {}), [key]: value } }));
  const resetGroup = (group) =>
    setDraft((d) => { const next = { ...d }; delete next[group]; return next; });

  const save = async () => {
    try {
      await window.BGNJ_SITE_CONTENT.saveSection('footerStyle', draft);
      setTick((v) => v + 1);
      setMsg('저장되었습니다 — 푸터에 즉시 반영.');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) { alert('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };
  const resetAll = async () => {
    if (!confirm('푸터 스타일을 default 로 복원합니다. 진행할까요?')) return;
    try {
      await window.BGNJ_SITE_CONTENT.resetSection('footerStyle');
      setDraft({});
      setTick((v) => v + 1);
      setMsg('default 로 복원됨.');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) { alert('복원 실패: ' + (err?.message || '알 수 없는 오류')); }
  };

  // 모듈 최상위 HE_* 재사용 — IME 입력 안전 (v00.058 핫픽스).
  const Field = HE_Field;
  const NumberRange = HE_NumberRange;
  const Select = HE_Select;

  return (
    <div style={{marginTop:24, marginBottom:24}}>
      <h3 className="ko-serif" style={{fontSize:16, marginBottom:6}}>푸터 스타일 트윗</h3>
      <p className="dim" style={{fontSize:12, marginBottom:14, lineHeight:1.7}}>
        푸터 영역의 헤딩(콘텐츠/정보/연락) · 소개 문단 · 하단 서명의 폰트와 색상을 직접 편집합니다. 저장 시 즉시 반영.
      </p>
      <div style={{display:'grid', gridTemplateColumns:'minmax(0, 1fr) minmax(0, 1fr)', gap:16}} className="hero-editor-grid">
        <div>
          <HE_StyleGroup title="DESCRIPTION (소개 문단)" onResetGroup={() => resetGroup("description")}>
            <Field label={`폰트 크기 · ${eff.description.fontSize}px`}>
              <NumberRange value={eff.description.fontSize} min={11} max={20} step={1}
                onChange={(v) => set('description', 'fontSize', v)}/>
            </Field>
            <Field label="굵기">
              <Select value={String(eff.description.fontWeight)} options={HERO_WEIGHTS.map(String)}
                onChange={(v) => set('description', 'fontWeight', Number(v))}/>
            </Field>
            <Field label={`행간 · ${eff.description.lineHeight}`}>
              <NumberRange value={eff.description.lineHeight} min={1.2} max={2.4} step={0.05}
                onChange={(v) => set('description', 'lineHeight', v)}/>
            </Field>
            <Field label="색상">
              <Select value={eff.description.color} options={FOOTER_COLOR_OPTIONS}
                onChange={(v) => set('description', 'color', v)}/>
            </Field>
            <Field label={`최대 너비 · ${eff.description.maxWidth}px`}>
              <NumberRange value={eff.description.maxWidth} min={240} max={600} step={10}
                onChange={(v) => set('description', 'maxWidth', v)}/>
            </Field>
          </HE_StyleGroup>
          <HE_StyleGroup title="HEADING (콘텐츠/정보/연락)" onResetGroup={() => resetGroup("heading")}>
            <Field label={`폰트 크기 · ${eff.heading.fontSize}px`}>
              <NumberRange value={eff.heading.fontSize} min={10} max={20} step={1}
                onChange={(v) => set('heading', 'fontSize', v)}/>
            </Field>
            <Field label="굵기">
              <Select value={String(eff.heading.fontWeight)} options={HERO_WEIGHTS.map(String)}
                onChange={(v) => set('heading', 'fontWeight', Number(v))}/>
            </Field>
            <Field label={`자간 · ${eff.heading.letterSpacing}em`}>
              <NumberRange value={eff.heading.letterSpacing} min={0} max={0.3} step={0.01}
                onChange={(v) => set('heading', 'letterSpacing', v)}/>
            </Field>
            <Field label="색상">
              <Select value={eff.heading.color} options={FOOTER_COLOR_OPTIONS}
                onChange={(v) => set('heading', 'color', v)}/>
            </Field>
          </HE_StyleGroup>
          <HE_StyleGroup title="SIGNATURE (하단 서명)" onResetGroup={() => resetGroup("signature")}>
            <Field label={`폰트 크기 · ${eff.signature.fontSize}px`}>
              <NumberRange value={eff.signature.fontSize} min={9} max={16} step={1}
                onChange={(v) => set('signature', 'fontSize', v)}/>
            </Field>
            <Field label="굵기">
              <Select value={String(eff.signature.fontWeight)} options={HERO_WEIGHTS.map(String)}
                onChange={(v) => set('signature', 'fontWeight', Number(v))}/>
            </Field>
            <Field label={`자간 · ${eff.signature.letterSpacing}em`}>
              <NumberRange value={eff.signature.letterSpacing} min={0} max={0.4} step={0.01}
                onChange={(v) => set('signature', 'letterSpacing', v)}/>
            </Field>
            <Field label="색상">
              <Select value={eff.signature.color} options={FOOTER_COLOR_OPTIONS}
                onChange={(v) => set('signature', 'color', v)}/>
            </Field>
            <Field label="대소문자">
              <Select value={eff.signature.textTransform || 'uppercase'} options={HERO_TFORMS}
                onChange={(v) => set('signature', 'textTransform', v)}/>
            </Field>
          </HE_StyleGroup>
          <div style={{display:'flex', gap:10, marginTop:12, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-gold btn-small" onClick={save}>저장</button>
            <button type="button" className="btn btn-small" onClick={resetAll} style={{borderColor:'var(--line-2)'}}>전체 default 복원</button>
            {msg && <span role="status" className="mono" style={{fontSize:12, color:'var(--secondary)', fontWeight:600, alignSelf:'center'}}>{msg}</span>}
          </div>
        </div>

        {/* 미리보기 */}
        <div>
          <div className="card" style={{padding:0, overflow:'hidden', position:'sticky', top:24}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', padding:'8px 12px', borderBottom:'1px solid var(--line)', background:'var(--bg-2)'}}>
              PREVIEW · 푸터
            </div>
            <div style={{padding:'24px', background:'var(--bg)'}}>
              <p style={{
                fontSize: eff.description.fontSize,
                fontWeight: eff.description.fontWeight,
                lineHeight: eff.description.lineHeight,
                color: `var(${eff.description.color})`,
                maxWidth: eff.description.maxWidth,
                marginBottom: 24,
              }}>
                {sc.footer?.description || '뱅기타고 노자. 뱅기노자는 한국의 역사·문화·자연을 직접 걷고 느끼며 나누는 여행 커뮤니티입니다.'}
              </p>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20}}>
                {['콘텐츠', '정보'].map((h) => (
                  <div key={h}>
                    <h4 style={{
                      fontSize: eff.heading.fontSize,
                      fontWeight: eff.heading.fontWeight,
                      letterSpacing: `${eff.heading.letterSpacing}em`,
                      color: `var(${eff.heading.color})`,
                      marginBottom:8,
                    }}>{h}</h4>
                    <ul style={{listStyle:'none', padding:0, margin:0, fontSize:12, color:'var(--ink-2)'}}>
                      <li style={{marginBottom:4}}>예시 항목 1</li>
                      <li style={{marginBottom:4}}>예시 항목 2</li>
                    </ul>
                  </div>
                ))}
              </div>
              <div style={{paddingTop:14, borderTop:'1px solid var(--line)', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center'}}>
                <span style={{fontSize:11, color:'var(--ink-3)'}}>© 2026 뱅기노자 BANGINOJA</span>
                <span style={{
                  fontSize: eff.signature.fontSize,
                  fontWeight: eff.signature.fontWeight,
                  letterSpacing: `${eff.signature.letterSpacing}em`,
                  color: `var(${eff.signature.color})`,
                  textTransform: eff.signature.textTransform || 'uppercase',
                }}>
                  {sc.footer?.signature || '뱅기타고 노자 · DESIGNED IN SEOUL'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// === Hero Editor (v00.054) =========================================
// 관리자 '히어로' 탭 — 홈페이지 히어로 영역의 모든 콘텐츠 + 스타일을 GUI 로 편집.
// 콘텐츠 → site_content_kv.hero / 스타일 → site_content_kv.heroStyle 두 섹션 분리 저장.
// 라이브 미리보기는 HomePage Hero 와 동일 마크업/스타일로 즉시 반영.
//
// 내부 컴포넌트(Field/Input/TextArea/Select/NumberRange/StyleGroup) 를 모듈 최상위로 호이스팅.
// HeroEditorPanel 안에 두면 매 렌더마다 새 함수 ref 가 만들어져 React 가 다른 컴포넌트로 인식 →
// input element 가 매번 unmount/mount → IME(한글) composition 끊김 (v00.058 핫픽스).
const HE_Field = ({ label, children, hint }) => (
  <label style={{display:'block', marginBottom:14}}>
    <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:6}}>{label}</div>
    {children}
    {hint && <div className="dim-2" style={{fontSize:11, marginTop:4, lineHeight:1.5}}>{hint}</div>}
  </label>
);
const HE_Input = (props) => (
  <input {...props} className="field-input" style={{width:'100%', padding:'8px 10px', fontSize:13, ...props.style}}/>
);
const HE_TextArea = (props) => (
  <textarea {...props} className="field-input" style={{width:'100%', padding:'8px 10px', fontSize:13, minHeight:64, fontFamily:'inherit', resize:'vertical', ...props.style}}/>
);
const HE_Select = ({ value, options, onChange, ...rest }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className="field-input"
    style={{width:'100%', padding:'8px 10px', fontSize:13}} {...rest}>
    {options.map((o) => typeof o === 'object'
      ? <option key={o.value} value={o.value}>{o.label}</option>
      : <option key={o} value={o}>{o}</option>)}
  </select>
);
const HE_NumberRange = ({ value, min, max, step, onChange }) => (
  <div style={{display:'flex', gap:8, alignItems:'center'}}>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))} style={{flex:1}}/>
    <input type="number" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="field-input" style={{width:80, padding:'4px 6px', fontSize:12, fontFamily:'var(--font-mono)'}}/>
  </div>
);
const HE_StyleGroup = ({ title, children, onResetGroup }) => (
  <div className="card" style={{padding:16, marginBottom:14}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
      <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em'}}>{title}</div>
      {onResetGroup && <button type="button" className="btn btn-small" onClick={onResetGroup} style={{fontSize:10}}>이 그룹 default</button>}
    </div>
    {children}
  </div>
);

const HERO_COLOR_OPTIONS = [
  { value: '--ink',           label: '메인 잉크 (--ink)' },
  { value: '--ink-2',         label: '보조 잉크 (--ink-2)' },
  { value: '--ink-3',         label: '메타 잉크 (--ink-3)' },
  { value: '--primary',       label: '옐로우 (--primary)' },
  { value: '--primary-active',label: '딥 옐로우 (--primary-active)' },
  { value: '--secondary',     label: '카라멜 (--secondary)' },
  { value: '--tertiary',      label: '슬레이트 (--tertiary)' },
];
const HERO_WEIGHTS  = [300, 400, 500, 600, 700, 800, 900];
const HERO_ALIGNS   = ['left', 'center', 'right'];
const HERO_TFORMS   = ['none', 'uppercase', 'lowercase', 'capitalize'];

const HeroEditorPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [contentDraft, setContentDraft] = React.useState(() => ({ ...(sc.hero || {}) }));
  const [styleDraft,   setStyleDraft]   = React.useState(() => ({ ...(sc.heroStyle && typeof sc.heroStyle === 'object' ? sc.heroStyle : {}) }));
  const [msg, setMsg] = React.useState('');

  // 통계 카드 — 3개 슬롯이며 valueFallback 은 동적 value(투어/커뮤니티 갯수) 가 없을 때만 표시.
  const initialStats = (Array.isArray(sc.hero?.stats) && sc.hero.stats.length === 3) ? sc.hero.stats : [
    { label: '여행지',   sub: '주요 답사지 운영',   valueFallback: '전국'    },
    { label: '투어',     sub: '직접 기획 프로그램', valueFallback: '준비 중' },
    { label: '커뮤니티', sub: '함께 만드는 여행',   valueFallback: '운영 중' },
  ];
  const [statsDraft, setStatsDraft] = React.useState(initialStats);
  const updateStats = (idx, key, value) => setStatsDraft((arr) => {
    const next = arr.slice();
    next[idx] = { ...next[idx], [key]: value };
    return next;
  });

  const updateContent = (k, v) => setContentDraft((d) => ({ ...d, [k]: v }));
  const updateStyle = (group, key, value) =>
    setStyleDraft((d) => ({ ...d, [group]: { ...(d[group] || {}), [key]: value } }));
  const resetGroup = (group) =>
    setStyleDraft((d) => { const next = { ...d }; delete next[group]; return next; });

  // 데스크탑 effective.
  const eff = React.useMemo(() => {
    const def = window.BGNJ_HERO_STYLE_DEFAULT;
    return {
      eyebrow:  { ...def.eyebrow,  ...(styleDraft.eyebrow  || {}) },
      title:    { ...def.title,    ...(styleDraft.title    || {}) },
      subtitle: { ...def.subtitle, ...(styleDraft.subtitle || {}) },
      cta:      { ...def.cta,      ...(styleDraft.cta      || {}) },
      stats:    {
        label: { ...def.stats.label, ...(styleDraft.stats?.label || {}) },
        value: { ...def.stats.value, ...(styleDraft.stats?.value || {}) },
        sub:   { ...def.stats.sub,   ...(styleDraft.stats?.sub   || {}) },
      },
    };
  }, [styleDraft]);
  // 모바일 effective (v00.058) — 데스크탑 위에 mobile override 머지.
  const effMobile = React.useMemo(() => {
    const def = window.BGNJ_HERO_STYLE_DEFAULT;
    const m = { ...(def.mobile || {}), ...(styleDraft.mobile || {}) };
    const merge = (k) => ({ ...def[k], ...(styleDraft[k] || {}), ...(m[k] || {}) });
    const stats = {};
    for (const sub of ['label', 'value', 'sub']) {
      stats[sub] = {
        ...def.stats[sub], ...(styleDraft.stats?.[sub] || {}),
        ...(def.mobile?.stats?.[sub] || {}), ...(m.stats?.[sub] || {}),
      };
    }
    return { eyebrow: merge('eyebrow'), title: merge('title'), subtitle: merge('subtitle'), cta: merge('cta'), stats };
  }, [styleDraft]);
  const [previewMode, setPreviewMode] = React.useState('desktop');
  const effPreview = previewMode === 'mobile' ? effMobile : eff;

  const updateStatsStyle = (sub, key, value) =>
    setStyleDraft((d) => ({ ...d, stats: { ...(d.stats || {}), [sub]: { ...((d.stats || {})[sub] || {}), [key]: value } } }));
  const resetStatsGroup = (sub) =>
    setStyleDraft((d) => { const stats = { ...(d.stats || {}) }; delete stats[sub]; return { ...d, stats }; });
  // 모바일 override 헬퍼 (v00.058) — styleDraft.mobile.{group} 편집.
  const updateMobile = (group, key, value) =>
    setStyleDraft((d) => ({
      ...d,
      mobile: {
        ...(d.mobile || {}),
        [group]: { ...((d.mobile || {})[group] || {}), [key]: value },
      },
    }));
  const updateMobileStats = (sub, key, value) =>
    setStyleDraft((d) => {
      const mob = { ...(d.mobile || {}) };
      mob.stats = { ...(mob.stats || {}) };
      mob.stats[sub] = { ...(mob.stats[sub] || {}), [key]: value };
      return { ...d, mobile: mob };
    });
  const resetMobileGroup = (group) =>
    setStyleDraft((d) => {
      const mob = { ...(d.mobile || {}) };
      delete mob[group];
      return { ...d, mobile: mob };
    });

  const save = async () => {
    try {
      // contentDraft 에 stats 도 합쳐서 저장 (히어로 단일 섹션).
      const heroPayload = { ...contentDraft, stats: statsDraft };
      await window.BGNJ_SITE_CONTENT.saveSection('hero', heroPayload);
      await window.BGNJ_SITE_CONTENT.saveSection('heroStyle', styleDraft);
      setTick((v) => v + 1);
      setMsg('저장되었습니다 — 홈에 즉시 반영됩니다.');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) { alert('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };
  const resetAll = async () => {
    if (!confirm('히어로 콘텐츠와 스타일을 모두 default 로 복원합니다. 진행할까요?')) return;
    try {
      await window.BGNJ_SITE_CONTENT.resetSection('hero');
      await window.BGNJ_SITE_CONTENT.resetSection('heroStyle');
      setContentDraft({});
      setStyleDraft({});
      setStatsDraft(initialStats);
      setTick((v) => v + 1);
      setMsg('default 로 복원됨.');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) { alert('복원 실패: ' + (err?.message || '알 수 없는 오류')); }
  };

  // 작은 컴포넌트들은 모듈 최상위(HE_*)에 정의되어 있음 — IME/한글 입력 핫픽스(v00.058).
  // 부모 함수 안에서 정의하면 매 렌더 새 함수 ref → input remount → composition 끊김.
  const Field = HE_Field;
  const Input = HE_Input;
  const TextArea = HE_TextArea;
  const Select = HE_Select;
  const NumberRange = HE_NumberRange;

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:16, lineHeight:1.8}}>
        홈페이지 <strong className="gold">히어로 영역</strong> 의 콘텐츠와 스타일을 직접 편집합니다.
        저장 시 즉시 홈에 반영됩니다 (관리자 외 회원에게도 영향). default 로 복원하려면 우측 상단 버튼.
      </p>

      <div style={{display:'grid', gridTemplateColumns:'minmax(0, 1fr) minmax(0, 1fr)', gap:20}} className="hero-editor-grid">
        {/* 좌: 콘텐츠 + 스타일 */}
        <div>
          <h3 className="ko-serif" style={{fontSize:16, marginBottom:10}}>콘텐츠</h3>
          <div className="card" style={{padding:16, marginBottom:20}}>
            <Field label="EYEBROW (소제목)">
              <Input value={contentDraft.eyebrow ?? ''} onChange={(e) => updateContent('eyebrow', e.target.value)}
                placeholder="BANGINOJA · 뱅기타고 노자"/>
            </Field>
            <Field label="TITLE 1 (대제목 1행)">
              <Input value={contentDraft.title1 ?? ''} onChange={(e) => updateContent('title1', e.target.value)} placeholder="뱅기타고"/>
            </Field>
            <Field label="TITLE 2 (대제목 2행 — 옐로우 강조)">
              <Input value={contentDraft.title2 ?? ''} onChange={(e) => updateContent('title2', e.target.value)} placeholder="한국을"/>
            </Field>
            <Field label="TITLE 3 (대제목 3행)">
              <Input value={contentDraft.title3 ?? ''} onChange={(e) => updateContent('title3', e.target.value)} placeholder="느끼다"/>
            </Field>
            <Field label="SUBTITLE (본문)">
              <TextArea value={contentDraft.subtitle ?? ''} onChange={(e) => updateContent('subtitle', e.target.value)}
                placeholder="궁궐 답사부터 …"/>
            </Field>
            <Field label="MAP HINT (지도 버튼 텍스트)">
              <Input value={contentDraft.mapHint ?? ''} onChange={(e) => updateContent('mapHint', e.target.value)}
                placeholder="지도에서 여행지 찾기 →"/>
            </Field>
            <Field label="CTA PRIMARY (커뮤니티 버튼)">
              <Input value={contentDraft.ctaPrimary ?? ''} onChange={(e) => updateContent('ctaPrimary', e.target.value)} placeholder="커뮤니티 참여하기"/>
            </Field>
            <Field label="CTA SECONDARY (투어 버튼)" hint="비워두면 default 사용. 모든 트윗은 즉시 미리보기에 반영.">
              <Input value={contentDraft.ctaSecondary ?? ''} onChange={(e) => updateContent('ctaSecondary', e.target.value)} placeholder="투어 프로그램 보기"/>
            </Field>
          </div>

          <h3 className="ko-serif" style={{fontSize:16, marginBottom:10}}>스타일 트윗</h3>
          <HE_StyleGroup title="EYEBROW 스타일" onResetGroup={() => resetGroup("eyebrow")}>
            <Field label={`폰트 크기 · ${eff.eyebrow.fontSize}px`}>
              <NumberRange value={eff.eyebrow.fontSize} min={8} max={24} step={1}
                onChange={(v) => updateStyle('eyebrow', 'fontSize', v)}/>
            </Field>
            <Field label="굵기">
              <Select value={String(eff.eyebrow.fontWeight)} options={HERO_WEIGHTS.map(String)}
                onChange={(v) => updateStyle('eyebrow', 'fontWeight', Number(v))}/>
            </Field>
            <Field label={`자간 · ${eff.eyebrow.letterSpacing}em`}>
              <NumberRange value={eff.eyebrow.letterSpacing} min={-0.05} max={0.5} step={0.01}
                onChange={(v) => updateStyle('eyebrow', 'letterSpacing', v)}/>
            </Field>
            <Field label="색상">
              <Select value={eff.eyebrow.color} options={HERO_COLOR_OPTIONS}
                onChange={(v) => updateStyle('eyebrow', 'color', v)}/>
            </Field>
            <Field label="대소문자">
              <Select value={eff.eyebrow.textTransform || 'uppercase'} options={HERO_TFORMS}
                onChange={(v) => updateStyle('eyebrow', 'textTransform', v)}/>
            </Field>
          </HE_StyleGroup>
          <HE_StyleGroup title="TITLE 스타일" onResetGroup={() => resetGroup("title")}>
            <Field label={`최대 폰트 크기 · ${eff.title.fontSize}px (모바일은 36px clamp)`}>
              <NumberRange value={eff.title.fontSize} min={32} max={120} step={1}
                onChange={(v) => updateStyle('title', 'fontSize', v)}/>
            </Field>
            <Field label="굵기">
              <Select value={String(eff.title.fontWeight)} options={HERO_WEIGHTS.map(String)}
                onChange={(v) => updateStyle('title', 'fontWeight', Number(v))}/>
            </Field>
            <Field label={`행간 · ${eff.title.lineHeight}`}>
              <NumberRange value={eff.title.lineHeight} min={0.9} max={1.6} step={0.01}
                onChange={(v) => updateStyle('title', 'lineHeight', v)}/>
            </Field>
            <Field label={`자간 · ${eff.title.letterSpacing}em`}>
              <NumberRange value={eff.title.letterSpacing} min={-0.08} max={0.1} step={0.005}
                onChange={(v) => updateStyle('title', 'letterSpacing', v)}/>
            </Field>
            <Field label="색상">
              <Select value={eff.title.color} options={HERO_COLOR_OPTIONS}
                onChange={(v) => updateStyle('title', 'color', v)}/>
            </Field>
            <Field label="강조 색상 (TITLE 2)">
              <Select value={eff.title.accentColor} options={HERO_COLOR_OPTIONS}
                onChange={(v) => updateStyle('title', 'accentColor', v)}/>
            </Field>
            <Field label="정렬 (히어로 전체)">
              <Select value={eff.title.textAlign || 'left'} options={HERO_ALIGNS}
                onChange={(v) => updateStyle('title', 'textAlign', v)}/>
            </Field>
          </HE_StyleGroup>
          <HE_StyleGroup title="SUBTITLE 스타일" onResetGroup={() => resetGroup("subtitle")}>
            <Field label={`폰트 크기 · ${eff.subtitle.fontSize}px`}>
              <NumberRange value={eff.subtitle.fontSize} min={12} max={28} step={1}
                onChange={(v) => updateStyle('subtitle', 'fontSize', v)}/>
            </Field>
            <Field label="굵기">
              <Select value={String(eff.subtitle.fontWeight)} options={HERO_WEIGHTS.map(String)}
                onChange={(v) => updateStyle('subtitle', 'fontWeight', Number(v))}/>
            </Field>
            <Field label={`행간 · ${eff.subtitle.lineHeight}`}>
              <NumberRange value={eff.subtitle.lineHeight} min={1.2} max={2.4} step={0.05}
                onChange={(v) => updateStyle('subtitle', 'lineHeight', v)}/>
            </Field>
            <Field label="색상">
              <Select value={eff.subtitle.color} options={HERO_COLOR_OPTIONS}
                onChange={(v) => updateStyle('subtitle', 'color', v)}/>
            </Field>
            <Field label={`최대 너비 · ${eff.subtitle.maxWidth}px`}>
              <NumberRange value={eff.subtitle.maxWidth} min={320} max={800} step={10}
                onChange={(v) => updateStyle('subtitle', 'maxWidth', v)}/>
            </Field>
          </HE_StyleGroup>
          <HE_StyleGroup title="CTA 버튼 스타일" onResetGroup={() => resetGroup("cta")}>
            <Field label="굵기">
              <Select value={String(eff.cta.fontWeight)} options={HERO_WEIGHTS.map(String)}
                onChange={(v) => updateStyle('cta', 'fontWeight', Number(v))}/>
            </Field>
          </HE_StyleGroup>

          {/* 모바일 별도 트윗 (v00.058) — 데스크탑 위에 머지. 비우면 데스크탑 그대로. */}
          <h3 className="ko-serif" style={{fontSize:16, marginBottom:10, marginTop:20}}>모바일 별도 트윗 (≤600px)</h3>
          <p className="dim-2" style={{fontSize:11, marginBottom:10, lineHeight:1.6}}>
            ⓘ 데스크탑 스타일 위에 머지됩니다. 빈 슬롯은 데스크탑 값 그대로 사용. 미리보기 우상단의 [모바일] 토글로 즉시 시뮬레이션.
          </p>
          <HE_StyleGroup title="MOBILE — 타이틀" onResetGroup={() => resetMobileGroup("title")}>
            <Field label={`폰트 크기 · ${effMobile.title.fontSize}px`}>
              <NumberRange value={effMobile.title.fontSize} min={20} max={72} step={1}
                onChange={(v) => updateMobile('title', 'fontSize', v)}/>
            </Field>
            <Field label={`행간 · ${effMobile.title.lineHeight}`}>
              <NumberRange value={effMobile.title.lineHeight} min={0.95} max={1.6} step={0.01}
                onChange={(v) => updateMobile('title', 'lineHeight', v)}/>
            </Field>
            <Field label={`자간 · ${effMobile.title.letterSpacing}em`}>
              <NumberRange value={effMobile.title.letterSpacing} min={-0.05} max={0.05} step={0.005}
                onChange={(v) => updateMobile('title', 'letterSpacing', v)}/>
            </Field>
          </HE_StyleGroup>
          <HE_StyleGroup title="MOBILE — 서브타이틀" onResetGroup={() => resetMobileGroup("subtitle")}>
            <Field label={`폰트 크기 · ${effMobile.subtitle.fontSize}px`}>
              <NumberRange value={effMobile.subtitle.fontSize} min={11} max={22} step={1}
                onChange={(v) => updateMobile('subtitle', 'fontSize', v)}/>
            </Field>
            <Field label={`행간 · ${effMobile.subtitle.lineHeight}`}>
              <NumberRange value={effMobile.subtitle.lineHeight} min={1.3} max={2.2} step={0.05}
                onChange={(v) => updateMobile('subtitle', 'lineHeight', v)}/>
            </Field>
            <Field label={`최대 너비 · ${effMobile.subtitle.maxWidth}px`}>
              <NumberRange value={effMobile.subtitle.maxWidth} min={240} max={500} step={10}
                onChange={(v) => updateMobile('subtitle', 'maxWidth', v)}/>
            </Field>
          </HE_StyleGroup>
          <HE_StyleGroup title="MOBILE — 통계 카드 값" onResetGroup={() => resetMobileGroup("stats")}>
            <Field label={`값 폰트 크기 · ${effMobile.stats.value.fontSize}px`}>
              <NumberRange value={effMobile.stats.value.fontSize} min={14} max={32} step={1}
                onChange={(v) => updateMobileStats('value', 'fontSize', v)}/>
            </Field>
            <Field label={`라벨 폰트 크기 · ${effMobile.stats.label.fontSize}px`}>
              <NumberRange value={effMobile.stats.label.fontSize} min={8} max={14} step={1}
                onChange={(v) => updateMobileStats('label', 'fontSize', v)}/>
            </Field>
            <Field label={`부연 폰트 크기 · ${effMobile.stats.sub.fontSize}px`}>
              <NumberRange value={effMobile.stats.sub.fontSize} min={9} max={16} step={1}
                onChange={(v) => updateMobileStats('sub', 'fontSize', v)}/>
            </Field>
          </HE_StyleGroup>

          {/* 통계 카드 — 콘텐츠 + 스타일 (v00.056) */}
          <h3 className="ko-serif" style={{fontSize:16, marginBottom:10, marginTop:20}}>통계 카드 콘텐츠</h3>
          <div className="card" style={{padding:16, marginBottom:14}}>
            {statsDraft.map((s, i) => (
              <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom: i < 2 ? 12 : 0}}>
                <Field label={`#${i+1} 라벨`}>
                  <Input value={s.label || ''} onChange={(e) => updateStats(i, 'label', e.target.value)} placeholder="여행지"/>
                </Field>
                <Field label={`#${i+1} 폴백 값`}>
                  <Input value={s.valueFallback || ''} onChange={(e) => updateStats(i, 'valueFallback', e.target.value)} placeholder="전국"/>
                </Field>
                <Field label={`#${i+1} 부연`}>
                  <Input value={s.sub || ''} onChange={(e) => updateStats(i, 'sub', e.target.value)} placeholder="주요 답사지 운영"/>
                </Field>
              </div>
            ))}
            <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.5}}>
              ⓘ #2(투어)·#3(커뮤니티)는 콘텐츠가 있으면 갯수(예: <code>3개</code>) 가 우선 표시되고, 없을 때만 폴백 값이 사용됩니다.
            </p>
          </div>
          <HE_StyleGroup title="통계 카드 — 라벨 스타일" onResetGroup={() => resetStatsGroup("label")}>
            <Field label={`폰트 크기 · ${eff.stats.label.fontSize}px`}>
              <NumberRange value={eff.stats.label.fontSize} min={8} max={20} step={1}
                onChange={(v) => updateStatsStyle('label', 'fontSize', v)}/>
            </Field>
            <Field label="굵기">
              <Select value={String(eff.stats.label.fontWeight)} options={HERO_WEIGHTS.map(String)}
                onChange={(v) => updateStatsStyle('label', 'fontWeight', Number(v))}/>
            </Field>
            <Field label={`자간 · ${eff.stats.label.letterSpacing}em`}>
              <NumberRange value={eff.stats.label.letterSpacing} min={0} max={0.5} step={0.01}
                onChange={(v) => updateStatsStyle('label', 'letterSpacing', v)}/>
            </Field>
            <Field label="색상">
              <Select value={eff.stats.label.color} options={HERO_COLOR_OPTIONS}
                onChange={(v) => updateStatsStyle('label', 'color', v)}/>
            </Field>
            <Field label="대소문자">
              <Select value={eff.stats.label.textTransform || 'uppercase'} options={HERO_TFORMS}
                onChange={(v) => updateStatsStyle('label', 'textTransform', v)}/>
            </Field>
          </HE_StyleGroup>
          <HE_StyleGroup title="통계 카드 — 값 스타일" onResetGroup={() => resetStatsGroup("value")}>
            <Field label={`폰트 크기 · ${eff.stats.value.fontSize}px`}>
              <NumberRange value={eff.stats.value.fontSize} min={14} max={48} step={1}
                onChange={(v) => updateStatsStyle('value', 'fontSize', v)}/>
            </Field>
            <Field label="굵기">
              <Select value={String(eff.stats.value.fontWeight)} options={HERO_WEIGHTS.map(String)}
                onChange={(v) => updateStatsStyle('value', 'fontWeight', Number(v))}/>
            </Field>
            <Field label="색상">
              <Select value={eff.stats.value.color} options={HERO_COLOR_OPTIONS}
                onChange={(v) => updateStatsStyle('value', 'color', v)}/>
            </Field>
          </HE_StyleGroup>
          <HE_StyleGroup title="통계 카드 — 부연 스타일" onResetGroup={() => resetStatsGroup("sub")}>
            <Field label={`폰트 크기 · ${eff.stats.sub.fontSize}px`}>
              <NumberRange value={eff.stats.sub.fontSize} min={10} max={20} step={1}
                onChange={(v) => updateStatsStyle('sub', 'fontSize', v)}/>
            </Field>
            <Field label="색상">
              <Select value={eff.stats.sub.color} options={HERO_COLOR_OPTIONS}
                onChange={(v) => updateStatsStyle('sub', 'color', v)}/>
            </Field>
          </HE_StyleGroup>

          <div style={{display:'flex', gap:10, marginTop:18, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-gold" onClick={save}>저장</button>
            <button type="button" className="btn btn-small" onClick={resetAll} style={{borderColor:'var(--line-2)'}}>전체 default 복원</button>
            {msg && <span role="status" className="mono" style={{fontSize:12, color:'var(--secondary)', fontWeight:600, alignSelf:'center'}}>{msg}</span>}
          </div>
        </div>

        {/* 우: 라이브 미리보기 */}
        <div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10, flexWrap:'wrap', gap:8}}>
            <h3 className="ko-serif" style={{fontSize:16}}>라이브 미리보기</h3>
            <div role="tablist" aria-label="미리보기 viewport" style={{display:'flex', gap:6}}>
              {[{ key:'desktop', label:'데스크탑' }, { key:'mobile', label:'모바일' }].map((m) => (
                <button key={m.key} type="button" role="tab" aria-selected={previewMode === m.key}
                  onClick={() => setPreviewMode(m.key)}
                  className="btn btn-small"
                  style={{
                    fontSize:11,
                    borderColor: previewMode === m.key ? 'var(--primary)' : 'var(--line-2)',
                    color: previewMode === m.key ? 'var(--primary)' : 'var(--ink-2)',
                    background: previewMode === m.key ? 'rgba(245,213,72,0.10)' : 'var(--bg-2)',
                    fontWeight: previewMode === m.key ? 700 : 500,
                  }}>{m.label}</button>
              ))}
            </div>
          </div>
          <div className="card" style={{padding:0, overflow:'hidden', position:'sticky', top:24}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', padding:'8px 12px', borderBottom:'1px solid var(--line)', background:'var(--bg-2)'}}>
              PREVIEW · {previewMode === 'mobile' ? '360px 모바일 시뮬레이션' : '실제 홈 히어로와 동일 마크업'}
            </div>
            <div style={{
              padding: previewMode === 'mobile' ? '24px 16px 24px' : '40px 24px 32px',
              maxWidth: previewMode === 'mobile' ? 360 : '100%',
              margin: previewMode === 'mobile' ? '0 auto' : undefined,
              textAlign: effPreview.title.textAlign || 'left',
            }}>
              <div style={{
                fontFamily:'var(--font-mono)',
                fontSize: effPreview.eyebrow.fontSize, fontWeight: effPreview.eyebrow.fontWeight,
                letterSpacing: `${effPreview.eyebrow.letterSpacing}em`,
                color: `var(${effPreview.eyebrow.color})`,
                textTransform: effPreview.eyebrow.textTransform || 'uppercase',
                marginBottom: 16,
              }}>
                {contentDraft.eyebrow || 'BANGINOJA · 뱅기타고 노자'}
              </div>
              <h1 style={{
                fontFamily:'var(--font-display)',
                fontSize: previewMode === 'mobile' ? `${effPreview.title.fontSize}px` : `clamp(28px, 5vw, ${effPreview.title.fontSize}px)`,
                fontWeight: effPreview.title.fontWeight,
                lineHeight: effPreview.title.lineHeight,
                letterSpacing: `${effPreview.title.letterSpacing}em`,
                marginBottom: 16,
                color: `var(${effPreview.title.color})`,
              }}>
                {contentDraft.title1 || '뱅기타고'}<br/>
                <span style={{color: `var(${effPreview.title.accentColor})`}}>{contentDraft.title2 || '한국을'}</span><br/>
                {contentDraft.title3 || '느끼다'}
              </h1>
              <p style={{
                fontSize: effPreview.subtitle.fontSize,
                fontWeight: effPreview.subtitle.fontWeight,
                lineHeight: effPreview.subtitle.lineHeight,
                color: `var(${effPreview.subtitle.color})`,
                maxWidth: effPreview.subtitle.maxWidth,
                marginBottom: 22,
                marginLeft: effPreview.title.textAlign === 'center' ? 'auto' : undefined,
                marginRight: effPreview.title.textAlign === 'center' ? 'auto' : undefined,
              }}>
                {contentDraft.subtitle || '궁궐 답사부터 지역 여행 코스까지. 뱅기노자와 함께 한국의 역사·문화·자연을 온몸으로 경험하는 여행 커뮤니티입니다.'}
              </p>
              <div style={{
                display:'flex', gap:10, flexWrap:'wrap',
                justifyContent: effPreview.title.textAlign === 'center' ? 'center' : (effPreview.title.textAlign === 'right' ? 'flex-end' : 'flex-start'),
              }}>
                <button type="button" className="btn btn-gold btn-small" style={{fontWeight: effPreview.cta.fontWeight}}>
                  {contentDraft.mapHint || '지도에서 여행지 찾기 →'}
                </button>
                <button type="button" className="btn btn-small" style={{fontWeight: effPreview.cta.fontWeight}}>
                  {contentDraft.ctaPrimary || '커뮤니티 참여하기'}
                </button>
                <button type="button" className="btn btn-small" style={{fontWeight: effPreview.cta.fontWeight}}>
                  {contentDraft.ctaSecondary || '투어 프로그램 보기'}
                </button>
              </div>
              {/* 통계 카드 미리보기 */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, paddingTop:18, borderTop:'1px solid var(--line)', marginTop:24}}>
                {statsDraft.map((s, i) => (
                  <div key={i}>
                    <div style={{
                      fontFamily:'var(--font-serif)',
                      fontSize: effPreview.stats.value.fontSize, fontWeight: effPreview.stats.value.fontWeight,
                      color: `var(${effPreview.stats.value.color})`, marginBottom:4,
                    }}>{s.valueFallback || '—'}</div>
                    <div style={{
                      fontFamily:'var(--font-mono)',
                      fontSize: effPreview.stats.label.fontSize, fontWeight: effPreview.stats.label.fontWeight,
                      letterSpacing: `${effPreview.stats.label.letterSpacing}em`,
                      color: `var(${effPreview.stats.label.color})`,
                      textTransform: effPreview.stats.label.textTransform || 'uppercase',
                      marginBottom:3,
                    }}>{s.label || '라벨'}</div>
                    <div style={{
                      fontSize: effPreview.stats.sub.fontSize,
                      color: `var(${effPreview.stats.sub.color})`,
                    }}>{s.sub || '부연'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// === Legacy Migration Panel (v00.086) ===================================
// 운영자 1회성 도구. 누적된 legacy 데이터를 정식 위치로 일괄 이동.
//   ① 투어 cover: site_content_kv.tourPages[id].coverDataUri → D1.tours.cover_url
//   ② 강연 cover dataURI → R2: site_content_kv.lecturePages[id].coverDataUri (data:...) → R2 URL 교체
// 안전 정책: 항상 dry-run 미리보기 → 실행. 결과 카운트 + 실패 목록 노출. 재실행 idempotent.

const LegacyMigrationPanel = () => {
  const [tourScan, setTourScan] = React.useState(null);     // { count, items: [{id, source, hasD1}] }
  const [lectureScan, setLectureScan] = React.useState(null);
  const [running, setRunning] = React.useState('');
  const [tourResult, setTourResult] = React.useState(null);
  const [lectureResult, setLectureResult] = React.useState(null);

  const isDataUri = (v) => typeof v === 'string' && v.startsWith('data:');

  const scanTour = () => {
    setRunning('tour-scan');
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const tourPages = sc.tourPages || {};
      const tours = (window.BGNJ_TOURS?.listAll?.({ includeHidden: true }) || []);
      const items = [];
      for (const [id, ovr] of Object.entries(tourPages)) {
        if (!ovr || !ovr.coverDataUri) continue;
        const tour = tours.find((t) => String(t.id) === String(id));
        items.push({
          id, title: tour?.title || '(삭제된 투어)',
          source: ovr.coverDataUri,
          hasD1: !!(tour?.coverUrl),
          isDataUri: isDataUri(ovr.coverDataUri),
        });
      }
      setTourScan({ count: items.length, items });
    } finally { setRunning(''); }
  };

  const applyTour = async () => {
    if (!tourScan || tourScan.items.length === 0) return;
    if (!confirm(`투어 ${tourScan.items.length} 개의 legacy cover 를 D1 cover_url 로 이동합니다. 진행할까요? (재실행 안전)`)) return;
    setRunning('tour-apply');
    const result = { migrated: 0, skipped: 0, failed: [] };
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const tourPages = { ...(sc.tourPages || {}) };
      for (const it of tourScan.items) {
        try {
          await window.BGNJ_TOURS.saveTour({ id: it.id, coverUrl: it.source });
          const { coverDataUri, ...rest } = (tourPages[it.id] || {});
          if (Object.keys(rest).length > 0) tourPages[it.id] = rest;
          else delete tourPages[it.id];
          result.migrated += 1;
        } catch (err) {
          result.failed.push({ id: it.id, msg: err?.message || String(err) });
        }
      }
      try {
        await window.BGNJ_SITE_CONTENT.saveSection('tourPages', tourPages);
      } catch (err) {
        result.failed.push({ id: '(site_content)', msg: 'tourPages 저장 실패: ' + (err?.message || '') });
      }
      setTourResult(result);
      setTourScan(null);
    } finally { setRunning(''); }
  };

  const scanLecture = () => {
    setRunning('lecture-scan');
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const lecturePages = sc.lecturePages || {};
      const lectures = (window.BGNJ_LECTURES?.listAll?.({ includeHidden: true }) || []);
      const items = [];
      for (const [id, ovr] of Object.entries(lecturePages)) {
        if (!ovr || !ovr.coverDataUri) continue;
        if (!isDataUri(ovr.coverDataUri)) continue;
        const lecture = lectures.find((l) => String(l.id) === String(id));
        items.push({
          id, title: lecture?.title || '(삭제된 강연)',
          sizeBytes: ovr.coverDataUri.length,
        });
      }
      setLectureScan({ count: items.length, items });
    } finally { setRunning(''); }
  };

  const dataUriToFile = async (dataUri, filename) => {
    // bgnj-lint-ignore-next-line direct_fetch — data: URI 디코딩만 (네트워크 호출 X)
    const res = await fetch(dataUri);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/png' });
  };
  const applyLecture = async () => {
    if (!lectureScan || lectureScan.items.length === 0) return;
    if (!confirm(`강연 ${lectureScan.items.length} 개의 dataURI cover 를 R2 객체로 변환합니다. 진행할까요?`)) return;
    setRunning('lecture-apply');
    const result = { migrated: 0, skipped: 0, failed: [] };
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const lecturePages = { ...(sc.lecturePages || {}) };
      for (const it of lectureScan.items) {
        try {
          const ovr = lecturePages[it.id] || {};
          const file = await dataUriToFile(ovr.coverDataUri, `${it.id}-cover.png`);
          const { url } = await window.BGNJ_MEDIA.uploadFile(file, { folder: 'lecture-covers', maxBytes: 10 * 1024 * 1024 });
          lecturePages[it.id] = { ...ovr, coverDataUri: url };
          result.migrated += 1;
        } catch (err) {
          result.failed.push({ id: it.id, msg: err?.message || String(err) });
        }
      }
      try {
        await window.BGNJ_SITE_CONTENT.saveSection('lecturePages', lecturePages);
      } catch (err) {
        result.failed.push({ id: '(site_content)', msg: 'lecturePages 저장 실패: ' + (err?.message || '') });
      }
      setLectureResult(result);
      setLectureScan(null);
    } finally { setRunning(''); }
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        v00.070~082 사이클을 거치며 누적된 legacy 데이터를 정식 위치로 일괄 이동합니다. 모든 작업은 idempotent — 중복 실행 안전.
      </p>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:8}}>① 투어 legacy cover → D1 cover_url</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:14, lineHeight:1.7}}>
        v00.081 D1 cover_url 컬럼 도입 전 (v00.070) 시점의 site_content_kv.tourPages[id].coverDataUri 값을 정식 D1 컬럼으로 이동합니다. 이전 후 site_content 의 해당 키 제거 (schedule/prep/templateId 는 보존).
      </p>
      <div style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:14}}>
        <button type="button" className="btn btn-small" disabled={!!running} onClick={scanTour}>① 스캔</button>
        <button type="button" className="btn btn-gold btn-small"
          disabled={!tourScan || tourScan.items.length === 0 || !!running}
          onClick={applyTour}>② 적용 ({tourScan?.count || 0}개)</button>
      </div>
      {tourScan && (
        <div className="card" style={{padding:14, marginBottom:18, fontSize:12, lineHeight:1.7}}>
          {tourScan.items.length === 0
            ? <span className="dim">▸ 마이그할 항목 없음.</span>
            : <ul style={{paddingLeft:18, margin:0}}>
                {tourScan.items.map((it) => (
                  <li key={it.id}>
                    <span className="mono dim-2">{it.id}</span> · {it.title}
                    {it.hasD1 && <span className="gold mono" style={{marginLeft:8, fontSize:10}}>D1 이미 존재 — 덮어씁니다</span>}
                    {!it.isDataUri && <span className="dim-2 mono" style={{marginLeft:8, fontSize:10}}>(URL 형태 — 그대로 D1 로 이동)</span>}
                  </li>
                ))}
              </ul>}
        </div>
      )}
      {tourResult && (
        <div className="card" style={{padding:14, marginBottom:18, fontSize:12, lineHeight:1.7, borderColor:'var(--gold)'}}>
          ✅ 마이그 완료 — {tourResult.migrated} 건 이동, {tourResult.failed.length} 건 실패.
          {tourResult.failed.length > 0 && (
            <ul style={{paddingLeft:18, margin:'8px 0 0', color:'var(--danger)'}}>
              {tourResult.failed.map((f, i) => <li key={i}>{f.id}: {f.msg}</li>)}
            </ul>
          )}
        </div>
      )}

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>② 강연 legacy cover dataURI → R2</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:14, lineHeight:1.7}}>
        v00.075~083 동안 site_content_kv.lecturePages[id].coverDataUri 에 base64 dataURI 로 저장된 항목을 R2 객체로 업로드 후 URL 로 교체합니다. 이미 URL 인 항목은 skip.
      </p>
      <div style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:14}}>
        <button type="button" className="btn btn-small" disabled={!!running} onClick={scanLecture}>① 스캔</button>
        <button type="button" className="btn btn-gold btn-small"
          disabled={!lectureScan || lectureScan.items.length === 0 || !!running}
          onClick={applyLecture}>② 적용 ({lectureScan?.count || 0}개)</button>
      </div>
      {lectureScan && (
        <div className="card" style={{padding:14, marginBottom:18, fontSize:12, lineHeight:1.7}}>
          {lectureScan.items.length === 0
            ? <span className="dim">▸ 마이그할 항목 없음 (모두 URL 형태이거나 비어있음).</span>
            : <ul style={{paddingLeft:18, margin:0}}>
                {lectureScan.items.map((it) => (
                  <li key={it.id}>
                    <span className="mono dim-2">{it.id}</span> · {it.title}
                    <span className="dim-2 mono" style={{marginLeft:8, fontSize:10}}>~{(it.sizeBytes / 1024 / 1.33).toFixed(0)} KB</span>
                  </li>
                ))}
              </ul>}
        </div>
      )}
      {lectureResult && (
        <div className="card" style={{padding:14, marginBottom:18, fontSize:12, lineHeight:1.7, borderColor:'var(--gold)'}}>
          ✅ 마이그 완료 — {lectureResult.migrated} 건 R2 업로드, {lectureResult.failed.length} 건 실패.
          {lectureResult.failed.length > 0 && (
            <ul style={{paddingLeft:18, margin:'8px 0 0', color:'var(--danger)'}}>
              {lectureResult.failed.map((f, i) => <li key={i}>{f.id}: {f.msg}</li>)}
            </ul>
          )}
        </div>
      )}

      <p className="dim-2" style={{fontSize:11, marginTop:24, lineHeight:1.7}}>
        ⓘ 추가 마이그가 필요한 항목 (책 표지/PDF dataURI, 추천 이미지, 게시글 첨부) 은 향후 별도 도구. 현재는 v00.081/v00.083 신규 컬럼·R2 패스 적용 직후의 잔재만 처리.
      </p>
    </div>
  );
};

// v00.078 — 외부 스크립트(AuthAdminPage)에서 사용할 수 있도록 window 에 노출.
Object.assign(window, {
  RecommendationsAdminPanel,
  TPE_RowActions, TPE_ScheduleEditor, TPE_PrepEditor, TPE_PreviewCard,
  _arrAdd, _arrRemove, _arrUpdate, _arrMove,
  TourPageEditorPanel,
  LecturePageEditorPanel, // v00.083
  LPE_NotesEditor, LPE_PreviewCard,
  FOOTER_COLOR_OPTIONS, FooterStyleEditor,
  HE_Field, HE_Input, HE_TextArea, HE_Select, HE_NumberRange, HE_StyleGroup,
  HERO_COLOR_OPTIONS, HERO_WEIGHTS, HERO_ALIGNS, HERO_TFORMS,
  HeroEditorPanel,
  LegacyMigrationPanel, // v00.086
});

// 뱅기노자 — 등급/칼럼 관리 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// AdminGradePanel(회원 등급) · ColumnCategoryChips · AdminColumnEditor(칼럼 에디터) ·
// ColumnsHubPanel(칼럼 허브) · ColumnEditorModalContent(칼럼 편집 모달).
// 자기완결적 클러스터 — 의존은 모두 window 전역(BGNJ_API/STORES/COLUMNS/CONFIRM/TOAST, TiptapEditor 등).
// ⚠️ AdminColumnEditor 는 공개 ColumnPage 가 window guard + admin 번들 lazy-load 로 소비 — 기존 동작 보존.
// entry-admin 에서 AuthAdminPage 앞에 로드. AdminGradePanel·AdminColumnEditor·ColumnsHubPanel window 노출.

// v00.286 ESM — cross-module import (전역 결합 제거).
import { AdminPanelHeader, AdminSaveBar } from './AdminShared.jsx';
// v00.294.007 — 칼럼 편집기가 쓰는 TiptapEditor 는 main 번들에만 있었다.
// admin 번들에서는 미정의 식별자라 편집 화면 진입 시 ReferenceError 로 깨졌다.
import { TiptapEditor } from '../../components/TiptapEditor.jsx';

const AdminGradePanel = () => {
  // v00.141 — 통합 패널: 회원 등급 + 자동 승급/강등 기준을 한 곳에서 편집.
  // 사용자 요청 '자동 승급/강등과 회원등급 관리가 한 기능에서 진행되게 + 저장 버튼 살려주고'.
  // 변경: 기존 save-on-keystroke 자동 저장 제거 → 편집은 local state, 명시적 [저장] 버튼이 commit.
  const G = window.BGNJ_GUARD;
  const _initialRules = () => {
    try { return JSON.parse(JSON.stringify(window.BGNJ_GRADE_RULES_EFFECTIVE?.() || window.BGNJ_GRADE_RULES || {})); }
    catch { return {}; }
  };
  const [grades, setGrades] = React.useState(() => window.BGNJ_STORES.grades.slice());
  const [rules, setRules] = React.useState(_initialRules);
  const [draft, setDraft] = React.useState({ id:"", label:"", level:20, color:"#D4AF37", desc:"" });
  const [error, setError] = React.useState("");
  const [dirty, setDirty] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [busyReevaluate, setBusyReevaluate] = React.useState(false);
  const [reevalResult, setReevalResult] = React.useState(null);

  // v00.189 — 사용자 보고 '등급 이름 자꾸 초기화'. mount 시 D1 에서 강제 재 fetch.
  // 이전엔 BGNJ_STORES.grades (boot async fetch 결과) 가 mount 시점에 stale 일 수 있어
  // 사용자가 default 값 위에 편집 → 저장 → D1 default 로 덮어쓰여 '초기화' 인상 발생.
  // 본 사이클에서 mount 마다 직접 fetch + dirty 시 무시 (사용자 편집 보호).
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await window.BGNJ_API?.grades?.list?.();
        if (cancelled) return;
        if (Array.isArray(r?.grades) && r.grades.length) {
          const fresh = r.grades.map((g) => ({
            id: g.id, label: g.label, level: g.level,
            color: g.color, desc: g.description,
            order: g.display_order ?? 0,
          }));
          window.BGNJ_STORES.grades = fresh;
          setGrades((prev) => {
            // dirty 면 사용자 편집 보호 — 무시.
            if (dirty) return prev;
            return fresh.slice();
          });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 정렬된 grades (level asc).
  const sortedGrades = React.useMemo(() => grades.slice().sort((a, b) => a.level - b.level), [grades]);

  const markDirty = () => { setDirty(true); setSaveMsg(""); };

  const add = (e) => {
    e.preventDefault();
    setError("");
    if (!draft.id || !draft.label) return setError("ID와 이름은 필수입니다.");
    if (grades.find(g => g.id === draft.id)) return setError("이미 존재하는 ID입니다.");
    setGrades([...grades, { ...draft, level: Number(draft.level) }]);
    setDraft({ id:"", label:"", level:20, color:"#D4AF37", desc:"" });
    markDirty();
  };
  const update = (i, key, val) => {
    setGrades((cur) => {
      const next = cur.slice();
      next[i] = { ...next[i], [key]: key === "level" ? Number(val) : val };
      return next;
    });
    markDirty();
  };
  const remove = async (i) => {
    const g = grades[i];
    if (g.id === "admin" || g.id === "guest") { window.BGNJ_TOAST.error("기본 등급(guest/admin)은 삭제할 수 없습니다."); return; }
    if (!(await window.BGNJ_CONFIRM(`"${g.label}" 등급을 삭제하시겠어요?`, { danger: true }))) return;
    setGrades(grades.filter((_, j) => j !== i));
    markDirty();
  };
  const setRuleField = (gid, key, val) => {
    setRules((r) => ({ ...r, [gid]: { ...(r[gid] || {}), [key]: Number(val) || 0 } }));
    markDirty();
  };

  // v00.141 — 통합 저장: 등급(localStorage) + 자동 승급 기준(site_content_kv.gradeRules) 동시 commit.
  // v00.170 — D1 grades_kv 도 함께 upsert. localStorage 만 저장하던 버그로 새로고침 시 서버 default 가 덮어써서
  //          이름이 초기화되던 사용자 보고 '회원 등급 이름이 자꾸 초기화' 직접 fix.
  const commitAll = async () => {
    if (saving) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const sorted = grades.slice().sort((a, b) => a.level - b.level);

      // 1) D1 grades_kv 에 각 등급 upsert (label/level/color/description/order).
      // v00.189 — 실패 시 즉시 alert (이전엔 saveMsg 만 → 사용자 못 보고 새로고침해서 D1 default 로 덮어쓰여 '초기화' 인상).
      const failed = [];
      for (const g of sorted) {
        try {
          if (!window.BGNJ_API?.grades?.upsert) {
            throw new Error('BGNJ_API.grades.upsert 가 로드되지 않았습니다 (네트워크/스크립트 로딩 문제).');
          }
          await window.BGNJ_API.grades.upsert(g.id, {
            label: g.label, level: Number(g.level || 0), color: g.color || '',
            description: g.desc || '', order: Number(g.order || g.level || 0),
          });
        } catch (err) {
          failed.push({ id: g.id, label: g.label, msg: err?.message || String(err) });
        }
      }
      if (failed.length) {
        const msg = `⚠ 등급 서버 저장 ${failed.length}건 실패\n\n${failed.map(f => `• ${f.id} (${f.label}): ${f.msg}`).join('\n')}\n\n새로고침 시 서버 D1 default 가 다시 덮어쓰므로 — 다시 시도하거나 로그아웃 후 admin 재로그인 후 시도해 주세요.`;
        window.BGNJ_TOAST.error(msg);
        setSaveMsg(`⚠ ${failed.length}건 실패 — alert 참조`);
        // 실패 시 setDirty(false) 하지 않음 — 사용자가 다시 시도 가능.
        setSaving(false);
        return;
      }

      // 2) 클라이언트 캐시(localStorage 폴백) 갱신.
      window.BGNJ_STORES.grades = sorted;
      window.BGNJ_SAVE.grades();
      setGrades(sorted);

      // 3) 자동 승급 기준 site_content_kv 저장.
      await window.BGNJ_SITE_CONTENT?.saveSection?.('gradeRules', rules);

      setDirty(false);
      if (!failed.length) {
        setSaveMsg("✓ 등급(D1) + 자동 승급 기준 저장 완료.");
        setTimeout(() => setSaveMsg(""), 3000);
      }
    } catch (err) {
      setSaveMsg("✗ 저장 실패: " + (err?.message || '알 수 없는 오류'));
    } finally {
      setSaving(false);
    }
  };

  const resetAll = async () => {
    if (!(await window.BGNJ_CONFIRM("등급 + 자동 승급 기준을 모두 기본값으로 되돌립니다. 진행할까요?\n(서버 D1 grades_kv 도 default 값으로 덮어씌워집니다.)", { danger: true }))) return;
    setSaving(true);
    try {
      // v00.181 — 이전엔 localStorage 만 reset 후 새로고침 시 D1 default 가 다시 덮어써서 reset 효과 없었음.
      // resetGrades() 가 BGNJ_STORES.grades 를 default 로 set → 그 값을 D1 에도 PUT.
      window.BGNJ_SAVE.resetGrades();
      const defaults = (window.BGNJ_STORES?.grades || []).slice();
      for (const g of defaults) {
        try {
          await window.BGNJ_API?.grades?.upsert?.(g.id, {
            label: g.label, level: Number(g.level || 0), color: g.color || '',
            description: g.desc || '', order: Number(g.order || g.level || 0),
          });
        } catch {}
      }
      await window.BGNJ_SITE_CONTENT?.resetSection?.('gradeRules');
      setGrades(window.BGNJ_STORES.grades.slice());
      setRules(_initialRules());
      setDirty(false);
      setSaveMsg("기본값 복원 완료 (D1 + localStorage).");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg("✗ 복원 실패: " + (err?.message || '알 수 없는 오류'));
    } finally {
      setSaving(false);
    }
  };

  const reevaluate = async () => {
    if (dirty) { window.BGNJ_TOAST.error("저장하지 않은 변경 사항이 있습니다. 먼저 [저장] 후 재산정하세요."); return; }
    if (!(await window.BGNJ_CONFIRM("전체 회원의 활동량을 재평가하여 자격 등급으로 자동 승급/강등 합니다. 진행할까요?", { danger: true }))) return;
    setBusyReevaluate(true);
    try {
      await window.BGNJ_AUTH?.refreshUsers?.();
      try { await window.BGNJ_GRADE_PROMO?.prefetchAllServerMetrics?.(); } catch {}
      const summary = window.BGNJ_GRADE_PROMO?.reevaluateAll?.() || { promoted: 0, demoted: 0 };
      setReevalResult(summary);
    } catch (err) {
      window.BGNJ_TOAST.error("재산정 중 오류: " + (err?.message || '알 수 없는 오류'));
    } finally { setBusyReevaluate(false); }
  };

  return (
    <>
      <AdminPanelHeader
        eyebrow="MEMBERSHIP · 회원 등급"
        title="회원 등급 + 자동 승급/강등"
        description="회원 등급의 이름·단계·색상을 관리하고, 각 등급의 자동 승급 기준을 함께 편집합니다. 변경 사항은 [💾 저장] 버튼을 누를 때만 적용됩니다."/>

      <article className="admin-form-card">
        <div className="admin-form-card__eyebrow">＋ 새 등급 추가</div>
        <form onSubmit={add} style={{display:'grid', gridTemplateColumns:'1fr 1fr 100px 100px 1fr auto', gap:10, alignItems:'end'}}>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="grade-id">ID</label>
            <input id="grade-id" className="field-input" value={draft.id}
              onChange={e => setDraft({...draft, id:e.target.value.replace(/\s+/g,'-').toLowerCase()})}
              placeholder="slug"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="grade-label">이름</label>
            <input id="grade-label" className="field-input" value={draft.label} onChange={e => setDraft({...draft, label:e.target.value})} placeholder="등급 이름"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="grade-level">단계</label>
            <input id="grade-level" type="number" className="field-input" value={draft.level}
              onChange={e => setDraft({...draft, level:e.target.value})}/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="grade-color">색상</label>
            <input id="grade-color" type="color" className="field-input" style={{padding:2, height:38}}
              value={draft.color} onChange={e => setDraft({...draft, color:e.target.value})}/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="grade-desc">설명</label>
            <input id="grade-desc" className="field-input" value={draft.desc}
              onChange={e => setDraft({...draft, desc:e.target.value})}/>
          </div>
          <button type="submit" className="btn btn-gold btn-small">추가</button>
        </form>
        {error && <div role="alert" className="mono" style={{color:'var(--danger)', fontSize:11, marginTop:10}}>{error}</div>}
      </article>

      <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th scope="col">배지</th>
            <th scope="col">ID</th>
            <th scope="col">이름</th>
            <th scope="col" className="right">단계</th>
            <th scope="col">색상</th>
            <th scope="col">설명</th>
            <th scope="col" className="right">액션</th>
          </tr>
        </thead>
        <tbody>
          {sortedGrades.map((g) => {
            const i = grades.findIndex((x) => x.id === g.id);
            const rule = rules[g.id];
            const RULE_KEYS = [
              { k: 'posts',            l: '게시글' },
              { k: 'comments',         l: '댓글' },
              { k: 'visitsLast30Days', l: '30일 방문' },
              { k: 'daysSinceSignup',  l: '가입경과(일)' },
              { k: 'likesReceived',    l: '받은 좋아요' },
              { k: 'activeDays',       l: '활동일' },
              { k: 'eventsAttended',   l: '행사 참석' },
              { k: 'maxReports',       l: '신고 한계 <', tone: 'danger' },
            ];
            return (
              <React.Fragment key={g.id}>
                <tr style={{borderBottom: rule ? 'none' : undefined}}>
                  <td>
                    <span className="grade-badge" style={{color: g.color}}>{g.label}</span>
                  </td>
                  <td className="mono gold">{g.id}</td>
                  <td>
                    <input className="field-input" style={{padding:'6px 10px'}} value={g.label}
                      onChange={e => update(i, 'label', e.target.value)}/>
                  </td>
                  <td className="right">
                    <input type="number" className="field-input" style={{padding:'6px 10px', width:80, textAlign:'right'}}
                      value={g.level} onChange={e => update(i, 'level', e.target.value)}/>
                  </td>
                  <td>
                    <input type="color" className="field-input" style={{padding:0, width:60, height:32}}
                      value={g.color} onChange={e => update(i, 'color', e.target.value)}/>
                  </td>
                  <td>
                    <input className="field-input" style={{padding:'6px 10px'}} value={g.desc || ''}
                      onChange={e => update(i, 'desc', e.target.value)}/>
                  </td>
                  <td className="right">
                    <button type="button" className="btn btn-small" onClick={() => remove(i)}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}} disabled={g.id === "admin" || g.id === "guest"}>삭제</button>
                  </td>
                </tr>
                {rule && (
                  <tr style={{background:'var(--bg-2)'}}>
                    <td colSpan={7} style={{padding:'10px 14px 16px', borderTop:'1px dashed var(--line)'}}>
                      <div className="mono" style={{fontSize:10, letterSpacing:'0.18em', color:'var(--ink-3)', marginBottom:8}}>
                        ↳ 자동 승급 기준 — 모두 동시 충족 시 <strong style={{color: g.color}}>{g.label}</strong> 자동 부여
                      </div>
                      <div style={{display:'flex', flexWrap:'wrap', gap:8, fontFamily:'var(--font-mono)', fontSize:11}}>
                        {RULE_KEYS.map(({k, l, tone}) => (
                          <label key={k} style={{display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', border:'1px solid var(--line-2)', background:'var(--bg)'}}>
                            <span className="dim-2" style={{fontSize:10, letterSpacing:'0.08em'}}>{l}</span>
                            <input type="number" min={0}
                              value={rule[k] ?? 0}
                              onChange={(e) => setRuleField(g.id, k, e.target.value)}
                              style={{width:60, padding:'2px 6px', textAlign:'right', border:'1px solid var(--line-2)', background:'var(--bg)', color: tone === 'danger' ? 'var(--danger)' : 'var(--ink)', fontFamily:'var(--font-mono)', fontSize:11}}/>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      </div>

      <AdminSaveBar
        message={saveMsg || null}
        messageVariant={saveMsg.startsWith('✗') ? 'danger' : 'success'}>
        <button type="button" className="btn btn-gold" onClick={commitAll} disabled={saving || !dirty}>
          {saving ? '저장 중…' : (dirty ? '💾 저장 (등급 + 자동 승급 기준)' : '저장됨 ✓')}
        </button>
        <button type="button" className="btn" onClick={reevaluate} disabled={busyReevaluate || dirty}>
          {busyReevaluate ? '재산정 중…' : '🔄 전체 회원 재산정'}
        </button>
        {reevalResult && (
          <span className="mono" style={{fontSize:12, fontWeight:600, color:'var(--secondary)'}}>
            ✓ 승급 {reevalResult.promoted} · 강등 {reevalResult.demoted}
          </span>
        )}
        <span className="admin-savebar__spacer"/>
        <button type="button" className="btn btn-small" onClick={resetAll} style={{borderColor:'var(--line-2)'}}>
          기본값 복원
        </button>
      </AdminSaveBar>
      <p style={{fontSize:11, color:'var(--ink-3)', marginTop:10, lineHeight:1.6}}>
        ⓘ 자동 승급 기준은 <code>모든 조건 동시 충족</code> 시에만 자격 부여. 신고 한계 초과 시 자격 무관 강제 강등(member).
        승급/강등 시 본인에게 알림 자동 발송. 변경은 <strong>저장 버튼</strong> 클릭 시점에만 영속화됩니다.
      </p>
    </>
  );
};

// v00.141 — GradePromotionPanel 은 AdminGradePanel 안으로 통합 흡수됨.
// 사용자 요청 '자동 승급/강등과 회원등급 관리가 한 기능에서 진행되게'.

// === Admin: Column Editor (Tiptap column preset — inline draggable images)
// v00.133 — 칼럼 카테고리 칩 선택 + 인라인 추가/삭제. AdminColumnEditor / ColumnsHubPanel 에서 공유.
// site_content_kv.columnCategories 가 source-of-truth.
const ColumnCategoryChips = ({ selected, onSelect, allowManage = true }) => {
  const [scTick, setScTick] = React.useState(0);
  const sc = React.useMemo(() => (window.BGNJ_SITE_CONTENT?.get?.() || {}), [scTick]);
  const cats = React.useMemo(() => {
    const list = Array.isArray(sc.columnCategories) && sc.columnCategories.length
      ? sc.columnCategories
      : ['왕의 미학', '군주의 언어', '공간의 철학', '현대의 독법'];
    // 선택값이 목록에 없으면 (편집 중인 옛 값) 추가 노출.
    return selected && !list.includes(selected) ? [...list, selected] : list;
  }, [sc, scTick, selected]);
  const [adding, setAdding] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const addCat = async () => {
    const v = newName.trim();
    if (!v || cats.includes(v) || busy) return;
    setBusy(true);
    try {
      const next = [...(sc.columnCategories || []), v];
      await window.BGNJ_SITE_CONTENT.saveSection('columnCategories', next);
      setNewName('');
      setAdding(false);
      setScTick((x) => x + 1);
      onSelect?.(v);
    } catch (err) {
      window.BGNJ_TOAST.error('카테고리 추가 실패: ' + (err?.message || ''));
    } finally { setBusy(false); }
  };
  const removeCat = async (name) => {
    if (!(await window.BGNJ_CONFIRM(`'${name}' 카테고리를 삭제하시겠어요?\n(기존 칼럼의 값은 보존됨, 새 칼럼 작성 선택지에서만 사라짐.)`, { danger: true }))) return;
    setBusy(true);
    try {
      const next = (sc.columnCategories || []).filter((c) => c !== name);
      await window.BGNJ_SITE_CONTENT.saveSection('columnCategories', next);
      setScTick((x) => x + 1);
      if (selected === name && next.length > 0) onSelect?.(next[0]);
    } catch (err) {
      window.BGNJ_TOAST.error('카테고리 삭제 실패: ' + (err?.message || ''));
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
        {cats.map((c) => {
          const active = c === selected;
          // v00.220 — 비활성 칩이 흰 배경에 묻혀 안 보이던 문제 해결: bg-2 fill + line-2 보더로 윤곽 강화.
          //          X 버튼은 평상시 회색, hover/focus 시에만 빨강 — 시각 무게가 카테고리명보다 강하지 않게.
          return (
            <span key={c} style={{
              display:'inline-flex', alignItems:'center', gap:0,
              borderRadius:999,
              border: '1px solid ' + (active ? 'var(--primary)' : 'var(--line-2)'),
              background: active ? 'rgba(245,213,72,0.10)' : 'var(--bg-2)',
            }}>
              <button type="button"
                onClick={() => onSelect?.(c)}
                aria-pressed={active}
                style={{
                  padding:'6px 4px 6px 14px', fontSize:12, cursor:'pointer',
                  color: active ? 'var(--primary)' : 'var(--ink)',
                  fontWeight: active ? 600 : 500,
                  background:'transparent', border:'none',
                }}>
                {c}
              </button>
              {allowManage && (
                <button type="button" onClick={() => removeCat(c)} aria-label={`${c} 삭제`}
                  disabled={busy}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-3)'; }}
                  onFocus={(e) => { e.currentTarget.style.color = 'var(--danger)'; }}
                  onBlur={(e) => { e.currentTarget.style.color = 'var(--ink-3)'; }}
                  style={{background:'none', border:'none', color:'var(--ink-3)', cursor:'pointer', fontSize:11, padding:'0 10px 0 4px', lineHeight:1, transition:'color .15s'}}>
                  ✕
                </button>
              )}
            </span>
          );
        })}
        {allowManage && !adding && (
          <button type="button" onClick={() => setAdding(true)}
            style={{padding:'6px 14px', borderRadius:999, fontSize:12, cursor:'pointer',
              border:'1px dashed var(--primary-dim)', color:'var(--secondary)', background:'transparent'}}>
            ＋ 새 카테고리
          </button>
        )}
        {allowManage && adding && (
          <span style={{display:'inline-flex', gap:4, alignItems:'center'}}>
            <input type="text" autoFocus className="field-input"
              value={newName} onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addCat(); }
                if (e.key === 'Escape') { setAdding(false); setNewName(''); }
              }}
              placeholder="카테고리 이름"
              style={{padding:'4px 10px', fontSize:12, width:140}}/>
            <button type="button" className="btn btn-small" onClick={addCat} disabled={!newName.trim() || busy}>추가</button>
            <button type="button" className="btn btn-small" onClick={() => { setAdding(false); setNewName(''); }}>취소</button>
          </span>
        )}
      </div>
    </div>
  );
};

// v00.067: initialColumn prop + onPayloadChange callback 추가 — 모달 안에서 사용 시 임시저장 추적용.
const AdminColumnEditor = ({ initialColumn, onPayloadChange, onAfterSave } = {}) => {
  const [editingId, setEditingId] = React.useState(initialColumn?.id || null);
  const [title, setTitle] = React.useState(initialColumn?.title || "");
  const [category, setCategory] = React.useState(initialColumn?.category || "왕의 미학");
  const [excerpt, setExcerpt] = React.useState(initialColumn?.excerpt || "");
  const [html, setHtml] = React.useState(initialColumn?.body?.html || "");
  const [text, setText] = React.useState(initialColumn?.body?.text || "");
  const [publishAt, setPublishAt] = React.useState(initialColumn?.publishAt || "");
  // v00.127 — 외부 기고처 + 원문 링크 (schema-v6).
  const [sourceCredit, setSourceCredit] = React.useState(initialColumn?.sourceCredit || "");
  const [sourceUrl, setSourceUrl] = React.useState(initialColumn?.sourceUrl || "");
  // v00.136 — 대표이미지 URL + 출처. coverUrl 은 기존 c.coverUrl, coverCredit 은 신규.
  const [coverUrl, setCoverUrl] = React.useState(initialColumn?.coverUrl || "");
  const [coverCredit, setCoverCredit] = React.useState(initialColumn?.coverCredit || "");
  // v00.115 — 표시 시간(created_at) 오버라이드. publishAt(예약 발행)과 별도.
  // 'YYYY-MM-DDTHH:MM' datetime-local 포맷. 비우면 워커가 nowIso() 사용.
  const _toLocalInput = (iso) => {
    if (!iso) return "";
    try {
      const parts = window.BGNJ_FMT?.kstDateTime?.(iso);
      if (parts) return parts.replace(' KST', '').replace(' ', 'T').slice(0, 16);
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch { return ""; }
  };
  const [createdAt, setCreatedAt] = React.useState(_toLocalInput(initialColumn?.createdAt || initialColumn?.created_at || ""));
  const [editorKey, setEditorKey] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [tick, setTick] = React.useState(0);
  const [msg, setMsg] = React.useState("");
  // v00.139 — 대표 이미지 R2 업로드 상태.
  const [uploadingCover, setUploadingCover] = React.useState(false);

  // 모달 wrapper 에 dirty payload 전달 — 임시저장 prompt 용. (옵셔널)
  React.useEffect(() => {
    if (typeof onPayloadChange !== 'function') return;
    onPayloadChange({ id: editingId, title, category, excerpt, html, text, publishAt, createdAt });
  }, [editingId, title, category, excerpt, html, text, publishAt, createdAt, onPayloadChange]);

  const all = React.useMemo(() => window.BGNJ_COLUMNS.listAll(), [tick]);
  const filtered = statusFilter === 'all' ? all : all.filter((c) => (c.status || 'published') === statusFilter);
  const counts = {
    all: all.length,
    draft: all.filter((c) => c.status === 'draft').length,
    scheduled: all.filter((c) => c.status === 'scheduled').length,
    published: all.filter((c) => (c.status || 'published') === 'published').length,
  };

  const reset = () => {
    setEditingId(null);
    setTitle(""); setExcerpt(""); setHtml(""); setText("");
    setPublishAt("");
    setCreatedAt("");
    setSourceCredit("");
    setSourceUrl("");
    setCoverUrl("");
    setCoverCredit("");
    setEditorKey((k) => k + 1);
  };

  const startEdit = (col) => {
    setEditingId(col.id);
    setTitle(col.title || "");
    setCategory(col.category || "왕의 미학");
    setExcerpt(col.excerpt || "");
    setHtml(col.body?.html || "");
    setText(col.body?.text || "");
    setPublishAt(col.publishAt || "");
    setCreatedAt(_toLocalInput(col.createdAt || col.created_at || ""));
    setSourceCredit(col.sourceCredit || "");
    setSourceUrl(col.sourceUrl || "");
    setCoverUrl(col.coverUrl || "");
    setCoverCredit(col.coverCredit || "");
    setEditorKey((k) => k + 1);
    setMsg("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildPayload = (status) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const id = editingId || `c-${Date.now()}`;
    const base = {
      id,
      title: title.trim(),
      category,
      excerpt: excerpt.trim() || text.slice(0, 100),
      date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())}`,
      readTime: window.BGNJ_COLUMNS.estimateReadTime(text),
      body: { html, text },
      status,
      authorId: 'user-admin',
      author: '뱅기노자',
    };
    if (status === 'published') {
      base.publishedAt = base.publishedAt || now.toISOString();
      base.publishAt = null;
    } else if (status === 'scheduled') {
      base.publishAt = publishAt || null;
    } else if (status === 'draft') {
      base.publishAt = null;
    }
    // v00.115 — 표시 시간 오버라이드. 'YYYY-MM-DDTHH:MM' (KST 가정) → ISO with +09:00.
    if (createdAt) {
      base.createdAt = `${createdAt}:00+09:00`;
    }
    // v00.127 — 외부 기고처 + 원문 링크. 둘 다 옵셔널 (빈 문자열 허용).
    base.sourceCredit = sourceCredit.trim();
    base.sourceUrl = sourceUrl.trim();
    // v00.136 — 대표이미지 URL + 출처 (옵셔널).
    // v00.139 — coverUrl 비어있으면 본문 HTML 의 첫 <img src> 를 자동 대표 이미지로 사용.
    let resolvedCover = coverUrl.trim();
    if (!resolvedCover && html) {
      const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
      if (m && m[1]) resolvedCover = m[1];
    }
    base.coverUrl = resolvedCover;
    base.coverCredit = coverCredit.trim();
    return base;
  };

  const validate = (status) => {
    if (!title.trim()) { setMsg("제목을 입력해 주세요."); return false; }
    if (!text.trim()) { setMsg("본문을 입력해 주세요."); return false; }
    if (status === 'scheduled') {
      if (!publishAt) { setMsg("예약 발행은 발행 시각을 입력해야 합니다."); return false; }
      if (new Date(publishAt).getTime() <= Date.now()) { setMsg("예약 시각은 현재보다 미래여야 합니다."); return false; }
    }
    return true;
  };

  // v00.128 — async + await + try/catch + onAfterSave 호출. 이전엔 fire-and-forget +
  // onAfterSave 미호출로 모달 wrapper 가 모달 못 닫음. 사용자 보고 '발행 완료되면 모달이 닫혀야지'.
  const save = async (status) => {
    setMsg("");
    if (!validate(status)) return;
    const payload = buildPayload(status);
    try {
      await window.BGNJ_COLUMNS.saveColumn(payload);
      setTick((v) => v + 1);
      const label = status === 'published' ? '발행' : status === 'scheduled' ? '예약 발행' : '임시 저장';
      setMsg(`"${payload.title}" ${label} 완료.`);
      if (status === 'published') reset();
      else setEditingId(payload.id);
      // 모달 wrapper 에 결과 전달 — published / scheduled 면 wrapper 가 닫음.
      try { onAfterSave?.(status); } catch {}
    } catch (err) {
      setMsg('저장 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  const remove = async (id) => {
    if (!(await window.BGNJ_CONFIRM("이 칼럼을 삭제하시겠어요?", { danger: true }))) return;
    try {
      await window.BGNJ_COLUMNS.deleteColumn(id);
      setTick((v) => v + 1);
      if (editingId === id) reset();
    } catch (err) {
      window.BGNJ_TOAST.error('삭제 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  const unpublish = async (id) => {
    if (!(await window.BGNJ_CONFIRM("이 칼럼을 발행 취소(임시 저장으로 되돌림)하시겠어요?", { danger: true }))) return;
    const col = window.BGNJ_COLUMNS.getColumn(id);
    if (!col) return;
    window.BGNJ_COLUMNS.saveColumn({ ...col, status: 'draft', publishAt: null, publishedAt: null });
    setTick((v) => v + 1);
  };

  const statusBadge = (s) => {
    const map = {
      draft: { label: 'DRAFT', color: 'var(--ink-3)' },
      scheduled: { label: 'SCHEDULED', color: 'var(--ink-2)' },
      published: { label: 'PUBLISHED', color: 'var(--secondary)' },
    };
    const m = map[s || 'published'];
    return (
      <span className="mono" style={{fontSize:9, letterSpacing:'0.22em', color: m.color, border:`1px solid ${m.color}`, padding:'1px 6px'}}>{m.label}</span>
    );
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:24, lineHeight:1.8}}>
        <strong className="gold">뱅기노자 칼럼</strong>은 관리자만 작성할 수 있습니다.
        임시 저장으로 본문을 보관하거나 예약 발행 시각을 지정할 수 있습니다.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); save('published'); }} style={{marginBottom:40}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14, gap:12, flexWrap:'wrap'}}>
          <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em'}}>
            {editingId ? `EDIT · ${editingId}` : 'NEW COLUMN'}
          </div>
          {editingId && (
            <button type="button" className="btn btn-small" onClick={reset}>새 칼럼으로 전환</button>
          )}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 200px', gap:12, marginBottom:16}}>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="col-title">제목 <span className="gold" aria-hidden="true">*</span></label>
            <input id="col-title" className="field-input" value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="칼럼 제목"/>
          </div>
        </div>
        {/* v00.133 — 카테고리 칩 선택 + 인라인 추가/삭제. 사용자 요청 '카테고리 손쉽게 수정 + 칩형'. */}
        <div className="field">
          <label className="field-label">카테고리</label>
          <ColumnCategoryChips selected={category} onSelect={setCategory}/>
        </div>
        {/* v00.129 — 부제목 (subtitle). 사용자 요청 '제목 / 부제목 / 본문 형태로'. DB 컬럼은 호환성 위해 excerpt 그대로 사용 (UI 라벨만 변경). */}
        <div className="field">
          <label className="field-label" htmlFor="col-subtitle">부제목 (선택)</label>
          <input id="col-subtitle" type="text" className="field-input"
            value={excerpt} onChange={e => setExcerpt(e.target.value)}
            placeholder="제목 아래 작은 문구 — 목록 카드/상세 상단에 노출 (비우면 본문 앞부분 자동 추출)"/>
        </div>
        <div className="field">
          <label className="field-label">본문 <span className="gold" aria-hidden="true">*</span></label>
          <TiptapEditor key={editorKey} preset="column"
            content={html}
            onUpdate={(h, _j, t) => { setHtml(h); setText(t); }}
            placeholder="칼럼 본문을 작성하세요. 툴바의 🖼 본문 이미지 버튼으로 이미지를 삽입하고, 드래그로 이동할 수 있습니다."/>
          <div className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.18em', marginTop:6}}>
            추정 읽기 시간 · {window.BGNJ_COLUMNS.estimateReadTime(text)} · 본문 {text.length}자
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="col-publishAt">예약 발행 시각 (선택 — 비우면 즉시 발행)</label>
          <input id="col-publishAt" type="datetime-local" className="field-input"
            value={publishAt} onChange={(e) => setPublishAt(e.target.value)}/>
        </div>
        {/* v00.115 — 칼럼 표시 시간(created_at) 오버라이드. publishAt 과 별도. */}
        <div className="field" style={{padding:'12px 14px', background:'rgba(245,213,72,0.04)', border:'1px dashed var(--primary-dim)'}}>
          <label className="field-label" htmlFor="col-createdAt" style={{display:'block', marginBottom:6}}>
            업로드 시간 (선택 — 비우면 발행 시점의 현재 시간)
          </label>
          <input id="col-createdAt" type="datetime-local" className="field-input"
            value={createdAt} onChange={(e) => setCreatedAt(e.target.value)}
            style={{maxWidth:280}}/>
          <div className="dim-2 mono" style={{fontSize:11, marginTop:4}}>
            KST 기준. 입력 시 칼럼 표시 시각이 이 값으로 고정됨. 예약 발행과 무관 — 표시용 시간.
          </div>
        </div>
        {/* v00.127 — 외부 기고처 + 원문 링크 (옵셔널). 칼럼 본문 끝 또는 헤더에 출처 표기. */}
        <div className="field" style={{padding:'12px 14px', background:'rgba(245,213,72,0.04)', border:'1px dashed var(--primary-dim)', display:'grid', gap:10}}>
          <div>
            <label className="field-label" htmlFor="col-source-credit" style={{display:'block', marginBottom:6}}>
              기고처 (선택 — 외부 매체 출처)
            </label>
            <input id="col-source-credit" type="text" className="field-input"
              placeholder="예: 한겨레, 중앙일보, 한국일보 칼럼"
              value={sourceCredit} onChange={(e) => setSourceCredit(e.target.value)}/>
          </div>
          <div>
            <label className="field-label" htmlFor="col-source-url" style={{display:'block', marginBottom:6}}>
              원문 링크 (선택 — http/https URL)
            </label>
            <input id="col-source-url" type="url" className="field-input"
              placeholder="https://..."
              value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)}/>
            <div className="dim-2 mono" style={{fontSize:11, marginTop:4}}>
              둘 다 비어있으면 출처 표기 없이 게재. 기고처만 있으면 텍스트로, 링크까지 있으면 클릭 가능 링크로 표시.
            </div>
          </div>
        </div>
        {/* v00.136 — 대표이미지 + 출처. v00.139 — 파일 업로드 + 본문 첫 이미지 자동 폴백. */}
        <div className="field" style={{padding:'12px 14px', background:'rgba(245,213,72,0.04)', border:'1px dashed var(--primary-dim)', display:'grid', gap:10}}>
          <div>
            <label className="field-label" style={{display:'block', marginBottom:6}}>
              대표 이미지 (선택 — 비우면 본문 첫 이미지 자동 사용)
            </label>
            <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
              <button type="button" className="btn btn-small" disabled={uploadingCover}
                onClick={async () => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async () => {
                    const f = input.files?.[0];
                    if (!f) return;
                    try {
                      setUploadingCover(true);
                      const { url } = await window.BGNJ_MEDIA.uploadFile(f, { folder: 'column-covers', maxBytes: 10 * 1024 * 1024 });
                      setCoverUrl(url);
                    } catch (err) {
                      try { window.BGNJ_TOAST.error('대표 이미지 업로드 실패: ' + (err?.message || err)); } catch {}
                    } finally { setUploadingCover(false); }
                  };
                  input.click();
                }}>
                {uploadingCover ? '⏳ 업로드 중…' : '🖼 파일 업로드'}
              </button>
              {coverUrl && (
                <>
                  <img src={coverUrl} alt="cover preview" style={{width:60, height:40, objectFit:'cover', border:'1px solid var(--line)'}}/>
                  <button type="button" className="btn btn-small" onClick={() => setCoverUrl('')}>제거</button>
                </>
              )}
            </div>
            <input id="col-cover-url" type="url" className="field-input" style={{marginTop:8}}
              placeholder="또는 URL 직접 입력 — 비우면 본문 첫 이미지가 자동 대표 이미지가 됩니다"
              value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)}/>
          </div>
          <div>
            <label className="field-label" htmlFor="col-cover-credit" style={{display:'block', marginBottom:6}}>
              대표 이미지 출처 (선택)
            </label>
            <input id="col-cover-credit" type="text" className="field-input"
              placeholder="예: Unsplash / Sarah Kim, 본인 촬영"
              value={coverCredit} onChange={(e) => setCoverCredit(e.target.value)}/>
            <div className="dim-2 mono" style={{fontSize:11, marginTop:4}}>
              칼럼 페이지의 대표 이미지 우하단에 © 표기로 노출. 비우면 표기 없이 게재.
            </div>
          </div>
        </div>
        {msg && <div role="status" className="mono gold" style={{fontSize:12, padding:10, border:'1px solid var(--primary-dim)', background:'rgba(245,213,72,0.06)', marginBottom:16}}>{msg}</div>}
        <div style={{display:'flex', gap:12, justifyContent:'flex-end', paddingTop:20, borderTop:'1px solid var(--line)', flexWrap:'wrap'}}>
          <button type="button" className="btn" onClick={reset}>초기화</button>
          {/* v00.135 — 편집 중이면 라벨에 '수정' prefix. 사용자 요청 '수정 발행 형태로'. */}
          <button type="button" className="btn" onClick={() => save('draft')}>{editingId ? '수정 임시저장' : '임시 저장'}</button>
          <button type="button" className="btn" onClick={() => save('scheduled')} disabled={!publishAt}>{editingId ? '수정 예약 발행' : '예약 발행'}</button>
          <button type="submit" className="btn btn-gold">{editingId ? '수정 발행 →' : '즉시 발행 →'}</button>
        </div>
      </form>

      <div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, gap:12, flexWrap:'wrap'}}>
          <h2 className="ko-serif" style={{fontSize:20}}>관리 중인 칼럼 ({counts.all})</h2>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            {[
              { key:'all',       label:'전체' },
              { key:'published', label:'발행' },
              { key:'scheduled', label:'예약' },
              { key:'draft',     label:'임시' },
            ].map((f) => (
              <button key={f.key} type="button" className="btn btn-small"
                onClick={() => setStatusFilter(f.key)}
                style={{
                  borderColor: statusFilter === f.key ? 'var(--primary)' : 'var(--line)',
                  color: statusFilter === f.key ? 'var(--primary)' : 'var(--ink-2)',
                  background: statusFilter === f.key ? 'rgba(245,213,72,0.06)' : 'transparent',
                }}>
                {f.label} <span className="mono dim-2" style={{fontSize:10, marginLeft:4}}>{counts[f.key] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="dim">해당 상태의 칼럼이 없습니다.</p>
        ) : (
          <div className="grid grid-2">
            {filtered.map(c => (
              <article key={c.id} className="card">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:10, alignItems:'center', gap:8, flexWrap:'wrap'}}>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <span className="pill">{c.category}</span>
                    {statusBadge(c.status)}
                  </div>
                  <time className="mono dim-2" style={{fontSize:10}}>{c.date}</time>
                </div>
                <h3 className="ko-serif" style={{fontSize:17, marginBottom:8}}>{c.title}</h3>
                <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:8}}>{c.excerpt}</p>
                {c.status === 'scheduled' && c.publishAt && (
                  <div className="mono" style={{fontSize:11, color:'var(--ink-2)', marginBottom:12}}>
                    예약 시각 · {window.BGNJ_FMT.kstDateTime(c.publishAt)}
                  </div>
                )}
                <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                  <button type="button" className="btn btn-small" onClick={() => startEdit(c)}>수정</button>
                  {c.status === 'published' && (
                    <button type="button" className="btn btn-small" onClick={() => unpublish(c.id)}>발행 취소</button>
                  )}
                  <button type="button" className="btn btn-small" onClick={() => remove(c.id)}
                    style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:'auto'}}>삭제</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// === Columns Hub Panel (v00.067) ====================================
// 칼럼 목록 + 글쓰기 모달 통합. 기존 별도 '칼럼 작성' 탭 흡수.
// "글쓰기" / "편집" 버튼 → 모달 (AdminColumnEditor) + 외부클릭/ESC 시 임시저장 prompt.
const ColumnsHubPanel = ({ allColumns }) => {
  const [tick, setTick] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [initialCol, setInitialCol] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [drafts, setDrafts] = React.useState(() => window.BGNJ_DRAFTS?.list?.('column') || []);
  // v00.148 — boot prefetch 가 admin:false (published 만). admin 진입 시 admin:true 재fetch.
  React.useEffect(() => {
    (async () => {
      try { await window.BGNJ_COLUMNS?.refresh?.({ admin: true }); } catch {}
      setTick((v) => v + 1);
    })();
  }, []);
  // v00.129 — 칼럼 카테고리 동적 관리 (site_content_kv.columnCategories).
  const [scTick, setScTick] = React.useState(0);
  const sc = React.useMemo(() => (window.BGNJ_SITE_CONTENT?.get?.() || {}), [scTick]);
  const colCats = Array.isArray(sc.columnCategories) ? sc.columnCategories : [];
  const [newCatName, setNewCatName] = React.useState('');
  const [catMsg, setCatMsg] = React.useState('');
  const addColCategory = async () => {
    setCatMsg('');
    const v = newCatName.trim();
    if (!v) { setCatMsg('카테고리 이름을 입력해 주세요.'); return; }
    if (colCats.includes(v)) { setCatMsg('이미 존재하는 카테고리입니다.'); return; }
    try {
      await window.BGNJ_SITE_CONTENT.saveSection('columnCategories', [...colCats, v]);
      setNewCatName('');
      setScTick((x) => x + 1);
      setCatMsg(`'${v}' 추가됨.`);
    } catch (err) { setCatMsg('추가 실패: ' + (err?.message || '')); }
  };
  const removeColCategory = async (name) => {
    if (!(await window.BGNJ_CONFIRM(`'${name}' 카테고리를 삭제하시겠어요?\n(기존 칼럼의 카테고리 값은 유지되지만 새 칼럼 작성 시 선택지에서 사라집니다.)`, { danger: true }))) return;
    try {
      await window.BGNJ_SITE_CONTENT.saveSection('columnCategories', colCats.filter((c) => c !== name));
      setScTick((x) => x + 1);
      setCatMsg(`'${name}' 삭제됨.`);
    } catch (err) { setCatMsg('삭제 실패: ' + (err?.message || '')); }
  };

  React.useEffect(() => {
    const onChange = () => setDrafts(window.BGNJ_DRAFTS?.list?.('column') || []);
    window.addEventListener('bgnj-drafts-change', onChange);
    return () => window.removeEventListener('bgnj-drafts-change', onChange);
  }, []);

  const all = React.useMemo(() => {
    try { return window.BGNJ_COLUMNS.listAll(); } catch { return allColumns || []; }
  }, [tick, allColumns]);
  const filtered = statusFilter === 'all' ? all : all.filter((c) => (c.status || 'published') === statusFilter);
  const counts = {
    all: all.length,
    draft: all.filter((c) => c.status === 'draft').length,
    scheduled: all.filter((c) => c.status === 'scheduled').length,
    published: all.filter((c) => (c.status || 'published') === 'published').length,
  };

  const openCreate = () => { setInitialCol(null); setModalOpen(true); };
  const openCreateFromDraft = (d) => {
    setInitialCol({ id: null, title: d.title || '', category: d.category || '왕의 미학', excerpt: d.excerpt || '',
      body: { html: d.html || '', text: d.text || '' }, publishAt: d.publishAt || '' });
    setModalOpen(true);
  };
  const openEdit = (col) => {
    setInitialCol(col);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setInitialCol(null); setTick((v) => v + 1); };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap', marginBottom:18}}>
        <p className="dim" style={{fontSize:13, lineHeight:1.8, margin:0, flex:1, minWidth:280}}>
          뱅기노자 칼럼 목록입니다. <strong className="gold">＋ 글쓰기</strong> 로 새 칼럼을 모달에서 작성하세요.
          모달 외부 클릭 또는 ESC 시 임시저장 프롬프트가 표시됩니다 (최대 7일·10개 보관).
        </p>
        <button type="button" className="btn btn-gold btn-small" onClick={openCreate}>＋ 글쓰기</button>
      </div>

      {/* v00.129 — 카테고리 관리 (추가/삭제). 사용자 요청 '카테고리를 뱅기노자 칼럼 탭에서 추가삭제할수있게해줘'. */}
      <div className="card" style={{padding:14, marginBottom:18}}>
        <div className="mono gold" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>카테고리 관리</div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:10}}>
          {colCats.length === 0 && (
            <span className="dim-2" style={{fontSize:12}}>등록된 카테고리가 없습니다. 아래에서 추가하세요.</span>
          )}
          {colCats.map((c) => (
            <span key={c} style={{display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', border:'1px solid var(--line)', fontSize:12}}>
              {c}
              <button type="button" onClick={() => removeColCategory(c)} aria-label={`${c} 삭제`}
                style={{background:'none', border:'none', color:'var(--danger)', cursor:'pointer', fontSize:14, padding:0, lineHeight:1}}>
                ✕
              </button>
            </span>
          ))}
        </div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input type="text" className="field-input" placeholder="새 카테고리 이름"
            value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColCategory(); } }}
            style={{flex:1, maxWidth:280}}/>
          <button type="button" className="btn btn-small" onClick={addColCategory}>＋ 추가</button>
        </div>
        {catMsg && <div className="mono dim-2" style={{fontSize:11, marginTop:6}}>{catMsg}</div>}
      </div>

      {drafts.length > 0 && (
        <div className="card" style={{padding:14, marginBottom:18}}>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>임시저장 ({drafts.length}/{window.BGNJ_DRAFTS?.MAX_COUNT || 10})</div>
          <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6}}>
            {drafts.map((d) => (
              <li key={d.id} style={{display:'flex', alignItems:'center', gap:8, fontSize:12}}>
                <span className="mono dim-2" style={{fontSize:10, minWidth:120}}>{d.savedAt ? window.BGNJ_FMT.kstShort(d.savedAt) : ''}</span>
                <span style={{flex:1, color:'var(--ink)'}}>{d.title || '(제목 없음)'}</span>
                <button type="button" className="btn btn-small" style={{fontSize:10}} onClick={() => openCreateFromDraft(d)}>이어쓰기</button>
                <button type="button" className="btn btn-small" style={{fontSize:10, borderColor:'var(--danger)', color:'var(--danger)'}}
                  onClick={() => { window.BGNJ_DRAFTS.remove(d.id); }}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:14}}>
        {[
          { k: 'all', label: `전체 (${counts.all})` },
          { k: 'published', label: `발행 (${counts.published})` },
          { k: 'scheduled', label: `예약 (${counts.scheduled})` },
          { k: 'draft', label: `초안 (${counts.draft})` },
        ].map((f) => (
          <button key={f.k} type="button" className="btn btn-small"
            onClick={() => setStatusFilter(f.k)}
            style={{
              fontSize:11,
              borderColor: statusFilter === f.k ? 'var(--primary)' : 'var(--line-2)',
              color: statusFilter === f.k ? 'var(--primary)' : 'var(--ink)',
              background: statusFilter === f.k ? 'rgba(245,213,72,0.10)' : 'var(--bg-2)',
              fontWeight: statusFilter === f.k ? 700 : 500,
            }}>{f.label}</button>
        ))}
      </div>

      {/* v00.139 — 카드형 → 목록(테이블)형. 사용자 요청 '카드형이 아니라 목록형으로'. */}
      {filtered.length === 0 ? (
        <p style={{fontSize:13, color:'var(--ink-3)', padding:'24px 0'}}>
          {statusFilter === 'all' ? '칼럼이 없습니다. ＋ 글쓰기 로 시작하세요.' : '필터 조건에 맞는 칼럼이 없습니다.'}
        </p>
      ) : (
        <div style={{overflowX:'auto', border:'1px solid var(--line)'}}>
          <table className="admin-table" style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
            <thead>
              <tr style={{background:'var(--bg-2)', borderBottom:'1px solid var(--line)'}}>
                <th style={{textAlign:'left', padding:'10px 12px', fontWeight:600, width:90}}>카테고리</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontWeight:600}}>제목</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontWeight:600, width:110}}>상태</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontWeight:600, width:140}}>작성일</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontWeight:600, width:80}}>읽기시간</th>
                <th style={{textAlign:'right', padding:'10px 12px', fontWeight:600, width:80}}>액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{borderBottom:'1px solid var(--line)'}}>
                  <td style={{padding:'10px 12px'}}><span className="pill" style={{fontSize:11}}>{c.category}</span></td>
                  <td style={{padding:'10px 12px'}}>
                    <div className="ko-serif" style={{fontSize:14, fontWeight:600}}>{c.title}</div>
                    <div className="mono dim-2" style={{fontSize:10, marginTop:2}}>#{String(c.id).slice(-6)}</div>
                  </td>
                  <td style={{padding:'10px 12px'}}>{(() => {
                    const m = ({
                      draft: { label: 'DRAFT', color: 'var(--ink-3)' },
                      scheduled: { label: 'SCHEDULED', color: 'var(--ink-2)' },
                      published: { label: 'PUBLISHED', color: 'var(--secondary)' },
                    })[c.status || 'published'];
                    return <span className="mono" style={{fontSize:9, letterSpacing:'0.18em', color: m.color, border:`1px solid ${m.color}`, padding:'1px 6px'}}>{m.label}</span>;
                  })()}</td>
                  <td style={{padding:'10px 12px'}} className="mono dim-2">{c.date || (c.createdAt ? (window.BGNJ_FMT?.kstShort?.(c.createdAt) || '') : '')}</td>
                  <td style={{padding:'10px 12px'}} className="mono dim-2">{c.readTime || ''}</td>
                  <td style={{padding:'10px 12px', textAlign:'right'}}>
                    <button type="button" className="btn btn-small" onClick={() => openEdit(c)}>편집</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && <ColumnEditorModalContent initialColumn={initialCol} onClose={closeModal}/>}
    </div>
  );
};

const ColumnEditorModalContent = ({ initialColumn, onClose }) => {
  const [payload, setPayload] = React.useState(null);
  // dirty 판정 — 처음 렌더 후 사용자 입력이 있었는지. 단순히 title/text 가 비어있지 않으면 dirty 처리.
  const dirty = !!(payload && (payload.title?.trim() || payload.text?.trim()));
  const saveDraft = React.useCallback(() => {
    if (!payload) return;
    try {
      window.BGNJ_DRAFTS.save({
        kind: 'column',
        title: payload.title || '',
        category: payload.category || '',
        excerpt: payload.excerpt || '',
        html: payload.html || '',
        text: payload.text || '',
        publishAt: payload.publishAt || '',
      });
    } catch {}
  }, [payload]);
  const { onBackdropClick } = window.useModalGuard({
    open: true, dirty, onClose, onSaveDraft: saveDraft, label: '칼럼',
  });

  return (
    <div role="dialog" aria-modal="true" aria-label="칼럼 작성"
      onClick={onBackdropClick}
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'grid', placeItems:'start center', padding:24, overflowY:'auto'}}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width:'min(1100px, 100%)', background:'var(--bg)', boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
        padding:24, marginTop:24, marginBottom:48,
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14}}>
          <h2 className="ko-serif" style={{fontSize:18, margin:0}}>{initialColumn?.id ? '칼럼 편집' : '새 칼럼 작성'}</h2>
          <button type="button" className="btn btn-small" onClick={async () => { /* 명시적 닫기 — useModalGuard 와 동일 prompt 패턴 (v00.262.007) */
            if (!dirty) { onClose?.(); return; }
            const ok = await window.BGNJ_CONFIRM('작성 중인 칼럼이 저장되지 않았습니다. 임시저장 하시겠어요?', {
              confirmLabel: '임시저장', cancelLabel: '취소', danger: false, dismissOnBackdrop: false,
            });
            if (!ok) return; // 취소 → 모달 유지 (이전엔 '그냥 닫기' 였음)
            saveDraft();
            onClose?.();
          }}>닫기</button>
        </div>
        <AdminColumnEditor initialColumn={initialColumn || undefined}
          onPayloadChange={setPayload}
          onAfterSave={(status) => {
            // v00.128 — 발행/예약 발행 완료 시 모달 자동 닫음. 임시 저장은 계속 작업할 수 있도록 유지.
            if (status === 'published' || status === 'scheduled') onClose?.();
          }}/>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
window.AdminColumnEditor = AdminColumnEditor;

export { AdminGradePanel, ColumnsHubPanel };

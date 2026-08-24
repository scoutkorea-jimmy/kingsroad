// 뱅기노자 — 커뮤니티 설정 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// AdminCategoryPanel(카테고리 CRUD/권한) · PromoChip(보조) · CommunityBoardsPanel(게시판 제목/설명).
// 자기완결적 — 의존은 모두 window 전역(BGNJ_API/STORES/CONFIRM/TOAST 등).
// entry-admin 에서 AuthAdminPage 앞에 로드. AdminCategoryPanel·CommunityBoardsPanel window 노출.

// === Admin: Category CRUD ==============================================
// v00.286 ESM — cross-module import (전역 결합 제거).
import { AdminEmpty, AdminPanelHeader, AdminSaveBar } from './AdminShared.jsx';

const AdminCategoryPanel = () => {
  const [cats, setCats] = React.useState(() => window.BGNJ_STORES.categories.slice());
  const [draft, setDraft] = React.useState({ id:"", label:"", boardType:"community", minLevel:0, postMinLevel:0, desc:"", allowRead:true, allowWrite:true, allowCommentRead:true, allowCommentWrite:true });
  const [error, setError] = React.useState("");


  const save = (next) => {
    window.BGNJ_STORES.categories = next;
    // v00.294.003 — 스토어 교체를 광장 화면·메가메뉴에 알린다(구독: CommunityPage·Shell).
    try { window.dispatchEvent(new CustomEvent('bgnj-categories-refresh')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (AdminCommunityConfigPanels.jsx:20)', _e); }
    window.BGNJ_SAVE.categories();
    setCats(next);
  };
  // v00.141 — 서버에도 PATCH (서버가 source of truth, localStorage 는 첫 페인트용 캐시).
  // 실패해도 UI 변경은 유지 (다음 boot 에서 서버 값으로 재동기화 됨).
  // 필드명 매핑: desc → description (워커 컬럼명).
  const persistToServer = async (cat, patch) => {
    const remap = {};
    for (const [k, v] of Object.entries(patch)) {
      if (k === 'desc') remap.description = v;
      else remap[k] = v;
    }
    try { await window.BGNJ_API?.categories?.update?.(cat.id, remap); } catch (err) { console.warn('[AdminCategoryPanel] PATCH 실패:', err?.message); }
  };
  const slugify = (s) => String(s || '').trim().toLowerCase()
    .replace(/[^a-z0-9-_가-힣]+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
  const add = async (e) => {
    e.preventDefault();
    setError("");
    let id = draft.id || slugify(draft.label);
    if (!id || !draft.label) return setError("ID와 이름은 필수입니다.");
    if (cats.find(c => c.id === id)) return setError("이미 존재하는 ID입니다.");
    const newCat = { ...draft, id, minLevel: Number(draft.minLevel), postMinLevel: Number(draft.postMinLevel) };
    save([...cats, newCat]);
    // 서버에도 생성 (실패해도 로컬은 유지).
    try {
      await window.BGNJ_API?.categories?.create?.({
        id, label: newCat.label, boardType: newCat.boardType,
        minLevel: newCat.minLevel, postMinLevel: newCat.postMinLevel,
        description: newCat.desc, prefixes: newCat.prefixes || [],
        allowRead: newCat.allowRead, allowWrite: newCat.allowWrite,
        allowCommentRead: newCat.allowCommentRead, allowCommentWrite: newCat.allowCommentWrite,
      });
    } catch (err) { console.warn('[AdminCategoryPanel] create 실패:', err?.message); }
    setDraft({ id:"", label:"", boardType:"community", minLevel:0, postMinLevel:0, desc:"", allowRead:true, allowWrite:true, allowCommentRead:true, allowCommentWrite:true });
  };
  const update = (i, key, val) => {
    const next = cats.slice();
    // v00.141 — boolean (allow_*) / number (level) / string 분기.
    let coerced = val;
    if (key.endsWith("Level")) coerced = Number(val);
    else if (key.startsWith("allow")) coerced = !!val;
    next[i] = { ...next[i], [key]: coerced };
    save(next);
    // 서버 patch — boot 시 서버에서 다시 받아오므로 동기화 필수.
    persistToServer(next[i], { [key]: coerced });
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= cats.length) return;
    const next = cats.slice();
    [next[i], next[j]] = [next[j], next[i]];
    save(next);
  };
  // v00.171 — server delete 호출 추가. 이전엔 localStorage 만 지워서 새로고침 시 boot 가 D1 default 로 다시 로드 → '삭제 안 됨' 인상.
  const remove = async (i) => {
    const cat = cats[i];
    const used = postCount(cat.id);
    const note = used > 0 ? `\n현재 이 게시판에 ${used}개의 글이 있습니다. 삭제 후에도 게시글은 남되 분류가 비게 됩니다.` : '';
    if (!(await window.BGNJ_CONFIRM(`"${cat.label}" 게시판을 삭제하시겠어요?${note}`, { danger: true }))) return;
    try {
      await window.BGNJ_API?.categories?.remove?.(cat.id);
    } catch (err) {
      window.BGNJ_TOAST.error('서버 삭제 실패: ' + (err?.message || '알 수 없는 오류') + '\n로컬에서만 제거합니다.');
    }
    save(cats.filter((_, j) => j !== i));
  };

  // 게시판별 글 수
  const postCount = (catId) => {
    const posts = window.BGNJ_COMMUNITY?.listPosts?.() || [];
    return posts.filter((p) => p.categoryId === catId).length;
  };

  const grades = (window.BGNJ_STORES?.grades || []).slice().sort((a, b) => (a.level || 0) - (b.level || 0));
  const communityCats = cats.filter((c) => c.boardType === 'community');

  return (
    <>
      <AdminPanelHeader
        eyebrow="BOARDS · 카테고리"
        title="게시판 카테고리 + 권한"
        description="게시판을 추가/삭제하고 각 게시판의 읽기·쓰기 최소 등급 + 4종 권한(글읽/글쓰/댓읽/댓쓰)을 체크박스로 설정합니다. 순서를 바꾸면 사이트 내비와 커뮤니티 탭에 즉시 반영됩니다."/>

      {/* 게시판 추가 — 통일 form 카드 */}
      <article className="admin-form-card">
        <div className="admin-form-card__eyebrow">＋ 새 게시판 추가</div>
        <form onSubmit={add} style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:10, alignItems:'end'}}>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-label">이름 <span className="gold" aria-hidden="true">*</span></label>
            <input id="cat-label" className="field-input" value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value, id: draft.id || slugify(e.target.value) })}
              placeholder="자유 / 질문 / 정보 ..."/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-id">ID (slug)</label>
            <input id="cat-id" className="field-input" value={draft.id}
              onChange={(e) => setDraft({ ...draft, id: slugify(e.target.value) })}
              placeholder="자동 생성"/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-type">유형</label>
            <select id="cat-type" className="field-input" value={draft.boardType}
              onChange={(e) => setDraft({ ...draft, boardType: e.target.value })}>
              <option value="community">커뮤니티</option>
              <option value="column">칼럼</option>
            </select>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-min">읽기 최소 Lv</label>
            <input id="cat-min" type="number" className="field-input" value={draft.minLevel}
              onChange={(e) => setDraft({ ...draft, minLevel: e.target.value })}/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label" htmlFor="cat-post">쓰기 최소 Lv</label>
            <input id="cat-post" type="number" className="field-input" value={draft.postMinLevel}
              onChange={(e) => setDraft({ ...draft, postMinLevel: e.target.value })}/>
          </div>
          <div className="field" style={{margin:0, gridColumn:'span 2'}}>
            <label className="field-label" htmlFor="cat-desc">설명</label>
            <input id="cat-desc" className="field-input" value={draft.desc}
              onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
              placeholder="게시판 안내 (선택)"/>
          </div>
          {/* v00.141 — 권한 체크박스 4종. 사용자 요청 '게시글 읽기/쓰기/댓글 작성/댓글 보기 권한 체크박스로'. */}
          <div className="field" style={{margin:0, gridColumn:'1 / -1', display:'flex', gap:14, flexWrap:'wrap', padding:'8px 0'}}>
            <label style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer'}}>
              <input type="checkbox" checked={draft.allowRead} onChange={(e) => setDraft({ ...draft, allowRead: e.target.checked })}/> 게시글 읽기
            </label>
            <label style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer'}}>
              <input type="checkbox" checked={draft.allowWrite} onChange={(e) => setDraft({ ...draft, allowWrite: e.target.checked })}/> 게시글 쓰기
            </label>
            <label style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer'}}>
              <input type="checkbox" checked={draft.allowCommentRead} onChange={(e) => setDraft({ ...draft, allowCommentRead: e.target.checked })}/> 댓글 보기
            </label>
            <label style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer'}}>
              <input type="checkbox" checked={draft.allowCommentWrite} onChange={(e) => setDraft({ ...draft, allowCommentWrite: e.target.checked })}/> 댓글 작성
            </label>
            <span className="dim-2 mono" style={{fontSize:10, alignSelf:'center'}}>· 체크 해제 시 비관리자 차단</span>
          </div>
          <button type="submit" className="btn btn-gold btn-small">＋ 추가</button>
        </form>
        {error && <div role="alert" className="mono" style={{color:'var(--danger)', fontSize:11, marginTop:10}}>{error}</div>}
      </article>

      {/* 게시판 목록 — v00.141 권한 체크박스 4열 추가 (글읽 · 글쓰 · 댓읽 · 댓쓰). */}
      <div style={{overflowX:'auto'}}>
      <table style={{width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:1100}}>
        <thead>
          <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
            <th scope="col" style={{padding:10, textAlign:'center', width:80}}>순서</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>ID</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>이름</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>유형</th>
            <th scope="col" style={{padding:10, textAlign:'right'}}>읽기≥</th>
            <th scope="col" style={{padding:10, textAlign:'right'}}>쓰기≥</th>
            <th scope="col" style={{padding:10, textAlign:'center', width:50}} title="게시글 읽기 허용">글읽</th>
            <th scope="col" style={{padding:10, textAlign:'center', width:50}} title="게시글 쓰기 허용">글쓰</th>
            <th scope="col" style={{padding:10, textAlign:'center', width:50}} title="댓글 보기 허용">댓읽</th>
            <th scope="col" style={{padding:10, textAlign:'center', width:50}} title="댓글 작성 허용">댓쓰</th>
            <th scope="col" style={{padding:10, textAlign:'right'}}>글 수</th>
            <th scope="col" style={{padding:10, textAlign:'left'}}>설명</th>
            <th scope="col" style={{padding:10, textAlign:'right'}}>액션</th>
          </tr>
        </thead>
        <tbody>
          {cats.map((c, i) => (
            <tr key={c.id} style={{borderBottom:'1px solid var(--line)'}}>
              <td style={{padding:8, textAlign:'center'}}>
                <div style={{display:'inline-flex', gap:4}}>
                  <button type="button" className="btn btn-small" onClick={() => move(i, -1)} disabled={i === 0}
                    style={{padding:'2px 6px', minHeight:0, fontSize:11}} aria-label="위로">▲</button>
                  <button type="button" className="btn btn-small" onClick={() => move(i, 1)} disabled={i === cats.length - 1}
                    style={{padding:'2px 6px', minHeight:0, fontSize:11}} aria-label="아래로">▼</button>
                </div>
              </td>
              <td className="mono gold" style={{padding:10, fontSize:11}}>{c.id}</td>
              <td style={{padding:10}}>
                <input className="field-input" style={{padding:'4px 8px'}} value={c.label}
                  onChange={(e) => update(i, 'label', e.target.value)}/>
              </td>
              <td style={{padding:10}}>
                <select className="field-input" style={{padding:'4px 8px'}} value={c.boardType}
                  onChange={(e) => update(i, 'boardType', e.target.value)}>
                  <option value="community">커뮤니티</option>
                  <option value="column">칼럼</option>
                </select>
              </td>
              <td style={{padding:10, textAlign:'right'}}>
                <input type="number" className="field-input" style={{padding:'4px 8px', width:64, textAlign:'right'}}
                  value={c.minLevel ?? 0} onChange={(e) => update(i, 'minLevel', e.target.value)}/>
              </td>
              <td style={{padding:10, textAlign:'right'}}>
                <input type="number" className="field-input" style={{padding:'4px 8px', width:64, textAlign:'right'}}
                  value={c.postMinLevel ?? 0} onChange={(e) => update(i, 'postMinLevel', e.target.value)}/>
              </td>
              {/* v00.141 — 권한 체크박스 4열. undefined(레거시) → checked. 명시 false 만 차단. */}
              <td style={{padding:10, textAlign:'center'}}>
                <input type="checkbox" aria-label="게시글 읽기 허용"
                  checked={c.allowRead !== false} onChange={(e) => update(i, 'allowRead', e.target.checked)}/>
              </td>
              <td style={{padding:10, textAlign:'center'}}>
                <input type="checkbox" aria-label="게시글 쓰기 허용"
                  checked={c.allowWrite !== false} onChange={(e) => update(i, 'allowWrite', e.target.checked)}/>
              </td>
              <td style={{padding:10, textAlign:'center'}}>
                <input type="checkbox" aria-label="댓글 보기 허용"
                  checked={c.allowCommentRead !== false} onChange={(e) => update(i, 'allowCommentRead', e.target.checked)}/>
              </td>
              <td style={{padding:10, textAlign:'center'}}>
                <input type="checkbox" aria-label="댓글 작성 허용"
                  checked={c.allowCommentWrite !== false} onChange={(e) => update(i, 'allowCommentWrite', e.target.checked)}/>
              </td>
              <td className="mono dim-2" style={{padding:10, textAlign:'right', fontSize:11}}>
                {c.boardType === 'community' ? postCount(c.id) : '-'}
              </td>
              <td style={{padding:10}}>
                <input className="field-input" style={{padding:'4px 8px'}} value={c.desc || ''}
                  onChange={(e) => update(i, 'desc', e.target.value)} placeholder="설명"/>
              </td>
              <td style={{padding:10, textAlign:'right'}}>
                <button type="button" className="btn btn-small" onClick={() => remove(i)}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <button type="button" className="btn btn-small" style={{marginTop:20}}
        onClick={async () => { if ((await window.BGNJ_CONFIRM("기본값으로 되돌립니다. 진행할까요?", { danger: true }))) { window.BGNJ_SAVE.resetCategories(); setCats(window.BGNJ_STORES.categories.slice()); } }}>
        기본값 복원
      </button>

      {/* 권한 매트릭스 — 등급 × 게시판 */}
      <article className="card" style={{padding:20, marginTop:32}}>
        <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>PERMISSION MATRIX</div>
        <h3 className="ko-serif" style={{fontSize:18, marginBottom:8}}>등급 × 게시판 권한</h3>
        <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:16}}>
          ✓ = 가능 / · = 불가. 이 매트릭스는 위 표의 등급 기준이 바뀌면 즉시 반영됩니다.
        </p>
        <div style={{overflow:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:540}}>
            <thead>
              <tr style={{background:'var(--bg-2)'}}>
                <th scope="col" style={{padding:10, textAlign:'left', position:'sticky', left:0, background:'var(--bg-2)', zIndex:1}}>등급</th>
                {communityCats.map((c) => (
                  <th key={c.id} scope="col" style={{padding:10, textAlign:'center', fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.18em', color:'var(--ink-3)'}}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => {
                const lv = g.id === 'admin' ? 100 : (g.level || 0);
                return (
                  <tr key={g.id} style={{borderTop:'1px solid var(--line)'}}>
                    <td style={{padding:10, position:'sticky', left:0, background:'var(--bg)', zIndex:1}}>
                      <span className="mono" style={{fontSize:10, letterSpacing:'0.14em', color: g.color || 'var(--primary)', border:`1px solid ${g.color || 'var(--primary-dim)'}`, padding:'1px 6px', marginRight:8}}>{g.label}</span>
                      <span className="dim-2 mono" style={{fontSize:10}}>Lv {lv}</span>
                    </td>
                    {communityCats.map((c) => {
                      const canRead = lv >= (c.minLevel ?? 0);
                      const canWrite = lv >= (c.postMinLevel ?? c.minLevel ?? 0);
                      return (
                        <td key={c.id} style={{padding:10, textAlign:'center', fontSize:11}}>
                          <span className="mono" style={{color: canRead ? 'var(--primary)' : 'var(--ink-3)'}}>읽 {canRead ? '✓' : '·'}</span>
                          {' / '}
                          <span className="mono" style={{color: canWrite ? 'var(--primary)' : 'var(--ink-3)'}}>쓰 {canWrite ? '✓' : '·'}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>

      {/* v00.305.001 — 말머리 편집은 PrefixTagsPanel(관리자 → 커뮤니티 → 말머리 탭)로 옮겼다.
          여기 있던 UI 는 **화면에 렌더된 적이 없다** — AdminCategoryPanel 은 v00.175 에서
          '카테고리' 탭이 폐기되면서 import 만 남고 어디서도 그려지지 않았다.
          그것도 모르고 "게시판 탭에서 말머리를 등록하세요" 라고 안내했었다. 두 곳에 두지 않는다. */}
    </>
  );
};


// === Admin: 말머리 · 자동 태그 ==========================================
// v00.305.001 — 독립 탭(관리자 → 커뮤니티 → 말머리).
//
// 왜 옮겼나: 이 UI 는 원래 AdminCategoryPanel 안에 있었는데, 그 패널은 v00.175 에서
//   '카테고리' 탭이 폐기되면서 **import 만 남고 어디서도 렌더되지 않았다.**
//   말머리를 등록할 자리가 화면에 존재하지 않았던 셈이다(그래서 글에만 말머리가 달리고
//   게시판 설정은 계속 비어 있었다 — v00.305 에서 그 어긋남을 코드로 흡수해야 했던 이유).
//
// 자기완결적이다 — 자체 상태 + 서버 PATCH. 스토어가 바뀌면 이벤트로 따라간다.
const PrefixTagsPanel = () => {
  const [cats, setCats] = React.useState(() => window.BGNJ_STORES.categories.slice());
  const [prefixDrafts, setPrefixDrafts] = React.useState({});
  // 키는 `${catId}::${말머리}` — 게시판이 달라도 같은 말머리 이름이 안 섞이게.
  const [tagDrafts, setTagDrafts] = React.useState({});
  const [applying, setApplying] = React.useState("");

  // 다른 화면(게시판 설정 등)에서 스토어를 갈아끼우면 따라간다.
  React.useEffect(() => {
    const onCats = () => setCats(window.BGNJ_STORES.categories.slice());
    window.addEventListener('bgnj-categories-refresh', onCats);
    return () => window.removeEventListener('bgnj-categories-refresh', onCats);
  }, []);

  const save = (next) => {
    window.BGNJ_STORES.categories = next;
    try { window.dispatchEvent(new CustomEvent('bgnj-categories-refresh')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (PrefixTagsPanel)', _e); }
    window.BGNJ_SAVE.categories();
    setCats(next);
  };
  const update = (i, key, val) => {
    const next = cats.slice();
    next[i] = { ...next[i], [key]: val };
    save(next);
    // 서버가 정본이다. localStorage 는 첫 페인트용 캐시일 뿐이라 PATCH 를 빠뜨리면
    // 새로고침하는 순간 되돌아간다.
    (async () => {
      try { await window.BGNJ_API?.categories?.update?.(next[i].id, { [key]: val }); }
      catch (err) {
        console.warn('[PrefixTagsPanel] PATCH 실패:', err?.message);
        window.BGNJ_TOAST.error('서버에 저장하지 못했습니다. 새로고침하면 되돌아갑니다.');
      }
    })();
  };

  const communityCats = cats.filter((c) => (c.boardType || 'community') === 'community');
  const postsOf = (catId, prefixName) => {
    try {
      return (window.BGNJ_COMMUNITY?.listPosts?.() || [])
        .filter((p) => p.categoryId === catId && String(p.prefix || '').trim() === prefixName).length;
    } catch { return 0; }
  };

  return (
    <>
      <AdminPanelHeader
        eyebrow="THREAD PREFIXES · 말머리"
        title="말머리 · 자동 태그"
        description="게시판마다 글 작성 시 고를 수 있는 말머리를 정하고, 말머리별로 따라붙을 태그를 관리합니다. 말머리를 등록하면 글쓰기 화면의 선택 버튼과 커뮤니티 목록 필터에 바로 나옵니다."/>
      <article className="card" style={{padding:20}}>
        {communityCats.length === 0 && (
          <div className="dim" style={{fontSize:13}}>커뮤니티 게시판이 없습니다.</div>
        )}
        {communityCats.map((c) => {
          const catIdx = cats.findIndex((x) => x.id === c.id);
          // v00.305 — 말머리는 { name, tags } 정의다. 옛 문자열 형태도 여기서 흡수된다.
          const defs = window.BGNJ_PREFIX_DEFS(c);
          const draftVal = prefixDrafts[c.id] || "";
          const writeDefs = (next) => update(catIdx, 'prefixes', next);
          const addTag = async (name, raw) => {
            const tag = String(raw || '').trim().replace(/^#+/, '').replace(/\s+/g, '');
            if (!tag) return;
            const target = defs.find((d) => d.name === name);
            if (!target || target.tags.includes(tag)) return;
            if (target.tags.length >= 10) { window.BGNJ_TOAST.error('말머리 하나에 태그는 10개까지입니다.'); return; }
            const nextTags = [...target.tags, tag];
            writeDefs(defs.map((d) => (d.name === name ? { ...d, tags: nextTags } : d)));
            setTagDrafts((prev) => ({ ...prev, [`${c.id}::${name}`]: "" }));
            // 사용자 선택(2026-08-23): 저장하면 그 말머리 글에 **바로** 붙인다.
            //   더하기만 하므로 작성자가 적어 둔 태그는 그대로 남는다.
            setApplying(`${c.id}::${name}`);
            try {
              const r = await window.BGNJ_COMMUNITY.applyPrefixTags(c.id, name, [tag]);
              if (r.changed) window.BGNJ_TOAST.success?.(`'${name}' 글 ${r.changed}편에 #${tag} 를 붙였습니다.`);
              if (r.failed) window.BGNJ_TOAST.error(`${r.failed}편은 실패했습니다 — 잠시 후 다시 시도해 주세요.`);
            } catch (e) {
              window.BGNJ_TOAST.error('기존 글에 태그를 붙이지 못했습니다. 말머리 설정은 저장됐습니다.');
              console.warn('[AdminCategoryPanel] applyPrefixTags 실패:', e?.message || e);
            } finally { setApplying(""); }
          };
          const removeTag = (name, tag) => {
            // 설정에서만 뺀다. 이미 글에 붙은 태그는 건드리지 않는다 — 지우는 건 사람이 판단할 일이다.
            writeDefs(defs.map((d) => (d.name === name ? { ...d, tags: d.tags.filter((t) => t !== tag) } : d)));
          };
          const addPrefix = () => {
            const val = draftVal.trim();
            if (val && !defs.some((d) => d.name === val)) writeDefs([...defs, { name: val, tags: [] }]);
            setPrefixDrafts((prev) => ({ ...prev, [c.id]: "" }));
          };
          return (
            <div key={c.id} style={{marginBottom:16, padding:'14px 16px', background:'var(--bg-2)', border:'1px solid var(--line)'}}>
              <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
                <span className="ko-serif" style={{fontSize:15}}>{c.label}</span>
                <span className="mono dim-2" style={{fontSize:10}}>#{c.id}</span>
                <span className="mono dim-2" style={{fontSize:10, marginLeft:4}}>말머리 {defs.length}개</span>
              </div>

              {defs.length === 0 && (
                <div className="dim-2 mono" style={{fontSize:11, marginBottom:10}}>
                  말머리 없음 — 추가하면 글쓰기 화면의 선택 버튼과 목록 필터에 바로 나옵니다
                </div>
              )}

              {/* 말머리마다 한 칸 — 이름 + 그 말머리에 딸린 태그 */}
              {defs.map((d) => {
                const tagKey = `${c.id}::${d.name}`;
                const tagDraft = tagDrafts[tagKey] || "";
                const busy = applying === tagKey;
                return (
                  <div key={d.name} style={{padding:'10px 12px', marginBottom:8, background:'var(--bg-3)', border:'1px solid var(--line)'}}>
                    <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap'}}>
                      <span className="gold" style={{fontSize:13}}>{d.name}</span>
                      <span className="mono dim-2" style={{fontSize:10}}>글 {postsOf(c.id, d.name)}편</span>
                      <button type="button"
                        onClick={() => writeDefs(defs.filter((x) => x.name !== d.name))}
                        style={{background:'none', border:'none', cursor:'pointer', color:'var(--danger)', fontSize:15, lineHeight:1, padding:0}}
                        aria-label={`${d.name} 말머리 삭제`}>×</button>
                    </div>
                    <div style={{display:'flex', gap:6, flexWrap:'wrap', alignItems:'center'}}>
                      <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em'}}>자동 태그</span>
                      {d.tags.length === 0 && <span className="dim-2" style={{fontSize:11}}>없음</span>}
                      {d.tags.map((t) => (
                        <span key={t} className="tag-chip" style={{display:'inline-flex', alignItems:'center', gap:4}}>
                          #{t}
                          <button type="button" onClick={() => removeTag(d.name, t)}
                            style={{background:'none', border:'none', cursor:'pointer', color:'var(--danger)', fontSize:13, lineHeight:1, padding:0}}
                            aria-label={`${t} 태그 제거`}>×</button>
                        </span>
                      ))}
                      <input className="field-input" style={{padding:'3px 8px', maxWidth:150, fontSize:12}}
                        value={tagDraft} disabled={busy}
                        placeholder={busy ? '적용 중…' : '태그 입력 후 Enter'}
                        onChange={(e) => setTagDrafts((prev) => ({ ...prev, [tagKey]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key !== 'Enter') return;
                          e.preventDefault();
                          addTag(d.name, tagDraft);
                        }}/>
                      <button type="button" className="btn btn-small" disabled={busy}
                        onClick={() => addTag(d.name, tagDraft)}>추가</button>
                    </div>
                    {/* v00.306 — 이미 쓰이고 있는 태그를 눌러서 붙인다.
                        새로 쳐 넣는 것도 그대로 되지만, 같은 뜻의 태그가 표기만 달리 갈리는 걸 막는다. */}
                    {(() => {
                      const sugg = window.BGNJ_TAG_SUGGEST(tagDraft, { exclude: d.tags, limit: 8 });
                      if (!sugg.length) return null;
                      return (
                        <div style={{display:'flex', gap:6, flexWrap:'wrap', alignItems:'center', marginTop:6}}>
                          <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em'}}>
                            {tagDraft.trim() ? '찾은 태그' : '이미 쓰는 태그'}
                          </span>
                          {sugg.map((sg) => (
                            <button key={sg.name} type="button" disabled={busy}
                              onClick={() => addTag(d.name, sg.name)}
                              className="mono"
                              style={{fontSize:10.5, padding:'2px 8px', border:'1px dashed var(--line-2)',
                                background:'none', color:'var(--ink-2)', cursor: busy ? 'default' : 'pointer'}}
                              title={`${sg.uses}편에 쓰이는 중`}>
                              #{sg.name} <span className="dim-2">{sg.uses}</span>
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                    <p className="dim-2" style={{fontSize:10.5, marginTop:6, lineHeight:1.6}}>
                      태그를 추가하면 <b>이 말머리로 이미 올라온 글에도 바로 붙습니다.</b> 더하기만 하므로 작성자가
                      적어 둔 태그는 지워지지 않습니다. 여기서 태그를 빼도 이미 붙은 글에서는 사라지지 않습니다.
                    </p>
                  </div>
                );
              })}

              <div style={{display:'flex', gap:8}}>
                <input className="field-input" style={{padding:'4px 8px', maxWidth:220}} value={draftVal}
                  placeholder="말머리 입력 후 Enter 또는 추가..."
                  onChange={(e) => setPrefixDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key !== 'Enter') return; e.preventDefault(); addPrefix(); }}/>
                <button type="button" className="btn btn-small btn-gold" onClick={addPrefix}>말머리 추가</button>
              </div>
            </div>
          );
        })}
      </article>
    </>
  );
};

// === Admin: Grade CRUD =================================================
// 자동 승급 기준 칩 — 등급 표 각 행 아래에 인라인 노출 (read-only).
// tone='danger' 면 신고 한계 강조. 값이 없으면 0/제한없음으로 폴백.
const PromoChip = ({ label, value, prefix = '≥', tone }) => (
  <span style={{
    display:'inline-flex', alignItems:'center', gap:4,
    padding:'3px 8px', border:'1px solid var(--line-2)',
    borderRadius:999, background:'var(--bg)', color: tone === 'danger' ? 'var(--danger)' : 'var(--ink)',
  }}>
    <span style={{color:'var(--ink-3)', fontSize:10}}>{label}</span>
    <span style={{fontWeight:600}}>{prefix} {Number.isFinite(Number(value)) ? Number(value) : 0}</span>
  </span>
);

// === Community Boards Description Panel (v00.146) =================
// 사용자 요청 '커뮤니티의 각 항목별 설명(제목, 설명)을 관리할수 있는 페이지'.
// AdminCategoryPanel 은 기술적 카테고리 CRUD (slug / 권한 / 등급) 에 집중.
// 이 패널은 "운영자가 매일 손볼 콘텐츠" — 게시판 제목과 설명을 큼직한 입력으로 편집.
// 공지(notice) 게시판은 어떠한 경우에도 관리자만 작성 — 강제 규칙 표시.
const CommunityBoardsPanel = () => {
  // v00.172 — 카테고리 패널과 통합 + 테이블/리스트형 + 드래그앤드롭.
  // 사용자 보고 '커뮤니티 게시판 목록은 리스트형(테이블형)으로 보여주고 드래그앤드랍으로 순서 변경 + 카테고리와 합쳐'.
  const [tick, setTick] = React.useState(0);
  const grades = React.useMemo(() =>
    (window.BGNJ_STORES?.grades || []).slice().sort((a, b) => (a.level || 0) - (b.level || 0)),
    [tick]
  );
  const boards = React.useMemo(() => (
    (window.BGNJ_STORES?.categories || [])
      .filter((c) => c.boardType === 'community')
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  ), [tick]);
  const [edits, setEdits] = React.useState({});  // { id: { label, desc, ... } }
  const [saving, setSaving] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState({ id: '', label: '', desc: '' });

  const dirty = Object.keys(edits).length > 0;
  const valueOf = (b) => ({
    label: edits[b.id]?.label ?? b.label,
    desc: edits[b.id]?.desc ?? (b.desc || ''),
    minLevel: edits[b.id]?.minLevel ?? (b.minLevel ?? 0),
    postMinLevel: edits[b.id]?.postMinLevel ?? (b.postMinLevel ?? 0),
    allowRead: edits[b.id]?.allowRead ?? (b.allowRead !== false),
    allowWrite: edits[b.id]?.allowWrite ?? (b.allowWrite !== false),
    allowCommentRead: edits[b.id]?.allowCommentRead ?? (b.allowCommentRead !== false),
    allowCommentWrite: edits[b.id]?.allowCommentWrite ?? (b.allowCommentWrite !== false),
  });

  // v00.175 — 드래그앤드롭 reorder 상태.
  const [draggingId, setDraggingId] = React.useState(null);
  const [dragOverId, setDragOverId] = React.useState(null);
  const [expanded, setExpanded] = React.useState(null);  // 권한/레벨 expanded row id

  const update = (id, key, val) => {
    setEdits((cur) => ({ ...cur, [id]: { ...(cur[id] || {}), [key]: val } }));
    setSaveMsg('');
  };

  const slugify = (s) => String(s || '').trim().toLowerCase()
    .replace(/[^a-z0-9-_가-힣]+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '');

  const addBoard = async () => {
    const id = draft.id || slugify(draft.label);
    if (!id || !draft.label.trim()) { setSaveMsg('✗ 게시판 이름은 필수입니다.'); return; }
    if (boards.find((b) => b.id === id)) { setSaveMsg('✗ 이미 존재하는 ID 입니다.'); return; }
    setSaving(true);
    try {
      await window.BGNJ_API?.categories?.create?.({
        id, label: draft.label.trim(), boardType: 'community',
        minLevel: 0, postMinLevel: 0,
        description: draft.desc || '', prefixes: [],
        allowRead: true, allowWrite: true, allowCommentRead: true, allowCommentWrite: true,
        order: boards.length,
      });
      const allCats = (window.BGNJ_STORES?.categories || []).slice();
      allCats.push({
        id, label: draft.label.trim(), boardType: 'community',
        minLevel: 0, postMinLevel: 0, desc: draft.desc || '',
        prefixes: [], allowRead: true, allowWrite: true, allowCommentRead: true, allowCommentWrite: true,
        order: boards.length,
      });
      window.BGNJ_STORES.categories = allCats;
      // v00.294.003 — 스토어 교체를 광장 화면·메가메뉴에 알린다(구독: CommunityPage·Shell).
      try { window.dispatchEvent(new CustomEvent('bgnj-categories-refresh')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (AdminCommunityConfigPanels.jsx:449)', _e); }
      window.BGNJ_SAVE.categories();
      setDraft({ id: '', label: '', desc: '' });
      setAdding(false);
      setTick((v) => v + 1);
      setSaveMsg(`✓ '${draft.label.trim()}' 게시판이 추가되었습니다.`);
      setTimeout(() => setSaveMsg(''), 2400);
    } catch (err) {
      setSaveMsg('✗ 추가 실패: ' + (err?.message || '알 수 없는 오류'));
    } finally { setSaving(false); }
  };

  const removeBoard = async (id) => {
    if (id === 'notice') { window.BGNJ_TOAST.error('공지 게시판은 삭제할 수 없습니다.'); return; }
    const target = boards.find((b) => b.id === id);
    if (!target) return;
    const postCount = ((window.BGNJ_COMMUNITY?.listPosts?.() || []).filter((p) => p.categoryId === id)).length;
    const note = postCount > 0 ? `\n현재 이 게시판에 ${postCount}개의 글이 있습니다. 삭제 후에도 게시글은 남되 분류가 비게 됩니다.` : '';
    if (!(await window.BGNJ_CONFIRM(`"${target.label}" 게시판을 삭제하시겠어요?${note}`, { danger: true }))) return;
    setSaving(true);
    try {
      await window.BGNJ_API?.categories?.remove?.(id);
      const allCats = (window.BGNJ_STORES?.categories || []).filter((c) => c.id !== id);
      window.BGNJ_STORES.categories = allCats;
      // v00.294.003 — 스토어 교체를 광장 화면·메가메뉴에 알린다(구독: CommunityPage·Shell).
      try { window.dispatchEvent(new CustomEvent('bgnj-categories-refresh')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (AdminCommunityConfigPanels.jsx:474)', _e); }
      window.BGNJ_SAVE.categories();
      setEdits((cur) => { const next = { ...cur }; delete next[id]; return next; });
      setTick((v) => v + 1);
      setSaveMsg(`✓ '${target.label}' 게시판이 삭제되었습니다.`);
      setTimeout(() => setSaveMsg(''), 2400);
    } catch (err) {
      setSaveMsg('✗ 삭제 실패: ' + (err?.message || '알 수 없는 오류'));
    } finally { setSaving(false); }
  };

  // v00.175 — HTML5 드래그앤드롭 reorder. 드롭 시 즉시 서버 PATCH (display_order) 일괄.
  const onDrop = async (toId) => {
    if (!draggingId || draggingId === toId) {
      setDraggingId(null); setDragOverId(null); return;
    }
    const fromIdx = boards.findIndex((b) => b.id === draggingId);
    const toIdx = boards.findIndex((b) => b.id === toId);
    if (fromIdx < 0 || toIdx < 0) {
      setDraggingId(null); setDragOverId(null); return;
    }
    const next = boards.slice();
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setSaving(true);
    try {
      await Promise.all(next.map((b, i) => {
        if ((b.order ?? 0) === i) return Promise.resolve();
        return window.BGNJ_API?.categories?.update?.(b.id, { order: i }).catch(() => null);
      }));
      const allCats = (window.BGNJ_STORES?.categories || []).slice();
      next.forEach((b, i) => {
        const idx = allCats.findIndex((c) => c.id === b.id);
        if (idx >= 0) allCats[idx] = { ...allCats[idx], order: i };
      });
      window.BGNJ_STORES.categories = allCats;
      // v00.294.003 — 스토어 교체를 광장 화면·메가메뉴에 알린다(구독: CommunityPage·Shell).
      try { window.dispatchEvent(new CustomEvent('bgnj-categories-refresh')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (AdminCommunityConfigPanels.jsx:511)', _e); }
      window.BGNJ_SAVE.categories();
      setTick((v) => v + 1);
      setSaveMsg('✓ 순서 변경됨.');
      setTimeout(() => setSaveMsg(''), 1800);
    } catch (err) {
      setSaveMsg('✗ 순서 변경 실패: ' + (err?.message || ''));
    } finally {
      setSaving(false);
      setDraggingId(null);
      setDragOverId(null);
    }
  };

  // v00.175 — 행 단위 통합 저장 (label/desc/level/4종 권한 한 번에 D1 PATCH).
  const commitRow = async (id) => {
    const e = edits[id];
    if (!e) return;
    setSaving(true);
    try {
      const remap = {};
      if ('label' in e) remap.label = e.label;
      if ('desc' in e) remap.description = e.desc;
      if ('minLevel' in e) remap.minLevel = Number(e.minLevel);
      if ('postMinLevel' in e) remap.postMinLevel = Number(e.postMinLevel);
      if ('allowRead' in e) remap.allowRead = e.allowRead;
      if ('allowWrite' in e) remap.allowWrite = e.allowWrite;
      if ('allowCommentRead' in e) remap.allowCommentRead = e.allowCommentRead;
      if ('allowCommentWrite' in e) remap.allowCommentWrite = e.allowCommentWrite;
      await window.BGNJ_API?.categories?.update?.(id, remap);
      const allCats = (window.BGNJ_STORES?.categories || []).slice();
      const idx = allCats.findIndex((c) => c.id === id);
      if (idx >= 0) {
        allCats[idx] = { ...allCats[idx], ...e };
      }
      window.BGNJ_STORES.categories = allCats;
      // v00.294.003 — 스토어 교체를 광장 화면·메가메뉴에 알린다(구독: CommunityPage·Shell).
      try { window.dispatchEvent(new CustomEvent('bgnj-categories-refresh')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (AdminCommunityConfigPanels.jsx:548)', _e); }
      window.BGNJ_SAVE.categories();
      setEdits((cur) => { const next = { ...cur }; delete next[id]; return next; });
      setTick((v) => v + 1);
      setSaveMsg('✓ 저장됨.');
      setTimeout(() => setSaveMsg(''), 1800);
    } catch (err) {
      setSaveMsg('✗ 저장 실패: ' + (err?.message || ''));
    } finally { setSaving(false); }
  };

  const commitAll = async () => {
    if (saving || !dirty) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const changedIds = Object.keys(edits);
      // 1) 서버 PATCH 병렬 — v00.175 새 필드(level/권한 4종) 포함.
      const failed = [];
      await Promise.all(changedIds.map(async (id) => {
        const e = edits[id];
        const remap = {};
        if ('label' in e) remap.label = e.label;
        if ('desc' in e) remap.description = e.desc;
        if ('minLevel' in e) remap.minLevel = Number(e.minLevel);
        if ('postMinLevel' in e) remap.postMinLevel = Number(e.postMinLevel);
        if ('allowRead' in e) remap.allowRead = e.allowRead;
        if ('allowWrite' in e) remap.allowWrite = e.allowWrite;
        if ('allowCommentRead' in e) remap.allowCommentRead = e.allowCommentRead;
        if ('allowCommentWrite' in e) remap.allowCommentWrite = e.allowCommentWrite;
        try {
          await window.BGNJ_API?.categories?.update?.(id, remap);
        } catch (err) { failed.push(id); }
      }));
      // 2) 로컬 store 동기화 — 모든 변경 필드 머지.
      const allCats = (window.BGNJ_STORES?.categories || []).slice();
      changedIds.forEach((id) => {
        const idx = allCats.findIndex((c) => c.id === id);
        if (idx >= 0) allCats[idx] = { ...allCats[idx], ...edits[id] };
      });
      window.BGNJ_STORES.categories = allCats;
      // v00.294.003 — 스토어 교체를 광장 화면·메가메뉴에 알린다(구독: CommunityPage·Shell).
      try { window.dispatchEvent(new CustomEvent('bgnj-categories-refresh')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (AdminCommunityConfigPanels.jsx:590)', _e); }
      window.BGNJ_SAVE.categories();
      setEdits({});
      setTick((v) => v + 1);
      if (failed.length) {
        setSaveMsg(`⚠ ${changedIds.length - failed.length}개 저장, ${failed.length}개 실패: ${failed.join(', ')}`);
      } else {
        setSaveMsg(`✓ ${changedIds.length}개 게시판 정보 저장됨.`);
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch (err) {
      setSaveMsg('✗ 저장 실패: ' + (err?.message || '알 수 없는 오류'));
    } finally { setSaving(false); }
  };

  return (
    <>
      <AdminPanelHeader
        eyebrow="COMMUNITY · 게시판 관리"
        title="커뮤니티 게시판 — 테이블 + 드래그앤드롭"
        description="게시판을 한 화면에서 추가·삭제·순서변경·편집합니다. 좌측 ≡ 핸들로 드래그앤드롭 / 행 클릭 시 권한·등급 펼쳐 보기. 모든 변경은 D1 서버 즉시 저장."/>

      {/* v00.171 — 새 게시판 추가 (즉시 서버 반영). */}
      {!adding ? (
        <div style={{marginBottom:16}}>
          <button type="button" className="btn btn-gold btn-small" onClick={() => setAdding(true)}>
            ＋ 새 게시판 추가
          </button>
        </div>
      ) : (
        <article className="admin-form-card" style={{padding:18, marginBottom:16, borderColor:'var(--primary-dim)'}}>
          <div className="mono gold" style={{fontSize:11, letterSpacing:'0.2em', marginBottom:12}}>＋ 새 게시판</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:10, marginBottom:12}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="new-bd-label">이름 <span className="gold" aria-hidden="true">*</span></label>
              <input id="new-bd-label" className="field-input"
                value={draft.label}
                onChange={(e) => setDraft({...draft, label: e.target.value, id: draft.id || slugify(e.target.value)})}
                placeholder="예: 자유 / 질문 / 후기"/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="new-bd-id">ID (slug)</label>
              <input id="new-bd-id" className="field-input"
                value={draft.id}
                onChange={(e) => setDraft({...draft, id: slugify(e.target.value)})}
                placeholder="자동 생성"/>
            </div>
          </div>
          <div className="field" style={{marginBottom:12}}>
            <label className="field-label" htmlFor="new-bd-desc">설명</label>
            <textarea id="new-bd-desc" className="field-input" rows={2}
              value={draft.desc}
              onChange={(e) => setDraft({...draft, desc: e.target.value})}
              placeholder="게시판 상단 안내 문구 (선택)"
              style={{fontFamily:'inherit', resize:'vertical', lineHeight:1.6}}/>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button type="button" className="btn btn-gold" onClick={addBoard} disabled={saving || !draft.label.trim()}>
              {saving ? '추가 중…' : '＋ 추가'}
            </button>
            <button type="button" className="btn btn-small" onClick={() => { setAdding(false); setDraft({id:'',label:'',desc:''}); }}>
              취소
            </button>
          </div>
        </article>
      )}

      {boards.length === 0 ? (
        <AdminEmpty>등록된 커뮤니티 게시판이 없습니다. 위에서 추가하세요.</AdminEmpty>
      ) : (
        <div style={{border:'1px solid var(--line)', overflow:'hidden'}}>
          {/* 테이블 헤더 */}
          <div className="mono dim-2" style={{
            display:'grid',
            gridTemplateColumns:'40px 130px 1fr 80px 80px 80px',
            gap:0, alignItems:'center', padding:'10px 14px',
            background:'var(--bg-2)', borderBottom:'1px solid var(--line)',
            fontSize:10, letterSpacing:'0.18em', fontWeight:700,
          }}>
            <span></span>
            <span>ID</span>
            <span>이름 / 설명</span>
            <span style={{textAlign:'center'}}>글 수</span>
            <span style={{textAlign:'center'}}>권한</span>
            <span style={{textAlign:'right'}}>액션</span>
          </div>
          {boards.map((b, idx) => {
            const isNotice = b.id === 'notice';
            const v = valueOf(b);
            const isEdited = !!edits[b.id];
            const isExpanded = expanded === b.id;
            const isDragging = draggingId === b.id;
            const isDragOver = dragOverId === b.id && draggingId !== b.id;
            const postCount = ((window.BGNJ_COMMUNITY?.listPosts?.() || []).filter((p) => p.categoryId === b.id)).length;
            return (
              <div key={b.id}
                draggable={!isNotice}
                onDragStart={(e) => {
                  if (isNotice) { e.preventDefault(); return; }
                  setDraggingId(b.id);
                  try { e.dataTransfer.effectAllowed = 'move'; } catch (_e) { console.warn('[bgnj] AdminCommunityConfigPanels.jsx:690 오류(무시하고 진행)', _e); }
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOverId(b.id); }}
                onDragLeave={() => setDragOverId((cur) => cur === b.id ? null : cur)}
                onDrop={(e) => { e.preventDefault(); onDrop(b.id); }}
                onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
                style={{
                  borderBottom: idx < boards.length - 1 ? '1px solid var(--line)' : 'none',
                  background: isExpanded ? 'rgba(245,213,72,0.04)' : (isDragOver ? 'rgba(245,213,72,0.10)' : (isEdited ? 'rgba(245,213,72,0.02)' : 'var(--bg)')),
                  opacity: isDragging ? 0.5 : 1,
                  borderTop: isDragOver ? '2px solid var(--primary)' : undefined,
                  transition:'background .12s',
                }}>
                {/* 메인 행 */}
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'40px 130px 1fr 80px 80px 80px',
                  gap:0, alignItems:'center', padding:'12px 14px',
                }}>
                  {/* DnD 핸들 */}
                  <span title={isNotice ? '공지는 순서 고정' : '드래그하여 순서 변경'}
                    style={{
                      cursor: isNotice ? 'not-allowed' : 'grab',
                      color:'var(--ink-3)', fontSize:18, lineHeight:1,
                      userSelect:'none', textAlign:'center',
                      opacity: isNotice ? 0.3 : 1,
                    }}>≡</span>
                  {/* ID */}
                  <span className="mono dim-2" style={{fontSize:11, letterSpacing:'0.06em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                    {b.id}
                    {isEdited && <span className="gold" style={{marginLeft:4}}>●</span>}
                  </span>
                  {/* 이름 (편집) — 클릭으로 expand 토글하지 않게 input stopPropagation */}
                  <div style={{minWidth:0}}>
                    <input type="text"
                      value={v.label}
                      onChange={(e) => update(b.id, 'label', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width:'100%', padding:'4px 8px', fontSize:13,
                        background:'transparent', border:'1px solid transparent',
                        color:'var(--ink)', fontFamily:'inherit', fontWeight:600,
                      }}
                      onFocus={(e) => e.target.style.border = '1px solid var(--line-2)'}
                      onBlur={(e) => e.target.style.border = '1px solid transparent'}/>
                    {/* 설명 미리보기 (한 줄, expanded 아닐 때만) */}
                    {!isExpanded && v.desc && (
                      <div className="dim-2" style={{
                        fontSize:11, padding:'0 8px', marginTop:2,
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                      }}>{v.desc}</div>
                    )}
                  </div>
                  {/* 글 수 */}
                  <span className="mono" style={{textAlign:'center', fontSize:11, color:'var(--ink-2)'}}>
                    {postCount}
                  </span>
                  {/* 권한 요약 */}
                  <span className="mono" style={{textAlign:'center', fontSize:10, letterSpacing:'0.06em', color:'var(--ink-3)'}}>
                    {isNotice ? '관리자' : `Lv${v.minLevel}/${v.postMinLevel}`}
                  </span>
                  {/* 액션 */}
                  <div style={{display:'flex', gap:4, justifyContent:'flex-end'}}>
                    <button type="button"
                      onClick={() => setExpanded(isExpanded ? null : b.id)}
                      style={{
                        padding:'4px 10px', fontSize:11, fontFamily:'var(--font-mono)',
                        background: isExpanded ? 'rgba(245,213,72,0.14)' : 'var(--bg-2)',
                        border:'1px solid var(--line-2)', cursor:'pointer',
                        color: isExpanded ? 'var(--ink)' : 'var(--ink-2)',
                      }}>{isExpanded ? '닫기' : '편집'}</button>
                    {!isNotice && (
                      <button type="button"
                        onClick={() => removeBoard(b.id)}
                        disabled={saving}
                        title="삭제"
                        style={{
                          padding:'4px 8px', fontSize:11, fontFamily:'var(--font-mono)',
                          background:'var(--bg-2)', border:'1px solid var(--line-2)',
                          color:'var(--danger)', cursor:'pointer',
                        }}>🗑</button>
                    )}
                  </div>
                </div>
                {/* expanded — 권한·설명·등급 편집 */}
                {isExpanded && (
                  <div style={{padding:'14px 18px 18px', background:'var(--bg-2)', borderTop:'1px solid var(--line)'}}>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
                      {/* 설명 */}
                      <div className="field" style={{margin:0, gridColumn:'1 / -1'}}>
                        <label className="field-label" style={{fontSize:11}}>설명 (게시판 상단 안내 문구)</label>
                        <textarea
                          className="field-input"
                          rows={2}
                          value={v.desc}
                          onChange={(e) => update(b.id, 'desc', e.target.value)}
                          placeholder="비워두면 미표시"
                          style={{fontFamily:'inherit', resize:'vertical', fontSize:13}}/>
                      </div>
                      {/* 최소 등급 */}
                      <div className="field" style={{margin:0}}>
                        <label className="field-label" style={{fontSize:11}}>읽기 최소 등급 (level)</label>
                        <select
                          className="field-input"
                          value={v.minLevel}
                          onChange={(e) => update(b.id, 'minLevel', e.target.value)}>
                          {grades.map((g) => (
                            <option key={g.id} value={g.level}>Lv {g.level} · {g.label}</option>
                          ))}
                        </select>
                      </div>
                      {/* 작성 최소 등급 */}
                      <div className="field" style={{margin:0}}>
                        <label className="field-label" style={{fontSize:11}}>작성 최소 등급 (level)</label>
                        <select
                          className="field-input"
                          value={v.postMinLevel}
                          onChange={(e) => update(b.id, 'postMinLevel', e.target.value)}>
                          {grades.map((g) => (
                            <option key={g.id} value={g.level}>Lv {g.level} · {g.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* 권한 4종 체크박스 */}
                    <fieldset style={{border:'1px solid var(--line)', padding:'10px 14px'}}>
                      <legend className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', padding:'0 6px'}}>권한 (4종)</legend>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'6px 18px', fontSize:13}}>
                        {[
                          ['allowRead', '글 읽기 허용'],
                          ['allowWrite', '글 작성 허용'],
                          ['allowCommentRead', '댓글 읽기 허용'],
                          ['allowCommentWrite', '댓글 작성 허용'],
                        ].map(([key, label]) => (
                          <label key={key} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                            <input type="checkbox"
                              checked={!!v[key]}
                              disabled={isNotice}
                              onChange={(e) => update(b.id, key, e.target.checked)}/>
                            <span style={{color: isNotice ? 'var(--ink-3)' : 'var(--ink)'}}>{label}</span>
                          </label>
                        ))}
                      </div>
                      {isNotice && (
                        <p className="dim-2" style={{fontSize:10, marginTop:8, lineHeight:1.5}}>
                          공지(notice) 는 강제 관리자 전용 — 권한 체크박스 무시.
                        </p>
                      )}
                    </fieldset>
                    {/* 행 액션 */}
                    {isEdited && (
                      <div style={{display:'flex', gap:8, marginTop:12, justifyContent:'flex-end'}}>
                        <button type="button" className="btn btn-small btn-gold"
                          onClick={() => commitRow(b.id)} disabled={saving}>
                          💾 이 게시판만 저장
                        </button>
                        <button type="button" className="btn btn-small"
                          onClick={() => setEdits((cur) => { const next = { ...cur }; delete next[b.id]; return next; })}>
                          되돌리기
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AdminSaveBar
        message={saveMsg || null}
        messageVariant={saveMsg.startsWith('✗') ? 'danger' : (saveMsg.startsWith('⚠') ? 'warning' : 'success')}>
        <button type="button" className="btn btn-gold" onClick={commitAll} disabled={saving || !dirty}>
          {saving ? '저장 중…' : (dirty ? '💾 저장' : '저장됨 ✓')}
        </button>
      </AdminSaveBar>
      <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.7}}>
        ⓘ <strong>공지(notice)</strong> 게시판은 admin 전용 강제 규칙 — 삭제 불가. 추가/삭제는 즉시 서버에 반영됩니다. 제목/설명 편집은 [💾 저장] 버튼 클릭 시 commit.
      </p>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────

export { AdminCategoryPanel, CommunityBoardsPanel, PrefixTagsPanel };

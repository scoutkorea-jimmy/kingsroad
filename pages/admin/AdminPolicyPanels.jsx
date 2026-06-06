// 뱅기노자 — 정책/FAQ 관리 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// LegalAdminPanel (이용약관/개인정보 처리방침 본문 편집) · FaqAdminPanel (자주 묻는 질문).
// 자기완결적 — 의존은 모두 window 전역(BGNJ_LEGAL/FMT/FAQ/CONFIRM, TiptapEditor).
// entry-admin 에서 AuthAdminPage 앞에 로드. 각 패널 window 노출.

// === Legal Documents Admin Panel (Privacy / Terms) ================
const LegalAdminPanel = () => {
  const [slug, setSlug] = React.useState('terms');
  const [tick, setTick] = React.useState(0);
  const [doc, setDoc] = React.useState({ title: '', body: '', updatedAt: null });
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [editorKey, setEditorKey] = React.useState(0);
  const [msg, setMsg] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  // 슬러그 전환 시 서버에서 최신 본문 fetch.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const fresh = await window.BGNJ_LEGAL.refresh(slug);
      if (cancelled) return;
      const d = fresh || { title: '', body: '' };
      setDoc(d);
      setTitle(d.title || (slug === 'terms' ? '이용약관' : slug === 'privacy' ? '개인정보 처리방침' : ''));
      setBody(d.body || '');
      setEditorKey((k) => k + 1);
      setMsg('');
    })();
    return () => { cancelled = true; };
  }, [slug, tick]);

  const save = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setMsg('⚠ 제목을 입력해 주세요.'); return; }
    setSaving(true);
    try {
      await window.BGNJ_LEGAL.save(slug, { title: title.trim(), body });
      setMsg('✓ 저장되었습니다. 사이트 푸터의 ' + (slug === 'terms' ? '이용약관' : '개인정보 처리방침') + ' 링크에 즉시 반영됩니다.');
      setTick((v) => v + 1);
      setTimeout(() => setMsg(''), 2400);
    } catch (err) {
      setMsg('✗ 저장 실패: ' + (err?.body?.error || err?.message || '알 수 없는 오류'));
    } finally {
      setSaving(false);
    }
  };

  const SLUG_LABEL = { terms: '이용약관', privacy: '개인정보 처리방침' };
  const SLUG_HINT = {
    terms: '회원가입 시 동의 체크박스 옆 "이용약관" 클릭 시 + 푸터 메뉴에서 노출됩니다.',
    privacy: '회원가입 시 "개인정보 처리방침" 클릭 시 + 푸터 메뉴에서 노출됩니다.',
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        <strong className="gold">이용약관</strong>·<strong className="gold">개인정보 처리방침</strong> 본문을 직접 편집합니다. 저장 즉시 회원가입 모달과 푸터 페이지에 반영됩니다.
      </p>

      <div role="tablist" aria-label="문서 분류" style={{display:'flex', gap:0, marginBottom:18, borderBottom:'1px solid var(--line)'}}>
        {window.BGNJ_LEGAL.listSlugs().map((s) => (
          <button key={s} type="button" role="tab" aria-selected={slug === s}
            onClick={() => setSlug(s)}
            style={{
              padding:'12px 22px', fontSize:14, letterSpacing:'0.05em',
              color: slug === s ? 'var(--primary)' : 'var(--ink-2)',
              borderBottom: slug === s ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom:-1, background:'none',
            }}>
            {SLUG_LABEL[s] || s}
          </button>
        ))}
      </div>

      <p className="dim-2" style={{fontSize:12, marginBottom:14, lineHeight:1.7, padding:'10px 12px', background:'var(--bg-2)', borderLeft:'3px solid var(--primary-dim)'}}>
        ⓘ {SLUG_HINT[slug] || ''}
      </p>

      <form onSubmit={save} className="card" style={{padding:20}}>
        <div className="field">
          <label className="field-label" htmlFor="legal-title">문서 제목</label>
          <input id="legal-title" className="field-input" value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={SLUG_LABEL[slug] || ''}/>
        </div>
        <div className="field">
          <label className="field-label">본문</label>
          <TiptapEditor key={editorKey} preset="column"
            content={doc.body || ''}
            onUpdate={(html) => setBody(html)}
            placeholder="문서 본문을 입력합니다. 이미지·링크·인용·목록을 지원합니다."/>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, gap:12, flexWrap:'wrap'}}>
          {doc.updatedAt ? (
            <div className="dim-2 mono" style={{fontSize:11}}>최근 수정 · {window.BGNJ_FMT.kstDateTime(doc.updatedAt)}</div>
          ) : (
            <div className="dim-2 mono" style={{fontSize:11}}>저장 이력 없음 — 처음 저장하시면 회원가입 모달과 푸터에 노출됩니다.</div>
          )}
        </div>
        {msg && (
          <div role="status" style={{
            fontSize:13, marginBottom:14, padding:'10px 14px',
            border: msg.startsWith('✗') || msg.startsWith('⚠') ? '1px solid var(--danger)' : '1px solid var(--primary-dim)',
            background: msg.startsWith('✗') || msg.startsWith('⚠') ? 'rgba(194,74,61,0.06)' : 'rgba(245,213,72,0.06)',
            color: msg.startsWith('✗') || msg.startsWith('⚠') ? 'var(--danger)' : 'var(--primary)',
          }}>{msg}</div>
        )}
        <div style={{display:'flex', gap:8, justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14}}>
          <button type="submit" className="btn btn-gold" disabled={saving} aria-busy={saving}>
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
};

// === FAQ Admin Panel ==============================================
const FaqAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [draft, setDraft] = React.useState({ question:'', answer:'', category:'일반' });
  const [error, setError] = React.useState('');
  const refresh = () => setTick((v) => v + 1);
  const faqs = React.useMemo(() => window.BGNJ_FAQ.listAll(), [tick]);

  const add = (e) => {
    e.preventDefault();
    setError('');
    const next = window.BGNJ_FAQ.add(draft);
    if (!next) { setError('질문과 답변은 필수입니다.'); return; }
    setDraft({ question:'', answer:'', category: draft.category || '일반' });
    refresh();
  };

  const update = (id, patch) => { window.BGNJ_FAQ.update(id, patch); refresh(); };
  const move = (id, dir) => { window.BGNJ_FAQ.reorder(id, dir); refresh(); };
  const remove = async (id) => {
    if (!(await window.BGNJ_CONFIRM('이 FAQ를 삭제하시겠어요?', { danger: true }))) return;
    window.BGNJ_FAQ.remove(id);
    refresh();
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        자주 묻는 질문(FAQ)을 추가·수정·정렬합니다. 푸터의 <strong className="gold">자주 묻는 질문</strong>에 카테고리별로 묶여 노출됩니다.
      </p>

      <article className="card" style={{padding:18, marginBottom:20}}>
        <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>NEW FAQ</div>
        <form onSubmit={add} style={{display:'grid', gap:10}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 200px', gap:10}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label">질문 <span className="gold" aria-hidden="true">*</span></label>
              <input className="field-input" value={draft.question}
                onChange={(e) => setDraft({ ...draft, question: e.target.value })}/>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label">카테고리</label>
              <input className="field-input" value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                placeholder="계정 / 결제 / 강연 / 답사 ..."/>
            </div>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label">답변 <span className="gold" aria-hidden="true">*</span></label>
            <textarea className="field-input" rows={3} value={draft.answer}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}/>
          </div>
          {error && <div role="alert" className="mono" style={{color:'var(--danger)', fontSize:11}}>{error}</div>}
          <div style={{display:'flex', justifyContent:'flex-end'}}>
            <button type="submit" className="btn btn-gold btn-small">＋ FAQ 추가</button>
          </div>
        </form>
      </article>

      {faqs.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>등록된 FAQ가 없습니다.</div>
      ) : (
        <div style={{display:'grid', gap:10}}>
          {faqs.map((f, i) => (
            <article key={f.id} className="card" style={{padding:16}}>
              <div style={{display:'flex', justifyContent:'space-between', gap:10, alignItems:'baseline', flexWrap:'wrap', marginBottom:8}}>
                <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em'}}>#{String(i+1).padStart(2,'0')} · {f.category || '일반'}</span>
                <div style={{display:'flex', gap:4, alignItems:'center'}}>
                  <button type="button" className="btn btn-small" onClick={() => move(f.id, -1)} disabled={i === 0}
                    style={{padding:'2px 6px', minHeight:0, fontSize:11}} aria-label="위로">▲</button>
                  <button type="button" className="btn btn-small" onClick={() => move(f.id, 1)} disabled={i === faqs.length - 1}
                    style={{padding:'2px 6px', minHeight:0, fontSize:11}} aria-label="아래로">▼</button>
                  <button type="button" className="btn btn-small" onClick={() => remove(f.id)}
                    style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:6}}>삭제</button>
                </div>
              </div>
              <div className="field" style={{marginBottom:8}}>
                <input className="field-input" value={f.question}
                  onChange={(e) => update(f.id, { question: e.target.value })} placeholder="질문"/>
              </div>
              <div className="field" style={{margin:0}}>
                <textarea className="field-input" rows={2} value={f.answer}
                  onChange={(e) => update(f.id, { answer: e.target.value })} placeholder="답변"/>
              </div>
              <div className="field" style={{margin:'8px 0 0', maxWidth:240}}>
                <input className="field-input" value={f.category || ''}
                  onChange={(e) => update(f.id, { category: e.target.value })} placeholder="카테고리"/>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────

// v00.286 ESM — 모듈 export (window 노출과 병행, 점진 전환).
export { FaqAdminPanel, LegalAdminPanel };

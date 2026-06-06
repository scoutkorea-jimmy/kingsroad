// 뱅기노자 — 책 콘텐츠 관리 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// BooksAdminPanel — 메타/표지/PDF 미리보기/소개/목차/저자/리뷰.
// 자기완결적 — 의존은 모두 window 전역(BGNJ_BOOKS/API/CONFIRM/TOAST/FMT 등).
// entry-admin 에서 AuthAdminPage 앞에 로드. BooksAdminPanel 만 window 노출.

// === Books Admin Panel ============================================
// 다양한 책 콘텐츠 관리 — 메타/표지/PDF 미리보기/소개/목차/저자/리뷰.
const BooksAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  // v00.193 — 새 책 추가 prompt 제거. 사용자 보고 '그냥 새 책 만들어주고 저장 누르면 반영'.
  // newDraft 가 있으면 books 목록 맨 위에 표시 (id='__new__'), 선택 시 editing 으로 ed전. commit 시 BGNJ_BOOKS.create.
  const [newDraft, setNewDraft] = React.useState(null);
  const realBooks = React.useMemo(() => window.BGNJ_BOOKS.list(), [tick]);
  const books = React.useMemo(
    () => newDraft ? [newDraft, ...realBooks.filter((b) => b.id !== '__new__')] : realBooks,
    [realBooks, newDraft]
  );
  const [selectedId, setSelectedId] = React.useState(realBooks[0]?.id || null);
  const selected = React.useMemo(() => {
    if (selectedId === '__new__' && newDraft) return newDraft;
    return window.BGNJ_BOOKS.get(selectedId);
  }, [selectedId, tick, newDraft]);
  const [editTab, setEditTab] = React.useState('meta');
  const [msg, setMsg] = React.useState('');
  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2000); };
  const refresh = () => setTick((v) => v + 1);
  // v00.148 — 🚨 HOTFIX 책 데이터 안 보임 root cause:
  // boot.jsx 가 BGNJ_BOOKS.refresh() 를 admin:false 로 호출 (published 만 fetch).
  // 그 결과 draft / coming_soon 책은 admin 뷰에서 안 보임 → 사용자 '책 데이터가 모두 날아갔는데?'.
  // 이 패널 마운트 시 admin:true 로 강제 재fetch + 첫 책 자동 선택.
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await window.BGNJ_BOOKS.refresh({ admin: true });
      } catch {}
      if (!cancelled) {
        setLoading(false);
        setTick((v) => v + 1);
        const fresh = window.BGNJ_BOOKS.list();
        if (!selectedId && fresh.length > 0) setSelectedId(fresh[0].id);
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // v00.147 — 자동 저장 → 명시적 저장 버튼. 한글 IME 문제 + 사용자 요청 '저장 버튼 누르면 저장 반영'.
  // 모든 텍스트 입력은 local state(editing) 에만 반영, [💾 저장] 클릭 시 일괄 PATCH.
  const [editing, setEditing] = React.useState(null);    // 책 객체 카피
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [uploadingCover, setUploadingCover] = React.useState(false);
  const [uploadingPdf, setUploadingPdf] = React.useState(false);

  // selected 가 바뀌면 editing 을 새 책으로 동기화 (단, dirty 미저장 변경 있으면 confirm).
  React.useEffect(() => {
    if (!selected) { setEditing(null); setDirty(false); return; }
    if (dirty && editing && editing.id !== selected.id) {
      // useEffect 콜백 내 async — IIFE 패턴 사용
      (async () => {
        const ok = await window.BGNJ_CONFIRM('저장하지 않은 변경 사항이 있습니다. 그래도 다른 책으로 이동할까요?', { danger: true });
        if (!ok) {
          if (editing.id) setSelectedId(editing.id);
          return;
        }
        setEditing({ ...selected });
        setDirty(false);
      })();
      return;
    }
    setEditing({ ...selected });
    setDirty(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, tick]);

  const setField = (key, val) => {
    setEditing((cur) => cur ? { ...cur, [key]: val } : cur);
    setDirty(true);
  };
  // 즉시 저장 (cover/pdf 업로드 + primary toggle 등 즉시 반영해야 하는 액션) — local 도 같이 동기화.
  const patchImmediate = (changes) => {
    if (!selectedId) return;
    window.BGNJ_BOOKS.update(selectedId, changes);
    setEditing((cur) => cur ? { ...cur, ...changes } : cur);
    refresh();
  };
  const commit = async () => {
    if (!editing || saving) return;
    // v00.193 — 새 draft 는 dirty 무관 commit 허용 (사용자가 제목만 입력하고 바로 저장 가능).
    if (!editing._isNew && !dirty) return;
    setSaving(true);
    try {
      // v00.193 — 새 draft 면 BGNJ_BOOKS.create 호출. 그 외엔 update.
      if (editing._isNew) {
        if (!editing.title?.trim()) {
          flash('✗ 제목은 필수입니다.');
          setSaving(false);
          return;
        }
        const { _isNew, id: _droppedId, ...payload } = editing;
        const created = await window.BGNJ_BOOKS.create(payload);
        if (!created?.id) throw new Error('서버 응답에 id 없음');
        try { window.BGNJ_BROADCAST?.publish?.('books'); } catch {}
        setNewDraft(null);
        setSelectedId(created.id);
        setDirty(false);
        flash('✓ 새 책 저장 완료');
        refresh();
        return;
      }
      // 기존 책 — 변경된 필드만 추려 patch.
      const changes = {};
      Object.keys(editing).forEach((k) => {
        if (selected && JSON.stringify(editing[k]) !== JSON.stringify(selected[k])) {
          changes[k] = editing[k];
        }
      });
      if (Object.keys(changes).length === 0) { setDirty(false); flash('변경 없음'); return; }
      await window.BGNJ_BOOKS.update(selectedId, changes);
      try { window.BGNJ_BROADCAST?.publish?.('books'); } catch {}
      setDirty(false);
      flash(`✓ 저장 완료 (${Object.keys(changes).length}개 필드)`);
      refresh();
    } catch (err) {
      flash('✗ 저장 실패: ' + (err?.message || '알 수 없는 오류'));
    } finally { setSaving(false); }
  };

  // v00.193 — 새 책 draft 취소.
  const cancelDraft = async () => {
    if (dirty && !(await window.BGNJ_CONFIRM('작성 중인 새 책을 취소할까요?', { danger: true }))) return;
    setNewDraft(null);
    setDirty(false);
    const fallback = realBooks[0]?.id || null;
    setSelectedId(fallback);
  };

  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    if (!file) { resolve(''); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // v00.193 — 사용자 보고 '새 책 prompt 제거 + 임시 draft 생성 → 저장 시 D1 반영'.
  // 이전엔 prompt 로 제목 받고 즉시 D1 create. 이제는 클라이언트에 _newDraft 만 만들고 D1 안 함.
  // 사용자가 우측 form 에서 편집 후 [💾 저장] 누르면 commit() 분기에서 BGNJ_BOOKS.create 호출.
  const addBook = () => {
    if (newDraft) {
      // 이미 진행 중인 임시 draft 가 있으면 selected 만 다시.
      setSelectedId('__new__');
      setEditTab('meta');
      return;
    }
    setNewDraft({
      id: '__new__',
      title: '', subtitle: '', author: '뱅기노자', publisher: '',
      pages: 0, isbn: '', priceKR: 0, priceEN: 0,
      desc: '', intro: '', authorBio: '',
      status: 'draft', publishedAt: '',
      coverDataUri: '', pdfPreviewDataUri: '',
      chapters: [], reviews: [],
      _isNew: true,
    });
    setSelectedId('__new__');
    setEditTab('meta');
  };

  const removeBook = async (id) => {
    const target = window.BGNJ_BOOKS.get(id);
    if (!target) return;
    if (!(await window.BGNJ_CONFIRM(`"${target.title}" 책을 삭제할까요? (되돌릴 수 없음)`, { danger: true }))) return;
    try {
      await window.BGNJ_BOOKS.remove(id);
      try { window.BGNJ_BROADCAST?.publish?.('books'); } catch {}
      refresh();
      if (selectedId === id) {
        const remaining = window.BGNJ_BOOKS.list();
        setSelectedId(remaining[0]?.id || null);
      }
    } catch (err) {
      window.BGNJ_TOAST.error('책 삭제 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  const patch = (changes) => {
    if (!selectedId) return;
    window.BGNJ_BOOKS.update(selectedId, changes);
    refresh();
  };

  // v00.084 — R2 우선 (5MB 표지 / 20MB PDF) + dataURI 폴백 (1.5MB / 3MB). v00.147 busy state + 즉시 patch.
  // v00.185 — pickImageWithR2Fallback 헬퍼로 통합. 25 lines × 2 → 8 lines × 2.
  const onUploadCover = async (e) => {
    setUploadingCover(true);
    flash('표지 업로드 중…');
    try {
      const result = await pickImageWithR2Fallback(e, { folder: 'book-covers' });
      if (result) { patchImmediate({ coverDataUri: result }); flash('✓ 표지 업로드 완료'); }
    } finally { setUploadingCover(false); }
  };

  const onUploadPdf = async (e) => {
    setUploadingPdf(true);
    flash('PDF 업로드 중…');
    try {
      const result = await pickImageWithR2Fallback(e, { folder: 'book-pdfs', maxBytes: 20 * 1024 * 1024, fallbackMaxBytes: 3 * 1024 * 1024 });
      if (result) { patchImmediate({ pdfPreviewDataUri: result }); flash('✓ PDF 미리보기 업로드 완료'); }
    } finally { setUploadingPdf(false); }
  };

  const tabs = [
    { id: 'meta', label: '메타·가격' },
    { id: 'media', label: '표지 · PDF' },
    { id: 'intro', label: '소개' },
    { id: 'toc', label: '목차' },
    { id: 'author', label: '저자' },
    { id: 'reviews', label: `리뷰 ${(selected?.reviews || []).length || ''}`.trim() },
  ];

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        뱅기노자가 출간한 책들을 관리합니다. 각 책은 표지(PNG)와 본문 미리보기(PDF)를 가질 수 있고,
        소개·목차·저자·리뷰 콘텐츠를 독립적으로 편집합니다.
      </p>
      {loading && (
        <div role="status" style={{fontSize:13, marginBottom:14, padding:'10px 14px', border:'1px solid var(--line)', background:'var(--bg-2)'}}>
          ⏳ 서버에서 책 목록을 불러오는 중…
        </div>
      )}
      {!loading && books.length === 0 && (
        <div role="status" style={{fontSize:13, marginBottom:14, padding:'10px 14px', border:'1px solid var(--primary-dim)', background:'rgba(245,213,72,0.06)', color:'var(--ink)'}}>
          ⓘ 등록된 책이 없습니다. 우측 상단 [＋ 새 책] 으로 추가하거나, 아래 [다시 불러오기] 로 새로고침하세요.
        </div>
      )}
      {msg && (
        <div role="status" className="mono gold" style={{fontSize:12, marginBottom:14, padding:'8px 12px', border:'1px solid var(--primary-dim)', background:'rgba(59,130,246,0.06)'}}>
          {msg}
        </div>
      )}
      <div style={{marginBottom:12}}>
        <button type="button" className="btn btn-small" onClick={async () => {
          setLoading(true);
          try { await window.BGNJ_BOOKS.refresh({ admin: true }); } catch {}
          setLoading(false);
          refresh();
          flash('✓ 다시 불러오기 완료 — ' + window.BGNJ_BOOKS.list().length + '권');
        }}>🔄 다시 불러오기</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:20, alignItems:'start'}}>
        {/* 좌측: 책 목록 */}
        <aside aria-label="책 목록" style={{border:'1px solid var(--line)'}}>
          <div style={{padding:'10px 14px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em'}}>BOOKS · {books.length}</span>
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {books.length === 0 && (
                <button type="button" className="btn btn-small" onClick={async () => {
                  if (!(await window.BGNJ_CONFIRM('샘플 책 2권을 추가합니다. 진행할까요?', { danger: true }))) return;
                  const samples = [
                    { title: '왕의 길 — 조선 왕실의 일상', subtitle: '경복궁의 사계와 의례', author: '뱅기노자', publisher: '뱅기노자 출판부', priceKR: 18000, status: 'published', desc: '조선 왕실의 일상과 의례를 따라 걷는 인문학 산책.' },
                    { title: '문(門)을 읽다', subtitle: '궁궐 문에 새겨진 인문학', author: '뱅기노자', publisher: '뱅기노자 출판부', priceKR: 22000, status: 'published', desc: '광화문에서 신무문까지, 문에 담긴 의미를 해독합니다.' },
                  ];
                  for (const s of samples) await window.BGNJ_BOOKS.create(s);
                  refresh();
                }}>샘플 데이터 추가</button>
              )}
              <button type="button" className="btn btn-small btn-gold" onClick={addBook} disabled={!!newDraft}
                title={newDraft ? '작성 중인 새 책이 있습니다 — 우측에서 저장하거나 취소' : ''}
                style={newDraft ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}>
                {newDraft ? '＋ 새 책 (작성 중)' : '＋ 새 책'}
              </button>
            </div>
          </div>
          {/* v00.131 — 인라인 mini-form 제거 (addBook 이 즉시 생성 + 편집 패널 오픈). */}
          {books.length === 0 ? (
            <div className="dim" style={{padding:20, fontSize:13}}>등록된 책이 없습니다.</div>
          ) : (
            <ul role="list" style={{listStyle:'none', margin:0, padding:0}}>
              {books.map((b, i) => {
                const isDraft = b._isNew || b.id === '__new__';
                // v00.193 — 새 책 draft 는 ▲▼ 정렬 대상 아님. realBooks 인덱스로 정렬 비활성 판단.
                const realIdx = isDraft ? -1 : realBooks.findIndex((x) => x.id === b.id);
                return (
                <li key={b.id} style={{
                  borderBottom:'1px solid var(--line)',
                  display:'flex', alignItems:'stretch',
                  background: isDraft ? 'rgba(245,213,72,0.06)' : 'transparent',
                  borderLeft: isDraft ? '3px solid var(--primary)' : '3px solid transparent',
                }}>
                  <button type="button"
                    onClick={() => { setSelectedId(b.id); setEditTab('meta'); }}
                    aria-current={selectedId === b.id ? 'true' : undefined}
                    style={{
                      flex:1, textAlign:'left', padding:'12px 8px 12px 14px',
                      background: selectedId === b.id ? 'rgba(59,130,246,0.06)' : 'transparent',
                      border:'none', cursor:'pointer', display:'flex', gap:10, alignItems:'center',
                    }}>
                    <span style={{
                      width:32, height:42, flexShrink:0,
                      border:'1px solid var(--line)', background:'var(--bg-2)',
                      display:'grid', placeItems:'center', overflow:'hidden',
                    }}>
                      {b.coverDataUri
                        ? <img src={b.coverDataUri} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                        : <span className="dim-2 mono" style={{fontSize:8}}>NO COVER</span>}
                    </span>
                    <span style={{flex:1, minWidth:0}}>
                      <span className="ko-serif" style={{fontSize:13, color:'var(--ink)', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                        {isDraft ? (b.title?.trim() || '(제목 없음)') : b.title}
                      </span>
                      <span className="mono dim-2" style={{fontSize:9, letterSpacing:'0.12em', color: isDraft ? 'var(--primary)' : undefined}}>
                        {isDraft
                          ? '● 새 책 (미저장)'
                          : (b.status === 'published' ? '출간' : b.status === 'coming_soon' ? '출간 예정' : '초안')}
                        {!isDraft && b.primary ? ' · 대표' : ''}
                      </span>
                    </span>
                  </button>
                  {/* v00.171 — 책 순서 변경. v00.193 — bordered 그룹으로 시각적 misalign 해결 + draft 는 정렬 비활성. */}
                  <div style={{
                    display:'flex', flexDirection:'column',
                    margin:'8px 6px', alignSelf:'center',
                    border:'1px solid var(--line)',
                    borderRadius:3, overflow:'hidden',
                    visibility: isDraft ? 'hidden' : 'visible',
                  }}>
                    <button type="button" aria-label={`${b.title} 위로`} title="위로 이동"
                      disabled={isDraft || realIdx <= 0}
                      onClick={async () => {
                        const ids = realBooks.map((x) => x.id);
                        [ids[realIdx-1], ids[realIdx]] = [ids[realIdx], ids[realIdx-1]];
                        try { await window.BGNJ_BOOKS.reorder(ids); refresh(); } catch (err) { window.BGNJ_TOAST.error('순서 변경 실패: ' + (err?.message || '')); }
                      }}
                      style={{
                        background:'transparent', border:'none', borderBottom:'1px solid var(--line)',
                        padding:'3px 8px', fontSize:10, lineHeight:1,
                        cursor: realIdx <= 0 ? 'not-allowed' : 'pointer',
                        opacity: realIdx <= 0 ? 0.3 : 1,
                      }}>▲</button>
                    <button type="button" aria-label={`${b.title} 아래로`} title="아래로 이동"
                      disabled={isDraft || realIdx < 0 || realIdx >= realBooks.length - 1}
                      onClick={async () => {
                        const ids = realBooks.map((x) => x.id);
                        [ids[realIdx], ids[realIdx+1]] = [ids[realIdx+1], ids[realIdx]];
                        try { await window.BGNJ_BOOKS.reorder(ids); refresh(); } catch (err) { window.BGNJ_TOAST.error('순서 변경 실패: ' + (err?.message || '')); }
                      }}
                      style={{
                        background:'transparent', border:'none',
                        padding:'3px 8px', fontSize:10, lineHeight:1,
                        cursor: (realIdx < 0 || realIdx >= realBooks.length - 1) ? 'not-allowed' : 'pointer',
                        opacity: (realIdx < 0 || realIdx >= realBooks.length - 1) ? 0.3 : 1,
                      }}>▼</button>
                  </div>
                </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* 우측: 편집 폼 */}
        <section aria-label="책 편집">
          {!selected ? (
            <div className="card" style={{padding:24, textAlign:'center'}}>좌측에서 책을 선택하거나 새 책을 추가하세요.</div>
          ) : (
            <>
              <div style={{display:'flex', gap:6, borderBottom:'1px solid var(--line)', marginBottom:18}}>
                {tabs.map((t) => (
                  <button key={t.id} type="button"
                    onClick={() => setEditTab(t.id)}
                    style={{
                      padding:'10px 14px', fontSize:13,
                      color: editTab === t.id ? 'var(--primary)' : 'var(--ink-2)',
                      borderBottom: editTab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
                      marginBottom:-1, background:'none', border:'none', cursor:'pointer',
                      fontFamily:'var(--font-serif)',
                    }}>{t.label}</button>
                ))}
                <span style={{flex:1}}/>
                <button type="button" className="btn btn-small"
                  onClick={() => removeBook(selected.id)}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>책 삭제</button>
              </div>

              {editTab === 'meta' && editing && (
                <div className="card" style={{padding:20, display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14}}>
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">제목</label>
                    <input className="field-input" value={editing.title || ''} onChange={(e) => setField('title', e.target.value)}/>
                  </div>
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">부제</label>
                    <input className="field-input" value={editing.subtitle || ''} onChange={(e) => setField('subtitle', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label className="field-label">저자</label>
                    <input className="field-input" value={editing.author || ''} onChange={(e) => setField('author', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label className="field-label">출판사</label>
                    <input className="field-input" value={editing.publisher || ''} onChange={(e) => setField('publisher', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label className="field-label">페이지 수</label>
                    <input type="number" className="field-input" value={editing.pages ?? 0} onChange={(e) => setField('pages', Number(e.target.value))}/>
                  </div>
                  <div className="field">
                    <label className="field-label">ISBN</label>
                    <input className="field-input" value={editing.isbn || ''} onChange={(e) => setField('isbn', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label className="field-label">국문판 가격(원)</label>
                    <input type="number" className="field-input" value={editing.priceKR ?? 0} onChange={(e) => setField('priceKR', Number(e.target.value))}/>
                  </div>
                  <div className="field">
                    <label className="field-label">영문판 가격(원)</label>
                    <input type="number" className="field-input" value={editing.priceEN ?? 0} onChange={(e) => setField('priceEN', Number(e.target.value))}/>
                  </div>
                  <div className="field">
                    <label className="field-label">상태</label>
                    <select className="field-input" value={editing.status || 'draft'} onChange={(e) => setField('status', e.target.value)}>
                      <option value="published">출간</option>
                      <option value="coming_soon">출간 예정</option>
                      <option value="draft">초안 (비공개)</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">출간일</label>
                    <input type="date" className="field-input" value={editing.publishedAt || ''} onChange={(e) => setField('publishedAt', e.target.value)}/>
                  </div>
                  <div className="field" style={{gridColumn:'1 / -1', display:'flex', alignItems:'center', gap:10}}>
                    <input id="book-primary" type="checkbox" checked={!!editing.primary} onChange={(e) => setField('primary', e.target.checked)}/>
                    <label htmlFor="book-primary" className="field-label" style={{margin:0}}>대표 책 (홈 CTA에 노출되는 메인 책)</label>
                  </div>
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">짧은 설명 (카탈로그 카드용)</label>
                    <textarea className="field-input" rows={3} value={editing.desc || ''} onChange={(e) => setField('desc', e.target.value)}/>
                    <p className="dim-2" style={{fontSize:11, marginTop:6, lineHeight:1.5}}>
                      카탈로그/리스트 카드에 노출되는 짧은 한두 줄.
                    </p>
                  </div>
                  {/* v00.172 — 홈 CTA 전용 별도 소개글 필드. 사용자 보고 '메인에 책 소개 너무 비어있는데 별도 입력 필드'.
                       site_content_kv.bookHomeIntros[bookId] 에 저장 — 책 D1 schema 변경 없이 즉시 사용. */}
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">홈 CTA 본문 (메인 화면 노출 — 별도 필드)</label>
                    <textarea
                      className="field-input"
                      rows={6}
                      value={(() => {
                        const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
                        const map = sc.bookHomeIntros || {};
                        return editing._homeIntroDraft != null
                          ? editing._homeIntroDraft
                          : (map[editing.id] || map[String(editing.id)] || '');
                      })()}
                      onChange={(e) => setField('_homeIntroDraft', e.target.value)}
                      placeholder={"메인 화면 책 카루셀에 노출되는 본문.\n비워두면 '짧은 설명' 으로 자동 폴백됩니다.\n\n예) 조선 27명 왕의 생애를 '설계도'로 읽어낸 건축가의 시선."}
                      style={{fontFamily:'var(--font-serif)', fontSize:14, lineHeight:1.8, resize:'vertical'}}/>
                    <div style={{display:'flex', gap:8, marginTop:8, alignItems:'center', flexWrap:'wrap'}}>
                      <button type="button" className="btn btn-small btn-gold"
                        disabled={editing._homeIntroDraft == null}
                        onClick={async () => {
                          try {
                            const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
                            const next = { ...(sc.bookHomeIntros || {}) };
                            const txt = String(editing._homeIntroDraft || '');
                            if (txt.trim()) next[editing.id] = txt;
                            else delete next[editing.id];
                            await window.BGNJ_SITE_CONTENT.saveSection('bookHomeIntros', next);
                            setField('_homeIntroDraft', null);
                            flash('✓ 홈 소개글 저장됨 — 홈 화면 즉시 반영');
                          } catch (err) {
                            window.BGNJ_TOAST.error('홈 소개글 저장 실패: ' + (err?.message || ''));
                          }
                        }}>💾 홈 소개글만 즉시 저장</button>
                      {editing._homeIntroDraft != null && (
                        <span className="mono dim-2" style={{fontSize:11}}>● 미저장</span>
                      )}
                    </div>
                    <p className="dim-2" style={{fontSize:11, marginTop:6, lineHeight:1.5}}>
                      홈 책 카루셀에만 노출되는 본문. 짧은 설명(위)과 별개로 더 길게 쓸 수 있습니다.
                      비워두면 짧은 설명을 자동 사용. 줄바꿈 보존됨.
                    </p>
                  </div>
                  {/* v00.199 — 사용자 요청 '책 어떤 정보들을 노출할지 선택'.
                      site_content_kv.bookFieldVisibility[bookId] = { author, publisher, pages, isbn, priceKR, priceEN, subtitle }.
                      미설정 시 모두 노출 (기본 true). bookHomeIntros 와 동일 패턴. */}
                  <div className="field" style={{gridColumn:'1 / -1'}}>
                    <label className="field-label">책 정보 노출 선택 (책 상세 페이지)</label>
                    <p className="dim-2" style={{fontSize:11, marginBottom:10, lineHeight:1.5}}>
                      체크 해제한 항목은 사이트 책 상세 페이지에서 노출되지 않습니다. 데이터는 그대로 보존되며 표시 여부만 제어합니다.
                    </p>
                    {(() => {
                      const FIELDS = [
                        ['subtitle',  '부제'],
                        ['author',    '저자'],
                        ['publisher', '출판사'],
                        ['pages',     '페이지 수'],
                        ['isbn',      'ISBN'],
                        ['priceKR',   '국문판 가격'],
                        ['priceEN',   '영문판 가격'],
                      ];
                      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
                      const map = sc.bookFieldVisibility || {};
                      const saved = map[editing.id] || map[String(editing.id)] || {};
                      const draft = editing._visibilityDraft;
                      const cur = (key) => {
                        if (draft && key in draft) return draft[key] !== false;
                        if (key in saved) return saved[key] !== false;
                        return true; // 기본 노출
                      };
                      const toggle = (key) => {
                        const next = { ...(draft || {}) };
                        next[key] = !cur(key);
                        setField('_visibilityDraft', next);
                      };
                      return (
                        <>
                          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:8}}>
                            {FIELDS.map(([key, label]) => {
                              const on = cur(key);
                              return (
                                <label key={key} style={{
                                  display:'flex', alignItems:'center', gap:8,
                                  padding:'8px 12px',
                                  border:'1px solid ' + (on ? 'var(--primary-dim)' : 'var(--line)'),
                                  background: on ? 'rgba(245,213,72,0.06)' : 'var(--bg-2)',
                                  cursor:'pointer', fontSize:13,
                                }}>
                                  <input type="checkbox" checked={on} onChange={() => toggle(key)}/>
                                  <span style={{color: on ? 'var(--ink)' : 'var(--ink-3)'}}>{label}</span>
                                </label>
                              );
                            })}
                          </div>
                          <div style={{display:'flex', gap:8, marginTop:10, alignItems:'center', flexWrap:'wrap'}}>
                            <button type="button" className="btn btn-small btn-gold"
                              disabled={!draft}
                              onClick={async () => {
                                try {
                                  const _sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
                                  const next = { ...(_sc.bookFieldVisibility || {}) };
                                  const merged = { ...(saved || {}), ...(draft || {}) };
                                  // 모두 true 로 돌아간 경우 키 제거 (기본 폴백 사용 → KV 가벼움).
                                  const allOn = FIELDS.every(([k]) => merged[k] !== false);
                                  if (allOn) delete next[editing.id];
                                  else next[editing.id] = merged;
                                  await window.BGNJ_SITE_CONTENT.saveSection('bookFieldVisibility', next);
                                  setField('_visibilityDraft', null);
                                  flash('✓ 노출 설정 저장됨 — 책 상세 즉시 반영');
                                } catch (err) {
                                  window.BGNJ_TOAST.error('노출 설정 저장 실패: ' + (err?.message || ''));
                                }
                              }}>💾 노출 설정 즉시 저장</button>
                            {draft && <span className="mono dim-2" style={{fontSize:11}}>● 미저장</span>}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {editTab === 'media' && editing && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
                  <div className="card" style={{padding:18}}>
                    <h4 className="ko-serif" style={{fontSize:14, marginBottom:10}}>표지 (PNG/JPG)</h4>
                    <div style={{
                      aspectRatio:'3/4', maxWidth:200, marginBottom:12, position:'relative',
                      border:'1px solid var(--line)', background:'var(--bg-2)',
                      display:'grid', placeItems:'center', overflow:'hidden',
                    }}>
                      {editing.coverDataUri
                        ? <img src={editing.coverDataUri} alt={`${editing.title} 표지`} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                        : <span className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.18em'}}>NO COVER</span>}
                      {uploadingCover && (
                        <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', display:'grid', placeItems:'center', color:'#fff', fontSize:13, fontWeight:600}}>
                          ⏳ 업로드 중…
                        </div>
                      )}
                    </div>
                    <div style={{display:'flex', gap:8}}>
                      <label className={`btn btn-small ${uploadingCover ? 'disabled' : ''}`}
                        style={{cursor: uploadingCover ? 'not-allowed' : 'pointer', opacity: uploadingCover ? 0.6 : 1}}>
                        {uploadingCover ? '⏳ 업로드 중…' : '업로드'}
                        <input type="file" accept="image/png,image/jpeg" onChange={onUploadCover} disabled={uploadingCover} style={{display:'none'}}/>
                      </label>
                      {editing.coverDataUri && !uploadingCover && (
                        <button type="button" className="btn btn-small"
                          onClick={async () => { if ((await window.BGNJ_CONFIRM('표지를 비울까요?', { danger: true }))) patchImmediate({ coverDataUri: '' }); }}
                          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                      )}
                    </div>
                    <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.5}}>
                      권장 비율 3:4. 5MB 이하 PNG/JPG (R2). 업로드 즉시 반영 — 별도 [저장] 불필요.
                    </p>
                  </div>
                  <div className="card" style={{padding:18}}>
                    <h4 className="ko-serif" style={{fontSize:14, marginBottom:10}}>본문 미리보기 (PDF) — 선택</h4>
                    <div style={{position:'relative'}}>
                      {editing.pdfPreviewDataUri ? (
                        <div style={{height:240, border:'1px solid var(--line)', marginBottom:12}}>
                          <iframe src={editing.pdfPreviewDataUri} title={`${editing.title} 미리보기`}
                            style={{width:'100%', height:'100%', border:'none'}}/>
                        </div>
                      ) : (
                        <div style={{height:240, border:'1px dashed var(--line-2)', marginBottom:12, display:'grid', placeItems:'center', textAlign:'center', padding:'0 14px'}}>
                          <div>
                            <span className="dim-2 mono" style={{fontSize:10, letterSpacing:'0.18em', display:'block', marginBottom:6}}>NO PDF</span>
                            <span className="dim-2" style={{fontSize:11}}>업로드 안 하면 공개 페이지에서 미리보기 섹션 자체를 숨김.</span>
                          </div>
                        </div>
                      )}
                      {uploadingPdf && (
                        <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', display:'grid', placeItems:'center', color:'#fff', fontSize:13, fontWeight:600, marginBottom:12}}>
                          ⏳ 업로드 중…
                        </div>
                      )}
                    </div>
                    <div style={{display:'flex', gap:8}}>
                      <label className={`btn btn-small ${uploadingPdf ? 'disabled' : ''}`}
                        style={{cursor: uploadingPdf ? 'not-allowed' : 'pointer', opacity: uploadingPdf ? 0.6 : 1}}>
                        {uploadingPdf ? '⏳ 업로드 중…' : '업로드'}
                        <input type="file" accept="application/pdf" onChange={onUploadPdf} disabled={uploadingPdf} style={{display:'none'}}/>
                      </label>
                      {editing.pdfPreviewDataUri && !uploadingPdf && (
                        <button type="button" className="btn btn-small"
                          onClick={async () => { if ((await window.BGNJ_CONFIRM('PDF 미리보기를 비울까요?', { danger: true }))) patchImmediate({ pdfPreviewDataUri: '' }); }}
                          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                      )}
                    </div>
                    <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.5}}>
                      비워두면 공개 페이지에서 "미리보기" 섹션 자체가 숨겨집니다. (R2 20MB / 폴백 3MB)
                    </p>
                  </div>
                </div>
              )}

              {editTab === 'intro' && editing && (
                <div className="card" style={{padding:20}}>
                  <label className="field-label">소개 (HTML 허용)</label>
                  <textarea className="field-input" rows={12}
                    value={editing.intro || ''}
                    onChange={(e) => setField('intro', e.target.value)}
                    style={{fontFamily:'var(--font-mono)', fontSize:13, lineHeight:1.7}}/>
                  <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.5}}>
                    문단은 &lt;p&gt;…&lt;/p&gt;로 구분. 강조는 &lt;strong&gt;…&lt;/strong&gt;.
                  </p>
                </div>
              )}

              {editTab === 'toc' && editing && (
                <div className="card" style={{padding:20}}>
                  <label className="field-label">목차</label>
                  {/* v00.155 — 입력 규칙: 한 줄 = 한 챕터, '- ' 시작 = 직전 챕터의 하위 설명 (들여쓰기 표시). */}
                  <p className="dim" style={{fontSize:12, lineHeight:1.7, margin:'4px 0 10px'}}>
                    한 줄 = 한 챕터로 표시됩니다. 줄 시작에 <code style={{padding:'1px 6px', background:'var(--bg-2)', border:'1px solid var(--line-2)', borderRadius:3, fontFamily:'var(--font-mono)', fontSize:11}}>- </code>(하이픈+공백) 을 붙이면 직전 챕터의 <strong>하위 설명</strong>으로 들여쓰기 표시됩니다.
                  </p>
                  <textarea className="field-input" rows={14}
                    placeholder={"예)\n1부. 시작\n- 첫 번째 길\n- 두 번째 길\n2부. 끝나는 자리\n- 마지막 풍경"}
                    value={(editing.chapters || []).join('\n')}
                    onChange={(e) => setField('chapters', e.target.value.split('\n').map((s) => s.replace(/^\s+|\s+$/g, '')).filter(Boolean))}
                    style={{fontFamily:'var(--font-serif)', fontSize:14, lineHeight:1.8}}/>
                </div>
              )}

              {editTab === 'author' && editing && (
                <div className="card" style={{padding:20}}>
                  <label className="field-label">저자 소개</label>
                  <textarea className="field-input" rows={8}
                    value={editing.authorBio || ''}
                    onChange={(e) => setField('authorBio', e.target.value)}
                    style={{fontSize:14, lineHeight:1.8}}/>
                </div>
              )}

              {editTab === 'reviews' && (
                <div>
                  {(selected.reviews || []).length === 0 ? (
                    <div className="card" style={{padding:24, textAlign:'center'}}>
                      <span className="dim">등록된 리뷰가 없습니다.</span>
                    </div>
                  ) : (
                    (selected.reviews || []).map((r) => (
                      <div key={r.id} className="card" style={{padding:14, marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12}}>
                        <div style={{flex:1}}>
                          <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:4}}>
                            <span className="gold" style={{fontSize:13}}>{'★'.repeat(r.rating || 5)}</span>
                            <span className="mono dim-2" style={{fontSize:11}}>{r.userName}</span>
                            <span className="mono dim-2" style={{fontSize:10}}>{window.BGNJ_FMT.kstDate(r.createdAt)}</span>
                          </div>
                          <p className="ko-serif" style={{fontSize:13, lineHeight:1.7, margin:0}}>{r.text}</p>
                        </div>
                        <button type="button" className="btn btn-small"
                          onClick={async () => {
                            if (!(await window.BGNJ_CONFIRM('이 리뷰를 삭제할까요?', { danger: true }))) return;
                            window.BGNJ_BOOKS.removeReview(selected.id, r.id);
                            refresh();
                          }}
                          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                      </div>
                    ))
                  )}
                  <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.5}}>
                    리뷰는 사용자가 도서 상세 페이지에서 직접 등록합니다. 여기서는 부적절한 리뷰만 삭제할 수 있습니다.
                  </p>
                </div>
              )}
              {/* v00.147 — 명시 저장 버튼. 텍스트 필드는 dirty 시점에만 commit. media 업로드는 즉시 patch. */}
              {editing && editTab !== 'reviews' && (
                <AdminSaveBar>
                  <button type="button" className="btn btn-gold" onClick={commit}
                    disabled={saving || (!editing._isNew && !dirty)}>
                    {saving
                      ? '저장 중…'
                      : (editing._isNew
                          ? '💾 새 책 저장'
                          : (dirty ? '💾 저장' : '저장됨 ✓'))}
                  </button>
                  {/* v00.193 — 새 책 draft 취소 (D1 호출 없이 클라이언트 상태만 폐기). */}
                  {editing._isNew && (
                    <button type="button" className="btn btn-small"
                      onClick={cancelDraft}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>
                      새 책 취소
                    </button>
                  )}
                  {!editing._isNew && dirty && (
                    <button type="button" className="btn btn-small"
                      onClick={async () => { if ((await window.BGNJ_CONFIRM('변경 사항을 버리고 마지막 저장 시점으로 되돌릴까요?', { danger: true }))) { setEditing({ ...selected }); setDirty(false); } }}>
                      변경 취소
                    </button>
                  )}
                  <span className="admin-savebar__spacer"/>
                  <span className="dim-2 mono" style={{fontSize:11, color: editing._isNew ? 'var(--primary)' : undefined}}>
                    {editing._isNew
                      ? '● 새 책 (미저장 — [💾 새 책 저장] 클릭 시 D1 반영)'
                      : (dirty ? '● 미저장 변경 있음' : '○ 모든 변경 저장됨')}
                  </span>
                </AdminSaveBar>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────
window.BooksAdminPanel = BooksAdminPanel;

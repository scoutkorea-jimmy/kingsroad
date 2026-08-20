// 뱅기노자 — 강연/답사 관리 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// BulkLectureImport(강연 일괄 등록) · LectureAdminPanel(강연) · TourAdminPanel(답사).
// 자기완결적 — 의존은 모두 window 전역(BGNJ_LECTURES/TOURS/API/SITE_CONTENT/CONFIRM/TOAST 등).
// entry-admin 에서 AuthAdminPage 앞에 로드. LectureAdminPanel·TourAdminPanel window 노출.

// === Lecture Admin Panel ==========================================
// v00.131 — 강연 일괄 등록 컴포넌트. CSV / pipe-separated 파싱.
// 사용자 요청 '관리자페이지 강연 탭에서 일괄 등록'.
// 형식 (한 줄 = 한 강연, 헤더 첫 줄):
//   title,topic,venue,host,startsAt,durationMinutes,capacity,price,note
//   "공개 강연","경복궁의 사계","경복궁","뱅기노자","2026-06-01T19:00:00+09:00",90,30,15000,"무료 입장"
// v00.286 ESM — cross-module import (전역 결합 제거).
// v00.286 ESM — window.X 멤버 읽기 → import 전환.
import { LecturePageEditorPanel } from './AdminContentEditors.jsx';
import { TourPageEditorPanel } from './AdminContentEditors.jsx';

import { TPE_PrepEditor, TPE_ScheduleEditor, _arrAdd, _arrMove, _arrRemove, _arrUpdate } from './AdminContentEditors.jsx';
import { pickImageWithR2Fallback } from './AdminShared.jsx';

const BulkLectureImport = ({ onClose, onDone }) => {
  const [text, setText] = React.useState('title,topic,venue,host,startsAt,durationMinutes,capacity,price,note\n');
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState(null); // { ok: N, fail: [{line, err}] }

  const _parseCsvLine = (line) => {
    // 단순 CSV 파서 — quoted fields 지원.
    const out = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === ',') { out.push(cur); cur = ''; }
        else if (c === '"' && cur === '') inQ = true;
        else cur += c;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };

  const submit = async () => {
    setBusy(true); setResult(null);
    const lines = String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) { setResult({ ok: 0, fail: [{ line: 0, err: '헤더 + 최소 1행 필요' }] }); setBusy(false); return; }
    const header = _parseCsvLine(lines[0]);
    const expected = ['title','topic','venue','host','startsAt','durationMinutes','capacity','price','note'];
    if (expected.some((k, i) => header[i] !== k)) {
      setResult({ ok: 0, fail: [{ line: 1, err: `헤더 형식 불일치. 예상: ${expected.join(',')}` }] });
      setBusy(false); return;
    }
    const fails = []; let ok = 0;
    for (let i = 1; i < lines.length; i++) {
      const cols = _parseCsvLine(lines[i]);
      const row = Object.fromEntries(expected.map((k, j) => [k, cols[j] || '']));
      try {
        const id = `bulk-lec-${Date.now()}-${i}`;
        if (!row.title || !row.startsAt) throw new Error('title 과 startsAt 필수');
        await window.BGNJ_LECTURES.saveLecture({
          id,
          title: row.title,
          topic: row.topic || '',
          venue: row.venue || '',
          host: row.host || '뱅기노자',
          next: row.startsAt.slice(0, 16).replace('T', ' ').replace(/-/g, '.'),
          startsAt: row.startsAt,
          durationMinutes: Number(row.durationMinutes || 90),
          capacity: Number(row.capacity || 30),
          price: Number(row.price || 0),
          note: row.note || '',
        });
        ok++;
      } catch (err) {
        fails.push({ line: i + 1, err: err?.message || String(err) });
      }
    }
    setBusy(false);
    setResult({ ok, fail: fails });
    if (ok > 0) onDone?.();
  };

  return (
    <div className="card" style={{padding:18, marginBottom:18, border:'1px dashed var(--primary-dim)'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
        <h4 className="ko-serif" style={{fontSize:15, margin:0}}>📑 강연 일괄 등록 (CSV)</h4>
        <button type="button" className="btn btn-small" onClick={onClose}>닫기</button>
      </div>
      <p className="dim" style={{fontSize:12, lineHeight:1.7, marginBottom:10}}>
        형식: <code>title,topic,venue,host,startsAt,durationMinutes,capacity,price,note</code> (헤더 1행 + 데이터 N행).
        startsAt 은 ISO 8601 (예: <code>2026-06-01T19:00:00+09:00</code>). 쉼표/큰따옴표 포함 시 <code>"..."</code> 로 감싸세요.
      </p>
      <textarea className="field-input" rows={10} value={text}
        onChange={(e) => setText(e.target.value)}
        style={{fontFamily:'var(--font-mono)', fontSize:12, lineHeight:1.5}}/>
      <div style={{display:'flex', gap:8, marginTop:10, justifyContent:'flex-end'}}>
        <button type="button" className="btn btn-gold btn-small" onClick={submit} disabled={busy}>
          {busy ? '등록 중…' : '일괄 등록 실행'}
        </button>
      </div>
      {result && (
        <div style={{marginTop:12, padding:12, border:'1px solid var(--line)', fontSize:12, lineHeight:1.7}}>
          <div className="gold mono" style={{marginBottom:6}}>결과</div>
          <div>✅ 성공: <strong>{result.ok}</strong>건</div>
          {result.fail.length > 0 && (
            <>
              <div style={{marginTop:6}}>❌ 실패: <strong style={{color:'var(--danger)'}}>{result.fail.length}</strong>건</div>
              <ul style={{margin:'6px 0 0', paddingLeft:18}}>
                {result.fail.map((f, i) => (
                  <li key={i} style={{color:'var(--danger)'}}>{f.line}행 — {f.err}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const LectureAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [editingId, setEditingId] = React.useState(null);
  // v00.237 — admin 패널에서도 사진 갤러리 (포스터 + 현장 사진) 한 번에 관리.
  // window.LectureQuickAddModal 재사용 — 같은 모달이 정보/갤러리/현장사진 통합 편집.
  const [galleryEditTarget, setGalleryEditTarget] = React.useState(null);
  const [draft, setDraft] = React.useState({ title: '', topic: '', venue: '', host: '', startsAt: '', durationMinutes: 90, capacity: 30, price: 0, note: '' });
  const [refundRejectNotes, setRefundRejectNotes] = React.useState({});
  // v00.131 — 일괄 등록 토글.
  const [showBulk, setShowBulk] = React.useState(false);
  // v00.075 — 강연별 진행/참고/커버 inline 편집용 별도 state (TourAdminPanel v00.072 패턴 동일).
  const [contentEditingId, setContentEditingId] = React.useState(null);
  const [contentSchedule, setContentSchedule] = React.useState([]);
  const [contentNotes, setContentNotes] = React.useState([]);
  const [contentCover, setContentCover] = React.useState('');
  const [contentMsg, setContentMsg] = React.useState('');

  const lectures = React.useMemo(() => window.BGNJ_LECTURES.listAll({ includeHidden: true }), [tick]);

  const refresh = () => setTick((v) => v + 1);

  // v00.075 — 강연별 콘텐츠 (진행/참고/커버) override 편집기.
  const startContentEdit = (l) => {
    if (!l) return;
    const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
    const ovr = (sc.lecturePages || {})[l.id] || {};
    setContentEditingId(l.id);
    setContentSchedule(Array.isArray(ovr.schedule) ? ovr.schedule.slice() : []);
    setContentNotes(Array.isArray(ovr.notes) ? ovr.notes.slice() : []);
    setContentCover(ovr.coverDataUri || '');
    setContentMsg('');
  };
  const cancelContentEdit = () => {
    setContentEditingId(null); setContentSchedule([]); setContentNotes([]); setContentCover(''); setContentMsg('');
  };
  const saveContentEdit = async () => {
    if (!contentEditingId) return;
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const lecturePages = sc.lecturePages || {};
      const cleanS = contentSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ''), l: String(s.l || '') }));
      const cleanN = contentNotes.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      const next = { ...lecturePages, [contentEditingId]: {
        schedule: cleanS, notes: cleanN,
        coverDataUri: contentCover || undefined,
      } };
      await window.BGNJ_SITE_CONTENT.saveSection('lecturePages', next);
      setContentMsg('저장됨 — 강연 페이지에 즉시 반영.');
      setTimeout(() => setContentMsg(''), 2500);
      refresh();
    } catch (err) { window.BGNJ_TOAST.error('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };
  // v00.184 — DRY: pickImageWithR2Fallback 헬퍼 사용 (이전엔 25-line 인라인 동일 패턴).
  const onPickContentCover = async (e) => {
    const result = await pickImageWithR2Fallback(e, { folder: 'lecture-covers' });
    if (result) setContentCover(result);
  };

  // 강연별 신청 목록을 mount 시 일괄 fetch.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = window.BGNJ_LECTURES.listAll({ includeHidden: true });
      await Promise.allSettled(list.map((l) => window.BGNJ_LECTURES.refreshRegistrations(l.id)));
      if (!cancelled) refresh();
    })();
    return () => { cancelled = true; };
  }, [lectures.length]);

  const startEdit = (l) => {
    const startsAtLocal = (() => {
      if (!l.startsAt) return '';
      const d = new Date(l.startsAt);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })();
    setEditingId(l.id);
    setDraft({
      title: l.title || '',
      topic: l.topic || '',
      venue: l.venue || '',
      host: l.host || '',
      next: l.next || '',
      startsAt: startsAtLocal,
      durationMinutes: l.durationMinutes || 90,
      capacity: l.capacity || 30,
      price: l.price || 0,
      note: l.note || '',
    });
  };

  // v00.131 — async + await + try/catch + broadcast. 같은 fire-and-forget 패턴 fix.
  const saveEdit = async () => {
    if (editingId == null) return;
    const lecture = window.BGNJ_LECTURES.getLecture(editingId);
    if (!lecture) return;
    const startsAtIso = draft.startsAt ? new Date(draft.startsAt).toISOString() : lecture.startsAt;
    const next = draft.next || lecture.next;
    try {
      await window.BGNJ_LECTURES.saveLecture({
        id: lecture.id,
        title: draft.title,
        topic: draft.topic,
        venue: draft.venue,
        host: draft.host,
        next,
        startsAt: startsAtIso,
        durationMinutes: Number(draft.durationMinutes) || 90,
        capacity: Number(draft.capacity) || lecture.capacity,
        price: Number(draft.price) || 0,
        note: draft.note,
      });
      try { window.BGNJ_BROADCAST?.publish?.('lectures'); } catch (_e) { console.warn('[bgnj] AdminEventsPanels.jsx:235 오류(무시하고 진행)', _e); }
      setEditingId(null);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error('강연 저장 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  const addNewLecture = async () => {
    const id = `lecture-${Date.now()}`;
    const now = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +1주
    const pad = (n) => String(n).padStart(2, '0');
    const startsAt = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T19:00:00+09:00`;
    const next = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} 19:00`;
    try {
      // saveLecture 는 async — await 으로 서버 저장 + 캐시 refresh 완료 후 lecture 객체 반환.
      // 이전엔 await 없이 호출 후 동기 getLecture(id) 가 null 을 반환 → startEdit(null) → 'startsAt' 읽기 오류.
      const created = await window.BGNJ_LECTURES.saveLecture({
        id,
        title: '새 강연',
        topic: '강연 주제를 입력하세요',
        venue: '장소',
        host: '뱅기노자',
        next,
        startsAt,
        durationMinutes: 90,
        capacity: 30,
        price: 0,
        note: '강연 안내를 입력하세요.',
      });
      try { await window.BGNJ_AUDIT?.log?.({ action: 'lecture.create', target: `lecture:${id}` }); } catch (_e) { console.warn('[bgnj] AdminEventsPanels.jsx:265 오류(무시하고 진행)', _e); }
      try { window.BGNJ_BROADCAST?.publish?.('lectures'); } catch (_e) { console.warn('[bgnj] AdminEventsPanels.jsx:266 오류(무시하고 진행)', _e); }
      refresh();
      if (created) startEdit(created);
      else window.BGNJ_TOAST.error('강연 생성 후 객체를 가져오지 못했습니다. 페이지를 새로고침해 주세요.');
    } catch (err) {
      window.BGNJ_TOAST.error('강연 생성 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  // v00.105 — 통합: 강연 페이지 콘텐츠 편집기 collapsible 내장.
  const [showPageEditor, setShowPageEditor] = React.useState(false);

  return (
    <div>
      {/* 통합 페이지 콘텐츠 편집기 */}
      <div style={{marginBottom:18, border:'1px solid var(--line)', background:'var(--bg-2)'}}>
        <button type="button"
          onClick={() => setShowPageEditor((v) => !v)}
          style={{
            width:'100%', padding:'12px 16px', textAlign:'left',
            background:'transparent', border:'none', cursor:'pointer',
            fontSize:13, fontWeight:600, color:'var(--ink)',
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
          <span>📋 강연 페이지 콘텐츠 — 글로벌 진행·참고 / 템플릿 / 강연별 override</span>
          <span className="mono dim-2" style={{fontSize:11}}>{showPageEditor ? '▲ 닫기' : '▼ 펼치기'}</span>
        </button>
        {showPageEditor && (
          <div style={{padding:'14px 18px', borderTop:'1px solid var(--line)', background:'var(--bg)'}}>
            {LecturePageEditorPanel ? <window.LecturePageEditorPanel/> : <p className="dim">패널 로딩 중...</p>}
          </div>
        )}
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap', marginBottom:18}}>
        <p className="dim" style={{fontSize:13, lineHeight:1.8, margin:0, flex:1, minWidth:280}}>
          강연 정원 / 일정 / 가격을 수정하고, 신청자 입금을 확인해 참가를 확정합니다.
          결제는 현재 <strong className="gold">무통장 입금</strong>만 지원합니다.
          계좌번호는 <strong className="gold">시스템 → 설정</strong> 탭에서 등록합니다.
        </p>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {lectures.length === 0 && (
            <button type="button" className="btn btn-small" onClick={async () => {
              if (!(await window.BGNJ_CONFIRM('샘플 강연 3개를 추가합니다. 진행할까요?', { danger: true }))) return;
              const samples = [
                { title: '왕의 길', topic: '조선 왕실의 일상과 의례', venue: '경복궁 수정전', host: '뱅기노자', durationMinutes: 90, capacity: 30, price: 0, note: '경복궁 답사와 함께하는 인문학 강연.' },
                { title: '문(門)을 읽다', topic: '궁궐 문(門)에 새겨진 인문학', venue: '창덕궁 인정전', host: '뱅기노자', durationMinutes: 90, capacity: 30, price: 30000, note: '궁궐 곳곳의 문에 담긴 의미를 해독합니다.' },
                { title: '차(茶) 한 잔의 인문학', topic: '동아시아 차 문화와 사유', venue: '뱅기노자 사랑방', host: '뱅기노자', durationMinutes: 75, capacity: 20, price: 50000, note: '차 한 잔에 담긴 천 년의 사유를 함께 따라갑니다.' },
              ];
              const pad = (n) => String(n).padStart(2, '0');
              for (let i = 0; i < samples.length; i++) {
                const d = new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000);
                const startsAt = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T19:00:00+09:00`;
                const next = `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} 19:00`;
                await window.BGNJ_LECTURES.saveLecture({ id: `sample-lecture-${Date.now()}-${i}`, ...samples[i], startsAt, next });
              }
              refresh();
            }}>샘플 데이터 추가</button>
          )}
          <button type="button" className="btn btn-small" onClick={() => setShowBulk((v) => !v)}>📑 일괄 등록</button>
          <button type="button" className="btn btn-gold btn-small" onClick={addNewLecture}>＋ 새 강연 추가</button>
        </div>
      </div>

      {/* v00.131 — 일괄 등록 (CSV / pipe-separated). 사용자 요청 '관리자페이지 강연 탭에서 일괄 등록은 할 수 있게'. */}
      {showBulk && (
        <BulkLectureImport onClose={() => setShowBulk(false)} onDone={() => { setShowBulk(false); refresh(); try { window.BGNJ_BROADCAST?.publish?.('lectures'); } catch (_e) { console.warn('[bgnj] AdminEventsPanels.jsx:332 오류(무시하고 진행)', _e); } }}/>
      )}

      {lectures.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>관리할 강연이 없습니다.</div>
      ) : (
        <div style={{display:'grid', gap:14}}>
          {lectures.map((l) => {
            const seats = window.BGNJ_LECTURES.getSeats(l.id);
            const regs = window.BGNJ_LECTURES.listRegistrations(l.id);
            const active = regs.filter((r) => r.status !== 'cancelled');
            const isEditing = editingId === l.id;
            return (
              <article key={l.id} className="card" style={{padding:20, opacity: l.hidden ? 0.55 : 1}}>
                <header style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                  <div>
                    <h3 className="ko-serif" style={{fontSize:18}}>
                      <span className="dim-2 mono" style={{fontSize:11, marginRight:8}}>#{String(l.id).padStart(2,'0')}</span>
                      {l.title} — {l.topic}
                      {l.hidden && <span className="mono" style={{marginLeft:10, fontSize:10, letterSpacing:'0.18em', color:'var(--danger)', border:'1px solid var(--danger)', padding:'1px 6px', borderRadius:2}}>숨김</span>}
                    </h3>
                    <div className="mono dim-2" style={{fontSize:11, marginTop:4, letterSpacing:'0.12em'}}>
                      {l.next} · {l.venue} · 진행 {l.host}
                    </div>
                  </div>
                  <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: seats.remaining <= 0 ? 'var(--danger)' : 'var(--primary)'}}>
                      잔여 {seats.remaining} / {seats.capacity}
                    </span>
                    {seats.waitlist > 0 && <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)'}}>대기 {seats.waitlist}</span>}
                    {l.price > 0
                      ? <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)', border:'1px solid var(--line-2)', padding:'1px 6px'}}>유료 {window.BGNJ_FMT.won(l.price)}</span>
                      : <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--secondary)', border:'1px solid var(--primary-dim)', padding:'1px 6px'}}>FREE</span>}
                  </div>
                </header>

                {isEditing ? (
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10, padding:'14px 0', borderTop:'1px solid var(--line)'}}>
                    {[
                      { k: 'title',     l: '제목',           type: 'text' },
                      { k: 'topic',     l: '주제',           type: 'text' },
                      { k: 'venue',     l: '장소',           type: 'text' },
                      { k: 'host',      l: '진행',           type: 'text' },
                      { k: 'next',      l: '표시용 일정 문구', type: 'text', placeholder: '2026.05.02 · 토 19:00' },
                      { k: 'startsAt',  l: '실제 시작(로컬)', type: 'datetime-local' },
                      { k: 'durationMinutes', l: '소요(분)', type: 'number' },
                      { k: 'capacity',  l: '정원',           type: 'number' },
                      { k: 'price',     l: '참가비(원)',     type: 'number' },
                    ].map((f) => (
                      <div key={f.k} className="field" style={{margin:0}}>
                        <label className="field-label">{f.l}</label>
                        <input className="field-input" type={f.type} placeholder={f.placeholder || ''}
                          value={draft[f.k] ?? ''}
                          onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })}/>
                      </div>
                    ))}
                    <div className="field" style={{margin:0, gridColumn:'1 / -1'}}>
                      <label className="field-label">메모</label>
                      <textarea className="field-input" rows={2} value={draft.note}
                        onChange={(e) => setDraft({ ...draft, note: e.target.value })}/>
                    </div>
                    <div style={{gridColumn:'1 / -1', display:'flex', justifyContent:'flex-end', gap:8}}>
                      <button type="button" className="btn btn-small" onClick={() => setEditingId(null)}>취소</button>
                      <button type="button" className="btn btn-gold btn-small" onClick={saveEdit}>저장</button>
                    </div>
                  </div>
                ) : (
                  <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:10, flexWrap:'wrap'}}>
                    <button type="button" className="btn btn-small btn-gold" onClick={() => startEdit(l)}>✎ 강연 정보 (제목·정원·시간·가격)</button>
                    <button type="button" className="btn btn-small" onClick={() => startContentEdit(l)}>📋 강연 진행·참고·커버</button>
                    {/* v00.237 — 사진 갤러리 (포스터 + 현장 사진) 통합 편집 진입로. 사용자 요청: 'admin 에서도 손쉽게'. */}
                    <button type="button" className="btn btn-small" onClick={() => setGalleryEditTarget(l)}>🖼 포스터·현장사진</button>
                    <button type="button" className="btn btn-small"
                      onClick={() => {
                        window.BGNJ_LECTURES.setHidden(l.id, !l.hidden);
                        window.BGNJ_AUDIT?.log({ action: l.hidden ? 'lecture.unhide' : 'lecture.hide', target: `lecture:${l.id}` });
                        refresh();
                      }}
                      style={{marginLeft:'auto'}}>
                      {l.hidden ? '👁 표시 복원' : '🙈 숨김 처리'}
                    </button>
                    <button type="button" className="btn btn-small"
                      onClick={async () => {
                        if (!(await window.BGNJ_CONFIRM('이 강연을 삭제하시겠어요? 시드 강연은 자동 숨김 처리됩니다 (데이터 보존). 관리자가 추가한 강연은 완전 삭제됩니다.', { danger: true }))) return;
                        // v00.129 — async + await + try/catch + 다른 탭 broadcast (cache purge).
                        try {
                          await window.BGNJ_LECTURES.deleteLecture(l.id);
                          window.BGNJ_AUDIT?.log({ action: 'lecture.remove', target: `lecture:${l.id}` });
                          try { window.BGNJ_BROADCAST?.publish?.('lectures'); } catch (_e) { console.warn('[bgnj] AdminEventsPanels.jsx:420 오류(무시하고 진행)', _e); }
                          refresh();
                        } catch (err) {
                          window.BGNJ_TOAST.error('강연 삭제 실패: ' + (err?.message || '알 수 없는 오류'));
                        }
                      }}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                  </div>
                )}

                {/* v00.075 — 강연별 진행/참고/커버 inline 편집 (per-lecture override) */}
                {contentEditingId === l.id && (
                  <section style={{marginTop:14, paddingTop:14, borderTop:'1px solid var(--line)'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10, flexWrap:'wrap', gap:8}}>
                      <div className="mono gold" style={{fontSize:11, letterSpacing:'0.22em'}}>이 강연의 진행/참고 콘텐츠</div>
                      <div className="dim-2" style={{fontSize:10, fontStyle:'italic'}}>
                        비워두면 글로벌 (운영설정 → 사이트 콘텐츠 → 강연 페이지) 사용. 커버 비면 placeholder.
                      </div>
                    </div>
                    {/* 커버 이미지 */}
                    <div className="card" style={{padding:12, marginBottom:12, display:'flex', gap:14, alignItems:'center'}}>
                      <div style={{width:96, height:60, flexShrink:0, border:'1px solid var(--line)', background:'var(--bg-2)', display:'grid', placeItems:'center', overflow:'hidden'}}>
                        {contentCover
                          ? <img src={contentCover} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                          : <span className="dim-2 mono" style={{fontSize:9, letterSpacing:'0.18em'}}>NONE</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:3}}>커버 이미지</div>
                        <div className="dim-2" style={{fontSize:11, lineHeight:1.5}}>1600×1000 권장 · 1.5MB 이하 · 비우면 placeholder.</div>
                      </div>
                      <div style={{display:'flex', gap:6}}>
                        <label className="btn btn-small" style={{cursor:'pointer'}}>
                          업로드
                          <input type="file" accept="image/*" onChange={onPickContentCover} style={{display:'none'}}/>
                        </label>
                        {contentCover && (
                          <button type="button" className="btn btn-small" onClick={() => setContentCover('')}
                            style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                        )}
                      </div>
                    </div>
                    {/* 진행 일정 — TPE_ScheduleEditor 재사용 (모듈 최상위) */}
                    <TPE_ScheduleEditor rows={contentSchedule}
                      onAdd={() => setContentSchedule((a) => _arrAdd(a, { t: '', l: '' }))}
                      onRemove={(i) => setContentSchedule((a) => _arrRemove(a, i))}
                      onUpdate={(i, k, v) => setContentSchedule((a) => { const n = a.slice(); n[i] = { ...n[i], [k]: v }; return n; })}
                      onMove={(i, d) => setContentSchedule((a) => _arrMove(a, i, d))}/>
                    {/* 참고 리스트 — TPE_PrepEditor 재사용 (구조 동일: 문자열 배열) */}
                    <TPE_PrepEditor rows={contentNotes}
                      onAdd={() => setContentNotes((a) => _arrAdd(a, ''))}
                      onRemove={(i) => setContentNotes((a) => _arrRemove(a, i))}
                      onUpdate={(i, v) => setContentNotes((a) => _arrUpdate(a, i, v))}
                      onMove={(i, d) => setContentNotes((a) => _arrMove(a, i, d))}/>
                    <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:8}}>
                      {contentMsg && <span role="status" className="mono" style={{fontSize:11, color:'var(--secondary)', fontWeight:600, marginRight:'auto'}}>{contentMsg}</span>}
                      <button type="button" className="btn btn-small" onClick={cancelContentEdit}>닫기</button>
                      <button type="button" className="btn btn-gold btn-small" onClick={saveContentEdit}>저장</button>
                    </div>
                  </section>
                )}

                {/* Roster */}
                <section style={{marginTop:14, paddingTop:14, borderTop:'1px solid var(--line)'}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>참가자 명단 · {active.length}명</div>
                  {active.length === 0 ? (
                    <p className="dim" style={{fontSize:13}}>아직 신청자가 없습니다.</p>
                  ) : (
                    <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
                      <thead>
                        <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>이름</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>이메일</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>연락처</th>
                          <th scope="col" style={{padding:10, textAlign:'right'}}>인원</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>상태</th>
                          <th scope="col" style={{padding:10, textAlign:'right'}}>액션</th>
                        </tr>
                      </thead>
                      <tbody>
                        {active.map((r) => (
                          <tr key={r.id} style={{borderBottom:'1px solid var(--line)'}}>
                            <td style={{padding:10}}>{r.name}</td>
                            <td className="mono dim-2" style={{padding:10, fontSize:11}}>{r.email}</td>
                            <td className="mono dim-2" style={{padding:10, fontSize:11}}>{r.phone || '-'}</td>
                            <td className="mono" style={{padding:10, textAlign:'right'}}>{r.count}</td>
                            <td className="mono" style={{padding:10, fontSize:10, letterSpacing:'0.18em', color:
                              r.status === 'confirmed' ? 'var(--primary)' :
                              r.status === 'waitlist' ? 'var(--ink-2)' :
                              r.status === 'pending_payment' ? 'var(--ink-2)' : 'var(--danger)'}}>
                              {r.status === 'pending_payment' ? '입금 대기' :
                                r.status === 'confirmed' ? '참가 확정' :
                                r.status === 'waitlist' ? '대기자' : r.status}
                              {r.paid && r.status === 'confirmed' && <span className="dim-2 mono" style={{marginLeft:6, fontSize:9}}>입금 ✓</span>}
                            </td>
                            <td style={{padding:10, textAlign:'right'}}>
                              <div style={{display:'flex', justifyContent:'flex-end', gap:6, flexWrap:'wrap'}}>
                                {r.status === 'pending_payment' && (
                                  <button type="button" className="btn btn-small"
                                    onClick={() => { window.BGNJ_LECTURES.confirmPayment(l.id, r.id); refresh(); }}>
                                    입금 확인 → 확정
                                  </button>
                                )}
                                {r.status === 'confirmed' && r.price > 0 && (
                                  <button type="button" className="btn btn-small"
                                    onClick={() => { window.BGNJ_LECTURES.unconfirmPayment(l.id, r.id); refresh(); }}>
                                    확정 취소
                                  </button>
                                )}
                                {r.status !== 'refund_requested' && (
                                  <button type="button" className="btn btn-small"
                                    onClick={async () => {
                                      if (!(await window.BGNJ_CONFIRM(`${r.name} 님 신청을 취소 처리하시겠어요?`, { danger: true }))) return;
                                      window.BGNJ_LECTURES.cancelRegistration(l.id, r.id);
                                      refresh();
                                    }}
                                    style={{borderColor:'var(--danger)', color:'var(--danger)'}}>취소</button>
                                )}
                                {r.status === 'refund_requested' && (
                                  <>
                                    <span className="mono" style={{fontSize:9, color:'var(--warning)', letterSpacing:'0.15em'}}>환불신청</span>
                                    {r.refundReason && <span className="dim-2" style={{fontSize:10}}>· {r.refundReason}</span>}
                                    <button type="button" className="btn btn-small"
                                      onClick={async () => { if (!(await window.BGNJ_CONFIRM('환불을 승인하시겠어요?', { danger: true }))) return; window.BGNJ_LECTURES.approveRefund(l.id, r.id); refresh(); }}
                                      style={{borderColor:'var(--primary)', color:'var(--secondary)'}}>승인</button>
                                    <input className="field-input" placeholder="반려 사유"
                                      style={{padding:'4px 8px', fontSize:11, maxWidth:140}}
                                      value={refundRejectNotes[r.id] || ''}
                                      onChange={e => setRefundRejectNotes({...refundRejectNotes, [r.id]: e.target.value})}/>
                                    <button type="button" className="btn btn-small"
                                      onClick={async () => { if (!(await window.BGNJ_CONFIRM('환불 신청을 반려하시겠어요?', { danger: true }))) return; window.BGNJ_LECTURES.rejectRefund(l.id, r.id, refundRejectNotes[r.id] || ''); refresh(); }}
                                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>반려</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              </article>
            );
          })}
        </div>
      )}
      {/* v00.237 — 사진 갤러리 모달. LectureQuickAddModal 재사용 (정보 + 포스터 + 현장사진 통합). */}
      {galleryEditTarget && window.LectureQuickAddModal && (
        <window.LectureQuickAddModal
          onClose={() => setGalleryEditTarget(null)}
          onSaved={refresh}
          initialLecture={galleryEditTarget}/>
      )}
    </div>
  );
};

// === Tour Admin Panel =============================================
const TourAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({});
  // v00.237 — admin 패널에서도 사진 갤러리 통합 편집.
  const [galleryEditTarget, setGalleryEditTarget] = React.useState(null);
  const [refundRejectNotes, setRefundRejectNotes] = React.useState({});
  // v00.072 — 투어별 답사 일정/준비물/커버 inline 편집용 별도 state.
  // contentEditingId 가 set 되면 해당 투어 카드 하단에 TPE_ScheduleEditor/TPE_PrepEditor + 커버 업로드 노출.
  const [contentEditingId, setContentEditingId] = React.useState(null);
  const [contentSchedule, setContentSchedule] = React.useState([]);
  const [contentPrep, setContentPrep] = React.useState([]);
  const [contentCover, setContentCover] = React.useState('');
  const [contentMsg, setContentMsg] = React.useState('');
  const refresh = () => setTick((v) => v + 1);
  const tours = React.useMemo(() => window.BGNJ_TOURS.listAll({ includeHidden: true }), [tick]);

  const startContentEdit = (t) => {
    if (!t) return;
    const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
    const ovr = (sc.tourPages || {})[t.id] || {};
    setContentEditingId(t.id);
    setContentSchedule(Array.isArray(ovr.schedule) ? ovr.schedule.slice() : []);
    setContentPrep(Array.isArray(ovr.prep) ? ovr.prep.slice() : []);
    // v00.081 — D1 cover_url 우선, site_content_kv legacy 폴백.
    setContentCover(t.coverUrl || ovr.coverDataUri || '');
    setContentMsg('');
  };
  const cancelContentEdit = () => {
    setContentEditingId(null); setContentSchedule([]); setContentPrep([]); setContentCover(''); setContentMsg('');
  };
  const saveContentEdit = async () => {
    if (!contentEditingId) return;
    try {
      const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
      const tourPages = sc.tourPages || {};
      const cleanS = contentSchedule.filter((s) => s && (s.t || s.l)).map((s) => ({ t: String(s.t || ''), l: String(s.l || '') }));
      const cleanP = contentPrep.filter((p) => p && String(p).trim()).map((p) => String(p).trim());
      // v00.081 — schedule / prep 만 site_content_kv 에. cover 는 D1 (tours.cover_url) 로 분기 저장.
      // 기존 site_content_kv.tourPages[id].coverDataUri legacy 는 D1 비면 폴백으로 계속 동작.
      const next = { ...tourPages, [contentEditingId]: {
        schedule: cleanS, prep: cleanP,
      } };
      await window.BGNJ_SITE_CONTENT.saveSection('tourPages', next);
      // 커버는 D1 에 직접 저장 — saveTour 로 cover_url 패치.
      try {
        await window.BGNJ_TOURS.saveTour({ id: contentEditingId, coverUrl: contentCover || '' });
      } catch (err) {
        console.warn('[v00.081] cover_url save 실패 — site_content fallback 사용 가능', err);
      }
      setContentMsg('저장됨 — 투어 페이지에 즉시 반영.');
      setTimeout(() => setContentMsg(''), 2500);
      refresh();
    } catch (err) { window.BGNJ_TOAST.error('저장 실패: ' + (err?.message || '알 수 없는 오류')); }
  };
  // v00.184 — DRY: pickImageWithR2Fallback 헬퍼 사용.
  const onPickContentCover = async (e) => {
    const result = await pickImageWithR2Fallback(e, { folder: 'tour-covers' });
    if (result) setContentCover(result);
  };

  // 답사별 예약 목록을 mount 시 일괄 fetch.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = window.BGNJ_TOURS.listAll({ includeHidden: true });
      await Promise.allSettled(list.map((t) => window.BGNJ_TOURS.refreshReservations(t.id)));
      if (!cancelled) refresh();
    })();
    return () => { cancelled = true; };
  }, [tours.length]);

  const startEdit = (t) => {
    if (!t) return; // 생성 실패/null 방어
    const startsAtLocal = (() => {
      if (!t.startsAt) return '';
      const d = new Date(t.startsAt);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })();
    setEditingId(t.id);
    setDraft({
      title: t.title || '',
      subtitle: t.subtitle || '', // v00.106
      level: t.level || '입문',
      duration: t.duration || '',
      group: t.group || '',
      startsAt: startsAtLocal, // v00.106 — next 와 통합. next 는 startsAt 에서 자동 derive.
      durationMinutes: t.durationMinutes || 180,
      capacity: t.capacity || 12,
      priceNumber: t.priceNumber || 0,
      desc: t.desc || '',
      refundPolicy: t.refundPolicy || '', // v00.106
    });
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    const tour = window.BGNJ_TOURS.getTour(editingId);
    if (!tour) return;
    const startsAtIso = draft.startsAt ? new Date(draft.startsAt).toISOString() : tour.startsAt;
    // v00.106 — next 표시 문구는 startsAt 에서 자동 생성. "2026.05.15 10:00" 형태.
    const nextLabel = (() => {
      if (!startsAtIso) return tour.next || '';
      const d = new Date(startsAtIso);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })();
    // v00.127 — async + await + try/catch. 이전엔 fire-and-forget 으로 refresh 가 옛 데이터 사용.
    try {
      await window.BGNJ_TOURS.saveTour({
        id: tour.id,
        title: draft.title,
        subtitle: draft.subtitle, // v00.106
        level: draft.level,
        duration: draft.duration,
        group: draft.group,
        next: nextLabel,
        startsAt: startsAtIso,
        durationMinutes: Number(draft.durationMinutes) || 180,
        capacity: Number(draft.capacity) || tour.capacity,
        priceNumber: Number(draft.priceNumber) || 0,
        price: Number(draft.priceNumber) || 0,
        desc: draft.desc,
        refundPolicy: draft.refundPolicy, // v00.106
      });
      setEditingId(null);
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error('투어 저장 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  const addNewTour = async () => {
    const id = `tour-${Date.now()}`;
    const now = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // +2주
    const pad = (n) => String(n).padStart(2, '0');
    const startsAt = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T10:00:00+09:00`;
    const next = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} 10:00`;
    try {
      // 서버는 priceNumber 우선, price 는 폴백 (parsePrice). 포맷팅 문자열 대신 숫자만 보냄.
      const tour = await window.BGNJ_TOURS.saveTour({
        id,
        title: '새 답사 — 부제',
        level: '입문',
        duration: '3시간',
        group: '12인 이하',
        next,
        startsAt,
        durationMinutes: 180,
        capacity: 12,
        priceNumber: 80000,
        price: 80000,
        desc: '답사 안내를 입력하세요.',
      });
      if (!tour) throw new Error('서버 응답 없음');
      window.BGNJ_AUDIT?.log({ action: 'tour.create', target: `tour:${id}` });
      try { window.BGNJ_BROADCAST?.publish?.('tours'); } catch (_e) { console.warn('[bgnj] AdminEventsPanels.jsx:735 오류(무시하고 진행)', _e); }
      refresh();
      startEdit(tour);
    } catch (err) {
      window.BGNJ_TOAST.error('투어 생성 실패: ' + (err?.message || '알 수 없는 오류'));
      refresh();
    }
  };

  // v00.127 — async + await + try/catch. 이전엔 deleteTour fire-and-forget 으로 refresh 가
  // 즉시 OLD 캐시 사용 → 사용자 화면 변화 없음. 사용자 보고 '삭제 버튼이 정상작동 안하네'.
  const removeTour = async (id) => {
    if (!(await window.BGNJ_CONFIRM('이 투어를 삭제하시겠어요? 시드 투어는 자동 숨김 처리(데이터 보존)됩니다. 관리자가 추가한 투어는 완전 삭제됩니다.', { danger: true }))) return;
    try {
      await window.BGNJ_TOURS.deleteTour(id);
      window.BGNJ_AUDIT?.log({ action: 'tour.remove', target: `tour:${id}` });
      try { window.BGNJ_BROADCAST?.publish?.('tours'); } catch (_e) { console.warn('[bgnj] AdminEventsPanels.jsx:751 오류(무시하고 진행)', _e); }
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error('투어 삭제 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };
  const toggleTourHidden = async (t) => {
    try {
      await window.BGNJ_TOURS.setHidden(t.id, !t.hidden);
      window.BGNJ_AUDIT?.log({ action: t.hidden ? 'tour.unhide' : 'tour.hide', target: `tour:${t.id}` });
      refresh();
    } catch (err) {
      window.BGNJ_TOAST.error('숨김 상태 변경 실패: ' + (err?.message || '알 수 없는 오류'));
    }
  };

  // v00.105 — 통합: 투어 페이지 콘텐츠 편집(글로벌/템플릿/per-tour) 을 본 패널 상단에 collapsible 로 내장.
  // 사용자 요청: '투어 프로그램과 투어 페이지는 연결되어야지'.
  const [showPageEditor, setShowPageEditor] = React.useState(false);

  return (
    <div>
      {/* 통합 페이지 콘텐츠 편집기 (collapsible) */}
      <div style={{marginBottom:18, border:'1px solid var(--line)', background:'var(--bg-2)'}}>
        <button type="button"
          onClick={() => setShowPageEditor((v) => !v)}
          style={{
            width:'100%', padding:'12px 16px', textAlign:'left',
            background:'transparent', border:'none', cursor:'pointer',
            fontSize:13, fontWeight:600, color:'var(--ink)',
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
          <span>📋 투어 페이지 콘텐츠 — 글로벌 답사 일정·준비물 / 템플릿 / 투어별 override</span>
          <span className="mono dim-2" style={{fontSize:11}}>{showPageEditor ? '▲ 닫기' : '▼ 펼치기'}</span>
        </button>
        {showPageEditor && (
          <div style={{padding:'14px 18px', borderTop:'1px solid var(--line)', background:'var(--bg)'}}>
            {TourPageEditorPanel ? <window.TourPageEditorPanel/> : <p className="dim">패널 로딩 중...</p>}
          </div>
        )}
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap', marginBottom:18}}>
        <p className="dim" style={{fontSize:13, lineHeight:1.8, margin:0, flex:1, minWidth:280}}>
          투어 정원 / 일정 / 가격을 수정하고, 신청자 입금을 확인해 참가를 확정합니다.
          결제는 현재 <strong className="gold">무통장 입금</strong>만 지원합니다(강연과 같은 계좌 사용).
        </p>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {tours.length === 0 && (
            <button type="button" className="btn btn-small" onClick={async () => {
              if (!(await window.BGNJ_CONFIRM('샘플 답사 3개를 추가합니다. 진행할까요?', { danger: true }))) return;
              const samples = [
                { title: '경복궁 — 왕의 일상', location: '경복궁 일대', host: '뱅기노자', durationMinutes: 180, capacity: 15, price: 30000, desc: '경복궁 외전·내전을 따라 왕의 하루를 좇는 답사.' },
                { title: '창덕궁 — 후원 산책', location: '창덕궁 후원', host: '뱅기노자', durationMinutes: 150, capacity: 12, price: 35000, desc: '비원의 절경과 함께하는 인문학 산책.' },
                { title: '북촌 — 한옥과 사람', location: '북촌 한옥마을', host: '뱅기노자', durationMinutes: 120, capacity: 10, price: 25000, desc: '북촌의 골목과 한옥에 담긴 이야기를 따라 걷습니다.' },
              ];
              const pad = (n) => String(n).padStart(2, '0');
              for (let i = 0; i < samples.length; i++) {
                const d = new Date(Date.now() + (i + 2) * 7 * 24 * 60 * 60 * 1000);
                const startsAt = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T10:00:00+09:00`;
                const next = `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} 10:00`;
                const sample = samples[i];
                await window.BGNJ_TOURS.saveTour({
                  id: `sample-tour-${Date.now()}-${i}`,
                  title: sample.title, level: '입문', duration: `${Math.round(sample.durationMinutes/60)}시간`,
                  group: `소그룹 (최대 ${sample.capacity}명)`, next, startsAt,
                  durationMinutes: sample.durationMinutes, capacity: sample.capacity,
                  priceNumber: sample.price, price: sample.price,
                  desc: sample.desc, location: sample.location, host: sample.host,
                });
              }
              refresh();
            }}>샘플 데이터 추가</button>
          )}
          <button type="button" className="btn btn-gold btn-small" onClick={addNewTour}>＋ 새 투어 추가</button>
        </div>
      </div>

      {tours.length === 0 ? (
        <div className="card dim" style={{padding:32, textAlign:'center'}}>관리할 투어가 없습니다.</div>
      ) : (
        <div style={{display:'grid', gap:14}}>
          {tours.map((t) => {
            const seats = window.BGNJ_TOURS.getSeats(t.id);
            const regs = window.BGNJ_TOURS.listReservations(t.id);
            const active = regs.filter((r) => r.status !== 'cancelled');
            const isEditing = editingId === t.id;
            return (
              <article key={t.id} className="card" style={{padding:20, opacity: t.hidden ? 0.55 : 1}}>
                <header style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:10}}>
                  <div>
                    <h3 className="ko-serif" style={{fontSize:18}}>
                      <span className="dim-2 mono" style={{fontSize:11, marginRight:8}}>#{String(t.id).padStart(2,'0')}</span>
                      {t.title}
                      {t.hidden && <span className="mono" style={{marginLeft:10, fontSize:10, letterSpacing:'0.18em', color:'var(--danger)', border:'1px solid var(--danger)', padding:'1px 6px', borderRadius:2}}>숨김</span>}
                    </h3>
                    <div className="mono dim-2" style={{fontSize:11, marginTop:4, letterSpacing:'0.12em'}}>
                      {t.next} · {t.duration} · {t.group} · {t.level}
                    </div>
                  </div>
                  <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color: seats.remaining <= 0 ? 'var(--danger)' : 'var(--primary)'}}>
                      잔여 {seats.remaining} / {seats.capacity}
                    </span>
                    {seats.waitlist > 0 && <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)'}}>대기 {seats.waitlist}</span>}
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.2em', color:'var(--ink-2)', border:'1px solid var(--line-2)', padding:'1px 6px'}}>
                      {window.BGNJ_FMT.won(t.priceNumber)}
                    </span>
                  </div>
                </header>

                {isEditing ? (
                  // v00.106 — 폼 재구성: 사용자 요청 순서. 표시 일정 문구 + startsAt 통합 (next 자동 derive).
                  <div style={{padding:'14px 0', borderTop:'1px solid var(--line)'}}>
                    {/* 그룹 1: 제목 / 부제 (full-width) */}
                    <div style={{display:'grid', gridTemplateColumns:'1fr', gap:10, marginBottom:10}}>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">투어명</label>
                        <input className="field-input" type="text"
                          value={draft.title || ''}
                          onChange={(e) => setDraft({ ...draft, title: e.target.value })}/>
                      </div>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">부제</label>
                        <input className="field-input" type="text" placeholder="예: 왕의 발자취를 따라"
                          value={draft.subtitle || ''}
                          onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}/>
                      </div>
                    </div>
                    {/* 그룹 2: 표시용 메타 (난이도 / 소요(표시) / 정원(표시)) */}
                    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:10}}>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">난이도</label>
                        <input className="field-input" type="text" placeholder="입문 / 심화"
                          value={draft.level || ''}
                          onChange={(e) => setDraft({ ...draft, level: e.target.value })}/>
                      </div>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">소요 (표시)</label>
                        <input className="field-input" type="text" placeholder="3시간"
                          value={draft.duration || ''}
                          onChange={(e) => setDraft({ ...draft, duration: e.target.value })}/>
                      </div>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">정원 (표시)</label>
                        <input className="field-input" type="text" placeholder="12인 이하"
                          value={draft.group || ''}
                          onChange={(e) => setDraft({ ...draft, group: e.target.value })}/>
                      </div>
                    </div>
                    {/* 그룹 3: 일정 (통합) — startsAt 만 입력. next 표시 문구는 자동 derive */}
                    <div style={{display:'grid', gridTemplateColumns:'1fr', gap:10, marginBottom:10}}>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">일정 (실제 시작 시간 — 표시 문구는 자동 생성)</label>
                        <input className="field-input" type="datetime-local"
                          value={draft.startsAt || ''}
                          onChange={(e) => setDraft({ ...draft, startsAt: e.target.value })}/>
                      </div>
                    </div>
                    {/* 그룹 4: 숫자 메타 (소요시간 / 정원 / 참가비) */}
                    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:10}}>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">소요 시간 (분)</label>
                        <input className="field-input" type="number" placeholder="180"
                          value={draft.durationMinutes ?? ''}
                          onChange={(e) => setDraft({ ...draft, durationMinutes: e.target.value })}/>
                      </div>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">정원 (숫자)</label>
                        <input className="field-input" type="number" placeholder="12"
                          value={draft.capacity ?? ''}
                          onChange={(e) => setDraft({ ...draft, capacity: e.target.value })}/>
                      </div>
                      <div className="field" style={{margin:0}}>
                        <label className="field-label">참가비 (원)</label>
                        <input className="field-input" type="number" placeholder="80000"
                          value={draft.priceNumber ?? ''}
                          onChange={(e) => setDraft({ ...draft, priceNumber: e.target.value })}/>
                      </div>
                    </div>
                    {/* 그룹 5: 설명 */}
                    <div className="field" style={{margin:0, marginBottom:10}}>
                      <label className="field-label">설명</label>
                      <textarea className="field-input" rows={3} value={draft.desc || ''}
                        onChange={(e) => setDraft({ ...draft, desc: e.target.value })}/>
                    </div>
                    {/* 그룹 6: 환불정책 */}
                    <div className="field" style={{margin:0, marginBottom:10}}>
                      <label className="field-label">환불정책</label>
                      <textarea className="field-input" rows={3} value={draft.refundPolicy || ''}
                        placeholder={'예: 출발 7일 전까지 100% 환불 / 3일 전까지 50% / 이후 환불 불가'}
                        onChange={(e) => setDraft({ ...draft, refundPolicy: e.target.value })}/>
                      <p className="dim-2" style={{fontSize:11, marginTop:4, lineHeight:1.5}}>
                        ⓘ 비우면 운영설정의 글로벌 환불정책 사용 (다음 사이클 도입 예정).
                      </p>
                    </div>
                    <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
                      <button type="button" className="btn btn-small" onClick={() => setEditingId(null)}>취소</button>
                      <button type="button" className="btn btn-gold btn-small" onClick={saveEdit}>저장</button>
                    </div>
                    <p className="dim-2" style={{fontSize:11, marginTop:8, lineHeight:1.6}}>
                      ※ 세부 일정 / 준비물 은 아래 <strong>📋 답사 일정·준비물·커버</strong> 버튼에서 편집 (진행 흐름 + 준비물 list + 커버 이미지).
                    </p>
                  </div>
                ) : (
                  <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:10, flexWrap:'wrap'}}>
                    <button type="button" className="btn btn-small btn-gold" onClick={() => startEdit(t)}>✎ 투어 정보 (제목·정원·난이도·소요시간·가격)</button>
                    <button type="button" className="btn btn-small" onClick={() => startContentEdit(t)}>📋 답사 일정·준비물·커버</button>
                    {/* v00.237 — 사진 갤러리 (포스터) 통합 편집. window.TourQuickAddModal 재사용. */}
                    <button type="button" className="btn btn-small" onClick={() => setGalleryEditTarget(t)}>🖼 사진 갤러리</button>
                    <button type="button" className="btn btn-small"
                      onClick={() => toggleTourHidden(t)}
                      style={{marginLeft:'auto'}}>
                      {t.hidden ? '👁 표시 복원' : '🙈 숨김 처리'}
                    </button>
                    <button type="button" className="btn btn-small" onClick={() => removeTour(t.id)}
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
                  </div>
                )}

                {/* v00.072 — 투어별 답사 일정·준비물·커버 inline 편집 (per-tour override) */}
                {contentEditingId === t.id && (
                  <section style={{marginTop:14, paddingTop:14, borderTop:'1px solid var(--line)'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10, flexWrap:'wrap', gap:8}}>
                      <div className="mono gold" style={{fontSize:11, letterSpacing:'0.22em'}}>이 투어의 답사 콘텐츠</div>
                      <div className="dim-2" style={{fontSize:10, fontStyle:'italic'}}>
                        비워두면 글로벌 답사 일정/준비물 (운영설정 → 투어 페이지) 사용. 커버 비면 placeholder.
                      </div>
                    </div>
                    {/* 커버 이미지 */}
                    <div className="card" style={{padding:12, marginBottom:12, display:'flex', gap:14, alignItems:'center'}}>
                      <div style={{width:96, height:60, flexShrink:0, border:'1px solid var(--line)', background:'var(--bg-2)', display:'grid', placeItems:'center', overflow:'hidden'}}>
                        {contentCover
                          ? <img src={contentCover} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                          : <span className="dim-2 mono" style={{fontSize:9, letterSpacing:'0.18em'}}>NONE</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', marginBottom:3}}>커버 이미지</div>
                        <div className="dim-2" style={{fontSize:11, lineHeight:1.5}}>1600×1000 권장 · 1.5MB 이하 · 비우면 placeholder.</div>
                      </div>
                      <div style={{display:'flex', gap:6}}>
                        <label className="btn btn-small" style={{cursor:'pointer'}}>
                          업로드
                          <input type="file" accept="image/*" onChange={onPickContentCover} style={{display:'none'}}/>
                        </label>
                        {contentCover && (
                          <button type="button" className="btn btn-small" onClick={() => setContentCover('')}
                            style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
                        )}
                      </div>
                    </div>
                    {/* 답사 일정 / 준비물 (TPE_* 헬퍼는 모듈 최상위 — 호이스팅 후 lookup) */}
                    <TPE_ScheduleEditor rows={contentSchedule}
                      onAdd={() => setContentSchedule((a) => _arrAdd(a, { t: '', l: '' }))}
                      onRemove={(i) => setContentSchedule((a) => _arrRemove(a, i))}
                      onUpdate={(i, k, v) => setContentSchedule((a) => { const n = a.slice(); n[i] = { ...n[i], [k]: v }; return n; })}
                      onMove={(i, d) => setContentSchedule((a) => _arrMove(a, i, d))}/>
                    <TPE_PrepEditor rows={contentPrep}
                      onAdd={() => setContentPrep((a) => _arrAdd(a, ''))}
                      onRemove={(i) => setContentPrep((a) => _arrRemove(a, i))}
                      onUpdate={(i, v) => setContentPrep((a) => _arrUpdate(a, i, v))}
                      onMove={(i, d) => setContentPrep((a) => _arrMove(a, i, d))}/>
                    <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:8}}>
                      {contentMsg && <span role="status" className="mono" style={{fontSize:11, color:'var(--secondary)', fontWeight:600, marginRight:'auto'}}>{contentMsg}</span>}
                      <button type="button" className="btn btn-small" onClick={cancelContentEdit}>닫기</button>
                      <button type="button" className="btn btn-gold btn-small" onClick={saveContentEdit}>저장</button>
                    </div>
                  </section>
                )}

                {/* Roster */}
                <section style={{marginTop:14, paddingTop:14, borderTop:'1px solid var(--line)'}}>
                  <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>참가자 명단 · {active.length}명</div>
                  {active.length === 0 ? (
                    <p className="dim" style={{fontSize:13}}>아직 신청자가 없습니다.</p>
                  ) : (
                    <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
                      <thead>
                        <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>이름</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>이메일</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>연락처</th>
                          <th scope="col" style={{padding:10, textAlign:'right'}}>인원</th>
                          <th scope="col" style={{padding:10, textAlign:'left'}}>상태</th>
                          <th scope="col" style={{padding:10, textAlign:'right'}}>액션</th>
                        </tr>
                      </thead>
                      <tbody>
                        {active.map((r) => (
                          <tr key={r.id} style={{borderBottom:'1px solid var(--line)'}}>
                            <td style={{padding:10}}>{r.name}</td>
                            <td className="mono dim-2" style={{padding:10, fontSize:11}}>{r.email}</td>
                            <td className="mono dim-2" style={{padding:10, fontSize:11}}>{r.phone || '-'}</td>
                            <td className="mono" style={{padding:10, textAlign:'right'}}>{r.count}</td>
                            <td className="mono" style={{padding:10, fontSize:10, letterSpacing:'0.18em', color:
                              r.status === 'confirmed' ? 'var(--primary)' :
                              r.status === 'waitlist' ? 'var(--ink-2)' :
                              r.status === 'pending_payment' ? 'var(--ink-2)' : 'var(--danger)'}}>
                              {r.status === 'pending_payment' ? '입금 대기' :
                                r.status === 'confirmed' ? '참가 확정' :
                                r.status === 'waitlist' ? '대기자' : r.status}
                              {r.paid && r.status === 'confirmed' && <span className="dim-2 mono" style={{marginLeft:6, fontSize:9}}>입금 ✓</span>}
                            </td>
                            <td style={{padding:10, textAlign:'right'}}>
                              <div style={{display:'flex', justifyContent:'flex-end', gap:6, flexWrap:'wrap'}}>
                                {r.status === 'pending_payment' && (
                                  <button type="button" className="btn btn-small"
                                    onClick={() => { window.BGNJ_TOURS.confirmPayment(t.id, r.id); refresh(); }}>
                                    입금 확인 → 확정
                                  </button>
                                )}
                                {r.status === 'confirmed' && r.price > 0 && (
                                  <button type="button" className="btn btn-small"
                                    onClick={() => { window.BGNJ_TOURS.unconfirmPayment(t.id, r.id); refresh(); }}>
                                    확정 취소
                                  </button>
                                )}
                                {r.status !== 'refund_requested' && (
                                  <button type="button" className="btn btn-small"
                                    onClick={async () => {
                                      if (!(await window.BGNJ_CONFIRM(`${r.name} 님 신청을 취소 처리하시겠어요?`, { danger: true }))) return;
                                      window.BGNJ_TOURS.cancelReservation(t.id, r.id);
                                      refresh();
                                    }}
                                    style={{borderColor:'var(--danger)', color:'var(--danger)'}}>취소</button>
                                )}
                                {r.status === 'refund_requested' && (
                                  <>
                                    <span className="mono" style={{fontSize:9, color:'var(--warning)', letterSpacing:'0.15em'}}>환불신청</span>
                                    {r.refundReason && <span className="dim-2" style={{fontSize:10}}>· {r.refundReason}</span>}
                                    <button type="button" className="btn btn-small"
                                      onClick={async () => { if (!(await window.BGNJ_CONFIRM('환불을 승인하시겠어요?', { danger: true }))) return; window.BGNJ_TOURS.approveRefund(t.id, r.id); refresh(); }}
                                      style={{borderColor:'var(--primary)', color:'var(--secondary)'}}>승인</button>
                                    <input className="field-input" placeholder="반려 사유"
                                      style={{padding:'4px 8px', fontSize:11, maxWidth:140}}
                                      value={refundRejectNotes[r.id] || ''}
                                      onChange={e => setRefundRejectNotes({...refundRejectNotes, [r.id]: e.target.value})}/>
                                    <button type="button" className="btn btn-small"
                                      onClick={async () => { if (!(await window.BGNJ_CONFIRM('환불 신청을 반려하시겠어요?', { danger: true }))) return; window.BGNJ_TOURS.rejectRefund(t.id, r.id, refundRejectNotes[r.id] || ''); refresh(); }}
                                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>반려</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              </article>
            );
          })}
        </div>
      )}
      {/* v00.237 — 사진 갤러리 모달. TourQuickAddModal 재사용. */}
      {galleryEditTarget && window.TourQuickAddModal && (
        <window.TourQuickAddModal
          onClose={() => setGalleryEditTarget(null)}
          onSaved={refresh}
          initialTour={galleryEditTarget}/>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────

// v00.286 ESM — 모듈 export (window 노출과 병행, 점진 전환).
export { LectureAdminPanel, TourAdminPanel };

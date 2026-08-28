// 커뮤니티: 목록 + 글 상세 + 글 작성 (Tiptap)
// 등급별 접근 제어: 읽기/쓰기 권한은 카테고리.minLevel / postMinLevel로 판정.

// 공용 훅 — 권한 계산
// v00.287 ESM (main) — cross-module import (전역 결합 제거).
import { AuthorGradeBadge } from '../components/Shell.jsx';
import { TiptapEditor } from '../components/TiptapEditor.jsx';

// v00.304.001 — 게시판의 말머리 목록.
//   설정에 등록된 것(declared)과 **글에 실제로 달린 것**을 합친다.
//   운영에서 글에는 말머리를 일괄 적용해 놓고 게시판 설정에는 등록하지 않은 상태가 나왔다.
//   그때 설정만 보면 말머리가 멀쩡히 붙은 글이 14편인데 필터도 선택지도 하나 안 뜬다.
//   순서는 설정을 먼저 따른다 — 운영자가 정한 차례가 화면 순서가 되도록.
//   v00.305 — 말머리는 이제 { name, tags } 정의다. 이름만 필요한 자리도 있고
//   태그까지 필요한 자리도 있어, 여기서는 정의를 통째로 돌려준다.
const mergeBoardPrefixes = (board, allPosts) => {
  if (!board) return [];
  const declared = window.BGNJ_PREFIX_DEFS(board);
  const declaredNames = declared.map((d) => d.name);
  const used = [];
  for (const p of (Array.isArray(allPosts) ? allPosts : [])) {
    if (p.categoryId !== board.id) continue;
    const pfx = String(p.prefix || '').trim();
    if (pfx && !used.includes(pfx)) used.push(pfx);
  }
  return [
    ...declared.filter((d) => used.includes(d.name)),
    // 설정에 없는데 글에만 달린 말머리 — 이름만 있고 딸린 태그는 없다.
    ...used.filter((n) => !declaredNames.includes(n)).map((name) => ({ name, tags: [] })),
  ];
};

const useUserLevel = (user) => React.useMemo(() => window.BGNJ_USER_LEVEL(user), [user]);
const getCategoriesForBoard = (boardType) =>
  window.BGNJ_STORES.categories.filter(c => c.boardType === boardType);

// === Hashtag chip input =================================================
// v00.306 — 기존 태그를 **쳐서 찾아 고를 수 있게** 했다.
//   자유 입력만 두면 같은 뜻이 '독립운동' · '독립운동사' · '독립 운동' 으로 갈려
//   태그로 묶어 보는 일이 성립하지 않는다. 후보는 window.BGNJ_TAG_SUGGEST 가 만든다
//   (실제 글에 붙은 태그 + 말머리 자동 태그, 많이 쓰인 순).
//   새 태그를 막지는 않는다 — 목록에 없으면 그냥 새로 만들어진다.
const HashtagInput = ({ tags, setTags, max = 10 }) => {
  const [input, setInput] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(-1);
  const inputRef = React.useRef(null);
  const blurTimer = React.useRef(null);

  React.useEffect(() => () => { if (blurTimer.current) clearTimeout(blurTimer.current); }, []);

  const suggestions = React.useMemo(
    () => (window.BGNJ_TAG_SUGGEST ? window.BGNJ_TAG_SUGGEST(input, { exclude: tags, limit: 8 }) : []),
    [input, tags]);

  const commit = (raw) => {
    const t = String(raw || '').trim().replace(/^#+/, '').replace(/\s+/g, '');
    if (!t) return;
    if (tags.includes(t)) return;
    if (tags.length >= max) { window.BGNJ_TOAST?.error?.(`태그는 ${max}개까지입니다.`); return; }
    setTags([...tags, t]);
  };

  const pick = (name) => { commit(name); setInput(''); setHover(-1); inputRef.current?.focus(); };

  const handleKey = (e) => {
    // 목록이 열려 있으면 ↑↓ 로 고르고 Enter 로 확정. 아무것도 안 고른 상태의 Enter 는
    // 예전처럼 '친 그대로' 를 넣는다 — 익숙한 손을 뺏지 않는다.
    if (open && suggestions.length && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setHover((h) => {
        const n = suggestions.length;
        return e.key === 'ArrowDown' ? (h + 1) % n : (h <= 0 ? n - 1 : h - 1);
      });
      return;
    }
    if (e.key === 'Escape') { setOpen(false); setHover(-1); return; }
    if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (e.key === 'Enter' && hover >= 0 && suggestions[hover]) { pick(suggestions[hover].name); return; }
      commit(input);
      setInput('');
      setHover(-1);
    } else if (e.key === 'Backspace' && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div style={{position:'relative'}}>
      <div className="tag-input-wrap" onClick={() => inputRef.current?.focus()}>
        {tags.map((t) => (
          <span key={t} className="tag-chip">
            #{t}
            <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}
              aria-label={`${t} 태그 삭제`}>✕</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); setHover(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          onBlur={() => {
            // 후보를 누르는 동작이 blur 보다 먼저 죽지 않도록 한 박자 늦춘다.
            blurTimer.current = setTimeout(() => {
              if (input.trim()) { commit(input); setInput(''); }
              setOpen(false); setHover(-1);
            }, 120);
          }}
          placeholder={tags.length ? "" : "태그 입력 후 스페이스바 (최대 10개)"}
          role="combobox" aria-expanded={open && suggestions.length > 0} aria-autocomplete="list"
          aria-label="해시태그 입력"/>
      </div>
      {open && suggestions.length > 0 && (
        <ul className="tag-suggest" role="listbox" aria-label="이미 쓰이고 있는 태그">
          {suggestions.map((sg, i) => (
            <li key={sg.name} role="option" aria-selected={i === hover}>
              <button type="button"
                className={i === hover ? 'is-hover' : undefined}
                onMouseEnter={() => setHover(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(sg.name)}>
                <span>#{sg.name}</span>
                <span className="mono dim-2">{sg.uses}편</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="field-hint" style={{marginTop:6}}>
        스페이스바 · Enter · 쉼표로 태그 구분 · Backspace로 마지막 태그 삭제 · {tags.length}/{max}
        {suggestions.length > 0 && <> · <span className="dim-2">이미 쓰이는 태그는 아래 목록에서 고르세요</span></>}
      </div>
    </div>
  );
};

// === Image Slider (viewer) ===============================================
const ImageSlider = ({ images, autoplayMs = 4000 }) => {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const prefersReduced = React.useMemo(() =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);

  React.useEffect(() => {
    if (images.length <= 1 || paused || prefersReduced) return;
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), autoplayMs);
    return () => clearInterval(t);
  }, [images.length, paused, autoplayMs, prefersReduced]);

  if (!images.length) return null;
  const go = (i) => setIdx(((i % images.length) + images.length) % images.length);

  return (
    <figure aria-roledescription="carousel" aria-label="첨부 이미지 슬라이드"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      {/* v00.260 — 사용자 보고 '이미지 비율을 임의로 잘라버리면 어떻게'. 기존 16:9
          고정 박스 → 원본 비율 유지 + 영역 초과 방지. translateX 카로셀에서 stacking
          (active 만 in-flow) + opacity 페이드 전환으로 변경 — 활성 슬라이드의 자연
          비율이 컨테이너 높이를 결정. */}
      <div className="img-slider">
        <div className="img-slider-track">
          {images.map((img, i) => (
            <div key={i} className={`img-slider-slide${i === idx ? ' is-active' : ''}`}
              role="group" aria-roledescription="slide" aria-label={`${i+1} / ${images.length}`}
              aria-hidden={i !== idx}>
              <img src={img.dataUrl || img.src} alt={img.alt || img.name || `이미지 ${i+1}`}/>
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" className="img-slider-nav prev" onClick={() => go(idx - 1)} aria-label="이전 이미지">‹</button>
            <button type="button" className="img-slider-nav next" onClick={() => go(idx + 1)} aria-label="다음 이미지">›</button>
            <div className="img-slider-caption">
              <span aria-live="polite">{idx + 1} / {images.length}</span>
            </div>
            <div className="img-slider-dots" role="tablist" aria-label="슬라이드 선택">
              {images.map((_, i) => (
                <button key={i} type="button" role="tab"
                  aria-current={i === idx}
                  aria-label={`${i+1}번 슬라이드`}
                  onClick={() => setIdx(i)}/>
              ))}
            </div>
          </>
        )}
      </div>
      {images[idx]?.caption && (
        <figcaption className="dim" style={{fontSize:12, marginTop:8, textAlign:'center'}}>
          {images[idx].caption}
        </figcaption>
      )}
    </figure>
  );
};

// === v00.264 — 첨부 이미지 블록 strip 헬퍼 ===============================
// 발행 시 본문 끝에 append 되는 <div data-bgnj-attached-block="1">…</div> 한 단위를
// 제거. 수정 라운드트립에서 본문에 이미지가 중복으로 누적되는 회귀 차단용.
// DOMParser 로 파싱 후 마커 div 만 제거 → 사용자가 본문에 inline 으로 직접 삽입한
// <img> 는 유지된다. DOMParser 실패 시 정규식 폴백.
const _stripAttachedBlock = (html) => {
  if (!html || typeof html !== 'string') return html || '';
  if (!html.includes('data-bgnj-attached-block')) return html;
  try {
    const doc = new DOMParser().parseFromString(`<div id="__root__">${html}</div>`, 'text/html');
    const root = doc.getElementById('__root__');
    if (!root) return html;
    root.querySelectorAll('[data-bgnj-attached-block="1"]').forEach((node) => node.remove());
    return root.innerHTML;
  } catch {
    return html.replace(/<div\s+data-bgnj-attached-block="1"[^>]*>[\s\S]*?<\/div>/gi, '');
  }
};

// v00.303 — 화면 쪽 한도. **서버 한도보다 같거나 엄격해야 한다.**
//   서버(workers/src/index.js): 제목 200자 · 본문 200,000자.
//   제목은 화면이 더 엄격하다(120자) — 원래 입력칸에 maxLength={120} 이 박혀 있던 값을
//   상수로 끌어올린 것이다. 화면이 더 엄격한 건 안전하다(거부당할 일이 없다).
//   반대로 화면이 느슨하면 '다 쓰고 저장 눌렀더니 거부' 가 된다 — 그게 본문에서 실제로 그랬다.
const POST_TITLE_MAX = 120;
const POST_BODY_MAX = 200000;

// === Image picker (editor side) — up to `max` images with thumbnails =====
const ImageAttacher = ({ images, setImages, max = 10, onBusyChange }) => {
  const inputRef = React.useRef(null);
  // v00.295.005 — 사진은 '고르는 순간' 이 아니라 '축소 확인 + 업로드가 끝난 뒤' 에야 목록에 들어간다.
  //   그 사이에 게시하기를 누르면 사진이 통째로 빠진 채 저장된다(실제로 그렇게 저장된 글이 나왔다).
  //   축소 확인창은 사람 대답을 기다리므로 이 틈이 몇 초가 아니라 얼마든지 길어진다.
  //   처리 중임을 부모에 알려 그동안 게시를 막는다.
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { onBusyChange?.(busy); }, [busy, onBusyChange]);

  const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    const remaining = max - images.length;
    if (remaining <= 0) return;
    setBusy(true);
    try {
    // v00.295.004 — 큰 사진은 올리기 전에 줄일지 물어본다. 한도를 넘는데 원본을 고집하면
    //   여기서 걸러지고 사용자에게 이유가 전달된다(예전엔 업로드 단계에서 그냥 실패했다).
    const { files: prepared } = await window.BGNJ_IMAGE_SHRINK.maybeShrinkAll(
      files.slice(0, remaining), { limitBytes: MAX_IMAGE_BYTES }
    );
    const toAdd = prepared;
    if (toAdd.length === 0) return;
    // v00.294.008 — dataURI(base64) 폴백 제거. schema-v11 로 이미지가 정식 컬럼에
    // 저장되기 시작했고, 서버는 base64 를 거부한다(글 하나가 수 MB 가 되어 목록 조회까지
    // 느려지기 때문). 업로드가 실패하면 조용히 우회하지 말고 그대로 알린다.
    const results = await Promise.all(toAdd.map(async (f) => {
      const meta = { name: f.name, size: f.size, alt: f.name.replace(/\.[^.]+$/, '') };
      try {
        const { url } = await window.BGNJ_MEDIA.uploadFile(f, { folder: 'post-images', maxBytes: MAX_IMAGE_BYTES });
        return { ...meta, dataUrl: url };
      } catch (err) {
        window.BGNJ_TOAST.error(uploadFailMessage(f.name, err));
        return null;
      }
    }));
    setImages([...images, ...results.filter(Boolean)]);
    } finally {
      setBusy(false);
    }
  };

  const remove = (i) => setImages(images.filter((_, j) => j !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = images.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <div className="field-label">
          첨부 이미지 <span className="dim-2">({images.length}/{max})</span>
          {busy && <span className="mono" style={{marginLeft:8, fontSize:11, color:'var(--secondary)'}}>사진 준비 중…</span>}
        </div>
        <button type="button" className="btn btn-small"
          disabled={busy || images.length >= max}
          onClick={() => inputRef.current?.click()}>
          {busy ? '준비 중…' : '+ 이미지 선택'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple
        style={{display:'none'}}
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}/>
      {images.length > 0 ? (
        <div className="img-thumbs">
          {images.map((img, i) => (
            <div key={i} className="img-thumb">
              <img src={img.dataUrl || img.src} alt={img.alt || `thumb-${i}`}/>
              <span className="img-thumb-order">{String(i + 1).padStart(2, '0')}</span>
              <button type="button" className="img-thumb-remove"
                onClick={() => remove(i)}
                aria-label={`${i+1}번 이미지 제거`}>✕</button>
              <div style={{position:'absolute', bottom:4, right:4, display:'flex', gap:2}}>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                  aria-label={`${i+1}번 이미지 앞으로`}
                  style={{background:'rgba(0,0,0,0.6)', border:'none', color:'var(--on-scrim)', fontSize:10, padding:'1px 5px', cursor:'pointer', minHeight:0}}>◀</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1}
                  aria-label={`${i+1}번 이미지 뒤로`}
                  style={{background:'rgba(0,0,0,0.6)', border:'none', color:'var(--on-scrim)', fontSize:10, padding:'1px 5px', cursor:'pointer', minHeight:0}}>▶</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="placeholder" style={{aspectRatio:'5/1', fontSize:10}}>
          이미지를 첨부하면 상세 페이지 하단에 자동 슬라이드로 표시됩니다
        </div>
      )}
    </div>
  );
};

// === File attacher (v00.069) — 비-이미지 파일 첨부, 10MB × 최대 3 ======
// 게시글에 attachments: [{ name, type, size, dataUrl }] 으로 저장. dataUrl 은 base64.
// 보관 한도가 작아 v1 은 D1 인라인 JSON. 추후 R2 업로드 흐름은 별도 사이클.
// v00.294 — 사용자 규칙: 최대 3개 · **3개를 합쳐** 10MB 이하.
// 이전엔 '개당 10MB' 라 최대 30MB 까지 올라갔다. 총량 기준으로 바꾼다.
const FILE_MAX_TOTAL = 10 * 1024 * 1024; // 합계 10MB
const FILE_MAX_SIZE = FILE_MAX_TOTAL;    // 단일 파일도 총량을 넘을 수 없다
const FILE_MAX_COUNT = 3;
const _fmtSize = (n) => {
  if (!n && n !== 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
};
const FileAttacher = ({ files, setFiles, max = FILE_MAX_COUNT, maxSize = FILE_MAX_SIZE, maxTotal = FILE_MAX_TOTAL, onBusyChange }) => {
  const inputRef = React.useRef(null);
  const [error, setError] = React.useState('');
  // v00.295.005 — 이미지와 같은 이유로 업로드가 끝나기 전 게시를 막는다.
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { onBusyChange?.(busy); }, [busy, onBusyChange]);
  const usedBytes = files.reduce((sum, f) => sum + (Number(f.size) || 0), 0);

  const handleFiles = async (fileList) => {
    setError('');
    const incoming = Array.from(fileList || []);
    const remaining = max - files.length;
    if (remaining <= 0) { setError(`첨부는 최대 ${max}개까지 가능합니다.`); return; }
    const accepted = [];
    // v00.294 — 총량 기준. 이미 담긴 용량 + 이번에 고른 파일들의 누적을 함께 본다.
    let running = usedBytes;
    for (const f of incoming.slice(0, remaining)) {
      if (f.size > maxSize) { setError(`'${f.name}' 은(는) ${_fmtSize(maxSize)} 초과 — 첨부 불가.`); continue; }
      if (running + f.size > maxTotal) {
        setError(`첨부 파일은 전부 합쳐 ${_fmtSize(maxTotal)} 이하여야 합니다 — '${f.name}' 은(는) 제외했습니다. (현재 ${_fmtSize(running)})`);
        continue;
      }
      running += f.size;
      accepted.push(f);
    }
    // v00.294.008 — dataURI(base64) 폴백 제거. 서버가 base64 첨부를 거부한다
    // (한 글이 수 MB 가 되어 목록 조회까지 느려진다). 실패는 조용히 우회하지 않고 알린다.
    if (accepted.length === 0) return;
    setBusy(true);
    try {
    const results = await Promise.all(accepted.map(async (f) => {
      const meta = { name: f.name, type: f.type || '', size: f.size };
      try {
        const { url } = await window.BGNJ_MEDIA.uploadFile(f, { folder: 'post-attachments', maxBytes: maxSize });
        return { ...meta, dataUrl: url };
      } catch (err) {
        setError(uploadFailMessage(f.name, err));
        return null;
      }
    }));
    setFiles([...files, ...results.filter(Boolean)]);
    } finally {
      setBusy(false);
    }
  };

  const remove = (i) => setFiles(files.filter((_, j) => j !== i));

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <div className="field-label">첨부 파일 <span className="dim-2">({files.length}/{max} · 합계 {_fmtSize(usedBytes)} / {_fmtSize(maxTotal)})</span></div>
        <button type="button" className="btn btn-small"
          disabled={files.length >= max || usedBytes >= maxTotal}
          onClick={() => inputRef.current?.click()}>
          + 파일 선택
        </button>
      </div>
      <input ref={inputRef} type="file" multiple
        style={{display:'none'}}
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}/>
      {error && (
        <div role="alert" style={{fontSize:11, color:'var(--danger)', marginBottom:8}}>{error}</div>
      )}
      {files.length > 0 ? (
        <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6}}>
          {files.map((f, i) => (
            <li key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 10px', border:'1px solid var(--line)', background:'var(--bg-2)', fontSize:12}}>
              <ClipMark size={13} />
              <span style={{flex:1, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{f.name}</span>
              <span className="mono dim-2" style={{fontSize:10}}>{_fmtSize(f.size)}</span>
              <button type="button" onClick={() => remove(i)} aria-label={`${f.name} 제거`}
                style={{background:'none', border:'none', color:'var(--danger)', fontSize:14, cursor:'pointer', padding:'2px 6px'}}>✕</button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="placeholder" style={{aspectRatio:'8/1', fontSize:10}}>
          PDF · DOCX · 이미지 외 자료를 최대 {max}개, 전부 합쳐 {_fmtSize(maxTotal)} 까지 첨부
          (게시글 본문 하단에 다운로드 링크로 표시)
        </div>
      )}
    </div>
  );
};

// v00.306.006 — 운영 오류 로그 실측: 세션이 끊긴 채 사진을 올리다 실패한 사람에게
//   '잠시 후 다시 시도해 주세요' 라고 안내하고 있었다(2026-08-21 4건). 아무리 기다려도 안 된다.
//   규칙 40-security §6 — 오류는 **사용자가 다음에 할 행동**까지 말해야 한다.
const uploadFailMessage = (name, err) => {
  const raw = String(err?.message || '알 수 없는 오류');
  if (/로그인|인증|401/.test(raw)) return `'${name}' 업로드 실패 — 로그인이 풀렸습니다. 다시 로그인한 뒤 올려 주세요.`;
  if (/\.heic|heif|지원하지 않는 파일/i.test(raw)) return `'${name}' 은(는) 올릴 수 없는 형식입니다. (${raw}) 아이폰 사진이라면 설정 › 카메라 › 포맷을 '높은 호환성' 으로 바꾸거나, 공유할 때 JPEG 로 저장해 올려 주세요.`;
  if (/용량|크기|too large|413/i.test(raw)) return `'${name}' 이(가) 너무 큽니다. (${raw}) 사진을 줄여서 올려 주세요.`;
  return `'${name}' 업로드 실패 — 잠시 후 다시 시도해 주세요. (${raw})`;
};

// === 표기 아이콘 ========================================================
// v00.306.003 — 사진·첨부를 이모지(📷 📎)로 그리고 있었다. 이모지는 **기기가 제 색으로
// 칠해 버리는 그림**이라, 잉크와 선으로만 이루어진 이 화면에서 혼자 색을 갖고 튀었다.
// 안드로이드·윈도우·맥이 서로 다른 그림을 그리는 것도 문제였다(모양을 우리가 못 정한다).
//
// 그래서 선으로 다시 그린다 — 1px 획, currentColor. 옆의 ★ ♥ 와 같은 무게로 앉고,
// 어느 기기에서나 같은 모양이 나오며, 다크 모드에서도 글자색을 그대로 따라간다.
const InlineMark = ({ d, size = 12, label }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden={label ? undefined : "true"} role={label ? "img" : undefined}
    style={{verticalAlign:'-2px', flexShrink:0}}>
    {label && <title>{label}</title>}
    {d}
  </svg>
);

// 사진 — 틀 + 지평선 + 해. 사진 한 장을 가장 적은 획으로 줄인 모양.
const PhotoMark = (props) => (
  <InlineMark {...props} d={<>
    <rect x="1.6" y="3" width="12.8" height="10" rx="1.4"/>
    <circle cx="5.6" cy="6.6" r="1.1"/>
    <path d="M2.2 11.4 L6 8.2 L9 10.6 L11.4 8.8 L13.8 10.8"/>
  </>}/>
);

// 첨부 — 클립. 고리 하나만 남긴다.
const ClipMark = (props) => (
  <InlineMark {...props} d={<>
    <path d="M10.6 4.2 L5.4 9.4a2.1 2.1 0 0 0 3 3l5.4-5.4a3.6 3.6 0 0 0-5.1-5.1L3.2 7.4a5 5 0 0 0 7 7l4.2-4.2"/>
  </>}/>
);

// === 목록을 못 불러온 것 ≠ 그런 글이 없는 것 =============================
// 2026-08-25, 사용자가 '해당 게시글을 찾을 수 없습니다' 화면을 보고 연락해 왔다.
// 글은 멀쩡히 있었다. listPosts() 가 **아직 못 불러왔을 때도 빈 배열**을 돌려주는 바람에
// 화면이 두 사건을 구분하지 못하고 '없는 글' 로 단정했던 것이다.
//
// 없는 글이라고 말해 버리면 사용자는 다시 시도할 생각을 못 한다 — 그래서 연락이 온다.
// 못 불러온 것이면 못 불러왔다고 말하고, 다시 시도할 길을 준다.
const ContentLoadNotice = ({ status, label = '게시글', message, onRetry, onBack, backLabel = '목록으로' }) => {
  const [busy, setBusy] = React.useState(false);
  const loading = status === 'loading';
  const retry = () => {
    if (busy) return;
    setBusy(true);
    try { onRetry?.(); } catch (e) { console.warn('[bgnj] 다시 불러오기 실패', e); }
    // 응답이 오면 상위가 다시 그린다. 버튼이 영원히 잠기지 않도록 풀어 준다.
    setTimeout(() => setBusy(false), 4000);
  };
  return (
    <div className="section">
      <div className="container" style={{maxWidth:760, textAlign:'center', padding:'80px 20px'}}>
        <p className="dim" style={{fontSize:14, marginBottom:8}}>
          {loading ? `${label} 목록을 불러오는 중입니다…` : `${label}을 불러오지 못했습니다.`}
        </p>
        <p className="dim-2" style={{fontSize:13, lineHeight:1.8, marginBottom:20}}>
          {loading
            ? '잠시만 기다려 주세요. 오래 걸리면 아래 버튼을 눌러 주세요.'
            : '글이 삭제된 것이 아니라, 연결이 잠시 끊긴 것입니다. 다시 시도해 주세요.'}
        </p>
        {!loading && message && (
          <p className="dim-2 mono" style={{fontSize:11, marginBottom:20, wordBreak:'break-all'}}>{message}</p>
        )}
        <div style={{display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap'}}>
          <button type="button" className="btn btn-gold btn-small" onClick={retry} disabled={busy}>
            {busy ? '불러오는 중…' : '다시 시도'}
          </button>
          <button type="button" className="btn btn-small" onClick={onBack}>{backLabel}</button>
        </div>
      </div>
    </div>
  );
};

// === Comment tree (다단계 답글, 최대 깊이 MAX_DEPTH) ======================
// @멘션은 본문에 @이름 토큰을 골드 chip 으로 렌더링.
// 답글 트리 — 시각적 들여쓰기 기본 캡(3). 그 이상은 자동 펼침/접기 토글로 노출.
const MAX_VISIBLE_DEPTH = 3;

const renderCommentText = (text) => {
  if (!text) return null;
  // @닉네임 토큰만 가볍게 강조(골드, medium). 본문은 평문 그대로.
  const parts = String(text).split(/(@[\p{L}\p{N}_]+)/gu);
  return parts.map((part, i) => {
    if (part.startsWith('@') && part.length > 1) {
      return <span key={i} className="gold" style={{fontWeight:500}}>{part}</span>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

// v00.307.000 — 정렬. 기본은 **최신순**(맨 위가 가장 새 댓글). '등록순' 으로 뒤집을 수 있다.
//   최상위와 답글에 **같은 규칙**을 쓴다 — 사용자 선택(2026-08-26): 답글도 최신이 위로.
//   서버는 여전히 created_at ASC 로 주고, 뒤집는 일은 여기서만 한다(서버 캐시·번들 모두 안전).
const sortComments = (list, sort) => {
  const t = (c) => { const n = Date.parse(c?.createdAt || ''); return Number.isFinite(n) ? n : 0; };
  return [...list].sort((a, b) => {
    const d = t(a) - t(b);
    if (d !== 0) return sort === 'old' ? d : -d;
    // 같은 시각이면 등록 순서(id)로 가른다 — 초가 겹쳐도 순서가 흔들리지 않게.
    const ia = Number(a?.id), ib = Number(b?.id);
    if (Number.isFinite(ia) && Number.isFinite(ib)) return sort === 'old' ? ia - ib : ib - ia;
    return 0;
  });
};

// v00.307.000 — 댓글 정렬 전환 버튼. 게시글·칼럼 양쪽이 같은 것을 쓴다.
const CommentSortToggle = ({ value, onChange }) => (
  <span style={{display:'inline-flex', gap:4, alignItems:'center', marginLeft:12, verticalAlign:'middle'}}>
    {[{ k:'new', label:'최신순' }, { k:'old', label:'등록순' }].map((o) => (
      <button key={o.k} type="button" className="btn-ghost mono"
        onClick={() => onChange?.(o.k)}
        aria-pressed={value === o.k}
        style={{
          fontSize:11, padding:'3px 9px', letterSpacing:'0.08em',
          color: value === o.k ? 'var(--primary)' : 'var(--ink-3)',
          border: `1px solid ${value === o.k ? 'var(--primary-dim)' : 'var(--line)'}`,
        }}>
        {o.label}
      </button>
    ))}
  </span>
);

const CommentTree = ({ comments, user, onDelete, onReply, onLike, sort = 'new' }) => {
  const all = Array.isArray(comments) ? comments : [];
  const topLevel = sortComments(all.filter((c) => !c.parentId), sort);
  const repliesOf = (parentId) => sortComments(all.filter((c) => c.parentId === parentId), sort);
  const [openReplyTo, setOpenReplyTo] = React.useState(null);
  const [draft, setDraft] = React.useState('');

  // 멘션 자동완성 — 댓글 작성자 + 글 댓글에 등장한 모든 닉네임을 후보로.
  const allAuthors = React.useMemo(() => {
    const seen = new Set();
    return (comments || [])
      .map((c) => c.author)
      .filter((n) => n && !seen.has(n) && (seen.add(n) || true));
  }, [comments]);

  const submitReply = (parentId) => {
    onReply?.(parentId, draft);
    setDraft('');
    setOpenReplyTo(null);
  };

  // 깊이 제한을 풀고 (서버는 무제한 허용), 시각만 MAX_VISIBLE_DEPTH 까지 들여쓰기.
  const [expanded, setExpanded] = React.useState({}); // commentId -> true (사용자 펼침 클릭)
  const renderItem = (c, depth = 0) => {
    const children = repliesOf(c.id);
    const canReply = !!user; // 깊이 무관 답글 허용
    const visualDepth = Math.min(depth, MAX_VISIBLE_DEPTH);
    const isDeepCollapsed = depth >= MAX_VISIBLE_DEPTH && !expanded[c.id] && children.length > 0;
    return (
      <li key={c.id} style={{padding:'18px 0', borderBottom: depth === 0 ? '1px solid var(--line)' : 'none'}}>
        <div style={{display:'flex', gap:16, alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
          <div style={{display:'flex', gap:14, alignItems:'center', flexWrap:'wrap'}}>
            {depth > 0 && <span className="dim-2 mono" style={{fontSize:11}}>↳</span>}
            <span className="gold mono" style={{fontSize:12, letterSpacing:'0.1em', display:'inline-flex', alignItems:'center'}}>
              {c.author}
              <AuthorGradeBadge authorId={c.authorId} author={c.author} authorEmail={c.authorEmail}/>
            </span>
            <time className="mono dim-2" style={{fontSize:11}}>{c.date}</time>
          </div>
          <div style={{display:'flex', gap:6, alignItems:'center'}}>
            {/* v00.307.000 — 공감. 로그인해야 누를 수 있고, 비로그인에게는 숫자만 보인다. */}
            {user ? (
              <button type="button" className="btn-ghost"
                onClick={() => onLike?.(c.id)}
                aria-pressed={!!c.liked}
                aria-label={c.liked ? '공감 취소' : '공감'}
                style={{
                  fontSize:11, display:'inline-flex', alignItems:'center', gap:4,
                  color: c.liked ? 'var(--primary)' : 'var(--ink-2)',
                }}>
                <span aria-hidden="true">{c.liked ? '♥' : '♡'}</span>
                공감{Number(c.likeCount) > 0 ? ` ${c.likeCount}` : ''}
              </button>
            ) : (
              Number(c.likeCount) > 0 && (
                <span className="dim-2" style={{fontSize:11, display:'inline-flex', alignItems:'center', gap:4}}>
                  <span aria-hidden="true">♡</span>공감 {c.likeCount}
                </span>
              )
            )}
            {canReply && (
              <button type="button" className="btn-ghost"
                onClick={() => {
                  setOpenReplyTo(openReplyTo === c.id ? null : c.id);
                  setDraft(openReplyTo === c.id ? '' : `@${c.author} `);
                }}
                style={{fontSize:11, color:'var(--ink-2)'}}>
                {openReplyTo === c.id ? '취소' : '답글'}
              </button>
            )}
            {!!user && (user.isAdmin || c.authorId === user.id || c.author === user.name) && (
              <button type="button" className="btn-ghost" onClick={() => onDelete?.(c.id)}
                style={{fontSize:11, color:'var(--danger)'}}>삭제</button>
            )}
          </div>
        </div>
        <p style={{fontFamily:'var(--font-reading)', fontSize: depth > 0 ? 14 : 15, lineHeight:1.8, color:'var(--ink)', whiteSpace:'pre-wrap'}}>
          {renderCommentText(c.text)}
        </p>

        {/* 답글 입력 폼 */}
        {openReplyTo === c.id && (
          <form onSubmit={(e) => { e.preventDefault(); submitReply(c.id); }}
            style={{marginTop:10, paddingLeft:24, borderLeft:'2px solid var(--primary-dim)'}}>
            <MentionTextarea
              value={draft}
              onChange={setDraft}
              authors={allAuthors}
              rows={2}
              placeholder={`@${c.author}에게 답글... (@를 입력하면 멘션 자동완성)`}
              style={{marginBottom:8}}/>
            <div style={{display:'flex', justifyContent:'flex-end', gap:6}}>
              <button type="button" className="btn btn-small" onClick={() => { setOpenReplyTo(null); setDraft(''); }}>취소</button>
              <button type="submit" className="btn btn-gold btn-small" disabled={!draft.trim()}>답글 등록</button>
            </div>
          </form>
        )}

        {/* 자식 답글들 — 깊이 캡 도달 전까지 재귀, 도달 후엔 '펼치기' 토글 */}
        {children.length > 0 && (
          isDeepCollapsed ? (
            <button type="button" className="btn-ghost"
              onClick={() => setExpanded((s) => ({ ...s, [c.id]: true }))}
              style={{
                marginTop:10, marginLeft:24, fontSize:11, color:'var(--ink-3)',
                padding:'4px 10px', border:'1px dashed var(--line)',
              }}>
              ↳ 답글 {children.length}개 펼치기
            </button>
          ) : (
            <ol style={{
              listStyle:'none', padding:0,
              margin: depth < MAX_VISIBLE_DEPTH ? '12px 0 0 24px' : '12px 0 0 12px',
              borderLeft:'2px solid var(--line)', paddingLeft:14,
            }}>
              {children.map((r) => renderItem(r, depth + 1))}
              {depth >= MAX_VISIBLE_DEPTH && (
                <li>
                  <button type="button" className="btn-ghost"
                    onClick={() => setExpanded((s) => ({ ...s, [c.id]: false }))}
                    style={{fontSize:11, color:'var(--ink-3)', padding:'4px 10px'}}>
                    ↑ 답글 접기
                  </button>
                </li>
              )}
            </ol>
          )
        )}
      </li>
    );
  };

  return (
    <ol style={{listStyle:'none', padding:0, margin:0}}>
      {topLevel.map((c) => renderItem(c, 0))}
    </ol>
  );
};

// === @멘션 자동완성 textarea =============================================
// 사용자가 @을 입력하면 후보 리스트를 띄우고, 클릭/Enter 로 닉네임을 삽입.
const MentionTextarea = ({ value, onChange, authors, rows = 4, placeholder, style }) => {
  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [active, setActive] = React.useState(0);

  const candidates = React.useMemo(() => {
    if (!open) return [];
    const q = token.toLowerCase();
    return (authors || [])
      .filter((a) => !q || a.toLowerCase().includes(q))
      .slice(0, 6);
  }, [authors, token, open]);

  const detectMention = (text, caret) => {
    // 캐럿 직전에서 가장 가까운 @를 찾고, @ 다음 문자가 공백/줄바꿈이 아닌지 확인.
    const upto = text.slice(0, caret);
    const m = /@([\p{L}\p{N}_]*)$/u.exec(upto);
    if (m) { setToken(m[1]); setOpen(true); setActive(0); }
    else { setOpen(false); setToken(''); }
  };

  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    detectMention(v, e.target.selectionStart || v.length);
  };

  const insertCandidate = (name) => {
    const el = ref.current;
    const caret = el?.selectionStart ?? value.length;
    const before = value.slice(0, caret);
    const after = value.slice(caret);
    const replaced = before.replace(/@([\p{L}\p{N}_]*)$/u, `@${name} `);
    const next = replaced + after;
    onChange(next);
    setOpen(false);
    setToken('');
    // 캐럿을 삽입 끝으로 이동
    setTimeout(() => {
      try {
        const pos = replaced.length;
        el?.focus();
        el?.setSelectionRange(pos, pos);
      } catch (_e) { console.warn('[bgnj] 스크롤·포커스 (CommunityPage.jsx:491)', _e); }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (!open || candidates.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % candidates.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + candidates.length) % candidates.length); }
    else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); insertCandidate(candidates[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div style={{position:'relative'}}>
      <textarea ref={ref} className="field-input" rows={rows}
        value={value} onChange={handleChange} onKeyDown={handleKeyDown}
        placeholder={placeholder} style={style}/>
      {open && candidates.length > 0 && (
        <ul role="listbox" aria-label="멘션 후보"
          style={{
            position:'absolute', zIndex:50, top:'100%', left:0, marginTop:2,
            background:'var(--bg)', border:'1px solid var(--line)',
            listStyle:'none', padding:4, minWidth:180, maxWidth:280,
            boxShadow:'0 4px 12px rgba(0,0,0,0.08)',
          }}>
          {candidates.map((name, i) => (
            <li key={name} role="option" aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); insertCandidate(name); }}
              style={{
                padding:'6px 10px', fontSize:13, cursor:'pointer',
                background: i === active ? 'rgba(245,213,72,0.12)' : 'transparent',
                color: i === active ? 'var(--primary)' : 'var(--ink)',
              }}>
              @{name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// === Community Page ======================================================
// v00.264.003 — 한 페이지 게시글 갯수 사용자 선택. 기본 10, 옵션 10/30/50/100.
const POSTS_PER_PAGE_OPTIONS = [10, 30, 50, 100];
const POSTS_PER_PAGE_LS_KEY = 'bgnj_community_posts_per_page';
const POSTS_PER_PAGE_DEFAULT = 10;

const CommunityPage = ({ go, postId, setPostId, user }) => {
  const userLevel = useUserLevel(user);
  // v00.294 — 게시판 목록은 부팅 시 DEFAULT 스냅샷 → 서버(D1) 응답으로 교체된다.
  // 교체를 구독하지 않으면 첫 렌더의 DEFAULT 를 계속 써서 탭이 모자라게 보인다.
  const [catVersion, setCatVersion] = React.useState(0);
  React.useEffect(() => {
    const onCats = () => setCatVersion((v) => v + 1);
    window.addEventListener('bgnj-categories-refresh', onCats);
    return () => window.removeEventListener('bgnj-categories-refresh', onCats);
  }, []);
  const categories = React.useMemo(() => getCategoriesForBoard("community"), [postId, catVersion]);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [tab, setTab] = React.useState("all");
  const [activePrefix, setActivePrefix] = React.useState("");
  // v00.304 — 시리즈 모음 정적 페이지에서 넘어온 말머리를 잠시 들고 있는 자리.
  //   게시판(tab)이 바뀌면 말머리 필터를 지우게 돼 있어서(아래 useEffect), 그냥 두 값을
  //   함께 세팅하면 게시판이 바뀌는 순간 말머리가 조용히 사라진다. ref 로 한 박자 넘긴다.
  const pendingPrefixRef = React.useRef(null);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("latest");
  const [writing, setWriting] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [postsPerPage, setPostsPerPageState] = React.useState(() => {
    try {
      const v = Number(localStorage.getItem(POSTS_PER_PAGE_LS_KEY));
      return POSTS_PER_PAGE_OPTIONS.includes(v) ? v : POSTS_PER_PAGE_DEFAULT;
    } catch { return POSTS_PER_PAGE_DEFAULT; }
  });
  const setPostsPerPage = (n) => {
    setPostsPerPageState(n);
    try { localStorage.setItem(POSTS_PER_PAGE_LS_KEY, String(n)); } catch (_e) { console.warn('[bgnj] CommunityPage.jsx:565 오류(무시하고 진행)', _e); }
    setPage(1);
  };

  // 알림 벨 / 외부 진입에서 stash해 둔 postId가 있으면 자동으로 상세로 이동
  React.useEffect(() => {
    let pending = null;
    try { pending = sessionStorage.getItem('bgnj_pending_post_id'); } catch (_e) { console.warn('[bgnj] 저장소 읽기 — 실패 시 기본값 (CommunityPage.jsx:572)', _e); }
    if (pending) {
      try { sessionStorage.removeItem('bgnj_pending_post_id'); } catch (_e) { console.warn('[bgnj] 저장소 정리 (CommunityPage.jsx:574)', _e); }
      setPostId(pending);
    }
    // 내비 메가메뉴에서 들어온 게시판 ID
    let pendingBoard = null;
    try { pendingBoard = sessionStorage.getItem('bgnj_pending_board_id'); } catch (_e) { console.warn('[bgnj] 저장소 읽기 — 실패 시 기본값 (CommunityPage.jsx:579)', _e); }
    if (pendingBoard) {
      try { sessionStorage.removeItem('bgnj_pending_board_id'); } catch (_e) { console.warn('[bgnj] 저장소 정리 (CommunityPage.jsx:581)', _e); }
      setTab(pendingBoard);
    }
    // v00.304 — 시리즈 모음 정적 페이지에서 들어온 말머리. setTab 뒤에 놓아야
    //   tab 변경 → 말머리 초기화 순서에 먹히지 않는다.
    let pendingPrefix = null;
    try { pendingPrefix = sessionStorage.getItem('bgnj_pending_prefix'); } catch (_e) { console.warn('[bgnj] 저장소 읽기 — 실패 시 전체 목록 (CommunityPage.jsx)', _e); }
    if (pendingPrefix) {
      try { sessionStorage.removeItem('bgnj_pending_prefix'); } catch (_e) { console.warn('[bgnj] 저장소 정리 (CommunityPage.jsx)', _e); }
      pendingPrefixRef.current = pendingPrefix;
      setActivePrefix(pendingPrefix);
    }
  }, []);

  // 서버 게시글 동기화 — 페이지 진입 시 1회 + 'bgnj-posts-refresh' 이벤트마다 재렌더
  // v00.194 — 사용자 보고 '커뮤니티 게시글 안 불러짐'. visibilitychange 재시도 + 실패 시 에러 표시.
  const [loadError, setLoadError] = React.useState(null);
  React.useEffect(() => {
    window.BGNJ_COMMUNITY.refreshPosts?.();
    const onRefresh = () => { setLoadError(null); setRefreshKey((v) => v + 1); };
    const onError = (e) => setLoadError(e?.detail?.message || '서버에서 게시글을 불러오지 못했습니다.');
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      // 캐시 비어있으면 재시도. 이미 로드된 경우는 stale 회피 위해 그대로.
      if (!window.BGNJ_COMMUNITY._serverLoaded) window.BGNJ_COMMUNITY.refreshPosts?.();
    };
    window.addEventListener('bgnj-posts-refresh', onRefresh);
    window.addEventListener('bgnj-posts-refresh-error', onError);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('bgnj-posts-refresh', onRefresh);
      window.removeEventListener('bgnj-posts-refresh-error', onError);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const G = window.BGNJ_GUARD;
  const allPosts = React.useMemo(() => G.arr(() => window.BGNJ_COMMUNITY?.listPosts?.()), [refreshKey]);

  // ─── 모든 hook은 early return 전에 선언 ───────────────────────────────
  const visibleCats = categories.filter(c => userLevel >= (c.minLevel ?? 0));
  const currentBoard = categories.find(c => c.id === tab);
  const boardPrefixes = React.useMemo(
    () => mergeBoardPrefixes(currentBoard, allPosts), [currentBoard, allPosts]);
  const canReadPost = React.useCallback((post) => {
    if (!post) return false;
    const cat = categories.find(c => c.id === post.categoryId) || categories.find(c => c.label === post.category);
    return !cat || userLevel >= (cat.minLevel ?? 0);
  }, [categories, userLevel]);

  React.useEffect(() => {
    // v00.304 — 게시판을 바꾸면 말머리 필터를 지운다(게시판마다 말머리가 다르므로).
    //   단, 시리즈 모음 페이지에서 막 들어온 경우는 그 말머리를 지키고 한 번만 통과시킨다.
    if (pendingPrefixRef.current) {
      setActivePrefix(pendingPrefixRef.current);
      pendingPrefixRef.current = null;
      return;
    }
    setActivePrefix("");
  }, [tab]);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    const base = allPosts.filter(p => {
      const cat = categories.find(c => c.id === p.categoryId) || categories.find(c => c.label === p.category);
      if (cat && userLevel < (cat.minLevel ?? 0)) return false;
      if (tab !== "all" && (p.categoryId !== tab && cat?.id !== tab)) return false;
      // v00.296.002 — 목록에는 본문이 오지 않는다(발췌만). 이미 상세를 열어 본문이 채워진
      //   글은 전문으로, 아직 안 연 글은 발췌로 찾는다. 둘 다 보는 이유는
      //   목록 검색이 조용히 제목 검색으로 쪼그라들지 않게 하기 위해서다.
      if (q) {
        const hay = `${p.title || ''} ${p.body?.text || ''} ${p.excerpt || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (activePrefix && p.prefix !== activePrefix) return false;
      return true;
    });
    if (sort === "views") return [...base].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    if (sort === "replies") return [...base].sort((a, b) => (b.replies ?? 0) - (a.replies ?? 0));
    if (sort === "likes") return [...base].sort((a, b) => (Array.isArray(b.likes) ? b.likes.length : 0) - (Array.isArray(a.likes) ? a.likes.length : 0));
    return base;
  }, [allPosts, categories, userLevel, tab, search, sort, activePrefix]);

  React.useEffect(() => { setPage(1); }, [tab, search, sort, activePrefix]);

  // v00.170 — 상세 진입 시 body 가 비어있으면 단일 post 조회로 보강.
  // 워커 list 응답이 body 컬럼을 SELECT 하지 않던 구버전 환경 호환.
  React.useEffect(() => {
    if (!postId) return;
    const post = allPosts.find((p) => String(p.id) === String(postId));
    if (!post) return;
    if (post.body && (post.body.html || post.body.text)) return;
    let alive = true;
    (async () => {
      try {
        await window.BGNJ_COMMUNITY?._hydratePostBody?.(postId);
        if (alive) setRefreshKey((v) => v + 1);
      } catch (_e) { console.warn('[bgnj] CommunityPage.jsx:653 오류(무시하고 진행)', _e); }
    })();
    return () => { alive = false; };
  }, [postId]);
  // ─────────────────────────────────────────────────────────────────────

  // v00.068 — PostCompose 모달 wrapper. 목록 위에 모달로 표시. ESC/외부클릭 시 useModalGuard 가 임시저장 prompt.
  // v00.263.003 — 사용자 보고: 임시저장된 글이 어디 있는지 안 보임 + 취소 동선 불명확. onSaveDraft 연결 →
  // 외부클릭/ESC 시 [임시저장]/[취소] prompt (이전엔 [닫기]/[취소] 변경 폐기 prompt). 임시저장은 BGNJ_DRAFTS('post')
  // 에 누적 (최대 5개). PostCompose 헤더에 목록 UI 노출 + 클릭 시 불러오기.
  const PostComposeModal = ({ onClose }) => {
    const [draftPayload, setDraftPayload] = React.useState(null);
    const draftIdRef = React.useRef(null);
    const guard = window.useModalGuard?.({
      open: true,
      dirty: true,
      onClose,
      onSaveDraft: () => {
        if (!draftPayload) return;
        try {
          const saved = window.BGNJ_DRAFTS?.save?.({
            id: draftIdRef.current || undefined,
            kind: 'post',
            title: draftPayload.title || '',
            prefix: draftPayload.prefix || '',
            tags: draftPayload.tags || [],
            images: draftPayload.images || [],
            attachments: draftPayload.attachments || [],
            bodyHtml: draftPayload.bodyHtml || '',
            bodyText: draftPayload.bodyText || '',
            categoryId: draftPayload.categoryId || '',
          });
          if (saved?.id) draftIdRef.current = saved.id;
          window.BGNJ_TOAST?.success?.('임시저장됐습니다. (글쓰기 모달 상단에서 확인)');
        } catch (err) {
          try { window.BGNJ_TOAST?.error?.('임시저장 실패: ' + (err?.message || err)); } catch (_e) { console.warn('[bgnj] CommunityPage.jsx:688 오류(무시하고 진행)', _e); }
        }
      },
      label: '게시글',
    }) || {};
    return (
      <div role="dialog" aria-modal="true" aria-label={writing === true ? '새 글 작성' : '게시글 수정'}
        onClick={guard.onBackdropClick}
        style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'grid', placeItems:'start center', padding:24, overflowY:'auto'}}>
        <div onClick={(e) => e.stopPropagation()} style={{
          width:'min(1100px, 100%)', background:'var(--bg)', boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
          padding:24, marginTop:24, marginBottom:48,
        }}>
          <PostCompose
            key={writing === true ? "new" : String(writing.id)}
            user={user}
            initialPost={writing === true ? null : writing}
            onCancel={onClose}
            onPayloadChange={setDraftPayload}
            onPublish={async (payload) => {
              // 발행 성공 시 임시저장 목록에서 제거.
              try { if (draftIdRef.current) window.BGNJ_DRAFTS?.remove?.(draftIdRef.current); } catch (_e) { console.warn('[bgnj] CommunityPage.jsx:709 오류(무시하고 진행)', _e); }
              let savedPost;
              try {
                savedPost = writing === true
                  ? await window.BGNJ_COMMUNITY.createPostRemote(payload)
                  : await window.BGNJ_COMMUNITY.updatePostRemote(writing.id, payload);
              } catch (err) {
                // v00.306.006 — 예전엔 조용히 로컬 폴백만 하고 창을 닫았다.
                //   새 글은 로컬에 남아 다시 올릴 길이 있지만, **이미 서버에 있는 글의 수정**은
                //   로컬 폴백이 아무 의미가 없다 — 저장 안 된 채 '저장됨' 으로 보였다.
                //   글을 잃지 않도록 창을 닫지 않고, 무슨 일이 났는지 알린다.
                if (writing === true) {
                  savedPost = window.BGNJ_COMMUNITY.createPost(payload);
                  window.BGNJ_TOAST?.error?.(`서버 저장 실패 — 이 기기에만 임시 보관했습니다: ${err?.message || '알 수 없는 오류'}`);
                } else {
                  window.BGNJ_TOAST?.error?.(`수정 저장 실패: ${err?.message || '알 수 없는 오류'} — 창을 닫지 않았습니다. 다시 시도해 주세요.`);
                  return;
                }
              }
              onClose();
              setRefreshKey((value) => value + 1);
              if (savedPost) setPostId(savedPost.id);
            }}
            categories={categories}
            userLevel={userLevel}
          />
        </div>
      </div>
    );
  };

  // v00.279 — 상세뷰 early-return 은 아래 모든 hook 선언 뒤로 이동 (React error #300 fix).
  // postId 분기가 hook 위에 있으면 목록↔상세 전환 시 실행 hook 수가 달라져 크래시.

  const totalPages = Math.max(1, Math.ceil(filtered.length / postsPerPage));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * postsPerPage;
  const pagePosts = filtered.slice(pageStart, pageStart + postsPerPage);

  // v00.264 — admin 전용 게시글 순서 변경 (▲ 위로 / ▼ 아래로). 정렬이 'latest'
  // 일 때만 활성 (다른 정렬은 createdAt 와 무관). 인접 두 항목 사이의 createdAt
  // 중간값으로 재배치 → 별도 sortOrder 컬럼/워커 배포 없이 즉시 적용.
  const isAdminUser = !!(user?.isAdmin || user?.gradeId === 'admin');
  const canRenumber = isAdminUser && sort === 'latest';
  const [movingPostId, setMovingPostId] = React.useState(null);
  const handleMovePost = React.useCallback(async (post, direction) => {
    if (movingPostId) return;
    const idx = filtered.findIndex((p) => String(p.id) === String(post.id));
    if (idx < 0) return;
    // latest 정렬 = createdAt desc. 위 = 더 최신 = 더 큰 createdAt.
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === filtered.length - 1) return;
    // 이동 후 idx 와 그 양쪽 (자기 자신 제외).
    const others = filtered.filter((_, i) => i !== idx);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newer = targetIdx > 0 ? others[targetIdx - 1] : null;     // 위 항목 (더 큰 ms)
    const older = targetIdx < others.length ? others[targetIdx] : null; // 아래 항목 (더 작은 ms)
    const toMs = (p) => {
      const v = p?.createdAt || p?.date || '';
      const t = Date.parse(v);
      return Number.isFinite(t) ? t : NaN;
    };
    const newerMs = newer ? toMs(newer) : NaN;
    const olderMs = older ? toMs(older) : NaN;
    let targetMs;
    if (newer && older && Number.isFinite(newerMs) && Number.isFinite(olderMs) && newerMs > olderMs) {
      const gap = newerMs - olderMs;
      targetMs = gap > 2000 ? Math.floor((newerMs + olderMs) / 2) : olderMs + Math.max(1, Math.floor(gap / 2));
    } else if (!newer && older && Number.isFinite(olderMs)) {
      // 최상단으로.
      targetMs = olderMs + 1000;
    } else if (newer && !older && Number.isFinite(newerMs)) {
      // 최하단으로.
      targetMs = newerMs - 1000;
    } else {
      targetMs = Date.now();
    }
    const iso = new Date(targetMs).toISOString();
    setMovingPostId(post.id);
    try {
      await window.BGNJ_COMMUNITY.updatePostRemote(post.id, { createdAt: iso });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      window.BGNJ_TOAST?.error?.(`순서 변경 실패: ${err?.message || '알 수 없는 오류'}`);
    } finally {
      setMovingPostId(null);
    }
  }, [filtered, movingPostId]);

  // v00.264.002 — 일괄 순서 편집 모드. admin · sort=latest 전용. 현재 페이지 내 게시글을
  // 드래그앤드롭으로 자유 재배치 → '저장' 시 위/아래 anchor 사이에 createdAt 균등 분배.
  const [reorderMode, setReorderMode] = React.useState(false);
  const [localOrderIds, setLocalOrderIds] = React.useState([]);
  const [draggingId, setDraggingId] = React.useState(null);
  const [savingOrder, setSavingOrder] = React.useState(false);
  // 정렬/검색/페이지/탭 변경 시 편집 모드 자동 종료 — stale 상태 방지.
  React.useEffect(() => {
    if (reorderMode) {
      setReorderMode(false);
      setLocalOrderIds([]);
      setDraggingId(null);
    }
  }, [tab, sort, activePrefix, search, safePage]); // eslint-disable-line react-hooks/exhaustive-deps
  const enterReorderMode = () => {
    setLocalOrderIds(pagePosts.map((p) => String(p.id)));
    setReorderMode(true);
  };
  const exitReorderMode = async () => {
    const changed = localOrderIds.some((id, i) => String(pagePosts[i]?.id) !== String(id));
    if (changed) {
      const ok = await window.BGNJ_CONFIRM('저장하지 않은 순서 변경이 있습니다. 취소하시겠어요?', { danger: true, confirmLabel: '취소' });
      if (!ok) return;
    }
    setReorderMode(false);
    setLocalOrderIds([]);
    setDraggingId(null);
  };
  const moveLocalBefore = (sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) return;
    setLocalOrderIds((prev) => {
      const from = prev.indexOf(String(sourceId));
      if (from < 0) return prev;
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      const insertAt = next.indexOf(String(targetId));
      if (insertAt < 0) return prev;
      next.splice(insertAt, 0, moved);
      // 동일하면 prev 반환 → 불필요 re-render 차단 (dragOver 가 빈번히 발화).
      for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== next[i]) return next;
      }
      return prev;
    });
  };
  const orderChangedCount = React.useMemo(() => {
    if (!reorderMode) return 0;
    let n = 0;
    for (let i = 0; i < localOrderIds.length; i++) {
      if (String(pagePosts[i]?.id) !== String(localOrderIds[i])) n++;
    }
    return n;
  }, [reorderMode, localOrderIds, pagePosts]);
  const saveReorder = async () => {
    if (savingOrder) return;
    if (orderChangedCount === 0) { setReorderMode(false); return; }
    const N = localOrderIds.length;
    if (N === 0) return;
    // anchor: 페이지 위쪽(더 최신) 보더 = filtered[pageStart-1], 아래쪽(더 과거) = filtered[pageStart+N].
    const toMs = (p) => {
      const v = p?.createdAt || p?.date || '';
      const t = Date.parse(v);
      return Number.isFinite(t) ? t : NaN;
    };
    const upperAnchor = pageStart > 0 ? toMs(filtered[pageStart - 1]) : NaN;
    const lowerAnchor = (pageStart + N) < filtered.length ? toMs(filtered[pageStart + N]) : NaN;
    // 페이지 첫/마지막 게시글의 원본 createdAt 을 fallback 으로.
    const origTop = toMs(pagePosts[0]);
    const origBottom = toMs(pagePosts[N - 1]);
    const topMs = Number.isFinite(upperAnchor) ? upperAnchor
      : (Number.isFinite(origTop) ? origTop + (N + 1) * 1000 : Date.now() + (N + 1) * 1000);
    const botMs = Number.isFinite(lowerAnchor) ? lowerAnchor
      : (Number.isFinite(origBottom) ? origBottom - (N + 1) * 1000 : Date.now() - (N + 1) * 1000);
    const span = topMs - botMs;
    if (!(span > 0)) {
      window.BGNJ_TOAST?.error?.('이전/이후 게시글과 시간 간격이 너무 좁아 자동 분배에 실패했습니다.');
      return;
    }
    const step = span / (N + 1);
    // i=0 → 가장 위(최신), 가장 큰 ms. desc.
    const updates = [];
    for (let i = 0; i < N; i++) {
      const id = String(localOrderIds[i]);
      const newMs = Math.round(topMs - step * (i + 1));
      // 변경된 항목만 PATCH (불필요 호출 차단).
      const origIdx = pagePosts.findIndex((p) => String(p.id) === id);
      if (origIdx === i) continue;
      updates.push({ id, iso: new Date(newMs).toISOString() });
    }
    if (updates.length === 0) { setReorderMode(false); return; }
    setSavingOrder(true);
    try {
      await Promise.all(updates.map(({ id, iso }) =>
        window.BGNJ_API.posts.update(id, { createdAt: iso })
      ));
      await window.BGNJ_COMMUNITY.refreshPosts();
      window.BGNJ_TOAST?.success?.(`순서를 저장했습니다. (${updates.length}건)`);
      setReorderMode(false);
      setLocalOrderIds([]);
      setRefreshKey((v) => v + 1);
    } catch (err) {
      window.BGNJ_TOAST?.error?.(`순서 저장 실패: ${err?.message || '알 수 없는 오류'}`);
    } finally {
      setSavingOrder(false);
    }
  };

  // 편집 모드일 때 실제 렌더에 사용할 페이지 게시글 — localOrderIds 순서 적용.
  const displayPagePosts = React.useMemo(() => {
    if (!reorderMode || localOrderIds.length === 0) return pagePosts;
    const byId = new Map(pagePosts.map((p) => [String(p.id), p]));
    return localOrderIds.map((id) => byId.get(String(id))).filter(Boolean);
  }, [reorderMode, localOrderIds, pagePosts]);

  const handleWrite = async () => {
    if (!user) {
      if ((await window.BGNJ_CONFIRM("글쓰기는 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?", { danger: true }))) {
        go("login");
      }
      return;
    }
    // Writable categories for current user.
    // v00.141 — allow_write 가 명시 false 인 게시판은 비관리자 제외.
    // v00.146 — 공지(notice) 는 어떠한 경우에도 관리자만 작성 (강제 규칙).
    const isAdmin = !!(user?.isAdmin || user?.gradeId === 'admin');
    const writable = categories.filter((c) => {
      if (c.id === 'notice' && !isAdmin) return false;
      if (c.allowWrite === false && !isAdmin) return false;
      return userLevel >= (c.postMinLevel ?? c.minLevel ?? 0);
    });
    if (writable.length === 0) {
      window.BGNJ_TOAST.error("현재 등급으로는 글을 작성할 수 있는 게시판이 없습니다.");
      return;
    }
    setWriting(true);
  };

  // v00.279 — 상세뷰 분기를 모든 hook 선언 뒤로 이동 (hook 순서 고정 → React error #300 해소).
  if (postId) {
    const post = allPosts.find(p => String(p.id) === String(postId)) || null;
    if (!post) {
      // v00.306.002 — 목록을 못 불러온 상태와 '그 글이 없는' 상태를 갈라 놓는다.
      //   _serverLoaded 가 false 면 목록이 아직/끝내 안 온 것이다. 이때 '없는 글' 이라고
      //   말해 버리면 사용자는 다시 시도할 생각을 못 하고 연락을 한다(2026-08-25 민원).
      if (!window.BGNJ_COMMUNITY?._serverLoaded) {
        return (
          <ContentLoadNotice
            status={loadError ? 'error' : 'loading'}
            label="게시글"
            message={loadError}
            onRetry={() => { setLoadError(null); window.BGNJ_COMMUNITY.refreshPosts?.(); }}
            onBack={() => setPostId(null)}/>
        );
      }
      return (
        <div className="section">
          <div className="container" style={{maxWidth:760, textAlign:'center', padding:'80px 20px'}}>
            <p className="dim" style={{fontSize:14, marginBottom:16}}>해당 게시글을 찾을 수 없습니다.</p>
            <p className="dim-2" style={{fontSize:13, marginBottom:20}}>삭제되었거나 주소가 잘못된 글입니다.</p>
            <button type="button" className="btn" onClick={() => setPostId(null)}>목록으로</button>
          </div>
        </div>
      );
    }
    if (!canReadPost(post)) {
      return (
        <div className="section">
          <div className="container" style={{maxWidth:760, textAlign:'center', padding:'80px 20px'}}>
            <p className="dim" style={{fontSize:14, marginBottom:16}}>현재 등급으로는 이 게시글을 볼 수 없습니다.</p>
            <button type="button" className="btn" onClick={() => setPostId(null)}>목록으로</button>
          </div>
        </div>
      );
    }
    // v00.176 — 수정 버튼 미반응 fix. detail 뷰일 때도 PostComposeModal 렌더해야 setWriting(post) → 모달 노출.
    return (
      <>
        <PostDetail
          post={post}
          siblings={filtered}
          go={go}
          setPostId={setPostId}
          user={user}
          onRefresh={() => setRefreshKey((value) => value + 1)}
          onEdit={(nextPost) => setWriting(nextPost)}
          onPrefixClick={(pfx) => {
            // v00.304 — 같은 시리즈 글만 모아 본다. 게시판이 'all' 이었다면 그 글의 게시판으로 옮기고,
            //   이미 그 게시판이면 tab 이 안 바뀌어 아래 ref 없이도 말머리가 그대로 남는다.
            pendingPrefixRef.current = pfx;
            setActivePrefix(pfx);
            if (post.categoryId) setTab(post.categoryId);
            setPostId(null);
            window.scrollTo(0, 0);
          }}
        />
        {writing && <PostComposeModal onClose={() => setWriting(null)}/>}
      </>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <header style={{marginBottom:24}}>
          {(() => {
            // v00.073 — site_content_kv.communityIntro 에서 hero 읽기.
            const _i = (window.BGNJ_SITE_CONTENT?.get?.() || {}).communityIntro || {};
            const eb = _i.eyebrow || 'COMMUNITY · 광장';
            const tp = _i.titlePrefix ?? '다섯 봉우리 ';
            const ta = _i.titleAccent ?? '광장';
            const sb = _i.subtitle || '뱅기노자이 모여 나누는 이야기. 질문도 답도 환영합니다.';
            return (
              <>
                <div className="section-eyebrow" aria-hidden="true">{eb}</div>
                <h1 className="section-title">{tp}<span className="accent">{ta}</span></h1>
                <p className="section-subtitle">{sb}</p>
              </>
            );
          })()}
        </header>

        {/* v00.194 — 사용자 보고 '게시글 안 불러짐'. 실패 시 명시적 배너 + 재시도 버튼 (silent fail 폐기). */}
        {loadError && (
          <div role="alert" style={{
            border:'1px solid var(--danger, #b91c1c)',
            background:'rgba(185,28,28,0.08)',
            padding:'12px 16px', marginBottom:18,
            display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap',
          }}>
            <span style={{fontSize:13, color:'var(--ink)'}}>
              ⚠ 게시글을 불러오지 못했습니다. <span className="dim-2 mono" style={{fontSize:11}}>{loadError}</span>
            </span>
            <button type="button" className="btn btn-small"
              onClick={() => { setLoadError(null); window.BGNJ_COMMUNITY.refreshPosts?.(); }}>
              다시 불러오기
            </button>
          </div>
        )}

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, gap:24, flexWrap:'wrap'}}>
          <div role="tablist" aria-label="게시판 분류"
            style={{display:'flex', gap:0, borderBottom:'1px solid var(--line)', flexWrap:'wrap'}}>
            <button type="button" role="tab" aria-selected={tab === "all"}
              onClick={() => setTab("all")}
              style={{padding:'14px 24px', fontSize:13, letterSpacing:'0.1em',
                color: tab === "all" ? 'var(--primary)' : 'var(--ink-2)',
                borderBottom: tab === "all" ? '1px solid var(--primary)' : '1px solid transparent',
                marginBottom:-1}}>전체</button>
            {visibleCats.map(c => (
              <button key={c.id} type="button" role="tab" aria-selected={tab === c.id}
                onClick={() => setTab(c.id)}
                style={{padding:'14px 24px', fontSize:13, letterSpacing:'0.1em',
                  color: tab === c.id ? 'var(--primary)' : 'var(--ink-2)',
                  borderBottom: tab === c.id ? '1px solid var(--primary)' : '1px solid transparent',
                  marginBottom:-1}}>{c.label}</button>
            ))}
          </div>
          <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
            <label htmlFor="community-search" className="sr-only">게시글 검색</label>
            <input id="community-search"
              placeholder={tab === "all" ? "전체 게시판 검색..." : `${currentBoard?.label || ''} 게시판 검색...`}
              value={search} onChange={e => setSearch(e.target.value)}
              className="field-input" style={{width:200, padding:'10px 14px'}}/>
            <label htmlFor="community-sort" className="sr-only">정렬</label>
            <select id="community-sort" value={sort} onChange={e => setSort(e.target.value)}
              className="field-input" style={{padding:'10px 12px', fontSize:12, cursor:'pointer'}}>
              <option value="latest">최신순</option>
              <option value="views">조회순</option>
              <option value="replies">댓글순</option>
              <option value="likes">좋아요순</option>
            </select>
            <label htmlFor="community-per-page" className="sr-only">한 페이지 게시글 수</label>
            <select id="community-per-page" value={postsPerPage} onChange={e => setPostsPerPage(Number(e.target.value))}
              className="field-input" style={{padding:'10px 12px', fontSize:12, cursor:'pointer'}}
              title="한 페이지에 표시할 게시글 갯수">
              {POSTS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}개</option>
              ))}
            </select>
            <button type="button" className="btn btn-gold btn-small" onClick={handleWrite}>
              {user ? '글쓰기 ＋' : '로그인 후 글쓰기'}
            </button>
          </div>
        </div>

        {/* 게시판 설명 — 특정 게시판 뷰에서만 표시.
            v00.294 — 좌측 3px 색 띠 → 실선 테두리. v00.293 재디자인이 잡은
            '각지고 얇은 선' 톤(--radius 2px · 헤어라인)과 어긋나 있었고,
            첨부 파일 목록 등 같은 화면의 다른 안내 박스와도 모양이 달랐다. */}
        {tab !== "all" && currentBoard?.desc && (
          <div style={{
            padding:'12px 16px', marginBottom:16,
            background:'var(--bg-2)', border:'1px solid var(--line)',
            fontSize:13, color:'var(--ink-2)', lineHeight:1.6,
            wordBreak:'keep-all', overflowWrap:'break-word',
          }}>{currentBoard.desc}</div>
        )}

        {/* 말머리 필터 — 해당 게시판에 말머리가 있을 때만 표시 */}
        {boardPrefixes.length > 0 && (
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:16}}>
            <button type="button"
              onClick={() => setActivePrefix("")}
              style={{
                padding:'4px 16px', border:'1px solid',
                borderColor: activePrefix === "" ? 'var(--primary)' : 'var(--line-2)',
                color: activePrefix === "" ? 'var(--primary)' : 'var(--ink-2)',
                background: activePrefix === "" ? 'rgba(158,104,24,0.06)' : 'none',
                cursor:'pointer', fontSize:13, letterSpacing:'0.05em',
              }}>전체</button>
            {boardPrefixes.map(p => (
              <button key={p.name} type="button"
                onClick={() => setActivePrefix(activePrefix === p.name ? "" : p.name)}
                style={{
                  padding:'4px 16px', border:'1px solid',
                  borderColor: activePrefix === p.name ? 'var(--primary)' : 'var(--line-2)',
                  color: activePrefix === p.name ? 'var(--primary)' : 'var(--ink-2)',
                  background: activePrefix === p.name ? 'rgba(158,104,24,0.06)' : 'none',
                  cursor:'pointer', fontSize:13, letterSpacing:'0.05em',
                }}>{p.name}</button>
            ))}
          </div>
        )}

        {canRenumber && (
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10,
            marginBottom:8, padding:'8px 10px',
            background: reorderMode ? 'rgba(245,213,72,0.10)' : 'rgba(158,104,24,0.05)',
            borderLeft: reorderMode ? '2px solid var(--primary)' : '2px solid var(--primary-dim)',
          }}>
            <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase'}}>
              {reorderMode
                ? `ADMIN · 순서 편집 중 — 행을 끌어서 위치 변경 (변경 ${orderChangedCount}건)`
                : 'ADMIN · 번호 옆 ▲ ▼ 로 한 칸씩 이동 / 여러 개 일괄 변경은 [순서 편집] 사용'}
            </span>
            <span style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {reorderMode ? (
                <>
                  <button type="button" className="btn btn-small btn-gold"
                    onClick={saveReorder}
                    disabled={savingOrder || orderChangedCount === 0}>
                    {savingOrder ? '저장 중...' : `저장 (${orderChangedCount}건)`}
                  </button>
                  <button type="button" className="btn btn-small"
                    onClick={exitReorderMode}
                    disabled={savingOrder}>취소</button>
                </>
              ) : (
                <button type="button" className="btn btn-small"
                  onClick={enterReorderMode}
                  title="현재 페이지의 게시글을 드래그앤드롭으로 일괄 재배치">
                  ✎ 순서 편집
                </button>
              )}
            </span>
          </div>
        )}
        <table className="community-table" style={{width:'100%', borderCollapse:'collapse'}}>
          <caption className="sr-only">게시글 목록</caption>
          <thead>
            <tr style={{fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
              <th scope="col" className="col-num" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width: canRenumber ? 90 : 60}}>번호</th>
              {/* v00.304.001 — 90 → 132. '신지식 청년사관' 이 안 들어가 두 줄로 접혔다. */}
              <th scope="col" className="col-cat" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:132}}>분류</th>
              <th scope="col" className="col-title" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)'}}>제목</th>
              {/* v00.304.001 — 120 → 172. 이름 + 등급 배지('뱅기노자 관리팀')가 한 줄에 들어가게. */}
              <th scope="col" className="col-author" style={{padding:'16px 8px', textAlign:'left', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:172}}>작성자</th>
              <th scope="col" className="col-views" style={{padding:'16px 8px', textAlign:'right', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:70}}>조회</th>
              <th scope="col" className="col-date" style={{padding:'16px 8px', textAlign:'right', borderTop:'1px solid var(--line-2)', borderBottom:'1px solid var(--line)', width:100}}>날짜</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{padding:48, textAlign:'center'}} className="dim">
                조건에 맞는 게시글이 없습니다.
              </td></tr>
            ) : displayPagePosts.map((p, i) => {
              const cat = categories.find(c => c.id === p.categoryId) || categories.find(c => c.label === p.category) || { label: p.category };
              const likesCount = Array.isArray(p.likes) ? p.likes.length : 0;
              const bookmarked = user && G.call(() => window.BGNJ_COMMUNITY?.isBookmarked?.(user.id, p.id), false);
              const rowNum = String(filtered.length - (pageStart + i)).padStart(3, '0');
              const isDragging = reorderMode && String(draggingId) === String(p.id);
              const rowStyle = {
                borderBottom:'1px solid var(--line)',
                transition:'background .2s, opacity .15s',
                opacity: isDragging ? 0.35 : 1,
                cursor: reorderMode ? 'move' : undefined,
              };
              const dragProps = reorderMode ? {
                draggable: true,
                onDragStart: (e) => {
                  setDraggingId(String(p.id));
                  try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(p.id)); } catch (_e) { console.warn('[bgnj] CommunityPage.jsx:1159 오류(무시하고 진행)', _e); }
                },
                onDragOver: (e) => {
                  e.preventDefault();
                  try { e.dataTransfer.dropEffect = 'move'; } catch (_e) { console.warn('[bgnj] CommunityPage.jsx:1163 오류(무시하고 진행)', _e); }
                  if (draggingId && String(draggingId) !== String(p.id)) {
                    moveLocalBefore(draggingId, p.id);
                  }
                },
                onDrop: (e) => { e.preventDefault(); setDraggingId(null); },
                onDragEnd: () => setDraggingId(null),
              } : {};
              return (
                <tr key={p.id} style={rowStyle}
                  {...dragProps}
                  onMouseEnter={e => { if (!reorderMode) e.currentTarget.style.background = 'rgba(245,213,72,0.03)'; }}
                  onMouseLeave={e => { if (!reorderMode) e.currentTarget.style.background = 'transparent'; }}>
                  <td className="col-num mono dim-2" style={{padding:'18px 8px', fontSize:12}}>
                    {canRenumber ? (() => {
                      if (reorderMode) {
                        return (
                          <span style={{display:'inline-flex', alignItems:'center', gap:6}}>
                            <span aria-hidden="true" title="끌어서 위치 변경" style={{color:'var(--primary)', fontSize:14, lineHeight:1, cursor:'grab', userSelect:'none'}}>≡</span>
                            <span>{rowNum}</span>
                          </span>
                        );
                      }
                      const absIdx = pageStart + i;
                      const isTop = absIdx === 0;
                      const isBottom = absIdx === filtered.length - 1;
                      const busy = movingPostId === p.id;
                      const arrowBtnStyle = (disabled) => ({
                        background:'none', border:'1px solid var(--line)',
                        color: disabled ? 'var(--ink-3)' : 'var(--primary)',
                        cursor: disabled ? 'default' : 'pointer',
                        padding:'1px 4px', lineHeight:1, fontSize:10, minHeight:0,
                        opacity: disabled ? 0.4 : 1,
                      });
                      return (
                        <span style={{display:'inline-flex', alignItems:'center', gap:6}}>
                          <span>{rowNum}</span>
                          <span style={{display:'inline-flex', flexDirection:'column', gap:1}}>
                            <button type="button"
                              onClick={() => handleMovePost(p, 'up')}
                              disabled={isTop || busy}
                              title="위로 (최신 방향)"
                              aria-label="위로 한 칸"
                              style={arrowBtnStyle(isTop || busy)}>▲</button>
                            <button type="button"
                              onClick={() => handleMovePost(p, 'down')}
                              disabled={isBottom || busy}
                              title="아래로 (과거 방향)"
                              aria-label="아래로 한 칸"
                              style={arrowBtnStyle(isBottom || busy)}>▼</button>
                          </span>
                        </span>
                      );
                    })() : rowNum}
                  </td>
                  <td className="col-cat" style={{padding:'18px 8px'}}><span className="badge">{cat.label}</span></td>
                  <td className="col-title row-title" style={{padding:'18px 8px', fontSize:15}}>
                    <button type="button"
                      onClick={() => { if (!reorderMode) setPostId(p.id); }}
                      disabled={reorderMode}
                      className="row-title-button"
                      style={{all:'unset', cursor: reorderMode ? 'move' : 'pointer', textAlign:'left', display:'block', width:'100%'}}>
                      <span className="row-title-text">
                        {bookmarked && <span className="gold" style={{marginRight:6, fontSize:11}} aria-label="북마크">★</span>}
                        {/* v00.304 — 말머리. 제목보다 한 단계 작고 연하게 두어 제목을 가리지 않는다
                            (홈 피드의 .home-feed-prefix 와 같은 결). 말머리가 없으면 아무것도 그리지 않는다. */}
                        {p.prefix && <span className="post-prefix">[{p.prefix}]</span>}
                        {p.title}
                        {/* v00.306.003 — 댓글 수는 게시판의 오랜 관습대로 제목 바로 뒤에 (n).
                            말풍선 이모지는 기기마다 색·모양이 달라 이 화면의 결과 따로 놀았다. */}
                        {(p.replies ?? 0) > 0 && (
                          <span className="gold mono row-title-inline" style={{marginLeft:6, fontSize:12}}
                            aria-label={`댓글 ${p.replies}개`}>({p.replies})</span>
                        )}
                        {p.images?.length > 0 && (
                          <span className="mono row-title-inline"
                            style={{marginLeft:8, fontSize:10, color:'var(--ink-3)', display:'inline-flex', alignItems:'center', gap:3}}
                            aria-label={`사진 ${p.images.length}장`}>
                            <PhotoMark size={11}/>{p.images.length}
                          </span>
                        )}
                        {likesCount > 0 && <span className="gold mono row-title-inline" style={{marginLeft:8, fontSize:10}} aria-label="공감 수">♥{likesCount}</span>}
                        {/* v00.306.002 — 목록에서 태그를 뺐다. 말머리로 걸러 온 목록은 세 편에 같은 태그가
                            반복돼 정보가 되지 않는데, 제목을 밀어 두 줄로 접히게 만들고 있었다.
                            태그는 글 상세(.tag-chip)와 검색이 제 몫을 한다 — 데이터는 그대로 둔다. */}
                        {p.hot && <span className="gold" style={{marginLeft:8, fontSize:10}}>HOT</span>}
                        {p._new && <span className="gold" style={{marginLeft:8, fontSize:10}}>NEW</span>}
                      </span>
                      <span className="row-mobile-meta" aria-hidden="true">
                        <span className="badge">{cat.label}</span>
                        {/* v00.304 — 모바일 제목 줄은 한 줄로 잘리므로(nowrap+ellipsis), 말머리를
                            제목 앞에 그대로 두면 정작 제목이 안 보인다. 여기로 내려 보낸다. */}
                        {p.prefix && <span className="badge">{p.prefix}</span>}
                        <span>{p.author}</span>
                        <span className="dot">·</span>
                        <time dateTime={(p.date || '').replace(/\./g,'-')}>{p.date || ''}</time>
                        <span className="dot">·</span>
                        <span>조회 {p.views ?? 0}</span>
                        {likesCount > 0 && <span className="gold">♥ {likesCount}</span>}
                        {p.images?.length > 0 && <span className="dim-2">사진 {p.images.length}</span>}
                        {(p.replies ?? 0) > 0 && <span className="gold">댓글 {p.replies}</span>}
                      </span>
                    </button>
                  </td>
                  <td className="col-author mono dim" style={{padding:'18px 8px', fontSize:12, whiteSpace:'nowrap'}}>
                    {p.author}
                    <AuthorGradeBadge authorId={p.authorId} author={p.author} authorEmail={p.authorEmail}/>
                  </td>
                  <td className="col-views mono dim-2" style={{padding:'18px 8px', fontSize:12, textAlign:'right'}}>{p.views ?? 0}</td>
                  <td className="col-date mono dim-2" style={{padding:'18px 8px', fontSize:11, textAlign:'right'}}>
                    <time dateTime={(p.date || '').replace(/\./g,'-')}>{p.date || ''}</time>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination — 순서 편집 모드에서는 페이지 이동 잠금 (변경 사항 소실 방지) */}
        {filtered.length > 0 && totalPages > 1 && (
          <nav aria-label="게시글 페이지 이동" style={{display:'flex', justifyContent:'center', alignItems:'center', gap:6, marginTop:32, flexWrap:'wrap', opacity: reorderMode ? 0.4 : 1}}>
            <button type="button" className="btn btn-small"
              onClick={() => setPage(Math.max(1, safePage - 1))}
              disabled={reorderMode || safePage <= 1}>← 이전</button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
              <button key={n} type="button" className="btn btn-small"
                aria-current={n === safePage ? 'page' : undefined}
                onClick={() => setPage(n)}
                disabled={reorderMode}
                style={{
                  borderColor: n === safePage ? 'var(--primary)' : 'var(--line)',
                  color: n === safePage ? 'var(--primary)' : 'var(--ink-2)',
                  background: n === safePage ? 'rgba(245,213,72,0.08)' : 'transparent',
                  minWidth: 36,
                }}>{n}</button>
            ))}
            <button type="button" className="btn btn-small"
              onClick={() => setPage(Math.min(totalPages, safePage + 1))}
              disabled={reorderMode || safePage >= totalPages}>다음 →</button>
          </nav>
        )}

        {filtered.length > 0 && (
          <div className="mono dim-2" style={{textAlign:'center', fontSize:10, letterSpacing:'0.2em', marginTop:12}}>
            전체 {filtered.length}건 · {safePage}/{totalPages} 페이지
          </div>
        )}

        {/* 하단 검색 + 글쓰기 바 */}
        <div style={{
          display:'flex', gap:10, alignItems:'center', justifyContent:'center',
          marginTop:40, paddingTop:24, borderTop:'1px solid var(--line)',
          flexWrap:'wrap',
        }}>
          <label htmlFor="community-search-bottom" className="sr-only">게시글 검색</label>
          <input id="community-search-bottom"
            placeholder={tab === "all" ? "전체 게시판 검색..." : `${currentBoard?.label || ''} 게시판 검색...`}
            value={search} onChange={e => setSearch(e.target.value)}
            className="field-input"
            style={{width:280, padding:'12px 16px', fontSize:14}}/>
          <button type="button" className="btn btn-gold" onClick={handleWrite}
            style={{padding:'12px 28px', fontSize:13}}>
            {user ? '글쓰기 ＋' : '로그인 후 글쓰기'}
          </button>
        </div>
      </div>
      {/* v00.068 — 글쓰기 모달 (목록 위에 표시). useModalGuard 로 ESC/외부클릭 임시저장 prompt. */}
      {writing && <PostComposeModal onClose={() => setWriting(null)}/>}
    </div>
  );
};

// === Post Compose =======================================================
// 새 글 임시저장 키 — 사용자별로 분리(여러 계정이 같은 브라우저를 쓸 때 섞이지 않도록).
const draftKeyFor = (userId) => `bgnj_post_draft_${userId || 'guest'}`;

// v00.263.003 — onPayloadChange 추가. 모달 wrapper(PostComposeModal)가 dirty payload 를 받아
// BGNJ_DRAFTS 에 임시저장. 사용자 보고: 임시저장 글 어디서 보는지 모름 + 최대 5개 제한.
const PostCompose = ({ user, initialPost, onCancel, onPublish, categories, userLevel, onPayloadChange }) => {
  const writable = categories.filter(c => userLevel >= (c.postMinLevel ?? c.minLevel ?? 0));
  // v00.294.003 — 게시판은 운영 중에 삭제될 수 있다(v00.294 에서 질문·정보 폐쇄).
  // 삭제된 게시판 id 로 저장된 임시저장 글이나 옛 게시글을 그대로 복원하면
  // 존재하지 않는 분류가 선택된 채 발행돼 서버가 거부한다. 항상 실재 여부를 확인한다.
  const _fallbackCatId = writable[0]?.id || categories[0]?.id || "";
  const _validCatId = React.useCallback((id) => (
    id && categories.some((c) => c.id === id) ? id : _fallbackCatId
  ), [categories, _fallbackCatId]);
  const defaultCategoryId = _validCatId(initialPost?.categoryId);
  const isEditing = !!initialPost;

  // 새 글 작성일 때만 임시저장 복원/저장. 수정 모드에서는 원본 게시글이 source of truth.
  const draftKey = draftKeyFor(user?.id);
  const initialDraft = React.useMemo(() => {
    if (isEditing) return null;
    try {
      const raw = localStorage.getItem(draftKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, [draftKey, isEditing]);

  const [categoryId, setCategoryId] = React.useState(_validCatId(initialDraft?.categoryId) || defaultCategoryId);
  const [title, setTitle] = React.useState(initialPost?.title || initialDraft?.title || "");
  const [prefix, setPrefix] = React.useState(initialPost?.prefix || initialDraft?.prefix || "");
  const [tags, setTags] = React.useState(initialPost?.tags || initialDraft?.tags || []);
  const [images, setImages] = React.useState(initialPost?.images || initialDraft?.images || []);
  const [attachments, setAttachments] = React.useState(initialPost?.attachments || initialDraft?.attachments || []);
  const [bodyHtml, setBodyHtml] = React.useState(initialPost?.body?.html || initialDraft?.bodyHtml || "");
  const [bodyText, setBodyText] = React.useState(initialPost?.body?.text || initialDraft?.bodyText || "");
  // v00.115 — admin 만 표시: 업로드 시점 시간 오버라이드. 'YYYY-MM-DDTHH:MM' 형식 (datetime-local input).
  // 기존 글 수정 시 initialPost.createdAt 의 KST 부분을 datetime-local 포맷으로 환산해 미리 채움.
  const _toLocalInput = (iso) => {
    if (!iso) return "";
    try {
      // KST 기준 'YYYY-MM-DDTHH:MM'.
      const parts = window.BGNJ_FMT?.kstDateTime?.(iso);
      if (parts) return parts.replace(' KST', '').replace(' ', 'T').slice(0, 16);
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch { return ""; }
  };
  const [createdAt, setCreatedAt] = React.useState(_toLocalInput(initialPost?.createdAt || initialPost?.created_at || ""));
  const [error, setError] = React.useState("");
  const [draftRestored, setDraftRestored] = React.useState(!!(initialDraft && (initialDraft.title || initialDraft.bodyText)));
  const [savedAt, setSavedAt] = React.useState(initialDraft?.savedAt || null);
  // v00.294.006 — 자동 임시저장 실패를 화면에 드러낸다(이전엔 catch {} 로 삼켰다).
  const [draftError, setDraftError] = React.useState('');
  // v00.295.005 — 사진·파일이 아직 올라가는 중이면 게시를 막는다.
  //   안 막으면 첨부가 통째로 빠진 글이 저장되고, 사용자는 '올렸는데 안 보인다' 만 겪는다.
  const [imagesBusy, setImagesBusy] = React.useState(false);
  const [filesBusy, setFilesBusy] = React.useState(false);
  const [bodyBusy, setBodyBusy] = React.useState(false);
  const attachBusy = imagesBusy || filesBusy || bodyBusy;
  const prevCategoryIdRef = React.useRef(categoryId);

  // 임시저장 — 수정 모드 제외, 1초 디바운스로 저장.
  React.useEffect(() => {
    if (isEditing) return;
    const hasContent = !!(title.trim() || bodyText.trim() || (tags && tags.length) || (images && images.length) || (attachments && attachments.length));
    const t = setTimeout(() => {
      try {
        if (hasContent) {
          // v00.294.006 — 임시저장에서 base64(dataURI)를 걷어낸다.
          // localStorage 는 보통 5MB 다. 이미지 한 장만 base64 로 들어와도 한도를 넘고,
          // setItem 이 던지는 QuotaExceededError 를 통째로 삼켜 왔다 → 사용자는
          // '임시저장됨' 을 못 보면서도 왜 안 되는지 알 수 없었다.
          // R2 URL(https://…)은 짧으니 그대로 두고, base64 만 뺀다.
          const _noBase64 = (list) => (Array.isArray(list) ? list : [])
            .filter((x) => !String(x?.dataUrl || '').startsWith('data:'));
          const snapshot = {
            categoryId, title, prefix, tags,
            images: _noBase64(images),
            attachments: _noBase64(attachments),
            bodyHtml, bodyText,
            savedAt: new Date().toISOString(),
          };
          localStorage.setItem(draftKey, JSON.stringify(snapshot));
          setSavedAt(snapshot.savedAt);
          setDraftError('');
        } else {
          localStorage.removeItem(draftKey);
          setSavedAt(null);
          setDraftError('');
        }
      } catch (err) {
        // 조용히 넘기지 않는다 — 임시저장이 안 되는 줄 모르고 글을 잃는 것이 최악이다.
        setSavedAt(null);
        setDraftError(
          String(err?.name || '').includes('Quota')
            ? '임시저장 공간이 가득 차 자동 저장이 멈췄습니다. 글을 발행하거나, 지난 임시저장 글을 지워 주세요.'
            : '자동 임시저장에 실패했습니다. 창을 닫기 전에 글을 발행해 주세요.'
        );
      }
    }, 800);
    return () => clearTimeout(t);
  }, [draftKey, isEditing, categoryId, title, prefix, tags, images, attachments, bodyHtml, bodyText]);

  const clearDraft = () => {
    try { localStorage.removeItem(draftKey); } catch (_e) { console.warn('[bgnj] 저장소 정리 (CommunityPage.jsx:1414)', _e); }
    setSavedAt(null);
    setDraftRestored(false);
  };

  // v00.263.003 — 모달 wrapper 에 현재 payload streaming (임시저장 prompt 시 사용).
  React.useEffect(() => {
    onPayloadChange?.({ categoryId, title, prefix, tags, images, attachments, bodyHtml, bodyText });
  }, [categoryId, title, prefix, tags, images, attachments, bodyHtml, bodyText]);

  // v00.263.003 — BGNJ_DRAFTS('post') 목록 구독 + load/remove 헬퍼.
  const [postDrafts, setPostDrafts] = React.useState(() => {
    try { return window.BGNJ_DRAFTS?.list?.('post') || []; } catch { return []; }
  });
  React.useEffect(() => {
    const onChange = () => {
      try { setPostDrafts(window.BGNJ_DRAFTS?.list?.('post') || []); } catch (_e) { console.warn('[bgnj] CommunityPage.jsx:1430 오류(무시하고 진행)', _e); }
    };
    window.addEventListener('bgnj-drafts-change', onChange);
    return () => window.removeEventListener('bgnj-drafts-change', onChange);
  }, []);
  const loadPostDraft = (d) => {
    if (!d) return;
    setCategoryId(_validCatId(d.categoryId) || defaultCategoryId);
    setTitle(d.title || '');
    setPrefix(d.prefix || '');
    setTags(Array.isArray(d.tags) ? d.tags : []);
    setImages(Array.isArray(d.images) ? d.images : []);
    setAttachments(Array.isArray(d.attachments) ? d.attachments : []);
    setBodyHtml(d.bodyHtml || '');
    setBodyText(d.bodyText || '');
    setDraftRestored(true);
  };
  const removePostDraft = async (id) => {
    if (!(await window.BGNJ_CONFIRM('이 임시저장 글을 삭제하시겠어요?', { danger: true, confirmLabel: '삭제' }))) return;
    try { window.BGNJ_DRAFTS?.remove?.(id); } catch (_e) { console.warn('[bgnj] CommunityPage.jsx:1449 오류(무시하고 진행)', _e); }
  };
  const MAX_POST_DRAFTS = window.BGNJ_DRAFTS?.MAX_COUNT || 5;

  React.useEffect(() => {
    setCategoryId(_validCatId(initialPost?.categoryId) || defaultCategoryId);
    setTitle(initialPost?.title || "");
    setPrefix(initialPost?.prefix || "");
    setTags(initialPost?.tags || []);
    setImages(initialPost?.images || []);
    setAttachments(initialPost?.attachments || []);
    // v00.264 — 수정 모드 진입 시 발행 단계에서 append 했던 첨부 이미지 블록을
    // 제거한 본문만 Tiptap 으로 로드. 본문에 인라인 이미지가 누적되는 회귀 차단.
    setBodyHtml(_stripAttachedBlock(initialPost?.body?.html || ""));
    setBodyText(initialPost?.body?.text || "");
    setError("");
    prevCategoryIdRef.current = _validCatId(initialPost?.categoryId) || defaultCategoryId;
    // initialPost 가 들어오면 (= 수정 모드) 임시저장은 무시.
  }, [initialPost, defaultCategoryId]);

  const selectedCat = categories.find(c => c.id === categoryId);
  // 이미 그 게시판에서 쓰이고 있는 말머리는 새 글에서도 고를 수 있어야 한다.
  const boardPrefixes = mergeBoardPrefixes(
    selectedCat, window.BGNJ_GUARD.arr(() => window.BGNJ_COMMUNITY?.listPosts?.()));

  // ── 말머리 직접 입력 (v00.305.001) ───────────────────────────────────
  //   버튼으로만 고르게 하면 말머리가 늘어날수록 화면이 버튼밭이 된다.
  //   쳐서 찾을 수 있게 하되, **없는 말머리가 아무나에 의해 새로 생기지는 않게** 한다.
  //   회원은 있는 것 중에서만, 새로 만드는 건 관리자만.
  const isAdmin = !!user?.isAdmin;
  const [prefixInput, setPrefixInput] = React.useState("");
  const prefixMatch = React.useMemo(
    () => window.BGNJ_PREFIX_MATCH(boardPrefixes, prefixInput), [boardPrefixes, prefixInput]);

  // 말머리를 고른다 — 딸린 태그를 태그 칸에 더해 준다(더하기만 한다).
  const choosePrefix = React.useCallback((def) => {
    if (!def) return;
    setPrefix(def.name);
    if (def.tags?.length) {
      setTags((prev) => {
        const next = Array.isArray(prev) ? prev.slice() : [];
        for (const t of def.tags) if (t && !next.includes(t)) next.push(t);
        return next.slice(0, 10);
      });
    }
  }, []);

  // 관리자만 — 새 말머리를 게시판에 등록하고 바로 고른다.
  const createPrefix = async (rawName) => {
    const name = String(rawName || '').trim();
    if (!name || !selectedCat) return;
    const defs = window.BGNJ_PREFIX_DEFS(selectedCat);
    if (defs.some((d) => d.name === name)) { choosePrefix(defs.find((d) => d.name === name)); return; }
    const nextDefs = [...defs, { name, tags: [] }];
    const nextCats = window.BGNJ_STORES.categories.map((c) =>
      c.id === selectedCat.id ? { ...c, prefixes: nextDefs } : c);
    window.BGNJ_STORES.categories = nextCats;
    try { window.dispatchEvent(new CustomEvent('bgnj-categories-refresh')); } catch (_e) { console.warn('[bgnj] 이벤트 발신 실패는 무시해도 된다 (CommunityPage)', _e); }
    try { window.BGNJ_SAVE?.categories?.(); } catch (_e) { console.warn('[bgnj] 저장소 기록 실패 — 서버가 정본이다 (CommunityPage)', _e); }
    choosePrefix({ name, tags: [] });
    setPrefixInput("");
    // 서버가 정본이다. 이걸 빠뜨리면 새로고침하는 순간 사라진다.
    try {
      await window.BGNJ_API?.categories?.update?.(selectedCat.id, { prefixes: nextDefs });
      window.BGNJ_TOAST.success?.(`'${name}' 말머리를 ${selectedCat.label} 게시판에 등록했습니다.`);
    } catch (err) {
      console.warn('[CommunityPage] 말머리 등록 실패:', err?.message);
      window.BGNJ_TOAST.error('말머리를 서버에 등록하지 못했습니다. 새로고침하면 사라집니다.');
    }
  };

  // 입력칸에서 Enter 를 치거나 칸을 벗어났을 때 확정.
  const commitPrefixInput = () => {
    const raw = prefixInput.trim();
    if (!raw) return;
    if (prefixMatch) { choosePrefix(prefixMatch); setPrefixInput(""); return; }
    if (isAdmin) { createPrefix(raw); return; }
    window.BGNJ_TOAST.error('등록된 말머리가 아닙니다. 위 버튼에서 골라 주세요.');
  };

  React.useEffect(() => {
    if (prevCategoryIdRef.current === categoryId) return;
    prevCategoryIdRef.current = categoryId;
    if (!isEditing || categoryId !== (initialPost?.categoryId || "")) {
      setPrefix("");
    }
  }, [categoryId, initialPost, isEditing]);

  const submit = () => {
    setError("");
    if (attachBusy) return setError("사진·파일을 올리는 중입니다. 끝나면 게시할 수 있습니다.");
    if (!title.trim()) return setError("제목을 입력해주세요.");
    if (!bodyText.trim()) return setError("본문을 입력해주세요.");
    // v00.303 — 서버 한도(제목 200자 · 본문 20만자)와 같은 값을 화면에서도 본다.
    //   전에는 화면에 제한이 없어, 긴 글을 다 쓰고 저장을 누른 뒤에야 거부당했다.
    //   두 값이 어긋나면 '화면은 통과인데 서버가 거부' 하는 최악이 되므로 함께 고쳐야 한다.
    if (title.trim().length > POST_TITLE_MAX) {
      return setError(`제목이 너무 깁니다 (${title.trim().length}자 / 최대 ${POST_TITLE_MAX}자).`);
    }
    if (bodyHtml.length > POST_BODY_MAX) {
      return setError(`본문이 너무 깁니다 (${bodyHtml.length.toLocaleString()}자 / 최대 ${POST_BODY_MAX.toLocaleString()}자). 글을 나눠 올려 주세요.`);
    }
    const cat = categories.find(c => c.id === categoryId);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    // 발행 성공 가정으로 임시저장 정리 (실패 시 onPublish 측에서 다시 저장은 안 함).
    if (!isEditing) {
      try { localStorage.removeItem(draftKey); } catch (_e) { console.warn('[bgnj] 저장소 정리 (CommunityPage.jsx:1489)', _e); }
    }
    // v00.115 — admin 만 createdAt 오버라이드 가능. 다른 사용자 값 전송은 워커가 무시.
    // v00.294.008 — 본문 끝에 <img> 를 끼워 넣던 v00.242 응급 조치를 걷어낸다.
    // 그건 'D1 에 images 컬럼이 없고 워커 배포를 피하고 싶다' 는 제약에서 나온 우회로였다.
    // schema-v11 + 워커 배포로 images 가 정식 컬럼에 저장되므로 더는 필요 없다.
    // 본문에 남아 있을 수 있는 옛 마커 블록은 계속 걷어낸다 — 옛 글을 수정할 때
    // 그대로 두면 이미지가 본문과 슬라이드에 두 번 나온다.
    const _bodyHtmlWithImages = _stripAttachedBlock(bodyHtml);
    const payload = {
      categoryId: cat.id,
      category: cat.label,
      prefix: prefix || "",
      title: title.trim(),
      author: user?.name || "익명",
      authorId: user?.id || null,
      authorEmail: user?.email || null,
      replies: initialPost?.replies ?? 0,
      views: initialPost?.views ?? 0,
      date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())}`,
      tags,
      images,       // v00.294.008 — schema-v11 로 워커가 정식 저장한다(이전엔 무시했다).
      attachments,
      _new: true,
      _userCreated: true,
      body: { html: _bodyHtmlWithImages, text: bodyText },
    };
    if (user?.isAdmin && createdAt) {
      // 'YYYY-MM-DDTHH:MM' (KST 가정) → ISO 8601 with +09:00.
      payload.createdAt = `${createdAt}:00+09:00`;
    }
    onPublish(payload);
  };

  return (
    <div className="section">
      <div className="container" style={{maxWidth:960}}>
        <header style={{marginBottom:32}}>
          <div className="section-eyebrow" aria-hidden="true">COMPOSE · 글쓰기</div>
          <h1 className="section-title" style={{fontSize:36}}>{isEditing ? "게시글 수정" : "새 글 작성"}</h1>
          <p className="dim" style={{fontSize:13, marginTop:8}}>
            작성자: <span className="gold">{user?.name || '익명'}</span>
            {!isEditing && savedAt && (
              <span className="dim-2 mono" style={{marginLeft:14, fontSize:11}}>
                · 임시저장됨 ({new Date(savedAt).toLocaleTimeString('ko-KR', {hour:'2-digit', minute:'2-digit'})})
              </span>
            )}
          </p>
          {!isEditing && draftError && (
            <div role="alert" style={{
              marginTop:14, padding:'10px 14px',
              background:'var(--bg-2)', border:'1px solid var(--danger)',
              fontSize:12, color:'var(--danger)', lineHeight:1.6,
              wordBreak:'keep-all', overflowWrap:'break-word',
            }}>{draftError}</div>
          )}
          {!isEditing && draftRestored && (
            <div role="status" style={{
              marginTop:14, padding:'10px 14px', background:'rgba(245,213,72,0.06)',
              border:'1px solid var(--primary-dim)', fontSize:12, color:'var(--ink-2)',
              display:'flex', justifyContent:'space-between', alignItems:'center', gap:12,
            }}>
              <span>이전에 작성하던 글을 복원했습니다.</span>
              <button type="button" className="btn-ghost"
                onClick={async () => {
                  if ((await window.BGNJ_CONFIRM('임시저장된 글을 삭제하고 새로 시작하시겠어요?', { danger: true }))) {
                    setTitle(''); setPrefix(''); setTags([]); setImages([]);
                    setBodyHtml(''); setBodyText('');
                    clearDraft();
                  }
                }}
                style={{fontSize:11, color:'var(--danger)', textDecoration:'underline'}}>
                새로 시작
              </button>
            </div>
          )}

          {/* v00.263.003 — 임시저장 목록 (BGNJ_DRAFTS('post')). 외부클릭/ESC 시 [임시저장] 선택분 누적.
              최대 5개. 클릭 시 본문에 불러오기. */}
          {!isEditing && postDrafts.length > 0 && (
            <div style={{marginTop:14, padding:'12px 14px', border:'1px solid var(--line)', background:'var(--bg-2)'}}>
              <div className="mono gold" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:10}}>
                임시저장 ({postDrafts.length}/{MAX_POST_DRAFTS})
              </div>
              <ul style={{listStyle:'none', padding:0, margin:0, display:'grid', gap:6}}>
                {postDrafts.map((d) => (
                  <li key={d.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, padding:'8px 10px', background:'var(--bg)', border:'1px solid var(--line)'}}>
                    <button type="button"
                      onClick={() => loadPostDraft(d)}
                      style={{flex:1, textAlign:'left', background:'none', border:'none', cursor:'pointer', padding:0, color:'var(--ink)'}}
                      title="이 임시저장 글 불러오기">
                      <div style={{fontSize:13, lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                        {d.title || <span className="dim-2">(제목 없음)</span>}
                      </div>
                      <div className="dim-2 mono" style={{fontSize:10, marginTop:2}}>
                        {d.savedAt ? new Date(d.savedAt).toLocaleString('ko-KR', { dateStyle:'short', timeStyle:'short' }) : ''}
                      </div>
                    </button>
                    <button type="button"
                      onClick={() => removePostDraft(d.id)}
                      className="btn-ghost"
                      style={{fontSize:11, color:'var(--danger)', flexShrink:0}}>
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
              <p className="dim-2" style={{fontSize:11, lineHeight:1.6, marginTop:10, marginBottom:0}}>
                최대 {MAX_POST_DRAFTS}개 · 7일 보관. 외부 클릭/ESC 시 [임시저장]을 누르면 여기에 누적됩니다.
              </p>
            </div>
          )}
        </header>

        <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
          <div style={{display:'grid', gridTemplateColumns:'160px 1fr', gap:16, marginBottom: boardPrefixes.length > 0 ? 12 : 20}}>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="post-cat">게시판</label>
              <select id="post-cat" className="field-input"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}>
                {writable.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{margin:0}}>
              <label className="field-label" htmlFor="post-title">제목 <span className="gold" aria-hidden="true">*</span></label>
              <input id="post-title" className="field-input"
                placeholder="제목을 입력하세요"
                value={title} onChange={e => setTitle(e.target.value)}
                required maxLength={POST_TITLE_MAX}/>
            </div>
          </div>

          {/* 말머리 선택 — 선택된 게시판에 말머리가 있을 때만 표시 */}
          {/* v00.305.001 — 말머리가 하나도 없는 게시판이라도 관리자에게는 보여야 한다.
              그래야 첫 말머리를 만들 수 있다. 회원에게는 고를 게 없으니 숨긴다. */}
          {(boardPrefixes.length > 0 || isAdmin) && (
            <div className="field" style={{marginBottom:20}}>
              <div className="field-label">말머리</div>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                <button type="button"
                  onClick={() => setPrefix("")}
                  style={{padding:'4px 14px', border:'1px solid', borderColor: prefix === "" ? 'var(--primary)' : 'var(--line)', color: prefix === "" ? 'var(--primary)' : 'var(--ink-2)', background:'none', cursor:'pointer', fontSize:13, letterSpacing:'0.05em'}}>
                  없음
                </button>
                {boardPrefixes.map((p) => (
                  <button key={p.name} type="button"
                    onClick={() => choosePrefix(p)}
                    title={p.tags?.length ? `고르면 태그가 함께 붙습니다 — ${p.tags.map((t) => `#${t}`).join(' ')}` : undefined}
                    style={{padding:'4px 14px', border:'1px solid', borderColor: prefix === p.name ? 'var(--primary)' : 'var(--line)', color: prefix === p.name ? 'var(--primary)' : 'var(--ink-2)', background: prefix === p.name ? 'rgba(245,213,72,0.08)' : 'none', cursor:'pointer', fontSize:13, letterSpacing:'0.05em'}}>
                    {p.name}
                    {p.tags?.length > 0 && (
                      <span className="dim-2 mono" style={{marginLeft:6, fontSize:10}}>+{p.tags.length}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* 직접 입력 — 쳐서 찾는다. 없는 말머리를 새로 만드는 건 관리자만. */}
              <div style={{display:'flex', gap:8, alignItems:'center', marginTop:10, flexWrap:'wrap'}}>
                <input className="field-input" style={{padding:'4px 10px', maxWidth:240, fontSize:13}}
                  value={prefixInput}
                  placeholder={isAdmin ? '쳐서 찾기 · 없으면 새로 등록' : '쳐서 찾기...'}
                  aria-label="말머리 검색"
                  onChange={(e) => setPrefixInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key !== 'Enter') return; e.preventDefault(); commitPrefixInput(); }}
                  onBlur={commitPrefixInput}/>
                {prefixInput.trim() && (
                  prefixMatch ? (
                    <span className="mono" style={{fontSize:11, color:'var(--secondary)'}}>
                      → {prefixMatch.name}
                      <span className="dim-2" style={{marginLeft:6}}>Enter 로 선택</span>
                    </span>
                  ) : isAdmin ? (
                    <button type="button" className="btn btn-small btn-gold"
                      onClick={() => createPrefix(prefixInput)}>
                      ＋ '{prefixInput.trim()}' 새 말머리로 등록
                    </button>
                  ) : (
                    <span className="dim-2" style={{fontSize:11}}>맞는 말머리가 없습니다 — 위에서 골라 주세요</span>
                  )
                )}
              </div>
              {!isAdmin && (
                <p className="dim-2" style={{fontSize:10.5, marginTop:6}}>
                  새 말머리는 운영자만 만들 수 있습니다.
                </p>
              )}
            </div>
          )}

          {/* Hashtags */}
          <div className="field">
            <div className="field-label">해시태그 / 메타태그</div>
            <HashtagInput tags={tags} setTags={setTags}/>
          </div>

          {/* Tiptap editor */}
            <div className="field">
              <div className="field-label">본문 <span className="gold" aria-hidden="true">*</span></div>
              {/* v00.262.008 — preset 'simple' → 'rich' 로 변경. 본문 inline 이미지(R2 업로드) +
                  ProseMirror 기본 드래그앤드롭으로 이미지 위치 자유 이동. */}
              <TiptapEditor key={initialPost?.id || "new"}
                preset="rich"
                content={bodyHtml}
                onUpdate={(html, _json, text) => { setBodyHtml(html); setBodyText(text); }}
                onBusyChange={setBodyBusy}
                placeholder="본문을 입력하세요..."/>
            </div>

          {/* Image attachments */}
          <div className="field">
            <ImageAttacher images={images} setImages={setImages} max={10} onBusyChange={setImagesBusy}/>
          </div>

          {/* File attachments (v00.069) */}
          <div className="field">
            <FileAttacher files={attachments} setFiles={setAttachments} onBusyChange={setFilesBusy}/>
          </div>

          {/* v00.115 — admin 만 표시: 업로드 시점 시간(표시용) 오버라이드. 비우면 현재 시간. */}
          {user?.isAdmin && (
            <div className="field" style={{padding:'12px 14px', background:'rgba(245,213,72,0.04)', border:'1px dashed var(--primary-dim)', marginTop:12}}>
              <label className="field-label" htmlFor="post-created-at" style={{display:'block', marginBottom:6}}>
                업로드 시간 (관리자 전용 · 비워두면 현재 시간)
              </label>
              <input id="post-created-at" type="datetime-local" className="field-input"
                value={createdAt} onChange={(e) => setCreatedAt(e.target.value)}
                style={{maxWidth:280}}/>
              <div className="dim-2 mono" style={{fontSize:11, marginTop:4}}>
                KST 기준. 입력 시 게시글 표시 시각이 이 값으로 고정됨.
              </div>
            </div>
          )}

          {error && (
            <div role="alert" style={{padding:'12px 16px', background:'rgba(194,74,61,0.1)', border:'1px solid var(--danger)', color:'var(--danger)', fontSize:13, marginBottom:16}}>
              {error}
            </div>
          )}

          <div style={{display:'flex', gap:12, justifyContent:'flex-end', paddingTop:20, borderTop:'1px solid var(--line)', flexWrap:'wrap'}}>
            <button type="button" className="btn" onClick={onCancel}>취소</button>
            {/* v00.263.004 — 명시적 [임시저장] 버튼. 새 글 작성 시에만 노출 (수정 모드는 원본이 source). */}
            {!isEditing && (
              <button type="button" className="btn"
                onClick={() => {
                  try {
                    const hasContent = !!(title.trim() || bodyText.trim() || (tags && tags.length) || (images && images.length) || (attachments && attachments.length));
                    if (!hasContent) {
                      window.BGNJ_TOAST?.info?.('내용을 입력한 뒤 임시저장하세요.');
                      return;
                    }
                    const saved = window.BGNJ_DRAFTS?.save?.({
                      kind: 'post',
                      title, prefix, tags, images, attachments, bodyHtml, bodyText, categoryId,
                    });
                    const max = window.BGNJ_DRAFTS?.MAX_COUNT || 5;
                    window.BGNJ_TOAST?.success?.(`임시저장됐습니다. (최대 ${max}개 보관)`);
                  } catch (err) {
                    window.BGNJ_TOAST?.error?.('임시저장 실패: ' + (err?.message || err));
                  }
                }}>
                {/* v00.306.003 — 다른 버튼은 전부 글자만 쓴다. 여기만 이모지가 붙어 있었다. */}
                임시저장
              </button>
            )}
            <button type="submit" className="btn btn-gold" disabled={attachBusy}>
              {attachBusy ? "사진 올리는 중…" : (isEditing ? "수정 저장 →" : "게시하기 →")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// === Post Detail =========================================================
const PostDetail = ({ post, siblings, go, setPostId, user, onRefresh, onEdit, onPrefixClick }) => {
  const G = window.BGNJ_GUARD;
  // v00.294 — 사용자 보고 '글을 보고 나면 돌아올 방법이 없다'.
  // 상단 '← 목록으로' 하나뿐이라 긴 글에서는 화면 밖으로 밀려 보이지 않았다.
  // 목록에서 보던 순서(filtered)를 그대로 받아 이전/다음 글 + 하단 목록을 만든다.
  const sibList = Array.isArray(siblings) ? siblings : [];
  const sibIndex = sibList.findIndex((p) => String(p.id) === String(post.id));
  const prevPost = sibIndex > 0 ? sibList[sibIndex - 1] : null;
  const nextPost = sibIndex >= 0 && sibIndex < sibList.length - 1 ? sibList[sibIndex + 1] : null;
  // 하단 목록 — 현재 글 주변 최대 5개. 목록으로 돌아가지 않고도 다음 글로 넘어갈 수 있게.
  // v00.294.003 — 딥링크(#post-123)나 검색 중 진입이면 이 글이 목록에 없다(sibIndex === -1).
  // 그때 '주변 글' 이라고 부르면 거짓말이 되므로 최신 5개를 '다른 글' 로 보여준다.
  const inList = sibIndex >= 0;
  const nearby = React.useMemo(() => {
    if (sibList.length <= 1) return [];
    if (!inList) return sibList.slice(0, 5);
    const start = Math.max(0, Math.min(sibIndex - 2, sibList.length - 5));
    return sibList.slice(start, start + 5);
  }, [sibList, sibIndex, inList]);
  const [comment, setComment] = React.useState("");
  const [commentsList, setCommentsList] = React.useState(() => G.arr(() => window.BGNJ_COMMENTS?.list?.('post', post.id)));
  const [commentSort, setCommentSort] = React.useState('new');   // v00.307.000 — 기본 최신순
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [reportSubmitted, setReportSubmitted] = React.useState(false);
  const canManagePost = !!user && (user.isAdmin || post.authorId === user.id || post.author === user.name);

  // 좋아요 / 북마크 — 저장소 기반
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const liked = !!user && likes.includes(user.id);
  const likesCount = likes.length;
  const bookmarked = !!user && G.call(() => window.BGNJ_COMMUNITY?.isBookmarked?.(user.id, post.id), false);

  // v00.306.004 — 댓글은 BGNJ_COMMENTS 한 창구로. 대상은 ('post', 글번호).
  //   _remote 조건을 뗐다 — 서버에 없는 글에 댓글을 달 길은 어차피 없고,
  //   그 조건이 칼럼 댓글을 통째로 막고 있던 장본인이었다.
  React.useEffect(() => {
    setCommentsList(G.arr(() => window.BGNJ_COMMENTS?.list?.('post', post.id)));
    window.BGNJ_COMMENTS?.refresh?.('post', post.id)
      ?.then?.((next) => setCommentsList(Array.isArray(next) ? next : []))
      ?.catch?.(() => {});
    const onRefreshComments = (e) => {
      const d = e.detail || {};
      if (d.targetType === 'post' && String(d.targetId) === String(post.id)) {
        setCommentsList(window.BGNJ_COMMENTS.list('post', post.id));
      }
    };
    window.addEventListener('bgnj-comments-refresh', onRefreshComments);
    return () => window.removeEventListener('bgnj-comments-refresh', onRefreshComments);
  }, [post.id]);

  // v00.294.003 — 글이 바뀌면 맨 위로. 하단 '이전/다음 글' 은 페이지 끝에 있어서,
  // 스크롤을 그대로 두면 새 글의 **끝부분**에 도착한다(제목도 안 보인다).
  // 목록 → 상세 진입도 같은 문제가 있었다. 첫 렌더 포함 post.id 마다 실행한다.
  React.useEffect(() => {
    try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch { window.scrollTo(0, 0); }
  }, [post.id]);

  React.useEffect(() => {
    const key = `bgnj_viewed_post_${post.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch (_e) { console.warn('[bgnj] 저장소 읽기 — 실패 시 기본값 (CommunityPage.jsx:1789)', _e); }
    window.BGNJ_COMMUNITY.incrementViews(post.id);
    onRefresh?.();
  }, [post.id]);

  const requireLogin = async (label) => {
    if ((await window.BGNJ_CONFIRM(`${label}은(는) 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠어요?`, { danger: true }))) {
      go('login');
    }
  };

  // v00.262.003 — A3 더블탭 race 가드. 느린 네트워크에서 좋아요/북마크 빠르게 두 번
  // 누르면 optimistic toggle 결과가 race → 카운트/색상 inconsistent.
  const [likeBusy, setLikeBusy] = React.useState(false);
  const [bmkBusy, setBmkBusy] = React.useState(false);
  const handleLike = async () => {
    if (!user) return requireLogin('공감');
    if (likeBusy) return;
    setLikeBusy(true);
    try { await window.BGNJ_COMMUNITY.toggleLike(post.id, user.id); onRefresh?.(); }
    catch (err) { window.BGNJ_TOAST.error(`공감 처리 실패: ${err?.message || '알 수 없는 오류'}`); }
    finally { setLikeBusy(false); }
  };

  const handleBookmark = async () => {
    if (!user) return requireLogin('북마크');
    if (bmkBusy) return;
    setBmkBusy(true);
    try { await window.BGNJ_COMMUNITY.toggleBookmark(user.id, post.id); onRefresh?.(); }
    catch (err) { window.BGNJ_TOAST.error(`북마크 처리 실패: ${err?.message || '알 수 없는 오류'}`); }
    finally { setBmkBusy(false); }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.BGNJ_COMMUNITY.addReport({
        postId: post.id,
        postTitle: post.title,
        reporterId: user?.id || null,
        reporterName: user?.name || '익명',
        reason: reportReason,
      });
      setReportSubmitted(true);
      setReportReason("");
      setTimeout(() => { setReportOpen(false); setReportSubmitted(false); }, 1800);
    } catch (err) {
      window.BGNJ_TOAST.error(`신고 접수 실패: ${err?.message || '알 수 없는 오류'}`);
    }
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!user) return;
    const trimmed = comment.trim();
    if (!trimmed) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const next = window.BGNJ_COMMENTS.add('post', post.id, {
      author: user.name,
      authorId: user.id,
      authorEmail: user.email,
      date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      text: trimmed,
    });
    setCommentsList(next);

    // v00.314 — 여기 있던 addNotification 호출을 걷어냈다. **아무 일도 안 하는 함수였다**(no-op).
    //   알림은 댓글이 실제로 저장되는 자리, 즉 워커의 handleCommentCreate 가 만든다 —
    //   저장에 실패하면 알림도 안 간다. 화면에서 만들면 '저장은 실패했는데 알림은 갔다' 가 생긴다.

    onRefresh?.();
    setComment("");
  };

  const deletePost = async () => {
    if (!(await window.BGNJ_CONFIRM(`"${post.title}" 글을 삭제하시겠어요?`, { danger: true }))) return;
    window.BGNJ_COMMUNITY.deletePost(post.id);
    onRefresh?.();
    setPostId(null);
  };

  // v00.306.002 — 삭제는 되돌릴 수 없다. 손이 미끄러진 것과 지우겠다는 뜻을 갈라 놓는다.
  const deleteComment = async (commentId) => {
    const target = (Array.isArray(commentsList) ? commentsList : []).find((c) => String(c.id) === String(commentId));
    const peek = String(target?.text || '').trim().replace(/\s+/g, ' ').slice(0, 30);
    const msg = peek ? `"${peek}${peek.length >= 30 ? '…' : ''}" 댓글을 삭제하시겠어요?` : '이 댓글을 삭제하시겠어요?';
    if (!(await window.BGNJ_CONFIRM(msg, { danger: true }))) return;
    const next = window.BGNJ_COMMENTS.remove('post', post.id, commentId);
    setCommentsList(next);
    onRefresh?.();
  };

  return (
    <article className="section post-read">
      <div className="container post-read-container">
        {/* v00.294 — 사용자 요청 '목록으로가 더 잘 보이는 큰 버튼이었으면'.
            btn-ghost 12px 텍스트 링크 → 테두리 있는 큼직한 버튼 + 게시판 이름 병기.
            스크롤을 내려도 따라오도록 상단에 고정(sticky). */}
        <div className="post-back-bar">
          <button type="button" className="btn post-back-btn" onClick={() => setPostId(null)}>
            <span aria-hidden="true" style={{fontSize:16, lineHeight:1}}>←</span>
            <span>목록으로</span>
            {post.category && (
              <span className="mono dim-2 post-back-board">{window.BGNJ_BOARD_LABEL?.(post)}</span>
            )}
          </button>
        </div>

        <header style={{borderBottom:'1px solid var(--line-2)', paddingBottom:32, marginBottom:48}}>
          <div style={{display:'flex', gap:12, marginBottom:20, flexWrap:'wrap'}}>
            <span className="badge badge-gold">{window.BGNJ_BOARD_LABEL?.(post)}</span>
            {/* v00.304 — 말머리. 누르면 같은 시리즈 글만 모아 본다. */}
            {post.prefix && (
              <button type="button" className="badge post-prefix-badge"
                onClick={() => onPrefixClick?.(post.prefix)}
                title={`'${post.prefix}' 글 모아 보기`}>
                {post.prefix}
              </button>
            )}
            {post.hot && <span className="badge">HOT</span>}
            {post._userCreated && <span className="badge badge-gold">새 글</span>}
          </div>
          <h1 className="post-title" style={{
            fontFamily:'var(--font-display)',
            // v00.244 — PC 44 → 26 (~60% 사용자 요청). 모바일 도 28→22 동반 축소.
            // 게시글 본문(17px) 와 위계 균형: 제목 26 ÷ 본문 17 ≈ 1.5x.
            fontSize:'clamp(22px, 2vw, 26px)',
            fontWeight:500, lineHeight:1.3, letterSpacing:'-0.01em',
            marginBottom:24, textWrap:'balance'
          }}>{post.title}</h1>

          {post.tags?.length > 0 && (
            <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:16}}>
              {post.tags.map(t => <span key={t} className="tag-chip">#{t}</span>)}
            </div>
          )}

          <div style={{display:'flex', gap:24, alignItems:'center', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-3)', flexWrap:'wrap'}}>
            <span className="gold" style={{display:'inline-flex', alignItems:'center'}}>
              {post.author}
              <AuthorGradeBadge authorId={post.authorId} author={post.author} authorEmail={post.authorEmail}/>
            </span>
            {/* v00.197 — 사용자 보고 '글 작성 시분까지 보여줘'. createdAt 있으면 'YYYY.MM.DD HH:MM' 풀 표시. */}
            <time dateTime={(post.createdAt || post.date || '').toString()}>
              {post.createdAt
                ? window.BGNJ_FMT.kstShort(post.createdAt)
                : post.date}
            </time>
            <span>조회 {post.views ?? 0}</span>
            <span>댓글 {commentsList.length}</span>
            <span>공감 {likesCount}</span>
          </div>
        </header>

        {/* v00.243 — 사용자 요청 레이아웃: 제목 → 메타 → 이미지 슬라이드 → 본문 → 댓글.
            v00.242 응급 fix 로 body 안에 인코딩된 <div data-bgnj-attached-block><img/></div> 를
            추출해서 본문과 분리. 추출된 이미지는 ImageSlider 로, 본문은 cleanHtml 로. */}
        {(() => {
          const html = post.body?.html || '';
          // 추출 — data-bgnj-attached-block 컨테이너 제거 + 안의 img src 수집.
          let cleanHtml = html;
          const extractedImages = [];
          try {
            const blockRe = /<div[^>]*data-bgnj-attached-block="1"[^>]*>([\s\S]*?)<\/div>/gi;
            cleanHtml = html.replace(blockRe, (_, inner) => {
              const imgRe = /<img[^>]*src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*\/?>/gi;
              let m;
              while ((m = imgRe.exec(inner)) !== null) {
                extractedImages.push({ src: m[1], alt: m[2] || '' });
              }
              return ''; // 본문에서 제거.
            });
          } catch (_e) { console.warn('[bgnj] CommunityPage.jsx:1958 오류(무시하고 진행)', _e); }
          // post.images (v00.243+ schema 추가 후 정통 source) 우선 + 추출된 fallback.
          const slideImages = (Array.isArray(post.images) && post.images.length > 0)
            ? post.images
            : extractedImages;
          return (
            <>
              {/* 1) 이미지 슬라이드 — 본문 위. 사용자 요청 순서. */}
              {slideImages.length > 0 && (
                <section aria-label="첨부 이미지" style={{margin:'24px 0 32px'}}>
                  <ImageSlider images={slideImages}/>
                </section>
              )}
              {/* 2) 본문 (clean html — 추출된 이미지 block 제거됨). */}
              {cleanHtml ? (
                <div className="post-body" dangerouslySetInnerHTML={{__html: window.BGNJ_SAFE_HTML(cleanHtml)}}/>
              ) : post.body?.text ? (
                <div className="post-body" style={{whiteSpace:'pre-wrap'}}>{post.body.text}</div>
              ) : (
                <div className="post-body dim-2" style={{fontStyle:'italic'}}>본문이 비어있습니다.</div>
              )}
            </>
          );
        })()}

        {/* File attachments (v00.069) */}
        {post.attachments?.length > 0 && (
          <section aria-label="첨부 파일" style={{margin:'40px 0'}}>
            <div className="section-eyebrow" aria-hidden="true" style={{marginBottom:14}}>FILES · 첨부 파일 ({post.attachments.length})</div>
            <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8}}>
              {post.attachments.map((a, i) => (
                <li key={i} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 14px', border:'1px solid var(--line)', background:'var(--bg-2)', fontSize:13}}>
                  <ClipMark size={13} />
                  <span style={{flex:1, color:'var(--ink)'}}>{a.name}</span>
                  <span className="mono dim-2" style={{fontSize:11}}>{_fmtSize(a.size)}</span>
                  <a href={a.dataUrl} download={a.name}
                    className="btn btn-small" style={{fontSize:11, padding:'4px 10px'}}
                    aria-label={`${a.name} 다운로드`}>다운로드</a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Actions */}
        <div style={{margin:'60px 0', paddingTop:32, borderTop:'1px solid var(--line)'}}>
          <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
            <button type="button" className="btn" aria-pressed={liked}
              onClick={handleLike}
              style={{borderColor: liked ? 'var(--primary)' : undefined, color: liked ? 'var(--primary)' : undefined}}>
              <span aria-hidden="true">♥</span> 공감 <span aria-live="polite">{likesCount}</span>
            </button>
            <button type="button" className="btn" aria-pressed={bookmarked}
              onClick={handleBookmark}
              style={{borderColor: bookmarked ? 'var(--primary)' : undefined, color: bookmarked ? 'var(--primary)' : undefined}}>
              <span aria-hidden="true">{bookmarked ? '★' : '☆'}</span> 북마크
            </button>
            <button type="button" className="btn"
              onClick={() => {
                if (!user) return requireLogin('신고');
                setReportOpen((v) => !v);
              }}>
              신고
            </button>
            {canManagePost && (
              <>
                <button type="button" className="btn" onClick={() => onEdit(post)}>수정</button>
                <button type="button" className="btn" onClick={deletePost}
                  style={{borderColor:'var(--danger)', color:'var(--danger)'}}>삭제</button>
              </>
            )}
          </div>

          {reportOpen && (
            <form onSubmit={handleReportSubmit}
              style={{maxWidth:560, margin:'24px auto 0', padding:20, border:'1px solid var(--line)', background:'rgba(194,74,61,0.04)'}}>
              <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>REPORT · 신고 사유</div>
              {reportSubmitted ? (
                <div className="dim" style={{fontSize:13, lineHeight:1.7, padding:'8px 0', color:'var(--primary)'}}>
                  신고가 접수되었습니다. 운영자가 확인 후 처리합니다.
                </div>
              ) : (
                <>
                  <textarea
                    className="field-input"
                    placeholder="어떤 점이 문제인지 간단히 적어 주세요."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    style={{minHeight:80, resize:'vertical', marginBottom:12}}/>
                  <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
                    <button type="button" className="btn btn-small" onClick={() => setReportOpen(false)}>취소</button>
                    <button type="submit" className="btn btn-small"
                      style={{borderColor:'var(--danger)', color:'var(--danger)'}}>신고 접수</button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

        {/* Comments */}
        <section aria-labelledby="comments-heading">
          <h2 id="comments-heading" className="ko-serif" style={{fontSize:22, marginBottom:24, display:'flex', alignItems:'center', flexWrap:'wrap', gap:4}}>
            <span>댓글 <span className="gold">{commentsList.length}</span></span>
            <CommentSortToggle value={commentSort} onChange={setCommentSort}/>
          </h2>

          {user ? (
            <form onSubmit={submitComment} style={{marginBottom:32}}>
              <label htmlFor="comment-input" className="sr-only">댓글 입력</label>
              <MentionTextarea
                value={comment}
                onChange={setComment}
                authors={(Array.isArray(commentsList) ? commentsList : []).map((c) => c.author).concat(post.author).filter(Boolean)}
                rows={4}
                placeholder="생각을 나누어 주세요... (@를 입력하면 멘션 자동완성)"
                style={{minHeight:100, resize:'vertical', marginBottom:12}}/>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span className="dim-2 mono" style={{fontSize:11}}>{user.name}(으)로 등록</span>
                <button type="submit" className="btn btn-gold btn-small" disabled={!comment.trim()}>등록</button>
              </div>
            </form>
          ) : (
            <div className="card" style={{padding:24, textAlign:'center', marginBottom:32, background:'rgba(245,213,72,0.04)'}}>
              <p className="dim" style={{fontSize:14, marginBottom:16}}>
                댓글 작성은 <strong className="gold">로그인한 회원</strong>만 가능합니다.
              </p>
              <div style={{display:'flex', gap:10, justifyContent:'center'}}>
                <button type="button" className="btn btn-gold btn-small" onClick={() => go('login')}>로그인</button>
                <button type="button" className="btn btn-small" onClick={() => go('signup')}>회원가입</button>
              </div>
            </div>
          )}

          <CommentTree
            comments={commentsList}
            user={user}
            sort={commentSort}
            onLike={(commentId) => {
              if (!user) return;
              setCommentsList(window.BGNJ_COMMENTS.toggleLike('post', post.id, commentId));
            }}
            onDelete={deleteComment}
            onReply={(parentId, text) => {
              if (!user || !text.trim()) return;
              const now = new Date();
              const pad = (n) => String(n).padStart(2, '0');
              const next = window.BGNJ_COMMENTS.add('post', post.id, {
                author: user.name,
                authorId: user.id,
                authorEmail: user.email,
                date: `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
                text: text.trim(),
                parentId,
              });
              setCommentsList(next);
              // v00.314 — 답글 알림도 워커가 만든다(부모 댓글 작성자에게도 간다). 화면 호출은 no-op 이었다.
              onRefresh?.();
            }}
          />
        </section>

        {/* v00.294 — 하단 글 이동. 긴 글 끝에서 상단 버튼까지 올라갈 필요 없이
            이전/다음 글과 목록으로 바로 갈 수 있게 한다. */}
        <nav aria-label="글 이동" style={{marginTop:64, paddingTop:32, borderTop:'1px solid var(--line)'}}>
          {inList && (
          <div className="post-nav-pair" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20}}>
            <button type="button" className="btn"
              disabled={!prevPost}
              onClick={() => prevPost && setPostId(prevPost.id)}
              style={{textAlign:'left', padding:'14px 16px', opacity: prevPost ? 1 : 0.4}}>
              <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', display:'block', marginBottom:6}}>← 이전 글</span>
              <span style={{fontSize:13, color:'var(--ink)', wordBreak:'keep-all', overflowWrap:'break-word'}}>
                {prevPost ? prevPost.title : '이전 글이 없습니다'}
              </span>
            </button>
            <button type="button" className="btn"
              disabled={!nextPost}
              onClick={() => nextPost && setPostId(nextPost.id)}
              style={{textAlign:'right', padding:'14px 16px', opacity: nextPost ? 1 : 0.4}}>
              <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', display:'block', marginBottom:6}}>다음 글 →</span>
              <span style={{fontSize:13, color:'var(--ink)', wordBreak:'keep-all', overflowWrap:'break-word'}}>
                {nextPost ? nextPost.title : '다음 글이 없습니다'}
              </span>
            </button>
          </div>
          )}

          {nearby.length > 0 && (
            <>
            <div className="section-eyebrow" aria-hidden="true" style={{marginBottom:10}}>
              {inList ? 'MORE · 이 게시판의 다른 글' : 'MORE · 최근 글'}
            </div>
            <ul style={{listStyle:'none', padding:0, margin:'0 0 24px', border:'1px solid var(--line)', background:'var(--bg-2)'}}>
              {nearby.map((p) => {
                const isCurrent = String(p.id) === String(post.id);
                return (
                  <li key={p.id} style={{borderBottom:'1px solid var(--line)'}}>
                    <button type="button"
                      onClick={() => !isCurrent && setPostId(p.id)}
                      aria-current={isCurrent ? 'true' : undefined}
                      style={{
                        width:'100%', display:'flex', alignItems:'center', gap:10,
                        padding:'12px 14px', background:'transparent', border:'none',
                        textAlign:'left', cursor: isCurrent ? 'default' : 'pointer',
                        fontSize:13, color: isCurrent ? 'var(--ink)' : 'var(--ink-2)',
                        fontWeight: isCurrent ? 600 : 400,
                      }}>
                      <span aria-hidden="true" className="mono dim-2" style={{fontSize:10}}>{isCurrent ? '▶' : '·'}</span>
                      <span style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.title}</span>
                      <span className="mono dim-2" style={{fontSize:10}}>{p.author}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            </>
          )}

          <div style={{display:'flex', justifyContent:'center'}}>
            <button type="button" className="btn btn-gold" onClick={() => setPostId(null)}
              style={{padding:'12px 32px'}}>
              목록으로 돌아가기
            </button>
          </div>
        </nav>
      </div>
    </article>
  );
};

// (window 노출 제거 — ESM 전환)

// v00.287 ESM (main) — 모듈 export (window 병행).
export { CommentTree, CommentSortToggle, ContentLoadNotice };

// v00.287 ESM (main) — 라우터용 export (window 병행).
export { CommunityPage };

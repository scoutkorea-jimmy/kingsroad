// 뱅기노자 미디어 갤러리 — v00.235 (v00.237 전면 개선)
// 사용자 요청 변천:
//   v00.235 — 강연/투어 사진 최대 10장 + 출처 + 대표사진.
//   v00.237 — 다중 파일 업로드 + drag & drop + 라벨 커스터마이즈 (포스터 / 현장 사진 분리).
//
// 두 컴포넌트:
//   1) MediaGalleryEditor — admin 모달 안에서 사진 추가/삭제/출처 입력/대표 지정.
//   2) MediaGalleryView   — 공개 페이지에서 대표사진 cover + 추가 사진 그리드 표시.
//
// 저장 위치: site_content_kv.lecturePages[id].images (포스터) / .photos (현장사진)
//          / tourPages[id].images.
//   각 image: { url: string, credit?: string, isPrimary?: boolean }
// 대표사진은 1장만 — UI 가 라디오로 강제. 저장 시 isPrimary 가 여러 개여도 첫 번째만 인정.

const MAX_IMAGES = 10;

// 대표사진 단일화 헬퍼 — isPrimary 가 둘 이상이거나 0개면 첫 번째를 대표로 강제 (showPrimary=true 일 때).
const _normalizeImages = (raw, { showPrimary = true } = {}) => {
  if (!Array.isArray(raw)) return [];
  const cleaned = raw
    .filter((it) => it && typeof it === 'object' && typeof it.url === 'string' && it.url)
    .slice(0, MAX_IMAGES)
    .map((it) => ({
      url: String(it.url),
      credit: String(it.credit || ''),
      isPrimary: !!it.isPrimary,
    }));
  if (cleaned.length === 0) return [];
  if (!showPrimary) {
    // 현장 사진처럼 대표 개념이 없는 갤러리 — isPrimary 모두 false.
    cleaned.forEach((it) => { it.isPrimary = false; });
    return cleaned;
  }
  const primaryCount = cleaned.filter((it) => it.isPrimary).length;
  if (primaryCount === 0) cleaned[0].isPrimary = true;
  else if (primaryCount > 1) {
    let firstSeen = false;
    cleaned.forEach((it) => {
      if (it.isPrimary && !firstSeen) { firstSeen = true; }
      else { it.isPrimary = false; }
    });
  }
  return cleaned;
};

// 대표사진을 배열 0번으로 끌어올림 (표시용).
const _withPrimaryFirst = (images) => {
  const norm = _normalizeImages(images);
  const idx = norm.findIndex((it) => it.isPrimary);
  if (idx <= 0) return norm;
  return [norm[idx], ...norm.slice(0, idx), ...norm.slice(idx + 1)];
};

// 안정 unique id (라디오 name 충돌 방지) — 한 모달에 갤러리 둘 이상.
let _galleryUid = 0;
const _nextUid = () => `bgnj-gallery-${++_galleryUid}`;

// v00.237 — 다중 파일 순차 업로드. R2 우선, 실패 시 dataURI 폴백 (admin shared helper).
// 진행률 누적 (0/N → N/N) 으로 사용자 피드백.
const _uploadFiles = async (files, folder, onProgress) => {
  if (typeof window.pickImageWithR2Fallback !== 'function') {
    throw new Error('업로드 헬퍼가 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.');
  }
  // pickImageWithR2Fallback 가 e.target.files[0] 만 처리하므로 fake event 로 한 장씩 호출.
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file || !file.type?.startsWith?.('image/')) continue;
    const fakeEvent = { target: { files: [file], value: '' } };
    try {
      const url = await window.pickImageWithR2Fallback(fakeEvent, { folder });
      if (url) urls.push(url);
    } catch (err) {
      try { console.warn('[MediaGalleryEditor] 한 장 업로드 실패 (다음 장 진행):', err); } catch {}
    }
    onProgress?.(i + 1, files.length);
  }
  return urls;
};

const MediaGalleryEditor = ({
  value,
  onChange,
  folder = 'gallery',
  label = '사진 갤러리',
  helpText = '',
  showPrimary = true,
  max = MAX_IMAGES,
}) => {
  const images = _normalizeImages(value, { showPrimary });
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState({ done: 0, total: 0 });
  const [dragOver, setDragOver] = React.useState(false);
  const [adminTick, setAdminTick] = React.useState(0);
  const radioName = React.useMemo(_nextUid, []);
  const limit = Math.min(MAX_IMAGES, Math.max(1, max));

  // admin 번들 lazy-load 트리거 (pickImageWithR2Fallback 미존재 시).
  React.useEffect(() => {
    if (window.pickImageWithR2Fallback) return;
    const onLoaded = () => setAdminTick((v) => v + 1);
    window.addEventListener('bgnj-admin-scripts-loaded', onLoaded);
    if (typeof window.BGNJ_LOAD_ADMIN === 'function') {
      window.BGNJ_LOAD_ADMIN().catch(() => {});
    }
    return () => window.removeEventListener('bgnj-admin-scripts-loaded', onLoaded);
  }, []);

  // v00.237 — 다중 파일 + drag & drop 모두 처리하는 공통 핸들러.
  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const remaining = limit - images.length;
    if (remaining <= 0) {
      window.BGNJ_TOAST?.error?.(`사진은 최대 ${limit}장까지 추가할 수 있습니다.`);
      return;
    }
    const accepted = Array.from(fileList).filter((f) => f && f.type?.startsWith?.('image/')).slice(0, remaining);
    if (accepted.length === 0) return;
    if (fileList.length > accepted.length) {
      window.BGNJ_TOAST?.error?.(`최대 ${limit}장 — ${accepted.length}장만 추가됩니다.`);
    }
    setBusy(true);
    setProgress({ done: 0, total: accepted.length });
    try {
      const urls = await _uploadFiles(accepted, folder, (done, total) => setProgress({ done, total }));
      if (urls.length === 0) {
        window.BGNJ_TOAST?.error?.('업로드 실패 — 이미지를 다시 확인해 주세요.');
        return;
      }
      const next = images.slice();
      urls.forEach((url) => {
        // showPrimary 갤러리에서 첫 사진이면 자동 대표.
        next.push({ url, credit: '', isPrimary: showPrimary && next.length === 0 });
      });
      onChange?.(_normalizeImages(next, { showPrimary }));
      window.BGNJ_TOAST?.success?.(`${urls.length}장 추가됐습니다.`);
    } catch (err) {
      window.BGNJ_TOAST?.error?.(err?.message || '업로드 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
      setProgress({ done: 0, total: 0 });
    }
  };

  const onPick = (e) => { handleFiles(e.target.files); e.target.value = ''; };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (busy) return;
    handleFiles(e.dataTransfer?.files);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!busy) setDragOver(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const updateAt = (idx, patch) => {
    const next = images.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange?.(_normalizeImages(next, { showPrimary }));
  };

  const setPrimary = (idx) => {
    const next = images.map((it, i) => ({ ...it, isPrimary: i === idx }));
    onChange?.(next);
  };

  const removeAt = (idx) => {
    const next = images.slice();
    next.splice(idx, 1);
    onChange?.(_normalizeImages(next, { showPrimary }));
  };

  const moveUp = (idx) => {
    if (idx <= 0) return;
    const next = images.slice();
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange?.(_normalizeImages(next, { showPrimary }));
  };
  const moveDown = (idx) => {
    if (idx >= images.length - 1) return;
    const next = images.slice();
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange?.(_normalizeImages(next, { showPrimary }));
  };

  const isFull = images.length >= limit;
  // v00.245 — 다크모드에서 dropzone bg(--bg)가 모달 bg(--bg) 와 동일 #0F172A 라
  // 평면화돼 깨진 인상. --bg-3 으로 한 단 밝게(라이트도 동일 분리). dragOver 시 옐로우 tint
  // 강화(0.08→0.12) + border solid 로 또렷.
  const dropZoneStyle = {
    // v00.282 — label 기본 display:inline 탓에 border/배경이 첫 줄박스(왼쪽 세로 띠)만
    // 감싸고 내부 블록 div 가 박스 밖으로 흘러 helpText 와 겹쳐 보이던 깨짐 수정. block 으로 강제.
    display: 'block',
    border: `2px ${dragOver ? 'solid' : 'dashed'} ${dragOver ? 'var(--primary)' : 'var(--line-2)'}`,
    borderRadius: 6,
    padding: '20px 16px',
    textAlign: 'center',
    background: dragOver ? 'rgba(245,213,72,0.12)' : 'var(--bg-3)',
    transition: 'background .15s, border-color .15s',
    cursor: isFull || busy ? 'not-allowed' : 'pointer',
    marginBottom: 12,
  };

  return (
    <div style={{ border: '1px solid var(--line-2)', borderRadius: 6, padding: 14, background: 'var(--bg-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <strong style={{ fontSize: 13 }}>{label}</strong>
          <span className="dim mono" style={{ fontSize: 10, marginLeft: 8, letterSpacing: '0.1em' }}>
            {images.length} / {limit}
          </span>
        </div>
        {busy && progress.total > 0 && (
          <span className="mono" style={{ fontSize: 10, color: 'var(--secondary)', letterSpacing: '0.1em' }}>
            업로드 중 {progress.done} / {progress.total}
          </span>
        )}
      </div>
      {helpText && (
        <p className="dim" style={{ fontSize: 11, lineHeight: 1.6, marginBottom: 10 }}>{helpText}</p>
      )}
      {/* v00.237 — drop zone (drag&drop) + 클릭 시 파일 선택. multiple 지원.
          v00.239 — 업로드 중 동적 피드백 강화 (사용자 요청). spinner + 진행률 바 + 퍼센트. */}
      <label
        onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} onDragEnd={onDragLeave}
        style={dropZoneStyle}>
        <input type="file" accept="image/*" multiple onChange={onPick}
          disabled={busy || isFull}
          style={{ display: 'none' }}/>
        {busy ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            {/* CSS-only spinner — primary 옐로우 ring */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '3px solid var(--line)',
              borderTopColor: 'var(--primary)',
              animation: 'bgnj-spin 0.7s linear infinite',
            }} aria-hidden="true"/>
            <div className="ko-serif" style={{ fontSize: 14, color: 'var(--secondary)', fontWeight: 600 }}>
              사진 업로드 중… {progress.total > 0 && `${progress.done} / ${progress.total}`}
            </div>
            {progress.total > 0 && (
              <div style={{ width: '70%', maxWidth: 260, height: 6, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.round((progress.done / progress.total) * 100)}%`,
                  height: '100%', background: 'var(--primary)',
                  transition: 'width .25s ease',
                }}/>
              </div>
            )}
            <div className="dim mono" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
              R2 업로드 — 잠시만 기다려 주세요
            </div>
          </div>
        ) : (
          <>
            <div className="ko-serif" style={{ fontSize: 14, marginBottom: 4, color: 'var(--ink)' }}>
              {isFull ? `최대 ${limit}장 도달` : (dragOver ? '여기에 놓으세요' : '＋ 사진 추가 (클릭 또는 드래그)')}
            </div>
            <div className="dim mono" style={{ fontSize: 10, letterSpacing: '0.05em' }}>
              {isFull
                ? '한 장 삭제 후 추가 가능'
                : `여러 장 한 번에 가능 · 한 장당 R2 5MB / 폴백 1.5MB · 남은 슬롯 ${limit - images.length}장`}
            </div>
          </>
        )}
      </label>
      {images.length === 0 ? (
        <p className="dim" style={{ fontSize: 12, lineHeight: 1.6, padding: '4px 4px 0' }}>
          아직 등록된 사진이 없습니다.
          {showPrimary && ' 첫 사진이 자동으로 대표사진이 되며, 라디오로 변경 가능합니다.'}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
          {images.map((img, i) => (
            <li key={img.url + i} style={{
              display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 12,
              padding: 8, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 4, alignItems: 'center',
            }}>
              <div style={{ width: 88, height: 64, overflow: 'hidden', borderRadius: 3, background: 'var(--bg-3)' }}>
                <img src={img.url} alt={`${label} ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
              </div>
              <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                <input className="field-input" type="text"
                  placeholder="출처 (예: 사진 © 김작가 / Unsplash)"
                  value={img.credit}
                  onChange={(e) => updateAt(i, { credit: e.target.value })}
                  style={{ padding: '6px 10px', fontSize: 12 }}/>
                {showPrimary && (
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-2)', cursor: 'pointer' }}>
                    <input type="radio" name={radioName}
                      checked={!!img.isPrimary}
                      onChange={() => setPrimary(i)}
                      style={{ accentColor: 'var(--primary)' }}/>
                    <span>대표사진</span>
                    {img.isPrimary && (
                      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--secondary)', marginLeft: 4 }}>★ COVER</span>
                    )}
                  </label>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button type="button" className="btn btn-small"
                  onClick={() => moveUp(i)} disabled={i === 0}
                  style={{ padding: '2px 8px', fontSize: 11, opacity: i === 0 ? 0.4 : 1 }}>
                  ↑
                </button>
                <button type="button" className="btn btn-small"
                  onClick={() => moveDown(i)} disabled={i === images.length - 1}
                  style={{ padding: '2px 8px', fontSize: 11, opacity: i === images.length - 1 ? 0.4 : 1 }}>
                  ↓
                </button>
                <button type="button" className="btn btn-small"
                  onClick={() => removeAt(i)}
                  style={{ padding: '2px 8px', fontSize: 11, color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 공개 페이지용 표시 컴포넌트.
// 표시 우선순위: 대표사진을 cover slot 에 배치 (caller 가 별도로 cover 표시 — 본 컴포넌트는 갤러리 그리드만).
// 갤러리는 1장이면 미노출 (cover 와 중복), 2장 이상일 때 그리드 표시.
// v00.237 — withCover=false 면 0번 사진도 그리드에 포함 (현장 사진 등 cover 와 분리된 갤러리).
const MediaGalleryView = ({ images, title, sectionLabel = '사진', withCover = true }) => {
  const norm = withCover ? _withPrimaryFirst(images) : _normalizeImages(images, { showPrimary: false });
  if (!Array.isArray(norm) || norm.length === 0) return null;
  const grid = withCover ? norm.slice(1) : norm; // withCover=true → 0번은 cover 에 사용됨.
  if (grid.length === 0) return null;
  return (
    <section aria-label={`${title || ''} ${sectionLabel}`} style={{ marginTop: 24, marginBottom: 32 }}>
      <h3 className="ko-serif" style={{ fontSize: 18, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
        {sectionLabel} <span className="dim-2 mono" style={{ fontSize: 11, marginLeft: 6 }}>{grid.length}장</span>
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {grid.map((img, i) => (
          <figure key={img.url + i} style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ aspectRatio: '4/3', background: 'var(--bg-2)', overflow: 'hidden', borderRadius: 3 }}>
              <img src={img.url} alt={img.credit || `${title || sectionLabel} ${i + 1}`}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
            </div>
            {img.credit && (
              <figcaption className="dim mono" style={{ fontSize: 10, letterSpacing: '0.05em', marginTop: 6, lineHeight: 1.5 }}>
                {img.credit}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
};

// 헬퍼도 export — caller 가 cover URL 추출용.
const pickPrimaryImage = (images) => {
  const norm = _normalizeImages(images);
  return norm.find((it) => it.isPrimary) || norm[0] || null;
};

Object.assign(window, {
  MediaGalleryEditor,
  MediaGalleryView,
  pickPrimaryImage,
  BGNJ_GALLERY_MAX: MAX_IMAGES,
});

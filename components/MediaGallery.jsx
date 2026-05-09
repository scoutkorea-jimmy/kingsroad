// 뱅기노자 미디어 갤러리 — v00.235
// 사용자 요청: 강연/투어에 사진 최대 10장 + 사진마다 출처 + 대표사진 1장 설정.
//
// 두 컴포넌트:
//   1) MediaGalleryEditor — admin 모달 안에서 사진 추가/삭제/출처 입력/대표 지정.
//   2) MediaGalleryView   — 공개 페이지에서 대표사진 cover + 추가 사진 그리드 표시.
//
// 저장 위치: site_content_kv.lecturePages[id].images / tourPages[id].images.
//   각 image: { url: string, credit?: string, isPrimary?: boolean }
// 대표사진은 1장만 — UI 가 라디오로 강제. 저장 시 isPrimary 가 여러 개여도 첫 번째만 인정.
//
// 업로드: 기존 pickImageWithR2Fallback (admin 번들의 AdminShared) 사용.
//   admin 번들이 lazy-load 라 첫 진입 시 미존재 → BGNJ_LOAD_ADMIN() 트리거.

const MAX_IMAGES = 10;

// 대표사진 단일화 헬퍼 — isPrimary 가 둘 이상이거나 0개면 첫 번째를 대표로 강제.
const _normalizeImages = (raw) => {
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

const MediaGalleryEditor = ({ value, onChange, folder = 'gallery' }) => {
  const images = _normalizeImages(value);
  const [busy, setBusy] = React.useState(false);
  const [adminTick, setAdminTick] = React.useState(0);
  const fileInputRef = React.useRef(null);

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

  const handlePick = async (e) => {
    if (images.length >= MAX_IMAGES) {
      window.BGNJ_TOAST?.error?.(`사진은 최대 ${MAX_IMAGES}장까지 추가할 수 있습니다.`);
      e.target.value = '';
      return;
    }
    if (typeof window.pickImageWithR2Fallback !== 'function') {
      window.BGNJ_TOAST?.error?.('업로드 헬퍼가 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.');
      e.target.value = '';
      return;
    }
    setBusy(true);
    try {
      const url = await window.pickImageWithR2Fallback(e, { folder });
      if (!url) return;
      const next = images.slice();
      // 첫 사진이면 자동으로 대표.
      next.push({ url, credit: '', isPrimary: next.length === 0 });
      onChange?.(_normalizeImages(next));
    } finally {
      setBusy(false);
    }
  };

  const updateAt = (idx, patch) => {
    const next = images.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange?.(_normalizeImages(next));
  };

  const setPrimary = (idx) => {
    const next = images.map((it, i) => ({ ...it, isPrimary: i === idx }));
    onChange?.(next);
  };

  const removeAt = (idx) => {
    const next = images.slice();
    next.splice(idx, 1);
    onChange?.(_normalizeImages(next));
  };

  const moveUp = (idx) => {
    if (idx <= 0) return;
    const next = images.slice();
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange?.(_normalizeImages(next));
  };

  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 6, padding: 14, background: 'var(--bg-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <strong style={{ fontSize: 13 }}>사진 갤러리</strong>
          <span className="dim mono" style={{ fontSize: 10, marginLeft: 8, letterSpacing: '0.1em' }}>
            {images.length} / {MAX_IMAGES}
          </span>
        </div>
        <label className="btn btn-small" style={{ cursor: images.length >= MAX_IMAGES ? 'not-allowed' : 'pointer', opacity: busy || images.length >= MAX_IMAGES ? 0.55 : 1 }}>
          {busy ? '업로드 중...' : '＋ 사진 추가'}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePick}
            disabled={busy || images.length >= MAX_IMAGES}
            style={{ display: 'none' }}/>
        </label>
      </div>
      {images.length === 0 ? (
        <p className="dim" style={{ fontSize: 12, lineHeight: 1.6, padding: '12px 4px' }}>
          아직 등록된 사진이 없습니다. 위 버튼으로 최대 {MAX_IMAGES}장까지 추가할 수 있어요.
          첫 사진이 자동으로 대표사진이 되며, 라디오로 변경 가능합니다.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
          {images.map((img, i) => (
            <li key={img.url + i} style={{
              display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 12,
              padding: 8, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 4, alignItems: 'center',
            }}>
              <div style={{ width: 88, height: 64, overflow: 'hidden', borderRadius: 3, background: 'var(--bg-3)' }}>
                <img src={img.url} alt={`사진 ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
              </div>
              <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                <input className="field-input" type="text"
                  placeholder="출처 (예: 사진 © 김작가 / Unsplash)"
                  value={img.credit}
                  onChange={(e) => updateAt(i, { credit: e.target.value })}
                  style={{ padding: '6px 10px', fontSize: 12 }}/>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-2)', cursor: 'pointer' }}>
                  <input type="radio" name="gallery-primary"
                    checked={!!img.isPrimary}
                    onChange={() => setPrimary(i)}
                    style={{ accentColor: 'var(--primary)' }}/>
                  <span>대표사진</span>
                  {img.isPrimary && (
                    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--secondary)', marginLeft: 4 }}>★ COVER</span>
                  )}
                </label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button type="button" className="btn btn-small"
                  onClick={() => moveUp(i)} disabled={i === 0}
                  style={{ padding: '2px 8px', fontSize: 11, opacity: i === 0 ? 0.4 : 1 }}>
                  ↑
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
const MediaGalleryView = ({ images, title }) => {
  const norm = _withPrimaryFirst(images);
  if (!Array.isArray(norm) || norm.length < 2) return null;
  // 대표 제외한 나머지 (cover 에 이미 사용됨).
  const rest = norm.slice(1);
  return (
    <section aria-label={`${title || ''} 추가 사진`} style={{ marginTop: 24, marginBottom: 32 }}>
      <h3 className="ko-serif" style={{ fontSize: 18, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
        사진 <span className="dim-2 mono" style={{ fontSize: 11, marginLeft: 6 }}>{rest.length}장</span>
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {rest.map((img, i) => (
          <figure key={img.url + i} style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ aspectRatio: '4/3', background: 'var(--bg-2)', overflow: 'hidden', borderRadius: 3 }}>
              <img src={img.url} alt={img.credit || `${title || '사진'} ${i + 2}`}
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

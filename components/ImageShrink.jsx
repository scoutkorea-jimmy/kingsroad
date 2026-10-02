// HEIC/HEIF는 JPG로 변환하고, 업로드 한도를 넘는 사진은 자동 축소한다.
// 한도 안의 큰 사진만 선택적으로 축소 여부를 묻는다. GIF 애니메이션은 보존한다.
//
// EXIF 방향 주의:
//   캔버스로 다시 그리면 EXIF 회전 정보가 사라져 사진이 눕는다.
//   <img> 는 최신 브라우저가 EXIF 를 적용해 렌더하므로(Chrome 81+ / Safari 13.4+)
//   img 를 거쳐 그리면 이미 바로 선 상태다. createImageBitmap 의 imageOrientation 은
//   Safari 지원이 늦어 쓰지 않는다.
//
// GIF 는 건드리지 않는다 — 다시 그리면 움직임이 죽는다.

const _MB = 1024 * 1024;
const _fmtMB = (bytes) => `${(Number(bytes || 0) / _MB).toFixed(1)}MB`;

const isHeicFile = (file) => /\.(heic|heif)$/i.test(file?.name || '') ||
  /^image\/(heic|heif)(-sequence)?$/i.test(file?.type || '');
const isImageFile = (file) => String(file?.type || '').startsWith('image/') ||
  /\.(jpe?g|png|gif|webp|svg|avif|ico|heic|heif)$/i.test(file?.name || '');

let decoderLoad = null;
const loadHeicDecoder = () => {
  if (window.BGNJ_HEIC_DECODER?.convert) return Promise.resolve(window.BGNJ_HEIC_DECODER);
  if (decoderLoad) return decoderLoad;
  decoderLoad = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const appScript = document.querySelector('script[src*="dist/app.js"]');
    const src = new URL(appScript?.src || '/dist/app.js', location.href);
    src.pathname = src.pathname.replace(/app\.js$/, 'heic.js');
    script.src = src.href;
    script.async = true;
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      decoderLoad = null;
      reject(new Error('사진 변환 기능을 불러오지 못했습니다. 인터넷 연결을 확인하고 다시 선택해 주세요.'));
    };
    const timer = setTimeout(fail, 30_000);
    script.onerror = fail;
    script.onload = () => {
      clearTimeout(timer);
      if (!window.BGNJ_HEIC_DECODER?.convert) { fail(); return; }
      resolve(window.BGNJ_HEIC_DECODER);
    };
    document.head.appendChild(script);
  });
  return decoderLoad;
};

// 여러 장을 동시에 디코딩하면 휴대폰 메모리가 급증한다. 한 장씩, 같은 File은 한 번만.
const preparedFiles = new WeakMap();
let conversionQueue = Promise.resolve();
const prepareFile = (file) => {
  if (!file) return Promise.reject(new Error('파일이 없습니다.'));
  const icon = /\.ico$/i.test(file?.name || '') || /^image\/(x-icon|vnd.microsoft.icon)$/i.test(file?.type || '');
  if (!isHeicFile(file) && !icon) return Promise.resolve(file);
  if (preparedFiles.has(file)) return preparedFiles.get(file);
  const pending = conversionQueue.then(async () => {
    if (file.size > 50 * _MB) throw new Error('변환할 이미지는 한 장에 최대 50MB까지 가능합니다.');
    // R2가 ICO 확장자를 받지 않으므로 기존 파비콘 선택 기능은 투명 PNG로 보존한다.
    if (icon) {
      // PNG가 들어 있는 ICO는 Safari의 <img> 디코더를 거치지 않고 원본 PNG를 꺼낸다.
      const bytes = new Uint8Array(await file.arrayBuffer());
      const view = new DataView(bytes.buffer);
      const pngs = [];
      if (bytes.length >= 6 && view.getUint16(0, true) === 0 && view.getUint16(2, true) === 1) {
        const count = Math.min(view.getUint16(4, true), 256);
        for (let i = 0; i < count; i++) {
          const entry = 6 + i * 16;
          if (entry + 16 > bytes.length) break;
          const length = view.getUint32(entry + 8, true);
          const offset = view.getUint32(entry + 12, true);
          if (length >= 8 && offset >= 6 + count * 16 && offset + length <= bytes.length &&
            [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[offset + index] === value)) {
            pngs.push({ offset, length, edge: bytes[entry] || 256 });
          }
        }
      }
      if (pngs.length) {
        const png = pngs.sort((a, b) => b.edge - a.edge)[0];
        return new File([bytes.slice(png.offset, png.offset + png.length)], `${String(file.name || 'favicon').replace(/\.[^.]+$/, '')}.png`, { type: 'image/png', lastModified: file.lastModified });
      }
      const { img, revoke } = await _loadImage(file);
      const canvas = document.createElement('canvas');
      try {
        const scale = Math.min(1, 512 / Math.max(img.naturalWidth, img.naturalHeight));
        canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('파비콘을 변환하지 못했습니다. PNG로 저장해 선택해 주세요.');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob?.size) throw new Error('파비콘을 변환하지 못했습니다. PNG로 저장해 선택해 주세요.');
        return new File([blob], `${String(file.name || 'favicon').replace(/\.[^.]+$/, '')}.png`, { type: 'image/png', lastModified: file.lastModified });
      } finally { revoke(); canvas.width = 1; canvas.height = 1; }
    }
    // 사진 선택기가 JPEG로 변환하면서 원래 .HEIC 이름을 남기는 경우도 있다.
    const signature = new Uint8Array(await file.slice(0, 3).arrayBuffer());
    if (signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff) {
      const name = String(file.name || 'image').replace(/\.[^.]+$/, '');
      return new File([file], `${name}.jpg`, { type: 'image/jpeg', lastModified: file.lastModified });
    }
    window.BGNJ_TOAST?.info?.('아이폰 사진을 JPG로 변환하고 있습니다.');
    try {
      const decoder = await loadHeicDecoder();
      let timer;
      const blob = await Promise.race([
        decoder.convert({ blob: file, type: 'image/jpeg', quality: 0.9 }),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('사진 변환 시간이 초과되었습니다.')), 90_000); }),
      ]).finally(() => clearTimeout(timer));
      if (!blob?.size || blob.type !== 'image/jpeg') throw new Error('JPG 변환 결과가 올바르지 않습니다.');
      const name = String(file.name || 'image').replace(/\.[^.]+$/, '');
      return new File([blob], `${name}.jpg`, { type: 'image/jpeg', lastModified: file.lastModified || Date.now() });
    } catch (cause) {
      const err = new Error(`'${file.name || '사진'}'을(를) JPG로 변환하지 못했습니다. 사진 앱에서 JPG로 내보내 다시 선택해 주세요.`);
      err.code = 'HEIC_CONVERSION_FAILED';
      err.cause = cause;
      throw err;
    }
  });
  preparedFiles.set(file, pending);
  conversionQueue = pending.catch(() => { preparedFiles.delete(file); });
  return pending;
};

// 줄여도 되는 형식인가. GIF 는 애니메이션 때문에 제외.
const _isShrinkable = (file) => {
  const t = String(file?.type || '').toLowerCase();
  return /^(image\/(jpeg|jpg|png|webp))$/.test(t) || /\.(jpe?g|png|webp)$/i.test(file?.name || '');
};

const _loadImage = (file) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  const fail = () => { clearTimeout(timer); URL.revokeObjectURL(url); reject(new Error('이미지를 읽을 수 없습니다.')); };
  const timer = setTimeout(fail, 30_000);
  img.onload = () => { clearTimeout(timer); resolve({ img, revoke: () => URL.revokeObjectURL(url) }); };
  img.onerror = fail;
  img.src = url;
});

// 실제 축소. 실패하면 null 을 돌려준다 — 호출자는 원본으로 진행한다.
const shrinkImage = async (file, { maxEdge = 2000, quality = 0.85 } = {}) => {
  if (!_isShrinkable(file)) return null;
  let handle = null;
  let canvas = null;
  try {
    handle = await _loadImage(file);
    const { img } = handle;
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return null;
    const scale = Math.min(1, maxEdge / Math.max(w, h));
    const outW = Math.max(1, Math.round(w * scale));
    const outH = Math.max(1, Math.round(h * scale));
    canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    // PNG 는 투명할 수 있다. JPEG 로 바꾸면 투명이 검게 나오므로 흰 바탕을 먼저 깐다.
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outW, outH);
    ctx.drawImage(img, 0, 0, outW, outH);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob) return null;
    // 줄인 게 오히려 크면(이미 잘 압축된 작은 사진) 의미가 없다.
    if (blob.size >= file.size) return null;
    const baseName = String(file.name || 'image').replace(/\.[^.]+$/, '');
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  } catch (_e) {
    console.warn('[bgnj] 사진 축소 실패 — 원본으로 진행한다 (ImageShrink.jsx)', _e);
    return null;
  } finally {
    if (canvas) { canvas.width = 1; canvas.height = 1; }
    try { handle?.revoke?.(); } catch (_e) { console.warn('[bgnj] 임시 URL 정리 (ImageShrink.jsx)', _e); }
  }
};

// 여러 장을 한 번에. 큰 것들만 모아 딱 한 번 물어본다.
// 열 장을 고르고 열 번 확인창이 뜨면 그게 더 나쁘다.
// 반환: { files, cancelled } — cancelled 는 한도를 넘어 못 올리는 파일 목록.
const maybeShrinkAll = async (fileList, {
  limitBytes,                  // 이 크기를 넘으면 업로드 자체가 불가능하다
  askOverBytes = 2 * _MB,      // 이 크기를 넘으면 줄일지 물어본다
  maxEdge = 2000,
  quality = 0.85,
} = {}) => {
  const files = [];
  const cancelled = [];
  for (const file of Array.from(fileList || [])) {
    try { files.push(await prepareFile(file)); }
    catch (err) {
      cancelled.push(file);
      window.BGNJ_TOAST?.error?.(err.message, { code: err.code || 'IMAGE_PREPARE_FAILED' });
    }
  }
  if (files.length === 0) return { files: [], cancelled };

  // 물어볼 만큼 큰 것만 골라 먼저 줄여 본다. 실제 결과를 보여주기 위해서다.
  const targets = files.filter((f) => f && (f.size > askOverBytes || (limitBytes && f.size > limitBytes)));

  const shrunkMap = new Map();
  for (const f of targets) {
    let out = await shrinkImage(f, { maxEdge, quality });
    // 작은 이미지 슬롯에서도 한 번의 압축 결과가 한도를 넘으면 단계적으로 더 줄인다.
    if (limitBytes && f.size > limitBytes && (!out || out.size > limitBytes)) {
      for (const [edge, q] of [[1600, 0.75], [1280, 0.65], [960, 0.55], [640, 0.5]]) {
        const candidate = await shrinkImage(f, { maxEdge: Math.min(maxEdge, edge), quality: Math.min(quality, q) });
        if (candidate && (!out || candidate.size < out.size)) out = candidate;
        if (out && out.size <= limitBytes) break;
      }
    }
    if (out) shrunkMap.set(f, out);
  }

  const automatic = new Map([...shrunkMap].filter(([f, out]) => limitBytes && f.size > limitBytes && out.size <= limitBytes));
  const optional = new Map([...shrunkMap].filter(([f]) => !limitBytes || f.size <= limitBytes));
  if (automatic.size) window.BGNJ_TOAST?.info?.(`사진 ${automatic.size}장을 업로드 가능한 크기로 자동 축소했습니다.`);
  let accepted = false;
  if (optional.size > 0) {
    const before = [...optional.keys()].reduce((a, f) => a + f.size, 0);
    const after = [...optional.values()].reduce((a, f) => a + f.size, 0);
    const one = optional.size === 1;
    const head = one
      ? `사진이 ${_fmtMB(before)} 로 큽니다.`
      : `사진 ${optional.size}장이 큽니다 (합계 ${_fmtMB(before)}).`;
    const hasPng = [...optional.keys()].some((f) => String(f.type).toLowerCase() === 'image/png');
    accepted = await window.BGNJ_CONFIRM(
      `${head}\n줄이면 ${_fmtMB(after)} 가 됩니다. 줄여서 올릴까요?\n\n` +
      `화면에서 보기에는 충분한 화질입니다 (긴 쪽 ${maxEdge}px).` +
      (hasPng ? `\nPNG 는 JPG 로 바뀝니다.` : ''),
      { confirmLabel: '줄여서 올리기', cancelLabel: '원본 그대로' }
    );
  }

  const out = [];
  const oversized = [];
  files.forEach((f) => {
    const picked = automatic.get(f) || (accepted && optional.get(f)) || f;
    // 원본을 고집했는데 한도를 넘으면 애초에 올라가지 않는다. 조용히 버리지 말고 알린다.
    if (limitBytes && picked.size > limitBytes) { cancelled.push(picked); oversized.push(picked); return; }
    out.push(picked);
  });

  if (oversized.length > 0) {
    // 왜 못 올리는지가 두 가지라 안내도 갈라야 한다.
    //   ㄱ. 줄일 수는 있었는데 '원본 그대로' 를 골랐다 → 다시 골라 줄이면 된다.
    //   ㄴ. GIF 등 자동 축소하지 않는 형식이다.
    const shrinkable = oversized.filter((f) => _isShrinkable(f));
    const notShrinkable = oversized.filter((f) => !_isShrinkable(f));
    const names = (list) => list.map((f) => `'${f.name}'`).join(', ');
    if (shrinkable.length > 0) {
      window.BGNJ_TOAST.error(
        `${names(shrinkable)} 은(는) 한도(${_fmtMB(limitBytes)})를 넘어 올릴 수 없습니다. ` +
        `사진 앱에서 크기를 더 줄이거나 다른 사진을 선택해 주세요.`
      );
    }
    if (notShrinkable.length > 0) {
      window.BGNJ_TOAST.error(
        `${names(notShrinkable)} 은(는) 한도(${_fmtMB(limitBytes)})를 넘습니다. ` +
        `이 형식은 자동으로 줄일 수 없으니, 사진 앱에서 크기를 줄이거나 JPG 로 저장해 올려 주세요.`
      );
    }
  }
  return { files: out, cancelled };
};

// 한 장짜리 입력(관리자 커버 등)용. 반환: File 또는 null(못 올림).
const maybeShrinkOne = async (file, opts = {}) => {
  const { files } = await maybeShrinkAll([file], opts);
  return files[0] || null;
};

window.BGNJ_IMAGE_SHRINK = { shrinkImage, maybeShrinkAll, maybeShrinkOne, prepareFile, isHeicFile, isImageFile, formatMB: _fmtMB };

// v00.295.004 — 큰 사진을 올리기 전에 줄여 주는 공용 헬퍼.
// 사용자 요청: '용량이 크면 크다고 알려주고, 줄이는 기능을 넣어달라.'
//
// 왜 필요한가:
//   휴대폰 사진은 한 장에 5~10MB 가 넘는다. 한도를 넘으면 지금까지는 그냥 실패했고
//   (2026-08-20 관리자 커버 업로드 5건 연속 실패 — '6.0MB'),
//   회원 입장에서는 무엇을 어떻게 해야 하는지 알 길이 없었다.
//
// 동작:
//   ① 임계값보다 작으면 아무것도 하지 않는다. 묻지도 않는다.
//   ② 크면 먼저 줄여 본 뒤 '5.8MB → 0.9MB' 처럼 실제 결과를 보여주며 물어본다.
//      예측값이 아니라 진짜 줄여 본 값이라 사용자가 판단할 수 있다.
//   ③ 거절하면 원본을 쓴다. 원본이 한도를 넘어 애초에 못 올라가면 그때는 분명히 알린다.
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

// 줄여도 되는 형식인가. GIF 는 애니메이션 때문에 제외.
const _isShrinkable = (file) => {
  const t = String(file?.type || '').toLowerCase();
  return t === 'image/jpeg' || t === 'image/jpg' || t === 'image/png' || t === 'image/webp';
};

const _loadImage = (file) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => resolve({ img, revoke: () => URL.revokeObjectURL(url) });
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('이미지를 읽을 수 없습니다.')); };
  img.src = url;
});

// 실제 축소. 실패하면 null 을 돌려준다 — 호출자는 원본으로 진행한다.
const shrinkImage = async (file, { maxEdge = 2000, quality = 0.85 } = {}) => {
  if (!_isShrinkable(file)) return null;
  let handle = null;
  try {
    handle = await _loadImage(file);
    const { img } = handle;
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return null;
    const scale = Math.min(1, maxEdge / Math.max(w, h));
    const outW = Math.max(1, Math.round(w * scale));
    const outH = Math.max(1, Math.round(h * scale));
    const canvas = document.createElement('canvas');
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
  const files = Array.from(fileList || []);
  if (files.length === 0) return { files: [], cancelled: [] };

  // 물어볼 만큼 큰 것만 골라 먼저 줄여 본다. 실제 결과를 보여주기 위해서다.
  const targets = files.filter((f) => f && f.size > askOverBytes);
  if (targets.length === 0) return { files, cancelled: [] };

  const shrunkMap = new Map();
  await Promise.all(targets.map(async (f) => {
    const out = await shrinkImage(f, { maxEdge, quality });
    if (out) shrunkMap.set(f, out);
  }));

  let accepted = false;
  if (shrunkMap.size > 0) {
    const before = [...shrunkMap.keys()].reduce((a, f) => a + f.size, 0);
    const after = [...shrunkMap.values()].reduce((a, f) => a + f.size, 0);
    const one = shrunkMap.size === 1;
    const head = one
      ? `사진이 ${_fmtMB(before)} 로 큽니다.`
      : `사진 ${shrunkMap.size}장이 큽니다 (합계 ${_fmtMB(before)}).`;
    const hasPng = [...shrunkMap.keys()].some((f) => String(f.type).toLowerCase() === 'image/png');
    accepted = await window.BGNJ_CONFIRM(
      `${head}\n줄이면 ${_fmtMB(after)} 가 됩니다. 줄여서 올릴까요?\n\n` +
      `화면에서 보기에는 충분한 화질입니다 (긴 쪽 ${maxEdge}px).` +
      (hasPng ? `\nPNG 는 JPG 로 바뀝니다.` : ''),
      { confirmLabel: '줄여서 올리기', cancelLabel: '원본 그대로' }
    );
  }

  const out = [];
  const cancelled = [];
  files.forEach((f) => {
    const picked = (accepted && shrunkMap.get(f)) || f;
    // 원본을 고집했는데 한도를 넘으면 애초에 올라가지 않는다. 조용히 버리지 말고 알린다.
    if (limitBytes && picked.size > limitBytes) { cancelled.push(picked); return; }
    out.push(picked);
  });

  if (cancelled.length > 0) {
    // 왜 못 올리는지가 두 가지라 안내도 갈라야 한다.
    //   ㄱ. 줄일 수는 있었는데 '원본 그대로' 를 골랐다 → 다시 골라 줄이면 된다.
    //   ㄴ. GIF·HEIC 처럼 이 브라우저가 다시 그릴 수 없는 형식이다 → 우리가 해줄 수 있는 게 없다.
    const shrinkable = cancelled.filter((f) => _isShrinkable(f));
    const notShrinkable = cancelled.filter((f) => !_isShrinkable(f));
    const names = (list) => list.map((f) => `'${f.name}'`).join(', ');
    if (shrinkable.length > 0) {
      window.BGNJ_TOAST.error(
        `${names(shrinkable)} 은(는) 한도(${_fmtMB(limitBytes)})를 넘어 올릴 수 없습니다. ` +
        `다시 선택한 뒤 '줄여서 올리기' 를 눌러 주세요.`
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

window.BGNJ_IMAGE_SHRINK = { shrinkImage, maybeShrinkAll, maybeShrinkOne, formatMB: _fmtMB };

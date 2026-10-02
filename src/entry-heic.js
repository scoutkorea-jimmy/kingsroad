// HEIC를 선택한 경우에만 로드. 고정 버전 heic-to의 CSP Worker는 빌드 시 추출한다.
// 한 장이 끝나거나 실패하면 Worker를 종료해 메모리를 반환하고 다음 사진은 새로 시작한다.
const workerUrl = new URL(document.currentScript.src);
workerUrl.pathname = workerUrl.pathname.replace(/heic\.js$/, 'heic-worker.js');

const convert = async ({ blob, type = 'image/jpeg', quality = 0.9 }) => {
  const buffer = await blob.arrayBuffer();
  const worker = new Worker(workerUrl.href);
  const canvas = document.createElement('canvas');
  let timer;
  try {
    const imageData = await new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(new Error('사진 변환 시간이 초과되었습니다.')), 60_000);
      worker.onerror = () => reject(new Error('사진 변환기를 실행하지 못했습니다.'));
      worker.onmessageerror = () => reject(new Error('사진 변환 결과를 읽지 못했습니다.'));
      worker.onmessage = ({ data }) => {
        if (data.error || !data.imageData) reject(new Error(String(data.error || '사진을 읽지 못했습니다.')));
        else resolve(data.imageData);
      };
      worker.postMessage({ id: 1, buffer }, [buffer]);
    });
    worker.terminate();
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('사진을 변환할 화면을 준비하지 못했습니다.');
    ctx.putImageData(imageData, 0, 0);
    return await new Promise((resolve, reject) => {
      canvas.toBlob((out) => out?.size ? resolve(out) : reject(new Error('JPG를 생성하지 못했습니다.')), type, quality);
    });
  } finally {
    clearTimeout(timer);
    worker.terminate();
    canvas.width = 1;
    canvas.height = 1;
  }
};

window.BGNJ_HEIC_DECODER = { convert };

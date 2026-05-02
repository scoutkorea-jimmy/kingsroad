#!/usr/bin/env node
// 뱅기노자 — CSP 'sha256-' 해시 자동 동기 (v00.118)
// 효과: index.html 의 인라인 `<script>` 블록(없는 src) 본문을 SHA-256 base64 로 해시 → CSP meta 의
//       script-src 디렉티브에 자동 주입. 'unsafe-inline' 의존도 제거.
// 동작: 매 pre-commit 시 실행 → index.html 의 인라인 스크립트가 변경되면 해시가 자동 갱신.
//       해시가 이미 최신이면 파일 미변경 (idempotent).
// 정책: GitHub Pages 정적 호스팅 → 서버 측 nonce 주입 불가. SHA-256 해시가 정적 환경의 표준 해법.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const TARGET = path.resolve(process.cwd(), 'index.html');

const sha256Base64 = (text) =>
  `'sha256-${crypto.createHash('sha256').update(text, 'utf8').digest('base64')}'`;

// CSP script-src 화이트리스트 — 외부 CDN.
const SCRIPT_EXTERNAL = [
  "'self'",
  'https://unpkg.com',
  'https://esm.sh',
  'https://*.esm.sh',
];

const main = () => {
  if (!fs.existsSync(TARGET)) {
    console.warn(`[csp-hashes] skip — ${TARGET} 없음`);
    return;
  }
  const src = fs.readFileSync(TARGET, 'utf8');

  // 인라인 `<script>` (src 속성 없음) 본문 추출.
  // type="module" / type="importmap" 등도 동일 처리 (CSP script-src 적용).
  const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
  const hashes = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const body = m[2];
    hashes.push(sha256Base64(body));
  }
  if (hashes.length === 0) {
    console.warn('[csp-hashes] 인라인 script 미발견 — CSP 변경 없음.');
    return;
  }

  // CSP meta 의 script-src 디렉티브 교체.
  const cspMetaRe = /(<meta http-equiv="Content-Security-Policy" content=")([^"]+)(")/;
  const cspMatch = src.match(cspMetaRe);
  if (!cspMatch) {
    console.warn('[csp-hashes] CSP meta 미발견 — 갱신 건너뜀.');
    return;
  }
  const csp = cspMatch[2];
  const newScriptSrc = `script-src ${SCRIPT_EXTERNAL.join(' ')} ${hashes.join(' ')}`;
  const newCsp = csp.replace(/script-src [^;]+/, newScriptSrc);
  if (newCsp === csp) {
    return;
  }
  const newSrc = src.replace(cspMetaRe, `$1${newCsp}$3`);
  if (newSrc === src) return;
  fs.writeFileSync(TARGET, newSrc, 'utf8');
  console.log(`[csp-hashes] ✓ inline script ${hashes.length}개 SHA-256 해시 갱신.`);
};

main();

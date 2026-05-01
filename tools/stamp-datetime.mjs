#!/usr/bin/env node
// 뱅기노자 — pre-commit datetime auto-stamp (v00.111)
// 효과: pages/admin/AdminDesignHub.jsx 에서 ADMIN_VERSION_HISTORY 의 첫 entry datetime 이
//       sentinel `new Date().toISOString()` 인 경우 → 현재 KST(+09:00) ISO 문자열로 치환.
// 이유: 기존엔 사람이 entry 작성 시 datetime 을 수동 hardcode → 추정값/오타 빈번 (v00.107~109 사례).
//       sentinel 패턴을 두면 commit 시점에 실제 시간으로 자동 정착.
// 동작: 변경 발생 시 .jsx 파일 수정 → tools/build.mjs 가 .js 재생성 (pre-commit hook 순서 보장).

import fs from 'node:fs';
import path from 'node:path';

const TARGET = path.resolve(process.cwd(), 'pages/admin/AdminDesignHub.jsx');
// 첫 datetime 한 줄만 매칭 (ADMIN_VERSION_HISTORY 첫 entry).
// 중간/끝 entry 의 hardcode datetime 은 건드리지 않는다.
const SENTINEL_RE = /(datetime:\s*)new Date\(\)\.toISOString\(\)(\s*,)/;

const toKstIso = (d = new Date()) => {
  // Asia/Seoul (UTC+9) 고정 출력. DST 없음.
  const pad = (n) => String(n).padStart(2, '0');
  const utc = d.getTime();
  const kst = new Date(utc + 9 * 3600 * 1000);
  const y = kst.getUTCFullYear();
  const mo = pad(kst.getUTCMonth() + 1);
  const da = pad(kst.getUTCDate());
  const h = pad(kst.getUTCHours());
  const mi = pad(kst.getUTCMinutes());
  const s = pad(kst.getUTCSeconds());
  return `${y}-${mo}-${da}T${h}:${mi}:${s}+09:00`;
};

const main = () => {
  if (!fs.existsSync(TARGET)) {
    console.warn(`[stamp-datetime] skip — ${TARGET} 없음`);
    return;
  }
  const src = fs.readFileSync(TARGET, 'utf8');
  if (!SENTINEL_RE.test(src)) {
    return;
  }
  const stamp = toKstIso();
  const next = src.replace(SENTINEL_RE, (_, p1, p2) => `${p1}"${stamp}"${p2}`);
  if (next === src) return;
  fs.writeFileSync(TARGET, next, 'utf8');
  console.log(`[stamp-datetime] ✓ ADMIN_VERSION_HISTORY[0].datetime → ${stamp}`);
};

main();

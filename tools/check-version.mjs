#!/usr/bin/env node
// 뱅기노자 — 버전 일관성 검증 (v00.120)
// 효과: data.js 의 BGNJ_VERSION.version 과 index.html 의 ?v=XX cache-buster 가 일치하는지 검증.
//       불일치 시 pre-commit 차단 (브라우저가 옛 JS 를 캐시할 위험 차단).
// 동작: 매 pre-commit 시 실행. 일치하면 silent, 불일치면 exit 1 + 안내.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_JS = path.resolve(ROOT, 'data.js');
const INDEX_HTML = path.resolve(ROOT, 'index.html');

const main = () => {
  if (!fs.existsSync(DATA_JS) || !fs.existsSync(INDEX_HTML)) {
    console.warn('[check-version] data.js / index.html 없음 — 검증 건너뜀.');
    return;
  }
  const dataSrc = fs.readFileSync(DATA_JS, 'utf8');
  const versionMatch = dataSrc.match(/window\.BGNJ_VERSION\s*=\s*\{[^}]*version:\s*"([^"]+)"/);
  if (!versionMatch) {
    console.error('[check-version] ❌ data.js 에서 BGNJ_VERSION.version 미발견.');
    process.exit(1);
  }
  const version = versionMatch[1];

  const indexSrc = fs.readFileSync(INDEX_HTML, 'utf8');
  const cacheBusters = [...indexSrc.matchAll(/\?v=([\d.]+)/g)].map((m) => m[1]);
  const unique = [...new Set(cacheBusters)];

  if (unique.length === 0) {
    console.error('[check-version] ❌ index.html 에서 ?v= cache-buster 미발견.');
    process.exit(1);
  }
  if (unique.length > 1 || unique[0] !== version) {
    console.error(
      `[check-version] ❌ 버전 불일치 — BGNJ_VERSION="${version}" vs index.html cache-buster=${unique.join(', ')}`
    );
    console.error('[check-version]    수정: index.html 의 모든 ?v= 값을 BGNJ_VERSION 과 동일하게 갱신.');
    console.error(`[check-version]    예: sed -i '' 's/v=${unique[0]}/v=${version}/g' index.html`);
    process.exit(1);
  }
  // 일치 — silent.
};

main();

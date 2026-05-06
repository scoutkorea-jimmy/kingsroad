#!/usr/bin/env node
// 뱅기노자 — /version.json 매 커밋 갱신 (v00.214)
// 효과: 정적 호스팅(GitHub Pages) 환경에서 클라이언트가 주기 폴링으로 새 빌드 감지 가능.
// 동작:
//   - data.js 의 BGNJ_VERSION 을 파싱해 version.json 에 반영.
//   - { version, build, channel, generatedAt } 4 필드.
//   - pre-commit hook 에서 호출 (install-hooks.sh).

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_JS = path.resolve(ROOT, 'data.js');
const OUT = path.resolve(ROOT, 'version.json');

const main = () => {
  if (!fs.existsSync(DATA_JS)) {
    console.warn('[write-version-json] data.js 없음 — 건너뜀.');
    return;
  }
  const src = fs.readFileSync(DATA_JS, 'utf8');
  const m = src.match(/window\.BGNJ_VERSION\s*=\s*\{\s*version:\s*"([^"]+)"\s*,\s*build:\s*"([^"]+)"\s*,\s*channel:\s*"([^"]+)"/);
  if (!m) {
    console.error('[write-version-json] ❌ BGNJ_VERSION 파싱 실패.');
    process.exit(1);
  }
  const [, version, build, channel] = m;
  const payload = {
    version,
    build,
    channel,
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  // silent on success — pre-commit 출력 최소화.
};

main();

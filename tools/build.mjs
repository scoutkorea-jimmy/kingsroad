#!/usr/bin/env node
// 뱅기노자 — JSX → JS 사전 컴파일러 (v00.071)
//
// 목적: `@babel/standalone` 제거. 브라우저 런타임 JSX 컴파일에서 발생하는
//   "You are using the in-browser Babel transformer..." 경고와 500KB 초과 시
//   "code generator deoptimised..." 노트를 근본 차단.
//
// 동작:
//   - SOURCE_DIRS 안의 모든 *.jsx 를 esbuild transform API 로 ES2018 JS 로 변환.
//   - 같은 디렉터리에 같은 basename 의 .js 로 출력 (동일 위치 유지 → import path 동일).
//   - JSX factory 는 React.createElement 로 고정 (UMD React 18 사용 — import 없음).
//   - 결과 .js 는 IIFE 로 감싸 기존 Babel-standalone 의 script-tag-isolation 동작을 보존.
//   - 인라인 source map 첨부.
//
// 실행:
//   node tools/build.mjs           # 한 번 빌드
//   node tools/build.mjs --watch   # 감시 모드 (개발용)
//
// pre-commit hook 에서 자동 호출 (install-hooks.sh) — 빌드 실패 시 commit 차단.

import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// 빌드 대상 — 재귀적으로 *.jsx 를 모두 잡는다.
// 루트의 boot.jsx 같은 단일 파일도 포함하기 위해 ROOT_FILES 별도.
const SOURCE_DIRS = ['pages', 'components'];
const ROOT_FILES = ['boot.jsx'];

const args = process.argv.slice(2);
const WATCH = args.includes('--watch');

const collectJsx = (dir, out = []) => {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return out;
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    const next = path.join(dir, ent.name);
    if (ent.isDirectory()) collectJsx(next, out);
    else if (ent.isFile() && ent.name.endsWith('.jsx')) out.push(next);
  }
  return out;
};

const files = [
  ...ROOT_FILES.filter((f) => fs.existsSync(path.join(ROOT, f))),
  ...SOURCE_DIRS.flatMap((d) => collectJsx(d)),
];

const transform = async (rel) => {
  const abs = path.join(ROOT, rel);
  const src = fs.readFileSync(abs, 'utf8');
  let result;
  try {
    result = await esbuild.transform(src, {
      loader: 'jsx',
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      target: 'es2018',
      sourcemap: 'inline',
      sourcefile: rel,
    });
  } catch (err) {
    console.error(`❌ ${rel}: ${err.message}`);
    throw err;
  }
  // IIFE 래핑 — 기존 Babel-standalone 동작과 동일한 script-tag scope 유지.
  // 각 파일이 자체 scope 안에서 const/let/class 를 선언하고, 외부 노출은 window.X 로만.
  const wrapped = `(function(){\n${result.code}\n})();\n`;
  const outRel = rel.replace(/\.jsx$/, '.js');
  const outAbs = path.join(ROOT, outRel);
  fs.writeFileSync(outAbs, wrapped);
  return outRel;
};

const buildOnce = async () => {
  const t0 = Date.now();
  const outs = [];
  for (const f of files) outs.push(await transform(f));
  const ms = Date.now() - t0;
  console.log(`✅ ${outs.length} files transpiled in ${ms}ms`);
  return outs;
};

if (WATCH) {
  await buildOnce();
  console.log('👀 watching pages/ and components/ ...');
  for (const d of SOURCE_DIRS) {
    fs.watch(path.join(ROOT, d), { recursive: true }, async (event, filename) => {
      if (!filename || !filename.endsWith('.jsx')) return;
      const rel = path.join(d, filename);
      try {
        const out = await transform(rel);
        console.log(`  · ${rel} → ${out}`);
      } catch {}
    });
  }
} else {
  await buildOnce();
}

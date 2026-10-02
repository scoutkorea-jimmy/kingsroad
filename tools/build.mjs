#!/usr/bin/env node
// 뱅기노자 — JSX 번들러 (v00.285 Stage 4)
//
// 목적: 페이지/컴포넌트 *.jsx 소스를 번들 3개로 묶는다.
//   - dist/app.js   : 메인 (entry-main.jsx — index.html 이 로드)
//   - dist/admin.js : 관리자 (entry-admin.jsx — boot 가 admin route 진입 시 동적 주입)
//   esbuild bundle 모드. 각 모듈은 독립 스코프(구 per-file IIFE 격리와 동일), side-effect
//   import 가 window.X 할당을 로드 순서대로 실행 → 런타임 동작 불변.
//
// 외부 의존(React/ReactDOM/DOMPurify/Tiptap)은 소스에서 import 하지 않고 전역(자유변수)으로
//   참조하므로 external 설정 불필요 — esbuild 가 그대로 둔다.
//
// 코드 스플리팅: admin 5종(AdminShared/ContentEditors/DesignHub/HangyeonAdminPanel/AuthAdminPage)은
//   dist/admin.js 로 분리. 비-admin 99% 트래픽은 dist/app.js 만 받는다(~3.85MB 회피).
//
// 실행:
//   node tools/build.mjs           # 한 번 빌드 (pre-commit hook / CI / 배포가 호출)
//   node tools/build.mjs --watch   # 감시 모드 (개발용)
//
// 기존 app/admin 번들은 추적 중이다. 새 HEIC 산출물은 CI가 배포 직전 생성한다.
// (v00.285 이전: per-file *.jsx→*.js 사전 컴파일 + 산출물 커밋 방식이었으나 번들로 전환.)

import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const WATCH = args.includes('--watch');

const BUNDLE_TARGETS = [
  { entry: 'src/entry-main.jsx',  outfile: 'dist/app.js'   },
  { entry: 'src/entry-admin.jsx', outfile: 'dist/admin.js' },
  { entry: 'src/entry-heic.js',   outfile: 'dist/heic.js'  },
];

// v00.196 — sourcemap 인라인 base64 는 wire 의 62% 차지(비-admin 에게도 강제 전송) → prod 기본 off.
//   env BGNJ_SOURCEMAP=1 일 때만 인라인 첨부(로컬 디버깅용).
const includeSourcemap = process.env.BGNJ_SOURCEMAP === '1';

const buildOptions = ({ entry, outfile }) => ({
  entryPoints: [path.join(ROOT, entry)],
  outfile: path.join(ROOT, outfile),
  bundle: true,
  format: 'iife',
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  target: 'es2018',
  sourcemap: includeSourcemap ? 'inline' : false,
  legalComments: 'eof',
  logLevel: 'warning',
});

const prepareDecoder = () => {
  // upstream CSP 빌드 안의 Web Worker 원문을 독립 파일로 배포한다.
  // blob Worker 대신 동일 출처 파일을 사용해 CSP를 넓히지 않고 종료·재시도를 제어한다.
  const decoderPath = path.join(__dirname, 'node_modules/heic-to/dist/csp/heic-to.js');
  const ast = parse(fs.readFileSync(decoderPath, 'utf8'), { sourceType: 'module' });
  let workerSource = '';
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'StringLiteral' && node.value.includes('onmessage=') && node.value.includes('HeifDecoder') && node.value.length > workerSource.length) workerSource = node.value;
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  };
  visit(ast.program);
  if (!workerSource) throw new Error('heic-to CSP Worker를 찾지 못했습니다. 라이브러리 버전과 빌드 형식을 확인하세요.');
  fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
  const notice = '/*! heic-to 1.6.5, LGPL-3.0-or-later. Source: https://github.com/hoppergee/heic-to/tree/main. License: heic.LICENSE.txt */\n';
  fs.writeFileSync(path.join(ROOT, 'dist/heic-worker.js'), notice + workerSource);
  fs.copyFileSync(path.join(__dirname, 'node_modules/heic-to/LICENSE'), path.join(ROOT, 'dist/heic.LICENSE.txt'));
};

const bundleOnce = async () => {
  const t0 = Date.now();
  prepareDecoder();
  for (const target of BUNDLE_TARGETS) {
    await esbuild.build(buildOptions(target));
    const bytes = fs.statSync(path.join(ROOT, target.outfile)).size;
    console.log(`  · ${target.entry} → ${target.outfile}  (${(bytes / 1024).toFixed(1)} KB)`);
  }
  console.log(`✅ ${BUNDLE_TARGETS.length} bundles built in ${Date.now() - t0}ms`);
};

if (WATCH) {
  prepareDecoder();
  for (const target of BUNDLE_TARGETS) {
    const ctx = await esbuild.context(buildOptions(target));
    await ctx.watch();
    console.log(`👀 watching → ${target.outfile}`);
  }
} else {
  await bundleOnce();
}

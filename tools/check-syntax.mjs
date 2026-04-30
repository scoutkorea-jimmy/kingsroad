#!/usr/bin/env node
// 뱅기노자 — JSX/JS 신택스 검증 스크립트
// 용도: 커밋 전(pre-commit) 또는 수동 실행으로 components/, pages/, data.js, api.js 의
//       모든 .jsx/.js 파일이 babel 파서로 깨끗하게 파싱되는지 확인.
// 실행: cd tools && node check-syntax.mjs
//        또는 (저장소 루트에서) node tools/check-syntax.mjs
//
// 첫 실행 시 @babel/parser 가 없으면 자동으로 `npm install` 수행.

import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// 1) @babel/parser 보장 — tools/node_modules 에 없으면 npm install.
const parserPath = path.join(__dirname, "node_modules", "@babel", "parser", "lib", "index.js");
if (!existsSync(parserPath)) {
  console.log("📦 첫 실행 — @babel/parser 설치 중 (tools/)…");
  try {
    execSync("npm install --silent --no-audit --no-fund", { cwd: __dirname, stdio: "inherit" });
  } catch (err) {
    console.error("❌ @babel/parser 설치 실패. 수동으로 `cd tools && npm i` 실행해 주세요.");
    process.exit(2);
  }
}

const { parse } = await import(parserPath);

// 2) 검사 대상 수집.
const TARGET_DIRS = ["components", "pages"];
const TARGET_ROOT_FILES = ["data.js", "api.js"];

const collect = async (dir, out = []) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await collect(p, out);
    else if (/\.(jsx?|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
};

const targets = [];
for (const d of TARGET_DIRS) {
  const full = path.join(ROOT, d);
  if (existsSync(full)) await collect(full, targets);
}
for (const f of TARGET_ROOT_FILES) {
  const full = path.join(ROOT, f);
  if (existsSync(full)) targets.push(full);
}

// 3) 파싱 — babel-standalone 과 동일한 plugin 세트.
const PARSER_OPTS = {
  sourceType: "script",
  plugins: ["jsx", "classProperties", "optionalChaining", "nullishCoalescingOperator", "objectRestSpread"],
  allowReturnOutsideFunction: true,
};

let bad = 0;
const errors = [];
for (const f of targets) {
  const code = await fs.readFile(f, "utf8");
  try {
    parse(code, PARSER_OPTS);
  } catch (err) {
    bad++;
    errors.push({ file: path.relative(ROOT, f), msg: err.message });
  }
}

// 4) 룰 검사 — 신택스가 OK 인 파일에서 추가 금지 패턴 점검.
//    A) BANGINOJA_DATA 직접 참조: 시드는 더 이상 페이지에서 읽지 않는다 (서버 source-of-truth).
//       허용: data.js (정의), AuthAdminPage 의 KMS techSpec 문자열은 lint-ignore 주석으로 우회.
//    B) listPosts/listAll 등 헬퍼 호출이 옵셔널 체이닝 없이 직접 호출되는 핫스팟 — 경고만.
const violations = [];
const BANGINOJA_DATA_ALLOW = new Set(["data.js"]);
const BANGINOJA_DATA_PATTERN = /\bwindow\.BANGINOJA_DATA\b/g;

for (const f of targets) {
  const rel = path.relative(ROOT, f);
  if (BANGINOJA_DATA_ALLOW.has(rel)) continue;
  const code = await fs.readFile(f, "utf8");
  // 라인 단위로 검사하고 // bgnj-lint-ignore-next-line BANGINOJA_DATA 가 있는 줄은 무시.
  const lines = code.split("\n");
  let lintIgnoreNext = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (lintIgnoreNext) { lintIgnoreNext = false; continue; }
    if (/bgnj-lint-ignore-next-line\s+BANGINOJA_DATA/.test(line)) { lintIgnoreNext = true; continue; }
    // 주석 안의 매치(// 또는 *)는 허용 — 코드 상의 실제 참조만 차단.
    const stripped = line.replace(/\/\/.*$/, "").replace(/\*[^*]*\*/g, "");
    // backtick 안의 문자열 ('`...BANGINOJA_DATA...`') 은 docstring 처럼 사용되므로 허용.
    const noBackticks = stripped.replace(/`[^`]*`/g, "''");
    BANGINOJA_DATA_PATTERN.lastIndex = 0;
    if (BANGINOJA_DATA_PATTERN.test(noBackticks)) {
      violations.push({ file: rel, line: i + 1, msg: "BANGINOJA_DATA 직접 참조 금지 (서버 source-of-truth) — 필요 시 // bgnj-lint-ignore-next-line BANGINOJA_DATA 로 우회" });
    }
  }
}

// 5) 보고.
if (bad === 0 && violations.length === 0) {
  console.log(`✅ ${targets.length} files parsed cleanly.`);
  process.exit(0);
}
if (bad > 0) {
  console.error(`\n❌ ${bad} / ${targets.length} files failed syntax check:\n`);
  for (const e of errors) {
    console.error(`  • ${e.file}`);
    console.error(`    ${e.msg}`);
  }
}
if (violations.length > 0) {
  console.error(`\n⚠ ${violations.length} 룰 위반 발견:\n`);
  for (const v of violations) {
    console.error(`  • ${v.file}:${v.line} — ${v.msg}`);
  }
}
console.error("\n커밋 전 위 항목을 먼저 정리해 주세요.");
process.exit(1);

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

// 4) 보고.
if (bad === 0) {
  console.log(`✅ ${targets.length} files parsed cleanly.`);
  process.exit(0);
} else {
  console.error(`\n❌ ${bad} / ${targets.length} files failed syntax check:\n`);
  for (const e of errors) {
    console.error(`  • ${e.file}`);
    console.error(`    ${e.msg}`);
  }
  console.error("\n커밋 전 위 오류를 먼저 수정해 주세요.");
  process.exit(1);
}

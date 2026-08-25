#!/usr/bin/env node
// 뱅기노자 — `<window.X/>` 로 렌더하는데 window 에 등록되지 않은 컴포넌트 검사 (v00.296.001)
//
// 왜: v00.287 ESM 전환 때 각 파일의 `window.X = X` 가 사라졌는데 사용처는
//     `<window.X/>` 로 남았다. 그래서 14개 중 11개가 undefined 를 가리키고 있었다.
//
// 증상이 두 갈래라 더 나쁘다.
//   ① 가드가 window 를 보면  — `{window.X && <window.X/>}` — 조용히 렌더되지 않는다.
//      오류도 안 나고 기능만 사라진다. 관리자 한켠 탭의 사진 편집이 그렇게 없어져 있었다.
//   ② 가드가 import 를 보면  — `{X && <window.X/>}`      — undefined 를 렌더해
//      React #130 으로 화면이 통째로 깨진다. 관리자 '한켠 예약' 탭에서 실제로 발생.
//
// 실행: node tools/check-globals.mjs

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIRS = ["components", "pages", "pages/admin", "src", "."];

const files = [];
for (const d of DIRS) {
  const dir = path.join(ROOT, d);
  let entries = [];
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { continue; }
  for (const e of entries) {
    if (e.isFile() && /\.(jsx|js)$/.test(e.name)) files.push(path.join(dir, e.name));
  }
}

const sources = new Map();
for (const f of files) sources.set(f, await fs.readFile(f, "utf8"));

// v00.310.000 — **번들 경계를 함께 본다.**
//   등록만 확인하면 부족하다. 메인 번들에서 쓰는 전역을 관리자 파일에서만 등록하면
//   일반 방문자에게는 undefined 다 — 사이트는 안 죽고 **기능만 조용히 사라진다.**
//   실제로 입금 계좌 안내(BGNJ_BankAccountPicker)가 그렇게 없어져 있었다(v00.310.000 에서 발견).
//   admin.js 는 boot 가 ['admin','login','signup'] 경로에서만 주입하므로,
//   세션이 살아 있는 손님이 곧바로 결제 화면에 들어가면 안 실린다.
const entryFiles = async (entry) => {
  const seen = new Set();
  const walk = async (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    let src = "";
    try { src = await fs.readFile(file, "utf8"); } catch { return; }
    for (const m of src.matchAll(/^\s*import\s+(?:[^'"]*from\s*)?['"](\.[^'"]+)['"]/gm)) {
      await walk(path.resolve(path.dirname(file), m[1]));
    }
  };
  await walk(path.join(ROOT, "src", entry));
  return seen;
};
const mainFiles = await entryFiles("entry-main.jsx");
const adminFiles = await entryFiles("entry-admin.jsx");
// 관리자 번들은 메인 뒤에 실리므로 메인이 등록한 것을 그대로 쓸 수 있다. 반대는 아니다.
const inMain = (f) => mainFiles.has(f);

// 어디선가 window 에 붙였는가 (+ 어느 번들에서 붙였는가).
const registered = new Set();
const registeredInMain = new Set();
const noteReg = (name, f) => { registered.add(name); if (inMain(f)) registeredInMain.add(name); };
for (const [f, src] of sources) {
  for (const m of src.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)) noteReg(m[1], f);
  // Object.assign(window, { A, B, C }) 형태도 등록으로 인정한다 — AdminShared 가 이 방식을 쓴다.
  for (const m of src.matchAll(/Object\.assign\(\s*window\s*,\s*\{([\s\S]*?)\}\s*\)/g)) {
    for (const k of m[1].matchAll(/([A-Za-z_$][\w$]*)\s*(?::|,|\})/g)) noteReg(k[1], f);
  }
}

const missing = [];
const crossBundle = [];
for (const [f, src] of sources) {
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/<window\.([A-Za-z_$][\w$]*)/g)) {
      if (line.trim().startsWith("//")) continue; // 주석 안의 예시는 제외
      const hit = { file: path.relative(ROOT, f), line: i + 1, name: m[1], text: line.trim().slice(0, 100) };
      if (!registered.has(m[1])) { missing.push(hit); continue; }
      // 메인 번들 파일이 쓰는데 등록은 관리자 번들에서만 했다 → 일반 방문자에게 조용히 사라진다.
      if (inMain(f) && !registeredInMain.has(m[1])) crossBundle.push(hit);
    }
  });
}

if (crossBundle.length) {
  console.log(`⚠ 메인 번들이 쓰는데 **관리자 번들에서만** 등록된 컴포넌트 ${crossBundle.length}건`);
  console.log(`   — 화면이 죽지는 않고 그 부분만 조용히 사라진다. 가장 늦게 발견되는 종류다.\n`);
  crossBundle.forEach((m) => {
    console.log(`  • ${m.file}:${m.line}  window.${m.name}`);
    console.log(`      ${m.text}`);
  });
  console.log(`\n고치는 법: 그 컴포넌트를 components/ 로 옮기고 src/entry-main.jsx 에서 import 한다.`);
  process.exit(1);
}

if (missing.length === 0) {
  console.log("✅ <window.X/> 로 쓰는 컴포넌트가 전부 window 에 등록돼 있다.");
  process.exit(0);
}
console.log(`⚠ window 에 등록되지 않은 컴포넌트를 렌더하는 곳 ${missing.length}건 — React #130 의 원인이다:\n`);
missing.forEach((m) => {
  console.log(`  • ${m.file}:${m.line}  window.${m.name}`);
  console.log(`      ${m.text}`);
});
console.log(`\n고치는 법: 그 컴포넌트를 정의한 파일 끝에 \`window.이름 = 이름;\` 을 추가한다.`);
process.exit(1);

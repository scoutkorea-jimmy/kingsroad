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

// 어디선가 window 에 붙였는가.
const registered = new Set();
for (const src of sources.values()) {
  for (const m of src.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)) registered.add(m[1]);
  // Object.assign(window, { A, B, C }) 형태도 등록으로 인정한다 — AdminShared 가 이 방식을 쓴다.
  for (const m of src.matchAll(/Object\.assign\(\s*window\s*,\s*\{([\s\S]*?)\}\s*\)/g)) {
    for (const k of m[1].matchAll(/([A-Za-z_$][\w$]*)\s*(?::|,|\})/g)) registered.add(k[1]);
  }
}

const missing = [];
for (const [f, src] of sources) {
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/<window\.([A-Za-z_$][\w$]*)/g)) {
      if (registered.has(m[1])) continue;
      if (line.trim().startsWith("//")) continue; // 주석 안의 예시는 제외
      missing.push({ file: path.relative(ROOT, f), line: i + 1, name: m[1], text: line.trim().slice(0, 100) });
    }
  });
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

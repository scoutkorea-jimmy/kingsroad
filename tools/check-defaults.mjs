#!/usr/bin/env node
// 뱅기노자 — 코드의 기본값 ↔ 서버 실제값 대조 (v00.303)
//
// 왜: data.js 의 DEFAULT_* 는 **서버(D1)가 응답하지 않을 때만** 쓰이는 폴백이다.
//     평소엔 서버 값이 덮어쓰므로 어긋나 있어도 아무도 모른다.
//     그러다 서버가 잠깐 느려지는 순간 **엉뚱한 값이 화면에 뜬다.**
//
//     실제로 어긋나 있었다(2026-08-21 실측):
//       · 등급   — 코드 '방문객·입문·독자·사관·왕사남' vs 서버 '길손·여정자·개척자·길잡이·기록자'
//       · 게시판 — 코드에 `언론보도`·`한켠역사문화포럼` 이 없었다. 서버가 죽으면 두 게시판이 통째로 사라진다.
//                 반대로 코드에만 있던 `column` 은 서버에 없는 유령이었다.
//
// ⚠ 이 검사는 **네트워크가 필요**하다. 그래서 check-all(오프라인 보장)에는 넣지 않는다.
//    배포 전이나 서버 데이터를 손댄 뒤에 따로 돌린다.
//
// 실행: node tools/check-defaults.mjs

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.bgnj.net/api";
const src = readFileSync(path.join(ROOT, "data.js"), "utf8");

// data.js 의 배열 리터럴에서 id/label 짝만 뽑는다(전체 평가 없이 안전하게).
const pairsOf = (constName) => {
  const i = src.indexOf(`const ${constName} = [`);
  if (i < 0) return null;
  const block = src.slice(i, src.indexOf("\n];", i));
  const out = {};
  for (const m of block.matchAll(/id:\s*"([^"]+)",\s*label:\s*"([^"]+)"/g)) out[m[1]] = m[2];
  return out;
};

const get = async (p) => {
  const res = await fetch(`${API}${p}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${p} → HTTP ${res.status}`);
  return res.json();
};

let bad = 0;
const compare = (label, code, server) => {
  const keys = [...new Set([...Object.keys(code), ...Object.keys(server)])].sort();
  const diffs = keys.filter((k) => code[k] !== server[k]);
  if (diffs.length === 0) { console.log(`✅ ${label} — ${keys.length}개 일치`); return; }
  bad += diffs.length;
  console.log(`❌ ${label} — ${diffs.length}건 어긋남`);
  for (const k of diffs) {
    if (!(k in server)) console.log(`   · ${k}: 코드에만 있다 ("${code[k]}") — 서버에 없는 유령이다`);
    else if (!(k in code)) console.log(`   · ${k}: 서버에만 있다 ("${server[k]}") — 서버가 죽으면 이게 통째로 사라진다`);
    else console.log(`   · ${k}: 코드 "${code[k]}" ≠ 서버 "${server[k]}"`);
  }
};

console.log("코드 기본값 ↔ 서버 실제값 대조\n");
try {
  const [cats, grades] = await Promise.all([get("/categories"), get("/grades")]);
  compare("게시판", pairsOf("DEFAULT_CATEGORIES") || {},
    Object.fromEntries((cats.categories || []).map((c) => [c.id, c.label])));
  compare("회원 등급", pairsOf("DEFAULT_GRADES") || {},
    Object.fromEntries((grades.grades || []).map((g) => [g.id, g.label])));
} catch (e) {
  console.log(`⚠ 서버에 닿지 못했다 — 대조를 건너뛴다: ${e.message}`);
  process.exit(0);   // 네트워크 문제로 빌드를 세우지는 않는다
}

console.log(bad === 0
  ? "\n✅ 코드 기본값이 서버와 일치한다."
  : `\n❌ ${bad}건 어긋남 — data.js 의 DEFAULT_* 를 서버에 맞춰라.`);
process.exit(bad === 0 ? 0 : 1);

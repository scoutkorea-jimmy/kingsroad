#!/usr/bin/env node
// 뱅기노자 — 모든 검사를 한 번에 (v00.297)
//
// AI 든 사람이든, 손대고 나서 **이것 하나만 돌리면** 오늘까지 겪은 사고들이 걸러진다.
// 각 검사는 전부 '운영에서 한 번 터진 뒤' 만들어졌다. 목록 자체가 사고 기록이다.
//
// 실행: node tools/check-all.mjs

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CHECKS = [
  { file: "check-syntax.mjs",   what: "문법 + 금지 패턴", born: "기본" },
  { file: "check-version.mjs",  what: "BGNJ_VERSION ↔ index.html ?v= 일치", born: "옛 코드가 배포되는 사고" },
  { file: "check-globals.mjs",  what: "<window.X/> 미등록 + 번들 경계", born: "한켠 예약 탭 깨짐 · 결제 화면 입금 계좌 실종" },
  { file: "check-hooks.mjs",    what: "early return 뒤에 놓인 훅", born: "React #300/#310 75건" },
  { file: "check-ghosts.mjs",   what: "없는 함수를 부르는 곳 (?. 가 감춘 오타)", born: "방문 기록 1,789건이 빈 칸으로 쌓임" },
  { file: "check-patterns.mjs", what: "응답 껍데기 · 세고-나서-넣기 · LIKE 와일드카드", born: "게시글 못 찾음 · 오버부킹 · 위험한 DELETE" },
  { file: "smoke.mjs",          what: "브라우저 코드를 Node 에서 실제로 실행", born: "API 는 멀쩡한데 화면만 깨진 사고" },
];

let failed = 0;
console.log("뱅기노자 — 전체 검사\n");
for (const c of CHECKS) {
  const r = spawnSync(process.execPath, [path.join(ROOT, "tools", c.file)], { encoding: "utf8" });
  const ok = r.status === 0;
  if (!ok) failed += 1;
  console.log(`${ok ? "✅" : "❌"} ${c.file.replace(".mjs", "").padEnd(16)} ${c.what}`);
  if (!ok) {
    console.log(`   (이 검사는 이래서 생겼다: ${c.born})`);
    console.log((r.stdout || r.stderr || "").split("\n").map((l) => `   ${l}`).join("\n"));
  }
}
console.log(failed === 0
  ? "\n✅ 전부 통과. 커밋해도 좋다."
  : `\n❌ ${failed}개 검사 실패 — 위 내용을 먼저 해결할 것.`);
process.exit(failed === 0 ? 0 : 1);

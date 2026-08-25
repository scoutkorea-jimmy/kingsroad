#!/usr/bin/env node
// 뱅기노자 — 버전 기록 자동 생성 (v00.306.009)
//
// 왜 필요한가:
//   관리자 '버전 기록' 화면이 **v00.288.002(2026-06-07)에서 멈춰 있었다.** 그 사이 18개 버전이 나갔다.
//   운영자가 열어 보면 "쓰다 만 것 같다" 는 인상을 준다 — 실제로 사용자가 그렇게 말했다.
//
//   원인은 게으름이 아니라 **구조**다. 그 기록은 배포할 때마다 AdminDesignHub.jsx 를
//   손으로 고쳐야 채워졌다. 손으로 해야 하는 일은 언젠가 반드시 멈춘다.
//   CLAUDE.md 에도 "v00.202 이후 상시 미수정 패턴" 이라 적혀 있었다 —
//   **문제를 알고도 사람에게 다시 맡겨 둔 것**이 진짜 문제였다.
//
// 무엇을 하나:
//   git 커밋 제목의 `(v00.306.008)` 을 읽어 버전 기록을 만든다.
//   커밋은 어차피 매번 남으므로 **더 이상 멈출 수 없다.**
//
// 손으로 쓴 옛 기록(213건)은 버리지 않는다 — 훨씬 자세하다.
//   화면이 둘을 합치고, 같은 버전이면 손으로 쓴 쪽을 쓴다.
//
// 실행: node tools/version-history.mjs   (배포 순서에 포함 — build 전에 돌린다)

import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "version-history.json");
// 커밋 본문에 나올 리 없는 제어문자를 구분자로 쓴다. 본문에 개행·파이프가 자유롭게 들어가기 때문이다.
const SEP = "\x1e";
const FIELD = "\x1f";

const raw = execFileSync("git", [
  "log", "--no-merges", `--pretty=format:%H${FIELD}%aI${FIELD}%s${FIELD}%b${SEP}`,
], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

// 커밋 제목에서 버전을 뽑는다. `fix(댓글): … (v00.306.001)` 형태.
const VERSION_RE = /\(v(\d{2}\.\d{3}\.\d{3})\)\s*$/;

// 커밋 본문에서 사람이 읽을 항목만 남긴다.
//   서명 줄은 뺀다 — 운영자에게 아무 뜻이 없다.
const cleanDetails = (body) => String(body || "")
  .split("\n")
  .map((l) => l.replace(/\s+$/, ""))
  .filter((l) => l.trim())
  .filter((l) => !/^(Co-Authored-By|Signed-off-by)/i.test(l))
  .filter((l) => !/^(Generated with|\u{1F916})/iu.test(l));

const seen = new Map();
for (const chunk of raw.split(SEP)) {
  const [sha, iso, subject, body] = chunk.replace(/^\n+/, "").split(FIELD);
  if (!sha || !subject) continue;
  const m = subject.match(VERSION_RE);
  if (!m) continue;                 // 버전을 안 붙인 커밋(문서·잡일)은 기록에 넣지 않는다.
  const version = m[1];
  if (seen.has(version)) continue;  // 같은 버전이 여러 커밋이면 가장 최근 것 하나만.
  seen.set(version, {
    version,
    date: iso.slice(0, 10),
    datetime: iso,
    summary: subject.replace(VERSION_RE, "").trim(),
    details: cleanDetails(body),
    source: "git",
    sha: sha.slice(0, 7),
  });
}

// 버전 내림차순 (자리수가 고정이라 문자열 정렬로 충분하다).
const entries = [...seen.values()].sort((a, b) => (a.version < b.version ? 1 : a.version > b.version ? -1 : 0));

// 지금 배포된 버전이 기록에 있는지 알려 준다. 없으면 '이번 커밋' 이라 아직 git 에 없는 것이다.
let current = "";
try { current = JSON.parse(readFileSync(path.join(ROOT, "version.json"), "utf8")).version || ""; } catch (e) { void e; }

writeFileSync(OUT, JSON.stringify({
  generatedAt: new Date().toISOString(),
  current,
  count: entries.length,
  entries,
}) + "\n");

const newest = entries[0]?.version || "(없음)";
console.log(`[version-history] ✓ ${entries.length}개 버전 — 최신 ${newest}${current && newest !== current ? ` (현재 배포 ${current} 는 이번 커밋이라 다음 실행에 들어온다)` : ""}`);

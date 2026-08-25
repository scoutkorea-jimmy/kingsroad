#!/usr/bin/env node
// 뱅기노자 — 오늘 실제로 사고를 낸 위험 패턴 검사 (v00.297)
//
// 여기 있는 것들은 전부 **운영에서 한 번씩 터진 뒤에** 추가됐다.
// 문법 오류가 아니라서 어떤 검사에도 안 걸리고, 조용히 화면만 망가뜨리는 종류다.
//
// 실행: node tools/check-patterns.mjs

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const findings = [];
const add = (file, line, rule, text, why) =>
  findings.push({ file, line, rule, text: text.trim().slice(0, 110), why });

const walk = async (dir, out = []) => {
  let entries = [];
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".git" || e.name === "dist") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (/\.(jsx?|mjs)$/.test(e.name)) out.push(full);
  }
  return out;
};

const files = await walk(ROOT);

for (const f of files) {
  const rel = path.relative(ROOT, f);
  if (rel.startsWith("tools/")) continue;      // 검사 도구 자신은 제외
  const src = await fs.readFile(f, "utf8");
  const lines = src.split("\n");

  lines.forEach((line, i) => {
    const n = i + 1;
    const t = line.trim();
    if (t.startsWith("//") || t.startsWith("*")) return;
    // 프로젝트 표준 무시 주석 — CLAUDE.md 의 `bgnj-lint-ignore-next-line` 규칙과 같은 형식.
    //   사유를 함께 적게 되어 있으므로, 무시한 이유가 코드에 남는다.
    //   무시 주석과 대상 줄 사이에 사유가 여러 줄 들어갈 수 있으므로 앞 6줄까지 본다.
    //   (사유를 한 줄로 줄이라고 강요하면 '왜 무시했는지' 가 부실해진다.)
    const nearby = lines.slice(Math.max(0, i - 6), i + 1).join("\n");
    if (/bgnj-lint-ignore-next-line/.test(nearby)) return;

    // ① 단일 조회 응답의 껍데기를 안 벗기고 그대로 쓰는 패턴.
    //    서버는 { post: {...} } / { column: {...} } 처럼 감싸서 준다.
    //    통째로 매핑하면 id 가 undefined 인 껍데기가 되고, 그것이 목록의 진짜 항목을
    //    갈아치우면 '해당 게시글을 찾을 수 없습니다' 가 뜬다(2026-08-21 사고).
    const m1 = line.match(/const\s+(\w+)\s*=\s*await\s+window\.BGNJ_API\.(\w+)\.get\(/);
    if (m1) {
      const varName = m1[1];
      const rest = lines.slice(i, i + 6).join("\n");
      const unwrapped = new RegExp(`${varName}\\s*(\\?\\.|\\.)\\s*\\w+\\s*\\|\\||${varName}\\s*\\?\\.\\s*\\w+\\s*\\?`).test(rest)
        || new RegExp(`\\{\\s*\\w+\\s*\\}\\s*=\\s*${varName}`).test(rest);
      const mappedRaw = new RegExp(`_to\\w+\\(\\s*${varName}\\s*\\)|_serverPostToUi\\(\\s*${varName}\\s*\\)`).test(rest);
      if (mappedRaw && !unwrapped) {
        add(rel, n, "api-unwrap", line,
          "단일 조회 응답을 껍데기째 매핑한다. `res?.post || res` 처럼 벗겨내라.");
      }
    }

    // ② 세고 나서 넣기 — 정원·중복 판정의 경쟁 상태.
    //    COUNT 를 읽고, 판단하고, INSERT 하면 동시 요청이 같은 숫자를 본다.
    //    한 문장(INSERT ... SELECT ... WHERE NOT EXISTS)으로 묶어야 한다.
    if (/SELECT\s+COUNT\(\*\)/i.test(line) && rel.startsWith("workers/")) {
      const after = lines.slice(i, i + 25).join("\n");
      // v00.306.004 — 규칙을 하나 더 읽게 한다. 여기서 문턱을 낮추면(25줄 → 10줄 따위)
      //   진짜 '세고 나서 넣기' 까지 같이 놓친다. 대신 **세는 자리의 성격**을 본다.
      //   상관 서브쿼리 `(SELECT COUNT(*) ... ) AS 별칭` 은 목록에 수를 실어 보내는 읽기다.
      //   정원·중복 판정과 달리 아무것도 쓰지 않으므로 동시 요청 문제가 없다.
      //   실제 오탐: handlePostsList · handleColumnsList 의 댓글 수(v00.306.002~004).
      const isCorrelatedRead = /\(\s*SELECT\s+COUNT\(\*\)/i.test(line)
        && /\)\s*AS\s+\w+/i.test(lines.slice(i - 1, i + 3).join("\n"));
      if (!isCorrelatedRead && /INSERT\s+INTO/i.test(after) && !/INSERT[\s\S]{0,400}SELECT/i.test(after)) {
        add(rel, n, "count-then-insert", line,
          "세고 나서 넣는다. 동시 요청이 같은 숫자를 본다 — 한 문장으로 원자화하라.");
      }
    }

    // ③ SQL LIKE 에서 '_' 를 문자로 착각한 패턴.
    //    SQLite 에서 _ 는 '아무 문자 하나' 다. '__%시험%' 는 의도보다 훨씬 넓게 지운다.
    if (/LIKE\s+['"][^'"]*_/.test(line) && !/ESCAPE/i.test(line)) {
      const lit = line.match(/LIKE\s+['"]([^'"]*)['"]/);
      if (lit && /_/.test(lit[1]) && !/^%?[a-z_]+%?$/i.test(lit[1])) {
        add(rel, n, "like-underscore", line,
          "LIKE 패턴 안의 _ 는 와일드카드다. 의도한 글자라면 ESCAPE 를 쓰거나 = 로 비교하라.");
      }
    }
  });
}

if (findings.length === 0) {
  console.log("✅ 위험 패턴 0건 (응답 껍데기 · 세고-나서-넣기 · LIKE 와일드카드)");
  process.exit(0);
}
console.log(`⚠ 위험 패턴 ${findings.length}건 — 전부 운영에서 한 번씩 터진 종류다:\n`);
for (const f of findings) {
  console.log(`  • [${f.rule}] ${f.file}:${f.line}`);
  console.log(`      ${f.text}`);
  console.log(`      → ${f.why}`);
}
process.exit(1);

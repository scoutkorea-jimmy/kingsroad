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
// data.js / api.js 는 hand-written. boot.jsx (v00.071) 는 빌드 소스 (boot.js 는 산출물 → 제외).
const TARGET_ROOT_FILES = ["data.js", "api.js", "boot.jsx"];

const collect = async (dir, out = []) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  // v00.071 — *.jsx 와 짝 *.js 가 같은 폴더에 공존하면 .js 는 빌드 산출물이므로 lint 제외.
  const names = new Set(entries.filter((e) => e.isFile()).map((e) => e.name));
  for (const e of entries) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await collect(p, out);
    else if (/\.jsx$/.test(e.name)) out.push(p);
    else if (/\.mjs$/.test(e.name)) out.push(p);
    else if (/\.js$/.test(e.name)) {
      const jsxTwin = e.name.replace(/\.js$/, ".jsx");
      if (!names.has(jsxTwin)) out.push(p); // hand-written .js (KoreaMapData 등) 만 통과
    }
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
  // v00.286 — ESM 전환(import/export) 이후 module 로 파싱. esbuild 도 module 로 번들.
  sourceType: "module",
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
//    각 룰은 { name, allow:Set<rel>, pattern:RegExp, msg } 구조.
//    라인 단위로 검사하고 같은 줄 또는 한 줄 위에 `// bgnj-lint-ignore-next-line <RULE>` 이 있으면 스킵.
//    주석(//) / 블록 주석 / 백틱 docstring 안의 매치는 자동 무시 (false positive 차단).
const RULES = [
  {
    name: "BANGINOJA_DATA",
    allow: new Set(["data.js"]),
    pattern: /\bwindow\.BANGINOJA_DATA\b/,
    msg: "BANGINOJA_DATA 직접 참조 금지 (서버 source-of-truth)",
  },
  {
    name: "console.log",
    // data.js: 버전 배지/마이그레이션 진단 / api.js: 에러 진단 — 의도된 콘솔 출력 허용.
    allow: new Set(["data.js", "api.js"]),
    pattern: /\bconsole\.log\s*\(/,
    msg: "console.log 잔재 금지 (production 노이즈) — 진단은 console.error/warn 또는 errorLog 헬퍼 사용",
  },
  {
    name: "var",
    // var 키워드는 ES2015+ 환경에서 let/const 로 대체. 호이스팅·재선언 함정 방지.
    allow: new Set(),
    pattern: /(^|[\s;{(,])var\s+[a-zA-Z_$]/,
    msg: "var 키워드 금지 — let / const 사용",
  },
  {
    name: "direct_fetch",
    // BGNJ_API wrapper 우회 차단 — 인증/CORS/error log/헬퍼가 보장되지 않음.
    // api.js (실제 wrapper) + data.js (테스트 헬퍼) 만 허용.
    allow: new Set(["api.js", "data.js"]),
    pattern: /(^|[^.\w])fetch\s*\(/,
    msg: "fetch 직접 호출 금지 — BGNJ_API 헬퍼 사용",
  },
  {
    // v00.233 — `(data || []).map(...)` 패턴은 비-배열 API 응답(null/undefined/object)이
    // 캐시를 빈 배열로 덮어써 사용자에게 "데이터 사라짐" 으로 보이게 한 v00.231 사고의 원인.
    // 23곳 일괄 가드(Array.isArray 검증) 했으나 재발 방지 위해 lint 룰로 항구 차단.
    // 우회: `if (Array.isArray(data)) cache = data.map(...)` 또는 마커.
    name: "cache_overwrite",
    allow: new Set([]),
    pattern: /\(\s*\w+\s*\|\|\s*\[\]\s*\)\.map\b/,
    msg: "(data || []).map() 금지 — 비-배열 응답이 캐시를 빈 배열로 덮어쓰는 데이터-사라짐 안티패턴 (v00.231 사고). Array.isArray(data) 가드 후 data.map(...) 사용",
  },
  {
    // v00.262 audit — 100vh 단독 사용 금지. iOS Safari URL bar 접힘 시 viewport jump.
    // 100dvh fallback 페어와 같이 사용해야 함. styles.css 의 4개 위치는 100vh + 100dvh
    // pair 로 갱신됨 (v00.262.003).
    name: "viewport_100vh",
    // AdminDesignHub.jsx 는 디자인 가이드 로그 문자열 — false positive.
    allow: new Set(["pages/admin/AdminDesignHub.jsx"]),
    pattern: /:\s*100vh\b/,
    msg: "100vh 단독 사용 금지 — 다음 줄에 100dvh fallback pair 필수 (iOS Safari URL bar viewport jump). 같은 declaration 의 위/아래에 100dvh 가 있으면 false positive — 그땐 마커로 우회",
  },
  {
    // v00.262 audit — scoll lock 직접 조작 금지. window.BGNJ_SCROLL_LOCK 헬퍼 강제.
    // v00.258 SiteSearchOverlay 가 prev-snapshot 패턴으로 회귀 일으킨 사고의 영구 차단.
    name: "scroll_lock_raw",
    // Shell.jsx 는 BGNJ_SCROLL_LOCK 헬퍼의 정의 위치 — 헬퍼 자체 구현은 raw 조작 필요.
    allow: new Set(["components/Shell.jsx"]),
    pattern: /document\.body\.style\.overflow\s*=/,
    msg: "document.body.style.overflow 직접 조작 금지 — window.BGNJ_SCROLL_LOCK.lock()/unlock() 사용 (v00.258→260 회귀)",
  },
];

// 추가 정보성 검사 — 위반이 있어도 차단은 안 하고 카운트만 보고.
// 룰별로 첫 5건씩 묶어 출력.
// v00.114 — false-positive 차단:
//   · TODO 룰: 코멘트 마커 (// TODO, /* TODO) 만 매치. 문자열 내 'TODO' 단어 제외.
//   · equality_loose: `== null` / `!= null` 은 의도된 idiom (null + undefined 동시 검사) — 매치 제외.
const INFO_RULES = [
  {
    name: "TODO",
    // `// TODO`, `/* TODO`, `* TODO` (JSDoc 행 시작) 만 매치.
    pattern: /(?:\/\/|\/\*|^\s*\*)\s*(TODO|FIXME|HACK|XXX)\b/,
    msg: "잔재 마커 (코멘트)",
  },
  {
    name: "equality_loose",
    // `== null` / `!= null` 은 idiom — lookahead 로 제외.
    pattern: /[^=!<>]==(?!\s*null\b)[^=]|[^=!]!=(?!\s*null\b)[^=]/,
    msg: "느슨한 비교(==/!=) — === / !== 권장",
  },
  {
    // v00.262 audit — silent catch 218건 추적. 정책: 최소 console.warn 으로 가시화.
    // catch (e?) {} 빈 블록만 매치. catch(e){console.warn(...)} 등은 제외.
    name: "silent_catch",
    pattern: /\}\s*catch\s*(?:\([^)]*\))?\s*\{\s*\}/,
    msg: "silent catch {} — 최소 console.warn 으로 가시화 (운영 진단). 의도 silent 면 // bgnj-allow-silent 같은 줄 동반",
  },
  {
    // v00.262 audit — aspectRatio + objectFit:'cover' 조합은 이미지 강제 자름 (v00.260 사고).
    // 표지/배너 등은 contain 권장.
    name: "aspect_cover_clip",
    pattern: /aspectRatio[\s\S]{0,80}objectFit\s*:\s*['"]cover['"]/,
    msg: "aspectRatio + objectFit:cover 조합은 이미지 자름 — contain 검토 (v00.260 ImageSlider 사고)",
  },
  {
    // v00.289 — 옐로우 면적 5% 룰의 가시화.
    //
    // 차단 룰로 만들려 했으나 실측 결과 오탐 100% 라 정보성으로 둔다.
    // 조사 시점(v00.289) JSX 인라인 배경 옐로우는 7건이고 전부 규칙이 허용하는 용도였다 —
    // 프로그레스 바 3(AuthAdminPage / UploadOverlay / MediaGallery), CTA 버튼 2(ErrorPages / boot),
    // 로고 마크 1(ErrorPages), 알림 배지 dot 1(Shell). 규칙이 허용하는 "CTA·focus·로고·active dot" 그대로다.
    //
    // 정규식은 '면적'을 볼 수 없다. 버튼의 옐로우 배경(정당)과 섹션의 옐로우 배경(위반)이
    // 소스에선 똑같이 생겼다. 그래서 판단은 사람/리뷰가 하고, 룰은 개수만 세어 눈에 띄게 한다.
    // 이 숫자가 눈에 띄게 늘면 그때 실제로 면적을 깔고 있는지 확인할 것.
    //
    // 진짜 위반이었던 히어로 제목 옐로우(둘째 줄 전체)는 background 가 아니라 text color 라
    // 애초에 이 패턴으로 잡히지도 않았다 — v00.289 에서 --secondary 로 교체 완료.
    name: "brand_yellow_surface",
    pattern: /background(?:Color)?\s*:\s*['"`]?\s*(?:var\(--primary\)|#[Ff]5[Dd]548)/,
    msg: "옐로우 배경 사용 — CTA/focus/로고/active dot 외의 면적이면 위반 (rules/20-design.md §8)",
  },
];

// 파일 라인 수 limit — 정보성. 큰 파일은 분할 권장.
const LARGE_FILE_LIMIT = 8000;

const violations = [];
const infos = [];
const largeFiles = [];
for (const f of targets) {
  const rel = path.relative(ROOT, f);
  const code = await fs.readFile(f, "utf8");
  const lines = code.split("\n");
  if (lines.length > LARGE_FILE_LIMIT) {
    largeFiles.push({ file: rel, lines: lines.length });
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 코드 상의 실제 매치만 검사 — 주석/백틱 제거.
    const stripped = line.replace(/\/\/.*$/, "").replace(/`[^`]*`/g, "''");
    for (const rule of RULES) {
      if (rule.allow.has(rel)) continue;
      const ignoreMarker = new RegExp(`bgnj-lint-ignore-next-line\\s+${rule.name.replace(/\./g, "\\.")}`);
      // 같은 줄 또는 직전 줄에 마커가 있으면 스킵.
      if (ignoreMarker.test(line)) continue;
      if (i > 0 && ignoreMarker.test(lines[i - 1])) continue;
      if (rule.pattern.test(stripped)) {
        violations.push({ file: rel, line: i + 1, rule: rule.name, msg: `${rule.msg} — 우회 시 // bgnj-lint-ignore-next-line ${rule.name}` });
      }
    }
    // 정보성 — 차단 안 함, 카운트만.
    // v00.262.005 — 같은 줄 inline 마커도 지원. silent_catch 의 경우 `// bgnj-allow-silent`,
    // 일반은 `// bgnj-lint-ignore-next-line <rule>`. 의도 silent (try{sessionStorage..}catch{})
    // 같은 hot path 는 마커로 무시.
    for (const rule of INFO_RULES) {
      // ignore marker — same line or previous line.
      const inlineIgnore = /\/\/.*\bbgnj-allow-silent\b/.test(line)
        || new RegExp(`bgnj-lint-ignore-next-line\\s+${rule.name.replace(/\./g, '\\.')}`).test(line)
        || (i > 0 && new RegExp(`bgnj-lint-ignore-next-line\\s+${rule.name.replace(/\./g, '\\.')}`).test(lines[i - 1]));
      if (inlineIgnore) continue;
      if (rule.pattern.test(stripped)) {
        infos.push({ file: rel, line: i + 1, rule: rule.name, msg: rule.msg });
      }
    }
  }
}

// 5) 보고.
if (bad === 0 && violations.length === 0) {
  console.log(`✅ ${targets.length} files parsed cleanly.`);
  if (infos.length > 0) {
    // 정보성 — 룰별 그룹화. 룰별 첫 3 건씩만 노출. 차단은 안 함.
    const byRule = new Map();
    for (const v of infos) {
      if (!byRule.has(v.rule)) byRule.set(v.rule, []);
      byRule.get(v.rule).push(v);
    }
    for (const [ruleName, items] of byRule) {
      console.log(`ℹ [${ruleName}] ${items.length} 건 — 처음 3:`);
      for (const v of items.slice(0, 3)) {
        console.log(`    • ${v.file}:${v.line}`);
      }
    }
  }
  if (largeFiles.length > 0) {
    console.log(`ℹ [large_file] ${largeFiles.length} 건 (> ${LARGE_FILE_LIMIT} 줄):`);
    for (const lf of largeFiles) {
      console.log(`    • ${lf.file} — ${lf.lines} 줄 (분할 권장)`);
    }
  }
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
    console.error(`  • [${v.rule}] ${v.file}:${v.line} — ${v.msg}`);
  }
}
console.error("\n커밋 전 위 항목을 먼저 정리해 주세요.");
process.exit(1);

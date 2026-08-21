#!/usr/bin/env node
// 뱅기노자 — React 훅 규칙 검사 (v00.295.006)
//
// 왜: 운영 오류 기록에 React #310('Rendered more hooks than during the previous render')이
//     19건, #300 이 56건 쌓여 있었다. 이 오류는 화면이 통째로 깨진다.
//     원인은 거의 항상 '조건부로 훅을 부르는 것' 이고, 가장 흔한 형태가
//     early return 뒤에 훅이 오는 배치다. 사람 눈으로는 긴 컴포넌트에서 잘 안 보인다.
//
// 검사: 컴포넌트 함수 본문의 최상위에서 return 이 나온 뒤에 React.useXxx 가 등장하면 보고.
//       조건문·반복문·논리연산 안의 훅 호출도 함께 본다.
//
// 실행: node tools/check-hooks.mjs

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const require = createRequire(path.join(__dirname, "noop.cjs"));
const parser = require("@babel/parser");

const TARGET_DIRS = ["components", "pages", "pages/admin", "src"];
const isHookName = (n) => /^use[A-Z]/.test(n || "");

// React.useState(...) / useState(...) 둘 다 훅 호출로 본다.
const hookNameOf = (node) => {
  if (node?.type !== "CallExpression") return null;
  const c = node.callee;
  if (c?.type === "Identifier" && isHookName(c.name)) return c.name;
  if (c?.type === "MemberExpression" && c.object?.name === "React" && isHookName(c.property?.name)) {
    return `React.${c.property.name}`;
  }
  return null;
};

const walk = (node, fn, parent = null) => {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) { node.forEach((n) => walk(n, fn, parent)); return; }
  if (typeof node.type === "string") fn(node, parent);
  for (const k of Object.keys(node)) {
    if (k === "loc" || k === "leadingComments" || k === "trailingComments") continue;
    walk(node[k], fn, node);
  }
};

const findings = [];

const checkComponent = (name, body, file) => {
  if (!body || body.type !== "BlockStatement") return;
  let returnLine = null;
  for (const stmt of body.body) {
    // 최상위 return — 이 뒤에 오는 훅은 조건부 실행이다.
    if (stmt.type === "ReturnStatement" && returnLine === null) returnLine = stmt.loc?.start?.line ?? null;
    if (stmt.type === "IfStatement") {
      // if (...) return ... 형태의 early return
      const c = stmt.consequent;
      const hasReturn = c?.type === "ReturnStatement"
        || (c?.type === "BlockStatement" && c.body.some((s) => s.type === "ReturnStatement"));
      if (hasReturn && returnLine === null) returnLine = stmt.loc?.start?.line ?? null;
    }
    if (returnLine === null) continue;
    // return 이 이미 나온 뒤의 문장에서 훅을 찾는다. 단 중첩 함수 안은 제외(별도 컴포넌트/콜백).
    walk(stmt, (n, parent) => {
      const h = hookNameOf(n);
      if (!h) return;
      // 중첩 함수 안이면 그 함수의 훅이므로 여기서 판단하지 않는다.
      if (n.__skip) return;
      findings.push({
        file, component: name, hook: h,
        line: n.loc?.start?.line, afterReturn: returnLine,
      });
    });
  }
};

// 중첩 함수 본문을 통째로 표시해 두어 상위 검사에서 제외한다.
const markNested = (fnNode) => {
  let depth = 0;
  walk(fnNode.body, (n) => {
    if (n === fnNode.body) return;
    if (n.type === "FunctionExpression" || n.type === "ArrowFunctionExpression" || n.type === "FunctionDeclaration") {
      walk(n.body, (m) => { m.__skip = true; });
    }
  });
  return depth;
};

const files = [];
for (const d of TARGET_DIRS) {
  const dir = path.join(ROOT, d);
  let entries = [];
  try { entries = await fs.readdir(dir); } catch { continue; }
  for (const e of entries) {
    if (/\.(jsx|js)$/.test(e)) files.push(path.join(dir, e));
  }
}

for (const file of files) {
  const code = await fs.readFile(file, "utf8");
  let ast;
  try {
    ast = parser.parse(code, { sourceType: "module", plugins: ["jsx", "classProperties", "optionalChaining", "nullishCoalescingOperator"] });
  } catch { continue; }
  walk(ast.program, (n) => {
    let name = null, fnNode = null;
    if (n.type === "VariableDeclarator" && n.id?.type === "Identifier"
        && (n.init?.type === "ArrowFunctionExpression" || n.init?.type === "FunctionExpression")) {
      name = n.id.name; fnNode = n.init;
    } else if (n.type === "FunctionDeclaration" && n.id?.name) {
      name = n.id.name; fnNode = n;
    }
    if (!name || !fnNode || !/^[A-Z]/.test(name)) return;
    markNested(fnNode);
    checkComponent(name, fnNode.body, path.relative(ROOT, file));
  });
}

if (findings.length === 0) {
  console.log("✅ early return 뒤에 놓인 훅 0건.");
  process.exit(0);
}
console.log(`⚠ early return 뒤에 훅이 있는 곳 ${findings.length}건 — React #300/#310 의 원인이 된다:\n`);
findings.forEach((f) => {
  console.log(`  • ${f.file}:${f.line}  ${f.component}() 의 ${f.hook}  (같은 함수 ${f.afterReturn}줄에서 이미 return 함)`);
});
process.exit(1);

#!/usr/bin/env node
// D1 백업 — 원격 데이터베이스 전체를 JSON 으로 내려받는다. (v00.294.006)
//
// 왜 필요한가:
//   게시글 86편 · 칼럼 72편 · 회원 · 예약이 전부 Cloudflare D1 안에만 있다.
//   지금까지 이 저장소에는 백업 수단이 없었다. 실수로 지운 행 하나를 되살릴 방법도,
//   "어제는 어땠나" 를 확인할 방법도 없다는 뜻이다.
//   읽기 전용이라 운영에 아무 영향을 주지 않는다.
//
// 사용법:
//   node tools/backup-d1.mjs                 → backups/d1-YYYY-MM-DD-HHMM/ 에 저장
//   node tools/backup-d1.mjs --out <경로>     → 저장 위치 지정
//   node tools/backup-d1.mjs --tables posts,comments   → 일부 테이블만
//
// 전제: workers/ 에서 wrangler 로그인이 되어 있어야 한다 (npx wrangler whoami 로 확인).
// 결과물에는 회원 이메일·비밀번호 해시가 포함된다 — git 에 커밋하지 말 것.
// (backups/ 는 .gitignore 에 등록해 두었다.)

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORKERS = join(ROOT, 'workers');
const DB = 'banginoja-db';

const argOf = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
};

// wrangler 는 JSON 앞에 배너를 찍는다 — 첫 '[' 부터 잘라내 파싱한다.
const query = (sql) => {
  const out = execFileSync(
    'npx',
    ['wrangler', 'd1', 'execute', DB, '--remote', '--command', sql, '--json'],
    { cwd: WORKERS, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  const i = out.indexOf('[');
  if (i < 0) throw new Error(`wrangler 응답에서 JSON 을 찾지 못했습니다:\n${out.slice(0, 400)}`);
  const parsed = JSON.parse(out.slice(i));
  return parsed[0]?.results ?? [];
};

const stamp = () => {
  // 실행 시각을 파일명에 쓴다. KST 기준.
  const d = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}-${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
};

const main = () => {
  const outDir = argOf('--out') || join(ROOT, 'backups', `d1-${stamp()}`);
  const only = (argOf('--tables') || '').split(',').map((s) => s.trim()).filter(Boolean);

  console.error(`[backup-d1] ${DB} (remote) → ${outDir}`);

  let tables = query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
    .map((r) => r.name)
    // sqlite 내부 테이블과 Cloudflare 내부 KV 는 복원 대상이 아니다.
    .filter((n) => !n.startsWith('sqlite_') && n !== '_cf_KV');
  if (only.length) tables = tables.filter((t) => only.includes(t));

  mkdirSync(outDir, { recursive: true });

  const manifest = { database: DB, takenAt: new Date().toISOString(), tables: {} };
  let total = 0;
  let failed = 0;

  for (const t of tables) {
    try {
      const rows = query(`SELECT * FROM "${t}";`);
      writeFileSync(join(outDir, `${t}.json`), JSON.stringify(rows, null, 2) + '\n');
      manifest.tables[t] = rows.length;
      total += rows.length;
      console.error(`  · ${t.padEnd(24)} ${String(rows.length).padStart(6)} 행`);
    } catch (err) {
      // 한 테이블이 실패해도 나머지는 받는다. 다만 조용히 넘기지 않는다.
      failed += 1;
      manifest.tables[t] = { error: String(err.message || err).slice(0, 300) };
      console.error(`  · ${t.padEnd(24)} ✗ 실패 — ${String(err.message || err).split('\n')[0]}`);
    }
  }

  writeFileSync(join(outDir, '_manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

  console.error(`\n${failed ? '⚠' : '✅'} ${tables.length - failed}/${tables.length} 테이블 · 총 ${total} 행 → ${outDir}`);
  if (failed) {
    console.error('실패한 테이블이 있습니다 — _manifest.json 의 error 를 확인하세요.');
    process.exit(1);
  }
};

main();

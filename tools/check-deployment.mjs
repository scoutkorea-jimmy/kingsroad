#!/usr/bin/env node
// CI 산출물과 실제 운영 파일을 비교한다. 배포 성공 표시만으로 완료하지 않는다.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await fs.readFile(new URL('version.json', root), 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const paths = ['version.json', 'index.html', 'community/index.html', 'dist/app.js', 'dist/admin.js', 'dist/heic.js', 'dist/heic-worker.js', 'dist/heic.LICENSE.txt'];
await Promise.all(paths.map(async path => {
  const expected = hash(await fs.readFile(new URL(path, root)));
  let reason = '';
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const url = `https://bgnj.net/${path}?deploy-check=${manifest.version}-${Date.now()}`;
      const response = await fetch(url, { headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (hash(Buffer.from(await response.arrayBuffer())) !== expected) throw new Error('운영 파일이 CI 산출물과 다릅니다');
      console.log(`✅ ${path} · v${manifest.version}`);
      return;
    } catch (error) { reason = error.message; }
    if (attempt < 5) await new Promise(resolve => setTimeout(resolve, 5000));
  }
  throw new Error(`${path}: ${reason}`);
}));

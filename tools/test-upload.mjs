#!/usr/bin/env node
// 실제 브라우저 디코딩은 별도 검증. 여기서는 큐·실패·재시도·용량 관문을 실행한다.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { File } from 'node:buffer';
import { pageViewSeries } from '../pages/admin/analyticsSeries.mjs';
const ROOT = new URL('../', import.meta.url);
let active = 0, peak = 0, conversions = 0, confirmations = 0;
const context = {
  File, Blob, URL, Uint8Array, setTimeout, clearTimeout, console,
  location: { href: 'https://bgnj.net/' },
  BGNJ_TOAST: { info() {}, error() {} },
  BGNJ_CONFIRM: async () => { confirmations++; return false; },
  BGNJ_HEIC_DECODER: { async convert({ blob }) {
    active++; peak = Math.max(peak, active); conversions++;
    try {
      await new Promise(resolve => setTimeout(resolve, 2));
      if (await blob.text() === 'broken') throw new Error('decode failed');
      return new Blob([new Uint8Array([255, 216, 255, 1])], { type: 'image/jpeg' });
    } finally { active--; }
  } },
  Image: class { naturalWidth = 3000; naturalHeight = 2000; set src(value) { queueMicrotask(() => this.onload()); } },
  document: { createElement: () => ({ getContext: () => ({ fillRect() {}, drawImage() {} }), toBlob(fn) { fn(new Blob([new Uint8Array(Math.floor(this.width / 10))], { type: 'image/jpeg' })); } }) },
};
context.window = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('components/ImageShrink.jsx', ROOT), 'utf8'), context);
const helper = context.BGNJ_IMAGE_SHRINK;
const heic = new File(['valid'], 'phone.HEIC', { type: '' });
assert(helper.isImageFile(heic));
const outputs = await Promise.all([helper.prepareFile(heic), helper.prepareFile(heic), helper.prepareFile(new File(['valid'], 'other.heif'))]);
assert.equal(outputs[0].name, 'phone.jpg');
assert.equal(outputs[0].type, 'image/jpeg');
assert.equal(outputs[0], outputs[1]);
assert.equal(conversions, 2);
assert.equal(peak, 1);
const broken = new File(['broken'], 'bad.heic');
await assert.rejects(helper.prepareFile(broken), { code: 'HEIC_CONVERSION_FAILED' });
await assert.rejects(helper.prepareFile(broken));
assert.equal(conversions, 4, '실패 파일 재시도 가능');
const batch = await helper.maybeShrinkAll([broken, new File(['valid'], 'next.heif')], { limitBytes: 1000 });
assert.equal(batch.cancelled.length, 1);
assert.equal(batch.files[0].name, 'next.jpg');
const disguised = new File([outputs[0]], 'browser.heic', { type: 'image/heic' });
const before = conversions;
assert.equal((await helper.prepareFile(disguised)).name, 'browser.jpg');
assert.equal(conversions, before);
const huge = new File([new Uint8Array(1500)], 'large.png', { type: 'image/png' });
const shrunk = await helper.maybeShrinkOne(huge, { limitBytes: 1000 });
assert.equal(shrunk.size, 200);
const tighter = await helper.maybeShrinkOne(huge, { limitBytes: 100 });
assert(tighter.size <= 100, '첫 압축이 한도를 넘으면 더 축소');
assert.equal(confirmations, 0, '한도 초과 사진은 확인창 없이 자동 축소');
const gif = await helper.maybeShrinkAll([new File([new Uint8Array(1500)], 'large.gif', { type: 'image/gif' })], { limitBytes: 1000 });
assert.equal(gif.files.length, 0);
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7YQAAAAASUVORK5CYII=', 'base64');
const iconHeader = new ArrayBuffer(22);
const iconView = new DataView(iconHeader);
iconView.setUint16(2, 1, true); iconView.setUint16(4, 1, true);
iconView.setUint8(6, 1); iconView.setUint8(7, 1);
iconView.setUint16(10, 1, true); iconView.setUint16(12, 32, true);
iconView.setUint32(14, png.length, true); iconView.setUint32(18, 22, true);
const icon = await helper.prepareFile(new File([iconHeader, png], 'favicon.ico'));
assert.equal(icon.name, 'favicon.png');
assert.equal(icon.type, 'image/png');
assert.deepEqual(Buffer.from(await icon.arrayBuffer()), png, 'ICO 내 PNG 원본/투명도 보존');
const pdf = new File(['doc'], 'note.pdf');
assert.equal(await helper.prepareFile(pdf), pdf);
// 서버 UTC 키가 한국 시간과 브라우저 시간대 차이로 누락되는 사고를 막는다.
const now = Date.parse('2026-10-02T02:00:00Z');
const hourly = pageViewSeries({ hourlySeries: [{ hour: '2026-10-02T01', views: 7 }] }, 1, now);
assert.equal(hourly.counts[22], 7);
assert.equal(hourly.labels[22], '10시');
const daily = pageViewSeries({ dailySeries: [{ day: '2026-10-01', views: 51 }, { day: '2026-10-02', views: 9 }] }, 14, now);
assert.equal(daily.counts[12], 51);
assert.equal(daily.counts[13], 9);
assert.equal(daily.labels[13], '10/2');
const logs = fs.readFileSync(new URL('pages/admin/AdminLogPanels.jsx', ROOT), 'utf8');
assert(logs.includes('window.BGNJ_API?.errorLog?.list?.'));
assert(logs.includes('errorRes.value?.errors'));
assert(!logs.includes('BGNJ_API?.admin?.errorLog'));
// 실제 어댑터가 손상 파일·Worker 오류 뒤에 Worker를 정리하는지 검증한다.
let terminated = 0, workerMode = 'error';
const adapter = {
  URL, Blob, Uint8Array, setTimeout, clearTimeout,
  document: { currentScript: { src: 'https://bgnj.net/dist/heic.js?v=test' }, createElement: () => ({ getContext: () => ({ putImageData() {} }), toBlob: fn => fn(new Blob(['jpeg'], { type: 'image/jpeg' })) }) },
  Worker: class {
    constructor(url) { assert.equal(url, 'https://bgnj.net/dist/heic-worker.js?v=test'); }
    postMessage() { queueMicrotask(() => workerMode === 'error' ? this.onerror() : this.onmessage({ data: { imageData: { width: 2, height: 2 } } })); }
    terminate() { terminated++; }
  },
};
adapter.window = adapter;
vm.createContext(adapter);
vm.runInContext(fs.readFileSync(new URL('src/entry-heic.js', ROOT), 'utf8'), adapter);
await assert.rejects(adapter.BGNJ_HEIC_DECODER.convert({ blob: new Blob(['bad']) }));
assert.equal(terminated, 1);
workerMode = 'success';
assert.equal((await adapter.BGNJ_HEIC_DECODER.convert({ blob: new Blob(['good']) })).type, 'image/jpeg');
assert.equal(terminated, 3);
console.log('✅ 업로드 큐·재시도·자동 축소·UTC 차트·오류 로그 회귀 검사 통과');

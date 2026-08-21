#!/usr/bin/env node
// 뱅기노자 — 브라우저 코드 스모크 테스트 (v00.297)
//
// 왜 필요한가:
//   2026-08-21, 글을 클릭하면 '해당 게시글을 찾을 수 없습니다' 가 뜨는 사고가 났다.
//   그날 API 는 처음부터 끝까지 정상이었다 — 글 89편이 DB 와 완전히 일치했다.
//   버그는 **브라우저 안에서만** 살았고, 그래서 API 를 아무리 두드려도 안 잡혔다.
//   "서버가 멀쩡하니 괜찮다" 가 틀렸던 것이다.
//
//   data.js 는 브라우저 전역에 기대지만, 최소한의 대역(stub)을 깔면
//   **Node 에서 통째로 실행된다**(실측: 헬퍼 41개 정상 노출).
//   그러니 화면 없이도 '데이터가 헬퍼를 통과하는 길' 은 전부 시험할 수 있다.
//
// 실행: node tools/smoke.mjs

import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ── 브라우저 대역 ────────────────────────────────────────────────────
const makeSandbox = () => {
  const store = {};
  const el = () => ({
    style: {}, dataset: {}, setAttribute() {}, getAttribute: () => null,
    appendChild() {}, removeChild() {}, remove() {},
    querySelectorAll: () => [], querySelector: () => null,
    classList: { add() {}, remove() {}, contains: () => false },
    addEventListener() {}, removeEventListener() {},
  });
  const sandbox = {
    console: { log() {}, warn() {}, error() {}, info() {} },  // 헬퍼의 진단 출력은 삼킨다
    JSON, Math, Date, Array, Object, String, Number, Boolean, RegExp, Error, Promise,
    Map, Set, WeakMap, isNaN, parseInt, parseFloat, encodeURIComponent, decodeURIComponent,
    setTimeout, clearTimeout, setInterval, clearInterval, TextEncoder, TextDecoder, crypto,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      key: (i) => Object.keys(store)[i] ?? null,
      get length() { return Object.keys(store).length; },
    },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    document: {
      createElement: el, documentElement: el(), body: el(), head: el(),
      addEventListener() {}, removeEventListener() {},
      querySelectorAll: () => [], querySelector: () => null, getElementById: () => null,
      cookie: "",
    },
    navigator: { userAgent: "node-smoke", language: "ko-KR" },
    location: { href: "https://bgnj.net/", origin: "https://bgnj.net", pathname: "/", search: "", hash: "" },
    fetch: async () => ({ ok: true, status: 200, text: async () => "{}", json: async () => ({}) }),
    CustomEvent: function (t, o) { this.type = t; this.detail = o && o.detail; },
    Event: function (t) { this.type = t; },
    DOMParser: function () { this.parseFromString = () => ({ getElementById: () => null, body: { innerHTML: "" } }); },
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    requestAnimationFrame: (f) => setTimeout(f, 0),
    dispatchEvent: () => true,
    addEventListener() {}, removeEventListener() {},
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  return sandbox;
};

const load = (sandbox, file) => {
  vm.runInContext(readFileSync(path.join(ROOT, file), "utf8"), sandbox, { filename: file });
};

// ── 테스트 뼈대 ──────────────────────────────────────────────────────
let pass = 0; const fails = [];
const check = (name, cond, detail = "") => {
  if (cond) { pass += 1; console.log(`  ✅ ${name}`); }
  else { fails.push(`${name}${detail ? ` — ${detail}` : ""}`); console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`); }
};

const run = async () => {
  const w = makeSandbox();
  load(w, "data.js");
  load(w, "components/ImageShrink.jsx");   // 순수 로직(축소 판정)만 쓰므로 JSX 없이도 로드된다

  console.log("\n── 1. 글 상세로 들어가는 길 (2026-08-21 사고 지점) ──");
  // 서버는 { post: {...} } 로 감싸서 준다. 이 껍데기를 안 벗기면
  // 목록의 그 글이 id 없는 껍데기로 교체돼 '게시글을 찾을 수 없습니다' 가 뜬다.
  w.BGNJ_API = {
    posts: {
      get: async (id) => ({ post: {
        id: Number(id), title: "서버가 준 글", body: "<p>본문</p>",
        category_id: "free", category: "자유", author: "글쓴이",
        created_at: "2026-08-21T00:00:00Z", images: [], attachments: [], tags: [],
      } }),
    },
    columns: {
      get: async (id) => ({ column: {
        id, title: "서버가 준 칼럼", body: "<p>칼럼 본문</p>",
        author_name: "뱅기노자", created_at: "2026-08-21T00:00:00Z", read_minutes: 7,
      } }),
    },
  };
  const C = w.BGNJ_COMMUNITY;
  C._serverLoaded = true;
  C._serverPosts = [{ id: 98, title: "목록의 글", body: { html: "", text: "" }, categoryId: "free" }];
  await C._hydratePostBody(98);
  const found = C.getPost(98);
  check("글을 열면 목록에서 사라지지 않는다", !!found, found ? "" : "find 실패 = 화면에 '해당 게시글을 찾을 수 없습니다'");
  check("본문이 채워진다", !!(found && found.body && found.body.html), found?.body?.html || "빈 본문");
  check("목록 길이가 유지된다", C._serverPosts.length === 1, `길이 ${C._serverPosts.length}`);

  // 서버 조회가 실패해도 캐시를 지우지 않아야 한다.
  w.BGNJ_API.posts.get = async () => { throw new Error("서버 장애"); };
  C._serverPosts = [{ id: 77, title: "지켜야 할 글", body: { html: "", text: "" }, categoryId: "free" }];
  await C._hydratePostBody(77);
  check("서버 장애 때 기존 글이 살아남는다", !!C.getPost(77));

  console.log("\n── 2. 칼럼 상세로 들어가는 길 ──");
  const COL = w.BGNJ_COLUMNS;
  COL._columns = [{ id: "col-1", title: "목록의 칼럼", body: null, readMinutes: 7 }];
  await COL._hydrateColumnBody("col-1");
  const col = (COL._columns || []).find((c) => c.id === "col-1");
  check("칼럼이 목록에서 사라지지 않는다", !!col);
  check("칼럼 본문이 채워진다", !!(col && col.body && col.body.html), col?.body?.html || "빈 본문");

  console.log("\n── 3. 도서 판매가 ──");
  const P = w.BGNJ_BOOK_PRICE;
  const wang = P({ id: "b1", title: "왕의 길", priceKR: 28000 }, "KR");
  check("10% 할인이 적용된다", wang.sale === 25200, `판매가 ${wang.sale}`);
  check("정가가 보존된다", wang.list === 28000, `정가 ${wang.list}`);
  const ebook = P({ id: "b2", title: "[전자책] 평화 서당 수인탑", priceKR: 6930 }, "KR");
  check("전자책은 할인에서 빠진다", ebook.isSale === false && ebook.sale === 6930, `판매가 ${ebook.sale}`);
  check("배송비는 책값에 포함(0원)", w.BGNJ_BOOK_SHIPPING(10000) === 0);

  console.log("\n── 4. 표기 헬퍼 (브라우저 로케일에 기대지 않는다) ──");
  check("금액 표기", /25,200/.test(w.BGNJ_FMT.won(25200)), w.BGNJ_FMT.won(25200));

  console.log("\n── 5. XSS 방어는 fail-closed 인가 ──");
  // DOMPurify 가 없으면(CDN 차단·로드 실패) 원본을 통과시키지 말고 빈 문자열을 내야 한다.
  const out = w.BGNJ_SAFE_HTML('<p>안녕</p><script>alert(1)</script>');
  check("정화기가 없으면 아무것도 내보내지 않는다", out === "" || !/script/i.test(out), JSON.stringify(out).slice(0, 60));

  console.log("\n── 6. 큰 사진 축소 판정 ──");
  const S = w.BGNJ_IMAGE_SHRINK;
  const MB = 1024 * 1024;
  const small = await S.maybeShrinkAll([{ name: "a.jpg", type: "image/jpeg", size: 0.5 * MB }], { limitBytes: 10 * MB });
  check("작은 사진은 묻지 않고 통과", small.files.length === 1 && small.cancelled.length === 0);
  w.BGNJ_TOAST = { error() {} };
  const bigGif = await S.maybeShrinkAll([{ name: "b.gif", type: "image/gif", size: 12 * MB }], { limitBytes: 10 * MB });
  check("줄일 수 없는데 한도를 넘으면 막는다", bigGif.files.length === 0 && bigGif.cancelled.length === 1);

  console.log("\n── 7. 관리자 목록 정렬·필터 ──");
  // AdminShared 는 JSX 를 쓰므로 통째로는 못 돌린다. 판정 로직만 떼어내 실제 코드로 시험한다.
  {
    // v00.298.001 — AdminShared 에서 AdminEventsPanels 로 옮겼다(window 경유 제거).
    const shared = readFileSync(path.join(ROOT, "pages/admin/AdminEventsPanels.jsx"), "utf8");
    const a = shared.indexOf("const eventTimestamp = (item) => {");
    const b = shared.indexOf("const EventListToolbar =");
    if (a < 0 || b < 0) throw new Error("정렬/필터 코드를 찾지 못했다 — 위치가 바뀌었는지 확인하라");
    const { filterSortEvents, eventTimestamp } = vm.runInNewContext(
      shared.slice(a, b) + "\n({ filterSortEvents, eventTimestamp, EVENT_SORT_DEFAULT })",
      { Date, Number, String, Array, isNaN }
    );
    const now = Date.now();
    const day = 86400000;
    const items = [
      { id: 1, title: "지난 강연",  startsAt: new Date(now - 10 * day).toISOString(), hidden: false },
      { id: 2, title: "예정 강연",  startsAt: new Date(now + 10 * day).toISOString(), hidden: false },
      { id: 3, title: "숨긴 강연",  startsAt: new Date(now + 3 * day).toISOString(),  hidden: true  },
      { id: 4, title: "일정 미정",  startsAt: "",                                      hidden: false },
    ];
    const ids = (l) => l.map((x) => x.id).join(",");
    check("예정만 고르기", ids(filterSortEvents(items, { status: "upcoming" })) === "2,3" || ids(filterSortEvents(items, { status: "upcoming", sort: "date-asc" })) === "3,2",
      ids(filterSortEvents(items, { status: "upcoming" })));
    check("지난 것만 고르기", ids(filterSortEvents(items, { status: "past" })) === "1");
    check("숨김만 고르기", ids(filterSortEvents(items, { status: "hidden" })) === "3");
    check("공개만 고르기", ids(filterSortEvents(items, { status: "open" })) === "2,1,4" || filterSortEvents(items, { status: "open" }).every((x) => !x.hidden));
    check("일정 빠른순", ids(filterSortEvents(items, { sort: "date-asc" })) === "1,3,2,4", ids(filterSortEvents(items, { sort: "date-asc" })));
    check("일정 미정은 늘 맨 뒤", filterSortEvents(items, { sort: "date-desc" }).slice(-1)[0].id === 4
      && filterSortEvents(items, { sort: "date-asc" }).slice(-1)[0].id === 4);
    check("검색이 제목을 찾는다", ids(filterSortEvents(items, { search: "숨긴" })) === "3");
    check("신청 많은순", ids(filterSortEvents(items, { sort: "regs-desc", countOf: (x) => x.id })) === "4,3,2,1");
    check("잔여 적은순", ids(filterSortEvents(items, { sort: "seats-asc", seatsOf: (x) => x.id })) === "1,2,3,4");
    check("일정 미정도 목록에서 안 사라진다", filterSortEvents(items, {}).length === 4);
    // 사용자 요청: 아무것도 안 고르면 가장 최신이 맨 위여야 한다.
    check("기본 정렬은 최신이 맨 위", filterSortEvents(items, {})[0].id === 2, `맨 위 id=${filterSortEvents(items, {})[0].id}`);
  }

  console.log(`\n${fails.length === 0 ? "✅" : "❌"} 통과 ${pass} · 실패 ${fails.length}`);
  if (fails.length) { fails.forEach((f) => console.log(`   · ${f}`)); process.exit(1); }
};

run().catch((e) => { console.error("스모크 테스트가 죽었다:", e); process.exit(1); });

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
    const b = shared.indexOf("const EventGroupHead =");   // 여기부터는 JSX 라 Node 가 못 읽는다
    if (a < 0 || b < 0) throw new Error("정렬/필터 코드를 찾지 못했다 — 위치가 바뀌었는지 확인하라");
    const { filterSortEvents, eventTimestamp, groupEventsByPeriod } = vm.runInNewContext(
      shared.slice(a, b) + "\n({ filterSortEvents, eventTimestamp, EVENT_SORT_DEFAULT, groupEventsByPeriod })",
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

    // v00.301 — 진행 중 / 마감 섹션 분리
    const groups = groupEventsByPeriod(items, {});
    const byKey = Object.fromEntries(groups.map((g) => [g.key, g.items.map((x) => x.id)]));
    check("진행 중 섹션", JSON.stringify(byKey.upcoming) === JSON.stringify([2, 3]), JSON.stringify(byKey.upcoming));
    check("마감 섹션", JSON.stringify(byKey.past) === JSON.stringify([1]), JSON.stringify(byKey.past));
    check("일정 미정도 따로 남는다", JSON.stringify(byKey.undated) === JSON.stringify([4]), JSON.stringify(byKey.undated));
    check("어느 항목도 사라지지 않는다",
      groups.reduce((n, g) => n + g.items.length, 0) === items.length,
      `묶음 합계 ${groups.reduce((n, g) => n + g.items.length, 0)} / 원본 ${items.length}`);
    check("빈 섹션은 나오지 않는다", groupEventsByPeriod([items[0]], {}).length === 1);
    // 필터·섹션 기준이 어긋나면 '예정' 으로 걸렀을 때와 '진행 중' 섹션 내용이 달라진다.
    check("필터와 섹션의 기준이 같다",
      JSON.stringify(filterSortEvents(items, { status: 'upcoming' }).map((x) => x.id)) === JSON.stringify(byKey.upcoming));
  }

  console.log("\n── 8. 참가 신청 상태 (신청 → 입금 완료 → 참가 확정) ──");
  {
    const panels = readFileSync(path.join(ROOT, "pages/admin/AdminEventsPanels.jsx"), "utf8");
    const a = panels.indexOf("const STATUS_LABEL = {");
    const b = panels.indexOf("const StatusChip =");
    if (a < 0 || b < 0) throw new Error("상태 라벨을 찾지 못했다 — 위치가 바뀌었는지 확인하라");
    const { STATUS_LABEL, STATUS_COLOR } = vm.runInNewContext(
      panels.slice(a, b) + "\n({ STATUS_LABEL, STATUS_COLOR })", {}
    );
    check("신청 단계", STATUS_LABEL.pending_payment === "신청");
    check("입금 완료 단계", STATUS_LABEL.paid === "입금 완료");
    check("참가 확정 단계", STATUS_LABEL.confirmed === "참가 확정");
    check("모든 상태에 이름이 있다",
      ["pending_payment", "paid", "confirmed", "waitlist", "refund_requested", "cancelled"]
        .every((k) => STATUS_LABEL[k] && STATUS_COLOR[k]));
    // 정원은 '자리를 차지한 사람' 을 세야 한다. 입금 완료가 빠지면 초과 접수된다.
    const worker = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");
    check("정원 계산에 입금 완료가 포함된다",
      worker.includes("status IN ('pending_payment','paid','confirmed')"),
      "빠지면 입금한 사람이 자리를 안 차지한 것으로 세어 초과 접수된다");
  }

  console.log("\n── 8.5 회원 등급 기본값 ──");
  {
    // 이 배열은 서버(D1.grades_kv)가 비어 있을 때만 쓰이는 폴백이다.
    // 실제로 서버와 어긋나 있어서 첫 진입자에게 옛 이름이 보일 수 있었다(v00.302 에서 맞춤).
    const grades = w.BGNJ_STORES?.grades || [];
    check("등급이 6단계다", grades.length === 6, `${grades.length}개`);
    check("레벨이 오름차순이다", grades.every((g, i) => i === 0 || g.level > grades[i - 1].level));
    check("모든 등급에 이름과 설명이 있다",
      grades.every((g) => String(g.label || '').trim() && String(g.desc || '').trim()));
    check("사관 체계 이름이다",
      ['길손', '동행', '사초지기', '기사관', '편수관'].every((n) => grades.some((g) => g.label === n)),
      grades.map((g) => g.label).join(' · '));
  }

  console.log("\n── 8.6 말머리 정의 (문자열 옛 형태 ↔ { name, tags } 새 형태) ──");
  {
    // v00.305 — 말머리에 태그를 달면서 prefixes 원소가 문자열에서 객체로 바뀌었다.
    //   서버(prefixes_json)에는 두 형태가 섞여 남는다. 읽는 쪽이 하나라도 이 정규화를
    //   건너뛰면 이름 자리에 객체가 들어가 화면에 [object Object] 가 뜬다.
    const defs = w.BGNJ_PREFIX_DEFS;
    check("옛 문자열 형태를 이름으로 읽는다",
      defs({ prefixes: ['걸어서 독립운동 속으로'] })[0]?.name === '걸어서 독립운동 속으로');
    check("옛 형태는 태그가 빈 배열이다",
      Array.isArray(defs({ prefixes: ['가'] })[0]?.tags) && defs({ prefixes: ['가'] })[0].tags.length === 0);
    check("새 객체 형태를 읽는다",
      defs({ prefixes: [{ name: '가', tags: ['나', '다'] }] })[0]?.tags.join() === '나,다');
    check("두 형태가 섞여 있어도 둘 다 읽는다",
      defs({ prefixes: ['가', { name: '나', tags: ['t'] }] }).map((d) => d.name).join() === '가,나');
    check("빈 이름·이름 없는 객체·null 은 버린다",
      defs({ prefixes: ['', '   ', null, 42, { tags: ['t'] }, { name: '살아남음' }] })
        .map((d) => d.name).join() === '살아남음');
    check("prefixes 가 없거나 배열이 아니면 빈 배열",
      defs({}).length === 0 && defs({ prefixes: 'x' }).length === 0 && defs(null).length === 0);
    check("이름으로 태그를 찾는다",
      w.BGNJ_PREFIX_TAGS({ prefixes: [{ name: '가', tags: ['t1'] }] }, '가').join() === 't1');
    check("없는 이름이면 빈 배열", w.BGNJ_PREFIX_TAGS({ prefixes: ['가'] }, '없다').length === 0);

    // v00.305.001 — 쳐서 찾기. 억지 매칭은 엉뚱한 말머리를 조용히 붙이므로 없느니만 못하다.
    const D = [{ name: '걸어서 독립운동 속으로', tags: [] }, { name: '한켠 포럼', tags: [] }];
    const m = (q) => w.BGNJ_PREFIX_MATCH(D, q)?.name || null;
    check("정확히 치면 그것", m('걸어서 독립운동 속으로') === '걸어서 독립운동 속으로');
    check("앞부분만 쳐도 찾는다", m('걸어서') === '걸어서 독립운동 속으로');
    check("공백을 빼고 쳐도 찾는다", m('걸어서독립') === '걸어서 독립운동 속으로');
    check("가운데 토막만 쳐도 찾는다", m('독립운동') === '걸어서 독립운동 속으로');
    check("여럿 중 맞는 쪽을 고른다", m('한켠') === '한켠 포럼', m('한켠'));
    check("가운데 한 글자만 겹치는 건 매칭하지 않는다", m('서') === null, m('서'));
    check("앞글자 한 글자는 찾아 준다", m('걸') === '걸어서 독립운동 속으로', m('걸'));
    check("전혀 다르면 null", m('책 주문') === null, m('책 주문'));
    check("빈 입력은 null", m('') === null && m('   ') === null);
    check("말머리가 없으면 null", w.BGNJ_PREFIX_MATCH([], '걸어서') === null);

    // 수정 횟수는 '내용이 정말 달라졌을 때' 만 세야 한다 — 관리자 일괄 작업은 세지 않는다.
    const worker = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");
    check("수정 횟수는 제목·본문이 바뀔 때만 오른다",
      worker.includes("const contentChanged =") && worker.includes('if (contentChanged) fields.push("edit_count'),
      "빠지면 말머리·태그 일괄 적용까지 '수정' 으로 세어 횟수가 부풀려진다");
    // v00.306.002 — 별칭(p.) 이 붙어도 통과하도록 뜻으로 판정한다. 글자 모양으로 보면
    //   SELECT 를 손볼 때마다 멀쩡한 코드가 오탐으로 걸린다.
    check("목록 응답이 수정 시각·횟수를 싣는다",
      /FROM posts p? ?WHERE/.test(worker) &&
      /(^|[\s,(])(p\.)?updated_at/m.test(worker) && /(^|[\s,(])(p\.)?edit_count/m.test(worker),
      "빠지면 관리자 목록에 늘 '수정 없음' 으로 보인다");
  }

  console.log("\n── 8.7 게시판 이름 · 태그 제안 (v00.306) ──");
  {
    // 2026-08-24 사고 — 관리자에서 게시판을 옮겼는데 '이동이 안 된다' 는 보고가 왔다.
    //   실제로는 옮겨져 있었다(category_id = walk-independence). 화면이 그린 것은
    //   글 행에 **박제된 옛 이름**(category = '자유') 이었다. 파생값을 믿은 대가다.
    const label = w.BGNJ_BOARD_LABEL;
    const catsBackup = w.BGNJ_STORES.categories;
    w.BGNJ_STORES.categories = [
      { id: 'free', label: '자유' },
      { id: 'walk-independence', label: '신지식 청년사관' },
    ];
    check("게시판 id 로 현재 이름을 찾는다",
      label({ categoryId: 'walk-independence', category: '자유' }) === '신지식 청년사관',
      "박제된 옛 이름을 그리면 이동이 안 된 것처럼 보인다");
    check("id 로 못 찾으면 저장된 이름으로 떨어진다",
      label({ categoryId: 'gone', category: '없어진 게시판' }) === '없어진 게시판');
    check("id 가 없어도 저장된 이름을 쓴다", label({ category: '자유' }) === '자유');
    check("둘 다 없으면 빈 문자열", label({}) === '' && label(null) === '');
    check("id 문자열만 넘겨도 된다", label('free') === '자유');

    // 태그 제안 — 같은 뜻의 태그가 표기만 달리 갈리는 걸 막으려고 만들었다.
    const postsBackup = w.BGNJ_COMMUNITY._serverPosts;
    const loadedBackup = w.BGNJ_COMMUNITY._serverLoaded;
    w.BGNJ_COMMUNITY._serverPosts = [
      { id: 1, categoryId: 'free', tags: ['독립운동', '뱅기노자'] },
      { id: 2, categoryId: 'free', tags: ['독립운동', '역사문화탐방'] },
      { id: 3, categoryId: 'free', tags: ['독립운동'] },
    ];
    w.BGNJ_COMMUNITY._serverLoaded = true;
    const names = (q, o) => w.BGNJ_TAG_SUGGEST(q, o).map((t) => t.name);
    check("빈 쿼리는 많이 쓰인 순서",
      names('')[0] === '독립운동', names('').join(' · '));
    check("쓰인 횟수를 함께 준다",
      w.BGNJ_TAG_SUGGEST('독립운동')[0]?.uses === 3);
    check("앞글자로 찾는다", names('독립').includes('독립운동'));
    check("공백을 빼고 쳐도 찾는다", names('역사문화').includes('역사문화탐방'));
    check("이미 고른 태그는 후보에서 뺀다",
      !names('', { exclude: ['독립운동'] }).includes('독립운동'));
    check("전혀 다르면 빈 목록", names('책 주문').length === 0, names('책 주문').join());
    check("limit 을 지킨다", names('', { limit: 2 }).length === 2);
    check("말머리 자동 태그도 후보에 든다", (() => {
      w.BGNJ_STORES.categories = [{ id: 'free', label: '자유',
        prefixes: [{ name: '걸어서 독립운동 속으로', tags: ['한국근현대사여행'] }] }];
      return names('한국').includes('한국근현대사여행');
    })());
    w.BGNJ_COMMUNITY._serverPosts = postsBackup;
    w.BGNJ_COMMUNITY._serverLoaded = loadedBackup;
    w.BGNJ_STORES.categories = catsBackup;

    // 워커 — 이동시켰으면 이름도 같이 옮겨야 한다. 화면만 고치면 CSV·정적 페이지가 또 속는다.
    const worker2 = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");
    check("게시판 이동 시 category 이름도 함께 갱신한다",
      worker2.includes('SELECT label FROM categories_kv WHERE id = ?') &&
      worker2.includes('fields.push("category = ?")'),
      "빠지면 DB 에 옛 게시판 이름이 남아 id 를 모르는 소비자가 속는다");

    // 일괄 작업은 결과를 세야 한다 — forEach fire-and-forget 은 실패를 조용히 삼킨다.
    const adminPanels = readFileSync(path.join(ROOT, "pages/admin/AdminRouterPanels.jsx"), "utf8");
    check("일괄 작업이 bulkUpdatePosts 를 쓴다",
      adminPanels.includes('BGNJ_COMMUNITY.bulkUpdatePosts'),
      "forEach 로 한꺼번에 쏘면 늦은 응답이 이른 갱신을 덮고 실패가 조용히 사라진다");
    check("일괄 작업 결과가 사용자에게 보인다",
      /r\.failed/.test(adminPanels) && /r\.changed/.test(adminPanels));
  }

  console.log("\n── 9. 관리자 주소 복원 (#admin=탭|상세id|하위탭) ──");
  {
    const panels = readFileSync(path.join(ROOT, "pages/admin/AdminEventsPanels.jsx"), "utf8");
    const a = panels.indexOf("const readAdminHashDetail = () => {");
    const b = panels.indexOf("// v00.299.002 — 정보 탭 맨 위에");
    if (a < 0 || b < 0) throw new Error("관리자 주소 헬퍼를 찾지 못했다");
    let hash = "";
    const ctx = {
      console: { warn() {} },
      window: {
        get location() { return { hash }; },
        history: { replaceState: (_a, _b, next) => { hash = next; } },
      },
      decodeURIComponent, encodeURIComponent,
    };
    const { readAdminHashDetail, writeAdminHashDetail } = vm.runInNewContext(
      panels.slice(a, b) + "\n({ readAdminHashDetail, writeAdminHashDetail })", ctx
    );
    hash = "#admin=%EA%B0%95%EC%97%B0";                        // '강연' 탭만
    check("탭만 있을 때 상세는 비어 있다", readAdminHashDetail().id === "" && readAdminHashDetail().sub === "");
    hash = "#admin=%EA%B0%95%EC%97%B0|lec-123|roster";
    check("상세 id 를 읽는다", readAdminHashDetail().id === "lec-123", readAdminHashDetail().id);
    check("하위 탭을 읽는다", readAdminHashDetail().sub === "roster", readAdminHashDetail().sub);
    writeAdminHashDetail("tour-9", "info");
    check("주소에 상세를 쓴다", hash === "#admin=%EA%B0%95%EC%97%B0|tour-9|info", hash);
    check("탭 부분은 건드리지 않는다", hash.startsWith("#admin=%EA%B0%95%EC%97%B0|"));
    writeAdminHashDetail("", "");
    check("목록으로 나오면 상세가 지워진다", hash === "#admin=%EA%B0%95%EC%97%B0", hash);
  }

  console.log("\n── 10. 댓글 — 글·칼럼 한 창구 (2026-08-25 민원 2건) ──");
  {
    const CM = w.BGNJ_COMMENTS;
    let rows = [];          // 서버 흉내 (content_comments)
    let nextId = 1;
    let sent = null;
    const toasts = [];
    w.BGNJ_TOAST = { error: (m) => toasts.push(String(m)), success() {}, info() {} };
    w.BGNJ_API = {
      comments: {
        list: async (type, id) => ({ comments: rows.filter((r) => r.target_type === type && r.target_id === String(id)) }),
        create: async (type, id, payload) => {
          sent = { type, id, ...payload };
          const text = String(payload.body || "").trim();
          if (!text) throw new Error("내용을 입력해 주세요.");   // 워커와 같은 판정
          const row = {
            id: nextId++, target_type: type, target_id: String(id),
            parent_id: payload.parentId || null, body: text,
            author_id: "u-1", author: "글쓴이", created_at: "2026-08-25T01:02:03Z",
          };
          rows.push(row);
          return { id: row.id };
        },
        remove: async (commentId) => {
          rows = rows.filter((r) => String(r.id) !== String(commentId) && String(r.parent_id ?? '') !== String(commentId));
          return { ok: true };
        },
      },
    };
    const settle = async () => { for (let i = 0; i < 4; i++) await new Promise((r) => setTimeout(r, 0)); };

    // 화면이 실제로 넘기는 모양 그대로 (text · date). body 로 읽으면 빈 본문이 나간다.
    for (const [type, id, label] of [['post', 500, '게시글'], ['column', 'col-9', '칼럼']]) {
      CM._cache = {};
      toasts.length = 0;
      CM.add(type, id, { author: "글쓴이", authorId: "u-1", date: "2026.08.25 10:02", text: `${label} 댓글입니다` });
      await settle();
      check(`${label} — 본문이 서버로 전달된다`, !!sent && String(sent.body || "").trim() === `${label} 댓글입니다`,
        sent ? `보낸 body=${JSON.stringify(sent.body)}` : "create 가 호출조차 안 됐다");
      check(`${label} — 서버에 남는다`, rows.some((r) => r.target_type === type && r.target_id === String(id)));

      // 새로고침 = 캐시를 버리고 서버에서 다시 읽는 상황
      CM._cache = {};
      const list = await CM.refresh(type, id);
      check(`${label} — 새로고침 뒤에도 남는다`, list.length === 1, `${list.length}개`);
      check(`${label} — 화면 필드(text·date)로 온다`, !!(list[0]?.text && list[0]?.date),
        JSON.stringify(list[0] || {}).slice(0, 120));

      // 답글
      CM.add(type, id, { author: "다른 사람", authorId: "u-2", text: "답글입니다", parentId: list[0].id });
      await settle();
      const withReply = CM.list(type, id);
      check(`${label} — 답글이 부모에 매달린다`,
        withReply.length === 2 && String(withReply[1].parentId) === String(list[0].id),
        JSON.stringify(withReply.map((c) => [c.id, c.parentId])));

      // 삭제 — 답글도 함께
      CM.remove(type, id, list[0].id);
      await settle();
      check(`${label} — 지우면 답글까지 사라진다`, CM.list(type, id).length === 0, `${CM.list(type, id).length}개 남음`);
      check(`${label} — 서버에서도 사라진다`, !rows.some((r) => r.target_type === type && r.target_id === String(id)));
    }

    // 대상이 섞이지 않는다 — 글 500 의 댓글이 칼럼에 보이면 안 된다.
    CM._cache = {}; rows = []; nextId = 1;
    CM.add('post', 500, { author: "가", authorId: "u-1", text: "글 쪽" });
    CM.add('column', 'col-9', { author: "나", authorId: "u-2", text: "칼럼 쪽" });
    await settle();
    check("글과 칼럼의 댓글이 섞이지 않는다",
      CM.list('post', 500).length === 1 && CM.list('column', 'col-9').length === 1 &&
      CM.list('post', 500)[0].text === "글 쪽",
      `글 ${CM.list('post', 500).length} · 칼럼 ${CM.list('column', 'col-9').length}`);

    // 저장이 실패하면 화면에만 남아 '있는 척' 하면 안 된다.
    CM._cache = {}; rows = []; toasts.length = 0;
    w.BGNJ_API.comments.create = async () => { throw new Error("서버 장애"); };
    CM.add('post', 500, { author: "글쓴이", authorId: "u-1", text: "실패할 댓글" });
    await settle();
    check("저장 실패를 사용자에게 알린다", toasts.length > 0, "조용히 삼키면 사용자는 저장된 줄 안다");
    check("실패한 댓글은 화면에 남지 않는다", CM.list('post', 500).length === 0, `${CM.list('post', 500).length}개 남음`);

    // 빈 본문은 보내기 전에 막는다 (워커까지 가서 400 을 받을 이유가 없다)
    sent = null;
    CM.add('post', 500, { author: "글쓴이", authorId: "u-1", text: "   " });
    await settle();
    check("빈 댓글은 서버로 가지 않는다", sent === null);

    // 워커 — 대상 중립 창구인가
    const wk = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");
    check("워커가 target_type · target_id 로 저장한다",
      /INSERT INTO content_comments \(target_type, target_id/.test(wk));
    check("옛 주소(/posts/:id/comments)를 껍데기로 남겨 뒀다",
      wk.includes("/comments$/") && wk.includes("handleCommentsList(req, env, 'post'"),
      "배포 직후 옛 JS 를 쥔 브라우저가 댓글을 못 쓰게 된다");
    check("글을 지우면 그 댓글도 지운다", /deleteCommentsFor\(env, 'post'/.test(wk),
      "FK CASCADE 가 사라졌다 — 명시적으로 안 지우면 주인 없는 댓글이 쌓인다");
    check("칼럼을 지우면 그 댓글도 지운다", /deleteCommentsFor\(env, 'column'/.test(wk));
    check("답글의 부모가 같은 대상인지 확인한다",
      /FROM content_comments WHERE id = \? AND target_type = \? AND target_id = \?/.test(wk),
      "남의 글 댓글에 매달리면 어디에도 안 보인다");
    check("칼럼 목록도 댓글 수를 싣는다", /AS comment_count/.test(wk));

    // 클라이언트가 옛 주소를 쓰지 않는다 — 두 길을 다 쓰면 어느 쪽이 진짜인지 알 수 없다.
    const apiSrc = readFileSync(path.join(ROOT, "api.js"), "utf8");
    check("클라이언트는 새 창구만 쓴다",
      !/posts\/\$\{postId\}\/comments/.test(apiSrc) && /comments\?targetType=/.test(apiSrc));
  }

  console.log("\n── 11. 못 불러온 것 ≠ 없는 것 (2026-08-25 '게시글을 찾을 수 없습니다' 민원) ──");
  {
    const C3 = w.BGNJ_COMMUNITY;
    const events = [];
    w.dispatchEvent = (e) => { events.push(e.type); return true; };

    // 아직 안 불러온 상태 — 목록은 비어 있지만 그건 '글이 없다' 는 뜻이 아니다.
    C3._serverLoaded = false;
    C3._serverPosts = [];
    C3._lastError = null;
    check("안 불러온 상태를 화면이 구분할 수 있다", C3._serverLoaded === false,
      "_serverLoaded 가 없으면 화면은 '없는 글' 이라고 단정한다");

    // 서버가 이상한 모양을 돌려줘도 '조용한 로딩 중' 으로 남으면 안 된다.
    w.BGNJ_API = { posts: { list: async () => ({ posts: { nope: true } }) } };
    await C3.refreshPosts();
    check("비-배열 응답도 실패로 알린다", !!C3._lastError, `_lastError=${JSON.stringify(C3._lastError)}`);
    check("비-배열 응답에 오류 이벤트가 나간다", events.includes('bgnj-posts-refresh-error'), events.join(','));
    check("비-배열 응답이 캐시를 지우지 않는다", Array.isArray(C3._serverPosts) && C3._serverPosts.length === 0);

    // 진짜 실패
    events.length = 0;
    w.BGNJ_API = { posts: { list: async () => { throw new Error("서버 장애"); } } };
    await C3.refreshPosts();
    check("조회 실패가 _lastError 에 남는다", /서버 장애/.test(String(C3._lastError)), String(C3._lastError));
    check("조회 실패는 여전히 안 불러온 상태다", C3._serverLoaded === false);

    // 성공하면 두 값이 함께 돌아온다
    events.length = 0;
    w.BGNJ_API = { posts: { list: async () => ({ posts: [{ id: 7, title: "돌아온 글", category_id: "free" }] }) } };
    await C3.refreshPosts();
    check("성공하면 불러온 상태가 된다", C3._serverLoaded === true);
    check("성공하면 오류가 지워진다", C3._lastError === null, String(C3._lastError));
    check("성공하면 갱신 이벤트가 나간다", events.includes('bgnj-posts-refresh'), events.join(','));

    // 칼럼도 같은 장치를 갖는다
    const COL2 = w.BGNJ_COLUMNS;
    events.length = 0;
    COL2._loaded = false; COL2._lastError = null; COL2._columns = [];
    w.BGNJ_API = { columns: { list: async () => { throw new Error("칼럼 서버 장애"); } } };
    await COL2.refresh();
    check("칼럼도 실패를 남긴다", /칼럼 서버 장애/.test(String(COL2._lastError)), String(COL2._lastError));
    check("칼럼 실패는 안 불러온 상태다", COL2._loaded === false);
    check("칼럼 오류 이벤트가 나간다", events.includes('bgnj-columns-refresh-error'), events.join(','));
    w.BGNJ_API = { columns: { list: async () => ({ columns: [{ id: "col-9", title: "칼럼" }] }) } };
    await COL2.refresh();
    check("칼럼도 성공하면 불러온 상태가 된다", COL2._loaded === true && COL2._lastError === null);

    // 화면이 실제로 그 값을 보고 갈라지는가 — JSX 는 Node 가 못 읽으므로 원문으로 확인한다.
    const cp = readFileSync(path.join(ROOT, "pages/CommunityPage.jsx"), "utf8");
    const colp = readFileSync(path.join(ROOT, "pages/ColumnPage.jsx"), "utf8");
    // 순서로 판정한다 — '없는 글' 문구보다 '못 불러옴' 검사가 반드시 앞에 있어야 한다.
    const orderOk = (src, guard, deadEnd) => {
      const g = src.lastIndexOf(guard, src.indexOf(deadEnd));
      const d = src.indexOf(deadEnd);
      return g > 0 && d > 0 && g < d;
    };
    check("글 상세가 '못 불러옴' 을 먼저 본다",
      orderOk(cp, "_serverLoaded", ">해당 게시글을 찾을 수 없습니다.</p>"),
      "이 순서가 뒤집히면 다시 '없는 글' 이라고 말한다");
    check("칼럼 상세가 '못 불러옴' 을 먼저 본다",
      orderOk(colp, "_loaded", ">해당 칼럼을 찾을 수 없습니다.</p>"));
    check("다시 시도할 길이 있다", /다시 시도/.test(cp) && /ContentLoadNotice/.test(cp) && /ContentLoadNotice/.test(colp));

    // 댓글 삭제는 확인을 거친다 (alert·confirm 금지 — BGNJ_CONFIRM)
    check("게시글 댓글 삭제가 확인 모달을 띄운다",
      /deleteComment = async[\s\S]{0,600}BGNJ_CONFIRM/.test(cp), "손이 미끄러지면 되돌릴 수 없다");
    check("칼럼 댓글 삭제가 확인 모달을 띄운다",
      /removeComment = async[\s\S]{0,600}BGNJ_CONFIRM/.test(colp));

    // 목록에 댓글 수 — 서버가 세어서 보낸 값을 그대로 쓴다.
    check("목록이 댓글 수를 보여준다", /p\.replies/.test(cp), "목록에서 몇 개 달렸는지 알 길이 없었다");
    const worker3 = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");
    // v00.306.004 — 대상 중립 테이블로 옮겼다. 세는 자리가 목록·상세 **둘 다** 있어야 한다.
    const countSql = /SELECT COUNT\(\*\) FROM content_comments c\s+WHERE c\.target_type = 'post' AND c\.target_id = CAST\(p\.id AS TEXT\)\) AS replies/g;
    check("목록·상세 replies 를 그 자리에서 센다",
      (worker3.match(countSql) || []).length === 2,
      `세는 자리 ${(worker3.match(countSql) || []).length}곳 — 한쪽만 있으면 목록과 상세가 다른 숫자를 말한다`);
    check("틀린 카운터를 더 이상 쌓지 않는다",
      !/UPDATE posts SET replies = replies \+ 1/.test(worker3));

    // 표기는 이모지가 아니라 선·글자로 — 이모지는 기기가 제 색으로 칠해 버린다.
    check("댓글 수는 제목 뒤 (n) 으로 적는다", /\(\{p\.replies\}\)/.test(cp),
      "말풍선 이모지는 기기마다 색·모양이 달라 화면의 결과 따로 논다");
    check("목록·상세에 이모지 표기가 남아 있지 않다",
      !/[\u{1F300}-\u{1FAFF}]/u.test(cp.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n')),
      "잉크와 선으로만 이루어진 화면에서 이모지만 혼자 색을 갖는다");
    check("사진·첨부는 선 아이콘으로 그린다",
      /PhotoMark/.test(cp) && /ClipMark/.test(cp) && /currentColor/.test(cp),
      "currentColor 라야 다크 모드에서도 글자색을 따라간다");

    // 목록에서 태그는 빼기로 했다 (제목이 두 줄로 밀렸다)
    check("목록 제목 줄에 태그를 붙이지 않는다",
      !/row-title-inline[^\n]*#\$\{t\}/.test(cp), "말머리로 걸러 온 목록은 같은 태그가 반복돼 제목을 가린다");
  }

  console.log("\n── 12. 새 버전이 나오면 옛 화면을 끊는가 (2026-08-25 '과거 버전이 보인다') ──");
  {
    const html = readFileSync(path.join(ROOT, "index.html"), "utf8");
    const boot = readFileSync(path.join(ROOT, "boot.jsx"), "utf8");

    // GitHub Pages 는 index.html 에도 max-age=600 을 준다(헤더를 못 바꾼다).
    // 번들 안의 검사는 React 가 다 뜬 뒤라 늦다 — 번들보다 먼저 도는 검사가 있어야 한다.
    const appTag = html.indexOf('src="/dist/app.js');
    const checkPos = html.indexOf("'/version.json?_='");
    check("번들보다 먼저 도는 버전 검사가 있다", appTag > 0 && checkPos > appTag,
      "React 가 다 뜬 뒤에 검사하면 사용자는 옛 화면을 이미 본 뒤다");
    check("app.js 는 defer 라 검사가 먼저 돈다", /<script defer src="\/dist\/app\.js/.test(html));

    // ★ 사이트를 통째로 못 쓰게 만드는 단 하나의 위험: 무한 새로고침.
    check("기록을 못 남기면 새로고침하지 않는다",
      /if \(!write\(\{ v: v, n: n \+ 1 \}\)\) return;/.test(html),
      "시크릿 모드처럼 저장소가 막히면 멈출 방법이 없어진다 — 사이트가 통째로 죽는다");
    check("같은 버전으로 도는 횟수에 상한이 있다",
      /var MAX = \d+;/.test(html) && /if \(n >= MAX\) return;/.test(html));
    check("서버가 더 옛 버전이면 건드리지 않는다",
      /if \(rank\(v\) <= rank\(cur\)\) return;/.test(html),
      "되돌린 배포(롤백) 때 헛되이 새로고침한다");
    check("boot.jsx 도 기록 못 남기면 새로고침하지 않는다",
      /if \(recorded\) \{ _purgeAndReload\(\); return; \}/.test(boot));

    // 주소에 ?_v= 를 붙이는 방식은 **원래 주소의 옛 캐시를 그대로 남긴다** — 다음 방문에 또 옛 화면.
    check("주소를 더럽히지 않는다 (?_v= 폐기)",
      !/_v['"]?\s*,/.test(boot) && !/searchParams\.set\('_v'/.test(boot),
      "?_v= 로 이동하면 원래 주소의 캐시는 안 바뀌어 다음 방문에 또 옛 화면이 나온다");
    check("이 주소의 캐시 항목 자체를 덮어쓴다",
      /cache: 'reload'/.test(html) && /cache: 'reload'/.test(boot));
    check("Cache API 와 서비스워커도 비운다",
      /caches\.delete/.test(html) && /unregister/.test(html)
      && /caches\.delete/.test(boot) && /unregister/.test(boot));
    check("두 곳이 같은 길을 쓴다 (_purgeAndReload)",
      (boot.match(/_purgeAndReload\(\)/g) || []).length >= 2,
      "자동 새로고침과 배너가 다르게 동작하면 무슨 일이 났는지 진단할 수 없다");

    // 정적 페이지 193개는 index.html 을 베껴 만든다 — 검사도 같이 실려야 한다.
    try {
      const stat = readFileSync(path.join(ROOT, "community/140/index.html"), "utf8");
      check("정적 페이지에도 검사가 실린다", stat.includes("'/version.json?_='"),
        "검색으로 들어온 사람은 정적 페이지를 먼저 본다");
      const hash = (html.match(/'sha256-[^']+'/g) || []).length;
      const statHash = (stat.match(/'sha256-[^']+'/g) || []).length;
      check("정적 페이지의 CSP 해시 개수가 같다", hash === statHash && hash > 0,
        `index ${hash}개 · 정적 ${statHash}개 — 다르면 스크립트가 통째로 차단된다`);
    } catch (_e) {
      check("정적 페이지 확인", false, "community/140/index.html 을 못 읽었다 — seo-build 를 돌렸는가");
    }
  }

  console.log(`\n${fails.length === 0 ? "✅" : "❌"} 통과 ${pass} · 실패 ${fails.length}`);
  if (fails.length) { fails.forEach((f) => console.log(`   · ${f}`)); process.exit(1); }
};

run().catch((e) => { console.error("스모크 테스트가 죽었다:", e); process.exit(1); });

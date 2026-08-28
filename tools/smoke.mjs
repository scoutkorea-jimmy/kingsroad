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

import { readFileSync, readdirSync } from "node:fs";
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

  console.log("\n── 13. 관리자 화면은 검색되지 않는가 ──");
  {
    const bootSrc = readFileSync(path.join(ROOT, "boot.jsx"), "utf8");
    const robots = readFileSync(path.join(ROOT, "robots.txt"), "utf8");
    const nf = readFileSync(path.join(ROOT, "404.html"), "utf8");

    check("개인 화면에 noindex 를 붙인다",
      /content', 'noindex, nofollow, noarchive, nosnippet'/.test(bootSrc),
      "robots.txt 는 '부탁' 일 뿐 크롤러가 지킬 의무가 없다");
    check("관리자만이 아니라 개인 영역 전부를 막는다",
      /PRIVATE_ROUTES = new Set\(\['admin', 'login', 'signup', 'mypage', 'checkout'\]\)/.test(bootSrc),
      "관리자 하나만 막으면 나머지로 같은 사고가 난다");
    check("공개 화면으로 돌아오면 걷어낸다", /tag\.remove\(\)/.test(bootSrc),
      "안 걷어내면 관리자에 들렀던 세션의 공개 글이 전부 색인에서 빠진다");
    check("SPA 폴백 우회로(?p=)도 막는다", /Disallow: \/\*\?p=\/admin/.test(robots),
      "/admin 은 404 라 404.html 이 `/?p=/admin` 으로 돌린다 — 그 주소는 경로가 `/` 라 안 걸린다");
    check("개인 영역 다섯 곳 모두 ?p= 로도 막힌다",
      ['admin','login','signup','mypage','checkout'].every((r) => robots.includes(`Disallow: /*?p=/${r}`)));
    check("404.html 자체가 noindex", /name="robots" content="noindex/.test(nf),
      "GitHub Pages 가 /admin 요청에 이 파일을 준다");
    // robots.txt 는 이름을 적은 그룹에 * 규칙이 상속되지 않는다 — 그룹마다 다시 적어야 한다.
    const groups = (robots.match(/^User-agent:/gm) || []).length;
    const blocked = (robots.match(/^Disallow: \/admin$/gm) || []).length;
    check("모든 크롤러 그룹에 금지가 적혀 있다", groups === blocked && groups > 1,
      `그룹 ${groups}개 · 금지 ${blocked}개 — robots.txt 는 가장 잘 맞는 그룹 하나만 적용된다`);
  }

  console.log("\n── 14. 조용히 실패하지 않는가 (운영 오류 로그 검토) ──");
  {
    const d = readFileSync(path.join(ROOT, "data.js"), "utf8");
    const cp = readFileSync(path.join(ROOT, "pages/CommunityPage.jsx"), "utf8");
    const bootSrc = readFileSync(path.join(ROOT, "boot.jsx"), "utf8");
    const wk = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");

    check("글 수정 실패를 삼키지 않는다",
      /updatePostRemote\(postId, patch\)\.catch\(\(e\) =>/.test(d) && /수정 저장 실패/.test(d),
      "화면은 고쳐진 것처럼 보이고 새로고침하면 원래대로 — 오늘 아침 댓글 사고와 같은 모양");
    check("글 삭제 실패를 삼키지 않는다",
      /deletePostRemote\(postId\)\.catch\(\(e\) =>/.test(d) && /삭제 실패/.test(d));
    check("삭제 실패 시 글을 되돌려 놓는다", /this\._serverPosts = \[serverPost, \.\.\.this\._serverPosts\]/.test(d),
      "지운 척한 글이 화면에서만 사라지면 사용자는 지운 줄 안다");
    check("수정 저장 실패 시 창을 닫지 않는다", /창을 닫지 않았습니다/.test(cp),
      "닫으면 쓴 글을 잃는다");

    // 운영 오류 로그 실측 — 2026-08-25 11:01 `/admin` render/TypeError
    check("관리자 번들 로드 전에 버전을 확인한다", /관리자 번들 로드 중단/.test(bootSrc),
      "?v= 는 캐시 키일 뿐 서버는 늘 최신 파일을 준다 — 두 번들이 어긋날 수 있다");
    check("이름표 하나로 화면이 죽지 않는다",
      !/window\.BGNJ_BOARD_LABEL\(/.test(readFileSync(path.join(ROOT, "pages/admin/AdminRouterPanels.jsx"), "utf8")),
      "BGNJ_BOARD_LABEL is not a function 으로 관리자 화면이 통째로 죽었다");

    // 예상 못 한 오류가 DB 내부를 노출하면 안 된다
    check("서버 오류가 내부 구조를 노출하지 않는다",
      /const known = err instanceof HttpError;/.test(wk) && /서버에서 오류가 발생했습니다/.test(wk),
      "D1 메시지가 그대로 나가면 테이블·컬럼 이름이 바깥으로 샌다");
    check("예상 못 한 오류는 로그로 남긴다", /\[bgnj:500\]/.test(wk));

    // 오류는 '다음에 할 행동' 까지 말해야 한다 (rules/40-security.md §6)
    check("세션이 끊긴 업로드에 올바른 행동을 안내한다",
      /다시 로그인한 뒤 올려 주세요/.test(cp),
      "'잠시 후 다시 시도' 는 아무리 기다려도 안 되는 안내였다");
    check("올릴 수 없는 형식에 해결 방법을 준다", /높은 호환성/.test(cp),
      "아이폰 HEIC 업로드 실패가 실제로 5건 쌓여 있었다");
  }

  console.log("\n── 15. 목록이 빨리 오는가 ──");
  {
    const html = readFileSync(path.join(ROOT, "index.html"), "utf8");
    const apiSrc2 = readFileSync(path.join(ROOT, "api.js"), "utf8");
    const d2 = readFileSync(path.join(ROOT, "data.js"), "utf8");
    const wk2 = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");

    check("목록을 번들보다 먼저 물어본다", /__BGNJ_PRELOAD/.test(html),
      "1MB 번들을 받고 React 가 뜬 뒤에 묻느라 1.26초를 그냥 흘려보냈다");
    // ⚠ 주소가 두 벌이다. 어긋나면 미리 받기가 조용히 실패하고 아무도 모른다.
    const baseInApi = (apiSrc2.match(/const BASE = "([^"]+)"/) || [])[1] || '';
    const baseInHtml = (html.match(/fetch\('([^']+)\/posts\?limit=1000'/) || [])[1] || '';
    check("미리 받기 주소가 api.js 와 같다", !!baseInApi && baseInApi === baseInHtml,
      `api.js="${baseInApi}" · index.html="${baseInHtml}"`);
    check("인증을 api.js 와 같은 방식으로 보낸다",
      /credentials: 'include'/.test(html) && /bgnj_session_token/.test(html) && /Bearer/.test(html),
      "안 맞추면 관리자가 못 보는 글이 생긴다");
    check("글 목록을 쓰는 화면에서만 미리 받는다", /path\.indexOf\('\/community\/'\)/.test(html),
      "칼럼·도서 페이지에서까지 부르면 그냥 낭비다");
    check("미리 받은 것은 한 번만 쓴다", /window\.__BGNJ_PRELOAD = null;/.test(d2),
      "두 번째 호출은 '지금' 을 물어야 한다");
    check("오래된 것은 버린다", /Date\.now\(\) - Number\(pre\.at \|\| 0\)\) < 30_000/.test(d2));
    check("겹친 목록 요청을 합친다", /_inFlight/.test(d2),
      "실측: 광장 진입 시 같은 요청이 두 번 나갔다");

    // 서버가 목록을 만들 때 본문을 읽으면 안 된다 — 400자 발췌 때문에 783KB 를 읽고 버렸다.
    const listSql = wk2.slice(wk2.indexOf('const sql = `SELECT p.id'), wk2.indexOf('ORDER BY p.created_at DESC LIMIT ?'));
    check("목록 SELECT 가 본문을 읽지 않는다", !/p\.body/.test(listSql) && /p\.excerpt/.test(listSql),
      "발췌 400자를 만들려고 본문 783KB 를 읽고 버리고 있었다");
    check("새 글에 발췌를 함께 저장한다", /postExcerpt\(text\)/.test(wk2));
    check("본문을 고치면 발췌도 같은 문장에서 고친다",
      /if \(k === "body" && k in body\) \{ fields\.push\("excerpt = \?"\)/.test(wk2),
      "따로 갱신하면 언젠가 한쪽만 바뀌어 목록과 본문이 다른 말을 한다");
  }

  console.log("\n── 16. 관리자 대시보드 '오늘' + 버전 기록 ──");
  {
    const wk3 = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");
    const admin = readFileSync(path.join(ROOT, "pages/AuthAdminPage.jsx"), "utf8");

    // '오늘' 은 한국 시간 기준이어야 한다. UTC 로 자르면 아침 9시 이전 활동이 통째로 어제로 빠진다.
    check("오늘 기준이 한국 시간이다", /kstDayStartUtc/.test(wk3) && /9 \* 3600 \* 1000/.test(wk3),
      "UTC 날짜로 자르면 아침 9시 이전에 쓴 글이 전부 '어제' 가 된다");
    check("시각 형식 두 가지를 맞춰서 비교한다", /replace\(\$\{col\}, 'T', ' '\)/.test(wk3),
      "post_likes 만 '2026-08-21 04:29:27' 이고 나머지는 'T...Z' 다 — 문자열 비교가 깨진다");
    check("오늘 창구는 관리자 전용이다", /const handleAdminToday = async \(req, env\) => \{\s*await requireAdmin/.test(wk3));
    check("어제와 견줄 값도 함께 준다", /yesterday: \{ posts: pPosts/.test(wk3),
      "숫자만 있으면 많은 건지 적은 건지 알 수 없다");
    // v00.308.000 — ⚠ 여기서 `admin`(AuthAdminPage.jsx) 을 뒤지던 검사가 **죽은 코드를 통과시켰다.**
    //   v00.306.009 는 '오늘' 카드를 `{false && …}` 껍데기 안에 넣었고, 글자만 찾는 이 검사는 ✅ 를 냈다.
    //   화면엔 한 번도 안 떴다. → 진짜 그리는 파일(AdminDashboardPanel.jsx)에서 찾고,
    //   껍데기 자체가 다시 생기지 않게 아래에서 `{false &&` 를 금지한다.
    const dash = readFileSync(path.join(ROOT, "pages/admin/AdminDashboardPanel.jsx"), "utf8");
    check("네 지표를 진짜 대시보드에 건다",
      ['오늘 작성된 글', '오늘 작성된 댓글', '오늘 받은 공감', '손볼 것']
        .every((l) => dash.includes(`label="${l}"`)),
      "AuthAdminPage 가 아니라 AdminDashboardPanel 이 대시보드를 그린다");
    check("오늘 카드가 방문자·가입 줄보다 위에 있다",
      dash.indexOf('label="오늘 작성된 글"') < dash.indexOf('방문자 · 가입'),
      "사용자 지시 — 방문자/가입 위에 둘 것");
    check("숫자를 카드에 적는다 (호버해야 보이는 게 아니라)",
      /const TodayCard = /.test(dash) && /value\.toLocaleString\('ko-KR'\)/.test(dash),
      "사용자 지시 — '카드로 아예 뽑아달라는 거였어. 호버했을 때 보이는게 아니라'");
    // 주석이 아니라 **실제 JSX 분기**만 잡는다 — 줄머리 들여쓰기 + `(() =>` 가 지문이다.
    const deadBranch = /^\s*\{false && \(\(\) =>/m;
    check("꺼진 채로 들어간 화면 코드가 없다",
      !deadBranch.test(admin) && !deadBranch.test(dash),
      "`{false && …}` 껍데기를 남기면 다음 사람도 거기에 기능을 넣는다");
    check("받아오는 곳과 그리는 곳이 같은 파일에 있다",
      /admin\?\.today\?\.\(\)/.test(dash) && !/todayStats/.test(admin),
      "갈라져 있으면 한쪽만 살아 있어도 아무도 모른다");
    check("공감이 댓글 공감까지 센다",
      /FROM comment_likes WHERE/.test(wk3) && /const likes = postLikes \+ cmtLikes/.test(wk3),
      "댓글 공감을 빼면 카드 숫자가 실제보다 적다");
    check("'손볼 것' 은 아직 처리 안 된 것을 센다",
      /FROM reports WHERE status = 'open'/.test(wk3)
        && /FROM book_orders WHERE status = 'pending_payment'/.test(wk3),
      "오늘 생긴 것만 세면 어제 들어온 신고가 사라진다");

    // 사용자 여정 4단계 — 깔때기는 **뒤 단계가 앞 단계의 부분집합**이어야 말이 된다.
    check("여정 4단계를 센다",
      /summary\.funnel = \{/.test(wk3) && /visits:/.test(wk3) && /reached:/.test(wk3)
        && /browsed:/.test(wk3) && /logged:/.test(wk3));
    check("뒤 단계가 앞 단계의 부분집합이다",
      /WHEN content = 1 AND views >= 2 AND logged = 1/.test(wk3),
      "안 그러면 3단계가 2단계보다 커져 '깔때기' 가 거짓말이 된다");
    check("어디서 가장 많이 빠지는지 짚어 준다", /가장 많이 빠지는 곳/.test(dash),
      "숫자만 늘어놓으면 아무도 안 읽는다");

    // 경로 순위표 — 옛 Sankey 는 (유입, 도착) **쌍**이라 순서를 몰랐다. 세션을 한 줄로 펴야 길이 보인다.
    check("세션을 한 줄로 펴서 순서를 안다",
      /ROW_NUMBER\(\) OVER \(PARTITION BY session_id ORDER BY ts, id\)/.test(wk3)
        && /summary\.journeys = /.test(wk3),
      "쌍으로 세면 홈→광장→홈 이 따로따로 세어져 '다음에 어디로 갔나' 를 알 수 없다");
    check("유입 채널은 첫 페이지 기준이다", /MAX\(CASE WHEN rn = 1 THEN\s*\n?\s*CASE WHEN rh IS NULL/.test(wk3),
      "세션 전체에서 고르면 내부 이동(bgnj.net)이 유입 채널로 둔갑한다");
    check("내부 이동을 '직접 방문' 으로 접는다", /rh LIKE '%bgnj\.net'\s*\n?\s*THEN '직접 방문'/.test(wk3));
    check("화면 이름을 사람 말로 적는다",
      /community: '광장'/.test(dash) && /const routeLabel = /.test(dash),
      "운영자는 'community' 가 아니라 '광장' 이라고 부른다");
    check("Sankey 를 더 그리지 않는다", !/<SankeyFlow/.test(dash),
      "사용자 보고 — '너무 뭉쳐져있고 보는 의미가 없다'");

    // ⚠ 방문 기록이 부르는 함수가 **실제로 있는지** 실행해서 확인한다.
    //   `currentUser()` 는 존재한 적이 없는 이름이었고, 옵셔널 체이닝이 오류를 '값 없음' 으로 바꿔
    //   1,789건 전부 user_id 가 빈 채로 쌓였다. 글자 검사로는 절대 못 잡는다.
    const tracker = (readFileSync(path.join(ROOT, "data.js"), "utf8")
      .match(/const userId = \(window\.BGNJ_AUTH\?\.(\w+)\?\.\(\)/) || [])[1];
    check("방문 기록이 부르는 사용자 조회 함수가 실제로 있다",
      !!tracker && typeof w.BGNJ_AUTH?.[tracker] === 'function',
      `data.js 가 BGNJ_AUTH.${tracker}() 를 부르는데 그런 함수가 없다`);
    check("로그인한 사람의 id 를 실제로 집어낸다", (() => {
      const before = w.BGNJ_AUTH.getSessionUser;
      w.BGNJ_AUTH.getSessionUser = () => ({ id: 'u-test-1' });
      const got = w.BGNJ_AUTH?.[tracker]?.()?.id;
      w.BGNJ_AUTH.getSessionUser = before;
      return got === 'u-test-1';
    })(), "이름만 맞고 값이 안 나오면 여전히 빈 칸이 쌓인다");
    check("집계 실패를 화면이 말한다", /불러오지 못했습니다/.test(dash) && /todayError/.test(dash),
      "조용히 0 을 띄우면 '오늘 아무 일도 없었다' 로 읽힌다");

    // 버전 기록 — 손으로 적어야 하는 구조라 v00.288.002(6월 7일)에서 멈춰 있었다.
    const vh = JSON.parse(readFileSync(path.join(ROOT, "version-history.json"), "utf8"));
    check("버전 기록을 git 에서 자동으로 만든다", Array.isArray(vh.entries) && vh.entries.length > 300,
      `${vh.entries?.length}건 — 손으로 적던 213건보다 많아야 한다`);
    check("자동 기록이 최근까지 온다",
      vh.entries[0] && vh.entries[0].version > '00.288.002',
      `최신 ${vh.entries?.[0]?.version} — 손으로 적던 기록은 00.288.002 에서 멈췄다`);
    check("화면이 손으로 쓴 것과 자동을 합친다", /mergedVersionHistory/.test(admin),
      "옛 기록 213건이 훨씬 자세하다 — 버리면 안 된다");
    check("같은 버전이면 손으로 쓴 쪽을 쓴다",
      /for \(const e of ADMIN_VERSION_HISTORY\) byVersion\.set\(e\.version, e\);/.test(admin));
    check("지금 운영 중인 버전을 함께 보인다", /지금 운영 중/.test(admin),
      "목록 맨 위가 현재 버전이 아니면 '쓰다 만 화면' 으로 보인다");
  }

  console.log("\n── 17. 댓글 최신순 + 공감 ──");
  {
    const wk4 = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");
    const cp2 = readFileSync(path.join(ROOT, "pages/CommunityPage.jsx"), "utf8");

    // ── 정렬 — 규칙을 **실제로 실행**해서 순서를 본다. 눈으로 읽는 검사는 뒤집힌 것을 못 잡는다.
    const src = cp2.slice(cp2.indexOf("const sortComments = "));
    const sortSrc = src.slice(0, src.indexOf("\n};") + 2);
    const sortComments = vm.runInNewContext(`(${sortSrc.replace(/^const sortComments = /, "")})`, { Date, Number });
    const sample = [
      { id: 1, createdAt: "2026-08-25T11:05:52.327Z" },
      { id: 2, createdAt: "2026-08-25T13:44:08.320Z" },
      { id: 3, createdAt: "2026-08-25T16:19:51.950Z" },
    ];
    check("최신 댓글이 맨 위로 온다",
      sortComments(sample, "new").map((c) => c.id).join(",") === "3,2,1",
      `실제: ${sortComments(sample, "new").map((c) => c.id).join(",")}`);
    check("'등록순' 을 고르면 옛것이 위로 간다",
      sortComments(sample, "old").map((c) => c.id).join(",") === "1,2,3");
    check("시각이 같으면 등록 순서로 가른다",
      sortComments([{ id: 7, createdAt: "2026-08-26T01:00:00.000Z" },
                    { id: 9, createdAt: "2026-08-26T01:00:00.000Z" }], "new")
        .map((c) => c.id).join(",") === "9,7",
      "초 단위가 겹치면 순서가 흔들려 새로고침마다 자리가 바뀐다");
    check("원본 배열을 건드리지 않는다",
      (sortComments(sample, "new"), sample.map((c) => c.id).join(",") === "1,2,3"),
      "제자리 정렬이면 부모가 쥔 목록까지 바뀐다");
    check("답글에도 같은 규칙을 쓴다",
      /const repliesOf = \(parentId\) => sortComments\(/.test(cp2),
      "사용자 선택(2026-08-26) — 답글도 최신이 위로");

    // ── 공감 — 낙관적 반영이 **실패했을 때 걷어내는지**가 핵심이다.
    //    안 걷어내면 화면만 '눌린 척' 을 한다(2026-08-25 사고의 두 번째 얼굴과 같은 모양).
    const seed = () => {
      w.BGNJ_COMMENTS._cache["post:1"] = [
        { id: 11, targetType: "post", targetId: "1", parentId: null, text: "가", likeCount: 2, liked: false },
      ];
    };
    const one = () => w.BGNJ_COMMENTS.list("post", 1)[0];

    seed();
    w.BGNJ_API = { comments: { like: async () => ({ liked: true, count: 3 }) } };
    w.BGNJ_COMMENTS.toggleLike("post", 1, 11);
    check("누르는 즉시 숫자가 올라간다", one().liked === true && one().likeCount === 3,
      `실제: liked=${one().liked} count=${one().likeCount}`);
    await new Promise((r) => setTimeout(r, 0));

    seed();
    w.BGNJ_API = { comments: { like: async () => ({ liked: true, count: 9 }) } };
    w.BGNJ_COMMENTS.toggleLike("post", 1, 11);
    await new Promise((r) => setTimeout(r, 0));
    check("서버가 센 값이 낙관적 숫자를 이긴다", one().likeCount === 9,
      `실제: ${one().likeCount} — 남이 누른 사이 숫자가 벌어져 있을 수 있다`);

    seed();
    w.BGNJ_API = { comments: { like: async () => { throw new Error("끊김"); } } };
    w.BGNJ_COMMENTS.toggleLike("post", 1, 11);
    await new Promise((r) => setTimeout(r, 0));
    check("실패하면 시작 시점 값으로 되돌린다", one().liked === false && one().likeCount === 2,
      `실제: liked=${one().liked} count=${one().likeCount} — 안 걷어내면 '눌린 척' 을 한다`);

    w.BGNJ_COMMENTS._cache["post:1"] = [{ id: "tmp-1", likeCount: 0, liked: false }];
    let called = false;
    w.BGNJ_API = { comments: { like: async () => { called = true; return {}; } } };
    w.BGNJ_COMMENTS.toggleLike("post", 1, "tmp-1");
    check("아직 저장 안 된 댓글에는 안 누른다", called === false,
      "서버에 없는 id 로 부르면 404 가 난다");

    // ── 워커 ──
    check("공감 판정을 한 문장으로 한다", /INSERT OR IGNORE INTO comment_likes/.test(wk4),
      "세고 나서 넣으면 빠르게 두 번 누를 때 둘 다 '처음' 이 된다");
    check("공감을 댓글보다 먼저 지운다",
      wk4.indexOf("DELETE FROM comment_likes WHERE comment_id = ? OR comment_id IN")
        < wk4.indexOf("DELETE FROM content_comments WHERE id = ? OR parent_id = ?"),
      "댓글이 사라진 뒤엔 어떤 답글이 딸려 있었는지 알 수 없다");
    check("대상이 지워질 때 공감도 함께 지운다",
      /DELETE FROM comment_likes WHERE comment_id IN\s*\n?\s*\(SELECT id FROM content_comments WHERE target_type/.test(wk4),
      "안 지우면 주인 없는 공감이 조용히 쌓인다");
    check("공감 조회가 실패해도 댓글 본문은 보인다",
      /catch \(e\) \{\s*console\.warn\("\[bgnj:comment-likes\]"/.test(wk4),
      "표가 아직 없는 순간에 화면이 통째로 비면 안 된다");
    check("공감 창구가 삭제 창구보다 먼저 걸린다",
      wk4.indexOf("\\/api\\/comments\\/([\\w-]+)\\/like$") < wk4.indexOf("\\/api\\/comments\\/([\\w-]+)$"),
      "뒤에 두면 like 가 삭제 규칙에 먼저 걸릴 수 있다");
  }

  console.log("\n── 18. 조용히 사라진 것들 (2026-08-26 안정성 재검토) ──");
  {
    const boot = readFileSync(path.join(ROOT, "boot.jsx"), "utf8");
    const entryMain = readFileSync(path.join(ROOT, "src/entry-main.jsx"), "utf8");
    const checkout = readFileSync(path.join(ROOT, "pages/BookCheckoutPage.jsx"), "utf8");
    const homeNext = readFileSync(path.join(ROOT, "pages/HomeNextPage.jsx"), "utf8");

    // ⚠ 입금 계좌 — 서버엔 있는데 손님 화면엔 한 줄도 안 떴다. 두 군데가 동시에 고장나 있었다.
    //   ① 부팅이 엉뚱한 객체에서 갱신 함수를 찾았다(BGNJ_BOOK_ORDERS ← 주인은 BGNJ_LECTURES)
    //   ② 안내 컴포넌트 정의가 관리자 번들에만 있었다(손님은 그 번들을 안 받는다)
    check("부팅이 계좌 갱신을 올바른 객체에서 부른다",
      /window\.BGNJ_LECTURES\?\.refreshBankAccount\?\.\(\)/.test(boot)
        && !/BGNJ_BOOK_ORDERS\?\.refreshBankAccount/.test(boot),
      "BGNJ_BOOK_ORDERS 에는 그 함수가 없어 조용히 건너뛰었다");
    check("그 갱신 함수가 실제로 있다",
      typeof w.BGNJ_LECTURES?.refreshBankAccount === 'function');
    check("입금 계좌 안내가 메인 번들에 실린다",
      /components\/BankAccountPicker\.jsx/.test(entryMain),
      "관리자 번들에만 있으면 손님 결제 화면에서 통째로 사라진다");
    check("결제 화면이 그 안내를 부른다", /<window\.BGNJ_BankAccountPicker/.test(checkout));

    // 계좌를 실제로 받아 채우는지 — 서버 응답 모양(snake_case)까지 맞는지 돌려서 본다.
    check("서버 응답을 화면이 읽는 모양으로 바꾼다", await (async () => {
      w.BGNJ_API = { bankAccounts: { list: async () => ({ accounts: [
        { id: 'ba-1', label: '법인계좌', bank_name: '국민은행', account_number: '48263701023015',
          holder: '(주)뱅기노자', memo: '', is_default: 1, display_order: 0 },
      ] }) } };
      await w.BGNJ_LECTURES.refreshBankAccount();
      const one = w.BGNJ_LECTURES.getBankAccount();
      return one.bankName === '국민은행' && one.accountNumber === '48263701023015';
    })(), "snake_case 를 안 벗기면 화면에 '-' 만 뜬다");
    check("빈 응답이 기존 계좌를 지우지 않는다", await (async () => {
      const before = w.BGNJ_LECTURES.getBankAccount();
      w.BGNJ_API = { bankAccounts: { list: async () => ({ accounts: null }) } };
      await w.BGNJ_LECTURES.refreshBankAccount();
      return w.BGNJ_LECTURES.getBankAccount().accountNumber === before.accountNumber;
    })(), "비-배열로 캐시를 덮으면 결제 직전에 계좌가 사라진다");

    // ⚠ 관리자 판정 — 없는 함수라 관리자에게도 편집 버튼이 뜬 적이 없었다.
    check("홈넥스트 관리자 판정이 진짜 함수를 쓴다",
      /getSessionUser\?\.\(\)\?\.isAdmin/.test(homeNext) && !/currentUser\?\.\(\)/.test(homeNext));
    check("아무도 currentUser() 를 부르지 않는다", (() => {
      const dirs = ['pages', 'components'];
      const hit = [];
      const walk = (d) => {
        for (const f of readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
          const rel = path.join(d, f.name);
          if (f.isDirectory()) walk(rel);
          else if (/\.jsx?$/.test(f.name)
            && /BGNJ_AUTH\?\.currentUser/.test(readFileSync(path.join(ROOT, rel), "utf8"))) hit.push(rel);
        }
      };
      dirs.forEach(walk);
      if (/BGNJ_AUTH\?\.currentUser/.test(readFileSync(path.join(ROOT, "data.js"), "utf8"))) hit.push('data.js');
      if (/BGNJ_AUTH\?\.currentUser/.test(boot)) hit.push('boot.jsx');
      return hit.length === 0;
    })(), "존재한 적 없는 이름이다 — 진짜는 getSessionUser()");
  }

  console.log("\n── 19. 늦게 온 답이 새 답을 덮는가 (2026-08-28 안정성 재검토) ──");
  {
    const wk5 = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");
    const dataSrc = readFileSync(path.join(ROOT, "data.js"), "utf8");
    const later = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));

    // ── 게시글 목록 경쟁 ──
    // 먼저 떠난 요청이 나중에 도착한다. 옛 목록이 새 목록을 이기면 '방금 쓴 글이 사라진다'.
    const C2 = w.BGNJ_COMMUNITY;
    C2._serverPosts = []; C2._serverLoaded = false; C2._lastError = null; C2._applySeq = 0;
    w.__BGNJ_PRELOAD = null;
    w.BGNJ_API = { posts: { list: async (opts) => (
      opts.mark === "old" ? later(80, { posts: [{ id: 1, title: "옛 목록", category_id: "free" }] })
                          : later(5,  { posts: [{ id: 2, title: "새 목록", category_id: "free" }] })
    ) } };
    const pOld = C2.refreshPosts({ mark: "old" });
    const pNew = C2.refreshPosts({ mark: "new" });
    await Promise.all([pOld, pNew]);
    check("먼저 떠나 늦게 온 목록이 새 목록을 덮지 않는다",
      C2._serverPosts.length === 1 && C2._serverPosts[0].id === 2,
      `실제: ${C2._serverPosts.map((p) => p.title).join(",") || "빈 목록"} — 덮이면 방금 쓴 글이 사라진 것처럼 보인다`);

    // 낡은 요청의 '실패' 도 새 요청의 성공을 지우면 안 된다.
    C2._serverPosts = []; C2._lastError = null; C2._applySeq = 0;
    w.BGNJ_API = { posts: { list: async (opts) => (
      opts.mark === "old" ? later(80).then(() => { throw new Error("옛 요청 실패"); })
                          : later(5, { posts: [{ id: 3, title: "새 목록", category_id: "free" }] })
    ) } };
    const fOld = C2.refreshPosts({ mark: "old" });
    const fNew = C2.refreshPosts({ mark: "new" });
    await Promise.all([fOld, fNew]);
    check("낡은 요청의 실패가 새 요청의 성공을 지우지 않는다",
      C2._lastError === null && C2._serverPosts.length === 1,
      `실제: err=${C2._lastError} 글=${C2._serverPosts.length}건 — 지우면 멀쩡한 화면에 유령 오류가 뜬다`);

    // ── 칼럼 목록 경쟁 (관리자 includeAll ↔ 공개) ──
    const K = w.BGNJ_COLUMNS;
    K._columns = []; K._applySeq = 0;
    w.BGNJ_API = { columns: { list: async ({ includeAll }) => (
      includeAll ? later(80, { columns: [{ id: "c1", title: "관리자 목록" }] })
                 : later(5,  { columns: [{ id: "c2", title: "공개 목록" }] })
    ) } };
    const kAdmin = K.refresh({ admin: true });
    const kPublic = K.refresh({ admin: false });
    await Promise.all([kAdmin, kPublic]);
    check("칼럼도 늦게 온 답이 새 답을 덮지 않는다",
      K._columns.length === 1 && K._columns[0].id === "c2",
      `실제: ${K._columns.map((c) => c.id).join(",") || "빈 목록"}`);

    // ── 깨진 JSON 한 줄이 목록 전체를 죽이는가 ──
    const A = w.BGNJ_AUTH;
    A._usersCache = [];
    w.BGNJ_API = { admin: { users: { list: async () => ({ users: [
      { id: "u1", email: "a@b.c", name: "정상", profile_json: '{"phone":"010"}' },
      { id: "u2", email: "d@e.f", name: "깨진 행", profile_json: '{"phone":' },
    ] }) } } };
    const users = await A.refreshUsers();
    check("회원 한 명의 깨진 JSON 이 회원 목록 전체를 지우지 않는다",
      users.length === 2 && users[1].profile === null,
      `실제: ${users.length}명 — 0명이면 관리자 화면에 회원이 한 명도 안 뜬다`);
    check("정상 행의 값은 그대로 읽는다",
      users[0]?.profile?.phone === "010", `실제: ${JSON.stringify(users[0]?.profile)}`);

    // ── 맨몸 JSON.parse 가 남아 있지 않은가 ──
    // (헬퍼 자신과 try 로 감싼 localStorage 접근은 예외)
    const bareWorker = wk5.split("\n").filter((l) =>
      /JSON\.parse\(/.test(l) && !/safeJson|JSON\.parse\(raw\)/.test(l) && !/^\s*\/\//.test(l));
    check("워커가 서버 행을 맨몸 JSON.parse 로 읽지 않는다", bareWorker.length === 0,
      bareWorker.join(" | ") || "");
    check("워커 헬퍼가 못 읽은 값을 로그로 남긴다",
      /\[bgnj:safeJson\]/.test(wk5), "조용히 넘어가면 왜 비었는지 아무도 모른다");
    check("클라이언트도 같은 헬퍼를 쓴다",
      /const _safeJson =/.test(dataSrc) && /_safeJson\(u\.profile_json/.test(dataSrc));

    // ── 무한히 커지는 표 ──
    check("오류 기록에 자동 청소가 있다",
      /ERROR_LOG_RETENTION_MS/.test(wk5) && /DELETE FROM error_log WHERE replace\(ts/.test(wk5),
      "없으면 오류 루프 하나로 D1 이 차고 사이트 전체가 멈춘다");
    check("오류 기록 청소가 실제로 있는 컬럼을 본다",
      !/DELETE FROM error_log WHERE created_at/.test(wk5),
      "created_at 은 이 표에 없다 — 조용히 아무것도 안 지우고 통과한다");

    // ── 신고 중복 ──
    check("같은 사람의 같은 글 신고는 하나만 남는다",
      /INSERT INTO reports[\s\S]{0,400}WHERE NOT EXISTS/.test(wk5),
      "세고 나서 넣으면 연타에 '손볼 것' 숫자가 부풀어 오른다");
  }

  console.log("\n── 20. 저장됐다고 말하기 전에 서버가 받았는가 (2026-08-28) ──");
  {
    const shared = readFileSync(path.join(ROOT, "pages/admin/AdminShared.jsx"), "utf8");
    const dataSrc2 = readFileSync(path.join(ROOT, "data.js"), "utf8");
    // v00.314 — 구현은 data.js 한 곳(두 번들이 함께 읽는 유일한 자리). 관리자 이름은 위임.
    check("공통 관문이 두 번들이 함께 읽는 자리에 있다",
      /window\.BGNJ_SAVE_GUARD = async/.test(dataSrc2), "AdminShared 는 관리자 번들에만 실린다");
    check("관리자 이름은 같은 구현으로 위임한다",
      /const adminSave = \(work, opts\) => window\.BGNJ_SAVE_GUARD/.test(shared)
        && /window\.BGNJ_ADMIN_SAVE = adminSave/.test(shared),
      "두 벌을 두면 반드시 한쪽이 낡는다");
    check("성공은 끝난 뒤에만 말한다",
      /await[\s\S]{0,80}if \(ok\) window\.BGNJ_TOAST\?\.success/.test(dataSrc2),
      "먼저 말하면 실패해도 초록 문구가 남는다");
    check("실패를 사람의 말로 알린다",
      /catch \(err\)[\s\S]{0,200}BGNJ_TOAST\?\.error/.test(dataSrc2));

    // ── 후기: 실패를 '돌려주기만' 하고 아무도 안 보던 자리 ──
    const lect = readFileSync(path.join(ROOT, "pages/LecturesPage.jsx"), "utf8");
    const tour = readFileSync(path.join(ROOT, "pages/WangsanamTourPage.jsx"), "utf8");
    for (const [name, src] of [["강연", lect], ["투어", tour]]) {
      check(`${name} 후기 저장이 결과를 확인한다`,
        /const r = await window\.BGNJ_(LECTURES|TOURS)\.addReview/.test(src) && /if \(!r\?\.ok\)/.test(src),
        "실패를 안 보면 입력칸만 비워지고 쓴 후기가 사라진다");
      check(`${name} 후기는 실패하면 입력칸을 비우지 않는다`,
        /if \(!r\?\.ok\) \{[\s\S]{0,160}return; \}/.test(src),
        "지우고 나면 되돌릴 방법이 없다");
      check(`${name} 후기 삭제가 실패를 알린다`,
        /BGNJ_SAVE_GUARD\(\(\) => window\.BGNJ_(LECTURES|TOURS)\.deleteReview/.test(src));
    }

    // 관리자 패널에서 서버 저장을 '던져 놓고 잊는' 자리가 남아 있는가 —
    // 전역 unhandledrejection 이 토스트를 띄우긴 하지만 '저장됨' **다음에** 뜬다.
    const WRITE = /\b(save|update|create|delete|remove|patch|approve|reject|setHidden|removeReview)\w*\s*\(/i;
    const leftovers = [];
    for (const f of readdirSync(path.join(ROOT, "pages/admin"))) {
      if (!/\.jsx$/.test(f)) continue;
      readFileSync(path.join(ROOT, "pages/admin", f), "utf8").split("\n").forEach((l, i) => {
        const t = l.trim();
        if (!/^window\.BGNJ_[A-Z_]+[\w.?]*\s*[.(]/.test(t)) return;
        if (!WRITE.test(t)) return;
        if (/await|\.then|\.catch|\.finally|return |BGNJ_(TOAST|CONFIRM|DRAFTS|ADMIN_SAVE|AUDIT|SAVE|STORES)/.test(t)) return;
        leftovers.push(`${f}:${i + 1}`);
      });
    }
    check("관리자 패널에 던져 놓고 잊는 저장이 없다", leftovers.length === 0, leftovers.join(", "));

    // 환불은 돈이 걸린 자리 — 확인하고 나서 목록을 다시 그리는지.
    const commerce = readFileSync(path.join(ROOT, "pages/admin/AdminCommercePanels.jsx"), "utf8");
    check("환불 승인·반려가 서버 응답을 기다린다",
      /BGNJ_ADMIN_SAVE\(\(\) => window\.BGNJ_BOOK_ORDERS\.approveRefund/.test(commerce)
        && /BGNJ_ADMIN_SAVE\(\(\) => window\.BGNJ_BOOK_ORDERS\.rejectRefund/.test(commerce));

    // 신고 — 글 삭제가 실패했는데 신고만 닫으면 신고 글이 그대로 남는다.
    const router = readFileSync(path.join(ROOT, "pages/admin/AdminRouterPanels.jsx"), "utf8");
    check("글 삭제가 실패하면 신고를 닫지 않는다",
      /const removed = await window\.BGNJ_ADMIN_SAVE[\s\S]{0,300}if \(removed\)[\s\S]{0,200}updateReportStatus/.test(router),
      "닫아 버리면 신고 글이 남은 채로 목록에서 사라진다");
  }

  console.log("\n── 21. 알림은 그 일이 일어난 자리에서 만든다 (2026-08-28) ──");
  {
    const wk6 = readFileSync(path.join(ROOT, "workers/src/index.js"), "utf8");
    const comm = readFileSync(path.join(ROOT, "pages/CommunityPage.jsx"), "utf8");
    const dataSrc3 = readFileSync(path.join(ROOT, "data.js"), "utf8");
    check("화면에서 알림을 만들려 하지 않는다",
      !/BGNJ_COMMUNITY\??\.?addNotification\??\.?\(/.test(comm)
        && !/BGNJ_COMMUNITY\?\.addNotification/.test(dataSrc3),
      "no-op 을 부르면 '알림을 보냈다' 고 착각한다");
    check("등급이 바뀌면 서버가 알린다",
      /grade_changed/.test(wk6) && /"gradeId" in body && body\.gradeId && body\.gradeId !== beforeGrade/.test(wk6),
      "지금까지 양쪽 어디도 안 만들고 있었다");
    check("바꾸기 전에 이전 등급을 읽는다",
      wk6.indexOf("const beforeGrade") < wk6.indexOf("UPDATE users SET ${fields.join"),
      "뒤에 읽으면 늘 같은 값이라 알림이 영영 안 나간다");
    check("등급 이름을 있는 컬럼에서 읽는다",
      /SELECT label FROM grades_kv/.test(wk6) && !/data_json FROM grades_kv/.test(wk6),
      "grades_kv 에 data_json 은 없다 — 등급 변경이 통째로 500 이 된다");
    check("댓글 알림은 저장이 끝난 자리에서 만든다",
      /handleCommentsCreate[\s\S]{0,3000}insertNotification/.test(wk6));
  }

  console.log(`\n${fails.length === 0 ? "✅" : "❌"} 통과 ${pass} · 실패 ${fails.length}`);
  if (fails.length) { fails.forEach((f) => console.log(`   · ${f}`)); process.exit(1); }
};

run().catch((e) => { console.error("스모크 테스트가 죽었다:", e); process.exit(1); });

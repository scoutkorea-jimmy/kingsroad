// 뱅기노자 mock data

// === 사이트 버전 (수정 시 footer에 노출) ===
window.BGNJ_VERSION = {
  version: "00.034.001",
  build: "2026.04.28",
  channel: "preview",
};

// 로딩 직후 콘솔에 버전 표식 — '내가 어떤 코드를 보고 있는지' 즉시 확인용.
// 강제 새로고침이 필요한 사용자도 콘솔로 빠르게 진단 가능.
try {
  console.log(
    `%c[BGNJ] v${window.BGNJ_VERSION.version} · build ${window.BGNJ_VERSION.build}`,
    'background:#1E3A8A;color:#F5E6A8;padding:3px 8px;border-radius:3px;font-weight:600;'
  );
} catch {}

// 진단용 헬스체크 헬퍼 — 콘솔에서 BGNJ_DIAG.run() 으로 즉시 실행 가능.
window.BGNJ_DIAG = {
  async run() {
    const result = { version: window.BGNJ_VERSION, origin: location.origin, time: new Date().toISOString() };
    try {
      const t0 = performance.now();
      const health = await window.BGNJ_API.health();
      result.health = { ok: true, latencyMs: Math.round(performance.now() - t0), ...health };
    } catch (err) {
      result.health = { ok: false, code: err?.code, status: err?.status, message: err?.message, url: err?.url };
    }
    try {
      const me = await window.BGNJ_API.me();
      result.session = { ok: true, user: me?.user || null };
    } catch (err) {
      result.session = { ok: false, code: err?.code, status: err?.status, message: err?.message };
    }
    console.log('[BGNJ_DIAG]', result);
    return result;
  },
};

// === wsd_* → bgnj_* 일회성 마이그레이션 ===
// 기존 사용자의 localStorage 키 이름이 'wsd_'로 시작했었으므로,
// 대상 'bgnj_' 키가 비어있고 원본 'wsd_' 키가 있으면 한 번만 복사한다.
// 원본은 보존(롤백 안전). 마커가 설정되면 다시 실행되지 않는다.
(function migrateWsdToBgnj() {
  try {
    if (localStorage.getItem('bgnj_migration_v1') === 'done') return;
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k && k.startsWith('wsd_')) keys.push(k);
    }
    keys.forEach((oldKey) => {
      const newKey = 'bgnj_' + oldKey.slice(4);
      if (localStorage.getItem(newKey) == null) {
        const v = localStorage.getItem(oldKey);
        if (v != null) localStorage.setItem(newKey, v);
      }
    });
    // sessionStorage도 같은 방식
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith('wsd_')) {
        const newKey = 'bgnj_' + k.slice(4);
        if (sessionStorage.getItem(newKey) == null) {
          sessionStorage.setItem(newKey, sessionStorage.getItem(k));
        }
      }
    }
    localStorage.setItem('bgnj_migration_v1', 'done');
  } catch {}
})();

// === v33 정리 — D1 로 이전된 엔티티의 localStorage 잔재 일괄 삭제 ===
// 다음 키들은 이제 모두 D1 source of truth. 클라이언트 localStorage 에 남아있는 옛 데이터는
// 캐시 충돌/오해를 일으키므로 한 번 비운다. UI 상태(카트/세션캐시/쿠키동의/임시저장/라우트) 는 보존.
(function cleanupV33() {
  try {
    if (localStorage.getItem('bgnj_cleanup_v33') === 'done') return;
    const KEEP_PREFIXES = ['bgnj_post_draft_'];
    const KEEP_EXACT = new Set([
      'bgnj_session_user',  // FCP 캐시
      'bgnj_route',         // 마지막 라우트
      'bgnj_cart',          // 장바구니 (UI 상태)
      'bgnj_cookie_consent',// 쿠키 동의 결정
      'bgnj_migration_v1',  // 마이그레이션 마커 (보존)
      'bgnj_cleanup_v33',   // 본 마이그레이션 마커
    ]);
    // 마이그레이션된 엔티티 — 명시적 삭제.
    const PURGE = [
      'bgnj_book_orders', 'bgnj_book_reviews', 'bgnj_books',
      'bgnj_lecture_overrides', 'bgnj_lecture_registrations', 'bgnj_lecture_reviews',
      'bgnj_tour_overrides', 'bgnj_tour_reservations', 'bgnj_tour_reviews',
      'bgnj_user_columns', 'bgnj_column_engagement',
      'bgnj_audit_log', 'bgnj_legal_docs', 'bgnj_faqs',
      'bgnj_bank_account', 'bgnj_site_content',
      'bgnj_users', 'bgnj_session',
      'bgnj_bookmarks', 'bgnj_reports', 'bgnj_notifications',
      'bgnj_grades', 'bgnj_categories',
      'bgnj_community_posts', 'bgnj_user_posts', 'bgnj_comments',
    ];
    const removed = [];
    PURGE.forEach((k) => { if (localStorage.getItem(k) !== null) { localStorage.removeItem(k); removed.push(k); } });
    // 또 wsd_* 잔재도 같이 정리(마이그레이션 후 더는 사용 안 함).
    const wsdKeys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k && k.startsWith('wsd_')) wsdKeys.push(k);
    }
    wsdKeys.forEach((k) => { localStorage.removeItem(k); removed.push(k); });
    localStorage.setItem('bgnj_cleanup_v33', 'done');
    if (removed.length) console.log('[BGNJ] v33 cleanup — removed localStorage keys:', removed);
  } catch {}
})();

// === 회원 등급/카테고리/해시태그 저장소 (localStorage 연동) ===
const _lsGet = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const _lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const _asArray = (value, fallback = []) => Array.isArray(value) ? value : fallback;
const _asRecord = (value, fallback = {}) => (
  value && typeof value === "object" && !Array.isArray(value) ? value : fallback
);

const BGNJ_STORAGE_VERSION = "v1-local-first";
const hashPassword = (input) => {
  const value = String(input || "");
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return `bgnj_${Math.abs(hash).toString(16)}`;
};

// 회원 등급 — 번호가 낮을수록 권한 낮음. admin > …
// 색상은 사이트 블루 팔레트(--gold ~ --gold-ink)와 일관성 있게 단계적으로 진해진다.
const DEFAULT_GRADES = [
  { id: "guest",    label: "방문객", level: 0, color: "#64748B", desc: "비로그인 / 게스트" },
  { id: "member",   label: "입문", level: 10, color: "#94A3B8", desc: "회원가입 완료" },
  { id: "reader",   label: "독자", level: 30, color: "#93C5FD", desc: "활동 회원 (댓글 10+)" },
  { id: "scholar",  label: "사관", level: 60, color: "#3B82F6", desc: "열성 회원 (칼럼 기고 가능)" },
  { id: "wangsanam",label: "왕사남", level: 90, color: "#2563EB", desc: "운영진" },
  { id: "admin",    label: "관리자", level: 100, color: "#1E3A8A", desc: "최고 관리자" },
];

// 기존 localStorage에 남아있는 노란색(legacy gold) 등급 색상을 새 블루 팔레트로 마이그레이션.
// id 기준 매칭 — 사용자가 직접 색을 바꿨으면 건드리지 않음.
const LEGACY_GRADE_COLORS = {
  guest: "#78716a",
  member: "#b8b1a1",
  reader: "#E8C547",
  scholar: "#D4AF37",
  wangsanam: "#F5E6A8",
  admin: "#F5E6A8",
};
const migrateLegacyGradeColors = (grades) => {
  if (!Array.isArray(grades)) return grades;
  const byId = Object.fromEntries(DEFAULT_GRADES.map((g) => [g.id, g.color]));
  return grades.map((g) => {
    if (!g || !g.id) return g;
    const legacy = LEGACY_GRADE_COLORS[g.id];
    if (legacy && (g.color || "").toLowerCase() === legacy.toLowerCase() && byId[g.id]) {
      return { ...g, color: byId[g.id] };
    }
    return g;
  });
};

// 다양한 책 카탈로그 — 관리자 페이지에서 추가/편집. 표지(PNG)와 본문 미리보기(PDF)는
// dataURI(base64)로 localStorage에 저장. 책마다 소개/목차/저자/리뷰가 독립적으로 따라간다.
const DEFAULT_BOOKS = [
  {
    id: "wang",
    slug: "wang",
    title: "왕의길",
    subtitle: "다섯 봉우리 아래 읽는 조선",
    author: "뱅기노자",
    publisher: "뱅기노자 프레스",
    pages: 412,
    isbn: "979-11-000-0000-0",
    priceKR: 28000,
    priceEN: 35000,
    desc: "왕의 자리에 선 자는 누구인가. 그 자리에서 무엇을 보았으며, 어떤 질문을 견뎠는가. 뱅기노자가 15년간 쌓아올린 궁궐 답사와 실록 독해의 결실을 한 권으로 엮는다. 왕의 자리가 아니라 왕이 바라본 길을 따라가는 책.",
    intro: "<p>왕의 자리에 선 자는 누구인가. 이 책은 그 자리에서 무엇을 보았는지를 묻는다.</p><p>저자 뱅기노자는 15년간 실록과 궁궐을 오가며 쌓아올린 기록을 한 권으로 엮었다. 왕의 자리가 아니라 왕이 바라본 길 — 그 시선의 각도를 오늘의 언어로 재구성한다.</p><p>총 5부 22장. 조선 27명의 왕 중 11명을 깊이 있게 다룬다.</p>",
    chapters: [
      "1부 · 다섯 봉우리의 설계",
      "2부 · 어좌 뒤에서 바라본 것",
      "3부 · 측근과 거리의 정치",
      "4부 · 길이라는 말의 무게",
      "5부 · 현대의 군주는 누구인가",
    ],
    authorBio: "뱅기노자. 커뮤니티 창립자. 15년간 조선왕조실록과 궁궐을 오갔다. 답사와 강연을 통해 조선의 왕들을 오늘의 자리에 소환한다. 『왕의길』은 그의 첫 단독 저서다.",
    coverDataUri: "",
    pdfPreviewDataUri: "",
    badges: ["출간"],
    status: "published",
    publishedAt: "2026-04-01",
    primary: true,
    order: 0,
    reviews: [],
  },
];

// 사이트 콘텐츠 — 관리자 페이지에서 직접 편집되는 메뉴 라벨, 히어로 텍스트, 푸터 문구.
// 각 섹션은 기본값 위에 사용자 편집값을 얕은 병합으로 덮어쓴다.
const DEFAULT_SITE_CONTENT = {
  nav: {
    home: "홈",
    community: "커뮤니티",
    lectures: "강연",
    tour: "투어 프로그램",
    column: "뱅기노자 칼럼",
    book: "뱅기노자의 길",
  },
  brand: { name: "뱅기노자", sub: "BANGINOJA" },
  hero: {
    eyebrow: "BANGINOJA · 뱅기타고 노자",
    title1: "뱅기타고",
    title2: "한국을",
    title3: "느끼다",
    subtitle: "궁궐 답사부터 지역 여행 코스까지. 뱅기노자와 함께 한국의 역사·문화·자연을 온몸으로 경험하는 여행 커뮤니티입니다.",
    ctaPrimary: "커뮤니티 참여하기 →",
    ctaSecondary: "투어 프로그램 보기",
    mapHint: "지도를 클릭해 여행지를 탐색하세요",
  },
  footer: {
    description: "뱅기타고 노자. 뱅기노자는 한국의 역사·문화·자연을 직접 걷고 느끼며 나누는 여행 커뮤니티입니다. 궁궐 답사부터 지역 여행까지, 함께 만들어가는 여행.",
    signature: "뱅기타고 노자 · DESIGNED IN SEOUL",
  },
  // 이미지는 dataURI(base64)로 저장한다. 비워두면 기본 SVG/이모지 마크가 사용된다.
  branding: { logoDataUri: "", faviconDataUri: "" },
  og: {
    title: "뱅기노자 — 뱅기 타고 한국을 느끼다",
    description: "뱅기노자 — 뱅기 타고 한국을 느끼다. 궁궐 답사부터 지역 여행까지, 한국의 역사·문화·자연을 함께 여행하는 커뮤니티.",
    imageDataUri: "",
  },
  // 로그인/회원가입 페이지 좌측 영역 — 관리자에서 이미지/문구 직접 편집 가능.
  auth: {
    imageDataUri: "",
    eyebrow: "BANGINOJA",
    title: "뱅기 타고\n뱅기노자가 되다",
    description: "뱅기노자는 단순 여행 정보 사이트가 아닙니다. 함께 떠나고, 함께 걷고, 함께 이야기하는 여행자들의 광장입니다. 매달 새로운 답사와 칼럼이 이어집니다.",
  },
  // 푸터 연락 정보 — 관리자에서 직접 편집. 빈 값이면 해당 줄 미노출.
  contact: {
    email: "hello@bgnj.net",
    phone: "02-0000-0000",
    phoneHref: "tel:+82-2-0000-0000",
    address: "서울특별시",
  },
};

// 게시판 분류 — 각 카테고리에 최소 등급(minLevel) 지정 시 접근 제한
const DEFAULT_CATEGORIES = [
  { id: "notice",   label: "공지",  boardType: "community", minLevel: 0,  postMinLevel: 100, desc: "운영진 공지 (읽기: 누구나 · 쓰기: 관리자)" },
  { id: "free",     label: "자유",  boardType: "community", minLevel: 10, postMinLevel: 10,  desc: "자유 게시판 (쓰기: 회원)" },
  { id: "question", label: "질문",  boardType: "community", minLevel: 10, postMinLevel: 10,  desc: "질문 게시판 (쓰기: 회원)" },
  { id: "info",     label: "정보",  boardType: "community", minLevel: 10, postMinLevel: 30,  desc: "정보 공유 (쓰기: 독자 이상)" },
  { id: "column",   label: "칼럼",  boardType: "column",    minLevel: 0,  postMinLevel: 100, desc: "뱅기노자 칼럼 (쓰기: 관리자)" },
];

const DEFAULT_COMMUNITY_POSTS = [
  { id: 1, categoryId: "free", category: "자유", title: "첫 답사 후기 — 창덕궁 후원 야간 프로그램", author: "돌담아래", replies: 24, views: 512, date: "2026.04.17", hot: true },
  { id: 2, categoryId: "question", category: "질문", title: "『왕의길』 2장에 나오는 '측근 정치'에 대해 여쭙니다", author: "역사애호", replies: 18, views: 342, date: "2026.04.16" },
  { id: 3, categoryId: "info", category: "정보", title: "국립고궁박물관 특별전 — 조선 왕실 회화 원본 공개", author: "고궁지기", replies: 41, views: 1203, date: "2026.04.15", hot: true },
  { id: 4, categoryId: "free", category: "자유", title: "뱅기노자 선생님 강연 들은 후기 (긴 글 주의)", author: "봄밤의자", replies: 33, views: 876, date: "2026.04.14" },
  { id: 5, categoryId: "question", category: "질문", title: "세종실록과 성종실록, 초심자는 어디부터?", author: "입문자", replies: 12, views: 245, date: "2026.04.13" },
  { id: 6, categoryId: "info", category: "정보", title: "4월 답사 일정 총정리", author: "운영진", replies: 8, views: 612, date: "2026.04.12" },
  { id: 7, categoryId: "free", category: "자유", title: "어좌 뒤 병풍 — 왜 하필 다섯 봉우리일까", author: "고요한아침", replies: 27, views: 453, date: "2026.04.11" },
  { id: 8, categoryId: "question", category: "질문", title: "영문판 구매 시 해외 배송 가능한가요?", author: "overseas_reader", replies: 5, views: 189, date: "2026.04.10" },
];

const DEFAULT_USERS = [
  {
    id: "user-admin",
    name: "관리자",
    email: "admin@admin.admin",
    passwordHash: hashPassword("admin"),
    isAdmin: true,
    gradeId: "admin",
    profile: null,
    consents: { terms: true, marketing: false, thirdParty: false },
    joinedAt: "2026-04-25T00:00:00.000Z",
  },
];

const ensureUsersSeeded = (users) => {
  const list = Array.isArray(users) ? users.slice() : [];
  if (!list.find((user) => user.email === "admin@admin.admin")) {
    list.unshift(DEFAULT_USERS[0]);
  }
  return list;
};

const normalizeCommunityPost = (post) => {
  const categoryId = post.categoryId
    || ({ "공지": "notice", "자유": "free", "질문": "question", "정보": "info" }[post.category])
    || "free";
  const category = post.category
    || (DEFAULT_CATEGORIES.find((item) => item.id === categoryId)?.label || "자유");
  return {
    ...post,
    categoryId,
    category,
    replies: post.replies ?? 0,
    views: post.views ?? 0,
  };
};

const ensureCommunityPostsSeeded = (posts, legacyUserPosts) => {
  const seeded = Array.isArray(posts) && posts.length
    ? posts.map(normalizeCommunityPost)
    : DEFAULT_COMMUNITY_POSTS.map(normalizeCommunityPost);
  const next = seeded.slice();
  (Array.isArray(legacyUserPosts) ? legacyUserPosts : []).map(normalizeCommunityPost).forEach((post) => {
    if (!next.find((item) => String(item.id) === String(post.id))) {
      next.unshift(post);
    }
  });
  return next;
};

window.BGNJ_STORES = {
  storageVersion: BGNJ_STORAGE_VERSION,
  grades: (() => {
    const raw = _asArray(_lsGet('bgnj_grades', DEFAULT_GRADES), DEFAULT_GRADES.slice());
    const migrated = migrateLegacyGradeColors(raw);
    // 색상이 실제로 바뀐 경우에만 캐시 업데이트(한 번만 발생)
    if (raw.some((g, i) => g && migrated[i] && g.color !== migrated[i].color)) {
      try { _lsSet('bgnj_grades', migrated); } catch {}
    }
    return migrated;
  })(),
  categories: _asArray(_lsGet('bgnj_categories', DEFAULT_CATEGORIES), DEFAULT_CATEGORIES.slice()),
  communityPosts: ensureCommunityPostsSeeded(_lsGet('bgnj_community_posts', []), _lsGet('bgnj_user_posts', [])),
  userPosts: _asArray(_lsGet('bgnj_user_posts', [])),
  comments: _asRecord(_lsGet('bgnj_comments', {})),
  userColumns: _asArray(_lsGet('bgnj_user_columns', [])),
  users: ensureUsersSeeded(_lsGet('bgnj_users', DEFAULT_USERS)),
  session: _asRecord(_lsGet('bgnj_session', null), null),
  bookmarks: _asRecord(_lsGet('bgnj_bookmarks', {})),
  reports: _asArray(_lsGet('bgnj_reports', [])),
  notifications: _asRecord(_lsGet('bgnj_notifications', {})),
  columnEngagement: _asRecord(_lsGet('bgnj_column_engagement', {})),
  lectureOverrides: _asRecord(_lsGet('bgnj_lecture_overrides', {})),
  lectureRegistrations: _asRecord(_lsGet('bgnj_lecture_registrations', {})),
  bankAccount: _asRecord(_lsGet('bgnj_bank_account', { bankName: "", accountNumber: "", holder: "", memo: "입금자명에 강연 신청자 본명 + 강연번호를 남겨 주세요." }), { bankName: "", accountNumber: "", holder: "", memo: "입금자명에 강연 신청자 본명 + 강연번호를 남겨 주세요." }),
  bookOrders: _asArray(_lsGet('bgnj_book_orders', [])),
  bookReviews: _asArray(_lsGet('bgnj_book_reviews', [])),
  tourOverrides: _asRecord(_lsGet('bgnj_tour_overrides', {})),
  tourReservations: _asRecord(_lsGet('bgnj_tour_reservations', {})),
  tourReviews: _asRecord(_lsGet('bgnj_tour_reviews', {})),
  legalDocs: _asRecord(_lsGet('bgnj_legal_docs', {
    privacy: { title: "개인정보 처리방침", body: "<p>뱅기노자 사이트는 회원 가입과 운영을 위해 최소한의 개인정보를 수집·이용합니다.</p><p>이 문서는 관리자 페이지에서 직접 수정할 수 있습니다.</p>", updatedAt: null },
    terms:   { title: "이용약관",          body: "<p>뱅기노자 사이트의 이용약관입니다.</p><p>이 문서는 관리자 페이지에서 직접 수정할 수 있습니다.</p>", updatedAt: null },
  })),
  lectureReviews: _asRecord(_lsGet('bgnj_lecture_reviews', {})),
  auditLog: _asArray(_lsGet('bgnj_audit_log', [])),
  siteContent: _asRecord(_lsGet('bgnj_site_content', {}), {}),
  books: _asArray(_lsGet('bgnj_books', DEFAULT_BOOKS), DEFAULT_BOOKS.slice()),
  faqs: _asArray(_lsGet('bgnj_faqs', [
    { id: 'faq-1', question: "회원가입은 어떻게 하나요?", answer: "상단 로그인 화면에서 '회원가입' 탭을 눌러 이메일과 비밀번호를 등록하면 즉시 가입됩니다.", category: '계정', order: 0 },
    { id: 'faq-2', question: "강연·답사 결제는 어떻게 진행되나요?", answer: "현재는 무통장 입금만 지원합니다. 신청 → 안내 계좌로 입금 → 운영자 입금 확인 → 참가 확정 순으로 진행됩니다.", category: '결제', order: 1 },
    { id: 'faq-3', question: "주문 취소 / 환불은 가능한가요?", answer: "마이페이지에서 입금 확인 전 단계의 주문은 직접 취소할 수 있습니다. 환불 처리는 운영자에게 문의해 주세요.", category: '결제', order: 2 },
  ])),
};
window.BGNJ_SAVE = {
  grades: () => _lsSet('bgnj_grades', window.BGNJ_STORES.grades),
  categories: () => _lsSet('bgnj_categories', window.BGNJ_STORES.categories),
  communityPosts: () => _lsSet('bgnj_community_posts', window.BGNJ_STORES.communityPosts),
  userPosts: () => _lsSet('bgnj_user_posts', window.BGNJ_STORES.userPosts),
  comments: () => _lsSet('bgnj_comments', window.BGNJ_STORES.comments),
  userColumns: () => _lsSet('bgnj_user_columns', window.BGNJ_STORES.userColumns),
  users: () => _lsSet('bgnj_users', window.BGNJ_STORES.users),
  session: () => _lsSet('bgnj_session', window.BGNJ_STORES.session),
  bookmarks: () => _lsSet('bgnj_bookmarks', window.BGNJ_STORES.bookmarks),
  reports: () => _lsSet('bgnj_reports', window.BGNJ_STORES.reports),
  notifications: () => _lsSet('bgnj_notifications', window.BGNJ_STORES.notifications),
  columnEngagement: () => _lsSet('bgnj_column_engagement', window.BGNJ_STORES.columnEngagement),
  lectureOverrides: () => _lsSet('bgnj_lecture_overrides', window.BGNJ_STORES.lectureOverrides),
  lectureRegistrations: () => _lsSet('bgnj_lecture_registrations', window.BGNJ_STORES.lectureRegistrations),
  bankAccount: () => _lsSet('bgnj_bank_account', window.BGNJ_STORES.bankAccount),
  bookOrders: () => _lsSet('bgnj_book_orders', window.BGNJ_STORES.bookOrders),
  bookReviews: () => _lsSet('bgnj_book_reviews', window.BGNJ_STORES.bookReviews),
  tourOverrides: () => _lsSet('bgnj_tour_overrides', window.BGNJ_STORES.tourOverrides),
  tourReservations: () => _lsSet('bgnj_tour_reservations', window.BGNJ_STORES.tourReservations),
  tourReviews: () => _lsSet('bgnj_tour_reviews', window.BGNJ_STORES.tourReviews),
  legalDocs: () => _lsSet('bgnj_legal_docs', window.BGNJ_STORES.legalDocs),
  faqs: () => _lsSet('bgnj_faqs', window.BGNJ_STORES.faqs),
  siteContent: () => _lsSet('bgnj_site_content', window.BGNJ_STORES.siteContent),
  books: () => _lsSet('bgnj_books', window.BGNJ_STORES.books),
  lectureReviews: () => _lsSet('bgnj_lecture_reviews', window.BGNJ_STORES.lectureReviews),
  auditLog: () => _lsSet('bgnj_audit_log', window.BGNJ_STORES.auditLog),
  resetGrades: () => { window.BGNJ_STORES.grades = DEFAULT_GRADES.slice(); _lsSet('bgnj_grades', window.BGNJ_STORES.grades); },
  resetCategories: () => { window.BGNJ_STORES.categories = DEFAULT_CATEGORIES.slice(); _lsSet('bgnj_categories', window.BGNJ_STORES.categories); },
};

window.BGNJ_DB = {
  version: BGNJ_STORAGE_VERSION,
  mode: "local-first",
  entities: ["users", "session", "communityPosts", "comments", "userColumns", "grades", "categories", "bookmarks", "reports", "notifications", "columnEngagement", "lectureOverrides", "lectureRegistrations", "bankAccount", "bookOrders", "bookReviews", "tourOverrides", "tourReservations", "tourReviews", "lectureReviews", "auditLog", "legalDocs", "faqs"],
  note: "현재는 GitHub Pages 정적 배포 환경에 맞춘 local-first 저장 구조입니다. 이후 외부 DB로 교체할 때도 동일한 엔티티 구조를 유지하는 것을 기본 원칙으로 합니다.",
};

// 인증은 Cloudflare Worker(BGNJ_API)에 위임된다.
// 세션 쿠키(bgnj_session, HttpOnly)는 서버가 관리하고, 클라이언트는 사용자 메타를
// localStorage('bgnj_session_user')에 캐시해 첫 페인트 속도를 확보한다.
// API 호출 실패 시에는 캐시를 유지(네트워크 단절 시 사용자 경험 보존).
window.BGNJ_AUTH = {
  hashPassword, // legacy — 외부 코드 호환용. 신규 비밀번호 검증에는 사용되지 않음.
  _SESSION_KEY: 'bgnj_session_user',
  _readCache() {
    try { const raw = localStorage.getItem(this._SESSION_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  _writeCache(user) {
    try {
      if (user) localStorage.setItem(this._SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(this._SESSION_KEY);
    } catch {}
  },
  getSessionUser() {
    return this._readCache();
  },
  // 회원 목록 — 서버에서 최근 가져온 캐시(_usersCache) 우선. 비어있으면 레거시 BGNJ_STORES.users 를 폴백.
  // 관리자 패널은 mount 시 refreshUsers() 를 await 로 호출하는 것이 권장됨.
  listUsers() {
    if (this._usersCache && this._usersCache.length) return this._usersCache.slice();
    return (window.BGNJ_STORES.users || []).slice();
  },
  // 페이지 진입 시 1회 호출 — 서버 쿠키로 진짜 세션 검증 후 캐시 갱신.
  // 401(세션 없음) 이면 좀비 캐시를 즉시 비워 클라이언트가 잘못된 사용자로 보이지 않도록 한다.
  // 그 외 네트워크 단절은 캐시를 유지(오프라인 UX 보존).
  async refreshSession() {
    try {
      const { user } = await window.BGNJ_API.me();
      this._writeCache(user || null);
      return user || null;
    } catch (err) {
      if (err?.status === 401) {
        this._writeCache(null);
        return null;
      }
      return this._readCache();
    }
  },
  // 인증 흐름의 에러를 구조화해 UI 가 코드/원인/가이드를 분리해 노출할 수 있게 한다.
  _classifyAuthError(err, fallback) {
    const kind = err?.kind || 'unknown';
    const code = err?.code || (err?.status ? `HTTP_${err.status}` : 'UNKNOWN');
    const status = err?.status || null;
    const serverMsg = err?.body?.error || null;
    let message = serverMsg || err?.message || fallback;
    let hint = '';
    if (kind === 'network') {
      hint = '인터넷 연결 또는 서버 도달이 차단됐습니다. 네트워크/방화벽/광고차단/CORS 설정을 확인해 주세요. (요청 주소: ' + (err?.url || '?') + ')';
    } else if (status === 401) {
      hint = '이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.';
    } else if (status === 403) {
      hint = '계정이 정지됐거나 접근 권한이 없습니다. 운영자에게 문의해 주세요.';
    } else if (status === 409) {
      hint = '이미 가입된 이메일입니다. 로그인 탭으로 이동해 주세요.';
    } else if (status === 400) {
      hint = '입력값이 올바르지 않습니다. 안내 메시지를 확인해 주세요.';
    } else if (status >= 500) {
      hint = '서버 일시 오류입니다. 잠시 후 다시 시도해 주세요. 반복되면 운영자에게 문의해 주세요.';
    } else if (kind === 'parse') {
      hint = '서버 응답을 해석할 수 없습니다. 운영자에게 문의해 주세요.';
    }
    return { ok: false, code, status, kind, message, hint, url: err?.url || null };
  },
  async signIn({ email, password }) {
    try {
      const { user } = await window.BGNJ_API.login({ email, password });
      this._writeCache(user);
      return { ok: true, user };
    } catch (err) {
      return this._classifyAuthError(err, '로그인 중 오류가 발생했습니다.');
    }
  },
  async signUp(payload) {
    try {
      const { user } = await window.BGNJ_API.signup({
        email: payload.email,
        name: payload.name,
        password: payload.password,
        profile: payload.profile || null,
        consents: payload.consents,
      });
      this._writeCache(user);
      return { ok: true, user };
    } catch (err) {
      return this._classifyAuthError(err, '회원가입 중 오류가 발생했습니다.');
    }
  },
  async signOut() {
    try { await window.BGNJ_API.logout(); } catch {}
    this._writeCache(null);
    return null;
  },

  // ── 관리자 운영 (서버 source of truth) ─────────────────────
  // 모든 회원 변경은 PATCH /api/admin/users/:id 또는 DELETE 로 D1 에 영속.
  // 호출 측은 await 으로 사용. listUsers() 는 _usersCache 를 쓰는데, 변경 후 refreshUsers() 호출 권장.
  _usersCache: [],
  async refreshUsers({ q } = {}) {
    try {
      const { users } = await window.BGNJ_API.admin.users.list({ q });
      this._usersCache = (users || []).map((u) => ({
        id: u.id, email: u.email, name: u.name,
        isAdmin: !!u.is_admin, gradeId: u.grade_id,
        suspended: !!u.suspended,
        suspendedReason: u.suspended_reason || '',
        joinedAt: u.created_at,
        profile: u.profile_json ? (typeof u.profile_json === 'string' ? JSON.parse(u.profile_json) : u.profile_json) : null,
        consents: u.consents_json ? (typeof u.consents_json === 'string' ? JSON.parse(u.consents_json) : u.consents_json) : null,
      }));
      try { window.dispatchEvent(new CustomEvent('bgnj-users-refresh')); } catch {}
    } catch {}
    return this._usersCache.slice();
  },
  async setGrade(userId, gradeId) {
    await window.BGNJ_API.admin.users.update(userId, { gradeId });
    await this.refreshUsers();
    if (window.BGNJ_STORES.session?.id === userId) {
      window.BGNJ_STORES.session = { ...window.BGNJ_STORES.session, gradeId };
      window.BGNJ_SAVE.session();
    }
    return this._usersCache.find((u) => u.id === userId) || null;
  },
  async suspendUser(userId, reason) {
    await window.BGNJ_API.admin.users.update(userId, { suspended: true, suspendedReason: reason || '' });
    await this.refreshUsers();
    if (window.BGNJ_STORES.session?.id === userId) {
      window.BGNJ_STORES.session = null;
      window.BGNJ_SAVE.session();
    }
    return this._usersCache.find((u) => u.id === userId) || null;
  },
  async unsuspendUser(userId) {
    await window.BGNJ_API.admin.users.update(userId, { suspended: false });
    await this.refreshUsers();
    return this._usersCache.find((u) => u.id === userId) || null;
  },
  async removeUser(userId) {
    await window.BGNJ_API.admin.users.remove(userId);
    await this.refreshUsers();
    if (window.BGNJ_STORES.session?.id === userId) {
      window.BGNJ_STORES.session = null;
      window.BGNJ_SAVE.session();
    }
  },
  async toggleAdmin(userId) {
    const before = this._usersCache.find((u) => u.id === userId);
    if (!before) return null;
    await window.BGNJ_API.admin.users.update(userId, { isAdmin: !before.isAdmin });
    await this.refreshUsers();
    const next = this._usersCache.find((u) => u.id === userId) || null;
    if (window.BGNJ_STORES.session?.id === userId && next) {
      window.BGNJ_STORES.session = { ...window.BGNJ_STORES.session, isAdmin: next.isAdmin };
      window.BGNJ_SAVE.session();
    }
    return next;
  },
  getActivity(userId) {
    if (!userId) return null;
    const posts = (window.BGNJ_COMMUNITY?.listPosts?.() || []).filter((p) => p.authorId === userId);
    const comments = Object.values(window.BGNJ_STORES.comments || {})
      .reduce((sum, list) => sum + (Array.isArray(list) ? list.filter((c) => c.authorId === userId).length : 0), 0);
    const bookOrders = (window.BGNJ_BOOK_ORDERS?.listMine?.(userId) || []);
    const lectures = (window.BGNJ_LECTURES?.listMyRegistrations?.(userId) || []);
    const tours = (window.BGNJ_TOURS?.listMyReservations?.(userId) || []);
    const bookmarks = (window.BGNJ_COMMUNITY?.getBookmarks?.(userId) || []);
    const notifications = (window.BGNJ_COMMUNITY?.listNotifications?.(userId) || []);
    return {
      postCount: posts.length,
      posts,
      commentCount: comments,
      bookOrders,
      lectures,
      tours,
      bookmarkCount: bookmarks.length,
      notifications,
    };
  },
  // (제거됨) 레거시 로컬 signUp — 위쪽의 async signUp(=Cloudflare Worker 호출) 을 덮어써서
  // 모든 가입이 localStorage 에만 저장되고 D1 에 도달하지 못했던 버그의 원인. 위쪽 정의만 사용.
};

// 서버(D1) 게시글을 UI 형식으로 매핑.
const _serverPostToUi = (p) => ({
  id: p.id,
  categoryId: p.category_id || p.categoryId,
  category: p.category,
  prefix: p.prefix || null,
  title: p.title,
  body: p.body || '',
  author: p.author,
  authorId: p.author_id || p.authorId,
  views: Number(p.views || 0),
  replies: Number(p.replies || 0),
  date: (p.created_at || p.createdAt || '').slice(0, 10).replace(/-/g, '.'),
  createdAt: p.created_at || p.createdAt,
  _remote: true,
});

window.BGNJ_COMMUNITY = {
  // 서버에서 받은 게시글 캐시. refreshPosts()가 채운다.
  // listPosts()는 캐시가 비어있으면 로컬 시드로 폴백.
  _serverPosts: [],
  _serverLoaded: false,

  listPosts() {
    if (this._serverLoaded) {
      // 서버 게시글 + 로컬에만 있는(아직 동기화 못 한) 글이 있다면 합쳐 보여준다 (서버 우선).
      const serverIds = new Set(this._serverPosts.map((p) => String(p.id)));
      const localOnly = (window.BGNJ_STORES.communityPosts || [])
        .filter((p) => !serverIds.has(String(p.id)));
      return [...this._serverPosts, ...localOnly]
        .slice()
        .sort((a, b) => String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date)));
    }
    return (window.BGNJ_STORES.communityPosts || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  },
  getPost(postId) {
    return this.listPosts().find((post) => String(post.id) === String(postId)) || null;
  },
  // 서버에서 게시글 목록을 갱신해 캐시에 저장하고 'bgnj-posts-refresh' 이벤트를 발화한다.
  // CommunityPage가 useEffect로 구독해 재렌더한다.
  async refreshPosts(opts = {}) {
    try {
      const { posts } = await window.BGNJ_API.posts.list(opts);
      this._serverPosts = (posts || []).map(_serverPostToUi);
      this._serverLoaded = true;
      try { window.dispatchEvent(new CustomEvent('bgnj-posts-refresh')); } catch {}
    } catch {
      // 서버 실패 — 캐시 유지(로컬 폴백)
    }
    return this._serverPosts;
  },
  savePosts(posts) {
    window.BGNJ_STORES.communityPosts = posts.map(normalizeCommunityPost);
    window.BGNJ_SAVE.communityPosts();
  },
  // 동기 createPost — 호환용. 가능하면 createPostRemote 사용 권장.
  createPost(payload) {
    const nextPost = normalizeCommunityPost({
      ...payload,
      id: `post-${Date.now()}`,
      _userCreated: true,
      _new: true,
    });
    this.savePosts([nextPost, ...this.listPosts().filter((p) => !p._remote)]);
    if (payload.authorId) {
      try { window.BGNJ_GRADE_PROMO?.maybePromote(payload.authorId); } catch {}
    }
    return nextPost;
  },
  // 비동기 — 서버에 INSERT 후 캐시 갱신.
  async createPostRemote(payload) {
    const { id } = await window.BGNJ_API.posts.create({
      categoryId: payload.categoryId,
      title: payload.title,
      body: payload.body || '',
      prefix: payload.prefix || null,
    });
    await this.refreshPosts();
    return this.getPost(id);
  },
  async deletePostRemote(postId) {
    await window.BGNJ_API.posts.remove(postId);
    await this.refreshPosts();
  },
  async updatePostRemote(postId, patch) {
    const apiPatch = {};
    if ('title' in patch) apiPatch.title = patch.title;
    if ('body' in patch) apiPatch.body = patch.body;
    if ('prefix' in patch) apiPatch.prefix = patch.prefix;
    if ('categoryId' in patch) apiPatch.category_id = patch.categoryId;
    await window.BGNJ_API.posts.update(postId, apiPatch);
    await this.refreshPosts();
    return this.getPost(postId);
  },
  updatePost(postId, patch) {
    // 서버 캐시 항목이면 서버 업데이트로 위임 (fire-and-forget).
    const serverPost = this._serverPosts.find((p) => String(p.id) === String(postId));
    if (serverPost) {
      this.updatePostRemote(postId, patch).catch(() => {});
      return { ...serverPost, ...patch };
    }
    const posts = this.listPosts().map((post) => (
      String(post.id) === String(postId)
        ? normalizeCommunityPost({ ...post, ...patch, updatedAt: new Date().toISOString() })
        : post
    ));
    this.savePosts(posts.filter((p) => !p._remote));
    return this.getPost(postId);
  },
  deletePost(postId) {
    const targetPost = this.getPost(postId);
    const authorId = targetPost?.authorId || null;
    const serverPost = this._serverPosts.find((p) => String(p.id) === String(postId));
    if (serverPost) {
      this.deletePostRemote(postId).catch(() => {});
      this._serverPosts = this._serverPosts.filter((p) => String(p.id) !== String(postId));
      try { window.dispatchEvent(new CustomEvent('bgnj-posts-refresh')); } catch {}
      if (authorId) { try { window.BGNJ_GRADE_PROMO?.maybeDemote(authorId); } catch {} }
      return;
    }
    const nextPosts = this.listPosts().filter((post) => String(post.id) !== String(postId));
    this.savePosts(nextPosts.filter((p) => !p._remote));
    delete window.BGNJ_STORES.comments[postId];
    window.BGNJ_SAVE.comments();
    if (authorId) { try { window.BGNJ_GRADE_PROMO?.maybeDemote(authorId); } catch {} }
  },
  incrementViews(postId) {
    const post = this.getPost(postId);
    if (!post) return null;
    return this.updatePost(postId, { views: (post.views || 0) + 1 });
  },
  // 서버 댓글 캐시 (postId → 배열). refreshComments가 채운다.
  _commentsCache: {},
  async refreshComments(postId) {
    try {
      const { comments } = await window.BGNJ_API.posts.comments.list(postId);
      this._commentsCache[String(postId)] = (comments || []).map((c) => ({
        id: c.id,
        postId: c.post_id,
        parentId: c.parent_id,
        body: c.body,
        authorId: c.author_id,
        author: c.author,
        createdAt: c.created_at,
      }));
      try { window.dispatchEvent(new CustomEvent('bgnj-comments-refresh', { detail: { postId } })); } catch {}
    } catch {}
    return this._commentsCache[String(postId)] || [];
  },
  getComments(postId) {
    // 서버 게시글이면 서버 캐시 우선, 로컬 게시글이면 로컬 저장소.
    const post = this.getPost(postId);
    if (post && post._remote) return (this._commentsCache[String(postId)] || []).slice();
    return (window.BGNJ_STORES.comments[String(postId)] || []).slice();
  },
  saveComments(postId, comments) {
    window.BGNJ_STORES.comments[String(postId)] = comments.slice();
    window.BGNJ_SAVE.comments();
    const post = this.getPost(postId);
    if (post && !post._remote) {
      this.updatePost(postId, { replies: comments.length });
    }
  },
  async addCommentRemote(postId, payload) {
    await window.BGNJ_API.posts.comments.create(postId, { body: payload.body, parentId: payload.parentId });
    await this.refreshComments(postId);
    if (payload.authorId) {
      try { window.BGNJ_GRADE_PROMO?.maybePromote(payload.authorId); } catch {}
    }
    return this._commentsCache[String(postId)] || [];
  },
  addComment(postId, payload) {
    const post = this.getPost(postId);
    if (post && post._remote) {
      // 서버 게시글 — 비동기로 위임 (UI에서 await 가능). 동기 호출자는 즉시 캐시에 prepend로 임시 표시.
      const optimistic = { ...payload, id: `tmp-${Date.now()}`, createdAt: new Date().toISOString() };
      const arr = this._commentsCache[String(postId)] || [];
      this._commentsCache[String(postId)] = [...arr, optimistic];
      this.addCommentRemote(postId, payload).catch(() => {});
      try { window.dispatchEvent(new CustomEvent('bgnj-comments-refresh', { detail: { postId } })); } catch {}
      return this._commentsCache[String(postId)];
    }
    const nextComments = [...this.getComments(postId), payload];
    this.saveComments(postId, nextComments);
    if (payload.authorId) {
      try { window.BGNJ_GRADE_PROMO?.maybePromote(payload.authorId); } catch {}
    }
    return nextComments;
  },
  deleteComment(postId, commentId) {
    const post = this.getPost(postId);
    // 댓글 작성자 추적 — 강등 판단용.
    const allComments = this.getComments(postId);
    const removed = allComments.find((c) => String(c.id) === String(commentId));
    const authorId = removed?.authorId || null;
    if (post && post._remote) {
      // 서버 댓글 삭제 API는 아직 없음 — 로컬 캐시에서만 제거(다음 새로고침 시 복원될 수 있음).
      const arr = this._commentsCache[String(postId)] || [];
      this._commentsCache[String(postId)] = arr.filter((c) => String(c.id) !== String(commentId));
      try { window.dispatchEvent(new CustomEvent('bgnj-comments-refresh', { detail: { postId } })); } catch {}
      if (authorId) { try { window.BGNJ_GRADE_PROMO?.maybeDemote(authorId); } catch {} }
      return this._commentsCache[String(postId)];
    }
    const nextComments = allComments.filter((comment) => String(comment.id) !== String(commentId));
    this.saveComments(postId, nextComments);
    if (authorId) { try { window.BGNJ_GRADE_PROMO?.maybeDemote(authorId); } catch {} }
    return nextComments;
  },
  exportCsv() {
    const header = ["id", "category", "title", "author", "date", "views", "replies", "likes"];
    const rows = this.listPosts().map((post) => [
      post.id,
      post.category,
      post.title,
      post.author,
      post.date,
      post.views || 0,
      post.replies || 0,
      Array.isArray(post.likes) ? post.likes.length : 0,
    ]);
    return [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
  },

  // ── 좋아요 (per-post user list) ───────────────────────────────────
  getLikes(postId) {
    const post = this.getPost(postId);
    return Array.isArray(post?.likes) ? post.likes.slice() : [];
  },
  hasLiked(postId, userId) {
    return !!userId && this.getLikes(postId).includes(userId);
  },
  // 메모리 캐시에서만 게시글 likes 를 갱신 — localStorage 미터치.
  _patchLikesInMemory(postId, likes) {
    const sp = this._serverPosts || [];
    const idxS = sp.findIndex((p) => String(p.id) === String(postId));
    if (idxS >= 0) sp[idxS] = { ...sp[idxS], likes };
    const cp = window.BGNJ_STORES.communityPosts || [];
    const idxC = cp.findIndex((p) => String(p.id) === String(postId));
    if (idxC >= 0) cp[idxC] = { ...cp[idxC], likes };
  },
  // 좋아요 — POST /api/posts/:id/likes. 응답에 likes 배열 동봉(1회 호출).
  // 낙관적 UI 는 메모리 캐시만 갱신. 서버 응답으로 진실값 교정. localStorage 미사용.
  async toggleLike(postId, userId) {
    if (!userId) return null;
    const post = this.getPost(postId);
    const cur = Array.isArray(post?.likes) ? post.likes : [];
    const optimistic = cur.includes(userId) ? cur.filter((id) => id !== userId) : [...cur, userId];
    this._patchLikesInMemory(postId, optimistic);
    try { window.dispatchEvent(new CustomEvent('bgnj-posts-refresh')); } catch {}
    try {
      const res = await window.BGNJ_API.likes.toggle(postId);
      const arr = Array.isArray(res?.likes) ? res.likes : optimistic;
      this._patchLikesInMemory(postId, arr);
      try { window.dispatchEvent(new CustomEvent('bgnj-posts-refresh')); } catch {}
      return arr;
    } catch (err) {
      this._patchLikesInMemory(postId, cur);
      try { window.dispatchEvent(new CustomEvent('bgnj-posts-refresh')); } catch {}
      throw err;
    }
  },

  // ── 북마크 (서버 source of truth) ─────────────────────────────────
  // 메모리 캐시 _bookmarks 가 사용자별 postId 배열을 보관. 서버 toggle 후 갱신.
  _bookmarks: {},
  async refreshBookmarks(userId) {
    if (!userId) return [];
    try {
      const { bookmarks } = await window.BGNJ_API.bookmarks.mine();
      this._bookmarks[userId] = (bookmarks || []).map((b) => b.post_id);
    } catch {}
    return this._bookmarks[userId] || [];
  },
  getBookmarks(userId) {
    if (!userId) return [];
    return Array.isArray(this._bookmarks[userId]) ? this._bookmarks[userId].slice() : [];
  },
  isBookmarked(userId, postId) {
    return this.getBookmarks(userId).includes(postId);
  },
  async toggleBookmark(userId, postId) {
    if (!userId) return [];
    await window.BGNJ_API.bookmarks.toggle(postId);
    return this.refreshBookmarks(userId);
  },
  listBookmarkedPosts(userId) {
    return this.getBookmarks(userId).map((id) => this.getPost(id)).filter(Boolean);
  },

  // ── 신고 큐 (서버 source of truth) ────────────────────────────────
  _reports: [],
  async refreshReports({ status } = {}) {
    try {
      const { reports } = await window.BGNJ_API.admin.reports.list({ status });
      this._reports = reports || [];
    } catch {}
    return this._reports.slice();
  },
  async addReport({ postId, postTitle, reporterId, reporterName, reason }) {
    try {
      await window.BGNJ_API.reports.create({ postId, postTitle, reporterName, reason });
    } catch (err) {
      throw err;
    }
    return { ok: true };
  },
  listReports(filter) {
    const all = this._reports.slice();
    if (!filter || filter === "all") return all;
    return all.filter((r) => r.status === filter);
  },
  async updateReportStatus(id, status) {
    await window.BGNJ_API.admin.reports.update(id, { status });
    await this.refreshReports();
    return this._reports.find((r) => r.id === id) || null;
  },
  countOpenReports() {
    return this._reports.filter((r) => r.status === "open").length;
  },

  // ── 알림 (서버 source of truth) ───────────────────────────────────
  _notifications: {},
  async refreshNotifications(userId) {
    if (!userId) return [];
    try {
      const { notifications } = await window.BGNJ_API.notifications.list();
      this._notifications[userId] = (notifications || []).map((n) => ({
        id: n.id, type: n.type, message: n.message,
        fromName: n.from_name, postId: n.post_id, postTitle: n.post_title,
        lectureId: n.lecture_id, tourId: n.tour_id,
        read: !!n.read, createdAt: n.created_at,
      }));
      try { window.dispatchEvent(new CustomEvent('bgnj-notifications-refresh', { detail: { userId } })); } catch {}
    } catch {}
    return this._notifications[userId] || [];
  },
  // 알림 — 서버가 행위 시점(댓글/등록/주문 등) 에 자동 발급해야 함. 클라이언트는 발급 권한 없음.
  // 호환을 위해 no-op 으로 둠. 호출자는 서버 측 핸들러가 알림을 생성하도록 의존해야 한다.
  addNotification(_userId, _payload) {
    // intentional no-op: notifications must be created server-side as a side-effect
    // of the originating action. Returning null preserves existing call sites.
    return null;
  },
  listNotifications(userId) {
    if (!userId) return [];
    return Array.isArray(this._notifications[userId]) ? this._notifications[userId].slice() : [];
  },
  unreadNotificationCount(userId) {
    return this.listNotifications(userId).filter((n) => !n.read).length;
  },
  markNotificationRead(userId, id) {
    if (!userId) return [];
    const list = this._notifications[userId] || [];
    this._notifications[userId] = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    try { window.BGNJ_API.notifications.markRead(id).catch(() => {}); } catch {}
    return this._notifications[userId];
  },
  markAllNotificationsRead(userId) {
    if (!userId) return [];
    const list = this._notifications[userId] || [];
    this._notifications[userId] = list.map((n) => ({ ...n, read: true }));
    try { window.BGNJ_API.notifications.markAllRead().catch(() => {}); } catch {}
    return this._notifications[userId];
  },
  clearNotifications(userId) {
    if (!userId) return [];
    this._notifications[userId] = [];
    return [];
  },
};

// === 칼럼(BGNJ_COLUMNS) helper ===========================================
// 운영 정책:
//   - userColumns 저장소가 콘텐츠(본문/메타) 단일 출처. 시드 칼럼은 BANGINOJA_DATA.columns.
//   - status: 'draft' | 'scheduled' | 'published' (시드는 항상 published).
//   - 좋아요/조회수는 columnEngagement 맵으로 분리 — 시드 칼럼도 동일하게 저장.
//   - 댓글은 BGNJ_COMMUNITY.comments 저장소를 `col-{id}` 키로 재사용.
// === 칼럼(BGNJ_COLUMNS) — 서버(D1.user_columns) source of truth =============
window.BGNJ_COLUMNS = {
  _columns: [],
  _toColumn(r) {
    return {
      id: r.id, authorId: r.author_id, author: r.author_name,
      title: r.title, excerpt: r.excerpt,
      body: r.body ? (typeof r.body === 'string' ? { text: r.body, html: r.body } : r.body) : null,
      category: r.category, coverUrl: r.cover_url,
      status: r.status || 'published',
      scheduledAt: r.scheduled_at, publishAt: r.scheduled_at,
      readMinutes: r.read_minutes,
      views: r.views || 0,
      likes: r.likes_json ? (typeof r.likes_json === 'string' ? JSON.parse(r.likes_json) : r.likes_json) : [],
      createdAt: r.created_at, updatedAt: r.updated_at,
    };
  },
  estimateReadTime(text) {
    const len = String(text || '').length;
    const minutes = Math.max(3, Math.ceil(len / 600));
    return `${minutes}분`;
  },
  async refresh({ admin } = {}) {
    try {
      const { columns } = await window.BGNJ_API.columns.list({ includeAll: !!admin });
      this._columns = (columns || []).map((c) => this._toColumn(c));
      try { window.dispatchEvent(new CustomEvent('bgnj-columns-refresh')); } catch {}
    } catch {}
    return this._columns.slice();
  },
  getLikes(id) { return (this._columns.find((c) => String(c.id) === String(id))?.likes) || []; },
  hasLiked(id, userId) { return !!userId && this.getLikes(id).includes(userId); },
  toggleLike(_id, _userId) {
    // 칼럼 좋아요는 별도 D1 테이블 없이 user_columns.likes_json 으로 관리.
    // 현재는 공개 토글 endpoint 가 없으므로 추후 사이클에서 추가. (no-op)
    return null;
  },
  getViews(id) { return this._columns.find((c) => String(c.id) === String(id))?.views || 0; },
  incrementViews(_id) {
    // 조회수 카운트는 서버 측 PATCH 가 필요. 지금은 렌더만 동작.
    return 0;
  },
  listAll() { return this._columns.slice(); },
  listPublic() {
    const userPub = this._columns.filter((c) => (c.status || 'published') === 'published');
    const seed = (window.BANGINOJA_DATA?.columns || []).map((c) => ({ ...c, status: 'published' }));
    return [...userPub, ...seed];
  },
  getColumn(id) {
    const fromUser = this._columns.find((c) => String(c.id) === String(id));
    if (fromUser) return { ...fromUser };
    const seed = (window.BANGINOJA_DATA?.columns || []).find((c) => String(c.id) === String(id));
    return seed ? { ...seed, status: 'published' } : null;
  },
  async saveColumn(payload) {
    const exists = payload.id && this._columns.find((c) => String(c.id) === String(payload.id));
    const body = {
      title: payload.title, excerpt: payload.excerpt,
      body: typeof payload.body === 'object' ? (payload.body?.text || '') : (payload.body || ''),
      category: payload.category, coverUrl: payload.coverUrl,
      status: payload.status, scheduledAt: payload.publishAt || payload.scheduledAt,
      readMinutes: Number(payload.readMinutes || 3),
    };
    if (exists) {
      await window.BGNJ_API.columns.update(payload.id, body);
    } else {
      await window.BGNJ_API.columns.create(body);
    }
    await this.refresh({ admin: true });
    return payload;
  },
  async deleteColumn(id) {
    await window.BGNJ_API.columns.remove(id);
    await this.refresh({ admin: true });
  },
  searchPublic({ query = '', category = '전체' } = {}) {
    const q = String(query || '').trim().toLowerCase();
    return this.listPublic().filter((c) => {
      if (category !== '전체' && c.category !== category) return false;
      if (!q) return true;
      const inTitle = String(c.title || '').toLowerCase().includes(q);
      const inExcerpt = String(c.excerpt || '').toLowerCase().includes(q);
      const inBodyText = String(c.body?.text || c.body || '').toLowerCase().includes(q);
      return inTitle || inExcerpt || inBodyText;
    });
  },
  // 댓글은 BGNJ_COMMUNITY 저장소 재사용 (`col-{id}` 키)
  listComments(id) { return window.BGNJ_COMMUNITY.getComments(`col-${id}`); },
  addComment(id, payload) { return window.BGNJ_COMMUNITY.addComment(`col-${id}`, payload); },
  deleteComment(id, commentId) { return window.BGNJ_COMMUNITY.deleteComment(`col-${id}`, commentId); },
};

// === 강연(BGNJ_LECTURES) helper — 서버(D1.lectures + lecture_registrations) source of truth ===
window.BGNJ_LECTURES = {
  _lectures: [],
  _myRegs: [],
  _registrationsByLecture: {}, // 관리자가 강연별 신청 목록을 fetch 한 결과 캐시
  _reviewsByLecture: {},
  _toLecture(r) {
    return {
      id: r.id, title: r.title, topic: r.topic, venue: r.venue, host: r.host,
      next: r.next, startsAt: r.starts_at, durationMinutes: r.duration_minutes,
      capacity: r.capacity, price: r.price, note: r.note, hidden: !!r.hidden,
    };
  },
  async refresh({ admin, includeHidden } = {}) {
    try {
      const { lectures } = await window.BGNJ_API.lectures.list({ includeHidden: !!includeHidden });
      this._lectures = (lectures || []).map((l) => this._toLecture(l));
      try { window.dispatchEvent(new CustomEvent('bgnj-lectures-refresh')); } catch {}
    } catch {}
    return this._lectures.slice();
  },
  async refreshMine() {
    try {
      const { registrations } = await window.BGNJ_API.lectures.mineRegistrations();
      this._myRegs = (registrations || []).map((r) => ({
        id: r.id, lectureId: r.lecture_id, userId: r.user_id, name: r.user_name,
        email: r.user_email, phone: r.user_phone, status: r.status,
        paid: r.status === 'confirmed', count: 1, price: r.price || 0,
        createdAt: r.created_at, paidAt: r.paid_at, cancelledAt: r.cancelled_at,
        lecture: { id: r.lecture_id, title: r.title, topic: r.title, startsAt: r.starts_at, venue: r.venue, price: r.price },
      }));
    } catch {}
    return this._myRegs.slice();
  },
  listAll(opts = {}) {
    if (opts.includeHidden) return this._lectures.slice();
    return this._lectures.filter((l) => !l.hidden);
  },
  getLecture(id) { return this._lectures.find((l) => String(l.id) === String(id)) || null; },
  async saveLecture(payload) {
    if (payload.id && this.getLecture(payload.id)) {
      await window.BGNJ_API.lectures.update(payload.id, payload);
    } else {
      await window.BGNJ_API.lectures.create(payload);
    }
    await this.refresh({ includeHidden: true });
    return this.getLecture(payload.id);
  },
  async setHidden(id, hidden) {
    await window.BGNJ_API.lectures.update(id, { hidden: !!hidden });
    await this.refresh({ includeHidden: true });
  },
  async deleteLecture(id) {
    await window.BGNJ_API.lectures.remove(id);
    await this.refresh({ includeHidden: true });
  },
  // ── 신청 ──
  listRegistrations(lectureId) { return (this._registrationsByLecture[String(lectureId)] || []).slice(); },
  async refreshRegistrations(_lectureId) {
    // 현재 Worker 에 강연별 전체 신청 목록 endpoint 가 없음 — listAll 한 번에 조회 후 그룹.
    // 다음 사이클에서 GET /api/lectures/:id/registrations 추가 권장.
    return [];
  },
  getSeats(lectureId) {
    const lecture = this.getLecture(lectureId);
    const cap = lecture?.capacity || 0;
    const list = this.listRegistrations(lectureId);
    const active = list.filter((r) => r.status !== 'cancelled');
    const taken = active.filter((r) => r.status !== 'waitlist').length;
    const waitlist = active.filter((r) => r.status === 'waitlist').length;
    return { capacity: cap, taken, waitlist, remaining: Math.max(0, cap - taken) };
  },
  hasUserRegistered(lectureId, userId) {
    if (!userId) return null;
    return this._myRegs.find((r) => String(r.lectureId) === String(lectureId) && r.status !== 'cancelled') || null;
  },
  async register(lectureId, payload) {
    const userId = payload.userId;
    if (!userId) return { ok: false, message: "회원 가입 후 로그인해 주세요." };
    try {
      const res = await window.BGNJ_API.lectures.register(lectureId, { phone: payload.phone || '' });
      await this.refreshMine();
      return { ok: true, registration: res };
    } catch (err) {
      return { ok: false, message: err?.body?.error || err?.message || '신청 실패' };
    }
  },
  async cancelRegistration(_lectureId, registrationId) {
    await window.BGNJ_API.lectures.cancelRegistration(registrationId);
    await this.refreshMine();
    return null;
  },
  async confirmPayment(_lectureId, registrationId) {
    await window.BGNJ_API.lectures.patchRegistration(registrationId, { status: 'confirmed' });
    await this.refreshMine();
    return null;
  },
  async unconfirmPayment(_lectureId, registrationId) {
    await window.BGNJ_API.lectures.patchRegistration(registrationId, { status: 'pending_payment' });
    await this.refreshMine();
  },
  async requestRefund(_lectureId, registrationId, reason) {
    await window.BGNJ_API.lectures.patchRegistration(registrationId, { status: 'refund_requested', refundReason: reason });
    await this.refreshMine();
    return { ok: true };
  },
  async approveRefund(_lectureId, registrationId) {
    await window.BGNJ_API.lectures.patchRegistration(registrationId, { status: 'cancelled' });
    await this.refreshMine();
  },
  async rejectRefund(_lectureId, registrationId, _adminNote) {
    await window.BGNJ_API.lectures.patchRegistration(registrationId, { status: 'confirmed' });
    await this.refreshMine();
  },
  listMyRegistrations(_userId) { return this._myRegs.slice(); },
  // ── .ics ──
  generateIcs(lecture) {
    if (!lecture?.startsAt) return null;
    const start = new Date(lecture.startsAt);
    const dur = (lecture.durationMinutes || 90) * 60 * 1000;
    const end = new Date(start.getTime() + dur);
    const fmt = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    };
    const escape = (s) => String(s || '').replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
    return [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//BANGINOJA//Lecture//KO','CALSCALE:GREGORIAN','METHOD:PUBLISH',
      'BEGIN:VEVENT', `UID:lecture-${lecture.id}@bgnj`, `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:${escape(lecture.topic || lecture.title)}`, `LOCATION:${escape(lecture.venue || '')}`,
      `DESCRIPTION:${escape((lecture.host ? `진행: ${lecture.host}\n` : '') + (lecture.note || ''))}`,
      'END:VEVENT','END:VCALENDAR',
    ].join('\r\n');
  },
  downloadIcs(lectureId) {
    const lecture = this.getLecture(lectureId);
    const ics = this.generateIcs(lecture);
    if (!ics) return false;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `lecture-${lecture.id}.ics`; a.click();
    URL.revokeObjectURL(url);
    return true;
  },
  // ── 후기 ──
  async refreshReviews(lectureId) {
    try {
      const { reviews } = await window.BGNJ_API.lectures.reviews.list(lectureId);
      this._reviewsByLecture[String(lectureId)] = reviews || [];
    } catch {}
    return this._reviewsByLecture[String(lectureId)] || [];
  },
  listReviews(lectureId) { return (this._reviewsByLecture[String(lectureId)] || []).slice(); },
  canReview(lectureId, userId) {
    if (!userId) return false;
    return this._myRegs.some((r) => String(r.lectureId) === String(lectureId) && r.status === 'confirmed');
  },
  async addReview(lectureId, payload) {
    try {
      await window.BGNJ_API.lectures.reviews.create(lectureId, { rating: payload.rating, body: payload.text });
      await this.refreshReviews(lectureId);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err?.body?.error || err?.message };
    }
  },
  async deleteReview(_lectureId, reviewId) {
    await window.BGNJ_API.lectures.reviews.remove(reviewId);
    await this.refreshReviews(_lectureId);
  },
  // ── 계좌번호 ──────────────────────────────────────────────────
  // 입금 계좌 — 서버(D1.bank_account) source of truth.
  _bank: null,
  async refreshBankAccount() {
    try {
      const { bankAccount } = await window.BGNJ_API.bankAccount.get();
      this._bank = bankAccount ? {
        bankName: bankAccount.bank_name || '',
        accountNumber: bankAccount.account_number || '',
        holder: bankAccount.holder || '',
        memo: bankAccount.memo || '',
      } : null;
    } catch {}
    return this._bank || {};
  },
  getBankAccount() { return { ...(this._bank || {}) }; },
  async saveBankAccount(payload) {
    await window.BGNJ_API.bankAccount.put(payload);
    return this.refreshBankAccount();
  },
};

// === 책 주문(BGNJ_BOOK_ORDERS) helper — 서버(D1.book_orders) source of truth ===
window.BGNJ_BOOK_ORDERS = {
  ORDER_STATUSES: ['pending_payment', 'paid', 'shipped', 'delivered', 'refund_requested', 'cancelled'],
  _orders: [],
  _reviews: [], // 책별 리뷰는 서버에서 책 ID 기준 fetch (BGNJ_BOOKS.refreshReviews)
  _toOrder(r) {
    return {
      id: r.id,
      orderNo: r.order_no || r.orderNo,
      userId: r.user_id,
      version: r.version,
      qty: r.qty,
      subtotal: r.subtotal || r.price * r.qty,
      shipping: r.shipping || 0,
      total: r.total || (r.subtotal + (r.shipping || 0)) || (r.price * r.qty),
      unit: r.price,
      recipient: r.recipient || r.buyer_name,
      phone: r.phone || r.buyer_phone,
      address: r.address,
      addressDetail: r.address_detail,
      zip: r.zip,
      memo: r.memo,
      status: r.status,
      paid: r.status !== 'pending_payment' && r.status !== 'cancelled',
      tracking: r.tracking || r.tracking_no,
      createdAt: r.created_at,
      paidAt: r.paid_at,
      shippedAt: r.shipped_at,
      deliveredAt: r.delivered_at,
      cancelledAt: r.cancelled_at,
      refundStatus: r.refund_status,
    };
  },
  async refreshMine() {
    try {
      const { orders } = await window.BGNJ_API.bookOrders.mine();
      this._orders = (orders || []).map((o) => this._toOrder(o));
      try { window.dispatchEvent(new CustomEvent('bgnj-orders-refresh')); } catch {}
    } catch {}
    return this._orders.slice();
  },
  async refreshAll({ status } = {}) {
    try {
      const { orders } = await window.BGNJ_API.bookOrders.adminList({ status });
      this._orders = (orders || []).map((o) => this._toOrder(o));
      try { window.dispatchEvent(new CustomEvent('bgnj-orders-refresh')); } catch {}
    } catch {}
    return this._orders.slice();
  },
  listAll() { return this._orders.slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))); },
  listByStatus(status) {
    if (!status || status === 'all') return this.listAll();
    return this.listAll().filter((o) => o.status === status);
  },
  listMine(userId) {
    if (!userId) return [];
    return this.listAll().filter((o) => o.userId === userId);
  },
  getOrder(id) { return this.listAll().find((o) => o.id === id) || null; },
  countOpenOrders() { return this._orders.filter((o) => o.status === 'pending_payment').length; },
  async createOrder(payload) {
    if (!payload.userId) return { ok: false, message: "회원 가입 후 로그인해 주세요." };
    if (!payload.recipient || !payload.phone || !payload.address) {
      return { ok: false, message: "받는 분, 연락처, 주소는 필수입니다." };
    }
    const book = window.BANGINOJA_DATA?.book;
    if (!book) return { ok: false, message: "책 정보가 없습니다." };
    const qty = Math.max(1, Number(payload.qty) || 1);
    const version = payload.version === 'EN' ? 'EN' : 'KR';
    const unit = version === 'EN' ? book.priceEN : book.priceKR;
    try {
      const { id, orderNo } = await window.BGNJ_API.bookOrders.create({
        bookId: 'kingsroad', version, qty, price: unit,
        recipient: payload.recipient, phone: payload.phone,
        address: payload.address, addressDetail: payload.addressDetail || '',
        zip: payload.zip || '', memo: payload.memo || '',
      });
      await this.refreshMine();
      const order = this._orders.find((o) => o.id === id);
      return { ok: true, order: order || { id, orderNo, userId: payload.userId, version, qty } };
    } catch (err) {
      return { ok: false, message: err?.body?.error || err?.message || '주문 생성 실패' };
    }
  },
  async _patch(id, body) {
    await window.BGNJ_API.bookOrders.update(id, body);
    await this.refreshAll();
    return this.getOrder(id);
  },
  async confirmPayment(id) { return this._patch(id, { status: 'paid' }); },
  async unconfirmPayment(id) { return this._patch(id, { status: 'pending_payment' }); },
  async markShipped(id, tracking) { return this._patch(id, { status: 'shipped', tracking: tracking || '' }); },
  async markDelivered(id) { return this._patch(id, { status: 'delivered' }); },
  async cancelOrder(id) { return this._patch(id, { status: 'cancelled' }); },
  async requestRefund(id, reason) {
    const order = this.getOrder(id);
    if (!order) return { ok: false, message: '주문을 찾을 수 없습니다.' };
    if (!['paid', 'shipped'].includes(order.status)) return { ok: false, message: '입금 확인 또는 배송 중 단계에서만 환불 신청이 가능합니다.' };
    await window.BGNJ_API.bookOrders.update(id, { status: 'refund_requested', refundReason: String(reason || '').trim() });
    await this.refreshMine();
    return { ok: true, order: this.getOrder(id) };
  },
  async approveRefund(id) { return this._patch(id, { status: 'cancelled' }); },
  async rejectRefund(id, adminNote) { return this._patch(id, { status: 'paid', refundAdminNote: String(adminNote || '').trim() }); },

  generateReceipt(id) {
    const order = this.getOrder(id);
    if (!order) return null;
    const bank = (window.BGNJ_LECTURES?.getBankAccount?.()) || {};
    const formatPrice = (p) => `${(p || 0).toLocaleString()}원`;
    const lines = [
      '╔════════════════════════════════════════════╗',
      '║         뱅기노자 · BANGINOJA 주문 영수증     ║',
      '╚════════════════════════════════════════════╝',
      '',
      `주문번호      ${order.orderNo}`,
      `주문 일시     ${new Date(order.createdAt).toLocaleString('ko-KR')}`,
      `상태          ${ ({pending_payment:'입금 대기', paid:'입금 확인', shipped:'배송중', delivered:'배송 완료', cancelled:'취소'})[order.status] || order.status }`,
      order.tracking ? `송장번호      ${order.tracking}` : '',
      '',
      '--- 주문 상품 ----------------------------',
      `『왕의길』 ${order.version === 'KR' ? '국문판' : '영문판'} × ${order.qty}    ${formatPrice(order.subtotal)}`,
      `배송비                                ${order.shipping === 0 ? '무료' : formatPrice(order.shipping)}`,
      '─────────────────────────────────────────',
      `합계                              ${formatPrice(order.total)}`,
      '',
      '--- 받는 분 -----------------------------',
      `${order.recipient}  /  ${order.phone}`,
      `${order.address}${order.addressDetail ? ' ' + order.addressDetail : ''}`,
      order.memo ? `메모: ${order.memo}` : '',
      '',
    ];
    if (order.status === 'pending_payment' && bank.accountNumber) {
      lines.push('--- 무통장 입금 안내 -------------------');
      lines.push(`은행          ${bank.bankName || '-'}`);
      lines.push(`계좌          ${bank.accountNumber}`);
      lines.push(`예금주        ${bank.holder || '-'}`);
      lines.push(`입금자명      ${order.recipient} 또는 ${order.orderNo}`);
      lines.push('');
    }
    lines.push('운영 문의 · hello@bgnj.net');
    lines.push('영수증 발행 · ' + new Date().toLocaleString('ko-KR'));
    return lines.filter((l) => l != null).join('\n');
  },
  downloadReceipt(id) {
    const text = this.generateReceipt(id);
    if (!text) return false;
    const order = this.getOrder(id);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `receipt-${order.orderNo}.txt`; a.click();
    URL.revokeObjectURL(url);
    return true;
  },
  exportCsv() {
    const header = ['orderNo', 'date', 'userId', 'recipient', 'phone', 'address', 'version', 'qty', 'total', 'status', 'tracking'];
    const rows = this.listAll().map((o) => [
      o.orderNo, o.createdAt, o.userId, o.recipient, o.phone,
      `${o.address} ${o.addressDetail || ''}`.trim(), o.version, o.qty, o.total, o.status, o.tracking || '',
    ]);
    return [header, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  },

  // ── 책 리뷰 (서버) ─────────────────────────────────
  async refreshReviews(bookId = 'kingsroad') {
    try {
      const { reviews } = await window.BGNJ_API.books.reviews.list(bookId);
      this._reviews = reviews || [];
    } catch {}
    return this._reviews.slice();
  },
  listReviews() { return this._reviews.slice().sort((a, b) => String(b.created_at || b.createdAt).localeCompare(String(a.created_at || a.createdAt))); },
  canReview(userId) { return userId && this.listMine(userId).some((o) => o.status === 'delivered'); },
  hasReviewed(userId) { return userId && this._reviews.some((r) => r.user_id === userId || r.userId === userId); },
  async addReview({ userId, rating, text }) {
    if (!userId) return { ok: false, message: "로그인 후 이용해 주세요." };
    if (!this.canReview(userId)) return { ok: false, message: "배송 완료된 주문이 있어야 리뷰를 작성할 수 있습니다." };
    if (this.hasReviewed(userId)) return { ok: false, message: "이미 리뷰를 작성하셨습니다." };
    const r = Number(rating);
    if (!r || r < 1 || r > 5) return { ok: false, message: "별점(1~5)을 선택해 주세요." };
    if (!String(text || '').trim()) return { ok: false, message: "리뷰 내용을 입력해 주세요." };
    try {
      await window.BGNJ_API.books.reviews.create('kingsroad', { rating: r, body: String(text).trim() });
      await this.refreshReviews();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err?.body?.error || err?.message || '리뷰 등록 실패' };
    }
  },
  async deleteReview(reviewId) {
    await window.BGNJ_API.books.reviews.remove(reviewId);
    await this.refreshReviews();
  },
};

// === 투어(BGNJ_TOURS) helper ============================================
// 운영 정책:
//   - 시드는 BANGINOJA_DATA.tours. 관리자가 capacity / startsAt / 가격 등을 수정하면
//     `tourOverrides`(같은 id 키)에 저장하고 listAll에서 머지.
//   - 신청은 회원 전용. 한 회원당 한 투어에 한 건만(취소 후 재신청은 가능).
//   - 결제는 무통장 입금만(같은 bankAccount 저장소 사용).
//   - 정원/대기열/입금 확인/.ics는 강연 helper와 같은 패턴.
window.BGNJ_TOURS = {
  _tours: [],
  _myReservations: [],
  _reviewsByTour: {},
  _toTour(r) {
    return {
      id: r.id, title: r.title, location: r.location, host: r.host,
      startsAt: r.starts_at, endsAt: r.ends_at, durationMinutes: r.duration_minutes,
      capacity: r.capacity, price: r.price, priceNumber: r.price,
      desc: r.description || r.desc, hidden: !!r.hidden,
    };
  },
  async refresh({ includeHidden } = {}) {
    try {
      const { tours } = await window.BGNJ_API.tours.list({ includeHidden: !!includeHidden });
      this._tours = (tours || []).map((t) => this._toTour(t));
      try { window.dispatchEvent(new CustomEvent('bgnj-tours-refresh')); } catch {}
    } catch {}
    return this._tours.slice();
  },
  async refreshMine() {
    try {
      const { reservations } = await window.BGNJ_API.tours.mineReservations();
      this._myReservations = (reservations || []).map((r) => ({
        id: r.id, tourId: r.tour_id, userId: r.user_id, name: r.user_name,
        email: r.user_email, phone: r.user_phone, status: r.status,
        paid: r.status === 'confirmed', count: r.qty || 1, price: r.price || 0,
        createdAt: r.created_at, paidAt: r.paid_at, cancelledAt: r.cancelled_at,
        tour: { id: r.tour_id, title: r.title, startsAt: r.starts_at, location: r.location, price: r.price },
      }));
    } catch {}
    return this._myReservations.slice();
  },
  listAll(opts = {}) {
    if (opts.includeHidden) return this._tours.slice();
    return this._tours.filter((t) => !t.hidden);
  },
  getTour(id) { return this._tours.find((t) => String(t.id) === String(id)) || null; },
  async saveTour(payload) {
    if (payload.id && this.getTour(payload.id)) {
      await window.BGNJ_API.tours.update(payload.id, payload);
    } else {
      await window.BGNJ_API.tours.create(payload);
    }
    await this.refresh({ includeHidden: true });
    return this.getTour(payload.id);
  },
  async setHidden(id, hidden) {
    await window.BGNJ_API.tours.update(id, { hidden: !!hidden });
    await this.refresh({ includeHidden: true });
  },
  async deleteTour(id) {
    await window.BGNJ_API.tours.remove(id);
    await this.refresh({ includeHidden: true });
  },
  // ── 예약 ──
  listReservations(_tourId) { return []; }, // admin per-tour list endpoint not yet provided.
  getSeats(tourId) {
    const tour = this.getTour(tourId);
    return { capacity: tour?.capacity || 0, taken: 0, waitlist: 0, remaining: tour?.capacity || 0 };
  },
  hasUserReserved(tourId, userId) {
    if (!userId) return null;
    return this._myReservations.find((r) => String(r.tourId) === String(tourId) && r.status !== 'cancelled') || null;
  },
  async reserve(tourId, payload) {
    const userId = payload.userId;
    if (!userId) return { ok: false, message: "회원 가입 후 로그인해 주세요." };
    try {
      const res = await window.BGNJ_API.tours.reserve(tourId, { phone: payload.phone || '' });
      await this.refreshMine();
      return { ok: true, reservation: res };
    } catch (err) {
      return { ok: false, message: err?.body?.error || err?.message || '예약 실패' };
    }
  },
  async cancelReservation(_tourId, reservationId) {
    await window.BGNJ_API.tours.cancelReservation(reservationId);
    await this.refreshMine();
  },
  async confirmPayment(_tourId, reservationId) {
    await window.BGNJ_API.tours.patchReservation(reservationId, { status: 'confirmed' });
    await this.refreshMine();
  },
  async unconfirmPayment(_tourId, reservationId) {
    await window.BGNJ_API.tours.patchReservation(reservationId, { status: 'pending_payment' });
    await this.refreshMine();
  },
  async requestRefund(_tourId, reservationId, reason) {
    await window.BGNJ_API.tours.patchReservation(reservationId, { status: 'refund_requested', refundReason: reason });
    await this.refreshMine();
    return { ok: true };
  },
  async approveRefund(_tourId, reservationId) {
    await window.BGNJ_API.tours.patchReservation(reservationId, { status: 'cancelled' });
    await this.refreshMine();
  },
  async rejectRefund(_tourId, reservationId, _adminNote) {
    await window.BGNJ_API.tours.patchReservation(reservationId, { status: 'confirmed' });
    await this.refreshMine();
  },
  listMyReservations(_userId) { return this._myReservations.slice(); },
  // ── .ics ──
  generateIcs(tour) {
    if (!tour?.startsAt) return null;
    const start = new Date(tour.startsAt);
    const dur = (tour.durationMinutes || 180) * 60 * 1000;
    const end = new Date(start.getTime() + dur);
    const fmt = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    };
    const escape = (s) => String(s || '').replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
    return [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//BANGINOJA//Tour//KO','CALSCALE:GREGORIAN','METHOD:PUBLISH',
      'BEGIN:VEVENT', `UID:tour-${tour.id}@bgnj`, `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:${escape(tour.title || '답사')}`, `LOCATION:${escape(tour.location || tour.title || '')}`,
      `DESCRIPTION:${escape(tour.desc || '')}`,
      'END:VEVENT','END:VCALENDAR',
    ].join('\r\n');
  },
  downloadIcs(tourId) {
    const tour = this.getTour(tourId);
    const ics = this.generateIcs(tour);
    if (!ics) return false;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `tour-${tour.id}.ics`; a.click();
    URL.revokeObjectURL(url);
    return true;
  },
  // ── 후기 ──
  async refreshReviews(tourId) {
    try {
      const { reviews } = await window.BGNJ_API.tours.reviews.list(tourId);
      this._reviewsByTour[String(tourId)] = reviews || [];
    } catch {}
    return this._reviewsByTour[String(tourId)] || [];
  },
  listReviews(tourId) { return (this._reviewsByTour[String(tourId)] || []).slice(); },
  canReview(tourId, userId) {
    if (!userId) return false;
    return this._myReservations.some((r) => String(r.tourId) === String(tourId) && r.status === 'confirmed');
  },
  async addReview(tourId, payload) {
    try {
      await window.BGNJ_API.tours.reviews.create(tourId, { rating: payload.rating, body: payload.text });
      await this.refreshReviews(tourId);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err?.body?.error || err?.message };
    }
  },
  async deleteReview(tourId, reviewId) {
    await window.BGNJ_API.tours.reviews.remove(reviewId);
    await this.refreshReviews(tourId);
  },
};

// === 운영 감사 로그(BGNJ_AUDIT) ============================================
// 운영자(혹은 시스템)가 데이터를 변경할 때마다 한 줄 기록한다. 최근 500건 유지.
// 감사 로그 — 서버(D1.audit_log)가 source of truth.
// 동기 호출자(예: GRADE_PROMO 내부) 호환을 위해 log() 는 fire-and-forget 으로 서버 전송하고,
// 즉시 메모리 캐시에도 추가한다.
window.BGNJ_AUDIT = {
  _cache: [],
  log({ action, target, details } = {}) {
    const entry = {
      id: `audit-local-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      action: String(action || '').trim(),
      target: String(target || ''),
      details: details || null,
      by: window.BGNJ_AUTH?._readCache?.()?.name || 'system',
      ts: new Date().toISOString(),
    };
    this._cache = [entry, ...this._cache].slice(0, 500);
    // 서버에 비동기 전송. 실패해도 UI 흐름은 막지 않음(레벨 낮은 작업).
    try {
      window.BGNJ_API.admin.audit.create({ action: entry.action, target: entry.target, details: entry.details })
        .catch(() => {});
    } catch {}
    return entry;
  },
  async refresh({ limit = 200, search = '' } = {}) {
    try {
      const { log } = await window.BGNJ_API.admin.audit.list({ limit });
      this._cache = (log || []).map((e) => ({
        id: e.id, action: e.action, target: e.target,
        details: e.details ?? (e.details_json ? JSON.parse(e.details_json) : null),
        by: e.actor || 'system', ts: e.ts || e.created_at,
      }));
    } catch {}
    return this.list({ search, limit });
  },
  list({ search = '', limit = 200 } = {}) {
    const all = this._cache.slice();
    if (!search) return all.slice(0, limit);
    const q = String(search).toLowerCase();
    return all.filter((e) =>
      String(e.action || '').toLowerCase().includes(q)
      || String(e.target || '').toLowerCase().includes(q)
      || String(e.by || '').toLowerCase().includes(q)
    ).slice(0, limit);
  },
  clear() { this._cache = []; },
};

// === 자동 등급 승격/강등(BGNJ_GRADE_PROMO) ===============================
// 활동(글 + 댓글 가중치)을 기준으로 사용자의 자격 등급을 평가.
// 운영자는 admin / wangsanam 등급은 자동 변경하지 않는다.
// 승격: 새 글/댓글 작성 시점에 호출되어 자격이 되는 가장 높은 등급으로 올린다.
// 강등: 게시글/댓글 삭제 시점 또는 관리자가 수동으로 호출. 활동 누적량이 현재 등급
//      기준에 미치지 못하면 자격 등급으로 내린다 (이동 폭은 한 단계가 아니라 자격 기준 그대로).
window.BGNJ_GRADE_RULES = {
  reader:  { posts: 0,  comments: 5  },   // 댓글 5개 이상 → 독자
  scholar: { posts: 3,  comments: 15 },   // 글 3개 + 댓글 15개 → 사관
};
const PROMOTION_PROTECTED = new Set(['admin', 'wangsanam']);

window.BGNJ_GRADE_PROMO = {
  evaluate(userId) {
    const a = window.BGNJ_AUTH.getActivity(userId);
    if (!a) return null;
    const post = a.postCount || 0;
    const comment = a.commentCount || 0;
    let qualified = 'member';
    Object.entries(window.BGNJ_GRADE_RULES || {}).forEach(([gid, rule]) => {
      if (post >= (rule.posts || 0) && comment >= (rule.comments || 0)) {
        qualified = gid;
      }
    });
    return qualified;
  },
  // 사용자 행동 후 호출 — 새 등급이 더 높을 때만 승격. async setGrade 는 fire-and-forget.
  maybePromote(userId) {
    const users = window.BGNJ_AUTH?._usersCache || [];
    const user = users.find((u) => u.id === userId);
    if (!user) return null;
    if (user.isAdmin) return null;
    if (PROMOTION_PROTECTED.has(user.gradeId)) return null;
    const grades = window.BGNJ_STORES.grades || [];
    const currentLv = grades.find((g) => g.id === user.gradeId)?.level ?? 0;
    const targetId = this.evaluate(userId);
    const targetLv = grades.find((g) => g.id === targetId)?.level ?? 0;
    if (targetLv <= currentLv) return null;
    try { window.BGNJ_AUTH.setGrade(userId, targetId)?.catch?.(() => {}); } catch {}
    window.BGNJ_AUDIT?.log({
      action: 'grade.auto_promote',
      target: `user:${userId}`,
      details: { from: user.gradeId, to: targetId },
    });
    return targetId;
  },
  maybeDemote(userId) {
    const users = window.BGNJ_AUTH?._usersCache || [];
    const user = users.find((u) => u.id === userId);
    if (!user) return null;
    if (user.isAdmin) return null;
    if (PROMOTION_PROTECTED.has(user.gradeId)) return null;
    const grades = window.BGNJ_STORES.grades || [];
    const currentLv = grades.find((g) => g.id === user.gradeId)?.level ?? 0;
    const targetId = this.evaluate(userId);
    const targetLv = grades.find((g) => g.id === targetId)?.level ?? 0;
    if (targetLv >= currentLv) return null;
    try { window.BGNJ_AUTH.setGrade(userId, targetId)?.catch?.(() => {}); } catch {}
    window.BGNJ_AUDIT?.log({
      action: 'grade.auto_demote',
      target: `user:${userId}`,
      details: { from: user.gradeId, to: targetId },
      by: 'system',
    });
    window.BGNJ_COMMUNITY?.addNotification(userId, {
      type: 'grade_demoted',
      postTitle: '회원 등급 안내',
      fromName: '운영자',
      message: `활동량 변동으로 등급이 ${grades.find((g) => g.id === targetId)?.label || targetId}(으)로 조정되었습니다.`,
    });
    return targetId;
  },
  // 모든 회원에 대해 활동 기반 등급 재산정 — 관리자 패널 일괄 작업용.
  reevaluateAll() {
    const summary = { promoted: 0, demoted: 0 };
    const users = window.BGNJ_AUTH?._usersCache || [];
    users.forEach((u) => {
      if (u.isAdmin) return;
      if (PROMOTION_PROTECTED.has(u.gradeId)) return;
      if (this.maybePromote(u.id)) summary.promoted++;
      else if (this.maybeDemote(u.id)) summary.demoted++;
    });
    return summary;
  },
};

// === 사이트 콘텐츠(BGNJ_SITE_CONTENT) helper =============================
// 서버(D1.site_content_kv)가 source of truth. 페이지 진입 시 1회 refresh() 로 메모리 캐시 채움.
// `get()` 은 동기 read 호환 — 캐시가 비어있으면 기본값만 반환.
window.BGNJ_SITE_CONTENT = {
  defaults: DEFAULT_SITE_CONTENT,
  _cache: {},
  async refresh() {
    try {
      const { siteContent } = await window.BGNJ_API.siteContent.get();
      this._cache = siteContent || {};
      this.applyHead();
      try { window.dispatchEvent(new CustomEvent('bgnj-site-content-refresh')); } catch {}
    } catch {}
    return this.get();
  },
  get() {
    const stored = this._cache || {};
    const merged = {};
    for (const key of Object.keys(DEFAULT_SITE_CONTENT)) {
      merged[key] = { ...DEFAULT_SITE_CONTENT[key], ...((stored[key] && typeof stored[key] === 'object') ? stored[key] : {}) };
    }
    return merged;
  },
  async saveSection(section, patch) {
    const cur = this._cache[section] || {};
    const data = { ...cur, ...patch };
    await window.BGNJ_API.siteContent.saveSection(section, data);
    this._cache = { ...this._cache, [section]: data };
    this.applyHead();
    return this.get();
  },
  async resetSection(section) {
    // 서버에서 빈 객체로 덮어 사용자 편집값을 비움 → 기본값이 다시 노출됨.
    await window.BGNJ_API.siteContent.saveSection(section, {});
    const next = { ...this._cache };
    delete next[section];
    this._cache = next;
    this.applyHead();
    return this.get();
  },
  // <head>의 favicon, OG/description 메타를 현재 siteContent로 덮어쓴다.
  // 페이지 로드 시 1회 + 관리자 저장 시 호출.
  applyHead() {
    if (typeof document === 'undefined') return;
    const sc = this.get();
    try {
      // favicon
      const fav = sc.branding?.faviconDataUri;
      if (fav) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', 'icon');
          document.head.appendChild(link);
        }
        link.setAttribute('href', fav);
      }
      // title + description
      if (sc.og?.title) document.title = sc.og.title;
      const setMeta = (selector, attr, value) => {
        if (!value) return;
        let el = document.querySelector(selector);
        if (!el) {
          el = document.createElement('meta');
          const [, key, val] = selector.match(/\[(\w+)="([^"]+)"\]/) || [];
          if (key && val) el.setAttribute(key, val);
          document.head.appendChild(el);
        }
        el.setAttribute(attr, value);
      };
      setMeta('meta[name="description"]', 'content', sc.og?.description);
      setMeta('meta[property="og:title"]', 'content', sc.og?.title);
      setMeta('meta[property="og:description"]', 'content', sc.og?.description);
      if (sc.og?.imageDataUri) setMeta('meta[property="og:image"]', 'content', sc.og.imageDataUri);
    } catch {}
  },
};
// 페이지 로드 직후 한 번 적용
try { window.BGNJ_SITE_CONTENT.applyHead(); } catch {}

// === 책 카탈로그(BGNJ_BOOKS) helper =======================================
// 다양한 책을 관리하고 표지(PNG)/본문 미리보기(PDF)를 dataURI로 보관한다.
// 책마다 독립된 reviews 배열을 갖는다 — 기존 BGNJ_BOOK_ORDERS의 글로벌 리뷰와 별개.
// === 책 카탈로그(BGNJ_BOOKS) — 서버(D1.books) source of truth =============
window.BGNJ_BOOKS = {
  _books: [],
  _toBook(r) {
    return {
      id: r.id, slug: r.slug || r.id, title: r.title, subtitle: r.subtitle,
      author: r.author, publisher: r.publisher, pages: r.pages, isbn: r.isbn,
      priceKR: r.price_kr || r.priceKR || 0, priceEN: r.price_en || r.priceEN || 0,
      desc: r.description || r.desc, intro: r.intro,
      chapters: typeof r.chapters_json === 'string' ? (JSON.parse(r.chapters_json || '[]')) : (r.chapters || []),
      authorBio: r.author_bio || r.authorBio,
      coverDataUri: r.cover_url || r.coverDataUri || '',
      pdfPreviewDataUri: r.pdf_preview_url || r.pdfPreviewDataUri || '',
      badges: typeof r.badges_json === 'string' ? (JSON.parse(r.badges_json || '[]')) : (r.badges || []),
      status: r.status || 'published',
      publishedAt: r.published_at || r.publishedAt,
      primary: !!r.primary,
      order: r.display_order ?? r.order ?? 0,
      reviews: [],
    };
  },
  async refresh() {
    try {
      const { books } = await window.BGNJ_API.books.list();
      this._books = (books || []).map((b) => this._toBook(b));
      try { window.dispatchEvent(new CustomEvent('bgnj-books-refresh')); } catch {}
    } catch {}
    return this._books.slice();
  },
  list({ status } = {}) {
    const all = this._books.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (status) return all.filter((b) => (b.status || 'published') === status);
    return all;
  },
  get(id) {
    if (!id) return null;
    return this._books.find((b) => b.id === id) || null;
  },
  primary() {
    const books = this.list();
    return books.find((b) => b.primary && (b.status || 'published') === 'published')
      || books.find((b) => (b.status || 'published') === 'published')
      || null;
  },
  async create(payload = {}) {
    const res = await window.BGNJ_API.books.create(payload);
    await this.refresh();
    return res?.id ? this.get(res.id) : null;
  },
  async update(id, patch = {}) {
    await window.BGNJ_API.books.update(id, patch);
    await this.refresh();
    return this.get(id);
  },
  async remove(id) {
    await window.BGNJ_API.books.remove(id);
    await this.refresh();
  },
  async reorder(ids) {
    await Promise.all(ids.map((id, i) => window.BGNJ_API.books.update(id, { order: i })));
    await this.refresh();
  },
  // 책별 리뷰는 BGNJ_BOOK_ORDERS 측에서도 관리. 여기선 위임.
  async addReview(id, payload) {
    return window.BGNJ_BOOK_ORDERS.addReview({ userId: payload.userId, rating: payload.rating, text: payload.text });
  },
  async removeReview(_id, reviewId) {
    return window.BGNJ_BOOK_ORDERS.deleteReview(reviewId);
  },
};

// === 약관 / 개인정보 처리방침(BGNJ_LEGAL) helper ==========================
// 서버(D1.legal_docs)가 source of truth. 로컬은 첫 페인트용 메모리 캐시.
window.BGNJ_LEGAL = {
  _cache: {},
  async refresh(slug) {
    try {
      const { doc } = await window.BGNJ_API.legal.get(slug);
      if (doc) this._cache[slug] = { title: doc.title, body: doc.body, updatedAt: doc.updated_at };
      else delete this._cache[slug];
      return this._cache[slug] || null;
    } catch { return this._cache[slug] || null; }
  },
  get(slug) { return this._cache[slug] || null; },
  async save(slug, payload) {
    const next = { title: payload.title || slug, body: payload.body || '' };
    await window.BGNJ_API.legal.put(slug, next);
    this._cache[slug] = { ...next, updatedAt: new Date().toISOString() };
    return this._cache[slug];
  },
  listSlugs() { return ['privacy', 'terms']; },
};

// === FAQ(BGNJ_FAQ) helper ================================================
// 서버(D1.faqs)가 source of truth. 메모리 캐시는 동기 read 호환용.
window.BGNJ_FAQ = {
  _cache: [],
  async refresh({ admin } = {}) {
    try {
      const { faqs } = admin
        ? await window.BGNJ_API.faqs.adminList()
        : await window.BGNJ_API.faqs.list();
      this._cache = (faqs || []).map((f) => ({
        id: f.id, question: f.question, answer: f.answer,
        category: f.category || '일반',
        order: f.display_order ?? 0,
        hidden: !!f.hidden,
      }));
      try { window.dispatchEvent(new CustomEvent('bgnj-faqs-refresh')); } catch {}
    } catch {}
    return this._cache.slice();
  },
  listAll() { return this._cache.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); },
  listCategories() {
    const set = new Set(this.listAll().map((f) => f.category || '일반'));
    return ['전체', ...Array.from(set)];
  },
  search(query, category) {
    const q = String(query || '').trim().toLowerCase();
    return this.listAll().filter((f) => {
      if (category && category !== '전체' && (f.category || '일반') !== category) return false;
      if (!q) return true;
      return String(f.question || '').toLowerCase().includes(q)
        || String(f.answer || '').toLowerCase().includes(q);
    });
  },
  async add(payload) {
    const next = {
      question: String(payload.question || '').trim(),
      answer: String(payload.answer || '').trim(),
      category: String(payload.category || '일반').trim() || '일반',
      order: typeof payload.order === 'number' ? payload.order : this._cache.length,
    };
    if (!next.question || !next.answer) return null;
    const { id } = await window.BGNJ_API.faqs.create(next);
    await this.refresh({ admin: true });
    return this._cache.find((f) => f.id === id) || null;
  },
  async update(id, patch) {
    await window.BGNJ_API.faqs.update(id, patch);
    await this.refresh({ admin: true });
    return this._cache.find((f) => f.id === id) || null;
  },
  async remove(id) {
    await window.BGNJ_API.faqs.remove(id);
    await this.refresh({ admin: true });
  },
  async reorder(id, dir) {
    const list = this.listAll();
    const idx = list.findIndex((f) => f.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= list.length) return;
    const a = list[idx], b = list[j];
    await Promise.all([
      window.BGNJ_API.faqs.update(a.id, { order: j }),
      window.BGNJ_API.faqs.update(b.id, { order: idx }),
    ]);
    await this.refresh({ admin: true });
  },
};

// 사용자 등급 레벨 계산
window.BGNJ_USER_LEVEL = (user) => {
  if (!user) return 0;
  if (user.isAdmin) return 100;
  const g = window.BGNJ_STORES.grades.find(x => x.id === user.gradeId);
  return g ? g.level : 10;
};

// 사용자 등급 메타 (label / color / level) 반환
window.BGNJ_USER_GRADE = (user) => {
  if (!user) return null;
  const grades = window.BGNJ_STORES.grades || [];
  if (user.isAdmin) return grades.find(g => g.id === 'admin') || null;
  return grades.find(g => g.id === user.gradeId) || null;
};

// 작성자 식별자(id / 이름 / 이메일) 중 가능한 것으로 등급을 찾아 반환
window.BGNJ_AUTHOR_GRADE = ({ authorId, author, authorEmail } = {}) => {
  const users = window.BGNJ_STORES.users || [];
  const found = users.find((u) =>
    (authorId && u.id === authorId) ||
    (authorEmail && u.email === authorEmail) ||
    (author && u.name === author)
  );
  return found ? window.BGNJ_USER_GRADE(found) : null;
};

window.BANGINOJA_DATA = {
  notices: [
    { id: 1, tag: "공지", title: "2026년 상반기 궁궐 답사 프로그램 접수 개시", date: "2026.04.18", pinned: true },
    { id: 2, tag: "안내", title: "『왕의길』 영문판 출간 예정 — 4월 30일", date: "2026.04.15", pinned: true },
    { id: 3, tag: "이벤트", title: "창덕궁 후원 야간 답사 — 선착순 30명", date: "2026.04.10" },
    { id: 4, tag: "공지", title: "커뮤니티 등급제 개편 안내", date: "2026.04.03" },
    { id: 5, tag: "공지", title: "뱅기노자 칼럼 정기 연재 재개", date: "2026.03.28" },
  ],
  columns: [
    { id: 1, title: "왕의 자리 뒤에는 무엇이 있었는가", excerpt: "어좌 뒤 병풍은 단순한 장식이 아니다. 왕의 자리 뒤에 펼쳐진 우주관이며, 동시에 통치의 질서였다.", date: "2026.04.16", readTime: "8분", category: "왕의 미학" },
    { id: 2, title: "세종의 침묵, 정조의 질문", excerpt: "두 임금의 대화법은 전혀 달랐다. 그러나 공통점이 하나 있었으니, 묻는 자리에 오래 머물렀다는 점이다.", date: "2026.04.09", readTime: "12분", category: "군주의 언어" },
    { id: 3, title: "궁궐은 왜 비대칭인가", excerpt: "경복궁은 완벽한 좌우대칭을 피한다. 그 어긋남 속에 조선이 생각한 완전함이 있다.", date: "2026.04.02", readTime: "6분", category: "공간의 철학" },
    { id: 4, title: "해와 달이 동시에 뜨는 이유", excerpt: "자연에서는 불가능하다. 그러나 왕의 뒤에서는 매일 그러했다. 그 이유를 묻지 않는 시대는 지났다.", date: "2026.03.26", readTime: "10분", category: "왕의 미학" },
    { id: 5, title: "길이라는 말의 무게", excerpt: "왕의 길. 이 세 글자는 도덕적 선언이자 실천의 지도였다. 오늘의 우리에게 남은 길은 무엇인가.", date: "2026.03.19", readTime: "14분", category: "현대의 독법" },
    { id: 6, title: "어좌는 어디를 바라보는가", excerpt: "남향이라는 답은 절반만 맞다. 왕의 시선은 자연을 향하지 않았다. 그것은 백성을 향한 각도였다.", date: "2026.03.12", readTime: "9분", category: "공간의 철학" },
  ],
  tours: [
    { id: 1, title: "경복궁 — 권력의 좌표를 읽다", duration: "3시간", group: "12인 이하", price: "85,000원", priceNumber: 85000, capacity: 12, startsAt: "2026-05-04T10:00:00+09:00", durationMinutes: 180, next: "2026.05.04 · 토", level: "입문", desc: "근정전부터 경회루까지, 조선 건국의 설계도를 공간으로 따라갑니다." },
    { id: 2, title: "창덕궁 후원 — 왕의 사유", duration: "4시간", group: "8인 이하", price: "130,000원", priceNumber: 130000, capacity: 8, startsAt: "2026-05-11T18:00:00+09:00", durationMinutes: 240, next: "2026.05.11 · 토", level: "심화", desc: "공적 공간 너머, 왕이 스스로를 마주하던 자리. 야간 답사 한정." },
    { id: 3, title: "종묘 — 침묵의 건축", duration: "2.5시간", group: "15인 이하", price: "70,000원", priceNumber: 70000, capacity: 15, startsAt: "2026-05-18T10:00:00+09:00", durationMinutes: 150, next: "2026.05.18 · 일", level: "입문", desc: "세계에서 가장 긴 목조 건축이 왜 비어 있어야 했는가." },
    { id: 4, title: "수원 화성 — 정조의 기획", duration: "5시간", group: "10인 이하", price: "150,000원", priceNumber: 150000, capacity: 10, startsAt: "2026-05-25T09:00:00+09:00", durationMinutes: 300, next: "2026.05.25 · 토", level: "심화", desc: "개혁 군주가 남긴 도시. 근대 이전의 가장 급진적 실험." },
  ],
  lectures: [
    { id: 1, title: "왕사남 월간 공개 강연", topic: "왕의 자리는 어떻게 설계되었는가", venue: "서울 종로 강연실", next: "2026.05.02 · 토 19:00", startsAt: "2026-05-02T19:00:00+09:00", durationMinutes: 90, capacity: 30, price: 0, host: "뱅기노자", seats: "잔여 18석", note: "왕권, 공간, 상징 체계를 입문자 관점에서 풀어냅니다." },
    { id: 2, title: "왕사남 심화 강연", topic: "세종의 침묵과 정조의 질문", venue: "온라인 라이브", next: "2026.05.09 · 토 20:00", startsAt: "2026-05-09T20:00:00+09:00", durationMinutes: 120, capacity: 60, price: 20000, host: "뱅기노자", seats: "잔여 42석", note: "실록 문장을 중심으로 두 군주의 사고법을 비교합니다." },
    { id: 3, title: "왕사남 현장 강연", topic: "창덕궁 후원과 왕의 사유", venue: "창덕궁 권역", next: "2026.05.16 · 토 18:30", startsAt: "2026-05-16T18:30:00+09:00", durationMinutes: 150, capacity: 20, price: 50000, host: "왕사남 팀", seats: "대기 접수", note: "답사와 강연이 결합된 현장형 프로그램입니다." },
  ],
  posts: DEFAULT_COMMUNITY_POSTS.map((post) => ({ ...post })),
  partners: [
    { name: "국립고궁박물관", type: "문화기관", note: "공동 기획전" },
    { name: "한국고전번역원", type: "학술기관", note: "사료 번역 자문" },
    { name: "문화재청", type: "공공기관", note: "답사 프로그램 협약" },
    { name: "성균관대 유학동양학과", type: "학술기관", note: "연구 파트너" },
    { name: "교보문고", type: "유통", note: "『왕의길』 공식 판매" },
    { name: "아트인문학", type: "미디어", note: "칼럼 연재" },
  ],
  book: {
    title: "왕의길",
    subtitle: "다섯 봉우리 아래 읽는 조선",
    author: "뱅기노자",
    publisher: "뱅기노자 프레스",
    pages: 412,
    isbn: "979-11-000-0000-0",
    priceKR: 28000,
    priceEN: 35000,
    desc: "왕의 자리에 선 자는 누구인가. 그 자리에서 무엇을 보았으며, 어떤 질문을 견뎠는가. 뱅기노자가 15년간 쌓아올린 궁궐 답사와 실록 독해의 결실을 한 권으로 엮는다. 왕의 자리가 아니라 왕이 바라본 길을 따라가는 책.",
    chapters: [
      "1부 · 다섯 봉우리의 설계",
      "2부 · 어좌 뒤에서 바라본 것",
      "3부 · 측근과 거리의 정치",
      "4부 · 길이라는 말의 무게",
      "5부 · 현대의 군주는 누구인가",
    ],
  },
};

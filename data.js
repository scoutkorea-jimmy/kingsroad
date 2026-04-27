// 뱅기노자 mock data

// === 사이트 버전 (수정 시 footer에 노출) ===
window.BGNJ_VERSION = {
  version: "00.026.000",
  build: "2026.04.27",
  channel: "preview",
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
  listUsers() {
    return window.BGNJ_STORES.users.slice();
  },
  // 페이지 진입 시 1회 호출 — 서버 쿠키로 진짜 세션 검증 후 캐시 갱신.
  async refreshSession() {
    try {
      const { user } = await window.BGNJ_API.me();
      this._writeCache(user || null);
      return user || null;
    } catch {
      return this._readCache();
    }
  },
  async signIn({ email, password }) {
    try {
      const { user } = await window.BGNJ_API.login({ email, password });
      this._writeCache(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, message: err?.body?.error || err?.message || '로그인 중 오류가 발생했습니다.' };
    }
  },
  async signUp(payload) {
    try {
      const { user } = await window.BGNJ_API.signup({
        email: payload.email,
        name: payload.name,
        password: payload.password,
        consents: payload.consents,
      });
      this._writeCache(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, message: err?.body?.error || err?.message || '회원가입 중 오류가 발생했습니다.' };
    }
  },
  async signOut() {
    try { await window.BGNJ_API.logout(); } catch {}
    this._writeCache(null);
    return null;
  },

  // ── 관리자 운영 ─────────────────────────────────────────────
  setGrade(userId, gradeId) {
    const before = (window.BGNJ_STORES.users || []).find((u) => u.id === userId);
    window.BGNJ_STORES.users = window.BGNJ_STORES.users.map((u) => (
      u.id === userId ? { ...u, gradeId, gradeChangedAt: new Date().toISOString() } : u
    ));
    window.BGNJ_SAVE.users();
    if (window.BGNJ_STORES.session?.id === userId) {
      window.BGNJ_STORES.session = { ...window.BGNJ_STORES.session, gradeId };
      window.BGNJ_SAVE.session();
    }
    if (before && before.gradeId !== gradeId) {
      window.BGNJ_AUDIT?.log({ action: 'member.grade_change', target: `user:${userId}`, details: { from: before.gradeId, to: gradeId } });
    }
    return window.BGNJ_STORES.users.find((u) => u.id === userId) || null;
  },
  suspendUser(userId, reason) {
    window.BGNJ_STORES.users = window.BGNJ_STORES.users.map((u) => (
      u.id === userId ? { ...u, suspended: true, suspendedReason: reason || '', suspendedAt: new Date().toISOString() } : u
    ));
    window.BGNJ_SAVE.users();
    if (window.BGNJ_STORES.session?.id === userId) {
      window.BGNJ_STORES.session = null;
      window.BGNJ_SAVE.session();
    }
    window.BGNJ_AUDIT?.log({ action: 'member.suspend', target: `user:${userId}`, details: { reason: reason || '' } });
    return window.BGNJ_STORES.users.find((u) => u.id === userId) || null;
  },
  unsuspendUser(userId) {
    window.BGNJ_STORES.users = window.BGNJ_STORES.users.map((u) => (
      u.id === userId ? { ...u, suspended: false, suspendedReason: '', unsuspendedAt: new Date().toISOString() } : u
    ));
    window.BGNJ_SAVE.users();
    window.BGNJ_AUDIT?.log({ action: 'member.unsuspend', target: `user:${userId}` });
    return window.BGNJ_STORES.users.find((u) => u.id === userId) || null;
  },
  removeUser(userId) {
    window.BGNJ_STORES.users = window.BGNJ_STORES.users.filter((u) => u.id !== userId);
    window.BGNJ_SAVE.users();
    if (window.BGNJ_STORES.session?.id === userId) {
      window.BGNJ_STORES.session = null;
      window.BGNJ_SAVE.session();
    }
    window.BGNJ_AUDIT?.log({ action: 'member.remove', target: `user:${userId}` });
  },
  toggleAdmin(userId) {
    const before = (window.BGNJ_STORES.users || []).find((u) => u.id === userId);
    let next = null;
    window.BGNJ_STORES.users = window.BGNJ_STORES.users.map((u) => {
      if (u.id !== userId) return u;
      next = { ...u, isAdmin: !u.isAdmin };
      return next;
    });
    window.BGNJ_SAVE.users();
    if (window.BGNJ_STORES.session?.id === userId && next) {
      window.BGNJ_STORES.session = { ...window.BGNJ_STORES.session, isAdmin: next.isAdmin };
      window.BGNJ_SAVE.session();
    }
    if (before && next) {
      window.BGNJ_AUDIT?.log({ action: 'member.admin_toggle', target: `user:${userId}`, details: { from: !!before.isAdmin, to: !!next.isAdmin } });
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
  signUp(payload) {
    const normalizedEmail = String(payload.email || "").trim().toLowerCase();
    if (window.BGNJ_STORES.users.find((user) => user.email === normalizedEmail)) {
      return { ok: false, message: "이미 가입된 이메일입니다." };
    }
    const nextUser = {
      id: `user-${Date.now()}`,
      name: payload.name,
      email: normalizedEmail,
      passwordHash: hashPassword(payload.password),
      isAdmin: false,
      gradeId: "member",
      profile: payload.profile || null,
      consents: payload.consents || { terms: true, marketing: false, thirdParty: false },
      joinedAt: new Date().toISOString(),
    };
    window.BGNJ_STORES.users = [nextUser, ...window.BGNJ_STORES.users];
    window.BGNJ_SAVE.users();
    const sessionUser = {
      id: nextUser.id,
      name: nextUser.name,
      email: nextUser.email,
      isAdmin: nextUser.isAdmin,
      gradeId: nextUser.gradeId,
      profile: nextUser.profile,
      consents: nextUser.consents,
      joinedAt: nextUser.joinedAt,
    };
    window.BGNJ_STORES.session = sessionUser;
    window.BGNJ_SAVE.session();
    return { ok: true, user: sessionUser };
  },
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
    const serverPost = this._serverPosts.find((p) => String(p.id) === String(postId));
    if (serverPost) {
      this.deletePostRemote(postId).catch(() => {});
      this._serverPosts = this._serverPosts.filter((p) => String(p.id) !== String(postId));
      try { window.dispatchEvent(new CustomEvent('bgnj-posts-refresh')); } catch {}
      return;
    }
    const nextPosts = this.listPosts().filter((post) => String(post.id) !== String(postId));
    this.savePosts(nextPosts.filter((p) => !p._remote));
    delete window.BGNJ_STORES.comments[postId];
    window.BGNJ_SAVE.comments();
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
    if (post && post._remote) {
      // 서버 댓글 삭제 API는 아직 없음 — 로컬 캐시에서만 제거(다음 새로고침 시 복원될 수 있음).
      const arr = this._commentsCache[String(postId)] || [];
      this._commentsCache[String(postId)] = arr.filter((c) => String(c.id) !== String(commentId));
      try { window.dispatchEvent(new CustomEvent('bgnj-comments-refresh', { detail: { postId } })); } catch {}
      return this._commentsCache[String(postId)];
    }
    const nextComments = this.getComments(postId).filter((comment) => String(comment.id) !== String(commentId));
    this.saveComments(postId, nextComments);
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
  toggleLike(postId, userId) {
    if (!userId) return null;
    const likes = this.getLikes(postId);
    const next = likes.includes(userId) ? likes.filter((id) => id !== userId) : [...likes, userId];
    return this.updatePost(postId, { likes: next });
  },

  // ── 북마크 (per-user post list) ───────────────────────────────────
  getBookmarks(userId) {
    if (!userId) return [];
    const map = window.BGNJ_STORES.bookmarks || {};
    return Array.isArray(map[userId]) ? map[userId].slice() : [];
  },
  isBookmarked(userId, postId) {
    return this.getBookmarks(userId).includes(postId);
  },
  toggleBookmark(userId, postId) {
    if (!userId) return [];
    const map = window.BGNJ_STORES.bookmarks || {};
    const list = Array.isArray(map[userId]) ? map[userId] : [];
    const next = list.includes(postId) ? list.filter((x) => x !== postId) : [postId, ...list];
    map[userId] = next;
    window.BGNJ_STORES.bookmarks = map;
    window.BGNJ_SAVE.bookmarks();
    return next;
  },
  listBookmarkedPosts(userId) {
    return this.getBookmarks(userId).map((id) => this.getPost(id)).filter(Boolean);
  },

  // ── 신고 큐 ───────────────────────────────────────────────────────
  addReport({ postId, postTitle, reporterId, reporterName, reason }) {
    const report = {
      id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      postId: postId ?? null,
      postTitle: postTitle ?? "(제목 없음)",
      reporterId: reporterId || null,
      reporterName: reporterName || "익명",
      reason: String(reason || "").trim() || "(사유 미기재)",
      createdAt: new Date().toISOString(),
      status: "open",
    };
    window.BGNJ_STORES.reports = [report, ...(window.BGNJ_STORES.reports || [])];
    window.BGNJ_SAVE.reports();
    return report;
  },
  listReports(filter) {
    const all = (window.BGNJ_STORES.reports || []).slice();
    if (!filter || filter === "all") return all;
    return all.filter((r) => r.status === filter);
  },
  updateReportStatus(id, status) {
    const next = (window.BGNJ_STORES.reports || []).map((r) =>
      r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );
    window.BGNJ_STORES.reports = next;
    window.BGNJ_SAVE.reports();
    return next.find((r) => r.id === id) || null;
  },
  countOpenReports() {
    return (window.BGNJ_STORES.reports || []).filter((r) => r.status === "open").length;
  },

  // ── 알림 (per-user) ───────────────────────────────────────────────
  addNotification(userId, payload) {
    if (!userId) return null;
    const map = window.BGNJ_STORES.notifications || {};
    const list = Array.isArray(map[userId]) ? map[userId] : [];
    const entry = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...payload,
    };
    map[userId] = [entry, ...list].slice(0, 50);
    window.BGNJ_STORES.notifications = map;
    window.BGNJ_SAVE.notifications();
    return entry;
  },
  listNotifications(userId) {
    if (!userId) return [];
    const map = window.BGNJ_STORES.notifications || {};
    return Array.isArray(map[userId]) ? map[userId].slice() : [];
  },
  unreadNotificationCount(userId) {
    return this.listNotifications(userId).filter((n) => !n.read).length;
  },
  markNotificationRead(userId, id) {
    if (!userId) return [];
    const map = window.BGNJ_STORES.notifications || {};
    map[userId] = (map[userId] || []).map((n) => (n.id === id ? { ...n, read: true } : n));
    window.BGNJ_STORES.notifications = map;
    window.BGNJ_SAVE.notifications();
    return map[userId];
  },
  markAllNotificationsRead(userId) {
    if (!userId) return [];
    const map = window.BGNJ_STORES.notifications || {};
    map[userId] = (map[userId] || []).map((n) => ({ ...n, read: true }));
    window.BGNJ_STORES.notifications = map;
    window.BGNJ_SAVE.notifications();
    return map[userId];
  },
  clearNotifications(userId) {
    if (!userId) return [];
    const map = window.BGNJ_STORES.notifications || {};
    map[userId] = [];
    window.BGNJ_STORES.notifications = map;
    window.BGNJ_SAVE.notifications();
    return [];
  },
};

// === 칼럼(BGNJ_COLUMNS) helper ===========================================
// 운영 정책:
//   - userColumns 저장소가 콘텐츠(본문/메타) 단일 출처. 시드 칼럼은 BANGINOJA_DATA.columns.
//   - status: 'draft' | 'scheduled' | 'published' (시드는 항상 published).
//   - 좋아요/조회수는 columnEngagement 맵으로 분리 — 시드 칼럼도 동일하게 저장.
//   - 댓글은 BGNJ_COMMUNITY.comments 저장소를 `col-{id}` 키로 재사용.
window.BGNJ_COLUMNS = {
  estimateReadTime(text) {
    const len = String(text || '').length;
    const minutes = Math.max(3, Math.ceil(len / 600));
    return `${minutes}분`;
  },
  _engage(id) {
    const map = window.BGNJ_STORES.columnEngagement || {};
    const entry = map[String(id)] || {};
    return { likes: Array.isArray(entry.likes) ? entry.likes : [], views: entry.views || 0 };
  },
  _setEngage(id, next) {
    const map = window.BGNJ_STORES.columnEngagement || {};
    map[String(id)] = next;
    window.BGNJ_STORES.columnEngagement = map;
    window.BGNJ_SAVE.columnEngagement();
  },
  getLikes(id) { return this._engage(id).likes.slice(); },
  hasLiked(id, userId) { return !!userId && this.getLikes(id).includes(userId); },
  toggleLike(id, userId) {
    if (!userId) return null;
    const e = this._engage(id);
    const likes = e.likes;
    const next = likes.includes(userId) ? likes.filter(x => x !== userId) : [...likes, userId];
    this._setEngage(id, { ...e, likes: next });
    return next;
  },
  getViews(id) { return this._engage(id).views || 0; },
  incrementViews(id) {
    const e = this._engage(id);
    const next = (e.views || 0) + 1;
    this._setEngage(id, { ...e, views: next });
    return next;
  },
  // 예약 발행이 시간 지났으면 자동으로 published로 승격
  _autoPromote() {
    const now = Date.now();
    const list = (window.BGNJ_STORES.userColumns || []);
    let mutated = false;
    const next = list.map((c) => {
      if (c.status === 'scheduled' && c.publishAt && new Date(c.publishAt).getTime() <= now) {
        mutated = true;
        return { ...c, status: 'published', publishedAt: c.publishedAt || new Date().toISOString() };
      }
      return c;
    });
    if (mutated) {
      window.BGNJ_STORES.userColumns = next;
      window.BGNJ_SAVE.userColumns();
    }
  },
  listAll() {
    this._autoPromote();
    return (window.BGNJ_STORES.userColumns || []).map((c) => ({
      ...c, status: c.status || 'published',
    }));
  },
  // 공개 노출용 — published 사용자 칼럼 + 시드 칼럼
  listPublic() {
    this._autoPromote();
    const userPub = (window.BGNJ_STORES.userColumns || []).filter((c) => (c.status || 'published') === 'published');
    const seed = (window.BANGINOJA_DATA?.columns || []).map((c) => ({ ...c, status: 'published' }));
    return [...userPub, ...seed];
  },
  getColumn(id) {
    this._autoPromote();
    const fromUser = (window.BGNJ_STORES.userColumns || []).find((c) => String(c.id) === String(id));
    if (fromUser) return { ...fromUser, status: fromUser.status || 'published' };
    const seed = (window.BANGINOJA_DATA?.columns || []).find((c) => String(c.id) === String(id));
    return seed ? { ...seed, status: 'published' } : null;
  },
  saveColumn(payload) {
    const list = window.BGNJ_STORES.userColumns || [];
    const idx = list.findIndex((c) => String(c.id) === String(payload.id));
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...payload, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...payload, createdAt: new Date().toISOString() });
    }
    window.BGNJ_STORES.userColumns = list;
    window.BGNJ_SAVE.userColumns();
    return payload;
  },
  deleteColumn(id) {
    window.BGNJ_STORES.userColumns = (window.BGNJ_STORES.userColumns || []).filter((c) => String(c.id) !== String(id));
    window.BGNJ_SAVE.userColumns();
    const map = window.BGNJ_STORES.columnEngagement || {};
    delete map[String(id)];
    window.BGNJ_STORES.columnEngagement = map;
    window.BGNJ_SAVE.columnEngagement();
  },
  // 검색 + 카테고리 필터
  searchPublic({ query = '', category = '전체' } = {}) {
    const q = String(query || '').trim().toLowerCase();
    return this.listPublic().filter((c) => {
      if (category !== '전체' && c.category !== category) return false;
      if (!q) return true;
      const inTitle = String(c.title || '').toLowerCase().includes(q);
      const inExcerpt = String(c.excerpt || '').toLowerCase().includes(q);
      const inBodyText = String(c.body?.text || '').toLowerCase().includes(q);
      return inTitle || inExcerpt || inBodyText;
    });
  },
  // 댓글은 BGNJ_COMMUNITY 저장소 재사용 (`col-{id}` 키)
  listComments(id) { return window.BGNJ_COMMUNITY.getComments(`col-${id}`); },
  addComment(id, payload) { return window.BGNJ_COMMUNITY.addComment(`col-${id}`, payload); },
  deleteComment(id, commentId) { return window.BGNJ_COMMUNITY.deleteComment(`col-${id}`, commentId); },
};

// === 강연(BGNJ_LECTURES) helper ==========================================
// 운영 정책:
//   - 시드는 BANGINOJA_DATA.lectures. 관리자가 정원/일정/제목 등을 수정하면
//     `lectureOverrides`(같은 id 키)에 변경분만 저장하고 listAll에서 머지.
//   - 신청은 회원 전용. 한 회원당 한 강연에 한 번만 신청 가능 (중복 방지).
//   - 결제 정책: price === 0 이면 즉시 'confirmed', price > 0 이면 'pending_payment'.
//   - 정원 차면 'waitlist'. 신청 취소(또는 관리자 취소)로 인원이 남으면 가장 오래된
//     waitlist를 'pending_payment'(유료) 또는 'confirmed'(무료)로 자동 승격.
//   - 'cancelled' 레코드는 잔여 좌석 계산에서 제외.
window.BGNJ_LECTURES = {
  _seed() { return (window.BANGINOJA_DATA?.lectures || []).slice(); },
  _override(id) {
    const map = window.BGNJ_STORES.lectureOverrides || {};
    return map[String(id)] || null;
  },
  _merge(seed) {
    const ov = this._override(seed.id);
    return ov ? { ...seed, ...ov } : { ...seed };
  },
  // listAll({ includeHidden }) — 기본은 hidden=true 항목을 제외(공개 화면용).
  // 관리자 화면에서는 includeHidden:true로 호출해 숨겨진 항목까지 본다.
  listAll(opts = {}) {
    const seedIds = new Set(this._seed().map((l) => String(l.id)));
    const merged = this._seed().map((l) => this._merge(l));
    const map = window.BGNJ_STORES.lectureOverrides || {};
    Object.entries(map).forEach(([id, ov]) => {
      if (!seedIds.has(String(id))) merged.push({ id, ...ov });
    });
    if (opts.includeHidden) return merged;
    return merged.filter((l) => !l.hidden);
  },
  getLecture(id) {
    return this.listAll({ includeHidden: true }).find((l) => String(l.id) === String(id)) || null;
  },
  saveLecture(payload) {
    const map = window.BGNJ_STORES.lectureOverrides || {};
    map[String(payload.id)] = { ...(map[String(payload.id)] || {}), ...payload, updatedAt: new Date().toISOString() };
    window.BGNJ_STORES.lectureOverrides = map;
    window.BGNJ_SAVE.lectureOverrides();
    return this.getLecture(payload.id);
  },
  // 숨김 토글 — 시드 항목은 절대 삭제되지 않고 hidden 플래그만 켠다.
  // 비관리자 화면에서는 hidden 항목이 보이지 않는다.
  setHidden(id, hidden) {
    const map = window.BGNJ_STORES.lectureOverrides || {};
    map[String(id)] = { ...(map[String(id)] || {}), hidden: !!hidden, updatedAt: new Date().toISOString() };
    window.BGNJ_STORES.lectureOverrides = map;
    window.BGNJ_SAVE.lectureOverrides();
  },
  // 삭제 — 시드 항목은 물리적으로 지울 수 없으므로 숨김 처리.
  // override-only(관리자가 추가한) 항목만 완전 삭제. 신청 데이터는 함께 정리.
  deleteLecture(id) {
    const seedIds = new Set(this._seed().map((l) => String(l.id)));
    const map = window.BGNJ_STORES.lectureOverrides || {};
    if (seedIds.has(String(id))) {
      // 시드 데이터는 hidden 처리만 가능
      map[String(id)] = { ...(map[String(id)] || {}), hidden: true, updatedAt: new Date().toISOString() };
    } else {
      delete map[String(id)];
    }
    window.BGNJ_STORES.lectureOverrides = map;
    window.BGNJ_SAVE.lectureOverrides();
    const reg = window.BGNJ_STORES.lectureRegistrations || {};
    delete reg[String(id)];
    window.BGNJ_STORES.lectureRegistrations = reg;
    window.BGNJ_SAVE.lectureRegistrations();
  },
  // ── 신청 ──────────────────────────────────────────────────────
  listRegistrations(lectureId) {
    const map = window.BGNJ_STORES.lectureRegistrations || {};
    return Array.isArray(map[String(lectureId)]) ? map[String(lectureId)].slice() : [];
  },
  _saveRegistrations(lectureId, list) {
    const map = window.BGNJ_STORES.lectureRegistrations || {};
    map[String(lectureId)] = list;
    window.BGNJ_STORES.lectureRegistrations = map;
    window.BGNJ_SAVE.lectureRegistrations();
  },
  getSeats(lectureId) {
    const lecture = this.getLecture(lectureId);
    const cap = lecture?.capacity || 0;
    const list = this.listRegistrations(lectureId);
    const active = list.filter((r) => r.status !== 'cancelled');
    const taken = active.filter((r) => r.status !== 'waitlist').reduce((s, r) => s + (r.count || 1), 0);
    const waitlist = active.filter((r) => r.status === 'waitlist').reduce((s, r) => s + (r.count || 1), 0);
    const remaining = Math.max(0, cap - taken);
    return { capacity: cap, taken, waitlist, remaining };
  },
  hasUserRegistered(lectureId, userId) {
    if (!userId) return null;
    return this.listRegistrations(lectureId).find((r) => r.userId === userId && r.status !== 'cancelled') || null;
  },
  register(lectureId, payload) {
    const userId = payload.userId;
    if (!userId) return { ok: false, message: "회원 가입 후 로그인해 주세요." };
    const existing = this.hasUserRegistered(lectureId, userId);
    if (existing) return { ok: false, message: "이미 신청된 강연입니다.", registration: existing };
    const lecture = this.getLecture(lectureId);
    if (!lecture) return { ok: false, message: "강연 정보를 찾을 수 없습니다." };
    const count = Math.max(1, Number(payload.count) || 1);
    const seats = this.getSeats(lectureId);
    const wantsConfirmed = (lecture.price || 0) === 0;
    let status;
    if (seats.remaining >= count) {
      status = wantsConfirmed ? 'confirmed' : 'pending_payment';
    } else {
      status = 'waitlist';
    }
    const reg = {
      id: `reg-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      lectureId: String(lectureId),
      userId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "",
      count,
      note: String(payload.note || "").trim(),
      price: lecture.price || 0,
      paid: false,
      status,
      createdAt: new Date().toISOString(),
    };
    const list = this.listRegistrations(lectureId);
    this._saveRegistrations(lectureId, [...list, reg]);
    return { ok: true, registration: reg };
  },
  cancelRegistration(lectureId, registrationId) {
    const list = this.listRegistrations(lectureId);
    const next = list.map((r) => r.id === registrationId ? { ...r, status: 'cancelled', cancelledAt: new Date().toISOString() } : r);
    this._saveRegistrations(lectureId, next);
    this._promoteWaitlist(lectureId);
    return next.find((r) => r.id === registrationId) || null;
  },
  requestRefund(lectureId, registrationId, reason) {
    const list = this.listRegistrations(lectureId);
    const reg = list.find((r) => r.id === registrationId);
    if (!reg) return { ok: false, message: '신청 내역을 찾을 수 없습니다.' };
    if (reg.status !== 'confirmed') return { ok: false, message: '참가 확정 상태에서만 환불 신청이 가능합니다.' };
    if (!String(reason || '').trim()) return { ok: false, message: '환불 사유를 입력해 주세요.' };
    const next = list.map((r) => r.id === registrationId
      ? { ...r, status: 'refund_requested', refundReason: String(reason).trim(), refundRequestedAt: new Date().toISOString(), _prevStatus: 'confirmed' }
      : r);
    this._saveRegistrations(lectureId, next);
    if (reg.userId) {
      const lecture = this.getLecture(lectureId);
      window.BGNJ_COMMUNITY.addNotification(reg.userId, {
        type: 'lecture_refund_requested', lectureId: String(lectureId),
        postTitle: lecture?.topic || lecture?.title || '강연',
        fromName: '운영자', message: '환불 신청이 접수되었습니다. 운영자 확인 후 처리됩니다.',
      });
      window.BGNJ_AUDIT?.log({ action: 'lecture.refund_request', target: `lecture:${lectureId}`, details: { reg: registrationId, reason } });
    }
    return { ok: true, registration: next.find((r) => r.id === registrationId) };
  },
  approveRefund(lectureId, registrationId) {
    const list = this.listRegistrations(lectureId);
    const reg = list.find((r) => r.id === registrationId);
    const next = list.map((r) => r.id === registrationId
      ? { ...r, status: 'cancelled', refundApprovedAt: new Date().toISOString(), cancelledAt: new Date().toISOString() }
      : r);
    this._saveRegistrations(lectureId, next);
    this._promoteWaitlist(lectureId);
    if (reg?.userId) {
      const lecture = this.getLecture(lectureId);
      window.BGNJ_COMMUNITY.addNotification(reg.userId, {
        type: 'lecture_refund_approved', lectureId: String(lectureId),
        postTitle: lecture?.topic || lecture?.title || '강연',
        fromName: '운영자', message: '환불 신청이 승인되어 처리되었습니다.',
      });
      window.BGNJ_AUDIT?.log({ action: 'lecture.refund_approve', target: `lecture:${lectureId}`, details: { reg: registrationId } });
    }
    return next.find((r) => r.id === registrationId) || null;
  },
  rejectRefund(lectureId, registrationId, adminNote) {
    const list = this.listRegistrations(lectureId);
    const reg = list.find((r) => r.id === registrationId);
    const next = list.map((r) => r.id === registrationId
      ? { ...r, status: 'confirmed', refundRejectedAt: new Date().toISOString(), refundAdminNote: String(adminNote || '').trim(), _prevStatus: undefined }
      : r);
    this._saveRegistrations(lectureId, next);
    if (reg?.userId) {
      const lecture = this.getLecture(lectureId);
      window.BGNJ_COMMUNITY.addNotification(reg.userId, {
        type: 'lecture_refund_rejected', lectureId: String(lectureId),
        postTitle: lecture?.topic || lecture?.title || '강연',
        fromName: '운영자', message: `환불 신청이 반려되었습니다.${adminNote ? ' 사유: ' + adminNote : ''}`,
      });
      window.BGNJ_AUDIT?.log({ action: 'lecture.refund_reject', target: `lecture:${lectureId}`, details: { reg: registrationId, note: adminNote } });
    }
    return next.find((r) => r.id === registrationId) || null;
  },
  confirmPayment(lectureId, registrationId) {
    const list = this.listRegistrations(lectureId);
    const next = list.map((r) => (
      r.id === registrationId
        ? { ...r, paid: true, status: 'confirmed', confirmedAt: new Date().toISOString() }
        : r
    ));
    this._saveRegistrations(lectureId, next);
    const updated = next.find((r) => r.id === registrationId) || null;
    if (updated && updated.userId) {
      const lecture = this.getLecture(lectureId);
      window.BGNJ_COMMUNITY.addNotification(updated.userId, {
        type: 'lecture_confirmed',
        lectureId: String(lectureId),
        postTitle: lecture?.topic || lecture?.title || '강연',
        fromName: '운영자',
        message: '강연 입금이 확인되어 참가가 확정되었습니다.',
      });
      window.BGNJ_AUDIT?.log({ action: 'lecture.confirm_payment', target: `lecture:${lectureId}`, details: { reg: registrationId, user: updated.userId } });
    }
    return updated;
  },
  unconfirmPayment(lectureId, registrationId) {
    const list = this.listRegistrations(lectureId);
    const next = list.map((r) => (
      r.id === registrationId
        ? { ...r, paid: false, status: 'pending_payment', confirmedAt: null }
        : r
    ));
    this._saveRegistrations(lectureId, next);
    return next.find((r) => r.id === registrationId) || null;
  },
  _promoteWaitlist(lectureId) {
    const lecture = this.getLecture(lectureId);
    if (!lecture) return;
    const list = this.listRegistrations(lectureId);
    const seats = this.getSeats(lectureId);
    let remaining = seats.remaining;
    const next = list.slice();
    const promotedUsers = [];
    for (let i = 0; i < next.length && remaining > 0; i += 1) {
      const r = next[i];
      if (r.status !== 'waitlist') continue;
      if (r.count > remaining) continue;
      const promoted = (lecture.price || 0) === 0 ? 'confirmed' : 'pending_payment';
      next[i] = { ...r, status: promoted, promotedAt: new Date().toISOString() };
      promotedUsers.push({ userId: r.userId, status: promoted });
      remaining -= r.count;
    }
    this._saveRegistrations(lectureId, next);
    promotedUsers.forEach(({ userId, status }) => {
      if (!userId) return;
      window.BGNJ_COMMUNITY.addNotification(userId, {
        type: 'lecture_promoted',
        lectureId: String(lectureId),
        postTitle: lecture.topic || lecture.title || '강연',
        fromName: '운영자',
        message: status === 'confirmed'
          ? '대기자에서 참가가 확정되었습니다.'
          : '대기자에서 입금 대기로 전환되었습니다. 안내 계좌로 입금해 주세요.',
      });
    });
  },
  listMyRegistrations(userId) {
    if (!userId) return [];
    const map = window.BGNJ_STORES.lectureRegistrations || {};
    const out = [];
    Object.keys(map).forEach((lectureId) => {
      (map[lectureId] || []).forEach((r) => {
        if (r.userId === userId) out.push({ ...r, lecture: this.getLecture(lectureId) });
      });
    });
    return out.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  },
  // ── .ics ──────────────────────────────────────────────────────
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
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wangsadeul//Lecture//KO',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:lecture-${lecture.id}@bgnj`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${escape(lecture.topic || lecture.title)}`,
      `LOCATION:${escape(lecture.venue || '')}`,
      `DESCRIPTION:${escape((lecture.host ? `진행: ${lecture.host}\n` : '') + (lecture.note || ''))}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ];
    return lines.join('\r\n');
  },
  downloadIcs(lectureId) {
    const lecture = this.getLecture(lectureId);
    const ics = this.generateIcs(lecture);
    if (!ics) return false;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lecture-${lecture.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  },
  // ── 후기 ──────────────────────────────────────────────────────
  listReviews(lectureId) {
    const map = window.BGNJ_STORES.lectureReviews || {};
    return Array.isArray(map[String(lectureId)]) ? map[String(lectureId)].slice() : [];
  },
  _saveReviews(lectureId, list) {
    const map = window.BGNJ_STORES.lectureReviews || {};
    map[String(lectureId)] = list;
    window.BGNJ_STORES.lectureReviews = map;
    window.BGNJ_SAVE.lectureReviews();
  },
  canReview(lectureId, userId) {
    if (!userId) return false;
    const my = this.listRegistrations(lectureId).find((r) => r.userId === userId && r.status === 'confirmed');
    return !!my;
  },
  addReview(lectureId, payload) {
    const review = {
      id: `lec-rev-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      lectureId: String(lectureId),
      userId: payload.userId || null,
      author: payload.author || '익명',
      rating: Math.max(1, Math.min(5, Number(payload.rating) || 5)),
      text: String(payload.text || '').trim(),
      createdAt: new Date().toISOString(),
    };
    if (!review.text) return null;
    this._saveReviews(lectureId, [review, ...this.listReviews(lectureId)]);
    return review;
  },
  deleteReview(lectureId, reviewId) {
    const next = this.listReviews(lectureId).filter((r) => r.id !== reviewId);
    this._saveReviews(lectureId, next);
    return next;
  },
  // ── 계좌번호 ──────────────────────────────────────────────────
  getBankAccount() {
    return { ...(window.BGNJ_STORES.bankAccount || {}) };
  },
  saveBankAccount(payload) {
    window.BGNJ_STORES.bankAccount = { ...(window.BGNJ_STORES.bankAccount || {}), ...payload };
    window.BGNJ_SAVE.bankAccount();
    return this.getBankAccount();
  },
};

// === 책 주문(BGNJ_BOOK_ORDERS) helper ====================================
// 운영 정책:
//   - 회원 전용 주문. 비로그인은 결제 진입 자체를 막음.
//   - 결제는 무통장 입금만. PG는 별도 단계에서 도입.
//   - 상태: pending_payment → paid → shipped → delivered. 운영자가 단계별로 진행.
//   - 'cancelled' 는 운영자/사용자가 명시적으로 취소.
//   - 계좌번호는 강연과 동일한 `BGNJ_STORES.bankAccount` 재사용.
window.BGNJ_BOOK_ORDERS = {
  ORDER_STATUSES: ['pending_payment', 'paid', 'shipped', 'delivered', 'refund_requested', 'cancelled'],

  listAll() {
    return (window.BGNJ_STORES.bookOrders || []).slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  },
  listByStatus(status) {
    if (!status || status === 'all') return this.listAll();
    return this.listAll().filter((o) => o.status === status);
  },
  listMine(userId) {
    if (!userId) return [];
    return this.listAll().filter((o) => o.userId === userId);
  },
  getOrder(id) {
    return this.listAll().find((o) => o.id === id) || null;
  },
  _save(list) {
    window.BGNJ_STORES.bookOrders = list;
    window.BGNJ_SAVE.bookOrders();
  },
  countOpenOrders() {
    return (window.BGNJ_STORES.bookOrders || []).filter((o) => o.status === 'pending_payment').length;
  },
  generateOrderNo(now) {
    const d = now || new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
    const seq = (window.BGNJ_STORES.bookOrders || []).filter((o) => String(o.orderNo || '').includes(stamp)).length + 1;
    return `WSD-${stamp}-${String(seq).padStart(3, '0')}`;
  },
  createOrder(payload) {
    if (!payload.userId) return { ok: false, message: "회원 가입 후 로그인해 주세요." };
    if (!payload.recipient || !payload.phone || !payload.address) {
      return { ok: false, message: "받는 분, 연락처, 주소는 필수입니다." };
    }
    const book = window.BANGINOJA_DATA?.book;
    if (!book) return { ok: false, message: "책 정보가 없습니다." };
    const qty = Math.max(1, Number(payload.qty) || 1);
    const version = payload.version === 'EN' ? 'EN' : 'KR';
    const unit = version === 'EN' ? book.priceEN : book.priceKR;
    const subtotal = unit * qty;
    const shipping = subtotal >= 30000 ? 0 : 3000;
    const total = subtotal + shipping;
    const now = new Date();
    const order = {
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      orderNo: this.generateOrderNo(now),
      userId: payload.userId,
      version,
      qty,
      unit,
      subtotal,
      shipping,
      total,
      recipient: String(payload.recipient || '').trim(),
      phone: String(payload.phone || '').trim(),
      address: String(payload.address || '').trim(),
      addressDetail: String(payload.addressDetail || '').trim(),
      memo: String(payload.memo || '').trim(),
      status: 'pending_payment',
      paid: false,
      tracking: '',
      createdAt: now.toISOString(),
    };
    this._save([order, ...(window.BGNJ_STORES.bookOrders || [])]);
    return { ok: true, order };
  },
  _notify(order, type, message) {
    if (!order || !order.userId) return;
    window.BGNJ_COMMUNITY.addNotification(order.userId, {
      type,
      orderId: order.id,
      orderNo: order.orderNo,
      postTitle: `『왕의길』 주문 ${order.orderNo}`,
      fromName: '운영자',
      message,
    });
  },
  confirmPayment(id) {
    const list = (window.BGNJ_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, paid: true, status: 'paid', paidAt: new Date().toISOString() } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_paid', '입금이 확인되어 발송 준비를 시작합니다.');
    if (updated) window.BGNJ_AUDIT?.log({ action: 'book.confirm_payment', target: `order:${updated.orderNo}` });
    return updated;
  },
  unconfirmPayment(id) {
    const list = (window.BGNJ_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, paid: false, status: 'pending_payment', paidAt: null, shippedAt: null, tracking: '' } : o
    );
    this._save(list);
    return list.find((o) => o.id === id) || null;
  },
  markShipped(id, tracking) {
    const list = (window.BGNJ_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: 'shipped', tracking: tracking || o.tracking || '', shippedAt: new Date().toISOString() } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_shipped',
      updated?.tracking ? `발송이 시작되었습니다. 송장 번호 ${updated.tracking}.` : '발송이 시작되었습니다.');
    if (updated) window.BGNJ_AUDIT?.log({ action: 'book.ship', target: `order:${updated.orderNo}`, details: { tracking: updated.tracking || '' } });
    return updated;
  },
  markDelivered(id) {
    const list = (window.BGNJ_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: 'delivered', deliveredAt: new Date().toISOString() } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_delivered', '배송이 완료되었습니다. 즐거운 독서 되세요.');
    if (updated) window.BGNJ_AUDIT?.log({ action: 'book.deliver', target: `order:${updated.orderNo}` });
    return updated;
  },
  cancelOrder(id) {
    const list = (window.BGNJ_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: 'cancelled', cancelledAt: new Date().toISOString() } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_cancelled', '주문이 취소되었습니다.');
    if (updated) window.BGNJ_AUDIT?.log({ action: 'book.cancel', target: `order:${updated.orderNo}` });
    return updated;
  },
  requestRefund(id, reason) {
    const order = this.getOrder(id);
    if (!order) return { ok: false, message: '주문을 찾을 수 없습니다.' };
    if (!['paid', 'shipped'].includes(order.status)) return { ok: false, message: '입금 확인 또는 배송 중 단계에서만 환불 신청이 가능합니다.' };
    const list = (window.BGNJ_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: 'refund_requested', refundReason: String(reason || '').trim(), refundRequestedAt: new Date().toISOString(), _prevStatus: o.status } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_refund_requested', '환불 신청이 접수되었습니다. 운영자 확인 후 처리됩니다.');
    if (updated) window.BGNJ_AUDIT?.log({ action: 'book.refund_request', target: `order:${updated.orderNo}`, details: { reason: updated.refundReason } });
    return { ok: true, order: updated };
  },
  approveRefund(id) {
    const list = (window.BGNJ_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: 'cancelled', refundApprovedAt: new Date().toISOString(), cancelledAt: new Date().toISOString() } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_cancelled', '환불 신청이 승인되어 처리되었습니다.');
    if (updated) window.BGNJ_AUDIT?.log({ action: 'book.refund_approve', target: `order:${updated.orderNo}` });
    return updated;
  },
  rejectRefund(id, adminNote) {
    const list = (window.BGNJ_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: o._prevStatus || 'paid', refundRejectedAt: new Date().toISOString(), refundAdminNote: String(adminNote || '').trim(), _prevStatus: undefined } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_refund_rejected', `환불 신청이 반려되었습니다.${adminNote ? ' 사유: ' + adminNote : ''}`);
    if (updated) window.BGNJ_AUDIT?.log({ action: 'book.refund_reject', target: `order:${updated.orderNo}`, details: { note: adminNote } });
    return updated;
  },
  // ── 영수증 ──────────────────────────────────────────────────
  generateReceipt(id) {
    const order = this.getOrder(id);
    if (!order) return null;
    const bank = window.BGNJ_LECTURES?.getBankAccount?.() || {};
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
    a.href = url;
    a.download = `receipt-${order.orderNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  },

  exportCsv() {
    const header = ['orderNo', 'date', 'userId', 'recipient', 'phone', 'address', 'version', 'qty', 'total', 'status', 'paid', 'tracking'];
    const rows = this.listAll().map((o) => [
      o.orderNo, o.createdAt, o.userId, o.recipient, o.phone,
      `${o.address} ${o.addressDetail || ''}`.trim(), o.version, o.qty, o.total, o.status, o.paid ? 'Y' : 'N', o.tracking || '',
    ]);
    return [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
  },

  // ── 독자 리뷰 ──────────────────────────────────────────────────────────
  _saveReviews(list) {
    window.BGNJ_STORES.bookReviews = list;
    window.BGNJ_SAVE.bookReviews();
  },
  listReviews() {
    return (window.BGNJ_STORES.bookReviews || []).slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  },
  canReview(userId) {
    if (!userId) return false;
    return this.listMine(userId).some((o) => o.status === 'delivered');
  },
  hasReviewed(userId) {
    if (!userId) return false;
    return (window.BGNJ_STORES.bookReviews || []).some((r) => r.userId === userId);
  },
  addReview({ userId, userName, rating, text }) {
    if (!userId) return { ok: false, message: "로그인 후 이용해 주세요." };
    if (!this.canReview(userId)) return { ok: false, message: "배송 완료된 주문이 있어야 리뷰를 작성할 수 있습니다." };
    if (this.hasReviewed(userId)) return { ok: false, message: "이미 리뷰를 작성하셨습니다." };
    const r = Number(rating);
    if (!r || r < 1 || r > 5) return { ok: false, message: "별점(1~5)을 선택해 주세요." };
    if (!String(text || '').trim()) return { ok: false, message: "리뷰 내용을 입력해 주세요." };
    const review = {
      id: `br-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      userId,
      userName: String(userName || ''),
      rating: r,
      text: String(text).trim(),
      createdAt: new Date().toISOString(),
    };
    this._saveReviews([review, ...this.listReviews()]);
    return { ok: true, review };
  },
  deleteReview(reviewId) {
    this._saveReviews(this.listReviews().filter((r) => r.id !== reviewId));
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
  _seed() { return (window.BANGINOJA_DATA?.tours || []).slice(); },
  _override(id) {
    const map = window.BGNJ_STORES.tourOverrides || {};
    return map[String(id)] || null;
  },
  _merge(seed) {
    const ov = this._override(seed.id);
    return ov ? { ...seed, ...ov } : { ...seed };
  },
  listAll() {
    const seedIds = new Set(this._seed().map((t) => String(t.id)));
    const merged = this._seed().map((t) => this._merge(t));
    const map = window.BGNJ_STORES.tourOverrides || {};
    Object.entries(map).forEach(([id, ov]) => {
      if (!seedIds.has(String(id))) merged.push({ id, ...ov });
    });
    if (arguments[0] && arguments[0].includeHidden) return merged;
    return merged.filter((t) => !t.hidden);
  },
  getTour(id) {
    return this.listAll({ includeHidden: true }).find((t) => String(t.id) === String(id)) || null;
  },
  saveTour(payload) {
    const map = window.BGNJ_STORES.tourOverrides || {};
    map[String(payload.id)] = { ...(map[String(payload.id)] || {}), ...payload, updatedAt: new Date().toISOString() };
    window.BGNJ_STORES.tourOverrides = map;
    window.BGNJ_SAVE.tourOverrides();
    return this.getTour(payload.id);
  },
  // 숨김 토글 — 시드 항목은 hidden 플래그만 켜고 데이터는 보존.
  setHidden(id, hidden) {
    const map = window.BGNJ_STORES.tourOverrides || {};
    map[String(id)] = { ...(map[String(id)] || {}), hidden: !!hidden, updatedAt: new Date().toISOString() };
    window.BGNJ_STORES.tourOverrides = map;
    window.BGNJ_SAVE.tourOverrides();
  },
  // 삭제 — 시드 항목은 hidden 처리, override-only는 완전 삭제.
  deleteTour(id) {
    const seedIds = new Set(this._seed().map((t) => String(t.id)));
    const map = window.BGNJ_STORES.tourOverrides || {};
    if (seedIds.has(String(id))) {
      map[String(id)] = { ...(map[String(id)] || {}), hidden: true, updatedAt: new Date().toISOString() };
    } else {
      delete map[String(id)];
    }
    window.BGNJ_STORES.tourOverrides = map;
    window.BGNJ_SAVE.tourOverrides();
    const reg = window.BGNJ_STORES.tourReservations || {};
    delete reg[String(id)];
    window.BGNJ_STORES.tourReservations = reg;
    window.BGNJ_SAVE.tourReservations();
  },
  // ── 예약 ──────────────────────────────────────────────────────
  listReservations(tourId) {
    const map = window.BGNJ_STORES.tourReservations || {};
    return Array.isArray(map[String(tourId)]) ? map[String(tourId)].slice() : [];
  },
  _saveReservations(tourId, list) {
    const map = window.BGNJ_STORES.tourReservations || {};
    map[String(tourId)] = list;
    window.BGNJ_STORES.tourReservations = map;
    window.BGNJ_SAVE.tourReservations();
  },
  getSeats(tourId) {
    const tour = this.getTour(tourId);
    const cap = tour?.capacity || 0;
    const list = this.listReservations(tourId);
    const active = list.filter((r) => r.status !== 'cancelled');
    const taken = active.filter((r) => r.status !== 'waitlist').reduce((s, r) => s + (r.count || 1), 0);
    const waitlist = active.filter((r) => r.status === 'waitlist').reduce((s, r) => s + (r.count || 1), 0);
    const remaining = Math.max(0, cap - taken);
    return { capacity: cap, taken, waitlist, remaining };
  },
  hasUserReserved(tourId, userId) {
    if (!userId) return null;
    return this.listReservations(tourId).find((r) => r.userId === userId && r.status !== 'cancelled') || null;
  },
  reserve(tourId, payload) {
    const userId = payload.userId;
    if (!userId) return { ok: false, message: "회원 가입 후 로그인해 주세요." };
    const existing = this.hasUserReserved(tourId, userId);
    if (existing) return { ok: false, message: "이미 신청된 답사입니다.", reservation: existing };
    const tour = this.getTour(tourId);
    if (!tour) return { ok: false, message: "투어 정보를 찾을 수 없습니다." };
    const count = Math.max(1, Number(payload.count) || 1);
    const price = tour.priceNumber || 0;
    const seats = this.getSeats(tourId);
    let status;
    if (seats.remaining >= count) {
      status = price === 0 ? 'confirmed' : 'pending_payment';
    } else {
      status = 'waitlist';
    }
    const reg = {
      id: `tour-reg-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      tourId: String(tourId),
      userId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "",
      count,
      note: String(payload.note || "").trim(),
      price,
      paid: false,
      status,
      createdAt: new Date().toISOString(),
    };
    const list = this.listReservations(tourId);
    this._saveReservations(tourId, [...list, reg]);
    return { ok: true, reservation: reg };
  },
  cancelReservation(tourId, reservationId) {
    const list = this.listReservations(tourId);
    const next = list.map((r) => r.id === reservationId ? { ...r, status: 'cancelled', cancelledAt: new Date().toISOString() } : r);
    this._saveReservations(tourId, next);
    this._promoteWaitlist(tourId);
    return next.find((r) => r.id === reservationId) || null;
  },
  requestRefund(tourId, reservationId, reason) {
    const list = this.listReservations(tourId);
    const reg = list.find((r) => r.id === reservationId);
    if (!reg) return { ok: false, message: '예약 내역을 찾을 수 없습니다.' };
    if (reg.status !== 'confirmed') return { ok: false, message: '참가 확정 상태에서만 환불 신청이 가능합니다.' };
    if (!String(reason || '').trim()) return { ok: false, message: '환불 사유를 입력해 주세요.' };
    const next = list.map((r) => r.id === reservationId
      ? { ...r, status: 'refund_requested', refundReason: String(reason).trim(), refundRequestedAt: new Date().toISOString(), _prevStatus: 'confirmed' }
      : r);
    this._saveReservations(tourId, next);
    if (reg.userId) {
      const tour = this.getTour(tourId);
      window.BGNJ_COMMUNITY.addNotification(reg.userId, {
        type: 'tour_refund_requested', tourId: String(tourId),
        postTitle: tour?.title || '답사',
        fromName: '운영자', message: '환불 신청이 접수되었습니다. 운영자 확인 후 처리됩니다.',
      });
      window.BGNJ_AUDIT?.log({ action: 'tour.refund_request', target: `tour:${tourId}`, details: { reg: reservationId, reason } });
    }
    return { ok: true, reservation: next.find((r) => r.id === reservationId) };
  },
  approveRefund(tourId, reservationId) {
    const list = this.listReservations(tourId);
    const reg = list.find((r) => r.id === reservationId);
    const next = list.map((r) => r.id === reservationId
      ? { ...r, status: 'cancelled', refundApprovedAt: new Date().toISOString(), cancelledAt: new Date().toISOString() }
      : r);
    this._saveReservations(tourId, next);
    this._promoteWaitlist(tourId);
    if (reg?.userId) {
      const tour = this.getTour(tourId);
      window.BGNJ_COMMUNITY.addNotification(reg.userId, {
        type: 'tour_refund_approved', tourId: String(tourId),
        postTitle: tour?.title || '답사',
        fromName: '운영자', message: '환불 신청이 승인되어 처리되었습니다.',
      });
      window.BGNJ_AUDIT?.log({ action: 'tour.refund_approve', target: `tour:${tourId}`, details: { reg: reservationId } });
    }
    return next.find((r) => r.id === reservationId) || null;
  },
  rejectRefund(tourId, reservationId, adminNote) {
    const list = this.listReservations(tourId);
    const reg = list.find((r) => r.id === reservationId);
    const next = list.map((r) => r.id === reservationId
      ? { ...r, status: 'confirmed', refundRejectedAt: new Date().toISOString(), refundAdminNote: String(adminNote || '').trim(), _prevStatus: undefined }
      : r);
    this._saveReservations(tourId, next);
    if (reg?.userId) {
      const tour = this.getTour(tourId);
      window.BGNJ_COMMUNITY.addNotification(reg.userId, {
        type: 'tour_refund_rejected', tourId: String(tourId),
        postTitle: tour?.title || '답사',
        fromName: '운영자', message: `환불 신청이 반려되었습니다.${adminNote ? ' 사유: ' + adminNote : ''}`,
      });
      window.BGNJ_AUDIT?.log({ action: 'tour.refund_reject', target: `tour:${tourId}`, details: { reg: reservationId, note: adminNote } });
    }
    return next.find((r) => r.id === reservationId) || null;
  },
  confirmPayment(tourId, reservationId) {
    const list = this.listReservations(tourId);
    const next = list.map((r) => (
      r.id === reservationId
        ? { ...r, paid: true, status: 'confirmed', confirmedAt: new Date().toISOString() }
        : r
    ));
    this._saveReservations(tourId, next);
    const updated = next.find((r) => r.id === reservationId) || null;
    if (updated && updated.userId) {
      const tour = this.getTour(tourId);
      window.BGNJ_COMMUNITY.addNotification(updated.userId, {
        type: 'tour_confirmed',
        tourId: String(tourId),
        postTitle: tour?.title || '답사',
        fromName: '운영자',
        message: '답사 입금이 확인되어 참가가 확정되었습니다.',
      });
      window.BGNJ_AUDIT?.log({ action: 'tour.confirm_payment', target: `tour:${tourId}`, details: { reg: reservationId, user: updated.userId } });
    }
    return updated;
  },
  unconfirmPayment(tourId, reservationId) {
    const list = this.listReservations(tourId);
    const next = list.map((r) => (
      r.id === reservationId
        ? { ...r, paid: false, status: 'pending_payment', confirmedAt: null }
        : r
    ));
    this._saveReservations(tourId, next);
    return next.find((r) => r.id === reservationId) || null;
  },
  _promoteWaitlist(tourId) {
    const tour = this.getTour(tourId);
    if (!tour) return;
    const list = this.listReservations(tourId);
    const seats = this.getSeats(tourId);
    let remaining = seats.remaining;
    const next = list.slice();
    const promotedUsers = [];
    for (let i = 0; i < next.length && remaining > 0; i += 1) {
      const r = next[i];
      if (r.status !== 'waitlist') continue;
      if (r.count > remaining) continue;
      const promoted = (tour.priceNumber || 0) === 0 ? 'confirmed' : 'pending_payment';
      next[i] = { ...r, status: promoted, promotedAt: new Date().toISOString() };
      promotedUsers.push({ userId: r.userId, status: promoted });
      remaining -= r.count;
    }
    this._saveReservations(tourId, next);
    promotedUsers.forEach(({ userId, status }) => {
      if (!userId) return;
      window.BGNJ_COMMUNITY.addNotification(userId, {
        type: 'tour_promoted',
        tourId: String(tourId),
        postTitle: tour.title || '답사',
        fromName: '운영자',
        message: status === 'confirmed'
          ? '대기자에서 참가가 확정되었습니다.'
          : '대기자에서 입금 대기로 전환되었습니다. 안내 계좌로 입금해 주세요.',
      });
    });
  },
  listMyReservations(userId) {
    if (!userId) return [];
    const map = window.BGNJ_STORES.tourReservations || {};
    const out = [];
    Object.keys(map).forEach((tourId) => {
      (map[tourId] || []).forEach((r) => {
        if (r.userId === userId) out.push({ ...r, tour: this.getTour(tourId) });
      });
    });
    return out.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  },
  // ── .ics ──────────────────────────────────────────────────────
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
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wangsadeul//Tour//KO',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:tour-${tour.id}@bgnj`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${escape(tour.title || '답사')}`,
      `LOCATION:${escape(tour.title || '')}`,
      `DESCRIPTION:${escape(tour.desc || '')}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ];
    return lines.join('\r\n');
  },
  downloadIcs(tourId) {
    const tour = this.getTour(tourId);
    const ics = this.generateIcs(tour);
    if (!ics) return false;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tour-${tour.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  },

  // ── 후기 ──────────────────────────────────────────────────────
  listReviews(tourId) {
    const map = window.BGNJ_STORES.tourReviews || {};
    return Array.isArray(map[String(tourId)]) ? map[String(tourId)].slice() : [];
  },
  _saveReviews(tourId, list) {
    const map = window.BGNJ_STORES.tourReviews || {};
    map[String(tourId)] = list;
    window.BGNJ_STORES.tourReviews = map;
    window.BGNJ_SAVE.tourReviews();
  },
  canReview(tourId, userId) {
    if (!userId) return false;
    const my = this.listReservations(tourId).find((r) => r.userId === userId && r.status === 'confirmed');
    return !!my;
  },
  addReview(tourId, payload) {
    const review = {
      id: `tour-rev-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      tourId: String(tourId),
      userId: payload.userId || null,
      author: payload.author || '익명',
      rating: Math.max(1, Math.min(5, Number(payload.rating) || 5)),
      text: String(payload.text || '').trim(),
      createdAt: new Date().toISOString(),
    };
    if (!review.text) return null;
    this._saveReviews(tourId, [review, ...this.listReviews(tourId)]);
    return review;
  },
  deleteReview(tourId, reviewId) {
    const next = this.listReviews(tourId).filter((r) => r.id !== reviewId);
    this._saveReviews(tourId, next);
    return next;
  },
};

// === 운영 감사 로그(BGNJ_AUDIT) ============================================
// 운영자(혹은 시스템)가 데이터를 변경할 때마다 한 줄 기록한다. 최근 500건 유지.
window.BGNJ_AUDIT = {
  log({ action, target, details, by }) {
    const entry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      action: String(action || '').trim(),
      target: String(target || ''),
      details: details || null,
      by: by || (window.BGNJ_STORES.session?.name) || 'system',
      byId: window.BGNJ_STORES.session?.id || null,
      ts: new Date().toISOString(),
    };
    const list = [entry, ...(window.BGNJ_STORES.auditLog || [])].slice(0, 500);
    window.BGNJ_STORES.auditLog = list;
    window.BGNJ_SAVE.auditLog();
    return entry;
  },
  list({ search = '', limit = 200 } = {}) {
    const all = (window.BGNJ_STORES.auditLog || []).slice();
    if (!search) return all.slice(0, limit);
    const q = String(search).toLowerCase();
    return all.filter((e) =>
      String(e.action || '').toLowerCase().includes(q)
      || String(e.target || '').toLowerCase().includes(q)
      || String(e.by || '').toLowerCase().includes(q)
    ).slice(0, limit);
  },
  clear() {
    window.BGNJ_STORES.auditLog = [];
    window.BGNJ_SAVE.auditLog();
  },
};

// === 자동 등급 승격(BGNJ_GRADE_PROMO) ====================================
// 활동(글 + 댓글 가중치)을 기준으로 사용자의 자격 등급을 평가.
// 운영자는 admin / wangsanam 등급은 자동 변경하지 않으며, 기본 흐름은 회원이 활동을
// 쌓을 때만 더 높은 등급으로 '승격'한다(강등은 없음).
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
  // 사용자 행동 후 호출 — 새 등급이 더 높을 때만 승격
  maybePromote(userId) {
    const user = (window.BGNJ_STORES.users || []).find((u) => u.id === userId);
    if (!user) return null;
    if (user.isAdmin) return null;
    if (PROMOTION_PROTECTED.has(user.gradeId)) return null;
    const grades = window.BGNJ_STORES.grades || [];
    const currentLv = grades.find((g) => g.id === user.gradeId)?.level ?? 0;
    const targetId = this.evaluate(userId);
    const targetLv = grades.find((g) => g.id === targetId)?.level ?? 0;
    if (targetLv <= currentLv) return null;
    window.BGNJ_AUTH.setGrade(userId, targetId);
    window.BGNJ_AUDIT?.log({
      action: 'grade.auto_promote',
      target: `user:${userId}`,
      details: { from: user.gradeId, to: targetId },
      by: 'system',
    });
    window.BGNJ_COMMUNITY?.addNotification(userId, {
      type: 'grade_promoted',
      postTitle: '회원 등급 안내',
      fromName: '운영자',
      message: `활동을 기반으로 등급이 ${grades.find((g) => g.id === targetId)?.label || targetId}(으)로 승격되었습니다.`,
    });
    return targetId;
  },
};

// === 사이트 콘텐츠(BGNJ_SITE_CONTENT) helper =============================
// 메뉴 라벨, 히어로/푸터 텍스트, 로고/파비콘, OG 메타를 묶어 관리한다.
// `get()`은 항상 기본값과 사용자 편집값을 섹션 단위로 얕은 병합해 반환한다.
window.BGNJ_SITE_CONTENT = {
  defaults: DEFAULT_SITE_CONTENT,
  get() {
    const stored = window.BGNJ_STORES.siteContent || {};
    const merged = {};
    for (const key of Object.keys(DEFAULT_SITE_CONTENT)) {
      merged[key] = { ...DEFAULT_SITE_CONTENT[key], ...((stored[key] && typeof stored[key] === 'object') ? stored[key] : {}) };
    }
    return merged;
  },
  saveSection(section, patch) {
    const cur = window.BGNJ_STORES.siteContent || {};
    const next = { ...cur, [section]: { ...(cur[section] || {}), ...patch } };
    window.BGNJ_STORES.siteContent = next;
    window.BGNJ_SAVE.siteContent();
    this.applyHead();
    return next;
  },
  resetSection(section) {
    const cur = window.BGNJ_STORES.siteContent || {};
    const next = { ...cur };
    delete next[section];
    window.BGNJ_STORES.siteContent = next;
    window.BGNJ_SAVE.siteContent();
    this.applyHead();
    return next;
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
window.BGNJ_BOOKS = {
  list({ status } = {}) {
    const all = (window.BGNJ_STORES.books || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (status) return all.filter((b) => (b.status || 'published') === status);
    return all;
  },
  get(id) {
    if (!id) return null;
    return (window.BGNJ_STORES.books || []).find((b) => b.id === id) || null;
  },
  // primary=true 표시된 책 또는 첫 번째 published 책 반환. 없으면 null.
  primary() {
    const books = this.list();
    return books.find((b) => b.primary && (b.status || 'published') === 'published')
      || books.find((b) => (b.status || 'published') === 'published')
      || null;
  },
  _persist(next) {
    window.BGNJ_STORES.books = next;
    window.BGNJ_SAVE.books();
  },
  create(payload = {}) {
    const id = payload.id || `book-${Date.now()}-${Math.random().toString(36).slice(2,5)}`;
    const next = (window.BGNJ_STORES.books || []).slice();
    next.push({
      id,
      slug: payload.slug || id,
      title: String(payload.title || '제목 없음'),
      subtitle: String(payload.subtitle || ''),
      author: String(payload.author || '뱅기노자'),
      publisher: String(payload.publisher || ''),
      pages: Number(payload.pages || 0),
      isbn: String(payload.isbn || ''),
      priceKR: Number(payload.priceKR || 0),
      priceEN: Number(payload.priceEN || 0),
      desc: String(payload.desc || ''),
      intro: String(payload.intro || ''),
      chapters: Array.isArray(payload.chapters) ? payload.chapters.slice() : [],
      authorBio: String(payload.authorBio || ''),
      coverDataUri: String(payload.coverDataUri || ''),
      pdfPreviewDataUri: String(payload.pdfPreviewDataUri || ''),
      badges: Array.isArray(payload.badges) ? payload.badges.slice() : [],
      status: payload.status || 'published',
      publishedAt: payload.publishedAt || new Date().toISOString().slice(0, 10),
      primary: !!payload.primary,
      order: Number.isFinite(payload.order) ? payload.order : next.length,
      reviews: [],
    });
    this._persist(next);
    return this.get(id);
  },
  update(id, patch = {}) {
    const next = (window.BGNJ_STORES.books || []).slice();
    const idx = next.findIndex((b) => b.id === id);
    if (idx < 0) return null;
    next[idx] = { ...next[idx], ...patch };
    // primary는 한 권만 — 다른 책의 primary는 false로
    if (patch.primary === true) {
      next.forEach((b, i) => { if (i !== idx) b.primary = false; });
    }
    this._persist(next);
    return next[idx];
  },
  remove(id) {
    const next = (window.BGNJ_STORES.books || []).filter((b) => b.id !== id);
    this._persist(next);
  },
  reorder(ids) {
    const map = Object.fromEntries((window.BGNJ_STORES.books || []).map((b) => [b.id, b]));
    const next = ids.map((id, i) => map[id] && { ...map[id], order: i }).filter(Boolean);
    if (next.length) this._persist(next);
  },
  // 책별 리뷰
  addReview(id, payload) {
    const book = this.get(id);
    if (!book) return null;
    const review = {
      id: `rv-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      userId: payload.userId || null,
      userName: String(payload.userName || '익명'),
      rating: Math.max(1, Math.min(5, Number(payload.rating || 5))),
      text: String(payload.text || '').trim(),
      createdAt: new Date().toISOString(),
    };
    return this.update(id, { reviews: [review, ...(book.reviews || [])] });
  },
  removeReview(id, reviewId) {
    const book = this.get(id);
    if (!book) return null;
    return this.update(id, { reviews: (book.reviews || []).filter((r) => r.id !== reviewId) });
  },
};

// === 약관 / 개인정보 처리방침(BGNJ_LEGAL) helper ==========================
window.BGNJ_LEGAL = {
  get(slug) {
    const docs = window.BGNJ_STORES.legalDocs || {};
    return docs[slug] || null;
  },
  save(slug, payload) {
    const docs = window.BGNJ_STORES.legalDocs || {};
    docs[slug] = { ...(docs[slug] || {}), ...payload, updatedAt: new Date().toISOString() };
    window.BGNJ_STORES.legalDocs = docs;
    window.BGNJ_SAVE.legalDocs();
    return docs[slug];
  },
  listSlugs() { return ['privacy', 'terms']; },
};

// === FAQ(BGNJ_FAQ) helper ================================================
window.BGNJ_FAQ = {
  listAll() {
    return (window.BGNJ_STORES.faqs || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },
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
  add(payload) {
    const next = {
      id: `faq-${Date.now()}-${Math.random().toString(36).slice(2,4)}`,
      question: String(payload.question || '').trim(),
      answer: String(payload.answer || '').trim(),
      category: String(payload.category || '일반').trim() || '일반',
      order: typeof payload.order === 'number' ? payload.order : (window.BGNJ_STORES.faqs || []).length,
    };
    if (!next.question || !next.answer) return null;
    window.BGNJ_STORES.faqs = [...(window.BGNJ_STORES.faqs || []), next];
    window.BGNJ_SAVE.faqs();
    return next;
  },
  update(id, patch) {
    window.BGNJ_STORES.faqs = (window.BGNJ_STORES.faqs || []).map((f) => f.id === id ? { ...f, ...patch } : f);
    window.BGNJ_SAVE.faqs();
    return (window.BGNJ_STORES.faqs || []).find((f) => f.id === id) || null;
  },
  remove(id) {
    window.BGNJ_STORES.faqs = (window.BGNJ_STORES.faqs || []).filter((f) => f.id !== id);
    window.BGNJ_SAVE.faqs();
  },
  reorder(id, dir) {
    const list = this.listAll();
    const idx = list.findIndex((f) => f.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= list.length) return;
    const next = list.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    next.forEach((f, i) => { f.order = i; });
    window.BGNJ_STORES.faqs = next;
    window.BGNJ_SAVE.faqs();
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

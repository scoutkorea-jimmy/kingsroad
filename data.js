// 왕사들 mock data

// === 사이트 버전 (수정 시 footer에 노출) ===
window.WSD_VERSION = {
  version: "00.008.000",
  build: "2026.04.25",
  channel: "preview",
};

// === 회원 등급/카테고리/해시태그 저장소 (localStorage 연동) ===
const _lsGet = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const _lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const WSD_STORAGE_VERSION = "v1-local-first";
const hashPassword = (input) => {
  const value = String(input || "");
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return `wsd_${Math.abs(hash).toString(16)}`;
};

// 회원 등급 — 번호가 낮을수록 권한 낮음. admin > …
const DEFAULT_GRADES = [
  { id: "guest",    label: "방문객", level: 0, color: "#78716a", desc: "비로그인 / 게스트" },
  { id: "member",   label: "입문", level: 10, color: "#b8b1a1", desc: "회원가입 완료" },
  { id: "reader",   label: "독자", level: 30, color: "#E8C547", desc: "활동 회원 (댓글 10+)" },
  { id: "scholar",  label: "사관", level: 60, color: "#D4AF37", desc: "열성 회원 (칼럼 기고 가능)" },
  { id: "wangsanam",label: "왕사남", level: 90, color: "#F5E6A8", desc: "운영진" },
  { id: "admin",    label: "관리자", level: 100, color: "#F5E6A8", desc: "최고 관리자" },
];

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
  { id: 3, categoryId: "info", category: "정보", title: "국립고궁박물관 특별전 — 일월오봉도 원본 공개", author: "고궁지기", replies: 41, views: 1203, date: "2026.04.15", hot: true },
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

window.WSD_STORES = {
  storageVersion: WSD_STORAGE_VERSION,
  grades: _lsGet('wsd_grades', DEFAULT_GRADES),
  categories: _lsGet('wsd_categories', DEFAULT_CATEGORIES),
  communityPosts: ensureCommunityPostsSeeded(_lsGet('wsd_community_posts', []), _lsGet('wsd_user_posts', [])),
  userPosts: _lsGet('wsd_user_posts', []),
  comments: _lsGet('wsd_comments', {}),
  userColumns: _lsGet('wsd_user_columns', []),
  users: ensureUsersSeeded(_lsGet('wsd_users', DEFAULT_USERS)),
  session: _lsGet('wsd_session', null),
};
window.WSD_SAVE = {
  grades: () => _lsSet('wsd_grades', window.WSD_STORES.grades),
  categories: () => _lsSet('wsd_categories', window.WSD_STORES.categories),
  communityPosts: () => _lsSet('wsd_community_posts', window.WSD_STORES.communityPosts),
  userPosts: () => _lsSet('wsd_user_posts', window.WSD_STORES.userPosts),
  comments: () => _lsSet('wsd_comments', window.WSD_STORES.comments),
  userColumns: () => _lsSet('wsd_user_columns', window.WSD_STORES.userColumns),
  users: () => _lsSet('wsd_users', window.WSD_STORES.users),
  session: () => _lsSet('wsd_session', window.WSD_STORES.session),
  resetGrades: () => { window.WSD_STORES.grades = DEFAULT_GRADES.slice(); _lsSet('wsd_grades', window.WSD_STORES.grades); },
  resetCategories: () => { window.WSD_STORES.categories = DEFAULT_CATEGORIES.slice(); _lsSet('wsd_categories', window.WSD_STORES.categories); },
};

window.WSD_DB = {
  version: WSD_STORAGE_VERSION,
  mode: "local-first",
  entities: ["users", "session", "communityPosts", "comments", "userColumns", "grades", "categories"],
  note: "현재는 GitHub Pages 정적 배포 환경에 맞춘 local-first 저장 구조입니다. 이후 외부 DB로 교체할 때도 동일한 엔티티 구조를 유지하는 것을 기본 원칙으로 합니다.",
};

window.WSD_AUTH = {
  hashPassword,
  getSessionUser() {
    return window.WSD_STORES.session || null;
  },
  listUsers() {
    return window.WSD_STORES.users.slice();
  },
  signOut() {
    window.WSD_STORES.session = null;
    window.WSD_SAVE.session();
    return null;
  },
  signIn({ email, password }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const passwordHash = hashPassword(password);
    const found = window.WSD_STORES.users.find((user) => user.email === normalizedEmail);
    if (!found) {
      return { ok: false, message: "등록되지 않은 이메일입니다." };
    }
    if (found.passwordHash !== passwordHash) {
      return { ok: false, message: "비밀번호가 올바르지 않습니다." };
    }
    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      isAdmin: found.isAdmin,
      gradeId: found.gradeId,
      profile: found.profile,
      consents: found.consents,
      joinedAt: found.joinedAt,
    };
    window.WSD_STORES.session = sessionUser;
    window.WSD_SAVE.session();
    return { ok: true, user: sessionUser };
  },
  signUp(payload) {
    const normalizedEmail = String(payload.email || "").trim().toLowerCase();
    if (window.WSD_STORES.users.find((user) => user.email === normalizedEmail)) {
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
    window.WSD_STORES.users = [nextUser, ...window.WSD_STORES.users];
    window.WSD_SAVE.users();
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
    window.WSD_STORES.session = sessionUser;
    window.WSD_SAVE.session();
    return { ok: true, user: sessionUser };
  },
};

window.WSD_COMMUNITY = {
  listPosts() {
    return (window.WSD_STORES.communityPosts || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  },
  getPost(postId) {
    return (window.WSD_STORES.communityPosts || []).find((post) => String(post.id) === String(postId)) || null;
  },
  savePosts(posts) {
    window.WSD_STORES.communityPosts = posts.map(normalizeCommunityPost);
    window.WSD_SAVE.communityPosts();
  },
  createPost(payload) {
    const nextPost = normalizeCommunityPost({
      ...payload,
      id: `post-${Date.now()}`,
      _userCreated: true,
      _new: true,
    });
    this.savePosts([nextPost, ...this.listPosts()]);
    return nextPost;
  },
  updatePost(postId, patch) {
    const posts = this.listPosts().map((post) => (
      String(post.id) === String(postId)
        ? normalizeCommunityPost({ ...post, ...patch, updatedAt: new Date().toISOString() })
        : post
    ));
    this.savePosts(posts);
    return this.getPost(postId);
  },
  deletePost(postId) {
    const nextPosts = this.listPosts().filter((post) => String(post.id) !== String(postId));
    this.savePosts(nextPosts);
    delete window.WSD_STORES.comments[postId];
    window.WSD_SAVE.comments();
  },
  incrementViews(postId) {
    const post = this.getPost(postId);
    if (!post) return null;
    return this.updatePost(postId, { views: (post.views || 0) + 1 });
  },
  getComments(postId) {
    return (window.WSD_STORES.comments[String(postId)] || []).slice();
  },
  saveComments(postId, comments) {
    window.WSD_STORES.comments[String(postId)] = comments.slice();
    window.WSD_SAVE.comments();
    const post = this.getPost(postId);
    if (post) {
      this.updatePost(postId, { replies: comments.length });
    }
  },
  addComment(postId, payload) {
    const nextComments = [...this.getComments(postId), payload];
    this.saveComments(postId, nextComments);
    return nextComments;
  },
  deleteComment(postId, commentId) {
    const nextComments = this.getComments(postId).filter((comment) => String(comment.id) !== String(commentId));
    this.saveComments(postId, nextComments);
    return nextComments;
  },
  exportCsv() {
    const header = ["id", "category", "title", "author", "date", "views", "replies"];
    const rows = this.listPosts().map((post) => [
      post.id,
      post.category,
      post.title,
      post.author,
      post.date,
      post.views || 0,
      post.replies || 0,
    ]);
    return [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
  },
};

// 사용자 등급 레벨 계산
window.WSD_USER_LEVEL = (user) => {
  if (!user) return 0;
  if (user.isAdmin) return 100;
  const g = window.WSD_STORES.grades.find(x => x.id === user.gradeId);
  return g ? g.level : 10;
};

window.WANGSADEUL_DATA = {
  notices: [
    { id: 1, tag: "공지", title: "2026년 상반기 궁궐 답사 프로그램 접수 개시", date: "2026.04.18", pinned: true },
    { id: 2, tag: "안내", title: "『왕의길』 영문판 출간 예정 — 4월 30일", date: "2026.04.15", pinned: true },
    { id: 3, tag: "이벤트", title: "창덕궁 후원 야간 답사 — 선착순 30명", date: "2026.04.10" },
    { id: 4, tag: "공지", title: "커뮤니티 등급제 개편 안내", date: "2026.04.03" },
    { id: 5, tag: "공지", title: "뱅기노자 칼럼 정기 연재 재개", date: "2026.03.28" },
  ],
  columns: [
    { id: 1, title: "다섯 봉우리 아래 무엇이 있었는가", excerpt: "일월오봉도는 단순한 병풍이 아니다. 왕의 자리 뒤에 펼쳐진 우주관이며, 동시에 통치의 질서였다.", date: "2026.04.16", readTime: "8분", category: "왕의 미학" },
    { id: 2, title: "세종의 침묵, 정조의 질문", excerpt: "두 임금의 대화법은 전혀 달랐다. 그러나 공통점이 하나 있었으니, 묻는 자리에 오래 머물렀다는 점이다.", date: "2026.04.09", readTime: "12분", category: "군주의 언어" },
    { id: 3, title: "궁궐은 왜 비대칭인가", excerpt: "경복궁은 완벽한 좌우대칭을 피한다. 그 어긋남 속에 조선이 생각한 완전함이 있다.", date: "2026.04.02", readTime: "6분", category: "공간의 철학" },
    { id: 4, title: "해와 달이 동시에 뜨는 이유", excerpt: "자연에서는 불가능하다. 그러나 왕의 뒤에서는 매일 그러했다. 그 이유를 묻지 않는 시대는 지났다.", date: "2026.03.26", readTime: "10분", category: "왕의 미학" },
    { id: 5, title: "길이라는 말의 무게", excerpt: "왕의 길. 이 세 글자는 도덕적 선언이자 실천의 지도였다. 오늘의 우리에게 남은 길은 무엇인가.", date: "2026.03.19", readTime: "14분", category: "현대의 독법" },
    { id: 6, title: "어좌는 어디를 바라보는가", excerpt: "남향이라는 답은 절반만 맞다. 왕의 시선은 자연을 향하지 않았다. 그것은 백성을 향한 각도였다.", date: "2026.03.12", readTime: "9분", category: "공간의 철학" },
  ],
  tours: [
    { id: 1, title: "경복궁 — 권력의 좌표를 읽다", duration: "3시간", group: "12인 이하", price: "85,000원", next: "2026.05.04 · 토", level: "입문", desc: "근정전부터 경회루까지, 조선 건국의 설계도를 공간으로 따라갑니다." },
    { id: 2, title: "창덕궁 후원 — 왕의 사유", duration: "4시간", group: "8인 이하", price: "130,000원", next: "2026.05.11 · 토", level: "심화", desc: "공적 공간 너머, 왕이 스스로를 마주하던 자리. 야간 답사 한정." },
    { id: 3, title: "종묘 — 침묵의 건축", duration: "2.5시간", group: "15인 이하", price: "70,000원", next: "2026.05.18 · 일", level: "입문", desc: "세계에서 가장 긴 목조 건축이 왜 비어 있어야 했는가." },
    { id: 4, title: "수원 화성 — 정조의 기획", duration: "5시간", group: "10인 이하", price: "150,000원", next: "2026.05.25 · 토", level: "심화", desc: "개혁 군주가 남긴 도시. 근대 이전의 가장 급진적 실험." },
  ],
  lectures: [
    { id: 1, title: "왕사남 월간 공개 강연", topic: "왕의 자리는 어떻게 설계되었는가", venue: "서울 종로 강연실", next: "2026.05.02 · 토 19:00", host: "뱅기노자", seats: "잔여 18석", note: "왕권, 공간, 상징 체계를 입문자 관점에서 풀어냅니다." },
    { id: 2, title: "왕사남 심화 강연", topic: "세종의 침묵과 정조의 질문", venue: "온라인 라이브", next: "2026.05.09 · 토 20:00", host: "뱅기노자", seats: "잔여 42석", note: "실록 문장을 중심으로 두 군주의 사고법을 비교합니다." },
    { id: 3, title: "왕사남 현장 강연", topic: "창덕궁 후원과 왕의 사유", venue: "창덕궁 권역", next: "2026.05.16 · 토 18:30", host: "왕사남 팀", seats: "대기 접수", note: "답사와 강연이 결합된 현장형 프로그램입니다." },
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
    publisher: "왕사들 프레스",
    pages: 412,
    isbn: "979-11-000-0000-0",
    priceKR: 28000,
    priceEN: 35000,
    desc: "일월오봉도 앞에 선 자는 누구인가. 그 자리에서 무엇을 보았으며, 어떤 질문을 견뎠는가. 뱅기노자가 15년간 쌓아올린 궁궐 답사와 실록 독해의 결실을 한 권으로 엮는다. 왕의 자리가 아니라 왕이 바라본 길을 따라가는 책.",
    chapters: [
      "1부 · 다섯 봉우리의 설계",
      "2부 · 어좌 뒤에서 바라본 것",
      "3부 · 측근과 거리의 정치",
      "4부 · 길이라는 말의 무게",
      "5부 · 현대의 군주는 누구인가",
    ],
  },
};

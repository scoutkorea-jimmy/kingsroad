// 왕사들 mock data

// === 사이트 버전 (수정 시 footer에 노출) ===
window.WSD_VERSION = {
  version: "00.025.001",
  build: "2026.04.27",
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
  bookmarks: _lsGet('wsd_bookmarks', {}),
  reports: _lsGet('wsd_reports', []),
  notifications: _lsGet('wsd_notifications', {}),
  columnEngagement: _lsGet('wsd_column_engagement', {}),
  lectureOverrides: _lsGet('wsd_lecture_overrides', {}),
  lectureRegistrations: _lsGet('wsd_lecture_registrations', {}),
  bankAccount: _lsGet('wsd_bank_account', { bankName: "", accountNumber: "", holder: "", memo: "입금자명에 강연 신청자 본명 + 강연번호를 남겨 주세요." }),
  bookOrders: _lsGet('wsd_book_orders', []),
  bookReviews: _lsGet('wsd_book_reviews', []),
  tourOverrides: _lsGet('wsd_tour_overrides', {}),
  tourReservations: _lsGet('wsd_tour_reservations', {}),
  tourReviews: _lsGet('wsd_tour_reviews', {}),
  legalDocs: _lsGet('wsd_legal_docs', {
    privacy: { title: "개인정보 처리방침", body: "<p>왕사들 사이트는 회원 가입과 운영을 위해 최소한의 개인정보를 수집·이용합니다.</p><p>이 문서는 관리자 페이지에서 직접 수정할 수 있습니다.</p>", updatedAt: null },
    terms:   { title: "이용약관",          body: "<p>왕사들 사이트의 이용약관입니다.</p><p>이 문서는 관리자 페이지에서 직접 수정할 수 있습니다.</p>", updatedAt: null },
  }),
  lectureReviews: _lsGet('wsd_lecture_reviews', {}),
  auditLog: _lsGet('wsd_audit_log', []),
  faqs: _lsGet('wsd_faqs', [
    { id: 'faq-1', question: "회원가입은 어떻게 하나요?", answer: "상단 로그인 화면에서 '회원가입' 탭을 눌러 이메일과 비밀번호를 등록하면 즉시 가입됩니다.", category: '계정', order: 0 },
    { id: 'faq-2', question: "강연·답사 결제는 어떻게 진행되나요?", answer: "현재는 무통장 입금만 지원합니다. 신청 → 안내 계좌로 입금 → 운영자 입금 확인 → 참가 확정 순으로 진행됩니다.", category: '결제', order: 1 },
    { id: 'faq-3', question: "주문 취소 / 환불은 가능한가요?", answer: "마이페이지에서 입금 확인 전 단계의 주문은 직접 취소할 수 있습니다. 환불 처리는 운영자에게 문의해 주세요.", category: '결제', order: 2 },
  ]),
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
  bookmarks: () => _lsSet('wsd_bookmarks', window.WSD_STORES.bookmarks),
  reports: () => _lsSet('wsd_reports', window.WSD_STORES.reports),
  notifications: () => _lsSet('wsd_notifications', window.WSD_STORES.notifications),
  columnEngagement: () => _lsSet('wsd_column_engagement', window.WSD_STORES.columnEngagement),
  lectureOverrides: () => _lsSet('wsd_lecture_overrides', window.WSD_STORES.lectureOverrides),
  lectureRegistrations: () => _lsSet('wsd_lecture_registrations', window.WSD_STORES.lectureRegistrations),
  bankAccount: () => _lsSet('wsd_bank_account', window.WSD_STORES.bankAccount),
  bookOrders: () => _lsSet('wsd_book_orders', window.WSD_STORES.bookOrders),
  bookReviews: () => _lsSet('wsd_book_reviews', window.WSD_STORES.bookReviews),
  tourOverrides: () => _lsSet('wsd_tour_overrides', window.WSD_STORES.tourOverrides),
  tourReservations: () => _lsSet('wsd_tour_reservations', window.WSD_STORES.tourReservations),
  tourReviews: () => _lsSet('wsd_tour_reviews', window.WSD_STORES.tourReviews),
  legalDocs: () => _lsSet('wsd_legal_docs', window.WSD_STORES.legalDocs),
  faqs: () => _lsSet('wsd_faqs', window.WSD_STORES.faqs),
  lectureReviews: () => _lsSet('wsd_lecture_reviews', window.WSD_STORES.lectureReviews),
  auditLog: () => _lsSet('wsd_audit_log', window.WSD_STORES.auditLog),
  resetGrades: () => { window.WSD_STORES.grades = DEFAULT_GRADES.slice(); _lsSet('wsd_grades', window.WSD_STORES.grades); },
  resetCategories: () => { window.WSD_STORES.categories = DEFAULT_CATEGORIES.slice(); _lsSet('wsd_categories', window.WSD_STORES.categories); },
};

window.WSD_DB = {
  version: WSD_STORAGE_VERSION,
  mode: "local-first",
  entities: ["users", "session", "communityPosts", "comments", "userColumns", "grades", "categories", "bookmarks", "reports", "notifications", "columnEngagement", "lectureOverrides", "lectureRegistrations", "bankAccount", "bookOrders", "bookReviews", "tourOverrides", "tourReservations", "tourReviews", "lectureReviews", "auditLog", "legalDocs", "faqs"],
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
    if (found.suspended) {
      return { ok: false, message: `이 계정은 정지 상태입니다.${found.suspendedReason ? ` (${found.suspendedReason})` : ''}` };
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

  // ── 관리자 운영 ─────────────────────────────────────────────
  setGrade(userId, gradeId) {
    const before = (window.WSD_STORES.users || []).find((u) => u.id === userId);
    window.WSD_STORES.users = window.WSD_STORES.users.map((u) => (
      u.id === userId ? { ...u, gradeId, gradeChangedAt: new Date().toISOString() } : u
    ));
    window.WSD_SAVE.users();
    if (window.WSD_STORES.session?.id === userId) {
      window.WSD_STORES.session = { ...window.WSD_STORES.session, gradeId };
      window.WSD_SAVE.session();
    }
    if (before && before.gradeId !== gradeId) {
      window.WSD_AUDIT?.log({ action: 'member.grade_change', target: `user:${userId}`, details: { from: before.gradeId, to: gradeId } });
    }
    return window.WSD_STORES.users.find((u) => u.id === userId) || null;
  },
  suspendUser(userId, reason) {
    window.WSD_STORES.users = window.WSD_STORES.users.map((u) => (
      u.id === userId ? { ...u, suspended: true, suspendedReason: reason || '', suspendedAt: new Date().toISOString() } : u
    ));
    window.WSD_SAVE.users();
    if (window.WSD_STORES.session?.id === userId) {
      window.WSD_STORES.session = null;
      window.WSD_SAVE.session();
    }
    window.WSD_AUDIT?.log({ action: 'member.suspend', target: `user:${userId}`, details: { reason: reason || '' } });
    return window.WSD_STORES.users.find((u) => u.id === userId) || null;
  },
  unsuspendUser(userId) {
    window.WSD_STORES.users = window.WSD_STORES.users.map((u) => (
      u.id === userId ? { ...u, suspended: false, suspendedReason: '', unsuspendedAt: new Date().toISOString() } : u
    ));
    window.WSD_SAVE.users();
    window.WSD_AUDIT?.log({ action: 'member.unsuspend', target: `user:${userId}` });
    return window.WSD_STORES.users.find((u) => u.id === userId) || null;
  },
  removeUser(userId) {
    window.WSD_STORES.users = window.WSD_STORES.users.filter((u) => u.id !== userId);
    window.WSD_SAVE.users();
    if (window.WSD_STORES.session?.id === userId) {
      window.WSD_STORES.session = null;
      window.WSD_SAVE.session();
    }
    window.WSD_AUDIT?.log({ action: 'member.remove', target: `user:${userId}` });
  },
  toggleAdmin(userId) {
    const before = (window.WSD_STORES.users || []).find((u) => u.id === userId);
    let next = null;
    window.WSD_STORES.users = window.WSD_STORES.users.map((u) => {
      if (u.id !== userId) return u;
      next = { ...u, isAdmin: !u.isAdmin };
      return next;
    });
    window.WSD_SAVE.users();
    if (window.WSD_STORES.session?.id === userId && next) {
      window.WSD_STORES.session = { ...window.WSD_STORES.session, isAdmin: next.isAdmin };
      window.WSD_SAVE.session();
    }
    if (before && next) {
      window.WSD_AUDIT?.log({ action: 'member.admin_toggle', target: `user:${userId}`, details: { from: !!before.isAdmin, to: !!next.isAdmin } });
    }
    return next;
  },
  getActivity(userId) {
    if (!userId) return null;
    const posts = (window.WSD_COMMUNITY?.listPosts?.() || []).filter((p) => p.authorId === userId);
    const comments = Object.values(window.WSD_STORES.comments || {})
      .reduce((sum, list) => sum + (Array.isArray(list) ? list.filter((c) => c.authorId === userId).length : 0), 0);
    const bookOrders = (window.WSD_BOOK_ORDERS?.listMine?.(userId) || []);
    const lectures = (window.WSD_LECTURES?.listMyRegistrations?.(userId) || []);
    const tours = (window.WSD_TOURS?.listMyReservations?.(userId) || []);
    const bookmarks = (window.WSD_COMMUNITY?.getBookmarks?.(userId) || []);
    const notifications = (window.WSD_COMMUNITY?.listNotifications?.(userId) || []);
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
    if (payload.authorId) {
      try { window.WSD_GRADE_PROMO?.maybePromote(payload.authorId); } catch {}
    }
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
    if (payload.authorId) {
      try { window.WSD_GRADE_PROMO?.maybePromote(payload.authorId); } catch {}
    }
    return nextComments;
  },
  deleteComment(postId, commentId) {
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
    const map = window.WSD_STORES.bookmarks || {};
    return Array.isArray(map[userId]) ? map[userId].slice() : [];
  },
  isBookmarked(userId, postId) {
    return this.getBookmarks(userId).includes(postId);
  },
  toggleBookmark(userId, postId) {
    if (!userId) return [];
    const map = window.WSD_STORES.bookmarks || {};
    const list = Array.isArray(map[userId]) ? map[userId] : [];
    const next = list.includes(postId) ? list.filter((x) => x !== postId) : [postId, ...list];
    map[userId] = next;
    window.WSD_STORES.bookmarks = map;
    window.WSD_SAVE.bookmarks();
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
    window.WSD_STORES.reports = [report, ...(window.WSD_STORES.reports || [])];
    window.WSD_SAVE.reports();
    return report;
  },
  listReports(filter) {
    const all = (window.WSD_STORES.reports || []).slice();
    if (!filter || filter === "all") return all;
    return all.filter((r) => r.status === filter);
  },
  updateReportStatus(id, status) {
    const next = (window.WSD_STORES.reports || []).map((r) =>
      r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );
    window.WSD_STORES.reports = next;
    window.WSD_SAVE.reports();
    return next.find((r) => r.id === id) || null;
  },
  countOpenReports() {
    return (window.WSD_STORES.reports || []).filter((r) => r.status === "open").length;
  },

  // ── 알림 (per-user) ───────────────────────────────────────────────
  addNotification(userId, payload) {
    if (!userId) return null;
    const map = window.WSD_STORES.notifications || {};
    const list = Array.isArray(map[userId]) ? map[userId] : [];
    const entry = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...payload,
    };
    map[userId] = [entry, ...list].slice(0, 50);
    window.WSD_STORES.notifications = map;
    window.WSD_SAVE.notifications();
    return entry;
  },
  listNotifications(userId) {
    if (!userId) return [];
    const map = window.WSD_STORES.notifications || {};
    return Array.isArray(map[userId]) ? map[userId].slice() : [];
  },
  unreadNotificationCount(userId) {
    return this.listNotifications(userId).filter((n) => !n.read).length;
  },
  markNotificationRead(userId, id) {
    if (!userId) return [];
    const map = window.WSD_STORES.notifications || {};
    map[userId] = (map[userId] || []).map((n) => (n.id === id ? { ...n, read: true } : n));
    window.WSD_STORES.notifications = map;
    window.WSD_SAVE.notifications();
    return map[userId];
  },
  markAllNotificationsRead(userId) {
    if (!userId) return [];
    const map = window.WSD_STORES.notifications || {};
    map[userId] = (map[userId] || []).map((n) => ({ ...n, read: true }));
    window.WSD_STORES.notifications = map;
    window.WSD_SAVE.notifications();
    return map[userId];
  },
  clearNotifications(userId) {
    if (!userId) return [];
    const map = window.WSD_STORES.notifications || {};
    map[userId] = [];
    window.WSD_STORES.notifications = map;
    window.WSD_SAVE.notifications();
    return [];
  },
};

// === 칼럼(WSD_COLUMNS) helper ===========================================
// 운영 정책:
//   - userColumns 저장소가 콘텐츠(본문/메타) 단일 출처. 시드 칼럼은 WANGSADEUL_DATA.columns.
//   - status: 'draft' | 'scheduled' | 'published' (시드는 항상 published).
//   - 좋아요/조회수는 columnEngagement 맵으로 분리 — 시드 칼럼도 동일하게 저장.
//   - 댓글은 WSD_COMMUNITY.comments 저장소를 `col-{id}` 키로 재사용.
window.WSD_COLUMNS = {
  estimateReadTime(text) {
    const len = String(text || '').length;
    const minutes = Math.max(3, Math.ceil(len / 600));
    return `${minutes}분`;
  },
  _engage(id) {
    const map = window.WSD_STORES.columnEngagement || {};
    const entry = map[String(id)] || {};
    return { likes: Array.isArray(entry.likes) ? entry.likes : [], views: entry.views || 0 };
  },
  _setEngage(id, next) {
    const map = window.WSD_STORES.columnEngagement || {};
    map[String(id)] = next;
    window.WSD_STORES.columnEngagement = map;
    window.WSD_SAVE.columnEngagement();
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
    const list = (window.WSD_STORES.userColumns || []);
    let mutated = false;
    const next = list.map((c) => {
      if (c.status === 'scheduled' && c.publishAt && new Date(c.publishAt).getTime() <= now) {
        mutated = true;
        return { ...c, status: 'published', publishedAt: c.publishedAt || new Date().toISOString() };
      }
      return c;
    });
    if (mutated) {
      window.WSD_STORES.userColumns = next;
      window.WSD_SAVE.userColumns();
    }
  },
  listAll() {
    this._autoPromote();
    return (window.WSD_STORES.userColumns || []).map((c) => ({
      ...c, status: c.status || 'published',
    }));
  },
  // 공개 노출용 — published 사용자 칼럼 + 시드 칼럼
  listPublic() {
    this._autoPromote();
    const userPub = (window.WSD_STORES.userColumns || []).filter((c) => (c.status || 'published') === 'published');
    const seed = (window.WANGSADEUL_DATA?.columns || []).map((c) => ({ ...c, status: 'published' }));
    return [...userPub, ...seed];
  },
  getColumn(id) {
    this._autoPromote();
    const fromUser = (window.WSD_STORES.userColumns || []).find((c) => String(c.id) === String(id));
    if (fromUser) return { ...fromUser, status: fromUser.status || 'published' };
    const seed = (window.WANGSADEUL_DATA?.columns || []).find((c) => String(c.id) === String(id));
    return seed ? { ...seed, status: 'published' } : null;
  },
  saveColumn(payload) {
    const list = window.WSD_STORES.userColumns || [];
    const idx = list.findIndex((c) => String(c.id) === String(payload.id));
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...payload, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...payload, createdAt: new Date().toISOString() });
    }
    window.WSD_STORES.userColumns = list;
    window.WSD_SAVE.userColumns();
    return payload;
  },
  deleteColumn(id) {
    window.WSD_STORES.userColumns = (window.WSD_STORES.userColumns || []).filter((c) => String(c.id) !== String(id));
    window.WSD_SAVE.userColumns();
    const map = window.WSD_STORES.columnEngagement || {};
    delete map[String(id)];
    window.WSD_STORES.columnEngagement = map;
    window.WSD_SAVE.columnEngagement();
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
  // 댓글은 WSD_COMMUNITY 저장소 재사용 (`col-{id}` 키)
  listComments(id) { return window.WSD_COMMUNITY.getComments(`col-${id}`); },
  addComment(id, payload) { return window.WSD_COMMUNITY.addComment(`col-${id}`, payload); },
  deleteComment(id, commentId) { return window.WSD_COMMUNITY.deleteComment(`col-${id}`, commentId); },
};

// === 강연(WSD_LECTURES) helper ==========================================
// 운영 정책:
//   - 시드는 WANGSADEUL_DATA.lectures. 관리자가 정원/일정/제목 등을 수정하면
//     `lectureOverrides`(같은 id 키)에 변경분만 저장하고 listAll에서 머지.
//   - 신청은 회원 전용. 한 회원당 한 강연에 한 번만 신청 가능 (중복 방지).
//   - 결제 정책: price === 0 이면 즉시 'confirmed', price > 0 이면 'pending_payment'.
//   - 정원 차면 'waitlist'. 신청 취소(또는 관리자 취소)로 인원이 남으면 가장 오래된
//     waitlist를 'pending_payment'(유료) 또는 'confirmed'(무료)로 자동 승격.
//   - 'cancelled' 레코드는 잔여 좌석 계산에서 제외.
window.WSD_LECTURES = {
  _seed() { return (window.WANGSADEUL_DATA?.lectures || []).slice(); },
  _override(id) {
    const map = window.WSD_STORES.lectureOverrides || {};
    return map[String(id)] || null;
  },
  _merge(seed) {
    const ov = this._override(seed.id);
    return ov ? { ...seed, ...ov } : { ...seed };
  },
  listAll() {
    const seedIds = new Set(this._seed().map((l) => String(l.id)));
    const merged = this._seed().map((l) => this._merge(l));
    // override-only(추가 강연)도 함께 노출
    const map = window.WSD_STORES.lectureOverrides || {};
    Object.entries(map).forEach(([id, ov]) => {
      if (!seedIds.has(String(id))) merged.push({ id, ...ov });
    });
    return merged;
  },
  getLecture(id) {
    return this.listAll().find((l) => String(l.id) === String(id)) || null;
  },
  saveLecture(payload) {
    const map = window.WSD_STORES.lectureOverrides || {};
    map[String(payload.id)] = { ...(map[String(payload.id)] || {}), ...payload, updatedAt: new Date().toISOString() };
    window.WSD_STORES.lectureOverrides = map;
    window.WSD_SAVE.lectureOverrides();
    return this.getLecture(payload.id);
  },
  deleteLecture(id) {
    const map = window.WSD_STORES.lectureOverrides || {};
    delete map[String(id)];
    window.WSD_STORES.lectureOverrides = map;
    window.WSD_SAVE.lectureOverrides();
    const reg = window.WSD_STORES.lectureRegistrations || {};
    delete reg[String(id)];
    window.WSD_STORES.lectureRegistrations = reg;
    window.WSD_SAVE.lectureRegistrations();
  },
  // ── 신청 ──────────────────────────────────────────────────────
  listRegistrations(lectureId) {
    const map = window.WSD_STORES.lectureRegistrations || {};
    return Array.isArray(map[String(lectureId)]) ? map[String(lectureId)].slice() : [];
  },
  _saveRegistrations(lectureId, list) {
    const map = window.WSD_STORES.lectureRegistrations || {};
    map[String(lectureId)] = list;
    window.WSD_STORES.lectureRegistrations = map;
    window.WSD_SAVE.lectureRegistrations();
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
      window.WSD_COMMUNITY.addNotification(reg.userId, {
        type: 'lecture_refund_requested', lectureId: String(lectureId),
        postTitle: lecture?.topic || lecture?.title || '강연',
        fromName: '운영자', message: '환불 신청이 접수되었습니다. 운영자 확인 후 처리됩니다.',
      });
      window.WSD_AUDIT?.log({ action: 'lecture.refund_request', target: `lecture:${lectureId}`, details: { reg: registrationId, reason } });
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
      window.WSD_COMMUNITY.addNotification(reg.userId, {
        type: 'lecture_refund_approved', lectureId: String(lectureId),
        postTitle: lecture?.topic || lecture?.title || '강연',
        fromName: '운영자', message: '환불 신청이 승인되어 처리되었습니다.',
      });
      window.WSD_AUDIT?.log({ action: 'lecture.refund_approve', target: `lecture:${lectureId}`, details: { reg: registrationId } });
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
      window.WSD_COMMUNITY.addNotification(reg.userId, {
        type: 'lecture_refund_rejected', lectureId: String(lectureId),
        postTitle: lecture?.topic || lecture?.title || '강연',
        fromName: '운영자', message: `환불 신청이 반려되었습니다.${adminNote ? ' 사유: ' + adminNote : ''}`,
      });
      window.WSD_AUDIT?.log({ action: 'lecture.refund_reject', target: `lecture:${lectureId}`, details: { reg: registrationId, note: adminNote } });
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
      window.WSD_COMMUNITY.addNotification(updated.userId, {
        type: 'lecture_confirmed',
        lectureId: String(lectureId),
        postTitle: lecture?.topic || lecture?.title || '강연',
        fromName: '운영자',
        message: '강연 입금이 확인되어 참가가 확정되었습니다.',
      });
      window.WSD_AUDIT?.log({ action: 'lecture.confirm_payment', target: `lecture:${lectureId}`, details: { reg: registrationId, user: updated.userId } });
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
      window.WSD_COMMUNITY.addNotification(userId, {
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
    const map = window.WSD_STORES.lectureRegistrations || {};
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
      `UID:lecture-${lecture.id}@wangsadeul`,
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
    const map = window.WSD_STORES.lectureReviews || {};
    return Array.isArray(map[String(lectureId)]) ? map[String(lectureId)].slice() : [];
  },
  _saveReviews(lectureId, list) {
    const map = window.WSD_STORES.lectureReviews || {};
    map[String(lectureId)] = list;
    window.WSD_STORES.lectureReviews = map;
    window.WSD_SAVE.lectureReviews();
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
    return { ...(window.WSD_STORES.bankAccount || {}) };
  },
  saveBankAccount(payload) {
    window.WSD_STORES.bankAccount = { ...(window.WSD_STORES.bankAccount || {}), ...payload };
    window.WSD_SAVE.bankAccount();
    return this.getBankAccount();
  },
};

// === 책 주문(WSD_BOOK_ORDERS) helper ====================================
// 운영 정책:
//   - 회원 전용 주문. 비로그인은 결제 진입 자체를 막음.
//   - 결제는 무통장 입금만. PG는 별도 단계에서 도입.
//   - 상태: pending_payment → paid → shipped → delivered. 운영자가 단계별로 진행.
//   - 'cancelled' 는 운영자/사용자가 명시적으로 취소.
//   - 계좌번호는 강연과 동일한 `WSD_STORES.bankAccount` 재사용.
window.WSD_BOOK_ORDERS = {
  ORDER_STATUSES: ['pending_payment', 'paid', 'shipped', 'delivered', 'refund_requested', 'cancelled'],

  listAll() {
    return (window.WSD_STORES.bookOrders || []).slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
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
    window.WSD_STORES.bookOrders = list;
    window.WSD_SAVE.bookOrders();
  },
  countOpenOrders() {
    return (window.WSD_STORES.bookOrders || []).filter((o) => o.status === 'pending_payment').length;
  },
  generateOrderNo(now) {
    const d = now || new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
    const seq = (window.WSD_STORES.bookOrders || []).filter((o) => String(o.orderNo || '').includes(stamp)).length + 1;
    return `WSD-${stamp}-${String(seq).padStart(3, '0')}`;
  },
  createOrder(payload) {
    if (!payload.userId) return { ok: false, message: "회원 가입 후 로그인해 주세요." };
    if (!payload.recipient || !payload.phone || !payload.address) {
      return { ok: false, message: "받는 분, 연락처, 주소는 필수입니다." };
    }
    const book = window.WANGSADEUL_DATA?.book;
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
    this._save([order, ...(window.WSD_STORES.bookOrders || [])]);
    return { ok: true, order };
  },
  _notify(order, type, message) {
    if (!order || !order.userId) return;
    window.WSD_COMMUNITY.addNotification(order.userId, {
      type,
      orderId: order.id,
      orderNo: order.orderNo,
      postTitle: `『왕의길』 주문 ${order.orderNo}`,
      fromName: '운영자',
      message,
    });
  },
  confirmPayment(id) {
    const list = (window.WSD_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, paid: true, status: 'paid', paidAt: new Date().toISOString() } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_paid', '입금이 확인되어 발송 준비를 시작합니다.');
    if (updated) window.WSD_AUDIT?.log({ action: 'book.confirm_payment', target: `order:${updated.orderNo}` });
    return updated;
  },
  unconfirmPayment(id) {
    const list = (window.WSD_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, paid: false, status: 'pending_payment', paidAt: null, shippedAt: null, tracking: '' } : o
    );
    this._save(list);
    return list.find((o) => o.id === id) || null;
  },
  markShipped(id, tracking) {
    const list = (window.WSD_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: 'shipped', tracking: tracking || o.tracking || '', shippedAt: new Date().toISOString() } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_shipped',
      updated?.tracking ? `발송이 시작되었습니다. 송장 번호 ${updated.tracking}.` : '발송이 시작되었습니다.');
    if (updated) window.WSD_AUDIT?.log({ action: 'book.ship', target: `order:${updated.orderNo}`, details: { tracking: updated.tracking || '' } });
    return updated;
  },
  markDelivered(id) {
    const list = (window.WSD_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: 'delivered', deliveredAt: new Date().toISOString() } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_delivered', '배송이 완료되었습니다. 즐거운 독서 되세요.');
    if (updated) window.WSD_AUDIT?.log({ action: 'book.deliver', target: `order:${updated.orderNo}` });
    return updated;
  },
  cancelOrder(id) {
    const list = (window.WSD_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: 'cancelled', cancelledAt: new Date().toISOString() } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_cancelled', '주문이 취소되었습니다.');
    if (updated) window.WSD_AUDIT?.log({ action: 'book.cancel', target: `order:${updated.orderNo}` });
    return updated;
  },
  requestRefund(id, reason) {
    const order = this.getOrder(id);
    if (!order) return { ok: false, message: '주문을 찾을 수 없습니다.' };
    if (!['paid', 'shipped'].includes(order.status)) return { ok: false, message: '입금 확인 또는 배송 중 단계에서만 환불 신청이 가능합니다.' };
    const list = (window.WSD_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: 'refund_requested', refundReason: String(reason || '').trim(), refundRequestedAt: new Date().toISOString(), _prevStatus: o.status } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_refund_requested', '환불 신청이 접수되었습니다. 운영자 확인 후 처리됩니다.');
    if (updated) window.WSD_AUDIT?.log({ action: 'book.refund_request', target: `order:${updated.orderNo}`, details: { reason: updated.refundReason } });
    return { ok: true, order: updated };
  },
  approveRefund(id) {
    const list = (window.WSD_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: 'cancelled', refundApprovedAt: new Date().toISOString(), cancelledAt: new Date().toISOString() } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_cancelled', '환불 신청이 승인되어 처리되었습니다.');
    if (updated) window.WSD_AUDIT?.log({ action: 'book.refund_approve', target: `order:${updated.orderNo}` });
    return updated;
  },
  rejectRefund(id, adminNote) {
    const list = (window.WSD_STORES.bookOrders || []).map((o) =>
      o.id === id ? { ...o, status: o._prevStatus || 'paid', refundRejectedAt: new Date().toISOString(), refundAdminNote: String(adminNote || '').trim(), _prevStatus: undefined } : o
    );
    this._save(list);
    const updated = list.find((o) => o.id === id) || null;
    this._notify(updated, 'order_refund_rejected', `환불 신청이 반려되었습니다.${adminNote ? ' 사유: ' + adminNote : ''}`);
    if (updated) window.WSD_AUDIT?.log({ action: 'book.refund_reject', target: `order:${updated.orderNo}`, details: { note: adminNote } });
    return updated;
  },
  // ── 영수증 ──────────────────────────────────────────────────
  generateReceipt(id) {
    const order = this.getOrder(id);
    if (!order) return null;
    const bank = window.WSD_LECTURES?.getBankAccount?.() || {};
    const formatPrice = (p) => `${(p || 0).toLocaleString()}원`;
    const lines = [
      '╔════════════════════════════════════════════╗',
      '║         왕사들 · WANGSADEUL 주문 영수증     ║',
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
    lines.push('운영 문의 · hello@wangsadeul.kr');
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
    window.WSD_STORES.bookReviews = list;
    window.WSD_SAVE.bookReviews();
  },
  listReviews() {
    return (window.WSD_STORES.bookReviews || []).slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  },
  canReview(userId) {
    if (!userId) return false;
    return this.listMine(userId).some((o) => o.status === 'delivered');
  },
  hasReviewed(userId) {
    if (!userId) return false;
    return (window.WSD_STORES.bookReviews || []).some((r) => r.userId === userId);
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

// === 투어(WSD_TOURS) helper ============================================
// 운영 정책:
//   - 시드는 WANGSADEUL_DATA.tours. 관리자가 capacity / startsAt / 가격 등을 수정하면
//     `tourOverrides`(같은 id 키)에 저장하고 listAll에서 머지.
//   - 신청은 회원 전용. 한 회원당 한 투어에 한 건만(취소 후 재신청은 가능).
//   - 결제는 무통장 입금만(같은 bankAccount 저장소 사용).
//   - 정원/대기열/입금 확인/.ics는 강연 helper와 같은 패턴.
window.WSD_TOURS = {
  _seed() { return (window.WANGSADEUL_DATA?.tours || []).slice(); },
  _override(id) {
    const map = window.WSD_STORES.tourOverrides || {};
    return map[String(id)] || null;
  },
  _merge(seed) {
    const ov = this._override(seed.id);
    return ov ? { ...seed, ...ov } : { ...seed };
  },
  listAll() {
    const seedIds = new Set(this._seed().map((t) => String(t.id)));
    const merged = this._seed().map((t) => this._merge(t));
    const map = window.WSD_STORES.tourOverrides || {};
    Object.entries(map).forEach(([id, ov]) => {
      if (!seedIds.has(String(id))) merged.push({ id, ...ov });
    });
    return merged;
  },
  getTour(id) {
    return this.listAll().find((t) => String(t.id) === String(id)) || null;
  },
  saveTour(payload) {
    const map = window.WSD_STORES.tourOverrides || {};
    map[String(payload.id)] = { ...(map[String(payload.id)] || {}), ...payload, updatedAt: new Date().toISOString() };
    window.WSD_STORES.tourOverrides = map;
    window.WSD_SAVE.tourOverrides();
    return this.getTour(payload.id);
  },
  deleteTour(id) {
    const map = window.WSD_STORES.tourOverrides || {};
    delete map[String(id)];
    window.WSD_STORES.tourOverrides = map;
    window.WSD_SAVE.tourOverrides();
    const reg = window.WSD_STORES.tourReservations || {};
    delete reg[String(id)];
    window.WSD_STORES.tourReservations = reg;
    window.WSD_SAVE.tourReservations();
  },
  // ── 예약 ──────────────────────────────────────────────────────
  listReservations(tourId) {
    const map = window.WSD_STORES.tourReservations || {};
    return Array.isArray(map[String(tourId)]) ? map[String(tourId)].slice() : [];
  },
  _saveReservations(tourId, list) {
    const map = window.WSD_STORES.tourReservations || {};
    map[String(tourId)] = list;
    window.WSD_STORES.tourReservations = map;
    window.WSD_SAVE.tourReservations();
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
      window.WSD_COMMUNITY.addNotification(reg.userId, {
        type: 'tour_refund_requested', tourId: String(tourId),
        postTitle: tour?.title || '답사',
        fromName: '운영자', message: '환불 신청이 접수되었습니다. 운영자 확인 후 처리됩니다.',
      });
      window.WSD_AUDIT?.log({ action: 'tour.refund_request', target: `tour:${tourId}`, details: { reg: reservationId, reason } });
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
      window.WSD_COMMUNITY.addNotification(reg.userId, {
        type: 'tour_refund_approved', tourId: String(tourId),
        postTitle: tour?.title || '답사',
        fromName: '운영자', message: '환불 신청이 승인되어 처리되었습니다.',
      });
      window.WSD_AUDIT?.log({ action: 'tour.refund_approve', target: `tour:${tourId}`, details: { reg: reservationId } });
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
      window.WSD_COMMUNITY.addNotification(reg.userId, {
        type: 'tour_refund_rejected', tourId: String(tourId),
        postTitle: tour?.title || '답사',
        fromName: '운영자', message: `환불 신청이 반려되었습니다.${adminNote ? ' 사유: ' + adminNote : ''}`,
      });
      window.WSD_AUDIT?.log({ action: 'tour.refund_reject', target: `tour:${tourId}`, details: { reg: reservationId, note: adminNote } });
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
      window.WSD_COMMUNITY.addNotification(updated.userId, {
        type: 'tour_confirmed',
        tourId: String(tourId),
        postTitle: tour?.title || '답사',
        fromName: '운영자',
        message: '답사 입금이 확인되어 참가가 확정되었습니다.',
      });
      window.WSD_AUDIT?.log({ action: 'tour.confirm_payment', target: `tour:${tourId}`, details: { reg: reservationId, user: updated.userId } });
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
      window.WSD_COMMUNITY.addNotification(userId, {
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
    const map = window.WSD_STORES.tourReservations || {};
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
      `UID:tour-${tour.id}@wangsadeul`,
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
    const map = window.WSD_STORES.tourReviews || {};
    return Array.isArray(map[String(tourId)]) ? map[String(tourId)].slice() : [];
  },
  _saveReviews(tourId, list) {
    const map = window.WSD_STORES.tourReviews || {};
    map[String(tourId)] = list;
    window.WSD_STORES.tourReviews = map;
    window.WSD_SAVE.tourReviews();
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

// === 운영 감사 로그(WSD_AUDIT) ============================================
// 운영자(혹은 시스템)가 데이터를 변경할 때마다 한 줄 기록한다. 최근 500건 유지.
window.WSD_AUDIT = {
  log({ action, target, details, by }) {
    const entry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      action: String(action || '').trim(),
      target: String(target || ''),
      details: details || null,
      by: by || (window.WSD_STORES.session?.name) || 'system',
      byId: window.WSD_STORES.session?.id || null,
      ts: new Date().toISOString(),
    };
    const list = [entry, ...(window.WSD_STORES.auditLog || [])].slice(0, 500);
    window.WSD_STORES.auditLog = list;
    window.WSD_SAVE.auditLog();
    return entry;
  },
  list({ search = '', limit = 200 } = {}) {
    const all = (window.WSD_STORES.auditLog || []).slice();
    if (!search) return all.slice(0, limit);
    const q = String(search).toLowerCase();
    return all.filter((e) =>
      String(e.action || '').toLowerCase().includes(q)
      || String(e.target || '').toLowerCase().includes(q)
      || String(e.by || '').toLowerCase().includes(q)
    ).slice(0, limit);
  },
  clear() {
    window.WSD_STORES.auditLog = [];
    window.WSD_SAVE.auditLog();
  },
};

// === 자동 등급 승격(WSD_GRADE_PROMO) ====================================
// 활동(글 + 댓글 가중치)을 기준으로 사용자의 자격 등급을 평가.
// 운영자는 admin / wangsanam 등급은 자동 변경하지 않으며, 기본 흐름은 회원이 활동을
// 쌓을 때만 더 높은 등급으로 '승격'한다(강등은 없음).
window.WSD_GRADE_RULES = {
  reader:  { posts: 0,  comments: 5  },   // 댓글 5개 이상 → 독자
  scholar: { posts: 3,  comments: 15 },   // 글 3개 + 댓글 15개 → 사관
};
const PROMOTION_PROTECTED = new Set(['admin', 'wangsanam']);

window.WSD_GRADE_PROMO = {
  evaluate(userId) {
    const a = window.WSD_AUTH.getActivity(userId);
    if (!a) return null;
    const post = a.postCount || 0;
    const comment = a.commentCount || 0;
    let qualified = 'member';
    Object.entries(window.WSD_GRADE_RULES || {}).forEach(([gid, rule]) => {
      if (post >= (rule.posts || 0) && comment >= (rule.comments || 0)) {
        qualified = gid;
      }
    });
    return qualified;
  },
  // 사용자 행동 후 호출 — 새 등급이 더 높을 때만 승격
  maybePromote(userId) {
    const user = (window.WSD_STORES.users || []).find((u) => u.id === userId);
    if (!user) return null;
    if (user.isAdmin) return null;
    if (PROMOTION_PROTECTED.has(user.gradeId)) return null;
    const grades = window.WSD_STORES.grades || [];
    const currentLv = grades.find((g) => g.id === user.gradeId)?.level ?? 0;
    const targetId = this.evaluate(userId);
    const targetLv = grades.find((g) => g.id === targetId)?.level ?? 0;
    if (targetLv <= currentLv) return null;
    window.WSD_AUTH.setGrade(userId, targetId);
    window.WSD_AUDIT?.log({
      action: 'grade.auto_promote',
      target: `user:${userId}`,
      details: { from: user.gradeId, to: targetId },
      by: 'system',
    });
    window.WSD_COMMUNITY?.addNotification(userId, {
      type: 'grade_promoted',
      postTitle: '회원 등급 안내',
      fromName: '운영자',
      message: `활동을 기반으로 등급이 ${grades.find((g) => g.id === targetId)?.label || targetId}(으)로 승격되었습니다.`,
    });
    return targetId;
  },
};

// === 약관 / 개인정보 처리방침(WSD_LEGAL) helper ==========================
window.WSD_LEGAL = {
  get(slug) {
    const docs = window.WSD_STORES.legalDocs || {};
    return docs[slug] || null;
  },
  save(slug, payload) {
    const docs = window.WSD_STORES.legalDocs || {};
    docs[slug] = { ...(docs[slug] || {}), ...payload, updatedAt: new Date().toISOString() };
    window.WSD_STORES.legalDocs = docs;
    window.WSD_SAVE.legalDocs();
    return docs[slug];
  },
  listSlugs() { return ['privacy', 'terms']; },
};

// === FAQ(WSD_FAQ) helper ================================================
window.WSD_FAQ = {
  listAll() {
    return (window.WSD_STORES.faqs || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
      order: typeof payload.order === 'number' ? payload.order : (window.WSD_STORES.faqs || []).length,
    };
    if (!next.question || !next.answer) return null;
    window.WSD_STORES.faqs = [...(window.WSD_STORES.faqs || []), next];
    window.WSD_SAVE.faqs();
    return next;
  },
  update(id, patch) {
    window.WSD_STORES.faqs = (window.WSD_STORES.faqs || []).map((f) => f.id === id ? { ...f, ...patch } : f);
    window.WSD_SAVE.faqs();
    return (window.WSD_STORES.faqs || []).find((f) => f.id === id) || null;
  },
  remove(id) {
    window.WSD_STORES.faqs = (window.WSD_STORES.faqs || []).filter((f) => f.id !== id);
    window.WSD_SAVE.faqs();
  },
  reorder(id, dir) {
    const list = this.listAll();
    const idx = list.findIndex((f) => f.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= list.length) return;
    const next = list.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    next.forEach((f, i) => { f.order = i; });
    window.WSD_STORES.faqs = next;
    window.WSD_SAVE.faqs();
  },
};

// 사용자 등급 레벨 계산
window.WSD_USER_LEVEL = (user) => {
  if (!user) return 0;
  if (user.isAdmin) return 100;
  const g = window.WSD_STORES.grades.find(x => x.id === user.gradeId);
  return g ? g.level : 10;
};

// 사용자 등급 메타 (label / color / level) 반환
window.WSD_USER_GRADE = (user) => {
  if (!user) return null;
  const grades = window.WSD_STORES.grades || [];
  if (user.isAdmin) return grades.find(g => g.id === 'admin') || null;
  return grades.find(g => g.id === user.gradeId) || null;
};

// 작성자 식별자(id / 이름 / 이메일) 중 가능한 것으로 등급을 찾아 반환
window.WSD_AUTHOR_GRADE = ({ authorId, author, authorEmail } = {}) => {
  const users = window.WSD_STORES.users || [];
  const found = users.find((u) =>
    (authorId && u.id === authorId) ||
    (authorEmail && u.email === authorEmail) ||
    (author && u.name === author)
  );
  return found ? window.WSD_USER_GRADE(found) : null;
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

// 뱅기노자 API 클라이언트
// Cloudflare Workers (banginoja-api) 호출용 얇은 래퍼.
// 세션 쿠키(httpOnly, SameSite=Lax) 기반 인증을 사용하므로 fetch에 credentials: 'include' 필수.
//
// 사용 예:
//   const me = await window.BGNJ_API.me();
//   await window.BGNJ_API.signup({ email, name, password });
//   await window.BGNJ_API.posts.list({ category: 'free' });
//
// 다음 단계(별도 작업): 기존 BGNJ_AUTH / BGNJ_COMMUNITY / BGNJ_BOOKS 헬퍼들을 점진적으로
// 이 어댑터로 위임하도록 마이그레이션. 우선은 어댑터만 노출.

(function () {
  const BASE = "https://banginoja-api.scoutkorea.workers.dev/api";

  // 에러는 단일 형태로 분류해 호출 측에서 사용자에게 정확한 원인을 보일 수 있게 한다.
  // err.kind: 'network' | 'cors' | 'http' | 'parse' | 'unknown'
  // err.status: HTTP 상태 (kind==='http' 일 때만 의미)
  // err.code: 사람이 읽는 코드 — 'NETWORK', 'CORS', 'HTTP_401' 등
  // err.body: 서버 응답 본문 (있으면)
  // err.url:  요청 URL
  const classifyFetchError = (rawErr, url) => {
    const err = new Error(rawErr?.message || "요청 실패");
    err.kind = "network";
    err.code = "NETWORK";
    err.url = url;
    err.cause = rawErr;
    // 'Failed to fetch' / 'NetworkError when attempting to fetch resource.' 등
    // CORS 거부도 'TypeError: Failed to fetch' 로 노출되기 때문에 메시지로 단정 짓지 않고
    // 호출 측이 hint를 함께 보여주도록 한다.
    if (typeof rawErr?.message === "string" && /failed to fetch|networkerror|load failed/i.test(rawErr.message)) {
      err.code = "NETWORK_OR_CORS";
    }
    return err;
  };

  const request = async (method, path, body) => {
    const url = path.startsWith("http") ? path : `${BASE}${path}`;
    const init = {
      method,
      credentials: "include",
      headers: { Accept: "application/json" },
    };
    if (body !== undefined) {
      if (body instanceof FormData) {
        init.body = body;
      } else {
        init.headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(body);
      }
    }
    let resp;
    try {
      resp = await fetch(url, init);
    } catch (rawErr) {
      // 네트워크 단절, DNS 실패, CORS 거부 등 fetch 자체가 throw 한 경우.
      throw classifyFetchError(rawErr, url);
    }
    const text = await resp.text();
    let data = null;
    let parseFailed = false;
    try { data = text ? JSON.parse(text) : null; }
    catch { data = { raw: text }; parseFailed = true; }
    if (!resp.ok) {
      const err = new Error(data?.error || `HTTP ${resp.status}`);
      err.kind = "http";
      err.status = resp.status;
      err.code = `HTTP_${resp.status}`;
      err.body = data;
      err.url = url;
      throw err;
    }
    if (parseFailed) {
      const err = new Error("서버 응답을 해석할 수 없습니다.");
      err.kind = "parse";
      err.code = "PARSE";
      err.body = data;
      err.url = url;
      throw err;
    }
    return data;
  };

  window.BGNJ_API = {
    base: BASE,
    health: () => request("GET", "/health"),

    // ── 인증 ──
    signup: ({ email, name, password, profile, consents }) =>
      request("POST", "/auth/signup", { email, name, password, profile, consents }),
    login: ({ email, password }) =>
      request("POST", "/auth/login", { email, password }),
    logout: () => request("POST", "/auth/logout"),
    me: () => request("GET", "/auth/me"),
    updateProfile: ({ name, profile }) => request("PATCH", "/me", { name, profile }),

    // ── 게시글 ──
    posts: {
      list: ({ category, q, limit } = {}) => {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (q) params.set("q", q);
        if (limit) params.set("limit", String(limit));
        const qs = params.toString();
        return request("GET", `/posts${qs ? "?" + qs : ""}`);
      },
      get: (id) => request("GET", `/posts/${id}`),
      create: ({ categoryId, title, body, prefix }) =>
        request("POST", "/posts", { categoryId, title, body, prefix }),
      update: (id, patch) => request("PATCH", `/posts/${id}`, patch),
      remove: (id) => request("DELETE", `/posts/${id}`),
      comments: {
        list: (postId) => request("GET", `/posts/${postId}/comments`),
        create: (postId, { body, parentId }) =>
          request("POST", `/posts/${postId}/comments`, { body, parentId }),
        remove: (postId, commentId) => request("DELETE", `/posts/${postId}/comments/${commentId}`),
      },
    },

    // ── 책 ──
    books: {
      list: () => request("GET", "/books"),
      get: (id) => request("GET", `/books/${id}`),
      create: (payload) => request("POST", "/books", payload),
      update: (id, patch) => request("PATCH", `/books/${id}`, patch),
      remove: (id) => request("DELETE", `/books/${id}`),
      reviews: {
        list: (bookId) => request("GET", `/books/${bookId}/reviews`),
        create: (bookId, { rating, body }) => request("POST", `/books/${bookId}/reviews`, { rating, body }),
        remove: (reviewId) => request("DELETE", `/book-reviews/${reviewId}`),
      },
    },

    // ── 책 주문 ──
    bookOrders: {
      create: (payload) => request("POST", "/book-orders", payload),
      mine: () => request("GET", "/me/orders"),
      adminList: ({ status } = {}) => request("GET", `/admin/book-orders${status ? `?status=${status}` : ""}`),
      update: (id, patch) => request("PATCH", `/book-orders/${id}`, patch),
    },

    // ── 미디어 ──
    media: {
      // file: File 객체, folder: 'covers' | 'pdfs' | 'logos' 등
      upload: (file, { folder = "uploads" } = {}) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);
        return request("POST", "/media/upload", fd);
      },
      url: (key) => `${BASE}/media/${key}`,
    },

    // ── 강연 ──
    lectures: {
      list: ({ includeHidden } = {}) => request("GET", `/lectures${includeHidden ? "?includeHidden=1" : ""}`),
      get: (id) => request("GET", `/lectures/${id}`),
      create: (payload) => request("POST", "/lectures", payload),
      update: (id, patch) => request("PATCH", `/lectures/${id}`, patch),
      remove: (id) => request("DELETE", `/lectures/${id}`),
      register: (id, { phone } = {}) => request("POST", `/lectures/${id}/register`, { phone }),
      mineRegistrations: () => request("GET", "/me/lectures"),
      cancelRegistration: (regId) => request("DELETE", `/lecture-registrations/${regId}`),
      patchRegistration: (regId, patch) => request("PATCH", `/lecture-registrations/${regId}`, patch),
      reviews: {
        list: (lectureId) => request("GET", `/lectures/${lectureId}/reviews`),
        create: (lectureId, { rating, body }) => request("POST", `/lectures/${lectureId}/reviews`, { rating, body }),
        remove: (reviewId) => request("DELETE", `/lecture-reviews/${reviewId}`),
      },
    },

    // ── 투어 ──
    tours: {
      list: ({ includeHidden } = {}) => request("GET", `/tours${includeHidden ? "?includeHidden=1" : ""}`),
      get: (id) => request("GET", `/tours/${id}`),
      create: (payload) => request("POST", "/tours", payload),
      update: (id, patch) => request("PATCH", `/tours/${id}`, patch),
      remove: (id) => request("DELETE", `/tours/${id}`),
      reserve: (id, { phone } = {}) => request("POST", `/tours/${id}/reserve`, { phone }),
      mineReservations: () => request("GET", "/me/tours"),
      cancelReservation: (regId) => request("DELETE", `/tour-reservations/${regId}`),
      patchReservation: (regId, patch) => request("PATCH", `/tour-reservations/${regId}`, patch),
      reviews: {
        list: (tourId) => request("GET", `/tours/${tourId}/reviews`),
        create: (tourId, { rating, body }) => request("POST", `/tours/${tourId}/reviews`, { rating, body }),
        remove: (reviewId) => request("DELETE", `/tour-reviews/${reviewId}`),
      },
    },

    // ── 알림 ──
    notifications: {
      list: () => request("GET", "/notifications"),
      markRead: (id) => request("POST", `/notifications/${id}/read`),
      markAllRead: () => request("POST", "/notifications/all/read"),
    },

    // ── 좋아요 / 북마크 ──
    likes: {
      list: (postId) => request("GET", `/posts/${postId}/likes`),
      toggle: (postId) => request("POST", `/posts/${postId}/likes`),
    },
    bookmarks: {
      toggle: (postId) => request("POST", `/posts/${postId}/bookmark`),
      mine: () => request("GET", "/me/bookmarks"),
    },

    // ── 신고 ──
    reports: {
      create: ({ postId, postTitle, reason, reporterName }) =>
        request("POST", "/reports", { postId, postTitle, reason, reporterName }),
    },

    // ── 관리자 ──
    admin: {
      users: {
        list: ({ q } = {}) => request("GET", `/admin/users${q ? `?q=${encodeURIComponent(q)}` : ""}`),
        update: (id, patch) => request("PATCH", `/admin/users/${id}`, patch),
        remove: (id) => request("DELETE", `/admin/users/${id}`),
      },
      audit: {
        list: ({ limit } = {}) => request("GET", `/admin/audit${limit ? `?limit=${limit}` : ""}`),
        create: ({ action, target, details }) => request("POST", "/admin/audit", { action, target, details }),
      },
      reports: {
        list: ({ status } = {}) => request("GET", `/admin/reports${status ? `?status=${status}` : ""}`),
        update: (id, patch) => request("PATCH", `/admin/reports/${id}`, patch),
      },
    },

    // ── 사이트 콘텐츠 / FAQ / 약관 / 입금 계좌 / 카테고리 / 등급 ──
    columns: {
      list: ({ includeAll } = {}) => request("GET", `/columns${includeAll ? "?includeAll=1" : ""}`),
      get: (id) => request("GET", `/columns/${id}`),
      create: (payload) => request("POST", "/columns", payload),
      update: (id, patch) => request("PATCH", `/columns/${id}`, patch),
      remove: (id) => request("DELETE", `/columns/${id}`),
    },
    siteContent: {
      get: () => request("GET", "/site-content"),
      saveSection: (section, data) => request("PATCH", `/site-content/${section}`, { data }),
    },
    faqs: {
      list: () => request("GET", "/faqs"),
      adminList: () => request("GET", "/admin/faqs"),
      create: (payload) => request("POST", "/faqs", payload),
      update: (id, patch) => request("PATCH", `/faqs/${id}`, patch),
      remove: (id) => request("DELETE", `/faqs/${id}`),
    },
    legal: {
      get: (slug) => request("GET", `/legal/${slug}`),
      put: (slug, { title, body }) => request("PUT", `/legal/${slug}`, { title, body }),
    },
    bankAccount: {
      get: () => request("GET", "/bank-account"),
      put: (payload) => request("PUT", "/bank-account", payload),
    },
    bankAccounts: {
      list: () => request("GET", "/bank-accounts"),
      create: (payload) => request("POST", "/bank-accounts", payload),
      update: (id, patch) => request("PATCH", `/bank-accounts/${id}`, patch),
      remove: (id) => request("DELETE", `/bank-accounts/${id}`),
    },
    categories: {
      list: () => request("GET", "/categories"),
      create: (payload) => request("POST", "/categories", payload),
      update: (id, patch) => request("PATCH", `/categories/${id}`, patch),
      remove: (id) => request("DELETE", `/categories/${id}`),
    },
    grades: {
      list: () => request("GET", "/grades"),
      upsert: (id, payload) => request("PUT", `/grades/${id}`, payload),
      remove: (id) => request("DELETE", `/grades/${id}`),
    },
    errorLog: {
      // POST 는 인증 없이도 가능 (익명 오류도 기록).
      report: ({ code, status, kind, message, hint, url, pathname, origin }) =>
        request("POST", "/error-log", { code, status, kind, message, hint, url, pathname, origin }),
      list: ({ limit, code } = {}) => {
        const qs = new URLSearchParams();
        if (limit) qs.set("limit", String(limit));
        if (code) qs.set("code", code);
        const s = qs.toString();
        return request("GET", `/admin/error-log${s ? "?" + s : ""}`);
      },
      clear: () => request("DELETE", "/admin/error-log"),
    },
  };
})();

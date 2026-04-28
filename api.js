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
    signup: ({ email, name, password, consents }) =>
      request("POST", "/auth/signup", { email, name, password, consents }),
    login: ({ email, password }) =>
      request("POST", "/auth/login", { email, password }),
    logout: () => request("POST", "/auth/logout"),
    me: () => request("GET", "/auth/me"),

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
      },
    },

    // ── 책 ──
    books: {
      list: () => request("GET", "/books"),
      get: (id) => request("GET", `/books/${id}`),
      create: (payload) => request("POST", "/books", payload),
      update: (id, patch) => request("PATCH", `/books/${id}`, patch),
      remove: (id) => request("DELETE", `/books/${id}`),
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
    },

    // ── 투어 ──
    tours: {
      list: ({ includeHidden } = {}) => request("GET", `/tours${includeHidden ? "?includeHidden=1" : ""}`),
      get: (id) => request("GET", `/tours/${id}`),
      create: (payload) => request("POST", "/tours", payload),
      update: (id, patch) => request("PATCH", `/tours/${id}`, patch),
      remove: (id) => request("DELETE", `/tours/${id}`),
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
      },
      reports: {
        list: ({ status } = {}) => request("GET", `/admin/reports${status ? `?status=${status}` : ""}`),
        update: (id, patch) => request("PATCH", `/admin/reports/${id}`, patch),
      },
    },
  };
})();

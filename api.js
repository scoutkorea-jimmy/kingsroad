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
    const resp = await fetch(url, init);
    const text = await resp.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
    if (!resp.ok) {
      const err = new Error(data?.error || `HTTP ${resp.status}`);
      err.status = resp.status;
      err.body = data;
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
  };
})();

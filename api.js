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
  // v00.295.004 — workers.dev → api.bgnj.net.
  //   사이트(bgnj.net)와 같은 사이트가 되어야 세션 쿠키가 third-party 쿠키를 면한다.
  //   workers.dev 는 다른 사이트였고, Safari 는 그 쿠키를 전면 차단했다(handoff 15번 장애).
  //   옛 주소도 계속 살아 있다 — 옛 코드를 문 브라우저가 갑자기 끊기지 않게 하기 위해서다.
  //   ⚠ 이 값을 바꾸면 index.html 의 CSP connect-src 도 같이 열어야 한다. 안 그러면 전부 차단된다.
  const BASE = "https://api.bgnj.net/api";
  // v00.148 — BGNJ_ANALYTICS sendBeacon 용 base url 노출.
  try { window.BGNJ_API_BASE = BASE; } catch (_e) { console.warn('[bgnj] api.js:16 오류(무시하고 진행)', _e); }

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

  // === 세션 토큰 (v00.295.003) =========================================
  // 왜 쿠키만으로는 안 되는가:
  //   사이트는 bgnj.net, 이 API 는 banginoja-api.scoutkorea.workers.dev 다. 서로 다른 사이트다.
  //   그래서 세션 쿠키는 third-party 쿠키가 되고, Safari 는 13.1 부터 이를 전면 차단한다.
  //   2026-08-21 실제로 Safari 사용자가 네 번 로그인하고도 사진 업로드가 모두 401 로 튕겼다.
  //   로그인 응답 본문의 token 을 보관해 Authorization: Bearer 로 함께 보낸다.
  //   서버 readSessionToken 은 Bearer 를 쿠키보다 먼저 본다.
  // 한계: localStorage 라 httpOnly 쿠키보다 XSS 에 약하다. 근본 해결은 API 를 api.bgnj.net 같은
  //   같은 사이트 도메인에 두어 쿠키가 살아나게 하는 것이다. 그때도 이 경로는 방어선으로 남겨 둔다.
  const TOKEN_KEY = "bgnj_session_token";
  const readToken = () => {
    try { return localStorage.getItem(TOKEN_KEY) || ""; }
    catch (_e) { console.warn('[bgnj] 저장소 읽기 — 토큰 없이 진행 (api.js)', _e); return ""; }
  };
  const writeToken = (token) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (_e) { console.warn('[bgnj] 저장소 쓰기 실패 — 쿠키로만 진행 (api.js)', _e); }
  };

  // v00.262.003 — E2 stall hang 차단. 모든 fetch 에 15s timeout 적용.
  // 업로드(FormData) 는 더 큰 cap(60s) 필요할 수 있으니 별도 처리.
  const REQUEST_TIMEOUT_MS = 15_000;
  const UPLOAD_TIMEOUT_MS  = 60_000;

  const request = async (method, path, body) => {
    const url = path.startsWith("http") ? path : `${BASE}${path}`;
    const isUpload = body instanceof FormData;
    const ctrl = new AbortController();
    const timeoutMs = isUpload ? UPLOAD_TIMEOUT_MS : REQUEST_TIMEOUT_MS;
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const init = {
      method,
      credentials: "include",
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    };
    // 쿠키가 막힌 브라우저(Safari 등)를 위한 두 번째 경로. CORS 는 Authorization 을 이미 허용한다(실측).
    const _token = readToken();
    if (_token) init.headers.Authorization = `Bearer ${_token}`;
    if (body !== undefined) {
      if (isUpload) {
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
      clearTimeout(timer);
      // v00.262.003 — AbortError → timeout 으로 분류. UX: '응답이 늦어 중단' 명시.
      if (rawErr?.name === 'AbortError') {
        const err = new Error(`요청 시간 초과 (${Math.round(timeoutMs/1000)}s)`);
        err.kind = 'timeout';
        err.code = 'TIMEOUT';
        err.url = url;
        err.cause = rawErr;
        throw err;
      }
      // 네트워크 단절, DNS 실패, CORS 거부 등 fetch 자체가 throw 한 경우.
      throw classifyFetchError(rawErr, url);
    }
    clearTimeout(timer);
    const text = await resp.text();
    let data = null;
    let parseFailed = false;
    try { data = text ? JSON.parse(text) : null; }
    catch { data = { raw: text }; parseFailed = true; }
    if (!resp.ok) {
      // 401 = 이 토큰으로는 누구도 아니다. 들고 있어 봐야 계속 튕기므로 버린다.
      // 단, 아래 경로의 401 은 뜻이 다르다 — '네 세션이 죽었다' 가 아니라 '입력한 비밀번호가 틀렸다' 다.
      //   /auth/login · /auth/signup : 자격 증명 검증
      //   /me/password              : 현재 비밀번호 확인 (로그인된 상태에서 호출된다)
      // 여기서 토큰을 지우면 비밀번호를 한 번 잘못 치는 것만으로 로그아웃된다.
      // 쿠키가 되는 브라우저는 쿠키로 버티지만, Safari 는 그대로 튕겨 나간다.
      const _isCredentialCheck = /^\/(auth\/login|auth\/signup|me\/password)(\?|$)/.test(path);
      if (resp.status === 401 && !_isCredentialCheck) writeToken("");
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
    signup: async ({ email, name, password, profile, consents }) => {
      const res = await request("POST", "/auth/signup", { email, name, password, profile, consents });
      if (res?.token) writeToken(res.token);
      return res;
    },
    login: async ({ email, password }) => {
      const res = await request("POST", "/auth/login", { email, password });
      if (res?.token) writeToken(res.token);
      return res;
    },
    logout: async () => {
      // 서버 세션 삭제가 실패하더라도 내 손의 토큰은 반드시 버린다.
      try { return await request("POST", "/auth/logout"); }
      finally { writeToken(""); }
    },
    me: () => request("GET", "/auth/me"),
    updateProfile: ({ name, profile }) => request("PATCH", "/me", { name, profile }),
    // v00.201 — 본인 비밀번호 변경 (P1 #3).
    changePassword: ({ currentPassword, newPassword }) =>
      request("PATCH", "/me/password", { currentPassword, newPassword }),

    // ── 게시글 ──
    posts: {
      // v00.201 — includeBody 옵션 (P1 #4 본문 검색).
      list: ({ category, q, limit, includeBody } = {}) => {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (q) params.set("q", q);
        if (limit) params.set("limit", String(limit));
        if (includeBody) params.set("includeBody", "1");
        const qs = params.toString();
        return request("GET", `/posts${qs ? "?" + qs : ""}`);
      },
      get: (id) => request("GET", `/posts/${id}`),
      create: ({ categoryId, title, body, prefix }) =>
        request("POST", "/posts", { categoryId, title, body, prefix }),
      update: (id, patch) => request("PATCH", `/posts/${id}`, patch),
      remove: (id) => request("DELETE", `/posts/${id}`),
      // v00.244 — 조회수 server persistence (칼럼 패턴 미러). 비로그인도 카운트, sessionStorage 가드는 클라이언트.
      view: (id) => request("POST", `/posts/${id}/view`),
    },

    // v00.306.004 — 댓글 창구는 하나다. 글이든 칼럼이든 (targetType, targetId) 로 가리킨다.
    //   옛 /posts/:id/comments 는 서버에 껍데기로 남아 있지만(옛 캐시 보호용)
    //   **클라이언트는 새 주소만 쓴다** — 두 길을 다 쓰면 어느 쪽이 진짜인지 알 수 없게 된다.
    comments: {
      list: (targetType, targetId) =>
        request("GET", `/comments?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`),
      create: (targetType, targetId, { body, parentId }) =>
        request("POST", `/comments`, { targetType, targetId, body, parentId }),
      remove: (commentId) => request("DELETE", `/comments/${encodeURIComponent(commentId)}`),
    },

    // ── 책 ──
    books: {
      // v00.132 — admin 호출 시 ?includeAll=1 로 draft 포함 전체 조회.
      list: ({ includeAll } = {}) => request("GET", `/books${includeAll ? '?includeAll=1' : ''}`),
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
      // v00.261 — admin hard delete (테스트 청소). audit_log 자동 기록.
      adminDelete: (id) => request("DELETE", `/book-orders/${id}`),
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
      adminRegistrations: (lectureId) => request("GET", `/lectures/${lectureId}/registrations`),
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
      adminReservations: (tourId) => request("GET", `/tours/${tourId}/reservations`),
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

    // v00.183 — 내부 인원(admin) broadcast 알람.
    // recipients: 'all_admins' (전체 관리자) | userId 배열 (특정 사용자 다건).
    internalAlarm: {
      send: ({ recipients, title, message, excludeSelf } = {}) =>
        request("POST", "/admin/internal-alarm", { recipients, title, message, excludeSelf }),
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
      // v00.306.009 — 관리자 대시보드 '오늘' 한 줄. 한국 시간 자정 기준으로 서버가 센다.
      today: () => request("GET", "/admin/today"),
      users: {
        list: ({ q } = {}) => request("GET", `/admin/users${q ? `?q=${encodeURIComponent(q)}` : ""}`),
        update: (id, patch) => request("PATCH", `/admin/users/${id}`, patch),
        remove: (id) => request("DELETE", `/admin/users/${id}`),
        activity: (id) => request("GET", `/admin/users/${id}/activity`),
        // v00.062 — D1 정확 계산 metrics. BGNJ_GRADE_PROMO.metrics 가 prefer.
        metrics: (id) => request("GET", `/admin/users/${id}/metrics`),
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
      // v00.201 — q + includeBody 옵션 (P1 #4 본문 검색).
      list: ({ includeAll, q, includeBody } = {}) => {
        const params = new URLSearchParams();
        if (includeAll) params.set("includeAll", "1");
        if (q) params.set("q", q);
        if (includeBody) params.set("includeBody", "1");
        const qs = params.toString();
        return request("GET", `/columns${qs ? "?" + qs : ""}`);
      },
      get: (id) => request("GET", `/columns/${id}`),
      create: (payload) => request("POST", "/columns", payload),
      update: (id, patch) => request("PATCH", `/columns/${id}`, patch),
      remove: (id) => request("DELETE", `/columns/${id}`),
      like: (id) => request("POST", `/columns/${id}/like`),
      view: (id) => request("POST", `/columns/${id}/view`),
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
    // v00.148 — page-view 분석 + 사용자 여정.
    analytics: {
      // v00.173 — days param 지원 (7/14/30/90). 기본 14.
      track: (payload) => request("POST", "/analytics/page-view", payload),
      // v00.179 — refDays / routeDays 추가 (각 섹션 독립 코호트).
      // v00.194 — heatmapDays 추가 (24h × 7요일 히트맵 코호트).
      summary: ({ days, refDays, routeDays, heatmapDays } = {}) => {
        const params = new URLSearchParams();
        if (days != null) params.set('days', String(days));
        if (refDays != null) params.set('refDays', String(refDays));
        if (routeDays != null) params.set('routeDays', String(routeDays));
        if (heatmapDays != null) params.set('heatmapDays', String(heatmapDays));
        const qs = params.toString();
        return request("GET", `/analytics/summary${qs ? '?' + qs : ''}`);
      },
      userJourney: (userId) => request("GET", `/admin/user-journey/${userId}`),
    },

    // ── 한켠(숙소) 예약 PMS (v00.267) ──
    hangyeon: {
      roomTypes: ({ includeAll } = {}) => request("GET", `/hangyeon/room-types${includeAll ? "?includeAll=1" : ""}`),
      createRoomType: (payload) => request("POST", "/hangyeon/room-types", payload),
      updateRoomType: (id, patch) => request("PATCH", `/hangyeon/room-types/${id}`, patch),
      removeRoomType: (id) => request("DELETE", `/hangyeon/room-types/${id}`),
      availability: ({ from, to, roomTypeId } = {}) => {
        const qs = new URLSearchParams();
        if (from) qs.set("from", from);
        if (to) qs.set("to", to);
        if (roomTypeId) qs.set("roomTypeId", roomTypeId);
        return request("GET", `/hangyeon/availability?${qs.toString()}`);
      },
      setAvailability: (payload) => request("PUT", "/hangyeon/availability", payload),
      slots: ({ roomTypeId, date } = {}) => request("GET", `/hangyeon/slots?roomTypeId=${encodeURIComponent(roomTypeId)}&date=${encodeURIComponent(date)}`),
      day: ({ from, to } = {}) => request("GET", `/hangyeon/day?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
      quote: (payload) => request("POST", "/hangyeon/quote", payload),
      book: (payload) => request("POST", "/hangyeon/bookings", payload),
      mineBookings: () => request("GET", "/me/hangyeon-bookings"),
      cancelBooking: (id) => request("DELETE", `/hangyeon/bookings/${id}`),
      adminBookings: ({ status, from, to } = {}) => {
        const qs = new URLSearchParams();
        if (status) qs.set("status", status);
        if (from) qs.set("from", from);
        if (to) qs.set("to", to);
        const s = qs.toString();
        return request("GET", `/hangyeon/bookings${s ? "?" + s : ""}`);
      },
      patchBooking: (id, patch) => request("PATCH", `/hangyeon/bookings/${id}`, patch),
      bookingLog: (id) => request("GET", `/hangyeon/bookings/${id}/log`),
      payments: (id) => request("GET", `/hangyeon/bookings/${id}/payments`),
      addPayment: (id, payload) => request("POST", `/hangyeon/bookings/${id}/payments`, payload),
      rateRules: () => request("GET", "/hangyeon/rate-rules"),
      createRateRule: (payload) => request("POST", "/hangyeon/rate-rules", payload),
      updateRateRule: (id, patch) => request("PATCH", `/hangyeon/rate-rules/${id}`, patch),
      removeRateRule: (id) => request("DELETE", `/hangyeon/rate-rules/${id}`),
      coupons: () => request("GET", "/hangyeon/coupons"),
      upsertCoupon: (payload) => request("POST", "/hangyeon/coupons", payload),
      removeCoupon: (code) => request("DELETE", `/hangyeon/coupons/${code}`),
      guests: () => request("GET", "/hangyeon/guests"),
      patchGuest: (id, patch) => request("PATCH", `/hangyeon/guests/${id}`, patch),
      units: () => request("GET", "/hangyeon/room-units"),
      createUnit: (payload) => request("POST", "/hangyeon/room-units", payload),
      updateUnit: (id, patch) => request("PATCH", `/hangyeon/room-units/${id}`, patch),
      removeUnit: (id) => request("DELETE", `/hangyeon/room-units/${id}`),
    },
  };
})();

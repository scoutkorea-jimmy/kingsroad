// 뱅기노자 백엔드 Worker — Cloudflare Workers + D1 + R2.
// 모든 공개 엔드포인트는 /api/* 아래.
//
// 구조:
//   GET  /api/health
//   POST /api/auth/signup
//   POST /api/auth/login
//   POST /api/auth/logout
//   GET  /api/auth/me
//   GET  /api/posts?category=...&q=...
//   POST /api/posts                       (auth)
//   GET  /api/posts/:id
//   PATCH /api/posts/:id                  (auth: author or admin)
//   DELETE /api/posts/:id                 (auth: author or admin)
//   GET  /api/posts/:id/comments
//   POST /api/posts/:id/comments          (auth)
//   GET  /api/books
//   GET  /api/books/:id
//   POST /api/books                       (admin)
//   PATCH /api/books/:id                  (admin)
//   DELETE /api/books/:id                 (admin)
//   POST /api/media/upload                (admin) — multipart, 단일 파일을 R2에 저장
//   GET  /api/media/:key                  — R2 객체 프록시(공개)
//
// 인증: bgnj_session 쿠키(httpOnly, SameSite=Lax) + Authorization: Bearer <token>
// 비밀번호: PBKDF2-SHA256, 100k iter, salt 16바이트.

// ──────── 유틸 ─────────────────────────────────────────────

const json = (body, init = {}, env = null) => {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
};

// v00.198 — public read endpoint 에 CDN edge cache 헤더 부착.
// 사용자 우선순위 '속도감 ↑ + 기능 회귀 0'.
// 안전 가드:
//   1) URL query 에 admin-only 분기 (includeAll/includeHidden) 가 있으면 cache 안 함.
//   2) 요청에 bgnj_session 쿠키가 있으면 cache 안 함 (admin 가능성 — public response 가 admin 데이터 노출 방지).
//   3) write method (POST/PATCH/PUT/DELETE) 는 자연스럽게 호출자가 wrapper 안 거침.
// 결과: 익명 방문자의 GET 만 CDN edge 캐시 → 비로그인 첫 트래픽이 압도적인 list endpoint 에 효과.
const _publicCacheable = (req) => {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get('includeAll') === '1') return false;
    if (url.searchParams.get('includeHidden') === '1') return false;
    const cookie = req.headers.get('cookie') || '';
    if (cookie.includes('bgnj_session=')) return false;
    return true;
  } catch { return false; }
};
const _withPublicCache = (resp, seconds) => {
  // 200 이외 응답은 캐시하지 않음 (json() 은 init.status 를 따름 → 기본 200).
  if (resp.status !== 200) return resp;
  resp.headers.set('Cache-Control', `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 2}`);
  return resp;
};

const isLocalDevOrigin = (origin) => {
  // 로컬 개발 환경(127.0.0.1 / localhost) 의 임의 포트 자동 허용.
  // VS Code Live Server(5500), Vite(5173), Python http.server(8000) 등 임시 포트 대응.
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
};

const corsHeaders = (origin, env) => {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin) || allowed.includes("*") || isLocalDevOrigin(origin);
  const h = new Headers();
  if (ok && origin) h.set("Access-Control-Allow-Origin", origin);
  h.set("Vary", "Origin");
  h.set("Access-Control-Allow-Credentials", "true");
  h.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  h.set("Access-Control-Max-Age", "86400");
  return h;
};

const withCors = (resp, origin, env) => {
  const h = new Headers(resp.headers);
  const cors = corsHeaders(origin, env);
  cors.forEach((v, k) => h.set(k, v));
  return new Response(resp.body, { status: resp.status, headers: h });
};

const randomId = (prefix = "") => {
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  const hex = Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}-${hex}` : hex;
};

const nowIso = () => new Date().toISOString();

const toBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromBase64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

const hashPassword = async (password, saltB64) => {
  const salt = saltB64 ? fromBase64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const keyMat = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMat,
    256,
  );
  return { hash: toBase64(bits), salt: toBase64(salt) };
};

const verifyPassword = async (password, hashB64, saltB64) => {
  const { hash } = await hashPassword(password, saltB64);
  return hash === hashB64;
};

const isEmail = (s) => typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// ──────── 세션 ─────────────────────────────────────────────

const SESSION_COOKIE = "bgnj_session";

const newSessionToken = () => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
};

// 크로스사이트 인증 쿠키 — 사이트(bgnj.net) 와 API(workers.dev) 가 서로 다른 도메인이라
// SameSite=None 이어야 fetch credentials:include 가 쿠키를 동봉한다.
// SameSite=None 은 반드시 Secure 와 함께 사용해야 하지만, workers.dev 가 항상 HTTPS 이므로
// 쿠키 설정 단계에서 Secure 가 충족된다 (사이트 본 페이지가 HTTP 여도 무관).
const setSessionCookie = (resp, token, ttl) => {
  const h = new Headers(resp.headers);
  h.append("Set-Cookie", `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${ttl}; HttpOnly; Secure; SameSite=None`);
  return new Response(resp.body, { status: resp.status, headers: h });
};

const clearSessionCookie = (resp) => {
  const h = new Headers(resp.headers);
  h.append("Set-Cookie", `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None`);
  return new Response(resp.body, { status: resp.status, headers: h });
};

const readSessionToken = (req) => {
  const auth = req.headers.get("Authorization");
  if (auth && auth.startsWith("Bearer ")) return auth.slice(7).trim();
  const cookie = req.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return m ? m[1] : null;
};

// 슈퍼 관리자 — 로그인/세션 조회 시 항상 is_admin=1 / grade_id='admin' 강제.
// 환경 변수 SUPER_ADMIN_EMAILS 에 콤마로 여러 개 지정 가능.
const isSuperAdminEmail = (email, env) => {
  const list = String(env.SUPER_ADMIN_EMAILS || "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return list.includes(String(email || "").trim().toLowerCase());
};

const ensureSuperAdmin = async (env, userId, email) => {
  if (!isSuperAdminEmail(email, env)) return false;
  await env.DB.prepare(
    "UPDATE users SET is_admin = 1, grade_id = 'admin' WHERE id = ? AND (is_admin <> 1 OR grade_id <> 'admin')"
  ).bind(userId).run();
  return true;
};

// v00.262.006 — 모듈 스코프 플래그. schema-v10 미적용 D1 에서 매 요청 catch 진입 +
// console.warn 폭주 + UPDATE 시도 실패 누적 방지. 1번 실패 후엔 폴백 SELECT 만 사용.
let __lastLoginColMissing = false;
const getCurrentUser = async (req, env) => {
  const token = readSessionToken(req);
  if (!token) return null;
  // v00.262 핫픽스 — last_login_at 은 schema-v10 신규 컬럼. 마이그레이션 전 D1 에서
  // 이 컬럼을 참조하면 SELECT 자체가 실패해 모든 인증 요청이 500 → 전체 outage.
  // try/catch 폴백 + 모듈 스코프 캐시로 1회 실패 후 fast-path 사용.
  let row;
  const SQL_WITH    = `SELECT u.id, u.email, u.name, u.is_admin, u.grade_id, u.profile_json, u.consents_json, u.created_at, u.last_login_at, s.expires_at
     FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?`;
  const SQL_WITHOUT = `SELECT u.id, u.email, u.name, u.is_admin, u.grade_id, u.profile_json, u.consents_json, u.created_at, s.expires_at
     FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?`;
  if (__lastLoginColMissing) {
    row = await env.DB.prepare(SQL_WITHOUT).bind(token).first();
  } else {
    try {
      row = await env.DB.prepare(SQL_WITH).bind(token).first();
    } catch (e) {
      __lastLoginColMissing = true;
      try { console.warn('[getCurrentUser] last_login_at column missing — falling back permanently this worker', e?.message || e); } catch {}
      row = await env.DB.prepare(SQL_WITHOUT).bind(token).first();
    }
  }
  if (!row) return null;
  if (Number(row.expires_at) < Date.now()) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    return null;
  }
  // 슈퍼 관리자 강제 동기화 — 매 세션 조회 시점에 권한 확정.
  let isAdmin = !!row.is_admin;
  let gradeId = row.grade_id;
  if (isSuperAdminEmail(row.email, env)) {
    if (!isAdmin || gradeId !== 'admin') {
      await ensureSuperAdmin(env, row.id, row.email);
      isAdmin = true;
      gradeId = 'admin';
    }
  }
  // v00.262.006 — 성능 회귀 패치. 이전 throttle 로직은 row.last_login_at === null 인
  // 기존 사용자에게 매 요청마다 UPDATE 발화 (페이지 로드 시 동시 5~10 API → UPDATE 폭주
  // → hot path 2x latency). last_login_at 은 handleAuthLogin 에서 갱신되므로 getCurrentUser
  // 의 추가 UPDATE 는 30일 세션 사용자의 stale 방지용일 뿐. fire-and-forget 으로 전환해
  // 메인 응답 latency 에 영향 0. 컬럼 부재 환경은 skip.
  if (!__lastLoginColMissing) {
    try {
      const cutoffMs = 24 * 60 * 60 * 1000;
      const lastMs = row.last_login_at ? Date.parse(row.last_login_at) : 0;
      if (!lastMs || (Date.now() - lastMs) > cutoffMs) {
        // await 없음 — 응답 차단 안 함. 실패해도 다음 요청에서 재시도.
        env.DB.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`)
          .bind(nowIso(), row.id).run()
          .catch((e) => { try { console.warn('[last_login_at update]', e?.message || e); } catch {} });
      }
    } catch {}
  }
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    isAdmin,
    gradeId,
    profile: row.profile_json ? JSON.parse(row.profile_json) : null,
    consents: row.consents_json ? JSON.parse(row.consents_json) : null,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
};

const requireUser = async (req, env) => {
  const user = await getCurrentUser(req, env);
  if (!user) throw new HttpError(401, "로그인이 필요합니다.");
  return user;
};

const requireAdmin = async (req, env) => {
  const user = await requireUser(req, env);
  if (!user.isAdmin) throw new HttpError(403, "관리자 권한이 필요합니다.");
  return user;
};

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// === Admin createdAt 오버라이드 (v00.115) ==================================
// admin 이 게시글/칼럼을 작성할 때 표시 시간(created_at) 을 임의 값으로 지정 가능.
// 일반 사용자는 이 필드를 보내도 무시 (보안 — 시간 위조 방지).
// 형식: ISO 8601 (예: '2026-05-01T18:30:00+09:00' 또는 '2026-05-01T09:30:00Z').
const resolveCreatedAt = (user, body) => {
  if (!user?.isAdmin) return nowIso();
  const raw = String(body?.createdAt || '').trim();
  if (!raw) return nowIso();
  // ISO 8601 의 핵심 패턴 — date+time + (Z or ±HH:MM).
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/.test(raw)) {
    throw new HttpError(400, 'createdAt 은 ISO 8601 형식이어야 합니다.');
  }
  const t = Date.parse(raw);
  if (isNaN(t)) throw new HttpError(400, '잘못된 날짜.');
  return raw;
};

// === Brute-force rate limiting (v00.113) ===================================
// /api/auth/login + /api/auth/signup 에 대해 email + IP 단위로 최근 15분 실패 5회 → 잠금.
// 스토리지: D1 login_attempts (schema-v4.sql).
// 운영: wrangler d1 execute banginoja-db --remote --file=workers/schema-v4.sql 1회 실행 필요.
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_FAILS = 5;
const RATE_GC_MS = 24 * 3600 * 1000;

const clientIp = (req) => {
  return req.headers.get('CF-Connecting-IP')
      || req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
      || '';
};

const checkRateLimit = async (env, email, ip) => {
  // v00.116 — 슈퍼 관리자 / bootstrap admin 이메일은 throttle 제외 (운영 위험 차단).
  // 일반 admin (DB is_admin=1) 은 비밀번호 검증 후에만 admin 으로 인식되므로 throttle 시점엔 모름 — 이메일 매칭만 사용.
  if (isSuperAdminEmail(email, env)) return;
  const bootstrap = String(env.ADMIN_BOOTSTRAP_EMAIL || '').trim().toLowerCase();
  if (bootstrap && email === bootstrap) return;
  // login_attempts 테이블 부재 시 (schema-v4 미적용) 통과 — graceful degradation.
  try {
    const since = Date.now() - RATE_WINDOW_MS;
    const row = await env.DB.prepare(
      `SELECT COUNT(*) AS c FROM login_attempts
       WHERE ok = 0 AND attempted_at > ? AND (email = ? OR ip = ?)`
    ).bind(since, email || '', ip || '').first();
    const fails = Number(row?.c || 0);
    if (fails >= RATE_MAX_FAILS) {
      // 가장 오래된 실패 시점 + window = 잠금 해제 시점.
      const oldest = await env.DB.prepare(
        `SELECT MIN(attempted_at) AS t FROM login_attempts
         WHERE ok = 0 AND attempted_at > ? AND (email = ? OR ip = ?)`
      ).bind(since, email || '', ip || '').first();
      const unlockAt = Number(oldest?.t || Date.now()) + RATE_WINDOW_MS;
      const remainSec = Math.max(60, Math.ceil((unlockAt - Date.now()) / 1000));
      throw new HttpError(429, `너무 많은 시도. ${Math.ceil(remainSec / 60)}분 뒤 다시 시도해 주세요.`);
    }
  } catch (e) {
    if (e instanceof HttpError) throw e;
    // 테이블 없음 / 일시 오류 → 통과 (보안 < 가용성).
    // v00.262.003 — J2 silent 였던 path. brute-force 보호가 silent 비활성화되는 사고
    // 감지 위해 WARN. 운영자가 logs 에서 빈번하면 D1 상태 확인 가능.
    try { console.warn('[checkRateLimit] degraded — brute-force guard skipped:', e?.message || e); } catch {}
  }
};

const recordAttempt = async (env, email, ip, success) => {
  try {
    await env.DB.prepare(
      `INSERT INTO login_attempts (email, ip, ok, attempted_at) VALUES (?, ?, ?, ?)`
    ).bind(String(email || '').toLowerCase(), String(ip || ''), success ? 1 : 0, Date.now()).run();
    // GC — 24h 이전 행 삭제 (확률적 1/10 호출).
    if (Math.random() < 0.1) {
      await env.DB.prepare(
        `DELETE FROM login_attempts WHERE attempted_at < ?`
      ).bind(Date.now() - RATE_GC_MS).run();
    }
  } catch {
    // 테이블 없음 시 무시.
  }
};

// ──────── 핸들러 ──────────────────────────────────────────

const handleAuthSignup = async (req, env) => {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim();
  const password = String(body.password || "");
  const ip = clientIp(req);
  // v00.113 — IP 단위 가입 spam 방어. login_attempts 공유 카운터로 합산.
  await checkRateLimit(env, email, ip);
  if (!isEmail(email)) {
    await recordAttempt(env, email, ip, false);
    throw new HttpError(400, "올바른 이메일을 입력해 주세요.");
  }
  if (name.length < 1) {
    await recordAttempt(env, email, ip, false);
    throw new HttpError(400, "이름을 입력해 주세요.");
  }
  if (password.length < 6) {
    await recordAttempt(env, email, ip, false);
    throw new HttpError(400, "비밀번호는 6자 이상이어야 합니다.");
  }

  const exists = await env.DB.prepare("SELECT 1 FROM users WHERE email = ?").bind(email).first();
  if (exists) {
    await recordAttempt(env, email, ip, false);
    throw new HttpError(409, "이미 가입된 이메일입니다.");
  }

  const { hash, salt } = await hashPassword(password);
  const id = randomId("u");
  // 부트스트랩 admin: 환경변수에 지정된 이메일이면 자동 관리자 권한 부여.
  // 추가 안전 장치: 시스템에 이미 admin이 한 명 이상 있으면 부트스트랩 비활성화 (탈취 방지).
  const bootstrapEmail = String(env.ADMIN_BOOTSTRAP_EMAIL || "").trim().toLowerCase();
  let isAdmin = 0;
  if (bootstrapEmail && email === bootstrapEmail) {
    const adminCountRow = await env.DB.prepare("SELECT COUNT(*) AS c FROM users WHERE is_admin = 1").first();
    if (!adminCountRow || Number(adminCountRow.c || 0) === 0) {
      isAdmin = 1;
    }
  }
  // 슈퍼 관리자 이메일은 가입 시점부터 항상 admin (기존 admin 유무와 무관).
  if (isSuperAdminEmail(email, env)) {
    isAdmin = 1;
  }
  const gradeId = isAdmin ? "admin" : "member";
  // 프로필(생년월일/전화/주소/관심분야 등)도 가입 시점에 함께 저장.
  const profile = body.profile && typeof body.profile === 'object' ? body.profile : null;
  await env.DB.prepare(
    `INSERT INTO users (id, email, name, password_hash, password_salt, is_admin, grade_id, profile_json, consents_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, email, name, hash, salt, isAdmin, gradeId, profile ? JSON.stringify(profile) : null, JSON.stringify(body.consents || {}), nowIso()).run();
  await recordAttempt(env, email, ip, true);
  // v00.189 — signup audit log. 사용자 보고 '회원가입이든 모든 기록이 로그로 남게'.
  await auditWrite(env, email, "user.signup", `user:${id}`, { name, isAdmin: !!isAdmin, gradeId });

  const token = newSessionToken();
  const ttl = Number(env.SESSION_TTL_SECONDS || 2592000);
  await env.DB.prepare(
    `INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`
  ).bind(token, id, Date.now() + ttl * 1000, nowIso()).run();

  return { token, ttl, user: { id, email, name, isAdmin: !!isAdmin, gradeId } };
};

const handleAuthLogin = async (req, env) => {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const ip = clientIp(req);
  // v00.113 — brute-force 방어. throttle 시 즉시 429.
  await checkRateLimit(env, email, ip);
  // v00.262.004 — F2 suspended 컬럼 없는 v1 스키마 환경에서도 로그인 가능하도록 폴백.
  let row;
  try {
    row = await env.DB.prepare(
      "SELECT id, email, name, password_hash, password_salt, is_admin, grade_id, suspended, suspended_reason FROM users WHERE email = ?"
    ).bind(email).first();
  } catch (e) {
    try { console.warn('[handleAuthLogin] suspended-cols fallback', e?.message || e); } catch {}
    row = await env.DB.prepare(
      "SELECT id, email, name, password_hash, password_salt, is_admin, grade_id FROM users WHERE email = ?"
    ).bind(email).first();
  }
  if (!row) {
    await recordAttempt(env, email, ip, false);
    throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  const ok = await verifyPassword(password, row.password_hash, row.password_salt);
  if (!ok) {
    await recordAttempt(env, email, ip, false);
    throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  if (row.suspended) {
    await recordAttempt(env, email, ip, false);
    throw new HttpError(403, `정지된 계정입니다.${row.suspended_reason ? ' 사유: ' + row.suspended_reason : ''}`);
  }
  await recordAttempt(env, email, ip, true);

  // 슈퍼 관리자 자동 승격
  let isAdmin = !!row.is_admin;
  let gradeId = row.grade_id;
  if (isSuperAdminEmail(row.email, env)) {
    await ensureSuperAdmin(env, row.id, row.email);
    isAdmin = true;
    gradeId = 'admin';
  }

  const token = newSessionToken();
  const ttl = Number(env.SESSION_TTL_SECONDS || 2592000);
  await env.DB.prepare(
    `INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`
  ).bind(token, row.id, Date.now() + ttl * 1000, nowIso()).run();
  // v00.261 — 로그인 성공 시 last_login_at 갱신. 관리자 회원 탭 노출용.
  // 처방침에 '접속 기록(마지막 접속일시)' 수집 명시 (data.js 기본 텍스트).
  // v00.262.006 — schema-v10 미적용 환경에서 매 로그인마다 UPDATE 실패 + catch 빈도 ↑.
  // 모듈 캐시(__lastLoginColMissing) 로 skip.
  if (!__lastLoginColMissing) {
    try {
      await env.DB.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`)
        .bind(nowIso(), row.id).run();
    } catch (e) {
      __lastLoginColMissing = true;
      try { console.warn('[handleAuthLogin] last_login_at column missing — disabling UPDATEs', e?.message || e); } catch {}
    }
  }

  return { token, ttl, user: { id: row.id, email: row.email, name: row.name, isAdmin, gradeId } };
};

const handleAuthLogout = async (req, env) => {
  const token = readSessionToken(req);
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  return { ok: true };
};

const handleAuthMe = async (req, env) => {
  const user = await getCurrentUser(req, env);
  return { user };
};

const handlePostsList = async (req, env) => {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const q = (url.searchParams.get("q") || "").trim();
  // v00.201 — 본문 검색 옵션 (P1 #4). includeBody=1 이면 body LIKE 도 OR 결합.
  const includeBody = url.searchParams.get("includeBody") === "1";
  // v00.279 — 기본 50/캡 200 이면 클라가 limit 미지정 시 최신 50개만 와서 옛 글이 사라진 것처럼 보임.
  // 기본 1000 / 캡 2000 으로 상향 (목록 전량 로드 + 페이지네이션은 클라에서).
  const limit = Math.min(Number(url.searchParams.get("limit") || 1000), 2000);
  const args = [];
  let where = "1=1";
  if (category) { where += " AND category_id = ?"; args.push(category); }
  if (q) {
    if (includeBody) {
      where += " AND (title LIKE ? OR author LIKE ? OR body LIKE ?)";
      args.push(`%${q}%`, `%${q}%`, `%${q}%`);
    } else {
      where += " AND (title LIKE ? OR author LIKE ?)";
      args.push(`%${q}%`, `%${q}%`);
    }
  }
  // v00.170 — body 컬럼 포함. 사용자 보고: '글 작성 후 본문 사라짐'. 클라이언트가 list 캐시에서 detail 을 읽어 본문이 빈 상태로 표시되던 버그.
  const sql = `SELECT id, category_id, category, prefix, title, body, author_id, author, views, replies, created_at FROM posts WHERE ${where} ORDER BY created_at DESC LIMIT ?`;
  const { results } = await env.DB.prepare(sql).bind(...args, limit).all();
  // v00.141 — allow_read 가 명시 0 인 카테고리의 글은 비관리자에 숨김.
  let isAdmin = false;
  // v00.262.003 — C2 transient D1 에러로 admin 권한 silent 강등 사고 방지. 가시화.
  try { const me = await getCurrentUser(req, env); isAdmin = !!me?.isAdmin; } catch (e) { try { console.warn("[auth-soft]", e?.message || e); } catch {} }
  if (isAdmin) return { posts: results };
  const { results: blocked } = await env.DB.prepare(
    "SELECT id FROM categories_kv WHERE allow_read IS NOT NULL AND allow_read = 0"
  ).all().catch(() => ({ results: [] }));
  if (!blocked || !blocked.length) return { posts: results };
  const blockedSet = new Set(blocked.map((c) => c.id));
  return { posts: (results || []).filter((p) => !blockedSet.has(p.category_id)) };
};

const handlePostsCreate = async (req, env) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const categoryId = String(body.categoryId || "free");
  const title = String(body.title || "").trim();
  const text = String(body.body || "");
  if (!title) throw new HttpError(400, "제목을 입력해 주세요.");
  // v00.146 — 공지 게시판은 어떠한 경우에도 관리자만 작성. allow_write 체크박스 / postMinLevel 설정과 무관.
  if (categoryId === 'notice' && !user.isAdmin) {
    throw new HttpError(403, "공지 게시판은 관리자만 작성할 수 있습니다.");
  }
  // v00.111 — 게시판 작성 권한 (등급 게이트). v00.141 — allow_write 마스터 스위치 추가.
  const cat = await env.DB.prepare(
    "SELECT * FROM categories_kv WHERE id = ?"
  ).bind(categoryId).first();
  // v00.141 — allow_write 가 명시 0 이면 차단 (NULL/undefined 는 legacy 호환 → 허용).
  if (!user.isAdmin && cat && cat.allow_write !== undefined && cat.allow_write !== null && Number(cat.allow_write) === 0) {
    throw new HttpError(403, "이 게시판은 현재 글쓰기가 비활성화되어 있습니다.");
  }
  const minLevel = Number(cat?.post_min_level || 0);
  if (!user.isAdmin && minLevel > 0) {
    const grade = await env.DB.prepare(
      "SELECT level FROM grades_kv WHERE id = ?"
    ).bind(user.gradeId || 'member').first();
    const userLevel = Number(grade?.level || 0);
    if (userLevel < minLevel) {
      throw new HttpError(403, `이 게시판은 레벨 ${minLevel} 이상만 작성할 수 있습니다. (현재 레벨 ${userLevel})`);
    }
  }
  const createdAt = resolveCreatedAt(user, body);
  const r = await env.DB.prepare(
    `INSERT INTO posts (category_id, category, prefix, title, body, author_id, author, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(categoryId, cat?.label || categoryId, body.prefix || null, title, text, user.id, user.name, createdAt).run();
  return { id: r.meta.last_row_id };
};

const handlePostGet = async (req, env, id) => {
  const post = await env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
  if (!post) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  // v00.141 — allow_read 가 명시 0 이면 비관리자 차단.
  let isAdmin = false;
  // v00.262.003 — C2 transient D1 에러로 admin 권한 silent 강등 사고 방지. 가시화.
  try { const me = await getCurrentUser(req, env); isAdmin = !!me?.isAdmin; } catch (e) { try { console.warn("[auth-soft]", e?.message || e); } catch {} }
  if (!isAdmin && post.category_id) {
    const cat = await env.DB.prepare("SELECT allow_read FROM categories_kv WHERE id = ?").bind(post.category_id).first();
    if (cat && cat.allow_read !== undefined && cat.allow_read !== null && Number(cat.allow_read) === 0) {
      throw new HttpError(403, "이 게시판은 현재 읽기가 비활성화되어 있습니다.");
    }
  }
  // v00.278 — 조회수 증가는 POST /api/posts/:id/view(세션 dedup) 전담. GET 상세의 중복 증가 제거(이중 카운트 방지).
  return { post };
};

const handlePostPatch = async (req, env, id) => {
  const user = await requireUser(req, env);
  const post = await env.DB.prepare("SELECT author_id FROM posts WHERE id = ?").bind(id).first();
  if (!post) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  if (post.author_id !== user.id && !user.isAdmin) throw new HttpError(403, "본인의 글만 수정할 수 있습니다.");
  const body = await req.json().catch(() => ({}));
  const fields = [];
  const args = [];
  for (const k of ["title", "body", "prefix", "category_id"]) {
    if (k in body) { fields.push(`${k} = ?`); args.push(body[k]); }
  }
  // v00.115 — admin 만 created_at 수정 가능.
  if (user.isAdmin && body.createdAt) {
    fields.push("created_at = ?"); args.push(resolveCreatedAt(user, body));
  }
  if (!fields.length) return { ok: true };
  args.push(nowIso(), id);
  await env.DB.prepare(`UPDATE posts SET ${fields.join(", ")}, updated_at = ? WHERE id = ?`).bind(...args).run();
  return { ok: true };
};

const handlePostDelete = async (req, env, id) => {
  const user = await requireUser(req, env);
  const post = await env.DB.prepare("SELECT author_id FROM posts WHERE id = ?").bind(id).first();
  if (!post) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  if (post.author_id !== user.id && !user.isAdmin) throw new HttpError(403, "본인의 글만 삭제할 수 있습니다.");
  await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  return { ok: true };
};

const handleCommentsList = async (req, env, postId) => {
  // v00.141 — 댓글 보기 권한 (allow_comment_read). 게시글의 카테고리 → categories_kv 조회.
  // 명시 0 이면 비관리자에 빈 배열. NULL/undefined 는 legacy 호환 → 노출.
  let isAdmin = false;
  // v00.262.003 — C2 transient D1 에러로 admin 권한 silent 강등 사고 방지. 가시화.
  try { const me = await getCurrentUser(req, env); isAdmin = !!me?.isAdmin; } catch (e) { try { console.warn("[auth-soft]", e?.message || e); } catch {} }
  if (!isAdmin) {
    const post = await env.DB.prepare("SELECT category_id FROM posts WHERE id = ?").bind(postId).first();
    if (post?.category_id) {
      const cat = await env.DB.prepare("SELECT allow_comment_read FROM categories_kv WHERE id = ?").bind(post.category_id).first();
      if (cat && cat.allow_comment_read !== undefined && cat.allow_comment_read !== null && Number(cat.allow_comment_read) === 0) {
        return { comments: [], blocked: true };
      }
    }
  }
  const { results } = await env.DB.prepare(
    "SELECT id, post_id, parent_id, body, author_id, author, created_at FROM comments WHERE post_id = ? ORDER BY created_at ASC"
  ).bind(postId).all();
  return { comments: results };
};

const handleCommentsCreate = async (req, env, postId) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const text = String(body.body || "").trim();
  if (!text) throw new HttpError(400, "내용을 입력해 주세요.");
  // v00.141 — 댓글 작성 권한 (allow_comment_write).
  if (!user.isAdmin) {
    const post = await env.DB.prepare("SELECT category_id FROM posts WHERE id = ?").bind(postId).first();
    if (post?.category_id) {
      const cat = await env.DB.prepare("SELECT allow_comment_write FROM categories_kv WHERE id = ?").bind(post.category_id).first();
      if (cat && cat.allow_comment_write !== undefined && cat.allow_comment_write !== null && Number(cat.allow_comment_write) === 0) {
        throw new HttpError(403, "이 게시판은 현재 댓글 작성이 비활성화되어 있습니다.");
      }
    }
  }
  const r = await env.DB.prepare(
    "INSERT INTO comments (post_id, parent_id, body, author_id, author, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(postId, body.parentId || null, text, user.id, user.name, nowIso()).run();
  await env.DB.prepare("UPDATE posts SET replies = replies + 1 WHERE id = ?").bind(postId).run();
  // 알림 자동 발급 — 게시글 작성자에게 (본인 댓글은 제외).
  try {
    const post = await env.DB.prepare("SELECT author_id, title FROM posts WHERE id = ?").bind(postId).first();
    if (post?.author_id && post.author_id !== user.id) {
      await insertNotification(env, {
        userId: post.author_id, type: 'comment',
        message: '내 글에 새 댓글이 달렸습니다.',
        fromName: user.name, postId, postTitle: post.title,
      });
    }
    // 답글이면 부모 댓글 작성자에게도.
    if (body.parentId) {
      const parent = await env.DB.prepare("SELECT author_id FROM comments WHERE id = ?").bind(body.parentId).first();
      if (parent?.author_id && parent.author_id !== user.id && parent.author_id !== post?.author_id) {
        await insertNotification(env, {
          userId: parent.author_id, type: 'reply',
          message: '내 댓글에 답글이 달렸습니다.',
          fromName: user.name, postId, postTitle: post?.title || '',
        });
      }
    }
  } catch {}
  return { id: r.meta.last_row_id };
};

const handleBooksList = async (req, env) => {
  // v00.132 — admin 호출(쿠키 검증) 시 ?includeAll=1 으로 draft 포함 전체 반환.
  // 사용자 보고 '책 생성 실패: 서버 응답 없음' — admin 이 draft 새 책 만든 직후
  // public list endpoint 가 draft 를 빼고 반환 → 클라가 새 책 못 찾아 throw.
  const url = new URL(req.url);
  const includeAll = url.searchParams.get('includeAll') === '1';
  let allowAll = false;
  if (includeAll) {
    try {
      const me = await getCurrentUser(req, env);
      if (me?.isAdmin) allowAll = true;
    } catch {}
  }
  const sql = allowAll
    ? "SELECT * FROM books ORDER BY sort_order ASC, created_at DESC"
    : "SELECT * FROM books WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC";
  const { results } = await env.DB.prepare(sql).all();
  return { books: results.map((b) => ({ ...b, chapters: b.chapters_json ? JSON.parse(b.chapters_json) : [] })) };
};

const handleBookGet = async (req, env, id) => {
  const book = await env.DB.prepare("SELECT * FROM books WHERE id = ?").bind(id).first();
  if (!book) throw new HttpError(404, "책을 찾을 수 없습니다.");
  const { results: reviews } = await env.DB.prepare(
    "SELECT id, user_name, rating, text, created_at FROM book_reviews WHERE book_id = ? ORDER BY created_at DESC"
  ).bind(id).all();
  return { book: { ...book, chapters: book.chapters_json ? JSON.parse(book.chapters_json) : [] }, reviews };
};

const handleBookCreate = async (req, env) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const id = body.id || randomId("book");
  await env.DB.prepare(
    `INSERT INTO books (id, slug, title, subtitle, author, publisher, pages, isbn, price_kr, price_en, description, intro, chapters_json, author_bio, cover_key, pdf_key, status, published_at, is_primary, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.slug || id, body.title || "제목 없음", body.subtitle || "",
    body.author || "뱅기노자", body.publisher || "", Number(body.pages || 0), body.isbn || "",
    Number(body.priceKR || 0), Number(body.priceEN || 0),
    body.description || "", body.intro || "",
    JSON.stringify(body.chapters || []), body.authorBio || "",
    body.coverKey || "", body.pdfKey || "",
    body.status || "published", body.publishedAt || nowIso().slice(0, 10),
    body.isPrimary ? 1 : 0, Number(body.sortOrder || 0), nowIso(),
  ).run();
  return { id };
};

const handleBookPatch = async (req, env, id) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const fieldMap = {
    title: "title", subtitle: "subtitle", author: "author", publisher: "publisher",
    pages: "pages", isbn: "isbn", priceKR: "price_kr", priceEN: "price_en",
    description: "description", intro: "intro", authorBio: "author_bio",
    coverKey: "cover_key", pdfKey: "pdf_key", status: "status",
    publishedAt: "published_at", isPrimary: "is_primary", sortOrder: "sort_order",
  };
  const fields = [];
  const args = [];
  for (const [k, col] of Object.entries(fieldMap)) {
    if (k in body) { fields.push(`${col} = ?`); args.push(body[k]); }
  }
  if ("chapters" in body) { fields.push("chapters_json = ?"); args.push(JSON.stringify(body.chapters || [])); }
  if (!fields.length) return { ok: true };
  args.push(nowIso(), id);
  await env.DB.prepare(`UPDATE books SET ${fields.join(", ")}, updated_at = ? WHERE id = ?`).bind(...args).run();
  return { ok: true };
};

const handleBookDelete = async (req, env, id) => {
  await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM books WHERE id = ?").bind(id).run();
  return { ok: true };
};

// v00.109 — R2 업로드 보안 강화.
// ① 권한: 폴더별 분기. admin-only 폴더 (og/branding/auth/recommendations/...) vs 사용자 허용 폴더 (post-*/lecture-*/tour-*).
// ② 파일 타입: 확장자 화이트리스트 (executable / script 차단).
// ③ 크기 제한: 50MB hard cap (Workers 본체 메모리 한도 고려).
// ④ 폴더 sanitize: 영숫자 + - + / 만 허용 (path traversal 차단).
const ALLOWED_UPLOAD_EXTS = new Set([
  // 이미지
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif',
  // 문서 / 첨부
  'pdf', 'txt', 'csv', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'hwp', 'hwpx',
  // 미디어
  'mp4', 'webm', 'mp3', 'wav', 'm4a',
  // 압축
  'zip',
]);
const USER_ALLOWED_FOLDERS = new Set([
  'post-images', 'post-attachments',
  'lecture-covers', 'tour-covers',
]); // 일반 로그인 회원도 업로드 가능. 그 외 폴더는 admin only.
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB

const handleMediaUpload = async (req, env) => {
  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function") throw new HttpError(400, "파일을 첨부해 주세요.");
  // 폴더 sanitize — 알파벳/숫자/하이픈/언더스코어/슬래시만 허용. path traversal 차단.
  const folder = (form.get("folder") || "uploads").toString().replace(/[^a-z0-9_/-]/gi, "").slice(0, 64) || "uploads";
  // 권한 — 폴더별 분기.
  if (USER_ALLOWED_FOLDERS.has(folder)) {
    await requireUser(req, env);
  } else {
    await requireAdmin(req, env);
  }
  // 크기 제한.
  if (typeof file.size === 'number' && file.size > MAX_UPLOAD_BYTES) {
    throw new HttpError(413, `파일이 너무 큽니다 (최대 ${(MAX_UPLOAD_BYTES / 1024 / 1024).toFixed(0)}MB).`);
  }
  // 확장자 화이트리스트.
  const fileName = String(file.name || '');
  const extRaw = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';
  if (!ALLOWED_UPLOAD_EXTS.has(extRaw)) {
    throw new HttpError(400, `지원하지 않는 파일 형식입니다 (.${extRaw || '?'}).`);
  }
  const ext = extRaw;
  const key = `${folder}/${randomId()}.${ext}`;
  // 추가 방어: SVG 는 XSS 위험 (script 포함 가능) → contentType 강제 image/svg+xml + 사용자 폴더에선 거부 옵션.
  // 본 사이클은 일단 허용. 다음 사이클에 SVG 본문 sanitize 추가 검토.
  await env.MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  const baseUrl = new URL(req.url).origin;
  return { key, url: `${baseUrl}/api/media/${key}` };
};

const handleMediaGet = async (req, env, key) => {
  const obj = await env.MEDIA.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=86400");
  headers.set("ETag", obj.httpEtag);
  return new Response(obj.body, { headers });
};

// ──────── Page-view 분석 (v00.148) ────────────────────────────────
// schema-v9.page_views — 익명 방문 측정 (referrer / route / session).
// 정책: ① 인증 불요 (익명) ② IP hash 만 저장 ③ 30일 retention ④ referrer host 만.

const PAGE_VIEWS_RETENTION_MS = 30 * 24 * 3600 * 1000;

// SHA-256 으로 IP 익명화 (개인정보 최소화).
const _hashIp = async (ip) => {
  if (!ip) return null;
  try {
    const buf = new TextEncoder().encode(ip + ':bgnj-salt');
    const h = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(h)).slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch { return null; }
};

// referrer URL → host (개인정보 + URL 길이 줄임). bgnj.net 자체는 'self' 로.
const _refHost = (ref, currentOrigin) => {
  if (!ref) return null;
  try {
    const u = new URL(ref);
    if (currentOrigin && u.origin === currentOrigin) return 'self';
    return u.host;
  } catch { return null; }
};

const handlePageViewTrack = async (req, env) => {
  const body = await req.json().catch(() => ({}));
  const route = String(body.route || 'unknown').slice(0, 80);
  const sessionId = String(body.sessionId || '').slice(0, 64) || null;
  const userId = String(body.userId || '').slice(0, 64) || null;
  const ua = (req.headers.get('user-agent') || '').slice(0, 200);
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '';
  const ipHash = await _hashIp(ip);
  const ref = _refHost(body.referrer || req.headers.get('referer') || '', new URL(req.url).origin);
  try {
    await env.DB.prepare(
      `INSERT INTO page_views (route, ts, session_id, user_id, referrer_host, user_agent, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(route, nowIso(), sessionId, userId, ref, ua, ipHash).run();
  } catch (err) {
    // schema-v9 미적용 환경 — silent fail (분석 누락이지 사용자 영향 없음).
    return { ok: false, note: 'schema-v9 not applied' };
  }
  // GC: 1/100 확률로 30일 이전 row 삭제.
  if (Math.random() < 0.01) {
    try {
      const cutoff = new Date(Date.now() - PAGE_VIEWS_RETENTION_MS).toISOString();
      await env.DB.prepare("DELETE FROM page_views WHERE ts < ?").bind(cutoff).run();
    } catch {}
  }
  return { ok: true };
};

const handleAnalyticsSummary = async (req, env) => {
  await requireAdmin(req, env);
  const dayMs = 86400 * 1000;
  const now = Date.now();
  const isoCutoff = (days) => new Date(now - days * dayMs).toISOString();
  // v00.173 — ?days param 으로 dailySeries 기간 가변. 1/7/14/30/90 모두 허용. 기본 14.
  // v00.176 — days=1 이면 hourlySeries (24시간 1시간 단위) 추가 응답.
  const url = new URL(req.url);
  const seriesDays = Math.max(1, Math.min(90, Number(url.searchParams.get('days') || 14)));
  // 일/주/월 page-view 수.
  let summary = { day: 0, week: 0, month: 0, dayUnique: 0, weekUnique: 0, monthUnique: 0, dailySeries: [], hourlySeries: [], seriesDays, referrers: [], topRoutes: [] };
  try {
    const day1 = await env.DB.prepare("SELECT COUNT(*) AS c, COUNT(DISTINCT session_id) AS u FROM page_views WHERE ts >= ?").bind(isoCutoff(1)).first();
    const day7 = await env.DB.prepare("SELECT COUNT(*) AS c, COUNT(DISTINCT session_id) AS u FROM page_views WHERE ts >= ?").bind(isoCutoff(7)).first();
    const day30 = await env.DB.prepare("SELECT COUNT(*) AS c, COUNT(DISTINCT session_id) AS u FROM page_views WHERE ts >= ?").bind(isoCutoff(30)).first();
    summary.day = Number(day1?.c || 0); summary.dayUnique = Number(day1?.u || 0);
    summary.week = Number(day7?.c || 0); summary.weekUnique = Number(day7?.u || 0);
    summary.month = Number(day30?.c || 0); summary.monthUnique = Number(day30?.u || 0);
    // v00.173 — seriesDays 길이의 일별 시리즈.
    const series = await env.DB.prepare(
      "SELECT substr(ts, 1, 10) AS day, COUNT(*) AS views, COUNT(DISTINCT session_id) AS uniq FROM page_views WHERE ts >= ? GROUP BY day ORDER BY day ASC"
    ).bind(isoCutoff(seriesDays)).all();
    summary.dailySeries = (series.results || []).map((r) => ({ day: r.day, views: Number(r.views), uniq: Number(r.uniq) }));
    // v00.176 — days=1 이면 hourlySeries 도 함께 (최근 24시간 1시간 단위).
    if (seriesDays === 1) {
      const hourly = await env.DB.prepare(
        "SELECT substr(ts, 1, 13) AS hour, COUNT(*) AS views, COUNT(DISTINCT session_id) AS uniq FROM page_views WHERE ts >= ? GROUP BY hour ORDER BY hour ASC"
      ).bind(new Date(now - 24 * 3600 * 1000).toISOString()).all();
      summary.hourlySeries = (hourly.results || []).map((r) => ({ hour: r.hour, views: Number(r.views), uniq: Number(r.uniq) }));
    }
    // v00.179 — refDays / routeDays 별도 코호트. 미지정 시 30/7 기본.
    const refDays = Math.max(1, Math.min(90, Number(url.searchParams.get('refDays') || 30)));
    const routeDays = Math.max(1, Math.min(90, Number(url.searchParams.get('routeDays') || 7)));
    summary.refDays = refDays;
    summary.routeDays = routeDays;
    // referrer 분포.
    const refs = await env.DB.prepare(
      "SELECT COALESCE(referrer_host, '직접 방문') AS host, COUNT(*) AS c FROM page_views WHERE ts >= ? GROUP BY host ORDER BY c DESC LIMIT 10"
    ).bind(isoCutoff(refDays)).all();
    summary.referrers = (refs.results || []).map((r) => ({ host: r.host, count: Number(r.c) }));
    // top routes.
    const routes = await env.DB.prepare(
      "SELECT route, COUNT(*) AS c FROM page_views WHERE ts >= ? GROUP BY route ORDER BY c DESC LIMIT 10"
    ).bind(isoCutoff(routeDays)).all();
    summary.topRoutes = (routes.results || []).map((r) => ({ route: r.route, count: Number(r.c) }));
    // v00.174 — flowPairs: 사용자 여정 Sankey 차트용 referrer→route 쌍 집계 (seriesDays 기간).
    const pairs = await env.DB.prepare(
      "SELECT COALESCE(referrer_host, '직접 방문') AS host, route, COUNT(*) AS c FROM page_views WHERE ts >= ? GROUP BY host, route ORDER BY c DESC LIMIT 200"
    ).bind(isoCutoff(seriesDays)).all();
    summary.flowPairs = (pairs.results || []).map((p) => ({ referrer: p.host, route: p.route, count: Number(p.c) }));
    // v00.194 — 사용자 요청 '대시보드에 접속 시간에 따른 히트맵'.
    // 24h × 7요일 그리드. ts 는 UTC ISO 이지만 KST(+9) 기준으로 보여주기 위해 +9h 시프트 후 strftime.
    // SQLite: strftime('%w', datetime(ts, '+9 hours')) 으로 KST 요일 (0=일~6=토), '%H' 로 KST 시간(00~23).
    const heatmapDays = Math.max(7, Math.min(90, Number(url.searchParams.get('heatmapDays') || 30)));
    const heatmap = await env.DB.prepare(
      "SELECT CAST(strftime('%w', datetime(ts, '+9 hours')) AS INTEGER) AS dow, CAST(strftime('%H', datetime(ts, '+9 hours')) AS INTEGER) AS hour, COUNT(*) AS views, COUNT(DISTINCT session_id) AS uniq FROM page_views WHERE ts >= ? GROUP BY dow, hour"
    ).bind(isoCutoff(heatmapDays)).all();
    summary.heatmap = (heatmap.results || []).map((r) => ({
      dow: Number(r.dow), hour: Number(r.hour),
      views: Number(r.views), uniq: Number(r.uniq),
    }));
    summary.heatmapDays = heatmapDays;
  } catch (err) {
    return { ...summary, error: 'schema-v9 not applied or query failed', detail: err?.message || '' };
  }
  return summary;
};

// === 사용자 여정 (v00.148) — 한 회원의 가입/게시글/댓글/신청/주문/로그인 통합 타임라인.
const handleUserJourney = async (req, env, userId) => {
  await requireAdmin(req, env);
  const events = [];
  const safe = async (sql, args = []) => {
    try { const r = await env.DB.prepare(sql).bind(...args).all(); return r.results || []; }
    catch { return []; }
  };
  // 가입.
  const userRow = await env.DB.prepare("SELECT id, email, name, created_at, grade_id, is_admin FROM users WHERE id = ?").bind(userId).first();
  if (!userRow) throw new HttpError(404, "회원을 찾을 수 없습니다.");
  events.push({ kind: 'signup', ts: userRow.created_at, label: '회원 가입', detail: `${userRow.email} · ${userRow.grade_id || 'member'} 등급` });
  // 게시글.
  const posts = await safe("SELECT id, title, category, created_at FROM posts WHERE author_id = ? ORDER BY created_at DESC LIMIT 100", [userId]);
  posts.forEach((p) => events.push({ kind: 'post', ts: p.created_at, label: '게시글 작성', detail: `[${p.category}] ${p.title}`, target: `post:${p.id}` }));
  // 댓글.
  const comments = await safe("SELECT id, post_id, body, created_at FROM comments WHERE author_id = ? ORDER BY created_at DESC LIMIT 200", [userId]);
  comments.forEach((c) => events.push({ kind: 'comment', ts: c.created_at, label: '댓글 작성', detail: String(c.body || '').slice(0, 60), target: `post:${c.post_id}` }));
  // 강연 신청.
  const lectureRegs = await safe(
    "SELECT lr.id, lr.lecture_id, lr.status, lr.created_at, l.title FROM lecture_registrations lr LEFT JOIN lectures l ON l.id = lr.lecture_id WHERE lr.user_id = ? ORDER BY lr.created_at DESC LIMIT 100", [userId]);
  lectureRegs.forEach((r) => events.push({ kind: 'lecture_register', ts: r.created_at, label: '강연 신청', detail: `${r.title || '(제목 없음)'} · ${r.status}`, target: `lecture:${r.lecture_id}` }));
  // 투어 예약.
  const tourRes = await safe(
    "SELECT tr.id, tr.tour_id, tr.status, tr.created_at, t.title FROM tour_reservations tr LEFT JOIN tours t ON t.id = tr.tour_id WHERE tr.user_id = ? ORDER BY tr.created_at DESC LIMIT 100", [userId]);
  tourRes.forEach((r) => events.push({ kind: 'tour_reserve', ts: r.created_at, label: '투어 예약', detail: `${r.title || '(제목 없음)'} · ${r.status}`, target: `tour:${r.tour_id}` }));
  // 책 주문.
  const orders = await safe(
    "SELECT id, book_id, status, qty, total, created_at FROM book_orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100", [userId]);
  orders.forEach((o) => events.push({ kind: 'book_order', ts: o.created_at, label: '책 주문', detail: `수량 ${o.qty} · ${Number(o.total).toLocaleString()}원 · ${o.status}`, target: `order:${o.id}` }));
  // 정렬: 최근 위.
  events.sort((a, b) => (Date.parse(b.ts) || 0) - (Date.parse(a.ts) || 0));
  return { user: userRow, events };
};

// ──────── 감사 로그 ───────────────────────────────────────

// v00.120 — audit_log GC: 30일 이상 된 row 1/20 확률로 일괄 삭제. unbounded growth 방지.
const AUDIT_LOG_RETENTION_MS = 30 * 24 * 3600 * 1000;
const auditWrite = async (env, actor, action, target, details, ip) => {
  try {
    await env.DB.prepare(
      "INSERT INTO audit_log (actor, action, target, details_json, ip) VALUES (?, ?, ?, ?, ?)"
    ).bind(actor || null, action, target || null, details ? JSON.stringify(details) : null, ip || null).run();
    if (Math.random() < 0.05) {
      // ts 컬럼이 ISO 문자열 또는 epoch ms — 둘 다 호환되도록 datetime() 비교.
      try {
        const cutoff = new Date(Date.now() - AUDIT_LOG_RETENTION_MS).toISOString();
        await env.DB.prepare("DELETE FROM audit_log WHERE ts < ?").bind(cutoff).run();
      } catch {}
    }
  } catch {}
};

// ──────── 관리자: 회원 ─────────────────────────────────────

const handleAdminUsersList = async (req, env) => {
  await requireAdmin(req, env);
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const args = [];
  let where = "1=1";
  if (q) { where += " AND (email LIKE ? OR name LIKE ?)"; args.push(`%${q}%`, `%${q}%`); }
  // v00.261 — last_login_at 포함. schema-v10 미적용 환경에선 catch 로 폴백 (admin
   // 회원 탭에서 컬럼이 비어 보일 뿐 에러 X).
  const { results } = await env.DB.prepare(
    `SELECT id, email, name, is_admin, grade_id, suspended, suspended_reason, profile_json, consents_json, created_at, last_login_at FROM users WHERE ${where} ORDER BY created_at DESC LIMIT 500`
  ).bind(...args).all().catch(async () => {
    return await env.DB.prepare(
      `SELECT id, email, name, is_admin, grade_id, suspended, suspended_reason, profile_json, consents_json, created_at FROM users WHERE ${where} ORDER BY created_at DESC LIMIT 500`
    ).bind(...args).all().catch(async () => {
      // suspended 컬럼이 없을 수도(v1 스키마) — 조용히 폴백
      return await env.DB.prepare(
        `SELECT id, email, name, is_admin, grade_id, created_at FROM users WHERE ${where} ORDER BY created_at DESC LIMIT 500`
      ).bind(...args).all();
    });
  });
  return { users: results };
};

const handleAdminUserPatch = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const fields = [];
  const args = [];
  const action = [];
  if ("isAdmin" in body) { fields.push("is_admin = ?"); args.push(body.isAdmin ? 1 : 0); action.push(body.isAdmin ? "promote_admin" : "demote_admin"); }
  if ("gradeId" in body) { fields.push("grade_id = ?"); args.push(body.gradeId); action.push(`grade=${body.gradeId}`); }
  if ("suspended" in body) {
    fields.push("suspended = ?"); args.push(body.suspended ? 1 : 0);
    if (body.suspended) {
      fields.push("suspended_reason = ?"); args.push(body.suspendedReason || "");
      fields.push("suspended_at = ?"); args.push(nowIso());
      // 정지된 사용자의 기존 세션은 무효화.
      await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id).run();
    } else {
      fields.push("suspended_reason = ?"); args.push(null);
    }
    action.push(body.suspended ? "suspend" : "unsuspend");
  }
  if ("name" in body && typeof body.name === "string") { fields.push("name = ?"); args.push(body.name.trim()); }
  if (!fields.length) return { ok: true };
  args.push(id);
  await env.DB.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`).bind(...args).run();
  await auditWrite(env, admin.email, "admin.user_update", `user:${id}`, { changes: body });
  return { ok: true };
};

const handleAdminUserDelete = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  if (id === admin.id) throw new HttpError(400, "본인 계정은 삭제할 수 없습니다.");
  await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  await auditWrite(env, admin.email, "admin.user_delete", `user:${id}`);
  return { ok: true };
};

// 회원 metrics (v00.062) — D1 정확 계산. 클라이언트 BGNJ_GRADE_PROMO.metrics 가 prefer.
// 모든 카운트가 한 번의 round-trip 으로. 빈 결과는 0.
const handleAdminUserMetrics = async (req, env, userId) => {
  await requireAdmin(req, env);
  if (!userId) throw new HttpError(400, "userId required");
  // 사용자 자신의 글/댓글 수
  const postsRow = await env.DB.prepare("SELECT COUNT(*) AS c FROM posts WHERE author_id = ?").bind(userId).first();
  const commentsRow = await env.DB.prepare("SELECT COUNT(*) AS c FROM comments WHERE author_id = ?").bind(userId).first();
  // 받은 좋아요 — 본인 글에 들어온 post_likes 합 + 본인 칼럼의 likes_json 길이 합
  const likesPostsRow = await env.DB.prepare(
    "SELECT COUNT(*) AS c FROM post_likes WHERE post_id IN (SELECT id FROM posts WHERE author_id = ?)"
  ).bind(userId).first();
  let likesColumns = 0;
  try {
    const { results } = await env.DB.prepare("SELECT likes_json FROM user_columns WHERE author_id = ?").bind(userId).all();
    for (const r of (results || [])) {
      try { const arr = r.likes_json ? JSON.parse(r.likes_json) : []; if (Array.isArray(arr)) likesColumns += arr.length; } catch {}
    }
  } catch {} // user_columns 에 author_id 컬럼이 없을 수 있음 — 폴백 0
  // 본인 글에 들어온 신고 수
  const reportsRow = await env.DB.prepare(
    "SELECT COUNT(*) AS c FROM reports WHERE post_id IN (SELECT id FROM posts WHERE author_id = ?)"
  ).bind(userId).first();
  // 가입 경과 일수 — users.created_at 기준
  const userRow = await env.DB.prepare("SELECT created_at FROM users WHERE id = ?").bind(userId).first();
  let daysSinceSignup = 0;
  if (userRow?.created_at) {
    const ms = Date.now() - new Date(userRow.created_at).getTime();
    daysSinceSignup = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  }
  // v00.136 — 투어/강연 실 참여 횟수 (attended=1 만 카운트, 노쇼/미정 제외).
  let toursAttended = 0, lecturesAttended = 0;
  try {
    const r = await env.DB.prepare(
      "SELECT COUNT(*) AS c FROM tour_reservations WHERE user_id = ? AND attended = 1"
    ).bind(userId).first();
    toursAttended = Number(r?.c || 0);
  } catch {}
  try {
    const r = await env.DB.prepare(
      "SELECT COUNT(*) AS c FROM lecture_registrations WHERE user_id = ? AND attended = 1"
    ).bind(userId).first();
    lecturesAttended = Number(r?.c || 0);
  } catch {}
  return {
    userId,
    posts: Number(postsRow?.c || 0),
    comments: Number(commentsRow?.c || 0),
    likesReceived: Number(likesPostsRow?.c || 0) + likesColumns,
    reportCount: Number(reportsRow?.c || 0),
    daysSinceSignup,
    toursAttended,
    lecturesAttended,
    computedAt: nowIso(),
  };
};

const handleAdminAuditList = async (req, env) => {
  await requireAdmin(req, env);
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 200), 1000);
  const { results } = await env.DB.prepare(
    "SELECT id, ts, actor, action, target, details_json, ip FROM audit_log ORDER BY ts DESC LIMIT ?"
  ).bind(limit).all();
  return {
    log: results.map((e) => ({ ...e, details: e.details_json ? JSON.parse(e.details_json) : null })),
  };
};

// ──────── 강연 ────────────────────────────────────────────

const lectureRow = (l) => l && ({
  id: l.id, title: l.title, topic: l.topic, venue: l.venue, host: l.host,
  next: l.next, startsAt: l.starts_at, durationMinutes: l.duration_minutes,
  capacity: l.capacity, price: l.price, note: l.note, hidden: !!l.hidden,
  createdAt: l.created_at, updatedAt: l.updated_at,
});

const handleLecturesList = async (req, env) => {
  const url = new URL(req.url);
  const includeHidden = url.searchParams.get("includeHidden") === "1";
  const where = includeHidden ? "1=1" : "hidden = 0";
  const { results } = await env.DB.prepare(`SELECT * FROM lectures WHERE ${where} ORDER BY starts_at ASC`).all();
  return { lectures: results.map(lectureRow) };
};

const handleLectureGet = async (req, env, id) => {
  const l = await env.DB.prepare("SELECT * FROM lectures WHERE id = ?").bind(id).first();
  if (!l) throw new HttpError(404, "강연을 찾을 수 없습니다.");
  const { results: regs } = await env.DB.prepare(
    "SELECT id, user_id, user_name, status, attended, created_at FROM lecture_registrations WHERE lecture_id = ? ORDER BY created_at ASC"
  ).bind(id).all();
  return { lecture: lectureRow(l), registrations: regs };
};

const handleLectureCreate = async (req, env) => {
  const admin = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const id = body.id || randomId("lec");
  await env.DB.prepare(
    `INSERT INTO lectures (id, title, topic, venue, host, next, starts_at, duration_minutes, capacity, price, note, hidden)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.title || "새 강연", body.topic || "", body.venue || "", body.host || "뱅기노자",
    body.next || "", body.startsAt || null,
    Math.max(1, Number(body.durationMinutes) || 90),
    Math.max(1, Number(body.capacity) || 30),
    parsePrice(body),
    body.note || "", body.hidden ? 1 : 0,
  ).run();
  await auditWrite(env, admin.email, "lecture.create", `lecture:${id}`);
  return { id };
};

const handleLecturePatch = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const map = { title: "title", topic: "topic", venue: "venue", host: "host", next: "next",
    startsAt: "starts_at", durationMinutes: "duration_minutes", capacity: "capacity",
    note: "note", hidden: "hidden" };
  const fields = []; const args = [];
  for (const [k, col] of Object.entries(map)) {
    if (k in body) { fields.push(`${col} = ?`); args.push(k === "hidden" ? (body[k] ? 1 : 0) : body[k]); }
  }
  if ("price" in body || "priceNumber" in body) {
    fields.push("price = ?"); args.push(parsePrice(body));
  }
  if (!fields.length) return { ok: true };
  fields.push("updated_at = ?"); args.push(nowIso(), id);
  await env.DB.prepare(`UPDATE lectures SET ${fields.join(", ")} WHERE id = ?`).bind(...args).run();
  await auditWrite(env, admin.email, "lecture.update", `lecture:${id}`, body);
  return { ok: true };
};

const handleLectureDelete = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM lectures WHERE id = ?").bind(id).run();
  await auditWrite(env, admin.email, "lecture.remove", `lecture:${id}`);
  return { ok: true };
};

const handleLectureRegister = async (req, env, lectureId) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const lec = await env.DB.prepare("SELECT capacity, price FROM lectures WHERE id = ?").bind(lectureId).first();
  if (!lec) throw new HttpError(404, "강연을 찾을 수 없습니다.");
  const existRow = await env.DB.prepare(
    "SELECT id FROM lecture_registrations WHERE lecture_id = ? AND user_id = ? AND status != 'cancelled'"
  ).bind(lectureId, user.id).first();
  if (existRow) throw new HttpError(409, "이미 신청한 강연입니다.");
  const countRow = await env.DB.prepare(
    "SELECT COUNT(*) AS c FROM lecture_registrations WHERE lecture_id = ? AND status IN ('pending_payment','confirmed')"
  ).bind(lectureId).first();
  const active = Number(countRow?.c || 0);
  const status = active >= Number(lec.capacity || 0) ? "waitlist" : (Number(lec.price || 0) === 0 ? "confirmed" : "pending_payment");
  const regId = randomId("reg");
  await env.DB.prepare(
    `INSERT INTO lecture_registrations (id, lecture_id, user_id, user_name, user_email, user_phone, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(regId, lectureId, user.id, user.name, user.email, body.phone || null, status).run();
  return { id: regId, status };
};

// ──────── 투어 ────────────────────────────────────────────

const tourRow = (t) => t && ({
  id: t.id, title: t.title, desc: t.description, duration: t.duration,
  group: t.group_size, level: t.level, next: t.next, startsAt: t.starts_at,
  durationMinutes: t.duration_minutes, capacity: t.capacity, price: t.price,
  hidden: !!t.hidden, createdAt: t.created_at, updatedAt: t.updated_at,
  coverUrl: t.cover_url || "", // v00.081 — 투어 커버 이미지 (dataURI 또는 R2 URL)
  subtitle: t.subtitle || "", // v00.106 — 투어 부제 (별도 컬럼)
  refundPolicy: t.refund_policy || "", // v00.106 — 환불정책 (per-tour)
});

const handleToursList = async (req, env) => {
  const url = new URL(req.url);
  const includeHidden = url.searchParams.get("includeHidden") === "1";
  const where = includeHidden ? "1=1" : "hidden = 0";
  const { results } = await env.DB.prepare(`SELECT * FROM tours WHERE ${where} ORDER BY starts_at ASC`).all();
  return { tours: results.map(tourRow) };
};

const handleTourGet = async (req, env, id) => {
  const t = await env.DB.prepare("SELECT * FROM tours WHERE id = ?").bind(id).first();
  if (!t) throw new HttpError(404, "투어를 찾을 수 없습니다.");
  const { results: regs } = await env.DB.prepare(
    "SELECT id, user_id, user_name, qty, status, attended, created_at FROM tour_reservations WHERE tour_id = ? ORDER BY created_at ASC"
  ).bind(id).all();
  return { tour: tourRow(t), reservations: regs };
};

// 가격 필드 견고 파싱 — 클라이언트가 "80,000원" 같은 포맷팅 문자열을 보내도 안전하게 정수로 환산.
// priceNumber 우선, 없으면 price 에서 숫자만 추출. NaN/null 모두 0 으로 폴백.
const parsePrice = (body) => {
  const raw = body.priceNumber != null ? body.priceNumber : body.price;
  if (raw == null || raw === "") return 0;
  if (typeof raw === "number") return Number.isFinite(raw) ? Math.max(0, Math.trunc(raw)) : 0;
  const digits = String(raw).replace(/[^0-9]/g, "");
  const n = digits ? parseInt(digits, 10) : 0;
  return Number.isFinite(n) ? Math.max(0, n) : 0;
};

const handleTourCreate = async (req, env) => {
  const admin = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const id = body.id || randomId("tour");
  await env.DB.prepare(
    `INSERT INTO tours (id, title, description, duration, group_size, level, next, starts_at, duration_minutes, capacity, price, hidden, cover_url, subtitle, refund_policy)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.title || "새 투어", body.desc || "", body.duration || "",
    body.group || "", body.level || "", body.next || "", body.startsAt || null,
    Math.max(1, Number(body.durationMinutes) || 240),
    Math.max(1, Number(body.capacity) || 8),
    parsePrice(body),
    body.hidden ? 1 : 0,
    body.coverUrl || "", // v00.081
    body.subtitle || "", // v00.106
    body.refundPolicy || "", // v00.106
  ).run();
  await auditWrite(env, admin.email, "tour.create", `tour:${id}`);
  return { id };
};

const handleTourPatch = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const map = { title: "title", desc: "description", duration: "duration", group: "group_size",
    level: "level", next: "next", startsAt: "starts_at", durationMinutes: "duration_minutes",
    capacity: "capacity", hidden: "hidden", coverUrl: "cover_url" /* v00.081 */,
    subtitle: "subtitle", refundPolicy: "refund_policy" /* v00.106 */ };
  const fields = []; const args = [];
  for (const [k, col] of Object.entries(map)) {
    if (k in body) { fields.push(`${col} = ?`); args.push(k === "hidden" ? (body[k] ? 1 : 0) : body[k]); }
  }
  // price 필드는 별도 파싱 (포맷팅 문자열 안전 처리)
  if ("price" in body || "priceNumber" in body) {
    fields.push("price = ?"); args.push(parsePrice(body));
  }
  if (!fields.length) return { ok: true };
  fields.push("updated_at = ?"); args.push(nowIso(), id);
  await env.DB.prepare(`UPDATE tours SET ${fields.join(", ")} WHERE id = ?`).bind(...args).run();
  await auditWrite(env, admin.email, "tour.update", `tour:${id}`, body);
  return { ok: true };
};

const handleTourDelete = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM tours WHERE id = ?").bind(id).run();
  await auditWrite(env, admin.email, "tour.remove", `tour:${id}`);
  return { ok: true };
};

// ──────── 알림 / 좋아요 / 북마크 / 신고 ───────────────────

const handleNotificationsList = async (req, env) => {
  const user = await requireUser(req, env);
  const { results } = await env.DB.prepare(
    "SELECT id, type, message, from_name, post_id, post_title, lecture_id, tour_id, read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50"
  ).bind(user.id).all();
  return { notifications: results.map((n) => ({ ...n, read: !!n.read })) };
};

const handleNotificationsMarkRead = async (req, env, id) => {
  const user = await requireUser(req, env);
  if (id === "all") {
    await env.DB.prepare("UPDATE notifications SET read = 1 WHERE user_id = ?").bind(user.id).run();
  } else {
    await env.DB.prepare("UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?").bind(id, user.id).run();
  }
  return { ok: true };
};

const handleLikeToggle = async (req, env, postId) => {
  const user = await requireUser(req, env);
  const exists = await env.DB.prepare("SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?").bind(postId, user.id).first();
  if (exists) {
    await env.DB.prepare("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?").bind(postId, user.id).run();
  } else {
    await env.DB.prepare("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)").bind(postId, user.id).run();
  }
  // 토글 후 최신 user_id 배열을 한 번에 반환 — 클라이언트가 별도 GET 호출하지 않도록.
  const { results } = await env.DB.prepare("SELECT user_id FROM post_likes WHERE post_id = ?").bind(postId).all();
  const likes = (results || []).map((r) => r.user_id);
  return { liked: !exists, likes, count: likes.length };
};

const handleLikesList = async (req, env, postId) => {
  const { results } = await env.DB.prepare("SELECT user_id FROM post_likes WHERE post_id = ?").bind(postId).all();
  return { likes: results.map((r) => r.user_id), count: results.length };
};

const handleBookmarkToggle = async (req, env, postId) => {
  const user = await requireUser(req, env);
  const exists = await env.DB.prepare("SELECT 1 FROM bookmarks WHERE post_id = ? AND user_id = ?").bind(postId, user.id).first();
  if (exists) {
    await env.DB.prepare("DELETE FROM bookmarks WHERE post_id = ? AND user_id = ?").bind(postId, user.id).run();
    return { bookmarked: false };
  }
  await env.DB.prepare("INSERT INTO bookmarks (user_id, post_id) VALUES (?, ?)").bind(user.id, postId).run();
  return { bookmarked: true };
};

const handleBookmarksMine = async (req, env) => {
  const user = await requireUser(req, env);
  const { results } = await env.DB.prepare(
    `SELECT p.id, p.title, p.category, p.author, p.created_at
     FROM bookmarks b JOIN posts p ON p.id = b.post_id
     WHERE b.user_id = ? ORDER BY b.created_at DESC`
  ).bind(user.id).all();
  return { bookmarks: results };
};

const handleReportCreate = async (req, env) => {
  const user = await getCurrentUser(req, env);
  const body = await req.json().catch(() => ({}));
  const id = randomId("rpt");
  await env.DB.prepare(
    `INSERT INTO reports (id, post_id, post_title, reporter_id, reporter_name, reason, status)
     VALUES (?, ?, ?, ?, ?, ?, 'open')`
  ).bind(id, body.postId || null, body.postTitle || "", user?.id || null, user?.name || body.reporterName || "익명", body.reason || "").run();
  return { id };
};

const handleReportsList = async (req, env) => {
  await requireAdmin(req, env);
  const url = new URL(req.url);
  const filter = url.searchParams.get("status");
  const where = filter ? "status = ?" : "1=1";
  const args = filter ? [filter] : [];
  const { results } = await env.DB.prepare(
    `SELECT * FROM reports WHERE ${where} ORDER BY created_at DESC LIMIT 200`
  ).bind(...args).all();
  return { reports: results };
};

const handleReportPatch = async (req, env, id) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  await env.DB.prepare("UPDATE reports SET status = ?, updated_at = ? WHERE id = ?").bind(body.status || "open", nowIso(), id).run();
  return { ok: true };
};

// ──────── 추가 핸들러 (v00.029.000) ───────────────────────

// 본인 프로필 수정 — name, profile_json 만 갱신 가능 (email/password 는 별도 흐름).
const handleMePatch = async (req, env) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const sets = []; const args = [];
  if (typeof body.name === "string") { sets.push("name = ?"); args.push(body.name.trim()); }
  if (body.profile && typeof body.profile === "object") {
    sets.push("profile_json = ?"); args.push(JSON.stringify(body.profile));
  }
  if (!sets.length) return { ok: true };
  args.push(user.id);
  await env.DB.prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  const fresh = await getCurrentUser(req, env);
  return { user: fresh };
};

// v00.201 — 본인 비밀번호 변경. 현재 비번 검증 후 새 비번 hash 저장.
// P1 #3 사용자 요청 '마이페이지 프로필/비번 변경 UI'.
const handleMePassword = async (req, env) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  if (newPassword.length < 6) {
    throw new HttpError(400, "새 비밀번호는 6자 이상이어야 합니다.");
  }
  if (currentPassword === newPassword) {
    throw new HttpError(400, "현재 비밀번호와 다른 비밀번호를 입력해 주세요.");
  }
  const row = await env.DB.prepare(
    "SELECT password_hash, password_salt FROM users WHERE id = ?"
  ).bind(user.id).first();
  if (!row) throw new HttpError(404, "사용자를 찾을 수 없습니다.");
  const ok = await verifyPassword(currentPassword, row.password_hash, row.password_salt);
  if (!ok) throw new HttpError(401, "현재 비밀번호가 일치하지 않습니다.");
  const { hash, salt } = await hashPassword(newPassword);
  await env.DB.prepare(
    "UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?"
  ).bind(hash, salt, user.id).run();
  // 감사 로그.
  await auditWrite(env, user.email || user.id, "auth.password_change", user.id, null, clientIp(req));
  return { ok: true };
};

// 댓글 삭제 — 작성자 본인 또는 관리자.
const handleCommentDelete = async (req, env, postId, commentId) => {
  const user = await requireUser(req, env);
  const row = await env.DB.prepare("SELECT id, author_id FROM comments WHERE id = ? AND post_id = ?").bind(commentId, postId).first();
  if (!row) throw new HttpError(404, "댓글을 찾을 수 없습니다.");
  if (!user.isAdmin && row.author_id !== user.id) throw new HttpError(403, "본인 또는 관리자만 삭제할 수 있습니다.");
  await env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(commentId).run();
  return { ok: true };
};

// ── 강연 등록 흐름 ──
const handleMyLectures = async (req, env) => {
  const user = await requireUser(req, env);
  const { results } = await env.DB.prepare(
    `SELECT lr.*, l.title, l.starts_at, l.venue, l.price
     FROM lecture_registrations lr JOIN lectures l ON l.id = lr.lecture_id
     WHERE lr.user_id = ? ORDER BY lr.created_at DESC`
  ).bind(user.id).all();
  return { registrations: results };
};

const handleLectureRegistrationCancel = async (req, env, regId) => {
  const user = await requireUser(req, env);
  const row = await env.DB.prepare("SELECT id, user_id, status FROM lecture_registrations WHERE id = ?").bind(regId).first();
  if (!row) throw new HttpError(404, "신청을 찾을 수 없습니다.");
  if (!user.isAdmin && row.user_id !== user.id) throw new HttpError(403, "본인 신청만 취소할 수 있습니다.");
  await env.DB.prepare("UPDATE lecture_registrations SET status = 'cancelled', cancelled_at = ? WHERE id = ?").bind(nowIso(), regId).run();
  return { ok: true };
};

const handleLectureRegistrationPatch = async (req, env, regId) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  // 상태 변경 시 알림 발급용으로 사전에 정보 fetch.
  const before = await env.DB.prepare(
    "SELECT lr.user_id, lr.status, l.title, l.id AS lecture_id FROM lecture_registrations lr LEFT JOIN lectures l ON l.id = lr.lecture_id WHERE lr.id = ?"
  ).bind(regId).first();
  const sets = []; const args = [];
  if (body.status) { sets.push("status = ?"); args.push(body.status); }
  if (body.status === 'confirmed') { sets.push("paid_at = ?"); args.push(nowIso()); }
  // v00.136 — attended (NULL/1/0) 마킹. body.attended 가 명시되면 적용.
  if ('attended' in body) {
    const v = body.attended === null ? null : (body.attended ? 1 : 0);
    sets.push("attended = ?"); args.push(v);
  }
  if (!sets.length) return { ok: true };
  args.push(regId);
  await env.DB.prepare(`UPDATE lecture_registrations SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  // 상태 변화 알림 — 입금확인/취소/환불 등.
  if (before?.user_id && body.status && body.status !== before.status) {
    const map = {
      confirmed: '강연 입금이 확인되어 참가가 확정되었습니다.',
      cancelled: '강연 신청이 취소되었습니다.',
      refund_requested: '환불 신청이 접수되었습니다.',
      pending_payment: '강연 신청이 입금 대기 상태로 전환되었습니다.',
    };
    if (map[body.status]) {
      await insertNotification(env, {
        userId: before.user_id, type: 'lecture_' + body.status,
        message: map[body.status], fromName: '운영자',
        lectureId: before.lecture_id, postTitle: before.title || '강연',
      });
    }
  }
  return { ok: true };
};

const handleLectureReviews = async (req, env, lectureId) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM lecture_reviews WHERE lecture_id = ? ORDER BY created_at DESC"
  ).bind(lectureId).all();
  return { reviews: results };
};

const handleLectureReviewCreate = async (req, env, lectureId) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const conf = await env.DB.prepare(
    "SELECT 1 FROM lecture_registrations WHERE lecture_id = ? AND user_id = ? AND status = 'confirmed'"
  ).bind(lectureId, user.id).first();
  if (!conf) throw new HttpError(403, "참가 확정된 회원만 후기를 작성할 수 있습니다.");
  const id = randomId("lrev");
  await env.DB.prepare(
    `INSERT INTO lecture_reviews (id, lecture_id, user_id, user_name, rating, text)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(id, lectureId, user.id, user.name, Number(body.rating || 5), String(body.body || "").slice(0, 2000)).run();
  return { id };
};

const handleLectureReviewDelete = async (req, env, reviewId) => {
  const user = await requireUser(req, env);
  const row = await env.DB.prepare("SELECT user_id FROM lecture_reviews WHERE id = ?").bind(reviewId).first();
  if (!row) throw new HttpError(404, "후기를 찾을 수 없습니다.");
  if (!user.isAdmin && row.user_id !== user.id) throw new HttpError(403);
  await env.DB.prepare("DELETE FROM lecture_reviews WHERE id = ?").bind(reviewId).run();
  return { ok: true };
};

// ── 투어 예약 흐름 ──
const handleTourReserve = async (req, env, tourId) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const tour = await env.DB.prepare("SELECT id, capacity FROM tours WHERE id = ?").bind(tourId).first();
  if (!tour) throw new HttpError(404, "투어를 찾을 수 없습니다.");
  const cnt = await env.DB.prepare(
    "SELECT COUNT(*) AS c FROM tour_reservations WHERE tour_id = ? AND status IN ('confirmed','paid')"
  ).bind(tourId).first();
  const isFull = Number(cnt?.c || 0) >= Number(tour.capacity || 0);
  const status = isFull ? "waitlist" : "pending_payment";
  const id = randomId("tres");
  await env.DB.prepare(
    `INSERT INTO tour_reservations (id, tour_id, user_id, user_name, user_email, user_phone, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, tourId, user.id, user.name, user.email, body.phone || "", status).run();
  return { id, status };
};

const handleMyTours = async (req, env) => {
  const user = await requireUser(req, env);
  const { results } = await env.DB.prepare(
    `SELECT tr.*, t.title, t.starts_at, t.price
     FROM tour_reservations tr JOIN tours t ON t.id = tr.tour_id
     WHERE tr.user_id = ? ORDER BY tr.created_at DESC`
  ).bind(user.id).all();
  return { reservations: results };
};

const handleTourReservationCancel = async (req, env, regId) => {
  const user = await requireUser(req, env);
  const row = await env.DB.prepare("SELECT id, user_id FROM tour_reservations WHERE id = ?").bind(regId).first();
  if (!row) throw new HttpError(404);
  if (!user.isAdmin && row.user_id !== user.id) throw new HttpError(403);
  await env.DB.prepare("UPDATE tour_reservations SET status = 'cancelled', cancelled_at = ? WHERE id = ?").bind(nowIso(), regId).run();
  return { ok: true };
};

const handleTourReservationPatch = async (req, env, regId) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const before = await env.DB.prepare(
    "SELECT tr.user_id, tr.status, t.title, t.id AS tour_id FROM tour_reservations tr LEFT JOIN tours t ON t.id = tr.tour_id WHERE tr.id = ?"
  ).bind(regId).first();
  const sets = []; const args = [];
  if (body.status) { sets.push("status = ?"); args.push(body.status); }
  if (body.status === 'confirmed') { sets.push("paid_at = ?"); args.push(nowIso()); }
  // v00.136 — attended (NULL/1/0) 마킹.
  if ('attended' in body) {
    const v = body.attended === null ? null : (body.attended ? 1 : 0);
    sets.push("attended = ?"); args.push(v);
  }
  if (!sets.length) return { ok: true };
  args.push(regId);
  await env.DB.prepare(`UPDATE tour_reservations SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  if (before?.user_id && body.status && body.status !== before.status) {
    const map = {
      confirmed: '투어 입금이 확인되어 참가가 확정되었습니다.',
      cancelled: '투어 예약이 취소되었습니다.',
      refund_requested: '환불 신청이 접수되었습니다.',
      pending_payment: '투어 예약이 입금 대기 상태로 전환되었습니다.',
    };
    if (map[body.status]) {
      await insertNotification(env, {
        userId: before.user_id, type: 'tour_' + body.status,
        message: map[body.status], fromName: '운영자',
        tourId: before.tour_id, postTitle: before.title || '투어',
      });
    }
  }
  return { ok: true };
};

const handleTourReviews = async (req, env, tourId) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM tour_reviews WHERE tour_id = ? ORDER BY created_at DESC"
  ).bind(tourId).all();
  return { reviews: results };
};

const handleTourReviewCreate = async (req, env, tourId) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const conf = await env.DB.prepare(
    "SELECT 1 FROM tour_reservations WHERE tour_id = ? AND user_id = ? AND status = 'confirmed'"
  ).bind(tourId, user.id).first();
  if (!conf) throw new HttpError(403, "참가 확정된 회원만 후기를 작성할 수 있습니다.");
  const id = randomId("trev");
  await env.DB.prepare(
    `INSERT INTO tour_reviews (id, tour_id, user_id, user_name, rating, text)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(id, tourId, user.id, user.name, Number(body.rating || 5), String(body.body || "").slice(0, 2000)).run();
  return { id };
};

const handleTourReviewDelete = async (req, env, reviewId) => {
  const user = await requireUser(req, env);
  const row = await env.DB.prepare("SELECT user_id FROM tour_reviews WHERE id = ?").bind(reviewId).first();
  if (!row) throw new HttpError(404);
  if (!user.isAdmin && row.user_id !== user.id) throw new HttpError(403);
  await env.DB.prepare("DELETE FROM tour_reviews WHERE id = ?").bind(reviewId).run();
  return { ok: true };
};

// ── 책 주문 ──
const handleBookOrderCreate = async (req, env) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const id = randomId("ord");
  const orderNo = "BGNJ-" + Date.now().toString(36).toUpperCase();
  await env.DB.prepare(
    `INSERT INTO book_orders (id, order_no, book_id, user_id, version, qty, price, recipient, phone, address, address_detail, zip, memo, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment', ?)`
  ).bind(
    id, orderNo, body.bookId || "kingsroad", user.id,
    body.version || "KR", Number(body.qty || 1), Number(body.price || 0),
    body.recipient || user.name, body.phone || "", body.address || "", body.addressDetail || "",
    body.zip || "", body.memo || "", nowIso()
  ).run();
  return { id, orderNo };
};

const handleMyOrders = async (req, env) => {
  const user = await requireUser(req, env);
  const { results } = await env.DB.prepare(
    "SELECT * FROM book_orders WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(user.id).all();
  return { orders: results };
};

const handleAdminOrdersList = async (req, env) => {
  await requireAdmin(req, env);
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const where = status ? "status = ?" : "1=1";
  const args = status ? [status] : [];
  const { results } = await env.DB.prepare(
    `SELECT * FROM book_orders WHERE ${where} ORDER BY created_at DESC LIMIT 500`
  ).bind(...args).all();
  return { orders: results };
};

const handleOrderPatch = async (req, env, orderId) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const row = await env.DB.prepare("SELECT user_id, status FROM book_orders WHERE id = ?").bind(orderId).first();
  if (!row) throw new HttpError(404, "주문을 찾을 수 없습니다.");
  // 본인은 자신의 주문 취소만 가능. 그 외 상태 변경은 관리자만.
  const isSelfCancel = (row.user_id === user.id) && body.status === 'cancelled' && row.status === 'pending_payment';
  if (!user.isAdmin && !isSelfCancel) throw new HttpError(403);
  const sets = []; const args = [];
  if (body.status) { sets.push("status = ?"); args.push(body.status); }
  if (body.status === 'paid') { sets.push("paid_at = ?"); args.push(nowIso()); }
  if (body.status === 'shipped') { sets.push("shipped_at = ?"); args.push(nowIso()); if (body.tracking) { sets.push("tracking = ?"); args.push(body.tracking); } }
  if (body.status === 'delivered') { sets.push("delivered_at = ?"); args.push(nowIso()); }
  if (!sets.length) return { ok: true };
  args.push(orderId);
  await env.DB.prepare(`UPDATE book_orders SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  // 주문 상태 변경 시 알림 자동 발급.
  if (row.user_id && body.status && body.status !== row.status) {
    const map = {
      paid: '입금이 확인되어 발송 준비를 시작합니다.',
      shipped: body.tracking ? `발송이 시작되었습니다. 송장 번호 ${body.tracking}.` : '발송이 시작되었습니다.',
      delivered: '배송이 완료되었습니다. 즐거운 독서 되세요.',
      cancelled: '주문이 취소되었습니다.',
      refund_requested: '환불 신청이 접수되었습니다.',
    };
    if (map[body.status]) {
      // v00.154 — 책 제목 동적. book_id 가 있으면 books 테이블 join 으로 title 가져옴, 없으면 fallback.
      const order = await env.DB.prepare(
        "SELECT bo.order_no, b.title AS book_title FROM book_orders bo LEFT JOIN books b ON b.id = bo.book_id WHERE bo.id = ?"
      ).bind(orderId).first();
      const title = order?.book_title || '도서';
      await insertNotification(env, {
        userId: row.user_id, type: 'order_' + body.status,
        message: map[body.status], fromName: '운영자',
        postTitle: `『${title}』 주문 ${order?.order_no || orderId}`,
      });
    }
  }
  return { ok: true };
};

// v00.261 — 관리자 전용 도서 주문 삭제. 테스트 데이터 청소 / 운영 cleanup.
// 한국 전자상거래법 거래기록 5년 보존은 '실거래'에 한정 — 테스트 주문은 적용 외.
// 누가 무엇을 지웠는지 audit_log 에 흔적 남김 (추적·책임성).
const handleOrderDelete = async (req, env, orderId) => {
  const admin = await requireAdmin(req, env);
  const row = await env.DB.prepare(
    "SELECT id, order_no, user_id, book_id, status, total FROM book_orders WHERE id = ?"
  ).bind(orderId).first();
  if (!row) throw new HttpError(404, "주문을 찾을 수 없습니다.");
  await env.DB.prepare("DELETE FROM book_orders WHERE id = ?").bind(orderId).run();
  await auditWrite(env, admin.id, "book_order_delete", `book_order:${orderId}`, {
    orderNo: row.order_no, userId: row.user_id, bookId: row.book_id,
    status: row.status, total: row.total,
  }, clientIp(req));
  return { ok: true };
};

// ── 책 후기 ──
const handleBookReviews = async (req, env, bookId) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM book_reviews WHERE book_id = ? ORDER BY created_at DESC"
  ).bind(bookId).all();
  return { reviews: results };
};

const handleBookReviewCreate = async (req, env, bookId) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const delivered = await env.DB.prepare(
    "SELECT 1 FROM book_orders WHERE book_id = ? AND user_id = ? AND status = 'delivered' LIMIT 1"
  ).bind(bookId, user.id).first();
  if (!delivered && !user.isAdmin) throw new HttpError(403, "배송 완료된 회원만 후기를 작성할 수 있습니다.");
  const id = randomId("brev");
  await env.DB.prepare(
    `INSERT INTO book_reviews (id, book_id, user_id, user_name, rating, text)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(id, bookId, user.id, user.name, Number(body.rating || 5), String(body.body || "").slice(0, 2000)).run();
  return { id };
};

const handleBookReviewDelete = async (req, env, reviewId) => {
  const user = await requireUser(req, env);
  const row = await env.DB.prepare("SELECT user_id FROM book_reviews WHERE id = ?").bind(reviewId).first();
  if (!row) throw new HttpError(404);
  if (!user.isAdmin && row.user_id !== user.id) throw new HttpError(403);
  await env.DB.prepare("DELETE FROM book_reviews WHERE id = ?").bind(reviewId).run();
  return { ok: true };
};

// ── 사이트 콘텐츠 ──
const handleSiteContentGet = async (req, env) => {
  const { results } = await env.DB.prepare("SELECT section, data_json FROM site_content_kv").all();
  const out = {};
  for (const r of results || []) {
    try { out[r.section] = JSON.parse(r.data_json); } catch {}
  }
  return { siteContent: out };
};

const handleSiteContentPatch = async (req, env, section) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const data = body.data || body || {};
  await env.DB.prepare(
    `INSERT INTO site_content_kv (section, data_json, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(section) DO UPDATE SET data_json = excluded.data_json, updated_at = excluded.updated_at`
  ).bind(section, JSON.stringify(data), nowIso()).run();
  return { ok: true, section, data };
};

// ── FAQ ──
const handleFaqList = async (req, env) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM faqs WHERE hidden = 0 ORDER BY display_order, created_at DESC"
  ).all();
  return { faqs: results };
};

const handleFaqAdminList = async (req, env) => {
  await requireAdmin(req, env);
  const { results } = await env.DB.prepare(
    "SELECT * FROM faqs ORDER BY display_order, created_at DESC"
  ).all();
  return { faqs: results };
};

const handleFaqCreate = async (req, env) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const id = randomId("faq");
  await env.DB.prepare(
    `INSERT INTO faqs (id, category, question, answer, display_order, hidden) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(id, body.category || "일반", body.question || "", body.answer || "", Number(body.order || 0), body.hidden ? 1 : 0).run();
  return { id };
};

const handleFaqPatch = async (req, env, id) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const sets = []; const args = [];
  for (const [k, col] of [["category","category"],["question","question"],["answer","answer"]]) {
    if (k in body) { sets.push(`${col} = ?`); args.push(body[k]); }
  }
  if ("order" in body) { sets.push("display_order = ?"); args.push(Number(body.order || 0)); }
  if ("hidden" in body) { sets.push("hidden = ?"); args.push(body.hidden ? 1 : 0); }
  sets.push("updated_at = ?"); args.push(nowIso());
  args.push(id);
  await env.DB.prepare(`UPDATE faqs SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  return { ok: true };
};

const handleFaqDelete = async (req, env, id) => {
  await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM faqs WHERE id = ?").bind(id).run();
  return { ok: true };
};

// ── 약관/개인정보 처리방침 ──
const handleLegalGet = async (req, env, slug) => {
  const row = await env.DB.prepare("SELECT * FROM legal_docs WHERE slug = ?").bind(slug).first();
  return { doc: row || null };
};

const handleLegalPut = async (req, env, slug) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  await env.DB.prepare(
    `INSERT INTO legal_docs (slug, title, body, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET title = excluded.title, body = excluded.body, updated_at = excluded.updated_at`
  ).bind(slug, body.title || slug, body.body || "", nowIso()).run();
  return { ok: true };
};

// ── 입금 계좌 (멀티 계좌) ──
// 단일 행 bank_account 는 backward-compat 으로 첫 번째 default 계좌를 미러링.
const handleBankAccountGet = async (req, env) => {
  // 신규: bank_accounts 테이블에서 default 또는 가장 최근 항목 반환.
  const row = await env.DB.prepare(
    `SELECT * FROM bank_accounts ORDER BY is_default DESC, display_order ASC, created_at DESC LIMIT 1`
  ).first();
  if (row) {
    return { bankAccount: { id: row.id, label: row.label, bank_name: row.bank_name, account_number: row.account_number, holder: row.holder, memo: row.memo } };
  }
  // 폴백 — 레거시 단일 행 테이블.
  const legacy = await env.DB.prepare("SELECT * FROM bank_account WHERE id = 1").first();
  return { bankAccount: legacy || null };
};

const handleBankAccountPut = async (req, env) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  // 레거시 단일 PUT — 첫 번째 default 계좌를 갱신하거나 새로 생성.
  const existing = await env.DB.prepare(
    `SELECT id FROM bank_accounts ORDER BY is_default DESC, display_order ASC, created_at DESC LIMIT 1`
  ).first();
  if (existing) {
    await env.DB.prepare(
      `UPDATE bank_accounts SET bank_name = ?, account_number = ?, holder = ?, memo = ?, updated_at = ? WHERE id = ?`
    ).bind(body.bankName || "", body.accountNumber || "", body.holder || "", body.memo || "", nowIso(), existing.id).run();
  } else {
    const id = randomId("ba");
    await env.DB.prepare(
      `INSERT INTO bank_accounts (id, label, bank_name, account_number, holder, memo, is_default) VALUES (?, ?, ?, ?, ?, ?, 1)`
    ).bind(id, body.label || '기본 계좌', body.bankName || "", body.accountNumber || "", body.holder || "", body.memo || "").run();
  }
  // 레거시 단일 행도 미러링 (구 클라이언트 호환).
  await env.DB.prepare(
    `UPDATE bank_account SET bank_name = ?, account_number = ?, holder = ?, memo = ?, updated_at = ? WHERE id = 1`
  ).bind(body.bankName || "", body.accountNumber || "", body.holder || "", body.memo || "", nowIso()).run();
  return { ok: true };
};

// 멀티 계좌 — 공개 list 는 결제 화면에서 계좌 선택을 위해 사용.
const handleBankAccountsList = async (req, env) => {
  const { results } = await env.DB.prepare(
    `SELECT id, label, bank_name, account_number, holder, memo, is_default, display_order
     FROM bank_accounts ORDER BY is_default DESC, display_order ASC, created_at DESC`
  ).all();
  return { accounts: results || [] };
};

const handleBankAccountCreate = async (req, env) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const id = randomId("ba");
  if (body.isDefault) {
    await env.DB.prepare(`UPDATE bank_accounts SET is_default = 0`).run();
  }
  await env.DB.prepare(
    `INSERT INTO bank_accounts (id, label, bank_name, account_number, holder, memo, is_default, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.label || '계좌', body.bankName || "", body.accountNumber || "",
    body.holder || "", body.memo || "", body.isDefault ? 1 : 0, Number(body.order || 0)
  ).run();
  return { id };
};

const handleBankAccountPatch = async (req, env, id) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  if (body.isDefault === true) {
    await env.DB.prepare(`UPDATE bank_accounts SET is_default = 0`).run();
  }
  const sets = []; const args = [];
  for (const [k, col] of [["label","label"],["bankName","bank_name"],["accountNumber","account_number"],["holder","holder"],["memo","memo"]]) {
    if (k in body) { sets.push(`${col} = ?`); args.push(body[k]); }
  }
  if ("isDefault" in body) { sets.push("is_default = ?"); args.push(body.isDefault ? 1 : 0); }
  if ("order" in body) { sets.push("display_order = ?"); args.push(Number(body.order || 0)); }
  if (!sets.length) return { ok: true };
  sets.push("updated_at = ?"); args.push(nowIso());
  args.push(id);
  await env.DB.prepare(`UPDATE bank_accounts SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  return { ok: true };
};

const handleBankAccountDelete = async (req, env, id) => {
  await requireAdmin(req, env);
  await env.DB.prepare(`DELETE FROM bank_accounts WHERE id = ?`).bind(id).run();
  return { ok: true };
};

// ── 카테고리 ──
const handleCategoriesList = async (req, env) => {
  const { results } = await env.DB.prepare("SELECT * FROM categories_kv ORDER BY display_order").all();
  return { categories: (results || []).map((r) => ({ ...r, prefixes: r.prefixes_json ? JSON.parse(r.prefixes_json) : [] })) };
};

const handleCategoryCreate = async (req, env) => {
  const admin = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "").trim() || randomId("cat");
  // v00.141 — schema-v8 (allow_read / allow_write / allow_comment_read / allow_comment_write).
  // 마이그레이션 미적용 환경에서도 동작하도록 try/catch 후 폴백 (구 INSERT).
  const allowRead = body.allowRead === undefined ? 1 : (body.allowRead ? 1 : 0);
  const allowWrite = body.allowWrite === undefined ? 1 : (body.allowWrite ? 1 : 0);
  const allowCR = body.allowCommentRead === undefined ? 1 : (body.allowCommentRead ? 1 : 0);
  const allowCW = body.allowCommentWrite === undefined ? 1 : (body.allowCommentWrite ? 1 : 0);
  try {
    await env.DB.prepare(
      `INSERT INTO categories_kv (id, label, board_type, min_level, post_min_level, description, prefixes_json, display_order, allow_read, allow_write, allow_comment_read, allow_comment_write)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, body.label || "", body.boardType || "community", Number(body.minLevel || 0), Number(body.postMinLevel || 10), body.description || "", JSON.stringify(body.prefixes || []), Number(body.order || 0), allowRead, allowWrite, allowCR, allowCW).run();
  } catch {
    await env.DB.prepare(
      `INSERT INTO categories_kv (id, label, board_type, min_level, post_min_level, description, prefixes_json, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, body.label || "", body.boardType || "community", Number(body.minLevel || 0), Number(body.postMinLevel || 10), body.description || "", JSON.stringify(body.prefixes || []), Number(body.order || 0)).run();
  }
  // v00.189 — 카테고리 추가 audit log.
  await auditWrite(env, admin.email, "category.create", `category:${id}`, { label: body.label, boardType: body.boardType });
  return { id };
};

const handleCategoryPatch = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const sets = []; const args = [];
  if ("label" in body) { sets.push("label = ?"); args.push(body.label); }
  if ("boardType" in body) { sets.push("board_type = ?"); args.push(body.boardType); }
  if ("minLevel" in body) { sets.push("min_level = ?"); args.push(Number(body.minLevel)); }
  if ("postMinLevel" in body) { sets.push("post_min_level = ?"); args.push(Number(body.postMinLevel)); }
  if ("description" in body) { sets.push("description = ?"); args.push(body.description); }
  if ("prefixes" in body) { sets.push("prefixes_json = ?"); args.push(JSON.stringify(body.prefixes || [])); }
  if ("order" in body) { sets.push("display_order = ?"); args.push(Number(body.order)); }
  // v00.141 — schema-v8 권한 4종.
  if ("allowRead" in body)         { sets.push("allow_read = ?");          args.push(body.allowRead ? 1 : 0); }
  if ("allowWrite" in body)        { sets.push("allow_write = ?");         args.push(body.allowWrite ? 1 : 0); }
  if ("allowCommentRead" in body)  { sets.push("allow_comment_read = ?");  args.push(body.allowCommentRead ? 1 : 0); }
  if ("allowCommentWrite" in body) { sets.push("allow_comment_write = ?"); args.push(body.allowCommentWrite ? 1 : 0); }
  if (!sets.length) return { ok: true };
  args.push(id);
  // schema-v8 미적용 환경에서 unknown column 에러 → try once, fall back removing allow_* sets.
  try {
    await env.DB.prepare(`UPDATE categories_kv SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  } catch (err) {
    if (String(err?.message || '').toLowerCase().includes('no such column')) {
      const filtered = []; const filteredArgs = [];
      sets.forEach((s, i) => {
        if (!s.startsWith('allow_')) { filtered.push(s); filteredArgs.push(args[i]); }
      });
      if (filtered.length) {
        filteredArgs.push(id);
        await env.DB.prepare(`UPDATE categories_kv SET ${filtered.join(", ")} WHERE id = ?`).bind(...filteredArgs).run();
      }
    } else { throw err; }
  }
  // v00.189 — 카테고리 변경 audit log.
  await auditWrite(env, admin.email, "category.update", `category:${id}`, body);
  return { ok: true };
};

const handleCategoryDelete = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM categories_kv WHERE id = ?").bind(id).run();
  // v00.189 — 카테고리 삭제 audit log.
  await auditWrite(env, admin.email, "category.remove", `category:${id}`);
  return { ok: true };
};

// ── 등급 ──
const handleGradesList = async (req, env) => {
  const { results } = await env.DB.prepare("SELECT * FROM grades_kv ORDER BY level").all();
  return { grades: results };
};

const handleGradeUpsert = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  await env.DB.prepare(
    `INSERT INTO grades_kv (id, label, level, color, description, display_order) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET label = excluded.label, level = excluded.level, color = excluded.color,
       description = excluded.description, display_order = excluded.display_order`
  ).bind(id, body.label || id, Number(body.level || 0), body.color || "", body.description || "", Number(body.order || 0)).run();
  // v00.189 — 등급 upsert audit log.
  await auditWrite(env, admin.email, "grade.upsert", `grade:${id}`, { label: body.label, level: body.level });
  return { ok: true };
};

const handleGradeDelete = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM grades_kv WHERE id = ?").bind(id).run();
  // v00.189 — 등급 삭제 audit log.
  await auditWrite(env, admin.email, "grade.remove", `grade:${id}`);
  return { ok: true };
};

// ── 회원 활동 집계 (관리자) ──
const handleUserActivity = async (req, env, userId) => {
  await requireAdmin(req, env);
  const safe = async (sql, args = []) => {
    try { const r = await env.DB.prepare(sql).bind(...args).first(); return r?.c || 0; }
    catch { return 0; }
  };
  const [postCount, commentCount, bookmarkCount, orderCount, lectureCount, tourCount, notificationCount] = await Promise.all([
    safe("SELECT COUNT(*) AS c FROM posts WHERE author_id = ?", [userId]),
    safe("SELECT COUNT(*) AS c FROM comments WHERE author_id = ?", [userId]),
    safe("SELECT COUNT(*) AS c FROM bookmarks WHERE user_id = ?", [userId]),
    safe("SELECT COUNT(*) AS c FROM book_orders WHERE user_id = ?", [userId]),
    safe("SELECT COUNT(*) AS c FROM lecture_registrations WHERE user_id = ?", [userId]),
    safe("SELECT COUNT(*) AS c FROM tour_reservations WHERE user_id = ?", [userId]),
    safe("SELECT COUNT(*) AS c FROM notifications WHERE user_id = ?", [userId]),
  ]);
  return { activity: { postCount, commentCount, bookmarkCount, orderCount, lectureCount, tourCount, notificationCount } };
};

// ── 강연 신청 / 투어 예약 — 관리자 강연·투어별 목록 ──
const handleLectureRegList = async (req, env, lectureId) => {
  await requireAdmin(req, env);
  const { results } = await env.DB.prepare(
    "SELECT * FROM lecture_registrations WHERE lecture_id = ? ORDER BY created_at DESC"
  ).bind(lectureId).all();
  return { registrations: results || [] };
};
const handleTourResvList = async (req, env, tourId) => {
  await requireAdmin(req, env);
  const { results } = await env.DB.prepare(
    "SELECT * FROM tour_reservations WHERE tour_id = ? ORDER BY created_at DESC"
  ).bind(tourId).all();
  return { reservations: results || [] };
};

// ── 칼럼 좋아요 / 조회수 ──
const handleColumnLike = async (req, env, id) => {
  const user = await requireUser(req, env);
  const row = await env.DB.prepare("SELECT likes_json FROM user_columns WHERE id = ?").bind(id).first();
  if (!row) throw new HttpError(404, "칼럼을 찾을 수 없습니다.");
  let likes = [];
  try { likes = row.likes_json ? JSON.parse(row.likes_json) : []; } catch { likes = []; }
  const next = likes.includes(user.id) ? likes.filter((x) => x !== user.id) : [...likes, user.id];
  await env.DB.prepare("UPDATE user_columns SET likes_json = ? WHERE id = ?").bind(JSON.stringify(next), id).run();
  return { liked: !likes.includes(user.id), likes: next, count: next.length };
};
const handleColumnView = async (req, env, id) => {
  // 비로그인도 카운트 — 그러나 같은 사용자의 다중 카운트 방지는 클라이언트 sessionStorage 에서 가드.
  await env.DB.prepare("UPDATE user_columns SET views = COALESCE(views, 0) + 1 WHERE id = ?").bind(id).run();
  const row = await env.DB.prepare("SELECT views FROM user_columns WHERE id = ?").bind(id).first();
  return { views: row?.views || 0 };
};

// v00.244 — 게시글 조회수 dedicated endpoint. 칼럼 패턴 미러.
// 기존엔 handlePostGet 내부에서 views += 1 부수효과로 처리 — 단일 fetch 트리거 시에만 동작.
// CommunityPage detail mount 의 `incrementViews` 가 별 endpoint 호출 못 해 사실상 0 고정 버그.
const handlePostView = async (req, env, id) => {
  const numId = Number(id);
  if (!numId) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  await env.DB.prepare("UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = ?").bind(numId).run();
  const row = await env.DB.prepare("SELECT views FROM posts WHERE id = ?").bind(numId).first();
  return { views: row?.views || 0 };
};

// ── 알림 자동 발급 헬퍼 (서버 부수효과 패턴) ──
// 댓글 작성 / 등록 / 주문 등 행위 시 호출. 익명 안전(throw 안 함).
// v00.120 — GC: 90일 이상 된 read=1 알림 1/50 확률로 삭제. unread 는 보존.
const NOTIFICATIONS_RETENTION_MS = 90 * 24 * 3600 * 1000;
// v00.183 — 내부 인원(admin) 대상 알람 broadcast. admin 전용.
// v00.191 — 그룹 선택 확장. 사용자 보고 '특정 사용자 개인보다 그룹이 합리적'.
// recipients 옵션:
//   'all_admins'         — 관리자 전체 (is_admin = 1)
//   'all_members'        — 전체 회원 (admin 포함)
//   'all_non_admins'     — 일반 회원만 (admin 제외)
//   { grade: 'gradeId' } — 특정 등급
//   userId[]             — (legacy) 개별 ID 배열 — admin 호환용 유지
const handleInternalAlarmSend = async (req, env) => {
  const me = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const recipients = body.recipients;
  const title = String(body.title || '').trim();
  const message = String(body.message || '').trim();
  if (!message) throw new HttpError(400, '메시지를 입력해 주세요.');
  // 수신자 결정.
  let userIds = [];
  let groupLabel = '';
  if (recipients === 'all_admins' || recipients === 'all') {
    const { results } = await env.DB.prepare("SELECT id FROM users WHERE is_admin = 1").all();
    userIds = (results || []).map((r) => r.id);
    groupLabel = '전체 관리자';
  } else if (recipients === 'all_members') {
    const { results } = await env.DB.prepare("SELECT id FROM users").all();
    userIds = (results || []).map((r) => r.id);
    groupLabel = '전체 회원';
  } else if (recipients === 'all_non_admins') {
    const { results } = await env.DB.prepare("SELECT id FROM users WHERE is_admin = 0 OR is_admin IS NULL").all();
    userIds = (results || []).map((r) => r.id);
    groupLabel = '일반 회원';
  } else if (typeof recipients === 'object' && recipients !== null && !Array.isArray(recipients) && recipients.grade) {
    const gradeId = String(recipients.grade);
    const { results } = await env.DB.prepare("SELECT id FROM users WHERE grade_id = ?").bind(gradeId).all();
    userIds = (results || []).map((r) => r.id);
    groupLabel = `등급:${gradeId}`;
  } else if (Array.isArray(recipients)) {
    userIds = recipients.filter(Boolean).map(String);
    groupLabel = `개별 ${userIds.length}명`;
  } else {
    throw new HttpError(400, "recipients 는 'all_admins' / 'all_members' / 'all_non_admins' / {grade:'id'} / userId[] 중 하나여야 합니다.");
  }
  // 본인 제외 (자기에게 보내는 알람 차단 옵션).
  if (body.excludeSelf !== false && me?.id) userIds = userIds.filter((id) => id !== me.id);
  if (userIds.length === 0) throw new HttpError(400, '발송할 대상이 없습니다.');
  // 각 수신자에게 notification insert.
  let sent = 0;
  for (const uid of userIds) {
    try {
      await insertNotification(env, {
        userId: uid,
        type: 'internal_alarm',
        message: title ? `[${title}] ${message}` : message,
        fromName: me?.name || '운영자',
      });
      sent += 1;
    } catch {}
  }
  // v00.189 — 내부 알람 발송 audit log. v00.191 — group label 도 기록.
  await auditWrite(env, me?.email || '?', "alarm.send", `alarm:${groupLabel}`, { title, sent, total: userIds.length, group: groupLabel });
  return { ok: true, sent, total: userIds.length, group: groupLabel };
};

const insertNotification = async (env, { userId, type, message, fromName, postId, postTitle, lectureId, tourId }) => {
  if (!userId) return;
  try {
    const id = randomId("notif");
    await env.DB.prepare(
      `INSERT INTO notifications (id, user_id, type, message, from_name, post_id, post_title, lecture_id, tour_id, read)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
    ).bind(id, userId, type || 'general', message || '', fromName || '운영자',
      postId || null, postTitle || null, lectureId || null, tourId || null).run();
    if (Math.random() < 0.02) {
      try {
        const cutoff = new Date(Date.now() - NOTIFICATIONS_RETENTION_MS).toISOString();
        await env.DB.prepare(
          "DELETE FROM notifications WHERE read = 1 AND created_at < ?"
        ).bind(cutoff).run();
      } catch {}
    }
  } catch {}
};

// ── 사용자 칼럼 ──
const handleColumnsList = async (req, env) => {
  const url = new URL(req.url);
  const includeAll = url.searchParams.get("includeAll") === "1";
  const status = includeAll ? null : 'published';
  // v00.201 — q + includeBody 검색 옵션 (P1 #4). 칼럼 본문은 body_text 또는 body_json 안에 .text 필드.
  const q = (url.searchParams.get("q") || "").trim();
  const includeBody = url.searchParams.get("includeBody") === "1";
  let where = status ? "status = ?" : "1=1";
  const args = status ? [status] : [];
  if (q) {
    if (includeBody) {
      where += " AND (title LIKE ? OR excerpt LIKE ? OR body LIKE ?)";
      args.push(`%${q}%`, `%${q}%`, `%${q}%`);
    } else {
      where += " AND (title LIKE ? OR excerpt LIKE ?)";
      args.push(`%${q}%`, `%${q}%`);
    }
  }
  const { results } = await env.DB.prepare(
    `SELECT * FROM user_columns WHERE ${where} ORDER BY created_at DESC LIMIT 200`
  ).bind(...args).all();
  return { columns: results || [] };
};

const handleColumnGet = async (req, env, id) => {
  const row = await env.DB.prepare("SELECT * FROM user_columns WHERE id = ?").bind(id).first();
  return { column: row || null };
};

const handleColumnCreate = async (req, env) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const id = randomId("col");
  const createdAt = resolveCreatedAt(user, body);
  // v00.127 — source_credit / source_url 칼럼 (schema-v6). NULLABLE — 누락 시 NULL.
  // v00.136 — schema-v7 cover_credit 컬럼 추가.
  await env.DB.prepare(
    `INSERT INTO user_columns (id, author_id, author_name, title, excerpt, body, category, cover_url, status, scheduled_at, read_minutes, created_at, source_credit, source_url, cover_credit)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, user.id, user.name,
    body.title || '', body.excerpt || '', body.body || '',
    body.category || '', body.coverUrl || '',
    body.status || 'published', body.scheduledAt || null,
    Number(body.readMinutes || 3), createdAt,
    body.sourceCredit || null, body.sourceUrl || null,
    body.coverCredit || null
  ).run();
  return { id };
};

const handleColumnPatch = async (req, env, id) => {
  const user = await requireUser(req, env);
  const row = await env.DB.prepare("SELECT author_id FROM user_columns WHERE id = ?").bind(id).first();
  if (!row) throw new HttpError(404, "칼럼을 찾을 수 없습니다.");
  if (!user.isAdmin && row.author_id !== user.id) throw new HttpError(403);
  const body = await req.json().catch(() => ({}));
  const sets = []; const args = [];
  // v00.127 — sourceCredit / sourceUrl 컬럼 (schema-v6) 도 patch 가능. v00.136 — coverCredit 추가.
  for (const [k, col] of [["title","title"],["excerpt","excerpt"],["body","body"],["category","category"],["status","status"],["scheduledAt","scheduled_at"],["coverUrl","cover_url"],["readMinutes","read_minutes"],["sourceCredit","source_credit"],["sourceUrl","source_url"],["coverCredit","cover_credit"]]) {
    if (k in body) { sets.push(`${col} = ?`); args.push(body[k]); }
  }
  // v00.115 — admin 만 created_at 수정 가능 (표시 시간 조정).
  if (user.isAdmin && body.createdAt) {
    const validatedCreatedAt = resolveCreatedAt(user, body);
    sets.push("created_at = ?"); args.push(validatedCreatedAt);
  }
  sets.push("updated_at = ?"); args.push(nowIso());
  args.push(id);
  await env.DB.prepare(`UPDATE user_columns SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  return { ok: true };
};

const handleColumnDelete = async (req, env, id) => {
  const user = await requireUser(req, env);
  const row = await env.DB.prepare("SELECT author_id FROM user_columns WHERE id = ?").bind(id).first();
  if (!row) throw new HttpError(404);
  if (!user.isAdmin && row.author_id !== user.id) throw new HttpError(403);
  await env.DB.prepare("DELETE FROM user_columns WHERE id = ?").bind(id).run();
  return { ok: true };
};

// ── 에러 로그 ──
// 클라이언트가 잡은 모든 오류(인증 외 비동기 실패, 렌더링 오류, 미처리 promise 등) 를 D1 에 기록.
// 인증 없이도 기록 가능 (익명 사용자 오류도 잡기 위해).
const handleErrorLogCreate = async (req, env) => {
  const body = await req.json().catch(() => ({}));
  const id = randomId("err");
  const user = await getCurrentUser(req, env).catch(() => null);
  await env.DB.prepare(
    `INSERT INTO error_log (id, code, status, kind, message, hint, url, user_id, user_agent, pathname, origin)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.code || null, body.status ? Number(body.status) : null, body.kind || null,
    String(body.message || '').slice(0, 2000), String(body.hint || '').slice(0, 1000),
    String(body.url || '').slice(0, 500),
    user?.id || null,
    String(req.headers.get('user-agent') || '').slice(0, 300),
    String(body.pathname || '').slice(0, 300),
    String(body.origin || req.headers.get('origin') || '').slice(0, 200)
  ).run();
  return { id };
};

const handleErrorLogList = async (req, env) => {
  await requireAdmin(req, env);
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 200), 500);
  const code = url.searchParams.get("code");
  const where = code ? "code = ?" : "1=1";
  const args = code ? [code] : [];
  const { results } = await env.DB.prepare(
    `SELECT * FROM error_log WHERE ${where} ORDER BY ts DESC LIMIT ?`
  ).bind(...args, limit).all();
  return { errors: results || [] };
};

const handleErrorLogClear = async (req, env) => {
  await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM error_log").run();
  return { ok: true };
};

// ── 감사 로그 ──
const handleAuditCreate = async (req, env) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const id = randomId("aud");
  await env.DB.prepare(
    `INSERT INTO audit_log (id, action, target, details_json, actor) VALUES (?, ?, ?, ?, ?)`
  ).bind(id, body.action || "", body.target || "", JSON.stringify(body.details || {}), user.id).run();
  return { id };
};

// ============================================================================
// 한켠(전주 숙소) 예약 관리 (PMS) — v00.267. schema-v6-hangyeon.sql
// ============================================================================

const HK_ACTIVE_STATUSES = "('pending','confirmed','checked_in','checked_out')";

const hkNights = (checkIn, checkOut) => {
  const out = [];
  let d = new Date(checkIn + "T00:00:00Z");
  const end = new Date(checkOut + "T00:00:00Z");
  let guard = 0;
  while (d < end && guard < 366) {
    out.push(d.toISOString().slice(0, 10));
    d = new Date(d.getTime() + 86400000);
    guard++;
  }
  return out;
};
const hkIsValidDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + "T00:00:00Z"));
const hkGuestKey = (phone, email) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits) return "g-" + digits;
  const em = String(email || "").trim().toLowerCase();
  return em ? "g-" + em : null;
};

const hkMapRoomType = (r) => ({
  id: r.id, name: r.name, description: r.description || "",
  images: r.images_json ? safeJson(r.images_json, []) : [],
  quantity: r.quantity, maxOccupancy: r.max_occupancy, bedConfig: r.bed_config || "",
  amenities: r.amenities_json ? safeJson(r.amenities_json, []) : [],
  basePrice: r.base_price, weekendPrice: r.weekend_price,
  discounts: r.discounts_json ? safeJson(r.discounts_json, []) : [],
  minNights: r.min_nights, maxNights: r.max_nights, status: r.status, sortOrder: r.sort_order,
  // v00.268/v00.269 — 시간당 + 하루 단위 (객실 하나가 둘 다 가능)
  bookingType: r.booking_type || "nightly",
  openTime: r.open_time || "09:00", closeTime: r.close_time || "22:00", slotMinutes: r.slot_minutes || 60,
  hourlyEnabled: !!r.hourly_enabled, hourlyPrice: r.hourly_price, minHours: r.min_hours || 3,
  dailyEnabled: !!r.daily_enabled, dailyPrice: r.daily_price,
  createdAt: r.created_at, updatedAt: r.updated_at,
});

// 시간 라벨 유틸
const hkHM = (h) => String(h).padStart(2, "0") + ":00";

// 한 객실의 (date) 시간대별 잔여 유닛. daily/nightly 는 종일 점유, hourly 는 해당 시간 점유.
const hkHourRemaining = async (env, room, date) => {
  const openH = parseInt((room.open_time || "09:00").slice(0, 2), 10);
  const closeH = parseInt((room.close_time || "22:00").slice(0, 2), 10);
  const ov = await env.DB.prepare("SELECT closed, qty_override FROM hk_availability WHERE room_type_id = ? AND date = ?").bind(room.id, date).first();
  const units = ov && ov.qty_override != null ? ov.qty_override : room.quantity;
  const closed = ov && ov.closed ? true : false;
  // 종일 점유 (daily 당일 + nightly 범위 포함)
  const dayRow = await env.DB.prepare(
    `SELECT COUNT(*) AS c FROM hk_bookings WHERE room_type_id = ? AND status IN ${HK_ACTIVE_STATUSES}
     AND ((booking_unit = 'daily' AND check_in = ?) OR (booking_unit = 'nightly' AND check_in <= ? AND check_out > ?)
          OR (booking_unit IS NULL AND check_in <= ? AND check_out > ?))`
  ).bind(room.id, date, date, date, date, date).first();
  const dailyOcc = Number(dayRow?.c || 0);
  // 시간제 점유
  const hrRows = await env.DB.prepare(
    `SELECT slot_start, slot_end FROM hk_bookings WHERE room_type_id = ? AND check_in = ? AND status IN ${HK_ACTIVE_STATUSES} AND booking_unit = 'hourly' AND slot_start IS NOT NULL`
  ).bind(room.id, date).all();
  const hourly = hrRows.results || [];
  const hours = [];
  for (let h = openH; h < closeH; h++) {
    let occ = dailyOcc;
    for (const b of hourly) {
      const s = parseInt(b.slot_start.slice(0, 2), 10);
      const e = parseInt((b.slot_end || b.slot_start).slice(0, 2), 10);
      if (s <= h && h < e) occ += 1;
    }
    hours.push({ hour: hkHM(h), remaining: closed ? 0 : Math.max(0, units - occ), occ });
  }
  const dailyRemaining = closed ? 0 : (hours.length ? Math.min(...hours.map((x) => x.remaining)) : Math.max(0, units - dailyOcc));
  return { units, closed, openH, closeH, hours, dailyRemaining };
};

// 날짜 + n일 (YYYY-MM-DD)
const hkAddDays = (str, n) => new Date(new Date(str + "T00:00:00Z").getTime() + n * 86400000).toISOString().slice(0, 10);
const safeJson = (s, fb) => { try { const v = JSON.parse(s); return v == null ? fb : v; } catch { return fb; } };

// 한 객실타입의 [from,to) 날짜별 잔여 재고 계산 (오버부킹 방지의 핵심).
// 월 캘린더 집계용 — 날짜별 잔여(유닛 − 종일 점유). 시간제 부분점유는 dot 에 미반영(개요).
const hkRoomAvailability = async (env, roomTypeId, from, to) => {
  const rt = await env.DB.prepare("SELECT * FROM hk_room_types WHERE id = ?").bind(roomTypeId).first();
  if (!rt) return [];
  const stay = !!rt.daily_enabled;
  const ruleRows = stay ? await env.DB.prepare("SELECT * FROM hk_rate_rules WHERE active = 1 AND (room_type_id = ? OR room_type_id IS NULL)").bind(roomTypeId).all() : { results: [] };
  const rules = ruleRows.results || [];
  const ovRows = await env.DB.prepare(
    "SELECT date, closed, qty_override, price_override FROM hk_availability WHERE room_type_id = ? AND date >= ? AND date < ?"
  ).bind(roomTypeId, from, to).all();
  const ovMap = {};
  const priceOvMap = {};
  for (const o of (ovRows.results || [])) { ovMap[o.date] = o; if (o.price_override != null) priceOvMap[o.date] = o.price_override; }
  // 종일 점유 (daily 당일 + nightly/legacy 범위) + 시간제 1건이라도 있으면 부분점유로 표기.
  const bkRows = await env.DB.prepare(
    `SELECT check_in, check_out, booking_unit FROM hk_bookings
     WHERE room_type_id = ? AND status IN ${HK_ACTIVE_STATUSES} AND check_in < ? AND check_out >= ?`
  ).bind(roomTypeId, to, from).all();
  const bookings = bkRows.results || [];
  return hkNights(from, to).map((date) => {
    const ov = ovMap[date] || {};
    const qty = ov.qty_override != null ? ov.qty_override : rt.quantity;
    const closed = ov.closed ? 1 : 0;
    let dayOcc = 0;
    for (const b of bookings) {
      const u = b.booking_unit;
      // 시간제 예약도 그 날 객실 1유닛을 점유 → 숙박 재고에서 차감(보수적, 더블부킹 방지).
      if (u === "hourly") { if (b.check_in === date) dayOcc += 1; }
      else if (b.check_in <= date && date < b.check_out) dayOcc += 1; // nightly/daily 범위 점유
    }
    const price = stay ? hkNightlyPrice(rt, date, rules, priceOvMap) : null;
    return { date, qty, booked: dayOcc, remaining: closed ? 0 : Math.max(0, qty - dayOcc), closed: !!closed, price };
  });
};

// 1박 요금 결정 — price_override > rate rule(priority) > weekend > base.
const hkNightlyPrice = (rt, dateStr, rules, priceOvMap) => {
  if (priceOvMap[dateStr] != null) return priceOvMap[dateStr];
  const dow = new Date(dateStr + "T00:00:00Z").getUTCDay(); // 0=일..6=토
  let price = null, bestPri = -Infinity;
  for (const r of rules) {
    if (!r.active) continue;
    let applies = false;
    if (r.kind === "dow") { applies = safeJson(r.dow_json, []).includes(dow); }
    else if (r.start_date && r.end_date) { applies = dateStr >= r.start_date && dateStr <= r.end_date; }
    if (applies && r.price != null && r.priority >= bestPri) { price = r.price; bestPri = r.priority; }
  }
  if (price != null) return price;
  if ((dow === 5 || dow === 6) && rt.weekend_price != null) return rt.weekend_price;
  // v00.271 — 숙박 1박 요금 기준은 daily_price. 없으면 legacy base_price.
  return rt.daily_price != null ? rt.daily_price : rt.base_price;
};

// 쿠폰 적용 — { discount, label, error }.
const hkApplyCoupon = async (env, couponCode, baseAmount) => {
  if (!couponCode) return { discount: 0, label: "", error: "" };
  const c = await env.DB.prepare("SELECT * FROM hk_coupons WHERE code = ? AND active = 1").bind(String(couponCode).trim().toUpperCase()).first();
  const today = nowIso().slice(0, 10);
  if (!c) return { discount: 0, label: "", error: "유효하지 않은 쿠폰입니다." };
  if (c.starts_at && today < c.starts_at.slice(0, 10)) return { discount: 0, label: "", error: "아직 사용할 수 없는 쿠폰입니다." };
  if (c.expires_at && today > c.expires_at.slice(0, 10)) return { discount: 0, label: "", error: "만료된 쿠폰입니다." };
  if (baseAmount < (c.min_amount || 0)) return { discount: 0, label: "", error: `최소 ${c.min_amount}원 이상부터 사용 가능합니다.` };
  const discount = c.kind === "amount" ? Math.min(baseAmount, c.value) : Math.round(baseAmount * (c.value || 0) / 100);
  return { discount, label: c.label || c.code, error: "" };
};

// 회원 할인율(%) — site_content_kv.hangyeon.memberDiscount. 로그인 예약 시 적용.
const hkMemberDiscount = async (env) => {
  try {
    const row = await env.DB.prepare("SELECT data_json FROM site_content_kv WHERE section = 'hangyeon'").first();
    if (!row) return 0;
    const v = Number(JSON.parse(row.data_json || "{}").memberDiscount);
    return isNaN(v) ? 0 : Math.max(0, Math.min(100, v));
  } catch { return 0; }
};

// 시간당 견적 — date + start('HH:00') + hours(>=min_hours). 가격 = hourly_price × hours.
const hkComputeHourly = async (env, body, isMember) => {
  const date = body.checkIn || body.date;
  const guests = Math.max(1, Number(body.guests) || 1);
  const hours = Math.max(1, Number(body.hours) || 0);
  const startH = body.slotStart ? parseInt(body.slotStart.slice(0, 2), 10) : NaN;
  if (!hkIsValidDate(date)) return { ok: false, reason: "날짜를 선택해 주세요." };
  const rtRow = await env.DB.prepare("SELECT * FROM hk_room_types WHERE id = ?").bind(body.roomTypeId).first();
  if (!rtRow) return { ok: false, reason: "객실을 찾을 수 없습니다." };
  if (rtRow.status !== "active") return { ok: false, reason: "현재 판매하지 않는 객실입니다." };
  if (!rtRow.hourly_enabled) return { ok: false, reason: "시간제 예약이 불가한 객실입니다." };
  const minH = rtRow.min_hours || 3;
  if (isNaN(startH)) return { ok: false, reason: "시작 시간을 선택해 주세요." };
  if (hours < minH) return { ok: false, reason: `시간제는 최소 ${minH}시간부터 예약 가능합니다.` };
  if (guests > rtRow.max_occupancy) return { ok: false, reason: `최대 ${rtRow.max_occupancy}명까지 가능합니다.` };
  const ha = await hkHourRemaining(env, hkMapRoomType(rtRow), date);
  const endH = startH + hours;
  if (endH > ha.closeH) return { ok: false, reason: "운영 종료 시간을 초과합니다." };
  for (let h = startH; h < endH; h++) {
    const slot = ha.hours.find((x) => x.hour === hkHM(h));
    if (!slot || slot.remaining < 1) return { ok: false, reason: `${hkHM(h)} 시간대 예약이 불가합니다.` };
  }
  const unitPrice = rtRow.hourly_price || 0;
  const subtotal = unitPrice * hours;
  const cp = await hkApplyCoupon(env, body.couponCode, subtotal);
  const afterCoupon = Math.max(0, subtotal - cp.discount);
  const md = isMember ? await hkMemberDiscount(env) : 0;
  const memberDiscount = md > 0 ? Math.round(afterCoupon * md / 100) : 0;
  const total = Math.max(0, afterCoupon - memberDiscount);
  return {
    ok: true, type: "hourly", unitType: "hourly", roomTypeId: body.roomTypeId, roomTypeName: rtRow.name,
    date, slotStart: hkHM(startH), slotEnd: hkHM(endH), hours, guests, unitPrice, subtotal,
    stayDiscount: 0, stayLabel: "", couponDiscount: cp.discount, couponLabel: cp.label, couponError: cp.error,
    memberDiscount, memberRate: md, total, nights: 0,
  };
};

// 하루(전일) 견적 — date. 가격 = daily_price.
// 예약 삽입 직후 더블부킹 재검증 (D1 트랜잭션/락 부재 보완). 점유가 수량을 넘으면 true.
const hkConflict = async (env, roomTypeId, unit, checkIn, checkOut, slotStart, slotEnd) => {
  const rtRow = await env.DB.prepare("SELECT * FROM hk_room_types WHERE id = ?").bind(roomTypeId).first();
  if (!rtRow) return false;
  if (unit === "hourly") {
    if (!slotStart || !slotEnd) return false;
    const ha = await hkHourRemaining(env, hkMapRoomType(rtRow), checkIn);
    const sH = parseInt(slotStart.slice(0, 2), 10), eH = parseInt(slotEnd.slice(0, 2), 10);
    return ha.hours.some((x) => { const h = parseInt(x.hour.slice(0, 2), 10); return h >= sH && h < eH && x.occ > ha.units; });
  }
  const av = await hkRoomAvailability(env, roomTypeId, checkIn, checkOut);
  return av.some((a) => a.booked > a.qty);
};

// 숙박 견적 — 박별 요금 + 연박할인 + 쿠폰. ok=false 면 reason 반환.
const hkComputeStay = async (env, roomTypeId, checkIn, checkOut, rooms, couponCode, isMember) => {
  if (!hkIsValidDate(checkIn) || !hkIsValidDate(checkOut)) return { ok: false, reason: "날짜 형식이 올바르지 않습니다." };
  if (checkOut <= checkIn) return { ok: false, reason: "체크아웃은 체크인보다 뒤여야 합니다." };
  const rtRow = await env.DB.prepare("SELECT * FROM hk_room_types WHERE id = ?").bind(roomTypeId).first();
  if (!rtRow) return { ok: false, reason: "객실을 찾을 수 없습니다." };
  if (rtRow.status !== "active") return { ok: false, reason: "현재 판매하지 않는 객실입니다." };
  if (!rtRow.daily_enabled) return { ok: false, reason: "숙박 예약이 불가한 객실입니다." };
  const rt = hkMapRoomType(rtRow);
  const nightsArr = hkNights(checkIn, checkOut);
  const nights = nightsArr.length;
  const roomCount = Math.max(1, Number(rooms) || 1);
  if (nights < rt.minNights) return { ok: false, reason: `최소 ${rt.minNights}박부터 예약 가능합니다.` };
  if (nights > rt.maxNights) return { ok: false, reason: `최대 ${rt.maxNights}박까지 예약 가능합니다.` };
  // 재고 체크
  const avail = await hkRoomAvailability(env, roomTypeId, checkIn, checkOut);
  for (const a of avail) {
    if (a.closed) return { ok: false, reason: `${a.date} 은(는) 판매하지 않습니다.` };
    if (a.remaining < roomCount) return { ok: false, reason: `${a.date} 객실이 부족합니다 (잔여 ${a.remaining}).` };
  }
  // 요금
  const ruleRows = await env.DB.prepare(
    "SELECT * FROM hk_rate_rules WHERE active = 1 AND (room_type_id = ? OR room_type_id IS NULL)"
  ).bind(roomTypeId).all();
  const rules = ruleRows.results || [];
  const ovRows = await env.DB.prepare(
    "SELECT date, price_override FROM hk_availability WHERE room_type_id = ? AND date >= ? AND date < ?"
  ).bind(roomTypeId, checkIn, checkOut).all();
  const priceOvMap = {};
  for (const o of (ovRows.results || [])) if (o.price_override != null) priceOvMap[o.date] = o.price_override;
  const perNight = nightsArr.map((date) => ({ date, price: hkNightlyPrice(rtRow, date, rules, priceOvMap) }));
  const oneRoom = perNight.reduce((s, n) => s + (n.price || 0), 0);
  const subtotal = oneRoom * roomCount;
  // 연박/장기 할인
  let stayDiscount = 0, stayLabel = "";
  const discs = (rt.discounts || []).filter((d) => Number(d.minNights) <= nights).sort((a, b) => Number(b.minNights) - Number(a.minNights));
  if (discs.length) { stayDiscount = Math.round(subtotal * (Number(discs[0].percent) || 0) / 100); stayLabel = discs[0].label || `${discs[0].minNights}박 이상 할인`; }
  // 쿠폰
  let couponDiscount = 0, couponLabel = "", couponError = "";
  const afterStay = subtotal - stayDiscount;
  if (couponCode) {
    const c = await env.DB.prepare("SELECT * FROM hk_coupons WHERE code = ? AND active = 1").bind(String(couponCode).trim().toUpperCase()).first();
    const today = nowIso().slice(0, 10);
    if (!c) couponError = "유효하지 않은 쿠폰입니다.";
    else if (c.starts_at && today < c.starts_at.slice(0, 10)) couponError = "아직 사용할 수 없는 쿠폰입니다.";
    else if (c.expires_at && today > c.expires_at.slice(0, 10)) couponError = "만료된 쿠폰입니다.";
    else if (afterStay < (c.min_amount || 0)) couponError = `최소 ${c.min_amount}원 이상부터 사용 가능합니다.`;
    else {
      couponDiscount = c.kind === "amount" ? Math.min(afterStay, c.value) : Math.round(afterStay * (c.value || 0) / 100);
      couponLabel = c.label || c.code;
    }
  }
  const afterDisc = Math.max(0, subtotal - stayDiscount - couponDiscount);
  const md = isMember ? await hkMemberDiscount(env) : 0;
  const memberDiscount = md > 0 ? Math.round(afterDisc * md / 100) : 0;
  const total = Math.max(0, afterDisc - memberDiscount);
  return {
    ok: true, type: "nightly", unitType: "nightly", roomTypeId, roomTypeName: rt.name,
    checkIn, checkOut, nights, rooms: roomCount,
    perNight, subtotal, stayDiscount, stayLabel, couponDiscount, couponLabel, couponError,
    memberDiscount, memberRate: md, total,
  };
};

// ── 공개/사용자 ──
const handleHkRoomTypesList = async (req, env) => {
  const url = new URL(req.url);
  const includeAll = url.searchParams.get("includeAll") === "1";
  let user = null; try { user = await getCurrentUser(req, env); } catch {}
  const all = includeAll && user?.isAdmin;
  const { results } = await env.DB.prepare(
    `SELECT * FROM hk_room_types ${all ? "" : "WHERE status = 'active'"} ORDER BY sort_order ASC, created_at ASC`
  ).all();
  return { roomTypes: (results || []).map(hkMapRoomType) };
};

const handleHkAvailability = async (req, env) => {
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const roomTypeId = url.searchParams.get("roomTypeId");
  if (!hkIsValidDate(from) || !hkIsValidDate(to) || to <= from) throw new HttpError(400, "from/to 날짜가 올바르지 않습니다.");
  if (hkNights(from, to).length > 92) throw new HttpError(400, "조회 범위는 최대 92일입니다.");
  let rts;
  if (roomTypeId) {
    const r = await env.DB.prepare("SELECT id, name FROM hk_room_types WHERE id = ?").bind(roomTypeId).first();
    rts = r ? [r] : [];
  } else {
    const { results } = await env.DB.prepare("SELECT id, name FROM hk_room_types WHERE status = 'active' ORDER BY sort_order ASC").all();
    rts = results || [];
  }
  const out = {};
  for (const rt of rts) out[rt.id] = await hkRoomAvailability(env, rt.id, from, to);
  return { from, to, availability: out };
};

// 이용 단위별 견적 라우팅 (hourly | nightly 범위). isMember=로그인 회원이면 회원가 적용.
const hkQuoteFor = async (env, body, isMember) => {
  if (body.unit === "hourly") return await hkComputeHourly(env, body, isMember);
  return await hkComputeStay(env, body.roomTypeId, body.checkIn, body.checkOut, body.rooms, body.couponCode, isMember);
};

// 객실+날짜 시간대별 잔여 + 하루 가능 여부 (예약 모달용).
const handleHkSlots = async (req, env) => {
  const url = new URL(req.url);
  const roomTypeId = url.searchParams.get("roomTypeId");
  const date = url.searchParams.get("date");
  if (!roomTypeId || !hkIsValidDate(date)) throw new HttpError(400, "roomTypeId/date 필요");
  const rtRow = await env.DB.prepare("SELECT * FROM hk_room_types WHERE id = ?").bind(roomTypeId).first();
  if (!rtRow) throw new HttpError(404, "객실을 찾을 수 없습니다.");
  const rt = hkMapRoomType(rtRow);
  const ha = await hkHourRemaining(env, rt, date);
  return {
    date, open: rt.openTime, close: rt.closeTime, minHours: rt.minHours,
    hourlyEnabled: rt.hourlyEnabled, hourlyPrice: rt.hourlyPrice,
    dailyEnabled: rt.dailyEnabled, dailyPrice: rt.dailyPrice, dailyRemaining: ha.dailyRemaining,
    hours: ha.hours,
  };
};

// 선택 기간(체크인~체크아웃)의 예약 가능 객실 목록.
const handleHkDay = async (req, env) => {
  const url = new URL(req.url);
  const from = url.searchParams.get("from") || url.searchParams.get("date");
  const to = url.searchParams.get("to") || (hkIsValidDate(from) ? hkAddDays(from, 1) : null);
  if (!hkIsValidDate(from) || !hkIsValidDate(to)) throw new HttpError(400, "from/to 필요");
  const nights = Math.max(1, hkNights(from, to).length);
  const { results } = await env.DB.prepare("SELECT * FROM hk_room_types WHERE status = 'active' ORDER BY sort_order ASC, created_at ASC").all();
  const rooms = [];
  for (const r of (results || [])) {
    const rt = hkMapRoomType(r);
    // 숙박: 기간 견적으로 가능여부 + 총액
    let stayAvailable = false, stayTotal = 0;
    if (rt.dailyEnabled) {
      const q = await hkComputeStay(env, rt.id, from, to, 1, null);
      stayAvailable = !!q.ok; stayTotal = q.ok ? q.total : 0;
    }
    // 시간제: 체크인 당일 가능여부
    let hourlyAvailable = false;
    if (rt.hourlyEnabled) { const ha = await hkHourRemaining(env, rt, from); hourlyAvailable = ha.hours.some((h) => h.remaining >= 1); }
    rooms.push({ ...rt, nights, stayAvailable, stayTotal, dayHourlyAvailable: hourlyAvailable, dayDailyAvailable: stayAvailable });
  }
  return { from, to, nights, rooms };
};

const handleHkQuote = async (req, env) => {
  const body = await req.json().catch(() => ({}));
  let user = null; try { user = await getCurrentUser(req, env); } catch {}
  return await hkQuoteFor(env, body, !!user);
};

const handleHkBookingCreate = async (req, env) => {
  const body = await req.json().catch(() => ({}));
  let user = null; try { user = await getCurrentUser(req, env); } catch {}
  const name = String(body.name || user?.name || "").trim();
  const email = String(body.email || user?.email || "").trim();
  const phone = String(body.phone || "").trim();
  if (!name || (!email && !phone)) throw new HttpError(400, "이름과 연락처(이메일 또는 전화)를 입력해 주세요.");
  // 블랙리스트 차단
  const gkey = hkGuestKey(phone, email);
  if (gkey) {
    const g = await env.DB.prepare("SELECT blacklist FROM hk_guests WHERE id = ?").bind(gkey).first();
    if (g && g.blacklist) throw new HttpError(403, "예약이 제한된 고객입니다. 숙소로 문의해 주세요.");
  }
  const q = await hkQuoteFor(env, body, !!user);
  if (!q.ok) throw new HttpError(409, q.reason);
  const unit = q.unitType || "nightly"; // hourly | nightly
  const isHourly = unit === "hourly";
  const id = randomId("hkb");
  const code = "HK-" + randomId("").slice(0, 6).toUpperCase();
  const guests = Math.max(1, Number(body.guests) || 1);
  const rooms = isHourly ? 1 : Math.max(1, Number(body.rooms) || 1);
  const checkIn = isHourly ? q.date : body.checkIn;
  const checkOut = isHourly ? q.date : body.checkOut;
  await env.DB.prepare(
    `INSERT INTO hk_bookings (id, code, room_type_id, user_id, guest_name, guest_email, guest_phone,
       check_in, check_out, nights, rooms, guests, total_price, coupon_code, status, payment_status, guest_request, cash_receipt, slot_start, slot_end, booking_unit)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid', ?, ?, ?, ?, ?)`
  ).bind(id, code, body.roomTypeId, user?.id || null, name, email, phone,
    checkIn, checkOut, q.nights, rooms, guests, q.total,
    q.couponDiscount > 0 ? String(body.couponCode || "").trim().toUpperCase() : null,
    String(body.request || "").slice(0, 1000), String(body.cashReceipt || ""),
    isHourly ? q.slotStart : null, isHourly ? q.slotEnd : null, unit).run();
  // 트랜잭션 부재 보완 — 삽입 직후 재검증해 동시예약 더블부킹이면 롤백(삭제).
  if (await hkConflict(env, body.roomTypeId, unit, checkIn, checkOut, q.slotStart, q.slotEnd)) {
    await env.DB.prepare("DELETE FROM hk_bookings WHERE id = ?").bind(id).run();
    throw new HttpError(409, "방금 다른 예약이 접수되어 마감되었습니다. 다른 날짜·시간을 선택해 주세요.");
  }
  const detail = isHourly ? `${q.date} ${q.slotStart}~${q.slotEnd} (${q.hours}시간) / ${q.total}원`
    : `${q.nights}박 ${rooms}실 / ${q.total}원`;
  await hkLog(env, id, "created", detail, user?.id ? (user.email || "guest") : "guest");
  // 고객 upsert
  if (gkey) {
    await env.DB.prepare(
      `INSERT INTO hk_guests (id, name, email, phone) VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, email = excluded.email, phone = excluded.phone, updated_at = excluded.created_at`
    ).bind(gkey, name, email, phone).run();
  }
  // 관리자 알림
  try {
    const admins = await env.DB.prepare("SELECT id FROM users WHERE grade_id = 'admin'").all();
    for (const a of (admins.results || [])) {
      await insertNotification(env, { userId: a.id, type: "hangyeon_new", message: `새 한켠 예약: ${q.roomTypeName} ${isHourly ? q.date + " " + q.slotStart : body.checkIn + "~" + body.checkOut}`, fromName: name });
    }
  } catch {}
  return { ok: true, booking: { id, code, status: "pending", total: q.total, nights: q.nights } };
};

const hkLog = async (env, bookingId, action, detail, actor) => {
  try {
    await env.DB.prepare(
      "INSERT INTO hk_booking_log (id, booking_id, action, detail, actor) VALUES (?, ?, ?, ?, ?)"
    ).bind(randomId("hkl"), bookingId, action || "", detail || "", actor || "").run();
  } catch {}
};

const hkMapBooking = (r) => ({
  id: r.id, code: r.code, roomTypeId: r.room_type_id, roomTypeName: r.room_type_name || "",
  userId: r.user_id, name: r.guest_name, email: r.guest_email, phone: r.guest_phone,
  checkIn: r.check_in, checkOut: r.check_out, nights: r.nights, rooms: r.rooms, guests: r.guests,
  totalPrice: r.total_price, couponCode: r.coupon_code, status: r.status,
  paymentStatus: r.payment_status, paidAmount: r.paid_amount, memo: r.memo || "", guestRequest: r.guest_request || "",
  roomAssignment: r.room_assignment || "", housekeeping: r.housekeeping || "", cashReceipt: r.cash_receipt || "",
  slotStart: r.slot_start || "", slotEnd: r.slot_end || "", bookingUnit: r.booking_unit || (r.slot_start ? "hourly" : "nightly"),
  createdAt: r.created_at, updatedAt: r.updated_at, cancelledAt: r.cancelled_at,
  checkedInAt: r.checked_in_at, checkedOutAt: r.checked_out_at,
});

const handleHkMyBookings = async (req, env) => {
  const user = await requireUser(req, env);
  const { results } = await env.DB.prepare(
    `SELECT b.*, rt.name AS room_type_name FROM hk_bookings b LEFT JOIN hk_room_types rt ON rt.id = b.room_type_id
     WHERE b.user_id = ? ORDER BY b.created_at DESC`
  ).bind(user.id).all();
  return { bookings: (results || []).map(hkMapBooking) };
};

const handleHkBookingCancel = async (req, env, id) => {
  const user = await requireUser(req, env);
  const row = await env.DB.prepare("SELECT id, user_id, status FROM hk_bookings WHERE id = ?").bind(id).first();
  if (!row) throw new HttpError(404, "예약을 찾을 수 없습니다.");
  if (!user.isAdmin && row.user_id !== user.id) throw new HttpError(403, "본인 예약만 취소할 수 있습니다.");
  if (["checked_in", "checked_out"].includes(row.status)) throw new HttpError(409, "이미 체크인된 예약은 취소할 수 없습니다.");
  await env.DB.prepare("UPDATE hk_bookings SET status = 'cancelled', cancelled_at = ?, updated_at = ? WHERE id = ?").bind(nowIso(), nowIso(), id).run();
  await hkLog(env, id, "cancel", "예약 취소", user.isAdmin ? (user.email || "admin") : "guest");
  return { ok: true };
};

// ── 관리자: 객실 타입 ──
const handleHkRoomTypeCreate = async (req, env) => {
  const admin = await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const id = b.id || randomId("hkrt");
  await env.DB.prepare(
    `INSERT INTO hk_room_types (id, name, description, images_json, quantity, max_occupancy, bed_config, amenities_json,
       base_price, weekend_price, discounts_json, min_nights, max_nights, status, sort_order, updated_at,
       booking_type, open_time, close_time, slot_minutes,
       hourly_enabled, hourly_price, min_hours, daily_enabled, daily_price)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, b.name || "새 객실", b.description || "", JSON.stringify(b.images || []),
    Math.max(0, Number(b.quantity) || 1), Math.max(1, Number(b.maxOccupancy) || 2), b.bedConfig || "",
    JSON.stringify(b.amenities || []), Math.max(0, Number(b.basePrice) || 0),
    b.weekendPrice != null && b.weekendPrice !== "" ? Math.max(0, Number(b.weekendPrice)) : null,
    JSON.stringify(b.discounts || []), Math.max(1, Number(b.minNights) || 1), Math.max(1, Number(b.maxNights) || 30),
    b.status === "inactive" ? "inactive" : "active", Number(b.sortOrder) || 0, nowIso(),
    b.bookingType === "timeslot" ? "timeslot" : "nightly", b.openTime || "09:00", b.closeTime || "22:00", Math.max(15, Number(b.slotMinutes) || 60),
    b.hourlyEnabled ? 1 : 0, b.hourlyPrice != null && b.hourlyPrice !== "" ? Math.max(0, Number(b.hourlyPrice)) : null, Math.max(1, Number(b.minHours) || 3),
    b.dailyEnabled ? 1 : 0, b.dailyPrice != null && b.dailyPrice !== "" ? Math.max(0, Number(b.dailyPrice)) : null).run();
  await auditWrite(env, admin.email, "hangyeon.roomType.create", `hkrt:${id}`);
  return { id };
};
const handleHkRoomTypePatch = async (req, env, id) => {
  await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const map = {
    name: "name", description: "description", quantity: "quantity", maxOccupancy: "max_occupancy",
    bedConfig: "bed_config", basePrice: "base_price", weekendPrice: "weekend_price",
    minNights: "min_nights", maxNights: "max_nights", status: "status", sortOrder: "sort_order",
    bookingType: "booking_type", openTime: "open_time", closeTime: "close_time", slotMinutes: "slot_minutes",
    hourlyEnabled: "hourly_enabled", hourlyPrice: "hourly_price", minHours: "min_hours", dailyEnabled: "daily_enabled", dailyPrice: "daily_price",
  };
  const sets = [], args = [];
  for (const k in map) if (k in b) {
    let v = b[k];
    if (k === "weekendPrice" || k === "hourlyPrice" || k === "dailyPrice") v = (v === "" || v == null) ? null : Math.max(0, Number(v));
    if (k === "openTime" || k === "closeTime") v = v || null;
    if (k === "slotMinutes") v = Math.max(15, Number(v) || 60);
    if (k === "minHours") v = Math.max(1, Number(v) || 3);
    if (k === "hourlyEnabled" || k === "dailyEnabled") v = v ? 1 : 0;
    sets.push(`${map[k]} = ?`); args.push(v);
  }
  if ("images" in b) { sets.push("images_json = ?"); args.push(JSON.stringify(b.images || [])); }
  if ("amenities" in b) { sets.push("amenities_json = ?"); args.push(JSON.stringify(b.amenities || [])); }
  if ("discounts" in b) { sets.push("discounts_json = ?"); args.push(JSON.stringify(b.discounts || [])); }
  sets.push("updated_at = ?"); args.push(nowIso());
  args.push(id);
  await env.DB.prepare(`UPDATE hk_room_types SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  return { ok: true };
};
const handleHkRoomTypeDelete = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM hk_room_types WHERE id = ?").bind(id).run();
  await auditWrite(env, admin.email, "hangyeon.roomType.delete", `hkrt:${id}`);
  return { ok: true };
};

// ── 관리자: 요금 규칙 ──
const handleHkRateRulesList = async (req, env) => {
  await requireAdmin(req, env);
  const { results } = await env.DB.prepare("SELECT * FROM hk_rate_rules ORDER BY priority DESC, created_at DESC").all();
  return { rules: (results || []).map((r) => ({ id: r.id, roomTypeId: r.room_type_id, kind: r.kind, label: r.label, startDate: r.start_date, endDate: r.end_date, dow: safeJson(r.dow_json, []), price: r.price, priority: r.priority, active: !!r.active })) };
};
const handleHkRateRuleCreate = async (req, env) => {
  await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const id = randomId("hkrr");
  await env.DB.prepare(
    `INSERT INTO hk_rate_rules (id, room_type_id, kind, label, start_date, end_date, dow_json, price, priority, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, b.roomTypeId || null, b.kind || "season", b.label || "", b.startDate || null, b.endDate || null,
    JSON.stringify(b.dow || []), b.price != null ? Number(b.price) : null, Number(b.priority) || 0, b.active === false ? 0 : 1).run();
  return { id };
};
const handleHkRateRulePatch = async (req, env, id) => {
  await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const map = { roomTypeId: "room_type_id", kind: "kind", label: "label", startDate: "start_date", endDate: "end_date", price: "price", priority: "priority" };
  const sets = [], args = [];
  for (const k in map) if (k in b) { sets.push(`${map[k]} = ?`); args.push(b[k] === "" ? null : b[k]); }
  if ("dow" in b) { sets.push("dow_json = ?"); args.push(JSON.stringify(b.dow || [])); }
  if ("active" in b) { sets.push("active = ?"); args.push(b.active ? 1 : 0); }
  if (!sets.length) return { ok: true };
  args.push(id);
  await env.DB.prepare(`UPDATE hk_rate_rules SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  return { ok: true };
};
const handleHkRateRuleDelete = async (req, env, id) => {
  await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM hk_rate_rules WHERE id = ?").bind(id).run();
  return { ok: true };
};

// ── 관리자: 쿠폰 ──
const handleHkCouponsList = async (req, env) => {
  await requireAdmin(req, env);
  const { results } = await env.DB.prepare("SELECT * FROM hk_coupons ORDER BY created_at DESC").all();
  return { coupons: (results || []).map((c) => ({ code: c.code, label: c.label, kind: c.kind, value: c.value, minAmount: c.min_amount, startsAt: c.starts_at, expiresAt: c.expires_at, active: !!c.active })) };
};
const handleHkCouponUpsert = async (req, env) => {
  await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const code = String(b.code || "").trim().toUpperCase();
  if (!code) throw new HttpError(400, "쿠폰 코드를 입력해 주세요.");
  await env.DB.prepare(
    `INSERT INTO hk_coupons (code, label, kind, value, min_amount, starts_at, expires_at, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(code) DO UPDATE SET label=excluded.label, kind=excluded.kind, value=excluded.value,
       min_amount=excluded.min_amount, starts_at=excluded.starts_at, expires_at=excluded.expires_at, active=excluded.active`
  ).bind(code, b.label || "", b.kind === "amount" ? "amount" : "percent", Math.max(0, Number(b.value) || 0),
    Math.max(0, Number(b.minAmount) || 0), b.startsAt || null, b.expiresAt || null, b.active === false ? 0 : 1).run();
  return { code };
};
const handleHkCouponDelete = async (req, env, code) => {
  await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM hk_coupons WHERE code = ?").bind(String(code).toUpperCase()).run();
  return { ok: true };
};

// ── 관리자: 재고/판매 오버라이드 (단건 + 범위 일괄) ──
const handleHkAvailabilitySet = async (req, env) => {
  await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const roomTypeId = b.roomTypeId;
  if (!roomTypeId) throw new HttpError(400, "roomTypeId 필요");
  const from = b.from || b.date;
  const to = b.to || b.date;
  if (!hkIsValidDate(from) || !hkIsValidDate(to)) throw new HttpError(400, "날짜 형식 오류");
  const dates = b.to && b.to !== b.from ? hkNights(from, new Date(new Date(to + "T00:00:00Z").getTime() + 86400000).toISOString().slice(0, 10)) : [from];
  for (const date of dates) {
    await env.DB.prepare(
      `INSERT INTO hk_availability (id, room_type_id, date, closed, qty_override, price_override, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(room_type_id, date) DO UPDATE SET closed=excluded.closed, qty_override=excluded.qty_override, price_override=excluded.price_override, note=excluded.note`
    ).bind(randomId("hka"), roomTypeId, date, b.closed ? 1 : 0,
      b.qtyOverride === "" || b.qtyOverride == null ? null : Number(b.qtyOverride),
      b.priceOverride === "" || b.priceOverride == null ? null : Number(b.priceOverride), b.note || "").run();
  }
  return { ok: true, count: dates.length };
};

// ── 관리자: 예약 목록/수정/결제/이력 ──
const handleHkBookingsList = async (req, env) => {
  await requireAdmin(req, env);
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const where = [], args = [];
  if (status) { where.push("b.status = ?"); args.push(status); }
  if (hkIsValidDate(from)) { where.push("b.check_out > ?"); args.push(from); }
  if (hkIsValidDate(to)) { where.push("b.check_in < ?"); args.push(to); }
  const { results } = await env.DB.prepare(
    `SELECT b.*, rt.name AS room_type_name FROM hk_bookings b LEFT JOIN hk_room_types rt ON rt.id = b.room_type_id
     ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY b.check_in ASC, b.created_at DESC LIMIT 500`
  ).bind(...args).all();
  return { bookings: (results || []).map(hkMapBooking) };
};
const handleHkBookingPatch = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const before = await env.DB.prepare("SELECT * FROM hk_bookings WHERE id = ?").bind(id).first();
  if (!before) throw new HttpError(404, "예약을 찾을 수 없습니다.");
  const map = { status: "status", paymentStatus: "payment_status", paidAmount: "paid_amount", memo: "memo", roomAssignment: "room_assignment", housekeeping: "housekeeping", guestRequest: "guest_request" };
  const sets = [], args = [];
  for (const k in map) if (k in b) { sets.push(`${map[k]} = ?`); args.push(b[k]); }
  if (b.status === "checked_in" && before.status !== "checked_in") { sets.push("checked_in_at = ?"); args.push(nowIso()); }
  if (b.status === "checked_out" && before.status !== "checked_out") {
    sets.push("checked_out_at = ?"); args.push(nowIso());
    // 방문 횟수 +1
    const gkey = hkGuestKey(before.guest_phone, before.guest_email);
    if (gkey) { try { await env.DB.prepare("UPDATE hk_guests SET visits = visits + 1, updated_at = ? WHERE id = ?").bind(nowIso(), gkey).run(); } catch {} }
  }
  if (b.status === "cancelled" && before.status !== "cancelled") { sets.push("cancelled_at = ?"); args.push(nowIso()); }
  sets.push("updated_at = ?"); args.push(nowIso());
  args.push(id);
  await env.DB.prepare(`UPDATE hk_bookings SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  if (b.status && b.status !== before.status) {
    await hkLog(env, id, "status", `${before.status} → ${b.status}`, admin.email);
    if (before.user_id) {
      const msgMap = { confirmed: "한켠 예약이 확정되었습니다.", cancelled: "한켠 예약이 취소되었습니다.", checked_in: "체크인 처리되었습니다.", checked_out: "체크아웃 처리되었습니다. 이용해 주셔서 감사합니다.", no_show: "예약이 노쇼 처리되었습니다." };
      if (msgMap[b.status]) await insertNotification(env, { userId: before.user_id, type: "hangyeon_" + b.status, message: msgMap[b.status], fromName: "한켠" });
    }
  }
  if ("memo" in b && b.memo !== before.memo) await hkLog(env, id, "memo", "메모 수정", admin.email);
  return { ok: true };
};
const handleHkBookingLog = async (req, env, id) => {
  await requireAdmin(req, env);
  const { results } = await env.DB.prepare("SELECT * FROM hk_booking_log WHERE booking_id = ? ORDER BY created_at DESC").bind(id).all();
  return { log: (results || []).map((r) => ({ id: r.id, action: r.action, detail: r.detail, actor: r.actor, createdAt: r.created_at })) };
};
const handleHkPaymentAdd = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const booking = await env.DB.prepare("SELECT total_price, paid_amount FROM hk_bookings WHERE id = ?").bind(id).first();
  if (!booking) throw new HttpError(404, "예약을 찾을 수 없습니다.");
  const amount = Number(b.amount) || 0;
  if (!amount) throw new HttpError(400, "금액을 입력해 주세요.");
  const kind = amount < 0 ? "refund" : "payment";
  await env.DB.prepare(
    "INSERT INTO hk_payments (id, booking_id, amount, method, kind, memo, actor) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(randomId("hkp"), id, amount, b.method || "bank", kind, b.memo || "", admin.email).run();
  const paid = Math.max(0, (booking.paid_amount || 0) + amount);
  let pstatus = "unpaid";
  if (paid <= 0) pstatus = "unpaid";
  else if (paid >= (booking.total_price || 0)) pstatus = "paid";
  else pstatus = "partial";
  // 환불로 0 미만 의도 → refunded 표기
  const anyRefund = await env.DB.prepare("SELECT COUNT(*) AS c FROM hk_payments WHERE booking_id = ? AND kind = 'refund'").bind(id).first();
  if (paid <= 0 && Number(anyRefund?.c || 0) > 0) pstatus = "refunded";
  await env.DB.prepare("UPDATE hk_bookings SET paid_amount = ?, payment_status = ?, updated_at = ? WHERE id = ?").bind(paid, pstatus, nowIso(), id).run();
  await hkLog(env, id, "payment", `${kind === "refund" ? "환불" : "입금"} ${amount}원 (누적 ${paid})`, admin.email);
  return { ok: true, paidAmount: paid, paymentStatus: pstatus };
};
const handleHkPaymentsList = async (req, env, id) => {
  await requireAdmin(req, env);
  const { results } = await env.DB.prepare("SELECT * FROM hk_payments WHERE booking_id = ? ORDER BY created_at DESC").bind(id).all();
  return { payments: (results || []).map((r) => ({ id: r.id, amount: r.amount, method: r.method, kind: r.kind, memo: r.memo, actor: r.actor, createdAt: r.created_at })) };
};

// ── 관리자: 고객 ──
const handleHkGuestsList = async (req, env) => {
  await requireAdmin(req, env);
  const { results } = await env.DB.prepare(
    `SELECT g.*, (SELECT COUNT(*) FROM hk_bookings b WHERE (b.guest_phone != '' AND ('g-' || REPLACE(REPLACE(REPLACE(b.guest_phone,'-',''),' ',''),'+','')) = g.id)) AS booking_count
     FROM hk_guests g ORDER BY g.vip DESC, g.visits DESC, g.updated_at DESC LIMIT 500`
  ).all();
  return { guests: (results || []).map((r) => ({ id: r.id, name: r.name, email: r.email, phone: r.phone, visits: r.visits, vip: !!r.vip, blacklist: !!r.blacklist, note: r.note || "", bookingCount: Number(r.booking_count || 0), createdAt: r.created_at })) };
};
const handleHkGuestPatch = async (req, env, id) => {
  await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const sets = [], args = [];
  if ("vip" in b) { sets.push("vip = ?"); args.push(b.vip ? 1 : 0); }
  if ("blacklist" in b) { sets.push("blacklist = ?"); args.push(b.blacklist ? 1 : 0); }
  if ("note" in b) { sets.push("note = ?"); args.push(b.note || ""); }
  if (!sets.length) return { ok: true };
  sets.push("updated_at = ?"); args.push(nowIso());
  args.push(id);
  await env.DB.prepare(`UPDATE hk_guests SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  return { ok: true };
};

// ── 관리자: 물리 객실 단위 (운영) ──
const handleHkUnitsList = async (req, env) => {
  await requireAdmin(req, env);
  const { results } = await env.DB.prepare(
    `SELECT u.*, rt.name AS room_type_name FROM hk_room_units u LEFT JOIN hk_room_types rt ON rt.id = u.room_type_id ORDER BY rt.sort_order ASC, u.unit_no ASC`
  ).all();
  return { units: (results || []).map((r) => ({ id: r.id, roomTypeId: r.room_type_id, roomTypeName: r.room_type_name || "", unitNo: r.unit_no, status: r.status, note: r.note || "", updatedAt: r.updated_at })) };
};
const handleHkUnitCreate = async (req, env) => {
  await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const id = randomId("hku");
  await env.DB.prepare("INSERT INTO hk_room_units (id, room_type_id, unit_no, status, note, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, b.roomTypeId || null, b.unitNo || "", b.status || "vacant", b.note || "", nowIso()).run();
  return { id };
};
const handleHkUnitPatch = async (req, env, id) => {
  await requireAdmin(req, env);
  const b = await req.json().catch(() => ({}));
  const sets = [], args = [];
  if ("unitNo" in b) { sets.push("unit_no = ?"); args.push(b.unitNo); }
  if ("status" in b) { sets.push("status = ?"); args.push(b.status); }
  if ("note" in b) { sets.push("note = ?"); args.push(b.note || ""); }
  if (!sets.length) return { ok: true };
  sets.push("updated_at = ?"); args.push(nowIso());
  args.push(id);
  await env.DB.prepare(`UPDATE hk_room_units SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  return { ok: true };
};
const handleHkUnitDelete = async (req, env, id) => {
  await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM hk_room_units WHERE id = ?").bind(id).run();
  return { ok: true };
};

// ──────── 라우터 ──────────────────────────────────────────

const route = async (req, env) => {
  const url = new URL(req.url);
  const p = url.pathname.replace(/\/+$/, "") || "/";
  const m = (re) => p.match(re);

  if (p === "/api/health") return json({ ok: true, ts: nowIso() });

  if (req.method === "POST" && p === "/api/auth/signup") {
    const data = await handleAuthSignup(req, env);
    let resp = json({ user: data.user });
    return setSessionCookie(resp, data.token, data.ttl);
  }
  if (req.method === "POST" && p === "/api/auth/login") {
    const data = await handleAuthLogin(req, env);
    let resp = json({ user: data.user });
    return setSessionCookie(resp, data.token, data.ttl);
  }
  if (req.method === "POST" && p === "/api/auth/logout") {
    const data = await handleAuthLogout(req, env);
    return clearSessionCookie(json(data));
  }
  if (req.method === "GET" && p === "/api/auth/me") return json(await handleAuthMe(req, env));
  if (req.method === "PATCH" && p === "/api/me") return json(await handleMePatch(req, env));
  // v00.201 — 본인 비밀번호 변경 (P1 #3).
  if (req.method === "PATCH" && p === "/api/me/password") return json(await handleMePassword(req, env));

  if (req.method === "GET" && p === "/api/posts") return json(await handlePostsList(req, env));
  if (req.method === "POST" && p === "/api/posts") return json(await handlePostsCreate(req, env), { status: 201 });
  let g;
  if ((g = m(/^\/api\/posts\/(\d+)$/))) {
    const id = Number(g[1]);
    if (req.method === "GET") return json(await handlePostGet(req, env, id));
    if (req.method === "PATCH") return json(await handlePostPatch(req, env, id));
    if (req.method === "DELETE") return json(await handlePostDelete(req, env, id));
  }
  if ((g = m(/^\/api\/posts\/(\d+)\/view$/))) {
    if (req.method === "POST") return json(await handlePostView(req, env, g[1]));
  }
  if ((g = m(/^\/api\/posts\/(\d+)\/comments$/))) {
    const id = Number(g[1]);
    if (req.method === "GET") return json(await handleCommentsList(req, env, id));
    if (req.method === "POST") return json(await handleCommentsCreate(req, env, id), { status: 201 });
  }
  if ((g = m(/^\/api\/posts\/(\d+)\/comments\/([\w-]+)$/))) {
    const postId = Number(g[1]);
    const cid = g[2];
    if (req.method === "DELETE") return json(await handleCommentDelete(req, env, postId, cid));
  }

  if (req.method === "GET" && p === "/api/books") {
    const resp = json(await handleBooksList(req, env));
    return _publicCacheable(req) ? _withPublicCache(resp, 60) : resp;
  }
  if (req.method === "POST" && p === "/api/books") return json(await handleBookCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/books\/([\w-]+)$/))) {
    const id = g[1];
    if (req.method === "GET") return json(await handleBookGet(req, env, id));
    if (req.method === "PATCH") return json(await handleBookPatch(req, env, id));
    if (req.method === "DELETE") return json(await handleBookDelete(req, env, id));
  }

  if (req.method === "POST" && p === "/api/media/upload") return json(await handleMediaUpload(req, env));
  if ((g = m(/^\/api\/media\/(.+)$/))) {
    if (req.method === "GET") return await handleMediaGet(req, env, g[1]);
  }

  // v00.148 — page-view 분석.
  if (req.method === "POST" && p === "/api/analytics/page-view") return json(await handlePageViewTrack(req, env));
  if (req.method === "GET" && p === "/api/analytics/summary") return json(await handleAnalyticsSummary(req, env));
  // v00.148 — 사용자 여정 통합 (admin).
  if ((g = m(/^\/api\/admin\/user-journey\/([\w-]+)$/))) {
    if (req.method === "GET") return json(await handleUserJourney(req, env, g[1]));
  }

  // 관리자: 회원
  if (req.method === "GET" && p === "/api/admin/users") return json(await handleAdminUsersList(req, env));
  if ((g = m(/^\/api\/admin\/users\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleAdminUserPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleAdminUserDelete(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/admin/audit") return json(await handleAdminAuditList(req, env));
  // 관리자: 회원 metrics (v00.062) — D1 정확 계산. BGNJ_GRADE_PROMO 가 grade 자격 평가에 사용.
  if ((g = m(/^\/api\/admin\/users\/([\w-]+)\/metrics$/))) {
    if (req.method === "GET") return json(await handleAdminUserMetrics(req, env, g[1]));
  }

  // 강연
  if (req.method === "GET" && p === "/api/lectures") {
    const resp = json(await handleLecturesList(req, env));
    return _publicCacheable(req) ? _withPublicCache(resp, 60) : resp;
  }
  if (req.method === "POST" && p === "/api/lectures") return json(await handleLectureCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/lectures\/([\w-]+)$/))) {
    if (req.method === "GET") return json(await handleLectureGet(req, env, g[1]));
    if (req.method === "PATCH") return json(await handleLecturePatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleLectureDelete(req, env, g[1]));
  }
  if ((g = m(/^\/api\/lectures\/([\w-]+)\/register$/))) {
    if (req.method === "POST") return json(await handleLectureRegister(req, env, g[1]), { status: 201 });
  }
  if ((g = m(/^\/api\/lectures\/([\w-]+)\/reviews$/))) {
    if (req.method === "GET") return json(await handleLectureReviews(req, env, g[1]));
    if (req.method === "POST") return json(await handleLectureReviewCreate(req, env, g[1]), { status: 201 });
  }
  if ((g = m(/^\/api\/lecture-reviews\/([\w-]+)$/))) {
    if (req.method === "DELETE") return json(await handleLectureReviewDelete(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/me/lectures") return json(await handleMyLectures(req, env));
  if ((g = m(/^\/api\/lecture-registrations\/([\w-]+)$/))) {
    if (req.method === "DELETE") return json(await handleLectureRegistrationCancel(req, env, g[1]));
    if (req.method === "PATCH") return json(await handleLectureRegistrationPatch(req, env, g[1]));
  }

  // 투어
  if (req.method === "GET" && p === "/api/tours") {
    const resp = json(await handleToursList(req, env));
    return _publicCacheable(req) ? _withPublicCache(resp, 60) : resp;
  }
  if (req.method === "POST" && p === "/api/tours") return json(await handleTourCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/tours\/([\w-]+)$/))) {
    if (req.method === "GET") return json(await handleTourGet(req, env, g[1]));
    if (req.method === "PATCH") return json(await handleTourPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleTourDelete(req, env, g[1]));
  }
  if ((g = m(/^\/api\/tours\/([\w-]+)\/reserve$/))) {
    if (req.method === "POST") return json(await handleTourReserve(req, env, g[1]), { status: 201 });
  }
  if ((g = m(/^\/api\/tours\/([\w-]+)\/reviews$/))) {
    if (req.method === "GET") return json(await handleTourReviews(req, env, g[1]));
    if (req.method === "POST") return json(await handleTourReviewCreate(req, env, g[1]), { status: 201 });
  }
  if ((g = m(/^\/api\/tour-reviews\/([\w-]+)$/))) {
    if (req.method === "DELETE") return json(await handleTourReviewDelete(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/me/tours") return json(await handleMyTours(req, env));
  if ((g = m(/^\/api\/tour-reservations\/([\w-]+)$/))) {
    if (req.method === "DELETE") return json(await handleTourReservationCancel(req, env, g[1]));
    if (req.method === "PATCH") return json(await handleTourReservationPatch(req, env, g[1]));
  }

  // 책 주문
  if (req.method === "POST" && p === "/api/book-orders") return json(await handleBookOrderCreate(req, env), { status: 201 });
  if (req.method === "GET" && p === "/api/me/orders") return json(await handleMyOrders(req, env));
  if (req.method === "GET" && p === "/api/admin/book-orders") return json(await handleAdminOrdersList(req, env));
  if ((g = m(/^\/api\/book-orders\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleOrderPatch(req, env, g[1]));
    // v00.261 — admin 전용 hard delete (테스트/오발주 청소). audit_log 기록 필수.
    if (req.method === "DELETE") return json(await handleOrderDelete(req, env, g[1]));
  }

  // 책 후기
  if ((g = m(/^\/api\/books\/([\w-]+)\/reviews$/))) {
    if (req.method === "GET") return json(await handleBookReviews(req, env, g[1]));
    if (req.method === "POST") return json(await handleBookReviewCreate(req, env, g[1]), { status: 201 });
  }
  if ((g = m(/^\/api\/book-reviews\/([\w-]+)$/))) {
    if (req.method === "DELETE") return json(await handleBookReviewDelete(req, env, g[1]));
  }

  // 사이트 콘텐츠 / FAQ / 약관 / 입금 계좌 / 카테고리 / 등급 / 감사 로그
  if (req.method === "GET" && p === "/api/site-content") {
    const resp = json(await handleSiteContentGet(req, env));
    return _publicCacheable(req) ? _withPublicCache(resp, 60) : resp;
  }
  if ((g = m(/^\/api\/site-content\/([\w-]+)$/))) {
    if (req.method === "PATCH" || req.method === "PUT") return json(await handleSiteContentPatch(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/faqs") {
    const resp = json(await handleFaqList(req, env));
    return _publicCacheable(req) ? _withPublicCache(resp, 60) : resp;
  }
  if (req.method === "GET" && p === "/api/admin/faqs") return json(await handleFaqAdminList(req, env));
  if (req.method === "POST" && p === "/api/faqs") return json(await handleFaqCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/faqs\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleFaqPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleFaqDelete(req, env, g[1]));
  }
  if ((g = m(/^\/api\/legal\/([\w-]+)$/))) {
    if (req.method === "GET") {
      const resp = json(await handleLegalGet(req, env, g[1]));
      return _publicCacheable(req) ? _withPublicCache(resp, 300) : resp;
    }
    if (req.method === "PUT") return json(await handleLegalPut(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/bank-account") return json(await handleBankAccountGet(req, env));
  if (req.method === "PUT" && p === "/api/bank-account") return json(await handleBankAccountPut(req, env));
  // 멀티 계좌
  if (req.method === "GET" && p === "/api/bank-accounts") return json(await handleBankAccountsList(req, env));
  if (req.method === "POST" && p === "/api/bank-accounts") return json(await handleBankAccountCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/bank-accounts\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleBankAccountPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleBankAccountDelete(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/categories") {
    const resp = json(await handleCategoriesList(req, env));
    return _publicCacheable(req) ? _withPublicCache(resp, 300) : resp;
  }
  if (req.method === "POST" && p === "/api/categories") return json(await handleCategoryCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/categories\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleCategoryPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleCategoryDelete(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/grades") {
    const resp = json(await handleGradesList(req, env));
    return _publicCacheable(req) ? _withPublicCache(resp, 300) : resp;
  }
  if ((g = m(/^\/api\/grades\/([\w-]+)$/))) {
    if (req.method === "PUT") return json(await handleGradeUpsert(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleGradeDelete(req, env, g[1]));
  }
  if (req.method === "POST" && p === "/api/admin/audit") return json(await handleAuditCreate(req, env), { status: 201 });

  // 에러 로그 — 클라이언트의 모든 오류 기록 (POST 는 인증 불요).
  if (req.method === "POST" && p === "/api/error-log") return json(await handleErrorLogCreate(req, env), { status: 201 });
  if (req.method === "GET" && p === "/api/admin/error-log") return json(await handleErrorLogList(req, env));
  if (req.method === "DELETE" && p === "/api/admin/error-log") return json(await handleErrorLogClear(req, env));

  // 사용자 칼럼
  if (req.method === "GET" && p === "/api/columns") {
    const resp = json(await handleColumnsList(req, env));
    return _publicCacheable(req) ? _withPublicCache(resp, 60) : resp;
  }
  if (req.method === "POST" && p === "/api/columns") return json(await handleColumnCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/columns\/([\w-]+)$/))) {
    if (req.method === "GET") return json(await handleColumnGet(req, env, g[1]));
    if (req.method === "PATCH") return json(await handleColumnPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleColumnDelete(req, env, g[1]));
  }
  if ((g = m(/^\/api\/columns\/([\w-]+)\/like$/))) {
    if (req.method === "POST") return json(await handleColumnLike(req, env, g[1]));
  }
  if ((g = m(/^\/api\/columns\/([\w-]+)\/view$/))) {
    if (req.method === "POST") return json(await handleColumnView(req, env, g[1]));
  }

  // 회원 활동 집계 (관리자)
  if ((g = m(/^\/api\/admin\/users\/([\w-]+)\/activity$/))) {
    if (req.method === "GET") return json(await handleUserActivity(req, env, g[1]));
  }
  // 강연·투어별 신청 목록 (관리자)
  if ((g = m(/^\/api\/lectures\/([\w-]+)\/registrations$/))) {
    if (req.method === "GET") return json(await handleLectureRegList(req, env, g[1]));
  }
  if ((g = m(/^\/api\/tours\/([\w-]+)\/reservations$/))) {
    if (req.method === "GET") return json(await handleTourResvList(req, env, g[1]));
  }

  // 알림
  if (req.method === "GET" && p === "/api/notifications") return json(await handleNotificationsList(req, env));
  // v00.183 — 내부 인원 알람 (admin → admin/특정 사용자 broadcast).
  if (req.method === "POST" && p === "/api/admin/internal-alarm") return json(await handleInternalAlarmSend(req, env), { status: 201 });
  if ((g = m(/^\/api\/notifications\/([\w-]+)\/read$/))) {
    if (req.method === "POST") return json(await handleNotificationsMarkRead(req, env, g[1]));
  }

  // 좋아요 / 북마크
  if ((g = m(/^\/api\/posts\/(\d+)\/likes$/))) {
    if (req.method === "GET") return json(await handleLikesList(req, env, Number(g[1])));
    if (req.method === "POST") return json(await handleLikeToggle(req, env, Number(g[1])));
  }
  if ((g = m(/^\/api\/posts\/(\d+)\/bookmark$/))) {
    if (req.method === "POST") return json(await handleBookmarkToggle(req, env, Number(g[1])));
  }
  if (req.method === "GET" && p === "/api/me/bookmarks") return json(await handleBookmarksMine(req, env));

  // 신고
  if (req.method === "POST" && p === "/api/reports") return json(await handleReportCreate(req, env), { status: 201 });
  if (req.method === "GET" && p === "/api/admin/reports") return json(await handleReportsList(req, env));
  if ((g = m(/^\/api\/admin\/reports\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleReportPatch(req, env, g[1]));
  }

  // ── 한켠(숙소) 예약 PMS (v00.267) ──
  if (req.method === "GET" && p === "/api/hangyeon/room-types") {
    const resp = json(await handleHkRoomTypesList(req, env));
    return _publicCacheable(req) ? _withPublicCache(resp, 30) : resp;
  }
  if (req.method === "POST" && p === "/api/hangyeon/room-types") return json(await handleHkRoomTypeCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/hangyeon\/room-types\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleHkRoomTypePatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleHkRoomTypeDelete(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/hangyeon/availability") return json(await handleHkAvailability(req, env));
  if (req.method === "GET" && p === "/api/hangyeon/slots") return json(await handleHkSlots(req, env));
  if (req.method === "GET" && p === "/api/hangyeon/day") return json(await handleHkDay(req, env));
  if (req.method === "PUT" && p === "/api/hangyeon/availability") return json(await handleHkAvailabilitySet(req, env));
  if (req.method === "POST" && p === "/api/hangyeon/quote") return json(await handleHkQuote(req, env));
  if (req.method === "POST" && p === "/api/hangyeon/bookings") return json(await handleHkBookingCreate(req, env), { status: 201 });
  if (req.method === "GET" && p === "/api/hangyeon/bookings") return json(await handleHkBookingsList(req, env));
  if (req.method === "GET" && p === "/api/me/hangyeon-bookings") return json(await handleHkMyBookings(req, env));
  if ((g = m(/^\/api\/hangyeon\/bookings\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleHkBookingPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleHkBookingCancel(req, env, g[1]));
  }
  if ((g = m(/^\/api\/hangyeon\/bookings\/([\w-]+)\/log$/))) {
    if (req.method === "GET") return json(await handleHkBookingLog(req, env, g[1]));
  }
  if ((g = m(/^\/api\/hangyeon\/bookings\/([\w-]+)\/payments$/))) {
    if (req.method === "GET") return json(await handleHkPaymentsList(req, env, g[1]));
    if (req.method === "POST") return json(await handleHkPaymentAdd(req, env, g[1]), { status: 201 });
  }
  if (req.method === "GET" && p === "/api/hangyeon/rate-rules") return json(await handleHkRateRulesList(req, env));
  if (req.method === "POST" && p === "/api/hangyeon/rate-rules") return json(await handleHkRateRuleCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/hangyeon\/rate-rules\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleHkRateRulePatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleHkRateRuleDelete(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/hangyeon/coupons") return json(await handleHkCouponsList(req, env));
  if (req.method === "POST" && p === "/api/hangyeon/coupons") return json(await handleHkCouponUpsert(req, env), { status: 201 });
  if ((g = m(/^\/api\/hangyeon\/coupons\/([\w-]+)$/))) {
    if (req.method === "DELETE") return json(await handleHkCouponDelete(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/hangyeon/guests") return json(await handleHkGuestsList(req, env));
  if ((g = m(/^\/api\/hangyeon\/guests\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleHkGuestPatch(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/hangyeon/room-units") return json(await handleHkUnitsList(req, env));
  if (req.method === "POST" && p === "/api/hangyeon/room-units") return json(await handleHkUnitCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/hangyeon\/room-units\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleHkUnitPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleHkUnitDelete(req, env, g[1]));
  }

  return json({ error: "Not found" }, { status: 404 });
};

// ──────── 진입점 ──────────────────────────────────────────

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }
    try {
      const resp = await route(req, env);
      return withCors(resp, origin, env);
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500;
      const message = err.message || "Internal error";
      return withCors(json({ error: message }, { status }), origin, env);
    }
  },
};

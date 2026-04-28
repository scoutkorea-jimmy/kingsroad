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
  h.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
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

const getCurrentUser = async (req, env) => {
  const token = readSessionToken(req);
  if (!token) return null;
  const row = await env.DB.prepare(
    `SELECT u.id, u.email, u.name, u.is_admin, u.grade_id, u.profile_json, u.consents_json, u.created_at, s.expires_at
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = ?`
  ).bind(token).first();
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
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    isAdmin,
    gradeId,
    profile: row.profile_json ? JSON.parse(row.profile_json) : null,
    consents: row.consents_json ? JSON.parse(row.consents_json) : null,
    createdAt: row.created_at,
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

// ──────── 핸들러 ──────────────────────────────────────────

const handleAuthSignup = async (req, env) => {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim();
  const password = String(body.password || "");
  if (!isEmail(email)) throw new HttpError(400, "올바른 이메일을 입력해 주세요.");
  if (name.length < 1) throw new HttpError(400, "이름을 입력해 주세요.");
  if (password.length < 6) throw new HttpError(400, "비밀번호는 6자 이상이어야 합니다.");

  const exists = await env.DB.prepare("SELECT 1 FROM users WHERE email = ?").bind(email).first();
  if (exists) throw new HttpError(409, "이미 가입된 이메일입니다.");

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
  const row = await env.DB.prepare(
    "SELECT id, email, name, password_hash, password_salt, is_admin, grade_id, suspended, suspended_reason FROM users WHERE email = ?"
  ).bind(email).first();
  if (!row) throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  const ok = await verifyPassword(password, row.password_hash, row.password_salt);
  if (!ok) throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  if (row.suspended) throw new HttpError(403, `정지된 계정입니다.${row.suspended_reason ? ' 사유: ' + row.suspended_reason : ''}`);

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
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
  const args = [];
  let where = "1=1";
  if (category) { where += " AND category_id = ?"; args.push(category); }
  if (q) { where += " AND (title LIKE ? OR author LIKE ?)"; args.push(`%${q}%`, `%${q}%`); }
  const sql = `SELECT id, category_id, category, prefix, title, author_id, author, views, replies, created_at FROM posts WHERE ${where} ORDER BY created_at DESC LIMIT ?`;
  const { results } = await env.DB.prepare(sql).bind(...args, limit).all();
  return { posts: results };
};

const handlePostsCreate = async (req, env) => {
  const user = await requireUser(req, env);
  const body = await req.json().catch(() => ({}));
  const categoryId = String(body.categoryId || "free");
  const title = String(body.title || "").trim();
  const text = String(body.body || "");
  if (!title) throw new HttpError(400, "제목을 입력해 주세요.");
  const cat = await env.DB.prepare("SELECT label FROM categories WHERE id = ?").bind(categoryId).first();
  const r = await env.DB.prepare(
    `INSERT INTO posts (category_id, category, prefix, title, body, author_id, author, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(categoryId, cat?.label || categoryId, body.prefix || null, title, text, user.id, user.name, nowIso()).run();
  return { id: r.meta.last_row_id };
};

const handlePostGet = async (req, env, id) => {
  const post = await env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
  if (!post) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  await env.DB.prepare("UPDATE posts SET views = views + 1 WHERE id = ?").bind(id).run();
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
  const r = await env.DB.prepare(
    "INSERT INTO comments (post_id, parent_id, body, author_id, author, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(postId, body.parentId || null, text, user.id, user.name, nowIso()).run();
  await env.DB.prepare("UPDATE posts SET replies = replies + 1 WHERE id = ?").bind(postId).run();
  return { id: r.meta.last_row_id };
};

const handleBooksList = async (req, env) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM books WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC"
  ).all();
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

const handleMediaUpload = async (req, env) => {
  await requireAdmin(req, env);
  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function") throw new HttpError(400, "파일을 첨부해 주세요.");
  const folder = (form.get("folder") || "uploads").toString().replace(/[^a-z0-9_/-]/gi, "");
  const ext = (file.name || "").split(".").pop() || "bin";
  const key = `${folder}/${randomId()}.${ext}`;
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

// ──────── 감사 로그 ───────────────────────────────────────

const auditWrite = async (env, actor, action, target, details, ip) => {
  try {
    await env.DB.prepare(
      "INSERT INTO audit_log (actor, action, target, details_json, ip) VALUES (?, ?, ?, ?, ?)"
    ).bind(actor || null, action, target || null, details ? JSON.stringify(details) : null, ip || null).run();
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
  const { results } = await env.DB.prepare(
    `SELECT id, email, name, is_admin, grade_id, suspended, suspended_reason, profile_json, consents_json, created_at FROM users WHERE ${where} ORDER BY created_at DESC LIMIT 500`
  ).bind(...args).all().catch(async () => {
    // suspended 컬럼이 없을 수도(v1 스키마) — 조용히 폴백
    const r = await env.DB.prepare(
      `SELECT id, email, name, is_admin, grade_id, created_at FROM users WHERE ${where} ORDER BY created_at DESC LIMIT 500`
    ).bind(...args).all();
    return r;
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
    "SELECT id, user_id, user_name, status, created_at FROM lecture_registrations WHERE lecture_id = ? ORDER BY created_at ASC"
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
    Number(body.durationMinutes || 90), Number(body.capacity || 30), Number(body.price || 0),
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
    price: "price", note: "note", hidden: "hidden" };
  const fields = []; const args = [];
  for (const [k, col] of Object.entries(map)) {
    if (k in body) { fields.push(`${col} = ?`); args.push(k === "hidden" ? (body[k] ? 1 : 0) : body[k]); }
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
    "SELECT id, user_id, user_name, qty, status, created_at FROM tour_reservations WHERE tour_id = ? ORDER BY created_at ASC"
  ).bind(id).all();
  return { tour: tourRow(t), reservations: regs };
};

const handleTourCreate = async (req, env) => {
  const admin = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const id = body.id || randomId("tour");
  await env.DB.prepare(
    `INSERT INTO tours (id, title, description, duration, group_size, level, next, starts_at, duration_minutes, capacity, price, hidden)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.title || "새 투어", body.desc || "", body.duration || "",
    body.group || "", body.level || "", body.next || "", body.startsAt || null,
    Number(body.durationMinutes || 240), Number(body.capacity || 8), Number(body.price || 0),
    body.hidden ? 1 : 0,
  ).run();
  await auditWrite(env, admin.email, "tour.create", `tour:${id}`);
  return { id };
};

const handleTourPatch = async (req, env, id) => {
  const admin = await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const map = { title: "title", desc: "description", duration: "duration", group: "group_size",
    level: "level", next: "next", startsAt: "starts_at", durationMinutes: "duration_minutes",
    capacity: "capacity", price: "price", hidden: "hidden" };
  const fields = []; const args = [];
  for (const [k, col] of Object.entries(map)) {
    if (k in body) { fields.push(`${col} = ?`); args.push(k === "hidden" ? (body[k] ? 1 : 0) : body[k]); }
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
    return { liked: false };
  }
  await env.DB.prepare("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)").bind(postId, user.id).run();
  return { liked: true };
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
  const sets = []; const args = [];
  if (body.status) { sets.push("status = ?"); args.push(body.status); }
  if (body.status === 'confirmed') { sets.push("paid_at = ?"); args.push(nowIso()); }
  if (!sets.length) return { ok: true };
  args.push(regId);
  await env.DB.prepare(`UPDATE lecture_registrations SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
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
    `SELECT tr.*, t.title, t.starts_at, t.location, t.price
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
  const sets = []; const args = [];
  if (body.status) { sets.push("status = ?"); args.push(body.status); }
  if (body.status === 'confirmed') { sets.push("paid_at = ?"); args.push(nowIso()); }
  if (!sets.length) return { ok: true };
  args.push(regId);
  await env.DB.prepare(`UPDATE tour_reservations SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
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

// ── 입금 계좌 ──
const handleBankAccountGet = async (req, env) => {
  const row = await env.DB.prepare("SELECT * FROM bank_account WHERE id = 1").first();
  return { bankAccount: row || null };
};

const handleBankAccountPut = async (req, env) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  await env.DB.prepare(
    `UPDATE bank_account SET bank_name = ?, account_number = ?, holder = ?, memo = ?, updated_at = ? WHERE id = 1`
  ).bind(body.bankName || "", body.accountNumber || "", body.holder || "", body.memo || "", nowIso()).run();
  return { ok: true };
};

// ── 카테고리 ──
const handleCategoriesList = async (req, env) => {
  const { results } = await env.DB.prepare("SELECT * FROM categories_kv ORDER BY display_order").all();
  return { categories: (results || []).map((r) => ({ ...r, prefixes: r.prefixes_json ? JSON.parse(r.prefixes_json) : [] })) };
};

const handleCategoryCreate = async (req, env) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "").trim() || randomId("cat");
  await env.DB.prepare(
    `INSERT INTO categories_kv (id, label, board_type, min_level, post_min_level, description, prefixes_json, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, body.label || "", body.boardType || "community", Number(body.minLevel || 0), Number(body.postMinLevel || 10), body.description || "", JSON.stringify(body.prefixes || []), Number(body.order || 0)).run();
  return { id };
};

const handleCategoryPatch = async (req, env, id) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  const sets = []; const args = [];
  if ("label" in body) { sets.push("label = ?"); args.push(body.label); }
  if ("boardType" in body) { sets.push("board_type = ?"); args.push(body.boardType); }
  if ("minLevel" in body) { sets.push("min_level = ?"); args.push(Number(body.minLevel)); }
  if ("postMinLevel" in body) { sets.push("post_min_level = ?"); args.push(Number(body.postMinLevel)); }
  if ("description" in body) { sets.push("description = ?"); args.push(body.description); }
  if ("prefixes" in body) { sets.push("prefixes_json = ?"); args.push(JSON.stringify(body.prefixes || [])); }
  if ("order" in body) { sets.push("display_order = ?"); args.push(Number(body.order)); }
  if (!sets.length) return { ok: true };
  args.push(id);
  await env.DB.prepare(`UPDATE categories_kv SET ${sets.join(", ")} WHERE id = ?`).bind(...args).run();
  return { ok: true };
};

const handleCategoryDelete = async (req, env, id) => {
  await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM categories_kv WHERE id = ?").bind(id).run();
  return { ok: true };
};

// ── 등급 ──
const handleGradesList = async (req, env) => {
  const { results } = await env.DB.prepare("SELECT * FROM grades_kv ORDER BY level").all();
  return { grades: results };
};

const handleGradeUpsert = async (req, env, id) => {
  await requireAdmin(req, env);
  const body = await req.json().catch(() => ({}));
  await env.DB.prepare(
    `INSERT INTO grades_kv (id, label, level, color, description, display_order) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET label = excluded.label, level = excluded.level, color = excluded.color,
       description = excluded.description, display_order = excluded.display_order`
  ).bind(id, body.label || id, Number(body.level || 0), body.color || "", body.description || "", Number(body.order || 0)).run();
  return { ok: true };
};

const handleGradeDelete = async (req, env, id) => {
  await requireAdmin(req, env);
  await env.DB.prepare("DELETE FROM grades_kv WHERE id = ?").bind(id).run();
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

  if (req.method === "GET" && p === "/api/posts") return json(await handlePostsList(req, env));
  if (req.method === "POST" && p === "/api/posts") return json(await handlePostsCreate(req, env), { status: 201 });
  let g;
  if ((g = m(/^\/api\/posts\/(\d+)$/))) {
    const id = Number(g[1]);
    if (req.method === "GET") return json(await handlePostGet(req, env, id));
    if (req.method === "PATCH") return json(await handlePostPatch(req, env, id));
    if (req.method === "DELETE") return json(await handlePostDelete(req, env, id));
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

  if (req.method === "GET" && p === "/api/books") return json(await handleBooksList(req, env));
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

  // 관리자: 회원
  if (req.method === "GET" && p === "/api/admin/users") return json(await handleAdminUsersList(req, env));
  if ((g = m(/^\/api\/admin\/users\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleAdminUserPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleAdminUserDelete(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/admin/audit") return json(await handleAdminAuditList(req, env));

  // 강연
  if (req.method === "GET" && p === "/api/lectures") return json(await handleLecturesList(req, env));
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
  if (req.method === "GET" && p === "/api/tours") return json(await handleToursList(req, env));
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
  if (req.method === "GET" && p === "/api/site-content") return json(await handleSiteContentGet(req, env));
  if ((g = m(/^\/api\/site-content\/([\w-]+)$/))) {
    if (req.method === "PATCH" || req.method === "PUT") return json(await handleSiteContentPatch(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/faqs") return json(await handleFaqList(req, env));
  if (req.method === "GET" && p === "/api/admin/faqs") return json(await handleFaqAdminList(req, env));
  if (req.method === "POST" && p === "/api/faqs") return json(await handleFaqCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/faqs\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleFaqPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleFaqDelete(req, env, g[1]));
  }
  if ((g = m(/^\/api\/legal\/([\w-]+)$/))) {
    if (req.method === "GET") return json(await handleLegalGet(req, env, g[1]));
    if (req.method === "PUT") return json(await handleLegalPut(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/bank-account") return json(await handleBankAccountGet(req, env));
  if (req.method === "PUT" && p === "/api/bank-account") return json(await handleBankAccountPut(req, env));
  if (req.method === "GET" && p === "/api/categories") return json(await handleCategoriesList(req, env));
  if (req.method === "POST" && p === "/api/categories") return json(await handleCategoryCreate(req, env), { status: 201 });
  if ((g = m(/^\/api\/categories\/([\w-]+)$/))) {
    if (req.method === "PATCH") return json(await handleCategoryPatch(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleCategoryDelete(req, env, g[1]));
  }
  if (req.method === "GET" && p === "/api/grades") return json(await handleGradesList(req, env));
  if ((g = m(/^\/api\/grades\/([\w-]+)$/))) {
    if (req.method === "PUT") return json(await handleGradeUpsert(req, env, g[1]));
    if (req.method === "DELETE") return json(await handleGradeDelete(req, env, g[1]));
  }
  if (req.method === "POST" && p === "/api/admin/audit") return json(await handleAuditCreate(req, env), { status: 201 });

  // 알림
  if (req.method === "GET" && p === "/api/notifications") return json(await handleNotificationsList(req, env));
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

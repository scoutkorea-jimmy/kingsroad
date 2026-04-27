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

const corsHeaders = (origin, env) => {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin) || allowed.includes("*");
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

const setSessionCookie = (resp, token, ttl) => {
  const h = new Headers(resp.headers);
  h.append("Set-Cookie", `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${ttl}; HttpOnly; Secure; SameSite=Lax`);
  return new Response(resp.body, { status: resp.status, headers: h });
};

const clearSessionCookie = (resp) => {
  const h = new Headers(resp.headers);
  h.append("Set-Cookie", `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
  return new Response(resp.body, { status: resp.status, headers: h });
};

const readSessionToken = (req) => {
  const auth = req.headers.get("Authorization");
  if (auth && auth.startsWith("Bearer ")) return auth.slice(7).trim();
  const cookie = req.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return m ? m[1] : null;
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
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    isAdmin: !!row.is_admin,
    gradeId: row.grade_id,
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
  await env.DB.prepare(
    `INSERT INTO users (id, email, name, password_hash, password_salt, is_admin, grade_id, consents_json, created_at)
     VALUES (?, ?, ?, ?, ?, 0, 'member', ?, ?)`
  ).bind(id, email, name, hash, salt, JSON.stringify(body.consents || {}), nowIso()).run();

  const token = newSessionToken();
  const ttl = Number(env.SESSION_TTL_SECONDS || 2592000);
  await env.DB.prepare(
    `INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`
  ).bind(token, id, Date.now() + ttl * 1000, nowIso()).run();

  return { token, ttl, user: { id, email, name, isAdmin: false, gradeId: "member" } };
};

const handleAuthLogin = async (req, env) => {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const row = await env.DB.prepare(
    "SELECT id, email, name, password_hash, password_salt, is_admin, grade_id FROM users WHERE email = ?"
  ).bind(email).first();
  if (!row) throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  const ok = await verifyPassword(password, row.password_hash, row.password_salt);
  if (!ok) throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");

  const token = newSessionToken();
  const ttl = Number(env.SESSION_TTL_SECONDS || 2592000);
  await env.DB.prepare(
    `INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`
  ).bind(token, row.id, Date.now() + ttl * 1000, nowIso()).run();

  return { token, ttl, user: { id: row.id, email: row.email, name: row.name, isAdmin: !!row.is_admin, gradeId: row.grade_id } };
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

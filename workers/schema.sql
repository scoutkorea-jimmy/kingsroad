-- 뱅기노자 백엔드 D1 스키마
-- 모든 ID는 TEXT — 클라이언트에서 생성한 ID도 그대로 받을 수 있게.
-- 시간은 ISO 문자열(UTC).

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  grade_id TEXT NOT NULL DEFAULT 'member',
  profile_json TEXT,
  consents_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id TEXT NOT NULL,
  category TEXT,
  prefix TEXT,
  title TEXT NOT NULL,
  body TEXT,
  author_id TEXT,
  author TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  replies INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  parent_id INTEGER,
  body TEXT NOT NULL,
  author_id TEXT,
  author TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);

CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT,
  publisher TEXT,
  pages INTEGER,
  isbn TEXT,
  price_kr INTEGER NOT NULL DEFAULT 0,
  price_en INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  intro TEXT,
  chapters_json TEXT,
  author_bio TEXT,
  cover_key TEXT,
  pdf_key TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  published_at TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS book_reviews (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  text TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_reviews_book ON book_reviews(book_id);

CREATE TABLE IF NOT EXISTS book_orders (
  id TEXT PRIMARY KEY,
  book_id TEXT,
  user_id TEXT,
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  version TEXT,
  qty INTEGER NOT NULL DEFAULT 1,
  subtotal INTEGER NOT NULL DEFAULT 0,
  shipping INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  tracking_no TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at TEXT,
  shipped_at TEXT,
  delivered_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON book_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON book_orders(status);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  board_type TEXT NOT NULL DEFAULT 'community',
  min_level INTEGER NOT NULL DEFAULT 0,
  post_min_level INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS grades (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  level INTEGER NOT NULL,
  color TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 사이트 콘텐츠 (단일 행 JSON blob)
CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (id = 1)
);

-- 시드: 기본 카테고리, 등급
INSERT OR IGNORE INTO categories (id, label, board_type, min_level, post_min_level, description, sort_order) VALUES
  ('notice', '공지', 'community', 0, 100, '운영진 공지 (읽기: 누구나 · 쓰기: 관리자)', 0),
  ('free', '자유', 'community', 10, 10, '자유 게시판 (쓰기: 회원)', 1),
  ('question', '질문', 'community', 10, 10, '질문 게시판 (쓰기: 회원)', 2),
  ('info', '정보', 'community', 10, 30, '정보 공유 (쓰기: 독자 이상)', 3),
  ('column', '칼럼', 'column', 0, 100, '뱅기노자 칼럼 (쓰기: 관리자)', 4);

INSERT OR IGNORE INTO grades (id, label, level, color, description, sort_order) VALUES
  ('guest', '방문객', 0, '#64748B', '비로그인 / 게스트', 0),
  ('member', '입문', 10, '#94A3B8', '회원가입 완료', 1),
  ('reader', '독자', 30, '#93C5FD', '활동 회원 (댓글 10+)', 2),
  ('scholar', '사관', 60, '#3B82F6', '열성 회원 (칼럼 기고 가능)', 3),
  ('wangsanam', '왕사남', 90, '#2563EB', '운영진', 4),
  ('admin', '관리자', 100, '#1E3A8A', '최고 관리자', 5);

-- v3 추가 스키마: 운영/관리 데이터를 모두 D1 으로 이전.
-- v1, v2 에 이미 만들어진 테이블은 건드리지 않는다.

-- 약관 / 개인정보 처리방침 등 — slug 기반 단일 문서.
CREATE TABLE IF NOT EXISTS legal_docs (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FAQ — 카테고리/순서 가지는 항목 리스트.
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  category TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(display_order);

-- 입금 계좌 — 단일 행(id=1) 이지만 미래 멀티 계좌 대비해 PK 유지.
CREATE TABLE IF NOT EXISTS bank_account (
  id INTEGER PRIMARY KEY,
  bank_name TEXT,
  account_number TEXT,
  holder TEXT,
  memo TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT OR IGNORE INTO bank_account (id, bank_name, account_number, holder, memo)
VALUES (1, '', '', '', '입금자명에 강연 신청자 본명 + 강연번호를 남겨 주세요.');

-- 사이트 콘텐츠 — section(nav/hero/footer/branding/og/auth/contact) 단위 JSON.
CREATE TABLE IF NOT EXISTS site_content_kv (
  section TEXT PRIMARY KEY,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 회원등급 정의 — 색상/레벨/설명.
CREATE TABLE IF NOT EXISTS grades_kv (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  level INTEGER NOT NULL,
  color TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- 게시판 카테고리.
CREATE TABLE IF NOT EXISTS categories_kv (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  board_type TEXT NOT NULL DEFAULT 'community',
  min_level INTEGER NOT NULL DEFAULT 0,
  post_min_level INTEGER NOT NULL DEFAULT 10,
  description TEXT,
  prefixes_json TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- 책 주문 — 이미 schema.sql 에 있지만 누락 컬럼이 있으면 추가.
-- (이미 있어 INSERT 충돌 방지 위해 IF NOT EXISTS 만 사용)

-- 강연 후기 / 투어 후기는 schema-v2.sql 에 이미 있음.

-- 환불 처리용 컬럼 보강은 ALTER 가 D1 에서 까다로우므로,
-- 기존 status 컬럼을 'pending_payment','paid','confirmed','cancelled','refund_requested','refunded' 등으로 사용.

-- 사용자 프로필 갱신 추적용은 users.profile_json 으로 충분.

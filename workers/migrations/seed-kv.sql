-- 뱅기노자 D1 seed-kv (v00.122) — categories_kv / grades_kv 기본 시드
--
-- 목적:
--   schema-v3.sql 의 categories_kv / grades_kv 가 production 에서 비어있어
--   클라이언트 시드(DEFAULT_CATEGORIES / DEFAULT_GRADES)에만 의존하던 상태를
--   D1 source-of-truth 로 정상화. boot.jsx:258-279 의 빈 응답 폴백 의존성 제거.
--
-- 멱등: INSERT OR IGNORE — 이미 같은 id 의 row 가 있으면 무시. 여러 번 실행 안전.
--
-- 실행 (사용자 1회):
--   cd workers && npx wrangler d1 execute banginoja-db --remote --file=seed-kv.sql
--
-- 검증 (실행 후):
--   wrangler d1 execute banginoja-db --remote --command "SELECT COUNT(*) FROM categories_kv"  -- 5
--   wrangler d1 execute banginoja-db --remote --command "SELECT COUNT(*) FROM grades_kv"      -- 6

-- 카테고리 5종 (v00.117 post_min_level 기본값 0 적용 — UX trap 해소).
-- notice / column 만 admin only (post_min_level 100). 나머지는 일반 사용자도 작성 가능.
INSERT OR IGNORE INTO categories_kv (id, label, board_type, min_level, post_min_level, description, prefixes_json, display_order) VALUES
  ('notice',   '공지', 'community', 0, 100, '운영진 공지 (읽기: 누구나 · 쓰기: 관리자)', '[]', 0),
  ('free',     '자유', 'community', 0, 0,   '자유 게시판',                                '[]', 1),
  ('question', '질문', 'community', 0, 0,   '질문 게시판',                                '[]', 2),
  ('info',     '정보', 'community', 0, 0,   '정보 공유',                                  '[]', 3),
  ('column',   '칼럼', 'column',    0, 100, '뱅기노자 칼럼 (쓰기: 관리자)',                '[]', 4);

-- 등급 6종 (DEFAULT_GRADES 와 1:1 정합).
INSERT OR IGNORE INTO grades_kv (id, label, level, color, description, display_order) VALUES
  ('guest',     '방문객', 0,   '#64748B', '비로그인 / 게스트',         0),
  ('member',    '입문',   10,  '#94A3B8', '회원가입 완료',             1),
  ('reader',    '독자',   30,  '#93C5FD', '활동 회원 (댓글 10+)',      2),
  ('scholar',   '사관',   60,  '#3B82F6', '열성 회원 (칼럼 기고 가능)', 3),
  ('wangsanam', '왕사남', 90,  '#2563EB', '운영진',                    4),
  ('admin',     '관리자', 100, '#1E3A8A', '최고 관리자',               5);

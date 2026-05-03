-- 뱅기노자 D1 schema-v8 (v00.141) — 게시판별 권한 4종 체크박스
--
-- 배경: 사용자 요청 '각 게시판별 게시글 읽기/쓰기/댓글 작성/댓글 보기 권한을 관리자페이지에서 체크박스로'.
--
-- 정책:
--   ① allow_read           — 게시판 글 목록/상세 노출 (default 1=허용)
--   ② allow_write          — 게시글 작성 가능 (default 1=허용)
--   ③ allow_comment_read   — 댓글 목록/카운트 노출 (default 1=허용)
--   ④ allow_comment_write  — 댓글 작성 가능 (default 1=허용)
--
-- 모두 INTEGER (0/1). admin / 슈퍼 관리자는 항상 통과 (UI/back-end 양쪽).
-- 기존 post_min_level / min_level (등급 기반 게이트) 와 독립 — 둘 다 통과해야 액션 허용.
-- 마이그레이션 후 모든 row 의 새 컬럼은 1 (현재 동작 유지).

ALTER TABLE categories_kv ADD COLUMN allow_read INTEGER DEFAULT 1;
ALTER TABLE categories_kv ADD COLUMN allow_write INTEGER DEFAULT 1;
ALTER TABLE categories_kv ADD COLUMN allow_comment_read INTEGER DEFAULT 1;
ALTER TABLE categories_kv ADD COLUMN allow_comment_write INTEGER DEFAULT 1;

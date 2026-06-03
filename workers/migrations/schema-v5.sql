-- 뱅기노자 D1 schema-v5 (v00.119) — legacy 테이블 정리 마이그레이션
--
-- 목적:
--   schema.sql 의 legacy `categories` / `grades` / `site_content` 테이블 row 잔재 정리.
--   schema-v3.sql 의 `categories_kv` / `grades_kv` / `site_content_kv` 가 v00.040+ 부터 single source of truth.
--   워커 코드는 v00.119 이전부터 _kv 만 read/write 했음. legacy 테이블에 row 남아있어도 동작 영향 0,
--   다만 오해 / 디스크 낭비 / 향후 유지보수 부담 → DROP 으로 정리.
--
-- 실행 (사용자 1회 — production D1):
--   cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-v5.sql
--
-- 안전 검증 권장 (DROP 전):
--   wrangler d1 execute banginoja-db --remote --command "SELECT COUNT(*) FROM categories"
--   wrangler d1 execute banginoja-db --remote --command "SELECT COUNT(*) FROM categories_kv"
--   → categories_kv 가 비어있다면 DROP 전에 categories → categories_kv 로 데이터 복사 필요.
--   현재 production 은 categories_kv 가 활성 (admin UI 가 v00.040+ 부터 _kv 에 직접 write).
--
-- 롤백:
--   schema.sql 을 다시 실행하면 빈 테이블 재생성 (IF NOT EXISTS). 데이터는 복원 불가.
--   ↑ 반드시 백업 권장 (`wrangler d1 export` 또는 SELECT * FROM ... 결과를 파일로).

-- ⚠ DROP 전 마지막 안전장치 — _kv 테이블이 존재하지 않으면 마이그레이션 미완료 → 중단.
-- (D1 SQLite 는 PRAGMA / SELECT name FROM sqlite_master 로 검증 가능.)
-- 단순화: 본 파일은 DROP 만 실행. 사용자가 위 검증 명령을 사전 수동 실행 책임.

DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS site_content;

-- ✅ 완료 후 schema.sql 재실행은 DROP 된 빈 테이블을 다시 만들 수 있으므로,
--    schema.sql 의 DEPRECATED 블록(CREATE TABLE categories / grades / site_content) 도 함께 제거 권장.
--    v00.119 commit 에서는 DEPRECATED 마커 + 안내 주석만 남기고 정의는 보존 (호환성).
--    완전 제거는 별도 사이클(v00.120+).

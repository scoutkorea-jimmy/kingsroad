-- migrate-weekly-monthly.sql — v00.284
-- 한켠 객실에 주간(7박 고정)·월간(30박 고정) 정액 상품 컬럼 추가.
-- 기존 DB(hk_room_types)에만 적용. 신규 통합 스키마(schema-hangyeon.sql)에는 이미 인라인됨.
--
-- 적용(remote 운영 DB):
--   cd workers && npx wrangler d1 execute banginoja-db --remote --file=migrate-weekly-monthly.sql
--
-- ALTER TABLE ADD COLUMN 은 비파괴적(기존 행은 DEFAULT/NULL). 재실행 시 "duplicate column" 에러면 이미 적용된 것.

ALTER TABLE hk_room_types ADD COLUMN weekly_enabled  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE hk_room_types ADD COLUMN weekly_price    INTEGER;
ALTER TABLE hk_room_types ADD COLUMN monthly_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE hk_room_types ADD COLUMN monthly_price   INTEGER;

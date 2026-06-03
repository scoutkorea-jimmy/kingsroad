-- 뱅기노자 D1 schema-v7 (v00.136) — 투어/강연 출석 + 칼럼 대표이미지 출처
--
-- 1) attended (tour_reservations, lecture_registrations)
--    배경: '자동 승급 기준에 투어/강연 참여 횟수 추가 — 노쇼 제외 실 참여만'.
--    정책: attended 컬럼 (NULL=미정 / 1=참석 / 0=노쇼). status='confirmed' row 만 마킹 의미.
--    BGNJ_GRADE_PROMO.metrics 가 attended=1 row 수를 카운트.
--
-- 2) cover_credit (user_columns)
--    배경: '칼럼에 첨부되는 대표이미지에는 출처를 작성할 수 있게'.
--    정책: cover_credit TEXT (옵셔널). 빈 값이면 출처 미표시.
--
-- 실행 (사용자 1회):
--   cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-v7.sql

ALTER TABLE tour_reservations ADD COLUMN attended INTEGER;
ALTER TABLE lecture_registrations ADD COLUMN attended INTEGER;
ALTER TABLE user_columns ADD COLUMN cover_credit TEXT;

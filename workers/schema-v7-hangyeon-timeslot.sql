-- ============================================================================
-- schema-v7-hangyeon-timeslot.sql — 한켠 상품에 시간제(작업실) 예약 모델 추가
-- v00.268. ★ 1회 실행 (ADD COLUMN 은 재실행 시 'duplicate column' 에러 — 정상, 무시).
-- 적용: cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-v7-hangyeon-timeslot.sql
-- ============================================================================

-- 예약 유형: 'nightly'(1박 숙박, 기존 기본) | 'timeslot'(시간제 — 인원·날짜·시간 슬롯)
ALTER TABLE hk_room_types ADD COLUMN booking_type TEXT NOT NULL DEFAULT 'nightly';
-- 시간제 운영 설정
ALTER TABLE hk_room_types ADD COLUMN open_time TEXT;      -- '09:00'
ALTER TABLE hk_room_types ADD COLUMN close_time TEXT;     -- '22:00'
ALTER TABLE hk_room_types ADD COLUMN slot_minutes INTEGER NOT NULL DEFAULT 60; -- 슬롯 길이(분). 3시간이면 180.

-- 예약의 시간 슬롯 (timeslot 유형). nightly 는 NULL.
ALTER TABLE hk_bookings ADD COLUMN slot_start TEXT;       -- HH:MM
ALTER TABLE hk_bookings ADD COLUMN slot_end TEXT;         -- HH:MM

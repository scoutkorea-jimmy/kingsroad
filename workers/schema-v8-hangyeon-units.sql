-- ============================================================================
-- schema-v8-hangyeon-units.sql — 한켠 객실: 시간당(최소 N시간) + 하루단위 동시 지원 + 샘플 객실
-- v00.269. ★ 1회 실행 (ADD COLUMN 재실행 시 'duplicate column' 에러는 정상, 무시).
-- 적용: cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-v8-hangyeon-units.sql
-- ============================================================================

-- 객실 예약 단위 capability (객실 하나가 시간제·하루 둘 다 가능)
ALTER TABLE hk_room_types ADD COLUMN hourly_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE hk_room_types ADD COLUMN hourly_price   INTEGER;            -- 원/시간
ALTER TABLE hk_room_types ADD COLUMN min_hours      INTEGER NOT NULL DEFAULT 3; -- 시간제 최소 이용시간
ALTER TABLE hk_room_types ADD COLUMN daily_enabled  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE hk_room_types ADD COLUMN daily_price    INTEGER;            -- 원/일(전일)

-- 예약의 이용 단위
ALTER TABLE hk_bookings ADD COLUMN booking_unit TEXT;   -- 'hourly' | 'daily' | 'nightly'

-- ── 샘플 객실 (기능 확인용) ──────────────────────────────────────────────────
-- open/close/slot_minutes 는 v7 에서 추가됨. 시간제는 1시간 슬롯, 최소 3시간.
INSERT OR IGNORE INTO hk_room_types
  (id, name, description, images_json, quantity, max_occupancy, bed_config, amenities_json,
   base_price, status, sort_order, booking_type, open_time, close_time, slot_minutes,
   hourly_enabled, hourly_price, min_hours, daily_enabled, daily_price)
VALUES
  ('hkrt-deluxe', '한켠 디럭스룸', '창가 채광이 좋은 2인실. 시간제 작업/휴식과 하루 대실 모두 가능합니다.',
   '[]', 1, 2, '더블 1', '["에어컨","와이파이","콘센트","개별조명","난방"]',
   70000, 'active', 1, 'nightly', '09:00', '22:00', 60,
   1, 10000, 3, 1, 70000),
  ('hkrt-standard', '한켠 스탠다드룸', '아늑한 1~2인실. 시간 단위 또는 하루 단위로 예약하세요.',
   '[]', 2, 2, '싱글 2', '["에어컨","와이파이","콘센트","조명"]',
   55000, 'active', 2, 'nightly', '09:00', '22:00', 60,
   1, 8000, 3, 1, 55000),
  ('hkrt-studio', '한켠 작업실', '집중하기 좋은 다목적 작업 공간. 시간제 전용(최소 3시간).',
   '[]', 4, 4, '', '["에어컨","와이파이","콘센트","개별스위치","대형책상"]',
   6000, 'active', 3, 'nightly', '09:00', '22:00', 60,
   1, 6000, 3, 0, NULL);

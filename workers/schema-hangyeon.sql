-- ============================================================================
-- schema-hangyeon.sql — 한켠(자고 놀자) 예약 PMS · 통합 단일 스키마 (v00.273)
-- 기존 분할본(schema-v6/v7/v8-hangyeon) 을 하나로 합침. 모든 컬럼을 최종 형태로 인라인.
-- CREATE TABLE IF NOT EXISTS — 멱등(이미 적용된 운영 DB 에서는 no-op, 신규 DB 는 한 번에 생성).
-- 적용: cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-hangyeon.sql
--
-- 예약 단위: 숙박(daily_enabled, 체크인~체크아웃 박단위) + 시간제(hourly_enabled, 최소 N시간).
-- 7 영역: 객실 / 요금 / 재고 / 예약 / 고객 / 결제 / 운영.
-- ============================================================================

-- ── 객실 (Inventory) — 숙박/시간제 capability + 요금 ──────────────────────────
CREATE TABLE IF NOT EXISTS hk_room_types (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  description    TEXT,
  images_json    TEXT,                          -- JSON [{url, credit, isPrimary}]
  quantity       INTEGER NOT NULL DEFAULT 1,     -- 보유 객실(유닛) 수
  max_occupancy  INTEGER NOT NULL DEFAULT 2,
  bed_config     TEXT,
  amenities_json TEXT,                           -- JSON ["에어컨", ...]
  base_price     INTEGER NOT NULL DEFAULT 0,     -- legacy 평일가(미사용 시 daily_price 사용)
  weekend_price  INTEGER,                         -- 금/토 1박가 (선택)
  discounts_json TEXT,                            -- JSON [{minNights, percent, label}] 연박 할인
  min_nights     INTEGER NOT NULL DEFAULT 1,
  max_nights     INTEGER NOT NULL DEFAULT 30,
  status         TEXT NOT NULL DEFAULT 'active',  -- active / inactive
  sort_order     INTEGER NOT NULL DEFAULT 0,
  booking_type   TEXT NOT NULL DEFAULT 'nightly', -- legacy 분류 (현재 미사용)
  open_time      TEXT,                            -- 시간제 운영 시작 'HH:MM'
  close_time     TEXT,                            -- 시간제 운영 종료
  slot_minutes   INTEGER NOT NULL DEFAULT 60,
  hourly_enabled INTEGER NOT NULL DEFAULT 0,      -- 시간제 예약 받기
  hourly_price   INTEGER,                          -- 원/시간
  min_hours      INTEGER NOT NULL DEFAULT 3,       -- 시간제 최소 이용시간
  daily_enabled  INTEGER NOT NULL DEFAULT 0,       -- 숙박(박단위) 예약 받기
  daily_price    INTEGER,                          -- 1박 요금
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TEXT
);

-- ── 요금 규칙 (Rate) — 시즌/공휴일/프로모션/요일 ─────────────────────────────
CREATE TABLE IF NOT EXISTS hk_rate_rules (
  id           TEXT PRIMARY KEY,
  room_type_id TEXT,                             -- NULL = 전체 공통
  kind         TEXT NOT NULL DEFAULT 'season',   -- season|holiday|promo|dow
  label        TEXT,
  start_date   TEXT,
  end_date     TEXT,
  dow_json     TEXT,                             -- JSON [5,6] (kind=dow)
  price        INTEGER,
  priority     INTEGER NOT NULL DEFAULT 0,
  active       INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── 쿠폰 ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_coupons (
  code        TEXT PRIMARY KEY,
  label       TEXT,
  kind        TEXT NOT NULL DEFAULT 'percent',   -- percent | amount
  value       INTEGER NOT NULL DEFAULT 0,
  min_amount  INTEGER NOT NULL DEFAULT 0,
  starts_at   TEXT,
  expires_at  TEXT,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── 날짜별 재고/판매 오버라이드 (Availability) ───────────────────────────────
CREATE TABLE IF NOT EXISTS hk_availability (
  id             TEXT PRIMARY KEY,
  room_type_id   TEXT NOT NULL,
  date           TEXT NOT NULL,                  -- YYYY-MM-DD
  closed         INTEGER NOT NULL DEFAULT 0,
  qty_override   INTEGER,
  price_override INTEGER,
  note           TEXT,
  UNIQUE(room_type_id, date)
);

-- ── 예약 (Reservation) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_bookings (
  id             TEXT PRIMARY KEY,
  code           TEXT,                           -- HK-XXXXXX
  room_type_id   TEXT NOT NULL,
  user_id        TEXT,                           -- 비회원 예약 허용 → NULL 가능
  guest_name     TEXT,
  guest_email    TEXT,
  guest_phone    TEXT,
  check_in       TEXT NOT NULL,
  check_out      TEXT NOT NULL,
  nights         INTEGER NOT NULL DEFAULT 1,
  rooms          INTEGER NOT NULL DEFAULT 1,
  guests         INTEGER NOT NULL DEFAULT 1,
  total_price    INTEGER NOT NULL DEFAULT 0,
  coupon_code    TEXT,
  status         TEXT NOT NULL DEFAULT 'pending',   -- pending|confirmed|checked_in|checked_out|cancelled|no_show
  payment_status TEXT NOT NULL DEFAULT 'unpaid',    -- unpaid|partial|paid|refunded
  paid_amount    INTEGER NOT NULL DEFAULT 0,
  memo           TEXT,
  guest_request  TEXT,
  room_assignment TEXT,
  housekeeping   TEXT,
  cash_receipt   TEXT,
  slot_start     TEXT,                           -- 시간제 'HH:MM'
  slot_end       TEXT,
  booking_unit   TEXT,                           -- 'hourly' | 'nightly'
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TEXT,
  cancelled_at   TEXT,
  checked_in_at  TEXT,
  checked_out_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_hk_bookings_room ON hk_bookings(room_type_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_hk_bookings_user ON hk_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hk_bookings_status ON hk_bookings(status);

-- ── 예약 이력 ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_booking_log (
  id         TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  action     TEXT,
  detail     TEXT,
  actor      TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hk_booking_log_b ON hk_booking_log(booking_id);

-- ── 고객 (Guest) — 방문/ VIP / 블랙리스트 ───────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_guests (
  id         TEXT PRIMARY KEY,                   -- 전화digits 우선, 없으면 email
  name       TEXT,
  email      TEXT,
  phone      TEXT,
  visits     INTEGER NOT NULL DEFAULT 0,
  vip        INTEGER NOT NULL DEFAULT 0,
  blacklist  INTEGER NOT NULL DEFAULT 0,
  note       TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

-- ── 물리 객실 단위 상태 (Operation) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_room_units (
  id           TEXT PRIMARY KEY,
  room_type_id TEXT NOT NULL,
  unit_no      TEXT,
  status       TEXT NOT NULL DEFAULT 'vacant',   -- vacant|occupied|cleaning|maintenance
  note         TEXT,
  updated_at   TEXT
);

-- ── 결제/정산 원장 (Payment) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_payments (
  id         TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  amount     INTEGER NOT NULL DEFAULT 0,         -- +입금 / -환불
  method     TEXT NOT NULL DEFAULT 'bank',       -- bank|cash|onsite
  kind       TEXT NOT NULL DEFAULT 'payment',    -- payment|refund
  memo       TEXT,
  actor      TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hk_payments_b ON hk_payments(booking_id);

-- ── 샘플 객실 (기능 확인용 · 운영 시 관리자에서 수정/삭제) ────────────────────
INSERT OR IGNORE INTO hk_room_types
  (id, name, description, images_json, quantity, max_occupancy, bed_config, amenities_json,
   base_price, status, sort_order, open_time, close_time, slot_minutes,
   hourly_enabled, hourly_price, min_hours, daily_enabled, daily_price)
VALUES
  ('hkrt-deluxe', '한켠 디럭스룸', '창가 채광이 좋은 2인실. 시간제·숙박 모두 가능합니다.', '[]', 1, 2, '더블 1', '["에어컨","와이파이","콘센트","개별조명","난방"]', 70000, 'active', 1, '09:00', '22:00', 60, 1, 10000, 3, 1, 70000),
  ('hkrt-standard', '한켠 스탠다드룸', '아늑한 1~2인실. 시간제 또는 숙박으로 예약하세요.', '[]', 2, 2, '싱글 2', '["에어컨","와이파이","콘센트","조명"]', 55000, 'active', 2, '09:00', '22:00', 60, 1, 8000, 3, 1, 55000),
  ('hkrt-studio', '한켠 작업실', '집중하기 좋은 다목적 작업 공간. 시간제 전용(최소 3시간).', '[]', 4, 4, '', '["에어컨","와이파이","콘센트","개별스위치","대형책상"]', 6000, 'active', 3, '09:00', '22:00', 60, 1, 6000, 3, 0, NULL);

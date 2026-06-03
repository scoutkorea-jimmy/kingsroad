-- ============================================================================
-- schema-v6-hangyeon.sql — 한켠(전주 숙소) 예약 관리 시스템 (PMS) D1 스키마
-- v00.267 신설. 멱등(IF NOT EXISTS) — 재실행 안전.
-- 적용: cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-v6-hangyeon.sql
--
-- 7 영역 커버:
--   객실관리  → hk_room_types (+ images/amenities/bed/quantity/occupancy/status/discounts)
--   요금관리  → hk_room_types.base/weekend_price + hk_rate_rules(시즌/공휴일/프로모션/요일) + hk_coupons
--   예약관리  → hk_bookings + hk_booking_log(이력)
--   재고관리  → hk_availability(날짜별 closed/qty/price override) + 예약 차감 계산
--   고객관리  → hk_guests (방문횟수/VIP/블랙리스트)
--   결제관리  → hk_bookings.payment_status/paid_amount + hk_payments(원장: 입금/환불)
--   운영관리  → hk_bookings.status(checked_in/out/no_show) + room_assignment/housekeeping + hk_room_units(공실/투숙/청소/점검)
-- ============================================================================

-- ── 객실 타입 (Inventory) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_room_types (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,                 -- 스탠다드 더블룸
  description   TEXT,
  images_json   TEXT,                          -- JSON [{url, credit, isPrimary}]
  quantity      INTEGER NOT NULL DEFAULT 1,    -- 보유 객실 수
  max_occupancy INTEGER NOT NULL DEFAULT 2,    -- 최대 인원
  bed_config    TEXT,                          -- 침대 구성 (예: 더블 1 / 싱글 2)
  amenities_json TEXT,                         -- JSON ["에어컨","와이파이",...]
  base_price    INTEGER NOT NULL DEFAULT 0,    -- 기본(평일) 1박 요금
  weekend_price INTEGER,                        -- 주말(금/토) 요금. NULL = base 사용
  discounts_json TEXT,                          -- JSON [{minNights, percent, label}] 연박/장기 할인
  min_nights    INTEGER NOT NULL DEFAULT 1,
  max_nights    INTEGER NOT NULL DEFAULT 30,
  status        TEXT NOT NULL DEFAULT 'active', -- active(판매가능) / inactive(판매불가)
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT
);

-- ── 요금 규칙 (Rate Management) — 시즌/공휴일/프로모션/요일 ───────────────────
CREATE TABLE IF NOT EXISTS hk_rate_rules (
  id           TEXT PRIMARY KEY,
  room_type_id TEXT,                            -- NULL = 전체 객실 공통
  kind         TEXT NOT NULL DEFAULT 'season',  -- season|holiday|promo|dow
  label        TEXT,                            -- 성수기 / 추석 / 오픈 프로모션
  start_date   TEXT,                            -- YYYY-MM-DD (season/holiday/promo)
  end_date     TEXT,
  dow_json     TEXT,                            -- JSON [5,6] (kind=dow 요일 0=일..6=토)
  price        INTEGER,                         -- 적용 1박 요금(절대값)
  priority     INTEGER NOT NULL DEFAULT 0,      -- 높을수록 우선
  active       INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── 쿠폰 (Rate Management) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_coupons (
  code        TEXT PRIMARY KEY,                 -- WELCOME10
  label       TEXT,
  kind        TEXT NOT NULL DEFAULT 'percent',  -- percent | amount
  value       INTEGER NOT NULL DEFAULT 0,       -- 10(%) 또는 10000(원)
  min_amount  INTEGER NOT NULL DEFAULT 0,       -- 최소 결제금액
  starts_at   TEXT,
  expires_at  TEXT,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── 날짜별 재고/판매 오버라이드 (Availability) ───────────────────────────────
CREATE TABLE IF NOT EXISTS hk_availability (
  id             TEXT PRIMARY KEY,
  room_type_id   TEXT NOT NULL,
  date           TEXT NOT NULL,                 -- YYYY-MM-DD
  closed         INTEGER NOT NULL DEFAULT 0,    -- 1 = 판매 중지
  qty_override   INTEGER,                        -- NULL = room_type.quantity
  price_override INTEGER,                        -- NULL = 요금규칙 계산
  note           TEXT,
  UNIQUE(room_type_id, date)
);

-- ── 예약 (Reservation) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_bookings (
  id             TEXT PRIMARY KEY,
  code           TEXT,                          -- 사람이 읽는 예약번호 HK-XXXXXX
  room_type_id   TEXT NOT NULL,
  user_id        TEXT,                          -- 비회원 예약 허용 → NULL 가능
  guest_name     TEXT,
  guest_email    TEXT,
  guest_phone    TEXT,
  check_in       TEXT NOT NULL,                 -- YYYY-MM-DD
  check_out      TEXT NOT NULL,
  nights         INTEGER NOT NULL DEFAULT 1,
  rooms          INTEGER NOT NULL DEFAULT 1,    -- 예약 객실 수
  guests         INTEGER NOT NULL DEFAULT 1,    -- 투숙 인원
  total_price    INTEGER NOT NULL DEFAULT 0,
  coupon_code    TEXT,
  status         TEXT NOT NULL DEFAULT 'pending',  -- pending|confirmed|checked_in|checked_out|cancelled|no_show
  payment_status TEXT NOT NULL DEFAULT 'unpaid',   -- unpaid|partial|paid|refunded
  paid_amount    INTEGER NOT NULL DEFAULT 0,
  memo           TEXT,                          -- 관리자 메모
  guest_request  TEXT,                          -- 고객 요청사항
  room_assignment TEXT,                         -- 배정 객실 (운영)
  housekeeping   TEXT,                          -- 청소 상태 메모 (운영)
  cash_receipt   TEXT,                          -- 현금영수증 신청 (인코딩)
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TEXT,
  cancelled_at   TEXT,
  checked_in_at  TEXT,
  checked_out_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_hk_bookings_room ON hk_bookings(room_type_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_hk_bookings_user ON hk_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hk_bookings_status ON hk_bookings(status);

-- ── 예약 이력 (Reservation history / audit) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_booking_log (
  id         TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  action     TEXT,                              -- created|status|payment|memo|checkin|checkout|cancel
  detail     TEXT,
  actor      TEXT,                              -- admin email | 'guest'
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hk_booking_log_b ON hk_booking_log(booking_id);

-- ── 고객 (Guest Management) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_guests (
  id         TEXT PRIMARY KEY,                  -- 정규화 키 (phone digits 우선, 없으면 email)
  name       TEXT,
  email      TEXT,
  phone      TEXT,
  visits     INTEGER NOT NULL DEFAULT 0,        -- 누적 확정 방문 횟수
  vip        INTEGER NOT NULL DEFAULT 0,
  blacklist  INTEGER NOT NULL DEFAULT 0,
  note       TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

-- ── 물리 객실 단위 상태 (Operation) — 공실/투숙중/청소중/점검중 ───────────────
CREATE TABLE IF NOT EXISTS hk_room_units (
  id           TEXT PRIMARY KEY,
  room_type_id TEXT NOT NULL,
  unit_no      TEXT,                            -- 101, 102
  status       TEXT NOT NULL DEFAULT 'vacant',  -- vacant|occupied|cleaning|maintenance
  note         TEXT,
  updated_at   TEXT
);

-- ── 결제/정산 원장 (Payment) — 입금/환불 ────────────────────────────────────
CREATE TABLE IF NOT EXISTS hk_payments (
  id         TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  amount     INTEGER NOT NULL DEFAULT 0,        -- 양수=입금, 음수=환불
  method     TEXT NOT NULL DEFAULT 'bank',      -- bank(무통장)|cash(현장)|onsite
  kind       TEXT NOT NULL DEFAULT 'payment',   -- payment | refund
  memo       TEXT,
  actor      TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hk_payments_b ON hk_payments(booking_id);

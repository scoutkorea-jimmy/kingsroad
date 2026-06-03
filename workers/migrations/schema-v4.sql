-- 뱅기노자 D1 schema v4 — brute-force rate limiting (v00.113)
-- 적용: wrangler d1 execute banginoja-db --remote --file=workers/schema-v4.sql
-- 멱등 — IF NOT EXISTS 로 재실행 안전.

-- 로그인/가입 시도 기록.
-- email 또는 ip 단위로 최근 15분 내 실패 5회 이상이면 throttle.
-- 24시간 이상 된 행은 INSERT 시점에 자동 GC.
CREATE TABLE IF NOT EXISTS login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  ip TEXT,
  ok INTEGER NOT NULL,           -- 1 = success, 0 = fail
  attempted_at INTEGER NOT NULL  -- Date.now() ms
);

-- 조회 빈번 인덱스 (email/ip + 시간) — full table scan 방지.
CREATE INDEX IF NOT EXISTS idx_login_email_time ON login_attempts(email, attempted_at);
CREATE INDEX IF NOT EXISTS idx_login_ip_time    ON login_attempts(ip,    attempted_at);

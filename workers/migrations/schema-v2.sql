-- v2 추가 스키마: 강연/투어/예약/후기/알림/상호작용
-- v1(schema.sql)에 이미 만들어진 테이블은 건드리지 않는다.

CREATE TABLE IF NOT EXISTS lectures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT,
  venue TEXT,
  host TEXT,
  next TEXT,
  starts_at TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 90,
  capacity INTEGER NOT NULL DEFAULT 30,
  price INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_lectures_starts ON lectures(starts_at);

CREATE TABLE IF NOT EXISTS lecture_registrations (
  id TEXT PRIMARY KEY,
  lecture_id TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  paid_at TEXT,
  cancelled_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_lecreg_lecture ON lecture_registrations(lecture_id);
CREATE INDEX IF NOT EXISTS idx_lecreg_user ON lecture_registrations(user_id);

CREATE TABLE IF NOT EXISTS lecture_reviews (
  id TEXT PRIMARY KEY,
  lecture_id TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  text TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_lecrev_lecture ON lecture_reviews(lecture_id);

CREATE TABLE IF NOT EXISTS tours (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  group_size TEXT,
  level TEXT,
  next TEXT,
  starts_at TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 240,
  capacity INTEGER NOT NULL DEFAULT 8,
  price INTEGER NOT NULL DEFAULT 0,
  hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS tour_reservations (
  id TEXT PRIMARY KEY,
  tour_id TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  qty INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  paid_at TEXT,
  cancelled_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_tourres_tour ON tour_reservations(tour_id);
CREATE INDEX IF NOT EXISTS idx_tourres_user ON tour_reservations(user_id);

CREATE TABLE IF NOT EXISTS tour_reviews (
  id TEXT PRIMARY KEY,
  tour_id TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  text TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_tourrev_tour ON tour_reviews(tour_id);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT,
  message TEXT,
  from_name TEXT,
  post_id INTEGER,
  post_title TEXT,
  lecture_id TEXT,
  tour_id TEXT,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS post_likes (
  post_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id TEXT NOT NULL,
  post_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  post_id INTEGER,
  post_title TEXT,
  reporter_id TEXT,
  reporter_name TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at DESC);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actor TEXT,
  action TEXT,
  target TEXT,
  details_json TEXT,
  ip TEXT
);
CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit_log(ts DESC);

-- 뱅기노자 D1 schema-v9 (v00.148) — page-view 분석 인프라
--
-- 배경: 사용자 요청 '대시보드 일/주/월 방문자 + 유입 경로 + 차트'.
-- 이전엔 게시글 작성 횟수를 활동 proxy 로 사용 (v00.146). 이제 실제 page-view 측정.
--
-- 정책:
--   ① 익명 트래킹 — userId 는 옵션. session_id 는 클라이언트 sessionStorage UUID.
--   ② IP 는 hash 만 저장 (개인정보 최소화).
--   ③ 30일 retention — INSERT 시 1/100 확률로 GC (audit_log 와 동일 패턴).
--   ④ referrer host 만 저장 (전체 URL 저장 안 함, 개인정보 + 노이즈 감소).

CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  route TEXT NOT NULL,
  ts TEXT NOT NULL,
  session_id TEXT,
  user_id TEXT,
  referrer_host TEXT,
  user_agent TEXT,
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_page_views_ts ON page_views(ts);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user ON page_views(user_id);

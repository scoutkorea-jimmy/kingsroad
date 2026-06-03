-- 뱅기노자 D1 schema-v10 (v00.261) — users.last_login_at
--
-- 배경: 관리자 회원 탭에서 '마지막 접속일'을 노출하기 위해 단일 timestamp 컬럼 추가.
-- 정책 (GDPR / 한국 PIPA):
--   ① 데이터 최소화 — IP/UA 미수집, 단일 ISO timestamp 만 저장(덮어쓰기).
--   ② 목적 제한 — 휴면 계정 식별, 보안 모니터링, 계정 운영. 마케팅 사용 금지.
--   ③ 법적 근거 — 정당한 이익(GDPR Art 6(1)(f)).
--   ④ 보관 기간 — 계정 존속 동안. ON DELETE CASCADE 로 탈퇴 시 자동 삭제.
--   ⑤ 투명성 — 개인정보처리방침에 접속기록 수집/이용 고지 (data.js 기본 텍스트 갱신).
--
-- 갱신 시점: POST /api/auth/login 성공 + GET /api/auth/me (세션 갱신, 24h throttle).
--   refresh 매번 갱신하지 않는 이유: tab 열어두고 자동 polling 시 매번 UPDATE 가
--   불필요한 D1 write — 일/세션 단위 정확도면 충분.

ALTER TABLE users ADD COLUMN last_login_at TEXT;
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);

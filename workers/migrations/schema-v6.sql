-- 뱅기노자 D1 schema-v6 (v00.127) — user_columns 에 기고처(source_credit) + 링크(source_url) 컬럼 추가
--
-- 배경: 사용자 요청 '칼럼에는 기고처와 링크를 달수있게해줘'.
--   외부 매체에서 기고된 칼럼의 경우, 원문 출처(예: 한겨레, 조선일보) + 원문 URL 표기 필요.
--
-- 동작: 두 컬럼 모두 NULLABLE — 기존 칼럼 영향 없음. 신규 작성 시 옵셔널 입력.
--
-- 실행 (사용자 1회):
--   cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-v6.sql
--
-- 검증:
--   wrangler d1 execute banginoja-db --remote --command "PRAGMA table_info(user_columns)"
--   → cid 15: source_credit / cid 16: source_url 추가 확인

ALTER TABLE user_columns ADD COLUMN source_credit TEXT;
ALTER TABLE user_columns ADD COLUMN source_url TEXT;

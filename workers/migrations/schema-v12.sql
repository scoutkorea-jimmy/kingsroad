-- schema-v12.sql — v00.295.002
-- 책 주문에 '세금계산서 발행 요청' 을 담을 칸을 만든다.
--
-- 왜 필요한가:
--   대량 구매 시 세금계산서를 끊어 달라는 요청이 들어오는데, book_orders 에 담을 칸이 없었다.
--   임시로 주문 메모에 적게 안내했지만(v00.295.001) 메모는 자유 문장이라
--     · 운영자가 어떤 주문이 계산서 대상인지 한눈에 못 고른다
--     · 사업자등록번호가 빠지거나 형식이 제각각이어도 걸러지지 않는다
--   현금영수증도 같은 이유로 memo prefix 에 얹혀 있다(v00.218). 그건 이번 범위가 아니라 그대로 둔다.
--
-- 적용(remote 운영 DB):
--   cd workers && npx wrangler d1 execute banginoja-db --remote --file=migrations/schema-v12.sql
--
-- ⚠ 함정 — --file 은 remote 대상일 때 확인 프롬프트를 띄운다. 사람이 없는 환경(스크립트·에이전트)에서는
--    답을 못 해 "Resource location: remote" 만 찍고 조용히 아무것도 하지 않는다. 오류도 안 난다.
--    -y 를 붙여도 마찬가지였다(wrangler 4.97.0 실측). 그럴 땐 문장 하나씩 --command 로 넣고,
--    반드시 PRAGMA table_info(book_orders) 로 컬럼이 실제로 생겼는지 눈으로 확인할 것.
--
-- ALTER TABLE ADD COLUMN 은 비파괴적이다. 기존 주문은 NULL 로 남고,
-- 워커가 NULL 을 '미신청' 으로 읽는다. 재실행 시 "duplicate column name" 이면 이미 적용된 것이다.

ALTER TABLE book_orders ADD COLUMN tax_invoice INTEGER;  -- 1 = 발행 요청
ALTER TABLE book_orders ADD COLUMN biz_name    TEXT;     -- 상호(법인명)
ALTER TABLE book_orders ADD COLUMN biz_no      TEXT;     -- 사업자등록번호
ALTER TABLE book_orders ADD COLUMN biz_ceo     TEXT;     -- 대표자명
ALTER TABLE book_orders ADD COLUMN biz_email   TEXT;     -- 계산서 받을 이메일

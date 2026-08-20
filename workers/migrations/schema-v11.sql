-- schema-v11.sql — v00.294.008
-- 게시글의 첨부파일 · 첨부이미지 · 태그를 정식 컬럼으로 저장한다.
--
-- 왜 필요한가:
--   posts 테이블에는 이 세 가지를 담을 칸이 처음부터 없었다. 그래서
--     · 첨부파일(attachments) : 워커가 받자마자 버렸다 → R2 에 파일만 주인 없이 남고
--                               새로고침하면 다운로드 링크가 사라진다.
--     · 태그(tags)            : 같은 이유로 저장되지 않았다.
--     · 첨부이미지(images)    : v00.242 응급 조치로 본문 HTML 끝에 <img> 를 끼워 넣어
--                               겨우 보이게 해 뒀다(정식 저장 아님 · body 가 비대해진다).
--
-- 적용(remote 운영 DB):
--   cd workers && npx wrangler d1 execute banginoja-db --remote --file=migrations/schema-v11.sql
--
-- ALTER TABLE ADD COLUMN 은 비파괴적이다. 기존 86행은 NULL 로 남고, 워커가 NULL 을
-- 빈 배열로 읽는다. 재실행 시 "duplicate column name" 이면 이미 적용된 것이다.

ALTER TABLE posts ADD COLUMN images_json      TEXT;
ALTER TABLE posts ADD COLUMN attachments_json TEXT;
ALTER TABLE posts ADD COLUMN tags_json        TEXT;

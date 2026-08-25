-- schema-v15.sql — v00.307.000
-- 댓글마다 '공감' 을 누를 수 있게 한다.
--
-- 왜 필요한가:
--   글에는 좋아요(post_likes)가 있었지만 댓글에는 아무 반응 수단이 없었다.
--   좋은 댓글에 답글을 달자니 부담스럽고, 그냥 지나치면 쓴 사람은 읽혔는지도 모른다.
--
-- 모양은 post_likes 를 그대로 본떴다 (schema-v2.sql:111).
--   (comment_id, user_id) 복합 PK — 한 사람이 같은 댓글에 두 번 못 누른다.
--   **이 PK 가 곧 중복 방지 장치다.** 워커는 세지 않고 INSERT OR IGNORE 의 changes 로 판정한다
--   (세고 나서 넣으면 빠르게 두 번 누를 때 같은 숫자를 본다 — CLAUDE.md 금지 항목).
--
-- ⚠ FK 를 걸지 않는다. content_comments 는 자기참조 FK 를 이미 쓰고 있고,
--    D1 에서 CASCADE 를 못 믿어 워커가 직접 지우는 방식을 v14 부터 택했다. 같은 원칙을 따른다.
--    → 워커의 handleCommentDelete / deleteCommentsFor 가 comment_likes 도 함께 지운다.
--      그 코드를 빼면 주인 없는 공감이 조용히 쌓인다.
--
-- ⚠ 순서를 지킬 것 — **표를 먼저 만들고 워커를 배포한다.**
--    반대로 하면 배포 직후 공감 조회가 실패한다. (워커는 실패해도 댓글 본문은 보이도록
--    try/catch 로 감쌌지만, 굳이 그 길을 탈 이유가 없다.)
--
-- 적용 (remote 운영 DB) — ⚠ --file 은 remote 에서 확인 프롬프트에 막혀 **조용히 아무것도 안 한다.**
--   반드시 --command 로 한 문장씩 넣을 것.
--
--   cd workers
--   npx -y wrangler@4.124.0 d1 execute banginoja-db --remote --command="CREATE TABLE IF NOT EXISTS comment_likes (comment_id INTEGER NOT NULL, user_id TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (comment_id, user_id));"
--   npx -y wrangler@4.124.0 d1 execute banginoja-db --remote --command="CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);"
--
--   확인 (0 이 나와야 정상 — 표가 비어 있다):
--   npx -y wrangler@4.124.0 d1 execute banginoja-db --remote --command="SELECT COUNT(*) AS n FROM comment_likes;"
--
--   그 다음에 워커 배포:
--   npx -y wrangler@4.124.0 deploy

CREATE TABLE IF NOT EXISTS comment_likes (
  comment_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);

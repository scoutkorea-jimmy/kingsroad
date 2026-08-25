-- schema-v14.sql — v00.306.004
-- 댓글이 붙는 대상을 '글 번호' 에서 '무엇의 무엇' 으로 넓힌다.
--
-- 왜 필요한가:
--   옛 comments 는 post_id INTEGER + posts(id) FK 였다. 칼럼 아이디는 'col-0486a18d…' 같은
--   문자열이라 **애초에 담을 수가 없었다.** 그래서 칼럼 댓글은 화면만 있고 서버로 가는 길이
--   없었다 — 등록하면 그 자리에서 사라졌고, 아무도 오류를 보지 못했다.
--
-- 왜 지금인가:
--   2026-08-25 아침까지 comments 는 **0행**이었다(댓글이 한 번도 저장된 적이 없던 버그).
--   낮에 v00.306.001 로 고친 뒤 7건이 쌓였다. 지금이 옮길 것이 가장 적은 시점이다.
--
-- ⚠ 옛 테이블(comments)은 **지우지 않는다.** 되돌릴 길이다.
--    새 워커는 content_comments 만 본다. 문제가 생기면 직전 워커를 다시 배포하면
--    옛 comments 가 그대로 살아 있어 즉시 원상복귀된다.
--
-- ⚠ FK 로 따라오던 ON DELETE CASCADE 가 사라진다 — 대상이 두 종류라 한 테이블을 못 가리킨다.
--    워커의 handlePostDelete / handleColumnDelete 가 deleteCommentsFor 로 직접 지운다.
--    그 코드를 빼면 주인 없는 댓글이 조용히 쌓인다.
--
-- 적용 (remote 운영 DB) — ⚠ --file 은 remote 에서 확인 프롬프트에 막혀 **조용히 아무것도 안 한다.**
--   반드시 --command 로 한 문장씩 넣고, 마지막에 개수를 눈으로 대조할 것.
--
--   cd workers
--   npx -y wrangler@4.124.0 d1 execute banginoja-db --remote --command="CREATE TABLE IF NOT EXISTS content_comments (id INTEGER PRIMARY KEY AUTOINCREMENT, target_type TEXT NOT NULL, target_id TEXT NOT NULL, parent_id INTEGER, body TEXT NOT NULL, author_id TEXT, author TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL, FOREIGN KEY (parent_id) REFERENCES content_comments(id) ON DELETE CASCADE);"
--   npx -y wrangler@4.124.0 d1 execute banginoja-db --remote --command="CREATE INDEX IF NOT EXISTS idx_content_comments_target ON content_comments(target_type, target_id);"
--   npx -y wrangler@4.124.0 d1 execute banginoja-db --remote --command="CREATE INDEX IF NOT EXISTS idx_content_comments_author ON content_comments(author_id);"
--   npx -y wrangler@4.124.0 d1 execute banginoja-db --remote --command="INSERT INTO content_comments (id, target_type, target_id, parent_id, body, author_id, author, created_at) SELECT id, 'post', CAST(post_id AS TEXT), parent_id, body, author_id, author, created_at FROM comments WHERE id NOT IN (SELECT id FROM content_comments);"
--
--   대조 (양쪽 수가 같아야 한다):
--   npx -y wrangler@4.124.0 d1 execute banginoja-db --remote --command="SELECT (SELECT COUNT(*) FROM comments) AS old, (SELECT COUNT(*) FROM content_comments) AS new;"
--
--   그 다음에야 워커를 배포한다 (배포 전까지 옛 워커가 옛 테이블을 계속 쓴다 — 끊김 없음).
--   npx -y wrangler@4.124.0 deploy

CREATE TABLE IF NOT EXISTS content_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target_type TEXT NOT NULL,          -- 'post' | 'column'
  target_id   TEXT NOT NULL,          -- posts.id(숫자를 문자로) | user_columns.id('col-xxxx')
  parent_id INTEGER,
  body TEXT NOT NULL,
  author_id TEXT,
  author TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_id) REFERENCES content_comments(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_content_comments_target ON content_comments(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_content_comments_author ON content_comments(author_id);

INSERT INTO content_comments (id, target_type, target_id, parent_id, body, author_id, author, created_at)
SELECT id, 'post', CAST(post_id AS TEXT), parent_id, body, author_id, author, created_at
FROM comments WHERE id NOT IN (SELECT id FROM content_comments);

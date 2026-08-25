# ACTIVE — 댓글 최신순 정렬 + 댓글 공감

> **PC가 바뀌었다면 이 파일부터 읽으세요.**

| 항목 | 값 |
|---|---|
| 상태 | **완료 — D1 표 생성 + 워커 배포 + 프론트 배포 전부 끝** |
| 시작 | 2026-08-26 |
| 완료 | 2026-08-26 |
| 기준 버전 | v00.306.009 → **v00.307.000** |
| 직전 건 | [done/2026-08-23-walk-independence-prefix.md](done/2026-08-23-walk-independence-prefix.md) |

---

## 1. 지시 내역 (사용자 원문)

> 댓글들의 정렬은 최신순을 기본으로 해줘. 최신댓글이 위로 올라오게.
> 그리고 댓글마다 공감할 수 있는 기능도 추가해줘

이어서:

> @를 달면 비밀댓글로 가는건가? 이것도 확인해줘. 내가 비밀댓글 기능을 만든적이 없어서 확인하는거야
> 근데 비밀댓글이라고 가려진 댓글들은 뭐야?
> D1 테이블 생성이랑 워커 배포는 바로 해줘

### 확정된 선택 (사용자 응답)

| 물음 | 답 | 근거 |
|---|---|---|
| 답글도 최신순? | **답글도 최신순** | 사용자 선택. 추천은 '답글은 등록순'이었으나 사용자가 전부 최신순을 택함 |
| 정렬 전환 버튼? | **넣는다** | 기본 최신순 + `최신순/등록순` 토글 |
| 공감 형태? | **공감 하나(♥)** | 게시글 좋아요와 같은 방식. 이모지 여러 종류는 보류 |
| 배포 | **AI 가 직접 D1 생성 + wrangler deploy** | 사용자 명시 지시 |

---

## 2. 사전 조사 결과 — **다시 조사하지 말 것**

### 비밀댓글 기능은 **존재하지 않는다** (2026-08-26 전수 확인)

사용자가 "비밀댓글이라고 가려진 댓글"을 봤다고 했으나, 코드·DB·운영 데이터 어디에도 없다.

| 확인 | 방법 | 결과 |
|---|---|---|
| 문구 | `grep -rn "비밀댓글\|비밀 댓글\|비공개 댓글\|비공개댓글" .` | **0건** |
| DB 구조 | `content_comments` (schema-v14.sql:36) | 컬럼 8개 — 공개/비공개 구분 칼럼 **없음** |
| 게시판 권한 | `GET /api/categories` 실측 | 6곳 전부 `allow_comment_read = 1` |
| 실제 댓글 | `GET /api/comments` 전수 (23건) | 전부 평문 정상 노출 |
| 가림 UI | `grep "🔒\|blur(\|●●\|마스킹"` | 댓글 관련 **0건** |

**`@` 는 멘션(부르기)일 뿐이다.** [CommunityPage.jsx:517](../../pages/CommunityPage.jsx#L517)
`renderCommentText` 가 `@토큰`을 골드로 강조하고, `MentionTextarea` 가 자동완성을 띄운다.
비밀·비공개와 무관하다.

⚠ **알림은 `@` 가 아니라 답글 관계로 간다** — 글 작성자에게 1건, `parentId` 가 있으면
부모 댓글 작성자에게 1건([index.html 아님] workers/src/index.js:926~955).
`@홍길동` 을 적어도 홍길동에게는 알림이 **가지 않는다**. 사용자가 이걸 기대할 수 있으니 확인 필요.

**결론 (스크린샷 확인 완료) — 기능이 아니라 회원이 본문에 그렇게 적은 것이었다.**

```
GET /api/comments?targetType=post&targetId=139
  11 | 박유담 | 2026-08-25T13:44:08.320Z | "@안윤형 비밀 댓글입니다"
```

`@` 를 붙이면 지목한 사람에게만 보이는 줄 알고 시험 삼아 쓴 것으로 보인다.
실제로는 **모두에게 그대로 보인다** — 가려진 게 아니라 안 가려진 것이다.
회원이 오해하고 있을 수 있으니 안내가 필요하다.

### 댓글 구조 지도

| 무엇 | 어디 |
|---|---|
| DB 표 | `content_comments` — [schema-v14.sql:36](../../workers/migrations/schema-v14.sql#L36) |
| 목록/작성/삭제 핸들러 | [workers/src/index.js:885](../../workers/src/index.js#L885) |
| 창구 | `GET/POST /api/comments` · `DELETE /api/comments/:id` (옛 `/api/posts/:id/comments` 는 껍데기) |
| 통신 헬퍼 | [api.js:194](../../api.js#L194) |
| 캐시 | `window.BGNJ_COMMENTS` — [data.js:1680](../../data.js#L1680) |
| 트리 컴포넌트 | `CommentTree` — [CommunityPage.jsx:529](../../pages/CommunityPage.jsx#L529) |
| 쓰는 곳 **둘** | [CommunityPage.jsx:2502](../../pages/CommunityPage.jsx#L2502) · [ColumnPage.jsx:355](../../pages/ColumnPage.jsx#L355) |

`CommentTree` 는 `export` 되어 ColumnPage 가 `import` 한다 —
**한 번 고치면 게시글·칼럼 양쪽에 동시에 적용된다.**

### 공감이 본뜰 기존 구현

게시글 좋아요 = `post_likes(post_id, user_id, created_at)` PK 복합
([schema-v2.sql:111](../../workers/migrations/schema-v2.sql#L111)) + `handleLikeToggle`
([index.js:1641](../../workers/src/index.js#L1641)). 같은 모양으로 `comment_likes` 를 만든다.

⚠ 단, `handleLikeToggle` 은 **SELECT 로 세고 나서 INSERT** 한다 — CLAUDE.md 가 금지하는 형태다.
새로 만드는 `comment_likes` 토글은 `INSERT OR IGNORE` 의 `changes` 로 **한 문장에 판정**한다.

---

## 3. 범위 / 비범위

**범위**
- 댓글 정렬 최신순 기본 (최상위·답글 모두) + `최신순/등록순` 전환
- 댓글 공감 1종 토글 (DB·서버·통신·캐시·화면)
- D1 표 생성 + 워커 배포 + 프론트 커밋/푸시

**비범위 (보류)**
- 이모지 여러 종류 반응
- `@멘션 알림` — 지금은 안 간다. 사용자 확인 후 별건
- 비밀댓글 기능 신설 — 사용자 답변 대기

---

## 4. 체크리스트

- [x] `workers/migrations/schema-v15.sql` — `comment_likes`
- [x] 워커 — 목록 응답에 `like_count`·`liked`
- [x] 워커 — `POST /api/comments/:id/like` 토글 (원자적)
- [x] 워커 — 댓글 삭제·대상 삭제 시 공감 같이 정리
- [x] `api.js` — `comments.like()`
- [x] `data.js` — `_toUi` 공감 필드 + `toggleLike` (낙관적·실패 시 원복)
- [x] `CommentTree` — 정렬(최신순 기본) + 공감 버튼
- [x] 정렬 전환 버튼 — CommunityPage · ColumnPage
- [x] 버전 3종 동기 (v00.307.000)
- [x] `node tools/check-all.mjs` 통과 (smoke §17 신설 14건 → 전체 196건)
- [x] D1 표 생성 → 워커 배포 (**이 순서**)
- [x] commit + push

---

## 5. 배포 실측 (2026-08-26)

```
D1  CREATE TABLE comment_likes            → changed_db: true
D1  CREATE INDEX idx_comment_likes_comment → changed_db: true
D1  SELECT COUNT(*) FROM comment_likes     → 0행 (정상)
워커 Version ID 4d2db583-9615-49e1-ace9-1694b44557ba
검증 GET /api/comments (post 139) → 세 댓글 모두 like_count 0 / liked 0
검증 POST /api/comments/11/like (비로그인) → 401
```

## 6. 다음 사람에게

- **정렬은 서버가 아니라 화면에서 뒤집는다.** 서버는 계속 `created_at ASC` 로 준다
  (`handleCommentsList`). 뒤집는 규칙은 `sortComments` 하나뿐이고, smoke §17 이
  **실제로 실행해서** 순서를 확인한다. 서버 ORDER BY 를 바꾸면 시험이 이중으로 뒤집힌다 — 건드리지 말 것.
- **공감 조회는 실패해도 댓글을 가리지 않는다.** `loadCommentLikes` 의 try/catch 가 그 장치다.
  이걸 걷어내면 표 하나 때문에 댓글 화면이 통째로 빈다.
- **보류 — `@멘션 알림`.** 지금 `@홍길동` 을 써도 홍길동에게는 알림이 안 간다.
  알림은 글 작성자와 부모 댓글 작성자에게만 간다. 사용자가 이걸 기대할 수 있다.
- **보류 — 진짜 비밀댓글.** 위 §2 결론 참조. 만들려면 `content_comments` 에 컬럼 추가 +
  `handleCommentsList` 에서 본인·글쓴이·관리자 외에는 본문을 지우고 내려야 한다
  (**목록에서 지워야 한다 — 화면에서 가리면 개발자도구로 다 보인다**).

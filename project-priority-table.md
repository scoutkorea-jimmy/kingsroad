# Project Priority Table

## Purpose

This document fixes the current implementation priority order so context is not lost while development continues.

## Priority Table

| Priority | Feature Group | Current Status | Why It Comes First | Done Means |
|---|---|---|---|---|
| P1 | Authentication and authorization | ✅ 완료 | Most other features depend on account and permission structure | Real sign up, login, session persistence, role separation |
| P1 | Data storage architecture | ✅ 완료 | `localStorage` is not enough for real operations | Storage for members, posts, columns, orders is decided and wired |
| P1 | Admin publishing to public site connection | ✅ 완료 | Admin actions must appear on the public site to be meaningful | Admin-created columns and managed content appear on public pages |
| P2 | Community serverization | ✅ 완료 | This area already has the most UI and interaction work done | Posts, comments, replies, likes, bookmarks, reports, notifications, badges |
| P2 | Admin operational tooling | ✅ 완료 | Some actions are named but not truly functional yet | Member management, audit log, auto-grade promotion, legal/FAQ editing |
| P3 | External DB + server auth migration | 미착수 | local-first is the single biggest blocker to real operations | Real users can register and data persists across devices/browsers |
| P3 | PG payment integration | 미착수 | Bank transfer is a temporary workaround for lectures, tours, and books | Actual payment gateway wired to all three purchase flows |
| P4 | Image external storage | 미착수 | base64 in localStorage will hit quota in real operations | Images stored outside localStorage (S3 / Cloudflare R2 or similar) |
| P4 | Email notifications | 미착수 | D-1 reminders and status-change emails are expected by users | Lecture/tour D-1 alert, order status change email |
| P5 | Refund / cancellation flow | ✅ 완료 | Cancellation exists but actual refund processing is manual | Refund request + admin processing + status tracking |
| P5 | Full-text search + sort options | ✅ 완료 | Community search is title-only, no sort options | Search body text, sort by popularity/comments |
| P5 | Book reader reviews | ✅ 완료 | Book detail page has hardcoded dummy reviews | Real user reviews wired to `WSD_BOOK_ORDERS` confirmed orders |

## Decisions Needed From User

| Topic | Decisions Needed |
|---|---|
| Authentication | External auth provider (Firebase / Supabase / custom) or keep extending local-first |
| Database | Backend approach — Firebase Firestore, Supabase, or custom API |
| Payment | PG provider (KG이니시스, 토스페이먼츠, 포트원 등) and currency handling for EN edition |
| Image storage | S3 / Cloudflare R2 / Supabase Storage — pick one before image quota hits |
| Email | Email service provider for transactional emails (Resend, SendGrid, etc.) |
| Refund policy | How refunds are processed and who approves |

## Recommended Order

1. External DB + server auth (unblocks everything else)
2. PG payment integration
3. Image external storage
4. Email notifications
5. Refund / cancellation flow
6. Full-text search + sort
7. Book reader reviews

## P1 Status

완료.

### P1 완료 항목

- 인증/권한
  - `WSD_AUTH` 기반 local-first 인증 구조로 정리됨
  - 회원가입, 로그인, 로그아웃, 세션 유지가 같은 저장 구조를 사용함
- 데이터 저장 구조
  - `WSD_DB`, `WSD_STORES`, `WSD_SAVE` 기준으로 엔티티 책임이 분리됨
  - helper 계층 유지 + 저장소 구현 교체 구조로 확정
- 관리자 발행물과 공개 페이지 연결
  - 관리자 발행 칼럼이 `WSD_COLUMNS.listPublic()`을 통해 공개 칼럼 페이지와 홈 화면에 반영됨

### P1 완료 처리 기준 메모

- 현재 프로젝트는 GitHub Pages 정적 배포가 운영 기준이므로, 외부 서버 없이도 명확한 인증/저장 구조가 있어야 했다.
- P1의 목표는 "외부 서버 즉시 도입"이 아니라 "확장 가능한 저장 구조를 먼저 확정하는 것"이었다.
- 이후 외부 DB나 API를 도입할 때는 현재 엔티티 구조를 유지한 채 저장소 구현만 교체하는 방향으로 진행한다.

## P2 Status

완료.

### P2 완료 항목

- 커뮤니티 실서비스화
  - 게시글 작성/수정/삭제, 댓글 등록/삭제, 1단계 답글 트리(`CommentTree`)
  - 좋아요·북마크·신고 운영 큐·댓글 알림·작성자 등급 배지·페이지네이션
  - 해시태그·이미지 슬라이더·MY ACCESS 배너
- 관리자 운영 기능 고도화
  - `MemberAdminPanel` — 실 회원 목록, 등급 변경, 정지/해제, 삭제, 활동 이력
  - `AuditLogPanel` + `WSD_AUDIT` — 핵심 액션 자동 감사 기록
  - `WSD_GRADE_PROMO` — 활동 기반 자동 등급 승격
  - `LegalAdminPanel / FaqAdminPanel` + 공개 `LegalPage / FaqPage`

### P2 이후 미착수 항목 (추후 고도화)

- 커뮤니티 본문 검색 (현재 제목만)
- 정렬 다양화 (현재 최신순만)
- 인기글 / 주간 트렌드
- 이미지 외부 스토리지 (현재 base64 in-localStorage)

## P3+ Status

### 진행 중 / 예정

모든 P3+ 항목은 미착수 상태. 우선순위 순:

1. 외부 DB + 서버 인증 전환 **(P3 — 1순위)**
2. PG 결제 연동 **(P3 — 2순위)**
3. 이미지 외부 스토리지 **(P4)**
4. 이메일 알림 인프라 **(P4)**
5. 환불 처리 흐름 **(P5 — ✅ 완료)**
6. 본문 검색·정렬 다양화 **(P5 — ✅ 완료)**
7. 독자 리뷰 연동 (책) **(P5 — ✅ 완료)**

## File Naming Rule

- English file names are the default rule.
- Planning and documentation files should follow the same rule.

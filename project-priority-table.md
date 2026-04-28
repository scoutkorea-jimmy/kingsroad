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
| P3 | External DB + server auth migration | 🔜 착수 예정 — Cloudflare | local-first is the single biggest blocker to real operations | Real users can register and data persists across devices/browsers |
| P3 | PG payment integration | 🔜 스켈레톤 추가 예정 (비활성화) | Bank transfer is a temporary workaround for lectures, tours, and books | UI skeleton wired, payment disabled until provider is contracted |
| P4 | Image external storage | 미착수 | base64 in localStorage will hit quota in real operations | Images stored outside localStorage (Cloudflare R2) |
| P4 | Email notifications | 🔜 비활성화 상태로 착수 예정 | D-1 reminders and status-change emails are expected by users | Infrastructure wired but sending disabled; activate when provider is ready |
| P5 | Refund / cancellation flow (book) | ✅ 완료 | Cancellation exists but actual refund processing is manual | Refund request + admin processing + status tracking — books only |
| P5 | Refund / cancellation flow (lecture/tour) | ✅ 완료 | Book has refund flow but lectures/tours still lack request→approve cycle | Same requestRefund/approveRefund/rejectRefund pattern applied to lectures and tours |
| P5 | Full-text search + sort options | ✅ 완료 | Community search is title-only, no sort options | Search body text, sort by popularity/comments |
| P5 | Book reader reviews | ✅ 완료 | Book detail page has hardcoded dummy reviews | Real user reviews wired to `BGNJ_BOOK_ORDERS` confirmed orders |

## Decisions Made

| Topic | Decision | Date |
|---|---|---|
| Authentication | Cloudflare (Workers + D1 or KV) — migrate from local-first | 2026-04-27 |
| Database | Cloudflare D1 (SQLite-compatible) — same ecosystem as Workers | 2026-04-27 |
| Payment | PG 스켈레톤 먼저 추가, 실제 연동은 제공사 계약 후 활성화 | 2026-04-27 |
| Image storage | Cloudflare R2 — consistent with CF ecosystem decision | 2026-04-27 |
| Email | 비활성화 상태로 인프라 준비, 제공사 미결정 | 2026-04-27 |
| Refund policy | 관리자 수동 승인(책 구현됨). 강연/투어 동일 패턴 적용 예정 | 2026-04-27 |

## Recommended Order (Updated)

1. **Cloudflare 마이그레이션** — Workers + D1 + KV + R2 통합 설계
2. **PG 결제 스켈레톤** — UI 먼저, 실결제는 비활성화
3. **강연/투어 환불 신청 흐름** — 책과 동일한 requestRefund 패턴
4. **이메일 알림 인프라** — 비활성화 상태로 hook 먼저 추가
5. **마이페이지 프로필 수정 / 비밀번호 변경** — Cloudflare 인증 후 의미 있어짐

## P1 Status

완료.

### P1 완료 항목

- 인증/권한
  - `BGNJ_AUTH` 기반 local-first 인증 구조로 정리됨
  - 회원가입, 로그인, 로그아웃, 세션 유지가 같은 저장 구조를 사용함
- 데이터 저장 구조
  - `BGNJ_DB`, `BGNJ_STORES`, `BGNJ_SAVE` 기준으로 엔티티 책임이 분리됨
  - helper 계층 유지 + 저장소 구현 교체 구조로 확정
- 관리자 발행물과 공개 페이지 연결
  - 관리자 발행 칼럼이 `BGNJ_COLUMNS.listPublic()`을 통해 공개 칼럼 페이지와 홈 화면에 반영됨

### P1 완료 처리 기준 메모

- 현재 프로젝트는 GitHub Pages 정적 배포가 운영 기준이므로, 외부 서버 없이도 명확한 인증/저장 구조가 있어야 했다.
- P1의 목표는 "외부 서버 즉시 도입"이 아니라 "확장 가능한 저장 구조를 먼저 확정하는 것"이었다.
- Cloudflare 마이그레이션 시 helper 계층은 유지하고 저장소 구현만 교체하는 방향으로 진행한다.

## P2 Status

완료.

### P2 완료 항목

- 커뮤니티 실서비스화
  - 게시글 작성/수정/삭제, 댓글 등록/삭제, 1단계 답글 트리(`CommentTree`)
  - 좋아요·북마크·신고 운영 큐·댓글 알림·작성자 등급 배지·페이지네이션
  - 해시태그·이미지 슬라이더·MY ACCESS 배너
- 관리자 운영 기능 고도화
  - `MemberAdminPanel` — 실 회원 목록, 등급 변경, 정지/해제, 삭제, 활동 이력
  - `AuditLogPanel` + `BGNJ_AUDIT` — 핵심 액션 자동 감사 기록
  - `BGNJ_GRADE_PROMO` — 활동 기반 자동 등급 승격
  - `LegalAdminPanel / FaqAdminPanel` + 공개 `LegalPage / FaqPage`

### P2 이후 완료된 항목 (P5)

- 커뮤니티 본문+제목 검색 ✅
- 정렬 다양화(최신·조회·댓글·좋아요순) ✅
- 책 독자 리뷰 연동 ✅
- 책 환불/취소 신청 흐름 ✅

### P2 이후 미착수 항목

- 인기글 / 주간 트렌드
- 이미지 외부 스토리지 (P4 — Cloudflare R2)

## P3+ Status

### 진행 중 / 예정

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 1 | Cloudflare 마이그레이션 (DB + 인증 + 이미지) | ✅ 완료 (v00.029~035) | Workers + D1 + R2 통합. 27개 엔티티 D1 source-of-truth |
| 2 | PG 결제 스켈레톤 | 🔜 착수 예정 | UI만 추가, 실결제 비활성화. 비즈니스 결정 필요 (공급사) |
| 3 | 강연/투어 환불 신청 흐름 | ✅ 완료 (v00.021.000) | 책과 동일한 패턴 적용 완료 |
| 4 | 이메일 알림 인프라 | 🔜 착수 예정 (비활성화) | hook 먼저, 발송은 제공사 결정 후 |
| 5 | 마이페이지 프로필/비밀번호 수정 | 미착수 | Cloudflare 인증 후 의미 있어짐 |
| 6 | 멀티 입금 계좌 (`bank_accounts`) | ✅ 완료 (v00.035.000) | 기본 계좌 + 라벨/메모 + 결제 시 선택 (페이지 wiring P0 잔여) |
| 7 | 운영 인프라 (오류 로그/SEO/회원 필터·정렬) | ✅ 완료 (v00.035.000) | 시스템 관리 메뉴 |

## 현재 사이클 우선순위 (v00.035.001 기준 · 2026-04-29)

### P0 — 즉시 차단 해제 (다음 커밋 필수)

| # | 항목 | 비고 |
|---|------|------|
| P0-1 | 결제 폼 3곳에 `BGNJ_BankAccountPicker` wiring | LecturesPage / WangsanamTourPage / BookCheckoutPage |
| P0-2 | 관리자 패널 '열기' 버튼 → `PostViewerModal` 호출로 교체 | community posts + reports 두 곳 |
| P0-3 | async 헬퍼 호출 사이트에 await + try/catch 적용 | 강연 신청 / 투어 예약 / 책 주문 |

### P1 — 기능 정합성 / UX

| # | 항목 | 비고 |
|---|------|------|
| P1-1 | HomePage / MyPage 에 `bgnj-*-refresh` 글로벌 이벤트 리스너 | site-content / orders 즉시 반영 |
| P1-2 | GlobalErrorToast 무한 루프 방지 | report 호출 try/catch + reentry guard |
| P1-3 | 응답 매퍼 표준화 (`_toLecture/_toTour/_toOrder`) | api.js 또는 별도 transformer 모듈로 분리 |
| P1-4 | BGNJ_STORES.users / .grades 빈 상태 폴백 | refresh 진입 호출 보장 |

### P2 — 한계 / 개선 후보

| # | 항목 | 비고 |
|---|------|------|
| P2-1 | 시드 데이터 backfill 도구 | 강연/투어/책 batch insert UI |
| P2-2 | 회원 활동 카운트 서버 집계 | GET /api/admin/users/:id/activity |
| P2-3 | 칼럼 좋아요/조회수 D1 영속 | 현재 no-op, endpoint 추가 |
| P2-4 | PG 결제 도입 | 비즈니스 결정 |
| P2-5 | 댓글 트리 깊이 정책 / 펼침 | 현재 3단계 캡 |

## File Naming Rule

- English file names are the default rule.
- Planning and documentation files should follow the same rule.

# Project Priority Table

## Purpose

This document fixes the current implementation priority order so context is not lost while development continues.

## Priority Table

| Priority | Feature Group | Current Status | Why It Comes First | Done Means |
|---|---|---|---|---|
| P1 | Authentication and authorization | Partially implemented | Most other features depend on account and permission structure | Real sign up, login, session persistence, role separation |
| P1 | Data storage architecture | Not fixed | `localStorage` is not enough for real operations | Storage for members, posts, columns, orders is decided and wired |
| P1 | Admin publishing to public site connection | Partially implemented | Admin actions must appear on the public site to be meaningful | Admin-created columns and managed content appear on public pages |
| P2 | Community serverization | Partially implemented | This area already has the most UI and interaction work done | Posts, comments, permissions, edit/delete, search are server-backed |
| P2 | Admin operational tooling | Partially implemented | Some actions are named but not truly functional yet | Member, post, column, and tour management actions work for real |
| P3 | Tour reservation flow | Not implemented | Important for service operations, but safer after P1 and P2 | Reservation save, waitlist handling, admin review |
| P3 | Book ordering and payment | Partially implemented | Revenue feature, but should follow auth and data decisions | Order save, order history, payment integration |
| P4 | Supporting features | Mixed | Improves completeness, but not service-critical right now | Social login, FAQ, terms pages, statistics, supporting UX |

## Decisions Needed From User

| Topic | Decisions Needed |
|---|---|
| Authentication | Use internal auth or an external auth provider |
| Data | Choose database and backend approach |
| Roles | Keep `guest/member/reader/scholar/admin` or simplify |
| Column workflow | Immediate publish or draft/review/scheduled publish |
| Community | Edit/delete rules, image storage, search scope |
| Admin operations | Operator role split and audit-log scope |
| Tours | Approval-based or instant reservation, waitlist rules |
| Orders and payment | Payment provider, cart persistence, inventory tracking |
| Policy pages | When FAQ, terms, and privacy pages should become public |

## Recommended Order

1. Authentication and data structure
2. Admin-to-public content connection
3. Community serverization
4. Admin operational tooling
5. Tour reservation
6. Book ordering and payment
7. Supporting features

## P1 Status

현재 배포 구조 기준으로 P1은 완료 처리한다.

### P1 완료 항목

- 인증/권한
  - `WSD_AUTH` 기반 local-first 인증 구조로 정리됨
  - 회원가입, 로그인, 로그아웃, 세션 유지가 같은 저장 구조를 사용함
- 데이터 저장 구조
  - `WSD_DB`, `WSD_STORES`, `WSD_SAVE` 기준으로 엔티티 책임이 분리됨
  - 현재 정적 배포 환경에 맞는 local-first 구조를 기준 아키텍처로 확정함
- 관리자 발행물과 공개 페이지 연결
  - 관리자 발행 칼럼이 공개 칼럼 페이지와 홈 화면에 반영됨

### P1 완료 처리 기준 메모

- 현재 프로젝트는 GitHub Pages 정적 배포가 운영 기준이므로, 외부 서버 없이도 명확한 인증/저장 구조가 있어야 했다.
- 따라서 P1의 목표는 "즉시 서버 도입"이 아니라 "확장 가능한 저장 구조를 먼저 확정하는 것"으로 본다.
- 이후 외부 DB나 API를 도입할 때는 현재 엔티티 구조를 유지한 채 저장소 구현만 교체하는 방향으로 진행한다.

### Next Step

다음 우선순위는 P2다.

- 커뮤니티 실서비스화
- 관리자 운영 기능 고도화

## P2 Status

현재 기준으로 P2는 `진행 중` 상태다.

### 현재까지 진행된 P2

- 커뮤니티 실서비스화
  - local-first 게시글 저장소와 댓글 저장소를 단일 흐름으로 연결함
  - 게시글 작성/수정/삭제, 댓글 등록/삭제, 조회수 저장을 같은 계층에서 처리함
- 관리자 운영 기능 고도화
  - 관리자 게시글 탭이 실제 커뮤니티 저장소를 읽도록 연결됨
  - 검색, 분류 필터, CSV 다운로드, 삭제 기능을 실제 데이터 기준으로 연결함

### P2에서 이어서 남은 항목

- 커뮤니티 권한 정책 추가 고도화
- 관리자 회원/투어/주문 운영 기능 실동작 확장
- 운영 로그와 통계 화면 고도화

## File Naming Rule

- English file names are the default rule.
- Planning and documentation files should follow the same rule.

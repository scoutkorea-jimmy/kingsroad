# `plans/` — 사이클별 작업 계획서

> **목적:** 각 작업(사이클) 시작 시 코드/명령보다 먼저 작성하는 task-level 계획서.
> **신설:** v00.152 — `feedback_task_plan_md` 룰. memory + ADMIN_VERSION_HISTORY 와 함께 작업 가이드의 한 축.

## 작성 규약

1. **언제** — 새 작업·요청 접수 직후 첫 액션. 정보 수집 / 코드 수정보다 먼저.
2. **파일명** — `v00.NNN.NNN-<짧은-슬러그>.md` (버전 사이클). 비-버전 작업은 `YYYY-MM-DD-<슬러그>.md`.
3. **최소 섹션** — ①사용자 요청 (원문) ②변경 대상 파일 (표) ③구현 단계 ④검증 기준 ⑤배포·커밋 메모 ⑥남은 위험.
4. **갱신** — 작업 진행 중 plan 이 어긋나면 plan 도 같이 갱신. 사용자 피드백 반영.
5. **사이클 종료 시** — 본 plan 은 그대로 두고, 한 줄 요약을 `ROADMAP.md` "사이클 완료 회고" + `pages/admin/AdminDesignHub.jsx` `ADMIN_VERSION_HISTORY` 에 옮긴다.

## 다른 문서와 관계

| 문서 | 시점 | 단위 | 위치 |
|---|---|---|---|
| `plans/<버전>.md` | task 접수 ~ 사이클 진행 | task-level (사이클 1개) | 본 폴더 |
| `ROADMAP.md` | 사이클 시작 (큐 1 에서 다음 항목 pull) / 종료 (한 줄 회고) | forward-looking 백로그 + 사이클 회고 | 저장소 루트 |
| `CONTEXT.md` | 작업 시작 시 §0 / §6 한 번 / 사이클 종료 시 §5 한 줄 | 누적 큰 그림 (운영 원칙·아키텍처) | 저장소 루트 |
| `ADMIN_VERSION_HISTORY` | 사이클 종료 시 신규 entry | 변경 상세 (사용자에게 보이는 운영 로그) | `pages/admin/AdminDesignHub.jsx` |
| `kms.md` | 시스템 변화 시 (구조·기능 변동) | 사이트 미션·기능정의서 (정적 사이트 가이드) | 저장소 루트 |

## 인덱스 (v00.152~)

| 사이클 | plan 파일 | commit |
|---|---|---|
| v00.152 | [v00.152.000-book-carousel.md](v00.152.000-book-carousel.md) | `70b9992` |
| v00.153 | [v00.153.000-book-page-rework.md](v00.153.000-book-page-rework.md) | `12472dd` |
| v00.154 | [v00.154.000-cart-bookId-multibook.md](v00.154.000-cart-bookId-multibook.md) | `5ffc8db` |
| v00.155 | [v00.155.000-chapter-subitems.md](v00.155.000-chapter-subitems.md) | `0e76713` |
| v00.156 | [v00.156.000-meta-sync-and-review.md](v00.156.000-meta-sync-and-review.md) | (current) |

# 뱅기노자 사이클 로드맵

> **목적:** 향후 작업 단위(사이클)의 단일 백로그. 사이클 시작 시 이 문서에서 다음 항목을 가져오고, 완료 시 status 갱신.
> **연관 문서:** 규칙은 [rules/](rules/), 작업 기록은 [rules/handoff/](rules/handoff/).
> 과거 사이클 히스토리는 [rules/handoff/done/archive-cycle-history.md](rules/handoff/done/archive-cycle-history.md).
> **마지막 갱신:** 2026-08-28 (v00.315 — 큐 1 실측 현행화: 끝난 항목 3건 삭제, 남은 것에 근거 첨부)
> **직전 갱신:** 2026-07-29 (문서 재편) · 그 전 2026-06-06 (v00.284 — 현행화 sweep: 완료 항목 정리 + 한켠 PMS 후속 백로그 재작성. 직전 갱신 v00.241/2026-05-09 이후 43버전 누적분 반영)

---

## 사용 규약

1. **사이클 시작** — 큐 1 의 첫 pending 항목을 in_progress 로 표시하고 작업.
2. **사이클 완료** — status `✅ done` + 한 줄 회고 (commit hash). `ADMIN_VERSION_HISTORY` 신규 엔트리는 항목과 1:1 대응.
3. **새 보고/발견** — 적절한 큐(코드측 / 워커의존 / 메이저)에 즉시 추가. 이 문서가 single source of truth.
4. **순서 변경** — 사용자 지시 또는 차단 발견 시 자유롭게 재정렬. 단 의존성(★) 명시 항목은 차단 해소 전 진입 금지.

---

## 우선순위 기준

> 2026-07-29 `project-priority-table.md` 에서 흡수. 개발은 이 순서를 따르고, 사용자가 명시적으로 승인하지 않는 한 임의로 건너뛰지 않습니다.

1. 인증/권한 → 2. 데이터 저장 구조 → 3. 관리자 발행물과 공개 페이지 연결 → 4. 커뮤니티 실서비스화 →
5. 관리자 운영 기능 고도화 → 6. 투어 예약 → 7. 책 주문/결제 → 8. 부가 기능

### 상세 표

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

### 결정 사항 (Decisions Made)

| Topic | Decision | Date |
|---|---|---|
| Authentication | Cloudflare (Workers + D1 or KV) — migrate from local-first | 2026-04-27 |
| Database | Cloudflare D1 (SQLite-compatible) — same ecosystem as Workers | 2026-04-27 |
| Payment | PG 스켈레톤 먼저 추가, 실제 연동은 제공사 계약 후 활성화 | 2026-04-27 |
| Image storage | Cloudflare R2 — consistent with CF ecosystem decision | 2026-04-27 |
| Email | 비활성화 상태로 인프라 준비, 제공사 미결정 | 2026-04-27 |
| Refund policy | 관리자 수동 승인(책 구현됨). 강연/투어 동일 패턴 적용 예정 | 2026-04-27 |

### 권장 순서 (Recommended Order)

> 2026-08-28 실측 — 다섯 중 셋이 이미 끝나 있었다. 남은 둘만 적는다.
> 끝난 것: Cloudflare 마이그레이션(Workers+D1+R2 가동 중) · 강연/투어 환불 흐름(위 표 P5 ✅) ·
> 마이페이지 비밀번호 변경(`PATCH /api/me/password`).

1. **이메일 알림 인프라** — 비활성화 상태로 hook 먼저. 제공사 미결정.
2. **PG 결제 스켈레톤** — UI 먼저, 실결제는 계약 후 활성화.

---

## 큐 1 — 다음 사이클

> **2026-08-28 실측 현행화.** 직전 갱신은 2026-07-29 였고 그 사이 30버전이 지났다.
> 아래는 **코드를 열어 확인한** 상태다. 끝난 항목은 지웠다 — 남아 있으면 매 세션이 헛돈다.
>
> 지운 것: `AuthAdminPage.jsx 9,273줄 분할`(**지금 1,252줄** — 분할이 이미 끝났다) ·
> `anchor scroll-margin-top`(**`styles.css:264` 에 `scroll-padding-top: 88px` 로 이미 있다**) ·
> `fire-and-forget admin save sweep`(**v00.313~314 완료** — 공통 관문 `BGNJ_SAVE_GUARD`).

### A. 한켠(자고 놀자) 예약 PMS 후속

- **OSM 지도 정확 핀** — 관리자 위도/경도 입력칸은 **있다**([HangyeonAdminPanel.jsx:703](pages/admin/HangyeonAdminPanel.jsx#L703)).
  남은 것은 **주소 자동 지오코딩**(Nominatim — `connect-src` 화이트리스트 추가 필요)뿐.
  지금은 좌표를 손으로 넣어야 하고, 안 넣으면 팔달로 도로 중심(35.8313, 127.1386)으로 떨어진다.
- **객실 '기준 인원' 설정 필드** — 카드 기준인원이 `min(2, 최대인원)` 자동 보정이다.
  객실별 기준 인원 + 초과 1인당 추가요금을 admin 에서 정하려면 `hk_room_types` 컬럼 추가.
  **사용자 의도 확인 필요** — 화면 문구는 이미 "기준인원 초과 시 추가요금" 이라고 말하는데
  실제로 받는 로직이 없다. 문구를 지우든 기능을 만들든 둘 중 하나는 해야 한다.
- **handleHkDay 성능** — day 쿼리가 객실당 최대 4종 가용성(숙박/시간제/주간/월간, 월간=30박 루프)을 센다.
  객실·조회가 늘면 지연. rate-rule 캐싱·쿼리 배치 후보. **아직 느리다는 신고는 없다.**

### B. 코드측 이월

- **책별 리뷰 분리** — [data.js:3041](data.js#L3041) · [data.js:3061](data.js#L3061) 이 `'kingsroad'` 를 하드코드한다.
  1권 가정의 잔재다. 책이 둘이 되는 순간 리뷰가 섞인다. **사용자 의도 확인 필요**(단일 vs 책별 탭).
- ~~**인라인 hex 색**~~ — **v00.316 완료.** 세어 보니 210 은 문자열·기록까지 센 수였고,
  실제로 색을 정하는 자리는 **46곳**이었다. 그중 **29곳이 boot.jsx**(토스트·오류 화면)로,
  어느 페이지 위에도 뜨는 자리라 다크에서 흰 판이 튀었다 → `var(--토큰, 원래색)` 으로 바꿨다.
  남은 17곳은 **의도적**이다(홈넥스트 관리자 편집 오버레이 · 유튜브 로고 `#FF0000` · 상태 색).
- **챕터 깊은 들여쓰기**(`-- ` 2단계+) — v00.155 의 1단계만 처리. 사용자 신호 시 추가.
- **scroll-to-top FAB** — 폼 영역 진입 시 자동 hide 검토. 민원이 오면.

### C. 외부 의존 (별 사이클)

- **PG 결제** — 무통장 입금/현장 결제 임시. 외부 연동 + 비용 발생. 별도 사이클.

---

## 큐 2 — 워커 배포 의존 (★ wrangler deploy 필요)

⚠ **2026-08-28 현재 넷이 대기 중이다.** 코드는 들어갔지만 `wrangler deploy` 전까지 서버에 없다.

| 무엇 | 왜 | 버전 |
|---|---|---|
| 깨진 JSON 한 줄이 엔드포인트를 죽이지 않게 | 한 행이 깨지면 목록 전체가 500 | v00.312 |
| `error_log` 30일 자동 청소 | 없으면 무한히 커져 D1 이 찬다 | v00.312 |
| 같은 사람의 같은 글 신고는 하나만 | 연타하면 '손볼 것' 숫자가 부푼다 | v00.312 |
| 등급이 바뀌면 알림을 만든다 | 지금까지 양쪽 어디도 안 만들고 있었다 | v00.314 |

```bash
cd workers && npx wrangler deploy
```

> 참고: 한켠 weekly/monthly 스키마(`hk_room_types` 4컬럼)는 v00.284 에서 `migrate-weekly-monthly.sql` 로 remote D1 적용 완료.

---

## 큐 3 — 메이저 마이그레이션 (별 사이클)

(현재 비어있음 — v00.090 Tiptap 3 완료. v00.100 React 19 보류 결정)

후보 (재검토 시점 도래 시):
- React 18 보안 EOL 도달 시 ESM 재구조화 사이클 진입
- ProseMirror / Lexical 같은 Tiptap 대안 검토 (유지보수 변경 시점)

---

## 큐 4 — 사용자 직접 작업 (코드 외)

| 항목 | 차단 영향 | 비고 |
|---|---|---|
| **HTTPS/SSL 확인** | bgnj.net SSL | 현재 `https://bgnj.net` 정상 서빙 확인됨(v00.284 점검). 라이브 회귀만 권장 — 미해결이면 아래 「HTTPS/SSL 도입 가이드」 참조 |
| **한켠 지도 좌표 입력** | 위치 핀 정밀도 | 관리자 → 숙소 관리 → 숙소 정보 → 지도 위도/경도 에 openstreetmap.org URL 의 mlat·mlon 입력(미입력 시 팔달로 기본값) |
| ✅ ~~Cloudflare Secrets 이관~~ | (v00.125 결정: 미진행 — 평문 유지) | |
| ✅ ~~schema-v4/v5 · seed-kv 적용~~ | (v00.113/v00.123 완료) | |

---

## 검증 권장 (사용자 직접 — v00.267~284 한켠 PMS + 이번 세션)

- [ ] **한켠 예약 흐름** — 자고 놀자 → 객실 카드 → 숙박/시간제/주간/월간 단위별 예약 접수 → 관리자 예약목록 반영
- [ ] **주간/월간** — 시작일 선택 시 체크아웃 자동(+7/+30박), 정액 결제, 더블부킹 차단(주간 예약 후 해당 구간 재고 차감)
- [ ] **위치/교통 지도** — OSM 지도 렌더 + 마커 + "큰 지도에서 보기" (v00.284.001 CSP 허용 후)
- [ ] **갤러리** — 작은 4장 3초마다 슬라이드 교체, 같은 사진 연속 미노출 (사진 0장 숙소도 크래시 없음 — v00.284.004)
- [ ] **R2 업로드** — admin 사진 업로드 → `/api/media/upload` 200 + 드롭존 UI 정상(v00.282 display:block fix)
- [ ] **Tiptap 3 회귀** — 글쓰기 모달 표/체크리스트/형광펜/정렬/코드블록/YouTube 정상

---

## HTTPS / SSL 도입 가이드 (사용자 직접 작업)

v00.064 에 코드 측 정합 완료(og:url 메타 + 조건부 HTTPS 강제 헬퍼). v00.109 부터 워커 ALLOWED_ORIGINS 가 https-only — 하단 §3 단계는 적용됨. §1, §2, §4 가 사용자 수동.

#### 단계 1 — Cloudflare DNS / SSL 설정
1. Cloudflare 대시보드 → bgnj.net → SSL/TLS → "Full" 또는 "Full (strict)" 모드.
2. SSL/TLS → Edge Certificates → "Always Use HTTPS" ON.
3. SSL/TLS → Edge Certificates → "Automatic HTTPS Rewrites" ON.

#### 단계 2 — GitHub Pages 커스텀 도메인 SSL
1. GitHub repo → Settings → Pages → Custom domain `bgnj.net` 입력.
2. "Enforce HTTPS" 체크 (DNS 전파 후 자동 활성화 가능).

#### 단계 3 — 워커 ALLOWED_ORIGINS http 항목 제거 ✅ (v00.109 완료)
완료. https-only.

#### 단계 4 — 클라이언트 HTTPS 강제 활성화
```js
localStorage.setItem('bgnj_force_https', '1')
```

#### 검증
- `curl -I http://bgnj.net` → 301 / Location https://bgnj.net 확인.
- `curl -I https://bgnj.net` → 200 OK + valid SSL.

---

---

## 사이클 완료 회고 (요약, 상세는 ADMIN_VERSION_HISTORY)

> 본 문서는 forward-looking. 완료 항목은 한 줄로 옮기고 본문에서 제거.

- **v00.070~113** ✅ 빌드 도입(esbuild) · 전 페이지 admin 편집화 sweep · Tiptap 3 메이저 · React 19 보류(18.3.1 LTS) · 보안 마무리(CSP 메타+SHA-256 / DOMPurify hardening / rate limit D1) · R2 업로드 흐름 · KST sweep. (상세 ADMIN_VERSION_HISTORY)
- **v00.114~156** ✅ 자동화 도구(stamp-datetime / csp-hashes / check-version / build / check-syntax 5단계 pre-commit) · page-view 분석 · 오류 페이지 6종 + 미리보기 · 책 다권화(『왕의길』 하드코드 제거 → BGNJ_BOOKS) · 메타 현행화.
- **v00.157~226** ✅ admin UX(카드 popover / 사이드바 / 단일 사이트설정 + 라이브 미리보기) · 분석(코호트 / Sankey 여정 / 히트맵 / 등급분포) · BGNJ_TOAST·BGNJ_CONFIRM 일괄 전환 · 레거시 컬러토큰 제거 → `--primary*` · 모바일 UX 4-사이클 · 현금영수증 · 칼럼 일련번호+`#col-N`.
- **v00.227~241** ✅ anchor scroll-padding · 관리자 프론트 강연·투어 quick-add(v228) · /error 라이브 라우트(v229) · 401 wiring · **데이터 사라짐 23곳 가드 + lint `cache_overwrite` 항구 차단** · 강연·투어 동의 필수 · 프론트 강연/칼럼/투어 **수정 모달**(v234) · 강연/투어 **사진 갤러리**(v235, MediaGalleryEditor).
- **v00.242~281** ✅ 한켠(자고 놀자) 예약 PMS 빌드 — 객실/요금/쿠폰/가용성/예약/게스트/유닛 D1 + 관리자 8탭 + 손님 예약 흐름(숙박/시간제) · home-next 히어로/메인 리디자인 · 커뮤니티/내비 안정화 hotfix 누적.
- **v00.282** ✅ 관리자 숙소 대표사진 드롭존 깨짐 fix (label inline → display:block) (commit `fed5df2`).
- **v00.283** ✅ 한켠 위치/교통 OpenStreetMap 지도 + 관리자 좌표 입력 (commit `이전 sha`).
- **v00.284** ✅ 한켠 객실 **주간(7박)·월간(30박) 고정 정액 상품** 추가(D1 4컬럼 + 워커 hkComputeFixed + 관리자/손님 UI) · 지도 CSP frame-src 허용 · 갤러리 작은 4장 3초 슬라이드 무작위(겹침 없음) · 시간제 카드 최소시간 기본가 · 기준인원 min(2,최대) · 콘솔 무효 meta/소스맵 정리 · **갤러리 무한렌더 위험 차단(사진 0장)** + 라이브 스모크 검증.

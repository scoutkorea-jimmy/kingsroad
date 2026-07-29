# 파일 지도 — 어디에 뭐가 있나

> **탐색 비용을 줄이려고 만든 문서입니다.** 코드를 찾을 때 저장소를 훑지 말고 여기서 먼저 확인하세요.
> 라인 번호는 2026-07-29 (v00.288.003) 실측입니다. 코드를 크게 옮겼으면 이 표도 함께 갱신하세요.

---

## 1. 파일 구조

```
/                                   ← bgnj.net 루트
├─ CLAUDE.md                        AI 진입점 — 라우팅 표
├─ index.html            176줄      단일 번들 로드 + CSP meta + JSON-LD + 인라인 script 5개
├─ data.js             3,551줄      BGNJ_* 헬퍼 전부 (아래 §2)
├─ api.js                407줄      BGNJ_API — Worker fetch 래퍼
├─ styles.css          2,559줄      토큰 + 컴포넌트 + 반응형
├─ boot.jsx              851줄      ErrorBoundary + App + 라우팅 + 배너류
├─ 404.html                         GitHub Pages SPA 폴백 (?p= 리다이렉트)
├─ robots.txt / sitemap.xml / CNAME
├─ version.json                     빌드 시 생성 (write-version-json.mjs)
├─ rules/                           규칙 (이 폴더)
├─ design/                          디자인 토큰·컴포넌트 스펙·시안
├─ docs/kms.md                      기능 정의서 · 운영 매트릭스 (관리자 KMS 화면과 동기)
├─ assets/logo.svg
├─ components/                      Shell · KoreaMap · TiptapEditor · MediaGallery ·
│                                   ConfirmDialog · UploadOverlay · CashReceiptField
├─ pages/                           13개 페이지 + admin/ 17개 패널
├─ src/entry-{main,admin}.jsx       esbuild 엔트리
├─ dist/{app,admin}.js              번들 산출물 (gitignore 목록에 있으나 강제 커밋 — Pages 서빙용)
├─ tools/                           빌드·검증 5도구 (배포 안 됨)
└─ workers/                         Cloudflare Worker 소스 (배포는 사용자 수동)
```

---

## 2. `data.js` — 헬퍼 정의 위치

| 라인 | 대상 |
|---|---|
| [4](../data.js#L4) | `BGNJ_VERSION` — **변경 시 항상 갱신** |
| [28](../data.js#L28) | `BGNJ_GUARD` — `arr` / `call` / `num` / `str` |
| [50](../data.js#L50) | `BGNJ_DRAFTS` — 임시저장 |
| [100](../data.js#L100) | `BGNJ_THEME` — 다크 모드 |
| [141](../data.js#L141) | `BGNJ_DIAG` — 진단 · 캐시 청소 |
| [284](../data.js#L284) | `BGNJ_SAFE_HTML` — DOMPurify sanitizer |
| [323](../data.js#L323) | `BGNJ_BROADCAST` |
| [351](../data.js#L351) | `BGNJ_ANALYTICS` |
| [394](../data.js#L394) | `BGNJ_FMT` — KST 시각 · 원화 포맷 |
| [482](../data.js#L482) | `BGNJ_STORAGE_VERSION` — 마이그레이션 키 |
| [871](../data.js#L871) | `BGNJ_HOME_TEXT_DEFAULT` — 홈 문구 기본값 |
| [875](../data.js#L875) | `BGNJ_HERO_STYLE_DEFAULT` — **히어로 타이포·색 기본값** |
| [895](../data.js#L895) | `BGNJ_HERO_STYLE()` — 관리자 설정 병합 |
| [928](../data.js#L928) | `BGNJ_FOOTER_STYLE_DEFAULT` |
| [1045](../data.js#L1045) | `BGNJ_STORES` — 저장소 4태그 분류 |
| [1164](../data.js#L1164) | `BGNJ_AUTH` |
| [1433](../data.js#L1433) | `BGNJ_COMMUNITY` |
| [1887](../data.js#L1887) | `BGNJ_COLUMNS` |
| [2029](../data.js#L2029) | `BGNJ_LECTURES` |
| [2277](../data.js#L2277) | `BGNJ_BOOK_ORDERS` |
| [2527](../data.js#L2527) | `BGNJ_TOURS` |
| [2738](../data.js#L2738) | `BGNJ_HANGYEON` — 한켠 예약 PMS |
| [2817](../data.js#L2817) | `BGNJ_AUDIT` |
| [2878](../data.js#L2878) | `BGNJ_GRADE_RULES` |
| [2935](../data.js#L2935) | `BGNJ_VISITS` |
| [2970](../data.js#L2970) | `BGNJ_GRADE_PROMO` |
| [3136](../data.js#L3136) | `BGNJ_SITE_CONTENT` — **관리자 편집 콘텐츠 전부** |
| [3247](../data.js#L3247) | `BGNJ_BOOKS` |
| [3376](../data.js#L3376) | `BGNJ_LEGAL` |
| [3401](../data.js#L3401) | `BGNJ_FAQ` |

`BGNJ_API` 는 [api.js:107](../api.js#L107).
`BGNJ_TOAST` 는 [boot.jsx:192](../boot.jsx#L192), `BGNJ_CONFIRM` 은 [components/ConfirmDialog.jsx:69](../components/ConfirmDialog.jsx#L69).

---

## 3. `boot.jsx` — 앱 뼈대

| 라인 | 대상 |
|---|---|
| [18](../boot.jsx#L18) | `AppErrorBoundary` — 최상위 |
| [78](../boot.jsx#L78) | `PageErrorBoundary` — 라우트 단위 |
| [153](../boot.jsx#L153) | `GlobalErrorToast` |
| [243](../boot.jsx#L243) | **`VersionUpdateBanner`** — "NEW BUILD AVAILABLE" 패널 |
| [303](../boot.jsx#L303) | `VALID_ROUTES` — 라우트 화이트리스트 |
| [304](../boot.jsx#L304) | `pathToRoute` / [310](../boot.jsx#L310) `routeToPath` |
| [321](../boot.jsx#L321) | `ADMIN_SCRIPTS` — admin 번들 지연 로드 |
| [410](../boot.jsx#L410) | `SITE_BANNER_DISMISSED_KEY` |
| [411](../boot.jsx#L411) | **`SiteBanner`** — 상단 공지 바 (관리자 관리, dismiss 저장) |
| [465](../boot.jsx#L465) | `App` — 라우팅 · init · `ROUTE_TITLES` |

---

## 4. 라우팅

`VALID_ROUTES` = `home` `home-next` `community` `lectures` `tour` `column` `book` `checkout`
`mypage` `admin` `login` `signup` `faq` `terms` `privacy` `sleep` `hangyeon` `error`

> v00.291 — `/eat`(먹고 놀자)·`/shop`(사고 놀자) 삭제. 라우트·페이지·사이트맵·관리자 편집 화면 모두 제거.

| URL | 화면 |
|---|---|
| `/` | 홈 |
| `/sleep` | 자고 놀자 = 한켠 (`/hangyeon` 과 같은 페이지) |
| `/tour` | 답사·투어 (왕사남) |
| `/lectures` | 강연 |
| `/column` | 칼럼 |
| `/community` | 커뮤니티 |
| `/book` `/checkout` | 책 · 결제 |
| `/hangyeon` | 한켠 숙소 예약 (네비는 `/sleep` 으로 진입) |
| `/mypage` `/admin` `/login` `/signup` | 계정·관리자 |
| `/faq` `/terms` `/privacy` | 약관·FAQ |

`pathToRoute` ↔ `routeToPath` 양방향. `go(r)` 가 `history.pushState`, `popstate` 로 뒤/앞 동기.
`404.html` 이 `?p=/path` 로 리다이렉트해 SPA 폴백. 라우트별 `document.title` 은
`App.useEffect([route])` 의 `ROUTE_TITLES` 매핑.

---

## 5. 홈 화면 — `pages/HomePage.jsx` (1,126줄)

| 라인 | 대상 |
|---|---|
| [155~182](../pages/HomePage.jsx#L155) | `homeText` 기본 문구 (섹션별 eyebrow/title/subtitle/CTA) |
| [193](../pages/HomePage.jsx#L193) | `HeroProgramCards` — 히어로 우측 "다음 강연/다음 답사" 카드 |
| [512](../pages/HomePage.jsx#L512) | `hero` = `siteContent.hero` |
| [515~529](../pages/HomePage.jsx#L515) | 모바일 분기 (`matchMedia 600px`) |
| [530](../pages/HomePage.jsx#L530) | `heroStyle` = `BGNJ_HERO_STYLE()` |
| [539](../pages/HomePage.jsx#L539) | `BGNJ_GUARD` 인라인 폴백 패턴 |
| [599~615](../pages/HomePage.jsx#L599) | **히어로 통계 3개** + `valueFallback` |
| [637](../pages/HomePage.jsx#L637) | **히어로 `<section>`** 시작 — [638](../pages/HomePage.jsx#L638) 이 `has-bg` 분기 |
| [647~654](../pages/HomePage.jsx#L647) | **히어로 배경 이미지 레이어** (PC / 모바일, 모바일은 PC 폴백) |
| [670~682](../pages/HomePage.jsx#L670) | 히어로 `<h1>` — [680](../pages/HomePage.jsx#L680) 이 **옐로우 accent span** |
| [701~708](../pages/HomePage.jsx#L701) | 히어로 CTA 2개 |
| [882~](../pages/HomePage.jsx#L882) | 칼럼 섹션 (featured 캐러셀 + 인디케이터) |

**섹션 순서:** 히어로 → 추천 → 답사 → 칼럼 → 강연 → 책 CTA.
커뮤니티 섹션은 v00.288.003 에서 제거됐습니다 (`homeText.community*` 기본 문구와
관리자 편집 그룹은 남아 있으나 렌더되는 곳이 없습니다 — 홈 개편 시 정리 예정).

각 섹션은 `HomeSectionBoundary` 로 감싸 격리합니다.

---

## 6. 관리자 — `pages/admin/`

| 파일 | 담는 것 |
|---|---|
| `AdminShared.jsx` | 공통 위젯 + `pickImageWithR2Fallback` (업로드 헬퍼) |
| `AdminSiteContentPanel.jsx` | 브랜딩·OG·로고·파비콘 — `ImageUploader` 는 **단일 필드**용 |
| `AdminContentEditors.jsx` | 투어/강연/한켠 페이지 편집. [1503~1528](../pages/admin/AdminContentEditors.jsx#L1503) 이 **히어로 배경 업로드 UI** (PC 1920×1080 / 모바일 1080×1920) |
| `AdminDesignHub.jsx` | `ADMIN_VERSION_HISTORY` + Design System View + 기능 정의서 |
| `AdminCommunityConfigPanels.jsx` · `AdminGradeColumnPanels.jsx` · `AdminMemberPanel.jsx` · `AdminCommercePanels.jsx` · `AdminBooksPanel.jsx` · `AdminEventsPanels.jsx` · `AdminPolicyPanels.jsx` · `AdminLogPanels.jsx` · `AdminMonitorPanels.jsx` · `AdminDashboardPanel.jsx` · `AdminRouterPanels.jsx` · `HangyeonAdminPanel.jsx` | 도메인별 패널 |

---

## 7. `styles.css` (2,559줄) — 주요 블록

| 라인 | 블록 |
|---|---|
| [105](../styles.css#L105) | 토큰 (`:root`) |
| [294](../styles.css#L294) | 읽기 폰트 모드 |
| [352](../styles.css#L352) | 본문 타이포 |
| [885](../styles.css#L885) | 타이포 유틸 |
| [902](../styles.css#L902) | 레이아웃 · [916](../styles.css#L916) 네비 |
| [1031](../styles.css#L1031) | 버튼 |
| [1107](../styles.css#L1107) | 섹션 헤더 · [1173](../styles.css#L1173) 카드 |
| [1211](../styles.css#L1211) | **홈 톤 (`.home-hero` 포함)** |
| [1409](../styles.css#L1409) | 그리드 헬퍼 |
| [1460](../styles.css#L1460) | 햄버거 토글 · [1502](../styles.css#L1502) 관리자 사이드바 |
| [1522](../styles.css#L1522) | **태블릿·모바일 ≤900px** |
| [1719](../styles.css#L1719) | **폰 ≤600px** |
| [2120~2205](../styles.css#L2120) | **히어로 배경 이미지 · has-bg 오버레이 · 반응형 분기** |

---

## 8. 워커 — `workers/src/index.js` (3,466줄)

| 라인 | 대상 |
|---|---|
| [752](../workers/src/index.js#L752) | **`USER_ALLOWED_FOLDERS`** — 여기 없는 폴더는 자동 admin 전용 |
| [758](../workers/src/index.js#L758) | `handleMediaUpload` — 50MB · 확장자 화이트리스트 · 폴더 sanitize |
| [791](../workers/src/index.js#L791) | `handleMediaGet` — R2 프록시 |
| [3184](../workers/src/index.js#L3184) | 라우팅 — `POST /api/media/upload` |

그 외: `clientIp` · `checkRateLimit` · `recordAttempt` · `resolveCreatedAt` ·
`auditWrite` GC · `insertNotification` GC.

스키마: `schema-v4.sql`(login_attempts) · `schema-v5.sql`(legacy DROP) · `seed-kv.sql`.

---

## 9. 도구 — `tools/`

| 파일 | 라인 | 대상 |
|---|---|---|
| `check-syntax.mjs` | [90](../tools/check-syntax.mjs#L90) | `RULES` — 차단 룰 |
| | [124](../tools/check-syntax.mjs#L124) | `cache_overwrite` 룰 |
| | [155](../tools/check-syntax.mjs#L155) | `INFO_RULES` — 정보성 |
| `build.mjs` | | esbuild 번들 |
| `check-version.mjs` · `csp-hashes.mjs` · `stamp-datetime.mjs` · `write-version-json.mjs` · `install-hooks.sh` | | 릴리스 자동화 |

# 뱅기노자 (BANGINOJA) 프로젝트 컨텍스트 종합

> **마지막 업데이트:** v00.226.000 · 2026-05-07 (v00.157~v00.225 69 사이클 일괄 반영 — admin 가시화/대시보드/리팩토링/모바일 UX 4개 트랙 + 컬러 토큰 정리 + 운영 패턴 변화 정합)
> **이 문서의 목적:** 작업이 누적되며 형성된 운영 원칙·아키텍처·자동화 도구·진행 상태를 한 곳에서 인수인계할 수 있도록 정리한 단일 컨텍스트 문서.

---

## 0. 한 페이지 요약

뱅기노자는 한국 여행·역사·문화 커뮤니티 사이트(`bgnj.net`). 정적 호스팅(GitHub Pages) + 동적 백엔드(Cloudflare Worker + D1 + R2) hybrid. **React 18.3.1 (UMD) + esbuild 사전 컴파일** — 빌드 단계가 pre-commit 훅에서 자동 실행되어 `*.jsx → *.js` 사전 transpile (v00.071 부터 in-browser Babel 폐기). 페이지/컴포넌트는 `BGNJ_*` 헬퍼를 거쳐 D1 을 source-of-truth 로 사용. v00.123 부터 categories_kv / grades_kv 가 D1 에 시드되어 server-first 정상화. **현재 v00.226 시점** — v00.157~225 사이클에서 admin 대시보드 가시화 + 모바일 UX 4-사이클 (v00.221~225) + 레거시 컬러 토큰 정리 (v00.209) + alert/confirm Promise 화 (v00.207-208) 등 누적.

세 가지 운영 축:
1. **D1 source-of-truth** — 사용자가 보는 모든 콘텐츠는 서버 D1 에서 옴. 시드/로컬 폴백 금지.
2. **표준 가드 + ErrorBoundary 2-tier** — 한 페이지/섹션이 죽어도 전역 트리는 살아남음.
3. **pre-commit 자동화 (5 도구)** — stamp-datetime + csp-hashes + check-version + esbuild build + check-syntax 커밋 단계 일괄.

작업 가이드 (v00.152 신설):
4. **`plans/<버전>.md` 선작성** — 새 작업 접수 시 코드/명령보다 먼저 작업계획서 작성. plans/ 폴더가 task-level 단위.
5. **명령 실행 직후 오류 우선** — 모든 Bash/build/test 실행 직후 출력의 오류·경고 파싱·해결을 다른 어떤 작업보다 먼저.

보안 패턴(v00.109~118 완성):
- DOMPurify (CDN+SRI) + BGNJ_SAFE_HTML hooks (iframe 화이트리스트 / data: image-only / target=_blank noopener).
- CSP `script-src 'unsafe-inline'` 제거 (SHA-256 4 해시 자동 동기) + X-Frame-Options + frame-ancestors + ALLOWED_ORIGINS https-only.
- 워커 brute-force rate limit (D1 login_attempts, 15min/5fail, super admin 예외).
- 게시판 작성 권한 검증 (post_min_level vs grade level).
- D1 unbounded 테이블 GC 완비 (login_attempts 24h 1/10, audit_log 30d 1/20, notifications 90d+read 1/50).
- admin createdAt 오버라이드 (admin 만 게시글/칼럼 표시 시간 임의 지정).

---

## 1. 인프라 · 배포 토폴로지

```
사용자 브라우저
   │  GET https://bgnj.net/...
   ▼
GitHub Pages (정적 호스팅)
   ├─ index.html (App + ErrorBoundary boot.js + 라우터)
   ├─ data.js / api.js / styles.css
   ├─ boot.js (PageErrorBoundary + App + go/route)
   ├─ components/*.js (esbuild 산출물 — *.jsx 가 소스)
   ├─ pages/*.js + pages/admin/*.js
   └─ workers/ (배포 안 함, 소스만)
   │
   │  fetch /api/...
   ▼
Cloudflare Worker (banginoja-api)
   ├─ src/index.js — 모든 endpoint
   ├─ wrangler.toml — D1 + R2 + ALLOWED_ORIGINS / SUPER_ADMIN_EMAILS / ADMIN_BOOTSTRAP_EMAIL
   ├─ schema.sql / schema-v2.sql / schema-v3.sql (DEPRECATED block 포함)
   ├─ schema-v4.sql (login_attempts, v00.113 적용)
   ├─ schema-v5.sql (legacy 3 테이블 DROP, v00.123 적용)
   └─ seed-kv.sql (categories_kv + grades_kv 초기 시드, v00.123 적용)
   │
   ├─ R2 (banginoja-media)
   │   └─ og-images/ logos/ favicons/ auth/ tour-covers/ lecture-covers/
   │      book-covers/ book-pdfs/ recommendations/ post-images/ post-attachments/
   │
   ▼
Cloudflare D1 (banginoja-db) — 28 tables (v00.123 정리 후)
   └─ users / sessions / posts / comments / tours / lectures /
      books / book_orders / user_columns / column_engagement /
      site_content_kv / legal_docs / faqs / grades_kv / categories_kv /
      audit_log / notifications / login_attempts (v00.113) /
      bookmarks / reports / lecture_registrations / lecture_reviews /
      tour_reservations / tour_reviews / book_reviews / post_likes /
      bank_accounts / + index 들
```

**배포 흐름:**
- 프론트엔드: `git push origin main` → GitHub Pages 자동 빌드. pre-commit 훅이 stamp-datetime + csp-hashes + check-version + esbuild build + check-syntax 5단계 자동 실행.
- 워커: `cd workers && npx wrangler deploy` (사용자가 직접 실행. AI 는 인가 prompt 필요).
- D1 schema: `cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-vN.sql` (멱등 — IF NOT EXISTS).

**도메인:** `bgnj.net` (Cloudflare DNS · v00.109 부터 ALLOWED_ORIGINS https-only).

---

## 2. 운영 원칙 9 가지

### 2.1 D1 source-of-truth
- 페이지/컴포넌트는 `window.BANGINOJA_DATA` 시드 직접 참조 금지. `tools/check-syntax.mjs` 룰이 차단.
- 콘텐츠는 `BGNJ_*` 헬퍼 경유로만 접근. 32 개 헬퍼: `BGNJ_VERSION` / `BGNJ_GUARD` / `BGNJ_DRAFTS` / `BGNJ_THEME` / `BGNJ_DIAG` / `BGNJ_SAFE_HTML` / `BGNJ_FMT` / `BGNJ_TOURS` / `BGNJ_LECTURES` / `BGNJ_COLUMNS` / `BGNJ_COMMUNITY` / `BGNJ_BOOKS` / `BGNJ_BOOK_ORDERS` / `BGNJ_AUTH` / `BGNJ_FAQ` / `BGNJ_LEGAL` / `BGNJ_SITE_CONTENT` / `BGNJ_AUDIT` / `BGNJ_VISITS` / `BGNJ_GRADE_PROMO` / `BGNJ_GRADE_RULES_EFFECTIVE` / `BGNJ_HERO_STYLE` / `BGNJ_FOOTER_STYLE` / `BGNJ_NOTIFICATIONS` / `BGNJ_RECOMMENDATIONS` / `BGNJ_KIND_PAGES` / 등.
- 헬퍼는 내부적으로 `BGNJ_API` (Worker fetch wrapper) 호출. 응답이 비면 빈 배열/null 반환 — 페이지는 해당 섹션 자체를 렌더하지 않음(깡통 카드 금지).
- App init 의 `Promise.allSettled` 가 모든 헬퍼 `refresh()` 트리거. 각 헬퍼는 `bgnj-*-refresh` 이벤트 발화 → 페이지 useEffect 가 listen → 자동 재렌더.

### 2.2 표준 가드 — `BGNJ_GUARD`
[data.js:28](data.js#L28) 에 정의:
```js
window.BGNJ_GUARD = {
  arr(fn, fb=[])  { /* try/catch + Array.isArray 가드 */ },
  call(fn, fb)    { /* try/catch + 단일 값 폴백 */ },
  num(fn, fb=0)   { /* try/catch + 정수 환산 */ },
  str(fn, fb='')  { /* try/catch + 문자열 보장 */ },
};
```
모든 페이지가 동일 시그니처로 헬퍼 호출 보호. 예: `G.arr(() => window.BGNJ_TOURS?.listAll?.())`.

### 2.3 ErrorBoundary 2-tier
- **`PageErrorBoundary`** ([boot.jsx:64](boot.jsx#L64)) — 라우트 단위. 한 페이지 컴포넌트가 throw 해도 전역 트리 보존, "다시 시도/홈으로/새로고침" UI. `key={route}` 로 라우트 변경 시 자동 reset.
- **`HomeSectionBoundary`** ([pages/HomePage.jsx](pages/HomePage.jsx)) — 홈 섹션 단위. 7개 섹션(히어로/추천/투어/커뮤니티/칼럼/강연/책CTA) 각각 격리. 한 섹션이 죽어도 다른 섹션 정상 렌더.
- 양 boundary 모두 `BGNJ_API.errorLog.report` 자동 호출.
- v00.071 부터 boot.js (esbuild 산출물) 가 `<script src="boot.js?v=...">` 로 로드 — 이전엔 index.html 의 인라인 `<script type="text/babel">` 였음.

### 2.4 컬러 시스템 v2 — Primary/Secondary/Tertiary + System
- 5:25:70 황금 배색.
- `--primary` #F5D548 (로고 옐로우, 5% 면적, 인터랙션 상태에만).
- `--secondary` #92400E (Caramel Ink — 본문 강조·링크).
- `--tertiary` #475569 (Slate 부가 위계).
- System: `--success` #16A34A · `--warning` #D97706 · `--info` #2563EB · `--danger` #DC2626.
- Neutral: 흰색 + Slate 50/100/200 (배경) · Slate 700/500 (텍스트).
- 옐로우는 절대 면적으로 깔지 않음 (배경/eyebrow/라벨 금지). CTA·focus·로고·active dot 한정.

### 2.5 모바일 정책
- ≤900px: 다열 그리드 모두 1단 강제 (`!important` 로 인라인 스타일 덮음).
- ≤600px (폰): 헤더 64px, container padding 16px, 터치 타겟 44px+, hero 지도 미리보기 숨김(v00.105 부터 hero 지도 자체 제거 — 추천 카드만).
- 햄버거 메뉴: Esc 닫기 + body scroll lock + viewport > 900px 자동 닫힘 + 라우트 변경 자동 닫힘.

### 2.6 폰트 가독성 (WCAG 정합)
- `html, body { font-weight: 500 }` 기본.
- `.nav-link` 14px / weight 500. `.section-eyebrow` weight 600. `.field-label` weight 600. `.footer h4` weight 600.
- `.mono` weight 500, `.mono.dim-2` weight 600 (한글 보조에서 IBM Plex Mono 가는 weight 가독성 보강).

### 2.7 자동화 — 5 도구 (pre-commit 통합)
- **build.mjs** (v00.071): `*.jsx → *.js` 사전 컴파일 (esbuild). @babel/standalone CDN 폐기 (~3MB ↓).
- **stamp-datetime.mjs** (v00.111): ADMIN_VERSION_HISTORY[0].datetime sentinel `new Date().toISOString()` → 실제 KST(+09:00) ISO 자동 치환.
- **csp-hashes.mjs** (v00.118): index.html 인라인 `<script>` 본문 → SHA-256 base64 → CSP meta script-src 자동 동기. 정적 호스팅 환경 nonce 대안.
- **check-version.mjs** (v00.120): BGNJ_VERSION 과 index.html cache-buster 21곳 일관성 검증. 불일치 시 pre-commit 차단.
- **check-syntax.mjs**: `@babel/parser` 로 19 개 .jsx/.js 일괄 파싱 → SyntaxError 차단 + 룰 검증.
- **차단 룰 4 개** ([tools/check-syntax.mjs:89](tools/check-syntax.mjs#L89)):
  1. `BANGINOJA_DATA` — 시드 직접 참조 금지 (`data.js` 만 allow).
  2. `console.log` — production 노이즈 금지 (`data.js` / `api.js` 만 allow).
  3. `var` — let/const 강제.
  4. `direct_fetch` — `BGNJ_API` 우회 차단 (`api.js` / `data.js` 만 allow).
- **정보성 룰 3 개** (차단 안 함, 카운트만):
  - `TODO` — 코멘트 마커 (v00.114 부터 string 내부 false-positive 차단).
  - `equality_loose` — `==` / `!=` (v00.114 부터 `== null` idiom 제외).
  - `large_file` — 8000줄 초과 분할 권장.
- 우회: 같은 줄 또는 직전 줄에 `// bgnj-lint-ignore-next-line <RULE>`.
- pre-commit 훅: `tools/install-hooks.sh` 가 `.git/hooks/pre-commit` 설치. 순서: stamp-datetime → csp-hashes → check-version → 자동 stage → build → stage .js → check-syntax.

### 2.8 릴리스 워크플로우 (3종 동기 + 1 명령)
변경 시 항상 함께 갱신:
1. **`data.js`** — `window.BGNJ_VERSION.version` + `build` 갱신.
2. **`index.html`** — 21곳의 `?v=00.0XX.YYY` 일괄 (Edit replace_all 패턴). check-version 이 불일치 시 차단.
3. **`pages/admin/AdminDesignHub.jsx`** — `ADMIN_VERSION_HISTORY` 맨 앞에 새 항목. datetime 은 `new Date().toISOString()` sentinel 로 두면 commit 시 자동 stamp.
4. **`git push origin main`** — pre-commit 훅 (5단계) 통과 후 GitHub Pages 자동 배포.

### 2.9 BGNJ_STORES 4-태그 분류 (v00.049 → v00.063 → v00.079 → v00.123)
- 🌐 server-backed (D1): grades_kv / categories_kv / notifications / columnEngagement / bankAccount / legalDocs / auditLog / siteContent_kv / books / faqs / posts / comments / tours / lectures / login_attempts
- 💾 local intentional: userPosts (사용자 임시 글) / session (세션 토큰 캐시) / drafts (BGNJ_DRAFTS 임시저장)
- ⚠ legacy: bookOrders / bookReviews / tourReviews / lectureReviews (점진 마이그)
- 🪦 dead 제거됨: ~~lectureOverrides / lectureRegistrations / tourOverrides / tourReservations~~ (v00.049) / ~~bookmarks~~ (v00.051) / ~~reports~~ (v00.063) / ~~bgnj_comments~~ (v00.079, storage v6-comments-dead) / ~~legacy categories / grades / site_content (D1)~~ (v00.123 schema-v5 DROP)

---

## 3. 파일 구조

```
/                                        ← bgnj.net 루트
├─ index.html                            App + 라우팅 boot 외부 + ErrorBoundary boot.js 외부 + CSP meta + JSON-LD (v00.120)
├─ data.js                               BGNJ_VERSION, BGNJ_STORES, BGNJ_GUARD, BGNJ_FMT, BGNJ_SAFE_HTML, 모든 BGNJ_* 헬퍼
├─ api.js                                BGNJ_API (Worker fetch wrapper)
├─ styles.css                            토큰 + 컴포넌트 + 반응형
├─ boot.jsx → boot.js                    PageErrorBoundary + App + go/route + Promise.allSettled init (v00.071)
├─ 404.html                              GitHub Pages SPA fallback (?p= 리다이렉트)
├─ robots.txt                            검색엔진 정책 (v00.124)
├─ sitemap.xml                           정적 라우트 12개 (v00.124)
├─ README.md                             외부 협업자 진입 문서 (v00.124 정식 200+ line)
├─ CNAME
├─ assets/
│  └─ logo.svg                           로고 SVG (in-page favicon은 dataURI 임베드)
├─ components/                           (.jsx 소스 + .js 빌드 산출물)
│  ├─ Shell.jsx                          Brand · Nav (햄버거 + 메가) · Footer · Tweaks · NotificationBell · ScrollToTop · BanginojaIcon · CookieConsent · GradeBadge · CoverPlaceholder
│  ├─ KoreaMap.jsx                       SVG 시도 지도 (라벨 호버시 노출)
│  ├─ KoreaMapData.js                    지역 path 데이터 (hand-written, jsx 짝 없음)
│  └─ TiptapEditor.jsx                   Tiptap 3.22.5 래퍼
├─ pages/                                (.jsx 소스 + .js 빌드 산출물)
│  ├─ HomePage.jsx                       히어로 + HeroProgramCards(v00.106) + 추천/투어/커뮤니티/칼럼/강연/책CTA + DestinationMapModal + RecommendationDetailModal + HomeSectionBoundary
│  ├─ CommunityPage.jsx                  목록/상세/작성/댓글/멘션/이미지 슬라이더/파일 첨부
│  ├─ ColumnPage.jsx                     칼럼 목록/상세/통합 작성 모달 (v00.067)
│  ├─ WangsanamTourPage.jsx              왕사남 + 투어 (TourPage / TourBookingPanel / TourReviewsSection)
│  ├─ LecturesPage.jsx                   강연
│  ├─ BookCheckoutPage.jsx               BookPage / CheckoutPage
│  ├─ MyPage.jsx
│  ├─ AuthAdminPage.jsx                  LoginPage / AdminPage / 모든 admin 패널 (~6100줄)
│  ├─ EatSleepShopPages.jsx              먹고/자고/사고 놀자 (v00.105 그룹화)
│  ├─ LegalFaqPages.jsx
│  └─ admin/
│     ├─ AdminDesignHub.jsx              ADMIN_VERSION_HISTORY + Design System View + DEPENDENCY_MATRIX + 미션 + 기능 정의서 (v00.070 분할)
│     └─ AdminContentEditors.jsx         TourPageEditorPanel / LecturePageEditorPanel / KindPagePanel / LegacyMigrationPanel (v00.078 분할)
├─ workers/
│  ├─ src/index.js                       Cloudflare Worker (모든 endpoint, rate limit, GC, post_min_level, R2 폴더 권한 분기)
│  ├─ schema.sql / schema-v2.sql / schema-v3.sql (DEPRECATED 블록 v00.119)
│  ├─ schema-v4.sql                      login_attempts (rate limit · v00.113 적용)
│  ├─ schema-v5.sql                      legacy categories/grades/site_content DROP (v00.119 작성, v00.123 적용)
│  ├─ seed-kv.sql                        categories_kv 5 + grades_kv 6 시드 (v00.122 작성, v00.123 적용)
│  └─ wrangler.toml                      D1 + R2 + ALLOWED_ORIGINS + SUPER_ADMIN_EMAILS + ADMIN_BOOTSTRAP_EMAIL (Secrets 미이관 결정 v00.125)
├─ tools/                                local-only (배포 안 됨), 5 도구
│  ├─ build.mjs                          esbuild *.jsx → *.js (v00.071)
│  ├─ check-syntax.mjs                   babel 파서 + 차단 룰 4 + 정보 3
│  ├─ check-version.mjs                  BGNJ_VERSION ↔ ?v= 일관성 검증 (v00.120)
│  ├─ csp-hashes.mjs                     인라인 script SHA-256 → CSP meta 자동 동기 (v00.118)
│  ├─ stamp-datetime.mjs                 datetime sentinel auto-stamp (v00.111)
│  ├─ install-hooks.sh                   .git/hooks/pre-commit 설치 (5 도구 통합)
│  ├─ package.json                       @babel/parser + esbuild
│  └─ node_modules/                      (gitignore)
├─ ROADMAP.md                            forward-looking 사이클 백로그
└─ CONTEXT.md                            (이 문서)
```

---

## 4. 라우팅

URL 매핑 (`VALID_ROUTES`):
- `/` → home
- `/eat` `/sleep` `/shop` → 의식주 카테고리 (메가메뉴 자식)
- `/tour` → 투어 프로그램
- `/lectures` → 강연
- `/column` → 뱅기노자 칼럼
- `/community` → 커뮤니티
- `/book` → 뱅기노자의 길 (책)
- `/checkout` → 결제
- `/mypage` → 마이페이지
- `/admin` → 관리자
- `/login` `/signup` → 인증
- `/faq` `/terms` `/privacy` → 약관·FAQ

`pathToRoute(pathname)` + `routeToPath(r)` 양방향 매핑. `go(r)` 가 `history.pushState`. `popstate` listener 가 뒤로/앞으로 동기. `404.html` 이 `?p=/path` 로 리다이렉트해 SPA fallback.

라우트별 `document.title` 자동 동기 — `App.useEffect([route])` 가 `ROUTE_TITLES` 매핑 사용.

---

## 5. 누적 사이클 히스토리 (v00.039 → v00.225)

상세는 `pages/admin/AdminDesignHub.jsx` 의 `ADMIN_VERSION_HISTORY`. 본 표는 한 줄 요약.

| 버전 | 핵심 |
|---|---|
| **v00.039~049** | Sunny Gold + 5:25:70 컬러 시스템 + BGNJ_GUARD + ErrorBoundary 2-tier + check-syntax 룰화 + storage v3 마이그 |
| **v00.050~055** | 관리자 사이드바 drawer + 자동승급 룰 GUI + 다크 모드 토큰 + KMS 디자인 토큰 카드 + 의존성 patch 갱신 |
| **v00.056~063** | 푸터 스타일 GUI + IME 핫픽스 + heroStyle 모바일 별도 + OG UI + addNewLecture await fix + metrics endpoint + storage v5 reports-dead |
| **v00.064** | HTTPS 코드 측 정합 (og:url + 조건부 강제 헬퍼 + CONTEXT §7.5) |
| **v00.065~068** | 투어 답사 일정/준비물 GUI + 칼럼 통합 모달 + BGNJ_DRAFTS + Tiptap 무료 extension 풍부화 + 커뮤니티 글쓰기 모달 |
| **v00.069~070** | 게시글 파일 첨부 10MB×3 + AuthAdminPage 9332→6900 분할 (AdminDesignHub.jsx) + tour 누락 4 필드 fix |
| **v00.071** | **빌드 단계 도입 (esbuild)** — `@babel/standalone` 폐기. boot.jsx 분리. pre-commit 자동화 |
| **v00.072~076** | 홈 카드 desc 축약 + TourAdminPanel inline 통합 + hero/intro 일괄 admin + 데이터 매퍼 audit + Tiptap CSS 보강 |
| **v00.077~079** | useModalGuard 일괄 + AdminContentEditors.jsx 2차 분할 + storage v6 comments-dead + ★ wrangler deploy metrics |
| **v00.081~082** | 투어 D1 cover_url + ★ wrangler deploy + R2 admin 6 슬롯 활성화 |
| **v00.090** | **Tiptap 3 메이저** — 3.22.5. StarterKit 중복 제거 |
| **v00.100** | React 19 평가 → UMD 단종으로 보류. 18.3.1 LTS 유지 |
| **v00.101~104** | LecturePageEditorPanel + R2 books/recommendations + R2 게시글 첨부 + LegacyMigrationPanel |
| **v00.105** | hero 지도 제거 + 빈 섹션 미노출 + CoverPlaceholder + Tiptap 3 named imports + 놀자 시리즈 그룹화 + 투어/강연 admin 통합 |
| **v00.106** | TourAdminPanel 폼 재구조화 (필드 그룹 6) + 부제/환불정책 D1 + GUI 일정/준비물 + ★ wrangler deploy |
| **v00.107~108** | ADMIN_VERSION_HISTORY datetime + BGNJ_FMT KST + CSV 다운로드 + formatToParts fix + 사이트 KST sweep |
| **v00.109** | **보안 audit** — DOMPurify XSS sanitize 5곳 + R2 폴더 권한 분기 + HTTP origin 제거 + ★ wrangler deploy |
| **v00.110** | 홈 hero ReferenceError fix + v00.106~109 datetime 실제 commit 시간 정정 |
| **v00.111** | datetime auto-stamp tool + 게시판 작성 권한(post_min_level) + X-Frame-Options/CSP frame-ancestors |
| **v00.112** | BGNJ_SAFE_HTML hardening — iframe 화이트리스트 + data: image-only + target=_blank noopener + ROADMAP 갱신 |
| **v00.113** | **전체 CSP** + brute-force rate limit (D1 login_attempts) + ★ wrangler deploy v00.111 + rate limit 일괄 |
| **v00.114** | check-syntax false-positive 차단 (TODO 코멘트만 / equality_loose `== null` idiom 제외) + CONTEXT.md v00.114 갱신 |
| **v00.115** | **admin createdAt 오버라이드** — 게시글/칼럼 표시 시간 임의 지정 + 홈페이지 안정화 (BGNJ_GUARD inline fallback / _validStarts) + ★ wrangler deploy |
| **v00.116** | 슈퍼 admin rate limit 예외 + updatePostRemote createdAt 전달 (안정성 hotfix) + ★ wrangler deploy |
| **v00.117** | 안정성 audit 잔재 — BGNJ_FMT.currency/won + 16곳 toLocaleString sweep + createPost createdAt 보존 + postMinLevel 기본값 0 (UX trap 해소) |
| **v00.118** | **CSP `script-src 'unsafe-inline'` 제거** — SHA-256 4 해시 + tools/csp-hashes.mjs 자동 동기 |
| **v00.119** | legacy categories/grades/site_content 테이블 deprecation + schema.sql DEPRECATED 마커 + schema-v5.sql 신설 |
| **v00.120** | 정적 audit 후속 5종 — BGNJ_FMT.priceOrFree + JSON-LD + tools/check-version.mjs + audit_log/notifications GC + ★ wrangler deploy |
| **v00.121** | 홈페이지 개발 중 배너 + schema-v5 DROP 보류 진단 (legacy/_kv 검증) |
| **v00.122** | seed-kv.sql 신설 — categories_kv 5 + grades_kv 6 시드 INSERT OR IGNORE |
| **v00.123** | **production D1 정리 완료** — seed-kv 적용 + schema-v5 DROP. server-first source-of-truth 정상화 (28 tables) |
| **v00.124** | README 200+ line 재작성 + robots.txt + sitemap.xml 신설 (P4 SEO 보강) |
| **v00.125** | Cloudflare Secrets 이관 미진행 결정 (사용자: 마스터 메일은 노출돼도 무관, bootstrap 은 테스트용) — wrangler.toml 코멘트 정리 |
| **v00.126** | CONTEXT.md v00.115~125 11 사이클 일괄 반영 + auto-memory 갱신 |
| **v00.127~v00.150** | 누적 사이클 — 상세는 `ADMIN_VERSION_HISTORY`. 핵심: 푸터 정비 + 게시판 권한 4종 체크박스 + 등급/자동승급 통합 + 칼럼 대표이미지 업로드 + Admin UI primitives 통일 + 오픈 안내 배너 + 푸터 회사정보(사업자등록증) + 오류 페이지 6종 + admin 미리보기 패널 + 커뮤니티 게시판 패널 재구성 + 사이드바·대시보드 카드 + page-view 분석 인프라 + 사용자 여정 + 책 데이터 HOTFIX + 책 카탈로그 한글 IME + 명시 저장 + 등급 자동 reset 중단 (BGNJ_AUTO_GRADE_DISABLED) + 오류 페이지 미리보기 정상화. |
| **v00.151** | 홈 책 CTA + BookPage 표지 BGNJ_BOOKS.primary() 실 데이터 + 영문판 미입력 hide |
| **v00.152** | 홈 책 CTA **다권 카루셀** (autoplay+무한 wrap) + hero 지도 버튼 제거 + **작업 가이드 룰 2 신설** (plans/<버전>.md 선작성 + 오류 로그 우선) + memory feedback 2건 |
| **v00.153** | 메뉴 '뱅기노자의 길' → **'뱅기노자 도서'** + BookPage **다권 탭** (책 ≥2권) + 책 메인 제목/소개/저자 의 『왕의길』 하드코드 제거 → BGNJ_BOOKS 데이터 |
| **v00.154** | **cart 자료구조 bookId 도입** + CheckoutPage / MyPage / AuthAdminPage / 영수증 텍스트 동적 + 워커 영수증 mail subject books JOIN (★ deploy 대기) |
| **v00.155** | **책 목차 sub-item** — `- ` prefix → 직전 챕터 하위 설명 (들여쓰기 + bullet) + admin textarea hint/placeholder + kms.md 책 영역 입력 규칙 |
| **v00.156** | 메타 갱신 — ROADMAP / CONTEXT 본 세션 회고 + plans/README 신설 + 사이트 심층 검토 보고서 (코드 수정 없이 후속 큐 분류) |
| **v00.157~166** | admin 카드 hover popover · 버튼 radius 8 + subtle shadow lift · P0 3건 일괄(LecturesPage 빈 버킷 가드 + nav 폴백 + helper race) · useModalGuard focus trap + 워커 영수증 deploy 준비 · React production build + script defer + localStorage PII sanitize · 책 카루셀 슬라이드 + BookPage hero · 디자인 max 2단 룰 · 사이드바 collapsible + 그룹 8 · **사이트 설정 7개→1개 단일 머지** (sub-tab 7) |
| **v00.167~177** | 사이트 설정 우측 라이브 미리보기 iframe · max 2단 룰 + iframe 차단 해제 + 줄바꿈 미반영 fix · 칼럼 admin 전용 글쓰기 버튼 · ★ 글 본문 사라짐 hotfix + 등급 이름 초기화 + **룰 무조건 서버저장** (memory feedback) · 게시판 추가/삭제 인라인 + 책 순서 + 카테고리 server delete · 홈 책 CTA 별도 소개글 + 폴백 · 차트 호버 툴팁 + 코호트 (7/14/30/90일) · 사용자 여정 Sankey 3-단계 · admin 게시판 테이블 + DnD + 카테고리 머지 · 수정 버튼 미반응 hotfix + 미리보기 위로 · admin 커뮤니티 통합 단일 sub-tab |
| **v00.178~190** | 사용자 여정 죽은 코드 제거 (-175) · RankedBarList 공통 컴포넌트(DRY) + 유입/인기 hover · CommunityPostsAdminPanel 추출 · localStorage server-first audit + resetAll D1 fix · downloadBlob/Csv/Json 헬퍼 추출 (6 패널) · 내부 인원 알람 broadcast (admin → admin/특정 사용자) · pickImageWithR2Fallback DRY + WSM 멤버 모바일 · 이미지 업로드 잔여 (book/PDF + SiteContent ImageUploader) · **legacy 4 dead store 제거** (bookOrders/Reviews/Tour/Lecture) · AuthAdminPage 분할 — AdminShared.jsx (-759) · ColumnPage 키보드 nav + BookPage h1 · 등급 이름 초기화 fix + audit 보강 · 통합 활동 로그 패널 — 검색/필터/정렬 |
| **v00.191~196** | 알람 그룹 + PC 미리보기 가로 확장 · pvSeries 시간 라벨 매시 + 사이드바 버전 뱃지 hotfix · 새 책 추가 prompt 제거 + ▲▼ 박스 그룹 + 모든 사이트 설정 메뉴 미리보기 · 회원가입 추이 + 커뮤니티 게시글 로딩 / 시간대별 히트맵 · 가입자 추이 0 root fix (memo dep 누락) · 등급별 분포 차트 + 검색콘솔 패널 + 안정적 성능 개선 |
| **v00.197~205** | **다크모드 본문 가독성** + 좌우 정렬 + 작성 시분 표시 · admin 번들 lazy-load + 워커 CDN 캐시 + HomePage tick 분리 · 기능정의서 최신화 + 홈 fontScale + 책 노출 필드 선택 · **사이트 이메일 단일화** contact@bgnj.net · **P1 묶음** — 비밀번호 변경 (PATCH /api/me/password) + 본문 검색 옵션 · SEO sitemap lastmod + 네이버 검색콘솔 verification · postMessage origin 검증 (edit-mode) · 디자인 가이드 폰트 표 KBL/Wanted/ChosunIlbo 동기화 · 디자인 가이드 9건 코드 동기화 |
| **v00.206~209** | **BGNJ_TOAST 프로그램 호출 API + ConfirmDialog 컴포넌트** · alert() 73건 → BGNJ_TOAST.error 일괄 교체 · window.confirm() 47건 → BGNJ_CONFIRM Promise 일괄 교체 · **레거시 컬러 토큰 (`--gold/--cta-*`) 전면 제거 → `--primary*`** (KMS 디자인 §2 갱신 v00.226) |
| **v00.210~217** | 칼럼 작성 모달 무한 로딩 + confirm() 잔여 hotfix · **모바일 햄버거←로고 좌측 정렬** · /login·/signup PAGE_NOT_LOADED hotfix (admin lazy-load 트리거) · /signup 직접 진입 시 회원가입 탭 자동 활성 · **새 빌드 자동 감지 + 새로고침 배너** · 모바일 auth hero art 숨김 · admin 사이드바 서브메뉴 시각 위계 강화 · 서브메뉴 위계 역전 수정 |
| **v00.218~220** | **현금영수증 신청** (책/강연/투어 결제) · 칼럼 일련번호 + **단축 공유 URL `#col-N`** · admin 칼럼 카테고리 칩 시인성 + X 버튼 톤다운 |
| **v00.221~225** | **모바일 UX 4-사이클 (사용자 민원 누적 대응)** — ① 도서 상세 표지 모바일 sticky 해제(`book-cover-col`) · ② 게시글 목록 제목 1줄 ellipsis + `.row-mobile-meta` 메타 라인 · ③ **모바일 가독성 종합 패스** (`.post-body` 17px / `.field-input` 16px iOS zoom 차단 / iframe·video 16:9 / `.dim-2` ink-2 / 카드 호흡) · ④ 강연/투어/결제 sticky 카드 일괄 해제 (`.mobile-release-sticky`) · ⑤ scroll-to-top FAB 폰 36×36 (footprint −56%) + 종합 충돌 검토 |
| **v00.226** | **메타 현행화 사이클** — kms.md 디자인 §1-8 전면 재작성 (블루→옐로우 환원 반영, `--primary*` 토큰 명시) + v00.157~225 변경기록 압축 요약 + CONTEXT.md §0/§5 갱신 + ROADMAP.md 사이클 회고 + memory release_workflow 룰 완화 (ADMIN_VERSION_HISTORY 미수정 패턴 정합) |
| **v00.227~233** | anchor `scroll-padding-top` 88/80 sticky-nav 가림 방지 · 관리자 프론트 강연·투어 quick-add (LectureQuickAddModal/TourQuickAddModal) · `/error?code=` 라이브 라우트 + `/mypage`·`/admin` 401/403 자동 wiring · **노란글씨 가독성 hotfix** (.gold/.gold-2/.accent/.badge-gold → secondary, KMS §2 정합) · **데이터 사라짐 23곳 가드** (Array.isArray + console.warn) · 강연·투어 신청 시 개인정보+제3자 동의 필수 (이중 방어) · **케이스 스터디 + lint 룰 `cache_overwrite` 항구 차단** + memory `feedback_data_loss_lesson.md` |
| **v00.234~237** | 프론트 강연·칼럼·투어 **수정 모달** (initialLecture/initialTour/initialColumn prop) · **사진 갤러리 인프라** (MediaGallery.jsx — 최대 10장 + 출처 + 대표사진, site_content_kv `lecturePages[id].images`) · 타블렛 nav 짜부 슬라이드 + admin 이 hidden 강연도 노출 (◆ 숨김 라벨) + 포스터 필수 가드 · 갤러리 **다중 파일 + drag&drop + 진행률** · **종료 강연 현장 사진** (`photos` 분리, past 만 노출) · admin 패널 LectureAdminPanel/TourAdminPanel 에 🖼 갤러리 진입로 |
| **v00.238~240** | admin 사이드바 노란 hex 6곳 → ink/슬레이트 (가독성 민원) · PC nav 깨짐 fix (overflow 룰 media query 격리) · 빈 강연 본문에서 버킷 토글 유지 · **포스터 가득 노출** (16:10 crop → width:100%+height:auto 자연 비율) · **칩 KMS 정합** (info blue 제거, primary/secondary/tertiary/neutral 4단계만, 주최/주관 caramel 분리) · 강연 제목·주제 줄바꿈 (`whiteSpace:pre-wrap`) · **주관(organizer) 신규** (site_content_kv 활용) · nav `.nav-menu` 항상 슬라이드 + `.brand`/`.nav-actions` 자식 nowrap · 업로드 spinner + 진행률 바 · **홈 칼럼 5개 자동 순환** (5초 간격, hover/focus pause, 점 인디케이터 + AUTO/HOVER 라벨) |

---

## 6. 사용자 가드 (변경하지 말 것 / 항상 적용할 것)

### 항상 적용
- 작업 끝나면 별도 지시 없이도 commit + push (auto deploy 정책).
- 모든 변경에 `BGNJ_VERSION` + `?v=` cache-buster (현재 20곳) 동기. `ADMIN_VERSION_HISTORY` 갱신은 v00.202 이후 상시 미수정 패턴 (commit message + `plans/<버전>.md` 로 대체).
- 새 컴포넌트/페이지: `BGNJ_GUARD.{arr,call}` 패턴으로 헬퍼 호출 보호.
- 새 데이터 표시: D1 → BGNJ_API → BGNJ_* 헬퍼 → 페이지. 시드 폴백 만들지 말 것.
- 새 dangerouslySetInnerHTML: 반드시 `BGNJ_SAFE_HTML(html)` 래핑.
- 시간 표시: `BGNJ_FMT.kstDateTime/kstShort/kstDate/kstFriendly` 사용 (KST 강제). 사용자 브라우저 TZ 의존 toLocaleString 금지.
- 가격 표시: `BGNJ_FMT.won(n)` / `BGNJ_FMT.priceOrFree(n)` (locale 강제 ko-KR). 직접 `n.toLocaleString()` 금지.
- 색상: 옐로우는 인터랙션 상태에만 (5% 면적). 배경/라벨로 깔지 말 것.
- 모바일: 다열 그리드 1단으로. 인라인 `gridTemplateColumns: '1fr 1fr'` 사용 시 클래스 부여.
- Sticky 카드 (`position:'sticky', top:N`) 인라인 시 모바일 release 클래스 함께 (`book-cover-col` / `mobile-release-sticky` 등 v00.221/v00.224).
- 사용자 알림: `alert()` / `window.confirm()` 금지 → `window.BGNJ_TOAST.error()` (v00.207) / `window.BGNJ_CONFIRM()` Promise (v00.208).
- **데이터 캐시 덮어쓰기 (v00.231 사고 → v00.233 lint 룰)**: API 응답 → `BGNJ_*` 메모리 캐시 갱신 시 반드시 `Array.isArray(data)` 검증 후 `data.map(...)`. `(data || []).map(...)` 패턴 절대 금지 — 비-배열 응답(null/undefined/object)이 캐시를 빈 배열로 덮어써 사용자에게 "데이터 사라짐" 으로 보임. catch 블록에는 `console.warn('[BGNJ_X.method] non-array — cache preserved')` 진단 로그 추가. lint 룰 `cache_overwrite` 가 pre-commit 자동 차단.

### 절대 금지
- `window.BANGINOJA_DATA` 직접 참조 (페이지/컴포넌트에서). pre-commit 훅이 차단.
- `console.log` (페이지/컴포넌트에서). 진단은 `console.error/warn` 또는 `errorLog` 헬퍼.
- `var` 키워드. let/const 만.
- `fetch(...)` 직접 호출. `BGNJ_API` 헬퍼 사용.
- 옐로우 면적으로 깔기 (`background: var(--primary)` 같은 큰 영역).
- 레거시 컬러 토큰 (`--gold` / `--gold-2` / `--gold-dim` / `--gold-ink` / `--cta-*`) 신규 사용. v00.209 에서 전면 제거됨 — `--primary*` / `--on-primary` / `--secondary*` / `--tertiary` 사용.

### 우회 마커
- 한 줄 단위: `// bgnj-lint-ignore-next-line <RULE>` (직전 줄 또는 같은 줄).

---

## 7. 다음 사이클 백로그

상세는 `ROADMAP.md` 의 큐 1~4. 본 §은 요약.

### 큐 1 — 코드 사이클
(v00.118 / v00.119 / v00.123 / v00.124 / v00.125 처리 완료. **현재 비어있음**.)

후보 (사용자 신호 또는 audit 발굴 시 진입):
- style-src `'unsafe-inline'` 제거 (Tiptap inline + React JSX style prop 대응 별 사이클)
- R2 orphan cleanup cron
- 워커 단위 테스트 (vitest + miniflare)
- React.lazy 코드 분할 (admin 번들 분리)
- i18n 준비
- a11y audit (axe-core)

### 큐 2 — 워커 배포 의존
(현재 비어있음 — v00.120 GC deploy 로 모두 처리됨.)

### 큐 3 — 메이저 마이그레이션
- React 19 — UMD 단종으로 보류. ESM 재구조화 시점 도래 시 진입.
- ProseMirror / Lexical 검토 — Tiptap 유지보수 변경 시점.

### 큐 4 — 사용자 직접 작업 (코드 외)
- **★ HTTPS/SSL 인프라 도입** — Cloudflare 대시보드 + GitHub Pages 설정 (§7.5 가이드). **유일하게 남은 항목.**
- ✅ ~~schema-v4.sql 적용~~ (v00.113 완료) / ~~seed-kv.sql~~ + ~~schema-v5.sql~~ (v00.123 완료) / ~~Cloudflare Secrets 이관~~ (v00.125 미진행 결정).

---

## 7.5. HTTPS / SSL 도입 가이드 (사용자 직접 작업)

v00.064 에 코드 측 정합 완료(og:url 메타 + 조건부 HTTPS 강제 헬퍼). v00.109 부터 워커 ALLOWED_ORIGINS 가 https-only — 하단 §3 단계는 적용됨. §1, §2, §4 가 사용자 수동.

### 단계 1 — Cloudflare DNS / SSL 설정
1. Cloudflare 대시보드 → bgnj.net → SSL/TLS → "Full" 또는 "Full (strict)" 모드.
2. SSL/TLS → Edge Certificates → "Always Use HTTPS" ON.
3. SSL/TLS → Edge Certificates → "Automatic HTTPS Rewrites" ON.

### 단계 2 — GitHub Pages 커스텀 도메인 SSL
1. GitHub repo → Settings → Pages → Custom domain `bgnj.net` 입력.
2. "Enforce HTTPS" 체크 (DNS 전파 후 자동 활성화 가능).

### 단계 3 — 워커 ALLOWED_ORIGINS http 항목 제거 ✅ (v00.109 완료)
완료. https-only.

### 단계 4 — 클라이언트 HTTPS 강제 활성화
```js
localStorage.setItem('bgnj_force_https', '1')
```

### 검증
- `curl -I http://bgnj.net` → 301 / Location https://bgnj.net 확인.
- `curl -I https://bgnj.net` → 200 OK + valid SSL.

---

## 8. 검증 명령

```bash
# 전체 신택스 + 룰 검증
node tools/check-syntax.mjs

# esbuild 빌드 (수동)
node tools/build.mjs

# 버전 동기 검증 (v00.120+)
node tools/check-version.mjs

# CSP 해시 동기 (v00.118+)
node tools/csp-hashes.mjs

# pre-commit 훅 재설치
bash tools/install-hooks.sh

# 기존 사용자 브라우저 캐시 청소(콘솔에서)
window.BGNJ_DIAG.run()

# Worker health check
curl -s https://banginoja-api.scoutkorea.workers.dev/api/health

# D1 schema 적용 (사용자 수동, 필요 시)
cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-vN.sql

# 워커 deploy (사용자 수동)
cd workers && npx wrangler deploy
```

---

## 9. 핵심 파일·라인 빠른 참조

- [data.js:4](data.js#L4) — `BGNJ_VERSION` (변경 항상 갱신)
- [data.js:28](data.js#L28) — `BGNJ_GUARD` 정의
- [data.js:50](data.js#L50) — `BGNJ_DRAFTS` (임시저장 v00.067)
- [data.js:99](data.js#L99) — `BGNJ_THEME` (다크 모드 v00.052)
- [data.js:236](data.js#L236) — `BGNJ_SAFE_HTML` sanitizer (v00.109/v00.112 hardening)
- [data.js:322](data.js#L322) — `BGNJ_FMT` KST 헬퍼 (v00.107/v00.108)
- [data.js:383](data.js#L383) — storage 마이그레이션 진입점 (v6-comments-dead)
- [boot.jsx:64](boot.jsx#L64) — `PageErrorBoundary`
- [pages/HomePage.jsx](pages/HomePage.jsx) — `HomeSectionBoundary` + `HeroProgramCards`
- [pages/admin/AdminDesignHub.jsx:5](pages/admin/AdminDesignHub.jsx#L5) — `ADMIN_VERSION_HISTORY` (변경 항상 prepend, datetime 은 sentinel)
- [tools/check-syntax.mjs:89](tools/check-syntax.mjs#L89) — `RULES` (4종 차단)
- [tools/check-syntax.mjs:122](tools/check-syntax.mjs#L122) — `INFO_RULES` (3종 정보성)
- [workers/src/index.js](workers/src/index.js) — `clientIp` / `checkRateLimit` / `recordAttempt` (v00.113) / `resolveCreatedAt` (v00.115) / `auditWrite` GC (v00.120) / `insertNotification` GC (v00.120)
- [workers/schema-v4.sql](workers/schema-v4.sql) — login_attempts (rate limit · v00.113)
- [workers/schema-v5.sql](workers/schema-v5.sql) — legacy 3 테이블 DROP (v00.119 작성, v00.123 적용)
- [workers/seed-kv.sql](workers/seed-kv.sql) — categories_kv 5 + grades_kv 6 시드 (v00.122 작성, v00.123 적용)
- [tools/csp-hashes.mjs](tools/csp-hashes.mjs) — 인라인 script SHA-256 → CSP meta 자동 동기 (v00.118)
- [tools/check-version.mjs](tools/check-version.mjs) — BGNJ_VERSION ↔ ?v= 일관성 (v00.120)

---

*이 문서는 새 사이클 시작 시점에 함께 읽고, 사이클 종료 시점에 갱신할 것 (특히 §5 히스토리 + §7 다음 사이클 + §9 라인 참조).*

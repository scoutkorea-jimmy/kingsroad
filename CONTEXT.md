# 뱅기노자 (BANGINOJA) 프로젝트 컨텍스트 종합

> **마지막 업데이트:** v00.114.000 · 2026-05-01 (보안 audit 마무리 + 라인 룰 false-positive 차단 + CONTEXT 일괄 갱신)
> **이 문서의 목적:** 작업이 누적되며 형성된 운영 원칙·아키텍처·자동화 도구·진행 상태를 한 곳에서 인수인계할 수 있도록 정리한 단일 컨텍스트 문서.

---

## 0. 한 페이지 요약

뱅기노자는 한국 여행·역사·문화 커뮤니티 사이트(`bgnj.net`). 정적 호스팅(GitHub Pages) + 동적 백엔드(Cloudflare Worker + D1 + R2) hybrid. **React 18.3.1 (UMD) + esbuild 사전 컴파일** — 빌드 단계가 pre-commit 훅에서 자동 실행되어 `*.jsx → *.js` 사전 transpile (v00.071 부터 in-browser Babel 폐기). 페이지/컴포넌트는 `BGNJ_*` 헬퍼를 거쳐 D1 을 source-of-truth 로 사용.

세 가지 운영 축:
1. **D1 source-of-truth** — 사용자가 보는 모든 콘텐츠는 서버 D1 에서 옴. 시드/로컬 폴백 금지.
2. **표준 가드 + ErrorBoundary 2-tier** — 한 페이지/섹션이 죽어도 전역 트리는 살아남음.
3. **pre-commit 자동화** — datetime stamp + esbuild 빌드 + 신택스/룰 검증을 커밋 단계에서 일괄 실행.

보안 패턴(v00.109~113):
- DOMPurify (CDN+SRI) + BGNJ_SAFE_HTML hooks (iframe 화이트리스트 / data: image-only / target=_blank noopener).
- CSP meta 전체 + X-Frame-Options SAMEORIGIN + ALLOWED_ORIGINS https-only.
- 워커 brute-force rate limit (D1 login_attempts, 15min/5fail) + 게시글 작성 권한 검증(post_min_level).

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
   ├─ wrangler.toml — D1 + R2 + ALLOWED_ORIGINS / SUPER_ADMIN_EMAILS
   └─ schema.sql / schema-v2.sql / schema-v3.sql / schema-v4.sql
   │
   ├─ R2 (banginoja-media)
   │   └─ og-images/ logos/ favicons/ auth/ tour-covers/ lecture-covers/
   │      book-covers/ book-pdfs/ recommendations/ post-images/ post-attachments/
   │
   ▼
Cloudflare D1 (banginoja-db)
   └─ users / sessions / posts / comments / tours / lectures /
      books / book_orders / columns / column_engagement /
      site_content_kv / legal_docs / faqs / grades_kv / categories_kv /
      audit_log / notifications / login_attempts (v00.113)
```

**배포 흐름:**
- 프론트엔드: `git push origin main` → GitHub Pages 자동 빌드. pre-commit 훅이 datetime stamp + esbuild 빌드 + 룰 검증을 자동 실행.
- 워커: `cd workers && npx wrangler deploy` (사용자가 직접 실행. 권한 prompt 필요).
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

### 2.7 자동화 — `tools/check-syntax.mjs` + `tools/build.mjs` + `tools/stamp-datetime.mjs`
- **build.mjs** (v00.071): `*.jsx → *.js` 사전 컴파일 (esbuild). 매 커밋 시 자동 실행 + 산출물 자동 stage. @babel/standalone CDN 폐기 (~3MB ↓).
- **stamp-datetime.mjs** (v00.111): ADMIN_VERSION_HISTORY[0].datetime sentinel `new Date().toISOString()` 을 실제 KST(+09:00) ISO 로 자동 치환.
- **check-syntax.mjs**: `@babel/parser` 로 19 개 .jsx/.js 일괄 파싱 → SyntaxError 차단.
- 차단 룰 4 개 ([tools/check-syntax.mjs:89](tools/check-syntax.mjs#L89)):
  1. `BANGINOJA_DATA` — 시드 직접 참조 금지 (`data.js` 만 allow).
  2. `console.log` — production 노이즈 금지 (`data.js` / `api.js` 만 allow).
  3. `var` — let/const 강제.
  4. `direct_fetch` — `BGNJ_API` 우회 차단 (`api.js` / `data.js` 만 allow).
- 정보성 룰 (차단 안 함, 카운트만):
  - `TODO` — 코멘트 마커 (v00.114 부터 string 내부 false-positive 차단).
  - `equality_loose` — `==` / `!=` (v00.114 부터 `== null` idiom 제외).
  - `large_file` — 8000줄 초과 분할 권장.
- 우회: 같은 줄 또는 직전 줄에 `// bgnj-lint-ignore-next-line <RULE>`.
- pre-commit 훅: `tools/install-hooks.sh` 가 `.git/hooks/pre-commit` 설치. 순서: stamp-datetime → 자동 stage → build → stage .js → check-syntax.

### 2.8 릴리스 워크플로우 (3종 동기 + 1 명령)
변경 시 항상 함께 갱신:
1. **`data.js`** — `window.BGNJ_VERSION.version` + `build` 갱신.
2. **`index.html`** — 21곳의 `?v=00.0XX.YYY` 일괄 (Edit replace_all 패턴).
3. **`pages/admin/AdminDesignHub.jsx`** — `ADMIN_VERSION_HISTORY` 맨 앞에 새 항목. datetime 은 `new Date().toISOString()` sentinel 로 두면 commit 시 자동 stamp.
4. **`git push origin main`** — pre-commit 훅(stamp-datetime + build + 룰) 통과 후 GitHub Pages 자동 배포.

### 2.9 BGNJ_STORES 4-태그 분류 (v00.049 → v00.063 → v00.079)
- 🌐 server-backed (D1): grades_kv / categories_kv / notifications / columnEngagement / bankAccount / legalDocs / auditLog / siteContent_kv / books / faqs / posts / comments / tours / lectures / login_attempts
- 💾 local intentional: userPosts (사용자 임시 글) / session (세션 토큰 캐시) / drafts (BGNJ_DRAFTS 임시저장)
- ⚠ legacy: bookOrders / bookReviews / tourReviews / lectureReviews (점진 마이그)
- 🪦 dead 제거됨: ~~lectureOverrides / lectureRegistrations / tourOverrides / tourReservations~~ (v00.049) / ~~bookmarks~~ (v00.051) / ~~reports~~ (v00.063) / ~~bgnj_comments~~ (v00.079, storage v6-comments-dead)

---

## 3. 파일 구조

```
/                                        ← bgnj.net 루트
├─ index.html                            App + 라우팅 boot 외부 + ErrorBoundary boot.js 외부 + CSP meta
├─ data.js                               BGNJ_VERSION, BGNJ_STORES, BGNJ_GUARD, BGNJ_FMT, BGNJ_SAFE_HTML, 모든 BGNJ_* 헬퍼
├─ api.js                                BGNJ_API (Worker fetch wrapper)
├─ styles.css                            토큰 + 컴포넌트 + 반응형
├─ boot.jsx → boot.js                    PageErrorBoundary + App + go/route + Promise.allSettled init (v00.071)
├─ 404.html                              GitHub Pages SPA fallback (?p= 리다이렉트)
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
│  ├─ src/index.js                       Cloudflare Worker (모든 endpoint)
│  ├─ schema.sql / schema-v2.sql / schema-v3.sql
│  ├─ schema-v4.sql                      login_attempts (rate limit · v00.113)
│  └─ wrangler.toml                      D1 + R2 + ALLOWED_ORIGINS / SUPER_ADMIN_EMAILS
├─ tools/                                local-only (배포 안 됨)
│  ├─ build.mjs                          esbuild 사전 컴파일 (v00.071)
│  ├─ check-syntax.mjs                   babel 파서 + 룰 4종 + 정보성 3종
│  ├─ stamp-datetime.mjs                 datetime sentinel auto-stamp (v00.111)
│  ├─ install-hooks.sh                   .git/hooks/pre-commit 설치
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

## 5. 누적 사이클 히스토리 (v00.039 → v00.114)

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

---

## 6. 사용자 가드 (변경하지 말 것 / 항상 적용할 것)

### 항상 적용
- 작업 끝나면 별도 지시 없이도 commit + push (auto deploy 정책).
- 모든 변경에 `BGNJ_VERSION` + `?v=` cache-buster 21곳 + `ADMIN_VERSION_HISTORY` 동기.
- 새 컴포넌트/페이지: `BGNJ_GUARD.{arr,call}` 패턴으로 헬퍼 호출 보호.
- 새 데이터 표시: D1 → BGNJ_API → BGNJ_* 헬퍼 → 페이지. 시드 폴백 만들지 말 것.
- 새 dangerouslySetInnerHTML: 반드시 `BGNJ_SAFE_HTML(html)` 래핑.
- 시간 표시: `BGNJ_FMT.kstDateTime/kstShort/kstDate/kstFriendly` 사용 (KST 강제). 사용자 브라우저 TZ 의존 toLocaleString 금지.
- 색상: 옐로우는 인터랙션 상태에만 (5% 면적). 배경/라벨로 깔지 말 것.
- 모바일: 다열 그리드 1단으로. 인라인 `gridTemplateColumns: '1fr 1fr'` 사용 시 클래스 부여.

### 절대 금지
- `window.BANGINOJA_DATA` 직접 참조 (페이지/컴포넌트에서). pre-commit 훅이 차단.
- `console.log` (페이지/컴포넌트에서). 진단은 `console.error/warn` 또는 `errorLog` 헬퍼.
- `var` 키워드. let/const 만.
- `fetch(...)` 직접 호출. `BGNJ_API` 헬퍼 사용.
- 옐로우 면적으로 깔기 (`background: var(--primary)` 같은 큰 영역).

### 우회 마커
- 한 줄 단위: `// bgnj-lint-ignore-next-line <RULE>` (직전 줄 또는 같은 줄).

---

## 7. 다음 사이클 백로그

상세는 `ROADMAP.md` 의 큐 1~4. 본 §은 요약.

### 큐 1 — 코드 사이클
- **v00.116+** CSP nonce 기반 strict-dynamic — inline `<script>` 부트스트랩 4종에 nonce 부여 → `'unsafe-inline'` 제거.
- **v00.117+** 옛 schema.sql `categories` / `grades` 테이블 deprecation — categories_kv / grades_kv 일원화 후 legacy DROP.

### 큐 2 — 워커 배포 의존
(현재 비어있음 — v00.113 deploy 로 모두 처리됨.)

### 큐 3 — 메이저 마이그레이션
- React 19 — UMD 단종으로 보류. ESM 재구조화 시점 도래 시 진입.
- ProseMirror / Lexical 검토 — Tiptap 유지보수 변경 시점.

### 큐 4 — 사용자 직접 작업 (코드 외)
- **★ HTTPS/SSL 인프라 도입** — Cloudflare 대시보드 + GitHub Pages 설정 (§7.5 가이드).
- **★ Cloudflare Secrets 이관** — `wrangler secret put SUPER_ADMIN_EMAILS` + `wrangler secret put ADMIN_BOOTSTRAP_EMAIL` 후 wrangler.toml [vars] 에서 두 항목 제거.

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

# pre-commit 훅 재설치
bash tools/install-hooks.sh

# 기존 사용자 브라우저 캐시 청소(콘솔에서)
window.BGNJ_DIAG.run()

# Worker health check
curl -s https://banginoja-api.scoutkorea.workers.dev/api/health

# D1 schema 적용 (사용자 수동, 필요 시)
cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-v4.sql

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
- [workers/src/index.js](workers/src/index.js) — `clientIp` / `checkRateLimit` / `recordAttempt` (v00.113)
- [workers/schema-v4.sql](workers/schema-v4.sql) — login_attempts (rate limit · v00.113)

---

*이 문서는 새 사이클 시작 시점에 함께 읽고, 사이클 종료 시점에 갱신할 것 (특히 §5 히스토리 + §7 다음 사이클 + §9 라인 참조).*

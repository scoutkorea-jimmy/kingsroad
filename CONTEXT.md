# 뱅기노자 (BANGINOJA) 프로젝트 컨텍스트 종합

> **마지막 업데이트:** v00.063.000 · 2026-05-01 (legacy 키 'reports' 정리 + storage v5-reports-dead 마이그레이션)
> **이 문서의 목적:** 작업이 누적되며 형성된 운영 원칙·아키텍처·자동화 도구·진행 상태를 한 곳에서 인수인계할 수 있도록 정리한 단일 컨텍스트 문서.

---

## 0. 한 페이지 요약

뱅기노자는 한국 여행·역사·문화 커뮤니티 사이트(`bgnj.net`). 정적 호스팅(GitHub Pages) + 동적 백엔드(Cloudflare Worker + D1) 의 hybrid. **React + Babel-standalone(in-browser)** 으로 빌드 단계 없이 운영. 페이지/컴포넌트는 `BGNJ_*` 헬퍼를 거쳐 서버를 source-of-truth 로 사용.

세 가지 운영 축:
1. **D1 source-of-truth** — 사용자가 보는 모든 콘텐츠는 서버 D1 에서 옴. 시드/로컬 폴백 금지.
2. **표준 가드 + ErrorBoundary 2-tier** — 한 페이지/섹션이 죽어도 전역 트리는 살아남음.
3. **pre-commit 자동 검증** — 컴파일 SyntaxError + 룰 위반(BANGINOJA_DATA / console.log / var)을 커밋 단계에서 차단.

---

## 1. 인프라 · 배포 토폴로지

```
사용자 브라우저
   │  GET https://bgnj.net/...
   ▼
GitHub Pages (정적 호스팅)
   ├─ index.html (App + ErrorBoundary + 라우터)
   ├─ data.js / api.js / styles.css
   ├─ components/*.jsx (Babel-standalone in-browser 컴파일)
   ├─ pages/*.jsx
   └─ workers/ (배포 안 함, 소스만)
   │
   │  fetch /api/...
   ▼
Cloudflare Worker (banginoja-api)
   ├─ src/index.js — 모든 endpoint
   ├─ wrangler.toml — D1 binding
   └─ schema-v3.sql — D1 schema
   │
   ▼
Cloudflare D1 (banginoja-db)
   └─ users / community_posts / comments / tours / lectures /
      books / book_orders / columns / column_engagement /
      site_content_kv / legal / faqs / grades / categories /
      audit_log / notifications / bookmarks / reports / ...
```

**배포:**
- 프론트엔드: `git push origin main` → GitHub Pages 자동 빌드 (정적 파일 그대로). pre-commit 훅으로 자동 검증 후 push.
- 워커: `cd workers && wrangler deploy` (사용자가 직접 실행. AI 권한 없음).

**도메인:** `bgnj.net` (HTTP 운영 중. SSL 도입 후 HTTPS 강제 예정.)

---

## 2. 운영 원칙 9 가지 (v00.049 기준 정합)

### 2.1 D1 source-of-truth
- 페이지/컴포넌트는 `window.BANGINOJA_DATA` 시드 직접 참조 금지. `tools/check-syntax.mjs` 룰이 차단.
- 콘텐츠는 `BGNJ_*` 헬퍼 경유로만 접근 — `BGNJ_TOURS`, `BGNJ_LECTURES`, `BGNJ_COLUMNS`, `BGNJ_COMMUNITY`, `BGNJ_BOOKS`, `BGNJ_BOOK_ORDERS`, `BGNJ_AUTH`, `BGNJ_FAQ`, `BGNJ_LEGAL`, `BGNJ_SITE_CONTENT`.
- 헬퍼는 내부적으로 `BGNJ_API` (Worker fetch wrapper) 호출. 응답이 비면 빈 배열/null 반환 — 페이지는 해당 섹션 자체를 렌더하지 않음(깡통 카드 금지).
- App init 의 `Promise.allSettled` (index.html) 가 모든 헬퍼 `refresh()` 트리거. 각 헬퍼는 `bgnj-*-refresh` 이벤트 발화 → 페이지 useEffect 가 listen → 자동 재렌더.

### 2.2 표준 가드 — `BGNJ_GUARD`
`data.js` 초반에 정의:
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
- **`PageErrorBoundary`** (`index.html`) — 라우트 단위. 한 페이지 컴포넌트가 throw 해도 전역 트리 보존, "다시 시도/홈으로/새로고침" UI. `key={route}` 로 라우트 변경 시 자동 reset.
- **`HomeSectionBoundary`** (`pages/HomePage.jsx`) — 홈 섹션 단위. 7개 섹션(히어로/추천/투어/커뮤니티/칼럼/강연/책CTA) 각각 격리. 한 섹션이 죽어도 다른 섹션 정상 렌더.
- 양 boundary 모두 `BGNJ_API.errorLog.report` 자동 호출.

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
- ≤600px (폰): 헤더 64px, container padding 16px, 터치 타겟 44px+, hero 지도 미리보기 숨김.
- 햄버거 메뉴: Esc 닫기 + body scroll lock + viewport > 900px 자동 닫힘 + 라우트 변경 자동 닫힘.

### 2.6 폰트 가독성 (WCAG 정합)
- `html, body { font-weight: 500 }` 기본.
- `.nav-link` 14px / weight 500. `.section-eyebrow` weight 600. `.field-label` weight 600. `.footer h4` weight 600.
- `.mono` weight 500, `.mono.dim-2` weight 600 (한글 보조에서 IBM Plex Mono 가는 weight 가독성 보강).

### 2.7 자동화 — `tools/check-syntax.mjs`
- `@babel/parser` 로 16 개 .jsx/.js 일괄 파싱 → SyntaxError 차단 (v00.042.001 같은 사고 재발 방지).
- 룰 시스템 — `RULES` 배열에 `{ name, allow, pattern, msg }` 추가.
- 차단 룰 3 개:
  1. `BANGINOJA_DATA` — 시드 직접 참조 금지 (`data.js` 만 allow).
  2. `console.log` — production 노이즈 금지 (`data.js` / `api.js` 만 allow).
  3. `var` — let/const 강제.
- 정보성 룰 (차단 안 함, 카운트만): TODO/FIXME/HACK/XXX 잔재 마커.
- 우회: 같은 줄 또는 직전 줄에 `// bgnj-lint-ignore-next-line <RULE>`.
- pre-commit 훅: `tools/install-hooks.sh` 가 `.git/hooks/pre-commit` 설치 (이미 활성).

### 2.8 릴리스 워크플로우 (3종 동기 + 1 명령)
변경 시 항상 함께 갱신:
1. **`data.js`** — `window.BGNJ_VERSION.version` + `build` 갱신.
2. **`index.html`** — 17 곳의 `?v=00.0XX.YYY` 일괄 (`sed -i '' 's/?v=OLD/?v=NEW/g'`).
3. **`pages/AuthAdminPage.jsx`** — `ADMIN_VERSION_HISTORY` 맨 앞에 새 항목 (`version/date/summary/details[]/context`).
4. **`git push origin main`** — pre-commit 훅 통과 후 GitHub Pages 자동 배포.

### 2.9 BGNJ_STORES 4-태그 분류 (v00.049)
- 🌐 server-backed (10): grades / categories / notifications / columnEngagement / bankAccount / legalDocs / auditLog / siteContent / books / faqs
- 💾 local intentional (2): userPosts (사용자 임시 글) / session (세션 토큰 캐시)
- ⚠ legacy (9): communityPosts / comments / userColumns / bookmarks / reports / bookOrders / bookReviews / tourReviews / lectureReviews
- 🪦 dead 제거됨 (4): ~~lectureOverrides / lectureRegistrations / tourOverrides / tourReservations~~ (v00.049 정리)

---

## 3. 파일 구조

```
/                                      ← bgnj.net 루트
├─ index.html                          App + 라우팅 + ErrorBoundary
├─ data.js                             BGNJ_VERSION, BGNJ_STORES, BGNJ_GUARD, 모든 BGNJ_* 헬퍼, BANGINOJA_DATA(레거시 시드, 직접 참조 금지)
├─ api.js                              BGNJ_API (Worker fetch wrapper)
├─ styles.css                          토큰 + 컴포넌트 + 반응형
├─ 404.html                            GitHub Pages SPA fallback (?p= 리다이렉트)
├─ CNAME
├─ assets/
│  └─ logo.svg                         로고 SVG (in-page favicon은 dataURI 임베드)
├─ components/
│  ├─ Shell.jsx                        Brand · Nav (햄버거 + 메가) · Footer · Tweaks · NotificationBell · ScrollToTop · BanginojaIcon · CookieConsent · GradeBadge
│  ├─ KoreaMap.jsx                     SVG 시도 지도 (라벨 호버시 노출)
│  ├─ KoreaMapData.js                  지역 path 데이터
│  └─ TiptapEditor.jsx                 Tiptap 래퍼
├─ pages/
│  ├─ HomePage.jsx                     히어로(지도 미리보기) + 추천/투어/커뮤니티/칼럼/강연/책CTA + DestinationMapModal + RecommendationDetailModal + HomeSectionBoundary
│  ├─ CommunityPage.jsx                목록/상세/작성/댓글/멘션/이미지 슬라이더
│  ├─ ColumnPage.jsx                   칼럼 목록/상세
│  ├─ WangsanamTourPage.jsx            왕사남 + 투어 (TourPage / TourBookingPanel / TourReviewsSection)
│  ├─ LecturesPage.jsx                 강연
│  ├─ BookCheckoutPage.jsx             BookPage / CheckoutPage
│  ├─ MyPage.jsx
│  ├─ AuthAdminPage.jsx                LoginPage / AdminPage / 모든 admin 패널 + ADMIN_VERSION_HISTORY
│  ├─ EatSleepShopPages.jsx            먹고/자고/사고 놀자
│  └─ LegalFaqPages.jsx
├─ workers/
│  ├─ src/index.js                     Cloudflare Worker (Hono-less, fetch handler)
│  ├─ schema*.sql
│  └─ wrangler.toml
└─ tools/                              local-only (배포 안 됨)
   ├─ check-syntax.mjs                 babel 파서 + 룰 검사
   ├─ install-hooks.sh                 .git/hooks/pre-commit 설치
   ├─ package.json                     @babel/parser
   └─ node_modules/                    (gitignore)
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

## 5. 누적 사이클 히스토리 (v00.039 → v00.063)

| 버전 | 날짜 | 핵심 |
|---|---|---|
| **v00.039** | 2026-04-29 | Sunny Gold 팔레트 — 로고 #F5D548 기준으로 색상 통일. 시멘틱 토큰 기반 정렬. |
| **v00.040** | 2026-04-29 | 컬러 시스템 v2 (5:25:70 황금 배색) + 메뉴 9→6 통합 (놀자 메가메뉴) |
| **v00.041** | 2026-04-29 | 모바일 햄버거 + 지도 라벨 기본 숨김 + 폰트 weight 300→400 (WCAG) |
| **v00.041.001** | 2026-04-29 | 모바일 페이지 레벨 2단 → 1단 강제 |
| **v00.042** | 2026-04-29 | 투어 NOT NULL 오류 수정 + PageErrorBoundary + 추천 여행지 CMS + 지도 모달화 + 로고 박스 제거 + 사이드바/메뉴 가독성 |
| **v00.042.001** | 2026-04-29 | 핫픽스 — WangsanamTourPage 누락된 `</div>` 복구 (Babel SyntaxError) |
| **v00.043** | 2026-04-29 | 추천 카드 상세 모달 + 라우트별 document.title + 모바일 메뉴 Esc·scroll lock + 메타 텍스트 weight |
| **v00.044** | 2026-04-29 | 홈페이지 안정성 스윕 — 신택스 검증 + HomeSectionBoundary + 헬퍼 가드 (인라인 safeArr) |
| **v00.045** | 2026-04-29 | `BGNJ_GUARD` 표준 가드 + pre-commit 신택스 훅 정착 + 히어로 지도 미리보기 복원 |
| **v00.045.001** | 2026-04-29 | 히어로 지도 a11y (중첩 button role) + 폰에서 미리보기 숨김 |
| **v00.046** | 2026-04-29 | 홈페이지 D1 source-of-truth — 시드 폴백 차단 + 누락 `BGNJ_COMMUNITY.refreshPosts` 추가 + storage v2-server-first 마이그레이션 |
| **v00.047** | 2026-04-30 | `BANGINOJA_DATA` 시드 직접 참조 전면 폐지 + check-syntax 룰화 + CommunityPage 가드 통일 |
| **v00.048** | 2026-04-30 | check-syntax 룰 다중화 + console.log 룰 추가 + BGNJ_STORES 26 키 4-태그 분류 문서화 |
| **v00.049** | 2026-05-01 | dead 4 키 제거 + users 키 서버 일원화 + var/TODO 룰 추가 + storage v3-no-overrides 마이그레이션 |
| **v00.049.001** | 2026-05-01 | 핫픽스 — AdminPage useMemo deps 의 잔존 `data` 식별자 제거 + CONTEXT.md 신설 |
| **v00.050** | 2026-05-01 | 관리자 사이드바 모바일 drawer + 회원등급 자동승급 7 조건 + 강등 알림 + BGNJ_VISITS |
| **v00.051** | 2026-05-01 | 자동승급 룰 GUI 편집 (BGNJ_GRADE_RULES_EFFECTIVE) + bookmarks 키 제거 (storage v4) |
| **v00.052** | 2026-05-01 | 다크 모드 토큰 (BGNJ_THEME · light/dark/auto) + OG 이미지 SVG fallback + KMS 라이브 토큰 카드 |
| **v00.053** | 2026-05-01 | 다크 nav/sidebar/footer 가독성 핫픽스 + KoreaMap stroke 강조 + 자동승급 기준 등급표 인라인 + OG 로고-only |
| **v00.054** | 2026-05-01 | 관리자 '히어로' 탭 — 콘텐츠 8 항목 + 스타일 4 그룹(eyebrow/title/subtitle/cta) GUI 편집 + 라이브 미리보기 |
| **v00.055** | 2026-05-01 | 의존성 patch 갱신 (@babel/parser, @babel/standalone) + workers/package.json + KMS 의존성 매트릭스 |
| **v00.056** | 2026-05-01 | 히어로 통계 카드 GUI 편집 (hero.stats + heroStyle.stats) + footerStyle 토큰 베이스 |
| **v00.057** | 2026-05-01 | 푸터 스타일 GUI 편집 — FooterStyleEditor (description/signature/heading 3 그룹) + 라이브 미리보기 |
| **v00.058** | 2026-05-01 | 한글 IME 핫픽스 (내부 컴포넌트 호이스팅) + heroStyle 모바일 별도 트윗 + viewport 토글 미리보기 |
| **v00.059** | 2026-05-01 | 다크 모드 인라인 hex 정합 잔존부 — 환불 amber #e8a020 → var(--warning), 추천 카드/모달 닫기 버튼, styles.css 추가 룰 |
| **v00.060** | 2026-05-01 | OG 이미지 관리 UI — OgPreviewBlock (라이브 미리보기 + 플랫폼 호환성 표 + 업로드 안내) |
| **v00.061** | 2026-05-01 | 핫픽스 addNewLecture await 누락 (startsAt null 오류) + lint 룰 (direct_fetch / equality_loose / large_file) |
| **v00.062** | 2026-05-01 | 서버 metrics endpoint (/api/admin/users/:id/metrics) + BGNJ_GRADE_PROMO 캐시 prefer · ★ 워커 배포 필요 |
| **v00.063** | 2026-05-01 | legacy 'reports' 키 제거 (BGNJ_STORES + SAVE + localStorage) + storage v5-reports-dead. comments 는 v00.065+ 분리 |

---

## 6. 사용자 가드 (변경하지 말 것 / 항상 적용할 것)

### 항상 적용
- 작업 끝나면 별도 지시 없이도 commit + push (auto deploy 정책).
- 모든 변경에 `BGNJ_VERSION` + `?v=` cache-buster 17곳 + `ADMIN_VERSION_HISTORY` 동기.
- 새 컴포넌트/페이지: `BGNJ_GUARD.{arr,call}` 패턴으로 헬퍼 호출 보호.
- 새 데이터 표시: D1 → BGNJ_API → BGNJ_* 헬퍼 → 페이지. 시드 폴백 만들지 말 것.
- 색상: 옐로우는 인터랙션 상태에만 (5% 면적). 배경/라벨로 깔지 말 것.
- 모바일: 다열 그리드 1단으로. 인라인 `gridTemplateColumns: '1fr 1fr'` 사용 시 클래스 부여.

### 절대 금지
- `window.BANGINOJA_DATA` 직접 참조 (페이지/컴포넌트에서). pre-commit 훅이 차단.
- `console.log` (페이지/컴포넌트에서). 진단은 `console.error/warn` 또는 `errorLog` 헬퍼.
- `var` 키워드. let/const 만.
- 옐로우 면적으로 깔기 (`background: var(--primary)` 같은 큰 영역).

### 우회 마커
- 한 줄 단위: `// bgnj-lint-ignore-next-line <RULE>` (직전 줄 또는 같은 줄).

---

## 7. 다음 사이클 백로그 (v00.056 → v00.063, 총 8 사이클)

각 사이클은 1 패치 단위로 commit/push (auto deploy). 우선순위 순:





### v00.065 — legacy 'comments' 키 서버 일원화
data.js 의 BGNJ_STORES.comments[postId] 직접 read/write 패턴(다수)을 BGNJ_API.community.comments 헬퍼 + BGNJ_COMMUNITY._comments 캐시로 전환. AuthAdminPage 6800 totalComments 등 호출처 정합. storage v6-comments-dead 마이그레이션.
**위험도:** 중간 — 데이터 흐름 변경 + 호출처 다수.

### v00.064 — HTTPS / SSL 도입 ★ 인프라 변경
http://bgnj.net → https://bgnj.net. og:image dataURI 안정화, Service Worker 재활성화 가능. SSL 인증서 발급(Cloudflare) + ALLOWED_ORIGINS 정합.
**위험도:** 높음 — 사용자 직접 진행. AI 는 코드 측 정합만 지원.

### 별도 메이저 마이그레이션 (사이클 외)
- **React 19** (현재 18.3.1 → 19.2.5) — ref-as-prop, useEffect 동작 변경 검증.
- **Tiptap 3** (현재 2.11.5 → 3.22.5) — extension API 브레이킹 체인지. AdminColumnEditor + TiptapEditor.jsx 마이그레이션.

각 메이저는 1 사이클 단독. 일반 사이클과 분리.

---

## 8. 검증 명령

```bash
# 전체 신택스 + 룰 검증
node tools/check-syntax.mjs

# pre-commit 훅 재설치
bash tools/install-hooks.sh

# 기존 사용자 브라우저 캐시 청소(콘솔에서)
window.BGNJ_DIAG.run()

# Worker health check
curl -s https://banginoja-api.scoutkorea.workers.dev/api/health
```

---

## 9. 핵심 파일·라인 빠른 참조

- `data.js:5` — `BGNJ_VERSION` (변경 항상 갱신)
- `data.js:30` — `BGNJ_GUARD` 정의
- `data.js:160` — storage 마이그레이션 진입점
- `data.js:382` — `BGNJ_STORES` 4-태그 헤더 주석
- `data.js:430` — `window.BGNJ_STORES = { ... }`
- `index.html:23` — styles.css cache-buster
- `index.html:81-96` — 17개 스크립트 cache-buster
- `index.html:98+` — `AppErrorBoundary` + `PageErrorBoundary`
- `index.html:282+` — `App` 컴포넌트 + 라우팅
- `pages/HomePage.jsx:107+` — `HomeSectionBoundary` + 데이터 원칙 주석
- `pages/AuthAdminPage.jsx:469` — `ADMIN_VERSION_HISTORY` (변경 항상 prepend)
- `tools/check-syntax.mjs:81` — `RULES` 배열 (룰 추가 위치)
- `styles.css:48` — `:root` 시맨틱 토큰

---

*이 문서는 새 사이클 시작 시점에 함께 읽고, 사이클 종료 시점에 갱신할 것 (특히 §5 히스토리 + §7 다음 사이클 + §9 라인 참조).*

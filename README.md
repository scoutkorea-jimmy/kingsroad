# 뱅기노자 (BANGINOJA)

> 한국의 역사·문화·자연을 함께 여행하는 커뮤니티 — [bgnj.net](https://bgnj.net)
>
> 궁궐 답사 · 지역 답사 · 문화 강연

---

## 빠른 시작 (개발자용)

### 사전 요구
- **Node.js 18+** (esbuild / tools)
- **Git** (pre-commit 훅 자동화)
- (선택) **Cloudflare Wrangler CLI** (`npm i -g wrangler`) — 워커/D1 관리용

### 클론 → 훅 설치 → 빌드
```bash
git clone https://github.com/scoutkorea-jimmy/kingsroad.git
cd kingsroad
cd tools && npm install && cd ..  # esbuild 등 (tools/node_modules 는 gitignore)
bash tools/install-hooks.sh    # pre-commit 자동화 설치
node tools/build.mjs            # 단일 엔트리 번들 → dist/{app,admin}.js (esbuild bundle, v00.285~)
```

### 로컬 미리보기
```bash
# 정적 파일 호스트 (Python 3)
python3 -m http.server 8000
# → http://localhost:8000
```

> 주의: 로컬에서도 워커 API (`https://banginoja-api.scoutkorea.workers.dev`) 를 호출.
> 오프라인에선 `BGNJ_STORES` localStorage 시드만 보임.

---

## 배포

### 프론트엔드 (자동)
`git push origin main` → GitHub Actions (`.github/workflows/deploy-pages.yml`) 가 GitHub Pages 자동 배포.

### 워커 (수동)
```bash
cd workers && npx wrangler deploy
```

### D1 스키마 마이그
```bash
cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-vN.sql
```

---

## 아키텍처 한 페이지

**정적 호스팅 (GitHub Pages) + 동적 백엔드 (Cloudflare Worker + D1 + R2) hybrid.**

```
사용자 → bgnj.net (GitHub Pages: index.html / *.js / styles.css)
       → fetch /api/* → banginoja-api (Cloudflare Worker)
                       → D1 banginoja-db (SQLite-in-cloud)
                       → R2 banginoja-media (object storage)
```

3 가지 운영 축:
1. **D1 source-of-truth** — 콘텐츠는 모두 서버 D1. 시드/로컬 폴백 금지.
2. **표준 가드 + ErrorBoundary 2-tier** — 한 섹션이 죽어도 전역 트리는 살아남음.
3. **pre-commit 자동화** — datetime stamp / CSP 해시 / version 동기 / 빌드 / 신택스+룰 검증.

상세는 [rules/00-index.md](rules/00-index.md) 참고.

---

## 디렉터리 구조

```
/                        ← bgnj.net 루트 (정적 호스팅)
├─ index.html            App + 라우팅 + CSP meta + JSON-LD. 단일 번들 <script src="dist/app.js"> 1개 로드 (v00.285~)
├─ data.js               BGNJ_VERSION, BGNJ_STORES, BGNJ_GUARD, BGNJ_FMT, BGNJ_SAFE_HTML, 모든 BGNJ_* 헬퍼 (손작성, 번들 제외)
├─ api.js                BGNJ_API (Worker fetch wrapper) (손작성, 번들 제외)
├─ styles.css            토큰 + 컴포넌트 + 반응형
├─ 404.html              GitHub Pages SPA fallback
├─ robots.txt            검색엔진 정책
├─ sitemap.xml           SEO 사이트맵
├─ src/                  번들 엔트리 — entry-main.jsx (index.html 순서) / entry-admin.jsx (admin 스플릿)
├─ dist/                 번들 산출물 — app.js (메인) / admin.js (admin route lazy). gitignore (Pages 브랜치-서빙용으로 main 에 강제 커밋)
├─ boot.jsx              PageErrorBoundary + App + go/route + admin 번들 동적 로드 (번들에 포함)
├─ components/           Shell / KoreaMap / TiptapEditor 등 (.jsx 소스 — 번들로 컴파일)
├─ pages/                HomePage / Community / Column / WangsanamTour / Lectures / BookCheckout /
│                        MyPage / EatSleepShop / LegalFaq / AuthAdminPage(=AdminPage 라우터, ~1.3k줄) (.jsx 소스)
│  └─ admin/             AdminDesignHub / AdminContentEditors + 12개 도메인 패널 파일 (v00.285 분할)
├─ workers/              Cloudflare Worker (배포 안 됨, 소스만)
│  ├─ src/index.js       모든 endpoint
│  ├─ schema*.sql        D1 schema (v1~v5)
│  ├─ seed-kv.sql        categories_kv / grades_kv 기본 시드
│  └─ wrangler.toml      D1 + R2 bindings + 환경 변수
├─ tools/                local-only (배포 안 됨)
│  ├─ build.mjs          esbuild 단일 엔트리 번들 → dist/{app,admin}.js (v00.285~)
│  ├─ check-syntax.mjs   babel parser + 룰 4종 + 정보 3종
│  ├─ check-version.mjs  BGNJ_VERSION ↔ ?v= 동기 검증
│  ├─ csp-hashes.mjs     인라인 script SHA-256 → CSP meta 자동 동기
│  ├─ stamp-datetime.mjs ADMIN_VERSION_HISTORY datetime sentinel 치환
│  └─ install-hooks.sh   pre-commit 훅 설치
├─ CLAUDE.md             AI 진입점 — "이 질문이면 이 파일" 라우팅 표
├─ rules/                주제별 규칙 (코딩/데이터/디자인/릴리스/보안/절차/환경/파일맵)
│  └─ handoff/           작업 기록 — ACTIVE(진행중) / INDEX(목록) / done(완료)
├─ design/               디자인 토큰·컴포넌트 스펙·시안
├─ docs/kms.md           기능 정의서 · 운영 매트릭스 (관리자 KMS 화면과 동기)
└─ ROADMAP.md            forward-looking 사이클 백로그 + 우선순위 기준
```

---

## 개발 워크플로우

### 새 사이클 시작
1. **[rules/handoff/ACTIVE.md](rules/handoff/ACTIVE.md)** 확인 — 진행 중인 건이 있으면 이어받는다.
   새 작업이면 지시 내역·범위·체크리스트를 여기에 먼저 쓴다.
2. **[ROADMAP.md](ROADMAP.md)** 큐 1 의 첫 pending 항목 확인 후 코드 변경.
3. `BGNJ_VERSION` (data.js) 갱신 + `?v=` cache-buster 동기 (index.html 2곳: styles.css·dist/app.js) + version.json.
4. `git commit` — pre-commit 훅이 자동 실행:
   - stamp-datetime → datetime 실제 KST 시간 치환
   - csp-hashes → 인라인 script SHA-256 동기
   - check-version → 버전 일관성 검증 (불일치 차단)
   - write-version-json → version.json 매니페스트 갱신
   - build → 단일 엔트리 번들 dist/{app,admin}.js (esbuild bundle)
   - check-syntax → 신택스 + 룰 검증
5. 배포 시 ⚠️ Pages 브랜치-서빙 모드라 `node tools/build.mjs && git add -f dist/app.js dist/admin.js` 로 번들도 함께 커밋해야 라이브 반영 (Pages source 를 GitHub Actions 로 전환하면 불필요).

---

## 운영 원칙 (요약)

상세는 [rules/](rules/) 의 주제별 규칙 문서 참고 — 진입점은 [CLAUDE.md](CLAUDE.md).

- **D1 source-of-truth** — `window.BANGINOJA_DATA` 직접 참조 금지 (lint 차단)
- **BGNJ_GUARD** 패턴 — `G.arr(() => window.BGNJ_X.listFoo())`
- **dangerouslySetInnerHTML** → 반드시 `BGNJ_SAFE_HTML(html)` 래핑
- **시간 표시** → `BGNJ_FMT.kstDateTime/kstShort/kstDate/kstFriendly` (KST 강제)
- **가격 표시** → `BGNJ_FMT.won(n)` / `BGNJ_FMT.priceOrFree(n)`
- **컬러** — 옐로우 5% (인터랙션 상태에만)
- **모바일** — ≤900px 1단 강제

### 절대 금지 (lint 룰 차단)
- `window.BANGINOJA_DATA` 직접 참조
- `console.log` (`data.js` / `api.js` 외)
- `var` 키워드
- `fetch(...)` 직접 호출 (BGNJ_API 우회)

### 우회 마커
```js
// bgnj-lint-ignore-next-line <RULE>
```

---

## 보안 모델

- **CSP**: `script-src` `'unsafe-inline'` 제거 (SHA-256 해시 자동 동기) + 외부 CDN 화이트리스트
- **DOMPurify** (CDN + SRI) — `BGNJ_SAFE_HTML` 거치는 모든 HTML sanitize. iframe = YouTube/Vimeo 만, data: = image MIME 만, `target=_blank` = noopener 강제
- **Brute-force rate limit** — `/api/auth/{login,signup}` 15분/5회 실패 시 429 (super admin 예외)
- **게시판 권한 검증** — `categories_kv.post_min_level` vs `grades_kv.level` 비교
- **R2 폴더 권한 분기** — `post-*` / `lecture-*` / `tour-*` = requireUser, 그 외 = requireAdmin
- **X-Frame-Options + frame-ancestors** — 클릭재킹 방어

---

## 검증 명령

```bash
# 전체 신택스 + 룰
node tools/check-syntax.mjs

# 빌드 (수동)
node tools/build.mjs

# 버전 동기 검증
node tools/check-version.mjs

# CSP 해시 동기
node tools/csp-hashes.mjs

# pre-commit 훅 재설치
bash tools/install-hooks.sh

# 워커 health
curl -s https://banginoja-api.scoutkorea.workers.dev/api/health

# 사용자 브라우저 캐시 청소 (콘솔)
window.BGNJ_DIAG.run()
```

---

## 기여 / 문의

- 이슈 / PR: [GitHub Issues](https://github.com/scoutkorea-jimmy/kingsroad/issues)
- 사용자 문의: hello@bgnj.net
- 개발 중 사이트 — 발견 오류는 **왕사들 오픈톡방** 에 알려주시면 빠르게 처리하겠습니다.

---

## 라이선스

내부 운영 프로젝트. 외부 사용 / 포크 시 별도 협의.

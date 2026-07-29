# 문서 구조 재편 + UI 개편 구현 계획

> **에이전트용:** 이 계획은 `superpowers:executing-plans` 또는 `superpowers:subagent-driven-development` 로 태스크 단위 실행한다. 각 단계는 체크박스(`- [ ]`)로 추적한다.
> **스펙:** [ACTIVE.md](ACTIVE.md)

**목표:** 루트에 흩어진 규칙 문서를 `CLAUDE.md` + `rules/` 로 재편해 AI가 전체를 뒤지지 않고 필요한 규칙만 읽게 하고, 모든 작업이 handoff에 기록되게 하며, 홈 UI를 사진 중심(A안) 구조로 개편한다.

**접근:** 파트 1(문서)과 파트 2(UI)는 서로 의존하지 않는다. 파트 1을 먼저 완주해 기록 체계를 세운 뒤 파트 2를 그 위에서 진행한다. 각 태스크 끝에 커밋이 남고, 파트 경계에서 배포 가능한 상태가 된다.

**기술 스택:** 정적 호스팅(GitHub Pages) + React 18.3.1 UMD + esbuild 단일 번들. 테스트 러너 없음 — 검증은 `tools/` 5개 도구 + 브라우저 실측.

---

## 전역 제약 (모든 태스크에 암묵 적용)

- **테스트 프레임워크가 없다.** TDD의 "실패하는 테스트" 자리에는 **검증 명령의 실패 확인**이 들어간다. 코드 태스크는 `node tools/check-syntax.mjs` + `node tools/build.mjs` 통과가 필수. UI 태스크는 Playwright 실측 스크린샷으로 전후를 비교한다.
- **릴리스 3종 동기.** 코드가 바뀌는 커밋마다: ① `data.js` `BGNJ_VERSION.version` + `build` ② `index.html` 의 `?v=` 전량 ③ `rules/handoff/` 기록. `ADMIN_VERSION_HISTORY` 는 v00.202 이후 미수정 패턴이므로 손대지 않는다.
- **버전 증분 규칙.** `AA.BBB.CCC` — 기능 추가/삭제는 `BBB`, 문구·버그·작은 개선은 `CCC`. AI는 임의로 크게 올리지 않는다.
- **문서만 바뀌는 커밋은 버전을 올리지 않는다.** (`?v=` 캐시버스터와 무관하므로.)
- **워커를 건드리지 않는다.** `workers/` 변경은 사용자 수동 `wrangler deploy` 가 필요하므로 이 계획 범위 밖. `hero-images` 는 `USER_ALLOWED_FOLDERS` 에 없어 자동으로 admin 전용이라 워커 수정이 불필요하다.
- **금지 패턴** (pre-commit 차단): `window.BANGINOJA_DATA` 직접 참조 · `console.log` · `var` · 직접 `fetch(...)`.
- **데이터 캐시 덮어쓰기 금지:** `(data || []).map()` 금지. `Array.isArray(data)` 검증 후 `.map()`, catch 에 `console.warn` 진단.
- **커밋 메시지:** `<type>(<scope>): <한글 요약> (v00.XXX.YYY)` + `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
- **작업 끝나면 별도 지시 없이 commit + push.**

---

## 파일 구조

| 경로 | 책임 |
|---|---|
| `CLAUDE.md` | **라우팅 표 전용.** 규칙 본문 없음. "이 질문 → 이 파일" |
| `rules/00-index.md` | rules 전체 지도, 읽는 순서 |
| `rules/10-coding.md` | 금지 패턴 · BGNJ_GUARD · lint 룰 · 우회 마커 · 헬퍼 목록 |
| `rules/11-data-flow.md` | D1 source-of-truth · 캐시 덮어쓰기 금지 · BGNJ_STORES 4태그 · 응답 매퍼 |
| `rules/20-design.md` | 컬러 v2 · 타이포 · 레이아웃 · 컴포넌트 · 인터랙션 · 접근성 · 금지 |
| `rules/30-release.md` | 버전 체계 · 3종 동기 · 빌드 · CSP · 검증 명령 |
| `rules/40-security.md` | 권한 모델 · 업로드 정책 · 시크릿 · 오류 표시 |
| `rules/50-workflow.md` | 작업 절차 · handoff 규칙 · 체크리스트 · 비개발자 설명 · AI 협업 |
| `rules/60-environment.md` | 로컬 셋업 · 훅 설치 · 빌드 복구 |
| `rules/90-file-map.md` | 파일별 라인 포인터 (탐색 비용 절감의 핵심) |
| `rules/handoff/ACTIVE.md` | 진행 중인 건 하나 |
| `rules/handoff/INDEX.md` | 전체 목록 + 상태 한 줄 |
| `rules/handoff/done/` | 완료 건 + 기존 `plans/` 65개 |
| `design/tokens.md` | 컬러·타이포·간격 단일 소스 |
| `design/components.md` | 컴포넌트별 규칙 |
| `design/mockups/` · `design/references/` | 시안·참고 |
| `docs/kms.md` | 기존 `kms.md` 이동 (분할 안 함) |

---

# 파트 1 — 문서 구조 재편

## Task 1: rules/ 골격 + CLAUDE.md 라우팅 표

**파일**
- 생성: `CLAUDE.md`, `rules/00-index.md`, `rules/handoff/INDEX.md`
- 이미 존재: `rules/handoff/ACTIVE.md`

**생산물(뒤 태스크가 의존):** `CLAUDE.md` 의 라우팅 표 형식 — `| 상황 | 읽을 파일 |` 2열. 뒤 태스크는 파일을 채울 때마다 이 표에 행을 추가한다.

- [ ] **1-1. `CLAUDE.md` 작성** — 규칙 본문을 넣지 말 것. 프로젝트 1줄 요약 + 라우팅 표 + "작업 시작 전 3줄 절차" + 절대 금지 5개만. 120줄 이내.
- [ ] **1-2. `rules/00-index.md` 작성** — 각 rules 파일이 무엇을 담는지 한 줄씩 + "언제 무엇을 읽나" 시나리오 표.
- [ ] **1-3. `rules/handoff/INDEX.md` 작성** — 표 머리글(`| 날짜 | 건 | 상태 | 문서 |`)과 ACTIVE 행 1개.
- [ ] **1-4. 검증** — `test -f CLAUDE.md && wc -l CLAUDE.md` 가 120 이하인지 확인.
- [ ] **1-5. 커밋** — `docs(rules): CLAUDE.md 라우팅 표 + rules/ 골격 신설`

## Task 2: ai-development-rules.md 분해

**파일**
- 생성: `rules/50-workflow.md`, `rules/40-security.md`
- 수정: `rules/30-release.md`(생성), `rules/10-coding.md`(생성)
- 원본: `ai-development-rules.md` (이 태스크에서는 **삭제하지 않는다** — Task 6에서 일괄)

**소스 매핑 (원본 라인 → 목적지)**

| 원본 | 목적지 |
|---|---|
| §목적·최상위 원칙·작업 시작 전 절차·계획 문서 규칙·비개발자 설명·파일명·기준 문서·AI 협업·작업 종료 체크리스트 (L3~92, L184~197) | `50-workflow.md` |
| §구현 규칙 (L93~111) | `10-coding.md` |
| §버전 관리·관리자 버전 기록·KMS 동기화 (L112~155) | `30-release.md` |
| §UI 및 디자인 규칙 (L156~166) | **폐기** — 아래 주의 참조 |
| §Git 및 배포 (L167~176) | `30-release.md` |
| §보안 및 안전 (L177~183) | `40-security.md` |
| §변경 기록 L203~207 의 운영 원칙 본문 | 해당 주제 파일로 분산 (캐시버스터→30, 오류표시→40, 서버 SoT→11) |

> **주의 — 실제 모순 발견.** `ai-development-rules.md` L158~162 의 "조선 왕실의 분위기 / 다크 기반의 프리미엄 톤 / 절제된 금색" 은 `kms.md` L556 의 "일월오봉도·조선 왕실 도상 직접 차용 표현은 더 이상 사용하지 않는다(브랜드 분리 완료)" 및 현행 라이트 기반 컬러 v2와 **정면 충돌**한다. 낡은 쪽(ai-development-rules)을 폐기하고 `20-design.md` 는 `kms.md` 탭2 기준으로 쓴다. 이 판단을 `20-design.md` 상단 주석으로 남길 것.

- [ ] **2-1. `rules/50-workflow.md` 작성** — 위 매핑대로 옮기되, "계획 문서는 완료 후 삭제한다"(L51)는 **handoff 체계로 대체**되었으므로 "완료된 handoff 는 `done/` 으로 이동한다"로 고쳐 쓴다. `project-priority-table.md` 참조는 `ROADMAP.md` 로 바꾼다.
- [ ] **2-2. `rules/30-release.md` 작성** — 버전 체계 + 3종 동기 + `?v=` 캐시버스터 + CSP + 검증 명령(CONTEXT §8 전량).
- [ ] **2-3. `rules/40-security.md` 작성** — 시크릿 금지 + 오류 표시 4요소(코드/상태/사유/다음 행동) + 업로드 폴더 권한(`USER_ALLOWED_FOLDERS`) + rate limit + DOMPurify.
- [ ] **2-4. `rules/10-coding.md` 작성** — 차단 룰 4 + 정보 룰 3 + 우회 마커 + `BGNJ_GUARD` 시그니처 + 구현 규칙(L93~111) + 32개 헬퍼 목록.
- [ ] **2-5. 검증** — `grep -c "^## " rules/*.md` 로 각 파일이 비지 않았는지 확인. 각 파일 200줄 이하 유지.
- [ ] **2-6. `CLAUDE.md` 라우팅 표에 4개 행 추가.**
- [ ] **2-7. 커밋** — `docs(rules): ai-development-rules 분해 → 10/30/40/50`

## Task 3: CONTEXT.md 분해 + 90-file-map.md

**파일**
- 생성: `rules/11-data-flow.md`, `rules/20-design.md`, `rules/60-environment.md`, `rules/90-file-map.md`
- 수정: `rules/10-coding.md`, `rules/30-release.md`, `ROADMAP.md`
- 이동: `CONTEXT.md` §5 히스토리 → `rules/handoff/done/archive-cycle-history.md`

**소스 매핑**

| CONTEXT.md | 목적지 |
|---|---|
| §0 요약 · §1 인프라 토폴로지 | `rules/00-index.md` 상단 + `90-file-map.md` |
| §2.1 D1 SoT · §2.9 BGNJ_STORES 4태그 | `11-data-flow.md` |
| §2.2 GUARD · §2.3 ErrorBoundary · §2.7 자동화 5도구 | `10-coding.md` |
| §2.4 컬러 v2 · §2.5 모바일 · §2.6 폰트 | `20-design.md` |
| §2.8 릴리스 워크플로우 | `30-release.md` |
| §3 파일 구조 · §9 핵심 파일·라인 참조 | `90-file-map.md` |
| §4 라우팅 | `90-file-map.md` |
| §5 누적 사이클 히스토리 | `handoff/done/archive-cycle-history.md` |
| §6 사용자 가드 | `10-coding.md` (항상 적용/절대 금지/우회 마커) |
| §7 다음 사이클 백로그 · §7.5 HTTPS 가이드 | `ROADMAP.md` |
| §8 검증 명령 | `30-release.md` + `60-environment.md` |

- [ ] **3-1. `rules/20-design.md` 작성** — `kms.md` 탭2(L479~559) 를 기준으로 쓰고 CONTEXT §2.4~2.6 을 합친다. 상단에 "ai-development-rules 의 조선왕실/다크 톤 서술은 v00.288 에서 폐기됨" 주석.
- [ ] **3-2. `rules/11-data-flow.md` 작성** — D1 SoT + 헬퍼 경유 + 캐시 덮어쓰기 금지(v00.231 사고 + `cache_overwrite` lint) + BGNJ_STORES 4태그 + snake_case→camelCase 매퍼.
- [ ] **3-3. `rules/90-file-map.md` 작성** — CONTEXT §3 + §4 + §9 를 합치고, **이번 조사로 확인한 항목을 추가**한다:
  - `pages/HomePage.jsx:637` — 히어로 `<section>` (`has-bg` 분기)
  - `pages/HomePage.jsx:647-654` — 히어로 배경 이미지 레이어 (PC/모바일)
  - `pages/HomePage.jsx:680` — 히어로 제목 accent(옐로우) span
  - `pages/HomePage.jsx:599-615` — 히어로 통계 3개 + valueFallback
  - `pages/admin/AdminContentEditors.jsx:1503-1528` — 히어로 배경 업로드 UI
  - `boot.jsx:243` — `VersionUpdateBanner`
  - `boot.jsx:411` — `SiteBanner` (공지 바, dismiss 저장)
  - `components/Shell.jsx:1175` — `CookieConsent`
  - `workers/src/index.js:752` — `USER_ALLOWED_FOLDERS`
  - `workers/src/index.js:758` — `handleMediaUpload`
  - `styles.css:2120-2205` — 히어로 배경/오버레이/반응형
- [ ] **3-4. `rules/60-environment.md` 작성** — 클론→훅 설치→빌드, 로컬 미리보기, **esbuild 바이너리 복구 절차**(2026-07-29 실제 발생), Worker health check.
- [ ] **3-5. `ROADMAP.md` 에 CONTEXT §7 · §7.5 병합.**
- [ ] **3-6. `rules/handoff/done/archive-cycle-history.md` 생성** — CONTEXT §5 전량 이동.
- [ ] **3-7. 검증** — `90-file-map.md` 의 모든 `파일:라인` 이 실제로 존재하는지 확인:
  ```bash
  grep -oE '\[[^]]+\]\([^)#]+#L[0-9]+\)' rules/90-file-map.md | sed -E 's/.*\(([^)#]+)#L([0-9]+)\)/\1 \2/' | while read f l; do
    tot=$(wc -l < "$f" 2>/dev/null || echo 0); [ "$tot" -ge "$l" ] || echo "BAD: $f:$l (총 $tot줄)"; done
  ```
  출력이 비어야 통과.
- [ ] **3-8. 커밋** — `docs(rules): CONTEXT.md 분해 → 11/20/60/90 + 히스토리 아카이브`

## Task 4: priority-table 흡수 + kms.md 이동

- [ ] **4-1.** `project-priority-table.md` 의 우선순위 8단계 + P1~P3 상태를 `ROADMAP.md` 의 새 `## 우선순위 기준` 섹션으로 옮긴다.
- [ ] **4-2.** `mkdir -p docs && git mv kms.md docs/kms.md` — 내용은 손대지 않는다(관리자 KMS 화면과 동기되는 원본).
- [ ] **4-3.** `rules/50-workflow.md` 의 KMS 동기화 규칙에서 경로를 `docs/kms.md` 로 갱신.
- [ ] **4-4. 검증** — `grep -rln "kms\.md" --include="*.md" . | grep -v docs/kms.md` 결과의 모든 파일이 `docs/kms.md` 로 참조하는지 확인.
- [ ] **4-5. 커밋** — `docs: project-priority-table → ROADMAP 흡수, kms.md → docs/ 이동`

## Task 5: plans/ 65개 → handoff/done/ 이관

- [ ] **5-1.** `git mv plans/* rules/handoff/done/` 후 빈 `plans/` 제거.
- [ ] **5-2.** `rules/handoff/INDEX.md` 에 이관된 문서를 표로 생성 — 파일명에서 버전을 뽑아 정렬. 생성 스크립트:
  ```bash
  for f in rules/handoff/done/*.md; do
    b=$(basename "$f"); t=$(head -1 "$f" | sed 's/^#* *//')
    echo "| — | $t | 완료 | [$b](done/$b) |"
  done
  ```
  출력을 `INDEX.md` 표 아래에 붙인다.
- [ ] **5-3.** `rules/50-workflow.md` 에 handoff 운영 규칙 명문화 — ① 새 작업은 `ACTIVE.md` 에 지시 원문·범위·체크리스트를 먼저 쓴다 ② 진행하며 체크박스를 갱신한다 ③ 완료 시 상태를 "완료"로 바꾸고 `done/YYYY-MM-DD-<주제>.md` 로 옮긴 뒤 `INDEX.md` 에 행을 추가하고 `ACTIVE.md` 를 "없음"으로 비운다.
- [ ] **5-4. 검증** — `ls rules/handoff/done/*.md | wc -l` 가 66 이상(기존 65 + 아카이브).
- [ ] **5-5. 커밋** — `docs(handoff): plans/ 65개 → rules/handoff/done/ 이관 + INDEX 생성`

## Task 6: 원본 삭제 + 잔존 참조 수정

- [ ] **6-1.** 잔존 참조 조사:
  ```bash
  grep -rn "CONTEXT\.md\|ai-development-rules\.md\|project-priority-table\.md\|plans/" \
    --include="*.md" --include="*.jsx" --include="*.js" --include="*.sh" --include="*.yml" \
    . | grep -v node_modules | grep -v rules/handoff/done/
  ```
- [ ] **6-2.** `README.md` 의 디렉터리 구조·개발 워크플로우 섹션을 새 구조로 갱신.
- [ ] **6-3.** `.github/` 워크플로가 있으면 경로 참조 확인.
- [ ] **6-4.** `git rm CONTEXT.md ai-development-rules.md project-priority-table.md`
- [ ] **6-5. 검증** — 6-1 명령을 다시 돌려 결과가 비었는지 확인. `node tools/check-syntax.mjs` 통과.
- [ ] **6-6. 커밋** — `docs: 루트 레거시 문서 3종 제거, 참조 경로 일괄 갱신`

## Task 7: design/ 폴더

- [ ] **7-1.** `design/tokens.md` — `styles.css` 의 `:root` 토큰을 실측해 표로 정리(컬러/타이포/간격/그림자/반경). **하드코딩 값을 새로 발명하지 말고 실제 CSS에서 읽어올 것.**
- [ ] **7-2.** `design/components.md` — 버튼/카드/칩/배지/폼/모달 규칙. `kms.md` 탭2 §5 기준.
- [ ] **7-3.** `design/mockups/.gitkeep`, `design/references/.gitkeep`.
- [ ] **7-4.** `design/README.md` — `rules/20-design.md`(규칙·금지) 와 `design/`(스펙·자산) 의 역할 구분, `AdminDesignHub.jsx` 와 함께 갱신해야 한다는 규칙.
- [ ] **7-5. 커밋** — `docs(design): design/ 신설 — tokens/components/mockups`

---

# 파트 2 — UI 개편

> **선행 조사 결과 (이미 확인됨 — 다시 조사하지 말 것):**
> - 히어로 배경 사진 업로드·삭제 UI는 `AdminContentEditors.jsx:1503-1528` 에 **이미 있다.**
> - 히어로 배경 렌더·모바일 폴백·다크모드 대응은 `HomePage.jsx:647-654` + `styles.css:2120-2205` 에 **이미 있다.**
> - 공지 바 dismiss 저장은 `boot.jsx:411` 에 **이미 있다.**
> - 현재 배경 일러스트는 하드코딩이 아니라 업로드된 PNG (`hero.bgDesktopUrl` / `bgMobileUrl`).
> - **비우는 것은 D1 `site_content_kv` 값 변경이라 코드로 못 한다.** 관리자 화면에서 사용자가 직접 비워야 하며, 이는 `ACTIVE.md` §7 "사용자 직접 작업"에 기록한다.

## Task 8: 첫 화면 오버레이 정리

**파일**
- 수정: `boot.jsx:243-300` (`VersionUpdateBanner`), `components/Shell.jsx:1175-1282` (`CookieConsent`)

**전제:** 현재 데스크톱 첫 화면에서 히어로가 상단 공지 바 + 우측 업데이트 패널 + 하단 쿠키 카드에 가려진다. 모바일에선 업데이트 패널이 로고를 덮는다.

- [ ] **8-1. 현상 기록** — Playwright 로 1440×900 / 390×844 스크린샷을 찍어 `design/references/before-home-desktop.png` · `before-home-mobile.png` 로 저장.
- [ ] **8-2. `VersionUpdateBanner` 강등** — 현재 우상단 큰 카드를 **우하단 소형 토스트**로. 요구사항: ① 로고·네비를 절대 덮지 않는다 ② 모바일에서 폭 `min(320px, calc(100vw - 32px))` ③ "나중에" 를 누르면 해당 버전은 `localStorage` 에 기록해 다시 뜨지 않는다(키: `bgnj_update_dismissed_version`) ④ `z-index` 는 쿠키 배너보다 낮게.
- [ ] **8-3. `CookieConsent` 축소** — 모바일에서 화면 높이의 40% 를 넘지 않게. 본문을 2줄로 줄이고 "세부 설정" 은 링크 스타일로 강등.
- [ ] **8-4. 검증** — `node tools/check-syntax.mjs` + `node tools/build.mjs` 통과. Playwright 로 다시 찍어 `design/references/after-*.png` 저장, **히어로 제목이 첫 화면에서 가려지지 않는지 육안 확인.**
- [ ] **8-5. 버전 올리고 커밋** — `CCC` 증분. `fix(home): 첫 화면 오버레이 정리 — 업데이트 패널 강등 + 쿠키 배너 축소`

## Task 9: 히어로 — 사진 없는 상태의 품질

**파일**
- 수정: `pages/HomePage.jsx:670-682` (제목 accent), `styles.css` `.home-hero` 블록

**목표:** 배경 사진이 비었을 때(= 지금 사용자가 비운 뒤의 상태) 여백형으로 **제대로** 보이게 한다. 사진이 들어오면 자동으로 사진형이 된다 — 이 분기는 이미 `has-bg` 로 존재한다.

- [ ] **9-1. 옐로우 면적 제거** — `HomePage.jsx:680` 의 accent span. `heroStyle.title.accentColor` 기본값을 `--primary`(옐로우)에서 `--secondary`(Caramel Ink `#92400E`)로 바꾼다. 위치: `data.js` 의 `BGNJ_HERO_STYLE_DEFAULT`(L875~). **주의:** 관리자가 이미 저장한 `heroStyle` 이 있으면 그 값이 우선하므로, 기본값 변경만으로는 화면이 안 바뀔 수 있다 → `ACTIVE.md` 사용자 직접 작업에 기록.
- [ ] **9-2. 사진 없을 때 여백 리듬** — `.home-hero` 의 `padding:'72px 0 88px'` 인라인을 CSS 클래스로 옮기고, `:not(.has-bg)` 일 때 상하 여백을 키운다(데스크톱 96/112, 모바일 56/64).
- [ ] **9-3. CTA 위계** — 현재 `btn btn-gold`(커뮤니티) + `btn`(답사) 두 개가 동등해 보인다. 두 번째를 `btn-ghost` 로 낮춰 주행동 하나가 분명하게.
- [ ] **9-4. 검증** — check-syntax + build. Playwright 로 히어로만 캡처해 옐로우 면적이 CTA 버튼 하나로 줄었는지 확인.
- [ ] **9-5. 커밋** — `style(home): 히어로 옐로우 면적 축소 + 여백 리듬 + CTA 위계 (BBB 증분)`

## Task 10: 홈 나머지 섹션 정리

**파일**
- 수정: `pages/HomePage.jsx:193-290` (`HeroProgramCards`), `pages/HomePage.jsx:599-615` (통계), `styles.css` `.hero-stats`

- [ ] **10-1. 빈 상태 섹션 숨김** — `HeroProgramCards` 가 강연·답사 둘 다 비면 `null` 을 반환하게 한다. 하나만 있으면 있는 것만 렌더. **주의:** `rules/11-data-flow.md` 의 "깡통 카드 금지" 원칙과 일치.
- [ ] **10-2. 지표에서 "준비 중" 제거** — `HomePage.jsx:611` 의 `valueFallback: '준비 중'`. 값이 없으면 **그 지표 칸 자체를 렌더하지 않는다**(3칸 → 2칸). 남은 칸이 0개면 `.hero-stats` 를 통째로 숨김.
- [ ] **10-3. 모바일 지표 3열 깨짐 수정** — 390px 에서 "여 행 지" 처럼 라벨이 쪼개진다. `.hero-stats` 에 `@media (max-width:600px) { grid-template-columns: repeat(2,1fr); }` + 라벨에 `word-break: keep-all`.
- [ ] **10-4. 검증** — check-syntax + build. Playwright 390×844 로 라벨이 한 줄에 붙는지 확인.
- [ ] **10-5. 커밋** — `fix(home): 빈 섹션 숨김 + 지표 정리 + 모바일 라벨 쪼개짐 수정`

## Task 11: 전역 시각 시스템 + 옐로우 5% lint 룰

**파일**
- 수정: `tools/check-syntax.mjs` (`RULES` 배열, L89~)
- 수정: `styles.css` (타이포 스케일)
- 수정: `rules/10-coding.md`, `rules/20-design.md`, `design/tokens.md`

- [ ] **11-1. `yellow_area` lint 룰 추가** — `tools/check-syntax.mjs` 의 `RULES` 에 정보성이 아닌 **차단 룰**로 추가. 탐지 대상: `background` / `backgroundColor` 속성값에 `var(--primary)` 또는 `#F5D548` 이 오는 경우. 허용: `.btn-gold` 정의가 있는 `styles.css` 는 검사 대상이 아니므로 무관 — JSX 인라인 스타일만 걸린다. 우회는 기존 `// bgnj-lint-ignore-next-line yellow_area`.
- [ ] **11-2. 룰 동작 확인** — 일부러 위반 코드를 임시 파일에 넣고 `node tools/check-syntax.mjs` 가 **차단하는지** 확인한 뒤 되돌린다. (테스트 러너가 없으므로 이것이 이 룰의 테스트다.)
- [ ] **11-3. 기존 위반 정리** — 룰 추가로 걸리는 기존 코드를 전수 확인하고 `--primary-dim` 이나 `rgba(245,213,72,0.06)` 같은 저채도 표현으로 교체. **한 건도 `lint-ignore` 로 덮지 말 것** — 덮어야 한다면 그 자리는 예외 사유를 주석으로 남긴다.
- [ ] **11-4. 타이포 스케일 정리** — `styles.css` 에서 히어로/섹션 제목/본문/메타의 크기가 파일 여러 곳에 흩어져 있으면 `:root` 커스텀 프로퍼티(`--fs-hero` 등)로 모으고 `design/tokens.md` 에 반영.
- [ ] **11-5. 검증** — check-syntax(새 룰 포함) + build 통과.
- [ ] **11-6. 커밋** — `feat(lint): 옐로우 면적 차단 룰 추가 + 타이포 스케일 토큰화`

## Task 12: 마무리 — handoff 완료 처리

- [ ] **12-1.** `ACTIVE.md` 체크리스트 전량 체크, 상태를 `완료`로, 완료일 기입.
- [ ] **12-2.** "사용자 직접 작업" 절을 채운다 — ① 관리자 → 사이트 콘텐츠 → 히어로에서 PC/모바일 배경 이미지 **비우기** ② 저장된 `heroStyle.title.accentColor` 를 기본값으로 되돌리기 ③ 히어로용 가로형 사진 3~5장(폭 2000px+) 확보 시 업로드.
- [ ] **12-3.** `ACTIVE.md` → `rules/handoff/done/2026-07-29-restructure-and-ui.md` 로 이동, `INDEX.md` 에 행 추가, `ACTIVE.md` 는 "진행 중인 건 없음"으로 초기화.
- [ ] **12-4. 커밋 + 푸시.**

---

## 자체 검토 결과

- **스펙 커버리지** — ACTIVE.md 의 지시 4개: ①CLAUDE.md+rules → Task 1~6 ②handoff 기록 → Task 1, 5-3, 12 ③design 디렉토리+UI 개편 → Task 7~11 ④사진 관리자 관리·지금은 비움 → Task 9 + 12-2(코드가 아니라 사용자 작업임을 명시). 누락 없음.
- **보류 항목 확인** — 메뉴 체계·`/eat`·`/shop` 삭제는 어느 태스크에도 없다. 의도대로다.
- **모순 처리** — ai-development-rules 의 조선왕실/다크 톤 vs kms 탭2 라이트 톤 충돌을 Task 2 주의사항으로 명시하고 폐기 판단을 기록하게 했다.
- **placeholder 없음** — 모든 단계에 실행할 명령 또는 구체적 대상 라인이 있다. "적절히 처리" 류 표현 없음.
- **알려진 한계** — 테스트 러너가 없어 UI 검증이 스크린샷 육안 확인에 의존한다. 11-2 처럼 lint 룰만은 실제 실패/통과를 확인할 수 있다.

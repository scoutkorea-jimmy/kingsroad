# 뱅기노자 사이클 로드맵

> **목적:** 향후 작업 단위(사이클)의 단일 백로그. 사이클 시작 시 이 문서에서 다음 항목을 가져오고, 완료 시 status 갱신.
> **연관 문서:** 완료된 사이클 회고는 `pages/admin/AdminDesignHub.jsx` 의 `ADMIN_VERSION_HISTORY` 와 `CONTEXT.md §5` 에 기록.
> **마지막 갱신:** 2026-05-01 (v00.070 직후)

---

## 사용 규약

1. **사이클 시작** — 큐 1 의 첫 pending 항목을 in_progress 로 표시하고 작업.
2. **사이클 완료** — status `✅ done` + 한 줄 회고 (commit hash). `ADMIN_VERSION_HISTORY` 신규 엔트리는 항목과 1:1 대응.
3. **새 보고/발견** — 적절한 큐(코드측 / 워커의존 / 메이저)에 즉시 추가. 이 문서가 single source of truth.
4. **순서 변경** — 사용자 지시 또는 차단 발견 시 자유롭게 재정렬. 단 의존성(★) 명시 항목은 차단 해소 전 진입 금지.

---

## 큐 1 — 코드측 무차단 (워커 배포 불필요)

### ✅ v00.071 — 빌드 단계 도입 (esbuild) — Babel-standalone 제거 (commit 다음 sha)
- 완료: tools/build.mjs (esbuild) + boot.jsx 분리 + index.html 재작성 (@babel/standalone CDN 제거) + pre-commit hook 자동 빌드 + check-syntax 가 jsx/js 짝 인식

### ✅ v00.072 — 홈 노출 축약 + 투어 admin 통합
- 완료: HomePage truncatePreview (110자) + TourAdminPanel inline 답사 일정·준비물·커버 편집 + 버튼 라벨 명시화 (제목·정원·난이도·소요시간·가격).
- 미완 (v00.073 으로 이월): LectureAdminPanel 동일 패턴 — `lecturePages` site_content 신설 필요.

### ✅ v00.073 — 전 페이지 헤더 + 푸터 admin 편집화 sweep
- 완료: 9 신규 site_content 키 (lecture/community/column/bookCheckout/faq/myPage/eat/sleep/shopIntro) + 푸터 4 필드 (copyright/headingContent/Info/Contact) + 9 SectionForm. myPageIntro 의 {name} 토큰 치환.
- 미완 (v00.075+ 으로 이월): LecturePageEditorPanel 신설 (강연 페이지에 투어와 동일한 일정/준비물/커버 per-lecture 편집), 후기 게이팅 등 lectureReviewsGate 등.

### ✅ v00.074 — 데이터 매퍼 audit
- 완료: _toBook 양방향 silent 버그 fix (DB cover_key/pdf_key/is_primary/sort_order 직접 매칭 + _toBookPayload 변환). _toLecture createdAt/updatedAt 패스스루. _toOrder bookId 추가. _toColumn / _toTour / reservation mapper 는 audit 결과 깨끗.

### ⏳ v00.075 — (이전 v00.074) 데이터 매퍼 audit (예약 슬롯)
- [ ] `data.js` 의 모든 `_toX` 매퍼 함수가 워커 응답 필드를 보존하는지 점검
  - [ ] `_toTour` (v00.070 fix 완료, 회귀 검증)
  - [ ] `_toLecture` (또는 LECTURES 헬퍼 내부 매퍼)
  - [ ] `_toColumn`
  - [ ] `_toBook`
  - [ ] `_toOrder`
  - [ ] `_toUser` / `_toMember`
  - [ ] `_toReservation` (강연 / 투어 / 책)
- [ ] 누락 발견 시 패스스루 + 사이클 노트
- **동기:** v00.070 `_toTour` 누락 발견 (소요 시간 / 난이도 빈 값) → 다른 매퍼에도 hidden bug 가능성. 안정성 우선 사이클.
- **추정:** 1-2 시간 (코드 read + 워커 응답 vs 클라이언트 셰이프 diff).
- **status:** pending

### ⏳ v00.072 — 강연 페이지 편집화 (LecturesPage)
- [ ] `site_content_kv.lectureIntro` 신설 (eyebrow / titlePrefix / titleAccent / subtitle)
- [ ] `site_content_kv.lectureReviewsGate` 신설 (gate / anonymous / empty)
- [ ] `site_content_kv.lecturePages[id].coverDataUri` 슬롯 (per-lecture 커버)
- [ ] LecturesPage 하드코드 → site_content fallback
- [ ] SiteContentAdminPanel: 인트로 / 후기 안내 SectionForm
- [ ] LectureAdminPanel 또는 별도 LecturePageEditorPanel per_lecture 모드 (커버 업로드)
- **동기:** 투어와 강연은 쌍. v00.070 패턴(투어 페이지) 그대로 강연에 적용.
- **추정:** 2-3 시간.
- **status:** pending

### ⏳ v00.073 — HomePage 잔여 하드코드
- [ ] 추천 여행지 섹션 헤더 (`site_content_kv.recommendationsHeading`)
- [ ] 지도 모달 안내 + 빈 상태 메시지
- [ ] 통계 카드 위 미니 헤딩 (있다면)
- [ ] 기타 audit 후 발견된 잔여 텍스트
- **동기:** "모든 항목 admin 편집 가능" 원칙 완성. v00.054(hero) / v00.056(stats) / v00.057(footer) 이후 잔여.
- **추정:** 1 시간.
- **status:** pending

### ⏳ v00.074 — ColumnPage + MyPage 하드코드
- [ ] ColumnPage: 리스트/상세 헤더, 빈 상태 메시지, 등급 배지 라벨
- [ ] MyPage: 섹션 라벨, 빈 상태 메시지, 액션 버튼 텍스트
- [ ] `site_content_kv.columnIntro`, `mypageStrings` 슬롯
- **추정:** 1-2 시간.
- **status:** pending

### ⏳ v00.075 — EatSleepShop 3 페이지 하드코드
- [ ] `/eat` 인트로 + 안내 (`site_content_kv.eatIntro`)
- [ ] `/sleep` 인트로 + 안내 (`site_content_kv.sleepIntro`)
- [ ] `/shop` 인트로 + 안내 (`site_content_kv.shopIntro`)
- **추정:** 1 시간 (패턴 동일 묶음).
- **status:** pending

### ⏳ v00.076 — Tiptap CSS 보강
- [ ] `styles.css` — 표 (border / padding / 헤더 강조 / responsive overflow)
- [ ] 체크리스트 (`ul[data-type="taskList"]` + checkbox 정렬)
- [ ] 형광펜 (`mark` 색상 토큰)
- [ ] Sub / Sup (vertical-align + font-size)
- [ ] 정렬 4 종 (text-align 명시)
- [ ] 코드블록 (`pre code` background / padding / mono / 줄간격)
- [ ] YouTube 임베드 (aspect-ratio)
- **동기:** v00.068 에서 14 extension 도구만 풍부화 / 결과 렌더 styles.css 미완. 글쓰기 → 미리보기 가독성 갭.
- **추정:** 1-2 시간.
- **status:** pending

### ⏳ v00.077 — useModalGuard 일괄 적용
- [ ] LegalModal — ESC + 외부클릭
- [ ] PostViewerModal — ESC + 외부클릭
- [ ] SuspendDialog — ESC
- [ ] 추천 카드 상세 모달 — ESC + body scroll lock 정합
- [ ] 기타 모달 audit
- **동기:** v00.067 에서 useModalGuard 도입 후 일부 모달만 적용. UX 일관성.
- **추정:** 1-2 시간.
- **status:** pending

### ⏳ v00.078 — AuthAdminPage 2차 분할
- [ ] HeroEditorPanel + FooterStyleEditor + TourPageEditorPanel + RecommendationsAdminPanel → `pages/admin/AdminContentEditors.jsx` (~1500 줄 이동)
- [ ] trampoline 패턴 재사용 (v00.070 AdminDesignHub 와 동일)
- [ ] index.html 스크립트 태그 + cache-buster
- **동기:** 현재 6881 줄. defensive — 다음 큰 패널 추가 시 8000 닿기 전 재분할.
- **추정:** 1 시간.
- **status:** pending

---

## 큐 2 — 워커 배포 의존 (★ 사용자 wrangler deploy 필요)

### ⏳ v00.079 — legacy `comments` 키 서버 일원화
- 워커: 신규 comment 집계 endpoint (`/api/me/comments-count`, `/api/users/:id/comments-count` 등)
- 클라이언트: BGNJ_STORES 에서 `comments` 키 제거
- 마이그레이션: storage v6 (v5-reports-dead 다음)
- **차단:** ★ wrangler deploy
- **동기:** v00.063 에서 `reports` 키 제거 후 잔존 마지막 legacy 키.
- **status:** pending

### ⏳ v00.080 — R2 업로드 흐름
- 워커: R2 bucket 생성 + `wrangler.toml` binding
- 워커 endpoint: `/api/uploads/sign` (presigned URL or direct upload)
- 클라이언트 마이그레이션: 게시글 첨부 / 투어 커버 / OG 이미지 dataURI → R2 객체 URL
- 호환성: 기존 dataURI 인라인 데이터 점진 마이그레이션 (양 형식 모두 표시)
- **차단:** ★ R2 plan + wrangler deploy
- **동기:** dataURI 인라인 → D1 응답 / localStorage 부담. 첨부 제한(10MB×3) 도 R2 도입 시 완화 가능.
- **status:** pending

### ⏳ v00.081 — 투어 schema `cover_url` 컬럼
- 워커: D1 schema migration (`ALTER TABLE tours ADD COLUMN cover_url TEXT`)
- 워커: `tourRow` 매퍼 + `saveTour` payload 에 cover_url 포함
- 클라이언트: `site_content_kv.tourPages[id].coverDataUri` 우회 폐기 (또는 v00.080 R2 와 결합)
- **차단:** ★ wrangler d1 execute + deploy
- **동기:** v00.070 에서 site_content_kv 우회로 임시 처리. 정식 컬럼화 + R2 와 결합 시 깔끔.
- **status:** pending — v00.080 와 묶어 한 deploy 로 처리 권장.

---

## 큐 3 — 메이저 마이그레이션 (별 사이클, 분리 진행)

### ⏳ v00.090 — Tiptap 3 메이저
- TiptapEditor.jsx + AdminColumnEditor 마이그레이션
- extension API 변경 (StarterKit 분해 / Editor.create 시그니처 등)
- 회귀 테스트: 칼럼 작성 / 게시글 모달 / 후기 작성
- KMS 의존성 매트릭스의 risk: major 해소
- **추정:** 3-5 시간.
- **status:** pending

### ⏳ v00.100 — React 19 메이저
- UMD 19 교체 + concurrent features
- 모든 페이지 smoke test (16 페이지)
- 회귀: ErrorBoundary 동작 / Tiptap 호환 / Babel-standalone 호환
- **추정:** 4-6 시간.
- **status:** pending

---

## 큐 4 — 사용자 직접 작업 (코드 외)

| 항목 | 차단 영향 | 비고 |
|---|---|---|
| **★ wrangler deploy v00.062 metrics endpoint** | GradePromotionPanel 의 서버 metrics 폴백 (현재 클라이언트 fallback) | `cd workers && wrangler deploy` |
| **★ HTTPS/SSL 인프라 도입** | bgnj.net SSL 활성화 | CONTEXT.md §7.5 가이드 — Cloudflare 대시보드 + GitHub Pages 설정 |

---

## 발견된 hidden 항목 (audit 결과 → 큐 1 이동)

> 매 사이클 audit 시 발견된 항목은 여기에 임시 기록 후 적절한 큐로 분류.

(현재 비어있음)

---

## 사이클 완료 회고 (요약, 상세는 ADMIN_VERSION_HISTORY)

> 본 문서는 forward-looking. 완료 항목은 한 줄로 옮기고 본문에서 제거.

- **v00.070** ✅ 투어 페이지 모든 항목 admin 편집 + AuthAdminPage 9332→6900 분할 (commit `3ccc6b9`)
- **v00.071** ✅ 빌드 단계 도입 (esbuild) — Babel-standalone 제거, in-browser 경고 / 500KB deopt 근본 차단 (commit `0dcf267`)
- **v00.072** ✅ 홈 카드 desc 축약 + TourAdminPanel inline 답사 일정·준비물·커버 편집 통합 (commit `16940d3`)
- **v00.073** ✅ 전 페이지 hero/intro + 푸터 잔재 admin 편집화 sweep — 9 페이지 + 푸터 4 필드 (commit `07a9ca0`)
- **v00.074** ✅ 데이터 매퍼 audit — _toBook 양방향 silent 버그 fix + _toLecture/_toOrder 보강 (commit 다음 sha)

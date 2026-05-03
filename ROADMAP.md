# 뱅기노자 사이클 로드맵

> **목적:** 향후 작업 단위(사이클)의 단일 백로그. 사이클 시작 시 이 문서에서 다음 항목을 가져오고, 완료 시 status 갱신.
> **연관 문서:** 완료된 사이클 회고는 `pages/admin/AdminDesignHub.jsx` 의 `ADMIN_VERSION_HISTORY` 와 `CONTEXT.md §5` 에 기록.
> **마지막 갱신:** 2026-05-04 (v00.156 — v00.114~v00.155 누적 사이클 회고 한 줄 정리 + 큐 1/2 본 세션 후보 반영)

---

## 사용 규약

1. **사이클 시작** — 큐 1 의 첫 pending 항목을 in_progress 로 표시하고 작업.
2. **사이클 완료** — status `✅ done` + 한 줄 회고 (commit hash). `ADMIN_VERSION_HISTORY` 신규 엔트리는 항목과 1:1 대응.
3. **새 보고/발견** — 적절한 큐(코드측 / 워커의존 / 메이저)에 즉시 추가. 이 문서가 single source of truth.
4. **순서 변경** — 사용자 지시 또는 차단 발견 시 자유롭게 재정렬. 단 의존성(★) 명시 항목은 차단 해소 전 진입 금지.

---

## 큐 1 — 다음 사이클 (검증 보고 후 명시 갱신)

> v00.155 까지 책 카탈로그 다권화 사이클 마무리. 본 세션(v00.156) 검토에서 발굴된 후보:

- **책별 리뷰 분리** — `BGNJ_BOOK_ORDERS.refreshReviews/addReview/canReview/hasReviewed` 가 [data.js:2209](data.js#L2209), [data.js:2227](data.js#L2227) 에서 `'kingsroad'` 책 ID 하드코드. 1권 가정 잔재. 책별 리뷰 흐름이 BGNJ_BOOKS 의 책별 리뷰와 통합 또는 분리 필요. **사용자 의도 확인 필요** (단일 페이지 글로벌 vs 책별 탭).
- **챕터 깊은 들여쓰기** (`-- ` 2단계+) — v00.155 의 1단계 sub-item 만 처리. 사용자 신호 시 추가.
- **에러 페이지 라이브 라우트** (`?p=error&code=403` 등) — v00.152 에러 페이지 6종 미리보기 패널은 있으나 라이브 진입로 부재 (404 만 boot.jsx unknown route 폴백). 1 commit.
- **403/401 자동 wiring** — 권한 보호 라우트 (admin 미인증 진입 등) 시 자동 노출. 인증/권한 경로 정리 사이클.
- **PG 결제** — 무통장 임시. 별 사이클 (외부 의존 + 비용).
- **사이트 검토 결과 반영** — v00.156 의 일반-목적 에이전트 보고서 도착 후 우선순위 TOP 5 항목을 본 큐로 분류.

## 큐 2 — 워커 배포 의존 (★ wrangler deploy 필요)

- **v00.154 영수증 mail subject 동적화** — [workers/src/index.js:1530](workers/src/index.js#L1530) book_orders LEFT JOIN books 변경. 코드 push 됨, deploy 대기. `cd workers && wrangler deploy` 한 번. 배포 전엔 옛 워커가 옛 텍스트 발송.

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
| **★ HTTPS/SSL 인프라 도입** | bgnj.net SSL 활성화 | CONTEXT.md §7.5 가이드 — Cloudflare 대시보드 + GitHub Pages 설정 |
| ✅ ~~Cloudflare Secrets 이관~~ | (v00.125 결정: 미진행) 이메일 자체는 자격 증명이 아니고 비밀번호 보호 — 평문 유지로 결정. | |
| ✅ ~~schema-v4.sql 적용~~ | (v00.113 완료) login_attempts 테이블 + 인덱스 2 — rate limit 활성. | |
| ✅ ~~seed-kv.sql 적용~~ | (v00.123 완료) categories_kv 5 / grades_kv 6 row 세팅. server-first 정상화. | |
| ✅ ~~schema-v5.sql 적용~~ | (v00.123 완료) legacy categories / grades / site_content DROP. 28 tables remaining. | |

---

## 검증 권장 (사용자 직접)

> v00.071-100 사이클 후 라이브 회귀 점검. 각각 한 번 시도하면 충분.

- [ ] **R2 첫 업로드** — admin → 사이트 콘텐츠 → OG 이미지 업로드 한 번 → Network 탭에서 `/api/media/upload` 200 확인 + bucket object_count: 0 → 1+ 확인 (현재 0)
- [ ] **Tiptap 3 회귀** — 글쓰기 모달에서 표 / 체크리스트 / 형광펜 / Sub-Sup / 정렬 / 코드블록 / YouTube 정상 동작
- [ ] **투어 cover_url D1 분기** — admin → 투어 → 카드 `📋` 에서 cover 업로드 → 라이브 답사 페이지에서 D1 `cover_url` 우선 표시
- [ ] **강연 페이지** — admin → 강연 → 카드 `📋` 에서 진행/참고/커버 inline 편집 동작
- [ ] **books 정상 저장** — admin → 책 → 표지/대표/순서 변경 시 새로고침 후에도 보존 (v00.074 silent bug fix 회귀 검증)

---

## 발견된 hidden 항목 (audit 결과 → 큐 1 이동)

> 매 사이클 audit 시 발견된 항목은 여기에 임시 기록 후 적절한 큐로 분류.

(v00.100 검증 보고 → v00.083~086 으로 분류 완료)

---

## 사이클 완료 회고 (요약, 상세는 ADMIN_VERSION_HISTORY)

> 본 문서는 forward-looking. 완료 항목은 한 줄로 옮기고 본문에서 제거.

- **v00.070** ✅ 투어 페이지 모든 항목 admin 편집 + AuthAdminPage 9332→6900 분할 (commit `3ccc6b9`)
- **v00.071** ✅ 빌드 단계 도입 (esbuild) — Babel-standalone 제거, in-browser 경고 / 500KB deopt 근본 차단 (commit `0dcf267`)
- **v00.072** ✅ 홈 카드 desc 축약 + TourAdminPanel inline 답사 일정·준비물·커버 편집 통합 (commit `16940d3`)
- **v00.073** ✅ 전 페이지 hero/intro + 푸터 잔재 admin 편집화 sweep — 9 페이지 + 푸터 4 필드 (commit `07a9ca0`) — *추천 섹션 헤더 잔재는 v00.083 으로 이월*
- **v00.074** ✅ 데이터 매퍼 audit — _toBook 양방향 silent 버그 fix + _toLecture/_toOrder 보강 (commit `726fbb1`)
- **v00.075** ✅ 강연 페이지 편집화 parity — 진행/참고/커버 per-lecture + 후기 게이팅 + inline LectureAdminPanel (commit `9bb52f8`) — *글로벌 default GUI 편집은 v00.083 LecturePageEditorPanel 로 이월*
- **v00.076** ✅ Tiptap CSS 보강 — 14 extension 시각 스타일 일괄 (commit `5a918f7`)
- **v00.077** ✅ useModalGuard 일괄 적용 — 5 모달 ESC+body lock+popstate 통일 (commit `bddd796`)
- **v00.078** ✅ AuthAdminPage 2차 분할 — AdminContentEditors.jsx 1300 줄 추출 (commit `7249dc5`)
- **v00.079** ✅ legacy `bgnj_comments` 제거 + storage v6 + ★ wrangler deploy v00.062 metrics endpoint 활성화 (commit `5132fb5`)
- **v00.081** ✅ 투어 D1 `cover_url` 컬럼 마이그레이션 + ★ wrangler deploy (commit `8356cef`) — *legacy site_content cover 자동 마이그 도구는 v00.086 으로 분리*
- **v00.082** ✅ R2 업로드 흐름 활성화 — admin 6 슬롯 (OG/로고/파비콘/auth/투어 커버/강연 커버) (commit `0707e00`) — *Books/Recommendations/게시글 미적용 → v00.084-085 로 분리*
- **v00.090** ✅ Tiptap 3 메이저 — @tiptap/* 3.22.5 + StarterKit 중복 제거 (commit `2115b77`)
- **v00.100** ✅ React 19 마이그레이션 평가 — UMD 단종으로 보류 + 18.3.1 LTS 유지 + DEPENDENCY_MATRIX 갱신 (commit `583c255`)
- **v00.101** ✅ LecturePageEditorPanel + HomePage 추천 헤딩 (ROADMAP v00.083, commit `6886d4d`)
- **v00.102** ✅ R2 admin 확장 — Books 표지/PDF + Recommendations 이미지 (ROADMAP v00.084, commit `983d094`)
- **v00.103** ✅ R2 사용자 콘텐츠 — 게시글 첨부 + 이미지 (ROADMAP v00.085, commit `0eaf1d2`)
- **v00.104** ✅ LegacyMigrationPanel — 누적 legacy cover 일괄 마이그 (ROADMAP v00.086, commit 다음 sha)
- **v00.105** ✅ 홈 hero 지도 제거 + 빈 섹션 미노출 + 커버 placeholder 통합 + 책 추가 fix + site_content 줄바꿈 + 투어/강연 admin 통합 + 놀자 시리즈 그룹화 + Tiptap 3 named imports
- **v00.106** ✅ TourAdminPanel 폼 재구조화 (필드 그룹 6) + 부제/환불정책 D1 컬럼 + GUI 일정/준비물 편집 (zebra cards) + ★ wrangler deploy
- **v00.107** ✅ ADMIN_VERSION_HISTORY datetime + KST 헬퍼 (BGNJ_FMT) + CSV 다운로드 + 사이트 KST sweep 시작
- **v00.108** ✅ BGNJ_FMT formatToParts fix (정규식 출력 깨짐 해소) + 사이트 전반 KST sweep 19곳 + DEPENDENCY_MATRIX 갱신
- **v00.109** ✅ 보안 audit — DOMPurify XSS sanitize 5곳 + R2 폴더 권한 분기 + HTTP origin 제거 + ★ wrangler deploy
- **v00.110** ✅ 홈 hero ReferenceError fix (HeroProgramCards G 미정의) + v00.106~109 datetime 실제 commit 시간 정정
- **v00.111** ✅ datetime auto-stamp (tools/stamp-datetime.mjs) + 게시판 작성 권한 검증(post_min_level) + X-Frame-Options/CSP frame-ancestors (commit `5ddcf25`) — *★ 워커 deploy 보류*
- **v00.112** ✅ BGNJ_SAFE_HTML hardening — iframe src 화이트리스트(YouTube/Vimeo) + data: URI image-only + a[target=_blank] noopener 강제 + ROADMAP 갱신
- **v00.113** ✅ 전체 CSP 메타 + brute-force rate limit (D1 login_attempts) + ★ wrangler deploy v00.111 post_min_level + rate limit 일괄
- **v00.114~v00.150** ✅ 누적 사이클 — 상세는 `ADMIN_VERSION_HISTORY` 참조. 핵심: 보안 마무리(CSP SHA-256 / DOMPurify hardening / X-Frame-Options) + 운영 도구(BGNJ_FMT KST sweep / 푸터·게시판 권한 정비 / admin createdAt 오버라이드) + 콘텐츠 사이트 리프레시(홈 hero / 추천·투어·강연·게시판 카드) + 자동화 도구(stamp-datetime / csp-hashes / check-version / build / check-syntax 5단계 pre-commit) + page-view 분석 인프라 + 사용자 여정 + 등급 자동 reset 중단 (BGNJ_AUTO_GRADE_DISABLED) + 오류 페이지 6종 + admin 미리보기 패널.
- **v00.151** ✅ 홈 책 CTA + BookPage 표지 BGNJ_BOOKS.primary() 실 데이터 사용 + 영문판 미입력 hide (commit `e5cb0dd`)
- **v00.152** ✅ 홈 책 CTA 다권 카루셀 (좌우 무한 wrap + autoplay) + hero 지도 버튼 제거 + 작업 가이드 룰 2 신설 (plans/<버전>.md 선작성 / 명령 출력 오류 우선) + memory feedback 2건 (commit `70b9992`)
- **v00.153** ✅ 메뉴 '뱅기노자 도서' (3 곳) + BookPage 다권 탭 + 책 메인 제목/소개 탭/저자 탭 의 『왕의길』 하드코드 제거 → BGNJ_BOOKS 데이터 사용 (commit `12472dd`)
- **v00.154** ✅ cart 자료구조 bookId 도입 + CheckoutPage / MyPage / AuthAdminPage / 영수증 텍스트의 모든 『왕의길』 동적 + 워커 영수증 mail subject books JOIN (★ deploy 대기) (commit `5ffc8db`)
- **v00.155** ✅ 책 목차 sub-item — `- ` prefix → 직전 챕터 하위 설명 (들여쓰기 + bullet) + admin textarea hint/placeholder + kms.md 책 영역 입력 규칙 (commit `0e76713`)
- **v00.156** ✅ 메타 갱신 사이클 — ROADMAP 본 세션 회고 + CONTEXT.md §0/§5 갱신 + plans/README 신설 + 사이트 심층 검토 보고서 발행 (코드 수정 없이 후속 큐 분류)

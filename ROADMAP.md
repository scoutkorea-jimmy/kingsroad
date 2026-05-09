# 뱅기노자 사이클 로드맵

> **목적:** 향후 작업 단위(사이클)의 단일 백로그. 사이클 시작 시 이 문서에서 다음 항목을 가져오고, 완료 시 status 갱신.
> **연관 문서:** 완료된 사이클 회고는 `CONTEXT.md §5` + commit message + `plans/<버전>.md`. (v00.202 부터 `ADMIN_VERSION_HISTORY` 미수정 패턴.)
> **마지막 갱신:** 2026-05-09 (v00.241 — v00.227~240 14 사이클 ADMIN_VERSION_HISTORY 재개 + CONTEXT §5 갱신 + kms.md 변경기록 추가)

---

## 사용 규약

1. **사이클 시작** — 큐 1 의 첫 pending 항목을 in_progress 로 표시하고 작업.
2. **사이클 완료** — status `✅ done` + 한 줄 회고 (commit hash). `ADMIN_VERSION_HISTORY` 신규 엔트리는 항목과 1:1 대응.
3. **새 보고/발견** — 적절한 큐(코드측 / 워커의존 / 메이저)에 즉시 추가. 이 문서가 single source of truth.
4. **순서 변경** — 사용자 지시 또는 차단 발견 시 자유롭게 재정렬. 단 의존성(★) 명시 항목은 차단 해소 전 진입 금지.

---

## 큐 1 — 다음 사이클 (검증 보고 후 명시 갱신)

> v00.225 까지 모바일 UX 4-사이클 마무리. v00.226 메타 현행화 후 후속 큐.
> v00.227~233 (2026-05-09 7-사이클): anchor scroll-padding / 관리자 프론트 강연·투어 quick-add /
> /error 라이브 라우트 + /mypage·/admin 401 wiring / .gold·.gold-2 가독성 hotfix /
> **데이터 사라짐 23곳 가드 + lint 룰 cache_overwrite 항구 차단** / 강연·투어 신청 동의 필수 /
> 데이터 사라짐 케이스 스터디 + 영구 기록.

**사용자 큐 잔존 (v00.234+)**
- 관리자 프론트 페이지 강연/칼럼/투어 **수정 모달** (v00.228 add 패턴 확장)
- 강연/투어 **사진 갤러리** (최대 10장 + 출처 + 대표사진) — site_content_kv 활용 / 워커 deploy 회피 가능
- (별도 audit) fire-and-forget admin save 일괄 await + try/catch + toast 정합 sweep

**미해소 이월 (v00.156 부터 carry-over)**
- **책별 리뷰 분리** — `BGNJ_BOOK_ORDERS.refreshReviews/addReview/canReview/hasReviewed` 가 [data.js:2209](data.js#L2209), [data.js:2227](data.js#L2227) 에서 `'kingsroad'` 책 ID 하드코드. 1권 가정 잔재. **사용자 의도 확인 필요** (단일 페이지 글로벌 vs 책별 탭).
- **챕터 깊은 들여쓰기** (`-- ` 2단계+) — v00.155 의 1단계 sub-item 만 처리. 사용자 신호 시 추가.
- **에러 페이지 라이브 라우트** (`?p=error&code=403` 등) — 미리보기 패널만 있고 라이브 진입로 부재. 1 commit.
- **403/401 자동 wiring** — 권한 보호 라우트 시 자동 노출.
- **PG 결제** — 무통장 임시. 별 사이클 (외부 의존 + 비용).

**v00.157~225 후속 후보**
- **AuthAdminPage.jsx 9127줄 분할** — `large_file` INFO 누적 알림. v00.187 AdminShared 분리 (-759줄) 이후에도 유지. 다음 분할 후보: AdminMemberPanel / AdminCommunityPanel / AdminBookOrdersPanel.
- **scroll-to-top FAB UX 추가 개선** — v00.225 폰 36×36 축소 후에도 댓글 폼 우측 가림 가능성 잔존. 폼 영역 진입 시 자동 hide 검토 (별도 사용자 민원 시).
- **anchor scroll-margin-top** — sticky nav (64px 모바일 / 72px 데스크톱) 아래로 #col-N 등 anchor 점프 시 도착점이 가려질 수 있음. 현재 ColumnPage 는 selectedId state 로 우회하나, 칼럼 댓글 `#col-comments` 등 native anchor 가 있는 곳은 scroll-margin-top 권장.
- **다크모드 sweep 잔재** — v00.197 본문 가독성 fix 후에도 인라인 hex (`#1e293b` 등 boot.jsx 토스트, ConfirmDialog 등) 잔존. 토큰화 필요.

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
- **v00.157~166** ✅ admin 카드 hover popover · 버튼 radius 8 + subtle shadow lift · P0 3건 일괄 · useModalGuard focus trap + 워커 영수증 deploy · React production build + script defer + localStorage PII sanitize · 책 카루셀 슬라이드 · 디자인 max 2단 룰 · 사이드바 collapsible · 사이트 설정 7→1 단일 머지
- **v00.167~177** ✅ 사이트 설정 우측 라이브 미리보기 iframe · max 2단 룰 + iframe 차단 해제 · 칼럼 admin 글쓰기 버튼 · 글 본문 사라짐 hotfix + 룰 무조건 서버저장 · 게시판 추가/삭제 인라인 + 책 순서 + 카테고리 server delete · 홈 책 CTA 별도 소개글 · 차트 호버 + 코호트 (7/14/30/90일) · 사용자 여정 Sankey · admin 게시판 테이블 + DnD · 수정 버튼 미반응 hotfix · admin 커뮤니티 통합 단일 sub-tab
- **v00.178~190** ✅ 사용자 여정 죽은 코드 제거 (-175) · RankedBarList DRY · CommunityPostsAdminPanel 추출 · localStorage server-first audit · download 헬퍼 추출 (6 패널) · 내부 인원 알람 broadcast · pickImageWithR2Fallback DRY · 이미지 업로드 잔여 · legacy 4 dead store 제거 · AdminShared.jsx 분할 (-759) · 키보드 nav + h1 위계 · 등급 이름 초기화 fix · 통합 활동 로그 패널
- **v00.191~196** ✅ 알람 그룹 + PC 미리보기 가로 확장 · pvSeries 시간 라벨 hotfix · 새 책 추가 prompt 제거 + 메뉴 미리보기 · 회원가입 추이 + 시간대별 히트맵 · 가입자 추이 0 root fix · 등급별 분포 차트 + 검색콘솔 패널
- **v00.197~205** ✅ 다크모드 본문 가독성 + 좌우 정렬 + 시분 표시 · admin 번들 lazy-load + 워커 CDN 캐시 · 기능정의서 최신화 + 홈 fontScale + 책 노출 필드 · 사이트 이메일 단일화 contact@bgnj.net · P1 묶음 — 비밀번호 변경 + 본문 검색 옵션 · SEO sitemap lastmod + 네이버 검색콘솔 · postMessage origin 검증 · 디자인 가이드 9건 코드 동기화
- **v00.206~209** ✅ BGNJ_TOAST 프로그램 호출 API + ConfirmDialog · alert() 73건 → BGNJ_TOAST.error 일괄 · window.confirm() 47건 → BGNJ_CONFIRM Promise 일괄 · **레거시 컬러 토큰 (`--gold/--cta-*`) 전면 제거 → `--primary*`**
- **v00.210~217** ✅ 칼럼 작성 무한 로딩 hotfix · 모바일 햄버거←로고 · /login·/signup PAGE_NOT_LOADED hotfix · /signup 직접 진입 회원가입 탭 자동 활성 · 새 빌드 자동 감지 + 새로고침 배너 · 모바일 auth hero art 숨김 · admin 사이드바 서브메뉴 위계
- **v00.218~220** ✅ 현금영수증 신청 (책/강연/투어) · 칼럼 일련번호 + 단축 공유 URL `#col-N` · admin 칼럼 카테고리 칩 시인성
- **v00.221~225** ✅ **모바일 UX 4-사이클** — ① 도서 표지 모바일 sticky 해제 · ② 게시글 목록 제목 1줄 + 메타 라인 · ③ 모바일 가독성 종합 패스 (post-body 17px / field-input 16px iOS zoom 차단 / iframe 16:9 / dim-2 ink-2 / 카드 호흡) · ④ 강연/투어/결제 sticky 카드 일괄 해제 · ⑤ scroll-top FAB 폰 36×36 (footprint −56%) + 종합 충돌 검토
- **v00.226** ✅ 메타 현행화 사이클 — kms.md 디자인 §1-8 전면 재작성 (블루→옐로우 환원 반영, `--primary*` 토큰 명시) + v00.157~225 변경기록 압축 요약 + CONTEXT.md §0/§5/§6 갱신 + ROADMAP.md 사이클 회고 + memory release_workflow 룰 완화

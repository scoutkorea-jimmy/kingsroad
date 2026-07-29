# 누적 사이클 히스토리 (아카이브)

> 2026-07-29 문서 재편 시 `CONTEXT.md` §5 에서 이관됨. **과거 기록이며 현행 규칙이 아닙니다.**
> 현행 규칙은 [rules/](../../), 앞으로 할 일은 [ROADMAP.md](../../../ROADMAP.md).

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

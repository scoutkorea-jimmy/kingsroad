# KMS

## 목적

이 문서는 `뱅기노자(BANGINOJA)` 프로젝트의 운영 기준 문서다.
다른 사람이나 다른 AI가 코드를 직접 열지 않아도 현재 사이트의 기능 구성, 화면 디자인 기준, 운영 규칙을 한 곳에서 확인할 수 있어야 한다.

## KMS 구조 원칙

KMS는 **두 개의 탭**으로 구성된다.

1. `기능정의서` 탭 — KMS의 제1 기능. 진입 시 기본으로 보이는 탭.
2. `디자인` 탭 — 화면 작업의 기준 문서.

관리자 페이지에서 `KMS`를 누르면 `기능정의서` 탭이 먼저 열린다.
운영 규칙(AI 작업 원칙, 배포 검토 원칙, 우선순위 등)은 KMS 화면의 탭으로 두지 않고, 이 문서 본문(`부록`)과 관리자 `버전 기록` 탭에서 관리한다.

## KMS 제1 원칙

KMS의 제1 기능은 `기능정의서`다.
즉, 이 문서는 다른 개발자가 코드를 직접 열지 않아도 현재 홈페이지가 어떤 기능을 갖고 있고, 각 기능이 어디까지 구현되어 있으며, 무엇이 아직 남아 있는지 먼저 이해할 수 있어야 한다.

기능정의서는 사이트가 존재하는 5가지 미션을 기준으로 구성한다.

1. 뱅기노자 커뮤니티 운영
2. 뱅기노자 강연 일정 안내
3. 뱅기노자 칼럼 공유
4. 뱅기노자 투어 프로그램 판매·운영
5. 뱅기노자 책 판매

이 5개 미션 위에 공통 기반(홈, 인증/계정, 마이페이지, 관리자, 운영 문서)이 받쳐준다.

기능정의서는 `실제 라우트`, `실제 노출 콘텐츠`, `실제 저장소 구조`를 기준으로 작성한다.
기획상 있었지만 화면에서 제거된 영역은 현재 기능으로 기록하지 않는다.

## 문서 운영 원칙

1. `kms.md`와 `ai-development-rules.md`는 같이 관리한다.
2. 새 규칙이 추가되면 두 문서를 동시에 갱신한다.
3. 구현 현황이 바뀌면 KMS도 함께 갱신한다.
4. 관리자 페이지의 KMS 화면은 이 문서와 같은 기준을 반영해야 한다.
5. KMS를 수정할 때는 무엇이 바뀌었는지만 적지 말고, 왜 수정했는지 계기와 배경도 함께 기록한다.
6. KMS 기록은 나중에 다른 AI나 사람이 보고도 맥락을 이해할 수 있어야 한다.

# 탭 1 · 기능정의서

이 섹션은 관리자 페이지 KMS의 `기능정의서` 탭과 같은 내용을 다룬다.
각 영역은 아래 구조로 정리한다.

- 영역 정체성(역할 / 라우트 / 상태)
- 현재 평가
- 없는 기능 정리(완성도를 높이려면 필요한 것)
- 기능(각 기능: 요소 / 기술 스펙 / 유의할 점 / 개발 이슈)
- 영역 차원의 기술 스펙
- 영역 차원의 유의할 점
- 영역 차원의 개발 이슈

## 5가지 미션 평가 요약

| # | 미션 | 상태 | 평가 |
|---|------|------|------|
| 01 | 뱅기노자 커뮤니티 | P5 완료 (기능 ~95%) | 본문 검색·정렬 다양화(조회순·댓글순·좋아요순) 추가로 검색 커버리지 완성. 이미지 외부 스토리지·인기글 트렌드만 남음 |
| 02 | 뱅기노자 강연 일정 안내 | Round-out 마무리 (기능 ~80%) | 신청 폼·무통장 입금·정원·대기열·.ics·마이페이지 내역·관리자 운영·참여 후기까지 닫음. PG 결제·D-1 알림·체크인·자료 보관함은 다음 단계 |
| 03 | 뱅기노자 칼럼 공유 | Round-out 마무리 (기능 ~85%) | 임시 저장·예약 발행·발행 취소·좋아요·공유·댓글(답글 트리)·검색·카테고리·읽기 시간 자동 계산까지 도입. RSS·구독·작성자 프로필만 남음 |
| 04 | 뱅기노자 투어 프로그램 판매·운영 | Round-out 마무리 (기능 ~80%) | 신청 폼·무통장 입금·정원·대기열·.ics·마이페이지 내역·관리자 운영·참여 후기까지 닫음. PG 결제·체크인·환불은 다음 단계 |
| 05 | 뱅기노자 책 판매 | P5 완료 (기능 ~90%) | 독자 리뷰(배송 완료 회원 전용, 별점·작성·삭제)·환불 신청 흐름(사용자 신청→관리자 승인/반려) 추가. PG 결제·재고만 남음 |

## 영역 00 · 공통 기반 (BASE)

- 역할: 5개 미션이 공통으로 의지하는 진입점, 인증, 운영자 콘솔, 운영 문서.
- 라우트: `home`, `login / signup`, `mypage`, `admin`, `documents`, `privacy`, `terms`, `faq`
- 상태: 기본 구현
- 현재 평가: 랜딩 → 가입/로그인 → 마이페이지 → 관리자 콘솔까지 뼈대가 살아 있다. 강연·투어·주문이 실데이터로 연결되면서 마이페이지가 실질적 의미를 갖게 됐고, 법령 페이지·FAQ·감사 로그·자동 등급 승격까지 갖췄다. 남은 큰 과제는 외부 DB/서버 인증 전환이다.

### 없는 기능 / 완성도를 높이려면 필요한 것

- 외부 DB / 서버 인증으로의 전환 (현재 local-first)
- 이메일 인증 · 비밀번호 재설정 · 소셜 로그인
- 마이페이지 프로필 수정 · 비밀번호 변경
- 히어로 통계(2,847 회원 등)의 실수치 연결
- 전역 검색

### 기능

#### 홈 랜딩 — 구현됨

- 요소: 히어로(일월오봉도 SVG, 슬로건, CTA, 레이아웃 토글 center/split/fullbleed) / 공지사항(상위 2건 강조 + 행 리스트) / 왕사남 강연 일정(3열) / 투어 프로그램(2열) / 뱅기노자 칼럼(피처 1 + 사이드 4) / 파트너십(3열) / 책 구매 CTA / 푸터 배포 버전 카드
- 기술 스펙: `HomePage` 단일 컴포넌트. 데이터는 `BANGINOJA_DATA` 정적 + `BGNJ_COLUMNS.listPublic()` 병합(`[]` 빈 배열 fallback 버그 수정 완료). 레이아웃은 `tweaks.heroLayout`으로 토글. 칼럼 섹션은 `featuredColumn` null 가드로 빈 데이터 시 렌더링 스킵.
- 유의할 점: 히어로 통계 수치는 하드코딩이라 실제 운영 수치와 어긋날 수 있음. `data.notices / tours / partners`는 모두 `|| []` 방어 코드 적용됨.

#### 인증 / 계정 — 부분 구현

- 요소: 로그인/회원가입 토글 / 현재 인증 방식 안내 카드 / 약관·개인정보 동의 / 관리자 임시 계정(`admin@admin.admin / admin`) / 비밀번호 해시 저장 / 세션 유지 / 내비게이션 로그아웃
- 기술 스펙: `BGNJ_AUTH` helper + `BGNJ_STORES.users` / `BGNJ_STORES.session` localStorage. 비밀번호는 브라우저 내 해시.
- 유의할 점: local-first 인증이라 정적 배포 위에서만 동작. 외부 DB 연동 시 저장소만 교체하는 방향으로 설계되었으므로 계층 분리를 깨지 말 것.

#### 마이페이지 — 구현됨

- 요소: 비로그인 안내 / 계정 카드(이메일·등급·권한·가입 시각) / 등급·혜택 / 내 강연 신청 내역(상태·취소) / 내 투어 예약 내역(상태·취소) / 내 주문 내역(상태·영수증·직접 취소·환불 신청) / 북마크 게시글 목록 / 최근 커뮤니티 활동 / 알림 목록
- 기술 스펙: `MyPage` 단일 컴포넌트. `BGNJ_LECTURES.listMyRegistrations / BGNJ_TOURS.listMyReservations / BGNJ_BOOK_ORDERS.listMine / BGNJ_COMMUNITY` 실데이터 참조. `orderTick` state로 취소·환불 신청 후 목록 즉시 갱신.
- 유의할 점: 입금 대기 주문은 직접 취소 가능. 입금 확인·배송중 주문은 환불 신청(사유 필수) → 관리자 처리 대기 흐름.
- 유의할 점: 강연/투어는 sessionStorage로 상세 페이지와 연결. 마이페이지 → 강연/투어 상세 이동 시 해당 항목이 자동 선택됨.

#### 관리자 콘솔 — 부분 구현

- 요소: 사이드바 6개 그룹(요약/콘텐츠/회원·주문/운영 설정/개인정보/시스템) / 대시보드 / 게시글 관리 / 칼럼·칼럼 작성 / 강연·투어·주문 운영 / 회원 관리(`MemberAdminPanel`) / 게시판·등급 / 법령 편집(`LegalAdminPanel`) / FAQ 편집(`FaqAdminPanel`) / 계좌 설정 / 감사 로그(`AuditLogPanel`) / 개인정보 / KMS / 버전 기록
- 기술 스펙: `AuthAdminPage`가 `BGNJ_COMMUNITY / BGNJ_AUTH / BGNJ_STORES / BGNJ_LECTURES / BGNJ_TOURS / BGNJ_BOOK_ORDERS / BGNJ_AUDIT / BGNJ_LEGAL / BGNJ_FAQ` 참조. 비관리자는 `AdminDenied`.
- 유의할 점: 관리자 파일(`AuthAdminPage.jsx`)이 4400줄을 넘어 새 탭 추가 시 분할을 반드시 고려해야 한다.

#### 법령 공개 페이지 — 구현됨

- 요소: 개인정보 처리방침 / 이용약관 / 상단 최근 갱신일 / 타 법령 이동 버튼 / 홈 복귀 버튼
- 기술 스펙: `LegalPage` + `BGNJ_LEGAL.get(slug)`. 내용은 관리자 `LegalAdminPanel`에서 Tiptap으로 편집. 저장소 `bgnj_legal_docs`. 푸터 버튼이 `privacy` / `terms` 라우트로 연결.

#### FAQ 공개 페이지 — 구현됨

- 요소: 카테고리 필터 / 검색 입력 / 카테고리별 아코디언 목록
- 기술 스펙: `FaqPage` + `BGNJ_FAQ.search / listCategories`. 내용은 관리자 `FaqAdminPanel`에서 편집. 저장소 `bgnj_faq_items`. 푸터 버튼이 `faq` 라우트로 연결.

#### 회원 관리 (`MemberAdminPanel`) — 구현됨

- 요소: 회원 목록(검색·등급 필터·CSV) / 회원 상세(등급 변경·관리자 권한 토글·정지/해제·삭제·활동 이력 요약·최근 게시글·주문·강연·답사 리스트)
- 기술 스펙: `BGNJ_AUTH / BGNJ_COMMUNITY / BGNJ_BOOK_ORDERS / BGNJ_LECTURES / BGNJ_TOURS` 실데이터 참조. 등급 변경·정지·삭제 등 민감 액션은 `BGNJ_AUDIT.log` 자동 기록.

#### 감사 로그 (`AuditLogPanel`) — 구현됨

- 요소: 액션 목록(검색·CSV·전체 삭제) / 액션 유형 필터
- 기술 스펙: `BGNJ_AUDIT` + `BGNJ_STORES.auditLog`. 회원·강연·투어·책 핵심 액션(입금 확인·발송·배송·취소·등급 변경·정지 등)이 자동 기록됨. `member.grade_change / member.suspend / lecture.confirm_payment / book.ship / tour.confirm_payment` 등 유형 구분.

#### 자동 등급 승격 (`BGNJ_GRADE_PROMO`) — 구현됨

- 요소: 댓글 5개 이상 → 독자 자동 승격 / 글 3개 + 댓글 15개 이상 → 사관 자동 승격 / 승격 시 본인 알림 + 감사 로그 자동 기록
- 기술 스펙: `BGNJ_GRADE_PROMO.maybePromote(userId)`. `createPost / addComment` 시점에 자동 트리거. 승격은 일어나도 강등 없음.
- 유의할 점: 등급 커트라인(`grades` 배열의 `id`)이 바뀌면 승격 로직도 함께 갱신해야 함.

#### 운영 문서 / KMS / 버전 기록 — 구현됨

- 요소: `kms.md` / `ai-development-rules.md` / `project-priority-table.md` / 관리자 KMS 탭(기능정의서+디자인) / 관리자 버전 기록 / 푸터 배포 버전 카드
- 기술 스펙: 정적 마크다운 + 관리자 화면이 같은 내용을 컴포넌트로 표시. `window.BGNJ_VERSION`이 푸터·관리자 빌드 표시의 단일 출처.
- 유의할 점: 문서와 화면이 어긋나면 다음 작업자가 혼선을 일으킨다. KMS 화면 = `kms.md` 본문 = 같은 기준으로 동기화 유지.

### 영역 차원 · 기술 스펙

프론트 단일 SPA(React UMD + Babel standalone) + localStorage 기반 저장소(`BGNJ_STORES`) + helper 계층(`BGNJ_AUTH`, `BGNJ_COMMUNITY`, `BGNJ_LECTURES`, `BGNJ_TOURS`, `BGNJ_BOOK_ORDERS`, `BGNJ_COLUMNS`, `BGNJ_AUDIT`, `BGNJ_GRADE_PROMO`, `BGNJ_LEGAL`, `BGNJ_FAQ`). 외부 DB 연동 시 helper는 유지하고 저장소 구현만 교체하는 구조.

### 영역 차원 · 유의할 점

- 정적 배포(GitHub Pages) 환경이라 서버 측 권한 검증이 없으므로, 모든 권한 검사가 클라이언트 단에 그친다는 점을 잊지 말 것.
- Babel standalone로 JSX를 런타임 컴파일하므로 첫 페인트가 느릴 수 있다. 본격 트래픽 단계에서는 빌드 파이프라인 도입이 필요.

### 영역 차원 · 개발 이슈

- 같은 mock 데이터가 여러 곳에 흩어져 있던 P1 초기 → 단일 helper로 수렴.
- 정적 배포 환경에서 ESM 라이브러리 로딩이 깨지기 쉬워, window 글로벌 + ready 이벤트 패턴으로 고정.
- `AuthAdminPage.jsx`가 4400줄 이상으로 커져 분할이 필요한 시점에 도달.

## 영역 01 · 미션 1 — 뱅기노자 커뮤니티

- 역할: 회원이 질문·후기·정보를 남기고 운영자가 같은 흐름에서 관리하는 핵심 참여 영역.
- 라우트: `community`, `mypage(최근 활동·북마크)`, `admin > 게시글`
- 상태: P5 완료 (기능 ~95%)
- 현재 평가: 좋아요·북마크·신고·등급 배지·페이지네이션·댓글 알림이 도입되어 사회적 신호를 갖췄고, Round-out에서 댓글 답글 트리·해시태그·이미지 슬라이더·MY ACCESS 배너까지 닫혔다. P5 작업에서 본문 검색과 정렬 다양화가 추가되어 검색 커버리지가 완성됐다. 이미지 외부 스토리지·인기글 트렌드만 남음.

### 없는 기능

- 이미지 외부 스토리지 (현재 base64 in-localStorage — quota 위험)
- 인기글 / 주간 트렌드
- 멘션

### 기능

#### 게시글 목록 / 검색 / 정렬 / 카테고리 필터 — 구현됨

- 요소: 검색 입력(제목+본문) / 정렬 드롭다운(최신순·조회순·댓글순·좋아요순) / 카테고리 탭 / 카드·행 리스트 / 페이지네이션(10건/페이지) / MY ACCESS 배너(등급·읽기 가능 게시판 수·쓰기 가능 게시판 수)
- 기술 스펙: `BGNJ_COMMUNITY.listPosts()` → `BGNJ_STORES.communityPosts`. 검색은 `p.title` + `p.body?.text` 동시 검색. 정렬은 views/replies/likes 기준 클라이언트 정렬. 카테고리 정의는 `BGNJ_STORES.categories` 중 `boardType === 'community'`.
- 유의할 점: 정렬 변경 시 페이지가 1로 자동 리셋됨. 검색·탭 변경 시에도 동일.

#### 게시글 작성 / 수정 / 삭제 — 구현됨

- 요소: Tiptap 본문 에디터(StarterKit + Image + Link + Typography) / 카테고리 선택 / 해시태그 입력(`HashtagInput`) / 이미지 첨부(`ImageAttacher` — 최대 10장) / 수정·삭제 버튼
- 기술 스펙: `BGNJ_COMMUNITY.createPost / updatePost / deletePost`. 권한은 작성자 본인 혹은 `user.isAdmin`. Tiptap은 `window.BGNJ_TIPTAP`으로 ESM 주입.
- 유의할 점: 삭제는 즉시 영구 삭제. confirm() 한 번을 반드시 거치도록 유지.

#### 댓글 등록 / 답글 / 삭제 — 구현됨

- 요소: 입력 폼 / `CommentTree`(1단계 들여쓰기 답글) / 삭제 버튼 / 작성자 알림
- 기술 스펙: `BGNJ_COMMUNITY.addComment / deleteComment`. `CommentTree`는 `parentId`로 트리를 구성. 답글 등록 시 원글 작성자에게 자동 알림 발화.
- 유의할 점: 1단계 답글만 지원(답글의 답글 없음). 구조 확장 시 `parentId` 체계 유지.

#### 좋아요 / 북마크 — 구현됨

- 요소: 게시글 상세의 공감(♥) 버튼 / 북마크(★) 버튼 / 목록에서 북마크 표시
- 기술 스펙: `BGNJ_COMMUNITY.toggleLike / toggleBookmark / isBookmarked / listBookmarkedPosts`. 마이페이지에서 북마크 목록 조회.

#### 신고 — 구현됨

- 요소: 신고 버튼 → 인라인 폼(사유 입력) → 접수 완료 / 관리자 `신고` 탭에서 목록·처리
- 기술 스펙: `BGNJ_COMMUNITY.addReport`. 신고 목록은 `BGNJ_STORES.reports`.

#### 이미지 첨부 / 슬라이더 — 부분 구현

- 요소: `ImageAttacher`(드롭존·순서 변경) / `ImageSlider`(상세 하단 슬라이드쇼, autoplay, 점 내비)
- 기술 스펙: 이미지를 base64로 인코딩해 본문에 포함. localStorage에 같이 저장됨.
- 유의할 점: 1~2MB 이미지 몇 장만 올려도 localStorage quota(5~10MB)에 빠르게 도달. 외부 스토리지 도입 전까지 첨부 이미지 크기/개수 안내 필요.

#### 조회수 저장 — 구현됨 (세션 기반 중복 방지)

- 요소: 조회수 카드
- 기술 스펙: 상세 진입 시 `sessionStorage`로 중복 체크 후 `BGNJ_COMMUNITY.incrementViews`. 새 탭·다른 기기에서는 중복 카운트 가능.

#### 카테고리 접근 제한 — 구현됨

- 요소: 카테고리 정의(`boardType`, `minLevel`, `postMinLevel`) / 게이트 컴포넌트
- 기술 스펙: `BGNJ_STORES.categories` 메타에 권한 플래그. `BGNJ_USER_LEVEL(user)`로 레벨 계산 후 클라이언트 단 검사.

#### 관리자 게시글 운영 — 구현됨

- 요소: 검색 / 카테고리 필터 / CSV 다운로드 / 행 단위 열기·삭제 / 신고 탭
- 기술 스펙: `BGNJ_COMMUNITY.exportCsv() / deletePost()`. 사용자 화면과 동일 저장소.

### 영역 차원 · 기술 스펙

`BGNJ_COMMUNITY` helper + `BGNJ_STORES.communityPosts / comments / categories / bookmarks / reports / notifications` localStorage. helper 유지 + 저장소 교체 구조.

### 영역 차원 · 유의할 점

- localStorage 한계 → 이미지·대량 데이터 누적 시 quota 초과
- 권한 검사가 클라이언트 단 → 외부 DB 도입 시 서버 측 정책 필수
- 사용자 화면 ↔ 관리자 화면이 같은 저장소를 보는 가정을 깨지 않게 유지

### 영역 차원 · 개발 이슈

- 사용자 작성 글 / 시드 글이 다른 키에 저장되어 있던 P1 → `ensureCommunityPostsSeeded`로 마이그레이션
- 관리자와 사용자 화면이 다른 mock 배열을 보던 P1 → `BGNJ_COMMUNITY` 단일 helper로 수렴

## 영역 02 · 미션 2 — 뱅기노자 강연 일정 안내

- 역할: 공개 / 심화 / 현장 강연 일정을 알리고 신청을 받는다.
- 라우트: `home(노출)`, `lectures(목록·신청·후기)`, `mypage(내 신청 내역)`, `admin > 강연`
- 상태: Round-out 마무리 (기능 ~80%)
- 현재 평가: Cycle 3에서 신청 → 무통장 입금 → 운영자 확인 → 참가 확정 → 대기열 → 취소까지 한 사이클이 닫혔고, Round-out에서 참여 후기·신규 강연 추가·삭제까지 갖췄다. '알리는' 단계를 넘어 '참여하는' 단계에 진입했다. PG 결제와 D-1 알림이 다음 우선 과제다.

### 없는 기능

- PG 결제 (현재 무통장 임시 방편)
- 환불 신청 흐름 구현됨 — 참가 확정(유료) → 환불 신청 → 관리자 승인/반려. 승인 시 대기열 자동 승격.
- D-1 알림 · 변경 알림 (이메일 / 푸시)
- 참가자 명단 · 체크인 · 출석 이력
- 강연 후 자료 보관함 (영상 · PDF · 발표자료)
- 강연자 프로필 페이지 / 시리즈 묶음

### 기능

#### 홈 강연 일정 노출 — 구현됨

- 요소: 프로그램 라벨(왕사남) / 주제 / 강연자 / 장소 / 다음 일정 / 잔여석 텍스트
- 기술 스펙: `HomePage`에서 `BANGINOJA_DATA.lectures` map. 클릭 시 `lectures` 라우트 이동.
- 유의할 점: 홈의 잔여석은 정적 문자열. 실데이터는 `LecturesPage` 사이드바에서만 계산됨.

#### 강연 목록 · 상세 (`LecturesPage`) — 구현됨

- 요소: 탭(강연별) / 이미지 placeholder / 배지(무료/무통장) / 강연 진행 타임라인 / 스티키 사이드바(`LectureBookingPanel`) / 참여 후기 섹션(`LectureReviewsSection`)
- 기술 스펙: `BGNJ_LECTURES.listAll()`. 투어 페이지와 동일한 탭 + 스티키 사이드바 레이아웃.

#### 강연 신청 (`LectureBookingPanel`) — 구현됨

- 요소: 잔여석·정원 실시간 표시 / 신청 폼(이름·이메일·연락처·인원·메모) / 무통장 입금 안내 카드 / .ics 캘린더 다운로드 / 신청 취소 버튼
- 기술 스펙: `BGNJ_LECTURES.register / cancelRegistration / getSeats / downloadIcs`. 정원 초과 시 자동 대기자 등록. 무료 강연은 신청 즉시 confirmed.
- 유의할 점: 이름·이메일 필수. 유료 강연은 계좌번호가 없으면 신청 차단.

#### 참여 후기 (`LectureReviewsSection`) — 구현됨

- 요소: 별점(1–5) + 후기 텍스트 / 평균 평점 표시 / 본인·관리자 삭제
- 기술 스펙: `BGNJ_LECTURES.canReview / addReview / listReviews / deleteReview`. `BGNJ_STORES.lectureReviews`. 참가 확정 회원(`confirmed` 상태)만 작성 가능.

#### 마이페이지 신청 내역 — 구현됨

- 요소: 신청 상태(입금 대기·참가 확정·대기자·취소됨) / 강연 이동 버튼
- 기술 스펙: `BGNJ_LECTURES.listMyRegistrations(userId)`. 클릭 시 sessionStorage → `lectures` 라우트 + 해당 탭 자동 이동.

#### 관리자 강연 탭 — 구현됨

- 요소: 강연 목록 / 신청자 목록·입금 확인·취소 / 대기열 자동 승격 / 강연 추가 폼 / 강연 삭제 버튼
- 기술 스펙: `BGNJ_LECTURES.listAll / listRegistrations / confirmPayment / cancelRegistration / addLecture / removeLecture`. 입금 확인 시 `BGNJ_AUDIT.log` 자동 기록.

### 영역 차원 · 기술 스펙

`BGNJ_LECTURES` helper + `BGNJ_STORES.lectureOverrides / lectureRegistrations / lectureReviews / bankAccount`. `lectures` 라우트 + `#lecture-{id}` 해시 + sessionStorage 연동.

### 영역 차원 · 유의할 점

- 계좌번호가 설정되지 않으면 유료 강연 신청이 차단됨 → 운영자가 먼저 계좌 설정 필요
- 무통장 입금은 임시 방편. PG 도입 시 `BGNJ_LECTURES.register` 흐름을 게이트웨이로 교체

### 영역 차원 · 개발 이슈

- `BANGINOJA_DATA.lectures`(정적) + `BGNJ_STORES.lectureOverrides`(동적) 병합 구조 — 신규 추가 강연은 overrides에 저장

## 영역 03 · 미션 3 — 뱅기노자 칼럼 공유

- 역할: 뱅기노자의 글을 공개해 브랜드 신뢰와 깊이를 만드는 콘텐츠 영역.
- 라우트: `column(공개)`, `home(추천)`, `admin > 칼럼 / 칼럼 작성(운영)`
- 상태: Round-out 마무리 (기능 ~85%)
- 현재 평가: Cycle 2에서 임시 저장·예약 발행·발행 취소·좋아요·공유 링크·댓글·검색·카테고리 아카이브·읽기 시간 자동 계산이 도입됐고, Round-out에서 댓글 답글 트리까지 들어왔다. `draft / scheduled`가 공개 화면에 새지 않는 발행 흐름도 안정됐다. RSS·구독·작성자 프로필이 남음.

### 없는 기능

- RSS / Atom 피드
- 이메일 · 웹 푸시 구독, 신규 칼럼 알림
- 작성자 프로필 카드 · 관련 글 자동 추천
- 열람 통계 / 좋아요 통계 운영 화면

### 기능

#### 공개 칼럼 목록 — 구현됨

- 요소: 피처 칼럼 1건 + 보조 칼럼 4건(홈) / 전체 카드 그리드(칼럼 페이지) / 카테고리 필터 / 검색 입력
- 기술 스펙: `BGNJ_COLUMNS.listPublic()` — `_autoPromote()` 통과 후 `published` 상태만 반환. 시드(`BANGINOJA_DATA.columns`) + 관리자 발행 칼럼 병합.
- 유의할 점: `draft / scheduled` 칼럼은 공개 화면에 절대 노출되지 않음.

#### 칼럼 상세 — 구현됨

- 요소: 제목 / 카테고리 / 날짜 / 추정 읽기 시간(자동) / 본문 HTML / 좋아요 버튼 / 공유 링크 / 댓글 섹션(`CommentTree`)
- 기술 스펙: `BGNJ_COLUMNS.getColumn / getLikes / hasLiked / toggleLike / getViews / incrementViews / listComments / addComment / deleteComment / estimateReadTime`. 좋아요·조회수는 `BGNJ_STORES.columnEngagement`. 댓글은 `col-{id}` 키로 `BGNJ_COMMUNITY.comments` 재사용.
- 유의할 점: 본문 HTML은 관리자 입력에만 `dangerouslySetInnerHTML` 허용. 사용자 입력에 절대 적용하지 않을 것.

#### 관리자 칼럼 작성 / 편집 — 구현됨

- 요소: Tiptap StarterKit + Image + Link + Typography / 카테고리 입력 / 발행 상태 선택(draft / scheduled / published) / 예약 발행 일시 입력 / 발행 취소 / 임시 저장
- 기술 스펙: `BGNJ_COLUMNS.saveColumn(payload)`. `publishAt`이 지난 scheduled는 `_autoPromote()`가 자동 승격. `BGNJ_STORES.userColumns`.
- 유의할 점: Tiptap 확장 변경이 기존 본문 호환성에 영향을 줌 → 확장 추가/제거 시 기존 본문 렌더 테스트 필요.

#### 홈 추천 칼럼 — 구현됨

- 요소: 피처 카드 1 / 사이드 4건
- 기술 스펙: `BGNJ_COLUMNS.listPublic()`의 상위 항목 사용. `draft / scheduled` 자동 제외.

### 영역 차원 · 기술 스펙

`BGNJ_COLUMNS` helper + `BGNJ_STORES.userColumns`(콘텐츠) + `BGNJ_STORES.columnEngagement`(좋아요·조회수) + `BGNJ_STORES.comments['col-{id}']`(댓글). 시드는 `BANGINOJA_DATA.columns`에서 병합.

### 영역 차원 · 유의할 점

- 공개 칼럼은 `BGNJ_COLUMNS.listPublic()`을 통해야만 나옴 — 직접 `BGNJ_STORES.userColumns`를 참조하면 draft/scheduled가 노출될 수 있음

### 영역 차원 · 개발 이슈

- 시드 칼럼(`BANGINOJA_DATA.columns`)과 관리자 칼럼(`userColumns`) ID 충돌 가능성 → 충돌 검사 유지

## 영역 04 · 미션 4 — 뱅기노자 투어 프로그램 판매·운영

- 역할: 뱅기노자가 진행하는 궁궐 답사·역사 답사 프로그램을 판매하고 운영.
- 라우트: `tour(목록·상세·신청·후기)`, `home(노출)`, `mypage(내 예약 내역)`, `admin > 투어`
- 상태: Round-out 마무리 (기능 ~80%)
- 현재 평가: Cycle 5에서 신청 → 무통장 입금 → 운영자 확인 → 참가 확정 → 대기열 → 취소까지 강연과 같은 패턴으로 닫혔고, Round-out에서 참여 후기·신규 투어 추가·삭제까지 갖췄다. PG 결제와 환불 처리가 다음 과제다.

### 없는 기능

- PG 결제 (현재 무통장 임시 방편)
- 참가자 명단 · 체크인
- 환불 · 취소 정책 처리 (취소 등록은 있음, 실제 환불 흐름 없음)
- 이미지 갤러리 (현재 placeholder)
- 지도 · 집결지 안내 · 우천 시 운영 정책
- 외국어 안내(영문) 옵션

### 기능

#### 투어 목록 · 상세 (`TourPage`) — 구현됨

- 요소: 탭(투어별) / 난이도 배지 / 기간·인원·가격 / 다음 일정 / 프로그램 설명 / 스티키 사이드바(예약) / 참여 후기 섹션(`TourReviewsSection`)
- 기술 스펙: `BGNJ_TOURS.listAll()`. 탭 + 스티키 사이드바 레이아웃이 강연 페이지와 동일.

#### 투어 예약 (사이드바) — 구현됨

- 요소: 잔여석·정원 실시간 표시 / 예약 폼(이름·이메일·연락처·인원·메모) / 무통장 입금 안내 카드 / .ics 캘린더 다운로드 / 예약 취소 버튼
- 기술 스펙: `BGNJ_TOURS.reserve / cancelReservation / getSeats / downloadIcs`. 강연 신청과 동일 계좌(`bankAccount`) 공유.

#### 참여 후기 (`TourReviewsSection`) — 구현됨

- 요소: 별점(1–5) + 후기 텍스트 / 평균 평점 표시 / 본인·관리자 삭제
- 기술 스펙: `BGNJ_TOURS.canReview / addReview / listReviews / deleteReview`. `BGNJ_STORES.tourReviews`. 참가 확정 회원만 작성 가능.

#### 마이페이지 예약 내역 — 구현됨

- 요소: 예약 상태 / 투어 이동 버튼
- 기술 스펙: `BGNJ_TOURS.listMyReservations(userId)`. sessionStorage로 투어 상세와 연결.

#### 관리자 투어 탭 — 구현됨

- 요소: 투어 목록 / 예약자 목록·입금 확인·취소 / 대기열 자동 승격 / 투어 추가 폼 / 투어 삭제 버튼
- 기술 스펙: `BGNJ_TOURS.listAll / listReservations / confirmPayment / cancelReservation / addTour / removeTour`.

### 영역 차원 · 기술 스펙

`BGNJ_TOURS` helper + `BGNJ_STORES.tourOverrides / tourReservations / tourReviews`. `tour` 라우트 + `#tour-{id}` 해시 + sessionStorage 연동.

### 영역 차원 · 유의할 점

- 투어와 강연이 같은 `bankAccount`를 공유 → 계좌 변경은 한 곳에서만 하면 양쪽에 반영됨
- 환불 신청 흐름 구현됨 — `requestRefund/approveRefund/rejectRefund`. 참가 확정(유료) 회원이 환불 신청 → 운영자 승인(취소)/반려(확정 유지) 사이클. 대기열 자동 승격 포함.

### 영역 차원 · 개발 이슈

- `BANGINOJA_DATA.tours`(정적) + `BGNJ_STORES.tourOverrides`(동적) 병합 구조

## 영역 05 · 미션 5 — 뱅기노자 책 판매

- 역할: 뱅기노자의 책 『왕의길』을 소개하고 판매.
- 라우트: `book(상세)`, `checkout(주문)`, `home(CTA)`, `mypage(주문 내역)`, `admin > 왕의길(운영)`
- 상태: P5 완료 (기능 ~90%)
- 현재 평가: Cycle 4에서 주문 → 무통장 입금 → 입금 확인 → 발송 → 배송 완료까지 한 사이클이 닫혔고, Cycle 5에서 장바구니 localStorage 영속화, Round-out에서 영수증 텍스트 다운로드가 추가됐다. P5 작업에서 독자 리뷰(배송 완료 회원 전용)와 환불 신청 흐름(사용자 신청 → 관리자 승인/반려)이 추가됐다. PG 결제·재고만 남은 과제다.

### 없는 기능

- PG 결제 (현재 무통장 임시 방편)
- 재고 관리 · 품절 표시
- 교차 판매 (투어 / 강연 패키지)
- 쿠폰 · 회원 등급 할인

### 기능

#### 책 상세 (`BookPage`) — 구현됨

- 요소: 표지 / 저자 / 출판사 / ISBN / 페이지 수 / 국문·영문 가격 / 챕터 목차 / 설명 본문 / 판본 토글 / 수량 ± / 합계 / 바로 구매 버튼
- 기술 스펙: `BANGINOJA_DATA.book` 정적 객체를 `BookPage`가 렌더. 바로 구매 → `cart` 상태 저장 → `checkout` 라우트.

#### 장바구니 — 구현됨 (localStorage 영속화)

- 요소: 선택 항목(판본·수량·합계) / 세션 유지
- 기술 스펙: App 컴포넌트의 `cart` 상태 + localStorage 영속화. 새로고침·다른 페이지 이동 후 복귀해도 유지됨.

#### 체크아웃 (`CheckoutPage`) — 구현됨

- 요소: 비로그인 차단 / 주문 요약 / 배송지 폼(수령인·연락처·주소·메모) / 무통장 입금 안내 카드 / 주문 완료 화면(주문번호 표시)
- 기술 스펙: `BGNJ_BOOK_ORDERS.create(payload)`. 강연·투어와 같은 `bankAccount` 공유.

#### 주문 상태 추적 — 구현됨

- 요소: `pending_payment → paid → shipped → delivered / cancelled` 상태 전환
- 기술 스펙: `BGNJ_BOOK_ORDERS.confirmPayment / ship / deliver / cancel`. 각 전환 시 `BGNJ_AUDIT.log` 자동 기록. 통합 알림 인프라로 상태 변경 시 회원 알림 발화.

#### 영수증 — 구현됨

- 요소: 텍스트 영수증 다운로드 (마이페이지·관리자 모두 가능)
- 기술 스펙: `BGNJ_BOOK_ORDERS.generateReceipt / downloadReceipt`. 텍스트 파일 형태로 다운로드.

#### 독자 리뷰 — 구현됨

- 요소: 별점(1~5) + 리뷰 텍스트 작성 폼 / 리뷰 목록 / 작성자·관리자 삭제 버튼
- 기술 스펙: `BGNJ_BOOK_ORDERS.addReview / listReviews / canReview / hasReviewed / deleteReview`. `BGNJ_STORES.bookReviews` 저장. 배송 완료(`delivered`) 주문이 있는 회원만 작성 가능. 1인 1리뷰 제한.
- 유의할 점: 배송 완료 전에는 리뷰 작성 불가. 삭제는 본인 또는 관리자만 가능.

#### 마이페이지 주문 내역 — 구현됨

- 요소: 주문 상태 / 영수증 다운로드 / 입금 대기 단계 직접 취소 / 입금 확인·배송중 단계 환불 신청(사유 입력 폼) / 환불 신청 중 상태 표시
- 기술 스펙: `BGNJ_BOOK_ORDERS.listMine(userId)`. `cancelOrder`(입금 대기만), `requestRefund`(paid·shipped만). `orderTick` state로 액션 후 즉시 목록 갱신.

#### 관리자 주문 탭 — 구현됨

- 요소: 주문 목록(상태별 필터) / 입금 확인·발송·배송 완료·취소 처리 / 환불 신청 탭(사유 표시·승인·반려 메모) / 영수증 발급 / CSV 다운로드
- 기술 스펙: `BGNJ_BOOK_ORDERS.listAll / confirmPayment / ship / deliver / cancel / requestRefund / approveRefund / rejectRefund / downloadReceipt / exportCsv`. 환불 승인 시 `cancelled`로 전환, 반려 시 이전 상태(`_prevStatus`)로 복원.
- 유의할 점: 환불 승인/반려 모두 회원 알림 자동 발화. 대시보드 KPI에 환불 신청 건수 반영.

### 영역 차원 · 기술 스펙

`BGNJ_BOOK_ORDERS` helper + `BGNJ_STORES.bookOrders` + `BGNJ_STORES.bookReviews`. `cart` 상태 localStorage 영속화. 강연·투어와 `bankAccount` 공유. 주문 상태: `pending_payment → paid → shipped → delivered / refund_requested → cancelled`.

### 영역 차원 · 유의할 점

- 국문/영문 가격이 분리되어 결제 게이트웨이가 통화별로 별도 계약될 수 있음
- 결제 도입 시 PCI/PII 책임이 발생 → 직접 카드정보를 받지 않는 게이트웨이 위임 구조로 설계
- 환불 처리는 관리자 수동 승인 구조. PG 연동 후에는 자동 환불 API 호출로 교체 예정.

### 영역 차원 · 개발 이슈

- 결제·재고 점진 도입 권장 순서: PG 위임 → 재고 관리 → 자동 환불 API

# 탭 2 · 디자인

이 섹션은 관리자 페이지 KMS의 `디자인` 탭과 같은 내용을 다룬다.
새 화면을 만들거나 기존 화면을 바꿀 때, 아래 원칙을 먼저 확인하고 그 위에서 작업한다.

## 1. 브랜드 무드 (현행 — 뱅기노자, 2026.04.27 갱신)

- "뱅기 타고 한국을 느끼다" — 한국의 역사·문화·자연을 함께 여행하는 커뮤니티가 코어 컨셉.
- 톤은 절제·신뢰·여행자의 시선. 과한 동양풍 장식 대신, 깔끔한 편집 디자인을 우선한다.
- 화면은 화려함보다 가독성과 신뢰감을 우선한다. 운영자 화면은 작업 효율, 사용자 화면은 감성 전달과 안심감을 동시에 준다.

## 2. 컬러 원칙 (블루 팔레트 v2)

- 기본 배경: 밝은 화이트/오프화이트(`--bg`, `--bg-2`) 위주. 본문 가독성 최우선.
- 강조색은 **블루 팔레트**로 통일.
  - `--gold` = `#3B82F6` (Mid Sky · 액션 블루) — 주요 CTA, 활성 상태, 강조 라인.
  - `--gold-2` = `#2563EB` (Primary Blue · hover, 가격, 핵심 숫자).
  - `--gold-dim` = `#93C5FD` (Low Sky · 장식 보더, 보조 강조).
  - `--gold-ink` = `#1E3A8A` (Deep Blue · 본문 강조 텍스트, 인용 좌측 라인).
- 회원등급 색상도 같은 블루 그라디언트(`#64748B → #94A3B8 → #93C5FD → #3B82F6 → #2563EB → #1E3A8A`)를 따른다.
- 위험/삭제는 `var(--danger)`로 명확히 구분. 절대 블루로 표시하지 않는다.
- (변수명은 과거 `gold-*`를 그대로 두지만, 값은 모두 블루로 재정의됨. 외부 PR에서 노란색 hex 값을 다시 도입하지 않는다.)

## 3. 타이포그래피 원칙

- 제목은 세리프(`--font-serif` / `--font-display`)로 품격 유지.
- 본문은 한글 가독 폰트 (Noto Sans/Serif KR).
- 운영 라벨·메타·코드 ID는 모노(`--font-mono`)로 구조감을 강조.
- 한 화면 안에서도 제목, 본문, 메타의 역할이 시각적으로 분명해야 한다.

## 4. 레이아웃 원칙

- 여백은 넉넉하게. 카드/섹션은 편집 디자인 격자감으로 정렬한다.
- 모바일에서도 구조가 무너지지 않도록 한 줄 정보량을 통제한다.
- 관리자 콘솔은 좌측 사이드바(7개 대카테고리: 요약 / 콘텐츠 / 회원관리 / 쇼핑 / 운영설정 / 개인정보 관리 / 시스템 관리) + 우측 작업 영역의 1:N 레이아웃을 표준으로 한다.

## 5. 컴포넌트 원칙

- 주요 행동: `btn btn-gold` (블루 강조).
- 일반 행동: `btn` 또는 `btn btn-small`.
- 위험 행동: `borderColor: var(--danger), color: var(--danger)`.
- 칩(필터 탭): pill 형태(`borderRadius:999`), 활성 시 배경 블루, 항목별 카운트 동행 표시(예: `자유 12`).
- 배지·라벨은 짧고 명확하게(예: `숨김`, `대기`, `확정`, `초안`).
- 아이콘은 라인아트 SVG를 기본으로 한다(예: 알림 종모양은 stroke-only outline). 이모지 아이콘은 보조용.

## 6. 인터랙션 원칙

- 애니메이션은 과하지 않게.
- hover/focus/active는 명확하되 시끄럽지 않게.
- 관리자 화면은 정보 탐색성·작업 효율 우선. 사용자 화면은 감성 전달·신뢰감 우선.
- 첫 방문 시 쿠키 동의 배너가 우선 표시되며, 결정 전까지 화면 하단에 비차단형(non-modal)으로 떠 있는다.

## 7. 접근성 원칙

- 모든 인터랙티브 요소는 키보드 포커스 가능 + `aria-label` 또는 텍스트 라벨 보유.
- 탭/필터 칩은 `role="tab"` + `aria-selected`로 상태 노출.
- 다이얼로그/모달은 `role="dialog"` + `aria-modal` + `aria-labelledby`.
- 색상만으로 상태를 구분하지 않는다(아이콘·텍스트 라벨 동행).
- 콘트라스트는 WCAG AA(텍스트 4.5:1) 이상을 기본 기준으로 한다.

## 8. 디자인 금지 원칙

- 노란/금색 hex(예: `#D4AF37`, `#E8C547`)는 더 이상 도입하지 않는다 — 모두 블루 팔레트로 변환된 상태.
- 보라색 계열을 브랜드 주색처럼 쓰지 않는다.
- 과한 그라데이션·유행성 마이크로 인터랙션을 남발하지 않는다.
- 일월오봉도/조선 왕실 도상 직접 차용 표현은 더 이상 사용하지 않는다(브랜드 분리 완료).

# 부록 · 운영 기준

KMS 화면의 두 탭 외에, 다음 운영 기준은 이 문서 본문과 관리자 `버전 기록` 탭에서 함께 관리한다.

## 현재 우선순위 기준

기준 문서: `project-priority-table.md`

1. 인증/권한
2. 데이터 저장 구조
3. 관리자 발행물과 공개 페이지 연결
4. 커뮤니티 실서비스화
5. 관리자 운영 기능 고도화
6. 투어 예약
7. 책 주문/결제
8. 부가 기능

## P1 진행 상태

완료.

### 완료된 P1

1. 인증/권한 — `BGNJ_AUTH` 기준으로 로그인, 회원가입, 로그아웃, 세션 유지가 한 구조에서 동작
2. 관리자 발행물과 공개 페이지 연결 — 관리자 발행 칼럼이 공개 칼럼 페이지와 홈 화면에 반영
3. 데이터 저장 구조 — `BGNJ_DB`, `BGNJ_STORES`, `BGNJ_SAVE` 기준으로 회원, 세션, 게시글, 댓글, 칼럼, 권한 엔티티 구조 분리

## P2 진행 상태

완료.

### 완료된 P2

1. 커뮤니티 실서비스화 — `communityPosts` 단일 저장소, 게시글 작성/수정/삭제, 댓글 등록/삭제/답글, 조회수, 좋아요, 북마크, 신고, 알림, 배지, 페이지네이션
2. 관리자 운영 기능 고도화 — 회원 관리(`MemberAdminPanel`), 감사 로그(`AuditLogPanel`), 자동 등급 승격, 강연/투어/주문 운영, 법령/FAQ 편집

## P3 이후 남은 과제

의사결정 완료 사항 (2026-04-27):
- **외부 DB + 서버 인증** → **Cloudflare** (Workers + D1 + R2) 로 확정
- **PG 결제** → 스켈레톤 UI 먼저, 실결제는 비활성화 상태로 대기
- **이메일 알림** → 비활성화 상태로 인프라 준비 후 제공사 결정 시 활성화

우선순위 순:

1. **Cloudflare 마이그레이션** — Workers + D1 + R2 통합 설계. 인증·DB·이미지 스토리지를 한 에코시스템으로 이동.
2. **PG 결제 스켈레톤** — 강연·투어·책 3곳에 결제 UI 추가, 실결제 disabled 상태로 배포
3. **이메일 알림 인프라** — hook 먼저 추가, 발송은 비활성화. Cloudflare Email Workers 사용 예정
4. **마이페이지 프로필 수정 / 비밀번호 변경** — Cloudflare 인증 전환 후 착수

✅ 완료 (P5 + 추가):
- 환불 처리 흐름 (책) — 사용자 환불 신청 + 관리자 승인/반려 사이클 구현
- 환불 처리 흐름 (강연/투어) — 동일한 requestRefund/approveRefund/rejectRefund 패턴 적용 완료 (v00.021.000)
- 본문 검색·정렬 다양화 — 커뮤니티 제목+본문 검색, 4가지 정렬 옵션
- 독자 리뷰 연동 (책) — 배송 완료 회원 전용 실 리뷰 시스템 구현

## AI 작업 기본 원칙

1. 모든 AI는 작업 시작 전에 `ai-development-rules.md`를 먼저 읽는다.
2. 모든 AI는 `project-priority-table.md`를 확인하고 우선순위 안에서 작업한다.
3. 모든 수정사항은 가능하면 푸시와 배포까지 진행하여 실제 검토 가능 상태로 만든다.
4. 설명이 필요하면 비개발자도 이해할 수 있는 표현을 사용한다.
5. 계획이 필요한 작업은 문서로 만들고, 완료 후 삭제한다.

## 버전 관리 원칙

버전 형식은 `AA.BBB.CCC`를 사용한다.

1. `AA` — 대버전(사용자가 직접 판단해서 올린다)
2. `BBB` — 기능 추가 또는 삭제 시 올린다
3. `CCC` — 작은 수정, 버그 수정, 문구 수정, 마이너 개선 시 올린다

## 문서 동기화 규칙

아래 항목이 바뀌면 `kms.md`도 함께 갱신한다.

1. 개발 규칙
2. 우선순위
3. 버전 체계
4. 구현 현황
5. 디자인 테마
6. 관리자 페이지 운영 방식

## KMS 기록 방식

KMS를 수정할 때는 가능하면 아래 구조를 따른다.

1. 무엇이 바뀌었는가
2. 왜 바꾸게 되었는가
3. 어떤 배경과 맥락이 있었는가
4. 이후 어떤 작업과 연결되는가

# 현재 위험 인벤토리 (v00.035.000 기준 · 2026-04-29 종합 점검)

본 섹션은 **즉시 발생 가능한 오류** 와 **잠재적 문제** 를 한 곳에 모아 운영자/AI 가 진입 시 가장 먼저 확인하도록 정리한다. 각 항목 해소 시 본 섹션에서 제거하고 변경 기록에 이관한다.

## 🔴 P0 — 실사용자 차단

(v00.036.000 에서 모두 해소. 변경 기록 참조.)

~~| P0-1 | 결제 폼 BankAccountPicker 미wiring → ✅ 해소 |~~
~~| P0-2 | 관리자 PostViewerModal 미wiring → ✅ 해소 |~~
~~| P0-3 | async 헬퍼 sync 호출 → ✅ await/try-catch 일괄 적용 |~~

## 🟡 P1 — 기능 제한 / UX 저하

| 코드 | 문제 | 위치 | 권장 조치 |
|---|---|---|---|
| P1-1 | SEO 패널의 hero/brand 저장이 HomePage 즉시 반영 안 됨 (새로고침 전엔 옛값) | `HomePage.jsx:30` | useEffect + `bgnj-site-content-refresh` 리스너 |
| P1-2 | MyPage 가 `bgnj-orders-refresh` 등 글로벌 이벤트 listen 안 함 | `MyPage.jsx` | addEventListener 패턴 추가 |
| P1-3 | GlobalErrorToast 가 errorLog.report 실패 시 무한 루프 가능 | `index.html` GlobalErrorToast | report 호출 try/catch + reentry guard |
| P1-4 | BGNJ_STORES.users / .grades 가 빈 상태에서 등급 배지 등이 비어 보일 수 있음 | `MyPage.jsx:10` 외 | refreshUsers/grades 진입 시 호출 |
| P1-5 | 응답 매퍼(_toLecture/_toTour/_toOrder) 가 컬럼명 변경에 취약 | `data.js` | 별도 transformer 모듈로 추출 + 단위 테스트 |

## 🟢 P2 — 한계 / 개선 후보

| 코드 | 문제 | 위치 | 권장 조치 |
|---|---|---|---|
| P2-1 | 슈퍼관리자 외 시드 데이터가 D1 에 없음 (강연/투어/책 빈 상태) | D1 | 관리자 패널에서 batch insert 가능한 seed 도구 |
| P2-2 | 관리자 회원 활동 카운트가 모두 0 (서버 활동 집계 endpoint 부재) | `BGNJ_AUTH.getActivity` | 서버 측 GET /api/admin/users/:id/activity 추가 |
| P2-3 | 칼럼 좋아요/조회수가 D1 미지원 (현재 no-op) | `BGNJ_COLUMNS.toggleLike/incrementViews` | user_columns 에 likes_json/views 컬럼 endpoint |
| P2-4 | 결제 PG (실시간) 미도입, 무통장 입금만 지원 | 전체 | 비즈니스 결정 필요 (Toss/카카오페이/네이버페이) |
| P2-5 | 게시글/칼럼 댓글의 답글 트리 4단계+ 미지원 (UI 3단계 캡) | `CommunityPage.jsx` | UI 깊이 제한 정책 / 펼침 |

# 변경 기록

- 2026-04-25: KMS 문서 최초 생성
- 2026-04-25: AI 선독 원칙, 비개발자 설명 원칙, 계획 문서 원칙, 버전 체계, 관리자 버전 기록 원칙 반영
- 2026-04-25: KMS 수정 시 변경 계기와 배경을 함께 기록하는 원칙 추가
- 2026-04-25: 관리자 페이지 KMS 및 버전 기록 UI 반영 현황 업데이트
- 2026-04-25: 푸터 버전 표시 강화 및 관리자 발행 칼럼 공개 연결 현황 업데이트
- 2026-04-25: 사이트 전체 기능 인벤토리 섹션 추가
- 2026-04-25: P1 부분 완료 상태와 남은 항목 구분 기록 추가
- 2026-04-25: P1 local-first 인증/데이터 저장 구조 완료 및 P2 진입 가능 상태 반영
- 2026-04-25: P2 커뮤니티 저장소 통합 및 관리자 게시글 운영 기능 1차 반영
- 2026-04-25: KMS 기능정의서 우선 구조 및 디자인 원칙서 추가
- 2026-04-25: 대시보드 실데이터 연결, 왕사남 소개 제거, KMS 내부 기능정의서/디자인 탭 구조 반영
- 2026-04-25: KMS 화면을 `기능정의서` + `디자인` 두 탭 구조로 정리하고 진입 기본 탭을 `기능정의서`로 고정. 운영 원칙은 부록과 버전 기록으로 이동.
- 2026-04-25: 기능정의서를 사이트의 5가지 미션(커뮤니티 / 강연 / 칼럼 / 투어 / 책) + 공통 기반(BASE) 영역 단위로 재정렬. 각 영역마다 평가, 없는 기능 정리, 기능별 요소·기술 스펙·유의할 점·개발 이슈, 영역 차원 기술 스펙·유의할 점·개발 이슈를 표준 9블록 구조로 작성.
- 2026-04-25: Cycle 1(뱅기노자 커뮤니티 마무리) 출시. 좋아요·북마크·신고 운영 큐·댓글 알림·작성자 등급 배지·페이지네이션을 한 PR에 묶어 도입.
- 2026-04-25: Cycle 2(뱅기노자 칼럼 운영 강화) 출시. 임시 저장·예약 발행·발행 취소 + 좋아요·공유 링크·댓글·검색·카테고리 아카이브·추정 읽기 시간 자동 계산 도입. `BGNJ_COLUMNS` helper 신설.
- 2026-04-25: Cycle 3(뱅기노자 강연 운영) 출시. 회원 전용 강연 신청, 무통장 입금 결제, 관리자 입금 확인 → 참가 확정, 정원·대기열 자동 처리, .ics 캘린더 다운로드, 마이페이지 내 신청 내역, 관리자 강연 탭과 계좌번호 설정 탭 도입. `BGNJ_LECTURES` helper 신설.
- 2026-04-25: UX 개선 묶음 출시. 관리자 버전 기록 페이지네이션, 맨 위로 버튼, 내비 메가메뉴, 카테고리 인라인 편집, 폰트 토글 전역 확장.
- 2026-04-25: Cycle 4(뱅기노자 책 판매) 출시. 회원 전용 무통장 입금 단일 흐름으로 주문 → 입금 → 발송 → 배송 완료 사이클 도입. `BGNJ_BOOK_ORDERS` helper 신설.
- 2026-04-25: Cycle 5(뱅기노자 투어 판매·운영) + 공통 인프라 강화 출시. `BGNJ_TOURS` helper 신설, 회원 전용 답사 신청 → 무통장 입금 → 참가 확정 사이클, 통합 알림 인프라, 장바구니 localStorage 영속화.
- 2026-04-26: 운영 인프라 묶음 출시. `MemberAdminPanel` 신설, 게시판·등급 권한 매트릭스, `BGNJ_LEGAL / BGNJ_FAQ / LegalAdminPanel / FaqAdminPanel / LegalPage / FaqPage` 신설(푸터 연결), 강연 페이지 탭+스티키 사이드바 재구조, `TourReviewsSection` 도입, 커뮤니티 MY ACCESS 배너.
- 2026-04-26: 기능 정상화 묶음 출시. 댓글 답글 트리(`CommentTree`, 커뮤니티/칼럼), 강연 후기 섹션(`LectureReviewsSection`), 강연/투어 신규 등록 관리자 버튼, 주문 영수증 텍스트 다운로드(`downloadReceipt`), 운영 감사 로그(`BGNJ_AUDIT + AuditLogPanel`), 활동 기반 자동 등급 승격(`BGNJ_GRADE_PROMO`).
- 2026-04-26: KMS 현행화. 기능정의서 본문(없는 기능·현재 평가·기능 섹션 전체)을 Round-out 이후 실제 코드 기준으로 갱신. 각 영역 커버리지 %와 상태 업데이트. P1·P2 완료 처리. P3 이후 남은 과제 정리.
- 2026-04-27: P5 묶음 출시 (v00.020.000). ① 홈페이지 버그 5건 수정(publicColumns 빈 배열 fallback, featuredColumn null 크래시, notices/tours/partners null 가드, excerpt optional chaining, 칼럼 보조 항목 WCAG 적용). ② 커뮤니티 본문+제목 검색 및 4종 정렬(최신·조회·댓글·좋아요). ③ 책 독자 리뷰 시스템(배송 완료 회원 전용, 별점, 1인 1리뷰, 관리자 삭제). ④ 환불·취소 흐름(입금 대기 직접 취소 / 입금 확인·배송중 환불 신청 / 관리자 승인·반려·대시보드 KPI). P5 전체 완료. 다음 과제: P3 외부 DB·서버 인증(의사결정 필요).
- 2026-04-27: KMS 현행화. 5가지 미션 평가 요약 업데이트(커뮤니티 ~95%, 책 ~90%). 커뮤니티·책 판매 영역 기능 섹션 갱신. 마이페이지 취소·환불 UI 반영. P3 이후 남은 과제에서 P5 완료 항목 정리.
- 2026-04-27: 의사결정 반영. Cloudflare(Workers + D1 + R2)로 외부 DB·인증·이미지 스토리지 방향 확정. PG 결제는 스켈레톤 UI 먼저(비활성화), 이메일 알림은 인프라 준비 후 비활성화 상태 배포. gilwell-media 로컬 105커밋 동기화 완료. 강연/투어 환불 신청 흐름 누락 식별(P5 책만 구현됨) — project-priority-table에 ⚠️ 미완으로 기록.
- 2026-04-27: 강연/투어 환불 신청 흐름 구현 완료 (v00.021.000). BGNJ_LECTURES·BGNJ_TOURS에 requestRefund/approveRefund/rejectRefund 추가. LecturesPage·TourPage 사이드바에 참가 확정(유료) 환불 신청 폼(사유 입력) + 상태 표시 적용. 관리자 LectureAdminPanel·TourAdminPanel에 환불 승인/반려 UI 추가. MyPage 강연/투어 상태 레이블에 refund_requested 반영. KMS 및 project-priority-table 전체 완료 처리.
- 2026-04-29: 🚀 P0 일괄 해소 + 디자인 시스템 라이브 도파 (v00.036.000). 무엇이 바뀌었나: ① 결제 폼 3곳(강연/투어/책)에 `BGNJ_BankAccountPicker` 결합. ② 관리자 패널 '열기' 두 곳(community posts/reports) → `PostViewerModal` 모달. ③ async 헬퍼 sync 호출 사이트 4곳(LectureBookingPanel/TourBookingPanel/BookCheckoutPage/MyPage) await + try/catch 일괄 적용. ④ 버전 표시 헤더 'v' 접두사. ⑤ KMS 디자인 탭 전면 재구축 — `DesignSystemView` 컴포넌트 신설, 11 섹션 라이브 도파(컬러 토큰 11종 스와치 / 타이포 5종 렌더 샘플 / 스페이싱·라운드·엘리베이션 시각화 / 버튼 5종 라이브 / 배지 4종 / 폼 라이브 / 카드 3종 / 표 / 모달 / 피드백 3종 / 화면 작업 원칙). 각 섹션은 정의·특징·활용처·라이브 샘플 4-축. 왜: 사용자 요청 'v00.035.000 표시 정상화 + 모든 오류 해결 + 디자인 탭을 실질 샘플 + 용어 정의 + 특징 + 활용처로 완성'. 다음 작업: P1 위험 처리(SEO/MyPage 이벤트 리스너, 토스트 무한루프 가드, 매퍼 표준화).
- 2026-04-29: 🩺 종합 점검 + 문서 동기화 (v00.035.001). 무엇이 바뀌었나: ① 사이트 전반 잠재 오류/리스크 종합 감사를 수행하고 결과를 KMS 부록 '현재 위험 인벤토리' 섹션에 정리. ② project-priority-table.md 를 P0/P1/P2 로 재정리. ③ ai-development-rules.md 에 '오류 로그 우선 확인' 외 신규 운영 원칙(서버 source-of-truth 원칙, 비동기 호출 await 의무, ?v= cache-buster 의무) 추가. ④ KMS 디자인 탭 갱신(현 디자인 시스템 기준 컬러/타이포/컴포넌트). 식별된 P0 위험: ① 결제 폼 3곳에 BGNJ_BankAccountPicker 미wiring, ② 관리자 게시글 모달 PostViewerModal 미wiring, ③ async 헬퍼를 sync 호출하는 페이지 존재 (LecturesPage:183, WangsanamTourPage:239, BookCheckoutPage:417). 다음 사이클: P0 3건 일괄 처리.
- 2026-04-29: 운영 인프라 대규모 보강 (v00.035.000). 무엇이 바뀌었나: ① Worker CORS Allow-Methods 에 PUT 추가 — 무통장 PUT preflight 통과. ② D1.bank_accounts 테이블 + CRUD 엔드포인트 + BankAccountPanel 표 UI(멀티 계좌, 기본 계좌 지정) + BGNJ_BankAccountPicker 결제 셀렉터. ③ 설정 탭 중복 BankAccountPanel 제거 → 안내 인포 박스. ④ ROPA 카드 → 7컬럼 표. ⑤ 회원 관리에 상태 필터(전체/활성/정지/관리자) + 정렬 8종(가입일/이름/이메일/등급/게시글수/댓글수). ⑥ D1.error_log 테이블 + Worker POST /api/error-log(익명 허용) + GET /admin/error-log + DELETE. GlobalErrorToast/AppErrorBoundary 가 모든 오류 자동 서버 보고. 관리자 '오류 로그' 패널에서 검색/필터/삭제. ⑦ 토스트 10초 자동 소거. ⑧ '시스템 관리 > SEO' 탭 신설(OG title/description/이미지 + Hero 3행 제목/부제 + 브랜드명). 저장 즉시 <head> 메타 반영. ⑨ ai-development-rules.md '작업 시작 전 오류 로그 우선 확인' 규칙 추가. ⑩ PostViewerModal 컴포넌트 신설(관리자 '열기' 버튼 → 모달 본문/메타/댓글). Worker 배포 c192f088. 왜: 사용자 6 가지 요청 일괄 처리. 다음: 결제 화면(강연/투어/책)에 BGNJ_BankAccountPicker wiring + PostViewerModal 호출 사이트 정리.
- 2026-04-28: 공감 1-shot + /me/tours 500 수정 + 댓글 가독성 + 약관 패널 서버 동기 (v00.034.001). 무엇이 바뀌었나: ① Worker handleMyTours 가 tours 테이블에 없는 `location` 컬럼 select 하던 버그 제거. ② Worker handleLikeToggle 이 토글 후 likes 배열을 응답에 동봉 → 클라이언트 1회 호출로 끝. ③ BGNJ_COMMUNITY.toggleLike 가 낙관적 메모리 캐시 갱신 + 서버 응답 교정 패턴 적용. _patchLikesInMemory 헬퍼 신설(localStorage 미터치). ④ 댓글 본문 @멘션 폰트 weight 600→500 으로 가벼워져 평문 가독성 회복. ⑤ LegalAdminPanel 이 mount 시 server refresh + save 시 await + 성공/실패 메시지 + 탭 UI 로 정리. 왜: v00.032 트랜잭션 헬퍼 일괄 전환 직후 회귀(스키마 불일치 + UX 지연 + 시드 게시글 캐시 갱신 누락) 일괄 처리. 다음 작업: 페이지 sync→async 정리 잔여, 이용약관 GUI 정리.
- 2026-04-28: 🧹 과거 데이터 정리 + 옛 캐시 영구 무력화 (v00.034.000). 무엇이 바뀌었나: ① data.js 의 `cleanupV33` 마이그레이션이 페이지 로드 시 마이그레이션된 엔티티의 localStorage 키(book_orders, lecture_*, tour_*, user_columns, audit_log, legal_docs, faqs, bank_account, site_content, users, session, bookmarks, reports, notifications, grades, categories, community_posts/user_posts/comments)와 wsd_* 잔재를 자동 삭제. UI 상태(카트/세션캐시/쿠키동의/임시저장/라우트) 는 보존. 'bgnj_cleanup_v33' 마커로 1회만 실행. ② index.html 진입 시 등록되어 있을 수 있는 모든 Service Worker `unregister()` + Cache API `caches.delete()` 일괄 실행. ③ 모든 정적 자산 cache-buster `?v=00.034.000`. ④ D1 의 probe-flow-%@example.com / signuptest+%@example.com 진단용 계정과 관련 세션 일괄 삭제. 정리 후 D1: 사용자 1, 세션 1, 그 외 모두 0. 왜: 사용자 요청 '과거 데이터 정리 + 옛 캐시 삭제'. 다중 안전망(localStorage 정리 + Service Worker 해제 + Cache API 비움 + cache-buster + HTML no-cache)으로 옛 잔재가 새 빌드를 가리는 가능성 영구 차단. 다음 작업: 페이지(LecturesPage/WangsanamTourPage/BookCheckoutPage/MyPage)의 sync→async 호출 정리.
- 2026-04-28: 관리자 페이지 GUI 가독성 + BGNJ_COLUMNS 서버 전환 (v00.033.000). 무엇이 바뀌었나: ① 회원 상세 프로필 JSON 덤프 → ProfileFields 라벨 카드(한글). ② 감사 로그 details JSON → key/value 칩(AuditDetailsCell). ③ 회원 정지 prompt() → SuspendDialog 모달(사유 textarea + ESC/취소/적용). ④ 새 책 추가 prompt() → 좌측 패널 인라인 폼. ⑤ user_columns D1 테이블 신설 + Worker GET/POST/PATCH/DELETE 엔드포인트 + BGNJ_COLUMNS 가 BGNJ_API.columns 호출 + localStorage userColumns 쓰기 제거. ⑥ App init 에 BGNJ_COLUMNS.refresh 추가. ⑦ Worker 배포 (Version 955d2989). 왜: 사용자 요청 '관리자페이지 가시성 확보 + 텍스트로 구현된 기능 제거'. 모든 입력은 폼/모달, 모든 데이터는 라벨/칩으로 노출. 다음 작업: 페이지 sync→async 호출 정리(LecturesPage/WangsanamTourPage/BookCheckoutPage/MyPage 의 useEffect 와 핸들러).
- 2026-04-28: 🌐 트랜잭션 헬퍼 일괄 서버 전환 (v00.032.000). 무엇이 바뀌었나: ① BGNJ_BOOK_ORDERS / LECTURES / TOURS / BOOKS 헬퍼가 모두 D1 source-of-truth 로 전환. createOrder/saveLecture/saveTour/saveBook 등 모든 변경 메소드가 BGNJ_API 호출. ② BGNJ_SAVE.* localStorage 쓰기 호출을 마이그레이션된 엔티티에서 모두 제거. ③ 메모리 캐시 + refresh*/refreshMine 패턴으로 동기 read 호환 유지. ④ App init useEffect 가 Promise.allSettled 로 SITE_CONTENT/FAQ/LEGAL/LECTURES/TOURS/BOOKS/bankAccount 일괄 refresh + 로그인 사용자는 mine/bookmarks/notifications 추가 동기화. ⑤ BGNJ_GRADE_PROMO 가 BGNJ_AUTH._usersCache 참조 + setGrade fire-and-forget. 왜: 사용자 정책 '로컬 업데이트는 존재하지 않는다' 의 완전 이행. 다음 작업: 페이지 컴포넌트(LecturesPage/WangsanamTourPage/BookCheckoutPage/MyPage/관리자 패널)의 sync→async 호출 패턴 정리, BGNJ_COLUMNS 의 D1 테이블 + 서버 전환.
- 2026-04-28: COMMUNITY 좋아요/북마크/신고/알림 서버 전환 (v00.031.000). 무엇이 바뀌었나: ① toggleLike 가 서버 토글 + GET 으로 사용자 목록 재조회. ② toggleBookmark 가 서버 토글 + refreshBookmarks 재조회. 낙관적 로컬 업데이트 제거. ③ addReport 가 POST /api/reports 직호출. ④ addNotification 은 no-op (서버 부수효과로 자동 발급되어야 함). ⑤ _bookmarks/_notifications/_reports 메모리 캐시. ⑥ CommunityPage 호출 사이트 await + try/catch 전환. 왜: 사용자가 '로컬 업데이트는 존재하지 않는다' 고 정책 재확인. 이전 커밋의 낙관적 로컬 패턴 제거. 다음 작업: BGNJ_LECTURES/TOURS/BOOK_ORDERS/BOOKS metadata 의 서버 전환과 페이지 동기→비동기 호출 적용 (각 30+ 메소드, 광범위 작업).
- 2026-04-28: 관리자 회원 운영 서버 전환 + 회원 상세 가시성 (v00.030.000). 무엇이 바뀌었나: ① BGNJ_AUTH 의 setGrade/toggleAdmin/suspendUser/unsuspendUser/removeUser 가 모두 D1 PATCH/DELETE 로 영속. ② _usersCache + refreshUsers() 신설, MemberAdminPanel 이 mount/변경 후 await 로 새로고침. ③ Worker handleAdminUserPatch 가 suspended/suspendedReason/name 처리 + 정지 시 모든 세션 즉시 만료. ④ handleAuthLogin 이 suspended 계정 거부(403). ⑤ users 테이블에 suspended/suspended_reason/suspended_at ALTER 적용. ⑥ ProfileFields 컴포넌트로 회원 상세의 JSON 덤프를 한글 라벨 카드로 교체. ⑦ 활성 동의 배지 한글화. 왜: 사용자 요청 '관리자 페이지 가시성 확보 + 나머지 서버 전환'. 다음 작업: BGNJ_LECTURES/TOURS/BOOK_ORDERS/COMMUNITY/BOOKS metadata 서버 전환과 해당 페이지의 동기→비동기 호출 적용.
- 2026-04-28: 🌐 서버 source-of-truth 1차 마이그레이션 (v00.029.000). 무엇이 바뀌었나: ① 가입 시 프로필(생년월일/전화/주소/관심분야 등) 이 D1.users.profile_json 으로 영속. ② Worker 에 30+ 신규 엔드포인트 추가 — PATCH /api/me, DELETE comment, GET /me/lectures + /me/tours + /me/orders, lecture/tour/book reviews, tour reserve, book-orders CRUD, site-content GET/PATCH, FAQ CRUD, legal GET/PUT, bank-account GET/PUT, categories CRUD, grades upsert, audit create. ③ D1 schema-v3.sql 추가 — legal_docs / faqs / bank_account / site_content_kv / grades_kv / categories_kv 테이블 + book_orders ALTER 로 누락 컬럼 보강. ④ api.js 에 7개 신규 네임스페이스(siteContent/faqs/legal/bankAccount/categories/grades/bookOrders) + 기존 네임스페이스 확장. ⑤ 클라이언트 헬퍼 BGNJ_LEGAL/BGNJ_FAQ/BGNJ_AUDIT/BGNJ_SITE_CONTENT 가 D1 기준으로 전환됨 — 메모리 캐시는 동기 read 호환용. ⑥ App 진입 시 useEffect 에서 site-content/FAQ/legal 자동 refresh. ⑦ Worker 배포 (Version 2b830622). 왜: 사용자 요청 '로컬에서 처리되는건 없어야 한다' 의 1차 이행. 작고 결합도 낮은 헬퍼부터 안전하게 전환. 다음 작업: BGNJ_LECTURES/TOURS/BOOK_ORDERS/COMMUNITY/AUTH(grade-suspend)/BOOKS metadata 의 서버 연결 + 페이지 컴포넌트의 동기→비동기 호출 패턴 전환. 페이지에서 await 호출이 들어가야 하므로 각 페이지 useEffect 도 함께 수정 필요.
- 2026-04-28: 🚨 가입 블로커 수정 + 좀비 세션 차단 + 푸터 정비 (v00.028.000). 무엇이 바뀌었나: ① data.js BGNJ_AUTH 의 중복 정의된 레거시 로컬 signUp 제거 — Cloudflare 호출용 async signUp 위에 같은 이름의 동기 로컬 signUp 이 정의되어 있어 객체 리터럴 덮어쓰기로 모든 회원가입이 localStorage 에만 저장되고 D1 에 도달하지 못하던 치명 버그. ② BGNJ_AUTH.refreshSession 이 /api/auth/me 401 응답을 받으면 localStorage 캐시도 비워 좀비 세션 차단. ③ 푸터에서 '개인정보 처리 · 관리자' 버튼 제거(관리자 진입은 상단 내비). ④ 푸터의 큰 'CURRENT DEPLOY VERSION' 카드 제거 + 하단 줄 버전 표기 작게. ⑤ 푸터 연락 정보(이메일/전화/주소)를 사이트 콘텐츠 `contact` 섹션에서 읽도록 동적화 + 관리자 패널 편집 카드 추가. 왜: 사용자가 가입 후에도 세션이 유지되지 않고 화면상 박지민으로 로그인된 것처럼 보였는데, D1 직접 조회로 해당 행이 없는 것을 확인. 객체 리터럴에서 동일 이름 메소드가 두 번 정의되어 한쪽이 무력화되는 자바스크립트 동작이 원인. 다음 작업: 사용자 요청 — 모든 데이터 처리를 로컬에서 서버로 이전. 현재 로컬 의존(강연/투어/주문/북마크/알림/신고/감사로그/책 카탈로그) 카탈로그 후 단계별 마이그레이션 계획 수립.
- 2026-04-28: HTTP 환경 정상화 (v00.027.004). 무엇이 바뀌었나: ① v00.027.003 의 HTTP→HTTPS 자동 리다이렉트 제거 (사이트가 아직 HTTP 운영). ② Worker `ALLOWED_ORIGINS` 에 `http://bgnj.net`, `http://www.bgnj.net`, `http://scoutkorea-jimmy.github.io` 추가. ③ 세션 쿠키 `SameSite=Lax` → `SameSite=None` 으로 변경 — 사이트와 API 가 서로 다른 도메인이므로 cross-site fetch 에 쿠키 동봉이 SameSite=None 필수. ④ Worker 재배포 + curl OPTIONS 로 `http://bgnj.net` origin 의 `access-control-allow-origin` 응답 확인. 왜: 사용자가 HTTPS 비용 부담으로 HTTP 운영 중이라고 안내해 주셨고, HTTP 에서도 로그인이 정상 동작하도록 정책을 임시 완화. 후속 안내: GitHub Pages 의 무료 SSL(저장소 Settings → Pages → 'Enforce HTTPS')을 켜면 비용 없이 HTTPS 전환 가능 — 전환 후 ALLOWED_ORIGINS 의 HTTP 항목과 SameSite=None 을 다시 좁히는 것이 권장.
- 2026-04-28: HTTPS 강제 리다이렉트 (v00.027.003). 무엇이 바뀌었나: index.html `<head>` 최상단에 `location.protocol === 'http:'` 인 경우 즉시 `https:` 로 `location.replace` 하는 가드 추가(localhost/127.0.0.1 은 예외). 왜: 사용자 콘솔 로그에서 `http://bgnj.net` origin 이 Worker CORS(`https://bgnj.net` 만 허용)에서 차단되어 모든 API 호출이 'Access to fetch ... blocked by CORS policy' / 'Failed to fetch' 로 떨어지는 것이 확인됨. 일부 브라우저/북마크가 주소창 `bgnj.net` 입력 시 `http://` 로 들어오는 케이스가 있었음. 다음 작업: Cloudflare 대시보드의 'Always Use HTTPS' 설정도 켜서 서버 측 301 리다이렉트로 이중 안전장치 확보(사용자 직접 작업).
- 2026-04-28: 캐시 무력화 + 진단 도구 (v00.027.002). 무엇이 바뀌었나: ① 모든 정적 자산(api.js, data.js, components/*, pages/*, styles.css) 에 `?v=00.027.002` 쿼리 부착하여 다음 배포부터는 브라우저가 옛 JS 를 쓰지 못하도록 cache-busting 적용. ② index.html `<head>` 에 `Cache-Control: no-cache, no-store, must-revalidate` 와 `Pragma: no-cache` / `Expires: 0` meta 추가하여 HTML 자체가 옛 캐시로 머무는 것도 차단. ③ 페이지 로드 시 콘솔에 현재 버전 배지(`[BGNJ] v00.027.002`) 자동 출력. ④ `BGNJ_DIAG.run()` 진단 헬퍼 신설 — origin/헬스체크/세션 상태를 한 줄로 점검. 왜: v00.027.001 의 오류 가시화 작업 후에도 사용자가 옛 alert 텍스트(`Failed to Fetch`) 를 그대로 보고 있었는데 원인이 브라우저 캐시였기 때문에 사용자가 강제 새로고침하지 않아도 새 코드가 적용되도록 영구 해결. 다음 작업: 신규 버전 배포 시 `?v=` 쿼리를 BGNJ_VERSION 과 동기 갱신하는 흐름을 ai-development-rules.md 체크리스트에 명시.
- 2026-04-28: 오류 가시화 묶음 (v00.027.001). 무엇이 바뀌었나: ① BGNJ_API.request 가 네트워크/CORS/HTTP/응답 해석 실패를 분류해 `err.kind / err.code / err.status / err.body / err.url` 로 던지도록 강화. ② BGNJ_AUTH.signIn / signUp 이 실패 시 `{ ok:false, code, status, kind, message, hint, url }` 구조를 반환하며 상태별 사용자 가이드(hint) 를 자동 부여. ③ 로그인/회원가입 폼이 alert 대신 인라인 AuthErrorPanel 로 코드·상태·사유·가이드·요청 URL 을 한 카드에 노출하고 입력 수정 시 자동 소거. ④ 클라이언트 사전 검증도 의미 있는 코드(FORM_EMAIL_REQUIRED 등) 와 함께 동일 패널로 통일. ⑤ AppErrorBoundary 가 렌더링 오류의 코드·사유·스택·컴포넌트 스택을 분리 노출 + '다시 시도/새로고침' 액션 제공. ⑥ GlobalErrorToast 신설 — unhandledrejection / window.error 를 캡처해 우하단 토스트로 코드+사유+가이드+요청 URL 노출, 인증 외 비동기 호출의 오류도 화면에 도달. ⑦ 분류된 모든 오류는 console.error 로도 동시 기록. 왜: 'Failed to fetch' 같은 모호한 메시지 하나로는 사용자도 운영자도 원인을 알 수 없었기 때문에, 오류가 (어떤 코드인지/어떤 상태인지/정확한 사유/사용자가 무엇을 해야 하는지) 네 가지가 한 화면에 보이게 만들었다. 다음 작업: 게시글/강연 등록 등 비인증 흐름에서도 동일한 hint 매핑을 적용하고, 관리자 화면에서 최근 클라이언트 오류를 모아볼 수 있는 패널 검토.
- 2026-04-28: 회원가입/로그인 정비 + 댓글 다단계 트리 + @멘션 + 새 글 임시저장 + 슈퍼관리자 + Worker CORS 확장 + 등급 자동 강등 (v00.027.000). 무엇이 바뀌었나: ① 댓글이 1단계 → 3단계 재귀 트리로 확장되고 본댓글/답글 모두 @멘션 자동완성과 골드 chip 강조 렌더가 붙음. ② 새 글 작성 화면이 사용자별 키로 800ms 디바운스 임시저장 + 진입 시 자동 복원 + 발행 시 자동 정리. ③ 회원가입 페이지에서 네이버/카카오 소셜 버튼·AUTH STATUS·CLOUDFLARE 박스·뉴스레터/3자제공 동의를 모두 제거하고 약관 텍스트 클릭 시 BGNJ_LEGAL 본문을 모달로 노출, 관심분야에 '기타(직접 입력)' 추가, 추가 정보 미입력 안내를 강조 박스로 노출. ④ 로그인/회원가입 좌측 영역을 사이트 콘텐츠(`auth` 섹션: eyebrow/title/description/imageDataUri)로 묶어 관리자에서 이미지·문구 직접 편집 가능. ⑤ 왕사들/王사들 잔재 일괄 제거. ⑥ Worker 에 `SUPER_ADMIN_EMAILS` 환경변수 도입 — 등록된 이메일은 가입/로그인/세션 조회 시점에 항상 admin 강제(scoutkorea@kakao.com 등록). ⑦ Worker CORS 가 localhost/127.0.0.1 의 임의 포트를 자동 허용하여 로컬 개발에서의 'Failed to fetch' 해결. ⑧ `BGNJ_GRADE_PROMO.maybeDemote / reevaluateAll` 추가 — 글/댓글 삭제 시점에 작성자 자격 등급 재산정하여 자격 미달이면 자동 강등 + 알림 + 감사 로그. 왜: 회원가입 페이지가 실제 가입 플로우와 어긋나 있던 부분(쓰지 않는 소셜 로그인, 운영하지 않는 메일 옵트인)을 정리하고, 사용자가 막혀있던 작은 빈 칸들(댓글 깊이, 임시저장, 멘션)을 메워 사용자가 글을 잃어버리거나 답글이 끊기는 경험을 없앴다. 슈퍼관리자/CORS 는 운영자 권한 손상 회복과 로컬 개발 환경 단절 해결을 위함이다. 배경: scoutkorea@kakao.com 가입 시 자동으로 일반 회원으로 떨어지는 문제와 로컬 환경에서 로그인 시 'Failed to fetch' 가 나는 문제가 식별되어 같은 묶음으로 처리. 다음 작업: PG 결제 도입(공급사 의사결정 필요), 관리자 패널에 '활동 기반 등급 재산정' 일괄 버튼 노출, 댓글 트리 무제한 깊이 + 접기/펴기 검토.

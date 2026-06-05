// === pages/admin/AdminDesignHub.jsx ======================================
// v00.070 — AuthAdminPage.jsx 분할. Design System View / 버전 히스토리 / 미션 / 기능 정의서 묶음.
// 모듈은 단일 파일이 아닌 별도 <script type="text/babel"> 로 로드되므로,
// 파일 끝에서 Object.assign(window, {...}) 로 명시적 노출 — 그 후 AuthAdminPage 가 trampoline 으로 가져감.
const ADMIN_VERSION_HISTORY = [
  {
    version: "00.284.001",
    date: "2026-06-06",
    datetime: "2026-06-06T14:40:00+09:00",
    summary: "🔧 위치/교통 OpenStreetMap 지도 CSP 차단 해제",
    details: [
      "🗺️ [지도 깨짐 fix] CSP frame-src 가 YouTube/Vimeo 만 허용해 OpenStreetMap iframe 이 'Framing violates frame-src' 로 차단되던 것 → frame-src 에 https://www.openstreetmap.org 추가. (콘솔의 404·chrome-error 는 차단 프레임의 부수효과로, 허용 후 자동 해소.)",
      "📦 cache-buster — `?v=00.284.001`."
    ],
    context: "v00.283 지도 추가 후 손님 페이지에서 지도가 깨진 문서 아이콘으로 표시. 근본 원인은 CSP frame-src 화이트리스트 누락."
  },
  {
    version: "00.284.000",
    date: "2026-06-06",
    datetime: "2026-06-06T14:00:00+09:00",
    summary: "🏨 한켠 객실에 주간(7박)·월간(30박) 고정 정액 상품 추가",
    details: [
      "🗓️ [신규 상품] 기존 시간제·숙박(하루)에 더해 주간(7박 고정)·월간(30박 고정) 상품 추가. 손님은 시작일만 선택하면 체크아웃이 자동(+7/+30박) 설정되고 관리자가 정한 정액으로 결제.",
      "⚙️ [관리자] 객실 관리 편집 폼에 '주간(7박)/월간(30박) 예약 받기' 토글 + 정액 요금 입력 추가. 목록 요약줄에도 주간/월간 요금 표기.",
      "🧮 [워커] hkComputeFixed 견적(정액 + 쿠폰·회원할인), hkQuoteFor 라우팅, 재고 점유(hkHourRemaining/hkRoomAvailability)에 weekly·monthly 범위 점유 반영(더블부킹 방지). 객실 CRUD에 weekly_*/monthly_* 컬럼 매핑.",
      "🗄️ [D1] hk_room_types 에 weekly_enabled/weekly_price/monthly_enabled/monthly_price 컬럼 추가. migrate-weekly-monthly.sql 로 remote 적용 필요.",
      "📦 cache-buster — `?v=00.284.000`."
    ],
    context: "사용자가 객실관리에 주간·월간 상품 추가 요청(현재 일간만). 고정 1블록(7/30박)·정액·시작일만 선택으로 확정."
  },
  {
    version: "00.283.000",
    date: "2026-06-06",
    datetime: "2026-06-06T13:00:00+09:00",
    summary: "🗺️ 한켠 위치/교통에 OpenStreetMap 지도 추가",
    details: [
      "🗺️ [손님 페이지] 자고 놀자 한켠 상세 '위치/교통' 섹션에 OpenStreetMap 임베드 지도(마커 + 「큰 지도에서 보기」 링크) 추가. 외부 라이브러리·API 키 없이 iframe 임베드. 좌표 미설정 시 팔달로 기준 기본값(35.8313, 127.1386).",
      "⚙️ [관리자 패리티] 숙소 관리 > 숙소 정보 폼에 지도 위도(lat)·경도(lng) 입력 추가. server-first(site_content_kv.hangyeon)로 저장. openstreetmap.org URL의 mlat·mlon 값으로 정확한 핀 지정.",
      "📦 cache-buster — `?v=00.283.000`."
    ],
    context: "사용자가 위치/교통 섹션에 OSM 지도를 넣고 싶다고 요청. 정확한 건물 핀은 admin 좌표 입력으로 직접 지정."
  },
  {
    version: "00.282.000",
    date: "2026-06-06",
    datetime: "2026-06-06T12:00:00+09:00",
    summary: "🔧 관리자 숙소 대표사진 업로드 영역 UI 깨짐 fix",
    details: [
      "🖼️ [드롭존 깨짐 fix] MediaGalleryEditor 드롭존이 label 기본 display:inline 탓에 border/배경이 첫 줄박스(왼쪽 세로 띠)만 감싸고, 내부 블록 div(「최대 10장 도달」 등)이 박스 밖으로 흘러 helpText 와 겹쳐 보이던 것 → dropZoneStyle 에 display:block 추가로 해결.",
      "📦 cache-buster — `?v=00.282.000`."
    ],
    context: "사용자가 관리자 한켠 PMS 숙소 대표사진 영역 UI 깨짐을 보고. label 인라인 렌더링이 근본 원인."
  },
  {
    version: "00.281.000",
    date: "2026-06-04",
    datetime: "2026-06-04T16:13:51+09:00",
    summary: "🏠 홈(home-next) 히어로·전체 레이아웃 답답함 해소 + 타이포 합리화",
    details: [
      "🔤 [헤드라인 음절 깨짐 fix] 사용자 보고 '인문기행'이 '인문기/행'으로 깨짐. .hn-h1 에 word-break:keep-all + clamp 상한 46→40px 완화 + .hn-hero-inner max-width 540→620px 로 한 줄 여유 확보.",
      "🟫 [CTA 아이콘 빈 박스 제거] 아이콘 미업로드 시 36px 회색 placeholder(깨진 이미지처럼 보임)를 렌더하던 것 → 조건부 렌더로 텍스트-only pill 처리.",
      "🫁 [전체 답답함 해소] 사용자 보고 '메인페이지 전반이 답답'. 원인: 한 화면(min-height 100vh) 압축 설계 + 14~20px 초소형 패딩 + 10~12px 초소형 폰트. 섹션 패딩(카드 14→48 / 통계 16→40 / 푸터 20→48), grid gap(14→22 · 통계 10→18 · 푸터 24→32), 카드 이미지 110→150px, 소형 폰트(카드설명 12→13 · 통계라벨/서브 10→11) 일괄 상향. 모바일 분기도 동일 완화.",
      "📐 [히어로 과대 높이] flex:1 가 뷰포트를 다 채워 콘텐츠가 빈 공간에 가라앉던 것 → min-height clamp(360,52vh,560) 로 적정화(콘텐츠가 늘면 자연 스크롤).",
      "📦 cache-buster — `?v=00.281.000`.",
    ],
    context: "사용자가 home-next 히어로 우측 쏠림/깨짐 + 메인 전반 답답함을 연달아 보고. 한 화면 압축 설계가 근본 원인 — 여백/타입 스케일을 숨 쉴 수 있게 합리화.",
  },
  {
    version: "00.280.000",
    date: "2026-06-04",
    datetime: "2026-06-04T15:54:17+09:00",
    summary: "🧭 메가 드롭다운 위치 보정 — backdrop-filter containing block 이중 오프셋 제거",
    details: [
      "📐 [드롭다운 간격 과다 fix] 사용자 보고 '커뮤니티 드롭다운 간격이 너무 길다'. 원인: .nav 의 backdrop-filter:blur 가 position:fixed 자식의 containing block 을 뷰포트→.nav 로 바꿈. getBoundingClientRect(뷰포트 좌표)를 top 으로 그대로 쓰니 nav 상단 오프셋만큼 이중으로 밀려 드롭다운이 아래로 떴음. computeMegaPos 가 좌표를 containing block(.nav) 기준으로 보정 (r.left/r.bottom − navRect.left/top). 놀자·커뮤니티 양쪽 교정.",
      "📦 cache-buster — `?v=00.280.000`. (v00.279 메가 일반화 후속 위치 보정)",
    ],
    context: "v00.279 에서 커뮤니티 메가를 fixed 로 일반화한 뒤 드롭다운이 nav 한참 아래에 뜨는 후속 보고. backdrop-filter 의 fixed containing-block 부작용을 좌표 보정으로 해소.",
  },
  {
    version: "00.279.000",
    date: "2026-06-04",
    datetime: "2026-06-04T15:47:28+09:00",
    summary: "🛠 커뮤니티 3대 결함 일괄 — React #300 크래시 + 6페이지↓ 글 사라짐 + 메가 드롭다운 잘림",
    details: [
      "💥 [React error #300 fix] 사용자 보고 '/community 진입 시 오류 페이지'. CommunityPage 가 `if (postId) return <상세>` early-return 뒤에 useState/useCallback/useMemo 등 hook 9개를 호출 → 목록↔상세 전환 시 실행 hook 수가 달라져 'Rendered fewer hooks' 크래시. 상세뷰 분기를 모든 hook 선언 아래로 이동해 hook 순서 고정.",
      "📄 [6페이지 이후 글 사라짐 fix] 사용자 보고 '5페이지 이후로 안 넘어감 / 06.김제시 이전 글이 안 보임 — 삭제됐나?'. 원인: 워커 posts 목록 limit 기본 50 + 클라 refreshPosts 가 limit 미지정 → 최신 50개(=10개×5페이지)만 로드. D1 실측 85건 전량 존재(삭제 아님). refreshPosts 가 limit:1000 요청 + 워커 기본 1000/캡 2000 으로 상향.",
      "🧭 [메가 드롭다운 잘림 fix] 사용자 보고 '서브메뉴가 영역 밖에서 보여야지'. .nav-menu overflow-x:auto(가로 슬라이드)가 그 안 absolute 드롭다운을 세로로 클리핑. v00.266 에 '놀자'만 fixed 로 탈출시켰던 것을 커뮤니티 포함 범용(openMega key)으로 일반화 — 모든 메가가 position:fixed + JS 위치계산으로 오버플로우 탈출. 구 CSS :hover 룰 제거.",
      "📦 cache-buster — `?v=00.279.000`. 워커 재배포 (posts limit 상향).",
    ],
    context: "사용자가 커뮤니티에서 연달아 3건(크래시·글 사라짐·드롭다운 잘림) 보고. 글 삭제 아님(D1 85건 확인) — fetch limit 표시 한계였음을 규명 후 일괄 수정.",
  },
  {
    version: "00.240.000",
    date: "2026-05-09",
    datetime: "2026-05-09T13:30:00+09:00",
    summary: "🎠 홈 칼럼 자동 순환 (최근 5개) + nav 슬라이드/좌우 nowrap + 업로드 spinner + 포스터/칩 일괄 정합 (v00.238~240)",
    details: [
      "🎠 [홈 칼럼 자동 순환] 사용자 요청 '좌측 메인은 최근 5개 중심 자동 순환'. publicColumns.slice(0,5) → featuredIdx state + setInterval 5초. hover/focus pause (접근성). 인디케이터 점 N개 (활성 22×8 옐로우 알약, 비활성 8×8 line-2). aria-current/aria-label. 'AUTO/HOVER' mono 라벨로 상태 시각화.",
      "🖼 [포스터 가득 노출] 사용자 보고 '포스터는 비율 구애없이 좌우 여백없이'. 16:10 aspect crop+contain 박스 제거. width:100%+height:auto 로 컬럼 가득 + 자연 비율. 강연/투어 양쪽.",
      "🎨 [칩 KMS §2 정합] 사용자 보고 '디자인 규칙과 다름'. info(blue) 시스템 색 제거. primary(브랜드)/secondary(주최)/secondary-hover(주관)/tertiary(장소)/neutral(결제) 4단계 톤만. 주최/주관 caramel 분리.",
      "✏️ [강연 제목/주제 줄바꿈] detail h2/note whiteSpace:'pre-wrap'. 모달 input → textarea (Enter 줄바꿈).",
      "🏛 [주관(organizer) 신규] site_content_kv.lecturePages[id].organizer (워커 D1 schema 변경 회피). 모달 input + detail 칩 (secondary-hover 톤).",
      "↔️ [nav 슬라이드 + 좌우 nowrap] 사용자 명시 '가운데 꽉차면 슬라이드 — 지금처럼'. .nav-menu flex:1+overflow-x:auto 항상 슬라이드 (PC 포함). .brand/.nav-actions 자식 nowrap+flex-shrink:0 — 좌측 로고/우측 이름 1줄 일관성.",
      "⏳ [업로드 동적 피드백] drop zone 안 CSS 스피너 (옐로우 ring) + '사진 업로드 중 N/M' + 진행률 바 + 'R2 업로드 — 잠시만 기다려 주세요'. @keyframes bgnj-spin 추가.",
      "🩹 [admin 사이드바 가독성 hotfix] 사용자 민원 '좌측 메뉴 가독성 안 좋다'. 인라인 노란 hex 6곳 (버전 뱃지/ADMIN CONSOLE/contact/DPO/적용법/DPIA) → ink-2 슬레이트 + bg-3 배경. KMS §2 옐로우 5% 룰 정합.",
      "🩹 [PC nav 깨짐 fix] v00.236 .nav-menu overflow 글로벌 룰이 PC flex 자식 계산에 영향 의심 → @media (721~1100px) 안으로 격리 후 v00.240 다시 글로벌 (사용자 명시 '항상 슬라이드').",
      "🩹 [빈 강연 본문 토글 유지] early return 제거. main return 흐름 유지하여 헤더+버킷토글+추가 버튼 항상 노출.",
      "📦 cache-buster — `?v=00.240.000`.",
    ],
    context: "사용자 보고 누적 처리. 메타 갱신 누락 보고 받기 전 마지막 commit.",
  },
  {
    version: "00.237.000",
    date: "2026-05-09",
    datetime: "2026-05-09T11:30:00+09:00",
    summary: "🖼 갤러리 다중업로드 + drag&drop + 종료 강연 현장 사진 + admin 패널 진입로 (v00.234~237)",
    details: [
      "📸 [MediaGallery.jsx 신규] 사용자 요청 '강연/투어 사진 최대 10장 + 출처 + 대표사진'. Editor + View + 헬퍼. 저장 위치 site_content_kv.lecturePages[id].images / tourPages[id].images (워커 deploy 회피). _normalizeImages 가 11장 이상/형식 결손/대표 0·2+ 자동 정정.",
      "📁 [다중 업로드 + drag&drop] 사용자 화 '한 장씩 업로드 불편'. <input multiple> + drop zone (dragOver 시 primary 톤 하이라이트). 진행률 표시. 한 장 실패해도 다음 장 진행 (resilient).",
      "📅 [종료 강연 현장 사진] 사용자 요청 '종료된 강연에 현장 사진 추가'. images(포스터) + photos(현장사진) 분리. _isPast(lecture) 분기 + withCover=false (전 사진 그리드 노출). LectureQuickAddModal 두 섹션.",
      "🎛 [admin 패널 진입로] 사용자 화의 핵심. LectureAdminPanel/TourAdminPanel 카드에 '🖼 포스터·현장사진' / '🖼 사진 갤러리' 버튼 → window.LectureQuickAddModal/TourQuickAddModal 재사용. admin 한 클릭 진입.",
      "✎ [프론트 강연·칼럼·투어 수정 모달] 사용자 요청 '관리자는 프론트 페이지에서도 수정'. add 모달을 initialLecture/initialTour/initialColumn prop 으로 add/edit 양 모드 확장. detail badge row 우측 ✎ 수정 진입로.",
      "🛡 [관리자가 hidden 강연도 노출 + 포스터 필수 가드] admin listAll({includeHidden:isAdmin}) + '◆ 숨김' warning 라벨 + 모달 hidden 토글. 신규 add 시 포스터 1장 필수 (기존 데이터 편집 시 미강제).",
      "📦 cache-buster — `?v=00.237.000`.",
    ],
    context: "사용자가 v00.235 갤러리 추가 후에도 admin 패널에서 사진 관리 못 한다고 화남. 그 핵심 진입로 + UX (다중/drag&drop) + 종료 강연 분리 일괄.",
  },
  {
    version: "00.233.000",
    date: "2026-05-09",
    datetime: "2026-05-09T11:00:00+09:00",
    summary: "🚨 데이터 사라짐 케이스 스터디 + lint 룰 cache_overwrite 항구 차단 (v00.231~233)",
    details: [
      // bgnj-lint-ignore-next-line cache_overwrite
      "🚨 [데이터 사라짐 23곳 가드 v00.231] 사용자 보고 '데이터들이 자꾸 간혹 사라진다 — 제일 중요'. data.js 의 모든 BGNJ_*.refresh*() 헬퍼가 (data || []).map(...) 패턴이라 워커가 {field:null}/{} 같은 비-배열 응답 시 캐시를 빈 배열로 덮어씀. 23곳 (LECTURES/TOURS/COLUMNS/BOOKS/COMMUNITY/FAQ/AUDIT/SITE_CONTENT/AUTH refresh/refreshMine/Registrations/Reservations/Reviews/Bookmarks/Notifications/Reports) Array.isArray 가드 + console.warn 진단 로그.",
      "🛡 [lint 룰 cache_overwrite v00.233] tools/check-syntax.mjs 신규 룰. /\\(\\s*\\w+\\s*\\|\\|\\s*\\[\\]\\s*\\)\\.map\\b/. pre-commit 자동 차단. 우회 시 '// bgnj-lint-ignore-next-line cache_overwrite' 마커. 룰 추가 시 부수 발견 — CommunityPage:1498 멘션 + AdminShared:298 Sankey rows 2곳 같이 정정.",
      "📚 [케이스 스터디 + 영구 기록] plans/v00.233.000.md (사고 요약 / 근본 원인 / 발화 조건 / 미발견 이유 / 학습 4건). CONTEXT.md §6 가드 1줄 추가. kms.md 변경 기록 1행. ~/.claude/.../memory/feedback_data_loss_lesson.md 신규 + MEMORY.md 인덱스. 미래 Claude 세션 자동 차단.",
      "📦 cache-buster — `?v=00.233.000`.",
    ],
    context: "사용자가 'critical 우선순위'로 보고. 23곳 인스턴스 가드 (v00.231) → lint 룰 항구 차단 + 영구 문서화 (v00.233) 5중 안전장치.",
  },
  {
    version: "00.232.000",
    date: "2026-05-09",
    datetime: "2026-05-09T10:30:00+09:00",
    summary: "🔐 강연·투어 신청 시 개인정보+제3자 동의 필수 (이중 방어, v00.232)",
    details: [
      "🔐 [개인정보 동의 필수] 사용자 요청. LectureBookingPanel/TourBookingPanel 신청 폼 안 합계 안내 직후 동의 체크박스. [필수] 강연 신청 처리 + 운영 제휴사로의 제3자 제공 동의. '자세히 보기' → /privacy 라우트.",
      "🛡 [이중 방어] 1) 신청 접수 버튼 disabled={!agreed} 클릭 차단. 2) submit() 진입 가드 setError 후 return. agreed state 는 lecture/tour/user 변경 시 reset.",
      "📦 cache-buster — `?v=00.232.000`.",
    ],
    context: "사용자가 GDPR/PIPA 정합을 위해 동의 절차 명시 요구.",
  },
  {
    version: "00.230.000",
    date: "2026-05-09",
    datetime: "2026-05-09T10:00:00+09:00",
    summary: "🟡 노란글씨 가독성 hotfix — .gold/.gold-2/.accent/.badge-gold → secondary (v00.230)",
    details: [
      "🟡 [가독성 hotfix] 사용자 보고 '노란글씨는 잘 안보여' (스크린샷). primary 옐로우 #F5D548 가 흰 배경에서 대비비 ~1.7:1 (WCAG AA 4.5:1 한참 미달). KMS §2 'Primary 5% — CTA만' 룰 위배. styles.css .gold/.gold-2/.section-title .accent/.badge-gold 텍스트 색을 secondary (Caramel Ink #92400E, AAA 대비) 로 일괄 교체.",
      "🌙 [다크모드 보존] :root[data-theme='dark'] .gold override 유지 — 어두운 배경에서는 옐로우 가독성 양호.",
      "🩹 [LecturesPage/WangsanamTourPage 인라인] 'var(--primary)' 텍스트 (탭/버킷/잔여석/FREE pill) 도 secondary 로. tone() confirmed 도 secondary.",
      "📦 cache-buster — `?v=00.230.000`.",
    ],
    context: "v00.209 레거시 컬러 토큰 제거 후에도 .gold/.gold-2 가 본문 강조 텍스트로 광범위 사용 중이라 흰 배경 가독성 결함. 사이트 전반 한 번에 회복.",
  },
  {
    version: "00.229.000",
    date: "2026-05-09",
    datetime: "2026-05-09T09:30:00+09:00",
    summary: "🚪 /error?code= 라이브 라우트 + /mypage·/admin 401 wiring (v00.229)",
    details: [
      "🚪 [라이브 에러 라우트] VALID_ROUTES 에 'error' 추가. case 'error' 가 ?code=401|403|404|500|network|maintenance 매핑. 어드민→회원 안내 링크 공유 가능.",
      "🛡 [/mypage 401 wiring] 비로그인 진입 → Error401Page (이전엔 user?.id 옵셔널 체인으로 반쯤 빈 상태 노출).",
      "🛡 [/admin 권한 분기 세분화] 비로그인 → Error401Page, 비-admin 회원 → AdminDenied 유지 (이메일 표시 UX 보존).",
      "📦 cache-buster — `?v=00.229.000`.",
    ],
    context: "ROADMAP §큐1 '에러 페이지 라이브 라우트' + '403/401 자동 wiring' 두 항목 일괄.",
  },
  {
    version: "00.228.000",
    date: "2026-05-09",
    datetime: "2026-05-09T09:00:00+09:00",
    summary: "➕ 관리자 프론트 강연·투어 quick-add 모달 (v00.228)",
    details: [
      "➕ [LectureQuickAddModal/TourQuickAddModal] 사용자 요청 '관리자가 프론트에서도 강연·투어 추가'. AuthAdminPage.addNewLecture/Tour 와 같은 saveLecture/saveTour 호출 + 같은 default. 빈 상태 + 버킷 토글 우측에 '＋ 강연 추가'/'＋ 투어 추가' 버튼.",
      "🛡 권한 — 버튼 isAdmin 게이팅 + 모달 더블체크 + 워커 requireAdmin 강제.",
      "📦 cache-buster — `?v=00.228.000`.",
    ],
    context: "사용자가 admin 콘솔 거치지 않고도 즉시 강연·투어 추가 가능하도록.",
  },
  {
    version: "00.227.000",
    date: "2026-05-09",
    datetime: "2026-05-09T08:30:00+09:00",
    summary: "📐 sticky nav 가림 방지 — html scroll-padding-top 88/80 (v00.227)",
    details: [
      "📐 [scroll-padding-top] ColumnPage #col-comments 같은 native anchor 가 sticky .nav (72/64px) 아래로 가려지던 문제. styles.css 글로벌 룰 한 곳에서 해결. hash 진입·element.scrollIntoView()·브라우저 위치 복원 모두 적용.",
      "📦 cache-buster — `?v=00.227.000`.",
    ],
    context: "ROADMAP §큐1 'anchor scroll-margin-top' 항목 — 가장 작고 well-defined 한 후속.",
  },
  {
    version: "00.226.000",
    date: "2026-05-07",
    datetime: "2026-05-07T03:08:42+09:00",
    summary: "📄 메타 현행화 사이클 — kms.md 디자인 §1-8 전면 재작성 + v00.157~225 압축 + CONTEXT/ROADMAP 갱신 (v00.226)",
    details: [
      "📄 [kms.md 디자인 §1-8] 컬러 시스템이 '블루 팔레트' 명시되어 있던 stale 정정 → '5:25:70 황금 배색' (Primary 옐로우 5% / Secondary Caramel / Tertiary Slate / Neutral). 다크모드 옐로우 유지 명시.",
      "📚 [v00.157~225 압축 요약] 5개 영역별 누계 (admin 가시화 / 리팩토링 / 보안·SEO·메타 / 모바일·UX / 운영 패턴 변화).",
      "📦 cache-buster — `?v=00.226.000`.",
    ],
    context: "v00.221~225 모바일 UX 4-사이클 마무리 후 메타 일괄 현행화.",
  },
  {
    version: "00.225.000",
    date: "2026-05-04",
    datetime: "2026-05-04T18:00:00+09:00",
    summary: "📱 모바일 UX 4-사이클 (v00.221~225) — 책 cover sticky 해제 / 게시글 1줄 ellipsis / 본문 가독성 종합 / sticky 카드 일괄 release / FAB 폰 36×36",
    details: [
      "📱 [v00.221] 책 상세 표지 모바일 sticky 해제 — book-cover-col 클래스. 모바일 1단에서 표지가 100vh 차지하던 문제.",
      "📱 [v00.222] 게시글 목록 제목 1줄 ellipsis + .row-mobile-meta 메타 라인 (작성자·날짜·카테고리). 짤린 제목 hover tooltip.",
      "📱 [v00.223] 모바일 가독성 종합 — .post-body 17px (이전 14) / .field-input 16px (iOS zoom 차단) / iframe·video 16:9 강제 / .dim-2 ink-2 / 카드 호흡 (padding 확장).",
      "📱 [v00.224] 강연/투어/결제 sticky 카드 일괄 release — .mobile-release-sticky 클래스. 데스크탑 sticky top:100 → 모바일 static.",
      "📱 [v00.225] scroll-to-top FAB 폰 36×36 (이전 56×56, footprint −56%) + 종합 충돌 검토.",
      "📦 cache-buster — `?v=00.225.000`.",
    ],
    context: "사용자 모바일 민원 누적 일괄 대응. 4사이클이 모두 사용자 보고 발 → 즉시 응답.",
  },
  {
    version: "00.220.000",
    date: "2026-05-04",
    datetime: "2026-05-04T16:00:00+09:00",
    summary: "💰 현금영수증 신청 + 칼럼 일련번호·#col-N 단축 URL + admin 칼럼 카테고리 칩 시인성 (v00.218~220)",
    details: [
      "💰 [v00.218 현금영수증 신청] 책/강연/투어 결제 모두. BGNJ_CashReceipt 헬퍼 + BGNJ_CashReceiptField 컴포넌트. note prefix 인코딩으로 워커 schema 변경 회피.",
      "🔢 [v00.219 칼럼 일련번호 + #col-N 단축 URL] 칼럼 게시 순서별 #col-1, #col-2... 자동 부여. 공유 링크가 짧고 안정적.",
      "🩹 [v00.220 admin 칼럼 카테고리 칩 시인성] 카테고리 칩 컬러 보강 + X 버튼 톤다운.",
      "📦 cache-buster — `?v=00.220.000`.",
    ],
    context: "결제 영역 정비 + 칼럼 공유성 개선.",
  },
  {
    version: "00.217.000",
    date: "2026-05-03",
    datetime: "2026-05-03T18:00:00+09:00",
    summary: "🩹 모달/auth/sidebar 잡음 일괄 (v00.210~217)",
    details: [
      "🩹 [v00.210] 칼럼 작성 모달 무한 로딩 + confirm() 잔여 hotfix.",
      "📱 [v00.211] 모바일 햄버거←로고 좌측 정렬 (시각 순서).",
      "🚪 [v00.212] /login·/signup 직접 진입 시 PAGE_NOT_LOADED hotfix — admin lazy-load 트리거.",
      "🚪 [v00.213] /signup 직접 진입 시 회원가입 탭 자동 활성.",
      "🔔 [v00.214] 새 빌드 자동 감지 + 새로고침 배너 — version.json 폴링.",
      "📱 [v00.215] 모바일 auth hero art 숨김 (사용자 민원 — 폼이 안 보임).",
      "🩹 [v00.216~217] admin 사이드바 서브메뉴 시각 위계 강화 + 위계 역전 수정.",
      "📦 cache-buster — `?v=00.217.000`.",
    ],
    context: "v00.210~217 잡음 일괄.",
  },
  {
    version: "00.209.000",
    date: "2026-05-02",
    datetime: "2026-05-02T17:00:00+09:00",
    summary: "🎨 BGNJ_TOAST/CONFIRM API + alert/confirm 120건 교체 + 레거시 컬러 토큰 전면 제거 (v00.206~209)",
    details: [
      "🎨 [v00.206 BGNJ_TOAST] 프로그램 호출 가능 토스트 API. window.BGNJ_TOAST.{success,error,info}. 다크모드 정합.",
      "🎨 [v00.207 alert() → BGNJ_TOAST.error] 73건 일괄 교체. 사용자 시스템 alert 모드 차단.",
      "🎨 [v00.208 confirm() → BGNJ_CONFIRM Promise] 47건 일괄 교체. ConfirmDialog 컴포넌트 + danger/confirmLabel 옵션.",
      "🌈 [v00.209 레거시 컬러 토큰 전면 제거] --gold/--gold-dim/--gold-ink/--cta-* 모든 코드에서 제거 → --primary*/--on-primary/--secondary*/--tertiary 사용. KMS 디자인 §2 갱신은 v00.226.",
      "📦 cache-buster — `?v=00.209.000`.",
    ],
    context: "사용자 알림 UX + 컬러 토큰 시스템 정비.",
  },
  {
    version: "00.205.000",
    date: "2026-05-02",
    datetime: "2026-05-02T15:00:00+09:00",
    summary: "📚 P1 묶음 + SEO + postMessage 검증 + 디자인 가이드 9건 동기화 (v00.202~205)",
    details: [
      "👤 [v00.202 작성자 프로필 페이지] 워커 GET /api/users/:id/public + 신규 라우트 /user/:id. 프로필 + 작성 글 목록.",
      "🔍 [v00.203 본문 검색 옵션 deploy] 워커 wrangler deploy.",
      "🌐 [v00.204 SEO sitemap lastmod] sitemap.xml 동적 생성 + lastmod 자동. 네이버 검색콘솔 verification meta.",
      "🎨 [v00.205 디자인 가이드 9건 코드 동기화] AdminDesignHub.jsx 갱신 — 폰트 (KBL/Wanted/ChosunIlbo) / Primary 옐로우 환원 / sticky release 룰 등.",
      "📦 cache-buster — `?v=00.205.000`.",
    ],
    context: "P1 마무리 + SEO + 디자인 가이드.",
  },
  {
    version: "00.201.000",
    date: "2026-05-06",
    datetime: "2026-05-06T17:00:00+09:00",
    summary: "🔐 P1 묶음 — 비밀번호 변경 + 본문 검색 옵션 (P1 #5 답글 트리는 이미 구현됨 확인)",
    details: [
      "🔐 [P1 #3 비밀번호 변경 UI] 사용자 우선순위 그대로 진행. 워커 PATCH /api/me/password 신설 (handleMePassword) — 현재 비번 verify → 새 비번 hash → users 업데이트 → audit_log auth.password_change. 마이페이지 [프로필 수정] 탭에 PasswordChangeForm 카드 추가 (현재/새/확인 + 6자 이상 + 일치 검사). BGNJ_API.changePassword 헬퍼 추가.",
      "✅ [P1 #5 답글 트리 — 이미 구현됨] 확인 결과 D1.comments.parent_id 컬럼 + 워커 handleCommentsCreate 의 parent_id 입력 + 클라 CommentTree 의 들여쓰기 + 답글 버튼 + 깊이 캡 + 펼치기/접기까지 v00.069 시점에 풀 구현. 기능정의서 missing 항목이 stale — 다음 사이클 갱신 시 수정 예정.",
      "🔍 [P1 #4 본문 검색] 클라이언트는 이미 BGNJ_COMMUNITY 의 filtered useMemo 가 body.text 포함 검색 (line 585). 워커 측에 includeBody=1 옵션 추가 — handlePostsList / handleColumnsList 모두 q + includeBody 시 body LIKE OR 결합. BGNJ_API.posts.list / columns.list 에 includeBody 파라미터 노출.",
      "ℹ ★ 워커 wrangler deploy 필요 (PATCH /api/me/password + posts/columns 본문 검색 옵션).",
      "📦 cache-buster — `?v=00.201.000`.",
    ],
    context: "사용자 우선순위 그대로 진행 — P1 #3 (프로필/비번) + P1 #5 (답글 트리, 이미 구현됨) + P1 #4 (본문 검색) 한 사이클에서 정리. P1 #6 작성자 프로필 페이지는 신규 라우트 + 워커 endpoint + 새 컴포넌트로 분량 커서 v00.202 로 분리.",
  },
  {
    version: "00.200.000",
    date: "2026-05-06",
    datetime: "2026-05-06T16:30:00+09:00",
    summary: "📧 사이트 이메일 단일화 (contact@bgnj.net) — hello/banginoja/dpo 변종 제거",
    details: [
      "📧 [이메일 주소 단일화] 사용자 요청 '홈페이지 붙어있는 이메일 주소 하나로 통일 — 나중에 별도 안내'. 사이트 곳곳의 4종 이메일 (hello@bgnj.net / contact@bgnj.net / banginoja@bgnj.net / dpo@bgnj.net) 을 모두 `contact@bgnj.net` 으로 통일. 추후 사용자가 새 이메일 안내 시 1) data.js:634 contact.email 기본값 + 2) admin 사이트 설정 → 사이트 콘텐츠 → contact.email 두 곳만 수정.",
      "🔁 [수정 위치] index.html JSON-LD email + index.html noscript 안내 + data.js 영수증 운영 문의 + AuthAdminPage 회원가입 placeholder + admin 사이드바 DPO 카드 + 개인정보 패널 DPO/책임자 행 = 6 곳.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.200.000`.",
    ],
    context: "v00.200 마일스톤 — 직전 v00.199 기능정의서 갱신 후 사용자가 식별한 잡음 (이메일 변종) 정리. 다음 사이클은 P1 묶음 (마이페이지 프로필/비번 변경 UI + 답글 트리 + 작성자 프로필 + 본문 검색).",
  },
  {
    version: "00.199.000",
    date: "2026-05-06",
    datetime: "2026-05-06T16:00:00+09:00",
    summary: "📚 기능정의서 최신화 (v00.067 → v00.198 누적 변화 반영) + 홈 텍스트 fontScale 트윅 + 책 노출 필드 선택",
    details: [
      "📚 [기능정의서 전면 갱신] 사용자 요청 'KMS와 관리자페이지 점검해서 기능정의서 항목 최신기준 업데이트'. MISSION_OVERVIEW 5종 + FEATURE_DOMAINS 6종 (infra/community/lecture/column/tour/book) 의 status / evaluation / missing / techSpec / cautions / issues 일괄 갱신. 'localStorage / 외부 DB 전환 필요' 같은 stale 표현 제거 → 'Cloudflare Worker + D1 + R2 풀스택 운영' 으로 재기술. infra features 도 새 기능 (분석 대시보드 / 시스템 로그 4종 / 33 탭 8 그룹 사이드바 / admin lazy-load) 반영.",
      "🔠 [홈 텍스트 fontScale 트윅] 사용자 요청 '홈페이지 설정 트윅으로 글자 크기 소폭 수정'. HomeTextEditorPanel 에 글자 크기 트윅 섹션 추가 — 슬라이더(0.85~1.20, step 0.01) + 5단 quick presets + 1.00 리셋. site_content_kv.homeText.fontScale 로 저장. HomePage 외곽 div 에 fontSize: ${scale}em 적용. 안전 가드 — Math.max(0.85, Math.min(1.20)) 로 범위 강제.",
      "👁 [책 노출 필드 선택] 사용자 요청 '책 어떤 정보들을 노출할지 선택'. site_content_kv.bookFieldVisibility[bookId] 객체 — subtitle / author / publisher / pages / isbn / priceKR / priceEN 7 필드 토글. 미설정 시 모두 노출 (기본 true). BooksAdminPanel meta 탭에 [💾 노출 설정 즉시 저장] 버튼. BookPage 가 visibility 따라 부제 / 메타 행 / 판본 버튼을 조건부 렌더. bookHomeIntros 와 동일한 D1 schema-free 패턴 (kv 객체).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.199.000`.",
    ],
    context: "기능정의서가 v00.067 작성된 후 v00.198 까지 큰 변화 (D1+워커 도입 / 분석 인프라 / 33 탭 / admin lazy-load) 가 반영되지 않아 사용자/AI 가 최신 사이트를 잘못 이해. 이번 사이클이 사용자 요청 받아 그 갭 close. 동시에 사용자 facing 새 기능 2건 (홈 폰트 트윅 + 책 노출 선택) 도 함께 반영.",
  },
  {
    version: "00.198.000",
    date: "2026-05-06",
    datetime: "2026-05-06T15:00:00+09:00",
    summary: "🚀 admin 번들 lazy-load + 워커 CDN 캐시 + HomePage dataTick 분리 (반응성 ↑ + 회귀 0)",
    details: [
      "📦 [admin 번들 lazy-load] 사용자 우선순위 '속도감 ↑ + 기능 회귀 0'. index.html 의 4개 admin 스크립트(AdminShared/AdminContentEditors/AdminDesignHub/AuthAdminPage) 정적 defer 제거. boot.jsx _loadAdminScripts() 가 admin route 진입 시 동적 주입. async=false 로 순서 보존, idempotent (중복 주입 방지), 1회 retry, 로딩 fallback UI. 비-admin 99% 트래픽이 ~3.85MB raw / ~360KB gz 다운/파스/컴파일 회피.",
      "⚡ [워커 list endpoint CDN 캐시] handleBooks/Lectures/Tours/SiteContent/Faqs/Legal/Categories/Grades/Columns 의 GET 응답에 `Cache-Control: public, s-maxage=N, stale-while-revalidate=2N` 헤더. 안전 가드 — _publicCacheable() 가 (1) admin 분기 query (includeAll/includeHidden) 또는 (2) 인증 쿠키(bgnj_session) 있으면 캐시 헤더 부착 안 함 → admin 응답이 public 캐시에 누출 방지. TTL: list 60s, 약관/등급/카테고리 300s.",
      "🎯 [HomePage dataTick 분리] 이전엔 단일 dataTick 으로 columns/tours/lectures/posts 4 stream 변경을 한 state 에 합쳐 어느 한 stream 만 갱신돼도 publicColumns/recentPosts/tours/lectures 4개 useMemo 모두 재실행. 각 stream 별 tick state 분리 → 무관 stream 갱신 시 정렬/필터 재실행 차단. 호환용 dataTick(=합산) 유지 — HeroProgramCards/BookCarouselSection 백워드 호환.",
      "ℹ ★ 워커 wrangler deploy 필요 (CDN 캐시 헤더 적용).",
      "📦 cache-buster — `?v=00.198.000`.",
    ],
    context: "이전 사이클 보류 옵션 A(admin lazy-load) + C(워커 캐시) 모두 진행 + Bonus 1(HomePage dataTick split). 사용자 보고 '속도감 ↑ + 회귀 0' 우선순위 충족 — 모든 변경에 admin/auth 가드 + idempotent + retry. 보류: handlePostsList N+1 (posts 는 admin/draft 분기로 인해 캐시 위험 — 별도 사이클).",
  },
  {
    version: "00.197.000",
    date: "2026-05-06",
    datetime: "2026-05-06T14:00:00+09:00",
    summary: "🌙 다크모드 본문 가독성 + 좌우 정렬 + 작성 시분 표시 (P0 hotfix)",
    details: [
      "🌙 [다크모드 본문 가독성 fix] 사용자 스크린샷 보고 '다크모드에서 글이 안보인다'. root cause: Tiptap 이 본문 HTML 에 inline color (예: #1A1A1A 슬레이트 700) 를 박음 → 다크 배경에서 거의 안 보임. 다크모드일 때 .post-body 와 자식 텍스트 요소 (p/div/li/span/strong/em/h*) 의 color 를 var(--ink) 로 !important override. 링크는 var(--gold), blockquote 는 var(--gold-ink) 유지.",
      "📐 [본문 좌우 정렬 fix] 사용자 보고 '글 좌우 범위 이상'. 이전엔 .post-body 가 margin:0 auto 로 컨테이너 중앙 정렬 → 본문 max-width 68ch 가 제목보다 좁아 좌측이 빈 채로 우측 쏠려 보임. margin:0 으로 좌측 정렬 변경 (제목과 동일 시작점).",
      "🕐 [작성 시분 표시] 사용자 보고 '글 작성 시분까지 보여줘'. CommunityPage 게시글 헤더의 <time> 이 post.date (YYYY.MM.DD) 만 표시하던 것을 createdAt 있으면 BGNJ_FMT.kstShort 로 'YYYY.MM.DD HH:MM' 풀 표시.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.197.000`.",
    ],
    context: "사용자 즉시 보고 3건 P0 hotfix. v00.196 진행 중이던 admin lazy-load (옵션 A) 와 워커 캐시 (옵션 C) 는 이번 사이클 보류 → 다음 사이클에서 재개.",
  },
  {
    version: "00.196.000",
    date: "2026-05-06",
    datetime: "2026-05-06T13:30:00+09:00",
    summary: "📊 등급별 분포 차트 + 검색콘솔 API 입력 패널 + 안정적 성능 개선 (sourcemap off / 폰트 preload / scroll throttle / memo)",
    details: [
      "📊 [회원 등급별 분포 차트] 사용자 요청 '대시보드에 등급별 분포 현황'. allUsers × BGNJ_STORES.grades 매핑 → RankedBarList 재사용 (DRY). 관리자/일반/등급 미부여 분리 카운트 + 헤더에 전체/관리자/일반 요약. 차트 클릭 시 등급 필터 적용은 후속.",
      "🔍 [검색콘솔 API 입력 패널] 사용자 요청 '구글/네이버 등 서치콘솔 + 최신화 가능한 api 입력 페이지'. 신규 SearchConsoleAdminPanel — Google / Naver / Bing / Yandex 검증 meta content 입력 + 사이트맵 URL + Google sitemap ping (no-cors fetch) + 각 콘솔 새창 진입. 저장 시 site_content_kv.searchConsole + applyHead 즉시 <head> 주입. 사이트 설정 SubTabsView 에 '검색엔진' sub-tab 추가.",
      "🚀 [perf B — sourcemap 프로덕션 제거] esbuild 옵션 'sourcemap: inline' → 환경변수 BGNJ_SOURCEMAP=1 시에만 활성화. 비-admin 방문자에게 강제 전송되던 ~3.56MB raw / ~880KB gz 인라인 base64 sourcemap 절감. 안정성 영향 0 (런타임 동작 무관).",
      "🚀 [perf D — 폰트 preload] index.html 에 Google Fonts CSS preload 추가. 발견 단계 1 round-trip 회피.",
      "🚀 [perf E1 — ScrollToTop rAF throttle] 매 scroll tick 마다 querySelector + setVisible 호출하던 hot path 를 requestAnimationFrame 큐잉으로 1프레임당 1회로 제한. 동일 visible 상태면 setVisible skip → 불필요한 commit-phase scheduling 차단.",
      "🚀 [perf E2 — Nav/Footer/CookieConsent/ScrollToTop React.memo] Shell.jsx export 시점에 memo 래핑. App 의 route/user/cart/editMode 변경 시 props 동일하면 re-render skip. 코드 호출 측 변경 없음 (window 글로벌 그대로).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.196.000`.",
    ],
    context: "사용자 원칙 '퀵윈보다 안정적인 형태로 + 기능 회귀 없이' 준수. 5개 perf 옵션(A-E) 중 위험도 높은 admin lazy-load(A) 와 워커 캐시(C) 는 보류. 즉시 효과 + 회귀 위험 0 인 B/D/E 만 적용.",
  },
  {
    version: "00.195.000",
    date: "2026-05-06",
    datetime: "2026-05-06T12:30:00+09:00",
    summary: "🐛 가입자 추이 0인 이슈 root fix + 라벨 모두 표시 (축약 폐기)",
    details: [
      "🐛 [가입자 추이 0 이슈 root fix] 사용자 보고 '가입자 2명인데 추이 차트 0'. v00.194 에서 createdAt→joinedAt 정정 후에도 여전히 비어있던 진짜 원인: AdminPage 의 allUsers memo 가 postRefreshKey 만 의존하는데 BGNJ_AUTH.refreshUsers 가 발화하는 'bgnj-users-refresh' 이벤트는 postRefreshKey 를 증가 안 시킴 → memo 가 빈 _usersCache(초기값) 로 영구 stuck. 해결: AdminPage 마운트 시 refreshUsers 직접 호출 + 5종 store 변경 이벤트(users/posts/columns/books/book-orders) 를 postRefreshKey 로 통합 → 모든 memo 자동 재평가.",
      "📊 [라벨 축약 전면 폐기] 사용자 보고 '임의로 중간에 값들 축약하지마'. (1) _dailySeries: i % 2 === 0 조건 제거 → 모든 일자 라벨. (2) DashboardPanel pvSeries: 7/14/30/90일별 labelEvery 로직 제거 → 모든 일자 라벨. (3) MiniBarChart: labels.length > 14 면 -45° 회전으로 표시 (90일까지 안 겹침).",
      "🔄 [DashboardPanel mount 시 강제 refreshUsers] allUsers stale 진입 방지. 'bgnj-users-refresh' 이벤트 → AdminPage postRefreshKey bump → DashboardPanel allUsers prop 재계산 → signup 차트 갱신.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.195.000`.",
    ],
    context: "v00.194 의 createdAt→joinedAt 정정만으론 부족. 진짜 막힘은 React memo dep 누락. v00.194 까지 차트가 0 으로 보이던 모든 이슈가 이번 release 로 해소.",
  },
  {
    version: "00.194.000",
    date: "2026-05-06",
    datetime: "2026-05-06T11:30:00+09:00",
    summary: "🐛 회원가입 추이 차트 fix + 커뮤니티 게시글 retry/error UI + 시간대별 히트맵 신설",
    details: [
      "🐛 [회원가입 추이 차트 fix] 사용자 보고 '회원가입추이도 정상작동 안하는듯'. root cause: BGNJ_AUTH._usersCache 매퍼(data.js:1248) 가 created_at→joinedAt 으로 노출하지만 차트 코드는 'createdAt' 으로 읽어 모든 row 가 _toDate(undefined)→null 로 필터됨. 결과 모든 막대/숫자 0. DashboardPanel 의 dailySignups/weeklySignups/monthlySignups + signupSeries(line 883-889) 와 dashboardStats memo(line 5674-5676) 모두 'joinedAt' 으로 정정. 타 호출 측은 이미 joinedAt 사용 → 차트 측만 정정.",
      "🔁 [커뮤니티 게시글 retry/error UI] 사용자 보고 '커뮤니티에서 게시글 안 불러진다 + 가끔 홈페이지 기능 작동 안 함'. root cause: BGNJ_COMMUNITY.refreshPosts 의 빈 catch + 재시도 없음 + 워커 cold-start race. (1) data.js: 1회 자동 재시도 (600ms backoff) + 실패 시 _lastError 세트 + 'bgnj-posts-refresh-error' 이벤트. (2) CommunityPage: visibilitychange 시 캐시 비어있으면 재시도 + loadError 배너 + [다시 불러오기] 버튼.",
      "🗓 [시간대별 히트맵] 사용자 요청 '대시보드에 접속 시간에 따른 히트맵'. 24h × 7요일 그리드. 워커 handleAnalyticsSummary 에 heatmap 쿼리 (KST +9h 시프트 후 strftime '%w' / '%H' 그룹). AdminShared.HeatmapGrid 신설 — 셀 hover tooltip + 범례 + max 대비 alpha 그라데이션. CohortSelector 로 7~90일 코호트.",
      "ℹ ★ 워커 wrangler deploy 필요 (heatmap 쿼리 + heatmapDays 파라미터).",
      "📦 cache-buster — `?v=00.194.000`.",
    ],
    context: "v00.193 backlog 3건 동시 처리. 사용자 보고 회원가입 차트 0 + 게시글 안 불러짐 둘 다 root cause 식별 후 정정 (필드명 mismatch + silent fail). 히트맵은 신규 시각화 — 워커 1회 deploy 후 schema-v9 page_views 가 충분히 누적되면 자연스럽게 색 분포 나타남.",
  },
  {
    version: "00.193.000",
    date: "2026-05-06",
    datetime: "2026-05-06T10:05:00+09:00",
    summary: "📚 새 책 prompt 제거 → 임시 draft + 저장 분기 / ▲▼ misalign 박스 그룹 / 모든 사이트 설정 메뉴 미리보기",
    details: [
      "📚 [BooksAdminPanel — 새 책 추가 흐름 재설계] 사용자 보고 '새 책 추가 버튼 누르면 그냥 새 책 만들어주고 저장 누르면 반영'. window.prompt 제거 + 클라이언트 newDraft state ('__new__' id) 만 만들고 우측 form 즉시 오픈. [💾 새 책 저장] 클릭 시 commit 분기에서 BGNJ_BOOKS.create 호출 → 신규 ID 받아 selectedId 교체. 새 책 미저장 상태에서 [새 책 취소] 버튼으로 폐기 가능.",
      "🎨 [draft 시각 강조] 좌측 리스트에 newDraft 행은 골드 좌측 보더 + 골드 배경 + '● 새 책 (미저장)' 뱃지. ＋ 새 책 버튼은 draft 진행 중일 때 disabled + 라벨 변경.",
      "🧮 [▲▼ 정렬 misalign 박스 그룹] 사용자 보고 '메뉴 일부 틀어진거같다'. 정렬 버튼을 1px solid 박스로 묶어 행 소속을 시각적으로 명확화. realBooks 인덱스로 정렬 비활성 판단 (draft 행은 정렬 대상 제외 — visibility:hidden 으로 자리 유지).",
      "🖥 [사이트 설정 — 모든 메뉴 미리보기] 사용자 보고 '실시간 미리보기 모든 메뉴들에서 있게'. home / hero / bank 에 previewUrl 추가 (각각 '/', '/', '/faq'). 이전 home/hero 는 자체 임베드 미리보기 보유로 previewUrl 미지정이었으나, 사용자 일관성 요청에 맞춰 SubTabsView iframe 통일.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.193.000`.",
    ],
    context: "v00.192 backlog 중 책 흐름 + ▲▼ 정렬 + 모든 메뉴 미리보기 처리. 남은 backlog: 커뮤니티 게시글 안 불러짐 / 회원가입 추이 차트 / 히트맵 신설.",
  },
  {
    version: "00.192.000",
    date: "2026-05-06",
    datetime: "2026-05-06T09:23:59+09:00",
    summary: "🐛 시간 라벨 매시 (pvSeries 별도 로직) + 사이드바 버전 뱃지",
    details: [
      "🐛 [pvSeries 시간 라벨 fix] 사용자 보고 '시간 라벨도 중간에 생략'. v00.191 에서 _hourlySeries 만 fix 했으나 DashboardPanel pvSeries 안에 별도 inline 라벨 로직이 있었음 (i % 3 === 0 잔존). 같은 매시 라벨로 정리 — 24개 모두 (10시/11시/12시.../지금).",
      "🪧 [사이드바 버전 뱃지] 사용자 보고 '사이드바 제일 위쪽에 현재 홈페이지 버전'. ADMIN CONSOLE 위에 v{version} · {build} 골드 뱃지. window.BGNJ_VERSION 직접 참조.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.192.000`.",
    ],
    context: "사용자 즉시 보고 2건 처리. iframe 가로(v00.191에서 width 100% 적용 됐으나 homepage 컨테이너 max-width 1200px 가 시각 폭 제한 — admin-main 이 1500px 여도 iframe 안 homepage 는 1200px centered). 다음 사이클 backlog: 책 추가 prompt 제거 / ▲▼ 정렬 / 커뮤니티 게시글 / 회원가입 추이 / 히트맵.",
  },
  {
    version: "00.191.000",
    date: "2026-05-06",
    datetime: "2026-05-06T09:17:59+09:00",
    summary: "📣 알람 그룹 선택 + PC 미리보기 가로 확장 + 시간 라벨 매시 표시",
    details: [
      "📣 [알람 — 그룹 단위 재설계] 사용자 보고 '특정 사용자 개인보다 그룹이 합리적'. 4 그룹 라디오 (전체 관리자 / 전체 회원 / 일반 회원만 / 특정 등급) + 등급 선택 시 등급 dropdown. 발송 버튼에 '(N명 예정)' 카운트 표시.",
      "📣 [워커 recipients 확장] handleInternalAlarmSend 가 'all_admins' / 'all_members' / 'all_non_admins' / {grade:'id'} / userId[] 모두 지원. 응답에 group label 포함 → audit log 도 그룹 라벨 기록.",
      "🖥 [사이트 설정 PC 미리보기 가로 확장] 사용자 보고 '좌우 최대 비율로'. desktop 모드 시 iframe width: 100% + height: 70vh. 모바일/태블릿은 viewport 폭 고정 유지. maxHeight 60vh → 70vh.",
      "⏰ [시간 라벨 매시 표시] 사용자 보고 '임시로 라벨 빼고 요약하지 말고 모든 시간에 라벨'. _hourlySeries 의 i % 3 === 0 조건 제거 → 24시간 모두 라벨 (0시 1시 2시 ... 23시 / 지금).",
      "ℹ ★ 워커 wrangler deploy 필요 (recipients 그룹 확장).",
      "📦 cache-buster — `?v=00.191.000`.",
    ],
    context: "사용자 다발 보고 동시 처리. 이번 사이클 핵심: 알람 그룹 + iframe 가로 + 시간 라벨. 다른 in-flight 보고 (커뮤니티 게시글 안 불러짐 / 새 책 prompt 제거 / 책 ▲▼ 정렬 / 회원가입 추이 / 히트맵) 은 후속 사이클.",
  },
  {
    version: "00.190.000",
    date: "2026-05-06",
    datetime: "2026-05-06T08:59:28+09:00",
    summary: "🪵 통합 활동 로그 패널 — 관리자+회원 활동 + 검색/필터/정렬",
    details: [
      "🪵 [활동 로그 패널 신설] 사용자 보고 '시스템 메뉴 아래 활동 로그 — 관리자+일반회원 모든 활동 기록 통합 / 트러블슈팅용'. 사이드바 시스템 그룹에 [활동 로그] 항목 추가.",
      "🪵 [통합 데이터 소스 3종] ① audit_log (관리자 행동 + 회원가입) ② error_log (오류 보고) ③ 최근 게시글 (BGNJ_COMMUNITY 캐시). 시간 역순 머지 → 단일 테이블.",
      "🪵 [유형 분류 8종] 관리자 / 회원가입 / 등급 / 카테고리 / 콘텐츠 / 알람 / 게시글 / 오류. 각 유형별 색상 + 카운트 칩.",
      "🔎 [검색] 사용자 보고 추가 '필터+정렬+검색 꼭 넣어줘'. 통합 검색 input — 주체/액션/대상/상세/IP 부분 일치.",
      "📅 [기간 필터] 시작일 / 종료일 (KST 기준). 트러블슈팅 시 사고 직전 시간대 좁히기 가능.",
      "↕ [정렬 4종] 최신순↓(default) / 오래된순↑ / 주체(가나다) / 유형순. select 드롭다운.",
      "⚡ [필터 적용 표시] 필터 활성 시 'N건 (전체 M)' 카운트 + ✕ 초기화 버튼.",
      "📱 [모바일 반응형] activity-filter-row ≤900px 시 4열 grid → 1열 stack.",
      "🔝 [상위 500건 표시] 더 오래된 기록은 [감사 로그] / [오류 로그] 별도 패널 안내.",
      "ℹ 워커 미변경 (기존 audit/errorLog endpoint 재활용).",
      "📦 cache-buster — `?v=00.190.000`.",
    ],
    context: "사용자 강한 요구 — 트러블슈팅 시 '뭐가 안되면 원인 파악' 필요. v00.189 audit 보강 직후 통합 뷰 신설. 데이터 소스 3종을 한 화면에 시간 역순 표시 + 검색/기간/정렬/유형 필터 4종 도구로 좁힘. 회원가입(audit) / 오류 보고 / 회원 게시글 작성 등 시간순으로 추적 가능.",
  },
  {
    version: "00.189.000",
    date: "2026-05-06",
    datetime: "2026-05-06T08:48:39+09:00",
    summary: "🐛 등급 이름 초기화 fix + audit 로그 보강 (signup/grade/category/alarm) + 오류로그 점검",
    details: [
      "🐛 [등급 이름 초기화 root cause] 사용자 강한 보고 (반복) '등급 이름 자꾸 초기화'. AdminGradePanel mount 시 BGNJ_STORES.grades 가 boot async fetch 완료 전 stale 일 가능성 → 사용자가 default 위에 편집 → 저장 → D1 default 로 덮어써서 '초기화' 인상.",
      "🐛 [fix 1] AdminGradePanel mount useEffect 에서 BGNJ_API.grades.list() 직접 호출 → BGNJ_STORES + 로컬 state 동기 갱신. dirty 면 사용자 편집 보호 (덮어쓰기 차단).",
      "🐛 [fix 2] commitAll 의 silent error 가시성 강화. PUT 실패 시 alert 로 즉시 알림 + setDirty(false) 차단 → 사용자가 즉시 재시도 가능. 이전엔 saveMsg ⚠ 만 → 사용자 못 보고 새로고침 → D1 default 로 덮어써서 반복 '초기화'.",
      "🪵 [audit 로그 보강] 사용자 보고 '관리자 페이지 활동 로그 — 이름 수정이든 회원가입이든 모든 기록이 로그로'. 워커 핸들러 5개 신규 audit:",
      "  · user.signup (handleAuthSignup) — 회원가입 자동 기록",
      "  · grade.upsert / grade.remove",
      "  · category.create / category.update / category.remove",
      "  · alarm.send (internal-alarm broadcast)",
      "  기존 lecture/tour create/update/remove + admin.user_update/delete 와 함께 admin → 감사 로그 패널에서 모두 조회 가능.",
      "🔍 [오류 로그 점검 결과] 정상 동작 확인:",
      "  · POST /api/error-log (anonymous OK) → 201",
      "  · GET /api/admin/error-log → 401 (auth 정상)",
      "  · AppErrorBoundary + GlobalErrorToast → BGNJ_API.errorLog.report 자동 호출",
      "  · admin → 오류 로그 패널에서 누적 조회 가능",
      "ℹ ★ 워커 wrangler deploy 필요 (audit 추가 + signup audit).",
      "📦 cache-buster — `?v=00.189.000`.",
    ],
    context: "사용자 분노 — 등급 이름 반복 초기화. v00.170 + v00.181 fix 후에도 재발. 이번엔 mount 시 D1 강제 fetch + 실패 시 alert 로 visibility 확보. 더불어 활동 로그 보강 (signup 등 누락 핸들러) + 오류 로그 인프라 동작 확인.",
  },
  {
    version: "00.188.000",
    date: "2026-05-05",
    datetime: "2026-05-05T23:32:58+09:00",
    summary: "♿ a11y audit — ColumnPage 키보드 nav + BookPage h1 위계 + 타이포 audit",
    details: [
      "♿ [a11y audit pass] 4 항목 점검: ① icon-only 버튼 aria-label / ② onClick div 키보드 접근 / ③ 페이지당 1 h1 룰 / ④ 타이포 위계.",
      "♿ [ColumnPage prev/next 키보드 접근] 이전/다음 칼럼 nav <div onClick> 에 role='button' tabIndex={0} aria-label onKeyDown(Enter/Space) 추가. 키보드만으로도 칼럼 이동 가능.",
      "♿ [BookPage h1 위계 fix] 같은 페이지에 h1 2개 (hero + 책 제목) → 책 제목을 h2 로. 페이지당 1 h1 룰 준수.",
      "♿ [audit 결과 — 통과] icon button aria-label: 대부분 OK (텍스트 있거나 명시 aria-label). 모달 useModalGuard: 통과 (v00.184 audit). 옐로우 면적: 통과 (작은 영역만).",
      "♿ [audit 결과 — 후속 후보] BookCheckoutPage 의 4 추가 h1 (gate / empty / success 페이지) — 모두 다른 render 분기라 OK. 각 분기별 1 h1 ✓. 모달 inner div onClick stopPropagation: 진짜 인터랙션 아님 — 키보드 접근 불필요.",
      "📋 [타이포 위계 일관성] section-title 클래스가 h1 (BookPage hero, ColumnPage hero) / h2 (모듈) / h3 (서브섹션) 으로 사용. CSS 클래스가 위계 정의해 일관 — 추가 작업 불필요.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.188.000`.",
    ],
    context: "코드 리뷰 cycle 9 — a11y + 타이포 audit. 명확한 a11y 위반 2건 fix. icon-only 버튼 aria-label 은 grep 으로 큰 위반 없음 확인 (이모지+텍스트 조합 다수). 타이포 위계는 .section-title CSS 클래스 일관성으로 OK. 다음: 워커 deploy 안내.",
  },
  {
    version: "00.187.000",
    date: "2026-05-05",
    datetime: "2026-05-05T23:30:24+09:00",
    summary: "📦 AuthAdminPage 분할 — AdminShared.jsx 신규 (-759줄)",
    details: [
      "📦 [AdminShared.jsx 신규] AuthAdminPage.jsx 9057 → 8298 줄 (-759). self-contained UI primitives + helpers 모음 별 파일.",
      "📦 [이동 항목 8종] downloadBlob/Csv/Json (helpers) / pickImageWithR2Fallback / MiniBarChart / RankedBarList / COHORT_OPTIONS+CohortSelector / Sankey 5종(_CHANNEL_FOR_HOST/_STAGE_FOR_ROUTE/_CHANNEL_COLORS/_CHANNEL_COLOR/SankeyFlow) / SubTabsView. 모두 React/window.* 의존만 — 패널 비즈니스 로직 0.",
      "📦 [노출 패턴] Object.assign(window, {...}) 으로 expose. AuthAdminPage 가 const X = window.X 로 alias (기존 AdminDesignHub/ContentEditors 패턴 동일).",
      "📦 [index.html 로드 순서] AdminShared.js 가 AuthAdminPage.js 보다 먼저 로드 (defer + DOM 순서 보장).",
      "📦 [build.mjs 자동 빌드] esbuild 가 18개 파일 컴파일 (이전 17). 수동 변경 없음.",
      "📦 [large_file 경고 유지] AuthAdminPage 8298 줄로 8000 임계 초과 — 다음 분할 후보: 패널 단위 (LectureAdminPanel / TourAdminPanel / BooksAdminPanel 등).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.187.000`.",
    ],
    context: "코드 리뷰 cycle 8 — 파일 분할 1차. v00.184~186 의 DRY 추출들이 self-contained 컴포넌트라 분할 가능. 1단계: 외부 의존 0인 UI primitives 8종 일괄 이동. 2단계 (별 사이클): 각 admin 패널 (LectureAdminPanel 등) 별 파일 분할 — closure 변수 의존 많아 큰 작업.",
  },
  {
    version: "00.186.000",
    date: "2026-05-05",
    datetime: "2026-05-05T23:07:41+09:00",
    summary: "🧹 legacy local 4 항목 dead store 제거 — BGNJ_STORES/SAVE 정리",
    details: [
      "🧹 [legacy 4 dead store 식별] v00.181 audit 에서 ⚠ 표기했던 bookOrders/bookReviews/tourReviews/lectureReviews 4 항목 — 실제로 D1-backed 임을 검증. BGNJ_BOOK_ORDERS._orders / BGNJ_BOOKS._reviews / BGNJ_TOURS._reviews / BGNJ_LECTURES._reviews 가 모두 BGNJ_API 로 D1 fetch.",
      "🧹 [BGNJ_STORES 정리] 4 dead 슬롯 (`bookOrders`, `bookReviews`, `tourReviews`, `lectureReviews`) 제거 — 코드 어디서도 읽기/쓰기 0건 확인 (grep).",
      "🧹 [BGNJ_SAVE 정리] 동일 4 항목 BGNJ_SAVE.* writeback 함수 제거. 호출처 0건.",
      "🧹 [purgeLegacyStorage 영향 X] 옛 키들은 이미 PURGE 리스트에 포함되어 boot 마다 cleanup. 마이그 잔재 정리 완료.",
      "📋 [audit 결과] CONTEXT.md §2.9 BGNJ_STORES 4-태그 분류: ⚠ legacy 4 → 0 (모두 server-backed 으로 정정).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.186.000`.",
    ],
    context: "코드 리뷰 cycle 7 — server-first audit 추가 정리. 이전 v00.181 에서 'legacy local 4 항목 마이그 후보' 로 표기한 것을 자세히 보니 모두 D1 backed. 단지 옛 BGNJ_STORES 슬롯이 dead 코드로 남아 있던 것. 4 항목 dead store 제거로 코드 정합성 회복. 다음: AuthAdminPage 분할 등.",
  },
  {
    version: "00.185.000",
    date: "2026-05-05",
    datetime: "2026-05-05T23:04:58+09:00",
    summary: "♻ 이미지 업로드 DRY 완료 — book-covers/pdf + ImageUploader 모두 헬퍼로",
    details: [
      "♻ [book covers/PDFs 마이그] BooksAdminPanel.onUploadCover(25줄) + onUploadPdf(25줄) → pickImageWithR2Fallback 헬퍼 호출 8줄. uploadingCover/Pdf state + flash 메시지 보존.",
      "♻ [ImageUploader 마이그] SiteContentAdminPanel 의 ImageUploader 컴포넌트 onPick(25줄) → 헬퍼 호출 6줄.",
      "♻ [라인 절감 누적] v00.184(lecture/tour) + v00.185(book/site) = 100+ 줄 → 30 줄. AuthAdminPage 9109 → 9057 (-52).",
      "♻ [BGNJ_MEDIA.uploadFile 직접 호출 잔여] 헬퍼 자체(line 5511) + 칼럼 cover(line 8690) 2건. 칼럼 cover 는 동적 input.click() 패턴이라 보존.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.185.000`.",
    ],
    context: "코드 리뷰 cycle 6/N (DRY pass 3). 이미지 업로드 패턴 4 케이스 모두 통합 완료. 일관 동작 (사이즈 한도/에러 메시지). 다음: legacy local 4 항목 D1 마이그 또는 AuthAdminPage 분할.",
  },
  {
    version: "00.184.000",
    date: "2026-05-05",
    datetime: "2026-05-05T22:56:54+09:00",
    summary: "♻ pickImageWithR2Fallback DRY + 디자인 룰 audit + 멤버 카드 모바일 폴백",
    details: [
      "♻ [pickImageWithR2Fallback 헬퍼 신설] R2 업로드 시도 + 실패 시 dataURI 폴백 패턴 (각 25 lines, 4+ 패널 동일) → 1 헬퍼. lecture/tour 커버에 적용 (2/4). book-covers/book-pdfs 는 추가 state 의존 — v00.185 별도 마이그.",
      "♻ [25 lines × 2 → 4 lines × 2] 라인 절감 + 일관 동작 (사이즈 한도/에러 메시지 통일).",
      "🎨 [디자인 룰 audit 결과] 룰별 점검:",
      "  ✅ 옐로우 면적 §2.4 — Shell.jsx 알림 뱃지(14px) / styles.css dot/line(4-24px) / ErrorPages CTA(인터랙션) 모두 작은 영역 ✓",
      "  ✅ useModalGuard §3 — 모든 모달 파일에서 dialog ≤ guard count 확인 (AuthAdminPage 5/7, CommunityPage 1/3 등)",
      "  ⚠ 모바일 1열 §2.5 위반 후보 — WangsanamTourPage 멤버 카드 (200px 1fr auto) 모바일 대응 안 됨 → 본 사이클 fix",
      "  ℹ AdminCategoryPanel/AdminDesignHub 의 인라인 grid 들은 admin 한정 + 저빈도 — 후속 사이클",
      "🎨 [WangsanamTourPage 멤버 카드 모바일] .wsm-member-card 클래스 추가 + @media ≤900px 에서 1열 stack + placeholder 200px center.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.184.000`.",
    ],
    context: "사용자 보고 '디자인 규칙 깨진거 있나 확인'. 옐로우 면적·모달 가드 OK. 모바일 1열 정책 1건 발견(WSM 멤버) 즉시 fix. 다음 작업으로 이미지 업로드 DRY 추출 동시 진행. cycle 5/N — DRY 추출 추가 + 디자인 audit 결과 정리.",
  },
  {
    version: "00.183.000",
    date: "2026-05-05",
    datetime: "2026-05-05T22:41:43+09:00",
    summary: "📣 내부 인원 알람 기능 — admin → admin/특정 사용자 broadcast",
    details: [
      "📣 [InternalAlarmPanel 신규] 사용자 보고 '내부 인원들에게 알람을 보낼 수 있는 기능'. 시스템 그룹에 [내부 알람] 항목 추가. 폼: 수신 범위(전체 관리자 / 특정 사용자 다중 선택) + 본인 제외 토글 + 제목(선택) + 메시지 + 발송.",
      "📣 [server-first] D1 notifications 테이블에 type='internal_alarm' 으로 저장. 수신자별 row 1개씩 INSERT. 사용자 룰 (모든 데이터 서버 저장) 준수.",
      "📣 [워커 POST /api/admin/internal-alarm] handleInternalAlarmSend 핸들러 신규. recipients='all_admins' 또는 userId 배열. excludeSelf 옵션. 본인은 기본 제외.",
      "📣 [API 헬퍼] BGNJ_API.internalAlarm.send({ recipients, title, message, excludeSelf }) 신규.",
      "📣 [수신 경로] 기존 NotificationBell (헤더 🔔) 이 D1 notifications 를 읽으므로 자동 표시. 별도 클라이언트 코드 변경 없이 바로 동작.",
      "📣 [admin 사용자 picker] 회원 목록 조회 (BGNJ_API.admin.users.list) → admin 우선 정렬 + 일반 회원 포함. 이름/이메일 표시 + ADMIN 뱃지.",
      "ℹ ★ 워커 wrangler deploy 필요 (handleInternalAlarmSend 신규 endpoint).",
      "📦 cache-buster — `?v=00.183.000`.",
    ],
    context: "사용자 요청 큐 누적 — 코드 리뷰 사전 정리(v00.178-181) + DRY 추출(v00.182) 완료 후 본 사이클에서 알람 기능 구현. 기존 notifications 인프라 (D1 + NotificationBell) 재활용 — DRY 원칙. 새 컴포넌트 InternalAlarmPanel 1개만 추가.",
  },
  {
    version: "00.182.000",
    date: "2026-05-05",
    datetime: "2026-05-05T22:37:41+09:00",
    summary: "♻ 코드 리뷰 pass 1 — downloadBlob/Csv/Json 헬퍼 추출 (DRY)",
    details: [
      "♻ [downloadBlob/Csv/Json 헬퍼] 6개 admin 패널 (BookOrder/Audit/Member/Community/MemberData/VersionHistory) 에서 동일한 8-line 패턴 (Blob → URL → a.click → revoke) 중복 → 모듈 스코프 helper 3개로 추출.",
      "♻ [호출처 6 → 1줄 단축] 각 export 함수가 8줄 → 1줄 (downloadCsv/downloadJson 호출).",
      "♻ [에러 핸들링 통합] 다운로드 실패 시 alert. 이전엔 일부 호출처만 try/catch.",
      "♻ [컴포넌트 변경 사항] BookOrderAdminPanel.downloadCsv → handleExportCsv 이름 변경 (모듈 헬퍼와 충돌 회피).",
      "📋 [코드 리뷰 진행] cycle 1/N — DRY 추출. 다음 cycle 후보: AdminPanelHeader 일관성 / 카드형 form CSS DRY / image upload 핸들러 통합 / 페이지네이션 컴포넌트 추출.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.182.000`.",
    ],
    context: "사용자 보고 코드 리뷰 두 축 (DRY + server-first) 의 1번 본격 시작. downloadBlob 패턴은 가장 명확한 DRY 위반 — 6 호출처 모두 동일 8 lines. 헬퍼 추출 후 호출 1 줄로. 추가 DRY 후보 식별 (next cycle).",
  },
  {
    version: "00.181.000",
    date: "2026-05-05",
    datetime: "2026-05-05T22:30:24+09:00",
    summary: "🔍 localStorage audit + AdminGradePanel.resetAll D1 반영 fix",
    details: [
      "🔍 [BGNJ_SAVE.* 25 호출처 audit] 모두 BGNJ_API.* D1 호출 직후 cache writeback 패턴 확인. 단일 violation: AdminGradePanel.resetAll 이 D1 미반영 → 새로고침 시 D1 default 가 다시 덮어써서 reset 효과 0.",
      "🐛 [resetAll fix] BGNJ_SAVE.resetGrades() 후 default 각 grade 를 BGNJ_API.grades.upsert 로 D1 PUT. 이제 진짜 reset (D1 + localStorage 모두).",
      "📋 [data.js BGNJ_SAVE 정의에 audit 코멘트] 19 항목별 server 매핑 상태 명시 — ✅ D1-backed (13) / 💾 의도적 local (2) / ⚠ legacy local (4 — 향후 마이그 후보).",
      "🎯 [server-first 룰 검증] 사용자 룰 'localStorage 단독 저장 금지' 위반 0 확인 (resetAll fix 후). 현재 모든 admin 편집은 D1 PATCH/PUT/DELETE 후 localStorage 캐시 동기화.",
      "📌 [legacy 4 항목] bookOrders / bookReviews / tourReviews / lectureReviews — D1 테이블 존재하나 일부 기능이 BGNJ_BOOK_ORDERS / BGNJ_BOOKS 등 다른 helper 경유. 코드 리뷰 시 점검 후보로 명기.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.181.000`.",
    ],
    context: "코드 리뷰 사전 정리 cycle 4/4 (B항: server-first audit). 본 사이클 후 전체 코드 리뷰 + 내부 인원 알람 기능. localStorage 직접 호출은 모두 CONTEXT.md §2.9 sanctioned (cart/route/migration markers/purge signal). BGNJ_SAVE 25 callers 모두 D1 동반 확인.",
  },
  {
    version: "00.180.000",
    date: "2026-05-05",
    datetime: "2026-05-05T22:26:42+09:00",
    summary: "♻ CommunityPostsAdminPanel 추출 (DRY) — AdminPage 정리",
    details: [
      "♻ [컴포넌트 추출] '커뮤니티 → 게시글' sub-tab 의 인라인 JSX (130줄+) 를 별도 컴포넌트로 추출. 자체 state(검색/필터/선택/일괄/모달) + 핸들러(export/delete/bulkRemove/bulkMove/bulkApplyPrefix) 모두 내장.",
      "♻ [AdminPage 정리] 6개 state(postSearch/postFilter/selectedPostIds/viewingPostId/bulkTargetCat/bulkTargetPrefix) + 5개 핸들러(exportCommunityPosts/deleteCommunityPost/bulkDeletePosts/bulkMovePosts/bulkSetPrefix) + 1개 useMemo(visibleCommunityPosts) AdminPage 에서 제거. 'allCommunityPosts' 만 props 로 전달.",
      "♻ [onChange 콜백] 부모 AdminPage 의 setPostRefreshKey 를 onChange 로만 노출 — 게시글 변경 시 전체 트리(대시보드 통계 등) 갱신.",
      "♻ [라인 수 감소] 추출 후 인라인 JSX 130줄 → 컴포넌트 호출 4줄 (-126줄 in AdminPage). 단 컴포넌트 자체는 +220줄. 총 라인 늘었으나 관심사 분리 + 향후 컴포넌트 단위 테스트/추가 가능.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.180.000`.",
    ],
    context: "코드 리뷰 사전 정리 cycle 3/4 (C항: DRY 추출). 사용자 룰 1번 (동일 기능 재활용) 의 직접 적용. AdminPage 에 갇혀 있던 게시글 관리 도메인 로직을 독립 컴포넌트로 빼서 가독성/재사용성 확보. 다음 cycle 4 (v00.181) localStorage 풀 audit 후 전체 코드 리뷰.",
  },
  {
    version: "00.179.000",
    date: "2026-05-05",
    datetime: "2026-05-05T22:23:02+09:00",
    summary: "📊 RankedBarList 공통 컴포넌트(DRY) + 유입경로/인기페이지 hover+cohort",
    details: [
      "📊 [RankedBarList 공통 컴포넌트] 유입 경로 + 인기 페이지가 동일한 ranked horizontal bar 패턴이라 별도 작성된 것을 1 컴포넌트로 통합. items=[{label, count, color?}], unit, valueFormat, headerLeft/Right 슬롯. 호버 시 다른 항목 opacity 0.4 dim + 호버 항목 강조.",
      "📊 [유입 경로 cohort] 별도 refDays state. 7/14/30/90일 토글 + 🔄 새로고침 버튼.",
      "📊 [인기 페이지 cohort] 별도 routeDays state. 7/14/30/90일 토글.",
      "📊 [워커 ?refDays= ?routeDays= 지원] handleAnalyticsSummary 가 두 파라미터 추가. 미지정 시 30/7 기본. ★ 워커 deploy 필요.",
      "📊 [API 헬퍼 확장] BGNJ_API.analytics.summary({ days, refDays, routeDays }). 한 호출로 3 코호트 모두 갱신.",
      "🛠 [DRY 사전 정리] 사용자 코드 리뷰 두 축 중 1번 (동일 기능 재활용) 의 조기 적용 — 이 컴포넌트 패턴이 향후 다른 ranked-list 패널 (회원 정렬, 책 매출 순위 등) 에서도 재사용 가능.",
      "ℹ ★ 워커 wrangler deploy 필요.",
      "📦 cache-buster — `?v=00.179.000`.",
    ],
    context: "코드 리뷰 사전 정리 cycle 2/4 (D항). DRY 원칙 사전 적용 — 같은 visual pattern 을 한 컴포넌트로 묶어 hover+cohort 일관 보장. v00.180 게시글 패널 추출, v00.181 localStorage audit 후 전체 코드 리뷰.",
  },
  {
    version: "00.178.000",
    date: "2026-05-05",
    datetime: "2026-05-05T22:19:50+09:00",
    summary: "🧹 사용자 여정 죽은 코드 완전 제거 (-175줄)",
    details: [
      "🧹 [UserJourneyPanel 단순화] v00.176 에서 회원 목록/타임라인을 display:none 으로 hide → 본 사이클에서 죽은 JSX 약 115줄 + 관련 unused state(selectedId/serverEvents/journeyLoading/journeyError) + useEffect 2개 + useMemo 2개(timeline/cohorts) 모두 삭제. props 도 (users/posts/setTab) → () 로 단순화.",
      "🧹 [호출 사이트 정리] tab === '사용자 여정' && <UserJourneyPanel/> 로 props 제거. AdminPage 가 더 이상 allUsers/allCommunityPosts 를 이 컴포넌트에 전달 안 함.",
      "🧹 [AuthAdminPage 라인 수] 9058 → 8883 (-175). large_file 경고 유지(분할 권장 후속 사이클).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.178.000`.",
    ],
    context: "코드 리뷰 사전 정리 cycle 1/4 (A항). v00.179: 다른 차트/리스트 hover+cohort 확장 / v00.180: CommunityPostsAdminPanel 추출 (DRY) / v00.181: localStorage→server 풀 audit (server-first). 그 후 전체 코드 리뷰 + 내부 인원 알람 기능.",
  },
  {
    version: "00.177.000",
    date: "2026-05-05",
    datetime: "2026-05-05T22:14:08+09:00",
    summary: "🔗 커뮤니티 통합 — 게시글/게시판/신고 단일 sub-tab",
    details: [
      "🔗 [커뮤니티 sub-tab 통합] 사용자 보고 '커뮤니티게시판이랑 커뮤니티랑 기능 겹쳐 매우 불편'. 사이드바 3 항목(커뮤니티/커뮤니티 게시판/신고) → 1 항목(커뮤니티) + SubTabsView 내부 sub-tab 3개(게시글/게시판/신고).",
      "🔗 [라우팅 정리] tab === '커뮤니티 게시판' / tab === '신고' 별도 라우트 폐기. 모두 '커뮤니티' SubTabsView 의 render 함수 안으로 이동. localStorage(bgnj_admin_subtab_community) 마지막 sub-tab 복원.",
      "🔗 [기능 100% 보존] CommunityBoardsPanel(테이블+DnD), CorruptedBodyInspector, ReportQueuePanel 모두 그대로. 게시글 인라인 JSX 도 closure 변수(allCommunityPosts, postSearch 등) 모두 정상 작동.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.177.000`.",
    ],
    context: "v00.176 까지 사이드바 3 항목 임시 유지하던 것을 본 사이클에 통합. 같은 SubTabsView 패턴(사이트 설정 v00.166, 후 v00.176 preview top 레이아웃) 재사용. 사용자 흐름: 커뮤니티 클릭 → 기본 게시글 노출 → 게시판/신고 sub-tab 으로 이동. 사이드바 항목 수 -2.",
  },
  {
    version: "00.176.000",
    date: "2026-05-05",
    datetime: "2026-05-05T22:12:04+09:00",
    summary: "🐛 게시글 수정 버튼 fix + 1일 코호트 + 사이트 설정 미리보기 위로 + 사용자 여정 단순화",
    details: [
      "🐛 [수정 버튼 미반응 fix] 사용자 보고 '수정 버튼을 눌러도 반응을 안하네'. 원인: `if (postId) return <PostDetail/>` early-return 안에 PostComposeModal 이 없어서 setWriting(post) 호출돼도 모달 미렌더. fix: postId 분기에서 fragment 로 <PostDetail/> + {writing && <PostComposeModal/>} 함께 렌더.",
      "📊 [1일 코호트 + 시간 단위] 사용자 보고 '페이지뷰/방문자 추이 1일 단위도 활성화 + 1일 단위면 시간 단위로 1시간 단위로'. CohortSelector 에 '1일' 옵션 추가 (value=1). days=1 시 차트가 24개 막대 시간 라벨 (0~23시 + 지금). _hourlySeries 헬퍼 신설 (_dailySeries 와 시그니처 동일).",
      "📊 [워커 hourlySeries] /api/analytics/summary?days=1 → hourlySeries: [{hour, views, uniq}] (24시간 1시간 단위) 응답에 추가. ★ 워커 deploy 필요.",
      "🌊 [사용자 여정 단순화] 사용자 보고 '사용자 여정에 회원 단위로 보여질 필요 없어. 그냥 전체적으로 보이면 됨'. 회원 목록 + 타임라인 영역 display:none 으로 hide (Sankey 흐름도만 노출). 죽은 JSX 제거는 v00.177.",
      "🛠 [사이트 설정 SubTabsView 레이아웃] 사용자 보고 '미리보기 위로 올리고 서브 탭은 미리보기 밑에서 바뀌면서 관리'. previewUrl 있을 때 preview iframe 을 화면 상단으로, sub-tab strip + 콘텐츠 를 아래로. preview 높이 600px (이전 760px) 로 컴팩트.",
      "🔄 [커뮤니티 통합] v00.177 별 사이클 — 게시글/게시판/신고 sub-tab 머지는 분량 커서 분리. 본 사이클 임시로 사이드바 3 항목(커뮤니티/커뮤니티 게시판/신고) 유지.",
      "ℹ ★ 워커 wrangler deploy 필요 (hourlySeries 응답).",
      "📦 cache-buster — `?v=00.176.000`.",
    ],
    context: "여러 보고 동시 처리: 게시글 수정 버튼 (긴급 — 데이터 손상 글 복구 경로 필요), 1일 코호트, 사이트 설정 레이아웃, 사용자 여정 단순화. 커뮤니티 통합은 다음 사이클.",
  },
  {
    version: "00.175.000",
    date: "2026-05-05",
    datetime: "2026-05-05T22:02:03+09:00",
    summary: "🗂 커뮤니티 게시판 테이블 + 드래그앤드롭 + 카테고리 머지",
    details: [
      "🗂 [테이블 레이아웃] 사용자 보고 '커뮤니티 게시판 목록은 리스트형(테이블형)으로 보여주고 드래그앤드랍으로 순서 쉽게 변경'. 카드 그리드 → 6열 테이블 (≡핸들/ID/이름·설명/글수/권한요약/액션).",
      "🗂 [HTML5 드래그앤드롭] draggable=true (notice 제외) + onDragStart/Over/Drop. 드롭 시 즉시 BGNJ_API.categories.update 일괄 PATCH (display_order). 드래그 중 행 opacity 0.5, 드롭 위치 행 상단 yellow border. notice 는 fixed (드래그 차단).",
      "🗂 [카테고리 머지] 사용자 보고 '커뮤니티 게시판하고 카테고리하고 기능이 같은거 같은데 합쳐'. 사이드바 [카테고리] 항목 폐기. AdminCategoryPanel 의 권한·등급·prefix 기능을 CommunityBoardsPanel 행 expand 영역으로 흡수. 컴포넌트 코드는 보존(향후 재사용 여지).",
      "🗂 [행 expand] '편집' 버튼 클릭 시 행 아래로 펼침: 설명 textarea + 읽기/작성 최소 등급 드롭다운(grades_kv 동적) + 권한 4종 체크박스 (글읽/글쓰/댓읽/댓쓰).",
      "🗂 [개별 저장] expand 영역에 '💾 이 게시판만 저장' 버튼 — commitRow() 가 label/desc/level/권한 일괄 PATCH. '되돌리기' 로 미저장 변경 취소.",
      "🗂 [전체 저장] 상단 [저장] 버튼은 다중 행 변경 일괄 PATCH (commitAll). v00.175 부터 모든 필드 매핑 (level/권한 포함).",
      "🗂 [공지 보호] notice 는 드래그 차단 + 권한 체크박스 비활성화 + 삭제 버튼 숨김 + ID 핸들 dim.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.175.000`.",
    ],
    context: "v00.171 카드 형식 + v00.172 부분 시도 후 본 사이클에서 완성. 카테고리 탭과 통합으로 1 화면에서 게시판 라이프사이클(추가/순서/편집/권한/삭제) 완료. HTML5 dnd API 만 사용 (외부 lib 없음). expand 시에만 권한 UI 노출해 테이블 컴팩트 유지.",
  },
  {
    version: "00.174.000",
    date: "2026-05-05",
    datetime: "2026-05-05T21:58:40+09:00",
    summary: "🌊 사용자 여정 Sankey 흐름도 — 3-단계 (유입 채널 → 단계 → 도착 페이지)",
    details: [
      "🌊 [SankeyFlow 컴포넌트] 사용자 보고 '사용자 여정이라고함은 나는 이런 차트를 만들었으면 하는거야 이런식으로' (Sankey 스크린샷). 3-컬럼 SVG 흐름도 — 채널/단계/라우트 노드 + cubic bezier 곡선 ribbon. 노드 높이 ∝ 합계, ribbon 두께 ∝ 흐름 count.",
      "🌊 [채널 분류] _CHANNEL_FOR_HOST: 페이스북/인스타그램/구글/네이버/유튜브/카카오/트위터·X/스레드/내부 이동/직접 방문 10종. 미분류는 host 그대로. 채널별 색상 매핑.",
      "🌊 [단계 분류] _STAGE_FOR_ROUTE: Awareness(/, /home) / Interest(/column, /book, /faq...) / Consideration(/tour, /lectures, /community, /signup, /checkout, /admin...). 색상: 주황/녹색/적색.",
      "🌊 [호버 강조] 노드 또는 ribbon 호버 시 연결되지 않은 요소 opacity 0.06~0.35 dim, 호버 대상은 강조. 우상단 부동 툴팁 (모노 폰트).",
      "🌊 [코호트 selector] CohortSelector (v00.173 패턴) 재사용 — 7/14/30/90일. 기본 30일.",
      "🌊 [워커 flowPairs 응답] /api/analytics/summary 가 referrer×route 쌍 집계 (LIMIT 200) 를 flowPairs 로 반환. ★ wrangler deploy 필요.",
      "🌊 [UserJourneyPanel 통합] 기존 회원별 타임라인 위에 Sankey 흐름도 추가. 두 뷰 동시 노출.",
      "ℹ ★ 워커 deploy 필요 (flowPairs 쿼리 추가).",
      "📦 cache-buster — `?v=00.174.000`.",
    ],
    context: "v00.173 차트 인프라(호버/코호트) 직후 사용자 여정 Sankey 본격 구현. 사용자 reference 스크린샷 그대로 — 3-컬럼 흐름도. SVG 만으로 구현 (라이브러리 없음). 노드 위치는 수동 layout (running offset). bezier 양 끝의 thickness 면 따라 ribbon 영역 path. 호버 강조는 channelLinked/stageLinked/routeLinked 로 연결 그래프 도출.",
  },
  {
    version: "00.173.000",
    date: "2026-05-05",
    datetime: "2026-05-05T21:54:29+09:00",
    summary: "📊 차트 호버 툴팁 + 코호트 선택 (7/14/30/90일)",
    details: [
      "📊 [MiniBarChart 호버 툴팁] 사용자 보고 '모든 차트들은 호버하면 차트 내용물을 볼 수 있게'. 각 막대에 mouseenter/leave 로 hoverIdx 추적 → 부동 툴팁 (모노 폰트, 검은 배경) 노출. 호버 막대 외 다른 막대는 opacity 0.4 로 dim. SVG <title> 도 폴백으로 유지.",
      "📊 [CohortSelector 신규] 사용자 보고 '모든 차트는 차트에서 코호트를 설정할수 있게'. 7일/14일/30일/90일 4단 토글 컴포넌트. role=tab + aria-selected. 차트 헤더 우측에 inline 노출.",
      "📊 [DashboardPanel] pvDays / signupDays 독립 state. 페이지뷰 차트 + 가입 차트 각각 코호트 변경 가능. label 도 `${days}일 페이지뷰 추이` 동적. 라벨 간격 days 비례 (7→매일, 14→짝수, 30→5일, 90→15일).",
      "📊 [워커 ?days param 지원] /api/analytics/summary 가 ?days=N (1-90) 받음. dailySeries 와 seriesDays 응답에 포함. ★ 워커 wrangler deploy 필요.",
      "📊 [API 헬퍼] BGNJ_API.analytics.summary({ days }) 시그니처. 기본 14.",
      "📊 [unit/formatTooltip prop] MiniBarChart 가 unit('회'/'명') + formatTooltip 함수로 라벨 커스터마이즈 — 예: '5/4 · 페이지뷰 132회'.",
      "🛠 [사용자 여정 Sankey] 별 사이클 (v00.174). 본 사이클은 차트 공통 기반(호버/코호트) 우선.",
      "ℹ ★ 워커 deploy 필요 (analytics summary days param).",
      "📦 cache-buster — `?v=00.173.000`.",
    ],
    context: "사용자 강한 보고 2건: ① 모든 차트 호버 표시 ② 모든 차트 코호트 선택. 공통 컴포넌트 (MiniBarChart + CohortSelector) 로 일괄 적용. 사용자 여정 Sankey 차트는 분량 커서 v00.174 별 사이클로 분리 — 같은 호버/코호트 패턴 재사용 예정.",
  },
  {
    version: "00.172.000",
    date: "2026-05-05",
    datetime: "2026-05-05T21:49:03+09:00",
    summary: "📖 책 홈 CTA 별도 소개글 필드 + 폴백 — 메인 비어있던 공간 채우기",
    details: [
      "📖 [홈 책 CTA 본문 분리 필드] 사용자 보고 '메인에 책 소개 너무 비어있는데? 차라리 책 소개글을 좀 보여지게 하던지 해당 데이터만 입력할 수 있는 필드를 별도로 만들어서'. 카탈로그용 짧은 설명(book.desc) 과 별개로, 메인 화면에만 노출되는 본문을 별도 입력. site_content_kv.bookHomeIntros = { [bookId]: text } 매핑으로 저장 (D1 schema 변경 없음, 워커 deploy 불필요).",
      "📖 [홈 BookCarouselSection 폴백] introText = bookHomeIntros[id] || b.desc || ''. maxWidth 560px 로 텍스트 줄바꿈 자연. whiteSpace: pre-wrap 줄바꿈 보존.",
      "📖 [BooksAdminPanel meta 탭에 별도 필드] '홈 CTA 본문 (메인 화면 노출 — 별도 필드)' textarea 6줄. serif 14/1.8 가독성. 즉시 저장 버튼 — site_content_kv.bookHomeIntros 에 PATCH. 짧은 설명과 분리해 더 길게 작성 가능. placeholder 로 가이드 문구 노출. 비워두면 짧은 설명 자동 폴백.",
      "🛠 [CommunityBoardsPanel 일부 정리] v00.172 시도한 테이블/DnD 구조의 미완 상태(states/functions 만 추가) 정리 — 본 사이클은 책 소개 fix 우선. 테이블+DnD 통합 카테고리 머지는 v00.173 별 사이클.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.172.000`.",
    ],
    context: "사용자가 메인 책 카루셀의 좌측 빈 공간을 강하게 지적. 현재 desc(짧은 설명) 만 표시되어 비어있으면 빈 공간 → 별도 필드 분리로 admin 이 짧은 설명 외에도 메인 전용 본문 입력 가능. site_content_kv 사용해 D1 schema 변경 회피 (admin 즉시 사용 가능).",
  },
  {
    version: "00.171.000",
    date: "2026-05-05",
    datetime: "2026-05-05T21:38:24+09:00",
    summary: "🛠 게시판 추가/삭제 즉시 + 책 순서 변경 + 데이터 정리 폐기 + 카테고리 server delete",
    details: [
      "🛠 [커뮤니티 게시판 추가/삭제 인라인] 사용자 강한 보고 '커뮤니티 게시판 편하게 추가 삭제 할 수 있게 하라고 했냐 안했냐'. 기존엔 [커뮤니티 게시판] 탭이 title/desc 만 편집, 추가/삭제는 [카테고리] 탭에서만 가능했음. 같은 화면에서 일괄 처리 가능하게 인라인 ＋추가 폼 + 카드 우측 삭제 버튼. 즉시 BGNJ_API.categories.create / .remove 호출 (서버 영속). 공지(notice) 보호.",
      "🛠 [AdminCategoryPanel.remove server delete 추가] localStorage 만 지우던 버그 fix. 새로고침 시 boot 가 D1 default 로 다시 로드 → '삭제 안 됨' 인상. 이제 BGNJ_API.categories.remove 호출 후 로컬 동기화.",
      "🛠 [책 카탈로그 순서 변경] 사용자 요청 '책 카탈로그에서 순서를 바꿀 수 있게'. BooksAdminPanel 좌측 책 목록 각 항목 우측에 ▲▼ 버튼. swap 후 BGNJ_BOOKS.reorder(ids) → 워커 PATCH /api/books/:id sort_order 일괄 갱신. 즉시 refresh.",
      "🛠 [데이터 정리 폐기] 사용자 보고 '데이터 정리 기능 필요없으면 모두 다 지워'. v00.123 마이그레이션 (legacy categories/grades/site_content DROP) 완료 후 LegacyMigrationPanel 은 빈 도구. 사이드바 [데이터 정리] 항목 + 라우트 제거 (시스템 그룹 6→5). 컴포넌트 코드 자체는 향후 재사용 여지로 유지.",
      "ℹ 워커 미변경 (v00.170 의 body SELECT 변경 deploy 필요는 동일 — 별도).",
      "📦 cache-buster — `?v=00.171.000`.",
    ],
    context: "v00.170 직후 사용자 연속 보고 4건: ① 등급 이름 초기화 fix 후 같은 패턴 (서버 미저장) 이 categories.remove 에 잔존, ② 커뮤니티 게시판 추가/삭제 UX 미흡, ③ 책 카탈로그 순서 변경 부재, ④ 데이터 정리 무용. 모두 한 사이클로 일괄. localStorage→server 광범위 마이그레이션은 별 사이클 — 본 사이클은 가장 가시적인 사용자 흐름 4건 즉각 응답.",
  },
  {
    version: "00.170.000",
    date: "2026-05-05",
    datetime: "2026-05-05T21:32:44+09:00",
    summary: "🐛 [HOTFIX 3건] 글 본문 사라짐 + 등급 이름 초기화 + 룰: 무조건 서버 저장",
    details: [
      "🐛 [글 본문 사라짐 fix] 사용자 보고: '커뮤니티에 글쓰기 후 본문 내용이 사라진다'. 원인: 워커 GET /api/posts list endpoint 의 SELECT 가 body 컬럼 미포함. 클라이언트가 list 응답을 캐시하고 detail 점프 시 캐시에서 읽어 빈 본문이 표시됨. 3중 fix: ① 워커 SELECT 에 body 추가 (★ wrangler deploy 필요), ② 클라이언트 createPostRemote/updatePostRemote 가 단일 post fetch 로 body 보강, ③ CommunityPage detail 진입 시 body 비어있으면 _hydratePostBody 호출.",
      "🐛 [등급 이름 초기화 fix] 사용자 보고: '회원 등급 이름이 자꾸 초기화'. 원인: AdminGradePanel.commitAll 이 grades 를 localStorage(BGNJ_SAVE.grades) 만 저장하고 D1 grades_kv 미반영. boot 시 BGNJ_API.grades.list() 가 D1 default 로 덮어써서 사용자 편집 사라짐. fix: commitAll 이 sorted grades 각 항목을 BGNJ_API.grades.upsert(id, payload) 로 D1 에 PUT (label/level/color/description/order). 실패 시 실패 ID 표시.",
      "📜 [룰 신설: 무조건 서버 저장] 사용자 강한 보고: '로컬에 저장은 무조건 서버에 저장이야. 무.조.건.'. memory feedback 영구 등록. 새 admin 저장 로직 작성 시 D1 호출(BGNJ_API.<domain>.upsert/save/update) 필수. localStorage/BGNJ_SAVE.* 는 D1 호출 후 캐시 갱신용으로만. 예외(cart/session/draft 등 §2.9) 는 보존. 위반 발견 시 즉시 D1 호출 추가.",
      "ℹ ★ 워커 wrangler deploy 필요 — body SELECT 변경. 사용자 직접 실행: cd workers && npx wrangler deploy. 클라이언트 단일 fetch 폴백이 deploy 전에도 새 글은 정상 표시되게 보호.",
      "📦 cache-buster — `?v=00.170.000`.",
    ],
    context: "사용자가 잇따라 강한 보고 3건 (본문 사라짐, 등급 초기화, '회원가입 안된다' 민원). 라이브 signup 엔드포인트는 직접 테스트 결과 200 OK 정상 — 회원가입 자체는 동작. 다만 등급 초기화로 인해 사용자 신뢰 하락 + 본문 사라짐으로 콘텐츠 손실. 본 사이클은 두 데이터 보존 버그 즉각 fix + 룰 신설 (서버 저장 필수) 로 같은 패턴 재발 방지.",
  },
  {
    version: "00.169.000",
    date: "2026-05-05",
    datetime: "2026-05-05T21:22:48+09:00",
    summary: "✍ /column 페이지 admin 전용 글쓰기 버튼 + 모달",
    details: [
      "✍ [admin 글쓰기 진입 추가] 사용자 요청 '뱅기노자 칼럼에 글쓰기 버튼을 활성화'. 공개 /column 아카이브 헤더 (검색·카테고리 줄) 에 admin 전용 '＋ 글쓰기' 버튼 추가. 비로그인/일반회원에게는 노출되지 않음.",
      "✍ [홈 칼럼 섹션에도 글쓰기] 사용자 추가 보고 '뱅기노자 칼럼이 일반 라이브 홈페이지에 글쓰기 버튼이 보였으면 좋겠어'. HomePage 칼럼 섹션의 '칼럼 전체 보기' 옆 admin 전용 '＋ 글쓰기' 버튼. 클릭 시 sessionStorage flag 후 /column 이동 → ColumnPage useEffect 가 flag 감지하면 ColumnWriterModal 자동 오픈.",
      "✍ [ColumnWriterModal 신규] window.AdminColumnEditor 를 모달로 래핑. admin 콘솔의 ColumnEditorModalContent 와 동일 패턴 (useModalGuard + 외부클릭/ESC 임시저장 prompt + 발행/예약 시 자동 닫음).",
      "✍ [자동 새로고침] 저장 시 BGNJ_COLUMNS 가 'bgnj-columns-refresh' 이벤트 발화 → ColumnPage 의 기존 listener 가 청취 → 즉시 목록 갱신.",
      "✍ [임시저장 호환] window.BGNJ_DRAFTS('column') 에 저장. ColumnsHubPanel 의 임시저장 목록과 동일 store 공유.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.169.000`.",
    ],
    context: "사용자가 admin 콘솔 대신 공개 /column 페이지에서 직접 칼럼을 작성할 수 있길 원함. ColumnPage 에 이미 BGNJ_AUTH 의 user 가 prop 으로 전달되므로 isAdmin 체크 즉시 가능. AdminColumnEditor 는 이미 window 노출되어 있어 외부 페이지에서 재사용 가능.",
  },
  {
    version: "00.168.000",
    date: "2026-05-05",
    datetime: "2026-05-05T19:53:46+09:00",
    summary: "🛠 admin '최대 2단' 룰 + iframe 차단 해제 + 줄바꿈 미반영 fix",
    details: [
      "🛠 [admin max 2단 룰] 사용자 룰 '대시보드 외 최대 2단 (사이드바 + main). 3단 절대 안됨'. v00.167 의 form|preview 우측 컬럼 → form 아래 vertical stack 으로 이동. main 내부 항상 1열.",
      "🛠 [hero-editor-grid 1단 강제] HeroEditorPanel 자체 2-col(form|preview) 도 사이드바 합치면 3단 → 항상 1열 stack. styles.css 에 미디어쿼리 폐기 + 무조건 1fr.",
      "🛠 [home-text-editor-grid 1단 강제] HomeTextEditorPanel 도 동일. .home-text-preview-pane sticky 해제 — 자연 흐름.",
      "🛠 [iframe 차단 해제 (CSP)] CSP frame-src 가 youtube/vimeo 만 허용 → 자기 자신 iframe 차단('콘텐츠는 차단되어 있습니다'). frame-src 에 'self' 추가. 사이트 콘텐츠/SEO/약관/FAQ sub-tab iframe 정상.",
      "🛠 [엔터(줄바꿈) 미반영 fix] 사용자 강한 보고: '본문에서 엔터 친거 왜 라이브 미리보기 이런 탭에서 반영 안되냐? 반영하라고 몇번 말해야 반영해줄래?'. HeroEditorPanel 의 임베드 미리보기 subtitle 과 HomeTextPreview 의 hero subtitle 두 곳 모두 whiteSpace: 'pre-wrap' 누락 → textarea 의 \\n 무시됨. 두 곳 모두 추가. 실제 홈은 이미 .bgnj-multiline 으로 보존 중.",
      "🛠 [히어로 sub-tab previewUrl 제거] 히어로는 자체 임베드 미리보기 보유 → SubTabsView iframe 비활성. 중복 표시 제거.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.168.000`.",
    ],
    context: "v00.167 직후 사용자 강한 보고 3건: ① 3단 구성 룰 위반 ② iframe 차단 메시지 ③ 줄바꿈 미반영 (반복 지적). 한 사이클로 일괄 수정. CSP frame-src self 추가는 iframe 가능하게 함과 동시에 frame-ancestors self 와 짝을 이루어 self 만 self 를 frame 가능. 외부 클릭재킹 위험 변동 없음.",
  },
  {
    version: "00.167.000",
    date: "2026-05-05",
    datetime: "2026-05-05T19:46:13+09:00",
    summary: "👀 사이트 설정 sub-tab 우측 라이브 미리보기 iframe",
    details: [
      "👀 [SubTabsView 업그레이드] 사용자 보고 '사이트 설정에 모든 탭 안에 오른쪽에 라이브 미리보기 기능을 넣어 수정하면 바로바로 볼 수 있게'. 각 sub-tab 에 previewUrl 옵션 추가 — 지정 시 좌측 폼 + 우측 sticky iframe 2-col 레이아웃. PC/태블릿/모바일 viewport 토글 + ↻ 수동 리로드.",
      "👀 [자동 리로드 이벤트 청취] 4 종 BGNJ 새로고침 이벤트 (bgnj-site-content-refresh / bgnj-legal-refresh / bgnj-faqs-refresh / bgnj-bank-accounts-refresh) 청취. 패널에서 저장하면 iframe `key` increment → 자동 reload. 즉시 확인.",
      "👀 [sub-tab 별 previewUrl 매핑] 사이트 콘텐츠/히어로/SEO → '/' (홈), 약관/개인정보 → '/terms', 자주 묻는 질문 → '/faq'. 홈 텍스트는 자체 임베드 미리보기 보유 → previewUrl 없음. 계좌번호는 노출 페이지 없음 → previewUrl 없음.",
      "👀 [viewport 모드 영속] 마지막 PC/태블릿/모바일 선택을 localStorage 에 저장 (storageKey + '_pmode'). 새로고침 후 복원.",
      "👀 [반응형] admin-preview-grid 미디어쿼리 ≤1240px 시 1열 stack + sticky 해제. 좁은 화면에서도 폼 우선 사용 가능.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.167.000`.",
    ],
    context: "v00.166 사이트 설정 머지 직후 사용자 보고: '사이트 콘텐츠고 홈 텍스트고 다 사실 기능적으로는 똑같은데 저렇게 나가니까 너무 이상하잖아'. 머지만으로는 부족 — 미리보기까지 있어야 합리적. 패널 자체 구조는 유지(안전), 우측 iframe 으로 즉각 확인 경로 추가. HomeTextEditorPanel 의 임베드 미리보기 패턴을 모든 콘텐츠 패널로 확장한 셈.",
  },
  {
    version: "00.166.000",
    date: "2026-05-05",
    datetime: "2026-05-05T19:38:50+09:00",
    summary: "🧭 사이트 설정 7개 → 1개 (sub-tab 7) 단일 머지",
    details: [
      "🧭 [SubTabsView 신규 컴포넌트] 동일 카테고리 패널들을 한 사이드바 항목 + 상단 sub-tab UI 로 묶는 generic 래퍼. localStorage 로 마지막 sub-tab 복원.",
      "🧭 [사이트 설정 머지] 사용자 강한 보고: '사이트 설정은 좀 한군데 다 몰아놔라. 동일한 기능을 왜 여러개로 나눈거야 화나게'. 7 사이드바 항목(사이트 콘텐츠/홈 텍스트/히어로/SEO/약관·개인정보/자주 묻는 질문/계좌번호 설정) → 1 사이드바 항목 '사이트 설정'. 내부에 7 sub-tab 으로 동일 기능 100% 보존.",
      "🧭 [사이드바 총 항목] v00.165 38개 → v00.166 32개 (-6).",
      "🧭 [v00.165 collapsible 보완] 사용자 보고 'v00.165 가 묶기가 아니라 숨김' 정확. 본 사이클이 실제 머지 시작점. 사이트 설정 외 5개 묶음(법무·FAQ·사용자 권리·오류·문서 등)은 별 사이클에서 진행 — 안전성 확보용 분리 머지.",
      "🧭 [기존 라우트 호환] '사이트 콘텐츠/홈 텍스트/히어로/SEO/약관·개인정보/자주 묻는 질문/계좌번호 설정' 7 직접 라우트는 더 이상 setTab 으로 호출되지 않음(외부 호출처 0건 grep 검증). 모든 진입은 '사이트 설정' 한 항목.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.166.000`.",
    ],
    context: "v00.165 직후 사용자 보고 — 캐시로 못 보던 것 + 본질적 불만(merge 가 아니라 hide). 본 사이클은 사용자가 가장 강하게 지목한 '사이트 설정' 그룹 7→1 머지로 즉각 응답. SubTabsView 는 다른 머지 후보(법무·FAQ, 사용자 권리, 오류, 문서)에 동일 패턴으로 재사용 가능.",
  },
  {
    version: "00.165.000",
    date: "2026-05-05",
    datetime: "2026-05-05T19:30:35+09:00",
    summary: "🧭 관리자 사이드바 collapsible + 그룹 9→8 + 탭 클릭 스크롤 최상단",
    details: [
      "🧭 [collapsible 그룹] 사용자 보고 '관리자 사이드메뉴가 관리/기능 측면 안좋고 지나치게 많다'. 33 개 탭 동시 노출 → 시각 부하. 디폴트는 현재 탭이 속한 그룹만 펼침. 다른 그룹은 클릭으로 토글. 그룹 헤더에 항목 카운트 ('· N') 표기.",
      "🧭 [그룹 9 → 8] 프로그램(2) + 쇼핑(2) → '프로그램·쇼핑'(4) 머지. '요약·분석' → '요약' 명칭 단축.",
      "🧭 [탭 클릭 스크롤 최상단] 사용자 요청 '사이드 메뉴 클릭하면 자동으로 제일 위로'. handleTabClick 신규 — admin-main + window 둘 다 scrollTo({top:0, behavior:'smooth'}). requestAnimationFrame 으로 다음 paint 보장.",
      "🧭 [setTab 외부 호출 호환] DashboardPanel 등에서 setTab 직접 호출하는 경로는 currentGroup useMemo 가 자동 펼침. 기존 흐름 깨지지 않음.",
      "🧭 [그룹 토글 시각] '▾' 인디케이터 90deg 회전 + transition .2s. aria-expanded 속성으로 a11y 준수.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.165.000`.",
    ],
    context: "사용자 보고 직후 즉각 처리. 탭 자체는 폐기하지 않음 (각 탭이 실제 기능 컴포넌트와 1:1 매핑되어 제거 시 기능 손실). collapsible 만으로 일상 사용 시 보이는 항목이 33 → 평균 4-8 개로 감소. 그룹 머지(프로그램+쇼핑)는 의미적 인접성이 가장 큰 1 쌍만 적용.",
  },
  {
    version: "00.164.001",
    date: "2026-05-05",
    datetime: "2026-05-05T19:27:02+09:00",
    summary: "🎨 카드 박스 인상 제거 (.card--bare modifier)",
    details: [
      "🎨 [.card--bare modifier 신규] 사용자 보고 '카드들이 박스가 있게 배치가 되어서'. 모든 카드가 1px line + 배경 콤보로 같은 박스 인상이 6번 반복되던 문제. background + border 만 제거(padding/transition 유지)하는 modifier 추가.",
      "🎨 [추천 카드] .card--bare 적용 + padding 0 (사진 flush). 사진이 시각 주체이므로 박스 외피 불필요.",
      "🎨 [강연 strip 카드] .card--bare 적용 + padding 4/4/12. 가로 스크롤 + flex gap 으로 이미 항목 구분. 박스 라인은 시각 노이즈.",
      "🎨 [책 CTA] .card 클래스 폐기 + padding 0. 인라인 background/border 제거. .section--anchor 의 140px 호흡으로만 sit (hero 무게).",
      "🎨 [투어 카드 유지] '선택 가능한 일정 항목' 인상이 박스로 강화되는 단 1 섹션. 이번 사이클에서 손대지 않음.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.164.001`.",
    ],
    context: "v00.164.000 직후 사용자 추가 보고: '카드들이 박스가 있게 배치가 되어서 그런것같기도해'. 박스 인상 제거가 박자/위계 변별보다 즉각 효과. 사진/콘텐츠 주체 카드만 박스 제거(추천/강연/책), 일정 항목 카드(투어)는 유지하는 선택적 적용.",
  },
  {
    version: "00.164.000",
    date: "2026-05-05",
    datetime: "2026-05-05T19:22:54+09:00",
    summary: "🎨 홈 섹션 박자 부수기 + 카드 form factor 다양화 + 주제/지원 2그룹 위계",
    details: [
      "🎨 [섹션 박자 부수기] 사용자 보고 '홈 디자인이 AI 톤앤매너를 못 벗어나는 느낌'. 6 섹션이 모두 동일한 4단 헤더(eyebrow+title+subtitle+action)였음. 추천만 SectionHead 유지(앵커), 투어/강연 inline 헤더(.section-head--inline 신규), 커뮤니티 subtitle 우측 인라인, 칼럼 외부 SectionHead 폐기 → 헤드라인을 featured 카드로 흡수.",
      "🎨 [추천 asymmetric grid] 카드 3개 이상이면 첫 카드 2칸 차지(.grid-feature-2 신규 — 1.6fr 1fr 1fr + grid-row span 2). 첫 카드 사진 320px, 헤드라인 30px 로 editorial spread 톤. 미만이면 grid-3 폴백.",
      "🎨 [강연 가로 스크롤] grid-3 카드 → .lecture-strip 가로 flex + scroll-snap. 카드 폭 320px (모바일 260px). film strip 톤. 3 개 이상일 때 '← 가로로 스크롤 →' 힌트 노출.",
      "🎨 [칼럼 magazine spread] featured = 카드 라인 제거, 사진 fullbleed-ish 340px + 큰 serif 헤드라인 clamp(28-38px). sidebar = '읽을거리' eyebrow + 텍스트 list 형태(카드 라인 X, 구분선만).",
      "🎨 [주제/지원 2그룹 위계] 모든 .section 이 120px padding 동일 → 3단 위계. .section--anchor (140px, 추천+책CTA), .section--mid (100px, 커뮤니티+칼럼), .section-tight (80px, 투어+강연). 호흡의 강·약 형성.",
      "🎨 [책 CTA 강화] anchor 박자 적용. 카드 padding 72→96, gap 60→80. hero 무게감 강화.",
      "🎨 [사용자 결정] B(모노 letter-spacing) / F(카피) / G(1인칭 카피) / D(이미지) 는 이번 사이클에서 손대지 않음. 컬러 토큰 0개 변경.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.164.000`.",
    ],
    context: "사용자 요청: '세션 박자 무너뜨리고, 모노 레터 스페이싱이랑 카피는 그대로 가고 전반적인 디자인만 좀 개선'. 컬러는 손대지 말 것. AI 톤 빠지는 가장 빠른 표지 5가지 중 박자/위계/카드 폼 3개를 한 사이클로 처리. 카피·이미지는 별 사이클.",
  },
  {
    version: "00.163.000",
    date: "2026-05-05",
    datetime: "2026-05-05T19:05:55+09:00",
    summary: "🏠 홈 텍스트 통합 편집 + PC/태블릿/모바일 미리보기",
    details: [
      "🏠 [HomePage homeText] 홈 화면의 고정 헤딩/라벨/빈 상태/버튼 문구를 `site_content_kv.homeText` 로 분리. 추천/답사/커뮤니티/칼럼/강연/도서 CTA/히어로 우측 일정 카드 문구가 관리자에서 수정 가능.",
      "🏠 [관리자 홈 텍스트 탭] 사이트 설정 그룹에 `홈 텍스트` 탭 추가. 좌측은 섹션별 입력 폼, 우측은 즉시 반영되는 홈 미리보기.",
      "📱 [반응형 미리보기] 미리보기 버튼 `PC` / `태블릿` / `모바일` 추가. 선택한 viewport 폭으로 홈 요약 화면을 즉시 전환.",
      "🧭 [기존 호환] 추천 여행지 헤딩은 기존 `recommendationsHeading` 도 함께 저장해 옛 편집 경로와 충돌하지 않게 유지.",
      "🪶 [홈 톤 조정] 기본 히어로와 섹션 문구를 더 운영자 말투에 가깝게 정리하고 홈 전용 CSS 톤 보정 적용.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.163.000`.",
    ],
    context: "사용자 요청: '모든 텍스트들은 관리자페이지에서 수정할 수 있게' + '좌측 텍스트 / 우측 미리보기' + '미리보기 모바일, PC, 태블릿 버튼 전환'. 정적 HomePage 고정 문구를 homeText 로 모아 운영자 UX 를 한 화면에 통합.",
  },
  {
    version: "00.162.000",
    date: "2026-05-04",
    datetime: "2026-05-04T01:03:54+09:00",
    summary: "✨ 책 카루셀 슬라이드 + 한 줄 소개 (subtitle) + BookPage hero (칼럼 패턴)",
    details: [
      "✨ [홈 책 카루셀 슬라이드 느낌] 사용자 보고 '도서 카드 돌아가는 거 슬라이드 느낌으로'. 기존 jump cut → 모든 books 를 absolute layered 로 렌더, active 만 opacity 1 + translateX(0), 비활성은 opacity 0 + ±24px shift. crossfade-slide transition .55s ease. 무한 wrap 시 시각적 jump 없음. 첫 책만 relative 로 wrapper 높이 보존.",
      "✨ [한 줄 소개] 사용자 요청 '한줄소개가 보이는게'. 책 카드 title 아래 book.subtitle 표시 (serif italic 18px var(--ink-2)). subtitle 미입력 시 자연스럽게 hide.",
      "✨ [BookPage hero] 사용자 요청 '뱅기노자 도서에도 홈페이지 헤더가' (스크린샷 = 칼럼 페이지 hero). /book 다권 탭 위에 칼럼 패턴 hero 추가 — eyebrow `'BOOKS · 뱅기노자 도서'`, accent `'뱅기노자'`, suffix `'가 짓다'`, subtitle `'한국의 역사와 풍경을, 책으로.'`. site_content_kv.bookIntro 에서 admin 편집 가능 (admin 패널 추가는 다음 사이클).",
      "✨ [DEFAULT_SITE_CONTENT.bookIntro] 신설. 다른 페이지 intro 와 동일 패턴.",
      "ℹ admin 사이트 콘텐츠 → bookIntro 편집 항목은 별 사이클에서 추가 (default 로도 즉시 노출).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.162.000`.",
    ],
    context: "v00.161 직후 사용자가 책 표면 UX 두 건 (카루셀 슬라이드 + BookPage hero) 동시 지시. 한 사이클로 묶음. 카루셀 한 줄 소개 = book.subtitle 활용. BookPage hero = 칼럼 페이지와 동일 패턴 적용으로 사이트 표면 일관성 강화.",
  },
  {
    version: "00.161.000",
    date: "2026-05-04",
    datetime: "2026-05-04T01:00:27+09:00",
    summary: "⚡ P1-2 성능 — React production build (~3MB↓) + script defer + localStorage PII sanitize",
    details: [
      "⚡ [React production build] react.development.js → react.production.min.js, react-dom.development.js → react-dom.production.min.js. SHA-384 SRI 재계산 (sha384-DGyLxAyjq0f9... / sha384-gTGxhz21l...). 다운로드 ~120KB → 6KB / ~1.1MB → 130KB. 'development build 사용 중' 경고 사라짐.",
      "⚡ [script defer] 모든 internal script (api/data/components/pages/boot 18 개) 에 `defer` 부착. HTML 파싱 차단 안 함, 문서 순서 보장. inline / type=module 은 자동 defer-equivalent.",
      "🔒 [PII sanitize] BGNJ_AUTH._writeCache 가 localStorage 저장 시점에 profile 의 phone/birthdate/address/addressDetail/zip 제거. _PII_PROFILE_KEYS 상수 + _sanitizeForCache 헬퍼. in-memory state (호출자가 받은 user) 는 그대로. 다음 reload 시 캐시는 PII 빈 상태 → boot.jsx 의 refreshSession 후 server 에서 full user 받아 setUser → 정상.",
      "ℹ FCP 단축 + JS bundle 크기 차감 + XSS/물리 접근 시 PII 노출 면 축소.",
      "ℹ trade-off: production build 후 에러 stack 이 minified — 사용자 보고 에러 추적 시 component displayName 만 보임 (수용).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.161.000`.",
    ],
    context: "v00.156 검토 보고서 P1-2 마무리. 큐 1 P1 항목 정리.",
  },
  {
    version: "00.160.000",
    date: "2026-05-04",
    datetime: "2026-05-04T00:46:11+09:00",
    summary: "♿ useModalGuard focus trap (P1 a11y) + ★ 워커 deploy (v00.154 영수증 mail subject 동적화)",
    details: [
      "♿ [P1-1 focus trap] useModalGuard 에 (a) 모달 open 시 첫 focusable 자동 focus, (b) Tab/Shift+Tab 시 첫↔마지막 wrap, (c) 모달 닫힐 때 직전 focus 복원 추가. 5 호출 사이트 (HomePage 지도/추천 + AuthAdminPage 문서뷰어/게시글뷰) 변경 0 — `[role='dialog'][aria-modal='true']` 또는 `[data-bgnj-modal='true']` 폴백 selector 사용. 미부착 모달은 trap 비활성 (회귀 안전).",
      "♿ [메가메뉴 :focus-within 진단 정정] v00.156 검토 보고서가 'focus-within 누락' 으로 본 것은 오진단. styles.css:1546-1547 에 이미 `.nav-has-mega:focus-within .nav-mega { ... }` 적용되어 있었음. 키보드로 헤더 메가메뉴 진입 정상.",
      "★ [워커 deploy] v00.154 에서 push 한 workers/src/index.js:1530 의 영수증 mail subject 동적화 (book_orders LEFT JOIN books) 활성화. cd workers && wrangler deploy. 효과: 주문 상태 변경 시 이메일 알림 제목이 동적 책 제목.",
      "ℹ contentRef 옵션 — useModalGuard 시그니처에 추가했으나 5 기존 호출 사이트는 미전달 → 폴백 selector. dialog 컴포넌트가 `role='dialog' aria-modal='true'` 어트리뷰트 부착 시 자동 trap.",
      "ℹ requestAnimationFrame 으로 모달 mount 직후 트라이 (race 흡수).",
      "📦 cache-buster — `?v=00.160.000`.",
    ],
    context: "v00.156 검토 보고서의 P1-1 a11y (focus trap) 마무리 + 큐 2 의 v00.154 워커 deploy 잔여를 한 사이클로 묶음. 사용자 명시 '디플로이가 필요하면 디플로이 진행해'. P1-2 (성능: React production build / script defer / PII localStorage) 는 v00.161 별 사이클 — 더 큰 변화라 분리.",
  },
  {
    version: "00.159.000",
    date: "2026-05-04",
    datetime: "2026-05-04T00:39:10+09:00",
    summary: "🩹 P0 3건 일괄 fix — LecturesPage 빈 버킷 가드 / nav 폴백 라벨 / helper 직접 호출 race",
    details: [
      "🩹 [P0-1 LecturesPage 빈 버킷 throw] 사이트 검토 발견. line 53-56 에서 lectures.length===0 일 때 lecture=undefined → lecture.id 접근 시 throw → PageErrorBoundary 가 잡지만 사용자에게 빨간 에러 카드 노출. `if (!lecture) return <안내 카드>` 가드 + 반대 버킷 이동 버튼. 재현: 강연 1개 startsAt 미래 + '지난 강연' 탭 클릭.",
      "🩹 [P0-2-a Shell.jsx nav 폴백] components/Shell.jsx:363 의 `navL.book || '책'` → `navL.book || '뱅기노자 도서'`. v00.153 다권화 라벨 정합. D1 site_content_kv 가 비어있어도 정상 텍스트.",
      "🩹 [P0-2-b admin 주석 잔재] AuthAdminPage.jsx:5996 `{/* 왕의길 (책 주문 운영) */}` → `{/* 도서 주문 운영 */}`. 운영 무영향이지만 다권화 컨텍스트 일관성.",
      "🩹 [P0-3-a LegalFaqPages helper 가드] 모듈 상단 `G = window.BGNJ_GUARD || 인라인 폴백` 도입. window.BGNJ_LEGAL.get / window.BGNJ_FAQ.listCategories/search 4 곳 직접 호출 → G.call/G.arr 래핑. helper 미로드 race 시 페이지 mount 정상 (빈 안내 표시).",
      "🩹 [P0-3-b BookCheckoutPage.BookReviewSection] useState 초기화 mount-time 호출 (window.BGNJ_BOOK_ORDERS.listReviews()) → G.arr 폴백. helper race 시 리뷰 빈 채로 페이지 정상.",
      "ℹ MyPage / AuthAdminPage 의 lazy callback 안 직접 호출은 본 사이클 비대상 — risk 낮음 (callback 시점엔 helper 로드 완료). 별 사이클에서 표준 패턴 정합 차원.",
      "ℹ D1 site_content_kv.nav.book 옛 row 정리는 운영자 직접 작업 (admin → 사이트 콘텐츠 → 메뉴).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.159.000`.",
    ],
    context: "v00.156 사이트 심층 검토 보고서의 P0 3건 (실제 throw 1건 / 운영 회귀 1건 / race 잠재 위험 1건) 일괄 fix. P1 a11y / 성능 / PII 는 v00.160+ 별 사이클 후보.",
  },
  {
    version: "00.158.000",
    date: "2026-05-04",
    datetime: "2026-05-04T00:35:15+09:00",
    summary: "🎨 버튼 모양 자연스럽게 — border-radius 8px + subtle shadow + hover lift (사용자: '바이브코딩 티')",
    details: [
      "🎨 [.btn radius 0 → 8px] 사용자 보고 '버튼이 너무 정사각형이라 바이브코딩 티'. 진단: styles.css:951 `.btn` 정의가 border-radius 미지정 (브라우저 기본 0). 카드/입력 등 다른 박스는 sharp 디자인 언어 일관 — 버튼만 살짝 부드럽게 해 인터랙티브 요소가 카드와 시각 위계로 구별되게.",
      "🎨 [subtle shadow 도입] rest `0 1px 2px rgba(15,23,42,0.04)` / hover `0 4px 12px rgba(15,23,42,0.08)`. .btn-gold 는 gold tint shadow `0 6px 16px rgba(245,213,72,0.28)` (브랜드 호흡). hover 시 `translateY(-1px)` 떠오름, active 에 `translateY(0)` + 그림자 줄임 (누르는 느낌).",
      "🎨 [.btn-ghost 보호] 텍스트 링크 성격이라 그림자/transform/큰 radius 미적용 (radius 4px 만 살짝). hover 도 색만 변화.",
      "🎨 [.btn-small radius 6px] 작은 버튼은 더 작은 radius — visual scale 정합.",
      "♿ [a11y] :focus-visible outline border-radius 도 8px (.btn 한정) 로 정합. prefers-reduced-motion: reduce 시 transform 비활성화 (그림자는 정적 유지).",
      "✨ [transition tuning] `cubic-bezier(.2,.7,.2,1)` ease-out 곡선 + 0.2s + active 시 .08s 빠른 응답. 사용자가 누르는 동작에 즉시 시각 반응.",
      "ℹ 다크/라이트 모드 둘 다 자연스러움 (그림자 alpha 가 작아 별도 override 불필요). 카드/입력은 변경 없음 (사용자 지시 대상 아님).",
      "ℹ 인라인 정사각형 버튼 (BookCheckoutPage.jsx:295,297 의 +/− 수량) 은 인라인 style 이라 본 변경 영향 안 받음 — 별 사이클에서 일괄 정리 후보.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.158.000`.",
    ],
    context: "사용자가 '바이브코딩 티' 라는 표현으로 디자인 수정 요청. 진단 결과 .btn / .card / .field-input 모두 border-radius 0 — sharp wireframe 느낌이 사이트 전반. 버튼만 8px + shadow + lift 로 인터랙티브 시그널을 시각 위계로 분리. 카드는 sharp 유지로 시각 다양성 확보.",
  },
  {
    version: "00.157.000",
    date: "2026-05-04",
    datetime: "2026-05-04T00:19:38+09:00",
    summary: "✨ 관리자 대시보드 카드 호버 시 상세 분포·세부 숫자 popover (회원/게시글/칼럼/주문/방문)",
    details: [
      "✨ [HoverDetailsPopover 컴포넌트 신설] role=tooltip / aria-describedby 연동. 카드의 position:relative 안에서 absolute popover (top:100%, anchor right). bg + gold-dim border + soft shadow. min-width 240, max 320. z-index 50. label/value 표 형태 (label dim, value mono gold).",
      "✨ [StatTile 컴포넌트] dashboardStats 4 카드 (전체 회원/게시글/칼럼/주문) 를 hover/focus-aware 카드로 추출. tabIndex 0 (details 있을 때만) — 키보드 Tab 으로도 popover 접근. onMouseEnter/Leave + onFocus/Blur 이중 트리거.",
      "✨ [MetricCard details prop] 일/주/월 방문 + 가입 카드 (4 MetricCard) 도 동일 hover/focus popover. overflow:hidden → visible 로 변경 (popover 가 카드 밖으로 나오게).",
      "✨ [dashboardStats details 계산] useMemo 안에서 카드별 분포 산출 — 회원: 일반/관리자/슈퍼관리자/오늘·7일·30일 가입 / 게시글: 오늘·7일·30일 + 평균 댓글/글 + 카테고리 top 5 / 칼럼: published/draft/scheduled/archived/관리자 칼럼 총합 / 주문: 6 상태 (입금 대기·확인·배송중·배송 완료·환불 신청·취소).",
      "✨ [MetricCard details] 일/주/월 방문 — 페이지뷰/세션/일평균/페이지/세션 비율. 가입 — 오늘·7일·30일·누적·일평균.",
      "🪶 [라벨 정정] '왕의길 주문' → '도서 주문' (v00.153~v00.154 도서 다권화 컨텍스트 일관성).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.157.000`.",
    ],
    context: "사용자 요청 '관리자페이지 대시보드 데이터들 호버 시 숫자/데이터 표시'. 기존 카드는 큰 숫자 1개 + 부제 1줄로 정보 밀도 낮음. popover 로 분포·세부 숫자를 한 장소에 압축 노출. mobile hover 미지원은 부제로 fallback (1차 desktop hover 정상). React.useId 폴백으로 SSR/CSR 모두 호환. 본 사이클부터 admin 대시보드 정보 밀도 ↑.",
  },
  {
    version: "00.156.000",
    date: "2026-05-04",
    datetime: "2026-05-04T00:14:43+09:00",
    summary: "📋 메타 갱신 사이클 — ROADMAP / CONTEXT 본 세션 회고 + plans/README 신설 + 사이트 심층 검토 보고서",
    details: [
      "📋 [ROADMAP.md] '마지막 갱신' v00.112 → v00.156. 사이클 완료 회고에 v00.114~v00.150 누적 한 줄 + v00.151/152/153/154/155/156 개별 한 줄 추가. 큐 1 갱신 — v00.118/119/123 ✅ 정리 후 본 세션 발굴 후속 후보 6건 (책별 리뷰 분리, 챕터 깊은 들여쓰기, 에러 라이브 라우트, 403/401 자동 wiring, PG 결제, 검토 보고서 반영). 큐 2 — v00.154 워커 영수증 deploy 잔여 등록.",
      "📋 [CONTEXT.md] §0 한 페이지 요약에 작업 가이드 룰 2 (plans/<버전>.md 선작성 / 명령 실행 후 오류 우선) 추가 + '현재 v00.156 시점' 표기. §5 누적 사이클 표에 v00.127~v00.150 한 줄 + v00.151/152/153/154/155/156 개별 추가.",
      "📋 [plans/README.md] 신설 — plans/ 폴더 목적 / 작성 규약 / 다른 문서(ROADMAP/CONTEXT/ADMIN_VERSION_HISTORY/kms.md) 와의 시점·단위 매트릭스 / v00.152~v00.156 인덱스 표.",
      "🔍 [사이트 심층 검토] 사용자 요청. general-purpose 에이전트가 read-only 광범위 검토 (1권 가정 잔재 / 데이터 폴백 / 라우트 일관성 / ReferenceError 위험 / UX / a11y / 성능 / SEO / 보안 / 코드 품질). 본 사이클은 코드 수정 0 — 보고서를 사용자에게 별 메시지로 전달, 우선순위 결정 후 v00.157+ 분류.",
      "ℹ 워커 미변경. 본 사이클은 메타-only.",
      "📦 cache-buster — `?v=00.156.000`. 메타-only 임에도 release-workflow 룰(BGNJ_VERSION + cache-buster + ADMIN_VERSION_HISTORY 한 묶음) 일관성 유지 + 라이브 강제 reload 신호 (admin/사용자에게 가이드 변경 알림).",
    ],
    context: "직전 답변에서 '약속하고 안 한 것' 정리 시 ROADMAP/CONTEXT/plans 인덱스 메타 갱신 누락 발견 → 사용자가 '메타 갱신 + 홈페이지 깊이 검토' 두 항목 동시 지시. 메타는 본 사이클에서 마무리, 검토는 코드 수정 없이 보고서로 분리.",
  },
  {
    version: "00.155.000",
    date: "2026-05-03",
    datetime: "2026-05-03T23:58:39+09:00",
    summary: "✨ 책 목차 sub-item 문법 ('- ' prefix → 직전 챕터 하위 설명) + 입력 규칙",
    details: [
      "✨ [목차 sub-item 표시] 사용자 요청 '- 로 시작하면 해당 세션에 설명으로 들어가게'. BookCheckoutPage 의 목차 탭이 chapters string[] 을 그룹핑 (`{title, items[]}`) 후 챕터/하위 항목 분리 렌더. 챕터 번호는 본 챕터에만, sub-item 은 들여쓰기 + dim 컬러 + · bullet.",
      "✨ [admin textarea hint + placeholder] 목차 입력 textarea 라벨 아래에 입력 규칙 안내 (`- ` 하이픈+공백 = 직전 챕터 하위 설명). placeholder 에 예시 5줄 (1부/2부 + sub).",
      "✨ [데이터 구조 무변경] chapters 는 여전히 string[]. 표시 로직만 그룹핑. D1 schema/마이그레이션 0건. admin onChange 에서 양쪽 공백 trim 후 빈 줄 제거.",
      "✨ [엣지 케이스] 첫 줄이 sub 면 챕터로 격상 (데이터 손실 방지). 빈 sub('- '만) 은 무시. 깊은 들여쓰기(--)는 1차 미지원 — 필요 시 후속.",
      "📚 [규칙 문서] kms.md 영역 5 책 상세 섹션에 입력 규칙 한 줄 추가. v00.153/v00.154 의 cart bookId/탭 변화도 함께 반영.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.155.000`.",
    ],
    context: "v00.153 작업 중 사용자가 보류했던 '책 목차 - sub-item' 요청 마무리. 데이터 구조 호환성을 위해 chapters string[] 그대로 두고 표시만 그룹화. admin 의 textarea 도 동일 hint/placeholder 로 룰을 사용자에게 가시화. v00.152 신설 plan-md 룰의 네 번째 적용 — plans/v00.155.000-chapter-subitems.md.",
  },
  {
    version: "00.154.000",
    date: "2026-05-03",
    datetime: "2026-05-03T23:56:18+09:00",
    summary: "✨ cart/order 다권 지원 (bookId 도입) + 모든 『왕의길』 잔재 제거 + 워커 영수증 동적 (★ deploy)",
    details: [
      "✨ [cart-flow 다권화] BookPage addToCart 가 cart 에 bookId 포함 (`{bookId, version, qty, price}`). CheckoutPage 가 cart.bookId 로 책 lookup, 폴백 BGNJ_BOOKS.primary(). 모든 표기/모달/sticky 카드를 book.title + 표지 동적 (王 placeholder 도 표지 thumbnail 또는 첫 글자).",
      "✨ [BGNJ_BOOK_ORDERS.createOrder] payload.bookId / payload.unit 필수. BANGINOJA_DATA.book 시드 폴백 제거. 가격은 호출자가 결정 (책별 가격 대응). 폴백으로 primary().id 사용 (1권 환경 호환).",
      "✨ [BGNJ_BOOK_ORDERS.getOrderBookTitle(order)] 신설 — order.bookId → BGNJ_BOOKS.get → title. 구주문(bookId 없음)은 primary().title 폴백, 그것도 없으면 '책'. MyPage / AuthAdminPage / 영수증 텍스트 모두 사용.",
      "✨ [generateReceipt] 영수증 텍스트 라인 2155 의 『왕의길』 → 동적 책 제목.",
      "✨ [MyPage / AuthAdminPage] 주문 카드 BOOK 표기 동적 + MyPage 헤더 'BOOK ORDERS · 도서 주문' 일반화 + admin 안내문 일반화.",
      "✨ [워커 영수증 mail] workers/src/index.js:1530 의 『왕의길』 하드코드 → book_orders LEFT JOIN books 로 title 가져와 동적. ★ wrangler deploy 필요 (배포 전엔 옛 워커가 옛 제목 발송).",
      "📦 cache-buster — `?v=00.154.000`.",
    ],
    context: "v00.153 후속으로 미뤄둔 cart/order 다권 흐름 일괄 마무리. 워커 schema 는 이미 book_id 컬럼 존재 + INSERT 지원되어 있어 schema 변경 불필요. 워커 코드만 수정 → wrangler deploy 한 번. 클라이언트는 즉시 활성. 본 사이클부터 다권 책 주문이 영수증/MyPage/admin 까지 일관 표시.",
  },
  {
    version: "00.153.000",
    date: "2026-05-03",
    datetime: "2026-05-03T23:44:22+09:00",
    summary: "✨ 메뉴 '뱅기노자 도서' + BookPage 다권 탭 + 책 메인 제목/소개/저자 하드코드 제거",
    details: [
      "🪶 [메뉴 라벨] 사용자 요청 '뱅기노자의 길 → 뱅기노자 도서'. boot.jsx routeTitles / data.js seed nav / AuthAdminPage 사이트 콘텐츠 admin 라벨 3 곳 일괄. 단 D1 site_content_kv 의 nav.book 값이 옛 값으로 저장돼 있다면 admin → 사이트 콘텐츠 → 메뉴에서 사용자가 직접 갱신 필요 (server-first 원칙).",
      "✨ [BookPage 다권 탭] /book 진입 시 책 ≥2권이면 상단에 책 선택 탭 노출 (책 1권이면 미노출). 데이터 소스 BGNJ_BOOKS.list({status:'published'}) — primary 우선 → order. 책 변경 시 판본/수량/탭 상태 초기화 (새 책의 판매 가능 판본이 다를 수 있음).",
      "🩹 [책 제목 root cause] 사용자 보고 '책 제목이 잘못 연결됨'. 원인: BookCheckoutPage.jsx:195 H1 이 『왕의길』 하드코드 — v00.151 표지/판본 fix 가 메인 제목·소개 탭(281-283)·저자 탭(303-306)은 안 건드림. 표지 업로드 후 제목만 안 바뀐 걸로 보임. 모두 book.title / book.intro || book.desc / book.author / book.authorBio 로 교체.",
      "🩹 [BookReviewSection] bookTitle prop 추가 — placeholder/안내문 동적. BookPage 가 자동 전달.",
      "ℹ [후속] CheckoutPage / 주문 영수증(workers) / MyPage 의 『왕의길』 하드코드 5+ 곳도 같은 root cause. cart 에 bookId 가 없어 cart-flow 다권화는 별 사이클 (v00.154 후보).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.153.000`.",
    ],
    context: "사용자가 /book 스크린샷 첨부하며 (a) 메뉴명 변경 (b) 다권 탭 (c) 제목 잘못 연결 동시 지시. (c)는 D1 데이터 문제가 아닌 코드 잔재 — v00.151 의 부분 fix 를 본 사이클에서 마무리. 본 사이클부터 plans/<버전>.md 선작성 룰 (v00.152 신설) 두 번째 적용 — plans/v00.153.000-book-page-rework.md.",
  },
  {
    version: "00.152.000",
    date: "2026-05-03",
    datetime: "2026-05-03T23:37:31+09:00",
    summary: "✨ 홈 책 CTA 다권 카루셀 + hero 지도 버튼 제거 + 작업 가이드 룰 2 (plan-md / 오류 우선)",
    details: [
      "✨ [홈 책 CTA 다권 카루셀] v00.151 단일 책 IIFE → BookCarouselSection 컴포넌트화. 데이터 소스 BGNJ_BOOKS.list({status:'published'}), 정렬 primary 우선 → order. 좌우 ‹/› 원형 버튼 + 하단 dot indicator + autoplay 7s + hover 시 정지 + 좌우 무한 wrap (modulo).",
      "✨ 1권일 때: chrome (좌우 버튼 / dot) hide → 정적 카드. 0권일 때: 섹션 자체 hide (return null).",
      "✨ admin 변경 즉시 반영 — bgnj-books-refresh event + dataTick prop 양쪽 청취. 새로고침 불필요.",
      "🩹 [홈 hero CTA] 사용자 요청 '지도에서 여행지 찾기 버튼 삭제'. 옆 '커뮤니티 참여하기' 버튼이 btn-gold 로 격상되어 단독 CTA.",
      "📋 [작업 가이드 룰 신설] 사용자 명시 — (1) 새 작업 접수 시 plans/<버전>.md 작업계획서를 코드/명령보다 먼저 작성. (2) 명령 실행 직후 출력의 오류 로그 파싱·해결을 다음 작업보다 우선. plans/v00.152.000-book-carousel.md 를 본 사이클 첫 적용. memory 시스템에 feedback 2건 + MEMORY.md 갱신.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.152.000`.",
    ],
    context: "사용자가 '남은 작업 진행' (책 카루셀 미완 마무리) + 작업 가이드 2건 등록 (plan-md / 오류 우선) 동시 지시. 본 사이클부터 모든 작업은 plans/ 폴더 계획서 선작성 → 구현 → 빌드 → commit/push 순. UserPromptSubmit hook 자가-수정은 권한 거부 → memory + plan 문서로 enforcement (사용자가 직접 settings.local.json 의 hooks 블록 승인 가능).",
  },
  {
    version: "00.151.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🩹 책 CTA 실 데이터 사용 + 영문판 미입력 시 hide + BookPage 표지",
    details: [
      "🩹 [홈 책 CTA root cause] 사용자 보고 '책 이미지 올라가있는데 홈에 반영 안 됨'. 원인: HomePage 책 CTA 섹션이 완전 하드코드 — title='왕의길', 가격 28,000/35,000, 표지 placeholder div 모두 BGNJ_BOOKS 데이터 무시.",
      "🩹 BGNJ_BOOKS.primary() 실 데이터 사용 — 대표 책 없으면 섹션 자체 hide. title / desc / publishedAt 연도 / coverDataUri (있으면 <img>, 없으면 generic placeholder).",
      "🩹 [영문판 미입력 hide] 사용자 요청 '영문판 정보 입력 안 하면 비워놔'. priceKR / priceEN > 0 인 판본만 노출. 영문판 가격 0/null 이면 영문판 카드 자체 hide. BookPage 의 판본 선택 버튼도 동일 — 단일 판본이면 1열 grid.",
      "🩹 [BookPage 표지 root fix] 'コ의길' 한자 하드코드 제거. book.coverDataUri 있으면 <img>, 없으면 generic placeholder (BANGINOJA PRESS + book.title + book.author).",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.151.000`.",
    ],
    context: "사용자 보고 책 정보가 admin → public 반영 안 됨. 원인은 home/BookPage 의 하드코드. 모든 책 정보가 admin 편집 → 즉시 public 반영되도록 정리.",
  },
  {
    version: "00.150.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🚨 등급 자동 reset 중단 — auto-trigger 전역 OFF + production deploy",
    details: [
      "🚨 [HOTFIX 등급 reset] 사용자 보고 '서버 업데이트하면 등급 초기화 그만해라'. 원인: BGNJ_GRADE_PROMO.maybePromote/maybeDemote 가 매 post/comment 생성·삭제 (총 7 사이트) 마다 호출 → admin manual 등급 할당이 metrics 자격 미달 시 자동 demote → 다음 사용자 활동에 reset.",
      "🩹 BGNJ_AUTO_GRADE_DISABLED = true 전역 플래그. 7개 auto-trigger 사이트 모두 if (!disabled) 가드. 등급 변경은 이제 admin 의 [재산정] 버튼 클릭 시에만 실행 (reevaluateAll 내부의 maybePromote/Demote 직접 호출은 변함 없음).",
      "🚀 [Production deploy] worker + D1 migration v8 (권한 4종) + v9 (page_views) 일괄 배포. 누적 사이클 v00.141 ~ v00.149 의 모든 서버 측 변경 활성화.",
      "📦 cache-buster — `?v=00.150.000`.",
    ],
    context: "사용자 화남 → 즉시 hotfix. 자동 등급 변경 OFF 가 안전한 default. 필요 시 admin 이 [재산정] 버튼으로 일괄 명시 실행.",
  },
  {
    version: "00.149.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🚨 오류 페이지 미리보기 정상화 — 100vh 제거 + React state 폴백 + embedded prop + 로드 race fix",
    details: [
      "🚨 [원인 1] ErrorCard 가 minHeight: 100vh 로 강제 → admin 미리보기 안에서 한 화면 가득 차서 레이아웃 깨져 보임. 사용자 보고 '오류 페이지 불러오기 정상 작동 안 됨'.",
      "🩹 ErrorCard 에서 100vh 제거. 새 ErrorScreen wrapper 가 라우트용 full-viewport 만 담당. 6 페이지가 embedded prop 받아서 미리보기 시 ErrorScreen 비활성.",
      "🚨 [원인 2] 이미지 onError 가 e.currentTarget.style.display = 'none' 같은 DOM mutation. React 가 다음 render 시 undo → 폴백 안 보임 + 깨진 이미지 아이콘 노출.",
      "🩹 _ErrorIllustration 을 React state(failed) 기반 폴백으로 변경. src 변경 시 useEffect 로 다시 시도. 폴백 시 ✈️ 큰 이모지 + 노란 배경 카드.",
      "🚨 [원인 3] ErrorPagesPreviewPanel 의 variants 가 window.Error*Page 를 컴포넌트 evaluate 시점에 읽음. ErrorPages.js 가 AuthAdminPage.js 다음에 로드되는데, 첫 마운트 시 undefined → '컴포넌트 불러오지 못함' 안내만 노출.",
      "🩹 useEffect + 100ms 5회 재시도 + tick state 로 강제 재평가. variants 도 useMemo([tick]) 로 갱신. 안내 메시지에 hard reload 안내 추가.",
      "🆕 [ErrorScreen export] window.ErrorScreen 도 노출 — 외부 코드에서 wrapper 만 단독 사용 가능.",
      "ℹ 워커 미변경. 일러스트 PNG 6장은 여전히 사용자가 assets/errors/ 에 직접 저장 필요.",
      "📦 cache-buster — `?v=00.149.000`.",
    ],
    context: "사용자 보고 즉시 hotfix. 3개 root cause 모두 수정 — 100vh / DOM mutation / 로드 race. 미리보기 카드는 이제 admin 패널 안에 fit. v00.148 deferred 분석 인프라는 그대로 유효.",
  },
  {
    version: "00.148.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🚨 책 데이터 안 보임 HOTFIX + page-view 분석 인프라 + 사용자 여정 서버 통합",
    details: [
      "🚨 [HOTFIX 책 데이터] 사용자 보고 '책 카탈로그 가니까 저장된 책 데이터가 모두 날아갔는데?'. 원인: boot.jsx 의 BGNJ_BOOKS.refresh() 가 admin:false 로 호출 → published 책만 fetch → draft 책은 admin 뷰에서 안 보임. 데이터 손실 아님 (D1 안전).",
      "🩹 BooksAdminPanel mount 시 BGNJ_BOOKS.refresh({ admin: true }) 강제 호출 + loading state + 빈 목록 시 안내 + [🔄 다시 불러오기] 버튼.",
      "🩹 ColumnsHubPanel 도 동일 pattern (admin:true 재fetch on mount).",
      "🩹 BooksAdminPanel commit() — await 누락 fix. 이전엔 fire-and-forget → refresh 가 stale cache 로 editing 덮어씀.",
      "🆕 [page-view 분석 인프라] schema-v9.page_views (id/route/ts/session_id/user_id/referrer_host/user_agent/ip_hash). 30일 retention GC. 익명 트래킹 — userId 옵션, IP 는 SHA-256 hash 만, referrer host 만 저장.",
      "🆕 워커 3 endpoints: POST /api/analytics/page-view (anon), GET /api/analytics/summary (admin — day/week/month + 14일 series + referrers + topRoutes), GET /api/admin/user-journey/:id (admin — 가입+게시글+댓글+강연+투어+책주문 통합).",
      "🆕 BGNJ_ANALYTICS 클라이언트 헬퍼 — sessionStorage UUID + sendBeacon 우선 + silent fail. boot.jsx route 변경 useEffect 마다 track 호출.",
      "🆕 [DashboardPanel] 실제 summary API 사용 — 일/주/월 페이지뷰 + unique 세션 + 14일 페이지뷰 추이 + 30일 referrer 분포 + 7일 인기 라우트. summary 미응답 시 명시 안내 + 폴백 (가입 추이는 항상 클라이언트 정확값).",
      "🆕 [UserJourneyPanel 서버 통합] selectedId 변경 시 /api/admin/user-journey/:id fetch → 가입/게시글/댓글/강연/투어/책 주문 통합 타임라인. 서버 미배포 시 기존 클라이언트 derive 폴백 + 상단에 데이터 출처 표시 (서버 통합 ✓ vs 클라이언트 ⚠).",
      "ℹ ★ 워커 deploy 필수 — 3개 신 endpoint + handlePostsCreate notice 강제 (v00.146 잔여) + 권한 4종 (v00.141 잔여) 누적.",
      "ℹ ★ D1 schema-v9 ALTER 필수 — page_views 테이블 추가. 미적용 시 page-view 트래킹은 silent fail (사용자 영향 없음, 분석 데이터만 누락).",
      "📦 cache-buster — `?v=00.148.000`.",
    ],
    context: "사용자 '진행 모두 다 승인' → 전 사이클 deferred 인프라 일괄 처리. 동시에 책 카탈로그 데이터 안 보임 보고 즉시 hotfix (다른 admin 패널에도 같은 patten 잠재 — 다음 사이클에 lecture/tour/grade 도 점검).",
  },
  {
    version: "00.147.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🚨 책 카탈로그 한글 IME fix + 명시 저장 + 업로드 busy + 책 메뉴 추가 + 미리보기 hide",
    details: [
      "🚨 [한글 IME root cause + 자동저장 제거] 사용자 보고 '책 카탈로그 한글 입력 안됨'. 원인: input 마다 onChange → patch → window.BGNJ_BOOKS.update 동기 호출 → setState/server fetch 가 한글 composition 중간에 React 가 re-render 하면서 IME 상태 깨짐.",
      "🩹 BooksAdminPanel local state(editing) 도입 + dirty 추적. 텍스트 필드는 local state 만 갱신, [💾 저장] 버튼 누를 때 일괄 PATCH. 책 전환 시 dirty 면 confirm. 사용자 요청 '저장 버튼 누르면 저장 반영'.",
      "🆕 [업로드 busy state] 표지/PDF 업로드 — uploadingCover / uploadingPdf state + 미리보기 영역 'overlay 표시' + 버튼 disabled + '⏳ 업로드 중…' 라벨. 업로드 자체는 즉시 patch (파일 액션은 명시 클릭).",
      "🩹 [BookPage thumbnails fix] 사용자 보고 '본문 미리보기 없으면 노출하지 마'. 이전엔 '미리보기 1/2' 빈 placeholder 항상 노출. 이제는 coverDataUri / backCoverDataUri / pdfPreviewDataUri 가 실제 있을 때만 thumbnail 노출. PDF 는 새 탭 열기 링크.",
      "🆕 [Top nav '책' 메뉴] 사용자 요청 '상단에 뱅기노자 책 볼 수 있는 메뉴'. items 배열에 { key:'book', label:'책' } 추가. column 과 community 사이.",
      "🩹 [Footer '왕의길' 제거] 사용자 요청 '하단에 왕의길은 삭제'. 책 진입은 상단 nav '책' 메뉴로 통일.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.147.000`.",
    ],
    context: "사용자 보고 4건 동시 처리. 한글 IME 는 자동저장 패턴의 근본 문제 — 모든 admin 패널이 동일 위험 (lecture/tour/category/grade 는 이미 명시 저장 또는 빠른 input). 다음 사이클에서 다른 패널도 같은 패턴 도입 검토.",
  },
  {
    version: "00.146.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🆕 커뮤니티 게시판 패널 + 사이드바 재구성 + 대시보드 6 카드 + 사용자 여정 + 공지 강제 admin",
    details: [
      "🆕 [CommunityBoardsPanel] 커뮤니티 게시판 제목/설명 전용 편집 패널. AdminCategoryPanel 의 기술적 카테고리 CRUD 와 분리. 큼직한 textarea + dirty 추적 + 단일 [💾 저장]. notice 게시판은 🔒 강제 관리자 전용 뱃지 노출.",
      "🆕 [공지 강제 admin] 워커 handlePostsCreate + 클라이언트 CommunityPage handleWrite — categoryId === 'notice' 면 비관리자 차단 (allow_write 체크박스 / postMinLevel 설정과 무관).",
      "🆕 [사이드바 그룹 재구성] 9개 그룹 — 요약·분석 / 커뮤니티 / 콘텐츠 / 프로그램 / 회원 / 쇼핑 / 사이트 설정 / 개인정보·법무 / 시스템. 비슷한 일을 하는 메뉴 인접 배치. '카테고리' → 커뮤니티 그룹, '놀자 시리즈' 흡수 → 콘텐츠 그룹, 'SEO' → 사이트 설정 그룹.",
      "🆕 [대시보드 메트릭 카드] 일/주/월 활동자 + 일일 신규 가입 4 카드 (MetricCard 컴포넌트). 14일 가입 추이 + 게시글 추이 SVG MiniBarChart 2 카드. 유입 경로 percentage bar 5 항목 (현재는 추정값 + v0.147+ 실제 referrer tracking 예정 안내).",
      "🆕 [사용자 여정 패널] 좌측 회원 목록 + 우측 선택 회원의 가입→게시글 시간순 타임라인. 월별 가입 코호트 차트. 댓글/신청/주문은 audit_log 통합 시 v0.147+ 추가 예정.",
      "ℹ 워커 deploy 필요 (handlePostsCreate notice 차단). 미배포 시 클라이언트 차단만 작동.",
      "📦 cache-buster — `?v=00.146.000`.",
    ],
    context: "사용자 요청 4건 동시 처리 — (1) 커뮤니티 게시판 콘텐츠 편집 패널 (2) 공지 강제 관리자 (3) 사이드바 재구성 (4) 대시보드 카드 + 사용자 여정. 추가로 활동량 차트 + 유입 경로 placeholder. 정확한 page-view tracking infrastructure (D1 page_views 테이블 + 워커 endpoint) 는 다음 사이클로 분리.",
  },
  {
    version: "00.145.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🛬 오류 페이지 6종 (404/500/403/401/Network/Maintenance) + admin 미리보기 패널",
    details: [
      "🛬 [pages/ErrorPages.jsx 신설] 6종 오류 페이지 — 가이드 이미지의 통일 카드 디자인 (브랜드 헤더 + 코드 + 제목 + 부연 + 일러스트 + 버튼). ErrorCard primitive + 6 export.",
      "🛬 [일러스트 자산] /assets/errors/{404,500,403,401,network,maintenance}.png. 사용자가 가이드 이미지 6장을 해당 파일명으로 저장. 누락 시 ✈️ 이모지 fallback (onError 핸들러).",
      "🛬 [boot.jsx 라우팅] default fallback (알 수 없는 라우트) 을 HomePage 가 아니라 Error404Page 로 변경.",
      "🆕 [admin 미리보기 패널] 시스템 관리 → '오류 페이지 미리보기' 탭 신설. ErrorPagesPreviewPanel — 6종 chip 선택 + inline 렌더. 미리보기 안 버튼은 noop go (콘솔 로그만).",
      "ℹ 워커 미변경. 403/401/500/Maintenance 페이지의 자동 호출 wiring (PageErrorBoundary fallback, navigator.onLine 감지 등) 은 다음 사이클로 분리.",
      "📦 cache-buster — `?v=00.145.000`. ErrorPages.js 새 script 태그.",
    ],
    context: "사용자 가이드 이미지 6장 + 일러스트 6 종 PNG 첨부 → ErrorPages.jsx 통일 카드 디자인. admin 미리보기 패널 추가 요청 즉시 반영.",
  },
  {
    version: "00.144.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🏢 푸터 — 사업자등록증 기준 회사 정보 노출 + 전화번호 제거",
    details: [
      "🏢 [contact 기본값 갱신] 주식회사 뱅기노자 / 백승기 / 사업자등록번호 551-86-02188 / 법인등록번호 110111-7817690 / 개업 2021-04-01 / 서울특별시 서초구 서초대로73길 40, 7층 13호. 이메일은 contact@bgnj.net.",
      "🏢 [Footer 사업자 정보 블록] 한국 웹사이트 표준 패턴 — 회사명·대표자·사업자등록번호·법인등록번호·설립일을 mono 11px 로 한 줄(flex wrap) 노출. 연락 컬럼에서는 전화번호 제거.",
      "🏢 [SiteContentAdminPanel] 푸터 연락 정보 폼 — phone / phoneHref 제거, companyName / ceo / bizRegNo / corpRegNo / founded 추가. admin 에서 직접 편집 가능.",
      "ℹ 워커 미변경. site_content_kv 에 옛 contact 값(phone 포함)이 있어도 fallback || 으로 신규 default 가 노출됨. admin 에서 한 번 [저장] 하면 신규 필드가 영속화.",
      "📦 cache-buster — `?v=00.144.000`.",
    ],
    context: "사용자 요청 '이용약관 참고해서 연락처 이메일 수정 + 전화번호 삭제 + 사업자등록번호 추가 + 푸터 제대로'. 사업자등록증 이미지의 모든 항목을 contact 객체에 매핑.",
  },
  {
    version: "00.143.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "📢 오픈 안내 배너 — 문구 갱신 + 메뉴 위쪽 sitewide 이동",
    details: [
      "📢 [위치 이동] 홈 hero 위 (메뉴 아래) → boot.jsx 의 Nav 위 (메뉴 위쪽 sitewide). 모든 페이지 노출. hideNav 가 true 인 페이지(로그인 등)에서는 자동 숨김.",
      "📢 [문구 갱신] '🚧 개발 중입니다' → '🌱 홈페이지를 오픈한 지 얼마 되지 않았습니다'. 사용자 요청대로 친절한 안내 + PC 버전 최적화 표기.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.143.000`.",
    ],
    context: "사용자 요청 '문구가 조금 달라졌으면 + 메뉴 위쪽에'. boot.jsx 가 sitewide 컨테이너이므로 모든 페이지에 동일 노출.",
  },
  {
    version: "00.142.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🎨 Admin UI primitives 통일 + 개인정보처리방침 미반영 fix",
    details: [
      "🎨 [Admin UI primitives] styles.css 에 .admin-panel-header / .admin-table / .status-badge / .admin-form-card / .admin-empty / .admin-toolbar / .admin-filter-chip / .admin-savebar 추가. React primitives (AdminPanelHeader, StatusBadge, AdminEmpty, AdminFilterChips, AdminSaveBar) AuthAdminPage.jsx 상단 정의.",
      "🎨 [3개 패널 통일] AdminGradePanel + AdminCategoryPanel + AuditLogPanel 을 새 primitives 로 리팩터. 헤더 (eyebrow + title + description + actions), form-card, table-wrap, status-badge, savebar 일관 적용. 인라인 style 들 중복 제거.",
      "🎨 [GradePanel SaveBar] 통합 저장 + 재산정 + 복원 버튼이 sticky 가 아닌 일관 SaveBar 로 정렬. 자동 승급 기준은 grade 행 바로 아래 dashed 선과 함께 inline 노출.",
      "🚨 [개인정보처리방침 fix] 사용자 보고 '업데이트했는데 홈페이지에서 안 보여'. 원인: LegalPage 가 boot 시점 _cache 만 의존 → admin 에서 저장해도 다른 탭/창의 페이지는 stale.",
      "🩹 LegalPage useEffect — mount 시 + slug 변경 시 + bgnj-legal-refresh 이벤트 시 항상 BGNJ_LEGAL.refresh(slug) 호출 + 강제 재렌더.",
      "🩹 BGNJ_LEGAL.save — 저장 후 BGNJ_BROADCAST.publish('legal') + 같은 탭 dispatchEvent('bgnj-legal-refresh').",
      "🩹 boot.jsx broadcast subscribe — 'legal' domain 시 두 slug 모두 refresh + 이벤트 dispatch.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.142.000`.",
    ],
    context: "v00.141 사용자 요청 '관리자페이지의 모든 GUI 통일성' 1차 패스 (3개 핵심 패널). 잔여 패널 (Lecture/Tour/Books/Member/SEO/Legal/FAQ/SiteContent) 은 다음 사이클로 분리. 동시에 사용자 보고 '개인정보처리방침 미반영' 즉시 fix — broadcast + cross-tab refresh 패턴이 사이클 v00.129 컬럼 fix 와 동일.",
  },
  {
    version: "00.141.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🆕 게시판별 권한 4종 체크박스 + 등급/자동승급 통합 패널 + 명시 저장 버튼",
    details: [
      "🆕 [게시판 권한 4종] schema-v8 — categories_kv 에 allow_read / allow_write / allow_comment_read / allow_comment_write (INTEGER DEFAULT 1) 4개 컬럼 추가. AdminCategoryPanel 행에 체크박스 4개 노출.",
      "  · 워커 enforcement: handlePostsList(allow_read=0 카테고리 비관리자 필터), handlePostGet(403), handlePostsCreate(allow_write 0 → 403), handleCommentsList(empty), handleCommentsCreate(403). admin / 슈퍼 관리자는 항상 통과. NULL/undefined (legacy) 는 fail-open 으로 호환.",
      "  · 워커 handleCategoryCreate / handleCategoryPatch: schema-v8 미적용 환경 try/catch fallback (구 INSERT / 'no such column' 시 allow_* sets 제거 후 재시도).",
      "  · 클라이언트 boot.jsx: c.allow_* 0 → false 매핑. AdminCategoryPanel update 시 BGNJ_API.categories.update(id, patch) PATCH 자동 호출.",
      "  · CommunityPage handleWrite: allowWrite=false 게시판 비관리자 제외.",
      "🆕 [등급 + 자동승급 통합 패널] AdminGradePanel + GradePromotionPanel 한 패널로 통합. 사용자 요청 '한 기능에서 진행되게 + 저장 버튼 살려주고'.",
      "  · 기존 save-on-keystroke 자동 저장 제거 → 편집은 local state, 명시적 [💾 저장] 버튼이 commit (등급 + gradeRules 동시).",
      "  · 자동 승급 기준이 grade 행 바로 아래 inline 으로 항상 편집 가능 (구 GradePromotionPanel 의 separate edit/save 모드 제거).",
      "  · dirty 추적 → 저장됨 ✓ / 변경 시 활성화. 재산정 버튼은 dirty 시 비활성 (먼저 저장하라 안내).",
      "ℹ 워커 코드 변경 — deploy 필요. D1 ALTER TABLE (schema-v8) 도 적용 필요 — 미적용 시 권한 4종은 모두 허용 (fail-open) 으로 동작.",
      "📦 cache-buster — `?v=00.141.000`.",
    ],
    context: "사용자 요청 두 건 동시 처리 — (1) 게시판별 권한 체크박스 (2) 등급/자동승급 통합 + 저장 버튼. 권한 4종 enforcement 는 schema-v8 미배포 시 fail-open (현재 동작 그대로) 으로 안전. wrangler deploy + d1 migration 은 사용자 승인 필요.",
  },
  {
    version: "00.140.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🚨 [HOTFIX] 칼럼 대표이미지 미반영 — /column 목록 + 홈 featured 둘 다 fix",
    details: [
      "🚨 [/column 목록] ColumnPage list 의 카드 이미지 영역이 항상 placeholder('01', '02'…) 만 출력 — c.coverUrl 무시. 사용자 보고 '대표이미지 설정했는데 반영이 안 되네'.",
      "🩹 ColumnPage list — c.coverUrl 있으면 <img loading=lazy objectFit=cover>, 없으면 placeholder.",
      "🚨 [홈 featured] HomePage featuredColumn 이 c.coverImage(stale field) 참조 → coverUrl 저장값과 일치 안 함. 둘 다 폴백 (coverUrl || coverImage) 으로 변경.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.140.000`.",
    ],
    context: "v00.139 직후 사용자 즉시 보고. 대표이미지 저장은 정상 작동했지만 (admin 미리보기 + DB 저장 OK) 노출 측이 stale 필드명/placeholder 만 사용해 안 보였던 것.",
  },
  {
    version: "00.139.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🆕 칼럼 대표이미지 파일 업로드 + 본문 첫 이미지 자동 폴백 + Enter 동작 합리화 + 칼럼 목록 테이블화",
    details: [
      "🆕 [대표이미지 파일 업로드] AdminColumnEditor 의 cover 필드가 URL 입력만 지원했으나, 파일 업로드 버튼 추가 (column-covers 폴더, R2). 미리보기 + 제거 버튼.",
      "🆕 [본문 첫 이미지 자동 폴백] coverUrl 빈 채로 저장하면 buildPayload 가 본문 HTML 의 첫 <img src> 를 자동으로 대표 이미지로 사용. 사용자 요청 '제일 위에 있는 이미지가 대표이미지가 되거나 혹은 대표이미지를 올리면 그걸 대표이미지로 설정'.",
      "🆕 [Enter 동작 합리화] TiptapEditor handleKeyDown — Enter 1회=<br>(hard break, 공백 없음), Enter 2회=<p>(새 단락, 공백 1줄). 단락 안에서만 적용 — 헤딩/리스트/코드블록은 default 유지. 사용자 요청 '엔터 1번 치면 줄바꿈, 2번 치면 줄바꿈+공백 1줄이 합리적'.",
      "🆕 [칼럼 목록 테이블화] ColumnsHubPanel 의 카드 그리드 → 테이블 (카테고리/제목/상태/작성일/읽기시간/액션). 사용자 요청 '카드형이 아니라 목록형으로'.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.139.000`.",
    ],
    context: "v00.138 직후 사용자 연속 보고 — 대표이미지 파일 업로드 + 본문 첫 이미지 폴백 + Enter UX + 칼럼 목록 테이블화. 강연/투어 패널은 inline 편집 UI 가 풍부해 동일 변환은 다음 사이클로 분리.",
  },
  {
    version: "00.138.000",
    date: "2026-05-02",
    datetime: "2026-05-02T00:00:00+09:00",
    summary: "🚨 [HOTFIX] 칼럼 줄바꿈 손실 root-cause + 본문 이미지 R2 파일 업로드 + 참석/노쇼 인프라",
    details: [
      "🚨 [칼럼 줄바꿈 root-cause] saveColumn 이 payload.body.text(평문) 만 D1 저장 → 재편집 시 HTML 포맷·줄바꿈·블록 전부 소실. Tiptap getHTML() 결과를 BGNJ_SAFE_HTML sanitize 후 저장하도록 변경. _toColumn 도 D1 string body 를 HTML 로 인식 (평문 백워드 호환).",
      "🆕 [본문 이미지 R2 업로드] TiptapEditor insertInlineImage 가 FileReader → dataURI base64 인라인 (D1 row 비대 + transport 비용) 대신 BGNJ_MEDIA.uploadFile → R2 URL 사용. preset='column' → 'column-images' 폴더, 'rich' / 그 외 → 'post-images' (사용자 허용 폴더).",
      "  · uploadingImage state + 버튼 disabled + '⏳ 업로드 중…' 라벨. 실패 시 alert (silent dataURI 폴백 없음).",
      "🩹 [책 추가 prompt] addBook 이 placeholder 자동값 대신 window.prompt 로 제목 입력 받음. 빈값 cancel.",
      "🆕 [참석/노쇼 인프라] BGNJ_LECTURES.markAttended + BGNJ_TOURS.markAttended (PATCH attended 1/0/null). refreshRegistrations / refreshReservations mapper 에 attended 필드 추가. 워커 attended 컬럼은 v00.136 schema-v7 에 이미 있음. 자동 승급 metrics 의 eventsAttended 는 attended=1 만 카운트 (v00.137).",
      "ℹ 워커 미변경 (deploy 불필요). 본문 이미지 업로드는 기존 /api/media/upload 사용.",
      "📦 cache-buster — `?v=00.138.000`.",
    ],
    context: "사용자 보고 '줄바꿈이 자꾸 사라지고 수정 업로드하면 줄바꿈이 다 사라지네 + 이미지는 파일로 업로드'. 줄바꿈은 saveColumn body.text 추출 root cause — html 로 변경하여 영구 fix. 이미지 업로드는 기존 R2 인프라 활용. 참석/노쇼 toggle UI 자체는 다음 사이클(LectureAdminPanel/TourAdminPanel 행 UI) 로 분리.",
  },
  {
    version: "00.134.000",
    date: "2026-05-03",
    datetime: "2026-05-03T16:20:09+09:00",
    summary: "🚨 [HOTFIX] 칼럼 사라짐 + 카테고리 chip 무반응 + KST 강제 + 칼럼 작성 모달 카테고리 추가/삭제",
    details: [
      "🚨 [칼럼 사라짐 fix] ColumnPage 가 bgnj-columns-refresh 이벤트 listener 미보유 → boot.jsx Promise.allSettled 의 비동기 refresh 완료 후에도 화면 안 바뀜 → 'columns 가 있는데 자꾸 사라지네'. ColumnPage useEffect 에 listener + 진입 시 강제 refresh 추가.",
      "🚨 [chip 카테고리 무반응 fix] ColumnCategoryChips 의 ✕ / + 가 BGNJ_SITE_CONTENT.update() 호출 — 그러나 헬퍼는 saveSection() 만 존재 (메소드명 오타). 11곳 일괄 sed 치환. 사용자 보고 '카테고리 추가 삭제를 이곳(칼럼 작성 페이지)에서 할 수 있게'.",
      "🕒 [KST 강제] 임시저장 draft 의 savedAt 가 ISO slice 로 표시(UTC 06:57 형태) → BGNJ_FMT.kstShort() 사용으로 변경.",
      "ℹ 워커 미변경.",
      "📦 cache-buster — `?v=00.134.000`.",
    ],
    context: "v00.133 직후 사용자 연속 보고 — 칼럼 사라짐(listener 누락), 카테고리 chip 무반응(메소드명 오타), KST 표기. 본 핫픽스로 모두 해결. 책 추가 '서버 응답 없음' 은 v00.132 deploy 이후 정상 (브라우저 캐시 hard reload 권장).",
  },
  {
    version: "00.132.000",
    date: "2026-05-03",
    datetime: "2026-05-03T15:58:52+09:00",
    summary: "🚨 [HOTFIX] 책 추가 '서버 응답 없음' fix — handleBooksList admin 모드 + create 폴백",
    details: [
      "🚨 사용자 보고 '책 생성 실패: 서버 응답 없음'. 원인: handleBooksList 가 WHERE status='published' 만 반환 → admin 이 draft 새 책 생성 직후 list 응답에서 빠짐 → BGNJ_BOOKS.create 의 get(res.id) 가 null → addBook alert.",
      "🩹 워커 handleBooksList — `?includeAll=1` 쿼리 + 쿠키 admin 검증 시 draft 포함 전체 반환.",
      "🩹 api.js books.list({ includeAll }) 옵션 추가.",
      "🩹 BGNJ_BOOKS.refresh({ admin }) — admin 시 includeAll. create/update/remove 모두 admin 모드로 refresh.",
      "🩹 BGNJ_BOOKS.create — get(id) 가 null 이면 BGNJ_API.books.get(id) 직접 호출 + 그것도 실패하면 payload 로 stub 반환. 절대 null 반환 안 함.",
      "★ 워커 deploy 필요.",
    ],
    context: "v00.131 책 추가 UI 변경 직후 사용자 alert 보고 → 즉시 hotfix.",
  },
  {
    version: "00.131.000",
    date: "2026-05-03",
    datetime: "2026-05-03T12:53:59+09:00", // pre-commit stamp.
    summary: "🆕 deferred 5건 일괄 — 마이페이지 재구조 + 책 추가 fix + admin broadcast + 강연 일괄 등록 + 손상 본문 점검",
    details: [
      "🆕 [마이페이지 재구조] 사용자 요청 — 추천동선/북마크 섹션 삭제. 5+1 탭 구조 (강연/답사/주문/알림/커뮤니티 활동/프로필 수정). 각 탭은 단일 카드 풀폭 레이아웃.",
      "  · 알림 탭 — slice(0,6) 제한 제거. 전체 노출.",
      "  · 커뮤니티 활동 탭 — '내가 작성한 글' 목록 (myCommunityPosts).",
      "  · 프로필 수정 탭 — ProfileEditor 컴포넌트. 이름/전화/생년월일/주소/상세주소/관심분야 PATCH /api/me. BGNJ_AUTH.updateProfile 신설.",
      "🩹 [책 추가 fix + UI 투어 패턴] 인라인 mini-form 제거. addBook → 즉시 BGNJ_BOOKS.create 기본값 + setSelectedId + setEditTab('meta'). addNewTour 와 동일 패턴. 실패 시 alert + console.error.",
      "🆕 [Admin broadcast 일관] 강연/투어/책 add·delete·save 모두 BGNJ_BROADCAST.publish 추가. 다른 탭 자동 캐시 퍼지.",
      "🆕 [강연 일괄 등록] BulkLectureImport 컴포넌트 — CSV 입력 (header + N rows). title/topic/venue/host/startsAt/durationMinutes/capacity/price/note 9 columns. 파싱 에러 행별 보고.",
      "🆕 [손상 본문 점검 도구] CorruptedBodyInspector — admin 신고 탭 상단. /v00\\.129 이하/ 또는 [object Object] 패턴 매칭. '열기' 버튼으로 원글 진입 → 작성자 재저장 시 정상화.",
      "ℹ 워커 미변경 (deploy 불필요). 모든 변경 클라이언트 측.",
      "📦 cache-buster — `?v=00.131.000` (21곳).",
    ],
    context: "사용자 '모두 일괄처리' 명시 → 5 deferred 일괄. 예상보다 광범위한 변경이지만 위험도 낮음 (각 변경 독립). 다음 사이클: 워커 endpoint 단위 테스트 + a11y audit + admin UX 추가 일관화 (회원/카테고리/등급 패널의 add/delete) 검토.",
  },
  {
    version: "00.130.000",
    date: "2026-05-03",
    datetime: "2026-05-03T12:46:00+09:00",
    summary: "🚨 [HOTFIX] 커뮤니티 글 본문 데이터 손상 — body 객체 → 문자열 변환 + placeholder fallback 제거",
    details: [
      "🚨 PostCompose body 객체 → 워커 String() 으로 [object Object] 저장 → placeholder 노출. _bodyHtmlFromPayload + _normalizePostBody 추가.",
    ],
    context: "v00.129 직후 hotfix.",
  },
  {
    version: "00.129.000",
    date: "2026-05-03",
    datetime: "2026-05-03T12:40:17+09:00", // pre-commit stamp.
    summary: "🩹 사용자 보고 묶음 일부 — 칼럼 카테고리 동적 + 부제목 + 강연 삭제 + 강연 지난/예정 + 홈 hero past fallback + BroadcastChannel",
    details: [
      "🆕 [칼럼 카테고리 동적 관리] 사용자 요청 '카테고리를 뱅기노자 칼럼 탭에서 추가삭제할수있게'. site_content_kv.columnCategories 배열로 저장. ColumnsHubPanel 상단에 추가/삭제 chip UI. AdminColumnEditor select 가 동적으로 읽음.",
      "🔄 [칼럼 form 재구조] 사용자 요청 '제목 / 부제목 / 본문 형태'. 기존 '발췌' 라벨 → '부제목' (DB 컬럼 excerpt 호환 유지). single-line input 으로 변경.",
      "🩹 [강연 삭제 fix] LectureAdminPanel 의 lecture 삭제 버튼 — async + await + try/catch. 사용자 보고 '강연삭제도 안된다'. 투어 삭제와 같은 fire-and-forget 패턴 버그.",
      "🆕 [강연 페이지 지난/예정 탭] 사용자 요청 '강연탭에서는 지난 강연과 진행 예정 강연 탭으로 나눠줘'. LecturesPage 상단에 두 chip — 'progress 예정 (N)' / '지난 강연 (N)'. 어제 기준 분리.",
      "🆕 [Hero past lectures fallback] 사용자 요청 '홈에서는 진행 예정 강연이 없으면 지난 강연을 노출 (3개 이내)'. HeroProgramCards lectures 가 upcoming 우선, 비면 최근 3개 past 폴백. 라벨도 'NEXT LECTURE' / 'RECENT LECTURE' 로 자동 전환.",
      "🆕 [BroadcastChannel cache purge] 사용자 요청 '삭제 버튼을 누르면 홈페이지를 자동으로 페이지 캐시 퍼지해서 새롭게 보이게'. window.BGNJ_BROADCAST 신설 — admin 작업 후 publish('domain') 하면 같은 origin 의 다른 탭이 자동 refresh. boot.jsx 에서 subscribe → BGNJ_LECTURES/TOURS/COLUMNS/BOOKS/COMMUNITY refresh. lecture 삭제에 적용 (다른 admin 도 다음 사이클).",
      "ℹ 워커 미변경 (deploy 불필요).",
      "📦 cache-buster — `?v=00.129.000` (21곳).",
    ],
    context: "사용자 7건 연속 보고 중 본 사이클은 6건 처리. 다음 사이클(v00.130) deferred 항목: ① 책 카탈로그 추가 안되는 원인 추가 조사 + 책 추가 UI 를 투어 폼처럼 풍부화 ② 강연 일괄 등록 (CSV 입력) ③ 모든 admin 추가/삭제 UX 일관 (메타) ④ 마이페이지 재구조 (추천동선/북마크 삭제 + 신청 강연/답사/주문/알림/커뮤니티 활동 탭 + 개인정보 수정). 각각 큰 작업이라 별 사이클로 분리.",
  },
  {
    version: "00.128.000",
    date: "2026-05-03",
    datetime: "2026-05-03T12:31:48+09:00", // pre-commit stamp.
    summary: "🩹 칼럼 발행 후 모달 자동 닫힘 + AdminColumnEditor save/remove async fix",
    details: [
      "🩹 [칼럼 발행 후 모달 자동 닫힘] AdminColumnEditor.save 가 sync 였고 onAfterSave 도 호출 안 됨 → ColumnEditorModalContent wrapper 가 닫힐 신호 받지 못해 발행 후 모달 유지됐던 버그. 사용자 보고 '칼럼 발행 완료되면 모달이 닫혀야지'.",
      "  · save() async + await + try/catch + onAfterSave?.(status) 호출.",
      "  · ColumnEditorModalContent — onAfterSave 가 status 를 받아 published / scheduled 면 onClose() 호출 (draft 는 모달 유지하여 사용자가 계속 작업 가능).",
      "🩹 [delete async fix] AdminColumnEditor.remove 도 동일 패턴 fix — async + await + try/catch (이전 fire-and-forget 으로 refresh 가 OLD 캐시 사용).",
      "ℹ 워커 미변경 (deploy 불필요).",
      "📦 cache-buster — `?v=00.128.000` (21곳).",
    ],
    context: "v00.127 직후 사용자가 칼럼 글쓰기 모달 정상 동작 확인 → 발행 버튼 누르고도 모달이 안 닫힘 보고. 원인은 같은 fire-and-forget 패턴 + AdminColumnEditor 의 onAfterSave callback 이 정의만 있고 실제 호출 누락. v00.115 admin createdAt 사이클에서 이미 발견했어야 했던 회귀 — 다음 사이클 audit 에서 'fire-and-forget 패턴 잔재' 전수 검색 권장.",
  },
  {
    version: "00.127.000",
    date: "2026-05-03",
    datetime: "2026-05-03T12:25:13+09:00", // pre-commit stamp.
    summary: "🩹 사용자 보고 4건 일괄 — 투어 삭제 작동 / 칼럼 모달 사라짐 / 타이틀 폰트 깨짐 / 칼럼 기고처+링크 추가",
    details: [
      "🩹 [투어 삭제 fix] TourAdminPanel.removeTour / toggleTourHidden / saveEdit 3종 — async + await + try/catch. 이전엔 fire-and-forget 으로 refresh() 가 OLD 캐시 사용 → 삭제 안 보임. 사용자 보고 '투어 프로그램 삭제버튼이 정상작동 안하네'.",
      "🩹 [칼럼 모달 즉시 닫힘 fix] components/Shell.jsx useModalGuard — handleAttemptClose 를 ref 패턴으로 안정화. 이전엔 자식(AdminColumnEditor) 의 onPayloadChange 가 부모 setPayload 호출 → 부모 re-render → handleAttemptClose 새 ref → useEffect cleanup → history.back() → popstate → 모달 닫힘 무한 루프. useEffect deps 를 [open] 만으로 축소.",
      "🎨 [타이틀 폰트 깨짐 fix] CSP `style-src` + `font-src` 에 `https://cdn.jsdelivr.net` 화이트리스트 추가. 이전 v00.113 CSP 도입 시 styles.css 의 wanted-sans / Chosunilbo / KBLJump CDN @import 를 누락 → 폰트 로드 차단 → 기본 폰트로 fallback. 사용자 보고 '타이틀폰트 깨진다 왜 니 맘대로 바꿔'. 폰트는 그대로, CSP 가 차단했던 것.",
      "🆕 [칼럼 기고처+링크 추가] 사용자 요청 '칼럼에는 기고처와 링크를 달수있게해줘'.",
      "  · workers/schema-v6.sql 신설 — ALTER TABLE user_columns ADD COLUMN source_credit TEXT, source_url TEXT.",
      "  · 워커 handleColumnCreate / handleColumnPatch / _toColumn — sourceCredit / sourceUrl 전달.",
      "  · data.js BGNJ_COLUMNS.saveColumn — payload 전달.",
      "  · AdminColumnEditor — '기고처' + '원문 링크' input 2종 (옵셔널, 옐로우 5% 박스).",
      "  · ColumnPage 본문 끝 — `SOURCE · 출처` 섹션. 링크 있으면 클릭 가능 + ↗ 아이콘, 없으면 텍스트만, 둘 다 비면 미노출.",
      "★ 워커 deploy 필요 — handleColumnCreate / handleColumnPatch 변경.",
      "★ schema-v6.sql 적용 필요 — `wrangler d1 execute banginoja-db --remote --file=schema-v6.sql` (1회).",
      "📦 cache-buster — `?v=00.127.000` (21곳).",
    ],
    context: "사용자가 admin 페이지에서 보고한 4건 일괄 처리. 1번 (투어 삭제) 은 async fire-and-forget 패턴 버그, 2번 (칼럼 모달) 은 useModalGuard 의 useEffect deps stale closure 버그, 3번 (폰트) 은 v00.113 CSP 도입 시 화이트리스트 누락, 4번 (기고처) 은 신규 기능. 모두 사용자 즉시 가시 항목.",
  },
  {
    version: "00.126.000",
    date: "2026-05-03",
    datetime: "2026-05-03T12:02:09+09:00", // pre-commit stamp.
    summary: "📑 CONTEXT.md v00.115~125 일괄 갱신 + auto-memory (LLM 위키) v00.125 동기화",
    details: [
      "📑 [CONTEXT.md] v00.114 → v00.126 (12 사이클 미반영) 일괄 갱신 — 본문 9 섹션 모두 정합:",
      "  · §0 요약 + §1 토폴로지: D1 28 tables (v00.123 정리 후), schema-v4/v5/seed-kv 신규 추가, 5 도구 자동화 명시.",
      "  · §2.7 자동화 — 5 도구 통합 (build / stamp-datetime / csp-hashes / check-version / check-syntax) + pre-commit 6단계 순서.",
      "  · §2.9 BGNJ_STORES — legacy categories/grades/site_content DROP (v00.123) 반영.",
      "  · §3 파일 구조 — boot.jsx, robots.txt, sitemap.xml, README.md, schema-v5.sql, seed-kv.sql, csp-hashes.mjs, check-version.mjs 추가.",
      "  · §5 히스토리 표 — v00.115~v00.126 12 행 추가.",
      "  · §6 사용자 가드 — BGNJ_FMT.won / priceOrFree 명시.",
      "  · §7 백로그 — 큐 1 비어있음 + 후보 6종 명시. 큐 4 — HTTPS/SSL 만 남음.",
      "  · §9 라인 참조 — workers/src/index.js 의 추가 헬퍼 + 신규 SQL 파일 + 신규 도구 파일.",
      "🧠 [auto-memory] ~/.claude/projects/.../memory/ — project_context_snapshot / feedback_release_workflow / project_architecture 3 파일 v00.125 시점으로 갱신 (이전 v00.052 stale, 73 사이클 미반영).",
      "ℹ 워커 미변경 (deploy 불필요).",
      "📦 cache-buster — `?v=00.126.000` (21곳).",
    ],
    context: "사용자 요청 'LLM 위키 잘 저장되어있지?' → auto-memory 점검 결과 v00.052 stale 발견 → 갱신 → CONTEXT.md 도 v00.114 stale 확인 → 사용자 'CONTEXT 도 이어서 갱신' 지시. 본 사이클로 두 위키(저장소 CONTEXT.md + LLM auto-memory) 모두 v00.125 동기화 완료. 코드/데이터 변경 없음 — 순수 문서.",
  },
  {
    version: "00.125.000",
    date: "2026-05-03",
    datetime: "2026-05-03T10:24:46+09:00", // pre-commit stamp.
    summary: "🗒 Cloudflare Secrets 이관 미진행 결정 — wrangler.toml 평문 유지 (사용자 결정)",
    details: [
      "🗒 [결정 기록] SUPER_ADMIN_EMAILS / ADMIN_BOOTSTRAP_EMAIL — 두 이메일 모두 자격 증명이 아니고 비밀번호로 보호. 평문 유지로 결정 (사용자: '마스터 메일이니까 있는건 상관없어보이기는해' / 'admin@admin.admin 은 테스트용 메일').",
      "📑 wrangler.toml 코멘트 정리 — `★ TODO: Cloudflare Secrets 이관 권장` 두 줄 제거. 결정 사유 명시.",
      "📑 ROADMAP 큐 4 — Secrets 이관 항목 ✅ 완료(미진행 결정) 표시.",
      "ℹ 워커 미변경 (코드 변동 없음 — wrangler.toml 코멘트 + ROADMAP 변경만).",
      "📦 cache-buster — `?v=00.125.000` (21곳).",
    ],
    context: "P1.2 Cloudflare Secrets 이관 항목을 사용자가 '평문 유지' 로 결정. 이메일 = 자격 증명 아님 + 비밀번호로 보호 + master 운영 이메일 + bootstrap 은 테스트 placeholder. 결정 기록 + 코멘트 정리로 사이클 마감. 큐 4 남은 항목: HTTPS/SSL 인프라 (Cloudflare 대시보드 작업) 만.",
  },
  {
    version: "00.124.000",
    date: "2026-05-03",
    datetime: "2026-05-03T09:07:29+09:00", // pre-commit stamp.
    summary: "📝 README.md 재작성 + robots.txt + sitemap.xml 신설 (P4 신규 후보 처리)",
    details: [
      "📝 [README.md] 외부 협업자용 진입 문서로 재작성. 빠른 시작 / 아키텍처 / 디렉터리 / 워크플로우 / 운영 원칙 / 보안 모델 / 검증 명령. 기존 4-line 'Deploy' 단편을 200+ line 정식 README 로.",
      "🔍 [robots.txt] 신설 — 검색엔진 전체 허용 + admin/login/mypage/checkout 색인 차단 + Sitemap 명시.",
      "🔍 [sitemap.xml] 신설 — 정적 라우트 12개 (홈/투어/강연/커뮤니티/칼럼/책/먹/자/사/FAQ/약관/개인정보). 동적 콘텐츠는 카테고리 검색 의존.",
      "ℹ P3 검증 — curl 가능 항목 (dev banner / server-first / health / categories / grades) 모두 통과. 브라우저 admin 세션 필요 항목 4건은 사용자 라이브 테스트 권장.",
      "ℹ P5 메이저 보류 — React 18.3.1 LTS 보안 EOL 미도달, Tiptap 3.22.5 안정. 재검토 시점 미도래로 코드 변경 없음.",
      "★ 워커 미변경 (deploy 불필요).",
      "📦 cache-buster — `?v=00.124.000` (21곳).",
    ],
    context: "사용자 요청 '우선순위 1-5 모두 진행'. P1.1 HTTPS/SSL 은 Cloudflare 대시보드 작업으로 안내만, P1.2 Secrets 는 정확한 값 인가 필요로 보류, P2 는 빈 큐, P3 는 curl 가능 항목 검증 통과, P4 는 README + robots + sitemap 3개 신설, P5 는 시점 미도래 확인. 본 사이클은 P4 결과물 commit.",
  },
  {
    version: "00.123.000",
    date: "2026-05-03",
    datetime: "2026-05-03T09:00:10+09:00", // pre-commit stamp.
    summary: "✅ production D1 정리 완료 — seed-kv 적용 + schema-v5 DROP. server-first 정상화 + legacy 3 테이블 제거",
    details: [
      "🌱 [seed-kv 적용] categories_kv 5 row + grades_kv 6 row 세팅 (INSERT OR IGNORE 멱등). 12 changes / 22 rows written.",
      "🧹 [schema-v5 DROP] legacy `categories` / `grades` / `site_content` 3 테이블 제거. 31 tables → 28 tables (size 405504 → 385024 bytes).",
      "✅ [server-first 정상화] /api/categories / /api/grades 가 이제 _kv 의 실데이터 반환. boot.jsx:258-279 가 응답으로 BGNJ_STORES 정상 덮어씀 → 클라이언트 시드 의존성 해소.",
      "✅ [동작 검증] 워커 health OK / /api/categories 5 row / /api/grades 6 row / 라이브 사이트 v00.122 정상 응답 / lint 깨끗 / version 동기.",
      "ℹ 라이브 사이트 동작 변화 없음 — 클라 시드와 _kv 시드가 동일 데이터라 사용자 가시 차이 0. 단 데이터 정합성/source-of-truth 측면에서 큰 정상화.",
      "📑 ROADMAP 큐 4 — seed-kv / schema-v5 두 항목 완료 표시.",
      "📦 cache-buster — `?v=00.123.000` (21곳).",
    ],
    context: "v00.122 의 seed-kv.sql 작성을 사용자가 인가 → 두 명령 순차 실행 (seed → DROP). v00.121 진단에서 발견된 _kv empty + legacy 잔재 문제 완전 해소. 큐 4 남은 항목: HTTPS/SSL 인프라 + Cloudflare Secrets 이관 (모두 사용자 환경 작업).",
  },
  {
    version: "00.122.000",
    date: "2026-05-03",
    datetime: "2026-05-03T01:32:58+09:00", // pre-commit stamp.
    summary: "🌱 categories_kv / grades_kv 시드 마이그 SQL 신설 (seed-kv.sql) — production D1 source-of-truth 회복 준비",
    details: [
      "🌱 [workers/seed-kv.sql] 신설 — DEFAULT_CATEGORIES 5종 + DEFAULT_GRADES 6종 → categories_kv / grades_kv 로 INSERT OR IGNORE. 멱등 (여러 번 실행 안전).",
      "  · 카테고리: notice / free / question / info / column. notice/column 만 admin only (post_min_level 100), 나머지는 0 (v00.117 trap 해소 정합).",
      "  · 등급: guest / member / reader / scholar / wangsanam / admin. DEFAULT_GRADES 와 색상/레벨 1:1 일치.",
      "🩹 [순서] (1) seed-kv.sql 적용으로 _kv 채움 → (2) 검증 → (3) schema-v5.sql DROP. 한 번에 두 명령 실행 시 데이터 손실 없음 보장.",
      "📑 ROADMAP.md 큐 4 — 'seed-kv.sql 적용' 신규 항목 추가, schema-v5 는 seed 이후로 명시.",
      "ℹ 사이트 동작 변화 없음 — 클라이언트 시드 + localStorage 가 이미 동일 데이터 보유. seed-kv 이후엔 server-first 가 작동, boot.jsx:258-279 가 응답으로 BGNJ_STORES 정상 덮어씀.",
      "📦 cache-buster — `?v=00.122.000` (21곳).",
    ],
    context: "v00.121 진단으로 발견된 _kv empty + legacy 잔재 정리 작업. schema-v5 DROP 의 안전 사전 단계. seed → schema-v5 순서로 두 사용자 인가 필요. 본 사이클은 SQL 작성 + 문서화만, 실제 production 적용은 사용자 인가 시점.",
  },
  {
    version: "00.121.000",
    date: "2026-05-03",
    datetime: "2026-05-03T01:29:01+09:00", // pre-commit stamp.
    summary: "🚧 홈페이지 개발 중 배너 + schema-v5 DROP 보류 (legacy/_kv 진단 재검증)",
    details: [
      "🚧 [개발 중 배너] HomePage 상단 — '개발 중입니다. 오류 발견 시 왕사들 오픈톡방에 알려주세요' 배너 추가. 옐로우 5% 적용 (--gold-dim border + 12% bg). role='status' aria-label 적용.",
      "🩹 [schema-v5 DROP 보류] production D1 검증 결과 categories_kv (0 rows) / grades_kv (0 rows) — 실제로 비어있음. legacy categories (5) / grades (6) 에 row 가 있으나 워커는 _kv 만 read, 클라는 boot.jsx:258-279 에서 빈 응답 시 BGNJ_STORES seed (DEFAULT_CATEGORIES/GRADES) 폴백. → 사이트는 클라이언트 시드 + localStorage 만으로 동작. legacy/_kv 모두 사이트 의존성 없음.",
      "ℹ DROP 자체는 안전(아무도 read 안 함)하나 데이터 정합성 측면에서 _kv 가 비어있는 게 정상은 아님. 별 사이클(v00.122+)에서 admin UI 로 카테고리/등급 명시 INSERT 한 뒤 정리 권장.",
      "📦 cache-buster — `?v=00.121.000` (21곳).",
    ],
    context: "v00.120 worker GC deploy 후 사용자가 schema-v5 DROP 인가 → pre-DROP 검증 단계에서 _kv 비어있음 발견 → DROP 보류 + 진단 재검증. 시나리오 #2 (클라이언트 시드 폴백) 확정. 사용자 요청에 따라 홈페이지 베타 안내 배너 추가.",
  },
  {
    version: "00.120.000",
    date: "2026-05-02",
    datetime: "2026-05-02T15:45:15+09:00", // pre-commit stamp.
    summary: "🧹 정적 audit 후속 5종 일괄 — formatPrice 통합 + JSON-LD + version 검증 hook + audit_log/notifications GC",
    details: [
      "💰 [BGNJ_FMT.priceOrFree] 통합 헬퍼 — 0/null/undefined → '무료', 그 외 won() 적용. LecturesPage / WangsanamTourPage 의 중복 formatPrice 호출 위임.",
      "🔍 [JSON-LD structured data] index.html 에 Organization + WebSite 스키마 inline. 검색엔진/소셜 카드 풍부화. 현재 sameAs 빈 배열 — SNS 계정 도입 시 추가.",
      "🤖 [tools/check-version.mjs] 신설 — BGNJ_VERSION.version 과 index.html 의 모든 ?v= cache-buster 일치 검증. 불일치 시 pre-commit 차단. install-hooks.sh 단계 3에 통합.",
      "🧹 [audit_log GC] auditWrite 헬퍼 — INSERT 후 1/20 확률로 30일 이상 된 row DELETE. unbounded growth 차단.",
      "🧹 [notifications GC] insertNotification 헬퍼 — INSERT 후 1/50 확률로 90일 이상 + read=1 row DELETE. unread 알림은 보존 (사용자가 미열람).",
      "ℹ login_attempts 는 v00.113 부터 1/10 확률 24h GC 이미 적용. 이번 사이클로 모든 unbounded 테이블 GC 완비.",
      "★ 워커 deploy 필요 — auditWrite / insertNotification 변경.",
      "📦 cache-buster — `?v=00.120.000` (21곳).",
    ],
    context: "ROADMAP 큐 1 빈 상태에서 Explore audit 으로 신규 후보 발굴. 5종 모두 LOW~MED, 위험도 낮음. JSON-LD 는 SEO 풍부화, version-check 은 사고 방지(브라우저가 옛 JS 캐시), GC 는 D1 디스크 압박 차단. 큐 1 다음 후보: style-src 'unsafe-inline' 제거 (Tiptap 마이그 또는 className 일괄 refactor 필요 — 별 사이클).",
  },
  {
    version: "00.119.000",
    date: "2026-05-02",
    datetime: "2026-05-02T15:04:41+09:00", // pre-commit stamp.
    summary: "🧹 legacy `categories` / `grades` / `site_content` 테이블 deprecation (ROADMAP 큐 1 마무리)",
    details: [
      "🧹 [legacy 테이블 정리] schema.sql 의 `categories` / `grades` / `site_content` 정의 + 시드 INSERT 블록에 DEPRECATED 마커 + 안내 주석 추가. 워커 코드는 이미 v00.040+ 부터 `categories_kv` / `grades_kv` / `site_content_kv` (schema-v3.sql) 만 read/write — legacy 테이블은 무시되는 row 잔재 상태.",
      "📑 [workers/schema-v5.sql 신설] legacy 테이블 3개 DROP 명령. 사용자가 검증 후 1회 수동 실행 (★ ROADMAP 큐 4 항목): `wrangler d1 execute banginoja-db --remote --file=schema-v5.sql`. 안전 검증 명령(SELECT COUNT) 안내 포함.",
      "ℹ 워커 바이너리 변경 없음 — schema-v5.sql 적용 전후로 워커 read/write 흐름 동일. 디스크/관리 부담 정리 효과만.",
      "ℹ schema.sql 의 DEPRECATED 블록은 호환성 위해 정의 보존. 신규 D1 인스턴스에서 IF NOT EXISTS 가 빈 테이블 생성하지만 즉시 schema-v5.sql DROP 으로 정리 가능.",
      "📦 cache-buster — `?v=00.119.000` (21곳).",
    ],
    context: "ROADMAP 큐 1 두 번째이자 마지막 항목 처리. v00.118 (CSP) + v00.119 (legacy schema) 로 큐 1 완료. 큐 2 (워커 deploy) 는 v00.116 hotfix 로 비어있음. 큐 4 (사용자 수동) 에 schema-v4 / schema-v5 / Cloudflare Secrets / HTTPS SSL 4 항목.",
  },
  {
    version: "00.118.000",
    date: "2026-05-02",
    datetime: "2026-05-02T10:46:44+09:00", // pre-commit stamp.
    summary: "🔒 CSP `'unsafe-inline'` (script-src) 제거 — 인라인 script SHA-256 해시 자동 동기 (ROADMAP 큐 1)",
    details: [
      "🔒 [strict-script] CSP `script-src` 디렉티브에서 `'unsafe-inline'` 제거. 인라인 `<script>` 3종(theme bootstrap / SW unregister+SPA fallback+force-https / Tiptap importmap) 은 각각 `'sha256-XXX'` 해시로 명시 화이트리스트.",
      "🤖 [tools/csp-hashes.mjs] 신설 — index.html 의 인라인 `<script>` 본문을 자동 추출 → SHA-256 base64 해시 → CSP meta 의 script-src 디렉티브 자동 갱신. idempotent.",
      "  · pre-commit hook 에 통합 (stamp-datetime 다음, build 이전). 인라인 script 변경 시 해시 자동 동기.",
      "  · install-hooks.sh 갱신 — 단계 1~6 (stamp / csp / stage / build / stage / lint).",
      "ℹ 정적 호스팅(GitHub Pages) 환경에서는 server-side nonce 주입 불가 — SHA-256 해시가 정적 콘텐츠 표준 해법. nonce 와 동등한 보안 수준 (실행 가능한 정확한 본문만 허용).",
      "ℹ style-src 'unsafe-inline' 은 유지 — Tiptap 의 인라인 style 의존도 + React 컴포넌트 JSX style prop 가 광범위. style 별 사이클로 분리.",
      "📦 cache-buster — `?v=00.118.000` (21곳).",
    ],
    context: "ROADMAP 큐 1 v00.116+ 항목 처리. 큐 1 의 다른 항목(legacy schema cleanup) 은 v00.119 별 사이클로. style-src 'unsafe-inline' 은 Tiptap 마이그레이션 또는 CSS-in-JS 분리 후 별도 처리. v00.118 은 이미 가장 영향 큰 attack surface(XSS payload 인라인 주입)을 차단.",
  },
  {
    version: "00.117.000",
    date: "2026-05-02",
    datetime: "2026-05-02T08:42:28+09:00", // pre-commit stamp.
    summary: "🧹 안정성 audit 잔재 일괄 정리 — BGNJ_FMT.currency + createPost createdAt 보존 + postMinLevel 기본값 trap 해소",
    details: [
      "💰 [BGNJ_FMT.currency / won] 헬퍼 신설 — 사용자 브라우저 locale 무관 ko-KR 강제 천 단위 콤마. won() = currency() + '원'.",
      "💰 [toLocaleString sweep] 16곳 일괄 마이그 — 가격 포맷 (BookCheckout 11 / AuthAdmin 5 / Lectures 1 / Tour 1 / Home 1 / MyPage 1) + data.js 영수증 생성 3 (currency 1 + kstDateTime 2).",
      "🩹 [createPost createdAt 보존] data.js BGNJ_COMMUNITY.createPost (sync local fallback) — payload.createdAt 명시 시 보존. 서버 실패 시 admin 의 시간 오버라이드가 로컬 표시에서도 일관 유지.",
      "🛟 [postMinLevel UX trap 해소] AdminCategoryPanel 신규 카테고리 기본값 minLevel/postMinLevel 10 → 0. schema-v3.sql post_min_level DEFAULT 10 → 0. 신규 카테고리가 자동으로 일반 사용자 잠금되던 trap 차단.",
      "📑 [BGNJ_GUARD load-order] 페이지의 `const G = window.BGNJ_GUARD` 는 컴포넌트 함수 본체 내부 호출 → render 시점 = data.js 로드 후라 race 없음. inline fallback 추가는 over-engineering 으로 판단, 본 사이클 미적용.",
      "ℹ 워커 미변경 — schema-v3.sql 은 IF NOT EXISTS 라 기존 row 영향 없음. 신규 카테고리 생성 시점부터 새 default 적용.",
      "📦 cache-buster — `?v=00.117.000` (21곳).",
    ],
    context: "사용자 요청 '기능 안정성 검토 결과를 기반으로 모두 수정 반영'. v00.115/116 audit 의 LOW 항목 4개 처리: ① toLocaleString 정합 (locale 의존성) ② 로컬 폴백 createdAt 미보존 ③ postMinLevel 기본값 10 (UX trap) ④ pages 의 G 변수 fallback. ④ 는 실측 결과 안전(load order 보장)으로 코드 변경 미적용. 나머지 3개 적용.",
  },
  {
    version: "00.116.000",
    date: "2026-05-02",
    datetime: "2026-05-02T08:07:00+09:00", // pre-commit stamp.
    summary: "🩹 v00.115 안정성 hotfix — 슈퍼 admin rate limit 예외 + updatePostRemote createdAt 전달",
    details: [
      "🚨 [HIGH 운영위험 fix] checkRateLimit — SUPER_ADMIN_EMAILS / ADMIN_BOOTSTRAP_EMAIL 매칭 이메일은 throttle 제외. 슈퍼 관리자가 비번 5회 실수 시 15분 잠금되던 운영 위험 차단.",
      "🩹 [MEDIUM 데이터 흐름 fix] BGNJ_COMMUNITY.updatePostRemote — patch.createdAt 가 있으면 apiPatch 에 포함 → 워커 handlePostPatch 까지 전달. 기존엔 admin 이 글 수정 시 createdAt input 입력해도 워커로 전송 안 됐음.",
      "ℹ 발견 출처: v00.115 직후 기능 안정성 재검토 audit. HIGH 1, MEDIUM 1 처리.",
      "ℹ 미처리 LOW 항목 (다음 사이클 후보): toLocaleString 11곳 → BGNJ_FMT.currency 도입 검토. CommunityPage 로컬 폴백 createPost 가 createdAt 미보존 (서버 실패 시 표시 시간 mismatch — 드문 edge case).",
      "★ 워커 deploy 필요 — checkRateLimit 변경.",
      "📦 cache-buster — `?v=00.116.000` (21곳).",
    ],
    context: "사용자 요청 '기능적 안정성 재검토' → Explore agent 로 전수 audit. v00.115 의 admin createdAt + 홈페이지 안정화 변경분이 운영 회로에 어떻게 통합됐는지 검증. HIGH 1건 (admin 본인이 자기 잠금 trap) + MEDIUM 1건 (수정 흐름 데이터 누락) 즉시 fix. 나머지는 정보성 (LOW) 또는 미래 사이클 (toLocaleString sweep, fallback createPost 보강).",
  },
  {
    version: "00.115.000",
    date: "2026-05-01",
    datetime: "2026-05-02T07:50:35+09:00", // pre-commit stamp.
    summary: "🕒 admin 게시글/칼럼 작성 시 표시 시간(created_at) 오버라이드 + 🛡 홈페이지 안정화 hardening",
    details: [
      "🕒 [admin createdAt 오버라이드] 워커 + 클라이언트 양쪽 — admin 이 글/칼럼 작성·수정 시 표시 시간을 임의 KST 시각으로 지정 가능. 일반 사용자는 createdAt 필드 무시(보안).",
      "  · 워커: resolveCreatedAt 헬퍼 (ISO 8601 검증 + admin only). handlePostsCreate / handlePostPatch / handleColumnCreate / handleColumnPatch 4 endpoint 적용.",
      "  · user_columns INSERT — created_at 컬럼 명시 추가 (이전엔 default 의존).",
      "  · 클라이언트: BGNJ_COMMUNITY.createPostRemote / BGNJ_COLUMNS.saveColumn 가 payload.createdAt 있으면 body 에 포함.",
      "  · UI: PostCompose (모든 사용자 게시글 작성, admin 만 표시) + AdminColumnEditor 에 datetime-local input. KST 가정 → '+09:00' 부착.",
      "🛡 [홈페이지 안정화] HomePage.jsx — BGNJ_GUARD 미로드 race 시 인라인 fallback (arr/call) 으로 페이지 깨짐 방지. NaN startsAt 가 sort 결과 깨뜨리던 패턴을 _validStarts (Date.parse !isNaN) 로 차단.",
      "  · HeroProgramCards 의 lectures/tours filter — _validStarts 로 invalid date 사전 제거.",
      "  · HomePage main G 변수 fallback — arr/call 인라인 정의로 BGNJ_GUARD 미로드 시에도 동작.",
      "ℹ 본 사이클은 워커 변경 포함 — ★ wrangler deploy 필요.",
      "📦 cache-buster — `?v=00.115.000` (21곳).",
    ],
    context: "사용자 요청 1 — '관리자페이지에서 글을 쓸 때에는 업로드 시점에 찍히는 시간을 조정할 수 있게' = createdAt 오버라이드. 일반 홈페이지(작성 완료 = 업로드 시점)는 그대로 유지하고 admin 만 추가 input 노출. 사용자 요청 2 — '홈페이지 안정화' = HeroProgramCards 류 race condition 재발 방지. v00.110 의 G undefined 사고처럼 BGNJ_GUARD 미로드 시점이 다시 발생할 수 있어 인라인 fallback 추가.",
  },
  {
    version: "00.114.000",
    date: "2026-05-01",
    datetime: "2026-05-01T22:00:57+09:00", // pre-commit stamp.
    summary: "🧹 lint false-positive 차단 (TODO 코멘트만 / equality_loose `== null` idiom 제외) + 📑 CONTEXT.md v00.114 일괄 갱신",
    details: [
      "🧹 [TODO 룰 정정] tools/check-syntax.mjs INFO_RULES — pattern 을 `// TODO`, `/* TODO`, `* TODO` (JSDoc 행) 로 한정. 이전엔 `\\b(TODO|FIXME|HACK|XXX)\\b` 가 ADMIN_VERSION_HISTORY 변경기록 문자열 내 'TODO' 단어 6건을 false-positive 매치.",
      "🧹 [equality_loose 룰 정정] pattern 에 lookahead `(?!\\s*null\\b)` 추가 — `== null` / `!= null` idiom (null + undefined 동시 검사 의도) 매치 제외. 이전 12 건 (실제 6 건 + 빌드 산출물 .js 중복) 카운트 → 0.",
      "📑 [CONTEXT.md 일괄 갱신] v00.071 → v00.114 (41 사이클 미반영) 정합. §0 요약(esbuild + R2 + KST + DOMPurify), §1 토폴로지(boot.js 외부화 + R2 폴더 + login_attempts), §2.1 헬퍼 32종 목록, §2.3 PageErrorBoundary 위치 (boot.jsx:64), §2.7 자동화 3 도구 (build/stamp-datetime/check-syntax) + 4종 차단 룰 + 3종 정보성, §2.8 cache-buster 17 → 21곳, §2.9 BGNJ_STORES 4-태그 갱신 (login_attempts 추가, comments 사망 표시), §3 파일 구조에 boot.jsx / tools/build.mjs / tools/stamp-datetime.mjs / pages/admin/* / schema-v4.sql 추가, §5 히스토리 v00.072~114 한 줄 요약 표, §6 사용자 가드에 BGNJ_SAFE_HTML / BGNJ_FMT 의무 추가, §7 백로그 ROADMAP 큐 1~4 동기, §7.5 단계 3 ✅ 완료 표시, §8 검증 명령에 build.mjs / wrangler d1 execute / wrangler deploy 추가, §9 라인 참조 전부 갱신.",
      "📦 cache-buster — `?v=00.114.000` (21곳).",
    ],
    context: "사용자 요청 '계획 대비 전체기능 완성도 검토 → 부족한 것 모두 갱신'. v00.113 audit 에서 stale CONTEXT.md (v00.071 기준) + lint false-positive 12+6 건 확인. 본 사이클: ① 룰 false-positive 근본 차단 (string 내부 TODO / null idiom 정상 인정) ② CONTEXT.md v00.114 일괄 갱신 — 새 사이클 시작 시 이 문서만 읽으면 v00.039~114 모든 누적 컨텍스트 파악 가능하도록. lint 룰 변경은 false-positive 만 제거 — 실제 코드 cleanup 0 건 (모두 정상 idiom 이었음).",
  },
  {
    version: "00.113.000",
    date: "2026-05-01",
    datetime: "2026-05-01T19:44:52+09:00", // pre-commit stamp.
    summary: "🔒 전체 CSP 헤더 + 🔒 brute-force rate limiting (D1 login_attempts) + 🔒 v00.111 post_min_level deploy",
    details: [
      "🔒 [CSP 전체] index.html meta — default-src 'self' / script-src 'self' 'unsafe-inline' + esm.sh + unpkg / style-src 'self' 'unsafe-inline' + googleapis / font-src 'self' + gstatic / img-src 'self' data: blob: https: / connect-src 'self' + 워커 + esm.sh / frame-src YouTube/Vimeo / object-src 'none' / base-uri 'self' / form-action 'self' / frame-ancestors 'self'.",
      "  · 'unsafe-inline' 유지 — 부트스트랩 inline `<script>` (theme/SW unregister/Tiptap import map) 의존. nonce 기반 strict-dynamic 은 별 사이클.",
      "🔒 [brute-force rate limit] 워커 — login + signup 에 IP+이메일 단위 throttle. 최근 15분 실패 5회 이상이면 429 + remaining 분.",
      "  · D1 schema-v4.sql 신설 — login_attempts (id/email/ip/ok/attempted_at) + idx_email_time + idx_ip_time. ★ 사용자 1회 실행 필요: `wrangler d1 execute banginoja-db --remote --file=workers/schema-v4.sql`",
      "  · INSERT 시 1/10 확률 GC — 24h 이전 행 삭제 (테이블 무한 증가 방지).",
      "  · 테이블 부재 시 graceful pass — schema 미적용해도 라이브 영향 없음.",
      "🔒 [워커 deploy 일괄] v00.111 (post_min_level) + v00.113 (rate limit) 묶어서 wrangler deploy.",
      "📦 cache-buster — `?v=00.113.000` (20곳).",
      "ℹ 남은 audit 잔재: SUPER_ADMIN_EMAILS / ADMIN_BOOTSTRAP_EMAIL → Cloudflare Secrets (사용자 수동 — `wrangler secret put`).",
    ],
    context: "v00.109 audit 잔재 일괄 마무리. CSP 는 break 위험 (script-src 누락 도메인 시 사이트 깨짐) 대비 'unsafe-inline' + esm.sh/unpkg 화이트리스트로 보수적 설정. rate limit 은 D1 기반 (KV namespace 셋업 불필요) — 향후 트래픽 증가 시 KV/Durable Objects 로 이전. v00.111 worker 코드는 commit 5ddcf25 부터 대기 중이었음 — 본 사이클에 함께 deploy.",
  },
  {
    version: "00.112.000",
    date: "2026-05-01",
    datetime: "2026-05-01T18:43:32+09:00", // v00.111+ — pre-commit 훅에서 tools/stamp-datetime.mjs 가 실제 commit 시간(KST)으로 자동 치환.
    summary: "🔒 BGNJ_SAFE_HTML hardening — iframe src 화이트리스트 / data: URI image-only / target=_blank noopener 강제 + ROADMAP 갱신",
    details: [
      "🔒 [BGNJ_SAFE_HTML hooks] DOMPurify hook 3종 등록 — sanitize 호출 시 1회 install (idempotent).",
      "  · uponSanitizeElement(iframe) — src URL 파싱 후 host 가 (www.)?youtube.com / youtube-nocookie.com / youtu.be / player.vimeo.com 만 통과. 그 외 노드 자체 제거.",
      "  · uponSanitizeAttribute(a, target=_blank) — rel='noopener noreferrer' 자동 부여. tabnabbing 방어.",
      "  · uponSanitizeAttribute(* src, data:*) — data:image/(png|jpe?g|gif|webp|svg+xml|avif) 만 keepAttr. data:text/html 등 차단.",
      "  · uponSanitizeAttribute(a href, data:*) — 무조건 차단 (data:text/html 다운로드 트릭).",
      "📑 ROADMAP.md 갱신 — v00.105~111 회고 1줄씩 추가 + 큐 1 (v00.113 CSP / v00.114 rate limit / v00.115 Secrets) + 큐 2 (v00.111 worker deploy 보류) 분류.",
      "📦 cache-buster — `?v=00.112.000` (20곳).",
      "ℹ 워커 미변경 — 본 사이클은 정적 자산만. v00.111 worker (post_min_level) deploy 는 별도 인가 사이클.",
    ],
    context: "v00.109 audit 잔재 마무리 — DOMPurify 가 화이트리스트 모드라 SVG 등 default 차단되지만 ① iframe 도메인 미검증 ② data: URI src 가 image MIME 외도 통과 ③ a[target=_blank] noopener 미강제 (tabnabbing) 3가지 hardening 필요. uponSanitizeElement/Attribute hook 으로 통합 처리. 큐 1 의 다음 사이클 v00.113 (전체 CSP) 은 inline script 의존도 분석 + nonce 검토 필요해 별 사이클로 분리.",
  },
  {
    version: "00.111.000",
    date: "2026-05-01",
    datetime: "2026-05-01T18:36:47+09:00", // v00.111 — pre-commit 훅에서 tools/stamp-datetime.mjs 가 실제 commit 시간(KST)으로 자동 치환.
    summary: "🤖 datetime 자동 stamp 도입 + 🔒 게시판 작성 권한 검증(post_min_level) + 🔒 클릭재킹 방어(X-Frame-Options/CSP frame-ancestors)",
    details: [
      "🤖 [tools/stamp-datetime.mjs] 신설 — pre-commit hook 단계에서 ADMIN_VERSION_HISTORY 첫 entry 의 `datetime: new Date().toISOString()` sentinel 을 실제 KST(+09:00) ISO 문자열로 자동 치환. v00.107~109 hardcode 추정값 사고 (사용자 보고 '18:00 인데 KST 20:00') 재발 방지.",
      "  · install-hooks.sh — hook 순서: stamp-datetime → 자동 stage → build → stage .js → check-syntax.",
      "  · 동작 검증: regex `/(datetime:\\s*)new Date\\(\\)\\.toISOString\\(\\)(\\s*,)/` 첫 매치만 치환 → 옛 entries hardcode datetime 은 보존.",
      "🔒 [HIGH 게시판 권한 검증] 워커 handlePostsCreate — categories_kv.post_min_level vs grades_kv.level 비교, 미달 시 403. 이전엔 client-side 만 차단 → API 직접 호출로 우회 가능했음 (v00.109 audit MEDIUM).",
      "  · 부수: SELECT 대상 categories → categories_kv 로 교체 (기존엔 legacy 테이블 참조).",
      "  · admin / 슈퍼 관리자 / post_min_level 0 또는 미설정 카테고리는 통과.",
      "🔒 [MEDIUM 클릭재킹] index.html — `<meta http-equiv=\"X-Frame-Options\" content=\"SAMEORIGIN\">` + `<meta http-equiv=\"Content-Security-Policy\" content=\"frame-ancestors 'self'\">`. 외부 도메인 iframe 임베드 차단.",
      "  · meta CSP frame-ancestors 는 일부 브라우저 미지원 → X-Frame-Options 와 병행. 향후 워커가 전 응답에 헤더 부착 시 frame-ancestors 가 메인 방어선.",
      "★ 워커 deploy 필요 — handlePostsCreate 변경.",
      "📦 cache-buster — `?v=00.111.000` (20곳).",
    ],
    context: "v00.110 사용자 피드백 'datetime hardcode 가 미래 시간으로 적힘' → 재발 방지 자동화 (stamp-datetime). 동시에 v00.109 보안 audit 잔재 중 즉시 가능한 두 항목 처리: 게시판 권한 (board-level access control) + 클릭재킹. 남은 audit 항목: SUPER_ADMIN_EMAILS Cloudflare Secrets 이관 (사용자 수동), brute-force rate limiting (Workers KV), 전체 CSP 헤더 (script-src/style-src 등), SVG 본문 sanitize.",
  },
  {
    version: "00.110.000",
    date: "2026-05-01",
    datetime: "2026-05-01T18:07:35+09:00", // v00.111 — 실제 git commit 시간 (f9a7363) 으로 정정. 이전 new Date().toISOString() 은 build 시점 추정.
    summary: "🩹 홈 hero ReferenceError fix (HeroProgramCards `G` 미정의) + v00.107~v00.109 datetime 실제 commit 시간으로 정정",
    details: [
      "🩹 [hero crash fix] HeroProgramCards (v00.106 module-scope 컴포넌트) 가 HomePage 함수 내부의 const G = window.BGNJ_GUARD 를 참조 → ReferenceError. window.BGNJ_GUARD 직접 참조 + 로컬 _arr 헬퍼 정의로 fix. 사용자 보고 '히어로페이지 불러오지 못했데'.",
      "🕒 fmtDate 헬퍼 → BGNJ_FMT.kstFriendly 위임 + 폴백 (BGNJ_FMT 미로드 시).",
      "🕒 [datetime 정정] v00.106~v00.109 entries 의 datetime 필드를 실제 git commit 시간(KST) 으로 정정. 이전엔 추정값 hardcode 라 미래 시간 표시 (사용자 보고: 18:00 인데 KST 20:00 으로 나옴).",
      "  · v00.106: 17:45:05 KST (commit d085c12)",
      "  · v00.107: 17:47:50 KST (commit f9420fa)",
      "  · v00.108: 17:53:00 KST (commit 6ed27ba)",
      "  · v00.109: 18:02:52 KST (commit 049c8c8)",
      "  · v00.110: new Date().toISOString() — 실시간 시점. 이상적으로는 git commit hook 으로 자동 stamp (다음 사이클).",
      "ℹ KST = UTC+9 = GMT+9 — 시스템상 정확. 표시 깨짐은 entry 의 hardcode 값 실수.",
      "📦 cache-buster — `?v=00.110.000` (20곳).",
    ],
    context: "사용자 보고 ① '히어로페이지 불러오지 못했데' (콘솔 G is not defined) ② 'KST 가 18:00 인데 20:00 으로 나오네' — 둘 다 본 사이클 fix. ②는 KST 자체 문제가 아닌 ADMIN_VERSION_HISTORY entry 의 hardcoded datetime 이 실제 commit 시간보다 미래로 적힌 추정 실수. v00.106~v00.109 모두 실제 시간으로 정정. 다음 사이클: pre-commit / build hook 에서 datetime 자동 stamp 검토 + 사용자 secrets 이관 + rate limit 등 보안 audit 잔재.",
  },
  {
    version: "00.109.000",
    date: "2026-05-01",
    datetime: "2026-05-01T18:02:52+09:00", // v00.110 — 실제 git commit 시간으로 정정 (이전 hardcoded 20:00 은 추정값)
    summary: "🔒 보안 audit + 즉시 fix — DOMPurify XSS / R2 파일 검증 / HTTP origin 제거 / 워커 deploy",
    details: [
      "🔒 [CRITICAL XSS fix] DOMPurify 도입 (CDN + SRI 검증) + BGNJ_SAFE_HTML 헬퍼. 모든 dangerouslySetInnerHTML 5곳 sanitize 적용 — LegalModal, PostViewerModal (admin), CommunityPage post detail, LegalFaqPages, ColumnPage. 화이트리스트 태그/속성 (Tiptap 무료 extension 호환).",
      "🔒 [HIGH R2 보안] 워커 handleMediaUpload 강화 — ① 폴더별 권한 분기 (post-*/lecture-*/tour-* 는 requireUser, 그 외 admin) — v00.103 사용자 첨부가 admin only 였던 모순 해소 ② 확장자 화이트리스트 (이미지/문서/미디어/압축 22종, 실행 파일 차단) ③ 50MB hard cap ④ 폴더명 path traversal 차단.",
      "🔒 [MEDIUM CORS] wrangler.toml ALLOWED_ORIGINS 에서 http:// 항목 3개 제거. https-only.",
      "🔒 [INFO] DOMPurify CDN — unpkg.com/dompurify@3.4.2 + sha384 SRI hash. 미로드 시 fail-closed (빈 문자열 반환).",
      "★ wrangler deploy — Version c1f42817-9afa-4628-bc65-8aa88536262b.",
      "📦 cache-buster — `?v=00.109.000` (20곳).",
      "ℹ TODO (v00.110+): SUPER_ADMIN_EMAILS / ADMIN_BOOTSTRAP_EMAIL → Cloudflare Secrets (사용자 수동: `wrangler secret put`). brute-force rate limiting (Workers KV). CSP 헤더. SVG 본문 sanitize.",
    ],
    context: "사용자 요청 '보안 이슈 전반적으로 점검' → Explore agent 로 전수 audit. 결과: CRITICAL 1 (XSS) / MEDIUM 다수 (R2 검증 / HTTP origin / brute-force / SUPER_ADMIN secrets / CSP / 게시판 권한 / esm.sh SRI). 본 사이클에 즉시 fix 가능한 4종 (XSS / R2 / HTTP origin / DOMPurify CDN) 처리. 사용자 수동 작업이나 더 큰 구조적 변경 (rate limit / Secrets 이관 / CSP) 은 차후 사이클로 분리.",
  },
  {
    version: "00.108.000",
    date: "2026-05-01",
    datetime: "2026-05-01T17:53:00+09:00", // v00.110 — 실제 commit 시간 정정
    summary: "🕒 BGNJ_FMT formatToParts fix + 사이트 전반 KST sweep + KMS DEPENDENCY_MATRIX 갱신",
    details: [
      "🐛 [v00.107 BGNJ_FMT 출력 깨짐 fix] toLocaleString + 정규식 조합이 '2026-05-01-17:30:00 KST' 처럼 시간 앞에 대시 삽입. Intl.DateTimeFormat.formatToParts 로 교체. 모든 예상 출력 정확:  kstDateTime / kstShort / kstDate / kstFriendly.",
      "🕒 [사이트 전반 KST sweep] 7 파일 19 toLocaleString/toLocaleDateString 호출 → window.BGNJ_FMT 일괄 마이그.",
      "  · pages/AuthAdminPage.jsx — 신고 시각 / 주문 시각 / 도착일 / 약관 갱신 / 강연 후기 / 감사 로그 / 게시글 작성 / 댓글 작성 / 등 13곳",
      "  · pages/MyPage.jsx — 가입 시각",
      "  · pages/BookCheckoutPage.jsx — 책 후기 작성일",
      "  · pages/WangsanamTourPage.jsx — 답사 후기 작성일",
      "  · pages/LecturesPage.jsx — 강연 후기 작성일",
      "  · pages/LegalFaqPages.jsx — 약관 최근 갱신일",
      "  · components/Shell.jsx — 알림 시각",
      "📑 DEPENDENCY_MATRIX 갱신 — @babel/standalone 항목 '폐기' kind 로 이동 (v00.071 esbuild 도입). esbuild + D1 + R2 인프라 항목 추가. tiptap 노트에 v00.105 핫픽스 반영.",
      "📦 cache-buster — `?v=00.108.000` (20곳).",
      "ℹ KMS FEATURE_DOMAINS 본문 (~750 줄) 본격 갱신은 다음 사이클로 분리 — 큰 작업이라 별도 처리.",
    ],
    context: "v00.107 의 BGNJ_FMT 가 사용자 검증 없이 deploy 되어 출력 깨짐 발견. formatToParts 로 안정 fix. 동시에 사용자 가시 시간 표시 19곳을 일괄 KST 적용 — 이제 일본/유럽 등 비-KR 타임존 사용자도 한국 시간으로 본다. KMS 갱신은 DEPENDENCY_MATRIX 만 본 사이클 — FEATURE_DOMAINS 는 다음 사이클.",
  },
  {
    version: "00.107.000",
    date: "2026-05-01",
    datetime: "2026-05-01T17:47:50+09:00", // v00.110 — 실제 commit 시간 정정 (이전 hardcode 18:30 추정)
    summary: "🕒 버전 기록 KST 시분초 표기 + CSV 다운로드 + KMS 최신화 + BGNJ_FMT 헬퍼",
    details: [
      "🕒 BGNJ_FMT 헬퍼 신설 (data.js) — kstDateTime / kstShort. timeZone 'Asia/Seoul' 강제 → 사용자 브라우저 TZ 무관 KST 출력.",
      "🕒 ADMIN_VERSION_HISTORY entries — datetime 필드 (ISO+09:00) 추가. 옛 entries 는 date 만 존재 → fallback.",
      "🕒 버전 기록 패널 — datetime 있으면 BGNJ_FMT.kstDateTime 으로 시분초 표기. 없으면 date 만.",
      "📥 CSV 다운로드 버튼 — 버전 기록 헤더에 추가. 모든 entries (version / datetime / summary / details / context) 를 CSV 행으로 변환 후 Blob 다운로드.",
      "📑 FEATURE_DOMAINS 일부 갱신 — R2 활성화 / Tiptap 3 / Cover_url D1 / 놀자 시리즈 그룹 분리 등 최근 변경 반영 (다음 사이클 추가 갱신 예정).",
      "📦 cache-buster — `?v=00.107.000` (20곳).",
      "ℹ 사이트 전반 KST 적용은 향후 사이클 — 현재는 버전 기록 한정. 다른 시간 표시 (게시글 작성 시간, 강연 시작 시간 등) 는 brower TZ → KST 강제 마이그 별도.",
    ],
    context: "사용자 요청 '버전기록과 KMS를 모두 최신화 + CSV 다운로드 + 연월일시분초 표기 + KST 기반 운영'. v00.106 까지 entries 에 date(YYYY-MM-DD) 만 있어서 시간 식별 불가. datetime 필드 + KST 헬퍼 + CSV 다운로드 도입. 사이트 전반 KST 강제 (게시글 시간 등) 는 다음 사이클 separate.",
  },
  {
    version: "00.106.000",
    date: "2026-05-01",
    datetime: "2026-05-01T17:45:05+09:00", // v00.110 — 실제 commit 시간 정정
    summary: "🚌 투어 폼 재구성 + 부제·환불정책 + GUI 개선 + 홈 hero 강연/답사 미니 카드 (A안) + 놀자 시리즈 그룹 분리",
    details: [
      "🗄 D1 ALTER TABLE tours — subtitle TEXT + refund_policy TEXT 컬럼 추가. ★ wrangler deploy (Version 5c11459b).",
      "🛠 워커 — tourRow / handleTourCreate / handleTourPatch 가 subtitle / refundPolicy 패스. 클라 _toTour 도 패스스루.",
      "📝 TourAdminPanel 폼 재구성 (사용자 요청 순서) — 투어명 / 부제 / 난이도·소요(표시)·정원(표시) / 일정(통합) / 소요시간(분)·정원·참가비 / 설명 / 환불정책. 표시용 일정 문구 + 실제 시작 시간 통합 → startsAt 만 입력, next 표시 문구는 자동 derive.",
      "🎨 TPE_ScheduleEditor — 시간 라벨 (0h 30m) 을 시/분 split number input + 행 번호 prominent + 카드 레이아웃 (zebra striping).",
      "🎨 TPE_PrepEditor — 큰 input + 행 번호 + bullet point. 액션 버튼도 좀 더 큼.",
      "🚌 WangsanamTourPage — 부제 (italic gold) + 환불정책 섹션 추가. site_content_kv.tourRefundPolicy 글로벌 default. per-tour > 글로벌 fallback.",
      "🏠 홈 히어로 — KoreaMap 미리보기 → HeroProgramCards (다음 강연 + 다음 답사 미니 카드). 사용자 제안 A안 채택. 빈 상태 안내 포함.",
      "📂 admin 사이드바 '놀자 시리즈' 별도 그룹 분리 — 3 sub-tab (먹고 / 자고 / 사고). 콘텐츠 그룹의 옛 단일 탭 제거.",
      "🛠 KindPagePanel — 단일 kind 의 인트로 + 콘텐츠 items (파트너 가게 / 추천 숙소 / 특산품). 각 item: 이름·지역·주소·카테고리·설명·이미지(R2)·외부 링크·태그.",
      "🛠 EatSleepShopPages — 카테고리 칩 (필터 역할) + items 카드 그리드. items 비면 '준비 중' fallback.",
      "📦 cache-buster — `?v=00.106.000` (20곳).",
    ],
    context: "사용자 보고 동시 처리: ① 투어 폼 입력 순서 재정의 + 부제 + 환불정책 + 일정 통합 ② 세부 일정/준비물 GUI 직관성 ③ 홈 히어로 지도 제거 후 A안 (강연/답사 미니 카드) ④ 놀자 시리즈 그룹 분리 + 각 sub-page 콘텐츠 등록 (파트너 가게 / 추천 숙소 / 특산품). D1 schema 변경 + 워커 deploy 1 회. 다음 사이클(v00.107): 버전 기록 KST 시분초 표기 + CSV 다운로드 + KMS 최신화.",
  },
  {
    version: "00.105.000",
    date: "2026-05-01",
    summary: "🩹 핫픽스 묶음 — Tiptap 3 named import / 빈 default 미노출 / BANGINOJA 로고 placeholder / 투어·강연 admin 통합 / 놀자 admin 탭 / 줄바꿈 적용",
    details: [
      "🩹 [Tiptap 3 import 에러] @tiptap/extension-text-style@3.22.5 + @tiptap/extension-table@3.22.5 가 default export 없음 → named import 로 교체 ({ TextStyle } / { Table }). 콘솔 'does not provide an export named default' 에러 + admin 페이지 React 트리 죽음 fix. 책 추가 버튼 등 cascading 버그도 동시 해결.",
      "🩹 [비우면 미노출 약속] DEFAULT_SITE_CONTENT.tourSchedule / tourPrep / lectureSchedule / lectureNotes 시드를 빈 배열로 교체. 운영자가 글로벌 default 채우면 모든 투어/강연에 적용. (이전 시드가 fallback 으로 노출되어 admin 빈 상태에도 페이지에 5 줄 일정 보였던 contradiction 해소).",
      "🖼 CoverPlaceholder 컴포넌트 신설 (Shell.jsx) — BANGINOJA 로고 50% 투명 + label. WangsanamTourPage / LecturesPage 의 placeholder 교체. window.CoverPlaceholder 노출.",
      "🔗 [통합] 투어 프로그램 ⋄ 투어 페이지 + 강연 ⋄ 강연 페이지 — 사이드바 별도 탭 제거. TourAdminPanel / LectureAdminPanel 상단에 collapsible '📋 페이지 콘텐츠' 섹션으로 TourPageEditorPanel / LecturePageEditorPanel 내장. 사용자 보고 '왜 별도로 구분되어있는거야' 처리.",
      "🍱 EatSleepShopAdminPanel 신설 (AdminContentEditors.jsx) — 사이드바 콘텐츠 그룹에 '놀자 시리즈' 탭 추가. eat/sleep/shopIntro 의 인트로 + categories (배열 편집기) 통합 GUI. 이전엔 카테고리가 코드 default 만이었음 → site_content_kv.{eat|sleep|shop}Intro.categories 로 마이그.",
      "📝 [줄바꿈 적용] .section-subtitle / .bgnj-multiline 클래스에 white-space: pre-wrap. footer description / hero subtitle 등 textarea 입력의 \\n 이 그대로 표시. 사용자 보고 '사이트 콘텐츠에서 줄바꿈이 적용이 안되는거 같은데'.",
      "📦 cache-buster — `?v=00.105.000` (20곳).",
    ],
    context: "v00.090 Tiptap 3 마이그 직후 사용자가 admin 페이지 로딩 시 콘솔에 'extension-table does not provide default' 에러 보고. esm.sh 의 Tiptap 3 패키지 일부가 default export 없는 것 발견 → named import. 같은 시점 사용자 보고 5 종을 묶음 처리: ① Tiptap import 에러 ② 빈 시드 contradiction ③ 로고 placeholder ④ admin 별도 탭 통합 ⑤ 놀자 시리즈 admin ⑥ 줄바꿈 미적용. 다음 사이클(v00.106): 홈 히어로 지도 제거 — 사용자 협의 후 진행 (현재 별도 컴포넌트로 마련된 후보 안 없음, propose 단계).",
  },
  {
    version: "00.104.000",
    date: "2026-05-01",
    summary: "🛠 LegacyMigrationPanel 신설 — 시스템 관리 → 데이터 정리. 누적 legacy cover 데이터 일괄 마이그.",
    details: [
      "🛠 admin 사이드바 시스템 관리 그룹에 '데이터 정리' 탭 추가 (KMS / 오류 로그 / SEO / 설정 다음).",
      "🛠 ① 투어 cover 마이그 — site_content_kv.tourPages[id].coverDataUri → D1.tours.cover_url. 이전 후 site_content 의 해당 키 제거 (schedule/prep/templateId 보존).",
      "🛠 ② 강연 cover dataURI → R2 — site_content_kv.lecturePages[id].coverDataUri 가 data: 로 시작하면 fetch+blob → BGNJ_MEDIA.uploadFile 후 URL 로 교체. URL 형태는 skip.",
      "🛠 안전 정책 — dry-run 스캔 → 미리보기 → 적용. 결과 카운트 + 실패 목록 표시. 재실행 idempotent (이미 마이그된 항목은 자동 skip).",
      "📦 cache-buster — `?v=00.104.000` (20곳).",
    ],
    context: "v00.070~083 의 누적 legacy 데이터 정리 도구. 운영자가 admin → 시스템 관리 → 데이터 정리 에서 1회 실행하면 ① 투어 cover 가 정식 D1 컬럼으로 ② 강연 cover dataURI 가 R2 객체로 이동. site_content_kv 행 비대화 차단 + 데이터 모델 정합성 회복. 향후 사이클: 책 표지/PDF dataURI / 추천 이미지 / 게시글 첨부 dataURI 의 R2 일괄 마이그 도구는 별도 추가 (현재 사이클은 v00.081/v00.083 시점 잔재만 처리).",
  },
  {
    version: "00.103.000",
    date: "2026-05-01",
    summary: "🪣 R2 사용자 콘텐츠 — 게시글 첨부 + 이미지 업로드가 BGNJ_MEDIA.uploadFile 호출. 가장 큰 데이터 비대화 잠재 차단.",
    details: [
      "🪣 ImageAttacher.handleFiles (CommunityPage) — R2 (folder='post-images', 10MB) → dataURI 폴백 (5MB). 게시글 이미지 최대 10장 × 10MB → 100MB 단일 게시글 가능.",
      "🪣 FileAttacher.handleFiles (CommunityPage) — R2 (folder='post-attachments', maxSize=10MB) → dataURI 폴백 (5MB). 첨부 최대 3개 × 10MB.",
      "ℹ dataUrl 필드명 유지 — R2 URL 도 <img src> / <a href download> 모두 호환. 기존 dataURI 게시글 호환.",
      "ℹ 폴백 한도 5MB — R2 실패(권한/네트워크/할당량) 시에도 안전하게 D1 인라인. 5MB 초과 시 사용자에게 알림 + 건너뜀.",
      "📦 cache-buster — `?v=00.103.000` (20곳).",
    ],
    context: "v00.082 admin 6 슬롯 + v00.102 admin 확장(Books/Recommendations) 후 마지막 surface — 사용자측 게시글 콘텐츠. 게시글 단일 첨부 한도 10MB×3=30MB + 이미지 10MB×10=100MB 까지 가능 → R2 객체로 분리되면 D1 posts 행 비대화 차단. 다음 사이클(v00.104): legacy site_content_kv.tourPages[id].coverDataUri / 기존 dataURI 콘텐츠 일괄 마이그레이션 운영자 도구.",
  },
  {
    version: "00.102.000",
    date: "2026-05-01",
    summary: "🪣 R2 admin 확장 — BooksAdminPanel (책 표지/PDF) + RecommendationsAdminPanel (이미지) 가 BGNJ_MEDIA.uploadFile 호출.",
    details: [
      "🪣 BooksAdminPanel.onUploadCover — R2 (folder='book-covers', 5MB) → dataURI 폴백 (1.5MB).",
      "🪣 BooksAdminPanel.onUploadPdf — R2 (folder='book-pdfs', 20MB) → dataURI 폴백 (3MB). PDF 한도 R2 도입으로 ~7배 증가 (3→20MB).",
      "🪣 RecommendationsAdminPanel.onPickImage — R2 (folder='recommendations', 5MB) → dataURI 폴백 (1.5MB).",
      "ℹ 기존 dataURI 데이터 호환 — 모든 렌더 site 가 dataURI / R2 URL 양쪽 처리. 재업로드 시에만 R2 이동.",
      "📦 cache-buster — `?v=00.102.000` (20곳).",
    ],
    context: "v00.082 가 admin 6 슬롯만 처리. 검증 보고에서 BooksAdminPanel(line 2596) + RecommendationsAdminPanel(line 2610) 의 fileToDataUri 직접 호출 잔재 식별 → 본 사이클에 R2 호출 추가. PDF 한도 3MB→20MB 로 큰 폭 증가 (R2 의 dataURI 미적용 시 D1 행 한도 부담 차단). 다음 사이클(v00.103): 사용자 콘텐츠 (게시글 첨부+이미지) R2 마이그레이션.",
  },
  {
    version: "00.101.000",
    date: "2026-05-01",
    summary: "🎤 LecturePageEditorPanel 신설 (강연 페이지 글로벌/템플릿/per-lecture 편집) + HomePage 추천 섹션 헤딩 site_content 연동.",
    details: [
      "🎤 pages/admin/AdminContentEditors.jsx — LecturePageEditorPanel + LPE_NotesEditor + LPE_PreviewCard 추가. TourPageEditorPanel 의 글로벌/템플릿/per_tour 패턴을 강연(lectureSchedule/lectureNotes/lectureTemplates/lecturePages) 으로 일대일 복제.",
      "🎤 admin 사이드바 — '운영설정' 그룹에 '강연 페이지' 탭 추가 (투어 페이지 다음). AuthAdminPage trampoline 에 LecturePageEditorPanel 등록.",
      "🎤 site_content_kv.lectureTemplates 신설 (DEFAULT_SITE_CONTENT) — { id, name, schedule, notes } 배열. tourTemplates 와 동일 구조.",
      "🎤 강연별 커버 업로드 — R2 우선 (folder='lecture-covers', 5MB) + dataURI 폴백 (1.5MB). v00.082 R2 헬퍼 활용.",
      "🏠 HomePage.jsx 추천 여행지 섹션 헤딩 — 하드코드 → site_content_kv.recommendationsHeading (eyebrow/titlePrefix/titleAccent/titleSuffix/subtitle). v00.073 sweep 잔재 처리.",
      "🛠 SiteContentAdminPanel — '홈 페이지 — 추천 여행지 섹션 헤딩' SectionForm 신설. 강연 후기 안내 섹션의 'admin 직접 site_content 편집' 안내 → '운영설정 → 강연 페이지' 안내로 갱신.",
      "📦 cache-buster — `?v=00.101.000` (20곳).",
      "ℹ 사이클 번호 점프 (100→101): ROADMAP 의 v00.083 라벨은 계획 단위. 실제 release 버전은 단조 증가 (v00.100 다음 v00.101).",
    ],
    context: "v00.100 검증 보고가 '강연 글로벌 default 편집 GUI 부재 (v00.075 미완)' + '추천 섹션 헤더 site_content 미연동 (v00.073 sweep 미완)' 두 갭 식별 → 본 사이클에 일괄 처리. LecturePageEditorPanel 은 TourPageEditorPanel 거의 복제 — 회귀 위험 낮음. 다음 사이클(v00.102): R2 admin 확장 (Books 표지/PDF + Recommendations 이미지).",
  },
  {
    version: "00.100.000",
    date: "2026-05-01",
    summary: "🔬 React 19 마이그레이션 평가 — UMD 단종 확인 후 18.3.1 유지 결정. DEPENDENCY_MATRIX 갱신 (risk major → lts). 코드 변경 없는 분석 사이클.",
    details: [
      "🔬 React 19 (latest 19.2.5) 는 UMD 번들을 단종. `unpkg.com/react@19/umd/...` 와 cdnjs 모두 404. 공식 패키지에 umd/ 디렉터리 없음.",
      "🔬 esm.sh 는 React 19 를 ESM 으로 서빙 — 그러나 `<script type=\"module\">` 은 deferred 실행이라 클래식 IIFE 페이지 스크립트(v00.071 빌드 산출물) 의 React.createElement 호출 시점 보장 불가.",
      "🔬 진정한 R19 도입 요구: ① boot.jsx + 16 페이지 + components/ 모두 ESM module 로 재구조화 ② tools/build.mjs IIFE 래핑 폐기 + ESM 출력 ③ index.html 스크립트 로드 순서 재조정 ④ window.React 경로 폐지 — 다중-사이클 작업.",
      "🔬 ROI 평가: R19 의 새 기능 (ref-as-prop / useFormStatus / useActionState / useOptimistic / Server Components) 중 본 사이트가 즉시 활용할 항목 거의 없음. 18.3.1 은 LTS 로 보안 패치 지속. 본 사이클 시점 18.3.1 → 18.3.1 (변동 없음).",
      "📑 DEPENDENCY_MATRIX 갱신 — react/react-dom risk major → lts. 노트: 'React 19 는 UMD 미배포. 마이그레이션은 전 페이지 ESM 재구조화가 필요한 다중-사이클 작업 → 보류'.",
      "ℹ 코드 변경: 없음. 본 사이클은 분석 + 의존성 매트릭스 + ADMIN_VERSION_HISTORY 갱신.",
      "📦 cache-buster — `?v=00.100.000` (20곳 — 분석 사이클이지만 매트릭스 표시 갱신 위해 새 빌드).",
    ],
    context: "큐 3 메이저 마지막 항목. v00.090 Tiptap 3 와 달리 React 19 는 단순 버전 bump 불가 — UMD 단종이라 현재 아키텍처(클래식 IIFE + window.React) 를 보존하는 마이그레이션 경로가 없음. 두 옵션 ① 18.3.1 유지(LTS) ② 전 페이지 ESM 재구조화 (다중 사이클, 라이브 페이지 회귀 위험 큼) 중 ① 채택. 저ROI / 고비용 마이그레이션은 미래 사이클로 분리 — 시점은 R18 보안 EOL 또는 R19 신기능 직접 필요 시점. 큐 3 종료 — 추가 작업 없음.",
  },
  {
    version: "00.090.000",
    date: "2026-05-01",
    summary: "🎯 Tiptap 3 메이저 마이그레이션 — @tiptap/* 2.11.5 → 3.22.5. StarterKit v3 가 Underline/Link/Dropcursor 기본 포함 → standalone import 3 종 제거 + 옵션을 StarterKit.configure 로 이전.",
    details: [
      "🎯 index.html — 17 ESM import 를 @2.11.5 → @3.22.5. 중복 제거 (Underline/Link/Dropcursor 는 StarterKit 가 포함). window.BGNJ_TIPTAP exposed 객체에서도 3 종 제거.",
      "🎯 components/TiptapEditor.jsx — Link.configure / Dropcursor.configure 호출 제거. StarterKit.configure 에 link / dropcursor 옵션으로 이전. T.Underline 분기 제거 (StarterKit 기본).",
      "ℹ Image 는 standalone 유지 (StarterKit 미포함). Image.configure 에 inline=false / allowBase64=true / class='tiptap-img' 로 column/rich preset 에서만 추가.",
      "ℹ Highlight / TextAlign / Subscript / Superscript / TaskList / TaskItem / TextStyle / Color / Table / TableRow / TableCell / TableHeader / Youtube / Typography — 모두 v3 호환 standalone 유지.",
      "🩹 DEPENDENCY_MATRIX 갱신 — @tiptap/* current 2.11.5 → 3.22.5, risk major → patch.",
      "📦 cache-buster — `?v=00.090.000` (20곳).",
      "ℹ ★ 워커 변경 X — 워커는 Tiptap 모름 (HTML 본문은 D1 TEXT 로 저장).",
    ],
    context: "v00.055 의 DEPENDENCY_MATRIX 가 매 사이클 검토하던 risk:major 항목 해소. Tiptap 3 의 핵심 변경: StarterKit 묶음 확장 (underline / link / list-keymap / dropcursor 추가). 우리 코드는 이 3 개를 standalone 으로 import 했었으므로 v3 에선 중복 등록 → 제거. Link/Dropcursor 의 customization 만 StarterKit.configure 의 nested options 로 이전. AdminColumnEditor 는 TiptapEditor wrapper 만 사용 (직접 Tiptap API 미사용) → 코드 변경 0. 다음 사이클(v00.100): React 19 마이그레이션 — UMD 18.3.1 → 19.x.",
  },
  {
    version: "00.082.000",
    date: "2026-05-01",
    summary: "🪣 R2 업로드 흐름 활성화 — admin 이미지 업로드를 dataURI 인라인 → R2 객체로 마이그레이션 (OG / 로고 / 파비콘 / auth 배경 / 투어·강연 커버).",
    details: [
      "🪣 BGNJ_MEDIA helper 신설 (data.js) — uploadFile(file, {folder, maxBytes}) + resolveUrl(keyOrUrl). 워커 /api/media/upload + /api/media/:key endpoint 활용 (이미 v00.062 시점부터 코드 존재, R2 bucket 'banginoja-media' 활성).",
      "🛠 ImageUploader (SiteContentAdminPanel) — R2 우선 업로드 (5MB 한도). 실패 시 dataURI 폴백 (1.5MB). OG / 로고 / 파비콘 / auth 배경에 적용.",
      "🛠 TourAdminPanel.onPickContentCover — folder='tour-covers'. 5MB R2 + dataURI 폴백.",
      "🛠 LectureAdminPanel.onPickContentCover — folder='lecture-covers'. 5MB R2 + dataURI 폴백.",
      "ℹ 라이브 페이지는 dataURI / R2 URL / 절대 URL 모두 동일하게 <img src> 로 렌더 — 마이그레이션 완료 후에도 기존 dataURI 콘텐츠 호환.",
      "ℹ 적용 보류 (다음 사이클): 게시글 첨부 (CommunityPage user-facing, blast radius 큼) / 책 표지·PDF (BooksAdminPanel 별도 UI) / 추천 여행지 이미지 (RecommendationsAdminPanel).",
      "📦 cache-buster — `?v=00.082.000` (20곳).",
      "ℹ 사이클 번호 점프 (079→081→082): 081 cover_url (D1 only) 먼저 완료. 080 슬롯은 R2 였으나 release 버전 단조 증가 위해 082 채택.",
    ],
    context: "v00.062 부터 워커에 R2 endpoint 가 있었고 R2 bucket 'banginoja-media' 도 있었으나 어떤 클라이언트도 호출하지 않아 dataURI 인라인이 누적되어 D1 site_content_kv 행이 비대화 (각 이미지 ~수백KB base64). admin-side 업로드를 R2 로 일괄 마이그레이션 — 먼저 적은 surface (admin only, 6 슬롯) 부터. 사용자측 업로드(post 첨부 / 책 PDF) 는 다음 사이클로 분리. R2 실패 시 dataURI 폴백 유지 — 워커 미배포 / 권한 문제 / 네트워크 등 시점 안전.",
  },
  {
    version: "00.081.000",
    date: "2026-05-01",
    summary: "🚌 투어 D1 cover_url 컬럼 마이그레이션 — 워커 schema + tourRow + 클라이언트 _toTour + 라이브 cover 렌더 + admin 쓰기 분기. site_content_kv.tourPages legacy 폴백 유지.",
    details: [
      "🗄 D1 ALTER TABLE — `tours` 에 cover_url TEXT 컬럼 추가 (banginoja-db remote, ICN colo).",
      "🛠 워커 — tourRow 에 coverUrl 패스스루. handleTourCreate 에 cover_url 컬럼 INSERT. handleTourPatch fieldMap 에 coverUrl→cover_url 매핑.",
      "★ wrangler deploy — Version e26bcb4c. cover_url INSERT/UPDATE/SELECT 활성화.",
      "🛠 클라이언트 _toTour — coverUrl 패스스루 (D1 cover_url 우선, site_content fallback 은 라이브 페이지 측에서).",
      "🛠 WangsanamTourPage — 우선순위: tour.coverUrl (D1) > sc.tourPages[id].coverDataUri (v00.070 legacy) > placeholder.",
      "🛠 TourAdminPanel — startContentEdit 가 D1 우선으로 cover 로드. saveContentEdit 가 schedule/prep 은 site_content, cover 는 BGNJ_TOURS.saveTour({coverUrl}) 로 분기 저장.",
      "ℹ legacy site_content_kv.tourPages[id].coverDataUri 는 자동 마이그레이션 X — 기존 업로드 본은 그대로 표시되며, 다시 저장 시 D1 으로 이동.",
      "📦 cache-buster — `?v=00.081.000` (20곳).",
      "ℹ 사이클 번호 점프 (079→081): R2 가 v00.080 슬롯 점유 — 더 큰 외부 의존이라 마지막에 처리. cover_url 은 D1-only 라 먼저 진행.",
    ],
    context: "v00.070 의 site_content_kv.tourPages[id].coverDataUri 우회를 정식 D1 컬럼으로 마이그레이션. 데이터 모델 정합 (cover 는 투어 entity 의 일부 → D1 columns). schedule/prep 은 운영자 메타(편집 빈도 ↑, 임시 override 성격) 라 site_content_kv 유지가 적절. dataURI 인라인은 그대로 — D1 TEXT 컬럼 (사실상 무제한). R2 마이그레이션은 v00.080 사이클로 분리.",
  },
  {
    version: "00.079.000",
    date: "2026-05-01",
    summary: "🧹 legacy `bgnj_comments` 키 제거 — D1.comments 단일 source. storage v6-comments-dead 마이그레이션. 워커 미배포 v00.062 metrics endpoint 디플로이.",
    details: [
      "★ wrangler deploy — v00.062 metrics endpoint(/api/admin/users/:id/metrics) 가 코드만 있고 한 번도 배포 안 된 상태였음. 본 사이클에 banginoja-api Worker 디플로이. 모든 누적된 워커 변경 활성화 (Version 9ee114af).",
      "🧹 BGNJ_STORES.comments / BGNJ_SAVE.comments 제거. _commentsCache (서버 fetch) 가 단독 source.",
      "🧹 BGNJ_COMMUNITY.getComments — 로컬 fallback 제거 (이전 로컬 게시글 _remote=false 의 댓글 잔재). 로컬 임시 게시글의 댓글은 더 이상 지원 X.",
      "🧹 BGNJ_COMMUNITY.saveComments — no-op deprecated. 새 댓글은 addCommentRemote → D1 직접 저장.",
      "🧹 BGNJ_COMMUNITY.deletePost — `delete BGNJ_STORES.comments[postId]` 제거. D1 의 ON DELETE CASCADE 또는 댓글 endpoint 가 처리.",
      "🧹 BGNJ_COMMUNITY.getActivity — comments 합산 0 으로 폴백. 정확한 카운트는 서버 metrics endpoint(v00.062, 본 사이클 활성화) fetchActivity 사용.",
      "🧹 AuthAdminPage totalComments — _commentsCache 합산 (게시글 본문 모달 열 때 채워짐).",
      "🧹 storage v6-comments-dead 마이그레이션 — bgnj_comments localStorage 키 제거.",
      "📦 cache-buster — `?v=00.079.000` (20곳).",
    ],
    context: "v00.063 (reports 정리) 후 잔존 마지막 legacy localStorage 키 — bgnj_comments. 워커 D1.comments 테이블 + endpoint(/api/posts/:id/comments)가 v00.046 시점부터 server source 였으나 클라이언트가 듀얼 모드 (서버 게시글은 _commentsCache, 로컬 게시글은 BGNJ_STORES.comments) 로 운영. 로컬 임시 게시글이 더 이상 시드되지 않으므로(v00.046+), 로컬 댓글 저장소도 폐지. 추가로 v00.062 metrics endpoint 가 코드만 있고 배포 안 된 채로 누적되어 있어 본 사이클에 wrangler deploy. 다음 사이클(v00.080~) 후보: 투어 cover_url D1 컬럼 + R2 업로드 흐름.",
  },
  {
    version: "00.078.000",
    date: "2026-05-01",
    summary: "📂 AuthAdminPage 2차 분할 — pages/admin/AdminContentEditors.jsx (~1300 줄). 5904 줄 → defensive lint 여유 확보.",
    details: [
      "📂 신규 pages/admin/AdminContentEditors.jsx — RecommendationsAdminPanel + TPE_*(4) + _arr*(4) + TourPageEditorPanel + FOOTER_COLOR_OPTIONS + FooterStyleEditor + HE_*(6) + HERO_* 상수 + HeroEditorPanel.",
      "🪢 trampoline — AuthAdminPage 상단에서 window.* 11 항목 받아 기존 참조 무수정 유지 (v00.070 AdminDesignHub 패턴 동일).",
      "📦 index.html — AdminContentEditors.js 가 AdminDesignHub.js 다음, AuthAdminPage.js 이전 로드.",
      "📦 cache-buster — `?v=00.078.000` (20곳 — AdminContentEditors 신규 +1).",
      "ℹ AuthAdminPage.jsx: 7196 줄 → 5904 줄 (-1292). AdminDesignHub.jsx: 2658 줄. AdminContentEditors.jsx: 1329 줄.",
    ],
    context: "v00.070 의 AdminDesignHub 분할(2530 줄) 이후 본 파일이 v00.072~v00.077 사이클을 거치며 다시 7196 줄까지 증가. 8000 줄 large_file lint 임계까지 800 줄 여유였으나 다음 큰 패널 추가 시 닿을 위험 → defensive 분할. 콘텐츠 편집 패널 묶음(추천/투어 페이지/푸터 스타일/히어로) + 공통 helper(TPE_*/_arr*/HE_*) 를 한 파일로 응집. 다음 사이클(v00.079~) 후보: ★ wrangler deploy 의존 (legacy comments / R2 / cover_url 컬럼) — 사용자 deploy 차단점.",
  },
  {
    version: "00.077.000",
    date: "2026-05-01",
    summary: "🔒 useModalGuard 일괄 적용 — 5 모달 (LegalModal / PostViewerModal / SuspendDialog / DestinationMapModal / RecommendationDetailModal) ESC+body lock+popstate 통일.",
    details: [
      "🔒 LegalModal (AuthAdminPage.jsx) — 수동 keydown 핸들러 → useModalGuard. 읽기 전용 (dirty=false).",
      "🔒 PostViewerModal (AuthAdminPage.jsx) — 수동 keydown → useModalGuard. dirty=false.",
      "🔒 SuspendDialog (AuthAdminPage.jsx) — 수동 keydown → useModalGuard. dirty=false (정지 사유 텍스트 임시저장 가치 적음).",
      "🔒 DestinationMapModal (HomePage.jsx) — 수동 keydown + body lock → useModalGuard 가 처리.",
      "🔒 RecommendationDetailModal (HomePage.jsx) — 수동 keydown + body lock → useModalGuard.",
      "ℹ PostComposeModal (CommunityPage v00.068) + ColumnEditorModal (v00.067) 은 이미 useModalGuard 사용 — dirty=true 라 ESC/외부클릭 시 임시저장 prompt.",
      "📦 cache-buster — `?v=00.077.000` (19곳).",
    ],
    context: "v00.067 에서 useModalGuard 도입 + ColumnEditorModal 적용. v00.068 PostComposeModal 도 적용. 그 외 모달들은 수동 keydown + body overflow lock 으로 산재 → 일관성 갭. v00.077 사이클에 5 모달 일괄 통일. dirty=true (임시저장 prompt) 인 모달은 작성 폼 (PostCompose / ColumnEditor); 나머지는 dirty=false (ESC 즉시 닫기). 다음 사이클(v00.078~) 후보: AuthAdminPage 2차 분할 (defensive — 다음 큰 패널 추가 전 7000 줄 도달 시).",
  },
  {
    version: "00.076.000",
    date: "2026-05-01",
    summary: "🎨 Tiptap CSS 보강 — v00.068 의 14 extension (표/체크리스트/형광펜/Sub-Sup/정렬/코드블록/YouTube) 시각 스타일 완성.",
    details: [
      "🎨 styles.css — 표(table border-collapse + 헤더 강조 + selectedCell + tableWrapper overflow + column-resize-handle)",
      "🎨 체크리스트 — ul[data-type=taskList] flex 정렬 + 체크박스 accent-color: gold + 완료 항목 line-through.",
      "🎨 형광펜 — mark { background: rgba(gold,.35), padding, radius }. 다크 모드 .22 로 보정.",
      "🎨 Sub/Sup — vertical-align + 0.75em.",
      "🎨 정렬 — Tiptap 인라인 스타일 보강 cascade (center/right/justify).",
      "🎨 코드블록 — pre { bg-2, mono, border, overflow-x } + pre code reset.",
      "🎨 YouTube — [data-youtube-video] aspect-ratio 16/9 + 내부 iframe 100%.",
      "🎨 다크 모드 보정 — 표 헤더 bg-3, 형광펜 alpha 낮춤.",
      "📦 cache-buster — `?v=00.076.000` (19곳).",
    ],
    context: "v00.068 에서 Tiptap StarterKit + 13 extension (Underline/Highlight/TextAlign/Subscript/Superscript/TaskList/TaskItem/Color/TextStyle/Table/TableRow/TableCell/TableHeader/Youtube) 도구 풍부화. 도구만 추가하고 시각 스타일이 없어 글쓰기 결과 가독성 갭 존재 — v00.076 사이클에 styles.css 일괄 보강. 다음 사이클(v00.077~) 후보: ① useModalGuard 일괄 적용 (LegalModal / PostViewerModal / SuspendDialog) ② AuthAdminPage 2차 분할.",
  },
  {
    version: "00.075.000",
    date: "2026-05-01",
    summary: "🎤 강연 페이지 편집화 parity — 진행/참고/커버 per-lecture override + 후기 게이팅 안내 + LectureAdminPanel inline 편집 (투어 v00.070+v00.072 패턴 그대로 강연에 적용).",
    details: [
      "🎤 신규 site_content_kv 키 4종 — lectureReviewsGate (gate/anonymous/empty), lectureSchedule (글로벌 진행 흐름), lectureNotes (글로벌 참고 리스트), lecturePages[id] (per-lecture override: schedule/notes/coverDataUri).",
      "🎤 LecturesPage — 하드코드 5 줄 진행 + 4 줄 참고 제거. site_content fallback 패턴(우선순위: per-lecture override > 글로벌 > 코드 default). 커버 이미지: lecturePages[id].coverDataUri 가 있으면 표시, 없으면 placeholder.",
      "🎤 LectureReviewsSection — 게이팅/익명/empty 안내 문구를 모두 site_content_kv.lectureReviewsGate 에서 읽음.",
      "🛠 LectureAdminPanel — 각 강연 카드 액션에 '✎ 강연 정보 (제목·정원·시간·가격)' 라벨 명시화 + '📋 강연 진행·참고·커버' inline 편집 버튼 신설. TPE_ScheduleEditor / TPE_PrepEditor 재사용 (구조 동일: 시간 라벨 + 본문 / 문자열 배열). 저장 시 site_content_kv.lecturePages[id].",
      "🛠 SiteContentAdminPanel — 강연 후기 안내 문구 SectionForm 신설 (gate / anonymous / empty).",
      "📦 cache-buster — `?v=00.075.000` (19곳).",
    ],
    context: "v00.070(tour) + v00.072(TourAdminPanel inline) 의 패턴을 강연(lecture) 에 일대일 매핑. 답사 일정→강연 진행, 준비물→참고, tourPages→lecturePages, tourReviewsGate→lectureReviewsGate. 강연/투어가 같은 도메인 모델(예약+후기+per-id 콘텐츠)이라 코드 재사용 깔끔. 다음 사이클(v00.076~) 후보: ① Tiptap CSS 보강 (v00.068 의 14 extension 시각 스타일 미완) ② useModalGuard 일괄 적용 ③ AuthAdminPage 2차 분할.",
  },
  {
    version: "00.074.000",
    date: "2026-05-01",
    summary: "🔍 데이터 매퍼 audit — _toBook 양방향 silent 버그 fix + _toLecture/_toOrder 누락 필드 보강.",
    details: [
      "🐛 [핵심 fix] BGNJ_BOOKS — DB 컬럼 (cover_key / pdf_key / is_primary / sort_order) 을 잘못된 키로 읽어 admin 의 표지/PDF/대표/순서 변경이 silent 누락. _toBook 이 DB 컬럼명 우선으로 read + 신규 _toBookPayload 가 클라 → 워커 키 변환 (coverDataUri→coverKey, pdfPreviewDataUri→pdfKey, primary→isPrimary, order→sortOrder). create/update/reorder 모두 변환 거침.",
      "🩹 _toLecture — 워커 lectureRow 가 보내는 createdAt / updatedAt 패스스루 (이전 누락; 표시 영향 X 지만 일관성).",
      "🩹 _toOrder — bookId 필드 추가 (FK book_id 노출 — 어떤 책 주문인지 식별).",
      "✅ _toTour (v00.070 fix), _toColumn, 강연/투어 reservation mapper 는 audit 결과 깨끗.",
      "📦 cache-buster — `?v=00.074.000` (19곳).",
    ],
    context: "v00.070 의 _toTour 누락 4 필드 fix 가 'silent drop 버그가 다른 매퍼에도 있을 가능성' 을 시사 → ROADMAP v00.074 audit. 결과: _toBook 이 DB 스키마 컬럼명(snake_case + is_/sort_) 을 직접 매칭하지 않아 admin BooksAdminPanel 의 cover/PDF/primary/order 변경이 silent 무시되던 큰 버그 발견. handleBookPatch 의 fieldMap 이 isPrimary/sortOrder/coverKey/pdfKey 를 기대하는데 클라가 primary/order/coverDataUri/pdfPreviewDataUri 로 보냄. 양방향(_toBook 읽기 + _toBookPayload 쓰기) 동시 fix. 워커 변경 불필요. 다음 사이클(v00.075+) 후보: LecturePageEditorPanel 신설 (강연 페이지 일정·준비물·커버 per-lecture).",
  },
  {
    version: "00.073.000",
    date: "2026-05-01",
    summary: "🪧 전 페이지 hero/intro + 푸터 잔재 admin 편집화 sweep — 9 페이지 + 푸터 4 필드 신설.",
    details: [
      "🪧 9 신규 site_content_kv 키 — lectureIntro / communityIntro / columnIntro / bookCheckoutIntro / faqIntro / myPageIntro / eatIntro / sleepIntro / shopIntro. 모두 { eyebrow, titlePrefix, titleAccent, [titleSuffix], subtitle } 패턴 (tourIntro v00.070 동일). 비면 코드 default fallback.",
      "🪧 EatSleepShop 3 페이지 — { eyebrow, title, sub, desc, accent } 구조 유지 (페이지 레이아웃 차별화). categories 만 코드 default 잔존 (D1 marketplace 도입 시 마이그레이션).",
      "🪧 myPageIntro — `titleAccent` 에 `{name}` 토큰을 사용자 이름으로 치환 (예: '홍길동 님의 서재'). 관리자가 토큰 사용 안 하면 정적 텍스트.",
      "🛠 SiteContentAdminPanel — 9 신규 SectionForm 일괄 추가 (강연/커뮤니티/칼럼/FAQ/주문결제/마이페이지/먹고-자고-사고).",
      "🦶 푸터 잔재 추출 — footer 섹션에 copyright / headingContent / headingInfo / headingContact 4 필드 추가. Shell.jsx 의 © 라인 + 콘텐츠/정보/연락 헤딩 하드코드 제거.",
      "🛠 footer SectionForm 확장 — description / signature 외에 4 필드 + 라벨 명시화.",
      "📦 cache-buster — `?v=00.073.000` (19곳).",
    ],
    context: "사용자 보고 '관리자페이지에서 각 메뉴들 제목·부제목들을 수정할 수 있게 세팅해줘 / 푸터정보도 관리자페이지에서 수정할수있게해줘'. v00.054(hero) / v00.057(footer style) / v00.070(tourIntro/tourReviewsGate) 의 패턴을 사이트 전체에 일괄 적용. 다음 사이클(v00.074+) 후보: 데이터 매퍼 audit (_toLecture/_toColumn/_toBook 등 워커 응답 보존 검증) + LectureAdminPanel 에 v00.072 의 투어 inline 패턴 동일 적용.",
  },
  {
    version: "00.072.000",
    date: "2026-05-01",
    summary: "🏠 홈 투어/강연 카드 desc 축약 + TourAdminPanel 에 답사 일정·준비물·커버 inline 편집 통합.",
    details: [
      "🏠 HomePage truncatePreview 헬퍼 — 투어 desc / 강연 note 를 110자 단어 경계로 자르고 '…'. 카드 레이아웃 안정화 (사용자 보고: 홈에 본문 전체가 그대로 노출되어 페이지가 너무 길어짐).",
      "🛠 TourAdminPanel — 각 투어 카드의 액션 버튼에 '✎ 투어 정보 (제목·정원·난이도·소요시간·가격)' 라벨 명시화 + '📋 답사 일정·준비물·커버' 버튼 신설. contentEditingId 별도 state.",
      "🛠 inline 편집 영역 (per-tour) — 커버 이미지 업로드 (1.5MB 이하 dataURI) + TPE_ScheduleEditor + TPE_PrepEditor 재사용. 저장 시 site_content_kv.tourPages[id] 갱신.",
      "ℹ TourPageEditorPanel (운영설정 → 투어 페이지) 의 글로벌 / 템플릿 / 투어별 모드는 그대로 유지 — TourAdminPanel inline 통합은 발견성 개선 목적.",
      "📦 cache-buster — `?v=00.072.000` (19곳).",
    ],
    context: "사용자 보고 3 종: ① 홈에 노출되는건 적당히 줄이거나 홈용으로 따로 글을 쓰게 (투어/강연 카드 본문 전체 노출). ② 투어프로그램 설정에 각 프로그램별 답사 일정·준비물 설정. ③ 정원·난이도·소요시간도 설정. ②③ 은 v00.066/v00.070 부터 이미 가능했으나 별도 탭(투어 페이지) 분리 + 버튼 라벨 모호로 발견 어려움 — TourAdminPanel 에 inline 통합으로 한 곳 발견. 라벨 명시화로 capacity/level/duration 편집 인지도 ↑. 다음 사이클(v00.073) 후보: 전 페이지 hero/intro + 푸터 잔여 admin 편집화 sweep (사용자 추가 보고 '관리자페이지에서 각 메뉴들 제목·부제목 / 푸터정보도 수정').",
  },
  {
    version: "00.071.000",
    date: "2026-05-01",
    summary: "⚙ 빌드 단계 도입 (esbuild) — Babel-standalone 제거 + 인-브라우저 컴파일 경고 / 500KB deopt 노트 근본 차단.",
    details: [
      "🔧 tools/build.mjs 신설 — esbuild transform API 로 *.jsx → *.js per-file 컴파일. JSX factory React.createElement (UMD React 18 사용). IIFE 래핑 으로 기존 script-tag-isolation 보존. 인라인 source map.",
      "🔧 tools/install-hooks.sh 갱신 — pre-commit hook 이 ① 빌드 ② 산출 .js 자동 stage ③ 신택스 검증 의 3-step 으로 확장. 빌드 실패 시 commit 차단.",
      "🔧 tools/check-syntax.mjs 갱신 — collect() 가 *.jsx 와 짝 *.js 공존 시 .js 를 lint 제외 (빌드 산출물). hand-written .js (data.js / api.js / KoreaMapData.js) 만 통과.",
      "📦 boot.jsx 신설 (저장소 루트) — index.html 의 인라인 ~480 줄 Babel 블록 (AppErrorBoundary + App + ReactDOM render) 분리. 빌드 → boot.js.",
      "🩹 index.html — @babel/standalone CDN (~3MB) 제거 + 13 개 type=\"text/babel\" src=\"*.jsx?v=...\" → 평범 src=\"*.js?v=...\" 변환 + 인라인 블록 → boot.js 참조.",
      "📦 cache-buster — `?v=00.071.000` (19곳).",
      "ℹ 부수효과: 첫 로드 ~3MB ↓ (Babel-standalone 제거), JSX 컴파일 시간 0, 콘솔 경고 사라짐, 500KB deopt 노트 사라짐.",
      "ℹ 워크플로 변경: 매 commit 시 pre-commit hook 이 자동 빌드 + stage. 수동: `node tools/build.mjs`. 감시 모드: `node tools/build.mjs --watch`.",
    ],
    context: "사용자 보고 'You are using the in-browser Babel transformer...' 경고가 자꾸 생기는 원인 + 명확한 fix 요청. 옵션 비교 후 빌드 단계 도입(esbuild) 선택 — 경고 silence 같은 꼼수가 아닌 근본 fix. esbuild 채택 이유: ① bundle 불필요 (window globals 패턴 유지) ② 단순 transform API ③ 80ms 미만 빌드 ④ 작은 dep (~10MB). pre-commit 자동 빌드 + 자동 stage 로 수동 단계 0. 다음 사이클(v00.072~) 후보: 홈 노출 축약 + 투어/강연 admin 통합 + 전 페이지 헤더/푸터 admin 편집화. (ROADMAP.md 참조)",
  },
  {
    version: "00.070.000",
    date: "2026-05-01",
    summary: "🚌 투어 페이지 모든 항목 admin 편집 (인트로 / 후기 안내 / 커버 이미지) + 누락 표시 필드 fix + AuthAdminPage 분할.",
    details: [
      "🐛 [핵심 fix] data.js BGNJ_TOURS._toTour 가 워커 응답의 level/duration/group/next 필드를 떨어뜨려 답사 페이지 NEXT SCHEDULE 카드의 '소요 시간'/'난이도'와 상단 배지가 비어 보이던 문제 — 4 필드 패스스루 추가.",
      "🚌 site_content_kv.tourIntro 신설 — eyebrow / titlePrefix / titleAccent / subtitle. WangsanamTourPage 의 'TOUR · 답사' / '발로 읽는 조선' / 부제 하드코드를 site_content 에서 읽도록 교체 (코드 default fallback).",
      "🚌 site_content_kv.tourReviewsGate 신설 — gate / anonymous / empty 3 문구. TourReviewsSection 의 게이팅/익명/빈 후기 안내 문구를 모두 site_content 에서 읽도록 교체.",
      "🚌 site_content_kv.tourPages[tourId].coverDataUri 추가 — 답사 상세 페이지 좌측 커버 이미지. 비면 placeholder fallback.",
      "🛠 SiteContentAdminPanel — '투어 페이지 — 상단 인트로' / '후기 안내 문구' 섹션 SectionForm 으로 신설.",
      "🛠 TourPageEditorPanel per_tour 모드 — 답사별 커버 이미지 업로드 카드 + 1.5MB 제한 + 미리보기 + 제거 버튼. 저장 시 tourPages[id].coverDataUri 에 dataURI 인라인.",
      "📂 [분할] AuthAdminPage.jsx (9332 줄, large_file lint 위반) → pages/admin/AdminDesignHub.jsx 로 ADMIN_VERSION_HISTORY (~1037 줄) + LiveColorCards + DesignSystemView + DEPENDENCY_MATRIX/Matrix + DSSection + ADMIN_DESIGN_SECTIONS + MISSION_OVERVIEW + FEATURE_DOMAINS 분리. 본 파일 ~6900 줄로 축소.",
      "🪢 trampoline — AuthAdminPage 상단에서 window.ADMIN_VERSION_HISTORY 등 5 항목을 로컬 const 로 받아 기존 참조 무수정 유지. index.html 에 AdminDesignHub.jsx 가 본 파일보다 먼저 로드되도록 script 태그 추가.",
      "📦 cache-buster — `?v=00.070.000` (18곳).",
    ],
    context: "사용자 보고 '홈페이지의 모든 항목들을 수정할수있어야지, 그냥 일부만 수정할수있으면 어떻게하냐 정리해' (투어 페이지 스크린샷 첨부) + 'AuthAdmin Page 분할도 이번에 진행해'. 두 보고를 한 사이클에 처리. 1) 투어 페이지의 표시 버그(_toTour 누락) 발견 → 4 필드 패스스루 fix. 2) 인트로/후기 안내 문구 / 커버 이미지를 site_content 로 마이그레이션 + admin 편집 UI 추가. 3) AuthAdminPage 9332 줄 → 6900 줄 분할 (DesignSystemView 영역 ~2530 줄 이동). 다음 사이클(v00.071+) 후보: ① 투어 worker 스키마에 cover_url 컬럼 + R2 업로드 (현재 dataURI 인라인) ② 다른 페이지(ColumnPage/HomePage stats 등) 하드코드 텍스트 audit ③ AuthAdminPage 추가 분할 (HeroEditorPanel / FooterStyleEditor / TourPageEditorPanel 등 한 파일).",
  },
  {
    version: "00.069.000",
    date: "2026-05-01",
    summary: "📎 게시글 파일 첨부 (10MB × 최대 3개) — FileAttacher 신설 + PostCompose 통합 + 상세에 다운로드 링크.",
    details: [
      "📎 FileAttacher 컴포넌트 (CommunityPage.jsx) — name/type/size/dataUrl 배열. 10MB 초과 시 거부. 동일 모달에서 ImageAttacher(이미지 10장) 와 별도 슬롯.",
      "📎 PostCompose 폼 — Image 첨부 다음에 File 첨부 슬롯. payload 에 attachments 배열 포함. 임시저장 스냅샷에도 attachments 포함.",
      "📎 게시글 상세 — 본문 + 이미지 슬라이드 다음에 'FILES · 첨부 파일' 섹션 추가. 각 파일 다운로드 링크(<a download>).",
      "ℹ 이미지 (최대 10장) + 하단 슬라이드 갤러리는 ImageAttacher / ImageSlider 로 v00.068 이전부터 이미 구현. 본 사이클에 파일 첨부만 신규.",
      "ℹ 현재 dataUrl 인라인 저장 — D1 인라인 JSON 패턴. 30MB+ 첨부 시 응답 크기 부담 가능. 후속 사이클에 R2 업로드 흐름 검토.",
      "📦 cache-buster — `?v=00.069.000`.",
    ],
    context: "사용자 요청 5 종 중 잔여 3 종 처리 — 파일 첨부(10MB×3) + 이미지(10장) + 하단 슬라이드 갤러리. 이미지/슬라이드는 이미 구현되어 있어 점검만. 파일 첨부 (FileAttacher) 신설 + 통합. 현재는 dataUrl base64 인라인 — 게시글 페이로드가 커질 위험 있어 R2 업로드 흐름은 다음 사이클에. 백로그 종료 — 사용자 추가 요청 시 신규 사이클 정의.",
  },
  {
    version: "00.068.000",
    date: "2026-05-01",
    summary: "📝 Tiptap 무료 extension 풍부화 + 일반 사용자 글쓰기 모달 (커뮤니티) — 목록 위에 모달.",
    details: [
      "📝 index.html Tiptap ESM imports — Underline / Highlight / TextAlign / Subscript / Superscript / TaskList / TaskItem / Color / TextStyle / Table / TableRow / TableHeader / TableCell / Youtube. 모두 무료(MIT) extension.",
      "📝 components/TiptapEditor.jsx — 모든 preset 에서 새 extension 사용. 도구모음 풍부화: U(밑줄), 형광펜, X²/X₂, 색상, ☐ 체크리스트, { } 코드블록, 정렬 4종 (왼쪽/가운데/오른쪽/양쪽), YouTube 임베드, ⊞ 표 삽입.",
      "📝 column / rich preset 에서 Image + Dropcursor (시뮬레이션 색상 var(--primary) 토큰화).",
      "📝 CommunityPage.jsx PostComposeModal — 기존 'if (writing) return <PostCompose>' 분기 → 메인 return 후 모달 wrapper. 목록이 항상 보이고 모달이 그 위에 표시. useModalGuard 로 ESC + 외부클릭 → 임시저장 prompt.",
      "ℹ 파일 첨부(10MB×3) + 이미지(10장) 업로드 + 하단 슬라이드 갤러리는 v00.069 분리 (스토리지 인프라 + 게시글 모델 확장 작업 큼).",
      "📦 cache-buster — `?v=00.068.000`.",
    ],
    context: "사용자 요청 — 'Tiptap 무료 모든 기능' + '일반인이 홈페이지 모달로 글쓰기'. Tiptap 측은 표/유튜브/체크리스트/색상/정렬 등 사용자 UX 큰 영향 항목 일괄 도입. 모달은 useModalGuard 재사용으로 ESC + 외부클릭 임시저장 prompt 통일. 다음 사이클(v00.069): 파일/이미지 업로드 + 슬라이드 갤러리 (게시글 model 에 attachments_json / gallery_json 추가 필요 — 워커/D1 영향 작은 인라인 JSON 패턴 검토).",
  },
  {
    version: "00.067.000",
    date: "2026-05-01",
    summary: "📝 칼럼 작성/목록 통합 + 🔒 모달 인프라 (ESC + 외부클릭 임시저장 prompt + 7일/10개 정책) + ♿ Tab 접근성.",
    details: [
      "📝 ColumnsHubPanel 신설 — 기존 별도 '칼럼 작성' 탭 흡수. 목록 + 상태 필터 + 임시저장 목록 + ＋ 글쓰기 버튼 + 편집 버튼 모두 모달.",
      "📝 ColumnEditorModalContent — AdminColumnEditor 모달 wrapper. initialColumn / onPayloadChange prop 으로 dirty 추적 + 임시저장.",
      "🔒 BGNJ_DRAFTS 헬퍼 (data.js) — localStorage 'bgnj_drafts' [{id, kind, ...}] 저장. 정책: 최대 10 개 + 7 일 보관, 만료/초과 자동 purge.",
      "🔒 useModalGuard 훅 (Shell.jsx) — ESC 키 + body scroll lock + history pushState/popstate. dirty 시 외부클릭/ESC/뒤로가기 → 임시저장 confirm. 임시저장 후 닫기 / 그냥 닫기.",
      "🔒 사이드바 '칼럼 작성' 탭 제거 — 운영설정 그룹에서 정리. 구 진입 경로(setTab('칼럼 작성'))는 ColumnsHubPanel 로 폴백.",
      "♿ styles.css focus-visible 보강 — button / [role=button] / nav-link / .btn 모두 outline:2px var(--focus). Tab 키로 메뉴 이동 시 또렷한 시각 피드백.",
      "ℹ 임시저장은 칼럼 모달에 우선 적용. 다른 모달(LegalModal 등) 은 후속 사이클에 동일 패턴 적용.",
      "📦 cache-buster — `?v=00.067.000`.",
    ],
    context: "사용자 요청 4 종 묶음 처리: ① 칼럼 작성/목록 한 탭 통합 + 모달 글쓰기 ② 모달 외부클릭/뒤로가기 시 즉시 닫지 말고 임시저장 prompt ③ 임시저장 정책 7일·10개 ④ ESC 키 모달 닫기 ⑤ Tab 키 메뉴 이동 웹 접근성. 일반 사용자(관리자 외) 홈페이지 글쓰기 모달 + Tiptap 풍부화 + 파일/이미지 업로드 + 슬라이드 갤러리는 v00.068 로 분리 (작업 양 큼).",
  },
  {
    version: "00.066.000",
    date: "2026-05-01",
    summary: "🚌 투어 답사 일정/준비물 — 템플릿 시스템 + per-tour override (3 모드: 글로벌 / 템플릿 / 투어별).",
    details: [
      "🚌 site_content_kv.tourTemplates [{id, name, schedule, prep}] 신설 — 자주 쓰는 패턴 저장.",
      "🚌 site_content_kv.tourPages { [tourId]: { schedule, prep, templateId? } } 신설 — per-tour override.",
      "🚌 WangsanamTourPage 우선순위: per-tour override(직접 편집) > 글로벌 fallback > 코드 default. 둘 다 빈 배열이면 섹션 미노출.",
      "🚌 TourPageEditorPanel 재구조화 — 모드 토글 [글로벌 / 템플릿 / 투어별]. 모듈 최상위 헬퍼(TPE_*) 호이스팅 (IME 핫픽스 v00.058 패턴).",
      "🚌 글로벌 모드: 기존 v00.065 폼. 템플릿 모드: 템플릿 추가/이름변경/삭제 + 각 템플릿의 schedule/prep 편집. 투어별 모드: 투어 드롭다운 + 템플릿 적용 드롭다운 + override 직접 편집 + override 제거(글로벌 fallback).",
      "🚌 라이브 미리보기 sticky 카드 — 현재 모드의 schedule/prep 시뮬레이션.",
      "📦 cache-buster — `?v=00.066.000`.",
    ],
    context: "사용자 요청 '준비물과 설명들 모두 템플릿을 만들 수 있게 + 템플릿 선택/생성 + 템플릿 미선택 운영'. site_content_kv 패턴으로 D1 schema 변경 없이 구현. 우선순위 체계로 글로벌→템플릿(드롭다운 적용)→투어별 직접 편집 모두 가능. 다음 사이클(v00.067) — 사용자 추가 요청 묶음: ① 칼럼 작성/목록 통합 (모달 글쓰기) ② 모달 외부클릭/뒤로가기 시 즉시 닫지 말고 임시저장 prompt ③ 임시저장 정책 (7일·10개 한도) ④ ESC 키로 모달 닫기 ⑤ Tab 키 메뉴 이동 웹 접근성.",
  },
  {
    version: "00.065.000",
    date: "2026-05-01",
    summary: "🚌 투어 페이지 답사 일정 + 준비물 GUI 편집 — site_content_kv 통해 항목별 add/remove/edit + 라이브 미리보기.",
    details: [
      "🚌 DEFAULT_SITE_CONTENT.tourSchedule (배열 [{t, l}]) + tourPrep (문자열 배열) 신설. 코드 default 5+4 항목 (기존 하드코딩 그대로 이전).",
      "🚌 WangsanamTourPage — 하드코딩된 답사 일정/준비물 제거. site_content_kv 의 tourSchedule/tourPrep 사용. 빈 배열이면 섹션 자체 미노출.",
      "🚌 새 관리자 탭 '투어 페이지' (운영설정 그룹) — TourPageEditorPanel 컴포넌트. 좌측 항목별 편집(시간/내용 input + 위/아래 이동 + 삭제 + 추가), 우측 sticky 미리보기.",
      "🚌 항목 0 처리 — 빈 배열이면 페이지에서 '답사 일정' 또는 '준비물' 섹션 자체가 안 보이도록 안내.",
      "ℹ per-tour 차별화(투어마다 다른 schedule/prep)는 별도 사이클(tours 테이블 schema 확장 필요)로 분리.",
      "📦 cache-buster — `?v=00.065.000`.",
    ],
    context: "사용자 보고 — 투어 페이지의 답사 일정 5 항목 + 준비물 4 항목이 하드코딩되어 운영자가 코드 수정 없이 변경 불가. v00.065 가 site_content_kv 패턴으로 전환 (히어로/푸터/추천 동일 패턴). 항목별 add/remove/edit + 위/아래 정렬 + 라이브 미리보기. per-tour 차별화는 D1 schema 변경 필요해 별도 사이클로 미룸. 다음 사이클 후보: ① 강연 페이지에 동일 패턴(있다면) ② per-tour schedule (D1 schema_json 컬럼 추가).",
  },
  {
    version: "00.064.000",
    date: "2026-05-01",
    summary: "🔒 HTTPS / SSL 도입 코드 측 정합 — og:url + og:site_name 메타 + opt-in HTTPS 강제 헬퍼 + 사용자 인프라 가이드.",
    details: [
      "🔒 og:url 'https://bgnj.net' + og:site_name '뱅기노자 BANGINOJA' 메타 추가 — 카카오톡/페이스북/X 공유 카드 정합.",
      "🔒 조건부 HTTPS 강제 헬퍼 (index.html) — localStorage.bgnj_force_https === '1' 일 때만 http:// 진입을 https:// 로 redirect. SSL 도입 전 활성화 시 사이트 접속 불가 위험 — 사용자 explicit opt-in 패턴.",
      "🔒 CONTEXT.md §7.5 'HTTPS / SSL 도입 가이드' 신설 — Cloudflare DNS/SSL → GitHub Pages → ALLOWED_ORIGINS → 클라이언트 활성화 4 단계 + 검증 명령.",
      "ℹ 본 사이클은 코드 측 정합만. 실제 SSL 인증서 발급은 Cloudflare 대시보드 / GitHub Pages settings 에서 사용자가 직접.",
      "📦 cache-buster — `?v=00.064.000`.",
    ],
    context: "백로그 마지막 v00.064 후보 'HTTPS / SSL 도입' 처리. 인프라 변경은 사용자 직접 작업이라 코드 측에서 가능한 범위는 ① og 메타 정합 ② opt-in HTTPS 강제 헬퍼 ③ 가이드 문서. 사용자가 SSL 도입 완료 후 콘솔에서 'localStorage.setItem(...)' 활성화하면 http→https 자동 redirect. wrangler.toml ALLOWED_ORIGINS 의 http:// 항목은 SSL 도입 후 사용자가 제거 + wrangler deploy. 백로그 모두 소진 — 다음 사이클 정의는 사용자 요청 또는 KMS DesignSystemView 의 LiveColorCards drift 검출 등 자동 식별된 후속 작업으로 결정.",
  },
  {
    version: "00.063.000",
    date: "2026-05-01",
    summary: "🧹 legacy 키 'reports' 정리 — BGNJ_STORES 정의 + SAVE 핸들러 + bgnj_reports localStorage 키 제거. storage v5-reports-dead 마이그레이션.",
    details: [
      "🧹 BGNJ_STORES.reports 정의 제거 — 사용처 0 확인 (BGNJ_GRADE_PROMO 는 BGNJ_COMMUNITY._reports 만 참조). 서버 fetch 캐시가 단독 source.",
      "🧹 BGNJ_SAVE.reports 핸들러 제거 — 동일 사유.",
      "🧹 storage version v4-bookmarks-dead → v5-reports-dead — 일회성 마이그레이션으로 bgnj_reports localStorage 키 정리.",
      "ℹ comments 키는 활성 사용 중 (BGNJ_COMMUNITY 댓글 추가/삭제/조회 다수). 서버 일원화 마이그레이션은 별도 사이클(v00.065+)로 분리.",
      "📦 cache-buster — `?v=00.063.000`.",
    ],
    context: "백로그 v00.063 후보 'legacy 키 reports/comments 마이그레이션' 처리. reports 는 사용처 0 → 안전하게 제거. comments 는 BGNJ_STORES.comments[postId] 직접 read/write 가 다수 (data.js 806/951/982/985, AuthAdminPage 6800 등) — 서버 이전 시 BGNJ_API.community.comments 헬퍼 신설 + listComments 캐시 패턴 + BGNJ_GRADE_PROMO.metrics 정합 필요. 큰 작업으로 분리. v00.062 의 서버 metrics endpoint 가 commentsCount 를 D1 에서 정확 계산하므로 grade 평가 측면에선 이미 정확. 다음 사이클(v00.064) 후보: ★ HTTPS / SSL 도입 (인프라).",
  },
  {
    version: "00.062.000",
    date: "2026-05-01",
    summary: "🎯 서버 endpoint 로 reportCount/likesReceived/posts/comments/daysSinceSignup 정확화. ★ 워커 배포 필요.",
    details: [
      "🎯 워커 신규 endpoint /api/admin/users/:id/metrics — D1 SQL 직접 카운트. posts(author_id) / comments(author_id) / post_likes(post_id IN posts.author_id) / user_columns.likes_json / reports(post_id IN posts.author_id) / users.created_at.",
      "🎯 BGNJ_API.admin.users.metrics(id) — 클라이언트 헬퍼.",
      "🎯 BGNJ_GRADE_PROMO._serverCache + fetchServerMetrics(userId) + prefetchAllServerMetrics() — 관리자 reevaluateAll 직전 호출. 캐시되면 metrics() 가 서버 값 prefer (없으면 클라이언트 fallback). _source 필드로 출처 표시.",
      "🎯 GradePromotionPanel reevaluate — refreshUsers 후 prefetchAllServerMetrics 호출 (try/catch — 워커 미배포 시 silently 폴백).",
      "⚠ 사용자 직접 deploy 필요 — `cd workers && wrangler deploy`. 미배포 시 GET /api/admin/users/:id/metrics 가 404 → 클라이언트 best-effort 로 자동 폴백 (안전).",
      "📦 cache-buster — `?v=00.062.000`.",
    ],
    context: "백로그 v00.062 후보 — '서버 endpoint reportCount/likesReceived 정확화' 처리. 기존 클라이언트 best-effort 합산은 BGNJ_COMMUNITY._reports / posts.likes 같은 파편적 캐시에 의존 → 부정확. v00.062 가 D1 SQL 로 정확값 산출. 단일 round-trip per user (prefetchAll 직렬). 워커 미배포 시 fetchServerMetrics 가 throw 잡아 null 반환 → metrics() 가 클라이언트 값 사용 — 호환성 유지. 다음 사이클(v00.063) 후보: legacy 키 reports → comments 점진 마이그레이션 (워커 배포 동반).",
  },
  {
    version: "00.061.000",
    date: "2026-05-01",
    summary: "🩹 [핫픽스] 새 강연 추가 시 'startsAt' null 오류 수정 + 🔍 추가 lint 룰 (direct_fetch / equality_loose / large_file).",
    details: [
      "🩹 addNewLecture await 누락 핫픽스 — saveLecture 가 async 인데 await 없이 동기 getLecture(id) 호출 → 캐시 미반영 → null → startEdit(null) → 'Cannot read properties of null (reading startsAt)' TypeError. async/await + try/catch 추가 + saveLecture 가 반환한 lecture 객체 직접 사용.",
      "🩹 audit log 도 await + try/catch 로 감쌈 — audit 500 응답이 강연 생성 흐름을 막지 않도록.",
      "🔍 차단 룰 'direct_fetch' — `fetch(` 직접 호출은 BGNJ_API wrapper 우회. 인증/CORS/error log 보장 안 됨. api.js / data.js 만 허용. 코드베이스 위반 0.",
      "🔍 정보성 룰 'equality_loose' — `==` 또는 `!=` 사용 카운트. `=== / !==` 권장. 현재 11 건 (대부분 `== null` idiom).",
      "🔍 정보성 룰 'large_file' — 8000 줄 초과 파일. 현재 pages/AuthAdminPage.jsx 8672 줄 (분할 권장 — 차후 사이클).",
      "🔍 보고 출력 형식 — 정보성 룰별 그룹화 + 룰별 첫 3 건만 노출 (이전엔 TODO 만 5 건 출력).",
      "📦 cache-buster — `?v=00.061.000`.",
    ],
    context: "백로그 v00.061 후보 '추가 lint 룰' 처리. direct_fetch 차단으로 BGNJ_API 우회 방지. equality_loose / large_file 은 정보성으로 시작 (= idiom 허용 범위 결정 후 차단 승격 가능). large_file 알람으로 AuthAdminPage 분할 우선순위 가시화 — 추후 사이클에서 별도 admin/ 디렉터리로 컴포넌트 분할 고려. 다음 사이클(v00.062) 후보: ★ 서버 endpoint reportCount/likesReceived 정확화 (워커 배포 동반).",
  },
  {
    version: "00.060.000",
    date: "2026-05-01",
    summary: "🖼 OG 이미지 관리 UI 명시 카드 — OgPreviewBlock 신설 (라이브 미리보기 + 플랫폼 호환성 + 업로드 안내).",
    details: [
      "🖼 OgPreviewBlock 컴포넌트 신설 (AuthAdminPage.jsx) — 현재 og:image 의 카카오톡/페이스북 풍 공유 카드 시뮬레이션 (이미지 + title + description + 도메인).",
      "🖼 사용자 업로드 vs fallback SVG 자동 식별 — 업로드 없으면 'PNG 업로드 권장' 안내. data:image/svg 시작 여부로 isSvg 판정.",
      "🖼 플랫폼 호환성 표 — Twitter/Discord/Slack/Facebook/KakaoTalk/LinkedIn 6개 행. SVG dataURI / PNG dataURI / 현재 상태 3 컬럼. 색상 코드(success/warning/danger)로 즉시 판독.",
      "🖼 SiteContentAdminPanel OG 메타 섹션 — 기존 SectionForm + ImageUploader 다음에 OgPreviewBlock 인라인.",
      "📦 cache-buster — `?v=00.060.000`.",
    ],
    context: "v00.052 의 OG 이미지 SVG fallback 도입 후 운영자 측에서 '실제로 어떤 게 적용되고 있는지' 확인 어려운 상태. v00.060 가 미리보기 카드 + 플랫폼 호환성 표로 즉시 진단 가능. 카카오톡/페이스북에서 빈 미리보기로 보이는 이유(SVG 미지원) 도 동일 화면에서 노출 → 운영자가 PNG 업로드 필요성 명확히 인지. 다음 사이클(v00.061) 후보: 추가 lint 룰 (unused import / 큰 파일 라인 limit / === 강제).",
  },
  {
    version: "00.059.000",
    date: "2026-05-01",
    summary: "🌓 다크 모드 인라인 hex 정합 (잔존부) — 환불 amber + 추천 카드 region 라벨 + 모달 닫기 버튼 + KMS shadow 카드 + styles.css 추가 룰.",
    details: [
      "🌓 환불 신청 amber #e8a020 → var(--warning) 일괄 (MyPage / WangsanamTourPage / LecturesPage / AuthAdminPage 4 파일 7곳). 다크 모드에서 #F59E0B 로 자동 전환.",
      "🌓 환불 안내 박스 background rgba(232,160,32,0.06) → rgba(217,119,6,0.10) — warning hue 일관 정합.",
      "🌓 HomePage 추천 카드 region 라벨 + 모달 닫기 버튼의 rgba(255,255,255,0.92) → var(--bg-2) — 다크 모드에서도 적절한 대비.",
      "🌓 AuthAdminPage DesignSystemView shadow 카드 '#fff' → var(--bg) — 다크에서 카드 배경 정합.",
      "🌓 styles.css 다크 모드 추가 룰 — code/pre/hr/details/dt/dd/.admin-shell/.admin-main/.tweaks/:focus-visible. 카드 외 영역에서 발생하던 잔존 라이트 hex 정합.",
      "📦 cache-buster — `?v=00.059.000`.",
    ],
    context: "v00.052 다크 모드 도입, v00.053 nav/sidebar 핫픽스, v00.059 잔존부 정합 — 다크 모드 정합 3차 사이클로 거의 완료. 인라인 hex 가 남은 곳은 사용자 입력 default(예: AdminGradePanel 의 #D4AF37) 정도로 디자인 토큰 아님. KMS DesignSystemView 의 LiveColorCards 가 drift 자동 발견하므로 추후 회귀 시점에 즉시 식별 가능. 다음 사이클(v00.060) 후보: 관리자 OG 이미지 업로드 UI 명시 카드.",
  },
  {
    version: "00.058.000",
    date: "2026-05-01",
    summary: "🩹 한글 입력(IME) 핫픽스 + 📱 heroStyle 모바일 별도 트윗 + viewport 토글 미리보기.",
    details: [
      "🩹 [핫픽스] HeroEditorPanel + FooterStyleEditor 의 내부 컴포넌트(Field/Input/TextArea/Select/NumberRange/StyleGroup) 를 모듈 최상위(HE_*) 로 호이스팅. 부모 함수 안에 정의하면 매 렌더 새 함수 ref → input 매번 unmount/mount → IME composition 끊김. 사용자 보고: '히어로 트윗에서 한글 입력이 잘 안되네' (감사한 발견).",
      "📱 BGNJ_HERO_STYLE_DEFAULT.mobile 신설 — title(fontSize/lineHeight) / subtitle(fontSize/lineHeight/maxWidth) / stats(label/value/sub fontSize) 모바일 전용 오버라이드. 비어있는 필드는 데스크탑 그대로.",
      "📱 BGNJ_HERO_STYLE(force) 시그니처 — force ∈ {'desktop','mobile'} 또는 undefined(자동 — matchMedia ≤600px). 데스크탑 effective 위에 mobile override 머지.",
      "📱 HomePage Hero — matchMedia ≤600px listen + change 이벤트 자동 재렌더. heroStyle 도 mobile/desktop 자동 전환.",
      "📱 HeroEditorPanel 미리보기 viewport 토글 [데스크탑/모바일] — sticky 카드 우상단. 모바일 모드에서 360px 시뮬레이션 + mobile override 적용. 토글 색상 active 가독성 보강.",
      "📱 모바일 별도 트윗 폼 3 그룹 — MOBILE 타이틀/서브타이틀/통계 카드. 슬라이더 + 그룹별 default 복원.",
      "📦 cache-buster — `?v=00.058.000`.",
    ],
    context: "사용자 두 보고 동시 처리: ① '히어로 트윗 한글 입력 잘 안된다' → 진단 결과 React 가 부모 함수 내부 정의 컴포넌트를 매 렌더마다 새 함수로 인식해 input 을 remount → IME composition 끊김. HE_Field/HE_Input/HE_TextArea/HE_Select/HE_NumberRange/HE_StyleGroup 6개를 모듈 최상위로 호이스팅. FooterStyleEditor 도 동일 fix. ② '다음꺼 진행' → v00.058 본 작업 (heroStyle 모바일). 결과: 사용자가 모바일에서 보일 히어로의 폰트/행간/너비를 데스크탑과 별도로 트윗 가능 + 즉시 미리보기 토글. site_content_kv.heroStyle.mobile 슬롯 신설로 호환 유지. 다음 사이클(v00.059) 후보: 다크 모드 인라인 hex 정합 잔존부 (HomePage 다른 섹션 + 모달).",
  },
  {
    version: "00.057.000",
    date: "2026-05-01",
    summary: "🎨 푸터 스타일 GUI 편집 — FooterStyleEditor 신설. description/signature/heading 3 그룹 폰트·색상 + 라이브 미리보기.",
    details: [
      "🎨 FooterStyleEditor 컴포넌트 신설 (AuthAdminPage.jsx) — 3 그룹(description/signature/heading) 각각 fontSize/fontWeight/letterSpacing/color/textTransform/maxWidth 등 슬라이더+드롭다운.",
      "🎨 라이브 미리보기 sticky 카드 — 실제 푸터 마크업과 동일 스타일. ≤1100px 1단(.hero-editor-grid 재사용).",
      "🎨 그룹별 default 복원 + 전체 default 복원 + 즉시 저장. site_content_kv.footerStyle 저장 → Shell.jsx Footer 가 BGNJ_FOOTER_STYLE() 로 인라인 적용 (v00.056 베이스).",
      "🎨 SiteContentAdminPanel 푸터 섹션 — 콘텐츠 폼 다음에 FooterStyleEditor 인라인 통합. 안내 텍스트 제거.",
      "📦 cache-buster — `?v=00.057.000`.",
    ],
    context: "v00.056 의 footerStyle 토큰 베이스에 GUI 편집을 얹어 사용자가 코드 수정 없이 푸터 폰트·색상을 직접 트윗 가능. 단일 사이클로 작게 분리해 안전. 다음 사이클(v00.058) 후보: heroStyle 모바일 별도 트윗 + viewport 토글 미리보기 (히어로 편집 탭 데스크탑/모바일 시뮬레이션).",
  },
  {
    version: "00.056.000",
    date: "2026-05-01",
    summary: "📊 히어로 통계 카드 GUI 편집 + footerStyle 토큰 베이스 — 다른 섹션 GUI 편집 패턴 확장 1단계.",
    details: [
      "📊 hero.stats 스키마 확장 — 3 슬롯 [{label, sub, valueFallback}] 으로 정의. 동적 value(투어/커뮤니티 갯수)는 코드 우선, 없으면 valueFallback.",
      "📊 BGNJ_HERO_STYLE_DEFAULT.stats 신설 — { label, value, sub } 3 sub 스타일. 라벨/값/부연 각각 fontSize·fontWeight·color 등.",
      "📊 HomePage 통계 카드가 hero.stats 콘텐츠 + heroStyle.stats 인라인 스타일 적용. 기존 동적 value 로직(투어 갯수/커뮤니티 갯수) 보존.",
      "📊 HeroEditorPanel 확장 — '통계 카드 콘텐츠' 폼 (3 슬롯 × {label, valueFallback, sub}) + 3 스타일 그룹(label/value/sub). 미리보기 sticky 카드에도 통계 카드 시뮬레이션.",
      "🎨 BGNJ_FOOTER_STYLE_DEFAULT + BGNJ_FOOTER_STYLE() 헬퍼 신설 — { description, signature, heading } 3 그룹 토큰화.",
      "🎨 Shell.jsx Footer 가 BGNJ_FOOTER_STYLE() 결과를 description / 헤딩(콘텐츠/정보/연락) / signature 인라인 스타일로 적용. footerStyle 슬롯 비면 코드 default.",
      "🎨 SiteContentAdminPanel 푸터 섹션에 안내 추가 — 'footerStyle GUI 편집은 v00.057 사이클에 추가 예정'.",
      "📦 cache-buster — `?v=00.056.000`.",
    ],
    context: "v00.054 의 히어로 편집 탭 패턴 확장 1단계 — 통계 카드(히어로 하단)와 푸터 토큰 베이스. footer GUI 편집은 사이클 크기 조절을 위해 v00.057 으로 분리. 통계 카드는 전체 사용자 가시성이 높은 영역이라 우선. site_content_kv 패턴 재사용 — hero(콘텐츠+stats) / heroStyle(스타일+stats) / footerStyle(푸터 스타일) 세 섹션. 다음 사이클(v00.057): footerStyle GUI 편집 + heroStyle 모바일 별도 트윗.",
  },
  {
    version: "00.055.000",
    date: "2026-05-01",
    summary: "🔧 의존성 점검 사이클 — @babel/parser & @babel/standalone patch 갱신 + 의존성 매트릭스 KMS 도파 + workers/package.json 신설.",
    details: [
      "🔧 tools/@babel/parser 7.29.2 → 7.29.3 (npm update). pre-commit 훅 영향 없음.",
      "🔧 CDN @babel/standalone 7.29.0 → 7.29.3 + 새 SRI hash (sha384-rCpRZgF...). 빌드 안정성 동일, in-browser JSX 컴파일.",
      "🔧 workers/package.json 신설 — wrangler ^4.87.0 devDependency 선언. 사용자가 `cd workers && npm install` 후 `wrangler deploy` 가능. 별도 npm script: deploy / dev / tail.",
      "📑 KMS 디자인 도파 12번째 섹션 'DEPENDENCIES' 신설 — DependencyMatrix 컴포넌트 + DEPENDENCY_MATRIX 상수. 6개 의존성(CDN @babel/standalone, react UMD, @tiptap/*, npm @babel/parser, wrangler, 폰트) 의 현재/최신/위험도/위치/메모 한 표.",
      "⚠ React 18 → 19 & Tiptap 2 → 3 메이저 업그레이드는 별도 사이클로 분리. ref-as-prop / extension API 브레이킹 체인지 검증 필요.",
      "📦 cache-buster — `?v=00.055.000`.",
    ],
    context: "사용자 요청 '플러그인 모두 최신 업데이트 진행'. npm 등록처 조회 결과: @babel/parser 7.29.3, @babel/standalone 7.29.3, @tiptap/core 3.22.5(메이저), react 19.2.5(메이저), wrangler 4.87.0. 자동 적용 가능한 patch 만 본 사이클에. 메이저는 마이그레이션 작업이 사이클 단위라 분리 — DEPENDENCY_MATRIX 표가 사용자/AI가 매 사이클 시작 시 검토하는 single source of truth. 다음 사이클(v00.056~) 후보 정렬은 CONTEXT.md §7 참조.",
  },
  {
    version: "00.054.000",
    date: "2026-05-01",
    summary: "🎚 관리자 '히어로' 탭 — 홈페이지 히어로의 콘텐츠 8개 항목 + 스타일 4그룹(eyebrow/title/subtitle/cta) GUI 편집 + 라이브 미리보기.",
    details: [
      "🎚 새 탭 '히어로' (운영설정 그룹) — HeroEditorPanel 컴포넌트 신설. 좌측 콘텐츠 입력 + 스타일 트윗, 우측 라이브 미리보기 sticky 카드 (≤1100px 1단).",
      "🎚 콘텐츠 입력 8 종 — eyebrow / title1 / title2 / title3 / subtitle / mapHint / ctaPrimary / ctaSecondary. 빈 값이면 default 사용.",
      "🎚 스타일 트윗 — eyebrow(폰트크기/굵기/자간/색상/대소문자), title(폰트크기/굵기/행간/자간/색상/강조색상/정렬), subtitle(폰트크기/굵기/행간/색상/최대너비), cta(굵기). 슬라이더+숫자 입력 동시.",
      "🎚 BGNJ_HERO_STYLE() 헬퍼 + BGNJ_HERO_STYLE_DEFAULT 신설 (data.js). site_content_kv.heroStyle 오버라이드 + 코드 default 머지. 일부 필드만 오버라이드 가능.",
      "🎚 HomePage Hero 가 BGNJ_HERO_STYLE() 결과를 인라인 스타일로 적용 — h1/eyebrow/subtitle/CTA 모두. 정렬(left/center/right)이 텍스트와 버튼군 동시 정렬.",
      "🎚 mapHint 활용 — 기존 하드코드 '지도에서 여행지 찾기 →' 버튼 텍스트가 hero.mapHint 로 편집 가능.",
      "🎚 그룹별 default 복원 + 전체 default 복원 + 즉시 저장. 미리보기는 draft 변경 즉시 반영.",
      "📦 cache-buster — `?v=00.054.000`.",
    ],
    context: "사용자 요청 '관리자페이지에서 히어로페이지의 항목들을 하나하나 모두 수정할수있는 탭을 만들어주고, 그 탭의 항목들을 트윅으로 내용뿐만 아니라 스타일로 변경할 수 있도록 만들것'. site_content_kv 패턴을 재사용해 워커 변경 없이 구현 — hero(콘텐츠) / heroStyle(스타일) 두 섹션 분리. 라이브 미리보기는 sticky 카드로 항상 함께 보이도록 (≤1100px 에선 아래로 1단). 다음 사이클(v00.055) 후보: ① 플러그인 업데이트 점검 (Wrangler/React/Babel/Tiptap 의존성 최신화) ② 히어로 외 다른 섹션도 동일 패턴(예: 통계 카드, 푸터) 으로 확장 ③ heroStyle 의 모바일 별도 트윗 (현재는 fontSize 만 clamp 자동, 행간/자간은 모바일 동일).",
  },
  {
    version: "00.053.000",
    date: "2026-05-01",
    summary: "🩹 다크 모드 가독성 핫픽스 + 🗺 KoreaMap stroke 강조 + 📊 자동승급 기준을 회원등급 표 인라인 통합 + 🖼 OG 가벼운 로고-only.",
    details: [
      "🩹 styles.css 다크 모드 nav/footer/admin-sidebar/card 정합 — `.nav { background: rgba(255,255,255,0.96) }` 가 다크 모드에서도 흰 강제하던 문제 해소(rgba(15,23,42,0.92)). footer/admin-sidebar/.dim/.dim-2/.btn/.gold/.ko-serif 다크 정합 룰 추가. tbody hover/border 도 토큰화.",
      "🗺 KoreaMap stroke #E5E7EB → var(--line-2), fill 도 var 토큰화 → 라이트/다크 모두에서 경계선이 또렷하게 보임. strokeWidth 0.8 → 1.1.",
      "📊 AdminGradePanel 등급 표 — 각 등급 행 아래에 `↳ 자동 승급 기준` 행 인라인 추가 (PromoChip 컴포넌트). 게시글/댓글/30일방문/가입경과/좋아요/활동일/신고 7개 칩으로 즉시 노출. 별도 패널 GradePromotionPanel 의 편집/재산정 기능은 유지.",
      "🖼 OG 이미지 — 텍스트 4줄 + 옐로우 라인의 무거운 디자인 → 가운데 옐로우 박스 + B 마크 + 작은 워드마크의 가벼운 로고-only 레이아웃으로 교체 (사용자 요청).",
      "📑 KMS sub-tab 버튼 가독성 — border var(--line) → var(--line-2), background transparent → var(--bg-2), color var(--ink-2) → var(--ink). 활성 시 fontWeight 700 + role/aria-selected 추가. + DesignSystemView 의 인라인 `background:'#fff'` 1곳 → var(--bg) 토큰화.",
      "📦 cache-buster — `?v=00.053.000`.",
    ],
    context: "사용자 피드백 4 가지 핫픽스 묶음: ① '다크 모드에서 상단 메뉴 안 보임' (헤더 배경 흰 강제) ② '지도 잘 안 보임' (stroke 너무 옅음) ③ 'KMS 디자인 탭 가독성' (sub-tab 버튼 배경/대비 옅음) ④ '자동승급 기능 등급 아래 바로 보이게' (별도 패널 → 표 인라인). + 사용자 첫 메시지의 'OG 이미지 로고만 가볍게' 도 동일 사이클에 처리. 다음 사이클(v00.054) 후보: ① 관리자 히어로 페이지 편집 탭 (콘텐츠 + 스타일 트윗 — 사용자 요청, 큰 작업이라 분리) ② 플러그인 업데이트(Wrangler/React/Babel) 의존성 검사 (사용자 요청). 다크 모드는 인라인 hex 정합 점진 진행 — KMS 라이브 토큰 카드로 drift 발견 시 우선 정리.",
  },
  {
    version: "00.052.000",
    date: "2026-05-01",
    summary: "🌓 다크 모드 토큰 + 토글 + 🖼 OG 이미지 브랜드 fallback + 📑 KMS 라이브 토큰 카드. 클라이언트 단독 사이클 — 워커/D1 변경 없음.",
    details: [
      "🌓 BGNJ_THEME 헬퍼 신설 — get/set/cycle/effective/apply. localStorage(bgnj_theme) ∈ {auto, light, dark}. auto 면 prefers-color-scheme 따름. 시스템 pref 변경 이벤트 listen 해 auto 모드일 때 자동 재적용.",
      "🌓 styles.css `:root[data-theme=\"dark\"]` 토큰 오버라이드 — bg/bg-2/bg-3, line/line-2, ink/ink-2/ink-3, secondary, system 4종 모두 다크 팔레트로 교체. Primary 옐로우는 유지(브랜드 시그니처). card/input/select/btn 추가 다크 룰. .theme-toggle 컴포넌트 스타일.",
      "🌓 index.html 인라인 부트스트랩 스크립트 — React mount 전에 data-theme 미리 적용 → FOUC 차단. theme-color meta 도 light/dark 분리.",
      "🌓 ThemeToggle 컴포넌트 (Shell.jsx Footer) — light → dark → auto → light 순환. 아이콘(☀/🌙/◐) + 라벨. bgnj-theme-change 이벤트 listen 해 외부 변경에도 반응.",
      "🖼 og:image 브랜드 SVG fallback — 1200×630 인라인 SVG dataURI. 빈 content=\"\" → 브랜드 마크 + 'BANGINOJA' + 서브타이틀 + bgnj.net. Twitter/Discord 등 SVG OG 인식 플랫폼에 표시. 관리자 og.imageDataUri 업로드 시 applyHead 가 덮어씀.",
      "📑 KMS 라이브 토큰 카드 — DesignSystemView 의 COLOR_TOKENS 카드를 LiveColorCards 로 분리. 스와치 background 를 hex → var(--token) 으로 교체 → 다크 모드에서 자동 갱신. computed value 를 mount 시·테마 전환 시 읽어 hex 컬럼에 표시 (디자인값과 다르면 '· 라이브' 배지).",
      "📦 cache-buster — `?v=00.052.000`.",
    ],
    context: "v00.051 의 다음 사이클 후보 ③④⑤ 묶음 처리 — OG 이미지 / 다크 모드 / KMS 라이브 토큰. 모두 클라이언트 단독이라 워커 배포 동반 없음. 다크 모드는 토큰 기반 컴포넌트가 대부분 자동 정합되지만 인라인 hex 가 남은 곳(카드/모달 일부)은 점진 정합 필요 — '실험적' 단계로 시작. OG SVG 는 Twitter/Discord 에서만 인식되고 Facebook/Kakao 는 PNG 필요 → 관리자에서 og.imageDataUri 로 PNG 업로드해야 전 플랫폼 커버. KMS 라이브 카드는 다크 모드 토큰이 의도대로 적용됐는지 즉시 검증할 수 있는 self-test 도파 역할. 다음 사이클(v00.053) 후보: ① 서버 endpoint 로 reportCount/likesReceived 정확화 (워커 배포 동반) ② legacy 키 reports → comments 점진 마이그레이션 ③ 다크 모드 인라인 hex 정합 (HomePage/AdminPage 잔존부) ④ 관리자 OG 이미지 업로드 UI 명시화 (현재 hidden field 만).",
  },
  {
    version: "00.051.000",
    date: "2026-05-01",
    summary: "🎓 자동승급 룰 GUI 편집 + 🧹 bookmarks 키 제거. 운영자가 코드 수정 없이 BGNJ_GRADE_RULES 를 7가지 조건 모두 직접 편집/저장/복원.",
    details: [
      "🎓 BGNJ_GRADE_RULES_EFFECTIVE() 헬퍼 신설 — site_content_kv.gradeRules 오버라이드 + 코드 default 머지. 일부 필드만 오버라이드해도 나머지는 default 유지.",
      "🎓 BGNJ_GRADE_PROMO.evaluate — 코드 default 직접 참조 → effective rules 사용. GUI 편집 후 저장 즉시 다음 평가부터 반영.",
      "🎓 GradePromotionPanel — 편집 모드 추가. '기준 편집' 버튼 → 7개 컬럼 input 활성화 → '저장' 또는 '취소'. 'default 복원' 버튼이 site_content_kv.gradeRules 를 비워 코드 default 로 회귀. 저장 시 파스텔 알림.",
      "🎓 DEFAULT_SITE_CONTENT.gradeRules: {} 신설 — 빈 객체일 때 코드 default 그대로 사용.",
      "🧹 BGNJ_STORES.bookmarks 정의 제거 — BGNJ_COMMUNITY._bookmarks (서버 캐시) 가 단독 source. SAVE.bookmarks / cleanup entities / 헤더 주석에서 모두 정리.",
      "🧹 storage version v3-no-overrides → v4-bookmarks-dead — 일회성 마이그레이션으로 bgnj_bookmarks localStorage 키 정리. 사용자 임시 글(bgnj_user_posts)은 보존.",
      "📦 cache-buster — `?v=00.051.000`.",
    ],
    context: "v00.050 의 다음 사이클 후보 P1 P3 처리. GUI 편집은 site_content_kv 패턴(추천 여행지와 동일)을 재사용해 워커 변경 없이 구현. 운영자가 admin 콘솔 'GRADE PROMOTION' 섹션에서 7가지 조건을 즉시 조정 가능 — 댓글 임계, 가입 경과 일수, 최근 30일 방문 횟수, 받은 좋아요, 활동 unique 일수, 신고 한계 등. bookmarks 정리는 BGNJ_STORES 정의·SAVE 핸들러·entities 리스트·localStorage 잔재 4 곳을 한 묶음으로. 다음 사이클(v00.052) 후보: ① 서버 endpoint 로 reportCount/likesReceived 정확화(워커 배포 동반) ② legacy 키 reports / comments 점진 마이그레이션 ③ OG 이미지 / 다크 모드 / KMS 라이브 토큰 카드.",
  },
  {
    version: "00.050.000",
    date: "2026-05-01",
    summary: "🛗 관리자 사이드바 모바일 drawer + 🎓 회원등급 자동승급 다중 조건 + 알림. 사용자 요청 두 갈래 한 묶음 처리.",
    details: [
      "🛗 AdminPage 사이드바 — ≤900px 에서 햄버거 토글로 drawer 슬라이드. body scroll lock + Esc 닫기 + viewport > 900 자동 닫힘 + 탭 변경 자동 닫힘 + 백드롭 클릭 닫힘. 햄버거 버튼 fixed top:84 left:16 (44×44 터치).",
      "🎓 BGNJ_GRADE_RULES 다중 조건 확장 — posts / comments / visitsLast30Days / daysSinceSignup / likesReceived / activeDays / maxReports 7 가지. 모든 조건을 동시 만족해야 자격. reader/scholar 두 등급 정의.",
      "🎓 강제 강등 — 신고가 REPORT_DEMOTE_THRESHOLD(5) 이상이면 자격 무관 member 로 강제. 운영진(admin/wangsanam)은 보호.",
      "🎓 BGNJ_VISITS 신설 — localStorage 기반 방문 기록. record(userId) 가 같은 날 첫 진입만 카운트. countLast30Days(userId) 로 자격 평가. App init 의 refreshSession 이후 자동 호출.",
      "🎓 BGNJ_GRADE_PROMO.metrics(userId) 신설 — 7가지 지표 산출. 서버 활동 + 클라이언트 방문 + 가입일 + likes 합산 + reports 카운트 통합. evaluate 가 모든 조건 AND 체크.",
      "🎓 승급 알림 추가 — maybePromote 가 BGNJ_COMMUNITY.addNotification 으로 본인에게 'grade_promoted' 알림 발송 (강등은 이미 v00.030 부터 발송 중). 운영진 등급은 자동 변경 안 됨.",
      "🎓 GradePromotionPanel UI — AdminGradePanel 하단에 자동승급 섹션. 7 컬럼 기준 표 + '전체 회원 재산정' 버튼 + 결과 요약. 모바일 가로 스크롤(overflow-x:auto).",
      "📦 cache-buster — `?v=00.050.000`.",
    ],
    context: "사용자 요청 ① '관리자 사이드바 모바일 drawer' ② '회원등급 자동승급 — posts/comments/visitsLast30Days/daysSinceSignup/maxReports + 합리적 2-3종 추가 + 승급/강등 알림'. ②는 기존 BGNJ_GRADE_PROMO 가 posts/comments 만 보던 것을 7가지로 확장 + 승급 알림이 누락됐던 점도 동시 보강. 클라이언트 측에서 best-effort 계산(visits/daysSinceSignup/likes/activeDays/reports). 다음 사이클: ① 서버 endpoint 로 reports/likesReceived 정확 계산 ② GUI 로 BGNJ_GRADE_RULES 편집 ③ 추천 등급(scholar 위 wangsanam 자동 승급 차단 정책 명시). bookmarks 마이그레이션은 helper 가 이미 _bookmarks 서버 캐시만 사용해 dead 상태 — 다음 사이클에 BGNJ_STORES.bookmarks 와 SAVE.bookmarks 정의 자체 제거.",
  },
  {
    version: "00.049.001",
    date: "2026-05-01",
    summary: "🩹 핫픽스 — AdminPage useMemo 의존성 배열에 잔존하던 `data` 식별자 제거. v00.047 에서 `const data = window.BANGINOJA_DATA` 변수를 제거하면서 4 곳의 본문 참조는 정합했으나 `dashboardStats` useMemo 의 deps 에 `data` 가 남아있어 `/admin` 진입 시 ReferenceError. + CONTEXT.md 종합 문서 신설.",
    details: [
      "🩹 AdminPage 5698행 useMemo deps `[allUsers, allCommunityPosts, totalComments, allColumns, data, allBookOrders, ...]` 에서 `data` 제거. PageErrorBoundary 가 잡아 흰 화면은 면했지만 admin 자체 사용 불가 상태였음.",
      "📝 CONTEXT.md 저장소 루트에 종합 컨텍스트 문서 신설 — 인프라 토폴로지, 운영 원칙 9 항목, 파일 구조, 라우팅, 누적 사이클 히스토리(v00.039→v00.049), 사용자 가드, 다음 사이클 후보, 검증 명령, 라인 참조 표. 새 사이클 시작 시 §0 / §6 / §7 먼저 읽기.",
      "📝 메모리 — `project_context_snapshot.md` 추가. CONTEXT.md 위치 + 현재 상태 + 다음 사이클 우선순위 5 가지.",
      "📦 cache-buster — `?v=00.049.001`.",
    ],
    context: "사용자가 컨텍스트 종합 문서를 요청한 시점에 admin 진입을 시도하다 ReferenceError 발견. 변수 제거 시 deps 배열까지 따라가서 정합하지 않은 누락이 원인. 교훈: 변수 제거 시 grep `\\b<var>\\b` 로 모든 토큰 위치 확인 필요(전엔 `\\b<var>\\.` 만 검사). 향후 check-syntax 에 'undefined identifier' 룰 도입 검토(babel parser AST 로 ReferenceError 류 정적 검출 가능).",
  },
  {
    version: "00.049.000",
    date: "2026-05-01",
    summary: "🧹 BGNJ_STORES 정리 — dead 4 키 제거 + users 키 서버 일원화 + 신규 룰 var/TODO. localStorage 좀비 시드/오래된 키 자동 청소 마이그레이션 v3.",
    details: [
      "🧹 P1: dead 4 키(lectureOverrides / lectureRegistrations / tourOverrides / tourReservations) 정의·SAVE 핸들러·CLEANUP entities 에서 제거. read 사용처 0 이라 안전.",
      "🧹 P1 마이그레이션: storage version v2-server-first → v3-no-overrides. 일회성 정리 — 4 dead 키 + bgnj_users 좀비 시드 모두 localStorage 에서 삭제. 사용자 임시 글(bgnj_user_posts)은 보존.",
      "🧹 P2: users 키 서버 일원화. BGNJ_AUTH.listUsers() 가 _usersCache (서버 D1.users) 만 사용. 시드(DEFAULT_USERS) 자동 주입 폐지. ensureUsersSeeded → no-op. BGNJ_AUTHOR_GRADE 가 BGNJ_AUTH.listUsers 를 사용 (BGNJ_STORES.users 직접 참조 제거).",
      "🪝 P3: check-syntax 새 룰 'var' — let/const 강제. 호이스팅·재선언 함정 차단. 위반 시 pre-commit 차단.",
      "🪝 P3: check-syntax 정보성 INFO_RULES 신설 — TODO/FIXME/HACK/XXX 잔재 마커 카운트만 보고 (차단 X). 처음 5 건 노출.",
      "📦 cache-buster — `?v=00.049.000`.",
    ],
    context: "v00.048 다음 사이클 정의를 받아 P1·P2·P3 일괄 처리. dead 키 제거는 read 사용처 0 이라 위험도 낮음. users 키 일원화는 admin Member 패널이 _usersCache 만 보도록 정합 (refreshUsers 가 mount 시 await 호출되므로 정상 동작). var 룰은 현재 베이스에 위반 0 (이미 모두 let/const). TODO 1 건은 changelog 문자열 내 매치라 정보성으로만 노출. 다음 사이클(v00.050) 후보 — ① 관리자 사이드바 모바일 drawer (≤600px) ② legacy 키 중 bookmarks → reports → comments 순 server-only 마이그레이션 ③ 다크 모드 토큰 + 토글 ④ KMS 디자인 도파에 라이브 토큰 카드.",
  },
  {
    version: "00.048.000",
    date: "2026-04-30",
    summary: "🪝 check-syntax 룰 다중화 (BANGINOJA_DATA + console.log) + 📋 BGNJ_STORES 26 개 키 역할 문서화. 어느 키가 server-backed/local-intentional/legacy/dead 인지 한 눈에. 다음 사이클 정리 대상 명시.",
    details: [
      "🪝 tools/check-syntax.mjs — 룰 시스템을 RULES 배열로 모듈화. 각 룰은 `{ name, allow, pattern, msg }` 구조. 우회 마커는 같은 줄 또는 직전 줄 `// bgnj-lint-ignore-next-line <RULE>` 형식.",
      "🪝 새 룰 'console.log' — production 노이즈 차단. data.js (버전 배지/마이그레이션 진단) 와 api.js 는 allow. 페이지/컴포넌트에서 console.log 사용 시 pre-commit 훅이 차단. 진단은 console.error/warn 또는 errorLog 헬퍼 사용 권고.",
      "📋 data.js BGNJ_STORES 헤더 주석 — 26 개 키 각각의 운영 의미를 4 가지 태그로 분류 표기: 🌐 server-backed (캐시) / 💾 local intentional (drafts/session) / ⚠ legacy (마이그레이션 진행 중) / 💀 dead (read 사용처 없음, 다음 사이클 제거).",
      "📋 식별된 dead 키 4 개 — `lectureOverrides`, `lectureRegistrations`, `tourOverrides`, `tourReservations`. 이미 BGNJ_LECTURES.saveLecture / BGNJ_TOURS.saveTour 가 서버 직호출이고 override 머지 로직이 폐지되어 read 사용처 없음.",
      "📋 식별된 legacy 키 — communityPosts (시드 폴백 폐지 후 localOnly merge 만), comments / userColumns / users / bookmarks / reports / bookOrders / bookReviews / tourReviews / lectureReviews — 점진 마이그레이션 대상.",
      "📦 cache-buster — `?v=00.048.000`.",
    ],
    context: "v00.047 의 다음 사이클 후보 처리. 룰 다중화로 향후 새 룰을 RULES 배열에 한 줄 추가만으로 도입 가능. console.log 차단은 production 콘솔 노이즈 한 클래스 제거. BGNJ_STORES 의 4-태그 분류는 다음 사이클부터 dead 키 제거 / legacy 키 migration 우선순위 결정에 직접 활용. 다음 사이클: ① dead 키 4 개 (lectureOverrides/lectureRegistrations/tourOverrides/tourReservations) 정의 + localStorage 키 일괄 제거 ② legacy 키 중 가장 가시성 높은 것(communityPosts merge 로직?) 우선 server-only 화 ③ 룰 'TODO 잔재' / 'unused import' 추가 검토.",
  },
  {
    version: "00.047.000",
    date: "2026-04-30",
    summary: "🌐 BANGINOJA_DATA 직접 참조 전면 폐지 + check-syntax 룰화. BookPage/CheckoutPage 가 BGNJ_BOOKS.primary() 로, AdminPage 의 다음 강연/투어 / 칼럼 목록도 서버 헬퍼 경유. CommunityPage 의 render-path 헬퍼 호출에 BGNJ_GUARD 적용.",
    details: [
      "🌐 BookCheckoutPage — `window.BANGINOJA_DATA.book` → `window.BGNJ_BOOKS.primary()` 로 전환. 책 미로드 시 '책 정보를 불러오는 중...' placeholder. CheckoutPage 도 동일. `book.chapters.map` 가 array 가드.",
      "🌐 AuthAdminPage — `const data = window.BANGINOJA_DATA` 변수 자체 제거. 다음 강연/투어 (대시보드) → BGNJ_LECTURES/TOURS.listAll() 의 첫 항목. '뱅기노자 칼럼' 탭의 카드 렌더 → `allColumns` (BGNJ_COLUMNS.listPublic) 사용. 발행된 칼럼이 없으면 안내 문구.",
      "🛡 CommunityPage — render-path 헬퍼 호출(listPosts/getComments/isBookmarked) BGNJ_GUARD 가드. PostDetail mount 시 댓글 동기화 .then 도 .catch 추가.",
      "🪝 tools/check-syntax — 룰 검사 단계 신설. `window.BANGINOJA_DATA` 직접 참조를 신택스 OK 후에도 차단. 우회 필요 시 한 줄 위에 `// bgnj-lint-ignore-next-line BANGINOJA_DATA`. 주석 / 백틱 docstring 안의 매치는 자동 무시. data.js 는 정의 위치라 allow 리스트.",
      "📦 cache-buster — `?v=00.047.000`.",
    ],
    context: "v00.046 의 다음 사이클 후보 일괄 처리. BANGINOJA_DATA 시드의 마지막 직접 참조점들(BookPage/CheckoutPage/AdminPage) 을 모두 BGNJ_BOOKS/LECTURES/TOURS/COLUMNS 헬퍼 경유로 정합. check-syntax 가 신택스 + BANGINOJA_DATA 룰을 모두 검사하므로, 향후 새 코드가 시드를 다시 참조하려 하면 pre-commit 단계에서 차단됨. 다음 사이클: ① BGNJ_STORES 의 종속 시드(communityPosts seed merge)들 정리 ② localStorage 캐시 vs 서버 의무 데이터 키 명시적 분류 + 마이그레이션 ③ check-syntax 에 'unused var' / 'console.log 잔재' 같은 추가 룰 검토.",
  },
  {
    version: "00.046.000",
    date: "2026-04-30",
    summary: "🌐 홈페이지 D1 source-of-truth 정합 — 시드(BANGINOJA_DATA / DEFAULT_*) 폴백을 모두 차단하고, 누락된 BGNJ_COMMUNITY.refreshPosts 를 App init 에 추가. 사용자가 보는 콘텐츠는 100% 서버 데이터로만 구성. 깡통/시드 카드 노출 0.",
    details: [
      "🌐 BGNJ_COMMUNITY.listPosts — 서버 미로드(_serverLoaded=false) 시 BGNJ_STORES.communityPosts 시드 폴백을 폐지하고 빈 배열 반환. 'D1 source-of-truth' 정책 정합.",
      "🌐 ensureCommunityPostsSeeded — DEFAULT_COMMUNITY_POSTS 자동 주입 폐지. localStorage `bgnj_community_posts` 는 사용자 임시 글(미동기화 분) 만 보관.",
      "🌐 storage version v1-local-first → v2-server-first — 일회성 마이그레이션으로 기존 시드 박힌 `bgnj_community_posts` localStorage 항목 삭제. 사용자 임시 저장본(`bgnj_user_posts`)은 보존.",
      "🌐 App init — `Promise.allSettled` 에 `BGNJ_COMMUNITY.refreshPosts()` 누락분 추가. 진입 즉시 서버 게시글 동기화.",
      "🌐 HomePage refresh 이벤트 — `bgnj-community-refresh`(존재하지 않음) → 실제 발화 이름 `bgnj-posts-refresh` 로 정정. 새 게시글 작성 직후 홈 즉시 반영.",
      "🌐 MyPage — 로컬 시드 `BANGINOJA_DATA.lectures/.tours` 직접 참조 제거. `BGNJ_LECTURES/TOURS.listAll()` 로 일원화. `data` 변수 자체 제거.",
      "📝 HomePage 헤더 주석 — '데이터 원칙' 4 가지(서버 source-of-truth, 시드 무참조, 빈 섹션 미렌더, BGNJ_GUARD 보호) 명문화. 후속 변경 시 가이드.",
      "📦 cache-buster — `?v=00.046.000`.",
    ],
    context: "사용자 요청 '서버가 아니라 로컬에서 운영되는 모든 것들은 제외 + 홈페이지 안정 운영'. 핵심 발견 — App init 이 BGNJ_COMMUNITY.refreshPosts 를 호출하지 않아 진입 시 서버 게시글이 절대 안 뜸(이전엔 시드 폴백으로 가려져 있었음). 시드 폴백을 끊자마자 이 누락이 즉시 드러나, 함께 수정. 결과 — 홈페이지에 노출되는 모든 콘텐츠(추천/투어/강연/칼럼/커뮤니티 게시글) 100% 서버 데이터로만 구성, 서버 비면 해당 섹션 자체가 안 보임. 다음 사이클: ① BANGINOJA_DATA.book → BGNJ_BOOKS 로 BookCheckoutPage 정합 ② localStorage 잔재 키 정리(bookmarks/audit 등 cache 성격 vs server 의무) 분류 ③ check-syntax 에 'BANGINOJA_DATA 직접 참조 금지' 룰 추가.",
  },
  {
    version: "00.045.000",
    date: "2026-04-30",
    summary: "🛡 가드 패턴 표준화(BGNJ_GUARD) + 🪝 pre-commit 신택스 훅 정착 + 🗺 히어로 지도 미리보기 복원. 전사 헬퍼 호출을 try/catch+Array 가드로 통일하고, 깨진 .jsx 가 컴파일에 들어가지 못하도록 git hook 으로 차단.",
    details: [
      "🛡 BGNJ_GUARD 유틸 신설 (data.js 초반 위치) — `arr(fn,fb=[])` / `call(fn,fb)` / `num(fn,fb=0)` / `str(fn,fb='')` 4종 표준 가드. 모든 페이지가 동일 시그니처로 헬퍼 호출 보호. throw 가 발생해도 폴백으로 안전 복귀.",
      "🛡 페이지 가드 적용 — HomePage(safeArr→G.arr), ColumnPage(getLikes/getViews/listComments/estimateReadTime), LecturesPage(listAll/getBankAccount/getSeats/hasUserRegistered), WangsanamTourPage(listAll/getBankAccount/getSeats/hasUserReserved), MyPage(grades/communityPosts/bookmarkedPosts/notifications/myLectureRegs/myOrders/myTourRegs).",
      "🪝 tools/check-syntax.mjs — @babel/parser 로 components/*.jsx + pages/*.jsx + data.js + api.js 일괄 신택스 검증. 첫 실행 시 `tools/node_modules` 에 자동 npm install. 깨끗하면 exit 0, 실패면 1.",
      "🪝 tools/install-hooks.sh — `.git/hooks/pre-commit` 자동 설치. 매 커밋 직전 check-syntax 실행해 깨진 .jsx 가 staging 통과 못 함. (v00.042.001 WangsanamTourPage 누락된 </div> 같은 사고 재발 방지).",
      "🗺 히어로 지도 미리보기 복원 — v00.043 모달화 후 빈 자리가 어색했던 문제. 우측에 KoreaMap 컴팩트 미리보기 + 클릭 시 전체 모달. 모바일(≤900px) 1단 stack 유지. 시도 라벨은 호버 시에만 노출(v00.041 정책 그대로).",
      "📦 cache-buster — `?v=00.045.000`.",
    ],
    context: "사용자 요청 두 갈래: ① '시네틱 오류 검토 + 가드 패턴 확보' — 컴파일/런타임 양쪽 방어선을 표준화해 다음 사이클부터 새 페이지가 추가돼도 일관된 패턴으로 보호. pre-commit 훅이 SyntaxError 를 commit 단계에서 차단해 v00.042.001 같은 사고가 production 까지 도달하지 못하게. ② '지도 안 보인다' — 모달화 후 우측이 비어 어색했던 점. 미리보기 + 클릭→모달 의 hybrid 패턴으로 노출은 살리고 인터랙션은 모달에 모음. 다음 사이클 권장: ① CommunityPage / AuthAdminPage / BookCheckoutPage 의 헬퍼 호출도 BGNJ_GUARD 로 통일 ② 헬퍼 자체에 입력 검증 표준화(predicate guard) ③ check-syntax 에 ESLint-style 룰 추가 (사용 안 하는 변수 등).",
  },
  {
    version: "00.044.000",
    date: "2026-04-30",
    summary: "🛡 홈페이지 안정성 스윕 — Babel parser 로 16개 .jsx 파일 일괄 신택스 검증, HomePage useMemo 전부 try/catch+Array 가드, 섹션별 ErrorBoundary, Shell/ColumnPage 헬퍼 호출 옵셔널 체이닝. 한 섹션 오류가 다른 섹션 렌더를 막지 않도록 격리.",
    details: [
      "🔍 자동 신택스 검증 — @babel/parser 로 components/*.jsx + pages/*.jsx + data.js + api.js (총 16 파일) 일괄 파싱. 컴파일 단계에서 깨진 파일이 있으면 즉시 발견 가능. 향후 CI 또는 pre-commit hook 으로 정착 검토.",
      "🛡 HomePage 안정화 — `safeArr(fn)` 헬퍼 도입(try/catch + Array.isArray 가드). publicColumns/recentPosts/tours/lectures 모두 이 헬퍼로 감싸 헬퍼가 throw 하거나 비-배열 반환해도 안전 폴백.",
      "🛡 HomeSectionBoundary class 신설 + 7개 섹션(히어로/추천/투어/커뮤니티/칼럼/강연/책 CTA) 각각 감쌈. 한 섹션이 던진 오류는 격리되어 가벼운 placeholder 한 줄로 표시되고, 다른 섹션은 정상 렌더 유지. errorLog 자동 보고.",
      "🛡 Shell NotificationBell — `BGNJ_COMMUNITY?.listNotifications?.(...)` 옵셔널 체이닝, try/catch 래핑. markNotificationRead/markAllNotificationsRead 도 동일. 헬퍼가 부분 로드된 시점에 호출돼도 화면 안 깨짐.",
      "🛡 ColumnPage — getLikes/getViews/listComments/estimateReadTime 호출을 IIFE+try/catch+Array.isArray 가드로 감쌈. 칼럼 목록·상세 두 위치 모두 적용.",
      "📦 cache-buster — `?v=00.044.000`.",
    ],
    context: "사용자 요청 '현재 홈페이지 기준 오류 발생 여부 검토 + 모두 예방 + 업데이트'. 두 가지 종류의 위험을 잡음: (1) 컴파일 시점 — Babel SyntaxError 가 한 .jsx 파일을 깨뜨리면 그 컴포넌트가 정의되지 않아 PageErrorBoundary 도 못 잡음. v00.042.001 핫픽스에서 같은 문제(WangsanamTourPage 누락된 </div>) 를 만났던 경험. 이번엔 16/16 파일이 깨끗함을 확인. (2) 런타임 시점 — 헬퍼가 throw 하거나 비-배열을 반환하면 .filter/.map 이 죽고 그 결과 전체 페이지가 흰 화면. HomePage 섹션을 격리해 한 곳이 죽어도 나머지는 살아있게. 다음 사이클: ① 다른 페이지(LecturesPage/CommunityPage/MyPage/AuthAdminPage)에도 동일 패턴 적용 ② Babel parser 검증을 pre-commit hook 으로 자동화 ③ 헬퍼들 자체에 입력 검증 표준화 (predicate guard 패턴).",
  },
  {
    version: "00.043.000",
    date: "2026-04-30",
    summary: "📌 추천 카드 상세 모달 + 🪪 라우트별 document.title + 📱 모바일 메뉴 Esc·scroll lock + 🔤 메타 텍스트 가독성. v00.042.001 핫픽스(WangsanamTourPage 누락된 </div>) 이후 차근차근 polish 사이클.",
    details: [
      "📌 RecommendationDetailModal 신설 — 추천 카드 클릭 시 /tour 로 이동하지 않고 모달로 상세 정보(280px 이미지 + 큰 제목/부제 + 본문 + 태그 + '이 지역 투어 보기' CTA). ESC 닫기 + 외부클릭 닫기 + body scroll lock.",
      "🪪 라우트별 document.title — App 에 useEffect([route]) 추가. ROUTE_TITLES 매핑(home/eat/sleep/shop/tour/lectures/column/community/book/checkout/mypage/admin/login/signup/faq/privacy/terms). 형식 — 홈은 '뱅기노자 — 뱅기 타고 한국을 느끼다', 그 외는 '<섹션명> — 뱅기노자'. site_content_kv 의 brand.name / og.title 변경 시에도 동기화.",
      "📱 모바일 메뉴 강화 — 햄버거 열림 시 Escape 키로 닫힘 + body scroll lock + viewport > 900px 으로 확대되면 자동 닫힘. 라우트 변경 자동 닫힘은 v00.041 부터 이미 적용.",
      "🔤 메타 텍스트 가독성 — `.mono` 기본 weight 500, `.mono.dim-2` 600. IBM Plex Mono 의 가는 weight 가 한글 보조에서 너무 얇게 보이던 문제 해소. KMS 도파, 푸터 메타, 카드 메타 모두 보강.",
      "🩹 (v00.042.001 핫픽스) WangsanamTourPage.jsx 의 누락된 </div> 복구 — 결제 안내 블록 외곽 div 가 닫히지 않아 babel 컴파일 SyntaxError. 컴파일 실패 시 컴포넌트가 정의되지 않으므로 PageErrorBoundary 도 보호 못함. LecturesPage 의 동일 블록(line 350) 과 비교해 누락 발견 후 수정.",
      "📦 cache-buster — `?v=00.043.000`.",
    ],
    context: "v00.042 의 다음 사이클 권장에 적어둔 polish 항목들과 사용자 추가 피드백(여전히 /tour 렌더 오류 — Babel 파서 SyntaxError 가 진짜 원인) 한 묶음 처리. 핵심 — Babel 컴파일 에러는 PageErrorBoundary 가 못 잡는다(컴포넌트 자체가 만들어지지 않아 ReferenceError). 이 패턴은 향후 컴파일 시점에 console 을 monitor 해 즉시 사용자에게 노출하는 헬퍼 도입을 검토. 다음 사이클: ① 모바일 메뉴 키보드 trap (focus loop) ② 추천 모달 위치 정보 / 지도 핀 ③ 작은 화면에서 admin sidebar collapse / drawer 화 ④ 다크 모드 토큰 / 토글.",
  },
  {
    version: "00.042.000",
    date: "2026-04-30",
    summary: "P0 일괄 정비 — 투어 생성 NOT NULL 오류 수정 + 페이지별 에러바운더리 + 홈 깡통 데이터 정리 + '뱅기노자 추천' 관리자 패널 신설 + 여행지 탐색 모달화 + 로고 박스 제거 + 본문/사이드바 가독성 강화 (글자 두께 500, weight 600 라벨).",
    details: [
      "🩹 투어/강연 NOT NULL 오류 수정 — 클라이언트가 'price: \"80,000원\"' 같은 포맷팅 문자열을 보내고 서버는 Number(body.price) 로 파싱하다 NaN→null→tours.price NOT NULL 위반. 서버에 parsePrice() 도입(priceNumber 우선, 문자열 숫자만 추출, 폴백 0). 클라이언트 addNewTour/saveEdit/샘플 모두 정수만 전송. addNewTour/startEdit 에 null 가드 추가 (생성 실패 후 'Cannot read properties of null reading startsAt' 차단).",
      "🛡 페이지 에러바운더리 — index.html 에 PageErrorBoundary class 추가, App switch 가 window 에서 컴포넌트를 defensive 하게 lookup. 한 페이지 컴포넌트가 누락/오류여도 전역 트리는 살아있고, 사용자에게 '다시 시도/홈으로/새로고침' 회복 버튼 제공. route key prop 으로 라우트 변경 시 자동 reset. 오류는 BGNJ_API.errorLog 로 자동 보고.",
      "🧹 홈 깡통 데이터 정리 — HomePage 의 하드코딩 FEATURED_DESTINATIONS(궁/탑/한 placeholder 카드) 섹션 제거. data.js BGNJ_COLUMNS.listPublic 의 시드(BANGINOJA_DATA.columns) 폴백 제거 — 실제 작성된 칼럼만 노출. tours/lectures 도 시드 폴백 없이 BGNJ_TOURS/BGNJ_LECTURES.listAll() 만 사용. 데이터 없는 섹션은 렌더 자체를 안 함.",
      "📌 '뱅기노자 추천' 관리자 패널 신설 — 콘텐츠 그룹에 '추천 여행지' 탭 추가. region/name/subtitle/desc/tags(쉼표 구분)/이미지 업로드 + 순서 변경 + 삭제 + 일괄 저장. site_content_kv 의 'recommendations' 키에 배열로 저장 (BGNJ_SITE_CONTENT v2 array merge 지원). 비어있으면 홈에 섹션 미노출.",
      "🗺 여행지 탐색 모달화 — 히어로 우측 인라인 지도 → '지도에서 여행지 찾기' 버튼 + 모달. ESC 키로 닫힘, 외부 클릭으로 닫힘, body scroll lock. 모달 안에서 시도 클릭 → 지역 정보 + '이 지역 투어 보기' CTA.",
      "🪪 로고 박스 제거 — .brand-mark 의 1px gold border 삭제, SVG 로고 자체가 둥근 사각형 컨테이너이므로 외곽선이 시각적 충돌 발생. 마크 크기 38→40px, SVG 26→36px 로 가시성 보강.",
      "🔤 폰트 가독성 강화 — html/body weight 400 → 500 (Korean 본문 가독성). .nav-link 13→14px / weight 500 / color ink-3→ink. .section-eyebrow weight 600 + color ink-3→ink-2. .field-label / .footer h4 weight 600 + color ink-3→ink-2. Admin 사이드바 그룹 헤더 9px→11px / weight 700 / color ink-3→ink. 사이드바 항목 13→14px / weight 500 (active 700).",
      "🧰 BGNJ_SITE_CONTENT v2 — get() / saveSection() 가 Array 형 섹션을 인식. 배열은 통째 교체(병합 X), 객체는 기존처럼 patch merge. recommendations 같은 새 배열 섹션 추가에 활용.",
      "🪵 워커 lectures.price 도 parsePrice 동일 적용 — 같은 NaN→null 문제가 강연에도 잠재되어 있던 것을 선제 차단.",
      "📦 cache-buster — `?v=00.042.000`.",
    ],
    context: "사용자 피드백 5건 + 추가 2건 한 묶음 처리: ① 여행지 탐색 모달화 ② 로고 박스 테두리 삭제 ③ 메뉴 글씨 가독성 ④ 투어 추가 NOT NULL 오류 + 홈 깡통 데이터 ⑤ 글자 두께 ⑥ '뱅기노자 추천' 관리자 패널 ⑦ 일부 페이지 렌더 오류. 핵심은 (1) NOT NULL 위반의 진짜 원인이 클라이언트가 포맷팅된 문자열을 가격 필드로 보내고 있었던 점 — 서버 파싱을 견고하게 만들고 클라이언트도 숫자만 보내게 정합. (2) 한 페이지 오류가 전체 트리를 깨뜨리던 패턴을 PageErrorBoundary 로 격리. 다음 사이클: ① 추천 여행지 카드 클릭 시 모달 안에서 상세 정보 ② 추천 항목 검색/필터 ③ 워커 endpoint 단위 테스트 ④ 모바일 메뉴 항목 클릭 시 햄버거 자동 닫힘 (이미 구현되어 있지만 검증 필요).",
  },
  {
    version: "00.041.000",
    date: "2026-04-29",
    summary: "📱 모바일 최적화 + 🔤 WCAG 폰트 가독성 + 🗺 지도 라벨 기본 숨김. 햄버거 메뉴 도입(≤900px), 폰 최적화 브레이크포인트(≤600px) 신설, 본문 weight 300→400, 한국 지도 시도명은 호버/선택 시에만 노출.",
    details: [
      "📱 햄버거 메뉴 — Nav 에 mobile-open 상태 + 토글 버튼 추가. 라우트 변경 시 자동 닫힘. 44×44 터치 타겟, aria-expanded/aria-controls 로 스크린리더 호환. X 모양 애니메이션.",
      "📱 ≤900px 브레이크포인트 — 데스크탑 nav-menu 숨김 + 햄버거 노출. 메뉴 열림 시 헤더 바로 아래 풀폭 오버레이로 수직 펼침 (max-height: 100vh-64px, overflow-y:auto). nav-actions 의 텍스트 버튼들은 모바일에서 숨겨지고(알림 벨만 유지) 사용자 액션(마이페이지/관리/로그아웃 또는 로그인/회원가입)이 mobile-only 메뉴 항목으로 메뉴 안에 통합.",
      "📱 모바일 메가 — 데스크탑 hover 기반 .nav-mega 는 모바일에선 숨김. 대신 '놀자' 부모는 nav-mobile-submenu(인라인 펼침) 으로 자식(먹고/자고/사고)을 들여쓰기로 노출.",
      "📱 ≤600px 폰 브레이크포인트 신설 — container padding 20→16px, .section padding 64→48px, .section-title 32→26px. .grid-3/.grid-4/.grid-2 모두 1열로. 카드 padding 32→20px. .btn 최소 높이 44px / .btn-small 40px (WCAG 3.0 터치 타겟). .img-slider aspect-ratio 16:9 → 4:3 (세로 친화).",
      "🔤 폰트 weight — html/body font-weight 300 → 400. v00.038 까지 Light(300) 가 Korean text 가독성을 떨어뜨려 WCAG 본문 가독성 가이드와 충돌. Wanted Sans Variable / Noto Sans KR 모두 400 (Regular) 부터가 안정적.",
      "🗺 KoreaMap.jsx — 시도명 텍스트 기본 opacity 0, 호버/선택 시 opacity 1. fill 도 단순화(default secondary, selected white). transition 0.15s 부드러움. aria-hidden 동적 토글 (비활성 상태에서 스크린리더 숨김).",
      "♿ 모바일 보강 — 메뉴 토글 aria-expanded/aria-label 동기, 라우트 변경 시 자동 닫힘 (포커스 트랩 미사용 — 페이지 이동이 자연스러운 종료점).",
      "📦 cache-buster — `?v=00.041.000`.",
    ],
    context: "사용자 피드백 3가지 한 묶음 처리: ① '모바일 최적화도 적용해줘' — 기존엔 ≤900px 에서 nav-menu 가 그냥 사라지기만 해서 모바일에서 메뉴 접근 자체가 불가능했음 ② '지도에서는 글씨들이 기본적으로는 안 보이게 해줘. 클릭하면 보이게할껀데, 자세한 내용은 곧 따로 정리해줌' — 기본 숨김으로 일단 처리, 클릭 활성 외 별도 토글 UI 는 사용자 사양 대기 ③ '글씨의 얇기가 웹 접근성 기준을 준수하지 않는것같음' — Light 300 가 가독성을 깎아 WCAG 본문 권장과 충돌. 다음 사이클 권장: ① 지도 '라벨 모두 보기' 토글 버튼(사용자 사양 입력 후) ② 모바일 메뉴 키보드 trap + Escape 닫기 ③ 모바일 헤더 sticky 동작 + 스크롤 시 컴팩트화 ④ 작은 메타 텍스트(.mono dim-2 9-10px) weight 500 으로 보강 검토.",
  },
  {
    version: "00.040.000",
    date: "2026-04-29",
    summary: "🎨 컬러 시스템 v2 — Primary/Secondary/Tertiary + System 시맨틱 토큰 + 5:25:70 황금 배색. v00.039 의 Sunny Gold 가 사이트 전체를 노랗게 덮어 가독성/위계가 무너진 문제 해소. 노란색을 KEY ACCENT(5%)로 한정하고 베이스는 white+slate 뉴트럴로 재정렬. 상단 메뉴 9→6 으로 간결화 (먹고/자고/사고 놀자 → '놀자▾' 메가메뉴, 책은 푸터로).",
    details: [
      "🎨 styles.css :root — Primary/Secondary/Tertiary + Neutral + System Colors 시맨틱 구조로 재편. `--primary` #F5D548 / `--primary-hover` #E5BF2E / `--primary-active` #C99E1A / `--on-primary` #0F172A. `--secondary` #92400E Caramel Ink. `--tertiary` #475569 Slate.",
      "🎨 Neutral 베이스 — `--bg-2` #FFFBEB → #F8FAFC, `--bg-3` #FEF3C7 → #F1F5F9, `--line` #FDE68A → #E5E7EB, `--line-2` #FCD34D → #D1D5DB. 옐로우 톤 배경/라인 전부 슬레이트 뉴트럴로 교체 — 사이트 면적 70%+ 가 차분한 흰/회색.",
      "🎨 본문 잉크 — `--ink-2` #1F2937 → #334155 Slate 700, `--ink-3` #78716C → #64748B Slate 500. 슬레이트 톤이라 옐로우 액센트와 조화.",
      "🎨 System Colors 신설 — `--success` #16A34A · `--warning` #D97706 · `--info` #2563EB · `--danger` #DC2626. 상태 신호 4종 — primary 와 명도/색상으로 명확히 구분.",
      "🎨 레거시 토큰 호환 — `--gold/--gold-2/--gold-dim/--gold-ink/--cta-*` 는 신규 시맨틱 토큰의 alias 로 유지. 기존 코드 모두 그대로 작동.",
      "🎨 노란색 잔재 정리 — `.section-eyebrow` (gold→ink-3+line-2), `.brand-name .sub` (gold→ink-3), `.nav-link.active` (gold→ink+font-weight 500, dot은 gold 유지), `.footer h4` (gold→ink-3), `.row-num` (gold→ink-3), `.tag-chip`/`.pill` (gold tinted→neutral). 이제 옐로우는 CTA·로고·focus·active toggle·active dot 같은 인터랙션 상태에만.",
      "🗺 KoreaMap.jsx — 잠재 시도 fill #FFFBEB → #F8FAFC, stroke #FCD34D → #E5E7EB. 호버/선택 시 amber 톤은 유지(인터랙션 상태). 잠재 텍스트 fill #57534E → #64748B Slate 500.",
      "🪶 Nav 메뉴 — 9개 → 6개. `먹고/자고/사고 놀자` 3개를 `놀자▾` 메가메뉴 하나로 통합 (의식주 부제 표시). `뱅기노자의 길`(책)은 상단 nav 에서 제거 — 푸터 콘텐츠 섹션의 `『왕의길』` 링크로 접근. `투어 프로그램`/`뱅기노자 칼럼` 라벨은 `투어`/`칼럼` 으로 짧게.",
      "🪶 Nav active 상태 판정 — 메가 그룹의 자식 라우트(eat/sleep/shop) 도 부모(`놀자`)를 활성으로 표시하도록 `isActive(it)` 함수 추가.",
      "🪶 Mega menu 스타일 — 옐로우 hover 색상(`var(--gold)`) → 뉴트럴 bg-2 hover 로 정돈. `전체 보기 →` 링크는 `var(--secondary)` Caramel Ink.",
      "🪶 user.name 표시 — Nav 우상단 사용자 이름 색 `var(--gold)` → `var(--ink-2)` 로 정돈.",
      "🪟 theme-color 메타 — #FFFBEB → #FFFFFF. AppErrorBoundary 폴백 배경 #fffbeb → #f8fafc.",
      "📑 KMS 디자인 도파 — `COLOR_TOKENS` 표를 Primary/Secondary/Tertiary/Neutral/Text/System 6 카테고리로 재구성 (13→20 항목, hex 모두 신값). '컬러 원칙' 섹션 본문이 5:25:70 황금 배색, 5% 룰 명문화.",
      "📦 cache-buster — `?v=00.040.000`.",
    ],
    context: "사용자 피드백 두 가지: ① '너무 노래서 눈에 안들어오고, 노란색은 키컬러로만 쓰여야해' ② '상단 메뉴가 너무 많아서 불편해'. 추가로 사용자 제공 컬러 시스템 가이드(Primary/Secondary/Tertiary + System Colors + 5:25:70 황금 배색 + WCAG AA 4.5:1) 를 토큰 구조로 직접 반영. v00.039 가 옐로우 단일 톤으로 면적을 다 칠해 위계가 사라진 점이 핵심 원인 — Primary 5% 룰을 따르지 않으면 '키컬러' 가 의미 없어짐. 다음 사이클 권장: ① 다크 모드 토큰 정의(현 시맨틱 토큰을 [color-scheme: dark] 변형으로 매핑) ② 시스템 컬러 4종(success/warning/info/danger) 의 실제 사용처 점검 — 결제 confirm 토스트/환불 경고/공지 박스 등 ③ 메가메뉴 키보드 내비게이션(현재 hover 만 지원) ④ Primary 5% 영역 자동 검사 도구(개발자 도구 기반).",
  },
  {
    version: "00.039.000",
    date: "2026-04-29",
    summary: "🎨 Sunny Gold 팔레트 정렬 — 로고(#F5D548 노란 라운드 마크)와 사이트 전반 색상이 충돌하던 상태(블루 베이스 + 노란 로고)를 해소. 로고 옐로우를 기준으로 모든 컬러 토큰 / CTA / 회원 등급 색상 / 한국 지도 / favicon-theme 메타 / 디자인 가이드 문구를 일괄 재정렬.",
    details: [
      "🎨 styles.css :root — `--bg/--bg-2/--bg-3` 순백 → 따뜻한 크림(#FFFBEB) → 소프트 옐로우(#FEF3C7). `--line/--line-2` 옐로우 톤 라인. `--gold` #F5D548(로고) · `--gold-2` #E5BF2E(Honey Amber, hover) · `--gold-dim` #FCEBA0 · `--gold-ink` #92400E(Caramel Ink, 본문 강조).",
      "🎨 CTA 토큰 — `--cta-rest` #F5D548 / `--cta-hover` #E5BF2E / `--cta-active` #C99E1A. 옐로우 위 흰 글씨는 명도대비 부족이므로 `--cta-ink` #0F172A 다크 잉크 추가. `.btn-gold` 텍스트도 `var(--cta-ink)` 로 전환 (WCAG AA 통과).",
      "🎨 본문 잉크 — `--ink-2` 블루 #1E3A8A → 따뜻한 다크 그레이 #1F2937. `--ink-3` Slate → Warm Stone #78716C. `--focus` #C99E1A Deep Amber.",
      "🎨 회원 등급 — guest #A8A29E → member #FCD34D → reader #F5D548 → scholar #F59E0B → wangsanam #D97706 → admin #92400E (옐로우 그라데이션 통일). `LEGACY_GRADE_COLORS` 가 [메탈릭 골드, 블루] 두 세대 모두 잡아 자동 마이그레이션.",
      "🗺 KoreaMap.jsx — 시도 fill/stroke/text/shadow 를 옐로우-앰버 톤으로 교체. selected = #B45309, hover = #FEF3C7.",
      "🧹 잔재 정리 — `rgba(212,175,55,...)` (구 메탈릭 골드) 38곳 → `rgba(245,213,72,...)` (로고 옐로우) 일괄 치환. 콘솔 버전 배지 배경 #1E3A8A → #92400E.",
      "📑 KMS 디자인 도파 — 컬러 토큰 정의표(`COLOR_TOKENS`) 11→13 항목 (`--bg-3`, `--gold-ink` 명시). '브랜드 무드' / '컬러 원칙' 섹션 본문이 새 Sunny Gold 시스템을 정확히 기술.",
      "🪟 theme-color 메타 — #FDFAF5 → #FFFBEB (모바일 브라우저 상단바 색상 동기).",
      "📦 cache-buster — `?v=00.039.000`.",
    ],
    context: "사용자 보고 '홈페이지 로고가 색이 색이다보니 전체적인 컬러감 수정이 필요해보임'. 코드 베이스가 v00.026 라이트 톤 전환 → v00.035 블루 팔레트 마이그레이션을 거치면서 로고만 노란색으로 남아 충돌하던 상태였음. CSS 변수 이름이 여전히 `--gold-*` 인 점에서 원래 골드 정체성으로의 회귀가 자연스러웠고, 로고 색을 기준점으로 삼아 전체 팔레트를 Sunny Gold 시스템으로 재정렬. 다음 사이클 권장: ① 다크 모드 토글 도입 시 동일 hue 의 다크 변형 정의 ② OG 이미지에 새 팔레트 적용한 카드 1장 추가 ③ AuthAdminPage 의 스크린샷/설명에 라이브 토큰 색상 카드를 직접 끼워 넣어 도파 자동화.",
  },
  {
    version: "00.038.000",
    date: "2026-04-28",
    summary: "P1 + P2 우선순위 일괄 해소. 서버 알림 부수효과(댓글/등록/주문 자동 알림 insert) + 강연/투어 관리자 신청자 endpoint + 칼럼 좋아요·조회수 D1 영속 + 회원 활동 집계 endpoint + 응답 매퍼 방어적 폴백 + 댓글 트리 깊이 펼침/접기 + 새 콘텐츠 시드 백필 버튼.",
    details: [
      "🌐 Worker — `insertNotification(env, ...)` 헬퍼 + `handleCommentsCreate` 가 게시글 작성자/부모 댓글 작성자에게 자동 알림 insert. `handleLectureRegistrationPatch` / `handleTourReservationPatch` / `handleOrderPatch` 가 상태 변경 시 자동 알림.",
      "🌐 Worker — `GET /api/admin/users/:id/activity` (게시글·댓글·북마크·주문·강연·투어·알림 7 종 카운트 + 최근 목록).",
      "🌐 Worker — `GET /api/lectures/:id/registrations` + `GET /api/tours/:id/reservations` 관리자 전용 신청자 목록.",
      "🌐 Worker — `POST /api/columns/:id/like` (토글) + `POST /api/columns/:id/view` (조회수 +1). user_columns.likes_json + views 컬럼 영속.",
      "🪶 P1-1 — HomePage 가 `bgnj-site-content-refresh` 이벤트로 즉시 재렌더 (관리자 SEO/Hero 변경이 새로고침 없이 반영).",
      "🪶 P1-2 — MyPage 가 `bgnj-orders-refresh / bgnj-lectures-refresh / bgnj-tours-refresh / bgnj-notifications-refresh` 4 이벤트 동기 + mount 시 mine refresh 4건 일괄 fetch.",
      "🪶 P1-3 — GlobalErrorToast 의 `__reportingError` reentry guard. 오류 보고 자체가 오류를 일으키는 무한 루프 차단.",
      "🪶 P1-4 — `_toLecture` / `_toTour` 응답 매퍼에 `r.starts_at || r.startsAt` 패턴 + null guard 추가. 컬럼명 변경에 견고.",
      "🪶 P1-5 — 회원 등급 셀에 grade 미존재 시 `—` em-dash 폴백. 빈 셀 회피.",
      "🌳 P2-5 — 댓글 트리: `MAX_REPLY_DEPTH` (답글 차단) → `MAX_VISIBLE_DEPTH` (시각 깊이만 제한, 답글 무제한). 3 단계 이상은 [+ N개 더보기] / [- 접기] 버튼으로 펼침/접기 토글.",
      "🌱 P2-1 — LectureAdminPanel / TourAdminPanel / BooksAdminPanel 에 `샘플 데이터 추가` 버튼 (각 패널이 비어 있을 때만 노출). 강연 3 / 답사 3 / 책 2 권 시드.",
      "🔌 클라이언트 wiring — `BGNJ_COLUMNS.toggleLike` / `incrementViews` 가 새 endpoint 호출 + 메모리 캐시 갱신. `BGNJ_AUTH.fetchActivity` 추가 → MemberAdminPanel detail 이 서버 집계 사용. `BGNJ_LECTURES.refreshRegistrations` / `BGNJ_TOURS.refreshReservations` 가 신규 endpoint 사용. LectureAdminPanel / TourAdminPanel 이 mount 시 일괄 fetch.",
      "📦 cache-buster — `?v=00.038.000`.",
    ],
    context: "사용자 요청 'P1 은 전체 진행해줘 / P2 도 개선해주고' 한 묶음 처리. 사이클 시작 시점의 P1 5 항목 전부 + P2 6 항목 중 5 항목 처리 (PG 결제 P2-4 는 사용자 결정으로 보류). 서버 알림 부수효과를 도입해 클라이언트 알림 insert 를 완전히 제거할 토대 마련. 다음 사이클 권장: ① 클라이언트 측 BGNJ_COMMUNITY.addNotification 호출부 점진 제거 ② 칼럼 likes 의 D1 별도 테이블 분리(현재 user_columns.likes_json) ③ 알림 deeplink 정합 검수.",
  },
  {
    version: "00.037.000",
    date: "2026-04-29",
    summary: "🪶 새 브랜드 자산 + 의식주 + 행문 매트릭스 + 서버 운영 매트릭스 정리. 새 브랜드 로고(노란 라운드 + B + 뱅기 + 별 SVG) 를 BanginojaIcon / favicon / static asset 3 곳에 적용. 새 메뉴 3종(먹고 놀자 / 자고 놀자 / 사고 놀자) 신설로 의식주(衣食住) 3 요소가 행문(行文) 과 결합되는 인문학 여행 매트릭스 완성. KMS 본문에 '서버 기준 운영 매트릭스' 추가 — 의도적 클라이언트 보존 항목과 사유 명문화.",
    details: [
      "🎨 BanginojaIcon (Shell.jsx) — 비행기 아이콘 → 노란 라운드 사각형(64x64) + 흰색 'B' 컷아웃(fill-rule=evenodd) + 노란 뱅기 + 흰색 별 5 개 sparkle SVG 로 교체.",
      "🎨 index.html favicon — 인라인 SVG 를 새 브랜드 마크 동일 데이터 URI 로 교체.",
      "🎨 /assets/logo.svg — 정적 SVG 파일로 별도 저장 (OG 이미지·외부 사용 대비).",
      "🍽 새 메뉴 3종 — pages/EatSleepShopPages.jsx 신설. PlacePage 컴포넌트 + EatPage/SleepPage/ShopPage 3 종. 인트로 + 카테고리 그리드 + 예약 placeholder.",
      "  · /eat — 먹고 놀자 (식 食) — 한정식·향토음식·시장·제철식재·주안상",
      "  · /sleep — 자고 놀자 (주 住) — 한옥스테이·고택·게스트하우스·템플스테이·농가체험",
      "  · /shop — 사고 놀자 (의 衣 + 토산) — 전통공예·토산물·전통직물·도자·발효식품",
      "🪶 Nav 메뉴 — Shell.jsx 에 eat/sleep/shop 추가 (홈 다음 우측). VALID_ROUTES 에 3 라우트 추가. App.js switch 에 EatPage/SleepPage/ShopPage 연결.",
      "🪶 site_content_kv.nav — eat/sleep/shop 키 추가. 관리자에서 라벨 직접 편집 가능.",
      "🪶 hero 카피 갱신 — 'BANGINOJA · 먹고 자고 놀자 와 인문학 여행' / 부제 '의식주(衣食住) 생활의 3요소에 행문(行文)이 결합되는 여정. 먹고·자고·놀고·배우는 한국을, 뱅기노자와 함께 걷고 느낍니다.'",
      "🌐 BGNJ_STORES.grades / categories — App init 에서 BGNJ_API.grades.list / categories.list 호출로 D1 정의가 있으면 seed 를 덮어쓰는 패턴 추가. 서버 정의가 비면 seed 폴백.",
      "📜 KMS 본문 — '서버 기준 운영 매트릭스' 섹션 신설. 22 개 도메인의 D1 운영 상태 표 + '의도적 클라이언트 보존' 8 항목 사유 + '클라이언트→서버 전환 권장' 6 항목 + '의식주+행문 매트릭스' 도식.",
    ],
    context: "사용자 요청 5 가지 한 묶음 처리: ① 새 브랜드 로고(PDF) 적용 ② 메뉴 3종(먹고/자고/사고 놀자) 추가 + 의식주 + 행문 카피 ③ '클라이언트 운영 → 서버 운영' 으로 인식 정정(이미 서버 SoT 인 항목과 의도적 클라이언트 항목 명확히 구분) ④ 이전 갱신 분 KMS 동기 ⑤ 모든 변경 후 KMS 갱신. 서버 운영 매트릭스 표를 KMS 에 박아 다음 사이클 진입자(AI/사람)가 즉시 '어디까지 D1 영속이고 어디는 의도적으로 클라이언트인지' 한눈에 파악 가능. eat/sleep/shop 은 placeholder 페이지이며 다음 사이클에 venues/lodgings/goods D1 테이블 + 관리자 입력 폼 + 예약 흐름 구현 예정.",
  },
  {
    version: "00.036.000",
    date: "2026-04-29",
    summary: "P0 일괄 해소 + 디자인 시스템 라이브 도파. 결제 3폼에 BankAccountPicker 결합, 관리자 '열기' → PostViewerModal 모달, async 헬퍼 호출 사이트 4곳 await/try-catch 일괄 적용. KMS 디자인 탭을 텍스트 bullet → 실제 컴포넌트 샘플 + 토큰 카드 + 정의/특징/활용처 11섹션 라이브 도파로 전면 재구축.",
    details: [
      "🟢 버전 표시 — ADMIN_VERSION_HISTORY 헤더가 'v00.036.000' 처럼 v 접두사 표시.",
      "🟢 P0-1 — LecturesPage / WangsanamTourPage / BookCheckoutPage 결제 폼의 inline bank 표 → `BGNJ_BankAccountPicker` 셀렉터로 교체. 멀티 계좌 등록 시 사용자가 선택 가능. 단일 계좌만 있어도 폴백으로 단일 옵션 노출. 등록 0건이면 빨간 안내 카드.",
      "🟢 P0-2 — 관리자 community posts 패널 '열기' + reports 패널 '게시글 열기' 버튼이 모두 `PostViewerModal` 호출로 전환. 페이지 이동 없이 본문/메타/댓글을 모달에 노출.",
      "🟢 P0-3 — async 헬퍼 sync 호출 사이트 정리: LectureBookingPanel.submit/cancelMyReg/submitRefund + TourBookingPanel.submit/cancelMyReg/submitRefund + BookCheckoutPage.submit + MyPage.cancelOrder/requestRefund 모두 async + await + try/catch. 실패 시 에러 메시지 사용자에게 노출.",
      "🎨 KMS 디자인 탭 전면 재구축 — `DesignSystemView` 컴포넌트 신설. 11개 라이브 섹션:",
      "  ① 컬러 토큰 (11종 — 실제 hex 스와치 카드 + 역할/특징)",
      "  ② 타이포그래피 (5종 폰트 — 실제 렌더링된 샘플 + 사이즈/weight/letter-spacing)",
      "  ③ 스페이싱·라운드·엘리베이션 (4의 배수 스케일 시각화 + radius/shadow 박스)",
      "  ④ 버튼 5종 (실제 클릭 가능한 라이브 샘플)",
      "  ⑤ 배지·태그칩 (badge / badge-gold / tag-chip / 필터 칩)",
      "  ⑥ 폼 (input/select/textarea/error 인라인 라이브)",
      "  ⑦ 카드 (standard / emphasis / 인포 박스 3종)",
      "  ⑧ 표 (실제 데이터 표 샘플 + 헤더 스타일)",
      "  ⑨ 모달 (어두운 배경 + 닫기 패턴 시각화)",
      "  ⑩ 피드백 (인라인 에러 + 인라인 성공 + 토스트 샘플)",
      "  ⑪ 화면 작업 원칙 (기존 ADMIN_DESIGN_SECTIONS 통합)",
      "각 섹션 = `DSSection` 래퍼 (정의 · 특징 · 활용처 · 라이브 샘플 4-축).",
    ],
    context: "사용자 요청 '버전 35.000 보임 → 정상화', '모든 오류 해결', 'KMS 디자인 탭을 실질 디자인 샘플 + 용어 정의 + 특징 + 활용처로 완성'. 4 가지 P0 위험 중 (1) 결제 picker (2) post viewer modal (3) async wiring (4) 버전 표기 모두 본 커밋에서 해소. 디자인 탭은 텍스트 bullet 만 있던 형태에서 라이브 컴포넌트 + 토큰 + 4-축 메타데이터 도파로 전면 재구축되어 새 페이지 만들 때 바로 참고 가능.",
  },
  {
    version: "00.035.001",
    date: "2026-04-29",
    summary: "🩺 종합 점검 + 문서 동기화. 사이트 전반 잠재 오류 감사 → KMS 부록 '현재 위험 인벤토리' 섹션에 정리. project-priority-table 의 P0/P1/P2 재정리. ai-development-rules 에 서버 source-of-truth/await 의무/cache-buster 의무/매퍼 표준화 4개 운영 원칙 추가. KMS 디자인 탭을 현재 라이트 톤 디자인 시스템 기준으로 전면 갱신.",
    details: [
      "kms.md — '현재 위험 인벤토리' 섹션 신설. P0(결제 폼 BankAccountPicker 미wiring · PostViewerModal 미wiring · async 헬퍼 sync 호출) / P1(SEO/MyPage 이벤트 리스너 · 토스트 무한루프 가드 · 매퍼 표준화 · BGNJ_STORES 폴백) / P2(시드 backfill · 활동 집계 endpoint · 칼럼 좋아요 · PG 결제 · 댓글 트리 정책) 으로 분류된 표.",
      "project-priority-table.md — P3+ 표 갱신(Cloudflare 마이그레이션 ✅ / 멀티 계좌 ✅ / 운영 인프라 ✅) + '현재 사이클 우선순위' 섹션 신설.",
      "ai-development-rules.md — 4개 신규 원칙: ① 서버 source-of-truth 원칙(localStorage 는 UI 상태 외 쓰기 금지) ② 비동기 호출 await 의무(result.ok 같은 동기 검사 금지) ③ ?v= cache-buster 의무(BGNJ_VERSION 갱신과 동기) ④ 응답 매퍼 표준(snake_case 서버 / camelCase 클라이언트). 그리고 '현재 위험 인벤토리 갱신' 의무 추가.",
      "디자인 탭(ADMIN_DESIGN_SECTIONS) 전면 재작성 — 라이트 톤(파스텔 블루-회색 베이스 + 로열 블루 강조 + 골드 포인트), 실제 CSS 토큰(var(--bg)/var(--ink)/var(--gold) 등) 명시, 폰트 4종(Noto Serif KR/Noto Sans KR/Nanum Myeongjo/IBM Plex Mono) 역할, 컴포넌트 패턴(모달/표/필드/버튼 5종/오류 인라인+토스트), '관리자 GUI 원칙' 섹션 신설(텍스트로 구현된 운영 기능 금지), 디자인 금지 원칙 갱신(다크 먹색 회귀 금지 등).",
      "Worker 변경 없음 — 문서 사이클이라 재배포 불필요.",
    ],
    context: "사용자가 사이클 종료 시점에 '오류·문제 정리 + KMS/이력/우선순위/AI 가이드 + 디자인 탭 갱신' 을 요청. 다음 사이클 시작 전에 누구든(AI 포함) 이 4개 문서만 보면 (1) 어떤 P0 위험이 남아 있는지 (2) 다음에 무엇을 해야 하는지 (3) 어떤 원칙을 지켜야 하는지 (4) 화면을 어떤 톤으로 다듬어야 하는지가 한눈에 잡히도록 정리했습니다.",
  },
  {
    version: "00.035.000",
    date: "2026-04-29",
    summary: "운영 인프라 대규모 보강 — 멀티 입금 계좌 + 무통장 PUT CORS 수정 + ROPA 표 전환 + 회원 필터/정렬 + 오류 로그 패널 + SEO 관리 패널 + 토스트 자동 소거 + 관리자 게시글 모달 뷰어. 한 번에 8가지 운영 기능을 묶어 처리.",
    details: [
      "🔧 Worker CORS Allow-Methods 에 PUT 추가 — 무통장 계좌 저장(PUT /api/bank-account) preflight 통과. '강연 무통장 입금 정보 저장 시 Failed to fetch' 해결.",
      "💳 멀티 입금 계좌 — D1.bank_accounts 테이블 신설. CRUD 엔드포인트(GET/POST/PATCH/DELETE) + BankAccountPanel 표 형식 UI + 기본 계좌 지정 + 라벨/은행/계좌번호/예금주/메모. BGNJ_BankAccountPicker 결제 화면 셀렉터 컴포넌트 신설(다음 사이클에 강연/투어/책 결제 폼에 wiring 예정).",
      "🗑 설정 탭의 중복 BankAccountPanel 제거 — 안내문 인포 박스로 교체, 멀티 계좌는 '계좌번호 설정' 탭에서 단독 관리.",
      "📋 ROPA — 6열 카드 그리드 → 단일 표(ID/처리목적/법적근거/수집항목/보유기간/수탁사/국외이전). 가독성 + 비교 용이.",
      "🔍 회원 관리 — 상태 필터(전체/활성/정지됨/관리자만) + 정렬(가입일↓↑/이름가나다·역순/이메일/등급↓/게시글많은순/댓글많은순) 8가지. 검색·필터·정렬 동시 적용.",
      "🚨 오류 로그 — D1.error_log 테이블 + Worker POST /api/error-log (인증 불요, 익명 오류도 캡처) + GET /admin/error-log + DELETE. GlobalErrorToast 와 AppErrorBoundary 가 모든 오류를 자동 서버 보고. 관리자 시스템 메뉴 '오류 로그' 패널에서 검색/필터/전체삭제.",
      "⏱ 토스트 자동 소거 — GlobalErrorToast 가 10초 후 자동 사라짐. 사용자 명시 닫기 버튼도 유지.",
      "🌐 SEO 패널 신설 — '시스템 관리 > SEO' 탭. OG 제목/설명/이미지(파일 업로드) + Hero 상단 라벨/제목 3행/부제 + 브랜드명 편집. 저장 즉시 <head> 메타에 반영.",
      "📰 PostViewerModal — 관리자 패널 '열기' 버튼이 페이지 이동 대신 모달로 본문/메타/댓글을 한눈에 노출 (다음 커밋에 두 곳 wiring).",
      "📜 ai-development-rules.md — '작업 시작 전 오류 로그 우선 확인' 규칙 추가. AI 가 새 작업 받기 전에 D1.error_log 를 먼저 점검하도록 명문화.",
      "Worker 배포: Version c192f088-7642-449f-a9d6-900b9c6bfe2b.",
    ],
    context: "사용자 6 가지 요청을 한 묶음으로 처리: ① 무통장 저장 오류 ② 멀티 계좌 + 결제 시 선택 ③ 설정 탭 중복 제거 ④ ROPA 표 전환 ⑤ 회원 필터/정렬 ⑥ 오류 로그 자동 적재 + AI 우선 처리 규칙 ⑦ 토스트 10초 자동 소거 ⑧ SEO 관리 패널. 결제 화면 계좌 셀렉터와 PostViewerModal 의 wiring 은 다음 커밋에서 페이지 컴포넌트 sync→async 정리와 함께 진행.",
  },
  {
    version: "00.034.001",
    date: "2026-04-28",
    summary: "공감 토글 즉시 반영 + /api/me/tours 500 오류 수정 + 약관 편집 패널 서버 동기화 + 댓글 본문 가독성. 사용자 보고 'Failed to load /me/tours 500' / '공감 안 눌리거나 매우 느림' / '댓글 굵어서 헷갈림' 한꺼번에 처리.",
    details: [
      "Worker handleMyTours — tours 테이블에 없는 `location` 컬럼을 SELECT 하던 쿼리 수정 (title/starts_at/price 만 사용). /api/me/tours 가 200 으로 응답.",
      "Worker handleLikeToggle — 토글 후 likes user_id 배열을 응답에 동봉(`{ liked, likes, count }`). 클라이언트가 별도 GET 으로 재조회할 필요 없음 → 1회 round trip.",
      "BGNJ_COMMUNITY.toggleLike — 낙관적 UI 갱신(즉시 하트 채워짐) + 서버 응답으로 교정. 메모리 캐시(_serverPosts + BGNJ_STORES.communityPosts) 만 mutate, localStorage 미사용. 시드 게시글에서도 정상 동작.",
      "data.js renderCommentText — @멘션의 fontWeight 600 → 500. 댓글 본문 평문 가독성 회복.",
      "Worker 배포: Version e63c2760-1196-41de-870a-5c4d01063b8b.",
    ],
    context: "v00.032 의 트랜잭션 헬퍼 일괄 전환 직후 발생한 회귀 — handleMyTours 가 schema 와 어긋나 500 을 던졌고, toggleLike 가 2회 호출(toggle + list) 패턴이라 체감상 매우 느렸으며, 시드 게시글의 likes 가 캐시에 갱신 안 되어 클릭이 무시되는 것처럼 보였습니다. Worker 측 응답을 풍성하게 하고 클라이언트는 즉시 낙관적 갱신을 하는 표준 패턴으로 정리했습니다.",
  },
  {
    version: "00.034.000",
    date: "2026-04-28",
    summary: "🧹 과거 데이터 정리 + 옛 캐시 영구 무력화. 마이그레이션된 엔티티의 localStorage 잔재 일괄 삭제(자동), Service Worker / Cache API 캐시 강제 해제, D1 의 진단용 probe 계정 정리.",
    details: [
      "data.js — `cleanupV33` 마이그레이션 신설. 페이지 로드 시점에 마이그레이션된 엔티티(book_orders/book_reviews/books/lecture_*/tour_*/user_columns/column_engagement/audit_log/legal_docs/faqs/bank_account/site_content/users/session/bookmarks/reports/notifications/grades/categories/community_posts/user_posts/comments) 의 localStorage 키와 wsd_* 잔재를 일괄 삭제. UI 상태(카트/세션캐시/쿠키동의/임시저장/라우트) 는 보존. 'bgnj_cleanup_v33' 마커로 1회만 실행.",
      "index.html — 페이지 진입 시 등록되어 있을 수 있는 모든 Service Worker `unregister()` + Cache API `caches.delete()` 일괄 실행. 옛 SW 캐시가 새 빌드를 가리는 일을 영구 차단.",
      "정적 자산 cache-buster 를 `?v=00.034.000` 로 갱신. HTML 자체는 이미 `Cache-Control: no-cache, no-store, must-revalidate` 메타로 캐시되지 않음.",
      "D1 정리 — `probe-flow-%@example.com` / `signuptest+%@example.com` 진단용 테스트 계정 + 관련 sessions 일괄 DELETE. 정리 후 D1 상태: 사용자 1, 세션 1, 그 외 마이그레이션된 엔티티 모두 0(깨끗한 출발점).",
      "BGNJ_DIAG.run() 헬퍼는 그대로 유지 — 콘솔에서 진단 시 즉시 origin/health/session 보고.",
    ],
    context: "사용자 요청 '과거 데이터 정리 + 옛 캐시 삭제'. 클라이언트 측은 (1) localStorage 잔재 자동 삭제 (2) Service Worker / Cache API 강제 해제 (3) ?v= cache-buster 갱신 의 3중 안전망으로 옛 코드/데이터의 잔류 가능성을 차단했습니다. 서버 측은 진단 과정에서 만든 probe 계정을 D1 에서 모두 제거했습니다. 다음 진입부터는 사용자가 강제 새로고침 한 번이면 모든 레거시 잔재가 정리되고 콘솔에 [BGNJ] v00.034.000 배지 + cleanup 결과가 출력됩니다.",
  },
  {
    version: "00.033.000",
    date: "2026-04-28",
    summary: "관리자 페이지 GUI 가독성 보강 + BGNJ_COLUMNS 서버 전환. 회원 상세 프로필이 한글 라벨 카드로(JSON 덤프 제거 확정), 감사 로그 details 가 key/value 칩으로, 정지 사유 입력이 모달 다이얼로그로 교체. 새 책 추가도 prompt() 대신 인라인 폼. 사용자 칼럼이 D1 user_columns 테이블 source-of-truth 로.",
    details: [
      "ProfileFields — JSON.stringify(profile) 노출을 한글 라벨(생년월일/전화번호/우편번호/주소/상세주소/성별/관심분야/추천인) + 빈 값 dash 카드로 완전 교체. (v00.030 코드 확정)",
      "AuditDetailsCell — 감사 로그 details 의 raw JSON 을 key/value 칩 리스트로 렌더. action·target·by 는 그대로 mono 표시.",
      "SuspendDialog — '회원 정지' 액션의 prompt() 를 모달 다이얼로그로 교체. 사유 textarea + ESC/취소/적용 버튼.",
      "BooksAdminPanel — '새 책 추가' prompt() 를 인라인 폼으로 교체. 좌측 책 목록 상단에 입력창이 펼쳐지고 추가/취소 버튼.",
      "활성 동의 배지 한글화는 v00.030 에서 적용 완료.",
      "BGNJ_COLUMNS — D1 user_columns 테이블 신설 + Worker GET/POST/PATCH/DELETE 엔드포인트. 헬퍼가 BGNJ_API.columns 호출로 전환. localStorage(userColumns) 쓰기 제거. 좋아요/조회수는 다음 사이클에 별도 endpoint 추가 예정 (현재 no-op).",
      "App init useEffect 에 BGNJ_COLUMNS.refresh 자동 호출 추가.",
      "Worker 배포: Version 955d2989-bfc1-4339-b9e3-9cef15c18718.",
    ],
    context: "사용자 요청 '관리자페이지 가시성 + 텍스트로 구현된 기능은 없게'. 화면에 그대로 노출되던 JSON 덤프와 prompt() 호출을 모두 컴포넌트화 — 관리자 페이지의 모든 입력은 폼/모달로, 모든 데이터는 라벨/칩으로 표현됩니다. 캐시된 옛 페이지에서 JSON 이 보였던 것은 코드 변경 후 강제 새로고침이 필요했기 때문이고, ?v=00.033.000 cache-buster 가 다음 진입에서 자동 갱신.",
  },
  {
    version: "00.032.000",
    date: "2026-04-28",
    summary: "🌐 트랜잭션 헬퍼 일괄 서버 전환. BGNJ_BOOK_ORDERS / LECTURES / TOURS / BOOKS 가 모두 D1 source-of-truth 로 전환되었습니다. localStorage 영속화 호출(BGNJ_SAVE.*) 모두 제거. App 진입 시 + 로그인 시 본인 활동 데이터까지 자동 동기화.",
    details: [
      "BGNJ_BOOK_ORDERS — createOrder/confirmPayment/markShipped/markDelivered/cancelOrder/requestRefund/approveRefund/rejectRefund 가 모두 BGNJ_API.bookOrders 호출. refreshMine/refreshAll 로 캐시 동기화. 영수증/CSV 는 클라이언트에서 데이터로 포맷.",
      "BGNJ_LECTURES — listAll/getLecture/saveLecture/setHidden/deleteLecture/register/cancel/payment/refund/reviews 모두 서버 호출. refresh + refreshMine 으로 본인 신청 목록 동기화. _saveRegistrations 같은 BGNJ_STORES 쓰기 제거.",
      "BGNJ_TOURS — 동일 패턴. listAll/getTour/saveTour/setHidden/deleteTour/reserve/cancel/payment/refund/reviews 모두 서버. refreshMine 으로 본인 예약 동기화.",
      "BGNJ_BOOKS — list/get/create/update/remove/reorder 모두 BGNJ_API.books. _persist(localStorage) 쓰기 제거. 책별 리뷰는 BGNJ_BOOK_ORDERS 측 server reviews 로 위임.",
      "BGNJ_GRADE_PROMO — BGNJ_STORES.users 대신 BGNJ_AUTH._usersCache 참조. setGrade 가 async 라 fire-and-forget 으로 호출.",
      "App init useEffect — Promise.allSettled 로 SITE_CONTENT/FAQ/LEGAL/LECTURES/TOURS/BOOKS/bankAccount 일괄 refresh. 로그인 사용자는 추가로 mine/bookmarks/notifications 동기화.",
      "Worker, D1 schema, ALTER 컬럼은 v00.029-30 에서 이미 적용됨.",
    ],
    context: "사용자가 '모두 진행' 으로 강력하게 요구한 마이그레이션. 트랜잭션 헬퍼 4종(BOOK_ORDERS/LECTURES/TOURS/BOOKS) 을 한 번에 서버 source-of-truth 로 전환했습니다. 메소드 시그니처는 호환 유지하되 변경 메소드는 모두 async 로 전환. 페이지 컴포넌트가 sync 호출하는 경우 동작은 fire-and-forget 으로 흐르고, await 으로 명시 호출하는 경우 정상 흐름. 다음 작업: 페이지 컴포넌트(LecturesPage/WangsanamTourPage/BookCheckoutPage/MyPage/관리자 패널) 의 await + try/catch 정리, 그리고 BGNJ_COLUMNS 의 D1 테이블 생성과 서버 전환.",
  },
  {
    version: "00.031.000",
    date: "2026-04-28",
    summary: "COMMUNITY 좋아요/북마크/신고/알림 서버 전환. 사용자가 명시한 '로컬 업데이트는 존재하지 않는다' 정책에 맞춰 낙관적 로컬 쓰기를 모두 제거하고 순수 서버 호출로 변경했습니다. 다음 커밋에서 LECTURES/TOURS/BOOK_ORDERS/BOOKS metadata 까지 서버 전환을 완료할 예정.",
    details: [
      "BGNJ_COMMUNITY.toggleLike — POST /api/posts/:id/likes 토글 후 GET 으로 사용자 목록 재조회. 메모리 캐시(_serverPosts) 만 갱신, localStorage 미사용.",
      "BGNJ_COMMUNITY.toggleBookmark — POST /api/posts/:id/bookmark 호출 후 refreshBookmarks 로 서버 목록 재조회. 낙관적 업데이트 제거.",
      "BGNJ_COMMUNITY 신고/알림 — addReport 가 POST /api/reports 직호출. addNotification 은 no-op 으로 변환(서버 부수효과로 자동 발급). listReports/listNotifications 는 서버 sync 캐시 read.",
      "BGNJ_COMMUNITY._bookmarks/_notifications/_reports 메모리 캐시 + refreshBookmarks/refreshNotifications/refreshReports 메소드.",
      "CommunityPage handleLike/handleBookmark/handleReportSubmit 가 await + try/catch 로 호출, 실패 시 사용자에게 알림.",
    ],
    context: "이전 v00.030 에서 COMMUNITY 변경에 '낙관적 로컬 업데이트' 패턴을 도입했으나 사용자가 '로컬 업데이트는 존재하지 않는다' 고 명확히 재확인. 정책에 맞춰 순수 서버 호출로 전환했습니다. 다음 커밋: BGNJ_LECTURES/TOURS/BOOK_ORDERS 등 트랜잭션 헬퍼들이 여전히 BGNJ_STORES 에 영속하고 있으며, 이들도 서버로 마이그레이션 필요. 각 헬퍼 30여 메소드 + 페이지 동기→비동기 전환이 동반되는 광범위 작업.",
  },
  {
    version: "00.030.000",
    date: "2026-04-28",
    summary: "관리자 회원 운영 서버 전환 + 회원 상세 가시성 개선. 등급 변경/관리자 토글/정지/해제/삭제가 D1 에 영속되며, 정지된 사용자는 로그인 거부 + 기존 세션 즉시 무효화. 회원 상세의 프로필 JSON 덤프를 라벨링된 카드로 교체.",
    details: [
      "BGNJ_AUTH 의 setGrade/toggleAdmin/suspendUser/unsuspendUser/removeUser 가 모두 PATCH /api/admin/users/:id 또는 DELETE 호출로 전환. D1 에 영속.",
      "BGNJ_AUTH._usersCache + refreshUsers() 신설. listUsers() 가 캐시 우선, 비어있으면 레거시 폴백.",
      "MemberAdminPanel — mount 시 refreshUsers() 자동 호출, 변경 액션이 await 로 동작 후 자동 새로고침. 'bgnj-users-refresh' 이벤트로 다른 패널과도 동기화.",
      "Worker handleAdminUserPatch 가 suspended/suspendedReason/name 필드 추가 처리 + 정지 시 해당 사용자 모든 세션 즉시 DELETE.",
      "Worker handleAuthLogin 이 suspended=1 사용자 로그인 거부(HTTP 403 + 사유 메시지 동봉).",
      "users 테이블 ALTER — suspended/suspended_reason/suspended_at 컬럼 추가.",
      "ProfileFields 컴포넌트 신설 — 회원 상세의 프로필을 한글 라벨(생년월일/전화번호/우편번호/주소/상세주소/성별/관심분야/추천인) + 빈 값 dash 표시로 가독성 있는 카드로 노출. 기존 JSON.stringify 덤프 제거.",
      "활성 동의 배지가 한글 라벨로 표시(이용약관·개인정보 처리방침 / 마케팅 메일 / 제3자 제공).",
      "Worker 배포: Version a3ff1281-92c8-4742-84e4-3279499e084c.",
    ],
    context: "사용자 요청 '관리자페이지 가시성 확보' + '나머지 페이지 다음 커밋' 의 첫 분량. 회원 운영(가장 자주 쓰는 관리 액션) 을 우선 서버 source-of-truth 로 전환했고, 회원 상세 화면에서 가입 시점에 받은 프로필 정보를 한눈에 읽을 수 있도록 가독성을 정리했습니다. 다음 커밋: BGNJ_LECTURES / TOURS / BOOK_ORDERS / COMMUNITY / BOOKS metadata 의 서버 전환과 해당 페이지 컴포넌트의 동기→비동기 호출 패턴 적용.",
  },
  {
    version: "00.029.000",
    date: "2026-04-28",
    summary: "🌐 서버 source-of-truth 1차 — Worker 에 빠진 모든 운영 엔드포인트 추가 + D1 스키마 보강 + 가입 시 프로필 저장 + 작은 헬퍼들(LEGAL/FAQ/AUDIT/SITE_CONTENT) 서버 연결. 큰 트랜잭션 헬퍼(BOOK_ORDERS/LECTURES/TOURS/COMMUNITY) 는 다음 사이클에서 일괄 전환.",
    details: [
      "가입 시 프로필 저장 — 회원가입 폼의 birthdate/phone/zip/addr/gender/interest/recommender 가 Worker → users.profile_json 으로 영속.",
      "Worker 신규 핸들러 — PATCH /api/me, DELETE /api/posts/:id/comments/:cid, GET /api/me/lectures + /me/tours + /me/orders, POST /api/lectures/:id/reviews, POST /api/tours/:id/reserve + /reviews, POST /api/book-orders + GET /api/admin/book-orders + PATCH /api/book-orders/:id, GET/POST /api/books/:id/reviews, GET/PATCH /api/site-content + section, FAQ CRUD, GET/PUT /api/legal/:slug, GET/PUT /api/bank-account, Categories CRUD, Grades upsert, POST /api/admin/audit. 약 30+ 신규 엔드포인트.",
      "D1 schema-v3.sql 추가 — legal_docs, faqs, bank_account(단일행 시드), site_content_kv, grades_kv, categories_kv. ALTER 로 book_orders 에 order_no/recipient/phone/address_detail/zip/memo/price/tracking/cancelled_at/refund_status 컬럼 보강.",
      "api.js — siteContent / faqs / legal / bankAccount / categories / grades / bookOrders / books.reviews / lectures.reviews + mineRegistrations + cancel/patch / tours.reserve + reviews + mineReservations / posts.comments.remove / admin.audit.create 네임스페이스 신설.",
      "BGNJ_LEGAL — 서버(D1.legal_docs) source of truth 로 전환. _cache 에 메모리 캐시. refresh() 비동기 호출.",
      "BGNJ_FAQ — 서버(D1.faqs) source of truth. add/update/remove/reorder 모두 BGNJ_API.faqs 호출.",
      "BGNJ_AUDIT — log() 는 fire-and-forget 으로 서버 전송 + 즉시 메모리 캐시 갱신. refresh() 가 D1.audit_log 에서 최근 로그 fetch.",
      "BGNJ_SITE_CONTENT — saveSection/resetSection 모두 서버 PATCH. 페이지 진입 시 refresh() 한 번 자동 호출.",
      "App 진입 시 일괄 동기화 — BGNJ_SITE_CONTENT/FAQ/LEGAL refresh 가 useEffect 에서 자동 발화.",
      "Worker 배포: Version 2b830622-c6f0-471d-a36f-93bbbee5866e. CORS/auth 환경변수 동일 유지.",
    ],
    context: "사용자 요청 '로컬에서 처리되는건 없어야 한다'에 대응한 1차 마이그레이션. Worker 측은 모든 누락 엔드포인트를 한 번에 추가했고 D1 스키마도 운영 모든 엔티티(약관/FAQ/계좌/사이트콘텐츠/등급/카테고리)에 대응하는 테이블을 갖췄습니다. 클라이언트는 작고 결합도 낮은 헬퍼(LEGAL/FAQ/AUDIT/SITE_CONTENT) 부터 서버 source-of-truth 패턴으로 전환했고, 큰 트랜잭션 헬퍼(BOOK_ORDERS/LECTURES/TOURS) 는 다음 커밋에서 일괄 전환합니다. 다음 작업은 BGNJ_LECTURES/TOURS/BOOK_ORDERS/COMMUNITY/AUTH grade-suspend/BOOKS metadata 의 서버 연결 + 페이지 컴포넌트의 동기→비동기 호출 전환.",
  },
  {
    version: "00.028.000",
    date: "2026-04-28",
    summary: "🚨 가입 블로커 수정 + 좀비 세션 차단 + 푸터 정비. data.js 의 BGNJ_AUTH 에 동일 이름의 signUp 메소드가 두 번 정의되어 있었고 뒤쪽의 레거시 로컬 전용 signUp 이 위쪽의 Cloudflare 호출용 signUp 을 덮어쓰고 있었습니다. 즉 모든 회원가입이 localStorage 에만 저장되고 D1 에 도달하지 못했습니다. 이를 제거해 가입이 실제로 서버에 저장되도록 정상화했습니다.",
    details: [
      "🔥 data.js BGNJ_AUTH — 중복 정의된 레거시 로컬 signUp(payload) 제거. 위쪽의 async signUp(=BGNJ_API.signup 호출) 만 남겨 가입이 D1 에 정상 저장되도록 함. 그동안 가입은 화면상 '성공' 으로 보였지만 새로고침/세션 검증 시점에 사라지던 원인이었음.",
      "BGNJ_AUTH.refreshSession — /api/auth/me 가 401 일 때 localStorage 캐시도 즉시 비움. 좀비 세션(서버에는 없는데 클라이언트에선 로그인된 것처럼 보이는 상태) 차단.",
      "푸터 — '개인정보 처리 · 관리자' 버튼 제거(관리자 진입은 상단 내비의 '관리' 버튼으로만). 본문 가운데의 큰 'CURRENT DEPLOY VERSION' 카드 제거. 하단 줄 버전 표기는 더 작고 차분하게.",
      "푸터 연락 정보 동적화 — 이메일/전화/전화 링크/주소를 사이트 콘텐츠의 `contact` 섹션에서 읽도록 변경. 빈 값이면 해당 줄 미노출.",
      "관리자 사이트 콘텐츠 패널 — '푸터 — 연락 정보' 카드 신설(이메일/전화/전화 링크/주소). 푸터 카드는 '소개·서명' / '연락 정보' 로 분리.",
    ],
    context: "사용자 보고('회원가입이 일회성/로컬에서만 적용된다') 가 결정적인 단서였습니다. D1 직접 조회로 scoutkorea@kakao.com 행이 0개임을 확인했고, BGNJ_AUTH 객체에 동일 이름 메소드 두 개가 정의되어 있어 객체 리터럴 덮어쓰기 규칙으로 레거시 로컬 메소드가 활성화된 상태임을 식별했습니다. 이 한 줄 충돌이 전체 인증 파이프라인을 무력화하고 있었습니다. 같이 묶은 좀비 세션 차단은 같은 문제로 캐시에 잘못 들어간 데이터가 다음 진입에서도 계속 사용자처럼 보이는 부작용을 끊는 안전망입니다. 푸터 정비는 사용자 별도 요청.",
  },
  {
    version: "00.027.004",
    date: "2026-04-28",
    summary: "HTTP 환경 정상화 — SSL 미도입 기간에도 사이트가 정상 동작하도록 Worker CORS 에 HTTP origin 을 추가하고 세션 쿠키의 SameSite 를 None 으로 변경했습니다. v00.027.003 의 HTTPS 강제 리다이렉트는 제거. 다음 단계로 GitHub Pages 의 무료 HTTPS 활성화 안내.",
    details: [
      "index.html — v00.027.003 에서 추가한 HTTP→HTTPS 자동 리다이렉트 제거 (SSL 도입 후 재활성화 예정).",
      "Worker — `ALLOWED_ORIGINS` 에 `http://bgnj.net`, `http://www.bgnj.net`, `http://scoutkorea-jimmy.github.io` 추가. HTTPS 도입 후 제거 권장.",
      "Worker — 세션 쿠키 플래그 `SameSite=Lax` → `SameSite=None`. 사이트(bgnj.net) 와 API(workers.dev) 가 서로 다른 도메인이라 cross-site 인 fetch credentials:include 호출에 쿠키가 동봉되려면 SameSite=None 이 필수. Secure 는 workers.dev 가 항상 HTTPS 라 충족.",
      "검증 — `curl -I -X OPTIONS ... -H 'Origin: http://bgnj.net'` 가 `access-control-allow-origin: http://bgnj.net` 으로 응답하는 것 확인.",
    ],
    context: "사용자가 HTTPS 가 유료라고 인식해 HTTP 환경을 유지하고 싶어 하셨습니다. 실제로는 GitHub Pages 가 자동으로 무료 Let's Encrypt 인증서를 발급해 주므로 (저장소 Settings → Pages → 'Enforce HTTPS' 토글) 추가 비용 없이 HTTPS 전환이 가능합니다. 다만 즉시 적용을 위해 우선 HTTP 환경에서도 로그인이 정상 동작하도록 백엔드 정책을 임시 완화했습니다. 이 완화는 SameSite=None 으로 인한 보안 노출(약간 더 넓은 cross-site 쿠키 동봉) 이 있으므로 SSL 도입 후 SameSite=Lax 로 되돌리는 게 좋습니다.",
  },
  {
    version: "00.027.003",
    date: "2026-04-28",
    summary: "HTTPS 강제 리다이렉트. 사용자가 `http://bgnj.net` (HTTP) 로 접속하면 Cloudflare Worker API 가 CORS 거부해 로그인이 'Failed to fetch' 로 실패하던 문제를 차단했습니다. 페이지 진입 즉시 https:// 로 자동 전환되도록 index.html 최상단에 가드를 추가했습니다.",
    details: [
      "index.html — `<head>` 진입 즉시 `location.protocol === 'http:'` 면 `https:` 로 `location.replace`. localhost / 127.0.0.1 은 예외(개발 환경 평문 허용).",
      "원인 — Worker 의 ALLOWED_ORIGINS 는 `https://bgnj.net` 만 허용. 사용자가 주소창에 `bgnj.net` 만 치면 일부 브라우저/북마크가 `http://` 로 진입하고, 그 결과 모든 API 호출이 CORS preflight 단계에서 차단되어 'Access to fetch ... blocked by CORS policy' / 'Failed to fetch' 로 보임.",
      "보완 안내 — Cloudflare DNS/SSL 패널의 'Always Use HTTPS' 설정도 켜두면 서버 측에서도 301 리다이렉트가 추가로 적용됨(클라이언트 가드와 이중 안전장치).",
    ],
    context: "v00.027.001 의 새 에러 패널이 'NETWORK_OR_CORS' 코드를 정확히 보여줬고, 사용자가 콘솔 스크린샷을 공유해 주신 덕에 origin 이 `http://bgnj.net` 인 것을 즉시 식별할 수 있었습니다. CORS 거부의 진짜 원인은 네트워크 단절이나 Worker 미배포가 아니라 프로토콜 불일치였습니다. 같은 패턴이 반복되지 않도록 클라이언트 측에서 즉시 HTTPS 로 점프하도록 강제했습니다.",
  },
  {
    version: "00.027.002",
    date: "2026-04-28",
    summary: "캐시 무력화 + 진단 도구. 새 코드를 배포해도 사용자의 브라우저가 이전 JS 를 캐시한 상태로 보고 있어 'Failed to fetch' 같은 옛 메시지가 계속 노출되던 문제를 영구 차단했습니다. 모든 정적 자산에 버전 쿼리를 붙여 신규 배포 시 자동 갱신되도록 정리하고, 콘솔에 현재 버전 배지와 진단 헬퍼를 추가했습니다.",
    details: [
      "index.html — 모든 `<script>` / `<link>` 에 `?v=00.027.002` cache-buster 부착. 다음 배포부터는 BGNJ_VERSION 갱신과 함께 동기 갱신.",
      "index.html — `<head>` 에 `Cache-Control: no-cache, no-store, must-revalidate` / `Pragma: no-cache` / `Expires: 0` meta 추가. HTML 자체가 옛 캐시로 머물면 새 버전 쿼리도 못 보기 때문에 HTML 은 캐시하지 않음.",
      "data.js — 페이지 로드 시점에 콘솔에 `[BGNJ] v00.027.002 · build 2026.04.28` 배지 출력. 사용자가 개발자 도구 콘솔에서 어떤 버전을 보고 있는지 즉시 확인 가능.",
      "data.js — `BGNJ_DIAG.run()` 헬퍼 신설. 콘솔에서 한 줄 실행으로 origin / 헬스체크 / 세션 상태를 한 번에 진단. 'Failed to fetch' 가 발생하는 환경에서 어디 단계가 막혔는지 즉시 파악 가능.",
    ],
    context: "v00.027.001 에서 오류 가시화를 마쳤지만, 사용자 브라우저가 옛 alert 코드를 캐시한 상태라면 새 인라인 패널이 영영 보이지 않는다는 사용자 보고가 들어왔습니다. 정적 사이트 + Cloudflare CDN 환경에서 흔한 문제이며, 배포할 때마다 사용자에게 강제 새로고침을 요구할 수는 없으므로 자산에 버전 쿼리를 붙여 브라우저가 새 파일을 받아오도록 만들었습니다. HTML 자체도 캐시 무효화 헤더를 붙여 새 버전 쿼리를 항상 볼 수 있게 보장합니다. 진단 헬퍼는 다음에 또 비슷한 보고가 들어왔을 때 운영자가 사용자에게 '콘솔에 BGNJ_DIAG.run() 입력해 주세요' 한 줄로 끝낼 수 있게 한 안전장치입니다.",
  },
  {
    version: "00.027.001",
    date: "2026-04-28",
    summary: "오류 가시화 묶음. 로그인/회원가입 실패는 alert 대신 코드·상태·정확한 사유·사용자 가이드를 함께 보여주는 인라인 에러 패널로 노출하고, 사이트 전반의 미처리 비동기 오류와 렌더링 오류도 코드와 함께 화면에 표시되도록 통합했습니다. 오류가 발생했을 때 '왜' 가 분명해지는 흐름을 만들었습니다.",
    details: [
      "BGNJ_API.request — 네트워크/CORS/HTTP/응답 해석 실패를 분류해 `err.kind / err.code / err.status / err.body / err.url` 로 throw. 'Failed to fetch' 류는 `NETWORK_OR_CORS` 코드로 호출 측에 전달.",
      "BGNJ_AUTH.signIn / signUp — 실패 시 `{ ok:false, code, status, kind, message, hint, url }` 구조 반환. 401/403/409/400/5xx 와 네트워크 단절을 구분해 사용자 가이드(`hint`) 를 자동 부여.",
      "AuthErrorPanel — 로그인/회원가입 폼 안에 인라인으로 에러 코드, 상태, 사유, 가이드, 요청 URL, 개발자 도구 안내까지 한 카드로 노출. 입력값을 수정하거나 모드를 바꾸면 자동으로 사라짐.",
      "클라이언트 사전 검증도 alert → 인라인 에러로 통일 (FORM_EMAIL_REQUIRED, FORM_PASSWORD_TOO_SHORT 등 의미 있는 코드 부여).",
      "AppErrorBoundary 강화 — 렌더링 오류 발생 시 코드/사유/스택/컴포넌트 스택을 분리해 펼쳐볼 수 있는 카드로 노출. '다시 시도' 와 '페이지 새로고침' 두 액션 제공.",
      "GlobalErrorToast 신설 — `unhandledrejection` 과 `window.error` 이벤트를 잡아 우하단 토스트로 코드+사유+가이드+요청 URL 표시. 인증 외 비동기 호출(게시글 동기화, 강연 등록 등)에서 발생한 오류도 화면에 도달.",
      "모든 분류된 에러는 console.error 로 동시에 기록 — 개발자 도구 콘솔/네트워크 탭에서 빠르게 추적 가능.",
    ],
    context: "이전에는 로그인이 실패해도 'Failed to fetch' 같은 모호한 alert 만 한 줄 떠서 운영자도 사용자도 원인을 알기 어려웠습니다. 이번 작업으로 오류는 (1) 어떤 코드인지, (2) 어떤 상태인지, (3) 정확한 사유가 무엇인지, (4) 사용자가 무엇을 해야 하는지가 한 화면 안에 보이게 됩니다. 인증 흐름은 폼 안 인라인 패널로, 그 외 비동기 오류는 우하단 토스트로, 렌더링 오류는 풀스크린 카드로 분리해 — 화면 어디에서 무슨 일이 났는지가 즉시 파악되는 구조입니다.",
  },
  {
    version: "00.027.000",
    date: "2026-04-28",
    summary: "회원가입/로그인 페이지 정비 + 댓글 다단계 트리 + @멘션 자동완성 + 새 글 임시저장 + 슈퍼관리자 자동 승격 + 등급 자동 강등 + Worker CORS 확장. 회원가입 시 불필요한 동의 항목을 걷어내고 약관 클릭으로 모달 노출, 좌측 영역을 관리자에서 이미지/문구 직접 편집 가능하도록 전환했습니다.",
    details: [
      "댓글 답글 트리 — 1단계 → 최대 3단계 재귀 렌더. 답글 버튼이 모든 깊이에서 노출되며 부모 작성자에게 `@닉` 프리필이 자동 삽입됩니다. 텍스트 안의 `@닉네임` 토큰은 골드 chip 으로 강조 렌더.",
      "@멘션 자동완성 textarea — 본댓글/답글 모두 적용. `@` 입력 시 같은 글의 작성자 후보 리스트가 뜨고 ↑/↓/Enter/Esc 또는 마우스 클릭으로 삽입.",
      "새 글 임시저장 — 사용자별 키(`bgnj_post_draft_{userId}`)로 localStorage 에 800ms 디바운스 저장. 다음 진입 시 자동 복원 + '새로 시작' 버튼, 발행 성공 시 자동 정리. 수정 모드에서는 동작하지 않음.",
      "회원가입 페이지 정비 — 네이버/카카오 소셜 로그인 버튼 + OR 구분선 + AUTH STATUS·CLOUDFLARE 안내 박스 + '뱅기노자 칼럼·답사 일정 메일 수신' / '파트너 기관 행사 안내 제3자 제공' 동의 항목 모두 제거. 동의는 이용약관/개인정보 처리방침만 필수.",
      "이용약관/개인정보 처리방침 모달 — 회원가입 동의 줄에서 텍스트 클릭 시 `BGNJ_LEGAL` 본문이 모달로 표시. Esc / 바깥 클릭 / 닫기 버튼으로 종료.",
      "관심분야 '기타' 자유 입력 — 셀렉트에서 '기타 (직접 입력)' 선택 시 60자 텍스트 input 노출. 저장 시 자유 입력값이 그대로 profile.interest 에 저장.",
      "추가 정보 안내 강조 — '입력하지 않아도 모든 사이트 기능을 동일하게 이용할 수 있다'는 문구를 골드 박스로 명시.",
      "로그인/회원가입 좌측 영역 관리자 편집 — `DEFAULT_SITE_CONTENT.auth` 섹션 신설(eyebrow/title/description/imageDataUri). 사이트 콘텐츠 패널의 '로그인/회원가입 좌측 영역' 카드에서 즉시 편집 가능하며, 이미지 업로드 시 그라데이션 대신 배경 이미지 사용.",
      "왕사들/王사들 잔재 일괄 제거 — 좌측 영역 헤더 '王사들' 제거, 관리자 버전 기록 changelog 의 잔여 표기를 익명화/일반화.",
      "슈퍼 관리자 자동 승격 (Worker) — `SUPER_ADMIN_EMAILS` 환경변수에 등록된 이메일은 가입/로그인/세션 조회 시점마다 `is_admin=1, grade_id='admin'` 강제. 부트스트랩 admin 유무와 무관하게 즉시 승격. `scoutkorea@kakao.com` 등록.",
      "Worker CORS 확장 — `localhost`/`127.0.0.1` 의 임의 포트(VS Code Live Server, Vite, Python http.server 등)를 정규식으로 자동 허용. 'Failed to fetch' 의 가장 흔한 원인(허용 origin 누락) 해결.",
      "등급 자동 강등 — `BGNJ_GRADE_PROMO.maybeDemote / reevaluateAll` 추가. 글·댓글 삭제 시점에 작성자 자격 등급 재평가하여 현재 등급보다 자격 등급이 낮으면 자동 강등 + 알림 + 감사 로그.",
    ],
    context: "두 갈래 작업이었습니다. 한쪽은 회원가입 페이지를 실제로 운영 가능한 형태로 다듬는 작업입니다. 미사용 소셜 로그인 버튼을 걷어내고, 약관 본문을 모달로 노출하고, 관심분야에 '기타'를 추가하고, 좌측 영역을 운영자가 손쉽게 갈아끼울 수 있도록 사이트 콘텐츠로 묶었습니다. 다른 한쪽은 사용자 경험에서 막혀 있던 작은 빈 칸을 메우는 작업입니다. 댓글이 1단계에서 멈추던 것을 3단계 트리로 풀고, @멘션 자동완성을 붙이고, 새 글을 쓰다가 페이지를 닫으면 사라지던 임시저장을 복원했습니다. 백엔드 쪽에서는 슈퍼관리자가 가입할 때마다 권한이 떨어지는 문제와 로컬 개발 환경(다른 포트)에서 'Failed to fetch' 가 나는 문제를 함께 해결했습니다. 등급 자동 강등은 승격만 있던 비대칭을 없애고, 글/댓글이 삭제됐을 때 자격 기준 미달이면 자동으로 내려가도록 했습니다.",
  },
  {
    version: "00.026.000",
    date: "2026-04-27",
    summary: "브랜드 정비(이전 명칭 정리) 마무리 + 관리자 콘솔 7대 카테고리 재정렬 + Cloudflare 백엔드 인프라 셋업 + 운영 버그 일괄 처리. 사이트 콘텐츠/책 카탈로그 관리 패널, 게시글 일괄 말머리, 칩형 게시판 필터, 강연·투어 hidden 운영, 쿠키 동의 배너, 알림 종모양 라인아트 아이콘을 한 번에 도입했습니다.",
    details: [
      "전역 네임스페이스 통일 — `wsd_*`/`WSD_*` → `bgnj_*`/`BGNJ_*`. localStorage / sessionStorage / 글로벌 헬퍼 / 문서 노트 모두 일괄 변경. data.js 상단에 일회성 마이그레이션을 두어 기존 사용자의 wsd_* 키 데이터를 bgnj_*로 자동 복사(원본 보존).",
      "브랜드 잔여 정리 — 이전 명칭/도메인/심볼 표기를 뱅기노자/bgnj.net/현 디자인 시스템으로 통합. 로그인 시 발생하던 미정의 식별자 에러 해결, 고아 컴포넌트 파일과 styles.css 잔여 클래스 삭제.",
      "관리자 메뉴 7개 대카테고리 재정렬 — 요약 / 콘텐츠 / 회원관리 / 쇼핑 / 운영설정 / 개인정보 관리 / 시스템 관리. 책 카탈로그 / 책 주문이 쇼핑 그룹으로 분리되고, 회원·등급은 회원관리로 통합, 감사 로그 중복 렌더 제거.",
      "사이트 콘텐츠 편집 패널 — 메뉴 라벨 / 히어로 텍스트 / 푸터 문구 / 브랜드명 / 로고·파비콘(파일 업로드 → dataURI) / OG 메타. 저장 시 head meta가 즉시 갱신되어 카카오톡·페이스북 공유 미리보기에 반영.",
      "다양한 책 카탈로그 시스템 — `BGNJ_BOOKS` 헬퍼(list/get/create/update/remove/setHidden/addReview/removeReview) + `BooksAdminPanel` (메타·가격·상태·표지 PNG 업로드·PDF 미리보기 업로드·소개·목차·저자·리뷰 모더레이션). 책마다 독립된 reviews 배열.",
      "강연/투어 hidden 운영 — 시드 데이터 + override 패턴이라 시드 항목 삭제가 무효화되던 문제 해결. `setHidden(id, hidden)` / `listAll({includeHidden})` API + 관리자 패널의 숨김 토글·배지·흐림 처리. 시드 항목은 자동 hidden 처리, override-only는 완전 삭제.",
      "관리자 커뮤니티 칩형 필터 — 게시판 분류 드롭다운 → 검색 입력 위 칩 (전체/공지/자유/질문/정보/...) + 항목별 카운트, role=tab/aria-selected.",
      "게시글 일괄 말머리(prefix) 설정 — 체크박스 선택 → 일괄 작업 바에 말머리 입력 + 적용 (비우면 제거).",
      "쿠키 동의 배너 — 첫 방문 시 표시, 필수/분석/마케팅 항목별 동의(필수 거부 불가). PIPA·GDPR 가이드라인. 결정은 `bgnj_cookie_consent`에 영속화되고 `bgnj-cookie-consent` CustomEvent 발화.",
      "알림 아이콘 → 종모양 라인아트 SVG (◇ 기호 → bell.outline). 미읽음 카운트 배지는 그대로.",
      "Cloudflare 백엔드 인프라 셋업 — D1 데이터베이스 `banginoja-db` 생성 + 스키마(users/sessions/posts/comments/books/book_reviews/book_orders/categories/grades/site_content) 적용, R2 버킷 `banginoja-media` 생성, `workers/wrangler.toml` + `workers/schema.sql` 추가. Worker API 코드는 다음 버전.",
      "회원등급 색상 블루 팔레트 마이그레이션 — 노란/금 hex 잔여 → #64748B/#94A3B8/#93C5FD/#3B82F6/#2563EB/#1E3A8A. 일회성 캐시 마이그레이션 추가.",
      "기타 — '왕의길' 메뉴 → '뱅기노자의 길', 책 CTA 잡문구(3만원 무료배송 / 10% 적립 / 사인본 한정수량) 제거, 커뮤니티 미존재/등급 미달 게시글 접근 가드, .gitignore 추가, .DS_Store/.wrangler 캐시 git 제거.",
    ],
    context: "이번 묶음은 두 갈래입니다. 한쪽은 이전 브랜드의 모든 흔적을 코드와 화면에서 지우고 '뱅기노자'로 통일하는 정리 작업, 다른 한쪽은 운영자가 코드 수정 없이도 사이트를 굴릴 수 있게 만드는 패널 확장입니다. 사이트 콘텐츠/책 카탈로그/일괄 말머리/숨김 운영이 그 축이고, Cloudflare 백엔드(D1·R2) 인프라가 다음 사이클(서버 인증, 게시글 동기화, 미디어 업로드)의 토대가 됩니다. 메뉴 구조도 운영 흐름에 맞춰 7개 대카테고리(요약·콘텐츠·회원관리·쇼핑·운영설정·개인정보 관리·시스템 관리)로 재정리해, 같은 성격의 작업이 한 그룹 안에 모이도록 했습니다.",
  },
  {
    version: "00.025.003",
    date: "2026-04-27",
    summary: "도메인 연결 사전작업 + 잔여 hooks 위반 수정. GitHub Pages용 GitHub Actions 워크플로우와 CNAME(bgnj.net) 추가, 일부 페이지의 hooks-before-return 위반을 정리해 라우팅 변경 시 재마운트 안전성 확보.",
    details: [
      "GitHub Pages 자동 배포 워크플로우 추가 — main push 시 정적 파일을 publish.",
      "커스텀 도메인 bgnj.net 연결 (Cloudflare DNS A/CNAME + GitHub Pages 인증서 발급).",
      "Hooks before return 위반 수정 — 라우팅 가드보다 React.useState 호출이 먼저 오도록 정리.",
    ],
    context: "도메인 연결과 GitHub Pages 자동 배포 라인을 마무리하면서, 페이지가 라우팅 분기에서 마운트/언마운트될 때 hooks 순서가 어긋나 발생하던 잠재적 불안 요소를 같이 정리했습니다.",
  },
  {
    version: "00.019.000",
    date: "2026-04-26",
    summary: "기능 정상화 묶음. 댓글 답글 트리·강연/투어 신규 등록·강연 후기·주문 영수증·운영 감사 로그·활동 기반 자동 등급 승격을 한 번에 도입했습니다. 운영자가 한 사이트 안에서 컨텐츠를 추가·관리·기록하는 흐름이 모두 닫혔습니다.",
    details: [
      "댓글 답글 트리(`CommentTree`) — 커뮤니티/칼럼 모두 1단계 들여쓰기 답글, 글 작성자 자동 알림 발화, 사이드 들여쓰기 표시.",
      "강연 후기 섹션(`LectureReviewsSection`) — 투어 후기와 같은 패턴으로 별점 + 본문, 참가 확정 회원만 작성. `BGNJ_LECTURES.canReview / addReview / listReviews / deleteReview` 추가, `BGNJ_STORES.lectureReviews` 신규.",
      "강연/투어 신규 등록 — 관리자 콘텐츠 메뉴의 강연·투어 탭에 `+ 새 강연 추가` / `+ 새 투어 추가` 버튼. 추가하면 즉시 편집 폼이 열려 정원·일정·가격을 채울 수 있고, 카드 헤더에는 삭제 버튼이 함께 노출.",
      "주문 영수증 다운로드 — `BGNJ_BOOK_ORDERS.generateReceipt / downloadReceipt`로 텍스트 영수증을 발급. 마이페이지 내 주문 카드와 관리자 왕의길 탭에서 `영수증 ↓` 버튼으로 다운로드.",
      "운영 감사 로그(`BGNJ_AUDIT` + `AuditLogPanel`) — 회원 등급 변경/정지/삭제, 관리자 권한 토글, 강연/투어/책 입금 확인·발송·배송 완료·취소가 모두 자동 기록. 관리자 시스템 메뉴 `감사 로그` 탭에 검색·CSV·전체 삭제와 함께 노출.",
      "활동 기반 자동 등급 승격(`BGNJ_GRADE_PROMO`) — 댓글 5개 이상이면 독자, 글 3개 + 댓글 15개 이상이면 사관으로 자동 승격(승격은 일어나도 강등은 없음). 승격 시 본인에게 알림이 자동 발화되고 감사 로그에도 기록됨. createPost / addComment 시점에 트리거.",
    ],
    context: "5개 미션 운영 사이클이 모두 닫힌 뒤, 사용자 입장에서는 답글이 안 달리고 후기가 한 영역만 있고 영수증이 없는 식의 작은 빈 칸이 눈에 띄었습니다. 운영자 입장에서도 강연/투어를 새로 만드는 흐름이 코드를 건드려야 가능했고, 어떤 운영 액션이 언제 일어났는지 추적이 어렵다는 한계가 있었습니다. 이번 PR은 그 빈 칸들을 한꺼번에 메우면서, 각 액션이 감사 로그로 자동 기록되도록 흐름을 일치시켰습니다.",
  },
  {
    version: "00.018.000",
    date: "2026-04-26",
    summary: "회원·게시판·권한·약관·FAQ·강연 UI·투어 후기까지 한 번에 정리한 운영 인프라 PR입니다. 관리자가 실제 등록 회원의 등급·정지·삭제를 직접 다루고, 게시판은 카드형 추가 + 순서/글 수/권한 매트릭스로 한 화면에서 정비할 수 있게 됐습니다. 약관/개인정보 처리방침과 자주 묻는 질문은 별도 라우트로 노출되며 관리자에서 본문을 직접 편집합니다. 강연 페이지는 투어와 같은 탭+스티키 사이드바 UI로 재구조됐고, 투어 페이지에는 참여 후기 영역이 도입됐습니다.",
    details: [
      "`BGNJ_AUTH` 확장 — `setGrade(userId, gradeId)`, `toggleAdmin`, `suspendUser(reason)`, `unsuspendUser`, `removeUser`, `getActivity`. 정지된 사용자는 `signIn`이 거부.",
      "`MemberAdminPanel` 신설 — 실제 등록 회원 목록(검색·등급 필터·CSV) + 상세에서 등급 즉시 변경(셀렉트), 관리자 권한 토글, 정지/해제, 계정 삭제, 게시글·댓글·북마크·강연·답사·주문 활동 요약과 최근 게시글/주문/강연/답사 리스트.",
      "`AdminCategoryPanel` 개선 — 카드형 추가 폼(이름 입력 시 ID 자동 생성), 순서 ▲▼ 이동, 게시판별 글 수, 설명 인라인 수정 + `등급 × 게시판` 권한 매트릭스 뷰(읽기/쓰기 ✓/·).",
      "`BGNJ_LEGAL` + `LegalAdminPanel` + `LegalPage` 신설 — 개인정보 처리방침/이용약관을 Tiptap 에디터로 편집, `bgnj_legal_docs` 저장소. 푸터 버튼이 `privacy` / `terms` 라우트로 연결.",
      "`BGNJ_FAQ` + `FaqAdminPanel` + `FaqPage` 신설 — FAQ 추가/수정/삭제/순서 변경, 카테고리별 그룹·검색 + 아코디언 형태로 공개. 푸터 `자주 묻는 질문` 버튼이 `faq` 라우트로 연결.",
      "`LecturesPage` 전면 재구조 — `TourPage`와 동일한 탭 + 좌측 본문(이미지·진행 흐름·참고) + 우측 스티키 `LectureBookingPanel`(잔여/대기 + 신청 폼 + 무통장 입금 안내 + 본인 상태 카드 + .ics).",
      "`TourPage` 하단에 `TourReviewsSection` 추가 — 참가 확정 회원만 별점 + 후기 작성, 평균 평점 + 별 표시, 본인/관리자 삭제 가능.",
      "`CommunityPage` 상단에 `MY ACCESS` 배너 — 현재 등급(컬러 배지)·레벨·읽기 가능/쓰기 가능 게시판 수와 이름 노출(비로그인은 비로그인 안내).",
      "관리자 사이드바 운영 설정 그룹에 `약관/개인정보` · `자주 묻는 질문` 탭 추가. KMS 미션 영역들도 새 운영 자산을 반영하도록 업데이트.",
    ],
    context: "Cycle 1~5에서 5개 미션의 운영 사이클이 모두 닫혔으니, 다음 자연스러운 단계는 운영자가 실제로 매일 만지는 '회원/게시판/약관/FAQ' 관리 흐름을 정리하는 것이었습니다. 회원 패널이 가짜 PRIVACY 목 데이터에 묶여 있던 한계를 풀고, 게시판은 추가/삭제/순서 변경·권한 매트릭스를 한 화면에서 제공하도록 개선했습니다. 약관/개인정보 처리방침과 FAQ는 코드 수정 없이 운영자가 직접 갱신할 수 있어야 운영 신뢰가 누적되므로 별도 저장소와 편집기를 도입했습니다. 강연 UI는 투어와 같은 패턴이 더 일관된다는 판단으로 통일했고, 투어 후기는 신청 → 참가 → 후기로 이어지는 사이클의 마지막 고리를 메우는 작업입니다.",
  },
  {
    version: "00.017.000",
    date: "2026-04-25",
    summary: "Cycle 5(투어 판매·운영) 출시와 공통 인프라 강화를 한 묶음으로 진행했습니다. 투어가 카탈로그였던 상태에서 회원 전용 신청 → 무통장 입금 → 관리자 입금 확인 → 참가 확정 사이클로 닫혔고, 정원·대기열·.ics·URL 해시 딥 링크까지 강연/책과 같은 패턴으로 정렬됐습니다. 동시에 강연/책/투어의 상태 변화가 사용자에게 자동 알림으로 전달되는 통합 알림 인프라가 도입됐고, 장바구니가 새로고침에도 유지되도록 localStorage 영속화가 들어갔습니다.",
    details: [
      "`BGNJ_TOURS` helper 신설 — listAll / getTour / saveTour / deleteTour / reserve / cancelReservation / confirmPayment / unconfirmPayment / getSeats / hasUserReserved / listMyReservations / generateIcs / downloadIcs.",
      "`BGNJ_STORES`에 `tourOverrides` / `tourReservations` 신설. 시드 투어(`BANGINOJA_DATA.tours`)에 `capacity` / `priceNumber` / `startsAt` / `durationMinutes` 필드 추가.",
      "`TourPage` 전면 개조 — 사이드바 `예약 신청` / `대기자 등록` mock을 실제 신청 폼(`TourBookingPanel`)로 교체. 본인 상태 카드 + 무통장 입금 안내 + .ics 다운로드 + 신청 취소까지 같은 위치에서 처리.",
      "관리자 콘텐츠 메뉴 `투어 프로그램` 탭을 mock 표 → `TourAdminPanel`로 교체 — 잔여/대기 표시 + 투어 정보 수정(capacity·일정·가격) + 참가자 명단 + 입금 확인 토글 + 신청 취소.",
      "App에 `#tour-{id}` 해시 라우팅 추가, 홈 알림/마이페이지에서 `sessionStorage.bgnj_pending_tour_id` 경유로 투어 상세 점프.",
      "마이페이지 `예정 답사` 정적 카드를 `MY TOURS — 내 답사 신청` 개인화 카드로 교체(상태별 컬러 라벨).",
      "통합 알림 인프라 — `BGNJ_LECTURES.confirmPayment / _promoteWaitlist`, `BGNJ_BOOK_ORDERS.confirmPayment / markShipped / markDelivered / cancelOrder`, `BGNJ_TOURS.confirmPayment / _promoteWaitlist`가 상태 변경 시 본인에게 알림을 자동 push. 헤더 ◇ 알림 벨이 알림 타입별로 강연 / 투어 / 마이페이지 / 커뮤니티 라우트로 라우팅.",
      "장바구니 localStorage 영속화 — App `cart` 상태가 `bgnj_cart` 키로 저장/복원되어 새로고침과 페이지 이동 사이에서도 유지됨.",
      "KMS 미션 4(투어) 영역을 위 변경에 맞게 재기록. 미션 평가 카드 20% → ~70%.",
    ],
    context: "Cycle 3(강연), Cycle 4(책)에서 검증된 무통장 입금 + 정원·대기열 + 입금 확인 패턴을 그대로 투어에도 적용했습니다. 같은 helper 형태와 같은 `bankAccount` 저장소를 공유하므로 운영자가 한 번 익히면 세 영역 모두 같은 방식으로 운영할 수 있습니다. 동시에 결제 사이클이 닫힌 세 영역 모두에서 상태 변경이 사용자에게 보이지 않으면 의미가 없어, 알림 인프라를 한 PR에 묶어 통합했고 장바구니 손실을 막기 위한 localStorage 영속화도 같이 넣었습니다.",
  },
  {
    version: "00.016.000",
    date: "2026-04-25",
    summary: "Cycle 4(뱅기노자 책 판매) 출시. 회원 전용 무통장 입금 단일 흐름으로 책 주문 → 입금 → 발송 → 배송 완료 사이클을 닫고, 관리자 콘솔의 메뉴 명칭을 홈페이지 내비와 일치시켰습니다(커뮤니티 / 강연 / 투어 프로그램 / 뱅기노자 칼럼 / 왕의길).",
    details: [
      "`BGNJ_BOOK_ORDERS` helper 신설 — listAll / listByStatus / listMine / getOrder / createOrder / confirmPayment / unconfirmPayment / markShipped(tracking) / markDelivered / cancelOrder / exportCsv. 주문번호는 `WSD-YYYYMMDD-NNN` 시퀀스로 자동 생성.",
      "`BGNJ_STORES.bookOrders` 신설 — 단일 배열에 모든 주문 보관(상태 머신: pending_payment → paid → shipped → delivered, 또는 cancelled).",
      "`CheckoutPage` 전면 개조 — 비로그인 차단 + 회원 전용 + 무통장 입금 안내 단일 흐름. 다단계 mock(카드/계좌이체/간편결제)을 모두 제거하고 배송 정보 한 폼으로 단순화. 운영자 계좌가 비어 있으면 결제 버튼 비활성화.",
      "주문 완료 화면 — 주문번호 · 계좌 안내 · 결제 금액 · 배송지를 한 페이지에 요약. 입금자명 가이드 자동 노출.",
      "관리자 콘텐츠 메뉴에 `왕의길` 탭 신설(`BookOrderAdminPanel`) — 상태별 필터 + 카드 + 입금 확인 → 발송 → 배송 완료 액션 + 송장 입력 + CSV 다운로드.",
      "관리자 사이드바 메뉴 명칭을 홈페이지와 일치 — `게시글` → `커뮤니티`, `칼럼` → `뱅기노자 칼럼`, `투어` → `투어 프로그램`, `주문` 제거 + `왕의길` 추가, 그룹 명 `회원/주문` → `회원`.",
      "관리자 대시보드 4번째 KPI를 `왕의길 주문` 카드로 교체(전체 주문 수 + 입금 대기 카운트, 대기 0이면 골드 / 있으면 경고 색).",
      "마이페이지 `ORDER STATUS` 카드를 `내 주문 내역` 카드로 교체 — 본인 주문 4건 + 외 N건, 상태별 컬러 라벨, 송장 표시.",
      "강연/책 결제는 같은 `bankAccount` 저장소를 공유하므로 시스템 → 설정 한 곳에서 변경하면 양쪽 모두 반영.",
      "KMS 미션 5(책 판매) 영역을 위 변경에 맞게 재기록. 미션 평가 카드 25% → ~65%.",
    ],
    context: "PG 도입 전이라도 운영 사이클을 닫는 것이 우선이라, 강연 Cycle 3에서 검증된 무통장 입금 패턴을 책 판매에도 그대로 옮겨 왔습니다. 같은 `bankAccount` 저장소를 공유하도록 만들어 운영자가 한 곳에서만 입력하도록 했고, 관리자 메뉴 명칭은 홈페이지 내비와 같은 단어를 쓰도록 통일해 사용자/운영자 사이의 인지 비용을 줄였습니다.",
  },
  {
    version: "00.015.000",
    date: "2026-04-25",
    summary: "사이트 전반의 UX 개선 묶음을 출시했습니다. 관리자 버전 기록을 10건씩 페이지네이션하고 총 개수 요약을 상단에 노출, 우하단 '맨 위로' 플로팅 버튼 추가, 내비 `커뮤니티`에 마우스를 올리면 게시판 서브메뉴가 펼쳐지고, 헤더의 `고딕 / 명조` 토글이 사이트 전체(헤더·푸터·카드 포함) 본문 폰트에 적용되도록 확장했습니다. 카테고리 관리 화면에서는 게시판 제목과 설명을 인라인으로 직접 수정할 수 있습니다.",
    details: [
      "관리자 버전 기록 탭에 10건/페이지 페이지네이션 추가 + 상단에 총 N개 요약 / 최신 버전 표시.",
      "공통 ScrollToTop 컴포넌트 신설 — 320px 이상 스크롤 시 우하단 ↑ 플로팅 버튼 노출. 일반 화면과 관리자 내부 스크롤 컨테이너를 모두 감지.",
      "내비 `커뮤니티` 항목에 hover/포커스 시 게시판 서브메뉴(메가메뉴) 표시. BGNJ_STORES.categories 중 사용자 등급으로 볼 수 있는 항목을 자동 노출하고 클릭 시 sessionStorage(`bgnj_pending_board_id`) 경유로 해당 게시판 탭이 선택됨.",
      "관리자 카테고리 패널에서 게시판 설명(desc)도 인라인 편집 가능. 제목(label)은 기존대로 인라인 수정.",
      "`고딕 / 명조` 토글이 .app 루트의 `--font-serif` / `--font-sans` / `--font-display` / `--font-reading` 네 변수를 동시에 명조로 바꿔 nav·footer·카드·홈·강연 등 인라인 style의 var(--font-serif)까지 따라오도록 확장. 모노 / 브랜드 / 토글 자체는 유지.",
      "내비 menu에 `강연` 진입점을 추가해 강연 라우트 접근성을 높임.",
    ],
    context: "Cycle 3 출시 직후 사용자가 다섯 가지 UX 개선을 한 번에 요청해, 결제 인프라처럼 깊이 작업할 거리는 아니지만 사이트 전반에 영향을 주는 항목들을 한 PR로 묶어 처리했습니다. 특히 폰트 토글은 기존에 main 안쪽만 적용되던 한계가 있어 CSS 변수 단위에서 갈아끼우는 방식으로 바꿔, 향후 인라인 style을 추가해도 자동으로 따라오게 만들었습니다.",
  },
  {
    version: "00.014.000",
    date: "2026-04-25",
    summary: "Cycle 3(뱅기노자 강연 운영) 출시. 회원 전용 강연 신청, 무통장 입금 결제(PG 도입 전 임시), 관리자 입금 확인 → 참가 확정, 정원/대기열 자동 처리, .ics 캘린더 다운로드, 마이페이지 내 신청 내역, 관리자 강연 탭 + 계좌번호 설정까지 한 PR에 묶었습니다.",
    details: [
      "`BGNJ_LECTURES` helper 신설 — listAll / getLecture / saveLecture / deleteLecture / register / cancelRegistration / confirmPayment / unconfirmPayment / getSeats / hasUserRegistered / listMyRegistrations / generateIcs / downloadIcs / getBankAccount / saveBankAccount.",
      "`BGNJ_STORES`에 `lectureOverrides` / `lectureRegistrations` / `bankAccount` 신설. 시드 강연(`BANGINOJA_DATA.lectures`)은 capacity / price / startsAt / durationMinutes를 갖도록 확장.",
      "`pages/LecturesPage.jsx` 신규 — 강연 목록 / 상세 / 신청 폼(회원 전용) / 무통장 입금 안내 / 본인 상태 카드 / 신청 취소 / .ics 다운로드.",
      "App에 `lectures` 라우트와 `#lecture-{id}` 해시 딥 링크 추가. 홈 강연 카드 클릭 타겟을 `tour` → `lectures`로 변경.",
      "마이페이지 `예정 강연` 정적 카드를 `MY LECTURES — 내 신청 강연` 개인화 카드로 교체(상태별 컬러 표시).",
      "관리자 콘텐츠 메뉴에 `강연` 탭 신설 — 강연 정보 수정(제목/일정/정원/가격) + 참가자 명단 + 입금 확인 토글 + 신청 취소.",
      "관리자 시스템 메뉴 `설정` 탭에 `BankAccountPanel` 추가 — 은행 / 계좌번호 / 예금주 / 안내 메모 입력. 비어 있으면 신청 화면에서 안내 차단.",
      "KMS 미션 2(강연) 영역을 위 변경에 맞게 재기록. 미션 평가 카드 25% → ~70%.",
    ],
    context: "사용자가 PG는 한참 뒤로 미루고 무통장 입금부터 시작하자는 결정을 명시적으로 내려서, 전체 결제 인프라가 빠진 상태로도 운영 사이클이 닫히도록 흐름을 잡았습니다. 회원만 신청 가능한 정책과 관리자가 입금을 직접 확인하는 단계가 핵심이고, 계좌번호는 관리자 설정 탭에서 입력해 노출되는 구조라 향후 운영 명의가 바뀌어도 코드 변경 없이 따라갈 수 있습니다.",
  },
  {
    version: "00.013.000",
    date: "2026-04-25",
    summary: "Cycle 2(뱅기노자 칼럼 운영 강화)를 한 PR에 묶었습니다. 임시 저장 / 예약 발행 / 발행 취소 / 수정 흐름과 좋아요 / 공유 링크 / 댓글 / 검색 / 카테고리 아카이브 / 추정 읽기 시간 자동 계산을 모두 도입해 칼럼이 단순 발행물에서 운영 가능한 콘텐츠 자산으로 전환되었습니다. URL 해시 딥 링크(`#col-{id}`, `#post-{id}`)도 함께 추가되어 외부 공유가 가능해졌습니다.",
    details: [
      "`BGNJ_COLUMNS` helper 신설 — listAll / listPublic / getColumn / saveColumn / deleteColumn / searchPublic / estimateReadTime / 자동 promote.",
      "콘텐츠는 `BGNJ_STORES.userColumns`(`status` = draft / scheduled / published)에 통합 저장. 좋아요·조회수는 `BGNJ_STORES.columnEngagement` 맵으로 분리(시드 칼럼도 동일).",
      "관리자 칼럼 에디터에 `임시 저장 / 예약 발행 / 즉시 발행 / 발행 취소 / 수정` 버튼과 상태 필터(전체/발행/예약/임시) 추가. DRAFT / SCHEDULED / PUBLISHED 배지로 상태 가시화.",
      "공개 칼럼 페이지에 검색 입력 / 카테고리 토글 / 카드별 ♥·조회수 인디케이터 / 추정 읽기 시간 자동 계산 도입.",
      "칼럼 상세에 ♥ 공감 토글 + 공유 링크 복사(`#col-{id}` 해시) + 댓글(등록 / 삭제 / 등급 배지) + 이전/다음 네비게이션 추가.",
      "App에 URL 해시 라우팅 추가: `#col-{id}` → 칼럼 상세, `#post-{id}` → 커뮤니티 상세.",
      "홈 추천 칼럼과 관리자 대시보드 카운트가 `BGNJ_COLUMNS.listPublic()`을 사용하도록 정리 — draft/scheduled은 더 이상 공개 화면에 새지 않음.",
      "KMS 기능정의서 미션 3(칼럼) 영역을 위 변경에 맞게 재기록.",
    ],
    context: "Cycle 2의 목표는 '칼럼이 한 번 발행되고 끝나는 일회성 흐름'을 닫는 것이었습니다. 발행 사이클(임시→예약→발행→발행취소)과 독자 상호작용(공감·공유·댓글)이 같이 들어와야 비로소 콘텐츠가 자산으로 누적되기 때문에, 두 흐름을 한 PR에 묶었습니다. RSS와 이메일 구독은 외부 인프라가 필요해 후속 사이클로 미뤘고, 대신 URL 해시 딥 링크를 도입해 단기 공유는 작동하게 했습니다.",
  },
  {
    version: "00.012.000",
    date: "2026-04-25",
    summary: "Cycle 1(뱅기노자 커뮤니티 마무리)을 한 PR에 묶었습니다. 좋아요·북마크·신고·댓글 알림·작성자 등급 배지·게시글 페이지네이션을 모두 도입해 단순 게시판이었던 흐름을 '커뮤니티'로 끌어올렸습니다. 관리자 콘솔에는 신고 운영 큐 탭이 새로 들어왔고, 마이페이지에는 북마크와 알림 카드가 추가됐습니다.",
    details: [
      "커뮤니티 글 상세에 `좋아요(♥)` 토글 도입 — 누른 사용자 ID를 글에 보존하고, 상세/액션/목록에서 수치를 모두 같은 값으로 표시.",
      "글 상세에 `북마크(★/☆)` 토글과 마이페이지 BOOKMARKS 카드 도입(`BGNJ_STORES.bookmarks` 신설).",
      "글 상세 `신고` 버튼을 사유 입력 폼으로 확장하고, 관리자 콘텐츠 메뉴에 `신고` 탭 신설(필터: 미처리/처리 완료/반려/전체, 액션: 게시글 열기 / 처리 완료 / 반려 / 게시글 삭제+처리).",
      "댓글 등록 시 본인 글이 아니면 작성자에게 알림이 쌓이도록 연결(`BGNJ_STORES.notifications`). 내비게이션에 ◇ 알림 벨과 미읽음 배지·드롭다운 추가, 마이페이지 NOTIFICATIONS 카드도 동시 노출.",
      "글 목록 / 글 상세 / 댓글 작성자에 회원 등급 배지(`AuthorGradeBadge`)를 인라인 표시. `BGNJ_USER_GRADE` / `BGNJ_AUTHOR_GRADE` helper 신설.",
      "커뮤니티 글 목록에 페이지네이션(10건/페이지) 추가. 검색·탭이 바뀌면 1페이지로 리셋.",
      "관리자 CSV 다운로드 헤더에 `likes` 컬럼 추가.",
      "외부 진입(알림 클릭 / 신고 큐 / 마이페이지 카드)에서 글 상세로 점프할 때 `sessionStorage.bgnj_pending_post_id` 패턴을 도입.",
      "KMS 기능정의서 미션 1(커뮤니티) 영역을 위 변경에 맞게 재기록.",
    ],
    context: "Cycle 1의 목표는 '커뮤니티가 게시판처럼 보이는 문제'를 닫는 것이었습니다. 글의 흐름은 이미 살아 있었지만 사용자가 다른 사람의 반응(좋아요/등급/알림)을 거의 느끼지 못해 참여 동기가 약했습니다. 이번 PR은 그 사회적 신호를 한 번에 깔고, 운영자가 신고를 처리할 수 있는 큐까지 같이 붙였습니다. 결제 의존이 없는 영역이라 한 사이클에 묶어 끝내는 것이 ROI가 가장 컸습니다.",
  },
  {
    version: "00.011.000",
    date: "2026-04-25",
    summary: "기능정의서를 사이트의 5가지 미션(뱅기노자 커뮤니티 / 뱅기노자 강연 일정 / 뱅기노자 칼럼 / 뱅기노자 투어 프로그램 / 뱅기노자 책 판매) + 공통 기반(BASE) 영역 단위로 재정렬하고, 각 영역에 `현재 평가 / 없는 기능 / 기능별(요소·기술 스펙·유의할 점·개발 이슈) / 영역 차원 기술 스펙·유의할 점·개발 이슈` 표준 블록을 도입했습니다. 관리자 KMS 화면에는 우측 스티키 목차(TOC)를 추가해 영역 간 이동을 빠르게 만들었습니다.",
    details: [
      "기능정의서를 페이지 단위에서 미션 단위로 재구성: 공통 기반(00) + 커뮤니티(01) + 강연 일정(02) + 칼럼(03) + 투어(04) + 책 판매(05) 6개 영역.",
      "각 미션마다 현재 평가와 '완성도를 높이려면 필요한 것'(없는 기능) 목록을 명시.",
      "각 영역의 기능을 단일 카드로 정리하고 `요소 / 기술 스펙 / 유의할 점 / 개발 이슈` 4축으로 표준화.",
      "영역 헤더에 라우트, 상태 배지, 진입 시 평가 카드를 추가해 한 영역의 구도를 한 화면에서 파악할 수 있게 함.",
      "관리자 KMS 화면 오른쪽에 240px 스티키 목차를 추가해 6개 영역 + 평가 요약을 빠르게 이동할 수 있게 함. 좁은 화면에서는 위로 이동.",
      "최상단에 5가지 미션 평가 요약 카드를 두어 사이트 전체 완성도를 한눈에 보여줌(상태·커버리지·평가).",
    ],
    context: "KMS를 누르는 사람이든 AI든 가장 먼저 던지는 질문은 '이 사이트가 무엇을 위해 만들어졌고, 그 기능이 어디까지 와 있는가'입니다. 그래서 기능정의서를 페이지 단위로 나열하던 방식에서 사이트가 존재하는 5가지 미션 단위로 바꾸고, 각 미션마다 평가와 빈 칸을 명시해 다음 작업의 우선순위가 자연스럽게 보이도록 만들었습니다. 우측 목차는 영역이 늘어날수록 아래로 길어지는 본문 안에서 길을 잃지 않도록 도와줍니다.",
  },
  {
    version: "00.010.000",
    date: "2026-04-25",
    summary: "KMS 내부 구조를 `기능정의서`와 `디자인` 두 탭으로 재정리하고, 진입 시 기본 탭을 `기능정의서`로 고정했습니다. 기능정의서는 실제 라우트 기준으로 진입 경로, 접근 권한, 실제 화면 구성, 사용자 가능 동작, 데이터 출처, 구현 상태, 알려진 미구현 항목까지 페이지별로 깊이 있게 다시 작성했습니다.",
    details: [
      "KMS의 `운영 원칙` 탭을 제거하고 `기능정의서`와 `디자인` 두 탭만 남겼습니다.",
      "기능정의서 항목 구조를 `진입 경로 / 접근 권한 / 목적 / 실제 화면 구성 / 사용자 가능 동작 / 실제 데이터 기준 / 알려진 미구현 / 운영 메모 / 구현 상태` 9개 축으로 표준화했습니다.",
      "각 페이지(홈, 인증, 마이페이지, 커뮤니티, 투어/강연, 칼럼, 책/체크아웃, 관리자)의 화면 섹션과 사용자 동작을 현재 코드 기준으로 다시 정리했습니다.",
      "KMS 요약 카드를 두 탭 중심 안내(기본 = 기능정의서)로 다시 썼습니다.",
    ],
    context: "KMS를 누르면 사람이든 AI든 가장 먼저 봐야 할 것이 `이 사이트가 지금 어떤 기능을 갖고 있는지`라는 점이 명확해졌습니다. 그래서 운영 원칙 탭은 KMS 화면에서는 빼고 기능정의서와 디자인만 남겨, 무엇이 만들어져 있고 어떤 기준으로 손대야 하는지를 한 호흡에 확인할 수 있게 정리했습니다. 운영 원칙은 `kms.md` 문서 본문과 버전 기록에서 계속 관리합니다.",
  },
  {
    version: "00.009.000",
    date: "2026-04-25",
    summary: "관리자 대시보드를 실제 저장소 수치 기준으로 다시 연결했고, 사용자 화면에서는 왕사남 소개 영역과 진입점을 제거했습니다. KMS는 실제 페이지 기준 기능정의서로 개선하고, KMS 내부에 `기능정의서`, `디자인`, `운영 원칙` 탭을 둬 필요한 기준을 바로 찾아볼 수 있게 재구성했습니다.",
    details: [
      "대시보드가 `BGNJ_AUTH`, `BGNJ_COMMUNITY`, `BGNJ_STORES`, `BANGINOJA_DATA`를 기준으로 실제 수치를 보여주도록 바뀌었습니다.",
      "내비게이션, 홈, 라우트에서 왕사남 소개 진입점을 제거하고 홈에는 강연 일정만 남겼습니다.",
      "KMS 내부에서 기능정의서와 디자인 기준을 분리해 실제 페이지 구성과 작업 원칙을 더 명확히 확인할 수 있게 했습니다.",
    ],
    context: "관리자에서 보는 숫자가 하드코딩이면 운영 판단 기준으로 쓰기 어렵고, KMS도 실제 페이지 구조보다 추상적인 설명이 많으면 다음 작업자의 판단 속도가 느려집니다. 그래서 이번에는 운영 화면과 문서 둘 다 실제 구성 기준으로 다시 정리했습니다.",
  },
  {
    version: "00.008.000",
    date: "2026-04-25",
    summary: "KMS를 기능정의서 중심 문서로 재정리해 현재 홈페이지 기준 전체 기능 범위를 더 자세히 기록했고, 관리자 페이지에는 `디자인` 탭을 신설해 화면 작업 시 참고할 디자인 원칙을 별도로 볼 수 있게 했습니다.",
    details: [
      "KMS 문서에 기능정의서 우선 원칙을 추가하고, 페이지별 기능 목적과 상태를 더 자세히 정리했습니다.",
      "디자인 원칙서를 별도 섹션으로 추가해 브랜드 무드, 컬러, 타이포그래피, 레이아웃, 금지 원칙을 정리했습니다.",
      "관리자 페이지 시스템 메뉴에 `디자인` 탭을 추가해 실제 작업 화면에서 디자인 기준을 바로 확인할 수 있게 했습니다.",
    ],
    context: "여러 개발자가 KMS를 먼저 참고하는 흐름에서는 규칙보다 기능 범위와 디자인 기준이 먼저 눈에 들어와야 다음 작업이 빨라집니다. 그래서 KMS의 제1 기능을 기능정의서로 명확히 고정하고, 디자인 기준도 별도 탭으로 분리했습니다.",
  },
  {
    version: "00.007.000",
    date: "2026-04-25",
    summary: "P2 첫 단계로 커뮤니티 게시글과 댓글을 local-first 단일 저장소로 통합하고, 글 수정·삭제·조회수 저장을 붙였습니다. 관리자 게시글 화면도 같은 데이터를 읽도록 바꿔 검색, 분류 필터, CSV 다운로드, 삭제 기능을 실제 운영 흐름으로 연결했습니다.",
    details: [
      "`communityPosts` 저장소와 `BGNJ_COMMUNITY` helper를 추가해 게시글/댓글 흐름을 한 계층으로 묶었습니다.",
      "커뮤니티 상세에서 작성자 또는 관리자가 글과 댓글을 직접 수정·삭제할 수 있게 했습니다.",
      "관리자 게시글 탭이 실제 저장소를 읽고 검색, 필터, CSV 다운로드, 삭제를 수행하도록 연결했습니다.",
    ],
    context: "P2에서 가장 체감이 큰 영역은 커뮤니티였고, 사용자 화면과 관리자 화면이 서로 다른 게시글 데이터를 보면 운영 기능이 계속 목업 상태에 머물 위험이 컸습니다. 그래서 먼저 게시글과 댓글을 단일 저장소로 통합하는 작업을 우선 진행했습니다.",
  },
  {
    version: "00.006.000",
    date: "2026-04-25",
    summary: "P1 기준으로 local-first 인증/데이터 저장 구조를 분리해 회원 저장소와 세션 저장소를 실제로 연결했고, 로그인·회원가입·로그아웃이 같은 인증 계층을 보도록 정리했습니다. 현재 GitHub Pages 환경에서도 확장 가능한 구조로 운영 기준을 명확히 잡았습니다.",
    details: [
      "`BGNJ_AUTH`, `BGNJ_DB`, `BGNJ_STORES.session`, `BGNJ_STORES.users`를 도입해 인증과 데이터 저장 구조를 분리했습니다.",
      "회원가입 시 실제 사용자 레코드를 저장하고, 로그인 시 저장된 사용자와 비밀번호 해시를 검증하도록 바꿨습니다.",
      "앱 전역 로그아웃과 로그인 상태 유지가 동일한 세션 저장소를 바라보도록 정리했습니다.",
    ],
    context: "P1을 계속 부분 완료 상태로 두면 이후 기능이 다시 임시 구조 위에 쌓일 위험이 컸습니다. 정적 배포 환경 안에서도 인증과 데이터 저장 구조를 분리한 기반을 먼저 세워야 다음 단계 확장이 흔들리지 않는다고 판단했습니다.",
  },
  {
    version: "00.005.001",
    date: "2026-04-25",
    summary: "KMS를 사이트 전체 기능 인벤토리 기준으로 확장해 다른 개발자가 코드 없이도 구조를 파악할 수 있게 정리했고, 로그인/회원가입 흐름에 기본 검증과 인증 상태 안내를 추가해 현재 인증 방식이 임시 운영 구조임을 더 명확하게 표시했습니다.",
    details: [
      "KMS 문서에 홈, 인증, 마이페이지, 커뮤니티, 투어, 칼럼, 책, 관리자 기능 목록과 구현 상태를 정리했습니다.",
      "로그인/회원가입에 이메일, 비밀번호, 약관 동의, 비밀번호 확인 검증을 추가했습니다.",
      "인증 페이지에 현재 인증 방식과 임시 관리자 계정을 설명하는 안내 카드를 추가했습니다.",
    ],
    context: "KMS가 규칙만 있고 기능 사전 역할은 부족했고, P1 인증/권한 흐름도 사용자가 현재 상태를 명확히 이해하기 어려운 점이 있어 구조와 안내를 함께 정리할 필요가 있었습니다.",
  },
  {
    version: "00.005.000",
    date: "2026-04-25",
    summary: "하단 푸터에서 현재 배포 버전과 빌드를 더 눈에 띄게 표시해 검토 상태를 바로 확인할 수 있게 했고, 우선순위 P1에 맞춰 관리자에서 발행한 칼럼이 공개 칼럼 페이지와 홈 화면에도 노출되도록 연결했습니다.",
    details: [
      "푸터에 현재 배포 버전 카드형 표시를 추가했습니다.",
      "공개 칼럼 페이지에서 관리자 발행 칼럼도 함께 읽도록 연결했습니다.",
      "홈 화면 칼럼 섹션도 관리자 발행 칼럼을 우선 반영하도록 바꿨습니다.",
    ],
    context: "사용자가 커밋, 푸시, 배포 반영 여부를 시각적으로 확인하고 싶어 했고, 동시에 우선순위상 가장 먼저 필요한 관리자 발행물-공개 페이지 연결을 실제 동작으로 붙일 필요가 있었습니다.",
  },
  {
    version: "00.004.000",
    date: "2026-04-25",
    summary: "관리자 페이지에 KMS와 버전 기록 탭을 신설하고, 운영 문서와 같은 규칙을 관리자 화면에서도 바로 확인할 수 있게 정리했습니다. 특히 KMS 수정 시 변경 결과뿐 아니라 수정 계기와 배경을 함께 기록하는 원칙을 화면 구조에 반영했습니다.",
    details: [
      "시스템 탭에 `버전 기록`과 `KMS`를 추가했습니다.",
      "버전 기록은 핵심 수정사항과 세부 업데이트 내역을 분리해 읽기 쉽게 정리했습니다.",
      "KMS에는 개발 규칙, 우선순위, 버전 원칙, 기록 방식, 현재 운영 메모를 넣었습니다.",
    ],
    context: "여러 AI가 함께 작업하는 구조가 되면서, 관리자 페이지에서도 현재 규칙과 변경 맥락을 즉시 확인할 수 있어야 할 필요가 커졌습니다.",
  },
  {
    version: "00.003.001",
    date: "2026-04-25",
    summary: "메인 홈에 왕사남 강연 일정을 노출하고, 로그인 상태 유지·로그아웃·마이페이지 기본 기능을 추가해 사용자 계정 흐름을 정리했습니다.",
    details: [
      "홈에 왕사남 강연 일정 섹션을 추가했습니다.",
      "로그인 상태를 로컬에 저장하고 로그아웃 버튼을 구현했습니다.",
      "마이페이지를 추가해 계정 상태와 예정 프로그램을 확인할 수 있게 했습니다.",
    ],
    context: "사용자가 홈에서 바로 강연 일정을 보고, 로그인 후 본인 상태를 확인할 수 있는 최소 계정 흐름이 필요했습니다.",
  },
];

// === Design System View — 실제 컴포넌트/토큰을 렌더해 보는 라이브 도파 =====
// 각 카드: 용어 정의 + 시각 샘플 + 특징 + 활용처. KMS '디자인' 탭에서 노출.
// 라이브 토큰 카드 — var(--token) 으로 직접 채워 다크 모드에서도 정합.
// computed value 를 mount 시 + 테마 전환 시 다시 읽어 hex 컬럼을 갱신.
const LiveColorCards = ({ tokens }) => {
  const [computed, setComputed] = React.useState({});
  React.useEffect(() => {
    const read = () => {
      try {
        const root = getComputedStyle(document.documentElement);
        const next = {};
        for (const t of tokens) next[t.token] = root.getPropertyValue(t.token).trim();
        setComputed(next);
      } catch {}
    };
    read();
    const onTheme = () => read();
    window.addEventListener('bgnj-theme-change', onTheme);
    return () => window.removeEventListener('bgnj-theme-change', onTheme);
  }, [tokens]);
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:12}}>
      {tokens.map((c) => {
        const live = computed[c.token] || '';
        const driftFromDesign = live && c.hex && live.toUpperCase() !== c.hex.toUpperCase();
        return (
          <div key={c.token} style={{border:'1px solid var(--line)', overflow:'hidden', background:'var(--bg-2)'}}>
            <div style={{height:60, background:`var(${c.token})`, borderBottom:'1px solid var(--line)'}}/>
            <div style={{padding:'10px 12px'}}>
              <div className="mono gold" style={{fontSize:11, letterSpacing:'0.1em'}}>{c.token}</div>
              <div className="mono dim-2" style={{fontSize:10, marginTop:2}}>
                {live || c.hex}
                {driftFromDesign && (
                  <span style={{marginLeft:6, color:'var(--secondary)'}} title={`디자인값: ${c.hex}`}>· 라이브</span>
                )}
              </div>
              <div style={{fontSize:12, marginTop:6, lineHeight:1.5, color:'var(--ink)'}}>{c.usage}</div>
              <div className="dim-2" style={{fontSize:11, marginTop:4, lineHeight:1.5}}>{c.notes}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DesignSystemView = () => {
  // 토큰 정의표 — 컬러
  const COLOR_TOKENS = [
    // === Primary (5% — KEY ACCENT) ===
    { token: '--primary',         hex: '#F5D548', usage: 'CTA · 활성 · focus · 로고', notes: 'KEY ACCENT — 5% 영역에만. 로고 옐로우.' },
    { token: '--primary-hover',   hex: '#E5BF2E', usage: 'CTA hover', notes: 'Honey Amber — primary 한 단 깊음.' },
    { token: '--primary-active',  hex: '#C99E1A', usage: 'CTA active · focus ring', notes: 'Deep Amber — 누름·focus 상태.' },
    { token: '--primary-dim',     hex: '#FDE68A', usage: '미세 강조 배경/보더', notes: '옅은 옐로우 — 1-tier soft accent.' },
    { token: '--on-primary',      hex: '#0F172A', usage: 'primary 위 텍스트', notes: '옐로우 배경 위 다크 잉크 (WCAG AA).' },
    // === Secondary (15-25% — 보조 강조) ===
    { token: '--secondary',       hex: '#92400E', usage: '링크 · 본문 강조 · 서브 버튼', notes: 'Caramel Ink — 옐로우와 시각적으로 어우러지면서도 본문 가독성 유지.' },
    { token: '--secondary-hover', hex: '#7C2D12', usage: '링크 hover', notes: 'secondary 한 단 깊음.' },
    // === Tertiary (보조 위계) ===
    { token: '--tertiary',        hex: '#475569', usage: '부차 강조 · 그래픽', notes: 'Slate 600 — 더 차분한 회색 강조.' },
    // === Neutral (70-80% — 베이스) ===
    { token: '--bg',              hex: '#FFFFFF', usage: '페이지 베이스 (가장 큰 면적)', notes: '순백 — 카드를 띄우는 캔버스.' },
    { token: '--bg-2',            hex: '#F8FAFC', usage: '서브 배경 · 카드 · 표 헤더', notes: 'Slate 50 — 본문보다 한 단 낮은 그레이.' },
    { token: '--bg-3',            hex: '#F1F5F9', usage: '코드/입력 배경 · placeholder', notes: 'Slate 100 — 입력/코드 영역.' },
    { token: '--line',            hex: '#E5E7EB', usage: '기본 라인 · divider', notes: '뉴트럴 라인.' },
    { token: '--line-2',          hex: '#D1D5DB', usage: '강조 테두리', notes: 'line 한 단 진함.' },
    // === Text (위계 3단) ===
    { token: '--ink',             hex: '#0F172A', usage: '제목 · 1차 본문', notes: '거의 검정 — 가장 진한 잉크.' },
    { token: '--ink-2',           hex: '#334155', usage: '본문 · 설명문', notes: 'Slate 700 — 1차보다 한 단 흐림.' },
    { token: '--ink-3',           hex: '#64748B', usage: '메타 · 라벨 · placeholder', notes: 'Slate 500 — 가장 흐림. dim-2 자주 사용.' },
    // === System Colors (상태) ===
    { token: '--success',         hex: '#16A34A', usage: '성공 · 확정 · 완료', notes: 'Green — 긍정 신호.' },
    { token: '--warning',         hex: '#D97706', usage: '주의 · 보류', notes: 'Amber 600 — primary 와 명도로 구분.' },
    { token: '--info',            hex: '#2563EB', usage: '정보 · 안내', notes: 'Blue — 안내 메시지.' },
    { token: '--danger',          hex: '#DC2626', usage: '에러 · 삭제 · 거부', notes: '단일 빨강 — primary 와 명확히 구분.' },
  ];

  // 폰트 패밀리 정의 — styles.css 의 실제 --font-* 토큰과 1:1 매핑.
  // KBL Jump 4종 + Wanted Sans + ChosunIlboMyungjo + IBM Plex Mono. 명조(나눔/조선일보) 는 토글에서만.
  const FONT_TOKENS = [
    { token: 'var(--font-display)', family: 'KBL Jump Extended', sample: '뱅기노자', size: 30, weight: 900, usage: 'h1 · 히어로 헤드라인 · 브랜드 워드마크', char: 'KBL 점프 ExtraBold Extended — 와이드 · 시그니처 제목' },
    { token: 'var(--font-title)', family: 'KBL Jump', sample: '뱅기 타고 한국을 느끼다', size: 22, weight: 700, usage: 'h2~h4 · 카드 타이틀 · 모달 헤더 · `.ko-serif`', char: 'KBL 점프 Bold — 일반 제목 · 안정 가독성' },
    { token: 'var(--font-sans) / var(--font-reading)', family: 'Wanted Sans Variable', sample: '어제 창덕궁 후원 야간 답사를 다녀왔습니다.', size: 15, weight: 500, usage: 'UI 본문 · 카드 설명 · 댓글 · 폼 · 일반 본문 (기본)', char: 'Wanted Sans — 본 사이트 기본 본문 글꼴' },
    { token: '.post-content (게시글 본문)', family: 'ChosunIlboMyungjo', sample: '한국의 역사·문화·자연을 함께 여행하는 커뮤니티.', size: 15, weight: 400, usage: '커뮤니티/칼럼 본문 — 긴 글 가독성 + 무드', char: '조선일보 명조체 — 긴 본문 전용 세리프' },
    { token: '.app.reading-myungjo (토글)', family: 'ChosunIlboMyungjo', sample: '명조 토글 ON 시 본문 영역 전환', size: 15, weight: 400, usage: '헤더 명조 토글 켰을 때 main 영역 전체', char: '사용자 옵션 · 기본 비활성' },
    { token: 'var(--font-mono)', family: 'IBM Plex Mono', sample: 'BANGINOJA · 2026.05.06 · v00.203', size: 11, weight: 400, usage: '메타 · ID · 시각 · 코드 · eyebrow 라벨', char: 'letter-spacing 0.18em — 구조 신호' },
  ];

  // 스페이싱 스케일
  const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 60, 80];

  // 라운드/엘리베이션 정의 — styles.css 의 실제 값 기준.
  // 카드/표/모달은 직각, 인터랙션 요소(버튼/필드)만 미세 라운드, 칩/배지만 캡슐.
  const RADIUS = [
    { name: '0', value: '0px', usage: '카드 / 표 / 모달 / 인포 박스 — 기본 (편집 디자인 무드)' },
    { name: '4', value: '4px', usage: '필드 입력 (`.field-input`) · 토스트 — 미세 라운드' },
    { name: '6', value: '6px', usage: '소형 버튼 (`.btn-small`)' },
    { name: '8', value: '8px', usage: '기본 버튼 (`.btn`) · 카드 내부 액션 박스' },
    { name: '999', value: '999px', usage: '필터 칩 · 태그 칩 (`.tag-chip`) · 배지 캡슐' },
  ];
  const SHADOW = [
    { name: 'none', value: 'none', usage: '기본 — 그림자는 거의 없음 (선과 색으로 위계)' },
    { name: 'modal', value: '0 16px 40px rgba(0,0,0,0.25)', usage: '모달 컨테이너 (LegalModal/SuspendDialog/PostViewerModal)' },
    { name: 'modal-bg', value: 'rgba(0,0,0,0.55) backdrop', usage: '모달 백드롭 — 본문보다 어둡게, fixed inset 0' },
    { name: 'toast', value: '0 8px 24px rgba(0,0,0,0.14)', usage: '우하단 GlobalErrorToast' },
  ];

  return (
    <div style={{display:'grid', gap:24}}>
      {/* 헤더 */}
      <div className="card card-gold" style={{padding:24}}>
        <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:8}}>DESIGN SYSTEM · 라이브 도파</div>
        <h2 className="ko-serif" style={{fontSize:26, marginBottom:10}}>뱅기노자 디자인 시스템</h2>
        <p className="dim" style={{fontSize:14, lineHeight:1.8, margin:0}}>
          새 페이지를 만들거나 기존 화면을 다듬을 때 <strong className="gold">이 탭의 토큰과 컴포넌트를 그대로 재사용</strong>합니다.
          편집 디자인의 무드(순백 베이스 + Sunny Gold 옐로우 강조 + Caramel Ink 포인트) 안에서 정보가 또렷하게 정렬되도록 만듭니다.
        </p>
      </div>

      {/* 1. 컬러 토큰 */}
      <DSSection
        eyebrow="01 · COLOR"
        title="컬러 토큰"
        definition="화면 전반에서 반복되는 색을 의미 단위로 묶은 변수. 직접 hex 를 적지 않고 항상 `var(--token)` 으로 참조한다."
        characteristics={[
          '역할 기반 — 같은 색이라도 의미가 다르면 토큰을 분리.',
          '명도 단계 — bg/bg-2, ink/ink-2/ink-3, line/line-2 처럼 한 토큰군 안에서 단계.',
          '토큰명 의미 — gold 는 로고 옐로우(#F5D548)에 맞춘 Sunny Gold 시그니처.',
        ]}
        usage={[
          'CSS: `color: var(--ink-2)`, `background: var(--bg-2)`',
          '인라인 style: `style={{ color: \'var(--gold)\' }}`',
          '클래스: `.gold` `.dim` `.dim-2` `.danger` 등 미리 정의된 유틸 클래스',
        ]}
      >
        <LiveColorCards tokens={COLOR_TOKENS}/>
      </DSSection>

      {/* 2. 타이포그래피 */}
      <DSSection
        eyebrow="02 · TYPOGRAPHY"
        title="타이포그래피 시스템"
        definition="실제 styles.css 가 로드하는 폰트는 KBL Jump 4종 + Wanted Sans + ChosunIlboMyungjo + IBM Plex Mono. 제목은 KBL, 본문은 Wanted, 게시글 본문은 조선일보 명조."
        characteristics={[
          '대제목(h1·히어로) — `var(--font-display)` = KBL Jump Extended.',
          '소제목(h2~h4·카드·`.ko-serif`) — `var(--font-title)` = KBL Jump.',
          '본문(UI·댓글·폼·일반) — `var(--font-sans)` / `var(--font-reading)` = Wanted Sans Variable.',
          '게시글/칼럼 본문 — `.post-content` 안에서 ChosunIlboMyungjo (긴 글 무드).',
          '메타·ID·시각·코드 — `var(--font-mono)` = IBM Plex Mono · letter-spacing 0.18em.',
          '명조 토글(`.app.reading-myungjo`) 은 사용자 옵션 — main 영역만 ChosunIlboMyungjo 로 전환, nav/footer 미영향.',
          '주의: `.ko-serif` 클래스명은 레거시 alias — 실제 패밀리는 KBL Jump (세리프 아님).',
        ]}
        usage={[
          '클래스: `.ko-serif` (h2~h4 KBL Jump), `.mono` (IBM Plex Mono), `.dim` `.dim-2` (위계)',
          '인라인 style 사이즈 단위: 11/12/13/14/15/18/22/24/26/30',
          '제목 weight: display 900 / title 700. 본문 weight: 500 (Wanted Sans).',
        ]}
      >
        <div style={{display:'grid', gap:10}}>
          {FONT_TOKENS.map((f) => (
            <div key={f.token} style={{display:'grid', gridTemplateColumns:'200px 1fr 200px', gap:14, padding:'12px 14px', border:'1px solid var(--line)', alignItems:'center'}}>
              <div>
                <div className="mono gold" style={{fontSize:10, letterSpacing:'0.14em', marginBottom:4}}>{f.token}</div>
                <div className="mono dim-2" style={{fontSize:10}}>{f.family}</div>
                <div className="mono dim-2" style={{fontSize:10}}>{f.size}px · w{f.weight}</div>
              </div>
              <div style={{
                fontFamily: f.token.startsWith('var(') ? f.token : `'${f.family}', serif`,
                fontSize: f.size, fontWeight: f.weight, lineHeight: 1.5, color: 'var(--ink)',
                letterSpacing: f.token.includes('mono') ? '0.18em' : 'normal',
              }}>
                {f.sample}
              </div>
              <div style={{fontSize:11, lineHeight:1.6, color:'var(--ink-2)'}}>
                <div style={{fontWeight:500, marginBottom:2}}>{f.usage}</div>
                <div className="dim-2">{f.char}</div>
              </div>
            </div>
          ))}
        </div>
      </DSSection>

      {/* 3. 스페이싱 / 라운드 / 엘리베이션 */}
      <DSSection
        eyebrow="03 · SPACING & RADIUS"
        title="여백 · 모서리 · 그림자"
        definition="간격은 4의 배수 스케일. 모서리는 0(직각)이 기본, 캡슐(999)은 칩 전용. 그림자는 모달/토스트 외에 거의 사용 안 함."
        characteristics={[
          '4·8·12·16·20·24·32·40·60·80 — 디자인 여백은 이 중에서만 선택.',
          '카드 padding 은 18~24, 표 셀 padding 은 10~14.',
          '직각 베이스 — 라운드 박스는 디자인 일관성을 깨뜨릴 수 있음.',
          '그림자는 모달/토스트 외에 사용하지 않음. 깊이는 선과 배경 명도로 표현.',
        ]}
        usage={[
          '`gap: 12` 또는 `padding: 16 24` 같은 형태로 사용.',
          '카드: `padding: 24` 표준. 좁은 인포 박스: `10–14`.',
          '필터 칩만 `borderRadius: 999`.',
        ]}
      >
        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em', marginBottom:8}}>SPACING SCALE (px)</div>
        <div style={{display:'flex', alignItems:'flex-end', gap:6, marginBottom:18}}>
          {SPACING.map((px) => (
            <div key={px} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
              <div style={{width:px, height:px, background:'var(--gold)'}}/>
              <div className="mono dim-2" style={{fontSize:10}}>{px}</div>
            </div>
          ))}
        </div>
        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em', marginBottom:8}}>RADIUS</div>
        <div style={{display:'flex', gap:14, marginBottom:18, flexWrap:'wrap'}}>
          {RADIUS.map((r) => (
            <div key={r.name} style={{
              padding:'10px 14px', border:'1px solid var(--line)', borderRadius: r.value,
              background:'var(--bg-2)', minWidth:160,
            }}>
              <div className="mono gold" style={{fontSize:10}}>{r.value}</div>
              <div style={{fontSize:11, marginTop:4, lineHeight:1.5, color:'var(--ink-2)'}}>{r.usage}</div>
            </div>
          ))}
        </div>
        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em', marginBottom:8}}>SHADOW</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:12}}>
          {SHADOW.map((s) => (
            <div key={s.name} style={{padding:'14px 16px', background:'var(--bg)', boxShadow: s.value, border:'1px solid var(--line)'}}>
              <div className="mono gold" style={{fontSize:10}}>{s.name}</div>
              <div className="mono dim-2" style={{fontSize:10, marginTop:2, wordBreak:'break-all'}}>{s.value}</div>
              <div style={{fontSize:11, marginTop:4, color:'var(--ink-2)'}}>{s.usage}</div>
            </div>
          ))}
        </div>
      </DSSection>

      {/* 4. 버튼 */}
      <DSSection
        eyebrow="04 · BUTTONS"
        title="버튼 5종"
        definition="모든 인터랙션 버튼은 5종 중 하나. 커스텀 인라인 색은 위험 표기에만 한정한다."
        characteristics={[
          'btn — 기본 (테두리 + 본문 색)',
          'btn btn-gold — 핵심 액션 (저장/등록/입장)',
          'btn btn-small — 소형 (표 안 / 인라인 액션)',
          'btn btn-block — 가로 100% (폼 제출)',
          'btn-ghost — 배경 없는 텍스트 버튼 (보조)',
        ]}
        usage={[
          '폼 1차 제출은 `btn btn-gold`. 보조는 `btn`.',
          '표 행 끝의 액션은 `btn btn-small` 만 사용.',
          '삭제/정지/위험은 `btn` + `style={{borderColor:\'var(--danger)\', color:\'var(--danger)\'}}`.',
        ]}
      >
        <div style={{display:'flex', gap:10, flexWrap:'wrap', alignItems:'center'}}>
          <button type="button" className="btn">btn</button>
          <button type="button" className="btn btn-gold">btn-gold</button>
          <button type="button" className="btn btn-small">btn-small</button>
          <button type="button" className="btn btn-small btn-gold">small + gold</button>
          <button type="button" className="btn-ghost" style={{color:'var(--gold)'}}>btn-ghost</button>
          <button type="button" className="btn btn-small" style={{borderColor:'var(--danger)', color:'var(--danger)'}}>위험</button>
          <button type="button" className="btn btn-gold" disabled aria-busy="true">로딩 중...</button>
        </div>
      </DSSection>

      {/* 5. 배지 / 칩 */}
      <DSSection
        eyebrow="05 · BADGES & CHIPS"
        title="배지 · 태그 칩"
        definition="짧은 라벨로 상태나 분류를 표시. 둥근 캡슐(필터 칩) vs 직각 박스(상태 배지) 두 패턴."
        characteristics={[
          '배지(.badge) — 직각, 작은 텍스트, 등급/카테고리.',
          '골드 배지(.badge.badge-gold) — 카테고리/등급 강조 (`.badge` 와 함께 사용).',
          '태그 칩(.tag-chip) — 해시태그/말머리.',
          '필터 칩 — 현재 inline style 로만 구현 (전용 클래스 미정). borderRadius:999 + 활성=골드 배경 / 비활성=라인.',
        ]}
        usage={[
          '게시글 카테고리/HOT/관리자 등급 → `.badge`',
          '해시태그 표시 → `.tag-chip`',
          '관리자 상태 필터 (전체/활성/정지) → 필터 칩',
        ]}
      >
        <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center'}}>
          <span className="badge">기본 BADGE</span>
          <span className="badge badge-gold">관리자</span>
          <span className="badge" style={{borderColor:'var(--danger)', color:'var(--danger)'}}>정지됨</span>
          <span className="tag-chip">#궁궐</span>
          <span className="tag-chip">#답사</span>
          <span style={{
            padding:'6px 14px', fontSize:12, borderRadius:999,
            background:'var(--gold)', color:'var(--bg)',
            fontFamily:'var(--font-serif)',
          }}>전체</span>
          <span style={{
            padding:'6px 14px', fontSize:12, borderRadius:999,
            border:'1px solid var(--line-2)', color:'var(--ink-2)',
            fontFamily:'var(--font-serif)',
          }}>비활성 칩</span>
        </div>
      </DSSection>

      {/* 6. 폼 / 입력 */}
      <DSSection
        eyebrow="06 · FORMS"
        title="입력 필드 · 라벨"
        definition={'모든 폼은 `<div className="field">` 래퍼 안에 `.field-label` + `.field-input` 두 자식으로 구성. input/textarea/select 모두 동일 외형 — `.field-input` 한 클래스로 통일.'}
        characteristics={[
          '래퍼 `.field` — 세로 8px 간격 자동.',
          '라벨 `.field-label` — 작은 회색 한글, 입력 위.',
          '입력 `.field-input` — input/textarea/select 공통 (변수 아닌 클래스).',
          '필수 표시는 골드 별표(★) — 라벨 옆에 `<span className="gold">★</span>`.',
          '필드 폭은 폼 컨테이너에 따라 자동, 짧은 입력만 maxWidth 명시.',
          '에러 메시지는 폼 안 인라인 박스 (alert 사용 금지).',
        ]}
        usage={[
          '표준 패턴: `<div className="field"><label className="field-label">…</label><input className="field-input"/></div>`',
          '체크박스/라디오는 `.field` 래퍼 + 인라인 `<label>` 조합 (별도 클래스 없음).',
          '폼 제출 후 결과는 인라인 박스(성공: 골드 / 실패: 빨강).',
        ]}
      >
        <div style={{display:'grid', gap:14, maxWidth:560}}>
          <div className="field" style={{margin:0}}>
            <label className="field-label">이름 <span className="gold">★</span></label>
            <input className="field-input" placeholder="실명을 입력해주세요" defaultValue="박지민" readOnly/>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label">관심 분야</label>
            <select className="field-input" defaultValue="palace">
              <option value="palace">궁궐 답사</option>
              <option value="history">조선 역사</option>
            </select>
          </div>
          <div className="field" style={{margin:0}}>
            <label className="field-label">메모 (선택)</label>
            <textarea className="field-input" rows={2} defaultValue="입금자명에 신청자 본명을 남겨 주세요." readOnly/>
          </div>
          <div role="alert" style={{
            padding:'12px 16px', background:'rgba(194,74,61,0.06)',
            border:'1px solid var(--danger)', color:'var(--danger)', fontSize:13,
          }}>
            <span className="mono" style={{fontSize:11, letterSpacing:'0.18em', marginRight:8}}>HTTP 401</span>
            이메일 또는 비밀번호가 올바르지 않습니다.
          </div>
        </div>
      </DSSection>

      {/* 7. 카드 */}
      <DSSection
        eyebrow="07 · CARDS"
        title="카드 컨테이너"
        definition="화면의 모든 정보 블록은 카드(.card)에 들어간다. 강조용은 .card-gold. 인포 박스는 별도 패턴."
        characteristics={[
          '`.card` — 흰 배경 + 얇은 테두리 + padding 24.',
          '`.card-gold` — 옅은 옐로우 그라데이션 배경 + 골드 dim 테두리. 강조용.',
          '인포 박스(좌측 골드 라인) — 안내문 전용 패턴.',
          '카드 헤더는 `mono gold` 라벨 + ko-serif 제목.',
        ]}
        usage={[
          '회원 상세, 관리자 폼, KMS 섹션 모두 카드 안에.',
          '강조하고 싶은 카드(요약/공지)는 card-gold.',
        ]}
      >
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:14}}>
          <article className="card" style={{padding:20}}>
            <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>STANDARD CARD</div>
            <h3 className="ko-serif" style={{fontSize:18, marginBottom:8}}>기본 카드</h3>
            <p className="dim" style={{fontSize:12, lineHeight:1.7, margin:0}}>흰 배경 · 얇은 테두리. 일반 정보 블록.</p>
          </article>
          <article className="card card-gold" style={{padding:20}}>
            <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:8}}>EMPHASIS CARD</div>
            <h3 className="ko-serif" style={{fontSize:18, marginBottom:8}}>강조 카드</h3>
            <p className="dim" style={{fontSize:12, lineHeight:1.7, margin:0}}>옅은 옐로우 그라데이션 배경 · 골드 dim 테두리. 요약/공지/버전 카드.</p>
          </article>
          <article style={{padding:'14px 16px', background:'var(--bg-2)', borderLeft:'3px solid var(--gold-dim)'}}>
            <p className="dim" style={{fontSize:12, lineHeight:1.7, margin:0}}>
              ⓘ <strong className="gold">인포 박스</strong> — 좌측 3px 골드 라인 + 회색 배경. 안내문/팁/주의사항.
            </p>
          </article>
        </div>
      </DSSection>

      {/* 8. 표 */}
      <DSSection
        eyebrow="08 · TABLES"
        title="데이터 표"
        definition="여러 행 데이터의 표준 노출 방식. 표 위 3단 메타(eyebrow / title / action) → 표 본체. 카드 그리드보다 표가 정렬·비교에 더 적합한 경우 우선."
        characteristics={[
          '표 위 메타 영역(권장): mono eyebrow 라벨 + ko-serif 제목 + 우측 action(검색/필터/추가). flex space-between 정렬.',
          '표 헤더(thead): bg-2 배경 + mono dim-2 + letter-spacing 0.2em + uppercase 영문 컬럼명.',
          '행 구분: borderTop 1px solid var(--line) — 줄무늬 없음.',
          '셀 padding: 10–14px. 이름은 ko-serif, 메타/시각은 mono dim-2.',
          '액션 컬럼은 우측 정렬, `.btn.btn-small` 만 사용.',
        ]}
        usage={[
          'ROPA, 회원 목록, 입금 계좌, 책 주문, 오류 로그.',
          '컬럼 5개 미만이면 카드 그리드도 검토 가능.',
        ]}
      >
        {/* 표 위 3단 메타 — eyebrow / title / action */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:10, gap:14, flexWrap:'wrap'}}>
          <div>
            <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:4}}>MEMBERS · 활성 · 124명</div>
            <h3 className="ko-serif" style={{fontSize:18, margin:0}}>회원 목록</h3>
          </div>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input className="field-input" placeholder="이름/이메일 검색" style={{maxWidth:200, padding:'6px 10px', fontSize:12}} readOnly/>
            <button type="button" className="btn btn-small">필터</button>
          </div>
        </div>
        <div style={{overflowX:'auto', border:'1px solid var(--line)'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
            <thead>
              <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
                <th style={{padding:'10px 14px', textAlign:'left'}}>이름</th>
                <th style={{padding:'10px 14px', textAlign:'left'}}>등급</th>
                <th style={{padding:'10px 14px', textAlign:'left'}}>가입일</th>
                <th style={{padding:'10px 14px', textAlign:'right'}}>액션</th>
              </tr>
            </thead>
            <tbody>
              {[['박지민', '관리자', '2026.04.28'], ['돌담아래', '독자', '2026.03.18']].map(([n, g, d]) => (
                <tr key={n} style={{borderTop:'1px solid var(--line)'}}>
                  <td className="ko-serif" style={{padding:'10px 14px'}}>{n}</td>
                  <td style={{padding:'10px 14px'}}><span className="badge">{g}</span></td>
                  <td className="mono dim-2" style={{padding:'10px 14px'}}>{d}</td>
                  <td style={{padding:'10px 14px', textAlign:'right'}}>
                    <button type="button" className="btn btn-small">상세</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DSSection>

      {/* 9. 모달 */}
      <DSSection
        eyebrow="09 · MODALS"
        title="모달 다이얼로그"
        definition="window.alert/prompt 대신 항상 모달. 어두운 반투명 배경 + 중앙 정렬 + Esc/바깥 클릭/닫기 모두 동작."
        characteristics={[
          '배경 rgba(0,0,0,0.55) — 본문보다 어둡게.',
          '본문 max-width 480~860, max-height 80vh.',
          '닫기 액션 3가지: ESC / 바깥 클릭 / 우상단 닫기 버튼.',
          '제목은 ko-serif, 본문은 var(--font-sans).',
        ]}
        usage={[
          'LegalModal — 약관/개인정보 본문',
          'SuspendDialog — 회원 정지 사유 입력',
          'PostViewerModal — 관리자 게시글 본문/댓글 조회',
        ]}
      >
        {/* 백드롭(rgba 0,0,0,0.55) 위에 모달 컨테이너가 떠 있는 모습을 시뮬레이션 */}
        <div style={{
          position:'relative', padding:32, background:'rgba(0,0,0,0.55)',
          border:'1px dashed var(--line-2)',
        }}>
          <div className="mono dim-2" style={{position:'absolute', top:8, left:12, fontSize:9, letterSpacing:'0.18em', color:'rgba(255,255,255,0.7)'}}>BACKDROP · rgba(0,0,0,0.55)</div>
          <div style={{
            padding:'24px 28px', background:'var(--bg)',
            maxWidth:560, margin:'0 auto', border:'1px solid var(--line)',
            boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
              <h3 className="ko-serif" style={{fontSize:20, margin:0}}>모달 제목</h3>
              <button type="button" className="btn btn-small">닫기</button>
            </div>
            <p className="dim" style={{fontSize:13, lineHeight:1.7, marginBottom:16}}>
              모달은 결정이 필요한 순간에만 띄웁니다. 본문에 폼이 들어갈 수 있고, 우하단 액션은 우선순위에 따라 정렬합니다.
            </p>
            <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
              <button type="button" className="btn">취소</button>
              <button type="button" className="btn btn-gold">확인</button>
            </div>
          </div>
        </div>
      </DSSection>

      {/* 10. 피드백 */}
      <DSSection
        eyebrow="10 · FEEDBACK"
        title="에러 · 성공 · 토스트"
        definition="작업 결과는 인라인(폼 안) 또는 우하단 토스트(전역) 중 하나로만 노출. alert() 는 사용 금지."
        characteristics={[
          '인라인 에러 — 폼 안 빨강 박스 + 코드 + 사유 + 가이드.',
          '인라인 성공 — 폼 안 골드 박스 + ✓ 메시지.',
          '전역 토스트 — 우하단 누적, 10초 자동 소거, 에러 코드 표시.',
          '모든 오류는 D1.error_log 자동 보고 (관리자 패널에서 확인).',
        ]}
        usage={[
          '폼 제출 결과는 인라인.',
          '비동기 미처리 오류는 토스트 + 자동 보고.',
        ]}
      >
        <div style={{display:'grid', gap:10, maxWidth:560}}>
          <div role="alert" style={{
            padding:'12px 16px', background:'rgba(194,74,61,0.06)',
            border:'1px solid var(--danger)', color:'var(--danger)', fontSize:13,
          }}>
            <div className="mono" style={{fontSize:11, letterSpacing:'0.18em', marginBottom:4}}>네트워크 오류 · NETWORK_OR_CORS</div>
            <div style={{fontWeight:500}}>요청 실패</div>
            <div style={{fontSize:12, marginTop:4}}>인터넷 연결 또는 서버 도달이 차단됐습니다.</div>
          </div>
          <div role="status" style={{
            padding:'10px 14px', border:'1px solid var(--gold-dim)',
            background:'rgba(245,213,72,0.06)', color:'var(--gold)', fontSize:13,
          }}>✓ 저장되었습니다.</div>
          <div style={{
            padding:'12px 14px', background:'var(--bg)',
            border:'1px solid var(--danger)', boxShadow:'0 8px 24px rgba(0,0,0,0.14)',
            fontSize:13,
          }}>
            <div className="mono" style={{fontSize:10, letterSpacing:'0.14em', color:'var(--danger)'}}>HTTP_500</div>
            <div style={{fontWeight:500, marginTop:2}}>서버 오류</div>
            <div className="dim-2" style={{fontSize:11, marginTop:4}}>10초 후 자동 사라짐 · 우하단 토스트 패턴</div>
          </div>
        </div>
      </DSSection>

      {/* 11. 원칙 정리 (기존 ADMIN_DESIGN_SECTIONS 재활용) */}
      <DSSection
        eyebrow="11 · PRINCIPLES"
        title="화면 작업 원칙 (체크리스트)"
        definition="새 페이지/컴포넌트를 만들 때 마지막에 한 번 더 확인할 항목."
        characteristics={[]}
        usage={[]}
      >
        <div style={{display:'grid', gap:14}}>
          {ADMIN_DESIGN_SECTIONS.map((section) => (
            <article key={section.title} style={{padding:'14px 18px', border:'1px solid var(--line)', background:'var(--bg)'}}>
              <h4 className="ko-serif" style={{fontSize:15, marginBottom:10, color:'var(--ink)'}}>{section.title}</h4>
              <ul style={{listStyle:'none', padding:0, margin:0, display:'grid', gap:6}}>
                {section.points.map((point) => (
                  <li key={point} style={{fontSize:12, lineHeight:1.7, color:'var(--ink-2)'}}>· {point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </DSSection>

      {/* 12. 의존성 매트릭스 — v00.055 신설. 외부 의존성 현재/최신/액션 한눈에. */}
      <DSSection
        eyebrow="12 · DEPENDENCIES"
        title="외부 의존성 매트릭스"
        definition="사이트가 의존하는 모든 외부 라이브러리와 도구의 현재/최신 버전 + 업데이트 액션. 마지막 검토일은 본 카드 우상단."
        characteristics={[
          'patch (예: 7.29.0 → 7.29.3) — 안전, 자동 업데이트.',
          'minor (2.10 → 2.11) — 일반적으로 안전. release notes 1회 훑고 업데이트.',
          'major (2.x → 3.x, 18 → 19) — 브레이킹 체인지. 별도 사이클로 마이그레이션.',
        ]}
        usage={[
          'CDN 변경 시 SRI hash 재계산: `curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A`',
          '워커 의존성: `cd workers && npm install` 후 `wrangler deploy` (사용자 직접).',
        ]}
      >
        <DependencyMatrix/>
      </DSSection>
    </div>
  );
};

// 의존성 매트릭스 — 현재/최신/위치/위험도 한 표에. 매 사이클 검토일 갱신.
// 최신 버전은 KMS 사이클 마지막 npm registry 조회 시점 기준. 자동 갱신 X (수동 검토).
const DEPENDENCY_MATRIX = [
  // CDN — index.html 직접 참조
  { kind: 'CDN', name: 'react / react-dom (UMD)', current: '18.3.1', latest: '18.3.1 (UMD 라인 끝)', risk: 'lts', location: 'index.html', notes: 'v00.100 분석: React 19 는 UMD 미배포. 마이그레이션은 전 페이지 ESM 재구조화(boot.jsx + 16 페이지 + 워크플로 변경) 가 필요한 다중-사이클 작업 → 보류. 18.3.1 은 LTS 라 보안 패치 지속.' },
  { kind: 'CDN', name: '@tiptap/* (ESM)', current: '3.22.5', latest: '3.22.5', risk: 'patch', location: 'index.html', notes: 'v00.090 메이저 마이그 + v00.105 핫픽스 — StarterKit v3 가 underline/link/dropcursor 기본 포함. text-style/table 은 named import.' },
  // npm — 로컬 도구
  { kind: 'npm', name: 'esbuild', current: '0.28.x', latest: '0.28.x', risk: 'patch', location: 'tools/package.json', notes: 'v00.071 도입 — JSX 사전 컴파일 (tools/build.mjs). 80ms/run. pre-commit hook 자동 실행.' },
  { kind: 'npm', name: '@babel/parser', current: '7.29.3', latest: '7.29.3', risk: 'patch', location: 'tools/package.json', notes: 'pre-commit 훅 신택스 검증. `npm update` 로 자동 갱신.' },
  { kind: 'npm', name: 'wrangler', current: '4.87.0 (선언)', latest: '4.87.0', risk: 'patch', location: 'workers/package.json', notes: 'Cloudflare 워커 CLI. `cd workers && npm install` 후 `wrangler deploy`. 글로벌 설치 시 사용자 권한 필요.' },
  // 외부 BGNJ
  { kind: '폰트', name: 'Wanted Sans / KBL Jump / Noto Serif KR', current: 'CDN', latest: 'CDN', risk: 'auto', location: 'styles.css @import', notes: 'CDN @import — 자동 갱신.' },
  // 인프라 (워커)
  { kind: '인프라', name: 'D1 (banginoja-db)', current: 'production', latest: '—', risk: 'managed', location: 'wrangler.toml', notes: 'tours / lectures / posts / comments / books / book_orders / user_columns / users / 등. v00.081 cover_url + v00.106 subtitle/refund_policy 컬럼 추가.' },
  { kind: '인프라', name: 'R2 (banginoja-media)', current: 'active', latest: '—', risk: 'managed', location: 'wrangler.toml', notes: 'v00.082~v00.106 — admin 9 슬롯 + 사용자 콘텐츠 (게시글 첨부/이미지) + 놀자 items 이미지. /api/media/upload + /api/media/:key.' },
  // 제거된 의존성 (v00.071 esbuild 도입으로 폐기)
  { kind: '폐기', name: '@babel/standalone (v00.070 까지 사용)', current: '제거됨', latest: '—', risk: 'gone', location: 'index.html (v00.071 제거)', notes: 'v00.071 esbuild 사전 컴파일 도입으로 in-browser JSX 컴파일러 제거. 첫 로드 ~3MB 절감.' },
];
const DependencyMatrix = () => {
  const reviewedAt = '2026-05-01';
  return (
    <div>
      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:10}}>
        <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em'}}>마지막 검토 · {reviewedAt}</span>
      </div>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', minWidth:720, borderCollapse:'collapse', fontSize:12}}>
          <thead>
            <tr style={{borderBottom:'1px solid var(--line)', background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.16em', color:'var(--ink-3)'}}>
              <th scope="col" style={{padding:'8px 10px', textAlign:'left'}}>구분</th>
              <th scope="col" style={{padding:'8px 10px', textAlign:'left'}}>이름</th>
              <th scope="col" style={{padding:'8px 10px', textAlign:'left'}}>현재</th>
              <th scope="col" style={{padding:'8px 10px', textAlign:'left'}}>최신</th>
              <th scope="col" style={{padding:'8px 10px', textAlign:'left'}}>위험도</th>
              <th scope="col" style={{padding:'8px 10px', textAlign:'left'}}>위치</th>
              <th scope="col" style={{padding:'8px 10px', textAlign:'left'}}>메모</th>
            </tr>
          </thead>
          <tbody>
            {DEPENDENCY_MATRIX.map((d) => {
              const upToDate = d.current === d.latest;
              const riskColor = d.risk === 'major' ? 'var(--danger)' : d.risk === 'minor' ? 'var(--warning)' : 'var(--success)';
              return (
                <tr key={d.name} style={{borderBottom:'1px solid var(--line)'}}>
                  <td className="mono dim-2" style={{padding:'10px', fontSize:10, letterSpacing:'0.14em'}}>{d.kind}</td>
                  <td className="mono" style={{padding:'10px', fontSize:11, color:'var(--ink)'}}>{d.name}</td>
                  <td className="mono" style={{padding:'10px', fontSize:11}}>{d.current}</td>
                  <td className="mono" style={{padding:'10px', fontSize:11, color: upToDate ? 'var(--success)' : 'var(--secondary)', fontWeight: upToDate ? 500 : 700}}>
                    {d.latest}{!upToDate && ' ⚠'}
                  </td>
                  <td className="mono" style={{padding:'10px', fontSize:10, color: riskColor, letterSpacing:'0.12em'}}>{d.risk.toUpperCase()}</td>
                  <td className="mono dim-2" style={{padding:'10px', fontSize:10}}>{d.location}</td>
                  <td className="dim-2" style={{padding:'10px', fontSize:11, lineHeight:1.5}}>{d.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 디자인 시스템 섹션 래퍼 — 정의/특징/활용처 + 슬롯에 라이브 샘플.
const DSSection = ({ eyebrow, title, definition, characteristics, usage, children }) => (
  <section className="card" style={{padding:24}}>
    <div className="mono gold" style={{fontSize:10, letterSpacing:'0.24em', marginBottom:6}}>{eyebrow}</div>
    <h2 className="ko-serif" style={{fontSize:22, marginBottom:10}}>{title}</h2>
    {definition && (
      <p className="dim" style={{fontSize:13, lineHeight:1.8, marginBottom:18, paddingBottom:14, borderBottom:'1px solid var(--line)'}}>
        <strong className="gold">정의 · </strong>{definition}
      </p>
    )}
    {(characteristics?.length || usage?.length) > 0 && (
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:18}}>
        {characteristics?.length > 0 && (
          <div>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>특징</div>
            <ul style={{listStyle:'none', padding:0, margin:0, display:'grid', gap:6, fontSize:12, lineHeight:1.7, color:'var(--ink-2)'}}>
              {characteristics.map((p) => <li key={p}>· {p}</li>)}
            </ul>
          </div>
        )}
        {usage?.length > 0 && (
          <div>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:8}}>활용처</div>
            <ul style={{listStyle:'none', padding:0, margin:0, display:'grid', gap:6, fontSize:12, lineHeight:1.7, color:'var(--ink-2)'}}>
              {usage.map((p) => <li key={p}>· {p}</li>)}
            </ul>
          </div>
        )}
      </div>
    )}
    <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:10}}>SAMPLE · 라이브 예시</div>
    <div>{children}</div>
  </section>
);

const ADMIN_DESIGN_SECTIONS = [
  {
    title: "브랜드 무드 (현재 라이트 테마)",
    points: [
      "한국의 자연·문화·역사를 직접 걷고 느끼는 여행 커뮤니티의 차분한 인상을 기본으로 합니다.",
      "장식보다 정렬감과 여백, 정보 밀도를 우선합니다.",
      "5:25:70 황금 배색 — Primary 옐로우 5% (CTA·로고·활성), Secondary Caramel Ink 15-25% (링크·강조), Neutral white+slate 70%+ (배경·텍스트). 노란색은 인터랙션 상태에만 등장하는 KEY ACCENT.",
      "v00.026 부터 짙은 먹색 다크 톤 → 라이트 톤으로 전환되었습니다 (편집 디자인 모티프 유지).",
    ],
  },
  {
    title: "편집 디자인 무드 — 'AI-같지 않은' 톤 원칙",
    points: [
      "사이트 전반은 잡지·단행본의 편집 디자인을 모티프로 합니다. AI 생성 사이트 특유의 균질한 그라데이션·과한 곡선·기성 아이콘 라이브러리에 의존한 인상을 회피.",
      "톤은 절제·신뢰·여행자의 시선. 동양풍 장식체나 캘리그래피 헤더, 한지 텍스처, 단풍/궁궐 클립아트 같은 1차원적 한국 표상을 사용하지 않습니다.",
      "헤드라인은 KBL Jump (와이드/볼드) 로 신문 헤드 같은 권위, 본문은 Wanted Sans 의 산세리프 단정함, 게시글 본문은 조선일보 명조의 전통 활자 무드 — 세 글꼴이 위계를 만들어 무드를 구성.",
      "여백은 8/12/16/24/32 4의 배수 리듬으로 행간/단락을 정렬. '왠지 모르게 답답한' 인상은 거의 여백 부족이 원인.",
      "그라데이션은 카드 배경 한정(card-gold 의 옅은 옐로우만), 그림자는 모달/토스트 외 거의 없음 — 선과 색으로만 위계.",
      "이모지/아이콘: 본문 강조에는 ⓘ ✓ ★ 등 식자(글리프) 만 사용. 컬러풀한 이모지 도배 / lucide·material·heroicons 같은 외부 아이콘 라이브러리를 새로 끌어오지 않습니다 (의존성 + 시각 통일성 양쪽 비용).",
      "마이크로 인터랙션은 hover 색 전환 / focus ring 정도로 한정. 풍선 튀어나오기·번쩍 효과·fade-up scroll-reveal 같은 트렌드는 도입하지 않습니다.",
    ],
  },
  {
    title: "컬러 원칙 (실제 토큰)",
    points: [
      "Primary (5% — 키컬러): var(--primary) #F5D548 로고 옐로우. CTA·로고·활성 탭·focus·active toggle 등 인터랙션 상태에만. 호버는 var(--primary-hover) #E5BF2E, 누름은 var(--primary-active) #C99E1A.",
      "Secondary (15-25%): var(--secondary) #92400E Caramel Ink. 링크·본문 강조·서브 버튼. 옐로우와 어우러지면서도 본문 가독성 유지.",
      "Tertiary: var(--tertiary) #475569 Slate 600 — 부차 강조·그래픽 보조.",
      "Neutral (70%+): var(--bg) #FFFFFF / var(--bg-2) #F8FAFC / var(--bg-3) #F1F5F9 (배경 3단). var(--line) #E5E7EB / var(--line-2) #D1D5DB (라인 2단). 모든 면적은 뉴트럴 슬레이트 — 옐로우 라인/배경은 사용하지 않음.",
      "Text (위계 3단): var(--ink) #0F172A 1차 / var(--ink-2) #334155 2차 / var(--ink-3) #64748B 3차. 모두 슬레이트 톤이라 옐로우 액센트와 충돌하지 않음.",
      "System Colors: var(--success) #16A34A · var(--warning) #D97706 · var(--info) #2563EB · var(--danger) #DC2626. 상태 신호 4종 — primary 와 명도/색상으로 명확히 구분.",
      "회원 등급 색상: guest #A8A29E → member #FCD34D → reader #F5D548 → scholar #F59E0B → wangsanam #D97706 → admin #92400E (Sunny Gold 그라데이션 — 등급은 시각적 위계라 5% 룰 예외).",
      "CTA 텍스트: 옐로우 배경(#F5D548) 위에는 var(--on-primary) #0F172A 다크 잉크 사용 (WCAG AA 통과 — 흰 글씨 대비 부족).",
      "5% 룰: 한 화면에서 옐로우 면적이 시각적으로 5%를 넘으면 다른 토큰으로 대체. 라벨/eyebrow/배지는 var(--ink-3) 가 기본.",
      "v00.209 — 레거시 토큰(`--gold` / `--gold-2` / `--gold-dim` / `--gold-ink` / `--cta-rest` / `--cta-hover` / `--cta-active` / `--cta-ink`) 전면 제거 완료. 모든 코드는 `--primary*` / `--on-primary` / `--secondary` 직접 사용. 신규 코드도 동일.",
    ],
  },
  {
    title: "타이포그래피 (실제 사용)",
    points: [
      "대제목 (var(--font-display)): KBL Jump Extended (ExtraBold 900) — h1·히어로·브랜드 워드마크.",
      "소제목 (var(--font-title) · `.ko-serif`): KBL Jump Bold (700) — h2~h4·카드 타이틀·모달 헤더.",
      "본문 (var(--font-sans) / var(--font-reading)): Wanted Sans Variable (500) — UI·댓글·폼·일반 본문 기본 글꼴.",
      "게시글 본문 (.post-content): ChosunIlboMyungjo — 커뮤니티/칼럼의 긴 본문에만 적용 (무드+가독성).",
      "메타·ID·코드 (var(--font-mono)): IBM Plex Mono — 시간/ID/배지/감사 로그/eyebrow 라벨. letter-spacing 0.18em.",
      "명조 토글 (.app.reading-myungjo): 사용자가 헤더 토글 ON 하면 main 영역 본문이 ChosunIlboMyungjo 로 전환. nav/footer 미영향.",
      "기본 본문 사이즈: 13–15px / 행간 1.7–1.85 / 자간 -0.01em. 댓글 weight 500 평문, @멘션만 700 + 골드.",
      "주의: `--font-serif` 토큰명은 레거시 — 실제 1순위는 KBL Jump (세리프 아님). `.ko-serif` 클래스도 동일.",
    ],
  },
  {
    title: "레이아웃 / 컴포넌트 패턴",
    points: [
      "관리자 패널: 좌측 260px 사이드바(7개 그룹) + 본문 스크롤러. 사이드바 그룹: 요약 / 콘텐츠 / 회원관리 / 쇼핑 / 운영설정 / 개인정보 관리 / 시스템 관리.",
      "데이터 표현: '한 화면 안에 정렬되는 표' 우선 (ROPA, 회원, 오류 로그, 계좌). 카드 그리드는 동일 레벨 4개 이상에서만.",
      "모달: 어두운 반투명 배경(rgba 0,0,0,0.55) + 중앙 정렬 + Esc/바깥 클릭/닫기 버튼 모두 동작 (예: SuspendDialog, LegalModal, PostViewerModal).",
      "필드/버튼: `.field-input` (클래스, 변수 아님) / `.btn` / `.btn-gold` / `.btn-small` / `.btn-ghost` 5종이 표준. 폼은 `.field` 래퍼 + `.field-label` + `.field-input` 3단 구조. 커스텀 인라인 스타일은 메타 정보 또는 일회성 강조에만.",
      "오류/성공 피드백: 인라인 박스(폼 안) 또는 우하단 토스트(전역) 둘 중 하나. alert() 는 사용 금지(대화형은 모달).",
      "여백 단위: 8/12/16/24/32 (세로 리듬). 카드 padding 18~24px.",
    ],
  },
  {
    title: "관리자 GUI 원칙",
    points: [
      "텍스트로 구현된 운영 기능은 두지 않습니다 — JSON 덤프는 라벨 카드(ProfileFields)·키/값 칩(AuditDetailsCell) 으로, prompt() 는 모달/인라인 폼으로 교체.",
      "관리자 화면의 모든 라벨은 한글 우선(개인정보 처리방침/이용약관/정지/삭제 등). 영문 코드는 메타에만.",
      "표는 정렬 가능한 컬럼만 있으면 헤더에 정렬 셀렉터를 둡니다 (회원 목록 8가지 정렬).",
      "필터는 '검색 + 셀렉터 1~2개 + 정렬 + 카운트' 조합을 기본으로 합니다.",
    ],
  },
  {
    title: "디자인 금지 원칙",
    points: [
      "보라색 계열을 브랜드 주색처럼 사용하지 않습니다.",
      "이전 다크 먹색 테마로 회귀하지 않습니다 (v00.026 이후 라이트 톤이 표준).",
      "과한 그라데이션·유행형 마이크로 인터랙션·귀여운 이모지 아이콘으로 분위기를 흩뜨리지 않습니다.",
      "원칙: 모든 대화 흐름은 모달 컴포넌트로 처리. alert() 는 코드에서 사용 금지 — 인라인 박스(폼 안) 또는 우하단 토스트(`window.BGNJ_TOAST.error/success/info`) 사용. v00.207 에서 기존 73건 일괄 교체 완료.",
      "단발 확인(정지·삭제 등) 은 `window.BGNJ_CONFIRM(message, { danger: true, confirmLabel: '삭제' })` Promise API 사용. ConfirmDialogHost 가 boot.jsx 에 단일 인스턴스 마운트. `window.confirm()` 사용 금지 — v00.208 (47건) + v00.210 (잔여 25건) 일괄 교체 완료.",
      "관리자 화면에 raw JSON / 영문-only 텍스트를 사용자에게 노출하지 않습니다.",
    ],
  },
];

// === KMS 기능정의서: 5가지 미션 + 공통 기반 ===
// 사이트가 존재하는 이유:
//   1) 뱅기노자 커뮤니티 운영
//   2) 뱅기노자 강연 일정 안내
//   3) 뱅기노자 칼럼 공유
//   4) 뱅기노자 투어 프로그램 판매·운영
//   5) 뱅기노자 책 판매
// v00.198 — 사용자 요청 '기능정의서 항목들 최신기준 업데이트'.
// MISSION_OVERVIEW: 5개 미션 모두 D1 + 워커로 풀 마이그레이션 후 '프로덕션 운영' 단계.
const MISSION_OVERVIEW = [
  {
    id: "community",
    number: "01",
    title: "뱅기노자 커뮤니티",
    short: "회원이 글·댓글·후기를 나누는 핵심 참여 공간.",
    state: "프로덕션 운영",
    coverage: "기능 ~95%",
    verdict: "Tiptap 본문 + 좋아요·북마크·신고·댓글 알림·등급 배지·페이지네이션·게시판별 권한(읽기/쓰기 4종)·드래그앤드롭 게시판 정렬·일괄 이동/삭제까지 D1 + 워커로 운영. 남은 큰 항목은 답글 트리·멘션·해시태그·차단 정책.",
  },
  {
    id: "lecture",
    number: "02",
    title: "뱅기노자 강연 일정 안내",
    short: "공개·심화·현장 강연을 알리고 신청·입금까지 운영.",
    state: "프로덕션 운영",
    coverage: "기능 ~85%",
    verdict: "신청 → 무통장 입금 → 관리자 입금 확인 → 참가 확정 + 정원·대기열 자동 승격 + 후기 + .ics + R2 커버 + 다중 계좌 + 강연 페이지 에디터까지 D1 운영. 남은 큰 항목은 PG 결제·D-1 자동 알림·체크인.",
  },
  {
    id: "column",
    number: "03",
    title: "뱅기노자 칼럼 공유",
    short: "정기 칼럼 발행과 공개 노출.",
    state: "프로덕션 운영",
    coverage: "기능 ~85%",
    verdict: "임시저장(7일·10건) + 예약 발행 + 즉시 발행 + 발행 취소 + 동적 카테고리 + 좋아요/조회수 D1 + 댓글 + 추정 읽기 시간 + URL 해시 딥 링크까지 닫혔다. 남은 큰 항목은 RSS·이메일 구독·작성자 프로필·북마크·추천 알고리즘.",
  },
  {
    id: "tour",
    number: "04",
    title: "뱅기노자 투어 프로그램 판매·운영",
    short: "답사 프로그램 신청·운영(무통장 입금).",
    state: "프로덕션 운영",
    coverage: "기능 ~80%",
    verdict: "회원 전용 신청 → 무통장 입금 → 관리자 입금 확인 → 참가 확정 + 정원·대기열 + 후기 + .ics + R2 커버 + 다중 계좌 + 답사 일정/준비물 에디터까지 D1 운영. 남은 큰 항목은 PG 결제·체크인·외국어·환불 자동화.",
  },
  {
    id: "book",
    number: "05",
    title: "뱅기노자 책 판매",
    short: "『왕의길』 등 다권 도서 무통장 입금 주문 운영.",
    state: "프로덕션 운영",
    coverage: "기능 ~80%",
    verdict: "다권화(D1.books + R2 표지/PDF) + 회원 전용 무통장 입금 → 관리자 입금 확인 → 발송(송장) → 배송 완료 + 환불 신청 + 다중 계좌 + 책별 후기까지 운영. 남은 큰 항목은 PG 결제·재고·영수증·교환·쿠폰.",
  },
];

const FEATURE_DOMAINS = [
  {
    id: "infra",
    number: "00",
    label: "공통 기반",
    title: "공통 기반 — 5개 미션의 받침",
    role: "5개 미션이 공통으로 의지하는 진입점, 인증, 운영자 콘솔, 운영 문서.",
    routes: ["home", "login / signup", "mypage", "admin", "documents"],
    status: "프로덕션 운영",
    evaluation: "정적 SPA(GitHub Pages) + Cloudflare Worker(2.4k줄) + D1(20+ 테이블) + R2(미디어) 풀스택. PBKDF2 + httpOnly 세션 쿠키 인증, BGNJ_API helper 한 곳에 모든 fetch 집중, 33 탭 8 그룹 collapsible 사이드바, 실측 페이지뷰/유입 경로/요일×시간 히트맵/Sankey 대시보드까지 가동. 남은 핵심 P0 결손은 이메일 인증·소셜 로그인·비밀번호 재설정·PG 결제·전역 검색.",
    missing: [
      "이메일 인증 + 비밀번호 재설정 (워커 측 메일 발송 인프라 미구축)",
      "OAuth 소셜 로그인 (Google / Kakao / Naver)",
      "전역 검색 (게시글·칼럼·강연·투어·책 통합 인덱스)",
      "마이페이지 프로필 수정·비밀번호 변경 UI (admin 측에만 존재)",
      "PG 결제 통합 (강연·투어·책 모두 무통장 입금까지만)",
      "이메일/SMS 발송 채널 (현재 알림은 사이트 내 ◇ 벨만)",
      "단위·통합 테스트 (CI 미구축)",
    ],
    features: [
      {
        name: "홈 랜딩",
        status: "구현됨",
        summary: "히어로 + 책 카루셀 + 칼럼 피처 + 강연/투어 카드 + 파트너십 + CTA. 모든 콘텐츠는 D1 fetch 후 stream 별 dataTick 으로 부분 갱신.",
        elements: [
          "히어로 (center / split / fullbleed 3종 토글, BGNJ_HERO_STYLE D1 저장)",
          "공지사항 (categories.boardType='community' notice 카테고리 상위)",
          "책 카루셀 (BGNJ_BOOKS.list 다권 슬라이드)",
          "강연 / 투어 / 칼럼 카드 (각 D1 스트림)",
          "파트너십 / 푸터 배포 버전",
          "v00.198 — stream 별 tick state 분리 (publicColumns / recentPosts / tours / lectures 독립 useMemo)",
        ],
        techSpec: "HomePage 컴포넌트. 데이터: BGNJ_BOOKS / BGNJ_COLUMNS / BGNJ_LECTURES / BGNJ_TOURS / BGNJ_COMMUNITY. 워커 list endpoint 는 익명 GET 시 CDN edge cache (s-maxage=60s, SWR=120s) 부착(v00.198).",
        caution: "히어로 통계 수치 카드는 폐기됨(v00.140 이전). 현재는 실측 D1 데이터만 노출.",
        issues: [],
      },
      {
        name: "인증 / 계정 (D1 + 세션 쿠키)",
        status: "구현됨",
        summary: "이메일·비번 회원가입/로그인. PBKDF2-SHA256 100k 해시. httpOnly bgnj_session 쿠키 + Authorization Bearer 양립.",
        elements: [
          "회원가입 (워커 handleAuthSignup → D1.users + audit_log signup)",
          "로그인 (handleAuthLogin → D1.sessions, 30일 만료)",
          "로그아웃 (세션 무효화)",
          "약관·개인정보·마케팅·SMS 동의 5종 체크박스 → consents 컬럼",
          "회원 등급 (D1.grades_kv) 자동 부여",
          "관리자 계정 (is_admin / is_super_admin 컬럼)",
        ],
        techSpec: "BGNJ_AUTH helper + BGNJ_API.auth.signup/login/logout/me. D1.users + D1.sessions + D1.audit_log. 비번 hashPassword(password, salt, 100000 iter, SHA-256).",
        caution: "비번 재설정·이메일 인증 미구현이라 잘못된 이메일로 가입하면 복구 불가. 이메일 발송 인프라 부재가 P0.",
        issues: [],
      },
      {
        name: "마이페이지",
        status: "구현됨",
        summary: "로그인 사용자에게 본인의 강연/투어/책 주문/북마크/알림/활동을 한 화면에서 노출.",
        elements: [
          "계정 카드 (이메일·등급·권한·가입 시각)",
          "예정 강연 (BGNJ_API.me.lectures)",
          "예정 답사 (BGNJ_API.me.tours)",
          "주문 내역 (BGNJ_API.me.orders)",
          "북마크 (BGNJ_API.me.bookmarks)",
          "알림 카드 (최근 6건 + 외 N건)",
        ],
        techSpec: "MyPage 컴포넌트. 모든 데이터 BGNJ_API.* D1 fetch. 점프는 sessionStorage.bgnj_pending_*_id 패턴.",
        caution: "프로필 수정·비밀번호 변경 UI 미구현 — admin 콘솔의 회원 패널을 통해야만 변경 가능.",
        issues: [],
      },
      {
        name: "관리자 콘솔 (33 탭 / 8 그룹)",
        status: "구현됨",
        summary: "운영자가 콘텐츠·회원·주문·문서·개인정보·시스템을 한 콘솔에서 운영. 8 그룹 collapsible 사이드바 + 그룹별 카운트 + 현재 탭 자동 펼침.",
        elements: [
          "그룹 1 요약: 대시보드 / 사용자 여정",
          "그룹 2 콘텐츠: 뱅기노자 칼럼 / 추천 여행지 / 먹·자·사고 놀자",
          "그룹 3 프로그램·쇼핑: 강연 / 투어 프로그램 / 책 카탈로그 / 책 주문",
          "그룹 4 커뮤니티 SubTabs: 게시글 / 게시판 / 신고",
          "그룹 5 회원: 회원 / 회원 등급",
          "그룹 6 사이트 설정 SubTabs: 사이트 콘텐츠 / 홈 텍스트 / 히어로 / SEO / 검색엔진 / 약관·개인정보 / FAQ / 계좌번호",
          "그룹 7 개인정보·법무: 정보주체 권리 / 동의 / ROPA / 쿠키 / 보안사고 / 보유·파기 / 국외 이전 / 감사 로그",
          "그룹 8 시스템: 활동 로그 / 내부 알람 / 버전 기록 / KMS / 오류 로그 / 오류 페이지 미리보기 / 설정",
          "사이드바 상단 버전 뱃지 v{BGNJ_VERSION} (v00.192)",
          "admin 진입 시 lazy-load (4 스크립트 ~3.85MB raw / ~360KB gz, 비-admin 트래픽 차단, v00.198)",
        ],
        techSpec: "AuthAdminPage(9000+줄) + AdminDesignHub(KMS·버전·기능정의) + AdminContentEditors(추천여행지·투어·강연 페이지·푸터) + AdminShared(MiniBarChart·RankedBarList·Sankey·Heatmap·CohortSelector·SubTabsView). v00.187 분할 후 4 모듈. v00.198 admin lazy-load.",
        caution: "AuthAdminPage 가 9000줄 초과 — 다음 분할 후보는 패널 단위(LectureAdminPanel/TourAdminPanel/BooksAdminPanel). closure 변수 의존 많아 큰 작업.",
        issues: [
          "v00.198 admin lazy-load 도입 — 비-admin 99% 트래픽이 admin 번들 다운/파스/컴파일 회피",
        ],
      },
      {
        name: "분석 대시보드 (실측 D1 데이터)",
        status: "구현됨",
        summary: "page_views 테이블(schema-v9) 기반 일/주/월 페이지뷰·세션·페이지/세션·가입 추이·유입 경로·인기 페이지·요일×시간 히트맵·사용자 여정 Sankey 까지.",
        elements: [
          "4 KPI 카드 (전체 회원 / 게시글 / 칼럼 / 책 주문) + hover popover details (v00.157)",
          "방문자 카드 4종 (일/주/월 PV·UV + 오늘 신규 가입)",
          "페이지뷰 추이 + 가입 추이 차트 (1/7/14/30/90일 cohort, 1일이면 시간 단위)",
          "회원 등급별 분포 RankedBarList (v00.196)",
          "유입 경로 RankedBarList (referrers, 30일 cohort 기본)",
          "인기 페이지 RankedBarList (route, 7일 cohort 기본)",
          "요일×시간 히트맵 (KST +9h shift, v00.194)",
          "사용자 여정 Sankey (referrer → channel → stage 흐름)",
        ],
        techSpec: "BGNJ_ANALYTICS.track + 워커 handlePageViewTrack(POST /api/analytics/track). handleAnalyticsSummary(GET) 가 day/week/month/dailySeries/hourlySeries/referrers/topRoutes/heatmap 단일 응답. 30일 이전 row 1/100 GC. AdminShared.MiniBarChart/RankedBarList/HeatmapGrid 재사용.",
        caution: "schema-v9 적용 + 워커 deploy 안 되어 있으면 모든 차트 '⚠ 분석 데이터 미수신' 표시. UV 는 session_id 기반 — 같은 사용자가 다른 브라우저에서 들어오면 별도 카운트.",
        issues: [
          "v00.195 — 가입 추이 차트가 0 으로 stuck 되던 root cause: createdAt vs joinedAt 필드명 mismatch + memo dep 누락. 정정 후 정상.",
        ],
      },
      {
        name: "활동 로그 / 감사 로그 / 오류 로그 / 내부 알람",
        status: "구현됨",
        summary: "관리자/회원 모든 활동을 D1 audit_log + error_log + 게시글/오류 머지로 통합 조회. 기간/유형/검색/정렬 4종 필터. 트러블슈팅 시 사고 직전 시간대 좁히기 가능.",
        elements: [
          "활동 로그 — audit_log + error_log + 최근 게시글 머지 (v00.190)",
          "유형 분류 8종 (관리자 / 회원가입 / 등급 / 카테고리 / 콘텐츠 / 알람 / 게시글 / 오류) + 컬러 칩",
          "검색 (주체 / 액션 / 대상 / 상세 / IP)",
          "기간 필터 (KST), 정렬 4종, 상위 500건",
          "감사 로그 별도 패널 (audit_log 단독, 30일 GC)",
          "오류 로그 패널 (error_log, AppErrorBoundary + GlobalErrorToast 자동 전송)",
          "내부 알람 — 4 그룹 라디오(전체 관리자 / 전체 회원 / 일반 회원만 / 특정 등급) + 발송 카운트 (v00.183, v00.191)",
        ],
        techSpec: "audit_log GC: 30일 ts 이전 row 1/20 확률 일괄 삭제. handleAuditCreate / handleAuditList / handleErrorLogCreate(anonymous OK) / handleErrorLogList(admin) / handleErrorLogClear / handleInternalAlarmSend.",
        caution: "audit_log 는 보존 30일 — 더 긴 보관 필요하면 GC 비활성화 또는 외부 export 필요. 오류 로그 익명 POST 가능 → 스팸 위험 (rate limit 미적용).",
        issues: [],
      },
      {
        name: "운영 문서 / KMS / 버전 기록 / 기능정의서",
        status: "구현됨",
        summary: "kms.md / ai-development-rules / project-priority-table 본문 + 관리자 KMS 탭 (디자인 시스템 + 기능정의서) + 버전 기록 페이지네이션.",
        elements: [
          "ADMIN_VERSION_HISTORY (현재 v00.198, 198 항목)",
          "MISSION_OVERVIEW + FEATURE_DOMAINS 기능정의서",
          "DesignSystemView (디자인 토큰 + 스니펫)",
          "BGNJ_VERSION 단일 출처 (푸터 + 사이드바 뱃지 + cache-buster)",
        ],
        techSpec: "AdminDesignHub.jsx 가 단일 파일 (4300+ 줄) — ADMIN_VERSION_HISTORY + ADMIN_DESIGN_SECTIONS + MISSION_OVERVIEW + FEATURE_DOMAINS + DesignSystemView. window.BGNJ_VERSION 가 build·version·cacheBuster 단일 출처.",
        caution: "기능정의서가 코드 상수라 자동 업데이트 안 됨 — 사이클마다 수동 갱신 필요 (v00.198 가 그것).",
        issues: [],
      },
    ],
    techSpec: "정적 SPA (React UMD + esbuild 18 파일 컴파일) + Cloudflare Worker (2461줄, 80+ 핸들러) + D1 (20+ 테이블 schema-v9) + R2 (og/logos/auth/tour-covers/lecture-covers/book-covers/book-pdfs 7 폴더). 데이터 흐름: BGNJ_API → 워커 fetch → D1/R2 → BGNJ_<DOMAIN> helper 캐시 → React state. localStorage 는 첫 페인트 캐시 + 임시저장만, source-of-truth 는 D1.",
    cautions: [
      "v00.196 esbuild 빌드 — 프로덕션은 esbuild 결과 사용 (Babel standalone JSX 런타임 컴파일은 폐기)",
      "BGNJ_GUARD: 모든 admin 액션은 BGNJ_API 응답으로 검증 후 BGNJ_SAVE 로 캐시 동기화",
      "워커 list endpoint 는 익명 GET 만 CDN 캐시 — bgnj_session 쿠키 또는 includeAll/includeHidden 쿼리 있으면 캐시 안 함 (admin 데이터 누출 방지, v00.198)",
      "사이트 정적 배포(GitHub Pages) + 워커는 별도 wrangler deploy — 사이클마다 워커 변경 있을 때 release 노트에 ★ 표시",
    ],
    issues: [
      "이메일 발송 인프라 부재 — 가입 인증·비번 재설정·D-1 알림 모두 막혀 있음",
      "v00.195 까지 다양한 차트 fields 가 createdAt vs joinedAt 같은 mismatch 로 0 noise — root cause 식별 후 정정",
      "v00.196 ~ v00.198 perf 사이클: sourcemap 제거(-3.4MB raw) + 폰트 preload + ScrollToTop rAF throttle + Nav/Footer/CookieConsent React.memo + admin lazy-load + 워커 CDN 캐시 + HomePage tick 분리",
    ],
  },
  {
    id: "community",
    number: "01",
    label: "뱅기노자 커뮤니티",
    title: "미션 1 — 뱅기노자 커뮤니티 운영",
    role: "회원이 질문·후기·정보를 남기고 운영자가 같은 흐름에서 관리하는 핵심 참여 영역.",
    routes: ["community", "mypage(북마크 / 알림)", "admin > 게시글", "admin > 신고"],
    status: "프로덕션 운영",
    evaluation: "사용자 / 관리자가 같은 D1.posts + D1.comments + D1.post_likes + D1.bookmarks + D1.reports 를 본다. 게시판별 권한 4종(읽기 / 쓰기 / 댓글 읽기 / 댓글 쓰기) + 등급별 minLevel + 드래그앤드롭 정렬 + 일괄 이동 / 삭제 · 접두어 부여까지 D1 운영. 본문은 Tiptap StarterKit + Image(R2 dataURI 폴백) + Link + Typography. 답글 트리 · 해시태그 · 차단 정책이 큰 결손.",
    missing: [
      "댓글 답글(트리 구조) · 멘션",
      "차단 / 블랙리스트 운영 정책",
      "해시태그 / 인기글 / 주간 트렌드",
      "본문 검색 (현재 워커 SQL LIKE — title / author 만)",
      "이미지 R2 직업로드 (본문 첨부는 아직 base64 dataURI inline — admin 첨부만 R2)",
      "회원 활동 요약 (admin 패널엔 있으나 사용자 자기 페이지엔 없음)",
      "신고 사유 카탈로그 + auto-hide 규칙",
    ],
    features: [
      {
        name: "게시글 목록 / 검색 / 카테고리 필터 / 페이지네이션",
        status: "구현됨",
        summary: "전체 게시글을 카테고리·검색어로 좁혀 보고 페이지 단위로 탐색.",
        elements: [
          "검색 입력(제목 부분 일치)",
          "카테고리 탭(자유 / 질문 / 정보 등)",
          "행 리스트(번호 / 분류 / 제목 / 작성자+등급 / 조회 / 날짜)",
          "페이지네이션(10건/페이지, 이전·다음·번호)",
          "북마크 / 좋아요 카운트 인디케이터(제목 옆)",
        ],
        techSpec: "`BGNJ_COMMUNITY.listPosts()` → `BGNJ_STORES.communityPosts` localStorage. 카테고리는 `BGNJ_STORES.categories` 중 `boardType === 'community'`. 페이지 상태(`page`)는 검색·탭 변경 시 1로 리셋.",
        caution: "검색은 제목 부분 일치이고 본문 검색은 미구현. 정렬은 최신순 한 가지.",
        issues: ["사용자 작성 글과 시드 글이 다른 키에 저장되어 있던 P1 → `ensureCommunityPostsSeeded`로 단일 키 통합"],
      },
      {
        name: "게시글 작성 / 수정 / 삭제",
        status: "구현됨",
        summary: "본인 또는 관리자가 글을 만들고 고치고 지움.",
        elements: [
          "Tiptap 본문 에디터(StarterKit + Image + Link + Typography)",
          "카테고리 선택",
          "이미지 첨부",
          "임시 저장 (미구현)",
          "수정 / 삭제 버튼(작성자·관리자)",
        ],
        techSpec: "`BGNJ_COMMUNITY.createPost / updatePost / deletePost`. 권한은 작성자 본인 혹은 `user.isAdmin`. Tiptap은 `window.BGNJ_TIPTAP`으로 ESM 주입.",
        caution: "삭제는 즉시 영구 삭제. 운영 중 실수 방지를 위해 confirm() 한 번을 반드시 거치도록 유지.",
        issues: [
          "Tiptap이 첫 마운트보다 늦게 로드될 수 있어 `wsd-tiptap-ready` 이벤트를 기다리는 fallback을 추가",
          "임시 저장이 없어 작성 중 새로고침 시 본문 손실",
        ],
      },
      {
        name: "댓글 등록 / 삭제",
        status: "부분 구현",
        summary: "게시글에 댓글을 달고 본인/관리자 권한으로 삭제.",
        elements: [
          "입력 폼",
          "댓글 리스트",
          "삭제 버튼",
          "답글(트리) — 미구현",
          "멘션 — 미구현",
        ],
        techSpec: "`BGNJ_STORES.comments[postId]` 배열. push / filter로 처리.",
        caution: "포스트 ID당 단일 배열이라 댓글 수가 많아지면 페이지네이션 구조 확장 필요.",
        issues: ["게시글의 `replies` 카운트가 댓글 배열 길이와 어긋날 수 있어 normalize 시점에 동기화"],
      },
      {
        name: "조회수 저장",
        status: "부분 구현",
        summary: "게시글 상세 진입 시 조회수 카운트.",
        elements: [
          "조회수 카드",
          "본인 자동 카운트 방지 — 미구현",
          "유닛 테스트 — 미구현",
        ],
        techSpec: "상세 진입 시 `views += 1` 후 `BGNJ_SAVE.communityPosts()` 호출.",
        caution: "동일 사용자 새로고침 시 중복 카운트 발생. 운영 수치로는 신뢰도가 낮음.",
        issues: [],
      },
      {
        name: "이미지 첨부",
        status: "부분 구현",
        summary: "본문에 이미지를 끼워 넣음.",
        elements: [
          "드롭존",
          "Tiptap Image 확장",
          "Dropcursor",
        ],
        techSpec: "이미지를 base64로 인코딩해 본문 HTML에 직접 삽입. localStorage에 같이 저장됨.",
        caution: "1~2MB 이미지 몇 개만 올려도 localStorage quota(5~10MB)에 빠르게 도달 → 외부 스토리지 필요.",
        issues: ["base64 저장으로 운영 중 quota 초과 케이스가 보고됨"],
      },
      {
        name: "카테고리 접근 제한",
        status: "부분 구현",
        summary: "특정 카테고리(예: 운영진 공지)는 권한이 있는 사용자만 글을 쓰거나 보도록 제한.",
        elements: [
          "카테고리 정의(`boardType`, `requiresLogin`, `requiresAdmin`)",
          "게이트 컴포넌트",
        ],
        techSpec: "`BGNJ_STORES.categories` 메타에 권한 플래그 보유, 컴포넌트 단에서 검사.",
        caution: "클라이언트 단 검사라 외부 DB 도입 시 서버 측 권한 정책을 별도로 가져가야 함.",
        issues: [],
      },
      {
        name: "관리자 게시글 운영",
        status: "구현됨",
        summary: "관리자 화면에서 같은 저장소를 검색/필터/CSV/삭제로 운영.",
        elements: [
          "검색 입력",
          "분류 필터(카테고리)",
          "CSV 다운로드(좋아요 수 포함)",
          "행 단위 열기·삭제",
        ],
        techSpec: "`BGNJ_COMMUNITY.exportCsv()` + `BGNJ_COMMUNITY.deletePost(id)`. 사용자 화면과 동일 저장소.",
        caution: "관리자 삭제는 즉시 사용자 화면에 반영되므로 confirm 필수.",
        issues: ["P1 시점에 관리자 탭이 mock 배열을 보던 문제 → P2에서 통합"],
      },
      {
        name: "좋아요 / 공감",
        status: "구현됨",
        summary: "글 상세에서 ♥ 버튼으로 공감을 누르고 누른 사람 목록을 글에 보존.",
        elements: [
          "♥ 토글 버튼(상태별 골드 강조)",
          "공감 카운트(헤더 + 액션 영역 + 목록 인디케이터)",
          "비로그인 시 로그인 유도 confirm",
          "본인 두 번 누름 → 취소(토글)",
        ],
        techSpec: "`BGNJ_COMMUNITY.toggleLike(postId, userId)` → `post.likes`(userId 배열). `hasLiked / getLikes`로 상태 조회. 글 저장 시 같이 직렬화.",
        caution: "좋아요 카운트는 배열 길이로 계산하므로 동일 userId가 중복으로 들어가지 않도록 toggleLike에서 보호.",
        issues: [],
      },
      {
        name: "북마크",
        status: "구현됨",
        summary: "글 상세에서 ☆ 버튼으로 북마크하고 마이페이지에서 모아 보기.",
        elements: [
          "☆/★ 토글 버튼",
          "목록 제목 옆 ★ 인디케이터(본인 북마크된 글)",
          "마이페이지 BOOKMARKS 카드(최대 8건 + 외 N건 표시)",
          "비로그인 시 로그인 유도 confirm",
        ],
        techSpec: "`BGNJ_STORES.bookmarks` = `{ userId: [postId, ...] }`. `BGNJ_COMMUNITY.toggleBookmark / isBookmarked / getBookmarks / listBookmarkedPosts`.",
        caution: "북마크된 글이 삭제되면 ID는 남되 `getPost`에서 null이 반환되어 마이페이지에서는 자동으로 누락됨.",
        issues: [],
      },
      {
        name: "신고 운영 큐",
        status: "구현됨",
        summary: "사용자가 글을 신고하면 관리자 콘텐츠 메뉴 `신고` 탭에서 처리.",
        elements: [
          "글 상세 신고 버튼(클릭 시 사유 입력 폼 펼침)",
          "사유 textarea + 접수 confirmation",
          "관리자 신고 탭(필터: 미처리 / 처리 완료 / 반려 / 전체)",
          "신고 카드(제목 / 사유 / 신고자 / 시각 / 상태 배지)",
          "액션 버튼: 게시글 열기 / 처리 완료 / 반려 / 게시글 삭제+처리",
        ],
        techSpec: "`BGNJ_STORES.reports` 배열. `BGNJ_COMMUNITY.addReport / listReports(filter) / updateReportStatus / countOpenReports`. 상태: open / resolved / dismissed.",
        caution: "신고된 후 게시글을 직접 삭제해도 신고 레코드는 남는다(이력 보존). 게시글이 사라지면 '게시글 열기' 버튼은 빈 상세를 보여줄 수 있음.",
        issues: [],
      },
      {
        name: "댓글 알림 / 알림 벨",
        status: "구현됨",
        summary: "내 글에 다른 사람이 댓글을 달면 알림이 쌓이고 내비게이션 ◇ 벨에 미읽음 카운트가 표시.",
        elements: [
          "내비게이션 ◇ 벨 버튼(미읽음 배지)",
          "벨 드롭다운(최근 50건, 미읽음 강조)",
          "모두 읽음 버튼",
          "알림 클릭 → 게시글로 이동(읽음 처리)",
          "마이페이지 NOTIFICATIONS 카드(최근 6건 + 외 N건)",
        ],
        techSpec: "`BGNJ_STORES.notifications` = `{ userId: [ {id, type, postId, postTitle, fromName, message, createdAt, read} ] }`. 댓글 등록 시 `addNotification(post.authorId, ...)` 호출(본인 글 제외, authorId 있을 때만). 게시글 점프는 `sessionStorage.bgnj_pending_post_id` 후 `go('community')`.",
        caution: "본인 글에는 알림이 가지 않도록 commenter ↔ author 비교 필수. 시드 글처럼 authorId가 없는 글에는 알림이 발행되지 않음.",
        issues: ["라우팅이 글로벌 App 상태에 묶여 있어 외부 진입 시 sessionStorage 경유 패턴을 사용"],
      },
      {
        name: "회원 등급 배지",
        status: "구현됨",
        summary: "글 목록 / 글 상세 / 댓글의 작성자 옆에 등급 라벨을 컬러 배지로 표시.",
        elements: [
          "AuthorGradeBadge 공통 컴포넌트(`Shell.jsx`)",
          "글 목록 작성자 컬럼",
          "글 상세 작성자 메타",
          "댓글 작성자 라벨",
        ],
        techSpec: "`BGNJ_USER_GRADE(user)` + `BGNJ_AUTHOR_GRADE({authorId, author, authorEmail})`. 등급 색상은 `BGNJ_STORES.grades`의 `color`.",
        caution: "시드 글 작성자(돌담아래 등)는 가입 사용자가 아니므로 배지가 표시되지 않음. 추후 시드 데이터를 가입 회원과 매칭하면 자동으로 채워짐.",
        issues: [],
      },
    ],
    techSpec: "BGNJ_COMMUNITY helper + D1.posts / D1.comments / D1.post_likes / D1.bookmarks / D1.reports / D1.notifications / D1.categories_kv. 워커 핸들러 ~15종. 본문은 Tiptap HTML 문자열로 D1 저장.",
    cautions: [
      "본문 dangerouslySetInnerHTML 의 신뢰 범위는 'Tiptap StarterKit 가 sanitize 한 회원/관리자 입력' — 외부 paste 시 Tiptap clipboard rules 의존",
      "권한 가드는 클라 + 서버 양쪽 — 서버 (워커 categories_kv JOIN) 가 진실. 클라는 UX 단계만 차단",
      "v00.198 워커 list endpoint 는 익명 GET 만 60s CDN 캐시 — 인증 쿠키 있으면 캐시 안 함 (admin 데이터 누출 방지)",
      "이미지 본문 첨부는 base64 inline (R2 직업로드 미적용) — D1 row 크기 주의",
    ],
    issues: [
      "v00.130 — body 객체 → html 문자열 직렬화 손상 root fix (이전엔 '[object Object]' 저장)",
      "v00.194 — 게시글 안 불러짐 root fix (refreshPosts 빈 catch + retry 추가 + visibilitychange 재시도)",
      "v00.197 — 다크모드 본문 가독성 fix (Tiptap inline color !important override)",
    ],
  },
  {
    id: "lecture",
    number: "02",
    label: "강연 일정",
    title: "미션 2 — 뱅기노자 강연 일정 안내",
    role: "공개 / 심화 / 현장 강연 일정을 알리고 신청·입금·확정까지 운영.",
    routes: ["lectures(목록·상세·신청)", "home(노출)", "mypage(내 신청 강연)", "admin > 강연(운영 명단)", "admin > 설정(계좌번호)"],
    status: "프로덕션 운영",
    evaluation: "Cycle 3 이후 워커 + D1 로 풀 마이그레이션. 강연 CRUD + 신청 → 무통장 입금 → 관리자 입금 확인 → 참가 확정 + 정원·대기열·자동 승격 + 후기 + .ics + URL 해시 딥 링크 + 이미지 커버 R2 + 다중 계좌 + 강연자별 페이지 에디터(LecturePageEditorPanel)까지. PG 결제·D-1 자동 알림이 큰 결손.",
    missing: [
      "PG 결제 (현재 무통장 입금만)",
      "D-1 / 변경 알림 자동 발송 (이메일 / SMS 인프라 미구축)",
      "참가자 체크인 / 출석 이력",
      "자료 보관함 (영상 · PDF · 발표자료)",
      "강연자 프로필 페이지 (현재는 강연 페이지 에디터의 하단 노트만)",
      "시리즈 묶음 / 패스 상품",
      "후기 사진 첨부 (현재 텍스트·평점만)",
    ],
    features: [
      {
        name: "강연 목록 / 상세 / 잔여 좌석 표시",
        status: "구현됨",
        summary: "공개 / 심화 / 현장 강연을 카드로 보여주고 클릭 시 상세에서 정원·잔여·대기 인원·참가비를 함께 노출.",
        elements: [
          "강연 카드(라벨 / 다음 일정 / 주제 / 장소 / 진행 / 정원 / 잔여 또는 대기)",
          "FREE / 무통장 입금 배지",
          "내 신청 인디케이터(상태 라벨 동시 표시)",
          "상세 헤더 6 메타(일정·장소·진행·정원·잔여·참가비)",
        ],
        techSpec: "`BGNJ_LECTURES.listAll() / getLecture / getSeats`. 시드는 `BANGINOJA_DATA.lectures`, 관리자가 수정한 항목은 `BGNJ_STORES.lectureOverrides`에 저장 후 머지.",
        caution: "잔여석은 `capacity - 활성(취소 제외) 비대기 등록 합` 으로 즉시 계산하므로 시드의 `seats` 텍스트는 더 이상 운영 수치로 사용하지 않음(표시 폴백용).",
        issues: [],
      },
      {
        name: "강연 신청 — 무료 즉시 확정 / 유료 무통장 입금",
        status: "구현됨",
        summary: "회원만 신청 가능. 정원이 남으면 무료는 즉시 `confirmed`, 유료는 `pending_payment`. 정원이 차면 `waitlist`.",
        elements: [
          "이름 / 이메일 / 연락처 / 인원 / 메모",
          "합계 표시(인원 × 참가비)",
          "정원 부족 시 대기자 자동 안내",
          "비로그인 시 회원가입·로그인 진입 카드",
          "신청 후 본인 상태 카드 + 입금 안내(유료) + .ics 다운로드 + 신청 취소",
        ],
        techSpec: "`BGNJ_LECTURES.register({lectureId, userId, name, email, phone, count, note})`. 같은 사용자가 같은 강연에 두 번 신청 못 하도록 `hasUserRegistered`로 가드. 취소 시 `_promoteWaitlist`가 자동 실행되어 가장 오래된 대기자를 승격.",
        caution: "한 사용자가 한 강연에 한 건만 가질 수 있다(취소 후 재신청은 가능). 인원 수는 1 이상, 정원 이하.",
        issues: ["기존 시드 데이터의 'seats' 텍스트는 실제 정원/잔여 계산과 무관하므로 운영자에게는 혼선이 될 수 있음 — 관리자 강연 탭에서 직접 capacity 값을 수정하도록 안내 필요"],
      },
      {
        name: "관리자 입금 확인 → 참가 확정",
        status: "구현됨",
        summary: "관리자 콘텐츠 메뉴 `강연` 탭에서 신청 명단을 보고 입금 확인 / 확정 취소 / 신청 취소를 직접 처리.",
        elements: [
          "강연별 헤더(잔여 / 대기 / 가격)",
          "강연 정보 수정(제목·주제·장소·진행·시작·소요·정원·가격·메모)",
          "참가자 표(이름·이메일·연락처·인원·상태·입금 여부)",
          "액션: `입금 확인 → 확정` / `확정 취소` / `취소`",
        ],
        techSpec: "`BGNJ_LECTURES.confirmPayment(lectureId, registrationId)` → `paid: true`, `status: 'confirmed'`. `unconfirmPayment`로 되돌릴 수 있음. `cancelRegistration`은 좌석을 돌려놓고 `_promoteWaitlist` 실행.",
        caution: "확정 취소 후 좌석은 즉시 풀려 다음 대기자가 자동 승격됨. 의도치 않은 환불 분쟁을 막으려면 입금 환불 후에만 확정 취소를 누를 것.",
        issues: [],
      },
      {
        name: "관리자 계좌번호 설정 (관리자 > 설정)",
        status: "구현됨",
        summary: "강연 신청 시 사용자에게 노출되는 무통장 입금 계좌를 관리자 콘솔에서 입력.",
        elements: [
          "은행 / 계좌번호 / 예금주",
          "안내 메모(입금자명 규칙 등)",
          "저장 즉시 사용자 신청 화면에 반영",
        ],
        techSpec: "`BGNJ_LECTURES.getBankAccount() / saveBankAccount(payload)` → `BGNJ_STORES.bankAccount`. 비어 있으면 사용자 신청 시 '운영자에게 문의' 안내.",
        caution: "민감 정보(계좌)이므로 관리자 외에는 접근하지 못해야 함. 현재는 관리자 라우트 자체가 `user.isAdmin` 가드.",
        issues: [],
      },
      {
        name: "마이페이지 내 신청 강연",
        status: "구현됨",
        summary: "로그인 사용자에게 본인이 신청한 강연을 상태별로 카드 리스트로 노출.",
        elements: [
          "강연 주제 / 다음 일정 / 인원 / 상태(입금 대기 / 참가 확정 / 대기자 / 취소)",
          "카드 클릭 → 강연 상세로 이동",
          "최대 4건 + '외 N건'",
        ],
        techSpec: "`BGNJ_LECTURES.listMyRegistrations(user.id)`로 모든 강연을 가로지르며 본인 등록만 모음. 강연 점프는 `sessionStorage.bgnj_pending_lecture_id` 패턴 사용.",
        caution: "신청 후 강연이 삭제되면 카드의 강연 정보가 비어 보일 수 있음.",
        issues: [],
      },
      {
        name: ".ics 캘린더 다운로드",
        status: "구현됨",
        summary: "강연 시작 시각·소요 시간·장소·메모를 담은 표준 .ics 파일을 즉시 내려받기.",
        elements: [
          "상세에서 `캘린더 추가 (.ics)` 버튼",
          "신청 후 본인 상태 카드에서도 다운로드 가능",
        ],
        techSpec: "`BGNJ_LECTURES.generateIcs(lecture)` → RFC 5545 형식 문자열. `downloadIcs(lectureId)`가 Blob을 만들어 클릭 다운로드.",
        caution: "`startsAt` ISO + `durationMinutes`가 있어야 정상 생성됨. 운영자가 강연을 새로 만들 때 두 필드를 채우도록 강제할 것.",
        issues: [],
      },
      {
        name: "URL 해시 딥 링크 / 홈 카드 연결",
        status: "구현됨",
        summary: "`#lecture-{id}`로 강연 상세를 외부 공유. 홈 강연 카드 클릭은 `lectures` 라우트로 직접 점프.",
        elements: [
          "App `applyHash`가 `#lecture-{id}` 매칭 시 `lectures` 라우트로 이동 + sessionStorage 셋",
          "홈 강연 카드 onClick → `bgnj_pending_lecture_id` + `go('lectures')`",
        ],
        techSpec: "`index.html` App `useEffect` 라우트 해시 + `sessionStorage` 페치. 강연 페이지 mount에서 pending id 읽고 setSelectedId.",
        caution: "라우트가 글로벌 App 상태에 묶여 있어 외부 진입은 sessionStorage 패턴을 그대로 따른다.",
        issues: [],
      },
    ],
    techSpec: "BGNJ_LECTURES helper + D1.lectures / D1.lecture_registrations / D1.lecture_reviews / D1.bank_accounts / D1.notifications + R2 lecture-covers/. 워커 핸들러 ~15종. 결제 분기는 priceNumber === 0.",
    cautions: [
      "회원만 신청 — 비회원에게는 회원가입/로그인 진입 카드, 폼 자체 막음",
      "결제는 무통장 입금만 — PG 후속",
      "정원/대기열은 워커 내 트랜잭션으로 즉시 계산 + 자동 승격 — D1 row lock 으로 동시성 처리",
      "강연·투어·책이 같은 D1.bank_accounts 공유 — 한 곳에서 변경하면 모든 결제 경로 반영",
    ],
    issues: [
      "v00.117 — admin createdAt 오버라이드 시점에 시간 안 보존되던 root cause 정정",
      "v00.191 — 알림 broadcast 그룹 4종 확장 (recipients all_admins / all_members / all_non_admins / {grade})",
    ],
  },
  {
    id: "column",
    number: "03",
    label: "뱅기노자 칼럼",
    title: "미션 3 — 뱅기노자 칼럼 공유",
    role: "뱅기노자의 글을 공개해 브랜드 신뢰와 깊이를 만드는 콘텐츠 영역.",
    routes: ["column(공개)", "home(추천)", "admin > 칼럼 / 칼럼 작성(운영)"],
    status: "프로덕션 운영",
    evaluation: "ColumnsHubPanel 단일 화면에서 임시저장(BGNJ_DRAFTS 7일·10건) + 예약 발행 + 즉시 발행 + 발행 취소 + 동적 카테고리 관리(site_content_kv.columnCategories) 모두 처리. 좋아요/조회수는 D1.user_columns.likes_json + views_count 로 실측. 댓글은 BGNJ_COMMUNITY.comments 를 col-{id} 키로 재사용. RSS · 이메일 구독 · 작성자 프로필이 큰 결손.",
    missing: [
      "이메일 / 웹 푸시 구독, 신규 칼럼 알림 (발송 인프라 미구축)",
      "RSS / Atom 피드 (워커에서 XML 발행)",
      "작성자 프로필 카드 + 관련 글 자동 추천",
      "북마크 (커뮤니티에는 있으나 칼럼은 미적용)",
      "시리즈 묶음 인덱스",
      "본문 검색 (현재 본문 부분 일치 클라이언트 측만)",
      "열람 / 좋아요 통계 시각화 (admin 대시보드에 칼럼별 분석 화면 미구축)",
    ],
    features: [
      {
        name: "공개 칼럼 목록 / 검색 / 카테고리 아카이브",
        status: "구현됨",
        summary: "기본 칼럼 + 관리자 발행(published) 칼럼을 병합해 카드 그리드로 노출. 제목·발췌·본문 검색과 카테고리 필터로 좁혀 보기.",
        elements: [
          "검색 입력(제목·발췌·본문 부분 일치)",
          "카테고리 토글 버튼(전체 + 데이터에서 자동 추출)",
          "카드(카테고리·읽기시간·♥ 카운트·조회수)",
          "총 N개 / 카테고리 / 검색어 인디케이터",
          "피처 칼럼 1건 + 보조 4건(홈)",
        ],
        techSpec: "`BGNJ_COLUMNS.searchPublic({query, category})` → `BGNJ_COLUMNS.listPublic()`(자동 promote 후 published만) + 검색 필터. 시드 + 사용자 발행 모두 동일 객체 형태.",
        caution: "검색은 본문 텍스트 기준이며 HTML 태그는 비교에서 제외됨 (`body.text`).",
        issues: [],
      },
      {
        name: "칼럼 상세 — 본문 / 공감 / 공유 / 댓글",
        status: "구현됨",
        summary: "제목·메타·본문·공감·공유 링크·댓글 흐름을 단일 페이지에서 처리.",
        elements: [
          "제목 / 카테고리 / 날짜 / 추정 읽기 시간(자동) / 조회 / 공감 / 댓글 카운트",
          "본문 HTML(에디터 직렬화 결과 또는 시드 fallback)",
          "♥ 공감 토글(로그인 사용자별, 시드 칼럼도 가능)",
          "공유 링크 복사(`#col-{id}` 해시 포함, 클립보드 + 토스트)",
          "댓글 등록 / 삭제(작성자·관리자) / 등급 배지",
          "이전·다음 칼럼 네비게이션",
        ],
        techSpec: "`BGNJ_COLUMNS.getColumn / getLikes / hasLiked / toggleLike / getViews / incrementViews / listComments / addComment / deleteComment`. 좋아요·조회수는 `BGNJ_STORES.columnEngagement` 맵에 통합 저장. 댓글은 `BGNJ_COMMUNITY.comments`를 `col-{id}` 키로 재사용.",
        caution: "관리자가 임의 HTML을 넣을 수 있으므로 에디터 정책으로 차단. 사용자 입력에는 절대 dangerouslySetInnerHTML 적용 금지.",
        issues: [
          "Tiptap 본문이 HTML로 직렬화되어 저장되므로 어떤 확장이 활성화돼 있는지를 같이 관리해야 함",
          "라우팅이 글로벌 App 상태에 묶여 있어 외부 진입은 `sessionStorage.bgnj_pending_column_id` + `#col-{id}` 해시 조합 사용",
        ],
      },
      {
        name: "관리자 칼럼 작성 — 임시 저장 / 예약 발행 / 즉시 발행 / 발행 취소 / 수정",
        status: "구현됨",
        summary: "Tiptap 에디터에 임시 저장·예약 발행·즉시 발행 흐름을 붙이고, 기존 칼럼을 수정 폼으로 다시 불러오기.",
        elements: [
          "Tiptap StarterKit + Image + Link + Typography (column preset)",
          "카테고리 select",
          "발췌 textarea(비우면 본문 앞부분 자동 추출)",
          "예약 시각(datetime-local)",
          "추정 읽기 시간 + 본문 자수 미터",
          "버튼: 초기화 / 임시 저장 / 예약 발행 / 즉시 발행",
          "필터(전체/발행/예약/임시) + 상태 배지(DRAFT/SCHEDULED/PUBLISHED) + 수정 / 발행 취소 / 삭제",
        ],
        techSpec: "`BGNJ_COLUMNS.saveColumn(payload)` — `id`(신규/기존 동일 키), `status`('draft'|'scheduled'|'published'), `publishAt`(예약 시), `publishedAt`(즉시 발행 시), `updatedAt` 자동. 페이지 진입마다 `_autoPromote()`가 시간 지난 예약을 published로 승격.",
        caution: "예약 시각은 현재보다 미래여야 하며, datetime-local은 로컬 타임존을 그대로 저장하므로 운영자 PC 시계 기준으로 동작함을 명심.",
        issues: ["발행 취소는 임시 저장 상태로 되돌리며, 칼럼 콘텐츠는 보존되지만 공개에서는 즉시 사라짐"],
      },
      {
        name: "홈 추천 칼럼",
        status: "구현됨",
        summary: "메인 홈에 published 사용자 칼럼 + 시드를 묶어 피처 1 + 사이드 4 노출.",
        elements: ["피처 카드 1", "사이드 4건"],
        techSpec: "`BGNJ_COLUMNS.listPublic()`의 상위 항목 사용. draft/scheduled은 자동 제외.",
        caution: "추천 알고리즘이 없어 항상 최신 5건이 노출됨.",
        issues: [],
      },
    ],
    techSpec: "BGNJ_COLUMNS helper + D1.user_columns (likes_json / views_count / status / publish_at / published_at) + site_content_kv.columnCategories + BGNJ_COMMUNITY.comments (col-{id} 키). 시드는 BANGINOJA_DATA.columns 머지.",
    cautions: [
      "본문 HTML 신뢰 범위 'admin 입력' 만 — Tiptap sanitize 의존",
      "예약 발행 promote 가 클라이언트 진입 시점에 실행 — 서버 크론 부재로 사용자 진입 안 하면 공개 지연",
      "v00.198 워커 list endpoint 60s CDN 캐시 — admin 분기는 캐시 안 함",
    ],
    issues: [
      "Tiptap 확장 변경 시 기존 본문 호환성 — 새 확장 추가 시 회귀 테스트",
      "예약 promote 클라이언트 시점 의존 — 향후 워커 cron trigger 로 이전 후보",
      "v00.184 — useModalGuard 도입 (focus trap + 외부 클릭 임시저장 prompt + Esc 닫기)",
    ],
  },
  {
    id: "tour",
    number: "04",
    label: "투어 프로그램",
    title: "미션 4 — 뱅기노자 투어 프로그램 판매·운영",
    role: "뱅기노자가 진행하는 궁궐 답사·역사 답사 프로그램을 신청·운영.",
    routes: ["tour(목록·상세·예약)", "home(노출)", "mypage(내 답사 내역)", "admin > 투어 프로그램(운영 명단)", "admin > 설정(계좌번호)"],
    status: "프로덕션 운영",
    evaluation: "Cycle 5 이후 워커 + D1 마이그레이션. 투어 CRUD + 회원 전용 신청 → 무통장 입금 → 관리자 입금 확인 → 참가 확정 + 정원 · 대기열 · 자동 승격 + 후기 + .ics + 커버 이미지 R2 + 다중 계좌 + 답사 일정 / 준비물 에디터(TourPageEditorPanel) + 투어별 페이지 카피 모두 D1 운영. 강연과 helper / 계좌 패턴 공유.",
    missing: [
      "PG 결제 (현재 무통장 입금만)",
      "환불 · 취소 정책 자동화",
      "체크인 / 출석 이력",
      "이미지 갤러리 (현재 카드 한 장)",
      "지도 / 집결지 안내 / 우천 시 운영 정책 카탈로그",
      "외국어 안내 (영문) 옵션",
      "이메일 / 문자 알림 (현재 사이트 내 ◇ 벨만)",
      "후기 사진 첨부",
    ],
    features: [
      {
        name: "투어 목록 / 탭 / 잔여 좌석 표시",
        status: "구현됨",
        summary: "프로그램별 탭 + 카드형 목록. 잔여석/대기 인원이 실시간 계산.",
        elements: [
          "탭(프로그램명 분리) / 강조",
          "상세(기간 · 인원 · 난이도 · 다음 일정 · 가격 · 설명 · 답사 일정 · 준비물)",
          "FREE / 무통장 입금 배지",
        ],
        techSpec: "`BGNJ_TOURS.listAll()` (시드 + `BGNJ_STORES.tourOverrides` 머지). 잔여는 `getSeats(tourId)`로 즉시 계산.",
        caution: "기존 시드의 `group` 텍스트('12인 이하')와 신규 `capacity` 숫자가 분리되어 있으니 운영자는 capacity 수정에 주의.",
        issues: [],
      },
      {
        name: "투어 신청 — 무료 즉시 확정 / 유료 무통장 입금",
        status: "구현됨",
        summary: "회원 전용. 정원이 남으면 무료는 즉시 confirmed, 유료는 pending_payment. 정원이 차면 waitlist 자동 등록.",
        elements: [
          "이름 / 이메일 / 연락처 / 인원 / 메모 폼(사이드바)",
          "합계 표시 + 정원 부족 시 대기자 안내",
          "본인 상태 카드(취소 / .ics 다운로드 + 무통장 입금 안내)",
          "비로그인 시 회원가입 진입 안내",
        ],
        techSpec: "`BGNJ_TOURS.reserve(tourId, payload)`. `hasUserReserved`로 중복 방지. 취소 시 `_promoteWaitlist`가 자동 실행되어 대기자 자동 승격(승격 시 본인에게 알림 푸시).",
        caution: "한 회원 = 한 투어 = 한 건. 취소 후 재신청은 가능. 인원은 1~capacity 범위.",
        issues: ["기존 시드 `group` 텍스트는 운영 정원과 무관 — 관리자 투어 탭에서 capacity를 직접 관리할 것"],
      },
      {
        name: "관리자 입금 확인 → 참가 확정",
        status: "구현됨",
        summary: "관리자 콘텐츠 메뉴 `투어 프로그램` 탭에서 신청 명단을 보고 입금 확인 / 확정 취소 / 신청 취소.",
        elements: [
          "투어별 헤더(잔여 / 대기 / 가격)",
          "투어 정보 수정(제목·일정·소요·정원·가격·메모·설명)",
          "참가자 표(이름·이메일·연락처·인원·상태·입금 여부)",
          "액션: `입금 확인 → 확정` / `확정 취소` / `취소`",
        ],
        techSpec: "`BGNJ_TOURS.confirmPayment / unconfirmPayment / cancelReservation`. 확정 시 본인에게 자동 알림 푸시.",
        caution: "확정 취소 후 좌석은 즉시 풀려 다음 대기자가 자동 승격됨. 환불 후에만 누를 것.",
        issues: [],
      },
      {
        name: "마이페이지 내 답사 신청",
        status: "구현됨",
        summary: "로그인 사용자에게 본인이 신청한 답사를 상태별 카드 리스트로 노출.",
        elements: [
          "프로그램 / 다음 일정 / 인원 / 상태(입금 대기 / 참가 확정 / 대기자 / 취소)",
          "카드 클릭 → 투어 상세로 이동",
          "최대 4건 + '외 N건'",
        ],
        techSpec: "`BGNJ_TOURS.listMyReservations(user.id)`로 모든 투어를 가로지르며 본인 신청만 모음. 점프는 `sessionStorage.bgnj_pending_tour_id` 패턴 사용.",
        caution: "투어가 삭제되면 카드의 투어 정보가 비어 보일 수 있음.",
        issues: [],
      },
      {
        name: ".ics 캘린더 다운로드",
        status: "구현됨",
        summary: "투어 시작 시각·소요 시간·장소·설명을 담은 표준 .ics 파일 다운로드.",
        elements: ["투어 사이드바 `캘린더에 추가 (.ics)` 버튼", "본인 상태 카드에서도 가능"],
        techSpec: "`BGNJ_TOURS.generateIcs(tour)` → RFC 5545 형식. `downloadIcs(tourId)`가 Blob을 만들어 클릭 다운로드.",
        caution: "`startsAt` ISO + `durationMinutes`가 있어야 정상 생성됨.",
        issues: [],
      },
      {
        name: "URL 해시 딥 링크 / 마이페이지 점프",
        status: "구현됨",
        summary: "`#tour-{id}`로 투어 상세를 외부 공유. 마이페이지·알림에서 sessionStorage 경유로 점프.",
        elements: ["App `applyHash`가 `#tour-{id}` 매칭 시 `tour` 라우트 + sessionStorage 셋"],
        techSpec: "`index.html` App `useEffect` 라우트 해시 + `sessionStorage`. TourPage mount에서 pending id 읽고 selectedIdx 복원.",
        caution: "라우트가 글로벌 App 상태에 묶여 있어 외부 진입은 sessionStorage 패턴을 그대로 따른다.",
        issues: [],
      },
    ],
    techSpec: "BGNJ_TOURS helper + D1.tours / D1.tour_reservations / D1.tour_reviews / D1.bank_accounts / D1.notifications + R2 tour-covers/ + site_content_kv.tourCopy / tourPages. 워커 핸들러 ~15종. 결제 분기 priceNumber === 0.",
    cautions: [
      "회원 전용 — 비로그인 진입 자체 막음",
      "결제는 무통장 입금만",
      "정원 / 대기열은 워커 트랜잭션 + 자동 승격",
      "강연 · 책과 D1.bank_accounts 공유",
    ],
    issues: [
      "기존 seed group 텍스트는 capacity 와 별도 — 자동 동기화 미지원",
      "예약 시각이 운영자 PC 시계 기준 — 향후 워커 측 timezone 명시 권장",
    ],
  },
  {
    id: "book",
    number: "05",
    label: "왕의길",
    title: "미션 5 — 뱅기노자 책 판매",
    role: "뱅기노자의 책 『왕의길』을 소개하고 회원 전용 무통장 입금으로 판매·발송 운영.",
    routes: ["book(상세)", "checkout(주문)", "home(CTA)", "mypage(내 주문 내역)", "admin > 왕의길(주문 운영)", "admin > 설정(계좌번호)"],
    status: "프로덕션 운영",
    evaluation: "v00.153 다권화 이후 BGNJ_BOOKS (D1.books + R2 book-covers / book-pdfs) 가 정식 source. 회원 전용 무통장 입금 → 관리자 입금 확인 → 발송(송장) → 배송 완료 + 환불 신청 + 다중 계좌 + 책별 후기 + admin BooksAdminPanel 의 신규 책 추가/순서/primary 토글 + v00.199 노출 필드 선택까지. PG 결제·재고가 큰 결손.",
    missing: [
      "결제 게이트웨이 (PG) 연동",
      "재고 관리 / 품절 표시",
      "영수증 / 세금계산서 발행",
      "환불 자동 흐름 (현재는 환불 신청 status 만, 실제 환급은 수동)",
      "교차 판매 (투어 / 강연 패키지)",
      "쿠폰 / 회원 등급 할인",
      "장바구니 영속성 (현재 메모리 — 결제 진입 직전까지만)",
      "이메일 영수증 / 발송 알림",
      "독자 리뷰 사진 첨부",
    ],
    features: [
      {
        name: "책 상세",
        status: "구현됨",
        summary: "책 한 권의 모든 메타 정보를 한 화면에서 노출 + 판본·수량 선택 후 결제로 진입.",
        elements: [
          "표지 / 저자 / 출판사 / ISBN / 페이지 수",
          "국문 / 영문 가격, 판본 토글, 수량 ±",
          "챕터 목차 / 저자 / 리뷰 탭",
          "바로 구매 → 체크아웃 라우트로 이동",
        ],
        techSpec: "`BANGINOJA_DATA.book` 정적 객체를 `BookPage`가 렌더. 판본/수량은 메모리 `cart` 상태로 보관 후 결제 페이지에 전달.",
        caution: "ISBN과 가격은 정적이라 출판사 정책 변경 시 코드 갱신 필요.",
        issues: [],
      },
      {
        name: "체크아웃 — 회원 전용 + 무통장 입금 단일 흐름",
        status: "구현됨",
        summary: "비회원은 차단되고, 회원은 배송 정보 입력 후 주문 접수. 결제 수단은 무통장 입금만.",
        elements: [
          "비로그인 안내 카드(로그인/회원가입 진입)",
          "받는 분 / 연락처 / 주소 / 상세 주소 / 배송 메모",
          "결제 수단 카드 — 무통장 입금 안내 + 운영자 계좌(없으면 차단)",
          "주문 요약 사이드바(상품·배송비·총액·운영 안내)",
          "주문 완료 화면(주문번호·계좌·금액·배송지 한 페이지 요약)",
        ],
        techSpec: "`BGNJ_BOOK_ORDERS.createOrder({userId, version, qty, recipient, phone, address, addressDetail, memo})` → 주문 생성 시 `BGNJ_STORES.bookOrders`에 push. 계좌는 `BGNJ_LECTURES.getBankAccount()`로 강연과 공유. 주문번호는 `WSD-YYYYMMDD-NNN` 시퀀스.",
        caution: "운영자 계좌가 비어 있으면 주문 버튼이 비활성화되어 결제 자체가 막힌다. 강연과 같은 계좌 저장소이므로 강연·책 어느 한 곳에서 설정해도 양쪽에 반영됨.",
        issues: ["장바구니가 휘발성 메모리이므로 결제 진입 후 새로고침하면 cart가 사라짐 — 다음 단계에서 localStorage 영속화 예정"],
      },
      {
        name: "관리자 왕의길 운영 (콘텐츠 > 왕의길 탭)",
        status: "구현됨",
        summary: "주문 상태별 필터 + 입금 확인 / 송장 입력 / 발송 / 배송 완료 / 취소 + CSV 다운로드.",
        elements: [
          "필터(입금 대기/입금 확인/배송중/배송 완료/취소/전체) + 카운트",
          "주문 카드(주문번호·시각·상태 배지·상품·금액·받는 분·주소)",
          "액션: 입금 확인 → 발송 준비 / 송장 입력 + 발송 처리 / 배송 완료 / 입금 확인 취소 / 주문 취소",
          "CSV 다운로드(주문 / 회원 / 주소 / 상태 / 송장)",
        ],
        techSpec: "`BGNJ_BOOK_ORDERS.confirmPayment(id) / unconfirmPayment(id) / markShipped(id, tracking) / markDelivered(id) / cancelOrder(id) / exportCsv()`. 상태 머신: pending_payment → paid → shipped → delivered (혹은 cancelled).",
        caution: "각 단계는 운영자가 직접 클릭해야 진행됨(자동 진행 없음). 송장 번호는 발송 시 입력하고 이후 변경 불가(필요 시 코드 수정 또는 마지막 액션 reset 흐름 추가).",
        issues: [],
      },
      {
        name: "마이페이지 내 주문 내역",
        status: "구현됨",
        summary: "로그인 사용자에게 자신의 주문을 상태별 컬러 라벨로 표시.",
        elements: [
          "주문번호 / 판본 / 수량 / 총액 / 상태(입금 대기·입금 확인·배송중·배송 완료·취소)",
          "송장 번호(발송된 주문)",
          "최대 4건 + '외 N건'",
        ],
        techSpec: "`BGNJ_BOOK_ORDERS.listMine(user.id)`로 본인 주문만 모음.",
        caution: "주문이 cancelled 상태로 바뀌면 카드는 남되 컬러로 구분.",
        issues: [],
      },
      {
        name: "관리자 대시보드 카운트",
        status: "구현됨",
        summary: "관리자 대시보드 4개 KPI 중 마지막 슬롯을 '왕의길 주문'으로 교체. 입금 대기 건수 표시.",
        elements: ["전체 주문 수", "입금 대기 카운트(미처리 시 경고 색)"],
        techSpec: "`window.BGNJ_BOOK_ORDERS.listAll()` + 상태 필터.",
        caution: "필요 시 5번째 슬롯으로 카테고리/투어 등 다시 추가할 수 있음.",
        issues: [],
      },
    ],
    techSpec: "BGNJ_BOOKS helper + BGNJ_BOOK_ORDERS helper + D1.books / D1.book_orders / D1.book_reviews / D1.bank_accounts + R2 book-covers/ + R2 book-pdfs/. 주문번호 WSD-YYYYMMDD-NNN. 회원 식별 user.id. v00.199 site_content_kv.bookFieldVisibility 로 책별 노출 필드 선택.",
    cautions: [
      "회원 전용 — 비로그인 결제 진입 자체 막음",
      "결제는 무통장 입금만",
      "강연 · 투어와 D1.bank_accounts 공유",
      "주문 상태 운영자 직접 진행 — 입금 확인은 admin 콘솔에서만",
      "재고 차감 미적용 — 판매 수량 무관 주문 계속 생성",
      "표지 / PDF 는 R2 — D1 에는 cover_key / pdf_key 만, BGNJ_MEDIA.resolveUrl 로 라이브 URL 변환",
    ],
    issues: [
      "장바구니 메모리 휘발성 — 다음 사이클 localStorage 영속화 후보",
      "국문 / 영문 가격 분리 — PG 도입 시 통화별 계약 동시 진행",
      "환불 자동 흐름 미적용 — refund_requested status 변경만",
    ],
  },
];

// v00.070 — 외부 스크립트(AuthAdminPage)에서 사용할 수 있도록 window 에 노출.
Object.assign(window, {
  ADMIN_VERSION_HISTORY,
  ADMIN_DESIGN_SECTIONS,
  MISSION_OVERVIEW,
  FEATURE_DOMAINS,
  DesignSystemView,
});

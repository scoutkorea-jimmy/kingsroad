# 디자인 규칙

> **폐기 고지 (v00.288).** 이전 `ai-development-rules.md` 에 있던 "조선 왕실의 분위기 / 다크 기반의
> 프리미엄 톤 / 절제된 금색" 서술은 **폐기됐습니다.** 현행 브랜드는 라이트 기반이고, 조선 왕실 도상
> 차용은 브랜드 분리와 함께 종료됐습니다. 이 문서와 `docs/kms.md` 탭2 가 현행 기준입니다.

실측 토큰 값은 [../design/tokens.md](../design/tokens.md), 컴포넌트 스펙은 [../design/components.md](../design/components.md).

---

## 1. 브랜드 무드

- **"뱅기 타고 한국을 느끼다"** — 한국의 역사·문화·자연을 함께 여행하는 커뮤니티가 코어.
- 톤은 **절제 · 신뢰 · 여행자의 시선.** 과한 동양풍 장식 대신 깔끔한 편집 디자인을 우선합니다.
- 화려함보다 가독성과 신뢰감. 운영자 화면은 작업 효율을, 사용자 화면은 감성 전달과 안심감을 냅니다.

## 2. 컬러 — Primary/Secondary/Tertiary v2 (5:25:70)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--primary` | `#F5D548` | 로고 옐로우. **5% 면적** — CTA · focus ring · 활성 dot · 인터랙션 상태 **에만** |
| `--primary-hover` | `#E5BF2E` | hover 한 단 깊게 |
| `--primary-active` | `#C99E1A` | active / focus ring (= `--focus`) |
| `--primary-dim` | `#FDE68A` | 미세 강조 · border tint |
| `--on-primary` | `#0F172A` | primary 위 텍스트 (대비 보장) |
| `--secondary` | `#92400E` | Caramel Ink — 링크 · 서브 강조 (15~25% 면적) |
| `--secondary-hover` | `#7C2D12` | |
| `--tertiary` | `#475569` | Slate 600 — 부가 위계 |

- **Neutral 이 70% 이상**을 차지합니다 — `--bg` / `--bg-2` / `--bg-3` 배경 + `--ink` / `--ink-2` / `--ink-3` 텍스트.
- System: `--success #16A34A` · `--warning #D97706` · `--info #2563EB` · `--danger #DC2626`.
  위험·삭제는 반드시 `var(--danger)`.
- 다크 모드는 `:root[data-theme="dark"]` 가 Neutral/Text/System 만 슬레이트로 교체합니다.
  **Primary 옐로우는 그대로 유지** — 브랜드 시그니처입니다.

## 3. 타이포그래피

- 디스플레이·제목: **KBL Jump 패밀리** (`--font-display: KblJumpExtended`, `--font-title: KblJump`)
- 본문: **Wanted Sans Variable** (`--font-sans` · `--font-reading`) — 한글 가독성 + variable weight
- 명조 토글: **ChosunIlboMyungjo** — `.app.reading-myungjo` 가 본문을 명조로 교체
- 운영 라벨·메타·ID: **IBM Plex Mono** (`--font-mono`) + 자간 0.1~0.2em
- 기본 `font-weight: 500`. `.nav-link` 14px/500 · `.section-eyebrow` 600 · `.field-label` 600
- 모바일 본문 (`.post-body`, ≤600px): 17px / line-height 1.85 / `word-break: keep-all`

한 화면에서 제목·본문·메타가 시각적으로 분명히 갈려야 합니다.

## 4. 레이아웃

- 여백은 넉넉하게. 카드·섹션은 편집 디자인 격자감으로 정렬합니다.
- **모바일 ≤900px: 무조건 1단.** 모든 다열 그리드는 `grid-template-columns: 1fr` 폴백이며
  인라인 grid 도 `!important` 로 덮습니다. 인라인 `gridTemplateColumns` 를 쓸 때는
  `.grid-feature-2` / `.book-grid` / `.cta-grid` 같은 클래스를 함께 부여합니다.
- ≤600px: 헤더 64px · container padding 16px · 터치 타겟 44px 이상.
- Sticky 카드는 **데스크톱 전용.** 모바일에서는 `.book-cover-col` / `.mobile-release-sticky` 로
  `position: static` 강제 (v00.221/v00.224 — 사용자 민원 누적 결과).
- 관리자 콘솔은 좌측 사이드바 8개 대카테고리 + 우측 작업 영역. 모바일에선 사이드바가 drawer.

## 5. 컴포넌트

- 주요 행동: `btn btn-gold` (클래스명은 legacy, 색상은 `--primary` 토큰)
- 일반 행동: `btn` 또는 `btn btn-small` / 보조: `btn-ghost`
- 위험 행동: `borderColor: var(--danger)`, `color: var(--danger)`
- 칩(필터 탭): pill (`borderRadius: 999`), 활성 시 옐로우 border + `rgba(245,213,72,0.06)` 배경, 항목별 카운트 동행
- **카드는 테두리선 대신 부드러운 그림자** — `border` 없이 `border-radius: 12` +
  `0 1px 2px / 0 6px 20px rgba(15,23,42,0.05)`, hover 시 살짝 떠오름.
  섹션 구분도 가로선 대신 교차 배경(흰색 ↔ `--bg-2`) + 여백으로.
- 배지·라벨은 짧고 명확하게 — `숨김` `대기` `확정` `초안`
- 아이콘은 라인아트 SVG. 이모지는 보조용.

## 6. 인터랙션

- 애니메이션은 과하지 않게. `prefers-reduced-motion` 지원.
- hover/focus/active 는 명확하되 시끄럽지 않게. 버튼 hover 시 `translateY(-1px)` + subtle shadow.
- 관리자 화면은 탐색성·작업 효율 우선, 사용자 화면은 감성 전달·신뢰감 우선.

## 7. 접근성

- 모든 인터랙티브 요소는 키보드 포커스 가능 + `aria-label` 또는 텍스트 라벨.
  focus-visible 은 2px solid `--focus`.
- 탭·필터 칩은 `role="tab"` + `aria-selected`.
- 다이얼로그는 `role="dialog"` + `aria-modal` + `aria-labelledby` + `useModalGuard`
  (ESC / 외부 클릭 / 포커스 트랩).
- **색상만으로 상태를 구분하지 않습니다** — 아이콘이나 텍스트 라벨을 동행시킵니다.
- 대비는 WCAG AA (텍스트 4.5:1) 이상. forced-colors 모드 기본 지원.

## 8. 디자인 금지

1. **옐로우를 면적으로 깔지 않습니다.** `background: var(--primary)` 같은 넓은 영역, eyebrow,
   라벨 배경 모두 금지. Primary 는 인터랙션 상태 전용입니다.
2. 보라색 계열을 브랜드 주색처럼 쓰지 않습니다.
3. 과한 그라데이션·유행성 마이크로 인터랙션을 남발하지 않습니다.
4. 일월오봉도·조선 왕실 도상 직접 차용 표현을 쓰지 않습니다 (브랜드 분리 완료).
5. **테두리선 남발 금지** — `1px solid var(--line)` 으로 박스를 두르지 않습니다.
   경계는 그림자·여백·배경 대비로. 폼 입력창과 focus ring 등 기능상 필요한 것만 남깁니다.
6. 레거시 컬러 토큰 (`--gold*` / `--cta-*`) 신규 사용 금지.

## 9. 알려진 예외 — 판단이 끝난 것

새로 논쟁하지 마세요. 아래는 검토를 마치고 **그대로 두기로 결정한** 것입니다.

| 위치 | 지적 | 판단 |
|---|---|---|
| `pages/HomePage.jsx` 칼럼 캐러셀 인디케이터 | `transition: width` — 레이아웃 애니메이션 | **유지.** 8px 점이 22px 알약으로 늘어나는 표현이라 `transform: scaleX` 로 바꾸면 `border-radius:999` 의 둥근 양 끝이 찌그러진다. 8px 단일 요소라 레이아웃 비용도 사실상 없다 |
| 프로그레스 바 3곳 · CTA 버튼 · 로고 마크 · 알림 배지 dot | 옐로우 배경 사용 | **유지.** 규칙이 명시적으로 허용하는 "CTA·focus·로고·active dot" 그대로다 → [10-coding.md](10-coding.md) |
| `ErrorPages.jsx` · `boot.jsx` 의 하드코딩 hex | 토큰 대신 `#F5D548` 직접 사용 | **유지.** ErrorBoundary 안이라 CSS 로드가 실패한 상황에서도 렌더돼야 한다. 의도적 선택 |

## 10. 이 문서를 고칠 때

디자인 결정이 바뀌면 **세 곳을 함께 갱신합니다** — 이 문서 · [../design/tokens.md](../design/tokens.md) ·
`pages/admin/AdminDesignHub.jsx` 의 Design System View.
하나만 고치면 나머지가 즉시 레거시가 됩니다. 셋 중 하나라도 빠진 커밋은 같은 작업으로 보지 않습니다.

# 디자인 토큰 — 실측값

> **단일 소스는 `styles.css` 의 `:root` 입니다.** 이 문서는 그 실측 사본이며, 사람이 읽기 위한 것입니다.
> 값을 바꿀 때는 `styles.css` → 이 문서 → `rules/20-design.md` → `AdminDesignHub.jsx` 를 함께 갱신합니다.
> 실측 기준: [styles.css:105](../styles.css#L105) · 2026-07-29 · v00.288.003

---

## 컬러

### Primary — 5% 면적, 인터랙션 상태에만

| 토큰 | 값 | 용도 |
|---|---|---|
| `--primary` | `#F5D548` | 로고 옐로우. CTA · focus · 활성 dot |
| `--primary-hover` | `#E5BF2E` | Honey Amber |
| `--primary-active` | `#C99E1A` | Deep Amber |
| `--primary-dim` | `#FDE68A` | 옅은 옐로우 — 미세 강조 |
| `--on-primary` | `#0F172A` | primary 위 텍스트 |

### Secondary / Tertiary — 15~25% 면적

| 토큰 | 값 | 용도 |
|---|---|---|
| `--secondary` | `#92400E` | Caramel Ink — 링크·강조 |
| `--secondary-hover` | `#7C2D12` | 한 단 깊게 |
| `--tertiary` | `#475569` | Slate 600 — 부차 강조 |

### Neutral — 70% 이상

| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg` | `#FFFFFF` | 페이지 베이스 (가장 큰 면적) |
| `--bg-2` | `#F8FAFC` | 서브 배경 · 카드 |
| `--bg-3` | `#F1F5F9` | 입력 · 코드 배경 |
| `--line` | `#E5E7EB` | 기본 라인 |
| `--line-2` | `#D1D5DB` | 진한 라인 |
| `--ink` | `#0F172A` | 1차 — 제목 · 본문 |
| `--ink-2` | `#334155` | 2차 — 보조 텍스트 |
| `--ink-3` | `#64748B` | 3차 — 메타 · 라벨 · placeholder |

### System

| 토큰 | 값 | 용도 |
|---|---|---|
| `--success` | `#16A34A` | 성공 · 확정 |
| `--warning` | `#D97706` | 주의 (primary 와 명도로 구분) |
| `--info` | `#2563EB` | 정보 · 안내 |
| `--danger` | `#DC2626` | 에러 · 삭제 · 거부 |
| `--focus` | `#C99E1A` | focus ring (= `--primary-active`) |

다크 모드(`:root[data-theme="dark"]`)는 Neutral / Text / System 만 슬레이트로 교체합니다.
**Primary 옐로우는 유지** — 브랜드 시그니처입니다.

> **정리 대상:** `--gold-strength: 1` 은 사용처가 없습니다 ([styles.css:94](../styles.css#L94) 주석에도
> "다음 사이클 제거" 로 표시). 다음에 이 파일을 만질 때 함께 제거합니다.

---

## 타이포그래피

| 토큰 | 스택 | 용도 |
|---|---|---|
| `--font-display` | `KblJumpExtended` → `KblJump` → Wanted Sans | 대제목 · 히어로 |
| `--font-title` | `KblJump` → `KblJumpExtended` → Wanted Sans | 소제목 · 카드 타이틀 |
| `--font-hero` | `KblJumpExtended` → Wanted Sans | 히어로 전용 |
| `--font-serif` | `KblJump` → Noto Serif KR | 세리프 표현 |
| `--font-sans` | `Wanted Sans Variable` → Wanted Sans → Noto Sans KR → system | 본문 기본 |
| `--font-mono` | `IBM Plex Mono` → D2 Coding | 라벨 · 메타 · ID |
| `--font-reading` | `var(--font-sans)` | 읽기 모드 |

**가중치 기준** — `html, body` 기본 500 · `.nav-link` 14px/500 · `.section-eyebrow` 600 ·
`.field-label` 600 · `.footer h4` 600 · `.mono` 500 · `.mono.dim-2` 600.

**본문(≤600px)** — `.post-body` 17px / line-height 1.85 / `word-break: keep-all`.

### 타입 스케일 — 현황 실측 (아직 토큰화 안 됨)

`styles.css` 에 `font-size` 선언이 **103개 / 20종**으로 흩어져 있습니다 (2026-07-29 실측).

| px | 선언 수 | | px | 선언 수 |
|---|---|---|---|---|
| 48 | 1 | | 15 | 4 |
| 42 | 1 | | 14 | 8 |
| 32 | 2 | | 13 | 12 |
| 30 | 2 | | 12.5 | 1 |
| 28 | 3 | | 12 | 15 |
| 26 | 2 | | 11 | 21 |
| 22 | 5 | | 10 | 13 |
| 20 · 19 · 18 · 17 · 16 | 11 | | 9 | 2 |

10·11·12·13 네 종이 61개로 절반 이상입니다 — 실질적으로 같은 위계를 미세하게 다르게 쓰고 있다는 뜻입니다.
`--fs-*` 커스텀 프로퍼티로 모아야 하지만, **103곳 치환은 시각 회귀 테스트 없이 하기 위험**해서
아직 하지 않았습니다. 인벤토리만 남겨둡니다.

작업할 때 권장 순서 — ① 10/11/12/13 을 2단계로 통합할지 먼저 결정 ② `--fs-meta`/`--fs-body`/
`--fs-title` 등 이름을 정하고 `:root` 에 추가 ③ 블록 단위로 치환하며 매 블록마다 화면 확인.

---

## 형태

| 요소 | 반경 | 그림자 |
|---|---|---|
| `.card` | `12px` | `0 1px 2px rgba(15,23,42,.05), 0 6px 20px rgba(15,23,42,.05)` |
| `.card:hover` | | `0 2px 8px rgba(15,23,42,.08), 0 14px 36px rgba(15,23,42,.09)` |
| `.btn` | `8px` | `0 1px 2px rgba(15,23,42,.04)` |
| 칩 · pill | `999px` | — |

**카드에 `border` 를 주지 않습니다.** v00.272 에서 "테두리선이 촌스럽다"는 사용자 피드백으로 제거됐고,
경계는 그림자·여백·배경 대비로 표현합니다. `.card--bare` 는 배경·그림자까지 뺀 modifier로,
사진이 시각 주체인 카드에 씁니다.

**버튼** — `padding: 14px 28px` · `font-size: 13px` · `letter-spacing: .12em` · `text-transform: uppercase` ·
hover 시 `translateY(-1px)` + shadow lift. transition 은 `.2s cubic-bezier(.2,.7,.2,1)`.

---

## 브레이크포인트

| 폭 | 규칙 |
|---|---|
| ≤ 900px | **다열 그리드 전부 1단.** 인라인 grid 도 `!important` 로 덮음 ([styles.css:1522](../styles.css#L1522)) |
| ≤ 600px | 헤더 64px · container padding 16px · 터치 타겟 44px+ ([styles.css:1719](../styles.css#L1719)) |

Sticky 카드는 데스크톱 전용입니다 — 모바일에서 `.mobile-release-sticky` 등으로 `position: static` 강제.

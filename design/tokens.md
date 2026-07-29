# 디자인 토큰 — 실측값

> **단일 소스는 `styles.css` 의 `:root` 입니다.** 이 문서는 그 실측 사본이며, 사람이 읽기 위한 것입니다.
> 값을 바꿀 때는 `styles.css` → 이 문서 → `rules/20-design.md` → `AdminDesignHub.jsx` 를 함께 갱신합니다.
> 실측 기준: [styles.css:59](../styles.css#L59) · 2026-07-29 · **v00.293.000 전면 재디자인(D안 · 라이트톤)**

---

## 이번 개편의 핵심

**옐로우를 UI 에서 걷어내고 로고 전용으로 되돌렸습니다.**
`--primary` 를 옐로우가 아니라 **잉크**로 재정의해, 기존 코드(`.btn-gold` · focus ring · active dot 등
100곳 이상)를 클래스명 변경 없이 한 번에 뒤집었습니다. 로고는 SVG 에 `#F5D548` 이 하드코딩돼 있어
토큰과 무관하게 옐로우로 남습니다.

| | 이전 (v00.292) | 현재 (v00.293) |
|---|---|---|
| 바탕 | 순백 `#FFFFFF` | 종이빛 `#F5F3EF` |
| CTA | 옐로우 `#F5D548` | 잉크 `#1B1C1F` |
| 디스플레이 | KBL Jump (굵은 고딕) | **조선일보명조** |
| 모서리 | 12px / 8px | **2px** |
| 카드 경계 | 그림자 | **배경 차이 + 여백** |
| 시스템색 | 형광에 가까움 | 채도 낮춤 |

---

## 컬러

### Primary = 잉크 (CTA · focus · 활성 상태)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--primary` | `#1B1C1F` | CTA 배경 |
| `--primary-hover` | `#34363B` | |
| `--primary-active` | `#4A4C52` | focus ring (= `--focus`) |
| `--primary-dim` | `#E2DFD8` | 옅은 tint → 선 톤 |
| `--on-primary` | `#F5F3EF` | 잉크 위 텍스트 |
| **`--brand`** | **`#F5D548`** | **로고 전용. UI 에서 쓰지 않는다** |

### Secondary / Tertiary

`--secondary` `#5A5C63` (링크·서브 강조) · `--secondary-hover` `#34363B` · `--tertiary` `#8A8C93`

### Neutral — 종이빛. 순백을 쓰지 않는다

| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg` | `#F5F3EF` | 페이지 바탕 |
| `--bg-2` | `#FFFFFF` | 올려진 면 (카드) |
| `--bg-3` | `#EAE7DF` | 들어간 면 · 입력 |
| `--line` | `#E2DFD8` | 구분선 |
| `--line-2` | `#D4D0C7` | 진한 선 |
| `--ink` | `#1B1C1F` | 제목 · 본문 |
| `--ink-2` | `#5A5C63` | 보조 |
| `--ink-3` | `#8A8C93` | 메타 |
| `--ink-4` | `#B0AFA8` | 라벨 · 마이크로 (v00.293 신설) |

### System — 채도를 낮춰 종이빛과 붙인다

`--success` `#2E6F4E` · `--warning` `#96631E` · `--info` `#35507A` · `--danger` `#A33A2E`

---

## 타이포그래피

| 토큰 | 스택 | 용도 |
|---|---|---|
| `--font-display` / `--font-title` / `--font-hero` / `--font-serif` | **ChosunIlboMyungjo** → Noto Serif KR | 제목 전부 |
| `--font-sans` | Wanted Sans Variable → Noto Sans KR | 본문 |
| `--font-mono` | IBM Plex Mono → D2 Coding | 라벨 · 날짜 · 숫자 |

셋 다 이미 로드 중이라 **추가 로딩이 없습니다** (명조·Wanted Sans 는 jsdelivr, Plex Mono 는 Google Fonts).

### 스케일 — 8단계 고정

`--fs-display` 122 · `--fs-h1` 29 · `--fs-h2` 22 · `--fs-h3` 18 ·
`--fs-body` 15 · `--fs-sm` 13 · `--fs-xs` 11.5 · `--fs-micro` 10

히어로는 `clamp(44px, 9.2vw, var(--fs-display))` 로 뷰포트에 비례해 꽉 채웁니다.

> **아직 치환 중.** `styles.css` 의 기존 `font-size` 선언 103개가 여전히 px 하드코딩입니다.
> 새 컴포넌트는 위 토큰을 쓰고, 기존 것은 손대는 김에 하나씩 옮깁니다.

---

## 여백 — 4 배수

`--s1` 4 · `--s2` 8 · `--s3` 12 · `--s4` 16 · `--s5` 24 ·
`--s6` 32 · `--s7` 48 · `--s8` 64 · `--s9` 96 · `--s10` 128

섹션 상하 여백은 데스크톱 `--s9`(96), 모바일 `--s7`(48).

---

## 형태

`--radius: 2px` — 카드·버튼 공통. 칩만 `999px`.

**그림자를 거의 쓰지 않습니다.** 경계는 배경 차이(`--bg` ↔ `--bg-2` ↔ `--bg-3`)와 여백으로 만듭니다.
그림자는 **떠 있는 것**(모달 · 토스트 · 드롭다운)에만 남깁니다.
v00.272 의 "카드 테두리선 금지"는 그대로 유지되고, 거기에 그림자까지 걷어낸 것입니다.

---

## 브레이크포인트

| 폭 | 규칙 |
|---|---|
| ≤ 900px | 다열 그리드 전부 1단 ([styles.css:1522](../styles.css#L1522)) |
| ≤ 600px | 헤더 64px · container padding 16px · 터치 타겟 44px+ |

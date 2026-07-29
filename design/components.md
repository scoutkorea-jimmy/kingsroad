# 컴포넌트 스펙

값의 출처는 [tokens.md](tokens.md), 지켜야 할 원칙은 [../rules/20-design.md](../rules/20-design.md).

---

## 버튼

| 클래스 | 용도 | 표현 |
|---|---|---|
| `btn btn-gold` | **주요 행동** (화면당 1개 권장) | `--primary` 배경 + `--on-primary` 텍스트 |
| `btn` | 일반 행동 | 투명 배경 + `--line-2` 테두리 |
| `btn btn-small` | 좁은 자리 | 패딩 축소 |
| `btn-ghost` | 보조 · 인라인 링크형 | 테두리 없음 |
| (위험) | 삭제 · 거부 | `borderColor: var(--danger)` + `color: var(--danger)` |

공통: `border-radius 8px` · `padding 14px 28px` · `13px` · `letter-spacing .12em` · uppercase ·
hover 시 `translateY(-1px)` + shadow lift.

**한 화면에 `btn-gold` 가 두 개 이상이면 위계가 무너진 것입니다.** 두 번째부터는 `btn` 이나 `btn-ghost` 로.

## 카드

- `.card` — `--bg-2` 배경 · `border-radius 12px` · `padding 32px` · **테두리 없음** · 부드러운 그림자.
  hover 시 그림자가 깊어지며 살짝 떠오릅니다.
- `.card--bare` — 배경·그림자 제거, 패딩만. 사진이나 콘텐츠가 시각 주체일 때.
- `.card-title` — `--font-title` 22px/700, `letter-spacing -0.01em`.
- `.card-meta` — `--font-mono` 11px, `--ink-3`, `letter-spacing .08em`.

섹션 구분도 가로 테두리선 대신 **교차 배경**(흰색 ↔ `--bg-2`)과 여백으로 만듭니다.

## 칩 (필터 탭)

- pill (`border-radius: 999px`)
- 활성: `--primary` 테두리 + `rgba(245,213,72,0.06)` 배경 — **면적을 채우지 않는 저채도 tint 입니다**
- 항목별 카운트를 함께 (`자유 12`)
- `role="tab"` + `aria-selected` 필수

## 배지 · 라벨

짧고 명확하게 — `숨김` `대기` `확정` `초안`.
색상만으로 상태를 구분하지 않고 텍스트를 함께 노출합니다.

## 폼

- 입력창은 **테두리를 유지합니다** (기능상 경계가 필요한 몇 안 되는 경우)
- 배경 `--bg-3`
- 라벨 `.field-label` weight 600
- focus 시 2px solid `--focus` ring

## 모달 · 다이얼로그

- `role="dialog"` + `aria-modal` + `aria-labelledby`
- `useModalGuard` — ESC · 외부 클릭 · 포커스 트랩
- 확인은 `window.BGNJ_CONFIRM()` (Promise), 알림은 `window.BGNJ_TOAST.error()`
- **`alert()` · `window.confirm()` 금지**

## 아이콘

라인아트 SVG (stroke-only). 이모지는 보조용으로만.

## 오류 표시

| 상황 | 위치 |
|---|---|
| 인증 흐름 | 폼 안 인라인 패널 |
| 그 외 비동기 오류 | 우하단 토스트 |
| 렌더링 오류 | 풀스크린 카드 (ErrorBoundary) |

네 가지를 함께 보여줍니다 — **코드 · 상태 · 정확한 사유 · 다음에 할 행동.**

## 빈 상태

**데이터가 없으면 섹션 자체를 렌더하지 않습니다.** "아직 없습니다" 카드를 띄우지 않습니다 —
처음 온 사람이 보는 첫 정보가 "없다"가 되면 안 됩니다.

예외: 사용자가 직접 만들 수 있는 영역(커뮤니티 글쓰기 등)에서는 행동 유도가 있는 빈 상태를 둘 수 있습니다.

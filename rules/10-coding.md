# 코딩 규칙

파일 위치를 찾고 있다면 [90-file-map.md](90-file-map.md) 로. 데이터를 다룬다면 [11-data-flow.md](11-data-flow.md) 로.

---

## 1. 차단 룰 4 — pre-commit 이 커밋을 막습니다

`tools/check-syntax.mjs` 의 `RULES` 배열([tools/check-syntax.mjs:89](../tools/check-syntax.mjs#L89))이 `@babel/parser` 로 전체 `.jsx`/`.js` 를 파싱하며 검사합니다.

| 룰 | 내용 | 예외 파일 |
|---|---|---|
| `BANGINOJA_DATA` | 시드 데이터 직접 참조 금지. `BGNJ_*` 헬퍼 경유 | `data.js` |
| `console_log` | production 노이즈 금지. `console.error` / `console.warn` 사용 | `data.js` · `api.js` |
| `var_keyword` | `let` / `const` 만 | 없음 |
| `direct_fetch` | `fetch(...)` 직접 호출 금지. `BGNJ_API` 사용 | `api.js` · `data.js` |
| `cache_overwrite` | `(data \|\| []).map()` 금지 → [11-data-flow.md](11-data-flow.md) | 없음 |

### 우회 마커

```js
// bgnj-lint-ignore-next-line direct_fetch
const res = await fetch(url);   // 사유: 워커 health check — BGNJ_API 초기화 전 실행
```

직전 줄 또는 같은 줄에 붙입니다. **사유 주석을 반드시 함께 남깁니다.**
우회가 늘어난다면 룰이 틀렸거나 설계가 틀린 것이니, 덮기 전에 한 번 의심합니다.

그 외 차단 룰: `viewport_100vh` (100dvh 폴백 없는 100vh) · `scroll_lock_raw`
(`document.body.style.overflow` 직접 조작 — `BGNJ_SCROLL_LOCK` 사용).

## 2. 정보성 룰 — 차단하지 않고 개수만 셉니다

- `TODO` — 코멘트 마커 (문자열 내부 오탐 제외)
- `equality_loose` — `==` / `!=` (`== null` idiom 제외)
- `large_file` — 8,000줄 초과 시 분할 권장
- `silent_catch` — 빈 `catch {}` (현재 277건. 의도적인 것이 많아 정보성 유지)
- `aspect_cover_clip` — `aspectRatio` + `objectFit:cover` (이미지 잘림)
- `brand_yellow_surface` — 옐로우 배경 사용 개수 (현재 7건)

### 옐로우 면적 5% 룰이 차단 룰이 아닌 이유

v00.289 에서 차단 룰로 만들려다 되돌렸습니다. **정규식은 면적을 볼 수 없습니다** —
버튼의 옐로우 배경(정당)과 섹션의 옐로우 배경(위반)이 소스에선 똑같이 생겼습니다.

실측해보니 당시 JSX 인라인 옐로우 배경 7건은 **전부 규칙이 허용하는 용도**였습니다 —
프로그레스 바 3 · CTA 버튼 2 · 로고 마크 1 · 알림 배지 dot 1. 차단 룰을 넣었다면 100% 오탐이었습니다.
(정작 진짜 위반이던 히어로 제목 옐로우는 `background` 가 아니라 text color 라 이 패턴에 잡히지도 않았습니다.)

그래서 **판단은 리뷰가 하고 룰은 개수만 셉니다.** 이 숫자가 눈에 띄게 늘면 그때 실제로
면적을 깔고 있는지 확인하세요. 판단 기준은 [20-design.md §8](20-design.md).

---

## 3. 표준 가드 — `BGNJ_GUARD`

[data.js:28](../data.js#L28) 에 정의됩니다.

```js
window.BGNJ_GUARD = {
  arr(fn, fb = [])  { /* try/catch + Array.isArray 가드 */ },
  call(fn, fb)      { /* try/catch + 단일 값 폴백 */ },
  num(fn, fb = 0)   { /* try/catch + 정수 환산 */ },
  str(fn, fb = '')  { /* try/catch + 문자열 보장 */ },
};
```

모든 헬퍼 호출을 이걸로 감쌉니다.

```js
const G = window.BGNJ_GUARD;
const tours = G.arr(() => window.BGNJ_TOURS?.listAll?.());
```

스크립트 로드 경합으로 `BGNJ_GUARD` 가 아직 없을 수 있으므로, 페이지 상단에 인라인 폴백을 둡니다
(패턴은 [pages/HomePage.jsx:539](../pages/HomePage.jsx#L539) 참고).

---

## 4. ErrorBoundary 2-tier

- **`PageErrorBoundary`** ([boot.jsx:64](../boot.jsx#L64)) — 라우트 단위. 한 페이지가 throw 해도 전역 트리는 보존되고 "다시 시도 / 홈으로 / 새로고침" UI 가 뜹니다. `key={route}` 로 라우트 변경 시 자동 reset.
- **`HomeSectionBoundary`** ([pages/HomePage.jsx](../pages/HomePage.jsx)) — 홈 섹션 단위. 한 섹션이 죽어도 나머지는 정상 렌더.

둘 다 `BGNJ_API.errorLog.report` 를 자동 호출합니다. **새 홈 섹션을 만들면 반드시 `HomeSectionBoundary` 로 감쌉니다.**

---

## 5. 항상 적용 / 절대 금지

### 항상 적용

- 새 컴포넌트·페이지: `BGNJ_GUARD.{arr,call}` 로 헬퍼 호출 보호.
- 새 `dangerouslySetInnerHTML`: 반드시 `BGNJ_SAFE_HTML(html)` 로 래핑.
- 시간 표시: `BGNJ_FMT.kstDateTime` / `kstShort` / `kstDate` / `kstFriendly` (KST 강제).
  브라우저 TZ 에 의존하는 `toLocaleString` 금지.
- 가격 표시: `BGNJ_FMT.won(n)` / `BGNJ_FMT.priceOrFree(n)` (ko-KR 강제). 직접 `n.toLocaleString()` 금지.
- 사용자 알림: `window.BGNJ_TOAST.error()` / `window.BGNJ_CONFIRM()` (Promise).
- Sticky 카드를 인라인 `style={{position:'sticky', top:N}}` 으로 줄 때는 모바일 release 클래스를 함께
  (`book-cover-col` / `mobile-release-sticky`). 데스크톱 전용입니다.

### 절대 금지

- `alert()` / `window.confirm()` — v00.207/v00.208 에서 120건 일괄 교체됨.
- 레거시 컬러 토큰 `--gold` / `--gold-2` / `--gold-dim` / `--gold-ink` / `--cta-*` 신규 사용.
  v00.209 에서 전면 제거 — `--primary*` / `--on-primary` / `--secondary*` / `--tertiary` 를 씁니다.
- 옐로우를 면적으로 깔기 → [20-design.md](20-design.md).

---

## 6. 구현할 때 생각할 것

1. 화면만 있고 실제 저장·처리가 없으면 **"구현 완료"라고 하지 않습니다.**
2. 새 사용자 기능은 네 가지를 확인합니다 — 어디서 진입하는지 / 상태를 어디서 들고 있는지 /
   새로고침 후에도 유지되는지 / 실패하면 어떻게 보이는지.
3. 관리자 기능은 공개 페이지와 연결되는지 확인합니다. **관리자에서 편집되는데 어디에도 안 나오는
   설정을 남기지 않습니다.**
4. 인증 관련 변경은 로그인 유지 · 로그아웃 · 권한 체크 · 비인가 접근 네 가지를 함께 봅니다.
5. 데이터 기능은 셋 중 무엇인지 분명히 구분합니다 — 임시 `localStorage` / 목업 / 실제 영속 데이터.

---

## 7. `BGNJ_*` 헬퍼 목록

`BGNJ_VERSION` `BGNJ_GUARD` `BGNJ_DRAFTS` `BGNJ_THEME` `BGNJ_DIAG` `BGNJ_SAFE_HTML` `BGNJ_FMT`
`BGNJ_TOURS` `BGNJ_LECTURES` `BGNJ_COLUMNS` `BGNJ_COMMUNITY` `BGNJ_BOOKS` `BGNJ_BOOK_ORDERS`
`BGNJ_AUTH` `BGNJ_FAQ` `BGNJ_LEGAL` `BGNJ_SITE_CONTENT` `BGNJ_AUDIT` `BGNJ_VISITS`
`BGNJ_GRADE_PROMO` `BGNJ_GRADE_RULES_EFFECTIVE` `BGNJ_HERO_STYLE` `BGNJ_FOOTER_STYLE`
`BGNJ_NOTIFICATIONS` `BGNJ_RECOMMENDATIONS` `BGNJ_KIND_PAGES` `BGNJ_TOAST` `BGNJ_CONFIRM`

모두 내부적으로 `BGNJ_API` (Worker fetch 래퍼)를 호출합니다.
앱 init 의 `Promise.allSettled` 가 각 헬퍼의 `refresh()` 를 트리거하고,
헬퍼는 `bgnj-*-refresh` 이벤트를 발화합니다. 페이지는 `useEffect` 로 listen 해 자동 재렌더합니다.

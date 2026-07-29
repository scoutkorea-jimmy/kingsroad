# 데이터 흐름 규칙

코드 일반 규칙은 [10-coding.md](10-coding.md), 파일 위치는 [90-file-map.md](90-file-map.md).

---

## 1. D1 이 단일 진실 원천

```
D1 (banginoja-db)  →  Worker /api/*  →  BGNJ_API  →  BGNJ_* 헬퍼  →  페이지/컴포넌트
```

- 페이지와 컴포넌트는 **`window.BANGINOJA_DATA` 시드를 직접 읽지 않습니다.** pre-commit 이 차단합니다.
- **시드 폴백을 만들지 않습니다.** 응답이 비면 헬퍼는 빈 배열이나 `null` 을 반환하고,
  페이지는 **그 섹션 자체를 렌더하지 않습니다.** 깡통 카드나 "데이터 없음" 플레이스홀더를 띄우지 않습니다.
- 모든 데이터 변경은 `BGNJ_API` 호출로 D1 에 영속합니다. 새 헬퍼 메소드는 `async` 로 작성합니다.
- 페이지가 헬퍼의 async 메소드를 호출할 때는 반드시 `await` + `try/catch` 로 받습니다.
  호출 직후 `result.ok` 같은 동기 검사를 하지 않습니다.

---

## 2. 캐시 덮어쓰기 금지 — v00.231 데이터 유실 사고

API 응답으로 `BGNJ_*` 메모리 캐시를 갱신할 때는 **반드시 배열인지 먼저 검증합니다.**

```js
// 절대 금지 — 비배열 응답(null/undefined/object)이 캐시를 빈 배열로 덮어씁니다.
_cache = (data || []).map(_toX);

// 올바름
if (Array.isArray(data)) {
  _cache = data.map(_toX);
} else {
  console.warn('[BGNJ_X.method] non-array — cache preserved');
}
```

사용자에게는 **"데이터가 사라졌다"** 로 보입니다. 실제로 그렇게 보고됐고, 그래서
`cache_overwrite` lint 룰이 pre-commit 에서 자동 차단합니다. catch 블록에도 진단 로그를 남깁니다.

---

## 3. 응답 매퍼 표준

서버 응답 row 의 컬럼명은 `snake_case`, 클라이언트 모델은 `camelCase` 입니다.
헬퍼가 `_toX(row)` 매퍼로 변환해 페이지에 전달합니다. 페이지가 snake_case 를 직접 만지지 않습니다.

---

## 4. 갱신 이벤트

앱 init 의 `Promise.allSettled` 가 모든 헬퍼의 `refresh()` 를 트리거합니다.
각 헬퍼는 완료 시 `bgnj-*-refresh` 이벤트를 발화하고, 페이지는 `useEffect` 로 listen 해 재렌더합니다.

주요 이벤트: `bgnj-posts-refresh` · `bgnj-columns-refresh` · `bgnj-tours-refresh` ·
`bgnj-lectures-refresh` · `bgnj-site-content-refresh`

페이지에서는 각 memo 가 **자기 stream 의 tick 만** 의존하게 합니다 — 무관한 stream 이 갱신될 때
재실행되지 않도록 (`[postsTick]`, `[columnsTick]` 처럼).

---

## 5. 저장소 4태그 분류

| 태그 | 대상 |
|---|---|
| 🌐 **server-backed (D1)** | grades_kv · categories_kv · notifications · columnEngagement · bankAccount · legalDocs · auditLog · siteContent_kv · books · faqs · posts · comments · tours · lectures · login_attempts |
| 💾 **local intentional** | userPosts(임시 글) · session(세션 토큰 캐시) · drafts(`BGNJ_DRAFTS` 임시저장) · 카트 · 쿠키 동의 · 테마 · 라우트 |
| ⚠ **legacy (점진 마이그)** | bookOrders · bookReviews · tourReviews · lectureReviews |
| 🪦 **dead (제거됨)** | lectureOverrides · lectureRegistrations · tourOverrides · tourReservations · bookmarks · reports · bgnj_comments · legacy categories/grades/site_content |

`localStorage` 는 위 "local intentional" 외에는 **쓰기 금지**입니다.
새 데이터를 붙일 때 어느 태그인지 먼저 정하고, 애매하면 서버로 보냅니다.

---

## 6. 새 데이터를 붙이는 순서

1. Worker 에 endpoint 가 있는지 확인 — 없으면 **워커 배포가 필요**하므로 사용자에게 먼저 알립니다.
2. `api.js` 에 `BGNJ_API` 메소드 추가.
3. `data.js` 에 `BGNJ_X` 헬퍼 추가 — `refresh()` · 캐시 · `_toX` 매퍼 · `bgnj-x-refresh` 이벤트.
4. 페이지에서 `BGNJ_GUARD.arr()` 로 감싸 읽고, 비면 섹션을 렌더하지 않습니다.
5. 캐시 갱신부에 `Array.isArray` 검증(2절)을 넣습니다.

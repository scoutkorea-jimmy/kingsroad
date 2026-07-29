# 보안 · 권한 규칙

---

## 1. 시크릿

1. 시크릿·토큰·실제 비밀번호를 저장소 파일에 넣지 않습니다.
2. 운영용 자격증명을 임의로 만들어내지 않습니다.
3. 인증이 데모 수준이면 실제 인증처럼 보이게 설명하지 않습니다.
4. 개인정보·결제·관리자 기능은 보수적으로 변경하고, 주석이나 문서로 근거를 남깁니다.

슈퍼 관리자 권한은 워커 환경변수 `SUPER_ADMIN_EMAILS` 로 관리합니다. **D1 직접 수정은 피합니다.**

---

## 2. 업로드 폴더 권한

`POST /api/media/upload` 는 `folder` 를 받아 R2 에 저장합니다
([workers/src/index.js:758](../workers/src/index.js#L758)).

```js
const USER_ALLOWED_FOLDERS = new Set([
  'post-images', 'post-attachments',
  'lecture-covers', 'tour-covers',
]);
```

- 이 집합에 **있는** 폴더 → 로그인 회원이면 업로드 가능 (`requireUser`)
- 이 집합에 **없는** 폴더 → **관리자 전용** (`requireAdmin`)

즉 새 관리자 전용 이미지 슬롯을 만들 때는 **워커를 고칠 필요가 없습니다.**
`USER_ALLOWED_FOLDERS` 에 없는 새 폴더명을 쓰면 자동으로 admin only 가 됩니다
(예: `hero-bg`, `og-images`, `logos`, `favicons`, `book-covers`, `recommendations`).

기타 제한: 최대 50MB · 확장자 화이트리스트 · 폴더명 sanitize (path traversal 차단).
SVG 는 XSS 위험이 있어 현재 허용 중이나 본문 sanitize 는 미적용 — 사용자 업로드 경로에는 피합니다.

---

## 3. XSS 방어

- 모든 `dangerouslySetInnerHTML` 은 `BGNJ_SAFE_HTML(html)` 로 감쌉니다.
- DOMPurify (CDN + SRI) + 커스텀 hook — iframe 화이트리스트(YouTube/Vimeo/OpenStreetMap) ·
  `data:` 는 image 만 · `target=_blank` 에 `noopener` 강제.
- CSP 는 `index.html` meta 로 관리하며 인라인 script 는 SHA-256 해시로 허용합니다
  (`tools/csp-hashes.mjs` 가 자동 동기). 정적 호스팅이라 nonce 를 쓸 수 없어 해시가 표준 해법입니다.
- `frame-ancestors` / `X-Frame-Options` 는 HTTP 헤더 전용이라 GitHub Pages 에선 무시됩니다.
  클릭재킹 방어가 필요하면 Cloudflare 같은 헤더 주입 가능한 경유지에서 설정해야 실효가 있습니다.

---

## 4. 인증 · rate limit

- 브루트포스 방어: D1 `login_attempts` 기반, 15분에 5회 실패 시 차단. 슈퍼 관리자는 예외.
- 게시판 작성 권한은 `post_min_level` 과 회원 등급 level 을 비교해 검증합니다.
- 인증 관련 변경은 네 가지를 함께 봅니다 — 로그인 유지 · 로그아웃 · 권한 체크 · 비인가 접근.

## 5. D1 GC

무한히 자라는 테이블은 확률적 GC 를 겁니다 —
`login_attempts` 24시간(1/10) · `audit_log` 30일(1/20) · `notifications` 90일 + 읽음(1/50).
새 로그성 테이블을 추가하면 **GC 도 함께 넣습니다.**

---

## 6. 오류 표시 4요소

모든 사용자 대면 오류는 네 가지를 함께 노출합니다.

1. **코드** 2. **상태** 3. **정확한 사유** 4. **사용자가 다음에 할 행동**

- 비동기 오류 객체는 `kind` / `code` / `status` / `body` / `url` / `hint` 필드를 갖도록 분류해
  throw 합니다 — `BGNJ_API.request` 가 표준입니다.
- 표시 위치를 나눕니다: **인증 흐름**은 폼 안 인라인 패널 · **그 외 비동기 오류**는 우하단 토스트 ·
  **렌더링 오류**는 풀스크린 카드. 화면 어디에서 무슨 일이 났는지 즉시 보이게 하기 위함입니다.
- 분류된 오류는 `console.error` 로도 동시 기록합니다.
- `alert()` 단독 사용 금지 → `window.BGNJ_TOAST.error()`.

---

## 7. 오류 로그 우선 처리

클라이언트에서 발생한 모든 오류는 D1 `error_log` 에 자동 적재됩니다.

1. 작업 지시를 받으면 **가장 먼저** 관리자 '오류 로그' 패널
   (또는 `BGNJ_API.errorLog.list({ limit: 50 })`)을 확인합니다.
2. 미해결 오류가 있으면 지시받은 작업보다 **오류 해결을 우선**합니다.
3. 같은 오류가 반복되면 사용자에게 알리고 함께 해결합니다.
4. 작업을 마칠 때 오류 로그를 한 번 더 확인해 본인 작업으로 인한 회귀를 점검합니다.

미해결 오류가 누적되지 않는 것이 사이트 안정성에 직결된다는 것이 사용자 정책입니다.

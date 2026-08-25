# 릴리스 · 버전 · 배포 규칙

환경이 깨졌다면 [60-environment.md](60-environment.md).

---

## 1. 버전 체계 — `AA.BBB.CCC`

| 자리 | 언제 올리나 |
|---|---|
| `AA` | 대버전. **사용자가 직접 판단**합니다. AI 가 올리지 않습니다 |
| `BBB` | 기능 추가·삭제처럼 **눈에 보이는 기능 단위** 변경 |
| `CCC` | 마이너 수정, 문구 수정, 버그 수정, 작은 개선 |

AI 는 버전을 임의로 크게 올리지 않습니다. 기능 추가·삭제가 아니면 `BBB` 를 건드리지 않습니다.
**문서만 바뀌는 커밋은 버전을 올리지 않습니다** — 캐시버스터와 무관하기 때문입니다.

---

## 1.5 버전 기록은 손으로 적지 않는다 (v00.306.009 —)

`node tools/version-history.mjs` 가 **git 커밋 제목의 `(v00.306.008)` 을 읽어** 만든다.
`csp-hashes` 앞에 넣어 배포 순서에 포함한다.

> **왜 자동인가** — 예전엔 `AdminDesignHub.jsx` 의 `ADMIN_VERSION_HISTORY` 를 배포마다 손으로 고쳤다.
> 그래서 **v00.288.002(2026-06-07)에서 멈췄고**, 두 달 반 뒤 운영자가 "쓰다 만 것 같다" 고 말했다.
> 손으로 해야 하는 일은 언젠가 반드시 멈춘다. 커밋은 어차피 매번 남는다.

손으로 쓴 옛 기록 213건은 **그대로 둔다** — 훨씬 자세하다. 화면이 둘을 합치고 같은 버전이면 손으로 쓴 쪽을 쓴다.
따라서 **`ADMIN_VERSION_HISTORY` 는 이제 건드리지 않아도 된다.**

⚠ 이번 커밋의 버전은 아직 git 에 없으므로 **다음 실행 때** 목록에 들어온다.
   화면은 그동안 '지금 운영 중 vX · 이번 배포는 다음 기록 때 목록에 들어옵니다' 로 알린다.

---

## 2. 3종 동기 — 코드가 바뀌는 커밋마다

1. **`data.js`** — `window.BGNJ_VERSION.version` + `build` 갱신
2. **`index.html`** — 모든 `?v=00.0XX.YYY` 캐시버스터 일괄 (Edit `replace_all`).
   불일치하면 `check-version.mjs` 가 커밋을 차단합니다
3. **`rules/handoff/`** — 진행 기록 갱신

`pages/admin/AdminDesignHub.jsx` 의 `ADMIN_VERSION_HISTORY` 는 **더 이상 손대지 않습니다** (v00.306.009 —).
`tools/version-history.mjs` 가 git 에서 만들어 채웁니다 — §1.5 참조.

### 왜 캐시버스터가 중요한가

`index.html` 의 모든 `<script src>` 와 `<link href>` 는 `?v=` 쿼리를 가집니다.
버전 갱신 시 이 값을 같이 올리지 않으면 **사용자 브라우저가 옛 코드를 무한히 캐시합니다.**
`<head>` 의 `no-cache, no-store, must-revalidate` meta 도 항상 있어야 합니다 —
이게 빠지면 자산 쿼리 갱신 자체가 무의미해집니다.

사용자가 "옛 화면이 계속 보인다"고 하면 먼저 콘솔에서 `window.BGNJ_DIAG.run()` 으로
어떤 버전을 보고 있는지 확인합니다.

---

## 3. pre-commit 자동화 5도구

`tools/install-hooks.sh` 가 `.git/hooks/pre-commit` 을 설치합니다. 실행 순서:

```
stamp-datetime → csp-hashes → check-version → 자동 stage → build → stage dist → check-syntax
```

| 도구 | 역할 |
|---|---|
| `stamp-datetime.mjs` | `ADMIN_VERSION_HISTORY[0].datetime` sentinel → 실제 KST ISO 치환 |
| `csp-hashes.mjs` | `index.html` 인라인 `<script>` → SHA-256 → CSP meta `script-src` 자동 동기 |
| `check-version.mjs` | `BGNJ_VERSION` ↔ `?v=` 일관성 검증. 불일치 시 **차단** |
| `build.mjs` | `src/entry-{main,admin}.jsx` → `dist/{app,admin}.js` esbuild 번들 |
| `check-syntax.mjs` | 전체 `.jsx`/`.js` 파싱 + 차단 룰 검사 |

---

## 4. Git · 배포

1. 의미 있는 변경 후 `git status` 를 확인합니다.
2. **관련 있는 파일만** 커밋합니다. `.DS_Store` 같은 환경 잡파일은 넣지 않습니다.
3. 작업 트리가 이미 더러우면 자신의 변경만 분리해 다루고 무관한 변경은 건드리지 않습니다.
4. **작업이 끝나면 별도 지시 없이 commit + push** 합니다 (GitHub Pages 자동 배포).
5. 푸시 후 배포 반영 여부까지 확인합니다. **배포되지 않은 수정은 "검토 가능" 상태가 아닙니다.**
6. 푸시나 배포가 실패하면 막힌 원인을 정확히 기록합니다.

### 워커는 다릅니다

`workers/` 하위(특히 `src/index.js`, `wrangler.toml`)를 바꾸면
`cd workers && npx wrangler deploy` 가 필요한데, **이건 사용자가 직접 실행합니다.**
워커 변경이 필요한 작업은 시작 전에 사용자에게 알립니다.

`Failed to fetch` 진단 시 의심 순서: ① 워커 미배포 ② 클라이언트 origin 이 `ALLOWED_ORIGINS`
또는 localhost 자동허용 정규식에 미해당 ③ `credentials: 'include'` + 와일드카드 origin 충돌.

### 커밋 메시지

```
<type>(<scope>): <한글 요약> (v00.XXX.YYY)

- 무엇을 왜 바꿨는지 항목별
- 남은 것 / 가정 / 리스크가 있으면 함께

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

## 5. 검증 명령

```bash
node tools/check-syntax.mjs    # 파싱 + 차단 룰
node tools/build.mjs           # esbuild 번들
node tools/check-version.mjs   # 버전 ↔ ?v= 일관성
node tools/csp-hashes.mjs      # CSP 해시 동기
bash tools/install-hooks.sh    # 훅 재설치

curl -s https://banginoja-api.scoutkorea.workers.dev/api/health   # 워커 health

# 사용자 브라우저 캐시 청소 (브라우저 콘솔에서)
window.BGNJ_DIAG.run()

# D1 스키마 적용 — 사용자 수동, 멱등
cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-vN.sql
```

**명령을 실행한 직후에는 출력의 오류·경고를 다른 어떤 작업보다 먼저 처리합니다.**

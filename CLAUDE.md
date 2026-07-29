# 뱅기노자 (BANGINOJA) — AI 작업 진입점

한국의 역사·문화·자연을 함께 여행하는 커뮤니티 **[bgnj.net](https://bgnj.net)**.
정적 호스팅(GitHub Pages) + Cloudflare Worker/D1/R2. React 18.3.1 UMD + esbuild 단일 번들.

> **이 문서는 규칙을 담지 않습니다. 어디를 읽을지만 알려줍니다.**
> 전체를 훑지 말고 아래 표에서 해당 파일만 여세요.

---

## 작업 시작 전 3줄

1. `rules/handoff/ACTIVE.md` — 진행 중인 건이 있으면 그것부터. **PC가 바뀌었다면 여기가 시작점.**
2. 아래 라우팅 표에서 이번 작업에 해당하는 규칙 파일만 읽는다.
3. 새 작업이면 `ACTIVE.md` 에 지시 내역·범위·체크리스트를 먼저 쓰고 시작한다.

---

## 라우팅 표

| 이런 작업/질문이면 | 여기를 읽으세요 |
|---|---|
| 어떤 파일에 뭐가 있지? 함수·상수 위치는? | [rules/90-file-map.md](rules/90-file-map.md) |
| 코드를 쓴다 / 금지 패턴·lint 룰이 뭐지? | [rules/10-coding.md](rules/10-coding.md) |
| 데이터를 읽거나 저장한다 / 캐시·헬퍼·API | [rules/11-data-flow.md](rules/11-data-flow.md) |
| 화면을 만든다 / 색·폰트·간격·컴포넌트 | [rules/20-design.md](rules/20-design.md) · [design/tokens.md](design/tokens.md) |
| 버전을 올린다 / 커밋·배포·캐시버스터 | [rules/30-release.md](rules/30-release.md) |
| 권한·업로드·시크릿·오류 표시 | [rules/40-security.md](rules/40-security.md) |
| 작업 절차 / handoff 기록 / 완료 체크리스트 | [rules/50-workflow.md](rules/50-workflow.md) |
| 빌드가 깨졌다 / 새 PC 셋업 / 훅 설치 | [rules/60-environment.md](rules/60-environment.md) |
| 다음에 뭘 해야 하지? 백로그·우선순위 | [ROADMAP.md](ROADMAP.md) |
| 기능 정의서 · 미션 · 운영 매트릭스 | [docs/kms.md](docs/kms.md) |
| 지난 작업은 뭐였지? | [rules/handoff/INDEX.md](rules/handoff/INDEX.md) |
| 외부 협업자에게 프로젝트를 소개 | [README.md](README.md) |

전체 지도는 [rules/00-index.md](rules/00-index.md).

---

## 절대 금지 (pre-commit 훅이 차단)

1. `window.BANGINOJA_DATA` 직접 참조 — `BGNJ_*` 헬퍼를 경유한다 (`data.js` 만 예외)
2. `console.log` — 진단은 `console.error` / `console.warn` (`data.js` · `api.js` 만 예외)
3. `var` — `let` / `const` 만
4. 직접 `fetch(...)` — `BGNJ_API` 헬퍼를 쓴다 (`api.js` · `data.js` 만 예외)
5. `(data || []).map()` 로 캐시 덮어쓰기 — `Array.isArray(data)` 로 검증한다 (v00.231 데이터 유실 사고)

우회가 꼭 필요하면 직전 줄 또는 같은 줄에 `// bgnj-lint-ignore-next-line <RULE>` — 사유 주석을 함께 남긴다.

---

## 항상 적용

- 작업이 끝나면 **별도 지시 없이 commit + push** (GitHub Pages 자동 배포).
- 코드가 바뀌면 `data.js` 의 `BGNJ_VERSION` 과 `index.html` 의 `?v=` 를 **같은 커밋에서** 동기.
- 시간은 `BGNJ_FMT.kst*`, 금액은 `BGNJ_FMT.won()` — 브라우저 로케일에 의존하지 않는다.
- `dangerouslySetInnerHTML` 은 반드시 `BGNJ_SAFE_HTML()` 로 감싼다.
- 사용자 알림은 `window.BGNJ_TOAST.error()` / `window.BGNJ_CONFIRM()` — `alert` · `confirm` 금지.
- 옐로우(`--primary`)는 **인터랙션 상태에만, 화면의 5% 이내**. 배경·라벨로 깔지 않는다.
- 모바일(≤900px)에서 다열 그리드는 1단. 인라인 `gridTemplateColumns` 를 쓰면 클래스도 함께 부여한다.
- `workers/` 를 바꾸면 배포에 사용자의 `wrangler deploy` 가 필요하다 — 먼저 알린다.

---

## 검증 명령

```bash
node tools/check-syntax.mjs    # 파싱 + 차단 룰
node tools/build.mjs           # esbuild 번들
node tools/check-version.mjs   # BGNJ_VERSION ↔ ?v= 일관성
node tools/csp-hashes.mjs      # 인라인 script SHA-256 → CSP meta
bash tools/install-hooks.sh    # pre-commit 훅 재설치
```

빌드가 `You installed esbuild for another platform` 으로 죽으면 → [rules/60-environment.md](rules/60-environment.md).

---

## 설명 방식

이 프로젝트의 운영자는 비개발자입니다. 설명할 때는 **무엇이 바뀌는지 → 왜 필요한지 → 어떤 영향이 있는지** 순서로,
기술 용어보다 체감되는 현상을 먼저 말합니다. 미완성 기능은 어디까지 됐는지 분명히 밝힙니다.

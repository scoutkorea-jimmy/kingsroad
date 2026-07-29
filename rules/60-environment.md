# 환경 · 셋업 · 복구

**PC를 옮겼다면 이 문서와 [handoff/ACTIVE.md](handoff/ACTIVE.md) 를 함께 봅니다.**

---

## 1. 사전 요구

- **Node.js 18+** (esbuild / tools 실행)
- **Git**
- (선택) **Cloudflare Wrangler CLI** — 워커·D1 관리용. `npm i -g wrangler`

## 2. 새 PC 셋업

```bash
git clone https://github.com/scoutkorea-jimmy/kingsroad.git
cd kingsroad

# 빌드 도구 설치 (tools/node_modules 는 gitignore 대상)
cd tools && npm install && cd ..

# pre-commit 훅 설치 — 이걸 안 하면 버전 동기·빌드가 자동으로 안 돕니다
bash tools/install-hooks.sh

# 빌드 확인
node tools/build.mjs
```

## 3. 로컬 미리보기

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

워커 API 는 운영 워커(`banginoja-api.scoutkorea.workers.dev`)를 그대로 씁니다.
localhost 는 `ALLOWED_ORIGINS` 자동허용 정규식에 포함돼 있습니다.

---

## 4. 빌드가 깨졌을 때

### esbuild 네이티브 바이너리 오류

```
Error: You installed esbuild for another platform than the one you're currently using.
Specifically the "@esbuild/darwin-arm64" package is present but this platform
needs the "@esbuild/darwin-arm64" package instead.
```

**같은 패키지명이 앞뒤로 나오는 게 특징입니다.** 플랫폼이 실제로 다른 게 아니라
바이너리가 깨졌거나 설치가 어중간하게 끝난 상태입니다. PC 간 이동이나 `node_modules` 복사에서 발생합니다.

```bash
cd tools && rm -rf node_modules && npm install
```

> 2026-07-29 실제 발생. 이 저장소에서 확인된 사례입니다.

### 그 외

| 증상 | 확인 |
|---|---|
| `check-version` 이 커밋을 막음 | `data.js` 의 `BGNJ_VERSION` 과 `index.html` 의 `?v=` 가 일치하는지 |
| `[check-version] data.js / index.html 없음` | **저장소 루트에서 실행하지 않았습니다.** `tools/` 안에서 돌리면 이 메시지가 납니다 |
| 커밋했는데 훅이 안 돎 | `bash tools/install-hooks.sh` 재실행 |
| 사이트에 옛 화면이 계속 보임 | 브라우저 콘솔에서 `window.BGNJ_DIAG.run()` |
| `Failed to fetch` | ① 워커 미배포 ② origin 이 `ALLOWED_ORIGINS` 미해당 ③ credentials + 와일드카드 충돌 |

**검증 도구는 모두 저장소 루트에서 실행합니다** — `node tools/xxx.mjs` 형태로.
`cd tools` 후 실행하면 상대 경로를 못 찾아 조용히 건너뜁니다.

---

## 5. 워커 · D1

```bash
# 워커 배포 — 사용자가 직접 실행
cd workers && npx wrangler deploy

# D1 스키마 적용 — 멱등 (IF NOT EXISTS)
cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-vN.sql

# 워커 health
curl -s https://banginoja-api.scoutkorea.workers.dev/api/health
```

## 6. gitignore 되는 것

`tools/node_modules/` · `.claude/settings.local.json` · `.wrangler/` · `.superpowers/` ·
`.playwright-mcp/` · `.DS_Store` · `.env*`

`dist/` 는 gitignore 목록에 있지만 **GitHub Pages 가 서빙해야 하므로 강제 커밋**되어 있습니다
(`git ls-files dist` 로 확인 가능). 빌드 산출물이 커밋에서 빠지면 사이트가 옛 코드로 돕니다.

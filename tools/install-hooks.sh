#!/usr/bin/env bash
# 뱅기노자 — git pre-commit hook 설치
# 실행: bash tools/install-hooks.sh
# 효과: 매 커밋 직전 tools/check-syntax.mjs 가 자동 실행되어 .jsx/.js 신택스 오류를 차단.

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK_DIR="$ROOT/.git/hooks"
HOOK_FILE="$HOOK_DIR/pre-commit"

if [ ! -d "$HOOK_DIR" ]; then
  echo "❌ $HOOK_DIR 가 없습니다. .git 디렉터리가 있는 저장소에서 실행해 주세요."
  exit 1
fi

cat > "$HOOK_FILE" <<'EOF'
#!/usr/bin/env bash
# 자동 생성된 hook (v00.071 ~ v00.285)
#  1) stamp-datetime — ADMIN_VERSION_HISTORY[0].datetime sentinel 치환.
#  2) csp-hashes — 인라인 script SHA-256 → CSP meta 자동 동기.
#  3) check-version — BGNJ_VERSION ↔ index.html cache-buster 일치 검증 (불일치 차단).
#  4) build — *.jsx → dist/{app,admin}.js 번들. 빌드 실패 시 commit 차단.
#       dist/ 는 gitignore — 커밋 안 함(CI 가 배포 직전 생성). 그래서 자동 stage 없음.
#  5) check-syntax — .jsx 신택스 + 룰 검증.
# 실패 시 커밋 중단. 우회: git commit --no-verify (권장 X).
set -e
ROOT="$(git rev-parse --show-toplevel)"
# 1) datetime stamp.
node "$ROOT/tools/stamp-datetime.mjs"
# 2) CSP 해시 동기.
node "$ROOT/tools/csp-hashes.mjs"
# 3) 버전 일관성 검증 — BGNJ_VERSION 과 cache-buster 불일치 시 차단.
node "$ROOT/tools/check-version.mjs"
# 3.5) /version.json 갱신 — 클라이언트 새 빌드 감지용 매니페스트.
node "$ROOT/tools/write-version-json.mjs"
git -C "$ROOT" add 'version.json' 2>/dev/null || true
# 4) stamp / csp-hashes 변경분 자동 stage.
git -C "$ROOT" add -u 'pages/admin/AdminDesignHub.jsx' 'index.html' 2>/dev/null || true
# 5) 번들 빌드 — 실패 시 commit 차단. dist/ 는 gitignore 라 stage 불필요.
node "$ROOT/tools/build.mjs"
# 6) 신택스 + 룰 검증.
node "$ROOT/tools/check-syntax.mjs"

# v00.296.001 — 두 가지를 더 막는다. 둘 다 '오류 없이 화면만 깨지는' 종류라
#   사람 눈으로는 늦게 발견된다(실제로 각각 운영에서 터진 뒤에 만들었다).
#   6) check-globals — <window.X/> 로 쓰는데 window 에 등록 안 된 컴포넌트 (React #130)
#   7) check-hooks   — early return 뒤에 놓인 훅 (React #300/#310)
node "$ROOT/tools/check-globals.mjs"
node "$ROOT/tools/check-hooks.mjs"
#  8) check-patterns — 응답 껍데기 · 세고-나서-넣기 · LIKE 와일드카드
#  9) smoke          — 브라우저 코드를 Node 에서 실제로 실행 (API 만 봐서는 안 잡히는 것들)
node "$ROOT/tools/check-patterns.mjs"
node "$ROOT/tools/smoke.mjs"
EOF
chmod +x "$HOOK_FILE"

echo "✅ pre-commit hook 설치 완료: $HOOK_FILE"
echo "   매 커밋 직전 신택스 검증이 자동 실행됩니다."
echo "   우회 필요 시: git commit --no-verify (권장하지 않음)"

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
# 자동 생성된 hook (v00.071)
#  1) tools/build.mjs — *.jsx → *.js 사전 컴파일 (esbuild). 결과 .js 자동 stage.
#  2) tools/check-syntax.mjs — .jsx/.js 신택스 검증.
# 실패 시 커밋 중단. 우회: git commit --no-verify (권장 X).
set -e
ROOT="$(git rev-parse --show-toplevel)"
# 1) 빌드 — *.jsx 가 stage 됐다면 짝 .js 가 최신 상태가 되도록 강제 재컴파일.
node "$ROOT/tools/build.mjs"
# 2) 빌드 결과 .js 들을 자동 stage — 누락된 .js 가 push 되지 않도록.
git -C "$ROOT" add -u 'pages/*.js' 'pages/admin/*.js' 'components/*.js' 'boot.js' 2>/dev/null || true
# 3) 신택스 검증.
node "$ROOT/tools/check-syntax.mjs"
EOF
chmod +x "$HOOK_FILE"

echo "✅ pre-commit hook 설치 완료: $HOOK_FILE"
echo "   매 커밋 직전 신택스 검증이 자동 실행됩니다."
echo "   우회 필요 시: git commit --no-verify (권장하지 않음)"

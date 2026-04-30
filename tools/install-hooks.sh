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
# 자동 생성된 hook — tools/check-syntax.mjs 로 .jsx/.js 신택스 검증.
# 실패 시 커밋 중단. 우회: git commit --no-verify (권장 X).
set -e
ROOT="$(git rev-parse --show-toplevel)"
node "$ROOT/tools/check-syntax.mjs"
EOF
chmod +x "$HOOK_FILE"

echo "✅ pre-commit hook 설치 완료: $HOOK_FILE"
echo "   매 커밋 직전 신택스 검증이 자동 실행됩니다."
echo "   우회 필요 시: git commit --no-verify (권장하지 않음)"

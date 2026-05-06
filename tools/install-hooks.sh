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
# 자동 생성된 hook (v00.071 ~ v00.120)
#  1) stamp-datetime — ADMIN_VERSION_HISTORY[0].datetime sentinel 치환.
#  2) csp-hashes — 인라인 script SHA-256 → CSP meta 자동 동기.
#  3) check-version — BGNJ_VERSION ↔ index.html cache-buster 일치 검증 (불일치 차단).
#  4) build — *.jsx → *.js 사전 컴파일. 결과 .js 자동 stage.
#  5) check-syntax — .jsx/.js 신택스 + 룰 검증.
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
# 4) stamp / csp-hashes 변경분과 stage 된 .jsx 자동 stage.
git -C "$ROOT" add -u 'pages/admin/AdminDesignHub.jsx' 'index.html' 2>/dev/null || true
# 5) 빌드.
node "$ROOT/tools/build.mjs"
# 6) 빌드 결과 .js 들을 자동 stage.
git -C "$ROOT" add -u 'pages/*.js' 'pages/admin/*.js' 'components/*.js' 'boot.js' 2>/dev/null || true
# 7) 신택스 + 룰 검증.
node "$ROOT/tools/check-syntax.mjs"
EOF
chmod +x "$HOOK_FILE"

echo "✅ pre-commit hook 설치 완료: $HOOK_FILE"
echo "   매 커밋 직전 신택스 검증이 자동 실행됩니다."
echo "   우회 필요 시: git commit --no-verify (권장하지 않음)"

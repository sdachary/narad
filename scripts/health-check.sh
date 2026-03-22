#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# health-check.sh — Verify all Narad dependencies are reachable
# Bug fixes:
#   - Removed Qdrant check (Narad v2 uses SQLite, not Qdrant)
#   - Replaced hardcoded /home/deepak/Work/narad with dynamic path
#   - Added .env auto-load
#   - Added AGI worker check
#   - Added Node version check
# ══════════════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a; source "$SCRIPT_DIR/.env"; set +a
fi

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
HEALTH_STATUS=0

ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; HEALTH_STATUS=1; }
warn() { echo -e "  ${YELLOW}⚠${NC}  $1"; }

echo "Narad health check — $(date)"
echo "─────────────────────────────────────────"

# Telegram bot
echo -n "  Telegram bot: "
TGME=$(curl -sf "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe" 2>/dev/null)
if echo "$TGME" | grep -q '"ok":true'; then
  ok "connected"
else
  fail "Bot API unreachable or token invalid"
fi

# Groq API
echo -n "  Groq API: "
GROQ=$(curl -sf "https://api.groq.com/openai/v1/models" \
  -H "Authorization: Bearer $GROQ_API_KEY" 2>/dev/null)
if echo "$GROQ" | grep -q '"object"'; then
  ok "reachable"
else
  fail "Groq API unreachable or key invalid"
fi

# AGI Worker
AGI_URL="${AGI_WORKER_URL:-https://nisha-agi.pages.dev}"
echo -n "  AGI worker: "
AGI=$(curl -sf "${AGI_URL}/api/health" --max-time 5 2>/dev/null)
if echo "$AGI" | grep -q '"status"'; then
  ok "$AGI_URL"
else
  warn "$AGI_URL not responding (bot starts but /ask will fail)"
fi

# OpenRouter (optional)
if [ -n "${OPENROUTER_API_KEY:-}" ]; then
  echo -n "  OpenRouter: "
  OR=$(curl -sf "https://openrouter.ai/api/v1/models" \
    -H "Authorization: Bearer $OPENROUTER_API_KEY" 2>/dev/null)
  if echo "$OR" | grep -q '"data"'; then ok "reachable"; else warn "unreachable"; fi
fi

# Disk
echo -n "  Disk: "
DISK_USAGE=$(df "$SCRIPT_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 85 ]; then ok "${DISK_USAGE}% used"
else fail "${DISK_USAGE}% used — critical"; fi

# RAM
echo -n "  Memory: "
MEM_FREE=$(free -m | awk 'NR==2 {print $7}')
if [ "$MEM_FREE" -gt 150 ]; then ok "${MEM_FREE}MB free"
else fail "${MEM_FREE}MB free — critically low"; fi

# DB directory
echo -n "  ~/.narad dir: "
if [ -d "$HOME/.narad" ] && [ -w "$HOME/.narad" ]; then
  ok "writable"
else
  warn "missing — will be created on first start"
fi

# Node version
echo -n "  Node.js: "
NODE_VER=$(node --version 2>/dev/null || echo "missing")
if node --version 2>/dev/null | grep -qE "v2[0-9]\."; then ok "$NODE_VER"
else fail "$NODE_VER (need v20+)"; fi

echo "─────────────────────────────────────────"
if [ $HEALTH_STATUS -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed${NC}"
else
  echo -e "${RED}✗ Some checks failed${NC}"
fi
exit $HEALTH_STATUS

#!/bin/bash
# Health check for Narad service

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

HEALTH_STATUS=0

echo "Running Narad health checks..."

# ── Check Telegram connection ──────────────────
echo -n "Telegram bot: "
if curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe" | grep -q "ok"; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗${NC}"
  HEALTH_STATUS=1
fi

# ── Check Qdrant connection ────────────────────
echo -n "Qdrant: "
if curl -s "${QDRANT_URL}/health" | grep -q "ok"; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗${NC}"
  HEALTH_STATUS=1
fi

# ── Check Groq API ─────────────────────────────
echo -n "Groq API: "
if curl -s "https://api.groq.com/openai/v1/models" \
  -H "Authorization: Bearer $GROQ_API_KEY" | grep -q "models"; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗${NC}"
  HEALTH_STATUS=1
fi

# ── Check OpenRouter fallback ──────────────────
echo -n "OpenRouter fallback: "
if curl -s "https://openrouter.ai/api/v1/models" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" | grep -q "data"; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗${NC}"
  HEALTH_STATUS=1
fi

# ── Check disk space ───────────────────────────
echo -n "Disk space: "
DISK_USAGE=$(df /home/deepak/Work/narad | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 85 ]; then
  echo -e "${GREEN}✓ ${DISK_USAGE}%${NC}"
else
  echo -e "${RED}✗ ${DISK_USAGE}% (critical)${NC}"
  HEALTH_STATUS=1
fi

# ── Check memory usage ─────────────────────────
echo -n "Memory: "
MEM_USAGE=$(free | awk 'NR==2 {printf "%.0f", $3/$2 * 100}')
if [ "$MEM_USAGE" -lt 80 ]; then
  echo -e "${GREEN}✓ ${MEM_USAGE}%${NC}"
else
  echo -e "${RED}✗ ${MEM_USAGE}% (critical)${NC}"
  HEALTH_STATUS=1
fi

if [ $HEALTH_STATUS -eq 0 ]; then
  echo -e "\n${GREEN}✓ All health checks passed${NC}"
else
  echo -e "\n${RED}✗ Some health checks failed${NC}"
fi

exit $HEALTH_STATUS

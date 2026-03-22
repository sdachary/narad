#!/bin/bash
# Validate all required environment variables at startup

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

REQUIRED_VARS=(
  "GROQ_API_KEY"
  "OPENROUTER_API_KEY"
  "QDRANT_URL"
  "QDRANT_API_KEY"
  "TELEGRAM_BOT_TOKEN"
  "TELEGRAM_CHAT_ID"
  "BRAVE_API_KEY"
  "GITHUB_PAT"
)

OPTIONAL_VARS=(
  "NISHA_WORKER_URL"
  "NISHA_WORKER_SECRET"
)

FAILED=0

echo "Validating environment variables..."
echo ""

# Check required variables
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${RED}✗ MISSING REQUIRED: $var${NC}"
    FAILED=1
  else
    echo -e "${GREEN}✓ $var${NC}"
  fi
done

# Check optional variables
for var in "${OPTIONAL_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${YELLOW}⚠ OPTIONAL: $var (not set)${NC}"
  else
    echo -e "${GREEN}✓ $var${NC}"
  fi
done

if [ $FAILED -eq 1 ]; then
  echo ""
  echo -e "${RED}❌ Environment validation failed!${NC}"
  echo "   Copy .env.example to .env and fill in all required variables."
  echo "   Then: source .env && bash scripts/validate-env.sh"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ All environment variables valid!${NC}"
exit 0

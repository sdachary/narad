#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# update.sh — Update Narad: pull latest code + NullClaw binary + restart
# ══════════════════════════════════════════════════════════════════════

set -euo pipefail

NARAD_DIR="$HOME/narad"
NULLCLAW_BIN="/usr/local/bin/nullclaw"

echo "→ Updating Narad..."

# ── Pull latest code ──────────────────────────────────────────────────
git -C "$NARAD_DIR" pull origin main
echo "  ✓ Code updated"

# ── npm install in case dependencies changed ──────────────────────────
cd "$NARAD_DIR"
npm install --silent
echo "  ✓ Dependencies up to date"

# ── Update NullClaw binary ────────────────────────────────────────────
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
  URL="https://github.com/nullclaw/nullclaw/releases/latest/download/nullclaw-linux-aarch64.bin"
else
  URL="https://github.com/nullclaw/nullclaw/releases/latest/download/nullclaw-linux-x86_64.bin"
fi

CURRENT=$($NULLCLAW_BIN --version 2>/dev/null || echo "unknown")
sudo wget -q "$URL" -O "$NULLCLAW_BIN"
sudo chmod +x "$NULLCLAW_BIN"
NEW=$($NULLCLAW_BIN --version 2>/dev/null || echo "unknown")
echo "  NullClaw: $CURRENT → $NEW"

# ── Rebuild NullClaw config.json from updated template ────────────────
# Re-source .env in case any keys changed
ENV_FILE="$NARAD_DIR/.env"
if [ -f "$ENV_FILE" ]; then
  set -a; source "$ENV_FILE"; set +a
fi

TEMPLATE="$NARAD_DIR/config/config.example.json"
DEST="$HOME/.nullclaw/config.json"
if [ -f "$TEMPLATE" ] && [ -d "$(dirname $DEST)" ]; then
  if command -v envsubst &>/dev/null; then
    envsubst < "$TEMPLATE" > "$DEST"
  else
    sed \
      -e "s|\${GROQ_API_KEY}|${GROQ_API_KEY:-}|g" \
      -e "s|\${OPENROUTER_API_KEY}|${OPENROUTER_API_KEY:-}|g" \
      -e "s|\${TELEGRAM_BOT_TOKEN}|${TELEGRAM_BOT_TOKEN:-}|g" \
      -e "s|\${TELEGRAM_CHAT_ID}|${TELEGRAM_CHAT_ID:-}|g" \
      "$TEMPLATE" > "$DEST"
  fi
  chmod 600 "$DEST"
  echo "  ✓ NullClaw config.json rebuilt"
fi

# ── Sync knowledge ────────────────────────────────────────────────────
"$NARAD_DIR/scripts/sync-knowledge.sh"

# ── Restart service ───────────────────────────────────────────────────
sudo systemctl restart narad
echo "  ✓ Narad restarted"

echo "→ Update complete"

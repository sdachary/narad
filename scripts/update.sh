#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# update.sh — Update NullClaw binary + Narad config
# ══════════════════════════════════════════════════════════════════════

set -e

echo "→ Updating Narad..."

# Pull latest narad config
git -C "$HOME/narad" pull origin main

# Update NullClaw binary
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ]; then
  URL="https://github.com/nullclaw-ai/nullclaw/releases/latest/download/nullclaw-linux-arm64"
else
  URL="https://github.com/nullclaw-ai/nullclaw/releases/latest/download/nullclaw-linux-amd64"
fi

CURRENT=$(/usr/local/bin/nullclaw --version 2>/dev/null || echo "unknown")
sudo wget -q "$URL" -O /usr/local/bin/nullclaw
sudo chmod +x /usr/local/bin/nullclaw
NEW=$(/usr/local/bin/nullclaw --version 2>/dev/null || echo "unknown")

echo "  NullClaw: $CURRENT → $NEW"

# Copy updated config
cp "$HOME/narad/config/config.toml" "$HOME/.nullclaw/config.toml" 2>/dev/null || true

# Sync knowledge
"$HOME/narad/scripts/sync-knowledge.sh"

# Restart service
sudo systemctl restart narad
echo "✓ Narad updated and restarted"

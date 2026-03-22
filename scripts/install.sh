#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# Narad — One-Command Installer
# Run on your OCI VM: chmod +x scripts/install.sh && ./scripts/install.sh
# ══════════════════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
TEAL='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

NARAD_DIR="$HOME/narad"
NULLCLAW_BIN="/usr/local/bin/nullclaw"
NULLCLAW_CONFIG="$HOME/.nullclaw"
SYSTEMD_SERVICE="/etc/systemd/system/narad.service"

echo -e "${TEAL}"
echo "  ███╗   ██╗ █████╗ ██████╗  █████╗ ██████╗ "
echo "  ████╗  ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗"
echo "  ██╔██╗ ██║███████║██████╔╝███████║██║  ██║"
echo "  ██║╚██╗██║██╔══██║██╔══██╗██╔══██║██║  ██║"
echo "  ██║ ╚████║██║  ██║██║  ██║██║  ██║██████╔╝"
echo "  ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ "
echo -e "${NC}"
echo -e "${TEAL}  Nisha Platform Intelligence Brain${NC}"
echo ""

# ── Check .env exists ─────────────────────────────────────────────────
if [ ! -f "$NARAD_DIR/.env" ]; then
  echo -e "${RED}❌ .env file not found at $NARAD_DIR/.env${NC}"
  echo -e "   Copy .env.example to .env and fill in your keys first:"
  echo -e "   ${YELLOW}cp .env.example .env && nano .env${NC}"
  exit 1
fi

echo -e "${GREEN}✓ .env found${NC}"

# ── Load env vars ─────────────────────────────────────────────────────
set -a; source "$NARAD_DIR/.env"; set +a

# ── Install Node (for MCP servers) ───────────────────────────────────
if ! command -v node &> /dev/null; then
  echo -e "${TEAL}→ Installing Node.js...${NC}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# ── Download NullClaw binary ──────────────────────────────────────────
echo -e "${TEAL}→ Downloading NullClaw...${NC}"
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ]; then
  NULLCLAW_URL="https://github.com/nullclaw-ai/nullclaw/releases/latest/download/nullclaw-linux-arm64"
else
  NULLCLAW_URL="https://github.com/nullclaw-ai/nullclaw/releases/latest/download/nullclaw-linux-amd64"
fi

sudo wget -q "$NULLCLAW_URL" -O "$NULLCLAW_BIN"
sudo chmod +x "$NULLCLAW_BIN"
echo -e "${GREEN}✓ NullClaw installed at $NULLCLAW_BIN${NC}"

# ── Create config directories ─────────────────────────────────────────
mkdir -p "$NULLCLAW_CONFIG"
mkdir -p "$NULLCLAW_CONFIG/logs"

# ── Copy config ───────────────────────────────────────────────────────
if [ -f "$NARAD_DIR/config/config.toml" ]; then
  cp "$NARAD_DIR/config/config.toml" "$NULLCLAW_CONFIG/config.toml"
  echo -e "${GREEN}✓ Config copied${NC}"
else
  echo -e "${YELLOW}⚠ config/config.toml not found — copying example${NC}"
  cp "$NARAD_DIR/config/config.example.toml" "$NULLCLAW_CONFIG/config.toml"
  echo -e "${YELLOW}  Edit $NULLCLAW_CONFIG/config.toml with your actual values${NC}"
fi

# ── Validate required env vars ────────────────────────────────────────
echo -e "${TEAL}→ Validating environment...${NC}"
ERRORS=0
for VAR in GROQ_API_KEY TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID QDRANT_URL QDRANT_API_KEY; do
  if [ -z "${!VAR}" ]; then
    echo -e "${RED}  ❌ Missing: $VAR${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}  ✓ $VAR${NC}"
  fi
done

if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}❌ $ERRORS required env vars missing. Fill in .env and re-run.${NC}"
  exit 1
fi

# ── Install systemd service ───────────────────────────────────────────
echo -e "${TEAL}→ Installing systemd service...${NC}"
sudo cp "$NARAD_DIR/systemd/narad.service" "$SYSTEMD_SERVICE"

# Inject env file path into service
sudo sed -i "s|NARAD_DIR_PLACEHOLDER|$NARAD_DIR|g" "$SYSTEMD_SERVICE"
sudo sed -i "s|HOME_PLACEHOLDER|$HOME|g" "$SYSTEMD_SERVICE"
sudo sed -i "s|USER_PLACEHOLDER|$(whoami)|g" "$SYSTEMD_SERVICE"

sudo systemctl daemon-reload
sudo systemctl enable narad
echo -e "${GREEN}✓ systemd service installed${NC}"

# ── Clone nisha repo for knowledge sync ──────────────────────────────
if [ ! -d "$HOME/nisha" ] && [ -n "$GITHUB_PAT" ]; then
  echo -e "${TEAL}→ Cloning nisha repo for knowledge sync...${NC}"
  git clone "https://$GITHUB_PAT@github.com/sdachary/nisha.git" "$HOME/nisha" --depth 1 2>/dev/null || true
fi

# ── Initial knowledge sync ────────────────────────────────────────────
echo -e "${TEAL}→ Syncing knowledge base from nisha repo...${NC}"
chmod +x "$NARAD_DIR/scripts/sync-knowledge.sh"
"$NARAD_DIR/scripts/sync-knowledge.sh" || true

# ── Start Narad ───────────────────────────────────────────────────────
echo -e "${TEAL}→ Starting Narad...${NC}"
sudo systemctl start narad
sleep 2

if sudo systemctl is-active --quiet narad; then
  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║     ✓ Narad is running!              ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
  echo ""
  echo -e "  Telegram: Send ${YELLOW}/status${NC} to your bot to verify"
  echo -e "  Web UI:   ${YELLOW}http://YOUR_TAILSCALE_IP:7860${NC}"
  echo -e "  Logs:     ${YELLOW}sudo journalctl -u narad -f${NC}"
  echo ""
else
  echo -e "${RED}❌ Narad failed to start. Check logs:${NC}"
  echo -e "   sudo journalctl -u narad -n 50"
  exit 1
fi

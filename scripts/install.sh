#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# Narad v2 — Install Script
# Tested: Ubuntu 22.04, OCI Always Free E2.1.Micro (x86_64) + A1 (aarch64)
#
# What this does:
#   1. Validate .env has all required keys
#   2. Install Node.js 20 (if not present)
#   3. Install npm dependencies
#   4. Download NullClaw binary (for cron/gateway features)
#   5. Build ~/.nullclaw/config.json from template
#   6. Clone nisha repo + run initial knowledge sync
#   7. Install systemd service for Narad Node.js bot
#   8. Start Narad
#   9. Add daily cron for knowledge sync
#
# Run: chmod +x scripts/install.sh && ./scripts/install.sh
# ══════════════════════════════════════════════════════════════════════

set -euo pipefail

GREEN='\033[0;32m'; TEAL='\033[0;36m'; YELLOW='\033[1;33m'
RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'

log()  { echo -e "${TEAL}→${NC} $1"; }
ok()   { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC}  $1"; }
fail() { echo -e "${RED}✗${NC} $1"; exit 1; }

NARAD_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NULLCLAW_BIN="/usr/local/bin/nullclaw"
NULLCLAW_CONFIG_DIR="$HOME/.nullclaw"
NARAD_DB_DIR="$HOME/.narad"
SERVICE_FILE="/etc/systemd/system/narad.service"
NISHA_DIR="$HOME/nisha"

echo ""
echo -e "${BOLD}  Narad v2 — Install${NC}"
echo "  ─────────────────────────────"
echo ""

# ── Step 1: Load and validate .env ───────────────────────────────────
log "Loading .env..."
ENV_FILE="$NARAD_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
  if [ -f "$NARAD_DIR/.env.example" ]; then
    cp "$NARAD_DIR/.env.example" "$ENV_FILE"
    fail ".env not found — copied .env.example to .env\nEdit $ENV_FILE with your real values and re-run."
  else
    fail ".env not found and .env.example is missing."
  fi
fi

set -a; source "$ENV_FILE"; set +a
ok ".env loaded"

log "Validating required keys..."
ERRORS=0
for VAR in GROQ_API_KEY TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID; do
  VAL="${!VAR:-}"
  if [ -z "$VAL" ] || [[ "$VAL" == *"REPLACE_ME"* ]]; then
    echo -e "  ${RED}✗${NC} $VAR is not set"
    ERRORS=$((ERRORS+1))
  else
    echo -e "  ${GREEN}✓${NC} $VAR"
  fi
done
[ $ERRORS -gt 0 ] && fail "$ERRORS required keys missing. Fix .env and re-run."
ok "All required keys present"

# ── Step 2: Node.js 20 ────────────────────────────────────────────────
log "Checking Node.js..."
if ! command -v node &>/dev/null || [[ "$(node --version)" < "v20" ]]; then
  log "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - >/dev/null 2>&1
  sudo apt-get install -y nodejs >/dev/null 2>&1
fi
ok "Node.js $(node --version)"

# ── Step 3: npm install ────────────────────────────────────────────────
log "Installing npm dependencies..."
cd "$NARAD_DIR"
npm install --silent
ok "Dependencies installed"

# ── Step 4: NullClaw binary ────────────────────────────────────────────
log "Installing NullClaw binary..."
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
  NC_URL="https://github.com/nullclaw/nullclaw/releases/latest/download/nullclaw-linux-aarch64.bin"
else
  NC_URL="https://github.com/nullclaw/nullclaw/releases/latest/download/nullclaw-linux-x86_64.bin"
fi
sudo wget -q --show-progress "$NC_URL" -O "$NULLCLAW_BIN"
sudo chmod +x "$NULLCLAW_BIN"
ok "NullClaw $($NULLCLAW_BIN --version 2>/dev/null || echo 'installed')"

# ── Step 5: Build NullClaw config ─────────────────────────────────────
log "Building NullClaw config..."
mkdir -p "$NULLCLAW_CONFIG_DIR"
TEMPLATE="$NARAD_DIR/config/config.example.json"
if [ ! -f "$TEMPLATE" ]; then
  fail "config/config.example.json not found in repo"
fi

if command -v envsubst &>/dev/null; then
  envsubst < "$TEMPLATE" > "$NULLCLAW_CONFIG_DIR/config.json"
else
  sed \
    -e "s|\${GROQ_API_KEY}|$GROQ_API_KEY|g" \
    -e "s|\${OPENROUTER_API_KEY}|${OPENROUTER_API_KEY:-}|g" \
    -e "s|\${TELEGRAM_BOT_TOKEN}|$TELEGRAM_BOT_TOKEN|g" \
    -e "s|\${TELEGRAM_CHAT_ID}|$TELEGRAM_CHAT_ID|g" \
    "$TEMPLATE" > "$NULLCLAW_CONFIG_DIR/config.json"
fi
chmod 600 "$NULLCLAW_CONFIG_DIR/config.json"
ok "NullClaw config written to $NULLCLAW_CONFIG_DIR/config.json"

# ── Step 6: Knowledge sync ─────────────────────────────────────────────
log "Setting up knowledge base..."
mkdir -p "$NARAD_DIR/knowledge/services"

if [ ! -d "$NISHA_DIR/.git" ] && command -v git &>/dev/null; then
  if [ -n "${GITHUB_PAT:-}" ]; then
    git clone --depth=1 "https://${GITHUB_PAT}@github.com/sdachary/nisha.git" "$NISHA_DIR" 2>/dev/null && ok "Nisha repo cloned"
  else
    git clone --depth=1 "https://github.com/sdachary/nisha.git" "$NISHA_DIR" 2>/dev/null && ok "Nisha repo cloned (public)" || warn "Could not clone nisha repo — knowledge sync will use existing files"
  fi
fi

chmod +x "$NARAD_DIR/scripts/sync-knowledge.sh"
"$NARAD_DIR/scripts/sync-knowledge.sh" || warn "Initial knowledge sync failed — will retry on next run"

# ── Step 7: Create narad db directory ─────────────────────────────────
mkdir -p "$NARAD_DB_DIR"
ok "Database directory ready: $NARAD_DB_DIR"

# ── Step 8: Install systemd service ───────────────────────────────────
log "Installing systemd service..."
CURRENT_USER=$(whoami)
NODE_BIN=$(which node)

sudo tee "$SERVICE_FILE" > /dev/null << UNIT
[Unit]
Description=Narad — Nisha Platform Intelligence Brain (Telegram Bot)
Documentation=https://github.com/sdachary/narad
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${CURRENT_USER}
WorkingDirectory=${NARAD_DIR}
EnvironmentFile=${ENV_FILE}
ExecStart=${NODE_BIN} src/main.js
Restart=on-failure
RestartSec=10s
StartLimitIntervalSec=60s
StartLimitBurst=3

# Resource limits — keep it light alongside Nextcloud + Pi-hole
MemoryMax=256M
CPUQuota=30%

# Logging to systemd journal
StandardOutput=journal
StandardError=journal
SyslogIdentifier=narad

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable narad
ok "systemd service installed at $SERVICE_FILE"

# ── Step 9: Daily cron for knowledge sync ─────────────────────────────
log "Setting up daily knowledge sync cron..."
CRON_JOB="0 6 * * * ${NARAD_DIR}/scripts/sync-knowledge.sh >> /tmp/narad-sync.log 2>&1"
(crontab -l 2>/dev/null | grep -v "sync-knowledge"; echo "$CRON_JOB") | crontab -
ok "Cron job added: daily 6am knowledge sync"

# ── Step 10: Start ─────────────────────────────────────────────────────
log "Starting Narad..."
sudo systemctl start narad
sleep 3

if sudo systemctl is-active --quiet narad; then
  echo ""
  echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════╗"
  echo -e "║  ✓ Narad is running                      ║"
  echo -e "╚══════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "  Telegram:  Send ${YELLOW}/status${NC} to your bot to verify"
  echo -e "  Logs:      ${YELLOW}sudo journalctl -u narad -f${NC}"
  echo -e "  Restart:   ${YELLOW}sudo systemctl restart narad${NC}"
  echo ""
else
  fail "Narad failed to start.\n  Check: sudo journalctl -u narad -n 50"
fi

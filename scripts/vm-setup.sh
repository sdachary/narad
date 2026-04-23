#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# Znext Master Setup — VM Initialization Script
# Purpose: Set up OCI VM for development with opencode + all services
# Tested: Ubuntu 22.04, OCI VM (4 OCPU, 16GB RAM recommended)
# ══════════════════════════════════════════════════════════════════════

set -euo pipefail

# ══════════════════════════════════════════════════════════════════════
# Configuration
# ══════════════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORK_DIR="$HOME/Work"

# Colors
GREEN='\033[0;32m'; TEAL='\033[0;36m'; YELLOW='\033[1;33m'
RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'

# ══════════════════════════════════════════════════════════════════════
# Functions
# ══════════════════════════════════════════════════════════════════════

log()   { echo -e "${TEAL}→${NC} $1"; }
ok()    { echo -e "${GREEN}✓${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠${NC}  $1"; }
fail()  { echo -e "${RED}✗${NC} $1"; exit 1; }

# ══════════════════════════════════════════════════════════════════════
# Pre-flight Checks
# ══════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BOLD}  Znext VM Setup${NC}"
echo "  ───────────────────"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then
    warn "Running as root — some features may need a regular user"
fi

# Check OS
if ! grep -q "Ubuntu" /etc/os-release; then
    fail "This script is designed for Ubuntu 22.04+"
fi
ok "Ubuntu detected: $(grep PRETTY_NAME /etc/os-release | cut -d'"' -f2)"

# Check internet
if ! curl -sf https://google.com >/dev/null 2>&1; then
    fail "No internet connection"
fi
ok "Internet connection available"

# ══════════════════════════════════════════════════════════════════════
# Step 1: System Updates
# ══════════════════════════════════════════════════════════════════════

log "Updating system packages..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
ok "System updated"

# ══════════════════════════════════════════════════════════════════════
# Step 2: Core System Packages
# ══════════════════════════════════════════════════════════════════════

log "Installing core system packages..."

CORE_PACKAGES=(
    curl
    wget
    git
    unzip
    zip
    build-essential
    software-properties-common
    ca-certificates
    gnupg
    lsb-release
    jq
    htop
    tmux
    vim
    tree
)

sudo apt-get install -y -qq "${CORE_PACKAGES[@]}"
ok "Core packages installed"

# ══════════════════════════════════════════════════════════════════════
# Step 3: Node.js 20
# ══════════════════════════════════════════════════════════════════════

log "Installing Node.js 20..."

if ! command -v node &>/dev/null || [[ "$(node --version 2>/dev/null)" < "v20" ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - >/dev/null 2>&1
    sudo apt-get install -y -qq nodejs >/dev/null 2>&1
fi
ok "Node.js $(node --version)"

# Install global npm packages
log "Installing global npm packages..."
npm install -g npm@latest 2>/dev/null || true
ok "npm $(npm --version)"

# ══════════════════════════════════════════════════════════════════════
# Step 4: Python 3 & pip
# ══════════════════════════════════════════════════════════════════════

log "Installing Python 3..."

if ! command -v python3 &>/dev/null; then
    sudo apt-get install -y -qq python3 python3-pip python3-venv
fi
ok "Python $(python3 --version)"

# Upgrade pip
log "Upgrading pip..."
python3 -m pip install --upgrade pip -q 2>/dev/null || true
ok "pip ready"

# ══════════════════════════════════════════════════════════════════════
# Step 5: Docker (Optional but recommended)
# ══════════════════════════════════════════════════════════════════════

log "Checking Docker..."

if command -v docker &>/dev/null; then
    ok "Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) already installed"
else
    warn "Docker not installed — indra/n8n will need manual setup"
    log "To install: sudo apt-get install docker.io && sudo usermod -aG docker $USER"
fi

# ══════════════════════════════════════════════════════════════════════
# Step 6: opencode CLI
# ══════════════════════════════════════════════════════════════════════

log "Installing opencode CLI..."

if command -v opencode &>/dev/null; then
    ok "opencode $(opencode --version 2>/dev/null || echo 'already installed')"
else
    # Try different installation methods
    if [ "$(uname -m)" = "x86_64" ]; then
        curl -fsSL https://opencode.ai/install.sh | bash -s -- -b /usr/local/bin 2>/dev/null || \
        curl -fsSL https://github.com/opencodeai/opencode/releases/latest/download/opencode-linux-x64 -o /usr/local/bin/opencode
    elif [ "$(uname -m)" = "aarch64" ]; then
        curl -fsSL https://github.com/opencodeai/opencode/releases/latest/download/opencode-linux-arm64 -o /usr/local/bin/opencode
    fi
    
    if [ -f /usr/local/bin/opencode ]; then
        sudo chmod +x /usr/local/bin/opencode
        ok "opencode installed"
    else
        warn "opencode installation failed — will use npm version"
    fi
fi

# Alternative: npm global (fallback)
if ! command -v opencode &>/dev/null; then
    log "Trying npm installation..."
    npm install -g opencode-cli 2>/dev/null || true
    if command -v opencode &>/dev/null; then
        ok "opencode installed via npm"
    fi
fi

# ══════════════════════════════════════════════════════════════════════
# Step 7: Clone Work Repository
# ══════════════════════════════════════════════════════════════════════

log "Setting up Work directory..."

if [ -d "$WORK_DIR" ]; then
    warn "Work directory already exists at $WORK_DIR"
    read -p "Update from git? [Y/n]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [ -z "$REPLY" ]; then
        cd "$WORK_DIR"
        git pull origin main 2>/dev/null || warn "Git pull failed — may need manual sync"
        ok "Work repo updated"
    fi
else
    log "Cloning Work repository..."
    # Try to clone - might need authentication
    if [ -n "${GITHUB_PAT:-}" ]; then
        git clone "https://${GITHUB_PAT}@github.com/sdachary/Work.git" "$WORK_DIR" 2>/dev/null || \
        git clone "https://github.com/sdachary/Work.git" "$WORK_DIR"
    else
        git clone "https://github.com/sdachary/Work.git" "$WORK_DIR"
    fi
    ok "Work repository cloned to $WORK_DIR"
fi

# ══════════════════════════════════════════════════════════════════════
# Step 8: Setup Service Directories
# ══════════════════════════════════════════════════════════════════════

log "Creating service directories..."

mkdir -p "$HOME/.narad"        # Narad data
mkdir -p "$HOME/.nullclaw"     # NullClaw config
mkdir -p "$HOME/nisha"         # Knowledge base
mkdir -p "$HOME/backups"       # Backup storage

ok "Service directories created"

# ══════════════════════════════════════════════════════════════════════
# Step 9: Environment Files
# ══════════════════════════════════════════════════════════════════════

log "Checking environment files..."

# Narad .env
if [ -f "$WORK_DIR/narad/.env.example" ] && [ ! -f "$WORK_DIR/narad/.env" ]; then
    cp "$WORK_DIR/narad/.env.example" "$WORK_DIR/narad/.env"
    warn "Created narad/.env — edit with your API keys"
fi

# chitragupta .env
if [ -f "$WORK_DIR/chitragupta/.env.example" ] && [ ! -f "$WORK_DIR/chitragupta/.env" ]; then
    cp "$WORK_DIR/chitragupta/.env.example" "$WORK_DIR/chitragupta/.env"
    warn "Created chitragupta/.env — edit with your API keys"
fi

# karma .env (if exists)
if [ -f "$WORK_DIR/karma/.env.example" ] && [ ! -f "$WORK_DIR/karma/.env" ]; then
    cp "$WORK_DIR/karma/.env.example" "$WORK_DIR/karma/.env"
    warn "Created karma/.env — edit with your API keys"
fi

ok "Environment files ready"

# ══════════════════════════════════════════════════════════════════════
# Step 10: Install npm Dependencies
# ══════════════════════════════════════════════════════════════════════

log "Installing npm dependencies for services..."

# Narad
if [ -d "$WORK_DIR/narad" ]; then
    cd "$WORK_DIR/narad"
    npm install --silent 2>/dev/null || warn "npm install failed for narad"
    ok "narad dependencies ready"
fi

# ══════════════════════════════════════════════════════════════════════
# Step 11: Install Python Dependencies
# ══════════════════════════════════════════════════════════════════════

log "Installing Python dependencies for services..."

# Karma
if [ -d "$WORK_DIR/karma" ]; then
    if [ -f "$WORK_DIR/karma/requirements.txt" ]; then
        cd "$WORK_DIR/karma"
        pip install -r requirements.txt -q 2>/dev/null || warn "pip install failed for karma"
        ok "karma dependencies ready"
    fi
fi

# ══════════════════════════════════════════════════════════════════════
# Step 12: Configure SSH for Git
# ══════════════════════════════════════════════════════════════════════

log "Configuring Git..."

git config --global user.name "Deepak" 2>/dev/null || true
git config --global user.email "deepak@example.com" 2>/dev/null || true
ok "Git configured"

# ══════════════════════════════════════════════════════════════════════
# Step 13: Firewall Configuration
# ══════════════════════════════════════════════════════════════════════

log "Configuring firewall..."

if command -v ufw &>/dev/null; then
    sudo ufw --force enable 2>/dev/null || true
    sudo ufw allow 22/tcp   # SSH
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 443/tcp  # HTTPS
    ok "Firewall configured (22, 80, 443 open)"
else
    warn "ufw not available — skipping firewall"
fi

# ══════════════════════════════════════════════════════════════════════
# Step 14: Systemd Services (Optional)
# ══════════════════════════════════════════════════════════════════════

log "Checking systemd services..."

# Check if we should create services
if [ -f "$WORK_DIR/narad/.env" ]; then
    set -a; source "$WORK_DIR/narad/.env"; set +a
    
    if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ "$TELEGRAM_BOT_TOKEN" != "REPLACE_ME" ]; then
        warn "Narad has valid credentials — would you like to set up systemd service?"
        read -p "Create narad systemd service? [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cat << 'EOF' | sudo tee /etc/systemd/system/narad.service > /dev/null
[Unit]
Description=Narad — AI Assistant (Telegram Bot)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/Work/narad
EnvironmentFile=/home/ubuntu/Work/narad/.env
ExecStart=/usr/bin/node src/main.js
Restart=on-failure
RestartSec=10s
MemoryMax=512M

[Install]
WantedBy=multi-user.target
EOF
            sudo systemctl daemon-reload
            sudo systemctl enable narad 2>/dev/null || true
            ok "Narad systemd service created"
        fi
    fi
fi

# ══════════════════════════════════════════════════════════════════════
# Step 15: Summary
# ══════════════════════════════════════════════════════════════════════

echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════╗"
echo -e "║  ✓ VM Setup Complete                  ║"
echo -e "╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}Next Steps:${NC}"
echo "  ─────────────────────────────────────────"
echo ""
echo -e "  1. ${YELLOW}Edit API keys${NC} — Update .env files with real credentials"
echo "     - $WORK_DIR/narad/.env"
echo "     - $WORK_DIR/chitragupta/.env"
echo ""
echo -e "  2. ${YELLOW}Test services${NC} — Run health checks"
echo "     - cd $WORK_DIR/narad && node src/main.js"
echo ""
echo -e "  3. ${YELLOW}SSH access${NC} — Connect from your local machine"
echo "     - ssh ubuntu@<your-vm-ip>"
echo ""
echo -e "  4. ${YELLOW}opencode${NC} — Use opencode in the VM"
echo "     - opencode . (inside the VM)"
echo ""
echo -e "  5. ${YELLOW}Sync changes${NC} — Push from VM to GitHub"
echo "     - git add . && git commit -m 'VM setup' && git push"
echo ""
echo "────────────────────────────────────────────"
echo ""

# Health check hint
if [ -f "$WORK_DIR/Znext/Old/health-check.sh" ]; then
    echo -e "  Run health check: ${TEAL}$WORK_DIR/Znext/Old/health-check.sh${NC}"
fi

echo ""
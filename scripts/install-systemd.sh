#!/bin/bash
# Install systemd service for Narad
# Detects correct user and path automatically

set -euo pipefail

NARAD_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CURRENT_USER=$(whoami)
NODE_BIN=$(which node 2>/dev/null || echo "/usr/bin/node")
SERVICE_FILE="/etc/systemd/system/narad.service"

echo "Installing Narad systemd service..."
echo "  NARAD_DIR:  $NARAD_DIR"
echo "  User:       $CURRENT_USER"
echo "  Node:       $NODE_BIN"

# Verify .env exists and source it before validating
if [ ! -f "$NARAD_DIR/.env" ]; then
  echo "Error: $NARAD_DIR/.env not found"
  echo "Run: cp .env.example .env && nano .env"
  exit 1
fi
set -a; source "$NARAD_DIR/.env"; set +a

# Validate environment
bash "$NARAD_DIR/scripts/validate-env.sh" || exit 1

# Install the service file from repo with runtime paths injected
sudo tee "$SERVICE_FILE" > /dev/null << UNIT
[Unit]
Description=Narad — Nisha Platform Intelligence Brain (Telegram Bot)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${CURRENT_USER}
WorkingDirectory=${NARAD_DIR}
EnvironmentFile=${NARAD_DIR}/.env
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin"
ExecStartPre=/bin/bash ${NARAD_DIR}/scripts/validate-env.sh
ExecStart=${NODE_BIN} ${NARAD_DIR}/src/main.js
Restart=on-failure
RestartSec=10s
StartLimitIntervalSec=60s
StartLimitBurst=3
MemoryMax=256M
CPUQuota=30%
StandardOutput=journal
StandardError=journal
SyslogIdentifier=narad
NoNewPrivileges=true
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=${NARAD_DIR} ${HOME}/.narad ${HOME}/.nullclaw /tmp

[Install]
WantedBy=multi-user.target
UNIT

sudo chown root:root "$SERVICE_FILE"
sudo chmod 644 "$SERVICE_FILE"
sudo systemctl daemon-reload
sudo systemctl enable narad

echo "✓ Service installed: $SERVICE_FILE"
echo "  Start:  sudo systemctl start narad"
echo "  Status: sudo systemctl status narad"
echo "  Logs:   sudo journalctl -u narad -f"

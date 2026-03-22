#!/bin/bash
# Install systemd service

NARAD_DIR="/home/deepak/Work/narad"
SYSTEMD_SERVICE="/etc/systemd/system/narad.service"

echo "Installing Narad systemd service..."

# Verify .env exists
if [ ! -f "$NARAD_DIR/.env" ]; then
  echo "Error: $NARAD_DIR/.env not found"
  echo "Run: cp .env.example .env && nano .env"
  exit 1
fi

# Validate environment
cd "$NARAD_DIR"
bash scripts/validate-env.sh || exit 1

# Copy systemd service
echo "Installing service file..."
sudo cp "$NARAD_DIR/systemd/narad.service" "$SYSTEMD_SERVICE"

# Inject actual paths
sudo sed -i "s|NARAD_DIR_PLACEHOLDER|$NARAD_DIR|g" "$SYSTEMD_SERVICE"
sudo sed -i "s|USER_PLACEHOLDER|$(whoami)|g" "$SYSTEMD_SERVICE"

# Set permissions
sudo chown root:root "$SYSTEMD_SERVICE"
sudo chmod 644 "$SYSTEMD_SERVICE"

# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable narad

echo "✓ Service installed and enabled"
echo ""
echo "Start with: sudo systemctl start narad"
echo "Check status: sudo systemctl status narad"
echo "View logs: sudo journalctl -u narad -f"

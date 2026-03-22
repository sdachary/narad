#!/bin/bash
# Continuous monitoring of Narad service

set -e

NARAD_DIR="/home/deepak/Work/narad"
LOG_FILE="${NARAD_DIR}/narad.log"

echo "Starting Narad monitoring..."
echo "Log file: $LOG_FILE"
echo "Press Ctrl+C to stop"

while true; do
  clear
  echo "Narad Monitoring Dashboard"
  echo "═══════════════════════════════════════════════════════════════"
  echo "Time: $(date)"
  echo ""
  
  # Service status
  echo "Service Status:"
  sudo systemctl status narad --no-pager | head -3
  echo ""
  
  # Recent activity
  echo "Recent Activity (last 10 lines):"
  sudo journalctl -u narad -n 10 --no-pager
  echo ""
  
  # Health status
  echo "Health Status:"
  bash "$NARAD_DIR/scripts/health-check.sh" 2>&1 | grep -E "^[^ ]|^(✓|✗)"
  echo ""
  
  echo "═══════════════════════════════════════════════════════════════"
  echo "Refreshing in 30 seconds... (Ctrl+C to stop)"
  sleep 30
done

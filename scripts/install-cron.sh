#!/bin/bash
# Install automated backup cron job

NARAD_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CRON_JOB="0 2 * * * $NARAD_DIR/scripts/backup-qdrant.sh >> /var/log/narad-backup.log 2>&1"

# Install cron job for current user
(crontab -l 2>/dev/null || echo "") | grep -v "backup-qdrant.sh" | crontab -
echo "$CRON_JOB" | crontab -

echo "✓ Backup cron job installed (daily at 2 AM)"

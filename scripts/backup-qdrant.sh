#!/bin/bash
# Backup Qdrant database

set -e

BACKUP_DIR="$NARAD_DIR/backups"
QDRANT_URL="${QDRANT_URL}"
QDRANT_API_KEY="${QDRANT_API_KEY}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "Backing up Qdrant snapshots..."

# Backup all collections
curl -s -X GET "$QDRANT_URL/collections" \
  -H "api-key: $QDRANT_API_KEY" \
  -H "Content-Type: application/json" \
  | jq -r '.result.collections[].name' \
  | while read -r collection; do
    echo "  Creating snapshot for: $collection"
    
    curl -s -X POST "$QDRANT_URL/collections/${collection}/snapshots" \
      -H "api-key: $QDRANT_API_KEY" \
      -H "Content-Type: application/json" \
      > "${BACKUP_DIR}/snapshot-${collection}-${TIMESTAMP}.json"
  done

# Keep only last 7 days of snapshot JSONs
find "$BACKUP_DIR" -name "snapshot-*.json" -mtime +7 -delete

echo "✓ Snapshot backup check complete"

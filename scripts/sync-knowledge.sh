#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# sync-knowledge.sh — Pull latest context from nisha repo into Narad
# Run manually or via cron: 0 6 * * * /home/ubuntu/narad/scripts/sync-knowledge.sh
# ══════════════════════════════════════════════════════════════════════

NISHA_DIR="$HOME/nisha"
KNOWLEDGE_DIR="$HOME/narad/knowledge"

echo "→ Syncing knowledge from nisha repo..."

# Pull latest nisha repo
if [ -d "$NISHA_DIR/.git" ]; then
  git -C "$NISHA_DIR" pull --quiet origin main 2>/dev/null || echo "  ⚠ Could not pull nisha — using cached"
fi

# ── Sync README as main platform context ─────────────────────────────
if [ -f "$NISHA_DIR/README.md" ]; then
  cp "$NISHA_DIR/README.md" "$KNOWLEDGE_DIR/nisha-platform.md"
  echo "  ✓ nisha-platform.md synced"
fi

# ── Sync per-service READMEs ─────────────────────────────────────────
declare -A SERVICE_MAP=(
  ["services/cloudprovision/README.md"]="services/cloudprovision.md"
  ["services/saas/README.md"]="services/gold-saas.md"
  ["services/syncledger/README.md"]="services/syncledger.md"
  ["services/agi/README.md"]="services/agi.md"
  ["services/cloudprovision/CHECKPOINT.md"]="services/cloudprovision-checkpoint.md"
)

for SRC in "${!SERVICE_MAP[@]}"; do
  DEST="${SERVICE_MAP[$SRC]}"
  if [ -f "$NISHA_DIR/$SRC" ]; then
    cp "$NISHA_DIR/$SRC" "$KNOWLEDGE_DIR/$DEST"
    echo "  ✓ $DEST synced"
  fi
done

# ── Restart Narad to reload knowledge ────────────────────────────────
if sudo systemctl is-active --quiet narad 2>/dev/null; then
  sudo systemctl reload narad 2>/dev/null || sudo systemctl restart narad 2>/dev/null || true
  echo "  ✓ Narad reloaded with new knowledge"
fi

echo "→ Knowledge sync complete"

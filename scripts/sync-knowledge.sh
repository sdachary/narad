#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# sync-knowledge.sh
# Pull latest READMEs from nisha repo into Narad's knowledge base.
# Run manually or via cron: 0 6 * * * ~/narad/scripts/sync-knowledge.sh
# ══════════════════════════════════════════════════════════════════════

NISHA_DIR="$HOME/nisha"
KNOWLEDGE_DIR="$HOME/narad/knowledge"

mkdir -p "$KNOWLEDGE_DIR/services"

echo "→ Syncing knowledge from nisha repo..."

# ── Pull latest nisha repo ────────────────────────────────────────────
if [ -d "$NISHA_DIR/.git" ]; then
  git -C "$NISHA_DIR" pull --quiet origin main 2>/dev/null \
    || echo "  ⚠ Could not pull nisha — using cached"
else
  echo "  ⚠ Nisha repo not found at $NISHA_DIR — skipping git pull"
fi

# ── Sync files ────────────────────────────────────────────────────────
declare -A SERVICE_MAP=(
  ["README.md"]="nisha-platform.md"
  ["services/cloudprovision/README.md"]="services/cloudprovision.md"
  ["services/saas/README.md"]="services/gold-saas.md"
  ["services/syncledger/README.md"]="services/syncledger.md"
  ["services/agi/README.md"]="services/agi.md"
  ["services/cloudprovision/CHECKPOINT.md"]="services/cloudprovision-checkpoint.md"
)

for SRC in "${!SERVICE_MAP[@]}"; do
  DEST="${SERVICE_MAP[$SRC]}"
  FULL_SRC="$NISHA_DIR/$SRC"
  FULL_DEST="$KNOWLEDGE_DIR/$DEST"
  if [ -f "$FULL_SRC" ]; then
    cp "$FULL_SRC" "$FULL_DEST"
    echo "  ✓ $DEST"
  fi
done

# ── Signal Narad to reload knowledge cache ────────────────────────────
# The FileKnowledgeLoader caches for 5 minutes, so a restart is optional.
# We only restart if the service is already running.
if sudo systemctl is-active --quiet narad 2>/dev/null; then
  sudo systemctl reload narad 2>/dev/null \
    || sudo systemctl restart narad 2>/dev/null \
    || true
  echo "  ✓ Narad signalled to reload"
fi

echo "→ Knowledge sync complete"

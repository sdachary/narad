# Narad v1 → v2 Migration Record

**Date:** $(date)
**From:** v1 (Telegram + port 7860)
**To:** v2 (Clean Architecture)
**Status:** ✓ Complete

## Changes in v2
- Clean Architecture (domain → application → infrastructure → interface)
- Improved code organization and testability
- Better dependency injection
- Enhanced configuration validation
- Same Telegram interface, improved internals

## Update: 2026-03-24
- ✓ Fix: Node.js 20 deprecation in GitHub Actions (opted into Node 24)
- ✓ Fix: Private repository auth in Terraform `remote-exec`
- ✓ Feat: Knowledge upload via Telegram (manual `.md` upload)

## Data Preserved
- ✓ .env configuration
- ✓ Memory database (~/.narad/memory.db)
- ✓ Knowledge files (~/narad/knowledge/)
- ✓ Backup: ~/narad-backups/narad-v1-backup-*.tar.gz

## Rollback Procedure (if needed)

If issues arise, rollback to v1:

\`\`\`bash
# 1. Stop current service
sudo systemctl stop narad

# 2. Swap back to v1
mv ~/Work/narad ~/Work/narad-v2-old
mv ~/Work/narad-v1-old ~/Work/narad

# 3. Start service
sudo systemctl start narad

# 4. Verify
sudo systemctl status narad
\`\`\`

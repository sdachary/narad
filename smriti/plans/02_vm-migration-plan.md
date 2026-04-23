# VM Migration Plan

## Goal

Migrate development from local machine to OCI VM with opencode CLI.

---

## Status: ⏳ Pending Execution

---

## Prerequisites

- [ ] OCI Free Tier VM (Ubuntu 22.04, 4+ OCPU, 16GB RAM)
- [ ] SSH key for password-less login

---

## Execution (1-Day)

### Step 1: Create VM
- Create VM in OCI Console with Ubuntu 22.04
- Allocate >= 4 OCPUs, 16GB RAM

### Step 2: Run Setup Script
```bash
curl -sL https://raw.githubusercontent.com/sdachary/Work/main/Znext/vm-setup.sh | bash
```

This installs:
- Node.js 20, Python3, Git, Docker
- opencode CLI
- Clones Work repository
- Configures firewall

### Step 3: Configure Local SSH
Add to `~/.ssh/config`:
```
Host work-vm
    HostName <VM-IP>
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
```

### Step 4: Verify
- `ssh work-vm` connects
- `opencode .` works on VM

### Step 5: Start Services (Optional)
```bash
cd /home/deepak/Work/indra && docker compose up -d
```

---

## Rollback

Keep local development until VM verified.

---

## Post-Migration

1. Update docs with VM IP
2. Set up backup for Work repo
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/CLIENT_GUIDE-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 226
size: 7217 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docker, docs, documentation, markdown, project/narad]
---

# CLIENT_GUIDE-md.md

> Documentation using **docker** (226 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/CLIENT_GUIDE-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 226 |
| **Size** | 7217 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/CLIENT_GUIDE.md"
project: "vishwakarma"
role: docs
language: markdown
frameworks: [docker]
lines: 188
size: 6497 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [docker, docs, documentation, markdown, project/vishwakarma]
---

# CLIENT_GUIDE.md

> Documentation using **docker** (188 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/CLIENT_GUIDE.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 188 |
| **Size** | 6497 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Vishwakarma Cloud — Client Guide

> This file lives at `./docs/CLIENT_GUIDE.md` in the vishwakarma repo.
> Cloud Helper fetches it fresh from GitHub every 15 minutes — update it here
> and Bhaina automatically knows about it without redeployment.

---

## Your Private Cloud Services

### ☁️ Nextcloud — Your Private Storage

Nextcloud is your own personal Google Drive. Your files live on your server — not on anyone else's computer.

**Getting started:**
1. Open your Nextcloud URL (from your welcome email)
2. Login with username `admin` and the password from your welcome email
3. Change your password: click your profile icon (top right) → Settings → Security → Change password

**Upload files:**
- Drag and drop files directly into the browser
- Or click the **+** button → Upload files
- For large amounts of files, use the **Nextcloud desktop app** (much faster)

**Install on your phone:**
1. Search "Nextcloud" in App Store (iPhone) or Play Store (Android)
2. Open the app → Add account
3. Enter your Nextcloud URL and your login details

**Share files with someone:**
1. Right-click (or long-press) any file or folder
2. Click Share → Share link
3. Copy the link and send it — they don't need a Nextcloud account

**Storage sizes:**
- 50GB — good for documents, photos from a few years
- 100GB — good for a family's photos and documents
- 150GB — good for a small business with many files

---

### 🛡️ Pi-hole — Ad Blocker for All Your Devices

Pi-hole blocks ads and trackers on every device connected to your network — automatically. No app needed on each device.

**Set it up — choose ONE method:**

**Method A — Your Router (blocks ads for everyone at home):**
1. Log into your router (usually at 192.168.1.1 or 192.168.0.1)
2. Find DHCP or DNS Settings
3. Set Primary DNS to your VM's IP address (from welcome email)
4. Save and restart router
5. All devices on your WiFi now have ad blocking

**Method B — Individual device:**

*iPhone/iPad:*
1. Settings → Wi-Fi → tap the ⓘ next to your network
2. Configure DNS → Manual
3. Delete existing entries → Add Server → type your VM IP
4. Save

*Android:*
1. Settings → Wi-Fi → long press your network → Modify network
2. Advanced options → IP settings: Static
3. DNS 1: your VM IP → Save

*Windows 11:*
1. Settings → Network & Internet → your connection → DNS server assignment
2. Edit → Manual → IPv4 on
3. Preferred DNS: your VM IP → Save

*Mac:*
1. System Settings → Network → Wi-Fi → Details
2. DNS tab → click + → type your VM IP → OK → Apply

**Pi-hole Admin Panel:**
Go to `http://YOUR_VM_IP/admin` to see stats, whitelist sites, manage blocklists.

**A website is blocked that I need:**
1. Go to `http://YOUR_VM_IP/admin`
2. Login with your Pi-hole password (from welcome email)
3. Whitelist → type the website domain → Add to whitelist

---

### 🔒 Tailscale — Access Your Cloud From Anywhere

Tailscale creates a secure private network so you can access your server from anywhere — mobile data, hotel WiFi, anywhere.

**Setup:**
1. Go to [tailscale.com/download](https://tailscale.com/download) on each device
2. Install the app
3. Sign in with the same account used during your server setup
4. Your server will appear in the Tailscale network automatically

**Find your server's Tailscale IP:**
1. Go to [tailscale.com/admin/machines](https://tailscale.com/admin/machines)
2. Find your server (named `YOUR_NAME-server`)
3. Copy the IP address (starts with 100.x.x.x)

**Use Tailscale IP for Pi-hole DNS while travelling:**
Instead of your public VM IP, use your Tailscale IP (100.x.x.x) as your DNS server. Works on any network worldwide.

---

### 🗝️ Vaultwarden — Your Private Password Manager

Vaultwarden is compatible with all Bitwarden apps. Store all your passwords privately on your own server.

**Setup:**
1. Install the Bitwarden app on your devices (browser extension + mobile app)
2. In the app: Settings → Self-hosted → Server URL → enter your Vaultwarden URL
3. Create your account directly in the app

**Your Vaultwarden URL is:** `https://YOUR_VM_URL/vault` (check welcome email)

---

### ⚙️ n8n — Automation (if installed)

n8n lets you connect apps and automate tasks without coding. Like Zapier, but free and private.

**Access at:** `http://YOUR_VM_IP:5678` or via Tailscale

Common automations you can build:
- When a file is uploaded to Nextcloud → send yourself a Telegram notification
- Every morning → send yourself a summary of your calendar
- When a customer emails you → create a task automatically

---

### 📊 Uptime Kuma — Monitoring (if installed)

Monitors your websites and services. Get alerts on Telegram/email if anything goes down.

**Access at:** `http://YOUR_VM_IP:3001` or via Tailscale

---

## Common Problems & Solutions

### "My server seems down"
1. First try accessing via **Tailscale IP** instead of the public URL
2. If Tailscale works, it's a DNS issue — your public URL may have changed
3. If nothing works, OCI VMs occasionally restart — wait 2-3 minutes
4. Still down after 5 minutes? Reply to your welcome email

### "Nextcloud is very slow"
- Browser uploads of large files are always slower than the desktop app
- Install Nextcloud Desktop for bulk uploads
- Check your internet connection speed first

### "I forgot my password"
- Use the "Forgot password" on the Nextcloud login page
- Or reply to your welcome email — we can reset it for you

### "A website I need is being blocked"
- Go to Pi-hole admin → Whitelist → add the domain
- Example: if `ads.example.com` is needed, whitelist `example.com`

### "How do I access from my phone when not at home?"
- Make sure Tailscale is installed and connected on your phone
- Use your Tailscale IP (100.x.x.x) to access Nextcloud from anywhere

### "I accidentally deleted a file"
- Nextcloud has a Trash/Deleted files section (bottom left menu)
- Deleted files are kept for 30 days by default

---

## Storage & Backup Tips

- **Don't store your only copy of important files here** — keep backups
- Nextcloud's maximum file upload size via browser is 16GB per file
- For larger files, use the desktop or mobile app
- Ask your admin to set up automated backups to a second location

---

## Contact Support

Reply to your welcome email for any issue not covered here.
Response time: within 24 hours on business days.

---

*Last updated: March 2026 · Vishwakarma Cloud*

```

```

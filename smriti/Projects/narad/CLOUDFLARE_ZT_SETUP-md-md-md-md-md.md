---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/CLOUDFLARE_ZT_SETUP-md-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 256
size: 6244 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docker, docs, documentation, markdown, project/narad]
---

# CLOUDFLARE_ZT_SETUP-md-md-md-md.md

> Documentation using **docker** (256 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/CLOUDFLARE_ZT_SETUP-md-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 256 |
| **Size** | 6244 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/CLOUDFLARE_ZT_SETUP-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 218
size: 5474 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docker, docs, documentation, markdown, project/narad]
---

# CLOUDFLARE_ZT_SETUP-md-md-md.md

> Documentation using **docker** (218 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/CLOUDFLARE_ZT_SETUP-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 218 |
| **Size** | 5474 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/CLOUDFLARE_ZT_SETUP-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 180
size: 4713 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docker, docs, documentation, markdown, project/narad]
---

# CLOUDFLARE_ZT_SETUP-md-md.md

> Documentation using **docker** (180 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/CLOUDFLARE_ZT_SETUP-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 180 |
| **Size** | 4713 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/CLOUDFLARE_ZT_SETUP-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 142
size: 3949 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docker, docs, documentation, markdown, project/narad]
---

# CLOUDFLARE_ZT_SETUP-md.md

> Documentation using **docker** (142 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/CLOUDFLARE_ZT_SETUP-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 142 |
| **Size** | 3949 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/CLOUDFLARE_ZT_SETUP.md"
project: "vishwakarma"
role: docs
language: markdown
frameworks: [docker]
lines: 104
size: 3208 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [docker, docs, documentation, markdown, project/vishwakarma]
---

# CLOUDFLARE_ZT_SETUP.md

> Documentation using **docker** (104 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/CLOUDFLARE_ZT_SETUP.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 104 |
| **Size** | 3208 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Cloudflare Zero Trust Setup Guide

This guide walks you through setting up Cloudflare Zero Trust Gateway for free ad and malware blocking across your entire network.

## Why Cloudflare Zero Trust?

- **Free** — No credit card required
- **No query limits** — Unlike NextDNS (300k/month), unlimited queries
- **Malware & Ad blocking** — Blocks malicious domains and ads
- **Easy setup** — Just change your router's DNS settings

## Step 1: Sign Up for Cloudflare Zero Trust

1. Go to **[one.dash.cloudflare.com](https://one.dash.cloudflare.com/)**
2. Click **"Sign up"**
3. Enter your email address and create a password
4. Verify your email address

## Step 2: Configure DNS Settings

After logging in:

1. From the dashboard, go to **Settings** → **Network**
2. Scroll to **DNS**
3. Enable one of the following options:

| Option | DNS Servers | What it blocks |
|--------|-------------|----------------|
| 1.1.1.1 for Families | 1.1.1.3 | Malware + Adult Content |
| 1.1.1.1 for Families | 1.1.1.2 | Malware only |
| Custom Blocklists | Your choice | Ads + Malware |

### Recommended: 1.1.1.3 (Family)

This blocks:
- Malware domains
- Adult content
- Phishing sites

## Step 3: Configure Your Router

The easiest way to use Cloudflare DNS network-wide is to change your router's DNS settings.

### Find Your Router's Admin Panel

1. Check your router's IP address (usually on a sticker)
2. Common addresses: `192.168.1.1` or `192.168.0.1`
3. Login with the admin credentials (check documentation)

### Update DNS Settings

1. Go to **WAN** or **Internet** settings
2. Find **DNS** or **DHCP** settings
3. Set Primary DNS to: `1.1.1.3` (Family) or `1.1.1.2` (Malware only)
4. Set Secondary DNS to: `1.0.0.3` (backup)

### Alternative: Set DNS Per Device

If you can't access your router:

**Windows:**
1. Open Settings → Network & Internet → Wi-Fi/Ethernet
2. Click your connection → Edit IP settings
3. Set DNS: `1.1.1.3` and `1.0.0.3`

**macOS:**
1. Go to System Preferences → Network
2. Select your network → Advanced → DNS
3. Add: `1.1.1.3` and `1.0.0.3`

**Android:**
1. Settings → Network & Internet → Wi-Fi
2. Long-press your network → Modify network
3. Set DNS to: `1.1.1.3`

**iOS:**
1. Settings → Wi-Fi → Tap your network
2. Configure DNS → Manual
3. Add: `1.1.1.3`

## Step 4: Verify It's Working

1. Visit **[cloudflare.com/speed/](https://cloudflare.com/speed/)** to verify DNS is working
2. Try loading a website with ads — they should be blocked

## Troubleshooting

### DNS Not Resolving
- Check if your router saved the DNS settings
- Try clearing DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (macOS)

### Some Ads Still Showing
- Use the custom blocklist option in Cloudflare Zero Trust dashboard
- Add additional blocklists from sources like:
  - [StevenBlack Hosts](https://github.com/StevenBlack/hosts)
  - [AdGuard DNS Blocklists](https://adguard-dns.io/)

### Can't Access Router Admin
- Reset router to defaults (usually a small reset button)
- Check router documentation for default credentials

## Need Help?

If you have questions or need assistance, reply to your welcome email and we'll help you get set up!

```

```

```

```

```

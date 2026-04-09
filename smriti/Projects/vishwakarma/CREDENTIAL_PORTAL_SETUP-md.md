---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/CREDENTIAL_PORTAL_SETUP.md"
project: "vishwakarma"
role: docs
language: markdown
frameworks: [cloudflare-workers, docker]
lines: 276
size: 7635 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [cloudflare-workers, docker, docs, documentation, markdown, project/vishwakarma]
---

# CREDENTIAL_PORTAL_SETUP.md

> Documentation using **cloudflare-workers, docker** (276 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/CREDENTIAL_PORTAL_SETUP.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker |
| **Lines** | 276 |
| **Size** | 7635 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# 🔐 Secure Credential Portal — Setup Guide

A beautiful, secure web portal where clients can download their SSH keys and credentials without email attachment risks.

---

## 📋 What It Does

✅ Client enters their unique ID (e.g., "deepak")  
✅ Portal fetches their credentials from your Cloudflare KV  
✅ Shows: Cloud IP, NextCloud URL/password, Pi-hole details, Tailscale hostname  
✅ **Download SSH key as a file** (not in email)  
✅ Copy buttons for each credential  
✅ Responsive, beautiful UI  
✅ Zero cost (runs on Cloudflare Pages, your existing infrastructure)  

---

## 🚀 Deploy in 2 Minutes

### Step 1: Host the HTML on Cloudflare Pages

**Option A: Deploy via GitHub (Recommended)**

```bash
# 1. Create a repo or add to existing:
git checkout -b add-credential-portal

# 2. Add the HTML file:
mkdir -p public
cp credential-portal.html public/index.html

# 3. Push to GitHub:
git add public/
git commit -m "feat: add secure credential portal"
git push origin add-credential-portal

# 4. Go to Cloudflare Dashboard → Pages → Connect to Git
# Select your repo, set build settings:
# - Framework: None
# - Build command: (leave blank)
# - Build output directory: public

# Deploy! You get a URL like: https://credential-portal.pages.dev
```

**Option B: Deploy via Wrangler CLI**

```bash
# Create a Pages project:
wrangler pages publish public/

# You'll get a URL like: https://abc123.pages.dev
```

---

### Step 2: Update the Portal Configuration

Edit `credential-portal.html` and replace these values:

```html
<script>
  // Line ~280:
  const WORKER_URL = 'https://your-vishwakarma-worker.com'; // ← Your worker URL
  const JWT_TOKEN = 'your-cf-access-jwt'; // ← Or handle auth differently
</script>
```

**How to get these:**

- **WORKER_URL**: Go to Cloudflare Dashboard → Workers → vishwakarma → Copy your worker URL
  - Format: `https://vishwakarma.your-domain.com`

- **JWT_TOKEN**: If your worker uses Cloudflare Access:
  - Clients will get a JWT automatically when accessing the page
  - Or update the script to authenticate differently (see "Authentication" below)

---

### Step 3: Test It

1. Go to: `https://credential-portal.pages.dev` (or your Pages URL)
2. Enter a client ID (e.g., "deepak")
3. Click **Retrieve Credentials**
4. You should see:
   - Company name
   - Public IP
   - NextCloud details
   - SSH key download button

---

## 🔑 Authentication Methods

### Option 1: Cloudflare Access (Most Secure)

If your worker is protected by Cloudflare Access:

```javascript
// The browser automatically adds CF-Access-Jwt-Assertion header
// No config needed — it just works!
```

### Option 2: API Key in URL Parameter

```javascript
// Update the script:
const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('key'); // e.g., ?key=abc123

const response = await fetch(`${WORKER_URL}/api/clients/${clientId}`, {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
  },
});
```

Share URLs like: `https://credential-portal.pages.dev?key=client-api-key-123`

### Option 3: Email Token (One-Time Use)

Modify your worker to generate email-specific tokens:

```javascript
// In sendWelcomeEmail():
const portalToken = generateSecureToken(32);
await env.RESOURCES.put(
  `portal-token:${portalToken}`,
  JSON.stringify({ clientId, expiresAt: ... }),
  { expirationTtl: 604800 } // 7 days
);

const portalUrl = `https://credential-portal.pages.dev?token=${portalToken}`;
// Send this URL in the welcome email instead of credentials
```

---

## 📧 Updated Welcome Email Flow

Instead of attaching SSH key to email:

**Old approach:**
```
Email body: "Your SSH key is attached..."
❌ Resend blocks attachment
```

**New approach:**
```
Email body: "Download your credentials here: [link to portal with token]"
✅ Client clicks link
✅ Portal loads
✅ Client downloads SSH key securely
```

### Update Your Worker

```javascript
async function sendWelcomeEmail(client, env) {
  // Generate one-time token for the portal
  const portalToken = generateSecureToken(32);
  await env.RESOURCES.put(
    `portal-token:${portalToken}`,
    JSON.stringify({
      clientId: client.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }),
    { expirationTtl: 604800 }
  );

  const portalUrl = `https://credential-portal.pages.dev?token=${portalToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: sans-serif; color: #333;">
      <h1>☁️ Your Private Cloud is Ready</h1>
      <p>Hi ${client.companyName},</p>
      <p>Your cloud server is live. Download your credentials and SSH key here:</p>
      <p><a href="${portalUrl}" style="background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600;">
        Download Your Credentials →
      </a></p>
      <p><small>This link expires in 7 days. Keep it private and secure.</small></p>
      <p>Questions? Contact support.</p>
    </body>
    </html>
  `;

  await sendEmail({
    to: client.email,
    subject: `☁️ Your Private Cloud is Ready — ${client.companyName}`,
    html,
  }, env);
}
```

---

## 🔒 Security Best Practices

✅ **HTTPS only** — Cloudflare Pages auto-enables HTTPS  
✅ **No credentials in URLs** — Use tokens that expire  
✅ **Separate download links** — SSH key not in email  
✅ **One-time tokens** — Portal link works for 7 days max  
✅ **User authentication** — Cloudflare Access or API keys  
✅ **Copy/Download, not display** — Client controls the key  

---

## 📊 Deployment Checklist

- [ ] Save `credential-portal.html`
- [ ] Create `public/index.html` with the HTML
- [ ] Deploy to Cloudflare Pages (via Git or Wrangler)
- [ ] Update `WORKER_URL` and auth method in the script
- [ ] Test with a real client ID
- [ ] Update your worker to use token-based portal URLs instead of email attachments
- [ ] Redeploy your worker
- [ ] Share portal URLs with clients (not credentials!)

---

## 🎯 Share with Clients

**What you send:**
```
Hi deepak,

Your private cloud is ready. Download your credentials here:
https://credential-portal.pages.dev?token=abc123xyz789

This link expires in 7 days.

Keep your SSH key safe!
— Gold Vault Team
```

**Client experience:**
1. Clicks link
2. Enters their Client ID (optional, or pre-filled from token)
3. Sees all credentials
4. Downloads SSH key as a file
5. Saves locally and connects: `ssh -i ~/.ssh/key ubuntu@IP`

---

## 🔧 Customization

**Change colors:** Edit the `<style>` section (look for `#667eea`, `#764ba2`)  
**Change messages:** Update the HTML text and `showMessage()` calls  
**Add more fields:** Add new `cred-item` divs in the credentials box  
**Custom branding:** Replace "Gold Vault" with your company name  

---

## ❓ FAQ

**Q: Can I preview this locally?**  
A: Yes, just open the HTML in your browser. Update `WORKER_URL` to your local worker (e.g., `http://localhost:8787`)

**Q: What if the client loses the link?**  
A: They can ask you to send it again. Or they can contact support to re-request credentials.

**Q: How do I revoke access?**  
A: Delete the `portal-token:*` entry from KV, or set its expiration to `now`.

**Q: Can clients share the link?**  
A: Only the client with that token can access their credentials. The token is tied to their Client ID.

---

**You're all set!** 🚀 Deploy this portal and share secure links with your clients instead of risky email attachments.

```

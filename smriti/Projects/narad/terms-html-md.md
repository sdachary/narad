---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/terms-html.md"
project: "narad"
role: service
language: markdown
frameworks: [docker]
lines: 114
size: 5361 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docker, documentation, markdown, project/narad, service]
---

# terms-html.md

> Service / API client module using **docker** (114 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/terms-html.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 114 |
| **Size** | 5361 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/terms.html"
project: "kanak"
role: page
language: html
frameworks: [docker]
lines: 76
size: 4711 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, docker, html, page, project/kanak]
---

# terms.html

> Web page using **docker** (76 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/terms.html` |
| **Role** | page |
| **Language** | html |
| **Frameworks** | docker |
| **Lines** | 76 |
| **Size** | 4711 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms & Conditions | Gold SaaS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #121212; --panel: #1E1E1E; --text: #E0E0E0; }
        body { background-color: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; line-height: 1.7; margin: 0; padding: 0; }
        
        .nav-header { background: #000; padding: 15px 20px; border-bottom: 2px solid var(--gold); position: sticky; top: 0; text-align: center; z-index: 1000; }
        .nav-header a { color: var(--gold); text-decoration: none; font-weight: bold; font-size: 1rem; transition: 0.3s; }
        .nav-header a:hover { color: #fff; }

        .content { max-width: 800px; margin: 40px auto; padding: 40px; background: var(--panel); border-radius: 12px; border: 1px solid #333; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { color: var(--gold); border-bottom: 1px solid #444; padding-bottom: 15px; font-size: 1.8rem; margin-top: 0; }
        h2 { color: var(--gold); margin-top: 35px; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 1px; }
        p { color: #bbb; margin-bottom: 20px; }
        ul { padding-left: 20px; color: #bbb; }
        li { margin-bottom: 12px; }
        
        strong { color: var(--gold); }
        
        .footer { text-align: center; padding: 40px; color: #555; font-size: 0.85rem; border-top: 1px solid #222; margin-top: 40px; }

        /* Smooth scroll for better reading experience */
        html { scroll-behavior: smooth; }

        @media (max-width: 600px) {
            .content { margin: 20px; padding: 25px; }
        }
    </style>
</head>
<body>

<div class="nav-header">
    <a href="/login"><i class="fas fa-arrow-left"></i> Back to Access Portal</a>
</div>

<div class="content">
    <h1>Terms & Conditions</h1>
    <p><strong>Effective Date:</strong> February 27, 2026</p>
    
    <p>Welcome to <strong>Gold SaaS</strong>. By registering an account and utilizing our "Shield-Aware" vault platform, you agree to the following legally binding terms. Please read them carefully to understand your rights as a merchant.</p>

    <h2>1. Scope of Service</h2>
    <p>Gold SaaS provides a secure, Cloudflare-shielded inventory and billing management ecosystem. This tool is designed for internal business tracking, stock auditing, and customer ledger management. We provide the <strong>technology</strong>; you provide the <strong>data</strong>.</p>

    <h2>2. User Obligations & Security</h2>
    <ul>
        <li><strong>Data Fidelity:</strong> You are solely responsible for the accuracy of entered weights (grams), market rates, and customer GSTIN details.</li>
        <li><strong>Credential Integrity:</strong> You must protect your vault access keys. Gold SaaS utilizes AES-256 encryption, but we are not liable for breaches caused by password sharing or insecure local devices.</li>
        <li><strong>Merchant Compliance:</strong> You agree to use this platform in accordance with local financial regulations, including the <strong>Prevention of Money Laundering Act (PMLA)</strong> where applicable.</li>
    </ul>

    <h2>3. Cloud Synchronization & Backups</h2>
    <p>Your data is stored in high-availability cloud clusters. While our "Shield Worker" technology ensures 99.9% uptime, we strongly recommend using our <strong>Export PDF</strong> features in the Analytics and Purchase modules to maintain local physical copies of your records for annual audits.</p>

    <h2>4. Liability & Financial Accuracy</h2>
    <p>Gold SaaS is a record-keeping utility. We do not provide financial auditing, legal advice, or tax consultancy. Any discrepancies in your final GST filings or cash tally resulting from manual entry errors are your responsibility. <strong>Always verify the "Net Total" before finalizing a bill.</strong></p>

    <h2>5. Subscription & Trial Policy</h2>
    <p>Accounts are provided on a subscription basis. Failure to renew within the grace period will result in a **"Vault Lock"** status, where Billing and Inventory modules become read-only until the subscription is reactivated by a Super Admin.</p>

    <h2>6. Technical Support</h2>
    <p>For technical inquiries regarding Shield connection errors or vault synchronization, please contact our core team at <strong>support@goldsaas.com</strong>.</p>
</div>

<div class="footer">
    &copy; 2026 Gold SaaS Solutions. Digital Security & Vault Management. <br>
    All rights reserved.
</div>

</body>
</html>

```

```

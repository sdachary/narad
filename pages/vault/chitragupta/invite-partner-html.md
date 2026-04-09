---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/invite-partner.html"
project: "chitragupta"
role: service
language: html
frameworks: [vite]
lines: 51
size: 2028 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, html, project/chitragupta, service, vite]
---

# invite-partner.html

> Service / API client module using **vite** (51 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/invite-partner.html` |
| **Role** | service |
| **Language** | html |
| **Frameworks** | vite |
| **Lines** | 51 |
| **Size** | 2028 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invite Partner - Chitragupta</title>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#6366f1">
    <link rel="stylesheet" href="src/css/styles.css">
</head>
<body>
    <div class="container">
        <h1>Invite Partner</h1>
        <form id="invite-form">
            <input type="text" id="partnerName" placeholder="Partner Name" required>
            <input type="email" id="partnerEmail" placeholder="Partner Email" required>
            <input type="number" id="ownership" placeholder="Ownership % (e.g. 50)" required>
            <button type="submit">Send Invite</button>
        </form>
        <p><a href="index.html">Back to Dashboard</a></p>
    </div>
    <script type="module">
        import { api } from './src/ts/api.ts';
        document.getElementById('invite-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const partnerName = document.getElementById('partnerName').value;
            const partnerEmail = document.getElementById('partnerEmail').value;
            const ownership = document.getElementById('ownership').value;
            const businessId = localStorage.getItem('businessId');
            try {
                await api.post(`/businesses/${businessId}/invite-partner`, {
                    partnerName,
                    email: partnerEmail,
                    ownership
                });
                alert('Invitation sent!');
                window.location.href = 'index.html';
            } catch (err) {
                alert('Invite failed: ' + err.message);
            }
        });
    </script>
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
        }
    </script>
</body>
</html>

```

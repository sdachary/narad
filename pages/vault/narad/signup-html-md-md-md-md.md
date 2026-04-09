---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/signup-html-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 216
size: 5716 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad]
---

# signup-html-md-md-md.md

> Authentication / authorization module (216 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/signup-html-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 216 |
| **Size** | 5716 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/signup-html-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 178
size: 4989 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad]
---

# signup-html-md-md.md

> Authentication / authorization module (178 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/signup-html-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 178 |
| **Size** | 4989 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/signup-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 140
size: 4271 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad]
---

# signup-html-md.md

> Authentication / authorization module (140 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/signup-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 140 |
| **Size** | 4271 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/chitragupta/signup-html.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 102
size: 3550 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, documentation, markdown, project/narad]
---

# signup-html.md

> Authentication / authorization module (102 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/chitragupta/signup-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 102 |
| **Size** | 3550 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/signup.html"
project: "chitragupta"
role: auth
language: html
frameworks: []
lines: 64
size: 2890 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [auth, code, html, project/chitragupta]
---

# signup.html

> Authentication / authorization module (64 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/signup.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 64 |
| **Size** | 2890 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chitragupta - Signup</title>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#020617">
    <link rel="stylesheet" href="src/css/styles.css">
    <link rel="stylesheet" href="src/css/auth.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">
</head>
<body>
    <div class="auth-container">
        <h1>Chitragupta</h1>
        <form id="signup-form">
            <div id="error-msg" class="error-message"></div>
            <input type="text" id="fullName" placeholder="Full Name" required autocomplete="name">
            <input type="text" id="businessName" placeholder="Business Name" required>
            <input type="email" id="email" placeholder="Email" required autocomplete="email">
            <input type="password" id="password" placeholder="Password (min 8 characters)" required autocomplete="new-password">
            <button type="submit" id="submit-btn" class="glass-btn">Signup</button>
        </form>
        <p>Already have an account? <a href="login.html">Login</a></p>
    </div>
    <script type="module">
        import { auth } from './src/ts/auth.ts';
        const form = document.getElementById('signup-form');
        const btn = document.getElementById('submit-btn');
        const errorEl = document.getElementById('error-msg');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const businessName = document.getElementById('businessName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            errorEl.classList.remove('show');
            btn.classList.add('btn-loading');

            try {
                await auth.signup({ fullName, businessName, email, password });
                window.location.href = 'index.html';
            } catch (err) {
                console.error('Signup error:', err);
                errorEl.textContent = err.error || err.message || 'Signup failed. Please try again.';
                errorEl.classList.add('show');
            } finally {
                btn.classList.remove('btn-loading');
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

```

```

```

```

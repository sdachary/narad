---
source: "/home/deepak/Work/chitragupta/login.html"
project: "chitragupta"
role: auth
language: html
frameworks: []
lines: 60
size: 2513 bytes
last_modified: "2026-04-07 15:37"
scanned: "2026-04-07 15:37"
tags: [auth, code, html, project/chitragupta]
---

# login.html

> Authentication / authorization module (60 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/login.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 60 |
| **Size** | 2513 bytes |
| **Modified** | 2026-04-07 15:37 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chitragupta - Login</title>
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
        <form id="login-form">
            <div id="error-msg" class="error-message"></div>
            <input type="email" id="email" placeholder="Email" required autocomplete="email">
            <input type="password" id="password" placeholder="Password" required autocomplete="current-password">
            <button type="submit" id="submit-btn">Login</button>
        </form>
        <p>Don't have an account? <a href="signup.html">Signup</a></p>
    </div>
    <script type="module">
        import { auth } from './src/ts/auth.ts';
        const form = document.getElementById('login-form');
        const btn = document.getElementById('submit-btn');
        const errorEl = document.getElementById('error-msg');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            errorEl.classList.remove('show');
            btn.classList.add('btn-loading');

            try {
                await auth.login({ email, password });
                window.location.href = 'index.html';
            } catch (err) {
                console.error('Login error:', err);
                errorEl.textContent = err.error || err.message || 'Login failed. Please check your credentials.';
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

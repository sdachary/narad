---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/login.html"
project: "chitragupta"
role: auth
language: html
frameworks: []
lines: 121
size: 4594 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, code, html, project/chitragupta]
---

# login.html

> Authentication / authorization module (121 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/login.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 121 |
| **Size** | 4594 bytes |
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
    <title>Chitragupta - Login</title>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#061423">
    <link rel="stylesheet" href="src/css/styles.css">
    <link rel="stylesheet" href="src/css/auth.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
    <style>
        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #030810;
            position: relative;
            overflow: hidden;
        }
        
        body::before {
            content: '';
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(255, 191, 112, 0.08) 0%, transparent 70%);
            top: -20%;
            left: -10%;
            animation: glowPulse 8s ease-in-out infinite;
        }
        
        body::after {
            content: '';
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 70%);
            bottom: -20%;
            right: -10%;
            animation: glowPulse 10s ease-in-out infinite reverse;
        }
        
        @keyframes glowPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
        }
        
        /* Subtle grid overlay */
        .grid-overlay {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
            background-size: 50px 50px;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div class="grid-overlay"></div>
    <div class="auth-container">
        <div class="auth-logo">
            <span class="material-icons-round">account_balance</span>
        </div>
        <h1>Chitragupta</h1>
        <p class="auth-subtitle">Sign in to your business dashboard</p>
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
        
        // Redirect to dashboard if already authenticated
        if (auth.isAuthenticated()) {
            window.location.href = 'index.html';
        }
        
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

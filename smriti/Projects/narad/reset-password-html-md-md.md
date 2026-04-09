---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/reset-password-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker]
lines: 260
size: 9992 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, docker, documentation, markdown, project/narad]
---

# reset-password-html-md.md

> Authentication / authorization module using **docker** (260 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/reset-password-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 260 |
| **Size** | 9992 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/reset-password-html.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker]
lines: 222
size: 9225 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, docker, documentation, markdown, project/narad]
---

# reset-password-html.md

> Authentication / authorization module using **docker** (222 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/reset-password-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 222 |
| **Size** | 9225 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/reset-password.html"
project: "kanak"
role: auth
language: html
frameworks: [docker]
lines: 184
size: 8516 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:38"
tags: [auth, code, docker, html, project/kanak]
---

# reset-password.html

> Authentication / authorization module using **docker** (184 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/reset-password.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | docker |
| **Lines** | 184 |
| **Size** | 8516 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password | Gold Vault</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="./config.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #080808; --panel: #141414; --text: #E0E0E0; --green: #2ecc71; --red: #ff4757; }
        body {
            background: radial-gradient(circle at center, #1a1a1a 0%, #080808 100%);
            color: var(--text);
            display: flex; justify-content: center; align-items: center;
            min-height: 100vh; font-family: 'Segoe UI', sans-serif; margin: 0;
        }
        .box {
            background: var(--panel); padding: 30px 35px; border-radius: 20px;
            border: 1px solid #222; width: 100%; max-width: 380px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); text-align: center;
        }
        h2 { color: var(--gold); text-transform: uppercase; letter-spacing: 4px; margin: 0 0 8px; font-size: 1.1rem; }
        p.sub { font-size: 0.72rem; color: #555; margin: 0 0 20px; }
        label { display: block; font-size: 0.55rem; color: #777; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; text-align: left; }
        .input-wrapper { position: relative; margin-bottom: 12px; }
        input { width: 100%; padding: 10px 14px; background: #000; border: 1px solid #222; color: #fff; border-radius: 8px; box-sizing: border-box; font-size: 0.85rem; }
        input:focus { border-color: var(--gold); outline: none; }
        .toggle-password { position: absolute; right: 12px; top: 29px; cursor: pointer; color: #444; font-size: 0.8rem; }
        button { width: 100%; padding: 12px; background: var(--gold); color: #000; border: none; font-weight: 700; cursor: pointer; border-radius: 10px; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; }
        button:disabled { background: #1a1a1a; color: #444; cursor: wait; }
        button:hover:not(:disabled) { background: #e8c547; }
        #msg { font-size: 0.72rem; padding: 10px 14px; border-radius: 8px; border: 1px solid; display: none; margin-bottom: 15px; text-align: left; }
        .ok    { background: rgba(46,204,113,0.1); color: var(--green); border-color: rgba(46,204,113,0.2); }
        .err   { background: rgba(255,71,87,0.1);  color: var(--red);   border-color: rgba(255,71,87,0.2); }
        .info  { background: rgba(212,175,55,0.1); color: var(--gold);  border-color: rgba(212,175,55,0.2); }
        .strength-bar { height: 3px; border-radius: 2px; margin-top: 5px; transition: all 0.3s; background: #222; }
        #invalid-link { display: none; }
        #reset-form   { display: none; }
        #loading      { color: #555; font-size: 0.8rem; padding: 20px 0; }
    </style>
</head>
<body>
<div class="box">
    <h2>GOLD <span style="color:#fff">VAULT</span></h2>

    <!-- Loading state while Supabase processes the token -->
    <div id="loading">
        <i class="fas fa-circle-notch fa-spin" style="color:var(--gold); font-size:1.5rem; margin-bottom:10px;"></i>
        <p>Verifying reset link...</p>
    </div>

    <!-- Invalid / expired link -->
    <div id="invalid-link">
        <i class="fas fa-exclamation-triangle" style="font-size:2.5rem; color:var(--red); margin-bottom:15px;"></i>
        <h3 style="color:var(--red); font-size:0.85rem; letter-spacing:2px;">LINK EXPIRED</h3>
        <p style="font-size:0.72rem; color:#666; line-height:1.6;">
            This reset link has expired or already been used.<br>
            Please request a new one.
        </p>
        <button onclick="window.location.href='/login'">← Back to Login</button>
    </div>

    <!-- Reset form (shown after valid token detected) -->
    <div id="reset-form">
        <p class="sub">Choose a strong new password for your vault</p>
        <div id="msg"></div>

        <div class="input-wrapper">
            <label>New Password</label>
            <input type="password" id="new-pass" placeholder="Min. 8 characters" oninput="checkStrength()">
            <i class="fas fa-eye toggle-password" onclick="togglePass('new-pass')"></i>
            <div class="strength-bar" id="strength-bar"></div>
        </div>

        <div class="input-wrapper">
            <label>Confirm New Password</label>
            <input type="password" id="confirm-pass" placeholder="••••••••">
            <i class="fas fa-eye toggle-password" onclick="togglePass('confirm-pass')"></i>
        </div>

        <button id="save-btn" onclick="savePassword()">SET NEW PASSWORD</button>
    </div>
</div>

<script>
    function togglePass(id) {
        const el = document.getElementById(id);
        el.type = el.type === 'password' ? 'text' : 'password';
    }

    function checkStrength() {
        const pass = document.getElementById('new-pass').value;
        const bar  = document.getElementById('strength-bar');
        let score = 0;
        if (pass.length >= 8)  score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        const colors = ['#ff4757', '#ff6b35', '#ffa502', '#2ecc71'];
        const widths = ['25%', '50%', '75%', '100%'];
        bar.style.background = score > 0 ? colors[score - 1] : '#222';
        bar.style.width = score > 0 ? widths[score - 1] : '0%';
    }

    function showMsg(text, type) {
        const el = document.getElementById('msg');
        el.textContent = text;
        el.className   = type;
        el.style.display = 'block';
    }

    async function savePassword() {
        const pass    = document.getElementById('new-pass').value;
        const confirm = document.getElementById('confirm-pass').value;
        const btn     = document.getElementById('save-btn');

        if (pass.length < 8) return showMsg('Password must be at least 8 characters', 'err');
        if (pass !== confirm) return showMsg('Passwords do not match', 'err');

        btn.disabled  = true;
        btn.innerText = 'SAVING...';

        try {
            const { error } = await window.DB.auth.updateUser({ password: pass });
            if (error) throw error;

            showMsg('Password updated! Redirecting to login...', 'ok');
            setTimeout(() => window.location.href = '/login', 2000);
        } catch (e) {
            showMsg(e.message || 'Could not update password. Please try again.', 'err');
            btn.disabled  = false;
            btn.innerText = 'SET NEW PASSWORD';
        }
    }

    // Supabase puts the token in the URL hash — detect it
    async function init() {
        // Wait for DB to be ready
        let attempts = 0;
        while (!window.DB && attempts < 20) {
            await new Promise(r => setTimeout(r, 200));
            attempts++;
        }

        if (!window.DB) {
            document.getElementById('loading').innerHTML = '<p style="color:var(--red)">Could not connect. Please refresh.</p>';
            return;
        }

        // Supabase v2 auto-handles the hash token from the email link
        // Listen for the PASSWORD_RECOVERY event
        const { data: { session } } = await window.DB.auth.getSession();

        // Check URL hash for type=recovery
        const hash   = window.location.hash;
        const params = new URLSearchParams(hash.replace('#', '?'));
        const type   = params.get('type');

        document.getElementById('loading').style.display = 'none';

        if (type === 'recovery' || session) {
            document.getElementById('reset-form').style.display = 'block';
        } else {
            document.getElementById('invalid-link').style.display = 'block';
        }
    }

    // Supabase v2 also fires this event on PASSWORD_RECOVERY
    window.addEventListener('DOMContentLoaded', () => {
        init();
        if (window.DB) {
            window.DB.auth.onAuthStateChange((event) => {
                if (event === 'PASSWORD_RECOVERY') {
                    document.getElementById('loading').style.display  = 'none';
                    document.getElementById('reset-form').style.display = 'block';
                    document.getElementById('invalid-link').style.display = 'none';
                }
            });
        }
    });
</script>
</body>
</html>

```

```

```

---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/login-html-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 512
size: 19538 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, documentation, markdown, project/narad]
---

# login-html-md-md-md.md

> Authentication / authorization module (512 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/login-html-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 512 |
| **Size** | 19538 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/login-html-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 474
size: 18812 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad]
---

# login-html-md-md.md

> Authentication / authorization module (474 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/login-html-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 474 |
| **Size** | 18812 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/login-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 436
size: 18095 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad]
---

# login-html-md.md

> Authentication / authorization module (436 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/login-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 436 |
| **Size** | 18095 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/login-html.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 398
size: 17387 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad]
---

# login-html.md

> Authentication / authorization module (398 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/login-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 398 |
| **Size** | 17387 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/login.html"
project: "kanak"
role: auth
language: html
frameworks: []
lines: 360
size: 16737 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, code, html, project/kanak]
---

# login.html

> Authentication / authorization module (360 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/login.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 360 |
| **Size** | 16737 bytes |
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
    <title>Access | Gold Vault</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="./config.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #080808; --panel: #141414; --text: #E0E0E0; --green: #2ecc71; --red: #ff4757; }
        body { 
            background: radial-gradient(circle at center, #1a1a1a 0%, #080808 100%); 
            color: var(--text); 
            display: flex; justify-content: center; align-items: center; 
            min-height: 100vh; font-family: 'Segoe UI', sans-serif; margin: 0; overflow: hidden; 
        }

        .auth-box { 
            background: var(--panel); padding: 25px 35px; border-radius: 20px; border: 1px solid #222; 
            text-align: center; width: 100%; max-width: 380px; 
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); 
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-box.signup-mode { max-width: 580px; }

        h2 { color: var(--gold); text-transform: uppercase; letter-spacing: 4px; margin: 0 0 15px 0; font-size: 1.1rem; }
        
        .tab-group { display: flex; background: #000; border-radius: 10px; margin-bottom: 15px; padding: 4px; border: 1px solid #1a1a1a; }
        .tab { flex: 1; padding: 8px; cursor: pointer; border-radius: 6px; font-size: 0.7rem; font-weight: 700; color: #555; transition: 0.3s; }
        .tab.active { background: var(--gold); color: #000; }
        
        .auth-grid { display: grid; grid-template-columns: 1fr; gap: 10px; text-align: left; }
        .signup-mode .auth-grid { grid-template-columns: 1fr 1fr; }

        .input-wrapper { position: relative; }
        .full-width-span { grid-column: span 1; }
        .signup-mode .full-width-span { grid-column: span 2; }
        
        label { display: block; font-size: 0.55rem; color: #777; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 1px; }
        input { width: 100%; padding: 10px 14px; background: #000; border: 1px solid #222; color: #fff; border-radius: 8px; box-sizing: border-box; font-size: 0.85rem; }
        input:focus { border-color: var(--gold); outline: none; }
        
        .toggle-password { position: absolute; right: 12px; top: 29px; cursor: pointer; color: #444; font-size: 0.8rem; }
        button { width: 100%; padding: 12px; background: var(--gold); color: #000; border: none; font-weight: 700; cursor: pointer; border-radius: 10px; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; }
        button:disabled { background: #1a1a1a; color: #444; cursor: wait; }
        button:hover:not(:disabled) { background: #e8c547; }

        #alert-msg { font-size: 0.7rem; margin-bottom: 15px; display: none; padding: 12px; border-radius: 8px; border: 1px solid; text-align: left; }
        .alert-error { background: rgba(255, 71, 87, 0.1); color: var(--red); border-color: rgba(255, 71, 87, 0.2); }
        .alert-info  { background: rgba(212, 175, 55, 0.1); color: var(--gold); border-color: rgba(212, 175, 55, 0.2); }
        .alert-ok    { background: rgba(46, 204, 113, 0.1); color: var(--green); border-color: rgba(46, 204, 113, 0.2); }
        
        #success-panel { display: none; text-align: center; }

        /* Forgot password hint under login */
        .forgot-link {
            display: none;
            text-align: right;
            margin-top: 6px;
        }
        .forgot-link a {
            font-size: 0.6rem;
            color: #555;
            text-decoration: none;
            cursor: pointer;
            transition: color 0.2s;
        }
        .forgot-link a:hover { color: var(--gold); }

        /* Reset sent panel */
        #reset-sent-panel { display: none; text-align: center; padding: 10px 0; }
        #reset-sent-panel .reset-icon { font-size: 3rem; color: var(--gold); margin-bottom: 15px; }
        #reset-sent-panel h3 { color: var(--gold); margin: 0 0 10px; font-size: 0.9rem; letter-spacing: 2px; }
        #reset-sent-panel p { font-size: 0.75rem; color: #888; line-height: 1.6; }
        .back-link { font-size: 0.65rem; color: #555; cursor: pointer; margin-top: 15px; display: inline-block; }
        .back-link:hover { color: var(--gold); }
    </style>
</head>
<body>
    <div class="auth-box" id="main-box">
        <h2>GOLD <span>VAULT</span></h2>
        <div id="alert-msg"></div>
        
        <div id="auth-ui">
            <div class="tab-group">
                <div id="tab-login"  class="tab active" onclick="setMode('login')">LOGIN</div>
                <div id="tab-signup" class="tab"        onclick="setMode('signup')">NEW MERCHANT</div>
                <div id="tab-reset"  class="tab"        onclick="setMode('reset')">FORGOT</div>
            </div>

            <!-- LOGIN + SIGNUP fields -->
            <div id="main-fields">
                <div class="auth-grid">
                    <div class="input-wrapper full-width-span">
                        <label>Email Address</label>
                        <input type="email" id="email" placeholder="name@shop.com">
                    </div>
                    
                    <div class="input-wrapper" id="password-field">
                        <label>Vault Password</label>
                        <input type="password" id="password" placeholder="••••••••">
                        <i class="fas fa-eye toggle-password" onclick="togglePass('password')"></i>
                    </div>

                    <div id="confirm-field" class="input-wrapper" style="display: none;">
                        <label>Confirm Password</label>
                        <input type="password" id="confirm_password" placeholder="••••••••">
                    </div>

                    <div class="input-wrapper extra-field" style="display: none;">
                        <label>Contact Person</label>
                        <input type="text" id="full_name" placeholder="Owner Name">
                    </div>

                    <div class="input-wrapper extra-field" style="display: none;">
                        <label>Mobile No.</label>
                        <input type="text" id="mobile_no" placeholder="WhatsApp No">
                    </div>

                    <div class="input-wrapper extra-field full-width-span" style="display: none;">
                        <label>Jewelry Shop Name</label>
                        <input type="text" id="shop_name" placeholder="Business Title">
                    </div>
                </div>

                <!-- Forgot password link shown only in login mode -->
                <div class="forgot-link" id="forgot-hint">
                    <a onclick="setMode('reset')">Forgot password?</a>
                </div>

                <button onclick="handleAuth()" id="auth-btn" disabled>Syncing Shield...</button>
            </div>

            <!-- FORGOT PASSWORD fields -->
            <div id="reset-fields" style="display: none;">
                <p style="font-size: 0.72rem; color: #666; margin: 0 0 15px; line-height: 1.6;">
                    Enter your registered email. We will send a secure reset link to your inbox.
                </p>
                <div class="auth-grid">
                    <div class="input-wrapper full-width-span">
                        <label>Registered Email</label>
                        <input type="email" id="reset-email" placeholder="name@shop.com">
                    </div>
                </div>
                <button onclick="handleReset()" id="reset-btn">SEND RESET LINK</button>
                <p class="back-link" onclick="setMode('login')">← Back to Login</p>
            </div>

            <!-- Reset email sent confirmation -->
            <div id="reset-sent-panel">
                <div class="reset-icon"><i class="fas fa-envelope-open-text"></i></div>
                <h3>CHECK YOUR INBOX</h3>
                <p>
                    A password reset link has been sent to<br>
                    <strong style="color: var(--gold);"><span id="reset-display-email"></span></strong><br><br>
                    <small style="color: #555;">Check spam folder if you don't see it within 2 minutes.</small>
                </p>
                <p class="back-link" onclick="backToLogin()">← Back to Login</p>
            </div>
            
            <p id="terms-note" style="font-size: 0.6rem; color: #444; margin-top: 15px;">
                By using this vault, you agree to our 
                <a href="/terms" style="color: var(--gold); text-decoration: none;">Terms of Service</a>
            </p>
        </div>

        <!-- Signup success panel -->
        <div id="success-panel">
            <i class="fas fa-check-circle" style="font-size:3.5rem; color:var(--green); margin-bottom:20px;"></i>
            <h3>VAULT REGISTERED</h3>
            <p style="font-size: 0.85rem; color: #888;">
                Check <strong><span id="display-email"></span></strong> to verify your account.<br>
                <small style="color: #555;">A welcome email is on its way!</small>
            </p>
            <button onclick="window.location.reload()" style="background:#222; color:#fff;">Back to Login</button>
        </div>
    </div>

<script>
    let mode = 'login';

    function setMode(m) {
        mode = m;
        const box        = document.getElementById('main-box');
        const extras     = document.querySelectorAll('.extra-field');
        const confirm    = document.getElementById('confirm-field');
        const passField  = document.getElementById('password-field');
        const mainFields = document.getElementById('main-fields');
        const resetFields= document.getElementById('reset-fields');
        const resetSent  = document.getElementById('reset-sent-panel');
        const forgotHint = document.getElementById('forgot-hint');
        const termsNote  = document.getElementById('terms-note');

        // Tab active states
        document.getElementById('tab-login').classList.toggle('active',  mode === 'login');
        document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
        document.getElementById('tab-reset').classList.toggle('active',  mode === 'reset');

        // Clear alerts
        hideAlert();

        if (mode === 'reset') {
            mainFields.style.display  = 'none';
            resetFields.style.display = 'block';
            resetSent.style.display   = 'none';
            termsNote.style.display   = 'none';
            box.classList.remove('signup-mode');
        } else {
            mainFields.style.display  = 'block';
            resetFields.style.display = 'none';
            resetSent.style.display   = 'none';
            termsNote.style.display   = 'block';

            box.classList.toggle('signup-mode', mode === 'signup');
            confirm.style.display  = (mode === 'signup') ? 'block' : 'none';
            passField.style.display= 'block';
            extras.forEach(el => el.style.display = (mode === 'signup') ? 'block' : 'none');
            forgotHint.style.display = (mode === 'login') ? 'block' : 'none';
            updateButtonText();
        }
    }

    function updateButtonText() {
        const btn = document.getElementById('auth-btn');
        if (btn.disabled && btn.innerText.includes("Syncing")) return;
        btn.innerText = (mode === 'login') ? "SECURE LOGIN" : "INITIALIZE VAULT";
    }

    function togglePass(id) {
        const input = document.getElementById(id);
        input.type = (input.type === "password") ? "text" : "password";
    }

    async function handleAuth() {
        const email = document.getElementById('email').value.trim();
        const pass  = document.getElementById('password').value;
        const btn   = document.getElementById('auth-btn');

        if (!email || !pass) return showAlert("Email and password required", "alert-error");
        
        if (mode === 'signup') {
            const confirm = document.getElementById('confirm_password').value;
            if (pass !== confirm) return showAlert("Passwords do not match", "alert-error");
            if (pass.length < 6) return showAlert("Password must be at least 6 characters", "alert-error");
        }

        btn.disabled = true; 
        btn.innerText = "AUTHENTICATING...";
        
        try {
            if (mode === 'signup') {
                console.log('🔵 Starting signup for:', email);
                const { data, error } = await window.DB.auth.signUp({ 
                    email, 
                    password: pass, 
                    options: { 
                        data: { 
                            full_name: document.getElementById('full_name').value.trim(),
                            shop_name: document.getElementById('shop_name').value.trim(),
                            mobile_no: document.getElementById('mobile_no').value.trim()
                        }
                    } 
                });
                console.log('🔵 Signup response:', {
                    user: data?.user?.id,
                    emailConfirmedAt: data?.user?.email_confirmed_at,
                    session: !!data?.session,
                    error: error
                });
                if (error) throw error;
                document.getElementById('display-email').innerText = email;
                document.getElementById('auth-ui').style.display   = 'none';
                document.getElementById('success-panel').style.display = 'block';
            } else {
                const { error } = await window.DB.auth.signInWithPassword({ email, password: pass });
                if (error) throw error;
                window.location.href = '/dashboard';
            }
        } catch (e) {
            const msg = e.message.includes("fetch") 
                ? "Connection blocked. Try mobile data or check your network." 
                : e.message;
            showAlert(msg, "alert-error");
            btn.disabled = false; 
            updateButtonText();
        }
    }

    async function handleReset() {
        const email = document.getElementById('reset-email').value.trim();
        const btn   = document.getElementById('reset-btn');

        if (!email) return showAlert("Please enter your email address", "alert-error");

        btn.disabled = true;
        btn.innerText = "SENDING...";

        try {
            const { error } = await window.DB.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password'
            });

            if (error) throw error;

            // Show success state
            document.getElementById('reset-display-email').innerText = email;
            document.getElementById('reset-fields').style.display    = 'none';
            document.getElementById('reset-sent-panel').style.display = 'block';

            // Hide tabs while showing sent confirmation
            document.querySelector('.tab-group').style.display = 'none';

        } catch (e) {
            showAlert(e.message || "Could not send reset email. Please try again.", "alert-error");
            btn.disabled = false;
            btn.innerText = "SEND RESET LINK";
        }
    }

    function backToLogin() {
        document.querySelector('.tab-group').style.display = 'flex';
        setMode('login');
    }

    function showAlert(msg, type) {
        const el = document.getElementById('alert-msg');
        el.innerHTML = msg; 
        el.className = type; 
        el.style.display = 'block';
    }

    function hideAlert() {
        const el = document.getElementById('alert-msg');
        el.style.display = 'none';
    }

    async function init() { 
        if (window.DB) {
            // If already logged in, skip login page entirely
            try {
                const { data: { session } } = await window.DB.auth.getSession();
                if (session) {
                    window.location.href = '/dashboard';
                    return;
                }
            } catch(e) { /* ignore — show login form */ }

            document.getElementById('auth-btn').disabled = false; 
            updateButtonText();
            document.getElementById('forgot-hint').style.display = 'block';
        } else {
            setTimeout(init, 300); 
        }
    }

    document.addEventListener('DOMContentLoaded', init);
</script>
</body>
</html>

```

```

```

```

```

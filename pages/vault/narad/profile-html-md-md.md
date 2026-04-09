---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/profile-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 242
size: 9341 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad]
---

# profile-html-md.md

> Authentication / authorization module (242 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/profile-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 242 |
| **Size** | 9341 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/profile-html.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 204
size: 8629 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad]
---

# profile-html.md

> Authentication / authorization module (204 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/profile-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 204 |
| **Size** | 8629 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/profile.html"
project: "kanak"
role: auth
language: html
frameworks: []
lines: 166
size: 7975 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, code, html, project/kanak]
---

# profile.html

> Authentication / authorization module (166 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/profile.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 166 |
| **Size** | 7975 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Business Profile | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #121212; --panel: #1E1E1E; --text: #E0E0E0; --success: #2ecc71; --danger: #ff4757; }
        body { background-color: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; }
        .nav-header { background: #000; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--gold); position: sticky; top: 0; z-index: 1000; }
        .nav-btn { background: #333; color: #fff; border: 1px solid #555; padding: 8px 15px; border-radius: 8px; text-decoration: none; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .container { max-width: 600px; margin: 40px auto; padding: 20px; }
        .card { background: var(--panel); padding: 30px; border-radius: 12px; border: 1px solid #333; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h2 { color: var(--gold); text-align: center; margin-top: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 1.2rem; }
        .form-group { margin-bottom: 20px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        label { display: block; color: #888; font-size: 0.75rem; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; }
        input, textarea { width: 100%; padding: 12px; background: #111; border: 1px solid #444; color: #fff; border-radius: 6px; box-sizing: border-box; font-size: 0.95rem; outline: none; transition: 0.2s; }
        input:focus, textarea:focus { border-color: var(--gold); background: #000; }
        .btn-gold { width: 100%; background: var(--gold); color: #000; padding: 14px; border: none; font-weight: bold; cursor: pointer; border-radius: 6px; font-size: 1rem; margin-top: 10px; transition: 0.2s; }
        .btn-gold:disabled { opacity: 0.5; cursor: wait; }
        #status-msg { margin-top: 15px; text-align: center; font-size: 0.85rem; display: none; padding: 12px; border-radius: 6px; font-weight: bold; }
    </style>
</head>
<body>

<div class="nav-header">
    <a href="/dashboard" class="nav-btn"><i class="fas fa-arrow-left"></i> BACK</a>
    <span style="color:var(--gold); font-weight:bold; letter-spacing: 1px;">BUSINESS PROFILE</span>
    <a href="/dashboard" class="nav-btn"><i class="fas fa-home"></i> HOME</a>
</div>

<div class="container">
    <div class="card">
        <h2>Shop Settings</h2>
        <div id="status-msg"></div>
        
        <form id="profile-form">
            <div class="form-group">
                <label>Jewelry Shop Name *</label>
                <input type="text" id="shop_name" placeholder="Business Title" required>
            </div>

            <div class="form-group">
                <label>GSTIN Number</label>
                <input type="text" id="gstin_number" placeholder="Standard 15-digit GSTIN">
            </div>

            <div class="form-group">
                <label>Owner Name</label>
                <input type="text" id="full_name" placeholder="Primary Contact Person">
            </div>

            <div class="grid-2">
                <div>
                    <label>Primary Mobile *</label>
                    <input type="tel" id="mobile_no" placeholder="WhatsApp Number" required>
                </div>
                <div>
                    <label>Secondary Mobile</label>
                    <input type="tel" id="secondary_mobile_no" placeholder="Emergency Contact">
                </div>
            </div>

            <div class="form-group">
                <label>Shop Address (For Invoices) *</label>
                <textarea id="full_address" rows="3" placeholder="Full street address, city and state" required></textarea>
            </div>

            <button type="submit" id="save-btn" class="btn-gold" disabled>SYNCHRONIZING...</button>
        </form>
    </div>
</div>

<script>
    async function loadProfile() {
        try {
            if (typeof DB === 'undefined') { setTimeout(loadProfile, 300); return; }

            const { data: { session }, error: authErr } = await DB.auth.getSession();
            if (!session || authErr) return window.location.href = '/login';

            const user = session.user;
            const btn = document.getElementById('save-btn');

            // 🛡️ FIX: maybeSingle() prevents the PGRST116 crash if profile is missing
            const { data: p, error } = await DB.from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (error) throw error;

            if (p) {
                document.getElementById('shop_name').value = p.shop_name || '';
                document.getElementById('gstin_number').value = p.gstin_number || '';
                document.getElementById('full_name').value = p.full_name || '';
                document.getElementById('mobile_no').value = p.mobile_no || '';
                document.getElementById('secondary_mobile_no').value = p.secondary_mobile_no || '';
                document.getElementById('full_address').value = p.full_address || '';
            }

            btn.disabled = false;
            btn.innerText = "UPDATE BUSINESS PROFILE";

        } catch (err) {
            console.error("🚨 Profile Sync Failure:", err);
            const msg = document.getElementById('status-msg');
            msg.style.display = 'block';
            msg.innerText = "Vault Connection Error: " + (err.message || 'Connection Failed');
        }
    }

    document.getElementById('profile-form').onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('save-btn');
        const msg = document.getElementById('status-msg');
        
        try {
            btn.disabled = true; 
            btn.innerText = "WRITING TO VAULT...";
            msg.style.display = 'none';

            const { data: { session } } = await DB.auth.getSession();
            if (!session) throw new Error("Session expired. Please re-login.");

            const updates = {
                id: session.user.id,
                shop_name: document.getElementById('shop_name').value.trim(),
                gstin_number: document.getElementById('gstin_number').value.trim(),
                full_name: document.getElementById('full_name').value.trim(),
                mobile_no: document.getElementById('mobile_no').value.trim(),
                secondary_mobile_no: document.getElementById('secondary_mobile_no').value.trim(),
                full_address: document.getElementById('full_address').value.trim(),
                updated_at: new Date().toISOString()
            };

            const { error } = await DB.from('profiles').upsert(updates);
            if (error) throw error;

            msg.style.display = 'block';
            msg.style.background = 'rgba(46, 204, 113, 0.1)';
            msg.style.color = 'var(--success)';
            msg.innerText = "Profile Successfully Synchronized!";
            
            setTimeout(() => { msg.style.display = 'none'; }, 3000);

        } catch (err) {
            msg.style.display = 'block';
            msg.style.background = 'rgba(255, 71, 87, 0.1)';
            msg.style.color = 'var(--danger)';
            msg.innerText = "Update Failed: " + err.message;
        } finally {
            btn.disabled = false; 
            btn.innerText = "UPDATE BUSINESS PROFILE";
        }
    };

    document.addEventListener('DOMContentLoaded', loadProfile);
</script>
</body>
</html>

```

```

```

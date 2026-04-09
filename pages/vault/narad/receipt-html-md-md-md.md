---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/receipt-html-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 269
size: 8735 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad]
---

# receipt-html-md-md.md

> Authentication / authorization module (269 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/receipt-html-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 269 |
| **Size** | 8735 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/receipt-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 231
size: 8014 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad]
---

# receipt-html-md.md

> Authentication / authorization module (231 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/receipt-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 231 |
| **Size** | 8014 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/receipt-html.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 193
size: 7302 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad]
---

# receipt-html.md

> Authentication / authorization module (193 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/receipt-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 193 |
| **Size** | 7302 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/receipt.html"
project: "kanak"
role: auth
language: html
frameworks: []
lines: 155
size: 6648 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, code, html, project/kanak]
---

# receipt.html

> Authentication / authorization module (155 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/receipt.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 155 |
| **Size** | 6648 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Subscription Management | Admin</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #080808; --panel: #111; --text: #E0E0E0; --danger: #ff4757; --success: #2ecc71; }
        body { background: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        
        .card { background: var(--panel); width: 400px; padding: 40px; border-radius: 15px; border: 1px solid var(--gold); box-shadow: 0 0 40px rgba(0,0,0,0.8); }
        h2 { color: var(--gold); text-align: center; margin-bottom: 30px; letter-spacing: 1px; }
        
        label { font-size: 0.65rem; color:#666; font-weight: bold; margin-bottom: 5px; display: block; text-transform: uppercase; }
        input, select { width: 100%; padding: 12px; background: #000; border: 1px solid #333; color: #fff; border-radius: 8px; margin-bottom: 20px; box-sizing: border-box; outline: none; transition: 0.2s; }
        input:focus, select:focus { border-color: var(--gold); }
        
        button { width: 100%; padding: 15px; background: var(--gold); border: none; font-weight: bold; border-radius: 8px; cursor: pointer; text-transform: uppercase; font-size: 0.9rem; transition: 0.2s; }
        button:disabled { background: #333; color: #555; cursor: wait; }
        
        .nav-link { display:block; text-align:center; margin-top:20px; color:#555; text-decoration:none; font-size:0.8rem; font-weight: bold; }
        .nav-link:hover { color: var(--gold); }

        #status-msg { margin-bottom: 20px; text-align: center; font-size: 0.85rem; display: none; padding: 10px; border-radius: 6px; }
    </style>
</head>
<body>

<div class="card">
    <h2 id="header-title"><i class="fas fa-crown"></i> SUBSCRIPTION</h2>
    
    <div id="status-msg"></div>

    <div id="admin-ui">
        <label>SELECT MERCHANT SHOP</label>
        <select id="m-select"><option value="">Connecting to Vault...</option></select>
        
        <label>AMOUNT RECEIVED (₹)</label>
        <input type="number" id="amt" placeholder="e.g. 999">
        
        <label>SUBSCRIPTION DAYS</label>
        <select id="days-count">
            <option value="30">30 Days (Standard)</option>
            <option value="90">90 Days (Quarterly)</option>
            <option value="365">365 Days (Annual)</option>
        </select>
        
        <button onclick="activateMerchant()" id="btn" disabled>Syncing Shield...</button>
        <a href="/admin" class="nav-link"><i class="fas fa-arrow-left"></i> Back to Master Command</a>
    </div>
</div>

<script>
    /**
     * 🛡️ load: Fetches the merchant list via the Shield Worker
     */
    async function load() {
        try {
            // 1. Connection Guard: Wait for window.DB
            if (typeof DB === 'undefined') { 
                setTimeout(load, 300); 
                return; 
            }

            // 2. Super-Admin Check
            const { data: { session } } = await DB.auth.getSession();
            if (!session) return window.location.href = '/login';

            const { data: profile } = await DB.from('profiles').select('role').eq('id', session.user.id).single();
            if (profile?.role !== 'super-admin') {
                document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:20%;'>UNAUTHORIZED ACCESS</h1>";
                return;
            }

            // 3. Fetch Active/Pending Merchants
            const { data, error } = await DB.from('profiles')
                .select('id, shop_name, email')
                .neq('role', 'super-admin')
                .order('shop_name');

            if (error) throw error;

            document.getElementById('m-select').innerHTML = data.map(m => 
                `<option value="${m.id}">${m.shop_name || m.email}</option>`
            ).join('') || '<option value="">No Merchants Found</option>';

            document.getElementById('btn').disabled = false;
            document.getElementById('btn').innerText = "SAVE & ACTIVATE";

        } catch (err) {
            console.error("🚨 Receipt Load Failure:", err);
            showStatus("Connection Failed: " + err.message, "danger");
        }
    }

    /**
     * 🔐 activateMerchant: Performs the high-privilege Master Override
     */
    async function activateMerchant() {
        const uid = document.getElementById('m-select').value;
        const amt = parseFloat(document.getElementById('amt').value);
        const days = parseInt(document.getElementById('days-count').value);
        const btn = document.getElementById('btn');

        if(!uid || isNaN(amt)) return alert("Please select a merchant and enter amount.");

        btn.disabled = true; 
        btn.innerText = "OVERRIDING RLS...";

        try {
            // Calculate Expiry Date
            const newEnd = new Date(); 
            newEnd.setDate(newEnd.getDate() + days);
            const dateStr = newEnd.toISOString().split('T')[0];

            // 🚀 MASTER OVERRIDE RPC
            // This bypasses standard merchant restrictions
            const { error } = await DB.rpc('admin_update_profile', {
                target_id: uid,
                new_status: 'active',
                new_start: new Date().toISOString().split('T')[0],
                new_end: dateStr,
                new_amount: amt
            });

            if (error) throw error;

            alert("Merchant Unlocked! Vault updated for " + days + " days.");
            window.location.href = '/admin';

        } catch (err) {
            console.error("🚨 Activation Failed:", err);
            alert("Master Error: " + err.message);
            btn.disabled = false; 
            btn.innerText = "SAVE & ACTIVATE";
        }
    }

    function showStatus(msg, type) {
        const el = document.getElementById('status-msg');
        el.innerText = msg;
        el.style.display = 'block';
        el.style.background = type === 'danger' ? 'rgba(255, 71, 87, 0.1)' : 'rgba(46, 204, 113, 0.1)';
        el.style.color = type === 'danger' ? 'var(--danger)' : 'var(--success)';
    }

    // Initialize once DOM is ready
    document.addEventListener('DOMContentLoaded', load);
</script>
</body>
</html>

```

```

```

```

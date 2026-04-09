---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/purchase-html-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker]
lines: 365
size: 14639 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [auth, docker, documentation, markdown, project/narad]
---

# purchase-html-md-md.md

> Authentication / authorization module using **docker** (365 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/purchase-html-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 365 |
| **Size** | 14639 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/purchase-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker]
lines: 327
size: 13879 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, docker, documentation, markdown, project/narad]
---

# purchase-html-md.md

> Authentication / authorization module using **docker** (327 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/purchase-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 327 |
| **Size** | 13879 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/purchase-html.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker]
lines: 289
size: 13128 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, docker, documentation, markdown, project/narad]
---

# purchase-html.md

> Authentication / authorization module using **docker** (289 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/purchase-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 289 |
| **Size** | 13128 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/purchase.html"
project: "kanak"
role: auth
language: html
frameworks: [docker]
lines: 251
size: 12435 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, code, docker, html, project/kanak]
---

# purchase.html

> Authentication / authorization module using **docker** (251 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/purchase.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | docker |
| **Lines** | 251 |
| **Size** | 12435 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Purchase Entry | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #121212; --panel: #1E1E1E; --text: #E0E0E0; --highlight: #2ecc71; --danger: #ff4757; }
        body { background-color: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
        #lock-screen { display:none; position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index: 99999; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .nav-header { background-color: #000; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--gold); position: sticky; top: 0; z-index: 100; }
        .nav-btn { background: #333; color: #fff; border: 1px solid #555; padding: 8px 15px; border-radius: 8px; text-decoration: none; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.85rem; }
        .container { max-width: 800px; margin: 40px auto; padding: 0 20px; }
        .card { background: var(--panel); padding: 30px; border-radius: 12px; border: 1px solid #333; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-size: 0.7rem; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
        input, select { width: 100%; padding: 12px; background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 8px; box-sizing: border-box; outline: none; transition: 0.2s; font-size: 0.95rem; }
        input:focus { border-color: var(--gold); }
        .readonly-box { background: #1a1a1a; cursor: not-allowed; border-color: #333; color: var(--gold); font-weight: bold; }
        .mode-btn { flex: 1; padding: 12px; background: #333; color: #fff; border: 1px solid #444; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.8rem; text-transform: uppercase; transition: 0.2s; }
        .mode-btn.active { border-color: var(--gold); color: var(--gold); background: rgba(212,175,55,0.1); }
        button.submit-btn { width: 100%; padding: 18px; background: var(--gold); color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; text-transform: uppercase; transition: 0.2s; }
        button.submit-btn:disabled { background: #444; color: #888; cursor: wait; }
    </style>
</head>
<body>

<div id="lock-screen">
    <i class="fas fa-lock" style="font-size:4rem; color:var(--gold); margin-bottom:20px;"></i>
    <h2 style="color:var(--gold);">PURCHASE ENTRY LOCKED</h2>
    <p style="color:#888; max-width:400px; margin-bottom: 30px; font-size: 0.9rem;">Your 7-day trial period has ended. To add more stock to your vault, please contact Admin to activate your full subscription.</p>
    <a href="/dashboard" class="nav-btn">Back to Dashboard</a>
</div>

<div class="nav-header">
    <a href="/dashboard" class="nav-btn"><i class="fas fa-arrow-left"></i> Back</a>
    <span style="color:var(--gold); font-weight:bold; font-size: 1.2rem; letter-spacing: 1px;">STOCK PURCHASE ENTRY</span>
    <a href="/dashboard" class="nav-btn"><i class="fas fa-home"></i> Home</a>
</div>

<div class="container">
    <div class="card">
        <div class="grid-2">
            <div><label>Purchase Date</label><input type="date" id="purchase-date"></div>
            <div><label>Total Value (₹)</label><input type="text" id="total-amount" class="readonly-box" readonly placeholder="0.00"></div>
        </div>
        
        <div style="margin-bottom: 25px; display:flex; gap:10px;">
            <button onclick="setEntryMode('select')" id="mode-select" class="mode-btn active">Existing Item</button>
            <button onclick="setEntryMode('manual')" id="mode-manual" class="mode-btn">+ New Item</button>
        </div>

        <div id="wrapper-select" class="grid-2">
            <div>
                <label>Select Item</label>
                <select id="product-select" onchange="handleItemChange()"><option value="">Establishing Shield...</option></select>
            </div>
            <div>
                <label>Current Stock (g)</label>
                <input type="text" id="current-stock" class="readonly-box" readonly placeholder="0.000">
            </div>
        </div>
        
        <div id="wrapper-manual" style="display: none;">
            <label>New Item Name</label>
            <input type="text" id="manual-item-name" placeholder="e.g. 22K Gold Chain (916)">
        </div>

        <div class="grid-2" style="margin-top:20px;">
            <div><label>HSN Code</label><input type="text" id="hsn-code" placeholder="Standard HSN"></div>
            <div><label>Weight Added (g)</label><input type="number" id="quantity" step="0.001" placeholder="0.000"></div>
        </div>
        
        <div style="margin-top:20px;">
            <label>Cost per Gram (₹)</label>
            <input type="number" id="rate" step="0.01" placeholder="0.00">
        </div>

        <button class="submit-btn" style="margin-top:35px;" onclick="submitPurchase()" id="btn-submit" disabled>
            Initializing Shield...
        </button>
    </div>
</div>

<script>
    let productList = [], entryMode = 'select', userProfile = null;

    async function init() {
        try {
            if (typeof DB === 'undefined') { setTimeout(init, 300); return; }
            
            document.getElementById('purchase-date').valueAsDate = new Date();
            document.getElementById('hsn-code').value = "NA";

            const { data: { session }, error: authErr } = await DB.auth.getSession();
            if (authErr || !session) return window.location.href = '/login';
            
            const tid = localStorage.getItem('impersonate_id') || session.user.id;

            // 🛡️ FIX: maybeSingle() allows the code to continue even if the profile row is missing
            const { data: prof, error: profErr } = await DB.from('profiles')
                .select('*')
                .eq('id', tid)
                .maybeSingle(); 
                
            if (profErr) throw profErr;

            // Fallback for missing profile rows
            userProfile = prof || { id: tid, role: 'merchant', sub_end_date: null };

            const expiry = userProfile.sub_end_date ? new Date(userProfile.sub_end_date) : null;
            if (expiry && new Date() > expiry && userProfile.role !== 'super-admin') {
                document.getElementById('lock-screen').style.display = 'flex';
                return;
            }

            const { data: prods, error: pErr } = await DB.from('products').select('*').eq('user_id', tid).order('name', { ascending: true });
            if (pErr) throw pErr;

            productList = prods || [];
            document.getElementById('product-select').innerHTML = '<option value="">-- Choose Item --</option>' + 
                productList.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

            document.getElementById('btn-submit').disabled = false;
            document.getElementById('btn-submit').innerText = "Save Purchase & Add Stock";

            ['quantity', 'rate'].forEach(id => {
                document.getElementById(id).addEventListener('input', calculateTotal);
            });

        } catch (err) {
            console.error("🚨 Purchase Sync Failure:", err);
            document.getElementById('btn-submit').innerText = "Shield Connection Failed";
        }
    }

    function calculateTotal() {
        const qty = parseFloat(document.getElementById('quantity').value) || 0;
        const rate = parseFloat(document.getElementById('rate').value) || 0;
        const total = qty * rate;
        document.getElementById('total-amount').value = total > 0 ? total.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "0.00";
    }

    function handleItemChange() {
        const pid = document.getElementById('product-select').value;
        const p = productList.find(x => x.id === pid);
        const hsnInput = document.getElementById('hsn-code');

        if (p) {
            document.getElementById('current-stock').value = parseFloat(p.stock_quantity || 0).toFixed(3);
            hsnInput.value = p.hsn_code || "NA"; 
        } else {
            document.getElementById('current-stock').value = "0.000";
            hsnInput.value = "NA";
        }
    }

    function setEntryMode(m) { 
        entryMode = m; 
        document.getElementById('mode-select').classList.toggle('active', m === 'select');
        document.getElementById('mode-manual').classList.toggle('active', m === 'manual');
        document.getElementById('wrapper-select').style.display = m === 'select' ? 'grid' : 'none'; 
        document.getElementById('wrapper-manual').style.display = m === 'manual' ? 'block' : 'none'; 
        
        if (m === 'manual') {
            document.getElementById('current-stock').value = "0.000";
            document.getElementById('hsn-code').value = "NA";
        }
    }

    async function submitPurchase() {
        const btn = document.getElementById('btn-submit');
        const tid = userProfile.id;
        
        const qty = parseFloat(document.getElementById('quantity').value);
        const rate = parseFloat(document.getElementById('rate').value);
        const date = document.getElementById('purchase-date').value;
        const finalHsn = document.getElementById('hsn-code').value || "NA";

        if (!qty || !rate || qty <= 0) return alert("Weight and Cost are mandatory.");
        
        btn.disabled = true; 
        btn.innerText = "Synchronizing Vault...";

        try {
            let pid;
            if (entryMode === 'manual') {
                const name = document.getElementById('manual-item-name').value.trim();
                if(!name) throw new Error("New item name is required.");

                const { data: newP, error: pErr } = await DB.from('products').insert({ 
                    name: name, 
                    hsn_code: finalHsn, 
                    stock_quantity: qty, 
                    user_id: tid 
                }).select().single();
                
                if (pErr) throw pErr;
                pid = newP.id;

                await DB.from('inventory_logs').insert({
                    product_id: pid, user_id: tid, change_amount: qty, reason: 'Initial Inventory Entry'
                });

            } else {
                pid = document.getElementById('product-select').value;
                if(!pid) throw new Error("Please select an item from the vault.");
                
                const p = productList.find(x => x.id === pid);
                const { error: upErr } = await DB.from('products').update({ 
                    stock_quantity: parseFloat(p.stock_quantity || 0) + qty,
                    hsn_code: finalHsn 
                }).eq('id', pid);

                if (upErr) throw upErr;

                await DB.from('inventory_logs').insert({
                    product_id: pid, user_id: tid, change_amount: qty, reason: 'Bulk Purchase / Stock-In'
                });
            }

            const { error: purErr } = await DB.from('purchases').insert({ 
                merchant_id: tid, 
                product_id: pid, 
                purchase_date: date,
                weight: qty, 
                cost_per_gram: rate, 
                total_value: qty * rate
            });

            if (purErr) throw purErr;

            alert("Stock Vault Updated Successfully!");
            window.location.reload();

        } catch (err) { 
            console.error("🚨 Purchase Transaction Failed:", err);
            alert("Shield Error: " + (err.message || "Transaction failed.")); 
            btn.disabled = false; 
            btn.innerText = "Save Purchase & Add Stock"; 
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

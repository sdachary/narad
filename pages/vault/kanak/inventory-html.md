---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/inventory.html"
project: "kanak"
role: auth
language: html
frameworks: [docker]
lines: 183
size: 9559 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:38"
tags: [auth, code, docker, html, project/kanak]
---

# inventory.html

> Authentication / authorization module using **docker** (183 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/inventory.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | docker |
| **Lines** | 183 |
| **Size** | 9559 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Available Stock | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #080808; --panel: #121212; --text: #e0e0e0; --danger: #ff4757; }
        body { background: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
        .nav-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--gold); padding-bottom: 15px; margin-bottom: 25px; }
        .btn-nav { background: #222; color: #fff; border: 1px solid #444; padding: 8px 15px; border-radius: 6px; text-decoration: none; cursor: pointer; font-size: 0.8rem; }
        
        .search-box { width: 100%; padding: 12px 40px; background: #1a1a1a; border: 1px solid #333; color: #fff; border-radius: 10px; margin-bottom: 20px; box-sizing: border-box; }
        
        table { width: 100%; border-collapse: collapse; background: var(--panel); border-radius: 12px; overflow: hidden; border: 1px solid #222; }
        th { text-align: left; padding: 15px; color: var(--gold); font-size: 0.7rem; text-transform: uppercase; border-bottom: 1px solid #222; }
        td { padding: 15px; border-bottom: 1px solid #1a1a1a; font-size: 0.85rem; vertical-align: middle; }
        
        .qty-badge { background: rgba(212, 175, 55, 0.1); color: var(--gold); padding: 5px 12px; border-radius: 20px; font-weight: bold; border: 1px solid var(--gold); }
        .btn-history { background: #222; border: 1px solid #444; color: #888; cursor: pointer; padding: 8px 12px; border-radius: 6px; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; }
        .btn-history:hover { border-color: var(--gold); color: var(--gold); background: #2a2a2a; }

        /* Modal Styles */
        .modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:1000; }
        .modal-content { background: #111; border: 1px solid var(--gold); width: 90%; max-width: 500px; margin: 50px auto; padding: 25px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
        .log-row { border-bottom: 1px solid #222; padding: 12px 0; display: flex; justify-content: space-between; align-items: center; }
        
        .error-container { text-align: center; padding: 40px; }
        .retry-btn { margin-top: 15px; background: var(--gold); color: black; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; }
    </style>
</head>
<body>

<div class="nav-header">
    <a href="/dashboard" class="btn-nav"><i class="fas fa-arrow-left"></i> Back</a>
    <h2 style="margin:0; color:var(--gold); font-size: 1.1rem; letter-spacing: 2px;">AVAILABLE STOCK</h2>
    <a href="/dashboard" class="btn-nav"><i class="fas fa-home"></i> Home</a>
</div>

<input type="text" id="search" class="search-box" placeholder="🔍 Search items by name or HSN..." onkeyup="loadInventory()">

<table>
    <thead>
        <tr>
            <th>Item Name</th>
            <th>HSN</th>
            <th>Qty (g)</th>
            <th style="text-align: center;">History</th>
        </tr>
    </thead>
    <tbody id="inventory-list">
        <tr><td colspan="4" style="text-align:center; padding:40px; color:#666;">Synchronizing Vault...</td></tr>
    </tbody>
</table>

<div id="log-modal" class="modal">
    <div class="modal-content">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:15px; margin-bottom:15px;">
            <h3 style="color:var(--gold); margin:0; font-size: 1.2rem;"><i class="fas fa-history"></i> Stock Movement</h3>
            <button class="btn-nav" onclick="closeLogs()" style="background:var(--danger); border:none;">Close</button>
        </div>
        <div id="log-content" style="max-height: 400px; overflow-y: auto;"></div>
    </div>
</div>

<script>
    /**
     * 🛡️ loadInventory: Fetches stock data via the Worker Shield.
     */
    async function loadInventory() {
        try {
            // 1. Connection Guard: Wait for window.DB to be ready
            if (typeof DB === 'undefined') { 
                console.log("⏳ Shield: Waiting for DB connector...");
                setTimeout(loadInventory, 300); 
                return; 
            }

            // 2. Auth Guard: Ensure session is valid via Shield
            const { data: { session }, error: sessionError } = await DB.auth.getSession();
            if (sessionError || !session) {
                console.warn("🔒 Inventory: Unauthorized access. Redirecting...");
                return window.location.href = '/login';
            }
            
            const tid = localStorage.getItem('impersonate_id') || session.user.id;
            const query = document.getElementById('search').value.toLowerCase();

            // 3. Shielded Data Fetch
            // We use .order() to ensure the table looks professional on load
            const { data: prods, error: fetchError } = await DB.from('products')
                .select('*')
                .eq('user_id', tid)
                .order('name', { ascending: true });
            
            if (fetchError) throw fetchError;

            // 4. Client-side Filter
            const filtered = prods.filter(p => 
                p.name.toLowerCase().includes(query) || 
                (p.hsn_code && p.hsn_code.includes(query))
            );
            
            // 5. Build UI
            const listEl = document.getElementById('inventory-list');
            if (filtered.length === 0) {
                listEl.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">No items found.</td></tr>`;
                return;
            }

            listEl.innerHTML = filtered.map(p => `
                <tr>
                    <td><strong>${p.name}</strong><br><small style="color:#555">ID: ${p.id.slice(0,8)}</small></td>
                    <td style="color:#888">${p.hsn_code || 'NA'}</td>
                    <td><span class="qty-badge">${parseFloat(p.stock_quantity || 0).toFixed(2)}g</span></td>
                    <td style="text-align: center;">
                        <button class="btn-history" onclick="showLogs('${p.id}')" title="View Logs">
                            <i class="fas fa-history"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (err) {
            console.error("🚨 Inventory Fetch Failed:", err);
            // This UI specifically addresses the NetworkError from your screenshot
            document.getElementById('inventory-list').innerHTML = `
                <tr><td colspan="4" class="error-container">
                    <div style="color:var(--danger); font-weight:bold;">Shield Connection Error</div>
                    <div style="font-size:0.8rem; color:#666; margin-top:5px;">${err.message || 'The request was blocked by the browser.'}</div>
                    <button class="retry-btn" onclick="location.reload()">Retry Connection</button>
                </td></tr>`;
        }
    }

    /**
     * 📊 showLogs: Displays movement history for a specific item.
     */
    async function showLogs(pid) {
        document.getElementById('log-modal').style.display = 'block';
        document.getElementById('log-content').innerHTML = "<p style='color:#666; text-align:center; padding:20px;'>Synchronizing Logs...</p>";
        
        try {
            const { data: logs, error } = await DB.from('inventory_logs')
                .select('*')
                .eq('product_id', pid)
                .order('created_at', { ascending: false });
            
            if (error) throw error;

            document.getElementById('log-content').innerHTML = logs.map(l => `
                <div class="log-row">
                    <div>
                        <div style="font-size:0.85rem; font-weight:bold;">${l.reason}</div>
                        <small style="color:#555">${new Date(l.created_at).toLocaleString('en-IN', {day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'})}</small>
                    </div>
                    <div style="color:${l.change_amount > 0 ? '#2ecc71' : '#ff4757'}; font-weight:bold; font-size:1.1rem;">
                        ${l.change_amount > 0 ? '+' : ''}${parseFloat(l.change_amount).toFixed(2)}g
                    </div>
                </div>
            `).join('') || "<p style='color:#666; text-align:center; padding:20px;'>No history found for this item.</p>";

        } catch (err) {
            document.getElementById('log-content').innerHTML = `
                <div style='color:var(--danger); text-align:center; padding:20px;'>
                    <strong>Log Sync Error:</strong> ${err.message}
                </div>`;
        }
    }

    function closeLogs() { document.getElementById('log-modal').style.display = 'none'; }
    window.onclick = (e) => { if (e.target == document.getElementById('log-modal')) closeLogs(); }
    
    // Auto-load once scripts are ready
    document.addEventListener('DOMContentLoaded', loadInventory);
</script>

</body>
</html>

```

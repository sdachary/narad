---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/admin-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 343
size: 14478 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad]
---

# admin-html-md.md

> Authentication / authorization module (343 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/admin-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 343 |
| **Size** | 14478 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/admin-html.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 305
size: 13770 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad]
---

# admin-html.md

> Authentication / authorization module (305 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/admin-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 305 |
| **Size** | 13770 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/admin.html"
project: "kanak"
role: auth
language: html
frameworks: []
lines: 267
size: 13120 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:38"
tags: [auth, code, html, project/kanak]
---

# admin.html

> Authentication / authorization module (267 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/admin.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 267 |
| **Size** | 13120 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SaaS Master Command | Super Admin</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #080808; --card: #121212; --text: #e0e0e0; --danger: #ff4757; --success: #2ecc71; }
        body { background: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; padding: 20px; margin: 0; }
        .admin-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #000; border-bottom: 1px solid var(--gold); margin-bottom: 30px; position: sticky; top:0; z-index:100; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
        .stat-card { background: var(--card); padding: 20px; border-radius: 8px; border: 1px solid #222; text-align: center; }
        .stat-val { font-size: 1.8rem; font-weight: bold; color: #fff; display: block; }
        
        .search-container { margin-bottom: 20px; position: relative; }
        .search-box { width: 100%; padding: 12px 40px; background: #1a1a1a; border: 1px solid #333; color: #fff; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box; }
        .search-container i { position: absolute; left: 15px; top: 15px; color: var(--gold); }

        table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 8px; overflow: hidden; border: 1px solid #222; }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #1a1a1a; font-size: 0.85rem; }
        th { color: var(--gold); text-transform: uppercase; font-size: 0.7rem; background: #000; }
        
        .btn-sm { padding: 6px 10px; border-radius: 4px; border: none; font-weight: bold; cursor: pointer; font-size: 0.65rem; transition: 0.2s; }
        .btn-edit { background: #3498db; color: #fff; width: 100%; margin-bottom: 5px; }
        .btn-stop { background: var(--danger); color: #fff; width: 100%; }

        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.65rem; font-weight: bold; text-transform: uppercase; border: 1px solid transparent; }
        .badge-active { background: rgba(46, 204, 113, 0.1); color: #2ecc71; border-color: #2ecc71; }
        .badge-pending { background: rgba(52, 152, 219, 0.1); color: #3498db; border-color: #3498db; }
        .badge-expired { background: rgba(255, 71, 87, 0.1); color: var(--danger); border-color: var(--danger); }

        #sub-modal { display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:var(--card); border:2px solid var(--gold); padding:30px; z-index:1000; border-radius:12px; width:400px; box-shadow:0 0 50px rgba(0,0,0,0.8); }
        .overlay { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:999; }
        input { width:100%; padding:10px; background:#222; border:1px solid #444; color:#fff; margin:10px 0; border-radius:5px; box-sizing: border-box; }
        label { font-size: 0.7rem; color: #888; font-weight: bold; }
        
        .status-msg { text-align: center; padding: 40px; color: #666; }
        .retry-btn { background: var(--gold); color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 15px; }
    </style>
</head>
<body>

<div id="sub-modal">
    <h3 style="color:var(--gold); margin-top:0;">Manage Subscription</h3>
    <input type="hidden" id="edit-id">
    <label>START DATE</label><input type="date" id="edit-start">
    <label>EXPIRY DATE</label><input type="date" id="edit-end">
    <label>AMOUNT PAID (₹)</label><input type="number" id="edit-amount" placeholder="0">
    <button id="save-btn" class="btn-sm" style="background:var(--gold); color:#000; width:100%; padding:15px; font-size:1rem; margin-top: 10px;" onclick="saveSubscription()">SAVE & ACTIVATE</button>
    <button class="btn-sm" style="background:#444; color:#fff; width:100%; margin-top:10px;" onclick="closeModal()">CANCEL</button>
</div>
<div class="overlay" id="overlay" onclick="closeModal()"></div>

<nav class="admin-nav">
    <h1 style="margin:0; font-size: 1.5rem;"><i class="fas fa-crown" style="color:var(--gold);"></i> MASTER COMMAND</h1>
    <a href="/dashboard" style="color:#888; text-decoration:none; font-weight:bold;"><i class="fas fa-arrow-left"></i> DASHBOARD</a>
</nav>

<div class="container">
    <div class="stats-grid">
        <div class="stat-card"><span class="stat-val" id="s-act">0</span><div style="font-size:0.7rem; color:#888;">ACTIVE MERCHANTS</div></div>
        <div class="stat-card"><span class="stat-val" id="s-pending">0</span><div style="font-size:0.7rem; color:#888;">PENDING APPROVAL</div></div>
        <div class="stat-card"><span class="stat-val" id="s-rev">₹0</span><div style="font-size:0.7rem; color:var(--gold);">TOTAL REVENUE</div></div>
    </div>

    <div style="background:var(--card); padding:25px; border-radius:12px; border: 1px solid #222;">
        <div class="search-container">
            <i class="fas fa-search"></i>
            <input type="text" id="m-search" class="search-box" placeholder="Search by Shop, Email, or Mobile..." onkeyup="filterMerchants()">
        </div>
        <table>
            <thead>
                <tr>
                    <th>Merchant Details</th>
                    <th>Subscription</th>
                    <th>Revenue</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="m-list">
                <tr><td colspan="5" class="status-msg">Synchronizing Master Connection...</td></tr>
            </tbody>
        </table>
    </div>
</div>

<script>
    let allMerchants = [];

    /**
     * 🛡️ loadAdminData: Pulls high-privilege list via Shield Worker RPC
     */
     async function loadAdminData() {
        try {
            // 1. Connection Guard
            if (typeof DB === 'undefined') { 
                setTimeout(loadAdminData, 300); 
                return; 
            }

            // 2. Auth Verification
            const { data: { session }, error: authErr } = await DB.auth.getSession();
            if (authErr || !session) return window.location.href = '/login';

            // 🔐 FIX 2: Client-side role pre-check (database also enforces this)
            const { data: myProfile } = await DB.from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
            if (!myProfile || myProfile.role !== 'super-admin') {
                console.warn("🚫 Not an admin. Redirecting.");
                return window.location.href = '/dashboard';
            }

            // 3. Shielded RPC Call
            const { data: merchants, error } = await DB.rpc('get_admin_merchant_list');

            if (error) throw error;

            allMerchants = merchants || [];
            renderTable(allMerchants);

        } catch (err) {
            console.error("🚨 Admin Sync Failure:", err);
            // Targeted Error UI for NetworkError
            document.getElementById('m-list').innerHTML = `
                <tr><td colspan="5" class="status-msg">
                    <div style="color:var(--danger); font-weight:bold;">Master Shield Connection Failed</div>
                    <div style="font-size:0.8rem; margin-top:5px;">${err.message || 'Verification handshake failed.'}</div>
                    <button class="retry-btn" onclick="loadAdminData()">Retry Connection</button>
                </td></tr>`;
        }
    }

    function renderTable(data) {
        const list = document.getElementById('m-list');
        list.innerHTML = '';
        let totalRev = 0, activeCount = 0, pendingCount = 0;

        if (data.length === 0) {
            list.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No merchants found.</td></tr>';
            return;
        }

        data.forEach(m => {
            totalRev += parseFloat(m.amount_paid || 0);
            const status = m.membership_status || 'pending';
            if (status === 'active') activeCount++;
            if (status === 'pending') pendingCount++;
            
            // 🛡️ FIX 3: All values wrapped in sanitize() to prevent XSS
            list.innerHTML += `<tr>
                <td>
                    <strong style="color:white;">${sanitize(m.shop_name) || 'NEW SHOP'}</strong><br>
                    <small style="color:#666;">
                        ${sanitize(m.email)}<br>
                        <i class="fas fa-phone"></i> ${sanitize(m.mobile_no) || 'N/A'}
                    </small>
                </td>
                <td><small>${sanitize(m.sub_start_date) || '--'} to</small><br><strong>${sanitize(m.sub_end_date) || '--'}</strong></td>
                <td><strong style="color:var(--gold);">${formatINR(m.amount_paid)}</strong></td>
                <td><span class="badge badge-${sanitize(status)}">${sanitize(status).toUpperCase()}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="openModal('${sanitize(m.id)}', '${sanitize(m.sub_start_date)}', '${sanitize(m.sub_end_date)}', '${sanitize(m.amount_paid)}')">MANAGE</button>
                    <button class="btn-sm btn-stop" onclick="updateStatus('${sanitize(m.id)}', 'expired')">EXPIRE</button>
                </td>
            </tr>`;
        });

        document.getElementById('s-act').innerText = activeCount;
        document.getElementById('s-pending').innerText = pendingCount;
        document.getElementById('s-rev').innerText = '₹' + totalRev.toLocaleString('en-IN');
    }

    function filterMerchants() {
        const query = document.getElementById('m-search').value.toLowerCase();
        const filtered = allMerchants.filter(m => 
            (m.shop_name && m.shop_name.toLowerCase().includes(query)) || 
            (m.email && m.email.toLowerCase().includes(query)) ||
            (m.mobile_no && m.mobile_no.includes(query))
        );
        renderTable(filtered);
    }

    function openModal(id, start, end, amount) {
        document.getElementById('edit-id').value = id;
        document.getElementById('edit-start').value = start || '';
        document.getElementById('edit-end').value = end || '';
        document.getElementById('edit-amount').value = amount || 0;
        document.getElementById('sub-modal').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('sub-modal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }

    /**
     * 🔐 saveSubscription: Admin Override via Shield Worker
     */
    async function saveSubscription() {
        const id = document.getElementById('edit-id').value;
        const btn = document.getElementById('save-btn');
        const start = document.getElementById('edit-start').value;
        const end = document.getElementById('edit-end').value;
        const amount = parseFloat(document.getElementById('edit-amount').value) || 0;

        if (!start || !end) return alert("Please select subscription dates.");

        btn.disabled = true;
        btn.innerText = "BYPASSING RLS...";

        try {
            const { error } = await DB.rpc('admin_update_profile', {
                target_id: id,
                new_status: 'active',
                new_start: start,
                new_end: end,
                new_amount: amount
            });

            if (error) throw error;

            alert("Merchant Activated! Database Shield updated.");
            closeModal();
            await loadAdminData();

        } catch (err) {
            alert("Admin Override Failed: " + err.message);
        } finally {
            btn.disabled = false;
            btn.innerText = "SAVE & ACTIVATE";
        }
    }

    async function updateStatus(uid, status) {
        if (!confirm(`Set status to ${status.toUpperCase()}?`)) return;
        
        try {
            const m = allMerchants.find(x => x.id === uid);
            const { error } = await DB.rpc('admin_update_profile', {
                target_id: uid,
                new_status: status,
                new_start: m?.sub_start_date || new Date().toISOString().split('T')[0],
                new_end: m?.sub_end_date || new Date().toISOString().split('T')[0],
                new_amount: m?.amount_paid || 0
            });

            if (error) throw error;
            await loadAdminData();

        } catch (err) {
            alert("Status Update Failed: " + err.message);
        }
    }

    // Auto-load once ready
    document.addEventListener('DOMContentLoaded', loadAdminData);
</script>
</body>
</html>

```

```

```

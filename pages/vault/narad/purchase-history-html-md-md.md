---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/purchase-history-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker]
lines: 272
size: 11494 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [auth, docker, documentation, markdown, project/narad]
---

# purchase-history-html-md.md

> Authentication / authorization module using **docker** (272 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/purchase-history-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 272 |
| **Size** | 11494 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/purchase-history-html.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker]
lines: 234
size: 10719 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, docker, documentation, markdown, project/narad]
---

# purchase-history-html.md

> Authentication / authorization module using **docker** (234 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/purchase-history-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 234 |
| **Size** | 10719 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/purchase-history.html"
project: "kanak"
role: auth
language: html
frameworks: [docker]
lines: 196
size: 10002 bytes
last_modified: "2026-04-09 15:19"
scanned: "2026-04-09 15:19"
tags: [auth, code, docker, html, project/kanak]
---

# purchase-history.html

> Authentication / authorization module using **docker** (196 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/purchase-history.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | docker |
| **Lines** | 196 |
| **Size** | 10002 bytes |
| **Modified** | 2026-04-09 15:19 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Stock Logs | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #121212; --panel: #1E1E1E; --text: #E0E0E0; --danger: #ff4757; --success: #2ecc71; }
        body { background-color: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
        .nav-header { background-color: #000; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--gold); position: sticky; top: 0; z-index: 100; }
        .nav-btn { background: #333; color: #fff; border: 1px solid #555; padding: 8px 15px; border-radius: 8px; text-decoration: none; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .container { max-width: 1000px; margin: 30px auto; padding: 0 20px; }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: var(--panel); padding: 20px; border-radius: 12px; border: 1px solid #333; text-align: center; }
        .stat-card h3 { margin: 0; color: #888; font-size: 0.75rem; text-transform: uppercase; }
        .stat-card p { margin: 10px 0 0; font-size: 1.4rem; font-weight: bold; color: var(--gold); }

        .control-panel { background: var(--panel); padding: 20px; border-radius: 12px; border: 1px solid #333; margin-bottom: 20px; display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap; }
        .filter-group { display: flex; flex-direction: column; gap: 5px; }
        label { font-size: 0.7rem; color: #888; text-transform: uppercase; font-weight: bold; }
        input[type="date"] { background: #000; border: 1px solid #444; color: #fff; padding: 8px; border-radius: 6px; }
        .btn-action { background: var(--gold); color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }

        table { width: 100%; border-collapse: collapse; background: var(--panel); border-radius: 12px; overflow: hidden; border: 1px solid #333; }
        th { background: #000; color: var(--gold); text-align: left; padding: 15px; font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid #333; }
        td { padding: 15px; border-bottom: 1px solid #1a1a1a; font-size: 0.9rem; }

        .weight-badge { background: rgba(212, 175, 55, 0.1); color: var(--gold); padding: 4px 8px; border-radius: 4px; font-weight: bold; border: 1px solid rgba(212,175,55,0.3); }
        .status-msg { text-align: center; padding: 60px; color: #666; }
        .retry-btn { background: var(--gold); color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 15px; }
    </style>
</head>
<body>

<div class="nav-header">
    <a href="/dashboard" class="nav-btn"><i class="fas fa-arrow-left"></i> Back</a>
    <span style="color:var(--gold); font-weight:bold; font-size: 1.2rem; letter-spacing: 1px;">PURCHASE / STOCK LOGS</span>
    <a href="/dashboard" class="nav-btn"><i class="fas fa-home"></i> Home</a>
</div>

<div class="container">

    <div class="stats-grid">
        <div class="stat-card"><h3>Total Entries</h3><p id="stat-count">0</p></div>
        <div class="stat-card"><h3>Total Weight Added</h3><p id="stat-weight">0.000g</p></div>
        <div class="stat-card"><h3>Total Purchase Value</h3><p id="stat-value">₹0</p></div>
    </div>

    <div class="control-panel">
        <div class="filter-group"><label>From</label><input type="date" id="date-from"></div>
        <div class="filter-group"><label>To</label><input type="date" id="date-to"></div>
        <button class="btn-action" onclick="load()"><i class="fas fa-filter"></i> Apply Filter</button>
    </div>

    <div id="table-container" class="status-msg">
        <i class="fas fa-spinner fa-spin"></i> Synchronizing Vault Records...
    </div>
</div>

<script>
    /**
     * 🛡️ load: Fetches stock purchase logs using correct app_data.purchases schema
     * 
     * Correct columns (from app_data.purchases):
     *   id, merchant_id, product_id, purchase_date,
     *   weight, cost_per_gram, total_value, created_at
     * 
     * Joined with app_data.products:
     *   name, hsn_code, category
     */
    async function load() {
        const div = document.getElementById('table-container');

        try {
            // 1. Connection Guard
            if (typeof DB === 'undefined') { 
                setTimeout(load, 300); 
                return; 
            }

            // 2. Auth Guard
            const { data: { session }, error: authError } = await DB.auth.getSession();
            if (authError || !session) return window.location.href = '/login';

            const tid = localStorage.getItem('impersonate_id') || session.user.id;
            const from = document.getElementById('date-from').value;
            const to   = document.getElementById('date-to').value;

            // 3. ✅ Correct column names matching app_data.purchases schema
            let query = DB.from('purchases')
                .select(`
                    id,
                    purchase_date,
                    weight,
                    cost_per_gram,
                    total_value,
                    created_at,
                    products ( name, hsn_code, category )
                `)
                .eq('merchant_id', tid)
                .order('purchase_date', { ascending: false });

            if (from) query = query.gte('purchase_date', from);
            if (to)   query = query.lte('purchase_date', to);

            const { data: list, error: fetchError } = await query;
            if (fetchError) throw fetchError;

            if (!list || list.length === 0) {
                div.innerHTML = "<p style='color:#666; text-align:center; padding:40px;'>No purchase records found for this period.</p>";
                updateStats([], 0, 0);
                return;
            }

            // 4. Calculate totals
            let totalWeight = 0, totalValue = 0;
            list.forEach(p => {
                totalWeight += parseFloat(p.weight || 0);
                totalValue  += parseFloat(p.total_value || 0);
            });
            updateStats(list, totalWeight, totalValue);

            // 5. Build table with correct column names
            div.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Item Name</th>
                            <th>HSN Code</th>
                            <th>Weight Added</th>
                            <th>Rate (₹/g)</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${list.map(p => {
                            const weight   = parseFloat(p.weight || 0);
                            const rate     = parseFloat(p.cost_per_gram || 0);
                            const total    = parseFloat(p.total_value || 0);
                            const date     = new Date(p.purchase_date).toLocaleDateString('en-IN');
                            const itemName = p.products?.name || 'Item Removed';
                            const hsn      = p.products?.hsn_code || 'NA';

                            return `
                                <tr>
                                    <td style="color:#888">${date}</td>
                                    <td>
                                        <strong>${itemName}</strong>
                                        ${p.products?.category ? `<br><small style="color:#555">${p.products.category}</small>` : ''}
                                    </td>
                                    <td style="color:#666; font-size:0.8rem;">${hsn}</td>
                                    <td><span class="weight-badge">${weight.toFixed(3)}g</span></td>
                                    <td>₹${rate.toLocaleString('en-IN')}</td>
                                    <td style="color:var(--success); font-weight:bold;">
                                        ₹${total.toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;

        } catch (err) {
            console.error("🚨 Stock Log Sync Failed:", err);
            div.innerHTML = `
                <div style="color:var(--danger); font-weight:bold; text-align:center; padding:40px;">
                    Vault Sync Failed
                    <div style="font-size:0.8rem; color:#888; margin-top:10px;">${err.message || 'Connection blocked.'}</div>
                    <button class="retry-btn" onclick="load()">Retry Connection</button>
                </div>`;
        }
    }

    function updateStats(list, totalWeight, totalValue) {
        document.getElementById('stat-count').innerText  = list.length;
        document.getElementById('stat-weight').innerText = totalWeight.toFixed(3) + 'g';
        document.getElementById('stat-value').innerText  = '₹' + totalValue.toLocaleString('en-IN');
    }

    // Initialize with current month
    document.addEventListener('DOMContentLoaded', () => {
        const now = new Date();
        document.getElementById('date-from').value = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        document.getElementById('date-to').value   = now.toISOString().split('T')[0];
        load();
    });
</script>
</body>
</html>

```

```

```

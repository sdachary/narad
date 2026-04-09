---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/daily-tally-html-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 280
size: 10094 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, documentation, markdown, project/narad]
---

# daily-tally-html-md-md-md.md

> Authentication / authorization module (280 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/daily-tally-html-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 280 |
| **Size** | 10094 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/daily-tally-html-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 242
size: 9352 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad]
---

# daily-tally-html-md-md.md

> Authentication / authorization module (242 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/daily-tally-html-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 242 |
| **Size** | 9352 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/daily-tally-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 204
size: 8619 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad]
---

# daily-tally-html-md.md

> Authentication / authorization module (204 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/daily-tally-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 204 |
| **Size** | 8619 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/daily-tally-html.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 166
size: 7895 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad]
---

# daily-tally-html.md

> Authentication / authorization module (166 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/daily-tally-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 166 |
| **Size** | 7895 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/daily-tally.html"
project: "kanak"
role: auth
language: html
frameworks: []
lines: 128
size: 7229 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, code, html, project/kanak]
---

# daily-tally.html

> Authentication / authorization module (128 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/daily-tally.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 128 |
| **Size** | 7229 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Daily Cash Tally | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #121212; --panel: #1E1E1E; --text: #E0E0E0; --success: #2ecc71; --info: #3498db; --danger: #ff4757; }
        body { background-color: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
        .nav-header { background-color: #000; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--gold); position: sticky; top: 0; z-index: 100; }
        .nav-btn { background: #333; color: #fff; border: 1px solid #555; padding: 8px 15px; border-radius: 8px; text-decoration: none; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .container { max-width: 1000px; margin: 30px auto; padding: 0 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: var(--panel); padding: 25px; border-radius: 12px; border: 1px solid #333; text-align: center; }
        .stat-card h3 { margin:0; color:#888; font-size:0.75rem; text-transform:uppercase; }
        .stat-card p { margin: 10px 0 0; font-size: 1.8rem; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; background: var(--panel); border-radius: 12px; overflow: hidden; border: 1px solid #333; }
        th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #2a2a2a; }
        th { color: #666; font-size: 0.7rem; text-transform: uppercase; background: #000; }
        
        .loading-overlay { text-align: center; padding: 40px; color: #666; }
        .retry-btn { background: var(--gold); color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 15px; }
    </style>
</head>
<body>

<div class="nav-header">
    <a href="/dashboard" class="nav-btn"><i class="fas fa-arrow-left"></i> Dashboard</a>
    <span style="color:var(--gold); font-weight:bold; letter-spacing: 1px;">DAILY CASH TALLY</span>
    <input type="date" id="tally-date" onchange="loadTally()" style="background:#222; border:1px solid var(--gold); color:#fff; padding:5px; border-radius:4px;">
</div>

<div class="container">
    <div class="stats-grid">
        <div class="stat-card"><h3>Counter Cash</h3><p id="cash-sales" style="color:var(--info)">₹0</p></div>
        <div class="stat-card"><h3>Ledger Recovery</h3><p id="cash-ledger" style="color:var(--success)">₹0</p></div>
        <div class="stat-card" style="border-color:var(--gold);"><h3>Total Cash</h3><p id="cash-total" style="color:var(--gold)">₹0</p></div>
    </div>
    <table id="tally-table">
        <thead><tr><th>Time</th><th>Source</th><th>Customer</th><th>Amount</th></tr></thead>
        <tbody id="tally-body">
            <tr><td colspan="4" class="loading-overlay">Synchronizing Daily Records...</td></tr>
        </tbody>
    </table>
</div>

<script>
    /**
     * 🛡️ loadTally: Aggregates sales and ledger payments via Shield Worker
     */
    async function loadTally() {
        try {
            // 1. Connection Guard
            if (typeof DB === 'undefined') { 
                setTimeout(loadTally, 300); 
                return; 
            }

            const dateInput = document.getElementById('tally-date').value;
            if (!dateInput) return;

            // 2. Auth Verification
            const { data: { session }, error: authErr } = await DB.auth.getSession();
            if (authErr || !session) return window.location.href = '/login';

            const tid = session.user.id;
            const start = `${dateInput}T00:00:00Z`; 
            const end = `${dateInput}T23:59:59Z`;

            // 3. Parallel Shielded Fetching
            const [ordersRes, paymentsRes] = await Promise.all([
                DB.from('orders').select('*').eq('user_id', tid).gte('created_at', start).lte('created_at', end),
                DB.from('payment_logs').select('*').eq('merchant_id', tid).gte('created_at', start).lte('created_at', end)
            ]);

            if (ordersRes.error) throw ordersRes.error;
            if (paymentsRes.error) throw paymentsRes.error;

            const orders = ordersRes.data || [];
            const payments = paymentsRes.data || [];

            // 4. Financial Calculations
            let sCash = orders.reduce((acc, o) => acc + (parseFloat(o.total_amount || 0) - parseFloat(o.balance_due || 0)), 0);
            let lCash = payments.reduce((acc, p) => acc + parseFloat(p.amount || 0), 0);

            document.getElementById('cash-sales').innerText = '₹' + sCash.toLocaleString('en-IN');
            document.getElementById('cash-ledger').innerText = '₹' + lCash.toLocaleString('en-IN');
            document.getElementById('cash-total').innerText = '₹' + (sCash + lCash).toLocaleString('en-IN');

            // 5. Combine and Sort Data
            const combined = [
                ...orders.map(o => ({ t: o.created_at, s: 'Sale', c: o.customer_name, a: (o.total_amount - o.balance_due) })),
                ...payments.map(p => ({ t: p.created_at, s: 'Ledger', c: p.customer_name, a: p.amount }))
            ].sort((a,b) => new Date(b.t) - new Date(a.t));

            document.getElementById('tally-body').innerHTML = combined.map(x => `
                <tr>
                    <td>${new Date(x.t).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                    <td><span style="font-size:0.6rem; padding:2px 6px; border-radius:4px; background:#222; color:var(--gold); border: 1px solid #444;">${x.s.toUpperCase()}</span></td>
                    <td><strong>${x.c || 'Guest'}</strong></td>
                    <td style="color:var(--success); font-weight:bold;">₹${parseFloat(x.a || 0).toLocaleString('en-IN')}</td>
                </tr>
            `).join('') || '<tr><td colspan="4" style="text-align:center; padding:40px;">No entries recorded for this date.</td></tr>';

        } catch (err) {
            console.error("🚨 Tally Sync Failure:", err);
            // Targeted Error UI for NetworkError
            document.getElementById('tally-body').innerHTML = `
                <tr><td colspan="4" style="text-align:center; padding:40px;">
                    <div style="color:var(--danger); font-weight:bold;">Tally Sync Blocked</div>
                    <div style="font-size:0.8rem; margin-top:10px;">${err.message || 'Verification handshake failed.'}</div>
                    <button class="retry-btn" onclick="loadTally()">Retry Sync</button>
                </td></tr>`;
        }
    }

    // Initialize Date and Load
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('tally-date').valueAsDate = new Date();
        loadTally();
    });
</script>
</body>
</html>

```

```

```

```

```

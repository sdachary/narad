---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/dashboard-html-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 425
size: 15123 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, documentation, markdown, project/narad]
---

# dashboard-html-md-md-md.md

> Authentication / authorization module (425 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/dashboard-html-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 425 |
| **Size** | 15123 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/dashboard-html-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 387
size: 14385 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad]
---

# dashboard-html-md-md.md

> Authentication / authorization module (387 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/dashboard-html-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 387 |
| **Size** | 14385 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/dashboard-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 349
size: 13656 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad]
---

# dashboard-html-md.md

> Authentication / authorization module (349 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/dashboard-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 349 |
| **Size** | 13656 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/dashboard-html.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 311
size: 12936 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad]
---

# dashboard-html.md

> Authentication / authorization module (311 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/dashboard-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 311 |
| **Size** | 12936 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/dashboard.html"
project: "kanak"
role: auth
language: html
frameworks: []
lines: 274
size: 12274 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, code, html, project/kanak]
---

# dashboard.html

> Authentication / authorization module (274 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/dashboard.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 274 |
| **Size** | 12274 bytes |
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
    <title>Dashboard | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { 
            --gold: #D4AF37; 
            --gold-glow: rgba(212, 175, 55, 0.4);
            --dark: #09090b; 
            --surface: rgba(24, 24, 27, 0.8);
            --border: rgba(255, 255, 255, 0.08);
            --text: #fafafa;
            --text-dim: #a1a1aa;
            --silver: #cbd5e1;
            --danger: #ef4444;
            --success: #22c55e;
            --sans: 'Inter', system-ui, sans-serif;
        }

        body { 
            background: var(--dark); 
            background-image: radial-gradient(circle at top right, rgba(212, 175, 55, 0.05), transparent 60%);
            color: var(--text); 
            font-family: var(--sans); 
            margin: 0; 
            min-height: 100vh;
        }

        header { 
            background: rgba(9, 9, 11, 0.6); 
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 20px 40px; 
            border-bottom: 1px solid var(--border); 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            position: sticky; 
            top: 0; 
            z-index: 1000; 
        }
        
        .market-banner { 
            background: rgba(24, 24, 27, 0.4); 
            padding: 12px 40px; 
            border-bottom: 1px solid var(--border); 
            font-size: 0.9rem; 
            display: flex; 
            gap: 40px; 
            align-items: center; 
            overflow-x: auto; 
            scrollbar-width: none; 
        }
        .m-item { display: flex; align-items: baseline; gap: 8px; white-space: nowrap; }
        .m-label { color: var(--text-dim); font-weight: 700; text-transform: uppercase; font-size: 0.65rem; letter-spacing: 1px; }
        .m-price { color: var(--gold); font-weight: 800; font-size: 1.2rem; filter: drop-shadow(0 0 8px var(--gold-glow)); }
        
        /* ── BENTO GRID ── */
        .dashboard-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            grid-auto-rows: 180px;
            gap: 20px; 
            padding: 40px; 
            max-width: 1400px; 
            margin: 0 auto; 
        }

        .tile { 
            background: var(--surface); 
            border: 1px solid var(--border); 
            border-radius: 20px; 
            padding: 24px; 
            text-decoration: none; 
            color: inherit; 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            display: flex; 
            flex-direction: column; 
            align-items: flex-start; 
            justify-content: flex-end; 
            position: relative;
            overflow: hidden;
        }

        .tile:hover { 
            border-color: var(--gold); 
            transform: translateY(-8px) scale(1.02); 
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .tile i { font-size: 2.2rem; color: var(--gold); margin-bottom: auto; transition: transform 0.3s; opacity: 0.8; }
        .tile:hover i { transform: scale(1.1) rotate(-5deg); opacity: 1; }
        .tile b { font-size: 1.1rem; font-weight: 700; letter-spacing: -0.02em; }

        /* Bento Logic */
        .tile-lg { grid-column: span 2; grid-row: span 2; }
        .tile-wide { grid-column: span 2; }

        .tile.locked { opacity: 0.3; filter: grayscale(1); cursor: not-allowed; }
        
        .status-badge { font-size: 0.65rem; padding: 6px 14px; border-radius: 100px; font-weight: 800; letter-spacing: 0.5px; border: 1px solid rgba(255,255,255,0.1); }
        .refresh-btn { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: var(--gold); cursor: pointer; padding: 8px; border-radius: 10px; transition: 0.2s; }
        .refresh-btn:hover { background: var(--gold); color: black; }
    </style>
</head>
<body>

<div id="sub-status-banner" class="sub-banner"></div>

<header>
    <div style="display: flex; flex-direction: column;">
        <h1 id="shop-name-brand" style="color:var(--gold); margin:0; font-size: 1.6rem; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">GOLD SAAS</h1>
        <span id="user-email-display" style="font-size: 0.75rem; color: var(--text-dim); margin-top: 4px; font-weight: 500;">Establishing Secure Link...</span>
    </div>
    <div style="display:flex; align-items:center; gap:24px;">
        <span id="live-signal" class="status-badge" style="background:rgba(255,255,255,0.05);">SYNCING VAULT</span>
        <button onclick="logout()" style="background:transparent; border: 1px solid var(--border); color:var(--text); cursor:pointer; padding:10px 20px; border-radius:12px; font-size: 0.85rem; font-weight: 600; transition: 0.2s;">Logout</button>
    </div>
</header>

<div class="market-banner">
    <div class="m-item"><span class="m-label">Gold 24K</span><span class="m-price" id="gold-24k">₹ ---</span></div>
    <div class="m-item"><span class="m-label">Gold 22K</span><span class="m-price" id="gold-22k">₹ ---</span></div>
    <div class="m-item"><span class="m-label">Silver</span><span id="silver-rate" style="color:var(--silver); font-weight:800; font-size:1.2rem;">₹ ---</span></div>
    <div style="margin-left:auto; display:flex; align-items:center; gap:16px;">
        <span id="last-updated-text" style="color:var(--text-dim); font-size:0.75rem; font-weight:600;">Connecting...</span>
        <button class="refresh-btn" onclick="init()"><i class="fas fa-sync-alt"></i></button>
    </div>
</div>

<div class="container">
    <div class="dashboard-grid">
        <a href="/inventory" class="tile tile-lg"><i class="fas fa-gem"></i><b>Stock Inventory</b></a>
        <a href="/billing" id="sell-tile" class="tile"><i class="fas fa-receipt"></i><b>Sell & Estimate</b></a>
        <a href="/purchase" id="purchase-tile" class="tile"><i class="fas fa-plus-circle"></i><b>Add Stock</b></a>
        <a href="/orders" class="tile tile-wide"><i class="fas fa-chart-line"></i><b>Sales Reports</b></a>
        
        <a href="/purchase-report" class="tile">
            <i class="fas fa-file-invoice-dollar" style="color:var(--info)"></i>
            <b>Purchase Reports</b>
        </a>

        <a href="/daily-tally" id="tally-tile" class="tile">
            <i class="fas fa-cash-register" style="color:var(--success)"></i>
            <b>Daily Cash Tally</b>
        </a>

        <a href="/ledger" id="ledger-tile" class="tile tile-wide"><i class="fas fa-book-open" style="color:var(--success)"></i><b>Customer Ledger</b></a>
        <a href="/profile" class="tile"><i class="fas fa-user-cog"></i><b>Settings</b></a>
        
        <a href="/admin" id="admin-tile" class="tile tile-wide" style="display:none; background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent); border-color: var(--gold);">
            <i class="fas fa-shield-alt" style="color:var(--gold)"></i><br><b>SAAS COMMAND</b>
        </a>
    </div>
</div>

<script>
    /**
     * 🛡️ init: Dashboard Bootstrapper (Sovereign Optimized)
     */
    async function init() {
        try {
            // 1. Handshake Guard
            if (typeof DB === 'undefined') { 
                setTimeout(init, 300); 
                return; 
            }

            // 2. Auth Check via Shield
            const { data: { session }, error: authErr } = await DB.auth.getSession();
            if (!session || authErr) { 
                window.location.href = '/login'; 
                return; 
            }

            // 3. Parallel Fetch with Error Handling
            const [profileRes, ratesRes] = await Promise.all([
                DB.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
                DB.from('city_rates').select('*').eq('city_name', 'India').maybeSingle()
            ]);

            // 4. Load Profile & Subscription Logic
            if (profileRes.data) {
                const p = profileRes.data;
                document.getElementById('shop-name-brand').innerText = (p.shop_name || "GOLD SAAS").toUpperCase();
                document.getElementById('user-email-display').innerText = p.email || session.user.email;
                
                // 🛡️ Admin Check (Primary)
                if (p.role === 'super-admin') {
                    document.getElementById('admin-tile').style.display = 'flex';
                }
                checkSubscription(p);
            } else {
                // 🛡️ FALLBACK: Use JWT Metadata if DB Row is blocked/missing
                console.warn("🛡️ Profile not found in DB. Checking JWT fallback...");
                document.getElementById('user-email-display').innerText = session.user.email + " (Vault Syncing...)";
                
                if (session.user.user_metadata?.role === 'super-admin') {
                    document.getElementById('admin-tile').style.display = 'flex';
                }
            }

            // 5. Update Market Rates UI
            updateRatesUI(ratesRes.data);

        } catch (err) {
            console.error("🚨 Dashboard Sync Failed:", err);
            document.getElementById('live-signal').innerText = "CONNECTION LOST";
            document.getElementById('live-signal').style.background = "var(--danger)";
        }
    }

    function updateRatesUI(rates) {
        const signal = document.getElementById('live-signal');
        if (rates) {
            const fmt = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
            document.getElementById('gold-24k').innerText = '₹' + Number(rates.gold_24k).toLocaleString('en-IN', fmt);
            document.getElementById('gold-22k').innerText = '₹' + Number(rates.gold_22k).toLocaleString('en-IN', fmt);
            document.getElementById('silver-rate').innerText = '₹' + Number(rates.silver).toLocaleString('en-IN', fmt);
            document.getElementById('last-updated-text').innerText = `Sync: ${new Date(rates.updated_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
            signal.innerText = "LIVE MARKET ACTIVE";
            signal.style.background = "#2ecc71";
        }
    }

    function checkSubscription(profile) {
        if (profile.role === 'super-admin') return;

        const banner = document.getElementById('sub-status-banner');
        const tilesToLock = [
            document.getElementById('sell-tile'),
            document.getElementById('purchase-tile'),
            document.getElementById('ledger-tile'),
            document.getElementById('tally-tile')
        ];
        
        if (!profile.sub_end_date) return;

        const end = new Date(profile.sub_end_date);
        const today = new Date();
        const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            banner.innerText = "🚨 ACCESS EXPIRED. BILLING, STOCK & CASH TALLY ARE LOCKED. CONTACT ADMIN.";
            banner.className = "sub-banner sub-expired";
            tilesToLock.forEach(t => {
                if(t && !t.classList.contains('locked')) {
                    t.classList.add('locked');
                    t.innerHTML += '<i class="fas fa-lock lock-badge"></i>';
                    t.onclick = (e) => { e.preventDefault(); alert("Trial Expired. Please contact admin to unlock."); };
                }
            });
        } else if (diffDays <= 7) {
            banner.innerText = `⏳ TRIAL COUNTDOWN: ${diffDays} DAYS REMAINING.`;
            banner.className = `sub-banner ${diffDays <= 2 ? 'sub-warning' : 'sub-trial'}`;
        }
    }

    async function logout() { 
        await DB.auth.signOut(); 
        window.location.href = '/login'; 
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

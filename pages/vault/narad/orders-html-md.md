---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/orders-html.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker]
lines: 323
size: 15981 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [auth, docker, documentation, markdown, project/narad]
---

# orders-html.md

> Authentication / authorization module using **docker** (323 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/orders-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 323 |
| **Size** | 15981 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/orders.html"
project: "kanak"
role: auth
language: html
frameworks: [docker]
lines: 285
size: 15294 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [auth, code, docker, html, project/kanak]
---

# orders.html

> Authentication / authorization module using **docker** (285 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/orders.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | docker |
| **Lines** | 285 |
| **Size** | 15294 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Business Analytics | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #121212; --panel: #1E1E1E; --text: #E0E0E0; --success: #2ecc71; --info: #3498db; --danger: #ff4757; }
        body { background-color: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
        .nav-header { background-color: #000; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--gold); position: sticky; top: 0; z-index: 100; }
        .nav-btn { background: #333; color: #fff; border: 1px solid #555; padding: 8px 15px; border-radius: 8px; text-decoration: none; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .container { max-width: 1100px; margin: 30px auto; padding: 0 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: var(--panel); padding: 20px; border-radius: 12px; border: 1px solid #333; text-align: center; border-bottom: 3px solid var(--gold); }
        .stat-val { font-size: 1.3rem; font-weight: bold; color: #fff; margin-top: 5px; }
        .stat-label { color: var(--gold); font-size: 0.7rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .control-panel { background: var(--panel); padding: 25px; border-radius: 12px; border: 1px solid #333; margin-bottom: 30px; }
        .filter-row { display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 20px; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        input[type="date"] { background: #2a2a2a; border: 1px solid #444; color: #fff; padding: 10px; border-radius: 6px; }
        .btn-filter { background: var(--gold); color: #000; padding: 10px 20px; border-radius: 6px; border: none; font-weight: bold; cursor: pointer; transition: 0.2s; height: 40px; }
        .btn-export { background: var(--success); color: #fff; padding: 10px 20px; border-radius: 6px; border: none; font-weight: bold; cursor: pointer; transition: 0.2s; height: 40px; margin-left: 5px; }
        
        .order-card { background: var(--panel); padding: 20px; margin-bottom: 12px; border-radius: 8px; border: 1px solid #222; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; }
        .order-card.payment { border-left: 5px solid var(--success); }
        .order-card:hover { border-color: var(--gold); background: #222; transform: translateX(5px); }
        .type-tag { font-size: 0.6rem; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; font-weight: bold; margin-bottom: 5px; display: inline-block; }
        
        .loading-msg { text-align: center; padding: 40px; color: #666; }
        .retry-btn { background: var(--gold); color: black; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 15px; }
    </style>
</head>
<body>

<div class="nav-header">
    <a href="/dashboard" class="nav-btn"><i class="fas fa-arrow-left"></i> Back</a>
    <span style="color:var(--gold); font-weight:bold; font-size: 1.1rem;">BUSINESS ANALYTICS & CASH TALLY</span>
    <a href="/dashboard" class="nav-btn"><i class="fas fa-home"></i> Home</a>
</div>

<div class="container">
    <div class="stats-grid">
        <div class="stat-card"><div class="stat-label">Total Sales</div><div class="stat-val" id="stat-revenue">₹ 0</div></div>
        <div class="stat-card"><div class="stat-label">Cash Collected</div><div class="stat-val" id="stat-cash" style="color:var(--success)">₹ 0</div></div>
        <div class="stat-card"><div class="stat-label">GST Collected</div><div class="stat-val" id="stat-tax">₹ 0</div></div>
        <div class="stat-card"><div class="stat-label">Total Entries</div><div class="stat-val" id="stat-count">0</div></div>
    </div>

    <div class="control-panel">
        <div class="filter-row">
            <div class="filter-group"><label>From</label><input type="date" id="date-from"></div>
            <div class="filter-group"><label>To</label><input type="date" id="date-to"></div>
            <button class="btn-filter" id="refresh-btn" onclick="load()"><i class="fas fa-sync-alt"></i> REFRESH</button>
            <button class="btn-export" onclick="exportTaxSummary()"><i class="fas fa-file-invoice-dollar"></i> TAX SUMMARY</button>
        </div>
        <div id="list" class="loading-msg">Synchronizing Business Data...</div>
    </div>
</div>

<script>
    let combinedData = [];
    let merchantProfile = null;

    // 🔧 FIX 7: Pagination variables
    const PAGE_SIZE  = 50;   // how many records to show per page
    let currentPage  = 0;    // which page we're on (0 = first page)
    let totalOrders  = 0;    // total number of records (filled by query)
    let totalPayments = 0;

    /**
     * 🛡️ init: Handles Shield handshake
     */
    async function init() {
        if (typeof DB === 'undefined') { setTimeout(init, 300); return; }
        const now = new Date();
        document.getElementById('date-from').value = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        document.getElementById('date-to').value = now.toISOString().split('T')[0];
        load();
    }

    /**
     * 🛰️ load: Pulls aggregated Sales & Payments via Shield Proxy
     */
    async function load() {
        const btn = document.getElementById('refresh-btn');
        const listDiv = document.getElementById('list');
        
        try {
            const { data: { session }, error: authErr } = await DB.auth.getSession();
            if(!session || authErr) return window.location.href='/login';
            
            btn.disabled = true;
            listDiv.innerHTML = '<div class="loading-msg"><i class="fas fa-spinner fa-spin"></i> Communicating with Vault Shield...</div>';
            
            const tid = localStorage.getItem('impersonate_id') || session.user.id;
            const from = document.getElementById('date-from').value;
            const to = document.getElementById('date-to').value;

            // Parallel fetch for speed & consistency
            // 🔧 FIX 7: Use pagination — only fetch PAGE_SIZE records at a time
            const fromRow = currentPage * PAGE_SIZE;
            const toRow   = fromRow + PAGE_SIZE - 1;

            const [profileRes, ordersRes, paymentsRes] = await Promise.all([
                DB.from('profiles').select('*').eq('id', tid).single(),
                DB.from('orders')
                    .select('*, order_items(*)', { count: 'exact' })
                    .eq('user_id', tid)
                    .gte('created_at', `${from}T00:00:00`)
                    .lte('created_at', `${to}T23:59:59`)
                    .order('created_at', { ascending: false })
                    .range(fromRow, toRow),
                DB.from('payment_logs')
                    .select('*', { count: 'exact' })
                    .eq('merchant_id', tid)
                    .gte('created_at', `${from}T00:00:00`)
                    .lte('created_at', `${to}T23:59:59`)
                    .order('created_at', { ascending: false })
                    .range(fromRow, toRow)
            ]);

            if (profileRes.error) throw profileRes.error;
            if (ordersRes.error) throw ordersRes.error;
            if (paymentsRes.error) throw paymentsRes.error;

            merchantProfile = profileRes.data;

            // 🔧 FIX 7: Store counts for pagination controls
            totalOrders   = ordersRes.count   || 0;
            totalPayments = paymentsRes.count || 0;

            // 3. Merge and Sort
            const merged = [
                ...(ordersRes.data || []).map(o => ({ ...o, entryType: 'SALE' })),
                ...(paymentsRes.data || []).map(p => ({ ...p, entryType: 'CREDIT_PAYMENT' }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            combinedData = merged;
            updateMetrics(merged);
            renderList(merged);
            renderPagination();   // ← show page controls

        } catch (err) {
            console.error("🚨 Analytics Failure:", err);
            listDiv.innerHTML = `
                <div class="loading-msg">
                    <div style="color:var(--danger); font-weight:bold;">Vault Handshake Failed</div>
                    <div style="font-size:0.8rem; margin-top:10px;">${err.message || 'CORS Verification Error'}</div>
                    <button class="retry-btn" onclick="load()">Retry Sync</button>
                </div>`;
        } finally {
            btn.disabled = false;
        }
    }

    function updateMetrics(data) {
        let totalSales = 0;
        let totalCashInHand = 0;
        let totalTax = 0;

        data.forEach(item => {
            if (item.entryType === 'SALE') {
                totalSales += (parseFloat(item.total_amount) || 0);
                totalTax += (parseFloat(item.tax_amount) || 0);
                // Sales Revenue = Grand Total (Total Sales)
                // Cash from sale = (Total - Balance Due)
                totalCashInHand += (parseFloat(item.total_amount || 0) - parseFloat(item.balance_due || 0));
            } else {
                // Credit recovery is 100% Cash
                totalCashInHand += (parseFloat(item.amount) || 0);
            }
        });

        document.getElementById('stat-revenue').innerText = '₹' + totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2});
        document.getElementById('stat-cash').innerText = '₹' + totalCashInHand.toLocaleString('en-IN', {minimumFractionDigits: 2});
        document.getElementById('stat-tax').innerText = '₹' + totalTax.toLocaleString('en-IN', {minimumFractionDigits: 2});
        document.getElementById('stat-count').innerText = data.length;
    }

    function renderList(data) {
        const div = document.getElementById('list');
        div.innerHTML = data.length === 0 ? "<p style='text-align:center;color:#666;padding:40px;'>No records found for this period.</p>" : data.map(o => {
            const isSale = o.entryType === 'SALE';
            const displayAmt = isSale ? o.total_amount : o.amount;
            // 🛡️ FIX 3: sanitize all values from database
            return `
                <div class="order-card ${isSale ? '' : 'payment'}">
                    <div>
                        <span class="type-tag" style="background:${isSale ? 'var(--gold)' : 'var(--success)'}; color:#000">
                            ${isSale ? 'Invoice' : 'Credit Recovery'}
                        </span>
                        <h4 style="margin:0; color:${isSale ? 'var(--gold)' : 'var(--success)'}">
                            ${isSale ? 'INV-' + sanitize(o.id).slice(0,8).toUpperCase() : 'CUST: ' + sanitize(o.customer_name)}
                        </h4>
                        <small style="color:#666">${formatDate(o.created_at)} | ${sanitize(o.customer_name) || 'Walking Customer'}</small>
                    </div>
                    <div style="text-align:right">
                        <div style="font-weight:bold; font-size:1.1rem">₹${Number(displayAmt).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                        ${isSale ? `<a href="/order-details?id=${sanitize(o.id)}" style="color:var(--gold); font-size:0.75rem; text-decoration:none;">VIEW BILL →</a>` : `<span style="color:var(--success); font-size:0.75rem;">CASH TALLY +</span>`}
                    </div>
                </div>
            `;
        }).join('');
    }

    // 🔧 FIX 7: Draw the Previous / Next page controls
    function renderPagination() {
        const totalRecords = totalOrders + totalPayments;
        const totalPages   = Math.ceil(totalRecords / PAGE_SIZE);

        // Remove old controls if they exist
        const old = document.getElementById('pager');
        if (old) old.remove();

        // Don't show controls if everything fits on one page
        if (totalPages <= 1) return;

        const pager = document.createElement('div');
        pager.id = 'pager';
        pager.style.cssText = 'display:flex; justify-content:center; align-items:center; gap:16px; padding:20px 0; margin-top:10px;';
        pager.innerHTML = `
            <button
                onclick="changePage(-1)"
                ${currentPage === 0 ? 'disabled' : ''}
                style="background:#333; color:#fff; border:1px solid #555; padding:8px 18px; border-radius:6px; cursor:pointer; font-weight:bold;">
                ← Prev
            </button>
            <span style="color:#888; font-size:0.85rem;">
                Page ${currentPage + 1} of ${totalPages}
                &nbsp;|&nbsp; ${totalRecords} total records
            </span>
            <button
                onclick="changePage(1)"
                ${currentPage >= totalPages - 1 ? 'disabled' : ''}
                style="background:#333; color:#fff; border:1px solid #555; padding:8px 18px; border-radius:6px; cursor:pointer; font-weight:bold;">
                Next →
            </button>
        `;
        document.getElementById('list').after(pager);
    }

    function changePage(direction) {
        currentPage += direction;
        load(); // reload with new page
    }
    /**
     * 📄 exportTaxSummary: Generates PDF specifically for Tax filing
     */
    async function exportTaxSummary() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const salesOnly = combinedData.filter(d => d.entryType === 'SALE');
        
        doc.setFontSize(18);
        doc.text("GST SALES SUMMARY", 105, 20, {align:"center"});
        doc.setFontSize(10);
        doc.text(`Period: ${document.getElementById('date-from').value} to ${document.getElementById('date-to').value}`, 105, 28, {align:"center"});

        doc.autoTable({
            startY: 40,
            head: [['Date', 'Invoice ID', 'Customer', 'Taxable Amt', 'GST (3%)', 'Total']],
            body: salesOnly.map(o => [
                new Date(o.created_at).toLocaleDateString('en-IN'),
                o.id.slice(0,8).toUpperCase(),
                o.customer_name || 'Walk-in',
                '₹' + (o.total_amount - o.tax_amount).toFixed(2),
                '₹' + o.tax_amount.toFixed(2),
                '₹' + o.total_amount.toFixed(2)
            ]),
            headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0] }
        });

        window.open(doc.output('bloburl'), '_blank');
    }

    init();
</script>
</body>
</html>

```

```

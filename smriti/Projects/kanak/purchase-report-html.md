---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/purchase-report.html"
project: "kanak"
role: auth
language: html
frameworks: []
lines: 173
size: 8875 bytes
last_modified: "2026-04-09 15:19"
scanned: "2026-04-09 15:19"
tags: [auth, code, html, project/kanak]
---

# purchase-report.html

> Authentication / authorization module (173 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/purchase-report.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 173 |
| **Size** | 8875 bytes |
| **Modified** | 2026-04-09 15:19 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Purchase Reports | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #121212; --panel: #1E1E1E; --text: #E0E0E0; --success: #2ecc71; --danger: #ff4757; }
        body { background-color: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
        .nav-header { background-color: #000; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--gold); position: sticky; top: 0; z-index: 100; }
        .nav-btn { background: #333; color: #fff; border: 1px solid #555; padding: 8px 15px; border-radius: 8px; text-decoration: none; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .container { max-width: 1100px; margin: 30px auto; padding: 0 20px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: var(--panel); padding: 20px; border-radius: 12px; border: 1px solid #333; text-align: center; }
        .stat-card h3 { margin: 0; color: #888; font-size: 0.8rem; text-transform: uppercase; }
        .stat-card p { margin: 10px 0 0; font-size: 1.5rem; font-weight: bold; color: var(--gold); }

        .control-panel { background: var(--panel); padding: 20px; border-radius: 12px; border: 1px solid #333; margin-bottom: 20px; display: flex; gap: 15px; align-items: flex-end; }
        .filter-group { display: flex; flex-direction: column; gap: 5px; }
        label { font-size: 0.7rem; color: #888; text-transform: uppercase; font-weight: bold; }
        input[type="date"] { background: #000; border: 1px solid #444; color: #fff; padding: 8px; border-radius: 6px; }

        table { width: 100%; border-collapse: collapse; background: var(--panel); border-radius: 12px; overflow: hidden; border: 1px solid #333; }
        th { background: #000; color: var(--gold); text-align: left; padding: 15px; font-size: 0.8rem; text-transform: uppercase; }
        td { padding: 15px; border-bottom: 1px solid #2a2a2a; font-size: 0.9rem; }
        
        .date-label { color: #888; font-size: 0.75rem; }
        .weight-badge { background: rgba(212, 175, 55, 0.1); color: var(--gold); padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .btn-action { background: var(--gold); color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .btn-export { background: var(--success); color: #fff; }
    </style>
</head>
<body>

<div class="nav-header">
    <a href="/dashboard" class="nav-btn"><i class="fas fa-arrow-left"></i> Dashboard</a>
    <span style="color:var(--gold); font-weight:bold; letter-spacing: 1px;">STOCK PURCHASE HISTORY</span>
    <div style="width:100px"></div>
</div>

<div class="container">
    <div class="stats-grid">
        <div class="stat-card"><h3>Total Stock Added (g)</h3><p id="stat-total-wt">0.000g</p></div>
        <div class="stat-card"><h3>Total Purchase Value</h3><p id="stat-total-val">₹0</p></div>
    </div>

    <div class="control-panel">
        <div class="filter-group"><label>From</label><input type="date" id="date-from"></div>
        <div class="filter-group"><label>To</label><input type="date" id="date-to"></div>
        <button class="btn-action" onclick="loadPurchaseHistory()"><i class="fas fa-filter"></i> Apply Filter</button>
        <button class="btn-action btn-export" onclick="exportToPDF()"><i class="fas fa-file-pdf"></i> Export PDF</button>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Item Name</th>
                <th>Weight Added</th>
                <th>Rate (₹/g)</th>
                <th>Total Value</th>
            </tr>
        </thead>
        <tbody id="purchase-body">
            <tr><td colspan="5" style="text-align:center; padding:50px; color:#666;">Synchronizing Purchase Records...</td></tr>
        </tbody>
    </table>
</div>

<script>
    let currentRecords = [];

    async function loadPurchaseHistory() {
        try {
            if (typeof DB === 'undefined') { setTimeout(loadPurchaseHistory, 300); return; }

            const { data: { session }, error: authErr } = await DB.auth.getSession();
            if (authErr || !session) return window.location.href = '/login';

            const tid = localStorage.getItem('impersonate_id') || session.user.id;
            const from = document.getElementById('date-from').value;
            const to = document.getElementById('date-to').value;

            // 3. Relational Data Fetch with Date Filter
            let query = DB.from('purchases')
                .select(`id, purchase_date, weight, cost_per_gram, total_value, products ( name )`)
                .eq('merchant_id', tid)
                .order('purchase_date', { ascending: false });

            if (from) query = query.gte('purchase_date', from);
            if (to) query = query.lte('purchase_date', to);

            const { data: records, error: fetchErr } = await query;
            if (fetchErr) throw fetchErr;

            currentRecords = records;
            let totalWt = 0, totalVal = 0;
            
            const html = records.map(r => {
                const wt = parseFloat(r.weight || 0);
                const val = parseFloat(r.total_value || 0);
                totalWt += wt;
                totalVal += val;
                
                return `
                    <tr>
                        <td class="date-label">${new Date(r.purchase_date).toLocaleDateString('en-IN')}</td>
                        <td><strong>${r.products?.name || 'Item Removed'}</strong></td>
                        <td><span class="weight-badge">${wt.toFixed(3)}g</span></td>
                        <td>₹${parseFloat(r.cost_per_gram || 0).toLocaleString('en-IN')}</td>
                        <td style="color:var(--success); font-weight:bold;">₹${val.toLocaleString('en-IN')}</td>
                    </tr>
                `;
            }).join('');

            document.getElementById('purchase-body').innerHTML = html || '<tr><td colspan="5" style="text-align:center; padding:20px;">No records found for this period.</td></tr>';
            document.getElementById('stat-total-wt').innerText = totalWt.toFixed(3) + 'g';
            document.getElementById('stat-total-val').innerText = '₹' + totalVal.toLocaleString('en-IN');

        } catch (err) {
            console.error("🚨 Sync Error:", err);
            document.getElementById('purchase-body').innerHTML = `<tr><td colspan="5" style="text-align:center; padding:50px; color:var(--danger)">Sync Failed: ${err.message}</td></tr>`;
        }
    }

    /**
     * 📄 exportToPDF: Generates a professional purchase audit PDF
     */
    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("STOCK PURCHASE AUDIT REPORT", 105, 20, {align:"center"});
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, {align:"center"});

        const tableData = currentRecords.map(r => [
            new Date(r.purchase_date).toLocaleDateString('en-IN'),
            r.products?.name || 'Removed',
            parseFloat(r.weight).toFixed(3) + 'g',
            'Rs. ' + parseFloat(r.cost_per_gram).toLocaleString(),
            'Rs. ' + parseFloat(r.total_value).toLocaleString()
        ]);

        doc.autoTable({
            startY: 35,
            head: [['Date', 'Item', 'Weight', 'Rate/g', 'Total Value']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0] }
        });

        doc.save(`Gold-Purchase-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    // Initialize with current month
    document.addEventListener('DOMContentLoaded', () => {
        const now = new Date();
        document.getElementById('date-from').value = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        document.getElementById('date-to').value = now.toISOString().split('T')[0];
        loadPurchaseHistory();
    });
</script>
</body>
</html>

```

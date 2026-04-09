---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/order-details-html-md-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 381
size: 14238 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, documentation, markdown, project/narad]
---

# order-details-html-md-md-md-md.md

> Authentication / authorization module (381 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/order-details-html-md-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 381 |
| **Size** | 14238 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/order-details-html-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 343
size: 13479 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad]
---

# order-details-html-md-md-md.md

> Authentication / authorization module (343 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/order-details-html-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 343 |
| **Size** | 13479 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/order-details-html-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 305
size: 12729 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad]
---

# order-details-html-md-md.md

> Authentication / authorization module (305 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/order-details-html-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 305 |
| **Size** | 12729 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/order-details-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 267
size: 11988 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad]
---

# order-details-html-md.md

> Authentication / authorization module (267 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/order-details-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 267 |
| **Size** | 11988 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/order-details-html.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 229
size: 11256 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, documentation, markdown, project/narad]
---

# order-details-html.md

> Authentication / authorization module (229 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/order-details-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 229 |
| **Size** | 11256 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/order-details.html"
project: "kanak"
role: auth
language: html
frameworks: []
lines: 191
size: 10582 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [auth, code, html, project/kanak]
---

# order-details.html

> Authentication / authorization module (191 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/order-details.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 191 |
| **Size** | 10582 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice Details | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #121212; --panel: #1E1E1E; --text: #E0E0E0; --danger: #ff4757; }
        body { background-color: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
        .nav-header { background-color: #000; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--gold); position: sticky; top: 0; z-index: 100; }
        .nav-btn { background: #333; color: #fff; border: 1px solid #555; padding: 8px 15px; border-radius: 8px; text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; cursor: pointer; }
        .box { max-width: 900px; margin: 40px auto; background: var(--panel); padding: 40px; border-radius: 12px; border: 1px solid #333; }
        .inv-header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 25px; }
        th { text-align: left; color: var(--gold); border-bottom: 2px solid #444; padding: 12px; font-size: 0.75rem; text-transform: uppercase; }
        td { padding: 15px 12px; border-bottom: 1px solid #222; font-size: 0.9rem; }
        .summary-box { margin-left: auto; width: 320px; margin-top: 30px; border-top: 1px solid #444; padding-top: 15px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .btn-gold { width: 100%; background: var(--gold); color: #000; padding: 15px; border: none; font-weight: bold; cursor: pointer; border-radius: 6px; margin-top: 30px; font-size: 1rem; transition: 0.2s; }
        .btn-gold:hover { background: #fff; }
        .status-msg { text-align: center; padding: 60px; color: #666; }
        .retry-btn { background: var(--gold); color: black; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 20px; }
    </style>
</head>
<body>

<div class="nav-header">
    <a href="/orders" class="nav-btn"><i class="fas fa-arrow-left"></i> Back to Reports</a>
    <span style="color:var(--gold); font-weight:bold; letter-spacing: 1px;">TAX INVOICE DETAIL</span>
    <a href="/dashboard" class="nav-btn"><i class="fas fa-home"></i> Home</a>
</div>

<div class="box" id="inv-box">
    <div class="status-msg"><i class="fas fa-spinner fa-spin"></i> Synchronizing Historical Invoice...</div>
</div>

<script>
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    let oData = null, pData = null;

    /**
     * 🛡️ load: Pulls historical invoice data via the Shield Worker
     */
    async function load() {
        try {
            // 1. Handshake Guard: Wait for window.DB
            if (typeof DB === 'undefined') { 
                setTimeout(load, 300); 
                return; 
            }

            if (!id) return window.location.href = '/orders';

            // 2. Auth Guard: Verify session
            const { data: { session }, error: authErr } = await DB.auth.getSession();
            if (authErr || !session) return window.location.href = '/login';

            // 3. Shielded Deep Fetch
            // This query joins orders -> order_items -> products via the Shield Proxy
            const { data: ord, error: fetchErr } = await DB.from('orders')
                .select(`*, order_items(quantity, price_at_purchase, making_charge, products(name))`)
                .eq('id', id)
                .single();

            if (fetchErr) throw fetchErr;
            oData = ord;

            // 4. Fetch Merchant Profile for Header
            const { data: prof, error: profErr } = await DB.from('profiles')
                .select('*')
                .eq('id', ord.user_id)
                .single();
            
            pData = prof;

            // 5. Render UI
            const itemsHtml = ord.order_items.map(i => {
                const metalVal = parseFloat(i.quantity || 0) * parseFloat(i.price_at_purchase || 0);
                const making = parseFloat(i.making_charge) || 0;
                const taxable = metalVal + making;
                return `
                    <tr>
                        <td><strong>${i.products?.name || 'Deleted Item'}</strong></td>
                        <td>${parseFloat(i.quantity || 0).toFixed(3)}g</td>
                        <td>₹${Number(i.price_at_purchase || 0).toLocaleString('en-IN')}</td>
                        <td>₹${making.toLocaleString('en-IN')}</td>
                        <td><strong>₹${taxable.toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong></td>
                    </tr>
                `;
            }).join('');

            const subtotal = parseFloat(ord.total_amount || 0) - parseFloat(ord.tax_amount || 0);

            document.getElementById('inv-box').innerHTML = `
                <div class="inv-header">
                    <div>
                        <h1 style="color:var(--gold); margin:0;">${(prof?.shop_name || "GOLD SHOP").toUpperCase()}</h1>
                        <p style="color:#888; font-size: 0.8rem; margin: 5px 0;">${prof?.full_address || 'Authorized Jewelry Merchant'}</p>
                        <p style="color:#888; font-size: 0.8rem; margin: 0;">GSTIN: ${prof?.gstin || '---'}</p>
                    </div>
                    <div style="text-align:right">
                        <h3 style="margin:0;">INVOICE #${ord.id.slice(0,8).toUpperCase()}</h3>
                        <p style="color:#888; margin: 5px 0;">${new Date(ord.created_at).toLocaleDateString('en-IN')}</p>
                        <span style="background:#2ecc71; color:#000; padding:2px 10px; border-radius:10px; font-size:0.6rem; font-weight:bold;">${ord.status.toUpperCase()}</span>
                    </div>
                </div>
                <table>
                    <thead><tr><th>Description</th><th>Weight</th><th>Rate</th><th>Labour</th><th>Taxable</th></tr></thead>
                    <tbody>${itemsHtml}</tbody>
                </table>
                <div class="summary-box">
                    <div class="summary-row"><span>Total Taxable</span><span>₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits:2})}</span></div>
                    <div class="summary-row" style="color:#888;"><span>GST (3%)</span><span>₹${Number(ord.tax_amount || 0).toLocaleString('en-IN', {minimumFractionDigits:2})}</span></div>
                    <div class="summary-row" style="font-size:1.3rem; color:var(--gold); font-weight:bold; border-top:1px solid #444; padding-top:10px;">
                        <span>Grand Total</span><span>₹${Number(ord.total_amount || 0).toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
                    </div>
                </div>
                <button class="btn-gold" onclick="generatePDF()"><i class="fas fa-file-pdf"></i> Preview & Print Tax PDF</button>
            `;

        } catch (err) {
            console.error("🚨 Invoice Sync Failed:", err);
            // Targeted Error UI for NetworkError
            document.getElementById('inv-box').innerHTML = `
                <div class="status-msg">
                    <div style="color:var(--danger); font-weight:bold;">Shield Verification Failed</div>
                    <div style="font-size:0.8rem; margin-top:10px;">${err.message || 'Connection to the Gold Vault was blocked.'}</div>
                    <button class="retry-btn" onclick="location.reload()">Retry Sync</button>
                </div>`;
        }
    }

    /**
     * 📄 generatePDF: Creates high-resolution Tax Invoice
     */
    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22); doc.setTextColor(212,175,55);
        doc.text(pData?.shop_name?.toUpperCase() || "TAX INVOICE", 105, 20, {align:"center"});
        
        doc.setFontSize(10); doc.setTextColor(100);
        doc.text(`Invoice #${oData.id.slice(0,8).toUpperCase()} | Date: ${new Date(oData.created_at).toLocaleDateString('en-IN')}`, 105, 28, {align:"center"});

        // Table Generation
        const rows = oData.order_items.map(i => [
            i.products?.name || 'Unknown Item', 
            parseFloat(i.quantity || 0).toFixed(3) + 'g', 
            '₹' + Number(i.price_at_purchase || 0).toLocaleString('en-IN'), 
            '₹' + (parseFloat(i.making_charge) || 0).toLocaleString('en-IN'),
            '₹' + (parseFloat(i.quantity || 0) * parseFloat(i.price_at_purchase || 0) + (parseFloat(i.making_charge) || 0)).toFixed(2)
        ]);

        doc.autoTable({ 
            startY: 40, 
            head: [['Item Description', 'Weight', 'Rate', 'Labour', 'Taxable Amt']], 
            body: rows,
            headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0] },
            theme: 'grid',
            styles: { fontSize: 9 }
        });

        // Totals
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10); doc.setTextColor(0);
        doc.text(`Taxable Value: ₹${(parseFloat(oData.total_amount || 0) - parseFloat(oData.tax_amount || 0)).toLocaleString('en-IN', {minimumFractionDigits:2})}`, 140, finalY);
        doc.text(`GST (3%): ₹${Number(oData.tax_amount || 0).toLocaleString('en-IN', {minimumFractionDigits:2})}`, 140, finalY + 7);
        
        doc.setFontSize(14); doc.setFont(undefined, 'bold');
        doc.setTextColor(212, 175, 55);
        doc.text(`Grand Total: ₹${Number(oData.total_amount || 0).toLocaleString('en-IN', {minimumFractionDigits:2})}`, 140, finalY + 16);

        // Open blob for browser print dialogue
        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank');
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

```

```

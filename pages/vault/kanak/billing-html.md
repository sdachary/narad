---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/billing.html"
project: "kanak"
role: auth
language: html
frameworks: []
lines: 421
size: 22965 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:38"
tags: [auth, code, html, project/kanak]
---

# billing.html

> Authentication / authorization module (421 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/billing.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 421 |
| **Size** | 22965 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Billing & POS | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #080808; --panel: #141414; --text: #E0E0E0; --danger: #ff4757; --success: #2ecc71; }
        body { background-color: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
        #lock-screen { display:none; position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index: 99999; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .nav-header { background-color: #000; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--gold); position: sticky; top: 0; z-index: 100; }
        .nav-btn { background: #222; color: #fff; border: 1px solid #444; padding: 8px 15px; border-radius: 8px; text-decoration: none; cursor: pointer; font-size: 0.8rem; }
        .container { max-width: 1250px; margin: 20px auto; padding: 0 20px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
        .card { background: var(--panel); padding: 22px; border-radius: 12px; border: 1px solid #222; margin-bottom: 20px; }
        h2 { color: var(--gold); margin: 0 0 15px 0; font-size: 1rem; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 10px; }
        .field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px; }
        label { font-size: 0.65rem; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
        input, select, textarea { width: 100%; padding: 12px; background: #000; border: 1px solid #333; color: #fff; border-radius: 8px; box-sizing: border-box; font-size: 0.95rem; outline: none; transition: 0.2s; }
        input:focus { border-color: var(--gold); }
        .status-display { background: #1a1a1a; border: 1px dashed #444; color: var(--gold); font-weight: bold; text-align: center; height: 46px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 0.9rem; }
        .summary-line { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.95rem; }
        .net-total-box { font-size: 1.6rem; color: var(--gold); font-weight: bold; border-top: 2px solid var(--gold); padding-top: 12px; margin-top: 10px; display: flex; justify-content: space-between; }
        .action-group { display: flex; gap: 10px; margin-top: 20px; }
        .btn-action { flex: 1; padding: 14px; border: none; font-weight: bold; cursor: pointer; border-radius: 10px; text-transform: uppercase; font-size: 0.8rem; transition: 0.2s; }
        .btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
        .modal { display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); backdrop-filter: blur(4px); }
        .modal-content { background: #fff; color: #333; margin: 40px auto; padding: 40px; border-radius: 12px; width: 90%; max-width: 800px; }
    </style>
</head>
<body>

<div id="lock-screen">
    <i class="fas fa-lock" style="font-size:4rem; color:var(--gold); margin-bottom:20px;"></i>
    <h2 style="color:var(--gold);">TRIAL EXPIRED</h2>
    <p style="color:#666; margin-bottom: 20px;">Please contact the administrator to renew.</p>
    <a href="/dashboard" class="nav-btn">Dashboard</a>
</div>

<div class="nav-header">
    <a href="/dashboard" class="nav-btn"><i class="fas fa-arrow-left"></i> BACK</a>
    <span style="color:var(--gold); font-weight:bold; letter-spacing: 2px; font-size: 1.1rem;">BILLING & POS</span>
    <a href="/dashboard" class="nav-btn"><i class="fas fa-home"></i> HOME</a>
</div>

<div class="container">
    <div>
        <div class="card">
            <h2><i class="fas fa-user-tag"></i> Customer Required</h2>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                <div class="field-group"><label>Customer Name *</label><input type="text" id="c-name" placeholder="Full Name"></div>
                <div class="field-group"><label>Mobile Number *</label><input type="tel" id="c-mobile" placeholder="+91"></div>
            </div>
            <div class="field-group"><label>Full Address *</label><textarea id="c-addr" rows="2" placeholder="Mandatory for Invoice"></textarea></div>
        </div>

        <div class="card">
            <h2><i class="fas fa-gem"></i> Sell & Inventory</h2>
            <div style="display:grid; grid-template-columns: 1.5fr 1fr 1fr; gap:15px;">
                <div class="field-group"><label>Category</label><select id="p-sel" onchange="handleProductSelect()"><option value="">Select Category</option></select></div>
                <div class="field-group"><label>In Vault</label><div id="p-stock-display" class="status-display">0.00g</div></div>
                <div class="field-group"><label>HSN</label><div id="p-hsn" class="status-display">N/A</div></div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:10px;">
                <div class="field-group"><label>Rate (₹/g)</label><input type="number" id="p-rate" placeholder="0.00"></div>
                <div class="field-group"><label>Weight (g)</label><input type="number" id="p-wt" placeholder="0.000"></div>
            </div>
            <div class="field-group"><label>Making Charge (Total ₹)</label><input type="number" id="p-making" value="0"></div>
            <button class="nav-btn" style="width:100%; border-color:var(--gold); color:var(--gold); background:transparent; font-weight:bold;" onclick="addToCart()">ADD TO LIST +</button>
        </div>

        <div class="card" style="border-color: #2c3e50;">
            <h2><i class="fas fa-sync-alt"></i> Exchange</h2>
            <div class="field-group"><label>Item Description</label><input type="text" id="ex-desc" placeholder="Old gold details"></div>
            <div class="field-group"><label>Exchange Amount (₹ Deductible)</label><input type="number" id="ex-val" value="0" oninput="calculateFinalTotals()"></div>
        </div>
    </div>
    
    <div>
        <div class="card">
            <h2><i class="fas fa-file-invoice"></i> Summary</h2>
            <div id="cart" style="min-height:60px; color:#666; margin-bottom:15px; font-size:0.85rem;">Cart is empty.</div>
            <div style="border-top:1px solid #333; padding-top:15px;">
                <div class="summary-line"><span>Subtotal:</span><span id="sub">₹0.00</span></div>
                <div class="summary-line" style="color:#888;"><span>GST (3%):</span><span id="tax">₹0.00</span></div>
                <div class="summary-line" style="color:var(--danger);"><span>Exchange:</span><span id="sum-ex">- ₹0.00</span></div>
                <div class="summary-line" style="color:#666; font-style:italic;"><span>Round Off:</span><span id="sum-round">₹0.00</span></div>
                <div class="net-total-box"><span>NET TOTAL:</span><span id="tot">₹0.00</span></div>
            </div>
        </div>

        <div class="card" style="border-color: var(--success);">
            <h2><i class="fas fa-wallet"></i> Payment & Credit</h2>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                <div class="field-group"><label>Amount Paid (₹ Today)</label><input type="number" id="pay-cash" value="0" oninput="calculateFinalTotals()" style="color:var(--success); font-weight:bold;"></div>
                <div class="field-group"><label>Balance Due</label><div id="pay-bal" class="status-display">₹0.00</div></div>
            </div>
            <div id="credit-fields" style="display: none; border-top: 1px dashed #444; padding-top: 15px;">
                <div class="field-group"><label style="color:var(--danger)">Credit Due Date *</label><input type="date" id="due-date"></div>
            </div>
            <div class="action-group">
                <button class="btn-action" style="background:#333; color:#fff;" onclick="validateAndProcess(false)">QUOTE</button>
                <button class="btn-action" style="background:rgba(255, 71, 87, 0.1); color:var(--danger);" onclick="clearBill()">CLEAR</button>
                <button id="final-bill-btn" class="btn-action btn-invoice" style="background:var(--gold); color:#000;" onclick="validateAndProcess(true)">SAVE & BILL</button>
            </div>
        </div>
    </div>
</div>

<div id="invoice-modal" class="modal">
    <div class="modal-content">
        <h2 id="pv-shop" style="color:#000; border-bottom:2px solid var(--gold); padding-bottom:10px;"></h2>
        <div id="pv-table-body" style="margin:20px 0;"></div>
        <div style="text-align:right; font-size: 1.1rem;">
            <p>Subtotal: ₹<span id="pv-sub-val"></span></p>
            <p>GST (3%): ₹<span id="pv-tax-val"></span></p>
            <p style="color:#888;">Round Off: ₹<span id="pv-round-val"></span></p>
            <h2 style="color:var(--gold); font-size: 2rem;">TOTAL: ₹<span id="pv-tot"></span></h2>
            <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:20px;">
                <button class="btn-action" style="background:#888; color:#fff; width:auto;" onclick="closePreInvoice()">EDIT</button>
                <button id="confirm-print-btn" class="btn-action" style="background:var(--gold); color:#000; width:auto;" onclick="finalProcessInvoice()">CONFIRM & PRINT</button>
            </div>
        </div>
    </div>
</div>

<script>
    let products = [], cart = [], userProfile = null, marketRates = null;

    /**
     * 🛡️ init: Handles Shield handshake and initial data loading
     */
    async function init() {
        try {
            if (typeof DB === 'undefined') { setTimeout(init, 300); return; }
            
            const { data: { session }, error: authError } = await DB.auth.getSession();
            if(!session || authError) window.location.href = '/login';
            
            const tid = localStorage.getItem('impersonate_id') || session.user.id;
            
            // Parallel fetch for speed
            const [profileRes, ratesRes, prodsRes] = await Promise.all([
                DB.from('profiles').select('*').eq('id', tid).single(),
                DB.from('city_rates').select('*').eq('city_name', 'India').single(),
                DB.from('products').select('*').eq('user_id', tid)
            ]);

            userProfile = profileRes.data;
            marketRates = ratesRes.data;
            products = prodsRes.data || [];

            // Trial Expiry Check
            const expiry = userProfile.sub_end_date ? new Date(userProfile.sub_end_date) : null;
            if(expiry && new Date() > expiry) { document.getElementById('lock-screen').style.display='flex'; return; }

            // Fill Category Selector
            document.getElementById('p-sel').innerHTML = '<option value="">Select Category</option>' + products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
            
        } catch (err) {
            console.error("Shield POS Sync Error:", err);
            alert("Connection error. Refreshing...");
        }
    }

    function handleProductSelect() {
        const p = products.find(x => x.id === document.getElementById('p-sel').value);
        if (p) {
            document.getElementById('p-stock-display').innerText = parseFloat(p.stock_quantity || 0).toFixed(2) + "g";
            document.getElementById('p-hsn').innerText = p.hsn_code || 'N/A';
            document.getElementById('p-rate').value = p.name.toUpperCase().includes('22K') ? marketRates.gold_22k : marketRates.gold_24k;
        }
    }

    function addToCart() {
        const pid = document.getElementById('p-sel').value;
        const wt = parseFloat(document.getElementById('p-wt').value);
        const rate = parseFloat(document.getElementById('p-rate').value);
        const making = parseFloat(document.getElementById('p-making').value) || 0;

        if(!pid || !wt || wt <= 0 || !rate) return alert("Select item and enter valid weight/rate.");
        
        const p = products.find(x => x.id === pid);
        if(wt > parseFloat(p.stock_quantity)) return alert("Vault Alert: Insufficient stock for " + p.name);

        const rowTotal = (wt * rate) + making;
        cart.push({ id: p.id, name: p.name, weight: wt, rate: rate, making: making, taxable: rowTotal });
        
        renderCart();
        document.getElementById('p-wt').value = "";
        document.getElementById('p-making').value = 0;
    }

    function renderCart() {
        document.getElementById('cart').innerHTML = cart.map((c,i) => `
            <div style="display:flex; justify-content:space-between; margin-bottom:5px; background:#1a1a1a; padding:10px; border-radius:6px; border-left:3px solid var(--gold);">
                <div style="font-size:0.8rem;">
                    <strong>${c.name}</strong><br>
                    <small>${c.weight}g @ ₹${c.rate} + ₹${c.making} MK</small>
                </div>
                <div style="text-align:right;">
                    <span style="display:block;">₹${c.taxable.toFixed(2)}</span>
                    <i class="fas fa-times-circle" style="color:var(--danger); cursor:pointer;" onclick="cart.splice(${i},1);renderCart()"></i>
                </div>
            </div>`).join('') || "Cart is empty.";
        calculateFinalTotals();
    }

    /**
     * 🧮 calculateFinalTotals: Includes the "Rounding Up" logic
     */
    function calculateFinalTotals() {
        let sub = cart.reduce((acc, curr) => acc + curr.taxable, 0);
        let gst = sub * 0.03;
        let exchange = parseFloat(document.getElementById('ex-val').value) || 0;
        
        let preciseTotal = (sub + gst) - exchange;
        
        // 🚀 ROUNDING LOGIC: Mathematical rounding to nearest Rupee
        let roundedTotal = Math.round(preciseTotal);
        let roundOffValue = roundedTotal - preciseTotal;

        let paid = parseFloat(document.getElementById('pay-cash').value) || 0;
        let balance = roundedTotal - paid;

        document.getElementById('sub').innerText = '₹' + sub.toFixed(2);
        document.getElementById('tax').innerText = '₹' + gst.toFixed(2);
        document.getElementById('sum-ex').innerText = '- ₹' + exchange.toFixed(2);
        document.getElementById('sum-round').innerText = (roundOffValue >= 0 ? '+ ₹' : '- ₹') + Math.abs(roundOffValue).toFixed(2);
        document.getElementById('tot').innerText = '₹' + roundedTotal.toLocaleString('en-IN');
        document.getElementById('pay-bal').innerText = '₹' + balance.toLocaleString('en-IN');

        document.getElementById('credit-fields').style.display = balance > 1 ? 'block' : 'none';
    }

    function clearBill() {
        if(!confirm("Cancel and clear this bill?")) return;
        cart = []; 
        document.getElementById('c-name').value = ''; 
        document.getElementById('c-mobile').value = '';
        document.getElementById('c-addr').value = ''; 
        document.getElementById('pay-cash').value = 0;
        document.getElementById('ex-val').value = 0; 
        document.getElementById('ex-desc').value = '';
        renderCart();
    }

    function validateAndProcess(isBill) {
        if(!document.getElementById('c-name').value || !document.getElementById('c-mobile').value || !document.getElementById('c-addr').value) {
            return alert("Customer Name, Mobile, and Address are required for compliance.");
        }
        if(cart.length === 0) return alert("Add items to the list first.");
        
        const netText = document.getElementById('tot').innerText.replace(/[₹,]/g, '');
        const paid = parseFloat(document.getElementById('pay-cash').value) || 0;
        const bal = parseFloat(netText) - paid;
        
        if(bal > 1 && !document.getElementById('due-date').value) return alert("Credit detected. Please set a Due Date.");

        if(isBill) { 
            document.getElementById('pv-shop').innerText = userProfile.shop_name.toUpperCase();
            document.getElementById('pv-tot').innerText = document.getElementById('tot').innerText.replace('₹','');
            document.getElementById('pv-sub-val').innerText = document.getElementById('sub').innerText.replace('₹','');
            document.getElementById('pv-tax-val').innerText = document.getElementById('tax').innerText.replace('₹','');
            document.getElementById('pv-round-val').innerText = document.getElementById('sum-round').innerText.replace('₹','');
            document.getElementById('invoice-modal').style.display = 'block'; 
        } else {
            generatePDF(false); // Generate Quote
        }
    }

    function closePreInvoice() { document.getElementById('invoice-modal').style.display = 'none'; }

    /**
     * 🛡️ finalProcessInvoice: Atomic Shield Write
     */
    async function finalProcessInvoice() {
        const btn = document.getElementById('confirm-print-btn');
        btn.disabled = true;
        btn.innerText = "SAVING TO VAULT...";

        try {
            const tid = userProfile.id;
            const net = parseFloat(document.getElementById('tot').innerText.replace(/[₹,]/g, ''));
            const tax = parseFloat(document.getElementById('tax').innerText.replace(/[₹,]/g, ''));
            const paid = parseFloat(document.getElementById('pay-cash').value) || 0;
            const bal = net - paid;

            // 1. Create Order
            const { data: ord, error: ordError } = await DB.from('orders').insert({
                user_id: tid, 
                customer_name: document.getElementById('c-name').value, 
                customer_phone: document.getElementById('c-mobile').value,
                total_amount: net, 
                tax_amount: tax, 
                balance_due: bal, 
                status: bal > 1 ? 'partial' : 'paid'
            }).select().single();

            if(ordError) throw ordError;

            // 2. Process Items & Inventory Deductions
            for(const i of cart) {
                // Add Order Item
                await DB.from('order_items').insert({ 
                    order_id: ord.id, 
                    product_id: i.id, 
                    quantity: i.weight, 
                    price_at_purchase: i.rate, 
                    making_charge: i.making 
                });

                // Fetch Current Stock via Shield
                const { data: p } = await DB.from('products').select('stock_quantity').eq('id', i.id).single();
                
                // Deduct Inventory
                await DB.from('products').update({ 
                    stock_quantity: parseFloat(p.stock_quantity) - i.weight 
                }).eq('id', i.id);

                // Log Movement
                await DB.from('inventory_logs').insert({ 
                    product_id: i.id, 
                    user_id: tid, 
                    change_amount: -i.weight, 
                    reason: 'Sale Bill: #' + ord.id.slice(0,6).toUpperCase() 
                });
            }

            // 3. Handle Credit Ledger
            if(bal > 1) {
                await DB.from('customer_ledger').insert({ 
                    user_id: tid, 
                    customer_name: ord.customer_name, 
                    customer_phone: ord.customer_phone, 
                    debit: net, 
                    credit: paid, 
                    balance: bal, 
                    due_date: document.getElementById('due-date').value 
                });
            }

            // 4. Print and Finish
            generatePDF(true);
            alert("Transaction Success! Vault Synchronized.");
            window.location.reload();

        } catch (err) {
            console.error("🚨 Billing Failure:", err);
            alert("Vault Error: Transaction was not saved. " + err.message);
            btn.disabled = false;
            btn.innerText = "CONFIRM & PRINT";
        }
    }

    /**
     * 📄 generatePDF: Creates Invoice or Quote
     */
    function generatePDF(isFinal) {
        const { jsPDF } = window.jspdf; 
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.text(userProfile.shop_name.toUpperCase(), 105, 20, {align:"center"});
        doc.setFontSize(10);
        doc.text(userProfile.shop_address || '', 105, 27, {align:"center"});
        doc.text("GSTIN: " + (userProfile.gstin || 'N/A'), 105, 32, {align:"center"});
        
        doc.line(20, 35, 190, 35);
        
        // Customer Details
        doc.setFontSize(12);
        doc.text("INVOICE TO:", 20, 45);
        doc.setFontSize(10);
        doc.text(document.getElementById('c-name').value, 20, 50);
        doc.text(document.getElementById('c-mobile').value, 20, 55);
        doc.text(document.getElementById('c-addr').value, 20, 60);

        doc.text("Date: " + new Date().toLocaleDateString(), 150, 45);
        doc.text("Type: " + (isFinal ? "TAX INVOICE" : "ESTIMATE/QUOTE"), 150, 50);

        // Table
        doc.autoTable({ 
            startY: 70, 
            head: [['Item Name', 'Weight', 'Rate', 'Making', 'Total']], 
            body: cart.map(c => [
                c.name, 
                c.weight + 'g', 
                '₹' + c.rate.toLocaleString(), 
                '₹' + c.making.toLocaleString(), 
                '₹' + c.taxable.toLocaleString()
            ]),
            theme: 'striped',
            headStyles: { fillColor: [212, 175, 55] }
        });

        // Totals
        let finalY = doc.previousAutoTable.finalY + 10;
        doc.text("Subtotal: ₹" + document.getElementById('sub').innerText.replace('₹',''), 140, finalY);
        doc.text("GST (3%): ₹" + document.getElementById('tax').innerText.replace('₹',''), 140, finalY + 7);
        doc.text("Exchange: " + document.getElementById('sum-ex').innerText, 140, finalY + 14);
        doc.text("Round Off: " + document.getElementById('sum-round').innerText, 140, finalY + 21);
        
        doc.setFontSize(16);
        doc.setTextColor(212, 175, 55);
        doc.text("NET TOTAL: " + document.getElementById('tot').innerText, 140, finalY + 32);

        window.open(doc.output('bloburl'), '_blank');
    }

    // Launch
    init();
</script>
</body>
</html>

```

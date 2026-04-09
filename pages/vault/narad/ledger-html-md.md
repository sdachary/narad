---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/ledger-html.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 263
size: 11685 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad]
---

# ledger-html.md

> Authentication / authorization module (263 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/ledger-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 263 |
| **Size** | 11685 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/ledger.html"
project: "kanak"
role: auth
language: html
frameworks: []
lines: 225
size: 11032 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:38"
tags: [auth, code, html, project/kanak]
---

# ledger.html

> Authentication / authorization module (225 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/ledger.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 225 |
| **Size** | 11032 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Customer Ledger | Gold SaaS</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>
    <script src="auth-check.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --gold: #D4AF37; --dark: #080808; --panel: #141414; --text: #E0E0E0; --danger: #ff4757; --success: #2ecc71; }
        body { background-color: var(--dark); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
        
        .nav-header { background-color: #000; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--gold); position: sticky; top: 0; z-index: 100; }
        .nav-btn { background: #222; color: #fff; border: 1px solid #444; padding: 8px 15px; border-radius: 8px; text-decoration: none; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; }
        
        .container { max-width: 1100px; margin: 30px auto; padding: 0 20px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: var(--panel); padding: 20px; border-radius: 12px; border: 1px solid #222; text-align: center; }
        .stat-card h3 { margin: 0; color: #888; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; }
        .stat-card p { margin: 10px 0 0; font-size: 1.5rem; font-weight: bold; color: var(--gold); }
        
        table { width: 100%; border-collapse: collapse; background: var(--panel); border-radius: 12px; overflow: hidden; border: 1px solid #222; }
        th { background: #000; color: var(--gold); text-align: left; padding: 15px; font-size: 0.75rem; text-transform: uppercase; border-bottom: 2px solid #222; }
        td { padding: 15px; border-bottom: 1px solid #1a1a1a; font-size: 0.85rem; }
        
        .overdue { color: var(--danger); font-weight: bold; }
        .upcoming { color: var(--gold); }
        .btn-whatsapp { background: #25D366; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
        
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); backdrop-filter: blur(5px); }
        .modal-content { background: #111; margin: 10% auto; padding: 30px; border-radius: 16px; border: 1px solid var(--gold); width: 350px; }
        input { width: 100%; padding: 12px; background: #000; border: 1px solid #333; color: #fff; border-radius: 8px; margin: 15px 0; font-size: 1rem; box-sizing: border-box; }
        .btn-save { background: var(--gold); color: #000; border: none; padding: 14px; width: 100%; border-radius: 10px; font-weight: bold; cursor: pointer; }
    </style>
</head>
<body>

<div class="nav-header">
    <a href="/dashboard" class="nav-btn"><i class="fas fa-arrow-left"></i> Dashboard</a>
    <span style="color:var(--gold); font-weight:bold; letter-spacing: 2px;">CREDIT LEDGER & RECOVERY</span>
    <div style="width:80px"></div>
</div>

<div class="container">
    <div class="stats-grid">
        <div class="stat-card"><h3>Active Debtors</h3><p id="stat-count">0</p></div>
        <div class="stat-card"><h3>Recovery Value</h3><p id="stat-due" style="color:var(--danger)">₹0</p></div>
        <div class="stat-card"><h3>Due Within 7 Days</h3><p id="stat-near">0</p></div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Customer & Date</th>
                <th>Total Bill</th>
                <th>Remaining</th>
                <th>Payment Due Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="ledger-body">
            <tr><td colspan="5" style="text-align:center; padding:60px; color:#666;">Synchronizing Ledger...</td></tr>
        </tbody>
    </table>
</div>

<div id="pay-modal" class="modal">
    <div class="modal-content">
        <h3 style="color:var(--gold); margin-top:0;">Record Recovery</h3>
        <p id="modal-cust" style="font-weight:bold; margin-bottom:5px;"></p>
        <p style="font-size:0.8rem; color:#888;">Current Balance: <span id="modal-bal" style="color:var(--danger)"></span></p>
        
        <label style="font-size:0.7rem; color:#666;">CASH RECEIVED (₹)</label>
        <input type="number" id="pay-amt" placeholder="Enter Amount">
        
        <button class="btn-save" id="save-btn" onclick="processLedgerPayment()">UPDATE LEDGER</button>
        <button class="btn-save" style="background:#222; color:#888; margin-top:10px;" onclick="closeModal()">CANCEL</button>
    </div>
</div>

<script>
    let activeEntry = null;

    /**
     * 🛡️ loadLedger: Pulls customer credit records via the Shield Worker
     */
    async function loadLedger() {
        try {
            // 1. Handshake Guard
            if (typeof DB === 'undefined') { 
                setTimeout(loadLedger, 300); 
                return; 
            }

            // 2. Auth Verification
            const { data: { session }, error: authErr } = await DB.auth.getSession();
            if (authErr || !session) return window.location.href = '/login';

            const tid = localStorage.getItem('impersonate_id') || session.user.id;

            // 3. Fetch Pending Credits
            const { data: entries, error } = await DB.from('customer_ledger')
                .select('*')
                .eq('user_id', tid)
                .eq('status', 'pending')
                .order('due_date', { ascending: true });

            if (error) throw error;

            let totalDue = 0, nearDue = 0;
            const today = new Date();

            const html = entries.map(e => {
                const bal = parseFloat(e.balance || 0);
                totalDue += bal;
                
                const dueDate = new Date(e.due_date);
                const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                if (diffDays <= 7) nearDue++;

                let dateClass = diffDays < 0 ? 'overdue' : (diffDays <= 3 ? 'upcoming' : '');
                let dateText = diffDays < 0 ? `Overdue by ${Math.abs(diffDays)} days` : `Due in ${diffDays} days`;

                const waMsg = `Reminder: Hello ${e.customer_name}, your balance of ₹${bal.toLocaleString('en-IN')} for your purchase is due on ${e.due_date}. Please clear it soon.`;

                return `
                    <tr>
                        <td><strong>${e.customer_name}</strong><br><small style="color:#555">Added: ${new Date(e.created_at).toLocaleDateString()}</small></td>
                        <td>₹${parseFloat(e.debit || 0).toLocaleString('en-IN')}</td>
                        <td style="color:var(--danger); font-weight:bold;">₹${bal.toLocaleString('en-IN')}</td>
                        <td class="${dateClass}">${e.due_date}<br><small>${dateText}</small></td>
                        <td>
                            <div style="display:flex; gap:10px;">
                                <button class="nav-btn" style="background:var(--success); border:none; color:#000;" onclick='openModal(${JSON.stringify(e)})'>
                                    <i class="fas fa-check"></i> Collect
                                </button>
                                <a href="https://wa.me/91${e.customer_phone}?text=${encodeURIComponent(waMsg)}" target="_blank" class="btn-whatsapp">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            document.getElementById('ledger-body').innerHTML = html || '<tr><td colspan="5" style="text-align:center; padding:40px;">No pending credits found.</td></tr>';
            document.getElementById('stat-count').innerText = entries.length;
            document.getElementById('stat-due').innerText = '₹' + totalDue.toLocaleString('en-IN');
            document.getElementById('stat-near').innerText = nearDue;

        } catch (err) {
            console.error("🚨 Ledger Sync Error:", err);
            // Error UI for NetworkErrors
            document.getElementById('ledger-body').innerHTML = `
                <tr><td colspan="5" style="text-align:center; padding:60px;">
                    <div style="color:var(--danger); font-weight:bold;">Sync Failed: ${err.message}</div>
                    <button class="nav-btn" style="margin: 15px auto;" onclick="location.reload()">Retry Ledger Sync</button>
                </td></tr>`;
        }
    }

    function openModal(entry) {
        activeEntry = entry;
        document.getElementById('modal-cust').innerText = entry.customer_name;
        document.getElementById('modal-bal').innerText = '₹' + parseFloat(entry.balance).toLocaleString();
        document.getElementById('pay-modal').style.display = 'block';
    }

    async function processLedgerPayment() {
        const amtInput = document.getElementById('pay-amt');
        const amt = parseFloat(amtInput.value);
        
        if (!amt || amt <= 0 || amt > activeEntry.balance) {
            return alert("Invalid amount. Please check the current balance.");
        }

        const btn = document.getElementById('save-btn');
        btn.disabled = true; 
        btn.innerText = "UPDATING SHIELD...";

        try {
            const newBal = activeEntry.balance - amt;
            
            // 1. Update Ledger via Worker Shield
            const { error } = await DB.from('customer_ledger')
                .update({ 
                    credit: parseFloat(activeEntry.credit || 0) + amt, 
                    balance: newBal,
                    status: newBal <= 1 ? 'cleared' : 'pending' 
                })
                .eq('id', activeEntry.id);

            if (error) throw error;

            // 2. Log Payment to Cash Tally
            await DB.from('payment_logs').insert({
                merchant_id: activeEntry.user_id,
                customer_name: activeEntry.customer_name,
                amount: amt,
                note: 'Credit Recovery'
            });

            alert("Collection Recorded Successfully!");
            closeModal();
            amtInput.value = '';
            loadLedger();
            
        } catch (e) { 
            alert("Update Failed: " + e.message); 
        } finally { 
            btn.disabled = false; 
            btn.innerText = "UPDATE LEDGER"; 
        }
    }

    function closeModal() { document.getElementById('pay-modal').style.display = 'none'; }
    
    // Auto-load on Ready
    document.addEventListener('DOMContentLoaded', loadLedger);
</script>
</body>
</html>

```

```

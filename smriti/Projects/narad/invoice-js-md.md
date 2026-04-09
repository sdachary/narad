---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/chitragupta/invoice-js.md"
project: "narad"
role: service
language: markdown
frameworks: [typescript]
lines: 386
size: 13984 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, service, typescript]
---

# invoice-js.md

> Service / API client module using **typescript** (386 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/chitragupta/invoice-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 386 |
| **Size** | 13984 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/pages/services/invoice.js"
project: "chitragupta"
role: service
language: javascript
frameworks: [typescript]
lines: 346
size: 13129 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [code, javascript, project/chitragupta, service, typescript]
---

# invoice.js

> Service / API client module using **typescript** (346 lines).

**Key exports:** `initInvoicePage`, `renderInvoicePage`, `showCreateInvoiceModal`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/pages/services/invoice.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | typescript |
| **Lines** | 346 |
| **Size** | 13129 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

[[api-ts]]

## 📄 Content

```javascript
import { api } from '../../ts/api.ts';

export function initInvoicePage(app) {
  app.invoices = {
    list: (orgId) => api.get(`/v1/organizations/${orgId}/invoices`),
    get: (orgId, id) => api.get(`/v1/organizations/${orgId}/invoices/${id}`),
    create: (orgId, data) => api.post(`/v1/organizations/${orgId}/invoices`, data),
    getPdf: (orgId, id) => api.get(`/v1/organizations/${orgId}/invoices/${id}/pdf`),
  };
}

export function renderInvoicePage() {
  const container = document.createElement('div');
  container.className = 'view-container';
  container.id = 'view-invoices';
  container.innerHTML = `
    <div class="section-header" style="margin-bottom: 20px;">
      <h3>Invoices</h3>
      <button class="btn btn-primary" id="create-invoice-btn">
        <span class="material-icons-round">add</span> Create Invoice
      </button>
    </div>
    
    <div class="filter-bar glassmorphism" style="margin-bottom: 20px;">
      <input type="text" id="search-invoice" class="glass-input" placeholder="Search invoices..." style="flex:1;">
      <select id="filter-status" class="glass-input">
        <option value="all">All Status</option>
        <option value="draft">Draft</option>
        <option value="sent">Sent</option>
        <option value="paid">Paid</option>
        <option value="overdue">Overdue</option>
      </select>
    </div>

    <div class="invoice-list glassmorphism" id="invoices-list">
      <div class="empty-state">No invoices yet.</div>
    </div>
  `;
  return container;
}

export async function loadInvoices(orgId) {
  const list = document.getElementById('invoices-list');
  if (!list) return;
  
  try {
    const { invoices } = await window.invoices.list(orgId);
    renderInvoiceList(invoices);
  } catch (err) {
    list.innerHTML = `<div class="empty-state">Error loading invoices: ${err.message}</div>`;
  }
}

function renderInvoiceList(invoices) {
  const list = document.getElementById('invoices-list');
  if (!invoices || invoices.length === 0) {
    list.innerHTML = '<div class="empty-state">No invoices yet.</div>';
    return;
  }

  const rows = invoices.map(inv => `
    <div class="invoice-row" data-id="${inv.id}">
      <div class="invoice-main">
        <span class="invoice-number">${inv.invoice_number}</span>
        <span class="invoice-customer">${inv.customer_name}</span>
        <span class="invoice-date">${new Date(inv.created_at).toLocaleDateString()}</span>
      </div>
      <div class="invoice-amount">₹ ${Number(inv.total).toFixed(2)}</div>
      <div class="invoice-status status-${inv.status}">${inv.status}</div>
      <div class="invoice-actions">
        <button class="icon-btn view-invoice" data-id="${inv.id}" title="View">
          <span class="material-icons-round">visibility</span>
        </button>
        <button class="icon-btn download-pdf" data-id="${inv.id}" title="Download PDF">
          <span class="material-icons-round">picture_as_pdf</span>
        </button>
      </div>
    </div>
  `).join('');

  list.innerHTML = `
    <div class="invoice-header-row">
      <span>Invoice #</span>
      <span>Customer</span>
      <span>Date</span>
      <span>Amount</span>
      <span>Status</span>
      <span>Actions</span>
    </div>
    ${rows}
  `;

  list.querySelectorAll('.view-invoice').forEach(btn => {
    btn.addEventListener('click', () => viewInvoice(btn.dataset.id));
  });
  list.querySelectorAll('.download-pdf').forEach(btn => {
    btn.addEventListener('click', () => downloadPdf(btn.dataset.id));
  });
}

async function viewInvoice(id) {
  const orgId = window.currentOrgId;
  try {
    const { invoice } = await window.invoices.get(orgId, id);
    showInvoiceModal(invoice);
  } catch (err) {
    alert('Error loading invoice: ' + err.message);
  }
}

async function downloadPdf(id) {
  const orgId = window.currentOrgId;
  try {
    const { pdfUrl } = await window.invoices.getPdf(orgId, id);
    window.open(pdfUrl, '_blank');
  } catch (err) {
    alert('Error generating PDF: ' + err.message);
  }
}

function showInvoiceModal(invoice) {
  const modalHtml = `
    <div class="modal-overlay" id="modal-invoice-view">
      <div class="modal-content glassmorphism" style="max-width: 600px;">
        <div class="modal-header">
          <h3>Invoice ${invoice.invoice_number}</h3>
          <button class="icon-btn close-modal"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="invoice-preview">
            <div class="invoice-header-info">
              <div>
                <h4>${invoice.business_name || 'Business'}</h4>
                <p>${invoice.customer_name}</p>
                <p>${invoice.customer_email}</p>
              </div>
              <div class="text-right">
                <p><strong>Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</p>
                <p><strong>Due:</strong> ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            
            <table class="data-table" style="margin-top: 20px;">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>₹ ${Number(item.rate).toFixed(2)}</td>
                    <td>₹ ${Number(item.amount).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="invoice-totals">
              <p>Subtotal: ₹ ${Number(invoice.subtotal).toFixed(2)}</p>
              <p>Tax (${invoice.tax_rate}%): ₹ ${Number(invoice.tax_amount).toFixed(2)}</p>
              <p class="total"><strong>Total: ₹ ${Number(invoice.total).toFixed(2)}</strong></p>
            </div>
            
            <div class="invoice-status status-${invoice.status}" style="margin-top: 20px; text-align: center;">
              ${invoice.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  initModalEvents(document.getElementById('modal-invoice-view'));
}

function initModalEvents(modal) {
  if (!modal) return;
  modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

export function showCreateInvoiceModal(transactions = []) {
  const modalHtml = `
    <div class="modal-overlay" id="modal-invoice-create">
      <div class="modal-content glassmorphism" style="max-width: 700px;">
        <div class="modal-header">
          <h3>Create Invoice</h3>
          <button class="icon-btn close-modal"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <form id="form-invoice">
            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label>Customer Name</label>
                <input type="text" id="invoice-customer-name" class="glass-input" required>
              </div>
              <div class="form-group">
                <label>Customer Email</label>
                <input type="email" id="invoice-customer-email" class="glass-input" required>
              </div>
            </div>
            
            <div class="form-group">
              <label>Select Transactions to Invoice</label>
              <div class="transaction-select-list" id="transaction-select-list" style="max-height: 200px; overflow-y: auto;">
                ${transactions.length === 0 ? '<p class="empty-state">No transactions available</p>' : 
                  transactions.map(t => `
                    <label class="checkbox-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid #30363d;">
                      <input type="checkbox" name="txn_ids" value="${t.id}" data-amount="${t.amount}" data-desc="${t.description || t.service?.name || 'Transaction'}">
                      <span>${t.description || t.service?.name || 'Transaction'} - ₹ ${Number(t.amount).toFixed(2)}</span>
                    </label>
                  `).join('')
                }
              </div>
            </div>
            
            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label>Tax Rate (%)</label>
                <input type="number" id="invoice-tax-rate" class="glass-input" value="0" min="0" max="100" step="0.1">
              </div>
              <div class="form-group">
                <label>Due Date</label>
                <input type="date" id="invoice-due-date" class="glass-input">
              </div>
              <div class="form-group">
                <label>Status</label>
                <select id="invoice-status" class="glass-input">
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            
            <div class="invoice-preview-totals" style="margin-top: 16px; padding: 16px; background: rgba(88,166,255,0.1); border-radius: 8px;">
              <p>Subtotal: <span id="invoice-subtotal">₹ 0.00</span></p>
              <p>Tax: <span id="invoice-tax">₹ 0.00</span></p>
              <p><strong>Total: <span id="invoice-total">₹ 0.00</span></strong></p>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Invoice</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  initModalEvents(document.getElementById('modal-invoice-create'));
  
  document.querySelectorAll('input[name="txn_ids"]').forEach(cb => {
    cb.addEventListener('change', calculateInvoiceTotals);
  });
  
  document.getElementById('invoice-tax-rate').addEventListener('input', calculateInvoiceTotals);
  
  document.getElementById('form-invoice').addEventListener('submit', async (e) => {
    e.preventDefault();
    await createInvoice();
  });
}

function calculateInvoiceTotals() {
  const checked = document.querySelectorAll('input[name="txn_ids"]:checked');
  let subtotal = 0;
  checked.forEach(cb => {
    subtotal += Number(cb.dataset.amount) || 0;
  });
  
  const taxRate = Number(document.getElementById('invoice-tax-rate')?.value) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  
  document.getElementById('invoice-subtotal').textContent = '₹ ' + subtotal.toFixed(2);
  document.getElementById('invoice-tax').textContent = '₹ ' + taxAmount.toFixed(2);
  document.getElementById('invoice-total').textContent = '₹ ' + total.toFixed(2);
}

async function createInvoice() {
  const orgId = window.currentOrgId;
  const customerName = document.getElementById('invoice-customer-name').value;
  const customerEmail = document.getElementById('invoice-customer-email').value;
  const taxRate = Number(document.getElementById('invoice-tax-rate').value) || 0;
  const dueDate = document.getElementById('invoice-due-date').value;
  const status = document.getElementById('invoice-status').value;
  
  const checked = document.querySelectorAll('input[name="txn_ids"]:checked');
  const transactionIds = Array.from(checked).map(cb => cb.value);
  
  if (transactionIds.length === 0) {
    alert('Please select at least one transaction');
    return;
  }
  
  const items = Array.from(checked).map(cb => ({
    description: cb.dataset.desc,
    quantity: 1,
    rate: Number(cb.dataset.amount),
    amount: Number(cb.dataset.amount)
  }));
  
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  
  try {
    await window.invoices.create(orgId, {
      transaction_ids: transactionIds,
      customer_name: customerName,
      customer_email: customerEmail,
      items,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      status,
      due_date: dueDate || null
    });
    
    document.getElementById('modal-invoice-create')?.remove();
    alert('Invoice created successfully!');
    if (window.loadInvoices) window.loadInvoices(orgId);
  } catch (err) {
    alert('Error creating invoice: ' + err.message);
  }
}

export default {
  initInvoicePage,
  renderInvoicePage,
  loadInvoices,
  showCreateInvoiceModal
};

```

```

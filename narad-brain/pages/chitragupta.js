// Chitragupta Finance Dashboard

function initApiBase() {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  let apiBase = '';
  
  // Default to localhost if on file protocol or localhost
  if (protocol === 'file:' || hostname.includes('localhost') || hostname === '127.0.0.1') {
    apiBase = 'http://localhost:8788';
  } else if (hostname.includes('pages.dev')) {
    apiBase = 'https://narad-7hc.pages.dev';
  } else if (hostname.includes('narad.io')) {
    apiBase = 'https://narad.io';
  }
  
  const metaApiBase = document.querySelector('meta[name="api-base"]');
  if (metaApiBase) metaApiBase.setAttribute('content', apiBase);
  
  return apiBase;
}

const API_BASE = initApiBase();
let csrfToken = null;

// CSRF Token Manager (Matches main Narad app)
const CSRFManager = {
  async init() {
    const tokenEl = document.querySelector('meta[name="csrf-token"]');
    if (tokenEl && tokenEl.getAttribute('content')) {
      csrfToken = tokenEl.getAttribute('content');
      return;
    }
    await this.fetchNewToken();
  },
  
  async fetchNewToken() {
    try {
      const response = await fetch(`${API_BASE}/api/csrf-token`);
      if (response.ok) {
        const data = await response.json();
        csrfToken = data.token;
        const tokenEl = document.querySelector('meta[name="csrf-token"]');
        if (tokenEl) tokenEl.setAttribute('content', csrfToken);
      }
    } catch (e) {
      console.warn('Failed to fetch CSRF token:', e);
      csrfToken = 'client_fallback_' + Date.now();
    }
  }
};

let sessionId = localStorage.getItem('narad_session_id') || 'session_' + Date.now();
localStorage.setItem('narad_session_id', sessionId);

// ============================================
// CLOUD VM METRICS
// ============================================
const cloudVMMetrics = {
    vmId: 'oci-instance-001',
    name: 'Narad Production Server',
    provider: 'Oracle Cloud',
    ipAddress: '140.245.227.176',
    region: 'Mumbai (ap-mumbai-1)',
    cpu: { current: 2.4, total: 4 },
    memory: { current: 3.2, total: 8 },
    storage: { current: 45, total: 150 },
    bandwidth: { uptime: '99.8%', status: 'healthy' },
    costPerMonth: 2800
};

async function fetchCloudVMMetrics() {
    try {
        const response = await fetch(`${API_BASE}/api/cloud/vm-metrics`, {
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        updateCloudVMCard(data);
    } catch (error) {
        console.warn('CloudVM metrics fetch failed, using defaults', error);
        updateCloudVMCard(cloudVMMetrics);
    }
}

function updateCloudVMCard(metrics) {
    const commoditiesList = document.getElementById('commodities-list');
    if (!commoditiesList) return;
    
    commoditiesList.innerHTML = `
        <div class="vm-item">
            <span class="vm-label">CPU Usage</span>
            <span class="vm-value">${metrics.cpu.current.toFixed(1)}/${metrics.cpu.total} cores</span>
        </div>
        <div class="vm-item">
            <span class="vm-label">Memory</span>
            <span class="vm-value">${metrics.memory.current.toFixed(1)}/${metrics.memory.total} GB</span>
        </div>
        <div class="vm-item">
            <span class="vm-label">Storage</span>
            <span class="vm-value">${metrics.storage.current}/${metrics.storage.total} GB</span>
        </div>
        <div class="vm-item">
            <span class="vm-label">Uptime</span>
            <span class="vm-value">${metrics.bandwidth.uptime}</span>
        </div>
        <div class="vm-item">
            <span class="vm-label">Monthly Cost</span>
            <span class="vm-value">₹${metrics.costPerMonth.toLocaleString('en-IN')}</span>
        </div>
    `;
}

// ============================================
// HOLDINGS DATA & TABLE RENDERING
// ============================================
const holdingsDataModel = {
    stocks: [
        {
            id: 'stock_001',
            ticker: 'RELIANCE',
            name: 'Reliance Industries',
            qty: 10,
            buyPrice: 2450.00,
            currentPrice: 2680.50,
            change: 9.42,
            allocation: 15.2
        },
        {
            id: 'stock_002',
            ticker: 'INFY',
            name: 'Infosys',
            qty: 5,
            buyPrice: 1800.00,
            currentPrice: 1950.75,
            change: 8.38,
            allocation: 10.5
        }
    ]
};

async function fetchHoldingsData() {
    try {
        const response = await fetch(`${API_BASE}/api/portfolio/holdings`, {
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('Holdings fetch failed', error);
        return holdingsDataModel;
    }
}

function renderHoldingsTable(holdings) {
    const container = document.getElementById('holdings-full');
    if (!container || !holdings || !holdings.stocks) return;
    
    const totalInvested = holdings.stocks.reduce((sum, s) => sum + (s.qty * s.buyPrice), 0);
    const totalCurrent = holdings.stocks.reduce((sum, s) => sum + (s.qty * s.currentPrice), 0);
    const totalPnL = totalCurrent - totalInvested;
    
    // Update summary
    document.getElementById('total-invested').textContent = 
        `₹${totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    document.getElementById('total-current').textContent = 
        `₹${totalCurrent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    document.getElementById('total-pnl').textContent = 
        `₹${totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    
    const tableHTML = `
        <table class="holdings-table">
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Buy Price</th>
                    <th>Current</th>
                    <th>Change %</th>
                    <th>P&L</th>
                    <th>Allocation</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${holdings.stocks.map(stock => {
                    const currentValue = stock.qty * stock.currentPrice;
                    const investedValue = stock.qty * stock.buyPrice;
                    const pnl = currentValue - investedValue;
                    
                    return `
                        <tr class="holding-row ${pnl >= 0 ? 'gain' : 'loss'}">
                            <td class="ticker">${stock.ticker}</td>
                            <td>${stock.name}</td>
                            <td>${stock.qty}</td>
                            <td>₹${stock.buyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                            <td>₹${stock.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                            <td class="change">${stock.change >= 0 ? '↑' : '↓'} ${Math.abs(stock.change).toFixed(2)}%</td>
                            <td class="pnl">${pnl >= 0 ? '✓' : ''} ₹${Math.abs(pnl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                            <td>${stock.allocation.toFixed(1)}%</td>
                            <td>
                                <button class="btn-small" onclick="editHolding('${stock.id}')">Edit</button>
                                <button class="btn-small danger" onclick="deleteHolding('${stock.id}')">Del</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function editHolding(holdingId) {
    console.log('Edit holding:', holdingId);
    // TODO: Implement edit modal
}

function deleteHolding(holdingId) {
    if (confirm('Delete this holding?')) {
        console.log('Delete holding:', holdingId);
        // TODO: API call
    }
}

// ============================================
// DIVIDEND TRACKING
// ============================================
const dividendDataModel = {
    target: 100000,
    nextPaymentDate: '2026-04-15',
    records: [
        {
            id: 'div_001',
            ticker: 'RELIANCE',
            exDate: '2026-02-28',
            paymentDate: '2026-03-15',
            amount: 45,
            qty: 10,
            totalReceived: 450,
            yield: 1.63
        },
        {
            id: 'div_002',
            ticker: 'INFY',
            exDate: '2026-02-15',
            paymentDate: '2026-03-01',
            amount: 32,
            qty: 5,
            totalReceived: 160,
            yield: 1.78
        }
    ]
};

async function fetchDividendData() {
    try {
        const response = await fetch(`${API_BASE}/api/portfolio/dividends`, {
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('Dividend fetch failed', error);
        return dividendDataModel;
    }
}

function renderDividendPortfolio(dividends) {
    const container = document.getElementById('dividends-table');
    if (!container) return;
    
    const totalDividends = dividends.records.reduce((sum, d) => sum + d.totalReceived, 0);
    const avgYield = (dividends.records.reduce((sum, d) => sum + d.yield, 0) / dividends.records.length).toFixed(2);
    
    document.getElementById('div-target').textContent = 
        `₹${dividends.target.toLocaleString('en-IN')}`;
    document.getElementById('div-collected').textContent = 
        `₹${totalDividends.toLocaleString('en-IN')}`;
    document.getElementById('div-remaining').textContent = 
        `₹${(dividends.target - totalDividends).toLocaleString('en-IN')}`;
    document.getElementById('div-yield').textContent = 
        `${avgYield}%`;
    
    const tableHTML = `
        <table class="dividends-table">
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Ex-Date</th>
                    <th>Payment Date</th>
                    <th>Per Share</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Yield %</th>
                </tr>
            </thead>
            <tbody>
                ${dividends.records.map(div => `
                    <tr>
                        <td class="ticker">${div.ticker}</td>
                        <td>${new Date(div.exDate).toLocaleDateString('en-IN')}</td>
                        <td>${new Date(div.paymentDate).toLocaleDateString('en-IN')}</td>
                        <td>₹${div.amount.toFixed(2)}</td>
                        <td>${div.qty}</td>
                        <td class="total">₹${div.totalReceived.toLocaleString('en-IN')}</td>
                        <td class="yield">${div.yield.toFixed(2)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

// ============================================
// RECURRING BILLS & EXPENSES
// ============================================
const recurringDataModel = {
    bills: [
        {
            id: 'bill_001',
            name: 'Electricity Bill',
            amount: 2500,
            dueDate: '2026-04-10',
            frequency: 'monthly',
            lastPaid: '2026-03-10',
            status: 'pending'
        },
        {
            id: 'bill_002',
            name: 'Internet Plan',
            amount: 1299,
            dueDate: '2026-04-01',
            frequency: 'monthly',
            lastPaid: '2026-03-01',
            status: 'paid'
        },
        {
            id: 'bill_003',
            name: 'Phone Bill',
            amount: 599,
            dueDate: '2026-04-05',
            frequency: 'monthly',
            lastPaid: '2026-03-05',
            status: 'pending'
        }
    ]
};

async function fetchRecurringBills() {
    try {
        const response = await fetch(`${API_BASE}/api/expenses/recurring`, {
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('Recurring bills fetch failed', error);
        return recurringDataModel;
    }
}

function renderRecurringBills(billData) {
    const container = document.getElementById('recurring-bills-list');
    if (!container) return;
    
    const today = new Date();
    const billsHTML = billData.bills.map(bill => {
        const dueDate = new Date(bill.dueDate);
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const isOverdue = daysUntilDue < 0;
        const isUrgent = daysUntilDue >= 0 && daysUntilDue <= 3;
        
        return `
            <div class="bill-item ${isOverdue ? 'overdue' : ''} ${isUrgent ? 'urgent' : ''} ${bill.status === 'paid' ? 'paid' : 'pending'}">
                <div class="bill-info">
                    <h4>${bill.name}</h4>
                    <p class="bill-meta">
                        Due: ${dueDate.toLocaleDateString('en-IN')}
                        ${daysUntilDue >= 0 ? `(in ${daysUntilDue} days)` : `(${Math.abs(daysUntilDue)} days overdue)`}
                    </p>
                </div>
                <div class="bill-amount">
                    <span class="amount">₹${bill.amount.toLocaleString('en-IN')}</span>
                    <span class="status-badge ${bill.status}">${bill.status.toUpperCase()}</span>
                </div>
                <div class="bill-actions">
                    <button class="btn-small" onclick="markBillPaid('${bill.id}')">Mark Paid</button>
                    <button class="btn-small" onclick="editBill('${bill.id}')">Edit</button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = billsHTML || '<div class="empty-state">No recurring bills</div>';
}

function markBillPaid(billId) {
    console.log('Mark bill paid:', billId);
    // TODO: API call
}

function editBill(billId) {
    console.log('Edit bill:', billId);
    // TODO: Show modal
}

function showRecurringBillForm() {
    // TODO: Implement modal for adding new recurring bill
    alert('Add recurring bill form would be implemented here');
}

// ============================================
// DATA PERSISTENCE & MIGRATION
// ============================================

const STORAGE_KEYS = {
    HOLDINGS: 'chitragupta_holdings',
    DIVIDENDS: 'chitragupta_dividends',
    BILLS: 'chitragupta_bills',
    SETTINGS: 'chitragupta_settings'
};

function initializeLocalStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.HOLDINGS)) {
        localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(holdingsDataModel));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DIVIDENDS)) {
        localStorage.setItem(STORAGE_KEYS.DIVIDENDS, JSON.stringify(dividendDataModel));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BILLS)) {
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(recurringDataModel));
    }
    console.log('✅ Local storage initialized');
}

function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`✅ Saved ${key}`);
}

// ============================================
// PDF & DATA EXPORT
// ============================================

function exportFinancialData() {
    const format = prompt('Export as JSON or CSV?', 'JSON').toUpperCase();
    
    if (format === 'JSON') {
        const data = {
            exportDate: new Date().toISOString(),
            dashboard: {
                netWorth: document.getElementById('net-worth').textContent,
                bankBalance: document.getElementById('bank-balance').textContent,
                investments: document.getElementById('investment-value').textContent,
            },
            holdings: holdingsDataModel.stocks,
            dividends: dividendDataModel.records,
            bills: recurringDataModel.bills
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadFile(blob, `chitragupta-export-${new Date().getTime()}.json`);
    } else if (format === 'CSV') {
        let csv = 'Chitragupta Financial Export\n' + new Date().toISOString() + '\n\n';
        csv += 'Holdings\nTicker,Qty,BuyPrice,CurrentPrice,Change%\n';
        holdingsDataModel.stocks.forEach(s => {
            csv += `${s.ticker},${s.qty},${s.buyPrice},${s.currentPrice},${s.change}\n`;
        });
        
        csv += '\n\nDividends\nTicker,Ex-Date,Payment Date,Amount,Yield%\n';
        dividendDataModel.records.forEach(d => {
            csv += `${d.ticker},${d.exDate},${d.paymentDate},${d.amount},${d.yield}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        downloadFile(blob, `chitragupta-export-${new Date().getTime()}.csv`);
    }
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// NAVIGATION
// ============================================

const navToggle = document.getElementById('nav-toggle');
const chitraguptaNav = document.getElementById('chitragupta-nav');
const navTabs = document.querySelectorAll('.nav-tab');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    chitraguptaNav.classList.toggle('open');
  });
}

navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    switchTab(tabName);
  });
});

function switchTab(tabName) {
  navTabs.forEach(t => t.classList.remove('active'));
  document.querySelector(`.nav-tab[data-tab="${tabName}"]`)?.classList.add('active');

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(`tab-${tabName}`)?.classList.add('active');

  chitraguptaNav.classList.remove('open');

  // Load data for specific tabs when they become active
  if (tabName === 'expenses') {
    loadExpenseTracking();
  } else if (tabName === 'insights') {
    loadFinancialInsights();
  } else if (tabName === 'settings') {
    loadSettings();
  }
}

// ============================================
// EXPENSE TRACKING logic
// ============================================

async function loadExpenseTracking() {
  const container = document.getElementById('expense-details');
  if (!container) return;

  const data = await fetchApi('/api/finance/expenses');
  if (!data || !data.expenses) {
    container.innerHTML = '<div class="empty-state">Failed to load expenses</div>';
    return;
  }

  const expenses = data.expenses;
  updateExpenseSummary(expenses);
  renderExpenseList(expenses);
  renderExpenseCategoryChart(expenses);
}

function updateExpenseSummary(expenses) {
  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const amountEl = document.querySelector('.expense-amount');
  if (amountEl) amountEl.textContent = formatCurrency(total);
}

function renderExpenseList(expenses) {
  const listEl = document.getElementById('expense-details');
  if (!listEl) return;

  if (expenses.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No expenses recorded yet</div>';
    return;
  }

  const html = `
    <div class="expense-list-table">
      <div class="table-header">
        <span>Date</span>
        <span>Category</span>
        <span>Description</span>
        <span>Amount</span>
        <span>Action</span>
      </div>
      ${expenses.map(e => `
        <div class="table-row">
          <span class="date">${new Date(e.date).toLocaleDateString()}</span>
          <span class="category"><span class="cat-pill">${e.category}</span></span>
          <span class="desc">${e.description || '-'}</span>
          <span class="amount">${formatCurrency(e.amount)}</span>
          <span class="action"><button onclick="deleteExpense(${e.id})" class="delete-btn">🗑️</button></span>
        </div>
      `).join('')}
    </div>
  `;
  listEl.innerHTML = html;
}

function showExpenseForm() {
  const modal = document.createElement('div');
  modal.className = 'glass-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Add New Expense</h3>
      <form id="add-expense-form">
        <div class="form-group">
          <label>Category</label>
          <select id="exp-category" required>
            <option value="Housing">Housing</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Amount</label>
          <input type="number" id="exp-amount" placeholder="0.00" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <input type="text" id="exp-desc" placeholder="What was this for?">
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="exp-date" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-cancel" onclick="this.closest('.glass-modal').remove()">Cancel</button>
          <button type="submit" class="btn-save">Save Expense</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('add-expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      category: document.getElementById('exp-category').value,
      amount: parseFloat(document.getElementById('exp-amount').value),
      description: document.getElementById('exp-desc').value,
      date: new Date(document.getElementById('exp-date').value).getTime()
    };

    const res = await fetch(`${API_BASE}/api/finance/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      modal.remove();
      loadExpenseTracking();
      refreshDashboard();
    }
  });
}

async function deleteExpense(id) {
  if (!confirm('Are you sure you want to delete this expense?')) return;
  const res = await fetch(`${API_BASE}/api/finance/expenses/${id}`, { method: 'DELETE' });
  if (res.ok) {
    loadExpenseTracking();
    refreshDashboard();
  }
}

function renderExpenseCategoryChart(expenses) {
  // Simple CSS-based visualization logic would go here
  // For now, we utilize the categories in the list
}

// ============================================
// SETTINGS logic
// ============================================

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('chitragupta_settings') || '{}');
  
  // Apply settings to form
  if (settings.bill_notifications !== undefined) document.getElementById('bill-notifications').checked = settings.bill_notifications;
  if (settings.low_balance_alerts !== undefined) document.getElementById('low-balance-alerts').checked = settings.low_balance_alerts;
  if (settings.currency) document.getElementById('currency-select').value = settings.currency;
  if (settings.date_format) document.getElementById('date-format').value = settings.date_format;
  
  // Add listeners for auto-save
  const inputs = ['bill-notifications', 'low-balance-alerts', 'currency-select', 'date-format'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => saveSettings());
    }
  });
}

function saveSettings() {
  const settings = {
    bill_notifications: document.getElementById('bill-notifications').checked,
    low_balance_alerts: document.getElementById('low-balance-alerts').checked,
    currency: document.getElementById('currency-select').value,
    date_format: document.getElementById('date-format').value
  };
  localStorage.setItem('chitragupta_settings', JSON.stringify(settings));
  
  // Sync to cloud if available
  fetch(`${API_BASE}/api/finance/settings`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId
    },
    body: JSON.stringify(settings)
  }).catch(e => console.warn('Cloud sync failed', e));
}

function exportFinancialData() {
  const data = {
    expenses: [], // would fetch all
    settings: JSON.parse(localStorage.getItem('chitragupta_settings') || '{}'),
    timestamp: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chitragupta_data_${Date.now()}.json`;
  a.click();
}

// ============================================
// INSIGHTS logic
// ============================================

async function loadFinancialInsights() {
  const endpoints = ['portfolio', 'budget', 'suggestions'];
  const containers = {
    portfolio: 'portfolio-insight',
    budget: 'cashflow-insight',
    suggestions: 'risk-insight'
  };

  for (const type of endpoints) {
    const el = document.getElementById(containers[type]);
    if (!el) continue;
    
    el.innerHTML = '<div class="loading-pulse">Analyzing data...</div>';
    
    const res = await fetchApi(`/api/finance/analysis/${type}`);
    if (res && res.insights) {
      renderInsights(el, res.insights);
    } else {
      el.innerHTML = '<div class="empty-state">No insights available</div>';
    }
  }
}

function renderInsights(container, insights) {
  // If insights is a string (sometimes LLM returns raw string), parse it
  let data = insights;
  if (typeof insights === 'string') {
    try { data = JSON.parse(insights).insights; } catch(e) {}
  }
  
  if (!Array.isArray(data)) {
    container.innerHTML = `<div class="insight-text">${typeof data === 'string' ? data : 'Analysis complete.'}</div>`;
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="insight-item">
      <h4>${item.title}</h4>
      <p>${item.content}</p>
      ${item.action ? `<button class="insight-action-btn">${item.action}</button>` : ''}
    </div>
  `).join('');
}

// ============================================
// API FUNCTIONS
// ============================================

async function fetchApi(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`API Error: ${endpoint}`, e);
    return null;
  }
}

async function loadDashboard() {
  const statusEl = document.getElementById('api-status');
  const dotEl = document.getElementById('api-dot');
  
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (res.ok) {
      statusEl.textContent = 'Connected';
      dotEl.classList.add('connected');
    }
  } catch (e) {
    statusEl.textContent = 'Offline';
  }
  
  // Update holdings with live prices from NSE
  await fetchApi('/api/finance/prices/update');
  
  // Load dashboard summary
  const summary = await fetchApi('/api/finance/dashboard/summary');
  if (summary) {
    updateDashboardCards(summary);
  }
  
  // Load holdings
  const holdings = await fetchApi('/api/finance/holdings');
  if (holdings && holdings.holdings) {
    updateHoldingsDisplay(holdings.holdings);
  }
  
  // Load dividends
  const dividends = await fetchApi('/api/finance/dividends');
  if (dividends && dividends.dividends) {
    updateDividendsDisplay(dividends.dividends);
  }
  
  // Load recurring
  const recurring = await fetchApi('/api/finance/recurring');
  if (recurring && recurring.recurrings) {
    updateRecurringDisplay(recurring.recurrings);
  }
  
  // Load holdings summary
  const holdingsSummary = await fetchApi('/api/finance/holdings/summary');
  if (holdingsSummary) {
    document.getElementById('total-invested').textContent = formatCurrency(holdingsSummary.totalInvested);
    document.getElementById('total-current').textContent = formatCurrency(holdingsSummary.totalCurrent);
    document.getElementById('total-pnl').textContent = formatCurrency(holdingsSummary.totalPnl);
    document.getElementById('total-pnl').classList.add(holdingsSummary.totalPnl >= 0 ? 'gain' : 'loss');
  }
  
  // Load dividend summary
  const divSummary = await fetchApi('/api/finance/dividends/summary');
  if (divSummary) {
    document.getElementById('div-target').textContent = formatCurrency(divSummary.targetMonthly);
    document.getElementById('div-actual').textContent = formatCurrency(divSummary.actualMonthly);
    document.getElementById('div-extra').textContent = formatCurrency(divSummary.extra);
  }
}

function updateDashboardCards(data) {
  document.getElementById('net-worth').textContent = formatCurrency(data.netWorth);
  document.getElementById('bank-balance').textContent = formatCurrency(data.bankBalance);
  document.getElementById('investment-value').textContent = formatCurrency(data.investmentValue);
  document.getElementById('monthly-payout').textContent = formatCurrency(data.monthlyPayout);
  document.getElementById('upcoming-bills').textContent = formatCurrency(data.upcomingBills);

  // Holdings Overview (Pie Chart)
  if (data.holdings && data.holdings.length > 0) {
    updateHoldingsOverview(data.holdings);
  } else {
    document.getElementById('holdings-pie-chart').innerHTML = '<div class="empty-state">No holdings data</div>';
  }

  // Top Gainers/Losers
  if (data.holdings && data.holdings.length > 0) {
    updateTopGainersLosers(data.holdings);
  } else {
    document.getElementById('top-gainers-losers').innerHTML = '<div class="empty-state">No data</div>';
  }

  // Commodities
  if (data.commodities && data.commodities.length > 0) {
    const commoditiesHtml = data.commodities.map(c => `
      <div class="commodity-item">
        <span class="commodity-name">${c.name}</span>
        <span class="commodity-price">${formatCurrency(c.price)}</span>
        <span class="commodity-change ${c.change >= 0 ? 'gain' : 'loss'}">${c.change >= 0 ? '+' : ''}${c.change_percent?.toFixed(2)}%</span>
      </div>
    `).join('');
    document.getElementById('commodities-list').innerHTML = commoditiesHtml;
  }
}

function updateHoldingsDisplay(holdings) {
  // Top 5 for dashboard
  const top5 = holdings.slice(0, 5);
  const topHtml = top5.map(h => `
    <div class="holding-row">
      <div class="holding-symbol">${h.symbol}</div>
      <div class="holding-qty">${h.quantity} qty</div>
      <div class="holding-value">${formatCurrency(h.current_value)}</div>
      <div class="holding-pnl ${h.pnl >= 0 ? 'gain' : 'loss'}">${h.pnl >= 0 ? '+' : ''}${h.net_chg_percent?.toFixed(2)}%</div>
    </div>
  `).join('');
  
  document.getElementById('top-holdings').innerHTML = topHtml || '<div class="empty-state">No holdings</div>';
  
  // Full table
  const fullHtml = holdings.map(h => `
    <div class="holding-row-full">
      <div class="holding-cell symbol">${h.symbol}</div>
      <div class="holding-cell qty">${h.quantity}</div>
      <div class="holding-cell price">${formatCurrency(h.avg_cost)}</div>
      <div class="holding-cell ltp">${formatCurrency(h.ltp)}</div>
      <div class="holding-cell invested">${formatCurrency(h.invested)}</div>
      <div class="holding-cell current">${formatCurrency(h.current_value)}</div>
      <div class="holding-cell pnl ${h.pnl >= 0 ? 'gain' : 'loss'}">${formatCurrency(h.pnl)}</div>
      <div class="holding-cell pct ${h.net_chg_percent >= 0 ? 'gain' : 'loss'}">${h.net_chg_percent >= 0 ? '+' : ''}${h.net_chg_percent?.toFixed(2)}%</div>
    </div>
  `).join('');
  
  document.getElementById('holdings-full').innerHTML = fullHtml || '<div class="empty-state">No holdings</div>';
}

// Holdings Overview (Pie Chart)
function updateHoldingsOverview(holdings) {
  const pieChartEl = document.getElementById('holdings-pie-chart');
  if (!pieChartEl) return;

  // Calculate total value for percentages
  const totalValue = holdings.reduce((sum, h) => sum + (h.current_value || 0), 0);

  if (totalValue === 0) {
    pieChartEl.innerHTML = '<div class="empty-state">No holdings data</div>';
    return;
  }

  // Sort by value descending and take top 6
  const sortedHoldings = [...holdings]
    .sort((a, b) => (b.current_value || 0) - (a.current_value || 0))
    .slice(0, 6);

  // Create pie chart using CSS/conic-gradient (simplified representation)
  let html = '<div class="pie-chart-container">';

  let startAngle = 0;
  sortedHoldings.forEach((holding, index) => {
    const value = holding.current_value || 0;
    const percentage = (value / totalValue) * 100;
    const sliceAngle = (percentage / 100) * 360;

    html += `
      <div class="pie-slice" style="--start-angle: ${startAngle}deg; --slice-angle: ${sliceAngle}deg;">
        <div class="slice-label">
          <span class="symbol">${holding.symbol}</span>
          <span class="percentage">${percentage.toFixed(0)}%</span>
        </div>
      </div>
    `;

    startAngle += sliceAngle;
  });

  // Add remaining as "Others" if there are more than 6 holdings
  if (holdings.length > 6) {
    const othersValue = holdings.slice(6).reduce((sum, h) => sum + (h.current_value || 0), 0);
    const othersPercentage = (othersValue / totalValue) * 100;

    html += `
      <div class="pie-slice" style="--start-angle: ${startAngle}deg; --slice-angle: ${(othersPercentage / 100) * 360}deg;">
        <div class="slice-label">
          <span class="symbol">Others</span>
          <span class="percentage">${othersPercentage.toFixed(0)}%</span>
        </div>
      </div>
    `;
  }

  html += '</div>';

  // Add legend
  html += '<div class="pie-chart-legend">';
  sortedHoldings.forEach((holding, index) => {
    const value = holding.current_value || 0;
    const percentage = (value / totalValue) * 100;
    html += `
      <div class="legend-item">
        <div class="legend-color" style="background: var(--finance-accent);"></div>
        <span>${holding.symbol}: ${formatCurrency(value)} (${percentage.toFixed(1)}%)</span>
      </div>
    `;
  });
  if (holdings.length > 6) {
    const othersValue = holdings.slice(6).reduce((sum, h) => sum + (h.current_value || 0), 0);
    const othersPercentage = (othersValue / totalValue) * 100;
    html += `
      <div class="legend-item">
        <div class="legend-color" style="background: var(--finance-secondary);"></div>
        <span>Others: ${formatCurrency(othersValue)} (${othersPercentage.toFixed(1)}%)</span>
      </div>
    `;
  }
  html += '</div>';

  pieChartEl.innerHTML = html;
}

// Top Gainers/Losers
function updateTopGainersLosers(holdings) {
  const container = document.getElementById('top-gainers-losers');
  if (!container) return;

  // Sort by net_chg_percent for gainers and losers
  const sortedByChange = [...holdings]
    .filter(h => h.net_chg_percent !== null && h.net_chg_percent !== undefined)
    .sort((a, b) => b.net_chg_percent - a.net_chg_percent);

  const topGainers = sortedByChange.slice(0, 3);
  const topLosers = sortedByChange.slice(-3).reverse();

  let html = '<div class="gainers-losers-grid">';

  // Gainers section
  html += `
    <div class="section">
      <h4>Top Gainers</h4>
      <div class="list">
        ${topGainers.length > 0 ? topGainers.map(h => `
          <div class="item gain">
            <span class="symbol">${h.symbol}</span>
            <span class="change">+${h.net_chg_percent?.toFixed(2)}%</span>
          </div>
        `).join('') : '<div class="empty-state">No gainers</div>'}
      </div>
    </div>
  `;

  // Losers section
  html += `
    <div class="section">
      <h4>Top Losers</h4>
      <div class="list">
        ${topLosers.length > 0 ? topLosers.map(h => `
          <div class="item loss">
            <span class="symbol">${h.symbol}</span>
            <span class="change">${h.net_chg_percent?.toFixed(2)}%</span>
          </div>
        `).join('') : '<div class="empty-state">No losers</div>'}
      </div>
    </div>
  `;

  html += '</div>';

  container.innerHTML = html;
}

function updateDividendsDisplay(dividends) {
  // Dashboard list
  const listHtml = dividends.map(d => `
    <div class="dividend-row">
      <div class="dividend-symbol">${d.symbol}</div>
      <div class="dividend-allocation">${((d.allocation || 0) * 100).toFixed(0)}%</div>
      <div class="dividend-sip">${formatCurrency(d.monthly_sip)}</div>
      <div class="dividend-actual">${formatCurrency(d.actual_sip)}</div>
    </div>
  `).join('');
  
  document.getElementById('dividend-list').innerHTML = listHtml || '<div class="empty-state">No dividends</div>';
  
  // Full table
  const fullHtml = dividends.map(d => `
    <div class="dividend-row-full">
      <div class="dividend-cell symbol">${d.symbol}</div>
      <div class="dividend-cell name">${d.name}</div>
      <div class="dividend-cell ltp">${formatCurrency(d.ltp)}</div>
      <div class="dividend-cell allocation">${((d.allocation || 0) * 100).toFixed(0)}%</div>
      <div class="dividend-cell monthly">${formatCurrency(d.monthly_sip)}</div>
      <div class="dividend-cell qty">${d.quantity}</div>
      <div class="dividend-cell actual">${formatCurrency(d.actual_sip)}</div>
    </div>
  `).join('');
  
  document.getElementById('dividends-full').innerHTML = fullHtml || '<div class="empty-state">No dividends</div>';
}

function updateRecurringDisplay(recurrings) {
  const categories = {};
  recurrings.forEach(r => {
    if (!categories[r.category]) categories[r.category] = [];
    categories[r.category].push(r);
  });
  
  let html = '';
  for (const [cat, items] of Object.entries(categories)) {
    html += `<div class="recurring-category"><h4>${getCategoryIcon(cat)} ${cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>`;
    html += items.map(r => `
      <div class="recurring-item">
        <div class="recurring-name">${r.name}</div>
        <div class="recurring-amount">${formatCurrency(r.amount)}</div>
        <div class="recurring-freq">${r.frequency}</div>
      </div>
    `).join('');
    html += '</div>';
  }
  
  document.getElementById('recurring-cards').innerHTML = html || '<div class="empty-state">No recurring items</div>';
}

function getCategoryIcon(category) {
  const icons = {
    bill: '📄',
    insurance: '🛡️',
    goal: '🎯',
    safety: '🔒',
    gold: '🥇',
    loan: '💳',
    investment: '📈'
  };
  return icons[category] || '📌';
}

// ============================================
// CHAT FUNCTIONS
// ============================================

// Global state for chat
let chatHistory = [];

window.toggleChatOverlay = function() {
  const overlay = document.getElementById('chat-overlay');
  if (overlay) {
    overlay.classList.toggle('open');
    console.log('💬 Chat overlay toggled:', overlay.classList.contains('open') ? 'opened' : 'closed');
  } else {
    console.warn('❌ Chat overlay element (#chat-overlay) not found!');
  }
};

function setupChatOverlay() {
  const floatingBtn = document.getElementById('floating-chat-btn');
  const closeBtn = document.getElementById('close-chat-overlay');
  const form = document.getElementById('chat-form-overlay');
  
  if (floatingBtn) {
    // Remove old listeners to avoid duplicates
    floatingBtn.replaceWith(floatingBtn.cloneNode(true));
    document.getElementById('floating-chat-btn').addEventListener('click', window.toggleChatOverlay);
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', window.toggleChatOverlay);
  }
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('user-input-overlay');
      if (!input) return;
      
      const message = input.value.trim();
      if (!message) return;
      
      addChatMessage(message, 'user');
      input.value = '';
      
      await sendChatMessage(message);
    });
  }
  
  console.log('✅ Chat listeners initialized');
}

// Initial Call
setupChatOverlay();

function addChatMessage(text, type) {
  const chatMessages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerHTML = `
    <div class="avatar">${type === 'user' ? '∼' : '⚡'}</div>
    <div class="message-content">${escapeHtml(text)}</div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage(message) {
  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        message,
        history: chatHistory,
        session_id: sessionId,
        agent_type: 'analyst'
      })
    });
    
    if (!response.ok) throw new Error('Chat failed');
    
    const data = await response.json();
    if (data.reply) {
      chatHistory.push({ role: 'user', text: message });
      chatHistory.push({ role: 'assistant', text: data.reply });
      addChatMessage(data.reply, 'assistant');
    }
  } catch (e) {
    addChatMessage('Sorry, I encountered an error. Please try again.', 'assistant');
  }
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// UTILITIES
// ============================================

function formatCurrency(amount) {
  if (amount == null) return '₹0';
  const num = parseFloat(amount);
  if (num >= 10000000) {
    return '₹' + (num / 10000000).toFixed(2) + 'Cr';
  } else if (num >= 100000) {
    return '₹' + (num / 100000).toFixed(2) + 'L';
  } else if (num >= 1000) {
    return '₹' + (num / 1000).toFixed(1) + 'K';
  }
  return '₹' + num.toFixed(2);
}

function refreshDashboard() {
  loadDashboard();
}

// Auto-refresh prices every 5 minutes
setInterval(async () => {
  await fetchApi('/api/finance/prices/update');
  const holdings = await fetchApi('/api/finance/holdings');
  if (holdings && holdings.holdings) {
    updateHoldingsDisplay(holdings.holdings);
  }
}, 5 * 60 * 1000);

// ============================================
// INITIALIZE
// ============================================

// Initialize local storage and load data
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Chitragupta Dashboard Initializing...');
    
    // 1. Critical UI Setup (No awaits)
    initializeLocalStorage();
    setupTheme();
    setupChatOverlay(); 

    // 2. Security Setup
    try {
        await CSRFManager.init();
    } catch (e) {
        console.warn('⚠️ Security token fetch failed. Chat may be restricted.', e);
    }
    
    // 3. Data Fetching (Wrapped in try-catch)
    try {
        console.log('📦 Fetching financial records...');
        const [holdings, dividends, bills] = await Promise.all([
            fetchHoldingsData().catch(() => null),
            fetchDividendData().catch(() => null),
            fetchRecurringBills().catch(() => null)
        ]);
        
        await fetchCloudVMMetrics().catch(() => null);

        // Render components only if data is returned
        if (holdings) renderHoldingsTable(holdings);
        if (dividends) renderDividendPortfolio(dividends);
        if (bills) renderRecurringBills(bills);
        
        // Also load the regular dashboard data
        loadDashboard();
        
        console.log('✅ Dashboard components loaded');
    } catch (e) {
        console.error('❌ Data load error:', e);
        updateApiStatus('offline');
    }
});

if (document.readyState !== 'loading') {
    // For cases where DOMContentLoaded already fired
    initializeLocalStorage();
    loadDashboard();
}

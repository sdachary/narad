---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/pages/services/budgets.js"
project: "chitragupta"
role: auth
language: javascript
frameworks: [typescript, vite]
lines: 507
size: 20417 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [auth, code, javascript, project/chitragupta, typescript, vite]
---

# budgets.js

> Authentication / authorization module using **typescript, vite** (507 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/pages/services/budgets.js` |
| **Role** | auth |
| **Language** | javascript |
| **Frameworks** | typescript, vite |
| **Lines** | 507 |
| **Size** | 20417 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Budgets - Chitragupta</title>
  <link rel="stylesheet" href="/src/css/styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
</head>
<body>
  <div class="app-container">
    <nav class="sidebar">
      <div class="brand">
        <span class="material-icons-round brand-icon">receipt_long</span>
        <h1>Chitragupta</h1>
      </div>
      <div class="nav-links">
        <a href="/index.html" class="nav-item" data-target="dashboard">
          <span class="material-icons-round">dashboard</span> Dashboard
        </a>
        <a href="/index.html" class="nav-item" data-target="transactions">
          <span class="material-icons-round">list_alt</span> All Transactions
        </a>
        <a href="/index.html" class="nav-item" data-target="partners">
          <span class="material-icons-round">group</span> Partners & Split
        </a>
        <a href="#" class="nav-item active" data-target="budgets">
          <span class="material-icons-round">account_balance_wallet</span> Budgets
        </a>
        <a href="/index.html" class="nav-item" data-target="reports">
          <span class="material-icons-round">assessment</span> Reports
        </a>
        <a href="/index.html" class="nav-item" data-target="settings">
          <span class="material-icons-round">settings</span> Settings
        </a>
      </div>
      <div class="user-profile">
        <div class="user-info">
          <span class="user-name" id="profile-name">Loading...</span>
          <span class="user-role" id="profile-role">Partner</span>
        </div>
        <button class="logout-btn" id="logout-btn" title="Logout">
          <span class="material-icons-round">logout</span>
        </button>
      </div>
    </nav>

    <main class="main-content">
      <header class="top-header">
        <h2 id="page-title">Budgets</h2>
        <button class="btn btn-primary" id="new-budget-btn">
          <span class="material-icons-round">add</span> New Budget
        </button>
      </header>

      <div id="budget-alerts-container"></div>

      <div class="view-container active" id="view-budgets">
        <div class="stats-grid">
          <div class="stat-card glassmorphism">
            <div class="stat-header">
              <span class="stat-title">Active Budgets</span>
              <span class="material-icons-round stat-icon blue">folder</span>
            </div>
            <div class="stat-value" id="active-budgets-count">0</div>
            <div class="stat-subtitle">Currently tracking</div>
          </div>
          <div class="stat-card glassmorphism">
            <div class="stat-header">
              <span class="stat-title">Total Budget Limit</span>
              <span class="material-icons-round stat-icon green">savings</span>
            </div>
            <div class="stat-value" id="total-budget-limit">₹ 0.00</div>
            <div class="stat-subtitle">All categories</div>
          </div>
          <div class="stat-card glassmorphism">
            <div class="stat-header">
              <span class="stat-title">Active Alerts</span>
              <span class="material-icons-round stat-icon orange">warning</span>
            </div>
            <div class="stat-value" id="active-alerts-count">0</div>
            <div class="stat-subtitle">Requires attention</div>
          </div>
        </div>

        <div class="section-container">
          <div class="section-header">
            <h3>All Budgets</h3>
            <div class="filter-group">
              <select id="filter-category" class="glass-input">
                <option value="all">All Categories</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="investment">Investment</option>
              </select>
            </div>
          </div>
          <div class="glassmorphism" style="padding:0; overflow: hidden;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Limit</th>
                  <th>Spent</th>
                  <th>Progress</th>
                  <th>Period</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="budgets-list">
                <tr><td colspan="8" class="empty-state">Loading budgets...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div class="modal-overlay" id="modal-budget">
    <div class="modal-content glassmorphism">
      <div class="modal-header">
        <h3>Create Budget</h3>
        <button class="icon-btn close-modal"><span class="material-icons-round">close</span></button>
      </div>
      <div class="modal-body">
        <form id="form-budget">
          <div class="form-group">
            <label>Budget Name</label>
            <input type="text" id="budget-name" class="glass-input" placeholder="e.g. Monthly Expenses" required>
          </div>
          <div class="form-group">
            <label>Budget Type</label>
            <select id="budget-type" class="glass-input" required>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select id="budget-category" class="glass-input" required>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="investment">Investment</option>
            </select>
          </div>
          <div class="form-group">
            <label>Budget Limit (₹)</label>
            <input type="number" id="budget-limit" class="glass-input" placeholder="50000" required min="1" step="0.01">
          </div>
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" id="budget-start-date" class="glass-input" required>
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="date" id="budget-end-date" class="glass-input" required>
          </div>
          <div class="form-group">
            <label>Alert Thresholds (%)</label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="50" checked> 50%</label>
              <label><input type="checkbox" value="75" checked> 75%</label>
              <label><input type="checkbox" value="90" checked> 90%</label>
              <label><input type="checkbox" value="100" checked> 100%</label>
            </div>
          </div>
          <div class="form-group">
            <label>Alert Channels</label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="in_app" checked> In-App</label>
              <label><input type="checkbox" value="email"> Email</label>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary close-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Budget</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script type="module">
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const token = localStorage.getItem('token');
    const orgId = localStorage.getItem('orgId') || localStorage.getItem('businessId');

    if (!token) {
      window.location.href = '/login.html';
    }

    const api = {
      async get(endpoint) {
        const res = await fetch(`${API_URL}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
      async post(endpoint, data) {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
      async put(endpoint, data) {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
      async delete(endpoint) {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      }
    };

    let budgets = [];
    let alerts = [];

    async function init() {
      try {
        await Promise.all([loadBudgets(), loadAlerts()]);
        setupEventListeners();
      } catch (e) {
        console.error('Failed to initialize:', e);
        showToast('Failed to load budgets', 'error');
      }
    }

    async function loadBudgets() {
      budgets = await api.get(`/v1/organizations/${orgId}/budgets`);
      renderBudgets();
    }

    async function loadAlerts() {
      alerts = await api.get(`/v1/organizations/${orgId}/budgets/alerts`);
      renderAlerts();
    }

    function renderAlerts() {
      const container = document.getElementById('budget-alerts-container');
      const activeAlerts = alerts.filter(a => !a.is_dismissed);
      
      if (activeAlerts.length === 0) {
        container.innerHTML = '';
        return;
      }

      container.innerHTML = activeAlerts.map(alert => {
        const bgColor = alert.threshold >= 100 ? 'rgba(239,68,68,0.15)' : alert.threshold >= 75 ? 'rgba(255,166,0,0.15)' : 'rgba(88,166,255,0.15)';
        const borderColor = alert.threshold >= 100 ? '#ef4444' : alert.threshold >= 75 ? '#ffaa00' : '#58a6ff';
        
        return `
          <div class="alert-toast" style="background:${bgColor}; border-left:3px solid ${borderColor}; margin-bottom:10px; padding:12px 16px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong>Budget Alert:</strong> ${alert.budget?.name || 'Budget'} reached ${alert.threshold}% (₹${alert.amount_at_threshold?.toFixed(2) || '0.00'})
            </div>
            <div style="display:flex; gap:8px;">
              <button class="icon-btn mark-read-btn" data-id="${alert.id}" title="Mark Read">
                <span class="material-icons-round">check</span>
              </button>
              <button class="icon-btn dismiss-btn" data-id="${alert.id}" title="Dismiss">
                <span class="material-icons-round">close</span>
              </button>
            </div>
          </div>
        `;
      }).join('');

      document.getElementById('active-alerts-count').textContent = activeAlerts.length;

      container.querySelectorAll('.mark-read-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.dataset.id;
          await api.put(`/v1/organizations/${orgId}/budgets/alerts/${id}/read`);
          await loadAlerts();
        });
      });

      container.querySelectorAll('.dismiss-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.dataset.id;
          await api.put(`/v1/organizations/${orgId}/budgets/alerts/${id}/dismiss`);
          await loadAlerts();
        });
      });
    }

    function renderBudgets() {
      const tbody = document.getElementById('budgets-list');
      const filter = document.getElementById('filter-category').value;
      
      const filtered = filter === 'all' ? budgets : budgets.filter(b => b.category === filter);

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No budgets found. Create one to start tracking.</td></tr>';
        return;
      }

      const totalLimit = budgets.reduce((sum, b) => sum + Number(b.limit_amount), 0);
      document.getElementById('active-budgets-count').textContent = budgets.length;
      document.getElementById('total-budget-limit').textContent = formatMoney(totalLimit);

      tbody.innerHTML = filtered.map(budget => {
        const spent = Number(budget.current_spent) || 0;
        const limit = Number(budget.limit_amount) || 0;
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;
        
        let progressColor = '#22c55e';
        if (percentage >= 90) progressColor = '#ef4444';
        else if (percentage >= 75) progressColor = '#ffaa00';

        return `
          <tr>
            <td><strong>${budget.name}</strong></td>
            <td><span class="badge">${budget.type}</span></td>
            <td><span class="badge">${budget.category}</span></td>
            <td>${formatMoney(limit)}</td>
            <td>${formatMoney(spent)}</td>
            <td>
              <div class="progress-bar" style="width:100px; height:8px; background:#30363d; border-radius:4px; overflow:hidden;">
                <div style="width:${Math.min(percentage, 100)}%; background:${progressColor}; height:100%;"></div>
              </div>
              <small>${percentage.toFixed(1)}%</small>
            </td>
            <td>${new Date(budget.start_date).toLocaleDateString()} - ${new Date(budget.end_date).toLocaleDateString()}</td>
            <td>
              <button class="icon-btn view-status-btn" data-id="${budget.id}" title="View Status">
                <span class="material-icons-round">visibility</span>
              </button>
              <button class="icon-btn edit-budget-btn" data-id="${budget.id}" title="Edit">
                <span class="material-icons-round">edit</span>
              </button>
              <button class="icon-btn delete-budget-btn" data-id="${budget.id}" title="Delete">
                <span class="material-icons-round">delete</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('.view-status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => viewBudgetStatus(e.currentTarget.dataset.id));
      });

      tbody.querySelectorAll('.edit-budget-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openEditBudgetModal(e.currentTarget.dataset.id));
      });

      tbody.querySelectorAll('.delete-budget-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          if (confirm('Delete this budget?')) deleteBudget(e.currentTarget.dataset.id);
        });
      });
    }

    async function viewBudgetStatus(budgetId) {
      try {
        const status = await api.get(`/v1/organizations/${orgId}/budgets/${budgetId}/status`);
        alert(`
Budget: ${status.name}
Limit: ${formatMoney(status.limit)}
Spent: ${formatMoney(status.current_spent)}
Percentage: ${status.percentage}%
Remaining: ${formatMoney(status.remaining)}
${status.is_exceeded ? '⚠️ BUDGET EXCEEDED!' : ''}
        `.trim());
      } catch (e) {
        showToast('Failed to load status', 'error');
      }
    }

    async function deleteBudget(budgetId) {
      try {
        await api.delete(`/v1/organizations/${orgId}/budgets/${budgetId}`);
        await loadBudgets();
        showToast('Budget deleted', 'success');
      } catch (e) {
        showToast('Failed to delete budget', 'error');
      }
    }

    function openEditBudgetModal(budgetId) {
      const budget = budgets.find(b => b.id === budgetId);
      if (!budget) return;

      document.getElementById('budget-name').value = budget.name;
      document.getElementById('budget-type').value = budget.type;
      document.getElementById('budget-category').value = budget.category;
      document.getElementById('budget-limit').value = budget.limit_amount;
      document.getElementById('budget-start-date').value = budget.start_date;
      document.getElementById('budget-end-date').value = budget.end_date;

      const modal = document.getElementById('modal-budget');
      modal.querySelector('h3').textContent = 'Edit Budget';
      modal.querySelector('button[type="submit"]').textContent = 'Update Budget';
      modal.dataset.editId = budgetId;
      modal.classList.add('active');
    }

    function setupEventListeners() {
      document.getElementById('new-budget-btn')?.addEventListener('click', () => {
        const modal = document.getElementById('modal-budget');
        modal.querySelector('h3').textContent = 'Create Budget';
        modal.querySelector('button[type="submit"]').textContent = 'Create Budget';
        delete modal.dataset.editId;
        modal.querySelector('form').reset();
        modal.classList.add('active');
      });

      document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.closest('.modal-overlay')?.classList.remove('active');
        });
      });

      document.getElementById('filter-category')?.addEventListener('change', renderBudgets);

      document.getElementById('form-budget')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const editId = form.closest('.modal-overlay').dataset.editId;

        const thresholds = Array.from(document.querySelectorAll('#form-budget input[type="checkbox"]:checked'))
          .map(cb => parseInt(cb.value));

        const channels = Array.from(document.querySelectorAll('#form-budget input[type="checkbox"][value="in_app"], #form-budget input[type="checkbox"][value="email"]:checked'))
          .map(cb => cb.value);

        const data = {
          name: document.getElementById('budget-name').value,
          type: document.getElementById('budget-type').value,
          category: document.getElementById('budget-category').value,
          limit_amount: Number(document.getElementById('budget-limit').value),
          start_date: document.getElementById('budget-start-date').value,
          end_date: document.getElementById('budget-end-date').value,
          alert_thresholds: thresholds,
          alert_channels: channels
        };

        try {
          if (editId) {
            await api.put(`/v1/organizations/${orgId}/budgets/${editId}`, data);
            showToast('Budget updated', 'success');
          } else {
            await api.post(`/v1/organizations/${orgId}/budgets`, data);
            showToast('Budget created', 'success');
          }
          form.reset();
          form.closest('.modal-overlay').classList.remove('active');
          await loadBudgets();
        } catch (err) {
          showToast(err.message || 'Failed to save budget', 'error');
        }
      });

      document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/login.html';
      });

      document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const target = item.dataset.target;
          if (target && item.getAttribute('href') === '#') {
            e.preventDefault();
          }
        });
      });
    }

    function formatMoney(val) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
    }

    function showToast(message, type = 'success') {
      const existing = document.querySelector('.toast');
      if (existing) existing.remove();
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 10);
      setTimeout(() => toast.remove(), 3000);
    }

    init();
  </script>
</body>
</html>
```

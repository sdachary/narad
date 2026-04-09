---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/index.html"
project: "chitragupta"
role: service
language: html
frameworks: [docker, vite]
lines: 501
size: 20936 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:38"
tags: [code, docker, html, project/chitragupta, service, vite]
---

# index.html

> Service / API client module using **docker, vite** (501 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/index.html` |
| **Role** | service |
| **Language** | html |
| **Frameworks** | docker, vite |
| **Lines** | 501 |
| **Size** | 20936 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chitragupta - Business Ledger - Xerox & Recharge</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#061423">
  <link rel="stylesheet" href="src/css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body>
  
  <div class="app-container">
    
    <!-- Sidebar / Nav -->
    <nav class="sidebar">
      <div class="brand">
        <span class="material-icons-round brand-icon">account_balance</span>
        <h1>Chitragupta</h1>
      </div>
      
      <div class="nav-links">
        <a href="#" class="nav-item active" data-target="dashboard">
          <span class="material-icons-round">dashboard</span> Dashboard
        </a>
        <a href="#" class="nav-item" data-target="transactions">
          <span class="material-icons-round">list_alt</span> All Transactions
        </a>
        <a href="#" class="nav-item" data-target="partners">
          <span class="material-icons-round">group</span> Partners & Split
        </a>
        <a href="#" class="nav-item" data-target="reports">
          <span class="material-icons-round">analytics</span> Reports
        </a>
        <a href="#" class="nav-item" data-target="settings">
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

    <!-- Main Content Area -->
    <main class="main-content">
      
      <header class="top-header">
        <h2 id="page-title">Dashboard</h2>
        <div class="header-actions">
          <button class="btn btn-primary" id="new-txn-btn">
            <span class="material-icons-round">add</span> New Transaction
          </button>
        </div>
      </header>

      <div class="view-container active" id="view-dashboard">
        
        <!-- Summary Cards -->
        <div class="stats-grid">
          <div class="stat-card glassmorphism">
            <div class="stat-header">
              <span class="stat-title">Total Shop Balance</span>
              <span class="material-icons-round stat-icon blue">account_balance_wallet</span>
            </div>
            <div class="stat-value mono" id="total-balance">₹ 0.00</div>
            <div class="stat-subtitle">Net available cash</div>
          </div>
          
          <div class="stat-card glassmorphism">
            <div class="stat-header">
              <span class="stat-title">Total Investments</span>
              <span class="material-icons-round stat-icon green">savings</span>
            </div>
            <div class="stat-value mono" id="total-invested">₹ 0.00</div>
            <div class="stat-subtitle">Capital injected</div>
          </div>
          
          <div class="stat-card glassmorphism">
            <div class="stat-header">
              <span class="stat-title">Total Withdrawals</span>
              <span class="material-icons-round stat-icon orange">money_off</span>
            </div>
            <div class="stat-value mono" id="total-withdrawn">₹ 0.00</div>
            <div class="stat-subtitle">Profits taken out</div>
          </div>
        </div>

        <!-- Settlement Alert Card -->
        <div class="settlement-card glassmorphism highlight-card">
          <div class="settlement-info">
            <h3>Settlement Status</h3>
            <p id="settlement-text">Books are perfectly balanced.</p>
          </div>
          <button class="btn btn-secondary" id="settle-up-btn">Settle Up</button>
        </div>

        <!-- Dashboard Charts -->
        <div class="charts-grid">
          <div class="chart-card glassmorphism">
            <div class="chart-header">
              <h3>Revenue Overview</h3>
              <button class="icon-btn export-chart-btn" data-chart="revenue" title="Export">
                <span class="material-icons-round">download</span>
              </button>
            </div>
            <div class="chart-container">
              <canvas id="chart-revenue"></canvas>
            </div>
          </div>
          
          <div class="chart-card glassmorphism">
            <div class="chart-header">
              <h3>Partner Distribution</h3>
              <button class="icon-btn export-chart-btn" data-chart="partners" title="Export">
                <span class="material-icons-round">download</span>
              </button>
            </div>
            <div class="chart-container">
              <canvas id="chart-partners"></canvas>
            </div>
          </div>
          
          <div class="chart-card glassmorphism">
            <div class="chart-header">
              <h3>Transaction Trends</h3>
              <button class="icon-btn export-chart-btn" data-chart="trends" title="Export">
                <span class="material-icons-round">download</span>
              </button>
            </div>
            <div class="chart-container">
              <canvas id="chart-trends"></canvas>
            </div>
          </div>
          
          <div class="chart-card glassmorphism">
            <div class="chart-header">
              <h3>Category Breakdown</h3>
              <button class="icon-btn export-chart-btn" data-chart="categories" title="Export">
                <span class="material-icons-round">download</span>
              </button>
            </div>
            <div class="chart-container">
              <canvas id="chart-categories"></canvas>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="section-container">
          <div class="section-header">
            <h3>Recent Activity</h3>
            <a href="#" class="view-all" onclick="document.querySelector('[data-target=\'transactions\']').click()">View All</a>
          </div>
          <div class="transaction-list glassmorphism" id="recent-transactions">
            <!-- Populated via JS -->
            <div class="empty-state">No transactions yet.</div>
          </div>
        </div>

      </div>

      <!-- Transactions View -->
      <div class="view-container" id="view-transactions">
        <div class="filter-bar glassmorphism">
          <input type="text" id="search-txn" class="glass-input" placeholder="Search transactions..." style="flex:1;">
          <select id="filter-type" class="glass-input">
            <option value="all">All Types</option>
            <option value="income">Income (Daily Sales)</option>
            <option value="expense">Expense (Supplies, Bills)</option>
            <option value="investment">Investment (Capital)</option>
            <option value="withdrawal">Withdrawal (Profits)</option>
          </select>
          <select id="filter-partner" class="glass-input">
            <option value="all">All Partners</option>
          </select>
          <input type="date" id="filter-date-from" class="glass-input" title="From Date">
          <input type="date" id="filter-date-to" class="glass-input" title="To Date">
          <button class="btn btn-secondary" id="export-csv-btn" title="Export CSV">
            <span class="material-icons-round">download</span> Export
          </button>
        </div>

        <div class="transaction-list glassmorphism" id="all-transactions">
          <!-- Populated via JS -->
        </div>
        <div id="transactions-pagination" class="pagination"></div>
      </div>

      <!-- Partners View -->
      <div class="view-container" id="view-partners">
        <div class="section-header" style="margin-bottom: 20px;">
          <h3>Business Partners</h3>
          <button class="btn btn-secondary" id="add-partner-btn">
            <span class="material-icons-round">person_add</span> Add New Partner
          </button>
        </div>
        <div class="partners-grid" id="partners-list">
          <!-- Populated via JS -->
        </div>
      </div>

      <!-- Reports View -->
      <div class="view-container" id="view-reports">
        <div class="report-controls glassmorphism">
          <div class="report-filters">
            <select id="report-period" class="glass-input">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select id="report-year" class="glass-input"></select>
            <select id="report-month" class="glass-input"></select>
            <select id="report-quarter" class="glass-input" style="display:none;">
              <option value="1">Q1</option>
              <option value="2">Q2</option>
              <option value="3">Q3</option>
              <option value="4">Q4</option>
            </select>
            <button class="btn btn-primary" id="load-report-btn">
              <span class="material-icons-round">refresh</span> Load Report
            </button>
          </div>
        </div>

        <div class="report-summary-grid" id="report-summary">
          <div class="stat-card glassmorphism">
            <div class="stat-header">
              <span class="stat-title">Total Income</span>
              <span class="material-icons-round stat-icon green">trending_up</span>
            </div>
            <div class="stat-value" id="pl-income">₹ 0.00</div>
          </div>
          <div class="stat-card glassmorphism">
            <div class="stat-header">
              <span class="stat-title">Total Expenses</span>
              <span class="material-icons-round stat-icon red">trending_down</span>
            </div>
            <div class="stat-value" id="pl-expenses">₹ 0.00</div>
          </div>
          <div class="stat-card glassmorphism">
            <div class="stat-header">
              <span class="stat-title">Investments</span>
              <span class="material-icons-round stat-icon blue">savings</span>
            </div>
            <div class="stat-value" id="pl-investments">₹ 0.00</div>
          </div>
          <div class="stat-card glassmorphism">
            <div class="stat-header">
              <span class="stat-title">Withdrawals</span>
              <span class="material-icons-round stat-icon orange">money_off</span>
            </div>
            <div class="stat-value" id="pl-withdrawals">₹ 0.00</div>
          </div>
        </div>

        <div class="report-metrics-grid">
          <div class="glassmorphism metric-card">
            <h4>Gross Profit</h4>
            <div class="metric-value" id="pl-gross-profit">₹ 0.00</div>
            <div class="metric-label">Income - Expenses</div>
          </div>
          <div class="glassmorphism metric-card">
            <h4>Net Profit</h4>
            <div class="metric-value mono" id="pl-net-profit">₹ 0.00</div>
            <div class="metric-label">Gross + Investments - Withdrawals</div>
          </div>
        </div>

        <div class="report-details-grid">
          <div class="glassmorphism">
            <h4>Top Expenses</h4>
            <div id="top-expenses-list"></div>
          </div>
          <div class="glassmorphism">
            <h4>Partner Distribution</h4>
            <div id="partner-distribution-list"></div>
          </div>
        </div>

        <div class="section-container">
          <div class="section-header">
            <h3>Partner Summary (Year-to-Date)</h3>
            <button class="btn btn-secondary" id="load-partner-summary-btn">
              <span class="material-icons-round">group</span> View All Partners
            </button>
          </div>
          <div class="table-responsive glassmorphism" style="padding:0; overflow: hidden;">
            <table class="data-table" id="partner-summary-table">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Ownership %</th>
                  <th>Total Invested</th>
                  <th>Total Withdrawn</th>
                  <th>Net Share (YTD)</th>
                </tr>
              </thead>
              <tbody id="partner-summary-body">
                <tr><td colspan="5" class="empty-state">Load report to view partner breakdown.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Settings View -->
      <div class="view-container" id="view-settings">
        <div class="section-container">
          <div class="section-header">
            <h3>Service Categories & Pricing</h3>
            <button class="btn btn-secondary" id="add-service-btn">
              <span class="material-icons-round">add</span> Add New Category
            </button>
          </div>
          <div class="table-responsive glassmorphism" style="padding:0; overflow: hidden;">
            <table class="data-table" id="services-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Price</th>
                  <th>Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="services-list-body">
                <!-- Rendered via JS -->
                <tr><td colspan="4" class="empty-state">No services added yet.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>
  </div>

  <!-- Modals -->

  <!-- Add Transaction Modal -->
  <div class="modal-overlay" id="modal-transaction">
    <div class="modal-content glassmorphism">
      <div class="modal-header">
        <h3>New Transaction</h3>
        <button class="icon-btn close-modal"><span class="material-icons-round">close</span></button>
      </div>
      <div class="modal-body">
        <form id="form-transaction">
          <div class="form-group">
            <label>Type</label>
            <div class="type-selector">
              <label class="type-radio"><input type="radio" name="txnType" value="income" checked> <span>Income</span></label>
              <label class="type-radio"><input type="radio" name="txnType" value="expense"> <span>Expense</span></label>
              <label class="type-radio"><input type="radio" name="txnType" value="investment"> <span>Invest</span></label>
              <label class="type-radio"><input type="radio" name="txnType" value="withdrawal"> <span>Withdraw</span></label>
            </div>
          </div>

          <div class="form-group" id="income-details" style="display:none; padding:12px; background:rgba(88,166,255,0.05); border:1px solid rgba(88,166,255,0.2); border-radius:10px; margin-bottom:20px;">
            <label>Service Type</label>
            <select id="txnService" class="glass-input" style="margin-bottom:12px;">
              <!-- Populated via JS -->
            </select>
            
            <div id="qty-group" style="display:none;">
              <label>Quantity / Pages</label>
              <input type="number" id="txnQty" class="glass-input" placeholder="1" min="1" step="1" value="1">
            </div>
          </div>

          <div class="form-group">
            <label>Amount (₹)</label>
            <input type="number" id="txnAmount" class="glass-input" placeholder="0.00" required min="1" step="0.01">
          </div>

          <div class="form-group" id="desc-group">
            <label>Description</label>
            <input type="text" id="txnDesc" class="glass-input" placeholder="e.g. Daily Sales, Paper Bundle..." required>
          </div>

          <div class="form-group">
            <label>Who?</label>
            <select id="txnPartner" class="glass-input" required>
              <option value="both">Shop / Both Partners</option>
              <option value="p1" id="opt-p1">Partner 1</option>
              <option value="p2" id="opt-p2">Partner 2</option>
            </select>
            <small class="hint-text">For Income/Expense, usually "Shop". For Invest/Withdraw, select the specific partner.</small>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary close-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Transaction</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Add Partner Modal -->
  <div class="modal-overlay" id="modal-partner">
    <div class="modal-content glassmorphism">
      <div class="modal-header">
        <h3>Invite New Partner</h3>
        <button class="icon-btn close-modal"><span class="material-icons-round">close</span></button>
      </div>
      <div class="modal-body">
        <form id="form-partner">
          <div class="form-group">
            <label>Partner Email</label>
            <input type="email" id="partner-email" class="glass-input" placeholder="partner@example.com" required>
            <small class="hint-text">The partner must already have a Chitragupta account with this email.</small>
          </div>
          <div class="form-group">
            <label>Display Name</label>
            <input type="text" id="partner-name" class="glass-input" placeholder="e.g. John Doe">
          </div>
          <div class="form-group">
            <label>Ownership Percentage (%)</label>
            <input type="number" id="partner-ownership" class="glass-input" placeholder="e.g. 50" min="0" max="100" step="1" required>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary close-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Partner</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Add Service Modal -->
  <div class="modal-overlay" id="modal-service">
    <div class="modal-content glassmorphism">
      <div class="modal-header">
        <h3>New Service / Category</h3>
        <button class="icon-btn close-modal"><span class="material-icons-round">close</span></button>
      </div>
      <div class="modal-body">
        <form id="form-service">
          <div class="form-group">
            <label>Service Name</label>
            <input type="text" id="service-name" class="glass-input" placeholder="e.g. Xerox B&W" required>
          </div>
          <div class="form-group">
            <label>Price (₹)</label>
            <input type="number" id="service-price" class="glass-input" placeholder="0.00" required min="0" step="0.01">
          </div>
          <div class="form-group">
            <label>Unit</label>
            <input type="text" id="service-unit" class="glass-input" placeholder="e.g. page, piece" required value="page">
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary close-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Category</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal-overlay" id="modal-settle">
    <div class="modal-content glassmorphism">
      <div class="modal-header">
        <h3>Settle Up</h3>
        <button class="icon-btn close-modal"><span class="material-icons-round">close</span></button>
      </div>
      <div class="modal-body text-center">
        <div class="settle-animation">
          <span class="material-icons-round huge-icon">sync_alt</span>
        </div>
        <h4 id="settle-instruction">--</h4>
        <p class="settle-desc">This will record a transfer between the partners to balance the investments and withdrawals perfectly.</p>
        
        <div class="form-actions center-actions">
          <button type="button" class="btn btn-secondary close-modal">Cancel</button>
          <button type="button" class="btn btn-primary" id="confirm-settle-btn">Confirm Settlement</button>
        </div>
      </div>
    </div>
  </div>

    <script type="module" src="src/ts/app.ts"></script>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  </script>
</body>
</html>

```

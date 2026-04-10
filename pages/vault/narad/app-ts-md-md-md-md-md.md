---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/app-ts-md-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [docker, typescript, vite]
lines: 1131
size: 37819 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docker, documentation, markdown, project/narad, service, typescript, vite]
---

# app-ts-md-md-md-md.md

> Service / API client module using **docker, typescript, vite** (1131 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/app-ts-md-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker, typescript, vite |
| **Lines** | 1131 |
| **Size** | 37819 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/app-ts-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [docker, typescript, vite]
lines: 1093
size: 36988 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docker, documentation, markdown, project/narad, service, typescript, vite]
---

# app-ts-md-md-md.md

> Service / API client module using **docker, typescript, vite** (1093 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/app-ts-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker, typescript, vite |
| **Lines** | 1093 |
| **Size** | 36988 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/app-ts-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [docker, typescript, vite]
lines: 1055
size: 36166 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docker, documentation, markdown, project/narad, service, typescript, vite]
---

# app-ts-md-md.md

> Service / API client module using **docker, typescript, vite** (1055 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/app-ts-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker, typescript, vite |
| **Lines** | 1055 |
| **Size** | 36166 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/app-ts-md.md"
project: "narad"
role: service
language: markdown
frameworks: [docker, typescript, vite]
lines: 1017
size: 35353 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docker, documentation, markdown, project/narad, service, typescript, vite]
---

# app-ts-md.md

> Service / API client module using **docker, typescript, vite** (1017 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/app-ts-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker, typescript, vite |
| **Lines** | 1017 |
| **Size** | 35353 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/chitragupta/app-ts.md"
project: "narad"
role: service
language: markdown
frameworks: [docker, typescript, vite]
lines: 979
size: 34540 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docker, documentation, markdown, project/narad, service, typescript, vite]
---

# app-ts.md

> Service / API client module using **docker, typescript, vite** (979 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/chitragupta/app-ts.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker, typescript, vite |
| **Lines** | 979 |
| **Size** | 34540 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/src/ts/app.ts"
project: "chitragupta"
role: service
language: typescript
frameworks: [docker, typescript, vite]
lines: 941
size: 33738 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, docker, project/chitragupta, service, typescript, vite]
---

# app.ts

> Service / API client module using **docker, typescript, vite** (941 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/src/ts/app.ts` |
| **Role** | service |
| **Language** | typescript |
| **Frameworks** | docker, typescript, vite |
| **Lines** | 941 |
| **Size** | 33738 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[api-ts]], [[auth-css]]

## 📄 Content

```typescript
import { api } from './api';
import { auth } from './auth';
import {
  aggregateData,
  createRevenueChart,
  createPartnerDistributionChart,
  createTransactionTrendChart,
  createCategoryBreakdownChart,
  destroyCharts,
  registerChart,
  type AggregatedData
} from './charts';

// Types
interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'investment' | 'withdrawal' | 'settlement';
  amount: number;
  description: string;
  partner_id?: string;
  service_id?: string;
  created_at: string;
  partner?: { member_name: string };
  service?: { name: string };
}

interface Member {
  id: string;
  user_id: string;
  member_name: string;
  role: string;
  ownership_percentage: number;
}

interface State {
  transactions: Transaction[];
  business: any;
  members: Member[];
  services: Service[];
  loading: boolean;
  filters: {
    search: string;
    type: string;
    partner: string;
    dateFrom: string;
    dateTo: string;
  };
  pagination: {
    currentPage: number;
    pageSize: number;
  };
}

interface Service {
  id: string;
  name: string;
  price_per_unit: number;
  unit: string;
}

let state: State = {
  transactions: [],
  business: null,
  members: [],
  services: [],
  loading: false,
  filters: {
    search: '',
    type: 'all',
    partner: 'all',
    dateFrom: '',
    dateTo: ''
  },
  pagination: {
    currentPage: 1,
    pageSize: 15
  }
};

// Initialization
async function init() {
  if (!auth.isAuthenticated()) {
    window.location.href = '/login.html';
    return;
  }

  const organizationId = localStorage.getItem('organizationId');
  if (!organizationId) return;

  try {
    setLoading(true);
    const results = await Promise.allSettled([
      api.get(`/businesses/${organizationId}`),
      api.get(`/businesses/${organizationId}/members`),
      api.get(`/businesses/${organizationId}/services`),
      api.get(`/businesses/${organizationId}/transactions`)
    ]);

    state.business = results[0].status === 'fulfilled' ? results[0].value : null;
    state.members = results[1].status === 'fulfilled' ? results[1].value : [];
    state.services = results[2].status === 'fulfilled' ? results[2].value : [];
    state.transactions = results[3].status === 'fulfilled' ? results[3].value : [];

    if (results.some(r => r.status === 'rejected')) {
      showToast('Some data failed to load', 'error');
    }

    render();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showToast('Failed to load data', 'error');
  } finally {
    setLoading(false);
    setupEventListeners();
  }
}

function render() {
  if (state.business) {
    const profileName = document.getElementById('profile-name');
    const profileRole = document.getElementById('profile-role');
    const userId = localStorage.getItem('userId');
    const currentUser = state.members.find(m => m.user_id === userId);
    
    if (profileName) profileName.textContent = currentUser?.member_name || 'User';
    if (profileRole) profileRole.textContent = currentUser?.role || 'Partner';
  }

  renderDashboard();
  renderTransactions();
  renderPartners();
  renderServices();
  populateServiceSelect();
}

function renderDashboard() {
  const totalBalanceEl = document.getElementById('total-balance');
  const totalInvestedEl = document.getElementById('total-invested');
  const totalWithdrawnEl = document.getElementById('total-withdrawn');

  if (totalBalanceEl) {
    const balance = state.transactions.reduce((acc, t) => {
      if (t.type === 'income' || t.type === 'investment') return acc + Number(t.amount);
      return acc - Number(t.amount);
    }, 0);
    totalBalanceEl.textContent = formatMoney(balance);
  }

  if (totalInvestedEl) {
    const invested = state.transactions
      .filter(t => t.type === 'investment')
      .reduce((acc, t) => acc + Number(t.amount), 0);
    totalInvestedEl.textContent = formatMoney(invested);
  }

  if (totalWithdrawnEl) {
    const withdrawn = state.transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((acc, t) => acc + Number(t.amount), 0);
    totalWithdrawnEl.textContent = formatMoney(withdrawn);
  }

  // Recent Activity
  const recentList = document.getElementById('recent-transactions');
  if (recentList) {
    const recent = [...state.transactions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
    renderTransactionList(recent, recentList);
  }

  // Render Charts
  renderCharts();
}

function renderCharts() {
  destroyCharts();

  const aggregatedData: AggregatedData = aggregateData(state.transactions, state.members, state.services);

  const revenueCanvas = document.getElementById('chart-revenue') as HTMLCanvasElement;
  if (revenueCanvas) {
    const chart = createRevenueChart(revenueCanvas, aggregatedData);
    registerChart(chart);
  }

  const partnersCanvas = document.getElementById('chart-partners') as HTMLCanvasElement;
  if (partnersCanvas) {
    const chart = createPartnerDistributionChart(partnersCanvas, aggregatedData);
    registerChart(chart);
  }

  const trendsCanvas = document.getElementById('chart-trends') as HTMLCanvasElement;
  if (trendsCanvas) {
    const chart = createTransactionTrendChart(trendsCanvas, aggregatedData);
    registerChart(chart);
  }

  const categoriesCanvas = document.getElementById('chart-categories') as HTMLCanvasElement;
  if (categoriesCanvas) {
    const chart = createCategoryBreakdownChart(categoriesCanvas, aggregatedData);
    registerChart(chart);
  }
}

function renderTransactions() {
  const container = document.getElementById('all-transactions');
  const paginationContainer = document.getElementById('transactions-pagination');
  if (container) {
    const filtered = getFilteredTransactions();
    const start = (state.pagination.currentPage - 1) * state.pagination.pageSize;
    const end = start + state.pagination.pageSize;
    const paginated = filtered.slice(start, end);
    
    renderTransactionList(paginated, container);
    
    if (paginationContainer) {
      renderPagination(filtered.length, paginationContainer);
    }
  }
}

function renderPagination(totalItems: number, container: HTMLElement) {
  const totalPages = Math.ceil(totalItems / state.pagination.pageSize);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `
    <button class="page-btn prev" ${state.pagination.currentPage === 1 ? 'disabled' : ''}>
      <span class="material-icons-round">chevron_left</span>
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= state.pagination.currentPage - 1 && i <= state.pagination.currentPage + 1)) {
      html += `
        <button class="page-btn ${state.pagination.currentPage === i ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    } else if (i === state.pagination.currentPage - 2 || i === state.pagination.currentPage + 2) {
      html += '<span class="page-ellipsis">...</span>';
    }
  }

  html += `
    <button class="page-btn next" ${state.pagination.currentPage === totalPages ? 'disabled' : ''}>
      <span class="material-icons-round">chevron_right</span>
    </button>
    <div class="page-info">Page ${state.pagination.currentPage} of ${totalPages}</div>
  `;

  container.innerHTML = html;

  // Add event listeners
  container.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('prev')) {
        state.pagination.currentPage--;
      } else if (btn.classList.contains('next')) {
        state.pagination.currentPage++;
      } else {
        const page = (btn as HTMLElement).dataset.page;
        if (page) state.pagination.currentPage = Number(page);
      }
      renderTransactions();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function getFilteredTransactions(): Transaction[] {
  let result = [...state.transactions];
  
  const search = state.filters.search.toLowerCase();
  const { type, partner, dateFrom, dateTo } = state.filters;
  
  if (search) {
    result = result.filter(t => 
      t.description.toLowerCase().includes(search) ||
      t.partner?.member_name?.toLowerCase().includes(search) ||
      t.service?.name?.toLowerCase().includes(search)
    );
  }
  
  if (type !== 'all') {
    result = result.filter(t => t.type === type);
  }
  
  if (partner !== 'all') {
    result = result.filter(t => t.partner_id === partner);
  }
  
  if (dateFrom) {
    result = result.filter(t => new Date(t.created_at) >= new Date(dateFrom));
  }
  
  if (dateTo) {
    result = result.filter(t => new Date(t.created_at) <= new Date(dateTo + 'T23:59:59'));
  }
  
  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function renderTransactionList(txns: any[], container: HTMLElement) {
  let html = '';
  txns.forEach(t => {
    const partnerName = t.partner?.member_name || 'Shop';
    const serviceName = t.service?.name ? `<span class="txn-service-tag">${t.service.name}</span>` : '';
    
    html += `
      <div class="txn-item">
        <div class="txn-icon ${t.type}">
          <span class="material-icons-round">${getTxnIcon(t.type)}</span>
        </div>
        <div class="txn-details">
          <h4>${t.description} ${serviceName}</h4>
          <p>${new Date(t.created_at).toLocaleString()}</p>
        </div>
        <div class="txn-partner">${partnerName}</div>
        <div class="txn-amount ${t.type}">${formatMoney(t.amount)}</div>
      </div>
    `;
  });
  container.innerHTML = html || '<div class="empty-state">No transactions yet.</div>';
}

function getTxnIcon(type: string) {
  switch(type) {
    case 'income': return 'trending_up';
    case 'expense': return 'trending_down';
    case 'investment': return 'savings';
    case 'withdrawal': return 'money_off';
    case 'settlement': return 'sync_alt';
    default: return 'receipt_long';
  }
}

function renderPartners() {
  const container = document.getElementById('partners-list');
  if (!container) return;

  let html = '';
  state.members.forEach(m => {
    const partnerTxns = state.transactions.filter(t => t.partner_id === m.id);
    const invested = partnerTxns.filter(t => t.type === 'investment').reduce((acc, t) => acc + Number(t.amount), 0);
    const withdrawn = partnerTxns.filter(t => t.type === 'withdrawal').reduce((acc, t) => acc + Number(t.amount), 0);
    
    html += `
      <div class="partner-card glassmorphism">
        <div class="partner-header">
          <div class="avatar large">${m.member_name.substring(0, 2).toUpperCase()}</div>
          <div>
            <div class="partner-name-display">${m.member_name}</div>
            <div class="partner-role">${m.role} (${m.ownership_percentage}%)</div>
          </div>
        </div>
        <div class="partner-stats">
          <div class="p-stat">
            <span class="p-label">Invested</span>
            <span class="p-val green">${formatMoney(invested)}</span>
          </div>
          <div class="p-stat">
            <span class="p-label">Withdrawn</span>
            <span class="p-val orange">${formatMoney(withdrawn)}</span>
          </div>
          <div class="p-stat highlight">
            <span class="p-label">Net Equity</span>
            <span class="p-val">${formatMoney(invested - withdrawn)}</span>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;

  const partnerSelect = document.getElementById('txnPartner') as HTMLSelectElement;
  if (partnerSelect) {
    let options = '<option value="shop">Shop / Both</option>';
    state.members.forEach(m => {
      options += `<option value="${m.id}">${m.member_name}</option>`;
    });
    partnerSelect.innerHTML = options;

    const type = (document.querySelector('input[name="txnType"]:checked') as HTMLInputElement)?.value;
    const shopOption = partnerSelect.querySelector('option[value="shop"]') as HTMLOptionElement;
    if (type === 'income' || type === 'expense') {
      if (shopOption) shopOption.style.display = '';
    } else {
      if (shopOption) shopOption.style.display = 'none';
      if (partnerSelect.value === 'shop' || partnerSelect.value === '') {
         partnerSelect.value = state.members[0]?.id || '';
      }
    }
  }

  const filterPartner = document.getElementById('filter-partner') as HTMLSelectElement;
  if (filterPartner) {
    let options = '<option value="all">All Partners</option>';
    state.members.forEach(m => {
      options += `<option value="${m.id}">${m.member_name}</option>`;
    });
    filterPartner.innerHTML = options;
  }
}

function renderServices() {
  const tbody = document.getElementById('services-list-body');
  if (!tbody) return;

  if (state.services.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No services added yet.</td></tr>';
    return;
  }

  let html = '';
  state.services.forEach(s => {
    html += `
      <tr>
        <td>${s.name}</td>
        <td>₹${Number(s.price_per_unit).toFixed(2)}</td>
        <td>per ${s.unit}</td>
        <td>
          <button class="icon-btn edit-service-btn" data-id="${s.id}" title="Edit"><span class="material-icons-round">edit</span></button>
          <button class="icon-btn delete-service-btn" data-id="${s.id}" title="Delete"><span class="material-icons-round">delete</span></button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;

  document.querySelectorAll('.edit-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      if (id) openEditServiceModal(id);
    });
  });

  document.querySelectorAll('.delete-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      if (id && confirm('Are you sure you want to delete this service?')) deleteService(id);
    });
  });
}

function openEditServiceModal(serviceId: string) {
  const service = state.services.find(s => s.id === serviceId);
  if (!service) return;

  (document.getElementById('service-name') as HTMLInputElement).value = service.name;
  (document.getElementById('service-price') as HTMLInputElement).value = String(service.price_per_unit);
  (document.getElementById('service-unit') as HTMLInputElement).value = service.unit;
  
  const modal = document.getElementById('modal-service');
  if (modal) {
    modal.classList.add('active');
    const heading = modal.querySelector('h3');
    if (heading) heading.textContent = 'Edit Service';
    const submitBtn = modal.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Update Service';
    (modal.querySelector('form') as HTMLFormElement).dataset.editId = serviceId;
  }
}

async function deleteService(serviceId: string) {
  try {
    setLoading(true);
    const organizationId = localStorage.getItem('organizationId');
    await api.delete(`/businesses/${organizationId}/services/${serviceId}`);
    state.services = state.services.filter(s => s.id !== serviceId);
    renderServices();
    populateServiceSelect();
    showToast('Service deleted successfully', 'success');
  } catch (error: any) {
    showToast(error.message || 'Failed to delete service', 'error');
  } finally {
    setLoading(false);
  }
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.remove(), 3000);
}

function setLoading(loading: boolean) {
    state.loading = loading;
    const overlay = document.querySelector('.app-container');
    if (overlay) {
        if (loading) {
            overlay.insertAdjacentHTML('afterbegin', '<div class="loading-overlay"><div class="pulse-loader"></div></div>');
        } else {
            document.querySelector('.loading-overlay')?.remove();
        }
    }
}

function exportTransactionsCSV() {
  const filtered = getFilteredTransactions();
  if (filtered.length === 0) {
    showToast('No transactions to export', 'error');
    return;
  }

  const headers = ['Date', 'Type', 'Description', 'Amount', 'Partner', 'Service'];
  const rows = filtered.map(t => [
    new Date(t.created_at).toLocaleString(),
    t.type,
    t.description,
    t.amount,
    t.partner?.member_name || 'Shop',
    t.service?.name || '-'
  ]);

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Transactions exported successfully', 'success');
}

function populateServiceSelect() {
  const serviceSelect = document.getElementById('txnService');
  if (serviceSelect) {
    let html = '<option value="">Select Service (Optional)</option>';
    state.services.forEach(s => {
      html += `<option value="${s.id}">${s.name} (₹${s.price_per_unit})</option>`;
    });
    serviceSelect.innerHTML = html;
  }
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = (item as HTMLElement).dataset.target;
      if (!target) return;

      // Remove active class from all views and add exiting class for animation
      document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('active');
        v.classList.add('exiting');
      });

      // Add active class to target view after a brief delay for exit animation
      setTimeout(() => {
        const targetView = document.getElementById(`view-${target}`);
        if (targetView) {
          targetView.classList.remove('exiting');
          targetView.classList.add('active');
        }
        
        // Remove exiting class from all views after animation completes
        document.querySelectorAll('.view-container').forEach(v => {
          v.classList.remove('exiting');
        });
      }, 300); // Match the exit animation duration

      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      const pageTitle = document.getElementById('page-title');
      if (pageTitle) pageTitle.textContent = target.charAt(0).toUpperCase() + target.slice(1);
    });
  });
}

  // Modals - FIX: Use .active class instead of display: flex
  const openModal = (id: string) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  };

  const closeModal = (modal: HTMLElement) => {
    modal.classList.remove('active');
  };

  document.getElementById('new-txn-btn')?.addEventListener('click', () => openModal('modal-transaction'));
  document.getElementById('add-partner-btn')?.addEventListener('click', () => openModal('modal-partner'));
  document.getElementById('add-service-btn')?.addEventListener('click', () => openModal('modal-service'));
  
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay') as HTMLElement;
      if (modal) closeModal(modal);
    });
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    auth.logout();
  });



  // Toggle Service selection based on transaction type
  document.querySelectorAll('input[name="txnType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const type = (e.target as HTMLInputElement).value;
      const incomeDetails = document.getElementById('income-details');
      if (incomeDetails) {
        incomeDetails.style.display = type === 'income' ? 'block' : 'none';
      }

      const partnerSelect = document.getElementById('txnPartner') as HTMLSelectElement;
      if (partnerSelect) {
        const shopOption = partnerSelect.querySelector('option[value="shop"]') as HTMLOptionElement;
        if (type === 'income' || type === 'expense') {
          if (shopOption) shopOption.style.display = '';
          partnerSelect.value = 'shop';
        } else {
          if (shopOption) shopOption.style.display = 'none';
          if (partnerSelect.value === 'shop' || partnerSelect.value === '') {
             partnerSelect.value = state.members[0]?.id || '';
          }
        }
      }
    });
  });

  // Handle service price change in transaction form
  document.getElementById('txnService')?.addEventListener('change', (e) => {
    const serviceId = (e.target as HTMLSelectElement).value;
    const service = state.services.find(s => s.id === serviceId);
    if (service) {
      const amountInput = document.getElementById('txnAmount') as HTMLInputElement;
      const descInput = document.getElementById('txnDesc') as HTMLInputElement;
      amountInput.value = String(service.price_per_unit);
      descInput.value = service.name;
    }
  });

  // Filter & Search
  document.getElementById('search-txn')?.addEventListener('input', (e) => {
    state.filters.search = (e.target as HTMLInputElement).value;
    renderTransactions();
  });
  document.getElementById('filter-type')?.addEventListener('change', (e) => {
    state.filters.type = (e.target as HTMLSelectElement).value;
    renderTransactions();
  });
  document.getElementById('filter-partner')?.addEventListener('change', (e) => {
    state.filters.partner = (e.target as HTMLSelectElement).value;
    renderTransactions();
  });
  document.getElementById('filter-date-from')?.addEventListener('change', (e) => {
    state.filters.dateFrom = (e.target as HTMLInputElement).value;
    renderTransactions();
  });
  document.getElementById('filter-date-to')?.addEventListener('change', (e) => {
    state.filters.dateTo = (e.target as HTMLInputElement).value;
    renderTransactions();
  });
  document.getElementById('export-csv-btn')?.addEventListener('click', exportTransactionsCSV);

  // Form Submissions
  document.getElementById('form-transaction')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.querySelector('input[name="txnType"]:checked') as HTMLInputElement;
    const amount = document.getElementById('txnAmount') as HTMLInputElement;
    const desc = document.getElementById('txnDesc') as HTMLInputElement;
    const partnerId = document.getElementById('txnPartner') as HTMLSelectElement;
    const serviceId = document.getElementById('txnService') as HTMLSelectElement;

    try {
      const organizationId = localStorage.getItem('organizationId');
      await api.post(`/businesses/${organizationId}/transactions`, {
        type: type.value,
        amount: Number(amount.value),
        description: desc.value,
        partner_id: partnerId.value === 'shop' || !partnerId.value ? null : partnerId.value,
        service_id: serviceId.value || null
      });

      // Refetch transactions to get populated data
      const updatedTxns = await api.get(`/businesses/${organizationId}/transactions`);
      state.transactions = updatedTxns;
      render();
      closeModal((e.target as HTMLElement).closest('.modal-overlay') as HTMLElement);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert('Failed to save transaction: ' + (error as Error).message);
    }
  });

  document.getElementById('form-partner')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('partner-email') as HTMLInputElement;
    const name = document.getElementById('partner-name') as HTMLInputElement;
    const ownership = document.getElementById('partner-ownership') as HTMLInputElement;

    try {
      const organizationId = localStorage.getItem('organizationId');
      const res = await api.post(`/businesses/${organizationId}/invite-partner`, {
        email: email.value,
        partnerName: name.value,
        ownership: Number(ownership.value)
      });

      alert(res.message);
      if (res.member) {
        state.members.push(res.member);
        render();
      }
      closeModal((e.target as HTMLElement).closest('.modal-overlay') as HTMLElement);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      const msg = error.error || error.message || 'Failed to add partner';
      alert(msg);
    }
  });

  document.getElementById('form-service')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = document.getElementById('service-name') as HTMLInputElement;
    const price = document.getElementById('service-price') as HTMLInputElement;
    const unit = document.getElementById('service-unit') as HTMLInputElement;

    try {
      setLoading(true);
      const organizationId = localStorage.getItem('organizationId');
      const editId = form.dataset.editId;

      if (editId) {
        await api.put(`/businesses/${organizationId}/services/${editId}`, {
          name: name.value,
          price_per_unit: Number(price.value),
          unit: unit.value
        });
        const idx = state.services.findIndex(s => s.id === editId);
        if (idx !== -1) {
          state.services[idx] = { ...state.services[idx], name: name.value, price_per_unit: Number(price.value), unit: unit.value };
        }
        showToast('Service updated successfully', 'success');
      } else {
        await api.post(`/businesses/${organizationId}/services`, {
          name: name.value,
          price_per_unit: Number(price.value),
          unit: unit.value
        });
        const updatedServices = await api.get(`/businesses/${organizationId}/services`);
        state.services = updatedServices;
        showToast('Service added successfully', 'success');
      }

      render();
      closeModal(form.closest('.modal-overlay') as HTMLElement);
      form.reset();
      delete form.dataset.editId;
      const heading = document.querySelector('#modal-service h3');
      if (heading) heading.textContent = 'New Service / Category';
      const submitBtn = document.querySelector('#modal-service button[type="submit"]');
      if (submitBtn) submitBtn.textContent = 'Add Category';
    } catch (error: any) {
      showToast(error.message || 'Failed to save service', 'error');
    } finally {
      setLoading(false);
    }
  });

  // Report period selector
  const reportPeriod = document.getElementById('report-period') as HTMLSelectElement;
  const reportMonth = document.getElementById('report-month') as HTMLSelectElement;
  const reportQuarter = document.getElementById('report-quarter') as HTMLSelectElement;

  if (reportPeriod) {
    reportPeriod.addEventListener('change', () => {
      const period = reportPeriod.value;
      if (reportMonth) reportMonth.style.display = period === 'monthly' ? 'block' : 'none';
      if (reportQuarter) reportQuarter.style.display = period === 'quarterly' ? 'block' : 'none';
    });
  }

  // Populate year dropdown
  const reportYear = document.getElementById('report-year') as HTMLSelectElement;
  if (reportYear) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
      const opt = document.createElement('option');
      opt.value = String(y);
      opt.textContent = String(y);
      if (y === currentYear) opt.selected = true;
      reportYear.appendChild(opt);
    }
  }

  // Populate month dropdown
  if (reportMonth) {
    const currentMonth = new Date().getMonth() + 1;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach((m, i) => {
      const opt = document.createElement('option');
      opt.value = String(i + 1);
      opt.textContent = m;
      if (i + 1 === currentMonth) opt.selected = true;
      reportMonth.appendChild(opt);
    });
  }

  // Load Report button
  document.getElementById('load-report-btn')?.addEventListener('click', async () => {
    const organizationId = localStorage.getItem('organizationId');
    if (!organizationId) return;
    
    const period = (document.getElementById('report-period') as HTMLSelectElement)?.value || 'monthly';
    const year = (document.getElementById('report-year') as HTMLSelectElement)?.value || String(new Date().getFullYear());
    const month = (document.getElementById('report-month') as HTMLSelectElement)?.value || '1';
    const quarter = (document.getElementById('report-quarter') as HTMLSelectElement)?.value || '1';

    try {
      setLoading(true);
      const query = `period=${period}&year=${year}${period === 'monthly' ? `&month=${month}` : ''}${period === 'quarterly' ? `&quarter=${quarter}` : ''}`;
      const report = await api.get(`/v1/organizations/${organizationId}/reports/profit-loss?${query}`);

      document.getElementById('pl-income')!.textContent = formatMoney(report.income);
      document.getElementById('pl-expenses')!.textContent = formatMoney(report.expenses);
      document.getElementById('pl-investments')!.textContent = formatMoney(report.investments);
      document.getElementById('pl-withdrawals')!.textContent = formatMoney(report.withdrawals);
      document.getElementById('pl-gross-profit')!.textContent = formatMoney(report.grossProfit);
      document.getElementById('pl-net-profit')!.textContent = formatMoney(report.netProfit);

      const topExpensesEl = document.getElementById('top-expenses-list');
      if (topExpensesEl) {
        if (report.topExpenses && report.topExpenses.length > 0) {
          topExpensesEl.innerHTML = report.topExpenses.map((e: any) => `
            <div class="expense-item">
              <span class="expense-category">${e.category}</span>
              <span class="expense-amount">${formatMoney(e.amount)}</span>
            </div>
          `).join('');
        } else {
          topExpensesEl.innerHTML = '<div class="empty-state">No expenses recorded.</div>';
        }
      }

      const partnerDistEl = document.getElementById('partner-distribution-list');
      if (partnerDistEl) {
        if (report.partnerBreakdown && report.partnerBreakdown.length > 0) {
          partnerDistEl.innerHTML = report.partnerBreakdown.map((p: any) => `
            <div class="partner-item">
              <span class="partner-name">${p.name} (${p.ownership_pct}%)</span>
              <span class="partner-share">${formatMoney(p.net_share)}</span>
            </div>
          `).join('');
        } else {
          partnerDistEl.innerHTML = '<div class="empty-state">No partners found.</div>';
        }
      }

      showToast('Report loaded successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to load report', 'error');
    } finally {
      setLoading(false);
    }
  });

  // Load Partner Summary button
  document.getElementById('load-partner-summary-btn')?.addEventListener('click', async () => {
    const organizationId = localStorage.getItem('organizationId');
    if (!organizationId) return;
    
    try {
      setLoading(true);
      const summary = await api.get(`/v1/organizations/${organizationId}/reports/partner-summary`);

      const tbody = document.getElementById('partner-summary-body');
      if (tbody && summary.partnerBreakdown) {
        tbody.innerHTML = summary.partnerBreakdown.map((p: any) => `
          <tr>
            <td>${p.name}</td>
            <td>${p.ownership_pct}%</td>
            <td>${formatMoney(p.total_invested)}</td>
            <td>${formatMoney(p.total_withdrawn)}</td>
            <td>${formatMoney(p.net_share)}</td>
          </tr>
        `).join('');
      }

      showToast('Partner summary loaded', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to load partner summary', 'error');
    } finally {
      setLoading(false);
    }
  });

  // Reset modal on close
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        closeModal(modal as HTMLElement);
        const form = modal.querySelector('form');
        if (form) {
          delete (form as any).dataset.editId;
          form.reset();
        }
        const heading = modal.querySelector('h3');
        if (heading && modal.id === 'modal-service') heading.textContent = 'New Service / Category';
        const submitBtn = modal.querySelector('button[type="submit"]');
        if (submitBtn && modal.id === 'modal-service') submitBtn.textContent = 'Add Category';
      }
    });
  });

   // Chart export buttons
   document.querySelectorAll('.export-chart-btn').forEach(btn => {
     btn.addEventListener('click', (e) => {
       const chartType = (e.currentTarget as HTMLElement).dataset.chart;
       if (chartType) {
         const canvas = document.getElementById(`chart-${chartType}`) as HTMLCanvasElement;
         if (canvas) {
           const link = document.createElement('a');
           link.download = `${chartType}_chart_${new Date().toISOString().split('T')[0]}.png`;
           link.href = canvas.toDataURL('image/png');
           link.click();
           showToast('Chart exported successfully', 'success');
         }
       }
     });
   });

const formatMoney = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

init();

```

```

```

```

```

```

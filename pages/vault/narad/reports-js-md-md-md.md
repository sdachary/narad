---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/reports-js-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [vite]
lines: 275
size: 9016 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [documentation, markdown, project/narad, service, vite]
---

# reports-js-md-md.md

> Service / API client module using **vite** (275 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/reports-js-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | vite |
| **Lines** | 275 |
| **Size** | 9016 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/reports-js-md.md"
project: "narad"
role: service
language: markdown
frameworks: [vite]
lines: 237
size: 8276 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, service, vite]
---

# reports-js-md.md

> Service / API client module using **vite** (237 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/reports-js-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | vite |
| **Lines** | 237 |
| **Size** | 8276 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/chitragupta/reports-js.md"
project: "narad"
role: service
language: markdown
frameworks: [vite]
lines: 199
size: 7533 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, service, vite]
---

# reports-js.md

> Service / API client module using **vite** (199 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/chitragupta/reports-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | vite |
| **Lines** | 199 |
| **Size** | 7533 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/pages/services/reports.js"
project: "chitragupta"
role: service
language: javascript
frameworks: [vite]
lines: 160
size: 6730 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [code, javascript, project/chitragupta, service, vite]
---

# reports.js

> Service / API client module using **vite** (160 lines).

**Key exports:** `initReportsPage`, `renderReportsPage`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/pages/services/reports.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | vite |
| **Lines** | 160 |
| **Size** | 6730 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

[[api-ts]]

## 📄 Content

```javascript
import { api } from '../../ts/api.ts';

export function initReportsPage(app) {
  app.reports = {
    getProfitLoss: (orgId, params) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/v1/organizations/${orgId}/reports/profit-loss?${query}`);
    },
    getPartnerSummary: (orgId) => api.get(`/v1/organizations/${orgId}/reports/partner-summary`),
    getGstReport: (orgId, quarter, year) => api.get(`/v1/organizations/${orgId}/reports/tax/gst?quarter=${quarter}&year=${year}`),
    getTaxSummary: (orgId, year) => api.get(`/v1/organizations/${orgId}/reports/tax/summary?year=${year}`),
    exportTaxReport: (orgId, format, year) => api.get(`/v1/organizations/${orgId}/reports/tax/export?format=${format}&year=${year}`),
    getTdsEntries: (orgId) => api.get(`/v1/organizations/${orgId}/tds`),
    createTdsEntry: (orgId, data) => api.post(`/v1/organizations/${orgId}/tds`, data),
    autoCategorizeServices: (orgId) => api.post(`/v1/organizations/${orgId}/tax/categorize`, {}),
    getAuditLogs: (orgId, params) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/v1/organizations/${orgId}/audit-logs?${query}`);
    },
  };
}

export function renderReportsPage() {
  const container = document.createElement('div');
  container.className = 'view-container';
  container.id = 'view-reports';
  container.innerHTML = `
    <div class="report-tabs glassmorphism">
      <button class="tab-btn active" data-tab="profit-loss">P&L Report</button>
      <button class="tab-btn" data-tab="gst">GST Reports</button>
      <button class="tab-btn" data-tab="tds">TDS Tracking</button>
      <button class="tab-btn" data-tab="audit">Audit Logs</button>
    </div>
    
    <div id="tab-profit-loss" class="tab-content"></div>
    
    <div id="tab-gst" class="tab-content" style="display:none;"></div>
    
    <div id="tab-tds" class="tab-content" style="display:none;"></div>
    
    <div id="tab-audit" class="tab-content" style="display:none;">
      <div class="report-controls glassmorphism">
        <div class="report-filters">
          <select id="audit-action" class="glass-input">
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="switch_org">Switch Org</option>
            <option value="invite">Invite</option>
          </select>
          <select id="audit-entity" class="glass-input">
            <option value="">All Entities</option>
            <option value="transaction">Transaction</option>
            <option value="service">Service</option>
            <option value="member">Member</option>
            <option value="organization">Organization</option>
            <option value="user">User</option>
          </select>
          <input type="date" id="audit-start" class="glass-input" placeholder="Start Date">
          <input type="date" id="audit-end" class="glass-input" placeholder="End Date">
          <button class="btn btn-primary" id="load-audit-btn">
            <span class="material-icons-round">search</span> Load
          </button>
        </div>
      </div>
      
      <div class="audit-list glassmorphism" id="audit-logs-list">
        <div class="empty-state">No audit logs found.</div>
      </div>
      <div class="pagination" id="audit-pagination"></div>
    </div>
  `;
  return container;
}

export async function loadAuditLogs(orgId, params = {}) {
  const list = document.getElementById('audit-logs-list');
  const pagination = document.getElementById('audit-pagination');
  if (!list) return;
  
  try {
    const { logs, total, limit, offset } = await window.app.reports.getAuditLogs(orgId, params);
    if (!logs || logs.length === 0) {
      list.innerHTML = '<div class="empty-state">No audit logs found.</div>';
      pagination.innerHTML = '';
      return;
    }
    
    list.innerHTML = `
      <table class="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Entity</th>
            <th>IP Address</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map(log => `
            <tr>
              <td>${new Date(log.created_at).toLocaleString()}</td>
              <td>${log.user?.email || log.user?.full_name || 'System'}</td>
              <td><span class="action-badge action-${log.action}">${log.action}</span></td>
              <td>${log.entity_type}</td>
              <td>${log.ip_address || '-'}</td>
              <td>
                ${renderAuditDiff(log.old_values, log.new_values)}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    pagination.innerHTML = `
      <button class="btn btn-sm" ${currentPage === 1 ? 'disabled' : ''} onclick="loadAuditLogsPage(${currentPage - 1})">Previous</button>
      <span>Page ${currentPage} of ${totalPages}</span>
      <button class="btn btn-sm" ${currentPage >= totalPages ? 'disabled' : ''} onclick="loadAuditLogsPage(${currentPage + 1})">Next</button>
    `;
  } catch (err) {
    list.innerHTML = `<div class="empty-state">Error loading audit logs: ${err.message}</div>`;
  }
}

function renderAuditDiff(oldValues, newValues) {
  if (!oldValues && !newValues) return '-';
  
  let diff = '';
  if (oldValues && newValues) {
    const changes = [];
    for (const key of Object.keys(newValues)) {
      if (JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])) {
        changes.push(`<strong>${key}</strong>: ${JSON.stringify(oldValues[key])} → ${JSON.stringify(newValues[key])}`);
      }
    }
    diff = changes.join('<br>');
  } else if (newValues) {
    diff = Object.entries(newValues).map(([k, v]) => `<strong>${k}</strong>: ${JSON.stringify(v)}`).join('<br>');
  } else if (oldValues) {
    diff = Object.entries(oldValues).map(([k, v]) => `<strong>${k}</strong>: ${JSON.stringify(v)}`).join('<br>');
  }
  
  return diff ? `<button class="btn btn-sm" onclick="this.innerHTML = this.getAttribute('data-diff'); this.removeAttribute('onclick');" data-diff="${diff}">View</button>` : '-';
}

export async function loadProfitLossReport(orgId, params) {
  return window.app.reports.getGstReport(orgId, params.Quarter, params.year);
}

export async function loadPartnerSummary(orgId) {
  return window.app.reports.getPartnerSummary(orgId);
}
```

```

```

```

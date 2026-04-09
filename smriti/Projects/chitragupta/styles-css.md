---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/src/css/styles.css"
project: "chitragupta"
role: service
language: css
frameworks: [vite]
lines: 1236
size: 26715 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, css, project/chitragupta, service, vite]
---

# styles.css

> Service / API client module using **vite** (1236 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/src/css/styles.css` |
| **Role** | service |
| **Language** | css |
| **Frameworks** | vite |
| **Lines** | 1236 |
| **Size** | 26715 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

:root {
  --bg: #061423; /* Deep Zenith */
  --surface: rgba(19, 32, 48, 0.4);
  --surface-hi: rgba(40, 54, 70, 0.6);
  --border: rgba(214, 228, 249, 0.08); /* Ghost Border */
  --border-hi: rgba(214, 228, 249, 0.15);
  
  --primary: #ffbf70; /* Refined Gold */
  --primary-glow: rgba(255, 191, 112, 0.2);
  --primary-gradient: linear-gradient(135deg, #ffbf70, #e0a458);
  --accent: #9bd0ff; /* Celestial Blue */
  
  --text: #d6e4f9;
  --text-dim: #a4b5cc;
  --text-muted: #6b7a8f;
  
  --success: #81c784;
  --danger: #ffb4ab;
  --warning: #ffcc80;

  --radius: 12px;
  --glass: rgba(6, 20, 35, 0.45);
  --blur: blur(24px);
  --shadow-sm: 0 8px 16px rgba(0,0,0,0.15);
  --shadow-md: 0 16px 40px rgba(0,0,0,0.3);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Sora', system-ui, sans-serif;
  background-color: var(--bg);
  background-image: 
    radial-gradient(circle at 20% 10%, rgba(16, 185, 129, 0.05), transparent 30%),
    radial-gradient(circle at 80% 90%, rgba(56, 189, 248, 0.03), transparent 30%);
  color: var(--text);
  min-height: 100vh;
  max-width: 100vw;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.glassmorphism {
  background: var(--glass);
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.app-container { display: flex; min-height: 100vh; }

/* ── SIDEBAR ── */
.sidebar {
  width: 280px;
  min-width: 280px;
  background: #020617;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 40px 24px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 48px;
  padding: 0 12px;
}
.brand-icon {
  font-size: 32px;
  color: var(--primary);
  filter: drop-shadow(0 0 12px var(--primary-glow));
}
.brand h1 {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links { display: flex; flex-direction: column; gap: 4px; flex-grow: 1; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
  color: var(--text-dim);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  border-radius: var(--radius);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  transform: translateX(4px);
}
.nav-item.active {
  background: rgba(16, 185, 129, 0.08);
  color: var(--primary);
  border: 1px solid var(--border-hi);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.nav-item .material-icons-round { font-size: 22px; }

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #8a2be2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
}
.avatar.alt {
  background: linear-gradient(135deg, var(--success), #20b2aa);
}
.avatar.large {
  width: 48px;
  height: 48px;
  font-size: 16px;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-weight: 600;
  font-size: 14px;
}
.user-role {
  font-size: 12px;
  color: var(--text-muted);
}

/* ── MAIN CONTENT ── */
.main-content {
  flex-grow: 1;
  padding: 40px 60px;
  background: var(--bg);
  min-width: 0; /* Prevention of flex-item blowout */
  overflow-x: hidden;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}
.top-header h2 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -1px;
}

/* Stat Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
  margin-bottom: 48px;
}
.stat-card {
  padding: 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.stat-card:hover {
  background: var(--surface-hi);
  border-color: var(--primary);
  transform: translateY(-6px) scale(1.02);
  box-shadow: var(--shadow-md);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.stat-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.stat-icon {
  font-size: 22px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.05);
}
.stat-icon.blue { color: var(--accent); }
.stat-icon.green { color: var(--success); }
.stat-icon.orange { color: var(--warning); }

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -2px;
  margin-bottom: 12px;
  background: linear-gradient(to bottom, #fff, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stat-subtitle {
  font-size: 14px;
  color: var(--text-dim);
  font-weight: 500;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.stat-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.stat-icon {
  padding: 10px;
  border-radius: 12px;
  background: var(--surface-highest);
}
.stat-icon.blue { color: var(--tertiary); background: rgba(155, 208, 255, 0.08); }
.stat-icon.green { color: var(--success); background: rgba(26, 127, 55, 0.08); }
.stat-icon.orange { color: var(--warning); background: rgba(224, 164, 88, 0.08); }

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 38px;
  font-weight: 700;
  letter-spacing: -2px;
  margin-bottom: 8px;
  color: var(--text-main);
}
.stat-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

/* Settlement Card */
.settlement-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  margin-bottom: 40px;
  background: linear-gradient(135deg, rgba(46, 160, 67, 0.1), rgba(88, 166, 255, 0.05));
  border-color: rgba(46, 160, 67, 0.2);
}
.settlement-card.needs-settlement {
  background: linear-gradient(135deg, rgba(210, 153, 34, 0.1), rgba(248, 81, 73, 0.05));
  border-color: rgba(210, 153, 34, 0.2);
}
.settlement-info h3 {
  font-size: 18px;
  margin-bottom: 4px;
}
.settlement-info p {
  color: var(--text-muted);
  font-size: 14px;
}

/* ────────────────────────────────────────────────────────── */
/* Transactions List */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.view-all {
  color: var(--primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}
.view-all:hover {
  text-decoration: underline;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.txn-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s;
}
.txn-item:last-child {
  border-bottom: none;
}
.txn-item:hover {
  background: rgba(255, 255, 255, 0.02);
}
.txn-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.txn-icon.income { background: rgba(46, 160, 67, 0.1); color: var(--success); }
.txn-icon.expense { background: rgba(248, 81, 73, 0.1); color: var(--danger); }
.txn-icon.investment { background: rgba(88, 166, 255, 0.1); color: var(--primary); }
.txn-icon.withdrawal { background: rgba(210, 153, 34, 0.1); color: var(--warning); }
.txn-icon.settlement { background: rgba(138, 43, 226, 0.1); color: #8a2be2; }

.txn-details h4 {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 2px;
}
.txn-details p {
  font-size: 12px;
  color: var(--text-muted);
}
.txn-partner {
  font-size: 12px;
  padding: 4px 10px;
  background: var(--secondary);
  border-radius: 20px;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}
.txn-amount {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 16px;
  text-align: right;
  letter-spacing: -0.5px;
}
.txn-amount.income { color: var(--tertiary); }
.txn-amount.expense { color: var(--text-main); }
.txn-amount.investment { color: var(--primary); }
.txn-amount.withdrawal { color: var(--warning); }
.txn-amount.settlement { color: var(--tertiary); }

.txn-service-tag {
  font-size: 11px;
  background: var(--surface-highest);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 6px;
  margin-left: 8px;
  font-weight: 700;
  border: 1px solid var(--border-color);
}

.empty-state {
  padding: 64px;
  text-align: center;
  color: var(--text-muted);
  font-size: 15px;
}

/* ────────────────────────────────────────────────────────── */
/* Partners View */
.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}
.partner-card {
  padding: 32px;
}
.partner-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}
.partner-name-input {
  background: transparent;
  border: border-color;
  border-bottom: 1px dashed var(--text-muted);
  color: var(--text-main);
  font-family: inherit;
  font-size: 20px;
  font-weight: 600;
  padding: 4px 0;
  width: 100%;
  outline: none;
  transition: all 0.2s;
}
.partner-name-input:focus {
  border-bottom-color: var(--primary);
}
.partner-role {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}
.partner-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.p-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}
.p-stat:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.p-stat.highlight {
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  border-bottom: none;
}
.p-label {
  font-size: 14px;
  color: var(--text-muted);
}
.p-val {
  font-size: 16px;
  font-weight: 600;
}
.p-val.green { color: var(--success); }
.p-val.orange { color: var(--warning); }
.p-stat.highlight .p-val {
  font-size: 24px;
  color: var(--text-main);
}

/* ────────────────────────────────────────────────────────── */
/* Forms & Modals */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(6, 20, 35, 0.7);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1000;
}
.modal-overlay.active {
  opacity: 1;
  pointer-events: all;
}
.modal-content {
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 32px;
    background: var(--glass);
    backdrop-filter: var(--blur);
    -webkit-backdrop-filter: var(--blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    transform: translateY(30px) scale(0.93);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Enhanced modal animation */
.modal-overlay.active .modal-content {
    transform: translateY(0) scale(1);
}

/* Subtle modal entrance delay for layered effect */
.modal-overlay.active .modal-content {
    animation: modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.93);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* ────────────────────────────────────────────────────────── */
/* Responsive Media Queries */
@media (max-width: 992px) {
  .sidebar {
    width: 240px;
  }
}

@media (max-width: 992px) {
  .main-content {
    padding: 32px 24px;
  }
  .top-header {
    margin-bottom: 32px;
  }
}

@media (max-width: 768px) {
  .app-container {
    padding-bottom: 80px; /* Space for bottom nav */
  }
  
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    top: auto;
    width: 100%;
    height: auto;
    min-width: 100%;
    flex-direction: row;
    padding: 12px 16px;
    background: #020617;
    border-top: 1px solid var(--border-hi);
    border-right: none;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.4);
    justify-content: center;
  }
  
  .brand, .user-profile {
    display: none; /* Hide brand/profile on mobile bottom nav */
  }
  
  .nav-links {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    margin: 0;
  }
  
  .nav-item {
    flex-direction: column;
    padding: 10px;
    gap: 4px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex: 1;
    border-radius: 8px;
  }
  
  .nav-item .material-icons-round {
    font-size: 24px;
  }
  
  .nav-item:hover {
    transform: none;
  }

  .main-content {
    padding: 24px 16px;
  }
  .top-header h2 {
    font-size: 24px;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .txn-item {
    grid-template-columns: auto 1fr auto;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 20px;
  }
  .stat-value {
    font-size: 28px;
  }
}
.modal-overlay.active .modal-content {
  transform: translateY(0) scale(1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
/* ── BUTTONS (The Missing Piece) ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: var(--radius);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  font-family: 'Sora', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: var(--primary-gradient);
  color: #061423;
  box-shadow: 0 4px 15px var(--primary-glow);
}
.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px var(--primary-glow);
  filter: brightness(1.05);
}
.btn-primary:active { transform: translateY(0) scale(0.98); }

.btn-secondary {
  background: var(--surface-hi);
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
  color: var(--text);
  border: 1px solid var(--border-hi);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary);
  color: var(--primary);
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.icon-btn:hover {
  background: var(--surface-hi);
  color: var(--primary);
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
}

.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
  font-weight: 500;
}
.glass-input {
  width: 100%;
  padding: 14px 18px;
  background: var(--surface-low);
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-main);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}
.glass-input:focus {
  border-color: var(--primary);
  background: var(--surface-high);
  box-shadow: 0 0 0 4px var(--primary-glow);
}
.glass-input.mono {
  font-family: 'JetBrains Mono', monospace;
}
.glass-input option {
  background: var(--secondary);
  color: var(--text-main);
}

.type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.type-radio {
  cursor: pointer;
}
.type-radio input {
  display: none;
}
.type-radio span {
  display: block;
  text-align: center;
  padding: 10px;
  background: var(--secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}
.type-radio input:checked + span {
  background: rgba(88, 166, 255, 0.1);
  border-color: var(--primary);
  color: var(--primary);
}

.hint-text {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}
.center-actions {
  justify-content: center;
  margin-top: 24px;
}

.text-center {
  text-align: center;
}
.huge-icon {
  font-size: 64px;
  color: var(--primary);
  margin-bottom: 16px;
  background: rgba(88, 166, 255, 0.1);
  padding: 24px;
  border-radius: 50%;
}
.settle-desc {
  color: var(--text-muted);
  font-size: 14px;
  margin-top: 12px;
}

/* ────────────────────────────────────────────────────────── */
/* View System */
.view-container {
    display: none;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, transform;
    contain: layout style;
}
.view-container.active {
    display: block;
    opacity: 1;
    transform: translateY(0);
}

/* Enhanced transition for smoother view switching with staggered effect */
@keyframes fadeInSmooth {
    from { 
        opacity: 0; 
        transform: translateY(15px) scale(0.98);
    }
    to { 
        opacity: 1; 
        transform: translateY(0) scale(1);
    }
}

@keyframes fadeOutSmooth {
    from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    to {
        opacity: 0;
        transform: translateY(10px) scale(0.99);
    }
}

/* View container animations */
.view-container.active {
    animation: fadeInSmooth 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Add exit animation for outgoing views */
.view-container.exiting {
    animation: fadeOutSmooth 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Prevent layout shifts during transitions */
.app-container {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
}

/* Ensure smooth height transitions */
.view-container {
    height: auto;
    min-height: 0;
}

.filter-bar {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 24px;
}
.filter-bar .glass-input {
  width: auto;
  min-width: 200px;
}

/* Data Table container safety */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 24px;
}
.data-table {
  width: 100%;
  min-width: 600px; /* Force internal scroll if too small */
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}
.data-table th {
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  color: var(--text-muted);
  font-weight: 500;
  border-bottom: 1px solid var(--border-color);
}
.data-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
}
.data-table tr:last-child td {
  border-bottom: none;
}
.data-table tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  z-index: 2000;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
}
.toast.show {
  transform: translateY(0);
  opacity: 1;
}
.toast-success {
  background: var(--success);
  color: #fff;
}
.toast-error {
  background: var(--danger);
  color: #fff;
}

/* Enhanced Loading States */
.loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
}

/* Loading Skeleton for cards and containers */
.loading-skeleton {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
    border-radius: var(--radius);
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

/* Pulse loading indicator */
.pulse-loader {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 191, 112, 0.3);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: pulseSpin 1.2s ease-in-out infinite;
}

@keyframes pulseSpin {
    0% { transform: scale(0.8); opacity: 0.6; }
    50% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0.6; }
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ────────────────────────────────────────────────────────── */
/* Reports View */
.report-controls {
  padding: 20px;
  margin-bottom: 24px;
}
.report-filters {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
.report-filters .glass-input {
  min-width: 120px;
}

.report-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.report-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  padding: 24px;
  text-align: center;
}
.metric-card h4 {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.metric-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}
.metric-label {
  font-size: 12px;
  color: var(--text-muted);
}

.report-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.report-details-grid .glassmorphism {
  padding: 20px;
}
.report-details-grid h4 {
  font-size: 16px;
  margin-bottom: 16px;
  color: var(--text-main);
}

.expense-item, .partner-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}
.expense-item:last-child, .partner-item:last-child {
  border-bottom: none;
}
.expense-category, .partner-name {
  font-weight: 500;
}
.expense-amount, .partner-share {
  font-weight: 600;
  color: var(--primary);
}

/* Dashboard Charts */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.chart-card {
  padding: 32px;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  background: var(--surface-low);
  border: none;
  border-radius: 20px;
  transition: all 0.3s;
}
.chart-card:hover {
  background: var(--surface-high);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

.chart-header .export-chart-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.chart-header .export-chart-btn:hover {
  background: var(--secondary);
  color: var(--text-main);
}

.chart-container {
  flex: 1;
  position: relative;
  min-height: 240px;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    min-height: 280px;
  }
}

/* Audit Logs */
.audit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.audit-table th,
.audit-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.audit-table th {
  background: var(--secondary);
  font-weight: 600;
  color: var(--text-main);
}

.audit-table tr:hover {
  background: rgba(88, 166, 255, 0.05);
}

.action-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.action-create { background: #10b981; color: #fff; }
.action-update { background: #3b82f6; color: #fff; }
.action-delete { background: #ef4444; color: #fff; }
.action-login { background: #8b5cf6; color: #fff; }
.action-logout { background: #6b7280; color: #fff; }
.action-switch_org { background: #f59e0b; color: #fff; }
.action-invite { background: #ec4899; color: #fff; }

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 0;
  margin-top: 24px;
  border-top: 1px solid var(--border);
}

.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
  background: rgba(255, 191, 112, 0.05);
}

.page-btn.active {
  background: var(--primary-gradient);
  color: #061423;
  border: none;
  box-shadow: 0 4px 15px var(--primary-glow);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-ellipsis {
  color: var(--text-muted);
  font-weight: 700;
  letter-spacing: 2px;
}

.page-info {
  margin-left: 16px;
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

```

---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/pages/restore.html"
project: "vishwakarma"
role: page
language: html
frameworks: [docker]
lines: 648
size: 15551 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, docker, html, page, project/vishwakarma]
---

# restore.html

> Web page using **docker** (648 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/pages/restore.html` |
| **Role** | page |
| **Language** | html |
| **Frameworks** | docker |
| **Lines** | 648 |
| **Size** | 15551 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>One-Click Restore — Gold Vault</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');

:root {
  --bg: #08090c;
  --surface: #0e0f14;
  --card: #12131a;
  --border: #1a1b24;
  --border2: #22232f;
  --green: #00e5a0;
  --blue: #4d9fff;
  --yellow: #f5c842;
  --red: #ff4560;
  --text: #e0e2f0;
  --muted: #42445e;
  --muted2: #666884;
}

* { margin: 0; padding: 0; box-sizing:border-box; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Mono', monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2.5rem 1rem;
}

body::before {
  content:'';
  position:fixed; inset:0;
  background-image: radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events:none; z-index:0;
}

.container {
  width: 100%;
  max-width: 680px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 3rem;
  position: relative;
  z-index: 10;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.icon {
  width: 64px;
  height: 64px;
  background: rgba(245, 200, 66, 0.1);
  border: 1px solid rgba(245, 200, 66, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 1.5rem;
}

h1 {
  font-family: 'Syne', sans-serif;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 14px;
  color: var(--muted2);
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 0;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border2);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Form */
.client-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted2);
}

.input-field {
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 12px;
  padding: 1rem;
  font-family: 'DM Mono', monospace;
  font-size: 14px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: var(--green);
}

.input-field::placeholder {
  color: var(--muted);
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  background: var(--green);
  color: #08090c;
  border: none;
  border-radius: 12px;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover:not(:disabled) {
  background: #00ffb3;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 229, 160, 0.3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--card);
  border: 1px solid var(--border2);
  color: var(--text);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--border2);
  transform: translateY(-2px);
  box-shadow: none;
}

.btn-danger {
  background: rgba(255, 69, 96, 0.1);
  border: 1px solid rgba(255, 69, 96, 0.3);
  color: var(--red);
}

.btn-danger:hover:not(:disabled) {
  background: rgba(255, 69, 96, 0.2);
  border-color: var(--red);
  box-shadow: 0 8px 24px rgba(255, 69, 96, 0.2);
}

/* Backup List */
.backup-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0;
  max-height: 300px;
  overflow-y: auto;
}

.backup-list::-webkit-scrollbar {
  width: 4px;
}

.backup-list::-webkit-scrollbar-thumb {
  background: var(--border2);
  border-radius: 2px;
}

.backup-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.backup-item:hover {
  border-color: var(--muted2);
}

.backup-item.selected {
  border-color: var(--yellow);
  background: rgba(245, 200, 66, 0.05);
}

.backup-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.backup-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
}

.backup-meta {
  font-size: 11px;
  color: var(--muted2);
}

.backup-check {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: transparent;
  transition: all 0.15s;
}

.backup-item.selected .backup-check {
  background: var(--yellow);
  border-color: var(--yellow);
  color: #08090c;
}

/* Progress */
.progress-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.progress-title {
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--card);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--green), var(--yellow));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-status {
  font-size: 12px;
  color: var(--muted2);
  margin-top: 0.75rem;
}

.progress-log {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
  font-size: 11px;
  line-height: 1.6;
}

.log-entry {
  padding: 0.25rem 0;
  color: var(--muted2);
  border-bottom: 1px solid var(--border);
}

.log-entry:last-child {
  border-bottom: none;
}

.log-entry.success {
  color: var(--green);
}

.log-entry.error {
  color: var(--red);
}

.log-entry.info {
  color: var(--blue);
}

/* Messages */
.message {
  padding: 1rem;
  border-radius: 12px;
  font-size: 13px;
  margin-bottom: 1rem;
}

.message.error {
  background: rgba(255, 69, 96, 0.1);
  border: 1px solid rgba(255, 69, 96, 0.2);
  color: var(--red);
}

.message.success {
  background: rgba(0, 229, 160, 0.1);
  border: 1px solid rgba(0, 229, 160, 0.2);
  color: var(--green);
}

.message.info {
  background: rgba(77, 159, 255, 0.1);
  border: 1px solid rgba(77, 159, 255, 0.2);
  color: var(--blue);
}

/* Footer */
.footer-note {
  margin-top: 2rem;
  text-align: center;
  font-size: 11px;
  color: var(--muted);
}

@media(max-width: 600px) {
  .container { padding: 2rem 1.5rem; border-radius: 16px; }
}
</style>
</head>
<body>

<div class="container" id="app">
  <div class="header">
    <div class="icon">↩️</div>
    <h1>One-Click Restore</h1>
    <div class="subtitle">Restore your cloud from a backup</div>
  </div>

  <div id="step-client" class="client-input">
    <div class="input-group">
      <label class="input-label">Client ID</label>
      <input type="text" id="client-id" class="input-field" placeholder="Enter your client ID (e.g., anilkumar)" />
    </div>
    <button class="btn" onclick="fetchBackups()">
      <span>🔍</span> Find Backups
    </button>
  </div>

  <div id="step-loading" class="loading-state" style="display: none;">
    <div class="spinner"></div>
    <div class="subtitle">Searching for backups...</div>
  </div>

  <div id="step-empty" class="empty-state" style="display: none;">
    <div class="subtitle">No backups found for this client ID</div>
    <button class="btn btn-secondary" onclick="resetView()">
      <span>←</span> Try Another Client
    </button>
  </div>

  <div id="step-backups" style="display: none;">
    <div class="subtitle" style="margin-bottom: 1rem;">Select a backup to restore</div>
    <div class="backup-list" id="backup-list"></div>
    <button class="btn" id="btn-restore" onclick="startRestore()" disabled>
      <span>↩️</span> Restore Selected Backup
    </button>
    <button class="btn btn-secondary" onclick="resetView()" style="margin-top: 0.75rem;">
      <span>←</span> Back
    </button>
  </div>

  <div id="step-progress" style="display: none;">
    <div class="progress-section">
      <div class="progress-title">
        <span id="progress-icon">⏳</span>
        <span id="progress-title-text">Restoring...</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
      </div>
      <div class="progress-status" id="progress-status">Initializing restore...</div>
      <div class="progress-log" id="progress-log"></div>
    </div>
  </div>

  <div id="step-success" class="empty-state" style="display: none;">
    <div class="icon" style="background: rgba(0, 229, 160, 0.1); border-color: rgba(0, 229, 160, 0.2);">✅</div>
    <h1>Restore Complete!</h1>
    <div class="subtitle" id="success-message">Your cloud has been restored successfully.</div>
    <button class="btn" onclick="resetView()">
      <span>↩️</span> Restore Another Client
    </button>
  </div>

  <div id="step-error" class="error-state" style="display: none;">
    <div class="icon" style="background: rgba(255, 69, 96, 0.1); border-color: rgba(255, 69, 96, 0.2);">✕</div>
    <h1>Restore Failed</h1>
    <div class="subtitle" id="error-message">An error occurred during restore.</div>
    <button class="btn btn-secondary" onclick="resetView()">
      <span>←</span> Try Again
    </button>
  </div>

  <div class="footer-note">Gold Vault Private Cloud Security</div>
</div>

<script>
const workerUrl = window.location.origin;
let selectedBackup = null;
let restoreInterval = null;

function showStep(stepId) {
  const steps = ['step-client', 'step-loading', 'step-empty', 'step-backups', 'step-progress', 'step-success', 'step-error'];
  steps.forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById(stepId).style.display = '';
}

function showMessage(type, message) {
  const app = document.getElementById('app');
  const existing = app.querySelector('.message');
  if (existing) existing.remove();
  
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.textContent = message;
  app.insertBefore(msg, app.querySelector('.footer-note'));
}

async function fetchBackups() {
  const clientId = document.getElementById('client-id').value.trim();
  if (!clientId) {
    showMessage('error', 'Please enter a client ID');
    return;
  }

  showStep('step-loading');
  
  try {
    const response = await fetch(`${workerUrl}/api/backups/${clientId}`);
    const data = await response.json();
    
    if (!response.ok) {
      showStep('step-empty');
      showMessage('error', data.error || 'Failed to fetch backups');
      return;
    }
    
    if (!data.backups || data.backups.length === 0) {
      showStep('step-empty');
      return;
    }
    
    renderBackups(data.backups);
    showStep('step-backups');
  } catch (error) {
    console.error('Error fetching backups:', error);
    showStep('step-empty');
    showMessage('error', 'Network error. Please check your connection.');
  }
}

function renderBackups(backups) {
  const list = document.getElementById('backup-list');
  list.innerHTML = '';
  
  backups.forEach((backup, index) => {
    const item = document.createElement('div');
    item.className = 'backup-item';
    item.dataset.index = index;
    item.onclick = () => selectBackup(backup, item);
    
    const date = new Date(backup.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    item.innerHTML = `
      <div class="backup-info">
        <div class="backup-name">${backup.name}</div>
        <div class="backup-meta">${date} · ${formatSize(backup.size)}</div>
      </div>
      <div class="backup-check">✓</div>
    `;
    
    list.appendChild(item);
  });
}

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i];
}

function selectBackup(backup, element) {
  document.querySelectorAll('.backup-item').forEach(item => {
    item.classList.remove('selected');
  });
  element.classList.add('selected');
  selectedBackup = backup;
  document.getElementById('btn-restore').disabled = false;
}

async function startRestore() {
  if (!selectedBackup) return;
  
  const clientId = document.getElementById('client-id').value.trim();
  
  showStep('step-progress');
  updateProgress(0, 'Initiating restore...');
  addLogEntry('info', `Starting restore for backup: ${selectedBackup.name}`);
  
  try {
    const response = await fetch(`${workerUrl}/api/restore/${clientId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backupId: selectedBackup.id })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      addLogEntry('error', data.error || 'Restore failed');
      showStep('step-error');
      document.getElementById('error-message').textContent = data.error || 'An error occurred during restore.';
      return;
    }
    
    addLogEntry('success', 'Restore initiated successfully');
    updateProgress(100, 'Restore complete!');
    showStep('step-success');
    document.getElementById('success-message').textContent = `Restored from backup: ${selectedBackup.name}`;
    
  } catch (error) {
    console.error('Restore error:', error);
    addLogEntry('error', error.message);
    showStep('step-error');
    document.getElementById('error-message').textContent = 'Network error. Please check your connection.';
  }
}

function updateProgress(percent, status) {
  document.getElementById('progress-fill').style.width = percent + '%';
  document.getElementById('progress-status').textContent = status;
  
  if (percent < 30) {
    document.getElementById('progress-icon').textContent = '⏳';
  } else if (percent < 70) {
    document.getElementById('progress-icon').textContent = '⚙️';
  } else if (percent < 100) {
    document.getElementById('progress-icon').textContent = '🔄';
  } else {
    document.getElementById('progress-icon').textContent = '✅';
  }
}

function addLogEntry(type, message) {
  const log = document.getElementById('progress-log');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function resetView() {
  selectedBackup = null;
  document.getElementById('client-id').value = '';
  document.getElementById('btn-restore').disabled = true;
  document.getElementById('backup-list').innerHTML = '';
  document.getElementById('progress-log').innerHTML = '';
  
  const app = document.getElementById('app');
  const existing = app.querySelector('.message');
  if (existing) existing.remove();
  
  showStep('step-client');
}
</script>

</body>
</html>

```

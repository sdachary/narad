---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/credential-portal-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker]
lines: 630
size: 17440 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, docker, documentation, markdown, project/narad]
---

# credential-portal-html-md.md

> Authentication / authorization module using **docker** (630 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/credential-portal-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 630 |
| **Size** | 17440 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/credential-portal-html.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker]
lines: 592
size: 16650 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, docker, documentation, markdown, project/narad]
---

# credential-portal-html.md

> Authentication / authorization module using **docker** (592 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/credential-portal-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 592 |
| **Size** | 16650 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/pages/credential-portal.html"
project: "vishwakarma"
role: auth
language: html
frameworks: [docker]
lines: 554
size: 15906 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [auth, code, docker, html, project/vishwakarma]
---

# credential-portal.html

> Authentication / authorization module using **docker** (554 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/pages/credential-portal.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | docker |
| **Lines** | 554 |
| **Size** | 15906 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credential Download — Gold Vault</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 100%;
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }

    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .header p {
      font-size: 13px;
      opacity: 0.9;
    }

    .body {
      padding: 32px 24px;
    }

    .step {
      margin-bottom: 24px;
    }

    .step-title {
      font-size: 13px;
      font-weight: 700;
      color: #667eea;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    .step-content {
      font-size: 14px;
      color: #555;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .input-group {
      margin-bottom: 16px;
    }

    label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }

    input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 24px;
    }

    button {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .message {
      padding: 12px 14px;
      border-radius: 6px;
      font-size: 13px;
      margin-bottom: 16px;
      display: none;
    }

    .message.error {
      background: #fee2e2;
      border: 1px solid #fecaca;
      color: #991b1b;
      display: block;
    }

    .message.success {
      background: #dcfce7;
      border: 1px solid #bbf7d0;
      color: #166534;
      display: block;
    }

    .message.info {
      background: #dbeafe;
      border: 1px solid #bfdbfe;
      color: #1e40af;
      display: block;
    }

    .divider {
      height: 1px;
      background: #eee;
      margin: 24px 0;
    }

    .credentials-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
      display: none;
    }

    .cred-item {
      margin-bottom: 12px;
      font-size: 13px;
    }

    .cred-item:last-child {
      margin-bottom: 0;
    }

    .cred-label {
      color: #6b7280;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .cred-value {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 8px 10px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #1f2937;
      word-break: break-all;
      position: relative;
    }

    .cred-copy {
      position: absolute;
      top: 8px;
      right: 8px;
      background: white;
      border: 1px solid #d1d5db;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      cursor: pointer;
      color: #667eea;
      font-weight: 600;
      transition: all 0.2s;
    }

    .cred-copy:hover {
      background: #f3f4f6;
      border-color: #667eea;
    }

    .alert {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 6px;
      padding: 12px 14px;
      font-size: 13px;
      color: #92400e;
      margin-top: 16px;
      line-height: 1.6;
    }

    .alert strong {
      color: #b45309;
    }

    .footer {
      border-top: 1px solid #f3f4f6;
      padding: 16px 24px;
      background: #f9fafb;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #f3f4f6;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .hidden {
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>☁️ Your Cloud Credentials</h1>
      <p>Gold Vault — Secure Credential Delivery</p>
    </div>

    <div class="body">
      <div id="message" class="message"></div>

      <!-- Step 1: Enter Client ID -->
      <div id="step1" class="step">
        <div class="step-title">Step 1: Verify Client ID</div>
        <div class="step-content">
          Enter your unique client ID to retrieve your cloud credentials and SSH key. This ID was provided when your cloud was provisioned.
        </div>
        <div class="input-group">
          <label for="clientId">Client ID</label>
          <input
            type="text"
            id="clientId"
            placeholder="e.g., deepak"
            autocomplete="off"
          />
        </div>
        <div class="button-group">
          <button class="btn-primary" onclick="retrieveClientData()">
            Retrieve Credentials
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div id="divider1" class="divider hidden"></div>

      <!-- Step 2: Show Client Data -->
      <div id="step2" class="step hidden">
        <div class="step-title">Step 2: Your Cloud Details</div>
        <div class="credentials-box" id="credentialsBox">
          <div class="cred-item">
            <div class="cred-label">Company Name</div>
            <div class="cred-value" id="companyName"></div>
          </div>
          <div class="cred-item">
            <div class="cred-label">Public IP Address</div>
            <div class="cred-value">
              <span id="publicIp"></span>
              <button class="cred-copy" onclick="copyToClipboard('publicIp')">Copy</button>
            </div>
          </div>
          <div class="cred-item">
            <div class="cred-label">NextCloud URL</div>
            <div class="cred-value">
              <span id="nextcloudUrl"></span>
              <button class="cred-copy" onclick="copyToClipboard('nextcloudUrl')">Copy</button>
            </div>
          </div>
          <div class="cred-item">
            <div class="cred-label">NextCloud Admin Password</div>
            <div class="cred-value">
              <span id="nextcloudPassword"></span>
              <button class="cred-copy" onclick="copyToClipboard('nextcloudPassword')">Copy</button>
            </div>
          </div>
          <div class="cred-item">
            <div class="cred-label">Pi-hole Admin URL</div>
            <div class="cred-value">
              <span id="piholeUrl"></span>
              <button class="cred-copy" onclick="copyToClipboard('piholeUrl')">Copy</button>
            </div>
          </div>
          <div class="cred-item">
            <div class="cred-label">Pi-hole Admin Password</div>
            <div class="cred-value">
              <span id="piholePassword"></span>
              <button class="cred-copy" onclick="copyToClipboard('piholePassword')">Copy</button>
            </div>
          </div>
          <div class="cred-item">
            <div class="cred-label">Tailscale Hostname</div>
            <div class="cred-value">
              <span id="tailscaleHostname"></span>
              <button class="cred-copy" onclick="copyToClipboard('tailscaleHostname')">Copy</button>
            </div>
          </div>
        </div>

        <div class="alert">
          ⚠️ <strong>Keep these credentials safe.</strong> Anyone with this information can access your private cloud. Do not share via email or chat — download and store securely on your computer.
        </div>
      </div>

      <!-- Divider -->
      <div id="divider2" class="divider hidden"></div>

      <!-- Step 3: Download SSH Key -->
      <div id="step3" class="step hidden">
        <div class="step-title">Step 3: Download SSH Key</div>
        <div class="step-content">
          Your private SSH key allows you to securely connect to your server via terminal. Download it now — it will be stored on your computer, not in the cloud.
        </div>
        <div class="button-group">
          <button class="btn-primary" onclick="downloadSSHKey()">
            <span id="downloadButtonText">Download SSH Key</span>
          </button>
          <button class="btn-secondary" onclick="copySSHKeyToClipboard()">Copy to Clipboard</button>
        </div>

        <div class="alert" style="margin-top: 16px;">
          📱 <strong>After downloading:</strong>
          <br>1. Save the file as <code>~/.ssh/oraclevm_key</code> on your computer
          <br>2. Run: <code>chmod 600 ~/.ssh/oraclevm_key</code>
          <br>3. Connect: <code>ssh -i ~/.ssh/oraclevm_key ubuntu@[IP]</code>
        </div>
      </div>

      <!-- Reset Button -->
      <div id="resetSection" class="step hidden">
        <div class="button-group">
          <button class="btn-secondary" onclick="resetForm()">
            Retrieve Another Client's Credentials
          </button>
        </div>
      </div>
    </div>

    <div class="footer">
      Gold Vault Private Cloud — Secure Credential Management
    </div>
  </div>

  <script>
    // Configuration
    const WORKER_URL = window.location.origin; // Same origin by default
    const JWT_TOKEN = ''; // Handle via token/apiKey or CF Access automatically

    let currentClient = null;

    function showMessage(text, type = 'info') {
      const msg = document.getElementById('message');
      msg.textContent = text;
      msg.className = `message ${type}`;
      msg.style.display = 'block';
      msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideMessage() {
      document.getElementById('message').className = 'message';
      document.getElementById('message').style.display = 'none';
    }

    async function retrieveClientData(configToken = null, configId = null) {
      const clientId = configId || document.getElementById('clientId').value.trim();
      const urlParams = new URLSearchParams(window.location.search);
      const token = configToken || urlParams.get('token') || urlParams.get('key');

      if (!clientId && !token) {
        showMessage('Please enter a client ID or use a secure link', 'error');
        return;
      }

      try {
        const primaryBtn = document.querySelector('.btn-primary');
        const originalBtnText = primaryBtn.innerHTML;
        primaryBtn.disabled = true;
        primaryBtn.innerHTML = '<span class="spinner"></span> Retrieving...';

        const headers = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const fetchUrl = token && !clientId 
          ? `${WORKER_URL}/api/clients/portal?token=${token}` 
          : `${WORKER_URL}/api/clients/${clientId}`;

        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || (response.status === 404 ? 'Client not found' : 'Failed to retrieve credentials'));
        }

        const client = await response.json();
        currentClient = client;

        // Populate credentials
        document.getElementById('companyName').textContent = client.companyName || 'N/A';
        document.getElementById('publicIp').textContent = client.vmPublicIp || 'Pending...';
        document.getElementById('nextcloudUrl').textContent = client.nextcloudUrl || 'N/A';
        document.getElementById('nextcloudPassword').textContent = client.nextcloudAdminPassword || 'N/A';
        document.getElementById('piholeUrl').textContent = client.piholeAdminUrl || 'N/A';
        document.getElementById('piholePassword').textContent = client.piholePassword || 'N/A';
        document.getElementById('tailscaleHostname').textContent = client.tailscaleHostname || 'N/A';

        // Show Step 2 & 3
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('divider1').classList.remove('hidden');
        document.getElementById('step2').classList.remove('hidden');
        document.getElementById('divider2').classList.remove('hidden');
        document.getElementById('step3').classList.remove('hidden');
        document.getElementById('resetSection').classList.remove('hidden');

        showMessage('Credentials retrieved successfully!', 'success');
        
        primaryBtn.disabled = false;
        primaryBtn.innerHTML = originalBtnText;

      } catch (err) {
        showMessage(`Error: ${err.message}`, 'error');
        const primaryBtn = document.querySelector('.btn-primary');
        primaryBtn.disabled = false;
        primaryBtn.innerHTML = 'Retrieve Credentials';
      }
    }

    function copyToClipboard(elementId) {
      const element = document.getElementById(elementId);
      const text = element.textContent;
      navigator.clipboard.writeText(text).then(() => {
        showMessage('Copied to clipboard!', 'success');
      });
    }

    function copySSHKeyToClipboard() {
      if (!currentClient || !currentClient.sshKey) {
        showMessage('SSH key not available', 'error');
        return;
      }
      navigator.clipboard.writeText(currentClient.sshKey).then(() => {
        showMessage('SSH key copied to clipboard', 'success');
      });
    }

    function downloadSSHKey() {
      if (!currentClient || !currentClient.sshKey) {
        showMessage('SSH key not available', 'error');
        return;
      }

      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(currentClient.sshKey));
      element.setAttribute('download', `${currentClient.id || 'private'}_key`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      showMessage('SSH key downloaded. Keep it safe!', 'success');
    }

    function resetForm() {
      window.location.search = ''; // Clear token from URL on reset
    }

    // Auto-focus on load or auto-retrieve if token present
    window.addEventListener('load', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || urlParams.get('key');
      
      if (token) {
        retrieveClientData(token);
      } else {
        document.getElementById('clientId').focus();
      }
    });
  </script>
</body>
</html>

```

```

```

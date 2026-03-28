// Narad AI Terminal - Original Theme with Minimal Ring Charts
const API_BASE = '';
let sessionId = localStorage.getItem('narad_session_id') || 'session_' + Date.now();
localStorage.setItem('narad_session_id', sessionId);

let chatHistory = [];
let isStreaming = false;
let csrfToken = null;

// XSS Prevention: DOMPurify configuration
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre', 'br', 'p', 'span', 'a'],
  ALLOWED_ATTR: ['href', 'class'],
  ALLOW_DATA_ATTR: false,
};

// Simple DOMPurify implementation for vanilla JS
const DOMPurify = {
  sanitize: function(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const scripts = doc.querySelectorAll('script, style, iframe, object, embed');
    scripts.forEach(el => el.remove());
    
    const elements = doc.querySelectorAll('*');
    elements.forEach(el => {
      const attrs = Array.from(el.attributes);
      attrs.forEach(attr => {
        if (attr.name.startsWith('on') || attr.name === 'javascript') {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    return doc.body.innerHTML;
  }
};

// Input validation patterns
const VALIDATION_PATTERNS = {
  message: { maxLength: 5000, minLength: 1 },
  sessionId: { pattern: /^[a-zA-Z0-9_-]{1,100}$/ },
  history: { maxItems: 100 }
};

// Rate limiting state
const rateLimiter = {
  requests: [],
  maxRequests: 10,
  windowMs: 60000,
  
  isAllowed() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    return false;
  },
  
  getRetryAfter() {
    if (this.requests.length === 0) return 0;
    const oldestRequest = this.requests[0];
    return Math.ceil((oldestRequest + this.windowMs - Date.now()) / 1000);
  }
};

// CSRF Token Manager
const CSRFManager = {
  async init() {
    // First check if token is in meta tag
    const tokenEl = document.querySelector('meta[name="csrf-token"]');
    if (tokenEl && tokenEl.getAttribute('content')) {
      csrfToken = tokenEl.getAttribute('content');
      return;
    }
    
    // Fetch new token from server
    try {
      const response = await fetch(`${API_BASE}/api/csrf-token`);
      if (response.ok) {
        const data = await response.json();
        csrfToken = data.token;
        if (tokenEl) {
          tokenEl.setAttribute('content', csrfToken);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch CSRF token:', e);
    }
  },
  
  getToken() {
    return csrfToken;
  }
};

// Input Validator
const InputValidator = {
  validate(field, value) {
    switch (field) {
      case 'message':
        return this.validateMessage(value);
      case 'sessionId':
        return this.validateSessionId(value);
      case 'history':
        return this.validateHistory(value);
      default:
        return { valid: false, error: 'Unknown field' };
    }
  },
  
  validateMessage(value) {
    if (!value || typeof value !== 'string') {
      return { valid: false, error: 'Message must be a string' };
    }
    if (value.trim().length < VALIDATION_PATTERNS.message.minLength) {
      return { valid: false, error: 'Message cannot be empty' };
    }
    if (value.length > VALIDATION_PATTERNS.message.maxLength) {
      return { valid: false, error: `Message exceeds ${VALIDATION_PATTERNS.message.maxLength} characters` };
    }
    if (/<(script|iframe|object|embed|form)/i.test(value)) {
      return { valid: false, error: 'Invalid content detected' };
    }
    return { valid: true, value: value.trim() };
  },
  
  validateSessionId(value) {
    if (!value || typeof value !== 'string') {
      return { valid: false, error: 'Invalid session ID' };
    }
    if (!VALIDATION_PATTERNS.sessionId.pattern.test(value)) {
      return { valid: false, error: 'Invalid session ID format' };
    }
    return { valid: true };
  },
  
  validateHistory(value) {
    if (!Array.isArray(value)) {
      return { valid: false, error: 'History must be an array' };
    }
    if (value.length > VALIDATION_PATTERNS.history.maxItems) {
      return { valid: false, error: `History exceeds ${VALIDATION_PATTERNS.history.maxItems} items` };
    }
    for (const msg of value) {
      if (!msg.role || !msg.text) {
        return { valid: false, error: 'Invalid history message format' };
      }
      if (typeof msg.text !== 'string' || msg.text.length > 10000) {
        return { valid: false, error: 'Invalid message text in history' };
      }
    }
    return { valid: true };
  }
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const chatForm = document.getElementById('chat-form');
const apiStatus = document.getElementById('api-status');
const apiDot = document.getElementById('api-dot');
const usageRing = document.getElementById('usage-ring');

// Initialize
async function init() {
    await CSRFManager.init();
    checkApiHealth();
    updateUsageRing();
    
    // Event listeners
    chatForm.addEventListener('submit', handleSubmit);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    });
    
    // Auto update usage ring every 30 seconds
    setInterval(updateUsageRing, 30000);
}

// Handle form submit
function handleSubmit(e) {
    e.preventDefault();
    if (isStreaming || !userInput.value.trim()) return;
    
    // Validate message input
    const validation = InputValidator.validate('message', userInput.value);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }
    
    // Rate limiting check
    if (!rateLimiter.isAllowed()) {
      const retryAfter = rateLimiter.getRetryAfter();
      showError(`Too many requests. Try again in ${retryAfter}s`);
      return;
    }
    
    const message = validation.value;
    userInput.value = '';
    
    addMessage(message, 'user');
    sendToApi(message);
}

// Show error message to user
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error';
    errorDiv.innerHTML = `<div class="message-content">⚠️ ${escapeHtml(message)}</div>`;
    chatMessages.appendChild(errorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// API Health Check with detailed status
async function checkApiHealth() {
    try {
        const res = await fetch(`${API_BASE}/api/health`);
        if (res.ok) {
            const data = await res.json();
            
            // Update status based on service health
            if (data.status === 'ok') {
                apiStatus.textContent = 'Connected';
                apiDot.classList.add('connected');
            } else if (data.status === 'degraded') {
                apiStatus.textContent = 'Degraded';
                apiDot.classList.remove('connected');
            } else {
                apiStatus.textContent = 'Error';
                apiDot.classList.remove('connected');
            }
            
            // Log detailed status to console for debugging
            console.log('[Narad Health]', {
                status: data.status,
                uptime: data.uptime,
                providers: data.checks?.providers?.count || 0,
                successRate: data.metrics?.successRate || 'N/A'
            });
        } else {
            apiStatus.textContent = 'Error';
            apiDot.classList.remove('connected');
        }
    } catch (e) {
        apiStatus.textContent = 'Offline';
        apiDot.classList.remove('connected');
    }
}

// Add message to chat - XSS Safe using DOM APIs
function addMessage(text, type = 'assistant') {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    
    const avatar = type === 'user' ? '∼' : '⚡';
    
    // Safe DOM API approach - no innerHTML
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';
    avatarDiv.textContent = avatar;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Sanitize with DOMPurify before rendering any HTML
    const sanitizedText = DOMPurify.sanitize(text || '');
    // Use textContent for user content to prevent XSS
    contentDiv.textContent = sanitizedText;
    
    div.appendChild(avatarDiv);
    div.appendChild(contentDiv);
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

// Add message with optional rich content (limited HTML)
function addRichMessage(text, type = 'assistant', allowHtml = false) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    
    const avatar = type === 'user' ? '∼' : '⚡';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';
    avatarDiv.textContent = avatar;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (allowHtml) {
      // Sanitize with DOMPurify for rich content
      contentDiv.innerHTML = DOMPurify.sanitize(text || '', DOMPURIFY_CONFIG);
    } else {
      // Plain text - use textContent
      contentDiv.textContent = text || '';
    }
    
    div.appendChild(avatarDiv);
    div.appendChild(contentDiv);
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

// Escape HTML (legacy support, prefer addMessage)
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Send to API with CSRF protection
async function sendToApi(message) {
    isStreaming = true;
    const msgEl = addMessage('', 'assistant');
    msgEl.classList.add('streaming');
    const contentEl = msgEl.querySelector('.message-content');
    
    try {
        // Validate session ID
        const sessionValidation = InputValidator.validate('sessionId', sessionId);
        if (!sessionValidation.valid) {
          throw new Error(sessionValidation.error);
        }
        
        // Validate history
        const historyValidation = InputValidator.validate('history', chatHistory);
        if (!historyValidation.valid) {
          chatHistory = []; // Reset invalid history
        }
        
        // Build request headers
        const headers = { 'Content-Type': 'application/json' };
        const token = CSRFManager.getToken();
        if (token) {
          headers['X-CSRF-Token'] = token;
        }
        
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                message,
                history: chatHistory,
                session_id: sessionId
            })
        });
        
        // Handle CSRF errors
        if (response.status === 403) {
            throw new Error('Security validation failed. Please refresh the page.');
        }
        
        // Handle rate limiting
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After') || 60;
            throw new Error(`Rate limited. Try again in ${retryAfter} seconds.`);
        }
        
        if (!response.ok) {
            const error = await response.json();
            contentEl.textContent = `Error: ${error.error || 'Failed to get response'}`;
            msgEl.classList.remove('streaming');
            isStreaming = false;
            return;
        }
        
        const data = await response.json();
        
        if (data.reply) {
            chatHistory.push({ role: 'user', text: message });
            chatHistory.push({ role: 'assistant', text: data.reply });
            
            // Streaming effect
            let charIndex = 0;
            const reply = data.reply;
            const interval = setInterval(() => {
                if (charIndex < reply.length) {
                    contentEl.textContent += reply[charIndex];
                    charIndex++;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } else {
                    clearInterval(interval);
                    msgEl.classList.remove('streaming');
                    isStreaming = false;
                    
                    // Update usage ring after response
                    updateUsageRing();
                    
                    // Show metadata
                    if (data.metadata) {
                        const meta = document.createElement('div');
                        meta.className = 'message-meta';
                        meta.textContent = `💚 ${data.metadata.tokens} tokens • ${data.metadata.agentType} agent`;
                        msgEl.appendChild(meta);
                    }
                }
            }, 15);
        }
    } catch (error) {
        contentEl.textContent = `Error: ${error.message}`;
        msgEl.classList.remove('streaming');
        isStreaming = false;
    }
}

// Update Usage Ring in Header
async function updateUsageRing() {
    try {
        const res = await fetch(`${API_BASE}/api/usage`);
        if (!res.ok) return;
        
        const data = await res.json();
        renderUsageRing(data);
    } catch (e) {
        console.warn('Failed to update usage:', e);
    }
}

// Render usage ring in header with SVG
function renderUsageRing(usageData) {
    if (!usageData || typeof usageData !== 'object') {
        usageRing.innerHTML = `
            <svg viewBox="0 0 36 36">
                <circle class="ring-bg" cx="18" cy="18" r="15.5"></circle>
                <circle class="ring-progress" cx="18" cy="18" r="15.5" stroke-dasharray="0, 100"></circle>
            </svg>
            <span class="tokens">--</span>
            <span class="percent">--%</span>
        `;
        return;
    }
    
    let totalUsed = 0;
    let totalLimit = 0;
    
    for (const agent in usageData) {
        if (usageData[agent]) {
            totalUsed += usageData[agent].tokensUsed || 0;
            totalLimit += usageData[agent].limit || 200000;
        }
    }
    
    const percent = totalLimit > 0 ? Math.min(100, (totalUsed / totalLimit) * 100) : 0;
    const circumference = 2 * Math.PI * 15.5;
    const dashArray = (percent / 100) * circumference;
    
    let colorClass = '';
    if (percent >= 90) colorClass = 'danger';
    else if (percent >= 70) colorClass = 'warning';
    
    usageRing.innerHTML = `
        <svg viewBox="0 0 36 36">
            <circle class="ring-bg" cx="18" cy="18" r="15.5"></circle>
            <circle class="ring-progress ${colorClass}" cx="18" cy="18" r="15.5" 
                stroke-dasharray="${dashArray}, ${circumference}"></circle>
        </svg>
        <span class="tokens">${formatNumber(totalUsed)}</span>
        <span class="percent ${colorClass}">${percent.toFixed(0)}%</span>
    `;
}

// Format number with K/M suffix
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => init());
if (document.readyState !== 'loading') init();

// Submit feedback with CSRF protection
async function submitFeedback(score) {
    const token = CSRFManager.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/feedback`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                session_id: sessionId,
                score
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Feedback error:', error.error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Feedback error:', error);
        return false;
    }
}

// Narad AI Terminal
const API_BASE = '';
let sessionId = localStorage.getItem('narad_session_id') || 'session_' + Date.now();
localStorage.setItem('narad_session_id', sessionId);

let chatHistory = [];
let agentType = 'general';
let isStreaming = false;

// DOM Elements
const output = document.getElementById('output');
const input = document.getElementById('input');
const apiStatus = document.getElementById('api-status');
const apiDot = document.getElementById('api-dot');
const agentSelect = document.getElementById('agent-select');
const usageOverlay = document.getElementById('usage-overlay');
const usageGrid = document.getElementById('usage-grid');
const usageBtn = document.getElementById('usage-btn');
const closeUsageBtn = document.getElementById('close-usage');

// Initialize
function init() {
    addMessage('👋 Welcome to Narad AI Terminal', 'system');
    addMessage('I am your multi-agent AI assistant. Select an agent type above and send me a message!', 'system');
    
    checkApiHealth();
    updateUsagePanel();
    
    // Event listeners
    input.addEventListener('keydown', handleKeyDown);
    agentSelect.addEventListener('change', (e) => {
        agentType = e.target.value;
    });
    
    usageBtn.addEventListener('click', () => {
        usageOverlay.classList.add('active');
    });
    
    closeUsageBtn.addEventListener('click', () => {
        usageOverlay.classList.remove('active');
    });
    
    usageOverlay.addEventListener('click', (e) => {
        if (e.target === usageOverlay) {
            usageOverlay.classList.remove('active');
        }
    });
    
    // Auto update usage panel
    setInterval(updateUsagePanel, 30000);
}

// API Health Check
async function checkApiHealth() {
    try {
        const res = await fetch(`${API_BASE}/api/health`);
        if (res.ok) {
            apiStatus.textContent = 'Connected';
            apiDot.classList.add('connected');
        } else {
            apiStatus.textContent = 'Error';
        }
    } catch (e) {
        apiStatus.textContent = 'Offline';
    }
}

// Add message to output
function addMessage(text, type = 'system') {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `<span class="prompt">${type === 'user' ? '∼' : '➜'}</span><div class="content">${escapeHtml(text)}</div>`;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
    return div;
}

// Escape HTML
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Handle input
function handleKeyDown(e) {
    if (isStreaming) return;
    
    if (e.key === 'Enter' && input.value.trim()) {
        const message = input.value.trim();
        input.value = '';
        
        addMessage(message, 'user');
        sendToApi(message);
    }
}

// Send to API
async function sendToApi(message) {
    isStreaming = true;
    const msgEl = addMessage('', 'assistant');
    msgEl.classList.add('streaming');
    const contentEl = msgEl.querySelector('.content');
    
    try {
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                history: chatHistory,
                session_id: sessionId,
                agent_type: agentType
            })
        });
        
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
                    output.scrollTop = output.scrollHeight;
                } else {
                    clearInterval(interval);
                    msgEl.classList.remove('streaming');
                    isStreaming = false;
                    
                    // Show metadata
                    if (data.metadata) {
                        const meta = document.createElement('div');
                        meta.style.cssText = 'font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;';
                        meta.textContent = `💚 ${data.metadata.tokens} tokens • ${data.metadata.agentType} agent`;
                        contentEl.appendChild(meta);
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

// Update Usage Panel with Ring Charts
async function updateUsagePanel() {
    try {
        const res = await fetch(`${API_BASE}/api/usage`);
        if (!res.ok) return;
        
        const data = await res.json();
        renderRingCharts(data);
    } catch (e) {
        console.warn('Failed to update usage:', e);
    }
}

// Render ring charts
function renderRingCharts(usageData) {
    const agents = ['general', 'coding', 'research', 'debugging', 'testing', 'deployment'];
    
    usageGrid.innerHTML = agents.map(agent => {
        const info = usageData[agent] || { tokensUsed: 0, limit: 200000 };
        const percent = Math.min(100, (info.tokensUsed / info.limit) * 100);
        const remaining = Math.max(0, info.limit - info.tokensUsed);
        
        // Calculate stroke dasharray for ring
        const radius = 30;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        
        let colorClass = '';
        if (percent >= 90) colorClass = 'danger';
        else if (percent >= 70) colorClass = 'warning';
        
        return `
            <div class="ring-card">
                <div class="ring-label">${agent}</div>
                <div class="ring-chart">
                    <svg width="80" height="80">
                        <circle class="ring-bg" cx="40" cy="40" r="${radius}"/>
                        <circle class="ring-progress ${colorClass}" cx="40" cy="40" r="${radius}"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${offset}"/>
                    </svg>
                    <div class="ring-center">
                        <span class="ring-percent">${percent.toFixed(0)}%</span>
                    </div>
                </div>
                <div class="ring-tokens">${formatNumber(remaining)} / ${formatNumber(info.limit)}</div>
            </div>
        `;
    }).join('');
}

// Format number with K/M suffix
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
if (document.readyState !== 'loading') init();

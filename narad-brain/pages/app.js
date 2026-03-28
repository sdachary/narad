// Narad AI Terminal - Original Theme with Minimal Ring Charts
const API_BASE = '';
let sessionId = localStorage.getItem('narad_session_id') || 'session_' + Date.now();
localStorage.setItem('narad_session_id', sessionId);

let chatHistory = [];
let isStreaming = false;

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const chatForm = document.getElementById('chat-form');
const apiStatus = document.getElementById('api-status');
const apiDot = document.getElementById('api-dot');
const usageRing = document.getElementById('usage-ring');

// Initialize
function init() {
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
    
    const message = userInput.value.trim();
    userInput.value = '';
    
    addMessage(message, 'user');
    sendToApi(message);
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

// Add message to chat
function addMessage(text, type = 'assistant') {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    
    const avatar = type === 'user' ? '∼' : '⚡';
    
    div.innerHTML = `
        <div class="avatar">${avatar}</div>
        <div class="message-content">${escapeHtml(text)}</div>
    `;
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

// Escape HTML
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Send to API
async function sendToApi(message) {
    isStreaming = true;
    const msgEl = addMessage('', 'assistant');
    msgEl.classList.add('streaming');
    const contentEl = msgEl.querySelector('.message-content');
    
    try {
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                history: chatHistory,
                session_id: sessionId
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

// Render usage text in header
function renderUsageRing(usageData) {
    let totalUsed = 0;
    let totalLimit = 0;
    
    for (const agent in usageData) {
        totalUsed += usageData[agent].tokensUsed || 0;
        totalLimit += usageData[agent].limit || 200000;
    }
    
    const percent = Math.min(100, (totalUsed / totalLimit) * 100);
    
    let colorClass = '';
    if (percent >= 90) colorClass = 'danger';
    else if (percent >= 70) colorClass = 'warning';
    
    usageRing.innerHTML = `
        <span class="tokens">${formatNumber(totalUsed)} tokens</span>
        <span class="percent ${colorClass}">${percent.toFixed(0)}% used</span>
    `;
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

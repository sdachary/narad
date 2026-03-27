const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const statusText = document.querySelector('.status-text');
const statusIcon = document.querySelector('.status-icon');
const agentIndicator = document.getElementById('agent-indicator');

// Check Health
async function checkHealth() {
    try {
        const res = await fetch('/api/health');
        if (res.ok) {
            statusText.textContent = 'NARAD ONLINE';
            statusIcon.style.background = '#10b981';
            statusIcon.style.boxShadow = '0 0 10px #10b981';
            agentIndicator.style.opacity = '1';
        } else {
            throw new Error(`Health check returned ${res.status}`);
        }
    } catch (e) {
        statusText.textContent = 'NARAD OFFLINE';
        statusIcon.style.background = '#ef4444';
        statusIcon.style.boxShadow = '0 0 10px #ef4444';
        agentIndicator.style.opacity = '0.5';
    }
}

checkHealth();
setInterval(checkHealth, 30000);

function addMessage(text, role, agentType = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role} slide-up`;
    
    let agentBadge = '';
    if (agentType && role === 'assistant') {
        const agentColors = {
            'coding': '#3b82f6',
            'testing': '#10b981', 
            'architecture': '#8b5cf6',
            'security': '#ef4444',
            'deployment': '#f59e0b',
            'general': '#6b7280'
        };
        const color = agentColors[agentType] || '#6b7280';
        agentBadge = `<span class="agent-badge" style="background-color: ${color};">${agentType}</span> `;
    }
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${agentBadge}${text}
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

function addRetryButton(originalMessage) {
    const retryDiv = document.createElement('div');
    retryDiv.className = 'message assistant slide-up';
    retryDiv.innerHTML = `
        <div class="message-content" style="display: flex; align-items: center; gap: 10px;">
            <span>Message failed.</span>
            <button class="retry-btn" style="
                background: var(--gold);
                color: #000;
                border: none;
                padding: 6px 14px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 13px;
            ">🔄 Retry</button>
        </div>
    `;
    chatMessages.appendChild(retryDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    retryDiv.querySelector('.retry-btn').addEventListener('click', () => {
        chatMessages.removeChild(retryDiv);
        sendMessage(originalMessage);
    });
}

async function sendMessage(message) {
    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant slide-up';
    loadingDiv.id = 'loading';
    loadingDiv.innerHTML = '<div class="message-content">🔮 Coordinating agents...</div>';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const MAX_RETRIES = 2;
    let lastError = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for complex tasks

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, session_id: 'web-session-' + Date.now() }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                // Try to read error body
                let errorDetail = '';
                try {
                    const errData = await res.json();
                    errorDetail = errData.error || errData.message || JSON.stringify(errData);
                } catch {
                    errorDetail = await res.text().catch(() => 'Unknown error');
                }

                // If it's a server error (5xx) and we have retries left, retry
                if (res.status >= 500 && attempt < MAX_RETRIES) {
                    lastError = `HTTP ${res.status}: ${errorDetail}`;
                    await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); // backoff
                    continue;
                }

                // Final failure
                if (loadingDiv.parentNode) chatMessages.removeChild(loadingDiv);
                addMessage(`⚠️ Error (HTTP ${res.status}): ${errorDetail}`, 'assistant');
                addRetryButton(message);
                return;
            }

            const data = await res.json();
            if (loadingDiv.parentNode) chatMessages.removeChild(loadingDiv);

            if (data.reply) {
                // Try to detect if response mentions specific agent types for better UI
                let agentType = null;
                const lowerReply = data.reply.toLowerCase();
                if (lowerReply.includes('coding') || lowerReply.includes('code')) agentType = 'coding';
                else if (lowerReply.includes('test') || lowerReply.includes('testing')) agentType = 'testing';
                else if (lowerReply.includes('architect') || lowerReply.includes('design')) agentType = 'architecture';
                else if (lowerReply.includes('security') || lowerReply.includes('vulner')) agentType = 'security';
                else if (lowerReply.includes('deploy') || lowerReply.includes('release')) agentType = 'deployment';
                else if (lowerReply.includes('general') || lowerReply.includes('overview')) agentType = 'general';
                
                addMessage(data.reply, 'assistant', agentType);
            } else if (data.error) {
                addMessage(`⚠️ ${data.error}`, 'assistant');
                addRetryButton(message);
            } else {
                addMessage('❌ The universal flow was interrupted. Empty response received.', 'assistant');
                addRetryButton(message);
            }
            return;

        } catch (err) {
            if (err.name === 'AbortError') {
                lastError = 'Request timed out (60s). Complex task may require more time.';
            } else {
                lastError = err.message || 'Network error';
            }

            // Retry on network errors
            if (attempt < MAX_RETRIES) {
                await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
                continue;
            }
        }
    }

    // All retries exhausted
    if (loadingDiv.parentNode) chatMessages.removeChild(loadingDiv);
    addMessage(`❌ Failed to connect: ${lastError}`, 'assistant');
    addRetryButton(message);
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    await sendMessage(message);
});

// Add some visual flair - periodically update agent indicator to show activity
setInterval(() => {
    if (agentIndicator) {
        const dots = ['● ○ ○', '○ ● ○', '○ ○ ●'];
        const current = agentIndicator.textContent.trim();
        const nextIndex = (dots.indexOf(current) + 1) % dots.length;
        agentIndicator.textContent = dots[nextIndex];
    }
}, 800);
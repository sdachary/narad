const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const statusText = document.querySelector('.status-text');
const statusIcon = document.querySelector('.status-icon');

// Check Health
async function checkHealth() {
    try {
        const res = await fetch('/api/health');
        if (res.ok) {
            statusText.textContent = 'NARAD ONLINE';
            statusIcon.style.background = '#10b981';
            statusIcon.style.boxShadow = '0 0 10px #10b981';
        } else {
            throw new Error(`Health check returned ${res.status}`);
        }
    } catch (e) {
        statusText.textContent = 'NARAD OFFLINE';
        statusIcon.style.background = '#ef4444';
        statusIcon.style.boxShadow = '0 0 10px #ef4444';
    }
}

checkHealth();
setInterval(checkHealth, 30000);

function addMessage(text, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role} slide-up`;
    messageDiv.innerHTML = `
        <div class="message-content">
            ${text}
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
    loadingDiv.innerHTML = '<div class="message-content">🔮 Reflecting...</div>';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const MAX_RETRIES = 2;
    let lastError = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 50000); // 50s timeout

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
                addMessage(data.reply, 'assistant');
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
                lastError = 'Request timed out (50s). The AI model may be overloaded.';
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

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
            throw new Error();
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
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    
    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant slide-up';
    loadingDiv.id = 'loading';
    loadingDiv.innerHTML = '<div class="message-content">🔮 Reflecting...</div>';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, session_id: 'web-session-' + Date.now() })
        });

        const data = await res.json();
        chatMessages.removeChild(loadingDiv);
        
        if (data.reply) {
            addMessage(data.reply, 'assistant');
        } else {
            addMessage('❌ The universal flow was interrupted. Please try again.', 'assistant');
        }
    } catch (err) {
        chatMessages.removeChild(loadingDiv);
        addMessage('❌ Connection lost. Please check if Narad is online.', 'assistant');
    }
});

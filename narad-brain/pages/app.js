const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const statusText = document.querySelector('.status-text');
const statusIcon = document.querySelector('.status-icon');
const agentIndicator = document.getElementById('agent-indicator');
const usagePanel = document.getElementById('usage-panel');
const usageTableBody = document.getElementById('usage-table-body');

// Storage key for session_id in localStorage
const SESSION_ID_KEY = 'narad-session-id';

// Generate a random UUID (simplified)
function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get or create session_id
function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// Load chat history from worker for the current session
async function loadChatHistory() {
  try {
    const sessionId = getSessionId();
    const res = await fetch(`/api/chat/history/${sessionId}`);
    if (res.ok) {
      const data = await res.json();
      const history = data.history || [];
      history.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.role} slide-up`;
        
        let agentBadge = '';
        if (msg.agentType && msg.role === 'assistant') {
          const agentColors = {
            'coding': '#3b82f6',
            'testing': '#10b981', 
            'architecture': '#8b5cf6',
            'security': '#ef4444',
            'deployment': '#f59e0b',
            'general': '#6b7280'
          };
          const color = agentColors[msg.agentType] || '#6b7280';
          agentBadge = `<span class="agent-badge" style="background-color: ${color};">${msg.agentType}</span> `;
        }
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${agentBadge}${msg.text}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
      });
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  } catch (error) {
    console.warn('Failed to load chat history from worker:', error);
  }
}

// Save chat history to worker (called after each message exchange)
async function saveChatHistory(messages) {
  try {
    const sessionId = getSessionId();
    await fetch(`/api/chat/history/${sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: messages })
    });
  } catch (error) {
    console.warn('Failed to save chat history to worker:', error);
  }
}

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
  
  // Add delete button for user messages (clutter removal)
  let deleteButton = '';
  if (role === 'user') {
    deleteButton = `
      <button class="delete-message-btn" title="Delete this message">
        ✕
      </button>
    `;
  }
  
  // Build message content
  let contentHTML = `<div class="message-text">${agentBadge}${text}</div>`;
  
  if (role === 'user' && deleteButton) {
    contentHTML += `<div class="delete-btn" style="margin-top:0.25rem;">${deleteButton}</div>`;
  }
  
  // Add feedback buttons for assistant messages
  let feedbackHTML = '';
  if (role === 'assistant') {
    feedbackHTML = `
      <div class="feedback-buttons" style="margin-top:0.5rem; display:flex; gap:0.5rem;">
        <button class="feedback-btn" data-score="1" title="Good response">👍</button>
        <button class="feedback-btn" data-score="-1" title="Poor response">👎</button>
      </div>
    `;
  }
  
  messageDiv.innerHTML = `<div class="message-content">${contentHTML}${feedbackHTML}</div>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Add event listener to delete button if present
  if (role === 'user') {
    const deleteBtn = messageDiv.querySelector('.delete-message-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this message?')) {
        messageDiv.remove();
        // Save updated chat history after deletion
        saveChatHistory(getCurrentMessages());
      }
    });
  }
  
  // Add feedback button listeners for assistant messages
  if (role === 'assistant') {
    const feedbackBtns = messageDiv.querySelectorAll('.feedback-btn');
    feedbackBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const score = Number(btn.dataset.score);
        const sessionId = getSessionId();
        try {
          const res = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, score })
          });
          if (!res.ok) {
            console.warn('Failed to send feedback');
          } else {
            // Disable buttons after feedback to prevent double submission
            btn.disabled = true;
            // Optionally style to show it's been submitted
            const feedbackContainer = btn.parentElement;
            if (feedbackContainer) {
              feedbackContainer.querySelectorAll('.feedback-btn').forEach(b => {
                b.disabled = true;
                b.style.opacity = '0.6';
              });
            }
          }
        } catch (e) {
          console.warn('Error sending feedback:', e);
        }
      });
    });
  }
  
  return messageDiv;
}
  
  // Add delete button for user messages (clutter removal)
  let deleteButton = '';
  if (role === 'user') {
    deleteButton = `
      <button class="delete-message-btn" title="Delete this message">
        ✕
      </button>
    `;
  }
  
  messageDiv.innerHTML = `
      <div class="message-content">
          <div class="message-text">${agentBadge}${text}</div>
          ${deleteButton ? `<div class="delete-btn" style="margin-top:0.25rem;">${deleteButton}</div>` : ''}
      </div>
  `;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Add feedback buttons for assistant messages
  if (role === 'assistant') {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback-buttons';
    feedbackDiv.innerHTML = `
      <button class="feedback-btn" data-score="1" title="Good response">👍</button>
      <button class="feedback-btn" data-score="-1" title="Poor response">👎</button>
    `;
    messageDiv.appendChild(feedbackDiv);
  }
  
  // Add event listener to delete button if present
  if (role === 'user') {
    const deleteBtn = messageDiv.querySelector('.delete-message-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this message?')) {
        messageDiv.remove();
        // Save updated chat history after deletion
        saveChatHistory(getCurrentMessages());
      }
    });
  }
  
  return messageDiv;
}

// Helper function to get current messages from UI
function getCurrentMessages() {
  const messages = [];
  document.querySelectorAll('.message').forEach(msgDiv => {
    const role = msgDiv.classList.contains('message-user') ? 'user' : 'assistant';
    const textElement = msgDiv.querySelector('.message-content');
    // Extract text before the delete button if present
    let text = '';
    if (textElement) {
      const contentDiv = textElement.querySelector('div:first-child');
      text = contentDiv ? contentDiv.textContent.trim() : textElement.textContent.trim();
    }
    
    // Extract agent type if present
    let agentType = null;
    const agentBadge = msgDiv.querySelector('.agent-badge');
    if (agentBadge) {
      agentType = agentBadge.textContent.trim();
    }
    
    if (text) {
      messages.push({ role, text, agentType });
    }
  });
  return messages;
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

// Fetch usage stats from the worker
async function updateUsagePanel() {
  try {
    const res = await fetch('/api/usage');
    if (res.ok) {
      const usageData = await res.json();
      
      // Clear table body
      usageTableBody.innerHTML = '';
      
      // Add rows for each agent type
      for (const [agentType, data] of Object.entries(usageData)) {
        const row = document.createElement('tr');
        
        // Agent type cell
        const typeCell = document.createElement('td');
        typeCell.textContent = agentType.charAt(0).toUpperCase() + agentType.slice(1);
        row.appendChild(typeCell);
        
        // Tokens used cell
        const usedCell = document.createElement('td');
        usedCell.textContent = data.tokensUsed.toLocaleString();
        row.appendChild(usedCell);
        
        // Limit cell
        const limitCell = document.createElement('td');
        limitCell.textContent = data.limit.toLocaleString();
        row.appendChild(limitCell);
        
        // Remaining cell
        const remainingCell = document.createElement('td');
        remainingCell.textContent = data.remaining.toLocaleString();
        row.appendChild(remainingCell);
        
        // Percent used cell with progress bar
        const percentCell = document.createElement('td');
        const percent = data.percentUsed;
        const progressBar = document.createElement('div');
        progressBar.style.width = '100px';
        progressBar.style.height = '10px';
        progressBar.style.backgroundColor = '#e0e0e0';
        progressBar.style.borderRadius = '5px';
        progressBar.style.overflow = 'hidden';
        
        const progressFill = document.createElement('div');
        progressFill.style.width = `${percent}%`;
        progressBar.style.height = '100%';
        
        // Color based on usage level
        if (percent < 50) {
          progressFill.style.backgroundColor = '#10b981'; // green
        } else if (percent < 80) {
          progressFill.style.backgroundColor = '#f59e0b'; // yellow
        } else {
          progressFill.style.backgroundColor = '#ef4444'; // red
        }
        
        progressBar.appendChild(progressFill);
        percentCell.innerHTML += ` <span>${percent.toFixed(1)}%</span>`;
        row.appendChild(percentCell);
        
        usageTableBody.appendChild(row);
      }
    }
  } catch (error) {
    console.warn('Failed to update usage panel:', error);
  }
}

// Update usage panel periodically
setInterval(updateUsagePanel, 5000); // Update every 5 seconds
// Initial load
updateUsagePanel();

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
        body: JSON.stringify({ 
          message: message, 
          session_id: getSessionId(),
          agent_type: 'general' // We can make this configurable later if needed
        }),
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
        
        // Save the updated chat history (we already have the user message in UI, now add assistant)
        // Get current messages from UI and save them
        const currentMessages = [];
        document.querySelectorAll('.message').forEach(msgDiv => {
            const role = msgDiv.classList.contains('message-user') ? 'user' : 'assistant';
            const textElement = msgDiv.querySelector('.message-content');
            const text = textElement ? textElement.textContent.trim() : '';
            
            // Extract agent type if present
            let agentType = null;
            const agentBadge = msgDiv.querySelector('.agent-badge');
            if (agentBadge) {
                agentType = agentBadge.textContent.trim();
            }
            
            if (text) {
                currentMessages.push({ role, text, agentType });
            }
        });
        saveChatHistory(currentMessages); // Save current chat state to worker
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

// Load chat history when the page loads
loadChatHistory();

// Add some visual flair - periodically update agent indicator to show activity
setInterval(() => {
  if (agentIndicator) {
    const dots = ['● ○ ○', '○ ● ○', '○ ○ ●'];
    const current = agentIndicator.textContent.trim();
    const nextIndex = (dots.indexOf(current) + 1) % dots.length;
    agentIndicator.textContent = dots[nextIndex];
  }
}, 800);

// Clear history button (for debugging/privacy)
window.clearChatHistory = function() {
  if (confirm('Are you sure you want to clear all chat history?')) {
    // Clear the chat history on the worker for the current session
    const sessionId = getSessionId();
    fetch(`/api/chat/history/${sessionId}`, {
      method: 'DELETE'
    }).then(() => {
      // Remove session_id from localStorage to generate a new one
      localStorage.removeItem(SESSION_ID_KEY);
      
      // Keep only the initial message
      chatMessages.innerHTML = `
          <div class="message assistant slide-up">
              <div class="message-content">
                  👋 Greetings. I am Narad, your multi-agent AI assistant. I coordinate specialized agents to tackle complex tasks. How may I assist you today?
              </div>
          </div>
      `;
      
      // Also reset usage stats on the worker (optional)
      fetch('/api/reset-usage', { method: 'POST' });
    }).catch(error => {
      console.warn('Failed to clear chat history:', error);
      // Still remove session and reset UI even if worker call fails
      localStorage.removeItem(SESSION_ID_KEY);
      chatMessages.innerHTML = `
          <div class="message assistant slide-up">
              <div class="message-content">
                  👋 Greetings. I am Narad, your multi-agent AI assistant. I coordinate specialized agents to tackle complex tasks. How may I assist you today?
              </div>
          </div>
      `;
    });
  }
};

// Expose clearChatHistory to window for easy access from console
window.clearChatHistory = window.clearChatHistory;
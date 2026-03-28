// Terminal-based interface for Narad
const API_BASE = ''; // Empty for same-origin (Cloudflare Pages)
let sessionId = localStorage.getItem('narad_session_id') || 'session_' + Date.now();
localStorage.setItem('narad_session_id', sessionId);

let chatHistory = [];
let agentType = 'general';

const appContainer = document.querySelector('.app-container');
if (appContainer) {
  appContainer.innerHTML = '<div id="terminal-container"></div>';
}
const terminalContainer = document.getElementById('terminal-container');

let terminalOutput = [];
let terminalInput = '';
let commandHistory = [];
let historyIndex = -1;
let isStreaming = false;

let terminalOutputEl;
let terminalInputEl;
let cursorEl;

function initTerminal() {
  terminalContainer.innerHTML = `
    <div class="terminal">
      <div class="terminal-header">
        <div class="terminal-title">
          <span>Narad AI Terminal</span>
        </div>
        <div class="terminal-status">
          <div class="status-item">
            <div class="status-dot connected" id="api-status-dot"></div>
            <span id="api-status">Connecting...</span>
          </div>
          <div class="status-item">
            <span>Agent:</span>
            <select id="agent-select">
              <option value="general">General</option>
              <option value="coding">Coding</option>
              <option value="research">Research</option>
              <option value="debugging">Debugging</option>
              <option value="testing">Testing</option>
              <option value="deployment">Deployment</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="terminal-body">
        <div class="terminal-output" id="terminal-output"></div>
        <div class="terminal-input">
          <span class="prompt">></span>
          <input type="text" id="terminal-input" autocomplete="off" placeholder="Type a message...">
          <span class="cursor" id="cursor">█</span>
        </div>
      </div>
    </div>
  `;
  
  terminalOutputEl = document.getElementById('terminal-output');
  terminalInputEl = document.getElementById('terminal-input');
  cursorEl = document.getElementById('cursor');
  
  const agentSelect = document.getElementById('agent-select');
  agentSelect.addEventListener('change', (e) => {
    agentType = e.target.value;
  });

  addToOutput('👋 Welcome to Narad AI Terminal');
  addToOutput('I am your multi-agent AI assistant. Select an agent type above and send me a message!');
  addToOutput('---');
  
  checkApiHealth();
  
  terminalInputEl.addEventListener('keydown', handleKeyDown);
  terminalInputEl.addEventListener('input', handleInput);
  
  startCursorBlink();
}

async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (res.ok) {
      document.getElementById('api-status').textContent = 'API Connected';
      document.getElementById('api-status-dot').classList.add('connected');
    } else {
      document.getElementById('api-status').textContent = 'API Error';
    }
  } catch (e) {
    document.getElementById('api-status').textContent = 'API Offline';
  }
}

// Add a line to the terminal output
function addToOutput(content, type = 'output') {
  const line = document.createElement('div');
  line.className = `terminal-line ${type}`;
  
  if (type === 'input') {
    line.innerHTML = `<span class="prompt">></span> <span class="line-content">${escapeHtml(content)}</span>`;
  } else if (type === 'streaming') {
    line.innerHTML = `<span class="prompt">></span> <span class="line-content" id="streaming-content"></span>`;
    // We'll update the streaming content separately
    terminalOutputEl.appendChild(line);
    return line.querySelector('#streaming-content');
  } else {
    line.innerHTML = `<span class="line-content">${escapeHtml(content)}</span>`;
  }
  
  terminalOutputEl.appendChild(line);
  terminalOutputEl.scrollTop = terminalOutputEl.scrollHeight;
  return line;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Handle input changes
function handleInput(e) {
  terminalInput = e.target.value;
  historyIndex = -1; // Reset history navigation when typing
}

// Handle key down events
async function handleKeyDown(e) {
  if (isStreaming) return;
  
  if (e.key === 'Enter') {
    e.preventDefault();
    if (terminalInput.trim() === '') return;
    
    const originalInput = terminalInput;
    addToOutput(originalInput, 'input');
    
    commandHistory.push(originalInput);
    historyIndex = -1;
    
    terminalInputEl.value = '';
    terminalInput = '';
    
    // Send to API
    await sendToApi(originalInput);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (commandHistory.length === 0) return;
    
    if (historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      historyIndex = newIndex;
      terminalInputEl.value = commandHistory[newIndex];
      terminalInput = commandHistory[newIndex];
    } else if (historyIndex === -1 && commandHistory.length > 0) {
      // Show latest history when at current input
      historyIndex = commandHistory.length - 1;
      terminalInputEl.value = commandHistory[historyIndex];
      terminalInput = commandHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex >= 0) {
      const newIndex = historyIndex - 1;
      if (newIndex >= 0) {
        historyIndex = newIndex;
        terminalInputEl.value = commandHistory[newIndex];
        terminalInput = commandHistory[newIndex];
      } else {
        historyIndex = -1;
        terminalInputEl.value = '';
        terminalInput = '';
      }
    }
  } else if (e.key === 'Escape') {
    e.preventDefault();
    terminalInputEl.value = '';
    terminalInput = '';
    historyIndex = -1;
  }
}

// Start streaming effect for a response
function streamResponse(fullResponse) {
  isStreaming = true;
  const streamingContentEl = addToOutput('', 'streaming');
  
  let charIndex = 0;
  const interval = setInterval(() => {
    if (charIndex < fullResponse.length) {
      streamingContentEl.textContent += fullResponse[charIndex];
      charIndex++;
      
      // Scroll to bottom
      terminalOutputEl.scrollTop = terminalOutputEl.scrollHeight;
    } else {
      clearInterval(interval);
      isStreaming = false;
    }
  }, 20); // 20ms per character for typing effect
}

// Send message to API and stream response
async function sendToApi(message) {
  isStreaming = true;
  
  const streamingContentEl = addToOutput('', 'streaming');
  
  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        history: chatHistory,
        session_id: sessionId,
        agent_type: agentType
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      streamingContentEl.textContent = `Error: ${error.error || 'Failed to get response'}`;
      isStreaming = false;
      return;
    }
    
    const data = await response.json();
    
    if (data.reply) {
      // Update chat history
      chatHistory.push({ role: 'user', text: message });
      chatHistory.push({ role: 'assistant', text: data.reply });
      
      // Stream the response
      let charIndex = 0;
      const reply = data.reply;
      
      const interval = setInterval(() => {
        if (charIndex < reply.length) {
          streamingContentEl.textContent += reply[charIndex];
          charIndex++;
          terminalOutputEl.scrollTop = terminalOutputEl.scrollHeight;
        } else {
          clearInterval(interval);
          isStreaming = false;
          
          // Show metadata
          if (data.metadata) {
            addToOutput(`--- (${data.metadata.tokens} tokens, ${data.metadata.agentType} agent)`, 'output');
          }
        }
      }, 15);
    }
  } catch (error) {
    streamingContentEl.textContent = `Error: ${error.message}`;
    isStreaming = false;
  }
}

// Start cursor blink animation
function startCursorBlink() {
  cursorEl.style.opacity = '1';
  setInterval(() => {
    if (!isStreaming) {
      cursorEl.style.opacity = cursorEl.style.opacity === '1' ? '0' : '1';
    }
  }, 500);
}

// Initialize the terminal when the DOM is loaded
document.addEventListener('DOMContentLoaded', initTerminal);

// Also initialize immediately in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTerminal);
} else {
  initTerminal();
}

// Keep the existing usage panel update function for compatibility
async function updateUsagePanel() {
  try {
    const res = await fetch(`${API_BASE}/api/usage`);
    if (res.ok) {
      const usageData = await res.json();
      console.log('Usage data:', usageData);
    }
  } catch (error) {
    console.warn('Failed to update usage panel:', error);
  }
}

// Update usage panel periodically
setInterval(updateUsagePanel, 5000); // Update every 5 seconds
// Initial load
updateUsagePanel();
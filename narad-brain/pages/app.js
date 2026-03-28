// Terminal-based interface for Narad
// Replace the app-container with the terminal instead of inserting at body start
const appContainer = document.querySelector('.app-container');
if (appContainer) {
  appContainer.innerHTML = '<div id="terminal-container"></div>';
}
const terminalContainer = document.getElementById('terminal-container');

// State for the terminal
let terminalOutput = [];
let terminalInput = '';
let commandHistory = [];
let historyIndex = -1;
let isStreaming = false;

// DOM elements
let terminalOutputEl;
let terminalInputEl;
let cursorEl;

// Initialize the terminal
function initTerminal() {
  // Create terminal structure - simplified single page design without logo
  terminalContainer.innerHTML = `
    <div class="terminal">
      <div class="terminal-header">
        <div class="terminal-title">
          <span>Narad AI Terminal</span>
        </div>
        <div class="terminal-status">
          <div class="status-item">
            <div class="status-dot connected"></div>
            <span>API Connected</span>
          </div>
          <div class="status-item">
            <div class="status-dot"></div>
            <span>Model: Claude 3</span>
          </div>
        </div>
      </div>
      
      <div class="terminal-body">
        <div class="terminal-output" id="terminal-output">
          <!-- Terminal output will be inserted here -->
        </div>
        <div class="terminal-input">
          <span class="prompt">></span>
          <input type="text" id="terminal-input" autocomplete="off" placeholder="Type a command...">
          <span class="cursor" id="cursor">█</span>
        </div>
      </div>
    </div>
  `;
  
  // Get references to elements
  terminalOutputEl = document.getElementById('terminal-output');
  terminalInputEl = document.getElementById('terminal-input');
  cursorEl = document.getElementById('cursor');
  
  // Add initial welcome message
  addToOutput('👋 Welcome to Narad AI Terminal. Type /help for available commands.');
  
  // Set up event listeners
  terminalInputEl.addEventListener('keydown', handleKeyDown);
  terminalInputEl.addEventListener('input', handleInput);
  
  // Start cursor blink animation
  startCursorBlink();
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
function handleKeyDown(e) {
  if (isStreaming) return; // Ignore input during streaming
  
  if (e.key === 'Enter') {
    e.preventDefault();
    if (terminalInput.trim() === '') return;
    
    // Store the original input before clearing
    const originalInput = terminalInput;
    
    // Add input line to output
    addToOutput(originalInput, 'input');
    
    // Add to history
    commandHistory.push(originalInput);
    historyIndex = -1; // Reset history index
    
    // Clear input
    terminalInputEl.value = '';
    terminalInput = '';
    
    // Process command
    const command = originalInput.trim();
    if (command.startsWith('/')) {
      const response = handleCommand(command.substring(1));
      streamResponse(response);
    } else {
      // Mock AI response for non-command input
      streamResponse(`You said: "${originalInput}"\nAI: I'm a mock AI. I only respond to commands. Type /help for help.`);
    }
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

// Handle commands
function handleCommand(command) {
  const [cmd, ...args] = command.trim().split(' ');
  const argString = args.join(' ');
  
  switch (cmd) {
    case 'help':
      return `Available commands:
  /help - Show this help message
  /run <command> - Simulate running a command
  /explain <topic> - Explain a topic
  `;
    case 'run':
      return `Running: ${argString}\nResult: Success!`;
    case 'explain':
      return `Explanation of ${argString}:\nThis is a mock explanation. In a real app, this would be generated by the AI.`;
    default:
      return `Unknown command: ${cmd}. Type /help for available commands.`;
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
    const res = await fetch('/api/usage');
    if (res.ok) {
      const usageData = await res.json();
      
      // Update terminal status based on usage
      // For now, just log to console
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
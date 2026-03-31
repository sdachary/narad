// Chitragupta Finance Dashboard

function getApiBase() {
  const metaApiBase = document.querySelector('meta[name="api-base"]')?.getAttribute('content');
  if (metaApiBase) return metaApiBase;
  
  const hostname = window.location.hostname;
  if (hostname.includes('localhost') || hostname === '127.0.0.1') {
    return 'http://localhost:8788';
  }
  return '';
}

const API_BASE = initApiBase();

function initApiBase() {
  const hostname = window.location.hostname;
  let apiBase;
  
  if (hostname.includes('localhost') || hostname === '127.0.0.1') {
    apiBase = 'http://localhost:8788';
  } else if (hostname.includes('pages.dev')) {
    apiBase = 'https://narad-7hc.pages.dev';
  } else if (hostname.includes('narad.io')) {
    apiBase = 'https://narad.io';
  } else {
    apiBase = '';
  }
  
  const metaApiBase = document.querySelector('meta[name="api-base"]');
  if (metaApiBase) {
    metaApiBase.setAttribute('content', apiBase);
  }
  
  return apiBase;
}

let sessionId = localStorage.getItem('narad_session_id') || 'session_' + Date.now();
localStorage.setItem('narad_session_id', sessionId);

// ============================================
// NAVIGATION
// ============================================

const navToggle = document.getElementById('nav-toggle');
const chitraguptaNav = document.getElementById('chitragupta-nav');
const navTabs = document.querySelectorAll('.nav-tab');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    chitraguptaNav.classList.toggle('open');
  });
}

navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    switchTab(tabName);
  });
});

function switchTab(tabName) {
  navTabs.forEach(t => t.classList.remove('active'));
  document.querySelector(`.nav-tab[data-tab="${tabName}"]`)?.classList.add('active');

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(`tab-${tabName}`)?.classList.add('active');

  chitraguptaNav.classList.remove('open');

  // Load data for specific tabs when they become active
  if (tabName === 'expenses') {
    loadExpenseTracking();
  } else if (tabName === 'insights') {
    loadFinancialInsights();
  } else if (tabName === 'settings') {
    loadSettings();
  }
}

// ============================================
// API FUNCTIONS
// ============================================

async function fetchApi(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`API Error: ${endpoint}`, e);
    return null;
  }
}

async function loadDashboard() {
  const statusEl = document.getElementById('api-status');
  const dotEl = document.getElementById('api-dot');
  
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (res.ok) {
      statusEl.textContent = 'Connected';
      dotEl.classList.add('connected');
    }
  } catch (e) {
    statusEl.textContent = 'Offline';
  }
  
  // Update holdings with live prices from NSE
  await fetchApi('/api/finance/prices/update');
  
  // Load dashboard summary
  const summary = await fetchApi('/api/finance/dashboard/summary');
  if (summary) {
    updateDashboardCards(summary);
  }
  
  // Load holdings
  const holdings = await fetchApi('/api/finance/holdings');
  if (holdings && holdings.holdings) {
    updateHoldingsDisplay(holdings.holdings);
  }
  
  // Load dividends
  const dividends = await fetchApi('/api/finance/dividends');
  if (dividends && dividends.dividends) {
    updateDividendsDisplay(dividends.dividends);
  }
  
  // Load recurring
  const recurring = await fetchApi('/api/finance/recurring');
  if (recurring && recurring.recurrings) {
    updateRecurringDisplay(recurring.recurrings);
  }
  
  // Load holdings summary
  const holdingsSummary = await fetchApi('/api/finance/holdings/summary');
  if (holdingsSummary) {
    document.getElementById('total-invested').textContent = formatCurrency(holdingsSummary.totalInvested);
    document.getElementById('total-current').textContent = formatCurrency(holdingsSummary.totalCurrent);
    document.getElementById('total-pnl').textContent = formatCurrency(holdingsSummary.totalPnl);
    document.getElementById('total-pnl').classList.add(holdingsSummary.totalPnl >= 0 ? 'gain' : 'loss');
  }
  
  // Load dividend summary
  const divSummary = await fetchApi('/api/finance/dividends/summary');
  if (divSummary) {
    document.getElementById('div-target').textContent = formatCurrency(divSummary.targetMonthly);
    document.getElementById('div-actual').textContent = formatCurrency(divSummary.actualMonthly);
    document.getElementById('div-extra').textContent = formatCurrency(divSummary.extra);
  }
}

function updateDashboardCards(data) {
  document.getElementById('net-worth').textContent = formatCurrency(data.netWorth);
  document.getElementById('bank-balance').textContent = formatCurrency(data.bankBalance);
  document.getElementById('investment-value').textContent = formatCurrency(data.investmentValue);
  document.getElementById('monthly-payout').textContent = formatCurrency(data.monthlyPayout);
  document.getElementById('upcoming-bills').textContent = formatCurrency(data.upcomingBills);

  // Holdings Overview (Pie Chart)
  if (data.holdings && data.holdings.length > 0) {
    updateHoldingsOverview(data.holdings);
  } else {
    document.getElementById('holdings-pie-chart').innerHTML = '<div class="empty-state">No holdings data</div>';
  }

  // Top Gainers/Losers
  if (data.holdings && data.holdings.length > 0) {
    updateTopGainersLosers(data.holdings);
  } else {
    document.getElementById('top-gainers-losers').innerHTML = '<div class="empty-state">No data</div>';
  }

  // Commodities
  if (data.commodities && data.commodities.length > 0) {
    const commoditiesHtml = data.commodities.map(c => `
      <div class="commodity-item">
        <span class="commodity-name">${c.name}</span>
        <span class="commodity-price">${formatCurrency(c.price)}</span>
        <span class="commodity-change ${c.change >= 0 ? 'gain' : 'loss'}">${c.change >= 0 ? '+' : ''}${c.change_percent?.toFixed(2)}%</span>
      </div>
    `).join('');
    document.getElementById('commodities-list').innerHTML = commoditiesHtml;
  }
}

function updateHoldingsDisplay(holdings) {
  // Top 5 for dashboard
  const top5 = holdings.slice(0, 5);
  const topHtml = top5.map(h => `
    <div class="holding-row">
      <div class="holding-symbol">${h.symbol}</div>
      <div class="holding-qty">${h.quantity} qty</div>
      <div class="holding-value">${formatCurrency(h.current_value)}</div>
      <div class="holding-pnl ${h.pnl >= 0 ? 'gain' : 'loss'}">${h.pnl >= 0 ? '+' : ''}${h.net_chg_percent?.toFixed(2)}%</div>
    </div>
  `).join('');
  
  document.getElementById('top-holdings').innerHTML = topHtml || '<div class="empty-state">No holdings</div>';
  
  // Full table
  const fullHtml = holdings.map(h => `
    <div class="holding-row-full">
      <div class="holding-cell symbol">${h.symbol}</div>
      <div class="holding-cell qty">${h.quantity}</div>
      <div class="holding-cell price">${formatCurrency(h.avg_cost)}</div>
      <div class="holding-cell ltp">${formatCurrency(h.ltp)}</div>
      <div class="holding-cell invested">${formatCurrency(h.invested)}</div>
      <div class="holding-cell current">${formatCurrency(h.current_value)}</div>
      <div class="holding-cell pnl ${h.pnl >= 0 ? 'gain' : 'loss'}">${formatCurrency(h.pnl)}</div>
      <div class="holding-cell pct ${h.net_chg_percent >= 0 ? 'gain' : 'loss'}">${h.net_chg_percent >= 0 ? '+' : ''}${h.net_chg_percent?.toFixed(2)}%</div>
    </div>
  `).join('');
  
  document.getElementById('holdings-full').innerHTML = fullHtml || '<div class="empty-state">No holdings</div>';
}

// Holdings Overview (Pie Chart)
function updateHoldingsOverview(holdings) {
  const pieChartEl = document.getElementById('holdings-pie-chart');
  if (!pieChartEl) return;

  // Calculate total value for percentages
  const totalValue = holdings.reduce((sum, h) => sum + (h.current_value || 0), 0);

  if (totalValue === 0) {
    pieChartEl.innerHTML = '<div class="empty-state">No holdings data</div>';
    return;
  }

  // Sort by value descending and take top 6
  const sortedHoldings = [...holdings]
    .sort((a, b) => (b.current_value || 0) - (a.current_value || 0))
    .slice(0, 6);

  // Create pie chart using CSS/conic-gradient (simplified representation)
  let html = '<div class="pie-chart-container">';

  let startAngle = 0;
  sortedHoldings.forEach((holding, index) => {
    const value = holding.current_value || 0;
    const percentage = (value / totalValue) * 100;
    const sliceAngle = (percentage / 100) * 360;

    html += `
      <div class="pie-slice" style="--start-angle: ${startAngle}deg; --slice-angle: ${sliceAngle}deg;">
        <div class="slice-label">
          <span class="symbol">${holding.symbol}</span>
          <span class="percentage">${percentage.toFixed(0)}%</span>
        </div>
      </div>
    `;

    startAngle += sliceAngle;
  });

  // Add remaining as "Others" if there are more than 6 holdings
  if (holdings.length > 6) {
    const othersValue = holdings.slice(6).reduce((sum, h) => sum + (h.current_value || 0), 0);
    const othersPercentage = (othersValue / totalValue) * 100;

    html += `
      <div class="pie-slice" style="--start-angle: ${startAngle}deg; --slice-angle: ${(othersPercentage / 100) * 360}deg;">
        <div class="slice-label">
          <span class="symbol">Others</span>
          <span class="percentage">${othersPercentage.toFixed(0)}%</span>
        </div>
      </div>
    `;
  }

  html += '</div>';

  // Add legend
  html += '<div class="pie-chart-legend">';
  sortedHoldings.forEach((holding, index) => {
    const value = holding.current_value || 0;
    const percentage = (value / totalValue) * 100;
    html += `
      <div class="legend-item">
        <div class="legend-color" style="background: var(--finance-accent);"></div>
        <span>${holding.symbol}: ${formatCurrency(value)} (${percentage.toFixed(1)}%)</span>
      </div>
    `;
  });
  if (holdings.length > 6) {
    const othersValue = holdings.slice(6).reduce((sum, h) => sum + (h.current_value || 0), 0);
    const othersPercentage = (othersValue / totalValue) * 100;
    html += `
      <div class="legend-item">
        <div class="legend-color" style="background: var(--finance-secondary);"></div>
        <span>Others: ${formatCurrency(othersValue)} (${othersPercentage.toFixed(1)}%)</span>
      </div>
    `;
  }
  html += '</div>';

  pieChartEl.innerHTML = html;
}

// Top Gainers/Losers
function updateTopGainersLosers(holdings) {
  const container = document.getElementById('top-gainers-losers');
  if (!container) return;

  // Sort by net_chg_percent for gainers and losers
  const sortedByChange = [...holdings]
    .filter(h => h.net_chg_percent !== null && h.net_chg_percent !== undefined)
    .sort((a, b) => b.net_chg_percent - a.net_chg_percent);

  const topGainers = sortedByChange.slice(0, 3);
  const topLosers = sortedByChange.slice(-3).reverse();

  let html = '<div class="gainers-losers-grid">';

  // Gainers section
  html += `
    <div class="section">
      <h4>Top Gainers</h4>
      <div class="list">
        ${topGainers.length > 0 ? topGainers.map(h => `
          <div class="item gain">
            <span class="symbol">${h.symbol}</span>
            <span class="change">+${h.net_chg_percent?.toFixed(2)}%</span>
          </div>
        `).join('') : '<div class="empty-state">No gainers</div>'}
      </div>
    </div>
  `;

  // Losers section
  html += `
    <div class="section">
      <h4>Top Losers</h4>
      <div class="list">
        ${topLosers.length > 0 ? topLosers.map(h => `
          <div class="item loss">
            <span class="symbol">${h.symbol}</span>
            <span class="change">${h.net_chg_percent?.toFixed(2)}%</span>
          </div>
        `).join('') : '<div class="empty-state">No losers</div>'}
      </div>
    </div>
  `;

  html += '</div>';

  container.innerHTML = html;
}

function updateDividendsDisplay(dividends) {
  // Dashboard list
  const listHtml = dividends.map(d => `
    <div class="dividend-row">
      <div class="dividend-symbol">${d.symbol}</div>
      <div class="dividend-allocation">${((d.allocation || 0) * 100).toFixed(0)}%</div>
      <div class="dividend-sip">${formatCurrency(d.monthly_sip)}</div>
      <div class="dividend-actual">${formatCurrency(d.actual_sip)}</div>
    </div>
  `).join('');
  
  document.getElementById('dividend-list').innerHTML = listHtml || '<div class="empty-state">No dividends</div>';
  
  // Full table
  const fullHtml = dividends.map(d => `
    <div class="dividend-row-full">
      <div class="dividend-cell symbol">${d.symbol}</div>
      <div class="dividend-cell name">${d.name}</div>
      <div class="dividend-cell ltp">${formatCurrency(d.ltp)}</div>
      <div class="dividend-cell allocation">${((d.allocation || 0) * 100).toFixed(0)}%</div>
      <div class="dividend-cell monthly">${formatCurrency(d.monthly_sip)}</div>
      <div class="dividend-cell qty">${d.quantity}</div>
      <div class="dividend-cell actual">${formatCurrency(d.actual_sip)}</div>
    </div>
  `).join('');
  
  document.getElementById('dividends-full').innerHTML = fullHtml || '<div class="empty-state">No dividends</div>';
}

function updateRecurringDisplay(recurrings) {
  const categories = {};
  recurrings.forEach(r => {
    if (!categories[r.category]) categories[r.category] = [];
    categories[r.category].push(r);
  });
  
  let html = '';
  for (const [cat, items] of Object.entries(categories)) {
    html += `<div class="recurring-category"><h4>${getCategoryIcon(cat)} ${cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>`;
    html += items.map(r => `
      <div class="recurring-item">
        <div class="recurring-name">${r.name}</div>
        <div class="recurring-amount">${formatCurrency(r.amount)}</div>
        <div class="recurring-freq">${r.frequency}</div>
      </div>
    `).join('');
    html += '</div>';
  }
  
  document.getElementById('recurring-cards').innerHTML = html || '<div class="empty-state">No recurring items</div>';
}

function getCategoryIcon(category) {
  const icons = {
    bill: '📄',
    insurance: '🛡️',
    goal: '🎯',
    safety: '🔒',
    gold: '🥇',
    loan: '💳',
    investment: '📈'
  };
  return icons[category] || '📌';
}

// ============================================
// CHAT FUNCTIONS
// ============================================

const floatingChatBtn = document.getElementById('floating-chat-btn');
const chatOverlay = document.getElementById('chat-overlay');
const chatFormOverlay = document.getElementById('chat-form-overlay');
let chatHistory = [];

function toggleChatOverlay() {
  chatOverlay.classList.toggle('open');
}

if (floatingChatBtn) {
  floatingChatBtn.addEventListener('click', toggleChatOverlay);
}

if (chatFormOverlay) {
  chatFormOverlay.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('user-input-overlay');
    const message = input.value.trim();
    if (!message) return;
    
    addChatMessage(message, 'user');
    input.value = '';
    
    await sendChatMessage(message);
  });
}

function addChatMessage(text, type) {
  const chatMessages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerHTML = `
    <div class="avatar">${type === 'user' ? '∼' : '⚡'}</div>
    <div class="message-content">${escapeHtml(text)}</div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage(message) {
  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: chatHistory,
        session_id: sessionId,
        agent_type: 'analyst'
      })
    });
    
    if (!response.ok) throw new Error('Chat failed');
    
    const data = await response.json();
    if (data.reply) {
      chatHistory.push({ role: 'user', text: message });
      chatHistory.push({ role: 'assistant', text: data.reply });
      addChatMessage(data.reply, 'assistant');
    }
  } catch (e) {
    addChatMessage('Sorry, I encountered an error. Please try again.', 'assistant');
  }
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// UTILITIES
// ============================================

function formatCurrency(amount) {
  if (amount == null) return '₹0';
  const num = parseFloat(amount);
  if (num >= 10000000) {
    return '₹' + (num / 10000000).toFixed(2) + 'Cr';
  } else if (num >= 100000) {
    return '₹' + (num / 100000).toFixed(2) + 'L';
  } else if (num >= 1000) {
    return '₹' + (num / 1000).toFixed(1) + 'K';
  }
  return '₹' + num.toFixed(2);
}

function refreshDashboard() {
  loadDashboard();
}

// Auto-refresh prices every 5 minutes
setInterval(async () => {
  await fetchApi('/api/finance/prices/update');
  const holdings = await fetchApi('/api/finance/holdings');
  if (holdings && holdings.holdings) {
    updateHoldingsDisplay(holdings.holdings);
  }
}, 5 * 60 * 1000);

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => loadDashboard());
if (document.readyState !== 'loading') loadDashboard();

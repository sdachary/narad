---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/external-js-md-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 321
size: 7707 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [documentation, markdown, project/narad, service]
---

# external-js-md-md-md-md.md

> Service / API client module (321 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/external-js-md-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 321 |
| **Size** | 7707 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/external-js-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 283
size: 6972 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, service]
---

# external-js-md-md-md.md

> Service / API client module (283 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/external-js-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 283 |
| **Size** | 6972 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/external-js-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 245
size: 6246 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, service]
---

# external-js-md-md.md

> Service / API client module (245 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/external-js-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 245 |
| **Size** | 6246 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/external-js-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 207
size: 5529 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, service]
---

# external-js-md.md

> Service / API client module (207 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/external-js-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 207 |
| **Size** | 5529 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/external-js.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 169
size: 4821 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, service]
---

# external-js.md

> Service / API client module (169 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/external-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 169 |
| **Size** | 4821 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/external.js"
project: "narad"
role: service
language: javascript
frameworks: []
lines: 131
size: 4129 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, javascript, project/narad, service]
---

# external.js

> Service / API client module (131 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/external.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 131 |
| **Size** | 4129 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```javascript
export async function fetchWebSearch(query, env) {
  const BRAVE_API_KEY = env.BRAVE_API_KEY;
  
  if (BRAVE_API_KEY) {
    try {
      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json', 'X-Subscription-Token': BRAVE_API_KEY }
      });
      if (response.ok) {
        const data = await response.ok ? await response.json() : null;
        if (data && data.web && data.web.results) {
          return data.web.results.map(r => ({
            title: r.title,
            snippet: r.description,
            url: r.url
          }));
        }
      }
    } catch (e) {
      console.warn('[Narad] Brave Search failed, falling back...', e);
    }
  }
  
  try {
    const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      }
    });
    if (response.ok) {
      const html = await response.text();
      const searchResults = [];
      
      const linkRegex = /<a class='result-link' href='([^']+)'>([\s\S]*?)<\/a>/g;
      const snippetRegex = /<td class='result-snippet'>([\s\S]*?)<\/td>/g;
      
      let linkMatch;
      while ((linkMatch = linkRegex.exec(html)) !== null && searchResults.length < 5) {
        const urlValue = linkMatch[1];
        const titleValue = linkMatch[2].replace(/<[^>]*>?/gm, '').trim();
        
        const snippetMatch = snippetRegex.exec(html);
        const snippetValue = snippetMatch ? snippetMatch[1].replace(/<[^>]*>?/gm, '').trim() : 'No snippet available.';
        
        searchResults.push({ url: urlValue, title: titleValue, snippet: snippetValue });
      }
      return searchResults.length > 0 ? searchResults : null;
    }
  } catch (e) {
    console.error('[Narad] DuckDuckGo Lite failed:', e);
  }
  return null;
}

export async function fetchStockData(query) {
  const { STOCK_MAPPINGS } = await import('../config/index.js');
  
  const lowerQuery = query.toLowerCase();
  let symbol = null;
  
  const symbolMatch = lowerQuery.match(/\b([A-Z0-9]+\.(NS|BO))\b/i);
  if (symbolMatch) {
    symbol = symbolMatch[1].toUpperCase();
  }
  
  if (!symbol) {
    for (const [name, sym] of Object.entries(STOCK_MAPPINGS)) {
      if (lowerQuery.includes(name)) {
        symbol = sym;
        break;
      }
    }
  }
  
  if (!symbol) {
    const wordMatch = query.match(/\b([A-Z]{2,10})\b/);
    if (wordMatch && !['NSE', 'BSE', 'INR', 'USD', 'AI', 'API', 'POST', 'GET'].includes(wordMatch[1])) {
      symbol = wordMatch[1] + '.NS';
    }
  }
  
  if (!symbol) return null;
  
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d&_=${Date.now()}`;
    
    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const result = data.chart?.result?.[0];
    if (!result) return null;
    
    const meta = result.meta;
    const date = new Date(meta.regularMarketTime * 1000);
    
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
    
    return {
      symbol: meta.symbol,
      price: meta.regularMarketPrice,
      currency: meta.currency,
      exchange: meta.exchangeName,
      change: meta.regularMarketPrice - meta.chartPreviousClose,
      changePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100).toFixed(2),
      time: formattedDate
    };
  } catch (error) {
    console.error(`[Narad] Stock fetch error: ${error.message}`);
    return null;
  }
}

```

```

```

```

```

```

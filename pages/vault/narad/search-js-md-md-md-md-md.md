---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/search-js-md-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 403
size: 8615 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, service]
---

# search-js-md-md-md-md.md

> Service / API client module (403 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/search-js-md-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 403 |
| **Size** | 8615 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/search-js-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 365
size: 7886 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, service]
---

# search-js-md-md-md.md

> Service / API client module (365 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/search-js-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 365 |
| **Size** | 7886 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/search-js-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 327
size: 7166 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, service]
---

# search-js-md-md.md

> Service / API client module (327 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/search-js-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 327 |
| **Size** | 7166 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/search-js-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 289
size: 6455 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, service]
---

# search-js-md.md

> Service / API client module (289 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/search-js-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 289 |
| **Size** | 6455 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/search-js.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 251
size: 5753 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, service]
---

# search-js.md

> Service / API client module (251 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/search-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 251 |
| **Size** | 5753 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/search.js"
project: "narad"
role: service
language: javascript
frameworks: []
lines: 213
size: 5067 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, javascript, project/narad, service]
---

# search.js

> Service / API client module (213 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/search.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 213 |
| **Size** | 5067 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```javascript
const SEARCH_CONFIG = {
  serper: {
    baseUrl: 'https://google.serper.dev/search',
    timeout: 10000
  },
  firecrawl: {
    baseUrl: 'https://api.firecrawl.dev/v1',
    timeout: 15000
  },
  defaultProvider: 'serper',
  maxResults: 10,
  cacheDuration: 300
};

export async function webSearch(query, options = {}) {
  const provider = options.provider || SEARCH_CONFIG.defaultProvider;
  const limit = options.limit || SEARCH_CONFIG.maxResults;
  
  switch (provider) {
    case 'serper':
      return serperSearch(query, limit, options.apiKey);
    case 'firecrawl':
      return firecrawlSearch(query, limit, options.apiKey);
    case 'brave':
      return braveSearch(query, limit, options.apiKey);
    case 'searxng':
      return searxngSearch(query, limit, options.apiKey);
    default:
      return serperSearch(query, limit, options.apiKey);
  }
}

async function serperSearch(query, limit, apiKey) {
  if (!apiKey) {
    return { error: 'SERPER_API_KEY required', results: [] };
  }
  
  try {
    const response = await fetch(SEARCH_CONFIG.serper.baseUrl, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        num: limit
      })
    });
    
    if (!response.ok) {
      throw new Error(`Serper error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const results = (data.organic || []).map(item => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      position: item.position,
      date: item.date
    }));
    
    return {
      provider: 'serper',
      results,
      meta: {
        query,
        count: results.length,
        timestamp: new Date().toISOString()
      }
    };
  } catch (e) {
    return { error: e.message, results: [] };
  }
}

async function firecrawlSearch(query, limit, apiKey) {
  if (!apiKey) {
    return { error: 'FIRECRAWL_API_KEY required', results: [] };
  }
  
  try {
    const response = await fetch(`${SEARCH_CONFIG.firecrawl.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        limit
      })
    });
    
    if (!response.ok) {
      throw new Error(`Firecrawl error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const results = (data.data || []).map(item => ({
      title: item.title,
      url: item.url,
      snippet: item.description,
      position: item.number,
      markdown: item.markdown
    }));
    
    return {
      provider: 'firecrawl',
      results,
      meta: {
        query,
        count: results.length,
        timestamp: new Date().toISOString()
      }
    };
  } catch (e) {
    return { error: e.message, results: [] };
  }
}

export async function scrapeUrl(url, options = {}) {
  const apiKey = options.apiKey;
  
  if (!apiKey) {
    return { error: 'FIRECRAWL_API_KEY required' };
  }
  
  try {
    const response = await fetch(`${SEARCH_CONFIG.firecrawl.baseUrl}/scrape`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html', 'text']
      })
    });
    
    if (!response.ok) {
      throw new Error(`Scrape error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      url,
      title: data.data?.title,
      content: data.data?.markdown || data.data?.text,
      html: data.data?.html,
      meta: {
        provider: 'firecrawl',
        timestamp: new Date().toISOString()
      }
    };
  } catch (e) {
    return { error: e.message, url };
  }
}

async function braveSearch(query, limit, apiKey) {
  return { error: 'Brave search not implemented', results: [] };
}

async function searxngSearch(query, limit, apiKey) {
  return { error: 'SearXNG search not implemented', results: [] };
}

export async function multiProviderSearch(query, options = {}) {
  const providers = options.providers || ['serper', 'firecrawl'];
  const apiKeys = options.apiKeys || {};
  
  const results = await Promise.allSettled(
    providers.map(provider => 
      webSearch(query, { 
        provider, 
        limit: options.limit,
        apiKey: apiKeys[provider]
      })
    )
  );
  
  const merged = [];
  const byUrl = new Map();
  
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.results) {
      for (const item of result.value.results) {
        if (!byUrl.has(item.url)) {
          byUrl.set(item.url, item);
          merged.push(item);
        }
      }
    }
  }
  
  merged.sort((a, b) => a.position - b.position);
  
  return {
    results: merged.slice(0, options.limit || SEARCH_CONFIG.maxResults),
    meta: {
      query,
      providers,
      totalResults: merged.length,
      timestamp: new Date().toISOString()
    }
  };
}

```

```

```

```

```

```

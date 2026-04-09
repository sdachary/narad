---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sw-js-md.md"
project: "narad"
role: service
language: markdown
frameworks: [cloudflare-workers, vite]
lines: 248
size: 6360 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [cloudflare-workers, documentation, markdown, project/narad, service, vite]
---

# sw-js-md.md

> Service / API client module using **cloudflare-workers, vite** (248 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sw-js-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, vite |
| **Lines** | 248 |
| **Size** | 6360 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/chitragupta/sw-js.md"
project: "narad"
role: service
language: markdown
frameworks: [cloudflare-workers, vite]
lines: 210
size: 5552 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [cloudflare-workers, documentation, markdown, project/narad, service, vite]
---

# sw-js.md

> Service / API client module using **cloudflare-workers, vite** (210 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/chitragupta/sw-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, vite |
| **Lines** | 210 |
| **Size** | 5552 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/public/sw.js"
project: "chitragupta"
role: service
language: javascript
frameworks: [cloudflare-workers, vite]
lines: 173
size: 4764 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [cloudflare-workers, code, javascript, project/chitragupta, service, vite]
---

# sw.js

> Service / API client module using **cloudflare-workers, vite** (173 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/public/sw.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | cloudflare-workers, vite |
| **Lines** | 173 |
| **Size** | 4764 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```javascript
const CACHE_NAME = 'chitragupta-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/signup.html',
  '/invite-partner.html',
  '/offline.html',
  '/src/css/styles.css',
  '/src/css/auth.css',
];

const API_CACHE = 'chitragupta-api-v1';
const API_CACHE_DURATION = 5 * 60 * 1000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (url.origin === location.origin && url.pathname.endsWith('.js')) {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  event.respondWith(cacheFirst(request, CACHE_NAME));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  const db = await openDB();
  const pending = await getAllPendingTransactions(db);
  for (const txn of pending) {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txn),
      });
      if (response.ok) {
        await deletePendingTransaction(db, txn.id);
      }
    } catch (e) {
      console.error('Sync failed:', e);
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('chitragupta-offline', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-transactions')) {
        db.createObjectStore('pending-transactions', { keyPath: 'id' });
      }
    };
  });
}

async function getAllPendingTransactions(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending-transactions', 'readonly');
    const store = tx.objectStore('pending-transactions');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deletePendingTransaction(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending-transactions', 'readwrite');
    const store = tx.objectStore('pending-transactions');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || 'New notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(data.title || 'Chitragupta', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
```

```

```

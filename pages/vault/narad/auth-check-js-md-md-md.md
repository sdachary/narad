---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/auth-check-js-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 196
size: 5121 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad]
---

# auth-check-js-md-md.md

> Authentication / authorization module (196 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/auth-check-js-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 196 |
| **Size** | 5121 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/auth-check-js-md.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 158
size: 4397 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad]
---

# auth-check-js-md.md

> Authentication / authorization module (158 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/auth-check-js-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 158 |
| **Size** | 4397 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/auth-check-js.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 120
size: 3682 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad]
---

# auth-check-js.md

> Authentication / authorization module (120 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/auth-check-js.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 120 |
| **Size** | 3682 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/auth-check.js"
project: "kanak"
role: auth
language: javascript
frameworks: []
lines: 82
size: 3004 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, code, javascript, project/kanak]
---

# auth-check.js

> Authentication / authorization module (82 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/auth-check.js` |
| **Role** | auth |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 82 |
| **Size** | 3004 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```javascript
/**
 * 🛡️ Auth Guard — session check + inactivity logout
 * Loaded on all dashboard pages (NOT on login.html or landing.html)
 */
(function() {
    const INACTIVITY_LIMIT = 900000; // 15 minutes
    let inactivityTimer;

    async function checkSession() {
        const connector = window.DB || (typeof DB !== 'undefined' ? DB : null);

        if (!connector) {
            setTimeout(checkSession, 500);
            return;
        }

        try {
            const { data: { session }, error } = await connector.auth.getSession();

            if (error) throw error;

            if (!session) {
                redirectToLogin();
            } else if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000)) {
                // Expired — try refresh before redirecting
                const { data: refreshed, error: refreshErr } = await connector.auth.refreshSession();
                if (refreshErr || !refreshed.session) {
                    redirectToLogin();
                } else {
                    sessionStorage.setItem('lastVerifiedAt', Date.now().toString());
                    startInactivityTimer();
                }
            } else {
                sessionStorage.setItem('lastVerifiedAt', Date.now().toString());
                startInactivityTimer();
            }
        } catch (err) {
            // Network error — grace window prevents false logouts
            const GRACE_WINDOW_MS = 60000;
            const lastVerified = sessionStorage.getItem('lastVerifiedAt');
            if (lastVerified && (Date.now() - parseInt(lastVerified)) < GRACE_WINDOW_MS) {
                console.warn('⚠️ Auth: network glitch, retrying in 15s');
                setTimeout(checkSession, 15000);
            } else {
                redirectToLogin();
            }
        }
    }

    function redirectToLogin() {
        // Guard against redirect loops
        if (!window.location.pathname.includes('login')) {
            sessionStorage.removeItem('lastVerifiedAt');
            window.location.href = '/login';
        }
    }

    function startInactivityTimer() {
        resetTimer();
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(e => {
            document.addEventListener(e, resetTimer, { passive: true });
        });
    }

    function resetTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(performAutoLogout, INACTIVITY_LIMIT);
    }

    async function performAutoLogout() {
        const connector = window.DB || (typeof DB !== 'undefined' ? DB : null);
        if (connector) { try { await connector.auth.signOut(); } catch(e) {} }
        sessionStorage.removeItem('lastVerifiedAt');
        window.location.href = '/login?reason=inactivity';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(checkSession, 300));
    } else {
        setTimeout(checkSession, 300);
    }
})();

```

```

```

```

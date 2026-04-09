---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/chitragupta/auth-css.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 165
size: 3470 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docs, documentation, markdown, project/narad]
---

# auth-css.md

> Documentation (165 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/chitragupta/auth-css.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 165 |
| **Size** | 3470 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/src/css/auth.css"
project: "chitragupta"
role: style
language: css
frameworks: []
lines: 127
size: 2828 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, css, project/chitragupta, style]
---

# auth.css

> Stylesheet (127 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/src/css/auth.css` |
| **Role** | style |
| **Language** | css |
| **Frameworks** | — |
| **Lines** | 127 |
| **Size** | 2828 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```css
.auth-container {
    max-width: 440px;
    margin: 8vh auto;
    padding: 60px 48px;
    background: var(--glass);
    backdrop-filter: var(--blur);
    border-radius: var(--radius);
    border: 1px solid var(--border-hi);
    box-shadow: var(--shadow-md);
    text-align: center;
    animation: authFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes authFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.auth-container h1 {
    margin-bottom: 2rem;
    font-weight: 800;
    font-size: 32px;
    letter-spacing: -1.5px;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.auth-container input {
    width: 100%;
    padding: 16px 20px;
    margin-bottom: 1.5rem;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--text);
    font-family: inherit;
    outline: none;
    transition: all 0.2s;
}

.auth-container input:focus {
    border-color: var(--primary);
    background: rgba(16, 185, 129, 0.05);
    box-shadow: 0 0 0 4px var(--primary-glow);
}

.auth-container button {
    width: 100%;
    padding: 18px;
    border-radius: 12px;
    border: none;
    background: var(--primary-gradient);
    color: #061423;
    font-weight: 800;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 15px var(--primary-glow);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.auth-container button:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 30px var(--primary-glow);
    filter: brightness(1.05);
}

.auth-container p {
    margin-top: 2rem;
    font-size: 14px;
    color: var(--text-dim);
}

.auth-container a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
}

.auth-container a:hover {
    color: var(--text);
}

.error-message {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
    padding: 12px;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    font-size: 14px;
    display: none;
    text-align: left;
    animation: authFadeIn 0.3s ease;
}

.error-message.show {
    display: block;
}

.btn-loading {
    position: relative;
    color: transparent !important;
    pointer-events: none;
}

.btn-loading::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    left: 50%;
    margin: -10px 0 0 -10px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

```

```

---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/src/css/auth.css"
project: "chitragupta"
role: style
language: css
frameworks: []
lines: 179
size: 4013 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:38"
tags: [code, css, project/chitragupta, style]
---

# auth.css

> Stylesheet (179 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/src/css/auth.css` |
| **Role** | style |
| **Language** | css |
| **Frameworks** | — |
| **Lines** | 179 |
| **Size** | 4013 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```css
.auth-container {
    max-width: 420px;
    margin: 8vh auto;
    padding: 48px;
    background: rgba(6, 20, 35, 0.7);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border-radius: 24px;
    border: 1px solid rgba(214, 228, 249, 0.1);
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
    text-align: center;
    animation: authFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    z-index: 1;
}

.auth-logo {
    width: 64px;
    height: 64px;
    margin: 0 auto 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ffbf70, #e0a458);
    border-radius: 16px;
    box-shadow: 0 0 32px rgba(255, 191, 112, 0.25);
}

.auth-logo .material-icons-round {
    font-size: 32px;
    color: #030810;
}

.auth-subtitle {
    color: #64748b;
    font-size: 15px;
    margin-top: -16px;
    margin-bottom: 32px;
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
    margin-bottom: 1.25rem;
    border-radius: 12px;
    border: 1px solid rgba(214, 228, 249, 0.1);
    background: rgba(255, 255, 255, 0.03);
    color: #f0f4f8;
    font-family: 'Sora', system-ui, sans-serif;
    font-size: 15px;
    outline: none;
    transition: all 0.3s ease;
}

.auth-container input::placeholder {
    color: #64748b;
}

.auth-container input:focus {
    border-color: #ffbf70;
    background: rgba(255, 191, 112, 0.05);
    box-shadow: 0 0 0 4px rgba(255, 191, 112, 0.15);
}

.auth-container input:hover:not(:focus) {
    border-color: rgba(214, 228, 249, 0.15);
}

.auth-container input:focus {
    border-color: var(--primary);
    background: rgba(16, 185, 129, 0.05);
    box-shadow: 0 0 0 4px var(--primary-glow);
}

.auth-container button {
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #ffbf70, #e0a458);
    color: #030810;
    font-weight: 700;
    font-size: 15px;
    font-family: 'Sora', system-ui, sans-serif;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 20px rgba(255, 191, 112, 0.25);
    letter-spacing: 0.5px;
}

.auth-container button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(255, 191, 112, 0.3);
    filter: brightness(1.05);
}

.auth-container button:active {
    transform: translateY(-1px);
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

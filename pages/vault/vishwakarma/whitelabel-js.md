---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/pages/services/whitelabel.js"
project: "vishwakarma"
role: config
language: javascript
frameworks: []
lines: 146
size: 3680 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [code, config, javascript, project/vishwakarma]
---

# whitelabel.js

> Configuration file for the project (146 lines).

**Key exports:** `getWhitelabelConfig`, `applyWhitelabel`, `generateCSS`, `listAvailableThemes`, `getDefaultTheme`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/pages/services/whitelabel.js` |
| **Role** | config |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 146 |
| **Size** | 3680 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```javascript
const WHITELABEL_CONFIG = {
  defaultTheme: {
    primaryColor: '#f0c040',
    secondaryColor: '#09090b',
    accentColor: '#00e5a0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    logoUrl: null,
    faviconUrl: null,
    companyName: 'Vishwakarma',
    supportEmail: 'support@example.com'
  },
  themes: {}
};

export function getWhitelabelConfig(clientId) {
  return WHITELABEL_CONFIG.themes[clientId] || WHITELABEL_CONFIG.defaultTheme;
}

export function applyWhitelabel(html, config) {
  let styledHtml = html;
  
  styledHtml = styledHtml.replace(/{{primaryColor}}/g, config.primaryColor);
  styledHtml = styledHtml.replace(/{{secondaryColor}}/g, config.secondaryColor);
  styledHtml = styledHtml.replace(/{{accentColor}}/g, config.accentColor);
  styledHtml = styledHtml.replace(/{{companyName}}/g, config.companyName);
  styledHtml = styledHtml.replace(/{{supportEmail}}/g, config.supportEmail);
  
  if (config.logoUrl) {
    styledHtml = styledHtml.replace(/{{logoUrl}}/g, config.logoUrl);
  }
  
  return styledHtml;
}

export async function setClientWhitelabel(env, clientId, config) {
  const validKeys = [
    'primaryColor', 'secondaryColor', 'accentColor', 
    'fontFamily', 'logoUrl', 'faviconUrl', 
    'companyName', 'supportEmail', 'customCSS'
  ];
  
  const filteredConfig = {};
  for (const key of validKeys) {
    if (config[key] !== undefined) {
      filteredConfig[key] = config[key];
    }
  }
  
  filteredConfig.updatedAt = new Date().toISOString();
  
  await env.RESOURCES.put(`whitelabel:${clientId}`, JSON.stringify(filteredConfig));
  
  return { success: true, clientId };
}

export async function getClientWhitelabel(env, clientId) {
  const stored = await env.RESOURCES.get(`whitelabel:${clientId}`, 'json');
  
  if (stored) {
    return { ...WHITELABEL_CONFIG.defaultTheme, ...stored };
  }
  
  return WHITELABEL_CONFIG.defaultTheme;
}

export function generateCSS(config) {
  return `
    :root {
      --primary: ${config.primaryColor};
      --secondary: ${config.secondaryColor};
      --accent: ${config.accentColor};
      --font-family: ${config.fontFamily};
    }
    
    .btn-primary {
      background: var(--primary);
      color: var(--secondary);
      border: none;
      padding: 10px 20px;
      border-radius: 7px;
      font-weight: 600;
      cursor: pointer;
    }
    
    .header-brand {
      color: var(--primary);
      font-weight: 700;
    }
    
    .accent-text {
      color: var(--accent);
    }
    
    body {
      font-family: var(--font-family);
    }
    
    ${config.customCSS || ''}
  `;
}

export async function generateWhitelabeledPage(env, clientId, template, data = {}) {
  const config = await getClientWhitelabel(env, clientId);
  const css = generateCSS(config);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${config.companyName}</title>
  <style>${css}</style>
  ${config.faviconUrl ? `<link rel="icon" href="${config.faviconUrl}">` : ''}
</head>
<body>
  ${template}
</body>
</html>
  `;
  
  return {
    html,
    config,
    css
  };
}

export function listAvailableThemes() {
  return Object.keys(WHITELABEL_CONFIG.themes);
}

export function getDefaultTheme() {
  return WHITELABEL_CONFIG.defaultTheme;
}

export async function importTheme(env, themeName, config) {
  if (!WHITELABEL_CONFIG.themes[themeName]) {
    return { error: 'Theme not found' };
  }
  
  const themeConfig = { ...WHITELABEL_CONFIG.themes[themeName], ...config };
  WHITELABEL_CONFIG.themes[themeName] = themeConfig;
  
  return { success: true, theme: themeName };
}

```

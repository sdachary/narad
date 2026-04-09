---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/CONNECTORS_SETUP-md.md"
project: "narad"
role: config
language: markdown
frameworks: [cloudflare-workers, docker, vite]
lines: 168
size: 4418 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [cloudflare-workers, config, docker, documentation, markdown, project/narad, vite]
---

# CONNECTORS_SETUP-md.md

> Configuration file for the project using **cloudflare-workers, docker, vite** (168 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/CONNECTORS_SETUP-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker, vite |
| **Lines** | 168 |
| **Size** | 4418 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/config/CONNECTORS_SETUP.md"
project: "narad"
role: config
language: markdown
frameworks: [cloudflare-workers, docker, vite]
lines: 130
size: 3563 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [cloudflare-workers, config, docker, documentation, markdown, project/narad, vite]
---

# CONNECTORS_SETUP.md

> Configuration file for the project using **cloudflare-workers, docker, vite** (130 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/config/CONNECTORS_SETUP.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker, vite |
| **Lines** | 130 |
| **Size** | 3563 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Chat Connectors Setup Guide

This guide explains how to set up Discord and Telegram bots for Narad.

## Discord Bot Setup

### Step 1: Create a Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "Narad")
3. Navigate to the "Bot" section in the left sidebar
4. Click "Reset Token" to get your bot token
5. Copy and save the token securely (you won't be able to see it again)

### Step 2: Configure Bot Permissions
1. In the Bot section, enable the following:
   - **Message Content Intent** (required for reading messages)
2. Go to "OAuth2" > "URL Generator"
3. Select scopes: `bot`
4. Select permissions:
   - `Send Messages`
   - `Read Message History`
   - `Manage Channels` (optional)
5. Copy the generated URL and open it in your browser

### Step 3: Invite the Bot
1. Select your Discord server from the dropdown
2. Click "Authorize"
3. Complete the CAPTCHA if required

### Step 4: Get Server and Channel IDs
1. Enable Developer Mode: User Settings > Advanced > Developer Mode
2. Right-click on your server name > "Copy ID" (Server ID)
3. Right-click on desired channels > "Copy ID" (Channel ID)

### Step 5: Configure Environment Variables
Add to your Cloudflare Workers secrets:
```
wrangler secret put DISCORD_BOT_TOKEN
```

### Step 6: Configure Server Mappings
Edit `connectors.js`:
```js
export const DISCORD_CONFIG = {
  enabled: true,
  botToken: '', // Set via env
  serverMappings: [
    {
      serverId: 'YOUR_SERVER_ID',
      channels: {
        'general': 'CHANNEL_ID',
        'ai-chat': 'CHANNEL_ID'
      }
    }
  ]
};
```

---

## Telegram Bot Setup

### Step 1: Create a Telegram Bot
1. Open Telegram and search for @BotFather
2. Send `/newbot` command
3. Follow the prompts to name your bot (must end in "bot")
4. BotFather will give you a token like `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`

### Step 2: Secure Your Bot Token
Copy and save the token securely. You can also use `/revoke` to invalidate tokens.

### Step 3: Get Your User ID
1. Search for @userinfobot on Telegram
2. Send any message to get your numeric User ID

### Step 4: Configure Allowed Users
Edit `connectors.js`:
```js
export const TELEGRAM_CONFIG = {
  enabled: true,
  botToken: '', // Set via env
  allowedUsers: ['YOUR_USER_ID', 'OTHER_USER_ID']
};
```

### Step 5: Configure Environment Variables
Add to your Cloudflare Workers secrets:
```
wrangler secret put TELEGRAM_BOT_TOKEN
```

### Step 6: Start the Bot
Send `/start` to your bot to activate it. The bot will only respond to users in the `allowedUsers` list when enabled.

---

## Environment Variable Setup

### Using Wrangler CLI
```bash
cd /home/deepak/Work/narad/pages
wrangler secret put DISCORD_BOT_TOKEN
wrangler secret put TELEGRAM_BOT_TOKEN
```

### Using Cloudflare Dashboard
1. Go to Cloudflare Dashboard > Workers & Pages
2. Select your Narad worker
3. Go to Settings > Variables
4. Add `DISCORD_BOT_TOKEN` and `TELEGRAM_BOT_TOKEN` as Secret Text

---

## Testing Your Connectors

After configuration, test by sending a message in Discord/Telegram. The bot should respond according to your chat routes.

Use the utility functions in `connectors.js`:
```js
import { isConnectorEnabled, getConnectorConfig, initConnector } from './config/connectors';

// Check if a connector is enabled
console.log(isConnectorEnabled('discord')); // true/false

// Get connector config
console.log(getConnectorConfig('telegram'));

// Initialize from environment
initConnector('discord', env);
```

```

```

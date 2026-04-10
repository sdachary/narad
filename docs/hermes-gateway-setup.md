# Hermes Gateway Setup Guide

## Prerequisites

1. **Telegram Bot Token** - Get from [@BotFather](https://t.me/BotFather)
2. **Narad deployed** - Need the deployed URL for webhook

---

## Step 1: Deploy Narad

```bash
cd .worktrees/feature-hermes-openclaude-integration
npx wrangler deploy
```

Note your deployed URL: `https://narad.*.workers.dev`

---

## Step 2: Add Secrets

```bash
# Telegram Bot Token
npx wrangler secret put TELEGRAM_BOT_TOKEN
# Enter your bot token from BotFather

# Webhook Secret (generate a random string)
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
# Enter: e.g., "hermes_secure_xyz123"

# Narad API Token (optional, for authenticated requests)
npx wrangler secret put NARAD_API_TOKEN
# Enter: your preferred API token
```

---

## Step 3: Set Telegram Webhook

```bash
# Replace YOUR_BOT_TOKEN and YOUR_WEBHOOK_SECRET
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -d "url=https://your-narad.workers.dev/api/hermes-webhook" \
  -d "secret_token=YOUR_WEBHOOK_SECRET"
```

---

## Step 4: Test

1. Open Telegram and find your bot
2. Send `/start` - should get welcome message
3. Send `/ask Hello, how are you?` - should get AI response
4. Send `/status` - should get service status
5. Send `/help` - should get help message

---

## Commands Available

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/ask <prompt>` | Chat with Narad AI |
| `/status` | Service status |
| `/help` | Help message |
| `/file list [path]` | List directory (future) |
| `/file read <path>` | Read file (future) |

---

## Troubleshooting

**Webhook not working:**
```bash
# Check webhook status
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"

# Delete and recreate webhook
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/deleteWebhook"
```

**Bot not responding:**
- Verify secrets are set: `wrangler secret list`
- Check worker logs in Cloudflare dashboard

**Rate limiting:**
- 2-second cooldown per user
- Check `/status` for uptime

---

## Security Notes

- `TELEGRAM_WEBHOOK_SECRET` verifies incoming requests
- Only messages from users who started the bot are processed
- Rate limiting prevents abuse
- API token optional for internal Narad calls
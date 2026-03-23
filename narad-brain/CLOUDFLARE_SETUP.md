# Cloudflare Setup Guide: Narad Brain

This guide covers the settings required for the `narad` project on Cloudflare Pages.

## 1. Environment Variables & Secrets

Go to **Settings** → **Functions** → **Environment variables**.

### Required Secrets
| Name | Type | Value Source |
|---|---|---|
| `GROQ_API_KEY` | Secret | Your Groq API Key (console.groq.com) |

### Optional Variables
| Name | Type | Default | Description |
|---|---|---|---|
| `PRIMARY_MODEL` | Variable | `llama-3.3-70b-versatile` | The model ID to use for inference. |
| `ENVIRONMENT` | Variable | `production` | Set to `dev` for local testing. |

## 2. Bindings (Optional)

If you wish to use Cloudflare's built-in models as a fallback, add an **AI Binding**:
- **Binding name**: `AI`

## 3. Custom Domain
To use `https://narad.pages.dev` or a custom domain:
- Go to **Custom domains** → **Set up a custom domain**.

## 4. Deployment Instructions

From the root of the `narad` repository:
```bash
cd narad-brain
npx wrangler pages deploy pages --project-name narad
```

# Narad Brain — AGI Worker & Web UI

Standalone intelligence brain for the Nisha Platform, deployed as a Cloudflare Pages project.

## Features
- **AGI Brain**: High-performance inference via Groq/OpenRouter.
- **Web UI**: Modern, premium chat interface with dark mode.
- **Integrated**: Serves both API (`/api/chat`) and Static assets from one deployment.

## Deployment
See [CLOUDFLARE_SETUP.md](../CLOUDFLARE_SETUP.md) for secrets and binding instructions.

```bash
# Deploy from narad-brain directory
npx wrangler pages deploy pages --project-name narad
```

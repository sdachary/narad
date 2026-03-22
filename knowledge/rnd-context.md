# Narad — R&D Context

> Edit this file to give Narad ongoing context about your active research areas.
> This file is NOT auto-synced — it's your personal R&D journal context.

## Active Research Areas

### Agent Economy & Monetization
- ATXP protocol (ex-Stripe founders) — agent-to-agent micropayments
- OpenRouter reseller model — buy credits bulk, sell with markup (INR-compatible today)
- NullClaw cooperative compute — client VMs earning credits via idle compute
- Golem Network — evaluated, not a fit for Always Free VMs

### IDE & Dev Tooling
- Google Antigravity — VS Code fork with free Claude Opus 4.6, parallel agents
- OpenCode — open source, MCP-native, terminal agent (95K stars)
- NullClaw — ops agent binary, now primary choice over PicoClaw
- Draftly MCP — cinematic frontend generation as a tool call

### Private Cloud Stack
- OCI Always Free: E2.1.Micro (1 OCPU, 1GB RAM) + ARM A1.Flex (4 OCPU, 24GB RAM free)
- Nextcloud on OCI: Docker Compose, Let's Encrypt SSL, nip.io domain
- Pi-hole: DNS-based ad blocking, port 8080 to avoid conflicts
- Tailscale: Zero-config VPN for secure VM access

### AI Infrastructure
- Groq free tier: Llama 3.3 70B, fastest inference, 6000 tokens/min
- Qdrant Cloud: 1GB free cluster, shared between Bhaina and Narad
- Workers AI: CF native, 10K neurons/day free, good for embeddings
- OpenRouter free models: Gemini 2.0 Flash, DeepSeek R1

## Experiments Log

| Experiment | Hypothesis | Status | Notes |
|---|---|---|---|
| Narad on OCI VM | NullClaw + Qdrant shared with Bhaina works on 1GB RAM | Trying | Install pending |
| Cloud Helper widget | Groq + GitHub README = free contextual help on provision page | Done | Deployed |
| Draftly MCP | Cinematic frontend via agent tool call | Planned | MCP server written |

## Ideas Backlog

> Ideas captured via Telegram will appear here via /digest command

<!-- Auto-populated by Narad -->

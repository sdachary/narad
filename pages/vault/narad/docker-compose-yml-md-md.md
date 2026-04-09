---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/docker-compose-yml-md.md"
project: "narad"
role: config
language: markdown
frameworks: [docker]
lines: 132
size: 2634 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, docker, documentation, markdown, project/narad]
---

# docker-compose-yml-md.md

> Configuration file for the project using **docker** (132 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/docker-compose-yml-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 132 |
| **Size** | 2634 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/docker-compose-yml.md"
project: "narad"
role: config
language: markdown
frameworks: [docker]
lines: 94
size: 1868 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [config, docker, documentation, markdown, project/narad]
---

# docker-compose-yml.md

> Configuration file for the project using **docker** (94 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/docker-compose-yml.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 94 |
| **Size** | 1868 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/docker/docker-compose.yml"
project: "unnati"
role: config
language: yaml
frameworks: [docker]
lines: 56
size: 1156 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, config, docker, project/unnati, yaml]
---

# docker-compose.yml

> Configuration file for the project using **docker** (56 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/docker/docker-compose.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | docker |
| **Lines** | 56 |
| **Size** | 1156 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```yaml
version: '3.8'

services:
  nextjs:
    build:
      context: ..
      dockerfile: docker/Dockerfile.nextjs
    container_name: unnati-nextjs
    ports:
      - "3000:3000"
      - "9229:9229"
    volumes:
      - ..:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_TELEMETRY_DISABLED=1
    env_file:
      - ../.env
    mem_limit: 1024m
    cpus: 1
    restart: unless-stopped
    networks:
      - unnati-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  worker:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: unnati-worker
    volumes:
      - .:/app
    env_file:
      - ../.env
    mem_limit: 512m
    cpus: 0.5
    restart: unless-stopped
    networks:
      - unnati-network
    depends_on:
      - nextjs

networks:
  unnati-network:
    driver: bridge

# This docker-compose is for EPHEMERAL use only
# Run: docker compose -f docker/docker-compose.yml up
# Stop: docker compose -f docker/docker-compose.yml down (auto-destroys containers)

```

```

```

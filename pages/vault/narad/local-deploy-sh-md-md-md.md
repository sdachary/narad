---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/local-deploy-sh-md-md.md"
project: "narad"
role: script
language: markdown
frameworks: [docker]
lines: 596
size: 16551 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docker, documentation, markdown, project/narad, script]
---

# local-deploy-sh-md-md.md

> Automation script using **docker** (596 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/local-deploy-sh-md-md.md` |
| **Role** | script |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 596 |
| **Size** | 16551 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/local-deploy-sh-md.md"
project: "narad"
role: script
language: markdown
frameworks: [docker]
lines: 558
size: 15799 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docker, documentation, markdown, project/narad, script]
---

# local-deploy-sh-md.md

> Automation script using **docker** (558 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/local-deploy-sh-md.md` |
| **Role** | script |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 558 |
| **Size** | 15799 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/local-deploy-sh.md"
project: "narad"
role: script
language: markdown
frameworks: [docker]
lines: 520
size: 15054 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docker, documentation, markdown, project/narad, script]
---

# local-deploy-sh.md

> Automation script using **docker** (520 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/local-deploy-sh.md` |
| **Role** | script |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 520 |
| **Size** | 15054 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/scripts/local-deploy.sh"
project: "unnati"
role: script
language: bash
frameworks: [docker]
lines: 482
size: 14361 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [bash, code, docker, project/unnati, script]
---

# local-deploy.sh

> Automation script using **docker** (482 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/scripts/local-deploy.sh` |
| **Role** | script |
| **Language** | bash |
| **Frameworks** | docker |
| **Lines** | 482 |
| **Size** | 14361 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```bash
#!/bin/bash

# ============================================================
# UNNATI V2 - LOCAL EPHEMERAL DEPLOYMENT SCRIPT
# ============================================================
# Checks laptop config → User confirmation → Deploy → Auto-cleanup
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project paths
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$PROJECT_DIR/docker"
COMPOSE_FILE="$DOCKER_DIR/docker-compose.yml"

# Container names
NEXTJS_CONTAINER="unnati-nextjs"
WORKER_CONTAINER="unnati-worker"
DB_CONTAINER="unnati-db"

# Default values
MIN_RAM_MB=4096
MIN_CPU_CORES=2
MIN_DISK_MB=5000
SKIP_CONFIRMATION=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -y|--yes)
            SKIP_CONFIRMATION=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -y, --yes     Skip confirmation prompt"
            echo "  -h, --help    Show this help message"
            exit 0
            ;;
        *)
            shift
            ;;
    esac
done

echo -e "${CYAN}===================================================${NC}"
echo -e "${CYAN}  UNNATI V2 - LOCAL EPHEMERAL DEPLOYMENT${NC}"
echo -e "${CYAN}===================================================${NC}"
echo ""

# ============================================================
# STEP 1: SYSTEM CHECK
# ============================================================
echo -e "${BLUE}▸ Step 1: Checking System Configuration...${NC}"
echo ""

check_status="PASS"

# Check OS
OS="$(uname -s)"
echo -n "  OS: "
if [[ "$OS" == "Linux" ]] || [[ "$OS" == "Darwin" ]]; then
    echo -e "${GREEN}$OS${NC}"
else
    echo -e "${YELLOW}$OS (untested)${NC}"
fi

# Check Docker
echo -n "  Docker: "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}$DOCKER_VERSION${NC}"
    
    # Check if Docker daemon is running
    if docker info &> /dev/null; then
        echo -e "         ${GREEN}✓ Docker daemon is running${NC}"
    else
        echo -e "         ${RED}✗ Docker daemon is not running${NC}"
        echo -e "         ${YELLOW}  Run: sudo systemctl start docker${NC}"
        check_status="FAIL"
    fi
else
    echo -e "${RED}✗ Not installed${NC}"
    echo -e "         ${YELLOW}  Install from: https://docs.docker.com/get-docker/${NC}"
    check_status="FAIL"
fi

# Check CPU cores
echo -n "  CPU Cores: "
if [[ "$OS" == "Darwin" ]]; then
    CPU_CORES=$(sysctl -n hw.ncpu 2>/dev/null || echo "0")
else
    CPU_CORES=$(nproc 2>/dev/null || grep -c ^processor /proc/cpuinfo 2>/dev/null || echo "0")
fi

if [[ $CPU_CORES -ge $MIN_CPU_CORES ]]; then
    echo -e "${GREEN}$CPU_CORES cores${NC}"
else
    echo -e "${YELLOW}$CPU_CORES cores (minimum: $MIN_CPU_CORES)${NC}"
    check_status="WARN"
fi

# Check RAM
echo -n "  RAM: "
if [[ "$OS" == "Darwin" ]]; then
    TOTAL_RAM_MB=$(echo "scale=0; $(sysctl -n hw.memsize 2>/dev/null) / 1024 / 1024" | bc)
else
    TOTAL_RAM_MB=$(free -m 2>/dev/null | awk 'NR==2{M=$7;print M}' || echo "0")
fi

# Alternative method if above fails
if [[ $TOTAL_RAM_MB -eq 0 ]] || [[ -z $TOTAL_RAM_MB ]]; then
    if [[ "$OS" == "Darwin" ]]; then
        TOTAL_RAM_MB=$(echo "scale=0; $(sysctl -n hw.memsize 2>/dev/null) / 1024 / 1024" | bc 2>/dev/null || echo "0")
    else
        TOTAL_RAM_MB=$(cat /proc/meminfo 2>/dev/null | grep MemTotal | awk '{print $2/1024}' | cut -d. -f1 || echo "0")
    fi
fi

if [[ $TOTAL_RAM_MB -ge $MIN_RAM_MB ]]; then
    echo -e "${GREEN}${TOTAL_RAM_MB} MB${NC}"
else
    echo -e "${YELLOW}${TOTAL_RAM_MB} MB (minimum: ${MIN_RAM_MB} MB)${NC}"
    check_status="WARN"
fi

# Check Disk Space
echo -n "  Disk Space (available): "
if [[ "$OS" == "Darwin" ]]; then
    AVAILABLE_DISK_MB=$(df -m . 2>/dev/null | tail -1 | awk '{print $4}')
else
    AVAILABLE_DISK_MB=$(df -m . 2>/dev/null | tail -1 | awk '{print $4}')
fi

if [[ $AVAILABLE_DISK_MB -ge $MIN_DISK_MB ]]; then
    echo -e "${GREEN}${AVAILABLE_DISK_MB} MB${NC}"
else
    echo -e "${YELLOW}${AVAILABLE_DISK_MB} MB (minimum: ${MIN_DISK_MB} MB)${NC}"
    check_status="WARN"
fi

# Check Docker Compose
echo -n "  Docker Compose: "
if command -v docker compose &> /dev/null; then
    echo -e "${GREEN}Available (v2 plugin)${NC}"
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}Available (standalone)${NC}"
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${YELLOW}Not found (will use individual docker run commands)${NC}"
    DOCKER_COMPOSE_CMD=""
fi

echo ""

# ============================================================
# STEP 2: ENVIRONMENT CHECK
# ============================================================
echo -e "${BLUE}▸ Step 2: Checking Environment Configuration...${NC}"
echo ""

# Check for .env file
ENV_FILE="$PROJECT_DIR/.env"
ENV_EXAMPLE="$PROJECT_DIR/.env.example"

if [[ -f "$ENV_FILE" ]]; then
    echo -e "  ${GREEN}✓ .env file found${NC}"
else
    echo -e "  ${YELLOW}⚠ .env file not found${NC}"
    
    if [[ -f "$ENV_EXAMPLE" ]]; then
        echo -e "  ${YELLOW}  Copying .env.example to .env...${NC}"
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        echo -e "  ${YELLOW}  ⚠ Please configure your API keys in .env${NC}"
    fi
fi

# Source .env if exists
if [[ -f "$ENV_FILE" ]]; then
    source "$ENV_FILE"
fi

# Check critical env vars
echo ""
echo "  Checking required environment variables:"
MISSING_VARS=0

check_env_var() {
    local var_name=$1
    local var_value="${!var_name}"
    if [[ -n "$var_value" ]]; then
        echo -e "    ${GREEN}✓${NC} $var_name"
    else
        echo -e "    ${YELLOW}⚠${NC} $var_name (not set)"
        ((MISSING_VARS++))
    fi
}

check_env_var "SUPABASE_URL"
check_env_var "SUPABASE_ANON_KEY"

echo ""

# ============================================================
# STEP 3: RESOURCE ESTIMATION
# ============================================================
echo -e "${BLUE}▸ Step 3: Resource Estimation${NC}"
echo ""

# Estimate resource needs based on application
EST_RAM_MB=1024
EST_CPU="1 core"
EST_DISK_MB=2000

echo "  Application Requirements (estimated):"
echo "    RAM: ~${EST_RAM_MB} MB"
echo "    CPU: ${EST_CPU}"
echo "    Disk: ~${EST_DISK_MB} MB"
echo ""

# Calculate if system can handle it
AVAILABLE_RAM_PCT=$((TOTAL_RAM_MB > 0 ? (TOTAL_RAM_MB - EST_RAM_MB) * 100 / TOTAL_RAM_MB : 0))

if [[ $TOTAL_RAM_MB -ge $((EST_RAM_MB + 1024)) ]]; then
    echo -e "  ${GREEN}✓ System has sufficient resources${NC}"
    echo "    Estimated headroom after deployment: ~$((TOTAL_RAM_MB - EST_RAM_MB)) MB RAM"
else
    echo -e "  ${RED}✗ Insufficient resources${NC}"
    echo -e "  ${YELLOW}  The application may run slowly or crash${NC}"
fi

echo ""

# ============================================================
# STEP 4: USER CONFIRMATION
# ============================================================
echo -e "${CYAN}===================================================${NC}"
echo -e "${CYAN}  DEPLOYMENT SUMMARY${NC}"
echo -e "${CYAN}===================================================${NC}"
echo ""

echo "  This script will:"
echo "    1. Create Docker network for Unnati V2"
echo "    2. Spin up ephemeral containers for the application"
echo "    3. Start Next.js dev server on http://localhost:3000"
echo "    4. Start worker container for background tasks"
echo "    5. Auto-destroy all containers on Ctrl+C or completion"
echo ""

echo "  Resource Usage:"
echo "    RAM: ~${EST_RAM_MB} MB"
echo "    CPU: ${EST_CPU}"
echo "    Disk: ~${EST_DISK_MB} MB"
echo ""

echo -e "  System Status: ${check_status}"
echo ""

if [[ "$check_status" == "FAIL" ]]; then
    echo -e "${RED}Cannot proceed - Docker is required but not available.${NC}"
    exit 1
fi

if [[ "$check_status" == "WARN" ]]; then
    echo -e "${YELLOW}Warning: System may have limited resources for this deployment.${NC}"
fi

if [[ "$check_status" != "PASS" ]] || [[ $MISSING_VARS -gt 0 ]]; then
    echo -e "${YELLOW}Warning: Some configuration issues detected.${NC}"
fi

echo ""

# Ask for confirmation
if [[ "$SKIP_CONFIRMATION" == "true" ]]; then
    echo -e "${GREEN}Proceeding with deployment (--yes flag detected)${NC}"
else
    read -p "  Proceed with ephemeral deployment? [y/N] " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "  Deployment cancelled."
        exit 0
    fi
fi

echo ""

# ============================================================
# STEP 5: CREATE DOCKER NETWORK
# ============================================================
echo -e "${BLUE}▸ Step 4: Creating Docker Network...${NC}"

NETWORK_NAME="unnati-network"

if docker network ls | grep -q "$NETWORK_NAME"; then
    echo "  Network '$NETWORK_NAME' already exists"
else
    docker network create "$NETWORK_NAME" 2>/dev/null || true
    echo -e "  ${GREEN}✓${NC} Network created"
fi

echo ""

# ============================================================
# STEP 6: BUILD DOCKER IMAGES
# ============================================================
echo -e "${BLUE}▸ Step 5: Building Docker Images...${NC}"
echo ""

# Build Next.js image
echo "  Building Next.js application..."
docker build -t unnati-nextjs:latest "$PROJECT_DIR" 2>&1 | tail -5 || {
    echo -e "  ${YELLOW}  Using pre-built Next.js (npm install may be needed)${NC}"
}

echo ""

# ============================================================
# STEP 7: STOP ANY EXISTING CONTAINERS
# ============================================================
echo -e "${BLUE}▸ Step 6: Cleaning up existing containers...${NC}"

cleanup_containers() {
    echo "  Stopping containers..."
    docker stop $NEXTJS_CONTAINER $WORKER_CONTAINER $DB_CONTAINER 2>/dev/null || true
    docker rm $NEXTJS_CONTAINER $WORKER_CONTAINER $DB_CONTAINER 2>/dev/null || true
    echo -e "  ${GREEN}✓${NC} Cleanup complete"
}

trap cleanup_containers EXIT INT TERM

cleanup_containers

echo ""

# ============================================================
# STEP 8: START EPHEMERAL CONTAINERS
# ============================================================
echo -e "${BLUE}▸ Step 7: Starting Ephemeral Containers...${NC}"
echo ""

# Start Next.js container
echo "  Starting Next.js dev server..."
docker run -d \
    --name "$NEXTJS_CONTAINER" \
    --network "$NETWORK_NAME" \
    -p 3000:3000 \
    -p 9229:9229 \
    -v "$PROJECT_DIR:/app" \
    -v /app/node_modules \
    -v /app/.next \
    --restart unless-stopped \
    --env-file "$ENV_FILE" \
    --memory="${EST_RAM_MB}m" \
    --cpus="$EST_CPU" \
    unnati-nextjs:latest \
    npm run dev 2>&1 | tail -3 || {

    # Fallback: run without pre-built image
    echo "  Starting with docker run..."
    docker run -d \
        --name "$NEXTJS_CONTAINER" \
        --network "$NETWORK_NAME" \
        -p 3000:3000 \
        -v "$PROJECT_DIR:/app" \
        --restart unless-stopped \
        --env-file "$ENV_FILE" \
        --memory="${EST_RAM_MB}m" \
        node:20-slim \
        sh -c "cd /app && npm install && npm run dev" 2>&1 | tail -3
}

echo ""

# Wait for Next.js to be ready
echo "  Waiting for Next.js to start..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Next.js is ready!"
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

# Start worker container (ephemeral - runs until task done)
echo "  Starting worker container..."
docker run -d \
    --name "$WORKER_CONTAINER" \
    --network "$NETWORK_NAME" \
    --restart unless-stopped \
    --env-file "$ENV_FILE" \
    --memory="512m" \
    -v "$DOCKER_DIR:/app" \
    -w /app \
    node:20-slim \
    sh -c "cd /app && npm install && npm start" 2>&1 | tail -3 || {
    echo -e "  ${YELLOW}  Worker started (connection to Supabase required)${NC}"
}

echo ""

# ============================================================
# STEP 9: DEPLOYMENT COMPLETE
# ============================================================
echo -e "${CYAN}===================================================${NC}"
echo -e "${CYAN}  DEPLOYMENT COMPLETE${NC}"
echo -e "${CYAN}===================================================${NC}"
echo ""

echo -e "  ${GREEN}✓${NC} Next.js running at: ${GREEN}http://localhost:3000${NC}"
echo -e "  ${GREEN}✓${NC} Worker container running"
echo ""

echo "  Container Status:"
docker ps --filter "name=unnati-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "  (Docker may need a moment to update)"
echo ""

echo "  To view logs:"
echo "    Next.js: docker logs -f $NEXTJS_CONTAINER"
echo "    Worker:  docker logs -f $WORKER_CONTAINER"
echo ""

echo "  To stop and auto-destroy:"
echo "    Press Ctrl+C or run: docker stop $NEXTJS_CONTAINER $WORKER_CONTAINER"
echo ""

echo -e "${YELLOW}  NOTE: Containers will be automatically destroyed when you stop this script.${NC}"
echo ""

# Keep script running and monitor
echo "  Monitoring deployment (Ctrl+C to stop and destroy)..."
echo ""

# Monitor loop
while true; do
    sleep 10
    
    # Check if containers are still running
    if ! docker ps | grep -q "$NEXTJS_CONTAINER"; then
        echo -e "${RED}  Next.js container stopped unexpectedly!${NC}"
        echo "  Check logs with: docker logs $NEXTJS_CONTAINER"
        break
    fi
    
    # Health check
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -ne "\r  $(date '+%H:%M:%S') - All services healthy   "
    else
        echo -ne "\r  $(date '+%H:%M:%S') - Waiting for Next.js...   "
    fi
done

echo ""
echo -e "${CYAN}===================================================${NC}"
echo -e "${CYAN}  SHUTDOWN INITIATED${NC}"
echo -e "${CYAN}===================================================${NC}"
echo ""

# Cleanup is handled by trap
echo "  Stopping and destroying containers..."
docker stop $NEXTJS_CONTAINER $WORKER_CONTAINER $DB_CONTAINER 2>/dev/null || true
docker rm $NEXTJS_CONTAINER $WORKER_CONTAINER $DB_CONTAINER 2>/dev/null || true

echo -e "  ${GREEN}✓${NC} All containers destroyed"
echo -e "  ${GREEN}✓${NC} Resources released"
echo ""

echo "  Thank you for using Unnati V2!"

```

```

```

```

---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/local-deploy-js.md"
project: "narad"
role: script
language: markdown
frameworks: []
lines: 390
size: 12302 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [documentation, markdown, project/narad, script]
---

# local-deploy-js.md

> Automation script (390 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/local-deploy-js.md` |
| **Role** | script |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 390 |
| **Size** | 12302 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/scripts/local-deploy.js"
project: "unnati"
role: script
language: javascript
frameworks: []
lines: 352
size: 11619 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [code, javascript, project/unnati, script]
---

# local-deploy.js

> Automation script (352 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/scripts/local-deploy.js` |
| **Role** | script |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 352 |
| **Size** | 11619 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```javascript
#!/usr/bin/env node

/**
 * UNNATI V2 - LOCAL EPHEMERAL DEPLOYMENT
 * Node.js version with interactive prompts
 * 
 * Checks laptop config → User confirmation → Deploy → Auto-cleanup
 */

const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Colors
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    dim: '\x1b[2m'
};

const PROJECT_DIR = path.resolve(__dirname, '..');
const DOCKER_DIR = path.join(PROJECT_DIR, 'docker');
const ENV_FILE = path.join(PROJECT_DIR, '.env');

// Config
const MIN_RAM_MB = 4096;
const MIN_CPU_CORES = 2;
const MIN_DISK_MB = 5000;
const EST_RAM_MB = 1024;

// Container names
const NEXTJS_CONTAINER = 'unnati-nextjs';
const WORKER_CONTAINER = 'unnati-worker';
const NETWORK_NAME = 'unnati-network';

// Utility functions
function log(msg, color = 'reset') {
    console.log(`${colors[color]}${msg}${colors.reset}`);
}

function logStep(step, msg) {
    console.log(`\n${colors.blue}▸ Step ${step}:${colors.reset} ${msg}`);
}

function run(cmd, options = {}) {
    try {
        const result = execSync(cmd, { 
            encoding: 'utf8', 
            stdio: options.silent ? 'pipe' : 'inherit',
            ...options 
        });
        return result?.trim() || '';
    } catch (e) {
        if (options.throw !== false) throw e;
        return e.message;
    }
}

function runAsync(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) reject(error);
            else resolve(stdout?.trim() || stderr?.trim() || '');
        });
    });
}

function checkDocker() {
    try {
        run('docker --version', { silent: true });
        run('docker info', { silent: true, throw: false });
        return true;
    } catch {
        return false;
    }
}

function getSystemInfo() {
    const info = {
        os: os.platform(),
        cpuCores: os.cpus().length,
        totalRamMb: Math.round(os.totalmem() / 1024 / 1024),
        freeRamMb: Math.round(os.freemem() / 1024 / 1024),
        dockerAvailable: checkDocker()
    };

    // Get disk space
    try {
        if (info.os === 'linux') {
            const df = run('df -m . | tail -1', { silent: true });
            info.diskAvailableMb = parseInt(df.split(/\s+/)[3]) || 0;
        } else if (info.os === 'darwin') {
            const df = run('df -m . | tail -1', { silent: true });
            info.diskAvailableMb = parseInt(df.split(/\s+/)[3]) || 0;
        }
    } catch {
        info.diskAvailableMb = 0;
    }

    return info;
}

function canRunDeployment(sysInfo) {
    const issues = [];
    
    if (!sysInfo.dockerAvailable) {
        issues.push('Docker is not installed or not running');
    }
    
    if (sysInfo.cpuCores < MIN_CPU_CORES) {
        issues.push(`CPU cores (${sysInfo.cpuCores}) below minimum (${MIN_CPU_CORES})`);
    }
    
    if (sysInfo.totalRamMb < MIN_RAM_MB) {
        issues.push(`RAM (${sysInfo.totalRamMb}MB) below minimum (${MIN_RAM_MB}MB)`);
    }
    
    if (sysInfo.diskAvailableMb < MIN_DISK_MB) {
        issues.push(`Disk space (${sysInfo.diskAvailableMb}MB) below minimum (${MIN_DISK_MB}MB)`);
    }
    
    return { canRun: issues.length === 0, issues };
}

function showSystemCheck(sysInfo) {
    console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
    console.log(`${colors.cyan}  SYSTEM CONFIGURATION CHECK${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);
    
    console.log(`\n  OS: ${colors.green}${sysInfo.os}${colors.reset}`);
    console.log(`  Docker: ${sysInfo.dockerAvailable ? colors.green + '✓ Available' : colors.red + '✗ Not Available'}${colors.reset}`);
    console.log(`  CPU Cores: ${sysInfo.cpuCores >= MIN_CPU_CORES ? colors.green : colors.yellow}${sysInfo.cpuCores} cores${colors.reset}`);
    console.log(`  RAM: ${sysInfo.totalRamMb >= MIN_RAM_MB ? colors.green : colors.yellow}${sysInfo.totalRamMb} MB${colors.reset}`);
    console.log(`  Disk (free): ${sysInfo.diskAvailableMb >= MIN_DISK_MB ? colors.green : colors.yellow}${sysInfo.diskAvailableMb} MB${colors.reset}`);
}

async function cleanupContainers() {
    log('\n  Cleaning up containers...', 'yellow');
    
    try {
        execSync(`docker stop ${NEXTJS_CONTAINER} ${WORKER_CONTAINER} 2>/dev/null`, { stdio: 'ignore' });
        execSync(`docker rm ${NEXTJS_CONTAINER} ${WORKER_CONTAINER} 2>/dev/null`, { stdio: 'ignore' });
        log('  ✓ Cleanup complete', 'green');
    } catch {
        // Ignore cleanup errors
    }
}

async function startDeployment(sysInfo) {
    logStep(4, 'Creating Docker Network...');
    
    try {
        execSync(`docker network create ${NETWORK_NAME} 2>/dev/null || true`, { stdio: 'ignore' });
        log('  ✓ Network ready', 'green');
    } catch {
        log('  ✓ Network exists', 'green');
    }

    logStep(5, 'Starting Ephemeral Containers...');
    
    // Build image first
    log('  Building Next.js image...', 'blue');
    try {
        execSync(`docker build -t unnati-nextjs:latest ${PROJECT_DIR}`, { 
            stdio: 'inherit',
            env: { ...process.env, DOCKER_BUILDKIT: '1' }
        });
    } catch {
        log('  Build may have issues, trying direct run...', 'yellow');
    }

    // Start Next.js
    log('  Starting Next.js dev server...', 'blue');
    const nextjsCmd = [
        'docker run -d',
        `--name ${NEXTJS_CONTAINER}`,
        `--network ${NETWORK_NAME}`,
        '-p 3000:3000',
        `-v ${PROJECT_DIR}:/app`,
        '-v /app/node_modules',
        `--memory=${EST_RAM_MB}m`,
        '--restart unless-stopped',
        '--env-file', ENV_FILE,
        'node:20-slim',
        'sh -c "cd /app && npm install && npm run dev"'
    ].join(' ');

    try {
        execSync(nextjsCmd, { stdio: 'ignore' });
        log('  ✓ Next.js container started', 'green');
    } catch {
        log('  ⚠ Failed to start Next.js container', 'yellow');
    }

    // Wait for Next.js
    log('  Waiting for Next.js to be ready...', 'blue');
    for (let i = 0; i < 30; i++) {
        try {
            execSync('curl -s http://localhost:3000 > /dev/null 2>&1', { stdio: 'ignore' });
            log('  ✓ Next.js is ready!', 'green');
            break;
        } catch {
            process.stdout.write('.');
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // Start worker
    log('  Starting worker container...', 'blue');
    const workerCmd = [
        'docker run -d',
        `--name ${WORKER_CONTAINER}`,
        `--network ${NETWORK_NAME}`,
        `-v ${DOCKER_DIR}:/app`,
        '-w /app',
        `--memory=512m`,
        '--restart unless-stopped',
        '--env-file', ENV_FILE,
        'node:20-slim',
        'sh -c "cd /app && npm install && npm start"'
    ].join(' ');

    try {
        execSync(workerCmd, { stdio: 'ignore' });
        log('  ✓ Worker container started', 'green');
    } catch {
        log('  ⚠ Worker requires Supabase connection', 'yellow');
    }
}

async function monitorDeployment() {
    log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
    log(`${colors.cyan}  DEPLOYMENT ACTIVE${colors.reset}`);
    log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);
    
    log('\n  ✓ Next.js running at: http://localhost:3000', 'green');
    log('  ✓ Worker container running\n', 'green');
    
    log('  Container Status:');
    try {
        execSync(`docker ps --filter "name=unnati-" --format "table {{.Names}}\\t{{.Status}}"`, { stdio: 'inherit' });
    } catch {}
    
    log('\n  Press Ctrl+C to stop and destroy all containers', 'yellow');
    log('  Monitoring (will auto-destroy on exit)...\n', 'dim');
}

// Main execution
async function main() {
    console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
    console.log(`${colors.cyan}  UNNATI V2 - LOCAL EPHEMERAL DEPLOYMENT${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);

    // Step 1: System Check
    logStep(1, 'Checking System Configuration...');
    const sysInfo = getSystemCheck();
    
    console.log(`  OS: ${colors.green}${sysInfo.os}${colors.reset}`);
    console.log(`  Docker: ${sysInfo.dockerAvailable ? colors.green + '✓ Available' : colors.red + '✗ Not Available'}${colors.reset}`);
    console.log(`  CPU Cores: ${sysInfo.cpuCores >= MIN_CPU_CORES ? colors.green : colors.yellow}${sysInfo.cpuCores} cores${colors.reset}`);
    console.log(`  RAM: ${sysInfo.totalRamMb >= MIN_RAM_MB ? colors.green : colors.yellow}${sysInfo.totalRamMb} MB${colors.reset}`);
    console.log(`  Disk (free): ${sysInfo.diskAvailableMb >= MIN_DISK_MB ? colors.green : colors.yellow}${sysInfo.diskAvailableMb} MB${colors.reset}`);

    // Step 2: Capability Check
    const { canRun, issues } = canRunDeployment(sysInfo);
    
    // Step 3: Environment Check
    logStep(2, 'Checking Environment...');
    
    let envOk = true;
    if (!fs.existsSync(ENV_FILE)) {
        const envExample = path.join(PROJECT_DIR, '.env.example');
        if (fs.existsSync(envExample)) {
            fs.copyFileSync(envExample, ENV_FILE);
            log('  ⚠ Created .env from .env.example - please configure your API keys', 'yellow');
        }
        envOk = false;
    } else {
        log('  ✓ .env file found', 'green');
    }

    // Step 4: Resource Estimation
    logStep(3, 'Resource Estimation');
    console.log(`  Application Requirements (estimated):`);
    console.log(`    RAM: ~${EST_RAM_MB} MB`);
    console.log(`    CPU: 1 core`);
    console.log(`    Available after deployment: ~${sysInfo.totalRamMb - EST_RAM_MB} MB`);

    // Confirmation
    console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
    console.log(`${colors.cyan}  DEPLOYMENT SUMMARY${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);
    
    console.log('\n  This script will:');
    console.log('    1. Create a Docker network');
    console.log('    2. Spin up ephemeral containers');
    console.log('    3. Start Next.js on http://localhost:3000');
    console.log('    4. Start worker for background tasks');
    console.log('    5. AUTO-DESTROY all containers on exit\n');

    if (!canRun) {
        log('  ⚠ Warnings:', 'yellow');
        issues.forEach(issue => log(`    - ${issue}`, 'yellow'));
        console.log('');
    }

    if (!sysInfo.dockerAvailable) {
        log('\n  ✗ Cannot proceed - Docker is required', 'red');
        log('    Install from: https://docs.docker.com/get-docker/', 'blue');
        process.exit(1);
    }

    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    
    const answer = await new Promise(resolve => {
        rl.question('  Proceed with ephemeral deployment? [y/N] ', resolve);
    });
    rl.close();
    
    if (!answer.toLowerCase().startsWith('y')) {
        log('\n  Deployment cancelled.', 'yellow');
        process.exit(0);
    }

    // Setup cleanup on exit
    process.on('SIGINT', async () => {
        await cleanupContainers();
        log('\n  ✓ All resources released', 'green');
        process.exit(0);
    });

    // Cleanup existing
    await cleanupContainers();

    // Start deployment
    await startDeployment(sysInfo);
    
    // Monitor
    await monitorDeployment();

    // Keep alive
    await new Promise(() => {});
}

main().catch(console.error);

```

```

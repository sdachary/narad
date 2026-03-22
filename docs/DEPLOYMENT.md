# Narad Deployment Guide

## Prerequisites
- OCI VM with Ubuntu 22.04 LTS or later
- Domain name (for SSL certificates)
- All API keys from .env.example filled in

## Step 1: Clone Repository
```bash
git clone https://github.com/sdachary/narad.git ~/narad
cd ~/narad
cp .env.example .env
nano .env # Fill in keys
```

## Step 2: Validate Configuration
```bash
bash scripts/validate-env.sh
```

## Step 3: Install Systemd Service
```bash
bash scripts/install-systemd.sh
```

## Step 4: Setup SSL & Nginx
```bash
bash scripts/setup-ssl.sh narad.yourdomain.com admin@yourdomain.com
sudo cp nginx/narad.conf /etc/nginx/sites-available/narad
sudo ln -s /etc/nginx/sites-available/narad /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

## Monitoring
```bash
bash scripts/monitor.sh
```

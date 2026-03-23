terraform {
  required_version = ">= 1.5"
  required_providers {
    null = { source = "hashicorp/null", version = "~> 3.0" }
  }
  cloud {
    organization = "d-cloud"
    workspaces { name = "narad-deploy" }
  }
}

# ── Variables (set in Terraform Cloud workspace) ──────────────────────────────

variable "vm_host" {
  type        = string
  description = "OCI VM public IP address"
}

variable "vm_user" {
  type        = string
  default     = "ubuntu"
  description = "SSH username on the OCI VM"
}

variable "ssh_private_key" {
  type        = string
  sensitive   = true
  description = "Full PEM content of the SSH private key used to access the VM"
}

variable "groq_api_key" {
  type        = string
  sensitive   = true
  description = "Groq API key — starts with gsk_"
}

variable "telegram_bot_token" {
  type        = string
  sensitive   = true
  description = "Telegram bot token from @BotFather"
}

variable "telegram_chat_id" {
  type        = string
  sensitive   = true
  description = "Your personal Telegram numeric user ID"
}

variable "openrouter_api_key" {
  type        = string
  sensitive   = true
  default     = ""
  description = "OpenRouter API key for fallback models — starts with sk-or-"
}

variable "narad_repo" {
  type        = string
  default     = "https://github.com/sdachary/narad.git"
  description = "Git URL of the narad repo"
}

variable "github_token" {
  type        = string
  sensitive   = true
  default     = ""
  description = "GitHub PAT with repo scope for cloning private narad/nisha repos"
}

# ── Deploy Narad onto the existing OCI VM ─────────────────────────────────────

resource "null_resource" "narad_deploy" {
  # Re-run on every apply — ensures every push deploys latest code
  triggers = {
    always_run = timestamp()
  }

  connection {
    type        = "ssh"
    host        = var.vm_host
    user        = var.vm_user
    private_key = var.ssh_private_key
    timeout     = "5m"
  }

  # ── Step 1: Install Node.js 20 if missing ──────────────────────────
  provisioner "remote-exec" {
    inline = [
      "set -e",
      "if node --version 2>/dev/null | grep -qE 'v2[0-9]'; then",
      "  echo \"Node already installed: $(node --version)\"",
      "else",
      "  echo 'Installing Node.js 20...'",
      "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - > /dev/null 2>&1",
      "  sudo apt-get install -y nodejs > /dev/null 2>&1",
      "  echo \"Node installed: $(node --version)\"",
      "fi"
    ]
  }

  # ── Step 2: Clone or update the narad repo ─────────────────────────
  provisioner "remote-exec" {
    inline = [
      "set -e",
      "REPO_URL=\"${var.narad_repo}\"",
      "# If token provided and URL is HTTPS, inject token for auth",
      "if [ -n \"${var.github_token}\" ] && [[ \"$REPO_URL\" == https://* ]]; then",
      "  REPO_URL=\"${replace(var.narad_repo, "https://", "https://${var.github_token}@")}\"",
      "fi",
      "",
      "if [ -d ~/narad/.git ]; then",
      "  echo 'Repo exists — pulling latest...'",
      "  git -C ~/narad remote set-url origin \"$REPO_URL\"",
      "  git -C ~/narad pull origin main",
      "else",
      "  echo 'Cloning narad repo...'",
      "  git clone \"$REPO_URL\" ~/narad",
      "fi",
      "echo 'Repo ready'"
    ]
  }

  # ── Step 3: Write .env file ────────────────────────────────────────
  # Uses heredoc so multi-line values and special characters are safe.
  # chmod 600 ensures only the ubuntu user can read it.
  provisioner "remote-exec" {
    inline = [
      "set -e",
      "cat > ~/narad/.env << 'NARAD_ENV_EOF'",
      "GROQ_API_KEY=${var.groq_api_key}",
      "TELEGRAM_BOT_TOKEN=${var.telegram_bot_token}",
      "TELEGRAM_CHAT_ID=${var.telegram_chat_id}",
      "OPENROUTER_API_KEY=${var.openrouter_api_key}",
      "GITHUB_PAT=${var.github_token}",
      "NARAD_DIR=/home/ubuntu/narad",
      "MEMORY_DB=/home/ubuntu/.narad/memory.db",
      "KNOWLEDGE_DIR=/home/ubuntu/narad/knowledge",
      "LOG_LEVEL=info",
      "NARAD_ENV_EOF",
      "chmod 600 ~/narad/.env",
      "echo '.env written and secured'"
    ]
  }

  # ── Step 4: npm install ────────────────────────────────────────────
  provisioner "remote-exec" {
    inline = [
      "set -e",
      "cd ~/narad",
      "npm install --silent",
      "echo 'npm install complete'"
    ]
  }

  # ── Step 5: Create runtime directories ────────────────────────────
  provisioner "remote-exec" {
    inline = [
      "set -e",
      "mkdir -p ~/.narad",
      "mkdir -p ~/.nullclaw",
      "mkdir -p ~/narad/knowledge/services",
      "echo 'Directories ready'"
    ]
  }

  # ── Step 6: Make scripts executable ───────────────────────────────
  provisioner "remote-exec" {
    inline = [
      "chmod +x ~/narad/scripts/*.sh",
      "echo 'Scripts executable'"
    ]
  }

  # ── Step 7: Install and start systemd service ──────────────────────
  provisioner "remote-exec" {
    inline = [
      "set -e",
      "sudo cp ~/narad/systemd/narad.service /etc/systemd/system/narad.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable narad",
      "if sudo systemctl is-active --quiet narad; then",
      "  echo 'Restarting Narad...'",
      "  sudo systemctl restart narad",
      "else",
      "  echo 'Starting Narad...'",
      "  sudo systemctl start narad",
      "fi",
      "sleep 5",
      "if sudo systemctl is-active --quiet narad; then",
      "  echo '✓ Narad is running'",
      "else",
      "  echo '✗ Narad failed to start — printing last 30 log lines:'",
      "  sudo journalctl -u narad -n 30 --no-pager",
      "  exit 1",
      "fi"
    ]
  }

  # ── Step 8: Install daily knowledge sync cron ─────────────────────
  provisioner "remote-exec" {
    inline = [
      "CRON_JOB='0 6 * * * /home/ubuntu/narad/scripts/sync-knowledge.sh >> /tmp/narad-sync.log 2>&1'",
      "(crontab -l 2>/dev/null | grep -v sync-knowledge; echo \"$CRON_JOB\") | crontab -",
      "echo 'Cron job installed: daily knowledge sync at 6am'"
    ]
  }
}

# ── Outputs ───────────────────────────────────────────────────────────────────

output "status" {
  value = "Narad deployed to ${var.vm_host} — send /start to your Telegram bot to verify"
}

output "vm_host" {
  value = var.vm_host
}

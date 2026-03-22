# Narad Troubleshooting Guide

## Telegram Bot Not Responding
1. Check token: `bash scripts/validate-env.sh`
2. Check logs: `sudo journalctl -u narad -f`
3. Restart: `sudo systemctl restart narad`

## Memory Errors
1. Restart: `sudo systemctl restart narad`
2. Check `free -h` for VM memory.

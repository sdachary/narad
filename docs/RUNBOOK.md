# Narad Incident Response Runbook

## Service Won't Start
1. View error logs: `sudo journalctl -u narad -n 50 -p err`
2. Run validation: `bash scripts/validate-env.sh`
3. Restart: `sudo systemctl restart narad`

## High Memory Usage
1. Clear memory: `sudo systemctl restart narad`
2. Check `top` for leaks.

## Web UI Not Accessible
1. Check Nginx: `sudo systemctl status nginx`
2. Test local: `curl http://127.0.0.1:7860`

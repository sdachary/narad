# Narad Production Checklist

- [ ] Secrets set in `.env` (not in code)
- [ ] SSL certificates valid and auto-renewal active
- [ ] Nginx rate limiting enabled
- [ ] Systemd restart policy verified
- [ ] Health checks pass (`bash scripts/health-check.sh`)
- [ ] Automated backups active (`crontab -l`)

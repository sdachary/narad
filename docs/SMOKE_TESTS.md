# Narad Smoke Tests

## 1. Health Endpoint
```bash
curl https://narad.yourdomain.com/health
```

## 2. SSL Verification
```bash
curl -v https://narad.yourdomain.com/ 2>&1 | grep "SSL certificate verify ok"
```

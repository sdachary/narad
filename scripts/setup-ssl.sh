#!/bin/bash
# Install Let's Encrypt SSL certificates

DOMAIN="${1:-narad.yourdomain.com}"
EMAIL="${2:-admin@yourdomain.com}"

if [ -z "$DOMAIN" ]; then
  echo "Usage: ./setup-ssl.sh domain email"
  exit 1
fi

echo "Setting up SSL certificate for $DOMAIN..."

# Install certbot
if ! command -v certbot &> /dev/null; then
  echo "Installing certbot..."
  sudo apt-get update
  sudo apt-get install -y certbot python3-certbot-nginx
fi

# Get certificate
sudo certbot certonly \
  --nginx \
  -d "$DOMAIN" \
  -m "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -n

# Set up auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "✓ SSL certificate installed"
echo "✓ Auto-renewal enabled"
echo ""
echo "Next steps:"
echo "1. Update /etc/nginx/sites-available/narad with your domain"
echo "2. sudo ln -s /etc/nginx/sites-available/narad /etc/nginx/sites-enabled/"
echo "3. sudo nginx -t"
echo "4. sudo systemctl restart nginx"

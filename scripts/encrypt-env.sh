#!/bin/bash
# Encrypt .env file for secure storage

if [ ! -f ".env" ]; then
  echo "Error: .env not found"
  exit 1
fi

# Install openssl if needed
if ! command -v openssl &> /dev/null; then
  echo "Installing openssl..."
  sudo apt-get install -y openssl
fi

# Encrypt with AES-256
openssl enc -aes-256-cbc -in .env -out .env.encrypted -md sha256
echo "✓ .env encrypted to .env.encrypted"
echo "Keep the password safe!"

# Secure the original
shred -u .env  # overwrite original with random data
echo "✓ .env securely deleted"

#!/bin/sh
# One-time raisfast setup on the Pi (idempotent). Run as root.
set -e
mkdir -p /data/raisfast/bin /data/raisfast/storage /data/raisfast/static
chown -R shop:nogroup /data/raisfast
chmod 750 /data/raisfast/storage

# Env file with a generated JWT secret (never reuse the built-in default!)
if [ ! -f /data/config/raisfast.confd ]; then
  JWT=$(head -c 48 /dev/urandom | od -An -tx1 | tr -d ' \n')
  cat > /data/config/raisfast.confd <<CONF
export APP_HOST=127.0.0.1
export APP_PORT=9898
export APP_ENV=production
export DATABASE_URL="sqlite:/data/raisfast/storage/db/raisfast.db?mode=rwc"
export STORAGE_ROOT_DIR=/data/raisfast/storage
export STATIC_DIR=/data/raisfast/static
export BASE_URL=https://beetle-guided-infinitely.ngrok-free.app
export JWT_SECRET=$JWT
export APP_KEY=$(head -c 32 /dev/urandom | base64)
export CORS_ORIGINS=https://beetle-guided-infinitely.ngrok-free.app
CONF
  chmod 600 /data/config/raisfast.confd
fi

install -m755 /data/config/raisfast.initd /etc/init.d/raisfast
install -m600 /data/config/raisfast.confd /etc/conf.d/raisfast
install -m644 /data/config/nginx-shop.conf /etc/nginx/http.d/default.conf
nginx -t && rc-service nginx reload
rc-update add raisfast default >/dev/null 2>&1 || true
echo "setup done"

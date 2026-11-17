#!/bin/sh
# Run once on the Pi (as root). Idempotent.
set -e
id shop >/dev/null 2>&1 || adduser -S -D -H -s /sbin/nologin shop
mkdir -p /opt/shop/releases /var/lib/shop /var/log/shop
chown shop:nogroup /var/lib/shop /var/log/shop
chmod 750 /var/lib/shop
if [ ! -f /etc/conf.d/shop ]; then
  TOKEN=$(head -c 24 /dev/urandom | od -An -tx1 | tr -d ' \n')
  cat > /etc/conf.d/shop <<CONF
export DATABASE_PATH=/var/lib/shop/shop.db
export LISTEN_ADDR=127.0.0.1:8081
export ADMIN_TOKEN=$TOKEN
CONF
  chmod 600 /etc/conf.d/shop
fi
install -m755 /tmp/shop.initd /etc/init.d/shop
install -m644 /tmp/shop.conf /etc/nginx/http.d/default.conf
nginx -t
rc-update add nginx default >/dev/null 2>&1 || true
rc-update add shop default >/dev/null 2>&1 || true

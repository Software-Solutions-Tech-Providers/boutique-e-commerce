#!/bin/sh
# Provisioning at every boot. Lives on /data/provision (ext4), editable without touching the FAT partition.
exec >>/var/log/provision.log 2>&1
echo "== $(date) provision start"

# 0. Wi-Fi power save off — with it on, ARP/new inbound TCP stall (SSH timeouts)
command -v iw >/dev/null 2>&1 || apk add --no-network --allow-untrusted --force-non-repository /data/apk/iw*.apk /data/apk/libnl3*.apk 2>/dev/null
iw dev wlan0 set power_save off 2>/dev/null && echo "wifi power_save off"

# 1. Clock (no RTC on the Pi): needed for TLS to ngrok
for i in 1 2 3 4 5 6; do ntpd -q -n -p pool.ntp.org -p time.cloudflare.com && break; sleep 5; done
ntpd -p pool.ntp.org -p time.cloudflare.com
date

# 2. nginx from the local package cache (no internet needed), fall back to online repos
if ! command -v nginx >/dev/null 2>&1; then
  apk add --no-network --allow-untrusted --force-non-repository /data/apk/*.apk || {
    echo "local install failed, trying online"
    printf '%s\n' http://dl-cdn.alpinelinux.org/alpine/v3.24/main http://dl-cdn.alpinelinux.org/alpine/v3.24/community >> /etc/apk/repositories
    apk add nginx
  }
fi

# 2b. admin tools (curl, sqlite3) from the local cache; non-fatal
if [ -d /data/apk/tools ] && ! command -v curl >/dev/null 2>&1; then
  apk add --no-network --allow-untrusted --force-non-repository /data/apk/tools/*.apk >/dev/null 2>&1 \
    && echo "tools installed (curl, sqlite3)" || echo "tools install skipped"
fi

# 3. user, dirs, service files, config
id shop >/dev/null 2>&1 || adduser -S -D -H -s /sbin/nologin shop
mkdir -p /var/log/shop && chown shop:nogroup /var/log/shop
chown -R shop:nogroup /data/shop/db
install -m755 /data/config/shop.initd   /etc/init.d/shop
install -m755 /data/config/ngrok.initd  /etc/init.d/ngrok
install -m600 /data/config/shop.confd   /etc/conf.d/shop
install -m600 /data/config/ngrok.confd  /etc/conf.d/ngrok
install -m644 /data/config/nginx-shop.conf /etc/nginx/http.d/default.conf

# 3b. raisfast CMS (if staged on /data)
if [ -f /data/config/raisfast.initd ]; then
  install -m755 /data/config/raisfast.initd /etc/init.d/raisfast
  install -m600 /data/config/raisfast.confd /etc/conf.d/raisfast
  # /var/log is RAM: recreate the log owned by the service user, or
  # supervise-daemon (running as shop) cannot open it and raisfast never starts
  touch /var/log/raisfast.log && chown shop:nogroup /var/log/raisfast.log
fi

# 4. start everything
nginx -t && rc-service nginx start
rc-service shop start
[ -f /etc/init.d/raisfast ] && rc-service raisfast start
rc-service ngrok start
echo "== provision done"

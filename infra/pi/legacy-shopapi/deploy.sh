#!/bin/sh
# Usage: sh deploy.sh [user@host]   (run from D:\launch\deploy in Git Bash)
# Ships the compiled binary to the Pi's persistent /data partition and restarts the service.
set -e
HOST=${1:-root@192.168.31.131}
SSH="ssh -4 -o BatchMode=yes -o ServerAliveInterval=5 -o HostKeyAlias=alpine-headless.local $HOST"
BIN=../shopapi/target/armv7-unknown-linux-musleabihf/release/shopapi
VER=$(date +%Y%m%d%H%M%S)
$SSH "mkdir -p /data/shop/releases/$VER"
$SSH "cat > /data/shop/releases/$VER/shopapi" < "$BIN"
PREV=$($SSH "readlink /data/shop/current || true")
$SSH "chmod 755 /data/shop/releases/$VER/shopapi && ln -sfn /data/shop/releases/$VER /data/shop/current && (rc-service shop restart || rc-service shop start)"
sleep 3
if ! $SSH "wget -qO- http://127.0.0.1:8081/healthz"; then
  echo "health check failed, rolling back"
  [ -n "$PREV" ] && $SSH "ln -sfn $PREV /data/shop/current && rc-service shop restart"
  exit 1
fi
echo " deployed $VER"
# keep only the 3 newest releases
$SSH "cd /data/shop/releases && ls -1t | tail -n +4 | xargs -r rm -rf"

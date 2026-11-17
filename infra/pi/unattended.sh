#!/bin/sh
# Alpine headless bootstrap hook (lives on the FAT boot partition).
# Runs at the end of every boot, after Wi-Fi and SSH are already up.
modprobe ext4
mkdir -p /data
mountpoint -q /data || mount -t ext4 -o noatime,commit=30 /dev/mmcblk0p2 /data
[ -x /data/provision/boot.sh ] && /data/provision/boot.sh
exit 0

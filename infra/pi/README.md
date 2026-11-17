# Raspberry Pi deployment (Alpine, diskless + /data partition)

Runtime layout on the Pi (SD card):
- Boot partition (FAT): `unattended.sh` — bootstrap hook; mounts `/data` (ext4,
  `mmcblk0p2`) and runs `/data/provision/boot.sh` at every boot.
- `/data/provision/boot.sh` — clock (NTP), Wi-Fi power-save off, nginx + tools
  from the local apk cache, installs service files, starts nginx, raisfast,
  shop (legacy demo API) and ngrok.
- `/data/raisfast/` — binary (`bin/`), SQLite + uploads (`storage/`), content
  type TOMLs (`extensions/content_types/`), admin UI extension (`admin-ext/`).
- `/data/config/` — service env files and secrets (JWT secret, APP_KEY, OAuth
  client, ngrok token, admin credentials). **Never committed.**

Files here:
| File | Installed as |
|---|---|
| `unattended.sh` | boot partition `/unattended.sh` |
| `boot.sh` | `/data/provision/boot.sh` |
| `setup-raisfast.sh` | one-time raisfast setup (generates JWT secret) |
| `raisfast.initd`, `shop.initd`, `ngrok.initd` | `/data/config/*.initd` → `/etc/init.d/` |
| `nginx-raisfast.conf` | `/data/config/nginx-shop.conf` → `/etc/nginx/http.d/default.conf` |
| `admin-ext.js` | `/data/raisfast/admin-ext/ext.js` (injected into /admin by nginx) |
| `legacy-shopapi/` | first demo API deploy scripts (superseded by raisfast) |

Deploy a new raisfast build: build with `backend/raisfast/build-pi.cmd`, copy
the binary to `/data/raisfast/bin/raisfast` (keep `.prev` for rollback),
`rc-service raisfast restart`.

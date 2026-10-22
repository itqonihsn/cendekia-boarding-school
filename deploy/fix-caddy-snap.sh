#!/usr/bin/env bash
# Terapkan Caddyfile ke Caddy SNAP (service baca JSON via `snap set`, bukan Caddyfile langsung).
# Jalankan di VPS: bash fix-caddy-snap.sh
set -euo pipefail

CADDYFILE="${CADDYFILE:-/var/snap/caddy/common/caddy/Caddyfile}"

if [[ ! -f "$CADDYFILE" ]]; then
  echo "Buat dulu: sudo mkdir -p /var/snap/caddy/common/caddy"
  echo "Lalu salin deploy/Caddyfile.minimal ke $CADDYFILE"
  exit 1
fi

echo "==> Validasi Caddyfile"
sudo snap run caddy validate --config "$CADDYFILE"

echo "==> Adapt Caddyfile -> JSON"
sudo snap run caddy adapt --config "$CADDYFILE" 2>/dev/null | sudo tee /tmp/caddy-snap-config.json >/dev/null

echo "==> snap set caddy config (config aktif snap)"
sudo snap set caddy config="$(cat /tmp/caddy-snap-config.json)"

echo "==> Restart Caddy"
sudo snap restart caddy

sleep 2
echo "==> Tes lokal"
curl -sf http://127.0.0.1:4321/admin/login | grep -o '<title>[^<]*' || echo "WARN: Node :4321"
curl -sI https://cendekiaboardingschool.id/admin/login | head -3

echo "==> Selesai. Buka https://cendekiaboardingschool.id/admin/login"

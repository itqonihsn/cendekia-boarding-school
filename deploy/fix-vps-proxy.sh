#!/usr/bin/env bash
# Jalankan SEKALI di VPS (setelah PM2 jalan) jika /admin/login masih menampilkan beranda.
set -euo pipefail

echo "==> Cek PM2 & Node"
pm2 list || true
curl -sf -o /dev/null http://127.0.0.1:4321/admin/login && echo "OK: Node /admin/login" || {
  echo "ERROR: Node tidak listen di 127.0.0.1:4321 — perbaiki PM2 dulu."
  exit 1
}

TITLE=$(curl -s http://127.0.0.1:4321/admin/login | grep -o '<title>[^<]*' | head -1)
echo "    $TITLE"
echo ""
echo "==> Jika title 'Login Admin', Node sudah benar."
echo "    Perbarui Caddy agar reverse_proxy ke 127.0.0.1:4321 (bukan file_server)."
echo "    Contoh: deploy/Caddyfile.example"
echo ""
echo "==> Hapus sisa static lama (jika ada):"
WEB_DIR="${WEB_DIR:-/var/www/cendekia-boarding-school}"
ls -la "$WEB_DIR/index.html" 2>/dev/null && rm -f "$WEB_DIR/index.html" && echo "Removed $WEB_DIR/index.html" || echo "No root index.html"

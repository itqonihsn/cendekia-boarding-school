#!/usr/bin/env bash
# Setup awal VPS untuk hosting static site (Ubuntu/Debian)
# Jalankan di VPS sebagai user yang punya sudo:
#   bash setup-vps.sh
set -euo pipefail

WEB_DIR="${WEB_DIR:-/var/www/cendekia-boarding-school}"
SITE_NAME="${SITE_NAME:-cendekia}"

echo "==> Install Nginx (jika belum)"
sudo apt update
sudo apt install -y nginx

echo "==> Buat web root: $WEB_DIR"
sudo mkdir -p "$WEB_DIR"
echo "<h1>Cendekia Boarding School — siap deploy</h1>" | sudo tee "$WEB_DIR/index.html" >/dev/null
sudo chown -R www-data:www-data "$WEB_DIR"

echo "==> Siapkan folder config"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/nginx.conf.example" ]]; then
  sudo cp "$SCRIPT_DIR/nginx.conf.example" "/etc/nginx/sites-available/$SITE_NAME"
  echo "Edit server_name di /etc/nginx/sites-available/$SITE_NAME sebelum enable."
fi

echo ""
echo "Langkah berikutnya:"
echo "  1. sudo nano /etc/nginx/sites-available/$SITE_NAME   # ganti domain-kamu.com"
echo "  2. sudo ln -sf /etc/nginx/sites-available/$SITE_NAME /etc/nginx/sites-enabled/"
echo "  3. sudo rm -f /etc/nginx/sites-enabled/default"
echo "  4. sudo nginx -t && sudo systemctl reload nginx"
echo "  5. Pastikan firewall buka port 80/443 (ufw allow 'Nginx Full')"
echo "  6. Setelah domain pointing ke IP VPS, jalankan:"
echo "     sudo certbot --nginx -d domain-kamu.com -d www.domain-kamu.com"
echo ""
echo "Di GitHub → Settings → Secrets and variables → Actions, isi:"
echo "  SSH_HOST, SSH_USER, SSH_KEY, VPS_WEB_DIR=$WEB_DIR, SITE_URL=https://domain-kamu.com"
echo "==> Setup dasar selesai"

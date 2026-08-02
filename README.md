# Cendekia Boarding School — Website

Website resmi **Cendekia Boarding School** (Pesantren Modern Terpadu · Yayasan Syarif Muslih Institute).

**Domain production:** [https://cbsbogor.or.id](https://cbsbogor.or.id)

## Lokal
```bash
npm install
npm run dev
```

## Deploy VPS

### Secrets GitHub Actions
| Secret | Value |
|--------|--------|
| `SSH_HOST` | IP VPS |
| `SSH_USER` | user SSH |
| `SSH_KEY` | private key PEM |
| `VPS_WEB_DIR` | `/var/www/cendekia-boarding-school` |
| `SITE_URL` | `https://cbsbogor.or.id` |
| `SSH_PORT` | `22` (opsional) |

### Nginx di VPS
```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/cendekia
sudo ln -sf /etc/nginx/sites-available/cendekia /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### SSL
Pastikan DNS `cbsbogor.or.id` & `www.cbsbogor.or.id` mengarah ke IP VPS, lalu:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cbsbogor.or.id -d www.cbsbogor.or.id
```

Push ke `main` → auto deploy (setelah workflow ter-push).

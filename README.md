# Cendekia Boarding School — Website

Website resmi **Cendekia Boarding School** (Pesantren Modern Terpadu · Yayasan Syarif Muslih Institute).

**Domain production:** [https://cendekiaboardingschool.id](https://cendekiaboardingschool.id)

Situs ini memakai **Astro SSR** dengan **panel admin** untuk mengubah teks, foto, video, program, fasilitas, dan berita tanpa mengedit kode.

## Panel admin

- URL: **`/admin`** (contoh: [https://cendekiaboardingschool.id/admin](https://cendekiaboardingschool.id/admin))
- Login default saat database pertama kali dibuat: lihat env `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- **Segera ganti password** lewat env `ADMIN_PASSWORD` sebelum deploy production, atau ubah manual di database setelah setup.

Fitur admin:

- Pengaturan situs (kontak, logo, tagline)
- Beranda, Tentang, hero halaman
- CRUD Program & Fasilitas (foto + deskripsi)
- Berita lengkap (cover, isi HTML, YouTube atau upload video)
- Perpustakaan media

Data disimpan di **`DATA_DIR`** (SQLite + folder `uploads/`), terpisah dari folder deploy agar tidak hilang saat update.

## Lokal

```bash
cp .env.example .env
# edit SESSION_SECRET, ADMIN_PASSWORD

npm install
npm run dev
```

Buka http://localhost:4321 dan http://localhost:4321/admin

Production preview:

```bash
npm run build
HOST=127.0.0.1 PORT=4321 DATA_DIR=./data SESSION_SECRET=dev-local-secret-min-16 npm run start
```

## Deploy VPS

### Secrets GitHub Actions

| Secret | Value |
|--------|--------|
| `SSH_HOST` | IP VPS |
| `SSH_USER` | user SSH |
| `SSH_KEY` | private key PEM |
| `VPS_WEB_DIR` | `/var/www/cendekia-boarding-school` |
| `VPS_DATA_DIR` | `/var/www/cendekia-data` (opsional) |
| `SESSION_SECRET` | string acak ≥ 16 karakter |
| `SITE_URL` | `https://cendekiaboardingschool.id` |
| `ADMIN_USERNAME` | opsional (default `admin`) |
| `ADMIN_PASSWORD` | password admin awal |
| `SSH_PORT` | `22` (opsional) |

### One-time di VPS

```bash
sudo mkdir -p /var/www/cendekia-boarding-school /var/www/cendekia-data/uploads
sudo chown -R $USER:$USER /var/www/cendekia-boarding-school /var/www/cendekia-data
npm install -g pm2
```

Nginx reverse proxy ke Node (port 4321):

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/cendekia
sudo ln -sf /etc/nginx/sites-available/cendekia /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cendekiaboardingschool.id -d www.cendekiaboardingschool.id
```

Push ke `main` → build → upload `dist/` → PM2 restart `cendekia-web`.

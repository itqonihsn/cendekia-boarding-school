# Cendekia Boarding School — Website

Website resmi **Cendekia Boarding School** (Pesantren Modern Terpadu · Yayasan Syarif Muslih Institute), dibangun dengan **Astro**.

## Fitur
- Desain brand kuning–hijau sesuai logo
- Responsif (Android & iPhone)
- SEO (meta, sitemap, robots)
- CI/CD otomatis ke VPS via GitHub Actions

## Lokal
```bash
npm install
npm run dev
```
http://127.0.0.1:4321

```bash
npm run build
npm run preview
```

## Deploy ke VPS (direkomendasikan)

### 1. Setup sekali di VPS
Upload folder `deploy/` lalu:
```bash
chmod +x deploy/setup-vps.sh
bash deploy/setup-vps.sh
```
Edit Nginx `server_name` ke domain kamu, enable site, reload Nginx.

### 2. Secrets di GitHub
Repo → **Settings → Secrets and variables → Actions**:

| Secret | Contoh |
|--------|--------|
| `SSH_HOST` | IP VPS |
| `SSH_USER` | `ubuntu` / `root` |
| `SSH_KEY` | private key PEM (isi penuh) |
| `VPS_WEB_DIR` | `/var/www/cendekia-boarding-school` |
| `SSH_PORT` | `22` (opsional) |
| `SITE_URL` | `https://www.domain-kamu.com` (setelah domain aktif) |

Pastikan user SSH bisa `sudo` tanpa password untuk `mkdir`, `tar`, `nginx`, `systemctl` (atau sesuaikan workflow).

### 3. CI/CD
- Push ke `main` → workflow **CI** build + **Deploy Website to VPS**
- Atau jalankan manual: Actions → **Deploy Website to VPS** → Run workflow

### 4. Domain
1. Beli domain
2. A/AAAA record → IP VPS
3. Update `server_name` di Nginx
4. `sudo certbot --nginx -d domain-kamu.com -d www.domain-kamu.com`
5. Set secret `SITE_URL` lalu redeploy (supaya sitemap/canonical benar)

## Alternatif: Vercel
Sudah ada `vercel.json`. Import repo di Vercel jika ingin hosting di sana.

## Struktur
```
src/                 halaman & komponen Astro
public/logo.png      logo resmi
deploy/              Nginx + setup VPS
.github/workflows/   CI + deploy VPS
```

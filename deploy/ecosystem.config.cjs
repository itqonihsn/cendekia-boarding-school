/** PM2 — jalankan dari folder dist hasil deploy (VPS_WEB_DIR) */
module.exports = {
  apps: [
    {
      name: 'cendekia-web',
      script: './dist/server/entry.mjs',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '512M',
    },
  ],
};

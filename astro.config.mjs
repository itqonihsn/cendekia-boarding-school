// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Ganti lewat env SITE_URL saat build/CI (domain production)
const site = process.env.SITE_URL || 'https://cendekia-boarding-school.example';

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [sitemap()],
  compressHTML: true,
});

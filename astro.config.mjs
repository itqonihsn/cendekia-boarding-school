// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// Ganti lewat env SITE_URL saat build/CI (domain production)
const site = process.env.SITE_URL || 'https://cendekiaboardingschool.id';

// https://astro.build/config
export default defineConfig({
  site,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [sitemap()],
  compressHTML: true,
});

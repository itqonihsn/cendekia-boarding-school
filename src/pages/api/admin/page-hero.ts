import type { APIRoute } from 'astro';
import { savePageHero } from '../../../lib/content';

export const prerender = false;

const allowed = new Set(['program', 'fasilitas', 'berita', 'kontak']);

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const page = String(form.get('page') || '');
  if (!allowed.has(page)) {
    return redirect('/admin/pages?error=Halaman%20tidak%20valid.');
  }

  savePageHero(page as 'program' | 'fasilitas' | 'berita' | 'kontak', {
    eyebrow: String(form.get('eyebrow') || ''),
    title: String(form.get('title') || ''),
    subtitle: String(form.get('subtitle') || ''),
  });

  return redirect('/admin/pages?saved=1');
};

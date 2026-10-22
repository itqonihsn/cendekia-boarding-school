import type { APIRoute } from 'astro';
import { saveUpload } from '../../../lib/upload';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const file = form.get('file');
  const returnTo = String(form.get('returnTo') || '/admin/media');
  const alt = String(form.get('alt') || '');

  if (!(file instanceof File) || file.size === 0) {
    return redirect(`${returnTo}?error=${encodeURIComponent('Pilih file terlebih dahulu.')}`);
  }

  try {
    await saveUpload(file, alt);
    return redirect(`${returnTo}?saved=1`);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload gagal.';
    return redirect(`${returnTo}?error=${encodeURIComponent(message)}`);
  }
};

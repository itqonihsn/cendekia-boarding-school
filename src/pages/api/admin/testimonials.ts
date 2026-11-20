import type { APIRoute } from 'astro';
import { adminErrorRedirect } from '../../../lib/admin-api';
import { deleteTestimonial, upsertTestimonial } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const returnTo = '/admin/testimonials';
  try {
    const form = await request.formData();
    if (String(form.get('action') || '') === 'delete') {
      deleteTestimonial(Number(form.get('id')));
      return redirect(`${returnTo}?saved=1`);
    }
    const idRaw = String(form.get('id') || '').trim();
    upsertTestimonial({
      id: idRaw ? Number(idRaw) : undefined,
      name: String(form.get('name') || ''),
      role: String(form.get('role') || ''),
      quote: String(form.get('quote') || ''),
      sortOrder: Number(form.get('sortOrder') || 0),
      published: form.get('published') === 'on',
      photo: '',
    });
    return redirect(`${returnTo}?saved=1`);
  } catch (err) {
    return redirect(adminErrorRedirect(returnTo, err));
  }
};

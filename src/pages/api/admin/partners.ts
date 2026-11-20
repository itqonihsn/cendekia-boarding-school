import type { APIRoute } from 'astro';
import { adminErrorRedirect } from '../../../lib/admin-api';
import { deletePartner, upsertPartner } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const returnTo = '/admin/partners';
  try {
    const form = await request.formData();
    if (String(form.get('action') || '') === 'delete') {
      deletePartner(Number(form.get('id')));
      return redirect(`${returnTo}?saved=1`);
    }
    const idRaw = String(form.get('id') || '').trim();
    upsertPartner({
      id: idRaw ? Number(idRaw) : undefined,
      name: String(form.get('name') || ''),
      url: String(form.get('url') || ''),
      logo: String(form.get('logo') || ''),
      sortOrder: Number(form.get('sortOrder') || 0),
      published: form.get('published') === 'on',
    });
    return redirect(`${returnTo}?saved=1`);
  } catch (err) {
    return redirect(adminErrorRedirect(returnTo, err));
  }
};

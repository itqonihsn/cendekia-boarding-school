import type { APIRoute } from 'astro';
import { adminErrorRedirect } from '../../../lib/admin-api';
import { deletePerson, upsertPerson } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const returnTo = '/admin/people';
  try {
    const form = await request.formData();
    if (String(form.get('action') || '') === 'delete') {
      deletePerson(Number(form.get('id')));
      return redirect(`${returnTo}?saved=1`);
    }
    const idRaw = String(form.get('id') || '').trim();
    upsertPerson({
      id: idRaw ? Number(idRaw) : undefined,
      name: String(form.get('name') || ''),
      role: String(form.get('role') || ''),
      photo: String(form.get('photo') || ''),
      sortOrder: Number(form.get('sortOrder') || 0),
      published: form.get('published') === 'on',
    });
    return redirect(`${returnTo}?saved=1`);
  } catch (err) {
    return redirect(adminErrorRedirect(returnTo, err));
  }
};

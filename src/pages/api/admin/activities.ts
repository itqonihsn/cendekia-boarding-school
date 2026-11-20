import type { APIRoute } from 'astro';
import { adminErrorRedirect } from '../../../lib/admin-api';
import { deleteActivity, upsertActivity } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const returnTo = '/admin/activities';
  try {
    const form = await request.formData();
    if (String(form.get('action') || '') === 'delete') {
      deleteActivity(Number(form.get('id')));
      return redirect(`${returnTo}?saved=1`);
    }
    const idRaw = String(form.get('id') || '').trim();
    upsertActivity({
      id: idRaw ? Number(idRaw) : undefined,
      title: String(form.get('title') || ''),
      description: String(form.get('description') || ''),
      sortOrder: Number(form.get('sortOrder') || 0),
      published: form.get('published') === 'on',
    });
    return redirect(`${returnTo}?saved=1`);
  } catch (err) {
    return redirect(adminErrorRedirect(returnTo, err));
  }
};

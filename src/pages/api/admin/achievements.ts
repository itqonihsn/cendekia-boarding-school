import type { APIRoute } from 'astro';
import { adminErrorRedirect } from '../../../lib/admin-api';
import { deleteAchievement, upsertAchievement } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const returnTo = '/admin/achievements';
  try {
    const form = await request.formData();
    if (String(form.get('action') || '') === 'delete') {
      deleteAchievement(Number(form.get('id')));
      return redirect(`${returnTo}?saved=1`);
    }
    const idRaw = String(form.get('id') || '').trim();
    const kind = String(form.get('kind') || 'external') === 'internal' ? 'internal' : 'external';
    upsertAchievement({
      id: idRaw ? Number(idRaw) : undefined,
      title: String(form.get('title') || ''),
      kind,
      year: String(form.get('year') || ''),
      sortOrder: Number(form.get('sortOrder') || 0),
      published: form.get('published') === 'on',
    });
    return redirect(`${returnTo}?saved=1`);
  } catch (err) {
    return redirect(adminErrorRedirect(returnTo, err));
  }
};

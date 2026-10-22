import type { APIRoute } from 'astro';
import { deleteFacility, listFacilities, upsertFacility } from '../../../lib/content';
import { saveUpload } from '../../../lib/upload';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('action') || 'save');

  if (action === 'delete') {
    const id = Number(form.get('id'));
    if (id) deleteFacility(id);
    return redirect('/admin/facilities?saved=1');
  }

  const id = Number(form.get('id') || 0) || undefined;
  const existing = id ? listFacilities().find((f) => f.id === id) : undefined;
  const imageFile = form.get('imageFile');
  let image = String(form.get('image') || existing?.image || '');
  if (imageFile instanceof File && imageFile.size > 0) {
    const uploaded = await saveUpload(imageFile, String(form.get('title') || 'Fasilitas'));
    image = uploaded.path;
  }

  upsertFacility({
    id,
    title: String(form.get('title') || ''),
    description: String(form.get('description') || ''),
    image,
    sortOrder: Number(form.get('sortOrder') || 0),
  });

  return redirect('/admin/facilities?saved=1');
};

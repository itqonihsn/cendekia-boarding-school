import type { APIRoute } from 'astro';
import { deleteProgram, listPrograms, upsertProgram } from '../../../lib/content';
import { saveUpload } from '../../../lib/upload';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('action') || 'save');

  if (action === 'delete') {
    const id = Number(form.get('id'));
    if (id) deleteProgram(id);
    return redirect('/admin/programs?saved=1');
  }

  const id = Number(form.get('id') || 0) || undefined;
  const existing = id ? listPrograms().find((p) => p.id === id) : undefined;
  const imageFile = form.get('imageFile');
  let image = String(form.get('image') || existing?.image || '');
  if (imageFile instanceof File && imageFile.size > 0) {
    const uploaded = await saveUpload(imageFile, String(form.get('title') || 'Program'));
    image = uploaded.path;
  }

  upsertProgram({
    id,
    title: String(form.get('title') || ''),
    description: String(form.get('description') || ''),
    image,
    sortOrder: Number(form.get('sortOrder') || 0),
  });

  return redirect('/admin/programs?saved=1');
};

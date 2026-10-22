import type { APIRoute } from 'astro';
import { deleteFacility, getFacilityById, upsertFacility } from '../../../lib/content';
import { parseCoverImageFromForm, parsePublished, parseVideoFromForm } from '../../../lib/admin-form';
import { saveUpload } from '../../../lib/upload';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('action') || 'save');
  const returnTo = String(form.get('returnTo') || '/admin/facilities');

  if (action === 'delete') {
    const id = Number(form.get('id'));
    if (id) deleteFacility(id);
    return redirect(`${returnTo}?saved=1`);
  }

  const id = Number(form.get('id') || 0) || undefined;
  const existing = id ? getFacilityById(id) : null;

  let image = parseCoverImageFromForm(form, existing?.image);
  const coverFile = form.get('coverFile');
  if (coverFile instanceof File && coverFile.size > 0) {
    const uploaded = await saveUpload(coverFile, String(form.get('title') || 'Fasilitas'));
    image = uploaded.path;
  }

  let video = parseVideoFromForm(form, existing ?? undefined);
  const videoFile = form.get('videoFile');
  if (video.videoKind === 'upload' && videoFile instanceof File && videoFile.size > 0) {
    const uploaded = await saveUpload(videoFile, String(form.get('title') || 'Video fasilitas'));
    video = { videoKind: 'upload', videoUrl: '', videoPath: uploaded.path };
  }

  const newId = upsertFacility({
    id,
    slug: String(form.get('slug') || ''),
    title: String(form.get('title') || ''),
    description: String(form.get('excerpt') || ''),
    body: String(form.get('body') || ''),
    image,
    videoKind: video.videoKind,
    videoUrl: video.videoUrl,
    videoPath: video.videoPath,
    published: parsePublished(form),
    sortOrder: Number(form.get('sortOrder') || existing?.sortOrder || 0),
  });

  const dest = id ? returnTo : `/admin/facilities/${newId}?saved=1`;
  return redirect(dest);
};

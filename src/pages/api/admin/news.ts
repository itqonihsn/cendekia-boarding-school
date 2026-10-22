import type { APIRoute } from 'astro';
import { deleteNews, getNewsById, upsertNews } from '../../../lib/content';
import { parseCoverImageFromForm, parsePublished, parseVideoFromForm } from '../../../lib/admin-form';
import { saveUpload } from '../../../lib/upload';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('action') || 'save');
  const returnTo = String(form.get('returnTo') || '/admin/news');

  if (action === 'delete') {
    const id = Number(form.get('id'));
    if (id) deleteNews(id);
    return redirect(`${returnTo}?saved=1`);
  }

  const id = Number(form.get('id') || 0) || undefined;
  const existing = id ? getNewsById(id) : null;

  let coverImage = parseCoverImageFromForm(form, existing?.coverImage);
  const coverFile = form.get('coverFile');
  if (coverFile instanceof File && coverFile.size > 0) {
    const uploaded = await saveUpload(coverFile, String(form.get('title') || 'Berita'));
    coverImage = uploaded.path;
  }

  let video = parseVideoFromForm(form, existing ?? undefined);
  const videoFile = form.get('videoFile');
  if (video.videoKind === 'upload' && videoFile instanceof File && videoFile.size > 0) {
    const uploaded = await saveUpload(videoFile, String(form.get('title') || 'Video berita'));
    video = { videoKind: 'upload', videoUrl: '', videoPath: uploaded.path };
  }

  const newId = upsertNews({
    id,
    slug: String(form.get('slug') || ''),
    title: String(form.get('title') || ''),
    category: String(form.get('category') || ''),
    publishedAt: String(form.get('publishedAt') || ''),
    excerpt: String(form.get('excerpt') || ''),
    body: String(form.get('body') || ''),
    coverImage,
    videoKind: video.videoKind,
    videoUrl: video.videoUrl,
    videoPath: video.videoPath,
    published: parsePublished(form),
  });

  const dest = id ? returnTo : `/admin/news/${newId}?saved=1`;
  return redirect(dest);
};

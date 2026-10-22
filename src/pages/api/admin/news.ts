import type { APIRoute } from 'astro';
import { deleteNews, getNewsById, upsertNews } from '../../../lib/content';
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

  const coverFile = form.get('coverFile');
  let coverImage = String(form.get('coverImage') || existing?.coverImage || '');
  if (coverFile instanceof File && coverFile.size > 0) {
    const uploaded = await saveUpload(coverFile, String(form.get('title') || 'Berita'));
    coverImage = uploaded.path;
  }

  const videoKind = String(form.get('videoKind') || 'none') as 'none' | 'youtube' | 'upload';
  let videoUrl = String(form.get('videoUrl') || existing?.videoUrl || '');
  let videoPath = String(form.get('videoPath') || existing?.videoPath || '');

  const videoFile = form.get('videoFile');
  if (videoKind === 'upload' && videoFile instanceof File && videoFile.size > 0) {
    const uploaded = await saveUpload(videoFile, String(form.get('title') || 'Video berita'));
    videoPath = uploaded.path;
    videoUrl = '';
  }
  if (videoKind === 'youtube') {
    videoPath = '';
  }
  if (videoKind === 'none') {
    videoUrl = '';
    videoPath = '';
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
    videoKind,
    videoUrl,
    videoPath,
    published: form.get('published') === 'on',
  });

  const dest = id ? returnTo : `/admin/news/${newId}?saved=1`;
  return redirect(dest);
};

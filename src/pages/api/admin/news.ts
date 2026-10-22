import type { APIRoute } from 'astro';
import { deleteNews, getNewsById, upsertNews } from '../../../lib/content';
import { adminErrorRedirect } from '../../../lib/admin-api';
import { parseCoverImageFromForm, parsePublished, parseVideoFromForm } from '../../../lib/admin-form';
import { saveUpload } from '../../../lib/upload';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('action') || 'save');
  const returnTo = String(form.get('returnTo') || '/admin/news');

  try {
    if (action === 'delete') {
      const id = Number(form.get('id'));
      if (id) deleteNews(id);
      return redirect(`${returnTo}?saved=1`);
    }

    const title = String(form.get('title') || '').trim();
    if (!title) {
      return redirect(adminErrorRedirect(returnTo, new Error('Judul berita wajib diisi.')));
    }

    const excerpt = String(form.get('excerpt') || '').trim();
    if (!excerpt) {
      return redirect(adminErrorRedirect(returnTo, new Error('Ringkasan berita wajib diisi.')));
    }

    const id = Number(form.get('id') || 0) || undefined;
    const existing = id ? getNewsById(id) : null;

    let coverImage = parseCoverImageFromForm(form, existing?.coverImage);
    const coverFile = form.get('coverFile');
    if (coverFile instanceof File && coverFile.size > 0) {
      const uploaded = await saveUpload(coverFile, title);
      coverImage = uploaded.path;
    }

    let video = parseVideoFromForm(form, existing ?? undefined);
    const videoFile = form.get('videoFile');
    if (video.videoKind === 'upload' && videoFile instanceof File && videoFile.size > 0) {
      const uploaded = await saveUpload(videoFile, `${title} — video`);
      video = { videoKind: 'upload', videoUrl: '', videoPath: uploaded.path };
    }

    const body = String(form.get('body') || '').trim();
    if (!body) {
      return redirect(adminErrorRedirect(returnTo, new Error('Deskripsi lengkap wajib diisi.')));
    }

    const newId = upsertNews({
      id,
      slug: String(form.get('slug') || ''),
      title,
      category: String(form.get('category') || ''),
      publishedAt: String(form.get('publishedAt') || ''),
      excerpt,
      body,
      coverImage,
      videoKind: video.videoKind,
      videoUrl: video.videoUrl,
      videoPath: video.videoPath,
      published: parsePublished(form),
    });

    const dest = id ? `${returnTo}?saved=1` : `/admin/news/${newId}?saved=1`;
    return redirect(dest);
  } catch (err) {
    return redirect(adminErrorRedirect(returnTo, err));
  }
};

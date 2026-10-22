import type { VideoKind } from './types';

export function parseCoverImageFromForm(form: FormData, existing?: string): string {
  if (form.get('clearCoverImage') === 'on') return '';
  if (form.has('coverImage')) return String(form.get('coverImage') ?? '');
  return existing ?? '';
}

export function parseImagePathFromForm(
  form: FormData,
  pathField: string,
  clearField: string,
  existing?: string,
): string {
  if (form.get(clearField) === 'on') return '';
  if (form.has(pathField)) return String(form.get(pathField) ?? '');
  return existing ?? '';
}

export function parseVideoFromForm(
  form: FormData,
  existing?: { videoUrl?: string; videoPath?: string },
): { videoKind: VideoKind; videoUrl: string; videoPath: string } {
  const videoKind = String(form.get('videoKind') || 'none') as VideoKind;
  let videoUrl = form.has('videoUrl')
    ? String(form.get('videoUrl') ?? '')
    : String(existing?.videoUrl ?? '');
  let videoPath = form.has('videoPath')
    ? String(form.get('videoPath') ?? '')
    : String(existing?.videoPath ?? '');

  if (form.get('clearVideoUpload') === 'on' && videoKind === 'upload') {
    videoPath = '';
  }

  const videoFile = form.get('videoFile');
  if (videoKind === 'upload' && videoFile instanceof File && videoFile.size > 0) {
    return { videoKind, videoUrl: '', videoPath: '' };
  }
  if (videoKind === 'youtube') videoPath = '';
  if (videoKind === 'none') {
    videoUrl = '';
    videoPath = '';
  }
  return { videoKind, videoUrl, videoPath };
}

export function parsePublished(form: FormData): boolean {
  return form.get('published') === 'on';
}

import type { VideoKind } from './types';

export function parseVideoFromForm(
  form: FormData,
  existing?: { videoUrl?: string; videoPath?: string },
): { videoKind: VideoKind; videoUrl: string; videoPath: string } {
  const videoKind = String(form.get('videoKind') || 'none') as VideoKind;
  let videoUrl = String(form.get('videoUrl') || existing?.videoUrl || '');
  let videoPath = String(form.get('videoPath') || existing?.videoPath || '');

  const videoFile = form.get('videoFile');
  if (videoKind === 'upload' && videoFile instanceof File && videoFile.size > 0) {
    return { videoKind, videoUrl: '', videoPath: '' }; // caller uploads and sets path
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

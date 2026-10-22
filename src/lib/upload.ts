import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getUploadsDir } from './paths';
import { insertMedia } from './content';

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB (video)

const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

function extForMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/quicktime': '.mov',
  };
  return map[mime] || path.extname(mime) || '.bin';
}

export async function saveUpload(file: File, alt = ''): Promise<{ path: string; mediaId: number }> {
  if (!ALLOWED.has(file.type)) {
    throw new Error('Tipe file tidak didukung.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('File terlalu besar (maks. 100 MB).');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(file.name) || extForMime(file.type);
  const stored = `${id}${ext}`;
  const uploadsDir = getUploadsDir();
  const fullPath = path.join(uploadsDir, stored);
  fs.writeFileSync(fullPath, buffer);

  const publicPath = `/uploads/${stored}`;
  const mediaId = insertMedia({
    filename: file.name,
    path: publicPath,
    mimeType: file.type,
    size: file.size,
    alt,
  });

  return { path: publicPath, mediaId };
}

export function resolveUploadFile(storedName: string): string | null {
  const safe = path.basename(storedName);
  const full = path.join(getUploadsDir(), safe);
  if (!full.startsWith(getUploadsDir())) return null;
  if (!fs.existsSync(full)) return null;
  return full;
}

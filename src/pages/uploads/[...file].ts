import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { resolveUploadFile } from '../../lib/upload';

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  const parts = params.file;
  const name = Array.isArray(parts) ? parts.join('/') : parts;
  if (!name) return new Response('Not found', { status: 404 });

  const filePath = resolveUploadFile(name);
  if (!filePath) return new Response('Not found', { status: 404 });

  const data = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
  };
  const type = types[ext] || 'application/octet-stream';

  return new Response(data, {
    headers: {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=604800',
    },
  });
};

import fs from 'node:fs';
import path from 'node:path';

export function getDataDir(): string {
  const dir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(dir, 'uploads'), { recursive: true });
  return dir;
}

export function getDbPath(): string {
  return path.join(getDataDir(), 'cms.db');
}

export function getUploadsDir(): string {
  return path.join(getDataDir(), 'uploads');
}

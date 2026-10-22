import { getDb, readJson, writeJson } from './db';
import {
  defaultHomeContent,
  defaultPageHero,
  defaultSiteSettings,
  defaultTentangContent,
} from './defaults';
import type {
  FacilityItem,
  HomeContent,
  MediaItem,
  NewsItem,
  PageHero,
  ProgramItem,
  SiteSettings,
  TentangContent,
} from './types';

export function getSiteSettings(): SiteSettings {
  return readJson('site', defaultSiteSettings);
}

export function saveSiteSettings(value: SiteSettings) {
  writeJson('site', value);
}

export function getHomeContent(): HomeContent {
  return readJson('home', defaultHomeContent);
}

export function saveHomeContent(value: HomeContent) {
  writeJson('home', value);
}

export function getTentangContent(): TentangContent {
  return readJson('tentang', defaultTentangContent);
}

export function saveTentangContent(value: TentangContent) {
  writeJson('tentang', value);
}

export function getPageHero(key: keyof typeof defaultPageHero): PageHero {
  return readJson(`page:${key}`, defaultPageHero[key]);
}

export function savePageHero(key: keyof typeof defaultPageHero, value: PageHero) {
  writeJson(`page:${key}`, value);
}

function mapProgram(row: Record<string, unknown>): ProgramItem {
  const id = row.id as number;
  return {
    id,
    slug: (row.slug as string) || `${slugify(String(row.title))}-${id}`,
    title: row.title as string,
    description: row.description as string,
    body: (row.body as string) || '',
    image: row.image as string,
    videoKind: (row.video_kind as ProgramItem['videoKind']) || 'none',
    videoUrl: (row.video_url as string) || '',
    videoPath: (row.video_path as string) || '',
    published: row.published === undefined ? true : Boolean(row.published),
    sortOrder: row.sort_order as number,
  };
}

function mapFacility(row: Record<string, unknown>): FacilityItem {
  const id = row.id as number;
  return {
    id,
    slug: (row.slug as string) || `${slugify(String(row.title))}-${id}`,
    title: row.title as string,
    description: row.description as string,
    body: (row.body as string) || '',
    image: row.image as string,
    videoKind: (row.video_kind as FacilityItem['videoKind']) || 'none',
    videoUrl: (row.video_url as string) || '',
    videoPath: (row.video_path as string) || '',
    published: row.published === undefined ? true : Boolean(row.published),
    sortOrder: row.sort_order as number,
  };
}

function mapNews(row: Record<string, unknown>): NewsItem {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as string,
    publishedAt: row.published_at as string,
    excerpt: row.excerpt as string,
    body: row.body as string,
    coverImage: row.cover_image as string,
    videoKind: row.video_kind as NewsItem['videoKind'],
    videoUrl: row.video_url as string,
    videoPath: row.video_path as string,
    published: Boolean(row.published),
  };
}

function mapMedia(row: Record<string, unknown>): MediaItem {
  return {
    id: row.id as number,
    filename: row.filename as string,
    path: row.path as string,
    mimeType: row.mime_type as string,
    size: row.size as number,
    alt: row.alt as string,
    createdAt: row.created_at as string,
  };
}

export function listPrograms(publishedOnly = false): ProgramItem[] {
  const db = getDb();
  const sql = publishedOnly
    ? `SELECT * FROM programs WHERE published = 1 ORDER BY sort_order ASC, id ASC`
    : `SELECT * FROM programs ORDER BY sort_order ASC, id ASC`;
  const rows = db.prepare(sql).all();
  return rows.map((r) => mapProgram(r as Record<string, unknown>));
}

export function getProgramBySlug(slug: string): ProgramItem | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM programs WHERE slug = ? AND published = 1`).get(slug);
  return row ? mapProgram(row as Record<string, unknown>) : null;
}

export function getProgramById(id: number): ProgramItem | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM programs WHERE id = ?`).get(id);
  return row ? mapProgram(row as Record<string, unknown>) : null;
}

export function upsertProgram(
  input: Partial<ProgramItem> & { title: string; description: string; body: string },
) {
  const db = getDb();
  const slug = input.slug?.trim() || slugify(input.title);
  const videoKind = input.videoKind || 'none';

  if (input.id) {
    db.prepare(
      `UPDATE programs SET slug = ?, title = ?, description = ?, body = ?, image = ?, video_kind = ?, video_url = ?, video_path = ?, published = ?, sort_order = ? WHERE id = ?`,
    ).run(
      slug,
      input.title,
      input.description,
      input.body,
      input.image ?? '',
      videoKind,
      input.videoUrl ?? '',
      input.videoPath ?? '',
      input.published === false ? 0 : 1,
      input.sortOrder ?? 0,
      input.id,
    );
    return input.id;
  }
  const result = db
    .prepare(
      `INSERT INTO programs (slug, title, description, body, image, video_kind, video_url, video_path, published, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      slug,
      input.title,
      input.description,
      input.body,
      input.image ?? '',
      videoKind,
      input.videoUrl ?? '',
      input.videoPath ?? '',
      input.published === false ? 0 : 1,
      input.sortOrder ?? 999,
    );
  return Number(result.lastInsertRowid);
}

export function deleteProgram(id: number) {
  getDb().prepare(`DELETE FROM programs WHERE id = ?`).run(id);
}

export function listFacilities(publishedOnly = false): FacilityItem[] {
  const db = getDb();
  const sql = publishedOnly
    ? `SELECT * FROM facilities WHERE published = 1 ORDER BY sort_order ASC, id ASC`
    : `SELECT * FROM facilities ORDER BY sort_order ASC, id ASC`;
  const rows = db.prepare(sql).all();
  return rows.map((r) => mapFacility(r as Record<string, unknown>));
}

export function getFacilityBySlug(slug: string): FacilityItem | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM facilities WHERE slug = ? AND published = 1`).get(slug);
  return row ? mapFacility(row as Record<string, unknown>) : null;
}

export function getFacilityById(id: number): FacilityItem | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM facilities WHERE id = ?`).get(id);
  return row ? mapFacility(row as Record<string, unknown>) : null;
}

export function upsertFacility(
  input: Partial<FacilityItem> & { title: string; description: string; body: string },
) {
  const db = getDb();
  const slug = input.slug?.trim() || slugify(input.title);
  const videoKind = input.videoKind || 'none';

  if (input.id) {
    db.prepare(
      `UPDATE facilities SET slug = ?, title = ?, description = ?, body = ?, image = ?, video_kind = ?, video_url = ?, video_path = ?, published = ?, sort_order = ? WHERE id = ?`,
    ).run(
      slug,
      input.title,
      input.description,
      input.body,
      input.image ?? '',
      videoKind,
      input.videoUrl ?? '',
      input.videoPath ?? '',
      input.published === false ? 0 : 1,
      input.sortOrder ?? 0,
      input.id,
    );
    return input.id;
  }
  const result = db
    .prepare(
      `INSERT INTO facilities (slug, title, description, body, image, video_kind, video_url, video_path, published, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      slug,
      input.title,
      input.description,
      input.body,
      input.image ?? '',
      videoKind,
      input.videoUrl ?? '',
      input.videoPath ?? '',
      input.published === false ? 0 : 1,
      input.sortOrder ?? 999,
    );
  return Number(result.lastInsertRowid);
}

export function deleteFacility(id: number) {
  getDb().prepare(`DELETE FROM facilities WHERE id = ?`).run(id);
}

export function listNews(publishedOnly = false): NewsItem[] {
  const db = getDb();
  const sql = publishedOnly
    ? `SELECT * FROM news WHERE published = 1 ORDER BY published_at DESC, id DESC`
    : `SELECT * FROM news ORDER BY published_at DESC, id DESC`;
  const rows = db.prepare(sql).all();
  return rows.map((r) => mapNews(r as Record<string, unknown>));
}

export function getNewsBySlug(slug: string): NewsItem | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM news WHERE slug = ? AND published = 1`).get(slug);
  return row ? mapNews(row as Record<string, unknown>) : null;
}

export function getNewsById(id: number): NewsItem | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM news WHERE id = ?`).get(id);
  return row ? mapNews(row as Record<string, unknown>) : null;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function upsertNews(input: Partial<NewsItem> & { title: string; excerpt: string; body: string }) {
  const db = getDb();
  const slug = input.slug?.trim() || slugify(input.title);
  const publishedAt = input.publishedAt || new Date().toISOString().slice(0, 10);
  const videoKind = input.videoKind || 'none';

  if (input.id) {
    db.prepare(
      `UPDATE news SET slug = ?, title = ?, category = ?, published_at = ?, excerpt = ?, body = ?,
       cover_image = ?, video_kind = ?, video_url = ?, video_path = ?, published = ?, updated_at = datetime('now')
       WHERE id = ?`,
    ).run(
      slug,
      input.title,
      input.category ?? '',
      publishedAt,
      input.excerpt,
      input.body,
      input.coverImage ?? '',
      videoKind,
      input.videoUrl ?? '',
      input.videoPath ?? '',
      input.published === false ? 0 : 1,
      input.id,
    );
    return input.id;
  }

  const result = db
    .prepare(
      `INSERT INTO news (slug, title, category, published_at, excerpt, body, cover_image, video_kind, video_url, video_path, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      slug,
      input.title,
      input.category ?? '',
      publishedAt,
      input.excerpt,
      input.body,
      input.coverImage ?? '',
      videoKind,
      input.videoUrl ?? '',
      input.videoPath ?? '',
      input.published === false ? 0 : 1,
    );
  return Number(result.lastInsertRowid);
}

export function deleteNews(id: number) {
  getDb().prepare(`DELETE FROM news WHERE id = ?`).run(id);
}

export function listMedia(): MediaItem[] {
  const db = getDb();
  const rows = db.prepare(`SELECT * FROM media ORDER BY id DESC`).all();
  return rows.map((r) => mapMedia(r as Record<string, unknown>));
}

export function getMediaById(id: number): MediaItem | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM media WHERE id = ?`).get(id);
  return row ? mapMedia(row as Record<string, unknown>) : null;
}

export function insertMedia(item: Omit<MediaItem, 'id' | 'createdAt'>) {
  const db = getDb();
  const result = db
    .prepare(`INSERT INTO media (filename, path, mime_type, size, alt) VALUES (?, ?, ?, ?, ?)`)
    .run(item.filename, item.path, item.mimeType, item.size, item.alt);
  return Number(result.lastInsertRowid);
}

export function deleteMedia(id: number) {
  getDb().prepare(`DELETE FROM media WHERE id = ?`).run(id);
}

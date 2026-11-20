import { getDb, readJson, writeJson } from './db';
import { ensureUniqueSlug } from './slug';
import {
  defaultAchievements,
  defaultActivities,
  defaultHomeContent,
  defaultPageHero,
  defaultPartners,
  defaultPeople,
  defaultPpdbContent,
  defaultSchedule,
  defaultSiteSettings,
  defaultTentangContent,
  defaultTestimonials,
} from './defaults';
import type {
  AchievementItem,
  ActivityItem,
  FacilityItem,
  HomeContent,
  MediaItem,
  NewsItem,
  PageHero,
  PartnerItem,
  PersonItem,
  PpdbContent,
  ProgramItem,
  ScheduleItem,
  SiteSettings,
  TestimonialItem,
  TentangContent,
} from './types';

function nextListId<T extends { id: number }>(items: T[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function sortPublished<T extends { id: number; published: boolean; sortOrder: number }>(
  items: T[],
  publishedOnly: boolean,
): T[] {
  const list = publishedOnly ? items.filter((i) => i.published) : items;
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

export function getSiteSettings(): SiteSettings {
  return { ...defaultSiteSettings, ...readJson('site', defaultSiteSettings) };
}

export function saveSiteSettings(value: SiteSettings) {
  writeJson('site', value);
}

export function getPpdbContent(): PpdbContent {
  return { ...defaultPpdbContent, ...readJson('ppdb', defaultPpdbContent) };
}

export function savePpdbContent(value: PpdbContent) {
  writeJson('ppdb', value);
}

export function getSchedule(publishedOnly = false): ScheduleItem[] {
  return sortPublished(readJson('schedule', defaultSchedule), publishedOnly);
}

export function saveSchedule(items: ScheduleItem[]) {
  writeJson('schedule', items);
}

export function getTestimonials(publishedOnly = false): TestimonialItem[] {
  return sortPublished(readJson('testimonials', defaultTestimonials), publishedOnly);
}

export function saveTestimonials(items: TestimonialItem[]) {
  writeJson('testimonials', items);
}

export function upsertTestimonial(input: Partial<TestimonialItem> & { name: string; quote: string }) {
  const items = getTestimonials();
  if (input.id) {
    const next = items.map((item) =>
      item.id === input.id
        ? {
            ...item,
            name: input.name,
            role: input.role ?? item.role,
            quote: input.quote,
            photo: input.photo ?? item.photo,
            published: input.published === false ? false : true,
            sortOrder: input.sortOrder ?? item.sortOrder,
          }
        : item,
    );
    saveTestimonials(next);
    return input.id;
  }
  const id = nextListId(items);
  items.push({
    id,
    name: input.name,
    role: input.role ?? '',
    quote: input.quote,
    photo: input.photo ?? '',
    published: input.published === false ? false : true,
    sortOrder: input.sortOrder ?? items.length + 1,
  });
  saveTestimonials(items);
  return id;
}

export function deleteTestimonial(id: number) {
  saveTestimonials(getTestimonials().filter((i) => i.id !== id));
}

export function getAchievements(publishedOnly = false): AchievementItem[] {
  return sortPublished(readJson('achievements', defaultAchievements), publishedOnly);
}

export function saveAchievements(items: AchievementItem[]) {
  writeJson('achievements', items);
}

export function upsertAchievement(
  input: Partial<AchievementItem> & { title: string; kind: AchievementItem['kind'] },
) {
  const items = getAchievements();
  if (input.id) {
    saveAchievements(
      items.map((item) =>
        item.id === input.id
          ? {
              ...item,
              title: input.title,
              kind: input.kind,
              year: input.year ?? item.year,
              published: input.published === false ? false : true,
              sortOrder: input.sortOrder ?? item.sortOrder,
            }
          : item,
      ),
    );
    return input.id;
  }
  const id = nextListId(items);
  items.push({
    id,
    title: input.title,
    kind: input.kind,
    year: input.year ?? '',
    published: input.published === false ? false : true,
    sortOrder: input.sortOrder ?? items.length + 1,
  });
  saveAchievements(items);
  return id;
}

export function deleteAchievement(id: number) {
  saveAchievements(getAchievements().filter((i) => i.id !== id));
}

export function getActivities(publishedOnly = false): ActivityItem[] {
  return sortPublished(readJson('activities', defaultActivities), publishedOnly);
}

export function saveActivities(items: ActivityItem[]) {
  writeJson('activities', items);
}

export function upsertActivity(input: Partial<ActivityItem> & { title: string }) {
  const items = getActivities();
  if (input.id) {
    saveActivities(
      items.map((item) =>
        item.id === input.id
          ? {
              ...item,
              title: input.title,
              description: input.description ?? item.description,
              published: input.published === false ? false : true,
              sortOrder: input.sortOrder ?? item.sortOrder,
            }
          : item,
      ),
    );
    return input.id;
  }
  const id = nextListId(items);
  items.push({
    id,
    title: input.title,
    description: input.description ?? '',
    published: input.published === false ? false : true,
    sortOrder: input.sortOrder ?? items.length + 1,
  });
  saveActivities(items);
  return id;
}

export function deleteActivity(id: number) {
  saveActivities(getActivities().filter((i) => i.id !== id));
}

export function getPartners(publishedOnly = false): PartnerItem[] {
  return sortPublished(readJson('partners', defaultPartners), publishedOnly);
}

export function savePartners(items: PartnerItem[]) {
  writeJson('partners', items);
}

export function upsertPartner(input: Partial<PartnerItem> & { name: string }) {
  const items = getPartners();
  if (input.id) {
    savePartners(
      items.map((item) =>
        item.id === input.id
          ? {
              ...item,
              name: input.name,
              logo: input.logo ?? item.logo,
              url: input.url ?? item.url,
              published: input.published === false ? false : true,
              sortOrder: input.sortOrder ?? item.sortOrder,
            }
          : item,
      ),
    );
    return input.id;
  }
  const id = nextListId(items);
  items.push({
    id,
    name: input.name,
    logo: input.logo ?? '',
    url: input.url ?? '',
    published: input.published === false ? false : true,
    sortOrder: input.sortOrder ?? items.length + 1,
  });
  savePartners(items);
  return id;
}

export function deletePartner(id: number) {
  savePartners(getPartners().filter((i) => i.id !== id));
}

export function getPeople(publishedOnly = false): PersonItem[] {
  return sortPublished(readJson('people', defaultPeople), publishedOnly);
}

export function savePeople(items: PersonItem[]) {
  writeJson('people', items);
}

export function upsertPerson(input: Partial<PersonItem> & { name: string; role: string }) {
  const items = getPeople();
  if (input.id) {
    savePeople(
      items.map((item) =>
        item.id === input.id
          ? {
              ...item,
              name: input.name,
              role: input.role,
              photo: input.photo ?? item.photo,
              published: input.published === false ? false : true,
              sortOrder: input.sortOrder ?? item.sortOrder,
            }
          : item,
      ),
    );
    return input.id;
  }
  const id = nextListId(items);
  items.push({
    id,
    name: input.name,
    role: input.role,
    photo: input.photo ?? '',
    published: input.published === false ? false : true,
    sortOrder: input.sortOrder ?? items.length + 1,
  });
  savePeople(items);
  return id;
}

export function deletePerson(id: number) {
  savePeople(getPeople().filter((i) => i.id !== id));
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
  const rawSlug = input.slug?.trim() || slugify(input.title);
  const slug = ensureUniqueSlug('programs', rawSlug || slugify(input.title || 'program'), input.id);
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
  const rawSlug = input.slug?.trim() || slugify(input.title);
  const slug = ensureUniqueSlug('facilities', rawSlug || slugify(input.title || 'fasilitas'), input.id);
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
  const rawSlug = input.slug?.trim() || slugify(input.title);
  const slug = ensureUniqueSlug('news', rawSlug || slugify(input.title || 'berita'), input.id);
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

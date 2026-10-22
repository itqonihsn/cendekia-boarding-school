import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import {
  defaultFacilities,
  defaultHomeContent,
  defaultNews,
  defaultPageHero,
  defaultPrograms,
  defaultSiteSettings,
  defaultTentangContent,
} from './defaults';
import { getDbPath } from './paths';

function slugifyLocal(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

let db: DatabaseSync | null = null;

function migrate(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      published_at TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL DEFAULT '',
      video_kind TEXT NOT NULL DEFAULT 'none',
      video_url TEXT NOT NULL DEFAULT '',
      video_path TEXT NOT NULL DEFAULT '',
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      path TEXT NOT NULL,
      mime_type TEXT NOT NULL DEFAULT '',
      size INTEGER NOT NULL DEFAULT 0,
      alt TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );
  `);
  upgradeDetailTables(database);
}

function columnExists(database: DatabaseSync, table: string, column: string): boolean {
  const rows = database.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  return rows.some((r) => r.name === column);
}

function upgradeDetailTables(database: DatabaseSync) {
  const add = (table: string, column: string, ddl: string) => {
    if (!columnExists(database, table, column)) {
      database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
    }
  };

  for (const table of ['programs', 'facilities'] as const) {
    add(table, 'slug', 'TEXT NOT NULL DEFAULT ""');
    add(table, 'body', 'TEXT NOT NULL DEFAULT ""');
    add(table, 'video_kind', "TEXT NOT NULL DEFAULT 'none'");
    add(table, 'video_url', 'TEXT NOT NULL DEFAULT ""');
    add(table, 'video_path', 'TEXT NOT NULL DEFAULT ""');
    add(table, 'published', 'INTEGER NOT NULL DEFAULT 1');
  }

  for (const table of ['programs', 'facilities'] as const) {
    const rows = database.prepare(`SELECT id, title, slug, description, body FROM ${table}`).all() as {
      id: number;
      title: string;
      slug: string;
      description: string;
      body: string;
    }[];
    for (const row of rows) {
      let slug = row.slug;
      if (!slug) {
        slug = `${slugifyLocal(row.title)}-${row.id}`;
        database.prepare(`UPDATE ${table} SET slug = ? WHERE id = ?`).run(slug, row.id);
      }
      if (!row.body && row.description) {
        database.prepare(`UPDATE ${table} SET body = ? WHERE id = ?`).run(`<p>${row.description}</p>`, row.id);
      }
    }
  }
}

function setJson(database: DatabaseSync, key: string, value: unknown) {
  database
    .prepare(
      `INSERT INTO content (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
    )
    .run(key, JSON.stringify(value));
}

function seedIfEmpty(database: DatabaseSync) {
  const row = database.prepare(`SELECT COUNT(*) AS c FROM content`).get() as { c: number };
  if (row.c > 0) return;

  setJson(database, 'site', defaultSiteSettings);
  setJson(database, 'home', defaultHomeContent);
  setJson(database, 'tentang', defaultTentangContent);
  setJson(database, 'page:program', defaultPageHero.program);
  setJson(database, 'page:fasilitas', defaultPageHero.fasilitas);
  setJson(database, 'page:berita', defaultPageHero.berita);
  setJson(database, 'page:kontak', defaultPageHero.kontak);

  const insertProgram = database.prepare(
    `INSERT INTO programs (title, description, image, sort_order) VALUES (?, ?, ?, ?)`,
  );
  for (const p of defaultPrograms()) {
    insertProgram.run(p.title, p.description, p.image, p.sortOrder);
  }

  const insertFacility = database.prepare(
    `INSERT INTO facilities (title, description, image, sort_order) VALUES (?, ?, ?, ?)`,
  );
  for (const f of defaultFacilities()) {
    insertFacility.run(f.title, f.description, f.image, f.sortOrder);
  }

  const insertNews = database.prepare(
    `INSERT INTO news (slug, title, category, published_at, excerpt, body, cover_image, video_kind, video_url, video_path, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const n of defaultNews()) {
    insertNews.run(
      n.slug,
      n.title,
      n.category,
      n.publishedAt,
      n.excerpt,
      n.body,
      n.coverImage,
      n.videoKind,
      n.videoUrl,
      n.videoPath,
      n.published ? 1 : 0,
    );
  }

  const userCount = database.prepare(`SELECT COUNT(*) AS c FROM users`).get() as { c: number };
  if (userCount.c === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = bcrypt.hashSync(password, 10);
    database.prepare(`INSERT INTO users (username, password_hash) VALUES (?, ?)`).run(username, hash);
  }
}

export function getDb(): DatabaseSync {
  if (!db) {
    db = new DatabaseSync(getDbPath());
    migrate(db);
    seedIfEmpty(db);
  }
  return db;
}

export function readJson<T>(key: string, fallback: T): T {
  const database = getDb();
  const row = database.prepare(`SELECT value FROM content WHERE key = ?`).get(key) as
    | { value: string }
    | undefined;
  if (!row) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  setJson(getDb(), key, value);
}

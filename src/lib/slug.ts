import { getDb } from './db';

type SlugTable = 'news' | 'programs' | 'facilities';

export function ensureUniqueSlug(table: SlugTable, slug: string, excludeId?: number): string {
  const base = slug || 'item';
  let candidate = base;
  let suffix = 2;
  const db = getDb();

  while (true) {
    const row = db.prepare(`SELECT id FROM ${table} WHERE slug = ?`).get(candidate) as { id: number } | undefined;
    if (!row || (excludeId !== undefined && row.id === excludeId)) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

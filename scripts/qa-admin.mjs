/**
 * QA smoke test for admin CMS APIs (run against local server).
 * Usage:
 *   DATA_DIR=/tmp/cbs-qa SESSION_SECRET=qa-secret-min-16-characters ADMIN_USERNAME=qa ADMIN_PASSWORD=qapass123 npm run build
 *   DATA_DIR=... SESSION_SECRET=... ADMIN_USERNAME=qa ADMIN_PASSWORD=qapass123 PORT=4325 node dist/server/entry.mjs &
 *   node scripts/qa-admin.mjs http://127.0.0.1:4325
 */

const base = process.argv[2] || 'http://localhost:4325';
const user = process.env.ADMIN_USERNAME || 'qa';
const pass = process.env.ADMIN_PASSWORD || 'qapass123';

const failures = [];

function ok(name) {
  console.log(`  ✓ ${name}`);
}

function fail(name, detail) {
  failures.push({ name, detail });
  console.error(`  ✗ ${name}: ${detail}`);
}

function parseCookies(setCookie) {
  const jar = new Map();
  const list = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  for (const line of list) {
    const part = line.split(';')[0];
    const i = part.indexOf('=');
    if (i > 0) jar.set(part.slice(0, i), part.slice(i + 1));
  }
  return jar;
}

function cookieHeader(jar) {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

async function fetchFollow(url, init = {}, jar) {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(jar.size ? { Cookie: cookieHeader(jar) } : {}),
    },
    redirect: 'manual',
  });
  for (const [k, v] of parseCookies(res.headers.getSetCookie?.() ?? [])) {
    jar.set(k, v);
  }
  return res;
}

async function postForm(path, fields, jar) {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.append(k, v);
  return fetchFollow(`${base}${path}`, { method: 'POST', body }, jar);
}

async function main() {
  const jar = new Map();
  console.log(`QA admin @ ${base}\n`);

  const login = await postForm('/api/admin/login', { username: user, password: pass }, jar);
  if (login.status !== 302 || !String(login.headers.get('location') || '').includes('/admin')) {
    fail('login', `status ${login.status}`);
  } else ok('login');

  const bodyHtml = '<p>Isi uji QA otomatis.</p>';

  const program = await postForm(
    '/api/admin/programs',
    {
      title: 'Program QA Test',
      excerpt: 'Ringkasan program QA',
      body: bodyHtml,
      sortOrder: '99',
      published: 'on',
    },
    jar,
  );
  const progLoc = program.headers.get('location') || '';
  if (program.status === 302 && progLoc.includes('/admin/programs/')) ok('create program');
  else fail('create program', `status ${program.status} loc ${progLoc}`);

  const facility = await postForm(
    '/api/admin/facilities',
    {
      title: 'Fasilitas QA Test',
      excerpt: 'Ringkasan fasilitas QA',
      body: bodyHtml,
      sortOrder: '99',
      published: 'on',
    },
    jar,
  );
  const facLoc = facility.headers.get('location') || '';
  if (facility.status === 302 && facLoc.includes('/admin/facilities/')) ok('create facility');
  else fail('create facility', `status ${facility.status} loc ${facLoc}`);

  const news = await postForm(
    '/api/admin/news',
    {
      title: 'Berita QA Test',
      category: 'QA',
      publishedAt: new Date().toISOString().slice(0, 10),
      excerpt: 'Ringkasan berita QA',
      body: bodyHtml,
      published: 'on',
    },
    jar,
  );
  const newsLoc = news.headers.get('location') || '';
  if (news.status === 302 && newsLoc.includes('/admin/news/')) ok('create news');
  else fail('create news', `status ${news.status} loc ${newsLoc}`);

  const dupNews = await postForm(
    '/api/admin/news',
    {
      title: 'Berita QA Test',
      category: 'QA',
      publishedAt: new Date().toISOString().slice(0, 10),
      excerpt: 'Duplikat slug',
      body: bodyHtml,
      published: 'on',
    },
    jar,
  );
  if (dupNews.status === 302 && !String(dupNews.headers.get('location') || '').includes('error=')) {
    ok('duplicate news slug auto-suffix');
  } else {
    fail('duplicate news slug', `status ${dupNews.status}`);
  }

  const home = await postForm(
    '/api/admin/home',
    {
      heroTitle: 'QA',
      heroEmphasis: 'Test',
      heroLead: 'Lead QA',
    },
    jar,
  );
  if (home.status === 302 && home.headers.get('location')?.includes('saved=1')) ok('save home');
  else fail('save home', `status ${home.status}`);

  const settings = await postForm(
    '/api/admin/settings',
    {
      name: 'Cendekia Boarding School',
      shortName: 'CBS QA',
      fullName: 'CBS QA Full',
      foundation: 'YSMI',
      email: 'qa@test.local',
      phone: '+620000',
      address: 'QA',
      hours: 'QA',
      domain: 'https://example.com',
    },
    jar,
  );
  if (settings.status === 302 && settings.headers.get('location')?.includes('saved=1')) ok('save settings');
  else fail('save settings', `status ${settings.status}`);

  const publicPages = ['/', '/program', '/fasilitas', '/berita', '/kontak'];
  for (const path of publicPages) {
    const res = await fetch(`${base}${path}`);
    if (res.status === 200) ok(`public ${path}`);
    else fail(`public ${path}`, `status ${res.status}`);
  }

  const slugRes = await fetch(`${base}/berita/berita-qa-test`);
  if (slugRes.status === 200) ok('public news detail slug');
  else fail('public news detail', `status ${slugRes.status}`);

  console.log('');
  if (failures.length) {
    console.error(`${failures.length} failure(s).`);
    process.exit(1);
  }
  console.log('All QA checks passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

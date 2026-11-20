# PPDB Theme + CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle Cendekia to brochure blue–gold, make the homepage PPDB-first with WA conversion, and extend the admin CMS so fees/year and brochure content are editable.

**Architecture:** Extend the existing Astro SSR + SQLite CMS. New seasonal/evergreen blocks live as `content` JSON keys or small tables; public homepage reads them and hides fees when PPDB is closed while keeping the Daftar CTA. Theme tokens change in `global.css` / `admin.css`.

**Tech Stack:** Astro 7, TypeScript, `node:sqlite`, existing admin form POST APIs, CSS variables.

**Spec:** `docs/superpowers/specs/2026-11-20-ppdb-theme-cms-design.md`

## Global Constraints

- Keep Astro + SQLite + `DATA_DIR`; do not wipe existing news/programs/facilities/media/users.
- Homepage order: PPDB hero → biaya (if open) → fasilitas → jadwal → testimoni → cerita/panca karakter → program → kegiatan istimewa → prestasi → mitra → CTA.
- PPDB closed: hide fees; keep Daftar/WA button.
- Seed defaults from the owner’s PPDB leaflets (TA 2027/2028; pendaftaran 250rb; uang masuk 7,5jt; SPP 1,45jt).
- Indonesian UI; verify on `http://127.0.0.1:4321` and `/admin`.
- No git commit unless the user asks.

## Review Focus

- Closed PPDB must not show fee badges or biaya section, but Daftar remains.
- Empty new CMS lists must not crash the homepage.
- Saving PPDB fees must not require redeploy.
- Existing programs/news still render after migrate.
- Mobile: hero stays one composition; schedule readable.

---

### Task 1: Types, defaults, content accessors

**Files:**
- Modify: `src/lib/types.ts`, `src/lib/defaults.ts`, `src/lib/content.ts`, `src/lib/db.ts`, `src/data/site.ts`
- Create: `src/lib/ppdb-defaults.ts` (optional; can live in defaults.ts)

**Produces:** `getPpdbContent`, `getSchedule`, `listTestimonials`, `listAchievements`, `listActivities`, `listPartners`, `listPeople` (+ save/CRUD helpers matching existing patterns); extended `SiteSettings` social fields.

- [ ] Add TypeScript types for PpdbContent, ScheduleItem, Testimonial, Achievement, Activity, Partner, Person.
- [ ] Seed brochure defaults (fees, schedule rows, 3 testimonials, achievements, kegiatan, partners, GENIUS visi/misi, panca karakter, contact/social).
- [ ] Migrate: create tables or JSON keys; seed only when empty.
- [ ] Verify: restart/reload app; `getPpdbContent().academicYear` returns `2027/2028` in a quick node/astro path or via homepage later.

### Task 2: Theme tokens (visible locally)

**Files:**
- Modify: `src/styles/global.css`, `src/styles/admin.css`, `src/layouts/BaseLayout.astro` (fonts if needed)

**Produces:** Royal blue / white / gold visual system.

- [ ] Replace green-paper tokens with brochure blue–gold; update buttons, header, bands.
- [ ] Verify at `/` that colors changed (no green paper background).

### Task 3: Homepage PPDB-first

**Files:**
- Modify: `src/pages/index.astro`, `src/components/Header.astro`, `src/components/Footer.astro`

**Produces:** Spec section order + closed-state fee hiding + WA CTAs.

- [ ] Rewrite homepage sections per spec.
- [ ] Header CTA → “Daftar Sekarang” / Info PPDB via WA.
- [ ] Verify open: fees visible; temporarily set closed in DB or toggle and confirm fees hidden, CTA remains.

### Task 4: Admin PPDB + schedule + list CRUDs

**Files:**
- Modify: `src/layouts/AdminLayout.astro`
- Create: `src/pages/admin/ppdb.astro`, `src/pages/admin/schedule.astro`, and list/edit pages for testimonials, achievements, activities, partners, people
- Create: matching `src/pages/api/admin/*.ts`
- Modify: `src/pages/admin/settings.astro` + settings API for social links
- Modify: `src/pages/admin/tentang.astro` for GENIUS/panca if needed

**Produces:** Admin can edit fees/year/open flag and CRUD brochure lists.

- [ ] Sidebar groups: PPDB & Konversi, then Konten, then Media/Pengaturan.
- [ ] PPDB form save → reload public homepage reflects fees.
- [ ] Smoke: open each new admin page (200).

### Task 5: Restyle inner pages + tentang content

**Files:**
- Modify: `src/pages/tentang.astro`, `program.astro`, `fasilitas.astro`, `berita.astro`, `kontak.astro`, related CSS in those files / global

**Produces:** Consistent blue–gold theme; tentang shows visi GENIUS when content present.

- [ ] Visual pass; kontak shows updated address/social/WA.

### Task 6: Local verification

- [ ] Web `/` 200, admin login 200, fees/CTA present.
- [ ] Toggle PPDB closed via admin; fees gone, Daftar remains.
- [ ] Leave dev server running for the owner to review.

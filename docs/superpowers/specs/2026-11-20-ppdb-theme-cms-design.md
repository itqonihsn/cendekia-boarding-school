# Design: Cendekia PPDB-first theme + CMS

**Date:** 2026-11-20  
**Repo:** `cendekia-boarding-school`  
**Status:** ready for approval

## Intent and why

Refresh the public website and admin CMS so the site feels like the official PPDB brochure (informative and pleasant), drives WhatsApp / registration clicks, and lets admins update fees and academic year every year plus CRUD pesantren information — without editing code.

Success, as stated by the owner:

- The site is very informative and pleasant to look at.
- Many visitors click WhatsApp to contact admin / register.
- Admin can change fees and academic year each year.
- Admin can CRUD pesantren information content.

## Goals

1. **PPDB-first homepage** — hero and first viewport lead with penerimaan santri, academic year, fee highlights, and a clear WhatsApp CTA. Pesantren story (visi, program, prestasi, dll.) comes after.
2. **Brochure-aligned visual theme** — royal blue + white + gold/yellow accents (from PPDB leaflets), replacing the current green–yellow paper look, while keeping the existing logo.
3. **Brochure-aligned content surface** — homepage and related sections reflect leaflet content: fees, facilities, daily schedule, testimonials, visi/misi GENIUS, panca karakter, program unggulan, kegiatan istimewa, prestasi, leadership/staff highlights, partners, contact + social.
4. **CMS that owns seasonal + evergreen content** — especially PPDB fees/year, plus CRUD for the new content types above; keep existing CRUD for programs, facilities, news, settings.
5. **Preserve deploy path** — Astro SSR + SQLite in `DATA_DIR`, GitHub Actions → VPS, Cloudflare Tunnel unchanged.

## Non-goals

- Building a full applicant portal (form submissions stored in DB, document upload for calon santri, payment tracking). WhatsApp remains the registration channel.
- Replacing the stack (stay on Astro + `node:sqlite` + bcrypt sessions).
- Redesigning `bani-toha`, analytics, or portfolio.
- Automating brochure image OCR; seed content is transcribed/adapted by hand from the leaflets.
- Perfect pixel clone of print layout; we adapt for web and mobile.

## Anti-goals

- Pretty redesign that buries the WA / daftar CTA below the fold.
- Hard-coding 2027/2028 fees in templates so admin cannot change them next year.
- Breaking existing published news/programs/facilities data on upgrade.
- Shipping admin UX that requires editing JSON by hand.

## Constraints

- Existing app: Astro 7 SSR, SQLite CMS (`content` JSON keys + tables for programs/facilities/news/media/users), admin at `/admin`.
- Local and prod use `DATA_DIR` for DB + uploads; deploy must not wipe data.
- Production is live via Cloudflare Tunnel; ship through the existing GitHub Actions deploy after local verification.
- User frontend rules: brand-first hero, no card clutter in hero, real imagery where possible, avoid generic purple/cream AI aesthetics; here the brand direction is explicitly brochure blue–gold.
- Indonesian UI copy for public site and admin.

## Approaches considered

| Approach | Summary | Trade-off |
|---|---|---|
| **1. Extend current site + CMS (chosen)** | Restyle theme; reorder homepage PPDB-first; add CMS modules for new content types; keep programs/facilities/news. | Fastest; keeps data and deploy path. Some older pages need restyle to match. |
| 2. Dedicated `/ppdb` only | Strong conversion page; rest of site lightly restyled. | Apex visitors can miss fees/CTA on `/`. |
| 3. Full rebuild | New architecture. | Slow, high risk, discards working CMS. |

**Chosen:** Approach 1.

## Public site design

### Visual system

- CSS variables: deep royal blue as primary, white/off-white surfaces, gold/yellow for CTAs and highlights, optional teal for secondary list headers (as in leaflet).
- Typography: keep a clear display + body pairing suited to Islamic-modern brochure feel (replace current green-tied Cormorant/Source Sans tokens as needed; avoid default Inter/Roboto stacks).
- Components: rounded section headers (pill/rounded rect), high-contrast blue bands, fee “badges” near hero, numbered lists for programs/schedule — adapted for responsive layout, not print tri-fold.
- Header CTA stays WhatsApp (“Daftar / Hubungi”); primary buttons use gold on blue.

### Homepage section order (top → bottom)

1. **Hero PPDB** — logo/brand, tagline *Al-Qur'annya Oke! Akademiknya Oke!*, penerimaan santri + academic year, fee badges (uang masuk, SPP) when PPDB is open, primary WA CTA (“Daftar”) + secondary “lihat program”.
2. **Biaya ringkas** — shown only when PPDB is open: registration fee, uang masuk, SPP (what’s included), link/CTA to WA.
3. **Fasilitas** — from CMS facilities (seeded from brochure list).
4. **Jadwal harian** — compact schedule table/list from CMS.
5. **Testimoni** — parent quotes from CMS.
6. **Cerita pesantren** — short about + panca karakter + link to `/tentang`.
7. **Program unggulan** — from existing programs CMS (seeded/updated from brochure).
8. **Kegiatan istimewa** — ordered list/cards from CMS (brochure “Kegiatan Istimewa Santri”).
9. **Prestasi** — highlights from CMS (external/internal).
10. **Mitra strategis** — partner name + logo from CMS.
11. **CTA penutup** — WA again + contact strip (phone, IG/YT/FB, address).

**PPDB closed behavior (decided):** hide all fee badges and the “Biaya ringkas” section; keep the Daftar / WA button visible (visitors can still contact admin).

Inner pages (`/tentang`, `/program`, `/fasilitas`, `/berita`, `/kontak`) restyled to the same theme; `/tentang` updated for visi GENIUS + misi + leadership when content exists.

### Navigation

Keep existing nav items; reinforce WA CTA label toward pendaftaran (e.g. “Daftar Sekarang” or “Info PPDB”) without removing access to other pages.

## CMS / admin design

### New or extended content keys / modules

| Module | Storage | Admin can |
|---|---|---|
| **PPDB** | `content` key `ppdb` (JSON) | Edit academic year label, open/closed flag, three flat fees (pendaftaran, uang masuk, SPP) + notes, hero overlay copy, optional WA message override |
| **Jadwal harian** | `content` key `schedule` | CRUD ordered time + activity rows |
| **Testimoni** | table `testimonials` or JSON list | CRUD name, role/occupation, quote, photo, sort, published |
| **Prestasi** | table `achievements` or JSON list | CRUD title, kind (external/internal), year, sort, published |
| **Kegiatan istimewa** | table or JSON list | CRUD title, short description (optional), sort, published |
| **Mitra strategis** | table or JSON list | CRUD name, logo, URL (optional), sort, published |
| **Pimpinan / SDM** | table `people` or JSON list | CRUD name, title/role, photo, sort, published |
| **Panca karakter / list blocks** | inside `tentang` or `home` JSON | Edit character labels and short descriptions |
| **Site settings** | existing `site` | Extend with Instagram, YouTube, Facebook, maps URL if missing |

Existing modules remain: settings, home (trimmed to story sections that stay on homepage), tentang, programs, facilities, news, media, page heroes.

### Admin UX improvements

- Dashboard cards for PPDB year/fees + counts of programs, facilities, news, testimonials.
- Sidebar group: **PPDB & Konversi** (PPDB, jadwal, testimoni) then **Konten** (program, fasilitas, berita, tentang, home) then **Media / Pengaturan**.
- Clear Indonesian labels; fee fields as plain numbers + display note; preview link to public homepage.
- Prefer list + edit patterns already used for programs/news (no new framework).

### Data migration

- On migrate: add tables/columns as needed; seed PPDB defaults from brochure (TA 2027/2028, fees as on leaflet) only when key empty.
- Do not wipe existing news/programs/facilities/media/users.
- Update default seed text for visi/misi/tagline to brochure wording for **new** installs; for existing DBs, provide one-time seed-or-merge only for empty new keys (builder chooses safest merge without overwriting admin edits).

### Builder calls (settled)

- **Seed source:** transcribe concrete defaults from the PPDB leaflet images the owner provided (not empty placeholders).
- **Fee schema:** three flat figures only (biaya pendaftaran, uang masuk, SPP + notes) — no jenjang/putra-putri variants in v1.
- **Kegiatan istimewa + mitra:** in scope for this delivery (homepage sections + CMS).

## Technical notes (left to builder)

- Prefer extending `src/lib/types.ts`, `db.ts`, `content.ts`, `defaults.ts`, admin pages under `src/pages/admin/`, and `global.css` / `admin.css`.
- WhatsApp helpers already exist (`whatsapp.ts`); PPDB CTAs must use editable phone from settings + optional PPDB message.
- Images: use uploads via existing media/upload APIs; brochure photos are reference — site may use existing uploads or placeholders until admin replaces them.
- Mobile: fee badges and schedule must remain readable; hero stays one composition (brand, one headline, one supporting line, CTA group, one dominant image).
- Verify locally at `http://127.0.0.1:4321` and `/admin` before deploy.

## Out of scope for this delivery (follow-ups)

- Applicant CRM / online form with DB persistence.
- Payment gateway.
- QR codes as dynamic assets (static image upload via media is enough if needed).
- Changing Cloudflare / VPS / GitHub secrets.

## Approval

Approve this design (reply “setuju” / “approve”) to proceed to an implementation plan, then build.

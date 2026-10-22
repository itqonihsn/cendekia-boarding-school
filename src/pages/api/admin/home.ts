import type { APIRoute } from 'astro';
import { getHomeContent, saveHomeContent } from '../../../lib/content';
import { adminErrorRedirect } from '../../../lib/admin-api';
import { parseImagePathFromForm } from '../../../lib/admin-form';
import { saveUpload } from '../../../lib/upload';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const returnTo = '/admin/home';
  try {
  const form = await request.formData();
  const current = getHomeContent();

  const heroFile = form.get('heroImageFile');
  let heroImage = parseImagePathFromForm(form, 'heroImage', 'clearHeroImage', current.heroImage);
  if (heroFile instanceof File && heroFile.size > 0) {
    const uploaded = await saveUpload(heroFile, 'Hero beranda');
    heroImage = uploaded.path;
  }

  const pillars = [0, 1, 2].map((i) => ({
    title: String(form.get(`pillarTitle${i}`) || ''),
    desc: String(form.get(`pillarDesc${i}`) || ''),
  }));

  const aboutBullets = [0, 1, 2, 3].map((i) => String(form.get(`aboutBullet${i}`) || '')).filter(Boolean);

  saveHomeContent({
    heroTitle: String(form.get('heroTitle') || current.heroTitle),
    heroEmphasis: String(form.get('heroEmphasis') || current.heroEmphasis),
    heroLead: String(form.get('heroLead') || current.heroLead),
    heroImage,
    foundationEyebrow: String(form.get('foundationEyebrow') || current.foundationEyebrow),
    foundationTitle: String(form.get('foundationTitle') || current.foundationTitle),
    foundationLead: String(form.get('foundationLead') || current.foundationLead),
    pillars,
    quoteText: String(form.get('quoteText') || current.quoteText),
    quoteCite: String(form.get('quoteCite') || current.quoteCite),
    aboutEyebrow: String(form.get('aboutEyebrow') || current.aboutEyebrow),
    aboutTitle: String(form.get('aboutTitle') || current.aboutTitle),
    aboutLead: String(form.get('aboutLead') || current.aboutLead),
    aboutBullets,
    ctaQuote: String(form.get('ctaQuote') || current.ctaQuote),
    ctaButton: String(form.get('ctaButton') || current.ctaButton),
  });

  return redirect(`${returnTo}?saved=1`);
  } catch (err) {
    return redirect(adminErrorRedirect(returnTo, err));
  }
};

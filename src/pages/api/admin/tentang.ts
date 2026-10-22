import type { APIRoute } from 'astro';
import { getTentangContent, saveTentangContent } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const current = getTentangContent();

  const missionItems = [0, 1, 2, 3].map((i) => String(form.get(`mission${i}`) || '')).filter(Boolean);
  const values = [0, 1, 2].map((i) => ({
    label: String(form.get(`valueLabel${i}`) || ''),
    title: String(form.get(`valueTitle${i}`) || ''),
    desc: String(form.get(`valueDesc${i}`) || ''),
  }));

  saveTentangContent({
    hero: {
      eyebrow: String(form.get('heroEyebrow') || current.hero.eyebrow),
      title: String(form.get('heroTitle') || current.hero.title),
      subtitle: String(form.get('heroSubtitle') || current.hero.subtitle),
    },
    whoEyebrow: String(form.get('whoEyebrow') || current.whoEyebrow),
    whoTitle: String(form.get('whoTitle') || current.whoTitle),
    whoLead: String(form.get('whoLead') || current.whoLead),
    whoFoundationNote: String(form.get('whoFoundationNote') || current.whoFoundationNote),
    visionTitle: String(form.get('visionTitle') || current.visionTitle),
    visionText: String(form.get('visionText') || current.visionText),
    missionTitle: String(form.get('missionTitle') || current.missionTitle),
    missionItems,
    valuesEyebrow: String(form.get('valuesEyebrow') || current.valuesEyebrow),
    valuesTitle: String(form.get('valuesTitle') || current.valuesTitle),
    values,
  });

  return redirect('/admin/tentang?saved=1');
};

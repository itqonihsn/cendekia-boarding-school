import type { APIRoute } from 'astro';
import { getSiteSettings, saveSiteSettings } from '../../../lib/content';
import { saveUpload } from '../../../lib/upload';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const current = getSiteSettings();

  const logoFile = form.get('logoFile');
  let logo = String(form.get('logo') || current.logo);
  if (logoFile instanceof File && logoFile.size > 0) {
    const uploaded = await saveUpload(logoFile, 'Logo');
    logo = uploaded.path;
  }

  saveSiteSettings({
    name: String(form.get('name') || current.name),
    shortName: String(form.get('shortName') || current.shortName),
    fullName: String(form.get('fullName') || current.fullName),
    foundation: String(form.get('foundation') || current.foundation),
    tagline: String(form.get('tagline') || current.tagline),
    email: String(form.get('email') || current.email),
    phone: String(form.get('phone') || current.phone),
    address: String(form.get('address') || current.address),
    hours: String(form.get('hours') || current.hours),
    logo,
    domain: String(form.get('domain') || current.domain),
  });

  return redirect('/admin/settings?saved=1');
};

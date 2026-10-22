import type { APIRoute } from 'astro';
import { getSiteSettings, saveSiteSettings } from '../../../lib/content';
import { adminErrorRedirect } from '../../../lib/admin-api';
import { parseImagePathFromForm } from '../../../lib/admin-form';
import { saveUpload } from '../../../lib/upload';

const DEFAULT_LOGO = '/logo.svg';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const returnTo = '/admin/settings';
  try {
  const form = await request.formData();
  const current = getSiteSettings();

  const logoFile = form.get('logoFile');
  let logo = parseImagePathFromForm(form, 'logo', 'clearLogo', current.logo);
  if (form.get('clearLogo') === 'on' && !(logoFile instanceof File && logoFile.size > 0)) {
    logo = DEFAULT_LOGO;
  }
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

  return redirect(`${returnTo}?saved=1`);
  } catch (err) {
    return redirect(adminErrorRedirect(returnTo, err));
  }
};

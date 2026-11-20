import type { APIRoute } from 'astro';
import { adminErrorRedirect } from '../../../lib/admin-api';
import { getPpdbContent, savePpdbContent } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const returnTo = '/admin/ppdb';
  try {
    const form = await request.formData();
    const current = getPpdbContent();
    savePpdbContent({
      open: String(form.get('open') || '1') === '1',
      academicYear: String(form.get('academicYear') || current.academicYear),
      headline: String(form.get('headline') || current.headline),
      tagline: String(form.get('tagline') || current.tagline),
      registrationFeeLabel: String(form.get('registrationFeeLabel') || current.registrationFeeLabel),
      registrationFee: String(form.get('registrationFee') || current.registrationFee),
      entranceFeeLabel: String(form.get('entranceFeeLabel') || current.entranceFeeLabel),
      entranceFee: String(form.get('entranceFee') || current.entranceFee),
      sppFeeLabel: String(form.get('sppFeeLabel') || current.sppFeeLabel),
      sppFee: String(form.get('sppFee') || current.sppFee),
      sppNote: String(form.get('sppNote') || ''),
      waMessage: String(form.get('waMessage') || current.waMessage),
      ctaLabel: String(form.get('ctaLabel') || current.ctaLabel),
    });
    return redirect(`${returnTo}?saved=1`);
  } catch (err) {
    return redirect(adminErrorRedirect(returnTo, err));
  }
};

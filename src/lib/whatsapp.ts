/** Nomor telepon situs → digits untuk wa.me (Indonesia: 62…). */
export function whatsappDigits(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
  return digits;
}

export function whatsappChatUrl(phone: string, text?: string): string | null {
  const digits = whatsappDigits(phone);
  if (!digits) return null;
  const url = new URL(`https://wa.me/${digits}`);
  if (text?.trim()) url.searchParams.set('text', text.trim());
  return url.toString();
}

export function whatsappRegistrationUrl(phone: string, schoolName: string): string | null {
  return whatsappChatUrl(
    phone,
    `Assalamu'alaikum, saya ingin informasi pendaftaran santri baru di ${schoolName}. Mohon bantuannya.`,
  );
}

export function whatsappProgramUrl(phone: string, schoolName: string): string | null {
  return whatsappChatUrl(
    phone,
    `Assalamu'alaikum, saya ingin bertanya tentang program dan pendaftaran di ${schoolName}.`,
  );
}

/** Link eksternal WA, atau fallback ke halaman kontak jika nomor kosong. */
export function waHref(waUrl: string | null, fallback = '/kontak'): string {
  return waUrl ?? fallback;
}

export function waLinkAttrs(waUrl: string | null): Record<string, string> {
  if (!waUrl) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
}

export function adminErrorRedirect(returnTo: string, err: unknown, fallback = 'Gagal menyimpan data.') {
  const message = err instanceof Error ? err.message : fallback;
  const sep = returnTo.includes('?') ? '&' : '?';
  return `${returnTo}${sep}error=${encodeURIComponent(message)}`;
}

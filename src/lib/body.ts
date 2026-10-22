import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });

/** Konten lama HTML tetap jalan; konten baru dari editor disimpan sebagai HTML Quill. */
export function renderArticleBody(body: string): string {
  const text = body.trim();
  if (!text) return '';
  if (text.startsWith('<')) return text;
  return marked.parse(text) as string;
}

import type { APIRoute } from 'astro';
import { adminErrorRedirect } from '../../../lib/admin-api';
import { saveSchedule } from '../../../lib/content';
import type { ScheduleItem } from '../../../lib/types';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const returnTo = '/admin/schedule';
  try {
    const form = await request.formData();
    const text = String(form.get('scheduleText') || '');
    const items: ScheduleItem[] = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const sep = line.indexOf('|');
        const time = (sep >= 0 ? line.slice(0, sep) : line).trim();
        const activity = (sep >= 0 ? line.slice(sep + 1) : '').trim() || time;
        return {
          id: index + 1,
          time,
          activity: sep >= 0 ? activity : time,
          published: true,
          sortOrder: index + 1,
        };
      });
    saveSchedule(items);
    return redirect(`${returnTo}?saved=1`);
  } catch (err) {
    return redirect(adminErrorRedirect(returnTo, err));
  }
};

/**
 * VN timezone date helpers.
 *
 * Uses Intl.DateTimeFormat with timeZone:'Asia/Ho_Chi_Minh' — the only
 * approach that's correct at UTC boundaries AND on hosts whose process
 * timezone isn't VN (Vercel/Cloudflare run UTC).
 *
 * Avoid: `new Date().toISOString().slice(0, 10)` — that's UTC date, off by
 * one half the day for VN users. Also avoid `new Date(now + 7h)` because it
 * produces the right output in normal cases but leaks UTC offset assumptions
 * if the server clock skews or the call surfaces in a non-VN-locale renderer.
 *
 * See P0 audit #1.5 (Tử vi hôm nay date off-by-one).
 */

const ISO_FORMAT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Returns today's date in VN (UTC+7) as ISO YYYY-MM-DD.
 * `en-CA` locale gives `2026-05-21` shape natively.
 */
export function getVietnamTodayISO(date: Date = new Date()): string {
  return ISO_FORMAT.format(date);
}

/**
 * Returns parts of the VN-local date for the given instant.
 * Useful when you need year/month/day separately.
 */
export function getVietnamDateParts(date: Date = new Date()): {
  year: number;
  month: number;
  day: number;
} {
  // Use formatToParts for unambiguous extraction (no string parsing).
  const parts = ISO_FORMAT.formatToParts(date);
  const get = (name: 'year' | 'month' | 'day') =>
    Number(parts.find((p) => p.type === name)?.value ?? 0);
  return { year: get('year'), month: get('month'), day: get('day') };
}

const HOUR_FORMAT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh',
  hour: '2-digit',
  hourCycle: 'h23',
});

/**
 * Returns the VN-local hour-of-day (0–23) for the given instant.
 * Correct on hosts whose process timezone isn't VN (Vercel/Cloudflare run UTC)
 * AND for clients in any timezone — the canh-giờ must always be VN wall-clock,
 * never the viewer's device clock.
 */
export function getVietnamHour(date: Date = new Date()): number {
  const parts = HOUR_FORMAT.formatToParts(date);
  return Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
}

/**
 * Format an ISO date (YYYY-MM-DD) as vi-VN DD/MM/YYYY for display.
 * Returns the input unchanged on a parse miss (safe on '' / partial values).
 * Canonical VN-facing date formatter — prefer this over inline regexes so
 * birth/target dates never surface as raw ISO ("1990-05-15") to users.
 */
export function formatVnDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

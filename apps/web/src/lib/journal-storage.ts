/**
 * Client-side storage utility for Decision Journal + Weekly Review features.
 *
 * Data lives in localStorage on the user's browser — never sent to a server.
 * All read/write operations are best-effort and swallow errors (quota, disabled storage,
 * SSR pre-hydration). All public functions are safe to call from server components;
 * they no-op or return [] when `window` is undefined.
 */

export type JournalTopic =
  | 'career'
  | 'relationship'
  | 'finance'
  | 'family'
  | 'general';

export interface JournalEntry {
  id: string;
  createdAt: string;
  topic: JournalTopic;
  question: string;
  decision: string;
  reasoning: string;
  expectedOutcome: string;
  reviewedAt?: string;
  actualOutcome?: string;
  lesson?: string;
}

export interface WeeklyReview {
  id: string;
  weekStart: string;
  createdAt: string;
  highlights: string;
  energyDrain: string;
  oneLearning: string;
  oneChange: string;
  topicFocus: JournalTopic;
}

const JOURNAL_KEY = 'hieu:journal:entries:v1';
const WEEKLY_KEY = 'hieu:weekly:reviews:v1';

function hasWindow(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readArray<T>(key: string): T[] {
  if (!hasWindow()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, items: T[]): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    /* quota exceeded / storage disabled — degrade silently */
  }
}

// ---------------------------------------------------------------------------
// Journal entries
// ---------------------------------------------------------------------------

export function readJournalEntries(): JournalEntry[] {
  return readArray<JournalEntry>(JOURNAL_KEY);
}

export function saveJournalEntry(entry: JournalEntry): void {
  const all = readJournalEntries();
  const idx = all.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.unshift(entry);
  }
  writeArray(JOURNAL_KEY, all);
}

export function updateJournalEntry(
  id: string,
  patch: Partial<JournalEntry>,
): void {
  const all = readJournalEntries();
  const idx = all.findIndex((e) => e.id === id);
  if (idx < 0) return;
  const existing = all[idx];
  if (!existing) return;
  all[idx] = { ...existing, ...patch, id: existing.id };
  writeArray(JOURNAL_KEY, all);
}

export function deleteJournalEntry(id: string): void {
  const all = readJournalEntries().filter((e) => e.id !== id);
  writeArray(JOURNAL_KEY, all);
}

// ---------------------------------------------------------------------------
// Weekly reviews
// ---------------------------------------------------------------------------

export function readWeeklyReviews(): WeeklyReview[] {
  return readArray<WeeklyReview>(WEEKLY_KEY);
}

export function saveWeeklyReview(review: WeeklyReview): void {
  const all = readWeeklyReviews();
  // Upsert keyed by weekStart (one review per week).
  const idx = all.findIndex((r) => r.weekStart === review.weekStart);
  if (idx >= 0) {
    all.splice(idx, 1, review);
  } else {
    all.unshift(review);
  }
  // Keep newest first.
  all.sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1));
  writeArray(WEEKLY_KEY, all);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function makeId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    try {
      return prefix + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    } catch {
      /* fall through */
    }
  }
  return (
    prefix +
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36)
  );
}

/**
 * Return the YYYY-MM-DD of Monday for the week containing `date`, in Asia/Ho_Chi_Minh tz.
 *
 * Uses an Intl-based extraction of the VN-local date parts to avoid TZ drift on UTC servers.
 */
export function mondayOfWeekVN(date: Date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const y = Number(get('year'));
  const m = Number(get('month'));
  const d = Number(get('day'));
  const weekday = get('weekday'); // Mon, Tue, ...

  const weekdayOffset: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  const offset = weekdayOffset[weekday] ?? 0;

  // Compose a UTC date for the VN-local Y-M-D, then subtract `offset` days.
  const base = new Date(Date.UTC(y, m - 1, d));
  base.setUTCDate(base.getUTCDate() - offset);

  const yy = base.getUTCFullYear();
  const mm = String(base.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(base.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

/**
 * Personality result store — persists MBTI / Big Five / DISC results in
 * localStorage so /decisions and the Mentor can send a personalitySummary
 * context to the backend.
 *
 * Keys are versioned; old unknown keys are ignored on read. Data is small
 * (~200 chars) and willingly evictable — if localStorage is unavailable or
 * full, every operation no-ops silently.
 */

const PREFIX = 'hieu:personality:v1:';

export type PersonalityKey = 'mbti' | 'big-five' | 'disc' | 'enneagram';

function store(): Storage | null {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; } catch { return null; }
}

/** Persist a personality result. Silently no-ops if localStorage is unavailable. */
export function savePersonalityResult(key: PersonalityKey, value: string): void {
  try { store()?.setItem(PREFIX + key, value.slice(0, 400)); } catch { /* best-effort */ }
}

/** Read a single stored personality result (e.g. for "đã soi" note), or null. */
export function getPersonalityResult(key: PersonalityKey): string | null {
  try { return store()?.getItem(PREFIX + key) ?? null; } catch { return null; }
}

/** Return a single-line summary of all stored personality results, or '' if none. */
export function getPersonalitySummary(): string {
  const s = store();
  if (!s) return '';
  const parts: string[] = [];
  const mbti = s.getItem(PREFIX + 'mbti');
  if (mbti) parts.push(mbti);
  const bf = s.getItem(PREFIX + 'big-five');
  if (bf) parts.push(bf);
  const disc = s.getItem(PREFIX + 'disc');
  if (disc) parts.push(disc);
  const enneagram = s.getItem(PREFIX + 'enneagram');
  if (enneagram) parts.push(enneagram);
  return parts.join(' · ');
}

/** Build a compact MBTI summary string: "MBTI: INTJ (NT — Nhà chiến lược)". */
export function buildMbtiSummary(type: string): string {
  const TEMP: Record<string, string> = {
    NT: 'Nhà chiến lược', NF: 'Người lý tưởng',
    SJ: 'Người gìn giữ', SP: 'Người ứng biến',
  };
  const t = type.toUpperCase();
  const temp = t[1] === 'N' ? (t[2] === 'T' ? 'NT' : 'NF') : (t[3] === 'J' ? 'SJ' : 'SP');
  return `MBTI: ${t} (${temp} — ${TEMP[temp] ?? ''})`;
}

/** Build a compact Big Five summary string from 0-100 scores. */
export function buildBigFiveSummary(scores: {
  openness: number; conscientiousness: number; extraversion: number;
  agreeableness: number; neuroticism: number;
}): string {
  const label = (n: number) => n >= 70 ? 'cao' : n <= 30 ? 'thấp' : 'tb';
  return (
    `Big Five: Cởi mở ${scores.openness}(${label(scores.openness)})` +
    ` · Tận tâm ${scores.conscientiousness}(${label(scores.conscientiousness)})` +
    ` · Hướng ngoại ${scores.extraversion}(${label(scores.extraversion)})` +
    ` · Dễ chịu ${scores.agreeableness}(${label(scores.agreeableness)})` +
    ` · Nhạy cảm ${scores.neuroticism}(${label(scores.neuroticism)})`
  );
}

/**
 * Xem Tướng completion flag. The vision tool (/xem-tuong) computes a one-off
 * AI reading and doesn't persist a result like the test-based lenses do, so we
 * record a tiny "đã soi" marker here to drive the Hành trình progress star.
 */
const VISION_DONE_KEY = PREFIX + 'vision-done';

/** Mark Xem Tướng as completed. Silently no-ops if localStorage is unavailable. */
export function markVisionDone(): void {
  try { store()?.setItem(VISION_DONE_KEY, '1'); } catch { /* best-effort */ }
}

/** Whether the user has completed a Xem Tướng reading. */
export function hasVisionDone(): boolean {
  try { return store()?.getItem(VISION_DONE_KEY) === '1'; } catch { return false; }
}

const DISC_LABEL: Record<string, string> = {
  dominance: 'D', influence: 'i', steadiness: 'S', compliance: 'C',
};

/** Build a compact DISC summary string from primary+secondary style keys. */
export function buildDiscSummary(primary: string, secondary: string): string {
  return `DISC: phong cách ${DISC_LABEL[primary] ?? primary}/${DISC_LABEL[secondary] ?? secondary}`;
}

/** Build a compact Enneagram summary string: "Enneagram: 8w9 — Người Thủ Lĩnh". */
export function buildEnneagramSummary(label: string, name: string): string {
  return `Enneagram: ${label} — ${name}`;
}

/**
 * Extract the raw MBTI type (e.g. "INTJ") from the stored MBTI summary string,
 * or null if no MBTI result is stored. Parses the summary written by
 * `buildMbtiSummary` ("MBTI: INTJ (…)"). Used to forward the self-identified
 * MBTI type to the personality-scores backend (`/survey/personality/submit`).
 */
export function getMbtiType(): string | null {
  const raw = getPersonalityResult('mbti');
  if (!raw) return null;
  const m = raw.match(/MBTI:\s*([EI][NS][TF][JP])/i);
  return m?.[1] ? m[1].toUpperCase() : null;
}

/**
 * Extract the raw Enneagram type + optional wing from the stored Enneagram
 * summary string, or null if none is stored. Parses the summary written by
 * `buildEnneagramSummary` ("Enneagram: 8w9 — …" or "Enneagram: 8 — …").
 * Used to forward the self-identified Enneagram result to the backend.
 */
export function getEnneagramTypeWing(): { type: number; wing?: number } | null {
  const raw = getPersonalityResult('enneagram');
  if (!raw) return null;
  const m = raw.match(/Enneagram:\s*([1-9])(?:w([1-9]))?/);
  if (!m) return null;
  const type = Number(m[1]);
  const wing = m[2] ? Number(m[2]) : undefined;
  return wing !== undefined ? { type, wing } : { type };
}

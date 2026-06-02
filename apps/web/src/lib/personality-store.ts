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

export type PersonalityKey = 'mbti' | 'big-five' | 'disc';

function store(): Storage | null {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; } catch { return null; }
}

/** Persist a personality result. Silently no-ops if localStorage is unavailable. */
export function savePersonalityResult(key: PersonalityKey, value: string): void {
  try { store()?.setItem(PREFIX + key, value.slice(0, 400)); } catch { /* best-effort */ }
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

const DISC_LABEL: Record<string, string> = {
  dominance: 'D', influence: 'i', steadiness: 'S', compliance: 'C',
};

/** Build a compact DISC summary string from primary+secondary style keys. */
export function buildDiscSummary(primary: string, secondary: string): string {
  return `DISC: phong cách ${DISC_LABEL[primary] ?? primary}/${DISC_LABEL[secondary] ?? secondary}`;
}

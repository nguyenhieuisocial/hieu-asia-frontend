/**
 * Hành trình 5 lăng kính — completion state for the flagship lens journey.
 *
 * The /account/journey progress star lights one point per completed lens. This
 * module derives that completion from REAL client-side signals — never a
 * hardcoded N/5:
 *
 *   - Tử Vi & Bát Tự → a saved birth chart. Both are computed from the same
 *     birth data (Tử Vi cung mệnh + Bát Tự Tứ Trụ), so a saved chart counts as
 *     having soi'd both lenses. Probe is the same one FeedHero uses
 *     (`hieu:chart:profile:v1` or the onboarding draft `hieu:onboarding:v2`).
 *   - MBTI & Big Five → a stored personality-store result (the test was taken).
 *   - Xem Tướng → the vision-done marker set on a successful /xem-tuong reading.
 *
 * Each entry pairs the catalog Lens (single source of truth for name/eyebrow)
 * with an action route ("Soi ngay") and a review route ("Xem lại") plus an
 * optional short note for completed lenses.
 */

import { LENSES, type Lens } from '@/lib/catalog/lenses';
import { getPersonalityResult, hasVisionDone } from '@/lib/personality-store';

const CHART_KEY = 'hieu:chart:profile:v1';
const ONBOARDING_KEY = 'hieu:onboarding:v2';

/** Where "Soi ngay" sends the user for each lens (the action, not the learn page). */
const ACTION_HREF: Record<string, string> = {
  'tu-vi': '/onboarding/topic',
  'bat-tu': '/onboarding/topic',
  mbti: '/mbti',
  'big-five': '/big-five',
  'xem-tuong': '/xem-tuong',
};

export interface JourneyLens {
  lens: Lens;
  done: boolean;
  /** short "đã soi · …" note for the card, when we have one. */
  note?: string;
  /** destination for the "Soi ngay" CTA (todo). */
  actionHref: string;
  /** destination for the "Xem lại" CTA (done) — the catalog learn page. */
  reviewHref: string;
}

/** True if a birth chart is saved locally (direct profile or onboarding draft). */
function hasSavedChart(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    for (const key of [CHART_KEY, ONBOARDING_KEY]) {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const p = JSON.parse(raw) as { birth_date?: string };
      if (p?.birth_date) return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

/**
 * Resolve the journey state for all 5 flagship lenses from real client-side
 * signals. Safe to call during render; returns all-todo before hydration
 * (window absent), then the page recomputes on mount.
 */
export function getJourneyState(): JourneyLens[] {
  const chart = hasSavedChart();
  const mbti = getPersonalityResult('mbti');
  const bigFive = getPersonalityResult('big-five');
  const vision = hasVisionDone();

  return LENSES.map((lens): JourneyLens => {
    let done = false;
    let note: string | undefined;
    switch (lens.slug) {
      case 'tu-vi':
      case 'bat-tu':
        done = chart;
        break;
      case 'mbti':
        done = Boolean(mbti);
        note = mbti ?? undefined;
        break;
      case 'big-five':
        done = Boolean(bigFive);
        note = bigFive ?? undefined;
        break;
      case 'xem-tuong':
        done = vision;
        break;
    }
    return {
      lens,
      done,
      note,
      actionHref: ACTION_HREF[lens.slug] ?? lens.href,
      reviewHref: lens.href,
    };
  });
}

/** Count of completed lenses out of LENSES.length. */
export function countDone(state: JourneyLens[]): number {
  return state.reduce((n, s) => n + (s.done ? 1 : 0), 0);
}

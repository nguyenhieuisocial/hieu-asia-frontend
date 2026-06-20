// Single source of truth for the "Bằng Chứng" share-card aggregate numbers.
//
// Used by BOTH the OG image route (`app/bang-chung/og/route.tsx`) and the page
// `generateMetadata` (`app/bang-chung/page.tsx`) so the unfurled image and the
// title/description can NEVER disagree — and so a manipulated/hand-edited share
// URL can never produce an over-claiming card. This is the anti-overclaim guard
// for the most public surface of the product (the viral share card), so the
// rules below are vetted and locked by share-card.test.ts.
//
// Privacy: the only inputs are aggregate counts (hit/total/strong) — never an
// event, a birth date, or any personal data.

export const MAX_EVENTS = 7;

export type ProofCard =
  | { valid: false }
  | { valid: true; hit: number; total: number; strong: number };

function clampInt(v: string | null | undefined, min: number, max: number): number | null {
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

/**
 * Derive the share-card numbers from raw query params.
 *
 * Returns `{ valid: false }` (→ render the branded default card, no numbers)
 * unless the numbers are internally consistent:
 *   - total ∈ [1, MAX_EVENTS]
 *   - hit   ∈ [0, total]            (can't match more milestones than exist)
 *   - strong is clamped to [0, hit] (can't claim more "right-domain" hits than
 *     total hits) — silently dropped to 0 if inflated, NEVER inflated.
 */
export function deriveProofCard(params: {
  total: string | null | undefined;
  hit: string | null | undefined;
  strong: string | null | undefined;
}): ProofCard {
  const total = clampInt(params.total, 1, MAX_EVENTS);
  const hit = clampInt(params.hit, 0, MAX_EVENTS);
  if (total == null || hit == null || hit > total) return { valid: false };
  const strongRaw = clampInt(params.strong, 0, MAX_EVENTS);
  const strong = strongRaw != null && strongRaw <= hit ? strongRaw : 0;
  return { valid: true, hit, total, strong };
}

/** Normalize a Next.js searchParams value (string | string[] | undefined) to a
 *  single string for `deriveProofCard`. */
export function firstParam(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

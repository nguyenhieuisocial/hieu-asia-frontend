/**
 * Wave 56 Phase 2.6 — Tier pricing single source of truth.
 *
 * Before this file, `TIER_COST_PER_M_TOKENS` was duplicated in 3 places:
 * tu-vi-graph.ts, bat-tu-graph.ts, palm-graph.ts. /ultrareview Phase 2.4+2.5
 * flagged the drift risk (P2) — bumping pricing in one file silently leaves
 * the others wrong, and cost dashboards mis-report by graph.
 *
 * Pricing is canonical here; the `llm.ts` JSDoc points back to this file.
 * Edge Config (Phase 2.6.D) does NOT override these — pricing is a billing
 * fact, not a runtime knob. Runtime knobs (tier overrides, kill switch,
 * daily cap) live in `runtime-config.ts`.
 *
 * Pricing reviewed 2026-05-23 against AI Gateway public pages. Bump:
 *   1. Update PER_M_TOKENS_USD below
 *   2. Update JSDoc in llm.ts (it cross-references this map by tier)
 *   3. Update vault 94 "model card" section
 *   4. Spot-check Langfuse dashboard the next day for cost-delta sanity
 */

import type { Tier } from './llm';

/** Per-tier $/M-tokens for input + output. Tied to MODELS map in llm.ts. */
export const PER_M_TOKENS_USD = {
  cheap: { input: 0.075, output: 0.3 },  // Gemini 3.5 Flash
  mid: { input: 3, output: 15 },          // Claude Sonnet 4
  top: { input: 15, output: 75 },         // Claude Opus 4.7
  judge: { input: 1.25, output: 10 },     // GPT-5.5 (eval only, not generation)
} as const satisfies Record<Tier, { input: number; output: number }>;

/**
 * Convert input/output token counts to $USD spent.
 *
 * Returns 0 when both counts are 0 (avoids polluting the ledger with empty
 * rows when a model errors before producing usage stats).
 */
export function computeCostUsd(
  tier: Tier,
  usage: { inputTokens?: number; outputTokens?: number } | undefined,
): number {
  const tIn = usage?.inputTokens ?? 0;
  const tOut = usage?.outputTokens ?? 0;
  if (tIn === 0 && tOut === 0) return 0;
  const rate = PER_M_TOKENS_USD[tier];
  return (tIn / 1_000_000) * rate.input + (tOut / 1_000_000) * rate.output;
}

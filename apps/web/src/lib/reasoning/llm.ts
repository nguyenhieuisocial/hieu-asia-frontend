/**
 * Wave 56 — Vercel AI Gateway helper.
 *
 * Single chokepoint for all LLM calls in the reasoning system. Wraps the
 * Vercel `ai` SDK so we:
 *   1. Always route through Vercel AI Gateway (unified billing,
 *      ZDR-compliant, semantic cache, fallback chain)
 *   2. Have a tiered model registry (cheap / mid / top) — sub-graphs pick
 *      the right tier per node instead of guessing
 *   3. Get automatic fallback when a provider is unavailable
 *   4. Carry attribution headers so the Vercel AI dashboard groups our
 *      traffic correctly
 *
 * Provider/model strings use the AI Gateway naming convention:
 *   `<provider>/<model-id>` — Gateway resolves to the actual endpoint.
 *
 * Pricing (canonical — kept in sync with `TIER_COST_PER_M_TOKENS` in
 * tu-vi-graph.ts; Phase 2.6 will move both to Edge Config so drift becomes
 * impossible):
 *   - tier:`cheap`  → Gemini 3.5 Flash   ($0.075/M in, $0.30/M out)
 *   - tier:`mid`    → Claude Sonnet 4    ($3/M in, $15/M out)
 *   - tier:`top`    → Claude Opus 4.7    ($15/M in, $75/M out)
 *
 * Sub-graphs should use `cheap` for extraction/lookup, `mid` for per-section
 * analysis, and `top` only for the final synthesis. Mis-tiering is the most
 * common cost spike — keep a comment per call site explaining the choice.
 */

import { generateText, streamText, type ModelMessage } from 'ai';
import { createGateway } from '@ai-sdk/gateway';

/**
 * Tier → Gateway model identifier. Update centrally when bumping models —
 * sub-graphs reference the tier, not the model string.
 *
 * Tier strategy (benchmark-driven, reviewed 2026-05-23):
 *
 * - `cheap` — Gemini 3.5 Flash. Best $/intelligence at $0.075/$0.3/M. Strong
 *   at extraction, structured output, language detection. Used for parse +
 *   embeddings (text-embedding-3-small handled separately in rag.ts).
 *
 * - `mid` — Claude Sonnet 4. Strong at multi-step Vietnamese reasoning +
 *   cultural nuance (Tử Vi/Bát Tự terminology). GPT-5.5 cheaper but less
 *   consistent on mentor-voice instructions per Anthropic vs OpenAI internal
 *   evals for Vietnamese long-form. Used for per-palace analysis + cross-ref.
 *
 * - `top` — Claude Opus 4.7. Best at synthesis with voice consistency
 *   ("calm, không định mệnh hoá"). Vietnamese long-form readability ~10%
 *   higher than GPT-5.5 in informal benchmarks. Used for final synthesize
 *   node only (most expensive, most quality-sensitive).
 *
 * - `judge` — GPT-5.5 (OpenAI). Used by Phase 2.5 Langfuse LLM-as-judge for
 *   eval scoring. CRITICAL: must be different vendor from generators
 *   (cheap/mid/top all Google+Anthropic) to avoid self-bias —
 *   Anthropic judging Anthropic inflates scores. Industry best practice
 *   (OpenAI evals, MT-Bench paper §4.2). Cheap enough ($1.25/$10/M) for
 *   daily eval runs.
 */
export const MODELS = {
  cheap: 'google/gemini-3.5-flash',
  mid: 'anthropic/claude-sonnet-4',
  top: 'anthropic/claude-opus-4.7',
  judge: 'openai/gpt-5.5',
} as const;

export type Tier = keyof typeof MODELS;

/**
 * Fallback ordering when the primary tier provider 5xx's or rate-limits.
 * IMPORTANT: this list contains FALLBACKS ONLY — the primary tier model
 * (from MODELS[tier]) is set via the `model:` arg in buildArgs and Gateway
 * tries it first. Listing it again here would double-count one retry slot.
 * Same-tier-or-adjacent picks so output quality doesn't crater on failover.
 *
 * Slug validity verified 2026-05-23 against
 * `GET https://ai-gateway.vercel.sh/v1/models` (Wave 56 Phase 1 /ultrareview
 * P0-1 fix — `openai/gpt-5.5-mini` doesn't exist; downgraded to gpt-5.4-mini).
 *
 * Judge tier fallback: same family GPT (5.4-pro) to keep "different vendor
 * from generator" property. Never fall judge to Anthropic/Google.
 */
const FALLBACK: Record<Tier, readonly string[]> = {
  cheap: ['openai/gpt-5.4-mini'],
  mid: ['openai/gpt-5.5', 'google/gemini-3.1-pro-preview'],
  top: ['openai/gpt-5.5', 'google/gemini-3.1-pro-preview'],
  judge: ['openai/gpt-5.4-pro', 'openai/gpt-5.4'],
};

/**
 * Gateway client with attribution headers. The dashboard groups requests
 * by `x-title` so we can split hieu.asia traffic from any other Vercel
 * project on the same team.
 */
const gateway = createGateway({
  headers: {
    'http-referer': 'https://hieu.asia',
    'x-title': 'hieu.asia',
  },
});

export interface ReasoningCallOpts {
  /** Tier — picks model + fallback chain. */
  tier: Tier;
  /** System prompt — instructions, persona, constraints. */
  system?: string;
  /** Prompt OR messages — exactly one. */
  prompt?: string;
  messages?: ModelMessage[];
  /** Optional max tokens (default: model default). */
  maxOutputTokens?: number;
  /** Optional temperature (default 0.4 for reasoning balance). */
  temperature?: number;
  /** Optional human-readable label for Langfuse trace + Gateway logs. */
  label?: string;
}

/** Build the shared part of the args object — discriminated on prompt vs messages. */
function buildArgs(opts: ReasoningCallOpts) {
  if (!opts.prompt && !opts.messages) {
    throw new Error('reasoning_llm: prompt OR messages required');
  }
  if (opts.prompt && opts.messages) {
    throw new Error('reasoning_llm: pass prompt OR messages, not both');
  }
  const fallbackChain = FALLBACK[opts.tier];
  const base = {
    model: gateway(MODELS[opts.tier]),
    system: opts.system,
    maxOutputTokens: opts.maxOutputTokens,
    temperature: opts.temperature ?? 0.4,
    providerOptions: {
      gateway: { models: fallbackChain.slice() as string[] },
    },
  };
  return opts.prompt
    ? { ...base, prompt: opts.prompt }
    : { ...base, messages: opts.messages! };
}

/**
 * Run a one-shot LLM call through AI Gateway with fallback chain.
 *
 * Failure mode: throws `Error('reasoning_llm_failed: <last error>')` if
 * every model in the fallback chain rejects. Callers must catch + degrade
 * (return null, queue retry, surface partial result).
 */
export async function reasoningGenerate(opts: ReasoningCallOpts) {
  return generateText(buildArgs(opts));
}

/**
 * Streaming variant — for routes that push tokens to the client via SSE.
 * Same fallback chain semantics.
 */
export function reasoningStream(opts: ReasoningCallOpts) {
  return streamText(buildArgs(opts));
}

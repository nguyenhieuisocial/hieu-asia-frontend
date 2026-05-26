/**
 * Wave 56 — Langfuse trace client for the reasoning system.
 *
 * Why Langfuse (vs PostHog LLM / Sentry):
 *   - Native multi-step trace model: parent run → child spans (nodes →
 *     tool calls → LLM gen). PostHog flattens; Sentry only handles errors.
 *   - Prompt management + eval framework built in (Phase 5 of vault doc
 *     `_review/WAVE-56-reasoning-architecture.md`).
 *   - Self-host or cloud — keys live in Vercel env (LANGFUSE_PUBLIC_KEY +
 *     LANGFUSE_SECRET_KEY + LANGFUSE_HOST, already set on the worker).
 *
 * Graceful no-op: if env vars missing (e.g. local dev without secrets,
 * preview deploys), every helper returns a stub. Reasoning still runs;
 * only observability is dropped. Never throws.
 */

import { Langfuse } from 'langfuse';

let _client: Langfuse | null = null;
let _attempted = false;

function getClient(): Langfuse | null {
  if (_attempted) return _client;
  _attempted = true;
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  if (!publicKey || !secretKey) {
    // Silent no-op when keys are missing. Don't spam console in prod.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[reasoning/observability] LANGFUSE_* env missing — tracing disabled');
    }
    return null;
  }
  _client = new Langfuse({
    publicKey,
    secretKey,
    baseUrl: process.env.LANGFUSE_HOST ?? 'https://cloud.langfuse.com',
  });
  return _client;
}

export interface TraceInput {
  /** Top-level operation name, e.g. `tu-vi.palace.menh` */
  name: string;
  /** Stable session/user identifier for grouping in the dashboard. */
  userId?: string;
  sessionId?: string;
  /** Input payload (sanitised — no PII beyond what's already in events). */
  input?: unknown;
  /** Tag set for filtering — e.g. ['tu-vi', 'phase2', 'experiment:flag-on']. */
  tags?: string[];
}

/**
 * Open a trace for a reasoning run. Returns a thin wrapper exposing
 * `span()` to record sub-steps and `end()` to finalize.
 *
 * Always returns a non-null wrapper — when Langfuse is disabled, methods
 * become no-ops. Callers don't need a null-check.
 */
export function startTrace(input: TraceInput) {
  const client = getClient();
  if (!client) return makeNoOpTrace();
  try {
    const trace = client.trace({
      name: input.name,
      userId: input.userId,
      sessionId: input.sessionId,
      input: input.input,
      tags: input.tags,
    });
    return {
      span(name: string, payload?: unknown) {
        try {
          const s = trace.span({ name, input: payload });
          return {
            end(output?: unknown) {
              try {
                s.end({ output });
              } catch {
                /* drop trace errors silently */
              }
            },
          };
        } catch {
          return { end() {} };
        }
      },
      end(output?: unknown) {
        try {
          trace.update({ output });
        } catch {
          /* drop trace errors silently */
        }
      },
      /** Flush — call at end of Vercel Function (waitUntil-friendly). */
      async flush() {
        try {
          await client.flushAsync();
        } catch {
          /* drop trace errors silently */
        }
      },
    };
  } catch {
    return makeNoOpTrace();
  }
}

function makeNoOpTrace() {
  return {
    span() {
      return { end() {} };
    },
    end() {},
    async flush() {},
  };
}

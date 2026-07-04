/**
 * Persist personality results to the server (hieu_asia.personality_scores) so
 * the premium "Cẩm Nang Cuộc Đời" report (master-orchestrate Edge Function) can
 * read the user's Big Five / DiSC / MBTI / Enneagram.
 *
 * Why this shape:
 * - Scoring is CLIENT-side: the /big-five and /disc lens pages score answers via
 *   lib/scoring/{big-five,disc}.ts (formatForDB → exact DB columns). The reading
 *   survey (/reading/[id]/survey) is MBTI-axis free-form context, NOT Big
 *   Five/DiSC, so there is no reading-tied Big Five/DiSC to submit — the standalone
 *   lens pages are the only place these scores exist.
 * - The worker endpoint POST /survey/personality/submit HARD-REQUIRES a full
 *   Big Five + DiSC `scores` object AND `raw_answers` (see backend
 *   survey/personality-scores.ts pickPersonalityScores → 400 without both halves).
 *   A single lens page only produces ONE half, so we cache each half in
 *   localStorage and only POST once BOTH halves are available.
 * - master-orchestrate matches personality_scores by `reading_session_id = $1 OR
 *   user_id = $2`, so a row keyed purely by user_id (no reading session, which is
 *   all the standalone lens pages can offer) is still picked up by Cẩm Nang.
 *
 * Auth: the endpoint requires a verified Supabase JWT and derives user_id from
 * the token — so only signed-in users can persist. Anonymous users keep their
 * localStorage-only results (graceful degradation, no error surfaced).
 */

import { getSupabaseAuth } from '@/lib/auth-client';
import { getMbtiType, getEnneagramTypeWing } from '@/lib/personality-store';
import { formatForDB as formatBigFiveForDB, type BigFiveScoreWithMeta } from './big-five';
import { formatForDB as formatDiscForDB, type DiscScoreWithMeta } from './disc';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

const BIG_FIVE_CACHE_KEY = 'hieu:personality:v1:big-five-scores';
const DISC_CACHE_KEY = 'hieu:personality:v1:disc-scores';

/** Cached Big Five half: DB-shaped scores + raw answers, for later combination. */
interface BigFiveCache {
  scores: ReturnType<typeof formatBigFiveForDB>;
  raw_answers: Record<string, number>;
}
/** Cached DiSC half: DB-shaped scores + raw answers, for later combination. */
interface DiscCache {
  scores: ReturnType<typeof formatDiscForDB>;
  raw_answers: Record<string, number>;
}

function store(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readCache<T>(key: string): T | null {
  const s = store();
  if (!s) return null;
  try {
    const raw = s.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown): void {
  try {
    store()?.setItem(key, JSON.stringify(value));
  } catch {
    /* best-effort */
  }
}

/**
 * Record the Big Five half locally and attempt a full server submit.
 * Called from the /big-five page onComplete after scoring.
 */
export function submitBigFive(
  score: BigFiveScoreWithMeta,
  rawAnswers: Record<string, number>,
): void {
  writeCache(BIG_FIVE_CACHE_KEY, {
    scores: formatBigFiveForDB(score),
    raw_answers: rawAnswers,
  } satisfies BigFiveCache);
  void trySubmit();
}

/**
 * Record the DiSC half locally and attempt a full server submit.
 * Called from the /disc page onComplete after scoring.
 */
export function submitDisc(
  score: DiscScoreWithMeta,
  rawAnswers: Record<string, number>,
): void {
  writeCache(DISC_CACHE_KEY, {
    scores: formatDiscForDB(score),
    raw_answers: rawAnswers,
  } satisfies DiscCache);
  void trySubmit();
}

/**
 * Assemble + POST a personality-scores row for the signed-in user. Sends the
 * full Big Five + DiSC `scores` when BOTH halves are cached; ALSO sends the
 * self-identified MBTI/Enneagram (from localStorage) whenever present — so a
 * user who did only those tools still reaches Cẩm Nang (backend migration 0070
 * + worker-side merge accept a scores-absent write and merge onto one row per
 * user). Fire-and-forget: never throws, never blocks the UI, silently no-ops
 * when there is nothing to persist or the user is anonymous.
 */
async function trySubmit(): Promise<void> {
  try {
    const bigFive = readCache<BigFiveCache>(BIG_FIVE_CACHE_KEY);
    const disc = readCache<DiscCache>(DISC_CACHE_KEY);
    const mbtiType = getMbtiType();
    const enneagram = getEnneagramTypeWing();

    // Nothing to persist yet → keep localStorage results and wait. (A full
    // scores payload needs BOTH lens halves; MBTI/Enneagram can go on their own.)
    const hasScores = Boolean(bigFive && disc);
    if (!hasScores && !mbtiType && !enneagram) return;

    // Auth: endpoint verifies a Supabase JWT and sets user_id from it. Anonymous
    // users simply keep their localStorage results (no error surfaced).
    const sb = getSupabaseAuth();
    if (!sb) return;
    const { data } = await sb.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    const body: Record<string, unknown> = { variant: 'extended' };
    // Big Five + DiSC only when BOTH halves exist (endpoint needs a COMPLETE set;
    // a partial write would 400). Omitting them entirely is fine (0070) and the
    // worker merge preserves any previously-submitted scores.
    if (bigFive && disc) {
      body.scores = { ...bigFive.scores, ...disc.scores };
      body.raw_answers = { ...bigFive.raw_answers, ...disc.raw_answers };
    }
    // Optional self-identified frameworks — the endpoint ignores invalid values
    // rather than rejecting, but only send when present to keep the body minimal.
    if (mbtiType) body.mbti_type = mbtiType;
    if (enneagram) {
      body.enneagram_type = enneagram.type;
      if (enneagram.wing !== undefined) body.enneagram_wing = enneagram.wing;
    }

    await fetch(`${API_BASE}/survey/personality/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* best-effort — never break the lens result flow on a persistence failure */
  }
}

/**
 * Fire a personality submit after the user records a self-identified framework
 * (MBTI type or Enneagram type/wing) so it reaches the server even if they never
 * do the /big-five + /disc quizzes. Called from MbtiTool / EnneagramTool after
 * savePersonalityResult. Fire-and-forget (no-ops when anonymous / nothing new).
 */
export function submitSelfIdentifiedPersonality(): void {
  void trySubmit();
}

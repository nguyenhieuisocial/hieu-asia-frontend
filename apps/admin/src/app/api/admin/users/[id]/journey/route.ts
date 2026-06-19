/**
 * GET /api/admin/users/:id/journey
 *
 * Powers the "Nguồn & hành trình" panel on the session-detail page: for ONE
 * user (distinct_id — authed user_id, or `anon-<session_id>` for anon), reads
 * their first/last-touch attribution + recent event timeline straight from
 * PostHog via the server-only HogQL client, so the founder needn't open
 * PostHog.
 *
 * Soft envelope — ALWAYS HTTP 200 on success. When PostHog is unconfigured
 * (no personal API key) or the user has no data, returns ok:true with
 * source:null / events:[] so the panel degrades to a healthy-empty state
 * rather than surfacing an error. Auth failures pass through the
 * requireAdminSession envelope (401 / 403) unchanged.
 *
 * The `:id` segment carries the user's distinct_id (named `id` to match the
 * sibling /api/admin/users/[id] route — Next.js forbids differing slug names
 * at the same dynamic path level).
 */
import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';
import {
  fetchUserAttribution,
  fetchUserJourney,
  isPostHogServerConfigured,
} from '@/lib/posthog-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;

  const { id } = await ctx.params;
  const userId = (id ?? '').trim();

  if (!userId) {
    return NextResponse.json({
      ok: true,
      configured: isPostHogServerConfigured(),
      source: null,
      events: [],
    });
  }

  const [source, events] = await Promise.all([
    fetchUserAttribution(userId),
    fetchUserJourney(userId),
  ]);

  return NextResponse.json({
    ok: true,
    configured: isPostHogServerConfigured(),
    source: source ?? null,
    events: events ?? [],
  });
}

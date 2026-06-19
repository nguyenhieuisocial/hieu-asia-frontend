/**
 * GET /api/admin/posthog/recordings/:id/snapshots
 *
 * Best-effort assembled rrweb events for ONE recording, for in-admin playback.
 * Server-only PostHog client; key never leaks; admin-gated. PostHog's snapshot
 * API is undocumented/unstable, so this returns ok:false (HTTP 200) with a soft
 * message when a recording can't be assembled — the player degrades gracefully.
 */
import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';
import { fetchRecordingSnapshots } from '@/lib/posthog-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;

  const { id } = await ctx.params;
  const result = await fetchRecordingSnapshots((id ?? '').trim());
  // Always 200 — failure is a soft "can't replay this one" state, not an error.
  return NextResponse.json(result);
}

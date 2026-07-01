/**
 * POST /api/admin/regen-sitemap — owner-gated "Cập Nhật" (refresh) trigger for
 * the admin site-structure / architecture maps.
 *
 * Deploy-hook mechanism:
 *   The map data (`src/lib/site-structure.ts`) is a build-time snapshot produced
 *   by `apps/admin/scripts/extract-site-structure.mjs` and regenerated on every
 *   Vercel deploy (the extract step is prepended to the admin `buildCommand` in
 *   `apps/admin/vercel.json`). To refresh the snapshot on demand we don't
 *   re-run extraction here — we ask Vercel to redeploy, which re-runs the build
 *   (and therefore the extraction) against the current source tree.
 *
 *   We do this by POSTing to a Vercel *Deploy Hook* — a per-project secret URL
 *   that triggers a new deployment when hit. The URL is a bearer secret, so it
 *   is read from `process.env.VERCEL_ADMIN_DEPLOY_HOOK` (server-only) and is
 *   NEVER echoed back to the client.
 *
 *   SETUP: create a Deploy Hook in the admin Vercel project
 *   (Settings → Git → Deploy Hooks) and set its URL as the
 *   `VERCEL_ADMIN_DEPLOY_HOOK` environment variable on the admin Vercel project.
 *   Without it this route returns HTTP 501 (not configured) instead of throwing.
 */
import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;

  const hookUrl = process.env.VERCEL_ADMIN_DEPLOY_HOOK;
  if (!hookUrl) {
    return NextResponse.json(
      { ok: false, error: 'DEPLOY_HOOK_NOT_CONFIGURED' },
      { status: 501 },
    );
  }

  try {
    const r = await fetch(hookUrl, {
      method: 'POST',
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    });
    if (!r.ok) {
      return NextResponse.json(
        { ok: false, error: 'DEPLOY_TRIGGER_FAILED' },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'DEPLOY_TRIGGER_FAILED' },
      { status: 502 },
    );
  }
}

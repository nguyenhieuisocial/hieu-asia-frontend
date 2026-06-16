/**
 * Server-side PDF export: POST /api/reading/[id]/export-pdf
 *
 * Thin proxy to the worker's Cloudflare Browser Rendering path. The worker renders
 * the report (or the `?doc=master` 150-500 page compendium) with FULL chromium,
 * stores the PDF in R2, and returns a signed URL. We fetch that URL server-side
 * and stream it back as an attachment — same-origin, forced filename, no CORS.
 *
 * This replaced the Vercel @sparticuz/chromium render, which hard-capped large
 * docs at ~28 pages and embedded no fonts. The master is pre-rendered the moment
 * its content is assembled (by the master-orchestrate Edge Function), so the
 * download is an instant cache hit; the single report renders on first download
 * (~13s) then caches. Either way the URL is re-signed per request (no expiry).
 *
 * Gate errors (401/402/403/404) are propagated from the worker so the FE can
 * message them correctly.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Cache hit (master, pre-rendered) is near-instant; a cold single-report render
// on Cloudflare is ~13s. 60s is ample and covers the 9MB R2 stream.
export const maxDuration = 60;

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });
  }

  const authz = req.headers.get('authorization');
  if (!authz) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const isMaster = req.nextUrl.searchParams.get('doc') === 'master';
  const docQS = isMaster ? '?doc=master' : '';

  try {
    // 1. Worker renders via Cloudflare Browser Rendering → R2 and returns a fresh
    //    signed URL (it enforces auth + ownership + is_paid).
    const wr = await fetch(
      `${HIEU_API_URL}/reading/${encodeURIComponent(id)}/export-pdf${docQS}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: authz },
        cache: 'no-store',
      },
    );
    const wb = (await wr.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
    if (!wr.ok || !wb.url) {
      // Propagate the gate/error status so the FE shows the right message.
      return NextResponse.json(
        { ok: false, error: wb.error ?? 'render_failed' },
        { status: wr.status >= 400 ? wr.status : 502 },
      );
    }

    // 2. Redirect to the signed R2 URL — the browser fetches the PDF directly
    //    from the worker (the cross-origin GET is CORS-allowed), so the 9MB master
    //    isn't streamed twice through this serverless function. The caller's
    //    fetch() follows the redirect transparently; it still gets the blob and
    //    names the file client-side. The signed URL is short-lived (1h).
    return NextResponse.redirect(wb.url, 302);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'pdf_proxy_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}

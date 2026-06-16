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

    // 2. Stream the R2 object back as an attachment. (A 302 redirect to the signed
    //    URL was tried but FAILS: the caller's fetch() can't follow a cross-origin
    //    redirect when the original request carries an Authorization header — CORS
    //    blocks the redirected request. So we proxy the bytes server-side.)
    const pdfRes = await fetch(wb.url, { cache: 'no-store' });
    if (!pdfRes.ok) {
      return NextResponse.json({ ok: false, error: 'pdf_fetch_failed' }, { status: 502 });
    }
    const pdf = await pdfRes.arrayBuffer();
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': `attachment; filename="${isMaster ? 'Cam-Nang-Cuoc-Doi-Tong-Hop' : 'Cam-Nang-Cuoc-Doi'}.pdf"`,
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'pdf_proxy_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}

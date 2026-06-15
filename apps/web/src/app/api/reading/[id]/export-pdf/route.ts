/**
 * Server-side PDF export: POST /api/reading/[id]/export-pdf
 *
 * Why server-side (not the browser "Save as PDF" print path): the browser print
 * dialog injects its own header/footer (URL, date, page title), defaults
 * "Background graphics" OFF (drops our cream/gold styling), and applies the
 * user's own margins — so the saved file looks broken. Rendering here with
 * headless Chromium gives a DETERMINISTIC A4 PDF: backgrounds on, no injected
 * headers, fixed margins from the template's @page CSS. One click → a file.
 *
 * Flow:
 *   1. Forward the caller's Supabase JWT to the worker's `?format=html` endpoint,
 *      which enforces auth + ownership + is_paid and returns the print-ready HTML.
 *   2. Render that HTML → PDF with puppeteer-core + @sparticuz/chromium.
 *   3. Stream the PDF back as an attachment.
 *
 * Gate errors (401/402/403/404) are propagated from the worker as JSON so the FE
 * can show the right message.
 */

import { NextResponse, type NextRequest } from 'next/server';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Cold start (chromium pack download + spin-up ~5-8s) + render (~3-6s). 30s ample.
export const maxDuration = 30;

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

// chromium-min downloads the full browser pack (binary + shared libs incl
// libnss3) at runtime — avoids the Vercel file-tracing gap that left the
// bundled @sparticuz/chromium libs missing ("libnss3.so cannot open"). Pin the
// pack to the chromium-min version (131.0.1). Overridable via env so the pack
// can later be self-hosted on R2 instead of the GitHub release.
const CHROMIUM_PACK_URL =
  process.env.CHROMIUM_PACK_URL ??
  'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar';

async function launchBrowser() {
  // Vercel (Linux serverless): download + use the @sparticuz chromium pack.
  if (process.env.VERCEL) {
    const execPath = await chromium.executablePath(CHROMIUM_PACK_URL);
    try {
      return await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: execPath,
        headless: true,
      });
    } catch (e) {
      // Surface diagnostics in the error so we can see WHY chromium can't load
      // its shared libraries (libnss3) on Vercel — path vs missing-lib.
      let tmp = 'n/a';
      try {
        const fs = await import('node:fs');
        tmp = fs.readdirSync('/tmp').filter((f) => /chrom|nss|lib|al2|swift/i.test(f)).slice(0, 40).join(',');
      } catch { /* ignore */ }
      throw new Error(
        `${(e as Error).message} || execPath=${execPath} || LD_LIBRARY_PATH=${process.env.LD_LIBRARY_PATH ?? '(unset)'} || /tmp=[${tmp}]`,
      );
    }
  }
  // Local dev: use an installed Chrome via puppeteer-core's channel resolver.
  return puppeteer.launch({ channel: 'chrome', headless: true });
}

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

  // 1. Fetch the print-ready HTML from the worker (it enforces the auth gate).
  let html: string;
  try {
    const res = await fetch(
      `${HIEU_API_URL}/reading/${encodeURIComponent(id)}/export-pdf?format=html`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: authz },
        cache: 'no-store',
      },
    );
    if (!res.ok) {
      // Propagate gate errors (401/402/403/404) verbatim so the FE messages them.
      const text = await res.text();
      return new NextResponse(text, {
        status: res.status,
        headers: {
          'content-type':
            res.headers.get('content-type') ?? 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        },
      });
    }
    html = await res.text();
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'upstream_fetch_failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  // The client auto-print script is only for the browser-print path — strip it
  // so it can't interfere with headless rendering.
  html = html.replace(/<script>[\s\S]*?window\.print[\s\S]*?<\/script>/g, '');

  // 2. Render to a deterministic A4 PDF (backgrounds on, no browser headers).
  let browser: Awaited<ReturnType<typeof launchBrowser>> | null = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    // networkidle0 waits for the Be Vietnam Pro web font to load before printing.
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 25_000 });
    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true, // honour the template's @page (A4 + @page :first margin:0 cover)
      displayHeaderFooter: false,
      margin: { top: '20mm', right: '20mm', bottom: '22mm', left: '20mm' },
    });
    await browser.close();
    browser = null;

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="cam-nang-cuoc-doi.pdf"',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    if (browser) {
      try {
        await browser.close();
      } catch {
        /* ignore */
      }
    }
    return NextResponse.json(
      {
        ok: false,
        error: 'pdf_render_failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

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
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync,
} from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';
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

// @sparticuz/chromium-min unpacks chromium + the swiftshader graphics libs to
// /tmp, but NOT the al2023 system libraries (libnss3.so etc.) — those ship in the
// pack's al2023.tar.br and are meant to be an AWS Lambda LAYER, which Vercel does
// not provide. Diagnostic confirmed /tmp has chromium + swiftshader .so but no
// libnss3, and /tmp/lib doesn't exist. So extract the al2023 libs from the
// already-downloaded pack ourselves (once) into /tmp/al-libs and point
// LD_LIBRARY_PATH there.
let libsReady = false;
function ensureChromiumLibs(): string {
  const LIB_DIR = '/tmp/al-libs';
  if (libsReady) return LIB_DIR;
  // @sparticuz extracts the downloaded pack into /tmp/chromium-pack (dir of *.br).
  let brPath = ['/tmp/chromium-pack/al2023.tar.br', '/tmp/al2023.tar.br'].find((p) => existsSync(p)) ?? '';
  if (!brPath && existsSync('/tmp/chromium-pack') && statSync('/tmp/chromium-pack').isDirectory()) {
    const f = readdirSync('/tmp/chromium-pack').find((n) => /al2023.*\.br$/.test(n));
    if (f) brPath = `/tmp/chromium-pack/${f}`;
  }
  if (!brPath) return LIB_DIR; // not found — the launch catch surfaces a diagnostic
  const tar = brotliDecompressSync(readFileSync(brPath));
  mkdirSync(LIB_DIR, { recursive: true });
  // Minimal POSIX tar reader: 512-byte header + padded data; regular files only.
  let off = 0;
  while (off + 512 <= tar.length) {
    const name = tar.toString('utf8', off, off + 100).replace(/\0.*$/, '');
    if (!name) break; // zero block → end of archive
    const size = parseInt(tar.toString('utf8', off + 124, off + 136).replace(/\0.*$/, '').trim(), 8) || 0;
    const typeflag = tar[off + 156];
    off += 512;
    if ((typeflag === 0x30 /* '0' */ || typeflag === 0) && size > 0) {
      const base = name.split('/').pop() ?? name;
      if (base.includes('.so')) writeFileSync(`${LIB_DIR}/${base}`, tar.subarray(off, off + size));
    }
    off += Math.ceil(size / 512) * 512;
  }
  libsReady = true;
  return LIB_DIR;
}

async function launchBrowser() {
  // Vercel (Linux serverless): download the pack, extract the missing system
  // libs, point the linker at them, then launch.
  if (process.env.VERCEL) {
    const execPath = await chromium.executablePath(CHROMIUM_PACK_URL); // downloads pack → /tmp
    const libDir = ensureChromiumLibs();
    process.env.LD_LIBRARY_PATH = [libDir, '/tmp', process.env.LD_LIBRARY_PATH]
      .filter(Boolean)
      .join(':');
    try {
      return await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: execPath,
        headless: true,
      });
    } catch (e) {
      const ls = (d: string) => {
        try { return readdirSync(d).filter((f) => /nss|\.so|al/i.test(f)).slice(0, 40).join(','); }
        catch (err) { return `ERR:${(err as Error).message}`; }
      };
      throw new Error(
        `${(e as Error).message} || libDir=${libDir}=[${ls(libDir)}] || /tmp/chromium-pack=[${ls('/tmp/chromium-pack')}]`,
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

  // `?doc=master` → render the 200-500p master compendium, else the single report.
  const isMaster = req.nextUrl.searchParams.get('doc') === 'master';
  const docQS = isMaster ? '&doc=master' : '';

  // 1. Fetch the print-ready HTML from the worker (it enforces the auth gate).
  let html: string;
  try {
    const res = await fetch(
      `${HIEU_API_URL}/reading/${encodeURIComponent(id)}/export-pdf?format=html${docQS}`,
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
        'content-disposition': `attachment; filename="${isMaster ? 'Cam-Nang-Cuoc-Doi-Tong-Hop' : 'Cam-Nang-Cuoc-Doi'}.pdf"`,
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

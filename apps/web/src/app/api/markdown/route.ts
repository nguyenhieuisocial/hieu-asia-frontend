/**
 * "Markdown for Agents" — GET /api/markdown?path=/some/page
 *
 * Returns a Markdown rendering of any public HTML page so AI answer-engines
 * (and any client that sends `Accept: text/markdown`) can consume hieu.asia
 * content without parsing the full React/Tailwind HTML.
 *
 * Flow (driven by content negotiation in `middleware.ts`):
 *   1. A request to a normal page (e.g. `/pricing`) with `Accept: text/markdown`
 *      is REWRITTEN by the middleware to `/api/markdown?path=/pricing`.
 *   2. This handler self-fetches the page's HTML with `Accept: text/html`
 *      (so it never re-triggers the markdown negotiation → no loop), extracts
 *      the main content region, and converts it to Markdown via `turndown`.
 *
 * Node runtime: `turndown` needs a DOM (it bundles `@mixmark-io/domino`), which
 * is not available on the Edge runtime.
 *
 * Robustness:
 *   - `path` is strictly validated (must start with `/`, no `..`, not an API /
 *     internal / static-asset path) before we self-fetch.
 *   - The self-fetch targets the SAME origin as the incoming request, and asks
 *     for `text/html`, so it cannot loop back into markdown negotiation.
 *   - On any error we return a small, valid Markdown error document with HTTP
 *     200 so agents never choke on a 5xx.
 */

import { type NextRequest } from 'next/server';
import TurndownService from 'turndown';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';
// Markdown is derived from stable HTML — cache aggressively at the CDN.
const CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400';

/** Static asset extensions we never try to markdown-ify. */
const STATIC_ASSET_RE =
  /\.(?:ico|png|jpe?g|gif|webp|avif|svg|css|js|mjs|map|json|txt|xml|woff2?|ttf|otf|eot|pdf|mp4|webm|wasm)$/i;

/**
 * Validate the `?path=` value. Returns the clean pathname or `null` if it's not
 * a safe public page path.
 */
function validatePath(raw: string | null): string | null {
  if (!raw) return null;
  // Decode once so encoded traversal (`%2e%2e`) is caught too.
  let path: string;
  try {
    path = decodeURIComponent(raw);
  } catch {
    return null;
  }
  if (!path.startsWith('/')) return null;
  if (path.includes('..') || path.includes('\\') || path.includes('\0')) return null;
  if (
    path.startsWith('/api/') ||
    path === '/api' ||
    path.startsWith('/_next/') ||
    path.startsWith('/_vercel/') ||
    path.startsWith('/.well-known/') ||
    path.startsWith('/monitoring')
  ) {
    return null;
  }
  // Strip the (potential) query/hash — we only markdown-ify the page document.
  const pathnameOnly = path.split('#')[0]?.split('?')[0] ?? path;
  if (STATIC_ASSET_RE.test(pathnameOnly)) return null;
  return pathnameOnly;
}

/** Build a minimal, always-valid Markdown error doc (returned with HTTP 200). */
function markdownError(message: string, path?: string): string {
  const where = path ? `\n\n> Path: \`${path}\`` : '';
  return `# hieu.asia\n\n${message}${where}\n\n[Quay lại hieu.asia](https://hieu.asia/)\n`;
}

function markdownResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': MARKDOWN_CONTENT_TYPE,
      'Cache-Control': CACHE_CONTROL,
      // Help caches/agents understand this varies by Accept.
      Vary: 'Accept',
    },
  });
}

/**
 * Extract the main content region from a full HTML document and strip chrome
 * (nav/header/footer/scripts/styles/svg/Next internals). Returns an HTML
 * fragment suitable for turndown, plus a best-effort document title.
 */
function extractContent(html: string): { fragment: string; title: string | null } {
  // Document title: prefer the first <h1>, else <title>.
  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  const titleTag = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  const stripTags = (s: string) =>
    s
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  const title =
    (h1?.[1] && stripTags(h1[1])) || (titleTag?.[1] && stripTags(titleTag[1])) || null;

  // Prefer <main>, else <article>, else <body>, else the whole document.
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html);
  const article = /<article\b[^>]*>([\s\S]*?)<\/article>/i.exec(html);
  const body = /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(html);
  let fragment = main?.[1] ?? article?.[1] ?? body?.[1] ?? html;

  // Strip noise elements (with their content) that turndown would otherwise
  // turn into junk text.
  fragment = fragment
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, '')
    .replace(/<template\b[\s\S]*?<\/template>/gi, '')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, '')
    .replace(/<header\b[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, '')
    // Next.js build-watcher + portal roots that carry no content.
    .replace(/<[^>]*id=["']__next-build-watcher["'][\s\S]*?<\/[^>]+>/gi, '');

  return { fragment, title };
}

function htmlToMarkdown(fragment: string, title: string | null): string {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '_',
  });
  // Drop anything left that carries no useful prose. (`svg` is already stripped
  // in extractContent via regex; the turndown typings don't accept it here.)
  turndown.remove(['script', 'style', 'noscript', 'nav', 'header', 'footer']);

  let md = turndown.turndown(fragment).trim();

  // Prepend the document title as an H1 if the body doesn't already start with one.
  if (title && !md.startsWith('# ')) {
    md = `# ${title}\n\n${md}`;
  }
  return md ? `${md}\n` : '';
}

export async function GET(req: NextRequest) {
  // The middleware passes the target page path via the `x-markdown-path` header
  // (authoritative for rewrites) and the `?path=` query (for direct calls).
  const rawPath =
    req.headers.get('x-markdown-path') ?? req.nextUrl.searchParams.get('path');
  const path = validatePath(rawPath);
  if (!path) {
    return markdownResponse(
      markdownError('Không có nội dung Markdown cho đường dẫn này.'),
      200,
    );
  }

  const origin = req.nextUrl.origin;
  const target = new URL(path, origin);

  let html: string;
  try {
    const res = await fetch(target, {
      // Ask for HTML so the middleware never rewrites this back to markdown.
      headers: { Accept: 'text/html' },
      // Page HTML is itself cached/regenerated upstream; don't double-cache here.
      cache: 'no-store',
    });
    if (!res.ok) {
      return markdownResponse(
        markdownError(`Trang trả về mã ${res.status}.`, path),
        200,
      );
    }
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) {
      return markdownResponse(
        markdownError('Đường dẫn này không phải một trang HTML.', path),
        200,
      );
    }
    html = await res.text();
  } catch {
    return markdownResponse(
      markdownError('Không tải được nội dung trang.', path),
      200,
    );
  }

  try {
    const { fragment, title } = extractContent(html);
    const md = htmlToMarkdown(fragment, title);
    if (!md.trim()) {
      return markdownResponse(
        markdownError('Trang không có nội dung văn bản để chuyển đổi.', path),
        200,
      );
    }
    return markdownResponse(md, 200);
  } catch {
    return markdownResponse(
      markdownError('Không chuyển đổi được nội dung sang Markdown.', path),
      200,
    );
  }
}

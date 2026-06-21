import { NextResponse } from 'next/server';

// robots.txt is a Route Handler (not the MetadataRoute.Robots convention) so we
// can emit a `Content-Signal:` line — the typed metadata API has no escape hatch
// for arbitrary directives. The crawl rules below are an EXACT port of the
// previous app/robots.ts (Wave 60.60.b GEO policy); only Content-Signal is new.
//
// Content-Signal (contentsignals.org / draft-romm-aipref-contentsignals) declares
// per-group AI usage preferences ON TOP of access:
//   search=yes    — allow search indexing (SEO)
//   ai-input=yes  — allow AI answer engines to use our pages to answer users
//                   (the existing GEO strategy: be citable by ChatGPT/Claude/Perplexity)
//   ai-train=no   — decline bulk model-training use while staying citable
// Adjust ai-train to `yes` if maximum AI visibility (incl. training) is preferred.
// Robots groups are most-specific-wins, so the signal is repeated in each
// allow-group (a bot reads only its own group, not the wildcard).

const DISALLOW = [
  '/api/',
  '/reading/',
  '/unlock/',
  '/dashboard/',
  '/account',
  '/settings',
  '/signin',
  '/auth/',
  '/onboarding/',
  // Wave 64 — thin-content / near-duplicate / dead-shell routes.
  '/checkout/',
  '/r/',
  '/onboarding-wizard',
  // Wave 6 — private detail URLs (localStorage-only, would soft-404 for crawlers)
  '/decisions/d_',
  '/journal/jr_',
];

// AI search & answer engines (GEO) — explicit allow so they can index public
// marketing/learn pages and cite hieu.asia.
const AI_ALLOW_UA = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'anthropic-ai',
  'ClaudeBot',
  'Claude-Web',
  'Google-Extended',
  'CCBot',
  'PerplexityBot',
  'Applebot-Extended',
  'cohere-ai',
];

// High-volume / low-citation crawlers — fully blocked.
const BLOCKED_UA = ['Bytespider', 'Amazonbot', 'FacebookBot', 'Meta-ExternalAgent'];

const CONTENT_SIGNAL = 'Content-Signal: search=yes, ai-input=yes, ai-train=no';

export const dynamic = 'force-static';

export function GET() {
  const disallow = DISALLOW.map((p) => `Disallow: ${p}`).join('\n');

  const wildcard = [`User-Agent: *`, `Allow: /`, disallow, CONTENT_SIGNAL].join('\n');

  const aiAllow = [
    ...AI_ALLOW_UA.map((ua) => `User-Agent: ${ua}`),
    `Allow: /`,
    disallow,
    CONTENT_SIGNAL,
  ].join('\n');

  const blocked = [...BLOCKED_UA.map((ua) => `User-Agent: ${ua}`), `Disallow: /`].join('\n');

  const body =
    [wildcard, aiAllow, blocked].join('\n\n') +
    `\n\nHost: https://hieu.asia\nSitemap: https://hieu.asia/sitemap.xml\n`;

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

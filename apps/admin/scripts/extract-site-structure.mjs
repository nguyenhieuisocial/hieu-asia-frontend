#!/usr/bin/env node
/**
 * extract-site-structure.mjs
 *
 * Scans the App Router trees of every frontend app (web, admin, miniapp-telegram,
 * miniapp-zalo) and emits a single committed dataset describing the REAL page
 * structure of the whole frontend:
 *
 *   - one node per `page.tsx` route (route path, app group, section)
 *   - a one-line FUNCTION description (from metadata / generateMetadata / a
 *     route folder's <PageHeader title> / humanized route name)
 *   - the internal cross-links each page emits (href / <Link> / router.push)
 *
 * Output: apps/admin/src/lib/site-structure.ts (pure data, no JSX).
 *
 * Idempotent + re-runnable from repo root OR from apps/admin:
 *   node apps/admin/scripts/extract-site-structure.mjs
 *   pnpm --filter admin extract:sitemap
 *
 * Resolution is anchored to THIS file's location, so cwd does not matter.
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// apps/admin/scripts -> apps  (sibling apps live next to admin/)
const APPS_DIR = join(__dirname, '..', '..');

/** @type {{ id: string; title: string }[]} */
const APPS = [
  { id: 'web', title: 'Web (hieu.asia)' },
  { id: 'admin', title: 'Admin' },
  { id: 'miniapp-telegram', title: 'Mini App · Telegram' },
  { id: 'miniapp-zalo', title: 'Mini App · Zalo' },
];

// Co-located route files that are NOT page components and must be ignored when
// collecting cross-links from a route folder.
const NON_PAGE_TSX = new Set([
  'page.tsx',
  'layout.tsx',
  'loading.tsx',
  'error.tsx',
  'not-found.tsx',
  'template.tsx',
  'global-error.tsx',
  'default.tsx',
  'opengraph-image.tsx',
  'twitter-image.tsx',
  'icon.tsx',
  'apple-icon.tsx',
]);

// ---------------------------------------------------------------------------
// fs helpers
// ---------------------------------------------------------------------------

function exists(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

/** Recursively collect every `page.tsx` under a directory. */
function findPageFiles(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      // App Router private folders (_components) and api routes never produce pages.
      if (ent.name === 'node_modules' || ent.name.startsWith('_')) continue;
      findPageFiles(full, out);
    } else if (ent.name === 'page.tsx') {
      out.push(full);
    }
  }
  return out;
}

/** Sibling .tsx files in the same folder that are real components (not page/layout/etc). */
function coLocatedComponents(pageFile) {
  const dir = dirname(pageFile);
  /** @type {string[]} */
  const files = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    if (!ent.name.endsWith('.tsx')) continue;
    if (NON_PAGE_TSX.has(ent.name)) continue;
    files.push(join(dir, ent.name));
  }
  return files;
}

// ---------------------------------------------------------------------------
// route path computation
// ---------------------------------------------------------------------------

/**
 * Compute the public route from an app-router file path.
 * - strip everything up to `/app/` and the trailing `/page.tsx`
 * - DROP route groups `(group)`
 * - DROP parallel-route slots `@slot`
 * - keep dynamic segments `[param]` / `[...param]` as-is
 * - root => '/'
 */
function routeFromPageFile(appRoot, pageFile) {
  const rel = relative(join(appRoot, 'src', 'app'), pageFile);
  const segments = rel
    .split(sep)
    .slice(0, -1) // drop "page.tsx"
    .filter((seg) => seg.length > 0)
    .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')'))) // route groups
    .filter((seg) => !seg.startsWith('@')); // parallel slots
  if (segments.length === 0) return '/';
  return '/' + segments.join('/');
}

function isDynamicRoute(route) {
  return route.includes('[');
}

function sectionOf(route) {
  if (route === '/') return 'root';
  return route.split('/').filter(Boolean)[0];
}

// ---------------------------------------------------------------------------
// function-description extraction
// ---------------------------------------------------------------------------

function clean(s) {
  if (!s) return '';
  return s
    .replace(/\s+/g, ' ')
    .replace(/\$\{[^}]*\}/g, '…') // template-literal placeholders
    .trim();
}

function truncate(s, max = 140) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + '…';
}

/** Grab the body of `export const metadata[: Type] = { ... }` via brace matching. */
function metadataBlock(src) {
  const m = src.match(/export\s+const\s+metadata\s*(?::\s*[A-Za-z_][\w.]*)?\s*=\s*\{/);
  if (!m) return null;
  const start = m.index + m[0].length - 1; // position of the opening brace
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(start + 1, i);
    }
  }
  return null;
}

/** First top-level-ish `key: 'value'` / "value" inside a block. */
function firstStringField(block, key) {
  if (!block) return '';
  // match  title: 'x'  |  title: "x"  |  title: `x`
  const re = new RegExp(`\\b${key}\\s*:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`);
  const m = block.match(re);
  return m ? clean(m[2]) : '';
}

/** Title from a generateMetadata return ({ title: '...' } or `title: \`...\``). */
function generateMetadataTitle(src) {
  if (!/generateMetadata/.test(src)) return '';
  const re = /title\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/;
  const m = src.match(re);
  return m ? clean(m[2]) : '';
}

/**
 * Admin pages describe themselves via <PageHeader ... title="..." />.
 * The opening tag may carry an `icon={<Foo />}` prop BEFORE `title`, so a
 * `[^>]*` scan stops too early on the nested `>`. Scan a bounded window after
 * `<PageHeader` instead, tolerating nested JSX up to the first `title=`.
 */
function pageHeaderTitle(src) {
  const re =
    /<PageHeader\b[\s\S]{0,400}?\btitle\s*=\s*(?:(['"])((?:\\.|(?!\1).)*)\1|\{(['"`])((?:\\.|(?!\3).)*)\3\})/;
  const m = src.match(re);
  if (!m) return '';
  return clean(m[2] ?? m[4] ?? '');
}

/**
 * Many web tool/marketing pages have no `metadata` export but pass a string
 * `description="..."` (or `subtitle="..."`) to a shell component
 * (ToolPageShell / MarketingHero / PageHeader). The page `title` is usually a
 * JSX fragment (`title={<>…</>}`) so it can't be read, but the description prop
 * is a clean one-liner describing what the page does. Take the FIRST such
 * string-literal prop — on these pages it's the page-level shell description.
 */
function shellDescription(src) {
  const re = /\b(?:description|subtitle)\s*=\s*(["'])((?:\\.|(?!\1).)*)\1/;
  const m = src.match(re);
  return m ? clean(m[2]) : '';
}

/** Humanize a route into a readable label as a last-resort fn description. */
function humanizeRoute(route, appId) {
  if (route === '/') return appId === 'web' ? 'Trang chủ' : 'Trang chính';
  const last = route.split('/').filter(Boolean).pop();
  const human = last
    .replace(/^\[\.\.\.(.+)\]$/, '$1') // [...slug] -> slug
    .replace(/^\[(.+)\]$/, '$1') // [id] -> id
    .replace(/-/g, ' ')
    .trim();
  return human.charAt(0).toUpperCase() + human.slice(1);
}

/**
 * Resolve the one-line function description for a route per the fallback chain:
 *   metadata.title  ->  metadata.description  ->  generateMetadata title
 *   ->  <PageHeader title>  ->  humanized route name
 */
function describe(src, route, appId) {
  const block = metadataBlock(src);
  const title = firstStringField(block, 'title');
  if (title) return truncate(title);
  const desc = firstStringField(block, 'description');
  if (desc) return truncate(desc);
  const gen = generateMetadataTitle(src);
  if (gen) return truncate(gen);
  const ph = pageHeaderTitle(src);
  if (ph) return truncate(ph);
  const shell = shellDescription(src);
  if (shell) return truncate(shell);
  return humanizeRoute(route, appId);
}

// ---------------------------------------------------------------------------
// cross-link extraction
// ---------------------------------------------------------------------------

/** Normalize an internal link target: drop query/hash + trailing slash. */
function normalizeLink(raw) {
  if (!raw) return null;
  let v = raw.trim();
  if (!v.startsWith('/')) return null; // internal only
  if (v.startsWith('//')) return null; // protocol-relative -> external
  v = v.split('?')[0].split('#')[0];
  if (v.length > 1 && v.endsWith('/')) v = v.slice(0, -1);
  if (!v.startsWith('/')) return null;
  return v;
}

/**
 * Collect internal link targets from a source file. Captures:
 *   href="/..."            href='/...'
 *   href={`/...`}          (no interpolation before first /)
 *   href: '/...'           href: "/..."     href: `/...`   (object props, e.g. /cong-cu)
 *   <Link href="/...">     (covered by href= patterns)
 *   router.push('/...')    router.replace('/...')
 */
function extractLinks(src, into) {
  const patterns = [
    // href="..."  / href='...'
    /\bhref\s*=\s*(['"])(\/[^'"\n]*)\1/g,
    // href={`...`}
    /\bhref\s*=\s*\{\s*`(\/[^`$\n]*)`\s*\}/g,
    // href={'...'} / href={"..."}
    /\bhref\s*=\s*\{\s*(['"])(\/[^'"\n]*)\1\s*\}/g,
    // object property  href: '...' / "..." / `...`
    /\bhref\s*:\s*(['"`])(\/[^'"`\n]*)\1/g,
    // router.push('/...') / router.replace('/...') / .push(`/...`)
    /\.(?:push|replace)\(\s*(['"`])(\/[^'"`\n]*)\1/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(src)) !== null) {
      // last capture group holds the path (groups differ per pattern)
      const raw = m[2] ?? m[1];
      const norm = normalizeLink(raw);
      if (norm) into.add(norm);
    }
  }
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

/**
 * Generation timestamp. Defaults to the literal 'snapshot' so re-running with no
 * source changes produces a byte-identical file (idempotent diffs). Pass a real
 * ISO time via `--generated-at=<iso>`, `SITE_GENERATED_AT=<iso>`, or
 * `--generated-at=now` to stamp the current run.
 */
function resolveGeneratedAt() {
  const arg = process.argv.find((a) => a.startsWith('--generated-at='));
  const raw = arg ? arg.slice('--generated-at='.length) : process.env.SITE_GENERATED_AT;
  if (!raw) return 'snapshot';
  if (raw === 'now') return new Date().toISOString();
  return raw;
}

function build() {
  const generatedAt = resolveGeneratedAt();

  /** @type {Record<string, number>} */
  const perApp = {};
  let totalRoutes = 0;
  let totalEdges = 0;

  /** @type {any[]} */
  const appGroups = [];

  for (const app of APPS) {
    const appRoot = join(APPS_DIR, app.id);
    const appDir = join(appRoot, 'src', 'app');
    if (!exists(appDir)) {
      perApp[app.id] = 0;
      appGroups.push({ id: app.id, title: app.title, sections: [] });
      continue;
    }

    const pageFiles = findPageFiles(appDir).sort();

    /** @type {Map<string, any[]>} sectionId -> nodes */
    const sections = new Map();

    for (const pageFile of pageFiles) {
      const route = routeFromPageFile(appRoot, pageFile);
      const section = sectionOf(route);

      const pageSrc = readFileSync(pageFile, 'utf8');
      const fn = describe(pageSrc, route, app.id);

      // self route should never appear as a cross-link
      const links = new Set();
      extractLinks(pageSrc, links);
      for (const comp of coLocatedComponents(pageFile)) {
        extractLinks(readFileSync(comp, 'utf8'), links);
      }
      links.delete(route);

      const linksTo = [...links].sort();
      totalEdges += linksTo.length;
      totalRoutes++;

      const node = {
        route,
        title: fn, // human label === fn (kept distinct in the type for the UI)
        fn,
        section,
        app: app.id,
        dynamic: isDynamicRoute(route),
        linksTo,
      };

      if (!sections.has(section)) sections.set(section, []);
      sections.get(section).push(node);
    }

    perApp[app.id] = sections.size
      ? [...sections.values()].reduce((n, arr) => n + arr.length, 0)
      : 0;

    const sectionList = [...sections.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, pages]) => ({
        id,
        title: id === 'root' ? 'Trang gốc' : id,
        pages: pages.sort((a, b) => a.route.localeCompare(b.route)),
      }));

    appGroups.push({ id: app.id, title: app.title, sections: sectionList });
  }

  const stats = { totalRoutes, perApp, totalEdges };
  return { generatedAt, appGroups, stats };
}

// ---------------------------------------------------------------------------
// TS emit
// ---------------------------------------------------------------------------

function emit({ generatedAt, appGroups, stats }) {
  const json = (v) => JSON.stringify(v, null, 2);

  return `/**
 * site-structure.ts — AUTO-GENERATED. DO NOT EDIT BY HAND.
 *
 * Regenerate with:  pnpm --filter admin extract:sitemap
 * Source: apps/admin/scripts/extract-site-structure.mjs
 *
 * A snapshot of the real App Router page structure across every frontend app,
 * with a one-line function description + internal cross-links per route. Powers
 * the admin "site structure" view. Pure data — no runtime cost, no JSX.
 */

export type AppGroupId = 'web' | 'admin' | 'miniapp-telegram' | 'miniapp-zalo';

export interface SitePageNode {
  /** Public route path, e.g. "/la-so-tu-vi" or "/tu-vi-hom-nay/[zodiac]". */
  route: string;
  /** Human-readable label for the route (same source as \`fn\`). */
  title: string;
  /** One-line description of what the page does. */
  fn: string;
  /** First path segment ("root" for "/"). */
  section: string;
  /** Which app the route belongs to. */
  app: AppGroupId;
  /** True when the route contains a dynamic \`[param]\` segment. */
  dynamic: boolean;
  /** De-duplicated internal routes this page links to. */
  linksTo: string[];
}

export interface AppGroup {
  id: AppGroupId;
  title: string;
  sections: { id: string; title: string; pages: SitePageNode[] }[];
}

export interface SiteStats {
  totalRoutes: number;
  perApp: Record<string, number>;
  totalEdges: number;
}

export const SITE_GENERATED_AT: string = ${json(generatedAt)};

export const SITE_STRUCTURE: AppGroup[] = ${json(appGroups)};

export const SITE_STATS: SiteStats = ${json(stats)};
`;
}

// ---------------------------------------------------------------------------

/** Format with the repo's Prettier config; fall back to raw on any failure. */
async function formatTs(code, filepath) {
  try {
    const prettier = await import('prettier');
    const config = (await prettier.resolveConfig(filepath)) ?? {};
    return await prettier.format(code, { ...config, filepath, parser: 'typescript' });
  } catch {
    return code; // prettier unavailable — emit valid (if unformatted) TS
  }
}

async function main() {
  const data = build();
  const outPath = join(__dirname, '..', 'src', 'lib', 'site-structure.ts');
  const formatted = await formatTs(emit(data), outPath);
  writeFileSync(outPath, formatted, 'utf8');

  const { totalRoutes, perApp, totalEdges } = data.stats;
  console.log('[extract-site-structure] wrote', relative(process.cwd(), outPath));
  console.log('  totalRoutes:', totalRoutes);
  for (const [app, n] of Object.entries(perApp)) console.log(`  ${app}: ${n}`);
  console.log('  totalEdges:', totalEdges);
}

main();

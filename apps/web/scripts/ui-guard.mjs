#!/usr/bin/env node
/**
 * UI regression guard — note 167 §C.6.
 *
 * Runs on the lines a PR ADDS (git diff) and fails ONLY on NEW anti-patterns, so
 * it never trips on pre-existing code. Advisory by design (its own workflow, not a
 * required check) until promoted — promotion is a GitHub branch-protection setting
 * ("Require status checks" → add `ui-guard (note 167 §C.6)`), not a file change.
 * Patterns (all 6):
 *   1. <input type="time">            → use the Time24 component (CLAUDE.md)
 *   2. new `group-hover:` in a file with no `group-focus-within:` (hover→focus a11y)
 *   3. `text-sm`/`text-xs` on an input/select/textarea (iOS zoom / legibility)
 *   4. new `fixed bottom-` with no `safe-area-inset-bottom` in the file
 *   5. raw `bg-white`/`text-black` (no `dark:`) — breaks dark mode (QR/print exempt)
 *   6. §D route-registry: a NEW static public page.tsx that is registered in
 *      neither app/sitemap.ts nor lib/site-registry.ts → orphan page
 *
 * Usage: node apps/web/scripts/ui-guard.mjs [baseRef]   (default: origin/main)
 *
 * T35 — the pattern matchers below are exported as PURE functions (no git, no
 * process.exit) so `src/lib/ui-guard.test.ts` can lock in their behaviour. The
 * CLI body at the bottom only runs when this file is executed directly.
 */
import { execSync } from 'node:child_process';
import { argv, exit } from 'node:process';
import { pathToFileURL } from 'node:url';

const SRC = 'apps/web/src';
const APP = `${SRC}/app`;

// `\/og\/` phủ các route ảnh OG đặt theo thư mục (vd `app/bang-chung/og/route.tsx`)
// — cùng loại bề mặt với `opengraph-image`/`og-image`, ảnh unfurl luôn nền sáng.
const QR_PRINT_EXEMPT = /(qr|poster|print|opengraph|og-image|\/og\/|email|receipt|invoice)/i;

const violation = (f, why, t) => ({ f, why, t: String(t).trim().slice(0, 130) });

/**
 * Parse a `git diff --unified=0` blob into the lines it ADDS.
 * Only .ts/.tsx/.js/.jsx files are considered.
 *
 * @param {string} diff
 * @returns {{ file: string, text: string }[]}
 */
export function parseAddedLines(diff) {
  const added = [];
  let file = null;
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ b/')) { file = line.slice(6); continue; }
    if (line.startsWith('+++ ')) { file = null; continue; }
    // Test files are skipped: a guard's own test fixtures deliberately contain
    // the anti-patterns it looks for (e.g. `<div className="text-black" />`),
    // so scanning them makes the guard fail on itself.
    if (line.startsWith('+') && !line.startsWith('+++') && file
        && /\.(tsx?|jsx?)$/.test(file) && !/\.(test|spec)\.(tsx?|jsx?)$/.test(file)) {
      added.push({ file, text: line.slice(1) });
    }
  }
  return added;
}

/**
 * Line-level patterns (1, 3, 5) — each added line judged on its own.
 *
 * @param {{ file: string, text: string }[]} added
 * @returns {{ f: string, why: string, t: string }[]}
 */
export function scanAddedLines(added) {
  const violations = [];
  for (const { file: f, text } of added) {
    // 1. <input type="time">
    if (/<\s*input\b/i.test(text) && /type\s*=\s*["']time["']/.test(text)) {
      violations.push(violation(f, 'input type="time" → dùng component Time24 (CLAUDE.md, chưa enforce máy)', text));
    }
    // 3. text-sm / text-xs directly on a form control (same line)
    if (/<\s*(input|Input|select|Select|textarea|Textarea)\b/.test(text) && /\btext-(sm|xs)\b/.test(text)) {
      violations.push(violation(f, 'text-sm/xs trên input/select/textarea → iOS zoom + khó đọc', text));
    }
    // 5. raw bg-white / text-black (drop dark: variants first), except QR/print files
    if (!QR_PRINT_EXEMPT.test(f)) {
      const raw = text.replace(/dark:(?:bg-white|text-black)[\w/-]*/g, '');
      if (/(?<![\w:/-])bg-white\b/.test(raw) || /(?<![\w:/-])text-black\b/.test(raw)) {
        violations.push(violation(f, 'bg-white/text-black trần → hỏng dark-mode (chỉ QR/print được whitelist)', text));
      }
    }
  }
  return violations;
}

/**
 * File-level patterns (2, 4) — the added lines introduce a trigger, and the
 * file as a whole lacks the counterpart that makes it safe.
 *
 * @param {string} f        file path
 * @param {string} addedIn  the lines this change ADDS, joined by newline
 * @param {string} content  the file's full current content
 */
export function scanFileLevel(f, addedIn, content) {
  const violations = [];
  // 2. new group-hover: but file has no group-focus-within:
  if (/\bgroup-hover:/.test(addedIn) && !/group-focus-within:/.test(content)) {
    violations.push(violation(f, 'group-hover: mới nhưng file thiếu group-focus-within (hover-only ẩn khỏi bàn phím)', 'group-hover:'));
  }
  // 4. new `fixed bottom-` but no safe-area handling in the file
  if (/\bfixed\b[^"'`]*\bbottom-/.test(addedIn) &&
      !/(safe-area-inset-bottom|env\(safe-area|pb-safe|safe-bottom|safe-area-pb)/.test(content)) {
    violations.push(violation(f, 'fixed bottom- mới không kèm safe-area-inset-bottom (che nội dung trên iPhone notch)', 'fixed bottom-'));
  }
  return violations;
}

/**
 * `apps/web/src/app/(marketing)/pricing/page.tsx` → `/pricing`.
 * Route groups `(marketing)` are dropped; returns null for the root page.
 */
export function routeFromPagePath(f) {
  const route =
    '/' +
    f
      .slice(APP.length + 1)
      .replace(/(^|\/)page\.tsx$/, '')
      .split('/')
      .filter((seg) => seg && !/^\(.*\)$/.test(seg))
      .join('/');
  return route === '/' ? null : route;
}

/**
 * 6. §D route-registry — a NEW public page must be registered somewhere, or it
 * ships as an orphan: Google never discovers it and no nav/related link points
 * at it. `site-registry.guard.test.ts` already covers the OTHER direction
 * (registry entry → page must exist); this closes the loop at PR time.
 * Deliberately narrow, so it can't nag on legitimate work:
 *   - only page.tsx files the PR ADDS (never pre-existing pages),
 *   - dynamic segments (`[slug]`) are skipped — sitemap.ts generates those from
 *     data lists, so there is no literal route string to look for,
 *   - a page that opts out with `robots: { index: false }` is skipped (noindex
 *     pages must NOT be in the sitemap — conflicting signal in Search Console).
 *
 * @param {string} f        path of the added page.tsx
 * @param {string} body     its file content
 * @param {string} sitemapSrc
 * @param {string} registrySrc
 */
export function scanOrphanPage(f, body, sitemapSrc, registrySrc) {
  const route = routeFromPagePath(f);
  if (!route || route.includes('[')) return [];
  if (/index\s*:\s*false/.test(body)) return []; // robots noindex → intentionally unlisted

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const listed = new RegExp(`${esc(route)}["'\`]`);
  if (listed.test(sitemapSrc) || listed.test(registrySrc)) return [];

  // A cluster listed via `.map()` over a registry never contains the full path
  // as a literal — sitemap builds it as `${BASE}/tai-lieu/${doc.slug}` while the
  // registry stores `slug: 'ba-cau-hoi'` on its own, so neither source holds the
  // string this function looks for. Accept that shape only when BOTH halves are
  // present: the parent prefix used as a template in sitemap, and the leaf
  // segment quoted in registrySrc. A made-up slug still fails both tests.
  const seg = route.split('/');
  const leaf = seg.pop();
  const parent = seg.join('/');
  if (
    parent.length > 1 &&
    new RegExp(`${esc(parent)}/\\$\\{`).test(sitemapSrc) &&
    new RegExp(`["'\`]${esc(leaf)}["'\`]`).test(registrySrc)
  ) {
    return [];
  }

  return [
    violation(
      f,
      `trang mới ${route} chưa đăng ký ở app/sitemap.ts hoặc lib/site-registry.ts → trang mồ côi (Google không thấy, không có link nội bộ dẫn tới). Nếu CỐ Ý ẩn thì đặt robots { index: false } trong metadata.`,
      route,
    ),
  ];
}

// ─── CLI ────────────────────────────────────────────────────────────────────

function git(cmd) {
  return execSync(cmd, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function main() {
  const base = argv[2] || 'origin/main';

  let diff = '';
  let range = null;
  for (const r of [`${base}...HEAD`, `${base}`, 'HEAD~1']) {
    try {
      diff = git(`git diff --unified=0 ${r} -- ${SRC}`);
      range = r;
      if (diff) break;
    } catch {
      /* try next range (shallow clone / no base) */
    }
  }

  const added = parseAddedLines(diff);
  const violations = [...scanAddedLines(added)];

  const changed = [...new Set(added.map((a) => a.file))];
  for (const f of changed) {
    let content = '';
    try { content = git(`git show HEAD:${f}`); } catch { continue; }
    const addedIn = added.filter((a) => a.file === f).map((a) => a.text).join('\n');
    violations.push(...scanFileLevel(f, addedIn, content));
  }

  let addedPages = [];
  if (range) {
    try {
      addedPages = git(`git diff --diff-filter=A --name-only ${range} -- ${APP}`)
        .split('\n')
        .filter((f) => /\/page\.tsx$/.test(f));
    } catch {
      /* no usable range → skip guard 6 rather than guess */
    }
  }
  if (addedPages.length > 0) {
    let registrySrc = '';
    let sitemapSrc = '';
    try { registrySrc = git(`git show HEAD:${SRC}/lib/site-registry.ts`); } catch { /* optional */ }
    try { sitemapSrc = git(`git show HEAD:${APP}/sitemap.ts`); } catch { /* optional */ }

    // sitemap.ts lists whole clusters by mapping over a registry module it
    // imports (`import { TAI_LIEU } from '@/lib/tai-lieu/registry'`). Read those
    // modules too, so scanOrphanPage sees the same slugs sitemap does.
    for (const m of sitemapSrc.matchAll(/from\s+['"]@\/(lib\/[\w./-]+)['"]/g)) {
      try { registrySrc += '\n' + git(`git show HEAD:${SRC}/${m[1]}.ts`); } catch { /* optional */ }
    }

    for (const f of addedPages) {
      let body = '';
      try { body = git(`git show HEAD:${f}`); } catch { continue; }
      violations.push(...scanOrphanPage(f, body, sitemapSrc, registrySrc));
    }
  }

  if (violations.length === 0) {
    console.log('✓ ui-guard: không có anti-pattern UI mới trong file thay đổi.');
    exit(0);
  }

  console.error(`\n✗ ui-guard: phát hiện ${violations.length} anti-pattern UI MỚI (note 167 §C.6):\n`);
  for (const v of violations) {
    console.error(`  ${v.f}\n    ⚠ ${v.why}\n      ${v.t}\n`);
  }
  console.error('Sửa theo §C.6, hoặc nếu cố ý (vd QR/print) thì đặt file vào nhánh được whitelist.\n');
  exit(1);
}

// Chỉ chạy khi gọi trực tiếp (`node apps/web/scripts/ui-guard.mjs`), để file
// test import được các hàm thuần ở trên mà không kích hoạt git + process.exit.
if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
  main();
}

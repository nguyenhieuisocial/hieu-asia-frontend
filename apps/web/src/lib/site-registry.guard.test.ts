// S12 — registry guard (safety net locking in S9/T10). Two jobs:
//  1. Internal integrity: no duplicate hrefs, surface flags match sub-objects,
//     every related target is a real registry entry WITH a relatedLabel (so
//     toRelatedTools()'s need() can never throw at runtime), order manifests
//     reference valid entries, selectors don't throw.
//  2. No dead internal links: every href the registry points at (its own routes
//     + every "công cụ liên quan" target) must resolve to a real app page — so a
//     nav/related link can never 404. Catches the exact class of bug that made
//     pages orphaned/broken before.
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  TOOL_REGISTRY,
  QUICK_ORDER,
  HOME_GROUPS_ORDER,
  toQuickLookup,
  toToolkitGroups,
  toCatalogTools,
  toRelatedTools,
} from './site-registry';

const APP_DIR = join(process.cwd(), 'src/app');
// Registry-referenced hrefs that are intentional redirects (no page.tsx of their
// own). Keep empty unless a real redirect target is deliberately linked.
const KNOWN_REDIRECTS = new Set<string>([]);
const routeExists = (href: string): boolean =>
  existsSync(join(APP_DIR, href, 'page.tsx')) || KNOWN_REDIRECTS.has(href);

const byHref = new Map(TOOL_REGISTRY.map((e) => [e.href, e]));

describe('site-registry guard (S12) — integrity', () => {
  it('has no duplicate hrefs', () => {
    const seen = new Set<string>();
    const dups: string[] = [];
    for (const e of TOOL_REGISTRY) {
      if (seen.has(e.href)) dups.push(e.href);
      seen.add(e.href);
    }
    expect(dups).toEqual([]);
  });

  it('surface flags match the presence of their sub-objects', () => {
    const bad: string[] = [];
    for (const e of TOOL_REGISTRY) {
      if (e.surfaces.includes('drawer') !== !!e.quick) bad.push(`${e.href}: drawer↔quick`);
      if (e.surfaces.includes('home') !== !!e.home) bad.push(`${e.href}: home↔home`);
      if (e.surfaces.includes('catalog') !== !!e.catalog) bad.push(`${e.href}: catalog↔catalog`);
    }
    expect(bad).toEqual([]);
  });

  it('every related target is a registry entry WITH a relatedLabel (toRelatedTools never throws)', () => {
    const bad: string[] = [];
    for (const e of TOOL_REGISTRY)
      for (const t of e.related ?? []) {
        const target = byHref.get(t);
        if (!target) bad.push(`${e.href} → ${t} (no registry entry)`);
        else if (!target.relatedLabel) bad.push(`${e.href} → ${t} (no relatedLabel)`);
      }
    expect(bad).toEqual([]);
  });

  it('order manifests reference valid entries with the right surface', () => {
    const bad: string[] = [];
    for (const h of QUICK_ORDER) if (!byHref.get(h)?.quick) bad.push(`QUICK_ORDER: ${h}`);
    for (const g of HOME_GROUPS_ORDER)
      for (const h of g.hrefs) if (!byHref.get(h)?.home) bad.push(`HOME_GROUPS_ORDER: ${h}`);
    expect(bad).toEqual([]);
  });

  it('derived selectors do not throw', () => {
    expect(() => {
      toQuickLookup();
      toToolkitGroups();
      toCatalogTools();
      toRelatedTools();
    }).not.toThrow();
  });
});

describe('site-registry guard (S12) — no dead internal links', () => {
  it('every registry href resolves to a real page', () => {
    const dead = TOOL_REGISTRY.map((e) => e.href).filter((h) => !routeExists(h));
    expect(dead).toEqual([]);
  });

  it('every "công cụ liên quan" target resolves to a real page', () => {
    const targets = new Set<string>();
    for (const e of TOOL_REGISTRY) for (const t of e.related ?? []) targets.add(t);
    const dead = [...targets].filter((h) => !routeExists(h));
    expect(dead).toEqual([]);
  });
});

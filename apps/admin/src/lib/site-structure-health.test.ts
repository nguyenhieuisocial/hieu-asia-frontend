import { describe, expect, it } from 'vitest';
import { computeAppBrokenLinks, computeBrokenLinks } from './site-structure-health';
import type { AppGroup, SitePageNode } from './site-structure';

function page(partial: Partial<SitePageNode> & Pick<SitePageNode, 'route'>): SitePageNode {
  return {
    title: partial.route,
    fn: partial.route,
    section: partial.section ?? 'root',
    app: partial.app ?? 'web',
    dynamic: partial.dynamic ?? false,
    linksTo: partial.linksTo ?? [],
    ...partial,
  };
}

function group(pages: SitePageNode[]): AppGroup {
  return {
    id: 'web',
    title: 'Web',
    sections: [{ id: 'root', title: 'root', pages }],
  };
}

describe('computeAppBrokenLinks', () => {
  it('flags only the broken link, not valid static or dynamic matches', () => {
    const g = group([
      page({ route: '/checkout/[tier]', dynamic: true }),
      page({ route: '/about' }),
      page({
        route: '/',
        linksTo: [
          '/about', // valid: exact static route
          '/checkout/pro', // valid: matches dynamic /checkout/[tier]
          '/does-not-exist', // BROKEN: no route
        ],
      }),
    ]);

    const report = computeAppBrokenLinks(g);

    expect(report.count).toBe(1);
    expect(report.links).toEqual([{ fromRoute: '/', brokenTarget: '/does-not-exist' }]);
    // The dynamic match must NOT be flagged.
    expect(report.links.some((l) => l.brokenTarget === '/checkout/pro')).toBe(false);
  });

  it('treats trailing slash as equal ("/foo" === "/foo/")', () => {
    const g = group([
      page({ route: '/foo' }),
      page({ route: '/', linksTo: ['/foo/'] }),
    ]);
    expect(computeAppBrokenLinks(g).count).toBe(0);
  });

  it('matches catch-all [...slug] routes across multiple segments', () => {
    const g = group([
      page({ route: '/blog/[...path]', dynamic: true }),
      page({ route: '/', linksTo: ['/blog/2026/06/post'] }),
    ]);
    expect(computeAppBrokenLinks(g).count).toBe(0);
  });

  it('excludes API routes, externals, mailto/tel and anchors from broken-checks', () => {
    const g = group([
      page({
        route: '/',
        linksTo: ['/api/health', 'https://x.test', 'mailto:a@b.test', 'tel:+84', '#top'],
      }),
    ]);
    expect(computeAppBrokenLinks(g).count).toBe(0);
  });

  it('de-duplicates and stably orders broken links', () => {
    const g = group([
      page({ route: '/b', linksTo: ['/z-missing', '/a-missing'] }),
      page({ route: '/a', linksTo: ['/missing'] }),
    ]);
    const { links } = computeAppBrokenLinks(g);
    expect(links).toEqual([
      { fromRoute: '/a', brokenTarget: '/missing' },
      { fromRoute: '/b', brokenTarget: '/a-missing' },
      { fromRoute: '/b', brokenTarget: '/z-missing' },
    ]);
  });
});

describe('computeBrokenLinks', () => {
  it('reports per app independently (a target valid in one app can be broken in another)', () => {
    const web: AppGroup = {
      id: 'web',
      title: 'Web',
      sections: [{ id: 'root', title: 'root', pages: [page({ route: '/shared' })] }],
    };
    const admin: AppGroup = {
      id: 'admin',
      title: 'Admin',
      sections: [
        {
          id: 'root',
          title: 'root',
          // /shared exists in web but NOT in admin → broken here.
          pages: [page({ route: '/', app: 'admin', linksTo: ['/shared'] })],
        },
      ],
    };

    const reports = computeBrokenLinks([web, admin]);
    expect(reports.find((r) => r.app === 'web')?.count).toBe(0);
    expect(reports.find((r) => r.app === 'admin')?.count).toBe(1);
  });
});

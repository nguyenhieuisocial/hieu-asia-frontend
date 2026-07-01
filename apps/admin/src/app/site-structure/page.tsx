'use client';

/**
 * /site-structure — "Cấu trúc trang" — an auto-extracted snapshot of every page
 * across the platform (web, admin, mini apps): route, what the page does, and
 * its internal cross-links. Two views over the same dataset:
 *
 *   1) INTERACTIVE DIAGRAM (React Flow, lazy + mounted-gated) — the big picture:
 *      section nodes → their page nodes (dynamic [param] routes collapsed into a
 *      single counted node), with dashed cross-link edges between pages.
 *   2) DETAILED TABLE — the full detail: searchable, section-grouped, collapsible
 *      list of every route, with "→ links to" and computed "← linked from".
 *
 * Data is pure (lib/site-structure.ts, regenerated via
 * `pnpm --filter admin extract:sitemap`). No backend, no runtime fetch.
 *
 * Mirrors /architecture: same PageHeader + Card, and the SAME hydration guard —
 * the heavy React-Flow map is next/dynamic(ssr:false) AND only mounted after a
 * post-hydration flag, so the lazy chunk never races the hydration pass (this
 * repo had a production blank-page bug from exactly that race).
 */

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button, Card, CardContent, cn, toast } from '@hieu-asia/ui';
import {
  FolderTree,
  Search,
  Share2,
  LayoutGrid,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Network,
  RefreshCw,
  RotateCw,
  Unlink,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import {
  SITE_STRUCTURE,
  SITE_STATS,
  SITE_GENERATED_AT,
  type AppGroup,
  type AppGroupId,
  type SitePageNode,
} from '@/lib/site-structure';
import { computeAppBrokenLinks, type AppBrokenLinks } from '@/lib/site-structure-health';
import { postRegenSitemap } from '@/lib/admin-api';

// Heavy (React Flow) — lazy-load only when the "Tương tác" view is shown.
const SiteMapFlow = dynamic(() => import('@/components/admin/site-structure/SiteMapFlow'), {
  ssr: false,
  loading: () => <div className="h-[70vh] min-h-[460px] w-full animate-pulse rounded-lg bg-muted/30" />,
});

// Per-app base URL for opening a route's LIVE page in a new tab.
const APP_BASE: Record<AppGroupId, string | undefined> = {
  web: 'https://hieu.asia',
  admin: 'https://admin.hieu.asia',
  'miniapp-telegram': 'https://miniapp.hieu.asia',
  'miniapp-zalo': undefined, // not deployed yet
};

const APP_TABS: { id: AppGroupId; label: string }[] = [
  { id: 'web', label: 'Web khách' },
  { id: 'admin', label: 'Admin' },
  { id: 'miniapp-telegram', label: 'Miniapp TG' },
  { id: 'miniapp-zalo', label: 'Miniapp Zalo' },
];

function liveUrlFor(app: AppGroupId, route: string): string | undefined {
  const base = APP_BASE[app];
  if (!base) return undefined;
  // Dynamic routes (`/foo/[id]`) have no canonical live URL — link to the section.
  if (route.includes('[')) return undefined;
  return base + (route === '/' ? '' : route);
}

/** Inline "Cập Nhật ngay" button — asks the worker to regenerate + republish the map. */
function RefreshButton() {
  const [pending, setPending] = React.useState(false);
  const click = React.useCallback(async () => {
    if (pending) return;
    setPending(true);
    const res = await postRegenSitemap();
    setPending(false);
    if (res.ok) {
      toast.success('Đã yêu cầu cập nhật — bản đồ sẽ mới sau ~1–2 phút khi xuất bản xong.');
      return;
    }
    if (res.error === 'DEPLOY_HOOK_NOT_CONFIGURED') {
      toast.error('Nút chưa được kích hoạt: cần cấu hình Deploy Hook (VERCEL_ADMIN_DEPLOY_HOOK) trong Vercel.');
      return;
    }
    toast.error(res.error ?? 'Không cập nhật được.');
  }, [pending]);
  return (
    <Button variant="outline" size="sm" onClick={click} disabled={pending}>
      <RotateCw className={`mr-1.5 h-3.5 w-3.5 ${pending ? 'animate-spin' : ''}`} />
      {pending ? 'Đang gửi…' : 'Cập Nhật ngay'}
    </Button>
  );
}

export default function SiteStructurePage() {
  const [appId, setAppId] = React.useState<AppGroupId>('web');
  const [view, setView] = React.useState<'flow' | 'table'>('flow');
  const [filter, setFilter] = React.useState('');

  const group: AppGroup | undefined = React.useMemo(
    () => SITE_STRUCTURE.find((g) => g.id === appId),
    [appId],
  );

  // Reverse edges: route → routes that link TO it, scoped to the selected app.
  const linkedFrom = React.useMemo(() => {
    const map = new Map<string, string[]>();
    if (!group) return map;
    for (const section of group.sections) {
      for (const p of section.pages) {
        for (const target of p.linksTo) {
          const arr = map.get(target) ?? [];
          arr.push(p.route);
          map.set(target, arr);
        }
      }
    }
    return map;
  }, [group]);

  // Dangling internal links for the selected app (pure, from the dataset).
  const brokenLinks = React.useMemo(
    () => (group ? computeAppBrokenLinks(group) : null),
    [group],
  );

  const urlFor = React.useCallback((route: string) => liveUrlFor(appId, route), [appId]);

  // Only mount the React-Flow map AFTER hydration. next/dynamic(ssr:false) loads
  // its chunk asynchronously; letting it resolve during initial hydration races
  // with React and can leave the whole page un-hydrated. Gating on a post-mount
  // flag keeps the lazy component out of the hydration pass entirely. (Mirrors
  // /architecture, which hit exactly this production blank-page bug.)
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cấu trúc trang"
        description="Ảnh chụp tự động toàn bộ trang của nền tảng — đường dẫn, chức năng từng trang, và liên kết chéo nội bộ."
        icon={<FolderTree className="h-5 w-5" />}
        actions={
          <Link
            href="/architecture"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
          >
            <Network className="h-3.5 w-3.5" aria-hidden /> Xem sơ đồ hệ thống
          </Link>
        }
      />

      {/* Intro + stats */}
      <Card>
        <CardContent className="space-y-3 p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground">
              Bản đồ tự động cập nhật mỗi lần xuất bản.
              {SITE_GENERATED_AT && (
                <>
                  {' '}
                  <span className="text-foreground">
                    Cập nhật gần nhất:{' '}
                    {SITE_GENERATED_AT.includes('T') && SITE_GENERATED_AT.includes('-')
                      ? new Date(SITE_GENERATED_AT).toLocaleString('vi-VN')
                      : SITE_GENERATED_AT}
                  </span>
                </>
              )}
            </p>
            <RefreshButton />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/50 pt-3">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-gold" aria-hidden />
              <span className="font-medium text-foreground">{SITE_STATS.totalRoutes}</span>
              <span className="text-muted-foreground">đường dẫn</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-gold" aria-hidden />
              <span className="font-medium text-foreground">{SITE_STATS.totalEdges}</span>
              <span className="text-muted-foreground">liên kết chéo</span>
            </span>
            {APP_TABS.map((t) => (
              <span key={t.id} className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-muted-foreground">{t.label}:</span>
                <span className="font-medium text-foreground">{SITE_STATS.perApp[t.id] ?? 0}</span>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* App switcher */}
      <div className="flex flex-wrap items-center gap-1.5">
        {APP_TABS.map((t) => {
          const count = SITE_STATS.perApp[t.id] ?? 0;
          const active = appId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setAppId(t.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'border-gold/50 bg-gold/15 text-gold'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
              <span
                className={cn(
                  'rounded px-1 font-mono text-[10px]',
                  active ? 'bg-gold/20 text-gold' : 'bg-muted/40 text-muted-foreground',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Broken internal links — scoped to the selected app */}
      {brokenLinks && <BrokenLinksSummary report={brokenLinks} urlFor={urlFor} />}

      {/* View toggle */}
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setView('flow')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
            view === 'flow'
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-border text-muted-foreground hover:text-foreground',
          )}
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden /> Sơ đồ
        </button>
        <button
          type="button"
          onClick={() => setView('table')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
            view === 'table'
              ? 'border-gold/50 bg-gold/15 text-gold'
              : 'border-border text-muted-foreground hover:text-foreground',
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" aria-hidden /> Chi tiết
        </button>
      </div>

      {!group || group.sections.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Chưa có trang nào được trích xuất cho ứng dụng này.
          </CardContent>
        </Card>
      ) : view === 'flow' ? (
        <section className="space-y-3">
          {mounted ? (
            <SiteMapFlow group={group} liveUrlFor={urlFor} />
          ) : (
            <div className="h-[70vh] min-h-[460px] w-full animate-pulse rounded-lg bg-muted/30" />
          )}
          <p className="text-center text-[11px] text-muted-foreground">
            Kéo để di chuyển · cuộn để phóng to · các route động được gộp thành một khối · bấm một trang để
            mở bản chạy thật
          </p>
        </section>
      ) : (
        <DetailTable group={group} filter={filter} setFilter={setFilter} linkedFrom={linkedFrom} urlFor={urlFor} />
      )}
    </div>
  );
}

// ── Broken internal links summary ────────────────────────────────────────────

function BrokenLinksSummary({
  report,
  urlFor,
}: {
  report: AppBrokenLinks;
  urlFor: (route: string) => string | undefined;
}) {
  if (report.count === 0) {
    return (
      <Card className="border-emerald-500/30">
        <CardContent className="flex items-center gap-2 p-3 text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
          <span className="text-muted-foreground">Không có liên kết nội bộ hỏng</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-500/30">
      <CardContent className="p-0">
        <details className="group" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-red-500/[0.04]">
            <span className="flex items-center gap-2">
              <Unlink className="h-4 w-4 shrink-0 text-red-500" aria-hidden />
              <span className="font-medium text-foreground">Liên kết nội bộ hỏng</span>
              <span className="rounded bg-red-500/15 px-1.5 py-0.5 font-mono text-[10px] text-red-500">
                {report.count}
              </span>
            </span>
            <ChevronDown
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <ul className="divide-y divide-border/50 border-t border-border/50">
            {report.links.map((link) => {
              const fromHref = urlFor(link.fromRoute);
              return (
                <li
                  key={`${link.fromRoute}→${link.brokenTarget}`}
                  className="flex flex-wrap items-center gap-x-1.5 gap-y-1 px-4 py-2 text-[11px]"
                >
                  {fromHref ? (
                    <a
                      href={fromHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono font-medium text-gold hover:underline"
                    >
                      {link.fromRoute}
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  ) : (
                    <span className="font-mono font-medium text-foreground">{link.fromRoute}</span>
                  )}
                  <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden />
                  <span className="font-mono font-medium text-red-500">{link.brokenTarget}</span>
                </li>
              );
            })}
          </ul>
        </details>
      </CardContent>
    </Card>
  );
}

// ── Detailed table ──────────────────────────────────────────────────────────

function DetailTable({
  group,
  filter,
  setFilter,
  linkedFrom,
  urlFor,
}: {
  group: AppGroup;
  filter: string;
  setFilter: (v: string) => void;
  linkedFrom: Map<string, string[]>;
  urlFor: (route: string) => string | undefined;
}) {
  const q = filter.trim().toLowerCase();

  // Filter pages by route or function; keep only sections with matches.
  const sections = React.useMemo(() => {
    return group.sections
      .map((s) => ({
        ...s,
        pages: q
          ? s.pages.filter(
              (p) => p.route.toLowerCase().includes(q) || p.fn.toLowerCase().includes(q),
            )
          : s.pages,
      }))
      .filter((s) => s.pages.length > 0);
  }, [group, q]);

  const matchCount = sections.reduce((n, s) => n + s.pages.length, 0);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Lọc theo đường dẫn hoặc chức năng…"
          className="w-full rounded-md border border-border bg-card/60 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {matchCount} / {group.sections.reduce((n, s) => n + s.pages.length, 0)} đường dẫn
        {q && ' khớp bộ lọc'}
      </p>

      {sections.map((section) => (
        <Card key={section.id}>
          <CardContent className="p-0">
            <details className="group" open={!!q}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-gold/[0.03]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{section.title}</span>
                  <span className="rounded bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {section.pages.length}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="divide-y divide-border/50 border-t border-border/50">
                {section.pages.map((p) => (
                  <RouteRow key={p.route} page={p} linkedFrom={linkedFrom.get(p.route) ?? []} urlFor={urlFor} />
                ))}
              </div>
            </details>
          </CardContent>
        </Card>
      ))}

      {sections.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Không có đường dẫn nào khớp “{filter}”.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RouteRow({
  page,
  linkedFrom,
  urlFor,
}: {
  page: SitePageNode;
  linkedFrom: string[];
  urlFor: (route: string) => string | undefined;
}) {
  const href = urlFor(page.route);
  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs font-medium text-gold hover:underline"
          >
            {page.route}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        ) : (
          <span className="font-mono text-xs font-medium text-foreground">{page.route}</span>
        )}
        {page.dynamic && (
          <span className="rounded bg-purple/15 px-1.5 py-0.5 font-mono text-[9px] text-purple">
            động
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{page.fn}</p>
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
        <LinkList label="→ liên kết tới" icon={<ArrowRight className="h-3 w-3" aria-hidden />} routes={page.linksTo} urlFor={urlFor} />
        <LinkList label="← được liên kết từ" icon={<ArrowLeft className="h-3 w-3" aria-hidden />} routes={linkedFrom} urlFor={urlFor} />
      </div>
    </div>
  );
}

function LinkList({
  label,
  icon,
  routes,
  urlFor,
}: {
  label: string;
  icon: React.ReactNode;
  routes: string[];
  urlFor: (route: string) => string | undefined;
}) {
  if (routes.length === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground/50">
        {icon} {label}: <span className="font-mono">0</span>
      </span>
    );
  }
  return (
    <details className="group/links inline-block align-top">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-muted-foreground hover:text-foreground">
        {icon} {label}: <span className="font-mono font-medium">{routes.length}</span>
        <ChevronDown className="h-3 w-3 transition-transform group-open/links:rotate-180" aria-hidden />
      </summary>
      <ul className="mt-1 space-y-0.5 pl-4">
        {routes.map((r) => {
          const href = urlFor(r);
          return (
            <li key={r}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-gold/90 hover:underline">
                  {r}
                </a>
              ) : (
                <span className="font-mono text-[11px] text-foreground/70">{r}</span>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}

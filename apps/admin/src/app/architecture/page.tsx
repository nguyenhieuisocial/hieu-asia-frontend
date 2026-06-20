'use client';

/**
 * /architecture — "Sơ đồ hệ thống sống" + cẩm nang vận hành.
 *
 * A self-documenting map of the whole platform: the layered topology (giao diện
 * → cổng → dữ liệu → AI → tiền → đo lường) with LIVE status dots on the infra
 * nodes (fetched in parallel from the same /admin/infra/<slug> endpoints the
 * detail pages use, so no new backend), click-through to each node's admin page,
 * the key data flows (lá số / thanh toán / hằng ngày), and operating runbooks.
 * Topology is data in lib/architecture.ts (grounded in vault 94).
 */

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent, cn } from '@hieu-asia/ui';
import {
  Network,
  ArrowDown,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Circle,
  Workflow,
  BookOpen,
  Share2,
  LayoutGrid,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { ARCH_LAYERS, ARCH_FLOWS, RUNBOOKS, type ArchNode } from '@/lib/architecture';

// Heavy (React Flow) — lazy-load only when the "Tương tác" view is shown.
const SystemMapFlow = dynamic(
  () => import('@/components/admin/architecture/SystemMapFlow'),
  { ssr: false, loading: () => <div className="h-[70vh] min-h-[460px] w-full animate-pulse rounded-lg bg-muted/30" /> },
);

type Live = 'ok' | 'warn' | 'down' | 'unknown' | 'loading';

const PROXY = '/api/admin-proxy';

function StatusDot({ s }: { s: Live }) {
  if (s === 'ok') return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-jade-700 dark:text-jade-50" aria-label="đang chạy" />;
  if (s === 'warn') return <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-gold" aria-label="cảnh báo" />;
  if (s === 'down') return <XCircle className="h-3.5 w-3.5 shrink-0 text-red-500" aria-label="lỗi" />;
  return <Circle className={cn('h-3.5 w-3.5 shrink-0', s === 'loading' ? 'animate-pulse text-muted-foreground/40' : 'text-muted-foreground/30')} aria-label="chưa rõ" />;
}

// Slugs that have a live /admin/infra/<slug> status endpoint.
const LIVE_SLUGS = Array.from(
  new Set(ARCH_LAYERS.flatMap((l) => l.nodes.map((n) => n.infraSlug).filter(Boolean) as string[])),
);

export default function ArchitecturePage() {
  const [statuses, setStatuses] = React.useState<Record<string, Live>>(() =>
    Object.fromEntries(LIVE_SLUGS.map((s) => [s, 'loading'])),
  );
  const [core, setCore] = React.useState<{ api: Live; version?: string; queueAgeMin?: number }>({ api: 'loading' });

  React.useEffect(() => {
    let cancelled = false;

    // Core: API health + queue age (the two cheap dashboard signals).
    (async () => {
      let api: Live = 'down';
      let version: string | undefined;
      try {
        const r = await fetch(`${PROXY}/health`, { cache: 'no-store' });
        if (r.ok) {
          api = 'ok';
          const j = (await r.json().catch(() => ({}))) as { version?: string };
          version = j.version;
        }
      } catch {
        /* down */
      }
      let queueAgeMin: number | undefined;
      try {
        const r = await fetch(`${PROXY}/admin/queue_depth`, { cache: 'no-store' });
        const j = (await r.json().catch(() => ({}))) as { oldest_pending_age_seconds?: number };
        if (typeof j.oldest_pending_age_seconds === 'number') queueAgeMin = Math.round(j.oldest_pending_age_seconds / 60);
      } catch {
        /* ignore */
      }
      if (!cancelled) setCore({ api, version, queueAgeMin });
    })();

    // Per-infra-node live status (parallel, best-effort).
    LIVE_SLUGS.forEach(async (slug) => {
      let s: Live = 'unknown';
      try {
        const r = await fetch(`${PROXY}/admin/infra/${slug}`, { cache: 'no-store' });
        const j = (await r.json().catch(() => ({}))) as { ok?: boolean; configured?: boolean };
        if (j.configured === false) s = 'warn';
        else if (j.ok === false) s = 'down';
        else if (j.ok) s = 'ok';
        else s = 'unknown';
      } catch {
        s = 'down';
      }
      if (!cancelled) setStatuses((prev) => ({ ...prev, [slug]: s }));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const queueStatus: Live =
    core.queueAgeMin == null ? 'unknown' : core.queueAgeMin >= 240 ? 'down' : core.queueAgeMin >= 60 ? 'warn' : 'ok';

  const [mapView, setMapView] = React.useState<'flow' | 'layers'>('flow');

  // Only mount the React-Flow map AFTER hydration. next/dynamic(ssr:false)
  // loads its chunk asynchronously; letting it resolve during initial hydration
  // races with React and can leave the whole page un-hydrated (skeleton stuck,
  // toggle + live status dots dead). Gating on a post-mount flag keeps the
  // lazy component out of the hydration pass entirely.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sơ đồ hệ thống"
        description="Toàn bộ guồng máy hoạt động như thế nào — trạng thái sống từng phần, luồng dữ liệu, và cẩm nang vận hành. Bấm vào mỗi khối để mở chi tiết."
        icon={<Network className="h-5 w-5" />}
      />

      {/* Core health banner */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-sm">
          <span className="flex items-center gap-2">
            <StatusDot s={core.api} />
            <span className="font-medium">Cổng API</span>
            <span className="text-muted-foreground">{core.api === 'ok' ? 'đang chạy' : core.api === 'loading' ? 'đang kiểm…' : 'không phản hồi'}</span>
            {core.version && <span className="font-mono text-xs text-muted-foreground">({core.version})</span>}
          </span>
          <span className="flex items-center gap-2">
            <StatusDot s={queueStatus} />
            <span className="font-medium">Hàng đợi đọc</span>
            <span className="text-muted-foreground">
              {core.queueAgeMin == null ? '—' : core.queueAgeMin === 0 ? 'trống' : `chờ lâu nhất ${core.queueAgeMin} phút`}
            </span>
          </span>
        </CardContent>
      </Card>

      {/* System map — interactive (React Flow) or layered cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setMapView('flow')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
              mapView === 'flow'
                ? 'border-gold/50 bg-gold/15 text-gold'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden /> Tương tác
          </button>
          <button
            type="button"
            onClick={() => setMapView('layers')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
              mapView === 'layers'
                ? 'border-gold/50 bg-gold/15 text-gold'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" aria-hidden /> Theo tầng
          </button>
        </div>

        {mapView === 'flow' ? (
          <>
            {mounted ? (
              <SystemMapFlow statuses={statuses} />
            ) : (
              <div className="h-[70vh] min-h-[460px] w-full animate-pulse rounded-lg bg-muted/30" />
            )}
            <p className="text-center text-[11px] text-muted-foreground">
              Kéo để di chuyển · cuộn để phóng to · bấm một khối để mở chi tiết
            </p>
          </>
        ) : (
          <div className="space-y-2">
            {ARCH_LAYERS.map((layer, li) => (
          <React.Fragment key={layer.id}>
            <Card>
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-heading text-base text-foreground">{layer.title}</h3>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{layer.subtitle}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {layer.nodes.map((n) => (
                    <NodeCard key={n.id} node={n} live={n.infraSlug ? statuses[n.infraSlug] ?? 'unknown' : undefined} />
                  ))}
                </div>
              </CardContent>
            </Card>
            {li < ARCH_LAYERS.length - 1 && (
              <div className="flex justify-center py-0.5 text-muted-foreground/50" aria-hidden>
                <ArrowDown className="h-4 w-4" />
              </div>
            )}
          </React.Fragment>
        ))}
          </div>
        )}
      </section>

      {/* Data flows */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Workflow className="h-4 w-4 text-gold" aria-hidden />
          <h2 className="font-heading text-lg text-foreground">Luồng dữ liệu chính</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {ARCH_FLOWS.map((flow) => (
            <Card key={flow.id}>
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground">{flow.title}</h3>
                <p className="mb-3 text-xs text-muted-foreground">{flow.subtitle}</p>
                <ol className="space-y-1.5">
                  {flow.steps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs text-foreground/85">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/15 font-mono text-[9px] text-gold">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Runbooks */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-gold" aria-hidden />
          <h2 className="font-heading text-lg text-foreground">Cẩm nang vận hành</h2>
        </div>
        <div className="space-y-2">
          {RUNBOOKS.map((rb) => (
            <Card key={rb.id}>
              <CardContent className="p-0">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-gold/[0.03]">
                    <div>
                      <span className="font-medium text-foreground">{rb.title}</span>
                      <span className="ml-2 text-xs text-muted-foreground">— {rb.when}</span>
                    </div>
                    <ArrowDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <ol className="space-y-1.5 border-t border-border/50 px-4 py-3">
                    {rb.steps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground/85">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/15 font-mono text-[9px] text-gold">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function NodeCard({ node, live }: { node: ArchNode; live?: Live }) {
  const inner = (
    <div
      className={cn(
        'flex h-full items-start gap-2 rounded-md border px-3 py-2 transition-colors',
        node.core ? 'border-gold/40 bg-gold/[0.06]' : 'border-border bg-card/60',
        (node.adminHref || node.externalHref) && 'hover:border-gold/40 hover:bg-gold/[0.04]',
      )}
    >
      {live ? <span className="mt-0.5"><StatusDot s={live} /></span> : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="truncate text-sm font-medium text-foreground">{node.label}</span>
          {node.externalHref && !node.adminHref && <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />}
          {node.adminHref && <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />}
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{node.role}</p>
      </div>
    </div>
  );

  if (node.adminHref) {
    return (
      <Link href={node.adminHref} className="block">
        {inner}
      </Link>
    );
  }
  if (node.externalHref) {
    return (
      <a href={node.externalHref} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return inner;
}

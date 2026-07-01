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
import { Button, Card, CardContent, cn, toast } from '@hieu-asia/ui';
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
  Clock,
  ShieldCheck,
  Lock,
  Zap,
  FolderTree,
  RotateCw,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import {
  ARCH_LAYERS,
  ARCH_FLOWS,
  RUNBOOKS,
  SCHEDULED_OPS,
  RBAC_ROLES,
  OWNER_ONLY_ACTIONS,
  QUICK_ACTIONS,
  type ArchNode,
} from '@/lib/architecture';
import { postRegenSitemap } from '@/lib/admin-api';

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

// "Chạy ngay" — trigger a safe scheduled job on demand via POST /admin/cron/run
// (worker allowlists idempotent check/monitor/notify/reconcile jobs only).
function RunJobButton({ job }: { job: string }) {
  const [state, setState] = React.useState<'idle' | 'running' | 'ok' | 'err'>('idle');
  const run = React.useCallback(async () => {
    setState('running');
    try {
      const r = await fetch(`${PROXY}/admin/cron/run`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ job }),
        cache: 'no-store',
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean };
      setState(r.ok && j?.ok ? 'ok' : 'err');
    } catch {
      setState('err');
    }
    setTimeout(() => setState('idle'), 4000);
  }, [job]);
  return (
    <button
      type="button"
      onClick={run}
      disabled={state === 'running'}
      className={cn(
        'shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium transition-colors disabled:opacity-60',
        state === 'ok'
          ? 'border-jade-600/40 text-jade-700 dark:text-jade-50'
          : state === 'err'
            ? 'border-red-500/40 text-red-500'
            : 'border-gold/30 text-gold hover:bg-gold/10',
      )}
      title="Chạy tác vụ này ngay (không đợi lịch)"
    >
      {state === 'running' ? 'Đang chạy…' : state === 'ok' ? '✓ đã chạy' : state === 'err' ? '✗ lỗi' : 'Chạy ngay'}
    </button>
  );
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

// One recorded cron/ops run (mirrors worker admin/cron-history CronRun).
interface CronRun {
  job: string;
  ts: string;
  ok: boolean;
  ms: number;
  source: 'scheduled' | 'manual';
  note?: string;
}

// Compact "x phút/giờ/ngày trước" — computed after mount (client-only) so no
// hydration mismatch.
function fmtAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return 'vừa xong';
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  return `${Math.floor(hr / 24)} ngày trước`;
}

// "Lần chạy gần nhất" badge for a schedule group — last recorded run + status.
function LastRun({ runs }: { runs?: CronRun[] }) {
  const last = runs?.[0];
  if (!last) {
    return <span className="text-[10px] text-muted-foreground/60">chưa ghi nhận lần chạy</span>;
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px]',
        last.ok ? 'text-jade-700 dark:text-jade-50' : 'text-red-500',
      )}
      title={last.ok ? `${last.source} · ${last.ms}ms` : last.note ?? 'lỗi'}
    >
      {last.ok ? '✓' : '✗'} {fmtAgo(last.ts)}
    </span>
  );
}

// Turn `(/path)` references inside a runbook/flow step into a clickable Link to
// that admin page — so an operator goes map → runbook → one click → the fix page.
function linkifyAdminPaths(text: string): React.ReactNode {
  const parts = text.split(/(\(\/[a-z0-9/-]+\))/g);
  return parts.map((part, i) => {
    const m = /^\((\/[a-z0-9/-]+)\)$/.exec(part);
    const href = m?.[1];
    if (!href) return part;
    return (
      <React.Fragment key={i}>
        (
        <Link href={href} className="text-gold underline-offset-2 hover:underline">
          {href}
        </Link>
        )
      </React.Fragment>
    );
  });
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
  const [cronHistory, setCronHistory] = React.useState<Record<string, CronRun[]>>({});

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const r = await fetch(`${PROXY}/admin/cron/history`, { cache: 'no-store' });
        const j = (await r.json().catch(() => ({}))) as { ok?: boolean; history?: Record<string, CronRun[]> };
        if (active && j?.ok && j.history) setCronHistory(j.history);
      } catch {
        /* run-history is best-effort UI sugar — ignore */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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
        title="Sơ đồ & vận hành"
        description="Trung tâm vận hành: hành động nhanh, trạng thái sống, sơ đồ hệ thống, luồng dữ liệu, cẩm nang, tác vụ định kỳ và phân quyền — tất cả một chỗ."
        icon={<Network className="h-5 w-5" />}
        actions={
          <Link
            href="/site-structure"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
          >
            <FolderTree className="h-3.5 w-3.5" aria-hidden /> Xem cấu trúc trang
          </Link>
        }
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
          <span className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
            <span className="text-muted-foreground">Bản đồ tự động cập nhật mỗi lần xuất bản.</span>
            <RefreshButton />
          </span>
        </CardContent>
      </Card>

      {/* Quick actions — one-stop launcher to every admin operation */}
      <section>
        <div className="mb-1 flex items-center gap-2">
          <Zap className="h-4 w-4 text-gold" aria-hidden />
          <h2 className="font-heading text-lg text-foreground">Hành động nhanh</h2>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Mọi thao tác admin trong một chỗ — bấm để tới đúng trang xử lý (có xác nhận + phân quyền).
          <span className="ml-1 inline-flex items-center gap-1 align-middle">
            <Lock className="h-3 w-3 text-red-500" aria-hidden />
            <span className="text-red-500/90">= chỉ chủ (owner)</span>
          </span>
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </div>
                <ul className="space-y-1.5">
                  {group.actions.map((a) => (
                    <li key={a.href + a.name}>
                      <Link
                        href={a.href}
                        className="group flex items-start gap-1.5 rounded px-1 py-0.5 -mx-1 hover:bg-gold/[0.05]"
                      >
                        <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground group-hover:text-gold" aria-hidden />
                        <span className="min-w-0">
                          <span className="text-xs font-medium text-foreground">{a.name}</span>
                          {a.owner && <Lock className="ml-1 inline h-3 w-3 align-text-top text-red-500" aria-hidden />}
                          <span className="block text-[11px] leading-snug text-muted-foreground">{a.does}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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
                      <span>{linkifyAdminPaths(step)}</span>
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
                        <span>{linkifyAdminPaths(step)}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Scheduled operations — the worker cron autopilot */}
      <section>
        <div className="mb-1 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gold" aria-hidden />
          <h2 className="font-heading text-lg text-foreground">Tác vụ định kỳ</h2>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Worker tự chạy theo lịch — đây là "chế độ lái tự động" của hệ thống. Mỗi việc báo về một
          chủ đề Telegram tương ứng.
        </p>
        <div className="grid gap-3 lg:grid-cols-2">
          {SCHEDULED_OPS.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{group.schedule}</span>
                  <span className="rounded bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {group.cron}
                  </span>
                </div>
                {group.historyKey && (
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span>Lần chạy gần nhất:</span>
                    <LastRun runs={cronHistory[group.historyKey]} />
                  </div>
                )}
                <ul className="space-y-1.5 border-t border-border/50 pt-2">
                  {group.ops.map((op) => (
                    <li key={op.fn} className="flex items-start justify-between gap-2 text-xs text-foreground/85">
                      <span className="min-w-0">
                        <span className="font-medium text-foreground">{op.name}</span>
                        {op.topic && (
                          <span className="ml-1.5 rounded bg-gold/10 px-1 py-px font-mono text-[9px] text-gold">
                            {op.topic}
                          </span>
                        )}
                        <span className="text-muted-foreground"> — {op.does}</span>
                      </span>
                      {group.runnable && <RunJobButton job={op.fn} />}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Permissions / safety model */}
      <section>
        <div className="mb-1 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
          <h2 className="font-heading text-lg text-foreground">Phân quyền &amp; hành động nhạy cảm</h2>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Ai được làm gì — và những việc nguy hiểm nhất chỉ <span className="font-medium text-foreground">chủ
          (owner)</span> mới chạm được. Gác ngay tại cổng admin-proxy theo từng route.
        </p>
        <div className="grid gap-3 lg:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 text-sm font-medium text-foreground">Bậc quyền</div>
              <ul className="space-y-2 border-t border-border/50 pt-2">
                {RBAC_ROLES.map((r) => (
                  <li key={r.role} className="flex gap-2 text-xs">
                    <span className="shrink-0 rounded bg-gold/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-gold">
                      {r.role}
                    </span>
                    <span className="text-muted-foreground">{r.can}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-red-500/25">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Lock className="h-3.5 w-3.5 text-red-500" aria-hidden /> Chỉ owner (nguy hiểm)
              </div>
              <ul className="space-y-1.5 border-t border-border/50 pt-2">
                {OWNER_ONLY_ACTIONS.map((a) => (
                  <li key={a.path} className="text-xs">
                    <span className="font-medium text-foreground">{a.name}</span>
                    <span className="ml-1.5 font-mono text-[9px] text-muted-foreground">{a.path}</span>
                    <span className="text-muted-foreground"> — {a.why}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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

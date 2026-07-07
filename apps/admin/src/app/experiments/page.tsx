/**
 * Wave 61.11 — A/B testing & feature flag admin page (Vietnamese, full info).
 *
 * Trang quản trị feature flag PostHog của hieu.asia. Tất cả label tiếng Việt
 * theo yêu cầu founder. Hiển thị đầy đủ thông tin: tags, rollout %, variants
 * (multivariate), lần đánh giá gần nhất, trạng thái lifecycle, số nhóm release
 * condition.
 *
 * Server component — đọc qua `fetchPostHogFeatureFlags` (POSTHOG_PERSONAL_API_KEY
 * server-only). 60s revalidate; founder edit trực tiếp trên PostHog dashboard
 * (link "Sửa trên PostHog" per row).
 *
 * Bugs đã fix so với Wave 61.07:
 *   - Toàn bộ chữ tiếng Anh chuyển sang tiếng Việt.
 *   - Hiển thị `last_called_at`, `tags`, `created_at`, `updated_at`.
 *   - Variants multivariate hiển thị badge stacked (không gộp 1 dòng).
 *   - Rollout % colour-coded (xám 0%, vàng 1-99%, xanh 100%).
 *   - Khi flag có >1 release-condition group, hiển thị "+N nhóm khác".
 *   - Summary header ở trên: tổng số flag, active, multivariate, mới đánh
 *     giá trong 24h.
 *   - Thêm chú thích về cache 60s + timestamp lần fetch.
 */

import {
  FlaskConical,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Tag,
  GitBranch,
  Activity,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import {
  fetchPostHogFeatureFlags,
  fetchVariantConversions,
  fetchPostHogExperiments,
  isPostHogServerConfigured,
  type PostHogFlag,
} from '@/lib/posthog-server';
import ExperimentResultsPanel from '@/components/admin/analytics/ExperimentResultsPanel';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_POSTHOG_DASHBOARD_URL;

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata = {
  title: 'A/B Testing · hieu.asia admin',
  description: 'Danh sách feature flag PostHog + rollout % + thông tin chi tiết',
};

// ───────────────────────────────────────────────────────────────────────────
// Helpers (format)
// ───────────────────────────────────────────────────────────────────────────

function rolloutColor(pct: number, isMultivariate: boolean): string {
  if (isMultivariate) return 'text-foreground';
  if (pct >= 100) return 'text-emerald-500';
  if (pct > 0) return 'text-amber-500';
  return 'text-muted-foreground';
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

function formatRelative(iso: string | null): string {
  if (!iso) return 'Chưa từng';
  try {
    const ms = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(ms / 60_000);
    if (minutes < 1) return 'vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    return formatDate(iso);
  } catch {
    return formatDate(iso);
  }
}

function isRecentlyCalled(iso: string | null): boolean {
  if (!iso) return false;
  try {
    return Date.now() - new Date(iso).getTime() < 24 * 3600 * 1000;
  } catch {
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────────

function FlagRow({
  flag,
  conv,
}: {
  flag: PostHogFlag;
  conv?: Map<string, { exposed: number; converted: number }>;
}) {
  const rollout = flag.rollout_percentage ?? 0;
  const recentlyCalled = isRecentlyCalled(flag.last_called_at);

  return (
    <article className="border-b border-border/40 px-4 py-5 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {flag.active ? (
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-emerald-500"
                aria-label="Đang bật"
              />
            ) : (
              <XCircle
                className="h-4 w-4 shrink-0 text-muted-foreground"
                aria-label="Đã tắt"
              />
            )}
            <h3 className="font-medium text-foreground">{flag.name}</h3>
          </div>
          <code className="mt-1 block font-mono text-xs text-muted-foreground">
            {flag.key}
          </code>

          {/* Tags */}
          {flag.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Tag className="h-3 w-3 text-muted-foreground" aria-hidden />
              {flag.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-gold/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sửa trên PostHog */}
        {DASHBOARD_URL && (
          <a
            href={`${DASHBOARD_URL}/feature_flags/${flag.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
          >
            Sửa trên PostHog <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        )}
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Rollout
          </div>
          <div
            className={`mt-1 font-mono text-lg font-semibold ${rolloutColor(rollout, flag.is_multivariate)}`}
          >
            {flag.is_multivariate ? '—' : `${rollout}%`}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Loại
          </div>
          <div className="mt-1 text-sm text-foreground">
            {flag.is_multivariate ? 'Multivariate' : 'Boolean'}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Trạng thái
          </div>
          <div className="mt-1 text-sm text-foreground">
            {flag.active ? (
              <span className="text-emerald-500">Đang bật</span>
            ) : (
              <span className="text-muted-foreground">Đã tắt</span>
            )}
            {flag.group_count > 1 && (
              <span className="ml-1 text-xs text-muted-foreground">
                · {flag.group_count} nhóm
              </span>
            )}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Đánh giá gần nhất
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm">
            {recentlyCalled && (
              <Activity
                className="h-3.5 w-3.5 text-emerald-500"
                aria-label="Có traffic trong 24h"
              />
            )}
            <span className={recentlyCalled ? 'text-foreground' : 'text-muted-foreground'}>
              {formatRelative(flag.last_called_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Variants */}
      {flag.is_multivariate && flag.variants && flag.variants.length > 0 && (
        <div className="mt-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Variant breakdown · <span className="text-emerald-400">xanh</span> = % người thấy biến thể rồi trả tiền (30d)
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {flag.variants.map((v) => {
              const c = conv?.get(v.key);
              const rate = c && c.exposed > 0 ? c.converted / c.exposed : null;
              return (
                <span
                  key={v.key}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2 py-1 text-xs"
                >
                  <code className="font-mono text-foreground">{v.key}</code>
                  <span className="font-mono text-muted-foreground">
                    {v.rollout_percentage}%
                  </span>
                  {rate !== null && (
                    <span
                      className="font-mono text-emerald-400"
                      title={`${c!.converted}/${c!.exposed} người thấy biến thể này rồi trả tiền (30 ngày) — tương quan, không phải significance`}
                    >
                      · {(rate * 100).toFixed(0)}% 💰
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Created / updated dates */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden />
          Tạo: {formatDate(flag.created_at)}
        </span>
        <span>·</span>
        <span>Cập nhật: {formatDate(flag.updated_at)}</span>
        {flag.evaluation_runtime !== 'all' && (
          <>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <GitBranch className="h-3 w-3" aria-hidden />
              Runtime: {flag.evaluation_runtime}
            </span>
          </>
        )}
      </div>
    </article>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────────

export default async function ExperimentsPage() {
  const configured = isPostHogServerConfigured();
  const [flags, variantConv, experiments] = configured
    ? await Promise.all([
        fetchPostHogFeatureFlags(),
        fetchVariantConversions(),
        fetchPostHogExperiments(),
      ])
    : [null, null, null];
  // Lookup: flag key → variant key → { exposed, converted } (last 30 days).
  const convByFlag = new Map<string, Map<string, { exposed: number; converted: number }>>();
  for (const r of variantConv ?? []) {
    if (!convByFlag.has(r.flag)) convByFlag.set(r.flag, new Map());
    convByFlag.get(r.flag)!.set(r.variant, { exposed: r.exposed, converted: r.converted });
  }
  // Flag key → last evaluation timestamp, so the experiment panel can tell
  // "flag never called" (pure traffic gap) apart from "called but 0 bucketed
  // exposures" (likely a wiring/config gap).
  const lastCalledByFlag = new Map<string, string | null>(
    (flags ?? []).map((f) => [f.key, f.last_called_at]),
  );
  const fetchedAt = new Date();

  // Summary stats (only when we have data)
  const stats = flags
    ? {
        total: flags.length,
        active: flags.filter((f) => f.active).length,
        multivariate: flags.filter((f) => f.is_multivariate).length,
        recentlyEvaluated: flags.filter((f) => isRecentlyCalled(f.last_called_at))
          .length,
      }
    : null;

  // Sort: active first, then recently evaluated, then by created date desc
  const sorted = flags
    ? [...flags].sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1;
        const aRecent = isRecentlyCalled(a.last_called_at) ? 1 : 0;
        const bRecent = isRecentlyCalled(b.last_called_at) ? 1 : 0;
        if (aRecent !== bRecent) return bRecent - aRecent;
        return (b.created_at ?? '').localeCompare(a.created_at ?? '');
      })
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<FlaskConical className="h-5 w-5" aria-hidden />}
        title="A/B Testing — Feature Flags"
        description="Cờ PostHog — A/B phía NGƯỜI DÙNG (client-eval) + rollout % + đánh giá gần nhất. Read-only audit; founder chỉnh trực tiếp trên PostHog dashboard. (Khác cờ phía server / Worker KV ở /feature-flags.)"
      />

      {!configured && (
        <div className="mt-8 rounded-card-editorial border border-amber-500/40 bg-amber-500/5 p-6 text-sm text-foreground">
          <p>
            <strong>POSTHOG_PERSONAL_API_KEY</strong> chưa được cấu hình trong
            Vercel admin project. Sau khi set env var, deploy lại admin → trang
            này sẽ hiện flag roster.
          </p>
        </div>
      )}

      {configured && flags === null && (
        <div className="mt-8 rounded-card-editorial border border-red-500/40 bg-red-500/5 p-6 text-sm text-foreground">
          <p>
            Lỗi tạm thời khi gọi PostHog REST API. Có thể do:{' '}
            <code className="font-mono">POSTHOG_PERSONAL_API_KEY</code> sai/hết
            hạn, hoặc PostHog đang downtime. Kiểm tra Sentry để biết chi tiết.
          </p>
        </div>
      )}

      {/* P1 — A/B experiment results, shown above the raw flag roster. */}
      <ExperimentResultsPanel
        experiments={experiments}
        convByFlag={convByFlag}
        lastCalledByFlag={lastCalledByFlag}
        dashboardUrl={DASHBOARD_URL}
      />

      {configured && (
        <div className="mt-10 flex flex-wrap items-baseline gap-2 border-t border-border/60 pt-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Feature Flags
          </h2>
          <span className="text-xs text-muted-foreground">
            công tắc tính năng — gồm cả các cờ được thử nghiệm ở trên
          </span>
        </div>
      )}

      {configured && flags !== null && flags.length === 0 && (
        <div className="mt-8 rounded-card-editorial border border-border bg-card p-6 text-sm text-muted-foreground">
          <p>
            Chưa có feature flag nào trong project. Tạo flag tại{' '}
            <a
              href={
                DASHBOARD_URL
                  ? `${DASHBOARD_URL}/feature_flags`
                  : 'https://us.posthog.com/'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline"
            >
              PostHog dashboard
            </a>{' '}
            → Feature Flags → New Flag.
          </p>
        </div>
      )}

      {/* Summary stats */}
      {stats && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-card-editorial border border-border bg-card p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Tổng flag
            </div>
            <div className="mt-1 font-heading text-2xl font-semibold text-foreground">
              {stats.total}
            </div>
          </div>
          <div className="rounded-card-editorial border border-border bg-card p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Đang bật
            </div>
            <div className="mt-1 font-heading text-2xl font-semibold text-emerald-500">
              {stats.active}
            </div>
          </div>
          <div className="rounded-card-editorial border border-border bg-card p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Multivariate
            </div>
            <div className="mt-1 font-heading text-2xl font-semibold text-foreground">
              {stats.multivariate}
            </div>
          </div>
          <div className="rounded-card-editorial border border-border bg-card p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Có traffic 24h
            </div>
            <div className="mt-1 font-heading text-2xl font-semibold text-foreground">
              {stats.recentlyEvaluated}
            </div>
          </div>
        </div>
      )}

      {/* Flag list */}
      {sorted && sorted.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-card-editorial border border-border bg-card">
          {sorted.map((f) => (
            <FlagRow key={f.id} flag={f} conv={convByFlag.get(f.key)} />
          ))}
        </div>
      )}

      <div className="mt-8 space-y-2 text-xs text-muted-foreground">
        <p>
          <strong>Cache:</strong> dữ liệu fetch từ PostHog mỗi 60 giây
          (server-side ISR). Nếu vừa update rollout trên PostHog dashboard, đợi
          ~1 phút rồi reload trang để thấy số mới. Lần fetch gần nhất:{' '}
          <code className="font-mono">
            {fetchedAt.toLocaleString('vi-VN')}
          </code>
          .
        </p>
        <p>
          <strong>Founder action:</strong> click "Sửa trên PostHog" để mở flag
          trực tiếp trên dashboard → chỉnh rollout % / variant split → Save.
          Cohort sẽ phân nhánh ngay; site không cần redeploy. Đối với A/B test,
          giữ rollout 50% trong ≥ 1 tuần để có statistical power.
        </p>
        <p>
          <strong>Icon legend:</strong>{' '}
          <CheckCircle2 className="inline h-3 w-3 text-emerald-500" aria-hidden />{' '}
          flag bật ·{' '}
          <XCircle className="inline h-3 w-3 text-muted-foreground" aria-hidden />{' '}
          flag tắt ·{' '}
          <Activity className="inline h-3 w-3 text-emerald-500" aria-hidden />{' '}
          có traffic trong 24h ·{' '}
          <Tag className="inline h-3 w-3" aria-hidden /> tags từ PostHog.
        </p>
      </div>
    </div>
  );
}

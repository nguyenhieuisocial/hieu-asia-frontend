/**
 * P1 — A/B experiment results panel for /experiments.
 *
 * Surfaces the formal PostHog Experiment entities (the actual A/B tests) that
 * the page previously hid behind the raw feature-flag roster. For each
 * experiment it cross-references the linked flag against the page's existing
 * per-variant conversion read (fetchVariantConversions, 30d, payment-based) to
 * show exposure + conversion, and gives an honest readiness verdict:
 *   - 0 exposures            → "chưa có dữ liệu" (test running but learning nothing)
 *   - <30 exposures          → "quá ít dữ liệu"
 *   - enough                 → leading variant by conversion rate (trend only)
 *
 * Rigorous Bayesian significance stays in PostHog — every card links out.
 * Server component (no client state); colours use the light-safe
 * `text-*-700 dark:text-*-200` pattern.
 */

import { Beaker, ExternalLink, AlertTriangle, Trophy, Clock3 } from 'lucide-react';
import type { PostHogExperiment } from '@/lib/posthog-server';

type VariantConv = { exposed: number; converted: number };
type ConvByFlag = Map<string, Map<string, VariantConv>>;

/** Below this many total exposures we refuse to call a winner. */
const MIN_FOR_VERDICT = 30;

interface VariantStat {
  variant: string;
  exposed: number;
  converted: number;
  rate: number;
}

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.floor(ms / 86_400_000));
}

/** Plain-Vietnamese "last called" label for a flag's last_called_at. */
function agoLabel(iso: string | null): string {
  const dd = daysSince(iso);
  if (dd === null) return 'chưa từng';
  if (dd === 0) return 'hôm nay';
  return `${dd} ngày trước`;
}

function statusLabel(status: string): string {
  switch (status) {
    case 'running':
      return 'Đang chạy';
    case 'draft':
      return 'Nháp';
    case 'paused':
      return 'Tạm dừng';
    case 'stopped':
    case 'complete':
      return 'Đã dừng';
    default:
      return status;
  }
}

function buildStats(map: Map<string, VariantConv> | undefined): VariantStat[] {
  if (!map) return [];
  return [...map.entries()]
    .map(([variant, v]) => ({
      variant,
      exposed: v.exposed,
      converted: v.converted,
      rate: v.exposed > 0 ? v.converted / v.exposed : 0,
    }))
    .sort((a, b) => b.exposed - a.exposed);
}

/** A flag that only ever returns true/false isn't emitting named variants —
 *  so PostHog can't bucket exposures into the experiment. Worth flagging. */
function looksBoolean(stats: VariantStat[]): boolean {
  return (
    stats.length > 0 &&
    stats.every((s) => s.variant === 'true' || s.variant === 'false')
  );
}

function ExperimentCard({
  exp,
  stats,
  lastCalled,
  dashboardUrl,
}: {
  exp: PostHogExperiment;
  stats: VariantStat[];
  /** Linked flag's last evaluation timestamp (null = never called). */
  lastCalled: string | null;
  dashboardUrl?: string;
}) {
  const totalExposed = stats.reduce((s, v) => s + v.exposed, 0);
  const d = daysSince(exp.startDate);
  const isBool = looksBoolean(stats);

  // Honest readiness verdict.
  let tone: 'amber' | 'jade' = 'amber';
  let title: string;
  let detail: string;
  if (totalExposed === 0) {
    title = '⏳ Chưa có dữ liệu phân nhóm';
    const ran =
      exp.status === 'running' && d !== null
        ? `Chạy ${d} ngày`
        : statusLabel(exp.status);
    detail =
      lastCalled == null
        ? `${ran} nhưng cờ chưa từng được gọi lần nào → chưa người dùng nào kích hoạt (thiếu traffic, hoặc cờ chưa nối vào trang). Có lượt đầu tiên là dữ liệu bắt đầu chảy.`
        : `${ran} nhưng 0 lượt phơi nhiễm vào biến thể trong 30 ngày (cờ gọi lần cuối ${agoLabel(lastCalled)}) → khả năng trang chưa đọc đúng biến thể, hoặc traffic quá ít.`;
  } else if (totalExposed < MIN_FOR_VERDICT) {
    title = `📊 Quá ít dữ liệu — ${totalExposed} lượt`;
    detail =
      'Chưa thể kết luận biến thể nào tốt hơn; cần thêm người dùng được phân nhóm.';
  } else {
    const leader = [...stats].sort((a, b) => b.rate - a.rate)[0];
    tone = 'jade';
    title = `Biến thể "${leader?.variant ?? '—'}" đang dẫn — ${((leader?.rate ?? 0) * 100).toFixed(1)}% chuyển đổi`;
    detail =
      'Tín hiệu xu hướng (tương quan). Mở PostHog để xem xác suất thắng & mức ý nghĩa thống kê.';
  }

  const toneClasses =
    tone === 'jade'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
      : 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-200';

  return (
    <article className="rounded-card-editorial border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                exp.status === 'running'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {statusLabel(exp.status)}
            </span>
            <h3 className="min-w-0 font-medium text-foreground">{exp.name}</h3>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <code className="font-mono">{exp.flagKey}</code>
            {d !== null && (
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3 w-3" aria-hidden />
                {d} ngày
              </span>
            )}
            {exp.primaryMetricName && <span>Chỉ số chính: {exp.primaryMetricName}</span>}
          </div>
        </div>

        {dashboardUrl && (
          <a
            href={`${dashboardUrl}/experiments/${exp.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
          >
            Xem trên PostHog <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        )}
      </div>

      {/* Verdict */}
      <div
        className={`mt-4 flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${toneClasses}`}
      >
        {tone === 'jade' ? (
          <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        ) : (
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        )}
        <span>
          <strong className="font-semibold">{title}</strong> — {detail}
        </span>
      </div>

      {/* Per-variant breakdown */}
      {stats.length > 0 && (
        <div className="mt-3 overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Biến thể</th>
                <th className="px-3 py-2 text-right font-medium">Phơi nhiễm</th>
                <th className="px-3 py-2 text-right font-medium">Thanh toán</th>
                <th className="px-3 py-2 text-right font-medium">Tỉ lệ</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.variant} className="border-t border-border/60">
                  <td className="px-3 py-2">
                    <code className="font-mono text-foreground">{s.variant}</code>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {s.exposed.toLocaleString('vi-VN')}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {s.converted.toLocaleString('vi-VN')}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {(s.rate * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Boolean-flag diagnostic — explains 0 PostHog samples. */}
      {isBool && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            Cờ đang trả <code className="font-mono">true/false</code> thay vì biến thể
            đã đặt tên — nên PostHog không gom được mẫu cho thử nghiệm này. Kiểm tra
            cấu hình cờ (multivariate) trên PostHog.
          </span>
        </p>
      )}
    </article>
  );
}

export default function ExperimentResultsPanel({
  experiments,
  convByFlag,
  lastCalledByFlag,
  dashboardUrl,
}: {
  experiments: PostHogExperiment[] | null;
  convByFlag: ConvByFlag;
  /** Flag key → last_called_at, to explain *why* an experiment has 0 data. */
  lastCalledByFlag?: Map<string, string | null>;
  dashboardUrl?: string;
}) {
  // null = PostHog down / not configured; the flag roster already shows that
  // warning, so render nothing here to avoid duplicate banners.
  if (!experiments) return null;

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <Beaker className="h-5 w-5 text-gold" aria-hidden />
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Thử nghiệm A/B đang chạy
        </h2>
      </div>

      {experiments.length === 0 ? (
        <div className="rounded-card-editorial border border-border bg-card p-6 text-sm text-muted-foreground">
          Chưa có thử nghiệm A/B (PostHog Experiment) nào. Tạo trên PostHog dashboard →
          Experiments. Các cờ A/B rời nằm ở danh sách bên dưới.
        </div>
      ) : (
        <div className="space-y-4">
          {experiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              exp={exp}
              stats={buildStats(convByFlag.get(exp.flagKey))}
              lastCalled={lastCalledByFlag?.get(exp.flagKey) ?? null}
              dashboardUrl={dashboardUrl}
            />
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Phơi nhiễm &amp; chuyển đổi đo trong 30 ngày gần nhất (chuyển đổi = đã thanh
        toán). Đây là tín hiệu xu hướng — kiểm định ý nghĩa thống kê (xác suất thắng)
        xem trực tiếp trên PostHog.
      </p>
    </section>
  );
}

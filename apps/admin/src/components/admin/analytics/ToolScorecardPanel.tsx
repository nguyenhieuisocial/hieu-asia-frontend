/**
 * Bảng điểm công cụ — tool-health scorecard.
 *
 * A richer view of the SAME `tool_used` data the OverviewPanel renders as a
 * flat top-15 list. Where that list answers "which tools are busiest", this
 * scorecard ranks EVERY tool by a composite health score so the founder can
 * decide, at a glance, which tools to PROMOTE (high conversion) vs. FIX
 * (high traffic but low conversion / high error = UX debt).
 *
 * Server component — `fetchTopTools(limit)` reads PostHog via the server-only
 * HogQL client. Returns null on any failure → em-dash / EmptyState; PostHog
 * downtime never crashes the page.
 *
 * Sorting is server-driven (no client JS): the panel reads `?stcol=` /
 * `?stdir=` from the URL and re-renders, matching the page's server-host
 * pattern (the tab bar is plain <Link>s too). Default sort = composite score
 * desc.
 *
 * Composite "điểm sức khoẻ" (0–100): rewards reach + conversion, penalises
 * errors. Each tool is scored RELATIVE to the busiest tool in the window
 * (log-scaled reach) so a brand-new low-traffic site still produces a usable
 * ranking instead of everything collapsing to ~0.
 *   reachScore  = ln(1 + users)   / ln(1 + maxUsers)        → 0..1
 *   convScore   = conversionRate                            → 0..1
 *   errorScore  = 1 - errorRate                             → 0..1
 *   health = 100 * (0.40*reach + 0.45*conv + 0.15*errorOK)
 * Conversion is weighted highest — that's the deepen-first signal (which tools
 * sit on the path to paying customers), reach second, errors a smaller
 * penalty. Correlation, not causation (a paying user may touch several tools).
 */

import Link from 'next/link';
import { Gauge, ArrowUp, ArrowDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { fetchTopTools, type ToolUsageRow } from '@/lib/posthog-server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

// ─── Scoring ────────────────────────────────────────────────────────────────

interface ScoredTool extends ToolUsageRow {
  /** Composite health 0–100. */
  health: number;
}

function scoreTools(rows: ToolUsageRow[]): ScoredTool[] {
  const maxUsers = rows.reduce((m, r) => Math.max(m, r.users), 0);
  const reachDenom = Math.log1p(maxUsers) || 1; // avoid /0 when maxUsers = 0
  return rows.map((r) => {
    const reach = Math.log1p(r.users) / reachDenom; // 0..1, log-scaled
    const conv = Math.max(0, Math.min(1, r.conversionRate));
    const errorOk = 1 - Math.max(0, Math.min(1, r.errorRate));
    const health = 100 * (0.4 * reach + 0.45 * conv + 0.15 * errorOk);
    return { ...r, health };
  });
}

// ─── Sorting (server-driven via URL) ─────────────────────────────────────────

const SORT_COLUMNS = {
  tool: (r: ScoredTool) => r.tool,
  uses: (r: ScoredTool) => r.uses,
  users: (r: ScoredTool) => r.users,
  conversionRate: (r: ScoredTool) => r.conversionRate,
  errorRate: (r: ScoredTool) => r.errorRate,
  health: (r: ScoredTool) => r.health,
} as const;

type SortCol = keyof typeof SORT_COLUMNS;
type SortDir = 'asc' | 'desc';

function isSortCol(v: string | undefined): v is SortCol {
  return !!v && v in SORT_COLUMNS;
}

function sortRows(rows: ScoredTool[], col: SortCol, dir: SortDir): ScoredTool[] {
  const get = SORT_COLUMNS[col];
  const sign = dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = get(a);
    const bv = get(b);
    if (typeof av === 'string' && typeof bv === 'string') {
      return sign * av.localeCompare(bv, 'vi');
    }
    return sign * ((av as number) - (bv as number));
  });
}

// ─── Formatting ──────────────────────────────────────────────────────────────

function fmtNum(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

function pct(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

/** Conversion colour: green when it converts, amber when traffic isn't paying. */
function convClass(rate: number): string {
  if (rate >= 0.1) return 'text-emerald-600 dark:text-emerald-400';
  if (rate > 0) return 'text-amber-600 dark:text-amber-400';
  return 'text-muted-foreground';
}

/** Error colour: red when meaningfully broken, amber when noticeable. */
function errorClass(rate: number): string {
  if (rate >= 0.1) return 'text-red-600 dark:text-red-400';
  if (rate > 0.02) return 'text-amber-600 dark:text-amber-400';
  return 'text-muted-foreground';
}

/** Health badge colour by band. */
function healthClass(score: number): string {
  if (score >= 60) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
  if (score >= 35) return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
  return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30';
}

// ─── Header cell (sortable <Link>) ───────────────────────────────────────────

function SortHeader({
  col,
  label,
  align,
  activeCol,
  activeDir,
}: {
  col: SortCol;
  label: string;
  align: 'left' | 'right';
  activeCol: SortCol;
  activeDir: SortDir;
}) {
  const isActive = col === activeCol;
  // Toggle direction when re-clicking the active column; otherwise default to
  // desc (the natural "best first" for the numeric health/traffic columns).
  const nextDir: SortDir = isActive && activeDir === 'desc' ? 'asc' : 'desc';
  const href = `/posthog?tab=tool-scorecard&stcol=${col}&stdir=${nextDir}`;
  return (
    <th
      className={`px-4 py-3 font-medium text-muted-foreground ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      aria-sort={isActive ? (activeDir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <Link
        href={href}
        scroll={false}
        className={`inline-flex items-center gap-1 transition-colors hover:text-foreground ${
          isActive ? 'text-foreground' : ''
        } ${align === 'right' ? 'flex-row-reverse' : ''}`}
      >
        <span>{label}</span>
        {isActive &&
          (activeDir === 'asc' ? (
            <ArrowUp className="h-3 w-3" aria-hidden />
          ) : (
            <ArrowDown className="h-3 w-3" aria-hidden />
          ))}
      </Link>
    </th>
  );
}

// ─── Panel ───────────────────────────────────────────────────────────────────

export default async function ToolScorecardPanel({
  sortCol,
  sortDir,
}: {
  sortCol?: string;
  sortDir?: string;
}) {
  const activeCol: SortCol = isSortCol(sortCol) ? sortCol : 'health';
  const activeDir: SortDir = sortDir === 'asc' ? 'asc' : 'desc';

  // Higher cap than the OverviewPanel top-15 so every tool surfaces (~20 tools).
  const rows = await fetchTopTools(100);

  const header = (
    <PageHeader
      icon={<Gauge className="h-5 w-5" aria-hidden />}
      title="Bảng điểm công cụ"
      description="Xếp hạng từng công cụ theo lưu lượng × tỉ lệ ra khách × lỗi (30 ngày) để biết nên đẩy mạnh hay sửa. Cập nhật mỗi 60 giây."
    />
  );

  if (rows === null) {
    return (
      <div className="space-y-6">
        {header}
        <div className="rounded-card-editorial border border-amber-500/40 bg-amber-500/5 p-6 text-sm text-foreground">
          PostHog không phản hồi (thiếu <code className="font-mono">POSTHOG_PERSONAL_API_KEY</code>{' '}
          hoặc lỗi mạng). Bảng điểm sẽ hiện khi kết nối được khôi phục.
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="space-y-6">
        {header}
        <EmptyState
          title="Chưa có dữ liệu công cụ"
          description="Chưa có lượt dùng công cụ nào (sự kiện tool_used) trong 30 ngày qua. Bảng điểm sẽ xuất hiện khi có khách bắt đầu dùng công cụ."
        />
      </div>
    );
  }

  const scored = scoreTools(rows);
  const sorted = sortRows(scored, activeCol, activeDir);

  // Headline read: total reach + how many tools look like UX debt (decent
  // traffic, zero paying) vs. promote-worthy (converting).
  const totalUsers = scored.reduce((s, r) => s + r.users, 0);
  const debtCount = scored.filter((r) => r.users >= 3 && r.conversionRate === 0).length;
  const promoteCount = scored.filter((r) => r.conversionRate >= 0.1).length;

  return (
    <div className="space-y-6">
      {header}

      {/* Headline chips */}
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-card px-3 py-1 text-xs text-muted-foreground">
          <Gauge className="h-3.5 w-3.5 text-gold/80" aria-hidden />
          {scored.length} công cụ · {fmtNum(totalUsers)} lượt người dùng
        </span>
        {promoteCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            {promoteCount} nên đẩy mạnh (ra khách ≥ 10%)
          </span>
        )}
        {debtCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            {debtCount} nợ trải nghiệm (có khách dùng, chưa ra tiền)
          </span>
        )}
      </div>

      {/* Scorecard matrix */}
      <div className="overflow-x-auto rounded-card-editorial border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <SortHeader col="tool" label="Công cụ" align="left" activeCol={activeCol} activeDir={activeDir} />
              <SortHeader col="uses" label="Lượt dùng" align="right" activeCol={activeCol} activeDir={activeDir} />
              <SortHeader col="users" label="Người dùng" align="right" activeCol={activeCol} activeDir={activeDir} />
              <SortHeader col="conversionRate" label="Tỉ lệ ra khách" align="right" activeCol={activeCol} activeDir={activeDir} />
              <SortHeader col="errorRate" label="Tỉ lệ lỗi" align="right" activeCol={activeCol} activeDir={activeDir} />
              <SortHeader col="health" label="Điểm sức khoẻ" align="right" activeCol={activeCol} activeDir={activeDir} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.tool} className="border-b border-border/40 last:border-0">
                <td className="px-4 py-3">
                  <code className="font-mono text-foreground">{r.tool}</code>
                </td>
                <td className="px-4 py-3 text-right text-foreground">{fmtNum(r.uses)}</td>
                <td className="px-4 py-3 text-right text-foreground">{fmtNum(r.users)}</td>
                <td
                  className={`px-4 py-3 text-right font-mono ${convClass(r.conversionRate)}`}
                  title={`${r.paidUsers}/${r.users} người dùng công cụ này rồi trả tiền (30 ngày)`}
                >
                  {pct(r.conversionRate)}
                </td>
                <td className={`px-4 py-3 text-right font-mono ${errorClass(r.errorRate)}`}>
                  {pct(r.errorRate)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-flex min-w-[2.75rem] justify-center rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${healthClass(
                      r.health,
                    )}`}
                    title="Điểm sức khoẻ tổng hợp 0–100: 40% lưu lượng (log) + 45% tỉ lệ ra khách + 15% (ít lỗi)."
                  >
                    {Math.round(r.health)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Nguồn: sự kiện <code className="font-mono">tool_used</code> qua PostHog HogQL (30 ngày). Tỉ lệ
        ra khách = số người dùng công cụ rồi trả tiền / tổng người dùng công cụ (tương quan, không phải
        nhân quả — một khách có thể chạm nhiều công cụ). Tỉ lệ lỗi ={' '}
        <code className="font-mono">result = &apos;error&apos;</code> / tổng lượt. Điểm sức khoẻ tổng hợp:
        40% lưu lượng (thang log so với công cụ đông nhất) + 45% tỉ lệ ra khách + 15% ít lỗi. Bấm tiêu đề
        cột để đổi cách sắp xếp.
      </p>
    </div>
  );
}

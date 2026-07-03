'use client';

/**
 * /feedback — user feedback inbox.
 *
 * Wave 60.81.C Tier 3 polish batch 2. Scaffolded route — surfaces
 * end-user feedback submitted via the reading-result modal (Wave 60.20),
 * pricing CTA exit-intent (Wave 60.77), and the onboarding survey
 * (Wave 60.22). Each row has rating + tag + free-text + status.
 *
 * Data source:
 *   GET  /api/admin-proxy/admin/feedback?limit=100
 *   POST /api/admin-proxy/admin/feedback/:id/resolve
 *
 * Worker endpoint /admin/feedback is shipped (Wave 60.82). No mock fallback:
 * on error we surface an ErrorBlock, on empty we show a real empty state.
 */

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, cn, Input, toast } from '@hieu-asia/ui';
import { MessageSquare, Star, AlertTriangle, CheckCircle2, Check, Search } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { ErrorBlock } from '@/components/admin/error-block';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { ContactCustomerDialog } from '@/components/admin/ContactCustomerDialog';
import { FeedbackCharts } from '@/components/feedback/FeedbackCharts';
import { SavedFiltersMenu } from '@/components/admin/SavedFiltersMenu';
import { useSavedFilters } from '@/lib/saved-filters';
import { fmtDateTime } from '@/lib/format';

type FeedbackStatus = 'new' | 'triaged' | 'resolved';
type FeedbackSurface = 'reading' | 'pricing' | 'onboarding' | 'misc';

interface Feedback {
  id: string;
  ts: string;
  user_email: string;
  surface: FeedbackSurface;
  rating: number | null; // 1-5; null if not provided
  message: string;
  status: FeedbackStatus;
}

const SURFACE_LABEL: Record<FeedbackSurface, string> = {
  reading: 'Báo cáo',
  pricing: 'Giá / CTA',
  onboarding: 'Onboarding',
  misc: 'Khác',
};

const STATUS_CLASS: Record<FeedbackStatus, string> = {
  new: 'border-gold/40 bg-gold/10 text-gold',
  triaged: 'border-warn-500/40 bg-warn-500/10 text-warn-700 dark:text-warn-300',
  resolved: 'border-jade-300/40 bg-jade-500/15 text-jade-700 dark:text-jade-300',
};

function Stars({ value }: { value: number | null }) {
  if (value == null) {
    return <span className="font-mono text-[10px] text-muted-foreground">không rating</span>;
  }
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value}/5 sao`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3 w-3',
            i < value ? 'fill-gold text-gold' : 'text-muted-foreground/40',
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

export default function FeedbackPage() {
  const qc = useQueryClient();

  // /admin/feedback is shipped (Wave 60.82). No mock fallback — throw on any
  // hiccup so the page shows a real ErrorBlock instead of fake-looking rows.
  const list = useQuery({
    queryKey: ['admin', 'feedback'],
    queryFn: async (): Promise<{ rows: Feedback[] }> => {
      const r = await fetch('/api/admin-proxy/admin/feedback?limit=100', { cache: 'no-store' });
      if (!r.ok) throw new Error(`Không tải được phản hồi (HTTP ${r.status})`);
      const data = (await r.json()) as { ok?: boolean; rows?: Feedback[]; error?: string };
      if (data.ok === false) throw new Error(data.error ?? 'feedback query failed');
      return { rows: data.rows ?? [] };
    },
    staleTime: 60_000,
  });

  const resolveMut = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/admin-proxy/admin/feedback/${encodeURIComponent(id)}/resolve`, {
        method: 'POST',
      });
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!r.ok || data.ok === false) {
        throw new Error(data.error ?? `HTTP ${r.status}`);
      }
      return data;
    },
    onSuccess: () => {
      toast.success('Đã đánh dấu resolved');
      qc.invalidateQueries({ queryKey: ['admin', 'feedback'] });
    },
    onError: (e) => toast.error('Resolve thất bại', { description: (e as Error).message }),
  });

  const rows = list.data?.rows ?? [];
  const newCount = rows.filter((r) => r.status === 'new').length;
  const triagedCount = rows.filter((r) => r.status === 'triaged').length;
  const resolvedCount = rows.filter((r) => r.status === 'resolved').length;
  const withRating = rows.filter((r) => r.rating != null);
  const avgRating =
    withRating.length > 0
      ? withRating.reduce((s, r) => s + (r.rating ?? 0), 0) / withRating.length
      : null;

  // Client-side filter bar (this page previously dumped all rows unfiltered).
  // KPI cards + charts stay on the full `rows`; only the table uses `filtered`.
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | FeedbackStatus>('all');
  const [surfaceFilter, setSurfaceFilter] = React.useState<'all' | FeedbackSurface>('all');
  const savedFilters = useSavedFilters<{
    search: string;
    status: 'all' | FeedbackStatus;
    surface: 'all' | FeedbackSurface;
  }>('feedback', { search: '', status: 'all', surface: 'all' });
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (surfaceFilter !== 'all' && r.surface !== surfaceFilter) return false;
      if (q && !`${r.message} ${r.user_email}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, search, statusFilter, surfaceFilter]);

  const cols: AdminTableColumn<Feedback>[] = [
    {
      id: 'ts',
      header: 'Lúc',
      sortKey: 'ts',
      width: '130px',
      cell: (r) => <span className="font-mono text-xs text-foreground/85">{fmtDateTime(r.ts)}</span>,
    },
    {
      id: 'user',
      header: 'Người dùng',
      sortKey: 'user_email',
      width: '180px',
      hideOnMobile: true,
      cell: (r) => (
        <span className="truncate font-mono text-xs text-foreground/85" title={r.user_email}>
          {r.user_email}
        </span>
      ),
    },
    {
      id: 'surface',
      header: 'Nơi',
      sortKey: 'surface',
      width: '110px',
      cell: (r) => (
        <span className="inline-flex items-center rounded-md border border-purple/40 bg-purple/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-purple-700 dark:text-purple-50">
          {SURFACE_LABEL[r.surface]}
        </span>
      ),
    },
    {
      id: 'rating',
      header: 'Đánh giá',
      sortKey: 'rating',
      width: '110px',
      cell: (r) => <Stars value={r.rating} />,
    },
    {
      id: 'message',
      header: 'Nội dung',
      cell: (r) => (
        <span className="line-clamp-2 text-sm text-foreground/90" title={r.message}>
          {r.message}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Trạng thái',
      sortKey: 'status',
      width: '120px',
      cell: (r) => (
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
            STATUS_CLASS[r.status],
          )}
        >
          {r.status}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      width: '210px',
      // POST /admin/feedback/:id/resolve (Wave 60.82). Reversible + low-risk.
      // Already-resolved rows show a static "đã xử lý" hint instead of a button.
      // "Trả lời" reuses ContactCustomerDialog (built for /sessions/customers):
      // it pre-fills the feedback's user_email and sends a transactional email
      // via the worker's existing Resend templates — so the founder can reply
      // without leaving /feedback. The dialog self-disables its trigger when the
      // row has no usable email (e.g. Telegram-only users), so that limit is
      // handled by the component itself.
      cell: (r) => (
        <div className="flex items-center justify-end gap-2">
          <ContactCustomerDialog email={r.user_email} triggerLabel="Trả lời" />
          {r.status === 'resolved' ? (
            <span className="text-[10px] text-muted-foreground">đã xử lý</span>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => resolveMut.mutate(r.id)}
              disabled={resolveMut.isPending}
              aria-label={`Đánh dấu resolved feedback ${r.id}`}
            >
              <Check className="mr-1 h-3 w-3" />
              Resolve
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phản hồi người dùng"
        description="Feedback gửi từ báo cáo, modal pricing, onboarding. Triage thành new → triaged → resolved."
        icon={<MessageSquare className="h-5 w-5" />}
      />

      {list.isError && (
        <ErrorBlock
          title="Không tải được phản hồi"
          message={(list.error as Error).message}
          onRetry={() => list.refetch()}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Mới"
          value={newCount}
          icon={<MessageSquare className="h-4 w-4" />}
          accent={newCount > 0 ? 'gold' : 'jade'}
          hint="cần triage"
        />
        <KpiCard
          label="Đang xử lý"
          value={triagedCount}
          icon={<AlertTriangle className="h-4 w-4" />}
          accent="purple"
          hint="triaged"
        />
        <KpiCard
          label="Đã xử lý"
          value={resolvedCount}
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="jade"
          hint="resolved"
        />
        <KpiCard
          label="Trung bình rating"
          value={avgRating != null ? avgRating.toFixed(1) : '—'}
          icon={<Star className="h-4 w-4" />}
          accent="gold"
          hint={`/5 (${withRating.length} ratings)`}
        />
      </div>

      {/* Charts derived from the same fetched rows — no extra request. Hidden on
          error so we never chart a broken/empty fetch as if it were "zero". */}
      {!list.isError && <FeedbackCharts rows={rows} />}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              placeholder="Tìm nội dung / email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                ['all', 'Tất cả'],
                ['new', 'Mới'],
                ['triaged', 'Đang xử lý'],
                ['resolved', 'Đã xử lý'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  statusFilter === value
                    ? 'border-gold/60 bg-gold/15 text-gold'
                    : 'border-border bg-card/60 text-muted-foreground hover:border-gold/30 hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
            <SavedFiltersMenu
              className="ml-auto"
              presets={savedFilters.presets}
              onApply={(name) => {
                const p = savedFilters.loadPreset(name);
                if (p) {
                  setSearch(p.search);
                  setStatusFilter(p.status);
                  setSurfaceFilter(p.surface);
                }
              }}
              onDelete={savedFilters.deletePreset}
              onSave={(name) =>
                savedFilters.savePreset(name, {
                  search,
                  status: statusFilter,
                  surface: surfaceFilter,
                })
              }
              saveHint="Lưu bộ lọc hiện tại"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                ['all', 'Mọi nơi'],
                ['reading', SURFACE_LABEL.reading],
                ['pricing', SURFACE_LABEL.pricing],
                ['onboarding', SURFACE_LABEL.onboarding],
                ['misc', SURFACE_LABEL.misc],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSurfaceFilter(value)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  surfaceFilter === value
                    ? 'border-purple/60 bg-purple/15 text-purple-700 dark:text-purple-100'
                    : 'border-border bg-card/60 text-muted-foreground hover:border-purple/30 hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phản hồi</CardTitle>
          <CardDescription>
            Mới nhất ở trên. Click cột tiêu đề để sắp xếp theo thời điểm / rating / status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminTable
            rows={filtered}
            columns={cols}
            loading={list.isLoading}
            empty={
              <span className="text-sm text-muted-foreground">
                Chưa có phản hồi nào. Khi user gửi feedback, sẽ hiển thị ở đây.
              </span>
            }
            caption="Phản hồi người dùng"
          />
        </CardContent>
      </Card>
    </div>
  );
}

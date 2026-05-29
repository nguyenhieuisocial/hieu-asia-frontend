'use client';

/**
 * /feedback — user feedback inbox.
 *
 * Wave 60.81.C Tier 3 polish batch 2. Scaffolded route — surfaces
 * end-user feedback submitted via the reading-result modal (Wave 60.20),
 * pricing CTA exit-intent (Wave 60.77), and the onboarding survey
 * (Wave 60.22). Each row has rating + tag + free-text + status.
 *
 * Data source (best-effort):
 *   GET /api/admin-proxy/admin/feedback?limit=100
 *
 * Worker endpoint TBD. Mock list renders so we can dial in the visual
 * shell. Once shipped, the same AdminTable + KpiCard shape applies.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from '@hieu-asia/ui';
import { MessageSquare, Star, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';
import { MockBanner } from '@/components/mock-banner';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

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

const MOCK_FEEDBACK: Feedback[] = [
  {
    id: 'fb-001',
    ts: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user_email: 'an.le@example.com',
    surface: 'reading',
    rating: 5,
    message: 'Báo cáo rất sâu, đặc biệt là phần Psychology — đúng lo lắng của tôi.',
    status: 'new',
  },
  {
    id: 'fb-002',
    ts: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    user_email: 'minh.tran@example.com',
    surface: 'pricing',
    rating: 3,
    message: 'Gói "Cẩm nang" quá đắt so với 1 lần đọc đơn lẻ — cân nhắc lại pricing?',
    status: 'triaged',
  },
  {
    id: 'fb-003',
    ts: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    user_email: 'thu.nguyen@example.com',
    surface: 'onboarding',
    rating: 4,
    message: 'Câu hỏi "trục cuộc đời" hơi trừu tượng — cần ví dụ.',
    status: 'resolved',
  },
  {
    id: 'fb-004',
    ts: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    user_email: 'hieu@example.com',
    surface: 'reading',
    rating: null,
    message: 'Bug: cuộn ngang trên iPad mini, phần Alignment.',
    status: 'new',
  },
];

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

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function FeedbackPage() {
  const list = useQuery({
    queryKey: ['admin', 'feedback'],
    queryFn: async () => {
      try {
        const r = await fetch('/api/admin-proxy/admin/feedback?limit=100', { cache: 'no-store' });
        if (!r.ok) return { rows: MOCK_FEEDBACK, isMock: true };
        const data = (await r.json()) as { rows?: Feedback[] };
        return { rows: data.rows ?? MOCK_FEEDBACK, isMock: !data.rows };
      } catch {
        return { rows: MOCK_FEEDBACK, isMock: true };
      }
    },
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

  const cols: AdminTableColumn<Feedback>[] = [
    {
      id: 'ts',
      header: 'Lúc',
      sortKey: 'ts',
      width: '130px',
      cell: (r) => <span className="font-mono text-xs text-foreground/85">{fmtDate(r.ts)}</span>,
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
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phản hồi người dùng"
        description="Feedback gửi từ báo cáo, modal pricing, onboarding. Triage thành new → triaged → resolved."
        icon={<MessageSquare className="h-5 w-5" />}
        badge={<LiveBadge />}
      />

      <MockBanner
        source={{ isMock: list.data?.isMock ?? false, reason: 'endpoint /admin/feedback TBD' }}
      />

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

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phản hồi</CardTitle>
          <CardDescription>
            Mới nhất ở trên. Click cột tiêu đề để sắp xếp theo thời điểm / rating / status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminTable
            rows={rows}
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

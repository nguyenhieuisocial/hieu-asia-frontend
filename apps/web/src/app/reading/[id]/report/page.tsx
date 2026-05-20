'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@hieu-asia/ui';
import type {
  ReadingStatusResponse,
  StrategicActionPlan,
} from '@hieu-asia/types';
import { apiClient } from '@/lib/api';
import { MOCK_REPORT, MOCK_USER_CONTEXT } from '@/lib/mock-report';
import { CautionBanner } from '@/components/caution-banner';
import { ReportContextSummary } from '@/components/report-context-summary';
import { ReportTabs } from '@/components/report-tabs';

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const taskId = params?.id ?? '';

  const query = useQuery<ReadingStatusResponse, Error>({
    queryKey: ['reading', taskId],
    queryFn: () => apiClient.getReading(taskId),
    enabled: !!taskId,
    retry: 1,
  });
  const { data, isLoading, isError } = query;

  React.useEffect(() => {
    if (data?.status === 'running' || data?.status === 'queued') {
      router.replace(`/reading/${taskId}/processing`);
    }
  }, [data?.status, router, taskId]);

  if (isLoading) return <ReportSkeleton />;

  // Use mock fallback when API returned no structured plan
  // (V1 backend returns markdown only; structured StrategicActionPlan endpoint TBD).
  const plan: StrategicActionPlan = MOCK_REPORT;
  const isFromMock = isError || !data || data.status !== 'completed';

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-cream/60 hover:text-gold"
        >
          ← Bảng điều khiển
        </Link>
        <span className="font-heading text-lg text-gold">hieu.asia</span>
      </header>

      <div className="space-y-6">
        <ReportContextSummary
          displayName={MOCK_USER_CONTEXT.display_name}
          role={MOCK_USER_CONTEXT.role}
          primaryConcern={MOCK_USER_CONTEXT.primary_concern}
          generatedAt={new Date().toLocaleDateString('vi-VN')}
        />

        <CautionBanner flags={plan.caution_flags} />

        <ReportTabs plan={plan} readingId={taskId} />

        <ReportFooter readingId={taskId} />

        {isFromMock && (
          <p className="text-center font-mono text-xs text-cream/40">
            (Hiển thị dữ liệu mock — backend chưa trả structured plan.)
          </p>
        )}
      </div>
    </main>
  );
}

function ReportFooter({ readingId }: { readingId: string }) {
  const [copied, setCopied] = React.useState(false);

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-3 border-t border-gold/15 pt-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <Button variant="outline" onClick={() => window.print()}>
        📄 Tải PDF báo cáo
      </Button>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onShare}>
          {copied ? '✓ Đã chép link' : '🔗 Chia sẻ'}
        </Button>
        <Button asChild={false}>
          <Link href={`/reading/${readingId}/mentor`}>
            Bắt đầu chat với Mentor →
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <main className="container mx-auto max-w-6xl animate-pulse px-6 py-12">
      <div className="mb-6 h-6 w-32 rounded bg-cream/10" />
      <div className="space-y-4">
        <div className="h-28 rounded-lg bg-cream/5" />
        <div className="h-16 rounded-lg bg-cream/5" />
        <div className="h-12 rounded bg-cream/5" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-48 rounded-lg bg-cream/5" />
          <div className="h-48 rounded-lg bg-cream/5" />
        </div>
      </div>
    </main>
  );
}

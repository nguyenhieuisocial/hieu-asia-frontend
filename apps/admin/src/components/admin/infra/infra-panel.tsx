'use client';

/**
 * InfraPanel — shared shell for every "Hạ tầng" tool detail page.
 *
 * Wraps a tool's React-Query result and renders the four canonical states so
 * each `/infra/<tool>/page.tsx` only has to describe its columns:
 *   - loading        → skeleton rows
 *   - not configured → setup EmptyState ("thêm token <ENV> ở Worker")
 *   - vendor error   → ErrorBlock + retry
 *   - empty          → EmptyState ("chưa có dữ liệu")
 *   - success        → caller-rendered table of `items`
 *
 * The page passes the `InfraEnvelope` from a `getInfra<Tool>()` wrapper plus a
 * `renderTable(items)` callback. Everything else (header, back link, external
 * deep-link, refresh) is handled here so all tools look identical.
 *
 * FOLLOW-UP TOOLS: copy `/infra/vercel/page.tsx`, swap the wrapper + columns —
 * no need to touch this component.
 */

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, Skeleton } from '@hieu-asia/ui';
import { ArrowLeft, CheckCircle2, ExternalLink, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import type { InfraEnvelope } from '@/lib/admin-api';
import type { InfraTool } from '@/lib/infra-tools';

interface InfraPanelProps<T> {
  tool: InfraTool;
  query: {
    data?: InfraEnvelope<T>;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };
  /** Render the success table for the fetched items. */
  renderTable: (items: T[]) => React.ReactNode;
  /** vi-VN copy for the empty (zero-rows) state. */
  emptyTitle?: string;
  /**
   * Extra action(s) rendered in the page header, left of the refresh +
   * "Mở trang gốc" buttons (e.g. a "Gửi email thử" test button). Shown in
   * every state so operators can trigger it even when the list is empty.
   */
  headerActions?: React.ReactNode;
}

export function InfraPanel<T>({
  tool,
  query,
  renderTable,
  emptyTitle = 'Chưa có dữ liệu',
  headerActions,
}: InfraPanelProps<T>) {
  const { data, isLoading, isError } = query;
  const { Icon } = tool;

  const header = (
    <PageHeader
      icon={<Icon className="h-5 w-5" />}
      title={tool.name}
      description={tool.blurb}
      actions={
        <div className="flex items-center gap-2">
          {headerActions}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => query.refetch()}
            aria-label="Tải lại"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <a href={tool.external} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Mở trang gốc
            </Button>
          </a>
        </div>
      }
    />
  );

  const backLink = (
    <Link
      href="/infra"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Hạ tầng
    </Link>
  );

  // not configured → setup card. The worker returns { ok:false, configured:false }
  // with the exact env var to set.
  if (data && data.ok === false && data.configured === false) {
    return (
      <div className="space-y-6">
        {backLink}
        {header}
        <EmptyState
          title={`${tool.name} chưa được cấu hình`}
          description={
            <>
              Cần thêm token{' '}
              <code className="font-mono text-gold">{tool.env}</code> cho Worker để
              xem dữ liệu {tool.name}. {data.error}{' '}
              <a href="/secrets" className="text-gold hover:underline">
                Mở trang Secrets →
              </a>
            </>
          }
        />
      </div>
    );
  }

  // vendor / network error → ErrorBlock + retry.
  const vendorError =
    isError || (data && data.ok === false && data.configured === true ? data : undefined);
  if (vendorError && !isLoading) {
    const message =
      data && data.ok === false ? data.error : `Không tải được dữ liệu ${tool.name}.`;
    return (
      <div className="space-y-6">
        {backLink}
        {header}
        <ErrorBlock
          title={`Không tải được ${tool.name}`}
          message={message}
          onRetry={() => query.refetch()}
        />
      </div>
    );
  }

  const items = data && data.ok ? data.items : [];

  return (
    <div className="space-y-6">
      {backLink}
      {header}
      {isLoading ? (
        <Card>
          <CardContent className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        // Đã kết nối (data.ok) nhưng không có mục nào — đây là trạng thái BÌNH
        // THƯỜNG/KHOẺ (vd Sentry 0 lỗi), KHÔNG phải "chưa làm xong". Hiển thị rõ
        // "đã kết nối" + dấu check xanh để operator không tưởng tool hỏng/thiếu.
        <EmptyState
          title={emptyTitle}
          illustration={
            <div className="relative mx-auto h-20 w-20" aria-hidden>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-jade/20 via-jade/10 to-gold/10 blur-xl" />
              <div className="relative flex h-full w-full items-center justify-center rounded-full border border-jade/30 bg-card/60 backdrop-blur-sm">
                <CheckCircle2 className="h-9 w-9 text-jade/80" />
              </div>
            </div>
          }
          description={
            <>
              <span className="font-medium text-jade-700 dark:text-jade-50">
                ✓ {tool.name} đã kết nối
              </span>{' '}
              — không có dữ liệu nào lúc này. Mục sẽ tự hiện ở đây khi có.
            </>
          }
        />
      ) : (
        renderTable(items)
      )}
    </div>
  );
}

/**
 * Small status pill shared by tool tables. Maps a vendor state string to a
 * brand-tinted badge. Unknown states fall back to a neutral pill.
 */
export function InfraStatusPill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'good' | 'bad' | 'warn' | 'neutral';
}) {
  const tones: Record<string, string> = {
    good: 'border-jade/30 bg-jade/10 text-jade',
    bad: 'border-red-400/40 bg-red-500/10 text-red-700 dark:text-red-200',
    warn: 'border-gold/30 bg-gold/10 text-gold',
    neutral: 'border-border bg-muted/40 text-muted-foreground',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

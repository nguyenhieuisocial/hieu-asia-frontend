'use client';

/**
 * CloudflareDeployDrawer — slide-out detail for ONE Worker deployment.
 *
 * Opened from a row on /infra/cloudflare. Lazily fetches
 * GET /admin/infra/cloudflare/:id (React Query enabled only while open, keyed by
 * the id) and shows the deployment id, live flag, author, message, source, and
 * its position in the deploy history.
 */

import { useQuery } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@hieu-asia/ui';
import { getInfraCloudflareDetail } from '@/lib/admin-api';
import { formatDateOrEmpty, formatRelativeOrEmpty } from '@/lib/format-date';
import { ErrorBlock } from '@/components/admin/error-block';
import { InfraStatusPill } from '@/components/admin/infra/infra-panel';

function StatLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="break-all text-right text-sm text-foreground">{value}</span>
    </div>
  );
}

export interface CloudflareDeployDrawerProps {
  id: string | null;
  open: boolean;
  onClose: () => void;
}

export function CloudflareDeployDrawer({
  id,
  open,
  onClose,
}: CloudflareDeployDrawerProps): React.ReactElement {
  const enabled = open && !!id;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['infra', 'cloudflare', 'detail', id],
    queryFn: () => getInfraCloudflareDetail(id!),
    enabled,
    staleTime: 30_000,
  });

  const d = data && data.ok ? data.deployment : undefined;
  const showError = isError || (data && data.ok === false);
  const errorMsg = data && data.ok === false ? data.error : undefined;

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="break-words pr-6 font-mono text-sm">
            {d ? d.id.slice(0, 12) : 'Chi tiết bản triển khai'}
          </SheetTitle>
          {d?.message && (
            <SheetDescription className="break-words">{d.message}</SheetDescription>
          )}
        </SheetHeader>

        {showError && (
          <ErrorBlock
            compact
            message={errorMsg ?? 'Không tải được chi tiết bản triển khai.'}
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="space-y-2 pt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted/30" />
            ))}
          </div>
        )}

        {d && !isLoading && (
          <div className="rounded-md border border-border bg-card/60 px-3 py-1">
            <StatLine
              label="Đang chạy"
              value={
                d.live ? (
                  <InfraStatusPill label="live" tone="good" />
                ) : (
                  <InfraStatusPill label="—" tone="neutral" />
                )
              }
            />
            <StatLine label="ID" value={<span className="font-mono text-xs">{d.id}</span>} />
            <StatLine label="Người" value={d.author_email ?? '—'} />
            <StatLine label="Nguồn" value={d.source ?? '—'} />
            <StatLine
              label="Vị trí"
              value={`#${d.position + 1} / ${d.total}`}
            />
            <StatLine
              label="Thời gian"
              value={
                <span>
                  {formatDateOrEmpty(d.created_on)}
                  {formatRelativeOrEmpty(d.created_on) && (
                    <span className="ml-1.5 text-xs opacity-70">
                      · {formatRelativeOrEmpty(d.created_on)}
                    </span>
                  )}
                </span>
              }
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

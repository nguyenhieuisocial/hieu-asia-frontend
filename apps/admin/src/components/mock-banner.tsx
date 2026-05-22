/**
 * Inline banner shown on pages where data still comes from `mock-data.ts`
 * (because the corresponding `/admin/*` endpoint isn't shipped yet).
 *
 * Pages call: <MockBanner source={data?._source} />
 */
import * as React from 'react';
import type { DataSource } from '@/lib/admin-api';

export function MockBanner({ source, prefix }: { source?: DataSource; prefix?: string }) {
  if (!source?.isMock) return null;
  return (
    <div className="mb-4 rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
      <span className="font-medium">{prefix ?? 'Đang dùng dữ liệu mock.'}</span>{' '}
      {source.reason ? (
        <span className="text-amber-100/75">({source.reason})</span>
      ) : (
        <span className="text-amber-100/75">
          Đặt <code className="font-mono">HIEU_API_ADMIN_TOKEN</code> và đợi backend ship endpoint
          tương ứng để xem dữ liệu thật.
        </span>
      )}
    </div>
  );
}

/** Simple skeleton row replacement when react-query is loading. */
export function SkeletonBlock({
  className = 'h-8 w-24',
}: {
  className?: string;
}) {
  return <div className={`${className} animate-pulse rounded bg-muted/40`} />;
}

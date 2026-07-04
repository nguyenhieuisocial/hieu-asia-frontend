/**
 * "Vị trí & Thiết bị" — aggregate audience breakdown from PostHog.
 *
 * Server component (POSTHOG_PERSONAL_API_KEY stays server-side). Shows the
 * founder WHO the audience is: device split (mobile-first check), OS, browser,
 * and top countries + cities — all from PostHog auto-captured props over 30d.
 * Complements the per-user device panel on customer/session detail with the
 * whole-audience view. Never crashes on PostHog downtime (helper → null).
 */

import { Globe } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import {
  fetchAudienceBreakdown,
  isPostHogServerConfigured,
  type DimensionCount,
} from '@/lib/posthog-server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata = {
  title: 'Vị trí & Thiết bị · hieu.asia admin',
  description: 'Phân bố người dùng theo quốc gia, thành phố, thiết bị (PostHog, 30 ngày)',
};

/**
 * Title-case a merged (lower-cased) dimension key for display. The HogQL groups
 * case-insensitively (lower()) so "Desktop" + "desktop" collapse to one accurate
 * bucket; this restores a readable capitalisation ("united states" → "United
 * States"). \p{L} + u-flag so Vietnamese ("không rõ" → "Không Rõ") title-cases too.
 */
function titleCase(s: string): string {
  return s.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

/** One ranked breakdown — horizontal bars scaled to the section's top value. */
function BreakdownList({
  title,
  rows,
  total,
}: {
  title: string;
  rows: DimensionCount[];
  total: number;
}) {
  const max = rows.reduce((m, r) => Math.max(m, r.users), 0) || 1;
  return (
    <div className="rounded-card-editorial border border-border bg-card p-4">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {rows.length === 0 ? (
        <EmptyState compact title="Chưa có dữ liệu." />
      ) : (
        <ul className="space-y-2.5">
          {rows.map((r) => {
            const pct = total > 0 ? Math.round((r.users / total) * 100) : 0;
            return (
              <li key={r.key} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="truncate text-foreground/90" title={titleCase(r.key)}>
                    {titleCase(r.key)}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {r.users.toLocaleString('vi-VN')}
                    {total > 0 && <span className="ml-1 text-foreground/40">· {pct}%</span>}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-gold/60"
                    style={{ width: `${Math.max(3, (r.users / max) * 100)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default async function GeoDevicesPanel() {
  const configured = isPostHogServerConfigured();
  const data = configured ? await fetchAudienceBreakdown() : null;

  const header = (
    <PageHeader
      icon={<Globe className="h-5 w-5" aria-hidden />}
      title="Vị trí & Thiết bị"
      description="Người dùng đến từ đâu và dùng gì — quốc gia, thành phố, thiết bị, hệ điều hành, trình duyệt (PostHog, 30 ngày). Đối chiếu nhanh xem traffic có đúng mobile-first + đúng thị trường VN không."
    />
  );

  if (!configured) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        {header}
        <div className="mt-8 rounded-card-editorial border border-amber-500/40 bg-amber-500/5 p-6 text-sm text-foreground">
          <p>
            <strong>POSTHOG_PERSONAL_API_KEY</strong> chưa được cấu hình.
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        {header}
        <div className="mt-8 rounded-card-editorial border border-border bg-card p-6 text-sm text-muted-foreground">
          <p>Lỗi tạm thời khi gọi PostHog HogQL, hoặc chưa có dữ liệu. Thử lại sau.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {header}
      <p className="mt-6 text-sm text-muted-foreground">
        Tổng{' '}
        <span className="font-semibold text-foreground">
          {data.totalUsers.toLocaleString('vi-VN')}
        </span>{' '}
        người dùng có hoạt động trong 30 ngày. % tính trên tổng này.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BreakdownList title="Thiết bị" rows={data.devices} total={data.totalUsers} />
        <BreakdownList title="Hệ điều hành" rows={data.os} total={data.totalUsers} />
        <BreakdownList title="Trình duyệt" rows={data.browsers} total={data.totalUsers} />
        <BreakdownList title="Quốc gia" rows={data.countries} total={data.totalUsers} />
        <BreakdownList title="Thành phố" rows={data.cities} total={data.totalUsers} />
      </div>
    </main>
  );
}

/**
 * /admin/posthog?tab=live-events — raw recent-event feed.
 *
 * A server-rendered "is tracking alive?" stream: the 30 most recent PostHog
 * events (last 7 days), newest first. At low traffic this doubles as a
 * diagnostic — it makes it obvious when an expected event (a feature-flag
 * exposure, a payment) never fires. Read via the server-only HogQL client;
 * degrades to a placeholder on any failure so the page never crashes.
 */

import { Radio, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import {
  fetchRecentEvents,
  isPostHogServerConfigured,
} from '@/lib/posthog-server';
import { fmtRelative } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function LiveEventsPanel() {
  const configured = isPostHogServerConfigured();
  const rows = configured ? await fetchRecentEvents() : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sự kiện trực tiếp"
        description="30 sự kiện gần nhất (7 ngày), mới nhất trên cùng. Dùng để kiểm tra việc đo lường có chạy không — nếu vắng hẳn loại sự kiện mong đợi thì tracking hoặc traffic đang có vấn đề."
        icon={<Radio className="h-5 w-5" />}
      />

      {!configured && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 text-sm text-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
              aria-hidden
            />
            <span>
              <code className="font-mono">POSTHOG_PERSONAL_API_KEY</code> chưa cấu
              hình — không đọc được sự kiện. Set env var ở Vercel admin project rồi
              deploy lại.
            </span>
          </p>
        </div>
      )}

      {configured && rows === null && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-5 text-sm text-foreground">
          PostHog Query API không phản hồi. Kiểm tra key/quota hoặc Sentry.
        </div>
      )}

      {rows !== null && rows.length === 0 && (
        <div className="rounded-xl border border-gold/20 bg-card p-6 text-sm text-muted-foreground">
          Chưa có sự kiện nào trong 7 ngày qua — traffic rất thấp, hoặc tracking
          chưa gửi event. Đây cũng là lý do các thử nghiệm A/B chưa thu được dữ liệu.
        </div>
      )}

      {rows !== null && rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gold/15 bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Thời điểm</th>
                <th className="px-4 py-2 font-medium">Sự kiện</th>
                <th className="px-4 py-2 font-medium">Trang</th>
                <th className="px-4 py-2 font-medium">Người dùng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={`${r.timestamp}-${i}`}
                  className="border-t border-gold/10"
                >
                  <td
                    className="whitespace-nowrap px-4 py-2 text-muted-foreground"
                    title={r.timestamp}
                  >
                    {fmtRelative(r.timestamp)}
                  </td>
                  <td className="px-4 py-2">
                    <code className="font-mono text-foreground">{r.event}</code>
                  </td>
                  <td
                    className="max-w-[16rem] truncate px-4 py-2 text-muted-foreground"
                    title={r.pathname ?? ''}
                  >
                    {r.pathname ?? '—'}
                  </td>
                  <td
                    className="max-w-[12rem] truncate px-4 py-2 font-mono text-[11px] text-muted-foreground"
                    title={r.distinctId ?? ''}
                  >
                    {r.distinctId ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

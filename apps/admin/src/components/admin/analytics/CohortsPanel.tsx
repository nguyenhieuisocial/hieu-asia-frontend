/**
 * Wave 61.08 — Cohort/retention admin dashboard.
 *
 * Three tiles powered by HogQL (PostHog Query API, server-side via
 * POSTHOG_PERSONAL_API_KEY):
 *
 *   1. Weekly retention cohort — last 8 weeks, W1/W2/W3/W4 retention %.
 *   2. Acquisition channels — distinct users by UTM source / referrer
 *      over the last 30 days.
 *   3. Conversion funnel — Pageview → Survey → Reading start → Reading
 *      complete over the last 30 days, with per-step conv %.
 *
 * Server component — every helper returns `null` on missing key / network
 * failure, and the UI renders an em-dash placeholder. PostHog downtime
 * never crashes the page.
 */

import { Users2, TrendingUp, Filter } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import {
  fetchCohortRetention,
  fetchAcquisitionChannels,
  fetchAcquisitionFunnel,
  isPostHogServerConfigured,
} from '@/lib/posthog-server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata = {
  title: 'Cohorts · hieu.asia admin',
  description: 'Retention + acquisition + funnel KPIs from PostHog',
};

function pct(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

function weekLabel(iso: string): string {
  // 2026-05-25 → "25/5"
  const m = iso.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${Number(m[3])}/${Number(m[2])}`;
}

export default async function CohortsPage() {
  const configured = isPostHogServerConfigured();
  const [cohorts, channels, funnel] = configured
    ? await Promise.all([
        fetchCohortRetention(),
        fetchAcquisitionChannels(),
        fetchAcquisitionFunnel(),
      ])
    : [null, null, null];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        icon={<TrendingUp className="h-5 w-5" aria-hidden />}
        title="Cohorts & Retention"
        description="Tỷ lệ quay lại theo tuần, kênh acquisition, và funnel chuyển đổi từ PostHog. Cập nhật mỗi 60 giây."
      />

      {!configured && (
        <div className="mt-8 rounded-card-editorial border border-amber-500/40 bg-amber-500/5 p-6 text-sm text-foreground">
          <p>
            <strong>POSTHOG_PERSONAL_API_KEY</strong> chưa được cấu hình. KPI
            sẽ hiện khi env var được set trong Vercel admin project.
          </p>
        </div>
      )}

      {/* ──────────────── 1. Weekly cohort retention ──────────────── */}
      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-xl text-foreground">
          <Users2 className="h-5 w-5 text-gold" aria-hidden />
          Cohort retention (8 tuần gần nhất)
        </h2>
        <div className="overflow-x-auto rounded-card-editorial border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Tuần (Monday)
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Cohort
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  W1
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  W2
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  W3
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  W4
                </th>
              </tr>
            </thead>
            <tbody>
              {!cohorts || cohorts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    {cohorts === null
                      ? '— (lỗi PostHog hoặc thiếu key)'
                      : 'Chưa có dữ liệu cohort'}
                  </td>
                </tr>
              ) : (
                cohorts.map((c) => (
                  <tr
                    key={c.cohort_week}
                    className="border-b border-border/40 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-foreground">
                      {weekLabel(c.cohort_week)}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {c.cohort_size.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {c.cohort_size > 0 ? pct(c.w1 / c.cohort_size) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {c.cohort_size > 0 ? pct(c.w2 / c.cohort_size) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {c.cohort_size > 0 ? pct(c.w3 / c.cohort_size) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {c.cohort_size > 0 ? pct(c.w4 / c.cohort_size) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ──────────────── 2. Acquisition channels ──────────────── */}
      <section className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-xl text-foreground">
          <Users2 className="h-5 w-5 text-gold" aria-hidden />
          Acquisition channels (30 ngày)
        </h2>
        <div className="overflow-hidden rounded-card-editorial border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Channel
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Distinct users
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {!channels || channels.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    {channels === null
                      ? '— (lỗi PostHog hoặc thiếu key)'
                      : 'Chưa có dữ liệu'}
                  </td>
                </tr>
              ) : (
                (() => {
                  const total = channels.reduce((s, c) => s + c.users, 0);
                  return channels.map((c) => (
                    <tr
                      key={c.channel}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-foreground">
                        {c.channel}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">
                        {c.users.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {total > 0 ? pct(c.users / total) : '—'}
                      </td>
                    </tr>
                  ));
                })()
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ──────────────── 3. Conversion funnel ──────────────── */}
      <section className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-xl text-foreground">
          <Filter className="h-5 w-5 text-gold" aria-hidden />
          Conversion funnel (30 ngày)
        </h2>
        <div className="overflow-hidden rounded-card-editorial border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Step
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Distinct users
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Conv vs step 1
                </th>
              </tr>
            </thead>
            <tbody>
              {!funnel || funnel.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    {funnel === null
                      ? '— (lỗi PostHog hoặc thiếu key)'
                      : 'Chưa có dữ liệu'}
                  </td>
                </tr>
              ) : (
                funnel.map((f) => (
                  <tr
                    key={f.step}
                    className="border-b border-border/40 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {f.step}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {f.users.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {pct(f.rate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        Sources: PostHog HogQL Query API (project 434217). Cohort = week of
        person's first event. Channels = $initial_utm_source ∨
        $initial_referring_domain. Funnel (event đã fire thật ở apps/web):
        $pageview → reading_session_created → survey_completed → report_viewed →
        payment_completed.
      </p>
    </main>
  );
}

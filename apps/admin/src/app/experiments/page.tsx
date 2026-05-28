/**
 * Wave 61.07 — A/B test framework admin page.
 *
 * Lists PostHog feature flags currently registered on project 434217.
 * Server component — uses POSTHOG_PERSONAL_API_KEY (server-only) via the
 * extended `fetchPostHogFeatureFlags` helper in lib/posthog-server.ts.
 *
 * Founder edits each flag's rollout % directly in PostHog dashboard
 * (link → "Edit in PostHog"). This page is read-only audit + roster.
 */

import { FlaskConical, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import {
  fetchPostHogFeatureFlags,
  isPostHogServerConfigured,
} from '@/lib/posthog-server';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_POSTHOG_DASHBOARD_URL;

export const metadata = {
  title: 'Experiments · hieu.asia admin',
  description: 'PostHog feature flag roster + rollout %',
};

export default async function ExperimentsPage() {
  const configured = isPostHogServerConfigured();
  const flags = configured ? await fetchPostHogFeatureFlags() : null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        icon={<FlaskConical className="h-5 w-5" aria-hidden />}
        title="A/B testing — feature flags"
        description="Roster các feature flag PostHog đang chạy + rollout %. Sửa từng flag trực tiếp trên PostHog dashboard."
      />

      {!configured && (
        <div className="mt-8 rounded-card-editorial border border-amber-500/40 bg-amber-500/5 p-6 text-sm text-foreground">
          <p>
            <strong>POSTHOG_PERSONAL_API_KEY</strong> chưa được cấu hình. Live
            roster sẽ hiện khi env var được set trong Vercel admin project.
          </p>
        </div>
      )}

      {configured && flags === null && (
        <div className="mt-8 rounded-card-editorial border border-red-500/40 bg-red-500/5 p-6 text-sm text-foreground">
          <p>
            Lỗi tạm thời khi gọi PostHog REST. Thử lại sau, hoặc kiểm tra
            Sentry.
          </p>
        </div>
      )}

      {configured && flags !== null && flags.length === 0 && (
        <div className="mt-8 rounded-card-editorial border border-border bg-card p-6 text-sm text-muted-foreground">
          <p>
            Chưa có feature flag nào. Tạo flag tại{' '}
            <a
              href={
                DASHBOARD_URL
                  ? `${DASHBOARD_URL}/feature_flags`
                  : 'https://us.posthog.com/'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline"
            >
              PostHog dashboard
            </a>{' '}
            → Feature Flags → New.
          </p>
        </div>
      )}

      {configured && flags && flags.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-card-editorial border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Tên / Key
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Trạng thái
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Rollout
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Variants
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {flags.map((f) => (
                <tr key={f.id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-4">
                    <div className="font-medium text-foreground">{f.name}</div>
                    <code className="font-mono text-xs text-muted-foreground">
                      {f.key}
                    </code>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        f.active
                          ? 'inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500'
                          : 'inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
                      }
                    >
                      {f.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-foreground">
                    {f.rollout_percentage ?? 0}%
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {f.variants && f.variants.length > 0
                      ? f.variants.map((v) => `${v.key} ${v.rollout_percentage}%`).join(' · ')
                      : 'boolean'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {DASHBOARD_URL && (
                      <a
                        href={`${DASHBOARD_URL}/feature_flags/${f.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-soft"
                      >
                        Edit in PostHog <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Founder action: chỉnh rollout % bằng cách click "Edit in PostHog" →
        Save → Cohort sẽ phân nhánh ngay. Site không cần redeploy.
      </p>
    </main>
  );
}

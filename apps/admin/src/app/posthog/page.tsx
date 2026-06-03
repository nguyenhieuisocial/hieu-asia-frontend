/**
 * /admin/posthog — "PostHog" analytics hub.
 *
 * Wave 66 IA consolidation: folds the former /cohorts, /web-vitals and
 * /sticky-cta routes into this page as tabs alongside the original overview.
 * All four panels are SERVER components that read PostHog via the server-only
 * HogQL client (`lib/posthog-server.ts`, `import 'server-only'`), so a client
 * ProductTabs host (the #51/#56 pattern) is impossible — it would pull a
 * server-only module into the client bundle and break the build.
 *
 * Instead this is a SERVER host: it reads `?tab=` and renders exactly ONE
 * panel, so only that panel's PostHog fetch fires. The tab-bar is plain
 * server-rendered <Link>s (no client state). Each panel keeps its own
 * PageHeader as the per-view title.
 *
 * Legacy routes 308-redirect here (next.config):
 *   /cohorts     → /posthog?tab=cohorts
 *   /web-vitals  → /posthog?tab=web-vitals
 *   /sticky-cta  → /posthog?tab=sticky-cta
 */

import Link from 'next/link';
import { cn } from '@hieu-asia/ui';
import { Activity, Users2, Gauge, MousePointerClick, Radio } from 'lucide-react';
import OverviewPanel from '@/components/admin/analytics/OverviewPanel';
import CohortsPanel from '@/components/admin/analytics/CohortsPanel';
import WebVitalsPanel from '@/components/admin/analytics/WebVitalsPanel';
import StickyCtaPanel from '@/components/admin/analytics/StickyCtaPanel';
import LiveEventsPanel from '@/components/admin/analytics/LiveEventsPanel';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const TABS = [
  { id: 'overview', label: 'Tổng quan', Icon: Activity },
  { id: 'cohorts', label: 'Cohorts & Retention', Icon: Users2 },
  { id: 'web-vitals', label: 'Web Vitals', Icon: Gauge },
  { id: 'sticky-cta', label: 'Sticky CTA', Icon: MousePointerClick },
  { id: 'live-events', label: 'Sự kiện trực tiếp', Icon: Radio },
] as const;

type TabId = (typeof TABS)[number]['id'];

function isValidTab(v: string | undefined): v is TabId {
  return !!v && TABS.some((t) => t.id === v);
}

export default async function PostHogHubPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active: TabId = isValidTab(tab) ? tab : 'overview';

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="PostHog" className="flex flex-wrap gap-1 border-b border-gold/15">
        {TABS.map((t) => {
          const selected = t.id === active;
          return (
            <Link
              key={t.id}
              href={`/posthog?tab=${t.id}`}
              role="tab"
              aria-selected={selected}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-3 font-sans text-sm font-medium transition-colors duration-200',
                selected
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <t.Icon className="h-4 w-4" aria-hidden />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>

      {active === 'overview' && <OverviewPanel />}
      {active === 'cohorts' && <CohortsPanel />}
      {active === 'web-vitals' && <WebVitalsPanel />}
      {active === 'sticky-cta' && <StickyCtaPanel />}
      {active === 'live-events' && <LiveEventsPanel />}
    </div>
  );
}

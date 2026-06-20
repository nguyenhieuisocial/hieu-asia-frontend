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
import {
  Activity,
  Clapperboard,
  Compass,
  Database,
  Flame,
  Gauge,
  MousePointerClick,
  Radio,
  Trophy,
} from 'lucide-react';
import OverviewPanel from '@/components/admin/analytics/OverviewPanel';
import CohortsPanel from '@/components/admin/analytics/CohortsPanel';
import WebVitalsPanel from '@/components/admin/analytics/WebVitalsPanel';
import StickyCtaPanel from '@/components/admin/analytics/StickyCtaPanel';
import LiveEventsPanel from '@/components/admin/analytics/LiveEventsPanel';
import ToolScorecardPanel from '@/components/admin/analytics/ToolScorecardPanel';
import ExplorerPanel from '@/components/admin/analytics/ExplorerPanel';
import SessionReplayPanel from '@/components/admin/analytics/SessionReplayPanel';
import HeatmapPanel from '@/components/admin/analytics/HeatmapPanel';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const TABS = [
  { id: 'overview', label: 'Tổng quan lưu lượng', Icon: Activity },
  // id stays 'cohorts' so existing /posthog?tab=cohorts links + the
  // /cohorts → /posthog?tab=cohorts redirect keep working. Only the
  // founder-facing label/icon change: this tab is really acquisition
  // channels (UTM/referrer), paid-by-channel, và funnel chuyển đổi.
  { id: 'cohorts', label: 'Kênh traffic & Giữ chân', Icon: Compass },
  { id: 'tool-scorecard', label: 'Bảng điểm công cụ', Icon: Trophy },
  { id: 'web-vitals', label: 'Web Vitals', Icon: Gauge },
  { id: 'sticky-cta', label: 'Sticky CTA', Icon: MousePointerClick },
  { id: 'live-events', label: 'Sự kiện trực tiếp', Icon: Radio },
  // Native, secure in-admin replacements for PostHog's own tools (no iframe,
  // no public share link — all read server-side with the key kept on the server).
  { id: 'explorer', label: 'Bảng hỏi dữ liệu', Icon: Database },
  { id: 'replay', label: 'Xem lại phiên', Icon: Clapperboard },
  { id: 'heatmap', label: 'Bản đồ nhiệt', Icon: Flame },
] as const;

type TabId = (typeof TABS)[number]['id'];

function isValidTab(v: string | undefined): v is TabId {
  return !!v && TABS.some((t) => t.id === v);
}

export default async function PostHogHubPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; stcol?: string; stdir?: string }>;
}) {
  const { tab, stcol, stdir } = await searchParams;
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
      {active === 'tool-scorecard' && (
        <ToolScorecardPanel sortCol={stcol} sortDir={stdir} />
      )}
      {active === 'web-vitals' && <WebVitalsPanel />}
      {active === 'sticky-cta' && <StickyCtaPanel />}
      {active === 'live-events' && <LiveEventsPanel />}
      {active === 'explorer' && <ExplorerPanel />}
      {active === 'replay' && <SessionReplayPanel />}
      {active === 'heatmap' && <HeatmapPanel />}
    </div>
  );
}

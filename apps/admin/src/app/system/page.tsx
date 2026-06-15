'use client';

/**
 * /system — "Trạng thái hệ thống" — unified ops/observability surface.
 *
 * Wave 65 consolidation: folds the former standalone /system, /health and
 * /metrics routes into one tabbed page (vault 107 §5.2 ProductTabs pattern,
 * same as /billing, /payments, /affiliates). Legacy routes 308-redirect here:
 *   /health  → /system?tab=uptime
 *   /metrics → /system?tab=performance
 *
 * Tab state lives in `?tab=` so deep-links + the redirects above land on the
 * right tab without flicker. Each tab body is its own component under
 * components/admin/system/ and owns its own data fetching (React Query dedupes
 * across tabs), so only the active tab's queries run.
 */

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ServerCog, Heart, Activity } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { LiveBadge } from '@/components/admin/live-badge';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import { ServicesTab } from '@/components/admin/system/ServicesTab';
import { UptimeTab } from '@/components/admin/system/UptimeTab';
import { PerformanceTab } from '@/components/admin/system/PerformanceTab';

const VALID_TABS = ['services', 'uptime', 'performance'] as const;
type TabId = (typeof VALID_TABS)[number];

function isValidTab(v: string | null): v is TabId {
  return v !== null && (VALID_TABS as readonly string[]).includes(v);
}

function SystemPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const param = searchParams.get('tab');
  const active: TabId = isValidTab(param) ? param : 'services';

  // Normalize an invalid `?tab=` value out of the URL so deep-links / stale
  // bookmarks fall back to the default tab cleanly instead of leaving a bad
  // param behind. Only acts when `tab` is present but not a known id.
  React.useEffect(() => {
    if (param !== null && !isValidTab(param)) {
      const next = new URLSearchParams(searchParams.toString());
      next.delete('tab');
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [param, pathname, router, searchParams]);

  const onTabChange = React.useCallback(
    (id: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set('tab', id);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const tabs: ProductTab[] = React.useMemo(
    () => [
      {
        id: 'services',
        label: 'Dịch vụ',
        icon: <ServerCog size={16} />,
        content: <ServicesTab />,
      },
      {
        id: 'uptime',
        label: 'Uptime & Sự cố',
        icon: <Heart size={16} />,
        content: <UptimeTab />,
      },
      {
        id: 'performance',
        label: 'Hiệu năng',
        icon: <Activity size={16} />,
        content: <PerformanceTab />,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trạng thái hệ thống"
        description="Dịch vụ, uptime & sự cố, và hiệu năng request — gộp trong một trang."
        icon={<ServerCog className="h-5 w-5" />}
        badge={<LiveBadge />}
      />
      <ProductTabs tabs={tabs} value={active} onValueChange={onTabChange} />
    </div>
  );
}

export default function SystemPage() {
  // useSearchParams() requires a Suspense boundary (App Router CSR bailout).
  return (
    <React.Suspense fallback={<div className="h-72 animate-pulse rounded bg-muted/30" />}>
      <SystemPageInner />
    </React.Suspense>
  );
}

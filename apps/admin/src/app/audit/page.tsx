'use client';

/**
 * /audit — "Logs & sự cố" — unified read-only compliance/ops history.
 *
 * Wave 66 IA consolidation: folds the former standalone /migrations route into
 * this tabbed page (same ProductTabs + ?tab= pattern as /system, Wave 65).
 * Both surfaces are read-only and infrequently used, so they share one nav slot.
 *   /migrations  → /audit?tab=migrations  (next.config redirect)
 *
 * Tab state lives in `?tab=` so the redirect lands on the right tab without
 * flicker. Each tab body owns its own data fetching (React Query dedupes).
 */

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ScrollText, Database } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import { AuditTab } from '@/components/admin/system/AuditTab';
import { MigrationsTab } from '@/components/admin/system/MigrationsTab';

const VALID_TABS = ['audit', 'migrations'] as const;
type TabId = (typeof VALID_TABS)[number];

function isValidTab(v: string | null): v is TabId {
  return v !== null && (VALID_TABS as readonly string[]).includes(v);
}

function LogsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const param = searchParams.get('tab');
  const active: TabId = isValidTab(param) ? param : 'audit';

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
        id: 'audit',
        label: 'Audit log',
        icon: <ScrollText size={16} />,
        content: <AuditTab />,
      },
      {
        id: 'migrations',
        label: 'Migrations',
        icon: <Database size={16} />,
        content: <MigrationsTab />,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logs & sự cố"
        description="Audit log (admin + GDPR) và lịch sử migration — gộp trong một trang."
        icon={<ScrollText className="h-5 w-5" />}
      />
      <ProductTabs tabs={tabs} value={active} onValueChange={onTabChange} />
    </div>
  );
}

export default function LogsPage() {
  // useSearchParams() requires a Suspense boundary (App Router CSR bailout).
  return (
    <React.Suspense fallback={<div className="h-72 animate-pulse rounded bg-muted/30" />}>
      <LogsPageInner />
    </React.Suspense>
  );
}

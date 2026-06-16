'use client';

/**
 * /ai-quality — "Chất lượng AI" — unified AI quality surface.
 *
 * Wave 66 IA consolidation: folds the former standalone /eval route into this
 * tabbed page (ProductTabs + ?tab=, same pattern as /system #45, /audit #51).
 * Both tabs answer "is the AI good enough?" from two angles:
 *   - Validator (realtime): production output-validator pass/retry/fail (worker KV)
 *   - Eval nightly: 3-judge LLM scores over time (nightly cron)
 * Legacy route 308-redirects here: /eval → /ai-quality?tab=eval
 *
 * Tab state lives in `?tab=` so deep-links + the redirect land on the right tab
 * without flicker. Each tab body owns its own data fetching (React Query dedupes).
 */

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Shield, Brain, Timer, AlertTriangle, Network } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import { ValidatorTab } from '@/components/admin/ai/ValidatorTab';
import { EvalTab } from '@/components/admin/ai/EvalTab';
import { LatencyTab } from '@/components/admin/ai/LatencyTab';
import { StuckReportsTab } from '@/components/admin/ai/StuckReportsTab';
import { ModelHealthTab } from '@/components/admin/ai/ModelHealthTab';

const VALID_TABS = ['validator', 'eval', 'latency', 'stuck', 'model-health'] as const;
type TabId = (typeof VALID_TABS)[number];

function isValidTab(v: string | null): v is TabId {
  return v !== null && (VALID_TABS as readonly string[]).includes(v);
}

function AiQualityPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const param = searchParams.get('tab');
  const active: TabId = isValidTab(param) ? param : 'validator';

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
        id: 'validator',
        label: 'Validator (realtime)',
        icon: <Shield size={16} />,
        content: <ValidatorTab />,
      },
      {
        id: 'eval',
        label: 'Eval nightly',
        icon: <Brain size={16} />,
        content: <EvalTab />,
      },
      {
        id: 'latency',
        label: 'Độ trễ (p50/p95)',
        icon: <Timer size={16} />,
        content: <LatencyTab />,
      },
      {
        id: 'stuck',
        label: 'Báo cáo kẹt',
        icon: <AlertTriangle size={16} />,
        content: <StuckReportsTab />,
      },
      {
        id: 'model-health',
        label: 'Sức khoẻ model',
        icon: <Network size={16} />,
        content: <ModelHealthTab />,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chất lượng AI"
        description="Output-validator realtime + eval nightly đa-judge — gộp trong một trang."
        icon={<Shield className="h-5 w-5" />}
      />
      <ProductTabs tabs={tabs} value={active} onValueChange={onTabChange} />
    </div>
  );
}

export default function AiQualityPage() {
  // useSearchParams() requires a Suspense boundary (App Router CSR bailout).
  return (
    <React.Suspense fallback={<div className="h-72 animate-pulse rounded bg-muted/30" />}>
      <AiQualityPageInner />
    </React.Suspense>
  );
}

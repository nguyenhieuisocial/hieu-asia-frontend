'use client';

/**
 * /admin/settings — Wave 60.81.D rebuild (vault 107 §5.7).
 *
 * Tier 2 paired with /connect — substitute for the blocked /secrets work.
 * Splits the old "general / notifications / integrations / security" tabs
 * (which mostly contained Link grids) into purpose-built tabs:
 *
 *   ├─ Profile — read-only admin info + theme preference
 *   ├─ Notifications — email digest + Slack + Telegram + critical alerts
 *   ├─ API keys — AdminTable + Generate Dialog (show once) + Revoke
 *   └─ Retention — audit log retention window + confirm Dialog
 *
 * Each tab component lives in components/admin/settings/* and writes to
 * its own API endpoint with audit_log on mutation.
 *
 * RSC discipline: pre-rendered icons, no inline arrow props, defensive
 * Array.isArray on async data.
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Settings,
  Bell,
  KeyRound,
  Clock,
  UserCircle2,
  Gauge,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import { ProfileTab } from '@/components/admin/settings/ProfileTab';
import { NotificationsTab } from '@/components/admin/settings/NotificationsTab';
import { ApiKeysTab } from '@/components/admin/settings/ApiKeysTab';
import { RetentionTab } from '@/components/admin/settings/RetentionTab';
import { AlertThresholdsTab } from '@/components/admin/settings/AlertThresholdsTab';

const TAB_PROFILE = 'profile';
const TAB_NOTIFICATIONS = 'notifications';
const TAB_API_KEYS = 'api-keys';
const TAB_RETENTION = 'retention';
const TAB_ALERT_THRESHOLDS = 'alert-thresholds';

const VALID_TABS = new Set([
  TAB_PROFILE,
  TAB_NOTIFICATIONS,
  TAB_API_KEYS,
  TAB_RETENTION,
  TAB_ALERT_THRESHOLDS,
]);

const ICON_PROFILE = <UserCircle2 className="h-3.5 w-3.5" aria-hidden />;
const ICON_BELL = <Bell className="h-3.5 w-3.5" aria-hidden />;
const ICON_KEY = <KeyRound className="h-3.5 w-3.5" aria-hidden />;
const ICON_CLOCK = <Clock className="h-3.5 w-3.5" aria-hidden />;
const ICON_GAUGE = <Gauge className="h-3.5 w-3.5" aria-hidden />;

// Discoverability only: real internal links to dedicated settings pages so a
// solo operator can find everything from one place. NOT toggles.
const ELSEWHERE_LINKS: Array<{ href: string; label: string; hint: string }> = [
  { href: '/feature-flags', label: 'Tính năng bật/tắt', hint: 'Bật/tắt tính năng theo cờ' },
  { href: '/feature-prices', label: 'Giá tính năng', hint: 'Bảng giá từng tính năng' },
  { href: '/connect', label: 'Kết nối & OAuth', hint: 'Liên kết dịch vụ bên thứ ba' },
  { href: '/prompts', label: 'Prompt AI', hint: 'Quản lý prompt cho AI' },
  { href: '/users', label: 'Tài khoản admin', hint: 'Phân quyền RBAC admin' },
  { href: '/system', label: 'Trạng thái hệ thống', hint: 'Tình trạng hạ tầng' },
  { href: '/secrets', label: 'Bí mật / khoá', hint: 'Kho khoá & secret' },
];

export default function AdminSettingsPage() {
  // useSearchParams() requires a Suspense boundary (App Router CSR bailout).
  // Local boundary keeps sidebar/topbar mounted while ?tab= resolves.
  return (
    <React.Suspense fallback={<div className="h-72 animate-pulse rounded bg-muted/30" />}>
      <AdminSettingsPageInner />
    </React.Suspense>
  );
}

function AdminSettingsPageInner() {
  const router = useRouter();
  const search = useSearchParams();

  const param = search?.get('tab') ?? '';
  const initialTab = VALID_TABS.has(param) ? param : TAB_PROFILE;
  const [tab, setTab] = React.useState(initialTab);

  const handleTabChange = React.useCallback(
    (id: string) => {
      setTab(id);
      const next = new URLSearchParams(search?.toString() ?? '');
      if (id === TAB_PROFILE) next.delete('tab');
      else next.set('tab', id);
      const qs = next.toString();
      router.replace(qs ? `/settings?${qs}` : '/settings', { scroll: false });
    },
    [router, search],
  );

  const tabs: ProductTab[] = [
    {
      id: TAB_PROFILE,
      label: 'Profile',
      icon: ICON_PROFILE,
      content: <ProfileTab />,
    },
    {
      id: TAB_NOTIFICATIONS,
      label: 'Notifications',
      icon: ICON_BELL,
      content: <NotificationsTab />,
    },
    {
      id: TAB_API_KEYS,
      label: 'API keys',
      icon: ICON_KEY,
      content: <ApiKeysTab />,
    },
    {
      id: TAB_RETENTION,
      label: 'Retention',
      icon: ICON_CLOCK,
      content: <RetentionTab />,
    },
    {
      id: TAB_ALERT_THRESHOLDS,
      label: 'Ngưỡng cảnh báo',
      icon: ICON_GAUGE,
      content: <AlertThresholdsTab />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cài đặt"
        description="Profile + notifications + admin API keys + audit log retention + ngưỡng cảnh báo. Mọi mutation ghi audit_log."
        icon={<Settings className="h-5 w-5" aria-hidden />}
      />

      <ProductTabs tabs={tabs} value={tab} onValueChange={handleTabChange} />

      <SettingsElsewhereCard />
    </div>
  );
}

/**
 * Discoverability card — real internal links to the dedicated settings pages
 * (feature flags, prices, OAuth, prompts, users, system, secrets) so a solo
 * operator can reach everything from one place. These are links, not toggles.
 */
function SettingsElsewhereCard() {
  return (
    <div className="rounded-lg border border-gold/15 bg-card/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Settings className="h-4 w-4 text-gold" aria-hidden />
        <h2 className="text-sm font-medium text-foreground">Cài đặt khác</h2>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Các cài đặt còn lại sống ở trang riêng. Mở nhanh từ đây:
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {ELSEWHERE_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-start justify-between gap-2 rounded-md border border-gold/15 bg-card/60 px-3 py-2 transition-colors hover:border-gold/40"
          >
            <span className="min-w-0">
              <span className="block text-sm text-foreground group-hover:text-gold">
                {l.label}
              </span>
              <span className="block text-[11px] text-muted-foreground">
                {l.hint}
              </span>
            </span>
            <ExternalLink
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-gold"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

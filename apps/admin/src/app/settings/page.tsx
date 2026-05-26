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
import { useRouter, useSearchParams } from 'next/navigation';
import { Settings, Bell, KeyRound, Clock, UserCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import { ProfileTab } from '@/components/admin/settings/ProfileTab';
import { NotificationsTab } from '@/components/admin/settings/NotificationsTab';
import { ApiKeysTab } from '@/components/admin/settings/ApiKeysTab';
import { RetentionTab } from '@/components/admin/settings/RetentionTab';

const TAB_PROFILE = 'profile';
const TAB_NOTIFICATIONS = 'notifications';
const TAB_API_KEYS = 'api-keys';
const TAB_RETENTION = 'retention';

const VALID_TABS = new Set([
  TAB_PROFILE,
  TAB_NOTIFICATIONS,
  TAB_API_KEYS,
  TAB_RETENTION,
]);

const ICON_PROFILE = <UserCircle2 className="h-3.5 w-3.5" aria-hidden />;
const ICON_BELL = <Bell className="h-3.5 w-3.5" aria-hidden />;
const ICON_KEY = <KeyRound className="h-3.5 w-3.5" aria-hidden />;
const ICON_CLOCK = <Clock className="h-3.5 w-3.5" aria-hidden />;

export default function AdminSettingsPage() {
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
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cài đặt"
        description="Profile + notifications + admin API keys + audit log retention. Mọi mutation ghi audit_log."
        icon={<Settings className="h-5 w-5" aria-hidden />}
      />

      <ProductTabs tabs={tabs} value={tab} onValueChange={handleTabChange} />
    </div>
  );
}

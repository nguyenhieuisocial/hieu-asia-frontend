'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrCreateAnonUserId } from '@hieu-asia/supabase';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { useAuth } from '@/hooks/use-auth';
import {
  AccountTabs,
  ACCOUNT_TABS,
  type AccountTabId,
} from '@/components/account/AccountTabs';
import { OverviewTab } from '@/components/account/OverviewTab';
import { MyChartTab } from '@/components/account/MyChartTab';
import { DecisionsTab } from '@/components/account/DecisionsTab';
import { OperatingManualTab } from '@/components/account/OperatingManualTab';
import { MentorTab } from '@/components/account/MentorTab';
import { PaymentsTab } from '@/components/account/PaymentsTab';
import { AffiliateTab } from '@/components/account/AffiliateTab';
import { PrivacyTab } from '@/components/account/PrivacyTab';

const VALID_TABS = new Set<AccountTabId>(ACCOUNT_TABS.map((t) => t.id));

function isAccountTabId(v: string | null): v is AccountTabId {
  return !!v && VALID_TABS.has(v as AccountTabId);
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoader />}>
      <AccountPageInner />
    </Suspense>
  );
}

function AccountLoader() {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main id="main-content" className="pt-16">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div
            aria-hidden
            className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AccountPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const auth = useAuth();
  const [userId, setUserId] = React.useState<string | null>(null);

  // Tab state: URL ?tab=... → state. Updates back to URL on change.
  const initialTab: AccountTabId = isAccountTabId(search.get('tab'))
    ? (search.get('tab') as AccountTabId)
    : 'overview';
  const [tab, setTab] = React.useState<AccountTabId>(initialTab);

  React.useEffect(() => {
    setUserId(getOrCreateAnonUserId() || null);
  }, []);

  // Sync tab → URL (replace, no scroll). Keep other params intact.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('tab') === tab) return;
    url.searchParams.set('tab', tab);
    window.history.replaceState(null, '', url.toString());
  }, [tab]);

  // Auth gate
  React.useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace('/signin?returnTo=' + encodeURIComponent('/account'));
    }
  }, [auth.loading, auth.user, router]);

  if (auth.loading || !auth.user) {
    return (
      <div className="min-h-screen bg-ink text-cream">
        <SiteNav />
        <main id="main-content" className="pt-16">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <div
              aria-hidden
              className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
            />
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.28em] text-cream/60">
              {auth.loading
                ? 'Đang kiểm tra phiên đăng nhập…'
                : 'Chuyển hướng đến trang đăng nhập…'}
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const handleNavigate = (next: Exclude<AccountTabId, 'overview'>) => setTab(next);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />

        <section className="relative mx-auto max-w-5xl px-6 pb-20 pt-12 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Tài khoản
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-4xl">
            Trung tâm{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">tài khoản</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
            Dữ liệu của bạn được lưu lại — không cần nhập lại mỗi lần.
          </p>

          <div className="mt-8">
            <AccountTabs active={tab} onChange={setTab} />

            <div className="mt-8">
              {tab === 'overview' && (
                <OverviewTab user={auth.user} onNavigate={handleNavigate} />
              )}
              {tab === 'chart' && <MyChartTab />}
              {tab === 'decisions' && <DecisionsTab />}
              {tab === 'manual' && <OperatingManualTab />}
              {tab === 'mentor' && <MentorTab />}
              {tab === 'payments' && <PaymentsTab />}
              {tab === 'affiliate' && <AffiliateTab />}
              {tab === 'privacy' && <PrivacyTab userId={userId} />}
            </div>
          </div>

          <div className="mt-12 rounded-xl border border-cream/10 bg-ink/40 p-4 text-xs text-cream/65">
            Cần hỗ trợ?{' '}
            <a className="text-gold underline-offset-4 hover:underline" href="mailto:privacy@hieu.asia">
              privacy@hieu.asia
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

'use client';

/**
 * Wave 60.58 T2.1 — /account/profile
 *
 * Hierarchical deep route for "Tổng quan / hồ sơ" — the editable profile
 * surface that lived inside the old OverviewTab (display name, expert
 * mode toggle, account stats). The companion feed (/account) now leads
 * with action, so the editable profile lives at its own URL.
 *
 * For Wave 60.58 we delegate to the existing OverviewTab component to
 * avoid moving code twice — OverviewTab will be refactored / dissolved
 * in Wave 60.59 once the new account surfaces stabilize. The `onNavigate`
 * prop maps to deep-route pushes since the tab state is gone.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { useAuth } from '@/hooks/use-auth';
import { OverviewTab } from '@/components/account/OverviewTab';

const TAB_TO_ROUTE: Record<string, string> = {
  chart: '/account/chart',
  decisions: '/account/decisions',
  manual: '/account/operating-manual',
  mentor: '/account/mentor',
  payments: '/account/payments',
  affiliate: '/account/affiliate',
  privacy: '/account/privacy',
};

export default function AccountProfilePage() {
  const router = useRouter();
  const auth = useAuth();

  React.useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace(
        '/signin?returnTo=' + encodeURIComponent('/account/profile'),
      );
    }
  }, [auth.loading, auth.user, router]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative pt-16">
        <section className="mx-auto max-w-3xl px-6 pb-20 pt-10 sm:pt-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-xs text-muted-foreground"
          >
            <Link href="/account" className="hover:text-gold">
              <ArrowLeft className="mr-1 inline h-3 w-3" aria-hidden />
              Tài khoản
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Hồ sơ</span>
          </nav>

          {auth.loading || !auth.user ? (
            <div
              role="status"
              aria-live="polite"
              aria-busy="true"
              className="space-y-6"
            >
              <div className="h-8 w-48 animate-pulse rounded bg-card/30" />
              <div className="h-64 w-full animate-pulse rounded-xl bg-card/30" />
            </div>
          ) : (
            <OverviewTab
              user={auth.user}
              onNavigate={(tab) => {
                const target = TAB_TO_ROUTE[tab];
                if (target) router.push(target);
              }}
            />
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

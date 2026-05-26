'use client';

/**
 * Wave 60.58 T2.1 — /account/privacy
 *
 * Hierarchical deep route extracted from the former PrivacyTab. Note that
 * `/settings` already redirects to `/account/privacy` (see
 * apps/web/src/app/settings/page.tsx).
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getOrCreateAnonUserId } from '@hieu-asia/supabase';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { useAuth } from '@/hooks/use-auth';
import { PrivacyTab } from '@/components/account/PrivacyTab';

export default function AccountPrivacyPage() {
  const router = useRouter();
  const auth = useAuth();
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUserId(getOrCreateAnonUserId() || null);
  }, []);

  React.useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace(
        '/signin?returnTo=' + encodeURIComponent('/account/privacy'),
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
            <span className="text-muted-foreground">Quyền riêng tư</span>
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
            <PrivacyTab userId={userId} />
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

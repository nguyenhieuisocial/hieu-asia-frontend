'use client';

/**
 * Wave 60.58 T2.1 — /account/decisions
 *
 * Hierarchical deep route extracted from the former DecisionsTab.
 * NOTE: this is the list of decisions inside the *account* surface —
 * distinct from /decisions/[id] and /decisions/new (separate routes,
 * out of scope for T2.1).
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { useAuth } from '@/hooks/use-auth';
import { DecisionsTab } from '@/components/account/DecisionsTab';

export default function AccountDecisionsPage() {
  const router = useRouter();
  const auth = useAuth();

  React.useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace(
        '/signin?returnTo=' + encodeURIComponent('/account/decisions'),
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
            <span className="text-muted-foreground">Quyết định</span>
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
            <DecisionsTab />
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

'use client';

/**
 * PartnerShell — wraps every /partner/* page with auth gate + sidebar nav.
 *
 * Wave 44. Uses usePartnerGuard() to redirect unauthenticated or
 * non-affiliate-partner users away. Renders a loading skeleton while
 * the guard resolves so we don't flash the layout to unauthed users.
 */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { usePartnerGuard, type PartnerMe } from '@/lib/use-partner-guard';

const NAV = [
  { href: '/partner', label: 'Tổng quan', exact: true },
  { href: '/partner/subtree', label: 'Mạng lưới' },
  { href: '/partner/commissions', label: 'Hoa hồng' },
  { href: '/partner/payouts', label: 'Payout' },
  { href: '/partner/assets', label: 'Tài liệu' },
  { href: '/partner/profile', label: 'Hồ sơ KYC' },
];

interface PartnerShellProps {
  children: (ctx: { me: PartnerMe }) => React.ReactNode;
}

export function PartnerShell({ children }: PartnerShellProps) {
  const guard = usePartnerGuard();
  const pathname = usePathname();

  if (guard.status !== 'ok') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main id="main-content" className="pt-16">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <Skeleton className="mb-6 h-8 w-64" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  const aff = guard.me.affiliate;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="pt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <header className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Cổng Partner
              </h1>
              <p className="mt-1 text-sm text-foreground/70">
                Mã: <span className="font-mono text-gold">{aff?.affiliate_code ?? '—'}</span>
                {aff?.tier ? <> · Tier <span className="font-medium">{aff.tier}</span></> : null}
                {typeof aff?.depth === 'number' ? <> · Cấp {aff.depth}</> : null}
              </p>
            </div>
            <div className="text-xs text-foreground/60">
              {guard.user.email ?? guard.user.id.slice(0, 8) + '…'}
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr]">
            <nav className="space-y-1" aria-label="Partner navigation">
              {NAV.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      'block rounded-md px-3 py-2 text-sm transition-colors ' +
                      (active
                        ? 'bg-gold/10 font-medium text-gold'
                        : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground')
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="min-w-0">{children({ me: guard.me })}</div>
          </div>
        </div>
        <SiteFooter />
      </main>
    </div>
  );
}

/**
 * Helper for child pages to fetch their own data with the JWT attached.
 */
export async function partnerFetch<T>(path: string): Promise<T> {
  const { getPartnerJwt } = await import('@/lib/use-partner-guard');
  const jwt = await getPartnerJwt();
  if (!jwt) throw new Error('not_signed_in');
  const r = await fetch(path, {
    headers: { authorization: `Bearer ${jwt}` },
    cache: 'no-store',
  });
  const d = await r.json();
  if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
  return d as T;
}

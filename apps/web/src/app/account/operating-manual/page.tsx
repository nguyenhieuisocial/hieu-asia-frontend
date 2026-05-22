'use client';

/**
 * /account/operating-manual — full-page printable Personal Operating Manual.
 *
 * Reads the manual from localStorage via `buildOperatingManual()`. Supports a
 * shareable hash payload (`#m=<base64-json>`) which lets a recipient view the
 * sender's manual without any server roundtrip.
 *
 * No SSR (`'use client'`) — all data lives in `window.localStorage`.
 */

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { OperatingManualView } from '@/components/account/OperatingManualView';
import { SharedManualView } from '@/components/account/SharedManualView';
import type { OperatingManual } from '@/lib/operating-manual';

function tryDecodeSharedManual(): OperatingManual | null {
  if (typeof window === 'undefined') return null;
  try {
    const h = window.location.hash;
    if (!h.startsWith('#m=')) return null;
    const b64 = h
      .slice(3)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    // Pad to multiple of 4.
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const bin = atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as OperatingManual;
    // Cheap shape check.
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.sections) &&
      parsed.identity &&
      typeof parsed.generatedAt === 'string'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export default function OperatingManualPage() {
  const [shared, setShared] = React.useState<OperatingManual | null>(null);
  const [checkedHash, setCheckedHash] = React.useState(false);

  React.useEffect(() => {
    setShared(tryDecodeSharedManual());
    setCheckedHash(true);
  }, []);

  return (
    <div className="pom-print-wrapper min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative pt-16">
        <section className="mx-auto max-w-3xl px-6 pb-16 pt-10 sm:pt-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-xs text-muted-foreground print:hidden"
          >
            <Link href="/account" className="hover:text-gold">
              <ArrowLeft className="mr-1 inline h-3 w-3" aria-hidden />
              Tài khoản
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Sổ tay cá nhân</span>
          </nav>

          {!checkedHash ? (
            <div className="space-y-6" aria-hidden="true">
              <div className="h-8 w-48 animate-pulse rounded bg-muted/10" />
              <div className="h-64 w-full animate-pulse rounded bg-muted/5" />
            </div>
          ) : shared ? (
            <SharedManualView manual={shared} />
          ) : (
            <OperatingManualView />
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

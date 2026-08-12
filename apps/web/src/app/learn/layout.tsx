import * as React from 'react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { LearnPathNav } from '@/components/learn/LearnPathNav';

/**
 * Layout for /learn — wraps subpages in SiteNav + SiteFooter and applies
 * a soft radial ink background with subtle gold/purple glows.
 */
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div id="main-content" className="relative overflow-hidden pt-nav-safe">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-90"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-[-12%] h-[300px] w-[300px] rounded-full bg-purple/15 blur-3xl"
        />
        <div className="relative">{children}</div>
        {/* Strip "bài tiếp theo trong lộ trình" — client, chỉ hiện ở trang chủ đề. */}
        <LearnPathNav />
      </div>
      <SiteFooter />
    </div>
  );
}

'use client';

/**
 * Mobile bottom-tab navigation. Visible only on `<lg:` screens.
 *
 * 4 core tabs operators hit constantly + a "Thêm" button that opens a
 * bottom-sheet of secondary shortcuts (Khách hàng / SePay / Hệ thống / Cài đặt).
 * The full sidebar is still reachable via the top-left hamburger; this bar is
 * the fast path for the routes that matter day-to-day.
 *
 * Core 4 = the intersection operators always want one tap away:
 *   Tổng quan · Phiên · Doanh thu · Chi phí
 * Secondary (in the sheet) = reach-for-occasionally surfaces that don't earn a
 * permanent slot but shouldn't require digging through the sidebar either.
 *
 * The sheet reuses the same off-canvas mechanics as the sidebar (backdrop +
 * translate transform + body-scroll-lock + ESC-close) so it stays dependency
 * free and visually consistent with the drawer.
 */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@hieu-asia/ui';
import {
  LayoutDashboard,
  ListTodo,
  CreditCard,
  DollarSign,
  Plus,
  User,
  Landmark,
  ServerCog,
  Server,
  Settings,
  X,
} from 'lucide-react';

interface Tab {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

// Permanent bottom-bar tabs — the 4 routes hit most often.
const CORE_TABS: Tab[] = [
  { href: '/', label: 'Tổng quan', Icon: LayoutDashboard },
  { href: '/sessions', label: 'Phiên', Icon: ListTodo },
  { href: '/payments', label: 'Doanh thu', Icon: CreditCard },
  { href: '/llm-spend', label: 'Chi phí', Icon: DollarSign },
];

// Secondary shortcuts surfaced in the "Thêm" bottom-sheet.
const MORE_TABS: Tab[] = [
  { href: '/customers', label: 'Khách hàng', Icon: User },
  { href: '/sepay', label: 'SePay đối soát', Icon: Landmark },
  { href: '/system', label: 'Trạng thái hệ thống', Icon: ServerCog },
  { href: '/infra', label: 'Hạ tầng', Icon: Server },
  { href: '/settings', label: 'Cài đặt', Icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(href + '/');
  };

  // A secondary route being active should light up the "Thêm" trigger so the
  // bar still reflects where you are even when the route isn't a core tab.
  const moreActive = MORE_TABS.some((t) => isActive(t.href));

  // Lock body scroll while the sheet is open; restore on close + unmount.
  React.useEffect(() => {
    if (!moreOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [moreOpen]);

  // Close the sheet on ESC.
  React.useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moreOpen]);

  return (
    <>
      {/* Secondary-shortcuts bottom-sheet */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMoreOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        role="dialog"
        aria-label="Thêm lối tắt"
        aria-modal={moreOpen}
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-card/95 backdrop-blur-md transition-transform duration-300 ease-out lg:hidden',
          'rounded-t-2xl px-4 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)]',
          moreOpen ? 'translate-y-0' : 'pointer-events-none translate-y-full',
        )}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gold/25" aria-hidden />
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Lối tắt
          </span>
          <button
            type="button"
            onClick={() => setMoreOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-gold"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-2 pb-1">
          {MORE_TABS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-colors',
                    active
                      ? 'border-gold/40 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent text-gold'
                      : 'border-gold/10 bg-card/60 text-foreground/80 hover:border-gold/30 hover:text-foreground',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Persistent bottom bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/15 bg-card/95 backdrop-blur-md lg:hidden pb-[max(env(safe-area-inset-bottom),0.5rem)]"
        aria-label="Điều hướng chính (mobile)"
      >
        <ul className="grid grid-cols-5">
          {CORE_TABS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'relative flex flex-col items-center gap-0.5 px-2 pb-2 pt-3 text-[10px] transition-colors',
                    active ? 'text-gold' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {/* Active indicator — gold rail across the top of the tab. */}
                  <span
                    className={cn(
                      'absolute inset-x-3 top-0 h-0.5 rounded-full bg-gold transition-opacity',
                      active ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden
                  />
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-transform',
                      active && 'scale-110',
                    )}
                    aria-hidden
                  />
                  <span className="font-mono uppercase tracking-wider">{label}</span>
                </Link>
              </li>
            );
          })}
          {/* "Thêm" trigger — opens the secondary-shortcuts sheet. */}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-label="Thêm lối tắt"
              className={cn(
                'relative flex w-full flex-col items-center gap-0.5 px-2 pb-2 pt-3 text-[10px] transition-colors',
                moreActive || moreOpen
                  ? 'text-gold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'absolute inset-x-3 top-0 h-0.5 rounded-full bg-gold transition-opacity',
                  moreActive || moreOpen ? 'opacity-100' : 'opacity-0',
                )}
                aria-hidden
              />
              <Plus
                className={cn(
                  'h-5 w-5 transition-transform',
                  moreOpen && 'rotate-45',
                )}
                aria-hidden
              />
              <span className="font-mono uppercase tracking-wider">Thêm</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

'use client';

/**
 * Mobile bottom-tab navigation. Visible only on `<md:` screens.
 *
 * Surfaces the 5 most-used routes so operators don't have to open the
 * off-canvas sidebar for every navigation. Keeps Vận hành / Doanh thu /
 * Tri thức / Hệ thống reachable in one tap.
 */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@hieu-asia/ui';
import { LayoutDashboard, ListTodo, Receipt, DollarSign, Settings } from 'lucide-react';

interface Tab {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const TABS: Tab[] = [
  { href: '/', label: 'Tổng quan', Icon: LayoutDashboard },
  { href: '/sessions', label: 'Phiên', Icon: ListTodo },
  { href: '/payments', label: 'Giao dịch', Icon: Receipt },
  { href: '/llm-spend', label: 'Chi phí', Icon: DollarSign },
  { href: '/settings', label: 'Cài đặt', Icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/15 bg-card/95 backdrop-blur-md lg:hidden pb-[max(env(safe-area-inset-bottom),0.5rem)]"
      aria-label="Điều hướng chính (mobile)"
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-2 py-2.5 text-[10px] transition-colors',
                  active ? 'text-gold' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span className="font-mono uppercase tracking-wider">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

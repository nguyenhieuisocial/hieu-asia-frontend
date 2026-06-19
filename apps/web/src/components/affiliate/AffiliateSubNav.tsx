'use client';

/**
 * AffiliateSubNav — horizontal tab strip linking the affiliate sub-pages
 * + dashboard. Highlights the active route using `usePathname()`.
 *
 * Links: /affiliate/dashboard, /affiliate/commissions, /affiliate/assets,
 * /affiliate/terms. These were sibling islands; visitors had to bounce back
 * to /affiliate to discover other sub-pages. This strip gives one-click hop
 * between siblings.
 */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@hieu-asia/ui';

interface SubNavItem {
  href: string;
  label: string;
}

const SUB_NAV: readonly SubNavItem[] = [
  { href: '/affiliate/dashboard', label: 'Dashboard' },
  { href: '/affiliate/commissions', label: 'Hoa hồng' },
  { href: '/affiliate/assets', label: 'Marketing assets' },
  { href: '/affiliate/terms', label: 'Điều khoản' },
];

export function AffiliateSubNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Affiliate sections"
      className="mb-6 overflow-x-auto border-b border-border"
    >
      <ul className="flex min-w-max gap-1 pb-1">
        {SUB_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'bg-gold/15 text-gold'
                    : 'text-muted-foreground hover:bg-gold/10 hover:text-gold',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

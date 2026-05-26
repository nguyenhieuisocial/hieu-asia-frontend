'use client';

/**
 * Wave 60.68 — App shell mount-point for product-only chrome.
 *
 * Decides whether to render the PWA BottomNavBar based on route prefix.
 * Marketing surfaces (home, /about, /pricing, etc.) stay clean; in-app routes
 * (/account, /reading, /dashboard, /journal) get the Material 3 bottom nav
 * when running as a PWA standalone.
 *
 * Mounted from root layout AFTER `{children}` so the bar overlays without
 * affecting layout flow. BottomNavBar itself short-circuits to `null` when
 * not in PWA standalone mode (see component for detection contract).
 *
 * Icons are pre-rendered as JSX (Wave 60.65.P0a RSC pattern — never pass
 * component refs from server to client).
 */

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Home, User, Sparkles, MessageCircle } from 'lucide-react';
import { BottomNavBar, type BottomNavItem } from './BottomNavBar';

/** Route prefixes that show the product bottom nav. */
const PRODUCT_ROUTE_PREFIXES = [
  '/account',
  '/reading',
  '/dashboard',
  '/journal',
  '/decisions',
];

const NAV_ITEMS: BottomNavItem[] = [
  {
    id: 'home',
    label: 'Trang chính',
    href: '/',
    icon: <Home className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'reading',
    label: 'Lá số',
    href: '/reading',
    icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'account',
    label: 'Hồ sơ',
    href: '/account',
    icon: <User className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'mentor',
    label: 'Mentor',
    href: '/account/mentor',
    icon: <MessageCircle className="h-5 w-5" aria-hidden="true" />,
  },
];

export function AppShell() {
  const pathname = usePathname();
  const onProductRoute = React.useMemo(() => {
    if (!pathname) return false;
    return PRODUCT_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  }, [pathname]);

  if (!onProductRoute) return null;
  return <BottomNavBar items={NAV_ITEMS} />;
}

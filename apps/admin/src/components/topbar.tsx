'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { RealtimeIndicator } from '@/components/realtime-indicator';
import { ChevronRight, LogOut } from 'lucide-react';
import { NAV_GROUPS } from '@/lib/nav-config';

// Breadcrumb labels derive from the shared nav source of truth (NAV_GROUPS),
// so every section stays in lockstep with the sidebar + ⌘K palette — no drift.
const SEG_LABEL: Record<string, string> = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.items.map((it) => [it.href, it.label] as const)),
);

// Unknown dynamic segment (e.g. a UUID/id detail route) — truncate so a raw
// 36-char id doesn't blow out the breadcrumb bar.
function prettySegment(seg: string): string {
  return seg.length > 12 ? seg.slice(0, 8) + '…' : seg;
}

function buildCrumbs(pathname: string | null): { href: string; label: string }[] {
  if (!pathname || pathname === '/') return [{ href: '/', label: 'Tổng quan' }];
  const segs = pathname.split('/').filter(Boolean);
  const crumbs: { href: string; label: string }[] = [{ href: '/', label: 'Admin' }];
  let acc = '';
  for (const s of segs) {
    acc += '/' + s;
    const label = SEG_LABEL[acc] ?? prettySegment(s);
    crumbs.push({ href: acc, label });
  }
  return crumbs;
}

export function Topbar({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = React.useState(false);
  const crumbs = buildCrumbs(pathname);

  const onLogout = async () => {
    setPending(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gold/15 bg-card/80 px-4 py-3 backdrop-blur-md lg:px-8">
      <nav aria-label="breadcrumb" className="min-w-0 pl-14 lg:pl-0">
        <ol className="flex items-center gap-1.5 overflow-hidden text-xs">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li
                key={c.href + i}
                className={`flex items-center gap-1.5 ${isLast ? 'min-w-0' : 'shrink-0'}`}
              >
                {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                {isLast ? (
                  <span className="truncate font-mono uppercase tracking-wider text-foreground/85">
                    {c.label}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    className="truncate font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    {c.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="flex items-center gap-2">
        <RealtimeIndicator />
        <ThemeToggle />
        <div
          title={adminEmail}
          className="flex items-center gap-2 rounded-md border border-gold/15 bg-card/60 px-2 py-1.5 text-xs text-foreground/75 sm:px-3"
        >
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-gold/40 to-gold/10 font-heading text-[10px] text-gold"
          >
            {adminEmail.charAt(0).toUpperCase()}
          </span>
          <span className="hidden sm:inline">{adminEmail}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-md border border-gold/20 px-3 py-1.5 text-xs text-foreground/85 hover:border-gold hover:text-gold disabled:opacity-50"
        >
          <LogOut className="h-3 w-3" />
          {pending ? 'Đang thoát…' : 'Đăng xuất'}
        </button>
      </div>
    </header>
  );
}

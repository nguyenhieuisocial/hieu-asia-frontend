'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { RealtimeIndicator } from '@/components/realtime-indicator';
import { ChevronRight, LogOut } from 'lucide-react';

const SEG_LABEL: Record<string, string> = {
  '/': 'Tổng quan',
  '/customers': 'Khách hàng',
  '/users': 'Người dùng admin',
  '/sessions': 'Phiên phân tích',
  '/tasks': 'Task / Lỗi',
  '/vendors': 'Vendors',
  '/transactions': 'Giao dịch',
  '/payments': 'Thanh toán',
  '/affiliates': 'Affiliate',
  '/analytics': 'Analytics',
  '/posthog': 'PostHog',
  '/cost': 'Chi phí AI',
  '/llm-spend': 'Chi phí LLM',
  '/rag': 'RAG',
  '/prompts': 'Prompt Editor',
  '/secrets': 'API Keys',
  '/settings': 'Cài đặt',
  '/connect': 'OAuth Connect',
  '/system': 'Trạng thái hệ thống',
};

function buildCrumbs(pathname: string | null): { href: string; label: string }[] {
  if (!pathname || pathname === '/') return [{ href: '/', label: 'Tổng quan' }];
  const segs = pathname.split('/').filter(Boolean);
  const crumbs: { href: string; label: string }[] = [{ href: '/', label: 'Admin' }];
  let acc = '';
  for (const s of segs) {
    acc += '/' + s;
    const label = SEG_LABEL[acc] ?? s;
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
        <div className="hidden items-center gap-2 rounded-md border border-gold/15 bg-card/60 px-3 py-1.5 text-xs text-foreground/75 sm:flex">
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

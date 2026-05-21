'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@hieu-asia/ui';
import {
  LayoutDashboard,
  Users,
  User,
  ListTodo,
  Bot,
  BarChart3,
  Cpu,
  DollarSign,
  BookOpen,
  CreditCard,
  Receipt,
  Settings,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
  { href: '/', label: 'Tổng quan', Icon: LayoutDashboard },
  { href: '/customers', label: 'Khách hàng', Icon: User },
  { href: '/users', label: 'Người dùng admin', Icon: Users },
  { href: '/sessions', label: 'Phiên phân tích', Icon: ListTodo },
  { href: '/vendors', label: 'Vendors', Icon: Cpu },
  { href: '/transactions', label: 'Giao dịch', Icon: Receipt },
  { href: '/payments', label: 'Thanh toán', Icon: CreditCard },
  { href: '/analytics', label: 'Analytics', Icon: BarChart3 },
  { href: '/tasks', label: 'Task / Lỗi', Icon: Bot },
  { href: '/cost', label: 'Chi phí AI', Icon: DollarSign },
  { href: '/rag', label: 'RAG', Icon: BookOpen },
  { href: '/prompts', label: 'Prompt Editor', Icon: Sparkles },
  { href: '/settings', label: 'Cài đặt', Icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openMobile, setOpenMobile] = React.useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpenMobile(true)}
        className="fixed left-3 top-3 z-40 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gold/20 bg-ink/80 text-cream backdrop-blur lg:hidden"
        aria-label="Mở menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Backdrop (mobile) */}
      {openMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpenMobile(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gold/15 bg-ink/95 px-3 py-4 backdrop-blur-md transition-transform',
          'lg:translate-x-0',
          openMobile ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-2 pb-5">
          <Link href="/" className="font-heading text-lg text-gold" onClick={() => setOpenMobile(false)}>
            admin.hieu.asia
          </Link>
          <button
            type="button"
            onClick={() => setOpenMobile(false)}
            className="lg:hidden"
            aria-label="Đóng menu"
          >
            <X className="h-4 w-4 text-cream/60" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpenMobile(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-gold/15 text-gold'
                    : 'text-cream/75 hover:bg-gold/5 hover:text-cream',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gold/15 px-2 pt-3 font-mono text-[10px] uppercase tracking-wider text-cream/40">
          v0.1 · operations
        </div>
      </aside>
    </>
  );
}

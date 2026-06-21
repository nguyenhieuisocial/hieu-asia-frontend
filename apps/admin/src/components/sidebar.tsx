'use client';

/**
 * Admin sidebar — grouped, collapsible, mobile off-canvas.
 *
 * Groups follow the operating-model split (Wave 63.3 IA regroup):
 *   - Tổng quan (overview):    dashboard, 3rd-party overview, service status, uptime
 *   - Phiên & Khách (sessions): sessions, customers, feedback, tasks/errors
 *   - Doanh thu (revenue):     transactions, payments, billing, coupons, affiliate
 *   - Analytics:               analytics, posthog, experiments
 *   - AI & Chi phí (ai/cost):  cost, llm-spend, ai-quality, eval, vendors, prompts, rag
 *   - Nội dung (content):      content
 *   - Hệ thống (system):       keystore, secrets, connect, feature-flags, users, migrations, audit, settings
 *
 * Each group expands by default on desktop; mobile-first paint collapses
 * the bulkier `ai` + `system` groups to keep the off-canvas drawer scrollable
 * on small screens. The user's last collapse state is kept in localStorage so
 * reloads don't disrupt navigation.
 */

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
  FlaskConical,
  BarChart3,
  Cpu,
  DollarSign,
  BookOpen,
  CreditCard,
  Landmark,
  BookText,
  Settings,
  Sparkles,
  Activity,
  Menu,
  X,
  ChevronDown,
  HandCoins,
  ScrollText,
  Flag,
  Ticket,
  Shield,
  MessageSquare,
  ServerCog,
  FileText,
  Lock,
  Plug,
  Tag,
  Search,
  Server,
  Network,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    label: 'Tổng quan',
    items: [
      { href: '/', label: 'Tổng quan', Icon: LayoutDashboard },
      { href: '/architecture', label: 'Sơ đồ hệ thống', Icon: Network },
      { href: '/system', label: 'Trạng thái hệ thống', Icon: ServerCog },
      { href: '/infra', label: 'Hạ tầng', Icon: Server },
    ],
  },
  {
    id: 'sessions',
    label: 'Phiên & Khách',
    items: [
      { href: '/sessions', label: 'Phiên phân tích', Icon: ListTodo },
      { href: '/customers', label: 'Khách hàng', Icon: User },
      { href: '/feedback', label: 'Phản hồi', Icon: MessageSquare },
      { href: '/tasks', label: 'Task / Lỗi', Icon: Bot },
    ],
  },
  {
    id: 'revenue',
    label: 'Doanh thu',
    items: [
      { href: '/sepay', label: 'SePay đối soát', Icon: Landmark },
      { href: '/ledger', label: 'Sổ cái tiền', Icon: BookText },
      { href: '/payments', label: 'Thanh toán & Doanh thu', Icon: CreditCard },
      { href: '/coupons', label: 'Coupons', Icon: Ticket },
      { href: '/feature-prices', label: 'Giá tính năng', Icon: Tag },
      { href: '/affiliates', label: 'Affiliate', Icon: HandCoins },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    items: [
      { href: '/analytics', label: 'Doanh thu & Phễu', Icon: BarChart3 },
      { href: '/posthog', label: 'Traffic & Hành vi', Icon: Activity },
      { href: '/seo', label: 'Tìm kiếm Google', Icon: Search },
      { href: '/experiments', label: 'A/B Experiments', Icon: FlaskConical },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Chi phí',
    items: [
      { href: '/llm-spend', label: 'Chi phí LLM', Icon: DollarSign },
      { href: '/ai-quality', label: 'Chất lượng AI', Icon: Shield },
      { href: '/vendors', label: 'Vendors', Icon: Cpu },
      { href: '/prompts', label: 'Prompt Editor', Icon: Sparkles },
      { href: '/rag', label: 'RAG', Icon: BookOpen },
    ],
  },
  {
    id: 'content',
    label: 'Nội dung',
    items: [{ href: '/content', label: 'Nội dung', Icon: FileText }],
  },
  {
    id: 'system',
    label: 'Hệ thống',
    items: [
      { href: '/secrets', label: 'Secrets', Icon: Lock },
      { href: '/connect', label: 'Kết nối (OAuth)', Icon: Plug },
      { href: '/feature-flags', label: 'Feature flags', Icon: Flag },
      { href: '/users', label: 'Người dùng admin', Icon: Users },
      { href: '/audit', label: 'Logs & sự cố', Icon: ScrollText },
      { href: '/settings', label: 'Cài đặt', Icon: Settings },
    ],
  },
];

const COLLAPSED_KEY = 'admin-sidebar-collapsed';

export function Sidebar() {
  const pathname = usePathname();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = React.useState(false);

  // Persist collapse state in localStorage. On mobile first-paint with no
  // stored state, default-collapse the bulkier groups so the drawer is
  // immediately scannable instead of dumping every item at once.
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COLLAPSED_KEY);
      if (stored) {
        setCollapsed(new Set(JSON.parse(stored)));
      } else if (window.innerWidth < 768) {
        setCollapsed(new Set(['ai', 'system']));
      }
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...collapsed]));
    } catch {
      /* noop */
    }
  }, [collapsed, hydrated]);

  // Lock body scroll while the mobile drawer is open. Restore on close + unmount.
  React.useEffect(() => {
    if (!openMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openMobile]);

  // Close drawer on ESC.
  React.useEffect(() => {
    if (!openMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMobile(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openMobile]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const toggleGroup = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      {/* Mobile toggle — hidden while drawer is open so the close (X) button
          inside the drawer is the single canonical close affordance. */}
      {!openMobile && (
        <button
          type="button"
          onClick={() => setOpenMobile(true)}
          className="fixed left-3 top-3 z-40 inline-flex h-11 w-11 items-center justify-center rounded-md border border-gold/20 bg-card/80 text-foreground backdrop-blur lg:hidden"
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Backdrop (mobile) */}
      {openMobile && (
        <div
          className="fixed inset-0 z-40 bg-background/60 lg:hidden"
          onClick={() => setOpenMobile(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-dvh w-64 flex-col border-r border-gold/15 bg-card/95 px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform',
          'lg:translate-x-0',
          openMobile ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-2 pb-5">
          <Link
            href="/"
            className="group flex items-center gap-2"
            onClick={() => setOpenMobile(false)}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-gold via-gold/70 to-purple/70 font-heading text-sm font-bold text-ink shadow-md">
              h
            </span>
            <span className="font-heading text-base text-foreground group-hover:text-gold">
              admin<span className="text-gold">.</span>hieu
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpenMobile(false)}
            className="inline-flex h-9 w-9 items-center justify-center lg:hidden"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto pr-1">
          {NAV_GROUPS.map((group) => {
            const isCollapsed = collapsed.has(group.id);
            return (
              <div key={group.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="flex w-full items-center justify-between px-2 pb-1 text-left"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {group.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 text-muted-foreground transition-transform',
                      isCollapsed && '-rotate-90',
                    )}
                  />
                </button>
                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map(({ href, label, Icon }) => {
                      const active = isActive(href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpenMobile(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                            active
                              ? 'bg-gradient-to-r from-gold/15 via-gold/5 to-transparent text-gold shadow-gold-rail'
                              : 'text-foreground/75 hover:bg-gold/5 hover:text-foreground',
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-gold/15 px-2 pt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          v0.2 · ops console
        </div>
      </aside>
    </>
  );
}

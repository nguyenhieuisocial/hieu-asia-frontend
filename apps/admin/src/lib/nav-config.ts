/**
 * Single source of truth for the admin navigation.
 *
 * Extracted from `components/sidebar.tsx` (Wave 63.3 IA regroup) so the sidebar
 * AND the ⌘K command palette render from the exact same list — no drift between
 * the two surfaces. The sidebar imports `NAV_GROUPS` from here; do not redefine
 * groups/items elsewhere.
 *
 * Groups follow the operating-model split:
 *   - Tổng quan (overview):    dashboard, 3rd-party overview, service status, uptime
 *   - Phiên & Khách (sessions): sessions, customers, feedback, tasks/errors
 *   - Doanh thu (revenue):     transactions, payments, billing, coupons, affiliate
 *   - Analytics:               analytics, posthog, experiments
 *   - AI & Chi phí (ai/cost):  cost, llm-spend, ai-quality, eval, vendors, prompts, rag
 *   - Nội dung (content):      content
 *   - Hệ thống (system):       keystore, secrets, connect, feature-flags, users, migrations, audit, settings
 */

import type * as React from 'react';
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
  HandCoins,
  ScrollText,
  Flag,
  Ticket,
  Shield,
  MessageSquare,
  ServerCog,
  FileText,
  CalendarDays,
  Lock,
  Plug,
  Tag,
  Search,
  Server,
  Network,
  FolderTree,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    label: 'Tổng quan',
    items: [
      { href: '/', label: 'Tổng quan', Icon: LayoutDashboard },
      { href: '/copilot', label: 'Trợ lý AI', Icon: Bot },
      { href: '/architecture', label: 'Sơ đồ hệ thống', Icon: Network },
      { href: '/site-structure', label: 'Cấu trúc trang', Icon: FolderTree },
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
    items: [
      { href: '/content', label: 'Nội dung', Icon: FileText },
      { href: '/content-calendar', label: 'Lịch nội dung', Icon: CalendarDays },
    ],
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

'use client';

import * as React from 'react';
import {
  Eye,
  User,
  FileText,
  MessageCircle,
  CreditCard,
  Network,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { cn } from '@hieu-asia/ui';

export type AccountTabId =
  | 'overview'
  | 'chart'
  | 'decisions'
  | 'manual'
  | 'mentor'
  | 'payments'
  | 'affiliate'
  | 'privacy';

interface TabDef {
  id: AccountTabId;
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

export const ACCOUNT_TABS: readonly TabDef[] = [
  { id: 'overview', label: 'Tổng quan', icon: Eye },
  { id: 'chart', label: 'Lá số của tôi', icon: User },
  { id: 'decisions', label: 'Quyết định', icon: FileText },
  { id: 'manual', label: 'Sổ tay cá nhân', icon: BookOpen },
  { id: 'mentor', label: 'Mentor', icon: MessageCircle },
  { id: 'payments', label: 'Thanh toán', icon: CreditCard },
  { id: 'affiliate', label: 'Affiliate', icon: Network },
  { id: 'privacy', label: 'Quyền riêng tư', icon: ShieldCheck },
];

export interface AccountTabsProps {
  active: AccountTabId;
  onChange: (id: AccountTabId) => void;
}

export function AccountTabs({ active, onChange }: AccountTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Phần tài khoản"
      className="sticky top-16 z-20 -mx-6 border-b border-border bg-card/85 px-6 backdrop-blur supports-[backdrop-filter]:bg-card/65"
    >
      <div className="scrollbar-thin -mb-px flex gap-1 overflow-x-auto">
        {ACCOUNT_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={cn(
                'group inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'border-gold text-gold'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

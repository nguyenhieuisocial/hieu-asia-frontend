'use client';

/**
 * Dashboard quick-action grid. Each tile is a Link to the relevant admin
 * sub-page. We use a 2×N tile grid so it stays readable on mobile.
 */

import * as React from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Tag,
  Wallet,
  KeyRound,
  Sparkles,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@hieu-asia/ui';

interface Action {
  label: string;
  href: string;
  Icon: LucideIcon;
  tone: 'gold' | 'jade' | 'purple';
}

const ACTIONS: Action[] = [
  { label: 'Tạo coupon', href: '/payments', Icon: Tag, tone: 'gold' },
  { label: 'Gửi broadcast', href: '/affiliates/broadcast', Icon: Megaphone, tone: 'purple' },
  { label: 'Phê duyệt payout', href: '/affiliates', Icon: Wallet, tone: 'jade' },
  { label: 'Rotate secrets', href: '/secrets', Icon: KeyRound, tone: 'gold' },
  { label: 'Sửa prompt', href: '/prompts', Icon: Sparkles, tone: 'purple' },
  { label: 'Ingest RAG', href: '/rag', Icon: BookOpen, tone: 'jade' },
];

const TONE_CLASS: Record<Action['tone'], string> = {
  gold: 'text-gold border-gold/25 group-hover:border-gold/50 bg-gold/5',
  jade: 'text-jade-50 border-jade/25 group-hover:border-jade/50 bg-jade/5',
  purple: 'text-purple-50 border-purple/25 group-hover:border-purple/50 bg-purple/15',
};

export function QuickActions() {
  return (
    <div className="rounded-xl border border-gold/15 bg-ink/40 p-5 backdrop-blur-sm">
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-cream/85">
        Thao tác nhanh
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {ACTIONS.map((a) => (
          <Link
            key={a.href + a.label}
            href={a.href}
            className="group flex items-center gap-2.5 rounded-lg border border-gold/10 bg-ink/30 px-3 py-2.5 text-sm transition-all hover:border-gold/30 hover:bg-ink/50"
          >
            <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded-md border', TONE_CLASS[a.tone])}>
              <a.Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="text-cream/85 group-hover:text-cream">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

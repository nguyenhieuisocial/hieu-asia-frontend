'use client';

/**
 * Wave 60.58 T2.1 — FeedHero
 *
 * Dynamic greeting + single CTA. Replaces the static "Trung tâm tài khoản"
 * page header that opened the previous 8-tab settings UI. The companion
 * product (Cẩm Nang Cuộc Đời) lives or dies on whether a returning user
 * sees "hôm nay bạn cần làm gì?" within 1 viewport — not a list of tabs.
 *
 * CTA selection (priority order):
 *   1. No saved birth chart      → "Hoàn thành lá số"          → /onboarding/topic
 *   2. Has pinned insights       → "Đọc gợi ý mentor mới"       → /account/mentor
 *   3. No recent decision brief  → "Tạo decision brief mới"     → /decisions/new
 *   4. Fallback                  → "Tiếp tục với mentor"        → /reading
 *
 * Inputs are derived from cheap localStorage probes (synchronous after
 * hydration) — Wave 60.59 will wire to real DB once schema lands.
 */

import * as React from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { ArrowRight } from 'lucide-react';

const CHART_KEY = 'hieu:chart:profile:v1';
const ONBOARDING_KEY = 'hieu:onboarding:v2';

type CtaKey =
  | 'complete-chart'
  | 'read-pinned'
  | 'create-brief'
  | 'continue-mentor';

interface CtaDef {
  label: string;
  href: string;
  eyebrow: string;
}

const CTAS: Record<CtaKey, CtaDef> = {
  'complete-chart': {
    eyebrow: 'Bước tiếp theo',
    label: 'Hoàn thành lá số',
    href: '/onboarding/topic',
  },
  'read-pinned': {
    eyebrow: 'Mentor có gợi ý mới',
    label: 'Đọc gợi ý mentor',
    href: '/account/mentor',
  },
  'create-brief': {
    eyebrow: 'Đang phân vân?',
    label: 'Tạo decision brief mới',
    href: '/decisions/new',
  },
  'continue-mentor': {
    eyebrow: 'Tiếp tục',
    label: 'Trò chuyện với mentor',
    href: '/reading',
  },
};

function hasSavedChart(): boolean {
  if (typeof window === 'undefined') return true; // be conservative pre-hydrate
  try {
    const direct = window.localStorage.getItem(CHART_KEY);
    if (direct) {
      const p = JSON.parse(direct) as { birth_date?: string };
      if (p?.birth_date) return true;
    }
    const onb = window.localStorage.getItem(ONBOARDING_KEY);
    if (onb) {
      const p = JSON.parse(onb) as { birth_date?: string };
      if (p?.birth_date) return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function hasRecentBrief(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith('hieu:decisions:') && !k.endsWith(':checked')) return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function hasPinnedInsight(): boolean {
  if (typeof window === 'undefined') return false;
  // Heuristic until DB-backed pinning ships (Wave 60.59): a mentor history
  // with at least one assistant message ≥ 200 chars counts as "quotable".
  try {
    const PREFIX = 'hieu.mentor.history.';
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const raw = window.localStorage.getItem(k);
      if (!raw) continue;
      const arr = JSON.parse(raw) as Array<{ role?: string; content?: string }>;
      if (
        Array.isArray(arr) &&
        arr.some(
          (m) =>
            m?.role === 'assistant' &&
            typeof m.content === 'string' &&
            m.content.length >= 200,
        )
      ) {
        return true;
      }
    }
  } catch {
    /* ignore */
  }
  return false;
}

function pickCta(): CtaKey {
  if (!hasSavedChart()) return 'complete-chart';
  if (hasPinnedInsight()) return 'read-pinned';
  if (!hasRecentBrief()) return 'create-brief';
  return 'continue-mentor';
}

export interface FeedHeroProps {
  user: User;
}

export function FeedHero({ user }: FeedHeroProps) {
  // Default CTA picked deterministically pre-hydrate to avoid layout shift;
  // refined client-side once localStorage is available.
  const [ctaKey, setCtaKey] = React.useState<CtaKey>('continue-mentor');

  React.useEffect(() => {
    setCtaKey(pickCta());
  }, []);

  const cta = CTAS[ctaKey];
  const displayName =
    (user.user_metadata?.full_name as string | undefined)?.split(' ').pop() ??
    user.email?.split('@')[0] ??
    'bạn';

  return (
    <section className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
          Hôm nay
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Chào <span className="text-gold">{displayName}</span>, hôm nay bạn cần làm gì?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
          Một việc nhỏ thôi — đủ để hôm nay không trôi qua như mọi ngày.
        </p>
      </div>

      <Link
        href={cta.href}
        className="group flex items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-gold/[0.08] p-5 transition hover:border-gold/70 hover:bg-gold/[0.13]"
      >
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold/80">
            {cta.eyebrow}
          </p>
          <p className="mt-1.5 font-heading text-lg text-foreground sm:text-xl">
            {cta.label}
          </p>
        </div>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-gold transition group-hover:translate-x-1"
          aria-hidden
        />
      </Link>
    </section>
  );
}

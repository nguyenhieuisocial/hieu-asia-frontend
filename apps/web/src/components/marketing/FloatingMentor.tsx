'use client';

/**
 * FloatingMentor — persistent "Hỏi Mentor" entry (Bitget's always-present AI
 * assistant pattern). Desktop-only (the mobile bottom is owned by
 * StickyMobileCta, which is `md:hidden`), and hidden on the app/experience
 * routes where a floating CTA would be noise. Links into the Mentor funnel.
 */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

// Routes that are the in-product experience (or already a strong CTA surface) —
// the floating Mentor pill would be redundant/noisy there.
const HIDE_PREFIXES = [
  '/reading',
  '/checkout',
  '/dashboard',
  '/account',
  '/onboarding',
  '/mentor',
  '/journal',
  '/decisions',
  '/lo-trinh',
  '/signin',
  '/auth',
];

export function FloatingMentor() {
  const pathname = usePathname();
  if (pathname && HIDE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <Link
      href="/onboarding?intent=decision"
      data-analytics="floating-mentor"
      className="group fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full border border-primary/30 bg-card/90 px-4 py-3 text-sm font-medium text-foreground shadow-[0_6px_24px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all hover:border-primary/60 hover:bg-card md:inline-flex"
      aria-label="Hỏi AI Mentor"
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <Sparkles className="h-4 w-4 text-primary" aria-hidden />
      </span>
      Hỏi Mentor
      <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-primary transition-transform group-hover:scale-125" aria-hidden />
    </Link>
  );
}

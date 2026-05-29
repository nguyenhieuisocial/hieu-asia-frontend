'use client';

/**
 * Wave 60.58 T2.1 — /account feed dashboard.
 *
 * R1 verdict D NEW — the previous 8-tab settings UI (Tổng quan / Lá số /
 * Quyết định / Sổ tay / Mentor / Thanh toán / Affiliate / Quyền riêng tư)
 * was the wrong abstraction for the "Cẩm Nang Cuộc Đời" companion product.
 * A returning user landed on tabs, not on "what should I do today?".
 *
 * Founder approved full rebuild: this page is now a feed dashboard with
 *   1. FeedHero          — dynamic greeting + single best-next-action CTA
 *   2. ActivityFeed      — last reading / decision / mentor session, unified timeline
 *   3. PinnedInsights    — top mentor quotes worth coming back for
 *   4. QuickActions      — three primary flows (lập lá số / hỏi mentor / decision)
 *
 * Settings are no longer crammed into tabs — they live on hierarchical
 * deep routes (`/account/payments`, `/account/affiliate`, `/account/privacy`,
 * `/account/profile`, `/account/chart`, `/account/decisions`, `/account/mentor`,
 * `/account/operating-manual`). Bottom of this page links to them so they
 * remain reachable without dominating the surface.
 *
 * Tokens preserved: in-app Outfit + Be Vietnam Pro + gold/cream/jade/purple.
 * No Option D marketing tokens introduced (companion product, not landing page).
 */

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  BookOpen,
  FileText,
  MessageCircle,
  CreditCard,
  Network,
  ShieldCheck,
} from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { useAuth } from '@/hooks/use-auth';
import { FeedHero } from '@/components/account/FeedHero';
import { ActivityFeed } from '@/components/account/ActivityFeed';
import { PinnedInsights } from '@/components/account/PinnedInsights';
import { QuickActions } from '@/components/account/QuickActions';
// Wave 61.02 — Mentor conversation persistence + resume.
import { RecentConversations } from '@/components/account/RecentConversations';
import { SurveyPrompt } from '@/components/survey/SurveyPrompt';
import { SURVEY_IDS } from '@/lib/survey';
// Wave 60.69 (vault 109 §4.3 + §4.5)
import { PwaInstallPrompt } from '@/components/product/PwaInstallPrompt';
import { Fab } from '@/components/product/Fab';
import { Sparkles } from 'lucide-react';
// Wave 61.00 — Daily ritual hook (push notification subscribe).
import { SubscribePush } from '@/components/daily/SubscribePush';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoader />}>
      <AccountPageInner />
    </Suspense>
  );
}

function AccountLoader() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="pt-16">
        <AccountSkeleton />
      </main>
      <SiteFooter />
    </div>
  );
}

// Skeleton mirrors AccountPageInner first-paint blocks (hero ~240px,
// activity ~220px, insights ~220px, quick actions ~180px) to keep CLS < 0.1.
function AccountSkeleton({ message }: { message?: string } = {}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="mx-auto max-w-3xl space-y-10 px-6 pb-20 pt-12 sm:pt-16"
    >
      <div aria-hidden className="space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-card/30" />
        <div className="h-9 w-3/4 animate-pulse rounded-lg bg-card/30 sm:h-12" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-card/30" />
        <div className="mt-6 h-20 w-full animate-pulse rounded-2xl bg-card/30" />
      </div>
      <div aria-hidden className="h-[220px] w-full animate-pulse rounded-xl bg-card/30" />
      <div aria-hidden className="h-[220px] w-full animate-pulse rounded-xl bg-card/30" />
      <div aria-hidden className="h-[180px] w-full animate-pulse rounded-xl bg-card/30" />
      <span className="sr-only">{message ?? 'Đang tải trang tài khoản…'}</span>
    </div>
  );
}

/**
 * Deep-route quick links. Lives below the feed so settings are reachable
 * without competing with the primary "what should I do today?" surface.
 */
const SETTINGS_LINKS: readonly {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}[] = [
  { href: '/account/profile', label: 'Hồ sơ', icon: UserIcon },
  { href: '/account/chart', label: 'Lá số của tôi', icon: UserIcon },
  { href: '/account/operating-manual', label: 'Sổ tay cá nhân', icon: BookOpen },
  { href: '/account/decisions', label: 'Quyết định', icon: FileText },
  { href: '/account/mentor', label: 'Mentor', icon: MessageCircle },
  { href: '/account/conversations', label: 'Cuộc trò chuyện', icon: MessageCircle },
  { href: '/account/payments', label: 'Thanh toán', icon: CreditCard },
  { href: '/account/affiliate', label: 'Affiliate', icon: Network },
  { href: '/account/privacy', label: 'Quyền riêng tư', icon: ShieldCheck },
];

function AccountPageInner() {
  const router = useRouter();
  const auth = useAuth();

  // Opt-in feature-request survey via the "Góp ý" link in the footer block.
  // NPS / churn surveys arm automatically based on PostHog targeting rules.
  const [feedbackArmed, setFeedbackArmed] = React.useState(false);

  // Auth gate — same contract as the previous tabbed page.
  React.useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace('/signin?returnTo=' + encodeURIComponent('/account'));
    }
  }, [auth.loading, auth.user, router]);

  if (auth.loading || !auth.user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main id="main-content" className="pt-16">
          <AccountSkeleton
            message={
              auth.loading
                ? 'Đang kiểm tra phiên đăng nhập…'
                : 'Chuyển hướng đến trang đăng nhập…'
            }
          />
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-background opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />

        <section className="relative mx-auto max-w-3xl space-y-12 px-6 pb-20 pt-12 sm:pt-16">
          <FeedHero user={auth.user} />
          <ActivityFeed />
          <RecentConversations />
          <PinnedInsights />
          <QuickActions />

          {/* Wave 61.00 — Daily ritual hook. Web Push subscribe for "Tử vi
              6h sáng" — infra (worker fanout + KV subs + sw.js) already
              shipped; this is the discovery surface for logged-in users.
              Component self-gates on browser support and remembers state
              in localStorage so returning subscribers see "đã đăng ký". */}
          <SubscribePush vapidPublicKey={VAPID_PUBLIC_KEY} />

          {/* Wave 60.69 (vault 109 §4.3) — PWA Add-to-Home-Screen prompt. Self-
              gates on `beforeinstallprompt` event + localStorage flag + standalone
              mode, so renders nothing in browser-tab mode on iOS Safari /
              Firefox or after the user has answered once. */}
          <PwaInstallPrompt />

          <section aria-labelledby="account-settings-h">
            <div className="mb-4 flex items-baseline justify-between">
              <h2
                id="account-settings-h"
                className="font-heading text-base text-foreground/80 sm:text-lg"
              >
                Cài đặt & quản lý
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Tài khoản
              </span>
            </div>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SETTINGS_LINKS.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="flex items-center gap-2 rounded-lg border border-border bg-card/30 px-3 py-2.5 text-xs text-foreground/80 transition hover:border-gold/40 hover:text-gold"
                    >
                      <Icon className="h-3.5 w-3.5 text-gold/70" aria-hidden />
                      <span className="truncate">{s.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="rounded-xl border border-border bg-card/40 p-4 text-xs text-muted-foreground">
            Cần hỗ trợ?{' '}
            <a
              className="text-gold-700 underline underline-offset-4 hover:opacity-80"
              href="mailto:privacy@hieu.asia"
            >
              privacy@hieu.asia
            </a>
            {' · '}
            <button
              type="button"
              onClick={() => setFeedbackArmed(true)}
              className="text-gold-700 underline underline-offset-4 hover:opacity-80"
            >
              Góp ý tính năng
            </button>
          </div>
        </section>

        {/*
          Wave 39 W-B — three account-scoped surveys preserved across the
          T2.1 rebuild. PostHog targeting decides whether NPS/churn render;
          the feature-request survey arms on user click above.
        */}
        <SurveyPrompt surveyId={SURVEY_IDS.ONBOARDING_NPS} armed />
        <SurveyPrompt surveyId={SURVEY_IDS.CHURN_RISK} armed />
        <SurveyPrompt
          surveyId={SURVEY_IDS.FEATURE_REQUEST}
          armed={feedbackArmed}
        />
      </main>
      {/* Wave 60.69 (vault 109 §4.5) — FAB mounting. Primary persistent action
          on /account is "Tra cứu mới" → /onboarding. Bottom-right with
          safe-area respect inherited from Fab.tsx. */}
      <Fab
        href="/onboarding"
        icon={<Sparkles className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
        label="Tra cứu mới"
        trackId="fab_account_new_reading"
      />
      <SiteFooter />
    </div>
  );
}

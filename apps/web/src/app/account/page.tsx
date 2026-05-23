'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrCreateAnonUserId } from '@hieu-asia/supabase';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { useAuth } from '@/hooks/use-auth';
import {
  AccountTabs,
  ACCOUNT_TABS,
  type AccountTabId,
} from '@/components/account/AccountTabs';
import { OverviewTab } from '@/components/account/OverviewTab';
import { MyChartTab } from '@/components/account/MyChartTab';
import { DecisionsTab } from '@/components/account/DecisionsTab';
import { OperatingManualTab } from '@/components/account/OperatingManualTab';
import { MentorTab } from '@/components/account/MentorTab';
import { PaymentsTab } from '@/components/account/PaymentsTab';
import { AffiliateTab } from '@/components/account/AffiliateTab';
import { PrivacyTab } from '@/components/account/PrivacyTab';
import { SurveyPrompt } from '@/components/survey/SurveyPrompt';
import { SURVEY_IDS } from '@/lib/survey';

const VALID_TABS = new Set<AccountTabId>(ACCOUNT_TABS.map((t) => t.id));

function isAccountTabId(v: string | null): v is AccountTabId {
  return !!v && VALID_TABS.has(v as AccountTabId);
}

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
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="mx-auto max-w-3xl px-6 py-20 text-center"
        >
          <div
            aria-hidden
            className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
          />
          <span className="sr-only">Đang tải trang tài khoản…</span>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AccountPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const auth = useAuth();
  const [userId, setUserId] = React.useState<string | null>(null);

  // Wave 39 W-B — feature-request survey is opt-in via the "Góp ý" link
  // (rendered in the footer of this page). The NPS / churn surveys arm
  // automatically based on PostHog targeting rules (they're gated server-
  // side by audience cohorts; the wire-in here just exposes the trigger
  // point and lets PostHog decide whether to show).
  const [feedbackArmed, setFeedbackArmed] = React.useState(false);

  // Tab state: URL ?tab=... → state. Updates back to URL on change.
  // BUG-030 (Wave 54): also remember when the requested key was invalid
  // so we can surface "Tab '<key>' không tồn tại" instead of silently
  // dumping the user on Overview. BUG-037: invalid keys persist across
  // reload — we rewrite the URL to ?tab=overview to fix bookmark drift.
  const rawTab = search.get('tab');
  const initialTab: AccountTabId = isAccountTabId(rawTab) ? rawTab : 'overview';
  const [tab, setTab] = React.useState<AccountTabId>(initialTab);
  const [invalidTabKey, setInvalidTabKey] = React.useState<string | null>(
    rawTab && !isAccountTabId(rawTab) ? rawTab : null,
  );

  React.useEffect(() => {
    setUserId(getOrCreateAnonUserId() || null);
  }, []);

  // Sync tab → URL (replace, no scroll). Keep other params intact.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('tab') === tab) return;
    url.searchParams.set('tab', tab);
    window.history.replaceState(null, '', url.toString());
  }, [tab]);

  // Auto-dismiss the "invalid tab" notice after 6s so it doesn't linger.
  React.useEffect(() => {
    if (!invalidTabKey) return;
    const id = window.setTimeout(() => setInvalidTabKey(null), 6_000);
    return () => window.clearTimeout(id);
  }, [invalidTabKey]);

  // Auth gate
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
          <div
            role="status"
            aria-live="polite"
            aria-busy={auth.loading}
            className="mx-auto max-w-3xl px-6 py-20 text-center"
          >
            <div
              aria-hidden
              className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
            />
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {auth.loading
                ? 'Đang kiểm tra phiên đăng nhập…'
                : 'Chuyển hướng đến trang đăng nhập…'}
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const handleNavigate = (next: Exclude<AccountTabId, 'overview'>) => setTab(next);

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

        <section className="relative mx-auto max-w-5xl px-6 pb-20 pt-12 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Tài khoản
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Trung tâm{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">tài khoản</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
            Dữ liệu của bạn được lưu lại — không cần nhập lại mỗi lần.
          </p>

          {invalidTabKey && (
            <div
              role="status"
              aria-live="polite"
              className="mt-6 rounded-lg border border-amber-700/40 bg-amber-900/15 px-4 py-3 text-sm text-amber-100"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-300/80">
                Tab không tồn tại
              </span>
              <p className="mt-1 text-foreground/85">
                Không tìm thấy tab{' '}
                <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs text-amber-200">
                  {invalidTabKey}
                </code>
                . Đã chuyển về <strong>Tổng quan</strong>.
              </p>
            </div>
          )}

          <div className="mt-8">
            <AccountTabs active={tab} onChange={setTab} />

            <div className="mt-8">
              {tab === 'overview' && (
                <OverviewTab user={auth.user} onNavigate={handleNavigate} />
              )}
              {tab === 'chart' && <MyChartTab />}
              {tab === 'decisions' && <DecisionsTab />}
              {tab === 'manual' && <OperatingManualTab />}
              {tab === 'mentor' && <MentorTab />}
              {tab === 'payments' && <PaymentsTab />}
              {tab === 'affiliate' && <AffiliateTab />}
              {tab === 'privacy' && <PrivacyTab userId={userId} />}
            </div>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card/40 p-4 text-xs text-muted-foreground">
            Cần hỗ trợ?{' '}
            <a className="text-gold underline-offset-4 hover:underline" href="mailto:privacy@hieu.asia">
              privacy@hieu.asia
            </a>
            {' · '}
            <button
              type="button"
              onClick={() => setFeedbackArmed(true)}
              className="text-gold underline-offset-4 hover:underline"
            >
              Góp ý tính năng
            </button>
          </div>
        </section>

        {/*
          Wave 39 W-B — three account-scoped surveys:
            - Onboarding NPS  — fires once on first /account visit after a
                                completed reading (PostHog cohort targeting).
            - Churn-risk      — fires for users with last_active > 14d ago
                                (PostHog cohort targeting).
            - Feature request — armed on demand via the "Góp ý" link above.
          PostHog itself decides whether to actually render NPS/churn based
          on the targeting rules configured in the dashboard; the wire-in
          here just exposes the trigger point.
        */}
        <SurveyPrompt surveyId={SURVEY_IDS.ONBOARDING_NPS} armed />
        <SurveyPrompt surveyId={SURVEY_IDS.CHURN_RISK} armed />
        <SurveyPrompt
          surveyId={SURVEY_IDS.FEATURE_REQUEST}
          armed={feedbackArmed}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

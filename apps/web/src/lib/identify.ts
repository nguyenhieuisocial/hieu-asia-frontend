/**
 * Identify helpers — build a rich PostHog user profile from the Supabase
 * auth user, attach group analytics (membership tier, persona), and alias
 * any pre-signup anonymous distinct_id to merge browse → identified data.
 */

import type { User } from '@supabase/supabase-js';
import { getPostHog } from './posthog';
import type { MembershipTier } from './event-taxonomy';

const ANON_USER_KEY = 'hieu.user_id';
const AFFILIATE_KEY = 'hieu.affiliate.signup';
const PERSONA_KEY = 'hieu.persona';

interface AffiliateInfo {
  is_affiliate: boolean;
  affiliate_tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

function readAffiliateInfo(): AffiliateInfo {
  try {
    const raw = window.localStorage.getItem(AFFILIATE_KEY);
    if (!raw) return { is_affiliate: false };
    const parsed = JSON.parse(raw) as {
      tier?: AffiliateInfo['affiliate_tier'];
    };
    return { is_affiliate: true, affiliate_tier: parsed?.tier };
  } catch {
    return { is_affiliate: false };
  }
}

function readPersona(): string | null {
  try {
    return window.localStorage.getItem(PERSONA_KEY);
  } catch {
    return null;
  }
}

async function readMembershipTier(): Promise<MembershipTier> {
  try {
    const res = await fetch('/api/user/me', { cache: 'no-store' });
    if (!res.ok) return 'free';
    const data = (await res.json()) as { membership_tier?: MembershipTier };
    return data?.membership_tier ?? 'free';
  } catch {
    return 'free';
  }
}

/**
 * Identify the user in PostHog with a full profile, alias any prior
 * anonymous distinct_id, and attach membership/persona groups.
 *
 * Safe to call multiple times — PostHog dedupes by distinct_id.
 */
export async function identifyUser(user: User): Promise<void> {
  const ph = getPostHog();
  if (!ph) return;

  // Alias the prior anonymous id → merges browse data with the new identity.
  try {
    const anonId = window.localStorage.getItem(ANON_USER_KEY);
    if (anonId && anonId !== user.id) {
      ph.alias(user.id, anonId);
    }
  } catch {
    /* ignore */
  }

  const affiliate = readAffiliateInfo();
  const persona = readPersona();
  const tier = await readMembershipTier();

  const metadata = (user.user_metadata ?? {}) as {
    full_name?: string;
    avatar_url?: string;
  };

  let locale: string | undefined;
  let timezone: string | undefined;
  try {
    locale = navigator.language;
  } catch {
    /* ignore */
  }
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    /* ignore */
  }

  const props: Record<string, unknown> = {
    email: user.email,
    email_verified: !!user.email_confirmed_at,
    full_name: metadata.full_name,
    avatar_url: metadata.avatar_url,
    signup_date: user.created_at,
    last_login_at: new Date().toISOString(),
    locale,
    timezone,
    is_affiliate: affiliate.is_affiliate,
    affiliate_tier: affiliate.affiliate_tier,
    membership_tier: tier,
  };

  try {
    ph.identify(user.id, props);
  } catch {
    /* ignore */
  }

  // Group analytics — tier cohort + persona segment.
  try {
    ph.group('membership_tier', tier);
  } catch {
    /* ignore */
  }
  if (persona) {
    try {
      ph.group('persona', persona);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Attach the user to a `persona` group (founder / genz / midage / …) once
 * onboarding completes. Stored in localStorage so subsequent sessions can
 * re-attach without another network call.
 */
export function setPersona(persona: string): void {
  try {
    window.localStorage.setItem(PERSONA_KEY, persona);
  } catch {
    /* ignore */
  }
  try {
    getPostHog()?.group('persona', persona);
  } catch {
    /* ignore */
  }
}

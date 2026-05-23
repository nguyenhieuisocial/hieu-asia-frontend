'use client';

/**
 * usePartnerGuard — client-side gate for /partner/* pages.
 *
 * Wave 44. Combines Supabase Auth session (via useAuth) with a check
 * against `/api/partner/me` (which queries hieu_asia.users.app_role using
 * the user's JWT, so RLS naturally limits exposure). If the user is not
 * signed in OR not an affiliate_partner, redirects to /signin or
 * /account?error=not-partner respectively.
 *
 * Returns:
 *   { status: 'loading' }                          while resolving
 *   { status: 'ok', user, affiliate }              when authorized
 *   { status: 'redirecting' }                      while redirect runs
 *
 * The page should render a loading skeleton while not 'ok'.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getSupabaseAuth } from '@/lib/auth-client';

export interface PartnerMe {
  user_id: string;
  email: string | null;
  app_role: string;
  affiliate: {
    user_id: string;
    affiliate_code: string;
    path: string;
    depth: number;
    tier: string;
    status: string;
    parent_user_id: string | null;
    created_at: string;
    payout_method: string | null;
    payout_details: Record<string, unknown> | null;
    // Wave 45 — payout rail config (per-affiliate preference).
    preferred_rail?: 'manual_csv' | 'wise' | 'stripe_connect';
    rail_account_external_id?: string | null;
    rail_account_status?: 'pending' | 'verified' | 'rejected' | 'manual_only';
  } | null;
}

type GuardState =
  | { status: 'loading' }
  | { status: 'redirecting' }
  | { status: 'ok'; user: { id: string; email: string | null }; me: PartnerMe };

export function usePartnerGuard(): GuardState {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [state, setState] = React.useState<GuardState>({ status: 'loading' });

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      if (loading) return;
      if (!user) {
        setState({ status: 'redirecting' });
        router.replace('/signin?next=/partner');
        return;
      }
      try {
        const supabase = getSupabaseAuth();
        if (!supabase) {
          setState({ status: 'redirecting' });
          router.replace('/signin?next=/partner');
          return;
        }
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) {
          setState({ status: 'redirecting' });
          router.replace('/signin?next=/partner');
          return;
        }
        const r = await fetch('/api/partner/me', {
          headers: { authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (cancelled) return;
        if (r.status === 401) {
          setState({ status: 'redirecting' });
          router.replace('/signin?next=/partner');
          return;
        }
        const d = (await r.json()) as { ok: boolean; me?: PartnerMe; error?: string };
        if (!r.ok || !d.ok || !d.me) {
          setState({ status: 'redirecting' });
          router.replace('/account?error=not-partner');
          return;
        }
        if (d.me.app_role !== 'affiliate_partner' || !d.me.affiliate) {
          setState({ status: 'redirecting' });
          router.replace('/account?error=not-partner');
          return;
        }
        setState({
          status: 'ok',
          user: { id: user.id, email: user.email ?? null },
          me: d.me,
        });
      } catch {
        if (cancelled) return;
        setState({ status: 'redirecting' });
        router.replace('/account?error=not-partner');
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [user, loading, router]);

  return state;
}

/**
 * Read the current user JWT for direct fetch calls (server proxy routes).
 * Returns null when no session.
 */
export async function getPartnerJwt(): Promise<string | null> {
  const supabase = getSupabaseAuth();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

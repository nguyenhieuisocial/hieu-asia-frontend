'use client';

/**
 * /auth/callback — magic-link landing page.
 *
 * Supabase Auth (`detectSessionInUrl: true`) tự động đọc query/hash params
 * và lưu session. Page này:
 *   1. Đợi session sẵn sàng (getSession)
 *   2. Stash anonymous user id vào `hieu.linked_anon_user_id` để dashboard
 *      có thể gọi backend merge endpoint sau (chưa wire — TODO)
 *   3. Redirect về /dashboard hoặc /signin?error=...
 */

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseAuth } from '@/lib/auth-client';
import { getPostHog } from '@/lib/posthog';

const ANON_USER_KEY = 'hieu.user_id';
const LINKED_ANON_KEY = 'hieu.linked_anon_user_id';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const supabase = getSupabaseAuth();
    if (!supabase) {
      router.replace('/signin?error=auth_unavailable');
      return;
    }

    // ?error / ?error_description from Supabase
    const errParam = searchParams.get('error_description') || searchParams.get('error');
    if (errParam) {
      router.replace(`/signin?error=${encodeURIComponent(errParam)}`);
      return;
    }

    let cancelled = false;
    (async () => {
      // detectSessionInUrl handles token exchange on its own; we just poll
      // getSession once it's done.
      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;
      if (error) {
        router.replace(`/signin?error=${encodeURIComponent(error.message)}`);
        return;
      }
      if (!data.session) {
        router.replace('/signin?error=no_session');
        return;
      }

      // Stash anonymous id so a future merge endpoint can link reading
      // history (handled in dashboard or by a backend job — out of scope).
      try {
        const anonId = window.localStorage.getItem(ANON_USER_KEY);
        if (anonId && anonId !== data.session.user.id) {
          window.localStorage.setItem(LINKED_ANON_KEY, anonId);
        }
      } catch {
        /* localStorage blocked — ignore */
      }

      // Identify the authenticated user in PostHog so subsequent events tie
      // back to a stable distinct_id. No-op when PostHog isn't configured.
      try {
        const ph = getPostHog();
        if (ph) {
          ph.identify(data.session.user.id, {
            email: data.session.user.email,
          });
        }
      } catch {
        /* ignore */
      }

      router.replace('/dashboard');
    })();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-ink text-cream flex items-center justify-center">
      <div className="text-center">
        <p className="font-heading text-gold text-lg">Đang xác thực…</p>
        <p className="mt-2 text-sm text-cream/60">
          Vui lòng chờ trong giây lát.
        </p>
      </div>
    </main>
  );
}

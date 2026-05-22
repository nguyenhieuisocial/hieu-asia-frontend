'use client';

/**
 * /auth/callback — magic-link & OAuth landing page.
 *
 * Supabase Auth (`detectSessionInUrl: true`) tự động đọc query/hash params
 * và lưu session. Page này:
 *   1. Parse error params từ cả ?query và #hash (Supabase trả error qua hash
 *      khi OTP expired / OAuth bị deny).
 *   2. Đợi session sẵn sàng (getSession).
 *   3. Stash anonymous user id vào `hieu.linked_anon_user_id` để dashboard
 *      có thể gọi backend merge endpoint sau.
 *   4. Track new vs returning user (magic_link vs oauth method từ app_metadata).
 *   5. Redirect về /dashboard hoặc /signin?error=... (friendly translated).
 */

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseAuth } from '@/lib/auth-client';
import { identifyUser } from '@/lib/identify';
import { track } from '@/lib/analytics';

const ANON_USER_KEY = 'hieu.user_id';
const LINKED_ANON_KEY = 'hieu.linked_anon_user_id';

/**
 * Translate raw Supabase auth error strings to user-friendly VN copy.
 * Falls back to the original message when no mapping matches.
 */
function translateAuthError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes('otp_expired') || lower.includes('expired')) {
    return 'Liên kết đã hết hạn. Vui lòng yêu cầu lại.';
  }
  if (lower.includes('invalid') && lower.includes('link')) {
    return 'Liên kết đã hết hạn. Vui lòng yêu cầu lại.';
  }
  if (lower.includes('access_denied') || lower.includes('access denied')) {
    return 'Truy cập bị từ chối. Vui lòng thử lại.';
  }
  if (lower.includes('server_error')) {
    return 'Có lỗi từ máy chủ. Vui lòng thử lại.';
  }
  return raw;
}

/**
 * Parse URL hash for Supabase OAuth/magic-link errors. Supabase returns
 * errors via the URL fragment (e.g. `#error=access_denied&error_code=otp_expired`)
 * which `useSearchParams` does NOT see. We must read `window.location.hash`.
 */
function parseHashError(): { error: string; code?: string } | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return null;
  const params = new URLSearchParams(hash.slice(1));
  const error = params.get('error_description') || params.get('error');
  if (!error) return null;
  const code = params.get('error_code') || undefined;
  return { error, code };
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const supabase = getSupabaseAuth();
    if (!supabase) {
      router.replace('/signin?error=auth_unavailable');
      return;
    }

    // Check hash FIRST (where OAuth/OTP-expired errors land), then query.
    const hashErr = parseHashError();
    if (hashErr) {
      const raw = hashErr.code === 'otp_expired' ? 'otp_expired' : hashErr.error;
      const friendly = translateAuthError(raw);
      router.replace(`/signin?error=${encodeURIComponent(friendly)}`);
      return;
    }

    // ?error / ?error_description / ?error_code from Supabase (query variant).
    const errParam =
      searchParams.get('error_description') ||
      searchParams.get('error_code') ||
      searchParams.get('error');
    if (errParam) {
      const friendly = translateAuthError(errParam);
      router.replace(`/signin?error=${encodeURIComponent(friendly)}`);
      return;
    }

    let cancelled = false;
    (async () => {
      // detectSessionInUrl handles token exchange on its own; we just poll
      // getSession once it's done.
      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;
      if (error) {
        router.replace(`/signin?error=${encodeURIComponent(translateAuthError(error.message))}`);
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

      // Rich identify (email, name, avatar, locale, affiliate, membership)
      // + alias prior anon distinct_id + group analytics. No-op without PH.
      try {
        await identifyUser(data.session.user);
      } catch {
        /* ignore */
      }

      try {
        const newUser =
          !!data.session.user.created_at &&
          Date.now() - new Date(data.session.user.created_at).getTime() < 60_000;
        // Distinguish magic_link from oauth via app_metadata.provider
        // (Supabase sets this to 'email' for OTP, 'google'/'facebook'/'apple' for OAuth).
        const provider = data.session.user.app_metadata?.provider;
        const method: 'magic_link' | 'oauth' =
          provider && provider !== 'email' ? 'oauth' : 'magic_link';
        track('user_identified', {
          user_id: data.session.user.id,
          new_user: newUser,
        });
        if (newUser) {
          track('signup_completed', { method });
        } else {
          track('signin_completed', { method });
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
        <p className="mt-2 text-sm text-cream/75">
          Vui lòng chờ trong giây lát.
        </p>
      </div>
    </main>
  );
}

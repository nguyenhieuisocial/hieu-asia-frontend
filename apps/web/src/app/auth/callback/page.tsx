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
 *   5. Redirect về /account hoặc /signin?error=... (friendly translated).
 */

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseAuth } from '@/lib/auth-client';
import { identifyUser } from '@/lib/identify';
import { onboardAffiliateFromRef } from '@/lib/affiliate-onboard';
import { readAffiliateRef } from '@/lib/affiliate-ref';
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

      // Claim the prior anonymous id so the dashboard can show readings created
      // before login. We persist it into the GoTrue-signed `user_metadata`
      // (server-trusted) via the authenticated client — this is what
      // /api/reading/list reads back (session.linkedAnonId), NOT the localStorage
      // copy. The localStorage stash is kept only as a client-side breadcrumb.
      //
      // SECURITY: writing this through `updateUser` means the only id that can
      // be claimed is the one the *currently authenticated* browser presents,
      // and the server later trusts it because it's signed into the user record
      // — a different user cannot inject this anon id into someone else's
      // account. We only set it once (don't clobber an existing claim).
      try {
        const anonId = window.localStorage.getItem(ANON_USER_KEY);
        if (anonId && anonId !== data.session.user.id) {
          window.localStorage.setItem(LINKED_ANON_KEY, anonId);
          const existing = data.session.user.user_metadata?.linked_anon_user_id;
          if (!existing) {
            // Fire-and-forget; failure just means history-claim is deferred to a
            // later login. Shape is validated server-side before it's trusted.
            await supabase.auth
              .updateUser({ data: { linked_anon_user_id: anonId } })
              .catch(() => {
                /* non-fatal — claim retried on next login */
              });
          }
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

      // Wave 32 — first-touch L1 attribution. Reads `hieu_ref` cookie (set by
      // middleware on /r/<CODE> or ?ref=<CODE>) and POSTs to worker's
      // /aff/onboard. Idempotent, fire-and-forget, swallows errors.
      void onboardAffiliateFromRef();

      try {
        const newUser =
          !!data.session.user.created_at &&
          Date.now() - new Date(data.session.user.created_at).getTime() < 60_000;
        // Distinguish magic_link from oauth via app_metadata.provider
        // (Supabase sets this to 'email' for OTP, 'google'/'facebook'/'apple' for OAuth).
        const provider = data.session.user.app_metadata?.provider;
        const method: 'magic_link' | 'oauth' =
          provider && provider !== 'email' ? 'oauth' : 'magic_link';
        const refCode = readAffiliateRef();
        track('user_identified', {
          user_id: data.session.user.id,
          new_user: newUser,
        });
        if (newUser) {
          track('signup_completed', {
            method,
            ...(refCode ? { referral_code: refCode } : {}),
          });
        } else {
          track('signin_completed', { method });
        }
      } catch {
        /* ignore */
      }

      // Wave 44.4 (#251): honor `?next=` param from signin → magic-link
      // → callback roundtrip. Open-redirect guard: only allow same-origin
      // relative paths (must start with `/`); fallback to `/account`.
      const nextParam = searchParams.get('next');
      const dest =
        // Open-redirect guard: same-origin relative path only. `//evil.com` and
        // `/\evil.com` are protocol-relative — browsers treat them as absolute — so
        // `startsWith('/')` alone is not enough; reject those too.
        nextParam &&
        typeof nextParam === 'string' &&
        nextParam.startsWith('/') &&
        !nextParam.startsWith('//') &&
        !nextParam.startsWith('/\\')
          ? nextParam
          : '/account';
      router.replace(dest);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <p className="font-heading text-gold text-lg">Đang xác thực…</p>
        <p className="mt-2 text-sm text-foreground/75">
          Vui lòng chờ trong giây lát.
        </p>
      </div>
    </main>
  );
}

'use client';

/**
 * useAuth — subscribe to Supabase Auth session state.
 *
 * Returns `{ user, loading }` where `user` is the Supabase auth user or
 * `null` if logged out / no client. Components that need the access token
 * for backend calls should use `session.access_token` from the underlying
 * client directly (this hook intentionally only exposes the user).
 */

import * as React from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseAuth } from '@/lib/auth-client';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    loading: true,
  });

  React.useEffect(() => {
    const supabase = getSupabaseAuth();
    if (!supabase) {
      setState({ user: null, loading: false });
      return;
    }

    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        setState({ user: data.session?.user ?? null, loading: false });
      })
      .catch(() => {
        // getSession() có thể reject ở ngữ cảnh storage bị chặn (iOS strict /
        // private mode). Bắt tại đây để KHÔNG nổi thành unhandled-rejection
        // (PostHog capture_exceptions sẽ đổ vào Sentry); coi như chưa đăng nhập.
        if (!cancelled) setState({ user: null, loading: false });
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setState({ user: session?.user ?? null, loading: false });
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

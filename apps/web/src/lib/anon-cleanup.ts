/**
 * Anonymous-state cleanup.
 *
 * On logout we sign out of Supabase via auth-client.ts. But the anonymous-user
 * data we collected before login still sits in localStorage:
 *   - hieu.user_id          → anonymous PostHog distinct_id
 *   - hieu.session_id       → reading session ID
 *   - hieu.persona          → onboarding-derived persona
 *   - hieu.affiliate.signup → affiliate referrer code
 *   - hieu:onboarding:v2    → onboarding draft
 *
 * If a different user signs in on the same browser, they inherit this data.
 * Call `clearAnonState()` on logout AND on successful sign-in (post-callback)
 * to wipe.
 *
 * Profile/saved-profile/journal/decisions/operating-manual data is deliberately
 * NOT cleared — that's the user's own data and the /account export flow handles
 * it. Auth-related anonymous keys only.
 */

const ANON_KEYS = [
  'hieu.user_id',
  'hieu.session_id',
  'hieu.persona',
  'hieu.affiliate.signup',
  'hieu:onboarding:v2',
  'hieu.linked_anon_user_id', // remove old link marker after sign-in
] as const;

export function clearAnonState(): void {
  if (typeof window === 'undefined') return;
  for (const k of ANON_KEYS) {
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* storage disabled — ignore */
    }
  }
}

/**
 * Variant: wipe everything anonymous AND personal. Used by /account → Erase
 * data action when user requests full local wipe (different from GDPR worker
 * erase which deletes server data).
 */
export function clearAllLocalData(): void {
  if (typeof window === 'undefined') return;
  const keysToWipe: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && (k.startsWith('hieu.') || k.startsWith('hieu:') || k.startsWith('hieu_'))) {
      keysToWipe.push(k);
    }
  }
  for (const k of keysToWipe) {
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  }
}

/**
 * /affiliate/leaderboard — retired (redirects to the dashboard).
 *
 * An earnings leaderboard is a "greed-trigger" pattern that doesn't fit a
 * trust-first brand, and at pre-launch (~0 affiliates) it is empty anyway. The
 * route is de-linked from the affiliate nav and now redirects to the dashboard.
 */

import { redirect } from 'next/navigation';

export default function AffiliateLeaderboardPage() {
  redirect('/affiliate/dashboard');
}

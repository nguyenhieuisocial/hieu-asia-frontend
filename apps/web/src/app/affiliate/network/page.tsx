/**
 * /affiliate/network — retired (redirects to the dashboard).
 *
 * This page previously showed a multi-tier (L1/L2/L3) "mạng lưới" tree, which
 * advertised a downline-payout model the program does NOT run: commission is
 * SINGLE-TIER (only the direct referrer earns 30% / 10%). Advertising
 * multi-tier would imply an unregistered MLM (Nghị định 40/2018) — a legal +
 * trust risk for a trust-first brand. The route is de-linked from the affiliate
 * nav and now redirects to the dashboard, where an affiliate sees their own
 * referrals and earnings.
 */

import { redirect } from 'next/navigation';

export default function AffiliateNetworkPage() {
  redirect('/affiliate/dashboard');
}

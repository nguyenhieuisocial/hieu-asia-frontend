/**
 * /signup — soft-redirect to /signin (Wave 60.95.m P0).
 *
 * hieu.asia uses passwordless auth (Supabase magic-link + OAuth: Google /
 * Facebook / Apple) — first-time signup and returning sign-in share the
 * same /signin page (magic-link auto-creates accounts on first send).
 *
 * Marketing / ad creative may reference /signup (industry convention).
 * Without this route, those links 404 → wasted traffic. This page
 * server-side redirects to /signin while preserving query string
 * (UTM tags, ?next=, etc.) and tagging `signup=1` for downstream use.
 *
 * `robots.noindex` — we don't want Google to index the redirect page
 * itself; the canonical sign-in URL is /signin.
 */

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'Tạo tài khoản miễn phí qua email hoặc OAuth (Google / Facebook / Apple).',
  robots: { index: false, follow: true },
};

type SearchParams = { [k: string]: string | string[] | undefined };

interface SignupRedirectPageProps {
  // Next.js 15 — searchParams is a Promise.
  searchParams?: Promise<SearchParams>;
}

export default async function SignupRedirectPage({
  searchParams,
}: SignupRedirectPageProps) {
  const params = (await searchParams) ?? {};
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'string') {
      qs.set(k, v);
    } else if (Array.isArray(v)) {
      v.forEach((vv) => qs.append(k, vv));
    }
  }
  // Tag so /signin (or analytics) can distinguish signup-intent arrivals.
  qs.set('signup', '1');
  redirect(`/signin?${qs.toString()}`);
}

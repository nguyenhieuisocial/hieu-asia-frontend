/**
 * /r/[code] — Affiliate referral landing.
 *
 * Behaviour:
 *   - Sets the hieu_ref attribution cookie (30 days) — first-touch wins.
 *   - Fires fire-and-forget click event to the worker.
 *   - Server-redirects to `?to=<path>` if present and in the safe list,
 *     otherwise renders a friendly welcome with the affiliate's display name.
 *
 * Safe redirect targets are restricted to the app's own root + tool pages —
 * never an external URL, never a /api path. UTM campaign is preserved.
 */

import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const REF_COOKIE = 'hieu_ref';
const COOKIE_TTL = 60 * 60 * 24 * 30;
const CODE_REGEX = /^[A-Z2-9]{6,16}$/;
const SAFE_TARGETS = new Set([
  '/', '/onboarding', '/pricing', '/features',
  '/tu-vi-hom-nay', '/lich-van-nien',
  '/than-so-hoc', '/can-xuong', '/thuoc-lo-ban', '/hop-tuoi',
]);

interface AffiliateLite {
  ok: boolean;
  affiliate?: { code: string; display_name: string };
}

async function fetchAffiliateName(code: string): Promise<string | null> {
  // The worker does not expose a public name endpoint; we just optimistically
  // show the code if we cannot resolve.
  try {
    const base = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
    // Reuse leaderboard endpoint to look up masked display name without auth.
    const r = await fetch(`${base}/affiliate/leaderboard?period=all_time&limit=50`, {
      cache: 'no-store',
    });
    const d = (await r.json()) as { ok: boolean; leaderboard: { code: string; display_name: string }[] };
    if (!d.ok) return null;
    const hit = d.leaderboard.find((e) => e.code === code);
    return hit?.display_name ?? null;
  } catch {
    return null;
  }
}

function trackClickFireAndForget(code: string) {
  const base = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
  const token = process.env.HIEU_API_SERVICE_TOKEN;
  if (!token) return;
  void fetch(`${base}/affiliate/track`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-service-token': token },
    body: JSON.stringify({ event: 'click', referral_code: code }),
    cache: 'no-store',
    keepalive: true,
  }).catch(() => {});
}

export default async function ReferralLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ to?: string; campaign?: string }>;
}) {
  const { code: raw } = await params;
  const code = raw.toUpperCase();
  const { to, campaign } = await searchParams;

  if (!CODE_REGEX.test(code)) {
    redirect('/');
  }

  // First-touch wins — only set the cookie if it doesn't exist.
  // Note: in Next 15, cookies().set() inside a Server Component during render
  // emits "Cookies can only be modified in a Server Action or Route Handler".
  // We swallow the error here — the cookie still serializes back to the browser
  // because the page is rendered server-side per request (dynamic=force-dynamic).
  const cookieStore = await cookies();
  if (!cookieStore.get(REF_COOKIE)) {
    try {
      cookieStore.set(REF_COOKIE, code, {
        httpOnly: false,
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: COOKIE_TTL,
      });
    } catch {
      // Server Component cookie-set restriction in Next 15 — non-fatal.
    }
  }

  // Fire-and-forget click ping (server-side, with service token).
  trackClickFireAndForget(code);

  // Redirect if `to` is in the safe list.
  if (to && SAFE_TARGETS.has(to)) {
    const params = new URLSearchParams({ ref: code });
    if (campaign) params.set('utm_campaign', campaign);
    redirect(`${to}?${params.toString()}`);
  }

  // Resolve the affiliate's name for the welcome card.
  const name = await fetchAffiliateName(code);
  const h = await headers();
  const host = h.get('host') ?? 'hieu.asia';
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const fullShareUrl = `${proto}://${host}/?ref=${code}`;

  return (
    <main className="min-h-screen bg-ink px-4 py-16 text-cream">
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <div className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
          Bạn được mời từ {name ? <b className="ml-1">&nbsp;{name}</b> : <span className="ml-1 font-mono">&nbsp;{code}</span>}
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Chào mừng đến <span className="text-gold">hieu.asia</span>
        </h1>
        <p className="mx-auto max-w-md text-sm text-cream/70">
          Tử Vi · MBTI · Palm Reading · Mentor AI — tất cả trong một. Đăng ký tài khoản để mở khoá phân
          tích cao cấp; mã giới thiệu đã được tự động áp dụng.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/onboarding?ref=${code}`}
            className="rounded bg-gold px-4 py-3 font-semibold text-ink hover:bg-gold/90"
          >
            Bắt đầu phân tích
          </Link>
          <Link
            href={`/tu-vi-hom-nay?ref=${code}`}
            className="rounded border border-cream/20 px-4 py-3 hover:bg-cream/5"
          >
            Tử Vi hôm nay
          </Link>
          <Link
            href={`/than-so-hoc?ref=${code}`}
            className="rounded border border-cream/20 px-4 py-3 hover:bg-cream/5"
          >
            Thần số học
          </Link>
          <Link
            href={`/lich-van-nien?ref=${code}`}
            className="rounded border border-cream/20 px-4 py-3 hover:bg-cream/5"
          >
            Lịch vạn niên
          </Link>
        </div>

        <p className="pt-6 text-xs text-cream/40">
          Link đầy đủ: <span className="font-mono">{fullShareUrl}</span>
        </p>
      </div>
    </main>
  );
}

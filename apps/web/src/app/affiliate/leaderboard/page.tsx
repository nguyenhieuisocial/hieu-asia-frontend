/**
 * /affiliate/leaderboard — Wave 48 public leaderboard.
 *
 * Server component fetching the materialized view `mv_affiliate_leaderboard`
 * via the worker endpoint `GET /affiliate/leaderboard?limit=50`. Renders top
 * 50 affiliates ordered by `total_earned_vnd DESC`, refreshed hourly.
 *
 * PII guard: only `affiliate_code` (non-PII slug), `tier`, totals, order count
 * are surfaced. `user_id` returned by the upstream endpoint is dropped
 * server-side before render — it never reaches the client bundle.
 */

import Link from 'next/link';
import Script from 'next/script';
import { Trophy } from 'lucide-react';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { AffiliateSubNav } from '@/components/affiliate/AffiliateSubNav';
import { LeaderboardPodium } from '@/components/affiliate/LeaderboardPodium';

// NOTE (Wave 48 P2-C): page.tsx and opengraph-image.tsx each declare their own
// `revalidate = 60`. Crawlers fetching seconds apart can see slightly mismatched
// snapshots between the HTML and the OG card. We accept this drift: (a) social
// platforms cache OG images far longer than 60s (Twitter ~7d, FB hours), so the
// crawler-side cache dominates anyway; (b) sharing an `unstable_cache` between
// the page and the OG image route adds complexity without changing the
// crawler-observable behaviour. Keep both at 60s independently.
export const revalidate = 60;

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

export interface PublicLeaderboardRow {
  affiliate_code: string;
  tier: string | null;
  total_earned_vnd: number;
  total_orders: number;
}

interface UpstreamRow {
  user_id?: string;
  affiliate_code?: string;
  tier?: string | null;
  total_earned_vnd?: number | string | null;
  total_orders?: number | string | null;
  // KV-fallback shape (pre-Wave 46) — still possible if Supabase env unset.
  code?: string;
  conversions?: number;
  total_earned?: number;
}

async function loadLeaderboard(): Promise<PublicLeaderboardRow[]> {
  try {
    const r = await fetch(`${HIEU_API_URL}/affiliate/leaderboard?limit=50`, {
      next: { revalidate: 60 },
    });
    if (!r.ok) return [];
    const d = (await r.json()) as { ok?: boolean; leaderboard?: UpstreamRow[] };
    if (!d.ok || !Array.isArray(d.leaderboard)) return [];
    // PII strip: drop user_id, keep only public columns.
    return d.leaderboard.map((row) => ({
      affiliate_code: row.affiliate_code ?? row.code ?? '',
      tier: row.tier ?? null,
      total_earned_vnd: Number(row.total_earned_vnd ?? row.total_earned ?? 0),
      total_orders: Number(row.total_orders ?? row.conversions ?? 0),
    }));
  } catch {
    return [];
  }
}

function vnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export default async function AffiliateLeaderboardPage() {
  const rows = await loadLeaderboard();
  const totalEarned = rows.reduce((s, r) => s + r.total_earned_vnd, 0);
  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  // JSON-LD payload — server-rendered.
  //
  // Cache layering (Wave 48 P2-A note):
  //   worker Cache API (60s) → page revalidate (60s) → social crawler cache (varies).
  // Worst-case staleness on first commission landing is ~2 min (worker miss +
  // ISR miss happen in sequence). Acceptable: the materialised view refreshes
  // hourly on the worker side, and the page reflows on next revalidate.
  //
  // PII guard: affiliate_code is a public non-PII slug (Wave 43 design — same
  // value used in shareable affiliate links). Embedding it in ItemList.name is
  // safe. user_id, email, payout rails never enter LD-JSON. All numeric fields
  // go through Number() before JSON.stringify. No untrusted strings reach the
  // LD-JSON literal.
  const ldJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'hieu.asia',
        url: 'https://hieu.asia',
      },
      {
        '@type': 'WebPage',
        '@id': 'https://hieu.asia/affiliate/leaderboard',
        name: 'Bảng vàng Affiliate hieu.asia — Top 50',
        description:
          totalEarned > 0
            ? `Cộng đồng affiliate hieu.asia đã kiếm tổng cộng ${vnd(totalEarned)}.`
            : 'Bảng xếp hạng top 50 affiliate hieu.asia, cập nhật mỗi giờ.',
        numberOfItems: rows.length,
        // Wave 48 P3-A: richer schema — top 10 ItemList for SERP carousel.
        mainEntity: {
          '@type': 'ItemList',
          name: 'Top 10 affiliate hieu.asia',
          numberOfItems: Math.min(rows.length, 10),
          itemListOrder: 'https://schema.org/ItemListOrderDescending',
          itemListElement: rows.slice(0, 10).map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: r.affiliate_code,
          })),
        },
      },
    ],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />

        <section className="relative mx-auto max-w-4xl px-6 pt-12 pb-20 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <Link href="/affiliate" className="hover:text-gold">Affiliate</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Bảng vàng</span>
          </nav>

          <AffiliateSubNav />

          <header className="text-center">
            <div
              aria-hidden="true"
              className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/15 via-background to-purple/20"
            >
              <Trophy className="h-5 w-5 text-gold" aria-hidden="true" />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
              Affiliate · Bảng vàng
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Bảng vàng{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                affiliate hieu.asia
              </span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Top 50 affiliate kiếm nhiều nhất — tổng hợp 60 phút trước. Danh
              tính được ẩn, chỉ hiển thị mã affiliate công khai.
            </p>
            {totalEarned > 0 && (
              <p className="mt-3 text-sm text-gold-700">
                Tổng cộng cộng đồng đã kiếm được{' '}
                <strong className="font-semibold">{vnd(totalEarned)}</strong>
              </p>
            )}
          </header>

          {/* Top 3 podium */}
          {top3.length > 0 && (
            <div className="mt-10">
              <LeaderboardPodium top3={top3} />
            </div>
          )}

          {/* Rest of the list, rank 4..50 */}
          {rest.length > 0 && (
            <ol className="mt-8 space-y-2">
              {rest.map((r, idx) => (
                <li
                  key={r.affiliate_code || idx}
                  className="flex items-center justify-between rounded-xl border border-border bg-card/40 px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 text-right font-mono text-sm text-muted-foreground">
                      #{idx + 4}
                    </span>
                    <div>
                      <div className="font-mono text-sm font-medium text-foreground">
                        {r.affiliate_code || '—'}
                      </div>
                      {r.tier && (
                        <div className="mt-0.5">
                          <TierBadge tier={r.tier} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gold-700">{vnd(r.total_earned_vnd)}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.total_orders.toLocaleString('vi-VN')} đơn
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {rows.length === 0 && (
            <Card className="mt-10 border-border bg-card/40">
              <CardContent className="px-6 py-12 text-center">
                <p className="font-heading text-base text-foreground">
                  Chưa có dữ liệu
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Bảng vàng làm mới mỗi giờ. Hãy là người đầu tiên — đăng ký
                  affiliate và bắt đầu giới thiệu.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="mt-12 text-center">
            <Button asChild variant="ghost" className="border border-border"><Link href="/affiliate">
              
                Đăng ký affiliate
              
            </Link></Button>
          </div>
        </section>

        {/* JSON-LD — Next.js Script with strategy "afterInteractive" */}
        <Script
          id="leaderboard-jsonld"
          type="application/ld+json"
        >
          {ldJson}
        </Script>
      </main>
      <SiteFooter />
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    bronze: 'bg-orange-500/15 text-orange-200 border-orange-500/30',
    silver: 'bg-slate-400/15 text-slate-200 border-slate-400/30',
    gold: 'bg-gold/15 text-gold-700 border-gold/30',
    platinum: 'bg-purple/15 text-purple-200 border-purple/30',
  };
  const cls = colors[tier.toLowerCase()] ?? 'bg-muted/30 text-muted-foreground border-border';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cls}`}
    >
      {tier}
    </span>
  );
}

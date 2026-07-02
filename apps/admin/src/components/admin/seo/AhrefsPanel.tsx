'use client';

/**
 * AhrefsPanel — competitive-SEO snapshot on the admin /seo page.
 *
 * Complements Google Search Console (our own search performance) with Ahrefs'
 * off-site strength: Domain Rating, backlinks + referring domains, and organic
 * keyword/traffic estimates. Data comes from the server-only /api/admin/seo/
 * ahrefs route (key never touches the client), cached 24h upstream (Ahrefs bills
 * API units per call).
 *
 * Degrades honestly: no key → setup card telling the founder exactly what to
 * add; key set but Ahrefs unreachable → retry note. Never a fake number.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Gauge, Link2, Globe, Search, TrendingUp } from 'lucide-react';

interface AhrefsOverview {
  target: string;
  date: string;
  domainRating: number | null;
  ahrefsRank: number | null;
  liveBacklinks: number | null;
  liveRefdomains: number | null;
  allTimeBacklinks: number | null;
  orgKeywords: number | null;
  orgKeywordsTop3: number | null;
  orgTraffic: number | null;
  orgTrafficValueUsd: number | null;
}

interface AhrefsResp {
  ok: boolean;
  configured: boolean;
  overview: AhrefsOverview | null;
}

async function fetchAhrefs(): Promise<AhrefsResp> {
  try {
    const r = await fetch('/api/admin/seo/ahrefs', { cache: 'no-store' });
    return (await r.json()) as AhrefsResp;
  } catch {
    return { ok: false, configured: false, overview: null };
  }
}

function fmtInt(v: number | null): string {
  return v == null ? '—' : new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(v);
}

export function AhrefsPanel() {
  const q = useQuery({
    queryKey: ['admin', 'ahrefs-overview'],
    queryFn: fetchAhrefs,
    // Server caches 24h; client can be relaxed too (units are precious).
    staleTime: 60 * 60 * 1000,
  });

  const data = q.data;
  const ov = data?.overview ?? null;

  const cells: Array<{ label: string; value: string; sub?: string; icon: React.ReactNode }> = ov
    ? [
        {
          label: 'Referring domains',
          value: fmtInt(ov.liveRefdomains),
          sub: ov.allTimeBacklinks != null ? `${fmtInt(ov.allTimeBacklinks)} backlink từng có` : undefined,
          icon: <Globe className="h-4 w-4" aria-hidden />,
        },
        {
          label: 'Backlinks (live)',
          value: fmtInt(ov.liveBacklinks),
          icon: <Link2 className="h-4 w-4" aria-hidden />,
        },
        {
          label: 'Từ khóa organic',
          value: fmtInt(ov.orgKeywords),
          sub: ov.orgKeywordsTop3 != null ? `${fmtInt(ov.orgKeywordsTop3)} trong Top 3` : undefined,
          icon: <Search className="h-4 w-4" aria-hidden />,
        },
        {
          label: 'Traffic organic/tháng',
          value: fmtInt(ov.orgTraffic),
          sub: ov.orgTrafficValueUsd != null ? `≈ $${fmtInt(ov.orgTrafficValueUsd)}/tháng` : undefined,
          icon: <TrendingUp className="h-4 w-4" aria-hidden />,
        },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-gold/70" aria-hidden />
          Ahrefs — sức mạnh tên miền &amp; backlink
        </CardTitle>
        <CardDescription>
          Bổ trợ Search Console: độ mạnh off-site (Domain Rating, backlink, từ khóa/traffic organic
          ước tính). Nguồn Ahrefs Site Explorer{ov ? ` · ${ov.target} · ${ov.date}` : ''}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {q.isLoading ? (
          <div className="h-28 animate-pulse rounded bg-muted/30" aria-hidden />
        ) : data && data.configured === false ? (
          // No key — tell the founder exactly what to add. The panel lights up
          // automatically once AHREFS_API_KEY is set on the admin (Vercel env).
          <div className="rounded-md border border-gold/25 bg-gold/5 px-4 py-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground/90">Chưa kết nối Ahrefs.</p>
            <p className="mt-1">
              Thêm biến môi trường{' '}
              <code className="font-mono text-gold/80">AHREFS_API_KEY</code> cho app admin
              (Vercel → Settings → Environment Variables), tùy chọn{' '}
              <code className="font-mono text-gold/80">AHREFS_TARGET</code> (mặc định{' '}
              <code className="font-mono text-gold/80">hieu.asia</code>). Bảng sẽ tự hiện dữ liệu sau
              khi deploy lại.
            </p>
          </div>
        ) : !ov ? (
          <div className="flex h-24 items-center justify-center text-center text-sm text-muted-foreground">
            Chưa lấy được dữ liệu Ahrefs (lỗi tạm thời hoặc hết units). Thử lại sau.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Domain Rating — the headline number. */}
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-semibold tracking-tight text-gold">
                {ov.domainRating != null ? ov.domainRating.toFixed(0) : '—'}
              </span>
              <div className="text-xs text-muted-foreground">
                <div className="uppercase tracking-wider">Domain Rating (0–100)</div>
                {ov.ahrefsRank != null && <div>Ahrefs Rank #{fmtInt(ov.ahrefsRank)}</div>}
              </div>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cells.map((c) => (
                <div key={c.label} className="rounded-lg border border-border/60 bg-card/40 px-3 py-2">
                  <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {c.icon}
                    {c.label}
                  </dt>
                  <dd className="mt-0.5 text-lg font-semibold text-foreground">{c.value}</dd>
                  {c.sub && <dd className="text-[11px] text-muted-foreground">{c.sub}</dd>}
                </div>
              ))}
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

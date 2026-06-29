'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  toast,
} from '@hieu-asia/ui';
import { safeJson } from '@/lib/safe-json';

interface AffiliateMe {
  ok: boolean;
  code?: string;
  share_url?: string;
  l1_count?: number;
  l2_count?: number;
  l3_count?: number;
  total_commission_vnd?: number;
  error?: string;
}

function fmtVnd(n: number | undefined): string {
  if (typeof n !== 'number') return '—';
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  } catch {
    return `${n} ₫`;
  }
}

export function AffiliateTab() {
  const [data, setData] = React.useState<AffiliateMe | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [notSignedUp, setNotSignedUp] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/affiliate/me', { cache: 'no-store' });
        const j = await safeJson<AffiliateMe>(res);
        if (j.ok && j.data.ok) {
          setData(j.data);
        } else if (j.status === 401) {
          setNotSignedUp(true);
        }
      } catch {
        /* best-effort */
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Đã copy');
    } catch {
      toast.error('Không copy được');
    }
  }

  return (
    <div
      role="tabpanel"
      id="panel-affiliate"
      aria-labelledby="tab-affiliate"
      className="space-y-6"
    >
      <div>
        <h2 className="font-heading text-2xl text-foreground sm:text-3xl">Affiliate</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Mã giới thiệu, số người bạn giới thiệu và hoa hồng tổng. Chi tiết xem trong{' '}
          <Link href="/affiliate/dashboard" className="text-gold hover:underline">
            bảng điều khiển
          </Link>
          .
        </p>
      </div>

      {!loaded ? (
        <Card>
          <CardContent
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="py-8 text-center text-sm text-muted-foreground"
          >
            Đang tải…
          </CardContent>
        </Card>
      ) : notSignedUp || !data ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bạn chưa tham gia affiliate</CardTitle>
            <CardDescription>
              Đăng ký để nhận mã giới thiệu và 30% hoa hồng trên đơn của khách bạn giới thiệu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild={false}>
              <Link href="/affiliate/signup">Đăng ký affiliate</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mã giới thiệu</CardTitle>
              <CardDescription>Chia sẻ để nhận 30% hoa hồng trên đơn của khách bạn giới thiệu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <code className="rounded-md border border-border bg-card/60 px-3 py-1.5 font-mono text-sm text-gold">
                  {data.code ?? '—'}
                </code>
                {data.code && (
                  <Button size="sm" variant="outline" onClick={() => copy(data.code!)}>
                    Copy code
                  </Button>
                )}
              </div>
              {data.share_url && (
                <div className="flex flex-wrap items-center gap-2">
                  <code className="max-w-full truncate rounded-md border border-border bg-card/60 px-3 py-1.5 font-mono text-xs text-foreground/85">
                    {data.share_url}
                  </code>
                  <Button size="sm" variant="outline" onClick={() => copy(data.share_url!)}>
                    Copy link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            <MiniStat label="Người bạn đã giới thiệu" value={data.l1_count ?? 0} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hoa hồng</CardTitle>
              <CardDescription>Tổng đã ghi nhận tới hôm nay.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-heading text-2xl text-gold">
                {fmtVnd(data.total_commission_vnd)}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild={false}>
                  <Link href="/affiliate/dashboard">Vào bảng điều khiển</Link>
                </Button>
                <Button variant="outline" asChild={false}>
                  <Link href="/affiliate/commissions">Xem hoa hồng</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-2xl text-foreground">{value}</p>
    </div>
  );
}

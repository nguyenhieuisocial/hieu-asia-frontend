'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { HandCoins, ExternalLink } from 'lucide-react';
import { fmtVnd } from '@/lib/format';

interface CustomerAffiliate {
  ok: boolean;
  is_affiliate: boolean;
  affiliate_code: string | null;
  status: string | null;
  balance: { available_vnd: number; pending_vnd: number; paid_vnd: number };
  configured: boolean;
}

async function fetchCustomerAffiliate(userId: string): Promise<CustomerAffiliate> {
  const r = await fetch(`/api/admin/customers/${encodeURIComponent(userId)}/affiliate`, { cache: 'no-store' });
  return (await r.json()) as CustomerAffiliate;
}

export function CustomerAffiliateCard({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customer', userId, 'affiliate'],
    queryFn: () => fetchCustomerAffiliate(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  if (!userId) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <HandCoins className="h-4 w-4 text-gold/70" aria-hidden />
          Cộng tác viên (CTV)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {isLoading ? (
          <div className="h-10 animate-pulse rounded bg-muted/30" />
        ) : data && data.configured === false ? (
          <p className="text-xs italic text-muted-foreground">Chưa kết nối Supabase để tra cứu CTV.</p>
        ) : data?.is_affiliate ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
                Là CTV{data.affiliate_code ? ` · ${data.affiliate_code}` : ''}
              </span>
              {data.status && (
                <span className="rounded border border-border bg-muted/20 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {data.status}
                </span>
              )}
            </div>
            <dl className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Khả dụng</dt>
                <dd className="font-mono text-jade-700 dark:text-jade-50">{fmtVnd(data.balance.available_vnd)}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Chờ duyệt</dt>
                <dd className="font-mono text-foreground/85">{fmtVnd(data.balance.pending_vnd)}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Đã chi</dt>
                <dd className="font-mono text-muted-foreground">{fmtVnd(data.balance.paid_vnd)}</dd>
              </div>
            </dl>
            <Link
              href="/affiliates?tab=commissions"
              className="inline-flex items-center gap-1 text-xs text-gold underline-offset-2 hover:underline"
            >
              Quản lý hoa hồng / chi trả <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Khách này không phải cộng tác viên.</p>
        )}
      </CardContent>
    </Card>
  );
}

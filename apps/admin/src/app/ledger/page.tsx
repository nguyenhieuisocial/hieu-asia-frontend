'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Skeleton, Tabs, TabsList, TabsTrigger, TabsContent } from '@hieu-asia/ui';
import { BookText, ArrowDownLeft, ArrowUpRight, Scale, Info } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { ErrorBlock } from '@/components/admin/error-block';
import { EmptyState } from '@/components/admin/empty-state';
import { formatDateOrEmpty } from '@/lib/format-date';
import { fmtVnd } from '@/lib/format';
import { buildLedger, type LedgerMovement } from '@/lib/ledger';
import { AccountingTab } from '@/components/admin/ledger/AccountingTab';

const fmtDate = (iso: string) => formatDateOrEmpty(iso, '—');

interface PaymentTxn {
  id: string;
  created_at: string;
  type: string;
  intent_id?: string | null;
  user_id?: string | null;
  amount?: number | null;
}
interface PayoutRow {
  id: number;
  affiliate_code: string;
  amount_vnd: number;
  paid_at: string | null;
  reference: string | null;
  batch_id: string | null;
}

interface LedgerData {
  movements: LedgerMovement[];
  payoutOk: boolean;
}

async function fetchLedgerData(): Promise<LedgerData> {
  const [txnRes, payoutRes] = await Promise.all([
    fetch('/api/admin-proxy/payment/transactions?limit=500', { cache: 'no-store' }),
    fetch('/api/admin/affiliates/payouts-ledger?status=paid&limit=500', { cache: 'no-store' }),
  ]);
  // The payment ledger is the primary source — a hard failure there is a real error.
  if (!txnRes.ok) throw new Error(`Không tải được giao dịch (HTTP ${txnRes.status})`);
  const txn = (await txnRes.json().catch(() => ({}))) as { ok?: boolean; records?: PaymentTxn[] };
  // Worker soft-errors return HTTP 200 + {ok:false}; treat that as a real error
  // rather than silently rendering an empty ledger that hides a backend failure.
  if (txn && txn.ok === false) throw new Error('Worker trả lỗi khi tải giao dịch');

  const movements: LedgerMovement[] = [];
  if (txn?.ok && Array.isArray(txn.records)) {
    for (const r of txn.records) {
      const amount = Number(r.amount ?? 0);
      if (r.type === 'intent_paid') {
        movements.push({
          date: r.created_at,
          source: 'sepay',
          kind: 'Thanh toán',
          direction: 'in',
          amountVnd: amount,
          ref: r.intent_id ?? undefined,
          who: r.user_id ?? undefined,
        });
      } else if (r.type === 'refund_completed' || r.type === 'refund') {
        movements.push({
          date: r.created_at,
          source: 'refund',
          kind: 'Hoàn tiền',
          direction: 'out',
          amountVnd: amount,
          ref: r.intent_id ?? undefined,
          who: r.user_id ?? undefined,
        });
      }
    }
  }

  // Affiliate payouts are best-effort — if Supabase is unreachable, still show
  // the revenue/refund ledger rather than failing the whole page.
  let payoutOk = false;
  if (payoutRes.ok) {
    const payout = (await payoutRes.json().catch(() => ({}))) as { ok?: boolean; payouts?: PayoutRow[] };
    if (payout?.ok && Array.isArray(payout.payouts)) {
      payoutOk = true;
      for (const p of payout.payouts) {
        if (!p.paid_at) continue;
        movements.push({
          date: p.paid_at,
          source: 'affiliate_payout',
          kind: 'Chi hoa hồng',
          direction: 'out',
          amountVnd: Number(p.amount_vnd ?? 0),
          ref: p.reference ?? p.batch_id ?? String(p.id),
          who: p.affiliate_code ?? undefined,
        });
      }
    }
  }

  return { movements, payoutOk };
}

const SOURCE_LABEL: Record<LedgerMovement['source'], { label: string; href: string }> = {
  sepay: { label: 'SePay', href: '/sepay' },
  refund: { label: 'Hoàn tiền', href: '/sepay?tab=refunds' },
  affiliate_payout: { label: 'Hoa hồng', href: '/affiliates?tab=payouts' },
};

function CashFlowView() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'ledger'],
    queryFn: fetchLedgerData,
    staleTime: 60_000,
  });

  const ledger = React.useMemo(() => buildLedger(data?.movements ?? []), [data?.movements]);

  // Display newest-first (running balance is computed oldest→newest, so reverse a copy).
  const recent = React.useMemo(() => [...ledger.entries].reverse(), [ledger.entries]);

  return (
    <div className="space-y-6">
      {error ? (
        <ErrorBlock message={(error as Error).message} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Tổng tiền vào"
              value={fmtVnd(ledger.inTotal)}
              hint="Thanh toán (intent_paid)"
              accent="jade"
              icon={<ArrowDownLeft className="h-4 w-4" />}
            />
            <KpiCard
              label="Tổng tiền ra"
              value={fmtVnd(ledger.outTotal)}
              hint="Hoàn tiền + chi hoa hồng"
              accent="red"
              icon={<ArrowUpRight className="h-4 w-4" />}
            />
            <KpiCard
              label="Số dư ròng"
              value={fmtVnd(ledger.netTotal)}
              hint="Vào − ra (tiền mặt, chưa trừ chi phí AI)"
              accent={ledger.netTotal >= 0 ? 'gold' : 'red'}
              icon={<Scale className="h-4 w-4" />}
            />
            <KpiCard
              label="Số ngày có giao dịch"
              value={ledger.daily.length.toLocaleString('vi-VN')}
              hint={`${ledger.entries.length.toLocaleString('vi-VN')} dòng tiền`}
              accent="purple"
            />
          </div>

          <Card className="border-gold/15 bg-card/60">
            <CardContent className="flex items-start gap-2 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              <span>
                Sổ cái này chỉ tính <strong>tiền mặt VND</strong>: tiền vào (thanh toán) − tiền ra (hoàn
                tiền + chi hoa hồng). <strong>Chi phí AI</strong> (USD) không gộp vào đây — xem{' '}
                <Link href="/llm-spend" className="text-gold underline-offset-2 hover:underline">
                  /llm-spend
                </Link>
                . Đối soát chi tiết với ngân hàng ở{' '}
                <Link href="/sepay" className="text-gold underline-offset-2 hover:underline">
                  /sepay
                </Link>
                .{' '}
                {data && !data.payoutOk && (
                  <span className="text-amber-600 dark:text-amber-300">
                    (Chưa tải được chi hoa hồng — số liệu tạm thiếu phần này.)
                  </span>
                )}
              </span>
            </CardContent>
          </Card>

          {ledger.entries.length === 0 ? (
            <EmptyState
              title="Chưa có dòng tiền nào"
              description="Khi có thanh toán / hoàn tiền / chi hoa hồng, chúng sẽ hiện ở đây."
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Day rollup */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">Theo ngày</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[60vh] overflow-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-card/95 text-muted-foreground backdrop-blur">
                        <tr className="border-b border-border/50">
                          <th className="px-3 py-2 text-left font-medium">Ngày</th>
                          <th className="px-3 py-2 text-right font-medium">Vào</th>
                          <th className="px-3 py-2 text-right font-medium">Ra</th>
                          <th className="px-3 py-2 text-right font-medium">Ròng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ledger.daily.map((d) => (
                          <tr key={d.date} className="border-b border-border/30">
                            <td className="px-3 py-1.5 font-mono text-foreground/85">{d.date}</td>
                            <td className="px-3 py-1.5 text-right text-jade-700 dark:text-jade-50">
                              {d.inVnd ? fmtVnd(d.inVnd) : '—'}
                            </td>
                            <td className="px-3 py-1.5 text-right text-red-600 dark:text-red-300">
                              {d.outVnd ? `−${fmtVnd(d.outVnd)}` : '—'}
                            </td>
                            <td
                              className={`px-3 py-1.5 text-right font-medium ${
                                d.netVnd >= 0 ? 'text-foreground' : 'text-red-600 dark:text-red-300'
                              }`}
                            >
                              {fmtVnd(d.netVnd)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Chronological movements (newest first) */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-sm">Dòng tiền chi tiết (mới nhất trước)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[60vh] overflow-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-card/95 text-muted-foreground backdrop-blur">
                        <tr className="border-b border-border/50">
                          <th className="px-3 py-2 text-left font-medium">Thời gian</th>
                          <th className="px-3 py-2 text-left font-medium">Nguồn</th>
                          <th className="px-3 py-2 text-right font-medium">Số tiền</th>
                          <th className="px-3 py-2 text-right font-medium">Số dư</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((e, i) => (
                          <tr key={`${e.ref ?? e.source}-${e.date}-${i}`} className="border-b border-border/30">
                            <td className="whitespace-nowrap px-3 py-1.5 text-foreground/80">{fmtDate(e.date)}</td>
                            <td className="px-3 py-1.5">
                              <Link
                                href={SOURCE_LABEL[e.source].href}
                                className="text-gold underline-offset-2 hover:underline"
                              >
                                {e.kind}
                              </Link>
                              {e.who && (
                                <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                                  {e.who.length > 16 ? `${e.who.slice(0, 16)}…` : e.who}
                                </span>
                              )}
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 py-1.5 text-right font-medium ${
                                e.direction === 'in'
                                  ? 'text-jade-700 dark:text-jade-50'
                                  : 'text-red-600 dark:text-red-300'
                              }`}
                            >
                              {e.direction === 'in' ? '+' : '−'}
                              {fmtVnd(e.amountVnd)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-1.5 text-right font-mono text-foreground/70">
                              {fmtVnd(e.runningBalanceVnd)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function LedgerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<BookText className="h-5 w-5 text-gold" />}
        title="Sổ cái tiền (VND)"
        description="Dòng tiền vào/ra + sổ kế toán kép. Chỉ đọc với tiền thật — ghi bút toán / đối soát là sổ-sách, không chuyển tiền ở đây."
      />
      <Tabs defaultValue="cashflow">
        <TabsList>
          <TabsTrigger value="cashflow">Dòng tiền</TabsTrigger>
          <TabsTrigger value="accounting">Kế toán kép</TabsTrigger>
        </TabsList>
        <TabsContent value="cashflow" className="mt-4">
          <CashFlowView />
        </TabsContent>
        <TabsContent value="accounting" className="mt-4">
          <AccountingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

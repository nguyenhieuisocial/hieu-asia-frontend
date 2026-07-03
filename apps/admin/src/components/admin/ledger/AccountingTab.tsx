'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Skeleton,
  toast,
} from '@hieu-asia/ui';
import { Scale, CheckCircle2, AlertTriangle, Plus, Lock, Info } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { ErrorBlock } from '@/components/admin/error-block';
import { useAdminRole } from '@/hooks/useAdminRole';
import { formatDateOrEmpty } from '@/lib/format-date';
import { fmtVnd } from '@/lib/format';
import { trackAdminMutation } from '@/lib/admin-breadcrumb';

const fmtDate = (iso: string) => formatDateOrEmpty(iso, '—');

interface JournalLine {
  account: string;
  debit: number;
  credit: number;
}
interface JournalEntry {
  id: string;
  date: string;
  source: string;
  memo: string;
  ref?: string;
  lines: JournalLine[];
  manual?: boolean;
}
interface AccountBalance {
  id: string;
  label: string;
  normal: 'debit' | 'credit';
  debit: number;
  credit: number;
  balance: number;
}
interface TrialBalance {
  accounts: AccountBalance[];
  totalDebit: number;
  totalCredit: number;
  balanced: boolean;
}
interface PeriodClose {
  period_end: string;
  closed_at: string;
  by: string;
  trial_balance: TrialBalance;
}
interface AccountDef {
  id: string;
  label: string;
  normal: 'debit' | 'credit';
}
interface Payload {
  ok: boolean;
  accounts: AccountDef[];
  entries: JournalEntry[];
  trial_balance: TrialBalance;
  outstanding_affiliate_liability_vnd: number;
  cash_balance_vnd: number;
  reconciled_ids: string[];
  closes: PeriodClose[];
  affiliate_source_ok: boolean;
  generated_at: string;
  error?: string;
}

const SOURCE_LABEL: Record<string, string> = {
  revenue: 'Thanh toán',
  refund: 'Hoàn tiền',
  commission: 'Hoa hồng',
  payout: 'Chi hoa hồng',
  manual: 'Bút toán tay',
};

async function fetchAccounting(): Promise<Payload> {
  const r = await fetch('/api/admin/ledger/accounting', { cache: 'no-store' });
  const data = (await r.json()) as Payload;
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data;
}

export function AccountingTab() {
  const qc = useQueryClient();
  const { isOwner } = useAdminRole();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'ledger', 'accounting'],
    queryFn: fetchAccounting,
    staleTime: 60_000,
  });

  const [journalOpen, setJournalOpen] = React.useState(false);
  const [closeOpen, setCloseOpen] = React.useState(false);
  const accounts = React.useMemo(() => data?.accounts ?? [], [data?.accounts]);
  const reconciledSet = React.useMemo(() => new Set(data?.reconciled_ids ?? []), [data?.reconciled_ids]);

  // manual entry form
  const [drAcct, setDrAcct] = React.useState('');
  const [crAcct, setCrAcct] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [memo, setMemo] = React.useState('');
  const [entryDate, setEntryDate] = React.useState('');
  const [periodEnd, setPeriodEnd] = React.useState('');

  React.useEffect(() => {
    if (accounts.length >= 2 && !drAcct && !crAcct) {
      setDrAcct(accounts[0]!.id);
      setCrAcct(accounts[1]!.id);
    }
  }, [accounts, drAcct, crAcct]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'ledger', 'accounting'] });
  };

  const journalMut = useMutation({
    mutationFn: async () => {
      const amt = Math.round(Number(amount));
      if (!Number.isFinite(amt) || amt <= 0) throw new Error('Số tiền phải > 0');
      if (drAcct === crAcct) throw new Error('Tài khoản Nợ và Có phải khác nhau');
      const r = await fetch('/api/admin/ledger/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: entryDate || undefined,
          memo,
          lines: [
            { account: drAcct, debit: amt, credit: 0 },
            { account: crAcct, debit: 0, credit: amt },
          ],
        }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d;
    },
    onSuccess: () => {
      trackAdminMutation('ledger.journal', 'success');
      toast.success('Đã ghi bút toán');
      invalidate();
      setJournalOpen(false);
      setAmount('');
      setMemo('');
      setEntryDate('');
    },
    onError: (e) => toast.error('Ghi bút toán thất bại', { description: (e as Error).message }),
  });

  const reconcileMut = useMutation({
    mutationFn: async ({ id, reconciled }: { id: string; reconciled: boolean }) => {
      const r = await fetch('/api/admin/ledger/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry_id: id, reconciled }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d;
    },
    onSuccess: () => invalidate(),
    onError: (e) => toast.error('Đối soát thất bại', { description: (e as Error).message }),
  });

  const voidMut = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch('/api/admin/ledger/journal/void', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d;
    },
    onSuccess: () => {
      trackAdminMutation('ledger.void', 'success');
      toast.success('Đã huỷ bút toán');
      invalidate();
    },
    onError: (e) => toast.error('Huỷ thất bại', { description: (e as Error).message }),
  });

  const closeMut = useMutation({
    mutationFn: async () => {
      if (!periodEnd) throw new Error('Chọn ngày chốt kỳ');
      const r = await fetch('/api/admin/ledger/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_end: periodEnd }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d;
    },
    onSuccess: () => {
      trackAdminMutation('ledger.close', 'success');
      toast.success('Đã chốt kỳ');
      invalidate();
      setCloseOpen(false);
      setPeriodEnd('');
    },
    onError: (e) => toast.error('Chốt kỳ thất bại', { description: (e as Error).message }),
  });

  if (error) return <ErrorBlock message={(error as Error).message} onRetry={() => refetch()} />;
  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const tb = data.trial_balance;
  const previewAmt = Math.round(Number(amount)) || 0;

  return (
    <div className="space-y-6">
      {/* Balance status + KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Trạng thái sổ"
          value={tb.balanced ? 'Cân ✓' : 'LỆCH ✗'}
          hint={`Nợ ${fmtVnd(tb.totalDebit)} · Có ${fmtVnd(tb.totalCredit)}`}
          accent={tb.balanced ? 'jade' : 'red'}
          icon={tb.balanced ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
        />
        <KpiCard label="Số dư tiền mặt" value={fmtVnd(data.cash_balance_vnd)} hint="Doanh thu − hoàn − chi" accent="gold" icon={<Scale className="h-4 w-4" />} />
        <KpiCard
          label="Công nợ CTV phải trả"
          value={fmtVnd(data.outstanding_affiliate_liability_vnd)}
          hint="Hoa hồng đã ghi − đã chi"
          accent={data.outstanding_affiliate_liability_vnd > 0 ? 'warn' : 'jade'}
        />
        <KpiCard label="Số bút toán" value={data.entries.length.toLocaleString('vi-VN')} accent="purple" />
      </div>

      {!data.affiliate_source_ok && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-start gap-2 p-3 text-xs text-amber-700 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>Chưa tải được phần hoa hồng CTV (Supabase) — sổ tạm thiếu công nợ/chi CTV. Tiền mặt + doanh thu vẫn đúng.</span>
          </CardContent>
        </Card>
      )}

      <Card className="border-gold/15 bg-card/60">
        <CardContent className="flex items-start gap-2 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          <span>
            Sổ kế toán kép VND — mỗi đồng ghi 2 vế (nợ/có), sách luôn cân. Chỉ-đọc với tiền thật: ghi bút
            toán / đối soát / chốt kỳ là sổ-sách, <strong>không chuyển tiền</strong>. Chi phí AI (USD) không tính ở đây.
          </span>
        </CardContent>
      </Card>

      {/* Trial balance + actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-sm">Bảng cân đối tài khoản</CardTitle>
          <div className="flex items-center gap-2">
            {isOwner ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setJournalOpen(true)}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Ghi bút toán
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCloseOpen(true)}>
                  <Lock className="mr-1 h-3.5 w-3.5" /> Chốt kỳ
                </Button>
              </>
            ) : (
              <span className="text-[10px] text-muted-foreground">Ghi bút toán / chốt kỳ cần quyền chủ (owner)</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <th className="px-3 py-2 text-left font-medium">Tài khoản</th>
                <th className="px-3 py-2 text-right font-medium">Nợ</th>
                <th className="px-3 py-2 text-right font-medium">Có</th>
                <th className="px-3 py-2 text-right font-medium">Số dư</th>
              </tr>
            </thead>
            <tbody>
              {tb.accounts.map((a) => (
                <tr key={a.id} className="border-b border-border/30">
                  <td className="px-3 py-1.5 text-foreground/85">{a.label}</td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums text-muted-foreground">{a.debit ? fmtVnd(a.debit) : '—'}</td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums text-muted-foreground">{a.credit ? fmtVnd(a.credit) : '—'}</td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums font-medium text-foreground">{fmtVnd(a.balance)}</td>
                </tr>
              ))}
              <tr className="border-t border-gold/20 font-medium">
                <td className="px-3 py-2 text-foreground">Tổng</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-foreground">{fmtVnd(tb.totalDebit)}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-foreground">{fmtVnd(tb.totalCredit)}</td>
                <td className={`px-3 py-2 text-right ${tb.balanced ? 'text-jade-700 dark:text-jade-50' : 'text-red-600 dark:text-red-300'}`}>
                  {tb.balanced ? '✓ cân' : '✗ lệch'}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Journal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Nhật ký bút toán (mới nhất trước)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[60vh] overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card/95 text-muted-foreground backdrop-blur">
                <tr className="border-b border-border/50">
                  <th className="px-3 py-2 text-left font-medium">Thời gian</th>
                  <th className="px-3 py-2 text-left font-medium">Diễn giải</th>
                  <th className="px-3 py-2 text-right font-medium">Số tiền</th>
                  <th className="px-3 py-2 text-center font-medium">Đối soát</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((e) => {
                  const amt = e.lines.reduce((s, l) => s + (l.debit || 0), 0);
                  return (
                    <tr key={e.id} className="border-b border-border/30 align-top">
                      <td className="whitespace-nowrap px-3 py-1.5 text-foreground/75">{fmtDate(e.date)}</td>
                      <td className="px-3 py-1.5">
                        <div className="text-foreground/90">
                          <span className="rounded bg-gold/10 px-1 py-px font-mono text-[9px] text-gold">{SOURCE_LABEL[e.source] ?? e.source}</span>{' '}
                          {e.memo}
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                          {e.lines.map((l, i) => (
                            <span key={i}>
                              {l.debit ? `Nợ ${labelOf(accounts, l.account)} ${fmtVnd(l.debit)}` : `Có ${labelOf(accounts, l.account)} ${fmtVnd(l.credit)}`}
                              {i < e.lines.length - 1 ? ' · ' : ''}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-right font-mono tabular-nums text-foreground/85">{fmtVnd(amt)}</td>
                      <td className="px-3 py-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={reconciledSet.has(e.id)}
                          onChange={(ev) => reconcileMut.mutate({ id: e.id, reconciled: ev.target.checked })}
                          className="h-3.5 w-3.5 accent-gold"
                          aria-label="Đánh dấu đã đối soát"
                        />
                        {e.manual && isOwner && (
                          <button
                            type="button"
                            onClick={() => voidMut.mutate(e.id)}
                            className="ml-2 text-[10px] text-red-500 hover:underline"
                            disabled={voidMut.isPending}
                          >
                            huỷ
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Period closes */}
      {data.closes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Kỳ đã chốt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-xs">
            {data.closes.map((c, i) => (
              <div key={`${c.period_end}-${i}`} className="flex items-center justify-between gap-2 border-b border-border/30 pb-1">
                <span className="font-mono text-foreground/85">đến {c.period_end.slice(0, 10)}</span>
                <span className="text-muted-foreground">
                  {c.trial_balance.balanced ? '✓ cân' : '✗ lệch'} · {fmtVnd(c.trial_balance.totalDebit)} · {fmtDate(c.closed_at)} · {c.by}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Manual journal dialog */}
      <Dialog open={journalOpen} onOpenChange={setJournalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ghi bút toán tay</DialogTitle>
            <DialogDescription>
              Bút toán 2 vế — ghi Nợ một tài khoản, Có tài khoản khác cùng số tiền. Sổ-sách thuần, không chuyển tiền thật.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Ghi Nợ</Label>
                <select value={drAcct} onChange={(e) => setDrAcct(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs">
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">Ghi Có</Label>
                <select value={crAcct} onChange={(e) => setCrAcct(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs">
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Số tiền (VND)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" min={1} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Diễn giải</Label>
              <Input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="VD: điều chỉnh phí ngân hàng" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Ngày (bỏ trống = hôm nay)</Label>
              <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="mt-1" />
            </div>
            {previewAmt > 0 && drAcct !== crAcct && (
              <p className="rounded bg-muted/30 px-2 py-1.5 font-mono text-[11px] text-muted-foreground">
                Nợ {labelOf(accounts, drAcct)} {fmtVnd(previewAmt)} · Có {labelOf(accounts, crAcct)} {fmtVnd(previewAmt)} — cân ✓
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setJournalOpen(false)}>Hủy</Button>
            <Button onClick={() => journalMut.mutate()} disabled={journalMut.isPending || !amount || drAcct === crAcct}>
              {journalMut.isPending ? 'Đang ghi…' : 'Ghi bút toán'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close period dialog */}
      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chốt kỳ kế toán</DialogTitle>
            <DialogDescription>
              Chụp lại bảng cân đối tính đến ngày chọn (gồm cả ngày đó) để lưu mốc. Không khoá ghi — chỉ lưu ảnh chụp.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label className="text-xs">Chốt đến ngày</Label>
            <Input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className="mt-1" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCloseOpen(false)}>Hủy</Button>
            <Button onClick={() => closeMut.mutate()} disabled={closeMut.isPending || !periodEnd}>
              {closeMut.isPending ? 'Đang chốt…' : 'Chốt kỳ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function labelOf(accounts: AccountDef[], id: string): string {
  return accounts.find((a) => a.id === id)?.label ?? id;
}

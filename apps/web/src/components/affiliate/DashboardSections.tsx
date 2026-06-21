'use client';

import * as React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@hieu-asia/ui';

export interface DashRecentEvent {
  event: 'click' | 'signup' | 'conversion';
  user_id?: string;
  amount?: number;
  commission?: number;
  ts: string;
}

export interface DashPayout {
  id: string;
  amount: number;
  method: string;
  status: 'pending' | 'paid' | 'rejected';
  requested_at: string;
  paid_at?: string;
  rejected_reason?: string;
}

const EVENT_LABEL: Record<DashRecentEvent['event'], { text: string; tone: string }> = {
  click: { text: 'Click', tone: 'bg-muted/10 text-muted-foreground' },
  signup: { text: 'Đăng ký', tone: 'bg-blue-500/10 text-blue-300' },
  conversion: { text: 'Mua', tone: 'bg-gold/15 text-gold' },
};

const STATUS_LABEL: Record<DashPayout['status'], { text: string; tone: string }> = {
  pending: { text: 'Đang chờ', tone: 'text-amber-700 dark:text-yellow-400' },
  paid: { text: 'Đã trả', tone: 'text-emerald-700 dark:text-emerald-400' },
  rejected: { text: 'Bị từ chối', tone: 'text-rose-400' },
};

function vnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

function dt(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export function ShareToolkit({
  shareUrl,
  shareText,
  qrUrl,
  code,
}: {
  shareUrl: string;
  shareText: string;
  qrUrl: string;
  code: string;
}) {
  const [copied, setCopied] = React.useState<string | null>(null);
  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bộ công cụ chia sẻ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Link giới thiệu
          </div>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="font-mono text-xs" />
            <Button onClick={() => copyText(shareUrl, 'url')}>
              {copied === 'url' ? 'Đã copy' : 'Copy'}
            </Button>
          </div>
        </div>
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Caption gợi ý (VN)
          </div>
          <div className="flex gap-2">
            <Input value={shareText} readOnly className="text-xs" />
            <Button onClick={() => copyText(shareText, 'text')}>
              {copied === 'text' ? 'Đã copy' : 'Copy'}
            </Button>
          </div>
        </div>
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            QR code
          </div>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR code" width={128} height={128} className="rounded bg-white p-2" />
            <a
              href={qrUrl}
              download={`hieu-asia-${code}.png`}
              rel="noopener noreferrer"
              className="text-sm text-gold hover:underline"
            >
              Tải QR code (PNG)
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PayoutRequest({
  payoutMethod,
  payoutDestination,
  minPayout,
  availableVnd,
  canPayout,
  submitting,
  onSubmit,
  onVoucher,
  cashNetVnd,
  cashWithholdingVnd,
  kycComplete,
  msg,
  isActive,
}: {
  payoutMethod: string;
  payoutDestination: string;
  minPayout: number;
  availableVnd: number;
  canPayout: boolean;
  submitting: boolean;
  onSubmit: () => void;
  /** Optional: redeem commission as an in-product voucher (no tax/KYC). Pass an
   * amount to redeem PART of the balance; omit to redeem the full balance. */
  onVoucher?: (amountVnd?: number) => void;
  /** Projected after-tax cash payout (from backend; 10% TNCN already applied). */
  cashNetVnd?: number;
  /** Projected 10% TNCN withheld on a cash payout. */
  cashWithholdingVnd?: number;
  /** Whether MST + CTV contract are on file (cash payout gate). */
  kycComplete?: boolean;
  msg: { ok: boolean; text: string } | null;
  isActive: boolean;
}) {
  // Partial voucher redeem: blank = redeem the full available balance.
  const [voucherAmount, setVoucherAmount] = React.useState('');
  const trimmed = voucherAmount.trim();
  const parsed = trimmed === '' ? undefined : Number(trimmed);
  const voucherAmountVnd =
    parsed !== undefined && Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;
  const voucherAmountErr =
    trimmed !== '' && (voucherAmountVnd === undefined || voucherAmountVnd > availableVnd)
      ? `Nhập số từ 1 đến ${vnd(availableVnd)}, hoặc để trống để đổi hết.`
      : null;
  const voucherDisabled = !canPayout || submitting || voucherAmountErr !== null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Yêu cầu rút tiền</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Phương thức: <b>{payoutMethod.toUpperCase()}</b> · Đích:{' '}
          <span className="font-mono">{payoutDestination}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Khi gửi yêu cầu, bạn rút toàn bộ số dư khả dụng. Admin sẽ xử lý và chuyển khoản.
        </p>
        {typeof cashWithholdingVnd === 'number' && cashWithholdingVnd > 0 && (
          <p className="text-sm">
            Rút tiền mặt — thực nhận sau thuế:{' '}
            <b className="text-gold-700">{vnd(cashNetVnd ?? availableVnd)}</b>{' '}
            <span className="text-muted-foreground">(đã trừ 10% thuế TNCN {vnd(cashWithholdingVnd)})</span>
          </p>
        )}
        {kycComplete === false && (
          <p className="text-xs text-rose-300">
            Cần khai báo thuế (mã số thuế + hợp đồng cộng tác viên) ở mục trên trước khi rút tiền mặt.
            Hoặc đổi voucher (không cần thủ tục thuế).
          </p>
        )}
        {onVoucher && (
          <div className="space-y-1">
            <label htmlFor="voucher-amount" className="text-xs text-muted-foreground">
              Số tiền đổi voucher (để trống = đổi hết {vnd(availableVnd)})
            </label>
            <Input
              id="voucher-amount"
              type="number"
              inputMode="numeric"
              min={minPayout}
              max={availableVnd}
              step={1000}
              value={voucherAmount}
              onChange={(e) => setVoucherAmount(e.target.value)}
              placeholder={`Tối đa ${vnd(availableVnd)}`}
              className="max-w-[220px]"
            />
            {voucherAmountErr ? (
              <p className="text-xs text-rose-300">{voucherAmountErr}</p>
            ) : voucherAmountVnd !== undefined ? (
              <p className="text-xs text-muted-foreground">
                Còn lại sau khi đổi: <b>{vnd(Math.max(0, availableVnd - voucherAmountVnd))}</b>.
                Voucher đổi theo từng phần thưởng nên giá trị có thể nhỉnh hơn số bạn nhập một chút —
                bạn không mất phần dư.
              </p>
            ) : null}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onSubmit}
            disabled={!canPayout || submitting}
            className="bg-gold text-ink hover:bg-gold/90"
          >
            {submitting ? 'Đang gửi...' : `Rút tiền mặt ${vnd(availableVnd)}`}
          </Button>
          {onVoucher && (
            <Button
              onClick={() => onVoucher(voucherAmountVnd)}
              disabled={voucherDisabled}
              variant="outline"
            >
              {submitting
                ? 'Đang xử lý...'
                : voucherAmountVnd !== undefined
                  ? `Đổi voucher ${vnd(voucherAmountVnd)}`
                  : 'Đổi hết thành voucher'}
            </Button>
          )}
        </div>
        {onVoucher && (
          <p className="text-xs text-muted-foreground">
            Rút tiền mặt: rút toàn bộ số dư, có thể bị khấu trừ 10% thuế khi ≥ 2tr/lần (cần khai báo thuế).
            Đổi voucher: nhận mã giảm giá dùng khi mua dịch vụ, không cần thủ tục thuế — đổi từng phần hoặc đổi hết tuỳ ý.
          </p>
        )}
        {!canPayout && isActive && (
          <p className="text-xs text-muted-foreground">Tối thiểu {vnd(minPayout)} mới được rút.</p>
        )}
        {msg && (
          <p className={`text-sm ${msg.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-300'}`} role="status">
            {msg.text}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function RecentEvents({ events }: { events: DashRecentEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có hoạt động nào.</p>
        ) : (
          <div className="space-y-1">
            {events.map((ev, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className={`rounded px-2 py-0.5 text-xs ${EVENT_LABEL[ev.event].tone}`}>
                    {EVENT_LABEL[ev.event].text}
                  </span>
                  <span className="text-muted-foreground">{dt(ev.ts)}</span>
                </div>
                {ev.commission !== undefined && (
                  <span className="font-mono text-gold">+{vnd(ev.commission)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PayoutHistory({ payouts }: { payouts: DashPayout[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Lịch sử rút tiền</CardTitle>
      </CardHeader>
      <CardContent>
        {payouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có yêu cầu nào.</p>
        ) : (
          <div className="space-y-1">
            {payouts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0"
              >
                <div>
                  <span className="font-mono">{vnd(p.amount)}</span>{' '}
                  <span className="text-muted-foreground">· {dt(p.requested_at)}</span>
                </div>
                <span className={STATUS_LABEL[p.status].tone}>
                  {STATUS_LABEL[p.status].text}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

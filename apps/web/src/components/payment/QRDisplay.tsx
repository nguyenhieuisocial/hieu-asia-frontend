/**
 * QRDisplay — VietQR image + bank transfer info + countdown.
 *
 * `qr_url` is generated server-side (Worker uses img.vietqr.io) — we
 * just render it as a plain <img> (external host outside next/image config).
 */

'use client';

import * as React from 'react';
import { Card, CardContent, cn } from '@hieu-asia/ui';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'expired'
  | 'cancelled'
  | string;

export interface PaymentIntent {
  id: string;
  qr_url: string;
  content: string;
  amount_due: number;
  bank_account: string;
  bank_name: string;
  bank_holder?: string;
  expires_at: string;
  status: PaymentStatus;
}

export interface QRDisplayProps {
  intent: PaymentIntent;
  /** Countdown reaching zero → caller can flip UI to "expired". */
  onExpire?: () => void;
}

function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function useCountdown(expiresAt: string, onExpire?: () => void): string {
  const [remaining, setRemaining] = React.useState<number>(() => {
    const ms = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(ms / 1000));
  });
  const firedRef = React.useRef(false);

  React.useEffect(() => {
    const tick = () => {
      const ms = new Date(expiresAt).getTime() - Date.now();
      const sec = Math.max(0, Math.floor(ms / 1000));
      setRemaining(sec);
      if (sec === 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire?.();
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt, onExpire]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: {
      label: 'Đang chờ thanh toán',
      className: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
    },
    paid: {
      label: 'Đã thanh toán',
      className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    },
    expired: {
      label: 'Đã hết hạn',
      className: 'bg-red-500/15 text-red-300 border-red-500/40',
    },
    cancelled: {
      label: 'Đã hủy',
      className: 'bg-red-500/15 text-red-300 border-red-500/40',
    },
  };
  const c = config[status] ?? {
    label: status,
    className: 'bg-muted/10 text-muted-foreground border-border',
  };
  return (
    <span
      className={cn(
        'inline-block rounded-full border px-3 py-1 text-xs font-medium',
        c.className,
      )}
    >
      {c.label}
    </span>
  );
}

export function QRDisplay({ intent, onExpire }: QRDisplayProps) {
  const countdown = useCountdown(intent.expires_at, onExpire);
  const expired =
    intent.status === 'expired' || intent.status === 'cancelled';

  return (
    <Card className="border-gold/15 bg-card/40">
      <CardContent className="grid gap-6 p-6 md:grid-cols-[auto,1fr]">
        {/* QR image */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'rounded-lg border border-gold/20 bg-white p-3',
              expired && 'opacity-40',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={intent.qr_url}
              alt="Mã QR thanh toán"
              width={240}
              height={240}
              className="h-60 w-60"
            />
          </div>
          <StatusBadge status={intent.status} />
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg text-foreground">
              Quét QR để thanh toán
            </h2>
            <div
              className={cn(
                'rounded-md border px-3 py-1 text-sm font-mono',
                intent.status === 'pending'
                  ? 'border-gold/40 text-gold'
                  : 'border-border text-muted-foreground',
              )}
              aria-label="Thời gian còn lại"
            >
              {countdown}
            </div>
          </div>

          <dl className="grid grid-cols-[max-content,1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Ngân hàng</dt>
            <dd className="text-foreground">{intent.bank_name}</dd>

            <dt className="text-muted-foreground">Số tài khoản</dt>
            <dd className="font-mono text-foreground">{intent.bank_account}</dd>

            {intent.bank_holder && (
              <>
                <dt className="text-muted-foreground">Chủ tài khoản</dt>
                <dd className="text-foreground">{intent.bank_holder}</dd>
              </>
            )}

            <dt className="text-muted-foreground">Số tiền</dt>
            <dd className="font-mono text-gold">
              {formatVnd(intent.amount_due)}
            </dd>

            <dt className="text-muted-foreground">Nội dung</dt>
            <dd className="font-mono text-gold">{intent.content}</dd>
          </dl>

          <ol className="space-y-1.5 rounded-md border border-gold/15 bg-card/60 p-4 text-xs text-muted-foreground">
            <li>1. Mở app ngân hàng trên điện thoại</li>
            <li>2. Chọn chức năng &ldquo;Quét QR&rdquo; rồi quét mã trên</li>
            <li>
              3. Kiểm tra <span className="text-foreground">số tiền</span> và{' '}
              <span className="text-foreground">nội dung</span> đúng như trên — xác nhận chuyển khoản
            </li>
            <li>4. Đợi 5-10 giây để hệ thống xác nhận tự động</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

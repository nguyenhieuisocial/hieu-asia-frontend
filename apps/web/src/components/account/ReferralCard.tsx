'use client';

import * as React from 'react';
import { Gift } from 'lucide-react';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { getReferral, type ReferralInfo } from '@/lib/referral';

/**
 * "Mời bạn" card on /account — shows the user's invite link, a copy/share
 * affordance, how many friends have joined, and any voucher earned. Hides
 * itself when the user isn't signed in or the endpoint is unavailable.
 */
export function ReferralCard() {
  const [info, setInfo] = React.useState<ReferralInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    getReferral()
      .then((r) => {
        if (alive) setInfo(r);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return <div aria-hidden className="h-[148px] w-full animate-pulse rounded-xl bg-card/30" />;
  }
  if (!info) return null;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(info.invite_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section aria-labelledby="referral-h" className="rounded-xl border border-border bg-card/30 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Gift className="h-5 w-5 shrink-0 text-gold" aria-hidden />
        <h2 id="referral-h" className="font-heading text-base text-foreground/80 sm:text-lg">
          Mời bạn — cùng nhận ưu đãi
        </h2>
      </div>

      <p className="mb-3 text-sm text-foreground/70">
        Gửi link mời cho bạn bè. Khi bạn của bạn tham gia, <strong className="font-semibold text-foreground/90">cả hai</strong> cùng
        nhận một voucher giảm giá.
      </p>

      <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2">
        <code className="flex-1 truncate text-sm text-foreground/90">{info.invite_url}</code>
        <button
          type="button"
          onClick={onCopy}
          aria-live="polite"
          className="shrink-0 rounded-md border border-gold/40 bg-gold/10 px-3 py-1.5 text-sm font-medium text-gold-700 transition hover:border-gold/60 hover:bg-gold/15"
        >
          {copied ? 'Đã copy ✓' : 'Copy link'}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ShareResultButton
          path={`/r/${info.code}`}
          title="Mình mời bạn dùng hieu.asia"
          text="Cùng khám phá Tử Vi · MBTI · Mentor AI trên hieu.asia — tham gia qua link của mình để cả hai cùng nhận ưu đãi nhé!"
          trackId="referral-invite"
        />
        {info.invited_count > 0 && (
          <span className="text-sm text-muted-foreground">
            Đã có <strong className="font-semibold text-foreground/90">{info.invited_count}</strong> người tham gia nhờ bạn
          </span>
        )}
      </div>

      {info.voucher && (
        <div className="mt-3 rounded-lg border border-gold bg-gold/10 px-3 py-2.5">
          <p className="text-sm font-semibold text-gold-700">
            <span aria-hidden>🎁</span> Bạn đang có voucher -{info.voucher.discount_pct}%
          </p>
          <p className="mt-0.5 text-xs text-foreground/70">
            Áp dụng khi thanh toán gói bất kỳ. Dùng 1 lần.{' '}
            <a href="/pricing" className="underline hover:text-gold-700">
              Xem gói ngay →
            </a>
          </p>
        </div>
      )}
    </section>
  );
}

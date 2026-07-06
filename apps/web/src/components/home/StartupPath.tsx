'use client';

/**
 * StartupPath — "Lộ trình khởi đầu" activation path (Bitget's welcome-task /
 * rewards-center pattern, surfaced where new visitors land). Four free steps,
 * each opening a bit more, ending in a REAL reward (the existing referral
 * voucher — both sides get a discount). No fabricated rewards.
 *
 * Step 1 self-marks done from the saved profile (localStorage); computed after
 * mount so the server render stays neutral (no hydration mismatch).
 */

import * as React from 'react';
import Link from 'next/link';
import { Check, Gift, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';
import { readSavedProfile } from '@/lib/saved-profile';

interface Step {
  n: number;
  title: string;
  body: string;
  cta: string;
  href: string;
  reward?: string;
}

const STEPS: Step[] = [
  {
    n: 1,
    title: 'Lập lá số miễn phí',
    body: 'Nhập ngày sinh — xem lá số thật ngay, không cần thẻ.',
    cta: 'Lập lá số',
    href: '/onboarding',
  },
  {
    n: 2,
    title: 'Lưu hồ sơ',
    body: 'Tạo tài khoản để lưu lá số và theo dõi theo thời gian.',
    cta: 'Tạo tài khoản',
    href: '/signin',
  },
  {
    n: 3,
    title: 'Soi thêm một lăng kính',
    body: 'Bát Tự, MBTI, Big Five… đối chiếu nhiều góc cho rõ.',
    cta: 'Khám phá công cụ',
    href: '/cong-cu',
  },
  {
    n: 4,
    title: 'Mời một người bạn',
    body: 'Gửi lời mời — cả hai cùng nhận voucher giảm giá.',
    cta: 'Lấy lời mời',
    href: '/account',
    reward: 'Cả hai cùng nhận voucher',
  },
];

export function StartupPath() {
  const [step1Done, setStep1Done] = React.useState(false);

  React.useEffect(() => {
    const p = readSavedProfile();
    if (p?.birthDate) setStep1Done(true);
  }, []);

  return (
    <RevealOnScroll>
    <section aria-labelledby="startup-path-h" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 max-w-2xl">
          <span className="font-mono text-[13px] uppercase tracking-[0.12em] text-primary">
            Lộ trình khởi đầu
          </span>
          <h2
            id="startup-path-h"
            className="mt-2 font-marketing-display text-3xl leading-tight text-foreground sm:text-4xl"
          >
            Bắt đầu miễn phí — <span className="italic">mỗi bước mở thêm một chút</span>.
          </h2>
        </div>

        <ol className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const done = s.n === 1 && step1Done;
            return (
              <li key={s.n} className="rv-up" style={{ animationDelay: `${i * 90}ms` }}>
                <Link
                  href={s.href}
                  className={`group flex h-full flex-col gap-3 rounded-2xl border p-5 transition-colors hover:border-primary/40 hover:bg-card transition active:scale-[0.98] ${
                    s.reward
                      ? 'border-primary/40 bg-primary/[0.04]'
                      : 'border-primary/15 bg-card/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm ${
                        done
                          ? 'bg-[color:var(--hanh-moc,#6B8154)] text-white'
                          : 'border border-primary/30 text-primary'
                      }`}
                      aria-hidden
                    >
                      {done ? <Check className="h-4 w-4" /> : s.n}
                    </span>
                    {s.reward && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[12px] uppercase tracking-wide text-primary">
                        <Gift className="h-3 w-3" />
                        Quà
                      </span>
                    )}
                  </div>
                  <h3 className="font-marketing-display text-lg leading-snug text-foreground">
                    {done ? <span className="text-muted-foreground line-through">{s.title}</span> : s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  {s.reward && (
                    <p className="text-xs font-medium text-primary">{s.reward}</p>
                  )}
                  <span className="mt-auto flex items-center gap-1.5 pt-1 font-mono text-[13px] uppercase tracking-[0.12em] text-primary transition-colors group-hover:text-foreground">
                    {done ? 'Xong — xem lại' : s.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
    </RevealOnScroll>
  );
}

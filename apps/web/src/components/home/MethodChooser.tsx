'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Calendar, Hash, Hand } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

interface Method {
  key: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  name: string;
  origin: string;
  tells: string;
  bestFor: string;
  ctaLabel: string;
  href: string;
  learnHref: string;
  sampleHref: string;
  recommended?: boolean;
}

const METHODS: readonly Method[] = [
  {
    key: 'tu-vi',
    Icon: Compass,
    name: 'Tử Vi',
    origin: 'Đông phương — 12 cung sao',
    tells: 'Bản đồ 12 lĩnh vực đời sống — sự nghiệp, tài chính, tình cảm, sức khỏe.',
    bestFor: 'Bạn muốn nhìn toàn cảnh cuộc đời theo từng lĩnh vực.',
    ctaLabel: 'Bắt đầu Tử Vi',
    href: '/reading/new?method=tu-vi',
    learnHref: '/learn/tu-vi',
    sampleHref: '/sample-report',
    recommended: true,
  },
  {
    key: 'bat-tu',
    Icon: Calendar,
    name: 'Bát Tự',
    origin: 'Đông phương — Ngũ Hành 4 trụ',
    tells: 'Cân bằng năng lượng Kim, Mộc, Thủy, Hỏa, Thổ trong số mệnh.',
    bestFor: 'Bạn muốn hiểu thiên hướng tổng thể và năng lượng bẩm sinh.',
    ctaLabel: 'Xem Bát Tự',
    href: '/reading/new?method=bat-tu',
    learnHref: '/learn/bat-tu',
    sampleHref: '/sample-report#bat-tu',
  },
  {
    key: 'numerology',
    Icon: Hash,
    name: 'Thần Số Học & MBTI',
    origin: 'Tây phương — Pythagoras & Carl Jung',
    tells: 'Số chủ đạo từ ngày sinh và 16 nhóm tính cách MBTI.',
    bestFor: 'Bạn muốn một khung tự nhận thức nhanh, kết hợp với tâm lý hiện đại.',
    ctaLabel: 'Khám phá Số học & MBTI',
    href: '/reading/new?method=numerology',
    learnHref: '/learn/than-so-hoc',
    sampleHref: '/sample-report#numerology',
  },
  {
    key: 'palm',
    Icon: Hand,
    name: 'Palm Reading',
    origin: 'Phổ quát — 7 đường chỉ tay',
    tells: 'AI phân tích đường tâm đạo, trí đạo, sinh đạo trên ảnh bàn tay.',
    bestFor: 'Bạn không có giờ sinh chính xác hoặc muốn một góc nhìn bổ sung.',
    ctaLabel: 'Upload ảnh chỉ tay',
    href: '/reading/new?method=palm',
    learnHref: '/learn/palm',
    sampleHref: '/sample-report#palm',
  },
];

export function MethodChooser() {
  return (
    <section
      id="methods"
      aria-labelledby="methods-heading"
      className="relative bg-background py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Chọn phương pháp
          </p>
          <h2
            id="methods-heading"
            className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            Bốn góc nhìn, một con người
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Mỗi phương pháp soi một lát cắt khác nhau. Bạn có thể bắt đầu từ một phương pháp,
            kết hợp thêm sau.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METHODS.map(({ key, Icon, name, origin, tells, bestFor, ctaLabel, href, learnHref, sampleHref, recommended }) => (
            <article
              key={key}
              className={[
                'group relative flex flex-col rounded-2xl border bg-card/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)]',
                recommended
                  ? 'border-gold/60 shadow-[0_0_32px_-16px_rgba(184,146,61,0.55)] hover:border-gold/80'
                  : 'border-border hover:border-gold/40',
              ].join(' ')}
            >
              {recommended && (
                <span className="absolute -top-2.5 left-5 inline-flex items-center rounded-full border border-gold/50 bg-background px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                  Gợi ý
                </span>
              )}
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/5 transition-colors group-hover:border-gold/60 group-hover:bg-gold/10">
                <Icon className="h-5 w-5 text-gold" aria-hidden={true} />
              </div>

              <h3 className="font-heading text-lg font-semibold leading-tight text-foreground">
                {name}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold/60">
                {origin}
              </p>

              <dl className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Cho bạn biết
                  </dt>
                  <dd className="mt-1">{tells}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phù hợp khi
                  </dt>
                  <dd className="mt-1">{bestFor}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-2">
                <Link href={href}>
                  <Button size="sm" className="group/btn w-full">
                    {ctaLabel}
                    <ArrowRight
                      className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5"
                      aria-hidden={true}
                    />
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-3 text-xs">
                  <Link
                    href={sampleHref}
                    className="text-gold/85 transition-colors hover:text-gold"
                  >
                    Xem mẫu →
                  </Link>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <Link
                    href={learnHref}
                    className="text-muted-foreground transition-colors hover:text-gold"
                  >
                    Tìm hiểu thêm
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

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
  },
];

export function MethodChooser() {
  return (
    <section
      id="methods"
      aria-labelledby="methods-heading"
      className="relative bg-ink py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Chọn phương pháp
          </p>
          <h2
            id="methods-heading"
            className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-cream sm:text-4xl"
          >
            Bốn góc nhìn, một con người
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cream/70 sm:text-lg">
            Mỗi phương pháp soi một lát cắt khác nhau. Bạn có thể bắt đầu từ một phương pháp,
            kết hợp thêm sau.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METHODS.map(({ key, Icon, name, origin, tells, bestFor, ctaLabel, href, learnHref }) => (
            <article
              key={key}
              className="group flex flex-col rounded-2xl border border-cream/10 bg-ink/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)]"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/5 transition-colors group-hover:border-gold/60 group-hover:bg-gold/10">
                <Icon className="h-5 w-5 text-gold" aria-hidden={true} />
              </div>

              <h3 className="font-heading text-lg font-semibold leading-tight text-cream">
                {name}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold/60">
                {origin}
              </p>

              <dl className="mt-4 space-y-3 text-sm leading-relaxed text-cream/70">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-cream/70">
                    Cho bạn biết
                  </dt>
                  <dd className="mt-1">{tells}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-cream/70">
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
                <Link
                  href={learnHref}
                  className="text-center text-xs text-cream/55 transition-colors hover:text-gold"
                >
                  Tìm hiểu thêm về {name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

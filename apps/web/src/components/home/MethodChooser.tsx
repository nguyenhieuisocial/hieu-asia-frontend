'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Calendar, Calculator, Brain, Hand } from 'lucide-react';
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
    Icon: Calculator,
    name: 'Thần Số Học',
    origin: 'Pythagoras (Số học cổ Hy Lạp)',
    tells: 'Tính từ ngày sinh: Đường đời, Vận mệnh, Linh hồn, Năm cá nhân. Cho biết bài học cuộc đời và nhịp năm.',
    bestFor: 'Tự khám phá cấu trúc cá tính qua con số.',
    ctaLabel: 'Khám phá Số học',
    href: '/reading/new?method=numerology',
    learnHref: '/learn/than-so-hoc',
    sampleHref: '/sample-report#numerology',
  },
  {
    key: 'mbti',
    Icon: Brain,
    name: 'MBTI',
    origin: 'Carl Jung (16 Tính cách)',
    tells: 'Test 16 tính cách giúp hiểu cách bạn suy nghĩ, ra quyết định, giao tiếp. Bổ sung góc nhìn tâm lý hiện đại bên cạnh Tử Vi/Bát Tự.',
    bestFor: 'Bạn muốn cross-validate góc nhìn Đông + Tây.',
    // /ultrareview P0 fix Wave 57.1.9: dedicated MBTI test flow chưa
    // tồn tại — CTA dẫn qua /learn/mbti (đã có) thay vì hứa hẹn rồi
    // dead-end ở birth-date form. Wave 57.3 roadmap: build MBTI test
    // page + flip href back to /mbti-test/start.
    ctaLabel: 'Tìm hiểu MBTI',
    href: '/learn/mbti',
    learnHref: '/learn/mbti',
    sampleHref: '/sample-report#mbti',
  },
  {
    key: 'palm',
    Icon: Hand,
    name: 'Palm Reading',
    origin: 'Phổ quát — 7 đường chỉ tay',
    tells: 'Bạn tự chụp ảnh lòng bàn tay bằng điện thoại và tải lên. AI đọc 7 đường chỉ tay — tâm đạo, trí đạo, sinh đạo cùng 4 đường phụ — rồi trả về báo cáo về tình cảm, tư duy, sức khoẻ và năng lượng cá nhân.',
    bestFor: 'Bạn không nhớ chính xác giờ sinh, hoặc muốn một góc nhìn bổ sung cạnh lá số.',
    // /ultrareview P0 fix Wave 57.1.9: upload-ảnh flow chưa được build
    // — CTA dẫn qua /learn/palm để giải thích phương pháp thay vì
    // hứa "Upload" rồi dump qua birth-date form. Wave 57.3 roadmap:
    // build /palm/upload page + flip href.
    ctaLabel: 'Tìm hiểu Palm Reading',
    href: '/learn/palm',
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
            Năm góc nhìn, một con người
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Mỗi phương pháp soi một lát cắt khác nhau. Bạn có thể bắt đầu từ một phương pháp,
            kết hợp thêm sau.
          </p>
        </div>

        {/*
          /ultrareview P1 fix Wave 57.1.9: original `lg:grid-cols-3 xl:grid-cols-5`
          made an ugly 3+2 layout at the 1024–1279px window (orphan row of 2 cards).
          New: keep 1/2 at mobile/sm, jump straight to 5 columns at lg+. Cards
          tighten slightly (~190px @ lg=1024px) but balanced over jankiness.
        */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold/85">
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
                <Button asChild size="sm" className="group/btn w-full"><Link href={href}>
                  
                    {ctaLabel}
                    <ArrowRight
                      className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5"
                      aria-hidden={true}
                    />
                  
                </Link></Button>
                <div className="flex items-center justify-center gap-3 text-xs">
                  <Link
                    href={sampleHref}
                    className="font-medium text-gold transition-colors hover:text-gold-300"
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

        {/*
          Wave 57.1 §3.1 disclaimer (founder-requested combo of "no accuracy %"
          + "tham khảo, không phải chẩn đoán"). Placed once under all 5 cards
          since the same caveat applies to every divination method — keeps
          per-card copy clean and avoids legal risk on fortune-telling claims.
        */}
        <aside
          aria-label="Lưu ý về phương pháp"
          className="mt-10 text-center text-xs leading-relaxed text-muted-foreground/80"
        >
          Cả 5 phương pháp đều là góc nhìn để bạn{' '}
          <strong className="text-foreground/90">tham khảo và tự ra quyết định</strong>, không phải
          chẩn đoán y khoa, tài chính hay pháp lý. Kết quả phụ thuộc vào độ chính xác của ngày–giờ
          sinh và cách bạn lựa chọn áp dụng.
        </aside>
      </div>
    </section>
  );
}

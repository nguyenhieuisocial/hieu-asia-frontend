import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FreeTool {
  href: string;
  label: string;
  emoji: string;
  blurb: string;
}

const TOOLS: readonly FreeTool[] = [
  {
    href: '/tu-vi-hom-nay',
    label: 'Tử Vi hôm nay',
    emoji: '🐲',
    blurb: 'Tổng quan, công việc, tình duyên, tài lộc cho 12 con giáp.',
  },
  {
    href: '/lich-van-nien',
    label: 'Lịch Vạn Niên',
    emoji: '📅',
    blurb: 'Ngày Hoàng/Hắc đạo, giờ tốt, sao chiếu. Cá nhân hoá theo năm sinh.',
  },
  {
    href: '/hop-tuoi',
    label: 'Hợp tuổi',
    emoji: '☯',
    blurb: 'Cưới hỏi, hợp tác, sinh con, xông đất — phân tích Can Chi.',
  },
  {
    href: '/than-so-hoc',
    label: 'Thần Số Học',
    emoji: '🔢',
    blurb: 'Pythagoras — đường đời, vận mệnh, linh hồn, năm cá nhân.',
  },
  {
    href: '/can-xuong',
    label: 'Cân Xương Đoán Số',
    emoji: '⚖️',
    blurb: 'Cổ truyền VN — cân tổng năm/tháng/ngày/giờ + bài thơ luận.',
  },
  {
    href: '/thuoc-lo-ban',
    label: 'Thước Lỗ Ban',
    emoji: '📏',
    blurb: 'Tra cung Tốt/Xấu cho cửa, giường, bàn thờ. Gợi ý size tốt gần nhất.',
  },
];

/**
 * Home section showcasing free, instant tools — no signup required.
 * Bridges curiosity → deep-reading funnel.
 */
export function FreeTools() {
  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="relative border-y border-cream/5 bg-ink py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Công cụ miễn phí · không cần đăng ký
          </p>
          <h2
            id="tools-heading"
            className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-cream sm:text-4xl"
          >
            Tra cứu nhanh, ngay <span className="bg-gold-gradient bg-clip-text text-transparent">hôm nay</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cream/70 sm:text-lg">
            Sáu công cụ độc lập cho những câu hỏi thường ngày — không cần lập lá số đầy đủ.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-cream/10 bg-ink/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/15 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <div
                aria-hidden
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-br from-gold/15 via-ink to-purple/20 text-2xl"
              >
                {t.emoji}
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="flex items-center gap-1 font-heading text-base font-semibold text-cream">
                  {t.label}
                  <ArrowRight
                    className="h-3.5 w-3.5 text-gold/0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-gold"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-cream/65">{t.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

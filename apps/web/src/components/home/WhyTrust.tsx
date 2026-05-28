import Link from 'next/link';
import { Cpu, FileSearch, ShieldCheck, ArrowRight } from 'lucide-react';
import { MarketingCard } from '@/components/marketing/MarketingCard';

interface Proof {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  desc: string;
}

const PROOFS: readonly Proof[] = [
  {
    Icon: Cpu,
    title: 'AI không tự bịa lá số',
    desc: 'Hệ thống tính lá số từ ngày–giờ sinh của bạn theo đúng phương pháp truyền thống, sau đó AI chỉ giải thích kết quả cho bạn hiểu.',
  },
  {
    Icon: FileSearch,
    title: 'Mỗi kết luận có nút "Vì sao?"',
    desc: 'Click vào bất kỳ kết luận quan trọng nào — xem được cung, sao, đại vận làm căn cứ.',
  },
  {
    Icon: ShieldCheck,
    title: 'Đã kiểm thử kỹ trước khi đến tay bạn',
    // Wave 60.95.b P1 — vault 130 §3 P1-7 + ChatGPT external review §1.5
    // ("99% accurate" claim ambiguous). Clarify scope so users not misled:
    // the 99% refers to deterministic calculations (calendar conversion + chart
    // an sao), NOT AI interpretation accuracy. AI interpretation is NEVER
    // measured as "% accurate" — it's measured by eval framework score
    // (target ≥9.0/10 per vault 80 P4.5 gate).
    desc: 'Đối chiếu 500 trường hợp chuyển đổi âm–dương lịch và 600 prompt kiểm thử an toàn. Tỷ lệ trên 99% áp dụng cho phần tính toán lá số và kiểm soát phản hồi, không phải dự đoán tương lai.',
  },
];

/**
 * "Vì sao tin được" mini-section between Hero and MethodChooser.
 * Surfaces methodology moat concretely on homepage instead of burying it.
 */
export function WhyTrust() {
  // Wave 60.79.T3 (vault 112 P1 #13): removed `bg-background` so the inner
  // section inherits the page wrapper bg (currently bg-muted/40 on home).
  // Previously `bg-background` did not match `bg-muted/40` in dark mode,
  // creating a visible seam at y≈1620 between this section and adjacent
  // ScanRow / "VÌ SAO TIN ĐƯỢC" bands. Callers that need a specific bg can
  // wrap this component as the home page already does.
  return (
    <section
      aria-labelledby="why-trust-heading"
      className="relative py-14 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent"
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/90 sm:text-xs">
            Vì sao tin được
          </p>
          <h2
            id="why-trust-heading"
            className="mt-4 text-balance font-heading text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl"
          >
            Không phải "AI nói vậy thì tin vậy"
          </h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Ba lớp phòng vệ kỹ thuật cụ thể, không chung chung.
          </p>
        </div>

        {/* Wave 60.79.T2 (vault 112 P1): `auto-rows-fr` + `h-full flex flex-col`
            so the 3 proof cards stay equal-height even when descriptions
            differ in line count (especially proof 3 which is longest).

            Wave 60.83 — proof cards migrated to MarketingCard primitive (was
            `border-border bg-card/40 p-6`). MarketingCard emits identical
            `h-full flex flex-col`, swaps bg to `warm-dark-200` so cards layer
            cleanly on the wrapping `bg-muted/40` section shell, and adds
            `hover:border-gold/40` for editorial polish. MarketingCard's
            primitive doc explicitly lists WhyTrust as a canonical consumer. */}
        <ul className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-3">
          {PROOFS.map(({ Icon, title, desc }) => (
            <li key={title} className="h-full">
              <MarketingCard padding="standard" bg="warm-dark-200">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gold/30 bg-gold/5">
                  <Icon className="h-4 w-4 text-gold" aria-hidden={true} />
                </div>
                <h3 className="mt-4 font-heading text-sm font-semibold leading-snug text-foreground">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {desc}
                </p>
              </MarketingCard>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 text-sm text-gold/90 transition-colors hover:text-gold"
          >
            Đọc phương pháp luận đầy đủ
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

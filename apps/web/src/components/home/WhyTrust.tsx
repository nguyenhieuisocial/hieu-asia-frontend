import Link from 'next/link';
import { Cpu, FileSearch, ShieldCheck, ArrowRight } from 'lucide-react';

interface Proof {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  desc: string;
}

const PROOFS: readonly Proof[] = [
  {
    Icon: Cpu,
    title: 'Engine deterministic chạy trước AI',
    desc: 'AI không được tự an sao — `iztro` + `vn-lunar` lập lá số, AI chỉ diễn giải structured JSON đã có.',
  },
  {
    Icon: FileSearch,
    title: 'Mỗi kết luận có nút "Vì sao?"',
    desc: 'Click vào bất kỳ kết luận quan trọng nào — xem được cung, sao, đại vận làm căn cứ.',
  },
  {
    Icon: ShieldCheck,
    title: 'Validation 4 tầng + 600 adversarial tests',
    desc: '500/500 lịch âm-dương, 100/100 an sao vàng, ≥99% pass rate trên 600 prompts jailbreak.',
  },
];

/**
 * "Vì sao tin được" mini-section between Hero and MethodChooser.
 * Surfaces methodology moat concretely on homepage instead of burying it.
 */
export function WhyTrust() {
  return (
    <section
      aria-labelledby="why-trust-heading"
      className="relative bg-ink py-14 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent"
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Vì sao tin được
          </p>
          <h2
            id="why-trust-heading"
            className="mt-3 font-heading text-2xl font-bold leading-tight tracking-tight text-cream sm:text-3xl"
          >
            Không phải "AI nói vậy thì tin vậy"
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-cream/70 sm:text-base">
            Ba lớp phòng vệ kỹ thuật cụ thể, không chung chung.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {PROOFS.map(({ Icon, title, desc }) => (
            <li
              key={title}
              className="rounded-2xl border border-cream/10 bg-ink/40 p-5"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gold/30 bg-gold/5">
                <Icon className="h-4 w-4 text-gold" aria-hidden={true} />
              </div>
              <h3 className="mt-4 font-heading text-sm font-semibold leading-snug text-cream">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-cream/70 sm:text-sm">
                {desc}
              </p>
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

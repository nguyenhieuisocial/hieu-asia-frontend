import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from '@hieu-asia/ui';
import { InfographicBatTu } from '@/components/learn/InfographicBatTu';

export const metadata: Metadata = {
  title: 'Bát Tự Tứ Trụ — Học huyền học',
  description:
    'Bát Tự Tứ Trụ: 4 trụ Năm – Tháng – Ngày – Giờ với Thiên Can + Địa Chi tạo nên 8 chữ định mệnh cách theo Ngũ Hành.',
  alternates: { canonical: 'https://hieu.asia/learn/bat-tu' },
};

export default function LearnBatTuPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-gold">Trang chủ</Link>
        <span className="mx-1.5">/</span>
        <Link href="/learn" className="hover:text-gold">Học huyền học</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted-foreground">Bát Tự Tứ Trụ</span>
      </nav>

      <header className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
          Đông phương · Trung Hoa
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Bát Tự <span className="bg-gold-gradient bg-clip-text text-transparent">Tứ Trụ</span>
          {/* Wave 52-C — consistent BETA badge: nav dropdown labels "Bát Tự (beta)"
              and methodology table marks the row beta, so this page should match. */}
          <span
            className="ml-3 inline-flex translate-y-[-4px] items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300"
            aria-label="Tính năng đang trong giai đoạn beta"
          >
            beta
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          "Bát Tự" = 8 chữ. Đây là 4 cặp Thiên Can + Địa Chi tương ứng với Năm, Tháng, Ngày,
          Giờ sinh — tạo nên 4 trụ phản ánh năng lượng Ngũ Hành chi phối số mệnh.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
        <InfographicBatTu />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">Giải thích chi tiết</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="basics" className="rounded border border-border px-4">
            <AccordionTrigger>Bát Tự là gì?</AccordionTrigger>
            <AccordionContent>
              Bát Tự (八字) nghĩa là 8 chữ. Mỗi trụ trong 4 trụ có 1 Thiên Can (天干 — 10 can:
              Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý) và 1 Địa Chi (地支 — 12 chi:
              Tý, Sửu, Dần, Mão...). Tổng cộng 8 ký tự.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="five" className="rounded border border-border px-4">
            <AccordionTrigger>Ngũ Hành là gì?</AccordionTrigger>
            <AccordionContent>
              5 yếu tố cơ bản: Kim (kim loại), Mộc (cây), Thủy (nước), Hỏa (lửa), Thổ (đất).
              Chúng tương sinh – tương khắc. Mỗi Can/Chi mang một hành. Sự cân bằng giữa các
              hành trong lá Bát Tự cho biết thiên hướng, điểm thừa, điểm thiếu.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="pillar" className="rounded border border-border px-4">
            <AccordionTrigger>Ý nghĩa từng trụ?</AccordionTrigger>
            <AccordionContent>
              <ul className="list-inside list-disc space-y-1">
                <li>
                  <strong>Trụ Năm</strong> — Tổ tiên, vận thiếu thời, môi trường xuất thân.
                </li>
                <li>
                  <strong>Trụ Tháng</strong> — Cha mẹ, anh chị em, vận thanh niên.
                </li>
                <li>
                  <strong>Trụ Ngày</strong> — Bản thân (Can ngày = Nhật Chủ), vợ/chồng, trung niên.
                </li>
                <li>
                  <strong>Trụ Giờ</strong> — Con cái, vận về già, di sản để lại.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="diff" className="rounded border border-border px-4">
            <AccordionTrigger>Khác gì Tử Vi?</AccordionTrigger>
            <AccordionContent>
              Tử Vi đọc qua hệ thống sao trên 12 cung. Bát Tự đọc qua cân bằng Ngũ Hành trong
              4 trụ. Hai hệ có thể bổ sung cho nhau — Tử Vi mạnh ở chi tiết lĩnh vực, Bát Tự
              mạnh ở năng lượng tổng thể.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section
        aria-labelledby="bat-tu-cta-heading"
        className="mt-12 rounded-2xl border border-gold/25 bg-card/40 p-8 text-center"
      >
        <h2 id="bat-tu-cta-heading" className="font-heading text-2xl font-bold text-foreground">
          Trải nghiệm ngay
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Nhập ngày giờ sinh, hệ thống lập 4 trụ Năm – Tháng – Ngày – Giờ và phân tích cân bằng
          Ngũ Hành. Bạn xem Bát Tự đầy đủ trước khi đọc luận giải chi tiết.
        </p>
        <div className="mt-6">
          <Button asChild size="lg"><Link href="/reading/new?method=bat-tu">
            Xem Bát Tự của bạn
          </Link></Button>
        </div>
      </section>
    </main>
  );
}

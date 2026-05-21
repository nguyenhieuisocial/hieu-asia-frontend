import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from '@hieu-asia/ui';
import { InfographicPalm } from '@/components/learn/InfographicPalm';

export const metadata: Metadata = {
  title: 'Xem chỉ tay — Học huyền học | hieu.asia',
  description:
    'Xem chỉ tay (chiromancy): 7 đường chính trên lòng bàn tay — tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, mercury, kim tinh — mỗi đường nói lên một khía cạnh đời sống.',
  alternates: { canonical: 'https://hieu.asia/learn/palm' },
};

export default function LearnPalmPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-cream/55">
        <Link href="/" className="hover:text-gold">Trang chủ</Link>
        <span className="mx-1.5">/</span>
        <Link href="/learn" className="hover:text-gold">Học huyền học</Link>
        <span className="mx-1.5">/</span>
        <span className="text-cream/70">Xem chỉ tay</span>
      </nav>

      <header className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
          Phổ quát · Đông &amp; Tây
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-4xl">
          Xem <span className="bg-gold-gradient bg-clip-text text-transparent">chỉ tay</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/75">
          Bàn tay con người có hàng trăm đường nét nhỏ, nhưng có 7 đường lớn được nhiều
          truyền thống — từ Ấn Độ, Trung Hoa đến châu Âu — coi là quan trọng nhất.
        </p>
      </header>

      <section className="rounded-xl border border-cream/10 bg-ink/40 p-6 sm:p-8">
        <InfographicPalm />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-cream">Giải thích chi tiết</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="origin" className="rounded border border-cream/10 px-4">
            <AccordionTrigger>Chiromancy đến từ đâu?</AccordionTrigger>
            <AccordionContent>
              Xem chỉ tay (chiromancy / palmistry) xuất hiện độc lập ở nhiều nền văn hóa cổ
              đại — Ấn Độ (Hast Samudrika Shastra ~5,000 năm), Trung Hoa, Hy Lạp. Hệ thống
              hiện đại tại phương Tây phổ biến từ thế kỷ 19.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="hand" className="rounded border border-cream/10 px-4">
            <AccordionTrigger>Tay nào để xem?</AccordionTrigger>
            <AccordionContent>
              Theo trường phái phổ biến: tay không thuận phản ánh tiềm năng bẩm sinh, tay
              thuận phản ánh con người bạn đang trở thành. Thường xem cả hai để so sánh.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="lines" className="rounded border border-cream/10 px-4">
            <AccordionTrigger>Đường dài/ngắn nghĩa là gì?</AccordionTrigger>
            <AccordionContent>
              Độ dài không quyết định “thọ” hay “tài”. Hình dạng, độ rõ, các nhánh phụ, đứt
              đoạn — tất cả tổ hợp lại mới có ý nghĩa. Ví dụ đường sinh đạo ngắn không có
              nghĩa thọ ngắn, mà có thể là năng lượng tập trung.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="change" className="rounded border border-cream/10 px-4">
            <AccordionTrigger>Đường chỉ tay có thay đổi không?</AccordionTrigger>
            <AccordionContent>
              Có. Đường nhỏ thay đổi theo thói quen tay, sức khỏe, stress. Đường chính ổn định
              hơn nhưng vẫn có thể đậm/nhạt theo thời gian. Đây là lý do bàn tay được xem là
              “bản đồ sống”.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="caution" className="rounded border border-cream/10 px-4">
            <AccordionTrigger>Cẩn trọng khi đọc?</AccordionTrigger>
            <AccordionContent>
              Không có đường chỉ tay nào dự đoán chính xác sự kiện cụ thể. Đây là khung tham
              chiếu — nên kết hợp với hoàn cảnh thực tế, sức khỏe, lựa chọn cá nhân. hieu.asia
              dùng AI phân tích ảnh bàn tay để hỗ trợ, không thay thế lời khuyên chuyên môn.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section
        aria-labelledby="palm-cta-heading"
        className="mt-12 rounded-2xl border border-gold/25 bg-ink/40 p-8 text-center"
      >
        <h2 id="palm-cta-heading" className="font-heading text-2xl font-bold text-cream">
          Trải nghiệm ngay
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-cream/70">
          Chụp ảnh hai lòng bàn tay theo hướng dẫn, AI phân tích 7 đường chính và đặc trưng cá
          nhân. Không cần giờ sinh chính xác.
        </p>
        <div className="mt-6">
          <Link href="/reading/new?method=palm">
            <Button size="lg">Upload ảnh chỉ tay</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

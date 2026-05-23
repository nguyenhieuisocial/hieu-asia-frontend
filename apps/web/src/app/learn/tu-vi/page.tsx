import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from '@hieu-asia/ui';
import { InfographicTuVi } from '@/components/learn/InfographicTuVi';
import { PALACE_READINGS } from '@/lib/palace-readings';

export const metadata: Metadata = {
  title: 'Tử Vi 12 cung — Học huyền học',
  description:
    'Tìm hiểu 12 cung Tử Vi: Mệnh, Tài Bạch, Phu Thê, Quan Lộc... Mỗi cung phản ánh một lĩnh vực đời sống cụ thể.',
  alternates: { canonical: 'https://hieu.asia/learn/tu-vi' },
};

const ARTICLE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Tử Vi 12 cung — nền tảng cho người mới',
  inLanguage: 'vi-VN',
  url: 'https://hieu.asia/learn/tu-vi',
  author: { '@type': 'Organization', name: 'hieu.asia' },
  publisher: { '@type': 'Organization', name: 'hieu.asia' },
};

export default function LearnTuViPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-gold">Trang chủ</Link>
        <span className="mx-1.5">/</span>
        <Link href="/learn" className="hover:text-gold">Học huyền học</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted-foreground">Tử Vi 12 cung</span>
      </nav>

      <header className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
          Đông phương · Trung Hoa
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Tử Vi <span className="bg-gold-gradient bg-clip-text text-transparent">12 cung</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Lá số Tử Vi chia đời người thành 12 lĩnh vực (gọi là "cung"), mỗi cung chứa các sao
          ảnh hưởng đến một mặt cụ thể của cuộc sống — từ sức khỏe, tài chính, tình cảm đến
          sự nghiệp.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          <Link href="/methodology/tu-vi" className="text-gold/80 underline-offset-4 hover:underline">
            Xem phương pháp luận →
          </Link>
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
        <InfographicTuVi />
      </section>

      <section className="mt-12">
        <h2 className="mb-3 font-heading text-xl font-bold text-foreground">
          12 cung — bấm vào cung bạn quan tâm
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          Mỗi cung là một trang riêng: bạn sẽ thấy cung đó quản lĩnh vực nào, các sao đáng để
          ý, cách một buổi luận đi từ sao sang quyết định, và những câu hỏi đời thực mà cung
          này thực sự trả lời được.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PALACE_READINGS.map((p) => (
            <Link
              key={p.slug}
              href={`/learn/tu-vi/${p.slug}`}
              className="group rounded-lg border border-border bg-card/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-card/60"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold/85">
                {p.domain}
              </p>
              <p className="mt-1.5 font-heading text-base font-semibold text-foreground group-hover:text-gold">
                Cung {p.name}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {p.governs.split('.')[0]}.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">Giải thích chi tiết</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="origin" className="rounded border border-border px-4">
            <AccordionTrigger>Tử Vi đến từ đâu?</AccordionTrigger>
            <AccordionContent>
              Tử Vi Đẩu Số khởi nguồn từ Trung Hoa thời Tống (thế kỷ 10), do Trần Đoàn lão tổ
              hệ thống hóa. Nguyên lý chính: vị trí các sao quanh sao Tử Vi (Polaris) tại thời
              khắc sinh phản ánh cấu trúc số mệnh.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cung" className="rounded border border-border px-4">
            <AccordionTrigger>Cung là gì?</AccordionTrigger>
            <AccordionContent>
              Cung là một trong 12 ô trên lá số, ứng với một “khu vực” của đời sống. Ví dụ
              cung Tài Bạch phản ánh dòng tiền, cung Phu Thê phản ánh hôn nhân. Sao đóng trong
              cung nào sẽ ảnh hưởng đến khu vực đó.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="stars" className="rounded border border-border px-4">
            <AccordionTrigger>Có bao nhiêu sao?</AccordionTrigger>
            <AccordionContent>
              Hệ thống tiêu chuẩn dùng 14 chính tinh (Tử Vi, Thiên Phủ, Vũ Khúc, Liêm Trinh...)
              cộng các phụ tinh — tổng cộng hơn 100 sao. hieu.asia dùng engine Iztro để tính
              đầy đủ chính tinh và phụ tinh.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="usage" className="rounded border border-border px-4">
            <AccordionTrigger>Đọc lá số để làm gì?</AccordionTrigger>
            <AccordionContent>
              Không phải để biết tương lai cố định. Mà để nhận diện thiên hướng, điểm mạnh,
              điểm dễ vấp — từ đó có quyết định phù hợp hơn. Lá số là bản đồ, không phải kịch
              bản.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="limit" className="rounded border border-border px-4">
            <AccordionTrigger>Giới hạn của Tử Vi?</AccordionTrigger>
            <AccordionContent>
              Tử Vi không dự đoán được trúng số, không thay thế lời khuyên y tế/pháp lý/tài
              chính. Đây là công cụ tự nhận thức, dùng kết hợp với suy nghĩ tỉnh táo và hành
              động thực tế.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section
        aria-labelledby="tu-vi-cta-heading"
        className="mt-12 rounded-2xl border border-gold/25 bg-card/40 p-8 text-center"
      >
        <h2 id="tu-vi-cta-heading" className="font-heading text-2xl font-bold text-foreground">
          Trải nghiệm ngay
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Nhập ngày giờ sinh, hệ thống dựng lá số Tử Vi 12 cung trong khoảng 30 giây. Bạn xem
          lá số đầy đủ trước khi quyết định mở khóa luận giải sâu.
        </p>
        <div className="mt-6">
          <Button asChild size="lg"><Link href="/reading/new?method=tu-vi">
            Lập lá số Tử Vi của bạn
          </Link></Button>
        </div>
      </section>
    </main>
  );
}

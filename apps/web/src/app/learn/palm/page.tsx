import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { InfographicPalm } from '@/components/learn/InfographicPalm';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';

export const metadata: Metadata = {
  title: 'Xem chỉ tay — Học huyền học',
  description:
    'Xem chỉ tay (chiromancy): 7 đường chính trên lòng bàn tay — tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, mercury, kim tinh — mỗi đường nói lên một khía cạnh đời sống.',
  alternates: { canonical: 'https://hieu.asia/learn/palm' },
};

export default function LearnPalmPage() {
  return (
    <LearnArticle
      eyebrow="Phổ quát · Đông & Tây"
      title={
        <>
          Xem <span className="bg-gold-gradient bg-clip-text text-transparent">chỉ tay</span>
        </>
      }
      standfirst={
        <>
          Bàn tay con người có hàng trăm đường nét nhỏ, nhưng có 7 đường lớn được nhiều
          truyền thống — từ Ấn Độ, Trung Hoa đến châu Âu — coi là quan trọng nhất.
        </>
      }
      readMeta="6 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Xem chỉ tay' },
      ]}
      relatedLenses={relatedLearnLenses('palm')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Chụp ảnh hai lòng bàn tay theo hướng dẫn, AI phân tích 7 đường chính và đặc trưng cá nhân. Không cần giờ sinh chính xác.',
        href: '/reading/new?method=palm',
        label: 'Upload ảnh chỉ tay',
      }}
      sections={[
        {
          id: 'so-do-7-duong',
          tocLabel: '7 đường chính',
          heading: 'Sơ đồ 7 đường chính',
          children: (
            <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
              <InfographicPalm />
            </div>
          ),
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
          children: (
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="origin" className="rounded border border-border px-4">
                <AccordionTrigger>Chiromancy đến từ đâu?</AccordionTrigger>
                <AccordionContent>
                  Xem chỉ tay (chiromancy / palmistry) xuất hiện độc lập ở nhiều nền văn hóa cổ
                  đại — Ấn Độ (Hast Samudrika Shastra ~5,000 năm), Trung Hoa, Hy Lạp. Hệ thống
                  hiện đại tại phương Tây phổ biến từ thế kỷ 19.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="hand" className="rounded border border-border px-4">
                <AccordionTrigger>Tay nào để xem?</AccordionTrigger>
                <AccordionContent>
                  Theo trường phái phổ biến: tay không thuận phản ánh tiềm năng bẩm sinh, tay
                  thuận phản ánh con người bạn đang trở thành. Thường xem cả hai để so sánh.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="lines" className="rounded border border-border px-4">
                <AccordionTrigger>Đường dài/ngắn nghĩa là gì?</AccordionTrigger>
                <AccordionContent>
                  Độ dài không quyết định “thọ” hay “tài”. Hình dạng, độ rõ, các nhánh phụ, đứt
                  đoạn — tất cả tổ hợp lại mới có ý nghĩa. Ví dụ đường sinh đạo ngắn không có
                  nghĩa thọ ngắn, mà có thể là năng lượng tập trung.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="change" className="rounded border border-border px-4">
                <AccordionTrigger>Đường chỉ tay có thay đổi không?</AccordionTrigger>
                <AccordionContent>
                  Có. Đường nhỏ thay đổi theo thói quen tay, sức khỏe, stress. Đường chính ổn định
                  hơn nhưng vẫn có thể đậm/nhạt theo thời gian. Đây là lý do bàn tay được xem là
                  “bản đồ sống”.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="caution" className="rounded border border-border px-4">
                <AccordionTrigger>Cẩn trọng khi đọc?</AccordionTrigger>
                <AccordionContent>
                  Không có đường chỉ tay nào dự đoán chính xác sự kiện cụ thể. Đây là khung tham
                  chiếu — nên kết hợp với hoàn cảnh thực tế, sức khỏe, lựa chọn cá nhân. hieu.asia
                  dùng AI phân tích ảnh bàn tay để hỗ trợ, không thay thế lời khuyên chuyên môn.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ),
        },
      ]}
    />
  );
}

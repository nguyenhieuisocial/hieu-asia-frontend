import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { InfographicBatTu } from '@/components/learn/InfographicBatTu';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Bát Tự Tứ Trụ: Học huyền học',
  description:
    'Bát Tự Tứ Trụ: 4 trụ Năm, Tháng, Ngày, Giờ với Thiên Can + Địa Chi tạo nên 8 chữ định mệnh cách theo Ngũ Hành.',
  alternates: { canonical: 'https://hieu.asia/learn/bat-tu' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Bát Tự là gì?',
    a: 'Bát Tự (八字) nghĩa là 8 chữ. Mỗi trụ trong 4 trụ có 1 Thiên Can (天干, gồm 10 can: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý) và 1 Địa Chi (地支, gồm 12 chi: Tý, Sửu, Dần, Mão...). Tổng cộng 8 ký tự.',
  },
  {
    q: 'Ngũ Hành là gì?',
    a: '5 yếu tố cơ bản: Kim (kim loại), Mộc (cây), Thủy (nước), Hỏa (lửa), Thổ (đất). Chúng tương sinh, tương khắc lẫn nhau. Mỗi Can/Chi mang một hành. Sự cân bằng giữa các hành trong lá Bát Tự cho biết thiên hướng, điểm thừa, điểm thiếu.',
  },
  {
    q: 'Ý nghĩa từng trụ?',
    a: 'Trụ Năm: Tổ tiên, vận thiếu thời, môi trường xuất thân. Trụ Tháng: Cha mẹ, anh chị em, vận thanh niên. Trụ Ngày: Bản thân (Can ngày = Nhật Chủ), vợ/chồng, trung niên. Trụ Giờ: Con cái, vận về già, di sản để lại.',
  },
  {
    q: 'Khác gì Tử Vi?',
    a: 'Tử Vi đọc qua hệ thống sao trên 12 cung. Bát Tự đọc qua cân bằng Ngũ Hành trong 4 trụ. Hai hệ có thể bổ sung cho nhau: Tử Vi mạnh ở chi tiết lĩnh vực, Bát Tự mạnh ở năng lượng tổng thể.',
  },
];

const JSONLD = [
  article({
    headline: 'Bát Tự Tứ Trụ: nền tảng cho người mới',
    description:
      'Bát Tự Tứ Trụ: 4 trụ Năm, Tháng, Ngày, Giờ với Thiên Can + Địa Chi tạo nên 8 chữ định mệnh cách theo Ngũ Hành.',
    url: '/learn/bat-tu',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Bát Tự Tứ Trụ', url: '/learn/bat-tu' },
  ]),
  faqPage(FAQS),
];

export default function LearnBatTuPage() {
  return (
    <LearnArticle
      eyebrow="Đông phương · Trung Hoa"
      title={
        <>
          Bát Tự <span className="bg-gold-gradient bg-clip-text text-transparent">Tứ Trụ</span>
          {/* Wave 52-C — consistent BETA badge: nav dropdown labels "Bát Tự (beta)"
              and methodology table marks the row beta, so this page should match. */}
          <span
            className="ml-3 inline-flex translate-y-[-4px] items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300"
            aria-label="Tính năng đang trong giai đoạn beta"
          >
            beta
          </span>
        </>
      }
      standfirst={
        <>
          "Bát Tự" = 8 chữ. Đây là 4 cặp Thiên Can + Địa Chi tương ứng với Năm, Tháng, Ngày,
          Giờ sinh, tạo nên 4 trụ phản ánh năng lượng Ngũ Hành chi phối số mệnh.
        </>
      }
      readMeta="6 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Bát Tự Tứ Trụ' },
      ]}
      relatedLenses={relatedLearnLenses('bat-tu')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày giờ sinh, hệ thống lập 4 trụ Năm, Tháng, Ngày, Giờ và phân tích cân bằng Ngũ Hành. Bạn xem Bát Tự đầy đủ trước khi đọc luận giải chi tiết.',
        href: '/reading/new?method=bat-tu',
        label: 'Xem Bát Tự của bạn',
      }}
      sections={[
        {
          id: 'so-do-tu-tru',
          tocLabel: 'Sơ đồ Tứ Trụ',
          heading: 'Sơ đồ 4 trụ',
          children: (
            <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
              <InfographicBatTu />
            </div>
          ),
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
          children: (
            <Accordion type="single" collapsible className="space-y-2">
              {FAQS.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded border border-border px-4"
                >
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ),
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

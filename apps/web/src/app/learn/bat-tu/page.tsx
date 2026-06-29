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
import {
  BatTuFrame,
  BatTuDepth,
  BatTuRecall,
  BatTuChecklist,
  BatTuWhys,
} from './_active-learning';

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
  {
    q: 'Nhật Chủ là gì và vì sao quan trọng nhất?',
    a: 'Nhật Chủ (日主) là Thiên Can của trụ Ngày — đại diện cho "tôi". Trường phái Tử Bình lấy Nhật Chủ làm gốc, rồi xét 7 chữ còn lại quan hệ ngũ hành thế nào với nó. Trước khi luận tốt/xấu phải biết Nhật Chủ mạnh (vượng) hay yếu (nhược), vì cùng một mối quan hệ nhưng với thân vượng và thân nhược lại luận khác nhau, thậm chí ngược nhau.',
  },
  {
    q: 'Thân vượng, thân nhược nghĩa là gì?',
    a: 'Là độ mạnh-yếu của Nhật Chủ. Căn cứ chính: mùa sinh (Chi Tháng) có nâng đỡ hành Nhật Chủ không, có "gốc rễ" trong tàng can các chi không, và số lượng phe sinh-trợ so với phe khắc-tiết-hao. Đếm số chữ mỗi hành chỉ là gợi ý thô; đánh giá đúng phải xét cả mùa, gốc rễ và tổ hợp. Đây là cách hiểu tham khảo, không phải phán định.',
  },
  {
    q: 'Dụng Thần là gì?',
    a: 'Dụng Thần (用神) là hành làm lá số cân bằng và vận hành tốt nhất — ví như "vị thuốc" cho lá số. Nguyên tắc phổ biến (phù-ức): thân nhược thì dùng hành sinh/trợ Nhật Chủ; thân vượng thì dùng hành tiết/khắc/hao bớt. Đây là phần khó và dễ sai nhất, các trường phái có thể chọn khác nhau, nên chỉ nên xem là một cách luận có cơ sở, không tuyệt đối.',
  },
  {
    q: 'Thần Sát (Đào Hoa, Quý Nhân...) có quyết định số mệnh không?',
    a: 'Không. Thần Sát là lớp phụ "tô màu" cho lá số, tra theo bảng cố định (theo Can Ngày hoặc theo Chi), không thay phần lõi là Thập Thần và Dụng Thần. Ví dụ Thiên Ất Quý Nhân chỉ ý quý nhân phù trợ, Đào Hoa nói về sức hút và duyên. Chỉ nên dùng để tham khảo thêm, không dùng riêng để hù dọa hay quyết định điều gì.',
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
            className="ml-3 inline-flex translate-y-[-4px] items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-[0.12em] text-amber-300"
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
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <BatTuFrame />,
        },
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
          id: 'nhat-chu-vuong-nhuoc',
          tocLabel: 'Nhật Chủ & vượng nhược',
          heading: 'Nhật Chủ — và chuyện vượng hay nhược',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Trường phái <strong className="text-foreground">Tử Bình</strong> lấy{' '}
                <strong className="text-foreground">Thiên Can của trụ Ngày</strong> làm{' '}
                <strong className="text-foreground">Nhật Chủ (日主)</strong> — tức "tôi". Sau đó
                người luận xét quan hệ Ngũ Hành của 7 chữ còn lại trong lá số với Nhật Chủ. Nói cách
                khác, cả lá Bát Tự được đọc qua lăng kính "tôi đứng giữa, mọi thứ quanh tôi đang nâng
                đỡ hay đang khắc chế tôi".
              </p>
              <p>
                Trước khi nói tốt hay xấu, bước quan trọng nhất là biết Nhật Chủ{' '}
                <strong className="text-foreground">mạnh (vượng)</strong> hay{' '}
                <strong className="text-foreground">yếu (nhược)</strong>. Lý do: cùng một mối quan hệ
                ngũ hành, nhưng với thân vượng và thân nhược lại luận theo hướng khác nhau, đôi khi
                ngược hẳn. Có ba căn cứ chính, xếp theo mức ảnh hưởng:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-foreground">Đắc lệnh (mùa sinh):</strong> yếu tố mạnh nhất —
                  Chi Tháng có mang mùa nâng đỡ hành của Nhật Chủ không (các trạng thái theo mùa:
                  Vượng, Tướng, Hưu, Tù, Tử).
                </li>
                <li>
                  <strong className="text-foreground">Đắc địa (gốc rễ):</strong> Nhật Chủ có "rễ"
                  trong tàng can (can ẩn) của các chi không — cùng hành hoặc hành sinh ra nó.
                </li>
                <li>
                  <strong className="text-foreground">Đắc thế (vây cánh):</strong> số lượng phe
                  sinh-trợ (Tỷ Kiếp, Ấn) so với phe khắc-tiết-hao (Quan Sát, Tài, Thực Thương).
                </li>
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Lưu ý: chỉ "đếm số chữ mỗi hành" rồi kết luận là cách làm thô và dễ sai. Đánh giá
                đúng phải xét cả mùa, gốc rễ và tổ hợp. Đây là cách hiểu mang tính tham khảo để hiểu
                mình rõ hơn, không phải lời phán về số mệnh.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <BatTuDepth />,
        },
        {
          id: 'thap-than-dung-than',
          tocLabel: 'Thập Thần & Dụng Thần',
          heading: 'Thập Thần và Dụng Thần — bộ khung luận giải',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Từ quan hệ Ngũ Hành giữa mỗi chữ với Nhật Chủ, người ta quy về{' '}
                <strong className="text-foreground">Thập Thần (十神)</strong> — 10 mối quan hệ, gom
                thành 5 nhóm, mỗi nhóm một cặp âm–dương. Mỗi nhóm gắn với một mảng đời sống (đây là{' '}
                <em>xu hướng tham khảo</em>, không phải định mệnh):
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Nhóm</th>
                      <th className="py-2 pr-4 font-semibold">Quan hệ với Nhật Chủ</th>
                      <th className="py-2 font-semibold">Mảng đời sống (xu hướng)</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Tỷ Kiếp</td>
                      <td className="py-2 pr-4">Đồng hành với Nhật Chủ</td>
                      <td className="py-2">Bản thân, anh em, bạn bè, cạnh tranh, hợp tác</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Thực Thương</td>
                      <td className="py-2 pr-4">Nhật Chủ sinh ra nó</td>
                      <td className="py-2">Tài năng, sáng tạo, diễn đạt, "đầu ra"</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Tài</td>
                      <td className="py-2 pr-4">Nhật Chủ khắc nó</td>
                      <td className="py-2">Tiền bạc, của cải, hưởng thụ, quản trị nguồn lực</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Quan Sát</td>
                      <td className="py-2 pr-4">Nó khắc Nhật Chủ</td>
                      <td className="py-2">Sự nghiệp, địa vị, kỷ luật, áp lực</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">Ấn</td>
                      <td className="py-2 pr-4">Nó sinh Nhật Chủ</td>
                      <td className="py-2">Học vấn, che chở, tri thức, sự nâng đỡ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Nhưng Thập Thần không có "tốt" hay "xấu" cố định. Luận chuẩn là{' '}
                <strong className="text-foreground">
                  Thập Thần × (thân vượng hay nhược) × Dụng Thần
                </strong>
                . Đây là lúc <strong className="text-foreground">Dụng Thần (用神)</strong> bước vào:
                đó là hành giúp lá số cân bằng và vận hành tốt nhất, ví như "vị thuốc". Nguyên tắc phổ
                biến nhất (phù-ức): thân nhược thì dùng hành sinh/trợ Nhật Chủ; thân vượng thì dùng
                hành tiết bớt, khắc hoặc hao. Ngoài ra còn các cách điều hậu (quá lạnh cần Hỏa, quá
                nóng cần Thủy), thông quan, bệnh-dược.
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Chọn Dụng Thần là phần khó và dễ sai nhất; có trường phái chọn khác nhau cho cùng một
                lá số. Vì vậy một bài đọc tử tế sẽ trình bày có cơ sở (vượng/nhược + mùa) và nói rõ
                đây là một cách luận phổ biến, không tuyệt đối — chứ không bán chuyện "đổi mệnh, giải
                hạn".
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <BatTuWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <BatTuRecall />,
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
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <BatTuChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

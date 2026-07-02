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
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import {
  PalmFrame,
  PalmDepth,
  PalmRecall,
  PalmChecklist,
  PalmWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Xem chỉ tay — Học huyền học',
  description:
    'Xem chỉ tay (chiromancy): 7 đường chính — tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, thuỷ tinh, kim tinh — mỗi đường nói lên một khía cạnh đời sống.',
  alternates: { canonical: 'https://hieu.asia/learn/palm' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (Accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Chiromancy đến từ đâu?',
    a: 'Xem chỉ tay (chiromancy / palmistry) xuất hiện độc lập ở nhiều nền văn hóa cổ đại — Ấn Độ (Hast Samudrika Shastra, một truyền thống lâu đời), Trung Hoa, Hy Lạp. Hệ thống hiện đại tại phương Tây phổ biến từ thế kỷ 19.',
  },
  {
    q: 'Tay nào để xem?',
    a: 'Theo trường phái phổ biến: tay không thuận phản ánh tiềm năng bẩm sinh, tay thuận phản ánh con người bạn đang trở thành. Thường xem cả hai để so sánh.',
  },
  {
    q: 'Đường dài/ngắn nghĩa là gì?',
    a: 'Độ dài không quyết định “thọ” hay “tài”. Hình dạng, độ rõ, các nhánh phụ, đứt đoạn — tất cả tổ hợp lại mới có ý nghĩa. Ví dụ đường sinh đạo ngắn không có nghĩa thọ ngắn, mà có thể là năng lượng tập trung.',
  },
  {
    q: 'Đường chỉ tay có thay đổi không?',
    a: 'Có. Đường nhỏ thay đổi theo thói quen tay, sức khỏe, stress. Đường chính ổn định hơn nhưng vẫn có thể đậm/nhạt theo thời gian. Đây là lý do bàn tay được xem là “bản đồ sống”.',
  },
  {
    q: 'Cẩn trọng khi đọc?',
    a: 'Không có đường chỉ tay nào dự đoán chính xác sự kiện cụ thể. Đây là khung tham chiếu — nên kết hợp với hoàn cảnh thực tế, sức khỏe, lựa chọn cá nhân. hieu.asia dùng AI phân tích ảnh bàn tay để hỗ trợ, không thay thế lời khuyên chuyên môn.',
  },
  {
    q: 'Đường sinh đạo ngắn có phải “sống ngắn”?',
    a: 'Không. Đây là hiểu lầm phổ biến nhất về xem chỉ tay. Đường sinh đạo nói về sức sống, năng lượng và những giai đoạn thay đổi lớn — không phải tuổi thọ. Đường ngắn hoặc ôm sát có thể chỉ năng lượng tập trung, gọn gàng, ưu tiên sự an toàn, hoàn toàn không liên quan đến chuyện thọ yểu.',
  },
  {
    q: 'Đường trí đạo dài thì thông minh hơn?',
    a: 'Không. Trí đạo nói về phong cách tư duy chứ không phải mức IQ. Đường thẳng và ngang thiên về tư duy thực tế, có cấu trúc; đường dốc xuống thiên về tưởng tượng và sáng tạo. Trí đạo ngắn nghĩa là quyết nhanh, đi thẳng vào việc — không phải “kém thông minh”.',
  },
  {
    q: 'Đếm vạch hôn nhân để biết cưới mấy lần được không?',
    a: 'Không nên. Đếm vạch ở cạnh bàn tay để phán “kết hôn mấy lần” là cách đọc bị lạm dụng và sai lệch. Những vạch này chỉ phản ánh việc bạn coi trọng các mối quan hệ gắn bó sâu sắc, không phải con số sự kiện cụ thể.',
  },
  {
    q: 'Đường “sức khoẻ” trên tay có nói được bệnh không?',
    a: 'Tuyệt đối không. Dù truyền thống gọi là đường Sức khoẻ (Thuỷ Tinh), nó chỉ nói về khuynh hướng giao tiếp và sự nhạy bén, không phải chẩn đoán y học. Mọi lo ngại về sức khoẻ nên gặp bác sĩ — xem chỉ tay không có cơ sở y học và không thay thế chuyên môn.',
  },
];

const JSONLD = [
  article({
    headline: 'Xem chỉ tay — 7 đường chính trên lòng bàn tay',
    description:
      'Xem chỉ tay (chiromancy): 7 đường chính trên lòng bàn tay — tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, thuỷ tinh, kim tinh — mỗi đường nói lên một khía cạnh đời sống.',
    url: '/learn/palm',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Xem chỉ tay', url: '/learn/palm' },
  ]),
  faqPage(FAQS),
];

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
          'Chụp ảnh lòng bàn tay theo hướng dẫn, AI đọc các đường chính (sinh đạo, trí đạo, tâm đạo) cùng gò và dáng bàn tay để gợi ý xu hướng tính cách. Không cần giờ sinh.',
        href: '/xem-tuong',
        label: 'Xem chỉ tay bằng AI',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <PalmFrame />,
        },
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
          id: 'ba-duong-chinh',
          tocLabel: 'Ba đường chính',
          heading: 'Ba đường chính — đọc xu hướng, không phán số mệnh',
          children: (
            <div className="prose-invert max-w-none space-y-5 text-muted-foreground">
              <p>
                Gần như bàn tay nào cũng có ba đường này, và chúng là trục chính của mọi
                bài đọc. Điều quan trọng nhất: đọc <strong>tổ hợp</strong> hình dạng, độ rõ,
                nhánh phụ và chỗ bắt đầu — không đọc độ dài đơn lẻ.
              </p>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Tâm đạo — đường tình cảm
                </h3>
                <p>
                  Đường trên cùng, chạy ngang dưới gốc các ngón. Chủ về cách yêu và cách
                  kết nối cảm xúc. Bắt đầu dưới ngón trỏ thường gắn với khuynh hướng chọn
                  lọc, biết mình muốn gì; bắt đầu dưới ngón giữa thiên về nhu cầu của bản
                  thân trong quan hệ. Đường cong lên cho thấy cảm xúc cởi mở, chủ động; đường
                  thẳng-ngang thì giữ cảm xúc kín hơn, thiên lý trí.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Trí đạo — đường lý trí
                </h3>
                <p>
                  Đường giữa, chạy ngang lòng bàn tay. Nói về <em>phong cách</em> tư duy chứ
                  không phải mức IQ. Thẳng và ngang thiên về tư duy thực tế, có cấu trúc; dốc
                  xuống phía gò Mặt Trăng thì giàu tưởng tượng, sáng tạo. Trí đạo dính liền
                  điểm đầu với sinh đạo gợi khởi đầu thận trọng, gắn với gia đình; tách rời
                  gợi sự độc lập, tự quyết sớm.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Sinh đạo — đường sức sống
                </h3>
                <p>
                  Đường vòng quanh gốc ngón cái. Chủ về sức sống, năng lượng và những bước
                  ngoặt lớn trong đời — <strong>không phải tuổi thọ</strong>. Cần nói rõ:
                  đường sinh đạo ngắn không có nghĩa “sống ngắn”, mà có thể chỉ năng lượng
                  tập trung. Vòng rộng gợi nhiệt huyết, ưa vận động; vòng ôm sát gợi kiểu
                  “chậm mà chắc”. Đoạn đứt hay nhánh được truyền thống đọc là giai đoạn
                  chuyển biến (đổi nghề, dọn nhà), không phải tai hoạ.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <PalmDepth />,
        },
        {
          id: 'go-va-hinh-tay',
          tocLabel: 'Gò & hình bàn tay',
          heading: 'Gò và hình bàn tay — khung nền trước khi đọc đường',
          children: (
            <div className="prose-invert max-w-none space-y-5 text-muted-foreground">
              <p>
                Ngoài bảy đường, hai yếu tố giúp định “khung” trước khi luận là các gò thịt
                nổi và hình dáng tổng thể bàn tay.
              </p>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Các gò (mounts)</h3>
                <p>
                  Các gò là vùng thịt nổi dưới mỗi ngón và quanh lòng tay, đặt theo tên hành
                  tinh trong hệ phương Tây. Đọc theo độ đầy đặn: gò nổi đầy gợi năng lượng
                  vùng đó trội, gò lép gợi khuynh hướng nhẹ hơn — không phải “thiếu sót”. Gò
                  Kim Tinh quanh gốc ngón cái gắn với nhiệt tình và sự ấm áp; gò Mộc Tinh dưới
                  ngón trỏ gắn với tham vọng, lãnh đạo; gò Thổ Tinh dưới ngón giữa gắn với kỷ
                  luật và chiều sâu; gò Mặt Trăng ở cạnh ngoài gắn với trí tưởng tượng và trực
                  giác. Vì gò khó thấy chính xác qua ảnh phẳng, chỉ nên nhận xét khi gò rõ
                  ràng nổi hoặc lép.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Hình dáng bàn tay — hai hệ khác nhau
                </h3>
                <p>
                  Có hai hệ phân loại phổ biến và chúng <strong>không tương ứng 1-1</strong>.
                  Hệ phương Tây hiện đại chia bàn tay thành bốn loại theo Đất – Khí – Lửa –
                  Nước: tay Đất (lòng vuông, ngón ngắn) thiên thực tế, vững vàng; tay Khí (lòng
                  vuông, ngón dài) thiên lý trí, giao tiếp; tay Lửa (lòng dài, ngón ngắn) thiên
                  năng động, hành động nhanh; tay Nước (lòng dài, ngón mảnh) thiên nhạy cảm,
                  giàu cảm xúc. Bên cạnh đó có trường phái Đông Á phân theo Ngũ hành thủ gồm
                  năm loại (Kim – Mộc – Thuỷ – Hoả – Thổ thủ) — đây là một hệ khác, không nên
                  trộn lẫn với hệ bốn yếu tố.
                </p>
              </div>

              <p className="text-sm">
                Một lưu ý nền của cả môn: nhân tướng học là quan sát kinh nghiệm dân gian,
                không phải khoa học được kiểm chứng. Tinh thần truyền thống “tướng tự tâm
                sinh” nhắc rằng nét tay phản ánh nếp sống hiện tại và thay đổi theo thời gian
                — không một bức ảnh nào định đoạt cả cuộc đời.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <PalmWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <PalmRecall />,
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
          children: <PalmChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

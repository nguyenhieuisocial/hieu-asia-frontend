import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  DatTenFrame,
  DatTenDepth,
  DatTenDepthSinh,
  DatTenRecall,
  DatTenChecklist,
  DatTenWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Đặt Tên Theo Ngũ Hành cho con',
  description:
    'Đặt tên theo ngũ hành: chọn tên bổ hành đang thiếu trong Bát Tự của bé, nhận biết hành qua bộ thủ chữ Hán, nghĩa đẹp + âm hay. Góc tham khảo, không máy móc.',
  alternates: { canonical: 'https://hieu.asia/learn/dat-ten-ngu-hanh' },
};

// Năm hành → chữ tiêu biểu nhận biết qua bộ thủ chữ Hán. Grounded từ DOMAIN
// FACTS; hiển thị dạng lưới thẻ để người mới hình dung "hành của chữ ở đâu ra".
const HANH_BO_THU: {
  hanh: string;
  bo: string;
  chu: string;
  dot: string;
}[] = [
  { hanh: 'Thủy', bo: 'bộ Thủy 氵', chu: 'Giang, Hà, Hải, Khê', dot: 'bg-sky-500' },
  { hanh: 'Mộc', bo: 'bộ Mộc 木', chu: 'Lâm, Nam, Bách, Kha', dot: 'bg-emerald-500' },
  { hanh: 'Hỏa', bo: 'bộ Hỏa 火 / Nhật 日', chu: 'Huân, Dương, Minh', dot: 'bg-rose-500' },
  { hanh: 'Kim', bo: 'bộ Kim 金', chu: 'Ngân, Cẩm, Chung', dot: 'bg-amber-500' },
  { hanh: 'Thổ', bo: 'bộ Thổ 土 / Sơn 山', chu: 'Sơn, Khôn, Phong', dot: 'bg-yellow-700' },
];

// Kho tên gợi ý theo hành — tên + nghĩa COPY đúng từ engine NAME_SUGGESTIONS
// (lib/dat-ten-ngu-hanh.ts) để trang học khớp công cụ. Nhãn rõ: xếp theo NGHĨA
// là chính, có tính quy ước — KHÔNG khẳng định "tên này số tốt".
type Gender = 'nam' | 'nu' | 'ca';
const GENDER_LABEL: Record<Gender, string> = { nam: 'bé trai', nu: 'bé gái', ca: 'dùng chung' };

const KHO_TEN: { hanh: string; dot: string; ten: { name: string; meaning: string; g: Gender }[] }[] = [
  {
    hanh: 'Kim',
    dot: 'bg-amber-500',
    ten: [
      { name: 'Kim', meaning: 'vàng, kim loại quý', g: 'ca' },
      { name: 'Ngân', meaning: 'bạc, trắng sáng', g: 'nu' },
      { name: 'Ngọc', meaning: 'ngọc quý, trong sáng', g: 'ca' },
      { name: 'Chung', meaning: 'chuông vàng, tiếng vang', g: 'ca' },
      { name: 'Nghĩa', meaning: 'đạo lý, danh dự', g: 'nam' },
      { name: 'Khánh', meaning: 'chuông khánh, phúc lành', g: 'ca' },
      { name: 'Bạch', meaning: 'trắng trong, kim bạch', g: 'ca' },
      { name: 'Thu', meaning: 'mùa thu (thuộc Kim)', g: 'nu' },
      { name: 'Tuyết', meaning: 'tuyết trắng, tinh khôi', g: 'nu' },
      { name: 'Tân', meaning: 'can Tân thuộc Kim, mới mẻ', g: 'ca' },
    ],
  },
  {
    hanh: 'Mộc',
    dot: 'bg-emerald-500',
    ten: [
      { name: 'Lâm', meaning: 'rừng, rậm rạp', g: 'nam' },
      { name: 'Tùng', meaning: 'cây tùng, kiên trung', g: 'nam' },
      { name: 'Mai', meaning: 'hoa mai, thanh khiết', g: 'nu' },
      { name: 'Trúc', meaning: 'cây trúc, cứng cỏi', g: 'ca' },
      { name: 'Lan', meaning: 'hoa lan, quý phái', g: 'nu' },
      { name: 'Xuân', meaning: 'mùa xuân, sinh trưởng', g: 'ca' },
      { name: 'Nam', meaning: 'cây nam — gỗ quý, vững chãi', g: 'nam' },
      { name: 'Bách', meaning: 'cây bách, trường thọ', g: 'nam' },
      { name: 'Hương', meaning: 'hương thơm cây cỏ', g: 'nu' },
      { name: 'Chi', meaning: 'cành lá, nảy nở', g: 'nu' },
    ],
  },
  {
    hanh: 'Thủy',
    dot: 'bg-sky-500',
    ten: [
      { name: 'Hà', meaning: 'sông, dòng chảy', g: 'nu' },
      { name: 'Giang', meaning: 'sông lớn, bao la', g: 'ca' },
      { name: 'Hải', meaning: 'biển, rộng lớn', g: 'nam' },
      { name: 'Vân', meaning: 'mây, bay bổng', g: 'nu' },
      { name: 'Vũ', meaning: 'mưa, mát lành', g: 'nam' },
      { name: 'Thủy', meaning: 'nước, thuần khiết', g: 'nu' },
      { name: 'Khê', meaning: 'suối nhỏ, trong vắt', g: 'ca' },
      { name: 'Thanh', meaning: 'trong xanh như nước', g: 'ca' },
      { name: 'Bình', meaning: 'mặt nước phẳng lặng', g: 'ca' },
      { name: 'Lam', meaning: 'xanh lam như nước', g: 'nu' },
    ],
  },
  {
    hanh: 'Hỏa',
    dot: 'bg-rose-500',
    ten: [
      { name: 'Minh', meaning: 'sáng sủa, trí tuệ', g: 'ca' },
      { name: 'Quang', meaning: 'ánh sáng, hào quang', g: 'nam' },
      { name: 'Nhật', meaning: 'mặt trời, rực sáng', g: 'nam' },
      { name: 'Đăng', meaning: 'ngọn đèn, soi đường', g: 'nam' },
      { name: 'Ánh', meaning: 'ánh sáng, tươi sáng', g: 'nu' },
      { name: 'Dương', meaning: 'mặt trời, dương khí', g: 'nam' },
      { name: 'Hồng', meaning: 'đỏ tươi, rạng rỡ', g: 'nu' },
      { name: 'Hạ', meaning: 'mùa hạ, nắng ấm', g: 'nu' },
      { name: 'Hân', meaning: 'hân hoan, rạng rỡ', g: 'nu' },
      { name: 'Huy', meaning: 'ánh sáng rực rỡ', g: 'nam' },
    ],
  },
  {
    hanh: 'Thổ',
    dot: 'bg-yellow-700',
    ten: [
      { name: 'Sơn', meaning: 'núi, vững chắc', g: 'nam' },
      { name: 'Thành', meaning: 'thành trì, kiên cố', g: 'nam' },
      { name: 'Bảo', meaning: 'quý báu, trân trọng', g: 'ca' },
      { name: 'An', meaning: 'bình an, vững như đất', g: 'ca' },
      { name: 'Cát', meaning: 'may mắn, tốt lành', g: 'ca' },
      { name: 'Kiên', meaning: 'kiên cường, bền vững', g: 'nam' },
      { name: 'Khang', meaning: 'an khang, vững vàng', g: 'ca' },
      { name: 'Trân', meaning: 'quý hiếm, trân trọng', g: 'nu' },
      { name: 'Bích', meaning: 'ngọc bích xanh sáng', g: 'nu' },
      { name: 'Hằng', meaning: 'bền vững, dài lâu', g: 'nu' },
    ],
  },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Đặt tên theo ngũ hành là gì?',
    a: 'Là cách chọn tên (tên đệm + tên chính) sao cho ngũ hành của tên bổ trợ cho lá số Bát Tự của bé — bổ hành đang thiếu hoặc là dụng thần, tránh hành gây xung khắc, giúp cân bằng Kim – Mộc – Thủy – Hỏa – Thổ. Đây là một nét văn hoá phương Đông, mang tính tham khảo — không phải luật bắt buộc và không quyết định vận mệnh.',
  },
  {
    q: 'Làm sao biết bé đang thiếu hành nào?',
    a: 'Bằng cách lập Bát Tự của bé từ giờ – ngày – tháng – năm sinh, rồi xem trong tứ trụ hành nào vượng, hành nào nhược hay thiếu (gọi là dụng thần — hành cần bổ). Đây là bước đầu tiên, quyết định hướng chọn chữ. Nếu chưa quen, bạn có thể lập Bát Tự trước rồi mới cân nhắc tên.',
  },
  {
    q: 'Có bắt buộc phải đặt tên theo ngũ hành không?',
    a: 'Không. Một cái tên hay trước hết là nghĩa đẹp, âm dễ thương và tình cảm gia đình gửi gắm trong đó. Ngũ hành chỉ là một lớp tham khảo bổ sung. Rất nhiều cái tên đẹp và ý nghĩa không đặt nặng ngũ hành — điều quan trọng nhất vẫn là bé thấy thoải mái, tự hào với tên mình.',
  },
  {
    q: 'Có nên chọn chữ khó đọc, khó hiểu chỉ để cho "đủ hành" không?',
    a: 'Không nên. Tên là món quà theo con cả đời — bé sẽ đọc, viết và giới thiệu tên mình mỗi ngày. Chọn một chữ trúc trắc, khó đọc hoặc nghĩa mờ nhạt chỉ để cho "đủ hành" là máy móc và dễ khiến bé chịu thiệt. Nếu chữ hợp hành nhưng khó đọc hay nghĩa không hay, hãy chọn phương án khác; ưu tiên nghĩa đẹp và âm hài hoà.',
  },
  {
    q: 'Ngũ hành của tên tính theo bộ thủ hay theo nghĩa?',
    a: 'Cả hai cách đều được dùng. Phổ biến nhất là nhận biết hành của một chữ qua bộ thủ chữ Hán — ví dụ chữ có bộ Thủy (氵) thuộc hành Thủy, bộ Mộc (木) thuộc hành Mộc. Ngoài ra có thể xét theo nghĩa hoặc âm gợi hành. Một số trường phái còn thêm lớp số nét chữ (tam tài, tứ cách), nhưng phức tạp và tuỳ hệ, chỉ nên xem là lớp tham khảo phụ.',
  },
  {
    q: 'Ngũ hành trong tên có quyết định vận mệnh hay hạnh phúc của bé không?',
    a: 'Không. Ngũ hành trong tên là một quan niệm văn hoá, không có bằng chứng quyết định vận mệnh hay hạnh phúc của một người. Đừng để áp lực "chọn đúng hành" lấn át ý nghĩa và sự thoải mái. hieu.asia gợi ý để bạn tham khảo, không phán — cái quyết định cuộc đời bé là tình yêu thương và cách nuôi dạy, không phải một chữ hợp hành.',
  },
  {
    q: 'Bổ hành có nhất thiết dùng đúng hành đang thiếu không?',
    a: 'Không nhất thiết. Theo nguyên tắc tương sinh của ngũ hành (Mộc → Hỏa → Thổ → Kim → Thủy → Mộc), muốn bổ một hành, bạn có thể dùng chính hành đó (bổ thẳng), hoặc dùng hành SINH ra nó — kiểu "mẹ nuôi con". Ví dụ bé thiếu Hỏa: có thể chọn chữ hành Hỏa, hoặc chữ hành Mộc vì Mộc sinh Hỏa. Cách thứ hai bồi dưỡng hành thiếu nhẹ nhàng hơn. Các trường phái không hoàn toàn thống nhất nên xem như một hướng tham khảo, và vẫn ưu tiên nghĩa đẹp, âm hay.',
  },
  {
    q: 'Vì sao nhiều nhà kiêng đặt tên con trùng tên ông bà, người bậc trên?',
    a: 'Đó là tục kiêng huý — tránh dùng thẳng tên người bậc trên trong họ (ông bà, cha mẹ, người đã khuất), thời xưa còn kiêng cả tên vua quan. Nhiều gia đình tránh trùng tên để giữ tôn ti và tránh phạm huý. Đây là phong tục, không phải luật; nên tôn trọng nếp nhà, nhưng không cần lo sợ, và cứ để nghĩa đẹp cùng âm hay dẫn đường.',
  },
  {
    q: 'Tam tài, tứ cách là gì, có cần theo không?',
    a: 'Tam tài (Thiên – Địa – Nhân) và tứ cách (Thiên cách, Địa cách, Nhân cách, Tổng cách) là các hệ ĐẾM SỐ NÉT chữ Hán rồi luận cát – hung, phổ biến trong danh học Nhật – Hàn. Vì dựa trên số nét chữ Hán, chúng áp vào tên thuần Việt (viết bằng chữ Quốc ngữ) khá khập khiễng: một cái tên có thể đếm nét theo nhiều cách viết Hán khác nhau, và mỗi hệ cho kết quả khác nhau. Vì vậy hieu.asia xem đây là lớp tham khảo phụ, không đặt nặng — ưu tiên nghĩa, âm và hành như phần chính.',
  },
];

const JSONLD = [
  article({
    headline: 'Đặt tên theo Ngũ Hành cho con: bổ hành thiếu, nghĩa đẹp — góc tham khảo cho bố mẹ',
    description:
      'Đặt tên theo ngũ hành: quy trình 3 bước (lập Bát Tự tìm hành cần bổ → chọn chữ theo bộ thủ / nghĩa → ghép tên hay). Đề cao nghĩa + âm, tham khảo, không máy móc.',
    url: '/learn/dat-ten-ngu-hanh',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Đặt tên ngũ hành', url: '/learn/dat-ten-ngu-hanh' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Đặt Tên Theo Ngũ Hành cho con',
    description:
      'Đặt tên theo ngũ hành: chọn tên bổ hành đang thiếu trong Bát Tự của bé, nhận biết hành qua bộ thủ chữ Hán, nghĩa đẹp + âm hay. Góc tham khảo, không máy móc.',
    url: '/learn/dat-ten-ngu-hanh',
  }),
];

export default function LearnDatTenNguHanhPage() {
  return (
    <LearnArticle
      eyebrow="ĐÔNG PHƯƠNG · NGŨ HÀNH"
      title={
        <>
          Đặt Tên Theo{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            Ngũ Hành
          </span>
        </>
      }
      standfirst={
        <>
          Đặt tên theo ngũ hành là cách bố mẹ gửi lời chúc cân bằng vào tên con: chọn tên sao cho hành
          của nó bổ trợ cho lá số Bát Tự của bé. Nhưng một cái tên hay trước hết là nghĩa đẹp, âm dễ
          thương và tình cảm gia đình — ngũ hành chỉ là một lớp tham khảo, không nên máy móc.
        </>
      }
      readMeta="8 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Đặt tên ngũ hành' },
      ]}
      relatedLenses={relatedLearnLenses('dat-ten-ngu-hanh')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày giờ sinh của bé, hệ thống gợi ý những hướng chọn tên theo hành cần bổ trong Bát Tự để bạn tham khảo — cùng với nhắc nhở ưu tiên nghĩa đẹp và âm hài hoà.',
        href: '/dat-ten-ngu-hanh',
        label: 'Gợi ý tên theo ngũ hành',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <DatTenFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Đặt tên theo ngũ hành là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đặt tên theo ngũ hành là chọn tên (tên đệm + tên chính) sao cho{' '}
                <strong>ngũ hành của tên bổ trợ cho lá số Bát Tự của bé</strong> — bổ hành đang{' '}
                <strong>thiếu</strong> hoặc là <strong>dụng thần</strong>, tránh hành gây xung khắc, để
                cân bằng Kim – Mộc – Thủy – Hỏa – Thổ. Đây là một nét văn hoá phương Đông, cách bố mẹ
                gửi mong muốn con được hài hoà, may mắn vào chính cái tên.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Ngũ hành trong tên là <strong>một lớp tham khảo bổ sung</strong>, giúp bố mẹ có thêm
                  một góc để cân nhắc — không phải luật bắt buộc, càng không phải điều kiện để bé được
                  hạnh phúc.
                </li>
                <li>
                  Một cái tên hay trước hết là <strong>nghĩa đẹp + âm dễ thương + tình cảm gia đình</strong>{' '}
                  gửi gắm trong đó. Ngũ hành chỉ là điểm cộng thêm.
                </li>
              </ul>
              <p>
                Một điều quan trọng để giữ đúng tinh thần: đừng để áp lực "chọn đúng hành" lấn át ý
                nghĩa và sự thoải mái của con. Tên là món quà theo con cả đời — hieu.asia gợi ý để bạn{' '}
                <strong>tham khảo</strong>, không phán và không máy móc.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <DatTenDepth />,
        },
        {
          id: 'buoc-1-tim-hanh',
          tocLabel: 'Bước 1 · Hành cần bổ',
          heading: 'Bước 1: tìm hành cần bổ (dụng thần)',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mọi thứ bắt đầu từ <strong>lá số Bát Tự của bé</strong>, lập từ{' '}
                <strong>giờ – ngày – tháng – năm sinh</strong>. Bát Tự cho thấy trong tứ trụ, các hành
                Kim – Mộc – Thủy – Hỏa – Thổ hành nào <strong>vượng</strong> (mạnh), hành nào{' '}
                <strong>nhược</strong> (yếu) hay thiếu hẳn.
              </p>
              <p>
                Hành đang thiếu hoặc cần được nâng đỡ để lá số cân bằng thường được gọi là{' '}
                <strong>dụng thần</strong> — chính là hành ta muốn "bổ" qua cái tên. Đồng thời cũng lưu
                ý <strong>tránh hành gây xung khắc</strong> làm lá số mất cân bằng thêm.
              </p>
              <p className="text-sm text-foreground/70">
                Bạn không cần tự tính bằng tay: việc lập Bát Tự và xác định hành cần bổ có thể để công
                cụ hỗ trợ. Phần này chỉ để bạn hiểu vì sao lại chọn hành này chứ không phải hành kia —
                thay vì nhận một gợi ý "hộp đen".
              </p>
            </div>
          ),
        },
        {
          id: 'nguyen-tac-tuong-sinh',
          tocLabel: 'Tương sinh · bổ hành',
          heading: 'Nguyên tắc tương sinh: bổ thông minh hơn bổ trực tiếp',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Biết hành cần bổ rồi, có một mẹo đáng nói. Ngũ hành xoay theo{' '}
                <strong>vòng tương sinh</strong>: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc — mỗi hành sinh ra,
                nuôi dưỡng hành kế tiếp. Vì thế muốn bổ một hành, bạn có <strong>hai hướng</strong>:
                dùng chính hành đó (bổ thẳng), hoặc dùng <strong>hành sinh ra nó</strong> — kiểu “mẹ
                nuôi con”.
              </p>
              <p>
                Ví dụ bé thiếu <strong>Hỏa</strong>: có thể chọn chữ hành Hỏa (Minh, Quang, Đăng…), mà
                cũng có thể chọn chữ hành <strong>Mộc</strong> (Lâm, Tùng, Trúc…) — vì Mộc sinh Hỏa,
                giống như “thêm củi cho lửa”. Cách thứ hai bồi dưỡng hành thiếu nhẹ nhàng hơn là dồn
                thẳng, và mở rộng đáng kể số chữ đẹp bạn có thể chọn.
              </p>
              <p className="text-sm text-foreground/70">
                Đây là kỹ thuật quen thuộc trong mệnh lý; các trường phái không hoàn toàn thống nhất
                (có phái ưu tiên bổ thẳng), nên xem như một hướng tham khảo. Ba độ sâu dưới đây nói kỹ
                hơn về nó:
              </p>
              <DatTenDepthSinh />
            </div>
          ),
        },
        {
          id: 'buoc-2-chon-chu',
          tocLabel: 'Bước 2 · Chọn chữ',
          heading: 'Bước 2: chọn chữ theo bộ thủ / nghĩa',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Khi đã biết hành cần bổ, ta chọn <strong>chữ mang hành đó</strong>. Cách phổ biến nhất
                là nhận biết qua <strong>bộ thủ chữ Hán</strong>: chữ chứa bộ nào thường mang hành ứng
                với bộ ấy. Ngoài ra có thể xét theo <strong>nghĩa</strong> hoặc <strong>âm</strong> gợi
                hành.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {HANH_BO_THU.map((h) => (
                  <div
                    key={h.hanh}
                    className="rounded-xl border border-border bg-card/40 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${h.dot}`}
                      />
                      <span className="font-heading text-base font-semibold text-foreground">
                        Hành {h.hanh}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13px] uppercase tracking-wide text-muted-foreground">
                      {h.bo}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Ví dụ chữ: {h.chu}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/70">
                Bảng trên chỉ là ví dụ tiêu biểu để bạn hình dung "hành của chữ ở đâu ra", không phải
                danh sách đầy đủ. Quan trọng: chọn trong số các chữ hợp hành ra chữ nào{' '}
                <strong>nghĩa đẹp và âm hay</strong>, đừng ép lấy một chữ khó đọc chỉ vì nó đúng bộ.
              </p>
            </div>
          ),
        },
        {
          id: 'kho-ten-theo-hanh',
          tocLabel: 'Kho tên theo hành',
          heading: 'Kho tên gợi ý theo hành',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Để dễ hình dung, đây là một kho tên Việt thông dụng gom theo hành. Mỗi tên kèm nghĩa
                ngắn để bạn thấy vì sao nó được xếp vào hành đó. Lưu ý cách xếp:{' '}
                <strong>chủ yếu theo NGHĨA của chữ</strong> (và một phần theo bộ thủ), nên{' '}
                <strong>có tính quy ước</strong> — đây là gợi ý theo lớp ngũ hành để tham khảo, không
                phải khẳng định “tên này số tốt”.
              </p>
              <div className="space-y-4">
                {KHO_TEN.map((k) => (
                  <div key={k.hanh} className="rounded-xl border border-border bg-card/40 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${k.dot}`} />
                      <span className="font-heading text-base font-semibold text-foreground">
                        Hành {k.hanh}
                      </span>
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {k.ten.map((t) => (
                        <li key={t.name} className="text-sm leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground">{t.name}</span> — {t.meaning}{' '}
                          <span className="text-xs text-muted-foreground/80">
                            ({GENDER_LABEL[t.g]})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/70">
                Cùng một hành đã có nhiều chữ để chọn, nên bạn hoàn toàn có thể tìm ra một tên vừa hợp
                hành vừa nghĩa đẹp, âm hay — không phải hy sinh cái nào. Và nhớ nguyên tắc tương sinh ở
                trên: nếu hành cần bổ ít chữ ưng ý, hành “mẹ” sinh ra nó cũng là một kho để tìm.
              </p>
            </div>
          ),
        },
        {
          id: 'buoc-3-ghep-ten-hay',
          tocLabel: 'Bước 3 · Ghép tên hay',
          heading: 'Bước 3: nghĩa + âm + phong tục',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Có chữ hợp hành rồi vẫn chưa xong — bước cuối là <strong>ghép thành một cái tên hay</strong>.
                Một tên đáng để đặt cho con thường hội đủ:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Nghĩa đẹp</strong>: gửi được mong muốn, lời chúc của bố mẹ; nghĩa rõ ràng, tích
                  cực.
                </li>
                <li>
                  <strong>Âm luật hài hoà</strong>: thanh điệu dễ nghe khi đọc cả họ và tên, không trúc
                  trắc; dễ đọc, dễ viết.
                </li>
                <li>
                  <strong>Hợp phong tục gia đình</strong>: hợp họ, <strong>không phạm huý</strong> hay
                  trùng tên người trên trong dòng họ, hợp nếp đặt tên của nhà.
                </li>
              </ul>
              <p>
                Nói cách khác, ngũ hành là một trong nhiều tiêu chí, và <strong>không phải tiêu chí quan
                trọng nhất</strong>. Khi một chữ hợp hành mà lại khó đọc hoặc nghĩa mờ nhạt, hãy sẵn sàng
                chọn phương án khác — vì cái tên sẽ theo con suốt đời.
              </p>
            </div>
          ),
        },
        {
          id: 'vi-du-dat-ten',
          tocLabel: 'Ví dụ end-to-end',
          heading: 'Ví dụ end-to-end: một bé thiếu Thủy',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ghép ba bước lại cho dễ theo. Đây là một <strong>ví dụ giả định</strong> để minh hoạ,
                không phải hồ sơ thật của ai: giả sử Bát Tự của bé cho thấy{' '}
                <strong>thiếu hành Thủy</strong>.
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  <strong>Xác nhận hành cần bổ.</strong> Đừng đoán — lập Bát Tự để chắc bé thiếu Thủy,
                  bằng công cụ{' '}
                  <Link
                    href="/dat-ten-ngu-hanh"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    gợi ý tên theo ngũ hành
                  </Link>
                  . Nhớ nguyên tắc tương sinh: ngoài chữ hành Thủy, chữ hành <strong>Kim</strong> cũng
                  bổ được vì Kim sinh Thủy.
                </li>
                <li>
                  <strong>Chọn 3 phương án tên.</strong> Từ kho tên hành Thủy, thử vài chữ nghĩa đẹp:{' '}
                  <strong>Giang</strong> (sông lớn, bao la), <strong>Hà</strong> (sông, dòng chảy),{' '}
                  <strong>Khê</strong> (suối nhỏ, trong vắt). Ghép cùng họ và tên đệm để thành 2–3
                  phương án hoàn chỉnh.
                </li>
                <li>
                  <strong>Kiểm nghĩa + âm + phong tục.</strong> Đọc to cả họ tên xem thanh điệu có xuôi
                  tai không, nghĩa có rõ và đẹp không, dễ đọc dễ viết không; và{' '}
                  <strong>không trùng tên</strong> ông bà, người bậc trên trong họ (tục kiêng huý). Loại
                  dần cho tới khi còn một phương án ưng nhất.
                </li>
              </ol>
              <p>
                Chốt lại đúng thứ tự ưu tiên: ngũ hành là <strong>lớp tham khảo</strong> giúp thu hẹp
                lựa chọn, còn <strong>nghĩa và âm mới là gốc</strong> của một cái tên hay. Nếu không có
                chữ Thủy nào thật ưng, một cái tên nghĩa đẹp, âm hay mà “chưa đủ hành” vẫn hơn một chữ
                đúng hành mà trúc trắc.
              </p>
            </div>
          ),
        },
        {
          id: 'kieng-huy',
          tocLabel: 'Tục kiêng huý',
          heading: 'Tục kiêng huý: vì sao có',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ở bước kiểm phong tục vừa rồi có nhắc “kiêng huý”. Đây là{' '}
                <strong>tục tránh dùng thẳng tên</strong> người bậc trên — ông bà, cha mẹ, người đã
                khuất trong dòng họ. Thời xưa, việc kiêng còn rộng hơn: dân chúng kiêng cả{' '}
                <strong>tên vua quan</strong>, đến mức phải đọc chệch hoặc viết tránh chữ huý.
              </p>
              <p>
                Vì thế nhiều gia đình tránh đặt tên con trùng tên người trên trong họ, để giữ tôn ti và
                tránh phạm huý. Cần gọi đúng tên: đây là <strong>phong tục</strong>, không phải luật —
                nên tôn trọng nếp nhà và hỏi ý ông bà, nhưng không cần lo sợ. Nếu một cái tên đẹp tình
                cờ trùng một chữ nào đó, cứ trao đổi trong nhà để chọn cách phù hợp, giữ nghĩa đẹp và âm
                hay làm gốc.
              </p>
            </div>
          ),
        },
        {
          id: 'can-bang-dung-may-moc',
          tocLabel: 'Cân bằng, đừng máy móc',
          heading: 'Cân bằng: đừng máy móc vì đủ hành',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là điểm mấu chốt của cả bài. Rất dễ rơi vào cái bẫy "phải chọn cho{' '}
                <strong>đủ hành</strong>" đến mức bỏ qua điều quan trọng hơn: một cái tên hay trước hết
                là <strong>nghĩa đẹp, âm dễ thương và tình cảm gia đình</strong> gửi gắm vào đó.
              </p>
              <p>
                Tên là <strong>món quà theo con cả đời</strong>. Bé sẽ đọc, viết, giới thiệu tên mình
                mỗi ngày ở lớp học, trong công việc, giữa bạn bè. Một cái tên trúc trắc, khó đọc hay
                nghĩa mờ nhạt — dù "đúng hành" đến đâu — cũng khiến bé chịu thiệt. Hãy ưu tiên để bé sống
                thoải mái và <strong>tự hào với tên mình</strong>.
              </p>
              <p>
                Vậy dùng ngũ hành thế nào cho lành mạnh? Xem nó như một{' '}
                <strong>góc gợi ý để tham khảo</strong>: nếu trong nhiều cái tên hay ngang nhau có một
                cái tình cờ hợp hành cần bổ, đó là điểm cộng dễ thương. Nhưng đừng để quy tắc ngũ hành{' '}
                <strong>lấn át</strong> nghĩa, âm và sự thoải mái của con.
              </p>
            </div>
          ),
        },
        {
          id: 'tam-tai-tu-cach',
          tocLabel: 'Tam tài · tứ cách',
          heading: 'Tam tài — tứ cách: lớp đếm nét chữ Hán',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bạn có thể gặp cụm <strong>tam tài</strong> (Thiên – Địa – Nhân) và{' '}
                <strong>tứ cách</strong> (Thiên cách, Địa cách, Nhân cách, Tổng cách) khi tìm hiểu đặt
                tên. Đây là các <strong>hệ đếm số nét chữ Hán</strong>: người ta đếm số nét của từng
                chữ trong họ tên, cộng theo công thức để ra các “cách”, rồi luận cát – hung. Hệ này
                phổ biến trong danh học Nhật – Hàn.
              </p>
              <p>
                Vấn đề khi áp vào tên <strong>thuần Việt</strong>: tên ta viết bằng chữ Quốc ngữ, không
                có số nét chữ Hán cố định. Một chữ Việt có thể ứng nhiều chữ Hán khác nhau, mỗi chữ số
                nét khác nhau, nên kết quả tam tài – tứ cách thành ra{' '}
                <strong>tuỳ cách quy chữ</strong>, dễ mâu thuẫn. Vì lý do đó, hieu.asia không dùng lớp
                này làm chính; nó chỉ là một lớp tham khảo phụ. Phần chính vẫn là hành, nghĩa và âm.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn của đặt tên theo ngũ hành',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Để giữ đúng tinh thần tham khảo, cần thẳng thắn về những giới hạn:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Ngũ hành trong tên là một <strong>quan niệm văn hoá</strong>, <strong>không có bằng
                  chứng</strong> quyết định vận mệnh, sức khoẻ hay hạnh phúc của một người.
                </li>
                <li>
                  Các trường phái không hoàn toàn thống nhất: cách xác định hành của chữ (theo bộ thủ,
                  theo nghĩa, theo âm) và lớp <strong>số nét chữ</strong> (Thiên / Địa / Nhân / Tổng cách,
                  tam tài) khác nhau tuỳ hệ — nên xem là lớp tham khảo phụ, đừng câu nệ.
                </li>
                <li>
                  Đừng để áp lực "chọn đúng hành" gây căng thẳng hay <strong>lo sợ</strong>. Nếu đã lỡ
                  đặt một cái tên đẹp mà "chưa hợp hành", điều đó hoàn toàn không sao — cái quyết định
                  cuộc đời con là tình yêu thương và cách nuôi dạy.
                </li>
              </ul>
              <p>
                hieu.asia trình bày để bạn <strong>tham khảo</strong>, không phán và không tạo áp lực —
                cứ để nghĩa đẹp, âm hay và tình cảm gia đình dẫn đường, ngũ hành đi sau như một lời chúc.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <DatTenWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <DatTenRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
          children: (
            <>
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
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Muốn tham khảo hướng chọn tên theo hành cần bổ cho bé?{' '}
                <Link
                  href="/dat-ten-ngu-hanh"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Gợi ý tên theo ngũ hành →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/bat-tu', label: 'Lập lá số Bát Tự' },
                    { href: '/than-so-hoc', label: 'Thần Số Học' },
                  ]}
                />
              </div>
            </>
          ),
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <DatTenChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

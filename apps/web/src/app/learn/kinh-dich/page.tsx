import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { QUE_PAGES } from '@/lib/que-kinh-dich';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage, itemList } from '@/lib/seo/jsonld';
import {
  KinhDichFrame,
  KinhDichDepth,
  KinhDichRecall,
  KinhDichChecklist,
  KinhDichWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Kinh Dịch (Chu Dịch / I Ching): Học huyền học',
  description:
    'Kinh Dịch là kinh về sự biến dịch: 64 quẻ kép, mỗi quẻ 6 hào âm dương, là gương soi thế cục để chiêm nghiệm — không phải sấm định mệnh.',
  alternates: { canonical: 'https://hieu.asia/learn/kinh-dich' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Kinh Dịch là gì?',
    a: 'Kinh Dịch ("kinh về sự biến dịch") là một trong những bộ kinh cổ nhất của văn minh Á Đông, hình thành khoảng 3.000 năm trước. Hệ thống gồm 64 quẻ kép, mỗi quẻ là 6 hào — nét dương (liền) hoặc âm (đứt) chồng lên nhau. Mỗi quẻ mô tả một thế cục điển hình của đời sống.',
  },
  {
    q: 'Âm và Dương trong Kinh Dịch nghĩa là gì?',
    a: 'Toàn bộ Kinh Dịch dựng trên hai nét gốc: Dương là nét liền (chủ động, cương, sáng, hướng ra) và Âm là nét đứt (thuận theo, nhu, tối, hướng vào). Âm dương không phải tốt/xấu — chúng là hai mặt của một thực tại luôn chuyển hóa cho nhau.',
  },
  {
    q: 'Bát Quái và 64 quẻ liên hệ thế nào?',
    a: 'Chồng 3 nét âm/dương tạo nên 8 quái cơ bản (Càn, Khôn, Chấn, Tốn, Khảm, Ly, Cấn, Đoài), mỗi quái mang một tượng thiên nhiên và một ngũ hành. Mỗi quẻ kép là một quái trên (Thượng) chồng lên một quái dưới (Hạ); 8 × 8 = 64 tổ hợp, xếp theo trình tự Văn Vương (King Wen).',
  },
  {
    q: 'Hào động và quẻ biến là gì?',
    a: 'Khi gieo, mỗi hào ra một trong 4 trạng thái. Lão dương (số 9) và lão âm (số 6) là hào "động" — đang chuyển hóa và sẽ lật sang trạng thái ngược. Quẻ chính là quẻ rút được ngay (thế cục hiện tại); lật mỗi hào động sang trạng thái ngược sẽ ra quẻ biến — gợi ý hướng tình huống có thể chuyển tới.',
  },
  {
    q: 'Khi có nhiều hào động thì đọc lời nào?',
    a: 'Truyền thống có nhiều cách; theo phép xét số hào động của Chu Hy (tất định): 0 hào động đọc lời quẻ chính; 1 hào động đọc đúng hào đó; 2 hào đọc cả hai (trọng hào trên); 3 hào đọc lời cả quẻ chính lẫn quẻ biến (trọng quẻ chính); 4–5 hào đọc các hào tĩnh trên quẻ biến; 6 hào động đọc lời quẻ biến.',
  },
  {
    q: 'Gieo quẻ bằng cách nào?',
    a: 'Phép phổ biến là 3 đồng xu: tâm niệm một câu hỏi rõ ràng, gieo 3 đồng xu cùng lúc sáu lần, mỗi lần ra một hào, xếp từ dưới (hào 1) lên (hào 6). Tổng 3 xu cho ra số 6, 7, 8 hoặc 9 ứng với âm/dương động hoặc tĩnh, theo phân bố 1/8 dương động · 3/8 dương tĩnh · 3/8 âm tĩnh · 1/8 âm động.',
  },
  {
    q: 'Gieo quẻ online có "linh" như xu thật không?',
    a: 'Về xác suất, gieo online và gieo xu thật là tương đương — cùng một phân bố toán học. Còn "linh nghiệm" theo nghĩa huyền bí thì hieu.asia không hứa. Giá trị của quẻ nằm ở câu hỏi rõ ràng và sự chiêm nghiệm khi đọc, không nằm ở đồng xu.',
  },
  {
    q: 'Kinh Dịch có phải bói định mệnh không?',
    a: 'Không. Một quẻ Kinh Dịch là gương soi một thế cục — mô tả tình huống điển hình để người hỏi chiêm nghiệm việc của mình, không phải sấm phán định mệnh. Lời cổ thường mang sắc thái điều kiện (ví dụ "biết dừng thì tốt, theo đến cùng thì xấu"). Người hỏi luôn giữ quyền quyết định.',
  },
];

const JSONLD = [
  article({
    headline: 'Kinh Dịch (Chu Dịch / I Ching): nền tảng cho người mới',
    description:
      'Kinh Dịch là kinh về sự biến dịch: 64 quẻ kép, mỗi quẻ 6 hào âm dương, là gương soi thế cục để chiêm nghiệm — không phải sấm định mệnh.',
    url: '/learn/kinh-dich',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Kinh Dịch', url: '/learn/kinh-dich' },
  ]),
  faqPage(FAQS),
  itemList(
    QUE_PAGES.map((q) => ({
      name: 'Quẻ ' + q.id + ' — ' + q.nameVi,
      url: '/gieo-que/y-nghia/' + q.slug,
    })),
  ),
];

export default function LearnKinhDichPage() {
  return (
    <LearnArticle
      eyebrow="ĐÔNG PHƯƠNG · KINH DỊCH"
      title={
        <>
          Kinh{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">Dịch</span>
        </>
      }
      standfirst={
        <>
          "Kinh về sự biến dịch" — bộ kinh cổ nhất của văn minh Á Đông. 64 quẻ, mỗi quẻ 6
          hào âm dương, là tấm gương soi một thế cục để bạn chiêm nghiệm, chứ không phải lời
          sấm định mệnh.
        </>
      }
      readMeta="8 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Kinh Dịch' },
      ]}
      relatedLenses={relatedLearnLenses('kinh-dich')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Tâm niệm một câu hỏi rõ ràng, hệ thống mô phỏng đúng phép gieo 3 đồng xu, lập quẻ chính và quẻ biến, rồi dẫn đúng lời cổ theo luật đọc Chu Hy.',
        href: '/gieo-que',
        label: 'Gieo quẻ Kinh Dịch',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <KinhDichFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Kinh Dịch là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Kinh Dịch ("kinh về sự biến dịch") là một trong những bộ kinh cổ nhất của
                văn minh Á Đông, hình thành khoảng 3.000 năm trước — lời quẻ thuộc đời Tây
                Chu, phần Truyện giải nghĩa muộn hơn. Hệ thống gồm{' '}
                <strong>64 quẻ kép</strong>, mỗi quẻ là <strong>6 hào</strong>: nét{' '}
                <strong>dương</strong> (—, liền) hoặc <strong>âm</strong> (- -, đứt) chồng
                lên nhau. Mỗi quẻ mô tả một <strong>thế cục</strong> điển hình của đời sống;
                mỗi hào mô tả một giai đoạn hay vị trí bên trong thế cục đó.
              </p>
              <p>Có hai cách dùng Kinh Dịch song song nhau:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Sách triết lý</strong> về quy luật biến dịch: âm dương tiêu
                  trưởng, vật cực tất phản, thịnh suy luân chuyển.
                </li>
                <li>
                  <strong>Công cụ chiêm nghiệm</strong> (bốc quẻ): gieo để rút một quẻ làm
                  "tấm gương" soi tình huống đang hỏi.
                </li>
              </ul>
              <p>
                Định vị tại hieu.asia: chúng tôi mô phỏng đúng phép gieo (xác suất chuẩn) và
                tra đúng quẻ cùng lời cổ. Phần "linh nghiệm" theo nghĩa huyền bí thì{' '}
                <strong>không hứa</strong> — giá trị nằm ở câu hỏi rõ ràng và sự suy ngẫm
                khi đọc, không nằm ở đồng xu. Đây là tinh thần "xu hướng để hiểu mình",
                không phải bói định mệnh.
              </p>
            </div>
          ),
        },
        {
          id: 'khai-niem-cot-loi',
          tocLabel: 'Khái niệm cốt lõi',
          heading: 'Các khái niệm cốt lõi',
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Âm – Dương: hai nét gốc
                </h3>
                <p>
                  Toàn bộ Kinh Dịch dựng trên hai nét.{' '}
                  <strong>Dương</strong> (—) là nét liền: chủ động, cương, sáng, hướng ra —
                  trong phép bói gọi là Cửu (số 9). <strong>Âm</strong> (- -) là nét đứt:
                  thuận theo, nhu, tối, hướng vào — gọi là Lục (số 6). Âm dương{' '}
                  <strong>không</strong> phải tốt/xấu; chúng là hai mặt của một thực tại luôn
                  chuyển hóa cho nhau. Đây là nền để hiểu vì sao một hào "động" có thể lật từ
                  âm sang dương và ngược lại.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Bát Quái — 8 quái 3 hào
                </h3>
                <p>
                  Chồng 3 nét âm/dương tạo ra <strong>8 quái cơ bản</strong>, mỗi quái mang
                  một tượng thiên nhiên, một ngũ hành và một tính chất:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    <strong>Càn</strong> (☰) — Trời, Kim: cương kiện, sáng tạo, khởi xướng.
                  </li>
                  <li>
                    <strong>Khôn</strong> (☷) — Đất, Thổ: nhu thuận, bao dung, nâng đỡ.
                  </li>
                  <li>
                    <strong>Chấn</strong> (☳) — Sấm, Mộc: chấn động, bừng khởi.
                  </li>
                  <li>
                    <strong>Tốn</strong> (☴) — Gió, Mộc: thẩm thấu, thuận nhập, mềm mà bền.
                  </li>
                  <li>
                    <strong>Khảm</strong> (☵) — Nước, Thủy: hiểm, sâu, trôi chảy, trí.
                  </li>
                  <li>
                    <strong>Ly</strong> (☲) — Lửa, Hỏa: sáng tỏ, bám víu, văn minh.
                  </li>
                  <li>
                    <strong>Cấn</strong> (☶) — Núi, Thổ: dừng lại, vững, tĩnh.
                  </li>
                  <li>
                    <strong>Đoài</strong> (☱) — Đầm, Kim: vui hòa, cởi mở, lời nói.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Từ 8 quái thành 64 quẻ kép
                </h3>
                <p>
                  Mỗi quẻ kép = một <strong>quái trên (Thượng)</strong> chồng lên một{' '}
                  <strong>quái dưới (Hạ)</strong>; 8 × 8 = 64 tổ hợp. Tên quẻ thường ghép
                  tượng hai quái (ví dụ <em>Địa Thiên Thái</em> = trên Khôn/Đất + dưới
                  Càn/Trời). Về luận giải, Hạ quái (hào 1–3) thường ứng với bên trong, khởi
                  đầu, việc gần; Thượng quái (hào 4–6) ứng với bên ngoài, về sau, hướng vận
                  động. Vì thế hai quẻ dùng đúng tám quái nhưng đảo trên–dưới lại cho thế cục
                  trái ngược: <strong>Thái</strong> (Đất trên Trời — khí giao hòa, thông)
                  ngược hẳn <strong>Bĩ</strong> (Trời trên Đất — khí không giao, tắc).
                </p>
                <p>
                  64 quẻ được xếp theo <strong>trình tự Văn Vương (King Wen)</strong>, đi
                  thành 32 cặp. Một điểm triết lý đẹp: trình tự kết thúc bằng{' '}
                  <strong>Ký Tế</strong> ("đã xong") rồi <strong>Vị Tế</strong> ("chưa xong")
                  — hàm ý mọi sự hoàn thành đều chứa mầm dở dang mới, vòng biến dịch không
                  khép lại.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Thoán từ, Hào từ và vị trí hào
                </h3>
                <p>
                  <strong>Thoán từ (卦辭)</strong> là lời tổng quát cho cả quẻ; mỗi quẻ một
                  câu/đoạn ngắn. <strong>Hào từ (爻辭)</strong> là lời riêng cho từng hào —
                  64 quẻ × 6 hào = 384 hào từ, cộng hai lời đặc biệt Dụng Cửu (cho Càn) và
                  Dụng Lục (cho Khôn). Lời cổ dùng một thang đánh giá kinh điển: cát (tốt),
                  hung (xấu), hối (hối tiếc), lận (đáng tiếc), lệ (nguy) và{' '}
                  <strong>vô cữu</strong> — không phải "tốt" mà là "tránh được lỗi nếu xử
                  đúng". Các chữ này là đánh giá <em>có điều kiện theo cách ứng xử</em>,
                  không phải lời sấm về kết quả cố định.
                </p>
                <p>
                  Vị trí hào cũng mang ý nghĩa cấu trúc chung cho mọi quẻ: hào 1 là khởi đầu,
                  nền móng; hào 2 trung tâm Hạ quái, nội tâm vững; hào 3 ở ngưỡng cửa, dễ cọ
                  xát; hào 4 đầu Thượng quái, cần khiêm và linh hoạt; hào 5 là vị trung chính
                  lý tưởng nhất; hào 6 cao nhất, hết chu kỳ, cực thịnh bắt đầu chuyển.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <KinhDichDepth />,
        },
        {
          id: 'gieo-va-luan',
          tocLabel: 'Cách gieo & luận',
          heading: 'Cách gieo quẻ và luật đọc',
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Phép gieo 3 đồng xu
                </h3>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>
                    Tâm niệm <strong>một câu hỏi rõ ràng</strong> — câu hỏi tốt là câu hỏi
                    mở, về tình huống hay lựa chọn của mình, không phải câu "có–không" về một
                    tương lai cố định.
                  </li>
                  <li>
                    Gieo <strong>3 đồng xu cùng lúc, sáu lần</strong>; mỗi lần ra một hào,
                    xếp từ dưới (hào 1) lên (hào 6).
                  </li>
                  <li>
                    Tổng 3 xu cho ra số 6, 7, 8 hoặc 9, ứng với phân bố{' '}
                    <strong>1/8 dương động · 3/8 dương tĩnh · 3/8 âm tĩnh · 1/8 âm động</strong>{' '}
                    — đúng phân bố toán học cho 3 đồng xu công bằng.
                  </li>
                </ol>
                <p>
                  Phép cổ hơn là gieo 50 cọng cỏ thi — phức tạp hơn, cho cùng họ kết quả với
                  phân bố khác nhẹ. Về xác suất, gieo online và gieo xu thật là tương đương.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Hào động, quẻ chính và quẻ biến
                </h3>
                <p>
                  Mỗi hào ra một trong 4 trạng thái. <strong>Lão dương (số 9)</strong> và{' '}
                  <strong>lão âm (số 6)</strong> là hào "động" — cái gì đến cực thì chuyển
                  hóa, nên sắp lật sang trạng thái ngược. <strong>Thiếu dương (7)</strong> và{' '}
                  <strong>thiếu âm (8)</strong> là hào tĩnh, không đổi. Quẻ rút được ngay là{' '}
                  <strong>quẻ chính</strong> (thế cục hiện tại); lật mỗi hào động sang trạng
                  thái ngược, giữ nguyên hào tĩnh, sẽ ra <strong>quẻ biến</strong> — gợi ý
                  hướng tình huống có thể chuyển tới. Nếu không có hào động nào thì không có
                  quẻ biến.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Luật đọc theo số hào động (Chu Hy)
                </h3>
                <p>
                  Khi có nhiều hào động, đọc lời nào làm trọng tâm? Có trường phái dùng cách
                  khác, nhưng hieu.asia theo <strong>phép xét số hào động của Chu Hy</strong>{' '}
                  vì nó tất định — cùng kết quả gieo luôn cho cùng cách đọc:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    <strong>0 hào động:</strong> đọc lời quẻ (Thoán từ) của quẻ chính.
                  </li>
                  <li>
                    <strong>1 hào động:</strong> đọc Hào từ của đúng hào động đó.
                  </li>
                  <li>
                    <strong>2 hào động:</strong> đọc cả hai hào, trọng hào trên.
                  </li>
                  <li>
                    <strong>3 hào động:</strong> đọc lời quẻ của cả quẻ chính lẫn quẻ biến,
                    trọng quẻ chính.
                  </li>
                  <li>
                    <strong>4–5 hào động:</strong> đọc Hào từ của các hào tĩnh, trên quẻ
                    biến.
                  </li>
                  <li>
                    <strong>6 hào động:</strong> đọc lời quẻ của quẻ biến (riêng Thuần Càn và
                    Thuần Khôn thì đọc Dụng Cửu / Dụng Lục).
                  </li>
                </ul>
                <p>
                  Trực giác của luật: ít hào động thì tình huống còn ở quẻ chính, đọc chính
                  nó; càng nhiều hào động, trọng tâm càng dời sang quẻ biến.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Lưu ý khi đọc quẻ
                </h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Quẻ là <strong>gương soi một thế cục</strong>, không phải sấm định mệnh;
                    người hỏi luôn giữ quyền quyết định.
                  </li>
                  <li>
                    Giữ sắc thái <strong>điều kiện</strong> của lời cổ — ví dụ quẻ Tụng "trung
                    cát, chung hung" nghĩa là biết dừng nửa chừng thì tốt, theo đến cùng thì
                    xấu — chứ không cắt thành "quẻ này xấu".
                  </li>
                  <li>
                    Ngũ hành của quái (Càn·Đoài = Kim, Chấn·Tốn = Mộc, Khảm = Thủy, Ly = Hỏa,
                    Cấn·Khôn = Thổ) là lớp tham khảo. <strong>Có trường phái</strong> tượng số
                    khai thác mạnh ngũ hành, lục thân, nạp giáp; phái nghĩa lý lại ít dùng.
                    hieu.asia nghiêng về <strong>nghĩa lý</strong> — đọc thế cục để suy ngẫm,
                    không dự đoán cứng.
                  </li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: 'thu-vien-que',
          tocLabel: '64 quẻ',
          heading: '64 quẻ Kinh Dịch',
          children: (
            <>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Mỗi quẻ mở ra trang ý nghĩa đầy đủ: hình tượng, thế cục, gợi ý ứng xử và
                câu hỏi tự soi — để tham khảo mà chiêm nghiệm, không phải lời phán định.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {QUE_PAGES.map((q) => (
                  <Link
                    key={q.slug}
                    href={`/gieo-que/y-nghia/${q.slug}`}
                    className="group rounded-lg border border-border bg-card/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-card/60"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-700">
                      Quẻ {q.id}
                    </p>
                    <p className="mt-1.5 font-heading text-base font-semibold text-foreground group-hover:text-gold">
                      {q.nameVi}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {q.keyTags.join(' · ')}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi "tại sao"',
          children: <KinhDichWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <KinhDichRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
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
          children: <KinhDichChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

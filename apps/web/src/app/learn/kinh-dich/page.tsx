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
  {
    q: 'Đắc trung, đắc chính là gì?',
    a: 'Đắc trung là hào nằm giữa một quái ba hào: hào 2 (giữa Hạ quái) và hào 5 (giữa Thượng quái) — giữ được mức trung, không lệch cực, nên lời hào ở hai vị này thường nghiêng lành. Đắc chính (đương vị) là hào dương nằm ở vị lẻ (1, 3, 5) hoặc hào âm nằm ở vị chẵn (2, 4, 6) — nét nằm "đúng vị" của nó. Khi hai tiêu chí vênh nhau, truyền thống chú giải thường coi đắc trung quý hơn đắc chính; hào 5 dương (nhãn Cửu Ngũ) vừa trung vừa chính nên được xem là vị đẹp kinh điển.',
  },
  {
    q: '64 quẻ có quẻ nào xấu hẳn không?',
    a: 'Không. Lời quẻ và lời hào là đánh giá có điều kiện theo cách ứng xử — quẻ khó như Bĩ (bế tắc) vẫn kèm cách giữ mình chờ chuyển mùa. Trình tự 64 quẻ kết thúc bằng Ký Tế ("đã xong") rồi Vị Tế ("chưa xong"): mọi hoàn thành đều chứa mầm dở dang mới, không thế cục nào đứng yên. Truyền thống cũng hay nhắc quẻ Khiêm là quẻ duy nhất cả sáu hào đều không xấu — ngay thang khen chê của Kinh Dịch cũng gắn với cách ứng xử, không phải bản án.',
  },
];

// Sổ tay thuật ngữ — hiển thị ở section "so-tay-thuat-ngu".
const GLOSSARY = [
  {
    term: 'Quái (卦)',
    def: 'Khối ba hào âm dương (Càn, Khôn, Chấn, Tốn, Khảm, Ly, Cấn, Đoài); còn gọi đơn quái hay trigram.',
  },
  {
    term: 'Quẻ kép (trùng quái 重卦)',
    def: 'Hai quái chồng nhau thành sáu hào; có 8 × 8 = 64 quẻ kép.',
  },
  {
    term: 'Hào (爻)',
    def: 'Một nét trong quẻ: nét liền = dương, nét đứt = âm; đánh số từ 1 (đáy) đến 6 (đỉnh).',
  },
  {
    term: 'Thượng quái / Hạ quái',
    def: 'Quái trên (hào 4–6, thường ứng bên ngoài, về sau) và quái dưới (hào 1–3, thường ứng bên trong, khởi đầu).',
  },
  {
    term: 'Thoán từ (卦辭)',
    def: 'Lời quẻ: câu tổng quát cho cả thế cục, mỗi quẻ một lời.',
  },
  {
    term: 'Hào từ (爻辭)',
    def: 'Lời riêng của từng hào; 64 quẻ × 6 hào = 384 lời, cộng hai lời Dụng Cửu / Dụng Lục.',
  },
  {
    term: 'Hào động',
    def: 'Hào gieo ra lão dương (số 9) hoặc lão âm (số 6) — đang ở cực nên sắp lật sang trạng thái ngược.',
  },
  {
    term: 'Lão / thiếu',
    def: 'Bốn trạng thái khi gieo: lão dương 9 và lão âm 6 (động); thiếu dương 7 và thiếu âm 8 (tĩnh).',
  },
  {
    term: 'Quẻ chính (本卦)',
    def: 'Quẻ rút được ngay khi gieo; mô tả thế cục hiện tại.',
  },
  {
    term: 'Quẻ biến (之卦)',
    def: 'Quẻ lập ra bằng cách lật các hào động, giữ nguyên hào tĩnh; gợi hướng tình huống chuyển tới.',
  },
  {
    term: 'Đắc trung',
    def: 'Hào nằm giữa quái của mình: hào 2 (giữa Hạ quái) và hào 5 (giữa Thượng quái); thường nghiêng lành vì giữ được mức trung.',
  },
  {
    term: 'Đắc chính (đương vị)',
    def: 'Hào dương nằm ở vị lẻ (1, 3, 5) hoặc hào âm nằm ở vị chẵn (2, 4, 6) — nét nằm đúng vị của nó.',
  },
  {
    term: 'Dụng Cửu (用九)',
    def: 'Lời chốt riêng của Thuần Càn, chỉ đọc khi cả sáu hào đều động.',
  },
  {
    term: 'Dụng Lục (用六)',
    def: 'Lời chốt riêng của Thuần Khôn, chỉ đọc khi cả sáu hào đều động.',
  },
  {
    term: 'Vô cữu (无咎)',
    def: '"Không lỗi": tránh được lỗi nếu xử đúng — không đồng nghĩa với "tốt".',
  },
  {
    term: 'Cát · hung · hối · lận · lệ',
    def: 'Thang đánh giá của lời cổ: tốt / xấu / hối tiếc / đáng tiếc hổ thẹn / nguy — đều có điều kiện theo cách ứng xử.',
  },
  {
    term: 'Thập Dực (十翼)',
    def: '"Mười cánh": các thiên Truyện giải nghĩa phần Kinh (Thoán truyện, Tượng truyện, Hệ từ, Văn ngôn, Thuyết quái, Tự quái, Tạp quái), ra đời muộn hơn.',
  },
  {
    term: 'Trình tự Văn Vương',
    def: 'Thứ tự 1–64 truyền thống của các bản Chu Dịch, đi thành 32 cặp quẻ lật ngược hoặc đối nhau.',
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
      readMeta="15 phút đọc · Cập nhật 2026"
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
          id: 'coi-nguon-van-ban',
          tocLabel: 'Cội nguồn văn bản',
          heading: 'Cội nguồn văn bản: Kinh và Truyện',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bộ sách người nay gọi là Kinh Dịch có tên đầy đủ là <strong>Chu Dịch</strong>,
                gồm hai tầng văn bản cách nhau nhiều thế kỷ. Tầng thứ nhất là phần{' '}
                <strong>Kinh</strong>: lời quẻ (Thoán từ) và lời hào (Hào từ), thuộc khoảng
                đời Tây Chu — lớp chữ cổ nhất, khoảng 3.000 năm trước. Tầng thứ hai là phần{' '}
                <strong>Truyện</strong>, tức <strong>Thập Dực</strong> ("mười cánh"): các
                thiên giải nghĩa ra đời muộn hơn, gồm Thoán truyện, Tượng truyện, Hệ từ, Văn
                ngôn, Thuyết quái, Tự quái và Tạp quái.
              </p>
              <p>
                Truyền thống kể nguồn gốc bộ sách qua bốn bàn tay: tương truyền{' '}
                <strong>Phục Hy</strong> vạch tám quái; <strong>Văn Vương</strong> xếp 64 quẻ
                và đặt lời quẻ; lời hào gắn với <strong>Chu Công</strong>; còn Thập Dực gắn
                với truyền thống <strong>Khổng Tử</strong>. Đó là cách người xưa kể. Giới
                nghiên cứu văn bản ngày nay chỉ dám chắc ở mức: phần Kinh thuộc khoảng Tây
                Chu, phần Truyện là các thiên được quy cho đời sau. Trang này giữ đúng mức
                thận trọng đó.
              </p>
              <p>
                Hai thiên trong Thập Dực xuất hiện trực tiếp trong cách trình bày quẻ ở đây:{' '}
                <strong>Tự quái truyện</strong> giải vì sao quẻ này nối tiếp quẻ kia — chính
                là trình tự Văn Vương mà thư viện 64 quẻ dùng; <strong>Thuyết quái truyện</strong>{' '}
                gán cho tám quái khung gia đình cha, mẹ và sáu người con để liên tưởng vai
                trò, quan hệ. Ngoài ra, truyền thống còn có hai cách xếp tám quái — tiên
                thiên và hậu thiên — dùng cho những mục đích khác nhau; bài này không đi sâu.
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
                  64 quẻ được xếp theo <strong>trình tự Văn Vương (King Wen)</strong> — thứ
                  tự phổ biến nhất trong các bản Chu Dịch truyền thống, cũng là thứ tự mà Tự
                  quái truyện giải nghĩa. 64 quẻ đi thành <strong>32 cặp đi đôi</strong>:
                  hầu hết là cặp "lật ngược" — quẻ sau chính là quẻ trước úp ngược lại;
                  riêng bốn cặp mà lật ngược vẫn trùng chính nó (Càn–Khôn, Khảm–Ly, Di–Đại
                  Quá, Trung Phu–Tiểu Quá) thì đi theo lối đối âm dương từng hào. Hai cặp
                  quen mặt nhất vừa lật ngược vừa đối nhau từng nét:{' '}
                  <strong>Thái ↔ Bĩ</strong> (đổi âm dương của cả sáu hào quẻ Thái thì ra
                  đúng quẻ Bĩ) và <strong>Ký Tế ↔ Vị Tế</strong>.
                </p>
                <p>
                  Một điểm triết lý đẹp: trình tự kết thúc bằng <strong>Ký Tế</strong> ("đã
                  xong") rồi <strong>Vị Tế</strong> ("chưa xong") — hàm ý mọi sự hoàn thành
                  đều chứa mầm dở dang mới, vòng biến dịch không khép lại.
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
                  Thoán từ hay lặp lại một số <strong>mô-típ ngôn ngữ cổ</strong>. Nắm được
                  chúng thì đọc lời quẻ nào cũng bớt lạ:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground">
                        <th className="py-2 pr-4 font-semibold">Mô-típ</th>
                        <th className="py-2 font-semibold">Nghĩa</th>
                      </tr>
                    </thead>
                    <tbody className="align-top">
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">
                          Nguyên hanh (元亨)
                        </td>
                        <td className="py-2">
                          "Hanh thông từ gốc" — thế cục thông suốt tận căn.
                        </td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">
                          Lợi trinh (利貞)
                        </td>
                        <td className="py-2">
                          "Lợi về sự bền chính" — giữ đúng đường ngay thẳng thì có lợi;
                          không phải "trinh tiết".
                        </td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">
                          Lợi thiệp đại xuyên (利涉大川)
                        </td>
                        <td className="py-2">
                          "Lợi cho việc vượt sông lớn" — thuận cho việc khó, việc mạo hiểm
                          đáng làm.
                        </td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">
                          Lợi kiến đại nhân (利見大人)
                        </td>
                        <td className="py-2">
                          "Nên gặp bậc đại nhân" — nên tìm người có tầm, có uy tín giúp mình.
                        </td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">
                          Vô cữu (无咎)
                        </td>
                        <td className="py-2">
                          "Không lỗi" — không phải "tốt", mà là tránh được lỗi nếu xử đúng.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-foreground">
                          Cát · hung · hối · lận · lệ
                        </td>
                        <td className="py-2">
                          Thang đánh giá kinh điển: tốt / xấu / hối tiếc / đáng tiếc hổ thẹn
                          / nguy.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
          id: 'doc-vi-tri-hao',
          tocLabel: 'Vị trí hào',
          heading: 'Đọc vị trí hào: đắc trung, đắc chính',
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Đọc nhãn hào: Sơ Cửu, Lục Nhị, Cửu Ngũ…
                </h3>
                <p>
                  Mỗi hào có một nhãn cổ điển ghép từ hai phần: <strong>thứ tự</strong> (Sơ
                  = hào 1; Nhị, Tam, Tứ, Ngũ = hào 2–5; Thượng = hào 6) và{' '}
                  <strong>tính âm dương</strong> (Cửu = dương, Lục = âm). Vậy nên Sơ Cửu
                  (初九) là hào 1 dương, Lục Nhị (六二) là hào 2 âm, Cửu Ngũ (九五) là hào 5
                  dương, Thượng Lục (上六) là hào 6 âm. Đọc được nhãn là biết ngay lời hào
                  đang nói về nét nào, ở bậc nào của quẻ.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Sáu vị trí — sáu chặng của một thế cục
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground">
                        <th className="py-2 pr-4 font-semibold">Hào</th>
                        <th className="py-2 pr-4 font-semibold">Tên vị trí</th>
                        <th className="py-2 font-semibold">Ý cấu trúc (xu hướng)</th>
                      </tr>
                    </thead>
                    <tbody className="align-top">
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4">1</td>
                        <td className="py-2 pr-4 font-medium text-foreground">
                          Sơ hào (đáy)
                        </td>
                        <td className="py-2">
                          Khởi đầu, nền móng; thiếu kinh nghiệm nhưng giàu tiềm năng — ẩn
                          mình xây nền quan trọng hơn vội tiến.
                        </td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4">2</td>
                        <td className="py-2 pr-4 font-medium text-foreground">Nhị hào</td>
                        <td className="py-2">
                          Giữa Hạ quái; nội tâm vững, điều hòa bên trong — hành động không
                          cần phô trương.
                        </td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4">3</td>
                        <td className="py-2 pr-4 font-medium text-foreground">Tam hào</td>
                        <td className="py-2">
                          Đỉnh Hạ quái, ngưỡng chuyển sang tầng trên; điểm căng thẳng, dễ cọ
                          xát — thận trọng ở ngưỡng cửa.
                        </td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4">4</td>
                        <td className="py-2 pr-4 font-medium text-foreground">Tứ hào</td>
                        <td className="py-2">
                          Vừa bước vào Thượng quái, gần đỉnh mà chưa phải đỉnh — cần linh
                          hoạt, khiêm nhường để tránh va vị quyền lực.
                        </td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4">5</td>
                        <td className="py-2 pr-4 font-medium text-foreground">Ngũ hào</td>
                        <td className="py-2">
                          Giữa Thượng quái — vị trung chính lý tưởng nhất: đủ cao để nhìn
                          xa, đủ trung để không lệch; tình thế chín, ảnh hưởng rộng.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">6</td>
                        <td className="py-2 pr-4 font-medium text-foreground">
                          Thượng hào (đỉnh)
                        </td>
                        <td className="py-2">
                          Cao nhất, hết chu kỳ; hoàn thành nhưng cực thịnh bắt đầu chuyển —
                          chuẩn bị thoái hoặc sang chu kỳ mới.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Đắc trung và đắc chính
                </h3>
                <p>
                  Hai khái niệm bổ trợ hay gặp trong truyền thống chú giải.{' '}
                  <strong>Đắc trung</strong>: hào nằm giữa một quái ba hào — tức hào 2 (giữa
                  Hạ quái) và hào 5 (giữa Thượng quái) — giữ được mức trung, không lệch cực,
                  nên lời hào ở hai vị này thường nghiêng lành. <strong>Đắc chính</strong>{' '}
                  (còn gọi đương vị): hào dương nằm ở vị lẻ (1, 3, 5) hoặc hào âm nằm ở vị
                  chẵn (2, 4, 6) — nét nằm "đúng vị" của nó.
                </p>
                <p>
                  Khi hai tiêu chí vênh nhau, truyền thống chú giải thường coi{' '}
                  <strong>đắc trung quý hơn đắc chính</strong>. Hai ví dụ từ chính lời cổ:
                  Cửu Ngũ — hào 5 dương — vừa trung vừa chính, là vị đẹp kinh điển; ở quẻ
                  Càn, đó là hào "Phi long tại thiên" (rồng bay trên trời). Ngược lại, hào 2
                  quẻ Thái là nét dương nằm ở vị chẵn — không "đúng vị" theo luật chung —
                  nhưng nhờ ở giữa Hạ quái mà lời hào vẫn nghiêng khen, khép lại bằng "đắc
                  thượng vu trung hành": được hợp với đạo trung.
                </p>
                <p className="text-sm text-muted-foreground">
                  Đây là lớp cấu trúc giúp hiểu vì sao lời hào nghiêng khen hay chê, không
                  phải luật thắng thua tuyệt đối. Công cụ gieo quẻ của hieu.asia dẫn lời hào
                  và ý nghĩa vị trí hào; phần đắc trung, đắc chính nêu ở đây là nguyên tắc
                  chung để bạn tự đối chiếu khi đọc.
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
          id: 'dung-cuu-dung-luc',
          tocLabel: 'Dụng Cửu – Dụng Lục',
          heading: 'Dụng Cửu – Dụng Lục: hai lời chốt của Càn và Khôn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ngoài 384 lời hào, Chu Dịch còn đúng hai lời đặc biệt, dành cho một tình
                huống hiếm: gieo được <strong>Thuần Càn</strong> hoặc{' '}
                <strong>Thuần Khôn</strong> mà <strong>cả sáu hào đều động</strong>. Lúc đó
                không đọc lời quẻ biến như các quẻ khác, mà đọc lời chốt riêng:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Dụng Cửu (用九)</strong> — cho Càn: "Hiện quần long vô thủ, cát"
                  (見羣龍无首，吉) — thấy bầy rồng mà không con nào tranh đứng đầu, tốt lành.
                  Cứng đến cực mà biết mềm, không cố chấp ngôi đầu.
                </li>
                <li>
                  <strong>Dụng Lục (用六)</strong> — cho Khôn: "Lợi vĩnh trinh" (利永貞) —
                  lợi ở việc giữ chính bền lâu dài.
                </li>
              </ul>
              <p>
                Hai lời này dạy đúng cái nghịch lý của quẻ thuần: dương đến cực phải biết
                nhu, âm đến cực phải biết giữ bền — cốt lõi của triết lý "vật cực tất phản".
              </p>
            </div>
          ),
        },
        {
          id: 'vi-du-mot-lan-gieo',
          tocLabel: 'Ví dụ trọn vẹn',
          heading: 'Một lần gieo trọn vẹn — ví dụ minh họa',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Dưới đây là một ca mẫu đi từ đầu tới cuối, dùng quẻ thật và lời cổ thật
                trong thư viện của hieu.asia. Đây là <strong>ví dụ minh họa cách đọc</strong>{' '}
                — không phải mẫu trả lời duy nhất đúng.
              </p>
              <ol className="list-decimal space-y-3 pl-6">
                <li>
                  <strong>Câu hỏi.</strong> "Tôi có nên nhận vai dẫn dắt dự án mới trong quý
                  tới không?" — câu hỏi mở, về một lựa chọn cụ thể của mình.
                </li>
                <li>
                  <strong>Gieo.</strong> Sáu lần gieo 3 đồng xu, xếp từ dưới lên, ra: 7 · 9
                  · 7 · 8 · 8 · 8. Tức hào 1 dương tĩnh, <strong>hào 2 dương động</strong>{' '}
                  (lão dương 9), hào 3 dương tĩnh, hào 4–6 âm tĩnh.
                </li>
                <li>
                  <strong>Lập quẻ chính.</strong> Ba nét dương dưới = Càn (Trời), ba nét âm
                  trên = Khôn (Đất) → quẻ số 11, <strong>Địa Thiên Thái</strong>. Thoán từ:
                  "Tiểu vãng đại lai, cát hanh" (小往大來，吉亨) — cái nhỏ đi, cái lớn đến;
                  tốt và hanh thông. Thế cục nền: thời thuận, trên dưới giao hòa.
                </li>
                <li>
                  <strong>Áp luật Chu Hy.</strong> Đúng một hào động → trọng tâm là{' '}
                  <strong>Hào từ của hào 2</strong>; lời quẻ chỉ làm nền.
                </li>
                <li>
                  <strong>Đọc lời hào.</strong> Hào 2 quẻ Thái (nhãn Cửu Nhị 九二): "Bao
                  hoang. Dụng bằng hà, bất hà di; bằng vong. Đắc thượng vu trung hành" — bao
                  dung cả chốn hoang vu, dám lội sông không thuyền, không bỏ sót nơi xa,
                  không kết bè cánh riêng; được hợp với đạo trung.
                </li>
                <li>
                  <strong>Lập quẻ biến.</strong> Lật đúng hào động: hào 2 từ dương thành âm,
                  Hạ quái Càn (Trời) thành Ly (Lửa) → quẻ số 36,{' '}
                  <strong>Địa Hỏa Minh Di</strong> — mặt trời lặn vào lòng đất; thoán từ
                  "Lợi gian trinh" (利艱貞): lợi ở giữ bền chính trong lúc gian nan.
                </li>
                <li>
                  <strong>Đọc gộp rồi tự vấn.</strong> Thế cục hiện tại thuận (Thái); lời
                  hào trọng tâm không bàn "nên hay không" mà bàn <em>cách nhận vai</em>: ôm
                  được cả phần việc xa và khó, không kéo bè cánh riêng, giữ đạo trung. Hướng
                  chuyển (Minh Di) nhắc thời thuận không kéo dài mãi — có thể tới giai đoạn
                  phải làm âm thầm, giữ lửa bên trong. Người hỏi tự vấn: việc khó nào mình
                  đã hoãn lâu mà thời thuận này chính là lúc làm? Mình đang xây "đệm" gì cho
                  lúc chu kỳ đổi chiều? — rồi tự quyết.
                </li>
              </ol>
              <p>
                Quẻ không trả lời "có" hay "không". Nó soi thế cục, chỉ chỗ đang chuyển và
                điều kiện ứng xử — phần quyết định luôn ở người hỏi.
              </p>
            </div>
          ),
        },
        {
          id: 'ngu-hanh-cua-quai',
          tocLabel: 'Ngũ hành của quái',
          heading: 'Ngũ hành của quái — một lớp phụ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mỗi quái mang một hành: <strong>Càn, Đoài = Kim</strong>;{' '}
                <strong>Chấn, Tốn = Mộc</strong>; <strong>Khảm = Thủy</strong>;{' '}
                <strong>Ly = Hỏa</strong>; <strong>Cấn, Khôn = Thổ</strong>. Giữa các hành
                có quan hệ <strong>tương sinh</strong> (Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh
                Kim, Kim sinh Thủy, Thủy sinh Mộc) và <strong>tương khắc</strong> (Mộc khắc
                Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc).
              </p>
              <p>
                Áp vào một quẻ kép, quan hệ giữa Thượng quái và Hạ quái có thể tô thêm màu
                cho luận giải — chẳng hạn trên sinh dưới đọc như ngoại lực nâng đỡ, trên
                khắc dưới đọc như áp lực từ bên trên dội xuống.
              </p>
              <p>
                Nhưng cần nói thẳng: đây là <strong>lớp tham khảo, không phải xương sống</strong>.
                Phái nghĩa lý — hướng mà hieu.asia theo — ít dùng ngũ hành; khai thác mạnh
                nó là phái tượng số, với các phép như lục hào hay Mai Hoa Dịch Số. Hai kỹ
                thuật hay được nhắc tên trong nhánh này:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Nạp giáp</strong>: phép gán thiên can, địa chi vào từng hào của
                  quái, nối quẻ Dịch với hệ can chi — từ đó mỗi hào mang một hành riêng để
                  xét sinh khắc.
                </li>
                <li>
                  <strong>Lục thân</strong>: trên nền đó, gán các hào vào các vai quan hệ so
                  với người hỏi (cha mẹ, anh em, con cháu, tài lộc, chức sự) — hỏi việc gì
                  thì nhìn hào giữ vai ấy.
                </li>
              </ul>
              <p>
                Công cụ gieo quẻ của hieu.asia hiện chỉ giữ hành của quái để liên tưởng,
                chưa tính nạp giáp hay lục thân — nên bài đọc ở đây không dựng dự đoán trên
                ngũ hành quẻ. Có trường phái làm khác; đó là khác biệt về đường lối, không
                phải chuyện đúng sai.
              </p>
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
                    <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
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
          id: 'so-tay-thuat-ngu',
          tocLabel: 'Sổ tay thuật ngữ',
          heading: 'Sổ tay thuật ngữ Kinh Dịch',
          children: (
            <>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Tra nhanh các thuật ngữ dùng trong bài này và trong trang kết quả gieo quẻ.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {GLOSSARY.map((g) => (
                  <div
                    key={g.term}
                    className="rounded-lg border border-border bg-card/40 p-4"
                  >
                    <p className="font-semibold text-foreground">{g.term}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {g.def}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                Nguồn của trang: nguyên văn Thoán từ, Hào từ là văn bản cổ Chu Dịch thuộc
                phạm vi công cộng (đối chiếu Wikisource); luật số hào động theo Chu Hy (Chu
                Dịch Bản Nghĩa, Dịch Học Khải Mông); phần cấu trúc quẻ và Thập Dực theo
                truyền thống chú giải; tổng hợp và diễn nghĩa tiếng Việt của hieu.asia.
              </p>
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

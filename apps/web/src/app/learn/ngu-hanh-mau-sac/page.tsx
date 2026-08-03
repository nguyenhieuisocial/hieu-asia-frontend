/**
 * /learn/ngu-hanh-mau-sac — bài học nền tảng về NGŨ HÀNH và MÀU SẮC, đi kèm công
 * cụ /mau-xe-hop-menh.
 *
 * GROUNDING (chống bịa — mọi bảng đều RENDER TỪ LIB, không chép tay):
 *  - `lib/dat-ten-ngu-hanh` → `ELEMENTS`: tên hành, blurb ("Tượng kim loại", "Tượng
 *    cây cối", "Tượng nước", "Tượng lửa", "Tượng đất") và bốn quan hệ
 *    sinhBy / sinhTo / khac / khacBy → hai bảng tương sinh & tương khắc bên dưới
 *    được sinh ra từ chính các trường này.
 *  - `lib/ban-menh-data` → `ELEMENT_COLORS` (nhóm màu của mỗi hành) + `COLOR_HEX`
 *    (mã màu để vẽ ô minh hoạ).
 *  - `lib/mau-xe-data` → `CAR_COLORS` (12 màu sơn xe phổ biến → hành),
 *    `listElementCarGuide()` và `buildMauXe(year)` — chính engine đang chạy ở
 *    trang công cụ /mau-xe-hop-menh (hợp = hành bản mệnh + hành sinh mệnh;
 *    nên cân nhắc = hành khắc mệnh). Ba ví dụ theo năm sinh gọi thẳng engine này
 *    nên không thể lệch với công cụ.
 *  - `lib/ngu-hanh-remedy` → phát biểu chuẩn của hai vòng sinh / khắc.
 *  - Câu về AN TOÀN (xe màu sáng dễ được nhận biết khi thiếu sáng) giữ đúng chữ
 *    đã dùng ở trang /mau-xe-hop-menh — KHÔNG thêm con số nào.
 *
 * PHÂN VAI (không lấn bài khác): đặt tên theo ngũ hành → /learn/dat-ten-ngu-hanh;
 * cách tra nạp âm / mệnh theo năm sinh → công cụ /ban-menh; hướng nhà, Cung Phi →
 * /learn/bat-trach và /learn/phong-thuy.
 */
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
import { ELEMENTS, type Element } from '@/lib/dat-ten-ngu-hanh';
import { ELEMENT_COLORS, COLOR_HEX } from '@/lib/ban-menh-data';
import { CAR_COLORS, buildMauXe, type CarColor } from '@/lib/mau-xe-data';
import {
  MauSacFrame,
  MauSacDepth,
  MauSacRecall,
  MauSacChecklist,
  MauSacWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Ngũ hành và màu sắc — hành nào hợp màu nào',
  description:
    'Ngũ hành và màu sắc: vì sao Hoả là đỏ, Thuỷ là đen, Mộc là xanh lá; hai vòng tương sinh – tương khắc và cách chọn màu theo mệnh. Tham khảo, không phán.',
  alternates: { canonical: 'https://hieu.asia/learn/ngu-hanh-mau-sac' },
};

/** Thứ tự đọc vòng tương sinh: Mộc → Hoả → Thổ → Kim → Thuỷ → (Mộc). */
const SINH_ORDER: Element[] = ['moc', 'hoa', 'tho', 'kim', 'thuy'];

/**
 * Hình ảnh tự nhiên đứng sau mỗi bước TƯƠNG SINH (k sinh ELEMENTS[k].sinhTo).
 * Đây là phần "vì sao" — khoá theo hành nguồn, còn cặp hành thì lấy từ ELEMENTS.
 */
const WHY_SINH: Record<Element, string> = {
  moc: 'Gỗ khô bén lửa — thứ nuôi ngọn lửa cháy lên chính là cây cối.',
  hoa: 'Lửa cháy hết chỉ còn lại tro, tro lắng xuống và bồi thành đất.',
  tho: 'Quặng kim loại nằm sẵn trong lòng đất — phải xẻ đất mới lấy được.',
  kim: 'Mặt kim loại lạnh làm hơi nước ngưng thành giọt; nung đủ nóng thì chính kim loại cũng chảy ra thành dòng.',
  thuy: 'Có nước thì hạt mới nảy mầm, cây mới vươn lên được.',
};

/** Hình ảnh tự nhiên đứng sau mỗi bước TƯƠNG KHẮC (k khắc ELEMENTS[k].khac). */
const WHY_KHAC: Record<Element, string> = {
  moc: 'Rễ cây đâm xuyên và rút hết màu mỡ của đất.',
  tho: 'Đắp một bờ đất là chặn được cả dòng nước.',
  thuy: 'Nước hắt vào thì ngọn lửa tắt ngay.',
  hoa: 'Lửa đủ nóng thì kim loại cứng mấy cũng mềm ra.',
  kim: 'Lưỡi rìu, lưỡi cưa bằng kim loại đốn ngã được cây.',
};

/** Vì sao nhóm màu ấy lại được gán cho hành ấy — nối thẳng vào blurb của ELEMENTS. */
const WHY_COLOR: Record<Element, string> = {
  kim: 'Nhìn vào một lưỡi dao, một cái chuông đồng đánh bóng: sắc trắng sáng và xám ánh kim.',
  moc: 'Nhìn vào tán lá và thân cây đang sống: xanh lá, xanh lục, xanh rêu.',
  thuy: 'Nước giếng sâu và mặt biển đêm nhìn đen thẫm; nước nông dưới trời thì ánh xanh lam.',
  hoa: 'Nhìn vào ngọn lửa và nắng gắt: đỏ, cam — dải sắc nóng đậm nhất kéo sang hồng và tím.',
  tho: 'Nhìn xuống chân: đất phù sa, đất khô và cát — vàng, nâu, be.',
};

/** Bảng "phần dư" của mỗi hành trên 12 màu sơn xe — TÍNH từ CAR_COLORS, không chép tay. */
function carColorsOf(el: Element): CarColor[] {
  return CAR_COLORS.filter((c) => c.element === el);
}

function colorNames(list: CarColor[]): string {
  return list.map((c) => c.name).join(', ');
}

/** Ba ví dụ theo năm sinh — gọi thẳng engine của công cụ /mau-xe-hop-menh. */
const EXAMPLE_YEARS = [1996, 1988, 1994];
const EXAMPLES = EXAMPLE_YEARS.map((y) => buildMauXe(y)).filter(
  (d): d is NonNullable<ReturnType<typeof buildMauXe>> => d !== null,
);

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Vì sao mỗi hành lại ứng với một nhóm màu nhất định?',
    a: 'Vì màu được gán vào hành theo hình ảnh tự nhiên của chính hành đó. Hoả là tượng lửa nên ứng với đỏ, cam; Thuỷ là tượng nước nên ứng với đen và xanh dương (nước sâu nhìn đen thẫm); Mộc là tượng cây cối nên ứng với xanh lá; Kim là tượng kim loại nên ứng với trắng, bạc, xám ánh kim; Thổ là tượng đất nên ứng với vàng, nâu, be. Đây là quan hệ tương ứng theo hình ảnh — một hệ biểu tượng văn hoá, không phải quy luật vật lý.',
  },
  {
    q: 'Ngũ hành tương sinh và tương khắc đi theo thứ tự nào?',
    a: 'Tương sinh: Mộc sinh Hoả, Hoả sinh Thổ, Thổ sinh Kim, Kim sinh Thuỷ, Thuỷ sinh Mộc — một vòng khép kín. Tương khắc: Mộc khắc Thổ, Thổ khắc Thuỷ, Thuỷ khắc Hoả, Hoả khắc Kim, Kim khắc Mộc. Nếu xếp năm hành lên một vòng tròn theo thứ tự tương sinh thì vòng sinh nối các hành sát nhau, còn vòng khắc nhảy cách một hành — vẽ ra thành ngôi sao năm cánh nằm trong vòng tròn.',
  },
  {
    q: 'Xanh lá và xanh dương có thuộc cùng một hành không?',
    a: 'Không. Tiếng Việt gọi chung là "xanh" nhưng hai màu này thuộc hai hành khác nhau: xanh lá, xanh lục, xanh rêu thuộc hành Mộc (màu của cây cối), còn xanh dương, xanh lam, xanh nước biển thuộc hành Thuỷ (màu của nước). Khi tra màu, hãy nói rõ là xanh lá hay xanh dương, nếu không kết quả sẽ lệch hoàn toàn.',
  },
  {
    q: 'Màu vàng thuộc hành Kim hay hành Thổ?',
    a: 'Thuộc hành Thổ. Vàng, vàng đất, vàng cát, nâu và be/kem đều là màu của đất nên xếp vào Thổ. Cách nói quen miệng "vàng kim" hay gây nhầm, nhưng màu đại diện của hành Kim là trắng, bạc và xám/ghi — sắc ánh kim loại, không phải sắc vàng.',
  },
  {
    q: 'Chọn màu theo hành của mình hay hành sinh ra mình?',
    a: 'Cả hai. Nhóm màu được xem là hợp gồm màu của chính hành bản mệnh cộng màu của hành sinh ra bản mệnh (hành bổ trợ). Nhóm nên cân nhắc là màu của hành khắc bản mệnh. Những màu còn lại là trung tính — không xung mà cũng không đặc biệt hợp, cứ chọn thoải mái. Riêng quan hệ "mình khắc nó" không được dùng để chọn màu.',
  },
  {
    q: 'Đi xe màu bị coi là "khắc mệnh" thì có sao không?',
    a: 'Không sao cả. "Khắc mệnh" chỉ là gợi ý nên cân nhắc theo quan niệm phong thuỷ, không phải điều cấm và không định đoạt may rủi của ai. Nếu bạn thích một màu, thấy nó đẹp và an toàn khi lái thì cứ chọn — sự tự tin và an toàn quan trọng hơn nhiều.',
  },
  {
    q: 'Màu xe ảnh hưởng thật tới điều gì?',
    a: 'Tới hai thứ đo được. Thứ nhất là an toàn: các nghiên cứu giao thông cho thấy xe màu sáng, đặc biệt trắng và vàng, dễ được nhận biết hơn trong điều kiện thiếu sáng hoặc thời tiết xấu. Thứ hai là giá bán lại: màu phổ thông thường dễ sang tay hơn màu hiếm vì người mua sau cũng chuộng màu an toàn thị hiếu. Hai điều này nên được cân nhắc trước yếu tố hợp mệnh.',
  },
  {
    q: 'Muốn biết mình thuộc hành nào thì tra ở đâu?',
    a: 'Hành bản mệnh được suy từ năm sinh theo nạp âm; bạn nhập năm sinh tại trang ngũ hành bản mệnh (/ban-menh) là ra. Bài này không dạy cách tra nạp âm mà tập trung vào phần sau đó: mỗi hành ứng với nhóm màu nào và vì sao. Nếu chỉ cần danh sách màu xe cho riêng mình, dùng thẳng công cụ màu xe hợp mệnh.',
  },
];

const JSONLD = [
  article({
    headline: 'Ngũ hành và màu sắc: hành nào ứng với màu nào — và vì sao',
    description:
      'Ngũ hành và màu sắc: hai vòng tương sinh – tương khắc, lý do mỗi hành ứng với một nhóm màu, và cách chọn màu cho đồ vật lớn như chiếc xe. Tham khảo, không phán số mệnh.',
    url: '/learn/ngu-hanh-mau-sac',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Ngũ hành và màu sắc', url: '/learn/ngu-hanh-mau-sac' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Ngũ hành và màu sắc — hành nào hợp màu nào',
    description:
      'Ngũ hành và màu sắc: vì sao Hoả là đỏ, Thuỷ là đen, Mộc là xanh lá; hai vòng tương sinh – tương khắc và cách chọn màu theo mệnh. Tham khảo, không phán.',
    url: '/learn/ngu-hanh-mau-sac',
  }),
];

export default function LearnNguHanhMauSacPage() {
  return (
    <LearnArticle
      eyebrow="NGŨ HÀNH · MÀU SẮC"
      title={
        <>
          Ngũ hành và{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">màu sắc</span>
        </>
      }
      standfirst={
        <>
          Vì sao Hoả là màu đỏ còn Thuỷ là màu đen? Vì sao mệnh này "hợp" màu kia? Bài này mở nắp
          bảng màu ngũ hành ra cho bạn xem bên trong: hai vòng tương sinh – tương khắc, logic tự
          nhiên đứng sau từng nhóm màu, và cách áp vào một món đồ lớn như chiếc xe — kèm một câu
          nhắc thẳng thắn: an toàn đứng trước phong thuỷ.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Ngũ hành và màu sắc' },
      ]}
      relatedLenses={relatedLearnLenses('ngu-hanh-mau-sac')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh, hệ thống cho biết bạn thuộc hành nào, những màu xe nào được xem là hợp, màu nào trung tính và màu nào nên cân nhắc — chạy đúng hai vòng sinh – khắc trong bài này.',
        href: '/mau-xe-hop-menh',
        label: 'Tra màu xe hợp mệnh',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <MauSacFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Ngũ hành – màu sắc là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Người xưa xếp mọi thứ trong tự nhiên vào <strong>năm hành</strong>: Kim, Mộc, Thuỷ,
                Hoả, Thổ. Màu sắc cũng được xếp vào đó — và không hề tuỳ tiện. Mỗi hành vốn được mô
                tả bằng một hình ảnh: Kim là <em>tượng kim loại</em>, Mộc là <em>tượng cây cối</em>,
                Thuỷ là <em>tượng nước</em>, Hoả là <em>tượng lửa</em>, Thổ là <em>tượng đất</em>.
                Màu của hành chính là <strong>màu của hình ảnh đó</strong>. Lửa đỏ, nước đen thẫm, lá
                xanh, kim loại trắng bạc, đất vàng nâu.
              </p>
              <p>Cần tách bạch ngay từ đầu ba điều:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Đây là <strong>hệ biểu tượng văn hoá</strong> — một cách phân loại thế giới theo
                  hình ảnh. Nó <strong>không phải quy luật vật lý</strong>: không có cơ chế nào khiến
                  một chiếc xe màu đỏ toả ra nhiều "khí Hoả" hơn chiếc màu xanh.
                </li>
                <li>
                  Nó nói về <strong>quan hệ giữa các nhóm</strong> (nhóm này nuôi nhóm kia, nhóm này
                  kìm nhóm kia), chứ không phán màu nào tốt màu nào xấu một cách tuyệt đối. Cùng một
                  màu đỏ: với người này là màu bổ trợ, với người kia là màu nên cân nhắc.
                </li>
                <li>
                  Giá trị thật của nó là <strong>giúp bạn thu hẹp lựa chọn</strong> và thấy ưng ý với
                  quyết định của mình. Nó không hứa hẹn tài lộc, may mắn, và tuyệt đối không phải lý
                  do để ai bán thêm cho bạn thứ gì.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Bài này chỉ lo phần <strong>hành ↔ màu</strong>. Muốn biết mình thuộc hành nào, nhập
                năm sinh tại{' '}
                <Link href="/ban-menh" className="text-gold-700 underline-offset-4 hover:underline">
                  ngũ hành bản mệnh
                </Link>{' '}
                (bài này không dạy cách tra nạp âm). Muốn dùng ngũ hành để đặt tên cho con, xem{' '}
                <Link
                  href="/learn/dat-ten-ngu-hanh"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  đặt tên theo ngũ hành
                </Link>
                ; muốn xem hướng nhà, xem{' '}
                <Link
                  href="/learn/bat-trach"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Bát Trạch
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <MauSacDepth />,
        },
        {
          id: 'tuong-sinh-tuong-khac',
          tocLabel: 'Hai vòng sinh – khắc',
          heading: 'Hai vòng: tương sinh và tương khắc, cùng logic tự nhiên đằng sau',
          children: (
            <div className="space-y-5 text-foreground/85 leading-relaxed">
              <p>
                Năm hành không đứng riêng lẻ mà nối với nhau bằng hai vòng. Điều thú vị là{' '}
                <strong>cả hai vòng đều đọc được từ hình ảnh tự nhiên</strong> — không cần học thuộc,
                chỉ cần hình dung. Dưới đây là từng bước, kèm hình ảnh đứng sau nó.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Vòng tương sinh — hành này nuôi hành kia
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Quan hệ
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Đọc theo màu
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Hình ảnh tự nhiên đứng sau
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SINH_ORDER.map((key) => {
                      const from = ELEMENTS[key];
                      const to = ELEMENTS[from.sinhTo];
                      return (
                        <tr key={key} className="border-b border-border/60 last:border-b-0">
                          <td className="px-4 py-2 font-medium text-foreground">
                            {from.name} sinh {to.name}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {ELEMENT_COLORS[key][0]} → {ELEMENT_COLORS[from.sinhTo][0]}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">{WHY_SINH[key]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Bước cuối quay lại bước đầu, nên đây là một <strong>vòng khép kín</strong>: Mộc → Hoả
                → Thổ → Kim → Thuỷ → rồi lại Mộc. Đọc bằng màu cũng khép kín y như vậy.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Vòng tương khắc — hành này kìm hành kia
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Quan hệ
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Đọc theo màu
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Hình ảnh tự nhiên đứng sau
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SINH_ORDER.map((key) => {
                      const from = ELEMENTS[key];
                      const to = ELEMENTS[from.khac];
                      return (
                        <tr key={key} className="border-b border-border/60 last:border-b-0">
                          <td className="px-4 py-2 font-medium text-foreground">
                            {from.name} khắc {to.name}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {ELEMENT_COLORS[key][0]} kìm {ELEMENT_COLORS[from.khac][0]}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">{WHY_KHAC[key]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                  Mẹo nhớ bằng một hình duy nhất
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
                  Xếp năm hành lên một vòng tròn theo đúng thứ tự tương sinh. Khi đó vòng{' '}
                  <strong>sinh</strong> nối các hành <strong>sát nhau</strong> (thành chính đường
                  tròn), còn vòng <strong>khắc</strong> luôn <strong>nhảy cách một hành</strong>{' '}
                  (thành ngôi sao năm cánh nằm bên trong). Một hình vẽ chứa cả hai vòng — nhớ hình là
                  nhớ hết.
                </p>
              </div>

              <p>
                Và đây là chỗ sai nhiều nhất khi mới học:{' '}
                <strong>chiều của quan hệ khắc không được đảo</strong>. "Hoả khắc Kim" nghĩa là người
                mệnh <strong>Kim</strong> mới cần để ý nhóm màu đỏ – cam – tím. Còn người mệnh Hoả
                thì đang bị Thuỷ khắc, nên nhóm màu cần để ý của họ là đen – xanh dương. Đảo chiều
                một lần là ra kết quả ngược hẳn.
              </p>
            </div>
          ),
        },
        {
          id: 'hanh-va-mau',
          tocLabel: '5 hành ↔ 5 nhóm màu',
          heading: 'Bảng 5 hành ↔ nhóm màu — và vì sao lại ứng như vậy',
          children: (
            <div className="space-y-5 text-foreground/85 leading-relaxed">
              <p>
                Bảng dưới đây là bảng màu duy nhất mà toàn bộ hieu.asia dùng — cùng một nguồn cho
                trang bản mệnh, trang màu xe và bài học này, nên bạn không bao giờ nhận hai kết quả
                mâu thuẫn. Cột cuối là phần thường bị bỏ qua: <strong>lý do</strong>.
              </p>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Hành
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Nhóm màu
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Màu sơn xe tương ứng
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Vì sao ứng như vậy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SINH_ORDER.map((key) => {
                      const info = ELEMENTS[key];
                      return (
                        <tr key={key} className="border-b border-border/60 last:border-b-0">
                          <td className="px-4 py-3 align-top">
                            <span className="font-medium text-foreground">{info.name}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {info.blurb}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span className="flex flex-wrap items-center gap-2">
                              {ELEMENT_COLORS[key].map((c) => (
                                <span key={c} className="inline-flex items-center gap-1.5">
                                  <span
                                    aria-hidden="true"
                                    className="inline-block h-3.5 w-3.5 rounded-full border border-border"
                                    style={{ backgroundColor: COLOR_HEX[c] }}
                                  />
                                  <span className="text-foreground/85">{c}</span>
                                </span>
                              ))}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top text-muted-foreground">
                            {colorNames(carColorsOf(key))}
                          </td>
                          <td className="px-4 py-3 align-top text-muted-foreground">
                            {WHY_COLOR[key]}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Ba cái bẫy khi gọi tên màu bằng tiếng Việt
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>"Xanh"</strong> — tiếng Việt gộp hai màu vào một chữ. Xanh lá, xanh lục,
                  xanh rêu thuộc <strong>Mộc</strong>; xanh dương, xanh lam, xanh nước biển thuộc{' '}
                  <strong>Thuỷ</strong>. Hai hành khác nhau hoàn toàn.
                </li>
                <li>
                  <strong>"Vàng"</strong> — vàng, vàng đất, vàng cát thuộc <strong>Thổ</strong>, dù
                  cách nói quen miệng là "vàng kim". Màu đại diện của Kim là trắng, bạc, xám/ghi —
                  sắc ánh kim loại chứ không phải sắc vàng.
                </li>
                <li>
                  <strong>"Tím"</strong> — nhiều người đoán tím thuộc Thuỷ vì trông lạnh mắt, nhưng ở
                  hệ màu dùng tại đây tím xếp cùng đỏ, hồng và cam, tức là <strong>Hoả</strong>. Đây
                  cũng là chỗ các tài liệu khác nhau nhiều nhất, nên hieu.asia chốt một bảng và dùng
                  nhất quán thay vì đổi theo từng trang.
                </li>
              </ul>

              <p className="text-sm text-foreground/70">
                Mẹo dùng được ở showroom: đừng tra theo <strong>tên thương mại</strong> của hãng
                ("Xanh Rêu Ánh Ngọc", "Vàng Cát Sa Mạc") — nhìn thẳng vào sắc chủ đạo rồi tự hỏi: nó
                giống lá cây, nước, kim loại, lửa hay đất hơn cả? Trả lời được là ra hành, không cần
                bảng nào.
              </p>
            </div>
          ),
        },
        {
          id: 'chon-mau-thuc-te',
          tocLabel: 'Chọn màu thực tế',
          heading: 'Nguyên tắc chọn màu — và ba ví dụ theo năm sinh',
          children: (
            <div className="space-y-5 text-foreground/85 leading-relaxed">
              <p>
                Toàn bộ cách chọn màu gói trong <strong>ba dòng</strong>. Không có bảng bí truyền nào
                khác:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Màu nên chọn</strong> = màu của <strong>hành bản mệnh</strong> (chính mình)
                  cộng màu của <strong>hành sinh ra bản mệnh</strong> (hành bổ trợ).
                </li>
                <li>
                  <strong>Màu nên cân nhắc</strong> = màu của <strong>hành khắc bản mệnh</strong>.
                  "Cân nhắc" chứ không phải "cấm".
                </li>
                <li>
                  <strong>Còn lại là trung tính</strong> — không xung, cũng không đặc biệt hợp. Nhóm
                  này thường đông nhất, và bạn hoàn toàn tự do trong đó.
                </li>
              </ul>
              <p>
                Vì sao chỉ lấy hành sinh ra mình mà không lấy hành mình sinh ra? Vì theo cách hiểu
                phổ biến, hành mình sinh ra là hành <strong>nhận</strong> năng lượng từ mình — hài
                hoà, nhưng không được xem là bổ trợ. Cũng vì thế mà quan hệ "mình khắc nó" không có
                vai trò gì trong việc chọn màu.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Ba ví dụ — tra mệnh rồi đọc ra màu
              </h3>
              <p className="text-sm text-foreground/70">
                Ba thẻ dưới đây lấy thẳng kết quả từ engine của công cụ màu xe, nên chúng luôn khớp
                với thứ bạn nhận được khi tự nhập năm sinh.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {EXAMPLES.map((ex) => (
                  <div key={ex.year} className="rounded-xl border border-border bg-card/40 p-4">
                    <p className="font-heading text-base font-semibold text-foreground">
                      Sinh năm {ex.year}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">
                      Tuổi {ex.canChi} · mệnh {ex.elementName}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/60">
                      {ex.sinhElementName} sinh {ex.elementName} (bổ trợ) · {ex.khacElementName} khắc{' '}
                      {ex.elementName} (nên cân nhắc)
                    </p>

                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
                      Màu nên chọn
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2">
                      {ex.hopCarColors.map((c) => (
                        <span key={c.name} className="inline-flex items-center gap-1.5 text-sm">
                          <span
                            aria-hidden="true"
                            className="inline-block h-3.5 w-3.5 rounded-full border border-border"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-foreground/85">{c.name}</span>
                        </span>
                      ))}
                    </p>

                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      Màu nên cân nhắc
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2">
                      {ex.avoidCarColors.map((c) => (
                        <span key={c.name} className="inline-flex items-center gap-1.5 text-sm">
                          <span
                            aria-hidden="true"
                            className="inline-block h-3.5 w-3.5 rounded-full border border-border"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-foreground/85">{c.name}</span>
                        </span>
                      ))}
                    </p>

                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      Trung tính (thoải mái chọn): {colorNames(ex.neutralCarColors)}.
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Một quan sát ít người để ý: số màu "cần cân nhắc" không đều nhau
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Mệnh
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Hành bổ trợ
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Số màu xe nên chọn
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Số màu xe nên cân nhắc
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SINH_ORDER.map((key) => {
                      const info = ELEMENTS[key];
                      const hop =
                        carColorsOf(key).length + carColorsOf(info.sinhBy).length;
                      const avoid = carColorsOf(info.khacBy).length;
                      return (
                        <tr key={key} className="border-b border-border/60 last:border-b-0">
                          <td className="px-4 py-2 font-medium text-foreground">{info.name}</td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {ELEMENTS[info.sinhBy].name}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">{hop} / 12</td>
                          <td className="px-4 py-2 text-muted-foreground">{avoid} / 12</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p>
                Nhìn cột cuối sẽ thấy mệnh Thổ chỉ vướng đúng một màu, còn mệnh Kim vướng tới ba.
                Điều đó <strong>không</strong> có nghĩa mệnh Thổ "may" hơn. Nó chỉ phản ánh một sự
                thật rất trần tục: thị trường sơn xe có nhiều sắc đỏ – cam – tím hơn sắc xanh lá. Nói
                cách khác, bảng này phản ánh <strong>thị trường sơn xe</strong> nhiều không kém phản
                ánh cổ học — thêm một lý do để đừng coi nó là phán quyết.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: cái gì là biểu tượng, cái gì ảnh hưởng thật',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này quan trọng hơn tất cả các bảng phía trên, nên nói thẳng. Ngũ hành – màu sắc
                là một <strong>hệ biểu tượng văn hoá</strong>: màu được gán vào hành vì{' '}
                <strong>giống nhau về hình ảnh</strong>, không phải vì có cơ chế nào tác động qua
                lại. Không có nghiên cứu nào cho thấy màu sơn của chiếc xe làm thay đổi tài lộc, sức
                khoẻ hay công việc của chủ xe.
              </p>
              <p>
                Nhưng màu xe thì có ảnh hưởng thật — chỉ là ở chỗ khác, và ở hai chỗ rất đáng để ý:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>An toàn.</strong> Các nghiên cứu giao thông cho thấy xe màu sáng, đặc biệt
                  là trắng và vàng, <strong>dễ được nhận biết hơn</strong> trong điều kiện thiếu sáng
                  hoặc thời tiết xấu. Đây là ảnh hưởng đo được và liên quan trực tiếp tới tính mạng —
                  nó quan trọng hơn hợp mệnh, không cần bàn cãi.
                </li>
                <li>
                  <strong>Giá bán lại.</strong> Màu phổ thông thường dễ sang tay hơn màu hiếm, đơn
                  giản vì người mua sau cũng chuộng màu an toàn thị hiếu. Một màu độc lạ có thể khiến
                  chiếc xe nằm chờ lâu hơn khi bạn cần bán.
                </li>
              </ul>
              <p>
                Vậy khi hai bên xung đột thì sao? Xếp thứ tự ưu tiên thế này:{' '}
                <strong>an toàn → nhu cầu sử dụng và chi phí giữ gìn → giá bán lại → sở thích → phong
                thuỷ</strong>. Phong thuỷ đứng cuối không phải vì nó vô giá trị, mà vì bốn thứ đứng
                trước đều có hậu quả đo được, còn nó thì không.
              </p>
              <p>
                Cách dùng lành mạnh nhất: coi bảng màu ngũ hành là <strong>bộ lọc phụ</strong>. Khi
                vài phương án đã ngang nhau về an toàn, giá và sở thích, hãy để nó giúp bạn chốt cho
                ưng ý. Còn để nó phủ quyết một lựa chọn tốt hơn hẳn thì là dùng sai — và nếu ai đó
                dùng nó để ép bạn chi thêm tiền, đó lại càng không phải phong thuỷ.
              </p>
              <p className="text-sm text-foreground/70">
                hieu.asia trình bày cách tính minh bạch để bạn tự quyết. Chúng tôi không phán số
                mệnh, không doạ vận hạn và không bán bất cứ dịch vụ "đổi màu đổi vận" nào.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <MauSacWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <MauSacRecall />,
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
                Muốn biết ngay danh sách màu xe cho riêng năm sinh của bạn?{' '}
                <Link
                  href="/mau-xe-hop-menh"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Tra màu xe hợp mệnh miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/mau-xe-hop-menh', label: 'Màu xe hợp mệnh' },
                    { href: '/ban-menh', label: 'Ngũ hành bản mệnh' },
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
          children: <MauSacChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import Link from 'next/link';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { listCung } from '@/lib/cung-hoang-dao-data';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage, itemList } from '@/lib/seo/jsonld';
import {
  ChiemTinhFrame,
  ChiemTinhDepth,
  ChiemTinhRecall,
  ChiemTinhChecklist,
  ChiemTinhWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Chiêm tinh phương Tây — bản đồ sao & 12 cung',
  description:
    'Chiêm tinh phương Tây dựng bản đồ sao từ giờ + nơi sinh: 12 cung hoàng đạo, hành tinh, cung Mọc, 12 nhà, góc hợp — xu hướng để hiểu mình, không phán số mệnh.',
  alternates: { canonical: 'https://hieu.asia/learn/chiem-tinh' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Chiêm tinh phương Tây là gì?',
    a: 'Chiêm tinh phương Tây dựng một bản đồ sao thiên cung (natal chart) — ảnh chụp bầu trời tại thời điểm và nơi sinh của một người. Bản đồ ghi vị trí Mặt Trời, Mặt Trăng và các hành tinh trên vòng hoàng đạo (12 cung × 30° = 360°), cộng cung Mọc và 12 nhà. Luận giải là đọc tổ hợp hành tinh ở cung nào, nhà nào, hợp góc với nhau ra sao — như xu hướng để hiểu mình, không phán định số phận.',
  },
  {
    q: 'Chiêm tinh phương Tây khác Tử Vi và Bát Tự ở đâu?',
    a: 'Chiêm tinh phương Tây dựa trên vị trí thật của hành tinh trên hoàng đạo (thiên văn), dùng 4 nguyên tố (Lửa, Đất, Khí, Nước) và trục Mặt Trời + Mặt Trăng + cung Mọc. Tử Vi/Bát Tự (Đông phương) dựa trên Can–Chi và sao an theo lịch âm, dùng 5 hành (Kim, Mộc, Thủy, Hỏa, Thổ). Lưu ý: "12 con giáp" là Đông phương, không phải 12 cung hoàng đạo; "cung Mọc" của chiêm tinh Tây khác "cung Mệnh" của Tử Vi.',
  },
  {
    q: '12 cung hoàng đạo được phân loại thế nào?',
    a: 'Mỗi cung là giao của hai trục: nguyên tố (Lửa, Đất, Khí, Nước — mỗi nguyên tố 3 cung) và tính chất (Tiên phong, Kiên định, Linh hoạt — mỗi tính chất 4 cung). 4 × 3 = 12 tổ hợp duy nhất. Hiểu một cung là hiểu "tính chất + nguyên tố" của nó. Ví dụ Bọ Cạp = Nước Kiên định (cảm xúc sâu + bám riết không buông).',
  },
  {
    q: 'Cung Mọc (Ascendant) là gì, có quan trọng hơn cung Mặt Trời không?',
    a: 'Cung Mọc là cung đang mọc ở chân trời phía Đông lúc sinh, phụ thuộc giờ và nơi sinh — nó là "lớp vỏ", ấn tượng đầu tiên và quyết định cách xếp 12 nhà. Đừng chỉ đọc cung Mặt Trời: "bộ ba" Mặt Trời – Mặt Trăng – cung Mọc mới là chân dung cốt lõi. Vì cung Mọc đổi cung mỗi khoảng 2 giờ nên giờ sinh sai sẽ làm cung Mọc sai — đây là phần nhạy giờ nhất.',
  },
  {
    q: 'Góc hợp (aspect) giữa các hành tinh nghĩa là gì?',
    a: 'Góc hợp là khoảng cách góc giữa hai thiên thể trên vòng hoàng đạo, cho biết hai phần trong con người bạn "nói chuyện" với nhau hài hoà hay căng. Năm góc thường dùng: trùng tụ (0°), lục hợp (60°), vuông góc (90°), tam hợp (120°), đối đỉnh (180°). Góc "căng" (vuông góc, đối đỉnh) không phải xui — nó cho động lực trưởng thành; góc "hài hoà" (tam hợp, lục hợp) cho tài năng nhưng dễ ỷ lại. Tránh dán nhãn tốt/xấu cứng.',
  },
  {
    q: 'Đọc cung hoàng đạo có chính xác cho từng người không?',
    a: 'Mô tả cung Mặt Trời là chung cho cả tháng sinh nên dễ rơi vào "bẫy Barnum" — ai đọc cũng thấy đúng. Để có ý nghĩa cá nhân, cần cá nhân hoá bằng dữ kiện thật khác: cung Mọc, Mặt Trăng, hành tinh ở nhà nào, góc hợp gì, phân bố nguyên tố của cả bản đồ. Mọi diễn giải chỉ là xu hướng để hiểu mình, không phải định mệnh.',
  },
  {
    q: 'Có hai người "khắc" nhau theo cung hoàng đạo không?',
    a: 'Không có hai cung "khắc" nhau theo kiểu định mệnh. Khác biệt nghĩa là cần thấu hiểu và lắng nghe, không phải "không thể yêu". Cung đối (cách nhau 180°) thường hút mạnh vì mỗi người có đúng thứ kia thiếu — vừa cuốn vừa thử thách. Độ hợp thật của hai người cần cả bản đồ sao (Mặt Trăng, Sao Kim, Sao Hỏa, cung Mọc...), không chỉ cung Mặt Trời.',
  },
  {
    q: 'Tại sao tôi đọc nơi khác lại ra cung khác?',
    a: 'Thường vì nhầm hai hệ hoàng đạo. hieu.asia dùng hoàng đạo nhiệt đới (tropical): 0° Bạch Dương = điểm xuân phân, là hệ phổ biến nhất ở phương Tây. Hệ kia là hoàng đạo sao trời (sidereal, dùng trong chiêm tinh Vệ Đà) lệch khoảng 24° do tuế sai. Ngoài ra, ranh giới ngày giữa các cung lệch ±1 ngày tuỳ năm; người sinh sát đầu/cuối khoảng được xác định theo vị trí Mặt Trời thật, có thể mang nét của cả hai cung.',
  },
];

const JSONLD = [
  article({
    headline: 'Chiêm tinh phương Tây: bản đồ sao & 12 cung hoàng đạo cho người mới',
    description:
      'Chiêm tinh phương Tây dựng bản đồ sao từ giờ + nơi sinh: 12 cung hoàng đạo, hành tinh, cung Mọc, 12 nhà, góc hợp — xu hướng để hiểu mình, không phán số mệnh.',
    url: '/learn/chiem-tinh',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Chiêm tinh phương Tây', url: '/learn/chiem-tinh' },
  ]),
  faqPage(FAQS),
  itemList(listCung().map((s) => ({ name: s.name, url: '/cung-hoang-dao/' + s.slug }))),
];

export default function LearnChiemTinhPage() {
  return (
    <LearnArticle
      eyebrow="TÂY PHƯƠNG · CHIÊM TINH"
      title={
        <>
          Chiêm tinh{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">phương Tây</span>
        </>
      }
      standfirst={
        <>
          Chiêm tinh phương Tây dựng một "bản đồ sao" từ giờ và nơi bạn sinh: vị trí Mặt Trời,
          Mặt Trăng và các hành tinh trên 12 cung hoàng đạo, cộng cung Mọc và 12 nhà. Đây là xu
          hướng để hiểu mình, không phải lời phán số mệnh.
        </>
      }
      readMeta="8 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Chiêm tinh phương Tây' },
      ]}
      relatedLenses={relatedLearnLenses('chiem-tinh')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập giờ và nơi sinh, hệ thống lập bản đồ sao của bạn: cung Mặt Trời, Mặt Trăng, cung Mọc, 12 nhà và các góc hợp giữa hành tinh — xem trực quan trước khi đọc luận giải.',
        href: '/ban-do-sao',
        label: 'Lập bản đồ sao',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <ChiemTinhFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Bản đồ sao là gì — và khác Tử Vi ở đâu',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Chiêm tinh phương Tây (Western astrology) dựng một <strong>bản đồ sao thiên
                cung</strong> (natal chart) — ảnh chụp bầu trời tại <strong>thời điểm và nơi
                sinh</strong> của một người. Bản đồ ghi lại vị trí Mặt Trời, Mặt Trăng và các
                hành tinh trên <strong>vòng hoàng đạo</strong> (chia 12 cung × 30° = 360°), cộng
                với <strong>cung Mọc</strong> và <strong>12 nhà</strong> (phụ thuộc giờ + nơi
                sinh). Luận giải là đọc tổ hợp: hành tinh ở cung nào, nhà nào, hợp góc với nhau
                ra sao.
              </p>
              <p>
                Bản đồ dùng ở đây là <strong>hoàng đạo nhiệt đới</strong> (tropical): 0° Bạch
                Dương gắn với điểm xuân phân, là hệ phổ biến nhất ở phương Tây. Hệ kia là{' '}
                <strong>hoàng đạo sao trời</strong> (sidereal, dùng trong chiêm tinh Vệ Đà) lệch
                khoảng 24° do tuế sai — nếu bạn đọc nơi khác ra cung khác, thường là do nhầm hai
                hệ này.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Phân biệt rõ với Tử Vi / Bát Tự
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Cơ sở:</strong> chiêm tinh Tây dựa vào vị trí thật của hành tinh trên
                  hoàng đạo (thiên văn); Tử Vi/Bát Tự dựa vào Can–Chi và sao an theo lịch âm.
                </li>
                <li>
                  <strong>Nguyên tố:</strong> phương Tây dùng 4 nguyên tố (Lửa, Đất, Khí,
                  Nước); Đông phương dùng 5 hành (Kim, Mộc, Thủy, Hỏa, Thổ).
                </li>
                <li>
                  <strong>Trục cá nhân:</strong> phương Tây là Mặt Trời + Mặt Trăng + cung Mọc;
                  Đông phương là Nhật Chủ (Bát Tự) hoặc cung Mệnh (Tử Vi).
                </li>
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                ⚠️ <strong>Chống nhầm lẫn:</strong> "12 con giáp" (Tý, Sửu, Dần…) là Đông
                phương, không phải 12 cung hoàng đạo. "Cung Mọc" (Ascendant) của chiêm tinh Tây
                khác "cung Mệnh" của Tử Vi.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <ChiemTinhDepth />,
        },
        {
          id: 'vong-hoang-dao',
          tocLabel: '12 cung hoàng đạo',
          heading: 'Vòng hoàng đạo: nền của mọi luận giải',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Vòng hoàng đạo 360° chia 12 cung, mỗi cung 30°. Mỗi cung được định nghĩa bằng
                giao của hai trục: <strong>nguyên tố</strong> (chất liệu cốt lõi) và{' '}
                <strong>tính chất</strong> (cách năng lượng vận hành).
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Bốn nguyên tố (xu hướng cốt lõi)
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Lửa</strong> (Bạch Dương, Sư Tử, Nhân Mã) — hành động, nhiệt huyết,
                  bộc trực; sống bằng đam mê và cảm hứng.
                </li>
                <li>
                  <strong>Đất</strong> (Kim Ngưu, Xử Nữ, Ma Kết) — thực tế, bền bỉ, đáng tin;
                  xây mọi thứ vững chắc, từng bước.
                </li>
                <li>
                  <strong>Khí</strong> (Song Tử, Thiên Bình, Bảo Bình) — tư duy, giao tiếp, ý
                  tưởng; sống trong thế giới trí óc và kết nối.
                </li>
                <li>
                  <strong>Nước</strong> (Cự Giải, Bọ Cạp, Song Ngư) — cảm xúc, trực giác, đồng
                  cảm; cảm nhận sâu, thấu hiểu người khác.
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground">
                Ba tính chất (cách năng lượng vận hành)
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tiên phong</strong> (Bạch Dương, Cự Giải, Thiên Bình, Ma Kết) — khởi
                  sự, mở đường, chủ động bắt đầu cái mới.
                </li>
                <li>
                  <strong>Kiên định</strong> (Kim Ngưu, Sư Tử, Bọ Cạp, Bảo Bình) — duy trì, bền
                  chí, ổn định, giữ vững điều đã chọn.
                </li>
                <li>
                  <strong>Linh hoạt</strong> (Song Tử, Xử Nữ, Nhân Mã, Song Ngư) — thích nghi,
                  chuyển tiếp, đa năng, xoay theo hoàn cảnh.
                </li>
              </ul>
              <p>
                <strong>Mẹo luận nhanh:</strong> mỗi cung = "[tính chất] + [nguyên tố]". Ví dụ
                Bọ Cạp = Nước Kiên định → cảm xúc sâu (Nước) + bám riết không buông (Kiên định)
                → mãnh liệt, kiên trì tới tận cùng. Ma Kết = Đất Tiên phong → thực tế (Đất) +
                chủ động leo lên (Tiên phong) → kỷ luật xây mục tiêu dài hạn. Đây là cách suy có
                cơ sở thay vì học thuộc 12 mô tả rời.
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                ⚠️ <strong>Ranh giới ngày lệch ±1 ngày tuỳ năm</strong> vì điểm xuân phân không
                rơi đúng cùng giờ mỗi năm. Người sinh sát đầu/cuối khoảng được xác định theo vị
                trí Mặt Trời thật, có thể mang nét của cả hai cung. Về chủ quản (hành tinh cai
                quản) của cung: <strong>có trường phái dùng cổ điển, có trường phái dùng hiện
                đại</strong> (ví dụ Bọ Cạp: cổ điển là Sao Hỏa, hiện đại thêm Sao Diêm Vương) —
                không khẳng định một chiều.
              </p>
            </div>
          ),
        },
        {
          id: 'hanh-tinh-cung-moc',
          tocLabel: 'Hành tinh, cung Mọc & nhà',
          heading: 'Hành tinh, cung Mọc, 12 nhà & góc hợp',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nếu cung nói "kiểu gì", thì <strong>hành tinh nói "cái gì"</strong> và{' '}
                <strong>nhà nói "ở lĩnh vực nào của đời sống"</strong>. Đây là ba lớp ghép lại
                thành chân dung.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Mười thiên thể: mỗi hành tinh nói về một khía cạnh
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Mặt Trời</strong> — bản ngã cốt lõi, ý chí, "tôi là ai".
                </li>
                <li>
                  <strong>Mặt Trăng</strong> — thế giới cảm xúc, nhu cầu an toàn, đời sống nội
                  tâm.
                </li>
                <li>
                  <strong>Sao Thủy</strong> — tư duy, giao tiếp; <strong>Sao Kim</strong> —
                  tình yêu, cái đẹp, giá trị; <strong>Sao Hỏa</strong> — hành động, khát khao,
                  năng lượng.
                </li>
                <li>
                  <strong>Sao Mộc</strong> — mở rộng, niềm tin, nơi bạn phát triển;{' '}
                  <strong>Sao Thổ</strong> — kỷ luật, trách nhiệm, bài học trưởng thành (là
                  "thầy nghiêm", không phải "xui").
                </li>
                <li>
                  <strong>Sao Thiên Vương, Hải Vương</strong> (và Diêm Vương) — chuyển động rất
                  chậm, mang dấu ấn cả một thế hệ; trong bài đọc cá nhân, <strong>nhà</strong>{' '}
                  và <strong>góc hợp</strong> của chúng quan trọng hơn cung.
                </li>
              </ul>
              <p>
                <strong>Bộ ba cốt lõi:</strong> đừng chỉ đọc cung Mặt Trời. Mặt Trời (bản
                chất/mục tiêu sống) – Mặt Trăng (đời sống cảm xúc) – cung Mọc (lớp vỏ, cách thế
                giới thấy bạn) mới là chân dung cốt lõi.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Cung Mọc & bốn góc — làm bản đồ thành duy nhất
              </h3>
              <p>
                <strong>Cung Mọc (Ascendant)</strong> là cung mọc ở chân trời phía Đông lúc
                sinh, quyết định cách xếp toàn bộ 12 nhà; vì đổi cung mỗi khoảng 2 giờ nên nó là
                phần nhạy giờ nhất. Cùng trục với nó:{' '}
                <strong>Thiên đỉnh (MC)</strong> = sự nghiệp, danh tiếng;{' '}
                <strong>Thiên để (IC)</strong> = gốc rễ, gia đình;{' '}
                <strong>Điểm Lặn (DSC)</strong> = đối tác, hôn nhân. Trục ASC–DSC là "tôi ↔
                người kia"; trục MC–IC là "sự nghiệp/công khai ↔ gia đình/riêng tư".
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Mười hai nhà (lĩnh vực đời sống)
              </h3>
              <p>
                Mỗi nhà phủ một lĩnh vực: nhà 1 (bản thân) · 2 (tiền tự làm ra) · 3 (giao
                tiếp, học gần) · 4 (gia đình, gốc rễ) · 5 (sáng tạo, tình yêu, con cái) · 6
                (công việc hằng ngày, sức khỏe) · 7 (hôn nhân, đối tác) · 8 (chuyển hoá sâu, tài
                sản chung) · 9 (triết lý, học cao, nước ngoài) · 10 (sự nghiệp, danh tiếng) · 11
                (bạn bè, cộng đồng) · 12 (tiềm thức, tâm linh, buông bỏ). Luận giải kết hợp:
                "Hành tinh X (cái gì) — ở cung Y (kiểu gì) — trong nhà Z (lĩnh vực nào)".
              </p>
              <p className="text-sm">
                Có nhiều hệ chia nhà (Placidus, Koch, Equal, Whole-Sign…). hieu.asia dùng{' '}
                <strong>Whole-Sign</strong> (cổ nhất, mỗi nhà = một cung trọn); có hệ khác có
                thể cho ranh giới nhà hơi khác.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Góc hợp — đối thoại giữa các hành tinh
              </h3>
              <p>
                Góc hợp là khoảng cách góc giữa hai thiên thể, cho biết hai phần trong bạn "nói
                chuyện" hài hoà hay căng. Năm góc thường dùng: <strong>trùng tụ (0°)</strong> —
                trộn và khuếch đại; <strong>lục hợp (60°)</strong> — cơ hội cần chủ động kích
                hoạt; <strong>vuông góc (90°)</strong> — căng, cho động lực trưởng thành;{' '}
                <strong>tam hợp (120°)</strong> — tài năng tự nhiên, dễ ỷ lại;{' '}
                <strong>đối đỉnh (180°)</strong> — hai cực kéo nhau, cần cân bằng.
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Góc "căng" không xấu, góc "hài hoà" không đảm bảo tốt — bài đọc tránh dán nhãn
                tốt/xấu cứng. (Lưu ý nguồn: Ptolemy nguyên gốc chỉ xếp 4 góc là "aspect"; trùng
                tụ được chiêm tinh hiện đại tính thêm như góc 0°.)
              </p>
            </div>
          ),
        },
        {
          id: 'ung-dung-luu-y',
          tocLabel: 'Ứng dụng & lưu ý',
          heading: 'Cách đọc đúng & những lưu ý quan trọng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Cá nhân hoá để tránh "bẫy Barnum"
              </h3>
              <p>
                Mô tả cung Mặt Trời là chung cho cả tháng sinh nên dễ rơi vào kiểu "ai đọc cũng
                thấy đúng". Đọc có cơ sở phải dẫn theo dữ kiện bản đồ <strong>thật</strong>: cung
                Mặt Trời + Mặt Trăng + cung Mọc + hành tinh ở nhà nào + góc hợp gì. Có thể nhìn
                thêm <strong>bức tranh tổng</strong>: đếm xem các thiên thể nghiêng về nguyên tố
                nào, tính chất nào (trội Lửa → đam mê hành động; thiếu Đất → cần "tiếp đất"…) —
                nhưng đếm chỉ là gợi ý thô vì trọng số mỗi thiên thể không bằng nhau.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Độ hợp giữa hai người
              </h3>
              <p>
                Có thể luận độ hợp ở mức cung Mặt Trời theo khung nguyên tố: cùng nguyên tố
                (góc tam hợp) chung nhịp sống; bổ trợ (Lửa↔Khí, Đất↔Nước) khác mà hợp; cung đối
                (180°) hút mạnh vì mỗi người có thứ kia thiếu, vừa cuốn vừa thử thách.{' '}
                <strong>Không có hai cung "khắc" nhau theo kiểu định mệnh</strong> — khác biệt
                cần thấu hiểu, không phải "không thể yêu". Độ hợp thật cần cả bản đồ sao, không
                chỉ cung Mặt Trời.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Tôn trọng giới hạn dữ kiện
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Nhạy giờ:</strong> cung Mọc và 12 nhà cần giờ sinh chính xác; thiếu
                  giờ thì cung Mọc/nhà có thể lệch.
                </li>
                <li>
                  <strong>Sát ranh giới (nearCusp):</strong> sinh sát đầu/cuối một cung → có nét
                  của cả hai cung, không chốt cứng.
                </li>
                <li>
                  <strong>Trường phái khác nhau:</strong> chủ quản cổ điển vs hiện đại, hệ chia
                  nhà, điểm nút trung bình vs điểm nút thật — nêu cả hai, không khẳng định một
                  chiều.
                </li>
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Tinh thần chung: chiêm tinh phương Tây là <strong>xu hướng để hiểu mình</strong>,
                không phán "giàu/nghèo/số khổ/định mệnh", không bán "đổi mệnh/giải hạn".
              </p>
            </div>
          ),
        },
        {
          id: 'muoi-hai-cung',
          tocLabel: '12 cung hoàng đạo',
          heading: '12 cung hoàng đạo',
          children: (
            <>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Mỗi cung mở ra trang riêng đầy đủ: tính cách theo nguyên tố và tính chất, điểm
                mạnh, điều nên lưu ý, cung hợp và xu hướng tình yêu – công việc. Tất cả là tham
                khảo để hiểu mình, không phán định số mệnh.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {listCung().map((s) => (
                  <Link
                    key={s.slug}
                    href={`/cung-hoang-dao/${s.slug}`}
                    className="group rounded-lg border border-border bg-card/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-card/60"
                  >
                    <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                      {s.quality}
                    </p>
                    <p className="mt-1.5 font-heading text-base font-semibold text-foreground group-hover:text-gold">
                      {s.symbol} {s.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {s.dateLabel} · {s.element}
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
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <ChiemTinhWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <ChiemTinhRecall />,
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
          children: <ChiemTinhChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

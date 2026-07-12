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
import { article, breadcrumb, course, faqPage, itemList } from '@/lib/seo/jsonld';
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
  {
    q: 'Điểm nút Bắc và Nam của Mặt Trăng là gì?',
    a: 'Đó là hai điểm giao giữa quỹ đạo Mặt Trăng và vòng hoàng đạo (không phải thiên thể thật), luôn đối diện nhau. Nút Bắc thường được đọc như hướng phát triển — nơi bạn được mời gọi vươn tới; nút Nam là vùng quen thuộc đã giỏi sẵn, dễ tựa vào nhưng ở mãi thì khó lớn thêm. Một số trường phái gắn trục này với "nghiệp quả" hay tiền kiếp, số khác chỉ đọc nó như khung phát triển bản thân — có trường phái cho rằng thế này, có trường phái cho rằng thế kia. Công cụ dùng điểm nút trung bình (mean); giá trị mean và true có thể lệch tới khoảng 1,5°.',
  },
  {
    q: 'Sao Thủy nghịch hành (Mercury retrograde) có thật sự khiến mọi thứ hỏng không?',
    a: 'Sao lùi (retrograde) chỉ là chuyển động lùi biểu kiến — nhìn từ Trái Đất, một hành tinh trông như đi lùi trên nền sao do chênh lệch tốc độ giữa các quỹ đạo. Đây là hiện tượng thiên văn bình thường, lặp lại đều đặn, không phải điềm gở tự động. Có trường phái coi đó là lúc nên rà soát, làm chậm lại; nhưng gán mọi trục trặc trong đời cho "Thủy nghịch" là cách hiểu bị thổi phồng. Lưu ý phạm vi: công cụ lập bản đồ sao ở đây tập trung bản đồ lúc sinh (có ghi hành tinh lúc sinh có nghịch hành hay không), chưa tính transit theo ngày hiện tại.',
  },
];

// Bảng tra chủ quản 12 cung — CHÉP từ tri thức nguồn (chiem-tinh-tay §1.3): chủ
// quản cổ điển vs hiện đại + tên tiếng Anh. Nguyên tố, tính chất, ký hiệu, khoảng
// ngày lấy từ engine qua listCung() để luôn khớp một nguồn duy nhất.
const SIGN_RULERS: Record<string, { english: string; classic: string; modern?: string }> = {
  'bach-duong': { english: 'Aries', classic: 'Sao Hỏa' },
  'kim-nguu': { english: 'Taurus', classic: 'Sao Kim' },
  'song-tu': { english: 'Gemini', classic: 'Sao Thủy' },
  'cu-giai': { english: 'Cancer', classic: 'Mặt Trăng' },
  'su-tu': { english: 'Leo', classic: 'Mặt Trời' },
  'xu-nu': { english: 'Virgo', classic: 'Sao Thủy' },
  'thien-binh': { english: 'Libra', classic: 'Sao Kim' },
  'bo-cap': { english: 'Scorpio', classic: 'Sao Hỏa', modern: 'Sao Diêm Vương' },
  'nhan-ma': { english: 'Sagittarius', classic: 'Sao Mộc' },
  'ma-ket': { english: 'Capricorn', classic: 'Sao Thổ' },
  'bao-binh': { english: 'Aquarius', classic: 'Sao Thổ', modern: 'Sao Thiên Vương' },
  'song-ngu': { english: 'Pisces', classic: 'Sao Mộc', modern: 'Sao Hải Vương' },
};

// Sổ tay thuật ngữ — mỗi mục 1-2 câu, grounded từ chính bài + tri thức nguồn.
const GLOSSARY: { term: string; def: string }[] = [
  {
    term: 'Bản đồ sao (natal chart)',
    def: 'Ảnh chụp bầu trời tại giờ và nơi bạn sinh — nền của mọi luận giải chiêm tinh phương Tây.',
  },
  {
    term: 'Hoàng đạo nhiệt đới (tropical)',
    def: 'Cách đặt vòng hoàng đạo lấy 0° Bạch Dương = điểm xuân phân, bám theo mùa. Là hệ hieu.asia dùng, phổ biến nhất ở phương Tây.',
  },
  {
    term: 'Hoàng đạo sao trời (sidereal)',
    def: 'Cách đặt vòng hoàng đạo bám chòm sao thật, dùng trong chiêm tinh Vệ Đà. Lệch hệ nhiệt đới khoảng 24° do tuế sai.',
  },
  {
    term: 'Cung Mọc (Ascendant / ASC)',
    def: 'Cung mọc ở chân trời phía Đông lúc sinh; quyết định cách xếp 12 nhà. Phụ thuộc giờ và nơi sinh nên nhạy giờ nhất.',
  },
  {
    term: 'Thiên đỉnh (Midheaven / MC)',
    def: 'Điểm cao nhất của hoàng đạo lúc sinh — gắn với sự nghiệp, danh tiếng, hình ảnh xã hội.',
  },
  {
    term: 'Thiên để (Imum Coeli / IC)',
    def: 'Điểm đối diện MC — gắn với gốc rễ, gia đình, đời sống riêng tư, nền tảng nội tâm.',
  },
  {
    term: 'Điểm Lặn (Descendant / DSC)',
    def: 'Điểm đối diện cung Mọc — gắn với đối tác, hôn nhân, kiểu người mình bị thu hút.',
  },
  {
    term: 'Nhà (house)',
    def: 'Mười hai lĩnh vực đời sống. hieu.asia dùng hệ Whole-Sign: mỗi nhà phủ trọn một cung, nhà 1 gắn cung Mọc.',
  },
  {
    term: 'Góc hợp (aspect)',
    def: 'Khoảng cách góc giữa hai thiên thể, cho biết hai phần trong bạn "nói chuyện" hài hoà hay căng. Năm góc lớn: 0°, 60°, 90°, 120°, 180°.',
  },
  {
    term: 'Orb',
    def: 'Sai số cho phép quanh một góc hợp. Công cụ cho orb khoảng 8° khi có Mặt Trời/Mặt Trăng, khoảng 6° cho cặp còn lại. Orb nhỏ = góc khít, ảnh hưởng rõ.',
  },
  {
    term: 'Nguyên tố (element)',
    def: 'Chất liệu cốt lõi của cung: Lửa, Đất, Khí, Nước — mỗi nguyên tố 3 cung.',
  },
  {
    term: 'Tính chất (modality)',
    def: 'Cách năng lượng vận hành: Tiên phong, Kiên định, Linh hoạt — mỗi tính chất 4 cung.',
  },
  {
    term: 'Điểm nút Mặt Trăng (node)',
    def: 'Hai điểm giao của quỹ đạo Mặt Trăng với hoàng đạo. Nút Bắc = hướng phát triển, nút Nam = vùng quen thuộc. Công cụ dùng giá trị trung bình (mean).',
  },
  {
    term: 'Sát ranh giới (nearCusp)',
    def: 'Cờ báo ca sinh sát đầu hoặc cuối một cung. Khi đó có thể mang nét của cả hai cung; đừng chốt cứng theo bảng ngày.',
  },
  {
    term: 'Transit (vận hành)',
    def: 'Vị trí thật của các hành tinh hôm nay chạm vào bản đồ gốc. Công cụ ở đây tập trung bản đồ natal, chưa tính transit theo ngày.',
  },
  {
    term: 'Sao lùi (retrograde)',
    def: 'Hiện tượng một hành tinh trông như chuyển động lùi biểu kiến khi nhìn từ Trái Đất — bình thường, không phải điềm gở tự động.',
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
  course({
    name: 'Chiêm tinh phương Tây — bản đồ sao & 12 cung',
    description:
      'Chiêm tinh phương Tây dựng bản đồ sao từ giờ + nơi sinh: 12 cung hoàng đạo, hành tinh, cung Mọc, 12 nhà, góc hợp — xu hướng để hiểu mình, không phán số mệnh.',
    url: '/learn/chiem-tinh',
  }),
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
      readMeta="13 phút đọc · Cập nhật 2026"
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
          id: 'lich-su',
          tocLabel: 'Lịch sử ngắn',
          heading: 'Từ đâu ra: một lát lịch sử ngắn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Truyền thống thường kể rằng việc quan sát bầu trời để đoán định khởi nguồn từ
                vùng Lưỡng Hà (Babylon) cổ đại, rồi được người Hy Lạp tiếp nhận và hệ thống hoá.
                Đây là dòng kể phổ biến; mốc thời gian chính xác vẫn là chuyện của giới sử học,
                bài này không chốt cứng niên đại.
              </p>
              <p>
                Cái khung mà chiêm tinh phương Tây dùng đến hôm nay phần lớn được định hình trong{' '}
                <em>Tetrabiblos</em> của Ptolemy (khoảng thế kỷ 2) — nơi các{' '}
                <strong>góc hợp</strong>, <strong>bốn nguyên tố</strong> và{' '}
                <strong>ba tính chất</strong> được sắp thành hệ. Vài văn bản cổ khác thường được
                nhắc như nền của truyền thống: <em>Anthology</em> của Vettius Valens,{' '}
                <em>Mathesis</em> của Firmicus Maternus, và về sau <em>Christian Astrology</em>{' '}
                của William Lilly. Đây là các bản gốc đã hết bản quyền; bài này chỉ mượn khung
                ý, không trích nguyên văn.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Hai cách đặt vòng hoàng đạo: nhiệt đới và sao trời
              </h3>
              <p>
                Có hai cách gắn mốc 0° của vòng hoàng đạo.{' '}
                <strong>Hoàng đạo nhiệt đới</strong> (tropical) lấy 0° Bạch Dương = điểm xuân
                phân, tức bám theo các mùa chứ không bám chòm sao thật trên trời; đây là hệ phổ
                biến nhất ở phương Tây và là hệ hieu.asia dùng.{' '}
                <strong>Hoàng đạo sao trời</strong> (sidereal) bám vị trí chòm sao thật và được
                dùng trong chiêm tinh Vệ Đà (Jyotish); do hiện tượng tuế sai, hai hệ lệch nhau
                khoảng 24°. Vì thế cùng một ngày sinh, hai hệ có thể cho ra cung khác nhau — nếu
                bạn từng đọc nơi khác ra cung lệch, phần lớn là do nhầm hai hệ này, không phải
                một bên sai.
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
          id: 'bang-12-cung',
          tocLabel: 'Bảng tra 12 cung',
          heading: 'Bảng tra nhanh 12 cung',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mỗi cung là một tổ hợp <strong>nguyên tố × tính chất</strong> duy nhất, kèm hành
                tinh chủ quản. Bảng dưới gom lại để tra nhanh; mỗi hàng còn mở được trang riêng
                ở mục "12 cung hoàng đạo" bên dưới.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-3 font-semibold">Cung</th>
                      <th className="py-2 pr-3 font-semibold">English</th>
                      <th className="py-2 pr-3 font-semibold">Nguyên tố</th>
                      <th className="py-2 pr-3 font-semibold">Tính chất</th>
                      <th className="py-2 pr-3 font-semibold">Chủ quản cổ điển</th>
                      <th className="py-2 pr-3 font-semibold">Chủ quản hiện đại</th>
                      <th className="py-2 font-semibold">Khoảng ngày</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {listCung().map((s) => {
                      const r = SIGN_RULERS[s.slug];
                      return (
                        <tr key={s.slug} className="border-b border-border/60">
                          <td className="whitespace-nowrap py-2 pr-3 font-medium text-foreground">
                            {s.symbol} {s.name}
                          </td>
                          <td className="py-2 pr-3">{r?.english}</td>
                          <td className="py-2 pr-3">{s.element}</td>
                          <td className="py-2 pr-3">{s.quality}</td>
                          <td className="whitespace-nowrap py-2 pr-3">{r?.classic}</td>
                          <td className="whitespace-nowrap py-2 pr-3">{r?.modern ?? '—'}</td>
                          <td className="whitespace-nowrap py-2">{s.dateLabel}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                ⚠️ <strong>Ranh giới ngày lệch ±1 ngày tuỳ năm</strong> vì điểm xuân phân không
                rơi đúng cùng giờ mỗi năm — khoảng ngày ở bảng là quy ước. Nếu bạn sinh sát đầu
                hoặc cuối một khoảng, công cụ lập bản đồ sao xác định cung theo vị trí Mặt Trời
                thật và gắn cờ "sát ranh giới" (nearCusp): khi đó bạn có thể mang nét của cả hai
                cung, đừng chốt cứng theo bảng. Cột <strong>chủ quản hiện đại</strong> chỉ điền
                khi khác cổ điển: <strong>có trường phái dùng chủ quản cổ điển, có trường phái
                thêm chủ quản hiện đại</strong> (ba hành tinh xa được phát hiện sau) — bài đọc
                nêu cả hai, không khẳng định một chiều.
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
              <p>
                Góc không cần khít tuyệt đối mới "tính": mỗi góc có một khoảng sai số cho phép
                gọi là <strong>orb</strong>. Công cụ ở đây cho orb khoảng <strong>8°</strong> khi
                có Mặt Trời hoặc Mặt Trăng tham gia (hai vầng sáng ảnh hưởng mạnh hơn) và khoảng{' '}
                <strong>6°</strong> cho các cặp còn lại. Orb càng nhỏ thì góc càng khít và ảnh
                hưởng càng rõ; mỗi cặp hành tinh chỉ giữ một góc khít nhất.
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Góc "căng" không xấu, góc "hài hoà" không đảm bảo tốt — bài đọc tránh dán nhãn
                tốt/xấu cứng. (Một câu về nguồn: trong <em>Tetrabiblos</em>, Ptolemy chỉ xếp bốn
                góc 60°/90°/120°/180° là "aspect"; trùng tụ 0° được chiêm tinh hiện đại tính
                thêm như góc 0°, còn hệ cổ điển coi nó là "đứng cùng chỗ" chứ không phải một góc
                nhìn. Công cụ chỉ tính năm góc lớn này, không tính các góc nhỏ như quincunx 150°.)
              </p>
            </div>
          ),
        },
        {
          id: 'diem-nut',
          tocLabel: 'Điểm nút Mặt Trăng',
          heading: 'Điểm nút Mặt Trăng: nút Bắc và nút Nam',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ngoài các hành tinh, bản đồ còn ghi hai <strong>điểm nút Mặt Trăng</strong> —
                đây không phải thiên thể có thật, mà là hai điểm giao giữa quỹ đạo Mặt Trăng và
                vòng hoàng đạo. Chúng luôn nằm đối diện nhau qua tâm.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Nút Bắc (North Node ☊)</strong> — thường được đọc như{' '}
                  <strong>hướng phát triển</strong>: phẩm chất và lĩnh vực bạn được mời gọi vươn
                  tới, ban đầu hơi lạ lẫm nhưng là nơi trưởng thành.
                </li>
                <li>
                  <strong>Nút Nam (South Node ☋)</strong> — nằm đối diện nút Bắc, được đọc như{' '}
                  <strong>vùng quen thuộc</strong>: thứ bạn đã giỏi sẵn, dễ tựa vào, nhưng nếu
                  chỉ ở mãi đây thì khó lớn thêm.
                </li>
              </ul>
              <p>
                Vì thế trục nút Bắc – nút Nam hay được nhắc trong lối chiêm tinh nói về{' '}
                <strong>bài học và hướng trưởng thành</strong> của một đời. Một số trường phái
                gắn nó với ý niệm "nghiệp quả" hay tiền kiếp: <strong>có trường phái cho rằng</strong>{' '}
                đây là dấu vết của những kiếp trước, có trường phái chỉ đọc nó thuần tuý như
                khung phát triển bản thân. Bài đọc ở đây nghiêng về cách thứ hai và nói rõ "theo
                lối luận của chiêm tinh hiện đại", không khẳng định tiền kiếp như một sự thật.
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                ⚠️ <strong>Điểm nút "trung bình" và điểm nút "thật".</strong> Có hai cách tính:
                điểm nút trung bình (mean, mượt) và điểm nút thật (true, dao động). Công cụ ở đây
                dùng loại <strong>trung bình</strong>, nên bài đọc cũng nói theo loại này. Hai
                giá trị có thể lệch tới khoảng 1,5°; thường không đổi cung, nhưng với ca sát ranh
                giới hai cung thì có thể khác. Khác với Mặt Trời, Mặt Trăng, các hành tinh và
                cung Mọc, độ chính xác của điểm nút trung bình không nằm trong dải kiểm chứng
                chặt đó.
              </p>
            </div>
          ),
        },
        {
          id: 'lop-thoi-gian',
          tocLabel: 'Lớp thời gian',
          heading: 'Lớp thời gian: transit, tiến trình, sao lùi',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bản đồ sao gốc (natal chart) là ảnh chụp bầu trời lúc bạn sinh và không đổi.
                Nhưng chiêm tinh còn có những lớp <strong>chuyển động theo thời gian</strong> đặt
                lên bản đồ gốc đó. Ba khái niệm kinh điển:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Transit (vận hành)</strong> — vị trí thật của các hành tinh{' '}
                  <em>hôm nay</em> so với bản đồ gốc: khi một hành tinh trên trời đi tới chạm góc
                  với một điểm trong bản đồ sinh của bạn, đó là một transit. Đây là lớp hay được
                  dùng để nói về "giai đoạn" đang diễn ra.
                </li>
                <li>
                  <strong>Tiến trình (progression)</strong> — một phép tính tượng trưng cho sự
                  trưởng thành nội tâm theo năm tháng, khác transit ở chỗ nó "dời" bản đồ gốc
                  theo một quy ước thời gian chứ không đọc trời thật.
                </li>
                <li>
                  <strong>Sao lùi (retrograde)</strong> — hiện tượng một hành tinh, nhìn từ Trái
                  Đất, trông như đang <strong>chuyển động lùi biểu kiến</strong> trên nền sao. Đó
                  là ảo giác do chênh lệch tốc độ giữa các quỹ đạo, một hiện tượng thiên văn bình
                  thường.
                </li>
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                ⚠️ <strong>Phạm vi công cụ, nói thẳng.</strong> Công cụ lập bản đồ sao ở đây tập
                trung vào <strong>bản đồ natal</strong> (lúc sinh): nó có ghi một hành tinh{' '}
                <em>lúc bạn sinh</em> đang nghịch hành hay không, nhưng{' '}
                <strong>chưa tính transit hay tiến trình theo ngày hiện tại</strong>. Nên đừng
                chờ ở đây phần "hôm nay sao chiếu mệnh bạn ra sao".
              </p>
              <p>
                Nhân nói tới sao lùi: có một ngộ nhận phổ biến rằng "Thủy tinh nghịch hành thì
                mọi thứ đều hỏng". Retrograde chỉ là chuyển động lùi biểu kiến, một hiện tượng
                lặp lại đều đặn, không phải một điềm gở tự động.{' '}
                <strong>Có trường phái cho rằng</strong> đó là lúc nên rà soát, xem lại, làm chậm
                hơn; nhưng gán mọi trục trặc trong đời cho nó là cách hiểu bị thổi phồng. Ở đây,
                tinh thần vẫn là xu hướng để hiểu mình, không phải lời hù dọa.
              </p>
            </div>
          ),
        },
        {
          id: 'can-bang-ban-do',
          tocLabel: 'Trội & thiếu nguyên tố',
          heading: 'Cân bằng nguyên tố của cả bản đồ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ngoài đọc từng phần, có thể lùi lại nhìn tổng: trong mười thiên thể (cộng cung
                Mọc), bản đồ của bạn nghiêng về <strong>nguyên tố</strong> nào và{' '}
                <strong>tính chất</strong> nào. Công cụ có đếm sẵn phần này và chỉ ra nguyên tố
                trội, tính chất trội. Cách đọc gợi ý:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Trội Lửa</strong> → sống bằng đam mê, hành động;{' '}
                  <strong>thiếu Lửa</strong> → cần học chủ động, tự nhóm lửa cho mình.
                </li>
                <li>
                  <strong>Trội Đất</strong> → thực tế, vững vàng; <strong>thiếu Đất</strong> → dễ
                  bay bổng, cần "tiếp đất", biến ý thành việc.
                </li>
                <li>
                  <strong>Trội Khí</strong> → tư duy, giao tiếp; <strong>thiếu Khí</strong> → cần
                  học diễn đạt, lùi lại nhìn khách quan.
                </li>
                <li>
                  <strong>Trội Nước</strong> → cảm xúc, trực giác; <strong>thiếu Nước</strong> →
                  cần học lắng nghe cảm xúc của mình và người.
                </li>
                <li>
                  Về tính chất: trội <strong>Tiên phong</strong> → giỏi khởi sự; trội{' '}
                  <strong>Kiên định</strong> → giỏi duy trì; trội <strong>Linh hoạt</strong> →
                  giỏi thích nghi. Thiếu loại nào là gợi ý vùng cần rèn.
                </li>
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Đây là cách cá nhân hoá <strong>có cơ sở</strong> vì nó đếm từ vị trí thật, chống
                kiểu mô tả chung ai đọc cũng thấy đúng. Nhưng "đếm" chỉ là gợi ý thô: trọng số
                của mỗi thiên thể không bằng nhau (Mặt Trời, Mặt Trăng, cung Mọc nặng hơn hành
                tinh ở xa), nên đừng chốt tính cách chỉ bằng con số đếm.
              </p>
            </div>
          ),
        },
        {
          id: 'synastry',
          tocLabel: 'Độ hợp 2 người',
          heading: 'Độ hợp hai người: 5 nhóm nhìn nhanh',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ở mức cung Mặt Trời, có thể phân quan hệ giữa hai người thành{' '}
                <strong>năm nhóm theo nguyên tố</strong> — suy theo luật, không phải chế từng
                cặp. Lấy nguyên tố và vị trí cung người kia so với cung bạn:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-3 font-semibold">Nhóm</th>
                      <th className="py-2 pr-3 font-semibold">Khi nào</th>
                      <th className="py-2 font-semibold">Ý nghĩa</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-border/60">
                      <td className="whitespace-nowrap py-2 pr-3 font-medium text-foreground">
                        Cùng cung
                      </td>
                      <td className="py-2 pr-3">Hai người cùng một cung</td>
                      <td className="py-2">
                        Chung khí chất, hiểu ý nhanh; nhưng cùng điểm mạnh thì cũng cùng điểm yếu,
                        dễ khuếch đại.
                      </td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="whitespace-nowrap py-2 pr-3 font-medium text-foreground">
                        Cùng nguyên tố
                      </td>
                      <td className="py-2 pr-3">Cùng Lửa/Đất/Khí/Nước (góc tam hợp)</td>
                      <td className="py-2">
                        Chung nhịp sống và giá trị, hoà hợp tự nhiên; lưu ý quá giống dễ thiếu
                        kích thích.
                      </td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="whitespace-nowrap py-2 pr-3 font-medium text-foreground">
                        Bổ trợ
                      </td>
                      <td className="py-2 pr-3">Lửa ↔ Khí, hoặc Đất ↔ Nước (trừ cung đối)</td>
                      <td className="py-2">
                        Khác mà hợp: một bên năng lượng/ý tưởng, một bên chiều sâu/ổn định — dễ
                        chịu, bù cho nhau.
                      </td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="whitespace-nowrap py-2 pr-3 font-medium text-foreground">
                        Cung đối
                      </td>
                      <td className="py-2 pr-3">Cách nhau 180° trên vòng</td>
                      <td className="py-2">
                        Hút mạnh vì mỗi người có đúng thứ kia thiếu; vừa cuốn vừa thử thách, học
                        được nhiều nếu tôn trọng khác biệt.
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3 font-medium text-foreground">
                        Khác biệt
                      </td>
                      <td className="py-2 pr-3">Không rơi vào các nhóm trên</td>
                      <td className="py-2">
                        Nhịp khác nhau, cần lắng nghe và nhường; khác biệt không có nghĩa là không
                        hợp.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Nền của nhóm "bổ trợ": Lửa và Khí cùng cực dương/chủ động (Khí nuôi Lửa), Đất và
                Nước cùng cực âm/tiếp nhận (Nước nuôi Đất) — hai cặp này nâng đỡ nhau. Một lưu ý
                hình học: cung đối <em>luôn</em> cùng nguyên tố bổ trợ, nên công cụ cố ý{' '}
                <strong>loại cung đối ra khỏi nhóm "bổ trợ"</strong> để "bổ trợ" (góc 60°) và
                "cung đối" (góc 180°) không lẫn vào nhau.
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                ⚠️ <strong>Không có hai cung "khắc" nhau theo kiểu định mệnh.</strong> Khác biệt
                là cần thấu hiểu, không phải "không thể yêu". Và hợp cung Mặt Trời chỉ là{' '}
                <strong>một lát cắt thô</strong>: độ hợp thật của hai người cần cả bản đồ đầy đủ
                (Mặt Trăng, Sao Kim, Sao Hỏa, cung Mọc…) mới đủ chuyện.
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
                Mặt Trời + Mặt Trăng + cung Mọc + hành tinh ở nhà nào + góc hợp gì, và có thể
                nhìn thêm cân bằng nguyên tố của cả bản đồ (xem mục trên). Càng nhiều dữ kiện
                riêng, mô tả càng khó "đúng với tất cả mọi người".
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
                <li>
                  <strong>Chỉ luận thứ công cụ thật sự tính:</strong> mười thiên thể (tới Sao
                  Diêm Vương), cung Mọc/MC/IC/DSC, 12 nhà, năm góc lớn, điểm nút trung bình, cờ
                  nghịch hành lúc sinh. Không thêm những thứ công cụ chưa tính (Chiron, tiểu hành
                  tinh, góc nhỏ, hay transit theo ngày).
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
          id: 'so-tay-thuat-ngu',
          tocLabel: 'Sổ tay thuật ngữ',
          heading: 'Sổ tay thuật ngữ: tra nhanh khi đọc bản đồ sao',
          children: (
            <>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Gặp một từ lạ khi đọc bản đồ sao, tra nhanh ở đây. Mỗi mục gói trong một hai câu;
                chi tiết nằm ở các mục tương ứng phía trên.
              </p>
              <dl className="grid gap-3 sm:grid-cols-2">
                {GLOSSARY.map((g) => (
                  <div key={g.term} className="rounded-lg border border-border bg-card/40 p-3.5">
                    <dt className="text-sm font-medium text-foreground">{g.term}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {g.def}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ),
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

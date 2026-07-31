/**
 * Bài học /learn/lap-la-so — QUY TRÌNH LẬP một lá số Tử Vi.
 *
 * GROUNDING — mọi dữ kiện trên trang này lấy từ công cụ /la-so-tu-vi và các
 * file nó dùng; bảng nào import được thì IMPORT, không gõ tay:
 *   • components/la-so-tu-vi/LaSoChecker.tsx — form hỏi ĐÚNG BA ô (ngày sinh
 *     dương, giờ, giới tính), KHÔNG hỏi nơi sinh; `parseHour()` chỉ lấy phần
 *     GIỜ 0–23 (bỏ phút), mặc định 12; ghi chú "một số sao theo giờ có thể
 *     lệch"; nhãn "vô chính diệu"; sao in kèm độ sáng trong ngoặc.
 *   • lib/tuvi-client.ts — `CastChartInput` = { birthSolarDate, birthHour,
 *     gender }; `cacheKey()` ghép đúng bộ khoá đó ⇒ cùng đầu vào luôn ra cùng
 *     lá số; `TuViPalace` có heavenlyStem + earthlyBranch + isBodyPalace (Thân
 *     là CỜ trên một cung, không phải cung 13); `TuViStar.brightness` TUỲ CHỌN.
 *   • app/tinh-menh-cuc/form.tsx §"Cách tính Mệnh — Thân — Cục" + FAQ: an Mệnh
 *     theo tháng âm + giờ trên vòng 12 chi; Thân đếm NGƯỢC chiều, luôn rơi vào
 *     một trong sáu cung; Cục = can năm + vị trí Mệnh, tra nạp âm, số Cục 2–6
 *     là tuổi khởi đại vận; âm dương năm sinh + giới tính → CHIỀU đại vận.
 *   • lib/palace-readings.ts (PALACE_READINGS — vòng 12 cung đúng thứ tự; khớp
 *     mảng CUNG của app/la-so-tu-vi/page.tsx và khớp tam phương tứ chính của
 *     Mệnh do `tamPhuongTuChinh` trong lib/tuvi-client.ts trả về).
 *   • lib/gio-hoang-dao.ts (BRANCHES, HOUR_RANGE, `currentHourIndex`),
 *     lib/ngay-kieng-ky.ts (solarToLunar), lib/xem-tuoi-cuoi.ts (canChiOfYear).
 *
 * PHÂN VAI: bài này CHỈ dạy quy trình LẬP. Ý nghĩa 12 cung / tam phương tứ
 * chính / 14 chính tinh nói gì / Tứ Hóa luận ra sao → /learn/tu-vi; Mệnh & Cục
 * → /tinh-menh-cuc. KHÔNG viết: tổng số sao (các nguồn trong repo ghi khác
 * nhau), hiệu chỉnh giờ theo kinh độ (công cụ không hỏi nơi sinh), bảng đếm
 * chi tiết để an cung Mệnh (chạy trong engine, repo không công bố).
 *
 * Giọng: an cung – an sao là tính toán xác định, kiểm chứng được; phần luận là
 * tham khảo. Không phán số mệnh, không hù doạ.
 */

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import { PALACE_READINGS } from '@/lib/palace-readings';
import { BRANCHES, HOUR_RANGE, type Branch } from '@/lib/gio-hoang-dao';
import { solarToLunar } from '@/lib/ngay-kieng-ky';
import { canChiOfYear } from '@/lib/xem-tuoi-cuoi';
import {
  LapLaSoFrame,
  LapLaSoDepth,
  LapLaSoRecall,
  LapLaSoChecklist,
  LapLaSoWhys,
} from './_active-learning';

export const metadata: Metadata = {
  // Nguồn ≤47 ký tự (layout tự nối " · hieu.asia" = 12 → hiển thị ≤60).
  title: 'Lập lá số Tử Vi — quy trình 6 bước',
  // ≤160 ký tự (seo-guard vault 172).
  description:
    'Lập lá số Tử Vi từng bước: đổi ngày sinh sang âm lịch, quy giờ về canh giờ, an 12 cung, định Mệnh – Thân, an chính tinh và đọc độ sáng miếu – hãm.',
  alternates: { canonical: 'https://hieu.asia/learn/lap-la-so' },
};

// Vòng 12 cung ĐÚNG THỨ TỰ trên lá số — import thay vì gõ lại. Thứ tự này khớp
// mảng CUNG của trang công cụ /la-so-tu-vi, và tự kiểm được: các vị trí 0, 4,
// 6, 8 trong vòng chính là tam phương tứ chính của Mệnh (Mệnh · Quan Lộc ·
// Thiên Di · Tài Bạch) mà `tamPhuongTuChinh()` trong lib/tuvi-client.ts trả về.
const PALACE_RING = PALACE_READINGS.map((p) => p.name);

// Cung Thân chỉ rơi vào các vị trí CHẴN của vòng trên (xem mục "Bước 4"), tức
// đúng sáu cung mà trang /tinh-menh-cuc liệt kê. Suy từ PALACE_RING, không gõ.
const THAN_PALACES = PALACE_READINGS.filter((_, i) => i % 2 === 0).map((p) => p.name);

// Canh giờ chứa một giờ đồng hồ (0–23) — cùng phép với `currentHourIndex()` của
// lib/gio-hoang-dao.ts, chỉ khác là nhận thẳng số giờ thay vì một Date (để bài
// minh hoạ được với giờ sinh bất kỳ). Nhãn + khung giờ lấy từ BRANCHES/HOUR_RANGE.
function branchOfHour(h: number): Branch {
  return BRANCHES[Math.floor(((h + 1) % 24) / 2)]!;
}

// ── Ví dụ lập tay ────────────────────────────────────────────────────────
// Một ngày giờ sinh cụ thể. Ngày âm do `solarToLunar` tính, can chi năm do
// `canChiOfYear` tra từ chính năm âm lịch vừa ra, canh giờ do `branchOfHour`.
// KHÔNG có con số nào gõ tay ngoài chính dữ liệu đầu vào.
const EX = { day: 20, month: 7, year: 1988, hour: 9, minute: 30 } as const;
const EX_LUNAR = solarToLunar(EX.day, EX.month, EX.year);
const EX_YEAR_CANCHI = canChiOfYear(EX_LUNAR.year);
const EX_BRANCH = branchOfHour(EX.hour);
// Hai giờ đối chứng: một giờ vẫn nằm trong cùng canh giờ, một giờ đã sang canh
// giờ kế tiếp — dùng để chứng minh "sai giờ thì lệch gì".
const EX_HOUR_SAME = 10;
const EX_HOUR_NEXT = 11;

// ── Bẫy Tết ──────────────────────────────────────────────────────────────
// Hai ngày dương lịch cách nhau đúng hai hôm nhưng rơi vào HAI NĂM ÂM LỊCH
// khác nhau ⇒ hai can chi năm sinh khác nhau. Toàn bộ giá trị đều tính ra.
const TET_PAIR = [
  { day: 5, month: 2, year: 1989 },
  { day: 7, month: 2, year: 1989 },
].map((s) => {
  const lunar = solarToLunar(s.day, s.month, s.year);
  return { solar: s, lunar, canChi: canChiOfYear(lunar.year).name };
});

// Sáu bước của quy trình. `detail` là phần giải thích, `check` là điều bạn tự
// kiểm được sau bước đó.
const STEPS: { title: string; detail: ReactNode; check: string }[] = [
  {
    title: 'Gom đúng ba dữ kiện đầu vào',
    detail: (
      <>
        Ngày sinh <strong className="text-foreground">dương lịch</strong>, giờ sinh, và giới tính.
        Đó là toàn bộ những gì công cụ hỏi — không tên, không nơi sinh, không gì khác. Giới tính
        không tham gia vào việc đổi lịch hay dựng khung; theo quy tắc truyền thống mà công cụ ghi
        rõ, nó cùng âm dương của năm sinh quyết định{' '}
        <strong className="text-foreground">chiều đi của đại vận</strong>: dương nam và âm nữ đi
        thuận, âm nam và dương nữ đi nghịch.
      </>
    ),
    check: 'Bạn nói được vì sao công cụ hỏi giới tính mà không hỏi nơi sinh.',
  },
  {
    title: 'Đổi ngày dương sang ngày âm lịch',
    detail: (
      <>
        Ra ba con số: <strong className="text-foreground">ngày âm</strong>,{' '}
        <strong className="text-foreground">tháng âm</strong>,{' '}
        <strong className="text-foreground">năm âm</strong> — và từ năm âm suy ra can chi năm sinh.
        Ba con số này được dùng ở ba chỗ khác nhau ở các bước sau, nên đây là bước không được sai.
        hieu.asia đổi bằng thuật toán lịch âm Việt Nam (Hồ Ngọc Đức) tính theo múi giờ UTC+7.
      </>
    ),
    check: 'Bạn tự đổi được bằng lịch vạn niên và so khớp với kết quả công cụ.',
  },
  {
    title: 'Quy giờ đồng hồ về canh giờ',
    detail: (
      <>
        12 canh giờ, mỗi canh <strong className="text-foreground">2 tiếng</strong>, mang tên 12 địa
        chi. Giờ sinh của bạn rơi vào canh nào thì lá số dùng canh đó — phút không tham gia. Công cụ
        cũng chỉ đọc phần giờ và bỏ phần phút; điều đó không mất gì, vì mọi ranh giới canh giờ đều
        rơi đúng vào đầu một giờ lẻ.
      </>
    ),
    check: 'Bạn tra được canh giờ của mình trong bảng ở ngay trên.',
  },
  {
    title: 'Dựng địa bàn rồi định cung Mệnh, cung Thân',
    detail: (
      <>
        Địa bàn là khung <strong className="text-foreground">12 ô cố định</strong> mang tên 12 địa
        chi — giống nhau với mọi lá số. Từ tháng âm và canh giờ, đếm trên khung ấy để ra{' '}
        <strong className="text-foreground">cung Mệnh</strong> rơi vào ô nào; 11 cung còn lại xếp
        theo vòng cố định quanh nó. <strong className="text-foreground">Cung Thân</strong> cũng đếm
        từ tháng và giờ nhưng theo chiều ngược lại, nên nó luôn ghép chồng lên một trong sáu cung.
      </>
    ),
    check: 'Bạn chỉ ra được cung Mệnh của mình đóng tại địa chi nào.',
  },
  {
    title: 'Định Cục',
    detail: (
      <>
        Ghép can năm sinh với vị trí cung Mệnh rồi tra nạp âm, ra{' '}
        <strong className="text-foreground">ngũ hành Cục</strong>. Cục có hai việc: cùng với ngày
        sinh âm lịch, nó định chỗ đứng của sao Tử Vi ở bước sau; và con số của Cục chính là tuổi bắt
        đầu đại vận đầu tiên. Bài này dừng ở đó — Mệnh và Cục có công cụ riêng nói kỹ hơn.
      </>
    ),
    check: 'Bạn biết Cục của mình là gì và nó khởi đại vận từ mấy tuổi.',
  },
  {
    title: 'An chính tinh rồi gắn độ sáng, Tứ Hóa',
    detail: (
      <>
        Từ Cục và ngày sinh âm lịch, xác định chỗ đứng của sao{' '}
        <strong className="text-foreground">Tử Vi</strong>; chuỗi sao đi cùng nó và chuỗi{' '}
        <strong className="text-foreground">Thiên Phủ</strong> an đối xứng theo đó — 14 chính tinh
        vào chỗ. Sau đó mỗi sao được gắn thêm hai nhãn:{' '}
        <strong className="text-foreground">độ sáng</strong> theo vị trí, và{' '}
        <strong className="text-foreground">Tứ Hóa</strong> theo thiên can năm sinh. Phụ tinh an
        tiếp theo các quy tắc riêng.
      </>
    ),
    check: 'Bạn đọc được tên sao kèm chữ trong ngoặc và biết chữ đó là độ sáng.',
  },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) → chữ
// schema === chữ hiển thị (chống cloaking). Câu hỏi cố tình KHÁC bộ FAQ của
// trang công cụ /la-so-tu-vi (lá số là gì / cần thông tin gì / có chính xác
// không / khác bản trả phí / có phải bói toán / không nhớ giờ sinh) và KHÁC bộ
// FAQ của /learn/tu-vi (nguồn gốc / cung là gì / bao nhiêu sao / tam phương tứ
// chính / Tứ Hóa / Bắc Đẩu Nam Đẩu / Cục ảnh hưởng gì / Tuần Triệt).
const FAQS = [
  {
    q: 'Lập một lá số Tử Vi gồm những bước nào, theo đúng thứ tự?',
    a: 'Sáu bước. Một, gom ba dữ kiện: ngày sinh dương lịch, giờ sinh, giới tính. Hai, đổi ngày dương sang ngày, tháng, năm âm lịch và suy ra can chi năm sinh. Ba, quy giờ đồng hồ về canh giờ (12 canh, mỗi canh 2 tiếng). Bốn, dựng địa bàn 12 địa chi rồi định cung Mệnh và cung Thân từ tháng âm cùng canh giờ, 11 cung còn lại xếp theo vòng cố định quanh cung Mệnh. Năm, định Cục bằng can năm sinh ghép vị trí cung Mệnh. Sáu, an 14 chính tinh theo Cục và ngày sinh âm lịch, rồi gắn cho mỗi sao độ sáng theo vị trí và Tứ Hóa theo thiên can năm sinh. Thứ tự không được đảo vì mỗi bước dùng kết quả của bước trước.',
  },
  {
    q: 'Vì sao phải đổi ngày sinh sang âm lịch trước khi lập lá số?',
    a: 'Vì mọi bảng tra trong Tử Vi nói bằng đơn vị âm lịch, và ba con số của lịch âm được dùng ở ba chỗ khác nhau. Tháng âm góp phần định cung Mệnh cùng cung Thân. Ngày âm góp phần định chỗ đứng của sao Tử Vi. Năm âm cho ra can chi năm sinh, thứ quyết định Cục và bộ Tứ Hóa gốc. Vì vậy sai lịch không phải sai một chỗ mà sai dây chuyền. Đây không phải chuyện lịch nào chính xác hơn lịch nào, mà là chuyện dịch đúng đơn vị trước khi tra bảng.',
  },
  {
    q: 'Sinh gần Tết thì can chi năm sinh tính theo năm nào?',
    a: 'Theo năm âm lịch, không theo năm dương lịch trên giấy khai sinh. Người sinh trong tháng 1 hoặc đầu tháng 2 dương lịch rất có thể vẫn thuộc năm âm lịch trước, vì Tết chưa tới. Ví dụ hai người sinh cách nhau đúng hai ngày, một người ngày 5 tháng 2 năm 1989 và một người ngày 7 tháng 2 năm 1989, lại thuộc hai năm âm lịch khác nhau nên có hai can chi năm sinh khác nhau, kéo theo Cục khác và bộ Tứ Hóa gốc khác. Đây là nguyên nhân phổ biến nhất khiến hai chỗ tra ra hai lá số không giống nhau.',
  },
  {
    q: 'Sai giờ sinh bao nhiêu thì lá số mới thật sự đổi?',
    a: 'Chỉ khi sai đủ để bước sang một canh giờ khác. Giờ sinh được quy về một trong 12 canh giờ, mỗi canh dài 2 tiếng, nên hai người sinh lúc 9 giờ 30 và 10 giờ 45 có lá số hoàn toàn giống nhau, còn hai người sinh lúc 10 giờ 45 và 11 giờ 15 thì đã khác canh giờ. Phút không bao giờ đổi được kết luận, vì mọi ranh giới canh giờ đều rơi đúng vào đầu một giờ lẻ; công cụ cũng chỉ đọc phần giờ và bỏ phần phút. Khi lệch canh giờ thì cung Mệnh và cung Thân dịch chỗ, kéo theo toàn bộ nhãn 12 cung dịch theo, và một số sao an theo giờ cũng lệch.',
  },
  {
    q: 'Vì sao cung Thân chỉ rơi vào sáu cung chứ không phải cả mười hai?',
    a: 'Vì cung Mệnh và cung Thân cùng được đếm từ tháng sinh âm lịch và giờ sinh, nhưng đếm ngược chiều nhau. Mỗi lần giờ sinh nhích một canh, hai cung này dịch về hai phía đối nhau, nên khoảng cách giữa chúng luôn thay đổi theo bước chẵn và không bao giờ rơi vào vị trí lẻ. Kết quả là cung Thân chỉ có thể ghép chồng lên một trong sáu cung: Mệnh, Phúc Đức, Quan Lộc, Thiên Di, Tài Bạch, Phu Thê. Cần nói rõ cung Thân không phải cung thứ 13; trong dữ liệu lá số, nó là một dấu đánh trên một cung đã có sẵn.',
  },
  {
    q: 'Địa bàn 12 địa chi khác 12 cung ở chỗ nào?',
    a: 'Địa bàn là khung: 12 ô mang tên 12 địa chi từ Tý đến Hợi, cố định và giống hệt nhau với mọi lá số. 12 cung là nhãn đặt lên khung đó: Mệnh, Phụ Mẫu, Phúc Đức và tiếp tục theo một vòng không đổi thứ tự. Cái thay đổi theo từng người chỉ là cung Mệnh rơi vào ô địa chi nào; định xong điều đó là 11 cung còn lại tự có chỗ. Trong dữ liệu mà engine trả về, mỗi cung mang địa chi riêng và thiên can riêng, nên hai lớp này là hai thứ tách bạch chứ không phải cách nói ẩn dụ.',
  },
  {
    q: 'Miếu, vượng, đắc, hãm là do máy tính ra hay do thầy chấm?',
    a: 'Do tính ra. Độ sáng là một thuộc tính gắn liền với cặp sao và vị trí: cùng một sao đặt ở ô địa chi khác nhau sẽ có bậc sáng khác nhau theo bảng cố định, nên nó xuất hiện ngay khi an sao xong, cùng lúc với tên sao. Miếu là bậc sáng nhất, sao phát huy đầy đủ; vượng là rất mạnh; đắc là khá, hoạt động ổn; hãm là bậc tối nhất, sao yếu. Thang đầy đủ còn vài bậc trung gian nữa. Cần nhớ độ sáng mô tả cường độ biểu hiện chứ không phải điểm tốt xấu, và không phải sao nào cũng có độ sáng — nhiều phụ tinh không mang thuộc tính này.',
  },
  {
    q: 'Hai người sinh cùng ngày cùng giờ có lá số giống nhau không?',
    a: 'Giống hệt nhau, từng ô. Việc lập lá số chỉ nhận đúng ba dữ kiện là ngày sinh dương lịch, giờ sinh và giới tính, nên nó chỉ phân biệt được người ta tới mức đó; hai người cùng ba dữ kiện ấy sẽ nhận về hai tấm lá số không khác nhau một chữ. Điều đó không phải lỗi của công cụ mà là giới hạn của chính hệ thống, và nó nói thẳng một điều: lá số là một hệ biểu tượng để soi mình, không phải một phép đo về đời bạn. Hai người có lá số y hệt vẫn sống hai cuộc đời hoàn toàn khác nhau.',
  },
];

const JSONLD = [
  article({
    headline: 'Lập lá số Tử Vi: quy trình 6 bước từ ngày giờ sinh tới 12 cung',
    description:
      'Quy trình lập lá số Tử Vi: đổi lịch, quy canh giờ, dựng địa bàn 12 chi, định cung Mệnh và cung Thân, định Cục, an chính tinh và gắn độ sáng miếu – vượng – đắc – hãm.',
    url: '/learn/lap-la-so',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Lập lá số Tử Vi', url: '/learn/lap-la-so' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Lập lá số Tử Vi — quy trình 6 bước',
    description:
      'Học cách một lá số Tử Vi được lập ra: ba dữ kiện đầu vào, đổi sang âm lịch, quy giờ về canh giờ, dựng địa bàn 12 địa chi, định cung Mệnh và cung Thân, định Cục, an chính tinh và đọc độ sáng.',
    url: '/learn/lap-la-so',
  }),
];

export default function LearnLapLaSoPage() {
  return (
    <LearnArticle
      eyebrow="TỬ VI · QUY TRÌNH LẬP"
      title={
        <>
          Lập{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">lá số Tử Vi</span>
        </>
      }
      standfirst={
        <>
          Bạn nhập ngày giờ sinh, và vài giây sau nhận về một tấm lưới 12 ô đầy tên sao. Bài này mở
          nắp hộp: từ ba con số ban đầu tới tấm lưới ấy là sáu bước có thứ tự, bước nào cũng kiểm
          được. Hiểu quy trình rồi, bạn sẽ biết lá số của mình sai ở đâu — và biết nó không thể biết
          gì về bạn.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Lập lá số Tử Vi' },
      ]}
      relatedLenses={relatedLearnLenses('lap-la-so')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày sinh dương lịch, giờ sinh và giới tính — hệ thống chạy đúng sáu bước ở trên và trả về lá số 12 cung đầy đủ, kèm độ sáng và Tứ Hóa, miễn phí.',
        href: '/la-so-tu-vi',
        label: 'Lập lá số Tử Vi miễn phí',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <LapLaSoFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Lập lá số là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Lập lá số</strong> (còn gọi là “an sao”) là việc đổi ngày giờ sinh của một
                người thành một tấm bản đồ 12 ô, theo những bảng quy đổi cố định. Đây là{' '}
                <strong>phần tính toán</strong> của Tử Vi: có đầu vào rõ ràng, có quy tắc rõ ràng,
                và cho ra kết quả lặp lại được.
              </p>
              <p>
                Nói cho gọn: lập lá số giống việc đổi đơn vị hơn là giống việc bói. Đưa vào ngày giờ
                sinh, nhận về một cách ghi khác của cùng thông tin ấy. Cần phân biệt rõ ngay từ đầu,
                vì đây là chỗ mọi hiểu lầm bắt đầu:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Lập lá số ≠ luận lá số.</strong> Lập là tính; luận là diễn giải. Bài này
                  chỉ dạy phần lập. Từng cung nói gì, các sao phối với nhau ra sao thuộc bài{' '}
                  <Link
                    href="/learn/tu-vi"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    Tử Vi 12 cung
                  </Link>
                  .
                </li>
                <li>
                  <strong>Lập lá số không phải chỗ có “trực giác của thầy”.</strong> Nếu hai nơi lập
                  ra hai lá số khác nhau thì nguyên nhân nằm ở dữ liệu đầu vào hoặc ở quy ước của
                  từng trường phái — không phải ở cảm nhận.
                </li>
                <li>
                  <strong>Lá số không biết gì về đời bạn.</strong> Nó nhận đúng ba dữ kiện. Mọi câu
                  nói được từ lá số đều là suy diễn từ ba dữ kiện đó, không phải quan sát về bạn.
                </li>
              </ul>
              <p>
                Vì sao nên học phần này thay vì chỉ bấm nút? Vì nó cho bạn{' '}
                <strong>khả năng kiểm tra</strong>. Người hiểu quy trình, khi thấy lá số “không
                giống mình”, sẽ đi kiểm ngày âm và canh giờ trước — chứ không kết luận vội rằng Tử
                Vi sai hoặc rằng mình có số lạ.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <LapLaSoDepth />,
        },
        {
          id: 'du-lieu-dau-vao',
          tocLabel: 'Dữ liệu đầu vào',
          heading: 'Cần đúng những gì — và vì sao giờ sinh đắt đến thế',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Công cụ lập lá số của hieu.asia hỏi <strong>đúng ba ô</strong>, không hơn:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Ngày sinh dương lịch</strong> — để đổi ra ngày, tháng, năm âm lịch.
                </li>
                <li>
                  <strong>Giờ sinh</strong> — để quy về canh giờ, rồi cùng tháng âm định cung Mệnh
                  và cung Thân.
                </li>
                <li>
                  <strong>Giới tính</strong> — không tham gia vào việc đổi lịch hay dựng khung; theo
                  quy tắc truyền thống, nó cùng âm dương của năm sinh quyết định{' '}
                  <strong>chiều đi của đại vận</strong>.
                </li>
              </ul>
              <p>
                Và cần nói thẳng thứ nó <strong>không</strong> hỏi: <strong>nơi sinh</strong>. Nghĩa
                là công cụ không hiệu chỉnh giờ sinh theo kinh độ nơi bạn chào đời — phần đó công cụ
                không tính, nên bài này không dạy. Nếu bạn sinh ở nước khác và giờ ghi trên giấy là
                giờ địa phương nơi đó, hãy tự cân nhắc khi nhập.
              </p>

              <h3 className="text-lg font-semibold text-foreground">12 canh giờ — giờ đồng hồ quy về đâu</h3>
              <p>
                Lá số không dùng giờ theo phút. Nó dùng <strong>canh giờ</strong>: 12 khối, mỗi khối
                đúng 2 tiếng, mang tên 12 địa chi. Đây là bảng đầy đủ:
              </p>
              <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {BRANCHES.map((b) => (
                  <div key={b} className="rounded-lg border border-border bg-card/40 px-3 py-2">
                    <dt className="text-sm font-medium text-foreground">Giờ {b}</dt>
                    <dd className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                      {HOUR_RANGE[b]}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-sm text-foreground/70">
                Để ý giờ {BRANCHES[0]}: <strong>{HOUR_RANGE[BRANCHES[0]!]}</strong> — đây là canh
                giờ duy nhất vắt qua nửa đêm. Nếu bạn sinh trong khoảng sau 23h, hãy kiểm lại giấy
                tờ xem ngày ghi là ngày nào, vì đó là chỗ các gia đình hay nhớ khác nhau.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Sai một giờ thì lệch cái gì</h3>
              <p>
                Câu trả lời chính xác là: <strong>chỉ lệch khi bạn bước sang một canh giờ khác</strong>.
                Trong cùng một canh giờ, mọi phút đều cho ra lá số y hệt.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Sinh {EX.hour}h{EX.minute} hay {EX_HOUR_SAME}h — cùng{' '}
                  <strong>giờ {EX_BRANCH}</strong> ({HOUR_RANGE[EX_BRANCH]}) → lá số{' '}
                  <strong>không khác một chữ</strong>.
                </li>
                <li>
                  Sinh {EX_HOUR_SAME}h so với {EX_HOUR_NEXT}h — chỉ cách một tiếng nhưng đã là{' '}
                  <strong>giờ {branchOfHour(EX_HOUR_SAME)}</strong> so với{' '}
                  <strong>giờ {branchOfHour(EX_HOUR_NEXT)}</strong> → cung Mệnh và cung Thân dịch
                  chỗ.
                </li>
              </ul>
              <p>
                Cung Mệnh dịch một ô thì <strong>cả 11 cung còn lại dịch theo</strong>, vì vòng cung
                xếp quanh nó. Cùng với đó, một số sao vốn an theo giờ cũng lệch. Nói cách khác, sai
                canh giờ không làm hỏng một chi tiết — nó làm mọi kết luận theo cung đổi chỗ.
              </p>
              <p className="text-sm text-foreground/70">
                Không nhớ giờ sinh thì để <strong>12:00</strong> (giờ {branchOfHour(12)}) như mặc
                định của công cụ, nhưng hãy nhớ đó là <strong>một phỏng đoán, không phải dữ liệu</strong>.
                Cách kiểm rẻ nhất: lập thêm một lá số ở canh giờ liền kề rồi so. Phần bạn quan tâm
                không đổi thì giờ sinh không phải chỗ đáng lo; nếu đổi, hãy đi hỏi lại người nhà
                trước khi đọc tiếp.
              </p>
            </div>
          ),
        },
        {
          id: 'cac-buoc-lap',
          tocLabel: '6 bước lập lá số',
          heading: 'Sáu bước lập một lá số, đúng thứ tự',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Thứ tự dưới đây <strong>không đảo được</strong>: mỗi bước ăn kết quả của bước trước.
                Bạn tự làm được bước 2 và bước 3 bằng tay; các bước sau chạy trong engine, nhưng
                biết chúng làm gì là đủ để đọc kết quả mà không phải tin mù.
              </p>
              <ol className="space-y-4">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="rounded-xl border border-border bg-card/40 p-4">
                    <p className="font-heading text-base font-semibold text-foreground">
                      <span aria-hidden="true" className="mr-2 font-mono text-gold-700">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85">{s.detail}</p>
                    <p className="mt-2 text-xs text-muted-foreground">Tự kiểm: {s.check}</p>
                  </li>
                ))}
              </ol>

              <h3 className="text-lg font-semibold text-foreground">Vòng 12 cung và sáu chỗ của cung Thân</h3>
              <p>
                Sau khi biết cung Mệnh rơi vào ô địa chi nào, 11 cung còn lại xếp theo đúng vòng
                này, luôn luôn:
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-3 text-sm font-medium leading-relaxed text-foreground">
                {PALACE_RING.join(' → ')} → (quay lại {PALACE_RING[0]})
              </p>
              <p>
                Vì cung Mệnh và cung Thân đếm <strong>ngược chiều nhau</strong> theo giờ, khoảng
                cách giữa chúng luôn thay đổi theo <strong>bước chẵn</strong>. Hệ quả là cung Thân
                chỉ có thể rơi vào các vị trí chẵn trên vòng trên, tức đúng sáu cung:{' '}
                <strong>{THAN_PALACES.join(' · ')}</strong>.
              </p>
              <p className="text-sm text-foreground/70">
                Sáu cái tên này không phải bài này tự nghĩ ra — chúng suy thẳng từ vòng 12 cung ở
                trên, và trùng khớp với danh sách mà công cụ{' '}
                <Link href="/tinh-menh-cuc" className="text-gold-700 underline-offset-4 hover:underline">
                  Tính Mệnh Cục
                </Link>{' '}
                ghi trong phần giải thích của nó. Đó là cách bạn tự kiểm một quy tắc thay vì phải
                tin.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Ví dụ: lập tay hai bước đầu</h3>
              <p>
                Lấy một người sinh <strong>{EX.day}/{EX.month}/{EX.year} dương lịch</strong>, lúc{' '}
                <strong>{EX.hour}h{EX.minute}</strong>
                . Hai bước đầu bạn làm được bằng lịch vạn niên và bảng canh giờ ở trên:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Bước 2 — đổi lịch:</strong> ngày {EX_LUNAR.day} tháng {EX_LUNAR.month}
                  {EX_LUNAR.leap ? ' (nhuận)' : ''} năm âm lịch {EX_LUNAR.year}.
                </li>
                <li>
                  <strong>Bước 2 — can chi năm sinh</strong> (suy từ năm âm vừa ra):{' '}
                  {EX_YEAR_CANCHI.name}, con giáp {EX_YEAR_CANCHI.animal}.
                </li>
                <li>
                  <strong>Bước 3 — quy canh giờ:</strong> giờ {EX_BRANCH} ({HOUR_RANGE[EX_BRANCH]}).
                </li>
              </ul>
              <p>
                Tới đây bạn đã có <strong>tháng âm</strong> và <strong>canh giờ</strong> — đúng hai
                thứ mà bước 4 cần để định cung Mệnh. Bài này{' '}
                <strong>dừng phép tính tay ở đây một cách có chủ ý</strong>: bảng đếm cụ thể để ra
                cung Mệnh chạy bên trong engine và hieu.asia không công bố, nên viết ra con số ở đây
                là bịa. Việc đúng là chạy nốt bằng{' '}
                <Link href="/tinh-menh-cuc" className="text-gold-700 underline-offset-4 hover:underline">
                  công cụ Tính Mệnh Cục
                </Link>{' '}
                rồi đối chiếu — bạn đã kiểm được hai bước đầu, phần còn lại có chỗ để so.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Bẫy Tết: hai ngày, hai năm</h3>
              <p>
                Đây là ví dụ thứ hai, và là lỗi hay gặp nhất. Hai người sinh cách nhau đúng hai hôm:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                {TET_PAIR.map((t) => (
                  <li key={`${t.solar.day}-${t.solar.month}-${t.solar.year}`}>
                    Sinh{' '}
                    <strong>
                      {t.solar.day}/{t.solar.month}/{t.solar.year}
                    </strong>{' '}
                    dương lịch → ngày {t.lunar.day} tháng {t.lunar.month} năm âm lịch{' '}
                    <strong>{t.lunar.year}</strong> → can chi năm sinh{' '}
                    <strong>{t.canChi}</strong>.
                  </li>
                ))}
              </ul>
              <p>
                Hai can chi năm sinh khác nhau nghĩa là <strong>Cục khác nhau</strong> và{' '}
                <strong>bộ Tứ Hóa gốc khác nhau</strong> — hai lá số lệch nhau ở tầng nền, dù hai
                người chỉ sinh cách nhau hai ngày. Nếu bạn sinh tháng 1 hoặc đầu tháng 2 dương lịch,
                hãy kiểm bước đổi lịch trước tiên bằng{' '}
                <Link
                  href="/lich-van-nien"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  lịch vạn niên
                </Link>{' '}
                trước khi kết luận bất cứ điều gì về lá số của mình.
              </p>
            </div>
          ),
        },
        {
          id: 'do-sang-cua-sao',
          tocLabel: 'Độ sáng của sao',
          heading: 'Độ sáng: vì sao cùng một sao lại mạnh yếu khác nhau',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Khi lá số hiện ra, bạn sẽ thấy nhiều sao có một chữ trong ngoặc bên cạnh tên: “miếu”,
                “vượng”, “đắc”, “hãm”… Đó là <strong>độ sáng</strong> — bậc mạnh yếu của sao{' '}
                <strong>tại đúng vị trí nó đang đứng</strong>.
              </p>
              <p>
                Điều quan trọng nhất về độ sáng, và là lý do nó thuộc bài này chứ không thuộc bài
                luận giải: <strong>nó không phải nhận xét của ai cả</strong>. Mỗi cặp (sao, ô địa
                chi) ứng với một bậc sáng cố định trong bảng, nên độ sáng được xác định{' '}
                <strong>ngay lúc an sao</strong>, cùng lúc với việc biết sao ấy đứng ở đâu. Nó là
                một thuộc tính của vị trí, không phải một lời đánh giá.
              </p>
              <p>Bốn bậc hay gặp nhất:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Miếu</strong> — bậc sáng nhất: sao phát huy đầy đủ, mặt tốt nổi rõ.
                </li>
                <li>
                  <strong>Vượng</strong> — rất mạnh, gần như miếu.
                </li>
                <li>
                  <strong>Đắc</strong> — khá: sao hoạt động tốt, ổn.
                </li>
                <li>
                  <strong>Hãm</strong> — bậc tối nhất: sao yếu, mặt khó dễ trồi lên hơn.
                </li>
              </ul>
              <p>
                Vậy vì sao <strong>cùng một sao</strong> lại mạnh yếu khác nhau tuỳ cung? Vì độ sáng
                được tra theo cặp: sao nào, đứng ở ô địa chi nào. Sao vẫn là sao đó, nhưng chỗ đứng
                đổi thì bậc sáng đổi. Mà chỗ đứng của sao lại do ngày giờ sinh quyết định ở các bước
                trước — nên độ sáng là <strong>hệ quả cuối chuỗi</strong>, không phải thứ được gán
                thêm vào.
              </p>
              <p>
                Hai điều phải giữ cho khỏi đọc sai. Một:{' '}
                <strong>“hãm” không đồng nghĩa với xấu, “miếu” không đồng nghĩa với tốt</strong>. Độ
                sáng mô tả cường độ biểu hiện, không phải điểm số; sao hãm gặp cát tinh phụ trợ vẫn
                dùng được, sao miếu gặp sát tinh nặng vẫn trục trặc. Hai:{' '}
                <strong>không phải sao nào cũng có độ sáng</strong> — trong dữ liệu lá số, đây là
                một trường tuỳ chọn, nhiều phụ tinh không mang nó. Thấy một sao không có chữ trong
                ngoặc thì đó là bình thường, không phải thiếu dữ liệu.
              </p>
              <p className="text-sm text-foreground/70">
                Thang đầy đủ còn vài bậc trung gian nữa, và chuyện <strong>dùng</strong> độ sáng thế
                nào khi luận (nó xếp ở lớp nào, xét cùng những gì) thuộc phần luận giải — bài{' '}
                <Link
                  href="/learn/tu-vi"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Tử Vi 12 cung
                </Link>{' '}
                phụ trách cả hai. Bài này dừng ở chỗ trả lời con số ấy từ đâu ra.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: lá số là hệ biểu tượng, không phải phép đo',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đã đi hết quy trình, bạn thấy rõ một điều mà ít trang nào nói thẳng: toàn bộ tấm lá
                số được sinh ra từ <strong>đúng ba dữ kiện</strong> — ngày sinh dương lịch, giờ
                sinh, giới tính. Không có gì khác đi vào phép tính.
              </p>
              <p>
                Hệ quả trực tiếp, và nên nói ra bằng câu rõ ràng nhất:{' '}
                <strong>
                  hai người sinh cùng ngày, cùng canh giờ, cùng giới tính sẽ có lá số giống hệt nhau,
                  không lệch một chữ
                </strong>
                . Điều này kiểm được, không phải suy đoán: hệ thống lưu tạm kết quả bằng đúng bộ
                khoá ba dữ kiện đó, và chỉ làm được vì cùng đầu vào chắc chắn cho cùng đầu ra. Mà
                mỗi canh giờ dài <strong>2 tiếng</strong>, nên trong cùng một ngày ở Việt Nam, số
                người chia nhau một tấm lá số y hệt là rất lớn — và họ sống những cuộc đời không
                giống nhau chút nào.
              </p>
              <p>
                Đó không phải bằng chứng “Tử Vi sai”. Đó là bằng chứng rằng Tử Vi{' '}
                <strong>không phải một phép đo</strong>. Một phép đo thì phải phân biệt được từng cá
                thể; lá số không hề nhận đủ thông tin để làm việc đó, và cũng không tự nhận là làm
                được. Lá số là một <strong>hệ biểu tượng</strong>: một bộ từ vựng và một cách chia
                đời sống thành các lĩnh vực, để người ta có chỗ mà soi mình một cách có kỷ luật thay
                vì nghĩ lan man.
              </p>
              <p>Vì vậy, ba điều nên giữ:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Đừng đọc lá số như một bản án.</strong> Nó không chứa thông tin về những
                  gì đã và sẽ xảy ra với bạn — chỉ chứa ba con số bạn vừa nhập, viết lại bằng ngôn
                  ngữ khác.
                </li>
                <li>
                  <strong>Đừng để một ô “trông dữ” quyết định gì.</strong> Việc đúng là quay lại
                  kiểm dữ liệu đầu vào trước, và khi luận thì không bao giờ đọc một cung lẻ.
                </li>
                <li>
                  <strong>Đừng nhầm phần tính với phần diễn giải.</strong> An cung, an sao là tính
                  toán xác định, kiểm chứng được; “điều này nghĩa là gì với đời bạn” là diễn giải —
                  tham khảo, và luôn phải để bạn là người quyết.
                </li>
              </ul>
              <p>
                hieu.asia trình bày đúng ranh giới đó:{' '}
                <Link
                  href="/methodology/tu-vi"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  phương pháp luận Tử Vi
                </Link>{' '}
                nói rõ chỗ nào là thuật toán, chỗ nào là diễn giải. Con số thì minh bạch; phần đọc
                thì khiêm tốn — không phán số mệnh, không hù doạ, không bán lễ “hoá giải”.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <LapLaSoWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <LapLaSoRecall />,
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
                Lập xong rồi thì học đọc: 12 cung soi lĩnh vực nào, các sao phối với nhau ra sao, vì
                sao không bao giờ đọc một cung lẻ —{' '}
                <Link href="/learn/tu-vi" className="text-gold-700 underline-offset-4 hover:underline">
                  bài Tử Vi 12 cung
                </Link>{' '}
                phụ trách. Hai bước đầu cũng có bài riêng:{' '}
                <Link
                  href="/learn/lich-am-duong"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  lịch âm dương
                </Link>{' '}
                và{' '}
                <Link href="/learn/can-chi" className="text-gold-700 underline-offset-4 hover:underline">
                  thiên can – địa chi
                </Link>
                . Muốn thấy sáu bước chạy trên chính ngày giờ sinh của bạn?{' '}
                <Link href="/la-so-tu-vi" className="text-gold-700 underline-offset-4 hover:underline">
                  Lập lá số Tử Vi miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/la-so-tu-vi', label: 'Lập lá số Tử Vi' },
                    { href: '/tinh-menh-cuc', label: 'Tính Mệnh Cục' },
                    { href: '/lich-van-nien', label: 'Lịch vạn niên' },
                    { href: '/gio-hoang-dao', label: 'Tra giờ hoàng đạo' },
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
          children: <LapLaSoChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

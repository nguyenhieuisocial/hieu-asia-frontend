/**
 * Bài học /learn/dai-van — "Đại vận: lớp vận 10 năm".
 *
 * GROUNDING — KHÔNG gõ tay con số nào mà engine tính ra được. Mọi ví dụ trong
 * bài (tuổi khởi vận, chiều thuận/nghịch, nhãn từng chặng, mốc tuổi, chặng ứng
 * với tuổi tham chiếu) đều SUY TẠI RUNTIME bằng `calculateBazi()` của
 * src/lib/bazi.ts — cùng engine mà site dùng để dựng Bát Tự, nên bài học và
 * công cụ không thể lệch nhau.
 *
 * NGUỒN CHO CÁC KHẲNG ĐỊNH (đều trong repo):
 *   • src/lib/bazi.ts — computeDaiVan(): forward = (năm dương && nam) ||
 *     (năm âm && nữ); startAge = round(số ngày từ sinh tới tiết kế nếu thuận /
 *     tiết trước nếu nghịch ÷ 3), tối thiểu 1; 9 trụ vận, mỗi trụ bước ±1 từ trụ
 *     THÁNG trên vòng can chi và phủ 10 năm tuổi (endAge = startAge + 9);
 *     DaiVanPillar.tenGod = Thập Thần của can vận so với Nhật Chủ. CAN được
 *     export; CAN_YANG trong file là mảng xen kẽ bắt đầu bằng `true` nên can có
 *     chỉ số chẵn trong CAN là can DƯƠNG (dùng để hiển thị âm/dương năm sinh).
 *   • src/app/dai-van-hien-tai/{page,form}.tsx — đại vận = chu kỳ 10 năm trong
 *     Tử Vi; quy trình 3 bước của công cụ (lập lá số gốc → Cục cho tuổi khởi vận
 *     2–6 tuổi, âm dương năm sinh + giới tính cho chiều → chiếu vào tuổi hiện
 *     tại); tuổi hiện tại = năm hiện tại − năm sinh; nếu tuổi rơi ngoài khoảng
 *     thì báo không xác định được; "đại vận đóng ở cung khó nghĩa là giai đoạn
 *     đó cuộc sống ưu tiên bài học của cung ấy… không phải lời tuyên án 10 năm";
 *     đại vận cho biết lĩnh vực nào ĐANG ĐƯỢC ƯU TIÊN, không quyết định thành
 *     bại; giờ sinh quyết định cung Mệnh và Cục nên sai giờ là lệch kết quả.
 *   • src/app/timeline/page.tsx — đại vận = giai đoạn 10 năm, lưu niên = năm,
 *     lưu nguyệt = tháng; mốc tuổi và cung an mệnh thật phụ thuộc ngày giờ sinh.
 *   • src/app/tinh-menh-cuc/form.tsx — Cục xác định từ can năm sinh kết hợp vị
 *     trí cung Mệnh (KHÔNG dùng giới tính); con số của Cục (2/3/4/5/6) là tuổi
 *     bắt đầu đại vận đầu tiên.
 *   • src/app/learn/tu-vi/page.tsx — đại vận lần lượt đi qua từng cung, mỗi
 *     chặng mang Can-Chi riêng nên có bộ Tứ Hóa riêng.
 *
 * KHÔNG CÓ TRONG NGUỒN THÌ KHÔNG VIẾT: site không có engine Tử Vi chạy cục bộ
 * (lib/tuvi-client.ts gọi worker qua mạng), nên bài KHÔNG in sẵn bộ mốc đại vận
 * Tử Vi của một ngày sinh cụ thể — phần đó để công cụ /dai-van-hien-tai tính.
 * Bài chỉ nêu QUY TẮC của Tử Vi (những gì repo ghi rõ) và dùng engine Bát Tự
 * cho các ví dụ chạy được.
 *
 * PHẠM VI: Cục chỉ nhắc một câu + link /learn/menh-cuc; 12 cung thuộc
 * /learn/tu-vi; Thập Thần thuộc /learn/bat-tu; lớp vận theo TỪNG NĂM (lưu niên)
 * và thời điểm chuyển giữa hai chặng (giao vận) là hai chủ đề riêng — bài này
 * chỉ nêu tên để phân định ranh giới, không dạy.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import { CAN, calculateBazi, type DaiVanPillar } from '@/lib/bazi';
import {
  DaiVanFrame,
  DaiVanDepth,
  DaiVanRecall,
  DaiVanChecklist,
  DaiVanWhys,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤48 ký tự: root layout nối thêm " · hieu.asia" (12) và seo-guard chặn ở 60.
  title: 'Đại vận — chặng 10 năm và cách xác định',
  // ≤160 ký tự: dài hơn thì Google cắt mất câu chốt.
  description:
    'Đại vận là chặng 10 năm. Cách xác định chặng bạn đang ở, và vì sao Tử Vi với Bát Tự cho hai bộ mốc khác nhau trên cùng một người — đừng trộn hai hệ.',
  alternates: { canonical: 'https://hieu.asia/learn/dai-van' },
};

/**
 * Năm tham chiếu CỐ ĐỊNH cho các ví dụ trong bài. Cố ý không lấy năm hệ thống:
 * ví dụ trong một bài học phải đọc lại sau vài tháng vẫn ra đúng con số đã in.
 * Công cụ /dai-van-hien-tai thì ngược lại — nó lấy năm hiện tại trừ năm sinh.
 */
const REF_YEAR = 2026;

interface Example {
  /** Nhãn ngày sinh hiển thị, vd "20/05/1990". */
  birthLabel: string;
  hourLabel: string;
  genderLabel: string;
  /** Trụ năm, vd "Canh Ngọ". */
  yearPillar: string;
  /** Can năm là can dương hay âm — quyết định chiều cùng với giới tính. */
  yearYang: boolean;
  /** Trụ tháng — điểm khởi của chuỗi trụ vận trong Bát Tự. */
  monthPillar: string;
  dayMaster: string;
  forward: boolean;
  startAge: number;
  pillars: DaiVanPillar[];
  /** Tuổi tại REF_YEAR, tính đúng cách công cụ tính: năm − năm sinh. */
  age: number;
  /** Chặng chứa `age`, hoặc null nếu tuổi rơi ngoài mọi chặng. */
  current: DaiVanPillar | null;
}

function buildExample(birthSolarDate: string, hour: number, gender: 'M' | 'F'): Example {
  const chart = calculateBazi({ birthSolarDate, birthHour: hour, gender });
  const dv = chart.daiVan;
  if (!dv) throw new Error('calculateBazi phải trả đại vận khi đã truyền gender');
  const [y, m, d] = birthSolarDate.split('-') as [string, string, string];
  const age = REF_YEAR - Number(y);
  return {
    birthLabel: `${d}/${m}/${y}`,
    hourLabel: `${String(hour).padStart(2, '0')}:00`,
    genderLabel: gender === 'M' ? 'Nam' : 'Nữ',
    yearPillar: `${chart.year.can} ${chart.year.chi}`,
    // CAN_YANG trong lib/bazi.ts xen kẽ từ true → chỉ số chẵn = can dương.
    yearYang: CAN.indexOf(chart.year.can as (typeof CAN)[number]) % 2 === 0,
    monthPillar: `${chart.month.can} ${chart.month.chi}`,
    dayMaster: chart.dayMaster.can,
    forward: dv.forward,
    startAge: dv.startAge,
    pillars: dv.pillars,
    age,
    current: dv.pillars.find((p) => age >= p.startAge && age <= p.endAge) ?? null,
  };
}

// Ví dụ 1 — CÙNG ngày, CÙNG giờ, chỉ khác giới tính.
const A_NAM = buildExample('1990-05-20', 9, 'M');
const A_NU = buildExample('1990-05-20', 9, 'F');
// Cùng người ví dụ 1 nhưng lệch giờ sinh — cho thấy giờ sinh dịch mốc tuổi.
const A_NAM_TOI = buildExample('1990-05-20', 18, 'M');
// Ví dụ 2 — trường hợp tuổi khởi vận rơi hẳn ngoài khoảng 2–6 của Cục.
const B_NAM = buildExample('1993-08-05', 15, 'M');
const B_NU = buildExample('1993-08-05', 15, 'F');

/** Độ dài một chặng, lấy từ chính dữ liệu engine thay vì gõ tay. */
const SPAN = A_NAM.pillars[0]!.endAge - A_NAM.pillars[0]!.startAge + 1;
/** Số chặng engine dựng cho một lá số. */
const N_CHANG = A_NAM.pillars.length;

const label = (p: DaiVanPillar) => `${p.can} ${p.chi}`;
const rangeOf = (p: DaiVanPillar) => `${p.startAge}–${p.endAge} tuổi`;
const dirOf = (e: Example) => (e.forward ? 'thuận' : 'nghịch');
const curOf = (e: Example) =>
  e.current ? `${rangeOf(e.current)}, trụ vận ${label(e.current)}` : 'chưa vào chặng nào';

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
// Câu hỏi cố ý KHÔNG trùng FAQ của trang công cụ /dai-van-hien-tai (tuổi khởi vận
// khác nhau vì sao; thuận hay nghịch dựa vào đâu; vận xấu có phải 10 năm đen;
// bản rút gọn khác lá số đầy đủ ra sao; không nhớ giờ sinh) và của /timeline.
const FAQS = [
  {
    q: 'Vì sao Tử Vi và Bát Tự cho hai bộ mốc đại vận khác nhau trên cùng một người?',
    a: `Vì hai hệ khởi từ hai chỗ khác nhau và đếm hai thứ khác nhau. Tử Vi lấy tuổi khởi vận từ con số của Cục (2 đến 6) rồi cho chặng chạy lần lượt qua các cung của lá số. Bát Tự lấy tuổi khởi vận bằng cách đếm số ngày từ lúc sinh tới mốc tiết khí gần nhất rồi chia ba, rồi cho chặng bước tới hoặc lùi từ trụ tháng trên vòng can chi. Ví dụ chạy bằng engine của site: người sinh ${B_NAM.birthLabel} lúc ${B_NAM.hourLabel}, ${B_NAM.genderLabel.toLowerCase()}, có tuổi khởi vận Bát Tự là ${B_NAM.startAge} — nằm hẳn ngoài khoảng 2 đến 6 mà Cục cho phép. Không hệ nào tính sai; chúng đo hai thứ khác nhau nên đừng trộn kết quả.`,
  },
  {
    q: 'Đổi giới tính thì đổi những gì trong đại vận?',
    a: `Tuỳ hệ. Trong Tử Vi, tuổi khởi vận là con số của Cục, mà Cục suy từ can năm sinh kết hợp vị trí cung Mệnh — không dùng giới tính; nên hai người cùng ngày giờ sinh khác giới có cùng tuổi khởi vận, chỉ khác chiều đi trên 12 cung. Trong Bát Tự thì chiều quyết định đo về phía tiết kế hay tiết trước, mà chiều lại phụ thuộc giới tính, nên đổi giới tính là đổi luôn cả tuổi khởi vận. Ví dụ chạy bằng engine: cùng sinh ${A_NAM.birthLabel} lúc ${A_NAM.hourLabel}, bản ${A_NAM.genderLabel.toLowerCase()} khởi vận ${A_NAM.startAge} tuổi và đi ${dirOf(A_NAM)}, bản ${A_NU.genderLabel.toLowerCase()} khởi vận ${A_NU.startAge} tuổi và đi ${dirOf(A_NU)}.`,
  },
  {
    q: 'Hai chặng đại vận có chồng lên nhau hoặc để hở khoảng trống không?',
    a: `Không. Mỗi chặng phủ đúng ${SPAN} năm tuổi liên tiếp, và chặng sau bắt đầu ngay sau chặng trước. Trong ví dụ chạy bằng engine ở bài, bộ chặng của người sinh ${A_NAM.birthLabel} bắt đầu lần lượt ở các tuổi ${A_NAM.pillars.map((p) => p.startAge).join(', ')} — cách nhau đúng ${SPAN} năm, không chồng, không hở. Cần nói rõ: đây là ranh giới trên bảng tính, còn thời điểm chuyển thật giữa hai chặng là một chủ đề riêng (giao vận) mà bài này không dạy.`,
  },
  {
    q: 'Tuổi tôi nhỏ hơn tuổi khởi vận thì đang ở đại vận nào?',
    a: 'Chưa ở chặng nào cả. Chặng thứ nhất bắt đầu đúng tại tuổi khởi vận, nên trước mốc đó không có chặng nào để đọc. Công cụ trên hieu.asia xử lý đúng như vậy: nếu tuổi rơi ngoài khoảng các chặng, nó báo không xác định được đại vận hiện tại thay vì đoán bừa. Đây cũng là lý do đại vận không phải công cụ dành cho trẻ nhỏ.',
  },
  {
    q: 'Đại vận Bát Tự có cũng bắt đầu trong khoảng 2 đến 6 tuổi như Tử Vi không?',
    a: `Không. Khoảng 2 đến 6 là đặc điểm của Cục trong Tử Vi. Bát Tự đếm số ngày từ lúc sinh tới mốc tiết khí gần nhất rồi chia ba, nên kết quả trải rộng hơn nhiều. Hai ví dụ chạy bằng engine của site cho thấy khoảng cách đó: cùng sinh ${B_NAM.birthLabel} lúc ${B_NAM.hourLabel}, bản ${B_NAM.genderLabel.toLowerCase()} khởi vận ${B_NAM.startAge} tuổi trong khi bản ${B_NU.genderLabel.toLowerCase()} khởi vận ${B_NU.startAge} tuổi.`,
  },
  {
    q: 'Sai giờ sinh một chút thì bộ chặng có đổi không?',
    a: `Có, và đây là chỗ đáng cẩn thận. Bên Tử Vi, giờ sinh quyết định cung Mệnh và Cục, tức quyết định cả vị trí lẫn nhịp đại vận, nên sai giờ là lệch kết quả. Bên Bát Tự, giờ sinh đổi khoảng cách từ lúc sinh tới mốc tiết khí nên đổi tuổi khởi vận. Ví dụ chạy bằng engine: cùng người sinh ${A_NAM.birthLabel}, ${A_NAM.genderLabel.toLowerCase()}, sinh lúc ${A_NAM.hourLabel} thì khởi vận ${A_NAM.startAge} tuổi, còn sinh lúc ${A_NAM_TOI.hourLabel} cùng ngày thì khởi vận ${A_NAM_TOI.startAge} tuổi — toàn bộ mốc dịch đi, dù nhãn các chặng vẫn giữ nguyên vì trụ tháng không đổi.`,
  },
  {
    q: 'Đại vận khác lưu niên thế nào?',
    a: 'Đó là hai lớp khác độ dài. Đại vận là lớp giai đoạn, mỗi chặng 10 năm. Lưu niên là lớp từng năm, nằm lồng bên trong chặng đang diễn ra; dưới nữa còn lớp từng tháng gọi là lưu nguyệt. Bài này chỉ dạy lớp 10 năm — cách đọc lưu niên là một chủ đề riêng, và trộn hai lớp vào một câu kết luận là cách nhanh nhất để nói sai.',
  },
  {
    q: 'Biết mình đang ở đại vận nào rồi thì dùng vào việc gì?',
    a: 'Dùng để đặt trọng tâm cho một quãng dài, không phải để chọn ngày. Đại vận cho biết lĩnh vực nào đang được ưu tiên trong giai đoạn này — ví dụ chặng rơi vào cung sự nghiệp thì mười năm ấy chuyện nghề là chủ đề chính. Biết chủ đề giúp bạn đặt mục tiêu hợp nhịp thay vì ép mình theo lịch của người khác. Nó không quyết định bạn thành công hay thất bại, và không thay được kế hoạch cụ thể.',
  },
  {
    q: 'Tra cả hai hệ rồi chọn kết quả nào dễ chịu hơn thì có sao không?',
    a: 'Có — đó là cách chắc chắn nhất để biến một công cụ tham khảo thành cái gương phản chiếu mong muốn của chính mình. Khi hai hệ cho hai bộ mốc và bạn chỉ giữ lại bên nói điều mình muốn nghe, kết quả không còn nói gì về đời bạn nữa. Cách dùng sạch là chọn một hệ trước khi tra, đọc trọn kết quả của hệ đó, kể cả phần không dễ chịu.',
  },
];

const JSONLD = [
  article({
    headline: 'Đại vận: chặng 10 năm, cách xác định chặng hiện tại và vì sao hai hệ lệch mốc',
    description:
      'Đại vận là lớp vận 10 năm. Bài này chỉ cách xác định chặng đang ở, và giải thích vì sao Tử Vi (khởi từ Cục, chạy qua các cung) và Bát Tự (khởi từ trụ tháng, bước trên vòng can chi) cho hai bộ mốc khác nhau.',
    url: '/learn/dai-van',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Đại vận', url: '/learn/dai-van' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Đại vận — lớp vận 10 năm',
    description:
      'Học lớp vận 10 năm từ đầu: đại vận là gì, vì sao chia theo chặng 10 năm, cách suy chặng hiện tại từ tuổi khởi vận và chiều đi, và vì sao Tử Vi với Bát Tự cho hai bộ mốc khác nhau nên không được trộn.',
    url: '/learn/dai-van',
  }),
];

const TH = 'px-4 py-2.5 font-semibold text-foreground';
const TD = 'px-4 py-2 text-muted-foreground';

export default function LearnDaiVanPage() {
  return (
    <LearnArticle
      eyebrow="LỚP THỜI GIAN · 10 NĂM"
      title={
        <>
          Đại vận{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">(chặng 10 năm)</span>
        </>
      }
      standfirst={
        <>
          Lá số gốc mô tả cả đời một lượt. Đại vận là lớp chia đời người thành từng chặng mười
          năm để trả lời câu hỏi thực tế hơn: giai đoạn này đang xoay quanh chuyện gì. Bài này
          chỉ bạn cách suy ra chặng mình đang ở — và cảnh báo một điều ít ai nói: Tử Vi và Bát
          Tự tính đại vận theo hai cách khác nhau nên cho hai bộ mốc khác nhau.{' '}
          <Link href="/timeline" className="text-gold-700 underline-offset-4 hover:underline">
            Xem các chặng nối nhau trên timeline →
          </Link>
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026 · Ví dụ chạy bằng engine của site"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Đại vận' },
      ]}
      relatedLenses={relatedLearnLenses('dai-van')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày giờ sinh và giới tính, công cụ dựng lá số Tử Vi rồi chiếu tuổi hiện tại của bạn vào các chặng để cho biết bạn đang ở đại vận nào và cung nào đang là trọng tâm.',
        href: '/dai-van-hien-tai',
        label: 'Xem đại vận hiện tại',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <DaiVanFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Đại vận là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                <strong>Đại vận</strong> là một chặng <strong>{SPAN} năm</strong> trong đời,
                kèm một cái nhãn riêng. Trong Tử Vi, nhãn đó là một cung của lá số, nên mười
                năm ấy được luận là nghiêng về lĩnh vực của cung đó. Trong Bát Tự, nhãn đó là
                một cặp Can-Chi đặt thêm bên cạnh bốn trụ gốc.
              </p>
              <p>
                Toàn bộ ý tưởng chỉ có ba mảnh, và mọi công cụ đại vận đều đi qua đúng ba mảnh
                này:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tuổi khởi vận</strong> — chặng đầu tiên bắt đầu ở tuổi nào. Trước mốc
                  đó, không có chặng nào để đọc.
                </li>
                <li>
                  <strong>Chiều đi</strong> — thuận hay nghịch. Cả hai hệ dùng chung một quy
                  tắc: <strong>dương nam và âm nữ đi thuận, âm nam và dương nữ đi nghịch</strong>
                  , tức âm dương của năm sinh kết hợp giới tính.
                </li>
                <li>
                  <strong>Nhãn của từng chặng</strong> — chặng thứ nhất, thứ hai… mang tên gì.
                </li>
              </ul>
              <p>
                Có ba mảnh đó là dựng được cả bộ chặng, rồi chiếu tuổi hiện tại vào để biết
                mình đang ở đâu. Nghe đơn giản, và đúng là đơn giản — cái khó nằm ở chỗ{' '}
                <strong>hai hệ tính ba mảnh này theo hai cách khác nhau</strong>.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Và đây là những gì đại vận KHÔNG phải
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải dự báo thành hay bại.</strong> Đại vận cho biết lĩnh vực
                  nào <em>đang được ưu tiên</em> trong giai đoạn này, không nói bạn sẽ thắng
                  hay thua trong lĩnh vực đó.
                </li>
                <li>
                  <strong>Không phải lớp vận theo từng năm.</strong> Lớp từng năm gọi là{' '}
                  <em>lưu niên</em>, nằm lồng bên trong chặng đang diễn ra; dưới nữa còn lớp
                  từng tháng. Đó là chủ đề riêng, bài này không dạy.
                </li>
                <li>
                  <strong>Không phải thời điểm chuyển giữa hai chặng.</strong> Chuyện "đúng lúc
                  nào thì sang chặng mới" gọi là <em>giao vận</em> và có cách tính riêng — bài
                  này chỉ nói về bản thân các chặng.
                </li>
                <li>
                  <strong>Không phải công cụ chọn ngày.</strong> Đơn vị của nó là mười năm.
                  Dùng một cái thước dài mười năm để đo một buổi ký hợp đồng là sai công cụ.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Ba việc bài này sẽ dạy bạn làm được: suy ra chặng mình đang ở từ tuổi khởi vận
                và chiều đi, nói rõ vì sao hai hệ cho hai bộ mốc, và biết dừng lại trước những
                kết luận mà đại vận không đủ sức đỡ.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <DaiVanDepth />,
        },
        {
          id: 'hai-he-hai-cach-tinh',
          tocLabel: 'Hai hệ, hai cách tính',
          heading: 'Tử Vi và Bát Tự tính đại vận khác nhau ở đâu',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Đây là phần quan trọng nhất của bài. Cả hai hệ đều có lớp vận mười năm, đều gọi
                nó là đại vận, và đều dùng chung quy tắc thuận nghịch. Vì thế rất dễ tưởng
                chúng là một thứ. <strong>Chúng không phải một thứ.</strong>
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>
                        So sánh
                      </th>
                      <th scope="col" className={TH}>
                        Tử Vi Đẩu Số
                      </th>
                      <th scope="col" className={TH}>
                        Bát Tự (Tứ Trụ)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">Chặng chạy trên</td>
                      <td className={TD}>Các cung của lá số — mỗi chặng đóng ở một cung</td>
                      <td className={TD}>Vòng can chi — mỗi chặng là một cặp Can-Chi</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">Điểm khởi</td>
                      <td className={TD}>Cục của lá số</td>
                      <td className={TD}>Trụ tháng, rồi bước ±1 trên vòng can chi</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">Tuổi khởi vận</td>
                      <td className={TD}>
                        Chính con số của Cục: 2, 3, 4, 5 hoặc 6 — luôn nằm trong khoảng đó
                      </td>
                      <td className={TD}>
                        Số ngày từ lúc sinh tới mốc tiết khí gần nhất chia 3 — không bị bó
                        trong khoảng nào
                      </td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">Chiều thuận nghịch</td>
                      <td className={TD}>
                        Dương nam, âm nữ đi thuận; âm nam, dương nữ đi nghịch
                      </td>
                      <td className={TD}>Cùng quy tắc</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">
                        Khác giới, cùng ngày giờ
                      </td>
                      <td className={TD}>
                        Cùng tuổi khởi vận (Cục không dùng giới tính), chỉ ngược chiều
                      </td>
                      <td className={TD}>Khác cả tuổi khởi vận lẫn chiều</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">Một chặng cho biết</td>
                      <td className={TD}>
                        Cung nào đang là trọng tâm, chính tinh của cung đó, và Can-Chi riêng của
                        chặng
                      </td>
                      <td className={TD}>
                        Một cặp Can-Chi kèm Thập Thần của can vận so với Nhật Chủ
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-foreground">Độ dài mỗi chặng</td>
                      <td className={TD}>{SPAN} năm</td>
                      <td className={TD}>{SPAN} năm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Nhìn bảng là thấy vì sao hai bộ mốc lệch nhau: chúng{' '}
                <strong>khởi từ hai chỗ khác nhau</strong> và{' '}
                <strong>lấy tuổi khởi vận bằng hai phép tính khác nhau</strong>. Tử Vi neo vào
                Cục — một con số cố định trong khoảng 2 đến 6, không phụ thuộc giới tính. Bát
                Tự neo vào khoảng cách thời gian từ lúc sinh tới mốc tiết khí, mà đo về phía
                nào lại do chiều quyết định, còn chiều thì phụ thuộc giới tính.
              </p>
              <p>
                Kết quả: cùng một người, Tử Vi có thể nói bạn vào chặng mới ở một tuổi, Bát Tự
                nói ở tuổi khác; và nhãn của chặng cũng thuộc hai ngôn ngữ khác nhau (một bên
                là tên cung, một bên là cặp Can-Chi). Không ai tính sai —{' '}
                <strong>hai hệ đo hai thứ khác nhau</strong>. Cách dùng đúng là chọn một hệ,
                đọc trọn kết quả của hệ đó, và không cộng trừ mốc của hệ này với hệ kia.
              </p>
              <p className="text-sm text-foreground/70">
                Cục là mắt xích của riêng phía Tử Vi và có cách suy riêng — xem bài{' '}
                <Link
                  href="/learn/menh-cuc"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Mệnh Cục
                </Link>
                . Cách đọc Thập Thần thuộc bài{' '}
                <Link
                  href="/learn/bat-tu"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Bát Tự
                </Link>
                , còn 12 cung thuộc bài{' '}
                <Link
                  href="/learn/tu-vi"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Tử Vi 12 cung
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'cach-xac-dinh-chang',
          tocLabel: 'Xác định chặng hiện tại',
          heading: 'Cách suy ra chặng bạn đang ở, từng bước',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Bốn bước, làm được bằng giấy bút một khi đã có tuổi khởi vận và chiều đi.
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Chọn hệ trước khi tính.</strong> Tử Vi hay Bát Tự — chọn xong thì
                  theo tới cuối. Đây là bước hay bị bỏ qua nhất, và cũng là bước sinh ra nhiều
                  nhầm lẫn nhất.
                </li>
                <li>
                  <strong>Tính tuổi.</strong> Công cụ trên hieu.asia lấy{' '}
                  <strong>năm hiện tại trừ năm sinh</strong>. Dùng đúng quy ước đó thì con số
                  của bạn mới khớp với con số công cụ trả về.
                </li>
                <li>
                  <strong>Lấy tuổi khởi vận và chiều đi.</strong> Bên Tử Vi, tuổi khởi vận là
                  con số của Cục. Bên Bát Tự, nó là số ngày từ lúc sinh tới mốc tiết khí gần
                  nhất chia ba. Chiều thì cả hai hệ giống nhau: dương nam và âm nữ đi thuận, âm
                  nam và dương nữ đi nghịch.
                </li>
                <li>
                  <strong>Đếm chặng.</strong> Chặng thứ nhất phủ từ tuổi khởi vận đến tuổi khởi
                  vận cộng {SPAN - 1}. Chặng thứ hai bắt đầu ngay sau đó, và cứ thế. Tìm chặng
                  chứa tuổi của bạn. Nếu tuổi nhỏ hơn tuổi khởi vận thì bạn{' '}
                  <strong>chưa vào chặng nào</strong>.
                </li>
              </ol>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Ví dụ 1 — cùng ngày, cùng giờ, khác giới tính
              </h3>
              <p>
                Hai bộ chặng dưới đây do engine Bát Tự của chính site tính, cho cùng một thời
                điểm sinh: <strong>{A_NAM.birthLabel}</strong> lúc{' '}
                <strong>{A_NAM.hourLabel}</strong>. Trụ năm là {A_NAM.yearPillar} (can{' '}
                {A_NAM.yearYang ? 'dương' : 'âm'}), trụ tháng là {A_NAM.monthPillar} — trụ tháng
                chính là điểm khởi của chuỗi trụ vận.
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <strong>{A_NAM.genderLabel}</strong>: can năm{' '}
                  {A_NAM.yearYang ? 'dương' : 'âm'} gặp {A_NAM.genderLabel.toLowerCase()} nên đi{' '}
                  <strong>{dirOf(A_NAM)}</strong>, khởi vận <strong>{A_NAM.startAge} tuổi</strong>.
                </li>
                <li>
                  <strong>{A_NU.genderLabel}</strong>: cùng can năm đó gặp{' '}
                  {A_NU.genderLabel.toLowerCase()} nên đi <strong>{dirOf(A_NU)}</strong>, khởi
                  vận <strong>{A_NU.startAge} tuổi</strong>.
                </li>
              </ul>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>
                        Chặng
                      </th>
                      <th scope="col" className={TH}>
                        {A_NAM.genderLabel} — tuổi
                      </th>
                      <th scope="col" className={TH}>
                        {A_NAM.genderLabel} — trụ vận
                      </th>
                      <th scope="col" className={TH}>
                        {A_NU.genderLabel} — tuổi
                      </th>
                      <th scope="col" className={TH}>
                        {A_NU.genderLabel} — trụ vận
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {A_NAM.pillars.map((p, i) => {
                      const q = A_NU.pillars[i]!;
                      return (
                        <tr key={p.index} className="border-b border-border/60 last:border-b-0">
                          <td className="px-4 py-2 font-medium text-foreground">{p.index}</td>
                          <td className={TD}>{rangeOf(p)}</td>
                          <td className={TD}>{label(p)}</td>
                          <td className={TD}>{rangeOf(q)}</td>
                          <td className={TD}>{label(q)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p>
                Chiếu vào năm tham chiếu {REF_YEAR}: người sinh năm{' '}
                {A_NAM.birthLabel.slice(-4)} có tuổi <strong>{A_NAM.age}</strong>. Bản{' '}
                {A_NAM.genderLabel.toLowerCase()} đang ở chặng <strong>{curOf(A_NAM)}</strong>;
                bản {A_NU.genderLabel.toLowerCase()} đang ở chặng{' '}
                <strong>{curOf(A_NU)}</strong>. Cùng một ngày giờ sinh, cùng một tuổi, mà hai
                chặng khác nhau cả về mốc lẫn về nhãn — chỉ vì một dữ kiện: giới tính.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Ví dụ 2 — khi tuổi khởi vận rơi hẳn ngoài khoảng của Cục
              </h3>
              <p>
                Ví dụ thứ hai để thấy rõ hai hệ không thể trùng mốc. Người sinh{' '}
                <strong>{B_NAM.birthLabel}</strong> lúc <strong>{B_NAM.hourLabel}</strong>, trụ
                năm {B_NAM.yearPillar} (can {B_NAM.yearYang ? 'dương' : 'âm'}), trụ tháng{' '}
                {B_NAM.monthPillar}:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Bản <strong>{B_NAM.genderLabel.toLowerCase()}</strong> đi {dirOf(B_NAM)}, khởi
                  vận <strong>{B_NAM.startAge} tuổi</strong>; ở tuổi {B_NAM.age} đang ở chặng{' '}
                  {curOf(B_NAM)}.
                </li>
                <li>
                  Bản <strong>{B_NU.genderLabel.toLowerCase()}</strong> đi {dirOf(B_NU)}, khởi
                  vận <strong>{B_NU.startAge} tuổi</strong>; ở tuổi {B_NU.age} đang ở chặng{' '}
                  {curOf(B_NU)}.
                </li>
              </ul>
              <p>
                Hai con số khởi vận đó — <strong>{B_NAM.startAge}</strong> và{' '}
                <strong>{B_NU.startAge}</strong> — đều không nằm trong khoảng 2 đến 6 mà Cục
                cho phép. Nói cách khác, với chính người này, bộ mốc Tử Vi{' '}
                <strong>chắc chắn không thể trùng</strong> bộ mốc Bát Tự ngay từ chặng đầu
                tiên. Đó là lý do câu "tôi sắp hết vận" luôn thiếu một vế: hết vận theo hệ nào.
              </p>
              <p className="text-sm text-foreground/70">
                Cả hai ví dụ là output của <code>calculateBazi()</code> trong{' '}
                <code>lib/bazi.ts</code>, tính lại mỗi lần trang được dựng — không có con số
                nào gõ tay. Engine dựng {N_CHANG} chặng cho mỗi lá số, mỗi chặng {SPAN} năm.
                Phần mốc đại vận theo Tử Vi cần lá số thật nên bài không in sẵn; công cụ{' '}
                <Link
                  href="/dai-van-hien-tai"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  đại vận hiện tại
                </Link>{' '}
                tính phần đó cho bạn.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: cái gì là quy ước, cái gì là thời gian thật',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>Phần này quan trọng ngang phần cách tính, nên nói thẳng.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Chia đời người thành chặng mười năm là quy ước, không phải quy
                  luật.</strong>{' '}
                  Không có phép đo nào cho thấy đời người đổi nhịp đúng mỗi mười năm. Mười năm
                  là <em>đơn vị đếm</em> của hệ. Bằng chứng gọn nhất nằm ngay trong bài này:
                  nếu ranh giới mười năm là quy luật thì Tử Vi và Bát Tự đã phải chỉ vào cùng
                  một mốc trên cùng một người — thực tế chúng không.
                </li>
                <li>
                  <strong>Ranh giới sắc nét trên bảng, không sắc nét ngoài đời.</strong> Bảng
                  tra ghi một con số tuổi rất dứt khoát, nhưng đời không có công tắc bật tắt ở
                  đúng sinh nhật đó. Riêng chuyện chuyển giao giữa hai chặng còn là một chủ đề
                  tính toán riêng, đủ để thấy mốc trên bảng không phải một lằn ranh vật lý.
                </li>
                <li>
                  <strong>Một chặng bị gọi là xấu KHÔNG có nghĩa mười năm xui.</strong> Cách
                  đọc có cơ sở: chặng rơi vào một cung khó nghĩa là giai đoạn đó cuộc sống ưu
                  tiên bài học của cung ấy — chặng rơi vào cung sức khoẻ là lời nhắc đầu tư cho
                  sức khoẻ. Đó là trọng tâm cần chú ý, không phải bản án mười năm.
                </li>
                <li>
                  <strong>Đừng hoãn quyết định lớn để chờ hết vận.</strong> Nói thẳng vì đây là
                  ngộ nhận tốn kém nhất của cả chủ đề: hoãn cưới, hoãn đổi việc, hoãn mở quán,
                  tệ nhất là hoãn đi khám — để chờ qua một chặng. Mười năm là thời gian thật và
                  không lấy lại được; ranh giới của chặng thì phụ thuộc hệ nào đang được tra.
                  Có triệu chứng thì đi bác sĩ. Có hợp đồng thì đọc kỹ và hỏi luật sư. Đại vận
                  không có thẩm quyền với những việc đó.
                </li>
                <li>
                  <strong>Đầu vào rất thô.</strong> Cả bộ chặng dựng từ đúng ba dữ kiện: ngày
                  sinh, giờ sinh, giới tính. Hai người sinh cùng lúc, cùng giới nhận bộ chặng y
                  hệt nhau — dù hoàn cảnh, sức khoẻ và lựa chọn của họ khác nhau hoàn toàn.
                </li>
                <li>
                  <strong>Sai giờ sinh là lệch kết quả.</strong> Giờ sinh quyết định cung Mệnh
                  và Cục bên Tử Vi, và đổi khoảng cách tới mốc tiết khí bên Bát Tự. Nếu chỉ nhớ
                  áng chừng, hãy coi bộ chặng đọc ra là <em>một khả năng</em>, không phải kết
                  luận.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh gói trong một câu: đại vận hợp để{' '}
                <strong>đặt trọng tâm cho một quãng dài</strong> — mười năm này ưu tiên nghề
                hay ưu tiên sức khoẻ — chứ không hợp để phán thành bại, và càng không hợp để
                trì hoãn.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <DaiVanWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <DaiVanRecall />,
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
                Muốn biết chặng mười năm hiện tại của chính mình?{' '}
                <Link
                  href="/dai-van-hien-tai"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Tra đại vận hiện tại miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/dai-van-hien-tai', label: 'Đại vận hiện tại' },
                    { href: '/timeline', label: 'Timeline đại vận' },
                    { href: '/tinh-menh-cuc', label: 'Tính Mệnh Cục' },
                    { href: '/bat-tu', label: 'Bát Tự Tứ Trụ' },
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
          children: <DaiVanChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

/**
 * Bài học /learn/menh-cuc — "Cục của lá số Tử Vi".
 *
 * GROUNDING — không gõ tay bảng nào. Can chi, nạp âm, hành, Cục và mọi con số
 * trên trang đều SUY TẠI RUNTIME từ bảng nạp âm của chính site: lib/sinh-con.ts
 * → yearProfile(year) trả { canChi, napAmName, element } của một NĂM ÂM LỊCH,
 * gọi cho trọn 60 năm 1984–2043 (1984 = Giáp Tý) là có ảnh đầy đủ của 60 cặp can
 * chi + 30 nạp âm; lib/dat-ten-ngu-hanh.ts → ELEMENTS cho tên 5 hành. Từ đó
 * trang tự dựng 10 Thiên Can, 12 Địa Chi, bảng Ngũ Hổ Độn và phép suy Cục cho
 * từng ví dụ (deriveCuc).
 *
 * NGUỒN CHO CÁC KHẲNG ĐỊNH VỀ CỤC (đều trong repo):
 *   • app/tinh-menh-cuc/form.tsx — 5 Cục Thủy nhị / Mộc tam / Kim tứ / Thổ ngũ /
 *     Hỏa lục; "Cục xác định từ can năm sinh kết hợp vị trí cung Mệnh"; con số
 *     của Cục là tuổi bắt đầu đại vận (2/3/4/5/6); Cục quyết định nhịp an sao Tử
 *     Vi; không nhớ giờ sinh thì dùng 12:00 và độ chính xác thấp hơn; âm dương
 *     can năm + giới tính quyết định chiều đại vận.
 *   • app/methodology/tu-vi/page.tsx — Cục xác định qua thiên can năm sinh kết
 *     hợp cung Mệnh theo bảng nạp âm Lục Thập Hoa Giáp; sao Tử Vi an theo "Cục +
 *     ngày âm" (ngày sinh chia Cục số, thương quyết định vị trí); 13 chính tinh
 *     còn lại an theo bảng cố định quanh Tử Vi; các trường phái còn khác nhau ở
 *     cách tính Cục và cách phối Cục với Mệnh.
 *   • app/learn/tu-vi/page.tsx — không phán mệnh tốt xấu từ Cục.
 *   • lib/tuvi-client.ts — fiveElementsClass là trường Cục engine trả về;
 *     TuViPalace.decadal.range là khoảng tuổi đại vận.
 *
 * KIỂM CHỨNG BẰNG ENGINE THẬT (POST /tools/tuvi-v2, 2026-08-01): 60/60 lá số
 * ngẫu nhiên 1930–2025 có nạp âm can chi CUNG MỆNH khớp fiveElementsClass;
 * 300/300 cung khớp Ngũ Hổ Độn; 15/15 cặp nam–nữ cùng ngày giờ ra cùng Cục và
 * cùng tuổi khởi; decadal.range của cung Mệnh luôn = [Cục số, Cục số + 9]. Ba ví
 * dụ trong bài là output engine đã kiểm; ví dụ 15/05/1990 giờ Tỵ trùng fixture
 * lib/backtest/__fixtures__/chart-1990-05-15-y2015.json (Hỏa Lục Cục, Mệnh tại
 * Tý, đại vận đầu 6–15).
 *
 * PHẠM VI: nạp âm và mệnh ngũ hành năm sinh chỉ nhắc để PHÂN BIỆT rồi link
 * /learn/nap-am; 12 cung và chính tinh thuộc /learn/tu-vi; quy trình lập lá số
 * thuộc /learn/lap-la-so. Giọng: Cục là QUY ƯỚC KỸ THUẬT — không phải phép đo,
 * không phán mệnh tốt xấu, không dự đoán tương lai.
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
import { yearProfile, type YearProfile } from '@/lib/sinh-con';
import { ELEMENTS, type Element } from '@/lib/dat-ten-ngu-hanh';
import {
  MenhCucFrame,
  MenhCucDepth,
  MenhCucRecall,
  MenhCucChecklist,
  MenhCucWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Cục trong Tử Vi là gì — Mệnh khác Cục',
  description:
    'Cục của lá số Tử Vi: Thủy nhị, Mộc tam, Kim tứ, Thổ ngũ, Hỏa lục. Cục suy từ nạp âm can chi cung Mệnh — khác mệnh ngũ hành năm sinh, và là chìa khoá an sao.',
  alternates: { canonical: 'https://hieu.asia/learn/menh-cuc' },
};

// --- Bảng Lục Thập Hoa Giáp lấy THẲNG từ engine nạp âm của site --------------
// 1984 = Giáp Tý (đầu vòng 60) nên 60 năm liên tiếp phủ trọn 60 cặp can chi.
const CYCLE_START = 1984;

const SEXAGENARY: YearProfile[] = (() => {
  const out: YearProfile[] = [];
  for (let y = CYCLE_START; y < CYCLE_START + 60; y += 1) {
    const p = yearProfile(y);
    if (p) out.push(p);
  }
  return out;
})();

const stemPart = (canChi: string) => canChi.split(' ')[0] ?? '';
const branchPart = (canChi: string) => canChi.split(' ')[1] ?? '';

/** 10 Thiên Can và 12 Địa Chi, đúng thứ tự — suy từ những năm đầu của vòng 60. */
const STEMS: string[] = SEXAGENARY.slice(0, 10).map((p) => stemPart(p.canChi));
const BRANCHES: string[] = SEXAGENARY.slice(0, 12).map((p) => branchPart(p.canChi));

/** "Can Chi" → hồ sơ nạp âm (tên + hành) cho cả 60 cặp. */
const NAP_AM_BY_PILLAR: ReadonlyMap<string, YearProfile> = new Map(
  SEXAGENARY.map((p) => [p.canChi, p]),
);

// --- 5 Cục -------------------------------------------------------------------
// Con số gắn cứng với hành (nguồn: /tinh-menh-cuc và /methodology/tu-vi); tên Cục
// ghép lại đúng chuỗi engine trả về ở TuViChartMeta.fiveElementsClass.
const CUC_SO: Record<Element, number> = { thuy: 2, moc: 3, kim: 4, tho: 5, hoa: 6 };
const SO_HAN_VIET: Record<number, string> = { 2: 'Nhị', 3: 'Tam', 4: 'Tứ', 5: 'Ngũ', 6: 'Lục' };

interface Cuc { element: Element; hanh: string; so: number; name: string }

function cucOf(element: Element): Cuc {
  const so = CUC_SO[element];
  const hanh = ELEMENTS[element].name;
  return { element, hanh, so, name: `${hanh} ${SO_HAN_VIET[so] ?? ''} Cục` };
}

/** 5 Cục xếp theo Cục số tăng dần. */
const FIVE_CUC: Cuc[] = (Object.keys(CUC_SO) as Element[]).map(cucOf).sort((a, b) => a.so - b.so);
const CUC_MIN = FIVE_CUC[0];
const CUC_MAX = FIVE_CUC[FIVE_CUC.length - 1];

/** Ngũ Hổ Độn — can cung Dần suy từ can năm sinh: can(Dần) = (2·can(năm) + 2) mod 10. */
function stemOfDan(yearStem: string): string {
  const i = STEMS.indexOf(yearStem);
  return i < 0 ? '' : (STEMS[(2 * i + 2) % 10] ?? '');
}

/** Can của cung có địa chi `branch`: khởi từ cung Dần rồi đếm tiến theo vòng địa chi. */
function stemOfPalace(yearStem: string, branch: string): string {
  const iDan = STEMS.indexOf(stemOfDan(yearStem));
  const iBranch = BRANCHES.indexOf(branch);
  const iDanBranch = BRANCHES.indexOf('Dần');
  if (iDan < 0 || iBranch < 0 || iDanBranch < 0) return '';
  return STEMS[(iDan + ((((iBranch - iDanBranch) % 12) + 12) % 12)) % 10] ?? '';
}

/** Bảng Ngũ Hổ Độn gộp cặp: can năm i và i+5 luôn cho cùng can cung Dần. */
const NGU_HO_DON = STEMS.slice(0, 5).map((s, i) => ({
  yearStems: [s, STEMS[i + 5] ?? ''],
  danStem: stemOfDan(s),
}));

/** Cả chuỗi suy Cục: can năm + chi cung Mệnh → can chi cung Mệnh → nạp âm → Cục. */
function deriveCuc(yearPillar: string, menhBranch: string) {
  const stem = stemOfPalace(stemPart(yearPillar), menhBranch);
  const menhPillar = stem ? `${stem} ${menhBranch}` : '';
  const profile = NAP_AM_BY_PILLAR.get(menhPillar);
  return {
    menhPillar,
    napAm: profile?.napAmName ?? '',
    cuc: profile ? cucOf(profile.element) : null,
  };
}

// Ví dụ tính tay. CHỈ `yearPillar` và `menhBranch` là dữ kiện lá số thật; mọi cột
// còn lại do trang tự suy bằng deriveCuc(). Hai ví dụ đầu cùng ngày, khác giờ.
const EXAMPLES = [
  { solar: '15/05/1990', hour: '09:00–11:00 (giờ Tỵ)', gender: 'Nam', yearPillar: 'Canh Ngọ', menhBranch: 'Tý' },
  { solar: '15/05/1990', hour: '15:00–17:00 (giờ Thân)', gender: 'Nam', yearPillar: 'Canh Ngọ', menhBranch: 'Dậu' },
  { solar: '20/01/2000', hour: '07:00–09:00 (giờ Thìn)', gender: 'Nữ', yearPillar: 'Kỷ Mão', menhBranch: 'Dậu' },
];

/** So sánh Mệnh (nạp âm năm sinh) với Cục — [khía cạnh, phía Mệnh, phía Cục]. */
const MENH_VS_CUC: [string, string, string][] = [
  ['Suy từ đâu', 'Nạp âm của can chi NĂM SINH âm lịch', 'Nạp âm của can chi CUNG MỆNH trên lá số'],
  ['Cần dữ kiện gì', 'Chỉ cần năm sinh âm lịch', 'Cần cả ngày và giờ sinh, vì phải an được cung Mệnh trước'],
  ['Có bao nhiêu giá trị', '30 tên nạp âm, quy về 5 hành', 'Đúng 5 giá trị, mỗi giá trị kèm một con số từ 2 đến 6'],
  ['Dùng để làm gì', 'Tra cứu theo phong tục: màu hợp, đặt tên, đối chiếu tuổi', 'Định vị trí khởi sao Tử Vi và tuổi khởi đại vận đầu tiên'],
  ['Ai trùng giá trị với bạn', 'Mọi người sinh cùng năm âm lịch', 'Chỉ người có can chi cung Mệnh cùng nạp âm — hai người cùng năm sinh vẫn thường khác nhau'],
  ['Giới tính có ảnh hưởng không', 'Không', 'Không — giới tính chỉ đổi chiều chạy của đại vận, không đổi Cục'],
  ['Đọc thế nào cho đúng', 'Một nhãn theo quy ước dân gian, để tham khảo', 'Một thông số kỹ thuật của lá số, không phải thang điểm mạnh yếu'],
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) → chữ schema
// === chữ hiển thị. Câu hỏi cố ý KHÁC bộ FAQ trên trang công cụ /tinh-menh-cuc
// (ở đó hỏi về cung Mệnh, cung Thân, âm dương thuận nghịch, lá số đầy đủ).
const FAQS = [
  {
    q: 'Mệnh ngũ hành và Cục có phải là một không?',
    a: 'Không. Đây là hai đại lượng khác nhau, chỉ giống nhau ở chỗ cùng tra bảng nạp âm Lục Thập Hoa Giáp. Mệnh ngũ hành tra nạp âm của can chi NĂM SINH, nên mọi người sinh cùng năm âm lịch đều giống nhau. Cục tra nạp âm của can chi CUNG MỆNH trên lá số, mà cung Mệnh lại phụ thuộc tháng và giờ sinh, nên hai người cùng năm sinh vẫn thường ra hai Cục khác nhau. Mệnh Thổ mà Cục Hỏa là chuyện bình thường, không phải công cụ tính sai.',
  },
  {
    q: 'Cục lấy nạp âm của năm sinh hay của cung Mệnh?',
    a: 'Của cung Mệnh. Cách suy gồm hai nhịp: địa chi của cung Mệnh do tháng âm lịch và giờ sinh quyết định, còn thiên can của cung Mệnh suy ra từ thiên can năm sinh. Ghép hai thứ đó thành một cặp can chi mới, tra bảng nạp âm ra một hành, và hành đó chính là Cục. Vì vậy không tồn tại bảng tra kiểu "sinh năm nào thì Cục nào" — thiếu giờ sinh là thiếu đúng thứ tạo ra khác biệt giữa hai người cùng tuổi.',
  },
  {
    q: 'Con số 2, 3, 4, 5, 6 trong tên Cục nghĩa là gì?',
    a: 'Con số đó có đúng hai công dụng kỹ thuật. Thứ nhất, nó là số dùng để chia ngày sinh âm lịch khi an sao Tử Vi lên vòng 12 cung. Thứ hai, nó chính là tuổi bắt đầu đại vận đầu tiên: Thủy Nhị Cục khởi vận quanh 2 tuổi, Hỏa Lục Cục quanh 6 tuổi, mỗi đại vận sau đó kéo dài 10 năm. Con số gắn cứng với hành, nên nghe tên là biết số và nghe số là biết hành.',
  },
  {
    q: 'Hỏa Lục Cục có mạnh hơn Thủy Nhị Cục không?',
    a: 'Không. Con số của Cục không phải thang điểm và không xếp hạng bất cứ thứ gì — nó chỉ là nhịp kỹ thuật để đặt sao và để biết đại vận đầu tiên khởi từ mấy tuổi. Cả năm Cục đều bình đẳng. Cục thuộc lớp khung của lá số, cùng cấp với cung Mệnh và cung Thân, nên tự nó không mang nội dung luận giải nào về giàu nghèo hay thành bại.',
  },
  {
    q: 'Vì sao hai người sinh cùng ngày lại có thể khác Cục?',
    a: 'Vì khác giờ sinh. Cung Mệnh được an từ tháng âm lịch và giờ sinh, nên đổi giờ là đổi ô cung Mệnh, đổi ô là đổi cặp can chi của cung đó, đổi cặp can chi là đổi nạp âm và cuối chuỗi là đổi Cục. Với cùng một ngày 15/05/1990, chỉ cần đổi giờ sinh là kết quả chạy qua đủ cả năm Cục — Kim Tứ Cục ở giờ Tý, Thổ Ngũ Cục ở giờ Dần, Hỏa Lục Cục ở giờ Tỵ, Thủy Nhị Cục ở giờ Thân và Mộc Tam Cục ở giờ Tuất.',
  },
  {
    q: 'Nam và nữ sinh cùng ngày cùng giờ có cùng Cục không?',
    a: 'Có, hoàn toàn giống nhau: cùng cung Mệnh, cùng Cục và cùng tuổi khởi đại vận. Giới tính không tham gia vào phép suy Cục. Công cụ hỏi giới tính vì một lý do khác: nó kết hợp với âm dương của thiên can năm sinh để quyết định CHIỀU chạy của chuỗi đại vận — dương nam và âm nữ đi thuận, âm nam và dương nữ đi nghịch. Cùng điểm khởi, khác chiều đi.',
  },
  {
    q: 'Vì sao thiếu Cục thì không an được sao Tử Vi?',
    a: 'Vì sao Tử Vi là sao gốc của cả lá số và nó được an theo Cục cùng ngày sinh âm lịch: số ngày sinh chia cho Cục số, thương quyết định vị trí đặt Tử Vi trên vòng 12 cung. Sau khi Tử Vi có chỗ đứng, 13 chính tinh còn lại mới an theo bảng cố định quanh nó. Không có Cục là không có số chia, tức không có điểm khởi, và cả lá số không dựng lên được.',
  },
  {
    q: 'Không nhớ giờ sinh thì tra Cục có đáng tin không?',
    a: 'Độ tin cậy thấp hơn rõ rệt, nên coi kết quả là tạm. Công cụ Tính Mệnh Cục cho phép đánh dấu "không nhớ giờ sinh" rồi dùng 12:00 làm mặc định, đồng thời báo rõ rằng cung Mệnh có thể đổi nếu giờ thật lệch đi. Vì Cục bám vào cung Mệnh nên nó lệch theo. Cách xử lý lành mạnh là hỏi lại giấy tờ hoặc người thân, hoặc tra thử vài khung giờ để xem kết luận có đổi không.',
  },
  {
    q: 'Cục có thay đổi theo thời gian không?',
    a: 'Không. Cục chỉ phụ thuộc dữ kiện lúc sinh — năm, tháng, ngày và giờ sinh — nên nó cố định suốt đời, giống cung Mệnh. Thứ thay đổi theo thời gian là các lớp phía trên: đại vận đổi mỗi 10 năm, lưu niên đổi mỗi năm. Cục chỉ nói đại vận đầu tiên khởi từ mấy tuổi, rồi đứng yên.',
  },
];

const JSONLD = [
  article({
    headline: 'Cục trong Tử Vi: 5 cục, con số 2–6 và vì sao Mệnh khác Cục',
    description:
      'Cục của lá số Tử Vi suy từ nạp âm can chi cung Mệnh: 5 giá trị Thủy nhị đến Hỏa lục, con số là nhịp an sao Tử Vi và tuổi khởi đại vận đầu tiên.',
    url: '/learn/menh-cuc',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Mệnh & Cục', url: '/learn/menh-cuc' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Cục trong Tử Vi — Mệnh và Cục khác nhau thế nào',
    description:
      'Cục của lá số Tử Vi: Thủy nhị, Mộc tam, Kim tứ, Thổ ngũ, Hỏa lục. Cục suy từ nạp âm can chi cung Mệnh — khác mệnh ngũ hành năm sinh, và là chìa khoá an sao.',
    url: '/learn/menh-cuc',
  }),
];

const TD = 'px-4 py-2 text-muted-foreground';
const A = 'text-gold-700 underline-offset-4 hover:underline';

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-border bg-card/60">
        {cols.map((c) => (
          <th key={c} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Scroller({ minWidth, children }: { minWidth: string; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className={`w-full ${minWidth} text-left text-sm`}>{children}</table>
    </div>
  );
}

export default function LearnMenhCucPage() {
  return (
    <LearnArticle
      eyebrow="TỬ VI · NỀN LÁ SỐ"
      title={
        <>
          Cục{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (ngũ hành cục của lá số)
          </span>
        </>
      }
      standfirst={
        <>
          Tra lá số xong, ai cũng nhận được một dòng kiểu “Cục: Hỏa Lục Cục” — rồi không ai giải
          thích con số ấy ở đâu ra. Đây là mắt xích ít được nói tới nhất của Tử Vi, dù thiếu nó thì
          không đặt được một sao nào. Bài này đi hết chuỗi suy ra Cục, và tách bạch nó khỏi câu “tôi
          mệnh Kim” quen thuộc.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Mệnh & Cục' },
      ]}
      relatedLenses={relatedLearnLenses('menh-cuc')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày và giờ sinh, công cụ trả về cung Mệnh, cung Thân và Cục của bạn — đúng con số mà bài này giải thích, kèm gợi ý ngũ hành để tham khảo.',
        href: '/tinh-menh-cuc',
        label: 'Tra Cục theo ngày giờ sinh',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <MenhCucFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Mệnh và Cục là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Khi nói chuyện lá số, ba khái niệm sau rất hay bị gộp làm một, dù chúng nằm ở ba chỗ
                khác nhau:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Cung Mệnh</strong> — một trong 12 ô trên lá số, ô gốc mô tả bản chất. Vị
                  trí của nó do tháng âm lịch và giờ sinh quyết định. Bài{' '}
                  <Link href="/learn/tu-vi" className={A}>Tử Vi Đẩu Số</Link> sở hữu phần 12 cung.
                </li>
                <li>
                  <strong>Mệnh ngũ hành</strong> — câu quen thuộc “tôi mệnh Kim”, “nhà mình mệnh
                  Thổ”. Nó là hành của <em>nạp âm năm sinh</em>, chỉ cần biết năm âm lịch là tra
                  được. Bài{' '}
                  <Link href="/learn/nap-am" className={A}>Nạp âm</Link> sở hữu phần này.
                </li>
                <li>
                  <strong>Cục</strong> — thứ mà bài này nói tới. Đây là{' '}
                  <strong>ngũ hành cục của riêng lá số</strong>, gồm một hành cộng một con số. Chỉ có
                  đúng năm giá trị: {FIVE_CUC.map((c) => c.name).join(', ')}.
                </li>
              </ul>
              <p>
                Cục sinh ra để phục vụ hai việc rất cụ thể trong kỹ thuật lập lá số:{' '}
                <strong>xác định chỗ đặt sao Tử Vi</strong> và{' '}
                <strong>xác định tuổi khởi đại vận đầu tiên</strong>. Nó là mắt xích nối phần “tĩnh”
                của lá số với phần vận động theo thời gian.
              </p>
              <p>Cần chốt ngay ba điều Cục KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Cục <strong>không phải mệnh ngũ hành của năm sinh</strong>. Hai thứ dùng chung một
                  bảng nạp âm nhưng tra cho hai cặp can chi khác nhau, nên trùng hành chỉ là ngẫu
                  nhiên.
                </li>
                <li>
                  Cục <strong>không phải thang điểm</strong>. Con số {CUC_MIN?.so} đến {CUC_MAX?.so}{' '}
                  không xếp hạng mạnh yếu, và không có “Cục tốt” hay “Cục xấu”.
                </li>
                <li>
                  Cục <strong>không phải lời phán</strong>. Nó thuộc lớp khung, tức phần tính toán
                  thuần tuý — mọi câu chuyện về tính cách hay vận số đều nằm ở lớp diễn giải phía
                  sau, và phải được gọi đúng tên là diễn giải.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <MenhCucDepth />,
        },
        {
          id: 'menh-khac-cuc',
          tocLabel: 'Mệnh khác Cục',
          heading: 'Mệnh và Cục: giống một chữ, khác toàn bộ phần còn lại',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là chỗ nhầm tốn thời gian nhất khi mới đọc lá số. Người ta thấy cả hai đều là
                “một hành trong ngũ hành”, thấy cả hai đều tra bảng nạp âm, rồi kết luận chúng là một
                — sau đó hoang mang khi công cụ báo “mệnh Thổ, Cục Hỏa”.
              </p>
              <p>
                Điểm khác biệt gốc chỉ nằm ở một câu:{' '}
                <strong>hai bên tra nạp âm cho hai cặp can chi khác nhau</strong>. Mọi khác biệt còn
                lại đều là hệ quả của câu đó.
              </p>
              <Scroller minWidth="min-w-[620px]">
                <TableHead
                  cols={['Khía cạnh', 'Mệnh ngũ hành (nạp âm năm sinh)', 'Cục (của lá số)']}
                />
                <tbody>
                  {MENH_VS_CUC.map(([aspect, menh, cuc]) => (
                    <tr key={aspect} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {aspect}
                      </th>
                      <td className={TD}>{menh}</td>
                      <td className={TD}>{cuc}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Một ví dụ để thấy ngay: người sinh năm <strong>Canh Ngọ</strong> có mệnh nạp âm là Lộ
                Bàng Thổ, tức “mệnh Thổ”. Nhưng nếu cung Mệnh của người đó đóng tại Tý thì cặp can
                chi của cung Mệnh là <strong>Mậu Tý</strong>, nạp âm Tích Lịch Hỏa, và Cục là{' '}
                <strong>Hỏa Lục Cục</strong>. Mệnh Thổ, Cục Hỏa — cả hai cùng đúng.
              </p>
              <p className="text-sm text-foreground/70">
                Hệ quả thực dụng: <strong>không thể suy Cục từ năm sinh</strong>. Nếu ai đưa bạn một
                bảng “sinh năm nào thì Cục nào”, bảng đó đã bỏ mất giờ sinh — tức bỏ đúng thứ làm nên
                khác biệt giữa hai người cùng tuổi.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-cuc',
          tocLabel: '5 Cục & con số',
          heading: 'Năm Cục và ý nghĩa con số đi kèm',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Danh sách đóng, không có giá trị thứ sáu. Mỗi hành gắn cứng với một con số, nên nghe
                tên là biết số và nghe số là biết hành — không tồn tại thứ như “Hỏa Ngũ Cục”.
              </p>
              <Scroller minWidth="min-w-[520px]">
                <TableHead cols={['Tên Cục', 'Hành', 'Cục số', 'Đại vận đầu tiên']} />
                <tbody>
                  {FIVE_CUC.map((c) => (
                    <tr key={c.element} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 font-medium text-foreground">{c.name}</td>
                      <td className={TD}>{c.hanh}</td>
                      <td className="px-4 py-2 tabular-nums text-foreground">{c.so}</td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {c.so}–{c.so + 9} tuổi
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>

              <h3 className="text-lg font-semibold text-foreground">Con số ấy nghĩa là gì</h3>
              <p>Đúng hai việc, không hơn:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Là số chia khi an sao Tử Vi.</strong> Ngày sinh âm lịch được chia cho Cục
                  số, và thương quyết định vị trí đặt sao Tử Vi trên vòng 12 cung. Người{' '}
                  {CUC_MIN?.name} chia cho {CUC_MIN?.so}, người {CUC_MAX?.name} chia cho{' '}
                  {CUC_MAX?.so}.
                </li>
                <li>
                  <strong>Là tuổi khởi đại vận đầu tiên.</strong> Cục số bao nhiêu thì đại vận đầu
                  bắt đầu quanh tuổi đó, và mỗi đại vận kéo dài 10 năm — vì vậy cột cuối của bảng
                  trên luôn là “Cục số đến Cục số cộng 9”.
                </li>
              </ol>
              <p className="text-sm text-foreground/70">
                Chú ý cách đọc: chênh lệch giữa {CUC_MIN?.name} và {CUC_MAX?.name} chỉ là{' '}
                <strong>{(CUC_MAX?.so ?? 0) - (CUC_MIN?.so ?? 0)} năm ở đoạn đầu đời</strong> — quãng
                mà phần lớn chúng ta còn chưa đi học. Đó là toàn bộ ý nghĩa của việc “khởi vận sớm
                hay muộn”, chứ không phải ai hơn ai.
              </p>
              <p className="text-sm text-foreground/70">
                Tuổi khởi vận là một chuyện, chiều chạy của chuỗi đại vận lại là chuyện khác: thuận
                hay nghịch do âm dương của can năm sinh kết hợp giới tính quyết định. Muốn xem mình
                đang ở đại vận nào, dùng{' '}
                <Link href="/dai-van-hien-tai" className={A}>công cụ Đại vận hiện tại</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'cach-suy-cuc',
          tocLabel: 'Cách suy ra Cục',
          heading: 'Cách suy ra Cục: bốn bước, có thể tự làm bằng bút',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">Bước 1 — Lấy can chi năm âm</h3>
              <p>
                Cần đúng <strong>năm âm lịch</strong>, không phải năm dương. Người sinh tháng 1 hoặc
                đầu tháng 2 dương lịch, tức trước Tết, vẫn thuộc năm âm liền trước. Tra nhanh ở{' '}
                <Link href="/tra-cuu-tuoi" className={A}>công cụ tra cứu tuổi</Link> hoặc bảng{' '}
                <Link href="/luc-thap-hoa-giap" className={A}>Lục Thập Hoa Giáp</Link>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — An cung Mệnh để lấy địa chi của nó
              </h3>
              <p>
                Cung Mệnh được an từ <strong>tháng âm lịch và giờ sinh</strong>, đếm trên vòng 12 địa
                chi. Bước này thuộc quy trình lập lá số nên bài{' '}
                <Link href="/learn/lap-la-so" className={A}>quy trình lập lá số</Link> trình bày chi tiết. Ở
                đây bạn chỉ cần kết quả của nó:{' '}
                <strong>cung Mệnh đóng ở địa chi nào</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Bước 3 — Gán can cho cung Mệnh</h3>
              <p>
                Mỗi cung trên lá số có một thiên can riêng, và cả 12 can ấy được suy ra từ{' '}
                <strong>can năm sinh</strong>. Quy tắc khởi đầu gọi là Ngũ Hổ Độn: can năm sinh quyết
                định can của cung Dần, sau đó cứ đi tiếp theo vòng địa chi thì can cũng đi tiếp theo
                vòng thiên can.
              </p>
              <Scroller minWidth="min-w-[360px]">
                <TableHead cols={['Can năm sinh', 'Cung Dần mang can']} />
                <tbody>
                  {NGU_HO_DON.map((row) => (
                    <tr key={row.danStem} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 font-medium text-foreground">
                        {row.yearStems.join(' hoặc ')}
                      </td>
                      <td className={TD}>{row.danStem} Dần</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Ví dụ năm Canh Ngọ: cung Dần mang can {stemOfDan('Canh')}. Đếm tiếp Mão, Thìn, Tỵ…
                theo vòng thiên can, tới Tý thì cặp can chi của cung đó là{' '}
                <strong>{deriveCuc('Canh Ngọ', 'Tý').menhPillar}</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 4 — Tra nạp âm của cặp can chi vừa có, ra hành, ra Cục
              </h3>
              <p>
                Ghép can ở bước 3 với chi ở bước 2 thành một cặp can chi, tra bảng nạp âm Lục Thập
                Hoa Giáp để ra một hành, rồi đối chiếu bảng 5 Cục ở mục trên. Mậu Tý có nạp âm{' '}
                {deriveCuc('Canh Ngọ', 'Tý').napAm}, hành {deriveCuc('Canh Ngọ', 'Tý').cuc?.hanh},
                nên Cục là <strong>{deriveCuc('Canh Ngọ', 'Tý').cuc?.name}</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Ba ví dụ tính tay</h3>
              <p>
                Cột năm âm và cột cung Mệnh là dữ kiện lấy từ lá số thật; các cột sau được trang này
                suy lại theo đúng bốn bước trên. Hai ví dụ đầu <strong>cùng một ngày sinh</strong>,
                chỉ khác giờ.
              </p>
              <Scroller minWidth="min-w-[720px]">
                <TableHead
                  cols={[
                    'Ngày sinh dương',
                    'Giờ sinh',
                    'Năm âm',
                    'Cung Mệnh',
                    'Nạp âm',
                    'Cục',
                    'Đại vận đầu',
                  ]}
                />
                <tbody>
                  {EXAMPLES.map((ex) => {
                    const d = deriveCuc(ex.yearPillar, ex.menhBranch);
                    return (
                      <tr
                        key={`${ex.solar}-${ex.hour}`}
                        className="border-b border-border/60 last:border-b-0"
                      >
                        <td className="px-4 py-2 tabular-nums text-muted-foreground">{ex.solar}</td>
                        <td className={TD}>{ex.hour}</td>
                        <td className={TD}>{ex.yearPillar}</td>
                        <td className="px-4 py-2 text-foreground">{d.menhPillar}</td>
                        <td className={TD}>{d.napAm}</td>
                        <td className="px-4 py-2 font-medium text-foreground">{d.cuc?.name}</td>
                        <td className="px-4 py-2 tabular-nums text-muted-foreground">
                          {d.cuc ? `${d.cuc.so}–${d.cuc.so + 9} tuổi` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Scroller>
              <ul className="list-disc space-y-2 pl-5">
                {EXAMPLES.map((ex) => {
                  const d = deriveCuc(ex.yearPillar, ex.menhBranch);
                  return (
                    <li key={`note-${ex.solar}-${ex.hour}`}>
                      <strong>
                        {ex.gender}, sinh {ex.solar}, {ex.hour}:
                      </strong>{' '}
                      năm âm {ex.yearPillar} nên cung Dần mang can{' '}
                      {stemOfDan(stemPart(ex.yearPillar))}; cung Mệnh đóng tại {ex.menhBranch} nên
                      cặp can chi là {d.menhPillar}; nạp âm {d.napAm} thuộc hành {d.cuc?.hanh}, ra{' '}
                      <strong>{d.cuc?.name}</strong>, đại vận đầu tiên khởi quanh {d.cuc?.so} tuổi.
                    </li>
                  );
                })}
              </ul>
              <p className="text-sm text-foreground/70">
                Hai ví dụ đầu là lời cảnh báo gọn nhất về giờ sinh: cùng ngày 15/05/1990, chỉ dịch
                giờ sinh từ buổi sáng sang buổi chiều là Cục đổi hẳn. Nếu bạn tra tay ra kết quả khác{' '}
                <Link href="/tinh-menh-cuc" className={A}>công cụ Tính Mệnh Cục</Link>, hãy kiểm lại
                bước 2 trước tiên — vị trí cung Mệnh gần như luôn là nguyên nhân.
              </p>
            </div>
          ),
        },
        {
          id: 'vi-sao-can-cuc',
          tocLabel: 'Vì sao bắt buộc có Cục',
          heading: 'Vì sao thiếu Cục thì không an được một sao nào',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Câu trả lời nằm ở chỗ <strong>sao Tử Vi là sao gốc</strong> của cả hệ. Nó không được
                an theo một bảng tra độc lập, mà an theo <strong>Cục cùng ngày sinh âm lịch</strong>:
                số ngày sinh được chia cho Cục số, và thương quyết định vị trí đặt Tử Vi trên vòng 12
                cung.
              </p>
              <p>
                Sau khi Tử Vi có chỗ đứng, 13 chính tinh còn lại mới an theo{' '}
                <strong>bảng cố định quanh Tử Vi</strong> — Thiên Cơ ngay trước Tử Vi, Thái Dương
                cách 2 cung, Vũ Khúc cách 3 cung, và cứ thế. Nghĩa là toàn bộ dàn chính tinh treo vào
                một cái đinh duy nhất, mà cái đinh ấy chỉ đóng được khi đã có Cục.
              </p>
              <p>Xâu chuỗi lại thì thứ tự phụ thuộc rất rõ ràng:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>Ngày và giờ sinh → <strong>vị trí cung Mệnh</strong>.</li>
                <li>
                  Can năm sinh cộng vị trí cung Mệnh → <strong>can chi cung Mệnh</strong> → nạp âm →{' '}
                  <strong>Cục</strong>.
                </li>
                <li>Cục cộng ngày sinh âm lịch → <strong>vị trí sao Tử Vi</strong>.</li>
                <li>
                  Vị trí sao Tử Vi → <strong>13 chính tinh còn lại</strong>, rồi mới tới phụ tinh và
                  Tứ Hoá.
                </li>
              </ol>
              <p>
                Bỏ mắt xích số 2 thì mắt xích số 3 không có số chia, và cả lá số dừng lại ở một vòng
                12 cung trống. Đó là lý do một công cụ tra “cung Mệnh, cung Thân và Cục” không phải
                bản rút gọn cho vui, mà đúng là <strong>bước 1 của việc lập lá số</strong>.
              </p>
              <p>
                Muốn xem đầy đủ các bước tiếp theo, đọc bài{' '}
                <Link href="/learn/lap-la-so" className={A}>quy trình lập lá số</Link> hoặc dựng thẳng một lá
                số ở <Link href="/la-so-tu-vi" className={A}>công cụ lá số Tử Vi</Link>. Toàn bộ công
                thức mà engine của hieu.asia dùng được ghi công khai ở{' '}
                <Link href="/methodology/tu-vi" className={A}>trang phương pháp</Link>.
              </p>
              <p className="text-sm text-foreground/70">
                Bài này cố ý không chép lại bảng tra vị trí sao Tử Vi theo từng ngày sinh: đó là phần
                việc của quy trình lập lá số, và cũng là phần mà mỗi bản in trình bày một kiểu. Điều
                cần nhớ ở đây chỉ là <strong>vì sao</strong> Cục đứng trước và không thể bỏ.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: đây là quy ước của một hệ, không phải phép đo',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cục là một <strong>quy ước nội bộ của hệ Tử Vi</strong>. Nó tồn tại để hệ đó tự vận
                hành được: có điểm khởi để đặt sao, có mốc để chia nhịp thời gian. Ngoài phạm vi ấy,
                nó không đo được gì cả — không có đại lượng nào ngoài đời tương ứng với “Hỏa Lục
                Cục”.
              </p>
              <p>Những giới hạn nên ghi nhớ:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Các trường phái chưa thống nhất.</strong> Cách tính Cục và cách phối Cục
                  với Mệnh vẫn còn khác nhau giữa các nhánh. hieu.asia dùng cách phổ biến nhất — nạp
                  âm của can chi cung Mệnh — và ghi rõ lựa chọn đó ở trang phương pháp, thay vì trình
                  bày như thể chỉ có một cách đúng.
                </li>
                <li>
                  <strong>Không có Cục tốt hay Cục xấu.</strong> Con số không phải điểm, hành không
                  phải hạng. Ai nói bạn “Cục yếu nên phải hoá giải” là đang bán một thứ không có
                  trong phép tính.
                </li>
                <li>
                  <strong>Sai giờ sinh là sai toàn bộ.</strong> Giờ sinh lệch có thể đẩy cung Mệnh
                  sang ô khác, kéo theo Cục khác, và từ đó lá số khác. Không nhớ giờ thì cứ nói rõ là
                  không nhớ, đừng chọn đại một giờ rồi tin chắc vào kết quả.
                </li>
                <li>
                  <strong>“Mệnh hoà với Cục thì thuận” là diễn giải, không phải phép tính.</strong>{' '}
                  Bản thân engine chỉ trả về một chuỗi như “Hỏa Lục Cục”; mọi câu nói về hoà hay khắc
                  đều là lớp luận giải chồng lên sau, nên đọc như gợi ý tham khảo — không phải định
                  mệnh.
                </li>
                <li>
                  <strong>Cục không dự đoán chuyện đời.</strong> Nó không nói bạn hợp nghề gì, năm
                  nay ra sao, nên cưới ai. Những câu hỏi đó cần cả lá số, và ngay cả khi có cả lá số
                  thì câu trả lời vẫn là gợi mở, không thay được lời khuyên y tế, pháp lý hay tài
                  chính.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh nhất: xem Cục như một <strong>dòng thông số</strong> giúp bạn
                hiểu lá số của mình được dựng ra sao — biết rõ đâu là tính toán máy móc, đâu là chỗ
                bắt đầu của diễn giải. Đó cũng là ranh giới mà hieu.asia ghi rõ trong mọi kết quả.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <MenhCucWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <MenhCucRecall />,
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
                Cục chỉ là một mắt xích. Muốn hiểu cái đứng trước nó, đọc{' '}
                <Link href="/learn/nap-am" className={A}>bài Nạp âm</Link> về bảng Lục Thập Hoa Giáp
                và mệnh ngũ hành; muốn hiểu cái đứng sau, đọc{' '}
                <Link href="/learn/tu-vi" className={A}>bài Tử Vi Đẩu Số</Link> về 12 cung và 14
                chính tinh.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn biết Cục của chính mình?{' '}
                <Link href="/tinh-menh-cuc" className={A}>Tra Mệnh · Thân · Cục miễn phí →</Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/tinh-menh-cuc', label: 'Tính Mệnh Cục' },
                    { href: '/la-so-tu-vi', label: 'Lập lá số Tử Vi' },
                    { href: '/dai-van-hien-tai', label: 'Đại vận hiện tại' },
                    { href: '/ban-menh', label: 'Tra bản mệnh theo năm sinh' },
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
          children: <MenhCucChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

/**
 * Bài học /learn/nap-am — "Nạp âm và ngũ hành bản mệnh".
 *
 * GROUNDING — mọi tên gọi, can chi và hành trên trang này đều DERIVE tại build
 * từ chính engine của công cụ /ban-menh, không gõ tay:
 *   • lib/sinh-con.ts → yearProfile(year): trả về { canChi, zodiac, napAmName,
 *     element } cho một NĂM ÂM LỊCH. Trang này gọi yearProfile cho trọn 60 năm
 *     1984–2043 (1984 = Giáp Tý, đầu vòng Lục Thập Hoa Giáp) rồi gộp 2 năm liền
 *     kề thành 30 nhóm nạp âm → bảng 30 tên là ẢNH của bảng thật, không thể lệch.
 *   • lib/dat-ten-ngu-hanh.ts → computeBanMenh(): cycle = (nămÂm − 4) % 60;
 *     napAm = NAP_AM[floor(cycle / 2)] — chính chỗ "2 năm liền dùng chung 1 tên
 *     nạp âm" đến từ phép chia 2 này. ELEMENTS cho tên hiển thị của 5 hành.
 *   • lib/ban-menh-data.ts → TO_YEAR (trần dải năm có trang riêng /ban-menh/[year])
 *     và buildBanMenh(): màu hợp / nghề hợp CHỈ suy từ `element`, KHÔNG từ
 *     `napAmName` — cơ sở cho khẳng định "hai nạp âm cùng hành thì công cụ xử lý
 *     y hệt nhau".
 *   • trang công cụ app/ban-menh/page.tsx + app/ban-menh/[year]/page.tsx: quy ước
 *     tuổi theo NĂM ÂM LỊCH (đổi vào Tết); giọng "tham khảo để hiểu mình, không
 *     phán số mệnh".
 *
 * PHẠM VI (chống trùng bài khác):
 *   • KHÔNG giảng cơ chế 10 Thiên Can × 12 Địa Chi và vì sao chu kỳ 60 — chỉ nhắc
 *     một câu rồi dẫn sang bảng /luc-thap-hoa-giap.
 *   • KHÔNG giảng chọn màu theo hành (bài /learn/ngu-hanh-mau-sac) và KHÔNG giảng
 *     đặt tên theo hành (bài /learn/dat-ten-ngu-hanh) — chỉ link.
 *   • Phần "nghĩa mặt chữ" của 30 tên là DỊCH NGHĨA Hán-Việt để hình dung, không
 *     phải lời luận đoán vận mệnh.
 */

import type { ReactNode } from 'react';
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
import { yearProfile } from '@/lib/sinh-con';
import { ELEMENTS, type Element } from '@/lib/dat-ten-ngu-hanh';
import { TO_YEAR } from '@/lib/ban-menh-data';
import {
  NapAmFrame,
  NapAmDepth,
  NapAmRecall,
  NapAmChecklist,
  NapAmWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Nạp âm là gì — 30 tên và ngũ hành bản mệnh',
  description:
    'Nạp âm: 60 cặp can chi gom thành 30 tên như Hải Trung Kim, mỗi tên dùng cho 2 năm. Ngũ hành bản mệnh suy từ nạp âm, không từ can hay chi năm sinh.',
  alternates: { canonical: 'https://hieu.asia/learn/nap-am' },
};

// --- Dữ liệu suy tại build từ engine thật (không gõ tay) ---------------------

/** 1984 = Giáp Tý — đầu vòng 60. 60 năm liên tiếp phủ trọn 60 cặp can chi. */
const CYCLE_START = 1984;

/** Cặp năm dùng chung một nạp âm, suy từ chính phép floor(cycle / 2). */
function napAmPair(year: number): [number, number] {
  const offset = (((year - CYCLE_START) % 60) + 60) % 60;
  return offset % 2 === 0 ? [year, year + 1] : [year - 1, year];
}

/** Đưa một năm trong vòng về mốc đã xảy ra, để link được sang /ban-menh/[year]. */
function sampleYear(year: number): number {
  return year > TO_YEAR ? year - 60 : year;
}

interface NapAmRow {
  stt: number;
  name: string;
  element: Element;
  elementName: string;
  /** Hai can chi liền kề dùng chung tên nạp âm này. */
  canChiA: string;
  canChiB: string;
}

const NAP_AM_ROWS: NapAmRow[] = Array.from({ length: 30 }, (_, i) => {
  const a = yearProfile(CYCLE_START + i * 2)!;
  const b = yearProfile(CYCLE_START + i * 2 + 1)!;
  return {
    stt: i + 1,
    name: a.napAmName,
    element: a.element,
    elementName: ELEMENTS[a.element].name,
    canChiA: a.canChi,
    canChiB: b.canChi,
  };
});

const ELEMENT_ORDER: Element[] = ['kim', 'moc', 'thuy', 'hoa', 'tho'];

const BY_ELEMENT = ELEMENT_ORDER.map((key) => ({
  key,
  name: ELEMENTS[key].name,
  blurb: ELEMENTS[key].blurb,
  rows: NAP_AM_ROWS.filter((r) => r.element === key),
}));

/** Trọn 60 năm của một vòng — dùng để lọc "cùng can" / "cùng chi". */
const CYCLE = Array.from({ length: 60 }, (_, i) => yearProfile(CYCLE_START + i)!);

const TY_ROWS = CYCLE.filter((p) => p.canChi.endsWith(' Tý'));
const CANH_ROWS = CYCLE.filter((p) => p.canChi.startsWith('Canh '));

const TY_DISTINCT = new Set(TY_ROWS.map((p) => p.element)).size;
const CANH_DISTINCT = new Set(CANH_ROWS.map((p) => p.element)).size;

/** Ví dụ tính tay — mỗi năm đi trọn đường năm sinh → can chi → nạp âm → hành. */
const WORKED = [1990, 1995, 2000, 2026].map((y) => yearProfile(y)!);

/**
 * Dịch nghĩa MẶT CHỮ Hán-Việt của 30 tên nạp âm — chỉ để hình dung hình ảnh mà
 * người xưa đặt, KHÔNG phải lời luận đoán. Khoá là tên lấy từ lib, nên nếu lib
 * đổi cách viết thì ô này để trống chứ không hiện sai.
 */
const GLOSS: Record<string, string> = {
  'Hải Trung Kim': 'vàng trong lòng biển',
  'Kiếm Phong Kim': 'vàng nơi mũi kiếm',
  'Bạch Lạp Kim': 'vàng trong nến sáp trắng',
  'Sa Trung Kim': 'vàng lẫn trong cát',
  'Kim Bạch Kim': 'vàng pha bạc',
  'Thoa Xuyến Kim': 'vàng làm trâm, làm xuyến',
  'Đại Lâm Mộc': 'cây rừng lớn',
  'Dương Liễu Mộc': 'cây dương liễu',
  'Tùng Bách Mộc': 'cây tùng, cây bách',
  'Bình Địa Mộc': 'cây trên đất bằng',
  'Tang Đố Mộc': 'cây dâu tằm',
  'Thạch Lựu Mộc': 'cây thạch lựu',
  'Giản Hạ Thủy': 'nước dưới khe',
  'Tuyền Trung Thủy': 'nước trong suối',
  'Trường Lưu Thủy': 'dòng nước chảy dài',
  'Thiên Hà Thủy': 'nước sông Ngân trên trời',
  'Đại Khê Thủy': 'nước khe lớn',
  'Đại Hải Thủy': 'nước biển cả',
  'Lô Trung Hỏa': 'lửa trong lò',
  'Sơn Đầu Hỏa': 'lửa trên đỉnh núi',
  'Tích Lịch Hỏa': 'lửa sấm sét',
  'Sơn Hạ Hỏa': 'lửa dưới chân núi',
  'Phú Đăng Hỏa': 'lửa ngọn đèn',
  'Thiên Thượng Hỏa': 'lửa trên trời (mặt trời)',
  'Lộ Bàng Thổ': 'đất ven đường',
  'Thành Đầu Thổ': 'đất đắp đầu thành',
  'Ốc Thượng Thổ': 'đất trên mái nhà',
  'Bích Thượng Thổ': 'đất trên vách',
  'Đại Dịch Thổ': 'đất trạm dịch, đường lớn',
  'Sa Trung Thổ': 'đất lẫn trong cát',
};

// --- Hai bảng dùng lại nhiều lần -------------------------------------------

function Th({ children }: { children: ReactNode }) {
  return (
    <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
      {children}
    </th>
  );
}

/** Bảng "cùng can / cùng chi mà khác mệnh" — dựng từ CYCLE, dùng 2 lần. */
function ProofTable({ rows }: { rows: typeof CYCLE }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[460px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-card/60">
            <Th>Can chi</Th>
            <Th>Nạp âm</Th>
            <Th>Hành bản mệnh</Th>
            <Th>Năm ví dụ</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.canChi} className="border-b border-border/60 last:border-b-0">
              <td className="px-4 py-2 text-foreground">{p.canChi}</td>
              <td className="px-4 py-2 text-muted-foreground">{p.napAmName}</td>
              <td className="px-4 py-2 font-medium text-foreground">{ELEMENTS[p.element].name}</td>
              <td className="px-4 py-2 tabular-nums text-muted-foreground">
                <Link
                  href={`/ban-menh/${sampleYear(p.year)}`}
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  {sampleYear(p.year)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Một nhóm hành trong bảng 30 nạp âm. */
function GroupTable({ rows }: { rows: NapAmRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-card/60">
            <Th>#</Th>
            <Th>Tên nạp âm</Th>
            <Th>Nghĩa mặt chữ</Th>
            <Th>Hai năm can chi</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border/60 last:border-b-0">
              <td className="px-4 py-2 tabular-nums text-muted-foreground">{r.stt}</td>
              <td className="px-4 py-2 font-medium text-foreground">{r.name}</td>
              <td className="px-4 py-2 text-muted-foreground">{GLOSS[r.name] ?? '—'}</td>
              <td className="px-4 py-2 text-muted-foreground">
                {r.canChiA} · {r.canChiB}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ hiển thị (chống cloaking). Câu hỏi cố tình ĐI SÂU HƠN một tầng so với FAQ
// của trang công cụ /ban-menh và của bảng /luc-thap-hoa-giap, để hai trang không
// tự cạnh tranh nhau trên cùng một truy vấn.
const FAQS = [
  {
    q: 'Vì sao 60 cặp can chi chỉ có 30 tên nạp âm?',
    a: 'Vì bảng nạp âm gán tên theo CẶP: hai cặp can chi liền kề dùng chung một tên. Trong công cụ, chỗ này nằm gọn trong một phép chia hai — vị trí của năm trong vòng 60 chia đôi rồi lấy phần nguyên để tra bảng 30 tên. Ví dụ Giáp Tý và Ất Sửu cùng là Hải Trung Kim; Canh Thìn và Tân Tỵ cùng là Bạch Lạp Kim. Hệ quả: hai năm sinh liền nhau rất hay chung một mệnh, và 30 tên chia đều cho 5 hành, mỗi hành đúng 6 tên.',
  },
  {
    q: 'Ngũ hành bản mệnh lấy từ can, từ chi, hay từ nạp âm?',
    a: 'Từ nạp âm. Đường đi đúng là: năm sinh âm lịch → cặp can chi của năm → tra bảng ra tên nạp âm → chữ cuối của tên nạp âm chính là hành bản mệnh. Bản thân mỗi Thiên Can và mỗi Địa Chi cũng có hành riêng, nhưng đó là một lớp khác dùng trong lá số Bát Tự, không phải hành bản mệnh. Đây là chỗ nhầm phổ biến nhất khi tự tra.',
  },
  {
    q: 'Sinh năm can Canh mà mệnh không phải Kim thì có tính sai không?',
    a: 'Không sai. Trong một vòng 60 năm có 6 năm mang can Canh, và 6 năm đó rơi vào 3 hành bản mệnh khác nhau chứ không cùng một hành: Canh Tý là Bích Thượng Thổ, Canh Dần là Tùng Bách Mộc, Canh Thìn là Bạch Lạp Kim, Canh Ngọ là Lộ Bàng Thổ, Canh Thân là Thạch Lựu Mộc, Canh Tuất là Thoa Xuyến Kim. Cùng một chữ Canh mà ra Thổ, Mộc rồi mới tới Kim — bằng chứng rõ nhất rằng mệnh không đọc thẳng từ can.',
  },
  {
    q: 'Hai người cùng tuổi Tý có cùng mệnh không?',
    a: 'Không nhất thiết. Một vòng 60 năm có 5 năm mang chi Tý, và 5 năm ấy rơi đúng vào cả 5 hành khác nhau: Giáp Tý là Hải Trung Kim (Kim), Bính Tý là Giản Hạ Thủy (Thủy), Mậu Tý là Tích Lịch Hỏa (Hỏa), Canh Tý là Bích Thượng Thổ (Thổ), Nhâm Tý là Tang Đố Mộc (Mộc). Vậy cùng con giáp hoàn toàn có thể khác mệnh — con giáp đi theo chi, còn mệnh đi theo nạp âm.',
  },
  {
    q: 'Tên nạp âm như Hải Trung Kim, Lộ Bàng Thổ nghĩa là gì?',
    a: 'Đó là những hình ảnh đặt theo nghĩa mặt chữ Hán-Việt: Hải Trung Kim là vàng trong lòng biển, Lộ Bàng Thổ là đất ven đường, Lô Trung Hỏa là lửa trong lò, Đại Hải Thủy là nước biển cả, Tùng Bách Mộc là cây tùng cây bách. Mỗi tên gồm hai phần: phần hình ảnh ở trước và tên hành ở chữ cuối. Phần hình ảnh giúp dễ nhớ và dễ hình dung, còn phần quyết định về mặt hệ thống là chữ hành ở cuối.',
  },
  {
    q: 'Cùng hành Kim, Hải Trung Kim và Kiếm Phong Kim khác nhau ra sao?',
    a: 'Về mặt hệ thống thì không khác: cả hai đều quy về hành Kim, nên mọi thứ suy tiếp từ hành — màu hợp, màu nên hạn chế, nhóm nghề — đều giống hệt nhau. Công cụ của hieu.asia chỉ dùng hành để suy các phần đó, còn tên nạp âm chỉ để hiển thị. Sách xưa có thêm lời bàn riêng cho từng tên, nhưng các bản truyền lại không thống nhất, nên hieu.asia không suy diễn thêm.',
  },
  {
    q: 'Vì sao lá số Bát Tự nói tôi thiếu Thủy mà nạp âm lại bảo tôi mệnh Kim?',
    a: 'Vì đó là hai phép đo khác nhau. Nạp âm chỉ nhìn NĂM sinh và gán cho cả năm đó một hành duy nhất. Bát Tự nhìn cả bốn trụ giờ, ngày, tháng, năm rồi đếm xem hành nào vượng, hành nào thiếu trong chính bạn. Hai kết quả không mâu thuẫn vì chúng trả lời hai câu hỏi khác nhau; khi cần độ chính xác cá nhân thì bản đồ Bát Tự là bản chi tiết hơn hẳn.',
  },
  {
    q: 'Có nên dùng nạp âm để xem hai người hợp hay khắc nhau không?',
    a: 'Không nên dùng một mình. Nạp âm chỉ phân giải tới mức NĂM sinh, nghĩa là mọi người sinh cùng một năm âm đều chung một mệnh, và cả nhân loại chỉ được chia vào 5 nhóm hành. Lấy một phép chia thô như vậy để phán hai con người cụ thể hợp hay khắc là dùng sai công cụ. Hãy đọc nó như một lát cắt tham khảo, không phải kết luận về mối quan hệ.',
  },
  {
    q: 'Sinh tháng 1 hoặc đầu tháng 2 dương lịch thì lấy nạp âm của năm nào?',
    a: 'Nạp âm tính theo NĂM ÂM LỊCH, mà năm âm chỉ đổi vào Tết. Người sinh tháng 1 hoặc đầu tháng 2 dương lịch, tức trước Tết, vẫn thuộc năm âm liền trước, nên nạp âm và hành bản mệnh là của năm cũ chứ không phải năm dương ghi trên giấy khai sinh. Nếu bạn sinh sát Tết, hãy kiểm ngày Tết của năm đó trước khi kết luận mình mệnh gì.',
  },
];

const JSONLD = [
  article({
    headline: 'Nạp âm là gì: 30 tên nạp âm và ngũ hành bản mệnh ra từ đâu',
    description:
      'Vì sao 60 cặp can chi chỉ có 30 tên nạp âm, tên nạp âm là những hình ảnh gì, và vì sao ngũ hành bản mệnh suy từ nạp âm chứ không từ can hay chi của năm sinh.',
    url: '/learn/nap-am',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Nạp âm', url: '/learn/nap-am' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Nạp âm và ngũ hành bản mệnh — nền tảng cho người mới',
    description:
      'Nạp âm: 60 cặp can chi gom thành 30 tên như Hải Trung Kim, mỗi tên dùng cho 2 năm. Ngũ hành bản mệnh suy từ nạp âm, không từ can hay chi năm sinh.',
    url: '/learn/nap-am',
  }),
];

export default function LearnNapAmPage() {
  return (
    <LearnArticle
      eyebrow="NGŨ HÀNH · 60 GIÁP TÝ"
      title={
        <>
          Nạp âm{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (ngũ hành bản mệnh)
          </span>
        </>
      }
      standfirst={
        <>
          Ai cũng từng nghe “tôi mệnh Kim”, “nhà tôi mệnh Hỏa”. Nhưng cái mệnh ấy ở đâu ra? Nó không
          đọc thẳng từ can, cũng không đọc từ chi của năm sinh — nó ra từ một bảng có tên là{' '}
          <strong>nạp âm</strong>, nơi 60 cặp can chi được gom lại thành 30 cái tên đầy hình ảnh.
          Bài này đi hết đường ấy, từng bước một.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Nạp âm' },
      ]}
      relatedLenses={relatedLearnLenses('nap-am')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh, hệ thống tra ra can chi của năm âm, tên nạp âm và hành bản mệnh của bạn — kèm màu hợp, màu nên hạn chế theo luật tương sinh, tương khắc.',
        href: '/ban-menh',
        label: 'Tra ngũ hành bản mệnh',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <NapAmFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Nạp âm là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Nạp âm</strong> là một bảng đặt tên: mỗi cặp can chi trong vòng 60 năm được
                gán cho một cái tên riêng, và tên ấy luôn kết thúc bằng một trong năm hành —{' '}
                <strong>Kim, Mộc, Thủy, Hỏa, Thổ</strong>. Chữ hành ở cuối tên chính là{' '}
                <strong>ngũ hành bản mệnh</strong> của người sinh năm đó.
              </p>
              <p>
                Điểm đặc biệt: bảng gán tên theo <strong>cặp</strong>. Vòng 60 cặp can chi vì thế chỉ
                sinh ra <strong>{NAP_AM_ROWS.length} tên nạp âm</strong>, mỗi tên dùng chung cho{' '}
                <strong>hai năm liền kề</strong>. Ví dụ {NAP_AM_ROWS[0]!.canChiA} và{' '}
                {NAP_AM_ROWS[0]!.canChiB} cùng mang tên {NAP_AM_ROWS[0]!.name}.
              </p>
              <p>
                Vòng 60 ấy — mười Thiên Can ghép với mười hai Địa Chi — là chuyện của lịch can chi và
                đã có bảng tra riêng. Bài này không giảng lại cơ chế đó; nếu bạn muốn nhìn trọn 60
                dòng, xem{' '}
                <Link
                  href="/luc-thap-hoa-giap"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  bảng Lục Thập Hoa Giáp
                </Link>
                . Ở đây ta chỉ hỏi đúng một câu: <strong>từ vòng 60 ấy, mệnh ra bằng cách nào?</strong>
              </p>
              <p>Cần phân biệt rõ ngay từ đầu — nạp âm KHÔNG phải những thứ sau:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải ngũ hành của Thiên Can hay Địa Chi.</strong> Can và chi đều có
                  hành riêng, nhưng đó là một lớp khác dùng trong lá số Bát Tự. Mệnh bản thân đi
                  đường nạp âm.
                </li>
                <li>
                  <strong>Không phải Cung Mệnh trong Tử Vi.</strong> Cung Mệnh là một cung cụ thể
                  trên lá số, tính từ giờ – ngày – tháng – năm sinh. Nạp âm chỉ cần năm.
                </li>
                <li>
                  <strong>Không phải bức tranh ngũ hành đầy đủ của một người.</strong> Nó gán cho cả
                  một năm đúng một hành duy nhất. Muốn biết trong bạn hành nào vượng, hành nào thiếu
                  thì phải lập{' '}
                  <Link
                    href="/la-so-bat-tu"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    lá số Bát Tự
                  </Link>
                  .
                </li>
                <li>
                  <strong>Không phải lời phán số phận.</strong> hieu.asia trình bày nạp âm như một
                  quy ước có thể tra minh bạch — <strong>tham khảo để hiểu mình</strong>, không phán
                  số mệnh và không bán chuyện “đổi mệnh”.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <NapAmDepth />,
        },
        {
          id: 'menh-ra-tu-dau',
          tocLabel: 'Mệnh ra từ đâu',
          heading: 'Ngũ hành bản mệnh ra từ nạp âm, không từ can hay chi',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là chỗ người đọc nhầm nhiều nhất, nên ta đi thật chậm. Đường đúng có{' '}
                <strong>bốn chặng</strong>:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Năm sinh dương lịch → năm âm lịch.</strong> Năm âm đổi vào Tết, nên người
                  sinh trước Tết vẫn thuộc năm âm liền trước.
                </li>
                <li>
                  <strong>Năm âm → cặp can chi.</strong> Ví dụ năm âm 1990 là {WORKED[0]!.canChi}.
                </li>
                <li>
                  <strong>Cặp can chi → tên nạp âm.</strong> Tra bảng 30 tên. Hai cặp liền kề chung
                  một tên.
                </li>
                <li>
                  <strong>Tên nạp âm → hành bản mệnh.</strong> Lấy đúng chữ cuối của tên.
                </li>
              </ol>
              <p>
                Chú ý chặng 4: hành <em>không</em> lấy từ chữ Canh hay chữ Ngọ, mà lấy từ chữ cuối
                của cái tên tra được. Bốn ví dụ dưới đây đi trọn cả bốn chặng.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Ví dụ tính tay</h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <Th>Năm sinh</Th>
                      <Th>Can chi năm âm</Th>
                      <Th>Cặp năm chung nạp âm</Th>
                      <Th>Tên nạp âm</Th>
                      <Th>Hành bản mệnh</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {WORKED.map((p) => {
                      const [a, b] = napAmPair(p.year);
                      return (
                        <tr key={p.year} className="border-b border-border/60 last:border-b-0">
                          <td className="px-4 py-2 tabular-nums text-muted-foreground">{p.year}</td>
                          <td className="px-4 py-2 text-foreground">{p.canChi}</td>
                          <td className="px-4 py-2 tabular-nums text-muted-foreground">
                            {a} · {b}
                          </td>
                          <td className="px-4 py-2 font-medium text-foreground">{p.napAmName}</td>
                          <td className="px-4 py-2 text-foreground">
                            {ELEMENTS[p.element].name}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Sinh 1990:</strong> năm âm là {WORKED[0]!.canChi}. Cặp{' '}
                  {napAmPair(1990).join(' – ')} chung tên <strong>{WORKED[0]!.napAmName}</strong>.
                  Chữ cuối là {ELEMENTS[WORKED[0]!.element].name} → mệnh{' '}
                  <strong>{ELEMENTS[WORKED[0]!.element].name}</strong>.
                </li>
                <li>
                  <strong>Sinh 2000:</strong> năm âm là {WORKED[2]!.canChi}. Cặp{' '}
                  {napAmPair(2000).join(' – ')} chung tên <strong>{WORKED[2]!.napAmName}</strong> →
                  mệnh <strong>{ELEMENTS[WORKED[2]!.element].name}</strong>.
                </li>
                <li>
                  Hai năm này <strong>cùng can Canh</strong>, nhưng một bên ra{' '}
                  {ELEMENTS[WORKED[0]!.element].name}, một bên ra {ELEMENTS[WORKED[2]!.element].name}
                  . Nếu mệnh đọc thẳng từ can thì điều đó không thể xảy ra.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">
                Bằng chứng 1 — cùng can, khác mệnh
              </h3>
              <p>
                Trong một vòng 60 năm có đúng {CANH_ROWS.length} năm mang can Canh. Nếu can quyết
                định mệnh thì cả {CANH_ROWS.length} năm phải cùng một hành. Thực tế chúng rơi vào{' '}
                <strong>{CANH_DISTINCT} hành khác nhau</strong>:
              </p>
              <ProofTable rows={CANH_ROWS} />

              <h3 className="text-lg font-semibold text-foreground">
                Bằng chứng 2 — cùng chi (cùng con giáp), khác mệnh
              </h3>
              <p>
                Tương tự với chi. Một vòng 60 năm có {TY_ROWS.length} năm mang chi Tý, tức{' '}
                {TY_ROWS.length} năm cùng cầm tinh con chuột. Chúng rơi vào{' '}
                <strong>{TY_DISTINCT} hành khác nhau</strong> — nghĩa là đủ cả năm hành:
              </p>
              <ProofTable rows={TY_ROWS} />
              <p className="text-sm text-foreground/70">
                Hai bảng trên tự nó là câu trả lời:{' '}
                <strong>
                  không đọc được mệnh từ riêng can, cũng không đọc được từ riêng chi
                </strong>
                . Phải đi qua bảng nạp âm. Và cũng vì thế, <strong>cùng con giáp ≠ cùng mệnh</strong>{' '}
                — hai người cùng tuổi Tý hoàn toàn có thể một người mệnh Kim, một người mệnh Hỏa.
              </p>
            </div>
          ),
        },
        {
          id: 'ba-muoi-nap-am',
          tocLabel: '30 tên nạp âm',
          heading: `Bảng ${NAP_AM_ROWS.length} tên nạp âm, nhóm theo ngũ hành`,
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <p>
                Dưới đây là trọn bộ {NAP_AM_ROWS.length} tên, dựng thẳng từ bảng mà công cụ{' '}
                <Link href="/ban-menh" className="text-gold-700 underline-offset-4 hover:underline">
                  tra ngũ hành bản mệnh
                </Link>{' '}
                đang dùng, nên hai nơi không thể nói hai kiểu. Cột “nghĩa mặt chữ” là dịch nghĩa
                Hán-Việt để bạn hình dung hình ảnh người xưa đặt —{' '}
                <strong>không phải lời luận đoán</strong>.
              </p>
              <p>
                Chú ý cấu trúc: {NAP_AM_ROWS.length} tên chia đều cho 5 hành,{' '}
                <strong>mỗi hành đúng {BY_ELEMENT[0]!.rows.length} tên</strong>. Nghĩa là khi bạn
                nghe “mệnh Kim”, thực ra có tới {BY_ELEMENT[0]!.rows.length} cách nói khác nhau cùng
                dẫn về hành Kim.
              </p>

              {BY_ELEMENT.map((g) => (
                <div key={g.key} className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Hành {g.name} — {g.rows.length} nạp âm
                  </h3>
                  <p className="text-sm text-foreground/70">{g.blurb}</p>
                  <GroupTable rows={g.rows} />
                </div>
              ))}

              <p className="text-sm text-foreground/70">
                Cột “#” là thứ tự trong vòng 60, bắt đầu từ {NAP_AM_ROWS[0]!.canChiA}. Đọc dọc cột ấy
                trong cả {NAP_AM_ROWS.length} dòng, bạn sẽ thấy các hành không đi theo một vòng đơn
                giản nào — đó là lý do phải tra bảng chứ không nhẩm được.
              </p>
              <p className="text-sm text-foreground/70">
                Muốn xem tên nạp âm nằm cạnh đúng năm sinh của mình,{' '}
                <Link href="/ban-menh" className="text-gold-700 underline-offset-4 hover:underline">
                  tra theo năm sinh
                </Link>{' '}
                nhanh hơn dò tay.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: đây là một hệ quy ước, và nó rất thô',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phải nói thẳng phần này, vì nó quyết định bạn nên dùng nạp âm tới đâu.
              </p>
              <p>
                <strong>Thứ nhất: bảng nạp âm đến với chúng ta như một quy ước được truyền lại.</strong>{' '}
                Tên gọi “nạp âm” nghĩa đen là gán vào âm luật, và tương truyền bảng này gắn với hệ
                luật lữ trong nhạc cổ. Nhưng cái thực sự truyền tới tay người dùng hôm nay là{' '}
                <strong>bảng đã hoàn thành</strong>, không kèm phần lập luận đủ chặt để tự dựng lại.
                hieu.asia giữ đúng bảng cổ điển đó và nói rõ mình đang dùng quy ước nào, thay vì bịa
                ra một lời giải thích nghe cho xuôi tai.
              </p>
              <p>
                <strong>Thứ hai: độ phân giải chỉ tới mức NĂM.</strong> Mọi người sinh cùng một năm
                âm đều chung đúng một nạp âm — cùng tên, cùng hành, không phân biệt ngày, giờ, giới
                tính, hoàn cảnh. Cả nhân loại được chia vào vỏn vẹn {NAP_AM_ROWS.length} tên và 5
                nhóm hành. Một phép chia thô như vậy không thể biết gì về một con người cụ thể.
              </p>
              <p>
                <strong>
                  Thứ ba: đừng dùng nạp âm để phán hai người hợp hay khắc nhau.
                </strong>{' '}
                Rất dễ trượt sang lối nghĩ “Thủy khắc Hỏa nên hai đứa này không hợp”. Nhưng vế trái
                của câu ấy là quan hệ giữa hai <em>hành</em>, còn vế phải là kết luận về hai{' '}
                <em>con người</em> — hai chuyện khác hẳn nhau. Chỉ riêng việc hàng triệu người sinh
                cùng năm đều chung một mệnh đã đủ cho thấy phép này không đủ phân giải để phán về
                quan hệ. Nếu bạn muốn tham khảo góc hợp tuổi, hãy dùng{' '}
                <Link href="/hop-tuoi" className="text-gold-700 underline-offset-4 hover:underline">
                  công cụ xem hợp tuổi
                </Link>{' '}
                với đầy đủ lưu ý của nó, và vẫn đọc như một lát cắt tham khảo.
              </p>
              <p>
                <strong>Thứ tư: nạp âm không phải bức tranh ngũ hành của bạn.</strong> Nó gán cho cả
                một năm đúng một hành. Muốn biết trong chính bạn hành nào vượng, hành nào thiếu thì
                cần cả bốn trụ giờ – ngày – tháng – năm, tức{' '}
                <Link
                  href="/la-so-bat-tu"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  lá số Bát Tự
                </Link>
                . Hai thứ không mâu thuẫn: chúng trả lời hai câu hỏi khác nhau ở hai độ phân giải
                khác nhau.
              </p>
              <p>
                Vậy nạp âm còn dùng được vào việc gì? Vào đúng tầm của nó:{' '}
                <strong>một quy ước văn hoá dễ tra, dễ nhớ</strong>, hữu ích khi bạn muốn hiểu vì sao
                ông bà hay nhắc tới “mệnh” của một năm, hoặc muốn tham khảo cho những lựa chọn nhẹ
                nhàng như{' '}
                <Link
                  href="/learn/ngu-hanh-mau-sac"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  màu sắc theo hành
                </Link>{' '}
                hay{' '}
                <Link
                  href="/learn/dat-ten-ngu-hanh"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  chữ nghĩa khi đặt tên
                </Link>
                . Không có gì ở đây cần phải “giải”, và cũng không có chuyện “đổi mệnh”.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <NapAmWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <NapAmRecall />,
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
                Muốn nhìn trọn 60 dòng can chi kèm nạp âm và hành từng năm, xem{' '}
                <Link
                  href="/luc-thap-hoa-giap"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  bảng Lục Thập Hoa Giáp
                </Link>
                . Muốn đi sâu hơn mức “một hành cho cả năm”, hãy lập{' '}
                <Link
                  href="/la-so-bat-tu"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  lá số Bát Tự
                </Link>
                .
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Chỉ cần biết mình mệnh gì?{' '}
                <Link href="/ban-menh" className="text-gold-700 underline-offset-4 hover:underline">
                  Tra ngũ hành bản mệnh miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/ban-menh', label: 'Tra ngũ hành bản mệnh theo năm sinh' },
                    { href: '/luc-thap-hoa-giap', label: 'Bảng 60 Can Chi & nạp âm' },
                    { href: '/la-so-bat-tu', label: 'Lá số Bát Tự (Tứ Trụ)' },
                    { href: '/dat-ten-ngu-hanh', label: 'Đặt tên con theo ngũ hành' },
                    { href: '/mau-xe-hop-menh', label: 'Màu xe hợp mệnh' },
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
          children: <NapAmChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

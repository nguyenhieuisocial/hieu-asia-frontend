/**
 * Bài học /learn/can-chi.
 *
 * GROUNDING — mọi bảng và con số trên trang này SUY RA TỪ CODE, không gõ tay:
 *   • lib/bazi.ts → `CAN` (Giáp…Quý), `CHI` (Tý…Hợi), `ELEMENTS` (Mộc, Hỏa, Thổ,
 *     Kim, Thủy). Ba bảng nội bộ của file đó là nguồn cho các cột suy ra ở đây:
 *     CAN_YANG = [true,false,…] → chỉ số 0-based CHẴN là DƯƠNG ⇒ `polarity(i)`;
 *     CAN_ELEMENT (Mộc,Mộc,Hỏa,Hỏa,Thổ,Thổ,Kim,Kim,Thủy,Thủy) ⇒ đúng bằng
 *     `ELEMENTS[Math.floor(i / 2)]`; CHI_ELEMENT (Thủy,Thổ,Mộc,Mộc,Thổ,Hỏa,Hỏa,
 *     Thổ,Kim,Kim,Thổ,Thủy) ⇒ trùng đúng `ZODIAC[i].nguHanh`.
 *   • lib/hop-tuoi-pairs.ts → `ZODIAC` (12 địa chi kèm ngũ hành + emoji).
 *   • lib/con-giap-animal.ts → `conVatOf` (địa chi → con vật, quy ước VIỆT: Mão =
 *     Mèo) — NGUỒN DUY NHẤT của phép đổi này trong repo.
 *   • lib/dat-ten-ngu-hanh.ts → `yearCanChi(lunarYear)`: can = (năm − 4) mod 10,
 *     chi = (năm − 4) mod 12 ⇒ mục "suy can chi của năm" dùng ĐÚNG phép của engine.
 *   • lib/sinh-con.ts → `yearProfile(year)` — đối chiếu từng ví dụ năm, nên cột
 *     "engine trả về" không thể lệch với công cụ.
 *   • trang công cụ app/luc-thap-hoa-giap/page.tsx — bảng tra trọn 60 Can Chi
 *     (dựng từ chính `yearProfile`, mốc 1984 = Giáp Tý).
 *
 * PHẠM VI CÓ CHỦ ĐÍCH: chỉ nói sâu về BỘ MÁY can chi (10 can, 12 chi, âm/dương,
 * luật ghép cùng tính, vì sao đúng 60, cách suy can chi của một năm). KHÔNG giảng
 * nạp âm / ngũ hành bản mệnh (→ /ban-menh), tính cách 12 con giáp
 * (→ /learn/con-giap), tam hợp – lục xung (→ /tuong-hop-12-con-giap), lập tứ trụ
 * (→ /learn/bat-tu).
 *
 * Giọng: can chi là HỆ ĐÁNH SỐ thời gian — dữ kiện lịch pháp kiểm chứng được,
 * không phán định con người.
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
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
import { CAN, CHI, ELEMENTS } from '@/lib/bazi';
import { ZODIAC } from '@/lib/hop-tuoi-pairs';
import { conVatOf } from '@/lib/con-giap-animal';
import { yearProfile } from '@/lib/sinh-con';
import {
  CanChiFrame,
  CanChiDepth,
  CanChiRecall,
  CanChiChecklist,
  CanChiWhys,
} from './_active-learning';

// 44 ký tự + hậu tố ' · hieu.asia' (12) = 56 → không bị Google cắt.
const TITLE = 'Can Chi: 10 Thiên Can, 12 Địa Chi và vòng 60';
const DESCRIPTION =
  'Can Chi là gì: 10 Thiên Can ghép 12 Địa Chi theo luật cùng âm hoặc cùng dương nên chỉ ra 60 cặp. Cách suy can chi của một năm và giới hạn của hệ này.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/learn/can-chi' },
};

/**
 * Âm/dương theo CHỈ SỐ trong dãy — mirror của `CAN_YANG` trong lib/bazi.ts
 * ([true,false,true,…]), áp cho cả can lẫn chi vì cả hai dãy đều xen kẽ đều và
 * không có ngoại lệ. Chỉ số 0-based chẵn = Dương.
 */
const polarity = (i: number): 'Dương' | 'Âm' => (i % 2 === 0 ? 'Dương' : 'Âm');

/** Bảng dữ liệu dùng chung cho cả 4 bảng trên trang (giữ style bảng của /learn). */
function DataTable({
  cols,
  rows,
  minWidth,
}: {
  cols: string[];
  rows: { key: string; cells: ReactNode[] }[];
  minWidth: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className={`w-full ${minWidth} text-left text-sm tabular-nums`}>
        <thead>
          <tr className="border-b border-border bg-card/60">
            {cols.map((c) => (
              <th key={c} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-border/60 last:border-b-0">
              {r.cells.map((cell, i) => (
                <td key={i} className="px-4 py-2 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Màu ngũ hành cho dễ quét mắt (thuần trang trí, đúng cả 2 theme). */
const ELEMENT_COLOR: Record<string, string> = {
  Kim: 'text-amber-500',
  Mộc: 'text-emerald-500',
  Thủy: 'text-sky-500',
  Hỏa: 'text-rose-500',
  Thổ: 'text-yellow-600 dark:text-yellow-500',
};

// 10 Thiên Can — tên lấy thẳng từ `CAN`; hành = ELEMENTS[floor(i/2)] (đúng bằng
// CAN_ELEMENT trong lib/bazi.ts); âm/dương = polarity(i) (đúng bằng CAN_YANG).
const CAN_ROWS = CAN.map((can, i) => ({
  stt: i + 1,
  can,
  amDuong: polarity(i),
  hanh: ELEMENTS[Math.floor(i / 2)]!,
}));

// 12 Địa Chi — tên lấy thẳng từ `CHI`; hành lấy từ ZODIAC (trùng CHI_ELEMENT);
// con vật qua `conVatOf` (quy ước Việt: Mão = Mèo); âm/dương = polarity(i).
const CHI_ROWS = CHI.map((chi, i) => ({
  stt: i + 1,
  chi,
  amDuong: polarity(i),
  hanh: ZODIAC[i]!.nguHanh,
  conGiap: conVatOf(chi),
  emoji: ZODIAC[i]!.emoji,
}));

const CAN_DUONG = CAN_ROWS.filter((r) => r.amDuong === 'Dương').map((r) => r.can);
const CAN_AM = CAN_ROWS.filter((r) => r.amDuong === 'Âm').map((r) => r.can);
const CHI_DUONG = CHI_ROWS.filter((r) => r.amDuong === 'Dương').map((r) => r.chi);
const CHI_AM = CHI_ROWS.filter((r) => r.amDuong === 'Âm').map((r) => r.chi);

// 12 bước đầu của vòng 60: bước k lấy CAN[k mod 10] + CHI[k mod 12] — đúng phép
// mà lib/dat-ten-ngu-hanh.ts dùng cho năm. Cột "năm mẫu" theo mốc 1984 = Giáp Tý
// của trang công cụ /luc-thap-hoa-giap.
const CYCLE_HEAD = Array.from({ length: 12 }, (_, k) => ({
  step: k + 1,
  can: CAN[k % 10]!,
  chi: CHI[k % 12]!,
  canPol: polarity(k % 10),
  chiPol: polarity(k % 12),
  year: 1984 + k,
}));

// Ví dụ cặp HỢP LUẬT (Giáp Tý, Ất Sửu, Quý Hợi) và cặp KHÔNG TỒN TẠI (Giáp Sửu,
// Ất Tý, Bính Mão) — dựng từ CHỈ SỐ trong CAN/CHI để không gõ tay.
const pairsOf = (...idx: [number, number][]) =>
  idx.map(([c, b]) => ({ can: CAN[c]!, chi: CHI[b]!, canPol: polarity(c), chiPol: polarity(b) }));

const PAIR_BOXES = [
  { title: 'Hợp luật — có thật', verdict: 'cùng tính', pairs: pairsOf([0, 0], [1, 1], [9, 11]) },
  {
    title: 'Trái luật — không tồn tại',
    verdict: 'trộn âm với dương',
    pairs: pairsOf([0, 1], [1, 0], [2, 3]),
  },
];

// Ví dụ suy can chi của một NĂM: hai phép chia lấy dư trên (năm − 4), rồi ĐỐI
// CHIẾU với `yearProfile` (engine thật) để cột cuối chứng minh phép suy đúng.
const YEAR_EXAMPLES = [1984, 1990, 2000, 2026].map((year) => {
  const base = year - 4;
  const canIdx = ((base % 10) + 10) % 10;
  const chiIdx = ((base % 12) + 12) % 12;
  return {
    year,
    base,
    canIdx,
    chiIdx,
    can: CAN[canIdx]!,
    chi: CHI[chiIdx]!,
    engine: yearProfile(year)!.canChi,
  };
});

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ trên trang (chống cloaking). Câu hỏi cố tình KHÁC bộ FAQ của trang công cụ
// /luc-thap-hoa-giap (bên đó hỏi về nạp âm, về cột 3 năm, về "có phải bói toán").
const FAQS = [
  {
    q: 'Can Chi là gì?',
    a: 'Can Chi là cách người xưa đặt tên cho thời gian, vai trò giống hệt con số "2026" trong lịch dương. Nó ghép một tên từ dãy 10 Thiên Can (Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý) với một tên từ dãy 12 Địa Chi (Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi), luôn viết can trước chi sau, ví dụ Giáp Tý hay Bính Ngọ. Bản thân nó là một hệ đánh số thời gian, không phải lời phán về người.',
  },
  {
    q: 'Vì sao vòng Can Chi chỉ có 60 cặp mà không phải 120?',
    a: 'Vì luật ghép chỉ cho phép can dương đi với chi dương và can âm đi với chi âm. Mỗi can vì thế chỉ ghép được với 6 chi cùng tính chứ không phải cả 12, nên tổng số cặp là 10 nhân 6 bằng 60, đúng một nửa của 120. Nói theo cách khác: hai dãy 10 và 12 cùng nhích một bước mỗi lần, nên chúng chỉ cùng lúc trở về vạch xuất phát sau bội chung nhỏ nhất của 10 và 12, tức 60 bước.',
  },
  {
    q: 'Vì sao không có cặp Giáp Sửu hay Ất Tý?',
    a: 'Vì hai cặp đó trộn âm với dương. Giáp là can đứng thứ nhất nên mang tính Dương, còn Sửu là chi đứng thứ hai nên mang tính Âm, ghép lại là trái luật. Ất (thứ hai, Âm) ghép với Tý (thứ nhất, Dương) cũng vậy. Quy tắc nhận biết rất nhanh: đếm vị trí trong dãy, vị trí lẻ là Dương và vị trí chẵn là Âm; hai vế phải cùng loại thì cặp mới tồn tại trong vòng 60.',
  },
  {
    q: 'Cách tính Can Chi của một năm dương lịch như thế nào?',
    a: 'Ba bước. Bước 1: lấy năm trừ 4. Bước 2: lấy kết quả chia 10 và giữ số dư, số dư này chỉ ra Thiên Can theo thứ tự Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý (dư 0 là Giáp). Bước 3: lấy chính kết quả đó chia 12 và giữ số dư, số dư này chỉ ra Địa Chi theo thứ tự Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi (dư 0 là Tý). Ví dụ năm 2026: 2026 trừ 4 bằng 2022, chia 10 dư 2 nên can là Bính, chia 12 dư 6 nên chi là Ngọ, vậy 2026 là năm Bính Ngọ.',
  },
  {
    q: 'Thiên Can và Địa Chi khác nhau ở chỗ nào?',
    a: 'Khác ở số lượng và ở vai trò. Thiên Can có 10 tên và không gắn với con vật nào; Địa Chi có 12 tên và chính là 12 con giáp quen thuộc, đồng thời được dùng để chia 12 khung giờ trong ngày và 12 tháng trong năm. Trong một tên can chi, can luôn đứng trước và chi luôn đứng sau. Điểm chung là cả hai dãy đều xen kẽ dương rồi âm đều đặn, và luật ghép chỉ nối hai vế cùng tính.',
  },
  {
    q: 'Can Chi chỉ dùng cho năm hay còn dùng cho tháng, ngày, giờ?',
    a: 'Dùng cho cả bốn tầng. Cùng một bộ 10 can và 12 chi được dùng để đánh số năm, tháng, ngày và giờ, nên một thời điểm có thể viết bằng bốn cặp can chi. Bốn cặp đó chính là thứ mà môn Bát Tự gọi là tứ trụ, tức tám chữ. Cần lưu ý là luật suy ra can chi của tháng, ngày và giờ có quy tắc riêng, không suy thẳng từ can chi năm được.',
  },
  {
    q: 'Can Chi có nói lên tính cách hay vận mệnh của một người không?',
    a: 'Không. Can chi là hệ đánh số thời gian, giống như nói "năm 2026" hay "thứ Ba" — bản thân nó không chứa lời khen chê nào. Bằng chứng đơn giản: mọi người sinh cùng một năm đều chung một can chi năm, mà cuộc đời họ rõ ràng không giống nhau. Những câu về hợp tuổi, về hạn hay về tính cách đều đến từ các môn dựng thêm phía trên can chi, mỗi môn một luật riêng, và nên được đọc như quan niệm để tham khảo.',
  },
  {
    q: 'Sinh đầu năm dương lịch thì lấy can chi của năm nào?',
    a: 'Có thể là năm liền trước, vì can chi năm đổi theo lịch âm chứ không đổi vào ngày 1 tháng 1 dương lịch. Người sinh trong tháng 1 hoặc đầu tháng 2 dương lịch, tức trước Tết, thường vẫn thuộc can chi của năm âm liền trước. Cần biết thêm là trong mệnh lý Bát Tự, trụ năm lại đổi ở tiết Lập Xuân chứ không đổi đúng ngày Tết, nên hai nguồn có thể ghi khác nhau cho cùng một người. Gặp trường hợp sát mốc, hãy hỏi rõ nguồn đó đổi năm theo Tết hay theo Lập Xuân.',
  },
];

const JSONLD = [
  article({
    headline: 'Can Chi: 10 Thiên Can, 12 Địa Chi và vòng 60 — nền tảng cho người mới',
    description: DESCRIPTION,
    url: '/learn/can-chi',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Can Chi', url: '/learn/can-chi' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Can Chi — 10 Thiên Can, 12 Địa Chi và vòng 60',
    description: DESCRIPTION,
    url: '/learn/can-chi',
  }),
];

export default function LearnCanChiPage() {
  return (
    <LearnArticle
      eyebrow="LỊCH PHÁP · NỀN TẢNG"
      title={
        <>
          Can Chi{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">(vòng 60)</span>
        </>
      }
      standfirst={
        <>
          Giáp Tý, Bính Ngọ, Quý Hợi — những cái tên này xuất hiện khắp nơi nhưng hiếm khi được
          giải thích. Chúng không phải mật mã phải học thuộc: chỉ là hai dãy tên chạy song song,
          ghép lại theo đúng một luật. Hiểu luật đó, bạn tự suy được can chi của bất kỳ năm nào —
          và hiểu luôn vì sao vòng này dài đúng 60 năm.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Can Chi' },
      ]}
      relatedLenses={relatedLearnLenses('can-chi')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Xem trọn vòng 60 Can Chi trong một bảng: từ Giáp Tý tới Quý Hợi, kèm con giáp và các năm dương lịch ứng với từng cặp — để đối chiếu ngay năm sinh của bạn.',
        href: '/luc-thap-hoa-giap',
        label: 'Mở bảng tra 60 Can Chi',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <CanChiFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Can chi là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Can chi</strong> là cách người xưa <strong>đặt tên cho thời gian</strong>,
                vai trò giống hệt con số “2026” trong lịch dương. Khác biệt duy nhất: thay vì đếm
                số tăng dần, người xưa dùng <strong>hai dãy tên chạy song song</strong> rồi ghép
                chúng lại.
              </p>
              <p>
                Dãy thứ nhất là <strong>10 Thiên Can</strong>: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh,
                Tân, Nhâm, Quý. Dãy thứ hai là <strong>12 Địa Chi</strong>: Tý, Sửu, Dần, Mão,
                Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi — chính là 12 con giáp quen thuộc. Tên một
                năm luôn viết <strong>can trước, chi sau</strong>: Giáp Tý, Ất Sửu, Bính Dần… Mỗi
                bước thời gian, <strong>cả hai dãy cùng nhích đúng một tên</strong>; dãy can hết 10
                thì quay lại Giáp, dãy chi hết 12 thì quay lại Tý. Hai dãy dài ngắn khác nhau nên
                lệch nhịp — và chính chỗ lệch ấy sinh ra vòng 60.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu, vì đây là chỗ hay bị gộp nhất:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Can chi <strong>là một hệ đánh số thời gian</strong> — dữ kiện lịch pháp, ai tính
                  cũng ra cùng một kết quả, kiểm chứng được bằng phép chia.
                </li>
                <li>
                  Can chi <strong>không phải một lời phán</strong> về người mang tên năm đó: mọi
                  người sinh cùng một năm đều chung một can chi năm, mà cuộc đời họ rõ ràng không
                  giống nhau.
                </li>
                <li>
                  Tuổi hợp – tuổi xung, mệnh nạp âm, hạn theo năm… đều thuộc{' '}
                  <strong>các môn dựng thêm phía trên</strong> can chi, mỗi môn một luật riêng.
                  Chúng mượn tên can chi để đánh dấu, chứ không sinh ra từ can chi.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Riêng mệnh nạp âm — thứ hay bị nhắc chung với can chi — là một lớp gán thêm lên vòng
                60 chứ không thuộc bộ máy can chi, nên bài này không đi sâu; tra tại{' '}
                <Link href="/ban-menh" className="text-gold-700 underline-offset-4 hover:underline">
                  ngũ hành bản mệnh theo năm
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
          children: <CanChiDepth />,
        },
        {
          id: 'muoi-can-muoi-hai-chi',
          tocLabel: '10 Can · 12 Chi',
          heading: 'Hai dãy tên: 10 Thiên Can và 12 Địa Chi',
          children: (
            <div className="space-y-5 text-foreground/85 leading-relaxed">
              <p>
                Đây là toàn bộ “bảng chữ cái” của hệ thống. Không cần học thuộc ngay — chỉ cần thấy
                được <strong>cấu trúc</strong>: cột âm/dương xen kẽ đều tăm tắp, cột hành đi theo
                từng cặp.
              </p>

              <h3 className="text-lg font-semibold text-foreground">10 Thiên Can</h3>
              <p>
                Mười tên, chia đôi tròn trịa: <strong>5 can Dương</strong> ({CAN_DUONG.join(', ')})
                và <strong>5 can Âm</strong> ({CAN_AM.join(', ')}). Quy tắc nhận biết duy nhất:{' '}
                <strong>đứng ở vị trí lẻ là Dương, vị trí chẵn là Âm</strong>. Cột hành cũng có quy
                luật: hai can liền nhau chung một hành, theo thứ tự Mộc → Hỏa → Thổ → Kim → Thủy.
              </p>
              <DataTable
                cols={['Vị trí', 'Thiên Can', 'Âm/Dương', 'Ngũ hành']}
                minWidth="min-w-[420px]"
                rows={CAN_ROWS.map((r) => ({
                  key: r.can,
                  cells: [
                    r.stt,
                    <strong key="can" className="font-medium text-foreground">{r.can}</strong>,
                    r.amDuong,
                    <span key="hanh" className={ELEMENT_COLOR[r.hanh]}>{r.hanh}</span>,
                  ],
                }))}
              />
              <h3 className="text-lg font-semibold text-foreground">12 Địa Chi</h3>
              <p>
                Mười hai tên, cũng chia đôi tròn trịa: <strong>6 chi Dương</strong> (
                {CHI_DUONG.join(', ')}) và <strong>6 chi Âm</strong> ({CHI_AM.join(', ')}) — cùng
                quy tắc vị trí lẻ/chẵn như bên can. Mỗi chi gắn một con vật, và đó chính là 12 con
                giáp.
              </p>
              <DataTable
                cols={['Vị trí', 'Địa Chi', 'Con giáp', 'Âm/Dương', 'Ngũ hành']}
                minWidth="min-w-[460px]"
                rows={CHI_ROWS.map((r) => ({
                  key: r.chi,
                  cells: [
                    r.stt,
                    <strong key="chi" className="font-medium text-foreground">{r.chi}</strong>,
                    <span key="giap" className="whitespace-nowrap">
                      <span aria-hidden>{r.emoji} </span>
                      {r.conGiap}
                    </span>,
                    r.amDuong,
                    <span key="hanh" className={ELEMENT_COLOR[r.hanh]}>{r.hanh}</span>,
                  ],
                }))}
              />
              <p className="text-sm text-foreground/70">
                Hai lưu ý nhỏ. Một: <strong>chi thứ tư ở Việt Nam là con Mèo</strong>, trong khi
                Trung Hoa và phần lớn Á Đông dùng con Thỏ — khác biệt văn hoá, không phải đúng/sai.
                Hai: <strong>Tý</strong> (chi thứ nhất, con Chuột) và <strong>Tỵ</strong> (chi thứ
                sáu, con Rắn) là hai chi khác nhau, rất hay bị đọc nhầm thành một.
              </p>
              <p className="text-sm text-foreground/70">
                Cột ngũ hành dành cho các môn luận sinh khắc phía trên; với bài này thứ cần nhớ chỉ
                là <strong>cột âm/dương</strong>, vì nó là chìa khoá của mục tiếp theo. Tính cách
                từng con giáp là chủ đề riêng, xem{' '}
                <Link href="/learn/con-giap" className="text-gold-700 underline-offset-4 hover:underline">
                  bài 12 con giáp
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'vi-sao-60',
          tocLabel: 'Vì sao đúng 60',
          heading: 'Luật ghép — và vì sao ra đúng 60 chứ không phải 120',
          children: (
            <div className="space-y-5 text-foreground/85 leading-relaxed">
              <p>
                Ghép tự do thì 10 can nhân 12 chi ra <strong>120 cặp</strong>. Nhưng vòng can chi
                chỉ có <strong>60</strong>. Một nửa số tổ hợp biến đi đâu? Câu trả lời nằm trọn
                trong một luật duy nhất:
              </p>
              <div className="rounded-xl border border-gold/25 bg-card/40 p-5">
                <p className="text-base font-semibold text-foreground">
                  Dương ghép với dương, âm ghép với âm — không bao giờ trộn.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Can Dương chỉ đứng cạnh chi Dương, can Âm chỉ đứng cạnh chi Âm. Không ngoại lệ.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-foreground">Cách đếm thứ nhất: 10 × 6</h3>
              <p>
                Lấy một can Dương bất kỳ, ví dụ <strong>Giáp</strong>. Nó không ghép được với cả 12
                chi, mà chỉ với <strong>6 chi Dương</strong> ({CHI_DUONG.join(', ')}) — tức 6 cặp
                thay vì 12. Mọi can đều vậy, nên tổng số cặp là{' '}
                <strong>10 can × 6 chi = 60</strong>, đúng một nửa của 120. Tách theo âm/dương cũng
                ra con số đó: 5 can Dương × 6 chi Dương = 30, cộng 5 can Âm × 6 chi Âm = 30.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Cách đếm thứ hai: bội chung nhỏ nhất của 10 và 12
              </h3>
              <p>
                Nhìn theo chuyển động thay vì theo tổ hợp. Mỗi bước,{' '}
                <strong>cả hai dãy cùng nhích một tên</strong>: dãy can về lại vạch xuất phát sau
                mỗi 10 bước, dãy chi sau mỗi 12 bước. Hai dãy chỉ <strong>cùng lúc</strong> về vạch
                xuất phát ở bước vừa chia hết cho 10 vừa chia hết cho 12 — tức{' '}
                <strong>bội chung nhỏ nhất của 10 và 12, bằng 60</strong>.
              </p>
              <p className="text-sm text-foreground/70">
                Vì sao là 60 mà không phải 120? Vì 10 và 12 có <strong>ước chung là 2</strong>, nên
                bội chung nhỏ nhất chỉ bằng tích chia đôi. Cũng chính ước chung 2 ấy khiến tính
                âm/dương của can và chi <strong>luôn khớp nhau</strong> ở mọi bước — nói cách khác,
                luật “cùng âm cùng dương” không phải điều cấm áp từ ngoài vào mà là{' '}
                <strong>hệ quả tự nhiên</strong> của việc hai dãy chẵn cùng chạy.
              </p>
              <h3 className="text-lg font-semibold text-foreground">12 bước đầu của vòng</h3>
              <p>
                Bảng dưới dựng bằng đúng phép ghép ấy: bước thứ k lấy can thứ{' '}
                <strong>k chia 10 lấy dư</strong> và chi thứ <strong>k chia 12 lấy dư</strong>. Để ý
                cột âm/dương: hai vế luôn cùng loại, không hàng nào lệch.
              </p>
              <DataTable
                cols={['Bước', 'Can Chi', 'Tính của can', 'Tính của chi', 'Năm mẫu']}
                minWidth="min-w-[520px]"
                rows={CYCLE_HEAD.map((r) => ({
                  key: String(r.step),
                  cells: [
                    r.step,
                    <strong key="canchi" className="font-medium text-foreground">
                      {r.can} {r.chi}
                    </strong>,
                    r.canPol,
                    r.chiPol,
                    r.year,
                  ],
                }))}
              />
              <p className="text-sm text-foreground/70">
                Bảng chỉ hiện 12 bước đầu cho gọn. Trọn vòng 60 bước, từ Giáp Tý tới Quý Hợi, xem{' '}
                <Link
                  href="/luc-thap-hoa-giap"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  bảng tra Lục Thập Hoa Giáp
                </Link>
                .
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Cặp có thật và cặp không bao giờ tồn tại
              </h3>
              <p>
                Bài kiểm tra nhanh nhất xem bạn đã nắm luật chưa. Ba cặp bên trái{' '}
                <strong>có thật</strong> vì hai vế cùng tính; ba cặp bên phải{' '}
                <strong>không tồn tại</strong> trong bất kỳ bảng can chi nào, dù nghe rất xuôi tai.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {PAIR_BOXES.map((box) => (
                  <div key={box.title} className="rounded-xl border border-border bg-card/40 p-4">
                    <p className="mb-2 text-sm font-semibold text-foreground">{box.title}</p>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {box.pairs.map((p) => (
                        <li key={`${p.can}-${p.chi}`}>
                          <strong className="text-foreground">
                            {p.can} {p.chi}
                          </strong>{' '}
                          — {p.can} ({p.canPol}) + {p.chi} ({p.chiPol}): {box.verdict}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/70">
                Rõ nhất là <strong>Giáp Sửu</strong>: Giáp đứng thứ nhất nên Dương, Sửu đứng thứ hai
                nên Âm — ghép lại là trộn, nên cặp này{' '}
                <strong>không có mặt trong 60 cặp</strong> và cũng không có năm nào mang tên đó. Gặp
                một tên can chi lạ, chỉ cần đếm vị trí hai vế là biết ngay nó thật hay không.
              </p>
            </div>
          ),
        },
        {
          id: 'suy-can-chi-cua-nam',
          tocLabel: 'Suy can chi của năm',
          heading: 'Tự suy can chi của một năm dương lịch',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Không cần bảng tra, không cần nhớ gì: chỉ hai phép chia lấy dư trên cùng một số —
                đúng phép mà công cụ của hieu.asia dùng bên trong.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Bước 1 — Lấy năm trừ 4</h3>
              <p>
                Gọi số vừa tính là <strong>N</strong>. Con số 4 là <strong>mốc quy ước</strong> để
                dãy khớp với lịch truyền thống — nó neo cho năm thứ 4 sau Công nguyên rơi vào Giáp
                Tý, đầu vòng. Ví dụ năm 2026 thì N = 2026 − 4 = <strong>2022</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — Chia N cho 10, số dư ra Thiên Can
              </h3>
              <p>
                Đếm dãy can bắt đầu từ 0: <strong>dư 0 là Giáp</strong>, dư 1 là Ất, dư 2 là Bính…
                dư 9 là Quý. Với N = 2022, số dư là <strong>2</strong> → can là{' '}
                <strong>Bính</strong>. Mẹo nhẩm: số dư khi chia 10 chính là{' '}
                <strong>chữ số hàng đơn vị</strong> của N.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Chia chính N đó cho 12, số dư ra Địa Chi
              </h3>
              <p>
                Cũng đếm từ 0: <strong>dư 0 là Tý</strong>, dư 1 là Sửu, dư 2 là Dần… dư 11 là Hợi.
                Với N = 2022: 12 × 168 = 2016, còn dư <strong>6</strong> → chi là{' '}
                <strong>Ngọ</strong>. Ghép lại, <strong>năm 2026 là Bính Ngọ</strong>. Kiểm chéo
                miễn phí: Bính đứng thứ 3 (lẻ) nên Dương, Ngọ đứng thứ 7 (lẻ) nên cũng Dương — hai
                vế cùng tính, hợp luật. Ra một cặp lệch âm/dương là chắc chắn nhầm, hãy làm lại
                bước 1.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Bốn ví dụ tính tay</h3>
              <p>
                Cột cuối là kết quả do <strong>chính engine của hieu.asia</strong> trả về, đặt cạnh
                phép tính tay để thấy hai bên khớp nhau.
              </p>
              <DataTable
                cols={['Năm', 'N = năm − 4', 'N ÷ 10 dư', 'N ÷ 12 dư', 'Tính tay', 'Engine trả về']}
                minWidth="min-w-[560px]"
                rows={YEAR_EXAMPLES.map((ex) => ({
                  key: String(ex.year),
                  cells: [
                    ex.year,
                    ex.base,
                    `${ex.canIdx} → ${ex.can}`,
                    `${ex.chiIdx} → ${ex.chi}`,
                    <strong key="canchi" className="font-medium text-foreground">
                      {ex.can} {ex.chi}
                    </strong>,
                    ex.engine,
                  ],
                }))}
              />
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>1984 → Giáp Tý:</strong> N = 1980 chia hết cho cả 10 lẫn 12 nên dư 0 ở hai
                  vế, ra đúng cặp mở đầu vòng — vì thế bảng tra 60 năm hay lấy 1984 làm mốc.
                </li>
                <li>
                  <strong>1990 và 2000</strong> cùng ra can <strong>Canh</strong> (cách nhau đúng 10
                  năm) nhưng chi đổi từ Ngọ sang Thìn — thấy rõ hai dãy quay khác nhịp. Còn{' '}
                  <strong>2026 là Bính Ngọ</strong>, và 1966 hay 2086 cũng vậy, vì vòng lặp mỗi 60
                  năm.
                </li>
              </ul>

              <p className="text-sm text-foreground/70">
                Ba lỗi hay gặp. <strong>Đảo hai phép chia</strong> — 10 là số can nên chia 10 mới ra
                can, 12 là số chi nên chia 12 mới ra chi. <strong>Đếm từ 1 thay vì từ 0</strong> —
                dư 0 là Giáp và là Tý, lệch một bậc là ra tên khác hoàn toàn. Và{' '}
                <strong>quên rằng can chi năm đổi theo lịch âm, không đổi ngày 1/1 dương</strong> —
                người sinh tháng 1 hoặc đầu tháng 2 dương lịch (trước Tết) thường vẫn thuộc can chi
                của năm liền trước, hãy đối chiếu ngày Tết của năm sinh.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Cùng bộ chữ ấy còn dùng cho tháng, ngày, giờ
              </h3>
              <p>
                Can chi <strong>không chỉ dành cho năm</strong>: người xưa dùng đúng bộ 10 can và 12
                chi này để đánh số cả <strong>tháng, ngày và giờ</strong>, nên một thời điểm viết
                được bằng bốn cặp — chính là “tứ trụ”, tám chữ trong môn Bát Tự. Cách <em>đọc</em>{' '}
                bốn tầng là như nhau, nhưng cách <em>suy ra</em> thì mỗi tầng một luật riêng, không
                suy thẳng từ can chi năm được: can chi ngày chạy liên tục theo chu kỳ 60 ngày, can
                chi giờ chia ngày thành 12 khung hai tiếng, còn can chi tháng phụ thuộc can của năm.
                Cách dựng bốn trụ nằm ở{' '}
                <Link href="/learn/bat-tu" className="text-gold-700 underline-offset-4 hover:underline">
                  bài Bát Tự
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: can chi đánh số thời gian, không phán về người',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là phần quan trọng nhất của bài, và cũng là phần dễ bị bỏ qua nhất. Can chi{' '}
                <strong>là một hệ đánh số thời gian</strong> — cùng loại với lịch. Nói “năm Bính
                Ngọ” đúng bằng nói “năm 2026”; nói “giờ Tý” đúng bằng nói “khoảng 23h đến 1h”. Bản
                thân những cái tên ấy <strong>không chứa lời khen chê nào</strong>. Muốn biết một
                khẳng định thuộc tầng nào, hỏi xem nó có suy ra được từ hai dãy can chi và phép
                chia lấy dư không:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>“2026 là năm Bính Ngọ”</strong> và <strong>“không có cặp Giáp Sửu”</strong>{' '}
                  — đều suy ra được, ai tính cũng ra một kết quả. Đây là{' '}
                  <strong>dữ kiện lịch pháp</strong>.
                </li>
                <li>
                  <strong>“Người tuổi Bính Ngọ tính cách thế này, năm nay vận thế kia”</strong> —
                  không suy ra được từ bộ máy can chi. Đây là{' '}
                  <strong>tầng diễn giải gán thêm phía trên</strong>, mỗi trường phái một luật, nên
                  đọc như quan niệm để tham khảo.
                </li>
              </ul>
              <p>
                Bằng chứng thẳng thắn nhất:{' '}
                <strong>mọi người sinh cùng một năm đều mang cùng một can chi năm</strong> — hàng
                triệu người, mà cuộc đời họ rõ ràng không giống nhau.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Can chi tuần hoàn, không tuyến tính.</strong> Nghe một tên can chi, bạn{' '}
                  <strong>không biết đó là năm nào</strong> nếu không biết thêm thế kỷ — đây là lý
                  do sử liệu ghi năm can chi thường phải kèm niên hiệu.
                </li>
                <li>
                  <strong>Mốc đổi năm không thống nhất.</strong> Lịch âm dân dụng đổi năm vào Tết,
                  còn mệnh lý Bát Tự đổi trụ năm ở tiết Lập Xuân — hai nguồn có thể ghi khác nhau
                  cho người sinh sát mốc, thường là khác quy ước chứ không phải bên nào tính sai.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                hieu.asia giữ ranh giới này có chủ đích: phần tính toán công khai và tái lập được,
                phần diễn giải nói rõ là để tham khảo. Hiểu can chi ở đúng tầng của nó, bạn dùng nó
                thoải mái — tra cứu tuổi tác, đọc sử liệu, lập lá số — mà không để một cái tên
                định nghĩa mình.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <CanChiWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <CanChiRecall />,
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
                Can chi là tầng nền; các chủ đề dựng trên nó có bài và công cụ riêng — mệnh nạp âm
                theo năm sinh tại{' '}
                <Link href="/ban-menh" className="text-gold-700 underline-offset-4 hover:underline">
                  ngũ hành bản mệnh
                </Link>
                , quan hệ hợp – xung giữa 12 chi tại{' '}
                <Link href="/tuong-hop-12-con-giap" className="text-gold-700 underline-offset-4 hover:underline">
                  bản đồ tương hợp 12 con giáp
                </Link>
                . Muốn đối chiếu ngay năm sinh của mình với trọn vòng 60?{' '}
                <Link href="/luc-thap-hoa-giap" className="text-gold-700 underline-offset-4 hover:underline">
                  Mở bảng tra 60 Can Chi →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/luc-thap-hoa-giap', label: 'Bảng tra 60 Can Chi' },
                    { href: '/tra-cuu-tuoi', label: 'Tra cứu tuổi trọn đời' },
                    { href: '/ban-menh', label: 'Ngũ hành bản mệnh theo năm' },
                    { href: '/la-so-bat-tu', label: 'Lập lá số Bát Tự' },
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
          children: <CanChiChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

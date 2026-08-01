/**
 * Bài học /learn/khai-truong — sở hữu chủ đề THÁI TUẾ và việc mở hàng.
 *
 * GROUNDING — mọi quy tắc, bảng và con số trên trang này do engine tính lúc
 * render, không gõ tay:
 *   • lib/khai-truong.ts → checkOpeningYear() (xét ĐÚNG hai hạn: Tam Tai và
 *     xung Thái Tuế; verdict = tamTai ? 'pham' : xung ? 'can-nhac' : 'thuan';
 *     mảng `reasons` diễn giải từng bước, trong đó có câu "Năm X trùng chi tuổi
 *     (năm tuổi / Thái Tuế) — chỉ là lưu ý nhẹ, không phải hạn cấm khai
 *     trương"), OPENING_VERDICT_LABEL, scanOpeningYears(), goodOpeningYearsFrom(),
 *     TAM_TAI_YEARS, và ghi chú engine cố ý LOẠI Kim Lâu / Hoang Ốc (hai hạn đó
 *     dành cho cưới hỏi và xây nhà).
 *   • lib/xem-tuoi-cuoi.ts → CHI, ANIMAL_BY_CHI, LUC_XUNG (6 cặp chi đối nhau),
 *     canChiOfYear() — bảng Thái Tuế RENDER TỪ ba thứ này, cột "số năm hợp
 *     trong 12 năm" đếm bằng chính scanOpeningYears().
 *   • trang công cụ app/khai-truong/ (page.tsx + years.ts + KhaiTruongChecker)
 *     → xét tuổi NGƯỜI ĐỨNG TÊN kinh doanh; nhập năm sinh dương lịch; tuổi tính
 *     theo năm âm lịch (sinh tháng 1–2 dương trước Tết thì nhập lùi 1 năm); bước
 *     tiếp sau xem tuổi là chọn NGÀY GIỜ; "quyết định mở hay hoãn nên dựa trên
 *     thị trường, vốn và việc chuẩn bị".
 *
 * PHÂN VAI: KHÔNG dạy lại cơ chế Tam Tai (→ /learn/tam-tai), hình học vòng 12
 * chi (→ /learn/tam-hop-luc-xung), chọn ngày tốt (→ /learn/trach-cat) hay cách
 * khởi giờ (→ /learn/gio-hoang-dao) — chỉ nhắc tên kèm link.
 *
 * Giọng: phong tục để THAM KHẢO, không phán số mệnh, không hù doạ, không bán
 * lễ "giải hạn".
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
import {
  checkOpeningYear,
  scanOpeningYears,
  goodOpeningYearsFrom,
  canChiOfYear,
  OPENING_VERDICT_LABEL,
  TAM_TAI_YEARS,
  type OpeningVerdict,
} from '@/lib/khai-truong';
import { CHI, ANIMAL_BY_CHI, LUC_XUNG, type Chi } from '@/lib/xem-tuoi-cuoi';
import {
  KhaiTruongFrame,
  KhaiTruongDepth,
  KhaiTruongRecall,
  KhaiTruongChecklist,
  KhaiTruongWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Xem tuổi khai trương — Thái Tuế và năm tuổi',
  description:
    'Thái Tuế là gì, xung Thái Tuế khác “năm tuổi” ra sao, và cách chọn năm – ngày – giờ khai trương theo tuổi người đứng tên. Phong tục tham khảo, không hù doạ.',
  alternates: { canonical: 'https://hieu.asia/learn/khai-truong' },
};

// ── Mốc năm dùng cho ví dụ ────────────────────────────────────────────
// Cố định để bài đọc ổn định qua từng năm; MỌI kết luận trong ví dụ đều do
// engine tính lúc render, trang không gõ tay một verdict nào. Công cụ
// /khai-truong mới là chỗ tra năm hiện tại (nó tự lật năm vào mùng 1 Tết).
const VD_YEAR = 2027;
const VD_NAM_TUOI_YEAR = 2028;
/** Mốc để cột "năm dương lịch" trong bảng Thái Tuế có gốc rõ ràng. */
const BANG_BASE_YEAR = 2027;

/** Năm dương lịch gần nhất kể từ `from` có đúng chi này (12 năm liên tiếp phủ đủ 12 chi). */
function nextYearWithChi(chi: Chi, from: number): number {
  for (let y = from; y < from + 12; y += 1) {
    if (canChiOfYear(y).chi === chi) return y;
  }
  return from;
}

// Bảng tra Thái Tuế theo tuổi — RENDER TỪ LIB: chi đối lấy từ LUC_XUNG, con
// giáp lấy từ ANIMAL_BY_CHI, năm dương lịch lấy từ canChiOfYear, cột cuối đếm
// bằng chính scanOpeningYears() nên không thể lệch với công cụ.
const THAI_TUE_ROWS = CHI.map((chi) => {
  const xungChi = LUC_XUNG[chi];
  // Một năm sinh đại diện cho chi này, chỉ dùng để chạy engine (không hiển thị).
  const sampleBirthYear = nextYearWithChi(chi, 1960);
  return {
    chi,
    animal: ANIMAL_BY_CHI[chi],
    namTuoiYear: nextYearWithChi(chi, BANG_BASE_YEAR),
    xungChi,
    xungYear: nextYearWithChi(xungChi, BANG_BASE_YEAR),
    hopCount: scanOpeningYears(sampleBirthYear, BANG_BASE_YEAR, 12).filter(
      (r) => r.verdict === 'thuan',
    ).length,
  };
});

// Số năm hợp ít nhất / nhiều nhất trong 12 năm — ĐẾM từ bảng trên, không gõ tay.
const MIN_HOP = Math.min(...THAI_TUE_ROWS.map((r) => r.hopCount));
const MAX_HOP = Math.max(...THAI_TUE_ROWS.map((r) => r.hopCount));
/**
 * Các tuổi mà năm xung Thái Tuế rơi TRÙNG vào bên trong 3 năm Tam Tai của chính
 * nhóm tuổi đó — suy thẳng từ TAM_TAI_YEARS + LUC_XUNG. Đây là các tuổi bị trừ
 * 3 năm thay vì 4, tức lý do cột cuối của bảng không đồng loạt bằng nhau.
 */
const OVERLAP_CHIS = CHI.filter((chi) => TAM_TAI_YEARS[chi].includes(LUC_XUNG[chi]));

// Thang 3 bậc kết luận — đúng thứ tự ưu tiên trong checkOpeningYear().
const VERDICT_LADDER: { when: string; verdict: OpeningVerdict }[] = [
  { when: 'Chi năm nằm trong 3 năm Tam Tai của tuổi', verdict: 'pham' },
  { when: 'Không vướng Tam Tai, nhưng chi năm đối chi tuổi', verdict: 'can-nhac' },
  { when: 'Không vướng cả hai (kể cả khi trùng chi tuổi — năm tuổi)', verdict: 'thuan' },
];

// Ví dụ tính tay: chỉ NĂM SINH và NĂM XEM là do người viết chọn; mọi kết luận
// bên dưới đều do checkOpeningYear() tính.
const EX_TAM_TAI = checkOpeningYear(1975, VD_YEAR);
const EX_XUNG = checkOpeningYear(1985, VD_YEAR);
const EX_THUAN = checkOpeningYear(1980, VD_YEAR);
const EX_NAM_TUOI = checkOpeningYear(1980, VD_NAM_TUOI_YEAR);
const WORKED_EXAMPLES = [EX_THUAN, EX_XUNG, EX_TAM_TAI, EX_NAM_TUOI];

/** Các năm hợp tuổi gần nhất của chủ trong ví dụ Tam Tai — engine tự liệt kê. */
const EX_TAM_TAI_GOOD_YEARS = goodOpeningYearsFrom(EX_TAM_TAI.birthYear, VD_YEAR, 4);

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) → chữ
// schema === chữ hiển thị (chống cloaking). Câu hỏi cố ý KHÁC bộ FAQ trên trang
// công cụ /khai-truong: ở đó hỏi "xem những yếu tố nào / tính theo tuổi ai",
// ở đây đào vào Thái Tuế và quy trình.
const FAQS = [
  {
    q: 'Thái Tuế là gì trong cách xem tuổi khai trương?',
    a: 'Trong cách tính của hieu.asia, Thái Tuế được đọc qua chi (con giáp) của năm đang xét. Công cụ lấy chi của năm định khai trương đặt cạnh chi của năm sinh chủ, rồi chỉ xét đúng hai quan hệ: chi năm trùng chi tuổi, gọi là "năm tuổi"; và chi năm đối chi tuổi theo bảng lục xung, gọi là "xung Thái Tuế". Trang này chỉ nói phần Thái Tuế cần cho việc mở hàng — khái niệm đầy đủ, gồm cả những biến thể mà công cụ không tính, nằm ở bài Thái Tuế và năm tuổi.',
  },
  {
    q: 'Xung Thái Tuế và "năm tuổi" khác nhau chỗ nào?',
    a: 'Khác cả cách tính lẫn mức kết luận. "Năm tuổi" là khi chi của năm trùng đúng chi tuổi bạn — ví dụ người tuổi Ngọ gặp năm Ngọ. "Xung Thái Tuế" là khi chi của năm đối chi tuổi trên vòng 12 chi, tức rơi vào một trong sáu cặp Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi. Về kết luận, năm tuổi không hạ bậc nào: công cụ vẫn xếp là hợp tuổi khai trương và chỉ kèm một dòng lưu ý nhẹ. Còn năm xung thì hạ xuống bậc cần cân nhắc. Hai điều này không bao giờ rơi vào cùng một năm.',
  },
  {
    q: 'Vì sao mỗi 12 năm chỉ có đúng một năm tuổi và một năm xung Thái Tuế?',
    a: 'Vì 12 địa chi xếp thành một vòng và chi của năm chạy hết vòng đó sau đúng 12 năm. Trong một vòng như vậy, chi năm trùng chi tuổi bạn đúng một lần, đó là năm tuổi. Chi đối của tuổi bạn cũng chỉ xuất hiện đúng một lần, đó là năm xung Thái Tuế. Vì lục xung là hai chi đối nhau, tức cách nhau nửa vòng, nên năm tuổi và năm xung của cùng một người luôn cách nhau đúng 6 năm.',
  },
  {
    q: 'Trong 12 năm, một người có bao nhiêu năm hợp tuổi khai trương?',
    a: `Từ ${MIN_HOP} đến ${MAX_HOP} năm, tuỳ tuổi. Cách đếm: trong mỗi 12 năm có 3 năm Tam Tai của nhóm tuổi bạn và 1 năm xung Thái Tuế; riêng ${OVERLAP_CHIS.length} tuổi ${OVERLAP_CHIS.join(', ')} thì năm xung rơi trùng vào bên trong ba năm Tam Tai nên chỉ mất 3 năm thay vì 4. Nói cách khác, kể cả trường hợp bất lợi nhất thì vẫn có khoảng hai phần ba số năm được xếp là hợp tuổi khai trương. Đây là lý do không có ai phải hoãn việc mở hàng vô thời hạn.`,
  },
  {
    q: 'Vì sao xem tuổi khai trương lại xét tuổi người đứng tên chứ không phải cả nhà?',
    a: 'Vì tục lệ gắn việc khởi sự với người chịu trách nhiệm khởi sự — chủ cửa hàng hoặc chủ doanh nghiệp đứng ra mở hàng. Công cụ vì thế chỉ hỏi một ô: năm sinh dương lịch của người đứng tên kinh doanh. Một lưu ý dễ sai khi tự nhập: tuổi ở đây tính theo năm âm lịch, nên nếu người đó sinh vào tháng 1 hoặc tháng 2 dương lịch trước Tết thì năm âm là năm liền trước, phải nhập lùi 1 năm.',
  },
  {
    q: 'Nhờ người hợp tuổi đứng tên khai trương thay thì có thật sự đổi được gì không?',
    a: 'Đây là cách nhiều gia đình vẫn làm khi chủ vướng hạn mà không muốn dời lịch: nhờ một người thân hợp tuổi đứng ra khai trương tượng trưng. Cần thấy đúng bản chất của nó: đây là một nghi thức theo tục lệ, làm cho yên tâm về mặt phong tục, chứ không thay đổi bất cứ điều gì trong chuyện buôn bán. Nếu nó giúp gia đình bớt căng thẳng thì cứ làm, nhưng đừng coi nó là một bước quản trị. Việc mở hay hoãn vẫn nên dựa trên thị trường, vốn và mức chuẩn bị của bạn.',
  },
  {
    q: 'Chọn được năm hợp tuổi rồi thì còn phải làm gì nữa?',
    a: 'Còn hai tầng nữa và cả hai đều dùng cách tính khác hẳn. Tầng hai là chọn NGÀY mở hàng trong năm đó: ưu tiên ngày hoàng đạo, hợp mệnh, tránh những ngày dân gian kiêng. Tầng ba là chọn GIỜ trong ngày đã chọn. Thứ tự thực hành gọn nhất là năm rồi tới ngày rồi tới giờ, vì lọc năm là bước rẻ nhất và loại được nhiều lựa chọn nhất. Làm ngược lại thì bạn có thể chọn xong một ngày rất đẹp nằm trong một năm mà chính bạn muốn tránh.',
  },
  {
    q: 'Chọn được năm và ngày đẹp thì cửa hàng có đông khách hơn không?',
    a: 'Không. Cần nói thẳng điều này. Toàn bộ việc xem tuổi và chọn ngày chỉ là cách chọn một cái mốc theo phong tục, và nó chạy trên đúng hai con số là năm sinh với năm định mở. Thứ quyết định một cửa hàng sống được là sản phẩm, vị trí, dòng tiền và lượng khách quay lại. Một ngày khai trương đẹp không cứu được hàng hoá không ai cần, và một ngày bình thường cũng không dìm được một quán ngon nằm đúng chỗ. hieu.asia tính minh bạch để bạn tham khảo, không doạ vận hạn và không bán lễ "giải hạn".',
  },
];

const JSONLD = [
  article({
    headline: 'Xem tuổi khai trương: Thái Tuế, năm tuổi và cách chọn năm – ngày – giờ mở hàng',
    description:
      'Thái Tuế trong tục xem tuổi khai trương là chi của năm; xung Thái Tuế là chi năm đối chi tuổi, còn năm tuổi là chi năm trùng chi tuổi và chỉ là lưu ý nhẹ.',
    url: '/learn/khai-truong',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Xem tuổi khai trương', url: '/learn/khai-truong' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Xem tuổi khai trương — Thái Tuế và năm tuổi',
    description:
      'Thái Tuế là gì, xung Thái Tuế khác “năm tuổi” ra sao, và cách chọn năm – ngày – giờ khai trương theo tuổi người đứng tên. Phong tục tham khảo, không hù doạ.',
    url: '/learn/khai-truong',
  }),
];

/** Link vàng trong thân bài — gói lại vì bài dùng hơn chục lần. */
function GoldLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-gold-700 underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

function VerdictCell({ verdict }: { verdict: OpeningVerdict }) {
  const tone =
    verdict === 'thuan'
      ? 'text-emerald-700 dark:text-emerald-300'
      : verdict === 'can-nhac'
        ? 'text-amber-700 dark:text-amber-300'
        : 'text-rose-700 dark:text-rose-300';
  return <span className={tone}>{OPENING_VERDICT_LABEL[verdict]}</span>;
}

const TH = 'px-4 py-2.5 font-semibold text-foreground';

export default function LearnKhaiTruongPage() {
  return (
    <LearnArticle
      eyebrow="PHONG TỤC · KINH DOANH"
      title={
        <>
          Xem tuổi khai trương{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">(Thái Tuế)</span>
        </>
      }
      standfirst={
        <>
          Sắp mở hàng, ai cũng gặp một câu hỏi giống nhau: “năm nay tuổi mình có khai trương được
          không?”. Câu trả lời của tục lệ nằm gọn trong một phép so hai con giáp — con giáp của năm
          và con giáp của người đứng tên. Bài này mở phép so ấy ra để bạn tự quyết, thay vì lo theo
          lời người khác.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Xem tuổi khai trương' },
      ]}
      relatedLenses={relatedLearnLenses('khai-truong')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh người đứng tên kinh doanh và năm định mở hàng, hệ thống hiện rõ từng bước tính — có vướng Tam Tai không, có xung Thái Tuế không — kèm danh sách các năm hợp tuổi gần nhất để bạn cân nhắc.',
        href: '/khai-truong',
        label: 'Xem tuổi khai trương',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <KhaiTruongFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Xem tuổi khai trương là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Xem tuổi khai trương</strong> — hay xem tuổi mở hàng — là việc đặt{' '}
                <strong>tuổi của người đứng tên kinh doanh</strong> cạnh{' '}
                <strong>năm định mở cửa</strong>, rồi hỏi xem năm ấy có vướng hạn nào mà dân gian
                dặn tránh khi khởi sự hay không. Toàn bộ phép xét gói trong <strong>hai hạn</strong>
                : Tam Tai và xung Thái Tuế.
              </p>
              <p>
                Nó gọn hơn nhiều người tưởng. Không cần giờ sinh, không cần lá số, không cần thầy —
                chỉ cần <strong>năm sinh của chủ</strong> và <strong>năm bạn định mở</strong>. Hai
                con số ấy đổi ra can chi, so hai chi với nhau, là ra kết luận.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Đây là <strong>tục lệ để tham khảo</strong> khi chọn năm khởi sự — không phải lời
                  phán số mệnh, cũng không phải điều cấm.
                </li>
                <li>
                  Nó <strong>không xét Kim Lâu hay Hoang Ốc</strong>. Hai hạn đó dành riêng cho{' '}
                  <GoldLink href="/learn/kim-lau">cưới hỏi</GoldLink> và{' '}
                  <GoldLink href="/learn/hoang-oc">xây nhà</GoldLink>. hieu.asia cố ý loại chúng khỏi
                  phép tính khai trương để khỏi doạ sai.
                </li>
                <li>
                  Nó chỉ trả lời câu hỏi về <strong>NĂM</strong>. Chọn ngày và chọn giờ mở hàng là
                  hai tầng khác, tính bằng cách khác.
                </li>
                <li>
                  Và nó <strong>không hứa gì</strong> về việc buôn bán. Không có phép tính nào ở đây
                  biết cửa hàng của bạn bán gì, nằm ở đâu, giá vốn bao nhiêu.
                </li>
              </ul>
              <p>
                Một câu để giữ đúng tinh thần: hieu.asia trình bày cách tính{' '}
                <strong>minh bạch từng bước</strong> để bạn tự quyết,{' '}
                <strong>không doạ vận hạn và không bán lễ “giải hạn”</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <KhaiTruongDepth />,
        },
        {
          id: 'thai-tue-la-gi',
          tocLabel: 'Thái Tuế là gì',
          heading: 'Thái Tuế, xung Thái Tuế và “năm tuổi”',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mỗi năm âm lịch mang một cặp <strong>can chi</strong> riêng — {VD_YEAR} là năm{' '}
                {canChiOfYear(VD_YEAR).name}, {VD_NAM_TUOI_YEAR} là năm{' '}
                {canChiOfYear(VD_NAM_TUOI_YEAR).name}. Phần <strong>chi</strong> chính là con giáp
                của năm. Trong cách tính của hieu.asia,{' '}
                <strong>Thái Tuế được đọc qua chi của năm</strong> đang xét.
              </p>
              <p className="text-sm text-foreground/70">
                Trang này chỉ lấy phần Thái Tuế cần cho việc mở hàng. Khái niệm đầy đủ — tên gọi đến
                từ chu kỳ Mộc tinh, bốn quan hệ trùng – xung – hình – hại, và quan hệ nào công cụ
                thật sự tính —{' '}
                <Link
                  href="/learn/thai-tue"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  đọc ở bài Thái Tuế và năm tuổi
                </Link>
                .
              </p>
              <p>
                Tuổi bạn cũng có một chi — chi của năm sinh. Toàn bộ phần “Thái Tuế” trong xem tuổi
                khai trương vì thế thu về đúng <strong>hai câu hỏi</strong>:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Chi năm có trùng chi tuổi không?</strong> Nếu trùng, dân gian gọi đó là{' '}
                  <strong>“năm tuổi”</strong>. Công cụ ghi rõ đây{' '}
                  <strong>chỉ là lưu ý nhẹ, không phải hạn cấm khai trương</strong> — kết luận vẫn
                  là hợp tuổi.
                </li>
                <li>
                  <strong>Chi năm có đối chi tuổi không?</strong> Sáu cặp chi đối nhau là Tý–Ngọ,
                  Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi. Rơi vào đây thì gọi là{' '}
                  <strong>xung Thái Tuế</strong> — năm “khắc” tuổi, và kết luận hạ xuống bậc cần cân
                  nhắc.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Đây là chỗ nghe truyền miệng hay bị gộp làm một. “Năm tuổi” và “xung Thái Tuế” được
                tính bằng <strong>hai phép so khác nhau</strong>, cho{' '}
                <strong>hai mức khác nhau</strong>, và không bao giờ rơi vào cùng một năm. Vì sao hai
                chi cách nhau 6 bước lại được coi là đối nhau thì phần hình học nằm ở bài{' '}
                <GoldLink href="/learn/tam-hop-luc-xung">Tam hợp – Lục xung</GoldLink>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bảng tra theo tuổi: năm tuổi và năm xung Thái Tuế
              </h3>
              <p>
                Tìm dòng ứng với con giáp của người đứng tên. Cột năm dương lịch là lần gần nhất kể
                từ năm {BANG_BASE_YEAR}; muốn lần tiếp theo thì cộng thêm 12.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>
                        Tuổi (chi)
                      </th>
                      <th scope="col" className={TH}>
                        Năm tuổi — lưu ý nhẹ
                      </th>
                      <th scope="col" className={TH}>
                        Xung Thái Tuế — cân nhắc
                      </th>
                      <th scope="col" className={TH}>
                        Số năm hợp / 12 năm
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {THAI_TUE_ROWS.map((row) => (
                      <tr key={row.chi} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">
                          {row.chi} ({row.animal})
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          năm {row.chi} — <span className="tabular-nums">{row.namTuoiYear}</span>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          năm {row.xungChi} — <span className="tabular-nums">{row.xungYear}</span>
                        </td>
                        <td className="px-4 py-2 tabular-nums text-foreground">{row.hopCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Hai điều đáng nhìn kỹ. Thứ nhất,{' '}
                <strong>năm tuổi và năm xung của cùng một tuổi luôn cách nhau đúng 6 năm</strong> —
                vì chi đối nằm ở nửa vòng bên kia. Thứ hai, cột cuối cho thấy kể cả tuổi bất lợi
                nhất vẫn có <strong>{MIN_HOP} trong 12 năm được xếp là hợp tuổi</strong>, tuổi thuận
                nhất thì {MAX_HOP}. Cột này do chính công cụ đếm: quét 12 năm liên tiếp rồi đếm số
                năm không vướng gì.
              </p>
              <p className="text-sm text-foreground/70">
                Phần bị trừ ra ở cột cuối chủ yếu là <strong>3 năm Tam Tai</strong> của nhóm tuổi.
                Tam Tai có luật riêng và một bài riêng — xem{' '}
                <GoldLink href="/learn/tam-tai">Tam Tai là gì</GoldLink>. Ở đây chỉ cần nhớ: nó là
                bậc nặng nhất trong ba bậc kết luận của xem tuổi khai trương.
              </p>
            </div>
          ),
        },
        {
          id: 'chon-nam-ngay-gio',
          tocLabel: 'Chọn năm – ngày – giờ',
          heading: 'Quy trình: từ tuổi người đứng tên tới năm, ngày và giờ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">Bước 1 — Chốt xem tuổi của ai</h3>
              <p>
                Theo tục, xét tuổi <strong>người đứng tên kinh doanh</strong>: chủ cửa hàng hoặc chủ
                doanh nghiệp đứng ra mở hàng. Công cụ chỉ hỏi <strong>năm sinh dương lịch</strong>{' '}
                của người đó.
              </p>
              <p className="text-sm text-foreground/70">
                Một lưu ý dễ sai: tuổi ở đây tính theo <strong>năm âm lịch</strong>. Nếu người đứng
                tên sinh vào <strong>tháng 1–2 dương lịch trước Tết</strong>, năm âm của họ là năm
                liền trước — phải nhập lùi 1 năm, nếu không cả bảng sẽ lệch nguyên một chi.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — Đổi hai năm ra can chi, rồi so hai chi
              </h3>
              <p>
                Đổi năm sinh và năm định mở sang can chi, chỉ giữ phần <strong>chi</strong>. Sau đó
                so ba khả năng: chi năm nằm trong 3 năm Tam Tai của tuổi, chi năm{' '}
                <strong>đối</strong> chi tuổi, hay chi năm <strong>trùng</strong> chi tuổi.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Đọc kết luận theo ba bậc
              </h3>
              <p>
                Công cụ xếp kết quả vào đúng ba bậc, theo thứ tự ưu tiên từ nặng xuống nhẹ — Tam Tai
                đè lên tất cả:
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>
                        Điều kiện
                      </th>
                      <th scope="col" className={TH}>
                        Kết luận của công cụ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {VERDICT_LADDER.map((row) => (
                      <tr key={row.verdict} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 text-muted-foreground">{row.when}</td>
                        <td className="px-4 py-2">
                          <VerdictCell verdict={row.verdict} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 4 và 5 — Chọn ngày, rồi chọn giờ
              </h3>
              <p>
                Xem tuổi mới xong tầng <strong>NĂM</strong>. Tầng hai là chọn{' '}
                <strong>ngày mở hàng</strong> trong năm đó — ưu tiên ngày hoàng đạo, hợp mệnh, tránh
                ngày dân gian kiêng; cách tính nằm ở bài{' '}
                <GoldLink href="/learn/trach-cat">Trạch cát</GoldLink> và{' '}
                <GoldLink href="/learn/ngay-kieng-ky">Ngày kiêng kỵ</GoldLink>. Tầng ba là chọn{' '}
                <strong>giờ</strong> trong ngày đã chọn — xem{' '}
                <GoldLink href="/learn/gio-hoang-dao">Giờ hoàng đạo</GoldLink>. Ba tầng dùng ba cách
                tính riêng, không suy ra được từ nhau.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Ví dụ tính tay</h3>
              <p>
                Bốn trường hợp dưới đây chạy qua đúng ba bước ở trên. Ba dòng đầu cùng xét năm{' '}
                {VD_YEAR} ({canChiOfYear(VD_YEAR).name}) để thấy rõ một điều:{' '}
                <strong>cùng một năm, chủ khác tuổi thì kết luận khác nhau</strong> — năm không tự nó
                tốt hay xấu.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[660px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>
                        Chủ sinh
                      </th>
                      <th scope="col" className={TH}>
                        Chi tuổi
                      </th>
                      <th scope="col" className={TH}>
                        Năm định mở
                      </th>
                      <th scope="col" className={TH}>
                        Chi năm
                      </th>
                      <th scope="col" className={TH}>
                        Kết luận
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {WORKED_EXAMPLES.map((ex) => (
                      <tr
                        key={`${ex.birthYear}-${ex.targetYear}`}
                        className="border-b border-border/60 last:border-b-0"
                      >
                        <td className="px-4 py-2 text-muted-foreground">
                          <span className="tabular-nums">{ex.birthYear}</span> ({ex.birthCanChi.name}
                          )
                        </td>
                        <td className="px-4 py-2 text-foreground">{ex.birthCanChi.chi}</td>
                        <td className="px-4 py-2 text-muted-foreground">
                          <span className="tabular-nums">{ex.targetYear}</span> (
                          {ex.targetCanChi.name})
                        </td>
                        <td className="px-4 py-2 text-foreground">{ex.targetCanChi.chi}</td>
                        <td className="px-4 py-2">
                          <VerdictCell verdict={ex.verdict} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>
                    Chủ sinh {EX_XUNG.birthYear}, mở năm {EX_XUNG.targetYear}:
                  </strong>{' '}
                  chi tuổi là {EX_XUNG.xung.birthChi}, chi năm là {EX_XUNG.xung.yearChi}. Ba năm Tam
                  Tai của tuổi {EX_XUNG.tamTai.birthChi} là {EX_XUNG.tamTai.tamTaiChis.join(', ')} —
                  không có {EX_XUNG.xung.yearChi}, nên qua được bước Tam Tai. Nhưng{' '}
                  {EX_XUNG.xung.birthChi} và {EX_XUNG.xung.yearChi} là một cặp chi đối, tức{' '}
                  <strong>xung Thái Tuế</strong> → kết luận “
                  {OPENING_VERDICT_LABEL[EX_XUNG.verdict]}”.
                </li>
                <li>
                  <strong>
                    Chủ sinh {EX_TAM_TAI.birthYear}, mở năm {EX_TAM_TAI.targetYear}:
                  </strong>{' '}
                  chi tuổi {EX_TAM_TAI.tamTai.birthChi} có ba năm Tam Tai là{' '}
                  {EX_TAM_TAI.tamTai.tamTaiChis.join(', ')}, mà chi năm là{' '}
                  {EX_TAM_TAI.tamTai.yearChi} — nằm đúng trong đó. Tam Tai đè lên mọi thứ còn lại nên
                  không cần xét tiếp: kết luận “{OPENING_VERDICT_LABEL[EX_TAM_TAI.verdict]}”. Các năm
                  hợp tuổi gần nhất mà công cụ liệt kê cho chủ này là{' '}
                  <span className="tabular-nums">{EX_TAM_TAI_GOOD_YEARS.join(', ')}</span>.
                </li>
                <li>
                  <strong>
                    Chủ sinh {EX_NAM_TUOI.birthYear}, mở năm {EX_NAM_TUOI.targetYear}:
                  </strong>{' '}
                  chi năm {EX_NAM_TUOI.xung.yearChi} trùng đúng chi tuổi {EX_NAM_TUOI.xung.birthChi}{' '}
                  — đây là <strong>“năm tuổi”</strong>. Nhiều người nghe hai chữ này là lo, nhưng kết
                  luận của công cụ vẫn là “{OPENING_VERDICT_LABEL[EX_NAM_TUOI.verdict]}”. Cùng chủ{' '}
                  {EX_THUAN.birthYear} ấy, năm {EX_THUAN.targetYear} và năm {EX_NAM_TUOI.targetYear}{' '}
                  đều hợp tuổi.
                </li>
              </ul>
              <div className="rounded-xl border border-border bg-card/40 p-4">
                <p className="text-sm font-medium text-foreground">
                  Công cụ nói gì cho trường hợp xung ở trên
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Đây là nguyên văn các dòng diễn giải mà công cụ xuất ra cho chủ sinh{' '}
                  {EX_XUNG.birthYear} xét năm {EX_XUNG.targetYear} — bài học và công cụ dùng chung
                  một phép tính nên không thể nói hai kiểu:
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {EX_XUNG.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-foreground/70">
                Muốn thử tuổi của chính bạn thay vì đọc ví dụ,{' '}
                <GoldLink href="/khai-truong">công cụ xem tuổi khai trương</GoldLink> nhận thẳng năm
                sinh và năm định mở, rồi hiện đúng các bước này.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: cái gì thật sự quyết định một cửa hàng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này quan trọng hơn tất cả phần trên, nên nói thẳng. Xem tuổi khai trương là{' '}
                <strong>một tập tục để tham khảo</strong>. Nó chạy trên đúng hai con số — năm sinh
                của một người và năm bạn định mở cửa — và chia mọi chủ kinh doanh trên đời vào vỏn
                vẹn 12 nhóm theo con giáp. Một phép so hai chi <strong>không biết gì</strong> về cửa
                hàng cụ thể của bạn.
              </p>
              <p>
                Thứ quyết định một cửa hàng sống được là những thứ rất trần trụi:{' '}
                <strong>sản phẩm</strong> có đủ tốt để người ta quay lại không,{' '}
                <strong>vị trí</strong> có đúng luồng khách không, <strong>dòng tiền</strong> có đủ
                nuôi quán qua vài tháng đầu vắng khách không, và bạn có xây được{' '}
                <strong>lượng khách quen</strong> hay không. Bốn thứ đó, cộng với giá vốn và tay
                nghề vận hành, giải thích gần như toàn bộ chuyện một quán trụ được hay đóng cửa.
              </p>
              <p>
                Chính trang công cụ cũng viết đúng tinh thần ấy:{' '}
                <strong>quyết định mở hay hoãn nên dựa trên thị trường, vốn và việc chuẩn bị</strong>{' '}
                — những thứ ảnh hưởng thật đến cửa hàng.
              </p>
              <p>Vài giới hạn cụ thể cần ghi nhớ:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Phép tính <strong>rất thô</strong>: hai người sinh cùng năm, một người bán cà phê
                  ở mặt phố và một người bán online, nhận cùng một kết luận.
                </li>
                <li>
                  Nó <strong>không phải dự báo</strong>. “Cần cân nhắc” nghĩa là năm đó rơi vào nhóm
                  tục lệ khuyên nghĩ thêm, không phải điều gì sẽ xảy ra với bạn.
                </li>
                <li>
                  Nó <strong>không phải điều cấm</strong>. Vẫn có người khởi sự trong năm Tam Tai và
                  chọn ngày giờ kỹ hơn; người khác dời sang năm hợp tuổi gần nhất. Cả hai đều là lựa
                  chọn hợp lệ.
                </li>
                <li>
                  Và <strong>không cần “giải hạn”</strong>. hieu.asia không bán lễ giải hạn và không
                  cho rằng phải “giải” mới yên. Đã thấy phép tính chỉ là so hai con giáp, bạn sẽ thấy
                  ở đó chẳng có gì để giải.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh nhất: coi việc xem tuổi như một{' '}
                <strong>bộ lọc năm tốn ba mươi giây</strong>. Nếu nó giúp gia đình bớt tranh cãi và
                bạn yên tâm bắt tay vào việc, nó đã làm xong phần của mình. Phần còn lại — phần
                quyết định — nằm ở hàng hoá, mặt bằng và dòng tiền của bạn.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <KhaiTruongWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <KhaiTruongRecall />,
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
                Xem tuổi khai trương chỉ là tầng đầu. Hạn nặng nhất trong phép tính này là{' '}
                <GoldLink href="/learn/tam-tai">Tam Tai</GoldLink>, có luật riêng và bài riêng; còn
                vì sao hai chi lại “đối” nhau thì xem{' '}
                <GoldLink href="/learn/tam-hop-luc-xung">Tam hợp – Lục xung</GoldLink>. Chọn xong
                năm, sang tầng ngày ở <GoldLink href="/learn/trach-cat">Trạch cát</GoldLink> và tầng
                giờ ở <GoldLink href="/learn/gio-hoang-dao">Giờ hoàng đạo</GoldLink>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn biết ngay năm định mở có hợp tuổi người đứng tên không?{' '}
                <GoldLink href="/khai-truong">Xem tuổi khai trương miễn phí →</GoldLink>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/khai-truong', label: 'Xem tuổi khai trương' },
                    { href: '/xem-ngay/khai-truong', label: 'Xem ngày khai trương đẹp' },
                    { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo mở hàng' },
                    { href: '/tam-tai', label: 'Tra Tam Tai' },
                    { href: '/hop-tuoi', label: 'Hợp tuổi hợp tác kinh doanh' },
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
          children: <KhaiTruongChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

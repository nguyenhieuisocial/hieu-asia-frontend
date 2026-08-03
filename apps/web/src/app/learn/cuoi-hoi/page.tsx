/**
 * Bài học /learn/cuoi-hoi — "xem tuổi cưới" nhìn từ phần GỘP.
 *
 * GROUNDING — không con số nào trên trang này được gõ tay. lib/xem-tuoi-cuoi.ts →
 * checkWeddingYear() gộp ba hạn thành MỘT kết luận theo đúng một dòng `kimLau ||
 * tamTai → 'pham'; ngược lại xung → 'can-nhac'; còn lại 'thuan'`; VERDICT_LABEL
 * cho chữ hiển thị ba mức; goodYearsFrom() quét 8 năm lấy tối đa 3 năm 'thuan'.
 * Ví dụ tính tay chỉ khai ĐẦU VÀO (năm sinh + năm cưới), engine tính lúc render.
 * ./_active-learning.tsx → WEDDING_STATS: mọi tỉ lệ được QUÉT bằng engine trên
 * lưới 12 nhóm tuổi × trọn một chu kỳ (bội chung nhỏ nhất của chu kỳ Kim Lâu và
 * chu kỳ địa chi) nên CHÍNH XÁC, không ước lượng. Trang công cụ
 * app/xem-tuoi-cuoi/page.tsx + XemTuoiCuoiChecker.tsx: ô cô dâu bắt buộc, ô chú
 * rể tuỳ chọn; Hoang Ốc CỐ Ý không gộp (theo tục dùng khi làm nhà).
 *
 * PHÂN VAI (chống trùng): bài này KHÔNG giảng lại cơ chế từng hạn — Kim Lâu là
 * của /learn/kim-lau, Tam Tai của /learn/tam-tai, Hoang Ốc của /learn/hoang-oc,
 * chọn ngày của /learn/trach-cat. Phần sở hữu riêng: quy tắc gộp, xử lý khi các
 * hạn mâu thuẫn, xác suất còn lại khi cộng dồn điều kiện. Giọng: phong tục để
 * THAM KHẢO, không hù doạ, không bán lễ "giải hạn".
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
import { VERDICT_LABEL, checkWeddingYear, goodYearsFrom } from '@/lib/xem-tuoi-cuoi';
import {
  WEDDING_STATS as S,
  CuoiHoiFrame,
  CuoiHoiDepth,
  CuoiHoiRecall,
  CuoiHoiChecklist,
  CuoiHoiWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Xem tuổi cưới: nhiều hạn gộp thành 1 kết luận',
  description: `Công cụ xem tuổi cưới xét Kim Lâu, Tam Tai, xung năm rồi gộp bằng phép HOẶC: một hạn dính là “phạm”. Quét trọn chu kỳ, chỉ ${S.thuanPct}% số năm sạch cả ba.`,
  alternates: { canonical: 'https://hieu.asia/learn/cuoi-hoi' },
};

// Ví dụ tính tay: CHỈ khai đầu vào + lý do chọn ca đó. Mọi con số kết quả (tuổi
// mụ, số dư, chi năm, kết luận) do engine tính lúc render — không gõ tay.
const EXAMPLES: { birthYear: number; targetYear: number; why: string }[] = [
  { birthYear: 1998, targetYear: 2026, why: 'Sạch cả ba hạn' },
  { birthYear: 1996, targetYear: 2026, why: 'Hai hạn chính sạch, chỉ vướng xung năm' },
  { birthYear: 1995, targetYear: 2026, why: 'MÂU THUẪN: Kim Lâu sạch, Tam Tai dính' },
  { birthYear: 1999, targetYear: 2028, why: 'MÂU THUẪN ngược: Kim Lâu dính, Tam Tai sạch' },
  { birthYear: 1999, targetYear: 2026, why: 'Dính cả hai hạn chính cùng lúc' },
];

// Hai ca mâu thuẫn được mổ kỹ trong thân bài và trong FAQ.
const CASE_CLEAN_KL = checkWeddingYear(1995, 2026);
const CASE_CLEAN_TT = checkWeddingYear(1999, 2028);
const CASE_BOTH = checkWeddingYear(1999, 2026);
const CASE_GOOD_YEARS = goodYearsFrom(1995, 2026);

// Bậc thang điều kiện: cộng dồn thì còn bao nhiêu phần trăm năm "sạch". Mọi ô
// suy từ WEDDING_STATS (đã quét bằng engine), không có số nào gõ tay.
const LADDER: { rule: string; pct: number; note: string }[] = [
  {
    rule: 'Chỉ kiêng Kim Lâu (cô dâu)',
    pct: 100 - S.kimLauPct,
    note: `Kim Lâu dính ${S.kimLauHits} năm trong mỗi ${S.kimLauCycle} năm`,
  },
  {
    rule: 'Chỉ kiêng Tam Tai (cô dâu)',
    pct: 100 - S.tamTaiPct,
    note: `Tam Tai dính ${S.tamTaiHits} năm trong mỗi ${S.tamTaiCycle} năm`,
  },
  {
    rule: 'Kiêng cả hai — đúng ngưỡng “phạm” của công cụ',
    pct: 100 - S.phamPct,
    note: 'Đây là phần năm KHÔNG bị gắn nhãn phạm',
  },
  {
    rule: 'Thêm xung năm — đúng nhãn “thuận” của công cụ',
    pct: S.thuanPct,
    note: 'Sạch cả ba hạn, xét riêng cô dâu',
  },
  {
    rule: 'Thêm Tam Tai + xung năm của chú rể',
    pct: S.coupleCustomPct,
    note: 'Đúng tục: Kim Lâu chỉ xét cô dâu',
  },
  {
    rule: 'Thêm cả Kim Lâu của chú rể',
    pct: S.coupleStrictPct,
    note: 'Cách xét chặt nhất mà vài nhà vẫn dùng',
  },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) → chữ
// schema === chữ hiển thị (chống cloaking). Câu hỏi ĐẶT SÂU HƠN một tầng so với
// FAQ trên trang công cụ /xem-tuoi-cuoi (trang đó hỏi "xét những yếu tố nào",
// "tuổi mụ là gì"; trang này hỏi về cách GỘP và xác suất còn lại).
const FAQS = [
  {
    q: 'Phạm một hạn thôi thì đã bị coi là “không được tuổi” chưa?',
    a: `Rồi. Công cụ gộp bằng phép HOẶC chứ không cộng điểm: chỉ cần phạm Kim Lâu hoặc phạm Tam Tai là kết luận đã thành “${VERDICT_LABEL['pham']}”. Nhưng đây mới là chỗ đáng chú ý: quét trọn chu kỳ ${S.fullCycle} năm bằng chính engine của công cụ, ${S.phamFromOnePct}% số năm bị gắn nhãn phạm thật ra chỉ dính đúng MỘT hạn. Vì vậy trước khi lo, hãy đọc xem năm đó dính hạn nào và nhà bạn có thật sự kiêng hạn ấy không.`,
  },
  {
    q: 'Kim Lâu sạch mà Tam Tai phạm thì kết luận cuối cùng là gì?',
    a: `Vẫn là “${VERDICT_LABEL['pham']}”. Hai hạn này đứng ngang nhau trong phép gộp, không hạn nào cứu được hạn nào. Ví dụ cô dâu sinh ${CASE_CLEAN_KL.birthYear} cưới năm ${CASE_CLEAN_KL.targetYear}: tuổi mụ ${CASE_CLEAN_KL.kimLau.ageMu} chia ${S.kimLauCycle} dư ${CASE_CLEAN_KL.kimLau.remainder} nên Kim Lâu sạch, nhưng năm ${CASE_CLEAN_KL.tamTai.yearChi} lại nằm trong ba năm Tam Tai (${CASE_CLEAN_KL.tamTai.tamTaiChis.join(', ')}) của nhóm tuổi ${CASE_CLEAN_KL.tamTai.birthChi} — nên công cụ vẫn báo phạm.`,
  },
  {
    q: 'Phạm cả Kim Lâu lẫn Tam Tai có nặng hơn phạm một hạn không?',
    a: `Không. Công cụ chỉ có ba mức và không cộng dồn mức nặng, nên dính một hay dính hai hạn chính đều ra cùng một nhãn, cùng một lời khuyên. Trên lưới quét trọn chu kỳ, ${S.bothPct}% số năm dính cả hai hạn cùng lúc. Nếu bạn muốn biết năm đó “nặng” tới đâu thì không có câu trả lời từ phép tính này — tục lệ truyền lại không kèm thang đo nào cả.`,
  },
  {
    q: 'Xung năm và “năm tuổi” khác nhau thế nào trong kết luận?',
    a: `Xung năm (chi năm cưới lục xung chi tuổi) chỉ được xét khi Kim Lâu và Tam Tai đều sạch, và nó hạ kết luận xuống “${VERDICT_LABEL['can-nhac']}” chứ không thành phạm. Còn “năm tuổi” (năm cưới trùng chi năm sinh) chỉ được ghi ra như một lưu ý, không hạ bậc nào. Mức “cần cân nhắc” rất hiếm, chỉ ${S.canNhacPct}% số năm — một phần vì với các nhóm tuổi ${S.xungInsideTamTai.join(', ')}, năm xung lại nằm ngay trong ba năm Tam Tai nên bị Tam Tai “nuốt” trước.`,
  },
  {
    q: 'Vì sao Hoang Ốc không được gộp vào kết luận xem tuổi cưới?',
    a: 'Vì theo tục, Hoang Ốc dùng khi làm nhà chứ không phải khi cưới hỏi — dù nó cũng tra theo tuổi mụ nên nhìn rất giống Kim Lâu. Đây là quyết định về phạm vi và nó quan trọng: phép gộp là cổng HOẶC, nên thêm bất kỳ hạn nào vào cũng chỉ có thể làm GIẢM số năm được coi là sạch, không bao giờ làm tăng. Gộp bừa cho “chắc ăn” là cách nhanh nhất để kết luận rằng năm nào cũng xấu.',
  },
  {
    q: 'Kiêng đủ mọi hạn thì còn bao nhiêu phần trăm số năm “sạch”?',
    a: `Quét ${S.gridBirths} nhóm tuổi × trọn chu kỳ ${S.fullCycle} năm (${S.gridSize} trường hợp) bằng chính engine của công cụ: xét riêng cô dâu thì ${S.thuanPct}% số năm sạch cả ba hạn. Nếu cộng thêm Tam Tai và xung năm của chú rể, con số còn ${S.coupleCustomPct}%; nếu xét cả Kim Lâu của chú rể thì chỉ còn ${S.coupleStrictPct}%. Nói cách khác, kiêng càng nhiều thì gần như năm nào cũng “phạm” một thứ gì đó — đó là số học của phép HOẶC, không phải điềm gở.`,
  },
  {
    q: 'Nếu năm định cưới bị phạm thì phải chờ bao lâu mới tới năm không phạm?',
    a: `Thường là rất ngắn. Trên toàn lưới quét, chuỗi năm liên tiếp không có năm nào “thuận” dài nhất là ${S.maxDrySpell} năm, và trung bình trong ${S.window} năm tới có ${S.avgThuanInWindow} năm thuận. Không có cửa sổ ${S.window} năm nào hoàn toàn trắng tay (${S.emptyWindowPct}%). Công cụ cũng liệt kê sẵn các năm không phạm gần nhất ngay dưới kết quả, nên không ai phải hoãn cưới vô thời hạn.`,
  },
  {
    q: 'Kết luận “thuận” có nghĩa là năm đó chắc chắn tốt để cưới không?',
    a: `Không, và công cụ cố tình nói khiêm tốn: nhãn xanh ghi đúng chữ “${VERDICT_LABEL['thuan']}” chứ không hứa năm đó tốt. Nó chỉ có nghĩa là năm ấy không rơi vào các hạn mà phong tục hay xét. Những thứ thật sự quyết định một đám cưới suôn sẻ — tài chính, công việc, sức khoẻ, sự đồng thuận của hai gia đình và sự sẵn sàng của hai người — đều nằm ngoài phép tính này.`,
  },
];

const JSONLD = [
  article({
    headline: 'Xem tuổi cưới: nhiều điều kiện gộp lại thành một kết luận như thế nào',
    description:
      'Công cụ xem tuổi cưới xét Kim Lâu, Tam Tai và xung năm rồi gộp bằng phép HOẶC. Hiểu quy tắc gộp, cách xử lý khi các hạn mâu thuẫn, và tỉ lệ năm “sạch” còn lại.',
    url: '/learn/cuoi-hoi',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Xem tuổi cưới', url: '/learn/cuoi-hoi' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Xem tuổi cưới — nhiều hạn gộp thành một kết luận',
    description:
      'Học cách công cụ xem tuổi cưới gộp Kim Lâu, Tam Tai và xung năm thành một kết luận: quy tắc HOẶC, xử lý khi các hạn mâu thuẫn, và xác suất năm “sạch” thực tế.',
    url: '/learn/cuoi-hoi',
  }),
];

const TH = 'px-4 py-2.5 font-semibold text-foreground';

/** Đầu bảng dựng từ mảng để bảng 5–7 cột không nuốt cả trăm dòng JSX. */
function Thead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-border bg-card/60">
        {cols.map((c) => (
          <th key={c} scope="col" className={TH}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// Bảng "hạn nào tra theo gì". Nhịp lặp lấy từ WEDDING_STATS (dò bằng engine).
const CONDITIONS: { name: string; input: string; rhythm: string; who: string; effect: string }[] = [
  {
    name: 'Kim Lâu',
    input: 'Tuổi mụ của cô dâu trong năm cưới',
    rhythm: `${S.kimLauHits}/${S.kimLauCycle} năm`,
    who: 'Cô dâu',
    effect: VERDICT_LABEL['pham'],
  },
  {
    name: 'Tam Tai',
    input: 'Chi năm sinh + chi năm cưới',
    rhythm: `${S.tamTaiHits}/${S.tamTaiCycle} năm`,
    who: 'Cả hai người',
    effect: VERDICT_LABEL['pham'],
  },
  {
    name: 'Lục xung năm',
    input: 'Chi năm sinh + chi năm cưới',
    rhythm: `${S.xungHits}/${S.xungCycle} năm`,
    who: 'Cả hai người',
    effect: VERDICT_LABEL['can-nhac'],
  },
  {
    name: 'Năm tuổi',
    input: 'Chi năm cưới trùng chi năm sinh',
    rhythm: `${S.namTuoiHits}/${S.namTuoiCycle} năm`,
    who: 'Cả hai người',
    effect: 'Không đổi bậc — chỉ là lưu ý',
  },
  {
    name: 'Hoang Ốc',
    input: 'Tuổi mụ (theo tục dùng khi làm nhà)',
    rhythm: '—',
    who: 'Không xét ở đây',
    effect: 'Không ảnh hưởng',
  },
];

export default function LearnCuoiHoiPage() {
  const rows = EXAMPLES.map((ex) => ({ ...ex, r: checkWeddingYear(ex.birthYear, ex.targetYear) }));

  return (
    <LearnArticle
      eyebrow="PHONG TỤC · CƯỚI HỎI"
      title={
        <>
          Xem tuổi cưới{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">(gộp các hạn)</span>
        </>
      }
      standfirst={
        <>
          “Năm này không được tuổi” là một câu ngắn, nhưng phía sau nó là ba quy ước rời rạc bị gộp
          lại. Bài này mổ đúng phần gộp: công cụ xét những hạn nào, ghép chúng ra sao, xử lý thế nào
          khi hạn này phạm mà hạn kia sạch — và nếu kiêng đủ mọi thứ thì thực tế còn bao nhiêu phần
          trăm số năm là “sạch”.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Xem tuổi cưới' },
      ]}
      relatedLenses={relatedLearnLenses('cuoi-hoi')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh cô dâu (và chú rể nếu muốn) cùng năm dự định cưới — công cụ in ra từng dòng lý do cho mỗi hạn rồi mới đưa kết luận, kèm các năm không phạm gần nhất để bạn tự cân nhắc.',
        href: '/xem-tuoi-cuoi',
        label: 'Xem tuổi cưới theo năm sinh',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <CuoiHoiFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Xem tuổi cưới là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Xem tuổi cưới</strong> trả lời đúng một câu hỏi:{' '}
                <strong>NĂM này có thuận để cưới không</strong>, xét theo năm sinh. Nó không chọn
                ngày, không chấm điểm hai người có hợp nhau không, và không nói gì về chuyện sau đám
                cưới.
              </p>
              <p>
                Điểm khác biệt so với từng hạn lẻ: ở đây có <strong>nhiều điều kiện cùng lúc</strong>
                . Công cụ tra ba thứ — Kim Lâu, Tam Tai, chi năm xung chi tuổi — rồi rút tất cả về{' '}
                <strong>một trong ba mức</strong>. Chính bước rút gọn đó là nơi mọi hiểu nhầm sinh
                ra, và cũng là phần bài này dạy.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Kết luận là <strong>kết quả của một phép HOẶC</strong>, không phải điểm số — không
                  có “năm 8 điểm” hay “năm 5 điểm”, chỉ có ba nhãn.
                </li>
                <li>
                  Nhãn xanh nói rất khiêm tốn: <strong>“{VERDICT_LABEL['thuan']}”</strong> — nghĩa là
                  không rơi vào các hạn thường xét, chứ không hứa năm đó tốt.
                </li>
                <li>
                  Nhãn đỏ <strong>không phải điều cấm</strong>: nó chỉ báo năm đó dính ít nhất một
                  hạn mà phong tục hay kiêng, và công cụ ghi rõ dính hạn nào.
                </li>
              </ul>
              <p>
                hieu.asia trình bày cách tính <strong>minh bạch</strong> để bạn tự quyết,{' '}
                <strong>không doạ vận hạn và không bán lễ “giải hạn”</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <CuoiHoiDepth />,
        },
        {
          id: 'cac-dieu-kien',
          tocLabel: 'Các điều kiện được xét',
          heading: 'Công cụ xét những hạn nào — và cố ý bỏ hạn nào ra',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ba hạn dưới đây là toàn bộ đầu vào của kết luận. Mỗi hạn có bài học riêng nên ở đây
                chỉ tóm một hai câu — phần bạn cần nhớ là{' '}
                <strong>chúng tra theo dữ kiện gì và áp cho ai</strong>.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Kim Lâu</strong> — lấy tuổi mụ của cô dâu trong năm cưới rồi chia{' '}
                  {S.kimLauCycle}, một số dư nhất định thì gọi là phạm. Cơ chế đầy đủ, bốn tên gọi và
                  cách tự tính nằm ở{' '}
                  <Link
                    href="/learn/kim-lau"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    bài Kim Lâu
                  </Link>
                  .
                </li>
                <li>
                  <strong>Tam Tai</strong> — mỗi nhóm tuổi tam hợp gặp Tam Tai vào{' '}
                  {S.tamTaiHits} năm liền nhau cố định trong vòng {S.tamTaiCycle} chi. Vì sao lại là
                  ba năm ấy, và tra thế nào, xem{' '}
                  <Link
                    href="/learn/tam-tai"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    bài Tam Tai
                  </Link>
                  .
                </li>
                <li>
                  <strong>Lục xung năm</strong> — chi của năm cưới xung với chi của năm sinh (Tý–Ngọ,
                  Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi). Đây là hạn nhẹ nhất trong ba hạn,
                  và nền tảng chi tiết nằm ở{' '}
                  <Link
                    href="/learn/tam-hop-luc-xung"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    bài Tam hợp – Lục xung
                  </Link>
                  .
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">
                Bảng tóm tắt: hạn nào tra theo gì
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <Thead
                    cols={['Hạn', 'Tra theo dữ kiện gì', 'Nhịp lặp', 'Áp cho ai', 'Đẩy kết luận thành']}
                  />
                  <tbody className="text-muted-foreground">
                    {CONDITIONS.map((c) => (
                      <tr key={c.name} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">{c.name}</td>
                        <td className="px-4 py-2">{c.input}</td>
                        <td className="px-4 py-2 tabular-nums">{c.rhythm}</td>
                        <td className="px-4 py-2">{c.who}</td>
                        <td className="px-4 py-2 text-foreground">{c.effect}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Cái được cố ý để NGOÀI: Hoang Ốc
              </h3>
              <p>
                Hoang Ốc cũng tra theo tuổi mụ nên nhìn rất giống Kim Lâu, và nhiều người tưởng phải
                xét luôn khi cưới. Nhưng theo tục nó dùng khi <strong>làm nhà</strong>, nên công cụ
                xem tuổi cưới <strong>cố ý không gộp</strong> và nói rõ điều đó ngay trên trang. Cơ
                chế của nó nằm ở{' '}
                <Link href="/learn/hoang-oc" className="text-gold-700 underline-offset-4 hover:underline">
                  bài Hoang Ốc
                </Link>
                .
              </p>
              <p className="text-sm text-foreground/70">
                Đây không phải chuyện vụn vặt. Vì phép gộp là cổng HOẶC (mục kế tiếp), thêm bất kỳ
                hạn nào vào cũng <strong>chỉ có thể làm giảm</strong> số năm được coi là sạch. Một
                công cụ trung thực phải nói rõ nó xét gì và bỏ gì ra, thay vì gộp bừa cho “chắc ăn”.
              </p>
            </div>
          ),
        },
        {
          id: 'gop-thanh-ket-luan',
          tocLabel: 'Quy tắc gộp',
          heading: 'Gộp thế nào: một hạn phạm là xong, hay còn tuỳ?',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Câu trả lời ngắn: <strong>một hạn chính phạm là xong</strong>. Công cụ hỏi ba câu nối
                tiếp nhau, dừng ngay ở câu đầu tiên có đáp án “có”:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Có phạm <strong>Kim Lâu</strong> HOẶC <strong>Tam Tai</strong> không? Có → “
                  {VERDICT_LABEL['pham']}”. Hết.
                </li>
                <li>
                  Nếu không: chi năm cưới có <strong>lục xung</strong> chi tuổi không? Có → “
                  {VERDICT_LABEL['can-nhac']}”.
                </li>
                <li>
                  Nếu vẫn không: “<strong>{VERDICT_LABEL['thuan']}</strong>”.
                </li>
              </ol>
              <p>Ba điều rút ra, và đây là phần hay bị hiểu sai nhất:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không cộng điểm.</strong> Dính hai hạn chính cùng lúc ra{' '}
                  <em>cùng một nhãn</em> với dính một hạn. Tục lệ không kèm thang đo nào nên công cụ
                  không bịa ra thang điểm — thà thô mà trung thực.
                </li>
                <li>
                  <strong>Kim Lâu và Tam Tai ngang nhau.</strong> Không hạn nào “quan trọng hơn” để
                  cứu hạn kia: sạch Kim Lâu mà dính Tam Tai thì vẫn đỏ, và ngược lại.
                </li>
                <li>
                  <strong>“Năm tuổi” không phải hạn.</strong> Năm cưới trùng chi năm sinh chỉ là một
                  lưu ý, không hạ bậc nào. Nhiều người nhầm chỗ này.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Một chi tiết đẹp của phép gộp: với {S.xungInsideTamTai.length} nhóm tuổi{' '}
                <strong>{S.xungInsideTamTai.join(', ')}</strong>, năm lục xung lại nằm ngay trong ba
                năm Tam Tai của chính nhóm đó — nên năm xung luôn bị Tam Tai “nuốt” trước và những
                tuổi này <strong>không bao giờ nhận mức “{VERDICT_LABEL['can-nhac']}”</strong>. Đó
                cũng là lý do mức vàng rất hiếm, chỉ {S.canNhacPct}% số năm trên toàn lưới quét.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Năm ca cụ thể — tính bằng đúng engine của công cụ
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <Thead
                    cols={[
                      'Cô dâu sinh',
                      'Năm cưới',
                      'Tuổi mụ',
                      'Kim Lâu',
                      'Tam Tai',
                      'Xung năm',
                      'Kết luận',
                    ]}
                  />
                  <tbody>
                    {rows.map(({ birthYear, targetYear, r }) => (
                      <tr
                        key={`${birthYear}-${targetYear}`}
                        className="border-b border-border/60 last:border-b-0"
                      >
                        <td className="px-4 py-2 tabular-nums text-muted-foreground">
                          {birthYear} ({r.birthCanChi.name})
                        </td>
                        <td className="px-4 py-2 tabular-nums text-muted-foreground">
                          {targetYear} ({r.targetCanChi.name})
                        </td>
                        <td className="px-4 py-2 tabular-nums text-foreground">
                          {r.kimLau.ageMu} (dư {r.kimLau.remainder})
                        </td>
                        <td className="px-4 py-2 text-foreground">
                          {r.kimLau.type ? r.kimLau.type.replace('Kim Lâu ', 'Phạm — ') : 'Sạch'}
                        </td>
                        <td className="px-4 py-2 text-foreground">
                          {r.tamTai.isTamTai ? 'Phạm' : 'Sạch'}
                        </td>
                        <td className="px-4 py-2 text-foreground">
                          {r.xung.isXung ? 'Xung' : r.xung.isNamTuoi ? 'Năm tuổi' : 'Không'}
                        </td>
                        <td className="px-4 py-2 text-foreground">{VERDICT_LABEL[r.verdict]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="mt-1 list-disc space-y-1.5 pl-5 text-sm text-foreground/70">
                {rows.map(({ birthYear, targetYear, why }) => (
                  <li key={`why-${birthYear}-${targetYear}`}>
                    <strong>
                      {birthYear} × {targetYear}:
                    </strong>{' '}
                    {why}
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-foreground">
                Ca 1 — hai hạn mâu thuẫn: Kim Lâu sạch, Tam Tai dính
              </h3>
              <p>
                Cô dâu sinh {CASE_CLEAN_KL.birthYear} ({CASE_CLEAN_KL.birthCanChi.name}) định cưới
                năm {CASE_CLEAN_KL.targetYear} ({CASE_CLEAN_KL.targetCanChi.name}). Tuổi mụ{' '}
                {CASE_CLEAN_KL.kimLau.ageMu}, chia {S.kimLauCycle} dư{' '}
                {CASE_CLEAN_KL.kimLau.remainder} → <strong>Kim Lâu sạch</strong>. Nhiều nhà dừng ở
                đây và kết luận “được tuổi”. Nhưng công cụ đi tiếp và thấy năm{' '}
                {CASE_CLEAN_KL.tamTai.yearChi} nằm trong ba năm Tam Tai (
                {CASE_CLEAN_KL.tamTai.tamTaiChis.join(', ')}) của nhóm tuổi{' '}
                {CASE_CLEAN_KL.tamTai.birthChi} → <strong>Tam Tai phạm</strong>. Phép HOẶC chốt lại:{' '}
                <strong>{VERDICT_LABEL[CASE_CLEAN_KL.verdict]}</strong>.
              </p>
              <p>Ba dòng lý do công cụ in ra cho đúng ca này:</p>
              <ul className="list-disc space-y-1.5 pl-5 text-sm">
                {CASE_CLEAN_KL.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              <p className="text-sm text-foreground/70">
                Đây chính là lý do phải đọc từng dòng thay vì chỉ nhìn nhãn: nếu nhà bạn chỉ kiêng
                Kim Lâu, thì với ca này bạn có thể yên tâm — thứ dính là Tam Tai, không phải thứ nhà
                bạn kiêng. Nếu ngược lại, công cụ gợi ý sẵn các năm không phạm gần nhất:{' '}
                <strong>{CASE_GOOD_YEARS.join(', ')}</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Ca 2 — mâu thuẫn ngược: Kim Lâu dính, Tam Tai sạch
              </h3>
              <p>
                Cô dâu sinh {CASE_CLEAN_TT.birthYear} ({CASE_CLEAN_TT.birthCanChi.name}) cưới năm{' '}
                {CASE_CLEAN_TT.targetYear} ({CASE_CLEAN_TT.targetCanChi.name}): tuổi mụ{' '}
                {CASE_CLEAN_TT.kimLau.ageMu}, chia {S.kimLauCycle} dư{' '}
                {CASE_CLEAN_TT.kimLau.remainder} → phạm <strong>{CASE_CLEAN_TT.kimLau.type}</strong>;
                trong khi năm {CASE_CLEAN_TT.tamTai.yearChi} không thuộc ba năm Tam Tai (
                {CASE_CLEAN_TT.tamTai.tamTaiChis.join(', ')}) của tuổi{' '}
                {CASE_CLEAN_TT.tamTai.birthChi} → <strong>Tam Tai sạch</strong>. Kết luận vẫn là{' '}
                <strong>{VERDICT_LABEL[CASE_CLEAN_TT.verdict]}</strong> — đối xứng hoàn toàn với ca
                trên, vì hai hạn đứng ngang nhau.
              </p>
              <p className="text-sm text-foreground/70">
                So sánh thêm để thấy phép gộp không cộng dồn: cùng cô dâu sinh {CASE_BOTH.birthYear}{' '}
                nhưng cưới năm {CASE_BOTH.targetYear} thì dính CẢ HAI (phạm{' '}
                {CASE_BOTH.kimLau.type} và Tam Tai) — vậy mà nhãn vẫn đúng bằng nhãn của ca chỉ dính
                một hạn: <strong>{VERDICT_LABEL[CASE_BOTH.verdict]}</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'con-bao-nhieu-nam-sach',
          tocLabel: 'Còn bao nhiêu năm sạch',
          heading: 'Cộng hết mọi điều kiện thì còn bao nhiêu phần trăm số năm “sạch”?',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là câu hỏi ít ai hỏi, mà lại quan trọng nhất. Bảng dưới{' '}
                <strong>quét bằng chính engine của công cụ</strong>, trên lưới {S.gridBirths} nhóm
                tuổi × trọn một chu kỳ {S.fullCycle} năm ({S.gridSize} trường hợp). Vì{' '}
                {S.fullCycle} là bội chung nhỏ nhất của nhịp Kim Lâu ({S.kimLauCycle} năm) và nhịp
                địa chi ({S.tamTaiCycle} năm), lưới này phủ trọn chu kỳ nên các tỉ lệ là{' '}
                <strong>chính xác, không phải ước lượng</strong>.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <Thead cols={['Nhà bạn kiêng tới đâu', 'Còn bao nhiêu % số năm “sạch”', 'Ghi chú']} />
                  <tbody>
                    {LADDER.map((row) => (
                      <tr key={row.rule} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 text-foreground">{row.rule}</td>
                        <td className="px-4 py-2 tabular-nums font-medium text-foreground">
                          {row.pct}%
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Hai dòng đầu là hai lựa chọn thay thế nhau — kiêng mỗi Kim Lâu, hoặc kiêng mỗi Tam
                Tai — nên đừng so hai dòng ấy với nhau. Từ dòng thứ ba trở xuống mới là bậc thang
                cộng dồn, và ở đó quy luật rất giản dị:{' '}
                <strong>mỗi điều kiện thêm vào chỉ có thể làm cửa hẹp lại</strong>. Cổng HOẶC đi một
                chiều — không có hạn nào “mở thêm” năm cho bạn. Vì thế nếu cộng đủ mọi thứ mà một
                gia đình có thể kiêng, kết cục gần như luôn là “năm nào cũng phạm gì đó”. Đó là số
                học, không phải điềm gở.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Vài con số để giữ đầu lạnh</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Xét riêng cô dâu theo đúng ngưỡng của công cụ,{' '}
                  <strong>{S.phamPct}% số năm bị gắn nhãn phạm</strong>. Số năm bị gắn nhãn ấy gần
                  như không đổi giữa các nhóm tuổi:{' '}
                  {S.phamMin === S.phamMax
                    ? `đúng ${S.phamMin}/${S.fullCycle} năm với cả ${S.gridBirths} nhóm tuổi`
                    : `dao động ${S.phamMin}–${S.phamMax} trên ${S.fullCycle} năm`}
                  . Nói cách khác, xét riêng nhãn “phạm” thì không có tuổi nào “đen” hơn tuổi nào —
                  còn số năm được gắn nhãn thuận thì vẫn chênh nhau đôi chút giữa các nhóm, như gạch
                  đầu dòng dưới đây.
                </li>
                <li>
                  Nhưng {S.phamFromOnePct}% số năm bị gắn nhãn phạm{' '}
                  <strong>chỉ dính đúng một hạn</strong> — chỉ {S.bothPct}% số năm dính cả Kim Lâu
                  lẫn Tam Tai. Đọc kỹ dòng lý do thì phần lớn nỗi lo teo lại.
                </li>
                <li>
                  Số năm “thuận” của từng nhóm tuổi nằm trong khoảng{' '}
                  <strong>
                    {S.thuanMin}–{S.thuanMax} trên {S.fullCycle} năm
                  </strong>
                  . Chuỗi năm liên tiếp không có năm thuận nào{' '}
                  <strong>dài nhất là {S.maxDrySpell} năm</strong>, và trong {S.window} năm tới trung
                  bình có <strong>{S.avgThuanInWindow} năm thuận</strong> — không cửa sổ{' '}
                  {S.window} năm nào trắng tay ({S.emptyWindowPct}%). Nói cách khác:{' '}
                  <strong>không ai phải hoãn cưới vô thời hạn</strong>.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Kết luận tỉnh táo: nếu kiêng đủ mọi hạn thì tỉ lệ năm “sạch” tụt xuống mức mà việc
                chờ đợi trở nên vô nghĩa. Cách dùng lành mạnh hơn là chọn{' '}
                <strong>đúng những hạn gia đình bạn thật sự coi trọng</strong>, rồi đọc dòng lý do
                tương ứng — thay vì để một phép HOẶC gộp hết mọi thứ quyết định thay bạn.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: phép tính này không nói được điều gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cần nói thẳng: cả ba hạn ở đây đều chỉ dùng <strong>năm sinh và năm cưới</strong>.
                Không giờ sinh, không lá số, không biết gì về hai con người cụ thể. Một phép chia và
                vài bảng tra chi năm thì không thể biết hai bạn có hợp nhau không.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Đây là <strong>phong tục để tham khảo</strong>, không phải quy luật tự nhiên. Các
                  bản truyền lại không ghi lý do gốc vì sao chọn đúng những hạn ấy, cũng không nói
                  hạn nào nặng hơn hạn nào.
                </li>
                <li>
                  Nó <strong>không phải điều kiện của một cuộc hôn nhân tốt</strong>. Những thứ thật
                  sự quyết định — tài chính, công việc, sức khoẻ, cách hai người xử lý bất đồng —
                  không có mặt trong phép tính.
                </li>
                <li>
                  Thứ quan trọng hơn mọi nhãn màu là{' '}
                  <strong>sự đồng thuận của hai gia đình và sự sẵn sàng của chính hai người</strong>.
                  Nếu tra tuổi chỉ làm hai họ căng thẳng thêm thì việc tra đã đi ngược mục đích của
                  nó.
                </li>
                <li>
                  Phạm hạn <strong>không phải điều cấm</strong>. Muốn theo tục thì cách nhẹ nhàng
                  nhất là lùi hoặc đẩy một hai năm; không theo thì cũng chẳng có gì phải “giải”.
                </li>
              </ul>
              <p>
                Về chuyện “giải hạn”: hieu.asia <strong>không bán lễ giải hạn</strong> và không cho
                rằng phải “giải” mới yên. Khi đã thấy kết luận chỉ là một phép HOẶC của vài quy ước,
                bạn sẽ thấy không có gì ở đó để giải — chỉ có một lựa chọn đơn giản là cưới năm này
                hay năm khác.
              </p>
              <p className="text-sm text-foreground/70">
                Và nếu năm đã chốt rồi, câu hỏi tiếp theo thường là chọn NGÀY. Đó là bài toán khác
                hẳn, có nguyên tắc riêng — xem{' '}
                <Link href="/learn/trach-cat" className="text-gold-700 underline-offset-4 hover:underline">
                  bài Trạch Cát (chọn ngày)
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <CuoiHoiWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <CuoiHoiRecall />,
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
                Muốn hiểu sâu từng hạn thay vì phần gộp? Đọc{' '}
                <Link href="/learn/kim-lau" className="text-gold-700 underline-offset-4 hover:underline">
                  bài Kim Lâu
                </Link>{' '}
                và{' '}
                <Link href="/learn/tam-tai" className="text-gold-700 underline-offset-4 hover:underline">
                  bài Tam Tai
                </Link>{' '}
                — mỗi bài có luật tính riêng, không suy ra được từ bài này. Muốn biết ngay năm định
                cưới của mình dính hạn nào?{' '}
                <Link href="/xem-tuoi-cuoi" className="text-gold-700 underline-offset-4 hover:underline">
                  Xem tuổi cưới miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/xem-tuoi-cuoi', label: 'Xem tuổi cưới' },
                    { href: '/kim-lau', label: 'Tra Kim Lâu theo năm sinh' },
                    { href: '/tam-tai', label: 'Tra Tam Tai' },
                    { href: '/xem-ngay/cuoi-hoi', label: 'Xem ngày cưới hỏi' },
                    { href: '/hop-tuoi', label: 'Hợp tuổi hai bạn' },
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
          children: <CuoiHoiChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

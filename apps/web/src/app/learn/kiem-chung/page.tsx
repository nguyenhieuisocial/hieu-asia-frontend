/**
 * Bài học /learn/kiem-chung — "Kiểm chứng một lời tiên đoán trước khi tin".
 *
 * GROUNDING — mọi con số về công cụ import từ ./_active-learning (một nguồn
 * duy nhất, xem GROUNDING đầy đủ ở đầu file đó): STEM_COUNT, HOA_COUNT,
 * PALACE_COUNT, ALL_CATEGORIES, FORECAST_COUNT, DEMO_*, CONTROL_*,
 * chanceAtLeast(), vnNumber(). KHÔNG gõ tay lại bất kỳ con số nào ở đây.
 *
 * PHẠM VI: hiệu ứng Barnum (vì sao lời chung chung nghe đúng) có bài riêng —
 * ở đây chỉ nhắc tên. So sánh hai lăng kính cũng có bài riêng, chưa link vì
 * trang chưa tồn tại.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import { CATEGORY_LABEL } from '@/lib/backtest/palace-map';
import {
  KiemChungFrame,
  KiemChungDepth,
  KiemChungRecall,
  KiemChungChecklist,
  KiemChungWhys,
  vnNumber,
  STEM_COUNT,
  HOA_COUNT,
  PALACE_COUNT,
  ALL_CATEGORIES,
  FORECAST_COUNT,
  DEMO_HITS,
  DEMO_RATE,
  DEMO_EVENTS,
  DEMO_WIN,
  DEMO_EXPECTED,
  DEMO_CHANCE_LABEL,
  CONTROL_CAREER,
  CONTROL_WEALTH,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤48 ký tự: root layout nối thêm " · hieu.asia" (12) và seo-guard chặn ở 60.
  title: 'Kiểm chứng một lời tiên đoán trước khi tin',
  // ≤160 ký tự.
  description:
    'Ba câu hỏi kiểm một lời tiên đoán: nó sai ở đâu thì biết, trúng hơn tỉ lệ nền bao nhiêu, và được ghi trước hay dựng lại sau khi đã biết kết quả.',
  alternates: { canonical: 'https://hieu.asia/learn/kiem-chung' },
};

const LINK = 'text-gold-700 underline-offset-4 hover:underline';
const TH = 'px-4 py-2.5 font-semibold text-foreground';
const TD = 'px-4 py-2 text-muted-foreground';

const Thead = ({ cols }: { cols: readonly string[] }) => (
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

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ hiển thị. Cố ý KHÔNG trùng 5 câu FAQ đã có trên /bang-chung (trang đó
// hỏi "Bằng Chứng là gì / có đoán được sự kiện không / sao tin được / cần gì /
// vì sao hỏi mất mát"). Bài này hỏi về KHÁI NIỆM đứng sau công cụ, dùng được
// cho mọi lời tiên đoán, không riêng lá số.
const FAQS = [
  {
    q: 'Khả sai (falsifiability) nghĩa là gì, nói ngắn gọn?',
    a: 'Một khẳng định khả sai là khẳng định mà bạn nêu TRƯỚC được ít nhất một quan sát có thể chứng minh nó sai. "Năm nay bạn có thể gặp biến động" không khả sai — tăng cũng đúng, giảm cũng đúng. "Thu nhập năm sau thấp hơn năm nay" thì khả sai — bảng lương cuối năm bác bỏ được ngay. Khả sai không có nghĩa là sai; nó chỉ là điều kiện để một câu đáng đem đi kiểm.',
  },
  {
    q: 'Vì sao phải so với tỉ lệ nền, không so với 0%?',
    a: `Vì hầu như mọi lời tiên đoán đều đúng phần nào đó một cách tự nhiên, chẳng cần ai đoán giỏi. Ví dụ minh hoạ (không phải số đo thật): một cung "sáng" khoảng ${vnNumber(DEMO_RATE * 100)}% số năm chỉ do cách các sao phân bố, không do đoán đúng. Trúng ${DEMO_WIN}/${DEMO_EVENTS} mốc ở mức nền đó thì số lần khớp kỳ vọng đã là ${vnNumber(DEMO_EXPECTED)} — nghĩa là gần như chưa nói được gì. Câu hỏi đúng luôn là "trúng hơn nền bao nhiêu lần", không phải "trúng bao nhiêu phần trăm".`,
  },
  {
    q: 'Ghi trước khác gì với nhìn lại quá khứ (hồi cứu)?',
    a: 'Nhìn lại quá khứ, bạn được chọn hai lần sau khi đã biết kết quả: chọn kể sự kiện nào và chọn coi nó ứng với dấu hiệu nào. Hai lần chọn ấy đủ làm phồng bất kỳ tỉ lệ trúng nào. Ghi trước cắt cả hai: khi lời tiên đoán đã nằm trên giấy kèm ngày tháng, chỉ còn hai kết cục — ứng hoặc không ứng — và cả hai phải được đếm.',
  },
  {
    q: 'Điều này có liên quan gì đến hiệu ứng Barnum không?',
    a: 'Có, nhưng là hai lớp khác nhau chồng lên nhau. Hiệu ứng Barnum nói về việc một câu MÔ TẢ TÍNH CÁCH mơ hồ khiến ai đọc cũng thấy đúng (xem bài riêng). Kiểm chứng nói về việc một lời TIÊN ĐOÁN có kiểm được hay không. Một lời tiên đoán mơ hồ thường vừa dính Barnum vừa không khả sai — hai vấn đề cộng dồn khiến nó nghe rất thuyết phục mà thực ra không nói gì.',
  },
  {
    q: 'Học xong điều này thì tôi nên tin ít hơn hay nhiều hơn vào lá số?',
    a: 'Không nhiều hơn, không ít hơn — mà có tiêu chuẩn rõ để phân biệt. Kiểm chứng đối xử với "trúng" và "trượt" như nhau, nên nó chặn cả việc tin bừa lẫn việc bác bừa. Một lá số cho bạn một góc nhìn để đặt câu hỏi; việc còn lại là kiểm bằng chính đời bạn, ghi trước vài dự báo, và đọc lại vài năm sau — kể cả phần trượt.',
  },
];

const JSONLD = [
  article({
    headline: 'Kiểm chứng một lời tiên đoán: khả sai, tỉ lệ nền, và ghi trước',
    description:
      'Ba câu hỏi để kiểm bất kỳ lời tiên đoán nào trước khi tin: nó khả sai không, trúng hơn tỉ lệ nền bao nhiêu, và được ghi trước hay dựng lại sau khi đã biết kết quả. Minh hoạ bằng cách công cụ Bằng Chứng của hieu.asia tính tỉ lệ nền.',
    url: '/learn/kiem-chung',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Kiểm chứng dự đoán', url: '/learn/kiem-chung' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Kiểm chứng một lời tiên đoán trước khi tin',
    description:
      'Học ba lớp kiểm chứng một lời tiên đoán: khả sai, tỉ lệ nền, và ghi trước thay vì hồi cứu — bộ lọc dùng được ở mọi lăng kính, kể cả của chính hieu.asia.',
    url: '/learn/kiem-chung',
  }),
];

export default function LearnKiemChungPage() {
  return (
    <LearnArticle
      eyebrow="PHẢN BIỆN · KHẢ SAI"
      title={
        <>
          Kiểm chứng{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            một lời tiên đoán
          </span>
        </>
      }
      standfirst={
        <>
          "Thấy đúng" là một cảm giác, không phải một phép kiểm. Bài này chỉ ba câu hỏi để phân
          biệt một lời tiên đoán trúng thật với một lời không thể sai — và cách công cụ Bằng
          Chứng dùng chính quá khứ của bạn để kiểm lá số Tử Vi.{' '}
          <Link href="/bang-chung" className={LINK}>
            Tự kiểm lá số của bạn →
          </Link>
        </>
      }
      readMeta="13 phút đọc · Cập nhật 2026 · Số liệu tính từ lib/backtest"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Kiểm chứng dự đoán' },
      ]}
      relatedLenses={relatedLearnLenses('kiem-chung')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Khai vài sự kiện đời thật đã xảy ra, công cụ tính lại lá số đúng như nó đứng ở từng năm đó và cho thấy có khớp hay không — kể cả phần trượt.',
        href: '/bang-chung',
        label: 'Mở công cụ Bằng Chứng',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <KiemChungFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Ba câu hỏi kiểm một lời tiên đoán',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Trước khi tin bất kỳ lời tiên đoán nào — lá số, lời thầy, dự báo thị trường —
                hỏi theo đúng thứ tự ba câu này. Thiếu một câu thì "thấy đúng" không còn là bằng
                chứng.
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  <strong>Điều gì sẽ chứng minh nó SAI?</strong> Đây là tính{' '}
                  <strong>khả sai</strong>. Trả lời được trong một câu thì lời đó đáng đem đi
                  kiểm. Không trả lời được — dù nghe hay tới đâu — thì nó chưa phải một khẳng
                  định, chỉ là một câu nghe hợp tai. Đây cũng là cơ chế đứng sau hiệu ứng{' '}
                  <strong>Barnum</strong> (bài riêng): câu càng mơ hồ càng khó khả sai, và càng
                  khó khả sai thì càng nhiều người thấy "đúng".
                </li>
                <li>
                  <strong>Nếu trúng thì trúng hơn tỉ lệ nền bao nhiêu?</strong> Một lời trúng
                  70% mà tự nó vốn xảy ra 70% thì không thêm được thông tin nào. Phải so với mức
                  ngẫu nhiên, không so với 0%.
                </li>
                <li>
                  <strong>Lời ấy được ghi trước hay dựng lại sau khi đã biết kết quả?</strong>{' '}
                  Nhìn lại quá khứ thì gần như lời nào cũng có vẻ khớp — không phải vì lời đó
                  giỏi, mà vì bạn được chọn sự kiện để kể sau khi đã sống qua chúng.
                </li>
              </ol>
              <p className="text-sm text-foreground/70">
                Ba câu hỏi này không riêng cho Tử Vi — chúng áp được cho bất kỳ lời tiên đoán
                nào, kể cả lời của chính hieu.asia. Phần dưới minh hoạ bằng cách công cụ{' '}
                <Link href="/bang-chung" className={LINK}>
                  Bằng Chứng
                </Link>{' '}
                trả lời cả ba câu cho lá số Tử Vi.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <KiemChungDepth />,
        },
        {
          id: 'ti-le-nen-that',
          tocLabel: 'Tỉ lệ nền thật',
          heading: 'Công cụ Bằng Chứng tính tỉ lệ nền thế nào',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Một lá số Tử Vi có <strong>{PALACE_COUNT} cung</strong>. Mỗi năm, can của năm đó
                phóng ra <strong>{HOA_COUNT} sao Tứ Hóa</strong> rơi vào {HOA_COUNT} cung khác
                nhau — nghĩa là mỗi năm luôn có sẵn vài cung đang "sáng", bất kể lá số nói gì. Tỉ
                lệ nền của một cung là: trong <strong>{STEM_COUNT} can năm</strong> (một chu kỳ
                đầy đủ), có bao nhiêu can khiến một sao Tứ Hóa rơi thẳng vào cung đó.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <Thead cols={['Bước', 'Con số', 'Ý nghĩa']} />
                  <tbody>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">Số can năm</td>
                      <td className={TD}>{STEM_COUNT}</td>
                      <td className={TD}>Mẫu số của tỉ lệ nền — một chu kỳ Tứ Hóa đầy đủ.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">Sao Tứ Hóa mỗi năm</td>
                      <td className={TD}>{HOA_COUNT}</td>
                      <td className={TD}>Số cung được "chiếu" tối đa trong một năm bất kỳ.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">
                        Ví dụ minh hoạ: mức nền "một nửa"
                      </td>
                      <td className={TD}>
                        {DEMO_HITS}/{STEM_COUNT} ≈ {vnNumber(DEMO_RATE * 100)}%
                      </td>
                      <td className={TD}>
                        Mức hay gặp — một lần "khớp" ở cung này gần bằng tung đồng xu.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Ở mức nền {vnNumber(DEMO_RATE * 100)}%, nếu bạn tự kiểm bằng{' '}
                <strong>{DEMO_EVENTS} sự kiện</strong>, số lần khớp <em>kỳ vọng</em> đã là{' '}
                <strong>{vnNumber(DEMO_EXPECTED)}</strong> — chỉ do ngẫu nhiên, chưa cần lá số nói
                đúng điều gì. Xác suất khớp từ <strong>{DEMO_WIN}/{DEMO_EVENTS}</strong> trở lên{' '}
                <strong>hoàn toàn do ngẫu nhiên</strong> là{' '}
                <strong>{DEMO_CHANCE_LABEL}%</strong> — khoảng một phần ba. Nghĩa là cứ ba người
                tự kiểm bằng {DEMO_EVENTS} mốc thì chừng một người sẽ thấy "{DEMO_WIN}/
                {DEMO_EVENTS} khớp" mà lá số chẳng cần nói đúng gì cả.
              </p>
              <p className="text-sm text-foreground/70">
                Toàn bộ ví dụ trên là <strong>số minh hoạ để dạy cách tính</strong>, không phải số
                đo thật của hieu.asia — site chưa công bố tỉ lệ trúng nào từ dữ liệu người dùng.
                Riêng phép tính "trúng ≥{DEMO_WIN}/{DEMO_EVENTS} do ngẫu nhiên" được tính tại chỗ
                bằng công thức nhị thức, không gõ tay.
              </p>
            </div>
          ),
        },
        {
          id: 'khoa-bang-doi-chung',
          tocLabel: 'Khoá bảng & đối chứng',
          heading: 'Khoá bảng lĩnh vực → cung, và cặp đối chứng âm',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Công cụ Bằng Chứng khai {ALL_CATEGORIES.length} lĩnh vực đời sống (
                {ALL_CATEGORIES.map((c) => CATEGORY_LABEL[c]).join(', ')}). Mỗi lĩnh vực được
                khoá cứng với một cung trong mã nguồn <em>trước khi</em> bạn khai sự kiện — hệ
                thống không được phép chọn cung sau khi đã thấy lá số. Đây là cách chặn{' '}
                <strong>lần chọn thứ hai</strong> của bẫy hồi cứu.
              </p>
              <p>
                Để tự kiểm luôn phép khoá này, công cụ còn giữ một{' '}
                <strong>cặp đối chứng âm</strong>: mỗi lĩnh vực thật được ghép cố định với một
                lĩnh vực khác không liên quan. Ví dụ: lĩnh vực{' '}
                <strong>{CONTROL_CAREER}</strong> có cặp đối chứng là chính nó ở một cung khác,
                và lĩnh vực <strong>{CONTROL_WEALTH}</strong> cũng vậy — nếu tỉ lệ khớp ở cặp đối
                chứng cao ngang cặp thật, đó là dấu hiệu phép chấm đang "khớp bừa" chứ không phải
                lá số nói đúng.
              </p>
              <p className="text-sm text-foreground/70">
                Khoá bảng chỉ chặn được lần chọn thứ hai. Lần chọn thứ nhất — bạn quyết định khai
                năm nào, sự kiện nào — vẫn còn nguyên, nên backtest bằng sự kiện quá khứ mãi mãi
                là hồi cứu. Vì vậy công cụ có thêm phần dự báo{' '}
                <strong>{FORECAST_COUNT} lĩnh vực</strong> cho vài năm tới và một sổ theo dõi
                đóng dấu ngày ghi — chỉ phần đó mới là ghi trước thật.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi "tại sao"',
          children: <KiemChungWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <KiemChungRecall />,
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
                Muốn kiểm chứng lá số của chính bạn?{' '}
                <Link href="/bang-chung" className={LINK}>
                  Mở công cụ Bằng Chứng →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/bang-chung', label: 'Bằng Chứng' },
                    { href: '/tu-kiem', label: 'Tự kiểm — Đừng tin mù' },
                    { href: '/la-so-tu-vi', label: 'Lá số Tử Vi' },
                    { href: '/methodology', label: 'Phương pháp luận' },
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
          children: <KiemChungChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

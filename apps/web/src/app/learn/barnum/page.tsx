/**
 * Bài học /learn/barnum — "Hiệu ứng Barnum: vì sao lời chung chung nghe đúng".
 *
 * GROUNDING — mọi số liệu import từ ./_active-learning (một nguồn duy nhất,
 * xem GROUNDING đầy đủ ở đầu file đó): FORER_YEAR, FORER_MEAN_LABEL,
 * TOOL_MEAN_LABEL, STATEMENT_COUNT, QUOTED. Trang đích /tu-kiem/page.tsx đã
 * đọc để đối chiếu — không đọc lại ở đây, chỉ trích qua QUOTED.
 *
 * PHẠM VI: cách kiểm chứng lá số bằng sự kiện quá khứ thật là bài Kiểm chứng
 * riêng — ở đây chỉ nhắc tên, không lấn nội dung.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  BarnumFrame,
  BarnumDepth,
  BarnumRecall,
  BarnumChecklist,
  BarnumWhys,
  FORER_YEAR,
  FORER_MEAN_LABEL,
  TOOL_MEAN_LABEL,
  STATEMENT_COUNT,
  QUOTED,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤48 ký tự: root layout nối thêm " · hieu.asia" (12) và seo-guard chặn ở 60.
  title: 'Hiệu ứng Barnum — vì sao lời mơ hồ thấy đúng',
  // ≤160 ký tự.
  description:
    'Hiệu ứng Barnum – Forer: một lời mô tả chung chung khiến ai đọc cũng thấy "đúng ghê". Thí nghiệm 1948, cold reading, và bốn phép tự kiểm dùng được ngay.',
  alternates: { canonical: 'https://hieu.asia/learn/barnum' },
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
// chữ hiển thị (chống cloaking). Cố ý KHÔNG trùng câu hỏi nào với trang công
// cụ /tu-kiem (trang đó không có khối FAQ nên không có gì để trùng), và
// KHÔNG trùng với bài Kiểm chứng (bài kia hỏi về khả sai/tỉ lệ nền, bài này
// hỏi về cơ chế khiến một câu MƠ HỒ nghe đúng).
const FAQS = [
  {
    q: 'Hiệu ứng Barnum khác gì hiệu ứng Forer?',
    a: `Cùng một hiện tượng, hai tên gọi từ hai góc. "Forer" gọi theo tên nhà tâm lý học Bertram Forer, người làm thí nghiệm năm ${FORER_YEAR}. "Barnum" mượn tên ông bầu gánh xiếc P. T. Barnum, gắn với ý "có một thứ cho tất cả mọi người". Hai cái tên chỉ cùng một cơ chế: lời mô tả càng mơ hồ thì càng nhiều người thấy đúng với riêng mình.`,
  },
  {
    q: 'Thí nghiệm Forer thực sự đo cái gì?',
    a: `Ông phát cho sinh viên một bài trắc nghiệm, rồi trả lại mỗi người một bản "phân tích tính cách riêng". Tất cả các bản đều giống hệt nhau, ghép từ một cuốn sách tử vi mua ở sạp báo. Sinh viên tự chấm độ chính xác trên thang tối đa 5 điểm, trung bình ra ${FORER_MEAN_LABEL}. Thí nghiệm không đo độ chính xác của bản mô tả — nó đo độ tin cậy của CẢM GIÁC "đúng", và cho thấy cảm giác đó gần như vô dụng khi câu chữ đủ mơ hồ.`,
  },
  {
    q: 'Vậy mọi lời luận giải tính cách đều vô giá trị?',
    a: 'Không, đó là kết luận vội theo hướng ngược lại. Hiệu ứng Barnum chỉ nói cảm giác "đúng ghê" không dùng làm bằng chứng được — nó không chứng minh nội dung của bất kỳ lời giải nào là sai. Một lời cụ thể, dám sai, có thể kiểm được vẫn có giá trị; thứ mất giá trị là niềm tin đặt trên cảm giác khớp mà không kiểm gì thêm.',
  },
  {
    q: 'Làm sao phân biệt một câu Barnum với một câu thật sự nói riêng về tôi?',
    a: 'Thử phép đảo ngược: viết lại câu theo nghĩa ngược hẳn rồi đọc lại. Nếu bản đảo nghe vẫn hợp lý — cả hai chiều đều có người gật — thì câu gốc không loại trừ điều gì, tức là một câu Barnum. Một câu thật sự cụ thể thì bản đảo sẽ nghe sai rõ rệt, vì chỉ một trong hai chiều đúng.',
  },
  {
    q: 'hieu.asia có tự nhận rủi ro dính hiệu ứng này không?',
    a: 'Có, và đó chính là lý do trang này tồn tại. Bài Học tự soi vào chính công cụ của site: câu càng cụ thể — có mốc thời gian, có ngưỡng, dám sai — thì càng đáng tin; câu càng mơ hồ thì càng cần nghi ngờ, bất kể nó đến từ đâu. Muốn kiểm một lời tiên đoán cụ thể (chứ không phải một mô tả tính cách) thì đó là chủ đề của bài Kiểm chứng.',
  },
];

const JSONLD = [
  article({
    headline: 'Hiệu ứng Barnum: vì sao một lời mô tả chung chung luôn thấy đúng',
    description:
      'Hiệu ứng Barnum – Forer khiến người đọc chấm một bản mô tả chung chung là "rất đúng với tôi". Bài này giải thích cơ chế, kể lại thí nghiệm Forer 1948, và trao bốn phép tự kiểm dùng được ngay với bất kỳ lời mô tả nào.',
    url: '/learn/barnum',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Hiệu ứng Barnum', url: '/learn/barnum' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Hiệu ứng Barnum — vì sao lời mơ hồ thấy đúng',
    description:
      'Học cơ chế khiến một lời mô tả mơ hồ nghe như viết riêng cho bạn: thí nghiệm Forer, thiên kiến xác nhận, cold reading, và bốn phép tự kiểm áp dụng được ngay.',
    url: '/learn/barnum',
  }),
];

export default function LearnBarnumPage() {
  return (
    <LearnArticle
      eyebrow="TÂM LÝ HỌC · HIỆU ỨNG FORER"
      title={
        <>
          Hiệu ứng{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">Barnum</span>
        </>
      }
      standfirst={
        <>
          Bạn đọc một lời luận giải và bật ra cảm giác "đúng ghê, sao biết hay vậy". Bài này chỉ
          bạn cảm giác đó thật ra đo cái gì — và trao bốn phép tự kiểm dùng được ngay, kể cả với
          lời của chính hieu.asia.{' '}
          <Link href="/tu-kiem" className={LINK}>
            Làm bài tự kiểm 1 phút →
          </Link>
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026 · Trích nguyên văn từ /tu-kiem"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Hiệu ứng Barnum' },
      ]}
      relatedLenses={relatedLearnLenses('barnum')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          `Đọc ${STATEMENT_COUNT} mô tả tính cách và tự chấm câu nào đúng với bạn — rồi xem vì sao gần như ai làm bài này cũng chấm điểm cao.`,
        href: '/tu-kiem',
        label: 'Làm bài Tự kiểm',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <BarnumFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Hiệu ứng Barnum là gì — và thí nghiệm gốc',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                <strong>Hiệu ứng Barnum – Forer</strong>: người ta chấm một bản mô tả tính cách{' '}
                <strong>chung chung</strong> là "rất đúng với tôi" khi tin rằng bản đó được viết
                riêng cho mình. Tên gọi mượn từ ông bầu gánh xiếc P. T. Barnum, gắn với ý "có một
                thứ cho tất cả mọi người"; tên khoa học lấy theo Bertram Forer, người làm thí
                nghiệm chứng minh nó năm {FORER_YEAR}.
              </p>
              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Thí nghiệm Forer ({FORER_YEAR})
              </h3>
              <p>
                Forer phát cho sinh viên một bài trắc nghiệm tính cách, rồi ít lâu sau trả lại mỗi
                người một bản "phân tích riêng". Sự thật:{' '}
                <strong>tất cả các bản đều giống hệt nhau</strong>, được ông ghép từ một cuốn sách
                tử vi mua ở sạp báo. Sinh viên tự chấm độ chính xác trên thang tối đa 5 điểm,
                trung bình ra <strong>{FORER_MEAN_LABEL}</strong> — gần như "rất đúng". Kết luận
                đúng không phải "sinh viên tâm lý học cả tin", mà là:{' '}
                <strong>cảm giác trúng không phân biệt được lời viết riêng với lời viết chung</strong>.
              </p>
              <p className="text-sm text-foreground/70">
                Trang <Link href="/tu-kiem" className={LINK}>Tự kiểm</Link> của hieu.asia dựng lại
                đúng thí nghiệm này với {STATEMENT_COUNT} câu, và làm tròn điểm trung bình thành{' '}
                {TOOL_MEAN_LABEL}/5 cho gọn hiển thị — cùng một con số, chỉ khác cách làm tròn.
              </p>
              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Soi hai câu thật trong bài Tự kiểm
              </h3>
              <p>
                Hai câu này minh hoạ rõ nhất vì sao công thức "chung chung" hiệu quả — đọc kỹ sẽ
                thấy chúng không loại trừ điều gì:
              </p>
              <blockquote className="border-l-2 border-gold/60 pl-4 text-sm italic text-foreground/80">
                Câu {QUOTED.s9.no}: "{QUOTED.s9.text}"
              </blockquote>
              <p className="text-sm text-foreground/70">
                Đây là <strong>mệnh đề hai mặt</strong>: dù bạn hướng ngoại hay hướng nội, câu này
                vẫn đúng, vì nó nói bạn là <em>cả hai</em>, "có lúc… lúc khác". Không cách trả lời
                nào bác bỏ được nó.
              </p>
              <blockquote className="border-l-2 border-gold/60 pl-4 text-sm italic text-foreground/80">
                Câu {QUOTED.s4.no}: "{QUOTED.s4.text}"
              </blockquote>
              <p className="text-sm text-foreground/70">
                Đây là <strong>lời khen an toàn</strong>: thừa nhận "có điểm yếu" (nghe như thành
                thật) rồi lập tức bù lại bằng "nhìn chung bạn biết cách bù đắp" (nghe như khen).
                Gần như ai cũng muốn tin phần sau.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <BarnumDepth />,
        },
        {
          id: 'bon-phep-tu-kiem',
          tocLabel: 'Bốn phép tự kiểm',
          heading: 'Bốn phép tự kiểm — dùng được ngay với bất kỳ lời mô tả nào',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Bốn phép này không cần kiến thức tâm lý học, chỉ cần một câu chữ đang đọc và vài
                phút. Áp được cho lời tử vi, lời trắc nghiệm tính cách, hay một lá bài Tarot.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <Thead cols={['Phép kiểm', 'Làm gì', 'Vì sao lộ được câu Barnum']} />
                  <tbody>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">1. Đảo ngược</td>
                      <td className={TD}>Viết lại câu theo nghĩa ngược hẳn rồi đọc lại.</td>
                      <td className={TD}>
                        Bản đảo vẫn nghe hợp lý → câu gốc không loại trừ điều gì.
                      </td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">2. Đưa cho người khác</td>
                      <td className={TD}>Đưa nguyên văn câu đó cho một người bất kỳ, hỏi có đúng không.</td>
                      <td className={TD}>Họ cũng gật → câu mô tả con người nói chung, không phải bạn.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 font-medium text-foreground">3. Viết trước</td>
                      <td className={TD}>
                        Trước khi đọc lời giải, viết ra điều bạn nghĩ nó SẼ nói và điều nó SẼ KHÔNG
                        nói.
                      </td>
                      <td className={TD}>
                        Chặn thiên kiến xác nhận: không còn cơ hội tự điền chi tiết sau khi đã biết.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-foreground">4. Hỏi loại trừ</td>
                      <td className={TD}>Tự hỏi: "câu này loại trừ được điều gì?"</td>
                      <td className={TD}>
                        Không trả lời được trong một câu → lời đó chưa mang thông tin.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Cả bốn phép đều quay về một ý: một lời đáng tin phải{' '}
                <strong>cụ thể tới mức dám sai</strong>. Muốn kiểm không chỉ một câu mô tả mà cả
                một lời tiên đoán có mốc thời gian — đó là chủ đề của bài{' '}
                <strong>Kiểm chứng dự đoán</strong> (đang viết, chưa có link).
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi "tại sao"',
          children: <BarnumWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <BarnumRecall />,
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
                Muốn thử ngay trên chính bạn?{' '}
                <Link href="/tu-kiem" className={LINK}>
                  Làm bài Tự kiểm 1 phút →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/tu-kiem', label: 'Tự kiểm — Đừng tin mù' },
                    { href: '/methodology', label: 'Phương pháp luận' },
                    { href: '/mbti', label: 'Trắc nghiệm MBTI' },
                    { href: '/enneagram', label: 'Trắc nghiệm Enneagram' },
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
          children: <BarnumChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

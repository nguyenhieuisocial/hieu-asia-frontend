import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage, itemList } from '@/lib/seo/jsonld';
import {
  BigFiveFrame,
  BigFiveDepth,
  BigFiveRecall,
  BigFiveChecklist,
  BigFiveWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Big Five (OCEAN): Trắc nghiệm tính cách | Học huyền học',
  description:
    'Big Five (OCEAN) là mô hình tính cách có cơ sở khoa học vững nhất, đo 5 chiều: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Nhạy cảm cảm xúc. Xu hướng, không phải nhãn cố định.',
  alternates: { canonical: 'https://hieu.asia/learn/big-five' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (Accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Vì sao Big Five được xem là "khoa học" nhất?',
    a: 'Năm chiều này không do ai "nghĩ ra" mà nổi lên từ phân tích thống kê hàng nghìn từ mô tả tính cách qua nhiều ngôn ngữ và nền văn hoá (lexical hypothesis). Chúng có độ ổn định và khả năng dự báo cao trong nghiên cứu, nên giới hàn lâm tin cậy hơn hẳn so với các bài phân loại "đóng hộp".',
  },
  {
    q: 'Khác MBTI ở chỗ nào?',
    a: 'MBTI xếp bạn vào 1 trong 16 "kiểu" cố định; Big Five cho bạn một điểm trên năm dải liên tục, gần thực tế hơn vì con người hiếm khi rơi gọn vào một hộp. Big Five cũng có nền thực nghiệm mạnh hơn. Hai góc nhìn bổ sung nhau: MBTI dễ chia sẻ, Big Five đo lường chính xác hơn.',
  },
  {
    q: '"Nhạy cảm cảm xúc" cao có phải điều xấu?',
    a: 'Không. Đây là một dải trung lập: đầu nhạy cảm giúp bạn tinh tế, đồng cảm, cảnh giác sớm với rủi ro; đầu ổn định giúp bạn điềm tĩnh dưới áp lực. Mỗi đầu hợp với những bối cảnh khác nhau. hieu.asia mô tả xu hướng, không gán tốt/xấu.',
  },
  {
    q: 'Cần lưu ý gì?',
    a: 'Điểm số là một lát cắt ở thời điểm làm bài, không cố định cả đời và có thể đổi theo giai đoạn. Hãy dùng kết quả để hiểu mình và tự quyết, không để dán nhãn hay phán xét. hieu.asia đọc Big Five như một góc nhìn, kết hợp với các lăng kính khác.',
  },
];

// 5 chiều OCEAN — mô tả 2 đầu của mỗi dải (không đầu nào "tốt/xấu" hơn).
const DIMENSIONS: { vi: string; en: string; high: string; low: string }[] = [
  {
    vi: 'Cởi mở',
    en: 'Openness',
    high: 'Tò mò, sáng tạo, thích ý tưởng và trải nghiệm mới.',
    low: 'Thực tế, ưa điều quen thuộc và đã được kiểm chứng.',
  },
  {
    vi: 'Tận tâm',
    en: 'Conscientiousness',
    high: 'Kỷ luật, có tổ chức, theo đuổi mục tiêu đến cùng.',
    low: 'Linh hoạt, tuỳ hứng, thoải mái với sự ngẫu hứng.',
  },
  {
    vi: 'Hướng ngoại',
    en: 'Extraversion',
    high: 'Năng động, thích giao tiếp, nạp năng lượng từ đám đông.',
    low: 'Trầm tĩnh, thích chiều sâu và không gian riêng.',
  },
  {
    vi: 'Dễ chịu',
    en: 'Agreeableness',
    high: 'Tin tưởng, đồng cảm, đặt sự hoà hợp lên trước.',
    low: 'Thẳng thắn, cạnh tranh, đặt logic trước cảm xúc.',
  },
  {
    vi: 'Nhạy cảm cảm xúc',
    en: 'Neuroticism',
    high: 'Nhạy cảm, dễ lo nghĩ, cảm xúc thay đổi nhanh.',
    low: 'Bình thản, ổn định, ít bị stress cuốn đi.',
  },
];

const JSONLD = [
  article({
    headline: 'Big Five (OCEAN): 5 chiều tính cách',
    description:
      'Big Five (OCEAN) là mô hình tính cách có cơ sở khoa học vững nhất, đo 5 chiều: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Nhạy cảm cảm xúc. Xu hướng, không phải nhãn cố định.',
    url: '/learn/big-five',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Big Five', url: '/learn/big-five' },
  ]),
  faqPage(FAQS),
  itemList(
    DIMENSIONS.map((d) => ({
      name: `${d.vi} (${d.en})`,
      url: `/learn/big-five/${d.en.toLowerCase()}`,
    })),
  ),
];

export default function LearnBigFivePage() {
  return (
    <LearnArticle
      eyebrow="Tây phương · Khoa học tính cách"
      title={
        <>
          Big Five: <span className="bg-gold-gradient bg-clip-text text-transparent">5 chiều tính cách</span>
        </>
      }
      standfirst={
        <>
          Big Five (OCEAN) là mô hình tính cách có cơ sở thực nghiệm vững nhất trong tâm lý học
          hiện đại. Năm chiều độc lập, mỗi chiều là một <em>dải liên tục</em>, không phải "ô đóng",
          không có đầu nào tốt hay xấu hơn, chỉ là thiên hướng tự nhiên của bạn.
        </>
      }
      readMeta="6 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Big Five' },
      ]}
      relatedLenses={relatedLearnLenses('big-five')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Trả lời bộ câu hỏi Big Five khoảng 4 phút để xem điểm của bạn trên 5 chiều, kèm một bản luận giải sâu cá nhân hoá: mô tả xu hướng, không phán định mệnh.',
        href: '/big-five',
        label: 'Làm trắc nghiệm Big Five',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <BigFiveFrame />,
        },
        {
          id: 'nam-chieu',
          tocLabel: 'Năm chiều (OCEAN)',
          heading: 'Năm chiều (OCEAN)',
          children: (
            <ul className="space-y-4">
              {DIMENSIONS.map((d) => (
                <li key={d.en} className="border-t border-border/60 first:border-0">
                  <Link
                    href={`/learn/big-five/${d.en.toLowerCase()}`}
                    className="group block rounded-lg py-4 transition hover:bg-card/40"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-base text-foreground group-hover:text-gold">
                        {d.vi}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {d.en}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ml-auto text-sm text-muted-foreground group-hover:text-gold"
                      >
                        →
                      </span>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <p className="text-sm leading-relaxed text-foreground/85">
                        <span className="font-medium text-gold-700">Cao · </span>{d.high}
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/85">
                        <span className="font-medium text-muted-foreground">Thấp · </span>{d.low}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <BigFiveDepth />,
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <BigFiveWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <BigFiveRecall />,
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
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
          children: <BigFiveChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}

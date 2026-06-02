import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from '@hieu-asia/ui';

export const metadata: Metadata = {
  title: 'Big Five (OCEAN) — Trắc nghiệm tính cách | Học huyền học',
  description:
    'Big Five (OCEAN) — mô hình tính cách có cơ sở khoa học vững nhất, đo 5 chiều: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Nhạy cảm cảm xúc. Xu hướng, không phải nhãn cố định.',
  alternates: { canonical: 'https://hieu.asia/learn/big-five' },
};

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

export default function LearnBigFivePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-gold">Trang chủ</Link>
        <span className="mx-1.5">/</span>
        <Link href="/learn" className="hover:text-gold">Học huyền học</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted-foreground">Big Five</span>
      </nav>

      <header className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
          Tây phương · Khoa học tính cách
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Big Five — <span className="bg-gold-gradient bg-clip-text text-transparent">5 chiều tính cách</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Big Five (OCEAN) là mô hình tính cách có cơ sở thực nghiệm vững nhất trong tâm lý học
          hiện đại. Năm chiều độc lập, mỗi chiều là một <em>dải liên tục</em> — không phải "ô đóng",
          không có đầu nào tốt hay xấu hơn, chỉ là thiên hướng tự nhiên của bạn.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
        <h2 className="mb-5 font-heading text-xl font-bold text-foreground">Năm chiều (OCEAN)</h2>
        <ul className="space-y-4">
          {DIMENSIONS.map((d) => (
            <li key={d.en} className="border-t border-border/60 pt-4 first:border-0 first:pt-0">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-base text-foreground">{d.vi}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {d.en}
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
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">Giải thích chi tiết</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="why-science" className="rounded border border-border px-4">
            <AccordionTrigger>Vì sao Big Five được xem là "khoa học" nhất?</AccordionTrigger>
            <AccordionContent>
              Năm chiều này không do ai "nghĩ ra" mà nổi lên từ phân tích thống kê hàng nghìn từ mô
              tả tính cách qua nhiều ngôn ngữ và nền văn hoá (lexical hypothesis). Chúng có độ ổn
              định và khả năng dự báo cao trong nghiên cứu — nên giới hàn lâm tin cậy hơn hẳn so với
              các bài phân loại "đóng hộp".
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="vs-mbti" className="rounded border border-border px-4">
            <AccordionTrigger>Khác MBTI ở chỗ nào?</AccordionTrigger>
            <AccordionContent>
              MBTI xếp bạn vào 1 trong 16 "kiểu" cố định; Big Five cho bạn một <em>điểm trên năm dải
              liên tục</em> — gần thực tế hơn vì con người hiếm khi rơi gọn vào một hộp. Big Five
              cũng có nền thực nghiệm mạnh hơn. Hai góc nhìn bổ sung nhau: MBTI dễ chia sẻ, Big Five
              đo lường chính xác hơn.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="neuroticism" className="rounded border border-border px-4">
            <AccordionTrigger>"Nhạy cảm cảm xúc" cao có phải điều xấu?</AccordionTrigger>
            <AccordionContent>
              Không. Đây là một dải trung lập: đầu nhạy cảm giúp bạn tinh tế, đồng cảm, cảnh giác
              sớm với rủi ro; đầu ổn định giúp bạn điềm tĩnh dưới áp lực. Mỗi đầu hợp với những bối
              cảnh khác nhau — hieu.asia mô tả xu hướng, không gán tốt/xấu.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="caution" className="rounded border border-border px-4">
            <AccordionTrigger>Cần lưu ý gì?</AccordionTrigger>
            <AccordionContent>
              Điểm số là một lát cắt ở thời điểm làm bài, không cố định cả đời và có thể đổi theo
              giai đoạn. Hãy dùng kết quả để hiểu mình và tự quyết — không để dán nhãn hay phán xét.
              hieu.asia đọc Big Five như một góc nhìn, kết hợp với các lăng kính khác.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section
        aria-labelledby="bigfive-cta-heading"
        className="mt-12 rounded-2xl border border-gold/25 bg-card/40 p-8 text-center"
      >
        <h2 id="bigfive-cta-heading" className="font-heading text-2xl font-bold text-foreground">
          Trải nghiệm ngay
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Trả lời bộ câu hỏi Big Five khoảng 4 phút để xem điểm của bạn trên 5 chiều, kèm một bản
          luận giải sâu cá nhân hoá — mô tả xu hướng, không phán định mệnh.
        </p>
        <div className="mt-6">
          <Button asChild size="lg"><Link href="/big-five">
            Làm trắc nghiệm Big Five
          </Link></Button>
        </div>
      </section>
    </main>
  );
}
